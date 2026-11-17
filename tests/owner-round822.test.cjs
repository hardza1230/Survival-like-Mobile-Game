// v8.2.2 owner round (C1 C2 C4 C5 C6 E1 + Combat Meter source for delayed Cocoa hits).
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
// C1 title login buttons raised
assert(/y1=Math\.min\(ty-6,h-bh\*2-gap-70\)-Math\.round\(h\*\.09\)/.test(src),'title buttons raised ~9%');
// C2 Momo shot audible
assert(/playFile\('sfx_strawberry_soft_shot',0\.34\)/.test(src),'Momo shot volume');
// C5 Bazaar group keeps one track
{ const m=grab('menuMusic'); assert(/const BZ=\['bazaar','wardrobe','tradein'\]/.test(m)); assert(/const key=\{patrol:/.test(m),'rest of menuMusic still runs (no inline // swallowing code)');
  const calls=[]; const T=vm.runInNewContext('class T{'+m+'}; T',{window:{},Sfx:{playMainBgm(){}}}); const t=new T(); Object.assign(t,{state:'menu',menuScreen:'wardrobe',storyMusicPlay:(k,v)=>calls.push([k,v()]),storyMusicStop(){}});
  t.menuMusic('wardrobe'); assert.deepEqual(calls[0],['bgm_a04_bgm_bazaar',true]); t.menuScreen='tradein'; assert.equal(calls[0][0],'bgm_a04_bgm_bazaar'); }
// C6 spore blast stronger + rings
assert(/dmg=dmg\?\?Math\.round\(this\.arenaDmg\(b\)\*2\.4\)/.test(src)); assert(/this\.arenaFogBlastRings\?\.\(b,color,q\.pocket\)/.test(src)); grab('arenaFogBlastRings');
// C4 shadows strike while bleeding outside the Wisp ring
assert(/w\._bleedT=0; this\.escortShadowStrike\?\.\(P,w,stk\);/.test(src)); grab('escortShadowStrike');
// Combat Meter: delayed Cocoa jobs keep their source
{ const T=vm.runInNewContext('class T{'+grab('cocoaLater')+'}; T',{}); const t=new T(); t.basicAttack={path:'titan'}; t._mxSrc='unique'; t.cocoaLater(.3,()=>{}); assert.equal(t._cocoaJobs[0].src,'unique'); }
assert(/this\._mxSrc=j\.src\?\?ps;try\{j\.fn\(\);\}finally\{this\._mxSrc=ps;\}/.test(src));
console.log('owner round 8.2.2 (title buttons, Momo shot, Bazaar music, spore blast, Wisp shadows, Cocoa meter source) passed');
