// Production presentation/lifecycle adapters only; no combat simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),src=fs.readFileSync('game.js','utf8');
function method(n){const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const tail=src.slice(at+3),next=/\n  [A-Za-z_$][\w$]*\(/.exec(tail);return src.slice(at,at+3+next.index);}
const Save={data:{settings:{}},save(){this.writes=(this.writes||0)+1;}},sounds=[],ctx={Save,STAGES:Array.from({length:15},()=>({})),bossMotionId:i=>'b'+String(i).padStart(2,'0'),Sfx:new Proxy({},{get:(_,k)=>(...args)=>sounds.push([k,...args])})};vm.createContext(ctx);
const C=vm.runInContext('(class{'+['storyVoice','storyGateKeyTarget','collectStoryGateKey','bossVictoryValid','clearBossVictory','queueBossVictory','renderBossVictory','finishBossVictory','bossComicValid','ownBossComic','clearBossStory'].map(method).join('\n')+'})',ctx);
function obj(type){return{type,active:true,alpha:1,scaleX:1,scaleY:1,displayWidth:100,displayHeight:100,list:[],setDepth(){return this;},setOrigin(){return this;},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;},setFlipX(){return this;},setDisplaySize(){return this;},setTint(){return this;},setAlpha(a){this.alpha=a;return this;},add(o){this.list.push(o);},bringToTop(o){this.list=this.list.filter(x=>x!==o).concat(o);},fillStyle(){return this;},fillTriangle(){return this;},destroy(){this.active=false;this.list.forEach(o=>o.destroy());}};}
function scene({speed=1,red=false,missing=false,low=false,flash=true}={}){Save.data={unlockedStage:14,settings:{vfx:low?0:1,flash}};sounds.length=0;const s=new C(),jobs=[],tweens=[],listeners=[];Object.assign(s,{W:390,H:844,player:{active:true,setVelocity(){}},stageIndex:2,_artEpoch:1,state:'play',mode:'reward',gameSpeed:speed,cameras:{main:{worldView:{x:0,y:0},zoom:1}},textures:{exists:()=>!missing},physics:{pause(){s.paused=true;},resume(){s.paused=false;}},time:{delayedCall(ms,fn){const e={ms,fn,removed:false,remove(){this.removed=true;}};jobs.push(e);return e;}},tweens:{add(c){const t={...c,removed:false,remove(){this.removed=true;}};tweens.push(t);return t;}},events:{once:(ev,fn)=>listeners.push(fn)},add:Object.fromEntries(['container','rectangle','image','circle','graphics','text'].map(k=>[k,()=>obj(k)])),hubMotionAllowed:()=>!red,camUI:o=>o,screenShake(){s.shakes=(s.shakes||0)+1;},mcGate(id,next){s.comic=id;s.afterComic=next;return s.useComic;},onBossDown(){s.rewards=(s.rewards||0)+1;},useComic:true,jobs,tweenJobs:tweens,listeners});return s;}
const pose={key:'boss3',frame:2,sx:1,sy:1};
function run(s){for(const j of [...s.jobs].sort((a,b)=>a.ms-b.ms))if(!j.removed)j.fn();}
for(const speed of [1,4])for(const red of [false,true])for(const missing of [false,true])for(const low of [false,true]){
 const s=scene({speed,red,missing,low});s.queueBossVictory(pose,200,330);const v=s._bossVictory;assert(v.started);assert(s.paused);assert.equal(s.state,'cinematic');assert.equal(v.root.list.length,missing?2:4);assert.equal(Math.max(...s.jobs.map(j=>j.ms))/speed,red?850:1750);
 s.queueBossVictory(pose,0,0);assert.equal(s._bossVictory,v,'duplicate ignored');run(s);assert.equal(s.comic,'b02');assert.equal(s.rewards,undefined,'comic before reward');assert.equal(s._bossVictory,null);assert.equal(v.root.active,false);assert(s.tweenJobs.every(t=>t.removed));if(red)assert.equal(s.tweenJobs.length,0);assert(s.tweenJobs.length<25);s.afterComic();assert.equal(s.rewards,1);assert(!s.paused);s.afterComic();assert.equal(s.rewards,1,'continuation once via owner');
}
for(const change of [s=>s.player={},s=>s.player.active=false,s=>s.stageIndex++,s=>s._artEpoch++,s=>s.state='menu',s=>s.state='dead',s=>s.mode='bossIntro',s=>s.listeners[0](),s=>s.clearBossVictory()]){
 const s=scene();s.queueBossVictory(pose,200,330);const v=s._bossVictory;change(s);run(s);assert.equal(s.rewards,undefined);assert.equal(s.comic,undefined);assert.equal(v.root.active,false);
}
{const s=scene();s.state='levelup';s.queueBossVictory(pose,1,1);assert(!s._bossVictory.started);s.jobs.shift().fn();assert(!s._bossVictory.started);s.state='play';s.jobs.at(-1).fn();assert(s._bossVictory.started);s.clearBossVictory();}
{const s=scene({flash:false});s.useComic=false;s.queueBossVictory(null,1,1);run(s);assert.equal(s.rewards,1);assert.equal(s._bossComicOwner,null);}
{const s=scene();s.queueBossVictory(pose,1,1);run(s);s.stageIndex++;s.afterComic();assert.equal(s.rewards,undefined);}
assert(src.includes('if(isBoss&&!victory) this.bossDefeat'));assert(src.includes('if(victory){this.queueBossVictory(victoryPose,bx,by);return;}'));assert(method('clearArtVfx').includes('this.clearBossVictory?.();'));
console.log('Boss victory: real-time x1/x4, short reduced motion, missing art/low/flash, modal wait, duplicate and stale/shutdown cleanup, boss comic before once-only rewards passed');

for(let i=0;i<14;i++){
 const s=scene();s.stageIndex=i;Save.data.unlockedStage=i;Save.data.storyGateKeys={};assert.equal(s.storyGateKeyTarget(),i+1);
 s.queueBossVictory(pose,1,1);const v=s._bossVictory;run(s);assert.equal(Save.data.storyGateKeys[i+1],1);assert.equal(Save.data.unlockedStage,i+1);assert.equal(s.collectStoryGateKey(i+1),false);assert.equal(s.storyGateKeyTarget(),null);
 assert.equal(s.comic,'b'+String(i).padStart(2,'0'));assert.equal(s.rewards,undefined);s.afterComic();assert.equal(s.rewards,1);
}
{const s=scene();s.stageIndex=14;Save.data.unlockedStage=14;assert.equal(s.storyGateKeyTarget(),null);assert.equal(s.collectStoryGateKey(15),false);}
for(const flag of ['recipeMode','riftMode','bossRush','_inTutorial','_pinnacleRun']){const s=scene();s[flag]=true;Save.data.unlockedStage=0;assert.equal(s.storyGateKeyTarget(),null);assert.equal(s.collectStoryGateKey(3),false);}
{const s=scene({missing:true,red:true});Save.data.unlockedStage=2;s.queueBossVictory(pose,1,1);assert.equal(s.jobs.at(-1).ms,1150);run(s);assert.equal(Save.data.unlockedStage,3,'art failure never blocks the key');}
{const s=scene();Save.data.unlockedStage=2;s.queueBossVictory(pose,1,1);s.clearBossVictory();run(s);assert.equal(Save.data.unlockedStage,2,'cancel before collection cannot unlock');}
const crypto=require('node:crypto'),m=JSON.parse(fs.readFileSync('assets/art/boss_victory/MANIFEST.json','utf8'));for(const[p,h]of[[m.path,m.sha256],[m.source,m.source_sha256]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h);
assert(src.includes("'sc44_frame','bv46_key'"));assert(src.includes("if(k.startsWith('bv46_')"));
console.log('Story gate key: all14 next-stage doors, idempotent collection/unlock, old progression/replays/finale/special modes, canceled/missing-art and original asset hashes passed');
