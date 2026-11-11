const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
const data={bestiary:{}};const Save={data,kills:t=>data.bestiary[t]||0};
const ctx={Save,Math,Object,Set,String,RegExp};vm.createContext(ctx);
const a=src.indexOf('const BESTIARY_THRESHOLDS'),b=src.indexOf('\n/* ---- STAGES:');vm.runInContext(src.slice(a,b)+';this.X={BESTIARY,bestiaryTiers,bestiaryLv,BESTIARY_IDS,BEST_TIER_SUGAR,BEST_WEAK_MUL};',ctx);
const X=ctx.X;assert.equal(X.bestiaryTiers('basic').join(),'1,100,1000');assert.equal(X.bestiaryTiers('boss3').join(),'1,5,25');
for(const id of ['f5_ferment_sprout','f6_sporeling','f7_choir_moth','f8_seasonal_wisp','f9_root_choir_leech','f1_rotten_foam_spawn','f4_crown_oven_guard'])assert(X.BESTIARY_IDS.has(id),'C1-2..C2-5 field monsters: '+id);
assert(X.BESTIARY.every(m=>m.lore&&m.stage!=null),'every entry has a note and a stage');
data.bestiary.basic=1000;assert.equal(X.bestiaryLv('basic'),3);data.bestiary.boss0=4;assert.equal(X.bestiaryLv('boss0'),1);
// addKill pays per tier
const sv=src.slice(src.indexOf('  addKill(type){'),src.indexOf('return sugar; },',src.indexOf('  addKill(type){'))+15);const S2={data:{bestiary:{},sugar:0},save(){}};vm.runInContext('this.AK=function'+sv.trim().replace(/^addKill/,'').replace(/,$/,''),Object.assign(ctx,{}));
let got=0;for(let i=0;i<100;i++)got+=ctx.AK.call(S2,'basic');assert.equal(got,X.BEST_TIER_SUGAR[0]+X.BEST_TIER_SUGAR[1]);
// key + weakness
const C=vm.runInContext('(class{'+method('bestiaryKey')+'\n'+method('bestWeakMul')+'})',ctx),g=new C();g.stageIndex=5;
assert.equal(g.bestiaryKey({roleName:'Ferment Sprout'}),'f5_ferment_sprout');assert.equal(g.bestiaryKey({isBoss:true}),'boss5');
g.stageIndex=0;assert.equal(g.bestiaryKey({shooter:true,texture:{key:'x'}}),'shooter');
g._bestW=new Set(['basic']);assert.equal(g.bestWeakMul({texture:{key:'e_basic'}}),X.BEST_WEAK_MUL);assert.equal(g.bestWeakMul({fast:1,texture:{key:'e_fast'}}),1);
assert(method('condDmgMul').includes('this.bestWeakMul'),'weakness applied in damage');
assert(method('startStage').includes('this._bestW=new Set(BESTIARY.filter(m=>bestiaryLv(m.id)>=BEST_MAX_TIER)'),'weak spots refreshed each stage');
assert(src.includes("label:'New monsters discovered'")&&src.includes("()=>this.continueFromSummary(this._newSpecies[0])"),'summary link to the new monster');
assert(method('continueFromSummary').includes("this.menuScreen='bestiary'"));
console.log('Bestiary: 3 tiers (bosses 1/5/25), C1-2..C2-5 field species, notes, real +5% weak spot, summary New! link passed');

// v8.1.87 Memory Book: tiers give Memories, Codex levels raise the weak-spot bonus for that monster
{ assert.equal(vm.runInContext('MEMORY_TIER.join()',ctx),'1,2,4');data.codex={basic:3};assert.equal(vm.runInContext("codexLv('basic')",ctx),3);assert.equal(vm.runInContext("codexCost('basic')",ctx),4);
  g._bestW=new Set(['basic']);assert(Math.abs(g.bestWeakMul({texture:{key:'e_basic'}})-(X.BEST_WEAK_MUL+.09))<1e-9,'codex adds 3%/lv');data.codex={};
  const ak=src.slice(src.indexOf('  addKill(type){'),src.indexOf('return sugar; },',src.indexOf('  addKill(type){')));assert(/this\.data\.memories=\(this\.data\.memories\|0\)\+mem/.test(ak),'tiers pay Memories');
  const cu=method('codexUpgrade');assert(/bestiaryLv\(id\)<BEST_MAX_TIER/.test(cu)&&/Save\.data\.memories=have-c/.test(cu),'codex needs tier 3 and spends Memories');
  assert(src.includes("if(sel._cdxRect){ z.back=false;"),'codex button beats the close zone');
  console.log('Memory Book: tier Memories, Codex cost/levels, weak-spot bonus per Codex level passed'); }
