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
 const s=new Scene();Object.assign(s,{character:'yuzu',state:'play',_artEpoch:1,player:{x:0,y:0,hp:100,maxhp:100,dmgMul:1,cdMul:1,critMul:1.55,_pt:{}},basicAttack:{character:'yuzu',path,lv:{},ranks:{},_pm:{dmg:1,cd:1}},textures:{exists:()=>true},camWorld:o=>o,dist:(x,y,a,b)=>Math.hypot(x-a,y-b),add:{sprite:(x,y,k)=>node(x,y,k),image:(x,y,k)=>node(x,y,k),text:(x,y)=>node(x,y),graphics:()=>node(),circle:(x,y)=>node(x,y)},enemies:{children:{iterate:f=>es.forEach(f)}},hits:[],floatText(){},vfxHitRing(){},popHeal(){},showBanner(){},uniqueInfo:()=>({name:'Special'}),uniquePower:()=>1,applyBurn(e,d,cap,t){e.burn={d,cap,t};}});
 s.damage=(e,n)=>{s.hits.push({e,n,source:s._mxSrc,owner:s._yzHitOwner,critical:s._yzForceCrit===e});e.hp-=n;if(e.hp<=0){s.yuzuOnKill(e);e.active=false;}};return s;
}
// Single ownership is invariant under every old count upgrade and gear investment.
for(const path of [null,'citrusGuardian','zestSwarm','juiceWorkshop']){
 const s=scene(path),m=s.yuzuEnsure();s.basicAttack.lv.family=3;s.basicAttack._pm.count=20;
 assert.equal(s.yuzuEnsure(),m);assert.equal(s._yuzuCrew.length,1);assert(m.maxhp>0);assert(m.hp<=m.maxhp);
 assert.equal(m.kind,({citrusGuardian:'pomelo',zestSwarm:'lime',juiceWorkshop:'bloodorange'})[path]||'yuzling');
}
// Companions are always ready; damage and old down/recovery entry points never disable them.
{const s=scene(),m=s.yuzuEnsure();m.spr.setPosition(200,0);s.yuzuHurt(m,1e9);assert.equal(m.hp,m.maxhp);assert.equal(m.down,0);s.yuzuKnock(()=>true);s.yuzuDown(m);s.yuzuRecovery(m,5);assert.equal(m.down,0);assert.equal(m.hp,m.maxhp);assert.equal(m.spr.x,200);}
{const s=scene(),m=s.yuzuEnsure();s.basicAttack.mutation='hardy';s.yuzuHurt(m,1e9);s.yuzuParadeCast(1);assert.equal(m.down,0);assert(s._yzShield.hp>=22);}
// Growth is attributed only to the active Pomelo, never to Yuzu seeds or passive stage kills.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure();for(let i=0;i<20;i++)s.yuzuOnKill();assert.equal(m.growth,0);s._yzHitOwner=m;for(let i=0;i<4;i++)s.yuzuOnKill();assert.equal(m.growth,1);for(let i=0;i<40;i++)s.yuzuOnKill();assert.equal(m.growth,3);s._yzHitOwner=null;s.basicAttack.lv.y_keepripe=4;s.yuzuDown(m);assert.equal(m.growth,3);}
// Legacy HP/family investment now improves hits and shields without introducing a down state.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure(),old=s.yuzuPower();s.basicAttack.lv.family=2;s.yuzuMaxHp(m);assert.equal(m.hp,m.maxhp);assert.equal(s.yuzuPower(),old*1.08);s.yuzuShield(.2,4);assert(Math.abs(s._yzShield.hp-23.2)<1e-8);}
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
// Each saved Build now starts its own timed buff, retaining one companion.
for(const path of ['citrusGuardian','zestSwarm','juiceWorkshop']){const s=scene(path),m=s.yuzuEnsure();s.yuzuParadeCast(2);assert.equal(m.down,0);assert.equal(s.yuzuBuff().m,m);assert.equal(s.yuzuBuff().total,path==='juiceWorkshop'?7:6);assert.equal(s._yzRain,null);assert.equal(s._yzInfusion,null);if(path==='citrusGuardian')assert(s._yzShield.hp>=28.99);if(path==='juiceWorkshop')assert(s._yzShield.hp>=21);}
// Bounded allocations and final cleanup cover paths, menus, retry and remaining projectiles/zones.
{const s=scene('zestSwarm'),m=s.yuzuEnsure();for(let i=0;i<60;i++)s.yuzuShot(m,0,0,0,1);assert.equal(s._yzShots.length,48);for(let i=0;i<20;i++)s.yuzuZone(m,'sour',0,0,20,2,.1);assert.equal(s._yzZones.length,10);const objects=[m.spr,m.bar,m.label,...s._yzShots.map(q=>q.spr),...s._yzZones.map(q=>q.spr)];s.clearYuzuCrew();assert(objects.every(o=>o.destroyed));assert.equal(s._yzShots.length,0);assert.equal(s._yzZones.length,0);assert.equal(s._yuzuCrew.length,0);s.clearYuzuCrew();}
// Saved path ids, card ids and all 30 authored talent ids survive the redesign.
const paths=a.BASIC_PATHS.yuzu;assert.deepEqual(Array.from(paths,p=>p.id),['zestSwarm','citrusGuardian','juiceWorkshop']);assert.deepEqual(Array.from(a.BASIC_ATTACKS.yuzu.upgrades,u=>u.id),['power','rate','family','splash','loyal']);
for(const path of paths){assert.equal(path.upgrades.length,5);const nodes=a.talentBranch(path);assert.equal(nodes.length,10);const tal={};for(const n of nodes){assert(!n.soon);assert.equal(typeof n.apply,'function');tal[n.id]=1;}const p={};a.applyPathTalents(p,'yuzu',path.id,tal);assert.equal(Object.keys(p._pt).length,10);assert(nodes.every(n=>n.id.startsWith('pt_'+path.id+'_')));}
// All runtime cells are source verified alpha and hero-lazy, keeping boot / other heroes isolated.
for(const m of JSON.parse(fs.readFileSync('assets/art/yuzu_companions/MANIFEST.json'))){const p='assets/art/yuzu_companions/'+m.file,b=fs.readFileSync(p);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),m.sha256);assert(src.includes("url:'"+p+"',frame:256"));assert.equal(m.frames,m.key.startsWith('yz_fx_')?4:8);assert.equal(m.alpha[0],0);}
assert(src.includes("if(k.startsWith('minion_')||k.startsWith('yz_'))return 'yuzu';"));
assert(!src.includes('YUZU_START=')&&!src.includes('yuzuSprout(')&&!src.includes('yuzuThrow('));
console.log('Yuzu companions: immortal single ownership, Hardy/family conversion, own-kill growth, scoped taunt/aura, deterministic brews, shields, swept/pool-safe projectiles, buff starts, bounds/cleanup, stable cards/30 talents and 40 alpha frames passed');

// v50 component adapters: no scene update, spawns or combat simulation.
for(const path of ['citrusGuardian','zestSwarm','juiceWorkshop'])for(const fps of [30,60,120]){
 const s=scene(path),m=s.yuzuEnsure();s.yuzuParadeCast(1);const u=s.yuzuBuff();let finishes=0;
 s.yuzuArea=()=>finishes++;s.yuzuShot=()=>finishes++;
 s.state='paused';s.yuzuTickBuff(100);assert.equal(u.t,u.total);assert.equal(finishes,0);
 s.state='play';for(let i=0;i<fps*u.total+2;i++)s.yuzuTickBuff(1/fps);
 assert.equal(finishes,1);assert.equal(s.yuzuBuff(),null);s.yuzuEndBuff(u,true);assert.equal(finishes,1);assert.equal(m.down,0);
}
for(const change of [s=>s.player={},s=>s.player.hp=0,s=>s.player.active=false,s=>s.basicAttack={},s=>s.basicAttack.path='juiceWorkshop',s=>s._artEpoch=10,s=>s.character='mint',s=>s._yuzuCrew=[]]){
 const s=scene('zestSwarm');s.yuzuEnsure();s.yuzuParadeCast(1);let n=0;s.yuzuArea=()=>n++;s.yuzuShot=()=>n++;change(s);s.yuzuTickBuff(99);assert.equal(n,0);assert.equal(s._yzBuff,null);
}
{const s=scene('citrusGuardian');s.yuzuParadeCast(1);const old=s._yzBuff;let n=0;s.yuzuArea=()=>n++;s.yuzuParadeCast(1);assert(old.finished);assert.equal(n,0);s.clearYuzuCrew();s.yuzuTickBuff(99);assert.equal(n,0);}
// Mission targets immediately supersede sticky ordinary/boss targets on the next bounded scan.
{const mob=enemy(80,0),boss=enemy(420,0),mission=enemy(600,0),locked=enemy(50,0);boss.isBoss=true;mission._waveObjectiveTarget=true;locked._waveObjectiveTarget=true;locked._phaseInvuln=2;
 const s=scene('zestSwarm',[mob]),m=s.yuzuEnsure(),es=[mob,boss,mission,locked];s.enemies.children.iterate=f=>es.forEach(f);
 assert.equal(s.yuzuPickTarget(m,.16),mission);mission.active=false;assert.equal(s.yuzuPickTarget(m,.16),boss);boss.active=false;assert.equal(s.yuzuPickTarget(m,.16),mob);
 boss.active=true;assert.equal(s.yuzuPickTarget(m,.16),boss);assert.equal(s.yuzuTarget(0,0,720),boss);assert(!s.yuzuEnemies().includes(locked));boss._yzSpawnId++;s.yuzuPickTarget(m,.16);assert.equal(m.targetId,boss._yzSpawnId);
 m.spr.x=0;const formation=s.yuzuFormation(m,boss);assert(formation[0]>0,'ranged buddy approaches priority target instead of tether-stalling');boss.x=900;assert.equal(s.yuzuPickTarget(m,.16),mob);
}
{const raider=enemy(200,0),boss=enemy(150,0),s=scene('juiceWorkshop',[boss,raider]);raider._wispRaider=true;boss.isBoss=true;s.waveObjective={type:'purge'};assert.equal(s.yuzuTarget(0,0,500),raider);s.waveObjective.done=true;assert.equal(s.yuzuTarget(0,0,500),boss);}
// Area targeting retains dense-crowd clearance; normal fire remains focused on the boss.
{const boss=enemy(350,0),crowd=Array.from({length:35},()=>enemy(-200,0)),s=scene('citrusGuardian',[boss,...crowd]);boss.isBoss=true;assert.equal(s.yuzuTarget(0,0,500),boss);assert(crowd.includes(s.yuzuCluster(500)));}
// Focus bursts use simulation time, bounded queues, transferable capped marks and real unique scaling.
{const e=enemy(80,0,10000),s=scene('zestSwarm',[e]),m=s.yuzuEnsure();s.uniquePower=()=>1.5;s.yuzuParadeCast(2);assert(s.yuzuFocusBurst(m,0,100,true));assert.equal(s._yzShots[0].amount,72);assert.equal(s._yzShots[0].pierce,4);assert.equal(s._yzBurst.length,2);
 s.state='paused';s.yuzuTickBuff(2);assert.equal(s._yzShots.length,1);s.state='play';s.yuzuTickBuff(.08);assert.equal(s._yzShots.length,2);s.yuzuTickBuff(.08);assert.equal(s._yzShots.length,3);assert.equal(s._yzBurst.length,0);
 for(let i=0;i<20;i++)s.yuzuHit(m,e,1,'focus_arrow');assert.equal(s._yzBuff.marks,12);e.active=false;assert.equal(s._yzBuff.marks,12);
 for(let i=0;i<20;i++)s.yuzuFocusBurst(m,0,1);assert(s._yzBurst.length<=8);s.yuzuEndBuff(s._yzBuff,false);assert.equal(s._yzBurst.length,0);
}
{const s=scene('zestSwarm');s.basicAttack.uqMut='toss_home';s.player.yuzuParade=true;s.player._pt.yzUniqueTime=2;s.yuzuParadeCast(1);assert.equal(s._yzBuff.total,10);s.yuzuTickBuff(100);assert(s._yzShots[0].focusFinal);assert(s._yzShots[0].seek);assert.equal(s._yzShots[0].pierce,6);}
// Perfect Blend strengthens bouncing orbs, tags pooled targets briefly and finishes each orb once.
{const e=enemy(80,0,10000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuParadeCast(1);s.yuzuShot(m,0,0,0,100,{orb:true});const q=s._yzShots[0];assert.equal(q.amount,125);assert.equal(q.bounce,2);assert(q.infused);
 s.yuzuHit(m,e,1,'aroma',false,q);assert.equal(s.yuzuVulnerable(e),1.15);e._yzSpawnId++;assert.equal(s.yuzuVulnerable(e),1);s.yuzuTagSour(e);s.yuzuTickBuff(3.1);assert.equal(s.yuzuVulnerable(e),1);
 let n=0;s.yuzuArea=()=>n++;s.yuzuFinishInfusedShot(q);s.yuzuFinishInfusedShot(q);assert.equal(n,1);q.ended=false;s._artEpoch=8;s.yuzuFinishInfusedShot(q);assert.equal(n,1);
 for(let i=0;i<80;i++)s.yuzuTagSour(enemy(i,0));assert.equal(s._yzSourTags.size,64);s.clearYuzuBuff();assert.equal(s._yzSourTags.size,0);
}
// Live crew no longer checks body contact or consumes hostile projectiles for an immortal shield.
const tick=block('  tickYuzuCrew(dt){','  tickFR(dt){');assert(!tick.includes('killFoe('));assert(!tick.includes('yuzuHurt('));assert(!tick.includes('yuzuRecovery('));
console.log('Yuzu v50: timed three-buff finishers30/60/120FPS, pause/stale/recast/clear, objective/boss priority/phase immunity/ranged approach/crowds, bounded Focus bursts/marks and pooled Sour tags/once-only orb blast passed');

// v54 arsenal component contracts: invoke owned spell/action helpers, never a combat update loop.
{const e=enemy(80,0,1000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();assert(s.yuzuQueueSpell(m,'sigil',e));assert.equal(s._yzShots?.length||0,0);s.yuzuTickSpells(.23);assert.equal(s.hits.length,0);s.state='paused';s.yuzuTickSpells(20);assert.equal(s.hits.length,0);s.state='play';s.yuzuTickSpells(.02);assert.equal(s.hits.length,1);assert.equal(s.hits[0].source,'yuzu.sigil');s.yuzuTickSpells(2);assert.equal(s.hits.length,1);}
{const e=enemy(80,0,1000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuQueueSpell(m,'sigil',e);e.x=250;s.yuzuTickSpells(1);assert.equal(s.hits.length,0,'ground sigil never chases a dodging target');}
for(const fps of [30,60,120]){const e=enemy(80,0,1000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuQueueSpell(m,'comet',e);assert(!s.yuzuQueueSpell(m,'bloom',e));for(let i=0;i<fps*2;i++)s.yuzuTickSpells(1/fps);assert.equal(s.hits.length,1);assert.equal(s._yzSpells.length,0);assert(s.yuzuQueueSpell(m,'bloom',e));}
for(const cancel of [s=>s.player={},s=>s.player.hp=0,s=>s._artEpoch++,s=>s.basicAttack.path='zestSwarm',s=>s.clearYuzuArsenal()]){const e=enemy(80,0,1000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuQueueSpell(m,'comet',e);cancel(s);s.yuzuTickSpells(2);assert.equal(s.hits.length,0);}
{const es=[enemy(80,0,1000),enemy(82,0,1000)],s=scene('juiceWorkshop',es),m=s.yuzuEnsure(),damage=s.damage;let interrupted=false;s.damage=(...args)=>{damage(...args);if(!interrupted){interrupted=true;s.state='levelup';}};s.yuzuQueueSpell(m,'sigil',es[0]);s.yuzuTickSpells(1);assert.equal(s.hits.length,1);assert.equal(s._yzSpells[0].index,0);s.state='play';s.yuzuTickSpells(.01);assert.equal(s.hits.length,2);assert.equal(new Set(s.hits.map(h=>h.e)).size,2);}
{const es=[enemy(40,0,1000),enemy(100,0,1000),enemy(160,0,1000)],s=scene('juiceWorkshop',es),m=s.yuzuEnsure();s.yuzuQueueSpell(m,'bloom',{x:0,y:0});s.yuzuTickSpells(2);assert.equal(s.hits.length,3);assert.equal(new Set(s.hits.map(h=>h.e)).size,3);assert(es.every(e=>e.burn));}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();s.yuzuQueueSpell(m,'garden',{x:100,y:0});s.yuzuTickSpells(2);assert.equal(s._yzZones.length,3);assert(s._yzZones.every(z=>z.kind==='sour'));s.yuzuTickZones(.1);assert(s._yzZones.every(z=>z.spr.alpha<=.18));s._artEpoch++;s.yuzuTickZones(.1);assert.equal(s._yzZones.length,0);s.player.hp=50;s.yuzuQueueSpell(m,'honey',s.player);s.yuzuTickSpells(1);assert.equal(s.player.hp,54);assert(s._yzShield.hp>0);}
{const e=enemy(112,0,1000),s=scene('citrusGuardian',[e]),m=s.yuzuEnsure();s.yuzuQueueSpell(m,'breaker',e);s.yuzuTickSpells(2);assert.equal(s.hits.length,1,'overlapping ground-wave samples hit each spawn once');}
{const e=enemy(300,0,1000),s=scene('zestSwarm',[e]),m=s.yuzuEnsure();e.isBoss=true;s.yuzuQueueSpell(m,'pin',e);s.yuzuTickSpells(.25);assert.equal(m.pin.e,e);e._yzSpawnId++;s.yuzuArsenalClock(m,.01);assert.equal(m.pin,null);s.yuzuTickSpells(1);assert.equal(m.pin,null);assert.equal(s.hits.length,2);assert(s.hits.every(h=>h.critical));}
{const e=enemy(80,0,10000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuParadeCast(1);s.yuzuQueueSpell(m,'comet',e);s.yuzuTickBuff(7);assert(s._yzPendingBlend);assert.equal(s.hits.length,0);s.yuzuTickSpells(1);assert.equal(s._yzPendingBlend,null);assert.equal(s.hits.filter(h=>h.source==='yuzu.blend_final').length,1);s.yuzuTickSpells(10);assert.equal(s.hits.filter(h=>h.source==='yuzu.blend_final').length,1);}
for(const [path,kind]of [['juiceWorkshop','comet'],['citrusGuardian','breaker'],['zestSwarm','pin']]){const e=enemy(200,0,1000),s=scene(path,[e]),m=s.yuzuEnsure();e.isBoss=true;s.yuzuArsenalClock(m,100);assert(s.yuzuArsenalThink(m,e,1,0));assert.equal(m.action.kind,kind);s.yuzuTickAction(m,1);assert.equal(s._yzSpells[0].kind,kind);}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();s.yuzuArsenalClock(m,100);assert(!s.yuzuArsenalThink(m,null,1,0));s.player.hp=40;assert(s.yuzuArsenalThink(m,null,1,0));assert.equal(m.action.kind,'honey');}
{const es=[enemy(100,0),enemy(180,0),enemy(400,0)],s=scene('zestSwarm',es),m=s.yuzuEnsure();es[2].isBoss=true;s.yuzuArsenalClock(m,100);assert(s.yuzuArsenalThink(m,es[2],1,0));assert.equal(m.action.kind,'vault');}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();for(let i=0;i<30;i++)s.yuzuQueueSpell(m,'sigil',{x:80,y:0});assert.equal(s._yzSpells.length,12);s.clearYuzuCrew();assert.equal(s._yzSpells.length,0);}
console.log('Yuzu54 arsenal: ground-only delayed/dodgeable sigils,3FPS comet timing/large-spell lock, pause/stale/dead/clear, overlay-resumed once-only victims, ring bands/burn/garden/honey, breaker dedup, pooled pin, deferred Unique, situation AI and12spell cap passed');
for(const step of [1,2,3]){const front=enemy(50,25,1000),back=enemy(-110,25,1000),s=scene('citrusGuardian',[front,back]),m=s.yuzuEnsure();m.spr.setPosition(0,0);s.yuzuPeelStrike(m,{step,a:0},1);assert(s.hits.some(h=>h.e===front));assert.equal(s.hits.some(h=>h.e===back),step===3);const hit=s.hits.find(h=>h.e===front);assert(Math.abs(hit.n-24*(step===1?.85:step===3?1.45:1))<1e-8);}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();s.yuzuArsenalClock(m,0);m.action={};const t=m.arsenal.comet;s.yuzuArsenalClock(m,.5);assert.equal(m.arsenal.comet,t-.5);}
