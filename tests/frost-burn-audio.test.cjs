const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'(');assert(at>=0,n);const next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(source.slice(at+1));return source.slice(at,at+1+next.index);}
const cues=[],ctx={performance:{now:()=>1000},UNIQUE_MAX_LV:3,uniqueAt:{2:6,3:12},CHARACTERS:{mint:{unique:'ice'}},UNIQUE_TIERS:{ice:{2:'better',3:'best'}},Sfx:{rewardCue:(...args)=>cues.push(args)}};
const Scene=vm.runInNewContext('class Scene{'+['applyFrostBurn','tickFrostBurn','stopEnemyPresentation','checkUniqueAutoUpgrade'].map(method).join('\n')+'}Scene',ctx);
const s=new Scene(),hits=[];Object.assign(s,{time:{now:0},basicAttack:{path:'glacier'},floatText(){},damage(e,n){hits.push(n);e.hp-=n;assert.equal(this._infTick,true);assert.equal(this._frDmg,true);assert.equal(this._frBusy,true);}});
const enemy=()=>({active:true,hp:10000,x:0,y:0});let e=enemy();for(let i=0;i<9;i++)s.applyFrostBurn(e,100);assert.equal(e._frostBurnStacks,5);assert.equal(e._frostBurnUntil,8000);
s.tickFrostBurn(e,.49);assert.equal(hits.length,0);s.tickFrostBurn(e,.01);assert.equal(hits.at(-1),20);assert.equal(s._infTick,undefined);assert.equal(s._frBusy,undefined);
e._phaseInvuln=1;s.tickFrostBurn(e,.5);assert.equal(hits.length,1);e._phaseInvuln=0;e._phaseGateLocked=true;s.tickFrostBurn(e,.5);assert.equal(hits.length,1);e._phaseGateLocked=false;
s.time.now=8000;s.tickFrostBurn(e,.5);assert.equal(e._frostBurnStacks,0);assert.equal(hits.length,1);s.applyFrostBurn(e,100);assert.equal(e._frostBurnStacks,1);
s.basicAttack.path='pierce';const other=enemy();s.applyFrostBurn(other,100);assert.equal(other._frostBurnStacks,undefined);s.basicAttack.path='glacier';other._phaseInvuln=1;s.applyFrostBurn(other,100);assert.equal(other._frostBurnStacks,undefined);
// Pool release clears all DoT fields and delayed-hit token.
Object.assign(e,{rotation:0,setScale(){},setAlpha(){},clearTint(){}});s.tweens={killTweensOf(){}};s.stopEnemyPresentation(e);assert.equal(e._frostBurnStacks,0);assert.equal(e._frostBurnPower,0);assert.equal(e._frostBurnUntil,0);
// Rank-up resets cooldown and dispatches exactly one prominent notice; repeated check is silent.
const notices=[];Object.assign(s,{level:6,uniqueLevel:1,character:'mint',uniqueCd:99,uniqueInfo:()=>({name:'Ice',color:1}),refreshUniqueSkillUI(){},showBanner(){},uniqueRankNotice:(...a)=>notices.push(a),playGrowthWorld(){}});s.checkUniqueAutoUpgrade();assert.equal(s.uniqueLevel,2);assert.equal(s.uniqueCd,0);assert.equal(notices.length,1);assert.equal(cues.length,1);s.checkUniqueAutoUpgrade();assert.equal(cues.length,1);
// Independent controlled channels do not recreate on progress updates or stop each other.
const voices=[],a=source.indexOf('const Sfx = {'),b=source.indexOf('\n};',a)+3;const audioCtx={window:{__g:{cache:{audio:{exists:()=>true}},sound:{add(key,opts){const v={key,opts,isPlaying:false,once(){},setVolume(x){this.volume=x;},setRate(x){this.rate=x;},play(){this.isPlaying=true;},stop(){this.isPlaying=false;},destroy(){this.destroyed=true;}};voices.push(v);return v;}}}},performance:{now:()=>1000},setTimeout,clearTimeout,Math};
const S=vm.runInNewContext(source.slice(a,b)+'\nSfx',audioCtx);S.eventLoopStart('event_capture_charge',.2,.8);S.eventLoopStart('event_capture_charge',.3,1.2);assert.equal(voices.length,1);assert.equal(voices[0].rate,1.2);
S.eventLoopStart('event_mint_ice_charge',.2);assert.equal(voices.length,2);assert(voices[0].isPlaying);S.eventLoopStop('event_mint_ice_charge');assert(voices[0].isPlaying);assert(voices[1].destroyed);
S.eventLoopStop();assert(voices[0].destroyed);S.muted=true;S.eventLoopStart('event_capture_charge');assert.equal(voices.length,2);S.muted=false;S.sv=0;S.eventLoopStart('event_capture_charge');assert.equal(voices.length,2);
S.sv=1;S.slotSpin();const spin=voices.at(-1);S.slotReward(true);assert(spin.destroyed);assert.equal(voices.at(-1).key,'sfx_event_slot_reward_power');S.rewardCue('sfx_event_unique_rank_up');assert(voices.at(-2).destroyed,'next principal cue replaces previous tail');
console.log('Frost Burn: caps, expiry, phase immunity, pool reset, rank notice, independent loop channels and Slot stop-before-result passed');
