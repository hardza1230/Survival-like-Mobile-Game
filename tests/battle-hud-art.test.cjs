const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),kit='assets/incoming/battle_hud_top/',man=JSON.parse(fs.readFileSync(kit+'MANIFEST.json','utf8'));
const ctx={window:{},navigator:{deviceMemory:8},localStorage:{getItem(){return null;}},STAGE_DECOR:{}};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.r={ASSET_IMAGES,TEMPLE_UI,HUD_KEYS,STAGE_SHEETS,artClass,bootKeep};',ctx);
const {ASSET_IMAGES,TEMPLE_UI,HUD_KEYS,STAGE_SHEETS,artClass,bootKeep}=ctx.r;
// 1. ต้นฉบับตรง MANIFEST · WebP 50% · ลงทะเบียนแบบ stage-lazy (ไม่โหลดตอนบูต) · cell/nineSlice ครึ่งหนึ่งของต้นฉบับ
assert.equal(man.length,18);assert.equal(JSON.stringify(HUD_KEYS),JSON.stringify(man.map(e=>e.key)));
for(const e of man){ const b=fs.readFileSync(kit+e.file);assert.equal(b.length,e.bytes,e.key);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),e.sha256,e.key);
  const url='assets/art/hud/'+e.key+'.webp',w=fs.readFileSync(url);assert.equal(w.subarray(8,12).toString(),'WEBP');assert.equal(ASSET_IMAGES[e.key],url);assert(src.includes(`'${url}'`),'literal URL '+e.key);
  assert.equal(bootKeep(e.key),false);assert.equal(artClass(e.key,url),'stage',e.key);assert(STAGE_SHEETS.every(s=>s.includes(e.key)),'every stage loads '+e.key);
  assert.equal(JSON.stringify(TEMPLE_UI[e.key]),JSON.stringify([e.frame_width/2,e.frame_height/2,e.frames,e.nineSlice?e.nineSlice.map(v=>Math.floor(v/2)):null]),e.key); }
// 2. hook ครบ · โค้ดวาดเดิมยังเป็น fallback
for(const s of ['const art=this.hudArtSync?.();','if(this.xpIcon?.visible)this.xpIcon.setVisible(false);','g.fillStyle(0x1a1424,.62).fillRoundedRect(10,52,w-20,bottom-52,10);','const w=this.W,art=!!this._hudArt;','this.hudPipsArt?.(pips);','if(hit)this._hudPress=','this.hudBtnArtSync?.(); Sfx.select();'])assert(src.includes(s),'missing hook '+s);
// 3. ไม่มีไฟล์ = ไม่สร้างอะไร คืน false · ถูกลบกลางทาง = คืนข้อความ/ความทึบของเดิม
const a=src.indexOf('  hudArtOn(){'),b=src.indexOf('  hudVisible(v){');assert(a>0&&b>a);
const g={HUD_KEYS,Sfx:{muted:false},Phaser:{Math:{Clamp:(v,l,h)=>Math.max(l,Math.min(h,v))}}};vm.createContext(g);vm.runInContext('class T{'+src.slice(a,b)+'}; this.T=T;',g);
const o=()=>({alpha:.5,setAlpha(v){this.alpha=v;return this;}}),txt=t=>({text:t,x:0,setText(v){this.text=v;return this;},setX(v){this.x=v;return this;},setColor(c){this.color=c;return this;}});
const t=new g.T();let made=0;Object.assign(t,{W:360,hudArtC:{add(){made++;}},hudBtnC:{removeAll(){},add(){made++;}},time:{now:5000},realTex:()=>false,stageKills:7,sugarRun:40,
  waveObjBg:o(),waveObjBar:o(),bossBgW:o(),bossBar:o(),speedBtn:o(),pauseBtn:o(),muteBtn:o(),pauseTxt:o(),muteTxt:o(),killTxt:txt('KOs 7'),runSugarTxt:txt('🍬 40'),lvlTxt:txt('Lv 3')});
assert.equal(t.hudArtSync(),false);assert.equal(made,0,'no art objects without textures');assert.equal(t.killTxt.text,'KOs 7');
t._hudArt=true;t._hudBtns={};t.killTxt.text='7';t.runSugarTxt.text='40';t.waveObjBg.alpha=0;t._hudArtChk=0;t.hudArtSync();
assert.equal(t._hudArt,false);assert.equal(t.killTxt.text,'KOs 7');assert.equal(t.runSugarTxt.text,'🍬 40');assert.equal(t.waveObjBg.alpha,1);assert.equal(t._hudBtns,null);
assert(!src.includes("'hud_exp_frame',0,")&&!src.includes("tuPanel('hud_mission_card'"),'v8.0.11: no top EXP bar, plain mission backing');
console.log('Battle HUD art: 18 MANIFEST-verified pieces stage-lazy, halved cells/slices, hooks with code fallback, evict restore passed');
