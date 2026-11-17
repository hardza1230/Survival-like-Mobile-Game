// v8.1.152 Unique wind-up: tap Uniques crouch + gather for 170 ms, then cast once; charged releases (noWind) and Momo Sniper skip it; a pause during the wind-up cancels.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const S=vm.runInNewContext('class S{'+grab('useCharacterSkill')+'\n'+grab('uniqueWindup')+'}; S',{Math,Sfx:{},Save:{data:{settings:{}}}});
const mk=()=>{ const s=new S(),q=[]; let casts=0; Object.assign(s,{state:'play',uniqueCd:0,character:'mint',player:{x:0,y:0,active:true},basicAttack:{path:'glacier'},uniqueInfo:()=>({color:1}),
  useCharacterSkillNow(){ casts++; },time:{delayedCall:(ms,f)=>q.push([ms,f])},camWorld:o=>o,add:{circle:()=>({setStrokeStyle(){return this;},setDepth(){return this;},destroy(){}})},tweens:{add(){}},screenShake(){}}); return {s,q,n:()=>casts}; };
{ const t=mk(); t.s.useCharacterSkill(); assert.equal(t.n(),0,'not yet'); assert.equal(t.s._uqWind,true); assert(t.s._sqX>1&&t.s._sqY<1,'crouch');
  t.s.useCharacterSkill(); assert.equal(t.q.length,1,'double tap ignored'); assert.equal(t.q[0][0],170); t.q[0][1](); assert.equal(t.n(),1,'cast after wind-up'); assert(t.s._sqY>1,'stretch on release'); assert.equal(t.s._uqWind,false); }
{ const t=mk(); t.s.useCharacterSkill(true); assert.equal(t.n(),1,'charged release casts at once'); assert.equal(t.q.length,0); }
{ const t=mk(); t.s.character='momo'; t.s.basicAttack.path='sniper'; t.s.useCharacterSkill(); assert.equal(t.n(),1,'sniper hold path untouched'); }
{ const t=mk(); t.s.useCharacterSkill(); t.s.state='levelup'; t.q[0][1](); assert.equal(t.n(),0,'paused mid wind-up: no cast'); assert.equal(t.s._uqWind,false); }
assert(src.includes("return this.useCharacterSkill(true);}"),'Yuzu command release skips the wind-up');
// v8.2.1 owner 🐞: Cocoa Titan release must cast at once with its Rage level (the wind-up used to fire after _titanRelease was reset → Rage 0)
{ const rel=grab('releaseTitanCharge'); assert(/useCharacterSkill\(true\);this\._titanRelease=0;/.test(rel),'Titan release skips wind-up');
  const T=vm.runInNewContext('class T{'+rel+'}; T',{Math}); const t=new T(); let seen=null; Object.assign(t,{_titanHold:{},state:'play',uniqueCd:0,_titanRage:2.6,titanMaxLv:()=>3,useCharacterSkill(nw){ seen=[nw,this._titanRelease]; }});
  t.releaseTitanCharge(); assert.deepEqual(seen,[true,2],'cast sees Rage 2'); assert.equal(t._titanRelease,0); }
console.log('Unique wind-up: crouch + gather 170 ms, one cast, charged/sniper skip, pause cancels passed');
