// Artwork must be ready before play. A stall offers recovery, never a forced fallback start.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
let now=0;const timers=[];const ctx={Date:{now:()=>now},setTimeout:(f,ms)=>timers.push({at:now+ms,f}),window:{GameLoader:{shown:0,show(){this.shown++;}}},document:{getElementById:()=>({style:{display:'none',opacity:'0'}})}};
vm.createContext(ctx);vm.runInContext('const RUN_WAIT_MAX=45000;class K{'+meth('runWatch')+'};this.K=K;',ctx);
const run=ms=>{const end=now+ms;for(;;){timers.sort((a,b)=>a.at-b.at);const t=timers[0];if(!t||t.at>end)break;timers.shift();now=t.at;t.f();}now=end;};
function scene(){const s=new ctx.K();Object.assign(s,{state:'menu',_enteringStageArt:true,failed:[],started:[],startRun(i){this.started.push(i);},stageLoadFailure(i,keys,reason){this.failed.push({i,reason});this._enteringStageArt=false;}});return s;}
let s=scene();s.runWatch(4);assert(ctx.window.GameLoader.shown>0);run(44000);assert.equal(s.failed.length,0);run(2000);assert.equal(s.failed.length,1);assert.equal(s.failed[0].reason,'preparation_stalled');assert.equal(s.started.length,0);assert.equal(s._runForce,undefined);
s=scene();s.runWatch(2);run(3000);s._enteringStageArt=false;run(60000);assert.equal(s.failed.length,0);
s=scene();s.runWatch(1);run(30000);s.runWatch(1);run(30000);assert.equal(s.failed.length,0);run(16000);assert.equal(s.failed.length,1);
s=scene();s.runWatch(1);run(40000);s._stageArtProgressAt=now;run(40000);assert.equal(s.failed.length,0,'healthy progress extends preparation');s._enteringStageArt=false;
assert(!src.includes('const force=this._runForce===idx;'));assert(src.includes('if(!this.battleArtReady(idx))'));assert(!src.includes('Date.now()-(this._runArtTry||0)>25000'));
console.log('Run watchdog: no forced placeholder start, recoverable stall, progress extension, completed/cancelled waits and timer ownership passed');
