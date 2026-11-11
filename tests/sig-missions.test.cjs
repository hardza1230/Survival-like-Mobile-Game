// v8.1.78 เจ้าของ: ภารกิจประจำด่าน Chapter 3 (รอบ 2)
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const SIG=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'];
assert.ok(src.includes("const SIG_MISSIONS=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight','ultimatum','frozenPantry'];"));
for(const t of SIG){assert.ok(new RegExp('\\n  '+t+":\\{emoji:").test(src),'def '+t);assert.ok(src.includes(t+":['"),'bonus goal '+t);}
const ob=[...src.matchAll(/objectives:\[([^\]]*)\]/g)].map(x=>x[1]).filter(x=>!x.includes('frozenPantry')).slice(0,10);SIG.forEach((t,i)=>assert.ok(ob[5+i].includes(t),'stage '+(11+i)+' has '+t));
for(const n of ['sigAdd','sigText','sigClear','sigSpawnAt','sigSetup','sigNear','sigTick','sigOnKill'])m(n);
const tk=m('sigTick');for(const t of SIG)assert.ok(tk.includes("o.type==='"+t+"'"),'tick '+t);assert.ok(tk.includes("o.type==='ultimatum'"));
assert.ok(src.includes("}else if((typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(type))){\n      this.sigSetup(o,type,p||{});")&&src.includes('this.sigTick(dt,o);if(!this.waveObjective)return;')&&src.includes('this.sigOnKill?.(e);')&&src.includes('clearWaveObjective(){this.sigClear?.();'),'hooks');
assert.ok(/!\(typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS\.includes\(o\.type\)\)&&this\.objNodeG\)this\.objNodeG\.clear\(\)/.test(src),'sig graphics not wiped each frame');
assert.ok(src.includes("dropHeal(x,y,source='crate'){ if(this._sig?.noHeal)return null;")&&/\*\(o\._altarMul\|\|1\)/.test(src),'altar curse + reward multiplier');
console.log('Signature missions: 5 Ch3 types defined, assigned to stages 11-15, setup/tick/kill/clear hooks, altar pacts passed');
{ // v8.1.79 รอบ 3
  for(const n of ['cleanAirBubbles','seasonDropPetal','seasonPetalTick','seasonShrineTick','missionArmable','missionArm','missionArmClear','missionArmTick','overchargeOffer','overchargeTick','overchargeEnd'])m(n);
  assert.ok(/close\?1\.7:1/.test(src),'escort speed-up near');assert.ok(/pulse\?1\.3:2\.6/.test(src)&&/Root guardians/.test(src),'roots pulse + guardians');
  assert.ok(/if\(forceIdx==null&&o\.storm&&o\.storm\.harvest\)return this\.seasonDropPetal\(o,e\)/.test(src),'petals are pickups');
  const ar=m('missionArmable');for(const t of ['survive','fill','hunt'])assert.ok(ar.includes("'"+t+"'"),'no arm for '+t);assert.ok(/!\(p&&p\.forceType\)/.test(ar),'bounties not armed');
  assert.ok(src.includes('if(o0&&!o0.done&&o0._armPad&&this.missionArmTick?.(o0,dt))return; if(o0&&o0._oc&&!o0.done){ this.overchargeTick?.(o0,dt); return; }'),'arm/overcharge gate ticks');
  assert.ok(src.includes('if(this.overchargeOffer?.(o))return;')&&/\*\(o\._ocMul\|\|1\)/.test(src)&&/o\._ocMul=2/.test(m('overchargeEnd')),'overcharge doubles reward');
  console.log('Missions round 3: escort speed, clean-air bubbles, season petals/shrines, root pulse/guardians, opt-in start, Overcharge passed'); }
{ // v8.1.80 Ultimatum
  for(const n of ['ultPad','ultPadsClear','ultSetup','ultNextPick','ultStartFight','ultSeed','ultCurseTick','ultTick','ultRoundWon','ultFinish'])m(n);
  assert.ok(/this\.ultSetup\(o,S,type==='ultimatum'\?4:2\)/.test(src),'trial 4 rounds, vault altar 2');
  const fin=m('ultFinish');assert.ok(/pot=Math\.floor\(pot\/2\)/.test(fin),'fail keeps half');assert.ok(/how==='clear'/.test(fin),'clear bonus box');
  assert.ok(/\(d>=4&&n\.r<0\.165\)\?'trial'/.test(src)&&src.includes("function delveMission(n){ if(n.type==='trial')return 'ultimatum';")&&/trial:\{emoji:'⚖️'/.test(src),'Delve trial room');
  assert.ok(/ULT_CURSES=\[/.test(src)&&/S\.mult\+=c\.v/.test(m('ultStartFight')),'stacking curses raise the pot');
  assert.ok(/'vaultAltar','ultimatum'\]\.includes\(o\.type\)/.test(src),'no arm/overcharge on trials');
  console.log('Ultimatum: Delve trial rooms, 4/2 rounds, stacking curses, take-or-risk, fail = half pot passed'); }

{ // v8.1.81 Frozen Pantry (League → Legion)
  for(const n of ['fpFull','fpSetup','fpOpen','fpWake','fpResolve','fpVanish','fpTick','fpOnKill'])m(n);
  assert.ok(/\n  frozenPantry:\{emoji:/.test(src)&&src.includes("frozenPantry:['Take 6 hits or fewer'"),'def + bonus goal');
  assert.ok(src.includes("objectives:['survive','hunt','frozenPantry','capture']"),'C1-4 has Frozen Pantry');
  assert.ok(src.includes("else if(type==='frozenPantry'){ this.fpSetup(o,S); }")&&src.includes("else if(o.type==='frozenPantry'){ this.fpTick(dt,o,S); }")&&src.includes('if(e&&e._fpTok&&this.fpOnKill(e,o,S))return;'),'hooks');
  const ft=m('fpTick');assert.ok(/sigNear\(q\.x,q\.y,S\.PR\+24\)/.test(ft),'paint by walking near');assert.ok(/if\(S\.full\)\{ q\.life-=dt/.test(ft),'refreeze timer only in full');
  assert.ok(/storyCleared\(\)>=10/.test(m('fpFull'))&&/_replayMeter/.test(m('fpFull')),'light first play, full on replay/after Ch2');
  // vm: paint → wake → kill → complete
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setTint(){return o},setAlpha(){return o},setVisible(v){o.vis=v;return o},setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setPosition(x,y){o.x=x;o.y=y;return o},clearTint(){return o}};return o;};
  vm.runInContext('class S{'+['fpFull','fpSetup','fpOpen','fpWake','fpResolve','fpVanish','fpTick','fpOnKill'].map(m).join('')+'};this.K=S;',ctx);
  const sc=new ctx.K();const spawned=[];Object.assign(sc,{stageIndex:3,player:{x:0,y:0},sugarStage:0,sugarRun:0,objNodeG:null,tweens:{add(){},killTweensOf(){}},add:{circle:()=>obj()},
    objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},
    sigSpawnAt:(x,y)=>{const e={x,y,active:true};spawned.push(e);return e;},completeWaveObjective(){this.done=true;}});
  const o={target:0,progress:0},S={type:'frozenPantry',objs:[]};sc.fpSetup(o,S);assert.strictEqual(o.target,4);assert.strictEqual(S.full,false);
  sc.fpTick(.1,o,S);assert.strictEqual(S.phase,'seek');sc.player={x:300,y:0};sc.fpTick(.1,o,S);assert.strictEqual(S.phase,'paint');assert.strictEqual(S.st.length,4);
  for(const q of S.st){ sc.player={x:q.x,y:q.y}; for(let k=0;k<25;k++)sc.fpTick(.1,o,S); }
  assert.strictEqual(spawned.length,4,'all painted statues woke');for(const e of spawned){ e.active=false; assert.ok(sc.fpOnKill(e,o,S)); }
  sc.fpTick(.1,o,S);assert.strictEqual(o.progress,4);assert.ok(sc.done,'mission completes');assert.ok(sc.sugarRun>0,'chest loot');
  console.log('Frozen Pantry: walk-to-paint statues, light/full split, refreeze timer, chest loot, completes passed'); }
