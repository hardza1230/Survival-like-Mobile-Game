// v8.1.162 Clean Air "Lost Wisps": lure → iris close → burst + wisps scatter → dark with lantern, monster eyes, charge-to-free (pause, not reset) → all freed → end flash → complete; Taro zap reaction + chain stop.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const S=vm.runInNewContext('class S{'+['cleanAirV2Spawn','cleanAirV2Tick','cleanAirV2Eyes','cleanAirV2Burst','cleanAirV2Free','cleanAirV2Clear'].map(grab).join('\n')+'}; S',{Math,Sfx:{},CA_LANTERN:[200,150]});
const s=new S(); const obj=()=>{ const o={active:true,x:0,y:0,setDepth(){return o;},setScale(){return o;},setAlpha(){return o;},setVisible(){return o;},destroy(){o.active=false;}}; return o; };
const G=()=>{ const g=obj(); for(const f of ['clear','lineStyle','strokeCircle','beginPath','arc','strokePath','fillStyle','fillCircle'])g[f]=()=>g; return g; };
let fog=[],done=0,spawned=0,delayed=[];
Object.assign(s,{W:400,H:800,stageIndex:6,state:'play',player:{x:0,y:0,body:{velocity:{x:0,y:0}}},sugarStage:0,sugarRun:0,waveTypes:['basic'],
  add:{circle:()=>obj(),image:()=>obj(),graphics:()=>G()},camWorld:o=>o,tweens:{add(c){ c.onComplete&&c.onComplete(); },killTweensOf(){}},time:{delayedCall(ms,f){delayed.push(f);}},cameras:{main:{zoom:1}},
  objectivePosition:(i,n)=>({x:500+i*100,y:0}),dist:(a,b,c,d)=>Math.hypot(a-c,b-d),cleanAirV2Fog:(c,h,a)=>fog.push(a),screenFlash(){},screenShake(){},codeShock(){},floatText(){},renderWaveObjectiveHUD(){},
  enemies:{getChildren:()=>[]},spawnEnemy:()=>{spawned++;return {setPosition(){},body:{reset(){}}};},spawnRise(){},completeWaveObjective(){done++;}});
const o={target:4,progress:0}; const c=s.cleanAirV2Spawn(o); s._cleanAir=c; assert.equal(c.phase,'lure');
s.player.x=300; s.cleanAirV2Tick(.1,o); assert.equal(c.phase,'lure'); assert.equal(fog.pop(),0,'bright before touching the Wisp');
s.player.x=c.x; s.player.y=c.y; s.cleanAirV2Tick(.1,o); assert.equal(c.phase,'close');
for(let i=0;i<14;i++)s.cleanAirV2Tick(.1,o); assert.equal(c.phase,'dark'); assert.equal(c.wisps.length,4,'4 wisps scatter');
// monsters from the dark: eyes first, then a spawn
s.player.x=-2000; s.player.y=0; for(let i=0;i<30;i++)s.cleanAirV2Tick(.1,o); assert(spawned>0,'monsters emerge'); assert(c.lantern<200&&c.lantern>=150,'lantern dims (v8.2.80 200→150)');
// charge: partial, leave, return → keeps progress
const w=c.wisps[0]; s.player.x=w.x; s.player.y=w.y; for(let i=0;i<10;i++)s.cleanAirV2Tick(.1,o); assert(w.charge>=.9&&!w.freed); s.player.x=-999; s.cleanAirV2Tick(.1,o); const kept=w.charge; s.player.x=w.x; for(let i=0;i<6;i++)s.cleanAirV2Tick(.1,o); assert(w.freed&&kept>=.9,'pause not reset'); assert.equal(o.progress,1); assert(c.lantern>198,'lantern refilled'); assert.equal(c.lit.length,1);
for(const q of c.wisps.slice(1)){ s.player.x=q.x; s.player.y=q.y; for(let i=0;i<17;i++)s.cleanAirV2Tick(.1,o); } assert.equal(o.progress,4); delayed.forEach(f=>f()); assert.equal(c.phase,'end');
for(let i=0;i<12;i++)s.cleanAirV2Tick(.1,o); assert.equal(done,1,'mission completes after the end flash');
s.cleanAirV2Clear(); assert.equal(c.objs.length,0);
assert(src.includes("const CLEANAIR_V2=true;")&&src.includes("!(o.type==='cleanAir'&&typeof CLEANAIR_V2!=='undefined'&&CLEANAIR_V2)"),'no start button for V2');
assert(src.includes("value=o._v2?Math.floor(o.progress)+' / '+o.target"),'HUD n / N');
assert(src.includes("this.cleanAirV2Clear?.();"),'cleanup hooked');
// Taro
const T=vm.runInNewContext('class T{'+['taroZapReact','taroChainStop','taroZapAt'].map(grab).join('\n')+'}; T',{Math}); const t=new T(); let tw=0,stops=0; const e={active:true,x:5,y:5,angle:0,displayWidth:40};
Object.assign(t,{time:{now:1000},tweens:{add(c){tw++; c.onUpdate&&c.onUpdate(); c.onComplete&&c.onComplete();}},add:{circle:()=>({setDepth(){return this;},destroy(){}})},camWorld:o=>o,enemies:{getChildren:()=>[e]},state:'play',hitStop:()=>stops++});
assert(t.taroZapAt(0,0)); assert.equal(e.angle,0,'angle restored'); assert(!t.taroZapReact(e),'throttled'); assert(t.taroChainStop()); assert(!t.taroChainStop(),'stop throttled'); assert.equal(stops,1);
assert(src.includes("/* v8.1.162 เจ้าของ (Taro C): โซ่ Unique ฟาดทีละตัว ห่าง 45 ms */"),'C');
console.log('Clean Air V2 (Lost Wisps) + Taro zap/stop/sequence passed');
// v8.2.80 owner: wider light, no white drifting puffs, creeping dark edge
{ const src=require('fs').readFileSync(__dirname+'/../game.js','utf8'); const A=require('assert');
  A(src.includes('const CA_LANTERN=[200,150],CA_LOBES=9,CA_CLAWS=7;'));
  A(!src.includes('rt.draw?.(B,px,py,.22*alpha'),'white puffs removed');
  A(src.includes('{x:P.x,y:P.y,r:lr,wob:true}'),'player light has a wobbling edge');
  A(src.includes('cleanAirDarkBrush(){'),'dark claws brush'); console.log('Clear the Fog 8.2.80 visuals passed'); }
