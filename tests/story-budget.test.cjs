const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'(');assert(at>=0,n);const tail=src.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return src.slice(at,at+1+next.index);}
const ctx={Math,Save:{ancientHas:()=>false},Sfx:{xp(){}},ENDGAME_XP_MUL:1,STAGES:Array.from({length:15},()=>({waves:5})),Phaser:{Math:{FloatBetween:()=>15}}};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const STORY_WAVE_PLAN='),src.indexOf('const CHANGELOG =')),ctx);
const names=['usesStoryBudget','beginStoryBudget','storyTimedSwarm','storySpawnPace','storyLiveCap','storyCanSpawn','storySpawned','tickStage','spawnSwarm','settleStoryBudget','gainXp','bossHpMul','dropOrb','collectOrb'];
const Scene=vm.runInContext('class Scene{'+names.map(method).join('\n')+'\n}Scene',ctx);
function orb(){return {active:false,body:{enable:false,setAllowGravity(){}},setActive(x){this.active=x;return this;},setVisible(){return this;},setPosition(){return this;},setTint(){return this;},setRotation(){return this;},setDepth(){return this;},setScale(){return this;},clearTint(){}};}
function scene(stage=0){const s=new Scene();s.stageIndex=stage;s.player={xpMul:1};s.level=1;s.xp=0;s.xpNext=12;s.state='play';s.mode='wave';s.waveIndex=0;s.maxLive=100;s.pool=[];s.foes=[];
 s.enemies={countActive:()=>s.foes.filter(e=>e.active).length,children:{iterate:fn=>s.foes.forEach(fn)}};
 s.orbs={getFirstDead:()=>s.pool.find(o=>!o.active),create(){const o=orb();o.active=true;s.pool.push(o);return o;},children:{iterate:fn=>s.pool.forEach(fn)}};
 Object.assign(s,{orbStyle:()=>({tint:1,sc:1}),camWorld(){},checkUniqueAutoUpgrade(){},jelly(){},vfxLevelUp(){},fireRecipes(){},vfxCollectSparkle(){},lvlTxt:{setText(){}},openLevelUp(){this.state='levelup';}});return s;}
// Every story stage: fast completion and fully collected combat grant identical milestones.
for(let stage=0;stage<15;stage++)for(const style of ['fast','slow','uncollected']){
 const s=scene(stage);let issued=0;
 for(let w=0;w<5;w++){
  s.waveIndex=w;s.beginStoryBudget(w);const b=s._storyBudget;
  if(style!=='fast')for(let k=0;k<200;k++){s.dropOrb(0,0,3.3);if(style==='slow')s.pool.filter(o=>o.active).forEach(o=>s.collectOrb(s.player,o));}
  assert(b.issued<=b.combat+1e-8);s.settleStoryBudget();assert(b.done);assert(Math.abs(b.paid-b.total)<1e-7);assert(!s.pool.some(o=>o.active));
  const xp=s.xp;s.settleStoryBudget();assert.equal(s.xp,xp);assert.equal(s.level,[5,8,11,14,18][w]);s.state='play';issued+=b.issued;
 }
 assert.equal(issued,1020);assert.equal(s.pendingLvl,17);assert(s.xp<1e-7);
}
// All direct spawn paths share quota/cap; objective targets can still spawn after exhaustion.
{const s=scene(2);s.beginStoryBudget(0);for(let k=0;k<s._storyBudget.quota;k++){assert(s.storyCanSpawn());s.storySpawned();}assert(!s.storyCanSpawn());assert(s.storyCanSpawn(true));s.foes=Array.from({length:18},()=>({active:true}));assert(!s.storyCanSpawn(true));s.foes=[{active:true,shooter:true},{active:true,shooter:true}];s._storyBudget.spawned=0;assert(!s.storyCanSpawn(false,'shooter'));assert(s.storyCanSpawn(false,'basic'));s.waveObjective={type:'hunt'};assert.equal(s.storyLiveCap(),14);}
// Full orb pool does not consume budget. Old references cannot pay a fresh wave twice.
{const s=scene();s.beginStoryBudget(0);s.orbs.create=()=>null;s.dropOrb(0,0,20);assert.equal(s._storyBudget.issued,0);s.settleStoryBudget();assert.equal(s.level,5);}
// Replay keeps one 240-enemy quota across mini and resumes, with partial then full settlement.
{const s=scene(14);s._replayMeter={};s.beginStoryBudget(1);s.storySpawned();const b=s._storyBudget;s.settleStoryBudget(390/1020);assert.equal(s.level,11);assert(!b.done);s.beginStoryBudget(3);assert.equal(s._storyBudget,b);assert.equal(b.spawned,1);s.settleStoryBudget();assert.equal(s.level,18);}
// EXP multipliers apply equally to combat and completion.
{const s=scene();s.player.xpMul=1.5;s.beginStoryBudget(0);s.dropOrb(0,0,20);s.collectOrb(s.player,s.pool[0]);s.settleStoryBudget();assert.equal(s.level,6);assert.equal(s.xp,6);}
for(const flag of ['recipeMode','riftMode','bossRush','endlessMode','_inTutorial']){const s=scene(2);s[flag]=true;s.beginStoryBudget(0);assert.equal(s._storyBudget,null);assert(s.storyCanSpawn());s.gainXp(12);assert.equal(s.xpNext,flag==='recipeMode'?21:25);}
{const s=scene();s.level=18;s._powerGuide={enemyHp:1};assert.equal(s.bossHpMul(),1.425);s.recipeMode=true;assert.equal(s.bossHpMul(),1.935);}
assert(method('spawnEnemy').includes('storyCanSpawn?.(false,type)'));assert(method('spawnEnemy').includes('storySpawned?.()'));
assert(method('spawnElite').includes('storyCanSpawn?.(objective)'));assert(method('spawnObjectiveElite').includes('spawnElite(false,true)'));
assert(!method('startStoryStage').includes('showMintWarning'));assert(method('spawnFinalBoss').indexOf("state==='levelup'")<method('spawnFinalBoss').indexOf('bossAdds'));
assert(method('completeWaveObjective').includes('clearEnemies();this.settleStoryBudget()'));
console.log('Story budgets: all 15 stages, fast/slow/uncollected EXP parity, Lv5/8/11/14/18, 17 queued cards, finite shared spawn caps, objective reserve, replay/mini, orb failure, multipliers and Endgame exclusions passed');

assert(method('spawnBossEscorts').includes('storyCanSpawn?.()'));assert(method('spawnBossEscorts').includes('storySpawned?.()'));

// Actual stage director: a high-clear build must still receive groups in the final 5 seconds.
for(const fast of [true,false])for(const stage of [0,2,6,14]){
 const s=scene(stage);s.waveIndex=1;s.beginStoryBudget(1);s.maxLive=60;s.waveTimer=s.waveDur=50;s.spawnAcc=0;s.swarmAcc=10;s.waveObjective={type:'survive',done:false};s.waveAllowsElite=false;
 s.timeTxt={text:'',setText(t){this.text=t;}};Object.assign(s,{tickJackpotEvent:()=>false,tickWaveObjective(){},checkEndgameCurse:()=>false,wavePressure:()=>0,tickSeasonArena(){},tickRootThrone(){},showBanner(){},onWaveCleared(){this.mode='breather';}});
 let created=0,late=0,surges=0;s.spawnWaveRing=n=>{if(n>=10)surges++;for(let k=0;k<n;k++){if(!s.storyCanSpawn())break;s.storySpawned();s.foes.push({active:true});created++;if(s.waveTimer<5)late++;}};
 s.completeWaveObjective=()=>{s.waveObjective.done=true;s.mode='waveclear';s.foes=[];s.settleStoryBudget();};
 ctx.Sfx.bossWarn=()=>{};
 for(let t=0;t<501&&s.mode==='wave';t++){
  if(fast){for(const e of s.foes){if(e.active){e.active=false;s.dropOrb(0,0,3);}}s.pool.filter(o=>o.active).forEach(o=>s.collectOrb(s.player,o));s.state='play';}
  s.tickStage(.1);assert(s.enemies.countActive()<=s.maxLive);assert(s.enemies.countActive()<=s.storyLiveCap());
 }
 assert.equal(s.mode,'waveclear');if(fast){assert(created>s._storyBudget.quota);assert(late>0);assert(surges>=2);}
 assert(Math.abs(s._storyBudget.paid-126)<1e-7);const old=created;s.tickStage(.1);assert.equal(created,old);
}
// Quota exemption is only the live timed Swarm; expiration, objectives and special modes retain guards.
{const s=scene();s.waveIndex=1;s.beginStoryBudget(1);s._storyBudget.spawned=999;s.waveTimer=10;s.waveObjective={type:'survive'};assert(s.storyCanSpawn());s.waveTimer=0;assert(!s.storyCanSpawn());s.waveTimer=10;s._replayMeter={};assert(!s.storyTimedSwarm());assert(!s.storyCanSpawn());s._replayMeter=null;s.waveObjective={type:'capture'};assert(!s.storyCanSpawn());}
console.log('Swarm director: actual tick loop across four stages, fast/slow clear, late countdown spawns, surge pulses, live caps, unchanged EXP and timed-only exemption passed');
