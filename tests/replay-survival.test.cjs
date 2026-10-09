const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
const names=['usesReplaySurvival','startReplayRun','beginReplaySwarm','replayOnKill','tickReplayProgress','startWave','onWaveCleared'];
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const Save={data:{stageMastery:{1:1}}},STAGES=[{miniAt:2,waves:5},{miniAt:2,waves:5}];
const ctx={Save,STAGES,RECIPE_HUNGER_CAP:180,STAGE_STORY_BEATS:[],Sfx:new Proxy({},{get:()=>()=>{}})};vm.createContext(ctx);
const C=vm.runInContext('class Replay{'+names.map(method).join('\n')+'\n}\nReplay',ctx);
function scene(){const s=new C();Object.assign(s,{stageIndex:1,state:'play',mode:'breather',waveIndex:0,bossUI:[],scheduled:[],clearWaveObjective(){this.waveObjective=null;},scheduleStageEvent(t,m,f){this.scheduled.push({t,m,f});},showBanner(){},renderReplayProgress(){},updateWaveText(){},clearFoes(){},clearEnemies(){},clearPickups(){},poseFlash(){},spawnMiniBoss(){this.miniSpawns=(this.miniSpawns||0)+1;},spawnFinalBoss(){this.bossSpawns=(this.bossSpawns||0)+1;},openCrossroads(next){this.choiceNext=next;},startSurvivalWave(w){this.swarmWave=w;},playWaveCutscene(){this.normalStory=true;},beginWave(){}});return s;}
const s=scene();assert(s.usesReplaySurvival());for(const key of ['_inTutorial','recipeMode','riftMode','bossRush','endlessMode']){s[key]=true;assert(!s.usesReplaySurvival(),key);s[key]=false;}s.stageIndex=0;assert(!s.usesReplaySurvival());s.stageIndex=1;
s.startReplayRun(STAGES[1]);const m=s._replayMeter;s.scheduled.shift().f();assert.equal(s.mode,'wave');assert.equal(s.waveObjective,null);
s.replayOnKill({});assert.equal(m.kills,0.75);s.replayOnKill({isElite:true});assert.equal(m.kills,6.75);s.replayOnKill({isMini:true});s.replayOnKill({isBoss:true});assert.equal(m.kills,6.75);
m.kills=m.goal;s.tickReplayProgress(1);assert.equal(s.mode,'miniWarning');assert(!m.done);s.scheduled.shift().f();assert.equal(s.miniSpawns,1);
s.mode='mini';s.onWaveCleared(false,true);assert(m.miniDone);assert.equal(s.mode,'breather');s.scheduled.shift().f();assert.equal(s.swarmWave,3);assert.equal(s.choiceNext,undefined);
s.startWave(3,false);assert.equal(s._replayMeter,m);assert.equal(s.waveObjective,null);assert.equal(s.mode,'wave');s.tickReplayProgress(1);assert.equal(s.mode,'bossWarning');assert(m.done);s.scheduled.shift().f();assert.equal(s.bossSpawns,1);s.tickReplayProgress(100);assert.equal(s.scheduled.length,0);
const slow=scene();slow.startReplayRun(STAGES[1]);slow.scheduled.shift().f();slow.tickReplayProgress(90);assert.equal(slow.mode,'miniWarning');slow.scheduled.shift().f();slow.onWaveCleared(false,true);slow.scheduled.shift().f();slow.startWave(3);slow.tickReplayProgress(90);assert.equal(slow.mode,'bossWarning');
const first=scene();first.stageIndex=0;first.startWave(0,false);assert(first.normalStory);assert.equal(first._replayMeter,undefined);
console.log('Replay survival: mastery/special-mode routing, kills, mandatory midpoint miniboss, reward continuation, single final boss, safety cap and first-clear story passed');
