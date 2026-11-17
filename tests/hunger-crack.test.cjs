// v8.2.4 owner: Capture the Zone → 🕳️ Hunger Crack (PoE Abyss). Tip grows only while the hero stands near it; crawlers spawn on the opened part; reaching the hole completes the mission. No numbers in the HUD.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const HC=src.match(/const CAPTURE_CRACK=true,HC_NEAR=(\d+),HC_SEC=(\d+);/); assert(HC,'flag + tuning'); const NEAR=+HC[1],SEC=+HC[2];
const Phaser={Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),FloatBetween:(a,b)=>(a+b)/2,Between:(a,b)=>Math.round((a+b)/2)}};
const T=vm.runInNewContext('class T{'+['hungerCrackAt','hungerCrackGlyph','tickHungerCrack','hungerCrackCrawl'].map(grab).join('\n')+'}; T',{Math,Phaser,HC_NEAR:NEAR,HC_SEC:SEC,Sfx:{}});
const mk=()=>{ const t=new T(),spawned=[],ev={done:0,completed:0}; const pts=[{x:0,y:0},{x:300,y:0},{x:300,y:300}];
  t._crack={pts,cum:[0,300,600],jag:[],L:600,head:24,tip:{x:24,y:0},spawnT:2,g:{active:false},hole:{active:false},end:pts[2]};
  Object.assign(t,{state:'play',player:{x:24,y:0},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),drawHungerCrack(){},hungerCrackDone(){ev.done++;},completeWaveObjective(){ev.completed++;},
    enemies:{countActive:()=>0},maxLive:60,spawnEnemy:(k)=>{const e={setAlpha(){}};spawned.push(k);return e;},tweens:{add(){}},fxOk:()=>false});
  return {t,spawned,ev}; };
{ const {t}=mk(),o={progress:0,target:25,done:false}; assert.deepEqual(t.hungerCrackAt(450),{x:300,y:150}); assert.deepEqual(t.hungerCrackAt(9999),{x:300,y:300});
  t.tickHungerCrack(1,o); assert(t._crack.head>24,'grows while standing on the tip'); const h=t._crack.head; t.player={x:-500,y:-500}; t.tickHungerCrack(1,o); assert.equal(t._crack.head,h,'away: no growth, no regress');
  assert(o.progress>0&&o.progress<25); }
{ const {t,ev}=mk(),o={progress:0,target:25,done:false}; for(let i=0;i<SEC*4&&!ev.done;i++){ t.player={...t._crack.tip}; t.tickHungerCrack(.5,o); } assert.equal(ev.done,1,'hole opens'); assert.equal(ev.completed,1); assert.equal(o.progress,25); assert(SEC>=15&&SEC<=30,'~20 s of following'); }
{ const {t,spawned}=mk(),o={progress:0,target:25,done:false}; t._crack.spawnT=0; t.player={x:-900,y:0}; t.tickHungerCrack(.1,o); assert(spawned.length>=2,'crawlers spawn from the opened crack'); }
assert.equal(new T().hungerCrackGlyph(.5),'▰▰▰▱▱▱'); assert(!/\d/.test(new T().hungerCrackGlyph(.3)),'no numbers');
assert(/if\(CAPTURE_CRACK\)\{o\.desc=[^;]+;this\.spawnHungerCrack\(\);\}else this\.spawnCaptureZone\(\);/.test(src));
assert(/else if\(o\.type==='capture'&&this\._crack\)\{this\.tickHungerCrack\(dt,o\);/.test(src)); assert(/this\.clearHungerCrack\?\.\(\);for\(const k of \['_captureZone'/.test(src));
assert(/capture:\{emoji:'🕳️',name:'Hunger Crack'/.test(src));
console.log('Hunger Crack: tip grows only near the hero, no regress, crawlers, hole completes once, glyph HUD without numbers passed');
