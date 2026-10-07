const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'(');assert(at>=0,n);const tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const Scene=vm.runInNewContext('class Scene{'+['mintBurstFx','mintHeavyImpact','impalerTarget','castImpalerLance','tickImpalerCharge','releaseImpalerCharge','impaleStacks','applyImpale','hitImpaler','_hitEnemyCore','getBullet','killBullet','artDelay','clearArtVfx','trackArtVfx','poseFlash'].map(method).join('\n')+'\n}Scene',{Sfx:{frost(){}},CF:{hurt:5},Math});
function object(){return {active:true,x:0,y:0,body:{velocity:{x:0,y:0},setAllowGravity(){},stop(){}},setTexture(k){this.texture={key:k};return this;},setTint(){return this;},setScale(v){this.scale=v;return this;},setPosition(x,y){this.x=x;this.y=y;return this;},setDepth(){return this;},setAlpha(){return this;},setRotation(){return this;},setActive(v){this.active=v;return this;},setVisible(){return this;},once(k,fn){this[k]=fn;return this;},destroy(){this.active=false;this['destroyHook']?.();}};}
function enemy(o={}){return {...object(),hp:1e6,maxhp:1e6,isElite:false,frozen:0,...o};}
function scene(foes=[]){
 const s=new Scene(),queue=[],shots=[],hits=[],art=[];
 Object.assign(s,{state:'play',time:{now:0,delayedCall(ms,fn){const t={at:s.time.now+ms,fn,remove(){this.removed=true;}};queue.push(t);return t;}},basicAttack:{character:'mint',path:'pierce',lv:{},ranks:{},_pm:{count:0,range:.3}},player:{active:true,x:0,y:0},enemies:{children:{iterate(fn){foes.forEach(fn);}}},priorityBossTarget(range){return foes.find(e=>e.active&&(e.isBoss||e.isMini)&&Math.hypot(e.x,e.y)<range)||null;},nearestEnemy:()=>foes.find(e=>e.active)||null,poseAttack(){},textures:{exists:()=>true},add:{image(){const a=object();art.push(a);return a;}},camWorld:o=>o,tweens:{killTweensOf(){}},attachProjectileArt(b,k,h){b.artHeight=h;},physics:{velocityFromRotation(a,speed,v){v.x=Math.cos(a)*speed;v.y=Math.sin(a)*speed;}},mintBullet(...a){return this.getBullet(...a);},getBullet(x,y,tint,scale){const b=object().setScale(scale);shots.push(b);return b;},damage(e,n){if(!e._phaseGateLocked&&!(e._phaseInvuln>0)){hits.push({e,n});e.hp-=n;if(e.hp<=0)e.active=false;}},mintChill(e,f){e.chill=f;},floatText(){},spawnFxAnim:()=>object(),vfxHitRing(){},dist:(x,y,a,b)=>Math.hypot(x-a,y-b)});
 s.advance=ms=>{s.time.now+=ms;for(const q of queue.splice(0))if(!q.removed&&q.at<=s.time.now)q.fn();else if(!q.removed)queue.push(q);};Object.assign(s,{queue,shots,hits,art});return s;
}
function shot(s,full=true){s.castImpalerLance(1,false,1,s.basicAttack);if(full)s.advance(320+80*(s.basicAttack.lv.p_heavydraw||0));else{s.advance(100);s.releaseImpalerCharge(false);}return s.shots.at(-1);}
if(require.main===module){
// Charge is automatic, one pending charge, target priority is reacquired at release.
{const near=enemy({x:1}),elite=enemy({x:100,isElite:true}),boss=enemy({x:0,y:200,isBoss:true,active:false}),s=scene([near,elite,boss]);assert.equal(s.impalerTarget(1100),elite);s.castImpalerLance(1,false,1,s.basicAttack);s.castImpalerLance(1,false,1,s.basicAttack);assert.equal(s.queue.length,1);assert.equal(s.shots.length,0);boss.active=true;s.advance(320);assert.equal(s.shots.length,1);assert.equal(s.shots[0].body.velocity.x,Math.cos(Math.PI/2)*1000);assert.equal(s.shots[0].impaler.full,true);assert.equal(s.shots[0].dmg,26);assert.equal(s._impalerCharge,null);}
// Heavy Draw tradeoff, partial release and hurt: no later full duplicate or stacks.
{const s=scene(),full=shot(s),a=scene(),partial=shot(a,false);assert(partial.dmg<full.dmg);assert.equal(partial.impaler.full,false);a.advance(1000);assert.equal(a.shots.length,1);
 const heavy=scene();heavy.basicAttack.lv.p_heavydraw=3;heavy.castImpalerLance(1,false,1,heavy.basicAttack);heavy.advance(320);assert.equal(heavy.shots.length,0);heavy.advance(240);assert(heavy.shots[0].dmg>full.dmg);assert(heavy.shots[0].artHeight>full.artHeight);}
{const e=enemy({isBoss:true}),s=scene([e]);s.castImpalerLance(1,false,1,s.basicAttack);s.advance(80);Scene.prototype.poseFlash.call(s,5,160);assert.equal(s.shots.length,1);s.hitImpaler(s.shots[0],e);assert.equal(e._mintImpale||0,0);s.advance(1000);assert.equal(s.shots.length,1);}
// Three full hits set up Impale; the fourth consumes stacks. Duplicate overlaps do nothing.
for(const role of [{},{isElite:true},{isMini:true},{isBoss:true}]){
 const e=enemy(role),s=scene([e]);for(let i=1;i<=3;i++){const b=shot(s);s._hitEnemyCore(b,e);assert.equal(e._mintImpale,i);const n=s.hits.length;s._hitEnemyCore(b,e);assert.equal(s.hits.length,n);}
 const count=s.hits.length;s._hitEnemyCore(shot(s),e);assert.equal(e._mintImpale,0);assert.equal(s.hits.length,count+2);assert(s.hits.at(-1).n>s.hits[count].n);
}
{const e=enemy({isBoss:true}),s=scene([e]);s.basicAttack.lv.p_impaler=1;for(const n of [2,3,0]){s.hitImpaler(shot(s),e);assert.equal(e._mintImpale,n);}}
// Partial shots neither add nor consume, and expired stacks cannot cause Rupture.
{const e=enemy({isBoss:true,_mintImpale:3,_mintImpaleAt:0}),s=scene([e]);s.hitImpaler(shot(s,false),e);assert.equal(e._mintImpale,3);assert.equal(s.hits.length,1);s.time.now=6000;s.hitImpaler(shot(s),e);assert.equal(e._mintImpale,1);assert.equal(s.hits.length,2);}
// Overpenetration retains damage, grows later impacts within a cap; no splash marking.
{const foes=Array.from({length:5},(_,i)=>enemy({x:i*10})),s=scene(foes);s.basicAttack.lv.p_coldblood=3;const b=shot(s);for(const e of foes)s.hitImpaler(b,e);assert.equal(b.active,false);assert.equal(s.hits.length,5);assert(Math.abs(s.hits[3].n/s.hits[0].n-1.54)<1e-9);assert.equal(s.hits[4].n,s.hits[3].n);}
{const e=enemy({hp:20,maxhp:100}),s=scene([e]);s.basicAttack.lv.p_executioner=3;s.hitImpaler(shot(s),e);assert.equal(s.hits[0].n,26*1.24);}
// Evolution/extra lance and Permafrost investments remain useful without extra projectiles.
{const s=scene();s.basicAttack.evolved=true;s.basicAttack._pm.count=2;s.basicAttack.mutation='permafrost';const b=shot(s);assert.equal(s.shots.length,1);assert(Math.abs(b.dmg-26*1.48*1.15)<1e-9);const e=enemy();s.hitImpaler(b,e);assert.equal(e.chill,.96);}
// Phase immunity cannot add/consume; a phase crossed by direct hit defers Rupture.
{const e=enemy({isBoss:true,_phaseInvuln:1,_mintImpale:3,_mintImpaleAt:0}),s=scene([e]);s.hitImpaler(shot(s),e);assert.equal(s.hits.length,0);assert.equal(e._mintImpale,3);}
{const e=enemy({isBoss:true,_mintImpale:3,_mintImpaleAt:0}),s=scene([e]);s.damage=()=>{e._phaseGateLocked=true;};s.hitImpaler(shot(s),e);assert.equal(e._mintImpale,3);}
// Canceled charge/old epoch/basic identity cannot damage a new run.
for(const cancel of ['clear','menu','replace']){const s=scene();s.castImpalerLance(1,false,1,s.basicAttack);if(cancel==='clear')s.clearArtVfx();else if(cancel==='menu')s.state='menu';else s.basicAttack={path:'pierce'};s.advance(1000);assert.equal(s.shots.length,0);assert.equal(s._impalerCharge,null);}
{const e=enemy(),s=scene([e]),b=shot(s);s.clearArtVfx();s.hitImpaler(b,e);assert.equal(s.hits.length,0);assert.equal(b.active,false);}
// Actual projectile pooling clears M3 payload and independently destroys painted art.
{const s=scene(),b=object();b.impaler={full:true};b._chargeFx=object();const art=b._chargeFx;s.bullets={getFirstDead:()=>b};Scene.prototype.getBullet.call(s,0,0,1,1);assert.equal(b.impaler,null);assert.equal(art.active,false);}
assert(source.includes("if(basic?.path==='pierce'){this.castImpalerLance(lvl,aw,dm,basic);return;}"));
assert(source.includes("this.applyImpale(e,dmg*(e.isBoss||e.isMini?1.8:1),c>=0.99)"));
console.log('Impaler M3: actual charge/release/collision, priority, partial/hurt, Impale/Rupture, penetration, execution, investment, phase gates and lifecycle passed');

}
module.exports={scene,enemy,object,shot};
