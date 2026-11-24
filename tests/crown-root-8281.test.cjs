// v8.2.81 owner: Lure the Crown Root was bland → SCAMPER 1–4: escalation + split, pull + combo, perfect dodge, stuck crown head finale.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); if(src.startsWith('\n  }',k))k+=4; return src.slice(i+3,k); };
const cm=src.match(/const CR_ESC_SPD=[^;]+;/)[0];
const T=vm.runInNewContext(cm+'class T{'+['crownRootHead','spawnCrownRoot','clearCrownRoot','crownRootSplit','tickCrownRoot','crownRootTickHead','crownRootStrike','crownRootFinale','crownRootFinTick','destroyWaveObjectiveNode'].map(grab).join('\n')+' drawCrownRoot(){} }; T',{Math,Sfx:{},Phaser:{Math:{Between:(a)=>a}}});
const G=()=>({active:true,setDepth(){return this;},clear(){},destroy(){this.active=false;},lineStyle(){return this;},beginPath(){},moveTo(){},lineTo(){},strokePath(){},arc(){}});
const mk=(prog=0)=>{ const t=new T(),ev={done:0,smashed:0,hurt:0,stop:[]},anchors=[{x:300,y:0,active:true,_lure:true,_waveObjectiveNode:true,setActive(){return this;},setVisible(){}}],mobs=[];
  Object.assign(t,{state:'play',stageIndex:6,sugarStage:0,sugarRun:0,player:{x:300,y:0},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),floatText(){},screenShake(){},hitStop:ms=>ev.stop.push(ms),burst(){},screenFlash(){},captureFinishSweep(){},showBanner(){},emergeFoe(){},renderWaveObjectiveHUD(){},
    hurtPlayer:()=>ev.hurt++,damage:(e,d)=>{e.hp-=d;if(e.hp<=0)e.active=false;},completeWaveObjective:()=>ev.done++,camWorld:o=>o,add:{graphics:G},objectivePosition:()=>({x:900,y:0}),
    enemies:{getChildren:()=>mobs},waveNodes:{children:{iterate:f=>anchors.forEach(f)}},time:{now:0},tweens:{killTweensOf(){}},
    spawnEnemy:()=>{const e={active:true,hp:100,maxhp:100,scaleX:1,scaleY:1,setPosition(){},setScale(){},setTint(){}};mobs.push(e);return e;}});
  const o={type:'breakRoots',done:false,progress:prog,target:3}; t.waveObjective=o; t.spawnCrownRoot(o); return {t,ev,anchors,mobs,o}; };
// (1) escalation: faster + shorter warning after stones break; locks quickly (no 4 s wait)
{ const a=mk(0),b=mk(2); a.t.player=b.t.player={x:2000,y:0}; a.t.tickCrownRoot(.5,a.o); b.t.tickCrownRoot(.5,b.o); assert(b.t._lure.x-900>(a.t._lure.x-900)*1.3,'faster after 2 stones');
  for(let i=0;i<30&&a.t._lure.st==='burrow';i++)a.t.tickCrownRoot(.1,a.o); assert.equal(a.t._lure.st,'warn'); assert(a.t._lure.t<.2); 
  b.t._lure.st='burrow'; b.t._lure.t=3; b.t.tickCrownRoot(.01,b.o); assert(Math.abs(b.t._lure.warn-.66)<1e-9,'warning .9 → .66 at 2 stones'); }
// (2) pull + combo, (3) perfect dodge, (1) split after the 2nd stone
{ const {t,ev,mobs,o}=mk(1); t.player={x:300,y:0}; const L=t._lure; L.x=300; L.y=0; t.tickCrownRoot(.01,o); assert.equal(L.st,'warn');
  for(let i=0;i<3;i++)mobs.push({active:true,hp:20,maxhp:20,x:300+130,y:0,setVelocity(vx){this.vx=vx;}}); t.tickCrownRoot(.01,o); assert(mobs[0].vx<0,'warning circle pulls monsters in');
  mobs.forEach(m=>m.x=330); L.t=L.warn-.2; t.tickCrownRoot(.01,o); assert(L.close,'hero inside at the end of the warning'); t.player={x:500,y:0}; L.t=L.warn; t.tickCrownRoot(.01,o);
  assert.equal(L.st,'strike'); assert.equal(ev.hurt,0); assert.equal(L.hold,1.6,'perfect dodge: root stuck longer'); assert(ev.stop.includes(140),'slow-mo'); assert(mobs.every(m=>!m.active),'root kills pulled monsters');
  assert.equal(t.sugarRun,3+3,'perfect +3 and combo ×3'); assert.equal(o.progress,2); assert.equal(t._lure.heads.length,2,'2nd stone → root splits'); }
// (4) last stone → stuck crown head; sugar every 10%; dies → complete
{ const {t,ev,anchors,mobs,o}=mk(2); t.destroyWaveObjectiveNode(anchors[0]); assert.equal(o.progress,3); assert.equal(ev.done,0,'finale instead of instant complete'); const F=t._lure.fin,e=F.e; assert(e._crownHead&&e._timeStop&&e.hp===600);
  e.hp=290; t.tickCrownRoot(.1,o); assert.equal(F.pops,5,'5 pops at 48% hp'); assert.equal(ev.done,0); e.hp=0; e.active=false; t.tickCrownRoot(.1,o); assert.equal(F.pops,10); assert.equal(ev.done,1); assert(o._crownFinDone); assert.equal(t._lure,null); }
{ const {t,ev,anchors,o}=mk(2); t.destroyWaveObjectiveNode(anchors[0]); const e=t._lure.fin.e; for(let i=0;i<90;i++)t.tickCrownRoot(.1,o); assert.equal(ev.done,1,'8 s timeout completes'); assert(!e._timeStop&&!e.active,'head bursts'); }
console.log('Crown Root 8.2.81: escalation/split, pull+combo, perfect dodge, stuck-head finale passed');
