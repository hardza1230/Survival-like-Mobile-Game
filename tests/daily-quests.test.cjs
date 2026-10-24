// v8.0.20 Daily Quests: 10 ภารกิจ/วัน (ง่าย 4 · กลาง 4 · ท้าทาย 2) · กล่อง 3/6/8 ข้อ · เปลี่ยนฟรีวันละ 1 · Weekly 7 ช่อง · รางวัลกล่องไม่นับเป็นความคืบหน้า
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8'),a=src.indexOf('const DQ_POOL=['),b=src.indexOf('const POWER_TUNING=');
let day='2026-10-11',saves=0;const Save={data:{stageMastery:{}},save(){saves++;}};
const ctx={Save,localDayKey:()=>day,window:{},Math,Number,String,Date,Set};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';this.R={DQ_POOL,DQ_BOXES,DQ_BAND,DailyQ,dqPick,dqDef};',ctx);const {DailyQ,DQ_BOXES,dqPick,dqDef}=ctx.R;
const p1=dqPick(day);assert.equal(p1.length,10,'10 quests: '+p1);assert.deepEqual(dqPick(day),p1,'seeded');
assert.deepEqual(p1.map(id=>dqDef(id).b),[0,0,0,0,1,1,1,1,2,2],'4 easy / 4 medium / 2 hard');
for(const bb of [0,1,2]){const ks=p1.filter(id=>dqDef(id).b===bb).map(id=>dqDef(id).k);assert.equal(new Set(ks).size,ks.length,'no duplicate kind in a band');}
assert(!p1.some(id=>['e_chest','m_salv','m_dig'].includes(id)),'locked quests hidden before stage 1: '+p1);
assert(!p1.some(id=>id.startsWith('win_')),'no hero quest with one hero');
Save.data.stageMastery={0:true,1:true};Save.data.chars=['mint','cocoa'];const seen=new Set();for(let d=1;d<=28;d++)dqPick('2026-11-'+String(d).padStart(2,'0')).forEach(id=>seen.add(id));
assert(['e_chest','m_salv','m_dig'].every(id=>seen.has(id))&&[...seen].some(id=>id.startsWith('win_')),'unlocked + hero quests rotate in');
assert.equal(dqDef('win_mint').k,'win_mint');assert(/with /.test(dqDef('win_mint').name));
Save.data.stageMastery={};Save.data.chars=[];const q=DailyQ.data();assert.equal(q.quests.length,10);assert.equal(DailyQ.count(),0);assert(!DailyQ.claimable());
const ids=q.quests.map(x=>x.id);
const fin=i=>{const it=q.quests[i];it.p=dqDef(it.id).target;};fin(0);fin(1);assert.equal(DailyQ.count(),2);assert(!DailyQ.claimable());
DailyQ.tick('nope',3);DailyQ.tick(dqDef(ids[2]).k,0);DailyQ.tick(dqDef(ids[2]).k,-2);assert.equal(DailyQ.count(),2);DailyQ.tick(dqDef(ids[0]).k,5);assert.equal(q.quests[0].p,dqDef(ids[0]).target,'capped');
q.quests[2].p=dqDef(q.quests[2].id).target-1;DailyQ.tick(dqDef(q.quests[2].id).k,1);assert(DailyQ.count()>=3);assert(DailyQ.claimable(),'3 → small box');q.boxes[0]=1;for(let i=3;i<q.quests.length;i++)if(q.quests[i].p>=dqDef(q.quests[i].id).target)q.quests[i].p=0;assert(!DailyQ.claimable());
assert.equal(q.quests[0].p,dqDef(ids[0]).target,'capped');
// reroll: 1/day, same band, not a finished quest
assert.equal(DailyQ.reroll(0),false,'cannot reroll a finished quest');const b5=dqDef(ids[5]).b;assert.equal(DailyQ.reroll(5),true);assert.notEqual(q.quests[5].id,ids[5]);assert.equal(dqDef(q.quests[5].id).b,b5);assert.equal(DailyQ.reroll(6),false,'one free change a day');
for(let i=0;i<7;i++){const it=q.quests[i];it.p=dqDef(it.id).target;}q.quests[7].p=dqDef(q.quests[7].id).target-1;DailyQ.tick(dqDef(q.quests[7].id).k,1);assert(DailyQ.count()>=8);assert.deepEqual(DailyQ.week().days,[day],'8 done → week slot');
assert(DailyQ.claimable());q.boxes[1]=1;q.boxes[2]=1;assert(!DailyQ.claimable());
assert.deepEqual(DQ_BOXES.map(x=>x.n),[3,6,8]);
for(let d=12;d<=17;d++){day='2026-10-'+d;const qq=DailyQ.data();for(const it of qq.quests)DailyQ.tick(dqDef(it.id).k,99999);}
const w=DailyQ.week();if(w.days.length>=7){assert(DailyQ.weekReady());w.got=1;assert(!DailyQ.weekReady());}
day='2026-10-20';const q2=DailyQ.data();assert.notEqual(q2,q);assert.equal(DailyQ.count(),0,'new day resets');assert.deepEqual(q2.boxes,[0,0,0]);assert.equal(q2.rr,0);
DailyQ._mute=true;DailyQ.tick(dqDef(q2.quests[0].id).k,99999);DailyQ._mute=false;assert.equal(DailyQ.count(),0,'muted ticks ignored');
Save.data.dailyQ={day,quests:[{id:'kills',p:3}],boxes:[1,0,0]};assert.equal(DailyQ.data().v,2,'old save regenerated');
for(const m of ["DailyQ.tick('cards')","DailyQ.tick('clear')","DailyQ.tick('sugar'","DailyQ.tick('shards',shards)","DailyQ.tick(kind,n)","DailyQ.tick('elite')","DailyQ.tick('boss')","DailyQ.tick('unique')","DailyQ.tick('dash')","DailyQ.tick('kick')","DailyQ.tick('star3')","DailyQ.tick('chest')","DailyQ.tick('objective')","DailyQ.tick('win_'+g.character)"])assert(src.includes(m),'hook '+m);
assert(/  dqOpenBox\(i\)\{[\s\S]{0,200}q\.boxes\[i\]=1/.test(src),'box opens once');
assert(/DailyQ\._mute=true; try\{\s*const sug/.test(src),'box rewards do not count as quest progress');
console.log('Daily quests: 10/day by band, no duplicate kinds, unlock + hero gating, capped progress, boxes 3/6/8, 1 free reroll, weekly slots, day reset, muted rewards and game hooks passed');
