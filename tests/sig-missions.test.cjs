// v8.1.78 เจ้าของ: ภารกิจประจำด่าน Chapter 3 (รอบ 2)
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const SIG=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'];
assert.ok(src.includes("const SIG_MISSIONS=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight','ultimatum','frozenPantry','hungersMouth','creepingRoots','hungerHerald','grandmasPot','grandmasGolem'];"));
for(const t of SIG){assert.ok(new RegExp('\\n  '+t+":\\{emoji:").test(src),'def '+t);assert.ok(src.includes(t+":['"),'bonus goal '+t);}
const ob=[...src.matchAll(/objectives:\[([^\]]*)\]/g)].map(x=>x[1]).filter(x=>!/frozenPantry|hungersMouth|hungerHerald|grandmasPot|grandmasGolem/.test(x)).slice(0,10);SIG.forEach((t,i)=>assert.ok(ob[5+i].includes(t),'stage '+(11+i)+' has '+t));
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

{ // v8.1.82 League phase 2: Hunger's Mouth + Creeping Roots
  for(const n of ['hmSetup','hmTick','hmOnKill','hmBurst','crLane','crDraw','crSetup','crTick'])m(n);
  assert.ok(src.includes("objectives:['hungersMouth','hunt','capture','purge'],lead:'hungersMouth',")&&src.includes("objectives:['hunt','creepingRoots','purge'],"),'C1-2 Mouth (first wave), C2-3 Roots');
  assert.ok(src.includes("if(st&&st.lead&&!this._leadUsed)")&&src.includes("this._replayMeter=null;this._leadUsed=false;"),'lead mission first');
  assert.ok(src.includes("if(e._goTo){tx=e._goTo.x;ty=e._goTo.y;}")&&src.includes("&&!e._wispRaider&&!e._goTo){"),'lane walkers follow waypoints, not culled');
  assert.ok(/if\(S\.lanes\|\|S\.herald\|\|S\.carriers\)this\.enemies/.test(m('sigClear')),'lane/herald flags cleared');
  assert.ok(/this\._sigForce&&this\.enemies\.countActive\(true\)<\(this\.maxLive\|\|100\)\)return true/.test(m('storyCanSpawn'))&&/finally\{ this\._sigForce=false; \}/.test(m('sigSpawnAt')),'league spawns bypass story budget');
  assert.ok((src.match(/b\.push\(st\.lead\)/g)||[]).length===2,'lead applied to both bag builders');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setRadius(){return o},setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setScale(){return o},setText(t){o.text=t;return o},setVisible(){return o},setOrigin(){return o},setAlpha(){return o},setTint(){return o},clear(){},lineStyle(){},beginPath(){},moveTo(){},lineTo(){},strokePath(){},fillStyle(){},fillCircle(){}};return o;};
  vm.runInContext('class S{'+['fpFull','hmSetup','hmTick','hmOnKill','hmBurst','crLane','crDraw','crSetup','crTick'].map(m).join('')+'};this.K=S;',ctx);
  const mk=()=>{const sc=new ctx.K();const en=[];Object.assign(sc,{stageIndex:1,player:{x:300,y:0},sugarStage:0,sugarRun:0,objNodeG:null,tweens:{add(){}},add:{circle:()=>obj(),text:()=>obj(),graphics:()=>obj(),image:()=>obj()},textures:{exists:()=>false},
    objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},enemies:{children:{iterate:f=>en.forEach(f)}},
    sigSpawnAt:(x,y)=>{const e={x,y,active:true};en.push(e);return e;},completeWaveObjective(){this.done=true;}});return [sc,en];};
  { const [sc]=mk();const o={},S={};sc.hmSetup(o,S);assert.strictEqual(S.full,false);for(let i=0;i<5;i++)sc.hmOnKill({x:300,y:0},o,S);assert.strictEqual(S.pot,5);assert.ok(S.R>220,'kills widen');
    let k=0;while(!sc.done&&k++<2000)sc.hmTick(.1,o,S);assert.ok(sc.done,'mouth closes');assert.ok(sc.sugarRun>0,'pot pays out'); }
  { const [sc,en]=mk();const o={progress:0},S={};sc.crSetup(o,S);assert.strictEqual(S.lanes.length,2);for(let k=0;k<40;k++)sc.crTick(.1,o,S);assert.ok(en.length>0&&en[0]._goTo,'walkers get a waypoint');
    for(const L of S.lanes){ sc.player={x:L.pts[0].x,y:L.pts[0].y}; for(let k=0;k<25;k++)sc.crTick(.1,o,S); } assert.ok(S.lanes.every(L=>!L.open),'all cut');assert.ok(sc.done,'all cut ends early');assert.ok(sc.sugarRun>0); }
  console.log('League phase 2: Hunger’s Mouth (widen/close/pot burst) + Creeping Roots (lanes, waypoints, cut, early end) passed'); }

{ // v8.1.83 League phase 3: Hunger Herald + Grandma's Pot
  for(const n of ['hhSetup','hhSpawn','hhTick','hhDown','gpSetup','gpCard','gpWanted','gpDrop','gpOnKill','gpTick','gpServe'])m(n);
  assert.ok(src.includes("objectives:['hungerHerald','hunt','capture','purge'],lead:'hungerHerald',")&&src.includes("objectives:['grandmasPot','hunt','capture','purge'],lead:'grandmasPot',"),'C1-1 Herald, C1-3 Pot');
  assert.ok(/if\(stL&&!this\._bountyLead&&pool\.includes\(stL\)\)/.test(m('replayBountyTick'))&&/LEAGUE_MISSIONS\.includes\(type\)\)\?70:45/.test(m('replayBountyTick')),'league bounty first + 70s');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))},Utils:{Array:{Shuffle:a=>a}}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,visible:true,setRadius(){return o},setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setScale(){return o},setText(t){o.text=t;return o},setVisible(v){o.visible=v;return o},setOrigin(){return o},setAlpha(){return o},setTint(){return o},setRotation(){return o},setPosition(x,y){o.x=x;o.y=y;return o}};return o;};
  vm.runInContext('class S{'+['fpFull','hhSetup','hhSpawn','hhTick','hhDown','gpSetup','gpCard','gpWanted','gpDrop','gpOnKill','gpTick','gpServe'].map(m).join('')+'};this.K=S;',ctx);
  const mk=()=>{const sc=new ctx.K();const en=[];Object.assign(sc,{stageIndex:2,player:{x:0,y:0},sugarStage:0,sugarRun:0,tweens:{add(){}},add:{circle:()=>obj(),text:()=>obj()},
    objectivePosition:(i)=>({x:300+i*50,y:0}),sigText:()=>obj(),sigAdd:o=>o,dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},enemies:{countActive:()=>en.filter(e=>e.active).length},
    sigSpawnAt:(x,y,el)=>{const e={x,y,active:true,isElite:!!el};en.push(e);return e;},completeWaveObjective(){this.done=true;}});return [sc,en];};
  { const [sc,en]=mk();const o={},S={};sc.hhSetup(o,S);assert.strictEqual(S.gates.length,2);assert.ok(S.herald&&S.herald._herald);sc.hhTick(.1,o,S);assert.ok(S.herald._goTo,'herald wanders');
    for(let k=0;k<40;k++)sc.hhTick(.1,o,S);assert.ok(en.length>3,'gates spawn packs');sc.hhDown(S.herald,o,S);assert.ok(sc.done&&o.progress===1&&S.gates.length===0); }
  { const [sc]=mk();const o={},S={};sc.gpSetup(o,S);assert.strictEqual(o.target,6);for(let i=0;i<40&&sc.gpWanted(S).length;i++)sc.gpOnKill({x:100,y:100},o,S);assert.ok(S.items.length>=6,'drops ingredients');
    sc.player={x:100,y:100};sc.gpTick(.1,o,S);assert.ok(S.carry.length>=6,'picked up');sc.player={x:S.x,y:S.y};sc.gpTick(.1,o,S);assert.strictEqual(o.progress,6);assert.ok(sc.done&&sc.sugarRun>0,'dish served'); }
  { const [sc]=mk();const o={},S={};sc.gpSetup(o,S);sc.gpDrop(S,500,500,Object.keys(S.need)[0]);for(let k=0;k<200;k++)sc.gpTick(.1,o,S);assert.strictEqual(S.items.length,0,'ingredients spoil'); }
  { const [sc]=mk();const o={},S={};sc.gpSetup(o,S);for(let k=0;k<125;k++)sc.gpTick(.1,o,S);assert.ok(S.items.length>=1,'grandma tosses one when nothing drops'); }
  console.log('League phase 3: Hunger Herald (wander, gates, shut on kill) + Grandma’s Pot (drops, carry, deliver, spoil, serve) passed'); }

{ // v8.1.85 League phase 6: Grandma's Golem (Metamorph)
  for(const n of ['ggSetup','ggList','ggCarrier','ggDropPart','ggTick','ggBake','ggSpawnGolem','ggDown'])m(n);
  assert.ok(src.includes("objectives:['grandmasGolem','hunt','capture','purge'],lead:'grandmasGolem',"),'C1-5 Golem first');
  assert.ok(src.includes("if(e&&(e._ggPart||e._golem)){"),'kill hook');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console,
    GOLEM_PARTS:[{k:'head',em:'🍰',name:'Cake Head',skill:'a'},{k:'arms',em:'🥨',name:'Arms',skill:'b'},{k:'legs',em:'🥖',name:'Legs',skill:'c'},{k:'tail',em:'🍭',name:'Tail',skill:'d'},{k:'heart',em:'💗',name:'Heart',skill:'e'}]};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setText(t){o.text=t;return o},setVisible(){return o},setOrigin(){return o},setPosition(x,y){o.x=x;o.y=y;return o}};return o;};
  vm.runInContext('class S{'+['fpFull','ggSetup','ggList','ggCarrier','ggDropPart','ggTick','ggBake','ggSpawnGolem','ggDown'].map(m).join('')+'};this.K=S;',ctx);
  for(const full of [false,true]){ const sc=new ctx.K();const en=[];Object.assign(sc,{_replayMeter:full?{}:null,stageIndex:4,player:{x:0,y:0},sugarStage:0,sugarRun:0,add:{circle:()=>obj(),text:()=>obj()},
    objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},
    sigSpawnAt:(x,y,el)=>{const e={x,y,active:true,isElite:!!el,maxhp:100,hp:100,scaleX:1,setScale(){},setTint(){},clearTint(){}};en.push(e);return e;},completeWaveObjective(){this.done=true;}});
    const o={},S={};sc.ggSetup(o,S);assert.strictEqual(o.target,full?5:3);for(let k=0;k<55;k++)sc.ggTick(.1,o,S);const car=en.filter(e=>e._ggPart);assert.strictEqual(car.length,o.target,'every part has a carrier');
    sc.player={x:300,y:0};for(let k=0;k<25;k++)sc.ggTick(.1,o,S);assert.strictEqual(S.phase,'collect','cannot bake with no parts');
    for(const e of car.slice(0,S.min)){ const k=e._ggPart;e._ggPart=null;e.active=false;sc.ggDropPart(S,e,k);sc.player={x:e.x,y:e.y};sc.ggTick(.1,o,S); }
    assert.strictEqual(S.parts.length,S.min);sc.player={x:300,y:0};for(let k=0;k<25;k++)sc.ggTick(.1,o,S);assert.strictEqual(S.phase,'fight','bake with min parts');
    const g=S.golem;assert.ok(g&&g._golem);assert.ok(g.maxhp>100,'golem is tougher');g._golem=false;sc.ggDown(g,o,S);assert.ok(sc.done&&sc.sugarRun>0); }
  console.log('League phase 6: Grandma’s Golem (carriers, parts, min-part bake, golem scaled by parts, reward) passed'); }
