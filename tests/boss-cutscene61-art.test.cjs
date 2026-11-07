// v8.0.84 Order 61 boss defeat cutscenes: MANIFEST-verified sources, packed WebP, story-lazy keys, 3-shot scene with crown FX, legacy 2-shot fallback.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),kit='assets/incoming/boss_cutscene61/',man=JSON.parse(fs.readFileSync(kit+'MANIFEST.json','utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(man.assets.length,35);
const ctx={window:{},navigator:{deviceMemory:8},localStorage:{getItem(){return null;}},STAGE_DECOR:{}};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.r={ASSET_IMAGES,ASSET_FX,artClass,MENU_ONLY_RE,bootKeep};',ctx);
const {ASSET_IMAGES,ASSET_FX,artClass,bootKeep}=ctx.r;
for(const a of man.assets){const b=fs.readFileSync(kit+a.file);assert.equal(b.length,a.bytes,a.key);assert.equal(hash(b),a.sha256,a.key);
  const url='assets/art/story/boss61/'+a.key+'.webp',w=fs.readFileSync(url);assert.equal(w.subarray(8,12).toString(),'WEBP',a.key);
  const reg=a.frames>1?ASSET_FX[a.key]:ASSET_IMAGES[a.key];assert.equal(reg&&(reg.url||reg),url,a.key+' registered');assert(src.includes("'"+url+"'"),'literal url '+a.key);
  assert.equal(bootKeep(a.key),false);assert.equal(artClass(a.key,url),'menu',a.key+' story-lazy, never boot');
  if(a.frames>1){assert.equal(reg.frames,a.frames);assert.equal(reg.fw,a.frame_w/2);assert.equal(reg.fh,a.frame_h/2);}}
// Scene data: 3 shots when art is registered, legacy 2 shots otherwise
const sc=vm.createContext({STAGES:Array.from({length:15},(_,i)=>({chapter:Math.floor(i/5),chapterStage:i%5+1,name:'Stage '+i})),MC_GALLERY:[]});
const ep=src.indexOf('const STAGE_EPILOGUE =');vm.runInContext(src.slice(src.indexOf('const BOSS_STORIES ='),src.indexOf('function bossStoryLayout('))+';\n'+src.slice(ep,src.indexOf('];',ep)+2),sc);
vm.runInContext(src.slice(src.indexOf('const BOSS_MOTION_BEATS='),src.indexOf('const STAGE_TAGLINES='))+';this.api={bossMotionScene,CS61_CROWN,BS:BOSS_STORIES,beats:BOSS_MOTION_BEATS};',sc);
for(let i=0;i<15;i++){const legacy=sc.api.bossMotionScene(i);assert.equal(legacy.shots.length,2,'no registry → v8.0.73 scene');}
sc.ASSET_IMAGES=ASSET_IMAGES;sc.ASSET_FX=ASSET_FX;
for(let i=0;i<15;i++){const s=sc.api.bossMotionScene(i),n=String(i+1).padStart(2,'0'),keys=s.shots.flatMap(sh=>[...(sh.bg||[]),...(sh.L||[]).map(l=>l[0])]);assert(s.v61);assert.equal(s.shots.length,4);
  assert.deepEqual([...s.shots.map(sh=>sh.bg[0])],['cs61_b'+n+'_fall','cs61_b'+n+'_fall','cs_boss_'+String(i).padStart(2,'0')+'_memory','cs61_ch'+(Math.floor(i/5)+1)+'_onward']);
  for(const k of keys)assert(ASSET_IMAGES[k]||ASSET_FX[k],k+' registered');assert(keys.includes('cs61_b'+n+'_freed'));
  const crown=s.shots[0].L.find(l=>l[0]==='vfx_cs61_crown_shatter');const m=man.assets.find(a=>a.key==='cs61_b'+n+'_fall');assert.deepEqual([...crown[5].bgPt],[+(m.crown[0]/1080).toFixed(3),+(m.crown[1]/1920).toFixed(3)]);
  const cat=JSON.parse(src.match(/const A07_CATALOG = (\{[^\n]+\});/)[1]);for(let j=0;j<2;j++){const key='vo_story_b'+n+'_memory_'+(j+1);assert.equal(s.shots[j].cap.includes(cat[key].text),true,key+' caption matches narration');}
  assert(s.shots[0].cap.includes(sc.api.BS[i].title));assert(s.shots[2].cap.includes(sc.api.BS[i].release));assert(i===14||/Next: /.test(s.shots[3].cap));
  assert.equal(sc.api.bossMotionScene(i,true).shots.length,2,'legacy kept');}
// Player hooks: bgPt placement, portrait fit on landscape, texture drop, load-failure retry with the legacy scene
assert(/o\.bgPt&&bg0\?\[bg0\.x\+\(o\.bgPt\[0\]-\.5\)\*bg0\.displayWidth/.test(src));assert(/sh\.fit==='portrait'&&W>H/.test(src));
assert(/\^\(cs_\|cs61_\|vfx_cs61_\)/.test(src),'cutscene textures dropped after playing');
assert(/if\(mc\.sc\.v61\)\{ const lg=bossMotionScene\(Number\(String\(id\)\.slice\(1\)\),true\);/.test(src),'missing order-61 art falls back to the 2-shot scene');
assert(/bossMotionScene\(Number\(m\[1\]\),!!\(this\._mc61Off&&this\._mc61Off\[id\]\)\)/.test(src));
console.log('Boss cutscenes 61: 35 MANIFEST-verified sources, packed WebP, story-lazy keys, 15 four-shot scenes with crown FX, legacy fallback and texture drop passed');
