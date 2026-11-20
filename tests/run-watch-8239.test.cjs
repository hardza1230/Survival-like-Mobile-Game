// v8.2.39 owner 🐞: after getting Mint at 1-2, tapping the hero froze — stage loading never called back, the Heroes screen had no buttons
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
let now=0;const timers=[];
const ctx={Date:{now:()=>now},setTimeout:(f,ms)=>timers.push({at:now+ms,f}),window:{GameLoader:{shown:0,hidden:0,show(){this.shown++;},hide(){this.hidden++;}}},document:{getElementById:()=>({style:{display:'none',opacity:'0'}})},Tele:{ev(){}}};
vm.createContext(ctx);vm.runInContext('const RUN_WAIT_MAX=45000;class K{'+meth('runWatch')+'\n};this.K=K;',ctx);
const run=ms=>{const end=now+ms;for(;;){timers.sort((a,b)=>a.at-b.at);const t=timers[0];if(!t||t.at>end)break;timers.shift();now=t.at;t.f();}now=end;};
// hung load → forced start after 45 s
let s=new ctx.K();s.state='menu';s._enteringStageArt=true;s.started=[];s.startRun=i=>s.started.push(i);
s.runWatch(4);assert(ctx.window.GameLoader.shown>=1,'loader shown while waiting');run(44000);assert.strictEqual(s.started.length,0);
run(2000);assert.strictEqual(JSON.stringify(s.started),'[4]','forced start');assert.strictEqual(s._runForce,4);assert.strictEqual(s._enteringStageArt,false);assert(ctx.window.GameLoader.hidden>=1);
// load finished in time → no forced start
s=new ctx.K();s.state='menu';s._enteringStageArt=true;s.started=[];s.startRun=i=>s.started.push(i);s.runWatch(2);run(3000);s._enteringStageArt=false;run(60000);assert.strictEqual(s.started.length,0,'no force when done');
// a newer wait replaces the old watchdog
s=new ctx.K();s.state='menu';s._enteringStageArt=true;s.started=[];s.startRun=i=>s.started.push(i);s.runWatch(1);run(30000);s.runWatch(1);run(30000);assert.strictEqual(s.started.length,0,'timer restarts per wait');run(16000);assert.strictEqual(s.started.length,1);
// wiring
for(const h of ["const force=this._runForce===idx;","if(!this._allLoaded&&!force){ if(this._enteringStageArt)return;this._enteringStageArt=true;this.runWatch(idx);","if(!force&&Date.now()-(this._runArtTry||0)>25000)","if(!force&&(!this._stageArtReady","this._enteringStageArt=true;this.runWatch(idx); this.warmStageTextures(idx,()=>{ this._enteringStageArt=false;"])assert(src.includes(h),h);
console.log('Run watchdog 8.2.39: loader shown, forced start after 45 s, no force when loaded, per-wait timer passed');
