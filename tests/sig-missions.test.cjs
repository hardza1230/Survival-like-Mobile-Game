// v8.1.78 เจ้าของ: ภารกิจประจำด่าน Chapter 3 (รอบ 2)
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const SIG=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'];
assert.ok(src.includes("const SIG_MISSIONS=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight','ultimatum','frozenPantry','hungersMouth','creepingRoots','hungerHerald','grandmasPot','grandmasGolem','hungerSiege','hungerDomain'];"));
for(const t of SIG){assert.ok(new RegExp('\\n  '+t+":\\{emoji:").test(src),'def '+t);assert.ok(src.includes(t+":['"),'bonus goal '+t);}
const ob=[...src.matchAll(/objectives:\[([^\]]*)\]/g)].map(x=>x[1]).filter(x=>!/frozenPantry|hungersMouth|hungerHerald|grandmasPot|grandmasGolem/.test(x)).slice(0,10);SIG.forEach((t,i)=>assert.ok(ob[5+i].includes(t),'stage '+(11+i)+' has '+t));
for(const n of ['sigAdd','sigText','sigClear','sigSpawnAt','sigSetup','sigNear','sigTick','sigOnKill'])m(n);
const tk=m('sigTick');for(const t of SIG)assert.ok(tk.includes("o.type==='"+t+"'"),'tick '+t);assert.ok(tk.includes("o.type==='ultimatum'"));
assert.ok(src.includes("}else if((typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(type))){\n      this.sigSetup(o,type,p||{});")&&src.includes('this.sigTick(dt,o);if(!this.waveObjective)return;')&&src.includes('this.sigOnKill?.(e);')&&src.includes('clearWaveObjective(){this.artFollowClear?.();this.sigClear?.();'),'hooks');
assert.ok(/!\(typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS\.includes\(o\.type\)\)&&this\.objNodeG\)this\.objNodeG\.clear\(\)/.test(src),'sig graphics not wiped each frame');
assert.ok(src.includes("dropHeal(x,y,source='crate'){ if(this._sig?.noHeal)return null;")&&/\*\(o\._altarMul\|\|1\)/.test(src),'altar curse + reward multiplier');
console.log('Signature missions: 5 Ch3 types defined, assigned to stages 11-15, setup/tick/kill/clear hooks, altar pacts passed');
{ // v8.1.79 รอบ 3
  for(const n of ['cleanAirBubbles','seasonDropPetal','seasonPetalTick','seasonShrineTick','missionArmable','missionArm','missionArmClear','missionArmTick','overchargeOffer','overchargeTick','overchargeEnd'])m(n);
  assert.ok(/close\?1\.25:1/.test(src)&&/t\.away/.test(src),'escort: faster near (v8.1.144 ×1.25), slow drift when away');assert.ok(/pulse\?1\.3:2\.6/.test(src)&&/Root guardians/.test(src),'roots pulse + guardians');
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

{ // v8.1.81 Frozen Pantry (League → Legion) · v8.1.111 reworked like PoE Legion (jar button, frozen army, paint trail, all thaw at once)
  for(const n of ['fpFull','fpSetup','fpBtnOver','fpBtnHit','fpOpen','fpBlob','fpTimeStop','fpThaw','fpWake','fpResolve','fpVanish','fpTick','fpOnKill'])m(n);
  assert.ok(/\n  frozenPantry:\{emoji:/.test(src)&&src.includes("frozenPantry:['Take 6 hits or fewer'"),'def + bonus goal');
  assert.ok(src.includes("objectives:['survive','hunt','frozenPantry','capture']"),'C1-4 has Frozen Pantry');
  assert.ok(src.includes("else if(type==='frozenPantry'){ this.fpSetup(o,S); }")&&src.includes("else if(o.type==='frozenPantry'){ this.fpTick(dt,o,S); }")&&src.includes('if(e&&e._fpTok&&this.fpOnKill(e,o,S))return;'),'hooks');
  assert.ok(src.includes('if(this.fpBtnHit?.(p))return;')&&m('joyBlocked').includes('this.fpBtnOver?.(p)'),'jar button tap, joystick ignores it');
  assert.ok(/storyCleared\(\)>=10/.test(m('fpFull'))&&/_replayMeter/.test(m('fpFull')),'light first play, full on replay/after Ch2');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,active:true,visible:true,scaleX:1,scaleY:1,setTint(){return o},setAlpha(){return o},setScale(){return o},setVisible(v){o.visible=v;return o},setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setPosition(x,y){o.x=x;o.y=y;return o},clearTint(){return o}};return o;};
  vm.runInContext('class S{'+['fpFull','fpSetup','fpBtnOver','fpBtnHit','fpOpen','fpBlob','fpTimeStop','fpThaw','fpWake','fpResolve','fpVanish','fpTick','fpOnKill','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
  const mk=(full)=>{const sc=new ctx.K();const spawned=[],blobs=[];Object.assign(sc,{stageIndex:3,player:{x:0,y:0},sugarStage:0,sugarRun:0,fpFull:()=>full,tweens:{add(){},killTweensOf(){}},time:{delayedCall(ms,f){f();}},
    add:{circle:()=>obj(),graphics:()=>{const g=obj();g.fillCircle=(x,y,r)=>blobs.push([x,y,r]);g.clear=()=>g;g.fillStyle=()=>g;g.fillRoundedRect=()=>g;return g;}},
    objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},
    sigSpawnAt:(x,y)=>{const e={x,y,active:true,setActive(v){this.active=v;return this;},setVisible(){return this;}};spawned.push(e);return e;},completeWaveObjective(){this.done=true;}});return [sc,spawned,blobs];};
  { const [sc,spawned,blobs]=mk(false);const o={target:0,progress:0},S={type:'frozenPantry',objs:[]};sc.fpSetup(o,S);assert.strictEqual(o.target,14);assert.strictEqual(S.full,false);
    sc.fpTick(.1,o,S);assert.strictEqual(S.phase,'seek');sc.player={x:300,y:0};sc.fpTick(.1,o,S);assert.strictEqual(S.phase,'paint','no button in vm → opens on approach');assert.strictEqual(S.st.length,14,'a whole frozen army');
    const half=S.st.slice(0,9);for(const q of half){ sc.player={x:q.x,y:q.y}; for(let k=0;k<6;k++)sc.fpTick(.1,o,S); }assert.ok(blobs.length>0,'walking paints the ground');const P=S.st.filter(q=>q.fill>=1).length;assert.ok(P>=9&&P<14,'painted '+P);assert.strictEqual(spawned.length,0,'nobody wakes while time is frozen');
    for(let k=0;k<400&&S.phase==='paint';k++)sc.fpTick(.1,o,S);assert.strictEqual(S.phase,'fight');assert.strictEqual(spawned.length,P,'painted ones all break free at once');assert.strictEqual(S.st.filter(q=>q.state==='lost').length,14-P,'unpainted shatter');
    for(const e of spawned){ e.active=false; assert.ok(sc.fpOnKill(e,o,S)); } sc.fpTick(.1,o,S);assert.strictEqual(o.progress,P);assert.ok(sc.done,'mission completes'); }
  { const [sc,spawned]=mk(true);const o={target:0,progress:0},S={type:'frozenPantry',objs:[]};sc.fpSetup(o,S);assert.strictEqual(o.target,24);sc.player={x:300,y:0};sc.fpTick(.1,o,S);assert.ok(S.st.some(q=>q.gen),'Frost General in full');
    for(const q of S.st){ sc.player={x:q.x,y:q.y}; for(let k=0;k<12;k++)sc.fpTick(.1,o,S); if(S.phase!=='paint')break; } assert.strictEqual(S.phase,'fight','painting everyone thaws early');
    for(let k=0;k<260;k++)sc.fpTick(.1,o,S);assert.ok(sc.done,'full: survivors vanish after 25s and the mission ends');assert.ok(S.st.every(q=>q.state==='lost'||q.state==='done')); }
  { const [sc]=mk(false);const near={x:310,y:0,active:true,v:1,setVelocity(){this.v=0;},setTint(c){this.tint=c;},clearTint(){this.tint=null;}},far={x:2000,y:0,active:true,setVelocity(){},setTint(){},clearTint(){}};sc.enemies={children:{iterate(f){[near,far].forEach(f);}}};
    const o={target:0,progress:0},S={type:'frozenPantry',objs:[]};sc.fpSetup(o,S);sc.player={x:300,y:0};sc.fpTick(.1,o,S);assert.ok(near._timeStop&&far._timeStop&&near.v===0&&S.global&&sc._holdFire,'v8.1.125 owner: every monster on the map stops and the hero holds fire');
    assert.ok(!near.frozen,'time stop is not the frozen status (no Mint shatter bonus)');assert.ok(m('touchEnemy').includes('||e._timeStop||'),'stopped enemies deal no contact damage');
    S.T=0;sc.fpTick(.1,o,S);assert.ok(!near._timeStop&&near.tint==null,'time resumes on thaw');assert.ok(m('sigClear').includes('e._timeStop=false'),'cleared if the mission ends early'); }
  console.log('Frozen Pantry (Legion): jar button, time-stop dome, frozen army in groups, rainbow paint trail, all thaw at once, unpainted shatter, full timer, completes passed'); }

{ // v8.1.82 League phase 2: Hunger's Mouth + Creeping Roots
  for(const n of ['hmSetup','hmOpen','hmTick','hmOnKill','hmChest','hmSplinters','hmBurst','crLane','crGrowPts','crGrowTick','crDraw','crSetup','crTick'])m(n);
  assert.ok(src.includes("objectives:['hungersMouth','hunt','capture','purge'],lead:'hungersMouth',")&&src.includes("objectives:['hunt','creepingRoots','purge'],"),'C1-2 Mouth (first wave), C2-3 Roots');
  assert.ok(src.includes("if(st&&st.lead&&!this._leadUsed)")&&src.includes("this._replayMeter=null;this._leadUsed=false;"),'lead mission first');
  assert.ok(src.includes("if(e._goTo){tx=e._goTo.x;ty=e._goTo.y;}")&&src.includes("&&!e._wispRaider&&!e._goTo){"),'lane walkers follow waypoints, not culled');
  assert.ok(/if\(S\.lanes\|\|S\.herald\|\|S\.carriers\|\|S\.chests\|\|S\.domain\)this\.enemies/.test(m('sigClear')),'lane/herald flags cleared');
  assert.ok(/this\._sigForce&&this\.enemies\.countActive\(true\)<\(this\.maxLive\|\|100\)\)return true/.test(m('storyCanSpawn'))&&/finally\{ this\._sigForce=false; \}/.test(m('sigSpawnAt')),'league spawns bypass story budget');
  assert.ok((src.match(/b\.push\(st\.lead\)/g)||[]).length===2,'lead applied to both bag builders');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setRadius(){return o},setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setScale(){return o},setText(t){o.text=t;return o},setVisible(){return o},setOrigin(){return o},setAlpha(){return o},setTint(){return o},clear(){},lineStyle(){},beginPath(){},moveTo(){},lineTo(){},strokePath(){},fillStyle(){},fillCircle(){},fillRoundedRect(){return o},setPosition(){return o}};return o;};
  ctx.Save={data:{}};vm.runInContext('class S{'+['fpFull','hmSetup','hmOpen','hmTick','hmOnKill','hmChest','hmSplinters','hmBurst','crLane','crGrowPts','crGrowTick','crDraw','crSetup','crTick','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
  const mk=()=>{const sc=new ctx.K();const en=[];Object.assign(sc,{stageIndex:1,player:{x:300,y:0},sugarStage:0,sugarRun:0,objNodeG:null,tweens:{add(){}},add:{circle:()=>obj(),text:()=>obj(),graphics:()=>obj(),image:()=>obj()},textures:{exists:()=>false},
    objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},enemies:{children:{iterate:f=>en.forEach(f)}},
    sigSpawnAt:(x,y)=>{const e={x,y,active:true,setTint(){},setActive(v){e.active=v;return e},setVisible(){return e}};en.push(e);return e;},completeWaveObjective(){this.done=true;}});return [sc,en];};
  { const [sc,en]=mk();const o={},S={};sc.hmSetup(o,S);assert.strictEqual(S.full,false);assert.strictEqual(S.phase,'seek');sc.player={x:2000,y:0};sc.hmTick(.1,o,S);assert.strictEqual(S.phase,'seek','opens only by touching the hand');
    sc.player={x:300,y:0};sc.hmTick(.1,o,S);assert.strictEqual(S.phase,'open');for(let k=0;k<20;k++)sc.hmTick(.1,o,S);assert.ok(S.R>200,'breach expands');assert.ok(en.some(e=>e._breach),'breach monsters spawn inside');
    const l0=S.life;for(let i=0;i<6;i++)sc.hmOnKill({x:300,y:0},o,S);assert.ok(S.life>l0,'kills extend the breach');assert.strictEqual(S.kills,6);
    sc.hmOnKill({x:300,y:0,isElite:true},o,S);assert.ok(S.shards.length>=1,'elite drops splinters');const sh=S.shards[0];sc.player={x:sh.x,y:sh.y};sc.hmTick(.1,o,S);assert.ok(ctx.Save.data.splinters>=3,'splinters picked up');
    const c=S.chests[0];c.t=c.t||{setText(){},setVisible(){}};sc.player={x:c.x,y:c.y};sc.hmTick(.1,o,S);assert.ok(c.open,'chest opens by walking');
    ctx.Save.data.splinters=98;sc.hmSplinters(5);assert.strictEqual(ctx.Save.data.hungerStones,1,'100 splinters = 1 Hunger Stone');assert.strictEqual(ctx.Save.data.splinters,3);
    let k=0;while(!sc.done&&k++<3000)sc.hmTick(.1,o,S);assert.ok(sc.done,'breach collapses and completes');assert.ok(sc.sugarRun>0); }
  { const [sc,en]=mk();const o={progress:0},S={};sc.crSetup(o,S);assert.strictEqual(S.lanes.length,2);assert.ok(S.lanes.every(L=>L.grow===0),'roots start inside the flower');assert.strictEqual(sc.crGrowPts(S.lanes[0]).length,1);sc.crTick(.1,o,S);assert.strictEqual(en.length,0,'no walkers while roots grow');{const L=S.lanes[0],q=sc.crGrowPts(L);assert.deepStrictEqual(q[0],L.pts[4],'roots grow out of the centre');}for(let k=0;k<40;k++)sc.crTick(.1,o,S);assert.ok(en.length>0&&en[0]._goTo,'walkers get a waypoint');
    for(const L of S.lanes){ sc.player={x:L.pts[0].x,y:L.pts[0].y}; for(let k=0;k<25;k++)sc.crTick(.1,o,S); } assert.ok(S.lanes.every(L=>!L.open),'all cut');assert.ok(sc.done,'all cut ends early');assert.ok(sc.sugarRun>0); }
  console.log('League phase 2: Hunger’s Mouth PoE breach (hand, expand, kill-extend, splinters, chests, collapse) + Creeping Roots (lanes, waypoints, cut, early end) passed'); }

{ // v8.1.83 League phase 3: Hunger Herald + Grandma's Pot
  for(const n of ['hhSetup','hhSpawn','hhTick','hhDown','gpSetup','gpCard','gpDark','gpRound','gpOnKill','gpMenu','gpTable','gpPlate','gpBuy','gpFinish','gpTick','gpServe'])m(n);
  assert.ok(src.includes("objectives:['hungerHerald','hunt','capture','purge'],lead:'hungerHerald',")&&src.includes("objectives:['grandmasPot','hunt','capture','purge'],lead:'grandmasPot',"),'C1-1 Herald, C1-3 Pot');
  assert.ok(/if\(stL&&!this\._bountyLead&&pool\.includes\(stL\)\)/.test(m('replayBountyTick'))&&/LEAGUE_MISSIONS\.includes\(type\)\)\?70:45/.test(m('replayBountyTick')),'league bounty first + 70s');
  const vm=require('vm');const SD={};const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))},Utils:{Array:{Shuffle:a=>a}}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console,Save:{data:SD,save(){},addCurrency(k,n){SD['c_'+k]=(SD['c_'+k]||0)+n;}}};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,visible:true,setRadius(){return o},setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setScale(){return o},setText(t){o.text=t;return o},setVisible(v){o.visible=v;return o},setOrigin(){return o},setAlpha(){return o},setTint(){return o},setRotation(){return o},setPosition(x,y){o.x=x;o.y=y;return o}};return o;};
  vm.runInContext('class S{'+['fpFull','hhSetup','hhSpawn','hhTick','hhDown','gpSetup','gpCard','gpDark','gpRound','gpOnKill','gpMenu','gpTable','gpPlate','gpBuy','gpFinish','gpTick','gpServe','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
  const mk=()=>{for(const k in SD)delete SD[k];const sc=new ctx.K();const en=[];Object.assign(sc,{SD,stageIndex:2,player:{x:0,y:0},sugarStage:0,sugarRun:0,tweens:{add(){}},add:{circle:()=>obj(),text:()=>obj()},
    objectivePosition:(i)=>({x:300+i*50,y:0}),sigText:()=>obj(),sigAdd:o=>o,dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},enemies:{countActive:()=>en.filter(e=>e.active).length},
    sigSpawnAt:(x,y,el)=>{const e={x,y,active:true,isElite:!!el};en.push(e);return e;},completeWaveObjective(){this.done=true;}});return [sc,en];};
  { const [sc,en]=mk();const o={},S={};sc.hhSetup(o,S);assert.strictEqual(S.gates.length,2);assert.ok(S.herald&&S.herald._herald);sc.hhTick(.1,o,S);assert.ok(S.herald._goTo,'herald wanders');
    for(let k=0;k<40;k++)sc.hhTick(.1,o,S);assert.ok(en.length>3,'gates spawn packs');sc.hhDown(S.herald,o,S);assert.ok(sc.done&&o.progress===1&&S.gates.length===0); }
  { const [sc,en]=mk();sc.fpFull=()=>false;sc.hurtPlayer=()=>{sc.hurt=(sc.hurt||0)+1;};const o={},S={};sc.gpSetup(o,S);assert.strictEqual(o.target,2);assert.strictEqual(S.phase,'wait');sc.gpTick(.1,o,S);assert.strictEqual(S.phase,'wait','far away: ritual waits');   // v8.1.106 Ritual-style pot
    sc.player={x:S.x,y:S.y};sc.gpTick(.1,o,S);assert.strictEqual(S.phase,'ritual');assert.strictEqual(S.round,1);assert.ok(S.foes.length>=7,'course spawns hungry mochi');
    const n1=S.foes.length;S.foes.forEach(e=>{e.x=S.x;e.y=S.y;sc.gpOnKill(e,o,S);e.active=false;});assert.strictEqual(S.flavor,n1,'kills inside the light feed the pot');sc.gpTick(.1,o,S);assert.strictEqual(S.phase,'rest');assert.strictEqual(o.progress,1);
    for(let k=0;k<30;k++)sc.gpTick(.1,o,S);assert.strictEqual(S.round,2,'next course starts');sc.player={x:S.x+900,y:S.y};const before=S.flavor;S.foes[0].x=S.x;sc.gpOnKill(S.foes[0],o,S);assert.strictEqual(S.flavor,before,'kills outside the ring do not count');
    for(let k=0;k<40;k++)sc.gpTick(.1,o,S);assert.ok(S.spice<=3.2&&(S.spices.length>0||(sc.hurt||0)>0||S.spice<3.2),'spice hazard ticks');S.foes.forEach(e=>e.active=false);sc.player={x:S.x,y:S.y};sc.gpTick(.1,o,S);assert.strictEqual(S.phase,'table','v8.1.115 Grandma’s table after the last course');assert.strictEqual(o.progress,2);
    assert.strictEqual(S.plates.length,5,'4 dishes + Done');assert.ok(S.plates.some(P=>P.id==='sugar_s'),'cheap dish always offered');S.tribute=20;const cheap=S.plates.find(P=>P.id==='sugar_s');sc.player={x:cheap.x,y:cheap.y};for(let k=0;k<6;k++)sc.gpTick(.1,o,S);
    assert.ok(cheap.taken&&S.tribute===16&&sc.sugarRun>0,'stand on a dish to buy it with flavor');const dn=S.plates.find(P=>P.done);sc.player={x:dn.x,y:dn.y};for(let k=0;k<6;k++)sc.gpTick(.1,o,S);assert.ok(sc.done,'Done ends the table');
    assert.strictEqual(sc.SD.potFlavor,8,'half the leftover flavor is saved'); }
  { const [sc]=mk();sc.fpFull=()=>false;const o={},S={};sc.gpSetup(o,S);sc.SD.potDeferred='ink';S.flavor=3;sc.gpTable(o,S);assert.strictEqual(S.plates[0].id,'ink','deferred dish comes back first');const top=S.plates.filter(P=>!P.done).sort((a,b)=>b.cost-a.cost)[0].id;sc.gpFinish(o,S);assert.strictEqual(sc.SD.potDeferred,top,'priciest dish you could not afford is saved for next time'); }
  { const [sc]=mk();sc.fpFull=()=>true;const o={},S={};sc.gpSetup(o,S);assert.strictEqual(o.target,3,'full = 3 courses');sc.player={x:S.x,y:S.y};sc.gpTick(.1,o,S);sc.gpTick(.1,o,S);assert.ok(S.spices.length>=0); }
  console.log('League phase 3: Hunger Herald (wander, gates, shut on kill) + Grandma’s Pot (ritual ring, courses, kills in the light, spice hazard, Grandma’s table: buy dishes with flavor, Done, save leftovers, defer) passed'); }

{ // v8.1.85 League phase 6: Grandma's Golem (Metamorph)
  for(const n of ['ggSetup','ggList','ggCarrier','ggDropPart','ggTick','ggBake','ggSpawnGolem','ggDown'])m(n);
  assert.ok(src.includes("objectives:['grandmasGolem','hunt','capture','purge'],lead:'grandmasGolem',"),'C1-5 Golem first');
  assert.ok(src.includes("if(e&&(e._ggPart||e._golem)){"),'kill hook');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,storyCleared:()=>0,console,
    GOLEM_PARTS:[{k:'head',em:'🍰',name:'Cake Head',skill:'a'},{k:'arms',em:'🥨',name:'Arms',skill:'b'},{k:'legs',em:'🥖',name:'Legs',skill:'c'},{k:'tail',em:'🍭',name:'Tail',skill:'d'},{k:'heart',em:'💗',name:'Heart',skill:'e'}]};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setText(t){o.text=t;return o},setVisible(){return o},setOrigin(){return o},setPosition(x,y){o.x=x;o.y=y;return o}};return o;};
  vm.runInContext('class S{'+['fpFull','ggSetup','ggList','ggCarrier','ggDropPart','ggTick','ggBake','ggSpawnGolem','ggDown','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
  for(const full of [false,true]){ const sc=new ctx.K();const en=[];Object.assign(sc,{_replayMeter:full?{}:null,stageIndex:4,player:{x:0,y:0},sugarStage:0,sugarRun:0,add:{circle:()=>obj(),text:()=>obj()},
    objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},
    sigSpawnAt:(x,y,el)=>{const e={x,y,active:true,isElite:!!el,maxhp:100,hp:100,scaleX:1,setScale(){},setTint(){},clearTint(){}};en.push(e);return e;},completeWaveObjective(){this.done=true;}});
    const o={},S={};sc.ggSetup(o,S);assert.strictEqual(o.target,full?5:3);for(let k=0;k<55;k++)sc.ggTick(.1,o,S);const car=en.filter(e=>e._ggPart);assert.strictEqual(car.length,o.target,'every part has a carrier');
    sc.player={x:300,y:0};for(let k=0;k<25;k++)sc.ggTick(.1,o,S);assert.strictEqual(S.phase,'collect','cannot bake with no parts');
    for(const e of car.slice(0,S.min)){ const k=e._ggPart;e._ggPart=null;e.active=false;sc.ggDropPart(S,e,k);sc.player={x:e.x,y:e.y};sc.ggTick(.1,o,S); }
    assert.strictEqual(S.parts.length,S.min);sc.player={x:300,y:0};for(let k=0;k<25;k++)sc.ggTick(.1,o,S);assert.strictEqual(S.phase,'fight','bake with min parts');
    const g=S.golem;assert.ok(g&&g._golem);assert.ok(g.maxhp>100,'golem is tougher');g._golem=false;sc.ggDown(g,o,S);assert.ok(sc.done&&sc.sugarRun>0); }
  console.log('League phase 6: Grandma’s Golem (carriers, parts, min-part bake, golem scaled by parts, reward) passed'); }

{ // v8.1.86 League phase 4: Siege of the Hunger (Legion 5 Way, Delve room)
  for(const n of ['hsSetup','hsTick','hsOnKill','hsBurst'])m(n);
  assert.ok(src.includes("(d>=3&&n.r<0.205)?'siege':'normal'")&&src.includes("if(n.type==='siege')return 'hungerSiege';")&&/siege:\{emoji:'🏰'/.test(src),'Delve siege room');
  const vm=require('vm');const ctx={Math,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},TAU:Math.PI*2,WORLD:4000,console};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setText(t){o.text=t;return o},setVisible(){return o},setOrigin(){return o},setRotation(){return o}};return o;};
  vm.runInContext('class S{'+['hsSetup','hsTick','hsOnKill','hsBurst','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
  const sc=new ctx.K();const en=[];Object.assign(sc,{_amapNode:{d:6},stageIndex:5,player:{x:300,y:0},sugarStage:0,sugarRun:0,add:{circle:()=>obj(),text:()=>obj()},objectivePosition:()=>({x:300,y:0}),sigText:()=>obj(),sigAdd:o=>o,
    sigNear(x,y,R){return Math.hypot(this.player.x-x,this.player.y-y)<R;},sigSpawnAt:(x,y,el)=>{const e={x,y,active:true,isElite:!!el,maxhp:100,hp:100,scaleX:1,setScale(){},setTint(){}};en.push(e);return e;},completeWaveObjective(){this.done=true;}});
  const o={progress:0},S={};sc.hsSetup(o,S);assert.strictEqual(S.gates.length,5);for(let k=0;k<50;k++)sc.hsTick(.1,o,S);assert.ok(en.length>=4,'gates send waves');
  for(let i=0;i<6;i++)sc.hsOnKill({x:0,y:0},o,S);assert.strictEqual(S.pot,6);sc.player={x:2000,y:0};const p0=o.progress;for(let k=0;k<25;k++)sc.hsTick(.1,o,S);assert.strictEqual(o.progress,p0,'timer pauses outside');assert.ok(S.pot<6,'pot leaks outside');
  sc.player={x:300,y:0};for(let k=0;k<500&&!sc.done;k++)sc.hsTick(.1,o,S);assert.ok(sc.done&&sc.sugarRun>0,'siege ends with a burst');
  console.log('League phase 4: Siege of the Hunger (5 gates, timer inside, leak outside, burst) passed'); }

{ // v8.1.92 Hunger's Domain (Hunger Stone special room)
  for(const n of ['hdSetup','hdTick','hdLord','hdDown'])m(n);
  assert.ok(/this\._domainRun=!!this\._domainRequested;/.test(src)&&/Save\.data\.hungerStones--/.test(src),'stone is spent when the domain starts');
  assert.ok(src.includes("const ms=this._domainRun?'hungerDomain':nd&&nd.mission;"),'domain replaces the room mission');
  assert.ok(/'Domain ×'\+stones/.test(src),'Delve panel shows the Domain button');
  const vm=require('vm');const ctx={Math,TAU:Math.PI*2,console,Save:{data:{}}};vm.createContext(ctx);
  const obj=()=>{const o={x:0,y:0,setFillStyle(){return o},setStrokeStyle(){return o},setDepth(){return o},setText(){return o},setVisible(){return o},setOrigin(){return o},setPosition(){return o}};return o;};
  vm.runInContext('class S{'+['hdSetup','hdTick','hdLord','hdDown','hmSplinters','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
  const sc=new ctx.K();const en=[];Object.assign(sc,{_amapNode:{d:8},stageIndex:5,player:{x:0,y:0},sugarStage:0,sugarRun:0,add:{circle:()=>obj(),text:()=>obj()},sigAdd:o=>o,
    sigSpawnAt:(x,y,el)=>{const e={x,y,active:true,isElite:!!el,maxhp:100,hp:100,scaleX:1,setScale(){},setTint(){}};en.push(e);return e;},completeWaveObjective(){this.done=true;}});
  const o={},S={};sc.hdSetup(o,S);for(let k=0;k<100;k++)sc.hdTick(.1,o,S);assert.ok(en.some(e=>e._breach),'flood spawns breach monsters');assert.strictEqual(S.phase,'flood');
  for(let k=0;k<210;k++)sc.hdTick(.1,o,S);assert.strictEqual(S.phase,'lord');assert.ok(S.lord._hdLord&&S.lord.maxhp>=1000,'Breachlord is a big fight');
  S.lord._hdLord=false;sc.hdDown(S.lord,o,S);assert.ok(sc.done&&sc.sugarRun>0);assert.ok(ctx.Save.data.splinters>=20,'big splinter reward');
  console.log('Hunger’s Domain: stone spent, flood, Breachlord, big reward passed'); }
{ // v8.1.114 owner (mission review #2): Chapter 1 first play keeps only Herald (C1-1) + Frozen Pantry (C1-4); Mouth / Pot / Golem wait for a replay or Chapter 1 clear
  const src2=require('fs').readFileSync('game.js','utf8'),vm2=require('vm');const at=src2.indexOf('  c1FirstPool('),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src2.slice(at+1));
  const ctx={Save:{data:{stageMastery:{}}},storyCleared:()=>0,C1_LATER_LEAGUE:['hungersMouth','grandmasPot','grandmasGolem']};vm2.createContext(ctx);vm2.runInContext('class S{'+src2.slice(at,at+1+nx.index)+'};this.K=S;',ctx);
  const s=new ctx.K(),P=['grandmasPot','hunt','capture','purge'];s.stageIndex=2;require('assert').deepStrictEqual(s.c1FirstPool(P),['hunt','capture','purge'],'first play C1-3: no Pot');
  ctx.Save.data.stageMastery[2]=true;require('assert').deepStrictEqual(s.c1FirstPool(P),['hunt','capture','purge'],'v8.1.115 replay before meeting Grandma (C1-4): still no Pot');ctx.Save.data.stageMastery[3]=true;require('assert').deepStrictEqual(s.c1FirstPool(P),P,'replay after meeting Grandma: Pot returns');ctx.Save.data.stageMastery={3:true};ctx.storyCleared=()=>5;require('assert').deepStrictEqual(s.c1FirstPool(P),P,'after Chapter 1: Pot returns');
  ctx.storyCleared=()=>0;s.stageIndex=0;require('assert').deepStrictEqual(s.c1FirstPool(['hungerHerald','hunt']),['hungerHerald','hunt'],'Herald stays in C1-1');s.stageIndex=7;require('assert').deepStrictEqual(s.c1FirstPool(P),P,'other chapters untouched');s.stageIndex=2;s.recipeMode=true;require('assert').deepStrictEqual(s.c1FirstPool(P),P,'Delve untouched');
  require('assert').ok(src2.includes("objectives:['survive','hunt','frozenPantry','capture'],lead:'frozenPantry',"),'C1-4 leads with Frozen Pantry');
  console.log('Chapter 1 pacing: first play Herald + Frozen Pantry only; Mouth/Pot/Golem on replay or after Chapter 1 passed'); }
