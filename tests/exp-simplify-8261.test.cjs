// v8.2.61 owner: Expedition asked too much tapping → hero fights on its own, boss retries itself, one-button Upgrade all, Supplies refill themselves.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const a=src.indexOf('const EXP_ON='),b=src.indexOf('const DIG_START_SHOVELS');
const saveM=['exp','addCrumbs','expDailyReady'].map(n=>{const i=src.indexOf('\n  '+n+'(');const m=/\n  [A-Za-z_]\w*\(/.exec(src.slice(i+3));return src.slice(i+1,i+3+m.index);}).join('\n');
const ctx={Math,Date,localDayKey:()=>'2026-11-22',Phaser:{Math:{Between:(x,y)=>x}},Sfx:{}};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';this.F={expTapDmg,expTapCost,expHelpDps,expHelpCost,expSupplyCost,MAX:EXP_UPALL_MAX};'+
 'var Save={data:{chars:["mint"],character:"momo"},save(){},addSugar(){},addThreads(){},addCurrency(){},'+saveM+'};this.Save=Save;var FR_SIMPLE=true;'+
 'class K{'+['exSfx','expHelpers','expDps','expUpgradeAll','expSupplyRefill','expOffline','expFoeNew','expHit','expKill','expBossFail','expBossReward','expBuy','expSupplyApply'].map(meth).join('\n')+'\n};this.K=K;',ctx);
const F=ctx.F,S=ctx.Save,e=S.exp(),s=new ctx.K();s.expHud=()=>{};let toast='';s.menuToast=t=>toast=t;s.buildMenuScreen=()=>{};
// 1) hero fights on its own: DPS > 0 with no helpers, grows with Hero Power
e.help={};e.tap=1;const d1=s.expDps();assert(d1>0,'hero auto DPS');e.tap=10;assert(s.expDps()>d1);
// offline works with only the hero
e.at=Date.now()-3600e3;e.s=1;e.crumbs=0;assert(s.expOffline(),'offline from hero alone');
// 2) boss fail → train 10 → boss again with no button
e.s=5;e.k=0;e.farm=false;s.expFoeNew();s.expBossFail();assert(e.farm&&e.s===4&&/Training/.test(toast));for(let i=0;i<10;i++)s.expHit(1e12,false,false);assert(!e.farm&&e.s===5);s.expFoeNew();assert(s._ex.boss,'boss again');
// 3) Upgrade all: spends to best value, never below 0, stops when broke
e.tap=1;e.help={};e.crumbs=5000;const got=s.expUpgradeAll();assert(got&&e.crumbs>=0);const cheapest=Math.min(F.expTapCost(e.tap),...s.expHelpers().map(h=>F.expHelpCost(h,e.help[h.id]|0)));assert(e.crumbs<cheapest,'spent until nothing affordable');
assert(Object.values(got).reduce((x,y)=>x+y,0)<=F.MAX);assert(s.expDps()>d1);e.crumbs=0;assert.strictEqual(s.expUpgradeAll(),null,'nothing to buy');
// 4) Supplies refill themselves after a stage uses them
e.supply=null;e.supplyAuto=null;e.best=1;e.crumbs=1e6;assert(s.expBuy('supply','xp'));assert.strictEqual(e.supplyAuto,'xp');
s.player={xpMul:1};s.time={delayedCall(){}};assert.strictEqual(s.expSupplyApply(),'xp');assert.strictEqual(e.supply,null);
const c0=e.crumbs;assert.strictEqual(s.expSupplyApply(),'xp','next stage: refilled and used');assert(e.crumbs===c0-F.expSupplyCost(e.best));
e.crumbs=0;assert.strictEqual(s.expSupplyApply(),null,'no Crumbs → no supply');e.supplyAuto=null;e.crumbs=1e6;assert.strictEqual(s.expSupplyRefill(),null,'auto off');
// UI wiring
for(const h of["'⬆ Upgrade all'","'exp_upall'","this.expSupplyRefill(); const T=","'Hero Power · Lv '"])assert(src.includes(h),h);
assert(!src.includes("'exp_boss'")&&!src.includes("'⚔️ Fight Boss'"),'Fight Boss button gone');
console.log('Expedition simplify 8.2.61: hero auto DPS, boss auto retry, Upgrade all, Supplies auto refill passed');
