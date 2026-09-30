const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
const methods=['openCrossroads','chooseCrossroad','resumeAfterCrossroads','clearCrossroads','scheduleStageEvent','openPrizeWheel','openMysteryCards'];
function extract(name){const at=source.indexOf('  '+name+'(');assert(at>=0);const tail=source.slice(at+1);const next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,next?at+1+next.index:source.length);}
const roads=source.match(/const CROSSROADS=\[[\s\S]*?\];/)[0];
const ctx={Math:Object.create(Math),TAU:Math.PI*2,Sfx:new Proxy({},{get:()=>()=>{}}),Phaser:{Utils:{Array:{Shuffle:x=>x}},BlendModes:{ADD:1}},MINI_CHEST_TIERS:{gold:{name:'Gold',color:0xffd166,artKey:'gold'}}};
vm.createContext(ctx);const Reward=vm.runInContext(roads+'\nclass Reward{'+methods.map(extract).join('\n')+'\n}\nReward',ctx);
function scene(){
 const s=new Reward(),queue=[],objects=[],highlights=[];let now=0,id=0;
 function obj(kind,x=0,y=0,key){const o={kind,x,y,key,width:256,height:384,scaleX:1,scaleY:1,active:true,id:id++,highlightAtCreate:highlights.at(-1)};objects.push(o);
  return new Proxy(o,{get(t,k){if(k in t)return t[k];return (...args)=>{if(k==='destroy')t.active=false;if(k==='setDisplaySize'){t.scaleX=args[0]/t.width;t.scaleY=args[1]/t.height;}if(k==='setScale')t.scaleX=t.scaleY=args[0];if(k==='setText')t.text=args[0];if(k==='lineStyle')t.stroke=args[1];if(k==='strokeCircle'&&t.stroke===0xffffff)highlights.push(args.slice(0,2));return o.proxy;};}});
 }
 const add=(kind,...args)=>{const p=obj(kind,...args);p.proxy=p;return p;};
 Object.assign(s,{W:400,H:860,state:'play',mode:'breather',stageIndex:1,waveIndex:2,player:{hp:100,maxhp:200,dmgMul:2,cdMul:0.8,setVelocity(){}},physics:{paused:false,pause(){this.paused=true;},resume(){this.paused=false;}},camUI:o=>o,showBanner(){},screenFlash(){},screenShake(){},startWave(n){this.started=n;},currencyTierFor:()=>1,addRunSugar(){},grantCurrencyReward(){},diffMul:()=>({reward:1}),
 add:new Proxy({},{get:(_,kind)=>(...args)=>add(kind,...args)}),time:{delayedCall(delay,fn){queue.push({at:now+delay,fn});}},tweens:{killTweensOf(){},add(c){if(c.onComplete)queue.push({at:now+(c.duration||0)+(c.delay||0),fn:c.onComplete});}}});
 s.advance=(ms)=>{const target=now+ms;let count=0;while(true){queue.sort((a,b)=>a.at-b.at);if(!queue.length||queue[0].at>target)break;const q=queue.shift();now=q.at;q.fn();assert(++count<2000,'No infinite reward timers');}now=target;};s.objects=objects;s.highlights=highlights;return s;
}
for(const index of [0,1]){const s=scene();s.openCrossroads(3);assert.equal(s._rollBtns.length,2);assert.equal(s.state,'rolling');assert(s.physics.paused);assert.equal(s._xr.gates,undefined);s.advance(20000);assert(s._xr,'Choice does not expire');const click=s._rollBtns[index].fn;click();click();assert.equal(s.state,'play');assert(!s.physics.paused);assert.equal(s._rollBtns.length,0);assert.equal(s.player.cdMul,0.8);
 if(index===0){assert.equal(s.player.hp,70);assert.equal(s.player.dmgMul,2.5);s.advance(90000);assert.equal(s.player.dmgMul,2);}else{assert.equal(s.player.hp,180);assert.equal(s.player.dmgMul,2);}s.advance(4000);assert.equal(s.started,3);}
{const s=scene();s.player.hp=0.5;s.openCrossroads(3);s._rollBtns[0].fn();assert.equal(s.player.hp,1);}
{const s=scene();s.player.hp=190;s.openCrossroads(3);s._rollBtns[1].fn();assert.equal(s.player.hp,200);}
{const s=scene();s.state='levelup';s.openCrossroads(3);assert.equal(s._xr,undefined);s.advance(1000);assert.equal(s._xr,undefined);s.state='play';s.advance(400);assert.equal(s._rollBtns.length,2);s.clearCrossroads();assert.equal(s._xr,null);assert.equal(s.state,'play');}
// The highlighted slot and delivered prize must agree, for each possible winner
// and different stop timings; exercise the actual wheel timers and callbacks.
for(let win=0;win<8;win++)for(const stopAt of [0,310,890]){
 const s=scene();let given=-1,done=0;ctx.Math.random=()=>((win+0.1)/8);
 s.miniPrizePool=()=>Array.from({length:8},(_,i)=>({w:1,artKey:'reward'+i,name:'Reward '+i,color:0x100+i,give(){given=i;}}));
 s.openPrizeWheel('gold',()=>done++);s.advance(stopAt);s._rollBtns[0].fn();s.advance(12000);
 assert.equal(given,win);assert.equal(done,1);assert.equal(s.state,'play');assert(!s.physics.paused);
 const big=s.objects.filter(o=>o.kind==='image'&&o.key==='reward'+win).at(-1);
 assert.deepEqual(big.highlightAtCreate,[big.x,big.y],'Wheel highlight matches delivered prize');
 assert(!s.objects.some(o=>o.kind==='text'&&['🍬','✨','🍭','⭐'].includes(o.key)),'No emoji confetti');
}
{const s=scene();s.openMysteryCards(()=>{});assert.equal(s._rollBtns.length,3);assert.equal(s.objects.filter(o=>o.kind==='image'&&o.key==='mystery_card_back').length,3);assert(!s.objects.some(o=>o.kind==='text'&&o.key==='❓'));}
console.log('Reward UI: two choices, no expiry, one-shot selection, HP caps, damage expiry, modal deferral, 24 wheel outcomes and illustrated mystery backs passed');
