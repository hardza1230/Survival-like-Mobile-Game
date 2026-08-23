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
  bg1: 0x2a2233, mochi: 0xfff2f7, mochiEdge: 0xff9ec4, candy: 0xffd166,
  pink: 0xff5f97, grape: 0x8b5cf0, toast: 0xe2932b, mint: 0x1fb89a, ice: 0x8fd0ff,
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
  unlock(){ this.ensure(); if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); },
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
};

class Boot extends Phaser.Scene {
  constructor(){ super('Boot'); }
  create(){
    const g = this.make.graphics({ x:0, y:0, add:false });
    const blob=(key,fill,edge,size,eyes)=>{ g.clear();
      g.fillStyle(edge,1); g.fillRoundedRect(0,0,size,size,size*0.42);
      g.fillStyle(fill,1); g.fillRoundedRect(size*0.09,size*0.09,size*0.82,size*0.82,size*0.36);
      if(eyes){ g.fillStyle(0x2b2233,1); g.fillCircle(size*0.36,size*0.5,size*0.06); g.fillCircle(size*0.64,size*0.5,size*0.06); }
      g.generateTexture(key,size,size); };
    blob('mochi',COLORS.mochi,COLORS.mochiEdge,56,true);
    const enemy=(key,fill,edge,size)=>{ g.clear();
      g.fillStyle(edge,1); g.fillRoundedRect(0,0,size,size,size*0.4);
      g.fillStyle(fill,1); g.fillRoundedRect(size*0.1,size*0.1,size*0.8,size*0.8,size*0.34);
      g.fillStyle(0xffffff,1); g.fillCircle(size*0.36,size*0.46,size*0.11); g.fillCircle(size*0.64,size*0.46,size*0.11);
      g.fillStyle(0x2b2233,1); g.fillCircle(size*0.36,size*0.49,size*0.055); g.fillCircle(size*0.64,size*0.49,size*0.055);
      g.lineStyle(Math.max(2,size*0.05),0x2b2233,1);
      g.beginPath(); g.moveTo(size*0.26,size*0.30); g.lineTo(size*0.44,size*0.38); g.strokePath();
      g.beginPath(); g.moveTo(size*0.74,size*0.30); g.lineTo(size*0.56,size*0.38); g.strokePath();
      g.generateTexture(key,size,size); };
    enemy('e_basic',0x8bd3a0,0x57a878,40);
    enemy('e_fast',0x8fc7ff,0x5a90d6,34);
    enemy('e_tank',0xc7a8ff,0x8b5cf0,58);
    g.clear(); g.fillStyle(0xffe9a8,1); g.fillCircle(9,9,9); g.fillStyle(COLORS.candy,1); g.fillCircle(9,9,6.5);
    g.fillStyle(0xffffff,0.8); g.fillCircle(6.5,6.5,2); g.generateTexture('candy',18,18);
    g.clear(); g.fillStyle(0xffffff,1); g.fillCircle(6,6,6); g.fillStyle(COLORS.pink,1); g.fillCircle(6,6,4); g.generateTexture('spark',12,12);
    g.clear(); g.fillStyle(0xffffff,1); g.fillCircle(5,5,5); g.generateTexture('dot',10,10);
    g.destroy();
    this.scene.start('Game');
  }
}

/* ---- SKILLS: auto-cast, flashy, stackable ---- */
const SKILLDEFS = {
  sprinkle:{ name:'Sprinkle Spray', emoji:'🍬', max:6, desc:'ยิงลูกกวาดใส่ศัตรูใกล้สุด' },
  star:    { name:'Star Guard',     emoji:'🌟', max:6, desc:'ดาวหมุนรอบตัวคุ้มกัน', orbit:true },
  chili:   { name:'Chili Nova',     emoji:'🌶️', max:6, desc:'ระเบิดเผ็ดรอบตัวเป็นวง' },
  thunder: { name:'Thunder Drop',   emoji:'⚡', max:6, desc:'ฟ้าผ่าสุ่มลงศัตรูรอบตัว' },
  whirl:   { name:'Cream Whirl',    emoji:'🍥', max:6, desc:'ครีมหมุนกระจายรอบทิศ' },
  boomer:  { name:'Boomerang Cookie',emoji:'🍪', max:6, desc:'คุกกี้พุ่งออกแล้วบินกลับ ทะลุศัตรู' },
  frost:   { name:'Frost Pulse',    emoji:'❄️', max:6, desc:'คลื่นเย็นแช่แข็งศัตรูใกล้ตัว' },
};
const ACTIVES = {
  bomb:  { name:'Sugar Bomb',   emoji:'💣', desc:'ระเบิดพลังรอบตัว + ผลักศัตรู' },
  nova:  { name:'Sprinkle Nova',emoji:'✨', desc:'ยิงลูกกวาดกระจายรอบทิศ' },
  freeze:{ name:'Brain Freeze', emoji:'❄️', desc:'แช่แข็งศัตรูรอบตัวชั่วขณะ' },
};

/* ---- STAGES: 5 โซนของครัว + บอสปิดด่าน ---- */
const STAGES = [
  { name:'ตู้กับข้าว',   en:'The Pantry',  emoji:'🥫', grid:0x2a2233, tint:0x8bd3a0,
    lore:'ที่ซ่อนแรกของ Sour Horde — ฝูงมดและแมลงเปรี้ยวคลานออกจากมุมมืด',
    dur:45, boss:'ราชินีมดเปรี้ยว', bossHp:420, bossDmg:20 },
  { name:'อ่างล้างจาน',  en:'The Sink',    emoji:'🚰', grid:0x1f2a33, tint:0x8fc7ff,
    lore:'น้ำเน่านองเต็มอ่าง ฟองสบู่มีชีวิตพยายามจมโมโม่ให้เปียกโชก',
    dur:52, boss:'ปีศาจฟองน้ำ', bossHp:680, bossDmg:24 },
  { name:'เตาไฟ',        en:'The Stove',   emoji:'🔥', grid:0x33231f, tint:0xff8a5a,
    lore:'เปลวไฟลุกโชน กระทะและพริกร้อนระอุเข้าจู่โจมไม่ยั้ง',
    dur:60, boss:'มิสเตอร์เตาปิ้ง', bossHp:1000, bossDmg:28 },
  { name:'ช่องแช่แข็ง',  en:'The Freezer', emoji:'❄️', grid:0x1f2733, tint:0x9fe0ff,
    lore:'ความหนาวเยือกแข็ง โกเลมไอศกรีมตื่นจากน้ำแข็งนิรันดร์',
    dur:66, boss:'โกเลมไอศกรีม', bossHp:1400, bossDmg:32 },
  { name:'เตาอบใหญ่',    en:'The Grand Oven', emoji:'👨‍🍳', grid:0x2e1f2b, tint:0xff5f97,
    lore:'ใจกลางคำสาป — เชฟขมรอโมโม่อยู่ ทำลายเขาเพื่อปลดปล่อยครัว!',
    dur:72, boss:'เชฟขม (The Bitter Chef)', bossHp:2400, bossDmg:38 },
];

class Game extends Phaser.Scene {
  constructor(){ super('Game'); }

  create(){
    this.W=this.scale.width; this.H=this.scale.height;
    this.state='menu'; this.elapsed=0; this.kills=0;
    this.level=1; this.xp=0; this.xpNext=5;

    this.cameras.main.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.gridBg=this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,1,0x3a2f47,0.25).setDepth(-10);

    this.player=this.physics.add.sprite(0,0,'mochi').setDepth(5);
    this.player.setCircle(24,4,4); this.player.setCollideWorldBounds(true);
    this.player.hp=100; this.player.maxhp=100; this.player.baseSpeed=210;
    this.player.iframe=0; this.player.pickup=80; this.player.dmgMul=1;
    this.cameras.main.startFollow(this.player,true,0.16,0.16);

    this.enemies=this.physics.add.group({maxSize:600});
    this.bullets=this.physics.add.group({maxSize:500});
    this.orbs   =this.physics.add.group({maxSize:800});

    this.ringBalls=[];
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.touchEnemy,null,this);
    this.physics.add.overlap(this.player,this.orbs,this.collectOrb,null,this);

    this.skills={ sprinkle:1 };            // auto-cast skills owned {key:level}
    this.skillCd={}; for(const k in SKILLDEFS) this.skillCd[k]=0;
    this.whirlAng=0;
    this.active={ key:'bomb', lvl:1 };     // manual "ultimate" button
    this.activeCd=0;

    this.dashTime=0; this.dashReady=true; this.dashCd=0;
    this.moveDir=new Phaser.Math.Vector2(0,-1);

    this.input.addPointer(2);
    this.joy={active:false,id:-1,bx:0,by:0,dx:0,dy:0};
    this.lvlCards=[]; this.dmgPool=[];

    this.buildHUD(); this.buildMenus(); this.showMenu();
    this.setupInput();
    this.scale.on('resize',this.onResize,this);
  }

  /* ---------- INPUT ---------- */
  setupInput(){
    this.input.on('pointerdown',(p)=>{
      Sfx.unlock();
      // mute toggle (มุมขวาบน) — เช็คก่อนทุกอย่างเพื่อไม่ให้ไปโดนจอย
      if(this.muteBtn && this.dist(p.x,p.y,this.muteBtn.x,this.muteBtn.y)<26){
        const m=Sfx.toggle(); this.muteTxt.setText(m?'🔇':'🔊'); return; }
      if(this.state==='menu'){ this.startRun(); return; }
      if(this.state==='dead'||this.state==='win'){ this.scene.restart(); return; }
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
    this.squash(this.player,1.3,0.75);
  }

  /* ---------- ACTIVE SKILL ---------- */
  useActive(){
    if(this.activeCd>0||this.state!=='play') return;
    const a=this.active, lvl=a.lvl;
    if(a.key==='bomb'){
      const r=130+lvl*18, dmg=(16+lvl*7);
      const ring=this.add.circle(this.player.x,this.player.y,14,COLORS.pink,0.4).setDepth(3);
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:340,onComplete:()=>ring.destroy()});
      this.cameras.main.shake(140,0.006);
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
        if(this.dist(e.x,e.y,this.player.x,this.player.y)<r){
          this.damage(e,dmg*this.player.dmgMul,e.x,e.y);
          const ang=Math.atan2(e.y-this.player.y,e.x-this.player.x);
          e.setVelocity(Math.cos(ang)*420,Math.sin(ang)*420); e.knock=0.28;
        }});
      this.activeCd=6;
    } else if(a.key==='nova'){
      const n=8+lvl*2, dmg=(5+lvl*2)*this.player.dmgMul;
      for(let i=0;i<n;i++){ const ang=(i/n)*Math.PI*2;
        let b=this.bullets.getFirstDead(false);
        if(!b) b=this.bullets.create(this.player.x,this.player.y,'spark');
        else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(this.player.x,this.player.y); }
        b.setScale(1.3).setTint(0xffe9a8); b.dmg=dmg; b.life=1.0; b.body.setAllowGravity(false);
        this.physics.velocityFromRotation(ang,430,b.body.velocity);
      }
      this.activeCd=5;
    } else if(a.key==='freeze'){
      const r=210, dur=1.4+lvl*0.35;
      const ring=this.add.circle(this.player.x,this.player.y,14,COLORS.ice,0.4).setDepth(3);
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:300,onComplete:()=>ring.destroy()});
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
        if(this.dist(e.x,e.y,this.player.x,this.player.y)<r){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }});
      this.activeCd=7;
    }
    Sfx.ult();
    this.flashBtn(this.skillBtn);
  }
  flashBtn(b){ this.tweens.add({targets:b,scale:{from:1.25,to:1},duration:220,ease:'Back.out'}); }

  /* ---------- HUD ---------- */
  buildHUD(){
    const pad=14, w=this.W; this._pad=pad; this._barW=w-2*pad;
    this.joyBase=this.add.circle(0,0,62,0xffffff,0.10).setScrollFactor(0).setDepth(50).setVisible(false).setStrokeStyle(2,0xffffff,0.25);
    this.joyKnob=this.add.circle(0,0,26,0xffffff,0.22).setScrollFactor(0).setDepth(51).setVisible(false);

    // dash button (lower right)
    this.dashBtn=this.add.circle(w-70,this.H-90,44,COLORS.mint,0.18).setScrollFactor(0).setDepth(50).setStrokeStyle(2,COLORS.mint,0.7);
    this.dashTxt=this.add.text(w-70,this.H-90,'พุ่ง',{fontFamily:'sans-serif',fontSize:'16px',color:'#bff3e8'}).setOrigin(0.5).setScrollFactor(0).setDepth(51);
    // skill button (above dash)
    this.skillBtn=this.add.circle(w-70,this.H-196,46,COLORS.pink,0.20).setScrollFactor(0).setDepth(50).setStrokeStyle(2,COLORS.pink,0.8);
    this.skillEmoji=this.add.text(w-70,this.H-200,ACTIVES[this.active.key].emoji,{fontSize:'30px'}).setOrigin(0.5).setScrollFactor(0).setDepth(51);
    this.skillCdTxt=this.add.text(w-70,this.H-168,'',{fontFamily:'sans-serif',fontSize:'12px',color:'#ffd9e6'}).setOrigin(0.5).setScrollFactor(0).setDepth(52);

    // top bars: HP + XP
    this.hpBgW=this.add.rectangle(pad,pad,this._barW,14,0x000000,0.35).setOrigin(0,0).setScrollFactor(0).setDepth(50);
    this.hpBar=this.add.rectangle(pad+2,pad+2,this._barW-4,10,0xff5f7a,1).setOrigin(0,0).setScrollFactor(0).setDepth(51);
    this.xpBgW=this.add.rectangle(pad,pad+20,this._barW,8,0x000000,0.35).setOrigin(0,0).setScrollFactor(0).setDepth(50);
    this.xpBar=this.add.rectangle(pad+2,pad+22,0,4,0x8bd3a0,1).setOrigin(0,0).setScrollFactor(0).setDepth(51);

    this.timeTxt=this.add.text(w/2,pad+30,'0:00',{fontFamily:'sans-serif',fontSize:'20px',color:'#ffffff'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(51);
    this.killTxt=this.add.text(w-pad,pad+32,'☠ 0',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(1,0).setScrollFactor(0).setDepth(51);
    this.lvlTxt=this.add.text(pad,pad+32,'Lv 1',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0,0).setScrollFactor(0).setDepth(51);
    this.stageTxt=this.add.text(w/2,pad+54,'',{fontFamily:'sans-serif',fontSize:'13px',color:'#ffd9a8'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(51);

    // boss HP bar (hidden until boss)
    this.bossName=this.add.text(w/2,pad+74,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ff9ec4'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(52);
    this.bossBgW=this.add.rectangle(w/2,pad+92,this._barW*0.8,12,0x000000,0.4).setOrigin(0.5,0).setScrollFactor(0).setDepth(51);
    this.bossBar=this.add.rectangle(w/2-(this._barW*0.8)/2+2,pad+94,this._barW*0.8-4,8,0xff5f97,1).setOrigin(0,0).setScrollFactor(0).setDepth(52);

    // center banner
    this.bannerT=this.add.text(w/2,this.H*0.32,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'30px',color:'#ffffff',align:'center'}).setOrigin(0.5).setScrollFactor(0).setDepth(60).setVisible(false);
    this.bannerS=this.add.text(w/2,this.H*0.4,'',{fontFamily:'sans-serif',fontSize:'15px',color:'#e6dcf0',align:'center',wordWrap:{width:w*0.82}}).setOrigin(0.5).setScrollFactor(0).setDepth(60).setVisible(false);

    // mute button (มุมขวาบน) — แสดงตลอดเวลา
    this.muteBtn=this.add.circle(w-30,pad+64,18,0x000000,0.32).setScrollFactor(0).setDepth(58).setStrokeStyle(1.5,0xffffff,0.3);
    this.muteTxt=this.add.text(w-30,pad+64,Sfx.muted?'🔇':'🔊',{fontSize:'17px'}).setOrigin(0.5).setScrollFactor(0).setDepth(59);

    this.hudList=[this.dashBtn,this.dashTxt,this.skillBtn,this.skillEmoji,this.skillCdTxt,this.hpBgW,this.hpBar,this.xpBgW,this.xpBar,this.timeTxt,this.killTxt,this.lvlTxt,this.stageTxt];
    this.bossUI=[this.bossName,this.bossBgW,this.bossBar];
    this.hudList.forEach(o=>o.setVisible(false));
    this.bossUI.forEach(o=>o.setVisible(false));
  }
  hudVisible(v){ this.hudList.forEach(o=>o.setVisible(v)); }

  onResize(gs){
    if(!gs)return; this.W=gs.width; this.H=gs.height; const pad=this._pad; this._barW=this.W-2*pad;
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-70,this.H-90); this.dashTxt.setPosition(this.W-70,this.H-90);
      this.skillBtn.setPosition(this.W-70,this.H-196); this.skillEmoji.setPosition(this.W-70,this.H-200); this.skillCdTxt.setPosition(this.W-70,this.H-168);
      this.hpBgW.width=this._barW; this.xpBgW.width=this._barW;
      this.timeTxt.setPosition(this.W/2,pad+30); this.killTxt.setPosition(this.W-pad,pad+32);
      this.stageTxt.setPosition(this.W/2,pad+54);
      if(this.muteBtn){ this.muteBtn.setPosition(this.W-30,pad+64); this.muteTxt.setPosition(this.W-30,pad+64); }
      this.bossName.setPosition(this.W/2,pad+74); this.bossBgW.setPosition(this.W/2,pad+92); this.bossBgW.width=this._barW*0.8;
      this.bossBar.setPosition(this.W/2-(this._barW*0.8)/2+2,pad+94);
      this.bannerT.setPosition(this.W/2,this.H*0.32); this.bannerS.setPosition(this.W/2,this.H*0.4); }
    if(this.state==='menu') this.buildStartMenu();
    if(this.state==='dead') this.buildOver();
  }

  /* ---------- MENUS ---------- */
  buildMenus(){
    this.menu=this.add.container(0,0).setScrollFactor(0).setDepth(100);
    this.lvlUp=this.add.container(0,0).setScrollFactor(0).setDepth(100).setVisible(false);
    this.over=this.add.container(0,0).setScrollFactor(0).setDepth(100).setVisible(false);
    this.buildStartMenu();
  }
  buildStartMenu(){
    const w=this.W,h=this.H; this.menu.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.9).setOrigin(0,0);
    const emoji=this.add.text(w/2,h*0.27,'🍡',{fontSize:'72px'}).setOrigin(0.5);
    const title=this.add.text(w/2,h*0.42,'MOCHI MAYHEM',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'34px',color:'#ff8fb5'}).setOrigin(0.5);
    const sub=this.add.text(w/2,h*0.48,'โมจิจอมตะกละ · เอาชีวิตรอด',{fontFamily:'sans-serif',fontSize:'15px',color:'#c7bdd6'}).setOrigin(0.5);
    const btn=this.add.graphics(); btn.fillStyle(COLORS.pink,1); btn.fillRoundedRect(w/2-110,h*0.60-32,220,64,22);
    btn.lineStyle(3,0xffffff,0.35); btn.strokeRoundedRect(w/2-110,h*0.60-32,220,64,22);
    const btxt=this.add.text(w/2,h*0.60,'▶ เริ่มเล่น',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffffff'}).setOrigin(0.5);
    const help=this.add.text(w/2,h*0.75,'แตะตรงไหนก็เริ่มได้\nซ้าย: ลากนิ้วเดิน  ·  ขวา: แตะพุ่ง  ·  ปุ่มชมพู: อัลติ',{fontFamily:'sans-serif',fontSize:'13px',color:'#9a90ab',align:'center'}).setOrigin(0.5);
    this.menu.add([bg,emoji,title,sub,btn,btxt,help]); this.menu.setVisible(true);
  }
  showMenu(){ this.state='menu'; this.menu.setVisible(true); this.hudVisible(false); }
  startRun(){
    if(this.state!=='menu')return;
    this.menu.setVisible(false); this.hudVisible(true);
    this.state='play'; this.elapsed=0; this.spawnTimer=0;
    this.stageIndex=0; this.boss=null; this.bossSpawned=false;
    this.startStage(0);
  }

  /* ---------- STAGES ---------- */
  startStage(i){
    const st=STAGES[i]; this.stageIndex=i;
    this.stageTime=st.dur; this.bossSpawned=false; this.boss=null;
    this.bossUI.forEach(o=>o.setVisible(false));
    this.gridBg.fillColor=st.grid;
    this.stageTxt.setText(`ด่าน ${i+1}/${STAGES.length} · ${st.emoji} ${st.name}`);
    this.showBanner(`${st.emoji} ด่าน ${i+1}: ${st.name}`, st.lore, 3200);
  }
  showBanner(title,sub,ms){
    this.bannerT.setText(title).setVisible(true).setAlpha(0);
    this.bannerS.setText(sub||'').setVisible(true).setAlpha(0);
    this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:1,duration:250});
    this.time.delayedCall(ms,()=>{ this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:0,duration:400,
      onComplete:()=>{ this.bannerT.setVisible(false); this.bannerS.setVisible(false); }}); });
  }
  spawnBoss(){
    const st=STAGES[this.stageIndex]; this.bossSpawned=true;
    this.showBanner('⚠ บอสมาแล้ว!', st.boss, 2600);
    Sfx.bossWarn();
    this.cameras.main.shake(300,0.01);
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)*0.5;
    const b=this.enemies.create(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad,'e_tank');
    b.setScale(2.4).setCircle(26,3,3); b.isBoss=true;
    b.hp=st.bossHp*(1+this.stageIndex*0.05); b.maxhp=b.hp; b.spd=42; b.dmg=st.bossDmg; b.xp=30; b.frozen=0; b.knock=0;
    b.tintColor=st.tint; b.setTint(st.tint);
    this.boss=b;
    this.bossName.setText(st.boss); this.bossUI.forEach(o=>o.setVisible(true));
  }
  onBossDead(){
    this.boss=null; this.bossUI.forEach(o=>o.setVisible(false));
    // clear remaining trash enemies for a breather
    this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss){ e.setActive(false).setVisible(false); e.body.enable=false; } });
    this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.35); // heal reward
    if(this.stageIndex>=STAGES.length-1){ this.victory(); return; }
    Sfx.clear();
    this.showBanner('✨ เคลียร์ด่าน!', 'ฟื้น HP · เตรียมลุยโซนต่อไป', 2400);
    this.time.delayedCall(2600,()=>{ if(this.state==='play') this.startStage(this.stageIndex+1); });
  }
  victory(){
    this.state='win'; this.physics.pause(); this.player.setVelocity(0,0);
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
    while(this.xp>=this.xpNext){ this.xp-=this.xpNext; this.level++; this.xpNext=Math.round(this.xpNext*1.32+2); this.pendingLvl=(this.pendingLvl||0)+1; }
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
    const skillPool=[], passPool=[];
    const S=(color,emoji,title,desc,apply)=>skillPool.push({kind:'✦ สกิล',badgeColor:'#ff8fb5',color,emoji,title,desc,apply});
    const P=(color,emoji,title,desc,apply)=>passPool.push({kind:'▲ พาสซีฟ',badgeColor:'#8bd3a0',color,emoji,title,desc,apply});
    // auto-cast skills — new + upgrades
    for(const key in SKILLDEFS){ const d=SKILLDEFS[key], cur=this.skills[key]||0;
      if(cur===0) S(COLORS.pink,d.emoji,d.name,'ปลดสกิลใหม่ — '+d.desc,()=>{ this.skills[key]=1; if(key==='star')this.rebuildRing(); });
      else if(cur<d.max) S(COLORS.grape,d.emoji,d.name+' Lv'+(cur+1),'อัปสกิล — แรงขึ้น/ถี่ขึ้น/เพิ่มจำนวน',()=>{ this.skills[key]++; if(key==='star')this.rebuildRing(); });
    }
    // passives (kept few)
    P(0xff5f7a,'❤️','หัวใจหวาน','HP สูงสุด +25 และฟื้นทันที',()=>{ this.player.maxhp+=25; this.player.hp=Math.min(this.player.maxhp,this.player.hp+25); });
    P(COLORS.mint,'👟','เท้าลื่น','ความเร็ว +12%',()=>{ this.player.baseSpeed*=1.12; });
    P(COLORS.toast,'🧲','จมูกไว','ระยะดูดลูกกวาด +40%',()=>{ this.player.pickup*=1.4; });
    P(COLORS.grape,'💥','พลังหวาน','ดาเมจทุกอย่าง +12%',()=>{ this.player.dmgMul*=1.12; });
    // skills-first: fill mostly from skillPool, at most 1 passive per level-up
    Phaser.Utils.Array.Shuffle(skillPool); Phaser.Utils.Array.Shuffle(passPool);
    const out=skillPool.slice(0,n);
    if(out.length<n){ out.push(...passPool.slice(0,n-out.length)); }
    else if(Math.random()<0.5 && out.length===n){ out[n-1]=passPool[0]; } // sometimes offer 1 passive
    Phaser.Utils.Array.Shuffle(out);
    return out.slice(0,n);
  }
  rebuildRing(){
    this.ringBalls.forEach(b=>b.destroy()); this.ringBalls=[];
    const lvl=this.skills.star||0; if(lvl<1)return; const count=2+lvl;
    for(let i=0;i<count;i++){ const b=this.physics.add.image(0,0,'dot').setTint(0xffe08a).setScale(1.9).setDepth(4);
      b.setCircle(5); b.body.setAllowGravity(false); b.dmg=4+lvl*1.5; b.hitCd=0;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{ if(ball.hitCd>0)return; ball.hitCd=0.12; this.damage(en,ball.dmg*this.player.dmgMul,ball.x,ball.y); });
      this.ringBalls.push(b);
    }
  }

  /* ---------- SPAWN ---------- */
  spawnWave(dt){
    if(this.boss) return;                 // focus on boss, pause trash spawns
    this.spawnTimer-=dt; const t=this.elapsed, si=this.stageIndex||0;
    const interval=Math.max(0.18,0.85-t*0.005-si*0.03); if(this.spawnTimer>0)return; this.spawnTimer=interval;
    const batch=1+Math.floor(t/22)+Math.floor(si/2);
    for(let i=0;i<batch;i++){ let type='basic'; const r=Math.random();
      if(si>=1&&r<0.3)type='fast'; if(si>=2&&r>0.86)type='tank'; this.spawnEnemy(type); }
  }
  spawnEnemy(type){
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)*0.62+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false); const key=type==='fast'?'e_fast':type==='tank'?'e_tank':'e_basic';
    if(!e) e=this.enemies.create(x,y,key);
    else { e.setTexture(key); e.setActive(true).setVisible(true); e.body.enable=true; e.setPosition(x,y); }
    const s=(1+this.elapsed*0.004)*(1+(this.stageIndex||0)*0.35);
    if(type==='fast'){ e.hp=6*s; e.spd=116; e.dmg=7; e.xp=1; e.setCircle(15,2,2); }
    else if(type==='tank'){ e.hp=42*s; e.spd=36; e.dmg=15; e.xp=4; e.setCircle(26,3,3); }
    else { e.hp=11*s; e.spd=54; e.dmg=8; e.xp=1; e.setCircle(17,3,3); }
    e.isBoss=false; e.maxhp=e.hp; e.frozen=0; e.knock=0; e.setScale(1).clearTint();
  }

  /* ---------- COMBAT ---------- */
  getBullet(x,y,tint,scale){
    let b=this.bullets.getFirstDead(false);
    if(!b) b=this.bullets.create(x,y,'spark');
    else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(x,y); }
    b.setScale(scale||1).setTint(tint||0xffffff); b.body.setAllowGravity(false);
    b.pierce=false; b.hitCd=0; b.boomer=false; b.returned=false;
    return b;
  }
  cdOf(key,lvl){
    switch(key){
      case 'sprinkle': return Math.max(0.28,0.95-lvl*0.08);
      case 'chili':    return Math.max(1.1,2.6-lvl*0.12);
      case 'thunder':  return Math.max(0.8,2.2-lvl*0.16);
      case 'whirl':    return Math.max(1.3,3.0-lvl*0.16);
      case 'boomer':   return Math.max(1.0,2.4-lvl*0.12);
      case 'frost':    return Math.max(2.4,4.4-lvl*0.22);
      default: return 1.5;
    }
  }
  castSkill(key,lvl){
    const dm=this.player.dmgMul;
    if(key==='sprinkle'){ const t=this.nearestEnemy(600); if(!t)return; const shots=1+Math.floor(lvl/2);
      for(let s=0;s<shots;s++){ const sp=(s-(shots-1)/2)*0.18, ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+sp;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,1+lvl*0.1); b.dmg=(5+lvl*2)*dm; b.life=1.1;
        this.physics.velocityFromRotation(ang,450,b.body.velocity); } Sfx.shoot(); }
    else if(key==='chili'){ const r=80+lvl*15, dmg=(8+lvl*3)*dm; Sfx.boom();
      const ring=this.add.circle(this.player.x,this.player.y,10,0xff7a4d,0.35).setDepth(3);
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:280,onComplete:()=>ring.destroy()});
      this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<r) this.damage(e,dmg,e.x,e.y); }); }
    else if(key==='thunder'){ const n=1+Math.ceil(lvl/2), dmg=(10+lvl*4)*dm;
      const cand=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<480) cand.push(e); });
      Phaser.Utils.Array.Shuffle(cand);
      for(let i=0;i<Math.min(n,cand.length);i++){ const e=cand[i]; this.zap(e.x,e.y); this.damage(e,dmg,e.x,e.y); Sfx.zap(); } }
    else if(key==='whirl'){ const n=6+lvl*2, dmg=(4+lvl*2)*dm; this.whirlAng+=0.6;
      for(let i=0;i<n;i++){ const ang=this.whirlAng+(i/n)*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0x8fd0ff,1.1); b.dmg=dmg; b.life=0.9;
        this.physics.velocityFromRotation(ang,300,b.body.velocity); } }
    else if(key==='boomer'){ const cnt=1+Math.floor(lvl/3), dmg=(8+lvl*3)*dm;
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(700);
        const ang=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle()+(s*0.5);
        const b=this.getBullet(this.player.x,this.player.y,0xd9a066,1.4); b.dmg=dmg; b.life=1.8; b.pierce=true; b.boomer=true; b.bt=0; b.bdur=0.42;
        this.physics.velocityFromRotation(ang,430,b.body.velocity); } Sfx.shoot(); }
    else if(key==='frost'){ const r=140+lvl*12, dur=1+lvl*0.25; Sfx.frost();
      const ring=this.add.circle(this.player.x,this.player.y,12,COLORS.ice,0.4).setDepth(3);
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:320,onComplete:()=>ring.destroy()});
      this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); } }); }
  }
  zap(x,y){
    const g=this.add.graphics().setDepth(7); g.lineStyle(3,0xfff2a8,1);
    g.beginPath(); g.moveTo(x,y-260); g.lineTo(x+Phaser.Math.Between(-14,14),y-130); g.lineTo(x,y); g.strokePath();
    const fl=this.add.circle(x,y,22,0xfff2a8,0.6).setDepth(7);
    this.tweens.add({targets:[g,fl],alpha:0,duration:200,onComplete:()=>{ g.destroy(); fl.destroy(); }});
  }
  nearestEnemy(maxD){ let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2; if(d<bd){bd=d;best=e;} });
    return best; }
  hitEnemy(bullet,enemy){ if(!bullet.active||!enemy.active)return;
    if(bullet.pierce){ if(bullet.hitCd>0)return; bullet.hitCd=0.16; this.damage(enemy,bullet.dmg,bullet.x,bullet.y); return; }
    this.damage(enemy,bullet.dmg,bullet.x,bullet.y); this.killBullet(bullet); }
  damage(e,amount,x,y){ if(!e.active)return; e.hp-=amount;
    e.setTintFill(0xffffff); this.time.delayedCall(60,()=>{ if(!e.active)return;
      if(e.frozen) e.setTint(COLORS.ice); else if(e.isBoss&&e.tintColor) e.setTint(e.tintColor); else e.clearTint(); });
    this.popDmg(Math.round(amount),x,y); if(e.hp<=0) this.killEnemy(e); }
  killEnemy(e){ this.kills++; this.killTxt.setText('☠ '+this.kills);
    const isBoss=e.isBoss; if(!isBoss) Sfx.pop();
    this.burst(e.x,e.y,isBoss?0xffd166:(e.texture.key==='e_tank'?0x8b5cf0:0xffd166));
    if(isBoss){ this.cameras.main.shake(400,0.012); this.burst(e.x,e.y,0xff9ec4); }
    for(let i=0;i<(e.xp||1);i++) this.dropOrb(e.x+Phaser.Math.Between(-18,18),e.y+Phaser.Math.Between(-18,18));
    e.setActive(false).setVisible(false); e.body.enable=false; e.isBoss=false; e.setScale(1);
    if(isBoss) this.onBossDead(); }
  killBullet(b){ b.setActive(false).setVisible(false); b.body.enable=false; b.body.stop(); }
  dropOrb(x,y){ let o=this.orbs.getFirstDead(false);
    if(!o) o=this.orbs.create(x,y,'candy'); else { o.setActive(true).setVisible(true); o.body.enable=true; o.setPosition(x,y); }
    o.body.setAllowGravity(false); o.setScale(1); this.tweens.add({targets:o,scale:{from:0.2,to:1},duration:200}); }
  collectOrb(player,o){ if(!o.active)return; o.setActive(false).setVisible(false); o.body.enable=false; Sfx.xp(); this.gainXp(1); }
  touchEnemy(player,e){ if(!e.active||this.player.iframe>0)return;
    this.player.iframe=0.6; this.player.hp-=e.dmg; Sfx.hurt(); this.cameras.main.shake(120,0.008);
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>this.player.clearTint());
    const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x); this.player.setVelocity(Math.cos(ang)*260,Math.sin(ang)*260); this.dashTime=0.12;
    if(this.player.hp<=0) this.die(); }

  /* ---------- FX ---------- */
  popDmg(n,x,y){ let t=this.dmgPool.pop();
    if(!t) t=this.add.text(x,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#fff2a8'}).setDepth(20).setOrigin(0.5);
    else t.setActive(true).setVisible(true);
    t.setText(n).setPosition(x,y-10).setAlpha(1);
    this.tweens.add({targets:t,y:y-40,alpha:0,duration:520,onComplete:()=>{ t.setVisible(false); this.dmgPool.push(t); }}); }
  burst(x,y,color){ for(let i=0;i<7;i++){ const p=this.add.image(x,y,'dot').setTint(color).setDepth(6).setScale(Phaser.Math.FloatBetween(0.5,1.1));
    const a=Math.random()*Math.PI*2, s=Phaser.Math.Between(40,150);
    this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:420,onComplete:()=>p.destroy()}); } }
  squash(o,sx,sy){ o.setScale(sx,sy); this.tweens.add({targets:o,scaleX:1,scaleY:1,duration:220,ease:'Back.out'}); }

  /* ---------- DEATH ---------- */
  die(){ if(this.state==='dead')return; this.state='dead'; Sfx.dead(); this.physics.pause(); this.player.setVelocity(0,0); this.buildOver(); }
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

    if(this.dashTime>0){ this.dashTime-=dt; }
    else {
      const spd=this.player.baseSpeed;
      if(this.joy.active&&(Math.abs(this.joy.dx)+Math.abs(this.joy.dy))>0.12) this.player.setVelocity(this.joy.dx*spd,this.joy.dy*spd);
      else { this.player.setVelocity(this.player.body.velocity.x*0.8,this.player.body.velocity.y*0.8); if(this.player.body.velocity.length()<8)this.player.setVelocity(0,0); }
    }

    if(this.player.iframe>0)this.player.iframe-=dt;
    if(!this.dashReady){ this.dashCd-=dt; if(this.dashCd<=0)this.dashReady=true; }
    this.dashBtn.setFillStyle(COLORS.mint,this.dashReady?0.28:0.10);
    // active cd
    if(this.activeCd>0){ this.activeCd-=dt; this.skillBtn.setFillStyle(COLORS.pink,0.10); this.skillCdTxt.setText(Math.ceil(this.activeCd)); this.skillEmoji.setAlpha(0.4); }
    else { this.skillBtn.setFillStyle(COLORS.pink,0.22); this.skillCdTxt.setText(''); this.skillEmoji.setAlpha(1); }

    // enemies
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(e.frozen>0){ e.frozen-=dt; e.setVelocity(0,0); if(e.frozen<=0)e.clearTint(); return; }
      if(e.knock>0){ e.knock-=dt; return; }
      const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x); e.setVelocity(Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);
    });

    // orb vacuum
    this.orbs.children.iterate(o=>{ if(!o||!o.active)return;
      const d=this.dist(o.x,o.y,this.player.x,this.player.y);
      if(d<this.player.pickup){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x); o.setVelocity(Math.cos(ang)*380,Math.sin(ang)*380); }
      else o.setVelocity(0,0); });

    // bullets life + boomerang return + pierce cd
    this.bullets.children.iterate(b=>{ if(!b||!b.active)return;
      b.life-=dt; if(b.hitCd>0)b.hitCd-=dt;
      if(b.boomer){ b.bt+=dt;
        if(!b.returned && b.bt>=b.bdur){ b.returned=true; const ang=Math.atan2(this.player.y-b.y,this.player.x-b.x); this.physics.velocityFromRotation(ang,470,b.body.velocity); }
        if(b.returned && this.dist(b.x,b.y,this.player.x,this.player.y)<42){ this.killBullet(b); return; } }
      if(b.life<=0)this.killBullet(b); });

    // auto-cast skills tick
    for(const key in this.skills){ if(SKILLDEFS[key].orbit) continue;
      this.skillCd[key]-=dt; if(this.skillCd[key]<=0){ this.castSkill(key,this.skills[key]); this.skillCd[key]=this.cdOf(key,this.skills[key]); } }
    if(this.ringBalls.length){ this.ringRot=(this.ringRot||0)+dt*2.6; const R=54;
      this.ringBalls.forEach((b,i)=>{ if(b.hitCd>0)b.hitCd-=dt; const a=this.ringRot+i*(Math.PI*2/this.ringBalls.length); b.setPosition(this.player.x+Math.cos(a)*R,this.player.y+Math.sin(a)*R); }); }

    // STAGE timer → boss → clear
    if(!this.boss){
      if(!this.bossSpawned){
        this.stageTime-=dt;
        if(this.stageTime<=0) this.spawnBoss();
      }
    } else {
      this.bossBar.width=Math.max(0,(this._barW*0.8-4)*(this.boss.hp/this.boss.maxhp));
    }

    this.spawnWave(dt);
    this.hpBar.width=Math.max(0,(this._barW-4)*(this.player.hp/this.player.maxhp));
    this.xpBar.width=(this._barW-4)*(this.xp/this.xpNext);
    // timer shows countdown to boss (or "BOSS")
    if(this.boss){ this.timeTxt.setText('BOSS'); }
    else { const r=Math.max(0,Math.ceil(this.stageTime)); this.timeTxt.setText('⏳ '+Math.floor(r/60)+':'+(r%60).toString().padStart(2,'0')); }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#241d2e',
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
  render: { antialias:true },
  scene: [Boot, Game],
});
