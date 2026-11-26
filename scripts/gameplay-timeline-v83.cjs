// Experimental pure timeline; not wired into the Phaser runtime.
'use strict';
const PHASES=Object.freeze([
  {id:'warmup',seconds:24},{id:'pressure',seconds:35},
  {id:'mini',seconds:null},{id:'recovery',seconds:20},
  {id:'escalation',seconds:60},{id:'swarm',seconds:45},
  {id:'boss',seconds:null}
].map(Object.freeze));
function enabled(o={}) {
  return o.flag===true && Number.isInteger(o.stageIndex) && o.stageIndex>=0 && o.stageIndex<5 && !o.tutorial && !o.recipe && !o.rift && !o.bossRush && !o.replay;
}
function initial(){return {index:0,elapsed:0,combatSeconds:0,done:false};}
function advance(state,dt,{playing=true,bossDefeated=false}={}){
  if(!playing||state.done)return state;
  if(!Number.isFinite(dt)||dt<0)throw new RangeError('Invalid delta');
  const p=PHASES[state.index];
  const next={...state,combatSeconds:state.combatSeconds+dt};
  if(p.seconds===null){
    if(bossDefeated){if(state.index===PHASES.length-1)next.done=true;else{next.index++;next.elapsed=0;}}
    return next;
  }
  next.elapsed=Math.min(p.seconds,state.elapsed+dt);
  if(next.elapsed>=p.seconds){next.index++;next.elapsed=0;}
  return next;
}
module.exports={PHASES,enabled,initial,advance};
