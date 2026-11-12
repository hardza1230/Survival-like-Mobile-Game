// v8.1.116 owner (mission review steps 3+4): shared mission start/end presentation + a per-mission reward shown before start.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
const ctx=vm.createContext({});vm.runInContext(s.match(/const MISSION_REWARDS=\{[^\n]*\};/)[0]+';this.MISSION_REWARDS=MISSION_REWARDS;',ctx);
const R=ctx.MISSION_REWARDS,SIG=eval(s.match(/const SIG_MISSIONS=(\[[^\]]*\]);/)[1]);
for(const t of ['fill','survive','hunt','purge','capture','cleanAir','defendNectar','seasonCycle','breakRoots',...SIG])assert(R[t],'reward for '+t);
for(const [t,[k,n]] of Object.entries(R)){assert(k==='gear'||s.includes("{key:'"+k+"',"),t+' uses a real currency');assert(n>=1);}
ctx.currencyDef=k=>({berryjam:{emoji:'🍓',name:'Berry Jam'}})[k];
const C=vm.runInContext('class C{'+['missionReward','missionRewardGive'].map(method).join('\n')+'}C',ctx);
const sc=si=>Object.assign(new C(),{stageIndex:si,player:{x:0,y:0},drops:[],spawnCurrencyDrop(x,y,k){const g={k};this.drops.push(g);return g;},lootHold(){},spawnLoot(x,y,t){this.gear=t;return {};}});
{const a=sc(0);const r=a.missionReward({type:'capture'});assert.equal(r.n,2);assert.equal(r.txt,'🍓 Berry Jam ×2');assert.equal(sc(5).missionReward({type:'capture'}).n,3);assert.equal(sc(10).missionReward({type:'capture'}).n,4,'harder chapters pay more');
 const o={type:'capture'};a.missionRewardGive(o);assert.equal(a.drops.length,2);assert(a.drops.every(g=>g.forgeQuantity===1),'exactly what the card promised');a.missionRewardGive(o);assert.equal(a.drops.length,2,'paid once');
 const b=sc(2);b.missionRewardGive({type:'hunt'});assert.equal(b.gear,1);assert.equal(b._lootMinRare,false);
 const t=sc(0);t._inTutorial=true;assert.equal(t.missionReward({type:'capture'}),null);}
const cw=method('completeWaveObjective');assert(cw.includes('this.missionRewardGive?.(o)')&&cw.includes("this.missionStamp?.(o,_ob?'⭐ BONUS CLEAR!':'✅ MISSION COMPLETE'")&&cw.includes('this.showBanner(title,sub,1500)'),'end = stamp + reward, banner fallback');
assert(cw.indexOf('missionRewardGive')<cw.indexOf('this.clearWaveObjective();this.mode='),'reward drops at the mission point before cleanup');
const bw=method('beginWave');assert(bw.includes('this.missionIntro?.(o,!!o._armPad)')&&bw.includes('if(!_card)this.showSpeechBubble'),'intro card replaces banner + duplicate bubble');
assert(method('missionArm').includes("'🎁 '+R.txt"),'reward floats above the start pad');assert(method('missionArmTick').includes('this.missionGo(o,A.x,A.y,true)'));
assert(method('setupWaveObjective').includes('this.missionGo?.(o,null,null,false)'));
const it=method('missionIntro');assert(it.includes("'Reward: '+R.txt")&&it.includes('this.camUI(c)')&&it.includes("'Step on ✨ to begin'"));
console.log('mission-template ok');
// v8.1.116 owner: Ruby in the corner with the bubble to her left (no overflow, no overlap), raised; boss speech small above the boss head, quote only.
const rn=method('rubyNext');assert(rn.includes('ax=W-pad-av0/2,bx=ax-av0/2-6-bw,by=pad+138')&&rn.includes('this.rubyAvatar(ax-40,by+bh+4,av0,m.face)')&&rn.includes('const tx0=bx+13')&&rn.includes('(bw-26)/Math.max(1,x)'),'Ruby layout');
const bs=method('bossSay');assert(bs.includes("head=who&&!over?who+'\\n':''")&&bs.includes('.setOrigin(.5,1).setDepth(90010)')&&bs.includes('t.setPosition(src.x,hy())')&&bs.includes("fontSize:'11px'"),'boss speech over the head');
assert((s.match(/this\.bossSay\([^;]*,b\);/g)||[]).length>=4,'callers pass the speaker');
console.log('speech layout ok');
{ // smoke: run the presentation methods against chainable stubs (catches runtime TypeErrors)
  const mk=()=>{const o=new Proxy(function(){},{get(t,k){if(k==='width'||k==='height')return 40;if(k==='active')return true;if(k==='visible')return true;if(k==='x'||k==='y')return 10;if(k==='then')return undefined;if(!(k in t))t[k]=(...a)=>o;return t[k];},apply(){return o;}});return o;};
  const ctx2=vm.createContext({Sfx:{orderCue(){},voiceBlip(){},select(){}},rubyWrap:(t)=>[t],RUBY_TIPS:{},MISSION_REWARDS:R,currencyDef:k=>({emoji:'🍓',name:k}),Math,Date});
  const D=vm.runInContext('class D{'+['missionReward','missionRewardGive','missionCardClear','missionPanel','missionIntro','missionGo','missionStamp','rubyNext','bossSay'].map(method).join('\n')+'}D',ctx2);
  const d=Object.assign(new D(),{W:390,H:844,_pad:14,stageIndex:3,player:{x:0,y:0},add:{container:mk,graphics:mk,text:mk,circle:mk,image:mk},tweens:{add(c){c.onComplete?.();},killTweensOf(){}},time:{now:0,delayedCall(ms,f){this.q=(this.q||[]);this.q.push(f);return mk();},addEvent(c){c.callback?.();return mk();}},cameras:{main:{zoom:1.05}},camUI:x=>x,camWorld:x=>x,missionPoint:()=>({x:5,y:5}),spawnCurrencyDrop:()=>({}),lootHold(){},rubyOn:()=>true,rubyAvatar:()=>mk(),rubySparkle(){},waveObjTxt:mk()});
  const o={type:'capture',name:'Capture',emoji:'🎯',desc:'Hold the ring',color:0xff88aa};
  assert.equal(d.missionIntro(o,true),true);assert(o._rw);d.missionGo(o,1,1,true);assert.equal(d.missionStamp(o,'✅ MISSION COMPLETE','Sugar +10\nnext',o._rw.txt),true);
  d._rubyQ=[{text:'Hello [flavor] friend',ms:1000,face:'happy'}];d.rubyNext();assert(d._ruby&&d._ruby.bottom>0);
  d.bossSay('I will eat it all','Boss',0,{x:100,y:200,active:true,displayHeight:140});d.bossSay('Corner fallback','Boss',0,null);d.rubyHide=()=>{};for(const f of d.time.q)f();
  console.log('presentation smoke ok');}
