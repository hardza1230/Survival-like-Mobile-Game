// v8.1.140 rewarded ads (LAUNCH_RULES rule 4): reward only after the ad was watched to the end; test ads during closed test; IAP hidden.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const a=src.indexOf("const ADMOB_APP_ID"),b=src.indexOf("const Store = {");
assert(a>0&&b>a,'AdManager block found');
const block=src.slice(a,b);
assert(/const ADS_TEST = true;/.test(block),'closed test uses Google test ads');
assert(/const IAP_ENABLED = false;/.test(block),'real-money purchases hidden');
assert(block.includes("ca-app-pub-6736744441157705/4748962358"),'real rewarded unit kept for launch');
const man=fs.readFileSync(path.join(__dirname,'..','scripts','set-android-landscape.mjs'),'utf8');
assert(man.includes("ca-app-pub-6736744441157705~4936664616")&&man.includes('com.google.android.gms.ads.APPLICATION_ID'),'manifest gets the AdMob app id');
assert(block.includes("ADMOB_APP_ID = 'ca-app-pub-6736744441157705~4936664616'"),'app id in sync with manifest script');
assert(JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).dependencies['@capacitor-community/admob'],'plugin in package.json');
function mk(script){ const L={},calls=[];
  const p={initialize:async o=>{calls.push(['init',o]);},requestConsentInfo:async()=>({status:'NOT_REQUIRED',isConsentFormAvailable:false,privacyOptionsRequirementStatus:'NOT_REQUIRED'}),
    addListener:(ev,f)=>{(L[ev]=L[ev]||[]).push(f);return Promise.resolve({remove(){L[ev]=(L[ev]||[]).filter(x=>x!==f);}});},
    prepareRewardVideoAd:async o=>{calls.push(['prep',o]);},showRewardVideoAd:()=>script((ev,x)=>(L[ev]||[]).slice().forEach(f=>f(x)))};
  const ctx={window:{Capacitor:{Plugins:{AdMob:p},isNativePlatform:()=>true}},setTimeout:(f,t)=>setTimeout(f,Math.min(t,5)),clearTimeout,Promise,console};
  vm.createContext(ctx);vm.runInContext(block+';this.AdManager=AdManager;',ctx);return {M:ctx.AdManager,calls};}
(async()=>{
  // watched to the end
  let t=mk(fire=>new Promise(r=>setTimeout(()=>{fire('onRewardedVideoAdShowed');fire('onRewardedVideoAdReward',{type:'coin',amount:1});r({type:'coin',amount:1});fire('onRewardedVideoAdDismissed');},1)));
  assert.strictEqual(await t.M.show(),'rewarded');
  assert.strictEqual(t.calls.find(c=>c[0]==='prep')[1].adId,'ca-app-pub-3940256099942544/5224354917','test unit while ADS_TEST');
  assert.ok(t.calls.find(c=>c[0]==='init')[1].initializeForTesting);
  // closed early: no reward
  t=mk(fire=>new Promise(r=>setTimeout(()=>{fire('onRewardedVideoAdShowed');fire('onRewardedVideoAdDismissed');r({});},1)));
  assert.strictEqual(await t.M.show(),'skipped');
  // no fill
  t=mk(()=>Promise.reject(new Error('no fill')));
  assert.strictEqual(await t.M.show(),'failed');
  // web: no plugin → demo path
  const ctx={window:{},setTimeout,clearTimeout,Promise};vm.createContext(ctx);vm.runInContext(block+';this.AdManager=AdManager;',ctx);
  assert.strictEqual(ctx.AdManager.hasRealAds(),false);
  // scene: only 'rewarded' pays out
  const g=src.slice(src.indexOf('  showRewardedAd(label,onReward){'),src.indexOf('  _playSimAd(label,onReward){'));
  assert(/if\(r==='rewarded'\)\{ onReward&&onReward\(\); return; \}/.test(g),'reward only after full watch');
  console.log('admob-rewarded ok');
})().catch(e=>{console.error(e);process.exit(1);});
