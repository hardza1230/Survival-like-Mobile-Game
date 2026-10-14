// Pure contracts and adapters only; no Phaser scene or headless combat playtest.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('  '+n+'(',src.indexOf('class Game extends'));assert(a>=0,n);const m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));return src.slice(a,m?a+1+m.index:src.indexOf('\n}',a));}
const ctx={taroGaleCooldown:b=>Math.pow(.94,Math.max(0,Math.min(4.65,b?.ranks?.p_gale??b?.lv?.p_gale??0)))};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('// Taro T1: pure foundation.'),src.indexOf('// End Taro T1 helpers.'))+'\nthis.api={taroEnemyToken,taroTargetValid,taroPriorityTarget,taroMovementSample,taroCombatProfile,taroNewState,taroQueueEvent,taroAdvanceQueue,taroSecondary};',ctx);
const a=ctx.api,paths=[{id:'storm',upgrades:[{id:'p_squall',max:2,fx:{count:1}},{id:'p_static',max:3,fx:{dmg:1.08}}]},{id:'smite',upgrades:[{id:'p_overload',max:3,fx:{dmg:1.1}}]},{id:'tempest',upgrades:[{id:'p_gale',max:3,fx:{cd:.94}}]}];
ctx.BASIC_PATHS={taro:paths};
const Scene=vm.runInContext('class Foundation{'+['clearTaroCombat','syncTaroCombat','tagTaroEnemy','taroProfile','taroPickTarget','suspendTaroCombat','tickTaroCombat','taroSchedule','taroWithDamage','taroIsSecondary','taroCarryContext','taroDealDamage','modDmgMul','modOnHit','modOnKill','relicOnCrit','relicOnKill','fireRecipes'].map(method).join('\n')+'\n}Foundation',ctx);
function scene(path=null){const s=new Scene();Object.assign(s,{character:'taro',state:'play',gameSpeed:1,elapsed:1,basicAttack:{path,character:'taro',ranks:{},lv:{}},player:{active:true,hp:100,maxhp:100,dmgMul:1,x:0,y:0},enemies:{getChildren:()=>[]}});s.syncTaroCombat();return s;}
function enemy(id,x=0,y=0,hp=100,extra={}){return {_taroSpawnId:id,x,y,hp,maxhp:hp,active:true,...extra};}
const origin={x:0,y:0};
// Priority, stable Rod, phase/range rejection and pool reuse.
{
 const mob=enemy(1,10),elite=enemy(2,20,0,200,{isElite:true}),mini=enemy(3,30,0,300,{isMini:true}),boss=enemy(4,100,0,100,{isBoss:true});
 assert.equal(a.taroPriorityTarget([mob,elite,mini,boss],origin,520).enemy,boss);
 let mark=a.taroEnemyToken(elite);assert.equal(a.taroPriorityTarget([elite,mini],origin,520,mark).enemy,elite,'stable same-tier mark');
 assert.equal(a.taroPriorityTarget([elite,boss],origin,520,mark).enemy,boss,'higher-tier promotion');
 boss._phaseGateLocked=true;assert.equal(a.taroPriorityTarget([mob,elite,mini,boss],origin,520).enemy,mini);
 mark=a.taroEnemyToken(mini);mini._taroSpawnId=99;assert(!a.taroTargetValid(mark,origin,520),'pooled object is a new enemy');
 assert(!a.taroTargetValid(a.taroEnemyToken(enemy(7,600)),origin,520));
 for(const extra of [{isDummy:true},{hp:0},{active:false},{_phaseInvuln:.2}])assert(!a.taroTargetValid(a.taroEnemyToken(enemy(8,0,0,100,extra)),origin,520));
 assert.equal(a.taroPriorityTarget([enemy(10,30),enemy(9,30)],origin,520).id,9,'stable tie break');
}
// Independent damage units, bounded conversion, rank preservation and no double base.
{
 const p={dmgMul:2,cdMul:.9,weaponChains:1,gearCount:1,gearArea:.2,_pt:{fx:[[{dmg:1.05,cd:.96,range:.08},2]]}},b={path:'storm',ranks:{power:2,arc:2,surge:1,rate:1},lv:{p_squall:1,p_static:2},mutation:'stormcaller',evolved:true};
 const saved=JSON.stringify({p,b});const f=a.taroCombatProfile(b,p,4,paths,{skillPower:.8,weaponDamage:1.1,infusionDirect:.9});
 const d=(14+4*4.2)*2*.8*1.1*1.24*.9*1.2*1.2*Math.pow(1.08,2)*Math.pow(1.05,2);
 assert(Math.abs(f.unitD-d)<1e-9);assert.equal(f.primaryDamage,f.unitD*.75);assert.equal(f.roots,3);assert(f.rootBonus<=1.25);assert(f.victims<=10);assert(f.rootRange<=900);assert(f.jumpRange<=360);
 assert.equal(JSON.stringify({p,b}),saved,'profile reads do not mutate save/rank inputs');assert.equal(JSON.stringify(a.taroCombatProfile(b,p,4,paths)),JSON.stringify(a.taroCombatProfile(b,p,4,paths)));
 const temp={path:'tempest',ranks:{arc:99,surge:99},lv:{p_gale:3},mutation:'chainlord',evolved:true};const t=a.taroCombatProfile(temp,{dmgMul:1},1,paths);
 assert.equal(t.roots,1);assert.equal(t.novaRadius,280);assert.equal(t.extraStrikeBonus,1.4);assert(Math.abs(t.interval-2.12*.85)<1e-9,'Gale changes Dash, not basic rate');assert(Math.abs(t.dashCooldownMul-Math.pow(.94,3))<1e-9);
 const sm=a.taroCombatProfile({...temp,path:'smite'},p,1,paths);assert.equal(sm.splashTargets,3);assert.equal(sm.splashBonus,1.25);assert.equal(sm.primaryDamage,sm.unitD*1.8);
 assert.equal(a.taroCombatProfile({path:null},p,1,paths),null);
}
// Movement must be real, intentional, continuous, bounded and distinct from Dash.
{
 const prev={x:0,y:0,playing:true},opts={playing:true,intentional:true,intentX:1,intentY:0,dt:.05,maxSpeed:180};
 const m=a.taroMovementSample(prev,{x:9,y:0},opts);assert.equal(m.distance,9);assert.equal(m.chargeGain,1.25);
 for(const changes of [{playing:false},{intentional:false},{dashing:true},{forced:true},{dt:3}])assert.equal(a.taroMovementSample(prev,{x:9,y:0},{...opts,...changes}).distance,0);
 for(const point of [{x:0,y:0},{x:500,y:0},{x:-9,y:0},{x:0,y:9},{x:NaN,y:0}])assert.equal(a.taroMovementSample(prev,point,opts).distance,0);
 assert.equal(a.taroMovementSample(null,{x:9,y:0},opts).distance,0,'resume/rebase grants nothing');
 assert.equal(a.taroMovementSample({x:0,y:0,playing:false},{x:9,y:0},opts).distance,0);
}
// Queue admission and active-play timing; callbacks observe epoch and pooled identity.
{
 const s=scene(),t=s._taro;let calls=0;assert.equal(s.taroSchedule('bomb',.45,()=>calls++),null,'dormant T1');t.enabled=true;
 for(let i=0;i<3;i++)assert(s.taroSchedule('bomb',.45,()=>calls++));assert.equal(s.taroSchedule('bomb',.45,()=>calls++),null);
 for(let i=0;i<8;i++)assert(s.taroSchedule('shrapnel',.08,()=>calls++));assert.equal(s.taroSchedule('shrapnel',.08,()=>calls++),null);
 s.state='levelup';s.tickTaroCombat(.05);assert.equal(t.time,0);s.state='play';s.tickTaroCombat(5);assert.equal(t.time,0,'no background catch-up');
 for(let i=0;i<2;i++)s.tickTaroCombat(.05);assert.equal(calls,8);for(let i=0;i<7;i++)s.tickTaroCombat(.05);assert.equal(calls,8);s.tickTaroCombat(.05);assert.equal(calls,11);
 const e=enemy(1),token=a.taroEnemyToken(e);s.taroSchedule('repeat',.01,()=>calls++,{token,range:520});e._taroSpawnId++;s.tickTaroCombat(.05);assert.equal(calls,11);
 s.taroSchedule('repeat',.01,()=>{calls++;s.clearTaroCombat();});s.taroSchedule('repeat',.01,()=>calls++);s.tickTaroCombat(.05);assert.equal(calls,12,'clear during callback invalidates remaining batch');
 const fast=scene();fast._taro.enabled=true;fast.gameSpeed=2;fast.taroSchedule('repeat',.09,()=>calls++);fast.tickTaroCombat(.05);assert.equal(calls,13,'queue uses game-time speed');
 assert.equal(fast.taroSchedule('unknown',0,()=>{}),null);assert.equal(fast.taroSchedule('bomb',NaN,()=>{}),null);
 const pause=scene();pause._taro.enabled=true;let resumed=0;pause.taroSchedule('repeat',.01,()=>{pause.state='levelup';});pause.taroSchedule('repeat',.01,()=>resumed++);pause.tickTaroCombat(.05);assert.equal(resumed,0);assert.equal(pause._taro.jobs.length,1,'pause inside first callback holds second event');pause.state='play';pause.tickTaroCombat(.05);assert.equal(resumed,1);
 const swap=scene();swap.character='mint';swap.tickTaroCombat(.05);assert.equal(swap._taro,null,'even dormant state clears on hero change');
}
// Nested terminal context cannot be downgraded; exceptions restore previous context.
{
 const s=scene();s._taro.enabled=true;assert(!s.taroIsSecondary());
 s.taroWithDamage('bomb',()=>{assert(s.taroIsSecondary());s.taroWithDamage('chain',()=>assert(s.taroIsSecondary()));assert(s.taroIsSecondary());});assert(!s.taroIsSecondary());
 assert.throws(()=>s.taroWithDamage('nova',()=>{throw Error('failure');}),/failure/);assert(!s.taroIsSecondary());
 assert.throws(()=>s.taroWithDamage('unknown',()=>{}),/Unknown/);
 let calls=0;let carried;s.taroWithDamage('bomb',()=>{carried=s.taroCarryContext(()=>{calls++;assert(s.taroIsSecondary());});});carried();assert.equal(calls,1);s.clearTaroCombat();carried();assert.equal(calls,1,'carried context dies with run');
 const other=scene();other.character='mint';other._taroDamageContext={terminal:true};assert(!other.taroIsSecondary());
}
// Direct dispatch guard and accepted damage use the central adapter exactly once.
{
 const s=scene(),e=enemy(1),token=a.taroEnemyToken(e);let calls=0;s.damage=()=>{calls++;assert(s.taroIsSecondary());};
 assert(!s.taroDealDamage(token,10,'bomb'));s._taro.enabled=true;assert(s.taroDealDamage(token,10,'bomb'));assert.equal(calls,1);e._taroSpawnId++;assert(!s.taroDealDamage(token,10,'bomb'));
 const state=s._taro;state.charge=50;state.jobs.push({});s.basicAttack.path='unknown';s.syncTaroCombat();assert.equal(s._taro.charge,0);assert.equal(state.jobs.length,0);assert(!s._taro.enabled);const current=s._taro;s.syncTaroCombat();assert.equal(s._taro,current,'upgrade sync is idempotent');
 let destroyed=0;current.fx.add({active:true,destroy(){destroyed++;}});s.clearTaroCombat();s.clearTaroCombat();assert.equal(destroyed,1);
 const reused=enemy(10);s.tagTaroEnemy(reused);const old=a.taroEnemyToken(reused);s.tagTaroEnemy(reused);assert(!a.taroTargetValid(old,origin,520));
 let hooks=0,shutdown;const life=scene();life.events={on(){},off(){},once:(event,fn)=>{assert.equal(event,'shutdown');hooks++;shutdown=fn;}};life.syncTaroCombat();life.basicAttack.path='storm';life.syncTaroCombat();assert.equal(hooks,1);shutdown();assert.equal(life._taro,null);assert.equal(life._taroShutdownHook,false);
}
// Mixed hooks: terminal still receives scalar modifiers, healing and shields.
{
 const s=scene();s._taro.enabled=true;s.dist=(x,y,a,b)=>Math.hypot(x-a,y-b);s.modList=()=>[{kind:'bossBonus',mul:1.25},{kind:'nthHit',n:1,mul:3}];s.floatText=()=>{};
 assert.equal(s.modDmgMul(enemy(1,0,0,100,{isBoss:true})),3.75);assert.equal(s._modHits,1);
 s.taroWithDamage('repeat',()=>assert.equal(s.modDmgMul(enemy(1,0,0,100,{isBoss:true})),1.25));assert.equal(s._modHits,1,'secondary skips nth-hit counters');
 s._rel={splinter:true,leech:true,shell:true,trophy:true,harvest:true,burst:true};s.player.hp=50;s._shield=0;s._harvestKills=19;s.popHeal=()=>{};s.relicSyn=()=>false;
 s.taroWithDamage('bomb',()=>{s.relicOnCrit(enemy(1),10,0,0);s.relicOnKill(enemy(2,0,0,100,{isElite:true}));s.modOnHit(enemy(3));s.modOnKill(enemy(3));});
 assert.equal(s.player.hp,56);assert.equal(s._shield,1);assert.equal(s._harvestKills,0,'recovery still counts');assert.equal(s._burstN,undefined,'no recursive relic burst');
}
// Recipe classification and delayed recovery keep terminal provenance.
{
 ctx.FR_TRIGGERS=[];const s=scene();s._taro.enabled=true;s._fr=[{t:'crit',e:'shock',m:'repeat',next:0},{t:'crit',e:'heal',m:'repeat',next:0}];const scheduled=[],effects=[];s.time={delayedCall:(ms,fn)=>scheduled.push(fn)};s.frRun=r=>{effects.push(r.e);if(r.e==='heal')assert(s.taroIsSecondary());};
 s.taroWithDamage('nova',()=>s.fireRecipes('crit'));assert.deepEqual(effects,['heal']);assert.equal(scheduled.length,1);scheduled[0]();assert.deepEqual(effects,['heal','heal']);s.clearTaroCombat();scheduled[0]();assert.equal(effects.length,2);
}
// Forge terminal numeric bonuses remain; direct counters and consumables do not advance.
{
 const {fixture}=require('./forge-fixture.cjs'),f=fixture(),api=f.api;
 const s={character:'taro',elapsed:1,player:{hp:100,maxhp:100,x:0,y:0,armor:0,forgeMods:{5:20,25:30,27:30,46:20},body:{velocity:{x:0,y:0}}},enemies:{children:{iterate(){}}}};
 const state=api.forgeState(s);state.xpCharge=true;s._taroDamageContext={terminal:true};assert.equal(api.forgeDamage(s,enemy(1),10),12);assert.equal(state.hitCount,0);assert(state.xpCharge);
 delete s._taroDamageContext;assert(api.forgeDamage(s,enemy(2),10)>12);assert.equal(state.hitCount,1);assert(!state.xpCharge);
}
// Undo only explicit Tempest dispatch additions to verify the retained legacy bodies.
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/taro-t1-baseline.json','utf8'));
function legacyMethod(name){return method(name)
 .replace("    if(this.character==='taro')return this.castStormBeacon(dm,ul);\n",'')
 .replace('this.castTaroSpark(lvl)','this.castTaroSmiteBasic(lvl)').replace('this.castTaroSentry(lvl)','this.castTempestBasic(lvl)')
 .split('this.taroSwarmProfile(lvl)').join('this.taroTempestProfile(lvl)').replace("      if(this.character==='taro'&&!basic?.path){this.castTaroNeedle(lvl,dm);return;}\n",'').replace('taroGaleCooldown(this.basicAttack)','Math.pow(.94,Math.max(0,Math.min(3,this.basicAttack.lv?.p_gale||0)))')
 .replace("\n    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='smite'){this.pulseSkill(key);this.castTaroSmiteBasic(lvl);return;}",'')
 .replace("\n    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='smite')return this.taroTempestProfile(lvl).interval/(this.player.cdMul||1);",'')
 .replace("\n    if(this.character==='taro'&&this.basicAttack?.path==='smite')return this.castTaroPathUnique(dm,ul);",'')
 .replace("\n    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='storm'){this.pulseSkill(key);this.castTaroChainBasic(lvl);return;}",'')
 .replace("\n    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='storm')return this.taroTempestProfile(lvl).interval/(this.player.cdMul||1);",'')
 .replace("\n    if(this.character==='taro'&&this.basicAttack?.path==='storm')return this.castTaroPathUnique(dm,ul);",'')

 .replace("\n    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='tempest'){this.pulseSkill(key);this.castTempestBasic(lvl);return;}",'')
 .replace("\n    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='tempest')return this.taroTempestProfile(lvl).interval/(this.player.cdMul||1);",'')
 .replace("\n    if(this.character==='taro'&&this.basicAttack?.path==='tempest')return this.castTaroTempestUnique(dm,ul);",'')
 .replace(" if(this.character==='taro'&&this.basicAttack?.path==='tempest')return;const CP=",' const CP=')
 .replace("||(this.character==='taro'&&this.basicAttack?.path==='tempest'&&this.dashTime>0)",'')
 .replace("*(this.character==='taro'&&this.basicAttack?.path==='tempest'?Math.pow(.94,Math.max(0,Math.min(3,this.basicAttack.lv?.p_gale||0))):1)",'')
 .replace("    if(this.character==='taro'&&this.basicAttack?.path==='tempest')this.taroTempestDash(this.moveDir.clone().normalize());\n",'');}
for(const [name,hash] of Object.entries(baseline))assert.equal(crypto.createHash('sha256').update(legacyMethod(name)).digest('hex'),hash,name+' retained legacy branch');
assert(scene('tempest')._taro.enabled,'Tempest opts in');assert(scene('storm')._taro.enabled,'Chain opts in');assert(scene('smite')._taro.enabled,'Smite opts in');assert(!scene()._taro.enabled,'Pre-path stays dormant');
for(const n of ['resetRelics','clearArtVfx','die'])assert(method(n).includes('clearTaroCombat?.()'),n+' clears pending state');
for(const n of ['spawnEnemy','spawnElite','spawnMiniBoss','spawnBossEscorts','spawnFinalBoss'])assert(method(n).includes('tagTaroEnemy?.('),n+' changes generation');
assert(method('update').includes('suspendTaroCombat?.()'));assert(method('update').includes('tickTaroCombat?.(delta/1000)'));
console.log('Taro T1: priority/pool identity, pure bounded profiles, movement, queue timing/caps, context recursion and cleanup, mixed reward/proc adapters, Forge and recipe provenance, retained pre-path/Chain/Smite and Unique contracts passed');
