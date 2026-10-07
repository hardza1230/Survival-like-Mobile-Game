const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'(');assert(at>=0,n);const tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const math=Object.create(Math);math.random=()=>.9;
const ctx={Math:math,COLORS:{ice:1},BALANCE:{skillPower:{frost:1}},FLAVOR_INFUSIONS:[],FLAT_EFF_PATH:{},FLAT_EFF:{mint:1},gearAttackRoll:()=>0,ATK_PCT:.05,Sfx:{magnet(){},boom(){}},Phaser:{Math:{Between:()=>0}}};
const names=['glacierBrittle','glacierPrimed','glacierHitPower','glacierFrostHit','glacierEcho','mintChill','glacierShatter','mintBurstFx','stopEnemyPresentation','damage','releaseGlacierBloom','artDelay','clearArtVfx'];
const Scene=vm.runInNewContext('class Scene{'+names.map(method).join('\n')+'\n}Scene',ctx);
function enemy(o={}){return {active:true,x:0,y:0,hp:1e6,maxhp:1e6,frozen:0,_glacierLifeToken:1,body:{velocity:{x:100,y:0}},setVelocity(x,y){this.body.velocity={x,y};},setTint(){},...o};}
function scene(foes,path='glacier'){
 const s=new Scene(),hits=[],fx=[],timers=[];Object.assign(s,{state:'play',time:{now:0,delayedCall(ms,fn){const ev={ms,fn,remove(){this.removed=true;}};timers.push(ev);return ev;}},skills:{frost:1},basicAttack:{character:'mint',path,lv:{},ranks:{},_pm:{dmg:.9,frozen:.35}},player:{x:0,y:0,dmgMul:1,hp:100,maxhp:100,_pt:{}},enemies:{children:{iterate(fn){foes.forEach(fn);}}},dist:(x,y,a,b)=>Math.hypot(x-a,y-b),damage(e,n){if(!e._phaseGateLocked&&!(e._phaseInvuln>0)){hits.push({e,n});e.hp-=n;}},ptOnFreeze(){},burst(){},floatText(){},vfxHitRing(){},textures:{exists:()=>true},trackArtVfx:o=>o,spawnFxAnim(...a){fx.push(a);return {};},tweens:{add(){},killTweensOf(){}},camWorld:o=>o,add:{circle:()=>({setStrokeStyle(){return this;},setDepth(){return this;}})},screenShake(){},showBanner(){},mintLv:()=>s.basicAttack.lv,bloomRadius:()=>200,mintUniqueStart:()=>({ul:1,unit:1})});Object.assign(s,{hits,fx,timers});return s;
}
// At t=0 the first Chill is retained. Fresh freeze does not count as a Frost hit.
{const e=enemy(),s=scene([e]);for(let i=0;i<4;i++)s.mintChill(e,.6);assert(e.frozen>0);assert.equal(e._glacierFrost||0,0);for(let i=0;i<3;i++)s.mintChill(e,.6);assert.equal(e._glacierFrost,3);assert.equal(s.hits.length,0);s.mintChill(e,.6);assert.equal(s.hits.length,1);assert.equal(e._glacierFrost,0);assert.equal(s.hits[0].n,25.2);}
for(const role of [{isBoss:true},{isMini:true},{freezeImmune:true}]){
 const e=enemy(role),s=scene([e]);for(let i=0;i<4;i++)s.mintChill(e,.6);assert(s.glacierBrittle(e));assert.equal(e.frozen,0);assert.equal(e.body.velocity.x,100);
 for(let i=0;i<3;i++)s.mintChill(e,.6);assert.equal(e._glacierFrost,3);s.mintChill(e,.6);assert.equal(s.hits[0].n,32.4);assert.equal(e.frozen,0);
 e._glacierFrost=3;e._phaseGateLocked=true;const n=s.hits.length;s.time.now=1000;s.mintChill(e,.6);s.glacierFrostHit(e);s.glacierShatter(e);assert.equal(s.hits.length,n);assert.equal(e._glacierFrost,3);
}
// Expiry, Deep Freeze, echo and hard cooldown avoid endless burst loops.
{const e=enemy({frozen:5}),s=scene([e]);s.basicAttack.lv.p_froststack=2;s.mintChill(e,.6);assert.equal(e._glacierFrost,3);s.time.now=3100;s.mintChill(e,.6);assert.equal(s.hits.length,0);s.mintChill(e,.6);assert.equal(s.hits.length,1);s.mintChill(e,.6);s.mintChill(e,.6);assert.equal(s.hits.length,1);s.time.now+=500;s.mintChill(e,.6);assert.equal(s.hits.length,2);}
{const a=enemy({isBoss:true}),b=enemy({x:10}),s=scene([a,b]);s.basicAttack.lv.p_coldsnap=3;for(let i=0;i<4;i++)s.mintChill(a,.6);assert.equal(b._chill,1);assert.equal(a._glacierFrost||0,0);}
// Chain limits: depth 0/1/2, six bursts globally per 200ms, max 24 neighbors each.
for(const rank of [0,1,2]){
 const foes=Array.from({length:80},(_,i)=>enemy({x:i,frozen:10,_glacierFrost:2,_glacierFrostAt:0})),s=scene(foes);foes[0]._glacierFrost=3;s.basicAttack.lv.p_chainshatter=rank;
 s.glacierShatter(foes[0]);assert(s._glacierBursts<=(rank?6:1));assert(s.fx.length<=3);assert(s.hits.length<=6*25);assert.equal(s._glacierBusy,false);
 const n=s.hits.length;s.glacierShatter(foes[0]);assert.equal(s.hits.length,n);
}
{const a=enemy({x:0,frozen:5,_glacierFrost:3,_glacierFrostAt:0}),b=enemy({x:100,frozen:5,_glacierFrost:2,_glacierFrostAt:0}),c=enemy({x:200,frozen:5,_glacierFrost:2,_glacierFrostAt:0}),s=scene([a,b,c]);s.basicAttack.lv.p_chainshatter=1;s.glacierShatter(a);assert.equal(s._glacierBursts,2);assert.equal(c._glacierFrost,3);}
{const foes=Array.from({length:8},(_,i)=>enemy({x:i*1000,frozen:5,_glacierFrost:3})),s=scene(foes);for(const e of foes)s.glacierShatter(e);assert.equal(s.hits.length,6);s.time.now=200;s.glacierShatter(foes[6]);assert.equal(s.hits.length,7);}
// Non-Glacier keeps ordinary Chill/Freeze and does not acquire Frost or Brittle.
for(const path of ['barrage','pierce']){const a=enemy(),b=enemy({isBoss:true}),s=scene([a,b],path);for(let i=0;i<9;i++){s.mintChill(a,.6);s.mintChill(b,.6);}assert(a.frozen>0);assert.equal(b.frozen,0);assert(!s.glacierBrittle(b));assert.equal(a._glacierFrost,undefined);assert.equal(s.hits.length,0);}
// Pooled reset clears Frost/Brittle/cooldown/Chill and advances a separate lifetime token.
{const e=enemy({_glacierFrost:3,_glacierBrittleUntil:3000,_chill:4,_glacierBurstAt:100}),s=scene([e]);s.stopEnemyPresentation(e);assert.equal(e._glacierFrost,0);assert.equal(e._chill,0);assert.equal(e._glacierLifeToken,2);assert.equal(e._glacierBrittleUntil,0);assert.equal(e._glacierBurstAt,-Infinity);}
// Actual damage() applies Frozen path bonuses to Brittle, including boss phase gates.
{const e=enemy({isBoss:true,phase2:true,phase3:true,_glacierBrittleUntil:3000}),s=scene([e]);s.damage=Scene.prototype.damage;s.player.critChance=0;s.stageIndex=0;s.condDmgMul=()=>1;s.warnAntBomber=()=>{};s.popDmg=()=>{};s.damage(e,100,0,0);assert.equal(e.maxhp-e.hp,135);s.time.now=3001;s.damage(e,100,0,0);assert.equal(e.maxhp-e.hp,235);e._phaseInvuln=1;s.damage(e,100,0,0);assert.equal(e.maxhp-e.hp,235);}
// Unique delayed damage is canceled on transition and cannot damage a recycled enemy.
for(const cancel of [true,false]){
 const e=enemy({isBoss:true}),s=scene([e]);s.releaseGlacierBloom(1);assert.equal(e.frozen,0);assert(s.glacierBrittle(e));const before=s.hits.length;
 if(cancel)s.clearArtVfx();else s.stopEnemyPresentation(e);
 for(const t of s.timers)t.fn();assert.equal(s.hits.length,before);
}
{const e=enemy({_phaseGateLocked:true,isBoss:true}),s=scene([e]);s.releaseGlacierBloom(1);assert.equal(e._glacierBrittleUntil,undefined);}
console.log('Glacier M2: real Chill/Frost/Shatter, boss/immune Brittle, expiry, chain depth/budgets, phase gates, resets, damage bonuses and Unique lifecycle passed');
