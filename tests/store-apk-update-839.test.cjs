// v8.3.9 Store-like test APK (appId .store): checks the live version.json and shows the download popup only when newer
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('game.js','utf8');
function method(name){let at=s.indexOf('  async '+name+'(');if(at<0)at=s.indexOf('  '+name+'(');const tail=s.slice(at+1),next=/\n  (?:async )?[A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,name);return s.slice(at,at+1+next.index);}
const consts=s.match(/const STORE_APK_URL = [^\n]+/)[0],ver=s.match(/function verNewer\([^\n]+/)[0];
assert(/releases\/download\/store-apk-latest\/mochi-mayhem-store-test\.apk/.test(consts));
assert(method('buildNews').includes('st?STORE_APK_URL:RELEASES_URL'),'Updates page downloads the Store APK in the Store app');
assert(method('checkApkUpdate').includes("/\\.store$/.test(info?.id||'')"),'store app id routes to the web version check');
async function run(remote,game,opts={}){
  const shown=[],ls={};const ctx={GAME_VERSION:game,localStorage:{getItem:k=>ls[k]??null,setItem:(k,v)=>{ls[k]=v;}},Date,
    fetch:async()=>opts.fail?{ok:false}:{ok:true,json:async()=>({version:remote})}};
  if(opts.skip)ls.mochi_apk_skip=remote+'|'+new Date().toDateString();
  vm.createContext(ctx);vm.runInContext(consts+'\n'+ver+'\nglobalThis.verNewer=verNewer;class G{async '+method('checkStoreApkUpdate').replace(/^\s*async /,'').replace(/\/\*[^]*?\*\/\s*$/,'')+'\n'+method('storeShowLoop').replace(/\/\*[^]*?\*\/\s*$/,'')+'\n'+method('storeUpdateTick').replace(/\/\*[^]*?\*\/\s*$/,'')+'}globalThis.G=G;',ctx);
  const g=new ctx.G();g._isStoreApp=true;g.state=opts.state||'menu';g.menuScreen=opts.screen;g.time={delayedCall:(ms,f)=>{g._later=f;}};g.showApkUpdate=(c,l,u)=>{shown.push([c,l,u]);g._apkOv={active:true};};g.buildNews=()=>{g._news=(g._news||0)+1;};
  await g.checkStoreApkUpdate();return {shown,g};
}
(async()=>{
  let r=await run('8.3.10','8.3.9');assert.equal(r.shown.length,1);assert.equal(r.shown[0][1],'8.3.10');assert(/store-test\.apk$/.test(r.shown[0][2]));
  r=await run('8.3.9','8.3.9');assert.equal(r.shown.length,0,'same version: no popup');
  r=await run('8.3.8','8.3.9');assert.equal(r.shown.length,0,'older web: no popup');
  r=await run('8.4.0','8.3.9',{skip:true});assert.equal(r.shown.length,0,'Later today: no popup');
  r=await run('8.4.0','8.3.9',{fail:true});assert.equal(r.shown.length,0,'offline: no popup');
  r=await run('8.4.0','8.3.9',{state:'play'});assert.equal(r.shown.length,0);r.g.state='menu';r.g._later();assert.equal(r.shown.length,1,'waits for the menu');
  // v8.3.14 popup wiped by a menu rebuild comes back on the Hub; not on other screens; Download/Later stops it
  r=await run('8.4.0','8.3.9');assert.equal(r.shown.length,1);r.g._later();assert.equal(r.shown.length,1,'popup still open: no duplicate');
  r.g._apkOv.active=false;r.g._later();assert.equal(r.shown.length,2,'wiped popup is shown again');
  r.g._apkOv.active=false;r.g.menuScreen='heroes';r.g._later();assert.equal(r.shown.length,2,'not on other screens');r.g.menuScreen='hub';r.g._later();assert.equal(r.shown.length,3,'back on the Hub');
  r.g._apkPending=null;r.g._apkOv.active=false;r.g._later();assert.equal(r.shown.length,3,'Download/Later stops the loop');
  r=await run('8.4.0','8.3.9',{screen:'news'});assert.equal(r.g._news,1,'Updates page redraws with the new version');assert.equal(r.shown.length,0,'no popup over the Updates page');
  // re-check throttle: Hub return ≥60 s, app resume ≥5 s
  let n=0;r.g.checkStoreApkUpdate=()=>{n++;};r.g._storeChkT=Date.now()-10000;r.g.storeUpdateTick();assert.equal(n,0,'Hub return within 60 s: no fetch');r.g.storeUpdateTick(true);assert.equal(n,1,'resume after 5 s: fetch');
  r.g._storeChkT=Date.now()-61000;r.g.storeUpdateTick();assert.equal(n,2,'Hub return after 60 s: fetch');
  console.log('Store APK update v8.3.14: popup re-shows after a rebuild, re-check on Hub/resume passed');
  console.log('Store APK update: newer web version → download popup, same/older/offline/Later skip, waits for menu passed');
})().catch(e=>{console.error(e);process.exit(1);});
