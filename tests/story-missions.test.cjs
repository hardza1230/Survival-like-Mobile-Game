const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'(');assert(at>=0,n);const next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+1));return src.slice(at,at+1+next.index);}
const ctx={Math,Sfx:{clear(){}},Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}}};vm.createContext(ctx);
const Scene=vm.runInContext('class Scene{'+['startStoryHuntRound','objOnKill','ensureHuntTarget','onWaveObjectiveTargetDown','completeWaveObjective','renderWaveObjectiveHUD','usesStoryBudget','storyCanSpawn'].map(method).join('\n')+'\n}Scene',ctx);
function scene(stage){const s=new Scene();Object.assign(s,{stageIndex:stage,waveIndex:3,state:'play',mode:'wave',time:{now:0},sugarStage:0,sugarRun:0,W:800,waveObjective:{type:'hunt',progress:0,target:3,done:false,color:1},huntTargetActive(){return !!this.liveTarget;},showBanner(){},endHuntCurse(){},renderBonusHUD(){},resolveBonusChallenge(){this.bonuses=(this.bonuses||0)+1;},clearWaveObjective(){this.waveObjective=null;},clearFoes(){},clearEnemies(){},settleStoryBudget(success){assert(success);this.settlements=(this.settlements||0)+1;},spawnObjectiveElite(){if(this.blockSpawn){this.waveObjective._huntSpawnAt=this.time.now+1000;return;}this.liveTarget=true;this.spawns=(this.spawns||0)+1;}});const text={setText(t){s.hud=t;return this;},setVisible(){return this;},setColor(){return this;}};s.waveObjTxt=text;s.waveObjBg={setVisible(){}};s.waveObjBar={setVisible(){return this;},setFillStyle(){return this;}};return s;}
for(let stage=0;stage<15;stage++){
 const s=scene(stage),o=s.waveObjective;s.startStoryHuntRound(o);assert.equal(o._huntKillGoal,6+2*Math.floor(stage/5));
 for(let round=0;round<3;round++){
  s.ensureHuntTarget();assert(!s.liveTarget);s.objOnKill({isMini:true});s.objOnKill({_waveObjectiveTarget:true});assert.equal(o._huntKills,0);
  for(let k=0;k<o._huntKillGoal;k++)s.objOnKill({});assert.equal(o._huntPhase,'elite');assert(s.hud.includes('Defeat marked Elite'));assert.equal(s.settlements,undefined);
  s.state='levelup';s.ensureHuntTarget();assert(!s.liveTarget);s.state='play';s.blockSpawn=true;s.ensureHuntTarget();assert(!s.liveTarget);s.blockSpawn=false;s.time.now+=1000;s.ensureHuntTarget();assert(s.liveTarget);
  s.liveTarget=false;s.ensureHuntTarget();assert(s.liveTarget);assert.equal(o.progress,round);s.liveTarget=false;s.onWaveObjectiveTargetDown({});
  if(round<2){assert.equal(o._huntPhase,'clear');assert.equal(o._huntKills,0);assert(s.hud.includes('Clear 0/'));}
 }
 assert.equal(s.settlements,1);assert.equal(s.bonuses,1);assert.equal(s.mode,'waveclear');s.completeWaveObjective();assert.equal(s.settlements,1);
}
// Exhausted reserves may replace only the foes still needed by an unfinished gate.
{const s=scene(4);s.startStoryHuntRound(s.waveObjective);s._storyBudget={quota:72,spawned:72,done:false};s.storyTimedSwarm=()=>false;s.storyLiveCap=()=>24;let live=0;s.enemies={countActive:()=>live,children:{iterate(){}}};assert(s.storyCanSpawn());live=6;assert(!s.storyCanSpawn());live=24;assert(!s.storyCanSpawn(true));live=0;s.waveObjective._huntPhase='elite';assert(!s.storyCanSpawn());assert(s.storyCanSpawn(true));s.waveObjective._huntPhase='clear';s._storyBudget.done=true;assert(!s.storyCanSpawn());}
// Opening fill becomes a showdown without clearing foes, XP, bonus or pickup state.
{const s=scene(0);s.waveObjective={type:'fill',progress:2,target:2,color:1};s._fieldDrops={hearts:2};s.completeWaveObjective();assert.equal(s.waveObjective.type,'hunt');assert.equal(s.waveObjective._huntPhase,'elite');assert.equal(s.waveObjective.target,1);assert.equal(s.settlements,undefined);assert.equal(s.sugarRun,0);assert.equal(s._fieldDrops.hearts,2);s.onWaveObjectiveTargetDown({});assert.equal(s.settlements,1);}
// Other modes keep the single-step fill flow.
for(const flag of ['recipeMode','riftMode','bossRush','endlessMode','_inTutorial']){const s=scene(0);s[flag]=true;s.waveObjective={type:'fill'};s.completeWaveObjective();assert.equal(s.waveObjective,null);assert.equal(s.settlements,undefined);}
console.log('P3 staged missions: all 15 stages, exact kill gates, sequential Elite rounds, pause/pool/missing target recovery, HUD, single final reward, fill showdown and special-mode isolation passed');
