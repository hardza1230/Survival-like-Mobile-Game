// v7.5 Daily Quests: 5 ภารกิจ/วัน · ข้อละ 20 แต้ม · กล่อง 40/70/100 · รีเซ็ตวันใหม่ · รางวัลกล่องไม่นับเป็นความคืบหน้า
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8'),a=src.indexOf('const DQ_POOL=['),b=src.indexOf('const POWER_TUNING=');
let day='2026-10-11',saves=0;const Save={data:{stageMastery:{}},save(){saves++;}};
const ctx={Save,localDayKey:()=>day,window:{},Math,Number,String,Date};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';this.R={DQ_POOL,DQ_BOXES,DQ_PTS,DailyQ,dqPick,dqDef};',ctx);const {DailyQ,DQ_BOXES,dqPick,dqDef}=ctx.R;
// วันเดียวกันได้ชุดเดิม · ไม่ปลดล็อก gear/dig ก็ไม่มีภารกิจนั้น
const p1=dqPick(day);assert.equal(p1.length,5);assert.deepEqual(p1.slice(0,2),['kills','clear']);assert.deepEqual(dqPick(day),p1);assert.equal(new Set(p1).size,5);
assert(!p1.some(id=>['gear','shards','dig'].includes(id)),'locked quests hidden: '+p1);
Save.data.stageMastery={0:true,1:true};const seen=new Set();for(let d=1;d<=28;d++)dqPick('2026-11-'+String(d).padStart(2,'0')).forEach(id=>seen.add(id));
assert(['gear','shards','dig'].every(id=>seen.has(id)),'unlocked quests rotate in');
Save.data.stageMastery={};const q=DailyQ.data();assert.equal(q.quests.length,5);assert.equal(DailyQ.pts(),0);assert(!DailyQ.claimable());
DailyQ.tick('kills',149);assert.equal(DailyQ.pts(),0);DailyQ.tick('kills',5);assert.equal(q.quests[0].p,150,'capped at target');assert.equal(DailyQ.pts(),20);
DailyQ.tick('nope',3);DailyQ.tick('clear',0);DailyQ.tick('clear',-2);assert.equal(DailyQ.pts(),20);
DailyQ.tick('clear',2);assert.equal(DailyQ.pts(),40);assert(DailyQ.claimable(),'40 pts → small box');
q.boxes[0]=1;assert(!DailyQ.claimable());
for(const it of q.quests)DailyQ.tick(it.id,dqDef(it.id).target);assert.equal(DailyQ.pts(),100);assert(DailyQ.claimable());q.boxes[1]=1;q.boxes[2]=1;assert(!DailyQ.claimable());
assert.deepEqual(DQ_BOXES.map(x=>x.pts),[40,70,100]);
// รางวัลกล่อง/ล็อกอินไม่นับเป็นความคืบหน้า
day='2026-10-12';const q2=DailyQ.data();assert.notEqual(q2,q);assert.equal(DailyQ.pts(),0,'new day resets');assert.deepEqual(q2.boxes,[0,0,0]);
DailyQ._mute=true;DailyQ.tick('kills',150);DailyQ._mute=false;assert.equal(DailyQ.pts(),0,'muted ticks ignored');
// ผูกกับเกมจริง
for(const m of ["DailyQ.tick('cards')","DailyQ.tick('clear')","DailyQ.tick('sugar'","DailyQ.tick('shards',shards)","DailyQ.tick('gear')","DailyQ.tick(kind,n)","DailyQ.tick('elite')","DailyQ.tick('boss')"])assert(src.includes(m),'hook '+m);
assert(/  dqOpenBox\(i\)\{[\s\S]{0,200}q\.boxes\[i\]=1/.test(src),'box opens once');
assert(/DailyQ\._mute=true; try\{\s*const sug/.test(src),'box rewards do not count as quest progress');
console.log('Daily quests: seeded 5/day, unlock gating, capped progress, 20 pts each, boxes 40/70/100 once, day reset, muted rewards and game hooks passed');
