// v8.2.4 owner: Capture the Zone → 🕳️ Hunger Crack. v8.2.7 owner: real Abyss flow — touch the crack, it races by itself to the next hole; each hole bursts with monsters + loot; the last hole pours out a big pack; killing it completes the mission. No numbers in the HUD.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const HC=src.match(/const CAPTURE_CRACK=true,HC_NEAR=\d+,HC_SEC=\d+,HC_TOUCH=(\d+),HC_SPEED=(\d+),HC_HOLES=\[([^\]]+)\];/); assert(HC,'flag + tuning'); const TOUCH=+HC[1],SPEED=+HC[2],HOLES=HC[3].split(',').map(Number);
assert(SPEED>=350,'the crack runs fast'); assert.equal(HOLES.length,4); assert.equal(HOLES[3],1,'last hole at the end');
const Phaser={Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),FloatBetween:(a,b)=>(a+b)/2,Between:(a,b)=>Math.round((a+b)/2)}};
const T=vm.runInNewContext('class T{'+['hungerCrackAt0','hungerCrackAt','hungerCrackGlyph','tickHungerCrack','hungerCrackErupt','hungerCrackCrawl'].map(grab).join('\n')+'}; T',{Math,Phaser,HC_TOUCH:TOUCH,HC_SPEED:SPEED,HC_HOLES:HOLES,Sfx:{}});
const mk=()=>{ const t=new T(),spawned=[],ev={done:0,completed:0,loot:[]}; const pts=[{x:0,y:0},{x:600,y:0},{x:600,y:600}],cum=[0,600,1200];
  const holes=HOLES.map(f=>{const d=1200*f,q=t.hungerCrackAt0(pts,cum,d);return {d,x:q.x,y:q.y,open:false};});
  t._crack={pts,cum,jag:[],L:1200,head:0,tip:{x:0,y:0},holes,hi:0,st:'wait',tag:'T',pack:null,packT:0,g:{active:false},hole:{active:false},end:pts[2]};
  Object.assign(t,{state:'play',player:{x:500,y:500},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),drawHungerCrack(){},hungerCrackDone(){ev.done++;},completeWaveObjective(){ev.completed++;},time:{delayedCall(){}},
    enemies:{countActive:()=>0},maxLive:60,spawnEnemy:(k)=>{const e={active:true,setAlpha(){}};spawned.push(e);return e;},spawnElite:()=>{const e={active:true,setPosition(){}};spawned.push(e);return e;},tweens:{add(){}},fxOk:()=>false,
    missionLootBurst:(o,v)=>ev.loot.push(v),stageIndex:3});
  return {t,spawned,ev}; };
{ const {t,spawned,ev}=mk(),o={progress:0,target:25,done:false},c=t._crack;
  t.tickHungerCrack(1,o); assert.equal(c.st,'wait','nothing happens until the crack is touched'); assert.equal(c.head,0);
  t.player={x:0,y:0}; t.tickHungerCrack(.1,o); assert.equal(c.st,'run','touch → runs'); t.player={x:-900,y:-900};
  t.tickHungerCrack(.5,o); assert(c.head>=SPEED*.5-1,'keeps running without the hero');
  for(let i=0;i<10&&c.st==='run';i++)t.tickHungerCrack(.25,o); assert.equal(c.st,'wait','stops at the first hole'); assert(c.holes[0].open); assert.equal(c.head,c.holes[0].d);
  assert.equal(spawned.length,3,'first hole: 3 monsters'); assert.equal(ev.loot.length,1,'first hole: loot'); assert(o.progress>0&&o.progress<25);
  for(let h=1;h<4;h++){ t.player={...c.tip}; for(let i=0;i<20&&c.holes[h]&&!c.holes[h].open;i++)t.tickHungerCrack(.2,o); }
  assert.equal(c.st,'final'); assert(c.pack.length>=12,'last hole: big pack + elite'); assert.equal(ev.loot.length,4,'loot at every hole'); assert.equal(ev.completed,0,'not done while the pack lives');
  c.pack.forEach(e=>e.active=false); t.tickHungerCrack(.1,o); assert.equal(ev.done,1); assert.equal(ev.completed,1,'pack cleared → mission complete'); }
{ const {t,ev}=mk(),o={progress:0,target:25,done:false},c=t._crack; c.st='final'; c.pack=[{active:true,_hcTag:'T'}]; t.tickHungerCrack(36,o); assert.equal(ev.completed,1,'35 s fallback'); }
{ const t=new T(); t._crack={holes:[{open:true},{open:true},{open:false},{open:false}]}; assert.equal(t.hungerCrackGlyph(0),'▰▰▱▱'); assert(!/\d/.test(t.hungerCrackGlyph(.3)),'no numbers'); }
assert(/if\(CAPTURE_CRACK\)\{o\.desc='[^']+';this\.spawnHungerCrack\(\);\}else this\.spawnCaptureZone\(\);/.test(src));
assert(/else if\(o\.type==='capture'&&this\._crack\)\{this\.tickHungerCrack\(dt,o\);/.test(src)); assert(/this\.clearHungerCrack\?\.\(\);this\.clearCrownRoot\?\.\(\);for\(const k of \['_captureZone'/.test(src));
assert(/capture:\{emoji:'🕳️',name:'Hunger Crack'/.test(src));
console.log('Hunger Crack (Abyss): touch → runs to holes, holes burst with monsters + loot, last pack completes, glyph HUD passed');
