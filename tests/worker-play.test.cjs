// v8.1.70 เจ้าของ: คนทำงาน → Sweep (ด่าน 3 ดาว) + Mochi Patrol (เปิดทิ้งไว้) · ต้องได้น้อยกว่าเล่นเองเสมอ
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const SWEEP_DAY='),b=src.indexOf('function featureOpen(t){');
const ctx={Save:{data:{}},localDayKey:()=>'2026-11-10'};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';Object.assign(this,{SWEEP_DAY,SWEEP_CUT,PATROL_CUT,PATROL_DAY_MIN,sweepRecord,sweepOk,sweepLeft,sweepReward,patrolStage,patrolRate,patrolUsed});',ctx);
const d=ctx.Save.data;
ctx.sweepRecord(0,300);ctx.sweepRecord(0,200);assert.strictEqual(d.sweepRef[0],300,'keeps best');
assert.ok(!ctx.sweepOk(0),'needs 3 stars');d.stageStars={0:7,1:3};assert.ok(ctx.sweepOk(0));assert.ok(!ctx.sweepOk(1));
const r=ctx.sweepReward(0);assert.strictEqual(r.sugar,150);assert.ok(r.sugar<300&&r.exp<75,'sweep < play');
assert.strictEqual(ctx.sweepLeft(),5);d.sweep={day:'2026-11-10',n:5};assert.strictEqual(ctx.sweepLeft(),0);d.sweep={day:'2026-11-09',n:5};assert.strictEqual(ctx.sweepLeft(),5,'resets daily');
ctx.sweepRecord(4,800);assert.strictEqual(ctx.patrolStage(),4);const pr=ctx.patrolRate();assert.ok(pr.sugar*8<800*0.5,'patrol per run-length < sweep < play');
assert.strictEqual(ctx.PATROL_DAY_MIN,240);
for(const m of ['sweepBtn','sweepRun','menuGiveExp','patrolData','patrolTick','patrolCollect','patrolFps','patrolStop','buildPatrol','patrolHud','patrolDimOn'])assert.ok(src.includes('\n  '+m+'('),m);
assert.ok(src.includes("sweepRecord(this.stageIndex,")&&src.includes("else if(s==='patrol')this.buildPatrol();")&&src.includes("if(this._patrolOn&&this.menuScreen!=='patrol')this.patrolStop();")&&src.includes("['patrol','🌙','Mochi Patrol'"));
assert.ok(/patrolTick\(\)\{[^\n]*Math\.min\(2000/.test(src),'hidden time does not count');
console.log('Worker play: Sweep needs 3 stars, pays 50% of best real run, 5/day reset; Patrol 40%/min, 240 min/day, visible-only, hooks passed');
