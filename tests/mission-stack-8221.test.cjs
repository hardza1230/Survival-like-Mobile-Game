// v8.2.21 เจ้าของ 19 พ.ย. ขั้น B: ภารกิจซ้อนได้ 2 อัน (หลัก + เสริม) ตั้งแต่ Chapter 2 · ห้ามกลุ่มเดียวกัน · กลุ่ม global ไม่ซ้อน · สลับบริบท
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const K=src.match(/const [A-Z][A-Z0-9_]*=[^\n]*?GG_GOLD=[^\n]*?;(?=   \/\/)/)[0].replace(/^const /,'var ');
const ctx={Math,console,Sfx:{},WAVE_OBJECTIVES:new Proxy({},{get:(_,k)=>typeof k==='string'?{emoji:'*',name:k,desc:'d'}:undefined})};vm.createContext(ctx);vm.runInContext(K,ctx);
vm.runInContext('class S{'+['stackRun','stackPick','stackStart','stackTick','stackComplete','stackEnd'].map(m).join('')+'};this.K=S;',ctx);
const G=()=>{const g={destroyed:false,setScrollFactor(){return g},setDepth(){return g},destroy(){g.destroyed=true;},setText(t){g.text=t;return g},setVisible(){return g},setOrigin(){return g}};return g;};
const mk=()=>{const sc=new ctx.K(),log=[];Object.assign(sc,{stageIndex:6,waveIndex:1,sugarStage:0,sugarRun:0,mode:'wave',state:'play',_waveTimed:true,waveDur:90,waveTimer:70,W:390,add:{graphics:G,text:G},camWorld(){},camUI(){},usesStoryBudget:()=>true,
  objNodeG:'G0',waveObjective:{type:'hunt',done:false},_sig:'S0',showBanner(){},logMission(){},missionLootBurst(o,su){log.push(['burst',o.type,su]);},missionRewardGive(o){log.push(['reward',o.type]);},time:{delayedCall(ms,f){f();}},
  sigSetup(o,type){ this._sig={type,objs:[],ctx:[this.waveObjective,this.objNodeG]}; o.target=3; },sigTick(dt,o){ log.push(['tick',o.type,this.waveObjective===o,this._sig&&this._sig.type,this.objNodeG]); },sigClear(){ log.push(['clear',this._sig&&this._sig.type]); this._sig=null; }});return [sc,log];};
{ const [sc]=mk();for(let i=0;i<40;i++){ const t=sc.stackPick({type:'lastLight'}); assert.ok(t&&ctx.STACK_POOL.includes(t)&&ctx.STACK_CAT[t]!=='zone','never the same group as the main mission'); }
  assert.strictEqual(sc.stackPick({type:'frozenPantry'}),null,'global missions never stack');assert.strictEqual(sc.stackPick({type:'hungersMouth'}),null); }
{ const [sc,log]=mk();const K0=sc.stackStart('shakeTrees');assert.ok(K0&&sc._stack&&K0.S&&K0.S.type==='shakeTrees','side mission set up');assert.strictEqual(K0.S.ctx[0],K0.o,'set up inside its own context');assert.ok(K0.S.ctx[1]===K0.g&&K0.g!=='G0','own graphics layer');
  assert.ok(sc.waveObjective.type==='hunt'&&sc._sig==='S0'&&sc.objNodeG==='G0','main mission context restored');assert.ok(K0.T<=sc.waveTimer,'fits in the wave');
  sc.stackTick(.1);const tk=log.find(l=>l[0]==='tick');assert.ok(tk&&tk[2]&&tk[3]==='shakeTrees'&&tk[4]===K0.g,'ticks in its own context');assert.ok(sc._sig==='S0');
  K0.o.progress=3;sc.stackTick(.1);assert.ok(log.some(l=>l[0]==='reward'&&l[1]==='shakeTrees'),'full reward');assert.ok(!sc._stack&&K0.g.destroyed&&log.some(l=>l[0]==='clear'&&l[1]==='shakeTrees'),'cleaned up');assert.ok(sc.mode==='wave','the wave keeps going'); }
{ const [sc,log]=mk();const K0=sc.stackStart('seedRift');K0.o.progress=2;K0.T=0.05;sc.stackTick(.1);assert.ok(!sc._stack&&log.some(l=>l[0]==='burst'),'time up at ≥50% = half reward'); }
{ const [sc]=mk();sc.stackStart('mirrorPath');sc.mode='waveclear';sc.stackTick(.1);assert.ok(!sc._stack,'ends with the wave'); }
{ const [sc]=mk();sc.stageIndex=3;sc.waveDur=90;sc.waveTimer=60;sc.stackTick(.1);assert.ok(!sc._stack,'not in Chapter 1'); }
{ const [sc]=mk();sc.waveTimer=60;const r=Math.random;Math.random=()=>0;try{ sc.stackTick(.1);}finally{Math.random=r;} assert.ok(sc._stack,'starts after STACK_AT seconds');sc._stack&&assert.ok(ctx.STACK_CAT[sc._stack.type]!=='hunt'); }
assert.ok(m('completeWaveObjective').includes('if(this._stackSwap)return this.stackComplete();'),'completion inside the side context does not end the wave');
assert.ok(m('sigOnKill').includes('this.stackRun(()=>this.sigOnKill(e))'),'kills reach the side mission');
assert.ok(m('tickStage').includes('this.stackTick?.(dt);')&&m('setupWaveObjective').includes('this.stackEnd?.(false);'),'hooks');
console.log('Mission stacking 8.2.21: group rules, own context + graphics, full reward without ending the wave, half on expiry, ends with the wave, Chapter 2+ passed');
