'use strict';
const assert=require('node:assert/strict');
const {PHASES,enabled,initial,advance}=require('../scripts/gameplay-timeline-v83.cjs');
assert.equal(enabled({stageIndex:3}),false);
assert.equal(enabled({stageIndex:3,flag:true}),true);
for(const k of ['tutorial','recipe','rift','bossRush','replay'])assert.equal(enabled({stageIndex:3,flag:true,[k]:true}),false);
assert.equal(enabled({stageIndex:2,flag:true}),false);
let s=initial();assert.equal(advance(s,99,{playing:false}),s);
s=advance(s,30);assert.equal(PHASES[s.index].id,'pressure');
s=advance(s,45);assert.equal(PHASES[s.index].id,'mini');
s=advance(s,100);assert.equal(PHASES[s.index].id,'mini');
s=advance(s,0,{bossDefeated:true});assert.equal(PHASES[s.index].id,'recovery');
for(const dt of [30,75,60])s=advance(s,dt);
assert.equal(PHASES[s.index].id,'boss');assert.equal(s.done,false);
s=advance(s,0,{bossDefeated:true});assert.equal(s.done,true);
assert.equal(advance(s,10),s);
assert.throws(()=>advance(initial(),-1),RangeError);
console.log('Gameplay timeline contracts passed');

// Exercise the actual Phaser scene methods with a controlled stage clock.
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8').replace(/\r\n/g,'\n');
function method(name){
 const start=source.indexOf('  '+name+'(');
 const rest=source.slice(start+1);
 const next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(rest);
 return source.slice(start,start+1+next.index);
}
const names=['continuousCombatWaveText','settleStoryBudget','onWaveCleared'];
const Runtime=vm.runInNewContext('class Runtime{'+names.map(method).join('\n')+'\n}\nRuntime',{
 STAGES:[null,null,null,{waves:5}],
 Sfx:{bgmIntense(){},playStageBgm(){}}
});
function runtime(){
 const run=new Runtime();
 Object.assign(run,{
  _v83Run:true,_lootTok:3,stageIndex:3,waveIndex:3,waveTimer:105,bossUI:[],events:[],xp:0,
  _storyBudget:{reward:72,questPaid:20,paid:40},
  usesStoryBudget(){return true;},gainXp(n){this.xp+=n;},
  clearWaveObjective(){},scheduleStageEvent(delay,mode,fn){this.events.push({delay,mode,fn});},
  startWave(index,seamless){this.started={index,seamless};}
 });
 return run;
}
const active=runtime();
assert.equal(active.continuousCombatWaveText(),'Recovery \u00b7 30s');
active.waveTimer=75;
assert.equal(active.continuousCombatWaveText(),'Escalation \u00b7 75s');
active.onWaveCleared(true,false);
assert.equal(active.xp,52);
assert.equal(active._storyBudget.paid,92);
active.settleStoryBudget(true);
assert.equal(active.xp,52);
assert.equal(active.events.length,1);
active.events[0].fn();
assert.deepEqual({...active.started},{index:4,seamless:true});
const restarted=runtime();
restarted.onWaveCleared(true,false);
restarted._lootTok++;
restarted.events[0].fn();
assert.equal(restarted.started,undefined);
console.log('Stage 4 runtime: phase HUD, one EXP settlement, seamless successor and stale timer guard passed');
