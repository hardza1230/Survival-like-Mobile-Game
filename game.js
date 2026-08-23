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

const COATINGS = {
  sprinkle:{ name:'Sprinkle Spray', emoji:'🍬', desc:'ยิงลูกกวาดใส่ศัตรูใกล้สุด (อัตโนมัติ)', max:6 },
  sugar:   { name:'Sugar Ring',     emoji:'🍩', desc:'วงน้ำตาลโคจรรอบตัว (อัตโนมัติ)', max:6 },
  chili:   { name:'Chili Burst',    emoji:'🌶️', desc:'ระเบิดเผ็ดรอบตัวเป็นระยะ (อัตโนมัติ)', max:6 },
};
const ACTIVES = {
  bomb:  { name:'Sugar Bomb',   emoji:'💣', desc:'ระเบิดพลังรอบตัว + ผลักศัตรู' },
  nova:  { name:'Sprinkle Nova',emoji:'✨', desc:'ยิงลูกกวาดกระจายรอบทิศ' },
  freeze:{ name:'Brain Freeze', emoji:'❄️', desc:'แช่แข็งศัตรูรอบตัวชั่วขณะ' },
};

class Game extends Phaser.Scene {
  constructor(){ super('Game'); }

  create(){
    this.W=this.scale.width; this.H=this.scale.height;
    this.state='menu'; this.elapsed=0; this.kills=0;
    this.level=1; this.xp=0; this.xpNext=5;

    this.cameras.main.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,1,0x3a2f47,0.25).setDepth(-10);

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

    this.coats={ sprinkle:1 };
    this.cool={ sprinkle:0, chili:0 };
    this.active={ key:'bomb', lvl:1 };   // start with an ACTIVE skill
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
      if(this.state==='menu'){ this.startRun(); return; }
      if(this.state==='dead'){ this.scene.restart(); return; }
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
    this.player.setVelocity(d.x*360,d.y*360);   // basic, short — won't fly off screen
    this.player.iframe=Math.max(this.player.iframe,0.25);
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

    this.hudList=[this.dashBtn,this.dashTxt,this.skillBtn,this.skillEmoji,this.skillCdTxt,this.hpBgW,this.hpBar,this.xpBgW,this.xpBar,this.timeTxt,this.killTxt,this.lvlTxt];
    this.hudList.forEach(o=>o.setVisible(false));
  }
  hudVisible(v){ this.hudList.forEach(o=>o.setVisible(v)); }

  onResize(gs){
    if(!gs)return; this.W=gs.width; this.H=gs.height; const pad=this._pad; this._barW=this.W-2*pad;
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-70,this.H-90); this.dashTxt.setPosition(this.W-70,this.H-90);
      this.skillBtn.setPosition(this.W-70,this.H-196); this.skillEmoji.setPosition(this.W-70,this.H-200); this.skillCdTxt.setPosition(this.W-70,this.H-168);
      this.hpBgW.width=this._barW; this.xpBgW.width=this._barW;
      this.timeTxt.setPosition(this.W/2,pad+30); this.killTxt.setPosition(this.W-pad,pad+32); }
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
    const btn=this.add.rectangle(w/2,h*0.60,210,62,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.35);
    const btxt=this.add.text(w/2,h*0.60,'▶ เริ่มเล่น',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffffff'}).setOrigin(0.5);
    const help=this.add.text(w/2,h*0.75,'แตะตรงไหนก็เริ่มได้\nซ้าย: ลากนิ้วเดิน  ·  ขวา: แตะพุ่ง  ·  ปุ่มชมพู: สกิล',{fontFamily:'sans-serif',fontSize:'13px',color:'#9a90ab',align:'center'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.startRun());
    this.menu.add([bg,emoji,title,sub,btn,btxt,help]); this.menu.setVisible(true);
  }
  showMenu(){ this.state='menu'; this.menu.setVisible(true); this.hudVisible(false); }
  startRun(){
    if(this.state!=='menu')return;
    this.menu.setVisible(false); this.hudVisible(true);
    this.state='play'; this.elapsed=0; this.spawnTimer=0;
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
    const w=this.W,h=this.H; this.lvlUp.removeAll(true); this.lvlCards=[];
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.82).setOrigin(0,0);
    const t=this.add.text(w/2,h*0.13,'เลเวลอัพ! แตะเลือก 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffd166'}).setOrigin(0.5);
    this.lvlUp.add([bg,t]);
    const opts=this.rollUpgrades(3);
    const cardW=Math.min(w-40,380), ch=100, gap=16, startY=h*0.24;
    opts.forEach((o,i)=>{
      const y=startY+i*(ch+gap);
      const card=this.add.rectangle(w/2,y,cardW,ch,0x2a2234,1).setStrokeStyle(2,o.color,1).setOrigin(0.5,0);
      const em=this.add.text(w/2-cardW/2+34,y+ch/2,o.emoji,{fontSize:'36px'}).setOrigin(0.5);
      const badge=this.add.text(w/2-cardW/2+64,y+18,o.kind,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:o.badgeColor}).setOrigin(0,0);
      const nm=this.add.text(w/2-cardW/2+64,y+32,o.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffffff'}).setOrigin(0,0);
      const ds=this.add.text(w/2-cardW/2+64,y+60,o.desc,{fontFamily:'sans-serif',fontSize:'12.5px',color:'#c7bdd6',wordWrap:{width:cardW-88}}).setOrigin(0,0);
      this.lvlUp.add([card,em,badge,nm,ds]);
      this.lvlCards.push({top:y,bottom:y+ch,apply:o.apply});
    });
    this.lvlUp.setVisible(true);
  }
  pickCardAt(py){
    const c=this.lvlCards.find(c=>py>=c.top&&py<=c.bottom);
    if(!c) return;
    c.apply(); this.closeLevelUp();
  }
  closeLevelUp(){
    this.lvlUp.setVisible(false); this.pendingLvl=Math.max(0,(this.pendingLvl||1)-1);
    if(this.pendingLvl>0){ this.openLevelUp(); return; }
    this.state='play'; this.physics.resume();
  }
  rollUpgrades(n){
    const pool=[];
    const A=(kind,badgeColor,color,emoji,title,desc,apply)=>pool.push({kind,badgeColor,color,emoji,title,desc,apply});
    // ACTIVE — upgrade current
    const a=this.active, ad=ACTIVES[a.key];
    A('● สกิลกดเอง','#ff8fb5',COLORS.pink,ad.emoji,ad.name+' Lv'+(a.lvl+1),'อัปเกรดสกิลกดเอง — แรงขึ้น/คูลดาวน์สั้นลง',()=>{ this.active.lvl++; });
    // ACTIVE — swap to another
    for(const k in ACTIVES){ if(k===a.key) continue;
      A('● เปลี่ยนสกิล','#ff8fb5',COLORS.pink,ACTIVES[k].emoji,'เปลี่ยนเป็น '+ACTIVES[k].name,ACTIVES[k].desc,()=>{ this.active={key:k,lvl:1}; this.skillEmoji.setText(ACTIVES[k].emoji); });
    }
    // COATINGS (auto)
    for(const key in COATINGS){ const c=COATINGS[key], cur=this.coats[key]||0;
      if(cur===0) A('◆ อาวุธอัตโนมัติ','#c6a3f0',COLORS.grape,c.emoji,c.name,'ปลดล็อก — '+c.desc,()=>{ this.coats[key]=1; if(key==='sugar')this.rebuildRing(); });
      else if(cur<c.max) A('◆ อาวุธอัตโนมัติ','#c6a3f0',COLORS.grape,c.emoji,c.name+' Lv'+(cur+1),'อัปเกรด — แรงขึ้น/ถี่ขึ้น',()=>{ this.coats[key]++; if(key==='sugar')this.rebuildRing(); });
    }
    // PASSIVES
    A('▲ พาสซีฟ','#8bd3a0',0xff5f7a,'❤️','หัวใจหวาน','HP สูงสุด +25 และฟื้นทันที',()=>{ this.player.maxhp+=25; this.player.hp=Math.min(this.player.maxhp,this.player.hp+25); });
    A('▲ พาสซีฟ','#8bd3a0',COLORS.mint,'👟','เท้าลื่น','ความเร็ว +12%',()=>{ this.player.baseSpeed*=1.12; });
    A('▲ พาสซีฟ','#8bd3a0',COLORS.toast,'🧲','จมูกไว','ระยะดูดลูกกวาด +40%',()=>{ this.player.pickup*=1.4; });
    A('▲ พาสซีฟ','#8bd3a0',COLORS.grape,'💥','พลังหวาน','ดาเมจทุกอย่าง +12%',()=>{ this.player.dmgMul*=1.12; });
    Phaser.Utils.Array.Shuffle(pool);
    return pool.slice(0,n);
  }
  rebuildRing(){
    this.ringBalls.forEach(b=>b.destroy()); this.ringBalls=[];
    const lvl=this.coats.sugar||0; if(lvl<1)return; const count=2+lvl;
    for(let i=0;i<count;i++){ const b=this.physics.add.image(0,0,'dot').setTint(0xffd6ea).setScale(1.6).setDepth(4);
      b.setCircle(5); b.body.setAllowGravity(false); b.dmg=4+lvl*1.5; b.hitCd=0;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{ if(ball.hitCd>0)return; ball.hitCd=0.12; this.damage(en,ball.dmg*this.player.dmgMul,ball.x,ball.y); });
      this.ringBalls.push(b);
    }
  }

  /* ---------- SPAWN ---------- */
  spawnWave(dt){
    this.spawnTimer-=dt; const t=this.elapsed;
    const interval=Math.max(0.2,0.9-t*0.006); if(this.spawnTimer>0)return; this.spawnTimer=interval;
    const batch=1+Math.floor(t/25);
    for(let i=0;i<batch;i++){ let type='basic'; const r=Math.random();
      if(t>20&&r<0.28)type='fast'; if(t>45&&r>0.85)type='tank'; this.spawnEnemy(type); }
  }
  spawnEnemy(type){
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)*0.62+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false); const key=type==='fast'?'e_fast':type==='tank'?'e_tank':'e_basic';
    if(!e) e=this.enemies.create(x,y,key);
    else { e.setTexture(key); e.setActive(true).setVisible(true); e.body.enable=true; e.setPosition(x,y); }
    const s=1+this.elapsed*0.004;
    if(type==='fast'){ e.hp=6*s; e.spd=116; e.dmg=7; e.xp=1; e.setCircle(15,2,2); }
    else if(type==='tank'){ e.hp=42*s; e.spd=36; e.dmg=15; e.xp=4; e.setCircle(26,3,3); }
    else { e.hp=11*s; e.spd=54; e.dmg=8; e.xp=1; e.setCircle(17,3,3); }
    e.maxhp=e.hp; e.frozen=0; e.knock=0; e.setScale(1).clearTint();
  }

  /* ---------- COMBAT ---------- */
  fireSprinkle(){
    const lvl=this.coats.sprinkle||0; if(lvl<1)return; const target=this.nearestEnemy(560); if(!target)return;
    const shots=1+Math.floor((lvl-1)/2);
    for(let s=0;s<shots;s++){ const spread=(s-(shots-1)/2)*0.18;
      const ang=Math.atan2(target.y-this.player.y,target.x-this.player.x)+spread;
      let b=this.bullets.getFirstDead(false);
      if(!b) b=this.bullets.create(this.player.x,this.player.y,'spark');
      else { b.setActive(true).setVisible(true); b.body.enable=true; b.setPosition(this.player.x,this.player.y); }
      b.setScale(1+lvl*0.12).setTint(0xffffff); b.dmg=(5+lvl*2)*this.player.dmgMul; b.life=1.1; b.body.setAllowGravity(false);
      this.physics.velocityFromRotation(ang,440,b.body.velocity);
    }
  }
  chiliBurst(){
    const lvl=this.coats.chili||0; if(lvl<1)return; const r=80+lvl*14, dmg=(8+lvl*3)*this.player.dmgMul;
    const ring=this.add.circle(this.player.x,this.player.y,10,COLORS.toast,0.35).setDepth(3);
    this.tweens.add({targets:ring,radius:r,alpha:0,duration:280,onComplete:()=>ring.destroy()});
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(this.dist(e.x,e.y,this.player.x,this.player.y)<r) this.damage(e,dmg,e.x,e.y); });
  }
  nearestEnemy(maxD){ let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2; if(d<bd){bd=d;best=e;} });
    return best; }
  hitEnemy(bullet,enemy){ if(!bullet.active||!enemy.active)return; this.damage(enemy,bullet.dmg,bullet.x,bullet.y); this.killBullet(bullet); }
  damage(e,amount,x,y){ if(!e.active)return; e.hp-=amount;
    e.setTintFill(0xffffff); this.time.delayedCall(60,()=>{ if(e.active&&!e.frozen) e.clearTint(); else if(e.active&&e.frozen) e.setTint(COLORS.ice); });
    this.popDmg(Math.round(amount),x,y); if(e.hp<=0) this.killEnemy(e); }
  killEnemy(e){ this.kills++; this.killTxt.setText('☠ '+this.kills);
    this.burst(e.x,e.y,e.texture.key==='e_tank'?0x8b5cf0:0xffd166);
    for(let i=0;i<(e.xp||1);i++) this.dropOrb(e.x+Phaser.Math.Between(-12,12),e.y+Phaser.Math.Between(-12,12));
    e.setActive(false).setVisible(false); e.body.enable=false; }
  killBullet(b){ b.setActive(false).setVisible(false); b.body.enable=false; b.body.stop(); }
  dropOrb(x,y){ let o=this.orbs.getFirstDead(false);
    if(!o) o=this.orbs.create(x,y,'candy'); else { o.setActive(true).setVisible(true); o.body.enable=true; o.setPosition(x,y); }
    o.body.setAllowGravity(false); o.setScale(1); this.tweens.add({targets:o,scale:{from:0.2,to:1},duration:200}); }
  collectOrb(player,o){ if(!o.active)return; o.setActive(false).setVisible(false); o.body.enable=false; this.gainXp(1); }
  touchEnemy(player,e){ if(!e.active||this.player.iframe>0)return;
    this.player.iframe=0.6; this.player.hp-=e.dmg; this.cameras.main.shake(120,0.008);
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
  die(){ if(this.state==='dead')return; this.state='dead'; this.physics.pause(); this.player.setVelocity(0,0); this.buildOver(); }
  buildOver(){ const w=this.W,h=this.H; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.88).setOrigin(0,0);
    const em=this.add.text(w/2,h*0.26,'🫠',{fontSize:'64px'}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.39,'โมจิละลายแล้ว!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'28px',color:'#ff8fb5'}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const stat=this.add.text(w/2,h*0.49,`รอดได้ ${mm}:${ss.toString().padStart(2,'0')}  ·  กำจัด ${this.kills}  ·  Lv ${this.level}`,{fontFamily:'sans-serif',fontSize:'16px',color:'#c7bdd6'}).setOrigin(0.5);
    const btn=this.add.rectangle(w/2,h*0.63,210,58,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.3);
    const bt=this.add.text(w/2,h*0.63,'↻ เล่นอีกครั้ง',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    const hint=this.add.text(w/2,h*0.72,'(แตะตรงไหนก็ได้)',{fontFamily:'sans-serif',fontSize:'12px',color:'#9a90ab'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.restart());
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

    // bullets life
    this.bullets.children.iterate(b=>{ if(!b||!b.active)return; b.life-=dt; if(b.life<=0)this.killBullet(b); });

    // auto weapons
    this.cool.sprinkle-=dt; if(this.cool.sprinkle<=0){ this.fireSprinkle(); this.cool.sprinkle=Math.max(0.28,0.95-(this.coats.sprinkle||0)*0.08); }
    if((this.coats.chili||0)>0){ this.cool.chili-=dt; if(this.cool.chili<=0){ this.chiliBurst(); this.cool.chili=Math.max(1.2,2.6-this.coats.chili*0.12); } }
    if(this.ringBalls.length){ this.ringRot=(this.ringRot||0)+dt*2.6; const R=54;
      this.ringBalls.forEach((b,i)=>{ if(b.hitCd>0)b.hitCd-=dt; const a=this.ringRot+i*(Math.PI*2/this.ringBalls.length); b.setPosition(this.player.x+Math.cos(a)*R,this.player.y+Math.sin(a)*R); }); }

    this.spawnWave(dt);
    this.hpBar.width=Math.max(0,(this._barW-4)*(this.player.hp/this.player.maxhp));
    this.xpBar.width=(this._barW-4)*(this.xp/this.xpNext);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60); this.timeTxt.setText(mm+':'+ss.toString().padStart(2,'0'));
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
