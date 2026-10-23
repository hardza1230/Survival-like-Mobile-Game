// Illustrated pre-stage story routing; no combat simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
const crypto=require('node:crypto'),kit='assets/incoming/ruby_storybook/',manifest=JSON.parse(fs.readFileSync(kit+'MANIFEST.json','utf8'));
const assetsCtx={window:{},navigator:{deviceMemory:8},localStorage:{getItem(){return null;}},STAGE_DECOR:{}};vm.createContext(assetsCtx);
vm.runInContext(src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.assets={ASSET_IMAGES,RUBY_STORY_KEYS,artClass,stageCritical};',assetsCtx);
assert.equal(manifest.tool,'built-in ImageGen');assert.equal(manifest.assets.length,5);assert.equal(assetsCtx.assets.RUBY_STORY_KEYS.length,5);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function webpSize(b){assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.equal(b.readUInt32LE(4)+8,b.length);for(let at=12;at+8<=b.length;){const key=b.subarray(at,at+4).toString(),size=b.readUInt32LE(at+4),p=at+8;if(key==='VP8 ')return[b.readUInt16LE(p+6)&16383,b.readUInt16LE(p+8)&16383];if(key==='VP8X')return[1+b.readUIntLE(p+4,3),1+b.readUIntLE(p+7,3)];if(key==='VP8L'){const v=b.readUInt32LE(p+1);return[1+(v&16383),1+((v>>>14)&16383)];}at=p+size+(size%2);}throw Error('WebP dimensions unavailable');}
for(const a of manifest.assets){const source=fs.readFileSync(kit+a.source),runtime=fs.readFileSync(a.runtime);assert.equal(source.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(hash(source),a.source_sha256,'ImageGen source retained');assert.deepEqual([source.readUInt32BE(16),source.readUInt32BE(20)],[a.width*2,a.height*2]);assert.equal(runtime.length,a.bytes);assert.equal(hash(runtime),a.sha256);assert.deepEqual(webpSize(runtime),[a.width,a.height]);assert.equal(assetsCtx.assets.ASSET_IMAGES[a.key],a.runtime);assert(assetsCtx.assets.RUBY_STORY_KEYS.includes(a.key));assert.equal(assetsCtx.assets.artClass(a.key),'menu');assert.equal(assetsCtx.assets.stageCritical(a.key,a.runtime,'momo',false),false);}
function method(name){const at=src.indexOf('\n  '+name+'(');assert(at>=0);const tail=src.slice(at+3),next=/\n  [a-zA-Z_$][\w$]*\(/.exec(tail);assert(next);return src.slice(at,at+3+next.index);}
const a=src.indexOf('const RUBY_STORYBOOK='),b=src.indexOf('const WAVE_OBJECTIVES',a),Save={data:{},save(){this.saves=(this.saves||0)+1;}};
const ctx={Save,HERO_INTROS:[{idx:2,id:'mint',flag:'mintIntro'}]};vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.entries=RUBY_STORYBOOK;',ctx);
const C=vm.runInContext('class C{'+['rubyStageStory','startChapterTutorial','startStoryStage'].map(method).join('\n')+'}C',ctx);
function scene(data={}){Save.data=data;Save.saves=0;const c=new C();Object.assign(c,{state:'menu',talks:[],runs:[],rubyTalk(lines,done,opt){this._rubyTalk={};this.talks.push({lines,opt,finish:()=>{this._rubyTalk=null;done();}});},startRun(idx){this.runs.push(idx);},loadTutArt(){this.loadedTut=true;},showMintWarning(hi){this.warning=hi;}});return c;}
const art=['ruby_story_pantry','ruby_memory_jar','ruby_story_furnace','ruby_story_frozen','ruby_story_crown'];
assert.equal(ctx.entries.length,5);
for(let i=0;i<5;i++){
  const c=scene();let resumed=0;assert(c.rubyStageStory(i,()=>resumed++));
  const t=c.talks[0];assert.equal(t.opt.storybook,true);assert.equal(t.opt.title,ctx.entries[i].title);assert.equal(t.opt.pages.length,2);assert.equal(t.lines.length,2);
  for(let p=0;p<2;p++){assert.equal(t.opt.pages[p].art,i===1&&p===0?'ruby_memory_grandma':art[i]);assert.equal(t.lines[p],t.opt.pages[p].text);assert(t.lines[p].length>20);assert(t.opt.pages[p].mood);}
  assert.equal(Save.data.rubyStorybook,undefined,'opening a story must not mark it read');assert.equal(Save.data.rubyStory,undefined);assert.equal(resumed,0);
  assert(c.rubyStageStory(i,()=>resumed++));assert.equal(c.talks.length,1,'repeated entry while modal is open is deduplicated');
  t.finish();assert.equal(Save.data.rubyStorybook[i],1);assert.equal(Save.data.rubyStory[i],1);assert.equal(Save.saves,1);assert.equal(resumed,1);
  assert.equal(!!Save.data.storyIntroSeen,i===0,'only the opening story replaces the old falling-panel intro');
  assert.equal(c.rubyStageStory(i,()=>resumed++),false);assert.equal(c.talks.length,1);
}
for(const data of [{settings:{noRuby:true}},{rubyStorybook:{0:1}}]){const c=scene(data);assert.equal(c.rubyStageStory(0),false);assert.equal(c.talks.length,0);assert.equal(Save.saves,0);}
for(const idx of [-1,5,14,99]){const c=scene();assert.equal(c.rubyStageStory(idx),false);assert.equal(c.talks.length,0);}
{const c=scene();c.state='play';assert.equal(c.rubyStageStory(0),false);assert.equal(c.talks.length,0);}
{const c=scene();c.startChapterTutorial();assert.equal(c.runs.length,0);assert.equal(c.loadedTut,undefined);c.talks[0].finish();assert.deepEqual(c.runs,[0]);assert(c._forceCoachTutorial);assert(c.loadedTut);assert.equal(c.stageDiff,1);}
{const c=scene({settings:{noRuby:true}});c.startChapterTutorial();assert.deepEqual(c.runs,[0]);assert.equal(c.talks.length,0);}
{const c=scene();c.startStoryStage(1);assert.equal(c.runs.length,0);c.talks[0].finish();assert.deepEqual(c.runs,[1]);assert.equal(c._dailyRun,false);assert.equal(c._challengeChoice,null);assert.equal(c.stageDiff,1);}
{const c=scene({character:'momo',chars:['mint']});c.startStoryStage(2);assert(c.warning,'optional hero warning still precedes the story');assert.equal(c.talks.length,0);assert.equal(c.runs.length,0);c.startStoryStage(2);assert.equal(c.talks.length,1);c.talks[0].finish();assert.deepEqual(c.runs,[2]);}
{const c=scene();c.startStoryStage(5);assert.deepEqual(c.runs,[5]);assert.equal(c.talks.length,0);}
console.log('Ruby storybook: five two-page stories, deferred completion, once/deduplication, noRuby, tutorial and optional-hero routing passed');
