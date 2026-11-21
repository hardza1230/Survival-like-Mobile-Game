// v8.2.22 เจ้าของ: Hunt — ตัวพิเศษเดินมาปาขวดพิษแล้วหนี · พิษซ้อนตามจำนวนครั้งที่โดนปา (ไม่ใช่ตามเวลา) · การ์ดภารกิจพลิกช้าลง ยกโชว์ทีละใบ
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const K=src.match(/const [A-Z][A-Z0-9_]*=[^\n]*?GG_GOLD=[^\n]*?;(?=   \/\/)/)[0].replace(/^const /,'var ');
const ctx={Math,console,Sfx:{}};vm.createContext(ctx);vm.runInContext(K,ctx);vm.runInContext('class S{'+['huntThrowAI','huntCurseHit','tickHuntCurse','endHuntCurse','hitByFoe'].map(m).join('')+'};this.K=S;',ctx);
const shots=[];const sc=new ctx.K();Object.assign(sc,{stageIndex:2,player:{x:0,y:0,hp:100,maxhp:100,setTint(){},clearTint(){}},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),floatText(){},showBanner(){},tweens:{add(){}},add:{circle:()=>({setDepth(){return this}})},camWorld:x=>x,
  foeShot(x,y,a,sp,dmg){const b={active:true,dmg};shots.push(b);return b;},killFoe(b){b.active=false;},hurtPlayer(d){sc.hurt=(sc.hurt||0)+d;},huntTargetActive:()=>true,die(){sc.dead=true;}});
const e={x:250,y:0,scaleX:1,scaleY:1,setVelocity(){}};
for(let k=0;k<20;k++)sc.huntThrowAI(e,.1);assert.ok(e._hnPh==='wind'||e._hnPh==='flee','walks up and winds up');for(let k=0;k<8;k++)sc.huntThrowAI(e,.1);assert.strictEqual(shots.length,1,'throws one bottle');assert.ok(shots[0]._huntCurse);assert.strictEqual(e._hnPh,'flee','then runs away');
for(let k=0;k<29;k++)sc.huntThrowAI(e,.1);assert.strictEqual(e._hnPh,'approach','comes back after fleeing');
for(let k=0;k<50;k++)sc.tickHuntCurse(.1);assert.strictEqual(sc.player.hp,100,'no poison over time');
sc.hitByFoe(sc.player,shots[0]);assert.strictEqual(sc._huntStk,1,'a bottle hit stacks poison');sc.hitByFoe(sc.player,{active:true,dmg:5,_huntCurse:true});assert.strictEqual(sc._huntStk,2);
const hp0=sc.player.hp;for(let k=0;k<20;k++)sc.tickHuntCurse(.1);assert.ok(sc.player.hp<hp0,'stacks drain HP');for(let k=0;k<20;k++)sc.huntCurseHit();assert.strictEqual(sc._huntStk,ctx.HUNT_STK_MAX,'capped');
sc.huntTargetActive=()=>false;sc.tickHuntCurse(.1);assert.ok(!sc._huntCursed&&!sc._huntStk,'killing the elite cures');
assert.ok(!m('tickWaveObjective').includes("'Blink!'"),'no more blink-away');assert.ok(m('foeShot').includes('b._huntCurse=false;'),'pooled bullets reset');
const D=m('missionDealShow');assert.ok(D.includes('T(base+i*DEAL_SHOW_MS,')&&D.includes('scaleX:big,scaleY:big')&&!D.includes('info.setText('),'each card is lifted and flipped big (no description text since 8.2.46)');assert.ok(ctx.DEAL_SHOW_MS>=1200&&ctx.DEAL_BIG>=2);
console.log('Hunt 8.2.22: approach-throw-flee elite, poison stacks per bottle hit, cured on kill; slower deal showing each card passed');
