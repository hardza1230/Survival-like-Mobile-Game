// v8.2.45 เจ้าของอนุมัติใบ 92 ชุด B (ขวดพิษโยนโค้ง หลบได้) + ชุด C (โดมแสงรอบ Wisp แทนเส้นวงกลม · เลือดไหลนอกเขตเหมือนเดิม)
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const K=src.match(/const [A-Z][A-Z0-9_]*=[^\n]*?GG_GOLD=[^\n]*?;(?=   \/\/)/)[0].replace(/^const /,'var ');
const ctx={Math,console,Sfx:{}};vm.createContext(ctx);vm.runInContext(K,ctx);vm.runInContext('class S{'+['huntThrowAI','huntLob','huntLobLand','huntCurseHit','wispDome'].map(m).join('')+'};this.K=S;',ctx);
const G=()=>{const g={active:true,calls:[]};for(const k of ['clear','fillStyle','fillEllipse','lineStyle','strokeEllipse','fillCircle','strokeCircle','strokePoints','beginPath','arc','strokePath','setDepth','destroy'])g[k]=(...a)=>{g.calls.push(k);if(k==='destroy')g.active=false;return g;};return g;};
let tw=[];const sc=new ctx.K();Object.assign(sc,{state:'play',stageIndex:2,_artEpoch:1,player:{x:0,y:0,active:true,setTint(){},clearTint(){}},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),floatText(){},showBanner(){},
  tweens:{add(o){tw.push(o);}},add:{graphics:G,circle:()=>Object.assign(G(),{setStrokeStyle(){return this},setPosition(){return this},setRotation(){return this}})},camWorld:x=>x,realTex:()=>false,artFx:()=>null,burst(){},a12(){},
  foeShot(){throw new Error('no straight shot any more');},hurtPlayer(d){sc.hurt=(sc.hurt||0)+d;},huntTargetActive:()=>true});
const e={x:250,y:0,scaleX:1,scaleY:1,setVelocity(){}};
for(let k=0;k<40&&e._hnPh!=='flee';k++)sc.huntThrowAI(e,.1);assert.strictEqual(e._hnPh,'flee','threw and fled');
const fly=tw.find(o=>o.duration>=700);assert.ok(fly,'bottle flies ~0.85 s');
// ยืนอยู่ที่เดิม = โดน
fly.targets.k=.5;fly.onUpdate();fly.onComplete();assert.strictEqual(sc._huntStk,1,'standing in the mark = poisoned');assert.ok(sc.hurt>0);
// เดินออกจากเป้า = หลบได้
tw=[];sc.hurt=0;e._hnPh='wind';e._hnT=0;sc.huntThrowAI(e,.1);const f2=tw.find(o=>o.duration>=700);sc.player.x=120;f2.onComplete();assert.strictEqual(sc._huntStk,1,'walked out = dodged');assert.ok(!sc.hurt);
// ด่านจบระหว่างลอย = ไม่ตก
tw=[];e._hnPh='wind';e._hnT=0;sc.player.x=0;sc.huntThrowAI(e,.1);const f3=tw.find(o=>o.duration>=700);sc._artEpoch=2;f3.onComplete();assert.strictEqual(sc._huntStk,1,'no hit after the run ended');
// โดม Wisp
const g=G();sc.time={now:1000};sc.wispDome(g,{x:0,y:0},130,true);assert.ok(g.calls.includes('strokePoints')&&!g.calls.includes('strokeCircle'),'soft wobbly dome, no hard circle');
assert.ok(m('renderWispHUD').includes('this.wispDome(g,w,t.escortR,near)')&&!m('renderWispHUD').includes('g.strokeCircle(w.x,w.y,t.escortR)'));
assert.ok(m('tickPurifyWisp').includes("P.hp-=P.maxhp*.004*stk"),'bleed outside the zone stays (real damage)');
console.log('8.2.45: Hunt bottle lobbed with a ground mark (dodgeable), Wisp soft dome, bleed kept passed');
