/* ============================================================
   MOCHI MAYHEM — Prototype (Phaser 3)
   Survival-like: floating joystick move, sticky-sling dash,
   swarming enemies (pooled), pickups+level-up, flavor coatings,
   Toast Meter (Soft/Golden/Burnt). One-thumb, mobile-first.
   ============================================================ */

const WORLD = 4000;
const COLORS = {
  bg1: 0x2a2233, bg2: 0x241d2e,
  mochi: 0xfff2f7, mochiEdge: 0xff9ec4,
  candy: 0xffd166,
  pink: 0xff5f97, grape: 0x8b5cf0, toast: 0xe2932b, mint: 0x1fb89a,
  soft: 0xff8fb5, golden: 0xe2932b, burnt: 0xc0562a,
};

/* ---------- Boot: generate all textures from shapes (no assets) ---------- */
class Boot extends Phaser.Scene {
  constructor(){ super('Boot'); }
  create(){
    const g = this.make.graphics({ x:0, y:0, add:false });

    // Mochi blob (soft rounded square with eyes)
    const drawBlob = (key, fill, edge, size, eyes=true) => {
      g.clear();
      g.fillStyle(edge,1); g.fillRoundedRect(0,0,size,size,size*0.42);
      g.fillStyle(fill,1); g.fillRoundedRect(size*0.09,size*0.09,size*0.82,size*0.82,size*0.36);
      if(eyes){
        g.fillStyle(0x2b2233,1);
        g.fillCircle(size*0.36,size*0.5,size*0.06);
        g.fillCircle(size*0.64,size*0.5,size*0.06);
      }
      g.generateTexture(key,size,size);
    };
    drawBlob('mochi', COLORS.mochi, COLORS.mochiEdge, 56);

    // Enemy critters — angry blobs of a color
    const drawEnemy = (key, fill, edge, size) => {
      g.clear();
      g.fillStyle(edge,1); g.fillRoundedRect(0,0,size,size,size*0.4);
      g.fillStyle(fill,1); g.fillRoundedRect(size*0.1,size*0.1,size*0.8,size*0.8,size*0.34);
      g.fillStyle(0xffffff,1);
      g.fillCircle(size*0.36,size*0.46,size*0.11);
      g.fillCircle(size*0.64,size*0.46,size*0.11);
      g.fillStyle(0x2b2233,1);
      g.fillCircle(size*0.36,size*0.49,size*0.055);
      g.fillCircle(size*0.64,size*0.49,size*0.055);
      // angry brow
      g.lineStyle(Math.max(2,size*0.05),0x2b2233,1);
      g.beginPath(); g.moveTo(size*0.26,size*0.30); g.lineTo(size*0.44,size*0.38); g.strokePath();
      g.beginPath(); g.moveTo(size*0.74,size*0.30); g.lineTo(size*0.56,size*0.38); g.strokePath();
      g.generateTexture(key,size,size);
    };
    drawEnemy('e_basic', 0x8bd3a0, 0x57a878, 40);   // green ant-blob
    drawEnemy('e_fast',  0x8fc7ff, 0x5a90d6, 34);   // blue zoomer
    drawEnemy('e_tank',  0xc7a8ff, 0x8b5cf0, 58);   // purple heavy

    // candy orb
    g.clear();
    g.fillStyle(0xffe9a8,1); g.fillCircle(9,9,9);
    g.fillStyle(COLORS.candy,1); g.fillCircle(9,9,6.5);
    g.fillStyle(0xffffff,0.8); g.fillCircle(6.5,6.5,2);
    g.generateTexture('candy',18,18);

    // projectile (sprinkle)
    g.clear();
    g.fillStyle(0xffffff,1); g.fillCircle(6,6,6);
    g.fillStyle(COLORS.pink,1); g.fillCircle(6,6,4);
    g.generateTexture('spark',12,12);

    // small round particle
    g.clear(); g.fillStyle(0xffffff,1); g.fillCircle(5,5,5);
    g.generateTexture('dot',10,10);

    // sticky patch
    g.clear();
    g.fillStyle(COLORS.toast,0.28); g.fillCircle(60,60,60);
    g.fillStyle(COLORS.toast,0.20); g.fillCircle(60,60,44);
    g.generateTexture('sticky',120,120);

    g.destroy();
    this.scene.start('Game');
  }
}

/* ---------- Coatings (weapons) definitions ---------- */
const COATINGS = {
  sprinkle: { name:'Sprinkle Spray', emoji:'🍬', desc:'ยิงลูกกวาดใส่ศัตรูใกล้สุด', max:6 },
  sugar:    { name:'Sugar Ring',     emoji:'🍩', desc:'วงน้ำตาลโคจรรอบตัว ฟันศัตรูที่โดน', max:6 },
  chili:    { name:'Chili Burst',    emoji:'🌶️', desc:'ระเบิดความเผ็ดรอบตัวเป็นระยะ', max:6 },
};

class Game extends Phaser.Scene {
  constructor(){ super('Game'); }

  create(){
    this.W = this.scale.width; this.H = this.scale.height;
    this.state = 'menu'; // menu | play | levelup | dead
    this.time0 = 0; this.elapsed = 0; this.kills = 0;
    this.level = 1; this.xp = 0; this.xpNext = 5;
    this.toast = 0; // 0..100

    // world + camera
    this.cameras.main.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,1,0x3a2f47,0.25).setDepth(-10);

    // player
    this.player = this.physics.add.sprite(0,0,'mochi').setDepth(5);
    this.player.setCircle(24,4,4);
    this.player.hp = 100; this.player.maxhp = 100;
    this.player.baseSpeed = 205;
    this.player.iframe = 0;
    this.player.pickup = 78;
    this.player.dmgMul = 1;
    this.cameras.main.startFollow(this.player,true,0.12,0.12);

    // groups (pooled)
    this.enemies = this.physics.add.group({ maxSize: 600 });
    this.bullets = this.physics.add.group({ maxSize: 400 });
    this.orbs    = this.physics.add.group({ maxSize: 800 });
    this.stickies = this.add.group();

    // orbiting sugar ring container
    this.ring = this.add.container(0,0).setDepth(4);
    this.ringBalls = [];

    // colliders
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.touchEnemy, null, this);
    this.physics.add.overlap(this.player, this.orbs, this.collectOrb, null, this);

    // coatings owned
    this.coats = { sprinkle: 1 }; // start with sprinkle lvl1
    this.cool = { sprinkle: 0, chili: 0 };

    // input: multitouch (joystick left, dash right)
    this.input.addPointer(2);
    this.joy = { active:false, id:-1, bx:0, by:0, dx:0, dy:0 };
    this.dashReady = true; this.dashCd = 0;
    this.moveDir = new Phaser.Math.Vector2(0,-1);
    this.setupInput();

    this.buildHUD();
    this.buildMenus();
    this.showMenu();

    // damage number pool
    this.dmgPool = [];

    // keep everything reachable when mobile viewport resizes (URL bar, rotation)
    this.scale.on('resize', this.onResize, this);
  }

  onResize(gameSize){
    if(!gameSize) return;
    this.W = gameSize.width; this.H = gameSize.height;
    const pad=this._pad; this._barW=this.W-2*pad;
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-70,this.H-90); this.dashTxt.setPosition(this.W-70,this.H-90); }
    if(this.timeTxt){
      this.timeTxt.setPosition(this.W/2,pad+56);
      this.toastLabel.setPosition(this.W/2,pad+42);
      this.killTxt.setPosition(this.W-pad,pad+58);
      if(this.hpBgW){ this.hpBgW.width=this._barW; this.xpBgW.width=this._barW; this.toastBgW.width=this._barW; }
    }
    if(this.state==='menu') this.buildStartMenu();
    if(this.state==='dead') this.buildOver();
  }

  /* ---------------- INPUT ---------------- */
  setupInput(){
    this.input.on('pointerdown', (p)=>{
      if(this.state==='menu'){ this.startRun(); return; }   // tap anywhere to start
      if(this.state==='dead'){ this.scene.restart(); return; } // tap anywhere to retry
      if(this.state==='levelup') return;
      if(p.x > this.W*0.55){ this.doDash(); return; } // right side = dash
      // left side = joystick
      this.joy.active=true; this.joy.id=p.id; this.joy.bx=p.x; this.joy.by=p.y; this.joy.dx=0; this.joy.dy=0;
      this.joyBase.setPosition(p.x,p.y).setVisible(true);
      this.joyKnob.setPosition(p.x,p.y).setVisible(true);
    });
    this.input.on('pointermove',(p)=>{
      if(!this.joy.active || p.id!==this.joy.id) return;
      let dx=p.x-this.joy.bx, dy=p.y-this.joy.by;
      const len=Math.hypot(dx,dy), max=60;
      if(len>max){ dx=dx/len*max; dy=dy/len*max; }
      this.joy.dx=dx/max; this.joy.dy=dy/max;
      this.joyKnob.setPosition(this.joy.bx+dx,this.joy.by+dy);
    });
    this.input.on('pointerup',(p)=>{
      if(p.id===this.joy.id){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0;
        this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
    });
  }

  doDash(){
    if(!this.dashReady || this.state!=='play') return;
    this.dashReady=false; this.dashCd=1.6;
    const d=this.moveDir.clone().normalize();
    this.player.setVelocity(d.x*760,d.y*760);
    this.player.iframe = Math.max(this.player.iframe,0.35);
    this.player.setTint(0xfff6bd);
    // sticky trail
    for(let i=0;i<5;i++){
      this.time.delayedCall(i*45,()=>{
        if(this.state!=='play')return;
        const s=this.add.image(this.player.x,this.player.y,'sticky').setDepth(1).setScale(0.7).setAlpha(0.9);
        s.born=this.elapsed; this.stickies.add(s);
      });
    }
    this.time.delayedCall(180,()=>this.player.clearTint());
    this.squash(this.player,1.35,0.7);
  }

  /* ---------------- HUD ---------------- */
  buildHUD(){
    const pad=14, w=this.W;
    this.joyBase=this.add.circle(0,0,62,0xffffff,0.10).setScrollFactor(0).setDepth(50).setVisible(false).setStrokeStyle(2,0xffffff,0.25);
    this.joyKnob=this.add.circle(0,0,26,0xffffff,0.22).setScrollFactor(0).setDepth(51).setVisible(false);

    // dash button hint (right)
    this.dashBtn=this.add.circle(w-70,this.H-90,42,COLORS.toast,0.16).setScrollFactor(0).setDepth(50).setStrokeStyle(2,COLORS.toast,0.6);
    this.dashTxt=this.add.text(w-70,this.H-90,'สลิง',{fontFamily:'sans-serif',fontSize:'15px',color:'#ffd9a8'}).setOrigin(0.5).setScrollFactor(0).setDepth(51);

    // top bars
    const barW=w-2*pad;
    this.hpBgW=this.add.rectangle(pad,pad,barW,14,0x000000,0.35).setOrigin(0,0).setScrollFactor(0).setDepth(50);
    this.hpBar=this.add.rectangle(pad+2,pad+2,barW-4,10,0xff5f7a,1).setOrigin(0,0).setScrollFactor(0).setDepth(51);
    // xp
    this.xpBgW=this.add.rectangle(pad,pad+20,barW,8,0x000000,0.35).setOrigin(0,0).setScrollFactor(0).setDepth(50);
    this.xpBar=this.add.rectangle(pad+2,pad+22,0,4,0x8bd3a0,1).setOrigin(0,0).setScrollFactor(0).setDepth(51);
    // toast meter
    this.toastBgW=this.add.rectangle(pad,pad+34,barW,12,0x000000,0.35).setOrigin(0,0).setScrollFactor(0).setDepth(50);
    this.toastBar=this.add.rectangle(pad+2,pad+36,0,8,COLORS.soft,1).setOrigin(0,0).setScrollFactor(0).setDepth(51);
    // golden zone marks
    this.add.rectangle(pad+2+(barW-4)*0.55,pad+36,2,8,0xffffff,0.5).setOrigin(0,0).setScrollFactor(0).setDepth(52);
    this.add.rectangle(pad+2+(barW-4)*0.90,pad+36,2,8,0xffffff,0.5).setOrigin(0,0).setScrollFactor(0).setDepth(52);
    this.toastLabel=this.add.text(w/2,pad+42,'',{fontFamily:'sans-serif',fontSize:'11px',color:'#ffe9c9'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(52);

    this.timeTxt=this.add.text(w/2,pad+56,'0:00',{fontFamily:'sans-serif',fontSize:'20px',color:'#ffffff'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(51);
    this.killTxt=this.add.text(w-pad,pad+58,'☠ 0',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(1,0).setScrollFactor(0).setDepth(51);
    this.lvlTxt=this.add.text(pad,pad+58,'Lv 1',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0,0).setScrollFactor(0).setDepth(51);

    this._barW=barW; this._pad=pad;
    [this.joyBase,this.joyKnob,this.dashBtn,this.dashTxt,this.hpBar,this.xpBar,this.toastBar,this.toastLabel,this.timeTxt,this.killTxt,this.lvlTxt].forEach(o=>o.setVisible(false));
  }
  hudVisible(v){
    [this.dashBtn,this.dashTxt,this.hpBar,this.xpBar,this.toastBar,this.toastLabel,this.timeTxt,this.killTxt,this.lvlTxt].forEach(o=>o.setVisible(v));
  }

  /* ---------------- MENUS ---------------- */
  buildMenus(){
    this.menu=this.add.container(0,0).setScrollFactor(0).setDepth(100);
    this.lvlUp=this.add.container(0,0).setScrollFactor(0).setDepth(100).setVisible(false);
    this.over=this.add.container(0,0).setScrollFactor(0).setDepth(100).setVisible(false);
    this.buildStartMenu();
  }
  buildStartMenu(){
    const w=this.W,h=this.H;
    this.menu.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.9).setOrigin(0,0);
    const emoji=this.add.text(w/2,h*0.28,'🍡',{fontSize:'72px'}).setOrigin(0.5);
    const title=this.add.text(w/2,h*0.43,'MOCHI MAYHEM',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'34px',color:'#ff8fb5'}).setOrigin(0.5);
    const sub=this.add.text(w/2,h*0.49,'โมจิจอมตะกละ · เอาชีวิตรอด',{fontFamily:'sans-serif',fontSize:'15px',color:'#c7bdd6'}).setOrigin(0.5);
    const btn=this.add.rectangle(w/2,h*0.61,210,62,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.35);
    const btxt=this.add.text(w/2,h*0.61,'▶ เริ่มเล่น',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffffff'}).setOrigin(0.5);
    const help=this.add.text(w/2,h*0.75,'แตะตรงไหนก็เริ่มได้\nซ้าย: ลากนิ้วเพื่อเดิน   ·   ขวา: แตะเพื่อสลิง',{fontFamily:'sans-serif',fontSize:'13px',color:'#9a90ab',align:'center'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.startRun());
    this.menu.add([bg,emoji,title,sub,btn,btxt,help]);
    this.menu.setVisible(true);
  }
  showMenu(){ this.state='menu'; this.menu.setVisible(true); this.hudVisible(false); }

  startRun(){
    if(this.state!=='menu') return;
    this.menu.setVisible(false); this.hudVisible(true);
    this.state='play'; this.time0=this.time.now; this.elapsed=0;
    this.spawnTimer=0; this.nextBoss=999;
  }

  /* ---------------- LEVEL UP ---------------- */
  gainXp(n){
    this.xp+=n;
    while(this.xp>=this.xpNext){
      this.xp-=this.xpNext; this.level++;
      this.xpNext=Math.round(this.xpNext*1.32+2);
      this.openLevelUp();
    }
    this.lvlTxt.setText('Lv '+this.level);
  }
  openLevelUp(){
    if(this.state==='levelup') { this._pendingLvl=(this._pendingLvl||0)+1; return; }
    this.state='levelup'; this.physics.pause();
    const w=this.W,h=this.H;
    this.lvlUp.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.8).setOrigin(0,0);
    const t=this.add.text(w/2,h*0.16,'เลเวลอัพ! เลือก 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffd166'}).setOrigin(0.5);
    this.lvlUp.add([bg,t]);
    const opts=this.rollUpgrades(3);
    const cardW=Math.min(w-48,360), gap=14, startY=h*0.26;
    opts.forEach((o,i)=>{
      const y=startY+i*(96+gap);
      const card=this.add.rectangle(w/2,y,cardW,96,0x2a2234,1).setStrokeStyle(2,o.color,1).setOrigin(0.5,0);
      const em=this.add.text(w/2-cardW/2+30,y+48,o.emoji,{fontSize:'34px'}).setOrigin(0.5);
      const nm=this.add.text(w/2-cardW/2+60,y+22,o.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffffff'}).setOrigin(0,0);
      const ds=this.add.text(w/2-cardW/2+60,y+50,o.desc,{fontFamily:'sans-serif',fontSize:'13px',color:'#c7bdd6',wordWrap:{width:cardW-90}}).setOrigin(0,0);
      card.setInteractive({useHandCursor:true}).on('pointerdown',()=>{ o.apply(); this.closeLevelUp(); });
      this.lvlUp.add([card,em,nm,ds]);
    });
    this.lvlUp.setVisible(true);
  }
  closeLevelUp(){
    this.lvlUp.setVisible(false);
    if(this._pendingLvl>0){ this._pendingLvl--; this.state='play'; this.openLevelUp(); return; }
    this.state='play'; this.physics.resume();
  }
  rollUpgrades(n){
    const pool=[];
    // coating upgrades / new
    for(const key in COATINGS){
      const c=COATINGS[key], cur=this.coats[key]||0;
      if(cur===0){
        pool.push({ title:c.name, emoji:c.emoji, desc:'ปลดล็อกเคลือบใหม่ — '+c.desc, color:COLORS.pink,
          apply:()=>{ this.coats[key]=1; if(key==='sugar') this.rebuildRing(); } });
      } else if(cur<c.max){
        pool.push({ title:c.name+' Lv'+(cur+1), emoji:c.emoji, desc:'อัปเกรด — แรงขึ้น/ถี่ขึ้น', color:COLORS.grape,
          apply:()=>{ this.coats[key]++; if(key==='sugar') this.rebuildRing(); } });
      }
    }
    // passives
    pool.push({ title:'หัวใจหวาน', emoji:'❤️', desc:'HP สูงสุด +25 และฟื้นทันที', color:0xff5f7a,
      apply:()=>{ this.player.maxhp+=25; this.player.hp=Math.min(this.player.maxhp,this.player.hp+25); } });
    pool.push({ title:'เท้าลื่น', emoji:'👟', desc:'ความเร็ว +12%', color:COLORS.mint,
      apply:()=>{ this.player.baseSpeed*=1.12; } });
    pool.push({ title:'จมูกไว', emoji:'🧲', desc:'ระยะดูดลูกกวาด +40%', color:COLORS.toast,
      apply:()=>{ this.player.pickup*=1.4; } });
    pool.push({ title:'พลังหวาน', emoji:'💥', desc:'ดาเมจทุกอย่าง +12%', color:COLORS.grape,
      apply:()=>{ this.player.dmgMul*=1.12; } });
    // pick n unique
    Phaser.Utils.Array.Shuffle(pool);
    return pool.slice(0,n);
  }
  rebuildRing(){
    this.ringBalls.forEach(b=>b.destroy()); this.ringBalls=[];
    const lvl=this.coats.sugar||0; if(lvl<1) return;
    const count=2+lvl;
    for(let i=0;i<count;i++){
      const b=this.physics.add.image(0,0,'dot').setTint(0xffd6ea).setScale(1.6).setDepth(4);
      b.setCircle(5); b.body.setAllowGravity(false);
      b.dmg=4+lvl*1.5; b.hitCd=0;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{
        if(ball.hitCd>0)return; ball.hitCd=0.12; this.damage(en,ball.dmg*this.player.dmgMul,ball.x,ball.y);
      });
      this.ringBalls.push(b);
    }
  }

  /* ---------------- SPAWNING ---------------- */
  spawnWave(dt){
    this.spawnTimer-=dt;
    const t=this.elapsed;
    const interval=Math.max(0.18, 0.9 - t*0.006);
    if(this.spawnTimer>0) return;
    this.spawnTimer=interval;
    const batch=1+Math.floor(t/25);
    for(let i=0;i<batch;i++){
      let type='basic';
      const r=Math.random();
      if(t>20 && r<0.28) type='fast';
      if(t>45 && r>0.85) type='tank';
      this.spawnEnemy(type);
    }
  }
  spawnEnemy(type){
    const cam=this.cameras.main;
    const ang=Math.random()*Math.PI*2;
    const rad=Math.max(this.W,this.H)*0.62+40;
    const x=this.player.x+Math.cos(ang)*rad;
    const y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false);
    const key= type==='fast'?'e_fast':type==='tank'?'e_tank':'e_basic';
    if(!e){ e=this.enemies.create(x,y,key); }
    else { e.setTexture(key); e.setActive(true).setVisible(true); e.body.enable=true; e.setPosition(x,y); }
    const tScale=1+this.elapsed*0.004;
    if(type==='fast'){ e.hp=6*tScale; e.spd=118; e.dmg=7; e.xp=1; e.setCircle(15,2,2);}
    else if(type==='tank'){ e.hp=42*tScale; e.spd=36; e.dmg=15; e.xp=4; e.setCircle(26,3,3);}
    else { e.hp=11*tScale; e.spd=54; e.dmg=8; e.xp=1; e.setCircle(17,3,3);}
    e.maxhp=e.hp; e.slow=0; e.setScale(1).clearTint();
  }

  /* ---------------- COMBAT ---------------- */
  fireSprinkle(){
    const lvl=this.coats.sprinkle||0; if(lvl<1) return;
    const target=this.nearestEnemy(560); if(!target) return;
    const shots=1+Math.floor((lvl-1)/2); // 1..3
    for(let s=0;s<shots;s++){
      const spread=(s-(shots-1)/2)*0.18;
      const ang=Math.atan2(target.y-this.player.y,target.x-this.player.x)+spread;
      let b=this.bullets.getFirstDead(false);
      if(!b){ b=this.bullets.create(this.player.x,this.player.y,'spark'); }
      else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(this.player.x,this.player.y); }
      b.setScale(1+lvl*0.12).setTint(0xffffff);
      b.dmg=(5+lvl*2)*this.player.dmgMul; b.life=1.1;
      b.body.setAllowGravity(false);
      this.physics.velocityFromRotation(ang,440,b.body.velocity);
    }
  }
  chiliBurst(){
    const lvl=this.coats.chili||0; if(lvl<1) return;
    const r=80+lvl*14, dmg=(8+lvl*3)*this.player.dmgMul;
    const ring=this.add.circle(this.player.x,this.player.y,10,COLORS.toast,0.35).setDepth(3);
    this.tweens.add({targets:ring,radius:r,alpha:0,duration:280,onComplete:()=>ring.destroy()});
    this.enemies.children.iterate(e=>{
      if(!e||!e.active)return;
      if(Phaser.Math.Distance.Between(e.x,e.y,this.player.x,this.player.y)<r){
        this.damage(e,dmg,e.x,e.y);
      }
    });
  }
  nearestEnemy(maxD){
    let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{
      if(!e||!e.active)return;
      const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2;
      if(d<bd){bd=d;best=e;}
    });
    return best;
  }
  hitEnemy(bullet,enemy){
    if(!bullet.active||!enemy.active)return;
    this.damage(enemy,bullet.dmg,bullet.x,bullet.y);
    this.killBullet(bullet);
  }
  damage(e,amount,x,y){
    if(!e.active)return;
    e.hp-=amount;
    e.setTintFill(0xffffff);
    this.time.delayedCall(60,()=>{ if(e.active) e.clearTint(); });
    this.popDmg(Math.round(amount),x,y);
    if(e.hp<=0) this.killEnemy(e);
  }
  killEnemy(e){
    this.kills++; this.killTxt.setText('☠ '+this.kills);
    this.toast=Math.min(100,this.toast+2.2);
    this.burst(e.x,e.y, e.texture.key==='e_tank'?0x8b5cf0:0xffd166);
    // drop orb(s)
    const drops=e.xp||1;
    for(let i=0;i<drops;i++) this.dropOrb(e.x+Phaser.Math.Between(-12,12),e.y+Phaser.Math.Between(-12,12));
    e.setActive(false).setVisible(false); e.body.enable=false;
  }
  killBullet(b){ b.setActive(false).setVisible(false); b.body.enable=false; b.body.stop(); }

  dropOrb(x,y){
    let o=this.orbs.getFirstDead(false);
    if(!o){ o=this.orbs.create(x,y,'candy'); }
    else { o.setActive(true).setVisible(true); o.body.enable=true; o.setPosition(x,y); }
    o.body.setAllowGravity(false); o.setScale(1);
    this.tweens.add({targets:o,scale:{from:0.2,to:1},duration:200});
  }
  collectOrb(player,o){
    if(!o.active)return;
    o.setActive(false).setVisible(false); o.body.enable=false;
    this.gainXp(1);
    this.toast=Math.min(100,this.toast+0.6);
  }
  touchEnemy(player,e){
    if(!e.active)return;
    if(this.player.iframe>0)return;
    this.player.iframe=0.6;
    this.player.hp-=e.dmg;
    this.cameras.main.shake(120,0.008);
    this.player.setTintFill(0xff8080);
    this.time.delayedCall(90,()=>this.player.clearTint());
    // knockback
    const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x);
    this.player.setVelocity(Math.cos(ang)*260,Math.sin(ang)*260);
    if(this.player.hp<=0) this.die();
  }

  /* ---------------- FX ---------------- */
  popDmg(n,x,y){
    let t=this.dmgPool.pop();
    if(!t){ t=this.add.text(x,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#fff2a8'}).setDepth(20).setOrigin(0.5); }
    else { t.setActive(true).setVisible(true); }
    t.setText(n).setPosition(x,y-10).setAlpha(1).setScale(1);
    this.tweens.add({targets:t,y:y-40,alpha:0,duration:520,onComplete:()=>{ t.setVisible(false); this.dmgPool.push(t); }});
  }
  burst(x,y,color){
    for(let i=0;i<7;i++){
      const p=this.add.image(x,y,'dot').setTint(color).setDepth(6).setScale(Phaser.Math.FloatBetween(0.5,1.1));
      const a=Math.random()*Math.PI*2, s=Phaser.Math.Between(40,150);
      this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:420,onComplete:()=>p.destroy()});
    }
  }
  squash(obj,sx,sy){
    obj.setScale(sx,sy);
    this.tweens.add({targets:obj,scaleX:1,scaleY:1,duration:220,ease:'Back.out'});
  }

  /* ---------------- DEATH ---------------- */
  die(){
    if(this.state==='dead')return;
    this.state='dead'; this.physics.pause();
    this.player.setVelocity(0,0);
    this.buildOver();
  }
  buildOver(){
    const w=this.W,h=this.H;
    this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.88).setOrigin(0,0);
    const em=this.add.text(w/2,h*0.26,'🫠',{fontSize:'64px'}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.39,'โมจิละลายแล้ว!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'28px',color:'#ff8fb5'}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const stat=this.add.text(w/2,h*0.49,`รอดได้ ${mm}:${ss.toString().padStart(2,'0')}   ·   กำจัด ${this.kills}   ·   Lv ${this.level}`,{fontFamily:'sans-serif',fontSize:'16px',color:'#c7bdd6'}).setOrigin(0.5);
    const btn=this.add.rectangle(w/2,h*0.63,210,58,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.3);
    const bt=this.add.text(w/2,h*0.63,'↻ เล่นอีกครั้ง',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    const hint=this.add.text(w/2,h*0.73,'(แตะตรงไหนก็ได้)',{fontFamily:'sans-serif',fontSize:'12px',color:'#9a90ab'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.restart());
    this.over.add([bg,em,t,stat,btn,bt,hint]); this.over.setVisible(true);
  }

  /* ---------------- UPDATE ---------------- */
  update(time,delta){
    const dt=delta/1000;
    if(this.state!=='play'){ return; }
    this.elapsed+=dt;

    // move dir from joystick
    if(this.joy.active && (this.joy.dx||this.joy.dy)){
      this.moveDir.set(this.joy.dx,this.joy.dy);
      if(this.moveDir.lengthSq()>0.04) this.moveDir.normalize();
    }
    // apply movement (unless dashing velocity high)
    const spd=this.player.baseSpeed*this.toastSpeedMul();
    const dashing=this.player.body.velocity.length()>430;
    if(!dashing){
      if(this.joy.active && (Math.abs(this.joy.dx)+Math.abs(this.joy.dy))>0.12){
        this.player.setVelocity(this.joy.dx*spd,this.joy.dy*spd);
      } else {
        this.player.setVelocity(this.player.body.velocity.x*0.8,this.player.body.velocity.y*0.8);
        if(this.player.body.velocity.length()<8) this.player.setVelocity(0,0);
      }
    }

    // timers
    if(this.player.iframe>0) this.player.iframe-=dt;
    if(!this.dashReady){ this.dashCd-=dt; if(this.dashCd<=0) this.dashReady=true; }
    this.dashBtn.setFillStyle(COLORS.toast, this.dashReady?0.30:0.10);

    // enemies chase + sticky slow
    this.enemies.children.iterate(e=>{
      if(!e||!e.active)return;
      const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x);
      let mul=1;
      // sticky check
      this.stickies.getChildren().forEach(s=>{
        if(Phaser.Math.Distance.Between(e.x,e.y,s.x,s.y)<42) mul=0.35;
      });
      e.setVelocity(Math.cos(ang)*e.spd*mul,Math.sin(ang)*e.spd*mul);
    });

    // sticky lifetime
    this.stickies.getChildren().forEach(s=>{
      if(this.elapsed-s.born>3.2){ s.destroy(); }
      else s.setAlpha(0.9*(1-(this.elapsed-s.born)/3.2));
    });

    // orb vacuum
    this.orbs.children.iterate(o=>{
      if(!o||!o.active)return;
      const d=Phaser.Math.Distance.Between(o.x,o.y,this.player.x,this.player.y);
      if(d<this.player.pickup){
        const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x);
        const pull=Phaser.Math.Linear(340,60,d/this.player.pickup);
        o.setVelocity(Math.cos(ang)*(400-pull+120),Math.sin(ang)*(400-pull+120));
      } else o.setVelocity(0,0);
    });

    // bullets life
    this.bullets.children.iterate(b=>{
      if(!b||!b.active)return;
      b.life-=dt; if(b.life<=0) this.killBullet(b);
    });

    // weapons
    this.cool.sprinkle-=dt;
    if(this.cool.sprinkle<=0){ this.fireSprinkle(); this.cool.sprinkle=Math.max(0.28,0.95-(this.coats.sprinkle||0)*0.08); }
    if((this.coats.chili||0)>0){
      this.cool.chili-=dt;
      if(this.cool.chili<=0){ this.chiliBurst(); this.cool.chili=Math.max(1.2,2.6-(this.coats.chili)*0.12); }
    }
    // sugar ring orbit
    if(this.ringBalls.length){
      this.ringRot=(this.ringRot||0)+dt*2.6;
      const R=54;
      this.ringBalls.forEach((b,i)=>{
        if(b.hitCd>0)b.hitCd-=dt;
        const a=this.ringRot+i*(Math.PI*2/this.ringBalls.length);
        b.setPosition(this.player.x+Math.cos(a)*R,this.player.y+Math.sin(a)*R);
      });
    }

    // TOAST logic
    const near=this.countNear(230);
    if(near>0) this.toast=Math.min(100,this.toast+dt*(6+near*0.7));
    else this.toast=Math.max(0,this.toast-dt*10);
    if(this.toast>=90){ this.player.hp-=dt*3; if(this.player.hp<=0)this.die(); } // burnt drain
    this.updateToastHUD();

    // spawn + hud
    this.spawnWave(dt);
    this.updateHUD();
  }

  toastSpeedMul(){ if(this.toast>=90)return 1.05; if(this.toast>=55)return 1.2; return 1; }
  toastDmgMul(){ if(this.toast>=90)return 1.7; if(this.toast>=55)return 1.3; return 1; }
  countNear(r){ let n=0; const rr=r*r; this.enemies.children.iterate(e=>{ if(e&&e.active && (e.x-this.player.x)**2+(e.y-this.player.y)**2<rr)n++; }); return n; }

  updateToastHUD(){
    const frac=this.toast/100;
    this.toastBar.width=(this._barW-4)*frac;
    let col=COLORS.soft,label='นุ่ม';
    if(this.toast>=90){ col=COLORS.burnt; label='🔥 ไหม้! (แรงแต่เสีย HP)'; }
    else if(this.toast>=55){ col=COLORS.golden; label='✨ จุดทอง! (แรงพุ่ง)'; }
    this.toastBar.fillColor=col; this.toastLabel.setText(label).setColor(this.toast>=55?'#ffe9c9':'#c7bdd6');
    // apply toast dmg globally via player.dmgMul? keep separate: bake into weapon calls
    this.curToastDmg=this.toastDmgMul();
  }
  updateHUD(){
    this.hpBar.width=Math.max(0,(this._barW-4)*(this.player.hp/this.player.maxhp));
    this.xpBar.width=(this._barW-4)*(this.xp/this.xpNext);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    this.timeTxt.setText(mm+':'+ss.toString().padStart(2,'0'));
  }
}

/* fold toast damage into weapon damage: multiply at fire time */
const _origDamage = Game.prototype.damage;
Game.prototype.damage = function(e,amount,x,y){ _origDamage.call(this,e,amount*(this.curToastDmg||1),x,y); };

/* ---------------- CONFIG ---------------- */
new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#241d2e',
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
  render: { antialias:true, roundPixels:false },
  scene: [Boot, Game],
});
