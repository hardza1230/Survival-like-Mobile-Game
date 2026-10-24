const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
const a=src.indexOf('const LOGIN_CAL='),b=src.indexOf('const POWER_TUNING=');assert(a>0&&b>a);
let day='2026-10-01',sugar=0,thr=0,cur=0,muted=[];
const DailyQ={_mute:false};
const ctx={Math,localDayKey:()=>day,DailyQ,CURRENCY:[{key:'transmute',name:'Twist Cream',emoji:'🍦'}],
  Save:{data:{unlockedStage:0},save(){},addSugar:n=>{sugar+=n;muted.push(DailyQ._mute);},addThreads:n=>thr+=n,addCurrency:(k,n)=>cur+=n}};
vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.LC=LoginCal;this.CAL=LOGIN_CAL;',ctx);const L=ctx.LC;
assert.equal(ctx.CAL.length,7);assert.equal(ctx.CAL.map(r=>r.k).join(),'sugar,thread,cur,silver,thread,sugar,gold');
assert(L.ready());let r=L.claim();assert.equal(r.i,0);assert.equal(sugar,150);assert.equal(muted[0],true);assert(!L.ready());assert.equal(L.claim(),null);
day='2026-10-05';r=L.claim();assert.equal(r.i,1,'missed days do not reset');assert.equal(thr,20);
day='2026-10-06';r=L.claim();assert.equal(r.i,2);assert.equal(cur,3);
day='2026-10-07';r=L.claim();assert.equal(r.chest,'silver');
day='2026-10-08';L.claim();day='2026-10-09';ctx.Save.data.unlockedStage=10;r=L.claim();assert.equal(r.i,5);assert.equal(sugar,150+1200,'big sugar scales by chapter');
day='2026-10-10';r=L.claim();assert.equal(r.chest,'gold');day='2026-10-11';r=L.claim();assert.equal(r.i,0,'loops after day 7');
// game hooks
assert(src.includes("this.time?.delayedCall(700,()=>this.loginPopup?.());"));
assert(src.includes("isFree==='login'?'hub'"));
assert(!src.includes("'🎁 Login Reward'"),'Daily page keeps quests only');
assert(/if\(target==='daily'\)return \(typeof LoginCal!=='undefined'&&LoginCal\.ready\(\)\)/.test(src));
console.log('login calendar ok');
