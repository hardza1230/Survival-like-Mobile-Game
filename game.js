/* ============================================================
   MOCHI MAYHEM — Prototype (Phaser 3)  v3
   - Floating joystick (left) + basic Dash button (right)
   - Active Skill button (player-triggered, cooldown)
   - Auto coatings (Sprinkle / Sugar Ring / Chili)
   - Pickups + level-up (manual tap hit-test)
   - No Toast meter (kept basic). One-thumb, mobile-first.
   ============================================================ */

const WORLD = 4000;
const COLORS = {
  bg1: 0x3b3357, mochi: 0xfff2f7, mochiEdge: 0xff9ec4, candy: 0xffd166,
  pink: 0xff85b3, grape: 0xa98cf0, toast: 0xf0b35a, mint: 0x66d3b3, ice: 0xa9dcff,
  grid: 0x4f456e,
};

/* ============================================================
   Sfx — เสียงน่ารักสังเคราะห์ด้วย Web Audio (ไม่ต้องมีไฟล์เสียง)
   โทนกลม/นุ่ม (sine/triangle) + สเกลเมเจอร์ = ฟังสดใสน่ารัก
   ============================================================ */
const Sfx = {
  ctx:null, master:null, muted:false, _noise:null, _last:{},
  ensure(){
    if(this.ctx) return this.ctx;
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return null;
    this.ctx=new AC();
    this.master=this.ctx.createGain(); this.master.gain.value=0.35; this.master.connect(this.ctx.destination);
    const len=Math.floor(this.ctx.sampleRate*0.4), buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1; this._noise=buf;
    return this.ctx;
  },
  unlock(){ this.ensure(); if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); this.startBgm(); },
  toggle(){ this.muted=!this.muted; if(this.master)this.master.gain.value=this.muted?0:0.35; return this.muted; },
  // throttle เสียงที่ยิงถี่ (เช่น เก็บ xp / ยิงกระสุน) ไม่ให้รก
  _ok(key,gap){ const t=(this.ctx?this.ctx.currentTime:0); if((this._last[key]||-9)+gap>t)return false; this._last[key]=t; return true; },
  tone(freq,dur,type='sine',vol=0.3,slideTo=0,delay=0){
    if(!this.ctx||this.muted)return;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t0);
    if(slideTo>0)o.frequency.exponentialRampToValueAtTime(slideTo,t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+Math.min(0.02,dur*0.3));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0+dur+0.03);
  },
  noise(dur,vol=0.3,delay=0,hp=false){
    if(!this.ctx||this.muted||!this._noise)return;
    const t0=this.ctx.currentTime+delay, s=this.ctx.createBufferSource(), g=this.ctx.createGain();
    s.buffer=this._noise; g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    let node=s;
    if(hp){ const f=this.ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=900; s.connect(f); node=f; }
    node.connect(g); g.connect(this.master); s.start(t0); s.stop(t0+dur+0.02);
  },
  seq(notes,type='triangle',vol=0.26,step=0.1){ notes.forEach((f,i)=>this.tone(f,step*1.7,type,vol,0,i*step)); },
  // --- เสียงเอฟเฟกต์น่ารัก ---
  shoot(){ if(this._ok('shoot',0.05)) this.tone(880,0.05,'triangle',0.07,1500); },
  pop(){ if(this._ok('pop',0.03)) this.tone(560,0.09,'square',0.13,200); },
  xp(){ if(this._ok('xp',0.05)) this.tone(700,0.06,'sine',0.11,1040); },
  hurt(){ this.tone(320,0.18,'sawtooth',0.2,90); },
  dash(){ this.noise(0.16,0.12,0,true); this.tone(620,0.14,'sine',0.09,1150); },
  ult(){ this.seq([660,880,1180],'triangle',0.2,0.06); },
  zap(){ if(this._ok('zap',0.05)){ this.noise(0.07,0.13,0,true); this.tone(1550,0.09,'square',0.1,420); } },
  boom(){ if(this._ok('boom',0.08)){ this.noise(0.2,0.16); this.tone(170,0.22,'sine',0.16,60); } },
  frost(){ if(this._ok('frost',0.1)) this.seq([1200,1500,1900],'sine',0.12,0.05); },
  levelup(){ this.seq([523,659,784,1047],'triangle',0.24,0.1); },
  select(){ this.tone(920,0.08,'square',0.17,1360); },
  bossWarn(){ this.tone(120,0.5,'sawtooth',0.22,70); this.tone(90,0.6,'square',0.13,0,0.1); },
  clear(){ this.seq([659,784,1047,1319],'triangle',0.24,0.12); },
  victory(){ this.seq([523,659,784,1047,1319,1568],'triangle',0.28,0.14); },
  dead(){ this.seq([440,349,262,196],'sawtooth',0.2,0.14); },
  heal(){ if(this._ok('heal',0.1)) this.seq([784,988,1319],'sine',0.16,0.06); },
  // ===== เพลงพื้นหลัง (BGM สังเคราะห์เอง วนลูป) =====
  _bgmGain:null, _bgmTimer:null, _bgmStep:0, _bgmIntense:false,
  _bgmNote(freq,dur,type,vol,delay){ if(!this.ctx||!this._bgmGain)return;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+0.04); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this._bgmGain); o.start(t0); o.stop(t0+dur+0.03); },
  startBgm(){ this.ensure(); if(!this.ctx||this._bgmTimer)return;
    if(!this._bgmGain){ this._bgmGain=this.ctx.createGain(); this._bgmGain.gain.value=0.5; this._bgmGain.connect(this.master); }
    this._bgmStep=0; this._bgmLoop(); },
  stopBgm(){ if(this._bgmTimer){ clearTimeout(this._bgmTimer); this._bgmTimer=null; } },
  bgmIntense(on){ this._bgmIntense=!!on; },
  _bgmLoop(){
    const roots=[130.81,110.00,174.61,196.00];   // C · Am · F · G (โปรเกรสชันสดใส)
    const root=roots[this._bgmStep%roots.length];
    const bar=this._bgmIntense?1.35:1.9, beat=bar/4, base=root*2;
    this._bgmNote(root,beat*3.6,'sine',0.5,0);                  // เบสนุ่ม
    const arp=[base,base*1.25,base*1.5,base*2];                 // อาร์เพจโจเมเจอร์
    arp.forEach((f,i)=>this._bgmNote(f,beat*0.9,'triangle',this._bgmIntense?0.24:0.2,i*beat));
    if(this._bgmStep%2===0) this._bgmNote(base*2,beat*0.6,'sine',0.12,beat*2);   // ประกายบน
    this._bgmStep++;
    this._bgmTimer=setTimeout(()=>this._bgmLoop(), bar*1000);
  },
};

/* ============================================================
   Boot — วาดกราฟิกน่ารักด้วย Canvas 2D (self-contained ไม่โหลดไฟล์นอก)
   ตัวละคร/ศัตรูมีเฉดสี เงานุ่ม แก้มชมพู ตาวาว หน้าตาต่างกัน
   ============================================================ */
/* ---- รูปจริง (AI/วาดมือ) ที่โหลดแทนกราฟิกโค้ด · เพิ่มไฟล์ = เติม key ที่นี่ ----
   key ต้องตรงกับ texture ที่เกมใช้ (char_momo/char_mint/char_cocoa/e_basic/...) · ไฟล์อยู่โฟลเดอร์ assets/
   · ASSET_IMAGES = รูปนิ่งเฟรมเดียว · ASSET_SHEETS = สไปรต์สตริปหลายเฟรม (frame=ขนาดเฟรม px)
     เฟรมเรียง [0 idle, 1 squash(ย่อกว้าง), 2 stretch(ยืดสูง), 3 blink(หลับตา)] */
const ASSET_IMAGES = {
  e_basic:   'assets/e_basic.png',
  e_fast:    'assets/e_fast.png',
  e_tank:    'assets/e_tank.png',
  e_shooter: 'assets/e_shooter.png',
  e_bomber:  'assets/e_bomber.png',
  candy:     'assets/candy.png',       // ออร์บ EXP (ย้อมสีตามค่าได้ เพราะรูปขาว)
  boss1:'assets/boss1.png', boss2:'assets/boss2.png', boss3:'assets/boss3.png',
  boss4:'assets/boss4.png', boss5:'assets/boss5.png',   // บอสใหญ่ 5 ด่าน
};
const ASSET_SHEETS = {
  char_momo:  { url:'assets/char_momo_sheet.png',  frame:128 },
  char_mint:  { url:'assets/char_mint_sheet.png',  frame:128 },
  char_cocoa: { url:'assets/char_cocoa_sheet.png', frame:128 },
};
let ASSET_VER = '';   // build-www ใส่เลข build → append ?v= กันรูปค้าง cache (แก้รูปแล้วโหลดใหม่เสมอ)
function verUrl(u){ return ASSET_VER ? (u+'?v='+ASSET_VER) : u; }
// เฟรมของสไปรต์ตัวละคร (ต้องเรียงตามไฟล์สตริป)
// [0 idle,1 blink,2 squash,3 stretch(พุ่ง),4 cheer(ดีใจ),5 hurt(เจ็บ),6 ko(สลบ),7 cast(ร่ายอัลติ)]
const CF = { idle:0, blink:1, squash:2, stretch:3, cheer:4, hurt:5, ko:6, cast:7 };
function isArtKey(k){ return ASSET_IMAGES[k]||ASSET_SHEETS[k]; }

class Boot extends Phaser.Scene {
  constructor(){ super('Boot'); }
  preload(){
    for(const k in ASSET_IMAGES) this.load.image(k, verUrl(ASSET_IMAGES[k]));
    for(const k in ASSET_SHEETS) this.load.spritesheet(k, verUrl(ASSET_SHEETS[k].url), { frameWidth:ASSET_SHEETS[k].frame, frameHeight:ASSET_SHEETS[k].frame });
    // ถ้ารูปโหลดไม่ได้ (เช่นเปิดแบบไฟล์เดียว) ให้ข้ามไป ใช้กราฟิกโค้ดแทน (ไม่ให้ค้าง)
    this.load.on('loaderror',(f)=>{ delete ASSET_IMAGES[f.key]; delete ASSET_SHEETS[f.key]; });
  }
  create(){
    const mk=(key,size,draw)=>{ if(isArtKey(key)&&this.textures.exists(key))return;  // มีรูปจริงแล้ว ไม่ต้องวาดทับ
      if(this.textures.exists(key))this.textures.remove(key);
      const t=this.textures.createCanvas(key,size,size); if(!t)return; draw(t.getContext(),size); t.refresh(); };
    const rr=(c,x,y,w,h,r)=>{ c.beginPath();
      if(c.roundRect){ c.roundRect(x,y,w,h,r); }
      else { c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); } };
    const TAU=Math.PI*2;

    // ---- ตัวละครน่ารัก (บอดี้กลม เงา แก้ม ตาวาว + ท็อปปิ้ง) ----
    const drawChar=(c,s,o)=>{ const cx=s/2, cy=s*0.54, R=s*0.40;
      c.clearRect(0,0,s,s);
      c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.92,R*0.72,R*0.2,0,0,TAU); c.fill();
      const g=c.createRadialGradient(cx-R*0.4,cy-R*0.5,R*0.15,cx,cy,R*1.25);
      g.addColorStop(0,o.c1); g.addColorStop(1,o.c2);
      c.fillStyle=g; rr(c,cx-R,cy-R,2*R,2*R*0.92,R*0.72); c.fill();
      c.lineWidth=s*0.028; c.strokeStyle=o.edge; c.stroke();
      c.fillStyle='rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(cx-R*0.32,cy-R*0.48,R*0.36,R*0.2,-0.4,0,TAU); c.fill();
      c.fillStyle=o.cheek; c.beginPath(); c.arc(cx-R*0.52,cy+R*0.2,R*0.15,0,TAU); c.arc(cx+R*0.52,cy+R*0.2,R*0.15,0,TAU); c.fill();
      c.fillStyle='#3b2b3a'; c.beginPath(); c.ellipse(cx-R*0.34,cy-R*0.02,R*0.12,R*0.17,0,0,TAU); c.ellipse(cx+R*0.34,cy-R*0.02,R*0.12,R*0.17,0,0,TAU); c.fill();
      c.fillStyle='#fff'; c.beginPath(); c.arc(cx-R*0.29,cy-R*0.1,R*0.05,0,TAU); c.arc(cx+R*0.39,cy-R*0.1,R*0.05,0,TAU); c.fill();
      c.strokeStyle='#3b2b3a'; c.lineWidth=s*0.022; c.lineCap='round'; c.beginPath(); c.arc(cx,cy+R*0.1,R*0.14,0.16*Math.PI,0.84*Math.PI); c.stroke();
      if(o.top)o.top(c,cx,cy-R,R,s);
    };
    const strawberry=(c,cx,ty,R,s)=>{ c.fillStyle='#5ec26a'; c.beginPath(); c.ellipse(cx,ty-R*0.02,R*0.16,R*0.08,0,0,TAU); c.fill();
      c.fillStyle='#ff5a6e'; c.beginPath(); c.moveTo(cx-R*0.16,ty); c.quadraticCurveTo(cx,ty+R*0.02,cx+R*0.16,ty); c.quadraticCurveTo(cx,ty+R*0.34,cx-R*0.16,ty); c.fill();
      c.fillStyle='#ffe08a'; c.beginPath(); c.arc(cx,ty+R*0.12,R*0.02,0,TAU); c.arc(cx-R*0.06,ty+R*0.06,R*0.02,0,TAU); c.arc(cx+R*0.06,ty+R*0.06,R*0.02,0,TAU); c.fill(); };
    const mintleaf=(c,cx,ty,R,s)=>{ c.fillStyle='#4fbf85'; c.beginPath(); c.ellipse(cx-R*0.08,ty,R*0.15,R*0.08,-0.5,0,TAU); c.ellipse(cx+R*0.08,ty,R*0.15,R*0.08,0.5,0,TAU); c.fill(); };
    const cocoaswirl=(c,cx,ty,R,s)=>{ c.strokeStyle='#4a2c1a'; c.lineWidth=s*0.05; c.lineCap='round'; c.beginPath(); c.arc(cx,ty+R*0.06,R*0.13,-0.3,Math.PI*1.5); c.stroke(); };

    mk('char_momo',60,(c,s)=>drawChar(c,s,{c1:'#fff2f7',c2:'#ffcfe2',edge:'#ff9ec4',cheek:'rgba(255,140,185,0.55)',top:strawberry}));
    mk('char_mint',60,(c,s)=>drawChar(c,s,{c1:'#eafff5',c2:'#b6f0d6',edge:'#57c99a',cheek:'rgba(110,215,165,0.5)',top:mintleaf}));
    mk('char_cocoa',60,(c,s)=>drawChar(c,s,{c1:'#e6c39c',c2:'#a9744a',edge:'#6b4632',cheek:'rgba(255,170,140,0.5)',top:cocoaswirl}));
    mk('mochi',60,(c,s)=>drawChar(c,s,{c1:'#fff2f7',c2:'#ffcfe2',edge:'#ff9ec4',cheek:'rgba(255,140,185,0.55)',top:strawberry}));

    // ---- ศัตรู "สายเปรี้ยว" หน้าโกรธ ----
    const drawEnemy=(c,s,o)=>{ const cx=s/2, cy=s*0.54, R=s*0.40;
      c.clearRect(0,0,s,s);
      c.fillStyle='rgba(20,10,25,0.22)'; c.beginPath(); c.ellipse(cx,s*0.92,R*0.68,R*0.18,0,0,TAU); c.fill();
      const g=c.createRadialGradient(cx-R*0.4,cy-R*0.5,R*0.15,cx,cy,R*1.25);
      g.addColorStop(0,o.c1); g.addColorStop(1,o.c2);
      c.fillStyle=g; rr(c,cx-R,cy-R,2*R,2*R*0.92,o.spiky?R*0.34:R*0.62); c.fill();
      c.lineWidth=s*0.03; c.strokeStyle=o.edge; c.stroke();
      c.fillStyle='#fff'; c.beginPath(); c.arc(cx-R*0.32,cy,R*0.17,0,TAU); c.arc(cx+R*0.32,cy,R*0.17,0,TAU); c.fill();
      c.fillStyle='#2b2233'; c.beginPath(); c.arc(cx-R*0.28,cy+R*0.04,R*0.08,0,TAU); c.arc(cx+R*0.36,cy+R*0.04,R*0.08,0,TAU); c.fill();
      c.strokeStyle='#2b2233'; c.lineCap='round'; c.lineWidth=s*0.055;
      c.beginPath(); c.moveTo(cx-R*0.52,cy-R*0.34); c.lineTo(cx-R*0.14,cy-R*0.12); c.stroke();
      c.beginPath(); c.moveTo(cx+R*0.52,cy-R*0.34); c.lineTo(cx+R*0.14,cy-R*0.12); c.stroke();
      c.lineWidth=s*0.03; c.beginPath(); c.arc(cx,cy+R*0.6,R*0.15,1.15*Math.PI,1.85*Math.PI); c.stroke();
    };
    mk('e_basic',44,(c,s)=>drawEnemy(c,s,{c1:'#b6ec9e',c2:'#6cbf6a',edge:'#4f9a55'}));
    mk('e_fast',38,(c,s)=>drawEnemy(c,s,{c1:'#bfe2ff',c2:'#6fb3f0',edge:'#4f8fd6'}));
    mk('e_tank',62,(c,s)=>drawEnemy(c,s,{c1:'#e0c8ff',c2:'#a97fe0',edge:'#7a4fd0',spiky:true}));
    // e_brute = ตัวถึกโปรซีเจอรัล (ย้อมสีได้) ใช้กับ elite/มินิ/บอส — แยกจากรูปจริง e_tank กันสีเพี้ยนตอน setTint
    mk('e_brute',62,(c,s)=>drawEnemy(c,s,{c1:'#e6d8ff',c2:'#b79ae8',edge:'#7a4fd0',spiky:true}));

    // ---- ลูกกวาด (glossy) / กระสุน / อนุภาค / vignette ----
    mk('candy',20,(c,s)=>{ const cx=s/2,r=s*0.42; const g=c.createRadialGradient(cx-2,cx-2,1,cx,cx,r);
      g.addColorStop(0,'#fff3b0'); g.addColorStop(1,'#f0a92e'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,r,0,TAU); c.fill();
      c.strokeStyle='#c9832a'; c.lineWidth=1.3; c.stroke();
      c.fillStyle='rgba(255,255,255,0.85)'; c.beginPath(); c.arc(cx-r*0.35,cx-r*0.35,r*0.22,0,TAU); c.fill(); });
    mk('spark',16,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'#ffffff'); g.addColorStop(0.55,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('dot',12,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'#ffffff'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('vignette',256,(c,s)=>{ const g=c.createRadialGradient(s/2,s/2,s*0.28,s/2,s/2,s*0.62);
      g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(8,4,12,0.5)'); c.fillStyle=g; c.fillRect(0,0,s,s); });
    // ไอเทมฟื้นฟู = หัวใจโมจิ
    mk('heal',24,(c,s)=>{ const cx=s/2,cy=s*0.46,r=s*0.3; c.fillStyle='rgba(20,10,25,0.15)'; c.beginPath(); c.ellipse(cx,s*0.9,r*0.7,r*0.18,0,0,TAU); c.fill();
      c.fillStyle='#ff6a97'; c.beginPath(); c.moveTo(cx,cy+r*0.9); c.bezierCurveTo(cx-r*1.4,cy-r*0.2,cx-r*0.5,cy-r*1.1,cx,cy-r*0.25); c.bezierCurveTo(cx+r*0.5,cy-r*1.1,cx+r*1.4,cy-r*0.2,cx,cy+r*0.9); c.fill();
      c.strokeStyle='#e0447a'; c.lineWidth=s*0.05; c.stroke();
      c.fillStyle='rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(cx-r*0.4,cy-r*0.3,r*0.22,r*0.14,-0.5,0,TAU); c.fill(); });
    // กล่อง/โหลทุบได้ (ธีมครัว) — โหลแยมกลม ๆ
    mk('crate',44,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.9,s*0.32,s*0.09,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.2,0,s*0.9); g.addColorStop(0,'#ffd59e'); g.addColorStop(1,'#e59a4d');
      c.fillStyle=g; rr(c,s*0.18,s*0.28,s*0.64,s*0.6,s*0.14); c.fill(); c.lineWidth=s*0.045; c.strokeStyle='#b9702e'; c.stroke();
      c.fillStyle='#c8e6a0'; rr(c,s*0.24,s*0.14,s*0.52,s*0.18,s*0.08); c.fill(); c.strokeStyle='#8fb85f'; c.lineWidth=s*0.04; c.stroke();
      c.fillStyle='rgba(255,255,255,0.4)'; rr(c,s*0.26,s*0.36,s*0.14,s*0.4,s*0.06); c.fill(); });

    this.scene.start('Game');
  }
}

/* ---- SKILLS: auto-cast, flashy, stackable ---- */
const SKILLDEFS = {
  sprinkle:{ name:'Sprinkle Spray', emoji:'🍬', max:6, desc:'ยิงลูกกวาดใส่ศัตรูใกล้สุด',
    awaken:{ name:'พายุสายรุ้ง', emoji:'🌈', desc:'ยิง 8 เม็ดไล่เป้าอัตโนมัติ ทะลุ+เด้ง ร่ายถี่ยิบ!' } },
  star:    { name:'Star Guard',     emoji:'🌟', max:6, desc:'ดาวหมุนรอบตัวคุ้มกัน', orbit:true,
    awaken:{ name:'วงกาแล็กซี', emoji:'💫', desc:'ดาว 3 วง หมุนไว ดาเมจมหาศาล!' } },
  chili:   { name:'Chili Nova',     emoji:'🌶️', max:6, desc:'ระเบิดเผ็ดรอบตัวเป็นวง',
    awaken:{ name:'ภูเขาไฟ', emoji:'🌋', desc:'ระเบิด 5 ชั้น วงกว้างมหึมา สะเทือนจอ!' } },
  thunder: { name:'Thunder Drop',   emoji:'⚡', max:6, desc:'ฟ้าผ่าสุ่มลงศัตรูรอบตัว',
    awaken:{ name:'พายุนิรันดร์', emoji:'🌩️', desc:'ฟ้าผ่า 8 จุด แตกลูกลามทั้งสนาม!' } },
  whirl:   { name:'Cream Whirl',    emoji:'🍥', max:6, desc:'ครีมหมุนกระจายรอบทิศ',
    awaken:{ name:'ทอร์นาโดครีม', emoji:'🌪️', desc:'16 ทิศ ใบพัดยักษ์ ทะลุทุกตัว!' } },
  boomer:  { name:'Boomerang Cookie',emoji:'🍪', max:6, desc:'คุกกี้พุ่งออกแล้วบินกลับ ทะลุศัตรู',
    awaken:{ name:'เฮอริเคนคุกกี้', emoji:'🍪', desc:'6 ชิ้นยักษ์ เด้ง 2 รอบ ฟันถี่!' } },
  frost:   { name:'Frost Pulse',    emoji:'❄️', max:6, desc:'คลื่นเย็นแช่แข็งศัตรูใกล้ตัว',
    awaken:{ name:'ศูนย์สัมบูรณ์', emoji:'🧊', desc:'แช่ทั้งจอ + ระเบิดน้ำแข็งดาเมจสูง!' } },
  popcorn: { name:'Popcorn Pop',    emoji:'🍿', max:6, desc:'ป๊อปคอร์นแตกกระจายรอบตัวมั่ว ๆ',
    awaken:{ name:'ป๊อปคอร์นถล่มโลก', emoji:'🍿', desc:'20 เม็ดถล่มจอ ทะลุ ยิงไกล!' } },
  bubble:  { name:'Bubble Homing',  emoji:'🫧', max:6, desc:'ฟองสบู่วิ่งไล่ศัตรูอัตโนมัติ',
    awaken:{ name:'ฝูงฟองล่า', emoji:'🫧', desc:'8 ฟองไล่แม่นยำ ทะลุศัตรู!' } },
  aura:    { name:'Sweet Aura',     emoji:'🌸', max:6, desc:'ออร่าหวานทำดาเมจศัตรูรอบตัวตลอดเวลา',
    awaken:{ name:'พายุกลีบหวาน', emoji:'🌸', desc:'ออร่ากว้างมาก ดาเมจสูง ดูดศัตรูเข้า!' } },
  fork:    { name:'Fork Fling',     emoji:'🍴', max:6, desc:'ขว้างส้อมทะลุศัตรูเป็นแนว',
    awaken:{ name:'พายุส้อม', emoji:'🍴', desc:'ส้อม 10 เล่มพุ่งทุกทิศ ทะลุหมด!' } },
  mine:    { name:'Cupcake Mine',   emoji:'🧁', max:6, desc:'วางคัพเค้กระเบิดดักศัตรู',
    awaken:{ name:'ทุ่นหวานถล่ม', emoji:'🧁', desc:'วาง 4 ลูก ระเบิดใหญ่มาก!' } },
  beam:    { name:'Caramel Beam',   emoji:'🔆', max:6, desc:'ยิงลำแสงคาราเมลทะลุเป็นแนวตรง',
    awaken:{ name:'ลำแสงมรณะ', emoji:'🔆', desc:'3 ลำกว้าง เผาทะลุทั้งแนว!' } },
  meteor:  { name:'Donut Drop',     emoji:'🍩', max:6, desc:'โดนัทหล่นจากฟ้าระเบิดใส่ศัตรู',
    awaken:{ name:'ฝนโดนัท', emoji:'🍩', desc:'10 ลูกถล่มทั้งจอ!' } },
  cloud:   { name:'Mocha Mist',     emoji:'☕', max:6, desc:'ปล่อยไอมอคค่าพิษ ดาเมจต่อเนื่อง',
    awaken:{ name:'หมอกมรณะ', emoji:'☕', desc:'กลุ่มใหญ่ ดาเมจสูง อยู่นาน!' } },
  rocket:  { name:'Candy Rocket',   emoji:'🚀', max:6, desc:'ยิงจรวดลูกอมไล่เป้า ระเบิด AoE',
    awaken:{ name:'ฝูงจรวด', emoji:'🚀', desc:'6 ลูกไล่เป้า ระเบิดใหญ่!' } },
  wave:    { name:'Cream Wave',     emoji:'🌊', max:6, desc:'ปล่อยคลื่นครีมขยายผลักศัตรู',
    awaken:{ name:'สึนามิครีม', emoji:'🌊', desc:'คลื่นยักษ์ 3 ระลอก!' } },
};
const SKILL_AWAKEN_LV = 7;   // เลเวลตื่นรู้ (Awaken) — หลังจาก max (6)
const SKILL_CAP  = 6;        // ล็อกสกิลโจมตี ≤ 6 อย่าง/รอบ (แบบ Vampire Survivors)
const PASSIVE_CAP = 6;       // ล็อกสกิลติดตัว ≤ 6 อย่าง/รอบ
/* ---- PASSIVES: สกิลติดตัวแบบเลเวลได้ (คนละหมวดกับสกิลโจมตี) · apply(p)=ผล 1 rank ---- */
const PASSIVES = {
  heart: { name:'หัวใจหวาน',  emoji:'❤️', color:0xff5f7a, max:5, desc:'HP สูงสุด +22 + ฟื้นทันที',
    apply(p){ p.maxhp+=22; p.hp=Math.min(p.maxhp,p.hp+22); } },
  power: { name:'พลังหวาน',   emoji:'💥', color:COLORS.grape, max:5, desc:'ดาเมจทุกอย่าง +11%',
    apply(p){ p.dmgMul*=1.11; } },
  swift: { name:'เท้าลื่น',   emoji:'👟', color:COLORS.mint, max:5, desc:'ความเร็ว +9%',
    apply(p){ p.baseSpeed*=1.09; } },
  magnet:{ name:'จมูกไว',     emoji:'🧲', color:COLORS.toast, max:5, desc:'ระยะดูดลูกกวาด +30%',
    apply(p){ p.pickup*=1.3; } },
  haste: { name:'มือไว',      emoji:'⏩', color:0x8fd0ff, max:5, desc:'ร่ายสกิลถี่ขึ้น 8%',
    apply(p){ p.cdMul=(p.cdMul||1)*0.92; } },
  crit:  { name:'ตาแม่น',     emoji:'🎯', color:0xffd166, max:5, desc:'โอกาสคริติคอล +6% (×1.8)',
    apply(p){ p.critChance=(p.critChance||0)+0.06; } },
  guard: { name:'เกราะนุ่ม',  emoji:'🛡️', color:0xa0e0c0, max:5, desc:'ลดดาเมจที่รับ 8%',
    apply(p){ p.dmgTakenMul=(p.dmgTakenMul||1)*0.92; } },
  regen: { name:'ฟื้นฟู',     emoji:'💗', color:0xff9ec4, max:5, desc:'ฟื้น HP +1.2/วินาที',
    apply(p){ p.regen=(p.regen||0)+1.2; } },
};
const ACTIVES = {
  bomb:     { name:'Sugar Bomb',   emoji:'💣', desc:'ระเบิดพลังรอบตัว + ผลักศัตรู' },
  nova:     { name:'Sprinkle Nova',emoji:'✨', desc:'ยิงลูกกวาดกระจายรอบทิศ' },
  freeze:   { name:'Brain Freeze', emoji:'❄️', desc:'แช่แข็งศัตรูทั้งวง' },
  blackhole:{ name:'Cocoa Vortex', emoji:'🕳️', desc:'หลุมดำดูดศัตรูมารวมกันแล้วระเบิด' },
};

/* ---- CHARACTERS: แต่ละตัวมีอัลติเฉพาะตัว + โบนัสพาสซีฟ (ปลดด้วย Sugar) ---- */
const CHARACTERS = {
  momo: { name:'โมโม่', emoji:'🍡', active:'bomb',   cost:0,   color:0xff9ec4,
          desc:'สตรอว์เบอร์รีสมดุล — อัลติ 💣 ระเบิดน้ำตาล', bonus:{} },
  mint: { name:'มินต์', emoji:'🌿', active:'freeze', cost:150, color:0x8fd0ff,
          desc:'สายเย็นอึด (+HP 30) — อัลติ ❄️ แช่แข็งทั้งวง', bonus:{maxhp:30} },
  cocoa:{ name:'โกโก้', emoji:'🍫', active:'blackhole', cost:400, color:0x8b5cf0,
          desc:'สายรุก (+ดาเมจ 10%) — อัลติ 🕳️ หลุมดำ', bonus:{dmgMul:1.1} },
};
const CHAR_ORDER=['momo','mint','cocoa'];

/* ---- TALENTS: ผังพรสวรรค์ (แยกแต้มต่อตัวละคร) · ลง 1 แต้ม/rank · ผลใส่ตอน applyMeta ---- */
/* ---- CHAR_TALENTS: "พรสวรรค์เฉพาะตัว" — แต่ละตัวละครมีสายคนละแบบ (จุดเด่นต่างกันชัด) ----
   momo=สมดุล/บอมเบอร์ · mint=แทงค์เกราะน้ำแข็ง · cocoa=กระจกจอมพลัง (glass cannon)
   โหนดปิดท้าย (signature) = ธงยกระดับอัลติของตัวนั้นโดยเฉพาะ */
const CHAR_TALENTS = {
  momo: [   // สายสมดุล — เก่งรอบด้าน + คริติคอล
    { id:'hp',      emoji:'❤️', name:'พลังชีวิต',  max:5, per:'HP สูงสุด +8%',   apply:(p,r)=>{ p.maxhp*=(1+0.08*r); } },
    { id:'dmg',     emoji:'💥', name:'พลังโจมตี',  max:5, per:'ดาเมจ +6%',       apply:(p,r)=>{ p.dmgMul*=(1+0.06*r); } },
    { id:'crit',    emoji:'🎯', name:'จุดตาย',     max:4, per:'โอกาสคริติคอล +5% (ตีแรง ×1.8)', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'cdr',     emoji:'⏱️', name:'ร่ายไว',     max:4, per:'คูลดาวน์สกิล -5%', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'regen',   emoji:'💗', name:'ฟื้นตัว',    max:3, per:'ฟื้น HP +0.5/วิ',  apply:(p,r)=>{ p.regen+=0.5*r; } },
    { id:'twinBomb',emoji:'🧨', name:'ระเบิดคู่',  max:1, per:'✦ signature: อัลติระเบิด 2 ระลอกซ้อน!', apply:(p,r)=>{ p.twinBomb=true; } },
  ],
  mint: [   // สายแทงค์ — อึดโหด ดูดเลือด ฟื้นตัว
    { id:'hp',       emoji:'❤️', name:'ร่างอึด',    max:6, per:'HP สูงสุด +12%',  apply:(p,r)=>{ p.maxhp*=(1+0.12*r); } },
    { id:'armor',    emoji:'🛡️', name:'เกราะน้ำแข็ง', max:5, per:'ลดดาเมจที่รับ -6%', apply:(p,r)=>{ p.dmgTakenMul*=(1-0.06*r); } },
    { id:'regen',    emoji:'💗', name:'ฟื้นฟูเย็น',  max:4, per:'ฟื้น HP +0.7/วิ',  apply:(p,r)=>{ p.regen+=0.7*r; } },
    { id:'lifesteal',emoji:'🍓', name:'ดูดหวาน',    max:3, per:'ฆ่าศัตรูฟื้น +0.7 HP', apply:(p,r)=>{ p.lifesteal+=0.7*r; } },
    { id:'magnet',   emoji:'🧲', name:'จมูกไว',     max:3, per:'ระยะดูด +15%',     apply:(p,r)=>{ p.pickup*=(1+0.15*r); } },
    { id:'deepFreeze',emoji:'❄️', name:'เยือกลึก',   max:1, per:'✦ signature: อัลติแช่กว้าง+นานขึ้นมาก!', apply:(p,r)=>{ p.deepFreeze=true; } },
  ],
  cocoa: [   // สายจอมพลัง — ดาเมจ/คริติคอลจัดเต็ม เปราะ
    { id:'dmg',     emoji:'💥', name:'พลังทำลาย',  max:6, per:'ดาเมจ +10%',      apply:(p,r)=>{ p.dmgMul*=(1+0.10*r); } },
    { id:'crit',    emoji:'🎯', name:'สังหาร',     max:5, per:'โอกาสคริติคอล +6% (ตีแรง ×1.8)', apply:(p,r)=>{ p.critChance+=0.06*r; } },
    { id:'ult',     emoji:'✨', name:'อัลติทรงพลัง', max:4, per:'อัลติแรง +18% · คูล -8%', apply:(p,r)=>{ p.ultPow*=(1+0.18*r); p.ultCdMul*=(1-0.08*r); } },
    { id:'spd',     emoji:'👟', name:'ฝีเท้า',     max:3, per:'ความเร็ว +5%',    apply:(p,r)=>{ p.baseSpeed*=(1+0.05*r); } },
    { id:'lifesteal',emoji:'🩸', name:'กระหาย',    max:3, per:'ฆ่าศัตรูฟื้น +0.6 HP', apply:(p,r)=>{ p.lifesteal+=0.6*r; } },
    { id:'bigVoid', emoji:'🕳️', name:'หลุมนิรันดร์', max:1, per:'✦ signature: หลุมดำใหญ่ ดูดแรง ระเบิดกว้าง!', apply:(p,r)=>{ p.bigVoid=true; } },
  ],
};
function charTalents(c){ return CHAR_TALENTS[c]||CHAR_TALENTS.momo; }
// EXP ที่ต้องใช้เพื่อขึ้นจากเลเวล l → l+1
function charExpNeed(l){ return 40 + l*35; }

/* ---- SKILL_TIERS: อธิบายว่า "แต่ละเลเวล" ปลดเอฟเฟกต์อะไร (โชว์บนการ์ด) ---- */
const SKILL_TIERS = {
  sprinkle:{ 2:'ยิงทีละ 2 เม็ด', 3:'ลูกใหญ่ขึ้น + ทะลุศัตรู', 4:'ยิงทีละ 3 เม็ด กระจายกว้าง', 5:'ลูกกวาดเด้งไปเป้าถัดไป', 6:'ยิง 5 เม็ด ทะลุทุกตัว สายรุ้ง!' },
  star:    { 2:'+1 ดวง คุ้มกันแน่นขึ้น', 3:'วงกว้าง + หมุนเร็วขึ้น', 4:'+1 ดวง ดวงใหญ่ขึ้น', 5:'ดาวกระจายประกายเมื่อชน', 6:'วงดาวคู่ ชั้นในชั้นนอก!' },
  chili:   { 2:'วงระเบิดใหญ่ขึ้น', 3:'ระเบิด 2 ชั้น', 4:'ผลักศัตรูกระเด็น', 5:'รัศมีกว้างมาก', 6:'ระเบิด 3 ชั้น สะเทือนจอ!' },
  thunder: { 2:'ฟ้าผ่า 2 จุดพร้อมกัน', 3:'ไฟฟ้าแตกลูกไปตัวข้าง ๆ', 4:'ฟ้าผ่า 3 จุด', 5:'แตกลูกต่อ 2 ตัว', 6:'ฟ้าผ่า 4 จุด แตกลูกทุกจุด!' },
  whirl:   { 2:'ใบพัดครีม 8 ทิศ', 3:'ใบพัดใหญ่ บินไกลขึ้น', 4:'ใบพัด 10 ทิศ', 5:'ใบพัดใหญ่มาก', 6:'12 ทิศ ทะลุศัตรู!' },
  boomer:  { 2:'ขว้าง 2 ชิ้น', 3:'ใหญ่ขึ้น + ฟันถี่ขึ้น', 4:'ขว้าง 3 ชิ้น', 5:'บินกลับแล้วเด้งออกอีกรอบ', 6:'ขว้าง 4 ชิ้น พายุคุกกี้!' },
  frost:   { 2:'รัศมีกว้างขึ้น', 3:'แช่นานขึ้น + มีดาเมจ', 4:'รัศมีใหญ่มาก', 5:'ระเบิดน้ำแข็งใส่ตัวที่แช่อยู่', 6:'แช่หนัก + ดาเมจสูง!' },
  popcorn: { 2:'+2 เม็ด', 3:'เม็ดใหญ่ขึ้น', 4:'ทะลุศัตรู + เม็ดเยอะ', 5:'ยิงไกลขึ้น', 6:'ป๊อปคอร์นถล่มจอ!' },
  bubble:  { 2:'+1 ฟอง', 3:'ฟองใหญ่ขึ้น', 4:'+1 ฟอง ไล่แม่นขึ้น', 5:'ฟองทะลุศัตรู', 6:'ฝูงฟอง 5 ลูก!' },
  aura:    { 2:'ออร่ากว้างขึ้น', 3:'ดาเมจขึ้น', 4:'กว้างมาก', 5:'ดาเมจแรง', 6:'ออร่าหวานเต็มพิกัด!' },
  fork:    { 2:'ขว้าง 3 เล่ม', 3:'เล่มใหญ่ เร็วขึ้น', 4:'ขว้าง 4 เล่ม', 5:'ทะลุถี่ขึ้น', 6:'ขว้าง 5 เล่ม พายุส้อม!' },
  mine:    { 2:'ระเบิดกว้างขึ้น', 3:'ดาเมจขึ้น', 4:'วาง 2 ลูก', 5:'ระเบิดใหญ่มาก', 6:'วางถี่ ดาเมจสูง!' },
  beam:    { 2:'ลำแสงยาวขึ้น', 3:'กว้าง+ดาเมจขึ้น', 4:'เผาแรงขึ้น', 5:'ทะลุไกลมาก', 6:'ลำแสงมหากาฬ!' },
  meteor:  { 2:'3 ลูก', 3:'ระเบิดกว้างขึ้น', 4:'4 ลูก ดาเมจสูง', 5:'ลูกใหญ่มาก', 6:'6 ลูกถล่ม!' },
  cloud:   { 2:'กลุ่มกว้างขึ้น', 3:'ดาเมจ/ติ๊กสูงขึ้น', 4:'กว้างมาก', 5:'อยู่นานขึ้น', 6:'หมอกพิษเต็มพิกัด!' },
  rocket:  { 2:'2 ลูก', 3:'ระเบิดกว้างขึ้น', 4:'3 ลูก ไล่แม่น', 5:'ระเบิดใหญ่', 6:'4 ลูก จรวดถล่ม!' },
  wave:    { 2:'คลื่นกว้างขึ้น', 3:'ดาเมจ+ผลักแรง', 4:'ไกลมาก', 5:'คลื่นใหญ่', 6:'สึนามิครีม!' },
};

/* ---- COMBOS: มีสกิลคู่ที่เข้าคู่กัน = ปลดโบนัส (ใช้ธง this.comboFlags ตอน cast) ---- */
const COMBOS = [
  { key:'storm',     a:'thunder',  b:'frost',   emoji:'❄️⚡', name:'พายุน้ำแข็ง',   desc:'ฟ้าผ่าแรงขึ้น 40% · แช่นานขึ้น' },
  { key:'firestorm', a:'chili',    b:'whirl',   emoji:'🌶️🍥', name:'พายุเพลิง',     desc:'ครีมหมุนติดไฟแรงขึ้น · วงพริกกว้างขึ้น' },
  { key:'ricochet',  a:'sprinkle', b:'boomer',  emoji:'🍬🍪', name:'ลูกกวาดพเนจร', desc:'ลูกกวาดเด้งเพิ่ม · คุกกี้ทะลุถี่ขึ้น' },
  { key:'fizz',      a:'popcorn',  b:'bubble',  emoji:'🍿🫧', name:'โซดาแตกฟอง',   desc:'ป๊อปคอร์น+ฟองใหญ่ขึ้นทั้งคู่ · ดาเมจ +25%' },
];

/* ---- UPGRADES: อัพเกรดตัวละครถาวร (ซื้อด้วย Sugar, เก็บใน Save.upgrades[key]=lvl) ---- */
const UPGRADES = {
  hp:     { emoji:'❤️', name:'พลังชีวิต', unit:'HP สูงสุด +14/เลเวล', max:8, cost:l=>35+l*30,  apply:(p,l)=>{ p.maxhp+=14*l; } },
  dmg:    { emoji:'💥', name:'พลังโจมตี', unit:'ดาเมจ +4%/เลเวล',     max:8, cost:l=>45+l*35,  apply:(p,l)=>{ p.dmgMul*=(1+0.04*l); } },
  spd:    { emoji:'👟', name:'ความเร็ว',  unit:'เดินเร็ว +3%/เลเวล',   max:6, cost:l=>30+l*25,  apply:(p,l)=>{ p.baseSpeed*=(1+0.03*l); } },
  magnet: { emoji:'🧲', name:'แม่เหล็ก',  unit:'ระยะดูด +12%/เลเวล',   max:6, cost:l=>25+l*20,  apply:(p,l)=>{ p.pickup*=(1+0.12*l); } },
};
const UPG_ORDER=['hp','dmg','spd','magnet'];

/* ---- GEAR: ของสวมใส่ 2 ช่อง (weapon/charm) ซื้อด้วย Sugar แล้วสวมใส่ ---- */
// ของสวมใส่ · ตีบวกได้ (lv=ระดับตีบวก 0..enhMax) เพิ่มพลังต่อระดับ
const GEAR_ENH_MAX = 5;
function gearEnhCost(lv){ return 60+lv*55; }   // 🍬 ค่าตีบวก +1..+5 (60/115/170/225/280)
const GEAR = {
  weapon: [
    { id:'w_spoon', emoji:'🥄', name:'ช้อนไม้',      cost:0,   enh:true, desc:'ดาเมจ +5% (+2%/ตีบวก)',  apply:(p,lv)=>{ p.dmgMul*=(1+0.05+0.02*lv); } },
    { id:'w_chop',  emoji:'🥢', name:'ตะเกียบเหล็ก', cost:120, enh:true, desc:'ดาเมจ +12% (+3%/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.12+0.03*lv); } },
    { id:'w_knife', emoji:'🔪', name:'มีดเชฟ',       cost:300, enh:true, desc:'ดาเมจ +22% (+4%/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.22+0.04*lv); } },
  ],
  charm: [
    { id:'c_none',   emoji:'▫️', name:'ไม่สวม',       cost:0,   enh:false, desc:'-',            apply:(p,lv)=>{} },
    { id:'c_ribbon', emoji:'🎀', name:'โบว์นำโชค',   cost:100, enh:true, desc:'HP สูงสุด +30 (+10/ตีบวก)', apply:(p,lv)=>{ p.maxhp+=30+10*lv; } },
    { id:'c_clover', emoji:'🍀', name:'โคลเวอร์',    cost:150, enh:true, desc:'ระยะดูด +40% (+8%/ตีบวก)',  apply:(p,lv)=>{ p.pickup*=(1+0.4+0.08*lv); } },
    { id:'c_star',   emoji:'⭐', name:'ดาวประกาย',   cost:260, enh:true, desc:'ดาเมจ +8% · HP +15 (+2%·+8/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.08+0.02*lv); p.maxhp+=15+8*lv; } },
  ],
};

/* ---- Save: เก็บ Sugar + ความคืบหน้า + upgrades + gear ลง localStorage ---- */
const Save = {
  data:{ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], character:'momo', chars:[], charProg:{} },
  load(){ try{ const s=localStorage.getItem('mochi_save'); if(s)this.data=Object.assign(this.data,JSON.parse(s)); }catch(e){}
    if(!this.data.upgrades)this.data.upgrades={};
    if(!this.data.gear)this.data.gear={};
    if(!this.data.gearLv)this.data.gearLv={};
    if(!this.data.ownedGear)this.data.ownedGear=[];
    if(!this.data.gear.weapon)this.data.gear.weapon='w_spoon';
    if(!this.data.gear.charm)this.data.gear.charm='c_none';
    for(const id of ['w_spoon','c_none']) if(!this.data.ownedGear.includes(id))this.data.ownedGear.push(id);
    if(!this.data.chars||!this.data.chars.length)this.data.chars=['momo'];
    if(!this.data.character)this.data.character='momo';
    if(!this.data.charProg)this.data.charProg={};
    return this.data; },
  save(){ try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} },
  addSugar(n){ this.data.sugar=(this.data.sugar||0)+n; this.save(); },
  spend(n){ if((this.data.sugar||0)>=n){ this.data.sugar-=n; this.save(); return true; } return false; },
  // ความคืบหน้าตัวละคร (เลเวล/EXP/แต้มพรสวรรค์/ผังที่ลง)
  cp(id){ if(!this.data.charProg[id]) this.data.charProg[id]={ lvl:1, exp:0, tp:0, tal:{} }; return this.data.charProg[id]; },
  gearLv(id){ return (this.data.gearLv&&this.data.gearLv[id])||0; },
  enhance(id){ this.data.gearLv[id]=(this.gearLv(id))+1; this.save(); },
  reset(){ try{ localStorage.removeItem('mochi_save'); }catch(e){}
    this.data={ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], character:'momo', chars:[], charProg:{} };
    this.load(); },
};

/* ---- STAGES: 5 โซนครัว · แต่ละด่าน = เวฟ → มินิบอส (กลางด่าน) → บอสใหญ่ (จบด่าน) ---- */
const STAGES = [
  { name:'ตู้กับข้าว',   en:'The Pantry',  emoji:'🥫', grid:0x4a4360, tint:0x8bd3a0,
    lore:'ที่ซ่อนแรกของ Sour Horde — ฝูงมดและแมลงเปรี้ยวคลานออกจากมุมมืด',
    waves:5, miniAt:2, mini:'มดทหารยักษ์',
    boss:'ราชินีมดเปรี้ยว', bossHp:420, bossDmg:20 },
  { name:'อ่างล้างจาน',  en:'The Sink',    emoji:'🚰', grid:0x3c4d61, tint:0x8fc7ff,
    lore:'น้ำเน่านองเต็มอ่าง ฟองสบู่มีชีวิตพยายามจมโมโม่ให้เปียกโชก',
    waves:6, miniAt:3, mini:'ฟองสบู่เดือด',
    boss:'ปีศาจฟองน้ำ', bossHp:680, bossDmg:24 },
  { name:'เตาไฟ',        en:'The Stove',   emoji:'🔥', grid:0x60463c, tint:0xff8a5a,
    lore:'เปลวไฟลุกโชน กระทะและพริกร้อนระอุเข้าจู่โจมไม่ยั้ง',
    waves:6, miniAt:3, mini:'กระทะเดือดดาล',
    boss:'มิสเตอร์เตาปิ้ง', bossHp:1000, bossDmg:28 },
  { name:'ช่องแช่แข็ง',  en:'The Freezer', emoji:'❄️', grid:0x3d4a5c, tint:0x9fe0ff,
    lore:'ความหนาวเยือกแข็ง โกเลมไอศกรีมตื่นจากน้ำแข็งนิรันดร์',
    waves:7, miniAt:3, mini:'ก้อนน้ำแข็งยักษ์',
    boss:'โกเลมไอศกรีม', bossHp:1400, bossDmg:32 },
  { name:'เตาอบใหญ่',    en:'The Grand Oven', emoji:'👨‍🍳', grid:0x574055, tint:0xff5f97,
    lore:'ใจกลางคำสาป — เชฟขมรอโมโม่อยู่ ทำลายเขาเพื่อปลดปล่อยครัว!',
    waves:8, miniAt:4, mini:'ผู้ช่วยเชฟหุ่นเหล็ก',
    boss:'เชฟขม (The Bitter Chef)', bossHp:2400, bossDmg:38 },
];

/* ---- CHAPTERS: กรุ๊ปด่านเป็น "บท" · บทที่ 1 = 5 ด่านครัว (เล่นได้) · บท 2-5 = เร็ว ๆ นี้ ---- */
const CHAPTERS = [
  { name:'บทที่ 1 · ครัวต้องสาป', emoji:'🍳', desc:'5 ด่านครัว — ตู้กับข้าว → เตาอบใหญ่', ready:true },
  { name:'บทที่ 2 · ตู้เย็นนรก',   emoji:'🧊', desc:'ดินแดนเยือกแข็งของ Frost Horde', ready:false },
  { name:'บทที่ 3 · สวนขนมหวาน',  emoji:'🍰', desc:'ป่าลูกกวาดและปีศาจน้ำตาล', ready:false },
  { name:'บทที่ 4 · โรงงานขนม',    emoji:'🏭', desc:'สายพานเครื่องจักรและหุ่นเหล็ก', ready:false },
  { name:'บทที่ 5 · ปราสาทจอมหิว', emoji:'👑', desc:'บอสลับ The Great Hunger รออยู่', ready:false },
];

class Game extends Phaser.Scene {
  constructor(){ super('Game'); }

  create(){
    this.DPR=RENDER_DPR;                                   // ตัวคูณความละเอียดจอ
    this.viewZoom=0.82;                                    // <1 = ซูมออก มองกว้างขึ้น (เห็นโลกมากขึ้น ~22%)
    this.W=this.scale.width/this.DPR; this.H=this.scale.height/this.DPR;  // พิกัดใช้งาน = CSS px (เหมือนเดิม)
    this.state='menu'; this.elapsed=0; this.kills=0;
    this.level=1; this.xp=0; this.xpNext=4;
    Save.load(); this.comboFlags={}; this.combosOwned={}; this.sugarStage=0; this.sugarRun=0;

    this.cameras.main.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.gridBg=this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,1,COLORS.grid,0.35).setDepth(-100000);
    // faux-2.5D: เลเยอร์เงาใต้ตัว (วาดใหม่ทุกเฟรม) + จัดลำดับความลึกตามแกน Y
    this.iso=true;   // สวิตช์เปิด/ปิดโหมด 2.5D เบา ๆ
    this.shadowG=this.add.graphics().setDepth(-99000);
    // vignette ขอบจอมืดนุ่ม เพิ่มมิติ (ติดกล้อง)
    this.vig=this.add.image(this.W/2,this.H/2,'vignette').setScrollFactor(1).setDepth(40).setDisplaySize(this.W,this.H);

    // soft glow aura ใต้ตัวละคร (UX polish)
    this.aura=this.add.circle(0,0,32,COLORS.mochiEdge,0.14).setDepth(-90000);
    this.tweens.add({targets:this.aura,scale:{from:0.9,to:1.15},alpha:{from:0.14,to:0.05},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});

    this.player=this.physics.add.sprite(0,0,'mochi').setDepth(5);
    this.player.setCircle(24,6,6); this.player.setCollideWorldBounds(true);
    this.player.hp=100; this.player.maxhp=100; this.player.baseSpeed=210;
    this.player.iframe=0; this.player.pickup=80; this.player.dmgMul=1;
    this.cameras.main.startFollow(this.player,false,0.2,0.2);  // roundPixels=false → กล้องเลื่อนลื่น ไม่กระตุกเป็นขั้น
    this._sqX=1; this._sqY=1;   // เจลลี่โมจิ: สเกลกระแทก (squash&stretch) ค่อย ๆ คืนสู่ 1 ทุกเฟรม + วอกแวกเบา ๆ

    this.enemies=this.physics.add.group({maxSize:600});
    this.bullets=this.physics.add.group({maxSize:500});
    this.orbs   =this.physics.add.group({maxSize:800});
    this.foeBullets=this.physics.add.group({maxSize:300});   // กระสุนศัตรู/บอส
    this.heals =this.physics.add.group({maxSize:60});        // ไอเทมฟื้นฟู HP
    this.crates=this.physics.add.group({maxSize:40});        // กล่อง/โหลทุบได้ (ธีมครัว)

    this.ringBalls=[];
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.touchEnemy,null,this);
    this.physics.add.overlap(this.player,this.orbs,this.collectOrb,null,this);
    this.physics.add.overlap(this.player,this.foeBullets,this.hitByFoe,null,this);
    this.physics.add.overlap(this.player,this.heals,this.collectHeal,null,this);
    this.physics.add.overlap(this.bullets,this.crates,this.hitCrate,null,this);

    this.skills={ sprinkle:1 };            // auto-cast skills owned {key:level}  (≤ SKILL_CAP)
    this.passives={};                      // passive skills owned {key:level}   (≤ PASSIVE_CAP)
    this.skillCd={}; for(const k in SKILLDEFS) this.skillCd[k]=0;
    this.whirlAng=0;
    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';  // ตัวละครที่เลือก (จาก Save)
    this.active={ key:CHARACTERS[this.character].active, lvl:1 };  // อัลติของตัวละคร
    this.activeCd=0; this._activeMax=6;

    this.dashTime=0; this.dashReady=true; this.dashCd=0;
    this.moveDir=new Phaser.Math.Vector2(0,-1);

    this.input.addPointer(2);
    this.joy={active:false,id:-1,bx:0,by:0,dx:0,dy:0};
    this.lvlCards=[]; this.dmgPool=[]; this.tapZones=[]; this.menuScreen='hub';

    this.buildHUD(); this.buildMenus(); this.showMenu();
    this.setupCameras();
    this.setupInput();
    this.scale.on('resize',this.onResize,this);
  }

  /* กล้อง 2 ตัว: main=โลก (follow), ui=อินเทอร์เฟซ (คงที่) — ทั้งคู่ zoom=DPR ให้คมชัด
     พิกัดยังเป็น CSS px แต่ backing เป็นความละเอียดจริงของจอ */
  setupCameras(){
    const D=this.DPR, fw=this.scale.width, fh=this.scale.height;
    this.cameras.main.setZoom(D*this.viewZoom);   // ซูมออกตาม viewZoom → มองกว้างขึ้น (แต่ backing ยังคมชัดเต็มจอ)
    // ui camera: เต็มจอ, zoom D, เลื่อน scroll ให้พิกัด CSS (0..W) เต็มจอพอดี
    this.uiCam=this.cameras.add(0,0,fw,fh);
    this.uiCam.setZoom(D);
    this.uiCam.centerOn(this.W/2,this.H/2);   // จุดหมุน zoom = กึ่งกลาง UI (พิกัด CSS)
    // แยกสิ่งที่แต่ละกล้องเรนเดอร์
    this._worldObjs=[this.gridBg,this.shadowG,this.aura,this.player,this.enemies,this.orbs,this.bullets,this.foeBullets,this.heals,this.crates];
    this.uiCam.ignore(this._worldObjs);
    const ui=[this.vig,this.bannerT,this.bannerS,this.muteBtn,this.muteTxt,this.pauseBtn,this.pauseTxt,this.pauseUI,this.fpsTxt,this.menu,this.lvlUp,this.over,this.joyBase,this.joyKnob]
      .concat(this.hudList||[],this.bossUI||[]).filter(Boolean);
    this.cameras.main.ignore(ui);
    if(this.skillBar)this.camUI(this.skillBar);
  }
  camWorld(o){ if(this.uiCam)this.uiCam.ignore(o); return o; }   // FX ของโลก: ให้ ui กล้องข้าม
  camUI(o){ if(this.cameras&&this.cameras.main)this.cameras.main.ignore(o); return o; }  // UI: ให้กล้องโลกข้าม

  /* ---------- INPUT ---------- */
  setupInput(){
    this.input.on('pointerdown',(p)=>{
      Sfx.unlock();
      p={x:p.x/this.DPR,y:p.y/this.DPR,id:p.id};   // แปลงพิกัดจริง → CSS px
      // mute toggle (มุมขวาบน) — เช็คก่อนทุกอย่างเพื่อไม่ให้ไปโดนจอย
      if(this.muteBtn && this.dist(p.x,p.y,this.muteBtn.x,this.muteBtn.y)<26){
        const m=Sfx.toggle(); this.muteTxt.setText(m?'🔇':'🔊'); return; }
      // pause button (เฉพาะตอนเล่น/พัก)
      if(this.pauseBtn && this.pauseBtn.visible && (this.state==='play'||this.state==='paused') && this.dist(p.x,p.y,this.pauseBtn.x,this.pauseBtn.y)<26){
        this.togglePause(); return; }
      if(this.state==='paused'){ // แตะปุ่มในเมนูหยุด
        for(const z of (this._pauseBtns||[])){ if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){ Sfx.select(); z.fn(); return; } }
        return; }
      if(this.state==='menu'){ this.handleTap(p.x,p.y); return; }
      if(this.state==='dead'||this.state==='win'){ this.scene.restart(); return; }
      if(this.state==='summary'){ Sfx.select(); this.continueFromSummary(); return; }
      if(this.state==='levelup'){ this.pickCardAt(p.y); return; }
      if(this.state!=='play') return;
      // skill button (right, upper of the two)
      if(this.dist(p.x,p.y,this.skillBtn.x,this.skillBtn.y)<52){ this.useActive(); return; }
      // dash: any tap on right half
      if(p.x>this.W*0.5){ this.doDash(); return; }
      // left half → joystick
      this.joy.active=true; this.joy.id=p.id; this.joy.bx=p.x; this.joy.by=p.y; this.joy.dx=0; this.joy.dy=0;
      this.joyBase.setPosition(p.x,p.y).setVisible(true);
      this.joyKnob.setPosition(p.x,p.y).setVisible(true);
    });
    this.input.on('pointermove',(p)=>{
      if(!this.joy.active||p.id!==this.joy.id) return;
      p={x:p.x/this.DPR,y:p.y/this.DPR,id:p.id};
      let dx=p.x-this.joy.bx, dy=p.y-this.joy.by; const len=Math.hypot(dx,dy), max=60;
      if(len>max){ dx=dx/len*max; dy=dy/len*max; }
      this.joy.dx=dx/max; this.joy.dy=dy/max; this.joyKnob.setPosition(this.joy.bx+dx,this.joy.by+dy);
    });
    this.input.on('pointerup',(p)=>{
      if(p.id===this.joy.id){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0;
        this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
    });
  }
  dist(ax,ay,bx,by){ return Math.hypot(ax-bx,ay-by); }

  doDash(){
    if(!this.dashReady||this.state!=='play') return;
    this.dashReady=false; this.dashCd=1.1; this.dashTime=0.16;
    const d=this.moveDir.clone().normalize();
    this.dashTime=0.2;
    this.player.setVelocity(d.x*560,d.y*560);   // basic dash — a bit farther, still on-screen
    this.player.iframe=Math.max(this.player.iframe,0.28);
    Sfx.dash();
    this.player.setTint(0xfff6bd);
    this.time.delayedCall(160,()=>this.player.clearTint());
    this._sqX=1.35; this._sqY=0.7;   // ยืดตอนพุ่ง (เจลลี่)
  }

  /* ---------- ACTIVE SKILL ---------- */
  useActive(){
    if(this.activeCd>0||this.state!=='play') return;
    this.poseFlash(CF.cast,400);   // ร่ายอัลติ = หน้ามุ่งมั่นเปล่งพลัง
    const a=this.active, lvl=a.lvl, up=this.player.ultPow||1, uc=this.player.ultCdMul||1;
    if(a.key==='bomb'){
      const r=130+lvl*18, dmg=(16+lvl*7)*up;
      const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,14,COLORS.pink,0.4).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:340,onComplete:()=>ring.destroy()});
      this.cameras.main.shake(140,0.006);
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
        if(this.dist(e.x,e.y,this.player.x,this.player.y)<r){
          this.damage(e,dmg*this.player.dmgMul,e.x,e.y);
          const ang=Math.atan2(e.y-this.player.y,e.x-this.player.x);
          e.setVelocity(Math.cos(ang)*420,Math.sin(ang)*420); e.knock=0.28;
        }});
      // ระเบิดคู่ (พรสวรรค์ momo): ระลอกสองใหญ่กว่า หน่วงเล็กน้อย
      if(this.player.twinBomb){ this.time.delayedCall(230,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
        const r2=r*1.35, ring2=this.camWorld(this.add.circle(this.player.x,this.player.y,14,COLORS.candy,0.4).setDepth(3));
        this.tweens.add({targets:ring2,radius:r2,alpha:0,duration:340,onComplete:()=>ring2.destroy()});
        this.cameras.main.shake(160,0.007); Sfx.boom();
        this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
          if(this.dist(e.x,e.y,this.player.x,this.player.y)<r2){ this.damage(e,dmg*this.player.dmgMul*0.9,e.x,e.y);
            const ang=Math.atan2(e.y-this.player.y,e.x-this.player.x); e.setVelocity(Math.cos(ang)*460,Math.sin(ang)*460); e.knock=0.28; } }); }); }
      this.activeCd=6*uc; this._activeMax=this.activeCd;
    } else if(a.key==='nova'){
      const n=8+lvl*2, dmg=(5+lvl*2)*this.player.dmgMul*up;
      for(let i=0;i<n;i++){ const ang=(i/n)*Math.PI*2;
        let b=this.bullets.getFirstDead(false);
        if(!b) b=this.bullets.create(this.player.x,this.player.y,'spark');
        else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(this.player.x,this.player.y); }
        b.setScale(1.3).setTint(0xffe9a8); b.dmg=dmg; b.life=1.0; b.body.setAllowGravity(false); this.camWorld(b);
        this.physics.velocityFromRotation(ang,430,b.body.velocity);
      }
      this.activeCd=5*uc; this._activeMax=this.activeCd;
    } else if(a.key==='freeze'){
      const df=this.player.deepFreeze?1:0;   // เยือกลึก (พรสวรรค์ mint)
      const r=210+df*120, dur=(1.4+lvl*0.35)*up*(1+df*0.6);
      const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,14,COLORS.ice,0.4).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:300,onComplete:()=>ring.destroy()});
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
        if(this.dist(e.x,e.y,this.player.x,this.player.y)<r){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }});
      this.activeCd=7*uc; this._activeMax=this.activeCd;
    } else if(a.key==='blackhole'){
      const bv=this.player.bigVoid?1:0;   // หลุมนิรันดร์ (พรสวรรค์ cocoa)
      const cx=this.player.x, cy=this.player.y, R=280+bv*140, dmg=(20+lvl*8)*this.player.dmgMul*up*(1+bv*0.4);
      const vortex=this.camWorld(this.add.circle(cx,cy,18,0x8b5cf0,0.55).setDepth(3));
      this.tweens.add({targets:vortex,radius:150,alpha:0,duration:650,onComplete:()=>vortex.destroy()});
      // ดูดศัตรูเข้าหาจุดกึ่งกลาง
      this.enemies.children.iterate(e=>{ if(!e||!e.active||e.isBoss)return;
        if(this.dist(e.x,e.y,cx,cy)<R){ const ang=Math.atan2(cy-e.y,cx-e.x); e.setVelocity(Math.cos(ang)*(320+bv*160),Math.sin(ang)*(320+bv*160)); e.knock=0.55; }});
      // ระเบิดหลังดูด
      this.time.delayedCall(520,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
        this.cameras.main.shake(240,0.011);
        const ring=this.camWorld(this.add.circle(cx,cy,18,0xd0a8ff,0.5).setDepth(3));
        const er=210+bv*130;
        this.tweens.add({targets:ring,radius:er,alpha:0,duration:320,onComplete:()=>ring.destroy()});
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<er) this.damage(e,dmg,e.x,e.y); });
        Sfx.boom(); });
      this.activeCd=8*uc; this._activeMax=this.activeCd;
    }
    Sfx.ult();
    this.flashBtn(this.skillBtn);
  }
  flashBtn(b){ this.tweens.add({targets:b,scale:{from:1.25,to:1},duration:220,ease:'Back.out'}); }

  /* ---------- HUD ---------- */
  buildHUD(){
    const pad=14, w=this.W; this._pad=pad; this._barW=w-2*pad;
    this.joyBase=this.add.circle(0,0,62,0xffffff,0.10).setScrollFactor(1).setDepth(50).setVisible(false).setStrokeStyle(2,0xffffff,0.25);
    this.joyKnob=this.add.circle(0,0,26,0xffffff,0.22).setScrollFactor(1).setDepth(51).setVisible(false);

    // dash button (lower right)
    this.dashBtn=this.add.circle(w-70,this.H-90,44,COLORS.mint,0.18).setScrollFactor(1).setDepth(50).setStrokeStyle(2,COLORS.mint,0.7);
    this.dashTxt=this.add.text(w-70,this.H-90,'พุ่ง',{fontFamily:'sans-serif',fontSize:'16px',color:'#bff3e8'}).setOrigin(0.5).setScrollFactor(1).setDepth(51);
    // skill button (above dash)
    this.skillBtn=this.add.circle(w-70,this.H-196,46,COLORS.pink,0.20).setScrollFactor(1).setDepth(50).setStrokeStyle(2,COLORS.pink,0.8);
    this.skillEmoji=this.add.text(w-70,this.H-200,ACTIVES[this.active.key].emoji,{fontSize:'30px'}).setOrigin(0.5).setScrollFactor(1).setDepth(51);
    this.skillCdTxt=this.add.text(w-70,this.H-168,'',{fontFamily:'sans-serif',fontSize:'12px',color:'#ffd9e6'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);
    // cooldown ring รอบปุ่มอัลติ
    this.skillRing=this.add.graphics().setScrollFactor(1).setDepth(52);

    // top bars: HP + XP (โค้งมน วาดด้วย graphics)
    this.barG=this.add.graphics().setScrollFactor(1).setDepth(50);
    this.hpIcon=this.add.text(pad+4,pad+7,'❤️',{fontSize:'12px'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);
    this.xpIcon=this.add.text(pad+4,pad+24,'⭐',{fontSize:'10px'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);

    this.timeTxt=this.add.text(w/2,pad+30,'0:00',{fontFamily:'sans-serif',fontSize:'20px',color:'#ffffff'}).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    this.killTxt=this.add.text(w-pad,pad+32,'☠ 0',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(1,0).setScrollFactor(1).setDepth(51);
    this.lvlTxt=this.add.text(pad,pad+32,'Lv 1',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0,0).setScrollFactor(1).setDepth(51);
    this.stageTxt=this.add.text(w/2,pad+54,'',{fontFamily:'sans-serif',fontSize:'13px',color:'#ffd9a8'}).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    // wave progress pips (บอกว่าใกล้จบเวฟ/ถึงบอสหรือยัง)
    this.pipG=this.add.graphics().setScrollFactor(1).setDepth(51);

    // boss HP bar (hidden until boss)
    this.bossName=this.add.text(w/2,pad+74,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ff9ec4'}).setOrigin(0.5,0).setScrollFactor(1).setDepth(52);
    this.bossBgW=this.add.rectangle(w/2,pad+92,this._barW*0.8,12,0x000000,0.4).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    this.bossBar=this.add.rectangle(w/2-(this._barW*0.8)/2+2,pad+94,this._barW*0.8-4,8,0xff5f97,1).setOrigin(0,0).setScrollFactor(1).setDepth(52);

    // center banner
    this.bannerT=this.add.text(w/2,this.H*0.32,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'30px',color:'#ffffff',align:'center'}).setOrigin(0.5).setScrollFactor(1).setDepth(60).setVisible(false);
    this.bannerS=this.add.text(w/2,this.H*0.4,'',{fontFamily:'sans-serif',fontSize:'15px',color:'#e6dcf0',align:'center',wordWrap:{width:w*0.82}}).setOrigin(0.5).setScrollFactor(1).setDepth(60).setVisible(false);

    // mute button (มุมขวาบน) — แสดงตลอดเวลา
    this.muteBtn=this.add.circle(w-30,pad+64,18,0x000000,0.32).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.3);
    this.muteTxt=this.add.text(w-30,pad+64,Sfx.muted?'🔇':'🔊',{fontSize:'17px'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    // pause button (ซ้ายของ mute)
    this.pauseBtn=this.add.circle(w-72,pad+64,18,0x000000,0.32).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.3);
    this.pauseTxt=this.add.text(w-72,pad+64,'⏸',{fontSize:'15px'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    // ตัววัด FPS + ความละเอียด (ไว้ดีบั๊ก — เอาออกทีหลังได้)
    this.fpsTxt=this.add.text(w-30,pad+88,'',{fontFamily:'monospace',fontSize:'10px',color:'#8fd0ff'}).setOrigin(1,0).setScrollFactor(1).setDepth(59);
    this.time.addEvent({delay:400,loop:true,callback:()=>{ if(!this.fpsTxt)return;
      const fps=Math.round(this.game.loop.actualFps), bw=Math.round(this.scale.width);
      this.fpsTxt.setText(fps+'fps · '+bw+'p · x'+this.DPR); }});

    this.hudList=[this.dashBtn,this.dashTxt,this.skillBtn,this.skillEmoji,this.skillCdTxt,this.skillRing,this.barG,this.hpIcon,this.xpIcon,this.timeTxt,this.killTxt,this.lvlTxt,this.stageTxt,this.pipG,this.pauseBtn,this.pauseTxt];
    this.bossUI=[this.bossName,this.bossBgW,this.bossBar];
    this.hudList.forEach(o=>o.setVisible(false));
    this.bossUI.forEach(o=>o.setVisible(false));
  }
  hudVisible(v){ this.hudList.forEach(o=>o.setVisible(v)); if(this.skillBar)this.skillBar.setVisible(v); }
  drawBars(){
    const pad=this._pad, g=this.barG; if(!g)return; g.clear();
    const bx=pad+16, bw=this._barW-16;
    const hpf=Phaser.Math.Clamp(this.player.hp/this.player.maxhp,0,1);
    const xpf=Phaser.Math.Clamp(this.xp/this.xpNext,0,1);
    g.fillStyle(0x000000,0.35); g.fillRoundedRect(bx,pad,bw,14,7);
    if(hpf>0){ g.fillStyle(0xff5f7a,1); g.fillRoundedRect(bx+2,pad+2,Math.max(8,(bw-4)*hpf),10,5); }
    g.fillStyle(0x000000,0.35); g.fillRoundedRect(bx,pad+20,bw,8,4);
    if(xpf>0){ g.fillStyle(0x8bd3a0,1); g.fillRoundedRect(bx+2,pad+22,Math.max(4,(bw-4)*xpf),4,2); }
  }
  drawSkillRing(){
    const g=this.skillRing; if(!g)return; g.clear(); const b=this.skillBtn; if(!b||!b.visible)return;
    if(this.activeCd>0 && this._activeMax>0){
      const frac=Phaser.Math.Clamp(1-this.activeCd/this._activeMax,0,1);
      g.lineStyle(4,0xffd166,0.9); g.beginPath();
      g.arc(b.x,b.y,50,-Math.PI/2,-Math.PI/2+Math.PI*2*frac,false); g.strokePath();
    } else { g.lineStyle(3,0xffe9a8,0.5); g.strokeCircle(b.x,b.y,50); }
  }
  /* แถบไอคอนสกิลด้านล่าง — บอกว่ามีสกิลอะไร เลเวลเท่าไหร่ */
  buildSkillBar(){
    if(this.skillBar)this.skillBar.destroy();
    this.skillBar=this.add.container(0,0).setScrollFactor(1).setDepth(53);
    this.camUI(this.skillBar);
    this.skillChips={};
    const keys=Object.keys(this.skills); if(!keys.length){ this.checkCombos(); return; }
    const cw=Math.min(38,Math.floor((this.W-16)/keys.length)), rad=Math.min(16,cw/2-3), fs=Math.round(rad)+'px';
    const total=keys.length*cw; let x=this.W/2-total/2+cw/2; const y=this.H-32;
    keys.forEach(k=>{
      const d=SKILLDEFS[k], lvl=this.skills[k], awk=lvl>=SKILL_AWAKEN_LV, maxed=lvl>=d.max;
      const bg=this.add.circle(x,y,rad,0x2c2338,0.72).setStrokeStyle(2,awk?0xffb020:(maxed?0xffd166:0xff8fb5),awk?1:0.9);
      const em=this.add.text(x,y-1,awk&&d.awaken?d.awaken.emoji:d.emoji,{fontSize:fs}).setOrigin(0.5);
      const lv=this.add.text(x+rad*0.75,y+rad*0.7,awk?'⚡':(maxed?'MAX':('L'+lvl)),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:awk?'#ffcf40':(maxed?'#ffd166':'#ffd9e6')}).setOrigin(0.5);
      this.skillBar.add([bg,em,lv]); this.skillChips[k]={bg,em};
      x+=cw;
    });
    this.skillBar.setVisible(this.state==='play'||this.state==='levelup');
    this.checkCombos();
  }
  pulseSkill(k){ const c=this.skillChips&&this.skillChips[k]; if(!c)return;
    this.tweens.add({targets:[c.em],scale:{from:1.4,to:1},duration:240,ease:'Back.out'});
    this.tweens.add({targets:[c.bg],scale:{from:1.25,to:1},duration:240,ease:'Back.out'}); }
  /* คอมโบสกิล: มีสกิลคู่ครบ = ปลดโบนัส (ธง comboFlags ใช้ตอน cast) */
  checkCombos(){
    this.comboFlags={};
    for(const c of COMBOS){
      if((this.skills[c.a]||0)>0 && (this.skills[c.b]||0)>0){
        this.comboFlags[c.key]=true;
        if(!this.combosOwned[c.key]){ this.combosOwned[c.key]=true;
          if(this.state==='play'||this.state==='levelup'){ this.showBanner('✨ คอมโบปลดล็อก! '+c.emoji, c.name+' — '+c.desc, 2600); Sfx.clear(); } }
      }
    }
  }

  onResize(gs){
    if(!gs)return; const D=this.DPR||1; this.W=gs.width/D; this.H=gs.height/D; const pad=this._pad; this._barW=this.W-2*pad;
    if(this.cameras&&this.cameras.main){ this.cameras.main.setSize(gs.width,gs.height); this.cameras.main.setZoom(D*(this.viewZoom||1)); }  // กันหมุนจอแล้วกล้องโลกเพี้ยน
    if(this.uiCam){ this.uiCam.setSize(gs.width,gs.height); this.uiCam.setZoom(D); this.uiCam.centerOn(this.W/2,this.H/2); }
    if(this.vig)this.vig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H);
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-70,this.H-90); this.dashTxt.setPosition(this.W-70,this.H-90);
      this.skillBtn.setPosition(this.W-70,this.H-196); this.skillEmoji.setPosition(this.W-70,this.H-200); this.skillCdTxt.setPosition(this.W-70,this.H-168);
      this.timeTxt.setPosition(this.W/2,pad+30); this.killTxt.setPosition(this.W-pad,pad+32);
      this.stageTxt.setPosition(this.W/2,pad+54);
      if(this.skills&&(this.state==='play'||this.state==='levelup')){ this.buildSkillBar(); this.drawWavePips(); }
      if(this.muteBtn){ this.muteBtn.setPosition(this.W-30,pad+64); this.muteTxt.setPosition(this.W-30,pad+64); }
      if(this.pauseBtn){ this.pauseBtn.setPosition(this.W-72,pad+64); this.pauseTxt.setPosition(this.W-72,pad+64); }
      if(this.state==='paused') this.buildPause();
      this.bossName.setPosition(this.W/2,pad+74); this.bossBgW.setPosition(this.W/2,pad+92); this.bossBgW.width=this._barW*0.8;
      this.bossBar.setPosition(this.W/2-(this._barW*0.8)/2+2,pad+94);
      this.bannerT.setPosition(this.W/2,this.H*0.32); this.bannerS.setPosition(this.W/2,this.H*0.4); }
    if(this.state==='menu') this.buildStartMenu();
    if(this.state==='dead') this.buildOver();
  }

  /* ---------- MENUS ---------- */
  buildMenus(){
    this.menu=this.add.container(0,0).setScrollFactor(1).setDepth(100);
    this.lvlUp=this.add.container(0,0).setScrollFactor(1).setDepth(100).setVisible(false);
    this.over=this.add.container(0,0).setScrollFactor(1).setDepth(100).setVisible(false);
    this.buildStartMenu();
  }
  /* ===== HUB MENU + SUB-SCREENS (tap-zone hit-test) ===== */
  _zone(x,y,w,h,fn){ this.tapZones.push({x,y,w,h,fn}); }
  handleTap(px,py){ for(let i=this.tapZones.length-1;i>=0;i--){ const z=this.tapZones[i];
    if(px>=z.x&&px<=z.x+z.w&&py>=z.y&&py<=z.y+z.h){ Sfx.select(); z.fn(); return; } } }
  _rowBtn(y,h,emoji,name,sub,rightLabel,rightColor,fn){
    const w=Math.min(this.W-32,400), x=this.W/2-w/2;
    const g=this.add.graphics(); g.fillStyle(0x2c2338,fn?1:0.6); g.fillRoundedRect(x,y,w,h,15);
    g.lineStyle(2,fn?0x4a4059:0x39304a,1); g.strokeRoundedRect(x,y,w,h,15);
    const em=this.add.text(x+28,y+h/2,emoji,{fontSize:'24px'}).setOrigin(0.5);
    const nm=this.add.text(x+54,y+h*0.34,name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:fn?'#ffffff':'#9a90ab'}).setOrigin(0,0.5);
    const ds=this.add.text(x+54,y+h*0.72,sub,{fontFamily:'sans-serif',fontSize:'11.5px',color:'#b7abc9',wordWrap:{width:w-150}}).setOrigin(0,0.5);
    const rt=this.add.text(x+w-14,y+h/2,rightLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:rightColor}).setOrigin(1,0.5);
    this.menu.add([g,em,nm,ds,rt]); if(fn)this._zone(x,y,w,h,fn);
  }
  _screenBg(title){ const w=this.W,h=this.H;
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.97).setOrigin(0,0);
    const t=this.add.text(w/2,52,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ff8fb5'}).setOrigin(0.5);
    const sugar=this.add.text(w-16,54,'🍬 '+(Save.data.sugar||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffe08a'}).setOrigin(1,0.5);
    this.menu.add([bg,t,sugar]);
    const bg2=this.add.graphics(); bg2.fillStyle(0x2c2338,1); bg2.fillRoundedRect(14,38,80,34,12); bg2.lineStyle(2,0x4a4059,1); bg2.strokeRoundedRect(14,38,80,34,12);
    const bt=this.add.text(54,55,'‹ กลับ',{fontFamily:'sans-serif',fontSize:'14px',color:'#cbbfda'}).setOrigin(0.5);
    this.menu.add([bg2,bt]); this._zone(14,38,80,34,()=>{ this.menuScreen='hub'; this.buildMenuScreen(); });
  }
  buildMenuScreen(){ const s=this.menuScreen||'hub';
    if(s==='stage')this.buildStageSelect(); else if(s==='upgrade')this.buildUpgrade(); else if(s==='gear')this.buildGear(); else if(s==='char')this.buildChars(); else if(s==='talent')this.buildTalent(); else this.buildHub(); }
  buildStartMenu(){ this.buildMenuScreen(); }   // เผื่อโค้ดเก่าเรียก
  buildHub(){
    const w=this.W,h=this.H; this.menu.removeAll(true); this.tapZones=[];
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.94).setOrigin(0,0);
    const sugar=this.add.text(w/2,h*0.08,'🍬 Sugar: '+(Save.data.sugar||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffe08a'}).setOrigin(0.5);
    const emoji=this.add.text(w/2,h*0.19,'🍡',{fontSize:'60px'}).setOrigin(0.5);
    const title=this.add.text(w/2,h*0.29,'MOCHI MAYHEM',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'32px',color:'#ff8fb5'}).setOrigin(0.5);
    const ch=CHARACTERS[this.character||'momo'];
    const charTxt=this.add.text(w/2,h*0.35,`${ch.emoji} ${ch.name} · อัลติ ${ACTIVES[ch.active].emoji}`,{fontFamily:'sans-serif',fontSize:'13px',color:'#ffd9a8'}).setOrigin(0.5);
    this.menu.add([bg,sugar,emoji,title,charTxt]);
    const bw=Math.min(w-60,300), bx=w/2, bh=46;
    const mk=(cy,label,color,fn)=>{ const g=this.add.graphics(); g.fillStyle(color,1); g.fillRoundedRect(bx-bw/2,cy-bh/2,bw,bh,15);
      g.lineStyle(2,0xffffff,0.25); g.strokeRoundedRect(bx-bw/2,cy-bh/2,bw,bh,15);
      const t=this.add.text(bx,cy,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#fff'}).setOrigin(0.5);
      this.menu.add([g,t]); this._zone(bx-bw/2,cy-bh/2,bw,bh,fn); };
    mk(h*0.44,'▶ เริ่มเล่น',COLORS.pink,()=>{ this.menuScreen='stage'; this.buildMenuScreen(); });
    mk(h*0.545,'🎭 เลือกตัวละคร',COLORS.toast,()=>{ this.menuScreen='char'; this.buildMenuScreen(); });
    mk(h*0.65,'🌟 พรสวรรค์ (เฉพาะตัว)',0xf6a5c0,()=>{ this.menuScreen='talent'; this.buildMenuScreen(); });
    mk(h*0.755,'⚙️ อัพเกรดฐาน (ทุกตัว)',COLORS.grape,()=>{ this.menuScreen='upgrade'; this.buildMenuScreen(); });
    mk(h*0.86,'🎽 ของสวมใส่',COLORS.mint,()=>{ this.menuScreen='gear'; this.buildMenuScreen(); });
    // ปุ่มรีเซ็ตเซฟ (สำหรับเทส) — แตะ 2 ครั้งยืนยัน
    const rt=this.add.text(w/2,h*0.955, this._resetConfirm?'⚠️ แตะอีกครั้งเพื่อล้างทั้งหมด':'🗑️ รีเซ็ตความคืบหน้า',
      {fontFamily:'sans-serif',fontSize:'13px',color:this._resetConfirm?'#ff8fb5':'#7a7088'}).setOrigin(0.5);
    this.menu.add(rt);
    this._zone(w/2-110,h*0.955-16,220,32,()=>{
      if(this._resetConfirm){ Save.reset(); this._resetConfirm=false; this.character='momo'; if(this.skillEmoji)this.skillEmoji.setText(ACTIVES[CHARACTERS.momo.active].emoji); Sfx.clear(); this.buildMenuScreen(); }
      else { this._resetConfirm=true; Sfx.select(); this.buildMenuScreen(); this.time.delayedCall(3000,()=>{ if(this._resetConfirm){ this._resetConfirm=false; if(this.state==='menu'&&this.menuScreen==='hub')this.buildMenuScreen(); } }); }
    });
    this.menu.setVisible(true);
  }
  buildTalent(){
    this.menu.removeAll(true); this.tapZones=[];
    const id=this.character||Save.data.character||'momo', c=CHARACTERS[id], cp=Save.cp(id), w=this.W;
    this._screenBg('พรสวรรค์เฉพาะตัว '+c.emoji);
    const roleDesc={momo:'สายสมดุล · เน้นระเบิดอัลติ',mint:'สายแทงค์ · เกราะน้ำแข็ง อึดทน',cocoa:'สายจอมพลัง · ดาเมจสูง เปราะ'}[id]||'';
    const role=this.add.text(w/2,this.H*0.088,c.name+' — '+roleDesc,{fontFamily:'sans-serif',fontSize:'12px',color:'#ffd9a8'}).setOrigin(0.5);
    this.menu.add(role);
    // หัว: เลเวล + หลอด EXP + แต้มเหลือ
    const need=charExpNeed(cp.lvl), y0=this.H*0.115;
    const lv=this.add.text(w/2,y0,'เลเวล '+cp.lvl+'  ·  แต้มเหลือ '+(cp.tp||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:(cp.tp>0?'#ffd166':'#c7bdd6')}).setOrigin(0.5);
    const bw=Math.min(w-60,300), bx=w/2-bw/2, by=y0+20, g=this.add.graphics();
    g.fillStyle(0x000000,0.35); g.fillRoundedRect(bx,by,bw,10,5);
    g.fillStyle(0x8fd0ff,1); const f=Phaser.Math.Clamp(cp.exp/need,0,1); if(f>0)g.fillRoundedRect(bx,by,Math.max(6,bw*f),10,5);
    const ex=this.add.text(w/2,by+18,'EXP '+cp.exp+' / '+need+'  (เล่นจบด่าน/ตายเพื่อเก็บ EXP)',{fontFamily:'sans-serif',fontSize:'11px',color:'#9a90ab'}).setOrigin(0.5);
    this.menu.add([lv,g,ex]);
    // รายการพรสวรรค์
    let y=this.H*0.24;
    charTalents(id).forEach(t=>{ const r=(cp.tal&&cp.tal[t.id])||0, maxed=r>=t.max, canBuy=!maxed&&(cp.tp||0)>0;
      this._rowBtn(y,52,t.emoji,t.name+'  '+r+'/'+t.max,t.per+' /แต้ม',
        maxed?'MAX':(canBuy?'+ ลง 1':'ต้องมีแต้ม'),
        maxed?'#ffd166':(canBuy?'#8bd3a0':'#7a7088'),
        (maxed||!canBuy)?null:()=>{ if((cp.tp||0)>0&&r<t.max){ cp.tal[t.id]=r+1; cp.tp--; Save.save(); Sfx.select(); this.buildMenuScreen(); } });
      y+=56;
    });
    this.menu.setVisible(true);
  }
  buildChars(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('เลือกตัวละคร');
    const y0=this.H*0.15;
    CHAR_ORDER.forEach((id,i)=>{ const c=CHARACTERS[id], y=y0+i*92;
      const owned=Save.data.chars.includes(id), selected=Save.data.character===id, afford=(Save.data.sugar||0)>=c.cost;
      this._rowBtn(y,80,c.emoji,c.name,c.desc,
        selected?'เลือกอยู่ ✓':(owned?'เลือก':'🍬'+c.cost),
        selected?'#ffd166':(owned?'#8bd3a0':(afford?'#bfe8ff':'#e0788a')),
        selected?null:()=>{
          if(owned){ Save.data.character=id; Save.save(); this.character=id; if(this.skillEmoji)this.skillEmoji.setText(ACTIVES[c.active].emoji); }
          else if(Save.spend(c.cost)){ Save.data.chars.push(id); Save.data.character=id; Save.save(); this.character=id; Sfx.clear(); }
          this.buildMenuScreen(); });
    });
    this.menu.setVisible(true);
  }
  buildStageSelect(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('เลือกบท');
    const note=this.add.text(this.W/2,this.H*0.115,'แต่ละบทเริ่มจากด่าน 1 เสมอ · เคลียร์ให้ครบทั้งบท',{fontFamily:'sans-serif',fontSize:'12px',color:'#b7abc9'}).setOrigin(0.5);
    this.menu.add(note);
    const y0=this.H*0.17;
    CHAPTERS.forEach((ch,i)=>{ const y=y0+i*74;
      this._rowBtn(y,62,ch.emoji,ch.name,ch.desc,
        ch.ready?'▶ เริ่มบท':'🔒 เร็ว ๆ นี้', ch.ready?'#8bd3a0':'#7a7088',
        ch.ready?()=>{ this.startRun(0); }:()=>{ Sfx.select(); });
    });
    this.menu.setVisible(true);
  }
  buildUpgrade(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('อัพเกรดฐาน (ทุกตัวละคร)');
    const y0=this.H*0.155;
    const note=this.add.text(this.W/2,this.H*0.108,'ซื้อด้วย 🍬 Sugar · ใช้กับทุกตัวละคร',{fontFamily:'sans-serif',fontSize:'12px',color:'#b7abc9'}).setOrigin(0.5);
    this.menu.add(note);
    UPG_ORDER.forEach((k,i)=>{ const u=UPGRADES[k], lvl=Save.data.upgrades[k]||0, y=y0+i*72;
      const maxed=lvl>=u.max, cost=maxed?0:u.cost(lvl), afford=(Save.data.sugar||0)>=cost;
      this._rowBtn(y,62,u.emoji,u.name+'  Lv '+lvl+'/'+u.max,u.unit,
        maxed?'MAX':'🍬'+cost, maxed?'#ffd166':(afford?'#8bd3a0':'#e0788a'),
        maxed?null:()=>{ if(Save.spend(cost)){ Save.data.upgrades[k]=lvl+1; Save.save(); Sfx.clear(); } this.buildMenuScreen(); });
    });
    this.menu.setVisible(true);
  }
  buildGear(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('ของสวมใส่');
    let y=this.H*0.125;
    [['weapon','⚔ อาวุธ'],['charm','🧿 เครื่องราง']].forEach(([slot,label])=>{
      const hdr=this.add.text(this.W/2,y,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffd9a8'}).setOrigin(0.5);
      this.menu.add(hdr); y+=22;
      GEAR[slot].forEach(it=>{ const owned=Save.data.ownedGear.includes(it.id), equipped=Save.data.gear[slot]===it.id;
        const lv=Save.gearLv(it.id), canEnh=it.enh&&lv<GEAR_ENH_MAX, ecost=gearEnhCost(lv);
        const nm=it.name+(lv>0?'  +'+lv:'');
        let label,color,fn;
        if(equipped && canEnh){ const afEnh=(Save.data.sugar||0)>=ecost; label='⚒️ +'+(lv+1)+' 🍬'+ecost; color=afEnh?'#ffd166':'#e0788a';
          fn=()=>{ if(Save.spend(ecost)){ Save.enhance(it.id); Sfx.clear(); } this.buildMenuScreen(); }; }
        else if(equipped){ label='ใส่อยู่ ✓'; color='#ffd166'; fn=null; }
        else if(owned){ label='สวมใส่'; color='#8bd3a0'; fn=()=>{ Save.data.gear[slot]=it.id; Save.save(); this.buildMenuScreen(); }; }
        else { const af=(Save.data.sugar||0)>=it.cost; label='🍬'+it.cost; color=af?'#bfe8ff':'#e0788a';
          fn=()=>{ if(Save.spend(it.cost)){ Save.data.ownedGear.push(it.id); Save.data.gear[slot]=it.id; Save.save(); Sfx.clear(); } this.buildMenuScreen(); }; }
        this._rowBtn(y,46,it.emoji,nm,it.desc,label,color,fn);
        y+=52;
      });
      y+=6;
    });
    this.menu.setVisible(true);
  }
  applyMeta(){
    const p=this.player;
    p.cdMul=1; p.ultPow=1; p.ultCdMul=1; p.dmgTakenMul=1;   // ตัวคูณจากพรสวรรค์ (รีเซ็ตก่อน)
    p.critChance=0; p.critMul=1.8; p.regen=0; p.lifesteal=0;   // สแตตพรสวรรค์เชิงลึก
    p.twinBomb=false; p.deepFreeze=false; p.bigVoid=false;   // ธง signature อัลติ (รีเซ็ตก่อน)
    // เลือกตัวละคร → กำหนดอัลติ + ไอคอนปุ่ม
    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
    const ch=CHARACTERS[this.character];
    this.active={ key:ch.active, lvl:1 };
    if(this.skillEmoji)this.skillEmoji.setText(ACTIVES[ch.active].emoji);
    if(this.textures.exists('char_'+this.character))this.player.setTexture('char_'+this.character);
    this.setCharScale('char_'+this.character);   // รูปจริงตัวใหญ่ → ปรับสเกล/ขอบชนให้เท่ากราฟิกโค้ดเดิม (60px)
    if(this.aura)this.aura.setFillStyle(ch.color||COLORS.mochiEdge,0.14);
    // โบนัสตัวละคร
    if(ch.bonus){ if(ch.bonus.maxhp)p.maxhp+=ch.bonus.maxhp; if(ch.bonus.dmgMul)p.dmgMul*=ch.bonus.dmgMul;
      if(ch.bonus.spd)p.baseSpeed*=ch.bonus.spd; }
    for(const k in UPGRADES){ const l=Save.data.upgrades[k]||0; if(l>0)UPGRADES[k].apply(p,l); }
    for(const slot in GEAR){ const it=GEAR[slot].find(g=>g.id===Save.data.gear[slot]); if(it&&it.apply)it.apply(p, Save.gearLv(it.id)); }
    // พรสวรรค์ของตัวละครนี้
    const cp=Save.cp(this.character);
    for(const t of charTalents(this.character)){ const r=(cp.tal&&cp.tal[t.id])||0; if(r>0)t.apply(p,r); }
    p.hp=p.maxhp;
  }
  // ให้ EXP ตัวละครปัจจุบัน + คำนวณเลเวล/แต้ม (คืน obj สรุปเพื่อโชว์)
  gainCharExp(n){
    if(!n||n<=0)return; const cp=Save.cp(this.character); cp.exp=(cp.exp||0)+Math.round(n);
    let ups=0; while(cp.exp>=charExpNeed(cp.lvl)){ cp.exp-=charExpNeed(cp.lvl); cp.lvl++; cp.tp=(cp.tp||0)+1; ups++; }
    Save.save(); this._lastExpGain=Math.round(n); this._lastLvlUps=ups; return ups;
  }
  showMenu(){ this.state='menu'; Sfx.bgmIntense(false); this.menuScreen='hub'; if(this.pauseUI)this.pauseUI.setVisible(false); this.buildMenuScreen(); this.hudVisible(false); }
  // หยุดชั่วคราว / เล่นต่อ
  togglePause(){
    if(this.state==='play'){ this.state='paused'; this.physics.pause();
      if(this.joy){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0; this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
      this.buildPause(); this.pauseTxt.setText('▶'); Sfx.select();
    } else if(this.state==='paused'){ this.state='play'; this.physics.resume();
      if(this.pauseUI)this.pauseUI.setVisible(false); this.pauseTxt.setText('⏸'); Sfx.select(); }
  }
  buildPause(){
    const w=this.W,h=this.H;
    if(!this.pauseUI){ this.pauseUI=this.add.container(0,0).setScrollFactor(1).setDepth(90); this.camUI(this.pauseUI); }
    this.pauseUI.removeAll(true); this._pauseBtns=[];
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.85).setOrigin(0,0);
    const t=this.add.text(w/2,h*0.33,'⏸ หยุดพัก',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'27px',color:'#ff8fb5'}).setOrigin(0.5);
    const sub=this.add.text(w/2,h*0.39,'ด่าน '+((this.stageIndex||0)+1)+' · ฆ่าไป '+this.kills+' ตัว',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0.5);
    this.pauseUI.add([bg,t,sub]);
    const bw=Math.min(w-80,280), bx=w/2, bh=54;
    const mk=(cy,label,color,fn)=>{ const g=this.add.graphics(); g.fillStyle(color,1); g.fillRoundedRect(bx-bw/2,cy-bh/2,bw,bh,16);
      g.lineStyle(2,0xffffff,0.25); g.strokeRoundedRect(bx-bw/2,cy-bh/2,bw,bh,16);
      const lt=this.add.text(bx,cy,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'19px',color:'#fff'}).setOrigin(0.5);
      this.pauseUI.add([g,lt]); this._pauseBtns.push({x:bx-bw/2,y:cy-bh/2,w:bw,h:bh,fn}); };
    mk(h*0.50,'▶ เล่นต่อ',COLORS.mint,()=>this.togglePause());
    mk(h*0.62,'🏠 ออกจากด่าน',COLORS.grape,()=>this.exitStage());
    this.pauseUI.setVisible(true);
  }
  exitStage(){
    this.physics.resume();   // ปลดหยุดฟิสิกส์ก่อนออก (ไม่งั้นด่านหน้าค้าง)
    if(this.pauseUI)this.pauseUI.setVisible(false); this.pauseTxt.setText('⏸');
    Save.addSugar(this.sugarStage); this.gainCharExp(Math.floor(this.kills*0.5)); this.sugarStage=0;
    this.boss=null; if(this.bossUI)this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e){ if(e._aura){e._aura.destroy();e._aura=null;} e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
    this.clearFoes(); this.clearPickups(true); if(this.pipG)this.pipG.clear();
    this.showMenu();
  }
  startRun(idx){
    if(this.state!=='menu')return; idx=idx||0;
    this.menu.setVisible(false); this.hudVisible(true);
    this.state='play'; this.elapsed=0; this.sugarStage=0; this.sugarRun=0;
    this.stageIndex=idx; this.boss=null; this.mode='wave'; this.waveIndex=0; this.waveAlive=0;
    this.skills={ sprinkle:1 }; this.passives={};   // เริ่มรอบใหม่ = ล้างสกิล/พาสซีฟ (กันค้างจากรอบก่อนตอนออกจากด่าน)
    this.player.maxhp=100; this.player.baseSpeed=210; this.player.pickup=80; this.player.dmgMul=1;  // รีเซ็ตสแตตฐาน (กันพาสซีฟ/พรสวรรค์ทบจากรอบก่อน)
    this.applyMeta(); this.buildSkillBar();
    this.startStage(idx);
  }
  _busy(){ return this.state==='play'||this.state==='levelup'; }  // ยังเล่นอยู่ (levelup แค่พักชั่วคราว)

  /* ---------- STAGES / WAVES (Archero-style) ---------- */
  startStage(i){
    const st=STAGES[i]; this.stageIndex=i; this.boss=null; this.mode='wave'; this.waveIndex=0; this.waveAlive=0;
    this.bossUI.forEach(o=>o.setVisible(false));
    this.gridBg.fillColor=st.grid;
    this.stageTxt.setText(`ด่าน ${i+1}/${STAGES.length} · ${st.emoji} ${st.name}`);
    this.showBanner(`${st.emoji} ด่าน ${i+1}: ${st.name}`, st.lore, 3000);
    this.updateWaveText();
    this.time.delayedCall(1400,()=>{ if(this._busy()) this.startWave(0); });
  }
  updateWaveText(){
    const st=STAGES[this.stageIndex]; if(!st)return;
    const left=Math.max(0,this.waveAlive||0);
    if(this.mode==='boss') this.timeTxt.setText('👹 บอสใหญ่');
    else if(this.mode==='mini') this.timeTxt.setText('💢 มินิบอส · เหลือ '+left);
    else if(this.mode==='breather') this.timeTxt.setText('เวฟถัดไป…');
    else this.timeTxt.setText('⚔ เวฟ '+(this.waveIndex+1)+'/'+st.waves+' · เหลือ '+left);
    this.drawWavePips();
  }
  drawWavePips(){
    const g=this.pipG; if(!g)return; g.clear();
    const st=STAGES[this.stageIndex]; if(!st||this.mode==='boss')return;
    const n=st.waves, seg=Math.min(20,(this.W*0.62)/n), w=seg-3, h=6;
    const x0=this.W/2-(n*seg)/2, y=this._pad+72;
    for(let i=0;i<n;i++){ const x=x0+i*seg;
      let col=0x4a4059, a=0.7;                       // ยังไม่ถึง
      if(i<this.waveIndex){ col=0x8bd3a0; a=0.9; }    // ผ่านแล้ว
      else if(i===this.waveIndex){ col=0xffd166; a=1; }// เวฟปัจจุบัน
      g.fillStyle(col,a); g.fillRoundedRect(x,y,w,h,3);
      if(i===st.miniAt){ g.fillStyle(0xff7ac0,1); g.fillCircle(x+w/2,y-4,2.5); } // จุดชมพู=มินิบอส
    }
    // ปลายแถว = บอสใหญ่
    g.fillStyle(0xff5f97,1); g.fillCircle(x0+n*seg+4,y+h/2,4);
  }
  startWave(w){
    const st=STAGES[this.stageIndex]; this.waveIndex=w; this.boss=null;
    this.bossUI.forEach(o=>o.setVisible(false));
    if(w===st.miniAt){ this.mode='mini'; this.spawnMiniBoss(); }
    else { this.mode='wave'; this.spawnNormalWave(); }
    this.updateWaveText();
  }
  spawnWaveEnemy(){ let type='basic'; const r=Math.random(), si=this.stageIndex;
    if(si>=1&&r<0.30)type='fast';
    if(si>=2&&r>0.86)type='tank';
    if(si>=1&&r>0.62&&r<0.76)type='shooter';   // ตัวยิงระยะไกล (พังการ kite)
    if(si>=2&&r>0.76&&r<0.86)type='bomber';     // ตัวระเบิดตอนตาย
    this.spawnEnemy(type); }
  spawnElite(){
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.6+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false);
    if(!e) e=this.enemies.create(x,y,'e_tank'); else { e.setTexture('e_tank'); e.setActive(true).setVisible(true); e.body.enable=true; e.setPosition(x,y); }
    const s=(1+this.stageIndex*0.35)*(1+this.waveIndex*0.06);
    e.hp=70*s; e.maxhp=e.hp; e.spd=48; e.dmg=18; e.xp=8;
    e.setCircle(26,5,5); e.isBoss=false; e.isMini=false; e.isElite=true; e.frozen=0; e.knock=0;
    e.setScale(1.55).clearTint(); this.camWorld(e);   // elite = ตัวถึก (รูปจริง) ตัวใหญ่กว่าปกติ
  }
  spawnNormalWave(){
    const w=this.waveIndex, si=this.stageIndex, mine=w;
    const swarm=si>=2 || (si>=1&&w>=3);   // ด่านหลัง/เวฟท้าย = ฝูงถล่ม
    const count=Math.min(90, (swarm?14:10) + w*4 + si*6);   // ฝูงเยอะขึ้นมาก
    // ปล่อยเป็น 3 ระลอก (ฝูงถล่มต่อเนื่อง) — ระลอกหลังเช็คว่ายังอยู่เวฟเดิม
    const b1=Math.ceil(count*0.5), b2=Math.ceil(count*0.28), b3=count-b1-b2;
    for(let i=0;i<b1;i++) this.spawnWaveEnemy();
    const more=(n,delay)=>{ if(n<=0)return; this.time.delayedCall(delay,()=>{ if(this._busy()&&this.mode==='wave'&&this.waveIndex===mine){ for(let i=0;i<n;i++) this.spawnWaveEnemy(); } }); };
    more(b2,1300); more(b3,swarm?2600:3200);
    // elite ตัวอึด (ด่าน 2 ขึ้นไป) — ท้าทาย + ให้ xp/sugar เยอะ · ฝูงถล่มมี elite เพิ่ม
    let elites=0; if(si>=1&&w>=1){ elites=(1+Math.floor(si/2))*(swarm?2:1); for(let i=0;i<elites;i++) this.spawnElite(); }
    this.waveAlive=count+elites;
    // กล่อง/โหลทุบได้ (ธีมครัว) — ทุบเอาของ (ออร์บ/ฟื้นฟู)
    const nc=2+Math.floor(si*0.6); for(let i=0;i<nc;i++) this.spawnCrate();
  }
  spawnMiniBoss(){
    const st=STAGES[this.stageIndex];
    this.showBanner('💢 มินิบอส!', st.mini, 2000); Sfx.bossWarn(); Sfx.bgmIntense(true); this.cameras.main.shake(200,0.008);
    const adds=2+this.stageIndex;
    for(let i=0;i<adds;i++) this.spawnEnemy(Math.random()<0.5?'fast':'basic');
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const b=this.enemies.create(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad,'e_brute');
    b.setScale(1.7).setCircle(26,5,5); b.isMini=true; b.isBoss=false;
    b.hp=st.bossHp*0.62; b.maxhp=b.hp; b.spd=54; b.dmg=Math.round(st.bossDmg*0.75); b.xp=15; b.frozen=0; b.knock=0; b.phase3=false;
    b.tintColor=st.tint; b.setTint(st.tint);
    b.atkCd=1.6; b.phase2=false; b.atks=['slam','aimed']; if(this.stageIndex>=1)b.atks.push('radial'); if(this.stageIndex>=3)b.atks.push('charge');
    this.boss=b; this.camWorld(b); this.bossName.setText('💢 '+st.mini); this.bossUI.forEach(o=>o.setVisible(true));
    this.waveAlive=adds+1;
  }
  spawnFinalBoss(){
    const st=STAGES[this.stageIndex]; this.mode='boss';
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const bx=this.player.x+Math.cos(ang)*rad, by=this.player.y+Math.sin(ang)*rad;
    const bkey='boss'+(this.stageIndex+1);
    const b=this.enemies.create(bx,by,this.textures.exists(bkey)?bkey:'e_brute');
    const isArt=this.textures.exists(bkey);
    b.setScale(isArt?1.55:2.5); b.setCircle(isArt?54:26, isArt?16:5, isArt?16:5); b.isBoss=true; b.isMini=false;
    b.hp=st.bossHp*(1.4+this.stageIndex*0.08); b.maxhp=b.hp; b.spd=40; b.dmg=st.bossDmg; b.xp=30; b.frozen=0; b.knock=0; b.phase3=false;
    if(isArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.atkCd=1.4; b.phase2=false; b.atks=['slam','radial','aimed','charge']; if(this.stageIndex>=1)b.atks.push('summon');
    this.boss=b; this.camWorld(b); this.bossName.setText('👹 '+st.boss); this.bossUI.forEach(o=>o.setVisible(true));
    this.waveAlive=1; this.updateWaveText();
    this.bossIntro(b, st.boss);
  }
  // ฉากปรากฏตัวบอส: จอวาบ + กล้องกระแทกซูม + คลื่นกระแทก + เขย่า + แบนเนอร์ใหญ่
  bossIntro(b,name){
    Sfx.bossWarn(); this.cameras.main.shake(500,0.014); Sfx.bgmIntense(true);
    this.screenFlash(0xffffff,0.55,220);
    this.screenFlash(0x1a0e1e,0.35,650);   // จอมืดวูบ = ดราม่า
    // กล้องกระแทกซูมเข้า-ออก
    const cam=this.cameras.main, z0=cam.zoom;
    this.tweens.add({targets:cam,zoom:z0*1.12,duration:180,yoyo:true,ease:'Quad.out'});
    // คลื่นกระแทกจากตัวบอส
    for(let i=0;i<3;i++){ const ring=this.camWorld(this.add.circle(b.x,b.y,20,0xff5a7a,0).setDepth(6).setStrokeStyle(4,0xff8fb5,0.8));
      this.tweens.add({targets:ring,radius:180+i*60,alpha:{from:0.8,to:0},duration:520+i*120,delay:i*90,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
    this.showBanner('👹 บอสใหญ่มาแล้ว!', name, 2600);
  }
  // จอวาบเต็มหน้าจอ (บนกล้อง UI) — ใช้ตอนบอสปรากฏ/เข้าเฟส/ตาย
  screenFlash(color,alpha,dur){
    const f=this.add.rectangle(this.W/2,this.H/2,this.W,this.H,color,alpha).setScrollFactor(1).setDepth(80);
    this.camUI(f); this.tweens.add({targets:f,alpha:0,duration:dur,onComplete:()=>f.destroy()});
  }
  // ฉากบอสตาย: สโลว์โมชัน + จอวาบ + ระเบิดเป็นชุด + คลื่นกระแทก
  bossDefeat(x,y){
    Sfx.clear(); this.screenFlash(0xffffff,0.7,420); this.cameras.main.shake(600,0.016);
    for(let i=0;i<5;i++) this.time.delayedCall(60+i*80,()=>{
      this.burst(x+Phaser.Math.Between(-50,50),y+Phaser.Math.Between(-50,50),[0xffd166,0xff8fb5,0xbfe8ff][i%3]); });
    for(let i=0;i<3;i++){ const ring=this.camWorld(this.add.circle(x,y,20,0xffe08a,0).setDepth(7).setStrokeStyle(5,0xffd166,0.9));
      this.tweens.add({targets:ring,radius:220+i*70,alpha:{from:0.9,to:0},duration:700+i*150,delay:i*110,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
  }
  clearFoes(){ this.foeBullets.children.iterate(b=>{ if(b&&b.active)this.killFoe(b); }); }
  clearPickups(alsoHeals){ if(this.crates)this.crates.children.iterate(c=>{ if(c&&c.active){ this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false; } });
    if(alsoHeals&&this.heals)this.heals.children.iterate(h=>{ if(h&&h.active){ this.tweens.killTweensOf(h); h.setActive(false).setVisible(false); if(h.body)h.body.enable=false; } }); }
  onWaveCleared(){
    this.boss=null; Sfx.bgmIntense(false); this.bossUI.forEach(o=>o.setVisible(false)); this.clearFoes();
    const st=STAGES[this.stageIndex], next=this.waveIndex+1;
    if(next>=st.waves){ this.spawnFinalBoss(); return; }
    this.clearPickups(false);   // เก็บกล่องที่ไม่ได้ทุบ (ออร์บ/ฟื้นฟูยังอยู่)
    this.mode='breather'; this.updateWaveText(); this.poseFlash(CF.cheer,700);   // เคลียร์เวฟ = ดีใจ
    this.time.delayedCall(750,()=>{ if(this._busy()) this.startWave(next); });
  }
  onStageClear(){
    this.boss=null; this.mode='clear'; this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e&&e.active){ e.setActive(false).setVisible(false); e.body.enable=false; } });
    this.clearFoes(); this.clearPickups(true); this.waveAlive=0; this.pipG.clear();
    this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.35); // heal reward
    Sfx.clear();
    const last=this.stageIndex>=STAGES.length-1;
    Save.addSugar(this.sugarStage);                                   // ฝาก Sugar
    this.gainCharExp(40 + this.stageIndex*25);                        // EXP ตัวละคร (โบนัสเคลียร์ด่าน)
    if(!last && (Save.data.unlockedStage||0) < this.stageIndex+1){ Save.data.unlockedStage=this.stageIndex+1; Save.save(); }
    this.showStageSummary(last);
  }
  /* หน้าสรุปด่าน — แตะเพื่อไปต่อ */
  showStageSummary(last){
    this.state='summary'; this.physics.pause(); this.player.setVelocity(0,0);
    this._summaryLast=last;
    const w=this.W,h=this.H, st=STAGES[this.stageIndex]; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.9).setOrigin(0,0);
    const em=this.add.text(w/2,h*0.2,'✨',{fontSize:'60px'}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.31,'เคลียร์ '+st.emoji+' '+st.name+'!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffd166',align:'center',wordWrap:{width:w*0.85}}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const cp=Save.cp(this.character), ch=CHARACTERS[this.character];
    const rows=[
      ['⏱ เวลารวม', mm+':'+ss.toString().padStart(2,'0')],
      ['☠ กำจัด', String(this.kills)],
      ['🍬 Sugar ด่านนี้', '+'+this.sugarStage],
      [ch.emoji+' EXP ตัวละคร', '+'+(this._lastExpGain||0)],
      ['🌟 เลเวลตัวละคร', 'Lv '+cp.lvl+(this._lastLvlUps>0?'  (เลเวลอัพ! +'+this._lastLvlUps+' แต้ม)':'')],
    ];
    const box=[bg,em,t]; let y=h*0.42;
    rows.forEach(r=>{ const l=this.add.text(w/2-120,y,r[0],{fontFamily:'sans-serif',fontSize:'15px',color:'#c7bdd6'}).setOrigin(0,0.5);
      const v=this.add.text(w/2+120,y,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(1,0.5);
      box.push(l,v); y+=30; });
    const btn=this.add.graphics(); btn.fillStyle(COLORS.pink,1); btn.fillRoundedRect(w/2-120,h*0.78-30,240,60,22);
    const bt=this.add.text(w/2,h*0.78,last?'🏆 สู่บอสสุดท้าย':'▶ ไปด่านต่อไป',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    box.push(btn,bt); this.over.add(box); this.over.setVisible(true);
    this.sugarStage=0;
  }
  continueFromSummary(){
    if(this.state!=='summary')return;
    this.over.setVisible(false); this.physics.resume(); this.state='play';
    if(this._summaryLast){ this.victory(); return; }
    this.startStage(this.stageIndex+1);
  }
  showBanner(title,sub,ms){
    this.bannerT.setText(title).setVisible(true).setAlpha(0).setScale(0.7);
    this.bannerS.setText(sub||'').setVisible(true).setAlpha(0);
    this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:1,duration:250});
    this.tweens.add({targets:this.bannerT,scale:1,duration:420,ease:'Back.out'});
    this.time.delayedCall(ms,()=>{ this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:0,duration:400,
      onComplete:()=>{ this.bannerT.setVisible(false); this.bannerS.setVisible(false); }}); });
  }
  victory(){
    this.state='win'; this.physics.pause(); this.player.setVelocity(0,0);
    this.gainCharExp(this.kills+200);
    Sfx.victory();
    const w=this.W,h=this.H; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x14101a,0.9).setOrigin(0,0);
    const em=this.add.text(w/2,h*0.24,'🏆',{fontSize:'70px'}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.37,'ชนะแล้ว! คำสาปถูกทำลาย',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:'#ffd166',align:'center',wordWrap:{width:w*0.85}}).setOrigin(0.5);
    const lore=this.add.text(w/2,h*0.47,'โมโม่ล้มเชฟขมได้สำเร็จ ครัวใหญ่กลับมาหอมหวานอีกครั้ง 🍡',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6',align:'center',wordWrap:{width:w*0.82}}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const stat=this.add.text(w/2,h*0.56,`เวลา ${mm}:${ss.toString().padStart(2,'0')}  ·  กำจัด ${this.kills}  ·  Lv ${this.level}`,{fontFamily:'sans-serif',fontSize:'15px',color:'#9a90ab'}).setOrigin(0.5);
    const btn=this.add.rectangle(w/2,h*0.68,210,58,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.3);
    const bt=this.add.text(w/2,h*0.68,'↻ เล่นอีกครั้ง',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.restart());
    this.over.add([bg,em,t,lore,stat,btn,bt]); this.over.setVisible(true);
  }

  /* ---------- LEVEL UP ---------- */
  gainXp(n){
    this.xp+=n;
    while(this.xp>=this.xpNext){ this.xp-=this.xpNext; this.level++; this.xpNext=Math.round(this.xpNext*1.22+3); this.pendingLvl=(this.pendingLvl||0)+1; this.jelly(0,3.2); }  // เลเวลอัพ = เด้งดีใจ
    this.lvlTxt.setText('Lv '+this.level);
    if(this.pendingLvl>0 && this.state==='play') this.openLevelUp();
  }
  openLevelUp(){
    this.state='levelup'; this.physics.pause();
    Sfx.levelup();
    const w=this.W,h=this.H; this.lvlUp.removeAll(true); this.lvlCards=[];
    const bg=this.add.rectangle(0,0,w,h,0x211526,0.86).setOrigin(0,0);
    const t=this.add.text(w/2,h*0.13,'⭐ เลเวลอัพ! แตะเลือก 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'25px',color:'#ffd166'}).setOrigin(0.5);
    this.lvlUp.add([bg,t]);
    const opts=this.rollUpgrades(3);
    const cardW=Math.min(w-40,380), ch=104, gap=16, startY=h*0.23, lx=w/2-cardW/2;
    opts.forEach((o,i)=>{
      const y=startY+i*(ch+gap);
      const g=this.add.graphics();
      g.fillStyle(0x2c2338,1); g.fillRoundedRect(lx,y,cardW,ch,20);
      g.lineStyle(2.5,o.color,1); g.strokeRoundedRect(lx,y,cardW,ch,20);
      g.fillStyle(o.color,0.20); g.fillCircle(lx+40,y+ch/2,28);
      const em=this.add.text(lx+40,y+ch/2,o.emoji,{fontSize:'34px'}).setOrigin(0.5);
      const badge=this.add.text(lx+78,y+20,o.kind,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:o.badgeColor}).setOrigin(0,0);
      const nm=this.add.text(lx+78,y+34,o.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffffff'}).setOrigin(0,0);
      const ds=this.add.text(lx+78,y+62,o.desc,{fontFamily:'sans-serif',fontSize:'12.5px',color:'#cbbfda',wordWrap:{width:cardW-100}}).setOrigin(0,0);
      this.lvlUp.add([g,em,badge,nm,ds]);
      this.lvlCards.push({top:y,bottom:y+ch,apply:o.apply});
      // การ์ดเด้งเข้าทีละใบ (UX polish)
      g.setAlpha(0); em.setScale(0.2);
      this.tweens.add({targets:[g,badge,nm,ds],alpha:{from:0,to:1},duration:200,delay:i*80});
      this.tweens.add({targets:em,scale:{from:0.2,to:1},duration:320,delay:i*80,ease:'Back.out'});
    });
    this.lvlUp.setVisible(true);
  }
  pickCardAt(py){
    const c=this.lvlCards.find(c=>py>=c.top&&py<=c.bottom);
    if(!c) return;
    Sfx.select(); c.apply(); this.closeLevelUp();
  }
  closeLevelUp(){
    this.lvlUp.setVisible(false); this.pendingLvl=Math.max(0,(this.pendingLvl||1)-1);
    if(this.pendingLvl>0){ this.openLevelUp(); return; }
    this.state='play'; this.physics.resume();
  }
  rollUpgrades(n){
    const skillPool=[], passPool=[], awakenPool=[];
    const S=(color,emoji,title,desc,apply)=>skillPool.push({kind:'✦ สกิลโจมตี',badgeColor:'#ff8fb5',color,emoji,title,desc,apply});
    const P=(color,emoji,title,desc,apply)=>passPool.push({kind:'▲ สกิลติดตัว',badgeColor:'#8bd3a0',color,emoji,title,desc,apply,pas:true});
    const A=(color,emoji,title,desc,apply)=>awakenPool.push({kind:'⚡ ขั้นสุด',badgeColor:'#ffcf5a',color,emoji,title,desc,apply,awk:true});
    const atkOwned=Object.keys(this.skills).length;      // ล็อกโจมตี ≤ SKILL_CAP
    const pasOwned=Object.keys(this.passives).length;    // ล็อกติดตัว ≤ PASSIVE_CAP
    // --- สกิลโจมตี (auto-cast) — สกิลใหม่เฉพาะเมื่อยังไม่เต็มโควตา ---
    for(const key in SKILLDEFS){ const d=SKILLDEFS[key], cur=this.skills[key]||0;
      if(cur===0){ if(atkOwned<SKILL_CAP) S(COLORS.pink,d.emoji,d.name,'✨ สกิลใหม่ — '+d.desc,()=>{ this.skills[key]=1; if(key==='star')this.rebuildRing(); this.buildSkillBar(); }); }
      else if(cur<d.max){ const nx=cur+1, tier=(SKILL_TIERS[key]&&SKILL_TIERS[key][nx])||'แรงขึ้น';
        S(COLORS.grape,d.emoji,d.name+' → Lv'+nx,'🔺 '+tier,()=>{ this.skills[key]++; if(key==='star')this.rebuildRing(); this.buildSkillBar(); }); }
      else if(cur===d.max && d.awaken){   // MAX แล้ว → "ตื่นรู้" (Awaken) เปลี่ยนรูปแบบสกิลให้โกง (การันตีโผล่)
        const a=d.awaken;
        A(0xffb020,a.emoji,'⚡ ตื่นรู้: '+a.name,'💥 '+a.desc,()=>{ this.skills[key]=SKILL_AWAKEN_LV; if(key==='star')this.rebuildRing(); this.buildSkillBar(); if(this.showBanner)this.showBanner('⚡ สกิลตื่นรู้! '+a.emoji, d.name+' → '+a.name, 2400); Sfx.clear(); }); }
    }
    // --- สกิลติดตัว (passive แบบเลเวลได้) — ตัวใหม่เฉพาะเมื่อยังไม่เต็มโควตา ---
    for(const key in PASSIVES){ const d=PASSIVES[key], cur=this.passives[key]||0;
      if(cur===0){ if(pasOwned<PASSIVE_CAP) P(d.color,d.emoji,d.name,'✨ ติดตัวใหม่ — '+d.desc,()=>{ this.passives[key]=1; d.apply(this.player); }); }
      else if(cur<d.max){ P(d.color,d.emoji,d.name+' → Lv'+(cur+1),'🔺 '+d.desc,()=>{ this.passives[key]++; d.apply(this.player); }); }
    }
    Phaser.Utils.Array.Shuffle(skillPool); Phaser.Utils.Array.Shuffle(passPool); Phaser.Utils.Array.Shuffle(awakenPool);
    const out=[];
    // 1) การันตีสกิลขั้นสุด (Awaken) อย่างน้อย 1 ใบเสมอถ้ามีสิทธิ์ (เดิมเจอยากมาก)
    if(awakenPool.length) out.push(awakenPool.shift());
    // 2) เติมด้วยสกิลโจมตีเป็นหลัก
    for(const o of skillPool){ if(out.length>=n) break; out.push(o); }
    // 3) เว้นที่ให้สกิลติดตัวอย่างน้อย 1 ใบเสมอ (ถ้ามีให้เลือก)
    if(passPool.length && !out.some(o=>o.pas)){
      if(out.length<n) out.push(passPool[0]);
      else out[out.length-1]=passPool[0];   // สลับใบสุดท้ายเป็น passive (awaken ที่การันตีไว้ยังอยู่)
    }
    // 4) เติมช่องที่เหลือด้วยของสำรองทั้งหมด กันการ์ดไม่ครบตอนตัวเลือกน้อย
    for(const o of [...skillPool, ...passPool, ...awakenPool]){ if(out.length>=n) break; if(!out.includes(o)) out.push(o); }
    Phaser.Utils.Array.Shuffle(out);
    return out.slice(0,n);
  }
  rebuildRing(){
    this.ringBalls.forEach(b=>b.destroy()); this.ringBalls=[];
    const lvl=this.skills.star||0; if(lvl<1)return;
    const aw=lvl>=SKILL_AWAKEN_LV;            // ตื่นรู้: วงกาแล็กซี 3 ชั้น
    const count=aw?12:2+lvl;                  // L1=3 ... L6=8 · Awaken=12 ดวง
    const rOuter=aw?78:48+lvl*3;              // L3 วงกว้างขึ้น
    const rMid=rOuter*0.72, rInner=rOuter*0.5;
    const twoRing=lvl>=6&&!aw;                // L6 วงคู่
    const size=(1.8+lvl*0.12)*(aw?1.35:1);    // ดวงใหญ่ขึ้น
    const spark=lvl>=5;                       // L5 กระจายประกายเมื่อชน
    this.ringSpin=aw?4.6:2.6+lvl*0.28;        // L3 หมุนเร็วขึ้น · Awaken หมุนไวมาก
    for(let i=0;i<count;i++){
      const tier=aw?(i%3):(twoRing?(i%2===0?0:2):0);   // aw: 3 ชั้น (0=นอก,1=กลาง,2=ใน)
      const rr=tier===0?rOuter:tier===1?rMid:rInner;
      const b=this.camWorld(this.physics.add.image(0,0,'dot').setTint(tier===0?0xffe08a:tier===1?0xffd0e8:0xfff2a8).setScale(size).setDepth(88000));
      b.setCircle(5); b.body.setAllowGravity(false); b.dmg=(4+lvl*1.5)*(aw?1.6:1); b.hitCd=0;
      b.rr=rr; b.ang0=(i/count)*Math.PI*2;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{ if(ball.hitCd>0)return; ball.hitCd=0.12;
        this.damage(en,ball.dmg*this.player.dmgMul,ball.x,ball.y);
        if(spark)this.burst(ball.x,ball.y,0xffe08a); });
      this.ringBalls.push(b);
    }
  }

  /* ---------- SPAWN ---------- */
  spawnEnemy(type){
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.62+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false);
    const key=type==='fast'?'e_fast':type==='shooter'?'e_shooter':type==='bomber'?'e_bomber':type==='tank'?'e_tank':'e_basic';
    if(!e) e=this.enemies.create(x,y,key);
    else { e.setTexture(key); e.setActive(true).setVisible(true); e.body.enable=true; e.setPosition(x,y); }
    // สเกลตามด่าน+เวฟ (ยิ่งลึกยิ่งอึด/ดาเมจสูง)
    const s=(1+(this.stageIndex||0)*0.55)*(1+(this.waveIndex||0)*0.11);
    e.shooter=false; e.bomber=false; e.shootCd=0;
    if(type==='fast'){ e.hp=10*s; e.spd=122; e.dmg=9; e.xp=1; e.setCircle(15,4,4); }
    else if(type==='tank'){ e.hp=80*s; e.spd=36; e.dmg=18; e.xp=4; e.setCircle(26,5,5); }
    else if(type==='shooter'){ e.hp=19*s; e.spd=62; e.dmg=9; e.xp=2; e.shooter=true; e.shootCd=Phaser.Math.FloatBetween(1.1,2.0); e.setCircle(17,5,5); }
    else if(type==='bomber'){ e.hp=24*s; e.spd=70; e.dmg=12; e.xp=2; e.bomber=true; e.setCircle(17,5,5); }
    else { e.hp=19*s; e.spd=58; e.dmg=10; e.xp=1; e.setCircle(17,5,5); }
    e.isBoss=false; e.isMini=false; e.isElite=false; e.maxhp=e.hp; e.frozen=0; e.knock=0; e.setScale(1).clearTint();
    this.camWorld(e);   // รูปจริงมีสีในตัวแล้ว ไม่ต้องย้อม
  }

  /* ---------- COMBAT ---------- */
  getBullet(x,y,tint,scale){
    let b=this.bullets.getFirstDead(false);
    if(!b) b=this.bullets.create(x,y,'spark');
    else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(x,y); }
    b.setScale(scale||1).setTint(tint||0xffffff).setRotation(0).setDepth(90000); b.body.setAllowGravity(false); this.camWorld(b);
    b.pierce=false; b.hitCd=0; b.hitGapV=0.16; b.boomer=false; b.returned=false;
    b.bounce=0; b.rebound=false; b.reb=0; b.spin=false; b.homing=0; b.explode=0;
    return b;
  }
  // คูลดาวน์เกือบคงที่ — เลเวลอัพเน้น "เอฟเฟกต์" ไม่ใช่ยิงถี่ขึ้น
  cdOf(key,lvl){
    if(lvl>=7) return this._cdBase(key,6)*0.62;   // ตื่นรู้ (Awaken): ร่ายถี่ขึ้นมาก
    return this._cdBase(key,lvl);
  }
  _cdBase(key,lvl){
    switch(key){
      case 'sprinkle': return Math.max(0.5,0.82-lvl*0.03);
      case 'chili':    return Math.max(1.6,2.2-lvl*0.06);
      case 'thunder':  return Math.max(1.2,1.9-lvl*0.07);
      case 'whirl':    return Math.max(1.8,2.6-lvl*0.08);
      case 'boomer':   return Math.max(1.4,2.1-lvl*0.06);
      case 'frost':    return Math.max(3.0,4.0-lvl*0.12);
      case 'popcorn':  return Math.max(0.7,1.1-lvl*0.05);
      case 'bubble':   return Math.max(1.4,2.2-lvl*0.1);
      case 'aura':     return Math.max(0.7,1.1-lvl*0.05);
      case 'fork':     return Math.max(1.2,1.8-lvl*0.08);
      case 'mine':     return Math.max(1.8,2.6-lvl*0.1);
      case 'beam':     return Math.max(1.0,1.6-lvl*0.08);
      case 'meteor':   return Math.max(1.6,2.4-lvl*0.1);
      case 'cloud':    return Math.max(2.0,3.0-lvl*0.1);
      case 'rocket':   return Math.max(1.2,1.8-lvl*0.08);
      case 'wave':     return Math.max(1.4,2.2-lvl*0.08);
      default: return 1.6;
    }
  }
  castSkill(key,lvl){
    const dm=this.player.dmgMul, cf=this.comboFlags||{}, aw=lvl>=SKILL_AWAKEN_LV; this.pulseSkill(key);
    if(aw&&Math.random()<0.5)this.awakenSpark(key);   // ประกายบอกว่าสกิลตื่นรู้
    if(key==='sprinkle'){ const t=this.nearestEnemy(aw?900:640); if(!t)return;
      const shots=aw?8:lvl>=6?5:lvl>=4?3:lvl>=2?2:1;   // เพิ่มลำที่ L2/L4/L6 · Awaken=8
      const pierce=lvl>=3||aw; let bounce=lvl>=5?2:0; if(cf.ricochet)bounce+=1; if(aw)bounce+=2;  // L3 ทะลุ / L5 เด้ง / combo / Awaken เด้งเยอะ+ไล่เป้า
      const spread=shots>1?(aw?0.42:0.20):0;
      for(let s=0;s<shots;s++){ const off=(s-(shots-1)/2)*spread, ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+off;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffe08a:(lvl>=6?0xffb6e1:0xffffff),(1+lvl*0.12)*(aw?1.3:1));
        b.dmg=(5+lvl*1.6)*dm*(aw?1.5:1); b.life=aw?1.6:1.2; b.pierce=pierce; b.bounce=bounce; if(aw)b.homing=260;
        this.physics.velocityFromRotation(ang,470,b.body.velocity); } Sfx.shoot(); }
    else if(key==='chili'){ const rings=aw?5:lvl>=6?3:lvl>=3?2:1, baseR=(80+lvl*14)*(cf.firestorm?1.2:1)*(aw?1.7:1), dmg=(8+lvl*2.4)*dm*(aw?1.6:1), knock=lvl>=4||aw;
      for(let ri=0;ri<rings;ri++){ const r=baseR*(1-ri*(aw?0.16:0.26));
        const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,10,ri%2?0xffb15a:0xff7a4d,0.4).setDepth(3));
        this.tweens.add({targets:ring,radius:r,alpha:0,duration:300+ri*70,onComplete:()=>ring.destroy()}); }
      if(lvl>=6||aw)this.cameras.main.shake(aw?220:120,aw?0.011:0.005);
      this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<baseR){
        this.damage(e,dmg,e.x,e.y);
        if(knock&&!e.isBoss){ const a=Math.atan2(e.y-this.player.y,e.x-this.player.x); e.setVelocity(Math.cos(a)*300,Math.sin(a)*300); e.knock=0.2; } }});
      Sfx.boom(); }
    else if(key==='thunder'){ const strikes=aw?8:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, chain=aw?3:lvl>=5?2:lvl>=3?1:0, dmg=(10+lvl*3.4)*dm*(cf.storm?1.4:1)*(aw?1.4:1);
      const cand=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<(aw?760:520)) cand.push(e); });
      Phaser.Utils.Array.Shuffle(cand);
      for(let i=0;i<Math.min(strikes,cand.length);i++){ let e=cand[i]; this.zap(e.x,e.y); this.damage(e,dmg,e.x,e.y);
        let from=e; const hit=new Set([e]);
        for(let c=0;c<chain;c++){ let nb=null,nd=(aw?210:150)**2;
          this.enemies.children.iterate(o=>{ if(o&&o.active&&!hit.has(o)){ const d=(o.x-from.x)**2+(o.y-from.y)**2; if(d<nd){nd=d;nb=o;} } });
          if(!nb)break; this.chainBolt(from.x,from.y,nb.x,nb.y); this.damage(nb,dmg*0.7,nb.x,nb.y); hit.add(nb); from=nb; } }
      Sfx.zap(); }
    else if(key==='whirl'){ const cnt=aw?16:lvl>=6?12:lvl>=4?10:lvl>=2?8:6, dmg=(4+lvl*1.8)*dm*(cf.firestorm?1.3:1)*(aw?1.5:1);
      const big=((lvl>=3?1.4:1.1)+(cf.firestorm?0.3:0))*(aw?1.5:1), speed=(lvl>=3?340:300)*(aw?1.2:1), pierce=lvl>=6||aw, tint=aw?0xffd166:(cf.firestorm?0xffa54d:0x8fd0ff); this.whirlAng+=0.5;
      for(let i=0;i<cnt;i++){ const ang=this.whirlAng+(i/cnt)*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,tint,big); b.dmg=dmg; b.life=aw?1.3:0.95; b.pierce=pierce; b.hitGapV=0.14;
        this.physics.velocityFromRotation(ang,speed,b.body.velocity); } Sfx.shoot(); }
    else if(key==='boomer'){ const cnt=aw?6:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, dmg=(8+lvl*2.6)*dm*(aw?1.4:1);
      const big=(1.4+lvl*0.1)*(aw?1.4:1), rebound=lvl>=5||aw; let gap=lvl>=3?0.10:0.16; if(cf.ricochet)gap*=0.7; if(aw)gap*=0.7;
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(760);
        const base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle(), ang=base+(s-(cnt-1)/2)*0.4;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffcf70:0xd9a066,big); b.dmg=dmg; b.life=2.0; b.pierce=true; b.hitGapV=gap;
        b.boomer=true; b.bt=0; b.bdur=0.44; b.rebound=rebound; b.spin=true; if(aw)b.reb=-1;   // reb=-1 → เด้งได้ 2 รอบ (0,1)
        this.physics.velocityFromRotation(ang,430,b.body.velocity); } Sfx.shoot(); }
    else if(key==='frost'){ const r=(140+lvl*14)*(aw?2.6:1), dur=(1+lvl*0.22)*(aw?1.6:1), dmg=(lvl>=3||aw)?(6+lvl*2)*dm*(aw?1.8:1):0, shatter=lvl>=5||aw;
      const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,12,COLORS.ice,0.4).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:320,onComplete:()=>ring.destroy()});
      this.enemies.children.iterate(e=>{ if(e&&e.active&&(aw||(!e.isBoss&&!e.isMini))&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){
        if(shatter&&e.frozen>0){ this.damage(e,(14+lvl*3)*dm,e.x,e.y); this.burst(e.x,e.y,0x8fd0ff); }
        if(!e.isBoss&&!e.isMini){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }
        if(dmg>0)this.damage(e,dmg,e.x,e.y); } }); Sfx.frost(); }
    else if(key==='popcorn'){ const cnt=aw?20:lvl>=6?10:lvl>=4?8:lvl>=2?6:4, dmg=(4+lvl*1.5)*dm*(cf.fizz?1.25:1)*(aw?1.5:1);
      const pierce=lvl>=4||aw, big=(lvl>=3?1.3:1.0)*(cf.fizz?1.25:1)*(aw?1.4:1), speed=(lvl>=5?420:340)*(aw?1.3:1);
      for(let i=0;i<cnt;i++){ const ang=Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffe0a0:0xfff0c2,big); b.dmg=dmg; b.life=aw?1.1:0.8; b.pierce=pierce; b.hitGapV=0.12;
        this.physics.velocityFromRotation(ang,speed*(0.7+Math.random()*0.5),b.body.velocity); } Sfx.shoot(); }
    else if(key==='bubble'){ const cnt=aw?8:lvl>=6?5:lvl>=4?3:lvl>=2?2:1, dmg=(7+lvl*2)*dm*(cf.fizz?1.25:1)*(aw?1.4:1);
      const pierce=lvl>=5||aw, big=(lvl>=3?1.5:1.2)*(cf.fizz?1.25:1)*(aw?1.3:1);
      for(let s=0;s<cnt;s++){ const ang=Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xd8f4ff:0xbfe8ff,big); b.dmg=dmg; b.life=2.3; b.pierce=pierce; b.hitGapV=0.2; b.homing=(aw?420:(lvl>=4?300:200));
        this.physics.velocityFromRotation(ang,200,b.body.velocity); } Sfx.shoot(); }
    else if(key==='aura'){ const r=((60+lvl*16)*(aw?1.7:1)), dmg=(5+lvl*2)*dm*(aw?1.6:1);
      const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,r,0xff9ec4,0.10).setDepth(3).setStrokeStyle(2,0xffb6e1,0.55));
      this.tweens.add({targets:ring,alpha:0,scale:1.06,duration:300,onComplete:()=>ring.destroy()});
      this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){ this.damage(e,dmg,e.x,e.y);
        if(aw&&!e.isBoss){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); e.setVelocity(Math.cos(a)*140,Math.sin(a)*140); e.knock=0.15; } } }); }
    else if(key==='fork'){ const cnt=aw?10:lvl>=6?5:lvl>=4?4:lvl>=2?3:2, dmg=(9+lvl*3)*dm*(aw?1.4:1);
      const t=this.nearestEnemy(760), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
      for(let s=0;s<cnt;s++){ const ang=aw?base+(s/cnt)*Math.PI*2:base+(s-(cnt-1)/2)*0.16;
        const b=this.getBullet(this.player.x,this.player.y,0xeaeaff,1.15+lvl*0.08); b.dmg=dmg; b.life=1.4; b.pierce=true; b.hitGapV=0.12; b.spin=true;
        this.physics.velocityFromRotation(ang,560,b.body.velocity); } Sfx.shoot(); }
    else if(key==='mine'){ const cnt=aw?4:lvl>=4?2:1, r=(70+lvl*10)*(aw?1.4:1), dmg=(20+lvl*6)*dm*(aw?1.5:1);
      for(let m=0;m<cnt;m++){ const mx=this.player.x+Phaser.Math.Between(-40,40), my=this.player.y+Phaser.Math.Between(-40,40);
        const mine=this.camWorld(this.add.circle(mx,my,7,0xffb6e1,0.9).setDepth(3).setStrokeStyle(2,0xff8fb5,1));
        this.tweens.add({targets:mine,scale:{from:0.6,to:1.1},yoyo:true,repeat:-1,duration:360});
        this.time.delayedCall(1300,()=>{ if(this.state!=='play'&&this.state!=='levelup'){ mine.destroy(); return; }
          this.tweens.killTweensOf(mine); mine.destroy();
          const ring=this.camWorld(this.add.circle(mx,my,10,0xff9ec4,0.5).setDepth(3));
          this.tweens.add({targets:ring,radius:r,alpha:0,duration:280,onComplete:()=>ring.destroy()});
          this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,mx,my)<r) this.damage(e,dmg,e.x,e.y); }); Sfx.boom(); }); } }
    else if(key==='beam'){ const t=this.nearestEnemy(900); if(!t)return;
      const beams=aw?3:1, len=(760+lvl*30)*(aw?1.25:1), wide=(12+lvl*3)*(aw?1.4:1), dmg=(11+lvl*3.6)*dm*(aw?1.4:1);
      const base=Math.atan2(t.y-this.player.y,t.x-this.player.x);
      for(let k=0;k<beams;k++) this.fireBeam(base+(k-(beams-1)/2)*0.18,len,wide,dmg); Sfx.zap(); }
    else if(key==='meteor'){ const n=aw?10:lvl>=6?6:lvl>=4?4:lvl>=2?3:2, r=(58+lvl*8)*(aw?1.3:1), dmg=(14+lvl*4)*dm*(aw?1.4:1);
      const cands=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<560)cands.push(e); });
      for(let i=0;i<n;i++){ let tx,ty; if(cands.length){ const e=cands[Math.floor(Math.random()*cands.length)]; tx=e.x+Phaser.Math.Between(-24,24); ty=e.y+Phaser.Math.Between(-24,24); }
        else { tx=this.player.x+Phaser.Math.Between(-220,220); ty=this.player.y+Phaser.Math.Between(-220,220); }
        this.meteorStrike(tx,ty,r,dmg,i*70); } Sfx.shoot(); }
    else if(key==='cloud'){ const t=this.nearestEnemy(620)||this.player, cx=t.x, cy=t.y;
      const r=(70+lvl*12)*(aw?1.5:1), dmg=(3+lvl*1.2)*dm*(aw?1.6:1), dur=(aw?4:2+lvl*0.3);
      const cloud=this.camWorld(this.add.circle(cx,cy,r,0x9a7ce6,0.16).setDepth(2).setStrokeStyle(2,0xb79ae8,0.45));
      this.tweens.add({targets:cloud,scale:{from:0.5,to:1},duration:300});
      const ticks=Math.max(1,Math.floor(dur/0.3));
      for(let k=1;k<=ticks;k++) this.time.delayedCall(k*300,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r) this.damage(e,dmg,e.x,e.y); }); });
      this.tweens.add({targets:cloud,alpha:0,delay:Math.max(0,dur*1000-350),duration:400,onComplete:()=>cloud.destroy()}); Sfx.frost(); }
    else if(key==='rocket'){ const cnt=aw?6:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, dmg=(10+lvl*3)*dm*(aw?1.4:1), er=(50+lvl*6)*(aw?1.4:1);
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(780), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
        const b=this.getBullet(this.player.x,this.player.y,0xff8b6b,1.3+lvl*0.08); b.dmg=dmg; b.life=2.2; b.homing=(aw?400:280); b.explode=er; b.spin=true;
        this.physics.velocityFromRotation(base+(s-(cnt-1)/2)*0.3,300,b.body.velocity); } Sfx.shoot(); }
    else if(key==='wave'){ const rings=aw?3:1, maxR=(150+lvl*20)*(aw?1.4:1), dmg=(8+lvl*2.6)*dm*(aw?1.4:1);
      for(let k=0;k<rings;k++) this.creamWave(maxR,dmg,k*180); Sfx.boom(); }
  }
  fireBeam(ang,len,wide,dmg){
    const px=this.player.x, py=this.player.y;
    const g=this.camWorld(this.add.rectangle(px,py,len,wide,0xffe08a,0.75).setOrigin(0,0.5).setDepth(6)); g.setRotation(ang);
    this.tweens.add({targets:g,alpha:0,scaleY:0.3,duration:260,onComplete:()=>g.destroy()});
    const dx=Math.cos(ang),dy=Math.sin(ang);
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-px, ry=e.y-py;
      const proj=rx*dx+ry*dy; if(proj<0||proj>len)return; if(Math.abs(-rx*dy+ry*dx)<wide/2+16) this.damage(e,dmg,e.x,e.y); });
  }
  meteorStrike(x,y,r,dmg,delay){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const warn=this.camWorld(this.add.circle(x,y,r,0xffb15a,0.14).setDepth(2).setStrokeStyle(2,0xffb15a,0.6));
      const don=this.camWorld(this.add.circle(x,y-260,9,0xd9a066,1).setDepth(7).setStrokeStyle(3,0xa6702e,1));
      this.tweens.add({targets:don,y:y,duration:300,ease:'Quad.in',onComplete:()=>{ don.destroy(); warn.destroy();
        const boom=this.camWorld(this.add.circle(x,y,10,0xffcf70,0.5).setDepth(3));
        this.tweens.add({targets:boom,radius:r,alpha:0,duration:260,onComplete:()=>boom.destroy()});
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r) this.damage(e,dmg,e.x,e.y); });
        this.cameras.main.shake(80,0.004); Sfx.boom(); }}); });
  }
  creamWave(maxR,dmg,delay){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const px=this.player.x, py=this.player.y, hit=new Set();
      const ring=this.camWorld(this.add.circle(px,py,10,0xbfe8ff,0).setDepth(3).setStrokeStyle(5,0xffffff,0.85));
      this.tweens.add({targets:ring,radius:maxR,alpha:{from:0.9,to:0},duration:420,ease:'Quad.out',
        onUpdate:()=>{ const rr=ring.radius; this.enemies.children.iterate(e=>{ if(e&&e.active&&!hit.has(e)){ const d=this.dist(e.x,e.y,px,py);
          if(d<rr&&d>rr-46){ hit.add(e); this.damage(e,dmg,e.x,e.y); if(!e.isBoss){ const a=Math.atan2(e.y-py,e.x-px); e.setVelocity(Math.cos(a)*260,Math.sin(a)*260); e.knock=0.2; } } } }); },
        onComplete:()=>ring.destroy() }); });
  }
  explodeAt(x,y,r,dmg){ const ring=this.camWorld(this.add.circle(x,y,10,0xffb08a,0.5).setDepth(3));
    this.tweens.add({targets:ring,radius:r,alpha:0,duration:240,onComplete:()=>ring.destroy()}); this.burst(x,y,0xff8b6b);
    this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r) this.damage(e,dmg,e.x,e.y); }); Sfx.boom(); }
  // ประกายวาววับตอนสกิลตื่นรู้ (Awaken) ทำงาน
  awakenSpark(key){ const c=this.camWorld(this.add.circle(this.player.x,this.player.y,8,0xfff2a8,0.8).setDepth(6));
    this.tweens.add({targets:c,radius:34,alpha:0,duration:280,onComplete:()=>c.destroy()}); }
  chainBolt(x1,y1,x2,y2){
    const g=this.camWorld(this.add.graphics().setDepth(7)); g.lineStyle(2.5,0xbfe3ff,1);
    g.beginPath(); g.moveTo(x1,y1);
    const mx=(x1+x2)/2+Phaser.Math.Between(-12,12), my=(y1+y2)/2+Phaser.Math.Between(-12,12);
    g.lineTo(mx,my); g.lineTo(x2,y2); g.strokePath();
    this.tweens.add({targets:g,alpha:0,duration:180,onComplete:()=>g.destroy()});
  }
  zap(x,y){
    const g=this.camWorld(this.add.graphics().setDepth(7)); g.lineStyle(3,0xfff2a8,1);
    g.beginPath(); g.moveTo(x,y-260); g.lineTo(x+Phaser.Math.Between(-14,14),y-130); g.lineTo(x,y); g.strokePath();
    const fl=this.camWorld(this.add.circle(x,y,22,0xfff2a8,0.6).setDepth(7));
    this.tweens.add({targets:[g,fl],alpha:0,duration:200,onComplete:()=>{ g.destroy(); fl.destroy(); }});
  }
  nearestEnemy(maxD){ let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2; if(d<bd){bd=d;best=e;} });
    return best; }
  hitEnemy(bullet,enemy){ if(!bullet.active||!enemy.active)return;
    if(bullet.pierce){ if(bullet.hitCd>0)return; bullet.hitCd=bullet.hitGapV||0.16; this.damage(enemy,bullet.dmg,bullet.x,bullet.y); return; }
    this.damage(enemy,bullet.dmg,bullet.x,bullet.y);
    if(bullet.explode){ this.explodeAt(bullet.x,bullet.y,bullet.explode,bullet.dmg*0.8); this.killBullet(bullet); return; }   // จรวดระเบิด AoE
    if(bullet.bounce>0){ bullet.bounce--;
      let nb=null,nd=360*360;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==enemy){ const d=(o.x-bullet.x)**2+(o.y-bullet.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(nb){ const sp=bullet.body.velocity.length()||460, ang=Math.atan2(nb.y-bullet.y,nb.x-bullet.x);
        this.physics.velocityFromRotation(ang,sp,bullet.body.velocity); return; } }
    this.killBullet(bullet); }
  damage(e,amount,x,y){ if(!e.active)return;
    let crit=false; if(this.player.critChance && Math.random()<this.player.critChance){ amount*=(this.player.critMul||1.8); crit=true; }
    e.hp-=amount;
    e.setTintFill(crit?0xffe08a:0xffffff); this.time.delayedCall(60,()=>{ if(!e.active)return;
      if(e.frozen) e.setTint(COLORS.ice); else if(e.isMini&&e.tintColor) e.setTint(e.tintColor); else e.clearTint(); });  // รูปจริงมีสีในตัว
    this.popDmg(Math.round(amount),x,y,crit); if(e.hp<=0) this.killEnemy(e); }
  killEnemy(e){ this.kills++; this.killTxt.setText('☠ '+this.kills);
    if(this.player.lifesteal) this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.lifesteal);   // ดูดเลือด (พรสวรรค์)
    const isBoss=e.isBoss, isMini=e.isMini, isElite=e.isElite, big=isBoss||isMini; if(!big) Sfx.pop();
    this.burst(e.x,e.y,big?0xffd166:(isElite?0xffb15a:(e.texture.key==='e_tank'?0x8b5cf0:0xffd166)));
    if(big){ this.cameras.main.shake(isBoss?400:220,isBoss?0.012:0.008); this.burst(e.x,e.y,0xff9ec4); if(isMini)Sfx.clear(); }
    if(e._aura){ e._aura.destroy(); e._aura=null; }   // เก็บออร่าคลั่ง
    if(isBoss) this.bossDefeat(e.x,e.y);   // ฉากบอสตายอลังการ
    this.dropOrb(e.x,e.y,e.xp||1);   // ออร์บเดียวต่อศัตรู · สีบอกค่า EXP (ไม่สแปมหลายเม็ด)
    if(isBoss||isMini||(isElite&&Math.random()<0.5)||(!big&&Math.random()<0.03)) this.dropHeal(e.x+Phaser.Math.Between(-10,10),e.y+Phaser.Math.Between(-10,10));  // ไอเทมฟื้นฟู (บอส/มินิแน่นอน · elite 50% · ธรรมดา 3%)
    // bomber: ระเบิดตอนตาย (เตือนสั้น ๆ ด้วยวง แล้วโดนถ้าอยู่ใกล้)
    if(e.bomber){ const bx=e.x,by=e.y, r=70;
      const ring=this.camWorld(this.add.circle(bx,by,10,0xff7a4d,0.5).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:260,onComplete:()=>ring.destroy()});
      this.burst(bx,by,0xff8b6b); Sfx.boom();
      if(this.dist(this.player.x,this.player.y,bx,by)<r) this.hurtPlayer(Math.round(12+this.stageIndex*4),0.5); }
    // เก็บ Sugar (สกุลเงินเมต้า ใช้รอบหน้า)
    const sug=isBoss?40:isMini?18:isElite?4:1; this.sugarStage+=sug; this.sugarRun+=sug;
    e.setActive(false).setVisible(false); e.body.enable=false; e.isBoss=false; e.isMini=false; e.isElite=false; e.shooter=false; e.bomber=false; e.setScale(1);
    this.waveAlive=Math.max(0,(this.waveAlive||0)-1);
    if(isBoss){ this.onStageClear(); return; }
    if(this.state==='play' && (this.mode==='wave'||this.mode==='mini')){ this.updateWaveText();
      if(this.waveAlive<=0) this.onWaveCleared(); } }
  killBullet(b){ b.setActive(false).setVisible(false); b.body.enable=false; b.body.stop(); }
  // สีออร์บตามค่า EXP: ยิ่งค่ามาก สียิ่งพรีเมียม (เขียว→ฟ้า→ม่วง→ทอง) + เม็ดใหญ่ขึ้น
  orbStyle(v){
    if(v>=20) return {tint:0xffd75e, sc:1.7};   // ทอง = ค่าสูงสุด (บอส)
    if(v>=10) return {tint:0xb98cff, sc:1.45};  // ม่วง
    if(v>=5)  return {tint:0x7fc9ff, sc:1.25};  // ฟ้า
    if(v>=2)  return {tint:0x8be6a4, sc:1.1};   // เขียว
    return {tint:0xffffff, sc:1.0};              // ขาว/ชมพู = 1 (ปกติ)
  }
  dropOrb(x,y,value){ value=value||1; let o=this.orbs.getFirstDead(false);
    if(!o) o=this.orbs.create(x,y,'candy'); else { o.setActive(true).setVisible(true); o.body.enable=true; o.setPosition(x,y); }
    const st=this.orbStyle(value); o.value=value; o.setTint(st.tint); o._sc=st.sc; o.setRotation(0).setDepth(80000);
    o.body.setAllowGravity(false); o.setScale(st.sc); this.camWorld(o); }
  collectOrb(player,o){ if(!o.active)return; o.setActive(false).setVisible(false); o.body.enable=false; o.clearTint(); Sfx.xp(); this.jelly(0.9,-0.9); this.gainXp(o.value||1); }
  // ---- ไอเทมฟื้นฟู HP ----
  dropHeal(x,y){ let h=this.heals.getFirstDead(false);
    if(!h) h=this.heals.create(x,y,'heal'); else { h.setActive(true).setVisible(true); h.body.enable=true; h.setPosition(x,y); }
    h.body.setAllowGravity(false); h.setScale(1); this.camWorld(h); if(this.iso)h.setDepth(h.y);
    this.tweens.add({targets:h,y:y-6,duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectHeal(player,h){ if(!h.active)return; this.tweens.killTweensOf(h); h.setActive(false).setVisible(false); h.body.enable=false;
    const amt=Math.round(this.player.maxhp*0.18)+6; this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);
    Sfx.heal(); this.jelly(0,2.2); this.popHeal(this.player.x,this.player.y,amt); this.burst(h.x,h.y,0xff8fb5); }
  popHeal(x,y,n){ const t=this.camWorld(this.add.text(x,y-20,'+'+n+' HP',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#8bffb0'}).setDepth(20).setOrigin(0.5));
    this.tweens.add({targets:t,y:y-56,alpha:0,duration:700,onComplete:()=>t.destroy()}); }
  // ---- กล่อง/โหลทุบได้ (ธีมครัว) ----
  spawnCrate(){ const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*(0.25+Math.random()*0.3);
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let c=this.crates.getFirstDead(false);
    if(!c) c=this.crates.create(x,y,'crate'); else { c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    c.body.setAllowGravity(false); c.body.setImmovable(true); c.setCircle(18,4,4); c.hp=20+this.stageIndex*10; c.setScale(1).clearTint(); this.camWorld(c); if(this.iso)c.setDepth(c.y);
    this.tweens.add({targets:c,scale:{from:0.2,to:1},duration:220,ease:'Back.out'}); }
  hitCrate(bullet,c){ if(!c.active||!bullet.active)return;
    c.hp-=(bullet.dmg||5)*this.player.dmgMul; c.setTintFill(0xffffff); this.time.delayedCall(50,()=>{ if(c.active)c.clearTint(); });
    if(!bullet.pierce) this.killBullet(bullet);
    if(c.hp<=0) this.breakCrate(c); }
  breakCrate(c){ const x=c.x,y=c.y; c.setActive(false).setVisible(false); c.body.enable=false;
    this.burst(x,y,0xe59a4d); Sfx.boom(); this.cameras.main.shake(90,0.004);
    this.dropOrb(x,y, 3+Phaser.Math.Between(0,this.stageIndex*2));   // ดรอปออร์บ
    if(Math.random()<0.5) this.dropHeal(x+Phaser.Math.Between(-12,12),y+Phaser.Math.Between(-12,12));   // ครึ่งนึงดรอปฟื้นฟู
    if(Math.random()<0.25) this.sugarStage+=3;
  }
  touchEnemy(player,e){ if(!e.active||this.player.iframe>0)return;
    this.player.iframe=0.6; this.player.hp-=e.dmg*(this.player.dmgTakenMul||1); Sfx.hurt(); this.cameras.main.shake(120,0.008);
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>this.player.clearTint());
    this._sqX=0.7; this._sqY=1.3; this.poseFlash(CF.hurt,260);   // โดนตี = หน้าเจ็บ (เจลลี่แบน)
    const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x); this.player.setVelocity(Math.cos(ang)*260,Math.sin(ang)*260); this.dashTime=0.12;
    if(this.player.hp<=0) this.die(); }
  // โดนกระสุน/สแลม/hazard ของศัตรู (iframe สั้นกว่า → หลบยาก)
  hurtPlayer(dmg,ix){ if(this.state!=='play'||this.player.iframe>0)return;
    dmg*=(this.player.dmgTakenMul||1);   // เกราะ (พรสวรรค์ mint)
    this.player.iframe=ix||0.5; this.player.hp-=dmg; Sfx.hurt(); this.cameras.main.shake(150,0.009);
    this._sqX=0.72; this._sqY=1.28; this.poseFlash(CF.hurt,260);
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>{ if(this.player.active)this.player.clearTint(); });
    if(this.player.hp<=0) this.die(); }
  hitByFoe(player,b){ if(!b.active)return; this.killFoe(b); this.hurtPlayer(b.dmg||10,0.5); }
  killFoe(b){ b.setActive(false).setVisible(false); if(b.body){ b.body.enable=false; b.body.stop(); } }
  // ยิงกระสุนศัตรู 1 นัด
  foeShot(x,y,ang,speed,dmg,tint,scale){
    let b=this.foeBullets.getFirstDead(false);
    if(!b) b=this.foeBullets.create(x,y,'spark'); else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(x,y); }
    b.setScale(scale||1.4).setTint(tint||0xff6b8a).setDepth(90000); b.body.setAllowGravity(false); b.dmg=dmg; b.life=3.0; this.camWorld(b);
    this.physics.velocityFromRotation(ang,speed,b.body.velocity); return b; }
  // hazard: วงอันตรายบนพื้น (เตือนก่อน → ระเบิด → จาง)
  spawnHazard(x,y,r,dmg,tint){
    const warn=this.camWorld(this.add.circle(x,y,r,tint||0xff5a4d,0.12).setDepth(2).setStrokeStyle(3,tint||0xff5a4d,0.7));
    this.tweens.add({targets:warn,alpha:{from:0.12,to:0.32},duration:260,yoyo:true,repeat:1});
    this.time.delayedCall(760,()=>{ if(this.state!=='play'&&this.state!=='levelup'){ warn.destroy(); return; }
      const boom=this.camWorld(this.add.circle(x,y,r,tint||0xff5a4d,0.5).setDepth(2));
      this.tweens.add({targets:[warn,boom],alpha:0,scale:1.08,duration:280,onComplete:()=>{ warn.destroy(); boom.destroy(); }});
      if(this.dist(this.player.x,this.player.y,x,y)<r+8) this.hurtPlayer(dmg,0.5);
      Sfx.boom(); });
  }
  /* ---------- BOSS AI: แพทเทิร์นโจมตี + เฟส ---------- */
  bossThink(b,dt){
    // หายใจ "มีชีวิต" (สเกลเต้นเบา ๆ) — วิชวลล้วน ไม่กระทบ body
    if(b._baseScale===undefined)b._baseScale=b.scaleX;
    b._breathe=(b._breathe||0)+dt*(b.phase2?5:3.2);
    b.setScale(b._baseScale*(1+Math.sin(b._breathe)*(b.phase2?0.06:0.035)));
    if(b._aura){ b._aura.setPosition(b.x,b.y); b._aura.setScale(1+Math.sin(b._breathe*1.5)*0.12).setAlpha(0.12+Math.abs(Math.sin(b._breathe))*0.1); }  // ออร่าคลั่ง
    if(b.frozen>0)return;
    if(b.atkCd===undefined)b.atkCd=1.6; b.atkCd-=dt;
    // เฟส 2 ตอนเลือดครึ่ง (เร็ว/ดุขึ้น) — เอฟเฟกต์โกรธ
    if(!b.phase2 && b.hp<=b.maxhp*0.5){ b.phase2=true; b.spd*=1.28; b.atkCd=0.6;
      this.showBanner('🔥 บอสโกรธ!','เฟส 2 — โจมตีดุขึ้น!',1500); this.cameras.main.shake(420,0.014); this.screenFlash(0xff4d5a,0.3,420);
      if(!b.atks.includes('nova'))b.atks.push('nova');   // ปลดท่าคลื่นสังหาร
      if(!b._aura) b._aura=this.camWorld(this.add.circle(b.x,b.y,58,0xff5a4d,0.14).setDepth(3));   // ออร่าคลั่งถาวร
      for(let i=0;i<2;i++){ const r=this.camWorld(this.add.circle(b.x,b.y,20,0xff5a4d,0).setDepth(6).setStrokeStyle(4,0xff7a5a,0.9));
        this.tweens.add({targets:r,radius:150,alpha:{from:0.9,to:0},duration:500,delay:i*100,onComplete:()=>r.destroy()}); } }
    // เฟส 3 (บอสใหญ่) ตอนเลือด 25% — คลั่ง
    if(b.isBoss && !b.phase3 && b.hp<=b.maxhp*0.25){ b.phase3=true; b.spd*=1.2; b.atkCd=0.4;
      this.showBanner('💢 คลั่งสุดขีด!','เฟสสุดท้าย — ระวังให้ดี!',1600); this.cameras.main.shake(520,0.016); this.screenFlash(0xff2d4a,0.4,500); }
    if(b.atkCd>0)return;
    const atks=b.atks||['slam']; const pick=atks[Math.floor(Math.random()*atks.length)];
    const dm=1+this.stageIndex*0.12, pw=b.isBoss?1:0.7, fast=b.phase3?0.55:b.phase2?0.75:1;
    if(pick==='slam'){ // สแลม AoE ตรงตำแหน่งผู้เล่น (เตือนก่อน หลบได้) · เฟส 3 = 3 จุด
      const hits=b.phase3?3:1;
      for(let i=0;i<hits;i++){ const tx=this.player.x+Phaser.Math.Between(-i*70,i*70), ty=this.player.y+Phaser.Math.Between(-i*70,i*70);
        this.spawnHazard(tx,ty,80+this.stageIndex*8, Math.round((16+this.stageIndex*6)*pw), 0xff5a4d); }
      b.atkCd=2.2*fast;
    } else if(pick==='radial'){ // ยิงรอบทิศ (เฟส 3 = 2 วงหมุนต่าง)
      const n=(b.isBoss?10:7)+this.stageIndex+(b.phase3?6:0); const spd=150+this.stageIndex*12, dmg=Math.round((8+this.stageIndex*3)*pw);
      const off=Math.random()*Math.PI;
      for(let i=0;i<n;i++) this.foeShot(b.x,b.y,off+(i/n)*Math.PI*2,spd,dmg,0xffa54d);
      if(b.phase3) for(let i=0;i<n;i++) this.foeShot(b.x,b.y,-off+(i/n)*Math.PI*2,spd*0.7,dmg,0xff8fb5);
      Sfx.zap(); b.atkCd=2.4*fast;
    } else if(pick==='aimed'){ // ยิงกระจายเล็งผู้เล่น
      const base=Math.atan2(this.player.y-b.y,this.player.x-b.x), shots=b.phase3?7:b.phase2?5:3, spd=210+this.stageIndex*12, dmg=Math.round((10+this.stageIndex*3)*pw);
      for(let s=0;s<shots;s++) this.foeShot(b.x,b.y,base+(s-(shots-1)/2)*0.20,spd,dmg,0xff6b8a);
      Sfx.zap(); b.atkCd=1.9*fast;
    } else if(pick==='charge'){ // พุ่งชาร์จใส่ผู้เล่น (เตือนด้วยจอวาบ)
      const ang=Math.atan2(this.player.y-b.y,this.player.x-b.x);
      b.setTintFill(0xffffff); this.time.delayedCall(260,()=>{ if(!b.active)return; if(!b.isMini)b.clearTint(); else if(b.tintColor)b.setTint(b.tintColor);
        b.setVelocity(Math.cos(ang)*(560+this.stageIndex*20),Math.sin(ang)*(560+this.stageIndex*20)); b.knock=0.45; });
      b.atkCd=2.8*fast;
    } else if(pick==='summon'){ // เรียกลูกน้อง
      const n=2+this.stageIndex+(b.phase3?2:0); for(let i=0;i<n;i++) this.spawnEnemy(Math.random()<0.5?'fast':'basic');
      Sfx.bossWarn(); b.atkCd=3.2*fast;
    } else if(pick==='nova'){ // คลื่นสังหารขยายจากบอส — ต้องหลบให้อยู่ในวง/นอกวง
      const px=b.x,py=b.y, maxR=220+this.stageIndex*22; let hitOnce=false;
      const ring=this.camWorld(this.add.circle(px,py,20,0xff5a7a,0).setDepth(4).setStrokeStyle(7,0xff8fb5,0.95));
      this.tweens.add({targets:ring,radius:maxR,alpha:{from:0.95,to:0},duration:720,ease:'Quad.out',
        onUpdate:()=>{ const rr=ring.radius, d=this.dist(this.player.x,this.player.y,px,py);
          if(!hitOnce && Math.abs(d-rr)<28){ hitOnce=true; this.hurtPlayer(Math.round((14+this.stageIndex*5)*pw),0.6); } },
        onComplete:()=>ring.destroy() });
      if(b.phase3){ this.time.delayedCall(320,()=>{ if(!b.active)return; let h2=false;
        const r2=this.camWorld(this.add.circle(px,py,20,0xff9ec4,0).setDepth(4).setStrokeStyle(6,0xffd0e8,0.9));
        this.tweens.add({targets:r2,radius:maxR,alpha:{from:0.9,to:0},duration:720,ease:'Quad.out',
          onUpdate:()=>{ const rr=r2.radius,d=this.dist(this.player.x,this.player.y,px,py); if(!h2&&Math.abs(d-rr)<28){ h2=true; this.hurtPlayer(Math.round((14+this.stageIndex*5)*pw),0.6); } },
          onComplete:()=>r2.destroy() }); }); }
      Sfx.zap(); this.cameras.main.shake(160,0.006); b.atkCd=2.6*fast;
    }
  }

  /* ---------- FX ---------- */
  popDmg(n,x,y,crit){ let t=this.dmgPool.pop();
    if(!t){ t=this.add.text(x,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px'}).setDepth(20).setOrigin(0.5); this.camWorld(t); }
    else t.setActive(true).setVisible(true);
    t.setText(crit?(n+'!'):n).setColor(crit?'#ffd23f':'#fff2a8').setFontSize(crit?'22px':'15px').setPosition(x,y-10).setAlpha(1).setScale(crit?1.2:1);
    this.tweens.add({targets:t,y:y-(crit?54:40),alpha:0,duration:crit?620:520,onComplete:()=>{ t.setVisible(false); this.dmgPool.push(t); }}); }
  burst(x,y,color){ for(let i=0;i<7;i++){ const p=this.camWorld(this.add.image(x,y,'dot').setTint(color).setDepth(6).setScale(Phaser.Math.FloatBetween(0.5,1.1)));
    const a=Math.random()*Math.PI*2, s=Phaser.Math.Between(40,150);
    this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:420,onComplete:()=>p.destroy()}); } }
  squash(o,sx,sy){ o.setScale(sx,sy); this.tweens.add({targets:o,scaleX:1,scaleY:1,duration:220,ease:'Back.out'}); }
  // faux-2.5D: วาดเงาวงรีใต้ทุกตัวในเลเยอร์เดียว (เรียกทุกเฟรม)
  drawShadows(){
    const g=this.shadowG; if(!g)return; g.clear(); g.fillStyle(0x0a0510,0.28);
    const p=this.player; g.fillEllipse(p.x, p.y+22, 34, 13);
    this.enemies.children.iterate(e=>{ if(e&&e.active){ const w=(e.displayWidth||30); g.fillEllipse(e.x, e.y+(e.displayHeight||30)*0.32, w*0.74, w*0.28); } });
    this.crates.children.iterate(c=>{ if(c&&c.active) g.fillEllipse(c.x, c.y+16, 30, 11); });
    this.heals.children.iterate(h=>{ if(h&&h.active) g.fillEllipse(h.x, h.y+11, 20, 8); });
  }
  // ปรับสเกล+ขอบชนของตัวละครให้เท่ากราฟิกเดิม (60px) ไม่ว่ารูปจริงจะกี่พิกเซล
  setCharScale(key){
    // ขนาด "เฟรม" (สไปรต์สตริปใช้ frame width ไม่ใช่ความกว้างสตริปทั้งแผ่น)
    const src = (ASSET_SHEETS[key]&&ASSET_SHEETS[key].frame)
      || (this.player&&this.player.frame&&this.player.frame.width)
      || 60;
    this._pBase=60/src;                    // โค้ด 60→1 · รูป 128→0.469 (โชว์เท่ากัน)
    this._hasFrames = !!ASSET_SHEETS[key] && this.textures.exists(key) && this.textures.get(key).frameTotal>1;
    if(this._hasFrames){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2,4); this._poseHold=0; }
    const r=24, off=Math.max(0,(src-2*r)/2);
    if(this.player&&this.player.body)this.player.body.setCircle(r,off,off);  // world radius คงที่ 24 (body ไม่สเกลตาม setScale)
  }
  // เลือกเฟรมท่าทาง: พุ่ง=ยืด · โดนตี=ย่อ · ปกติ=ยืน+กะพริบเป็นระยะ (เฉพาะตัวที่มีสไปรต์หลายเฟรม)
  updatePose(dt){
    if(!this._hasFrames)return;
    if(this._poseHold>0){ this._poseHold-=dt; return; }   // ค้างท่า event อยู่ (ยืด/ย่อ)
    // ท่าตามสถานะ
    if(this.dashTime>0){ this.player.setFrame(CF.stretch); return; }
    // กะพริบตาเป็นจังหวะ
    this._blinkT-=dt;
    if(this._blinkT<=0){ this.player.setFrame(CF.blink);
      if(this._blinkT<-0.13){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2.2,4.5); } }
    else this.player.setFrame(CF.idle);
  }
  // สั่งค้างท่า event ชั่วครู่ (ใช้ตอนพุ่ง/โดนตี)
  poseFlash(frame,ms){ if(!this._hasFrames)return; this.player.setFrame(frame); this._poseHold=(ms||160)/1000; }
  // อนิเมชันตัวละคร: สปริงเจลลี่ (เด้งดึ๋งมีโมเมนตัม) + หายใจ + ส่ายตัวเวลาเดิน + เอนตามทิศ
  animatePlayer(dt){
    const p=this.player; if(!p||!p.body)return;
    if(this._sqVX===undefined){ this._sqVX=0; this._sqVY=0; this._wob=0; this._lean=0; }
    // สปริง: ดีดกลับสู่ 1 แบบ underdamped → overshoot เด้งนุ่ม
    const stiff=210, damp=12;
    this._sqVX += (-(this._sqX-1)*stiff - this._sqVX*damp)*dt;
    this._sqVY += (-(this._sqY-1)*stiff - this._sqVY*damp)*dt;
    this._sqX += this._sqVX*dt; this._sqY += this._sqVY*dt;
    // กันหลุดขอบ (นิ่งเมื่อเข้าใกล้ 1)
    this._sqX=Phaser.Math.Clamp(this._sqX,0.55,1.6); this._sqY=Phaser.Math.Clamp(this._sqY,0.55,1.6);
    const sp=p.body.velocity.length(), moving=sp>24;
    // จังหวะเดิน (เด้งถี่+แรงตอนวิ่ง) / หายใจเบา ๆ ตอนอยู่เฉย
    this._wob += dt*(moving?13:3.4);
    const breathe=Math.sin(this._wob)*(moving?0.11:0.05);
    // ส่ายตัว (waddle) + เอนไปทางที่วิ่ง
    const waddle=moving?Math.sin(this._wob*0.5)*0.10:0;
    const leanT=moving?Phaser.Math.Clamp(p.body.velocity.x/1100,-0.16,0.16):0;
    this._lean += (leanT-this._lean)*Math.min(1,dt*7);
    p.rotation = waddle + this._lean;
    const base=this._pBase||1;
    p.setScale(base*this._sqX*(1-breathe), base*this._sqY*(1+breathe));
  }
  // ดีดสปริงตัวละคร (อิมพัลส์นุ่ม ๆ) — vx,vy = แรงกระแทกใส่สเกล X,Y
  jelly(vx,vy){ this._sqVX=(this._sqVX||0)+vx; this._sqVY=(this._sqVY||0)+vy; }

  /* ---------- DEATH ---------- */
  die(){ if(this.state==='dead')return; this.state='dead'; Sfx.bgmIntense(false); Sfx.dead(); Save.addSugar(this.sugarStage); this.gainCharExp(this.kills+this.stageIndex*15); this.sugarStage=0; this.physics.pause(); this.player.setVelocity(0,0);
    if(this._hasFrames){ this.player.setFrame(CF.ko); this.player.setScale(this._pBase||1); this.player.setRotation(0); }   // สลบ (X_X)
    this.buildOver(); }
  buildOver(){ const w=this.W,h=this.H; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.88).setOrigin(0,0);
    const em=this.add.text(w/2,h*0.26,'🫠',{fontSize:'64px'}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.39,'โมจิละลายแล้ว!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'28px',color:'#ff8fb5'}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const stat=this.add.text(w/2,h*0.49,`รอดได้ ${mm}:${ss.toString().padStart(2,'0')}  ·  กำจัด ${this.kills}  ·  Lv ${this.level}`,{fontFamily:'sans-serif',fontSize:'16px',color:'#c7bdd6'}).setOrigin(0.5);
    const btn=this.add.graphics(); btn.fillStyle(COLORS.pink,1); btn.fillRoundedRect(w/2-110,h*0.63-30,220,60,22);
    btn.lineStyle(3,0xffffff,0.3); btn.strokeRoundedRect(w/2-110,h*0.63-30,220,60,22);
    const bt=this.add.text(w/2,h*0.63,'↻ เล่นอีกครั้ง',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    const hint=this.add.text(w/2,h*0.72,'(แตะตรงไหนก็ได้)',{fontFamily:'sans-serif',fontSize:'12px',color:'#9a90ab'}).setOrigin(0.5);
    this.over.add([bg,em,t,stat,btn,bt,hint]); this.over.setVisible(true); }

  /* ---------- UPDATE ---------- */
  update(time,delta){
    const dt=delta/1000; if(this.state!=='play')return; this.elapsed+=dt;

    if(this.joy.active&&(this.joy.dx||this.joy.dy)){ this.moveDir.set(this.joy.dx,this.joy.dy); if(this.moveDir.lengthSq()>0.04)this.moveDir.normalize(); }

    if(this.dashTime>0){ this.dashTime-=dt; if(this.dashTime<=0){ this._sqX=0.8; this._sqY=1.22; this._sqVX=0; this._sqVY=0; this.poseFlash(CF.squash,150); } }  // ลงพื้นหลังพุ่ง = ย่อตัวเด้ง
    else {
      const spd=this.player.baseSpeed;
      if(this.joy.active&&(Math.abs(this.joy.dx)+Math.abs(this.joy.dy))>0.12) this.player.setVelocity(this.joy.dx*spd,this.joy.dy*spd);
      else { this.player.setVelocity(this.player.body.velocity.x*0.8,this.player.body.velocity.y*0.8); if(this.player.body.velocity.length()<8)this.player.setVelocity(0,0); }
    }

    if(this.player.iframe>0)this.player.iframe-=dt;
    if(this.player.regen && this.player.hp<this.player.maxhp) this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.regen*dt);  // ฟื้นตัว (พรสวรรค์)
    if(this.aura)this.aura.setPosition(this.player.x,this.player.y);
    this.animatePlayer(dt); this.updatePose(dt);
    if(this.iso){ this.player.setDepth(this.player.y); this.drawShadows(); }
    if(!this.dashReady){ this.dashCd-=dt; if(this.dashCd<=0)this.dashReady=true; }
    this.dashBtn.setFillStyle(COLORS.mint,this.dashReady?0.28:0.10);
    // active cd (+ ริงคูลดาวน์ + เด้งตอนพร้อม)
    const wasReady=this._actReady;
    if(this.activeCd>0){ this.activeCd-=dt; this.skillBtn.setFillStyle(COLORS.pink,0.10); this.skillCdTxt.setText(Math.ceil(this.activeCd)); this.skillEmoji.setAlpha(0.4); this._actReady=false; }
    else { this.skillBtn.setFillStyle(COLORS.pink,0.22); this.skillCdTxt.setText(''); this.skillEmoji.setAlpha(1); this._actReady=true;
      if(wasReady===false)this.flashBtn(this.skillBtn); }
    this.drawSkillRing();

    // enemies
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(this.iso)e.setDepth(e.y);   // จัดลำดับความลึกตามแกน Y (ตัวล่างจอ = อยู่หน้า)
      if(e.frozen>0){ e.frozen-=dt; e.setVelocity(0,0); if(e.frozen<=0)e.clearTint(); return; }
      if(e.knock>0){ e.knock-=dt; return; }
      const dx=this.player.x-e.x, dy=this.player.y-e.y, ang=Math.atan2(dy,dx);
      if(e.shooter){ e.shootCd-=dt; const d=Math.hypot(dx,dy);
        if(d<300){ e.setVelocity(Math.cos(ang)*e.spd*0.12,Math.sin(ang)*e.spd*0.12);   // ยืนระยะแล้วยิง
          if(e.shootCd<=0){ e.shootCd=Phaser.Math.FloatBetween(1.3,2.2); this.foeShot(e.x,e.y,ang,225+this.stageIndex*15,e.dmg,0xffd27f); Sfx.zap(); }
          return; } }
      e.setVelocity(Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);
    });

    // orb vacuum + ออร์บมีชีวิต (หมุนช้า + เต้นวิบวับ)
    this.orbs.children.iterate(o=>{ if(!o||!o.active)return;
      o.rotation+=dt*2.2; const bob=1+Math.sin(this.elapsed*5+o.x*0.05)*0.12; o.setScale((o._sc||1)*bob);
      const d=this.dist(o.x,o.y,this.player.x,this.player.y);
      if(d<this.player.pickup){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x); o.setVelocity(Math.cos(ang)*380,Math.sin(ang)*380); }
      else o.setVelocity(0,0); });

    // bullets life + boomerang return/rebound + spin + pierce cd
    this.bullets.children.iterate(b=>{ if(!b||!b.active)return;
      b.life-=dt; if(b.hitCd>0)b.hitCd-=dt;
      if(b.spin)b.rotation+=dt*14;
      if(b.homing){ const t=this.nearestEnemy(520); if(t){ const desired=Math.atan2(t.y-b.y,t.x-b.x);
        const cur=Math.atan2(b.body.velocity.y,b.body.velocity.x), turn=b.homing*0.02*dt;
        const d=Phaser.Math.Angle.Wrap(desired-cur), step=Phaser.Math.Clamp(d,-turn,turn);
        this.physics.velocityFromRotation(cur+step,240,b.body.velocity); } }
      if(b.boomer){ b.bt+=dt;
        if(!b.returned && b.bt>=b.bdur){ b.returned=true; const ang=Math.atan2(this.player.y-b.y,this.player.x-b.x); this.physics.velocityFromRotation(ang,480,b.body.velocity); }
        if(b.returned && this.dist(b.x,b.y,this.player.x,this.player.y)<42){
          if(b.rebound && b.reb<1){ b.reb++; b.returned=false; b.bt=0; b.life=1.6;
            const t=this.nearestEnemy(760), ang=t?Math.atan2(t.y-b.y,t.x-b.x):this.moveDir.angle();
            this.physics.velocityFromRotation(ang,440,b.body.velocity); }
          else { this.killBullet(b); return; } } }
      if(b.life<=0)this.killBullet(b); });

    // auto-cast skills tick
    for(const key in this.skills){ if(SKILLDEFS[key].orbit) continue;
      this.skillCd[key]-=dt; if(this.skillCd[key]<=0){ this.castSkill(key,this.skills[key]); this.skillCd[key]=this.cdOf(key,this.skills[key])*(this.player.cdMul||1); } }
    if(this.ringBalls.length){ this.ringRot=(this.ringRot||0)+dt*(this.ringSpin||2.6);
      this.ringBalls.forEach(b=>{ if(b.hitCd>0)b.hitCd-=dt; const a=this.ringRot+(b.ang0||0);
        b.setPosition(this.player.x+Math.cos(a)*(b.rr||54),this.player.y+Math.sin(a)*(b.rr||54)); }); }

    // กระสุนศัตรู (อายุ)
    this.foeBullets.children.iterate(b=>{ if(!b||!b.active)return; b.life-=dt; if(b.life<=0)this.killFoe(b); });

    // boss/mini HP bar + AI แพทเทิร์นโจมตี
    if(this.boss && this.boss.active){
      this.bossThink(this.boss,dt);
      this.bossBar.width=Math.max(0,(this._barW*0.8-4)*(this.boss.hp/this.boss.maxhp));
    }
    this.drawBars();
  }
}

// เรนเดอร์ที่ความละเอียดจริงของจอ (แก้ภาพเบลอบน Retina/high-DPI)
// gameSize = ขนาดจอ × DPR → canvas คมชัด, แล้วชดเชยด้วย camera zoom = DPR
// ปัด DPR เป็นจำนวนเต็ม (เช่น 2.125 → 2) กัน "ชิมเมอร์" ตอนขยับจากสเกลทศนิยม + แคปที่ 3
const RENDER_DPR = Math.max(1, Math.min(Math.round(window.devicePixelRatio||1), 3));
window.__g = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#3a3355',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: Math.round(window.innerWidth*RENDER_DPR),
    height: Math.round(window.innerHeight*RENDER_DPR),
  },
  physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
  render: { antialias:true, roundPixels:false },
  scene: [Boot, Game],
});
// ปรับขนาดตอนหมุนจอ/เปลี่ยนขนาด — debounce กันค่าเพี้ยนช่วงหมุน + อ่านค่าจริงหลังหมุนเสร็จ
let _rzT=null;
function _applyResize(){ const g=window.__g; if(!g||!g.scale)return;
  const w=Math.round(window.innerWidth*RENDER_DPR), h=Math.round(window.innerHeight*RENDER_DPR);
  g.scale.resize(w,h); g.scale.refresh(); }
function _scheduleResize(){ clearTimeout(_rzT); _rzT=setTimeout(_applyResize,160); _applyResize(); }
window.addEventListener('resize', _scheduleResize);
window.addEventListener('orientationchange', ()=>{ setTimeout(_applyResize,60); setTimeout(_applyResize,300); setTimeout(_applyResize,600); });
