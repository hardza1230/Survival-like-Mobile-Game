// v8.2.30 owner (SCAMPER round 3B): Mission Atlas — one ⭐ pool, a 3-tier 1-of-2 tree for every mission, a cap that forces choices,
// Focus (x2 deck weight), free reset, unlocks after Chapter 2
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const a=src.indexOf('const MA_COST='),b=src.indexOf('const FLOAT_MAX=');
const ctx={Math,Save:{data:{stageMastery:{}},save(){}},WAVE_OBJECTIVES:{},storyCleared:()=>ctx._sc||0};vm.createContext(ctx);
vm.runInContext(src.match(/const HUNT_THROW_R=[^\n]*\n/)[0].replace(/^const /,'var ')+src.slice(a,b)+';this.TREE=MA_TREE;this.f={maTypes,maData,maUnlocked,maCap,maSpent,maFree,maFocusSlots,maFx,maPick,maReset,maToggleFocus};class K{'+['maActive','maSetup','maPay','maEarn'].map(meth).join('\n')+'\n};this.K=K;',ctx);
const F=ctx.f;for(const t of ctx.MC86_ORDER)ctx.WAVE_OBJECTIVES[t]={name:t};
assert.strictEqual(F.maTypes().length,23,'a tree for every mission');
assert(!F.maUnlocked()&&F.maCap()===0,'locked before Chapter 2');ctx._sc=10;assert(F.maUnlocked());assert.strictEqual(F.maCap(),15);ctx._sc=15;assert.strictEqual(F.maCap(),30);ctx.Save.data.delve={best:12};assert.strictEqual(F.maCap(),34);
// a full tree is 6 points × 23 = 138 > max cap 90 → must choose
assert(6*23>90);
const m=F.maData();m.pts=10;ctx._sc=10;ctx.Save.data.delve={best:0};
assert(!F.maPick('hunt',1,1),'tier 2 needs tier 1');assert(F.maPick('hunt',0,2));assert(F.maPick('hunt',1,1));assert.strictEqual(F.maSpent(),3);assert.strictEqual(F.maFree(),7);
assert(F.maPick('hunt',2,2));assert.strictEqual(F.maFree(),4);assert(!F.maPick('purge',2,1),'locked tier');assert(F.maPick('purge',0,1));assert(F.maPick('purge',1,1));assert.strictEqual(F.maFree(),1);assert(!F.maPick('purge',2,1),'out of points');
const fx=F.maFx('hunt');assert.strictEqual(fx.cur,1);assert(Math.abs(fx.hard-1.75)<1e-9&&Math.abs(fx.rw-2.16)<1e-9&&fx.star===1);
assert(F.maPick('hunt',1,1),'tap again removes');assert.deepStrictEqual(Array.from(m.nodes.hunt),[2,0,0],'removing tier 2 also removes tier 3');
F.maReset();assert.strictEqual(F.maSpent(),0);
// focus slots
assert.strictEqual(F.maFocusSlots(),0);assert(!F.maToggleFocus('hunt'));m.pts=20;assert(F.maToggleFocus('hunt'));assert(!F.maToggleFocus('purge'));assert(F.maToggleFocus('hunt'),'unfocus');
// in-stage
const s=new ctx.K();s.time={delayedCall(){}};s.showBanner=()=>{};m.pts=10;F.maPick('fill',0,1);F.maPick('fill',1,1);
const o={type:'fill',target:20};s.maSetup(o);assert.strictEqual(o.target,25);assert(Math.abs(o._maTime-1.15)<1e-9);
const o2={type:'fill',target:1};s.maSetup(o2);assert(o2.target===1&&o2._maTime<1.15,'tiny goals get less time instead');
const R0=Math.random;Math.random=()=>.99;assert(Math.abs(s.maPay(o)-1.35)<1e-9);assert.strictEqual(s.maPay(o),1,'paid once');Math.random=R0;
const p0=m.pts;s.maEarn(2);assert.strictEqual(m.pts,p0+2);s._inTutorial=true;s.maEarn(2);assert.strictEqual(m.pts,p0+2);
// hooks
for(const h of ['this.maSetup?.(o)','this.maPay?.(o)',"this.maEarn?.((1+(_ob?1:0))*(o._gold?2:1))",'(o._maTime||1)','(o._maRw||1)','bag=base.concat(base.filter(t=>fo.includes(t)))','buildMissionAtlas(top)'])assert(src.includes(h),h);
console.log('Mission Atlas 8.2.30: pool, cap, 23 trees, tiers in order, focus, reset, in-stage effects passed');
