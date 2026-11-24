// v8.2.4 owner: Capture the Zone → 🕳️ Hunger Crack. v8.2.44 owner: PoE-Abyss style — a long crack creeps slowly only while the hero stays near its tip,
// monsters trickle out along it, each hole streams monsters (clear them = loot), the last hole pours 3 waves + an Elite, then an Abyss chest. No numbers in the HUD.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const a=src.indexOf('const HC_SEGS='),b=src.indexOf('\n',src.indexOf('const EMERGE_MS='));
const Phaser={Math:{Clamp:(v,x,y)=>Math.max(x,Math.min(y,v)),FloatBetween:(x,y)=>(x+y)/2,Between:(x,y)=>Math.round((x+y)/2)}};
const ctx={Math,Phaser,Sfx:{},HC_HOLES:[.3,.55,.8,1]};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';this.C={HC_FINAL_STREAM,HC_SEGS,HC_CRAWL,HC_FOLLOW,HC_TRICKLE,HC_HOLE_N,HC_FINAL_WAVES,HC_FINAL_PER,HC_FINAL_MAX};class T{'+['hungerCrackAt0','hungerCrackAt','hungerCrackGlyph','tickHungerCrack','hungerCrackErupt','hungerCrackCrawlAt','hungerCrackHoleLoot','hungerCrackBrute'].map(grab).join('\n')+'}; this.T=T;',ctx);
const C=ctx.C; assert(C.HC_CRAWL[0]<=80&&C.HC_CRAWL[1]<=90,'slow creep'); assert(C.HC_SEGS[1]>C.HC_SEGS[0]&&C.HC_SEGS[0]>=10,'long crack, shorter in Ch1');
const mk=si=>{ const t=new ctx.T(),spawned=[],ev={done:0,completed:0,loot:0,emerge:0}; const pts=[{x:0,y:0},{x:600,y:0},{x:600,y:600}],cum=[0,600,1200];
  const holes=ctx.HC_HOLES.map((f,i)=>{const d=1200*f,q=t.hungerCrackAt0(pts,cum,d);return {d,x:q.x,y:q.y,open:false,stream:0,sT:0,pack:[],final:i===3};});
  t._crack={pts,cum,jag:[],L:1200,head:0,tip:{x:0,y:0},holes,hi:0,st:'wait',tag:'T',pack:[],packT:0,trT:1,fw:0,fwT:0,g:{active:false},hole:{active:false},end:pts[2]};
  Object.assign(t,{state:'play',player:{x:500,y:500},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),drawHungerCrack(){},hungerCrackDone(){ev.done++;},completeWaveObjective(){ev.completed++;},time:{now:0,delayedCall(){}},
    enemies:{countActive:()=>0},maxLive:60,spawnEnemy:(ty)=>{const e={active:true,type:ty,hp:100,scaleX:1,scaleY:1,setPosition(){},setScale(a){this.scaleX=a;},setTint(){}};spawned.push(e);return e;},spawnLoot:()=>{ev.drop=(ev.drop||0)+1;return null;},screenShake(){},spawnElite:()=>{const e={active:true,setPosition(){}};spawned.push(e);return e;},emergeFoe:()=>ev.emerge++,
    missionLootBurst:()=>ev.loot++,floatText(){},vfxHitRing(){},stageIndex:si});
  return {t,spawned,ev}; };
{ const {t,spawned,ev}=mk(7),o={progress:0,target:25,done:false},c=t._crack;
  t.tickHungerCrack(1,o); assert.equal(c.head,0,'waits while the hero is far');
  t.player={x:0,y:0}; t.tickHungerCrack(1,o); assert.equal(c.st,'run'); assert(Math.abs(c.head-C.HC_CRAWL[1])<1,'creeps at crawl speed');
  t.player={x:-900,y:-900}; const h0=c.head; t.tickHungerCrack(1,o); assert.equal(c.head,h0,'stops when the hero leaves'); assert.equal(c.st,'wait');
  const follow=()=>{ t.player={x:c.tip.x,y:c.tip.y}; t.tickHungerCrack(.25,o); };
  let n0=spawned.length; for(let i=0;i<20;i++)follow(); assert(spawned.length>n0,'monsters trickle out along the crack'); assert(ev.emerge>0,'they emerge, not pop');
  for(let i=0;i<200&&!c.holes[0].open;i++)follow(); assert(c.holes[0].open); assert.equal(c.holes[0].stream>0||c.holes[0].pack.length>0,true,'hole streams monsters');
  for(let i=0;i<60;i++)follow(); assert.equal(c.holes[0].pack.length,C.HC_HOLE_N[1],'hole released its whole stream'); assert.equal(ev.loot,0,'no loot until the hole is cleared');
  c.holes[0].pack.forEach(e=>e.active=false); follow(); assert.equal(ev.loot,1,'hole cleared → loot');
  for(let i=0;i<400&&c.st!=='final';i++)follow(); assert.equal(c.st,'final');
  for(let i=0;i<200&&!c.elite;i++){ t.tickHungerCrack(.25,o); } const F=c.holes[3]; assert(c.elite,'elite after the waves'); assert(F.pack.length>=C.HC_FINAL_WAVES*C.HC_FINAL_PER[1],'all final waves poured out'); assert(C.HC_FINAL_WAVES>=4&&C.HC_FINAL_PER[1]>=10,'many monsters (owner 8.2.48)'); assert(spawned.filter(e=>e.type==='tank').length>=4,'tanks mixed in + brute'); assert(c.brute&&c.brute.hp===300&&c.brute.scaleX>1.3,'Abyss Brute: big, 3x HP'); c.brute.active=false; t.tickHungerCrack(.1,o); assert.equal(ev.drop,1,'brute drops gear'); assert.equal(ev.completed,0);
  F.pack.forEach(e=>e.active=false); t.tickHungerCrack(.1,o); assert.equal(ev.done,1); assert.equal(ev.completed,1,'final cleared → complete'); assert(o.progress>0); }
{ const {t,ev}=mk(2),o={progress:0,target:25,done:false},c=t._crack; t.player={x:0,y:0}; t.tickHungerCrack(1,o); assert(Math.abs(c.head-C.HC_CRAWL[0])<1,'Ch1 slower'); c.st='final'; c.fw=0; c.elite=true; c.holes[3].pack=[{active:true,_hcTag:'T'}]; t.tickHungerCrack(C.HC_FINAL_MAX+1,o); assert.equal(ev.completed,1,'time fallback'); }
{ const {t,ev}=mk(7),o={progress:0,target:25,done:false},c=t._crack; c.st='final'; c.fw=0; c.elite=true; const F=c.holes[3]; F.pack=[1,2,3,4,5].map(()=>({active:true,_hcTag:'T'}));   // v8.2.79 owner: hangs at the end
  for(let i=0;i<10;i++)t.tickHungerCrack(1,o); assert.equal(ev.completed,0,'5 left → keep fighting');
  F.pack[0].active=F.pack[1].active=F.pack[2].active=false; for(let i=0;i<5;i++)t.tickHungerCrack(1,o); assert.equal(ev.completed,0,'≤2 left: wait 6s');
  t.tickHungerCrack(1.1,o); assert.equal(ev.completed,1,'≤2 stragglers for 6s → crack seals'); assert(F.pack.every(e=>e._hcTag!=='T'),'stragglers become normal foes'); }
assert(src.includes('holes=HC_HOLES.map(f=>{ const d=Math.min(L,Math.max(80,L*f))'),'holes always on the path');
{ const t=new ctx.T(); t._crack={holes:[{open:true},{open:true},{open:false},{open:false}]}; assert.equal(t.hungerCrackGlyph(0),'▰▰▱▱'); assert(!/\d/.test(t.hungerCrackGlyph(.3)),'no numbers'); }
assert(/if\(CAPTURE_CRACK\)\{o\.desc='[^']+';this\.spawnHungerCrack\(\);\}else this\.spawnCaptureZone\(\);/.test(src));
assert(/else if\(o\.type==='capture'&&this\._crack\)\{this\.tickHungerCrack\(dt,o\);/.test(src)); assert(/capture:\{emoji:'🕳️',name:'Hunger Crack'/.test(src));
assert(src.includes("'🎁 Abyss chest!'"),'abyss chest'); assert(/MISSION_WAVE_DUR=\{[^}]*capture:115/.test(src),'longer wave');
// emerge
assert(src.includes("if(this.emergeFoe)this.emergeFoe(e,this._emergeKind||'ground');"),'sigSpawnAt emerges');
assert(src.includes("if(e._emergeUntil){ if((this.time?.now||0)<e._emergeUntil){ e.setVelocity(0,0); return; } e._emergeUntil=0; }"),'frozen while emerging');
assert(src.includes("this._emergeKind='portal'; try{ for(let r=0;r<(mul||1);r++)"),'Herald gates use the portal');
console.log('Hunger Crack (PoE Abyss): slow creep near the tip, trickle, streaming holes + loot, 3 waves + elite + chest, emerge animation passed');
