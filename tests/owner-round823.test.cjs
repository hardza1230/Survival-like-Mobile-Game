// v8.2.3 owner: Cocoa Titan single-target (A fist combo + C fault line) and Epic/Legend chest cinematic (C3).
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const T=vm.runInNewContext('class T{'+['titanFistTarget','titanFistCombo','titanFaultLine'].map(grab).join('\n')+'}; T',{Math,Sfx:{}});
const foe=(x,y,o={})=>({x,y,active:true,hp:100,body:{halfWidth:10},...o});
const mk=list=>{ const t=new T(),jobs=[],hits=[]; Object.assign(t,{player:{x:0,y:0,active:true},enemies:{children:{iterate:f=>list.forEach(f)}},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),cocoaLater:(d,f)=>jobs.push([d,f]),damage:(e,v)=>hits.push([e,v]),cocoaVisual(){},bpFx(){},screenShake(){},hitStop(){},fxOk:()=>false}); return {t,jobs,hits}; };
// A: two follow-up fists, boss first even with less HP
{ const mob=foe(50,0,{hp:900}),boss=foe(80,0,{hp:500,isBoss:true}),far=foe(900,0,{isBoss:true}); const {t,jobs,hits}=mk([mob,boss,far]); t.titanFistCombo(0,0,100,2,200);
  assert.deepEqual(jobs.map(j=>j[0]),[.2,.4]); jobs.forEach(j=>j[1]()); assert.equal(hits.length,2); assert(hits.every(h=>h[0]===boss&&h[1]===120),'boss takes 2 × 60%'); }
{ const g=foe(50,0,{isBoss:true,_phaseGateLocked:true}); const {t,jobs,hits}=mk([g]); t.titanFistCombo(0,0,100,1,100); jobs.forEach(j=>j[1]()); assert.equal(hits.length,0,'phase gate respected'); }
// C: fault line only for boss/mini just outside the pound (≤200 px past the edge)
{ const b=foe(250,0,{isBoss:true}); const {t,jobs,hits}=mk([b]); assert.equal(t.titanFaultLine(0,0,100,50),b); jobs[0][1](); assert.equal(hits[0][1],50*.6*1.4); }
{ const {t}=mk([foe(90,0,{isBoss:true})]); assert.equal(t.titanFaultLine(0,0,100,50),null,'inside the pound: already hit'); }
{ const {t}=mk([foe(400,0,{isBoss:true}),foe(200,0)]); assert.equal(t.titanFaultLine(0,0,100,50),null,'too far / not a boss'); }
assert(/if\(ti\)this\.titanFaultLine\?\.\(x,y,rr,power\);/.test(src)); assert(/this\.titanFistCombo\?\.\(x,y,r,lv,unit\*rm\);/.test(src));
// C3: chest cinematic only for Epic/Legend
{ const C=vm.runInNewContext('class C{'+grab('chestCine')+'}; C',{Math,Phaser:{BlendModes:{ADD:1}}}); const c=new C(); let n=0; c.add={}; c.chestCine('rare',{active:true},{}, {},()=>n++); c.chestCine('common',{active:true},{},{},()=>n++); assert.equal(n,2,'low tiers open at once'); }
assert(/this\.time\.delayedCall\(1150,\(\)=>this\.chestCine\(tier,chest,glow,status,\(\)=>\{/.test(src));
console.log('owner round 8.2.3 (Titan fist combo + fault line, Epic/Legend chest cinematic) passed');
