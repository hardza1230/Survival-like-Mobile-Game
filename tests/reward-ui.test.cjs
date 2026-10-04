const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
const methods=['openCrossroads','chooseCrossroad','resumeAfterCrossroads','clearCrossroads','scheduleStageEvent','openPrizeWheel','openMysteryCards','clearMysteryCards','miniPrizePool'];
function extract(name){const at=source.indexOf('  '+name+'(');assert(at>=0);const tail=source.slice(at+1);const next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,next?at+1+next.index:source.length);}
const roads=source.match(/const CROSSROADS=\[[\s\S]*?\];/)[0];
const Save={data:{threads:10,scrolls:2},threads(){return this.data.threads;},scrolls(){return this.data.scrolls;},addShovels(n){this.shovels=(this.shovels||0)+n;},save(){this.saved=(this.saved||0)+1;}};
const ctx={Save,Math:Object.create(Math),TAU:Math.PI*2,Sfx:new Proxy({},{get:()=>()=>{}}),Phaser:{Utils:{Array:{Shuffle:x=>x}},BlendModes:{ADD:1}},MINI_CHEST_TIERS:{gold:{name:'Gold',color:0xffd166,artKey:'gold'}}};
vm.createContext(ctx);const layout=source.slice(source.indexOf('function prizeWheelLayout('),source.indexOf('const WORLD ='));const Reward=vm.runInContext(layout+roads+'\nclass Reward{'+methods.map(extract).join('\n')+'\n}\nReward',ctx);
function scene(){
 const s=new Reward(),queue=[],objects=[],highlights=[];let now=0,id=0;
 function obj(kind,x=0,y=0,key){const o={kind,x,y,key,width:key==='prize_wheel_bg'?1024:256,height:key==='prize_wheel_bg'?1536:384,scaleX:1,scaleY:1,active:true,id:id++,highlightAtCreate:highlights.at(-1)};if(kind==='container')o.list=[];objects.push(o);
  return new Proxy(o,{get(t,k){if(k in t)return t[k];return (...args)=>{if(k==='add'){t.list.push(...(Array.isArray(args[0])?args[0]:[args[0]]));}if(k==='destroy'){t.active=false;if(Array.isArray(t.list))for(const child of t.list)child.destroy();}if(k==='setDisplaySize'){t.scaleX=args[0]/t.width;t.scaleY=args[1]/t.height;}if(k==='setScale')t.scaleX=t.scaleY=args[0];if(k==='setText')t.text=args[0];if(k==='lineStyle')t.stroke=args[1];if(k==='strokeCircle'&&t.stroke===0xffffff)highlights.push(args.slice(0,2));return o.proxy;};}});
 }
 const add=(kind,...args)=>{const p=obj(kind,...args);p.proxy=p;return p;};
 Object.assign(s,{W:400,H:860,state:'play',mode:'breather',stageIndex:1,waveIndex:2,player:{hp:100,maxhp:200,dmgMul:2,cdMul:0.8,setVelocity(){}},physics:{paused:false,pause(){this.paused=true;},resume(){this.paused=false;}},textures:{get:()=>({getSourceImage:()=>({width:1024,height:1536})})},camUI:o=>o,popHeal(){},showBanner(){},screenFlash(){},screenShake(){},startWave(n){this.started=n;},currencyTierFor:()=>1,addRunSugar(){},grantCurrencyReward(){},diffMul:()=>({reward:1}),
 add:new Proxy({},{get:(_,kind)=>(...args)=>add(kind,...args)}),time:{delayedCall(delay,fn){const ev={at:now+delay,fn,remove(){this.removed=true;}};queue.push(ev);return ev;}},tweens:{killTweensOf(target){for(const q of queue)if(q.target===target)q.removed=true;},add(c){if(c.onComplete)queue.push({at:now+(c.duration||0)+(c.delay||0),fn:c.onComplete,target:c.targets});}}});
 s.advance=(ms)=>{const target=now+ms;let count=0;while(true){queue.sort((a,b)=>a.at-b.at);if(!queue.length||queue[0].at>target)break;const q=queue.shift();now=q.at;if(!q.removed)q.fn();assert(++count<2000,'No infinite reward timers');}now=target;};s.objects=objects;s.highlights=highlights;return s;
}
for(const index of [0,1]){const s=scene();s.openCrossroads(3);assert.equal(s._rollBtns.length,2);assert.equal(s.state,'rolling');assert(s.physics.paused);assert.equal(s._xr.gates,undefined);s.advance(20000);assert(s._xr,'Choice does not expire');const click=s._rollBtns[index].fn;click();click();assert.equal(s.state,'play');assert(!s.physics.paused);assert.equal(s._rollBtns.length,0);assert.equal(s.player.cdMul,0.8);
 if(index===0){assert.equal(s.player.hp,70);assert.equal(s.player.dmgMul,2.25);s.advance(90000);assert.equal(s.player.dmgMul,2);}else{assert.equal(s.player.hp,180);assert.equal(s.player.dmgMul,2);}s.advance(4000);assert.equal(s.started,3);}
{const s=scene();s.player.hp=0.5;s.openCrossroads(3);s._rollBtns[0].fn();assert.equal(s.player.hp,1);}
{const s=scene();s.player.hp=190;s.openCrossroads(3);s._rollBtns[1].fn();assert.equal(s.player.hp,200);}
{const s=scene();s.state='levelup';s.openCrossroads(3);assert.equal(s._xr,undefined);s.advance(1000);assert.equal(s._xr,undefined);s.state='play';s.advance(400);assert.equal(s._rollBtns.length,2);s.clearCrossroads();assert.equal(s._xr,null);assert.equal(s.state,'play');}
// The highlighted slot and delivered prize must agree, for each possible winner
// and different stop timings; exercise the actual wheel timers and callbacks.
for(const count of [8,12])for(let win=0;win<count;win++)for(const stopAt of [0,310,890]){
 const s=scene();let given=-1,done=0;ctx.Math.random=()=>((win+0.1)/count);
 s.miniPrizePool=()=>Array.from({length:count},(_,i)=>({w:1,artKey:'reward'+i,name:'Reward '+i,color:0x100+i,give(){given=i;}}));
 s.openPrizeWheel('gold',()=>done++);assert.equal(s.objects.filter(o=>o.kind==='image'&&/^reward/.test(o.key)).length,8);const bg=s.objects.find(o=>o.key==='prize_wheel_bg');assert(bg.y-bg.height*bg.scaleY/2<=0.00001);assert(bg.y+bg.height*bg.scaleY/2>=s.H-0.00001);assert(bg.width*bg.scaleX>=s.W);s.advance(stopAt);s._rollBtns[0].fn();s.advance(12000);
 assert.equal(given,win);assert.equal(done,1);assert.equal(s.state,'play');assert(!s.physics.paused);
 const big=s.objects.filter(o=>o.kind==='image'&&o.key==='reward'+win).at(-1);
 assert.deepEqual(big.highlightAtCreate,[big.x,big.y],'Wheel highlight matches delivered prize');
 assert(!s.objects.some(o=>o.kind==='text'&&['🍬','✨','🍭','⭐'].includes(o.key)),'No emoji confetti');
}
{const s=scene();s.openMysteryCards(()=>{});assert.equal(s._rollBtns.length,3);assert.equal(s.objects.filter(o=>o.kind==='image'&&o.key==='mystery_card_back').length,3);assert(!s.objects.some(o=>o.kind==='text'&&o.key==='❓'));}
console.log('Reward UI: two choices, no expiry, one-shot selection, HP caps, damage expiry, modal deferral, 24 wheel outcomes and illustrated mystery backs passed');

// Reward persistence and run effects for all new prize kinds, including low HP and full HP.
for(const tier of ['bronze','silver','gold']){
 const s=scene(),pool=s.miniPrizePool(tier);assert.equal(pool.length,12);assert.equal(new Set(pool.map(p=>p.id)).size,12);
 const before=Save.threads();pool.find(p=>p.id==='thread').give();assert.equal(Save.threads()-before,tier==='gold'?5:3);
 const shovel=Save.shovels||0;pool.find(p=>p.id==='shovel').give();assert.equal(Save.shovels-shovel,tier==='gold'?2:1);
 const scroll=Save.scrolls();pool.find(p=>p.id==='scroll').give();assert.equal(Save.scrolls()-scroll,1);
 s.uniqueCd=10;s.player.hp=190;pool.find(p=>p.id==='recharge').give();assert.equal(s.uniqueCd,0);assert.equal(s.player.hp,200);
 assert.equal(pool.find(p=>p.id==='card').artKey,'prize_levelup');
}
const rows=vm.runInNewContext(source.match(/const HUD_ROWS=\{[^;]+;/)[0]+'HUD_ROWS');
assert(rows.objective+17<rows.progress-33/2,'Progress label clears the meter');
assert(rows.progress+33/2<rows.bossName,'Progress meter clears boss name');
assert(rows.bossName+16<rows.bossBg,'Boss name clears boss HP');
const cover=vm.runInNewContext(layout+'prizeWheelLayout');
for(const [w,h] of [[320,568],[360,800],[390,844],[430,932],[768,1024]]){
 const p=cover(w,h,1024,1536);assert(p.bgScale*1024>=w);assert(p.bgY-1536*p.bgScale/2<=0.00001);assert(p.bgY+1536*p.bgScale/2>=h-0.00001);
 assert(p.cy+p.R+84+46<h,'STOP button stays on screen');
}
console.log('Wheel regression: 60 outcomes, 12-prize pool, persistent resources, Unique recharge, full backdrop and separated boss HUD passed');

// Closing or replacing a reward modal cancels reveals and cannot pay twice.
for(const early of [0,100,500,1600]){
 const s=scene();let paid=0,done=0;
 const prize={name:'Sugar',sub:'+1',emoji:'x',color:0xff00ff,give(){paid++;}};
 s.openMysteryCards(()=>done++,{prizes:[prize,prize,prize],choice:true});
 s._rollBtns[0].fn();s.advance(early);s.clearMysteryCards();
 const created=s.objects.length;s.advance(10000);
 assert.equal(s.objects.length,created,'Cancelled flips cannot recreate reward art');
 assert.equal(paid,0);assert.equal(done,0);assert.equal(s._mysteryCards,null);
 assert(s.objects.every(o=>!o.active),'All nested cards and labels destroyed');
}
{
 const s=scene();let paid=0,done=0;
 const prize={name:'Sugar',sub:'+1',emoji:'x',color:0xff00ff,give(){paid++;}};
 s.openMysteryCards(()=>done++,{prizes:[prize,prize,prize],choice:true});
 s._rollBtns[0].fn();s.advance(1600);const keep=s._rollBtns[0].fn;keep();keep();s.advance(10000);
 assert.equal(paid,1);assert.equal(done,1);assert.equal(s._mysteryCards,null);assert(s.objects.every(o=>!o.active));
}
console.log('Boss Loot lifecycle: cancelled reveals, recursive cleanup and repeated Keep grant once passed');
