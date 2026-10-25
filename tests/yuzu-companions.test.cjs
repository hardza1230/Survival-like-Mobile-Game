// Isolated owned-actor / damage / projectile / lifecycle contracts; no game or combat simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8');
const block=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b));
const ctx={Math,Map,Set,WeakMap,WeakSet,inMapPt:(x,y)=>[Math.max(-1000,Math.min(1000,x)),Math.max(-1000,Math.min(1000,y))],Sfx:{crit(){},bp(){return false;}},Phaser:{Math:{Angle:{Wrap:a=>Math.atan2(Math.sin(a),Math.cos(a))}}}};vm.createContext(ctx);
vm.runInContext(block('const BASIC_ATTACKS = {','// 🛤 Build Path')+block('const BASIC_PATHS={','// 🍯 Flavor Infusion')+block('const CHAR_TALENTS = {','// v4.88: Passive')+';this.api={BASIC_ATTACKS,BASIC_PATHS,PATH_TALENTS,talentBranch,applyPathTalents};',ctx);
const methods=block('  // Citrus Companions: one owned actor','  tickFR(dt){');
const Scene=vm.runInContext('class Scene{'+methods+'\n}Scene',ctx),a=ctx.api;
function node(x=0,y=0,key='minion_yuzling'){
 const n={x,y,texture:{key},active:true,alpha:1,destroy(){this.active=false;this.destroyed=true;},setPosition(x,y){this.x=x;this.y=y;return this;},setTexture(key,frame){this.texture={key};this.frame=frame;return this;},setFrame(f){this.frame=f;return this;}};
 for(const k of ['setDepth','setOrigin','setDisplaySize','setRotation','setTint','clearTint','setFlipX','setStrokeStyle','clear','fillStyle','fillRoundedRect','fillRect','lineStyle','strokeCircle'])n[k]=function(){return this;};
 n.setAlpha=function(v){this.alpha=v;return this;};n.setText=function(v){this.text=v;return this;};return n;
}
function enemy(x,y,hp=100){return {x,y,hp,maxhp:hp,active:true,_yzSpawnId:1,body:{halfWidth:14},dmg:8,setVelocity(){}};}
function scene(path=null,es=[]){
 const s=new Scene();Object.assign(s,{character:'yuzu',state:'play',player:{x:0,y:0,hp:100,maxhp:100,dmgMul:1,cdMul:1,critMul:1.55,_pt:{}},basicAttack:{character:'yuzu',path,lv:{},ranks:{},_pm:{dmg:1,cd:1}},textures:{exists:()=>true},camWorld:o=>o,dist:(x,y,a,b)=>Math.hypot(x-a,y-b),add:{sprite:(x,y,k)=>node(x,y,k),image:(x,y,k)=>node(x,y,k),text:(x,y)=>node(x,y),graphics:()=>node(),circle:(x,y)=>node(x,y)},enemies:{children:{iterate:f=>es.forEach(f)}},hits:[],floatText(){},vfxHitRing(){},popHeal(){},showBanner(){},uniqueInfo:()=>({name:'Special'}),uniquePower:()=>1,applyBurn(e,d,cap,t){e.burn={d,cap,t};}});
 s.damage=(e,n)=>{s.hits.push({e,n,source:s._mxSrc,owner:s._yzHitOwner,critical:s._yzForceCrit===e});e.hp-=n;if(e.hp<=0){s.yuzuOnKill(e);e.active=false;}};return s;
}
// Single ownership is invariant under every old count upgrade and gear investment.
for(const path of [null,'citrusGuardian','zestSwarm','juiceWorkshop']){
 const s=scene(path),m=s.yuzuEnsure();s.basicAttack.lv.family=3;s.basicAttack._pm.count=20;
 assert.equal(s.yuzuEnsure(),m);assert.equal(s._yuzuCrew.length,1);assert(m.maxhp>0);assert(m.hp<=m.maxhp);
 assert.equal(m.kind,({citrusGuardian:'pomelo',zestSwarm:'lime',juiceWorkshop:'bloodorange'})[path]||'yuzling');
}
// Down actors cannot take repeated damage or attack. Touch rescue and timeout both restore exactly once.
{const s=scene(),m=s.yuzuEnsure();m.spr.setPosition(200,0);s.yuzuHurt(m,m.maxhp*2);assert.equal(m.hp,0);assert.equal(m.down,5);s.yuzuRecovery(m,2);assert.equal(m.down,3);s.player.x=170;s.yuzuRecovery(m,0);assert.equal(m.down,0);assert.equal(m.hp,m.maxhp);assert.equal(m.iframe,1);s.yuzuDown(m);s.player.x=0;s.yuzuRecovery(m,5);assert.equal(m.down,0);assert.equal(m.hp,m.maxhp);}
{const s=scene(),m=s.yuzuEnsure();s.basicAttack.mutation='hardy';s.yuzuHurt(m,m.maxhp*.5);assert.equal(m.hp,m.maxhp);assert(m.hardyUsed);m.iframe=0;s.yuzuHurt(m,m.maxhp*2);assert(m.down>0);s.yuzuRegrow(m);assert.equal(m.hardyUsed,false);}
// Growth is attributed only to the active Pomelo, never to Yuzu seeds or passive stage kills.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure();for(let i=0;i<20;i++)s.yuzuOnKill();assert.equal(m.growth,0);s._yzHitOwner=m;for(let i=0;i<4;i++)s.yuzuOnKill();assert.equal(m.growth,1);for(let i=0;i<40;i++)s.yuzuOnKill();assert.equal(m.growth,3);s._yzHitOwner=null;s.basicAttack.lv.y_keepripe=4;s.yuzuDown(m);assert.equal(m.growth,3);}
// HP projection preserves ratios and does not heal to full on each update.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure();m.hp=m.maxhp/2;const old=m.maxhp;s.basicAttack.lv.family=2;s.yuzuMaxHp(m);assert(m.maxhp>old);assert.equal(m.hp/m.maxhp,.5);s.yuzuMaxHp(m);assert.equal(m.hp/m.maxhp,.5);}
// Taunt is scoped to ordinary foes and cannot hijack story targets or Wisp raiders.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure(),e=enemy(m.spr.x+20,m.spr.y);assert.equal(s.yuzuTaunt(e),m.spr);for(const flag of ['isBoss','isMini','_waveObjectiveTarget','_wispRaider','_fleeing']){e[flag]=true;assert.equal(s.yuzuTaunt(e),null);e[flag]=false;}m.down=1;assert.equal(s.yuzuTaunt(e),null);}
// Sweet -> Sour -> Spicy are individually deterministic, bounded and keep their authored roles.
{const e=enemy(80,0),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.player.hp=50;s.yuzuBrew(m,0);assert.equal(s.player.hp,54);assert.equal(s._yzShield.hp,8);s.yuzuBrew(m,1);assert.equal(s._yzZones[0].kind,'sour');assert.equal(s.yuzuVulnerable(e),1.2);s.yuzuBrew(m,2);assert.equal(s._yzShots[0].burn,true);assert.equal(s._yzShots[0].pierce,5);assert.equal(s.yuzuSlow(enemy(20,0)),.85);s.character='momo';assert.equal(s.yuzuSlow(e),1);assert.equal(s.yuzuVulnerable(e),1);assert.equal(s.yuzuGuard(),1);}
// Shield consumes its own pool, never steals a relic shell or heals the player.
{const s=scene();s.yuzuShield(.2,4);assert.equal(s.yuzuAbsorb(12),0);assert.equal(s.yuzuAbsorb(12),4);assert.equal(s._yzShield,null);assert.equal(s.player.hp,100);}
// Swept collision prevents high-speed arrows tunnelling. First crit resets on pool reuse.
{const e=enemy(80,0,1000),s=scene('zestSwarm',[e]),m=s.yuzuEnsure();for(let i=0;i<2;i++){s.yuzuShot(m,0,0,0,10,{first:true});s.yuzuTickShots(.3);}assert.equal(s.hits.length,2);assert.equal(s.hits[0].critical,true);assert.equal(s.hits[1].critical,false);e._yzSpawnId++;s.yuzuShot(m,0,0,0,10,{first:true});s.yuzuTickShots(.3);assert.equal(s.hits.at(-1).critical,true);assert.equal(s._yzHitOwner,null);assert.equal(s._yzForceCrit,false);}
// Orbs hit one initial target and two distinct bounce victims; pierce hits each once.
{const es=[enemy(40,0,1000),enemy(100,0,1000),enemy(160,0,1000)],s=scene('juiceWorkshop',es),m=s.yuzuEnsure();s.yuzuShot(m,0,0,0,10,{orb:true});for(let i=0;i<5;i++)s.yuzuTickShots(.1);assert.equal(s.hits.length,3);assert.equal(new Set(s.hits.map(h=>h.e)).size,3);}
// Context always restores on nested adapters and failures; player seeds cannot grow Pomelo.
{const e=enemy(0,0),s=scene('citrusGuardian',[e]),m=s.yuzuEnsure();s.damage=()=>{throw Error('adapter');};assert.throws(()=>s.yuzuHit(m,e,5,'sweep',true),/adapter/);assert.equal(s._yzHitOwner,null);assert.equal(s._yzForceCrit,false);}
// All specials are useful after a down, and recipe ids keep their own new behavior.
for(const path of ['citrusGuardian','zestSwarm','juiceWorkshop']){const s=scene(path),m=s.yuzuEnsure();s.yuzuDown(m);s.yuzuParadeCast(2);assert.equal(m.down,0);assert(m.boost>=5);if(path==='citrusGuardian')assert(s._yzShield.hp>=28.99);if(path==='zestSwarm')assert.equal(s._yzRain.t,3);if(path==='juiceWorkshop'){assert.equal(s._yzInfusion.t,4);assert(s._yzShots.some(q=>q.burn));assert(s._yzZones.some(z=>z.kind==='sour'));}}
// Bounded allocations and final cleanup cover paths, menus, retry and remaining projectiles/zones.
{const s=scene('zestSwarm'),m=s.yuzuEnsure();for(let i=0;i<60;i++)s.yuzuShot(m,0,0,0,1);assert.equal(s._yzShots.length,48);for(let i=0;i<20;i++)s.yuzuZone(m,'sour',0,0,20,2,.1);assert.equal(s._yzZones.length,10);const objects=[m.spr,m.bar,m.label,...s._yzShots.map(q=>q.spr),...s._yzZones.map(q=>q.spr)];s.clearYuzuCrew();assert(objects.every(o=>o.destroyed));assert.equal(s._yzShots.length,0);assert.equal(s._yzZones.length,0);assert.equal(s._yuzuCrew.length,0);s.clearYuzuCrew();}
// Saved path ids, card ids and all 30 authored talent ids survive the redesign.
const paths=a.BASIC_PATHS.yuzu;assert.deepEqual(Array.from(paths,p=>p.id),['zestSwarm','citrusGuardian','juiceWorkshop']);assert.deepEqual(Array.from(a.BASIC_ATTACKS.yuzu.upgrades,u=>u.id),['power','rate','family','splash','loyal']);
for(const path of paths){assert.equal(path.upgrades.length,5);const nodes=a.talentBranch(path);assert.equal(nodes.length,10);const tal={};for(const n of nodes){assert(!n.soon);assert.equal(typeof n.apply,'function');tal[n.id]=1;}const p={};a.applyPathTalents(p,'yuzu',path.id,tal);assert.equal(Object.keys(p._pt).length,10);assert(nodes.every(n=>n.id.startsWith('pt_'+path.id+'_')));}
// All runtime cells are source verified alpha and hero-lazy, keeping boot / other heroes isolated.
for(const m of JSON.parse(fs.readFileSync('assets/art/yuzu_companions/MANIFEST.json'))){const p='assets/art/yuzu_companions/'+m.file,b=fs.readFileSync(p);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),m.sha256);assert(src.includes("url:'"+p+"',frame:256"));assert.equal(m.frames,m.key.startsWith('yz_fx_')?4:8);assert.equal(m.alpha[0],0);}
assert(src.includes("if(k.startsWith('minion_')||k.startsWith('yz_'))return 'yuzu';"));
assert(!src.includes('YUZU_START=')&&!src.includes('yuzuSprout(')&&!src.includes('yuzuThrow('));
console.log('Yuzu companions: single ownership, HP/ratio/down/touch revive, Hardy, own-kill growth, scoped taunt/aura, deterministic brews, shields, swept/pool-safe projectiles, special moves, bounds/cleanup, stable cards/30 talents and 40 alpha frames passed');
