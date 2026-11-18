// v8.2.10 owner (animation review, monsters + loot): white squash ghost on death (≤14 at once), white flash on crits only (throttled), step bob for monsters without a walk sheet, loot hops in with a bounce
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const T=vm.runInNewContext('class T{'+['enemyDeathPop','lootPopIn'].map(grab).join('\n')+'}; T',{Math});
{ const t=new T(),tw=[],made=[]; const img={setOrigin(){return this},setScale(){return this},setFlipX(){return this},setRotation(){return this},setDepth(){return this},setTintFill(){return this},destroy(){}};
  Object.assign(t,{add:{image:()=>{made.push(1);return Object.create(img);}},camWorld:o=>o,tweens:{add:o=>tw.push(o)}});
  const e={x:0,y:0,texture:{key:'k'},frame:{name:0},originX:.5,originY:.5,scaleX:1,scaleY:1,visible:true,depth:3};
  for(let i=0;i<20;i++)t.enemyDeathPop(e); assert.equal(made.length,14,'at most 14 ghosts at once'); assert.equal(tw[0].scaleY,.55); assert(tw[0].duration<=160);
  tw[0].onComplete(); assert.equal(t._deathGhosts,13,'ghost count released'); }
{ const t=new T(),tw=[]; Object.assign(t,{tweens:{add:o=>tw.push(o),killTweensOf(){}}}); const g={scaleX:.5,scaleY:.5,y:0,active:true,setScale(x,y){this.scaleX=x;this.scaleY=y;}};
  t.lootPopIn(g,100); assert.equal(g.y,66,'starts above'); assert.equal(tw.length,2); assert.equal(tw[1].ease,'Bounce.out'); tw[1].onComplete(); assert.equal(tw[2].repeat,-1,'then the usual bob'); }
assert(/killEnemy\(e\)\{ if\(e&&e\.active&&!e\.isBoss&&!e\.isMini&&!e\.isDummy\)this\.enemyDeathPop\?\.\(e\);/.test(src));
assert(/nowT-\(e\._critFlashAt\|\|0\)>220\)\{ e\._critFlashAt=nowT; e\.setTintFill\(0xffffff\);/.test(src),'crit flash throttled');
assert(src.includes("bob=!hasWalk&&state==='walk'?Math.abs(Math.sin(e.stepT))*.07:0"),'step bob');
assert.equal((src.match(/this\.lootPopIn\?\.\(g,y\); return g; \}/g)||[]).length,2,'gear + currency drops pop in');
console.log('Monster/loot animation 8.2.10 passed');
