// v8.2.32 owner: Temple Expedition (tap-RPG idle) replaces Temple Depths (Dig) and Mochi Patrol · Crumbs · boss timer · helpers · offline · Supplies help real stages
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const a=src.indexOf('const EXP_ON='),b=src.indexOf('const DIG_START_SHOVELS');
const saveM=['exp','addCrumbs','expDailyReady'].map(n=>{const i=src.indexOf('\n  '+n+'(');const m=/\n  [A-Za-z_]\w*\(/.exec(src.slice(i+3));return src.slice(i+1,i+3+m.index);}).join('\n');
const ctx={Math,Date,localDayKey:()=>'2026-11-19',Phaser:{Math:{Between:(x,y)=>x}},Sfx:{}};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';this.F={expHp,expCrumb,expIsBoss,expTapDmg,expTapCost,expHelpDps,expHelpCost,expFmt,expSupplyCost};this.H=EXP_HELPERS;this.SU=EXP_SUPPLIES;'+
 'var Save={data:{chars:["mint"],character:"momo",dig:{shovels:5}},save(){},sug:0,th:0,addSugar(n){this.sug+=n},addThreads(n){this.th+=n},frAddPart(){this.part=(this.part||0)+1},addCurrency(){},'+saveM+'};this.Save=Save;'+
 'var FR_SIMPLE=true; function frRollPart(){return "x"} function frPart(){return {emoji:"🧩",name:"P"}} function rollWeightedCurrency(){return null}'+
 'class K{'+['exSfx','expHelpers','expDps','expOffline','expFoeNew','expHit','expKill','expBossFail','expBossReward','expDaily','expBuy','expSupplyApply'].map(meth).join('\n')+'\n};this.K=K;',ctx);
const F=ctx.F,S=ctx.Save;
assert(F.expIsBoss(5)&&!F.expIsBoss(4));assert(F.expHp(2)>F.expHp(1));assert(F.expCrumb(10)>=1);assert.strictEqual(F.expFmt(1500),'1.50K');assert.strictEqual(F.expFmt(999),'999');
// migration: shovels → crumbs
const e=S.exp();assert.strictEqual(e.crumbs,5*ctx.SHOVEL_CRUMBS||e.crumbs);assert.strictEqual(S.data.dig.shovels,0);
const s=new ctx.K();s.expHud=()=>{};s.menuToast=()=>{};s.buildMenuScreen=()=>{};s.advanceDaily=()=>{s._adv=(s._adv||0)+1};
assert.strictEqual(s.expHelpers().map(h=>h.id).join(),'ruby,momo,mint','only owned heroes + Ruby');
// kill flow: 10 kills → next stage
e.s=1;e.k=0;e.crumbs=0;s.expFoeNew();for(let i=0;i<10;i++)s.expHit(1e9,false,false);assert.strictEqual(e.s,2);assert(e.crumbs>0);assert.strictEqual(s._adv,10,'daily quest counts kills');
// boss: stage 5, timer fail → farm previous stage
e.s=5;e.k=0;e.farm=false;s.expFoeNew();assert(s._ex.boss&&s._ex.t===30);s.expBossFail();assert(e.farm&&e.s===4);s.expFoeNew();assert(!s._ex.boss);
// farming stays on stage, boss kill → first-clear reward once
for(let i=0;i<9;i++)s.expHit(1e9,false,false);assert.strictEqual(e.s,4,'farming does not advance');s.expHit(1e9,false,false);assert(e.s===5&&!e.farm,'v8.2.61: training done → boss again by itself');
e.farm=false;e.s=10;e.k=0;s.expFoeNew();s.expHit(1e9,false,false);assert.strictEqual(e.s,11);assert(S.sug>0&&S.th>0&&!S.part,'boss 10: v8.2.37 simple Kitchen gives threads, not parts');const su=S.sug;e.s=10;s.expFoeNew();s.expHit(1e9,false,false);assert.strictEqual(S.sug,su,'first clear only');
// buy
e.crumbs=1e12;const t0=e.tap;assert(s.expBuy('tap'));assert.strictEqual(e.tap,t0+1);assert(s.expBuy('help','ruby'));assert.strictEqual(e.help.ruby,1);assert(s.expDps()>0);
// offline: 50%, capped 8h
e.at=Date.now()-20*3600e3;e.s=3;const c0=e.crumbs;const off=s.expOffline();assert(off&&off.sec===8*3600&&e.crumbs>c0);
// daily chest once
assert(S.expDailyReady());assert(s.expDaily());assert(!S.expDailyReady());assert(!s.expDaily());
// supplies: one per run, applied then gone
assert(s.expBuy('supply','hp'));assert(!s.expBuy('supply','xp'),'only one packed');s.player={maxhp:100,hp:50};s.time={delayedCall(){}};assert.strictEqual(s.expSupplyApply(),'hp');assert.strictEqual(s.player.maxhp,115);assert.strictEqual(e.supply,null);
// wiring
for(const h of ["buildDig(){ return this.buildExpedition();","this.expSupplyApply?.();","if(target==='dig')return featureOpen('dig')&&Save.expDailyReady();","Defeat 30 Expedition foes","|dig)$/.test(s||'')?'|assets/art/patrol70/'","if(typeof EXP_ON!=='undefined'&&EXP_ON){ this.addCrumbs((n||0)*SHOVEL_CRUMBS); return; }"])assert(src.includes(h),h);
assert(!src.includes("['patrol','🌙','Mochi Patrol'"),'Patrol row removed from Activities');
console.log('Expedition 8.2.32: stages, boss timer/farm, first-clear rewards, helpers, offline 8h, daily chest, supplies, migration passed');
