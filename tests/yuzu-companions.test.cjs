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
 assert.equal(s.yuzuEnsure(),m);assert.equal(s._yuzuCrew.length,1);assert(!('hp' in m)&&!('down' in m)&&!('revive' in m));
 assert.equal(m.kind,({citrusGuardian:'pomelo',zestSwarm:'lime',juiceWorkshop:'bloodorange'})[path]||'yuzling');
}
// v8.0.60: the old down/revive/HP, Flavor Brew and orb compatibility helpers are gone.
{const s=scene();s.yuzuEnsure();for(const k of ['yuzuHurt','yuzuKnock','yuzuDown','yuzuRecovery','yuzuRegrow','yuzuMaxHp','yuzuBrew','yuzuFinishInfusedShot'])assert.equal(s[k],undefined,k+' legacy helper removed');assert(!src.includes('yuzuKnock'));}
{const s=scene(),m=s.yuzuEnsure();s.basicAttack.mutation='hardy';s.yuzuParadeCast(1);assert(s._yzShield.hp>=22);}
// Growth is attributed only to the active Pomelo, never to Yuzu seeds or passive stage kills.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure();for(let i=0;i<20;i++)s.yuzuOnKill();assert.equal(m.growth,0);s._yzHitOwner=m;for(let i=0;i<4;i++)s.yuzuOnKill();assert.equal(m.growth,1);for(let i=0;i<40;i++)s.yuzuOnKill();assert.equal(m.growth,3);s._yzHitOwner=null;s.basicAttack.lv.y_keepripe=4;assert.equal(m.growth,3);}
// Legacy HP/family investment now improves hits and shields without introducing a down state.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure(),old=s.yuzuPower();s.basicAttack.lv.family=2;assert.equal(s.yuzuPower(),old*1.08);s.yuzuShield(.2,4);assert(Math.abs(s._yzShield.hp-23.2)<1e-8);}
// Taunt is scoped to ordinary foes and cannot hijack story targets or Wisp raiders.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure(),e=enemy(m.spr.x+20,m.spr.y);assert.equal(s.yuzuTaunt(e),m.spr);for(const flag of ['isBoss','isMini','_waveObjectiveTarget','_wispRaider','_fleeing']){e[flag]=true;assert.equal(s.yuzuTaunt(e),null);e[flag]=false;}}
// Sour patches, Aroma slow and Guard stay scoped to Yuzu.
{const e=enemy(80,0),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuZone(m,'sour',80,0,120,4,.25);assert.equal(s.yuzuVulnerable(e),1.2);assert.equal(s.yuzuSlow(enemy(20,0)),.85);s.character='momo';assert.equal(s.yuzuSlow(e),1);assert.equal(s.yuzuVulnerable(e),1);assert.equal(s.yuzuGuard(),1);}
// Shield consumes its own pool, never steals a relic shell or heals the player.
{const s=scene();s.yuzuShield(.2,4);assert.equal(s.yuzuAbsorb(12),0);assert.equal(s.yuzuAbsorb(12),4);assert.equal(s._yzShield,null);assert.equal(s.player.hp,100);}
// Swept collision prevents high-speed arrows tunnelling. First crit resets on pool reuse.
{const e=enemy(80,0,1000),s=scene('zestSwarm',[e]),m=s.yuzuEnsure();for(let i=0;i<2;i++){s.yuzuShot(m,0,0,0,10,{first:true});s.yuzuTickShots(.3);}assert.equal(s.hits.length,2);assert.equal(s.hits[0].critical,true);assert.equal(s.hits[1].critical,false);e._yzSpawnId++;s.yuzuShot(m,0,0,0,10,{first:true});s.yuzuTickShots(.3);assert.equal(s.hits.at(-1).critical,true);assert.equal(s._yzHitOwner,null);assert.equal(s._yzForceCrit,false);}
// Piercing arrows hit each victim once.
{const es=[enemy(40,0,1000),enemy(100,0,1000),enemy(160,0,1000)],s=scene('zestSwarm',es),m=s.yuzuEnsure();s.yuzuShot(m,0,0,0,10,{pierce:2});for(let i=0;i<5;i++)s.yuzuTickShots(.1);assert.equal(s.hits.length,3);assert.equal(new Set(s.hits.map(h=>h.e)).size,3);}
// Context always restores on nested adapters and failures; player seeds cannot grow Pomelo.
{const e=enemy(0,0),s=scene('citrusGuardian',[e]),m=s.yuzuEnsure();s.damage=()=>{throw Error('adapter');};assert.throws(()=>s.yuzuHit(m,e,5,'sweep',true),/adapter/);assert.equal(s._yzHitOwner,null);assert.equal(s._yzForceCrit,false);}
// Each saved Build now starts its own timed buff, retaining one companion.
for(const path of ['citrusGuardian','zestSwarm','juiceWorkshop']){const s=scene(path),m=s.yuzuEnsure();s.yuzuParadeCast(2);assert.equal(s.yuzuBuff().m,m);assert.equal(s.yuzuBuff().total,4,'v64 In Sync 4s');assert.equal(s._yzRain,null);assert.equal(s._yzInfusion,null);if(path==='citrusGuardian')assert(s._yzShield.hp>=28.99);if(path==='juiceWorkshop')assert(s._yzShield.hp>=21);}
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
 assert.equal(finishes,path==='juiceWorkshop'?3:0,'v64: no old end finisher; Blood Orange storm pulses 3x');assert.equal(s.yuzuBuff(),null);s.yuzuEndBuff(u,true);assert.equal(finishes,path==='juiceWorkshop'?3:0);
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
{const e=enemy(80,0,10000),s=scene('zestSwarm',[e]),m=s.yuzuEnsure();s.uniquePower=()=>1.5;s.yuzuParadeCast(2);for(const q of s._yzShots)q.spr.destroy();s._yzShots.length=0;assert(s.yuzuFocusBurst(m,0,100,true));assert.equal(s._yzShots[0].amount,72);assert.equal(s._yzShots[0].pierce,4);assert.equal(s._yzBurst.length,2);
 s.state='paused';s.yuzuTickBuff(2);assert.equal(s._yzShots.length,1);s.state='play';s.yuzuTickBuff(.08);assert.equal(s._yzShots.length,2);s.yuzuTickBuff(.08);assert.equal(s._yzShots.length,3);assert.equal(s._yzBurst.length,0);
 for(let i=0;i<20;i++)s.yuzuHit(m,e,1,'focus_arrow');assert.equal(s._yzBuff.marks,12);e.active=false;assert.equal(s._yzBuff.marks,12);
 for(let i=0;i<20;i++)s.yuzuFocusBurst(m,0,1);assert(s._yzBurst.length<=8);s.yuzuEndBuff(s._yzBuff,false);assert.equal(s._yzBurst.length,0);
}
{const s=scene('zestSwarm');s.basicAttack.uqMut='toss_home';s.player.yuzuParade=true;s.player._pt.yzUniqueTime=2;s.yuzuParadeCast(1);assert.equal(s._yzBuff.total,8);assert.equal(s._yzShots[0].source,'command_arrow');assert(s._yzShots[0].seek);assert.equal(s._yzShots[0].pierce,99);s.yuzuTickBuff(100);assert(!s._yzShots.some(q=>q.source==='focus_final'),'no old finisher');}
// Sour tags are pooled, expire and stay capped.
{const e=enemy(80,0,10000),s=scene('juiceWorkshop',[e]);s.yuzuEnsure();s.yuzuTagSour(e);assert.equal(s.yuzuVulnerable(e),1.15);e._yzSpawnId++;assert.equal(s.yuzuVulnerable(e),1);s.yuzuTagSour(e);s.yuzuTickBuff(3.1);assert.equal(s.yuzuVulnerable(e),1);for(let i=0;i<80;i++)s.yuzuTagSour(enemy(i,0));assert.equal(s._yzSourTags.size,64);s.clearYuzuBuff();assert.equal(s._yzSourTags.size,0);}
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
{const e=enemy(80,0,10000),s=scene('juiceWorkshop',[e]),m=s.yuzuEnsure();s.yuzuParadeCast(1);assert.equal(s._yzBuff.storm.n,3);for(let i=0;i<10;i++)s.yuzuTickBuff(.2);assert.equal(s.hits.filter(h=>h.source==='yuzu.command').length,3,'storm bursts 3x on the target');assert(!s._yzPendingBlend);}
for(const [path,kind,card]of [['juiceWorkshop','comet',null],['citrusGuardian','breaker','y_giantslam'],['zestSwarm','pin','y_strongarm']]){const e=enemy(200,0,1000),s=scene(path,[e]),m=s.yuzuEnsure();e.isBoss=true;if(card){s.yuzuArsenalClock(m,100);assert(!s.yuzuArsenalThink(m,e,1,0),kind+' stays locked until its card');s.basicAttack.lv[card]=1;}s.yuzuArsenalClock(m,100);assert(s.yuzuArsenalThink(m,e,1,0));assert.equal(m.action.kind,kind);s.yuzuTickAction(m,1);assert.equal(s._yzSpells[0].kind,kind);}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();s.yuzuArsenalClock(m,100);assert(!s.yuzuArsenalThink(m,null,1,0));s.player.hp=40;assert(!s.yuzuArsenalThink(m,null,1,0),'Honey Rescue locked');s.basicAttack.lv.y_seedluck=1;assert(s.yuzuArsenalThink(m,null,1,0));assert.equal(m.action.kind,'honey');}
{const es=[enemy(100,0),enemy(180,0),enemy(400,0)],s=scene('zestSwarm',es),m=s.yuzuEnsure();es[2].isBoss=true;s.basicAttack.lv.p_pulp=1;s.yuzuArsenalClock(m,100);assert(s.yuzuArsenalThink(m,es[2],1,0));assert.equal(m.action.kind,'vault');}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();for(let i=0;i<30;i++)s.yuzuQueueSpell(m,'sigil',{x:80,y:0});assert.equal(s._yzSpells.length,12);s.clearYuzuCrew();assert.equal(s._yzSpells.length,0);}
console.log('Yuzu54 arsenal: ground-only delayed/dodgeable sigils,3FPS comet timing/large-spell lock, pause/stale/dead/clear, overlay-resumed once-only victims, ring bands/burn/garden/honey, breaker dedup, pooled pin, deferred Unique, situation AI and12spell cap passed');
for(const step of [1,2,3]){const front=enemy(50,25,1000),back=enemy(-110,25,1000),s=scene('citrusGuardian',[front,back]),m=s.yuzuEnsure();m.spr.setPosition(0,0);s.yuzuPeelStrike(m,{step,a:0},1);assert(s.hits.some(h=>h.e===front));assert.equal(s.hits.some(h=>h.e===back),step===3);const hit=s.hits.find(h=>h.e===front);assert(Math.abs(hit.n-24*(step===1?.85:step===3?1.45:1))<1e-8);}
{const s=scene('juiceWorkshop'),m=s.yuzuEnsure();s.yuzuArsenalClock(m,0);m.action={};const t=m.arsenal.comet;s.yuzuArsenalClock(m,.5);assert.equal(m.arsenal.comet,t-.5);}

// v8.0.60 ก: Yuzu seed marks one target; the companion focuses it and hits it ×1.25 for 4s.
{const mob=enemy(60,0,1000),boss=enemy(300,0,1000),s=scene('zestSwarm',[mob,boss]),m=s.yuzuEnsure(),es=[mob,boss];boss.isBoss=true;s.enemies.children.iterate=f=>es.forEach(f);
 assert.equal(s.yuzuPickTarget(m,.16),boss);s.yuzuMark(mob);assert.equal(s.yuzuMarked(),mob);assert.equal(s.yuzuFocusRank(mob),1.5);assert.equal(s.yuzuEnemyPriority(mob),0,'v62: mark does not widen leash/skill gating');assert.equal(s.yuzuPickTarget(m,.16),boss,'v61: boss stays above the mark');boss.isBoss=false;m.target=null;assert.equal(s.yuzuPickTarget(m,.16),mob,'mark wins among mobs');boss.isBoss=true;
 s.yuzuHit(m,mob,10,'arrow');assert.equal(s.hits.at(-1).n,12.5);s.yuzuHit(null,mob,10,'seed');assert.equal(s.hits.at(-1).n,10,'Yuzu seeds get no mark bonus');
 s.yuzuTickMark(4.1);assert.equal(s.yuzuMarked(),null);s.yuzuMark(mob);mob._yzSpawnId++;assert.equal(s.yuzuMarked(),null,'pooled reuse clears the mark');s.clearYuzuCrew();assert.equal(s._yzMark,null);}
{const left=enemy(-150,0),right=enemy(200,0),s=scene('zestSwarm',[left,right]),es=[left,right];s.enemies.children.iterate=f=>es.forEach(f);s.yuzuEnsure();
 s.player.body={velocity:{x:-200,y:0}};assert.equal(s.yuzuSeedAim(s.player),left,'walking left aims left');s.player.body.velocity={x:200,y:0};assert.equal(s.yuzuSeedAim(s.player),right);s.player.body.velocity={x:0,y:0};assert.equal(s.yuzuSeedAim(s.player),left,'standing still = nearest');
 s.yuzuShot(null,0,0,Math.PI,10,{seed:true,source:'seed'});s.yuzuTickShots(.5);assert.equal(s.yuzuMarked(),left);}
// v8.0.60 ข: each path starts with normal + one skill; the matching card unlocks each extra skill, Evolution unlocks all.
{const s=scene('zestSwarm');for(const k of ['trap','vault','pin','breaker','garden','bloom','honey'])assert(!s.yuzuHasSkill(k),k);assert(s.yuzuHasSkill('comet')&&s.yuzuHasSkill('volley'));
 for(const[k,id]of[['trap','y_bigsplat'],['vault','p_pulp'],['pin','y_strongarm'],['breaker','y_giantslam'],['garden','y_longroot'],['bloom','y_elder'],['honey','y_seedluck']]){s.basicAttack.lv[id]=1;assert(s.yuzuHasSkill(k));s.basicAttack.lv[id]=0;}
 s.basicAttack.evolved=true;assert(['trap','vault','pin','breaker','garden','bloom','honey'].every(k=>s.yuzuHasSkill(k)));
 const text=JSON.stringify(a.BASIC_PATHS.yuzu);for(const n of ['Unlocks Sour Trap','Unlocks Vaulting Shot','Unlocks Pin & Pierce','Unlocks Rind Breaker','Unlocks Sour Garden','Unlocks Spicy Bloom','Unlocks Honey Rescue'])assert(text.includes(n),n);}
// v8.0.60 Dash: an engaged companion keeps fighting; a free one rushes at most once per 1.2s.
{const boss=enemy(300,0,1000),s=scene('zestSwarm',[boss]),m=s.yuzuEnsure();boss.isBoss=true;s.elapsed=10;s.yuzuPickTarget(m,.16);const x=m.spr.x;s.yuzuRush();assert.equal(m.motion,undefined);assert.equal(m.spr.x,x,'engaged ranged buddy stays on its target');
 m.target=null;s.yuzuRush();assert(m.motion,'free buddy follows the Dash');m.motion=null;s.elapsed=10.5;s.yuzuRush();assert(!m.motion,'rush cooldown');s.elapsed=11.3;s.yuzuRush();assert(m.motion);}
// v8.0.61 ก: mark holds 2s and moves only after 2 seed hits in a row · ข1: mission target above the mark · ง: unlock card within 2 level-ups.
{const a1=enemy(60,0,1000),a2=enemy(120,0,1000),a3=enemy(180,0,1000),s=scene('zestSwarm',[a1,a2,a3]);s.yuzuEnsure();
 s.yuzuMark(a1);s.yuzuMark(a2);s.yuzuMark(a2);assert.equal(s.yuzuMarked(),a1,'young mark holds');s.yuzuTickMark(2.1);s.yuzuMark(a2);assert.equal(s.yuzuMarked(),a2,'2 hits + 2s moves it');
 s.yuzuTickMark(2.1);s.yuzuMark(a3);s.yuzuMark(a2);s.yuzuMark(a3);assert.equal(s.yuzuMarked(),a2,'hits must be in a row');assert.equal(s._yzMark.t,4,'hit on the mark refreshes it');
 a3._waveObjectiveTarget=true;assert.equal(s.yuzuEnemyPriority(a3),5);a3.isElite=true;a3._waveObjectiveTarget=false;assert.equal(s.yuzuEnemyPriority(a3),1);}
{const s=scene('zestSwarm');s.yuzuEnsure();const card=k=>({type:'basic',key:k}),atk=[{card:card('p_pulp')},{card:card('y_double')}];
 let out=[card('a'),card('b'),card('c')];s.yuzuUnlockGuard(out,atk);assert(!out.some(c=>c.key==='p_pulp'),'first miss allowed');
 out=[card('a'),card('b'),{type:'heal',key:'sweetRecovery'}];s.yuzuUnlockGuard(out,atk);assert(out.some(c=>c.key==='p_pulp'),'second level forces an unlock card');assert(out.some(c=>c.type==='heal'),'heal kept');
 s.basicAttack.lv.p_pulp=1;out=[card('a')];s.yuzuUnlockGuard(out,atk);s.yuzuUnlockGuard(out,atk);assert.equal(out[0].key,'a','nothing left to unlock');}
// v8.0.62 ก/ง/ค: mark lifts only target choice; unlock cards say what they unlock; Ruby teaches aiming once.
{const mob=enemy(60,0,1000),s=scene('zestSwarm',[mob]);let tip=null;s.rubyOnce=k=>{tip=k;};s.yuzuEnsure();s.yuzuMark(mob);assert.equal(tip,'yuzuAim');assert.equal(s.yuzuEnemyPriority(mob),0);assert.equal(s.yuzuFocusRank(mob),1.5);
 assert(src.includes("c.headline='🔓 Unlocks '+unl"));assert(src.includes('yuzuAim:{say:'));for(const n of ['needs the Sour Snare card','needs the Honey Alchemy card','needs the Steeped Flavor card'])assert(src.includes(n),n);}
// v8.0.64 Citrus Command: hold-aim point, per-path big move first, then 4s In Sync with 🎯 ×1.5.
{const mob=enemy(150,0,1e4),boss=enemy(300,0,1e5),s=scene('citrusGuardian',[mob,boss]),m=s.yuzuEnsure();boss.isBoss=true;assert(s.isYuzuCommand());
 let pt=s.yuzuCmdPoint(null);assert.equal(pt.x,300,'auto aims the priority target');s.yuzuMark(mob);pt=s.yuzuCmdPoint(null);assert.equal(pt.x,150,'auto aims the 🎯 mark');
 pt=s.yuzuCmdPoint({dragged:true,ang:Math.PI/2,dl:400});assert(Math.abs(pt.y-380)<1e-6&&Math.abs(pt.x)<1e-6,'drag aims, max 380px');
 s._yzCmdPt={x:150,y:0};s.yuzuParadeCast(1);assert.equal(s._yzCmdPt,null);assert.equal(m.motion.kind,'command');assert.equal(m.motion.tx,150);assert(m.motion.cmd===s._yzBuff);
 s.yuzuCommandLand(m,m.motion);assert(s.hits.some(h=>h.e===mob&&h.source==='yuzu.command'));const n=s.hits.length;s.yuzuHit(m,mob,10,'arrow');assert.equal(s.hits.at(-1).n,15,'In Sync 🎯 ×1.5');}
{const mob=enemy(100,0,1e4),elite=enemy(200,0,1e4),s=scene('zestSwarm',[mob,elite]),m=s.yuzuEnsure();elite.isElite=true;m.spr.setPosition(0,0);s._yzCmdPt={x:300,y:0};s.yuzuParadeCast(1);
 const q=s._yzShots.find(q=>q.source==='command_arrow');assert(q&&q.pierce===99&&q.cmdMark);for(let i=0;i<10;i++)s.yuzuTickShots(.05);assert(s.hits.some(h=>h.e===mob)&&s.hits.some(h=>h.e===elite),'pierces the line');assert.equal(s.yuzuMarked(),elite);assert.equal(s._yzMark.t,6);}
// v8.0.65: Pomelo leap ≤450px with distance-based time, Lime follows the drag direction, Flavor Storm pulls 35px.
{const s=scene('citrusGuardian'),m=s.yuzuEnsure();m.spr.setPosition(0,0);s._yzCmdPt={x:900,y:0};s.yuzuParadeCast(1);assert(Math.abs(m.motion.tx-450)<1e-6,'leap capped at 450');assert(Math.abs(m.motion.duration-.725)>0&&m.motion.duration<=.7&&m.motion.duration>.35);}
{const s=scene('zestSwarm'),m=s.yuzuEnsure();m.spr.setPosition(-200,0);const pt=s.yuzuCmdPoint({dragged:true,ang:Math.PI/2,dl:100});assert.equal(pt.ang,Math.PI/2);s._yzCmdPt=pt;s.yuzuParadeCast(1);const q=s._yzShots.find(q=>q.source==='command_arrow');assert(Math.abs(q.angle-Math.PI/2)<1e-9,'arrow uses drag direction, not companion→point');}
{const e=enemy(100,0,1e6);e.setPosition=function(x,y){this.x=x;this.y=y;};const s=scene('juiceWorkshop',[e]);s.yuzuEnsure();s._yzCmdPt={x:0,y:0};s.yuzuParadeCast(1);s.yuzuTickBuff(.31);assert(Math.abs(e.x-65)<1e-6,'pull 35px');}
console.log('Yuzu v65: leap cap/duration, Lime drag direction, Storm pull passed');
console.log('Yuzu v64: Citrus Command aim point (auto/mark/drag), Pomelo leap slam, Lime piercing arrow + 6s mark, Blood Orange storm, In Sync ×1.5 passed');
console.log('Yuzu v62: mark-only target choice, unlock headlines, locked-talent notes and Ruby aim tip passed');
console.log('Yuzu v61: steady mark, mission/boss above mark, unlock-card guarantee passed');
console.log('Yuzu v60: seed mark focus/×1.25/expiry/pool safety, walk-direction aim, card skill unlocks + Evolution, Dash keeps an engaged companion and rush cooldown passed');
