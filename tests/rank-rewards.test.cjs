// v8.0.22 Rank Rewards: ยศ 1–5 เลือก 1 จาก 2 (เปลี่ยนได้) · โบนัสอัตโนมัติตามยศ · ซ่อม/คืน Thread เซฟเก่า · Special Cores/Box Luck ถูกตัด
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const ctx={Save:null,Math,Number,Object};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const SPECIAL_CORES ='),src.indexOf('/* ---- ยศ (rank)'))+';this.R={RANK_REWARDS,SPECIAL_CORES,rankAutoBonus,rankRewardOpt,applySpecialCores};',ctx);
const {RANK_REWARDS,rankAutoBonus,applySpecialCores}=ctx.R;
assert.deepEqual(RANK_REWARDS.map(r=>r.r),[1,2,3,4,5]);assert(RANK_REWARDS.every(r=>r.opts.length===2));
const ids=RANK_REWARDS.flatMap(r=>r.opts.map(o=>o.id));assert.equal(new Set(ids).size,10);
assert(!ids.some(id=>/magnet|insight|treasure|boxLuck|greed|fortune/.test(id)),'no pickup/EXP/currency/box picks');
const m=n=>{const a=src.indexOf('  '+n+'('),b=src.indexOf('\n',a);return src.slice(a,b);};
const Save={data:{rank:0},save(){}};vm.runInContext('this.S={data:null,save(){},'+['rankPick','rankHas','setRankPick','rankUnpicked'].map(m).join('\n')+'};',ctx);const S=ctx.S;S.data=Save.data;ctx.Save=S;
assert.equal(S.setRankPick(1,'blink'),false,'locked until rank');S.data.rank=2;assert.equal(S.rankUnpicked(),2);
assert(S.setRankPick(1,'blink'));assert(!S.setRankPick(1,'revive'),'option must belong to that rank');assert(S.setRankPick(2,'revive'));assert(S.rankHas('revive'));assert.equal(S.rankUnpicked(),0);
assert(S.setRankPick(1,'signature'),'switch freely');assert(!S.rankHas('blink'));
const p={dashCdMul:1,uniqueCdMul:1,lowHpGuard:0};applySpecialCores(p);assert.equal(p.uniqueCdMul,.88);assert.equal(p.dashCdMul,1);
S.data.rank=1;const q={uniqueCdMul:1};applySpecialCores(q);assert.equal(q.uniqueCdMul,.88);assert(!S.rankHas('revive'),'rank 2 pick inactive below rank 2');
assert.deepEqual({...rankAutoBonus(3)},{sugar:.15000000000000002,cur:.15000000000000002});assert.equal(rankAutoBonus(20).sugar,.4);assert.equal(rankAutoBonus(20).cur,.25);
// migration + hooks
assert(/if\(!this\.data\._rrMig\)\{[\s\S]{0,400}c\.base\*n\*\(n\+1\)\/2[\s\S]{0,200}this\.data\.specialCores=\{\}[\s\S]{0,200}2:'revive'[\s\S]{0,40}this\.data\.rankPerks=\{\}/.test(src),'refund + revive carry-over');
assert(src.includes('this._reviveLeft=(Save.rankHas?.("revive")?1:0)+Save.gearReviveCount()'),'revive from rank reward');
assert(src.includes("this._boxLuckMul=1;")&&!src.includes('buildSpecialCores(){'),'Box Luck + Special Cores page removed');
assert(src.includes("if(target==='perks')return Save.rankUnpicked()>0;"),'badge on new rank');
console.log('Rank Rewards: 5 ranks × 2 picks, rank-gated + switchable, active picks applied, auto Sugar/currency bonus, refund migration, revive and badge passed');
