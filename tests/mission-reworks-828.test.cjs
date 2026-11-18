// v8.2.8 owner: duplicate missions reworked — Lure the Crown Root (lure a burrowing root into 3 anchor stones), Seed Rift (pull + catch seed carriers), Clear the Fog (poison fog, fresh-air bubble)
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
// Crown Root: burrow → warn → strike; strike next to an anchor smashes it, a miss does not
const T=vm.runInNewContext('class T{'+['tickCrownRoot','crownRootStrike','clearCrownRoot'].map(grab).join('\n')+' drawCrownRoot(){} }; T',{Math,Sfx:{}});
const mk=()=>{ const t=new T(),smashed=[],hurt=[],anchors=[{x:300,y:0,active:true,_lure:true,_waveObjectiveNode:true}];
  Object.assign(t,{state:'play',stageIndex:9,player:{x:300,y:0},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),floatText(){},screenShake(){},hitStop(){},burst(){},screenFlash(){},captureFinishSweep(){},hurtPlayer:d=>hurt.push(d),damage(){},
    enemies:{getChildren:()=>[]},waveNodes:{children:{iterate:f=>anchors.forEach(f)}},destroyWaveObjectiveNode:n=>{n.active=false;smashed.push(n);},
    _lure:{x:0,y:0,st:'burrow',t:0,tx:0,ty:0,trail:[],g:{active:false}}});
  return {t,smashed,hurt,anchors}; };
{ const {t,smashed,hurt}=mk(),o={done:false}; t.waveObjective=o; for(let i=0;i<40&&t._lure.st==='burrow';i++)t.tickCrownRoot(.1,o); assert.equal(t._lure.st,'warn','root reaches the hero and warns');
  assert.equal(t._lure.tx,300); for(let i=0;i<10&&t._lure.st==='warn';i++)t.tickCrownRoot(.1,o); assert.equal(t._lure.st,'strike'); assert.equal(smashed.length,1,'strike next to the anchor smashes it'); assert.equal(hurt.length,1,'hero standing there gets hurt');
  for(let i=0;i<10&&t._lure.st==='strike';i++)t.tickCrownRoot(.1,o); assert.equal(t._lure.st,'burrow','burrows again'); }
{ const {t,smashed}=mk(),o={done:false}; t.waveObjective=o; t.player={x:-400,y:0}; t._lure.x=-380; for(let i=0;i<30&&t._lure.st!=='strike';i++)t.tickCrownRoot(.1,o); assert.equal(smashed.length,0,'a strike far from stones misses'); }
assert(/o\.target=3;o\.desc='A crown root burrows after you[^;]*;this\.spawnRootAnchors\(o\.target\);this\.spawnCrownRoot\?\.\(o\);/.test(src));
assert(/n\._lure\)return;/.test(src),'standing next to a lure anchor does not sever it');
assert(/else if\(o\.type==='breakRoots'&&this\._lure\)\{ this\.tickCrownRoot\(dt,o\);/.test(src)&&/this\.clearCrownRoot\?\.\(\);/.test(src));
// Seed Rift: pull + carriers; only carriers count
assert(/o\.target=8; o\.desc='The rift pulls you in/.test(src));
assert(/e\._seedCarrier=S\.tag; e\._goTo=\{x:S\.x,y:S\.y\}/.test(src),'carriers walk to the rift');
assert(/S\.seeds\+\+; S\.pull=Math\.min\(170,S\.pull\+20\)/.test(src),'fed seeds pull harder');
assert(/if\(e\._seedCarrier!==S\.tag\)return;[^}]*o\.progress=Math\.min\(o\.target,o\.progress\+1\)/.test(src),'only carriers count');
assert(/for\(const e of S\.carriers\|\|\[\]\)if\(e&&e\._seedCarrier===S\.tag\)\{ e\._seedCarrier=null; e\._goTo=null;/.test(src),'carriers released on clear');
// Clear the Fog
assert(/cleanAir:\{emoji:'🫧',name:'Clear the Fog'/.test(src)&&/rt\.fill\(0x1b2410/.test(src)&&/'msn71_bubble',0\)/.test(src));
assert(/breakRoots:\{emoji:'🐛',name:'Lure the Crown Root'/.test(src));
console.log('Mission reworks 8.2.8 passed');
