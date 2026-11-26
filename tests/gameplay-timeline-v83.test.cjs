'use strict';
const assert=require('node:assert/strict');
const {PHASES,enabled,initial,advance}=require('../scripts/gameplay-timeline-v83.cjs');
assert.equal(enabled({stageIndex:3}),false);
assert.equal(enabled({stageIndex:3,flag:true}),true);
for(const k of ['tutorial','recipe','rift','bossRush','replay'])assert.equal(enabled({stageIndex:3,flag:true,[k]:true}),false);
for(let i=0;i<5;i++)assert.equal(enabled({stageIndex:i,flag:true}),true);
for(const i of [-1,5,9])assert.equal(enabled({stageIndex:i,flag:true}),false);
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

const SpawnRuntime=vm.runInNewContext('class SpawnRuntime{'+['chapterVisibleSpawn','spawnWaveRing','spawnRise'].map(method).join('\n')+'\n}SpawnRuntime',{
 Math:Object.assign(Object.create(Math),{random:()=>0}),
 inMapPt:(x,y)=>[Math.max(-920,Math.min(920,x)),Math.max(-920,Math.min(920,y))],
 Phaser:{Math:{FloatBetween:(a,b)=>(a+b)/2},Utils:{Array:{GetRandom:a=>a[0]}}}
});
const spawning=new SpawnRuntime();
const view={x:-180,y:-390,width:360,height:780,contains(x,y){return x>=this.x&&x<=this.x+this.width&&y>=this.y&&y<=this.y+this.height;}};
const arrivals=[];
Object.assign(spawning,{_v83Run:true,mode:'wave',player:{x:0,y:0},W:360,H:780,viewZoom:1,
 cameras:{main:{worldView:view}},time:{now:100},
 spawnEnemy(type,angle,distance,arrival){arrivals.push({type,angle,distance,arrival});}
});
for(let i=0;i<48;i++){
 const p=spawning.chapterVisibleSpawn(i*Math.PI/24,280);
 assert(p&&Math.abs(p.x)<=148.00001&&Math.abs(p.y)<=290.00001&&p.distance>=92);
}
spawning.spawnWaveRing(6);
assert.equal(arrivals.length,6);
assert(arrivals.every(a=>a.arrival&&Math.cos(a.angle)>0),'an arriving group leaves the opposite half open');
assert(arrivals.every(a=>a.distance>=92&&a.distance<200),'portrait sides do not use screen height for spawn distance');
spawning.player.x=900;
view.x=720;
assert.equal(spawning.chapterVisibleSpawn(0,280),null,'map clamp cannot put a foe on top of the player');
arrivals.length=0;
spawning.spawnWaveRing(6);
assert.equal(arrivals.length,6);
assert(arrivals.every(a=>Math.cos(a.angle)<0),'invalid outward spawns move to the inward side');
const foe={};
spawning.spawnRise(foe,800,0,true);
assert.equal(foe._emergeUntil,520,'arrival grace covers the reveal before an auto attack can kill the foe');
const legacy={};
spawning.spawnRise(legacy,800,0);
assert.equal(legacy._emergeUntil,undefined);
spawning._v83Run=false;
arrivals.length=0;
spawning.spawnWaveRing(6);
assert.equal(arrivals.length,6);
assert(arrivals.every(a=>a.distance>400&&!a.arrival),'legacy waves keep their existing spawn rules');
console.log('Chapter 1 arrivals: portrait bounds, grouped pressure, safe map corners, reveal window and legacy isolation passed');
