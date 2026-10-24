const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),kit='assets/incoming/story_motion/',idx=JSON.parse(fs.readFileSync(kit+'ASSET_INDEX.json','utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const ctx={window:{},navigator:{deviceMemory:8},localStorage:{getItem(){return null;}},STAGE_DECOR:{}};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.r={ASSET_IMAGES,ASSET_FX,artClass,MENU_ONLY_RE,bootKeep};',ctx);
vm.runInContext(src.slice(src.indexOf('const RUBY_STORYBOOK='),src.indexOf('\n',src.indexOf('const MC_HERO_SCENE=')))+';this.m={MOTION_COMICS,MC_HERO_SCENE,MC_STAGE_STORY,MC_AFTER_STAGE};',ctx);
const {ASSET_IMAGES,ASSET_FX,artClass,MENU_ONLY_RE,bootKeep}=ctx.r,{MOTION_COMICS,MC_HERO_SCENE,MC_STAGE_STORY,MC_AFTER_STAGE}=ctx.m;
// 1. ต้นฉบับตรง MANIFEST + ไฟล์ WebP ที่แพ็กแล้วลงทะเบียนเป็น menu-lazy (ไม่ใช่ boot / ไม่โหลดในด่าน)
let n=0;for(const f of idx.folders)for(const e of JSON.parse(fs.readFileSync(kit+f.manifest,'utf8')).assets){ n++;
  const b=fs.readFileSync(kit+f.folder+'/'+e.file);assert.equal(b.length,e.bytes,e.key);assert.equal(hash(b),e.sha256,e.key);
  const url='assets/art/story/'+e.key+'.webp',w=fs.readFileSync(url);assert.equal(w.subarray(0,4).toString(),'RIFF');assert.equal(w.subarray(8,12).toString(),'WEBP');
  const reg=(e.frames||1)>1?ASSET_FX[e.key]:ASSET_IMAGES[e.key];assert(reg,'not registered '+e.key);assert.equal(reg.url||reg,url);
  if((e.frames||1)>1){assert.equal(reg.frames,e.frames);assert.equal(reg.fw,e.frame_width/2);assert.equal(reg.fh,e.frame_height/2);assert.equal(!!reg.add,e.blend==='ADD',e.key);}
  assert.equal(bootKeep(e.key),false);assert.equal(artClass(e.key,url),'menu',e.key);assert(MENU_ONLY_RE.test(url),'never loaded with stage art '+e.key);
  assert(src.includes(`'${url}'`),'URL must be a literal for build-www '+e.key); }
assert.equal(n,103);
// 2. ทุกฉากอ้างแต่ key ที่มีจริง · Sesame (s10) ไม่ผูก · hook map ตรงลำดับเรื่อง
const known=k=>ASSET_IMAGES[k]||ASSET_FX[k];for(const [id,sc] of Object.entries(MOTION_COMICS)){ assert(sc.title&&sc.shots.length>=2,id);
  for(const sh of sc.shots){ assert(typeof sh.cap==='string'&&sh.cap.length>8&&!/[฀-๿]/.test(sh.cap),id+' caption'); (sh.bg||[]).forEach(k=>assert(ASSET_IMAGES[k],id+' bg '+k)); (sh.L||[]).forEach(l=>{ assert(known(l[0]),id+' layer '+l[0]); assert(l.length>=5&&l.slice(1,5).every(Number.isFinite),id+' layer geometry '+l[0]); }); } }
assert.equal(MOTION_COMICS.s10,undefined);assert.deepEqual(Object.keys(MOTION_COMICS).length,17);
const J=JSON.stringify;assert.equal(J(MC_STAGE_STORY.flat()),J(['s00','s01','s02','s03','s04','s05']));assert.equal(J(MC_HERO_SCENE),J({mint:'s06',cocoa:'s07',taro:'s08',yuzu:'s09'}));assert.equal(J(MC_AFTER_STAGE),J({4:'s11',9:'s13',14:'s16'}));
// 3. hook อยู่ครบทุกจุด และของเดิมยังเป็น fallback
for(const s of ["this.mcGateList?.(['s00','s01'],()=>this.startChapterTutorial())","this.mcGateList(mcs,ok=>ok?fin():talk())","this.mcGate?.(MC_HERO_SCENE[hi.id],()=>this.startStoryStage(idx))","this.mcGate('s12',","this.mcGate('s14',()=>begin())","MC_AFTER_STAGE[this.stageIndex]","this.mcGate?.('s15',()=>this.spawnFinalBoss())","this.mcGate?.('s17',()=>this.buildMenuScreen())","this._finishStoryCutscene(p)","this.playStoryPanel('chapter2_cover'"])assert(src.includes(s),'missing hook '+s);
// 4. gate / chain / โหลดไม่ได้ = คืน false (ใช้หน้าเดิม) · ดูจบ = บันทึก · ลบ texture cs_ หลังเล่น
const a=src.indexOf('  mcScene(id){'),b=src.indexOf('  mcShot(mc,i){');assert(a>0&&b>a);
const g={Save:{data:{settings:{}},save(){g.saved++;}},Sfx:{},MOTION_COMICS,saved:0};vm.createContext(g);vm.runInContext('class T{'+src.slice(a,b)+'}; this.T=T;',g);
const mk=(real=true)=>{ const t=new g.T(),removed=[],tex=new Set(['cs_s02_far_drains','card_mint']); Object.assign(t,{W:360,H:780,state:'menu',add:{rectangle:()=>({setOrigin(){return this;}}),text:()=>({setOrigin(){return this;},setAlpha(){return this;}})},
  storyLayer:{removeAll(){},setVisible(v){t.vis=v;},add(){}},tweens:{add(){}},time:{delayedCall:()=>({remove(){}})},physics:{pause(){t.paused=1;},resume(){t.paused=0;}},anims:{exists:()=>false,remove(){}},
  textures:{exists:k=>tex.has(k),remove:k=>{removed.push(k);tex.delete(k);}},realTex:()=>real,ensureGroup:(p,cb)=>cb(),shots:[],mcShot(mc,i){ mc.i=i; mc.shotAt=0; t.shots.push(mc.id+i); },hubMotionAllowed:()=>true}); t.removed=removed; return t; };
let t=mk(),res=[];assert.equal(t.mcGate('nope',()=>{}),false);
assert.equal(t.mcGateList(['s02','s03'],ok=>res.push(ok)),true);assert.equal(t.state,'cinematic');assert.equal(t.shots.join(),'s020');
for(let i=0;i<20&&t._mc;i++)t._finishStoryCutscene({x:10,y:400});assert.equal(res.join(),'true');assert.equal(t.state,'menu');assert.equal(g.Save.data.mcSeen.s02,1);assert.equal(g.Save.data.mcSeen.s03,1);
assert(t.removed.includes('cs_s02_far_drains')&&!t.removed.includes('card_mint'),'only cs_ textures are dropped');assert.equal(t.mcGate('s02',()=>{}),false,'seen scenes do not replay');
t=mk(false);res=[];t.state='play';assert.equal(t.mcGate('s04',ok=>res.push(ok)),true);assert.equal(res.join(),'false');assert.equal(t.state,'play');assert.equal(t.paused,0);assert.equal(t.mcGate('s04',()=>{}),false,'failed load falls back');assert(!g.Save.data.mcSeen.s04);
t=mk();res=[];t.mcGate('s16',ok=>res.push(ok));t._mc.ready=true;t._finishStoryCutscene({x:t._mc.skip?.x??0,y:0});t._mc.skip={x:280,y:10,w:80,h:40};t._finishStoryCutscene({x:300,y:20});assert.equal(res.join(),'true','Skip finishes and saves');
g.Save.data.settings.noRuby=true;assert.equal(mk().mcGate('s05',()=>{}),false);g.Save.data.settings.noRuby=false;
t=mk();g.Save.data.mcSeen={};t.mcGate('s01',()=>{});while(t._mc)t._finishStoryCutscene({x:1,y:400});assert.equal(g.Save.data.storyIntroSeen,true);assert.equal(g.Save.data.rubyStorybook[0],3);
console.log('Story motion comic: 103 MANIFEST-verified pieces menu-lazy, 17 scenes reference only registered art, hooks with fallbacks, gate/chain/skip/fail/save/texture-drop passed');
