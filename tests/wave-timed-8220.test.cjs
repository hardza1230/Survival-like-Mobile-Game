// v8.2.20 เจ้าของ 19 พ.ย. ขั้น A: เวฟจบด้วยเวลา · ภารกิจเสร็จก่อน = รางวัลเต็ม + เวฟปิดใน 8 วิ · หมดเวลา ≥50% = ครึ่ง · + เสียงยิง Momo / กระสุนมด C1-1
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const K=src.match(/const [A-Z][A-Z0-9_]*=[^\n]*?GG_GOLD=[^\n]*?;(?=   \/\/)/)[0].replace(/^const /,'var ');
const ctx={Math,console};vm.createContext(ctx);vm.runInContext(K,ctx);vm.runInContext('class S{'+['waveTimedSetup','expireWaveObjective'].map(m).join('')+'};this.K=S;',ctx);
const mk=(story=true)=>{const sc=new ctx.K();Object.assign(sc,{stageIndex:2,waveIndex:1,sugarStage:0,sugarRun:0,waveDur:50,waveTimer:50,usesStoryBudget:()=>story,missionLootBurst(){sc.burst=(sc.burst||0)+1;},clearWaveObjective(){sc.cleared=true;sc.waveObjective=null;},clearFoes(){},clearEnemies(){},settleStoryBudget(c,p){sc.settled=[c,p];},showBanner(t){sc.banner=t;}});return sc;};
{ const sc=mk(),o={type:'frozenPantry',target:30,progress:0};assert.ok(sc.waveTimedSetup(o)&&sc._waveTimed&&sc.waveTimer===ctx.MISSION_WAVE_DUR.frozenPantry,'mission wave gets its own timer'); }
{ const sc=mk(),o={type:'survive',target:50};assert.ok(!sc.waveTimedSetup(o)&&!sc._waveTimed,'survive keeps its own timer'); }
{ const sc=mk(false),o={type:'hunt'};assert.ok(!sc.waveTimedSetup(o),'not in Delve / replay'); }
{ const sc=mk();sc._replayMeter={};assert.ok(!sc.waveTimedSetup({type:'hunt'}),'not on replay meter'); }
{ const sc=mk(),o={type:'lastLight',target:90};sc.waveTimedSetup(o);assert.ok(sc.waveTimer>=115,'time-goal missions get their goal + 25s'); }
{ const sc=mk(),o={type:'hungerHerald',_timedGoal:true,target:60,desc:'x · last 60s'};sc.waveTimedSetup(o);assert.strictEqual(o.target,sc.waveTimer-1,'Herald lasts the whole wave');assert.ok(o.desc.endsWith('last '+o.target+'s')); }
{ const sc=mk(),o={type:'hunt',target:10,progress:6};sc.waveObjective=o;const su=sc.expireWaveObjective();assert.ok(su>0&&sc.sugarRun===su&&sc.burst===1&&o.done&&sc.mode==='waveclear','≥50% done = half reward');assert.deepStrictEqual(sc.settled,[true,false]); }
{ const sc=mk(),o={type:'hunt',target:10,progress:3};sc.waveObjective=o;assert.strictEqual(sc.expireWaveObjective(),0);assert.ok(!sc.burst&&sc.sugarRun===0&&sc.settled[1]===true,'<50% = no mission reward, partial EXP'); }
const T=m('tickStage'),C=m('completeWaveObjective');
assert.ok(T.includes("_timed=!this._replayMeter&&(!_obj||_obj.type==='survive'||!!this._waveTimed)"),'timed waves count down');
assert.ok(T.includes('else if(_o)this.expireWaveObjective();')&&T.includes("else if(_o&&_o._timedGoal&&_o.type==='hungerHerald')this.hhFinish?.(_o,this._sig);"),'timer end: expire / Herald finish');
assert.ok(C.includes('const _wrap=!!this._waveTimed&&this.waveTimer>WAVE_WRAP;')&&C.includes('if(_wrap){this.waveTimer=WAVE_WRAP;}'),'finish early = wave wraps up in 8s');
assert.ok(m('storyCanSpawn').includes('timedNeedsFoes'),'field does not empty while a timed wave runs');
assert.ok(m('beginWave').includes('this.waveTimedSetup?.(o);'),'hooked at wave start');
assert.ok(src.includes("this.stageIndex===0?ANT_SHOT_C11[0]:1.05")&&src.includes("this.stageIndex===0?ANT_SHOT_C11[1]:undefined")&&ctx.ANT_SHOT_C11[0]<1.05&&ctx.ANT_SHOT_C11[1]<1.4,'smaller ant shots in C1-1');
assert.ok(src.includes("this.playFile('sfx_strawberry_soft_shot',0.62)"),'louder Momo shot');
console.log('Wave timer 8.2.20: timed mission waves, early wrap, half reward on expiry, Herald by time, C1-1 shots, Momo shot sound passed');
