// Exercise narration boundaries with inert scene dependencies; no combat simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
function method(name){const at=src.indexOf('\n  '+name+'('),tail=src.slice(at+3),next=/\n  [a-zA-Z_$][\w$]*\(/.exec(tail);assert(at>=0&&next,name);return src.slice(at,at+3+next.index);}
const Save={data:{},save(){this.saves++;}},ctx={Save,STAGE_EPILOGUE:{0:{why:'Follow the pipes.'},4:{why:'The garden waits.'}}};vm.createContext(ctx);
const Scene=vm.runInContext('class Scene{'+['rubyClearStory','rubyEnterStage','starTeach'].map(method).join('\n')+'}Scene',ctx);
function scene(data={},idx=0){Save.data=data;Save.saves=0;const s=new Scene();Object.assign(s,{stageIndex:idx,state:'epilogue',menuScreen:'hub',physics:{pause(){}},player:{setVelocity(){}},over:{setVisible(){}},menu:{setVisible(){}},rubyTalk(lines,done,opt){this.talk={done,opt};},showStageSummary(last){this.summary=last;this.state='summary';},buildMenuScreen(){this.rebuilt=true;},rubyGuide(lines,done,opt){this.guide={lines,done,opt};}});return s;}
for(const idx of [0,4]){const s=scene({},idx);assert(s.rubyClearStory(false));assert.equal(s.state,'menu');assert.equal(Save.saves,0);assert.equal(Save.data.rubyMemories,undefined);assert(s.talk.opt.bridge.endsWith(ctx.STAGE_EPILOGUE[idx].why));assert(s.talk.opt.bridge.includes(idx===0?'ants':'crown seed'));s.talk.done();assert.equal(s.state,'summary');assert.equal(s.summary,false);assert.equal(Save.data.rubyMemories[idx],1);assert.equal(s.rubyClearStory(false),false);}
for(const data of [{settings:{noRuby:true}},{rubyMemories:{0:1}}]){const s=scene(data);assert.equal(s.rubyClearStory(false),false);assert.equal(s.talk,undefined);}
for(const flag of ['recipeMode','riftMode','bossRush','_inTutorial']){const s=scene();s[flag]=true;assert.equal(s.rubyClearStory(false),false);}
assert.equal(scene({},2).rubyClearStory(false),false);
{const s=scene({stageStars:{0:1},gearTut:-1});s.state='menu';s.starTeach();assert.equal(s.guide.opt.target,'chapter');assert.equal(Save.data.starTaught,undefined);s.guide.done();assert.equal(Save.data.starTaught,true);assert.equal(Save.saves,1);assert(s.rebuilt);}
{const s=scene({stageStars:{0:1},settings:{noRuby:true}});s.state='menu';s.starTeach();assert.equal(s.guide,undefined);}
for(const motion of [false,true]){const s=scene(),c={active:true,destroy(){this.active=false;}};let calls=0,fade=0,animation;s._rubyEntry=c;s.hubMotionAllowed=()=>motion;s.tweens={add(o){animation=o;}};s.cameras={main:{fadeIn(){fade++;}}};s.rubyEnterStage(()=>calls++);if(motion){assert.equal(calls,0);animation.onComplete();animation.onComplete();}assert.equal(calls,1);assert.equal(fade,motion?1:0);assert(!c.active);}
{const s=scene(),c={active:true};let calls=0,animation;s._rubyEntry=c;s.hubMotionAllowed=()=>true;s.tweens={add(o){animation=o;}};s.rubyEnterStage(()=>calls++);c.active=false;animation.onComplete();assert.equal(calls,0,'cancelled entry cannot start a stale stage');}
assert(!method('applyGearTut').includes('rubyTalk('),'teaching should not open a storybook');
assert(!method('applyGearTut').includes('rubyMemories'),'Hub rebuilds cannot replay old clear memories');
assert(!method('startChapterTutorial').includes('rubyStageStory'),'training cannot consume the first real story');
assert(method('_coachNext').includes('if(step.introOnly&&'),'exercise instructions stay on the live spotlight');
console.log('Ruby flow: training/story separation, clear-boundary bridge, no Hub backlog, contextual stars, deferred save, entry/reduced-motion/cancel guards passed');
