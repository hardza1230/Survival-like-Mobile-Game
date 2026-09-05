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

/* ---- เวอร์ชัน + บันทึกอัปเดต (build-www ดึงไปทำ version.json ให้หน้า download) ---- */
const GAME_VERSION = '1.8.5';
const RELEASES_URL = 'https://github.com/hardza1230/Survival-like-Mobile-Game/releases/latest';
const CHANGELOG = [
  { v:'1.8.5', date:'2026-09-02', title:'ไอคอนครบทุกตัวเป็นอาร์ตจริง 100%', items:[
    'เพิ่มไอคอนแม่เหล็กโฉมใหม่ — ตอนนี้ไอคอนสกิลและพรทั้งเกมเป็นอาร์ตจริงชุดเดียวกันหมด ไม่เหลืออีโมจิแล้ว' ] },
  { v:'1.8.4', date:'2026-09-02', title:'ไอคอนทั้งเกมเป็นชุดเดียวกัน + ไอคอนพรใหม่', items:[
    'ทำไอคอนสกิลเก่า (สปริงเคิล/ดาว/พริก/น้ำแข็ง/ฟอง) ใหม่ให้เข้าชุดสไตล์เดียวกับตัวอื่น',
    'เพิ่มไอคอนพรน่ารัก: พลัง/เท้าลื่น/ร่ายไว/คริ/การ์ด/ฟื้นตัว + หัวใจโฉมใหม่ (เหลือแม่เหล็กตัวเดียวที่ยังเป็นแบบเก่า)' ] },
  { v:'1.8.3', date:'2026-09-02', title:'แก้ขนาดไอคอนล้นกรอบ + การ์ดเลเวลอัพโฉมใหม่', items:[
    'แก้ไอคอนสกิลใหม่แสดงใหญ่เกินจนล้นกรอบการ์ด/แถบสกิล (ปรับให้พอดีทุกขนาดจอ)',
    'การ์ดเลเวลอัพดีไซน์ใหม่: เงานุ่ม ไล่เฉดสีตามหมวด กลอสด้านบน ขอบ 2 ชั้น และวงไอคอนมีขอบเรืองแสง' ] },
  { v:'1.8.2', date:'2026-09-02', title:'ไอคอนสกิลโจมตีเป็นอาร์ตจริงครบทุกตัว', items:[
    'สกิลโจมตีทั้ง 17 ตัวมีไอคอนลูกกวาดน่ารักของตัวเอง (เลิกใช้อีโมจิ) — โผล่ในแถบสกิล การ์ดเลเวลอัพ และแถบถือครอง',
    'ไอคอนใหม่ 12 ตัว: ฟ้าผ่า/ครีมหมุน/คุกกี้/ป๊อปคอร์น/ออร่าดอกไม้/ส้อม/คัพเค้ก/ลำแสง/โดนัท/เมฆมอคค่า/จรวด/คลื่นครีม' ] },
  { v:'1.8.1', date:'2026-08-29', title:'ปรับปรุงความเสถียร & แก้ไขหน้าจอโหลดค้าง', items:[
    'ป้องกันปัญหาแคช WebView ค้าง ด้วย Meta Headers และ Cache Buster ล่าสุด',
    'เพิ่มระบบ Error Boundary แสดงแจ้งเตือนพร้อมปุ่มล้างแคชหากโหลดสะดุด',
    'ปรับปรุงหน้าต่างแจ้งเตือนหมุนหน้าจอ (Orientation) ให้ยืดหยุ่นและไม่บล็อกเกม' ] },
  { v:'1.8.0', date:'2026-08-29', title:'ระบบโจมตีพื้นฐานเฉพาะตัวละคร (Survivor Style)', items:[
    'ยกเลิกปุ่มกดใช้สกิล — ตัวละครโจมตีอัตโนมัติด้วยอาวุธเริ่มต้นและเอกลักษณ์เฉพาะตัว (แบบ Vampire Survivors / Isekai Drifter)',
    'โมโม่ 🍡 เริ่มต้นด้วย Sprinkle Spray ยิงเกล็ดน้ำตาลรัวไล่เป้า',
    'มินต์ 🌿 เริ่มต้นด้วย Frost Pulse คลื่นน้ำแข็งสโลว์และแช่แข็งรอบตัว',
    'โกโก้ 🍫 เริ่มต้นด้วย Donut Drop ทิ้งโดนัทระเบิด AoE หนักแน่น',
    'ตาโร่ 🍠 เริ่มต้นด้วย Chili Nova คลื่นระเบิดพริกผลักศัตรู',
    'งาดำ ⚫ เริ่มต้นด้วย Star Guard ดาวคุ้มกันหมุนรอบตัวเฉือนศัตรู',
    'หน้าจอควบคุมคลีนสุด ๆ — เล่นมือเดียวถนัด ลากจอยได้ทั้งจอ + ปุ่มพุ่ง (Dash) ขวาล่าง' ] },
  { v:'1.7.0', date:'2026-08-29', title:'ระบบเสียงจริง + ปรับปรุงปุ่มแดช & สไปรต์มอนสเตอร์', items:[
    'เชื่อมต่อเสียงประกอบ (BGM ประจำ 5 ด่าน + Main Theme) และเอฟเฟกต์ SFX จริงจากไฟล์เสียง',
    'ปรับปรุง Layout ปุ่ม Dash และ Joystick ให้เล่นมือเดียว (ขวา/ซ้าย) สะดวก ไม่เผลอโดนแดช',
    'แยกสไปรต์มอนสเตอร์และบอสให้คมชัด โหลดถูกต้อง ไม่มีเศษสไปรต์ชีท' ] },
  { v:'1.6.3', date:'2026-08-29', title:'ปุ่มเมนูโฉมใหม่ (แบนโมเดิร์น)', items:[
    'เปลี่ยนปุ่มเมนู+หน้าหยุดเกมเป็นปุ่มโค้งไล่เฉด + ไอคอนวงกลม + เงานุ่ม สะอาดขึ้น' ] },
  { v:'1.6.2', date:'2026-08-29', title:'จัดปุ่มเมนูให้สวยขึ้น', items:[
    'ปุ่มเมนูมีช่องว่าง+เงาชัดเจน ไม่ชิด/ซ้อนกันบนจอสูง · ขนาดพอดีขึ้น' ] },
  { v:'1.6.1', date:'2026-08-29', title:'ปุ่มลูกกวาดโฉมใหม่', items:[
    'ปุ่มเมนู + หน้าหยุดเกม เปลี่ยนเป็นปุ่มลูกกวาดสตรอว์เบอร์รีน่ารัก' ] },
  { v:'1.6.0', date:'2026-08-29', title:'ตัวละครใหม่ 2 ตัว + ไอคอนสกิล + เอฟเฟกต์อัลติ', items:[
    'ตัวละครเล่นได้ใหม่: ตาโร่ 🍠 (ว่องไว) และ งาดำ ⚫ (นักสู้คาดผ้า)',
    'ไอคอนสกิล/พร เป็นรูปจริงในแถบสกิล + การ์ดเลเวลอัพ (บางตัว)',
    'เอฟเฟกต์อัลติใหม่: ระเบิดน้ำตาลสตรอว์เบอร์รี + หลุมดำโกโก้',
    'บอสสุดท้ายเชฟขมเป็นอาร์ตใหม่' ] },
  { v:'1.5.0', date:'2026-08-29', title:'ลงกราฟิกจริง! พื้นหลัง 5 โซน + ศัตรู/มินิบอส/ไอเทมใหม่', items:[
    'พื้นหลังครัวจริงทั้ง 5 โซน (ตู้กับข้าว/อ่าง/เตาไฟ/แช่แข็ง/เตาอบ) แทนพื้นตาราง',
    'ศัตรูพุ่งโฉบ (Dasher) + ถึกบีบวง (Siege) เป็นอาร์ตจริง',
    'มินิบอส 5 ด่านมีหน้าตาเฉพาะตัว',
    'ไอเทมหีบสมบัติ / โหลแยม / แม่เหล็ก เป็นอาร์ตจริง',
    'เอฟเฟกต์สกิลใหม่: พริกระเบิด, คลื่นน้ำแข็ง, โดนัทหล่น + วงเตือนอันตราย (telegraph)' ] },
  { v:'1.4.0', date:'2026-08-29', title:'AI ศัตรูใหม่ + บอสถึกขึ้น + หีบสมบัติ + ระบบดรอป/กล่องสุ่ม', items:[
    'ศัตรูรูปแบบใหม่: พุ่งโฉบ (Dasher), ถึกบีบวงล้อม (Siege) + อีเวนต์ฝูงบุก (Swarm) ทุกทิศ',
    'บอส/มินิบอสถึกขึ้นตามความเก่งผู้เล่น + แพทเทิร์นใหม่ (เกลียวหมุน, วงล้อมเว้นช่อง)',
    'ล้มบอส = ดรอปหีบสมบัติ เดินไปเก็บเพื่อสุ่มรับสกิล',
    'ไอเทมแม่เหล็ก 🧲 ดูดเม็ด EXP ทั้งจอ + แก้บั๊กสกิล AoE ตีกล่องไม่โดน',
    'มุมกล้องกว้างขึ้น มองเห็นรอบตัวมากขึ้น',
    'อุปกรณ์เลิกใช้เงินซื้อ — ได้จากดรอปในด่าน (ธรรมดา) + เปิดกล่องสุ่มหาของแรร์' ] },
  { v:'1.3.0', date:'2026-08-28', title:'ระบบยศ + จูนสมดุล + พอร์ตเทรต', items:[
    'ระบบพรสวรรค์ใหม่: อัพ HP/ATK/DEF ให้เต็ม แล้ว "เลื่อนยศ" — ยศสูงขึ้น สแตตติดตัวเพิ่ม แต่ราคาแพงขึ้นเรื่อย ๆ',
    'พลังโจมตีเป็น flat damage + จูนสมดุลไม่ให้ดาเมจเวอร์',
    'จบเวฟแล้วมอนสเตอร์ไม่หายวับ — เวฟถัดไปไหลต่อทันที',
    'ล็อกจอแนวตั้ง (portrait) + การ์ดเลเวลอัพบอกดาว/คอมโบ/หมวดสกิลชัดขึ้น',
    'หน้าหยุดเกมโชว์สกิล+พรที่ถืออยู่' ] },
  { v:'1.2.0', date:'2026-08-28', title:'อัปเกรด & อุปกรณ์โฉมใหม่', items:[
    'หน้าอัปเกรดฐานใหม่: แถบ "ระดับขั้น" + รางวัลหมุด + การ์ด HP/ATK/DEF',
    'หน้าอุปกรณ์ใหม่: 6 ช่องรอบตัวละคร + คลังไอเทม + ผสม/ตีบวก',
    'เพิ่มหน้าดาวน์โหลด + แสดงเวอร์ชันในเกม' ] },
  { v:'1.1.0', date:'2026-08-28', title:'เวฟเอาชีวิตรอด', items:[
    'เวฟธรรมดาเปลี่ยนเป็นนับถอยหลัง — มอนสเตอร์รุมเป็นฝูงจนจอเต็ม',
    'ล็อกสกิลโจมตี 6 + สกิลติดตัว 6 ต่อรอบ (แบบ Vampire Survivors)',
    'สกิลขั้นสุด (ตื่นรู้) การันตีโผล่บ่อยขึ้น' ] },
  { v:'1.0.0', date:'2026-08-27', title:'เปิดตัว Mochi Mayhem', items:[
    '5 ด่านครัว + บอส 5 ตัว, ตัวละคร 3 ตัว, สกิล 17 อย่าง',
    'ระบบพรสวรรค์ ของสวมใส่ อัพเกรด และเสียง/เพลงสังเคราะห์' ] },
];

/* ============================================================
   Sfx — จัดการเสียงเอฟเฟกต์ (SFX) และดนตรีประกอบ (BGM)
   เล่นไฟล์เสียงจริงจาก assets/audio/ พร้อม fallback เสียงสังเคราะห์
   ============================================================ */
const Sfx = {
  ctx:null, master:null, muted:false, _noise:null, _last:{},
  _currentBgm:null, _currentBgmKey:'',
  ensure(){
    if(this.ctx) return this.ctx;
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return null;
    this.ctx=new AC();
    this.master=this.ctx.createGain(); this.master.gain.value=0.35; this.master.connect(this.ctx.destination);
    const len=Math.floor(this.ctx.sampleRate*0.4), buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1; this._noise=buf;
    return this.ctx;
  },
  unlock(){ this.ensure(); if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); if(!this._currentBgm)this.playMainBgm(); },
  toggle(){
    this.muted=!this.muted;
    if(this.master)this.master.gain.value=this.muted?0:0.35;
    if(window.__g && window.__g.sound) window.__g.sound.mute=this.muted;
    return this.muted;
  },
  _ok(key,gap){ const t=(this.ctx?this.ctx.currentTime:0); if((this._last[key]||-9)+gap>t)return false; this._last[key]=t; return true; },
  playFile(key, vol=0.5){
    if(this.muted) return false;
    try {
      if(window.__g && window.__g.cache && window.__g.cache.audio && window.__g.cache.audio.exists(key)){
        window.__g.sound.play(key, { volume: vol });
        return true;
      }
    } catch(e){}
    return false;
  },
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

  // --- เสียงเอฟเฟกต์ (SFX) ---
  shoot(){ if(this._ok('shoot',0.05)){ if(!this.playFile('sfx_shoot', 0.45)) this.tone(880,0.05,'triangle',0.07,1500); } },
  pop(){ if(this._ok('pop',0.03)){ if(!this.playFile('sfx_hit', 0.4)) this.tone(560,0.09,'square',0.13,200); } },
  xp(){ if(this._ok('xp',0.09)){ if(!this.playFile('sfx_xp', 0.16)) this.tone(700,0.06,'sine',0.07,1040); } },
  hurt(){ if(!this.playFile('sfx_hit', 0.6)) this.tone(320,0.18,'sawtooth',0.2,90); },
  dash(){ if(!this.playFile('sfx_dash', 0.6)){ this.noise(0.16,0.12,0,true); this.tone(620,0.14,'sine',0.09,1150); } },
  ult(type){
    if(type==='vortex' && this.playFile('sfx_ult_vortex', 0.7)) return;
    if(!this.playFile('sfx_ult_bomb', 0.7)) this.seq([660,880,1180],'triangle',0.2,0.06);
  },
  zap(){ if(this._ok('zap',0.05)){ if(!this.playFile('sfx_donut', 0.5)){ this.noise(0.07,0.13,0,true); this.tone(1550,0.09,'square',0.1,420); } } },
  boom(){ if(this._ok('boom',0.08)){ if(!this.playFile('sfx_chili', 0.6)){ this.noise(0.2,0.16); this.tone(170,0.22,'sine',0.16,60); } } },
  frost(){ if(this._ok('frost',0.1)){ if(!this.playFile('sfx_frost', 0.6)) this.seq([1200,1500,1900],'sine',0.12,0.05); } },
  levelup(){ if(!this.playFile('sfx_levelup', 0.65)) this.seq([523,659,784,1047],'triangle',0.24,0.1); },
  chest(){ if(!this.playFile('sfx_chest', 0.7)) this.seq([587,740,880,1175],'triangle',0.25,0.09); },
  select(){ if(!this.playFile('sfx_btn', 0.5)) this.tone(920,0.08,'square',0.17,1360); },
  bossWarn(){ if(!this.playFile('sfx_hazard', 0.7)){ this.tone(120,0.5,'sawtooth',0.22,70); this.tone(90,0.6,'square',0.13,0,0.1); } },
  clear(){ if(!this.playFile('sfx_levelup', 0.6)) this.seq([659,784,1047,1319],'triangle',0.24,0.12); },
  victory(){ this.seq([523,659,784,1047,1319,1568],'triangle',0.28,0.14); },
  dead(){ this.seq([440,349,262,196],'sawtooth',0.2,0.14); },
  heal(){ if(this._ok('heal',0.1)) this.seq([784,988,1319],'sine',0.16,0.06); },

  // ===== เพลงพื้นหลัง (BGM จริง + สังเคราะห์ fallback) =====
  playStageBgm(stageNum=1){
    const key = 'bgm_stage' + Math.max(1, Math.min(5, stageNum));
    if(this._currentBgmKey === key && this._currentBgm && this._currentBgm.isPlaying) return;
    this.stopBgm();
    if(window.__g && window.__g.cache && window.__g.cache.audio && window.__g.cache.audio.exists(key)){
      try {
        this._currentBgm = window.__g.sound.add(key, { loop:true, volume: this.muted?0:0.45 });
        this._currentBgm.play();
        this._currentBgmKey = key;
        return;
      } catch(e){}
    }
    this.startBgm();
  },
  playMainBgm(){
    const key = 'bgm_main';
    if(this._currentBgmKey === key && this._currentBgm && this._currentBgm.isPlaying) return;
    this.stopBgm();
    if(window.__g && window.__g.cache && window.__g.cache.audio && window.__g.cache.audio.exists(key)){
      try {
        this._currentBgm = window.__g.sound.add(key, { loop:true, volume: this.muted?0:0.45 });
        this._currentBgm.play();
        this._currentBgmKey = key;
        return;
      } catch(e){}
    }
    this.startBgm();
  },
  _bgmGain:null, _bgmTimer:null, _bgmStep:0, _bgmIntense:false,
  _bgmNote(freq,dur,type,vol,delay){ if(!this.ctx||!this._bgmGain)return;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+0.04); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this._bgmGain); o.start(t0); o.stop(t0+dur+0.03); },
  startBgm(){ this.ensure(); if(!this.ctx||this._bgmTimer)return;
    if(!this._bgmGain){ this._bgmGain=this.ctx.createGain(); this._bgmGain.gain.value=0.5; this._bgmGain.connect(this.master); }
    this._bgmStep=0; this._bgmLoop(); },
  stopBgm(){
    if(this._currentBgm){ try{ this._currentBgm.stop(); this._currentBgm.destroy(); }catch(e){} this._currentBgm=null; this._currentBgmKey=''; }
    if(this._bgmTimer){ clearTimeout(this._bgmTimer); this._bgmTimer=null; }
  },
  bgmIntense(on){ this._bgmIntense=!!on; if(this._currentBgm && this._currentBgm.isPlaying){ this._currentBgm.setVolume(this.muted?0:(on?0.55:0.45)); } },
  _bgmLoop(){
    const roots=[130.81,110.00,174.61,196.00];
    const root=roots[this._bgmStep%roots.length];
    const bar=this._bgmIntense?1.35:1.9, beat=bar/4, base=root*2;
    this._bgmNote(root,beat*3.6,'sine',0.5,0);
    const arp=[base,base*1.25,base*1.5,base*2];
    arp.forEach((f,i)=>this._bgmNote(f,beat*0.9,'triangle',this._bgmIntense?0.24:0.2,i*beat));
    if(this._bgmStep%2===0) this._bgmNote(base*2,beat*0.6,'sine',0.12,beat*2);
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
  e_dasher:'assets/e_dasher.png', e_siege:'assets/e_siege.png',   // ศัตรูใหม่ (รูปจริง แทนการย้อมสี)
  mb1:'assets/mb1.png', mb2:'assets/mb2.png', mb3:'assets/mb3.png', mb4:'assets/mb4.png', mb5:'assets/mb5.png',   // มินิบอส 5 ด่าน
  chest:'assets/chest.png', crate:'assets/crate.png', vac:'assets/vac.png',   // ไอเทม (รูปจริง แทนกราฟิกโค้ด)
  bg1:'assets/bg1.png', bg2:'assets/bg2.png', bg3:'assets/bg3.png', bg4:'assets/bg4.png', bg5:'assets/bg5.png',   // พื้นหลัง 5 โซนครัว
  fx_chili:'assets/fx_chili.png', fx_frost:'assets/fx_frost.png', fx_hazard:'assets/fx_hazard.png', fx_donut:'assets/fx_donut.png',   // VFX สกิล/telegraph
  fx_ult_bomb:'assets/fx_ult_bomb.png', fx_ult_vortex:'assets/fx_ult_vortex.png',   // VFX อัลติ (bomb/blackhole)
  proj_rocket:'assets/proj_rocket.png', proj_fork:'assets/proj_fork.png', proj_boomer:'assets/proj_boomer.png',   // กระสุนรูปจริง (คีย์เขียว)
  p_shelf:'assets/p_shelf.png', p_spicerack:'assets/p_spicerack.png', p_cupboard:'assets/p_cupboard.png', p_boxes:'assets/p_boxes.png', p_crate:'assets/p_crate.png', p_sugarbarrel:'assets/p_sugarbarrel.png',   // props ฉากด่าน 1 (คีย์เขียว)
  p_flour:'assets/p_flour.png', p_candybarrel:'assets/p_candybarrel.png', p_sack:'assets/p_sack.png', p_flourspill:'assets/p_flourspill.png', p_cans:'assets/p_cans.png', p_jars:'assets/p_jars.png',
  p_rollingpin:'assets/p_rollingpin.png', p_jamspice:'assets/p_jamspice.png', p_honey:'assets/p_honey.png', p_board:'assets/p_board.png', p_measure:'assets/p_measure.png', p_mouse:'assets/p_mouse.png',
  char_taro:'assets/char_taro.png', char_sesame:'assets/char_sesame.png',   // ตัวละครใหม่ (รูปนิ่ง + เจลลี่)
  ic_sprinkle:'assets/ic_sprinkle.png', ic_star:'assets/ic_star.png', ic_chili:'assets/ic_chili.png', ic_frost:'assets/ic_frost.png',
  ic_bubble:'assets/ic_bubble.png', ic_heart:'assets/ic_heart.png', ic_magnet:'assets/ic_magnet.png', ic_sugar:'assets/ic_sugar.png',
  // ไอคอนสกิลโจมตีชุดใหม่ (12 ตัว · gen แผ่นเดียว 4×3 หั่นด้วย scripts/cut-skill-icons.mjs) → ครบ 17 สกิลโจมตี
  ic_thunder:'assets/ic_thunder.png', ic_whirl:'assets/ic_whirl.png', ic_boomer:'assets/ic_boomer.png', ic_popcorn:'assets/ic_popcorn.png',
  ic_aura:'assets/ic_aura.png', ic_fork:'assets/ic_fork.png', ic_mine:'assets/ic_mine.png', ic_beam:'assets/ic_beam.png',
  ic_meteor:'assets/ic_meteor.png', ic_cloud:'assets/ic_cloud.png', ic_rocket:'assets/ic_rocket.png', ic_wave:'assets/ic_wave.png',
  // ไอคอนพรชุดใหม่ (สไตล์เดียวกับสกิล) — power/swift/haste/crit/guard/regen · heart/magnet ใช้ของเดิม (heart รีเจนใหม่แล้ว)
  ic_power:'assets/ic_power.png', ic_swift:'assets/ic_swift.png', ic_haste:'assets/ic_haste.png',
  ic_crit:'assets/ic_crit.png', ic_guard:'assets/ic_guard.png', ic_regen:'assets/ic_regen.png',
};
// map สกิล/พร → ไอคอนรูปจริง (มีเท่าที่อาร์ตทำมา · null=ใช้อีโมจิ)
const SKILL_ICON = { sprinkle:'ic_sprinkle', star:'ic_star', chili:'ic_chili', frost:'ic_frost', bubble:'ic_bubble',
  thunder:'ic_thunder', whirl:'ic_whirl', boomer:'ic_boomer', popcorn:'ic_popcorn', aura:'ic_aura', fork:'ic_fork',
  mine:'ic_mine', beam:'ic_beam', meteor:'ic_meteor', cloud:'ic_cloud', rocket:'ic_rocket', wave:'ic_wave' };
const PASS_ICON  = { heart:'ic_heart', magnet:'ic_magnet', power:'ic_power', swift:'ic_swift', haste:'ic_haste', crit:'ic_crit', guard:'ic_guard', regen:'ic_regen' };
const ASSET_SHEETS = {
  char_momo:  { url:'assets/char_momo_sheet.png',  frame:128 },
  char_mint:  { url:'assets/char_mint_sheet.png',  frame:128 },
  char_cocoa: { url:'assets/char_cocoa_sheet.png', frame:128 },
};

/* ---- VFX flipbook sheets (อนิเมชันหลายเฟรม เล่นไล่เฟรม) ----
   เฟรมไม่จำเป็นต้องจตุรัส (fw×fh) · แต่ละไฟล์เป็น sprite strip พื้นดำ → เล่นด้วย additive blend
   frames=จำนวนเฟรม · rate=fps · anchor=จุดยึด origin ('left'=ยิงจากตัวออกไป, 'center'=ระเบิดกลาง) */
const ASSET_FX = {
  fx_beam:     { url:'assets/fx_beam_sheet.png',     fw:352, fh:366, frames:8, rate:26, anchor:'left'   },
  fx_boom:     { url:'assets/fx_boom_sheet.png',     fw:352, fh:366, frames:8, rate:24, anchor:'center' },
  fx_frostnova:{ url:'assets/fx_frostnova_sheet.png',fw:352, fh:366, frames:8, rate:24, anchor:'center' },
  fx_vortex:   { url:'assets/fx_vortex_sheet.png',   fw:352, fh:366, frames:8, rate:22, anchor:'center' },
  fx_slash:    { url:'assets/fx_slash_sheet.png',    fw:352, fh:366, frames:8, rate:30, anchor:'left'   },
  fx_levelup:  { url:'assets/fx_levelup_sheet.png',  fw:61,  fh:64,  frames:8, rate:24, anchor:'center' },
  fx_thunder:  { url:'assets/fx_thunder_sheet.png',  fw:61,  fh:64,  frames:8, rate:30, anchor:'bottom' },
  fx_heal:     { url:'assets/fx_heal_sheet.png',     fw:352, fh:366, frames:8, rate:22, anchor:'center' },
  fx_wave:     { url:'assets/fx_wave_sheet.png',     fw:352, fh:366, frames:8, rate:26, anchor:'center' },
  fx_bubble:   { url:'assets/fx_bubble_sheet.png',   fw:352, fh:366, frames:8, rate:22, anchor:'center' },
  fx_popcorn:  { url:'assets/fx_popcorn_sheet.png',  fw:352, fh:366, frames:8, rate:24, anchor:'center' },
  fx_aura:     { url:'assets/fx_aura_sheet.png',     fw:352, fh:366, frames:8, rate:14, anchor:'center', loop:true },   // ออร่าถาวร วนลูป
  fx_chilinova:{ url:'assets/fx_chilinova_sheet.png',fw:286, fh:286, frames:8, rate:24, anchor:'center' },
  fx_mine:     { url:'assets/fx_mine_sheet.png',     fw:61,  fh:70,  frames:8, rate:24, anchor:'center' },
  fx_donutimpact:{ url:'assets/fx_donutimpact_sheet.png',fw:286,fh:92,frames:8,rate:24, anchor:'center' },
  fx_bossnova: { url:'assets/fx_bossnova_sheet.png', fw:286, fh:64,  frames:8, rate:22, anchor:'center' },
  fx_bosssummon:{ url:'assets/fx_bosssummon_sheet.png',fw:61, fh:68,  frames:8, rate:20, anchor:'center' },
  fx_bossportal:{ url:'assets/fx_bossportal_sheet.png',fw:127,fh:127, frames:8, rate:20, anchor:'center' },
  fx_enrage:   { url:'assets/fx_enrage_sheet.png',   fw:61,  fh:61,  frames:8, rate:16, anchor:'center', loop:true },   // ออร่าคลั่งบอส วนลูป
};

/* ---- ไฟล์เสียงจริง (SFX + BGM) ---- */
const ASSET_AUDIO = {
  sfx_shoot:      'assets/audio/sfx/sfx_skill_sprinkle.wav',
  sfx_hit:        'assets/audio/sfx/sfx_hit_monster.wav',
  sfx_xp:         'assets/audio/sfx/sfx_pickup_sugar.wav',
  sfx_dash:       'assets/audio/sfx/sfx_jump_squish.wav',
  sfx_levelup:    'assets/audio/sfx/sfx_levelup_fanfare.wav',
  sfx_chest:      'assets/audio/sfx/sfx_chest_open.wav',
  sfx_btn:        'assets/audio/sfx/sfx_btn_click.wav',
  sfx_chili:      'assets/audio/sfx/sfx_skill_chili.wav',
  sfx_frost:      'assets/audio/sfx/sfx_skill_frost.wav',
  sfx_ult_bomb:   'assets/audio/sfx/sfx_ult_sugarbomb.wav',
  sfx_ult_vortex: 'assets/audio/sfx_vfx_ult_cocoavortex.wav',
  sfx_donut:      'assets/audio/sfx_vfx_proj_donut.wav',
  sfx_hazard:     'assets/audio/sfx_vfx_telegraph_hazard.wav',
  bgm_main:       'assets/audio/bgm/bgm_main_theme.wav',
  bgm_stage1:     'assets/audio/bgm/bgm_stage1_pantry.wav',
  bgm_stage2:     'assets/audio/bgm/bgm_stage2_sink.wav',
  bgm_stage3:     'assets/audio/bgm/bgm_stage3_stove.wav',
  bgm_stage4:     'assets/audio/bgm/bgm_stage4_freezer.wav',
  bgm_stage5:     'assets/audio/bgm/bgm_stage5_oven.wav',
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
    for(const k in ASSET_FX) this.load.spritesheet(k, verUrl(ASSET_FX[k].url), { frameWidth:ASSET_FX[k].fw, frameHeight:ASSET_FX[k].fh });
    for(const k in ASSET_AUDIO) this.load.audio(k, verUrl(ASSET_AUDIO[k]));
    // ถ้ารูป/เสียงโหลดไม่ได้ ให้ข้ามไป ใช้กราฟิก/เสียงสังเคราะห์แทน (ไม่ให้ค้าง)
    this.load.on('loaderror',(f)=>{ delete ASSET_IMAGES[f.key]; delete ASSET_SHEETS[f.key]; delete ASSET_FX[f.key]; delete ASSET_AUDIO[f.key]; });
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
    // หีบสมบัติ (ดรอปจากบอส) — เดินไปเก็บเพื่อสุ่มสกิล
    mk('chest',40,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.2)'; c.beginPath(); c.ellipse(cx,s*0.9,s*0.34,s*0.09,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.3,0,s*0.85); g.addColorStop(0,'#a9744a'); g.addColorStop(1,'#6b4632');
      c.fillStyle=g; rr(c,s*0.16,s*0.42,s*0.68,s*0.42,s*0.06); c.fill();
      const lid=c.createLinearGradient(0,s*0.24,0,s*0.5); lid.addColorStop(0,'#c89a5e'); lid.addColorStop(1,'#8a5e3a');
      c.fillStyle=lid; rr(c,s*0.16,s*0.26,s*0.68,s*0.2,s*0.09); c.fill();
      c.strokeStyle='#ffd166'; c.lineWidth=s*0.05; c.strokeRect(s*0.17,s*0.44,s*0.66,s*0.02);   // แถบทอง
      c.fillStyle='#ffe08a'; rr(c,s*0.44,s*0.4,s*0.12,s*0.18,s*0.03); c.fill();   // ตัวล็อก
      c.fillStyle='#b9862e'; c.beginPath(); c.arc(cx,s*0.52,s*0.045,0,TAU); c.fill(); });
    // ของสวมใส่ดรอป (loot) — กล่องของขวัญ
    mk('gift',28,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.88,s*0.3,s*0.08,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.35,0,s*0.85); g.addColorStop(0,'#7fd0ff'); g.addColorStop(1,'#4f9fe0');
      c.fillStyle=g; rr(c,s*0.22,s*0.42,s*0.56,s*0.42,s*0.05); c.fill();
      c.fillStyle='#ffd166'; rr(c,s*0.22,s*0.34,s*0.56,s*0.12,s*0.04); c.fill();   // ฝา
      c.fillStyle='#ff8fb5'; c.fillRect(s*0.46,s*0.34,s*0.08,s*0.5);               // ริบบิ้นแนวตั้ง
      c.beginPath(); c.moveTo(cx,s*0.32); c.lineTo(s*0.36,s*0.2); c.lineTo(s*0.46,s*0.32); c.closePath(); c.fill();  // โบว์
      c.beginPath(); c.moveTo(cx,s*0.32); c.lineTo(s*0.64,s*0.2); c.lineTo(s*0.54,s*0.32); c.closePath(); c.fill(); });
    // ไอเทมแม่เหล็ก (vacuum) — ดูดออร์บ EXP ทั้งจอ
    mk('vac',26,(c,s)=>{ c.fillStyle='rgba(20,10,25,0.16)'; c.beginPath(); c.ellipse(s/2,s*0.9,s*0.3,s*0.08,0,0,TAU); c.fill();
      c.lineCap='round'; c.strokeStyle='#ff5a6e'; c.lineWidth=s*0.17;   // เกือกม้าแม่เหล็กสีแดง (U คว่ำ)
      c.beginPath(); c.moveTo(s*0.30,s*0.34); c.lineTo(s*0.30,s*0.56); c.stroke();
      c.beginPath(); c.moveTo(s*0.70,s*0.34); c.lineTo(s*0.70,s*0.56); c.stroke();
      c.beginPath(); c.arc(s*0.5,s*0.56,s*0.20,0,Math.PI,false); c.stroke();
      c.fillStyle='#dcdce8'; c.fillRect(s*0.215,s*0.28,s*0.17,s*0.09); c.fillRect(s*0.615,s*0.28,s*0.17,s*0.09); })   // ปลายสีเงิน;
    // ---- VFX textures ----
    mk('vfx_ring',64,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,s*0.28,cx,cx,s*0.5);
      g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.5,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,s*0.5,0,TAU); c.fill(); });
    mk('vfx_poof',48,(c,s)=>{ const cx=s/2; for(let i=0;i<6;i++){
      const a=i/6*TAU, r=s*0.18, px=cx+Math.cos(a)*r, py=cx+Math.sin(a)*r;
      const g=c.createRadialGradient(px,py,0,px,py,s*0.22);
      g.addColorStop(0,'rgba(255,255,255,0.7)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(px,py,s*0.22,0,TAU); c.fill(); }
      const g2=c.createRadialGradient(cx,cx,0,cx,cx,s*0.2);
      g2.addColorStop(0,'rgba(255,255,255,0.85)'); g2.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g2; c.beginPath(); c.arc(cx,cx,s*0.2,0,TAU); c.fill(); });
    mk('vfx_glow',32,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'rgba(255,255,255,0.95)'); g.addColorStop(0.4,'rgba(255,255,255,0.5)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('bubble',30,(c,s)=>{ const cx=s/2;   // ฟองสบู่โปร่งแสง (กระสุนสกิล bubble)
      const g=c.createRadialGradient(cx,cx,s*0.1,cx,cx,cx); g.addColorStop(0,'rgba(215,242,255,0.10)'); g.addColorStop(0.72,'rgba(190,232,255,0.26)'); g.addColorStop(0.9,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(190,232,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx*0.95,0,TAU); c.fill();
      c.fillStyle='rgba(255,255,255,0.9)'; c.beginPath(); c.arc(cx*0.66,cx*0.6,s*0.08,0,TAU); c.fill(); });
    mk('vfx_line',32,(c,s)=>{ const g=c.createLinearGradient(0,s/2,s,s/2);
      g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.3,'rgba(255,255,255,0.8)'); g.addColorStop(0.7,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.fillRect(0,s*0.38,s,s*0.24); });

    // ---- สร้างอนิเมชัน flipbook ของ VFX (เล่นครั้งเดียวจบ) ----
    for(const k in ASSET_FX){ if(!this.textures.exists(k))continue; const fx=ASSET_FX[k];
      if(this.anims.exists(k))continue;
      this.anims.create({ key:k, frames:this.anims.generateFrameNumbers(k,{start:0,end:fx.frames-1}), frameRate:fx.rate, repeat:fx.loop?-1:0 }); }

    // ---- Props ประดับฉาก (placeholder กล่อง ๆ — สลับอาร์ต AI ทีหลัง) ----
    const mkRect=(key,w,h,draw)=>{ if(isArtKey(key)&&this.textures.exists(key))return;   // มีรูป AI แล้ว ไม่วาดทับ (procedural = fallback)
      if(this.textures.exists(key))this.textures.remove(key);
      const t=this.textures.createCanvas(key,w,h); if(!t)return; draw(t.getContext(),w,h); t.refresh(); };
    const lg=(c,x0,y0,x1,y1,a,b)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
    const gShadow=(c,w,h)=>{ c.fillStyle='rgba(20,10,25,0.22)'; c.beginPath(); c.ellipse(w/2,h-7,w*0.40,h*0.09,0,0,TAU); c.fill(); };
    // ชั้นวางไม้ 2 ชั้น + โหลข้างบน
    mkRect('p_shelf',200,132,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle='#7a4d2b'; c.fillRect(w*0.13,h*0.30,11,h*0.60); c.fillRect(w*0.83,h*0.30,11,h*0.60);
      for(const yy of [h*0.30,h*0.60]){ c.fillStyle=lg(c,0,yy,0,yy+20,'#c98a4e','#95602f'); rr(c,w*0.05,yy,w*0.90,20,5); c.fill(); c.strokeStyle='rgba(70,40,20,0.55)'; c.lineWidth=2; c.stroke(); }
      const jar=(jx,jy,col)=>{ c.fillStyle=col; rr(c,jx,jy,26,30,7); c.fill(); c.fillStyle='#f4e6c8'; rr(c,jx+3,jy-6,20,8,3); c.fill(); c.fillStyle='rgba(255,255,255,0.4)'; rr(c,jx+4,jy+4,6,16,3); c.fill(); };
      jar(w*0.20,h*0.30-30,'#e8637a'); jar(w*0.44,h*0.30-30,'#f0a92e'); jar(w*0.68,h*0.30-30,'#a06be0'); });
    // ลังไม้ (กากบาท)
    mkRect('p_crate',112,120,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,0,h,'#c07f42','#8a562d'); rr(c,w*0.10,h*0.12,w*0.80,h*0.78,8); c.fill();
      c.strokeStyle='#6d4423'; c.lineWidth=6; c.stroke();
      c.lineWidth=7; c.strokeStyle='rgba(120,75,38,0.85)'; c.beginPath(); c.moveTo(w*0.14,h*0.16); c.lineTo(w*0.86,h*0.86); c.moveTo(w*0.86,h*0.16); c.lineTo(w*0.14,h*0.86); c.stroke();
      c.fillStyle='rgba(255,240,210,0.18)'; rr(c,w*0.14,h*0.16,w*0.72,10,4); c.fill(); });
    // กระป๋องยักษ์ (แลนด์มาร์ก) โลหะ + แถบฉลาก
    mkRect('p_cans',126,168,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,w*0.15,0,w*0.85,0,'#aeb7c4','#e6ecf3'); rr(c,w*0.16,h*0.14,w*0.68,h*0.78,10); c.fill();
      c.fillStyle='rgba(255,255,255,0.5)'; rr(c,w*0.24,h*0.16,10,h*0.72,5); c.fill();
      c.fillStyle=lg(c,0,h*0.36,0,h*0.72,'#ff6d7e','#e23b57'); c.fillRect(w*0.16,h*0.40,w*0.68,h*0.34);
      c.fillStyle='#fff3d6'; c.beginPath(); c.arc(w*0.5,h*0.57,15,0,TAU); c.fill();
      c.fillStyle='#8fbf5a'; c.beginPath(); c.arc(w*0.5,h*0.57,9,0,TAU); c.fill();
      c.fillStyle='#c9d2dc'; rr(c,w*0.14,h*0.10,w*0.72,10,5); c.fill(); });
    // โหลแยม 3 ใบ
    mkRect('p_jars',124,92,(c,w,h)=>{ gShadow(c,w,h);
      const jar=(jx,s,col)=>{ c.fillStyle=col; rr(c,jx,h*0.30,34*s,44*s,9); c.fill(); c.strokeStyle='rgba(90,50,60,0.35)'; c.lineWidth=2; c.stroke();
        c.fillStyle='#f4e6c8'; rr(c,jx+3,h*0.30-9,28*s,11,4); c.fill(); c.fillStyle='rgba(255,255,255,0.42)'; rr(c,jx+5,h*0.36,8,20*s,4); c.fill(); };
      jar(w*0.06,1.05,'#e8637a'); jar(w*0.66,0.95,'#f0a92e'); jar(w*0.37,1.15,'#c0507a'); });
    // ถุงแป้ง + แป้งหก
    mkRect('p_flour',132,94,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle='rgba(245,240,228,0.85)'; c.beginPath(); c.ellipse(w*0.62,h*0.86,w*0.36,h*0.13,0,0,TAU); c.fill();
      c.fillStyle=lg(c,0,h*0.2,0,h*0.9,'#f0e6cf','#d8cbac'); rr(c,w*0.16,h*0.24,w*0.56,h*0.62,10); c.fill();
      c.strokeStyle='rgba(150,130,95,0.5)'; c.lineWidth=2; c.stroke();
      c.fillStyle='#b98a4a'; c.font='bold 15px sans-serif'; c.fillText('🌾',w*0.30,h*0.62);
      c.fillStyle='rgba(255,255,255,0.9)'; c.beginPath(); c.arc(w*0.80,h*0.5,4,0,TAU); c.arc(w*0.86,h*0.62,3,0,TAU); c.arc(w*0.74,h*0.72,3,0,TAU); c.fill(); });
    // กล่องกระดาษเปิดฝา
    mkRect('p_box',100,92,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,0,h,'#d2a76d','#b07f45'); rr(c,w*0.16,h*0.34,w*0.68,h*0.54,6); c.fill();
      c.strokeStyle='#8a6335'; c.lineWidth=4; c.stroke();
      c.fillStyle='#c49a5f'; c.beginPath(); c.moveTo(w*0.16,h*0.36); c.lineTo(w*0.30,h*0.16); c.lineTo(w*0.44,h*0.36); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(w*0.84,h*0.36); c.lineTo(w*0.70,h*0.16); c.lineTo(w*0.56,h*0.36); c.closePath(); c.fill();
      c.fillStyle='rgba(90,60,30,0.35)'; c.fillRect(w*0.16,h*0.55,w*0.68,3); });

    this.scene.start('Game');
  }
}

/* ---- SKILLS: auto-cast, flashy, stackable ---- */
const SKILLDEFS = {
  sprinkle:{ name:'Sprinkle Spray', emoji:'🍬', max:5, desc:'ยิงลูกกวาดใส่ศัตรูใกล้สุด',
    awaken:{ name:'พายุสายรุ้ง', emoji:'🌈', desc:'ยิง 8 เม็ดไล่เป้าอัตโนมัติ ทะลุ+เด้ง ร่ายถี่ยิบ!' } },
  star:    { name:'Star Guard',     emoji:'🌟', max:5, desc:'ดาวหมุนรอบตัวคุ้มกัน', orbit:true,
    awaken:{ name:'วงกาแล็กซี', emoji:'💫', desc:'ดาว 3 วง หมุนไว ดาเมจมหาศาล!' } },
  chili:   { name:'Chili Nova',     emoji:'🌶️', max:5, desc:'ระเบิดเผ็ดรอบตัวเป็นวง',
    awaken:{ name:'ภูเขาไฟ', emoji:'🌋', desc:'ระเบิด 5 ชั้น วงกว้างมหึมา สะเทือนจอ!' } },
  thunder: { name:'Thunder Drop',   emoji:'⚡', max:5, desc:'ฟ้าผ่าสุ่มลงศัตรูรอบตัว',
    awaken:{ name:'พายุนิรันดร์', emoji:'🌩️', desc:'ฟ้าผ่า 8 จุด แตกลูกลามทั้งสนาม!' } },
  whirl:   { name:'Cream Whirl',    emoji:'🍥', max:5, desc:'ครีมหมุนกระจายรอบทิศ',
    awaken:{ name:'ทอร์นาโดครีม', emoji:'🌪️', desc:'16 ทิศ ใบพัดยักษ์ ทะลุทุกตัว!' } },
  boomer:  { name:'Boomerang Cookie',emoji:'🍪', max:5, desc:'คุกกี้พุ่งออกแล้วบินกลับ ทะลุศัตรู',
    awaken:{ name:'เฮอริเคนคุกกี้', emoji:'🍪', desc:'6 ชิ้นยักษ์ เด้ง 2 รอบ ฟันถี่!' } },
  frost:   { name:'Frost Pulse',    emoji:'❄️', max:5, desc:'คลื่นเย็นแช่แข็งศัตรูใกล้ตัว',
    awaken:{ name:'ศูนย์สัมบูรณ์', emoji:'🧊', desc:'แช่ทั้งจอ + ระเบิดน้ำแข็งดาเมจสูง!' } },
  popcorn: { name:'Popcorn Pop',    emoji:'🍿', max:5, desc:'ป๊อปคอร์นแตกกระจายรอบตัวมั่ว ๆ',
    awaken:{ name:'ป๊อปคอร์นถล่มโลก', emoji:'🍿', desc:'20 เม็ดถล่มจอ ทะลุ ยิงไกล!' } },
  bubble:  { name:'Bubble Homing',  emoji:'🫧', max:5, desc:'ฟองสบู่วิ่งไล่ศัตรูอัตโนมัติ',
    awaken:{ name:'ฝูงฟองล่า', emoji:'🫧', desc:'8 ฟองไล่แม่นยำ ทะลุศัตรู!' } },
  aura:    { name:'Sweet Aura',     emoji:'🌸', max:5, desc:'ออร่าหวานทำดาเมจศัตรูรอบตัวตลอดเวลา',
    awaken:{ name:'พายุกลีบหวาน', emoji:'🌸', desc:'ออร่ากว้างมาก ดาเมจสูง ดูดศัตรูเข้า!' } },
  fork:    { name:'Fork Fling',     emoji:'🍴', max:5, desc:'ขว้างส้อมทะลุศัตรูเป็นแนว',
    awaken:{ name:'พายุส้อม', emoji:'🍴', desc:'ส้อม 10 เล่มพุ่งทุกทิศ ทะลุหมด!' } },
  mine:    { name:'Cupcake Mine',   emoji:'🧁', max:5, desc:'วางคัพเค้กระเบิดดักศัตรู',
    awaken:{ name:'ทุ่นหวานถล่ม', emoji:'🧁', desc:'วาง 4 ลูก ระเบิดใหญ่มาก!' } },
  beam:    { name:'Caramel Beam',   emoji:'🔆', max:5, desc:'ยิงลำแสงคาราเมลทะลุเป็นแนวตรง',
    awaken:{ name:'ลำแสงมรณะ', emoji:'🔆', desc:'3 ลำกว้าง เผาทะลุทั้งแนว!' } },
  meteor:  { name:'Donut Drop',     emoji:'🍩', max:5, desc:'โดนัทหล่นจากฟ้าระเบิดใส่ศัตรู',
    awaken:{ name:'ฝนโดนัท', emoji:'🍩', desc:'10 ลูกถล่มทั้งจอ!' } },
  cloud:   { name:'Mocha Mist',     emoji:'☕', max:5, desc:'ปล่อยไอมอคค่าพิษ ดาเมจต่อเนื่อง',
    awaken:{ name:'หมอกมรณะ', emoji:'☕', desc:'กลุ่มใหญ่ ดาเมจสูง อยู่นาน!' } },
  rocket:  { name:'Candy Rocket',   emoji:'🚀', max:5, desc:'ยิงจรวดลูกอมไล่เป้า ระเบิด AoE',
    awaken:{ name:'ฝูงจรวด', emoji:'🚀', desc:'6 ลูกไล่เป้า ระเบิดใหญ่!' } },
  wave:    { name:'Cream Wave',     emoji:'🌊', max:5, desc:'ปล่อยคลื่นครีมขยายผลักศัตรู',
    awaken:{ name:'สึนามิครีม', emoji:'🌊', desc:'คลื่นยักษ์ 3 ระลอก!' } },
};
const SKILL_AWAKEN_LV = 6;   // เลเวลตื่นรู้ (Awaken) — หลังจาก max (5 ดาว)
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
/* ---- CHARACTERS: แต่ละตัวมีอาวุธโจมตีพื้นฐานเฉพาะตัว (Starter Weapon) + โบนัสสแตต ---- */
const CHARACTERS = {
  momo: {
    name:'โมโม่', emoji:'🍡', starter:'sprinkle', weaponName:'Sprinkle Spray 🍬', cost:0, color:0xff9ec4,
    desc:'สายยิงรัว — เริ่มด้วย Sprinkle Spray ยิงเกล็ดน้ำตาลไล่เป้าเร็ว', bonus:{}
  },
  mint: {
    name:'มินต์', emoji:'🌿', starter:'frost', weaponName:'Frost Pulse ❄️', cost:150, color:0x8fd0ff,
    desc:'สายเย็นอึด (+HP 30) — เริ่มด้วย Frost Pulse แช่แข็งและสโลว์รอบตัว', bonus:{maxhp:30}
  },
  cocoa:{
    name:'โกโก้', emoji:'🍫', starter:'meteor', weaponName:'Donut Drop 🍩', cost:400, color:0x8b5cf0,
    desc:'สายระเบิดหนัก (+ดาเมจ 15%) — เริ่มด้วย Donut Drop ทิ้งโดนัทระเบิด AoE', bonus:{dmgMul:1.15}
  },
  taro: {
    name:'ตาโร่', emoji:'🍠', starter:'chili', weaponName:'Chili Nova 🌶️', cost:250, color:0xb388ff,
    desc:'เผือกว่องไว (+ความเร็ว 8%) — เริ่มด้วย Chili Nova คลื่นระเบิดพริกผลักศัตรู', bonus:{spd:1.08}
  },
  sesame:{
    name:'งาดำ', emoji:'⚫', starter:'star', weaponName:'Star Guard 🌟', cost:550, color:0x8a8f9c,
    desc:'นักสู้เกราะหมุน (+HP 20 · ดาเมจ 8%) — เริ่มด้วย Star Guard ดาวคุ้มกันหมุนรอบตัว', bonus:{maxhp:20,dmgMul:1.08}
  },
};
const CHAR_ORDER=['momo','mint','cocoa','taro','sesame'];

/* ---- TALENTS: ผังพรสวรรค์ (แยกแต้มต่อตัวละคร) · ลง 1 แต้ม/rank · ผลใส่ตอน applyMeta ---- */
/* ---- CHAR_TALENTS: "พรสวรรค์เฉพาะตัว" — ยกระดับอาวุธเริ่มต้นและสไตล์เล่นของตัวละคร ---- */
const CHAR_TALENTS = {
  momo: [   // สายสมดุล — เก่งรอบด้าน + คริติคอล
    { id:'hp',      emoji:'❤️', name:'พลังชีวิต',  max:5, per:'HP สูงสุด +8%',   apply:(p,r)=>{ p.maxhp*=(1+0.08*r); } },
    { id:'dmg',     emoji:'💥', name:'พลังโจมตี',  max:5, per:'ดาเมจ +6%',       apply:(p,r)=>{ p.dmgMul*=(1+0.06*r); } },
    { id:'crit',    emoji:'🎯', name:'จุดตาย',     max:4, per:'โอกาสคริติคอล +5% (ตีแรง ×1.8)', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'cdr',     emoji:'⏱️', name:'ร่ายไว',     max:4, per:'คูลดาวน์สกิล -5%', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'regen',   emoji:'💗', name:'ฟื้นตัว',    max:3, per:'ฟื้น HP +0.5/วิ',  apply:(p,r)=>{ p.regen+=0.5*r; } },
    { id:'twinSprinkle',emoji:'🍬', name:'สายรุ้งคู่', max:1, per:'✦ signature: Sprinkle Spray เพิ่มกระสุน + เด้งไวขึ้น!', apply:(p,r)=>{ p.twinSprinkle=true; } },
  ],
  mint: [   // สายแทงค์ — อึดโหด ดูดเลือด ฟื้นตัว
    { id:'hp',       emoji:'❤️', name:'ร่างอึด',    max:6, per:'HP สูงสุด +12%',  apply:(p,r)=>{ p.maxhp*=(1+0.12*r); } },
    { id:'armor',    emoji:'🛡️', name:'เกราะน้ำแข็ง', max:5, per:'ลดดาเมจที่รับ -6%', apply:(p,r)=>{ p.dmgTakenMul*=(1-0.06*r); } },
    { id:'regen',    emoji:'💗', name:'ฟื้นฟูเย็น',  max:4, per:'ฟื้น HP +0.7/วิ',  apply:(p,r)=>{ p.regen+=0.7*r; } },
    { id:'lifesteal',emoji:'🍓', name:'ดูดหวาน',    max:3, per:'ฆ่าศัตรูฟื้น +0.7 HP', apply:(p,r)=>{ p.lifesteal+=0.7*r; } },
    { id:'magnet',   emoji:'🧲', name:'จมูกไว',     max:3, per:'ระยะดูด +15%',     apply:(p,r)=>{ p.pickup*=(1+0.15*r); } },
    { id:'deepFreeze',emoji:'❄️', name:'เยือกลึก',   max:1, per:'✦ signature: Frost Pulse รัศมีกว้าง + แช่นานขึ้นมาก!', apply:(p,r)=>{ p.deepFreeze=true; } },
  ],
  cocoa: [   // สายจอมพลัง — ดาเมจ/คริติคอลจัดเต็ม
    { id:'dmg',     emoji:'💥', name:'พลังทำลาย',  max:6, per:'ดาเมจ +10%',      apply:(p,r)=>{ p.dmgMul*=(1+0.10*r); } },
    { id:'crit',    emoji:'🎯', name:'สังหาร',     max:5, per:'โอกาสคริติคอล +6% (ตีแรง ×1.8)', apply:(p,r)=>{ p.critChance+=0.06*r; } },
    { id:'spd',     emoji:'👟', name:'ฝีเท้า',     max:3, per:'ความเร็ว +5%',    apply:(p,r)=>{ p.baseSpeed*=(1+0.05*r); } },
    { id:'lifesteal',emoji:'🩸', name:'กระหาย',    max:3, per:'ฆ่าศัตรูฟื้น +0.6 HP', apply:(p,r)=>{ p.lifesteal+=0.6*r; } },
    { id:'donutImpact', emoji:'🍩', name:'ระเบิดยักษ์', max:1, per:'✦ signature: Donut Drop ลูกใหญ่ขึ้น + ระเบิด AoE กว้าง!', apply:(p,r)=>{ p.donutImpact=true; } },
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

/* ---- COMBOS: สกิลโจมตี (a) + สกิลติดตัว (b) เข้าคู่กัน = ปลดโบนัส (ธง this.comboFlags ตอน cast) ---- */
const COMBOS = [
  { key:'storm',     a:'thunder',  b:'crit',   emoji:'⚡🎯', name:'ฟ้าคริติคอล',  desc:'ฟ้าผ่าแรงขึ้น 40%' },
  { key:'firestorm', a:'chili',    b:'power',  emoji:'🌶️💥', name:'พายุเพลิง',    desc:'วงพริก/ครีมหมุนแรงขึ้น' },
  { key:'ricochet',  a:'sprinkle', b:'haste',  emoji:'🍬⏩', name:'ลูกกวาดพเนจร', desc:'ลูกกวาด/คุกกี้เด้งเพิ่ม' },
  { key:'fizz',      a:'popcorn',  b:'magnet', emoji:'🍿🧲', name:'โซดาแตกฟอง',   desc:'ป๊อปคอร์น/ฟองแรงขึ้น +25%' },
];

/* ---- UPGRADES (ระบบ "พรสวรรค์"): 3 สแตตถาวร HP/ATK/DEF ที่ต้องอัพให้เต็มแล้ว "เลื่อนยศ" ----
   วนลูป: อัพ 3 สแตตให้เต็ม (Lv TAL_MAX) → เลื่อนยศ (rank++) → สแตตติดตัวเพิ่มถาวร +
   การ์ด 3 ใบรีเซ็ตกลับ Lv0 + ราคาแพงขึ้น (×(1+rank·0.8)) → อัพเต็มใหม่ → เลื่อนยศ ... ไปเรื่อย ๆ
   ผลรวมที่ใช้จริง = rank·TAL_MAX + เลเวลรอบนี้ (ยศยิ่งสูง สแตตยิ่งเยอะ · ดาเมจเป็น flat กันเวอร์) */
const TAL_MAX = 5;   // แต่ละสแตตอัพได้ Lv1..TAL_MAX ต่อรอบยศ
const UPGRADES = {
  hp:  { emoji:'❤️', tag:'HP',  name:'พลังชีวิต', unit:'HP สูงสุด +16/เลเวล', color:0xff5f7a, base:30, per:16,
         apply:(p,tot)=>{ p.maxhp+=16*tot; },                          show:tot=>'+'+(16*tot)+' HP' },
  dmg: { emoji:'⚔️', tag:'ATK', name:'พลังโจมตี', unit:'ดาเมจตรง +2/เลเวล',  color:0xf0a54a, base:45, per:2,
         apply:(p,tot)=>{ p.flatDmg=(p.flatDmg||0)+2*tot; },           show:tot=>'+'+(2*tot)+' ดาเมจ' },
  def: { emoji:'🛡️', tag:'DEF', name:'ป้องกัน',   unit:'ลดดาเมจที่รับ ~1.5%/เลเวล', color:0x6ec6ff, base:40, per:1,
         apply:(p,tot)=>{ p.dmgTakenMul*=Math.pow(0.985,tot); },       show:tot=>'-'+Math.round((1-Math.pow(0.985,tot))*100)+'% ดาเมจรับ' },
};
const UPG_ORDER=['hp','dmg','def'];
/* ---- ยศ (rank): ไต่ไปเรื่อย ๆ · ชื่อวนถึงตัวสุดท้ายแล้วต่อท้าย +N ---- */
const RANK_TIERS = [
  { name:'มือใหม่' }, { name:'ผู้ฝึกหัด' }, { name:'นักผจญภัย' },
  { name:'ผู้ชำนาญครัว' }, { name:'ยอดฝีมือ' }, { name:'ตำนานครัว' },
];
function rankName(rank){ const n=RANK_TIERS.length; if(rank<n)return RANK_TIERS[rank].name;
  return RANK_TIERS[n-1].name+' +'+(rank-n+1); }
function promoteReward(rank){ return 50+rank*40; }   // 🍬 โบนัสตอนเลื่อนยศ

/* ---- GEAR: ของสวมใส่ 2 ช่อง (weapon/charm) ซื้อด้วย Sugar แล้วสวมใส่ ---- */
// ของสวมใส่ · ตีบวกได้ (lv=ระดับตีบวก 0..enhMax) เพิ่มพลังต่อระดับ
const GEAR_ENH_MAX = 5;
function gearEnhCost(lv){ return 60+lv*55; }   // 🍬 ค่าตีบวก +1..+5 (60/115/170/225/280)
// 6 ช่องสวมใส่ (แบบ isekai drifter) · แต่ละช่องมีของ "ไม่สวม" ฟรี + ของซื้อ 2 ชิ้น · ตีบวกได้
const GEAR_SLOTS = [
  { slot:'weapon', label:'อาวุธ',   emoji:'⚔️' },
  { slot:'gloves', label:'ถุงมือ',  emoji:'🧤' },
  { slot:'armor',  label:'เกราะ',   emoji:'🛡️' },
  { slot:'boots',  label:'รองเท้า', emoji:'👢' },
  { slot:'amulet', label:'สร้อย',   emoji:'📿' },
  { slot:'ring',   label:'แหวน',    emoji:'💍' },
];
const GEAR = {
  weapon: [
    { id:'w_spoon', tier:"start", emoji:'🥄', name:'ช้อนไม้',      cost:0,   enh:true, desc:'ดาเมจ +5% (+2%/ตีบวก)',  apply:(p,lv)=>{ p.dmgMul*=(1+0.05+0.02*lv); } },
    { id:'w_chop', tier:"common",  emoji:'🥢', name:'ตะเกียบเหล็ก', cost:120, enh:true, desc:'ดาเมจ +12% (+3%/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.12+0.03*lv); } },
    { id:'w_knife', tier:"rare", emoji:'🔪', name:'มีดเชฟ',       cost:300, enh:true, desc:'ดาเมจ +22% (+4%/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.22+0.04*lv); } },
  ],
  gloves: [
    { id:'gl_none', tier:"start", emoji:'🧤', name:'ไม่สวม',       cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'gl_mitt', tier:"common", emoji:'🧤', name:'ถุงมือเตาอบ',  cost:140, enh:true, desc:'คริ +5% (+1%/ตีบวก)',        apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.05+0.01*lv; } },
    { id:'gl_iron', tier:"rare", emoji:'🥊', name:'นวมเหล็ก',      cost:320, enh:true, desc:'คริ +9% · ดาเมจ +4% (+1%·+1%/ตีบวก)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.09+0.01*lv; p.dmgMul*=(1+0.04+0.01*lv); } },
  ],
  armor: [
    { id:'ar_none', tier:"start",  emoji:'🥋', name:'ไม่สวม',      cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'ar_apron', tier:"common", emoji:'🥋', name:'ผ้ากันเปื้อน', cost:130, enh:true, desc:'HP +45 (+12/ตีบวก)',        apply:(p,lv)=>{ p.maxhp+=45+12*lv; } },
    { id:'ar_plate', tier:"rare", emoji:'🛡️', name:'เกราะฝาหม้อ',  cost:340, enh:true, desc:'HP +90 · ลดดาเมจ 6% (+18HP/ตีบวก)', apply:(p,lv)=>{ p.maxhp+=90+18*lv; p.dmgTakenMul*=Math.pow(0.94,1+lv*0.5); } },
  ],
  boots: [
    { id:'bo_none', tier:"start",  emoji:'👢', name:'ไม่สวม',      cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'bo_soft', tier:"common",  emoji:'👟', name:'รองเท้านุ่ม',  cost:110, enh:true, desc:'ความเร็ว +8% (+2%/ตีบวก)',   apply:(p,lv)=>{ p.baseSpeed*=(1+0.08+0.02*lv); } },
    { id:'bo_swift', tier:"rare", emoji:'👢', name:'บูตว่องไว',    cost:300, enh:true, desc:'ความเร็ว +14% · ดูด +15% (+3%/ตีบวก)', apply:(p,lv)=>{ p.baseSpeed*=(1+0.14+0.03*lv); p.pickup*=(1+0.15+0.03*lv); } },
  ],
  amulet: [
    { id:'am_none', tier:"start",   emoji:'📿', name:'ไม่สวม',     cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'am_ribbon', tier:"common", emoji:'🎀', name:'โบว์นำโชค',  cost:100, enh:true, desc:'HP +30 (+10/ตีบวก)',          apply:(p,lv)=>{ p.maxhp+=30+10*lv; } },
    { id:'am_star', tier:"rare",   emoji:'⭐', name:'ดาวประกาย',  cost:260, enh:true, desc:'ดาเมจ +8% · HP +15 (+2%·+8/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.08+0.02*lv); p.maxhp+=15+8*lv; } },
  ],
  ring: [
    { id:'ri_none', tier:"start",   emoji:'💍', name:'ไม่สวม',     cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'ri_copper', tier:"common", emoji:'💍', name:'แหวนทองแดง', cost:120, enh:true, desc:'ดาเมจ +5% (+2%/ตีบวก)',       apply:(p,lv)=>{ p.dmgMul*=(1+0.05+0.02*lv); } },
    { id:'ri_gold', tier:"rare",   emoji:'💛', name:'แหวนทองคำ',  cost:320, enh:true, desc:'ดาเมจ +12% · ฟื้น +0.8/วิ (+3%/ตีบวก)', apply:(p,lv)=>{ p.dmgMul*=(1+0.12+0.03*lv); p.regen=(p.regen||0)+0.8+0.2*lv; } },
  ],
};

/* ---- ระบบได้รับอุปกรณ์: ดรอปในด่าน (common) + เปิดกล่องสุ่ม/gacha (หา rare) · ยกเลิกการซื้อ ---- */
const GEAR_ALL=[]; for(const _s in GEAR) for(const _it of GEAR[_s]) GEAR_ALL.push(Object.assign({slot:_s},_it));
function gearPool(tier){ return GEAR_ALL.filter(it=>it.tier===tier); }
const GACHA_COST = 220;   // 🍬 ต่อการเปิดกล่อง 1 ครั้ง
const TIER_LABEL = { start:{name:'เริ่มต้น',color:'#9a90ab'}, common:{name:'ธรรมดา',color:'#8bd3a0'}, rare:{name:'แรร์',color:'#ffcf5a'} };

/* ---- Save: เก็บ Sugar + ความคืบหน้า + upgrades + gear ลง localStorage ---- */
const Save = {
  data:{ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], character:'momo', chars:[], charProg:{}, rank:0 },
  load(){ try{ const s=localStorage.getItem('mochi_save'); if(s)this.data=Object.assign(this.data,JSON.parse(s)); }catch(e){}
    if(!this.data.upgrades)this.data.upgrades={};
    if(!this.data.gear)this.data.gear={};
    if(!this.data.gearLv)this.data.gearLv={};
    if(!this.data.ownedGear)this.data.ownedGear=[];
    const gearDefaults={ weapon:'w_spoon', gloves:'gl_none', armor:'ar_none', boots:'bo_none', amulet:'am_none', ring:'ri_none' };
    for(const slot in gearDefaults){ if(!this.data.gear[slot])this.data.gear[slot]=gearDefaults[slot];
      if(!this.data.ownedGear.includes(gearDefaults[slot]))this.data.ownedGear.push(gearDefaults[slot]); }
    if(!this.data.chars||!this.data.chars.length)this.data.chars=['momo'];
    if(!this.data.character)this.data.character='momo';
    if(!this.data.charProg)this.data.charProg={};
    if(!this.data.bestiary)this.data.bestiary={};
    return this.data; },
  save(){ try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} },
  addSugar(n){ this.data.sugar=(this.data.sugar||0)+n; this.save(); },
  spend(n){ if((this.data.sugar||0)>=n){ this.data.sugar-=n; this.save(); return true; } return false; },
  // ความคืบหน้าตัวละคร (เลเวล/EXP/แต้มพรสวรรค์/ผังที่ลง)
  cp(id){ if(!this.data.charProg[id]) this.data.charProg[id]={ lvl:1, exp:0, tp:0, tal:{} }; return this.data.charProg[id]; },
  gearLv(id){ return (this.data.gearLv&&this.data.gearLv[id])||0; },
  enhance(id){ this.data.gearLv[id]=(this.gearLv(id))+1; this.save(); },
  // ระบบยศ (prestige loop): rank ถาวร + เลเวลรอบปัจจุบัน (0..TAL_MAX)
  talLvl(k){ return this.data.upgrades[k]||0; },
  talTotal(k){ return (this.data.rank||0)*TAL_MAX + this.talLvl(k); },   // ผลรวมที่ใช้จริง (ยศ+รอบนี้)
  talCost(k){ const lvl=this.talLvl(k), rank=this.data.rank||0; return Math.round(UPGRADES[k].base*(lvl+1)*(1+rank*0.8)); },
  talAllMax(){ return UPG_ORDER.every(k=>this.talLvl(k)>=TAL_MAX); },
  talFilled(){ let t=0; for(const k of UPG_ORDER) t+=this.talLvl(k); return t; },   // ความคืบหน้ารอบนี้
  buyTal(k){ if(this.talLvl(k)>=TAL_MAX)return false; const c=this.talCost(k); if(!this.spend(c))return false;
    this.data.upgrades[k]=this.talLvl(k)+1; this.save(); return true; },
  promote(){ if(!this.talAllMax())return 0; const rank=this.data.rank||0; const rew=promoteReward(rank);
    this.data.rank=rank+1; for(const k of UPG_ORDER) this.data.upgrades[k]=0;
    this.data.sugar=(this.data.sugar||0)+rew; this.save(); return rew; },
  reset(){ try{ localStorage.removeItem('mochi_save'); }catch(e){}
    this.data={ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], character:'momo', chars:[], charProg:{}, rank:0, bestiary:{} }; this.load(); },
  // ---- Bestiary (Monster Card) ----
  kills(type){ return (this.data.bestiary&&this.data.bestiary[type])||0; },
  addKill(type){ if(!this.data.bestiary)this.data.bestiary={};
    this.data.bestiary[type]=(this.data.bestiary[type]||0)+1; },
};

/* ---- BESTIARY: สมุดมอนสเตอร์ · ฆ่ามอนเก็บสถิติ → ปลดโบนัสถาวร 5 ระดับ ---- */
const BESTIARY_THRESHOLDS = [10, 50, 200, 600, 2000];
const BESTIARY = [
  { id:'basic',   emoji:'🟢', name:'สไลม์เปรี้ยว',  tex:'e_basic',   desc:'มอนสเตอร์ขนมเปรี้ยวพื้นฐาน',
    bonus:[{hp:3},{hp:6},{hp:10},{hp:15,def:0.02},{hp:25,def:0.04}] },
  { id:'fast',    emoji:'🔵', name:'สไลม์เร็ว',      tex:'e_fast',    desc:'เคลื่อนที่ไว เข้าถึงเร็ว',
    bonus:[{spd:0.02},{spd:0.04},{spd:0.06},{spd:0.08,cdr:0.02},{spd:0.12,cdr:0.04}] },
  { id:'tank',    emoji:'🟣', name:'สไลม์ถึก',       tex:'e_tank',    desc:'ตัวใหญ่ ทนทาน HP เยอะ',
    bonus:[{def:0.02},{def:0.04},{def:0.06},{def:0.08,hp:10},{def:0.12,hp:20}] },
  { id:'shooter', emoji:'🟡', name:'สไลม์ปืน',       tex:'e_shooter', desc:'ยิงกระสุนระยะไกล',
    bonus:[{dmg:0.02},{dmg:0.04},{dmg:0.06},{dmg:0.08,crit:0.02},{dmg:0.12,crit:0.04}] },
  { id:'bomber',  emoji:'🟠', name:'สไลม์ระเบิด',    tex:'e_bomber',  desc:'ระเบิดตอนตาย — อยู่ใกล้โดนด้วย!',
    bonus:[{crit:0.02},{crit:0.03},{crit:0.05},{crit:0.06,dmg:0.04},{crit:0.08,dmg:0.06}] },
  { id:'dasher',  emoji:'🐜', name:'มดนักจู่โจม',    tex:'e_dasher',  desc:'รอจังหวะ แล้วพุ่งใส่เร็วจี๋!',
    bonus:[{cdr:0.02},{cdr:0.03},{cdr:0.05},{cdr:0.06,spd:0.04},{cdr:0.08,spd:0.06}] },
  { id:'siege',   emoji:'🧁', name:'คัพเค้กปืนใหญ่', tex:'e_siege',   desc:'ถึกโหด เดินบีบวงช้าๆ แต่ทำลายล้างสูง',
    bonus:[{hp:5,def:0.01},{hp:10,def:0.02},{hp:15,def:0.03},{hp:20,def:0.04,dmg:0.03},{hp:30,def:0.06,dmg:0.05}] },
  { id:'mini',    emoji:'👹', name:'มินิบอส',         tex:'mb1',       desc:'หัวหน้าฝูง — แข็งแกร่งกว่าปกติ',
    bonus:[{dmg:0.03},{dmg:0.05},{dmg:0.08},{dmg:0.10,hp:15},{dmg:0.14,hp:25}] },
  { id:'boss',    emoji:'👑', name:'บอสใหญ่',         tex:'boss1',     desc:'ราชาแห่งโซนครัว — ท้าทายที่สุด!',
    bonus:[{hp:8,dmg:0.03},{hp:15,dmg:0.05},{hp:25,dmg:0.08,def:0.03},{hp:35,dmg:0.10,def:0.05},{hp:50,dmg:0.14,def:0.08,crit:0.05}] },
];
function bestiaryLv(type){ const k=Save.kills(type); let lv=0; for(const t of BESTIARY_THRESHOLDS){ if(k>=t)lv++; else break; } return lv; }
function bestiaryAllBonus(){
  const out={hp:0,dmg:0,def:0,spd:0,cdr:0,crit:0};
  for(const m of BESTIARY){ const lv=bestiaryLv(m.id); if(lv<1)continue;
    const b=m.bonus[lv-1]; if(b.hp)out.hp+=b.hp; if(b.dmg)out.dmg+=b.dmg; if(b.def)out.def+=b.def;
    if(b.spd)out.spd+=b.spd; if(b.cdr)out.cdr+=b.cdr; if(b.crit)out.crit+=b.crit; }
  return out;
}

/* ---- STAGES: 5 โซนครัว · แต่ละด่าน = เวฟ → มินิบอส (กลางด่าน) → บอสใหญ่ (จบด่าน) ---- */
/* ---- STAGE_PROPS: เลย์เอาต์ props ต่อด่าน [key,x,y,solid,scale] — ทำแผนที่ให้เป็น "ห้อง" ที่ออกแบบไว้ ----
   ผู้เล่นเกิดที่ (0,0) · solid=true แลนด์มาร์กชนได้ · ที่เหลือเดินทะลุ · เว้นกลางห้องโล่งให้สู้ */
const STAGE_PROPS = {
  0: (()=>{ const a=[];                                            // ด่าน 1: ห้องแพนทรี (props อาร์ต AI)
    let xs=-700; for(const k of ['p_shelf','p_cupboard','p_spicerack','p_shelf','p_cupboard','p_spicerack']){ a.push([k,xs,-1140,false,0.6]); xs+=285; }   // ขอบบน
    xs=-700; for(const k of ['p_spicerack','p_shelf','p_cupboard','p_spicerack','p_shelf','p_cupboard']){ a.push([k,xs,1140,false,0.6]); xs+=285; }        // ขอบล่าง
    let ys=-820; for(const k of ['p_crate','p_boxes','p_sugarbarrel','p_crate','p_boxes','p_candybarrel']){ a.push([k,-880,ys,false,0.58]); ys+=320; }      // ขอบซ้าย
    ys=-820; for(const k of ['p_boxes','p_candybarrel','p_crate','p_sugarbarrel','p_boxes','p_crate']){ a.push([k,880,ys,false,0.58]); ys+=320; }           // ขอบขวา
    a.push(['p_sack',-720,-1000,false,0.6],['p_flour',720,-1000,false,0.6],['p_sack',720,1000,false,0.6],['p_flour',-720,1000,false,0.6]);   // มุมห้อง
    a.push(['p_cans',520,-480,true,0.8],['p_sugarbarrel',-540,520,true,0.78]);   // แลนด์มาร์กชนได้ (แค่ 2 ชิ้น วางห่างกลาง)
    a.push(['p_cupboard',-460,-620,false,0.6],['p_crate',600,600,false,0.58],['p_jars',360,320,false,0.55],['p_honey',-360,-280,false,0.55],['p_rollingpin',-600,-100,false,0.55],['p_board',560,200,false,0.55],['p_jamspice',220,-640,false,0.52],['p_measure',420,680,false,0.52],['p_flourspill',-300,700,false,0.55],['p_mouse',-160,-380,false,0.5]);  // ของประดับ
    return a; })(),
};

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
    this.viewZoom=0.70;                                    // <1 = ซูมออก มองกว้างขึ้น (เห็นโลกมากขึ้น ~43%)
    this.W=this.scale.width/this.DPR; this.H=this.scale.height/this.DPR;  // พิกัดใช้งาน = CSS px (เหมือนเดิม)
    this.state='menu'; this.elapsed=0; this.kills=0;
    this.level=1; this.xp=0; this.xpNext=3;
    Save.load(); this.comboFlags={}; this.combosOwned={}; this.sugarStage=0; this.sugarRun=0;

    this.cameras.main.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    // พื้นหลังโซนครัว (รูปจริง) — เลเยอร์ใต้สุด + กริดเส้นจาง ๆ ทับไว้เป็นจุดอ้างอิงการเคลื่อนที่
    this.bgTile=this.camWorld(this.add.tileSprite(0,0,WORLD,WORLD,'bg1').setOrigin(0.5).setDepth(-100002).setAlpha(1));
    this.bgTile.tileScaleX=this.bgTile.tileScaleY=1.6;
    this.gridBg=this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,0,COLORS.grid,0.10).setDepth(-100000);   // เส้นกริดจางลง (พื้นสวยแล้ว)
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
    this.chests=this.physics.add.group({maxSize:6});         // หีบสมบัติ (ดรอปจากบอส → สุ่มสกิล)
    this.vacs  =this.physics.add.group({maxSize:8});         // ไอเทมแม่เหล็ก (ดูดออร์บทั้งจอ)
    this.loots =this.physics.add.group({maxSize:12});        // ของสวมใส่ดรอปในด่าน (low tier)
    this.decoProps=this.add.group();                         // props ประดับ (เดินทะลุได้)
    this.solidProps=this.physics.add.staticGroup();          // props แลนด์มาร์ก (ชนได้)

    this.ringBalls=[];
    this.physics.add.collider(this.player,this.solidProps);
    this.physics.add.collider(this.enemies,this.solidProps);
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.touchEnemy,null,this);
    this.physics.add.overlap(this.player,this.orbs,this.collectOrb,null,this);
    this.physics.add.overlap(this.player,this.foeBullets,this.hitByFoe,null,this);
    this.physics.add.overlap(this.player,this.heals,this.collectHeal,null,this);
    this.physics.add.overlap(this.bullets,this.crates,this.hitCrate,null,this);
    this.physics.add.overlap(this.player,this.chests,this.collectChest,null,this);
    this.physics.add.overlap(this.player,this.vacs,this.collectVac,null,this);
    this.physics.add.overlap(this.player,this.loots,this.collectLoot,null,this);

    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';  // ตัวละครที่เลือก (จาก Save)
    const starter=CHARACTERS[this.character].starter||'sprinkle';
    this.skills={ [starter]: 1 };          // auto-cast skills owned {key:level}  (≤ SKILL_CAP)
    this.passives={};                      // passive skills owned {key:level}   (≤ PASSIVE_CAP)
    this.skillCd={}; for(const k in SKILLDEFS) this.skillCd[k]=0;
    this.whirlAng=0;

    this.dashTime=0; this.dashReady=true; this.dashCd=0;
    this.moveDir=new Phaser.Math.Vector2(0,-1);

    this.input.addPointer(2);
    this.joy={active:false,id:-1,bx:0,by:0,dx:0,dy:0};
    this.lvlCards=[]; this.dmgPool=[]; this.tapZones=[]; this.menuScreen='hub';

    this.buildHUD(); this.buildMenus(); this.showMenu();
    this.setupCameras();
    this.setupParticles();
    this.setupInput();
    this.scale.on('resize',this.onResize,this);
  }

  /* ---------- PARTICLE EMITTERS (native, reused) ----------
     สร้าง emitter ถาวรไม่กี่ตัว แล้วสั่ง burst ที่พิกัดไหนก็ได้ด้วย emitParticleAt
     → reuse ตัวเดียวทุกครั้ง (ไม่สร้าง GameObject ใหม่ต่อการตาย/ตี) + วาด batch เดียว = ลื่นบนมือถือ
     ทุกตัว emitting:false (นิ่งจนกว่าจะสั่ง) และ camWorld (ให้กล้อง UI ข้าม) */
  setupParticles(){
    const add=(tex,cfg,depth)=>{
      if(!this.textures||!this.textures.exists(tex))return null;
      const em=this.add.particles(0,0,tex,Object.assign({emitting:false},cfg));
      if(em){ em.setDepth(depth); this.camWorld(em); }
      return em;
    };
    // ประกายกระแทก (ตี/เก็บ) — เรืองแสงพุ่งออกแล้วจางหด
    this.pSpark=add('spark',{ speed:{min:40,max:170}, scale:{start:0.55,end:0}, alpha:{start:0.95,end:0},
      lifespan:{min:200,max:360}, blendMode:'ADD', rotate:{min:0,max:360} }, 9);
    // ควันตาย — ก้อนนุ่มขยายแล้วจาง ลอยขึ้นเล็กน้อย
    this.pSmoke=add('vfx_poof',{ speed:{min:12,max:60}, scale:{start:0.28,end:0.95}, alpha:{start:0.7,end:0},
      lifespan:{min:280,max:460}, gravityY:-40, rotate:{min:-40,max:40} }, 7);
    // ฝุ่นดีใจ (เลเวลอัพ/ฉลอง) — เม็ดกลมพุ่งกว้างแล้วร่วง
    this.pDust=add('dot',{ speed:{min:60,max:150}, scale:{start:0.9,end:0}, alpha:{start:1,end:0},
      lifespan:{min:340,max:560}, gravityY:120, blendMode:'ADD' }, 9);
  }
  // burst ผ่าน emitter ที่ reuse ได้ (ตั้งสีก่อนแล้วพ่น) — fallback เงียบถ้า emitter ไม่พร้อม
  _emit(em,x,y,color,n){ if(!em)return false; if(color!=null&&em.setParticleTint)em.setParticleTint(color); em.emitParticleAt(x,y,n); return true; }

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
    this._worldObjs=[this.bgTile,this.gridBg,this.shadowG,this.aura,this.player,this.enemies,this.orbs,this.bullets,this.foeBullets,this.heals,this.crates,this.chests,this.vacs,this.loots];
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
      // mute toggle (มุมขวาบน)
      if(this.muteBtn && this.dist(p.x,p.y,this.muteBtn.x,this.muteBtn.y)<28){
        const m=Sfx.toggle(); this.muteTxt.setText(m?'🔇':'🔊'); return; }
      // pause button (เฉพาะตอนเล่น/พัก)
      if(this.pauseBtn && this.pauseBtn.visible && (this.state==='play'||this.state==='paused') && this.dist(p.x,p.y,this.pauseBtn.x,this.pauseBtn.y)<28){
        this.togglePause(); return; }
      if(this.speedBtn && this.speedBtn.visible && this.state==='play' && this.dist(p.x,p.y,this.speedBtn.x,this.speedBtn.y)<28){
        this.setGameSpeed((this.gameSpeed||1)>=3?1:(this.gameSpeed||1)+1); Sfx.select(); return; }
      if(this.state==='paused'){ // แตะปุ่มในเมนูหยุด
        for(const z of (this._pauseBtns||[])){ if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){ Sfx.select(); z.fn(); return; } }
        return; }
      if(this.state==='menu'){ this.handleTap(p.x,p.y); return; }
      if(this.state==='dead'||this.state==='win'){ this.scene.restart(); return; }
      if(this.state==='summary'){ Sfx.select(); this.continueFromSummary(); return; }
      if(this.state==='levelup'){ this.pickCardAt(p.y); return; }
      if(this.state!=='play') return;

      // กดปุ่ม Dash เฉพาะในขอบเขตปุ่ม (มุมขวาล่าง)
      if(this.dashBtn && this.dashBtn.visible && this.dist(p.x,p.y,this.dashBtn.x,this.dashBtn.y)<44){ this.doDash(); return; }

      // แตะจุดอื่นทั้งหมดบนหน้าจอ = จอยสติ๊กลอย ควบคุมทิศทางเดินอิสระด้วยมือเดียว
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
    this.player.setVelocity(d.x*560,d.y*560);
    this.player.iframe=Math.max(this.player.iframe,0.28);
    Sfx.dash();
    this.flashBtn(this.dashBtn);
    this.player.setTint(0xfff6bd);
    this.time.delayedCall(160,()=>this.player.clearTint());
    this._sqX=1.35; this._sqY=0.7;   // ยืดตอนพุ่ง (เจลลี่)
  }

  flashBtn(b){ if(b)this.tweens.add({targets:b,scale:{from:1.25,to:1},duration:220,ease:'Back.out'}); }

  /* ---------- HUD ---------- */
  buildHUD(){
    const pad=14, w=this.W; this._pad=pad; this._barW=w-2*pad;
    this.joyBase=this.add.circle(0,0,62,0xffffff,0.10).setScrollFactor(1).setDepth(50).setVisible(false).setStrokeStyle(2,0xffffff,0.25);
    this.joyKnob=this.add.circle(0,0,26,0xffffff,0.22).setScrollFactor(1).setDepth(51).setVisible(false);

    // dash button (มุมขวาล่าง) — ปุ่มพุ่งหลบสำหรับเล่นมือเดียว
    const dbX = w - 58, dbY = this.H - 78, dbR = 36;
    this.dashBtn=this.add.circle(dbX,dbY,dbR,COLORS.mint,0.22).setScrollFactor(1).setDepth(50).setStrokeStyle(2.5,COLORS.mint,0.85);
    this.dashTxt=this.add.text(dbX,dbY,'💨\nพุ่ง',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#bff3e8',align:'center'}).setOrigin(0.5).setScrollFactor(1).setDepth(51);
    this.dashRing=this.add.graphics().setScrollFactor(1).setDepth(52);

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
    // ปุ่มเร่งความเร็วเกม (x1/x2/x3 แบบ Godot time_scale)
    this.speedBtn=this.add.circle(w-114,pad+64,18,0x000000,0.32).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.3);
    this.speedTxt=this.add.text(w-114,pad+64,'x'+(this.gameSpeed||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#bff5d8'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    // ตัววัด FPS + ความละเอียด (ไว้ดีบั๊ก — เอาออกทีหลังได้)
    this.fpsTxt=this.add.text(w-30,pad+88,'',{fontFamily:'monospace',fontSize:'10px',color:'#8fd0ff'}).setOrigin(1,0).setScrollFactor(1).setDepth(59);
    this.time.addEvent({delay:400,loop:true,callback:()=>{ if(!this.fpsTxt)return;
      const fps=Math.round(this.game.loop.actualFps), bw=Math.round(this.scale.width);
      this.fpsTxt.setText(fps+'fps · '+bw+'p · x'+this.DPR); }});

    this.hudList=[this.dashBtn,this.dashTxt,this.dashRing,this.barG,this.hpIcon,this.xpIcon,this.timeTxt,this.killTxt,this.lvlTxt,this.stageTxt,this.pipG,this.pauseBtn,this.pauseTxt,this.speedBtn,this.speedTxt];
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
  drawDashRing(){
    const g=this.dashRing; if(!g)return; g.clear(); const b=this.dashBtn; if(!b||!b.visible)return;
    if(!this.dashReady && this.dashCd>0){
      const frac=Phaser.Math.Clamp(1-this.dashCd/1.1,0,1);
      g.lineStyle(3.5,0x66d3b3,0.9); g.beginPath();
      g.arc(b.x,b.y,40,-Math.PI/2,-Math.PI/2+Math.PI*2*frac,false); g.strokePath();
    } else { g.lineStyle(2,0xbff3e8,0.35); g.strokeCircle(b.x,b.y,40); }
  }
  /* แถบ "ถือครองอยู่" — โชว์สกิลโจมตี + สกิลติดตัวที่มีตอนนี้ (ใช้ในเลเวลอัพ/หยุดเกม) · คืน y ล่างสุด */
  drawHeldBar(cont, topY){
    const chip=30, gap=5, labelX=20, chipX0=58;
    const rowFn=(y,label,labelColor,keys,emojiOf,lvlOf,chipColor,awkOf,isPass)=>{
      const lab=this.add.text(labelX,y+chip/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:labelColor}).setOrigin(0,0.5);
      cont.add(lab);
      if(!keys.length){ const none=this.add.text(chipX0,y+chip/2,'— ยังไม่มี',{fontFamily:'sans-serif',fontSize:'11px',color:'#6a6078'}).setOrigin(0,0.5); cont.add(none); return; }
      let x=chipX0;
      keys.forEach(k=>{ const awk=awkOf&&awkOf(k), lvl=lvlOf(k), ik=awk?null:this.iconKey(k,isPass);
        const g=this.add.graphics(); g.fillStyle(0x2c2338,0.95); g.fillRoundedRect(x,y,chip,chip,7);
        g.lineStyle(1.5,awk?0xffcf5a:chipColor,awk?1:0.9); g.strokeRoundedRect(x,y,chip,chip,7);
        const em = ik ? this.add.image(x+chip/2,y+chip/2-1,ik).setDisplaySize(chip*0.82,chip*0.82)
                      : this.add.text(x+chip/2,y+chip/2-1,emojiOf(k),{fontSize:'15px'}).setOrigin(0.5);
        const lt=this.add.text(x+chip-3,y+chip-2,awk?'⚡':String(lvl),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffe08a'}).setOrigin(1,1);
        cont.add([g,em,lt]); x+=chip+gap; });
    };
    const atk=Object.keys(this.skills||{}), pas=Object.keys(this.passives||{});
    rowFn(topY,       '⚔️ สกิล','#f0a54a', atk, k=>SKILLDEFS[k]?SKILLDEFS[k].emoji:'❓', k=>this.skills[k], 0xf0a54a, k=>this.skills[k]>=SKILL_AWAKEN_LV, false);
    rowFn(topY+chip+8,'✨ พร',  '#66d3b3', pas, k=>PASSIVES[k]?PASSIVES[k].emoji:'❓', k=>this.passives[k], 0x66d3b3, null, true);
    return topY+chip*2+8+6;
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
      const ik=awk?null:this.iconKey(k,false);
      let em; if(ik){ em=this.add.image(x,y-1,ik).setDisplaySize(rad*1.85,rad*1.85); em._baseScale=em.scaleX; }
      else { em=this.add.text(x,y-1,awk&&d.awaken?d.awaken.emoji:d.emoji,{fontSize:fs}).setOrigin(0.5); em._baseScale=1; }
      const lv=this.add.text(x+rad*0.75,y+rad*0.7,awk?'⚡':(maxed?'MAX':('L'+lvl)),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:awk?'#ffcf40':(maxed?'#ffd166':'#ffd9e6')}).setOrigin(0.5);
      this.skillBar.add([bg,em,lv]); this.skillChips[k]={bg,em};
      x+=cw;
    });
    this.skillBar.setVisible(this.state==='play'||this.state==='levelup');
    this.checkCombos();
  }
  // ไอคอนรูปจริงของสกิล/พร (ถ้าอาร์ตทำมา) — ไม่มี=คืน null (ใช้อีโมจิแทน)
  iconKey(key,isPass){ const ik=(isPass?PASS_ICON:SKILL_ICON)[key]; return (ik&&this.textures.exists(ik))?ik:null; }
  pulseSkill(k){ const c=this.skillChips&&this.skillChips[k]; if(!c)return; const bs=c.em._baseScale||1;
    this.tweens.add({targets:[c.em],scale:{from:bs*1.4,to:bs},duration:240,ease:'Back.out'});
    this.tweens.add({targets:[c.bg],scale:{from:1.25,to:1},duration:240,ease:'Back.out'}); }
  /* คอมโบสกิล: มีสกิลคู่ครบ = ปลดโบนัส (ธง comboFlags ใช้ตอน cast) */
  checkCombos(){
    this.comboFlags={};
    for(const c of COMBOS){
      if((this.skills[c.a]||0)>0 && (this.passives[c.b]||0)>0){   // สกิลโจมตี a + สกิลติดตัว b
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
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-58,this.H-78); this.dashTxt.setPosition(this.W-58,this.H-78);
      this.timeTxt.setPosition(this.W/2,pad+30); this.killTxt.setPosition(this.W-pad,pad+32);
      this.stageTxt.setPosition(this.W/2,pad+54);
      if(this.skills&&(this.state==='play'||this.state==='levelup')){ this.buildSkillBar(); this.drawWavePips(); }
      if(this.muteBtn){ this.muteBtn.setPosition(this.W-30,pad+64); this.muteTxt.setPosition(this.W-30,pad+64); }
      if(this.pauseBtn){ this.pauseBtn.setPosition(this.W-72,pad+64); this.pauseTxt.setPosition(this.W-72,pad+64); }
      if(this.speedBtn){ this.speedBtn.setPosition(this.W-114,pad+64); this.speedTxt.setPosition(this.W-114,pad+64); }
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
  // ปุ่มลูกกวาด (รูปจริง) — สตรอว์เบอร์รีอยู่ซ้าย ข้อความเลื่อนไปขวา · มี fallback graphics ถ้ารูปโหลดไม่ได้
  _lighten(c,amt){ const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
    return ((Math.round(r+(255-r)*amt))<<16)|((Math.round(g+(255-g)*amt))<<8)|Math.round(b+(255-b)*amt); }
  _darken(c,amt){ const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
    return ((Math.round(r*(1-amt)))<<16)|((Math.round(g*(1-amt)))<<8)|Math.round(b*(1-amt)); }
  // ปุ่มแบนโมเดิร์น: โค้งมน + ไล่เฉด + กลอสบน + ไอคอนวงกลมซ้าย + เงานุ่ม
  uiPillBtn(cont, cx, cy, w, h, color, emoji, label, fn){
    const r=Math.min(h*0.36,24), x=cx-w/2, y=cy-h/2, g=this.add.graphics();
    g.fillStyle(0x000000,0.26); g.fillRoundedRect(x,y+5,w,h,r);                                  // เงาใต้ปุ่ม
    g.fillGradientStyle(this._lighten(color,0.22),this._lighten(color,0.22),color,color,1); g.fillRoundedRect(x,y,w,h,r);  // ตัวปุ่มไล่เฉด
    g.fillStyle(0xffffff,0.20); g.fillRoundedRect(x+4,y+4,w-8,h*0.40,{tl:r,tr:r,bl:5,br:5});     // กลอสบน
    g.lineStyle(2,this._lighten(color,0.45),0.7); g.strokeRoundedRect(x,y,w,h,r);                 // ขอบสว่าง
    cont.add(g);
    const icx=x+h*0.56, ig=this.add.graphics(); ig.fillStyle(this._darken(color,0.14),0.55); ig.fillCircle(icx,cy,h*0.32); cont.add(ig);
    const em=this.add.text(icx,cy-1,emoji,{fontSize:Math.round(h*0.4)+'px'}).setOrigin(0.5); cont.add(em);
    const t=this.add.text(x+h*1.06,cy,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.round(h*0.34)+'px',color:'#ffffff'}).setOrigin(0,0.5);
    t.setShadow(0,2,'rgba(0,0,0,0.32)',3); cont.add(t);
    if(fn)this._zone(x,y,w,h,fn); }
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
    if(s==='stage')this.buildStageSelect(); else if(s==='upgrade')this.buildUpgrade(); else if(s==='gear')this.buildGear(); else if(s==='char')this.buildChars(); else if(s==='news')this.buildNews(); else if(s==='bestiary')this.buildBestiary(); else this.buildHub(); }
  // หน้าอัปเดต/ดาวน์โหลด — โชว์เวอร์ชันปัจจุบัน + บันทึกอัปเดต + ลิงก์ดาวน์โหลดแอป
  buildNews(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('อัปเดต');
    const w=this.W,h=this.H;
    const cur=this.add.text(w/2,h*0.1,'เวอร์ชันปัจจุบัน  v'+GAME_VERSION,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffe08a'}).setOrigin(0.5);
    this.menu.add(cur);
    // ปุ่มดาวน์โหลด APK (เปิดหน้า releases ในเบราว์เซอร์)
    const dlW=Math.min(w-40,320), dx=w/2-dlW/2, dy=h*0.15;
    const dg=this.add.graphics(); dg.fillStyle(COLORS.mint,1); dg.fillRoundedRect(dx,dy,dlW,44,14); dg.lineStyle(2,0xffffff,0.3); dg.strokeRoundedRect(dx,dy,dlW,44,14);
    const dt=this.add.text(w/2,dy+22,'📥 ดาวน์โหลดแอป (APK)',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#12331f'}).setOrigin(0.5);
    this.menu.add([dg,dt]); this._zone(dx,dy,dlW,44,()=>{ try{ window.open(RELEASES_URL,'_blank'); }catch(e){} });
    // รายการบันทึกอัปเดต (เลื่อนดูไม่ได้ — โชว์ 3 เวอร์ชันล่าสุดพอ)
    let y=h*0.27;
    for(const c of CHANGELOG.slice(0,3)){
      const cw=Math.min(w-32,420), cx=w/2-cw/2;
      const head=this.add.text(cx+4,y,'v'+c.v+'  ·  '+c.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ff9ec4'}).setOrigin(0,0);
      const dd=this.add.text(cx+cw-4,y+2,c.date,{fontFamily:'sans-serif',fontSize:'11px',color:'#7a7088'}).setOrigin(1,0);
      this.menu.add([head,dd]); y+=24;
      for(const it of c.items){
        const li=this.add.text(cx+10,y,'•  '+it,{fontFamily:'sans-serif',fontSize:'12.5px',color:'#c7bdd6',wordWrap:{width:cw-20}}).setOrigin(0,0);
        this.menu.add(li); y+=li.height+4;
      }
      y+=12;
    }
    this.menu.setVisible(true);
  }
  buildBestiary(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('📖 สมุดมอนสเตอร์');
    const w=this.W,h=this.H;
    // สรุปโบนัสรวม
    const bb=bestiaryAllBonus(), parts=[];
    if(bb.hp)parts.push('HP+'+bb.hp); if(bb.dmg)parts.push('ATK+'+Math.round(bb.dmg*100)+'%');
    if(bb.def)parts.push('DEF+'+Math.round(bb.def*100)+'%'); if(bb.spd)parts.push('SPD+'+Math.round(bb.spd*100)+'%');
    if(bb.cdr)parts.push('CDR+'+Math.round(bb.cdr*100)+'%'); if(bb.crit)parts.push('CRIT+'+Math.round(bb.crit*100)+'%');
    const sumTxt=this.add.text(w/2,82,parts.length?('โบนัสรวม: '+parts.join(' · ')):'ฆ่ามอนสเตอร์เพื่อสะสมโบนัสถาวร!',
      {fontFamily:'sans-serif',fontSize:'12px',color:'#ffe08a',wordWrap:{width:w-40}}).setOrigin(0.5);
    this.menu.add(sumTxt);
    // การ์ดมอนสเตอร์ — 2 คอลัมน์
    const cols=2, cardW=Math.min((w-48)/cols, 180), gap=10, marginX=(w-cardW*cols-gap*(cols-1))/2;
    const cardH=118; let y0=104;
    const starColors=['#4a4059','#8bd3a0','#7fc9ff','#b98cff','#ffd166','#ff8fb5'];
    BESTIARY.forEach((m,idx)=>{
      const col=idx%cols, row=Math.floor(idx/cols);
      const cx=marginX+col*(cardW+gap), cy=y0+row*(cardH+gap);
      const lv=bestiaryLv(m.id), kills=Save.kills(m.id);
      const next=lv<5?BESTIARY_THRESHOLDS[lv]:null;
      const g=this.add.graphics();
      g.fillStyle(lv>0?0x2c2338:0x201a2a,1); g.fillRoundedRect(cx,cy,cardW,cardH,12);
      g.lineStyle(2,lv>=5?0xffd166:(lv>0?0x4a4059:0x39304a),1); g.strokeRoundedRect(cx,cy,cardW,cardH,12);
      if(lv>=5){ g.fillStyle(0xffd166,0.08); g.fillRoundedRect(cx,cy,cardW,cardH,12); }
      // icon
      const hasTex=this.textures.exists(m.tex);
      const icon=hasTex?this.add.image(cx+28,cy+30,m.tex).setDisplaySize(36,36):
        this.add.text(cx+28,cy+30,m.emoji,{fontSize:'28px'}).setOrigin(0.5);
      if(!hasTex)icon.setOrigin(0.5);
      // ชื่อ
      const nm=this.add.text(cx+52,cy+12,m.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:lv>0?'#ffffff':'#7a7088'}).setOrigin(0,0);
      // ดาว ★
      let starStr='';
      for(let s=0;s<5;s++) starStr+=(s<lv?'★':'☆');
      const stars=this.add.text(cx+52,cy+28,starStr,{fontFamily:'sans-serif',fontSize:'13px',color:starColors[lv]||'#4a4059'}).setOrigin(0,0);
      // จำนวนฆ่า + progress
      const killStr='กำจัด: '+kills+(next?' / '+next:'');
      const kt=this.add.text(cx+8,cy+52,killStr,{fontFamily:'sans-serif',fontSize:'10.5px',color:'#b7abc9'}).setOrigin(0,0);
      // progress bar
      const barW=cardW-16, barH=6, bx=cx+8, by=cy+66;
      g.fillStyle(0x1a1420,1); g.fillRoundedRect(bx,by,barW,barH,3);
      const pct=next?Math.min(1,kills/next):1;
      const barColor=lv>=5?0xffd166:(lv>=3?0xb98cff:0x8bd3a0);
      if(pct>0){ g.fillStyle(barColor,1); g.fillRoundedRect(bx,by,Math.max(6,barW*pct),barH,3); }
      // bonus text
      const bDef=lv>0?m.bonus[lv-1]:m.bonus[0];
      const bParts=[];
      if(bDef.hp)bParts.push('HP+'+bDef.hp); if(bDef.dmg)bParts.push('ATK+'+Math.round(bDef.dmg*100)+'%');
      if(bDef.def)bParts.push('DEF+'+Math.round(bDef.def*100)+'%'); if(bDef.spd)bParts.push('SPD+'+Math.round(bDef.spd*100)+'%');
      if(bDef.cdr)bParts.push('CDR+'+Math.round(bDef.cdr*100)+'%'); if(bDef.crit)bParts.push('CRIT+'+Math.round(bDef.crit*100)+'%');
      const bLabel=lv>0?bParts.join(' '):(lv===0?('ถัดไป: '+bParts.join(' ')):'');
      const bt=this.add.text(cx+8,cy+78,bLabel,{fontFamily:'sans-serif',fontSize:'10px',color:lv>0?'#8bd3a0':'#5a5268',wordWrap:{width:cardW-16}}).setOrigin(0,0);
      // desc
      const desc=this.add.text(cx+8,cy+94,m.desc,{fontFamily:'sans-serif',fontSize:'9px',color:'#7a7088',wordWrap:{width:cardW-16}}).setOrigin(0,0);
      this.menu.add([g,icon,nm,stars,kt,bt,desc]);
    });
    this.menu.setVisible(true);
  }
  buildStartMenu(){ this.buildMenuScreen(); }   // เผื่อโค้ดเก่าเรียก
  buildHub(){
    const w=this.W,h=this.H; this.menu.removeAll(true); this.tapZones=[];
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.94).setOrigin(0,0);
    const sugar=this.add.text(w/2,h*0.08,'🍬 Sugar: '+(Save.data.sugar||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffe08a'}).setOrigin(0.5);
    const emoji=this.add.text(w/2,h*0.19,'🍡',{fontSize:'60px'}).setOrigin(0.5);
    const title=this.add.text(w/2,h*0.29,'MOCHI MAYHEM',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'32px',color:'#ff8fb5'}).setOrigin(0.5);
    const ch=CHARACTERS[this.character||'momo'];
    const charTxt=this.add.text(w/2,h*0.35,`${ch.emoji} ${ch.name} · อาวุธ: ${ch.weaponName}`,{fontFamily:'sans-serif',fontSize:'13px',color:'#ffd9a8'}).setOrigin(0.5);
    this.menu.add([bg,sugar,emoji,title,charTxt]);
    // ป้ายเวอร์ชัน (มุมขวาบน) — แตะดูอัปเดต/ดาวน์โหลด
    const vg=this.add.graphics(); vg.fillStyle(0x2c2338,0.9); vg.fillRoundedRect(w-118,12,104,30,10); vg.lineStyle(1.5,0x4a4059,1); vg.strokeRoundedRect(w-118,12,104,30,10);
    const vt=this.add.text(w-66,27,'v'+GAME_VERSION+'  📢',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#bfe8ff'}).setOrigin(0.5);
    this.menu.add([vg,vt]); this._zone(w-118,12,104,30,()=>{ this.menuScreen='news'; this.buildMenuScreen(); });
    const items=[
      [COLORS.pink, '▶','เริ่มเล่น',      ()=>{ this.menuScreen='stage'; this.buildMenuScreen(); }],
      [COLORS.toast,'🎭','เลือกตัวละคร',  ()=>{ this.menuScreen='char'; this.buildMenuScreen(); }],
      [COLORS.grape,'🌟','พรสวรรค์',       ()=>{ this.menuScreen='upgrade'; this.buildMenuScreen(); }],
      [COLORS.mint, '🎽','ของสวมใส่',      ()=>{ this.menuScreen='gear'; this.buildMenuScreen(); }],
      [0xf0a92e,    '📖','สมุดมอนสเตอร์', ()=>{ this.menuScreen='bestiary'; this.buildMenuScreen(); }],
    ];
    // จัดปุ่มให้พอดีในช่วง 0.40–0.90 ของจอ + มีช่องว่างชัดเจนเสมอ (กันปุ่มชิด/ซ้อนบนจอสูง)
    const bx=w/2, bw=Math.min(w-56,330), n=items.length, top=h*0.40, bottom=h*0.90;
    const gap=Math.max(14,h*0.02), bh=Math.min((bottom-top-gap*(n-1))/n, 76);
    const stackH=bh*n+gap*(n-1), y0=top+(bottom-top-stackH)/2+bh/2;
    items.forEach(([color,emoji,label,fn],i)=> this.uiPillBtn(this.menu, bx, y0+i*(bh+gap), bw, bh, color, emoji, label, fn));
    // ปุ่มรีเซ็ตเซฟ (สำหรับเทส) — แตะ 2 ครั้งยืนยัน
    const rt=this.add.text(w/2,h*0.955, this._resetConfirm?'⚠️ แตะอีกครั้งเพื่อล้างทั้งหมด':'🗑️ รีเซ็ตความคืบหน้า',
      {fontFamily:'sans-serif',fontSize:'13px',color:this._resetConfirm?'#ff8fb5':'#7a7088'}).setOrigin(0.5);
    this.menu.add(rt);
    this._zone(w/2-110,h*0.955-16,220,32,()=>{
      if(this._resetConfirm){ Save.reset(); this._resetConfirm=false; this.character='momo'; Sfx.clear(); this.buildMenuScreen(); }
      else { this._resetConfirm=true; Sfx.select(); this.buildMenuScreen(); this.time.delayedCall(3000,()=>{ if(this._resetConfirm){ this._resetConfirm=false; if(this.state==='menu'&&this.menuScreen==='hub')this.buildMenuScreen(); } }); }
    });
    this.menu.setVisible(true);
  }
  buildChars(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('เลือกตัวละคร');
    const y0=this.H*0.15;
    CHAR_ORDER.forEach((id,i)=>{ const c=CHARACTERS[id], y=y0+i*92;
      const owned=Save.data.chars.includes(id), selected=Save.data.character===id, afford=(Save.data.sugar||0)>=c.cost;
      this._rowBtn(y,80,c.emoji,c.name+' · '+c.weaponName,c.desc,
        selected?'เลือกอยู่ ✓':(owned?'เลือก':'🍬'+c.cost),
        selected?'#ffd166':(owned?'#8bd3a0':(afford?'#bfe8ff':'#e0788a')),
        selected?null:()=>{
          if(owned){ Save.data.character=id; Save.save(); this.character=id; }
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
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('พรสวรรค์');
    const w=this.W,h=this.H, rank=Save.data.rank||0, allMax=Save.talAllMax();
    // ---- แถบยศ (rank) ----
    const ry=Math.max(h*0.105, 82);
    const rk=this.add.text(w/2,ry,'ยศปัจจุบัน',{fontFamily:'sans-serif',fontSize:'12px',color:'#b7abc9'}).setOrigin(0.5);
    const rn=this.add.text(w/2,ry+21,'⭐ '+rankName(rank),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'21px',color:'#ffd166'}).setOrigin(0.5);
    this.menu.add([rk,rn]);
    // ความคืบหน้ารอบนี้ (อัพให้เต็มทั้ง 3 เพื่อเลื่อนยศ)
    const barW=Math.min(w-70,440), bx=w/2-barW/2, by=ry+46, barH=12, need=UPG_ORDER.length*TAL_MAX;
    const frac=Phaser.Math.Clamp(Save.talFilled()/need,0,1);
    const bg=this.add.graphics(); bg.fillStyle(0x2c2338,1); bg.fillRoundedRect(bx,by,barW,barH,6);
    bg.fillStyle(allMax?0x8bd3a0:0xffc24a,1); if(frac>0)bg.fillRoundedRect(bx,by,Math.max(barH,barW*frac),barH,6);
    this.menu.add(bg);
    const prog=this.add.text(w/2,by+24,'ความคืบหน้ารอบนี้  '+Save.talFilled()+' / '+need+(allMax?'  ✓ พร้อมเลื่อนยศ!':''),
      {fontFamily:'sans-serif',fontSize:'11.5px',color:allMax?'#8bd3a0':'#8f849f'}).setOrigin(0.5);
    this.menu.add(prog);
    // ---- การ์ดสแตต 3 ใบ (แถวเต็มความกว้าง อ่านง่ายบนพอร์ตเทรต) ----
    const marginX=18, cardW=w-marginX*2, cardH=Math.min((h*0.5)/3-10,96), gapY=12, top=by+42;
    UPG_ORDER.forEach((k,i)=>{ const u=UPGRADES[k], lvl=Save.talLvl(k), tot=Save.talTotal(k), maxed=lvl>=TAL_MAX;
      const cost=maxed?0:Save.talCost(k), afford=(Save.data.sugar||0)>=cost;
      const x=marginX, y=top+i*(cardH+gapY);
      const g=this.add.graphics(); g.fillStyle(0x2c2338,1); g.fillRoundedRect(x,y,cardW,cardH,16);
      g.lineStyle(2.5,maxed?0x8bd3a0:u.color,0.9); g.strokeRoundedRect(x,y,cardW,cardH,16);
      g.fillStyle(u.color,0.14); g.fillRoundedRect(x,y,84,cardH,16);
      const em=this.add.text(x+42,y+cardH*0.36,u.emoji,{fontSize:Math.round(cardH*0.4)+'px'}).setOrigin(0.5);
      // ดาวบอกเลเวลรอบนี้ (เต็ม/ว่าง)
      let stars=''; for(let s=0;s<TAL_MAX;s++) stars+=(s<lvl?'★':'☆');
      const st=this.add.text(x+42,y+cardH*0.78,stars,{fontFamily:'sans-serif',fontSize:'11px',color:maxed?'#8bd3a0':'#ffd166'}).setOrigin(0.5);
      const tag=this.add.text(x+98,y+12,u.tag+'  ·  Lv '+lvl+'/'+TAL_MAX,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#cbbfda'}).setOrigin(0,0);
      const nm=this.add.text(x+98,y+30,u.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffffff'}).setOrigin(0,0);
      const gain=this.add.text(x+98,y+54,'รวมตอนนี้: '+u.show(tot),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12.5px',color:'#8bd3a0'}).setOrigin(0,0);
      // ปุ่มราคา (ขวา)
      const pw=90, ph=34, ppx=x+cardW-pw-12, ppy=y+cardH/2-ph/2;
      const pg=this.add.graphics(); pg.fillStyle(maxed?0x3a3550:(afford?0x2f4a38:0x4a2f38),1); pg.fillRoundedRect(ppx,ppy,pw,ph,10);
      const pt=this.add.text(ppx+pw/2,ppy+ph/2,maxed?'เต็ม ✓':('🍬 '+cost),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:maxed?'#8bd3a0':(afford?'#a8f0c0':'#f0a0b0')}).setOrigin(0.5);
      this.menu.add([g,em,st,tag,nm,gain,pg,pt]);
      if(!maxed) this._zone(ppx,ppy,pw,ph,()=>{ if(Save.buyTal(k)){ Sfx.clear(); } else { Sfx.select(); } this.buildMenuScreen(); });
    });
    // ---- ปุ่มเลื่อนยศ ----
    const py=top+UPG_ORDER.length*(cardH+gapY)+6, bw=Math.min(w-40,320), pbx=w/2;
    const pg=this.add.graphics(); pg.fillStyle(allMax?0xffb020:0x3a3550,1); pg.fillRoundedRect(pbx-bw/2,py,bw,50,16);
    pg.lineStyle(2,allMax?0xffe08a:0x4a4059,allMax?1:0.6); pg.strokeRoundedRect(pbx-bw/2,py,bw,50,16);
    const pl=this.add.text(pbx,py+18,allMax?('⭐ เลื่อนยศ → '+rankName(rank+1)):'⭐ เลื่อนยศ (อัพให้ครบก่อน)',
      {fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:allMax?'#fff':'#7a7088'}).setOrigin(0.5);
    const psub=this.add.text(pbx,py+37,allMax?('รับ 🍬 '+promoteReward(rank)+' · สแตตติดตัวเพิ่ม · การ์ดรีเซ็ต ราคาสูงขึ้น'):'อัพ HP/ATK/DEF ให้เต็มทั้ง 3',
      {fontFamily:'sans-serif',fontSize:'10.5px',color:allMax?'#ffe9c2':'#8f849f'}).setOrigin(0.5);
    this.menu.add([pg,pl,psub]);
    if(allMax) this._zone(pbx-bw/2,py,bw,50,()=>{ const rew=Save.promote(); if(rew>=0){ Sfx.clear();
      if(this.showBanner)this.showBanner('⭐ เลื่อนยศ! '+rankName(Save.data.rank),'รับโบนัส 🍬 '+rew,2400); } this.buildMenuScreen(); });
    this.menu.setVisible(true);
  }
  buildGear(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('อุปกรณ์');
    const w=this.W,h=this.H, id=this.character||Save.data.character||'momo';
    const sel=this.gearSlot||'weapon';
    const cy0=78, topH=Math.min(h*0.34,250);
    // ---- ตัวละคร (portrait) ตรงกลาง ----
    const pcx=w/2, pcy=cy0+topH*0.44, pbW=Math.min(w*0.42,190), pbH=topH*0.86;
    const pbg=this.add.graphics(); pbg.fillStyle(0x241a33,0.7); pbg.fillRoundedRect(pcx-pbW/2,cy0+4,pbW,pbH,18); pbg.lineStyle(2,0x4a4059,0.8); pbg.strokeRoundedRect(pcx-pbW/2,cy0+4,pbW,pbH,18);
    this.menu.add(pbg);
    if(this.textures.exists('char_'+id)){ const sp=this.add.image(pcx,pcy,'char_'+id,0).setScale((topH*0.7)/128); this.menu.add(sp); }
    else { const em=this.add.text(pcx,pcy,CHARACTERS[id].emoji,{fontSize:Math.round(topH*0.5)+'px'}).setOrigin(0.5); this.menu.add(em); }
    // ---- 6 ช่องสวมใส่ (ซ้าย 3 / ขวา 3) ----
    const rowY=[cy0+topH*0.14, cy0+topH*0.44, cy0+topH*0.74];
    const leftX=Math.max(44,w*0.135), rightX=Math.min(w-44,w*0.865), ss=Math.min(56,topH*0.24);
    const layout=[['weapon',leftX,0],['gloves',leftX,1],['amulet',leftX,2],['armor',rightX,0],['boots',rightX,1],['ring',rightX,2]];
    layout.forEach(([slot,sx,ri])=>{ const y=rowY[ri];
      const def=GEAR_SLOTS.find(g=>g.slot===slot), curId=Save.data.gear[slot], it=GEAR[slot].find(g=>g.id===curId)||GEAR[slot][0];
      const lv=Save.gearLv(it.id), on=it.id.indexOf('_none')<0, isSel=slot===sel;
      const g=this.add.graphics(); g.fillStyle(isSel?0x3a3550:0x2c2338,1); g.fillRoundedRect(sx-ss/2,y-ss/2,ss,ss,12);
      g.lineStyle(isSel?3:2, isSel?0xffd166:(on?0x8bd3a0:0x4a4059), 1); g.strokeRoundedRect(sx-ss/2,y-ss/2,ss,ss,12);
      const em=this.add.text(sx,y-2,on?it.emoji:def.emoji,{fontSize:Math.round(ss*0.5)+'px'}).setOrigin(0.5).setAlpha(on?1:0.4);
      this.menu.add([g,em]);
      if(topH>=180){ const lb=this.add.text(sx,y+ss/2+9,def.label,{fontFamily:'sans-serif',fontSize:'10px',color:isSel?'#ffd166':'#9a90ab'}).setOrigin(0.5); this.menu.add(lb); }   // ซ่อนป้ายตอนจอเตี้ย (แนวนอน) กันทับ
      if(on&&lv>0){ const bd=this.add.text(sx+ss/2-4,y-ss/2+2,'+'+lv,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd166'}).setOrigin(1,0); this.menu.add(bd); }
      this._zone(sx-ss/2,y-ss/2,ss,ss+14,()=>{ this.gearSlot=slot; this.buildMenuScreen(); });
    });
    // ---- ปุ่มเปิดกล่องสุ่ม (gacha) — วิธีเดียวที่ได้ของแรร์ ----
    const gbx=w/2, gby=cy0+topH-28, gbw=Math.min(w*0.6,210), gbh=28;
    const afG=(Save.data.sugar||0)>=GACHA_COST;
    const gbg=this.add.graphics(); gbg.fillStyle(afG?0xffb020:0x3a3550,1); gbg.fillRoundedRect(gbx-gbw/2,gby,gbw,gbh,10); gbg.lineStyle(1.5,afG?0xffe08a:0x4a4059,1); gbg.strokeRoundedRect(gbx-gbw/2,gby,gbw,gbh,10);
    const gbt=this.add.text(gbx,gby+gbh/2,'🎁 เปิดกล่องสุ่ม 🍬'+GACHA_COST,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:afG?'#fff':'#7a7088'}).setOrigin(0.5);
    this.menu.add([gbg,gbt]);
    this._zone(gbx-gbw/2,gby,gbw,gbh,()=>{ if((Save.data.sugar||0)>=GACHA_COST && Save.spend(GACHA_COST)){
      const it=this.gachaRoll(); Sfx.clear();
      if(it){ const tl=TIER_LABEL[it.tier]; this.showBanner('🎁 ได้ '+it.emoji+' '+it.name,'ระดับ: '+tl.name,2200); }
      else { Save.addSugar(120); this.showBanner('🎁 ของครบทุกชิ้นแล้ว','คืน 🍬 120',1800); }
    } else Sfx.select(); this.buildMenuScreen(); });
    // ---- คลังไอเทมของช่องที่เลือก ----
    const selDef=GEAR_SLOTS.find(g=>g.slot===sel);
    let y=cy0+topH+10;
    const hdr=this.add.text(w/2,y,selDef.emoji+' '+selDef.label+' — สวมใส่ / ตีบวก (ได้ของจากดรอป+กล่องสุ่ม)',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffd9a8'}).setOrigin(0.5);
    this.menu.add(hdr); y+=22;
    GEAR[sel].forEach(it=>{ const owned=Save.data.ownedGear.includes(it.id), equipped=Save.data.gear[sel]===it.id;
      const lv=Save.gearLv(it.id), canEnh=it.enh&&lv<GEAR_ENH_MAX, ecost=gearEnhCost(lv);
      const tl=TIER_LABEL[it.tier]||TIER_LABEL.common;
      const nm=it.name+(it.tier==='rare'?' ⭐':'')+(lv>0?'  +'+lv:'');
      let label,color,fn;
      if(equipped && canEnh){ const afEnh=(Save.data.sugar||0)>=ecost; label='⚒️ ผสม +'+(lv+1)+' 🍬'+ecost; color=afEnh?'#ffd166':'#e0788a';
        fn=()=>{ if(Save.spend(ecost)){ Save.enhance(it.id); Sfx.clear(); } this.buildMenuScreen(); }; }
      else if(equipped){ label='ใส่อยู่ ✓'; color='#ffd166'; fn=null; }
      else if(owned){ label='สวมใส่'; color='#8bd3a0'; fn=()=>{ Save.data.gear[sel]=it.id; Save.save(); Sfx.select(); this.buildMenuScreen(); }; }
      else { label='🔒 '+tl.name; color=tl.color; fn=null; }   // ยังไม่มี = ล็อก (หาจากดรอป/กล่องสุ่ม) — ไม่มีการซื้อ
      this._rowBtn(y,44,owned?it.emoji:'❔',nm,owned?it.desc:'ยังไม่มี — หาได้จากดรอปในด่าน หรือเปิดกล่องสุ่ม',label,color,fn);
      y+=50;
    });
    this.menu.setVisible(true);
  }
  applyMeta(){
    const p=this.player;
    p.cdMul=1; p.dmgTakenMul=1; p.flatDmg=0;   // ตัวคูณ/ดาเมจตรง (รีเซ็ตก่อน)
    p.critChance=0; p.critMul=1.8; p.regen=0; p.lifesteal=0;   // สแตตเชิงลึก (มาจากพาสซีฟ/ของสวมใส่)
    p.twinSprinkle=false; p.deepFreeze=false; p.donutImpact=false;   // ธง signature เฉพาะตัว (รีเซ็ตก่อน)
    // เลือกตัวละคร
    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
    const ch=CHARACTERS[this.character];
    if(this.textures.exists('char_'+this.character))this.player.setTexture('char_'+this.character);
    this.setCharScale('char_'+this.character);   // รูปจริงตัวใหญ่ → ปรับสเกล/ขอบชนให้เท่ากราฟิกโค้ดเดิม (60px)
    if(this.aura)this.aura.setFillStyle(ch.color||COLORS.mochiEdge,0.14);
    // โบนัสตัวละคร
    if(ch.bonus){ if(ch.bonus.maxhp)p.maxhp+=ch.bonus.maxhp; if(ch.bonus.dmgMul)p.dmgMul*=ch.bonus.dmgMul;
      if(ch.bonus.spd)p.baseSpeed*=ch.bonus.spd; }
    // พรสวรรค์เฉพาะตัว (Signature talents)
    const ctals=Save.cp(this.character).tal||{};
    const myTalDefs=charTalents(this.character);
    for(const def of myTalDefs){ const r=ctals[def.id]||0; if(r>0&&def.apply) def.apply(p,r); }
    // พรสวรรค์ถาวร (HP/ATK/DEF) — ใช้ผลรวม ยศ×TAL_MAX + เลเวลรอบนี้
    for(const k in UPGRADES){ const tot=Save.talTotal(k); if(tot>0)UPGRADES[k].apply(p,tot); }
    for(const slot in GEAR){ const it=GEAR[slot].find(g=>g.id===Save.data.gear[slot]); if(it&&it.apply)it.apply(p, Save.gearLv(it.id)); }
    // Bestiary bonuses (ถาวรจากการสะสมฆ่ามอนสเตอร์)
    const bb=bestiaryAllBonus();
    if(bb.hp)p.maxhp+=bb.hp; if(bb.dmg)p.dmgMul*=(1+bb.dmg); if(bb.def)p.dmgTakenMul*=(1-bb.def);
    if(bb.spd)p.baseSpeed*=(1+bb.spd); if(bb.cdr)p.cdMul*=(1-bb.cdr); if(bb.crit)p.critChance+=bb.crit;
    p.dmgTakenMul=Math.max(0.35,p.dmgTakenMul);   // กันเกราะโกงเกิน (รับดาเมจอย่างน้อย 35%)
    p.hp=p.maxhp;
  }
  // ให้ EXP ตัวละครปัจจุบัน + คำนวณเลเวล/แต้ม (คืน obj สรุปเพื่อโชว์)
  gainCharExp(n){
    if(!n||n<=0)return; const cp=Save.cp(this.character); cp.exp=(cp.exp||0)+Math.round(n);
    let ups=0; while(cp.exp>=charExpNeed(cp.lvl)){ cp.exp-=charExpNeed(cp.lvl); cp.lvl++; cp.tp=(cp.tp||0)+1; ups++; }
    Save.save(); this._lastExpGain=Math.round(n); this._lastLvlUps=ups; return ups;
  }
  showMenu(){ this.state='menu'; Sfx.bgmIntense(false); Sfx.playMainBgm(); this.menuScreen='hub'; if(this.pauseUI)this.pauseUI.setVisible(false); this.buildMenuScreen(); this.hudVisible(false); }
  // หยุดชั่วคราว / เล่นต่อ
  // เร่ง/ลดความเร็วเกมทั้งระบบ (physics + timers + tweens + dt) แบบ Godot time_scale
  setGameSpeed(s){ this.gameSpeed=s;
    if(this.physics&&this.physics.world&&!this._isHitStop) this.physics.world.timeScale=s;
    if(this.tweens) this.tweens.timeScale=s;
    if(this.time) this.time.timeScale=s;
    if(this.speedTxt) this.speedTxt.setText('x'+s); }
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
    const t=this.add.text(w/2,h*0.20,'⏸ หยุดพัก',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'27px',color:'#ff8fb5'}).setOrigin(0.5);
    const sub=this.add.text(w/2,h*0.26,'ด่าน '+((this.stageIndex||0)+1)+' · ฆ่าไป '+this.kills+' ตัว',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0.5);
    this.pauseUI.add([bg,t,sub]);
    // แผงสกิล/พรที่ถือครองอยู่
    const panelY=h*0.31, panelH=90, px=w/2-Math.min(w-40,360)/2, pw=Math.min(w-40,360);
    const pnl=this.add.graphics(); pnl.fillStyle(0x241a33,0.7); pnl.fillRoundedRect(px,panelY,pw,panelH,14); pnl.lineStyle(1.5,0x4a4059,0.8); pnl.strokeRoundedRect(px,panelY,pw,panelH,14);
    const ph=this.add.text(px+14,panelY+10,'ถือครองอยู่',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#cbbfda'}).setOrigin(0,0);
    this.pauseUI.add([pnl,ph]);
    this.drawHeldBar(this.pauseUI, panelY+28);
    const bw=Math.min(w-70,300), bx=w/2, bh=72;
    this.uiPillBtn(this.pauseUI, bx, h*0.55, bw, bh, COLORS.mint, '▶','เล่นต่อ', null);
    this._pauseBtns.push({x:bx-bw/2,y:h*0.55-bh/2,w:bw,h:bh,fn:()=>this.togglePause()});
    this.uiPillBtn(this.pauseUI, bx, h*0.55+bh+16, bw, bh, COLORS.grape, '🏠','ออกจากด่าน', null);
    this._pauseBtns.push({x:bx-bw/2,y:h*0.55+bh+16-bh/2,w:bw,h:bh,fn:()=>this.exitStage()});
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
    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
    const starter=CHARACTERS[this.character].starter||'sprinkle';
    this.skills={ [starter]: 1 }; this.passives={}; this.swarmAcc=null;   // เริ่มรอบใหม่ = ปลดอาวุธเริ่มต้นประจำตัว Lv1
    if(this._auraFx){this._auraFx.destroy();this._auraFx=null;} this._auraTick=0;   // ล้างออร่าถาวรจากรอบก่อน
    this.setGameSpeed(1);   // รีเซ็ตความเร็วเกมทุกรอบ
    this.player.maxhp=100; this.player.baseSpeed=210; this.player.pickup=80; this.player.dmgMul=1;  // รีเซ็ตสแตตฐาน
    this.applyMeta();
    if(starter==='star') this.rebuildRing();
    this.buildSkillBar();
    this.startStage(idx);
  }
  _busy(){ return this.state==='play'||this.state==='levelup'; }  // ยังเล่นอยู่ (levelup แค่พักชั่วคราว)

  /* ---------- STAGES / WAVES (Archero-style) ---------- */
  clearStageProps(){ if(this.decoProps)this.decoProps.clear(true,true); if(this.solidProps)this.solidProps.clear(true,true); }
  // จัดวาง props เป็น "ห้อง" รอบจุดเกิด (0,0) — เดินเรื่องด้วยเลย์เอาต์ที่ตั้งใจ ไม่ใช่พื้นลอย ๆ
  buildStageProps(i){
    this.clearStageProps();
    const add=(key,x,y,solid,sc)=>{ if(!this.textures.exists(key))return; sc=sc||1;
      if(solid){ const s=this.solidProps.create(x,y,key); s.setScale(sc).setDepth(y).refreshBody(); }   // box เต็ม ตำแหน่งถูก (กันวาป) — เล็กลงตาม scale
      else { const im=this.add.image(x,y,key).setScale(sc).setDepth(y); this.camWorld(im); this.decoProps.add(im); } };
    const L=STAGE_PROPS[i]; if(!L)return;
    for(const p of L) add(p[0],p[1],p[2],p[3],p[4]);
  }
  startStage(i){
    const st=STAGES[i]; this.stageIndex=i; this.boss=null; this.mode='breather'; this.waveIndex=0; this.waveAlive=0;
    Sfx.playStageBgm(i+1);
    this.bossUI.forEach(o=>o.setVisible(false));
    this.gridBg.fillColor=st.grid;
    if(this.bgTile&&this.textures.exists('bg'+(i+1))) this.bgTile.setTexture('bg'+(i+1));   // พื้นหลังโซนตามด่าน
    this.buildStageProps(i);   // จัดวาง props ประดับ + แลนด์มาร์ก (ทำแผนที่ให้เป็นห้องจริง)
    this.stageTxt.setText(`ด่าน ${i+1}/${STAGES.length} · ${st.emoji} ${st.name}`);
    this.showBanner(`${st.emoji} ด่าน ${i+1}: ${st.name}`, st.lore, 3000);
    this.updateWaveText();
    this.time.delayedCall(1400,()=>{ if(this._busy()) this.startWave(0); });
  }
  updateWaveText(){
    const st=STAGES[this.stageIndex]; if(!st)return;
    if(this.mode==='boss') this.timeTxt.setText('👹 บอสใหญ่');
    else if(this.mode==='mini') this.timeTxt.setText('💢 มินิบอส — จัดการให้ได้!');
    else if(this.mode==='breather') this.timeTxt.setText('เวฟถัดไป…');
    else this.timeTxt.setText('⚔ เวฟ '+(this.waveIndex+1)+'/'+st.waves+' · ⏳ '+Math.max(0,Math.ceil(this.waveTimer||0))+' วิ');
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
  startWave(w, seamless){
    const st=STAGES[this.stageIndex]; this.waveIndex=w; this.boss=null;
    this.bossUI.forEach(o=>o.setVisible(false));
    if(w===st.miniAt){ this.mode='mini'; this.setupSpawnRates(w); this.spawnAcc=this.spawnInterval*1.2; this.spawnMiniBoss(); }
    else { this.mode='wave'; this.startSurvivalWave(w, seamless); }
    this.updateWaveText();
  }
  // อัตราเกิดมอนสเตอร์ (ยิ่งด่านลึก/เวฟท้าย = เกิดถี่+เยอะ+เพดานสูง)
  setupSpawnRates(w){
    const si=this.stageIndex;
    this.spawnInterval=Math.max(0.42, 1.25 - si*0.1 - w*0.06);   // วินาที/ระลอก
    this.spawnBatch=3 + si + Math.floor(w*0.7);                   // ตัว/ระลอก
    this.maxLive=Math.min(100, 50 + si*14 + w*4);                 // เพดานตัวมีชีวิต (กันเครื่องหน่วง)
    this.eliteEvery=Math.max(5, 10 - si);                        // วินาที/elite
    this.eliteAcc=this.eliteEvery;
    if(this.swarmAcc==null) this.swarmAcc=Phaser.Math.FloatBetween(10,16);   // Swarm Event ครั้งแรก
  }
  spawnWaveEnemy(){ let type='basic'; const r=Math.random(), si=this.stageIndex;
    if(si>=1&&r<0.26)type='fast';
    if(si>=1&&r>=0.26&&r<0.40)type='dasher';    // สายพุ่งโฉบ (บังคับให้หลบ)
    if(si>=1&&r>0.60&&r<0.72)type='shooter';    // ตัวยิงระยะไกล (พังการ kite)
    if(si>=2&&r>0.72&&r<0.82)type='bomber';     // ตัวระเบิดตอนตาย
    if(si>=2&&r>0.90&&r<0.955)type='tank';
    if(si>=2&&r>=0.955)type='siege';            // ถึกโหด เดินบีบวงล้อม
    this.spawnEnemy(type); }
  // Swarm Event: ฝูงมอนแห่กรูเข้ามาจากทุกทิศพร้อมกัน (spawnEnemy สุ่มมุมรอบตัวอยู่แล้ว)
  spawnSwarm(){
    const si=this.stageIndex, n=Math.min(this.maxLive-this.enemies.countActive(true), 14+si*4);
    if(n<=4)return;
    for(let i=0;i<n;i++){ const t=Math.random()<0.3?'dasher':(Math.random()<0.5?'fast':'basic'); this.spawnEnemy(t); }
    this.showBanner('🌊 ฝูงบุก!','ระวังรอบด้าน — หลบให้ดี', 1600); Sfx.bossWarn(); this.cameras.main.shake(200,0.006);
  }
  spawnElite(){
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.6+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false);
    if(!e) e=this.enemies.create(x,y,'e_tank'); else { e.setTexture('e_tank'); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }
    const s=(1+this.stageIndex*0.35)*(1+this.waveIndex*0.06);
    e.hp=70*s; e.maxhp=e.hp; e.spd=48; e.dmg=18; e.xp=8;
    e.setCircle(26,5,5); e.isBoss=false; e.isMini=false; e.isElite=true; e.frozen=0; e.knock=0;
    e.shooter=false; e.bomber=false; e.dasher=false; e.siege=false; e.dashState=null; e.tintColor=null;   // ล้างธงจาก pooled enemy
    e.baseScale=1.55; e._sqX=1; e._sqY=1; e.setScale(1.55).clearTint(); this.camWorld(e);   // elite = ตัวถึก ตัวใหญ่กว่าปกติ (baseScale ให้ waddle ใช้ไม่หด)
  }
  // เวฟธรรมดา = "เอาชีวิตรอดตามเวลา" (นับถอยหลัง + มอนเกิดต่อเนื่องเป็นฝูง)
  startSurvivalWave(w, seamless){
    const si=this.stageIndex;
    this.setupSpawnRates(w);
    this.waveDur=Math.round(13 + si*2 + w*1.5);   // วินาทีที่ต้องรอด (ลดลงจากเดิม 20+si*3+w*2 — เดินเรื่องไวขึ้น)
    this.waveTimer=this.waveDur; this.spawnAcc=0;
    // ระลอกเปิดตัว — เวฟที่ไหลต่อ (seamless) ข้ามการถล่มเปิดตัว เพราะมอนสเตอร์เดิมยังเต็มจออยู่
    if(!seamless){
      const burst=Math.min(this.maxLive, 12 + si*4 + w*2);
      for(let i=0;i<burst;i++) this.spawnWaveEnemy();
      if(si>=1) for(let i=0;i<1+Math.floor(si/2);i++) this.spawnElite();
    } else {
      const live=this.enemies.countActive(true);   // เติมให้ถึงราวครึ่งเพดานถ้ามอนเดิมเหลือน้อย
      const fill=Math.max(0, Math.min(this.maxLive, Math.floor(this.maxLive*0.55))-live);
      for(let i=0;i<fill;i++) this.spawnWaveEnemy();
    }
    // กล่อง/โหลทุบได้ (ธีมครัว) — ทุบเอาของ (ออร์บ/ฟื้นฟู)
    const nc=2+Math.floor(si*0.6); for(let i=0;i<nc;i++) this.spawnCrate();
  }
  // ล้างมอนธรรมดาที่ค้าง (เก็บบอส/มินิไว้) — ใช้ตอนจบเวฟ/รอดครบเวลา
  clearEnemies(){ this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&!e.isMini){ if(e._aura){e._aura.destroy();e._aura=null;} e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } }); }
  // เรียกทุกเฟรม: คุมนับเวลา + เกิดมอนต่อเนื่อง
  tickStage(dt){
    if(this.mode==='wave'){
      this.waveTimer-=dt;
      this.spawnAcc-=dt;
      if(this.spawnAcc<=0){ this.spawnAcc=this.spawnInterval;
        const live=this.enemies.countActive(true);
        if(live<this.maxLive){ const n=Math.min(this.spawnBatch, this.maxLive-live); for(let i=0;i<n;i++) this.spawnWaveEnemy(); } }
      if(this.stageIndex>=1){ this.eliteAcc-=dt; if(this.eliteAcc<=0){ this.eliteAcc=this.eliteEvery; if(this.enemies.countActive(true)<this.maxLive) this.spawnElite(); } }
      if(this.swarmAcc!=null){ this.swarmAcc-=dt; if(this.swarmAcc<=0){ this.swarmAcc=Phaser.Math.FloatBetween(14,22); this.spawnSwarm(); } }
      const st=STAGES[this.stageIndex];
      if(st)this.timeTxt.setText('⚔ เวฟ '+(this.waveIndex+1)+'/'+st.waves+' · ⏳ '+Math.max(0,Math.ceil(this.waveTimer))+' วิ');
      if(this.waveTimer<=0) this.onWaveCleared(true);   // จบเวลา = ไปเวฟถัดไปแบบไหลต่อ (มอนสเตอร์ไม่หาย)
    } else if(this.mode==='mini'){
      // ระหว่างสู้มินิ = ยังมีลูกน้องไหลมาเรื่อย ๆ (กดดันต่อเนื่อง แต่เบากว่า)
      this.spawnAcc-=dt;
      if(this.spawnAcc<=0){ this.spawnAcc=this.spawnInterval*1.7;
        const live=this.enemies.countActive(true);
        if(live<this.maxLive*0.7){ const n=Math.max(1,Math.floor(this.spawnBatch*0.5)); for(let i=0;i<n;i++) this.spawnWaveEnemy(); } }
    }
  }
  // สเกล HP บอสตามความเก่งผู้เล่น (ยศ + เลเวลในรอบ) — กันบอสตายใน 1 วิ ช่วงเลทเกม
  bossHpMul(){ return Math.min(10, (1+(Save.data.rank||0)*0.6) * (1+(this.level||1)*0.075)); }   // ถึกขึ้น: cap 10 + สเกลตามเลเวลผู้เล่นแรงขึ้น
  spawnMiniBoss(){
    const st=STAGES[this.stageIndex];
    this.showBanner('💢 มินิบอส!', st.mini, 2000); Sfx.bossWarn(); Sfx.bgmIntense(true); this.cameras.main.shake(200,0.008);
    const adds=2+this.stageIndex;
    for(let i=0;i<adds;i++) this.spawnEnemy(Math.random()<0.5?'fast':'basic');
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const mkey='mb'+(this.stageIndex+1), mArt=this.textures.exists(mkey);
    const b=this.enemies.create(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad, mArt?mkey:'e_brute');
    const mScale=mArt?1.15:1.7; b.baseScale=mScale; b._sqX=1; b._sqY=1;
    b.setScale(mScale).setCircle(mArt?52:26, mArt?18:5, mArt?18:5); b.isMini=true; b.isBoss=false;
    b.hp=st.bossHp*0.95*this.bossHpMul(); b.maxhp=b.hp; b.spd=60; b.dmg=Math.round(st.bossDmg*1.05); b.xp=15; b.frozen=0; b.knock=0; b.phase3=false;   // มินิบอสถึก+ดุขึ้น
    if(mArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.atkCd=1.6; b.phase2=false; b.atks=['slam','aimed']; if(this.stageIndex>=1)b.atks.push('radial','spiral'); if(this.stageIndex>=3)b.atks.push('charge','trap');
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
    const fScale=isArt?1.55:2.5; b.baseScale=fScale; b._sqX=1; b._sqY=1;
    b.setScale(fScale).setCircle(isArt?54:26, isArt?16:5, isArt?16:5); b.isBoss=true; b.isMini=false;
    b.hp=st.bossHp*(2.0+this.stageIndex*0.13)*this.bossHpMul(); b.maxhp=b.hp; b.spd=46; b.dmg=Math.round(st.bossDmg*1.35); b.xp=30; b.frozen=0; b.knock=0; b.phase3=false;   // บอสใหญ่ถึก+แรงขึ้นมาก
    if(isArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.atkCd=1.4; b.phase2=false; b.atks=['slam','radial','aimed','charge','spiral','trap']; if(this.stageIndex>=1)b.atks.push('summon');
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
    if(alsoHeals){ for(const grp of [this.heals,this.vacs,this.loots,this.chests]){ if(grp)grp.children.iterate(o=>{ if(o&&o.active){ this.tweens.killTweensOf(o); if(o._glow){this.tweens.killTweensOf(o._glow);o._glow.destroy();o._glow=null;} o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; } }); } } }
  onWaveCleared(keep){
    // keep=true (จบเวลาเวฟธรรมดา) → ไม่ล้างมอนสเตอร์ ให้เวฟถัดไปไหลต่อทันที
    this.boss=null; Sfx.bgmIntense(false); this.bossUI.forEach(o=>o.setVisible(false)); this.clearFoes(); if(!keep)this.clearEnemies();
    const st=STAGES[this.stageIndex], next=this.waveIndex+1;
    this.mode='breather';   // กัน tickStage เกิดมอนต่อระหว่างสลับเวฟ
    if(next>=st.waves){ this.spawnFinalBoss(); return; }
    this.clearPickups(false);   // เก็บกล่องที่ไม่ได้ทุบ (ออร์บ/ฟื้นฟูยังอยู่)
    this.updateWaveText(); this.poseFlash(CF.cheer,600);
    if(keep&&this.showBanner)this.showBanner('🌊 เวฟ '+(next+1),st.name,1100);
    this.time.delayedCall(keep?300:750,()=>{ if(this._busy()) this.startWave(next, keep); });
  }
  // บอสตาย → ดรอปหีบสมบัติ + หยุดสปอน รอผู้เล่นเดินไปเก็บ (collectChest → openLevelUp → onStageClear)
  onBossDown(x,y){ this.boss=null; this.mode='reward'; this.bossUI.forEach(o=>o.setVisible(false));
    Sfx.bgmIntense(false); this.clearFoes(); this.clearEnemies();
    this.spawnChest(x,y);
    this.showBanner('🎁 ล้มบอสแล้ว!','เดินไปเก็บหีบสมบัติเพื่อรับสกิล',2400); }
  onStageClear(){
    this.boss=null; this.mode='clear'; this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e&&e.active){ e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
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
    while(this.xp>=this.xpNext){ this.xp-=this.xpNext; this.level++; this.xpNext=Math.round(this.xpNext*1.14+2); this.pendingLvl=(this.pendingLvl||0)+1; this.jelly(0,3.2); this.vfxLevelUp(); }
    this.lvlTxt.setText('Lv '+this.level);
    if(this.pendingLvl>0 && this.state==='play') this.openLevelUp();
  }
  openLevelUp(){
    this.state='levelup'; this.physics.pause();
    Sfx.levelup();
    const w=this.W,h=this.H; this.lvlUp.removeAll(true); this.lvlCards=[];
    const bg=this.add.rectangle(0,0,w,h,0x211526,0.9).setOrigin(0,0);
    this.lvlUp.add(bg);
    // ---- แถบบนสุด: สกิล/พร ที่ถือครองอยู่ ----
    const heldBot=this.drawHeldBar(this.lvlUp, 14);
    const t=this.add.text(w/2,heldBot+8,this._chestReward?'🎁 หีบสมบัติ! สุ่มรับสกิล':'⭐ เลเวลอัพ! แตะเลือก 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffd166'}).setOrigin(0.5,0);
    this.lvlUp.add(t);
    const opts=this.rollUpgrades(3);
    const cardW=Math.min(w-32,400), lx=w/2-cardW/2;
    const startY=heldBot+40, gap=13;
    const avail=h-startY-16, ch=Math.min(132,(avail-gap*2)/3);   // การ์ดสูงพอใส่ดาว+คอมโบ
    opts.forEach((o,i)=>{
      const y=startY+i*(ch+gap);
      const g=this.add.graphics();
      const cr=20;
      g.fillStyle(0x14101c,0.45); g.fillRoundedRect(lx+2,y+5,cardW,ch,cr);               // เงานุ่มใต้การ์ด
      g.fillStyle(0x2c2338,1); g.fillRoundedRect(lx,y,cardW,ch,cr);                        // พื้นเข้ม
      g.fillGradientStyle(this._lighten(o.color,0.10),this._lighten(o.color,0.10),o.color,o.color,0.16); g.fillRoundedRect(lx,y,cardW,ch,cr);  // ไล่เฉดสีหมวด (บนสว่างล่างเข้ม)
      g.fillStyle(0xffffff,0.055); g.fillRoundedRect(lx,y,cardW,ch*0.46,{tl:cr,tr:cr,bl:0,br:0});  // กลอสบน
      g.lineStyle(2.5,o.color,0.95); g.strokeRoundedRect(lx,y,cardW,ch,cr);                // ขอบสีหมวด
      g.lineStyle(1,this._lighten(o.color,0.5),0.45); g.strokeRoundedRect(lx+1.5,y+1.5,cardW-3,ch-3,cr-2);  // เส้นในสว่าง
      g.fillStyle(o.color,1); g.fillRoundedRect(lx,y,5,ch,{tl:cr,bl:cr,tr:0,br:0});        // แถบสีซ้าย = หมวด
      g.fillStyle(0x241d30,0.92); g.fillCircle(lx+42,y+40,27);                              // วงไอคอน ดิสก์เข้ม
      g.fillStyle(o.color,0.28); g.fillCircle(lx+42,y+40,27);                               // อมสีหมวด
      g.lineStyle(2,this._lighten(o.color,0.45),0.75); g.strokeCircle(lx+42,y+40,27);       // ริงสว่าง
      const oik=o.type==='awk'?null:this.iconKey(o.key,o.type==='pas');
      const em = oik ? this.add.image(lx+42,y+40,oik).setDisplaySize(50,50) : this.add.text(lx+42,y+40,o.emoji,{fontSize:'32px'}).setOrigin(0.5);
      const emBase=em.scaleX||1;
      // ดาวบอกเลเวล (เต็ม/ว่าง) + ป้ายหมวดสี
      let stars=''; for(let s=0;s<o.max;s++) stars+=(s<o.lvl?'★':'☆');
      const starT=this.add.text(lx+42,y+72,stars,{fontFamily:'sans-serif',fontSize:o.max>6?'9px':'11px',color:o.type==='awk'?'#ffcf5a':'#ffd166'}).setOrigin(0.5);
      const remain=o.type==='awk'?'ขั้นสุดยอด':(o.lvl>=o.max?'สูงสุดแล้ว!':'อีก '+(o.max-o.lvl)+' ดาวจะตัน');
      const badge=this.add.text(lx+80,y+14,'● '+o.kind+(o.isNew?' · ใหม่!':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:o.badgeColor}).setOrigin(0,0);
      const nm=this.add.text(lx+80,y+30,o.title+(o.type!=='awk'?'  Lv'+o.lvl:''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffffff'}).setOrigin(0,0);
      const ds=this.add.text(lx+80,y+52,o.desc,{fontFamily:'sans-serif',fontSize:'12px',color:'#d6cce6',wordWrap:{width:cardW-96}}).setOrigin(0,0);
      const rm=this.add.text(lx+cardW-14,y+14,remain,{fontFamily:'sans-serif',fontSize:'10px',color:'#9a90ab'}).setOrigin(1,0);
      this.lvlUp.add([g,em,starT,badge,nm,ds,rm]);
      // ---- แถบคอมโบ (ล่างการ์ด) — สกิลโจมตี (a) จับคู่สกิลติดตัว (b) ----
      { const combo=COMBOS.find(c=>c.a===o.key||c.b===o.key);
        if(combo){ const isAtk=combo.a===o.key, partner=isAtk?combo.b:combo.a;
          const pe=isAtk?(PASSIVES[partner]?PASSIVES[partner].emoji:'❓'):(SKILLDEFS[partner]?SKILLDEFS[partner].emoji:'❓');
          const have=isAtk?((this.passives[partner]||0)>0):((this.skills[partner]||0)>0), cy=y+ch-19;
          const cg=this.add.graphics(); cg.fillStyle(have?0x2f4a38:0x39304a,1); cg.fillRoundedRect(lx+80,cy-2,cardW-94,20,7); this.lvlUp.add(cg);
          const ct=this.add.text(lx+86,cy+8,o.emoji+' + '+pe+' = '+combo.emoji+' '+combo.name+(have?'  ✓':'  (ต้องมี '+pe+')'),
            {fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10.5px',color:have?'#a8f0c0':'#c9b9e0'}).setOrigin(0,0.5);
          this.lvlUp.add(ct); }
      }
      this.lvlCards.push({top:y,bottom:y+ch,apply:o.apply});
      g.setAlpha(0); em.setScale(emBase*0.2);
      this.tweens.add({targets:[g,badge,nm,ds,starT,rm],alpha:{from:0,to:1},duration:200,delay:i*70});
      this.tweens.add({targets:em,scale:{from:emBase*0.2,to:emBase},duration:320,delay:i*70,ease:'Back.out'});
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
    if(this._chestReward){ this._chestReward=false; this.time.delayedCall(180,()=>{ if(this.state==='play')this.onStageClear(); }); }
  }
  rollUpgrades(n){
    const skillPool=[], passPool=[], awakenPool=[];
    const S=(key,lvl,max,emoji,title,desc,isNew,apply)=>skillPool.push({type:'atk',key,lvl,max,isNew,kind:'สกิลโจมตี',badgeColor:'#f0a54a',color:0xf0a54a,emoji,title,desc,apply});
    const P=(key,lvl,max,emoji,title,desc,isNew,apply)=>passPool.push({type:'pas',key,lvl,max,isNew,kind:'สกิลติดตัว',badgeColor:'#66d3b3',color:0x66d3b3,emoji,title,desc,apply,pas:true});
    const A=(key,emoji,title,desc,apply)=>awakenPool.push({type:'awk',key,lvl:SKILL_AWAKEN_LV,max:SKILL_AWAKEN_LV,kind:'ขั้นสุด (ตื่นรู้)',badgeColor:'#ffcf5a',color:0xffb020,emoji,title,desc,apply,awk:true});
    const atkOwned=Object.keys(this.skills).length;      // ล็อกโจมตี ≤ SKILL_CAP
    const pasOwned=Object.keys(this.passives).length;    // ล็อกติดตัว ≤ PASSIVE_CAP
    // --- สกิลโจมตี (auto-cast) — สกิลใหม่เฉพาะเมื่อยังไม่เต็มโควตา ---
    for(const key in SKILLDEFS){ const d=SKILLDEFS[key], cur=this.skills[key]||0;
      if(cur===0){ if(atkOwned<SKILL_CAP) S(key,1,d.max,d.emoji,d.name,d.desc,true,()=>{ this.skills[key]=1; if(key==='star')this.rebuildRing(); this.buildSkillBar(); }); }
      else if(cur<d.max){ const nx=cur+1, tier=(SKILL_TIERS[key]&&SKILL_TIERS[key][nx])||'แรงขึ้น';
        S(key,nx,d.max,d.emoji,d.name,tier,false,()=>{ this.skills[key]++; if(key==='star')this.rebuildRing(); this.buildSkillBar(); }); }
      else if(cur===d.max && d.awaken){   // MAX แล้ว → "ตื่นรู้" (Awaken) เปลี่ยนรูปแบบสกิลให้โกง (การันตีโผล่)
        const a=d.awaken;
        A(key,a.emoji,'ตื่นรู้: '+a.name,a.desc,()=>{ this.skills[key]=SKILL_AWAKEN_LV; if(key==='star')this.rebuildRing(); this.buildSkillBar(); if(this.showBanner)this.showBanner('⚡ สกิลตื่นรู้! '+a.emoji, d.name+' → '+a.name, 2400); Sfx.clear(); }); }
    }
    // --- สกิลติดตัว (passive แบบเลเวลได้) — ตัวใหม่เฉพาะเมื่อยังไม่เต็มโควตา ---
    for(const key in PASSIVES){ const d=PASSIVES[key], cur=this.passives[key]||0;
      if(cur===0){ if(pasOwned<PASSIVE_CAP) P(key,1,d.max,d.emoji,d.name,d.desc,true,()=>{ this.passives[key]=1; d.apply(this.player); }); }
      else if(cur<d.max){ P(key,cur+1,d.max,d.emoji,d.name,d.desc,false,()=>{ this.passives[key]++; d.apply(this.player); }); }
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
    const isSesame=this.character==='sesame';
    const aw=lvl>=SKILL_AWAKEN_LV;            // ตื่นรู้: วงกาแล็กซี 3 ชั้น
    const count=aw?12:(2+lvl+(isSesame?1:0));                  // Sesame เริ่มต้นด้วยดาว +1 ดวง
    const rOuter=(aw?78:48+lvl*3)*(isSesame?1.15:1);          // วงคุ้มกันกว้างขึ้น
    const rMid=rOuter*0.72, rInner=rOuter*0.5;
    const twoRing=lvl>=6&&!aw;                // L6 วงคู่
    const size=(1.8+lvl*0.12)*(aw?1.35:1)*(isSesame?1.15:1);   // ดวงใหญ่ขึ้น
    const spark=lvl>=5||isSesame;             // กระจายประกายเมื่อชน
    this.ringSpin=(aw?4.6:2.6+lvl*0.28)*(isSesame?1.3:1);      // หมุนเร็วขึ้น 30%
    for(let i=0;i<count;i++){
      const tier=aw?(i%3):(twoRing?(i%2===0?0:2):0);   // aw: 3 ชั้น (0=นอก,1=กลาง,2=ใน)
      const rr=tier===0?rOuter:tier===1?rMid:rInner;
      const b=this.camWorld(this.physics.add.image(0,0,'dot').setTint(tier===0?0xffe08a:tier===1?0xffd0e8:0xfff2a8).setScale(size).setDepth(88000));
      b.setCircle(4,2,2); b.body.setAllowGravity(false); b.dmg=(4+lvl*1.5)*(aw?1.6:1)*(isSesame?1.15:1); b.hitCd=0;   // hitbox แน่นขึ้น+อยู่กลางดวง (เดิม 5 เยื้องมุม = โกง)
      b.rr=rr; b.ang0=(i/count)*Math.PI*2;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{ if(ball.hitCd>0)return; ball.hitCd=isSesame?0.09:0.12;
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
    const key=type==='dasher'?'e_dasher':type==='fast'?'e_fast':type==='shooter'?'e_shooter':type==='bomber'?'e_bomber':type==='siege'?'e_siege':type==='tank'?'e_tank':'e_basic';
    if(!e) e=this.enemies.create(x,y,key);
    else { e.setTexture(key); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }
    // สเกลตามด่าน+เวฟ (ยิ่งลึกยิ่งอึด/ดาเมจสูง)
    const s=(1+(this.stageIndex||0)*0.55)*(1+(this.waveIndex||0)*0.11);
    e.shooter=false; e.bomber=false; e.shootCd=0; e.dasher=false; e.siege=false; e.dashState=null; e.tintColor=null;
    let scale=1;
    if(type==='fast'){ e.hp=10*s; e.spd=122; e.dmg=9; e.xp=1; e.setCircle(15,4,4); }
    else if(type==='tank'){ e.hp=80*s; e.spd=36; e.dmg=18; e.xp=4; e.setCircle(26,5,5); }
    else if(type==='shooter'){ e.hp=19*s; e.spd=62; e.dmg=9; e.xp=2; e.shooter=true; e.shootCd=Phaser.Math.FloatBetween(1.1,2.0); e.setCircle(17,5,5); }
    else if(type==='bomber'){ e.hp=24*s; e.spd=70; e.dmg=12; e.xp=2; e.bomber=true; e.setCircle(17,5,5); }
    else if(type==='dasher'){ e.hp=16*s; e.spd=70; e.dmg=14; e.xp=2; e.dasher=true; e.dashState='chase'; e.dashT=Phaser.Math.FloatBetween(0.6,1.6); e.setCircle(17,5,5); }  // สายพุ่งโฉบ (รูปจริง e_dasher 44px)
    else if(type==='siege'){ e.hp=260*s; e.spd=24; e.dmg=24; e.xp=10; e.siege=true; e.setCircle(34,4,4); scale=1.5; }  // ถึกโหด เดินบีบวงช้า ๆ (รูปจริง e_siege 76px)
    else { e.hp=19*s; e.spd=58; e.dmg=10; e.xp=1; e.setCircle(17,5,5); }
    e.isBoss=false; e.isMini=false; e.isElite=false; e.maxhp=e.hp; e.frozen=0; e.knock=0; e.baseScale=scale; e._sqX=1; e._sqY=1; e.setScale(scale);
    if(e.tintColor)e.setTint(e.tintColor); else e.clearTint();
    this.camWorld(e);
    this.vfxSpawnPoof(x,y);
  }

  /* ---------- COMBAT ---------- */
  getBullet(x,y,tint,scale){
    let b=this.bullets.getFirstDead(false);
    if(!b) b=this.bullets.create(x,y,'spark');
    else { b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }
    if(b.texture&&b.texture.key!=='spark')b.setTexture('spark');   // คืนรูปกระสุนปกติ (กัน proj_* ค้างจาก pool)
    b.setScale(scale||1).setTint(tint||0xffffff).setRotation(0).setDepth(90000); if(b.body)b.body.setAllowGravity(false); this.camWorld(b);
    b.pierce=false; b.hitCd=0; b.hitGapV=0.16; b.boomer=false; b.returned=false;
    b.bounce=0; b.rebound=false; b.reb=0; b.spin=false; b.homing=0; b.explode=0; b.faceVel=false; b.chain=0;
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
    if(aw&&Math.random()<0.5)this.awakenSpark(key);
    const _castColors={sprinkle:0xffb6e1,star:0xffe08a,chili:0xff7a4d,thunder:0xfff2a8,whirl:0x8fd0ff,boomer:0xf0a92e,frost:0x7fc9ff,popcorn:0xffed8a,bubble:0x80e8d0,aura:0xff9ec4,fork:0xccc,mine:0xff8fb5,beam:0xfff2a8,meteor:0xffa54d,cloud:0xb6f0d6,rocket:0xff5a6e,wave:0xbfe8ff};
    this.vfxCastGlow(_castColors[key]||0xffffff);
    if(key==='sprinkle'){ const t=this.nearestEnemy(aw?900:640); if(!t)return;
      let shots=aw?8:lvl>=6?5:lvl>=4?3:lvl>=2?2:1;
      if(this.player.twinSprinkle) shots+=2;
      const pierce=lvl>=3||aw; let bounce=lvl>=5?2:0; if(cf.ricochet)bounce+=1; if(aw||this.player.twinSprinkle)bounce+=2;
      const spread=shots>1?(aw?0.42:0.20):0;
      for(let s=0;s<shots;s++){ const off=(s-(shots-1)/2)*spread, ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+off;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffe08a:(lvl>=6?0xffb6e1:0xffffff),(1+lvl*0.12)*(aw?1.3:1));
        b.dmg=(5+lvl*1.6)*dm*(aw?1.5:1)*(this.player.twinSprinkle?1.2:1); b.life=aw?1.6:1.2; b.pierce=pierce; b.bounce=bounce; if(aw||this.player.twinSprinkle)b.homing=280;
        this.physics.velocityFromRotation(ang,470,b.body.velocity); } Sfx.shoot(); }
    else if(key==='chili'){
      const isTaro=this.character==='taro';
      const rings=aw?5:lvl>=6?3:lvl>=3?2:1, baseR=(80+lvl*14)*(cf.firestorm?1.2:1)*(aw?1.7:1)*(isTaro?1.25:1), dmg=(8+lvl*2.4)*dm*(aw?1.6:1), knock=lvl>=4||aw||isTaro;
      if(this.anims.exists('fx_chilinova')) this.spawnFxAnim('fx_chilinova',this.player.x,this.player.y,{scale:(2*baseR)/ASSET_FX.fx_chilinova.fw,depth:4,anchor:'center',alpha:Math.min(1,0.55+lvl*0.09)});
      else if(this.textures.exists('fx_chili')) this.fxBurst('fx_chili',this.player.x,this.player.y,baseR,aw?460:360);
      else for(let ri=0;ri<rings;ri++){ const r=baseR*(1-ri*(aw?0.16:0.26));
        const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,10,ri%2?0xffb15a:0xff7a4d,0.4).setDepth(3));
        this.tweens.add({targets:ring,radius:r,alpha:0,duration:300+ri*70,onComplete:()=>ring.destroy()}); }
      if(lvl>=6||aw||isTaro)this.cameras.main.shake(aw?220:120,aw?0.011:0.005);
      this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<baseR){
        this.damage(e,dmg,e.x,e.y);
        if(knock&&!e.isBoss){ const a=Math.atan2(e.y-this.player.y,e.x-this.player.x); e.setVelocity(Math.cos(a)*(isTaro?440:300),Math.sin(a)*(isTaro?440:300)); e.knock=0.25; } }});
      this.hitCratesInRadius(this.player.x,this.player.y,baseR,dmg);
      Sfx.boom(); }
    else if(key==='thunder'){ const strikes=aw?8:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, chain=aw?3:lvl>=5?2:lvl>=3?1:0, dmg=(10+lvl*3.4)*dm*(cf.storm?1.4:1)*(aw?1.4:1);
      const cand=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<(aw?760:520)) cand.push(e); });
      Phaser.Utils.Array.Shuffle(cand);
      this.hitCratesInRadius(this.player.x,this.player.y,aw?760:520,dmg);   // ฟ้าผ่าก็ทุบกล่องในระยะ
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
        this.physics.velocityFromRotation(ang,speed,b.body.velocity); }
      if(this.textures.exists('fx_slash')&&this.anims.exists('fx_slash')){ const t=this.nearestEnemy(500), sa=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.whirlAng;
        const off=44, sc=(150+lvl*14)/ASSET_FX.fx_slash.fw;
        this.spawnFxAnim('fx_slash',this.player.x+Math.cos(sa)*off,this.player.y+Math.sin(sa)*off,{rotation:sa,scale:sc,depth:6,anchor:'center'}); }
      Sfx.shoot(); }
    else if(key==='boomer'){ const cnt=aw?6:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, dmg=(8+lvl*2.6)*dm*(aw?1.4:1);
      const big=(1.4+lvl*0.1)*(aw?1.4:1), rebound=lvl>=5||aw; let gap=lvl>=3?0.10:0.16; if(cf.ricochet)gap*=0.7; if(aw)gap*=0.7;
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(760);
        const base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle(), ang=base+(s-(cnt-1)/2)*0.4;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffcf70:0xd9a066,big); b.dmg=dmg; b.life=2.0; b.pierce=true; b.hitGapV=gap;
        if(this.textures.exists('proj_boomer')){ b.setTexture('proj_boomer').setTint(0xffffff).setScale(0.5+lvl*0.05); }
        b.boomer=true; b.bt=0; b.bdur=0.44; b.rebound=rebound; b.spin=true; if(aw)b.reb=-1;   // reb=-1 → เด้งได้ 2 รอบ (0,1)
        this.physics.velocityFromRotation(ang,430,b.body.velocity); } Sfx.shoot(); }
    else if(key==='frost'){
      const df=this.player.deepFreeze?1.4:1;
      const r=(140+lvl*14)*(aw?2.6:1)*df, dur=(1+lvl*0.22)*(aw?1.6:1)*df, dmg=(lvl>=3||aw||this.player.deepFreeze)?(6+lvl*2)*dm*(aw?1.8:1)*df:0, shatter=lvl>=5||aw||this.player.deepFreeze;
      if(this.textures.exists('fx_frostnova')&&this.anims.exists('fx_frostnova')) this.spawnFxAnim('fx_frostnova',this.player.x,this.player.y,{scale:(2*r)/ASSET_FX.fx_frostnova.fw*0.82,depth:3,anchor:'center',alpha:Math.min(1,0.5+lvl*0.1)});
      else if(this.textures.exists('fx_frost')) this.fxBurst('fx_frost',this.player.x,this.player.y,r,aw?520:380,true);
      else { const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,12,COLORS.ice,0.4).setDepth(3));
        this.tweens.add({targets:ring,radius:r,alpha:0,duration:320,onComplete:()=>ring.destroy()}); }
      this.enemies.children.iterate(e=>{ if(e&&e.active&&(aw||(!e.isBoss&&!e.isMini))&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){
        if(shatter&&e.frozen>0){ this.damage(e,(14+lvl*3)*dm*df,e.x,e.y); this.burst(e.x,e.y,0x8fd0ff); }
        if(!e.isBoss&&!e.isMini){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }
        if(dmg>0)this.damage(e,dmg,e.x,e.y); } }); this.hitCratesInRadius(this.player.x,this.player.y,r,Math.max(dmg,8)); Sfx.frost(); }
    else if(key==='popcorn'){ const cnt=aw?20:lvl>=6?10:lvl>=4?8:lvl>=2?6:4, dmg=(4+lvl*1.5)*dm*(cf.fizz?1.25:1)*(aw?1.5:1);
      const big=(lvl>=3?1.3:1.0)*(cf.fizz?1.25:1)*(aw?1.4:1), speed=(lvl>=5?420:340)*(aw?1.3:1), bounce=aw?6:(lvl>=3?4:2);   // ป๊อบคอนเด้ง ๆ ไปเด้งมา (bounce ระหว่างศัตรู)
      for(let i=0;i<cnt;i++){ const ang=Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffe0a0:0xfff0c2,big); b.dmg=dmg; b.life=aw?1.8:1.4; b.pierce=false; b.bounce=bounce; b.spin=true; b.hitGapV=0.12;
        this.physics.velocityFromRotation(ang,speed*(0.7+Math.random()*0.5),b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='bubble'){ const cnt=aw?8:lvl>=6?5:lvl>=4?3:lvl>=2?2:1, dmg=(7+lvl*2)*dm*(cf.fizz?1.25:1)*(aw?1.4:1);
      const pierce=lvl>=5||aw, big=(lvl>=3?1.5:1.2)*(cf.fizz?1.25:1)*(aw?1.3:1);
      for(let s=0;s<cnt;s++){ const ang=Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffffff:0xd8f4ff,big); b.dmg=dmg; b.life=2.6; b.pierce=pierce; b.hitGapV=0.2; b.homing=(aw?460:(lvl>=4?340:240));   // ฟองลอยไล่ล่าศัตรู
        if(this.textures.exists('bubble')) b.setTexture('bubble').setScale((1.6+lvl*0.16)*(aw?1.25:1));
        this.physics.velocityFromRotation(ang,150,b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='aura'){ this.ensureAuraFx();   // ออร่าถาวร: sprite วนลูป + tick ดาเมจใน update (tickAura) ไม่ยิงเป็นครั้ง ๆ
      if(!(this.textures.exists('fx_aura')&&this.anims.exists('fx_aura'))){ const r=((60+lvl*16)*(aw?1.7:1)), dmg=(5+lvl*2)*dm*(aw?1.6:1);   // fallback ถ้าไม่มีอาร์ต
        const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,r,0xff9ec4,0.10).setDepth(3).setStrokeStyle(2,0xffb6e1,0.55));
        this.tweens.add({targets:ring,alpha:0,scale:1.06,duration:300,onComplete:()=>ring.destroy()});
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){ this.damage(e,dmg,e.x,e.y);
          if(aw&&!e.isBoss){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); e.setVelocity(Math.cos(a)*140,Math.sin(a)*140); e.knock=0.15; } } }); this.hitCratesInRadius(this.player.x,this.player.y,r,dmg); } }
    else if(key==='fork'){ const cnt=aw?10:lvl>=6?5:lvl>=4?4:lvl>=2?3:2, dmg=(9+lvl*3)*dm*(aw?1.4:1);
      const t=this.nearestEnemy(760), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
      for(let s=0;s<cnt;s++){ const ang=aw?base+(s/cnt)*Math.PI*2:base+(s-(cnt-1)/2)*0.16;
        const b=this.getBullet(this.player.x,this.player.y,0xeaeaff,1.15+lvl*0.08); b.dmg=dmg; b.life=1.4; b.pierce=true; b.hitGapV=0.12; b.chain=aw?3:(lvl>=4?2:0);   // ส้อมทะลุ + ลูกโซ่ไฟฟ้า
        if(this.textures.exists('proj_fork')){ b.setTexture('proj_fork').setTint(0xffffff).setScale(0.85); b.faceVel=true; } else b.spin=true;
        this.physics.velocityFromRotation(ang,560,b.body.velocity); } Sfx.shoot(); }
    else if(key==='mine'){ const cnt=aw?4:lvl>=4?2:1, r=(70+lvl*10)*(aw?1.4:1), dmg=(20+lvl*6)*dm*(aw?1.5:1);
      for(let m=0;m<cnt;m++){ const mx=this.player.x+Phaser.Math.Between(-40,40), my=this.player.y+Phaser.Math.Between(-40,40);
        const mine=this.camWorld(this.add.circle(mx,my,7,0xffb6e1,0.9).setDepth(3).setStrokeStyle(2,0xff8fb5,1));
        this.tweens.add({targets:mine,scale:{from:0.6,to:1.1},yoyo:true,repeat:-1,duration:360});
        this.time.delayedCall(1300,()=>{ if(this.state!=='play'&&this.state!=='levelup'){ mine.destroy(); return; }
          this.tweens.killTweensOf(mine); mine.destroy();
          if(this.anims.exists('fx_mine')) this.spawnFxAnim('fx_mine',mx,my,{scale:(2*r)/ASSET_FX.fx_mine.fw*0.5,depth:4,anchor:'center'});
          else { const ring=this.camWorld(this.add.circle(mx,my,10,0xff9ec4,0.5).setDepth(3));
            this.tweens.add({targets:ring,radius:r,alpha:0,duration:280,onComplete:()=>ring.destroy()}); }
          this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,mx,my)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(mx,my,r,dmg); Sfx.boom(); }); } }
    else if(key==='beam'){ const t=this.nearestEnemy(900); if(!t)return;
      const beams=aw?3:1, len=(760+lvl*30)*(aw?1.25:1), wide=(12+lvl*3)*(aw?1.4:1), dmg=(11+lvl*3.6)*dm*(aw?1.4:1);
      const base=Math.atan2(t.y-this.player.y,t.x-this.player.x);
      for(let k=0;k<beams;k++) this.fireBeam(base+(k-(beams-1)/2)*0.18,len,wide,dmg); Sfx.zap(); }
    else if(key==='meteor'){
      const di=this.player.donutImpact?1.35:1;
      const n=aw?10:lvl>=6?6:lvl>=4?4:lvl>=2?3:2, r=(58+lvl*8)*(aw?1.3:1)*di, dmg=(14+lvl*4)*dm*(aw?1.4:1)*di;
      const cands=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<560)cands.push(e); });
      for(let i=0;i<n;i++){ let tx,ty; if(cands.length){ const e=cands[Math.floor(Math.random()*cands.length)]; tx=e.x+Phaser.Math.Between(-24,24); ty=e.y+Phaser.Math.Between(-24,24); }
        else { tx=this.player.x+Phaser.Math.Between(-220,220); ty=this.player.y+Phaser.Math.Between(-220,220); }
        this.meteorStrike(tx,ty,r,dmg,i*70); } Sfx.shoot(); }
    else if(key==='cloud'){ const t=this.nearestEnemy(620)||this.player, cx=t.x, cy=t.y;
      const r=(70+lvl*12)*(aw?1.5:1), dmg=(3+lvl*1.2)*dm*(aw?1.6:1), dur=(aw?4:2+lvl*0.3);
      const cloud=this.camWorld(this.add.circle(cx,cy,r,0x9a7ce6,0.16).setDepth(2).setStrokeStyle(2,0xb79ae8,0.45));
      this.tweens.add({targets:cloud,scale:{from:0.5,to:1},duration:300});
      if(this.textures.exists('fx_vortex')&&this.anims.exists('fx_vortex')) this.spawnFxAnim('fx_vortex',cx,cy,{scale:(2*r)/ASSET_FX.fx_vortex.fw,depth:3,anchor:'center'});
      const ticks=Math.max(1,Math.floor(dur/0.3));
      for(let k=1;k<=ticks;k++) this.time.delayedCall(k*300,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(cx,cy,r,dmg); });
      this.tweens.add({targets:cloud,alpha:0,delay:Math.max(0,dur*1000-350),duration:400,onComplete:()=>cloud.destroy()}); Sfx.frost(); }
    else if(key==='rocket'){ const cnt=aw?6:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, dmg=(10+lvl*3)*dm*(aw?1.4:1), er=(50+lvl*6)*(aw?1.4:1);
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(780), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
        const b=this.getBullet(this.player.x,this.player.y,0xff8b6b,1.3+lvl*0.08); b.dmg=dmg; b.life=2.2; b.homing=(aw?400:280); b.explode=er;
        if(this.textures.exists('proj_rocket')){ b.setTexture('proj_rocket').setTint(0xffffff).setScale(0.7); b.faceVel=true; } else b.spin=true;
        this.physics.velocityFromRotation(base+(s-(cnt-1)/2)*0.3,300,b.body.velocity); } Sfx.shoot(); }
    else if(key==='wave'){ const rings=aw?3:1, maxR=(150+lvl*20)*(aw?1.4:1), dmg=(8+lvl*2.6)*dm*(aw?1.4:1);
      for(let k=0;k<rings;k++) this.creamWave(maxR,dmg,k*180); Sfx.boom(); }
  }
  // เล่น VFX flipbook (sprite animation) ครั้งเดียวแล้วทำลาย · additive blend (พื้นดำหาย + เรืองแสง)
  spawnFxAnim(key,x,y,o={}){
    if(!this.textures.exists(key)||!this.anims.exists(key))return null;
    const fx=ASSET_FX[key]||{}; const s=this.camWorld(this.add.sprite(x,y,key,0));
    s.setDepth(o.depth!=null?o.depth:7); s.setBlendMode(o.add?Phaser.BlendModes.ADD:Phaser.BlendModes.NORMAL);   // NORMAL = โชว์สีจริง ไม่ล้นขาวบนพื้นสว่าง
    const ax=o.anchor||fx.anchor||'center'; s.setOrigin(ax==='left'?0:0.5, ax==='bottom'?1:0.5);
    if(o.rotation!=null)s.setRotation(o.rotation);
    s.setScale(o.scaleX!=null?o.scaleX:(o.scale!=null?o.scale:1), o.scaleY!=null?o.scaleY:(o.scale!=null?o.scale:1));
    if(o.alpha!=null)s.setAlpha(o.alpha);
    s.play(key); s.once('animationcomplete',()=>s.destroy()); return s;
  }
  // ออร่าถาวร: สร้าง sprite วนลูปติดตัว (ครั้งเดียว)
  ensureAuraFx(){
    if(this._auraFx&&this._auraFx.active)return;
    if(!(this.textures.exists('fx_aura')&&this.anims.exists('fx_aura')))return;
    const s=this.camWorld(this.add.sprite(this.player.x,this.player.y,'fx_aura',0));
    s.setDepth(3).setBlendMode(Phaser.BlendModes.NORMAL).setOrigin(0.5,0.5);
    s.play('fx_aura'); this._auraFx=s;
  }
  // เรียกทุกเฟรม: ออร่าตามตัว + tick ดาเมจต่อเนื่อง (มีสกิล aura เท่านั้น)
  tickAura(dt){
    const lvl=this.skills&&this.skills.aura; if(!lvl){ if(this._auraFx){this._auraFx.destroy();this._auraFx=null;} return; }
    const aw=lvl>=SKILL_AWAKEN_LV, r=(60+lvl*16)*(aw?1.7:1);
    if(this._auraFx&&this._auraFx.active){ this._auraFx.x=this.player.x; this._auraFx.y=this.player.y;
      this._auraFx.setScale((2*r)/ASSET_FX.fx_aura.fw); this._auraFx.setAlpha(Math.min(0.85,0.4+lvl*0.08)); }
    else this.ensureAuraFx();
    this._auraTick=(this._auraTick||0)-dt;
    if(this._auraTick<=0){ this._auraTick=0.35; const dmg=(5+lvl*2)*this.player.dmgMul*(aw?1.6:1)*0.55;   // *0.55 เพราะ tick ถี่ (~3/วิ)
      this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){ this.damage(e,dmg,e.x,e.y);
        if(aw&&!e.isBoss){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); e.setVelocity(Math.cos(a)*140,Math.sin(a)*140); e.knock=0.15; } } });
      this.hitCratesInRadius(this.player.x,this.player.y,r,dmg); }
  }
  fireBeam(ang,len,wide,dmg){
    const px=this.player.x, py=this.player.y;
    if(this.textures.exists('fx_beam')&&this.anims.exists('fx_beam')){
      const sx=len/ASSET_FX.fx_beam.fw, sy=0.42*(wide/15);
      this.spawnFxAnim('fx_beam',px,py,{rotation:ang,scaleX:sx,scaleY:sy,depth:6,anchor:'left'});
    } else {
      const g=this.camWorld(this.add.rectangle(px,py,len,wide,0xffe08a,0.75).setOrigin(0,0.5).setDepth(6)); g.setRotation(ang);
      this.tweens.add({targets:g,alpha:0,scaleY:0.3,duration:260,onComplete:()=>g.destroy()});
    }
    const dx=Math.cos(ang),dy=Math.sin(ang);
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-px, ry=e.y-py;
      const proj=rx*dx+ry*dy; if(proj<0||proj>len)return; if(Math.abs(-rx*dy+ry*dx)<wide/2+16) this.damage(e,dmg,e.x,e.y); });
  }
  meteorStrike(x,y,r,dmg,delay){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const warn=this.camWorld(this.add.circle(x,y,r,0xffb15a,0.14).setDepth(2).setStrokeStyle(2,0xffb15a,0.6));
      const donArt=this.textures.exists('fx_donut');
      const don = donArt
        ? this.camWorld(this.add.image(x,y-260,'fx_donut').setDepth(7).setScale((r*1.5)/96))
        : this.camWorld(this.add.circle(x,y-260,9,0xd9a066,1).setDepth(7).setStrokeStyle(3,0xa6702e,1));
      this.tweens.add({targets:don,y:y,duration:300,ease:'Quad.in',onComplete:()=>{ don.destroy(); warn.destroy();
        if(this.anims.exists('fx_donutimpact')) this.spawnFxAnim('fx_donutimpact',x,y,{scale:(2*r)/ASSET_FX.fx_donutimpact.fw,depth:4,anchor:'center'});
        else { const boom=this.camWorld(this.add.circle(x,y,10,0xffcf70,0.5).setDepth(3));
          this.tweens.add({targets:boom,radius:r,alpha:0,duration:260,onComplete:()=>boom.destroy()}); }
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(x,y,r,dmg);
        this.cameras.main.shake(80,0.004); Sfx.boom(); }}); });
  }
  creamWave(maxR,dmg,delay){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const px=this.player.x, py=this.player.y, hit=new Set();
      this.hitCratesInRadius(px,py,maxR,dmg);
      if(this.textures.exists('fx_wave')&&this.anims.exists('fx_wave')){ const wl=this.skills.wave||1; this.spawnFxAnim('fx_wave',px,py,{scale:(2*maxR)/ASSET_FX.fx_wave.fw,depth:3,anchor:'center',alpha:Math.min(1,0.5+wl*0.1)}); }
      const ring=this.camWorld(this.add.circle(px,py,10,0xbfe8ff,0).setDepth(3).setStrokeStyle(5,0xffffff,0.85));
      this.tweens.add({targets:ring,radius:maxR,alpha:{from:0.9,to:0},duration:420,ease:'Quad.out',
        onUpdate:()=>{ const rr=ring.radius; this.enemies.children.iterate(e=>{ if(e&&e.active&&!hit.has(e)){ const d=this.dist(e.x,e.y,px,py);
          if(d<rr&&d>rr-46){ hit.add(e); this.damage(e,dmg,e.x,e.y); if(!e.isBoss){ const a=Math.atan2(e.y-py,e.x-px); e.setVelocity(Math.cos(a)*260,Math.sin(a)*260); e.knock=0.2; } } } }); },
        onComplete:()=>ring.destroy() }); });
  }
  explodeAt(x,y,r,dmg){
    if(this.textures.exists('fx_boom')&&this.anims.exists('fx_boom')){
      this.spawnFxAnim('fx_boom',x,y,{scale:(2*r)/ASSET_FX.fx_boom.fw*1.15,depth:5,anchor:'center'});
    } else { const ring=this.camWorld(this.add.circle(x,y,10,0xffb08a,0.5).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:240,onComplete:()=>ring.destroy()}); }
    this.burst(x,y,0xff8b6b);
    this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(x,y,r,dmg); Sfx.boom(); }
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
    if(this.textures.exists('fx_thunder')&&this.anims.exists('fx_thunder')){
      this.spawnFxAnim('fx_thunder',x,y,{scaleY:280/ASSET_FX.fx_thunder.fh,scaleX:2.4,depth:7,anchor:'bottom'});
      const fl=this.camWorld(this.add.circle(x,y,22,0xbfe3ff,0.55).setDepth(7));
      this.tweens.add({targets:fl,alpha:0,scale:1.6,duration:220,onComplete:()=>fl.destroy()}); return;
    }
    const g=this.camWorld(this.add.graphics().setDepth(7)); g.lineStyle(3,0xfff2a8,1);
    g.beginPath(); g.moveTo(x,y-260); g.lineTo(x+Phaser.Math.Between(-14,14),y-130); g.lineTo(x,y); g.strokePath();
    const fl=this.camWorld(this.add.circle(x,y,22,0xfff2a8,0.6).setDepth(7));
    this.tweens.add({targets:[g,fl],alpha:0,duration:200,onComplete:()=>{ g.destroy(); fl.destroy(); }});
  }
  nearestEnemy(maxD){ let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2; if(d<bd){bd=d;best=e;} });
    return best; }
  // chain: กระสุนเด้งไฟฟ้าไปศัตรูใกล้ ๆ ต่อกันเป็นทอด (สายฟ้าลูกโซ่)
  chainFrom(bullet,enemy){ if(!(bullet.chain>0))return; const hit=new Set([enemy]); let src=enemy;
    for(let j=0;j<bullet.chain;j++){ let nb=null,nd=300*300;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&!hit.has(o)){ const d=(o.x-src.x)**2+(o.y-src.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(!nb)break; hit.add(nb); this.chainBolt(src.x,src.y,nb.x,nb.y); this.damage(nb,bullet.dmg*0.55,nb.x,nb.y); src=nb; } }
  hitEnemy(bullet,enemy){ if(!bullet.active||!enemy.active)return;
    if(bullet.pierce){ if(bullet.hitCd>0)return; bullet.hitCd=bullet.hitGapV||0.16; this.damage(enemy,bullet.dmg,bullet.x,bullet.y); this.chainFrom(bullet,enemy); return; }
    this.damage(enemy,bullet.dmg,bullet.x,bullet.y); this.chainFrom(bullet,enemy);
    if(bullet.explode){ this.explodeAt(bullet.x,bullet.y,bullet.explode,bullet.dmg*0.8); this.killBullet(bullet); return; }   // จรวดระเบิด AoE
    if(bullet.bounce>0){ bullet.bounce--;
      let nb=null,nd=360*360;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==enemy){ const d=(o.x-bullet.x)**2+(o.y-bullet.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(nb&&bullet.body){ const sp=bullet.body.velocity.length()||460, ang=Math.atan2(nb.y-bullet.y,nb.x-bullet.x);
        this.physics.velocityFromRotation(ang,sp,bullet.body.velocity); return; } }
    this.killBullet(bullet); }
  damage(e,amount,x,y){ if(!e.active)return;
    amount+=(this.player.flatDmg||0);   // ดาเมจตรง (พรสวรรค์ ATK) บวกทุกครั้งที่โดน
    let crit=false; if(this.player.critChance && Math.random()<this.player.critChance){ amount*=(this.player.critMul||1.8); crit=true; }
    e.hp-=amount;
    e._sqX = 1.35; e._sqY = 0.70;   // เอฟเฟกต์ยุบตัวเมื่อโดนตี (Hit squash)
    if(crit){ this.hitStop(35); this.cameras.main.shake(90, 0.005); }
    this.vfxHitRing(x,y,crit?0xffd166:0xffffff,crit);
    e.setTintFill(crit?0xffe08a:0xffffff); this.time.delayedCall(60,()=>{ if(!e.active)return;
      if(e.frozen) e.setTint(COLORS.ice); else if(e.tintColor) e.setTint(e.tintColor); else e.clearTint(); });
    this.popDmg(Math.round(amount),x,y,crit); if(e.hp<=0) this.killEnemy(e); }
  killEnemy(e){ this.kills++; this.killTxt.setText('☠ '+this.kills);
    if(this.player.lifesteal) this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.lifesteal);   // ดูดเลือด (พรสวรรค์)
    const isBoss=e.isBoss, isMini=e.isMini, isElite=e.isElite, big=isBoss||isMini; if(!big) Sfx.pop();
    // Bestiary: นับจำนวนที่ฆ่าตามชนิด
    const btype=isBoss?'boss':isMini?'mini':e.dasher?'dasher':e.siege?'siege':e.shooter?'shooter':e.bomber?'bomber':(e.texture.key==='e_fast'?'fast':e.texture.key==='e_tank'||isElite?'tank':'basic');
    Save.addKill(btype);
    const deathColor=big?0xffd166:(isElite?0xffb15a:(e.texture.key==='e_tank'?0x8b5cf0:0xffd166));
    this.burst(e.x,e.y,deathColor);
    this.vfxDeathPoof(e.x,e.y,deathColor,big||isElite);
    if(big){ this.cameras.main.shake(isBoss?400:220,isBoss?0.012:0.008); this.burst(e.x,e.y,0xff9ec4); if(isMini)Sfx.clear(); }
    if(e._aura){ e._aura.destroy(); e._aura=null; }   // เก็บออร่าคลั่ง
    if(isBoss) this.bossDefeat(e.x,e.y);   // ฉากบอสตายอลังการ
    this.dropOrb(e.x,e.y,e.xp||1);   // ออร์บเดียวต่อศัตรู · สีบอกค่า EXP (ไม่สแปมหลายเม็ด)
    if(isBoss||isMini||(isElite&&Math.random()<0.5)||(!big&&Math.random()<0.03)) this.dropHeal(e.x+Phaser.Math.Between(-10,10),e.y+Phaser.Math.Between(-10,10));  // ไอเทมฟื้นฟู (บอส/มินิแน่นอน · elite 50% · ธรรมดา 3%)
    if(isMini||(isElite&&Math.random()<0.12)||(!big&&Math.random()<0.008)) this.spawnVac(e.x,e.y);   // ไอเทมแม่เหล็ก (สุ่มน้อย · มินิแน่นอน)
    if((isMini&&Math.random()<0.25)||(isElite&&Math.random()<0.06)) this.spawnLoot(e.x,e.y);         // ของสวมใส่ดรอป (low tier · โอกาสน้อย)
    // bomber: ระเบิดตอนตาย (เตือนสั้น ๆ ด้วยวง แล้วโดนถ้าอยู่ใกล้)
    if(e.bomber){ const bx=e.x,by=e.y, r=70;
      const ring=this.camWorld(this.add.circle(bx,by,10,0xff7a4d,0.5).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:260,onComplete:()=>ring.destroy()});
      this.burst(bx,by,0xff8b6b); Sfx.boom();
      if(this.dist(this.player.x,this.player.y,bx,by)<r) this.hurtPlayer(Math.round(12+this.stageIndex*4),0.5); }
    // เก็บ Sugar (สกุลเงินเมต้า ใช้รอบหน้า)
    const sug=isBoss?40:isMini?18:isElite?4:1; this.sugarStage+=sug; this.sugarRun+=sug;
    e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; e.isBoss=false; e.isMini=false; e.isElite=false; e.shooter=false; e.bomber=false; e.dasher=false; e.siege=false; e.dashState=null; e.clearTint(); e.setScale(1);
    if(isBoss){ this.onBossDown(e.x,e.y); return; }   // บอสตาย = ดรอปหีบสมบัติ → เดินเก็บ = สุ่มสกิล → เคลียร์ด่าน
    if(isMini){ this.onWaveCleared(); return; }   // มินิบอสตาย = ผ่านเวฟ (เวฟธรรมดาคุมด้วยเวลาใน tickStage) }
  }
  killBullet(b){ b.setActive(false).setVisible(false); if(b.body){b.body.enable=false; b.body.stop();} }
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
    const st=this.orbStyle(value); o.value=value; o._vac=false; o.setTint(st.tint); o._sc=st.sc; o.setRotation(0).setDepth(80000);
    o.body.setAllowGravity(false); o.setScale(st.sc); this.camWorld(o); }
  collectOrb(player,o){ if(!o.active)return; const ox=o.x,oy=o.y,ov=o.value||1; o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; o.clearTint(); Sfx.xp(); this.jelly(0.9,-0.9);
    this.vfxCollectSparkle(ox,oy,this.orbStyle(ov).tint); this.gainXp(ov); }
  // ---- ไอเทมฟื้นฟู HP ----
  dropHeal(x,y){ let h=this.heals.getFirstDead(false);
    if(!h) h=this.heals.create(x,y,'heal'); else { h.setActive(true).setVisible(true); h.body.enable=true; h.setPosition(x,y); }
    h.body.setAllowGravity(false); h.setScale(1); this.camWorld(h); if(this.iso)h.setDepth(h.y);
    this.tweens.add({targets:h,y:y-6,duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectHeal(player,h){ if(!h.active)return; this.tweens.killTweensOf(h); h.setActive(false).setVisible(false); if(h.body)h.body.enable=false;
    const amt=Math.round(this.player.maxhp*0.18)+6; this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);
    Sfx.heal(); this.jelly(0,2.2); this.popHeal(this.player.x,this.player.y,amt); this.burst(h.x,h.y,0xff8fb5); this.vfxCollectSparkle(h.x,h.y,0xff8fb5);
    if(this.textures.exists('fx_heal')&&this.anims.exists('fx_heal')) this.spawnFxAnim('fx_heal',this.player.x,this.player.y,{scale:150/ASSET_FX.fx_heal.fw,depth:8,anchor:'center'}); }
  popHeal(x,y,n){ const t=this.camWorld(this.add.text(x,y-20,'+'+n+' HP',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#8bffb0'}).setDepth(20).setOrigin(0.5));
    this.tweens.add({targets:t,y:y-56,alpha:0,duration:700,onComplete:()=>t.destroy()}); }
  // ---- กล่อง/โหลทุบได้ (ธีมครัว) ----
  spawnCrate(){ const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*(0.25+Math.random()*0.3);
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let c=this.crates.getFirstDead(false);
    if(!c) c=this.crates.create(x,y,'crate'); else { c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    c.body.setAllowGravity(false); c.body.setImmovable(true); c.setCircle(18,4,4); c.hp=14+this.stageIndex*6; c.maxhp=c.hp; c.setScale(1).clearTint(); this.camWorld(c); if(this.iso)c.setDepth(c.y);
    this.tweens.add({targets:c,scale:{from:0.2,to:1},duration:220,ease:'Back.out'}); }
  // ดาเมจใส่กล่อง (รวม flat damage) + เอฟเฟกต์ + แตก — ใช้ร่วมทั้งกระสุนและ AoE
  crateHit(c,amount){ if(!c||!c.active)return; c.hp-=amount+(this.player.flatDmg||0);
    c.setTintFill(0xffffff); this.time.delayedCall(50,()=>{ if(c.active)c.clearTint(); });
    if(c.hp<=0) this.breakCrate(c); }
  hitCrate(bullet,c){ if(!c.active||!bullet.active)return;
    this.crateHit(c,(bullet.dmg||5)*this.player.dmgMul);
    if(!bullet.pierce) this.killBullet(bullet); }
  // สกิล AoE (ระเบิด/ฟ้าผ่า/ออร่า ฯลฯ) ก็ต้องตีกล่องแตกได้ด้วย (แก้บั๊กบางสกิลตีกล่องไม่โดน)
  hitCratesInRadius(x,y,r,amount){ if(!this.crates)return;
    this.crates.children.iterate(c=>{ if(c&&c.active&&this.dist(c.x,c.y,x,y)<r+18) this.crateHit(c,amount); }); }
  breakCrate(c){ const x=c.x,y=c.y; this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false;
    this.burst(x,y,0xe59a4d); Sfx.boom(); this.cameras.main.shake(90,0.004);
    this.dropOrb(x,y, 3+Phaser.Math.Between(0,this.stageIndex*2));   // ดรอปออร์บ
    if(Math.random()<0.5) this.dropHeal(x+Phaser.Math.Between(-12,12),y+Phaser.Math.Between(-12,12));   // ครึ่งนึงดรอปฟื้นฟู
    if(Math.random()<0.10) this.spawnLoot(x,y);   // โอกาสเล็ก ๆ ได้ของสวมใส่ (low tier)
    if(Math.random()<0.07) this.spawnVac(x,y);    // โอกาสเล็ก ๆ ได้แม่เหล็ก
    if(Math.random()<0.25) this.sugarStage+=3;
  }
  // ---- ไอเทมแม่เหล็ก (vacuum): เก็บแล้วดูดออร์บ EXP ทั้งจอเข้าตัวทันที ----
  spawnVac(x,y){ let v=this.vacs.getFirstDead(false);
    if(!v) v=this.vacs.create(x,y,'vac'); else { v.setActive(true).setVisible(true); v.body.enable=true; v.setPosition(x,y); }
    v.body.setAllowGravity(false); v.setScale(1); this.camWorld(v); if(this.iso)v.setDepth(v.y);
    this.tweens.add({targets:v,y:y-6,duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectVac(player,v){ if(!v.active)return; this.tweens.killTweensOf(v); v.setActive(false).setVisible(false); if(v.body)v.body.enable=false;
    Sfx.heal(); this.burst(v.x,v.y,0xff5a6e); this.showBanner('🧲 แม่เหล็ก!','ดูดเม็ด EXP ทั้งจอ',1200);
    this.orbs.children.iterate(o=>{ if(o&&o.active){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x); o.setVelocity(Math.cos(ang)*520,Math.sin(ang)*520); o._vac=true; } });
  }
  // ---- ของสวมใส่ดรอป (loot) — สุ่มของ common ในด่าน (โอกาสน้อย) ----
  spawnLoot(x,y){ let g=this.loots.getFirstDead(false);
    if(!g) g=this.loots.create(x,y,'gift'); else { g.setActive(true).setVisible(true); g.body.enable=true; g.setPosition(x,y); }
    g.body.setAllowGravity(false); g.setScale(1); this.camWorld(g); if(this.iso)g.setDepth(g.y);
    this.tweens.add({targets:g,y:y-6,duration:640,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectLoot(player,g){ if(!g.active)return; this.tweens.killTweensOf(g); g.setActive(false).setVisible(false); if(g.body)g.body.enable=false;
    Sfx.select(); this.burst(g.x,g.y,0x7fd0ff);
    const got=this.grantGear('common');   // ดรอปในด่าน = เน้น common
    if(got) this.showBanner('🎁 ได้ของสวมใส่!',GEAR_SLOTS.find(s=>s.slot===got.slot).emoji+' '+got.name,1600);
    else { this.sugarStage+=5; this.showBanner('🎁 ของซ้ำ','แปลงเป็น 🍬 +5',1200); }
  }
  // ---- หีบสมบัติ (ดรอปจากบอส) → เดินไปเก็บ = เปิดหน้าสุ่มสกิล ----
  spawnChest(x,y){ let c=this.chests.getFirstDead(false);
    if(!c) c=this.chests.create(x,y,'chest'); else { c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    c.body.setAllowGravity(false); c.setScale(1); this.camWorld(c); if(this.iso)c.setDepth(c.y);
    this.tweens.add({targets:c,scale:{from:0.3,to:1.1},duration:400,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const gl=this.camWorld(this.add.circle(x,y,26,0xffd166,0.25).setDepth(3)); c._glow=gl;
    this.tweens.add({targets:gl,radius:40,alpha:{from:0.25,to:0},duration:900,repeat:-1,ease:'Quad.out'}); }
  collectChest(player,c){ if(!c.active)return; this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false;
    if(c._glow){ this.tweens.killTweensOf(c._glow); c._glow.destroy(); c._glow=null; }
    Sfx.clear(); this.burst(c.x,c.y,0xffd166); this.screenFlash(0xffe08a,0.4,300);
    this._chestReward=true; this.pendingLvl=(this.pendingLvl||0)+1; this.openLevelUp(); }
  // มอบของสวมใส่ตาม tier (สุ่มชิ้นที่ยังไม่มี) — คืน item หรือ null ถ้ามีครบแล้ว
  grantGear(tier){ const owned=Save.data.ownedGear;
    let pool=gearPool(tier).filter(it=>!owned.includes(it.id));
    if(!pool.length && tier==='common') pool=gearPool('rare').filter(it=>!owned.includes(it.id));
    if(!pool.length) return null;
    const it=Phaser.Utils.Array.GetRandom(pool); owned.push(it.id); Save.save(); return it; }
  gachaRoll(){ const roll=Math.random()<0.68?'common':'rare'; let it=this.grantGear(roll);
    if(!it) it=this.grantGear(roll==='common'?'rare':'common'); return it; }
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
    this.vfxHurtFlash();
    this.vfxHitRing(this.player.x,this.player.y,0xff5a6e,false);
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>{ if(this.player.active)this.player.clearTint(); });
    if(this.player.hp<=0) this.die(); }
  hitByFoe(player,b){ if(!b.active)return; this.killFoe(b); this.hurtPlayer(b.dmg||10,0.5); }
  killFoe(b){ b.setActive(false).setVisible(false); if(b.body){ b.body.enable=false; b.body.stop(); } }
  // ยิงกระสุนศัตรู 1 นัด
  foeShot(x,y,ang,speed,dmg,tint,scale){
    let b=this.foeBullets.getFirstDead(false);
    if(!b) b=this.foeBullets.create(x,y,'spark'); else { b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }
    b.setScale(scale||1.4).setTint(tint||0xff6b8a).setDepth(90000); if(b.body){b.body.setAllowGravity(false);} b.dmg=dmg; b.life=3.0; this.camWorld(b);
    if(b.body)this.physics.velocityFromRotation(ang,speed,b.body.velocity); return b; }
  // hazard: วงอันตรายบนพื้น (เตือนก่อน → ระเบิด → จาง)
  spawnHazard(x,y,r,dmg,tint){
    const useArt=this.textures.exists('fx_hazard');
    let warn;
    if(useArt){ const base=this.textures.get('fx_hazard').getSourceImage().width||256, sc=(r*2*1.25)/base;
      warn=this.camWorld(this.add.image(x,y,'fx_hazard').setDepth(2).setScale(sc, sc*0.82).setAlpha(0.5));
      this.tweens.add({targets:warn,alpha:{from:0.5,to:0.9},scaleX:sc*1.04,duration:260,yoyo:true,repeat:1}); }
    else { warn=this.camWorld(this.add.circle(x,y,r,tint||0xff5a4d,0.12).setDepth(2).setStrokeStyle(3,tint||0xff5a4d,0.7));
      this.tweens.add({targets:warn,alpha:{from:0.12,to:0.32},duration:260,yoyo:true,repeat:1}); }
    this.time.delayedCall(760,()=>{ if(this.state!=='play'&&this.state!=='levelup'){ warn.destroy(); return; }
      const boom=this.camWorld(this.add.circle(x,y,r,tint||0xff5a4d,0.5).setDepth(2));
      this.tweens.add({targets:boom,alpha:0,scale:1.15,duration:280,onComplete:()=>boom.destroy()});
      this.tweens.add({targets:warn,alpha:0,duration:220,onComplete:()=>warn.destroy()});
      if(this.dist(this.player.x,this.player.y,x,y)<r+8) this.hurtPlayer(dmg,0.5);
      Sfx.boom(); });
  }
  /* ---------- BOSS AI: แพทเทิร์นโจมตี + เฟส ---------- */
  bossThink(b,dt){
    // หายใจ "มีชีวิต" (สเกลเต้นเบา ๆ) — วิชวลล้วน ไม่กระทบ body
    if(b._baseScale===undefined)b._baseScale=b.scaleX;
    b._breathe=(b._breathe||0)+dt*(b.phase2?5:3.2);
    b.setScale(b._baseScale*(1+Math.sin(b._breathe)*(b.phase2?0.06:0.035)));
    if(b._aura){ b._aura.setPosition(b.x,b.y);   // ออร่าคลั่ง
      if(b._auraIsFx) b._aura.setScale((b._baseScale||1)*2.4*(1+Math.sin(b._breathe*1.5)*0.06));
      else b._aura.setScale(1+Math.sin(b._breathe*1.5)*0.12).setAlpha(0.12+Math.abs(Math.sin(b._breathe))*0.1); }
    if(b.frozen>0)return;
    if(b.atkCd===undefined)b.atkCd=1.6; b.atkCd-=dt;
    // เฟส 2 ตอนเลือดครึ่ง (เร็ว/ดุขึ้น) — เอฟเฟกต์โกรธ
    if(!b.phase2 && b.hp<=b.maxhp*0.5){ b.phase2=true; b.spd*=1.28; b.atkCd=0.6;
      this.showBanner('🔥 บอสโกรธ!','เฟส 2 — โจมตีดุขึ้น!',1500); this.cameras.main.shake(420,0.014); this.screenFlash(0xff4d5a,0.3,420);
      if(!b.atks.includes('nova'))b.atks.push('nova');   // ปลดท่าคลื่นสังหาร
      if(!b._aura){ if(this.anims.exists('fx_enrage')){ b._aura=this.camWorld(this.add.sprite(b.x,b.y,'fx_enrage',0)).setDepth(3).setBlendMode(Phaser.BlendModes.NORMAL); b._aura.play('fx_enrage'); b._auraIsFx=true; }
        else b._aura=this.camWorld(this.add.circle(b.x,b.y,58,0xff5a4d,0.14).setDepth(3)); }   // ออร่าคลั่งถาวร (AI flipbook ถ้ามี)
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
      b.setTintFill(0xffffff); this.time.delayedCall(260,()=>{ if(!b.active)return; if(b.tintColor)b.setTint(b.tintColor); else b.clearTint();
        b.setVelocity(Math.cos(ang)*(560+this.stageIndex*20),Math.sin(ang)*(560+this.stageIndex*20)); b.knock=0.45; });
      b.atkCd=2.8*fast;
    } else if(pick==='summon'){ // เรียกลูกน้อง
      if(this.anims.exists('fx_bosssummon')) this.spawnFxAnim('fx_bosssummon',b.x,b.y+30,{scale:2.4,depth:2,anchor:'center'});
      else if(this.anims.exists('fx_bossportal')) this.spawnFxAnim('fx_bossportal',b.x,b.y+30,{scale:1.6,depth:2,anchor:'center'});
      const n=2+this.stageIndex+(b.phase3?2:0); for(let i=0;i<n;i++) this.spawnEnemy(Math.random()<0.5?'fast':'basic');
      Sfx.bossWarn(); b.atkCd=3.2*fast;
    } else if(pick==='nova'){ // คลื่นสังหารขยายจากบอส — ต้องหลบให้อยู่ในวง/นอกวง
      const px=b.x,py=b.y, maxR=220+this.stageIndex*22; let hitOnce=false;
      if(this.anims.exists('fx_bossnova')) this.spawnFxAnim('fx_bossnova',px,py,{scale:(2*maxR)/ASSET_FX.fx_bossnova.fw,depth:4,anchor:'center'});
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
    } else if(pick==='spiral'){ // ยิงเป็นเกลียวหมุน — ต้องวิ่งหนีเป็นวง
      const arms=b.isBoss?3:2, spd=165+this.stageIndex*10, dmg=Math.round((7+this.stageIndex*2.4)*pw), a0=Math.random()*Math.PI*2;
      for(let k=0;k<10;k++) this.time.delayedCall(k*60,()=>{ if(!b.active||this.state!=='play')return;
        for(let arm=0;arm<arms;arm++) this.foeShot(b.x,b.y,a0+k*0.5+arm*(Math.PI*2/arms),spd,dmg,0xffd0e8); });
      Sfx.zap(); b.atkCd=3.0*fast;
    } else if(pick==='trap'){ // วงกับดักล้อมผู้เล่น เว้นช่องเดียว — บังคับให้วิ่งหนีออกช่อง
      const n=10, R=150, gap=Math.floor(Math.random()*n), dmg=Math.round((12+this.stageIndex*4)*pw);
      for(let i=0;i<n;i++){ if(i===gap||i===(gap+1)%n)continue; const a=(i/n)*Math.PI*2;
        this.spawnHazard(this.player.x+Math.cos(a)*R,this.player.y+Math.sin(a)*R,58,dmg,0xff7a4d); }
      this.showBanner('⚠️ วงล้อม!','วิ่งออกทางช่องว่าง!',900); b.atkCd=3.0*fast;
    }
  }

  /* ---------- FX & ANIMATIONS ---------- */
  hitStop(ms){
    if(this._isHitStop) return;
    this._isHitStop = true;
    const oldSpd = this.physics.world.timeScale;
    this.physics.world.timeScale = 0.05;
    this.time.delayedCall(ms, () => {
      this.physics.world.timeScale = oldSpd;
      this._isHitStop = false;
    });
  }
  popDmg(n,x,y,crit){
    let t=this.dmgPool.pop();
    if(!t){ t=this.add.text(x,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px'}).setDepth(99999).setOrigin(0.5); this.camWorld(t); }
    else t.setActive(true).setVisible(true);
    const str = crit ? ('💥 '+n) : n;
    t.setText(str).setColor(crit?'#ffd23f':'#ffffff').setFontSize(crit?'22px':'15px').setPosition(x+Phaser.Math.Between(-8,8),y-12).setAlpha(1).setScale(crit?1.5:1.0);
    this.tweens.add({
      targets:t,
      y:y-(crit?60:42),
      scale:crit?1.0:0.9,
      alpha:0,
      duration:crit?640:500,
      ease:crit?'Back.out':'Linear',
      onComplete:()=>{ t.setVisible(false); this.dmgPool.push(t); }
    });
  }
  spawnGhostTrail(){
    const p=this.player; if(!p)return;
    const g=this.camWorld(this.add.image(p.x,p.y,p.texture.key,p.frame?p.frame.name:0)
      .setDepth(p.depth-1)
      .setScale(p.scaleX,p.scaleY)
      .setRotation(p.rotation)
      .setFlipX(p.flipX)
      .setAlpha(0.65)
      .setTint(0x8fd0ff));
    this.tweens.add({targets:g,alpha:0,scaleX:g.scaleX*0.85,scaleY:g.scaleY*0.85,duration:240,onComplete:()=>g.destroy()});
  }
  spawnDust(x,y){
    const d=this.camWorld(this.add.circle(x+Phaser.Math.Between(-6,6),y,Phaser.Math.Between(4,7),0xffffff,0.35).setDepth(2));
    this.tweens.add({targets:d,y:y-8,alpha:0,scale:1.6,duration:260,onComplete:()=>d.destroy()});
  }
  burst(x,y,color){ for(let i=0;i<7;i++){ const p=this.camWorld(this.add.image(x,y,'dot').setTint(color).setDepth(6).setScale(Phaser.Math.FloatBetween(0.5,1.1)));
    const a=Math.random()*Math.PI*2, s=Phaser.Math.Between(40,150);
    this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:420,onComplete:()=>p.destroy()}); } }
  squash(o,sx,sy){ o.setScale(sx,sy); this.tweens.add({targets:o,scaleX:1,scaleY:1,duration:220,ease:'Back.out'}); }
  // VFX ระเบิดวง (รูปจริง) — ขยายจากเล็ก→เต็มรัศมี แล้วจางหาย · โอเวอร์เลย์แบนราบ (oval) เข้ากับมุมกล้อง
  fxBurst(key,x,y,radius,dur,spin){
    if(!this.textures.exists(key))return null;
    const base=this.textures.get(key).getSourceImage().width||256, full=(radius*2*1.15)/base;
    const im=this.camWorld(this.add.image(x,y,key).setDepth(6).setScale(full*0.35, full*0.35*0.82));
    const t={scaleX:full, scaleY:full*0.82, alpha:{from:0.95,to:0}, duration:dur, ease:'Quad.out', onComplete:()=>im.destroy()};
    if(spin)im.setRotation(Math.random()*Math.PI*2);
    this.tweens.add({targets:im, ...t}); return im; }
  // --- VFX: hit impact ring (expanding ring + sparks) --- throttled for performance
  vfxHitRing(x,y,color,big){
    if(!big){ this._hitVfxT=this._hitVfxT||0; const now=this.time.now; if(now-this._hitVfxT<60)return; this._hitVfxT=now; }
    const r=big?1.6:0.85;
    const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(color).setDepth(7).setScale(0.15*r,0.12*r).setAlpha(big?0.6:0.3));  // เบาลง ไม่สาดขาวเต็มจอ
    this.tweens.add({targets:ring,scaleX:1.4*r,scaleY:1.15*r,alpha:0,duration:big?300:200,ease:'Quad.out',onComplete:()=>ring.destroy()});
    this._emit(this.pSpark,x,y,color,big?7:3);
  }
  // --- VFX: death poof (smoke cloud) ---
  vfxDeathPoof(x,y,color,big){
    const sc=big?2.2:1.0;
    const halo=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xffffff).setDepth(6).setScale(0.1*sc,0.08*sc).setAlpha(0.6));
    this.tweens.add({targets:halo,scaleX:1.2*sc,scaleY:1.0*sc,alpha:0,duration:big?360:240,ease:'Quad.out',onComplete:()=>halo.destroy()});
    this._emit(this.pSmoke,x,y,color,big?14:6);
    this._emit(this.pSpark,x,y,color,big?7:3);
  }
  // --- VFX: skill cast glow (radial flash at caster) ---
  vfxCastGlow(color){
    const p=this.player; if(!p)return;
    const glow=this.camWorld(this.add.image(p.x,p.y,'vfx_glow').setTint(color).setDepth(5).setScale(0.5).setAlpha(0.75));
    this.tweens.add({targets:glow,scale:2.8,alpha:0,duration:300,ease:'Quad.out',onComplete:()=>glow.destroy()});
  }
  // --- VFX: speed lines during dash ---
  vfxSpeedLine(x,y,ang){
    const ln=this.camWorld(this.add.image(x,y,'vfx_line').setTint(0xbfe8ff).setDepth(4).setRotation(ang+Math.PI).setScale(1.2,0.6).setAlpha(0.65));
    this.tweens.add({targets:ln,scaleX:2.0,alpha:0,duration:200,onComplete:()=>ln.destroy()});
  }
  // --- VFX: enemy spawn poof --- throttled
  vfxSpawnPoof(x,y){
    this._spawnVfxT=this._spawnVfxT||0; const now=this.time.now; if(now-this._spawnVfxT<120)return; this._spawnVfxT=now;
    const p=this.camWorld(this.add.image(x,y,'vfx_poof').setTint(0xb98cff).setDepth(3).setScale(0.1).setAlpha(0.55));
    this.tweens.add({targets:p,scale:0.8,alpha:0,duration:260,ease:'Quad.out',onComplete:()=>p.destroy()});
  }
  // --- VFX: hurt vignette flash ---
  vfxHurtFlash(){
    const f=this.add.rectangle(this.W/2,this.H/2,this.W,this.H,0xff3344,0.18).setScrollFactor(1).setDepth(79);
    this.camUI(f); this.tweens.add({targets:f,alpha:0,duration:280,onComplete:()=>f.destroy()});
  }
  // --- VFX: level up celebration burst ---
  vfxLevelUp(){
    const p=this.player; if(!p)return;
    if(this.textures.exists('fx_levelup')&&this.anims.exists('fx_levelup')) this.spawnFxAnim('fx_levelup',p.x,p.y,{scale:220/ASSET_FX.fx_levelup.fw,depth:8,anchor:'center'});
    else { const ring=this.camWorld(this.add.image(p.x,p.y,'vfx_ring').setTint(0xffe08a).setDepth(8).setScale(0.2,0.16).setAlpha(0.9));
      this.tweens.add({targets:ring,scaleX:3.2,scaleY:2.6,alpha:0,duration:450,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
    const cols=[0xffe08a,0xff8fb5,0xbfe8ff,0xb6f0d6];
    cols.forEach(c=>this._emit(this.pDust,p.x,p.y,c,4));   // ฝุ่นหลากสีพุ่งฉลอง
  }
  // --- VFX: collect sparkle (orb pickup) ---
  vfxCollectSparkle(x,y,color){ this._emit(this.pSpark,x,y-6,color,4); }
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
    const src = (ASSET_SHEETS[key]&&ASSET_SHEETS[key].frame)
      || (this.player&&this.player.frame&&this.player.frame.width)
      || 60;
    this._pBase=60/src;
    this._hasFrames = !!ASSET_SHEETS[key] && this.textures.exists(key) && this.textures.get(key).frameTotal>1;
    if(this._hasFrames){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2,4); this._poseHold=0; }
    const r=24, off=Math.max(0,(src-2*r)/2);
    if(this.player&&this.player.body)this.player.body.setCircle(r,off,off);
  }
  // เลือกเฟรมท่าทาง: พุ่ง=ยืด · วิ่ง=สลับก้าว · โดนตี=ย่อ · ปกติ=ยืน+กะพริบตา
  updatePose(dt){
    if(!this._hasFrames)return;
    if(this._poseHold>0){ this._poseHold-=dt; return; }
    if(this.dashTime>0){ this.player.setFrame(CF.stretch); return; }
    const moving = this.player.body && this.player.body.velocity.length() > 24;
    if(moving){
      const stepIdx = Math.floor((this._wob / (Math.PI * 0.5)) % 4);
      const frames = [CF.idle, CF.squash, CF.stretch, CF.blink];
      this.player.setFrame(frames[stepIdx] || CF.idle);
      return;
    }
    this._blinkT-=dt;
    if(this._blinkT<=0){ this.player.setFrame(CF.blink);
      if(this._blinkT<-0.13){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2.2,4.5); } }
    else this.player.setFrame(CF.idle);
  }
  poseFlash(frame,ms){ if(!this._hasFrames)return; this.player.setFrame(frame); this._poseHold=(ms||160)/1000; }
  // อนิเมชันตัวละคร: สปริงเจลลี่ + หายใจ + หันหน้าตามทิศ + ควันฝุ่น + เงา Dash
  animatePlayer(dt){
    const p=this.player; if(!p||!p.body)return;
    if(this._sqVX===undefined){ this._sqVX=0; this._sqVY=0; this._wob=0; this._lean=0; }
    const stiff=210, damp=12;
    this._sqVX += (-(this._sqX-1)*stiff - this._sqVX*damp)*dt;
    this._sqVY += (-(this._sqY-1)*stiff - this._sqVY*damp)*dt;
    this._sqX += this._sqVX*dt; this._sqY += this._sqVY*dt;
    this._sqX=Phaser.Math.Clamp(this._sqX,0.55,1.6); this._sqY=Phaser.Math.Clamp(this._sqY,0.55,1.6);
    const sp=p.body.velocity.length(), moving=sp>24;
    // หันหน้าซ้าย-ขวาตามทิศทางการวิ่ง
    if(Math.abs(p.body.velocity.x)>15) p.setFlipX(p.body.velocity.x < 0);
    this._wob += dt*(moving?14:3.4);
    const breathe=Math.sin(this._wob)*(moving?0.11:0.05);
    const waddle=moving?Math.sin(this._wob*0.5)*0.10:0;
    const leanT=moving?Phaser.Math.Clamp(p.body.velocity.x/1100,-0.16,0.16):0;
    this._lean += (leanT-this._lean)*Math.min(1,dt*7);
    p.rotation = waddle + this._lean;
    const base=this._pBase||1;
    p.setScale(base*this._sqX*(1-breathe), base*this._sqY*(1+breathe));
    // ปล่อยฝุ่นละอองน้ำตาลใต้เท้าขณะวิ่ง
    if(moving){
      this._dustT = (this._dustT || 0) - dt;
      if(this._dustT <= 0){ this._dustT = 0.16; this.spawnDust(p.x, p.y+22); }
    }
    // ปล่อยเงาตามตัว (Ghost Trail) + เส้นความเร็ว ตอนพุ่ง Dash
    if(this.dashTime > 0){
      this._ghostT = (this._ghostT || 0) - dt;
      if(this._ghostT <= 0){ this._ghostT = 0.04; this.spawnGhostTrail(); }
      this._lineT = (this._lineT || 0) - dt;
      if(this._lineT <= 0){ this._lineT = 0.06;
        const da=Math.atan2(p.body.velocity.y,p.body.velocity.x);
        this.vfxSpeedLine(p.x+Phaser.Math.Between(-10,10),p.y+Phaser.Math.Between(-8,8),da);
      }
    }
  }
  jelly(vx,vy){ this._sqVX=(this._sqVX||0)+vx; this._sqVY=(this._sqVY||0)+vy; }

  /* ---------- DEATH ---------- */
  die(){ if(this.state==='dead')return; this.state='dead'; Sfx.bgmIntense(false); Sfx.dead(); Save.addSugar(this.sugarStage); this.gainCharExp(this.kills+this.stageIndex*15); this.sugarStage=0; this.physics.pause(); this.player.setVelocity(0,0);
    if(this._hasFrames){ this.player.setFrame(CF.ko); this.player.setScale(this._pBase||1); this.player.setRotation(0); }
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
    let dt=delta/1000; if(this.state!=='play')return; dt*=(this.gameSpeed||1); this.elapsed+=dt;   // gameSpeed = ปุ่มเร่งเวลา

    if(this.joy.active&&(this.joy.dx||this.joy.dy)){ this.moveDir.set(this.joy.dx,this.joy.dy); if(this.moveDir.lengthSq()>0.04)this.moveDir.normalize(); }

    if(this.dashTime>0){ this.dashTime-=dt; if(this.dashTime<=0){ this._sqX=0.8; this._sqY=1.22; this._sqVX=0; this._sqVY=0; this.poseFlash(CF.squash,150); } }
    else {
      const spd=this.player.baseSpeed;
      if(this.joy.active&&(Math.abs(this.joy.dx)+Math.abs(this.joy.dy))>0.12) this.player.setVelocity(this.joy.dx*spd,this.joy.dy*spd);
      else { this.player.setVelocity(this.player.body.velocity.x*0.8,this.player.body.velocity.y*0.8); if(this.player.body.velocity.length()<8)this.player.setVelocity(0,0); }
    }

    if(this.player.iframe>0)this.player.iframe-=dt;
    if(this.player.regen && this.player.hp<this.player.maxhp) this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.regen*dt);
    if(this.aura)this.aura.setPosition(this.player.x,this.player.y);
    this.animatePlayer(dt); this.updatePose(dt);
    if(this.iso){ this.player.setDepth(this.player.y); this.drawShadows(); }
    if(!this.dashReady){ this.dashCd-=dt; if(this.dashCd<=0)this.dashReady=true; }
    if(this.dashBtn) this.dashBtn.setFillStyle(COLORS.mint,this.dashReady?0.28:0.10);
    this.drawDashRing();
    this.tickAura(dt);
    this.tickStage(dt);

    // enemies
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(this.iso)e.setDepth(e.y);
      if(e.frozen>0){ e.frozen-=dt; e.setVelocity(0,0); if(e.frozen<=0){ if(e.tintColor)e.setTint(e.tintColor); else e.clearTint(); } return; }
      if(e.knock>0){ e.knock-=dt; return; }
      const dx=this.player.x-e.x, dy=this.player.y-e.y, ang=Math.atan2(dy,dx), dd=Math.hypot(dx,dy);
      // หันหน้าเข้าหาผู้เล่นเสมอ
      e.setFlipX(dx < 0);
      // แอนิเมชันก้าวเดินส่ายดึ๋งๆ (Waddle & Bounce)
      e.stepT = (e.stepT || (Math.random()*10)) + dt * (e.spd > 80 ? 12 : 7);
      const waddle = Math.sin(e.stepT) * (e.dasher ? 0.14 : 0.08);
      const bounce = Math.abs(Math.sin(e.stepT)) * 0.08;
      e.rotation = waddle;
      // ฟื้นตัวจาก Squash ตอนโดนตี
      if(e._sqX === undefined){ e._sqX = 1; e._sqY = 1; }
      e._sqX += (1 - e._sqX) * Math.min(1, dt * 14);
      e._sqY += (1 - e._sqY) * Math.min(1, dt * 14);
      const bScale = e.baseScale || 1;
      e.setScale(bScale * e._sqX * (1 - bounce*0.4), bScale * e._sqY * (1 + bounce));

      if(e.shooter){ e.shootCd-=dt;
        if(dd<300){ e.setVelocity(Math.cos(ang)*e.spd*0.12,Math.sin(ang)*e.spd*0.12);
          if(e.shootCd<=0){ e.shootCd=Phaser.Math.FloatBetween(1.3,2.2); this.foeShot(e.x,e.y,ang,225+this.stageIndex*15,e.dmg,0xffd27f); Sfx.zap(); }
          return; } }
      if(e.dasher){   // สายพุ่งโฉบ: เข้าหา → หน่วงเล็ง(ตัวสั่น) → พุ่งเร็วตัดผ่าน → พักแล้ววนใหม่
        e.dashT-=dt;
        if(e.dashState==='chase'){ e.setVelocity(Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);
          if(e.dashT<=0 && dd<360){ e.dashState='wind'; e.dashT=0.42; e.setVelocity(0,0); } }
        else if(e.dashState==='wind'){
          e.setVelocity(0,0); e.setTintFill(0xffffff);
          e.x += (Math.random() - 0.5) * 5;   // ตัวสั่นตอนชาร์จ
          if(e.dashT<=0){ e.dashState='dash'; e.dashT=0.32; e._da=ang; if(e.tintColor)e.setTint(e.tintColor); else e.clearTint();
            if(e.body)this.physics.velocityFromRotation(ang,e.spd*4.6,e.body.velocity); Sfx.dash&&Sfx.dash(); } }
        else if(e.dashState==='dash'){ if(e.body)this.physics.velocityFromRotation(e._da,e.spd*4.6,e.body.velocity);
          if(e.dashT<=0){ e.dashState='chase'; e.dashT=Phaser.Math.FloatBetween(0.9,1.8); } }
        return; }
      e.setVelocity(Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);
    });

    // orb vacuum + ออร์บมีชีวิต (หมุนช้า + เต้นวิบวับ)
    this.orbs.children.iterate(o=>{ if(!o||!o.active)return;
      o.rotation+=dt*2.2; const bob=1+Math.sin(this.elapsed*5+o.x*0.05)*0.12; o.setScale((o._sc||1)*bob);
      const d=this.dist(o.x,o.y,this.player.x,this.player.y);
      if(o._vac || d<this.player.pickup){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x), sp=o._vac?560:380; o.setVelocity(Math.cos(ang)*sp,Math.sin(ang)*sp); }
      else o.setVelocity(0,0); });

    // bullets life + boomerang return/rebound + spin + pierce cd
    this.bullets.children.iterate(b=>{ if(!b||!b.active)return;
      b.life-=dt; if(b.hitCd>0)b.hitCd-=dt;
      if(b.spin)b.rotation+=dt*14;
      else if(b.faceVel&&b.body&&(b.body.velocity.x||b.body.velocity.y))b.rotation=Math.atan2(b.body.velocity.y,b.body.velocity.x);   // จรวด/ส้อมหันตามทิศพุ่ง
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
