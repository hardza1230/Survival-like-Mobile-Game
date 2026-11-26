class Game extends Phaser.Scene {
  constructor(){ super('Game'); }

  create(){
    this.loopGuard?.();
    this._sesRuneButtons=null;
    try{ makeCodeFx(this); }catch(e){} try{ if(typeof QA!=='undefined'){ QA.button(); QA.flush(); } }catch(e){} try{ if(typeof AdManager!=='undefined')AdManager.init(); }catch(e){} try{ if(!window.__teleSession){ window.__teleSession=1; Tele.ev('session',{native:!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()),mem:navigator.deviceMemory||null}); } }catch(e){}   /* v8.1.139 ปุ่ม 🐞 + ส่งรายงานที่ค้าง */this._sesRuneUI=null;this._sesRuneLabel=null;this._bossInkActors=null;   // v8.1.23 scene.restart (Back to Hub) เก็บ instance เดิม: ล้างอ้างอิงปุ่ม/บอสของรอบก่อนที่ถูกทำลายแล้ว
    this.renderDPR=RENDER_DPR;
    this.W=this.scale.width/RENDER_DPR; this.H=this.scale.height/RENDER_DPR; // layout เป็น CSS px; canvas เป็น physical px
    this.computeViewZoom();                                // zoom ปรับตามความกว้างจอ → มือถือ/แท็บเล็ตเห็นสนามพอ ๆ กัน
    this.state='menu'; this.elapsed=0; this.kills=0; this.stageKills=0;
    this.level=1; this.xp=0; this.xpNext=12;
    Save.load(); this.comboFlags={}; this.combosOwned={}; this.sugarStage=0; this.sugarRun=0;
    if(!Save._cloudReady&&Save.syncCloud){ Save.syncCloud().then(()=>{ if(Save._cloudConflict&&this.state==='menu'){ this.buildMenuScreen(); return; } if(Save._cloudAdopted&&this.state==='menu'){ this.buildMenuScreen&&this.buildMenuScreen(); if(this.showBanner)this.showBanner('☁️ Cloud sync','Loaded your latest progress from the cloud',1600); } }); }   // ซิงค์เซฟกับ Supabase (กันเซฟหาย)
    // ในแอป: หลังLockedอิน Google เด้งกลับผ่าน deep link → ซิงค์ + Updatesหน้าSettings + แจ้งผล
    if(typeof Cloud!=='undefined'){ Cloud._onLogin=()=>{ Save._cloudReady=false; if(Save.syncCloud)Save.syncCloud().then(()=>{ if((Save._cloudConflict||Save._cloudAdopted)&&this.state==='menu')this.buildMenuScreen(); }); this._acctChecked=false; if(this.menuToast)this.menuToast('✅ Signed in with Google','#8bd3a0'); if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); if(this.state==='menu'&&this.menuScreen==='title'&&!this._titleGo)this.buildTitle(); }; if(Cloud.bindDeepLink)Cloud.ensureClient&&Cloud.ensureClient(); }

    this.cameras.main.removeBounds();   // v7.6.1 กล้องอยู่กลางตัวละครเสมอ (เดิมชนขอบโลก → ขอบล่าง/ชาร์จสไนเปอร์ซูมออก ตัวละครหลุดไปล่างจอ วงเล็งไม่ตรง) · พื้นวาดตามมุมกล้องอยู่แล้ว
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    // พื้นหลังโซนครัว (รูปจริง) — เลเยอร์ใต้สุด + กริดเส้นจาง ๆ ทับไว้เป็นจุดอ้างอิงการเคลื่อนที่
    this.bgTile=this.camWorld(this.add.tileSprite(0,0,2,2,'bg1').setOrigin(0.5).setDepth(-100002).setAlpha(1));
    this.bgTile.tileScaleX=this.bgTile.tileScaleY=1.12;     // ลดการขยาย texture ที่ทำให้พื้นหลังดูเบลอ
    this.events.on('postupdate',()=>this.syncBgTile?.());   // v6.93 พื้นขนาดพอดีจอ ตามกล้อง
    this.arenaRim=this.camWorld(this.add.graphics().setDepth(-99999));
    this.arenaRim.lineStyle(20,0x221c35,.9).strokeRect(-WORLD/2+10,-WORLD/2+10,WORLD-20,WORLD-20);
    this.arenaRim.lineStyle(3,0xe5d5ac,.8).strokeRect(-WORLD/2+2,-WORLD/2+2,WORLD-4,WORLD-4);
    this.gridBg=this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,0,COLORS.grid,0.10).setDepth(-100000).setVisible(false);   // v8.1.21 พื้นด่านทับมิดอยู่แล้ว: ไม่วาดเส้นกริด 4000×4000 ทุกเฟรม   // เส้นกริดจางลง (พื้นสวยแล้ว)
    // faux-2.5D: เลเยอร์เงาใต้ตัว (วาดใหม่ทุกเฟรม) + จัดลำดับความลึกตามแกน Y
    this.iso=true;   // สวิตช์เปิด/ปิดโหมด 2.5D เบา ๆ
    this.shadowG=this.add.graphics().setDepth(-99000);
    // vignette ขอบจอมืดนุ่ม เพิ่มมิติ (ติดกล้อง)
    this.vig=this.add.image(this.W/2,this.H/2,'vignette').setScrollFactor(1).setDepth(40).setDisplaySize(this.W,this.H);
    // ขอบจอสีแดงเต้นเป็นจังหวะตอนเลือดวิกฤต (near-death tension) — โชว์เฉพาะตอน HP ต่ำ
    this.lowHpVig=this.add.image(this.W/2,this.H/2,'vignette').setScrollFactor(1).setDepth(41).setDisplaySize(this.W,this.H).setTint(0xff2b3a).setAlpha(0).setVisible(false);
    this._hbAcc=0;this._lowHpOn=false;

    // soft glow aura ใต้ตัวละคร (UX polish)
    this.aura=this.add.circle(0,0,32,COLORS.mochiEdge,0.14).setDepth(-90000);
    this.tweens.add({targets:this.aura,scale:{from:0.9,to:1.15},alpha:{from:0.14,to:0.05},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});

    this.player=this.physics.add.sprite(0,0,'mochi').setDepth(5);
    this.player.setCircle(24,6,6); this.player.setCollideWorldBounds(true);
    this.player.hp=90; this.player.maxhp=90; this.player.baseSpeed=BALANCE.moveSpeed;
    this.player.iframe=0; this.player.pickup=105; this.player.dmgMul=1; this.player.wardGuardT=0;
    this.cameras.main.startFollow(this.player,false,0.2,0.2);  // roundPixels=false → กล้องเลื่อนลื่น ไม่กระตุกเป็นขั้น
    this._sqX=1; this._sqY=1;   // เจลลี่โมจิ: สเกลกระแทก (squash&stretch) ค่อย ๆ คืนสู่ 1 ทุกเฟรม + วอกแวกเบา ๆ

    this.enemies=this.physics.add.group({maxSize:600});
    this.bullets=this.physics.add.group({maxSize:500});
    this.orbs   =this.physics.add.group({maxSize:800});
    this.foeBullets=this.physics.add.group({maxSize:300});   // กระสุนศัตรู/บอส
    this.heals =this.physics.add.group({maxSize:60});        // ไอเทมฟื้นฟู HP
    this.crates=this.physics.add.group({maxSize:40});        // กล่อง/โหลทุบได้ (ธีมครัว)
    this.chests=this.physics.add.group({maxSize:6});         // หีบสกิลสำWaitงสำหรับกิจกรรม/ดWaitปในด่าน
    this.vacs  =this.physics.add.group({maxSize:8});         // ไอเทมMagnet (ดูดออร์บทั้งจอ)
    this.loots =this.physics.add.group({maxSize:20});   // v8.1.51 12→20 รับของจากภารกิจ        // ของสวมใส่ดWaitปในStage (low tier)
    this.gimmicks=this.physics.add.group({maxSize:20});       // ไอเทมกิมมิคประจำStage เก็บไว้ใช้ทีหลังได้
    this.portals=this.physics.add.group({maxSize:1});
    this.bossObjects=this.physics.add.group({maxSize:28});  // ไข่/ผลึก/จอมปลวกในศึกบอส ทำลายได้           // ประตูไปด่านถัดไป — ผู้เล่นต้องเดินเข้าเอง
    this.waveNodes=this.physics.add.group({maxSize:8});     // แกนคำสาปของภารกิจWave (แยกจากวัตถุบอส)
    this.decoProps=this.add.group();                         // props ประดับ (เดินทะลุได้)
    this.solidProps=this.physics.add.staticGroup();          // props แลนด์มาร์ก (ชนได้)

    this.ringBalls=[];this.starGuardFields=[];
    this.physics.add.collider(this.player,this.solidProps);
    this.physics.add.collider(this.enemies,this.solidProps);
    this.physics.add.collider(this.player,this.bossObjects);
    this.physics.add.collider(this.enemies,this.bossObjects);
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.bullets,this.bossObjects,this.hitBossObject,null,this);
    this.physics.add.overlap(this.bullets,this.waveNodes,this.hitWaveNode,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.touchEnemy,null,this);
    this.physics.add.overlap(this.player,this.orbs,this.collectOrb,null,this);
    this.physics.add.overlap(this.player,this.foeBullets,this.hitByFoe,null,this);
    this.physics.add.overlap(this.player,this.heals,this.collectHeal,null,this);
    this.physics.add.overlap(this.bullets,this.crates,this.hitCrate,null,this);
    this.physics.add.overlap(this.player,this.chests,this.collectChest,null,this);
    this.physics.add.overlap(this.player,this.vacs,this.collectVac,null,this);
    this.physics.add.overlap(this.player,this.loots,this.collectLoot,null,this);
    this.physics.add.overlap(this.player,this.gimmicks,this.collectStageGimmick,null,this);
    this.physics.add.overlap(this.player,this.portals,this.enterPortal,null,this);

    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';  // ตัวละครที่เลือก (จาก Save)
    this.skills={};                        // legacy loadout (ตัวต้นแบบ Basic Attack จะมีเพียงอาวุธประจำตัว)
    this.basicAttack=null;
    this.passives={};                      // passive skills owned {key:level}   (≤ PASSIVE_CAP)
    this.skillCd={}; for(const k in SKILLDEFS) this.skillCd[k]=0;
    this.whirlAng=0;

    this.dashTime=0; this.dashReady=true; this.dashCd=0; this.uniqueCd=0; this.uniqueLevel=typeof uniqueTalentLevel==='function'?uniqueTalentLevel(this.character||Save.data.character):1;this._cocoaRegenT=0;
    this.moveDir=new Phaser.Math.Vector2(0,-1);

    this.input.addPointer(2);
    this.joy={active:false,id:-1,bx:0,by:0,dx:0,dy:0};
    this.lvlCards=[]; this.dmgPool=[]; this.tapZones=[]; this.menuScreen='hub';

    this.buildHUD(); this.buildMenus(); this.showMenu();
    this.time.delayedCall(2500,()=>this.checkApkUpdate?.());   // v6.88 แจ้ง APK เก่า
    this.time.delayedCall(1600,()=>{ try{ if(localStorage.getItem('mochi_lowmem_note')!=='1'||this.state!=='menu')return; localStorage.removeItem('mochi_lowmem_note'); this.menuToast&&this.menuToast('Low-memory mode is on after a graphics crash · change it in Settings › Performance','#ffd166'); }catch(e){} });   // v7.4
    this.setupCameras();
    this.setupParticles();
    this.setupInput();
    this.scale.on('resize',this.onResize,this);
    if(!this._texHook){ this._texHook=true; this.load.on('filecomplete',k=>this.texTouch([k])); }   // v7.4 LRU: เวลาที่ภาพถูกถอดรหัส
    // รอซูมฉากเปิดจบก่อนถอดรหัสภาพด่านเบื้องหลัง (แย่งเฟรมบนมือถือ)
    this.time.delayedCall(60,()=>this.preloadAll());

  }

  // Prepare core assets only. Lazy pages, stages and music load through their existing scoped loaders.
  preloadAll(done,quiet,only){
    if(this._allLoaded){done&&done();return;} if(this._allLoading){ if(done){ this._allWait.push(done); if(this._preloadQuiet){ this._preloadQuiet=false; const G=window.GameLoader; if(G){G.show('Preparing game data…',0);LoadMeter.show();} } } return;}
    this._preloadQuiet=!!quiet;
    this._allLoading=true;this._allWait=done?[done]:[];
    const L=window.GameLoader,real=k=>{ if(!this.textures.exists(k))return false; return !(this.textures.get(k).getSourceImage() instanceof HTMLCanvasElement); };
    const drop=k=>this.texSafeRemove(k);
    let n=0;
    const skip=u=>only&&!only.test(u); let skipped=0;
    // Stage assets are requested by ensureStageArt when entering that stage.
    const SO=stageOnlyArtKeys();
    // Non-core art is requested only when opening its page or selected hero/stage.
    const hero=this.character||Save.data.character||'momo',lz=(k,u)=>SO.has(k)||lazyArt(k,u,hero);
    for(const k in ASSET_IMAGES){ if(real(k))continue; if(skip(ASSET_IMAGES[k])){skipped++;continue;} if(lz(k,ASSET_IMAGES[k])){  continue; } drop(k); this.load.image(k,verUrl(ASSET_IMAGES[k])); n++; }
    for(const k in ASSET_SHEETS){ if(real(k))continue; const sh=ASSET_SHEETS[k]; if(only){skipped++;continue;} if(lz(k,sh.url)){ continue; } drop(k); this.load.spritesheet(k,verUrl(sh.url),{frameWidth:sh.frame,frameHeight:sh.frame}); n++; }
    for(const k in ASSET_FX){ if(real(k))continue; const fx=ASSET_FX[k]; if(only){skipped++;continue;} if(lz(k,fx.url)){ continue; } drop(k); this.load.spritesheet(k,verUrl(fx.url),{frameWidth:fx.fw,frameHeight:fx.fh}); n++; }
    // Music is downloaded and decoded on demand through ensureStageAudio/menuMusic.
    for(const k in ASSET_AUDIO){ if(k.startsWith('sfx_a22_'))continue;if(k.startsWith('sfx_a23_'))continue; if(k.startsWith('sfx_yz_')&&(this.character||Save.data.character||'momo')!=='yuzu')continue; if(this.cache.audio.exists(k))continue; if(/^bgm_/.test(k))continue; this.load.audio(k,verUrl(ASSET_AUDIO[k])); n++; }
    // finalize = ทุกไฟล์โหลดเสร็จจริง (loader 'complete') → ถือว่าพร้อมทั้งเกม + จำไว้ว่าเครื่องมีไฟล์ครบ
    const finalize=()=>{ if(this._allComplete)return; this._allComplete=true; this.load.off('load',mk);this.load.off('loaderror',mk);this.load.off('fileprogress',tick); this.buildDeferredAnims();
      this._deferDone=true;
      const D=this._dT||(this._dT={1:{q:[]},2:{q:[]}}); [1,2].forEach(t=>{D[t].done=true;D[t].started=true;const q=D[t].q;D[t].q=[];q.forEach(cb=>setTimeout(cb,0));});
      const real=k=>this.textures.exists(k)&&!(this.textures.get(k).getSourceImage() instanceof HTMLCanvasElement);
      this._stageArtReady=new Set(STAGES.map((_,i)=>i).filter(i=>this.stageArtKeys(i).every(real)));
      try{localStorage.setItem('mochi_full_cached','1');}catch(e){}
       };
    // fin = ปล่อยผู้เล่นไปต่อ (ปิดหน้าโหลด/เข้าฉากเปิด) · partial = watchdog ตัดเพราะ loader เงียบนาน → ของที่ขาดโหลดตอนใช้ผ่าน ensureStageArt/ensureGroup
    const fin=partial=>{ if(finDone)return; finDone=true; clearInterval(wd); this.buildDeferredAnims();
      this._allLoaded=true;this._allLoading=false;
      if(!partial)finalize();
      const wasQuiet=this._preloadQuiet; this._preloadQuiet=false;
      if(L&&!wasQuiet){L.set(1,'Ready!');setTimeout(()=>L.hide(),180);}
      if(this.state==='menu')this.buildMenuScreen();
      const w=this._allWait;this._allWait=[];
      if(only&&skipped){ this._allLoaded=false;this._allComplete=false; setTimeout(()=>{ this.preloadAll(null,true); w.forEach(cb=>this.preloadAll(cb)); },50); return; }   // เฟส 2: ภาพในด่าน (เงียบ) · ใครรออยู่ให้รอเฟส 2
      w.forEach(cb=>setTimeout(cb,0)); };
    let lastT=Date.now(),finDone=false; const tick=()=>{ lastT=Date.now(); }; const mk=f=>{ lastT=Date.now(); LoadMeter.mark(f&&f.url,fileFromDevice(f)); if(!this._preloadQuiet)LoadMeter.show(); };
    // v6.49.1: มือถือบางเครื่อง loader ไม่ยิง 'complete' (ถอดรหัสเสียงค้าง) → ไม่มีความคืบหน้า 10 วิ = ไปต่อแบบ partial
    const wd=setInterval(()=>{ if(finDone){clearInterval(wd);return;} if(Date.now()-lastT>30000)fin(true); },1000);
    if(!n){fin();return;}
    if(L&&!quiet){ if(L._introDone)L.show('Loading game data…',0); LoadMeter.show(); }
    this.load.on('load',mk);this.load.on('loaderror',mk);this.load.on('fileprogress',tick);
    this.load.once('complete',()=>setTimeout(()=>{ if(!finDone)fin(); else{ finalize(); if(this.state==='menu')this.buildMenuScreen(); } },0)); if(!this.load.isLoading())this.load.start();
  }
  // v6.49.6: เติมไฟล์ที่ยังไม่อยู่ใน cache ของ Service Worker (ครั้งแรกบางไฟล์โหลดก่อน SW ทำงาน → เปิดครั้งต่อไปต้องดาวน์โหลดซ้ำ)
  fillAssetCache(){ /* On-demand cache only; no background whole-game sweep. */ }
  // v6.91 ปล่อย texture ของด่านอื่น (เดิมโหลดทั้งเกม ~940MB เข้า GPU → มือถือจอขาว) · ไฟล์ยังอยู่ใน cache เครื่อง โหลดกลับเร็วตอนเข้าด่านนั้น
  freeOtherStageArt(idx){ try{ const keep=new Set(this.stageRequiredKeys?.(idx)||this.stageArtKeys(idx)),drop=new Set();
      for(let j=0;j<(STAGES||[]).length;j++){ if(j===idx)continue; for(const k of this.stageArtKeys(j))if(!keep.has(k)&&!bootKeep(k))drop.add(k); }
      if(!drop.size)return; const am=this.anims; const all=am.anims?am.anims.getArray():[];
      this.texDetach(drop); for(const a of all){ if((a.frames||[]).some(f=>drop.has(f.textureKey)))am.remove(a.key); }
      let n=0; for(const k of drop){ if(this.textures.exists(k)){ this.textures.remove(k); n++; } }
      if(n){ for(let j=0;j<(STAGES||[]).length;j++)if(j!==idx&&this._stageArtReady)this._stageArtReady.delete(j); if(this._warmed)for(const wk in this._warmed)if(!wk.startsWith(idx+'|'))delete this._warmed[wk]; }
    }catch(e){} }
  // v7.4 ตัวจัดงบหน่วยความจำกราฟิก (GPU): นับ MB ที่ถอดรหัสแล้ว · คืนภาพ lazy ที่ไม่ได้แสดงอยู่ เรียงจากที่ใช้ล่าสุดนานสุด (LRU)
  realTex(k){ if(!this.textures.exists(k))return false; const s=this.textures.get(k).getSourceImage(); return !(s instanceof HTMLCanvasElement); }
  texBytes(k){ const t=this.textures.list[k]; let b=0; if(t)for(const x of t.source||[])if(x&&x.width)b+=x.width*x.height*4; return b; }
  texMB(){ let b=0; for(const k in this.textures.list)if(k[0]!=='_')b+=this.texBytes(k); return b/1e6; }
  texInUse(){ const used=new Set(),walk=list=>{ for(const o of list){ if(!o||o.active===false)continue; if(o.texture&&o.texture.key)used.add(o.texture.key); if(o.displayTexture&&o.displayTexture.key)used.add(o.displayTexture.key); if(Array.isArray(o.list))walk(o.list); } }; walk(this.children.list); return used; }
  // v7.6.2 ก่อนลบ texture: ตัดทุกอ็อบเจกต์ (รวมตัวที่พักใน pool) ออกจากภาพ/อนิเมชันนั้น — เดิมเหลือเฟรมที่ถูกทำลาย → 'reading sourceSize' crash ตอนเปลี่ยนด่าน
  texDetach(drop){ if(!drop||!drop.size)return; const seen=new Set(),fix=o=>{ if(!o||seen.has(o))return; seen.add(o);
      const a=o.anims; if(a&&(a.currentAnim||a.nextAnim)){ const bad=an=>an&&(an.frames||[]).some(f=>!f||!f.frame||drop.has(f.textureKey)); if(bad(a.currentAnim)||bad(a.nextAnim)){ try{a.stop();}catch(e){} a.currentAnim=null;a.currentFrame=null;a.nextAnim=null;if(a.nextAnimsQueue)a.nextAnimsQueue.length=0; } }
      if(o.texture&&drop.has(o.texture.key)&&o.setTexture){ try{o.setTexture('__DEFAULT');o.setVisible(false);}catch(e){} }
      if(Array.isArray(o.list))o.list.forEach(fix); };
    try{ (this.children.list||[]).forEach(fix); }catch(e){}
    for(const k in this){ try{ const g=this[k]; if(g&&g.children&&typeof g.getChildren==='function'&&g.children.entries)g.getChildren().forEach(fix); }catch(e){} } }
  /* v8.1.116 เจ้าของ: จบ C1-1 กด Lobby แล้วค้าง → ลบภาพสำรอง (placeholder) ที่ยังแสดงอยู่ทำให้ WebGL 'glTexture of null' แล้วลูปเกมตาย · ก่อนลบ ย้ายทุกอ็อบเจกต์ที่ใช้ภาพนั้นไปภาพว่าง แล้วคืนภาพจริงเมื่อโหลดเสร็จ */
  texSafeRemove(k){ if(!this.textures?.exists?.(k))return; const hold=[],seen=new Set(),fix=o=>{ if(!o||seen.has(o))return; seen.add(o); if(o.texture&&o.texture.key===k&&o.setTexture){ hold.push([o,o.frame?o.frame.name:null]); try{ o.anims?.stop?.(); o.setTexture('__DEFAULT'); }catch(e){} } if(Array.isArray(o.list))o.list.forEach(fix); };
    try{ for(const sc of this.game?.scene?.getScenes?.(false)||[this])(sc?.children?.list||[]).forEach(fix); for(const key in this){ const g=this[key]; if(g&&g.children&&g.children.entries&&typeof g.getChildren==='function')g.getChildren().forEach(fix); } }catch(e){}
    const animationList=this.anims?.anims?.getArray?.()||[];for(const a of animationList)if(a.key===k||(a.frames||[]).some(f=>f.textureKey===k))this.anims.remove(a.key);
    this.textures.remove(k); ['_idle','_walk'].forEach(sx=>{ if(this.anims.exists(k+sx))this.anims.remove(k+sx); });
    if(!hold.length)return; const H=this._texHold||(this._texHold={}); (H[k]||(H[k]=[])).push(...hold);
    if(!this._texHoldOn){ this._texHoldOn=true; this.textures.on?.('addtexture',key=>{ const L=this._texHold&&this._texHold[key]; if(!L)return; delete this._texHold[key]; const T=this.textures.get(key); for(const [o,f] of L){ try{ if(o.scene&&o.texture&&o.texture.key==='__DEFAULT')o.setTexture(key,f!=null&&T.has(f)?f:undefined); }catch(e){} } }); } }
  /* v8.1.116 ตาข่ายกันค้าง: ถ้าเฟรมใดพังเพราะภาพที่ถูกลบ (frame.source=null) → ซ่อมอ็อบเจกต์นั้นเป็นภาพว่างแล้วเล่นต่อ แทนลูปเกมตาย (จอค้าง) */
  texHeal(){ let n=0; const T=this.textures,fix=o=>{ if(!o)return; try{ if(o.texture&&o.setTexture&&o.texture.key!=='__DEFAULT'&&(!T.exists(o.texture.key)||(o.frame&&!o.frame.source))){ o.anims?.stop?.(); o.setTexture('__DEFAULT'); n++; } }catch(e){} if(Array.isArray(o.list))o.list.forEach(fix); };
    try{ for(const sc of this.game?.scene?.getScenes?.(false)||[this])(sc?.children?.list||[]).forEach(fix); }catch(e){} return n; }
  loopGuard(){ const G=this.game,L=G&&G.loop; if(!this._texAddOn&&this.textures?.on){ this._texAddOn=true; this.textures.on('addtexture',k=>{ (this._texAddT||(this._texAddT={}))[k]=Date.now(); }); this.load?.on?.('loaderror',f=>{ if(f&&f.type!=='audio'&&this.texMemRelief?.()>0)this._memReliefFiles=(this._memReliefFiles||0)+1; }); }   /* v8.2.82 ภาพโหลดไม่ผ่านระหว่างเล่น (มักเพราะหน่วยความจำเต็ม) → คืนภาพที่ไม่ได้แสดงทันที ตัวโหลดลองใหม่เองทุก 0.6 วิ */ if(!L||L._mmGuard||typeof L.callback!=='function')return; L._mmGuard=true; const cb=L.callback; let errs=0,burst=0,burstAt=0;
    L.callback=(t,d)=>{ try{ cb(t,d); }catch(e){ const now=Date.now(); if(now-burstAt>3000){ burstAt=now; burst=0; } if(++burst>20){ try{Save.save();}catch(_){} L.callback=cb; setTimeout(()=>location.reload(),300); return; }   /* v8.1.122 พังรัว ๆ (>20 ครั้งใน 3 วิ) = เซฟแล้วรีโหลด ไม่กระพริบวน */
      const n=this.texHeal(); if(errs++<5)console.error('frame recovered ('+n+' fixed)',e); } }; }
  texTouch(keys){ const T=this._texT||(this._texT={}),now=Date.now(); for(const k of keys)T[k]=now; }
  // ภาพ lazy ทีละใบในหน้าเมนู: มีแล้ว = true · ยังไม่มี = สั่งโหลด แล้ววาดหน้านี้ใหม่เมื่อเสร็จ
  // pred(k,cls) เลือกผู้สมัคร · budgetMB=null คืนทุกตัวที่ตรง · ตัวที่แสดงอยู่บนจอไม่ถูกคืนเด็ดขาด
  texEvict(pred,budgetMB){ try{ const used=this.texInUse(),T=this._texT||{},cand=[];
      const _now=Date.now(),_A=this._texAddT||{}; for(const k in this.textures.list){ if(k[0]==='_'||used.has(k)||(this._stagePinned?.has(k)&&(this._enteringStageArt||this.state==='loading'||this.state==='play'))||!this.realTex(k)||_now-(_A[k]||0)<20000)continue;   /* v8.1.122 ภาพที่เพิ่งโหลดไม่ถึง 20 วิห้ามคืน (เดิมโหลด→คืน→โหลดวน) */ if((this._forceCoachTutorial||this._inTutorial)&&/^(?:vfx_)?tut_/.test(k))continue; if(k.startsWith('cos_')&&this.cosWornKeys?.().includes(k))continue; const c=artClass(k); if(c&&pred(k,c))cand.push(k); }   // v8.1.58 ไม่คืนภาพของแต่งที่สวมอยู่ (เดิมโดนคืนตอนเข้าด่าน → ในด่านเป็นภาพแทน) · v7.9.68 ใบ 38 ไม่คืนภาพบทสอนระหว่างบทสอน
      if(!cand.length)return 0; cand.sort((a,b)=>(T[a]||0)-(T[b]||0));
      let mb=budgetMB==null?0:this.texMB(); const drop=new Set();
      for(const k of cand){ if(budgetMB!=null&&mb<=budgetMB)break; drop.add(k); mb-=this.texBytes(k)/1e6; }
      if(!drop.size)return 0; const am=this.anims,all=am.anims?am.anims.getArray():[];
      this.texDetach(drop); for(const a of all)if((a.frames||[]).some(f=>drop.has(f.textureKey)))am.remove(a.key);
      for(const k of drop)this.textures.remove(k);
      if(this._stageArtReady)for(const j of [...this._stageArtReady])if(this.stageArtKeys(j).some(k=>drop.has(k)))this._stageArtReady.delete(j);
      if(this._stageCardsQueued)for(const k of drop)this._stageCardsQueued.delete(k);
      this._warmed={}; this._critOk={}; this._grpOk={}; this._texEvicted=(this._texEvicted||0)+drop.size;
      return drop.size; }catch(e){ return 0; } }
  texBudget(){ if(this.texMB()>TEX_BUDGET_MB)this.texEvict(()=>true,TEX_BUDGET_MB); }
  texMemRelief(){ const now=Date.now(); if(now-(this._memReliefAt||0)<3000)return 0; this._memReliefAt=now; const n=this.texEvict(()=>true,TEX_BUDGET_MB*.7); this._memRelief=(this._memRelief||0)+1; return n; }   /* v8.2.82 โหลดพลาด → คืนภาพที่ไม่ได้แสดง (LRU) ลงเหลือ 70% ของงบ */
  runArtEndgame(){ return !!(this._recipeRequested||this._pinnacleRequested||this._riftRequested||this.recipeMode); }
  // ภาพ lazy ที่ด่านนี้ต้องใช้: ฮีโร่ที่เลือก (+มินเนียนยูซุ) และอาร์ต endgame เมื่อเล่น Delve/Pinnacle/Rift
  runArtKeys(){ const ch=this.character||Save.data.character||'momo',eg=this.runArtEndgame(),out=[];
    const sk=typeof Cos!=='undefined'&&Cos.skin?.(ch),add=(k,u)=>{ if(k.includes('__')&&!(sk&&k.endsWith('__'+sk.tag)))return; const c=artClass(k,u); if((c==='hero'&&artHero(k)===ch)||(c==='endgame'&&eg))out.push(k); };   /* v8.1.70 สกิน: โหลดเฉพาะชีตของสกินที่ใส่ */
    for(const k in ASSET_IMAGES)add(k,ASSET_IMAGES[k]); for(const k in ASSET_SHEETS)add(k,ASSET_SHEETS[k].url); for(const k in ASSET_FX)add(k,ASSET_FX[k].url); return out; }
  // เข้าด่าน: คืนภาพหน้าเมนูย่อย/ฮีโร่ตัวอื่น/endgame ที่ไม่ใช้ (เมนูถูกเคลียร์ก่อนเรียก)
  texFreeForRun(idx){ const ch=this.character||Save.data.character||'momo',eg=this.runArtEndgame(),keep=idx==null?null:this.texStageKeep(idx);
    return this.texEvict((k,c)=>c==='menu'||(c==='hero'&&artHero(k)!==ch)||(c==='endgame'&&!eg)||(!!keep&&c==='stage'&&!keep.has(k)),null); }
  /* v8.2.82 เจ้าของ: เล่นไปสักพักเกมใช้ภาพสำรอง (หน่วยความจำเต็ม) → ก่อนโหลดด่านถัดไป คืนภาพของด่านอื่นที่ไม่ใช้ (เดิมสะสมทุกด่านที่เคยเล่น) */
  stageLoadCover(idx){ try{ const k='stage_card_s'+String((idx|0)+1).padStart(2,'0'),u=ASSET_IMAGES[k],st=STAGES[idx]; if(u&&window.GameLoader?.stageCover)window.GameLoader.stageCover(verUrl(u),st?((st.emoji||'')+' '+(st.en||st.name||'')).trim():''); }catch(e){} }   /* v8.2.83 เจ้าของ: หน้าโหลดเข้าด่าน = ภาพปกด่าน (DOM ไม่กิน GPU ของเกม) + Tip */
  /* v8.2.85 A21: วัสดุของมอนสำหรับเสียงตีโดน (เดาจากชนิด/ด่าน · ไม่มีผลกับดาเมจ) */
  a21Mat(e){ if(!e)return 'mochi'; if(e.isElite||e.isMini||e._a21Armor||e.siege)return 'armor'; const si=this.stageIndex||0; return si===3?'ice':(si>=5&&si<=10)?'plant':(si===12||si===13||si===14)?'crystal':'mochi'; }
  texStageKeep(idx){return new Set(this.stageRequiredKeys(idx));}

  texFreeStages(idx){ try{ const keep=this.texStageKeep(idx),n=this.texEvict((k,c)=>c==='stage'&&!keep.has(k),null); if(n)this._texFreedStages=(this._texFreedStages||0)+n; return n; }catch(e){ return 0; } }
  // หน้าเมนูย่อย: ภาพ lazy ของกลุ่มหน้านี้ที่ยังไม่ถอดรหัส
  equipmentAssetNeeded(k,u){
    if(u.includes('/character_cards/'))return k==='card_'+(this.character||Save.data.character||'momo');
    if(u.includes('/hero_roster_ui/'))return ['hr_ui_back','hr_ui_currency','hr_ui_tab_on','hr_ui_tab_off','hr_ic_back','hr_ic_candy','hr_ic_melee','hr_ic_control','hr_ic_precision'].includes(k);
    if(k.startsWith('gear_')){const ids=new Set((Save.data.gearItems||[]).map(it=>it.baseId));for(const id of Object.values(Save.data.gear||{}))ids.add(id);return ids.has(k.slice(5));}
    return true;
  }
  /* v7.9.59 โหลดภาพหน้าเมนูแบบไม่บังจอ: เสร็จใน 300ms = วาดครั้งเดียว · ช้ากว่านั้น = วาดด้วยภาพสำรองทันที แล้ววาดใหม่ตอนภาพครบ */
  menuLoadSoft(s,start,onDone,recheck){ let fired=false,built=false; const draw=()=>{ if(this.state!=='menu'||this.menuScreen!==s)return; this._menuNoWait=s; try{ this.buildMenuScreen(); }finally{ this._menuNoWait=null; } };
    const go=()=>{ if(fired)return; fired=true; onDone&&onDone(); if(this.state!=='menu'||this.menuScreen!==s)return; if(recheck){ this.buildMenuScreen(); return; } draw(); };
    setTimeout(()=>{ if(fired||built)return; built=true; draw(); },300); setTimeout(go,10000); try{ start(go); }catch(e){ go(); } }
  /* v7.9.59 พักอยู่ Lobby → โหลดภาพหน้าแท็บล่างไว้ก่อนเงียบ ๆ (ทีละหน้า) กดแล้วหน้าขึ้นทันที */
  menuPrefetch(){ if(this._prefetchOn||this._allComplete)return; this._prefetchOn=true; const list=['char','gLoadout','gActivity','chapter','upgrade','gear'];
    const next=()=>{ if(!list.length){ this._prefetchOn=false; return; } if(this.state!=='menu'){ this._prefetchOn=false; return; } const s=list.shift(),miss=this.menuLazyMissing(s); if(!miss.length){ next(); return; } const ks=new Set(miss);
      /* v8.1.127 เสถียรภาพ: prefetch แค่ดาวน์โหลดไฟล์เข้าแคชเบราว์เซอร์ (ไม่ถอดรหัสเข้า GPU) · เดิมโหลด 6 หน้าเข้า GPU ตั้งแต่ lobby (~90 MB) */
      try{ const urls=miss.map(k=>ASSET_IMAGES[k]||ASSET_SHEETS[k]?.url).filter(Boolean); let i=0; const step=()=>{ if(this.state!=='menu'){ this._prefetchOn=false; return; } const b=urls.slice(i,i+4); i+=4; if(!b.length){ setTimeout(next,400); return; } Promise.all(b.map(u=>fetch(verUrl(u)).then(r=>r.ok&&r.blob()).catch(()=>null))).then(()=>setTimeout(step,120)); }; if(typeof fetch==='function')step(); else next(); }catch(e){ this._prefetchOn=false; } };
    setTimeout(next,1500); }
  menuLazyMissing(s){ const re=menuGroupRe(s),ch=this.character||Save.data.character||'momo',out=[];
    const chk=(k,u)=>{ if(re.test(u||'')&&(!['gear','craft'].includes(s)||this.equipmentAssetNeeded(k,u||''))&&lazyArt(k,u,ch)&&artClass(k,u)!=='hero'&&!k.startsWith('screen_')&&!this.realTex(k))out.push(k); };
    for(const k in ASSET_IMAGES)chk(k,ASSET_IMAGES[k]); for(const k in ASSET_SHEETS)chk(k,ASSET_SHEETS[k].url); return out; }
  stageArtKeys(idx){
    const keys=['bg'+(idx+1),...(STAGE_SHEETS[idx]||[]),'result_victory','result_defeat','sc44_background','sc44_frame','bv46_key','sc79_header_plate','sc79_medallion','sc79_medallion_back','sc79_rays','sc79_star_socket',...RUBY_STAGE_KEYS];
    if((this.character||Save.data.character)==='yuzu')keys.push(...Object.keys(ASSET_IMAGES).filter(k=>k.startsWith('yc59_')),...YUZU_SEEDLING_ART_KEYS);
    if((this.character||Save.data.character)==='mint')keys.push('fx_mint_dash_shard','fx_mint_snowstorm');
    keys.push(...Object.keys(ASSET_FX).filter(k=>k.startsWith('st_')),'st_icons');   // v8.0.85 ใบ 62 สถานะติดตัว ทุกด่านใช้ร่วม (≈3.8 MiB)
    if(idx>=5)keys.push('floor_c'+(idx<10?'2'+(idx-4):'3'+(idx-9)));
    if(idx>=0&&idx<5&&typeof C1_SIDE_EVENTS!=='undefined')keys.push(...C1_SIDE_EVENTS.map(e=>e.key));
    keys.push(...(this.missionArtKeys?.(idx)||[])); keys.push('cb93_back','cb93_back_shine');   /* v8.1.93 อาร์ตภารกิจ */
    { const hh=this.character||Save.data.character; keys.push('vault80_bg','vault80_pedestal','forge80_anvil','book80_spread','book80_page_glow',...((typeof BASIC_PATHS!=='undefined'&&BASIC_PATHS[hh])||[]).map(p=>'pathuq82_'+hh+'_'+p.id)); }   /* v8.1.146 Build Path art = order 82 (order-80 path cards no longer loaded: flip layout off since v8.1.144) */   /* v8.1.137 ใบ 80 */
    { const hh=this.character||Save.data.character; keys.push(...Object.keys(ASSET_FX).filter(k=>k.startsWith('ev90_')),...Object.keys(ASSET_IMAGES).filter(k=>/^(?:relic|trade)_/.test(k)&&/relics8[18]\//.test(ASSET_IMAGES[k])),...(((typeof MODIFIERS!=='undefined'&&MODIFIERS[hh])||[]).map(m=>'mod_'+m.id.slice(2)))); }   /* v8.1.151 ใบ 81: Relic 8 + Trade-off 5 + Modifier ของฮีโร่ที่เล่น 6 (~1.2 MB GPU) */
    { const A=k=>keys.push(...[...Object.keys(ASSET_FX),...Object.keys(ASSET_IMAGES)].filter(x=>x.startsWith(k))), ob=((typeof STAGES!=='undefined'&&STAGES[idx])||{}).objectives||[], roam=this._roamMissions||[], has=t=>ob.includes(t)||roam.includes(t);   /* v8.2.86 ใบ 94/95 */
      A('fb94_'); if(idx>=5){ A('tw95_'); A('sr94_'); } if(idx===9||has('breakRoots'))A('cr94_'); if(idx===6||has('cleanAir'))A('fg94_'); if(has('capture'))A('hc94_'); }
    const decor=STAGE_DECOR[idx];if(decor)for(const it of decor.items)keys.push(it.key);
    return [...new Set(keys)].filter(k=>ASSET_IMAGES[k]||ASSET_SHEETS[k]||ASSET_FX[k]);   // v7.8.32 ASSET_FX เฉพาะด่าน (C2-4) โหลดพร้อมด่าน
  }
  registerStageAnimations(keys){
    registerEnemyActionAnimations(this,keys);
    for(const k of keys){const sh=ASSET_SHEETS[k];if(!sh||!this.textures.exists(k)||(this.realTex&&!this.realTex(k)))continue;
      if(sh.anim&&!this.anims.exists(k+'_walk'))this.anims.create({key:k+'_walk',frames:this.anims.generateFrameNumbers(k,{start:sh.anim.start||0,end:(sh.anim.start||0)+sh.anim.frames-1}),frameRate:sh.anim.rate,repeat:-1,yoyo:!!sh.anim.yoyo});
      if(/^c3_(?:mini|boss)/.test(k)&&!this.anims.exists(k+'_idle'))this.anims.create({key:k+'_idle',frames:[{key:k,frame:0},{key:k,frame:1}],frameRate:2.5,repeat:-1,yoyo:true});
    }
    if(keys.includes('mb10_ancient_root_knight'))registerRootKnightAnimations(this);
    const poses=[['boss1','idle',0,1,3],['boss2','reveal',2,3,4],['boss3','idle',0,1,3],['boss4','idle',0,1,3],['boss5_sovereign','idle',0,1,2.5],['boss6_rootmother','idle',0,1,2.2]];
    for(const [k,name,a,b,rate] of poses)if(keys.includes(k)&&this.textures.exists(k)&&!this.anims.exists(k+'_'+name))this.anims.create({key:k+'_'+name,frames:[{key:k,frame:a},{key:k,frame:b}],frameRate:rate,repeat:name==='reveal'?0:-1,yoyo:name!=='reveal'});
  }
  // v6.38 โหลดเบื้องหลัง 2 ชั้น: tier 1 = ของที่ใช้ในด่าน (เข้าด่านรอแค่ชั้นนี้) · tier 2 = ของเฉพาะเมนู (วิหาร/ครัว/ขุด/Delve/การ์ดตัวละคร)
  // ย้ายไฟล์ของหน้าที่เปิดขึ้นหัวคิว loader (ไม่ต้องรอภาพเข้าด่านที่โหลดเบื้องหลังอยู่)
  prioritizeLoad(keys){ try{ const L=this.load.list; if(!L||!L.entries||!L.entries.length)return; const ks=new Set(keys),arr=L.entries; const front=arr.filter(f=>ks.has(f.key)); if(!front.length)return; const rest=arr.filter(f=>!ks.has(f.key)); arr.length=0; front.concat(rest).forEach(f=>arr.push(f)); }catch(e){} }
  ensureGroup(re,done,opts={}){
    const need=[],hit=typeof re==='function'?re:((k,u)=>re.test(u||''));
    const real=k=>this.textures.exists(k)&&!(this.textures.get(k).getSourceImage() instanceof HTMLCanvasElement);
    const entries=S=>S?(S.entries||(S.values?[...S.values()]:[])):[],queued=k=>[this.load.list,this.load.inflight,this.load.queue].some(S=>entries(S).some(f=>f.key===k));
    const add=(k,fn)=>{if(real(k))return;need.push(k);if(queued(k))return;this.texSafeRemove(k);fn();};
    for(const k in ASSET_IMAGES){const u=ASSET_IMAGES[k];if((opts.all||(!k.startsWith('screen_')&&!deferredImage(k)))&&hit(k,u))add(k,()=>this.load.image(k,verUrl(u)));}
    for(const k in ASSET_SHEETS){const sh=ASSET_SHEETS[k];if((opts.all||!STAGE_SHEET_KEYS.has(k))&&hit(k,sh.url))add(k,()=>this.load.spritesheet(k,verUrl(sh.url),{frameWidth:sh.frame,frameHeight:sh.frame}));}
    if(opts.fx)for(const k in ASSET_FX){const fx=ASSET_FX[k];if(hit(k,fx.url))add(k,()=>this.load.spritesheet(k,verUrl(fx.url),{frameWidth:fx.fw,frameHeight:fx.fh}));}
    if(!need.length){done();return;}
    const priorParallel=this.load.maxParallelDownloads;if(opts.strict)this.load.maxParallelDownloads=Math.min(priorParallel||4,4);
    let ended=false,lastKick=Date.now(),lastProgress=lastKick,lastLeft=need.length;const started=lastKick,errors={};
    const clean=()=>{ended=true;if(opts.strict)this.load.maxParallelDownloads=priorParallel;this.load.off?.('loaderror',onError);this.load.off?.('fileprogress',onProgress);};
    const fail=reason=>{if(ended)return;const missing=need.filter(k=>!real(k));clean();opts.onError?.(missing,reason);};
    const onError=file=>{if(!opts.strict||!need.includes(file?.key))return;errors[file.key]=(errors[file.key]||0)+1;if(errors[file.key]>=3)fail('request_failed');};
    const onProgress=(file,value)=>{if(opts.strict&&need.includes(file?.key)&&value>0){lastProgress=Date.now();this._stageArtProgressAt=lastProgress;}};
    this.load.on?.('loaderror',onError);this.load.on?.('fileprogress',onProgress);
    this.prioritizeLoad(need);if(!this.load.isLoading())this.load.start();
    const check=()=>{
      if(ended)return;if(opts.valid&&!opts.valid()){clean();return;}
      const missing=need.filter(k=>!real(k)),left=missing.length,now=Date.now();
      if(left<lastLeft){lastProgress=now;this._stageArtProgressAt=now;lastLeft=left;}
      if(window.GameLoader&&!opts.quiet){const total=opts.total||need.length,loaded=total-left;if(opts.strict&&window.GameLoader.stageProgress)window.GameLoader.stageProgress(loaded,total,opts.label);else window.GameLoader.set(loaded/total,opts.label||'Loading…');}
      if(!left){clean();this.buildDeferredAnims();done();return;}
      if(opts.strict&&now-lastProgress>20000){fail('stalled');return;}
      if(!opts.strict&&now-started>20000){clean();this.buildDeferredAnims();done();return;}
      if(now-lastKick>600&&missing.some(k=>!queued(k))){lastKick=now;for(const k of missing){if(real(k)||queued(k))continue;this.texSafeRemove(k);if(ASSET_IMAGES[k])this.load.image(k,verUrl(ASSET_IMAGES[k]));else if(ASSET_SHEETS[k]){const sh=ASSET_SHEETS[k];this.load.spritesheet(k,verUrl(sh.url),{frameWidth:sh.frame,frameHeight:sh.frame});}else if(ASSET_FX[k]){const fx=ASSET_FX[k];this.load.spritesheet(k,verUrl(fx.url),{frameWidth:fx.fw,frameHeight:fx.fh});}}this.prioritizeLoad(missing);if(!this.load.isLoading())this.load.start();}
      setTimeout(check,80);
    };setTimeout(check,60);
  }

  buildDeferredAnims(){ registerEnemyActionAnimations(this); for(const k in ASSET_FX){ const fx=ASSET_FX[k]; if(this.realTex(k)&&!this.anims.exists(k))this.anims.create({key:k,frames:this.anims.generateFrameNumbers(k,{start:0,end:fx.frames-1}),frameRate:fx.rate,repeat:fx.loop?-1:0}); }
      for(const k in ASSET_SHEETS){ const sh=ASSET_SHEETS[k]; if(sh.anim&&this.realTex(k)&&!this.anims.exists(k+'_walk'))this.anims.create({key:k+'_walk',frames:this.anims.generateFrameNumbers(k,{start:sh.anim.start||0,end:(sh.anim.start||0)+sh.anim.frames-1}),frameRate:sh.anim.rate,repeat:-1,yoyo:!!sh.anim.yoyo}); }
      if(this.realTex('fx_bossportal')&&!this.anims.exists('portal_idle'))this.anims.create({key:'portal_idle',frames:this.anims.generateFrameNumbers('fx_bossportal',{start:0,end:(ASSET_FX.fx_bossportal.frames||8)-1}),frameRate:12,repeat:-1});
      for(const k of Object.keys(ASSET_SHEETS).filter(k=>k.startsWith('c3_mini')||k.startsWith('c3_boss')))if(this.realTex(k)&&!this.anims.exists(k+'_idle'))this.anims.create({key:k+'_idle',frames:[{key:k,frame:0},{key:k,frame:1}],frameRate:2.5,repeat:-1,yoyo:true});
      this.registerStageAnimations(Object.keys(ASSET_SHEETS)); }
  ensureDeferred(done,tier=2){
    const D=this._dT||(this._dT={1:{q:[]},2:{q:[]}}),T=D[tier];
    if(T.done){done&&done();return;} if(done)T.q.push(done);
    if(tier===2&&!D[1].done){ this.ensureDeferred(()=>this.ensureDeferred(null,2),1); return; }
    if(T.started)return; T.started=true;
    const menuOnly=u=>MENU_ONLY_RE.test(u||''),want=u=>tier===2?menuOnly(u):!menuOnly(u);
    let n=0; const add=(k,fn)=>{ if(this.textures.exists(k)){ const src=this.textures.get(k).getSourceImage(); if(!(src instanceof HTMLCanvasElement))return; this.texSafeRemove(k); } fn(); n++; }; // ลบ placeholder ที่ Boot วาดแทนไว้
    for(const k in ASSET_IMAGES){ const u=ASSET_IMAGES[k]; if(!k.startsWith('screen_')&&!deferredImage(k)&&want(u))add(k,()=>this.load.image(k,verUrl(u))); }
    for(const k in ASSET_SHEETS){ const sh=ASSET_SHEETS[k]; if(!STAGE_SHEET_KEYS.has(k)&&want(sh.url))add(k,()=>this.load.spritesheet(k,verUrl(sh.url),{frameWidth:sh.frame,frameHeight:sh.frame})); }
    if(tier===1){ for(const k in ASSET_FX){ const fx=ASSET_FX[k]; add(k,()=>this.load.spritesheet(k,verUrl(fx.url),{frameWidth:fx.fw,frameHeight:fx.fh})); }
      for(const k in ASSET_AUDIO){ if(k.startsWith('sfx_a22_'))continue;if(k.startsWith('sfx_a23_'))continue; if(k.startsWith('sfx_yz_')&&(this.character||Save.data.character||'momo')!=='yuzu')continue; if(bootKeepAudio(k)||k.startsWith('bgm_a04_')||k.startsWith('bgm_stage')||k.startsWith('bgm_boss')||k.startsWith('bgm_ch')||k.startsWith('bgm_endgame')||/^bgm_[smb]\d/.test(k)||k.startsWith('bgm_menu_'))continue; if(this.cache.audio.exists(k))continue; this.load.audio(k,verUrl(ASSET_AUDIO[k])); n++; } }
    const fin=()=>{ this.buildDeferredAnims();
      T.done=true; if(tier===1)this._deferDone=true; const cbs=T.q; T.q=[]; setTimeout(()=>{ cbs.forEach(cb=>cb()); if(tier===1&&!D[2].started)this.ensureDeferred(null,2); },0); }; // เรียกหลัง loader จบรอบ
    if(!n){fin();return;}
    const prog=v=>{ const L=window.GameLoader; if(L&&T.q.length)L.set(v,tier===1?'Loading battle assets…':'Loading menu art…'); };
    this.load.on('progress',prog); this.load.once('complete',()=>this.load.off('progress',prog));
    this.load.once('complete',fin); if(!this.load.isLoading())this.load.start(); }
  critKey(){ return (this.character||Save.data.character||'momo')+((this._recipeRequested||this._pinnacleRequested||this.recipeMode)?'+eg':''); }
  critReady(idx){ return !!(this._deferDone||(this._critOk&&this._critOk[this.critKey()+(idx>=10?'+c3':'')])); }
  prepareStageEncounter(done){
    if(this.battleArtReady(this.stageIndex)){done();return;}
    const state=this.state,player=this.player,epoch=this._artEpoch,paused=!!this.physics?.world?.isPaused;
    this.state='loading';this.physics?.pause?.();this.stageLoadCover?.(this.stageIndex);window.GameLoader?.show?.('Preparing mission artwork…',0);
    this.ensureStageArt(this.stageIndex,()=>{if(this.state!=='loading'||this.player!==player||this._artEpoch!==epoch)return;this.state=state;if(!paused)this.physics?.resume?.();window.GameLoader?.hide?.();done();});
  }
  stageRequiredKeys(idx){
    const ch=this.character||Save.data.character||'momo',eg=this.runArtEndgame(),keys=new Set([...this.stageArtKeys(idx),...this.runArtKeys()]);
    const common=(k,u)=>!bootKeep(k)&&!MENU_ONLY_RE.test(u||'')&&artClass(k,u)===null&&stageCritical(k,u,ch,eg)&&(!Save.data.tutorialDone||!/training_floor/.test(u||''));
    for(const k in ASSET_IMAGES)if(!k.startsWith('screen_')&&!deferredImage(k)&&common(k,ASSET_IMAGES[k]))keys.add(k);
    for(const k in ASSET_SHEETS)if(!STAGE_SHEET_KEYS.has(k)&&common(k,ASSET_SHEETS[k].url))keys.add(k);
    for(const k in ASSET_FX)if(common(k,ASSET_FX[k].url))keys.add(k);
    return [...keys];
  }
  battleArtReady(idx){return this.stageRequiredKeys(idx).every(k=>this.realTex(k));}
  stageLoadFailure(idx,missing=[],reason='stalled',retry){
    this._enteringStageArt=false;this._runWatchN=(this._runWatchN||0)+1;this._stageLoadTicket=(this._stageLoadTicket||0)+1;this._stageArtReady?.delete(idx);this._stageArtWait?.delete(idx);
    try{Tele.ev('stage_art_failed',{stage:idx,reason,keys:missing.slice(0,12),count:missing.length});}catch(e){}
    const again=()=>{if(this.state==='menu')this.startRun(idx);else retry?.();};
    const back=()=>{this._stageLoadTicket++;this._runWatchN++;this._enteringStageArt=false;this._stagePinned=null;window.GameLoader?.hide?.();if(this.state==='menu')this.buildMenuScreen();else this.showMenu?.();};
    const L=window.GameLoader;if(L?.error)L.error('Some artwork could not be prepared. Check your connection and try again.',again,back);else{L?.hide?.();this.menuToast?.('Artwork is still loading — please try again.');if(this.state==='menu')this.buildMenuScreen();}
  }
  ensureStageArt(idx,done){
    const keys=this.stageRequiredKeys(idx),selected=new Set(keys),ticket=this._stageLoadTicket||0;
    this._stagePinned=selected;this.texFreeStages?.(idx);
    if(!this._stageArtReady)this._stageArtReady=new Set();
    if(keys.every(k=>this.realTex(k))){this.buildDeferredAnims();this.registerStageAnimations(keys);this._stageArtReady.add(idx);done?.();return;}
    this._stageArtReady.delete(idx);
    if(!this._stageArtWait)this._stageArtWait=new Map();
    if(this._stageArtWait.has(idx)){if(done)this._stageArtWait.get(idx).push(done);return;}
    this._stageArtWait.set(idx,done?[done]:[]);
    this.ensureGroup(k=>selected.has(k),()=>{
      if(ticket!==(this._stageLoadTicket||0))return;
      if(!keys.every(k=>this.realTex(k))){this.stageLoadFailure(idx,keys.filter(k=>!this.realTex(k)),'not_ready',()=>this.ensureStageArt(idx,done));return;}
      this.registerStageAnimations(keys);this._stageArtReady.add(idx);const wait=this._stageArtWait.get(idx)||[];this._stageArtWait.delete(idx);for(const callback of wait)callback();
    },{all:true,fx:true,strict:true,total:keys.length,valid:()=>ticket===(this._stageLoadTicket||0),quiet:false,label:'Preparing stage artwork…',onError:(missing,reason)=>this.stageLoadFailure(idx,missing,reason,()=>this.ensureStageArt(idx,done))});
  }

  ensureStageCards(chapter){
    if(!this._stageCardsQueued)this._stageCardsQueued=new Set();
    const range=CHAPTERS[chapter]&&CHAPTERS[chapter].stages;if(!range)return;
    const keys=[];for(let i=range[0];i<=range[1];i++)keys.push('stage_card_s'+String(i+1).padStart(2,'0'));
    const missing=keys.filter(k=>ASSET_IMAGES[k]&&!this.textures.exists(k)&&!this._stageCardsQueued.has(k));
    if(!missing.length)return;
    for(const k of missing){this._stageCardsQueued.add(k);this.load.image(k,verUrl(ASSET_IMAGES[k]));}
    this.load.once('complete',()=>{if(this.state==='menu'&&this.menuScreen==='stage'&&this.selectedChapter===chapter)this.buildStageSelect();});
    if(!this.load.isLoading())this.load.start();
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

  /* กล้อง 2 ตัว: viewport เป็น physical pixels แต่ Game Object/layout ยังเป็น CSS px */
  setupCameras(){
    const fw=this.scale.width, fh=this.scale.height;
    if(this._bossZoom==null)this._bossZoom=1;
    this.cameras.main.setZoom(this.viewZoom*RENDER_DPR*this._bossZoom);
    // camera zoom ชดเชย backing canvas ที่ใหญ่ขึ้นตาม DPR
    this.uiCam=this.cameras.add(0,0,fw,fh);
    this.uiCam.setZoom(RENDER_DPR);
    this.uiCam.centerOn(this.W/2,this.H/2);
    // แยกสิ่งที่แต่ละกล้องเรนเดอร์
    this._worldObjs=[this.bgTile,this.gridBg,this.arenaRim,this.shadowG,this.aura,this.player,this.enemies,this.orbs,this.bullets,this.foeBullets,this.heals,this.crates,this.chests,this.vacs,this.loots,this.gimmicks,this.portals,this.bossObjects,this.waveNodes];
    this.uiCam.ignore(this._worldObjs);
    const ui=[this.vig,this.lowHpVig,this.bannerT,this.bannerS,this.muteBtn,this.muteTxt,this.pauseBtn,this.pauseTxt,this.pauseUI,this.fpsTxt,this.menu,this.lvlUp,this.storyLayer,this.over,this.joyBase,this.joyKnob]
      .concat(this.hudList||[],this.bossUI||[]).filter(Boolean);
    this.cameras.main.ignore(ui);
    if(this.skillBar)this.camUI(this.skillBar);
  }
  camWorld(o){ if(this.uiCam)this.uiCam.ignore(o); return o; }   // FX ของโลก: ให้ ui กล้องข้าม
  camUI(o){ if(this.cameras&&this.cameras.main)this.cameras.main.ignore(o); return o; }  // UI: ให้กล้องโลกข้าม

  /* ---------- INPUT ---------- */
  setupInput(){
    try{ this.input.mouse&&this.input.mouse.disableContextMenu(); }catch(e){}
    this.input.on('pointerdown',(p)=>{
      if(p.rightButtonDown&&p.rightButtonDown()&&!p.wasTouch){ if(this.state==='play'&&this.uniqueBtn&&this.uniqueBtn.visible&&!this._kbUnique){ this._kbUnique=true; this.input.emit('pointerdown',{x:this.uniqueBtn.x*RENDER_DPR,y:this.uniqueBtn.y*RENDER_DPR,id:-77}); } return; }   // v7.2 PC: hold right mouse = Unique (aim with cursor)
      Sfx.unlock();
      if(this._adBusy)return;   // กำลังเล่นโฆษณา = บLockedอินพุตอื่น
      if(this._rubyEntry?.active&&this._rubyEntry._skip){ this._rubyEntry._skip(); return; }   // v8.0.3 แตะข้ามม่านชื่อด่าน
      p={x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id};
      // mute toggle (มุมขวาบน)
      // v5.52: ปุ่มมุมขวาบน 3 ปุ่มอยู่ใกล้กัน → เลือก "ปุ่มที่ใกล้นิ้วที่สุด" แทนเช็คทีละปุ่ม (เดิมวงแตะ 28px ทับกัน กด pause โดน mute แทน)
      if(this.state!=='menu'){ let hit=null,bd=26;
        for(const [b,k] of [[this.muteBtn,'mute'],[this.pauseBtn,'pause'],[this.speedBtn,'speed']]){ if(!b||!b.visible)continue; const d=this.dist(p.x,p.y,b.x,b.y); if(d<bd){bd=d;hit=k;} }
        if(hit)this._hudPress={k:hit,t:this.time?.now||0};
        if(hit==='mute'){ const m=Sfx.toggle(); this.muteTxt.setText(m?'🔇':'🔊'); this.hudBtnArtSync?.(); return; }
        if(hit==='pause'&&(this.state==='play'||this.state==='paused')){ this.togglePause(); return; }
        if(hit==='speed'&&this.state==='play'){ this.setGameSpeed((this.gameSpeed||1)>=4?1:(this.gameSpeed||1)+1); this.speedPopup?.(); Sfx.select(); return; } }
      if(this.state==='paused'){ // แตะปุ่มในเมนูหยุด
        for(const z of (this._pauseBtns||[])){ if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){ Sfx.uiAction('click',()=>z.fn()); return; } }
        return; }
      if(this.state==='menu'){ if(this.menuScreen==='atlas'&&this._amRect&&this.atlasPointerDown(p))return; this.menuPointerDown(p); return; return; }
      if(this.state==='tutorial'){this.advanceTutorial();return;}
      if(this.state==='coachIntro'){this.coachIntroTap?.();return;}
      if(['dead','rushDone','summary','epilogue','rewardChoice'].includes(this.state)){ const now=Date.now(),at=this._stSeen===this.state?(this._stAt||0):now;
        if(now<at+700)return; }   // v6.44 กันกดรัว ๆ ข้ามหน้าจบด่าน · v7.9.45 นับ 0.7 วิจากตอนเปิดหน้า (เดิมเริ่มนับตอนแตะครั้งแรก → แตะแรกโดนกินเสมอ และแตะซ้ำยืดล็อกถึง 2.6 วิ)
      if(this.state==='dead'||this.state==='rushDone'){for(const z of (this._overBtns||[])){const q=10;if(p.x>=z.x-q&&p.x<=z.x+z.w+q&&p.y>=z.y-q&&p.y<=z.y+z.h+q){Sfx.uiAction('click',()=>z.fn());return;}}return;}
      if(this.state==='win'){ this.scene.restart(); return; }
      if(this.state==='rolling'){ for(const z of (this._rollBtns||[])){ if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){ z.fn(); return; } } return; }
      if(this.state==='epilogue'){ for(const z of (this._epilogueBtns||[])){const q=10;if(p.x>=z.x-q&&p.x<=z.x+z.w+q&&p.y>=z.y-q&&p.y<=z.y+z.h+q){ Sfx.uiAction('click',()=>z.fn()); return; } } return; }   // หน้าสรุปเรื่องราว — ไปต่อได้เฉพาะกดปุ่ม
      if(this.state==='summary'){ for(const z of (this._summaryBtns||[])){const q=0;if(p.x>=z.x-q&&p.x<=z.x+z.w+q&&p.y>=z.y-q&&p.y<=z.y+z.h+q){ Sfx.uiAction('click',()=>z.fn()); return; } } this.finishSummaryPresentation?.();return; }   // Empty taps reveal rewards, never dismiss results.
      if(this.state==='rewardChoice'){for(const z of (this._rewardBtns||[])){if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){Sfx.uiAction('click',()=>z.fn());return;}}return;}
      if(this.state==='cinematic'&&this._finishStoryCutscene){ this._finishStoryCutscene(p); return; }
      if(this.state==='startskill'){ this.pickStartingSkillAt(p.x,p.y); return; }
      if(this.state==='levelup'){ this.pickCardAt(p.x,p.y); return; }
      if(this.state!=='play') return;

      if(Save.data.settings?.ctrlLeft?p.x<this.W/2:p.x>=this.W/2)(this._actionPointers||(this._actionPointers=new Set())).add(p.id);
      if(this.fpBtnHit?.(p))return;   // v8.1.111 ปุ่ม Open the Jar
      if(this.missionBtnHit?.(p))return;   // v8.1.142 ปุ่ม Start mission
      if(this.sesRunePointerDown?.(p))return;
      if(this.flickerBtn?.visible&&Math.abs(p.x-this.flickerBtn.x)<=this.flickerBtn.width/2&&Math.abs(p.y-this.flickerBtn.y)<=this.flickerBtn.height/2){this.toggleCocoaFlicker();return;}
      if(this.uniqueBtn && this.uniqueBtn.visible && this.dist(p.x,p.y,this.uniqueBtn.x,this.uniqueBtn.y)<this.uniqueBtn.radius+8){ if(this.isTitanHold?.()){ if(this.uniqueCd<=0&&!this._titanHold)this._titanHold={id:p.id}; return; } if(this.isSniperUnique()||this.isBlastUnique()||this.mintChargeKind()||this.isYuzuCommand?.()){ if(this.uniqueCd<=0)this.startSnipeCharge(p); return; } this.useCharacterSkill(); return; }
      // กดปุ่ม Dash เฉพาะในขอบเขตปุ่ม (มุมขวาล่าง)
      if(this.dashBtn && this.dashBtn.visible && this.dist(p.x,p.y,this.dashBtn.x,this.dashBtn.y)<this.dashBtn.radius+8){ this.mxDash?.();if(this.state==='play')this.dashPress?.();this.doDash(); return; }   // v8.0.17 ปุ่มยุบตอนกด

      // Movement starts only on the movement half; the action half never steals its owner.
      if(!this.joyBlocked(p))this.joyStart(p);
    });
    this.input.on('wheel',(p,o,dx,dy)=>{ if(this.state==='menu'&&this.menuScreen==='atlas'&&this._amRect&&this._amv)this.atlasZoomAt(p.x/RENDER_DPR,p.y/RENDER_DPR,this._amv.s*(dy>0?0.88:1.14)); else if(this.state==='menu'&&(this._mScrollMax||0)>0&&!this._craftRolling&&!this._bazBusy&&!this._gachaBusy){this._mVelocity=0;this.setMenuScroll((this._mScroll||0)+dy*0.6);} });
    this.input.on('pointermove',(p)=>{
      if(this._sesRunePointers?.has(p.id))return;
      if(this.state==='menu'&&this._amDrag){ this.atlasPointerMove({x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id}); return; }
      if(this.state==='menu'&&this._mDrag&&p.id===this._mDrag.id){ this.menuPointerMove({x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id}); return; }
      if(this._snipe&&p.id===this._snipe.id){ this.moveSnipeAim({x:p.x/RENDER_DPR,y:p.y/RENDER_DPR}); return; }
      if(this._actionPointers?.has(p.id))return;
      if(!this.joy.active&&this.state==='play'&&p.isDown&&!this._titanHold&&!this._snipe){ const q={x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id}; if(!this.joyBlocked(q))this.joyStart(q); }   // v8.0.5 นิ้วค้างไว้ตั้งแต่ก่อนปิดการ์ด/ฉาก = รับเป็นจอยเลย (เดิมต้องยกนิ้วแตะใหม่)
      if(!this.joy.active||p.id!==this.joy.id) return;
      this.joyMove({x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id});
    });
    this.input.on('gameout',()=>{if(this.state==='menu')this.cancelMenuMotion();});
    this.input.on('pointerupoutside',p=>{this._actionPointers?.delete(p.id);if(this._sesRunePointers?.delete(p.id))return;if(p.id===this.joy.id)this.joyEnd();if(this.state==='menu')this.cancelMenuMotion();else if(this._titanHold&&p.id===this._titanHold.id)this.releaseTitanCharge();else if(this._snipe&&p.id===this._snipe.id)this.releaseSnipe();});
    this.input.on('pointercancel',p=>{this._actionPointers?.delete(p.id);this._sesRunePointers?.delete(p.id);if(p.id===this.joy.id)this.joyEnd();});
    this.input.on('pointerup',(p)=>{
      this._actionPointers?.delete(p.id);
      if(this._sesRunePointers?.delete(p.id))return;
      if(p.button===2&&!p.wasTouch){ if(this._kbUnique){ this._kbUnique=false; this.input.emit('pointerup',{x:this.uniqueBtn.x*RENDER_DPR,y:this.uniqueBtn.y*RENDER_DPR,id:-77}); } return; }
      if(this.state==='menu'&&this._amDrag){ this.atlasPointerUp({x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id}); return; }
      if(this.state==='menu'&&this._mDrag&&p.id===this._mDrag.id){ this.menuPointerUp({x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id}); return; }
      if(this._titanHold&&p.id===this._titanHold.id){ this.releaseTitanCharge(); return; }
      if(this._snipe&&p.id===this._snipe.id){ this.releaseSnipe(); return; }
      if(p.id===this.joy.id)this.joyEnd();
    });
    this.setupKeyboard?.();
  }
  /* v8.0.5 จอยลอยลื่นขึ้น (เจ้าของ: บางทีเลื่อนไม่ค่อยไป): ความเร็วเต็มตั้งแต่ลาก ~30px (เดิม 60) + โซนตาย 5px · ลากเกินวง ฐานจอยตามนิ้ว (กลับทิศได้ทันที) */
  joyStart(p){ const j=this.joy;if(j.active||this.joyBlocked(p))return; j.active=true; j.id=p.id; j.bx=p.x; j.by=p.y; j.dx=0; j.dy=0; this.joyBase.setPosition(p.x,p.y).setVisible(true); this.joyKnob.setPosition(p.x,p.y).setVisible(true); }
  joyMove(p){ const j=this.joy,max=60,dead=5,full=30; let dx=p.x-j.bx,dy=p.y-j.by,len=Math.hypot(dx,dy);
    if(len>max){ const k=(len-max)/len; j.bx+=dx*k; j.by+=dy*k; dx=p.x-j.bx; dy=p.y-j.by; len=max; this.joyBase.setPosition(j.bx,j.by); }
    const m=len<=dead?0:Math.min(1,(len-dead)/(full-dead)); j.dx=len?dx/len*m:0; j.dy=len?dy/len*m:0; this.joyKnob.setPosition(j.bx+dx,j.by+dy); }
  joyEnd(){ const j=this.joy; j.active=false; j.id=-1; j.dx=0; j.dy=0; this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
  joyBlocked(p){if(this.fpBtnOver?.(p)||this.missionBtnOver?.(p))return true;const mid=(this.W||390)/2;if(this._actionPointers?.has(p.id)||(Save.data.settings?.ctrlLeft?p.x<mid:p.x>=mid))return true; if(this.sesRuneHit?.(p))return true;const near=(b,r)=>b&&b.visible&&this.dist(p.x,p.y,b.x,b.y)<r; return near(this.uniqueBtn,(this.uniqueBtn?.radius||0)+8)||near(this.dashBtn,(this.dashBtn?.radius||0)+8)||!!(this.flickerBtn?.visible&&Math.abs(p.x-this.flickerBtn.x)<=this.flickerBtn.width/2&&Math.abs(p.y-this.flickerBtn.y)<=this.flickerBtn.height/2); }
  // v7.0 KEYBOARD (เล่นบนเบราว์เซอร์คอม): WASD/ลูกศร=เดิน · Space/Shift=Dash · E/J (กดค้าง)=Unique · F=Flicker · Esc/P=หยุด · 1-4=เลือกการ์ด
  setupKeyboard(){ const kb=this.input.keyboard; if(!kb)return; this._kbKeys=kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT',false);
    const fake=(type,btn,id)=>{ if(!btn)return; this.input.emit(type,{x:btn.x*RENDER_DPR,y:btn.y*RENDER_DPR,id}); };
    kb.on('keydown',ev=>{ const k=ev.code; if(ev.repeat)return; Sfx.unlock&&Sfx.unlock();
      if(k==='Escape'||k==='KeyP'){ if(this.state==='play'||this.state==='paused')this.togglePause(); return; }
      if(this.state==='levelup'&&/^Digit[1-4]$/.test(k)){ const c=(this.lvlCards||[])[+k.slice(5)-1]; if(c){ const x=(c.left+c.right)/2,y=(c.top+c.bottom)/2; this.levelCardReadyAt=0; this.pickCardAt(x,y); if(this.state==='levelup'&&this._pendingCardConfirm===c)this.pickCardAt(x,y); } return; }
      { const L=this.state==='rolling'?this._rollBtns:this.state==='rewardChoice'?this._rewardBtns:null;   // v7.2 Jackpot/wheel/mystery/reward: 1-9 = button · Space/Enter = only button (STOP)
        if(L&&L.length){ const d=/^(Digit|Numpad)([1-9])$/.exec(k); if(d){ const z=L[+d[2]-1]; if(z)z.fn(); return; }
          if((k==='Space'||k==='Enter'||k==='NumpadEnter')&&L.length===1){ L[0].fn(); return; } } }
      if(this.state!=='play')return;
      if(k==='Space'||k==='ShiftLeft'||k==='ShiftRight'){ if(this.dashBtn&&this.dashBtn.visible)this.mxDash?.();this.doDash(); return; }
      if(k==='KeyE'||k==='KeyJ'){ if(this.uniqueBtn&&this.uniqueBtn.visible){ this._kbUnique=true; fake('pointerdown',this.uniqueBtn,-77); } return; }
      if(k==='KeyF'){ if(this.flickerBtn&&this.flickerBtn.visible)this.toggleCocoaFlicker(); return; } });
    kb.on('keyup',ev=>{ const k=ev.code; if((k==='KeyE'||k==='KeyJ')&&this._kbUnique){ this._kbUnique=false; fake('pointerup',this.uniqueBtn,-77); } });
    if(kb.addCapture)kb.addCapture('SPACE,UP,DOWN,LEFT,RIGHT'); }
  tickKeyboard(){ const K=this._kbKeys; if(!K||!this.joy)return;
    { const sn=this._snipe,mp=this.input.activePointer; if(sn&&sn.id===-77&&mp&&!mp.wasTouch&&this.cameras?.main?.worldView){ const wv=this.cameras.main.worldView,ox=(this.player.x-wv.x)/wv.width*this.W,oy=(this.player.y-wv.y)/wv.height*this.H,mx=mp.x/RENDER_DPR,my=mp.y/RENDER_DPR;   // v7.2 PC: hold E = aim sniper/shotgun at the mouse cursor
      if(Math.hypot(mx-ox,my-oy)>24){ sn.ang=Math.atan2(my-oy,mx-ox); sn.dragged=true; } } } const x=(K.D.isDown||K.RIGHT.isDown?1:0)-(K.A.isDown||K.LEFT.isDown?1:0),y=(K.S.isDown||K.DOWN.isDown?1:0)-(K.W.isDown||K.UP.isDown?1:0);
    if(x||y){ if(this.joy.active&&this.joy.id!==-78)return; const l=Math.hypot(x,y); this.joy.active=true; this.joy.id=-78; this.joy.dx=x/l; this.joy.dy=y/l; }
    else if(this.joy.active&&this.joy.id===-78){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0; } }
  dist(ax,ay,bx,by){ return Math.hypot(ax-bx,ay-by); }

  doDash(){
    const coc=this.character==='cocoa';
    if(coc&&this.state==='play')this.finishCocoaFlicker(true);   // v5.70 โกโก้สะสม Dash ได้หลายชาร์จ
    if(coc){ if(this.state!=='play'||(this.dashTime||0)>0.06)return; if(this._dpCh==null)this._dpCh=this.cocoaDashMax(); const temp=this._cocoaPhantom&&this._cocoaPhantom.t>0&&this._cocoaPhantom.charges>0;if(!temp&&this._dpCh<=0)return;if(temp)this._cocoaPhantom.charges--;else this._dpCh--; this._dashFree=temp; }
    else if(!this.dashReady||this.state!=='play'||(this.character==='taro'&&this.basicAttack?.path==='tempest'&&this.dashTime>0)) return;
    if(this._impalerCharge)this.releaseImpalerCharge(false);if(this._berryCharge)this.releaseBerryCharge(false);
    if(this.player&&this.player._pt&&this.player._pt.hsDash)this._ptHsNext=true;
    this.charPassiveOnDash(); this.ancientEchoDash(); this.fireRecipes('dash'); if(!coc){ this.dashReady=false; this.dashCdMax=1.1*(this.player.dashCdMul||1)*(this.character==='taro'&&this.basicAttack?.path==='tempest'?taroGaleCooldown(this.basicAttack):1);this.dashCd=this.dashCdMax; } this.dashTime=0.16; this.cocoaDashBuff(); if(coc)this.cocoaOnDash(); this._coachDash=(this._coachDash||0)+1;   // v5.69 dash ตัดคอมโบ · v5.70.1 แก้ตัวนับ tutorial ที่หลุดเข้า comment
    const d=this.moveDir.clone().normalize();
    this.dashTime=0.2; this._lastDashAt=this.elapsed||0;if(this.player.forgeMods){const r=forgeState(this);r.dashUntil=(this.elapsed||0)+1.5;r.dashPrimed=true;}
    if(this.character==='momo'){this._attackPoseTime=0;this._poseHold=0;this._momoDashT=0;}
    this.player.setVelocity(d.x*560,d.y*560);if(coc){this.cocoaStartTrail();this.cocoaDashLeap(d);this.cocoaEvoDash?.();}   /* v8.2.78 เจ้าของ: Dash ไม่ลดคูลดาวน์ Phantom Rush อีก (เดิม v8.2.63 ลดได้เฉพาะ Dash ปกติ) */
    this.player.iframe=Math.max(this.player.iframe,0.28);
    Sfx.dash();
    this.flashBtn(this.dashBtn);
    this.player.setTint(0xfff6bd);
    this.time.delayedCall(160,()=>this.player.clearTint());
    this._sqX=1.35; this._sqY=0.7;   // ยืดตอนพุ่ง (เจลลี่)
    if(this._rel&&this._rel.jam)this.relicJamTrail(d);
    if(this.basicAttack&&this.basicAttack.mods)this.modOnDash(d);
    if(this.player.gearDashNova){const P=this.player;this.time.delayedCall(180,()=>{ if(this.state==='play')this.gearModBoom(P.x,P.y,110,P.gearDashNova,0x9fe8ff); });}
    if(this._rel&&this._rel.dashcharge){this._sparkHits=3;this._sparkUntil=(this.elapsed||0)+3;}   // 🔮 Spark Step
  }

  uniqueInfo(){ if(this.isSesRune?.())return this.sesRuneRecipe();if(this.character==='yuzu'&&YUZU_UNIQUES[this.basicAttack?.path])return YUZU_UNIQUES[this.basicAttack.path];if(this.character==='cocoa'&&COCOA_UNIQUES[this.basicAttack?.path])return COCOA_UNIQUES[this.basicAttack.path];if(this.character==='taro'){const tp=this.basicAttack?.path;if(!tp||tp==='storm')return TARO_UNIQUES.plasma;if(tp==='tempest')return TARO_UNIQUES.overcharge;if(tp==='smite')return TARO_UNIQUES.stormmark;}const c=CHARACTERS[this.character]||CHARACTERS.momo; return CHARACTER_UNIQUES[c.unique]||CHARACTER_UNIQUES.berryRebound; }
  uniqueCooldown(u){const lv=this.uniqueLevel||1;return u.cd*Math.max(0.80,1-(lv-1)*0.055)*(this.player.cdMul||1)*Math.max(0.6,this.player.uniqueCdMul||1)*Math.pow(.9,this.uqLv?.('uq_cd')||0);}
  uniquePower(){return (1+((this.uniqueLevel||1)-1)*0.24)*(this.uqMul?.()||1);}
  uqLv(id){return this.basicAttack?.lv?.[id]||0;}
  uqMut(){return this.basicAttack?.uqMut||null;}
  uqMul(){return 1+.2*this.uqLv('uq_power');}
  uqReady(){return this.uqLv('uq_ready')>0&&!(this.uniqueCd>0)&&this.state==='play';}
  sentryWardMul(){ const b=this.basicAttack,w=b?.path==='tempest'?(b.lv?.p_sentry_ward||0):0; if(!w||this.character!=='taro')return 1; const p=this.player; return (this._taro?.nodes||[]).some(n=>!n.beacon&&this.dist(n.x,n.y,p.x,p.y)<160)?1-.05*w:1; }   // v7.9.23 Sentry Ward
  uqGuardMul(){return ((this.elapsed||0)<(this._uqGuardT||0)?(this._uqGuardM||1):1)*(this.isSesRune?.()?this.sesRuneGuardMul():1);}
  // v7.9.22 ⭐ Unique cards: นับการใช้ (เปิดการ์ดหลัง 3 ครั้ง) · Echo · Mutation ตอนกด
  uniqueCastFx(){ const p=this.player; if(!p)return;if(typeof VoiceActing!=='undefined')VoiceActing.unique(this); this._uqUses=(this._uqUses||0)+1; if(!this._inTutorial&&Save.data)Save.data.uniqueCasts=(Save.data.uniqueCasts||0)+1; (typeof DailyQ!=='undefined')&&!this._inTutorial&&DailyQ.tick('unique'); const um=this.uqMul(),b=this.basicAttack,mut=this.uqMut(),T=this.elapsed||0;
    if(this.uqLv('uq_echo')){ this.artDelay?.(400,()=>{ if(this.state!=='play')return; this.vfxHitRing?.(p.x,p.y,0xffd166,true); this.explodeAt(p.x,p.y,150,this.relicDmg(4)*um); }); }
    if(!mut||!b)return; const path=b.path;
    if(mut==='reb_shield'&&(this._shield||0)<2){this._shield=(this._shield||0)+1;this.floatText?.(p.x,p.y-44,'🫧 Sugar Shell',0x9fe8ff);}
    else if(mut==='reb_double')this.artDelay?.(1000,()=>{ if(this.state==='play')this.uqSeedRing(8,(14+(this.uniqueLevel||1)*2)*(p.dmgMul||1)*this.uniquePower()*.5,0xff76a8,1); });
    else if(mut==='gale_blades'){ const dur=2.6+(this.uniqueLevel||1)*.5; let k=0; const tick=()=>{ if(this.state!=='play'||!(this.windRushT>0)||++k>Math.ceil(dur/.5))return; this.vfxHitRing?.(p.x,p.y,0xbff4e8,false); this.enemies.children.iterate(e=>{ if(e&&e.active&&e.hp>0&&this.dist(e.x,e.y,p.x,p.y)<120)this.damage(e,this.relicDmg(1.2)*um,e.x,e.y); }); this.artDelay?.(500,tick); }; this.artDelay?.(500,tick); }
    else if(mut==='rocket_ring')this.artDelay?.(800,()=>{ if(this.state==='play')this.uqSeedRing(8,this.relicDmg(2)*um,0xff7a2a,0,'fire'); });
    else if(mut==='rocket_heat')this._uqHotT=T+4;
    else if(mut==='rage_after'&&(this._titanRelease||0)>0){ for(const d of [400,800])this.artDelay?.(d,()=>{ if(this.state!=='play')return; this.screenShake?.(120,.008); this.explodeAt(p.x,p.y,200,this.relicDmg(4)*um); }); }
    else if(mut==='rage_guard'&&(this._titanRelease||0)>0){this._uqGuardT=T+3;this._uqGuardM=.5;}
    else if(mut==='phantom_refund')this._uqWinT=T+5.5;
    else if(mut==='phantom_slam'&&path==='dashboxer')this.artDelay?.(5500,()=>{ if(this.state!=='play')return; this.screenShake?.(200,.012); this.vfxHitRing?.(p.x,p.y,0xc9a3ff,true); this.explodeAt(p.x,p.y,200,this.relicDmg(7)*um); });
    else if(mut==='plasma_twin'&&this.character==='taro')this.artDelay?.(1900,()=>{ if(this.state==='play')this.castTaroPlasma?.((this._uqDm||p.dmgMul||1)*.6,this.uniqueLevel||1); });
    else if(mut==='over_finale'&&this.character==='taro')this.artDelay?.((TARO_OVER_TIME+(p.echoPath?1.5:0))*1000+100,()=>this.uqOverFinale()); }
  uqMutHook(kind,c={}){ const mut=this.uqMut(),p=this.player,um=this.uqMul(),T=this.elapsed||0; if(!mut||!p)return;
    if(kind==='snipe'){ if(mut==='snipe_refund'&&(c.hits||0)>=3){this.uniqueCd*=.65;this.floatText?.(p.x,p.y-50,'🎯 Refund',0xffe066);} else if(mut==='snipe_guard'&&c.c>=1){const h=p.maxhp*.05;p.hp=Math.min(p.maxhp,p.hp+h);this.popHeal?.(p.x,p.y,Math.round(h));if((this._shield||0)<2)this._shield=(this._shield||0)+1;} }
    else if(kind==='blast'){ if(mut==='blast_stun')this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&!e.isMini&&this.dist(e.x,e.y,p.x,p.y)<220){e.knock=Math.max(e.knock||0,1);e.setVelocity?.(0,0);} }); else if(mut==='blast_rain')this.artDelay?.(600,()=>{ if(this.state==='play')this.uqSeedRing(8,this.relicDmg(2)*um,0xff9ec4,1); }); }
    else if(kind==='bloom'){ if(mut==='bloom_heal'&&c.n>0){const h=p.maxhp*Math.min(.16,.02*c.n);p.hp=Math.min(p.maxhp,p.hp+h);this.popHeal?.(p.x,p.y,Math.round(h));}
      else if(mut==='bloom_field'&&c.storm)c.storm.deepChill=true; }
    else if(kind==='lance'){ if(mut==='lance_guard')this.artDelay?.(300,()=>{this._uqGuardT=(this.elapsed||0)+3;this._uqGuardM=.6;});
      else if(mut==='lance_mines'){ const x0=p.x,y0=p.y; this.artDelay?.(350,()=>{ if(this.state!=='play')return; const x1=p.x,y1=p.y; for(let i=1;i<=3;i++){ const x=x0+(x1-x0)*i/4,y=y0+(y1-y0)*i/4,m=this.trackArtVfx?.(this.camWorld(this.add.circle(x,y,9,0x9fe8ff,.9).setStrokeStyle(2,0xffffff).setDepth(8))); this.artDelay?.(600+i*80,()=>{ if(m?.active)m.destroy(); if(this.state==='play')this.modBoom(x,y,80,2.2*um,true); }); } }); } } }
  /* v8.2.63 เจ้าของ: Phantom Rush ลดคูลดาวน์รวม (Dash/ฆ่า/Ghost Refund) ได้ไม่เกิน 40% ต่อรอบ */
  phRefund(n){ if(!(n>0)||!(this.uniqueCd>0))return; if(this.basicAttack?.path!=='dashboxer'){ this.uniqueCd=Math.max(0,this.uniqueCd-n); return; } const left=Math.max(0,(this._phCap||0)-(this._phRef||0)),k=Math.min(n,left); this._phRef=(this._phRef||0)+k; this.uniqueCd=Math.max(0,this.uniqueCd-k); }
  uqOnKill(e){ if(this.isSesRune?.()){this.sesRuneReduceCooldowns(.1*this.uqLv('uq_kill'));return;}const T=this.elapsed||0; if(this.uniqueCd>0){ const k=this.uqLv('uq_kill'); if(k)this.phRefund(.1*k); if(this.uqMut()==='phantom_refund'&&T<(this._uqWinT||0))this.phRefund(.5); } }
  uqSeedRing(n,dmg,tint,bounce=0,fire){ const P=this.player; for(let i=0;i<n;i++){ const c=this.getBullet(P.x,P.y,0xffffff,fire?0.2:0.13); if(!c)break; c.setTexture(fire&&this.textures.exists('proj_rocket')?'proj_rocket':'proj_sprinkle').setTint(tint); c.faceVel=true; c.dmg=dmg; c.life=1.1; c.pierce=false; c.hitGapV=0.16; c.bounce=bounce; c.homing=0; c.headshot=0; c.bigMul=0; c.closeMul=0; c.bounceGain=0; c.seedPierce=false; c.penGain=0; c.forceHs=false; c.cqMul=0; c.dragon=false; c.lastMul=0; c.seekMul=1; c.splitCh=0; c.boomer2=false; c.loopT=false; c.explode=fire?55:0; this.physics.velocityFromRotation(i*Math.PI*2/n,640,c.body.velocity); } }
  uqOverFinale(){ const t=this._taro; if(!t||this.state!=='play'||this.character!=='taro')return; const f=this.taroSwarmProfile?.(); if(!f)return; const id=++t.attackSeq; for(const n of t.nodes||[]){ if(n.beacon)continue; for(let i=0;i<8;i++)this.taroSpawnProjectile({kind:'sentry',x:n.x,y:n.y,angle:i*Math.PI/4,speed:n.speed,life:n.orbLife,damage:n.damage*2,radius:n.orbRadius,range:n.range,attackId:id}); } this.showBanner?.('🎆 Finale Burst','',700); }

  uniqueRankNotice(level,u){
    if(this._uniqueNotice?.active)this._uniqueNotice.destroy();const w=this.W;
    const c=this.add.container(w/2,this.H*.22).setDepth(110000);this.camUI(c);this._uniqueNotice=c;
    const bg=this.add.rectangle(0,0,Math.min(w-24,360),76,0x251333,.95).setStrokeStyle(3,u.color,.95);
    const title=this.add.text(0,-15,'UNIQUE LEVEL '+level,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffe18c',stroke:'#291030',strokeThickness:4}).setOrigin(.5);
    const sub=this.add.text(0,19,u.name+' · READY!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffffff'}).setOrigin(.5);c.add([bg,title,sub]);
    c.setScale(.8);this.tweens.add({targets:c,scale:1,duration:260,ease:'Back.out'});this.tweens.add({targets:c,alpha:0,delay:2400,duration:350,onComplete:()=>c.destroy()});
    if(this.uniqueBtn){this.flashBtn(this.uniqueBtn);this.tweens.add({targets:this.uniqueTxt,scale:{from:1.4,to:1},duration:280,yoyo:true,repeat:2});}
    this.heroScreenEffect?.(1.2,.35);
  }
  refreshUniqueSkillUI(){ const u=this.uniqueInfo(); if(!this.uniqueTxt)return; this.uniqueTxt.setText(u.emoji);this.updateUniqueHint();this.refreshFlickerUI(); this.uniqueBtn.setFillStyle(u.color,0.24).setStrokeStyle(2.5,u.color,0.9); }
  uniqueCrescendo(color,lv,radius){
    const x=this.player.x,y=this.player.y,rings=lv,base=Math.max(110,radius*0.62);
    {const mix=(c,k)=>((((c>>16)&255)+(255-((c>>16)&255))*k)<<16)|((((c>>8)&255)+(255-((c>>8)&255))*k)<<8)|((c&255)+(255-(c&255))*k);   // v7.8.45 U1 art ขาว-ทอง ย้อมอ่อน ๆ ตามตัวละคร
     const art=this.heroFx?.('vfx_unique_crescendo',x,y,Math.max(300,base*(1.9+lv*.12)),{must:true,depth:9,tint:mix(color,.45)&0xffffff});
     if(art){if(lv>=4&&this.anims.exists('fx_bossnova'))this.spawnFxAnim('fx_bossnova',x,y,{scale:(radius*2)/ASSET_FX.fx_bossnova.fw,depth:8,alpha:0.7});this.screenFlash(color,0.05+lv*0.025,150+lv*45);this.screenShake(80+lv*45,0.002+lv*0.0015);return;}}
    for(let i=0;i<rings;i++)this.time.delayedCall(i*70,()=>{
      if(this.state!=='play'&&this.state!=='levelup')return;
      const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(i%2?0xfff0a6:color).setDepth(7+i).setScale(0.16).setAlpha(Math.max(0.34,0.82-i*0.11)));
      this.tweens.add({targets:ring,scale:(base*(1+i*0.18)*2)/256,rotation:(i%2?1:-1)*(0.35+lv*0.08),alpha:0,duration:360+i*90,ease:'Quad.out',onComplete:()=>ring.destroy()});
    });
    for(let i=0;i<lv*3;i++){const a=i/(lv*3)*Math.PI*2,p=this.camWorld(this.add.circle(x,y,2+lv,color,0.82).setDepth(9));this.tweens.add({targets:p,x:x+Math.cos(a)*base*(0.62+lv*0.10),y:y+Math.sin(a)*base*(0.62+lv*0.10),scale:0.2,alpha:0,duration:300+lv*75,onComplete:()=>p.destroy()});}
    if(lv>=4&&this.anims.exists('fx_bossnova'))this.spawnFxAnim('fx_bossnova',x,y,{scale:(radius*2)/ASSET_FX.fx_bossnova.fw,depth:8,alpha:0.86});
    this.screenFlash(color,0.07+lv*0.035,170+lv*55);this.screenShake(80+lv*45,0.002+lv*0.0015);
  }
  // v6.0.66 🎯 Momo สาย Sniper: Unique = กดค้างชาร์จ (หลอดเหนือหัว) · ลากนิ้วกำหนดทิศ · กล้องซูมออก · ปล่อย = กระสุนเส้นตรงทะลุทุกตัว ทิ้งรอยลมแหวก
  // v6.55.60 💥 Momo สาย Shotgun: Unique = Berry Blast · กดค้างเล็งกรวย (ลากกำหนดทิศ) ปล่อย = เม็ดกระจายใหญ่ ผลักกระเด็น · ใกล้ <120 ×2 · ถอยหลังจากแรงถีบ
  // v6.55.61 ❄️ Mint: สาย glacier = Glacier Bloom · สาย pierce = Frost Lance Charge · อื่น ๆ (barrage) = Mint Gale เดิม
  mintChargeKind(){ if(this.character!=='mint'||!this.basicAttack)return null; const pa=this.basicAttack.path; return pa==='glacier'?'bloom':pa==='pierce'?'lance':null; }
  mintLv(){ return (this.basicAttack&&this.basicAttack.lv)||{}; }
  /* v8.0.9 เจ้าของ: Twin Lance → ชาร์จ · Unique พุ่งหอกเก็บได้ 1+rank ครั้ง (สูงสุด 3) · ชาร์จเพิ่มทีละอันเท่าคูลดาวน์ปกติ ขณะที่ปุ่มพร้อมอยู่ */
  lanceChMax(){ return this.character==='mint'&&this.basicAttack?.path==='pierce'?1+Math.min(2,this.mintLv().l_twin|0):1; }
  tickLanceCharges(dt){ const mx=this.lanceChMax(); if(mx<=1){ this._lnBank=0; this._lnT=0; return; } if(this.uniqueCd>0||(this._lnBank|0)>=mx-1){ if((this._lnBank|0)>=mx-1)this._lnT=0; return; } this._lnT=(this._lnT||0)+dt; if(this._lnT>=this.uniqueCooldown(this.uniqueInfo())){ this._lnT=0; this._lnBank=(this._lnBank|0)+1; } }
  isBlastUnique(){ return this.character==='momo'&&this.basicAttack&&this.basicAttack.path==='shotgun'; }
  blastMods(){ const lv=(this.basicAttack&&this.basicAttack.lv)||{},w=lv.b_wide||0,r=lv.b_recoil||0;
    return {cone:(120+20*w)*Math.PI/180,pellets:11+2*w+(lv.buckshot||0),hop:80+40*r,iframe:0.35+0.3*r,double:(lv.b_double||0)>0}; }
  isSniperUnique(){ return this.character==='momo'&&this.basicAttack&&this.basicAttack.path==='sniper'; }
  snipeMods(){ const r=(this.basicAttack&&this.basicAttack.ranks)||{},lv=(this.basicAttack&&this.basicAttack.lv)||{},h=r.s_heavy||0,q=r.s_quick||0,b=r.s_bore||0,sp=lv.s_split||0;
    return {chargeMs:Math.max(400,(1100+h*350)*Math.pow(0.78,q)*(1-((this.player&&this.player._pt&&this.player._pt.chg)||0))),dmg:(1+0.45*h)*Math.max(0.5,1-0.12*q)*Math.max(0.6,1-0.1*sp),width:1+0.4*b,cd:1+0.15*b,split:sp}; }
  snipeCharge(){ const s=this._snipe; return s?Math.min(1,(performance.now()-s.t0)/(s.blast?450:s.kind==='bloom'?1000:s.kind==='lance'?400:this.snipeMods().chargeMs)):0; }
  startSnipeCharge(p){ if(this.state!=='play'||this.uniqueCd>0||this._snipe)return;const pl=this.player,a=(this.isBlastUnique()||this.mintChargeKind())?(this.nearestEnemy?this.nearestEnemy(500):null)||this.strongestEnemy(900):this.strongestEnemy(900);
    this._snipe={id:p.id,t0:performance.now(),sx:p.x,sy:p.y,ang:a?Math.atan2(a.y-pl.y,a.x-pl.x):Math.atan2(this.moveDir?this.moveDir.y:-1,this.moveDir?this.moveDir.x:0),dragged:false,full:false,blast:this.isBlastUnique(),kind:this.isYuzuCommand?.()?'yuzu':this.mintChargeKind(),
      g:this.camWorld(this.add.graphics().setDepth(90500))};
    if(this.character!=='momo'&&this._snipe.kind!=='yuzu'&&this.textures.exists('vfx_strawberry_charge'))this._snipe.aura=this.trackArtVfx(this.camWorld(this.add.image(pl.x,pl.y-24,'vfx_strawberry_charge').setDepth(90490).setDisplaySize(90,90).setAlpha(0.45)));
    if(this._snipe.blast)Sfx.bp?.('uq_shotgun_pump',.6,.2); else if(this._snipe.kind==='yuzu'){Sfx.bp?.('shared_unique_charge_start',.5,.2);} else if(!this._snipe.kind){ Sfx.bpLoopStart?.('uq_sniper_charge',.22); this.fxScopeStart?.(); } else {Sfx.eventLoopStart?.('event_mint_ice_charge',.22);Sfx.bp?.('shared_unique_charge_start',.5,.2)||(Sfx.beatFx&&Sfx.beatFx('hold'));} }   /* v6.82 Unique SFX */
  moveSnipeAim(p){ const s=this._snipe;if(!s)return; const dx=p.x-s.sx,dy=p.y-s.sy; s.dl=Math.hypot(dx,dy); if(s.dl>18){ s.ang=Math.atan2(dy,dx); s.dragged=true; } }
  snipeArt(s,key,x,y){let a=s.art;if(a&&(!a.active||a.texture.key!==key)){if(a.active)a.destroy();a=s.art=null;}if(!a&&this.bpAnim(key))a=s.art=this.heroFx(key,x,y,ASSET_FX[key].fw,{must:true,depth:90499});return a;}   // v7.8.45 S2/S3/M5/M6 aim art (null = code fallback)
  cancelSnipe(){ const s=this._snipe;if(!s)return; if(s.art?.active)s.art.destroy(); if(typeof Sfx!=='undefined'){Sfx.bpLoopStop?.('uq_sniper_charge');Sfx.eventLoopStop?.('event_mint_ice_charge');} if(this._scopeFx)this.fxScopeStop?.(); if(s.g)s.g.destroy();if(s.aura)s.aura.destroy(); this._snipe=null; }
  tickSnipe(){ const s=this._snipe;if(!s)return; if(this.state!=='play'){ this.cancelSnipe(); return; }
    if(s.kind==='yuzu'){this.yuzuCmdAim?.(s);return;}
    if(this._snipe.kind){Sfx.eventLoopStart?.('event_mint_ice_charge',.22,.85+.35*this.snipeCharge());}const c=this.snipeCharge(),pl=this.player,g=s.g,len=1500,ca=Math.cos(s.ang),sa=Math.sin(s.ang),t=(this.elapsed||0);
    if(!s.dragged){ const a=(s.blast||s.kind)?((this.nearestEnemy&&this.nearestEnemy(500))||this.strongestEnemy(900)):this.strongestEnemy(900); if(a)s.ang=Math.atan2(a.y-pl.y,a.x-pl.x); }
    if(s.kind==='bloom'){ const r=this.bloomRadius(c); if(c>=1&&!s.full){ s.full=true; Sfx.bp?.('shared_unique_charge_full',.55,.3)||(Sfx.beatFx&&Sfx.beatFx('cue')); }
      g.clear(); {const a=this.snipeArt?.(s,'bpx_mint_bloom_preview',pl.x,pl.y);if(a){a.setPosition(pl.x,pl.y).setScale(r*2/.9/256).setAlpha(.55+.4*c+(s.full?.1*Math.sin(t*18):0));if(s.aura&&s.aura.active)s.aura.setVisible(false);return;}}
      g.fillStyle(0x9fe8ff,0.1+0.12*c); g.fillCircle(pl.x,pl.y,r); g.lineStyle(3,s.full?0xffffff:0x9fe8ff,0.6+0.3*c+(s.full?0.2*Math.sin(t*18):0)); g.strokeCircle(pl.x,pl.y,r);
      for(let k=0;k<6;k++){ const a=t*0.8+k*TAU/6; g.fillStyle(0xe6fbff,0.7); g.fillCircle(pl.x+Math.cos(a)*r,pl.y+Math.sin(a)*r,3+c*2); }
      if(s.aura&&s.aura.active)s.aura.setVisible(false); return; }
    if(s.kind==='lance'){ const L=this.lanceLen(),ca=Math.cos(s.ang),sa=Math.sin(s.ang); if(c>=1&&!s.full){ s.full=true; Sfx.bp?.('shared_unique_charge_full',.55,.3)||(Sfx.beatFx&&Sfx.beatFx('cue')); }
      g.clear(); if((typeof CODE_VFX!=='undefined'&&CODE_VFX.aim)){ this.codeAimLine(g,pl.x,pl.y,s.ang,L,c,s.full,0x9fe8ff,t); if(s.aura&&s.aura.active)s.aura.setVisible(false); return; } {const a=this.snipeArt?.(s,'bpx_mint_aim_line',pl.x,pl.y);if(a){a.setPosition(pl.x,pl.y).setRotation(s.ang).setScale(L/512,(26+c*14)/32).setAlpha(.6+.4*c);if(s.full)a.setTint(0xffffff);g.fillStyle(0xffffff,0.8); g.fillCircle(pl.x+ca*L,pl.y+sa*L,6+c*4);if(s.aura&&s.aura.active)s.aura.setVisible(false);return;}}
      g.lineStyle(30,0x9fe8ff,0.12+0.12*c); g.lineBetween(pl.x,pl.y,pl.x+ca*L,pl.y+sa*L); g.lineStyle(3,s.full?0xffffff:0x9fe8ff,0.7); g.lineBetween(pl.x,pl.y,pl.x+ca*L,pl.y+sa*L);
      g.fillStyle(0xffffff,0.8); g.fillCircle(pl.x+ca*L,pl.y+sa*L,6+c*4); if(s.aura&&s.aura.active)s.aura.setVisible(false); return; }
    if(s.blast){ const bm=this.blastMods(),R=300,h=bm.cone/2; if(c>=1&&!s.full){ s.full=true; Sfx.bp?.('uq_shotgun_full',.55,.3)||Sfx.bp?.('shared_unique_charge_full',.55,.3)||(Sfx.beatFx&&Sfx.beatFx('cue')); }
      g.clear(); {const a=this.snipeArt?.(s,'bpx_momo_aim_cone',pl.x,pl.y);if(a){a.setPosition(pl.x,pl.y).setRotation(s.ang).setScale(R/290,R*Math.sin(h)/124).setAlpha(.55+.4*c);if(s.full)a.setTint(0xffe9a8);else a.clearTint();if(s.aura&&s.aura.active)s.aura.setPosition(pl.x,pl.y-24).setAlpha(0.4+c*0.5).setRotation(t*1.2);return;}}
      g.fillStyle(s.full?0xffd166:0xff76a8,0.12+0.14*c); g.slice(pl.x,pl.y,R,s.ang-h,s.ang+h,false); g.fillPath();
      g.lineStyle(2,s.full?0xffd166:0xff9ec4,0.5+0.4*c); g.beginPath(); g.arc(pl.x,pl.y,R,s.ang-h,s.ang+h); g.strokePath();
      g.lineStyle(2,0xffffff,0.35); g.beginPath(); g.arc(pl.x,pl.y,120,s.ang-h,s.ang+h); g.strokePath();
      g.lineBetween(pl.x,pl.y,pl.x+Math.cos(s.ang-h)*R,pl.y+Math.sin(s.ang-h)*R); g.lineBetween(pl.x,pl.y,pl.x+Math.cos(s.ang+h)*R,pl.y+Math.sin(s.ang+h)*R);
      if(s.aura&&s.aura.active)s.aura.setPosition(pl.x,pl.y-24).setAlpha(0.4+c*0.5).setRotation(t*1.2); return; }
    if(s.aura&&s.aura.active)s.aura.setPosition(pl.x,pl.y-24).setDisplaySize(90+c*24,90+c*24).setAlpha(0.4+c*0.5).setRotation(t*1.2);
    if(c>=1&&!s.full){ s.full=true; Sfx.bp?.('uq_sniper_full',.55,.3)||(Sfx.beatFx&&Sfx.beatFx('cue')); this.burst(pl.x,pl.y-58,0xffd166); }
    g.clear();
    if((typeof CODE_VFX!=='undefined'&&CODE_VFX.aim)){ this.codeAimLine(g,pl.x+ca*30,pl.y+sa*30,s.ang,len-30,c,s.full,s.full?0xffd166:0xff9ec4,t); } else {const a=this.snipeArt?.(s,'bpx_momo_aim_line',pl.x+ca*30,pl.y+sa*30);if(a){a.setPosition(pl.x+ca*30,pl.y+sa*30).setRotation(s.ang).setScale((len-30)/512,(18+c*16)/32).setAlpha(.5+.5*c+(s.full?.15*Math.sin(t*18):0));if(s.full)a.setTint(0xffe08a);else a.clearTint();}
    else{ g.lineStyle(2+c*3,s.full?0xffd166:0xff9ec4,0.35+0.35*c+(s.full?0.2*Math.sin(t*18):0)); g.lineBetween(pl.x+ca*30,pl.y+sa*30,pl.x+ca*len,pl.y+sa*len);
    for(let d=90;d<len;d+=110){ g.fillStyle(0xffffff,0.25+0.4*c); g.fillCircle(pl.x+ca*d,pl.y+sa*d,2+c*2); } }}
    const bw=86,bx=pl.x-bw/2,by=pl.y-122; g.fillStyle(0x1a1026,0.9); g.fillRoundedRect(bx-3,by-3,bw+6,16,7); g.lineStyle(2,0xffffff,0.8); g.strokeRoundedRect(bx-3,by-3,bw+6,16,7);
    g.fillStyle(s.full?0xffd166:0xff76a8,1); g.fillRoundedRect(bx,by,Math.max(4,bw*c),10,5); }
  /* v8.1.156 CODE_VS_ART รอบ 2 ข้อ 3: เส้นเล็งโค้ด · ยาวตรงระยะจริง · แถบเรืองกว้างขึ้นตามชาร์จ · ขีดประวิ่งไปข้างหน้า · หัวลูกศรปลายทาง · ชาร์จเต็ม = ขาว/ทองกะพริบ */
  codeAimLine(g,x0,y0,ang,len,c,full,col,t){ if(!g)return 0; const ca=Math.cos(ang),sa=Math.sin(ang),x1=x0+ca*len,y1=y0+sa*len,pulse=full?.5+.5*Math.sin(t*18):0,cc=full?0xffffff:col;
    g.lineStyle(14+c*18,col,.08+.10*c+.06*pulse).lineBetween(x0,y0,x1,y1); g.lineStyle(2.5+c*1.5,cc,.45+.4*c).lineBetween(x0,y0,x1,y1);
    const seg=22,gap=26,off=((t||0)*(160+c*220))%(seg+gap); let n=0;
    for(let d=off;d<len-18;d+=seg+gap){ const e=Math.min(len-18,d+seg); g.lineStyle(2,0xffffff,.35+.45*c).lineBetween(x0+ca*d,y0+sa*d,x0+ca*e,y0+sa*e); n++; }
    const hx=x1,hy=y1,w=8+c*6,bx=hx-ca*(14+c*6),by=hy-sa*(14+c*6); g.fillStyle(cc,.7+.3*c).fillTriangle(hx,hy,bx-sa*w,by+ca*w,bx+sa*w,by-ca*w);
    return n; }
  releaseSnipe(){ this.heroScreenEffect?.(1.2); const s=this._snipe;if(!s)return; const c=this.snipeCharge(),ang=s.ang; this.cancelSnipe(); if(this.state!=='play'||this.uniqueCd>0)return;
    if(s.kind==='yuzu'){this._yzCmdPt=this.yuzuCmdPoint?.(s)||null;return this.useCharacterSkill(true);}
    if(s.blast)return this.releaseBerryBlast(ang,c);
    if(s.kind==='bloom')return this.releaseGlacierBloom(c);
    if(s.kind==='lance')return this.releaseFrostLance(ang,c);
    const u=this.uniqueInfo(),ul=this.uniqueLevel||1,up=this.uniquePower(),dm=this.player.dmgMul||1,pl=this.player;
    const sm=this.snipeMods(); this.uniqueCd=this.uniqueCooldown(u)*sm.cd;this.flashBtn(this.uniqueBtn);this.poseAttack(420);this._coachUnique=(this._coachUnique||0)+1;this.uniqueCastFx?.();this._mxSrc='unique';this.fireRecipes('unique');
    const basic=this.basicAttack,epoch=this._artEpoch||0;
    const mul=0.45+1.55*c, dmg=(60+ul*22)*1.2*dm*up*mul*(c>=1?1.25:1)*sm.dmg*(basic?.evolved&&c>=1?1.4:1), w=(26+c*26)*sm.width, len=1500; let hits=0;
    const beam=(a,d,bw)=>{ const ca=Math.cos(a),sa=Math.sin(a),x0=pl.x+ca*24,y0=pl.y+sa*24;
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-x0,ry=e.y-y0,along=rx*ca+ry*sa; if(along<0||along>len)return; const perp=Math.abs(-rx*sa+ry*ca);
        if(perp<bw+(e.body?e.body.halfWidth:18)){ hits++; this.damage(e,e.isBoss||e.isMini?d*1.2:d,e.x,e.y); } });
      this.drawChargedSeed(x0,y0,a,len,bw);
      this.drawWindTrail(x0,y0,a,len,bw,c); };
    beam(ang,dmg,w); if(this.player._pt&&this.player._pt.railgun&&c>=1)this.artDelay(400,()=>{if(this.state==='play'&&this.basicAttack===basic&&(this._artEpoch||0)===epoch)beam(ang,dmg*0.7,w*0.8);Sfx.bp?.('uq_sniper_fire',.35,.15,.9);});
    for(let i=1;i<=sm.split;i++){ beam(ang+0.14*i,dmg*0.55,w*0.6); beam(ang-0.14*i,dmg*0.55,w*0.6); }
    this.screenShake(160+c*160,0.006+c*0.008); if(c>=1&&this.hitStop)this.hitStop(60);
    this.fxScopeStop?.(true);
    if(!Sfx.bp?.('uq_sniper_fire',.5+.3*Math.min(1,c),.15,c>=1?1:.92)){ if(Sfx.boom)Sfx.boom(); if(Sfx.beam)Sfx.beam(); } else this.artDelay(260,()=>{ if(this.state==='play')Sfx.bp?.('uq_sniper_bolt',.3,.5); });
    this.uqMutHook?.('snipe',{c,hits});if(c>=1)this.showBanner('🎯 Perfect Shot','Full charge · '+hits+' hit'+(hits===1?'':'s'),900); }
  bloomRadius(c){ return (110+150*c)*(1+0.25*(this.mintLv().m_grow||0)); }
  lanceLen(){ return 350*(1+0.3*(this.mintLv().l_far||0)); }
  mintUniqueStart(){ const u=this.uniqueInfo(); this.uniqueCd=this.uniqueCooldown(u);this.flashBtn(this.uniqueBtn);this.poseAttack(420);this._coachUnique=(this._coachUnique||0)+1;this.uniqueCastFx?.();this._mxSrc='unique';this.fireRecipes('unique');
    return {ul:this.uniqueLevel||1,unit:(this.player.dmgMul||1)*this.uniquePower()}; }
  releaseGlacierBloom(c){
    this.heroScreenEffect?.(1.2); const {ul,unit}=this.mintUniqueStart(),pl=this.player,r=this.bloomRadius(c),hit=(30+ul*10)*unit*1.1;this.bpPose?.('char_mint_bloom_motion823',.5);
    const storm={x:pl.x,y:pl.y,r,hit,t:0,pulses:0,basic:this.basicAttack,epoch:this._artEpoch||0,freeze:1+0.6*(this.mintLv().m_hold||0),frozen:new Map(),deepChill:false};
    storm.g=this.trackArtVfx(this.camWorld(this.add.graphics().setDepth(6)));
    // One stationary field; gameplay time advances only in play, so card/pause screens cannot consume it.
    for(const old of this._glacierStorms||[]){if(old.g?.active)old.g.destroy();if(old.art?.active)old.art.destroy();}
    this._glacierStorms=[storm];
    const stormKey=this.mintOutlineKey?.('fx_mint_snowstorm')||'fx_mint_snowstorm';storm.frames=stormKey==='bpx_mint819_snowstorm'?6:8;
    if(this.realTex?.(stormKey))storm.art=this.trackArtVfx(this.camWorld(this.add.sprite(storm.x,storm.y,stormKey,0).setOrigin(.5,.78).setDepth(6).setDisplaySize(r*(storm.frames===6?2.5:3),r*(storm.frames===6?2.5:3))));
    if(!storm.art&&this.textures.exists('vfx_glacier_bloom'))this.trackArtVfx(this.spawnFxAnim('vfx_glacier_bloom',storm.x,storm.y,{scale:r*2/384,depth:6,normal:true}));   // v8.0.86 เจ้าของ: มีภาพพายุหิมะ = ไม่มีวงบานที่พื้น
    this.glacierSnowPulse(storm);
    this.uqMutHook?.('bloom',{cx:storm.x,cy:storm.y,r,n:storm.frozen.size,storm});
    this.drawGlacierSnow(storm);
    Sfx.bp?.(c>=1?'uq_mint_bloom_full':'mint_glacier_bloom',.65,.3);
    this.screenShake(100,.003); this.showBanner('❄️ Glacier Bloom','4s snowstorm · snow knocks back and can freeze',1000);
  }
  glacierSnowPulse(storm){
    if(this.state!=='play'||storm.epoch!==(this._artEpoch||0)||this.basicAttack!==storm.basic)return;
    const src=this._mxSrc,sg=this._sgHit;this._mxSrc='unique';this._sgHit=true;
    try{this.enemies.children.iterate(e=>{
      if(this.state!=='play'||storm.epoch!==(this._artEpoch||0)||!e?.active||e.hp<=0||e._phaseGateLocked||(e._phaseInvuln||0)>0||this.dist(e.x,e.y,storm.x,storm.y)>storm.r)return;
      const hp=e.hp,life=e._glacierLifeToken,power=storm.hit*.45*(1+.2*(storm.basic.lv.m_shard||0));
      this.damage(e,power,e.x,e.y);
      if(!e.active||e.hp<=0||e._glacierLifeToken!==life||e._phaseGateLocked||(e._phaseInvuln||0)>0)return;
      const big=e.isBoss||e.isMini||e.freezeImmune;
      if(big){e._glacierBrittleUntil=this.time.now+1500;}
      else{
        const a=Math.atan2(e.y-storm.y,e.x-storm.x),force=e.isElite?85:150;
        e.knock=Math.max(e.knock||0,.18);e.setVelocity(Math.cos(a)*force,Math.sin(a)*force);
        // A hit worth at least 8% of max HP guarantees freeze; weaker hits roll 25% (+10% Permafrost).
        const dealt=Math.max(0,hp-e.hp),strong=dealt>=Math.max(1,e.maxhp*.08);
        if(strong||Math.random()<(storm.deepChill?.35:.25)){
          e.frozen=Math.max(e.frozen||0,storm.freeze);e.setTint(COLORS.ice);
          if(storm.frozen.get(e)!==life){storm.frozen.set(e,life);this.applyFrostBurn?.(e,storm.hit);}
        }
      }
      if(storm.deepChill)this.mintChill(e,.6);
    });}finally{this._mxSrc=src;this._sgHit=sg;}
    storm.pulses++;
  }
  drawGlacierSnow(storm){
    const g=storm.g;if(!g?.active)return;const {x,y,r,t}=storm,q=typeof Save==='undefined'?1:(Save.data.settings?.vfx??1);
    g.clear();const art=storm.art?.active&&q!==0;if(!art){g.fillStyle(0x84cff5,.10).fillCircle(x,y,r);g.lineStyle(2,0xd1f8ff,.55).strokeCircle(x,y,r);}   // v8.0.86 เจ้าของ: เหลือแค่ภาพพายุหิมะ (วงที่พื้นเฉพาะตอนไม่มีภาพ)
    if(storm.art?.active){storm.art.setVisible(q!==0).setFrame(this.hubMotionAllowed?.()===false?2:Math.floor(t*12)%(storm.frames||8)).setAlpha(Math.min(.62,(4-t)*3*.62));if(q!==0)return;}
    // Bounded procedural snow: a few streaks even on Low keep the damaging area readable.
    const n=q===0?8:q===1?18:28;
    for(let i=0;i<n;i++){
      const u=((i*.61803398875+t*.15)%1)*2-1,v=((i*.38196601125+t*.9)%1)*2-1;
      const dx=u*r*.9,dy=v*Math.sqrt(Math.max(0,r*r-dx*dx))*.9,px=x+dx,py=y+dy;
      g.lineStyle(q===0?1.5:2,0xe4fbff,.65).lineBetween(px+6,py-18,px,py);
      g.fillStyle(0xffffff,.8).fillCircle(px,py,2+(i%3));
    }
  }
  tickGlacierSnow(dt){
    if(this.state!=='play')return;const storms=this._glacierStorms||[];
    for(let i=storms.length-1;i>=0;i--){const s=storms[i];
      if(s.epoch!==(this._artEpoch||0)||s.basic!==this.basicAttack||!this.player?.active){if(s.g?.active)s.g.destroy();if(s.art?.active)s.art.destroy();storms.splice(i,1);continue;}
      s.t+=dt;
      // Exactly eight pulses, including release, at 0 / .5 / ... / 3.5s. New arrivals are checked each pulse.
      while(this.state==='play'&&s.epoch===(this._artEpoch||0)&&s.pulses<8&&s.t+1e-8>=s.pulses*.5)this.glacierSnowPulse(s);
      if(s.t>=4){if(s.frames===6)this.heroFx?.('bpx_mint819_bloom',s.x,s.y,s.r*2,{alpha:.65,depth:6});if(s.g?.active)s.g.destroy();if(s.art?.active)s.art.destroy();storms.splice(i,1);continue;}
      this.drawGlacierSnow(s);
    }
  }
  releaseFrostLance(ang,c){ this.heroScreenEffect?.(1.2); this.uqMutHook?.('lance',{ang}); const {ul,unit}=this.mintUniqueStart(),pl=this.player,lv=this.mintLv(),L=this.lanceLen(),ca=Math.cos(ang),sa=Math.sin(ang),x0=pl.x,y0=pl.y,dmg=(40+ul*15)*unit*(0.7+0.3*c);
    if((this.lanceChMax?.()||1)>1&&(this._lnBank|0)>0){ this._lnBank--; this.uniqueCd=0.35; }   // v8.0.9 Lance Charges: ใช้ชาร์จที่เก็บไว้ = กดได้อีกเกือบทันที
    let hits=0; this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-x0,ry=e.y-y0,al=rx*ca+ry*sa; if(al<-20||al>L+20)return; if(Math.abs(-rx*sa+ry*ca)>34+(e.body?e.body.halfWidth:18))return; hits++; this._sgHit=true; try{ this.damage(e,dmg*(e.isBoss||e.isMini?1.8:1),e.x,e.y); } finally { this._sgHit=false; } if(e.active)this.mintChill(e,0.8); if(e.active&&this.basicAttack?.path==='pierce')this.applyImpale(e,dmg*(e.isBoss||e.isMini?1.8:1),c>=0.99); });
    pl.iframe=Math.max(pl.iframe||0,0.45); this.poseAttack(420,'char_mint_gale');
    const dash={x:x0,y:y0,carry:0,basic:this.basicAttack,epoch:this._artEpoch||0,power:dmg*.32,emitted:0,player:pl,ang,dmg,burstRank:Math.min(2,Math.max(0,lv.l_burst||0)),done:false};
    this._mintDashFinish=null;
    this._mintDashTween?.stop();
    this._mintDashTween=this.tweens.add({targets:pl,x:x0+ca*L,y:y0+sa*L,duration:170,ease:'Quad.out',onUpdate:()=>{
      if((this._artEpoch||0)!==dash.epoch||this.basicAttack!==dash.basic){this._mintDashTween?.stop();return;}
      if(this.state!=='play'){this._mintDashTween?.pause();return;}if(pl.body)pl.body.reset(pl.x,pl.y);this.emitLanceDistanceShards(dash,pl.x,pl.y);
    },onComplete:()=>{this._mintDashTween=null;dash.endX=pl.x;dash.endY=pl.y;this.finishFrostLance(dash);}});
    let g=this.mintOutlineTrail?.(x0,y0,ang,L);
    if(!g&&this.textures.exists('vfx_frost_lance_trail'))g=this.trackArtVfx(this.camWorld(this.add.image(x0,y0,'vfx_frost_lance_trail').setOrigin(0,0.5).setRotation(ang).setDepth(5).setBlendMode(Phaser.BlendModes.NORMAL).setDisplaySize(L,68)));
    else if(!g){g=this.trackArtVfx(this.camWorld(this.add.graphics().setDepth(5))); g.lineStyle(36,0xbdf0ff,0.35); g.lineBetween(x0,y0,x0+ca*L,y0+sa*L); g.lineStyle(10,0xffffff,0.6); g.lineBetween(x0,y0,x0+ca*L,y0+sa*L);}
    (this._iceTrails=this._iceTrails||[]).push({x0,y0,ca,sa,L,t:3,tick:0,g,dmg:dmg*0.12});
    this.screenShake(110,0.005); (this.fxLanceScreen?.(ang),Sfx.bp?.('uq_mint_lance_release',.6,.2))||(Sfx.dash&&Sfx.dash()); this.showBanner('🗡️ Frost Lance',hits+' pierced · homing shard every 70px',700); }
  finishFrostLance(dash){
    if(!dash||dash.done){if(this._mintDashFinish===dash)this._mintDashFinish=null;return;}
    if((this._artEpoch||0)!==dash.epoch||this.basicAttack!==dash.basic||this.player!==dash.player||!dash.player?.active||this.state==='menu'||this.state==='dead'){
      dash.done=true;if(this._mintDashFinish===dash)this._mintDashFinish=null;return;
    }
    // A tween can reach its last frame just as a card/pause overlay opens. Complete once play resumes.
    if(this.state!=='play'){this._mintDashFinish=dash;return;}
    if(!dash.finisherDone){dash.finisherDone=true;this.emitLanceDistanceShards(dash,dash.endX,dash.endY);this.frostLanceFinisher?.(dash.player,dash.ang,dash.dmg);}
    if(dash.burstRank&&this.state!=='play'){
      if((this._artEpoch||0)===dash.epoch&&this.basicAttack===dash.basic&&this.state!=='menu'&&this.state!=='dead')this._mintDashFinish=dash;
      else{dash.done=true;if(this._mintDashFinish===dash)this._mintDashFinish=null;}
      return;
    }
    dash.done=true;this._mintDashFinish=null;
    if(dash.burstRank)this.frostLanceBlast(dash);
  }
  frostLanceBlast(dash){
    if((this._artEpoch||0)!==dash.epoch||this.basicAttack!==dash.basic||!dash.player?.active||this.state==='menu'||this.state==='dead')return;
    const x=dash.endX,y=dash.endY,r=110,src=this._mxSrc,sg=this._sgHit;
    // Dedicated painted ice explosion, including on Low VFX and when no enemy is at the endpoint.
    if(!this.heroFx?.(this.mintOutlineKey?.('fx_mint_shatter')||'fx_mint_shatter',x,y,r*2,{must:true,depth:(dash.player.depth||7)+1}))this.vfxHitRing?.(x,y,0x9fe8ff,true);
    Sfx.bp?.('mint_glacier_shatter',.55,.12)||(Sfx.boom&&Sfx.boom());
    this._mxSrc='unique';this._sgHit=true;
    try{this.enemies.children.iterate(e=>{
      if((this._artEpoch||0)!==dash.epoch||this.basicAttack!==dash.basic||!e?.active||e.hp<=0||e._phaseGateLocked||(e._phaseInvuln||0)>0||this.dist(e.x,e.y,x,y)>=r)return;
      this.damage(e,dash.dmg*(1+.5*dash.burstRank)*.6,e.x,e.y);
    });}finally{this._mxSrc=src;this._sgHit=sg;}
  }
  lanceShardTarget(x,y,range=760){
    let target=null,bd=range*range;
    this.enemies.children.iterate(e=>{if(!e?.active||e.hp<=0||e._phaseGateLocked||(e._phaseInvuln||0)>0)return;const d=(e.x-x)**2+(e.y-y)**2;if(d<bd){bd=d;target=e;}});return target;
  }
  emitLanceDistanceShards(dash,x,y){
    if(this.state!=='play'||dash.epoch!==(this._artEpoch||0)||dash.basic!==this.basicAttack||dash.basic?.path!=='pierce')return;
    const dx=x-dash.x,dy=y-dash.y,d=Math.hypot(dx,dy);if(!d)return;
    const spacing=70;let next=spacing-dash.carry;
    for(;next<=d+1e-8&&dash.emitted<24;next+=spacing){
      const sx=dash.x+dx*next/d,sy=dash.y+dy*next/d;dash.emitted++;
      const t=this.lanceShardTarget(sx,sy);if(!t)continue;
      const b=this.mintBullet(sx,sy,0xc8f5ff,.18);if(!b)continue;
      const angle=Math.atan2(t.y-sy,t.x-sx);
      b.setTexture('proj_sprinkle').setTint(0xc8f5ff);
      if(this.mintOutlineProjectile?.(b,'shard',52)){}
      else if(this.attachProjectileAnim?.(b,'fx_mint_dash_shard',128))b._chargeFx.setDisplaySize(64,64);
      else this.attachProjectileArt?.(b,'proj_mint_shard',26,.67,.5);
      b.dmg=dash.power;b.life=1.6;b.faceVel=true;b.homing=650;b.homeSpeed=600;b.homeRange=760;b.mintDashShard=true;
      b.iceNeedle={freeze:.6,frozenBonus:1.2,shatter:false,dmg:b.dmg,lvl:1};b.pierceLeft=1;
      this.physics.velocityFromRotation(angle,600,b.body.velocity);
    }
    dash.carry=(dash.carry+d)%spacing;dash.x=x;dash.y=y;
  }
  // v7.8.58 เจ้าของ: Frost Lance Charge จบการพุ่ง → ฟาด 1 ครั้งใส่ศัตรูใกล้สุด (ระยะ 160) + ดูดเลือด 30% ของดาเมจ (สูงสุด 8% HP สูงสุด ต่อครั้ง)
  frostLanceFinisher(pl,ang,dmg){ if(this.state!=='play'||!pl?.active)return; let tg=null,bd=160; this.enemies.children.iterate(e=>{ if(!e||!e.active||e._phaseGateLocked||(e._phaseInvuln||0)>0)return; const d=this.dist(e.x,e.y,pl.x,pl.y); if(d<bd){bd=d;tg=e;} }); if(!tg)return;
    const a=Math.atan2(tg.y-pl.y,tg.x-pl.x),hit=dmg*1.4*(tg.isBoss||tg.isMini?1.8:1),hp0=tg.hp; this._sgHit=true; try{ this.damage(tg,hit,tg.x,tg.y); } finally { this._sgHit=false; }
    const dealt=Math.max(0,hp0-Math.max(0,tg.hp||0))||hit,heal=Math.min(pl.maxhp*.08,dealt*.3); if(heal>=1&&pl.hp>0){ pl.hp=Math.min(pl.maxhp,pl.hp+heal); this.floatText?.(pl.x,pl.y-46,'+'+Math.round(heal),0x7dffa8); }
    if(!this.heroFx?.(this.mintOutlineKey?.('bpx_mint_needle_hit')||'bpx_mint_needle_hit',tg.x,tg.y,110,{must:true,rot:a})&&this.textures.exists('fx_slash'))this.spawnFxAnim('fx_slash',pl.x,pl.y,{rotation:a,scaleX:bd/352+.3,scaleY:.35,anchor:'left',depth:8,normal:true,force:true});
    this.vfxHitRing?.(tg.x,tg.y,0x9fe8ff,true); this.screenShake(90,0.004); Sfx.bp?.('mint_glacier_shatter',.45,.2)||(Sfx.boom&&Sfx.boom()); }
  tickIceTrails(dt){ const T=this._iceTrails; if(!T||!T.length)return; for(let i=T.length-1;i>=0;i--){ const tr=T[i]; tr.t-=dt; if(!tr.g?.active){T.splice(i,1);continue;} this.mintOutlineFrame?.(tr.g,dt);tr.g.setAlpha(Math.min(1,tr.t)); if(tr.t<=0||this.state==='menu'){ tr.g.destroy(); T.splice(i,1); continue; }
      tr.tick-=dt; if(tr.tick>0||this.state!=='play')continue; tr.tick=0.4;
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-tr.x0,ry=e.y-tr.y0,al=rx*tr.ca+ry*tr.sa; if(al<0||al>tr.L||Math.abs(-rx*tr.sa+ry*tr.ca)>30)return; this.damage(e,tr.dmg,e.x,e.y); if(e.active&&e.body)e.setVelocity(e.body.velocity.x*0.5,e.body.velocity.y*0.5); }); } }
  releaseBerryBlast(ang,c){ this.heroScreenEffect?.(1.2); const u=this.uniqueInfo(),ul=this.uniqueLevel||1,up=this.uniquePower(),dm=this.player.dmgMul||1,pl=this.player,bm=this.blastMods(),basic=this.basicAttack;
    this.uniqueCd=this.uniqueCooldown(u);this.uqMutHook?.('blast',{ang});this.flashBtn(this.uniqueBtn);this.poseAttack(380);this._coachUnique=(this._coachUnique||0)+1;this.uniqueCastFx?.();this._mxSrc='unique';this.fireRecipes('unique');
    const pb=1+0.15*(((this.basicAttack&&this.basicAttack.lv)||{}).pointblank||0);
    const fire=(mul)=>{ if(this.state!=='play')return; try{ (Sfx.bp?.('uq_sniper_fire',.8*Math.max(.7,mul),.1,.85)&&Sfx.uqReady?.('uq_sniper_fire'))||(Sfx.boom&&Sfx.boom()); }catch(e){}   /* v6.82.2 ใช้เสียงสไนเปอร์ (เจ้าของเลือก) เล่นก่อน VFX */
      const R=300,h=bm.cone/2,unit=(14+ul*5)*dm*up*(0.7+0.3*c)*mul; let hits=0;
      this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy); if(d>R+(e.body?e.body.halfWidth:18))return;
        let da=Math.atan2(dy,dx)-ang; while(da>Math.PI)da-=Math.PI*2; while(da<-Math.PI)da+=Math.PI*2; if(Math.abs(da)>h&&d>40)return;
        const n=Math.max(1,Math.round(bm.pellets*(1-d/(R*1.6))*0.5)); hits++;
        this._sgHit=true; try{ this.damage(e,unit*n*(d<120?2*pb:1)*(e.isBoss||e.isMini?2:1),e.x,e.y); } finally { this._sgHit=false; }
        if(e.active&&!e.isBoss&&!e.isMini&&e.body){ const k=(d<120?520:320)/Math.max(1,d); e.body.velocity.x+=dx*k; e.body.velocity.y+=dy*k; } });
      if(this.realTex?.('bpx_momo810_blast')&&this.heroFx?.('bpx_momo810_blast',pl.x,pl.y,R*1.33,{h:Math.min(600,2*R*Math.sin(Math.min(Math.PI/2,h))),rot:ang,depth:90450,life:.27,fade:0})){}
      else if(this.textures.exists('vfx_berry_blast'))this.trackArtVfx(this.spawnFxAnim('vfx_berry_blast',pl.x,pl.y,{scaleX:R/384,scaleY:Math.min(600,2*R*Math.sin(Math.min(Math.PI/2,h)))/256,rotation:ang,depth:90450,normal:true}));
      else for(let i=0;i<bm.pellets;i++){ const a=ang-h+bm.cone*(i+0.5)/bm.pellets+(Math.random()-0.5)*0.08,len=200+Math.random()*100;
        const dot=this.camWorld(this.add.circle(pl.x,pl.y,4,[0xff5c8a,0xffd166,0xffffff][i%3]).setDepth(90450));
        this.tweens.add({targets:dot,x:pl.x+Math.cos(a)*len,y:pl.y+Math.sin(a)*len,alpha:0,duration:220,ease:'Quad.out',onComplete:()=>dot.destroy()}); }
      this.burst(pl.x+Math.cos(ang)*40,pl.y+Math.sin(ang)*40,0xff76a8); this.screenShake(140,0.007);
      return hits; };
    const hits=fire(1); if(c>=1)this.fxShotgunScreen?.(ang);
    // แรงถีบ: ถอยหลังจากทิศยิง + อมตะสั้น ๆ
    const bx=pl.x-Math.cos(ang)*bm.hop,by=pl.y-Math.sin(ang)*bm.hop; pl.iframe=Math.max(pl.iframe||0,bm.iframe);
    this.tweens.add({targets:pl,x:bx,y:by,duration:160,ease:'Quad.out',onUpdate:()=>{ if(pl.body)pl.body.reset(pl.x,pl.y); }});
    if(bm.double)this.artDelay(350,()=>{if(this.state==='play'&&this.player===pl&&this.basicAttack===basic)fire(0.6);});
    if(c>=1&&this.hitStop)this.hitStop(50);
    this.showBanner('💥 Berry Blast',hits+' hit'+(hits===1?'':'s'),800); }
  drawWindTrail(x0,y0,ang,len,w,c){ const ca=Math.cos(ang),sa=Math.sin(ang),nx=-sa,ny=ca,x1=x0+ca*len,y1=y0+sa*len;
    if(this.textures.exists('vfx_strawberry_wind')){
      const ribbon=this.trackArtVfx(this.camWorld(this.add.image(x0,y0,'vfx_strawberry_wind').setOrigin(0,0.5).setRotation(ang).setDepth(90400).setDisplaySize(len,w*2.4).setAlpha(0.65+c*0.2)));
      this.tweens.add({targets:ribbon,alpha:0,duration:520+c*380,ease:'Cubic.in',onComplete:()=>ribbon.destroy()});return;
    }
    const core=this.camWorld(this.add.graphics().setDepth(90400));
    core.lineStyle(w*1.6,0xffe6f0,0.22); core.lineBetween(x0,y0,x1,y1);
    core.lineStyle(w*0.6,0xffffff,0.85); core.lineBetween(x0,y0,x1,y1);
    core.lineStyle(3,c>=1?0xffd166:0xff76a8,1); core.lineBetween(x0,y0,x1,y1);
    this.tweens.add({targets:core,alpha:0,duration:520+c*380,ease:'Cubic.in',onComplete:()=>core.destroy()});
    // ลมแหวก: เส้นโค้งสองข้างพัดออกจากแนวกระสุน
    const n=Math.round(8+c*8);
    for(let i=0;i<n;i++){ const d=60+Math.random()*(len-120),side=i%2?1:-1,off=w*0.8+Math.random()*w,px=x0+ca*d+nx*off*side,py=y0+sa*d+ny*off*side;
      const gw=this.camWorld(this.add.graphics().setDepth(90390)),L=40+Math.random()*70;
      gw.lineStyle(2,0xffffff,0.75); gw.beginPath(); gw.moveTo(px,py);
      for(let k=1;k<=6;k++){ const tt=k/6; gw.lineTo(px+ca*L*tt+nx*side*Math.sin(tt*Math.PI)*12,py+sa*L*tt+ny*side*Math.sin(tt*Math.PI)*12); } gw.strokePath();
      this.tweens.add({targets:gw,x:nx*side*(26+c*30),y:ny*side*(26+c*30),alpha:0,duration:480+Math.random()*320,ease:'Cubic.out',onComplete:()=>gw.destroy()}); }
    this.burst&&this.burst(x0,y0,0xffffff); }
  /* v8.1.152 เจ้าของ (ไอเดีย acting จาก pixelfx): ท่า Unique แบบกดปุ๊บออกปั๊บ → ย่อตัวง้าง + แสงรวมเข้าตัว 0.17 วิ แล้วค่อยปล่อย (ยืดตัว + จอสั่นเบา) · ท่าที่กดค้างชาร์จอยู่แล้ว (ปล่อยจากการเล็ง) ไม่ต้องง้างซ้ำ */
  useCharacterSkill(noWind){
    if(this.isSesRune?.())return this.sesRuneCast();
    if(this.state!=='play'||this.uniqueCd>0||this._uqWind||(this.character==='cocoa'&&this._cocoaUniqueT>0))return;
    if(this.character==='cocoa'&&this.basicAttack?.path==='dashboxer'&&this._dpCh!=null&&this._dpCh<1){ this.floatText?.(this.player.x,this.player.y-60,'Need a Dash',0xc9a3ff); return; }   /* v8.2.63 */
    if(!noWind&&!(this.character==='momo'&&this.basicAttack?.path==='sniper')&&this.uniqueWindup?.(()=>this.useCharacterSkillNow()))return;
    return this.useCharacterSkillNow(); }
  uniqueWindup(go,ms=170){ const p=this.player; if(!p||!this.time?.delayedCall)return false; this._uqWind=true; const col=(this.uniqueInfo?.()||{}).color||0xffd166;
    this._sqX=1.28; this._sqY=0.78; Sfx.bp?.('shared_unique_charge_start',.35,.1);
    if(this.add?.circle&&((typeof Save!=='undefined'&&Save.data?.settings?.vfx)??1)!==0){ for(let i=0;i<8;i++){ const a=i*Math.PI/4+Math.random()*.3,r=70+Math.random()*20,d=this.camWorld(this.add.circle(p.x+Math.cos(a)*r,p.y-20+Math.sin(a)*r,3.5,i%2?0xffffff:col,.95).setDepth(90480)); this.tweens.add({targets:d,x:p.x,y:p.y-20,scale:.4,duration:ms,ease:'Quad.in',onComplete:()=>d.destroy()}); }
      const ring=this.camWorld(this.add.circle(p.x,p.y-20,64,col,0).setStrokeStyle(3,col,.8).setDepth(90479)); this.tweens.add({targets:ring,scale:.25,alpha:.2,duration:ms,ease:'Quad.in',onComplete:()=>ring.destroy()}); }
    this.time.delayedCall(ms,()=>{ this._uqWind=false; if(this.state!=='play'||!this.player?.active)return; this._sqX=0.82; this._sqY=1.24; this.screenShake?.(90,.004); go(); });
    return true; }
  useCharacterSkillNow(){
    if(this.state!=='play'||this.uniqueCd>0||(this.character==='cocoa'&&this._cocoaUniqueT>0))return;
    if(this.character==='cocoa'&&this.basicAttack?.path==='dashboxer'){ if(this._dpCh==null)this._dpCh=this.cocoaDashMax(); if(this._dpCh<1){ this.floatText?.(this.player.x,this.player.y-60,'Need a Dash',0xc9a3ff); return; } this._phSpent=this._dpCh; this._dpCh=0; this._dpT=0; }   /* v8.2.63 เจ้าของ: Phantom Rush กินชาร์จ Dash ทั้งหมด (+1 พุ่งทุบต่อชาร์จ) */
    const c=CHARACTERS[this.character]||CHARACTERS.momo,u=this.uniqueInfo(),ul=this.uniqueLevel||1,up=this.uniquePower(),dm=this.player.dmgMul||1;
    this.heroScreenEffect?.(1.4);this.uniqueCd=this.uniqueCooldown(u);this.flashBtn(this.uniqueBtn);this.poseAttack(520);this._coachUnique=(this._coachUnique||0)+1;if(!(this.character==='momo'&&this.basicAttack?.path==='sniper'))this.uniqueCastFx?.();this._mxSrc='unique';this.fireRecipes('unique');
    const spectacleRadius=c.unique==='mintSanctuary'?120+(ul-1)*28:c.unique==='voidPull'?200+(ul-1)*22:c.unique==='flickerStrike'?100+(ul-1)*10:c.unique==='oathMirror'?180+(ul-1)*18:c.unique==='jamOverdrive'?170+(ul-1)*20:155+(ul-1)*18;
    if(this.character!=='cocoa')this.uniqueCrescendo(u.color,ul,spectacleRadius);
    if(c.unique==='citrusParade'){this.yuzuParadeCast(ul);Sfx.bp?.('uq_yuzu_parade',.6,.5);return;}
    if(c.unique==='berryRebound'){
      if(this.basicAttack&&this.basicAttack.path==='sniper'){this.uniqueCd=0;this.showBanner('Hold to aim','Hold Unique, then release the charged beam',900);return;}
      // Momo: เมล็ดสตWaitว์เบอร์รี "Dash-bounce" ไปหาศัตรูตัวใกล้ ๆ อย่างรวดเร็ว (ไม่ใช่สายฟ้าแบบทาโร่)
      // ใช้ homing (โค้งเข้าหาเป้า) + bounce (โดนแล้วเด้งไปตัวถัดที่ใกล้สุด) แทน chain lightning
      const shots=12+(ul-1)*2+(this.player.twinSprinkle?4:0), bounce=ul>=4?3:ul>=3?2:1;
      for(let i=0;i<shots;i++){const a=i/shots*Math.PI*2,b=this.berryBullet(this.player.x,this.player.y,0.28+ul*0.012,this.basicAttack);if(!b)continue;b.setTexture('proj_sprinkle').setTint(i%2?0xffd166:0xff76a8);b.dmg=(14+ul*2)*dm*up;b.life=1.65+ul*0.08;b.bounce=bounce;b.homing=0;b.faceVel=true;Object.assign(b.berrySeed,{path:'ricochet',evolved:!!this.basicAttack?.evolved,base:b.dmg});this.physics.velocityFromRotation(a,430+ul*12,b.body.velocity);}
      this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*(0.055+ul*0.018));try{ Sfx.playFile?.('sfx_event_revive',.5,1.05); }catch(e){}   /* v8.1.72 เจ้าของ: เอาดอกไม้บานที่ตัว (healAura) ออก เหลือเสียงฮีล */this.showBanner('🍓 Strawberry Rebound Lv'+ul,shots+' seeds · bounce toward enemies '+bounce+' · heal HP '+Math.round((0.055+ul*0.018)*100)+'%',800);(this.fxReboundScreen?.(),Sfx.bp?.('uq_rebound_burst',.6,.3))||Sfx.shoot();
    }else if(c.unique==='mintSanctuary'){
      this.castWindRush(ul);
    }else if(c.unique==='voidPull'){
      this.castVoidPull(dm,ul);
    }else if(c.unique==='flickerStrike'){
      this.castCocoaUnique(dm,ul);
    }else if(c.unique==='pathRecall'){
      this.castPathRecall(dm,ul);
    }else if(c.unique==='jamOverdrive'){
      this.castJamOverdrive(dm,ul);
    }else{
      this.castOathWard(dm,ul);
    }
  }

  // ❄️ Mint Unique — Diamond Dust: พายุหิมะถล่มพื้นที่ ตามตัวผู้เล่น ฟาดซ้ำ ๆ + แช่ฝูง + คุ้มกันช่วงสั้น
  // 🌬️ Mint Unique (v5.9) — Mint Gale: วิ่งเร็วชั่วขณะ + ลมผลักมอนรอบตัวตอนกด · เอฟเฟกต์ลมตามตัวใน tickWindRush
  castWindRush(ul){
    ul=ul||1;const dur=2.6+ul*0.5,mul=1.45+ul*0.1,r=110+ul*18;
    this.poseAttack(520,'char_mint_gale');
    this.windRushT=dur;this.windRushMul=mul;this.moveSlowT=0;
    this.player.iframe=Math.max(this.player.iframe||0,0.35);
    const cx=this.player.x,cy=this.player.y;
    this.enemies.children.iterate(e=>{if(!e||!e.active||e.isBoss||e.isMini)return;const d=this.dist(e.x,e.y,cx,cy);if(d<r){const a=Math.atan2(e.y-cy,e.x-cx),f=(260+ul*60)*(1-d/r*0.5);e.setVelocity(Math.cos(a)*f,Math.sin(a)*f);e._knockT=0.25;}});
    if(this.textures.exists('fx_mint_gale'))this.trackArtVfx(this.spawnFxAnim('fx_mint_gale',cx,cy,{scale:r*2.3/320,depth:9,normal:true}));
    else {
    for(let k=0;k<2;k++){const ring=this.camWorld(this.add.circle(cx,cy,24,0xc8f4ff,0).setStrokeStyle(4-k,0xbff4e8,0.85).setDepth(9));
      this.tweens.add({targets:ring,radius:r*(1+k*0.35),alpha:0,duration:420+k*140,ease:'Cubic.out',onComplete:()=>ring.destroy()});}
    for(let i=0;i<14;i++){const a=i/14*TAU,ln=this.camWorld(this.add.rectangle(cx+Math.cos(a)*20,cy+Math.sin(a)*20,26,3,0xe6fffa,0.9).setRotation(a).setDepth(9));
      this.tweens.add({targets:ln,x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,alpha:0,scaleX:0.3,duration:380,ease:'Cubic.out',onComplete:()=>ln.destroy()});}
    }
    this.jelly&&this.jelly(0.25,-0.2);this.fxGaleScreen?.();if(!Sfx.bp?.('uq_mint_gale',.6,.3)){Sfx.dash&&Sfx.dash();Sfx.magnet&&Sfx.magnet();}
    this.showBanner('🌬️ Mint Gale Lv'+ul,'Speed ×'+mul.toFixed(2)+' for '+dur.toFixed(1)+'s · ignore slows',950);
  }
  tickWindRush(dt){
    if(!(this.windRushT>0))return;this.windRushT=Math.max(0,this.windRushT-dt);this.moveSlowT=0;
    this._windFx=(this._windFx||0)-dt;if(this._windFx>0||!this.player)return;this._windFx=0.045;
    const v=this.player.body?this.player.body.velocity:{x:0,y:0},sp=Math.hypot(v.x,v.y),a=sp>10?Math.atan2(v.y,v.x):Math.random()*TAU;
    const px=this.player.x-Math.cos(a)*18+Phaser.Math.Between(-14,14),py=this.player.y-Math.sin(a)*18+Phaser.Math.Between(-14,14);
    if(this.textures.exists('fx_mint_gale')){
      const gust=this.trackArtVfx(this.camWorld(this.add.image(px,py,'fx_mint_gale',6).setDisplaySize(48,32).setRotation(a).setDepth(this.player.y-1).setAlpha(0.4)));
      this.tweens.add({targets:gust,x:px-Math.cos(a)*48,y:py-Math.sin(a)*48,alpha:0,duration:300,onComplete:()=>gust.destroy()});return;
    }
    const ln=this.camWorld(this.add.rectangle(px,py,Phaser.Math.Between(22,40),2.5,Math.random()<0.5?0xe6fffa:0x9fe8d8,0.85).setRotation(a).setDepth(this.player.y-1));
    this.tweens.add({targets:ln,x:px-Math.cos(a)*46,y:py-Math.sin(a)*46,alpha:0,scaleX:0.2,duration:300,onComplete:()=>ln.destroy()});
    if(Math.random()<0.3){const lf=this.camWorld(this.add.text(px,py,'🍃',{fontSize:'14px'}).setOrigin(0.5).setDepth(this.player.y-1));
      this.tweens.add({targets:lf,x:px-Math.cos(a)*60+Phaser.Math.Between(-20,20),y:py-Math.sin(a)*60+Phaser.Math.Between(-20,20),angle:Phaser.Math.Between(-180,180),alpha:0,duration:520,onComplete:()=>lf.destroy()});}
  }


  castJamOverdrive(dm,ul){
    ul=ul||1;const boosted=!!this.player.pressurizedJam,up=this.uniquePower();
    const salvos=4+ul+(boosted?2:0),barrels=1+(ul>=2?1:0)+(ul>=4?1:0)+(boosted?1:0),gap=Math.max(145,285-ul*25);
    const petals=[];for(let i=0;i<Math.min(5,barrels+1);i++){const a=i*TAU/Math.min(5,barrels+1),p=this.camWorld(this.add.circle(this.player.x+Math.cos(a)*48,this.player.y+Math.sin(a)*34,7,i%2?0xffd166:0xff5f88,0.92).setStrokeStyle(2,0xffffff,0.75).setDepth(8));p._a=a;petals.push(p);}
    let fired=0;const fire=()=>{
      if(this.state!=='play'&&this.state!=='levelup')return;fired++;
      const priority=this.priorityBossTarget(820),targets=[];this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<820)targets.push(e);});targets.sort((a,b)=>this.dist(a.x,a.y,this.player.x,this.player.y)-this.dist(b.x,b.y,this.player.x,this.player.y));
      for(let s=0;s<barrels;s++){const t=priority||targets[s%Math.max(1,targets.length)];if(!t)continue;const ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+(s-(barrels-1)/2)*0.10,b=this.getBullet(this.player.x,this.player.y-4,0xffffff,0.19+ul*0.012);if(!b)continue;b.setTexture('proj_sprinkle').setTint(s%2?0xffd166:0xff5f88);b.faceVel=true;b.dmg=(9+ul*3.2)*dm*up;b.life=1.7;b.homing=380+ul*45;b.pierce=ul>=3;b.hitGapV=0.13;this.physics.velocityFromRotation(ang,650+ul*30,b.body.velocity);}
      petals.forEach((p,i)=>{if(!p.active)return;const a=p._a+fired*0.55;p.setPosition(this.player.x+Math.cos(a)*48,this.player.y+Math.sin(a)*34);});this.vfxHitRing(this.player.x,this.player.y,0xff5f88,false);Sfx.shoot();
    };
    fire();this.time.addEvent({delay:gap,repeat:salvos-2,callback:fire});
    this.time.delayedCall((salvos-1)*gap+420,()=>petals.forEach(p=>{if(!p.active)return;this.tweens.add({targets:p,scale:0.1,alpha:0,duration:180,onComplete:()=>p.destroy()});}));
    this.showBanner('💗 Jam Overdrive Lv'+ul,barrels+' barrels · '+salvos+' salvos · auto lock-on',950);Sfx.clear();
  }

  // Taro: สายฟ้า Arc — ยิงจากตัวไปเป้าใกล้สุด แล้วชิ่งลามไปศัตรูตัวถัด ๆ ไป (คล้าย Arc ใน PoE)
  castPathRecall(dm,ul){
    if(this.character==='taro')return this.castStormBeacon(dm,ul);
    if(this.character==='taro'&&this.basicAttack?.path==='smite')return this.castTaroPathUnique(dm,ul);
    if(this.character==='taro'&&this.basicAttack?.path==='storm')return this.castTaroPathUnique(dm,ul);
    if(this.character==='taro'&&this.basicAttack?.path==='tempest')return this.castTaroTempestUnique(dm,ul);
    ul=ul||1;const upgraded=!!this.player.echoPath;
    const jumps=4+ul+(upgraded?2:0), jumpRange=250+ul*16+(upgraded?40:0), forks=ul>=3?2:1;
    // ลดพลังช่วงต้น (Lv1 เคยขี้โกง) แต่โตชันขึ้นให้ปลายเกมยังสะใจ
    const dmg=(9+ul*7)*dm*(1+(ul-1)*0.22), color=0xd7b8ff;
    // หาเป้าเริ่มต้นที่ใกล้ตัวผู้เล่นสุด
    const first=this.nearestEnemy(760);
    if(!first){ // Noneเป้า → ปล่อยประจุWaitบตัวสั้น ๆ กันเสียเทิร์นฟรี
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<220)this.damage(e,dmg,e.x,e.y);});
      this.vfxHitRing(this.player.x,this.player.y,color,true);
    }else{
      const hit=new Set();
      // แต่ละ "fork" = สายฟ้าหนึ่งสายที่ชิ่งต่อกันเป็นลูกโซ่
      for(let f=0;f<forks;f++){
        this.time.delayedCall(f*90,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
          let from={x:this.player.x,y:this.player.y}, cur=(f===0?first:null);
          if(!cur){ // สายเสริม: เริ่มจากเป้าอื่นที่ยังไม่โดน
            let best=null,bd=1e9;this.enemies.children.iterate(e=>{if(e&&e.active&&!hit.has(e)){const d=this.dist(e.x,e.y,this.player.x,this.player.y);if(d<760&&d<bd){bd=d;best=e;}}});cur=best;
          }
          for(let j=0;j<jumps&&cur;j++){
            this.chainBolt(from.x,from.y,cur.x,cur.y);
            this.damage(cur,dmg*(1-j*0.045),cur.x,cur.y);
            this.vfxHitRing(cur.x,cur.y,color,false);
            hit.add(cur);from={x:cur.x,y:cur.y};
            // หาเป้าถัดไปที่ยังไม่โดน อยู่ในระยะกระโดด
            let nb=null,nd=jumpRange*jumpRange;
            this.enemies.children.iterate(o=>{if(o&&o.active&&!hit.has(o)){const d=(o.x-from.x)**2+(o.y-from.y)**2;if(d<nd){nd=d;nb=o;}}});
            cur=nb;
          }
          Sfx.bp?.('uq_taro_chain_hit',.4,.3)||Sfx.zap();
        });
      }
    }
    this.dashReady=true;this.dashCd=0;this.pathHasteT=1.0+ul*0.38+(upgraded?0.55:0);this.player.iframe=Math.max(this.player.iframe,0.32+ul*0.06);
    this.showBanner('⚡ Chain Bolt Lv'+ul,'Chains up to '+(jumps*forks)+' · power '+Math.round(dmg)+' · Dash ready',950);Sfx.bp?.('uq_taro_chain_cast',.6,.3)||Sfx.zap();
  }

  // Cocoa: หลุมดำช็อกโกแลต — ดูดฝูงศัตรูเข้าหาตัวผู้เล่น ทำดาเมจต่อเนื่อง แล้วยุบระเบิดปิดท้าย
  castVoidPull(dm,ul){
    ul=ul||1;const up=this.uniquePower();
    // อ่อนช่วงแรก โตชันตามเลเวล (Lv1 เคยเก่งเกิน)
    const r=150+ul*30, duration=1.2+ul*0.55, pullLerp=0.09+ul*0.045, tickDmg=(3+ul*4)*dm*up;
    // Purple artwork replaces the procedural core; retain the original pull/damage timings.
    const painted=this.textures.exists('vfx_void_pull');
    const core=this.trackArtVfx(this.camWorld(painted?this.add.image(this.player.x,this.player.y,'vfx_void_pull').setDisplaySize(r*2,r*2).setAlpha(0.72).setDepth(6):this.add.circle(this.player.x,this.player.y,44,0x2a0f3a,0.8).setDepth(6).setStrokeStyle(3,0x8b5cf0,0.9)));
    if(painted)this.tweens.add({targets:core,rotation:Math.PI*2,duration:duration*1000});
    const ring=this.trackArtVfx(this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_ring').setTint(0x8b5cf0).setDepth(5).setDisplaySize(r*2,r*2).setAlpha(painted?0.12:0.34)));
    this.tweens.add({targets:ring,alpha:{from:painted?0.05:0.20,to:painted?0.12:0.42},yoyo:true,repeat:-1,duration:400,ease:'Sine.inOut'});
    this.tweens.add({targets:core,scaleX:{from:core.scaleX*0.9,to:core.scaleX*1.08},scaleY:{from:core.scaleY*0.9,to:core.scaleY*1.08},yoyo:true,repeat:-1,duration:360,ease:'Sine.inOut'});
    let tick=0;
    const pull=this.artLoop(70,()=>{
      const cx=this.player.x,cy=this.player.y; if(core.active)core.setPosition(cx,cy); if(ring.active)ring.setPosition(cx,cy);
      tick++;
      this.enemies.children.iterate(e=>{if(!e||!e.active)return;const d=this.dist(e.x,e.y,cx,cy);if(d>r)return;
        if(!e.isBoss&&!e.isMini&&d>26){ // ดูดจริง: ลาก "Position" เข้าหาศูนย์กลาง (ทับ AI เดินตาม เห็นชัดว่าถูกดูด)
          e.setPosition(e.x+(cx-e.x)*pullLerp, e.y+(cy-e.y)*pullLerp); if(e.body)e.setVelocity(0,0);
          if(tick%3===0){const p=this.trackArtVfx(this.camWorld(this.add.circle(e.x,e.y,3,0xb98cff,0.8).setDepth(9)));this.tweens.add({targets:p,x:cx,y:cy,scale:0.2,alpha:0,duration:220,onComplete:()=>p.destroy()});}
        }
        if(tick%3===0)this.damage(e,tickDmg*((e.isBoss||e.isMini)?0.5:1),e.x,e.y);
      });
    });
    this.showBanner('🕳️ Dark Chocolate Void Lv'+ul,'Pulls the crowd in '+duration.toFixed(1)+'s · radius '+r,1000);Sfx.ult&&Sfx.ult('vortex');
    this.artDelay(duration*1000,()=>{
      pull.remove(false);this._artTimers.delete(pull);this.tweens.killTweensOf(core);this.tweens.killTweensOf(ring);
      if(core.active)this.tweens.add({targets:core,scale:0.1,alpha:0,duration:180,onComplete:()=>core.destroy()});else core.destroy&&core.destroy();
      if(ring.active)ring.destroy();
      if(this.state!=='play'&&this.state!=='levelup')return;
      const cx=this.player.x,cy=this.player.y,finR=r*0.9,finDmg=(16+ul*16)*dm*up;   // ยุบระเบิดปิดท้าย (อ่อนช่วงแรก โตตามเลเวล)
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<finR){this.damage(e,finDmg*((e.isBoss||e.isMini)?0.35:1),e.x,e.y);if(!e.isBoss&&!e.isMini){const a=Math.atan2(e.y-cy,e.x-cx);e.setVelocity(Math.cos(a)*260,Math.sin(a)*260);e.knock=0.2;}}});
      this.vfxHitRing(cx,cy,0x8b5cf0,true);this.burst(cx,cy,0x8b5cf0);this.screenShake(160,0.006);Sfx.boom();
    });
  }
  // 🔮 Sesame Unique — Prism Barrage: หุบพลังกระจกแล้วระดม "ลำแสงพริซึม" กวาดเป็นพัดใส่ศัตรู + ลำกลางเจาะบอสหนัก (สายบีม ไม่ใช่วงแหวนออร่าแล้ว)
  castOathWard(dm,ul){
    ul=ul||1; const upgraded=!!this.player.mirrorWard, PRISM=0xc86bff;
    // เล็งบอส/มินิก่อน ไม่งั้นตัวใกล้สุด
    let t=null,td=1e9; this.enemies.children.iterate(e=>{ if(e&&e.active&&(e.isBoss||e.isMini)){const d=this.dist(e.x,e.y,this.player.x,this.player.y);if(d<td){td=d;t=e;}} });
    if(!t)t=this.nearestEnemy(1400);
    const baseAng=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):(this._sesBeamAng||0);
    const volleys=4+ul+(upgraded?2:0), fan=5+ul+(upgraded?2:0), len=520+ul*45, wide=16+ul*2, up=1+(ul-1)*0.25;
    const beamDmg=(28+ul*10)*dm*up, arc=1.15;   // กวาด ~66°
    this.player.iframe=Math.max(this.player.iframe,0.4+volleys*0.09);   // อมตะระหว่างระดม
    // แสงหุบเข้าที่ตัวก่อนยิง (ทางภาพ)
    const chg=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_glow').setTint(PRISM).setDepth(this.player.y+2).setScale(1.1).setAlpha(0.85));
    this.tweens.add({targets:chg,scale:0.2,alpha:0,duration:220,onComplete:()=>chg.destroy()});
    this.showBanner('🔮 Prism Barrage Lv'+ul,'Sweeping mirror beams · '+volleys+' volleys',1000); Sfx.bp?.('uq_sesame_prism_charge',.55,.3)||Sfx.zap();
    for(let v=0;v<volleys;v++){ this.time.delayedCall(v*140,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const tt=(t&&t.active)?t:this.nearestEnemy(1400), ca=tt?Math.atan2(tt.y-this.player.y,tt.x-this.player.x):baseAng;
      for(let k=0;k<fan;k++){ const a=ca+(k-(fan-1)/2)*(arc/fan); this.fireBeam(a,len,wide,beamDmg,{tint:PRISM,onHit:(e)=>{e.knock=Math.max(e.knock||0,0.08);}}); }
      this.fireBeam(ca,len,wide*1.7,beamDmg*1.5,{tint:0xffffff});   // ลำกลางสีขาว = เจาะบอสหนัก
      this.foeBullets.children.iterate(f=>{ if(f&&f.active&&this.dist(f.x,f.y,this.player.x,this.player.y)<len*0.6)this.killFoe(f); });
      this.screenShake(90,0.004); Sfx.bp?.('uq_sesame_prism_volley',.45,.18)||Sfx.zap();
    }); }
    if(ul>=4)this.time.delayedCall(volleys*140+80,()=>{ if(this.state==='play')this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.10); });
  }

  flashBtn(b){ if(b)this.tweens.add({targets:b,scale:{from:1.25,to:1},duration:220,ease:'Back.out'}); }

  /* ---------- HUD ---------- */
  buildHUD(){
    const pad=14, w=this.W; this._pad=pad; this._barW=w-2*pad;
    this.controlBase=this.add.graphics().setScrollFactor(1).setDepth(49);
    this.joyBase=this.add.circle(0,0,62,0xffffff,0.10).setScrollFactor(1).setDepth(50).setVisible(false).setStrokeStyle(2,0xffffff,0.25);
    this.joyKnob=this.add.circle(0,0,26,0xffffff,0.22).setScrollFactor(1).setDepth(51).setVisible(false);

    // dash button (มุมขวาล่าง) — ปุ่มพุ่งหลบสำหรับเล่นมือเดียว
    const dbX = w - 58, dbY = this.H - 78, dbR = 36;
    this.dashBtn=this.add.circle(dbX,dbY,dbR,COLORS.mint,0.22).setScrollFactor(1).setDepth(50).setStrokeStyle(2.5,COLORS.mint,0.85);
    this.dashTxt=this.add.text(dbX,dbY,'»\nDASH',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'14px',color:'#d7fff1',align:'center',lineSpacing:2}).setOrigin(0.5).setScrollFactor(1).setDepth(51);
    this.dashRing=this.add.graphics().setScrollFactor(1).setDepth(52);
    const ubX=w-58,ubY=this.H-78-80;   // ย้ายปุ่มเฉพาะตัวมาไว้ "North" ปุ่มพุ่ง (เดิมอยู่ซ้ายของพุ่ง)
    this.uniqueBtn=this.add.circle(ubX,ubY,36,0xff76a8,0.22).setScrollFactor(1).setDepth(50).setStrokeStyle(2.5,0xff76a8,0.85);
    this.uniqueTxt=this.add.text(ubX,ubY,'🍓',{fontSize:'26px',align:'center'}).setOrigin(0.5).setScrollFactor(1).setDepth(51);   // ปุ่มเฉพาะตัว = ไอคอนล้วน Noneตัวหนังสือ
    this.uniqueRing=this.add.graphics().setScrollFactor(1).setDepth(52);
    this.uniqueHint=this.add.text(ubX,ubY+19,'TAP',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff',align:'center'}).setOrigin(.5).setScrollFactor(1).setDepth(53);
    this.flickerBtn=this.add.rectangle(ubX-86,ubY,62,46,0x33243f,.92).setScrollFactor(1).setDepth(50).setStrokeStyle(2,0x9d83bd,.8);
    this.flickerTxt=this.add.text(ubX-86,ubY,'Flicker\nOFF',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#dbc9ee',align:'center'}).setOrigin(.5).setScrollFactor(1).setDepth(51);
    this.refreshUniqueSkillUI();this.layoutControls();

    // top bars: HP + XP (โค้งมน วาดด้วย graphics)
    this.barG=this.add.graphics().setScrollFactor(1).setDepth(50);
    this.hpIcon=this.add.text(pad+4,pad+7,'❤️',{fontSize:'12px'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);
    this.xpIcon=this.add.text(pad+4,pad+24,'⭐',{fontSize:'10px'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);

    // แถวข้อมูล 2 บรรทัดใต้หลอด — ซ้าย: Lv/ฆ่า · กลาง: สถานะเวฟ/Stage · ขวาบน: ปุ่มควบคุม
    this.lvlTxt=this.add.text(pad,pad+34,'Lv 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff'}).setOrigin(0,0).setScrollFactor(1).setDepth(51);
    this.killTxt=this.add.text(pad,pad+56,'KOs 0',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#d9cff0'}).setOrigin(0,0).setScrollFactor(1).setDepth(51);
    this.traitTxt=this.camUI(this.add.text(pad,pad+74,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffe08a',stroke:'#2a1830',strokeThickness:3}).setOrigin(0,0).setScrollFactor(1).setDepth(51).setVisible(false));   // v7.8.102 ป้าย Run trait ติดจอ (แบนเนอร์ถูกทับ)
    // สรุปสเตตย่อ ๆ ขณะเล่น (เลือด/ฟื้น/โจมตี/ป้องกัน)
    this.statTxt=this.add.text(pad,pad+75,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#bfe8d6',stroke:'#141018',strokeThickness:3}).setOrigin(0,0).setScrollFactor(1).setDepth(54);
    this.runSugarTxt=this.add.text(w-pad,pad+56,'🍬 0',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe08a'}).setOrigin(1,0).setScrollFactor(1).setDepth(51);   // เงินที่ได้Waitบนี้ (realtime)
    this.timeTxt=this.add.text(w/2,pad+34,'0:00',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffe08a',align:'center',wordWrap:{width:w-150}}).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    this.stageTxt=this.add.text(w/2,pad+56,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd9a8',align:'center',wordWrap:{width:w-40}}).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    // wave progress pips (บอกว่าใกล้จบเวฟ/ถึงบอสหรือยัง)
    this.pipG=this.add.graphics().setScrollFactor(1).setDepth(51);
    this.waveObjTxt=this.add.text(w/2,pad+HUD_ROWS.objective,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#fff4b0',align:'center',stroke:'#24172c',strokeThickness:4}).setOrigin(0.5,0).setScrollFactor(1).setDepth(53).setVisible(false);
    this.waveObjBg=this.add.rectangle(w/2,pad+131,Math.min(230,w-84),7,0x100b16,0.72).setOrigin(0.5,0).setScrollFactor(1).setDepth(52).setVisible(false);
    this.waveObjBar=this.add.rectangle(w/2-Math.min(230,w-84)/2,pad+132,Math.min(230,w-84),5,0xffd166,1).setOrigin(0,0).setScrollFactor(1).setDepth(53).setVisible(false);
    const progressTexture=this.textures.get('replay_progress_art');
    if(!progressTexture.has('empty')){const q=progressTexture.getSourceImage().width/1942;progressTexture.add('empty',0,100*q,95*q,1750*q,164*q);progressTexture.add('fill',0,207*q,604*q,1520*q,74*q);}   // v7.4.1 พิกัดตามขนาดจริง (ภาพย่อแล้ว)
    const meterW=Math.min(350,w-34),meterY=pad+HUD_ROWS.progress;
    this.replayProgressFrame=this.add.image(w/2,meterY,'replay_progress_art','empty').setDisplaySize(meterW,33).setDepth(54).setVisible(false);
    this.replayProgressFill=this.add.image(w/2-meterW*.435,meterY,'replay_progress_art','fill').setOrigin(0,.5).setDisplaySize(meterW*.87,15).setDepth(55).setVisible(false);

    // boss HP bar (hidden until boss)
    this.bossName=this.add.text(w/2,pad+HUD_ROWS.bossName,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ff9ec4'}).setOrigin(0.5,0).setScrollFactor(1).setDepth(52);
    this.bossBgW=this.add.rectangle(w/2,pad+HUD_ROWS.bossBg,this._barW*0.8,12,0x000000,0.4).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    this.bossBar=this.add.rectangle(w/2-(this._barW*0.8)/2+2,pad+HUD_ROWS.bossBar,this._barW*0.8-4,8,0xff5f97,1).setOrigin(0,0).setScrollFactor(1).setDepth(52);
    this.bossHpTxt=this.add.text(w/2,pad+HUD_ROWS.bossHp,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffffff',stroke:'#5a0d28',strokeThickness:2}).setOrigin(0.5,0).setScrollFactor(1).setDepth(53);

    // center banner
    this.bannerT=this.add.text(w/2,this.H*0.30,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffffff',align:'center',stroke:'#1a1224',strokeThickness:4,wordWrap:{width:w*0.86}}).setOrigin(0.5).setScrollFactor(1).setDepth(60).setVisible(false);
    this.bannerS=this.add.text(w/2,this.H*0.36,'',{fontFamily:'sans-serif',fontSize:'12px',color:'#e6dcf0',align:'center',stroke:'#1a1224',strokeThickness:2,wordWrap:{width:w*0.72},maxLines:2}).setOrigin(0.5).setScrollFactor(1).setDepth(60).setVisible(false);

    // ปุ่มควบคุม (speed/pause/mute) — จัดเป็นกลุ่มเดียวมุมขวาบน อยู่แนวเดียวกับหลอด HP
    const cbY=pad+14;
    this.muteBtn=this.add.circle(w-26,cbY,16,0x000000,0.48).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.4);
    this.muteTxt=this.add.text(w-26,cbY,Sfx.muted?'🔇':'🔊',{fontSize:'15px'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    this.pauseBtn=this.add.circle(w-70,cbY,16,0x000000,0.48).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.4);
    this.pauseTxt=this.add.text(w-70,cbY,'⏸',{fontSize:'14px'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    this.speedBtn=this.add.circle(w-114,cbY,16,0x000000,0.48).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.4);
    this.speedTxt=this.add.text(w-114,cbY,'x'+(this.gameSpeed||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#bff5d8'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    // ตัววัด FPS + ความละเอียด (ไว้ดีบั๊ก — เอาออกทีหลังได้)
    this.fpsTxt=this.add.text(w-30,pad+88,'',{fontFamily:'monospace',fontSize:'10px',color:'#8fd0ff'}).setOrigin(1,0).setScrollFactor(1).setDepth(59);
    this.fpsTxt.setVisible(/[?&]debug=1\b/.test(location.search));
    this.time.addEvent({delay:400,loop:true,callback:()=>{ if(!this.fpsTxt)return;
      const fps=Math.round(this.game.loop.actualFps), logicalW=Math.round(this.scale.width/RENDER_DPR), backingW=this.game.canvas.width;
      this.fpsTxt.setText(fps+'fps · '+logicalW+'→'+backingW+'p · x'+this.renderDPR); }});

    // Archero-style overhead: หลอดเลือด + เลเวล + ตัวเลข Northหัวผู้เล่น (screen-space บน uiCam = ติดตัวเป๊ะ)
    this.pOverG=this.add.graphics().setScrollFactor(1).setDepth(80); this.camUI(this.pOverG);
    this.pOverLv=this.add.text(0,0,'1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffe27a',stroke:'#2a1830',strokeThickness:3}).setOrigin(0.5,0.5).setScrollFactor(1).setDepth(82); this.camUI(this.pOverLv);
    this.pOverHp=this.add.text(0,0,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffffff',stroke:'#2a1830',strokeThickness:3}).setOrigin(0.5,0.5).setScrollFactor(1).setDepth(83); this.camUI(this.pOverHp);
    this.hudArtC=this.add.container(0,0).setScrollFactor(1).setDepth(50.5); this.hudBtnC=this.add.container(0,0).setScrollFactor(1).setDepth(58.5); this._hudL=null; this._hudBtns=null; this._hudArt=false; this._hudArtChk=0;   /* v8.2.1 owner 🐞: these live on the scene object and survived scene.restart → after a lost run the HUD art was drawn into the destroyed containers of the old run (top panel, buttons, icons gone) */   // v8.0.10 ใบ 47 อาร์ต HUD
    this.hudList=[this.hudArtC,this.hudBtnC,this.controlBase,this.uniqueHint,this.flickerBtn,this.flickerTxt,this.dashBtn,this.dashTxt,this.dashRing,this.uniqueBtn,this.uniqueTxt,this.uniqueRing,this.barG,this.hpIcon,this.xpIcon,this.timeTxt,this.killTxt,this.statTxt,this.runSugarTxt,this.lvlTxt,this.stageTxt,this.pipG,this.replayProgressFrame,this.replayProgressFill,this.waveObjTxt,this.waveObjBg,this.waveObjBar,this.pauseBtn,this.pauseTxt,this.speedBtn,this.speedTxt,this.pOverG,this.pOverLv,this.pOverHp,this.muteBtn,this.muteTxt];
    this.sesRuneCreateControls();
    this.objectiveArrow=this.add.text(w/2,pad+184,'➤',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'32px',color:'#ffef7a',stroke:'#3b2148',strokeThickness:5}).setOrigin(0.5).setScrollFactor(1).setDepth(69);
    this.objectiveDist=this.add.text(w/2,pad+210,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff4b0',stroke:'#27172f',strokeThickness:3}).setOrigin(0.5).setScrollFactor(1).setDepth(69);
    this.sideArrow=this.add.text(w/2,pad+184,'➤',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:'#7fd8ff',stroke:'#14304a',strokeThickness:5}).setOrigin(0.5).setScrollFactor(1).setDepth(69);   /* v8.2.27 ลูกศรฟ้า = ภารกิจเสริม */
    this.bossUI=[this.bossName,this.bossBgW,this.bossBar,this.bossHpTxt,this.objectiveArrow,this.objectiveDist,this.sideArrow];
    this.layoutCombatHUD();
    this.hudList.forEach(o=>o.setVisible(false));
    this.bossUI.forEach(o=>o.setVisible(false));
  }
  layoutCombatHUD(){
    const w=this.W,font='NunitoUI, sans-serif';
    this.lvlTxt.setPosition(22,19).setFontFamily(font).setFontSize(13).setColor('#fff0c7');
    this.killTxt.setPosition(22+this.lvlTxt.width+12,21).setFontFamily(font).setFontSize(11);
    this.runSugarTxt.setPosition(w-140,21).setFontFamily(font).setFontSize(11);
    this.stageTxt.setPosition(w/2,54).setFontFamily(font).setFontSize(10).setWordWrapWidth(Math.max(80,w-180)).setMaxLines(1);
    this.timeTxt.setPosition(w/2,52).setFontFamily(font).setFontSize(13).setColor('#fff0cf').setWordWrapWidth(w-52);
    this.waveObjTxt.setPosition(w/2,this._pad+HUD_ROWS.objective).setFontFamily(font).setFontSize(12).setStroke('#20172b',2).setWordWrapWidth(w-54);
    this.waveObjBg.setPosition(w/2,103);this.waveObjBar.setPosition(w/2-Math.min(230,w-84)/2,104);
    this.statTxt.setPosition(20,137).setFontSize(10).setWordWrapWidth(w-40);
    this.traitTxt?.setPosition(20,154).setFontSize(10);
    for(const [b,t] of [[this.speedBtn,this.speedTxt],[this.pauseBtn,this.pauseTxt],[this.muteBtn,this.muteTxt]]){
      b.setFillStyle(0x171422,.98).setStrokeStyle(1,0xc4a978,.65);t.setFontFamily(font);
    }
    this.pauseTxt.setText('Ⅱ').setFontSize(19).setColor('#ffe2a1');
    this.fpsTxt?.setPosition(w-20,245);
    this.pOverLv.setFontFamily(font);this.pOverHp.setFontFamily(font);
    this._hudTextKeys={};this._hudLayoutKey=null;
  }
  drawCombatControlBase(){
    const g=this.controlBase,d=this.dashBtn,u=this.uniqueBtn;if(!g||!d||!u)return;
    const key=[d.x,d.y,d.radius,d.visible,u.x,u.y,u.radius,u.fillColor,u.visible].join(':');if(g._key===key)return;g._key=key;g.clear();
    for(const b of [d,u]){if(b.visible===false)continue;g.fillStyle(0x14121e,.86).fillCircle(b.x,b.y,b.radius);
      g.lineStyle(1.3,0xffefd8,.45).beginPath().arc(b.x,b.y,b.radius-2,-2.8,-.25).strokePath();
      g.lineStyle(2,b.fillColor,.55).beginPath().arc(b.x,b.y,b.radius-2,.2,2.55).strokePath();}
  }
  hudCompactNumber(value){const n=Math.max(0,Number(value)||0);return n>=1e6?(n/1e6).toFixed(n<1e7?1:0).replace(/\.0$/,'')+'m':n>=1e4?(n/1e3).toFixed(n<1e5?1:0).replace(/\.0$/,'')+'k':String(Math.floor(n));}
  hudFormatCounters(){const k=this.killTxt,s=this.runSugarTxt;if(k&&/^KOs /.test(k.text))k.setText(this.hudCompactNumber(this.stageKills));if(s&&/^🍬 /.test(s.text))s.setText(this.hudCompactNumber(this.sugarRun));}
  bossLiquidPalette(f){
    const stops=[[0,0xf25564],[.28,0xff984c],[.55,0xffd35c],[1,0x50dc98]],mix=(a,b,t)=>{let c=0;for(const shift of [16,8,0])c|=Math.round(((a>>shift)&255)*(1-t)+((b>>shift)&255)*t)<<shift;return c;};
    f=Math.max(0,Math.min(1,Number(f)||0));let base=stops[0][1];for(let i=1;i<stops.length;i++)if(f<=stops[i][0]){base=mix(stops[i-1][1],stops[i][1],(f-stops[i-1][0])/(stops[i][0]-stops[i-1][0]));break;}
    return[0x111019,0x231d2b,mix(base,0x000000,.18),mix(base,0xffffff,.18),mix(base,0xffffff,.65),0xfff4df,mix(base,0xfff4df,.4),mix(base,0xffffff,.5)];
  }
  drawCombatHUDPanels(g){
    const w=this.W,art=!!this._hudArt;
    if(art)this.hudFormatCounters();
    // Compact glass islands: no full-width ornamental header or boss plate.
    const tw=this._hudTopW||w-152;   // v8.0.14 แถบ Lv/💀/🍬 กว้างพอดีเนื้อหา
    if(!art){g.fillStyle(0x171320,.83).fillRoundedRect(8,9,tw,29,10);
    g.lineStyle(1,0xd4b178,.22).strokeRoundedRect(8,9,tw,29,10);}
    const continuous=!!this._v83Run;
    const hasStatus=!!this._hst62?.icons.some(o=>o.visible);
    const layoutKey=[w,art,continuous,this.mode,this.lvlTxt.text,this.killTxt.text,this.runSugarTxt.text,this.timeTxt.text,this.waveObjTxt.text,this.waveObjTxt.visible,this.bossName.text,this.bossName.visible,this._seasonIconsOn,this.statTxt.text,this.traitTxt?.text,this.traitTxt?.visible,hasStatus].join('|');
    if(this._hudLayoutKey!==layoutKey||this.replayProgressFrame?.visible){
    this._hudLayoutKey=layoutKey;this._hudBackings=[];
    this.lvlTxt.setPosition(16,17).setColor('#fff0c7').setFontSize(12);
    const kx=16+this.lvlTxt.width+12, sx=w-145;
    this.killTxt.setPosition(kx+(art?15:0),18).setFontSize(10);
    this.runSugarTxt.setPosition(sx,18).setFontSize(10);
    // Bounded numeric fields also fit narrow phones with large run counters.
    const fit=(t,max,size)=>{if(!t)return;const key=t.text+'|'+max+'|'+size;
      this._hudTextKeys||={};if(this._hudTextKeys[t.name]===key&&t.width<=max)return;this._hudTextKeys[t.name]=key;
      t.setFontSize(size);if(t.width>max)t.setFontSize(Math.max(8,Math.floor(size*max/t.width)));};
    this.killTxt.name='kills';this.runSugarTxt.name='sugar';
    fit(this.killTxt,Math.max(24,(sx-kx-24)/2),10);fit(this.runSugarTxt,Math.max(24,(sx-kx-24)/2),10);
    { const sr=Math.min(sx,this.killTxt.x+this.killTxt.width+28+this.runSugarTxt.width); this.runSugarTxt.setX(Math.round(sr)); this._hudTopW=Math.min(w-152,Math.ceil((sr+12-8)/4)*4); }
    const boss=!!this.bossName?.visible;this.timeTxt.setVisible(this.barG?.visible!==false&&!boss);
    this.timeTxt.setOrigin(continuous ? .5 : 0,0).setWordWrapWidth(continuous?156:w-142).setMaxLines(1)
      .setStroke(continuous?'#101824':'#191321',continuous?1:3).setColor(continuous?'#f0f9ff':'#ffe08a');
    this.timeTxt.name='phase';fit(this.timeTxt,continuous?156:w-142,continuous?13:11);
    // v8.0.14 เจ้าของ: หัวเวฟ + จุดเวฟอยู่กลาง ในการ์ดเดียวกับภารกิจ
    const st0=typeof STAGES!=='undefined'?STAGES[this.stageIndex]:null,np=(!continuous&&!this.recipeMode&&st0&&this.mode!=='boss')?st0.waves:0,pipW=np?np*10+10:0;
    const rowW=this.timeTxt.width+(np?8+pipW:0),rowX=Math.round(w/2-rowW/2);
    this.timeTxt.setPosition(continuous?w/2:rowX,continuous?50:44);this._pipX0=np?rowX+this.timeTxt.width+8:null;this._pipY=44+this.timeTxt.height/2;
    let bottom=boss?39:continuous?77:60;
    const objective=!!this.waveObjTxt?.visible,progress=!!this.replayProgressFrame?.visible;
    this.waveObjTxt.name='mission';
    if(objective){
      const season=!!this._seasonIconsOn;
      const missionTop=continuous&&!boss?77:40,missionY=boss?43:continuous?80:62;
      this.waveObjTxt.setY(missionY).setWordWrapWidth(w-48-(season?76:0)).setMaxLines(2).setStroke('#191321',2);
      fit(this.waveObjTxt,w-48-(season?76:0),11);
      if(!season)this.waveObjTxt.setOrigin(.5,0).setX(w/2);
      if(season&&this._seasonIcons){const cy=this.waveObjTxt.y+this.waveObjTxt.height/2;for(const im of this._seasonIcons)im.setY(cy);}
      const ty=this.waveObjTxt.y+this.waveObjTxt.height,mw=Math.min(230,w-84);
      this.waveObjBg.setY(ty+4).setDisplaySize(mw,4).setAlpha(0);
      this.waveObjBar.setY(ty+4).setDisplaySize(this.waveObjBar.width,4).setAlpha(0);
      this._liq={x:w/2-mw/2,y:ty+4,w:mw,h:4};
      const cw=Math.min(w-24,Math.max(rowW,this.waveObjTxt.width+(this._seasonIconsOn?76:0),mw)+32);
      this._hudBackings.push([0x171320,.68,Math.round(w/2-cw/2),missionTop,Math.round(cw),ty+14-missionTop,3]);
      bottom=ty+14;
    }
    if(progress){
      const y=objective?bottom+4:67,mw=Math.min(250,w-40);
      this.replayProgressFrame.setPosition(w/2,y).setDisplaySize(mw,14);
      this.replayProgressFill.setPosition(w/2-mw*.435,y).setDisplaySize(mw*.87,6);
      bottom=y+10;
    }
    if(this.bossName?.visible){
      const y=bottom+5,bg=this.bossBgW,pw=Math.min(w-24,440),left=(w-pw)/2;
      this.bossName.setOrigin(0,0).setPosition(left+13,y).setFontSize(11).setColor('#fff0dc').setWordWrapWidth(pw-30).setMaxLines(1).setStroke('#191321',2);
      this.bossName.name='boss';fit(this.bossName,pw-30,11);
      this.bossHpTxt?.setOrigin(.5,.5).setPosition(w/2,y+23).setFontSize(9).setStroke('#15111e',1).setDepth(55);
      this._hudBackings.push([0x211522,.8,left,y-4,pw,39,3]);
      bg.width=pw-24;bg.setPosition(w/2,y+16).setDisplaySize(bg.width,14).setAlpha(0);
      this.bossBar.setPosition(w/2-bg.width/2+2,y+17).setAlpha(0);
      bottom=y+35;
    }
    if(!objective)this._liq=null;
    this._hudBottom=bottom;
    this.statTxt.setY(bottom+4).setWordWrapWidth(w-40);
    const trait=this.traitTxt,share=!!trait?.visible&&!hasStatus&&this.statTxt.width+trait.width+24<w-40;
    trait?.setOrigin(share?1:0,0).setPosition(share?w-20:20,bottom+(share?4:21));
    this.drawWavePips?.();
    }
    if(continuous&&this.timeTxt.visible)this.drawContinuousCombatStrip(g,w);
    if(!art)for(const [col,alpha,x,y,rw,rh,r] of this._hudBackings||[]){g.fillStyle(col,alpha).fillRoundedRect(x,y,rw,rh,r);g.lineStyle(1,0xffefd8,.45).strokeRoundedRect(x,y,rw,rh,r);}
    this.drawCombatControlBase();
  }
  // v8.0.14 เจ้าของ: หลอดภารกิจ = สี่เหลี่ยมมุมโค้งนิด ๆ ด้านในเป็นน้ำฟ้าเขียวไหล (วาดด้วยโค้ด canvas-safe)
  drawLiquidBar(){
    const now=this.time?.now||0,popK=this._liqPop!=null?1-(now-this._liqPop)/750:0,hud=!!this.barG?.visible;
    const live=!!(this._liq&&this.waveObjBg?.visible); if(live)this._liqLast=this._liq;
    const L=live?this._liq:(popK>0?this._liqLast:null);
    this.hudLiqG=this.liquidTube(this.hudLiqG,hud&&L?L:null,live?(this.waveObjBar?.width||0)/L.w:1,'_liqF',0,popK>0?popK:0);
    const bg=this.bossBgW,bv=!!(hud&&bg?.visible&&this.bossName?.visible),bw=bg?.width||0;
    const boss=this.boss,spawn=boss?._taroSpawnId;if(boss!==this._hudLiquidBoss||spawn!==this._hudLiquidSpawn){this._hudLiquidBoss=boss;this._hudLiquidSpawn=spawn;this._bossLiqF=null;this._bossGhost=null;}
    const bf=boss?.maxhp>0?Phaser.Math.Clamp(boss.hp/boss.maxhp,0,1):bw>4?Phaser.Math.Clamp((this.bossBar?.width||0)/(bw-4),0,1):0;
    this.hudBossLiqG=this.liquidTube(this.hudBossLiqG,bv?{x:bg.x-bw/2,y:bg.y,w:bw,h:14}:null,bf,'_bossLiqF',1,0,{ghost:'_bossGhost',boss:true});
  }
  // v8.0.17 ปุ่ม Dash ยุบแล้วเด้งกลับตอนกด
  dashPress(){ (typeof DailyQ!=='undefined')&&!this._inTutorial&&DailyQ.tick('dash'); const b=this.dashBtn,t=this.dashTxt; if(!b||!this.tweens)return; const k=this.ctrlScale?.()||1;
    this.tweens.killTweensOf([b,t]); b.setScale(.8); t?.setScale(k*.8);
    this.tweens.add({targets:b,scale:1,duration:240,ease:'Back.easeOut'}); if(t)this.tweens.add({targets:t,scale:k,duration:240,ease:'Back.easeOut'}); }
  // v8.0.17 Unique พร้อมใช้ = ขอบเรืองเต้น + ประกายวิ่งรอบปุ่ม + วงแสงแวบตอนเพิ่งพร้อม
  uniqueReadyGlow(g,b,col){ const now=this.time?.now||0,t=now/1000,p=.5+.5*Math.sin(t*6),r=b.radius;
    const still=this.hubMotionAllowed?.()===false||(typeof Save!=='undefined'&&Save.data.settings?.vfx===0);
    if(this._uqReadyAt==null)this._uqReadyAt=now; const fresh=Math.max(0,1-(now-this._uqReadyAt)/600);
    g.lineStyle(2,col,still?.7:.55+.25*p).strokeCircle(b.x,b.y,r+5+(still?0:p));
    if(!still){const a=t*1.8;g.fillStyle(0xfff2dc,.85).fillCircle(b.x+Math.cos(a)*(r+5),b.y+Math.sin(a)*(r+5),1.5);}
    if(!still&&fresh>0)g.lineStyle(1.5,0xfff2dc,.5*fresh).strokeCircle(b.x,b.y,r+7+3*(1-fresh)); }
  // v8.0.17 ฆ่าบอส/มินิ = ภาพค้าง ~0.1 วิ แล้วสโลว์โมชันสั้น ๆ (เวลาจริง ไม่ขึ้นกับ x1–x4)
  killSlowmo(power=1){ if(!this.physics?.world||!this.tweens||this._slowmo)return; Sfx.orderCue?.('kill_freeze',.45,.5);this.time?.delayedCall(120,()=>{if(this.state!=='menu'&&this.state!=='dead')Sfx.orderCue?.('kill_slowmo',.3,.5);});this._slowmo=true; this._isHitStop=true;
    const w=this.physics.world,gs=this.gameSpeed||1,freeze=Math.round(90+30*power),slow=Math.round(380+320*power);
    w.timeScale=12; this.tweens.timeScale=.04; this.cameras?.main?.flash?.(110,255,255,255,false);
    const done=()=>{ this._slowmo=false; this._isHitStop=false; if(this.sys?.isActive?.()!==false)this.setGameSpeed(this.gameSpeed||gs); };
    setTimeout(()=>{ if(!this.sys||this.sys.isActive?.()===false){done();return;} w.timeScale=1/(gs*.35); this.tweens.timeScale=gs*.35;
      setTimeout(done,slow); },freeze); }
  // v8.0.16 ตัวเลขฆ่า/Sugar เด้งตอนเปลี่ยน · Survive เหลือ <5 วิ กระพริบแดง
  hudJuice(){ if(!this.tweens)return;const motion=this.hubMotionAllowed?.()!==false&&!(typeof Save!=='undefined'&&Save.data.settings?.vfx===0);
    for(const t of [this.killTxt,this.runSugarTxt]){ if(!t)continue; const n=String(t.text||'').replace(/\D/g,'');
      if(t._jn!=null&&n!==t._jn&&t.visible&&motion){ t._jt?.stop?.(); t.setScale(1); t._jt=this.tweens.add({targets:t,scale:1.12,duration:70,yoyo:true,ease:'Quad.easeOut',onComplete:()=>t.setScale(1)}); }
      t._jn=n; }
    const o=this.waveObjective,T=this.waveObjTxt; if(!T||!o)return;
    const warn=!!(o&&!o.done&&o.type==='survive'&&T.visible&&this.state==='play'&&this.waveTimer>0&&this.waveTimer<5);
    const on=warn&&(!motion||Math.floor((this.time?.now||0)/350)%2===0), c=warn?(on?'#ff6c75':'#ffd0d4'):('#'+((o&&o.color)||0xfff4b0).toString(16).padStart(6,'0'));
    if(T._jc!==c){ T._jc=c; T.setColor(c); } }
  // v8.0.16 กดเปลี่ยนความเร็ว → ป้าย x1–x4 เด้งกลางจอ
  speedPopup(){ if(!this.add||!this.tweens)return; let t=this._spdPop;
    if(!t||!t.active){ t=this._spdPop=this.add.text(0,0,'',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'40px',color:'#bff5d8',stroke:'#14301f',strokeThickness:6}).setOrigin(.5).setScrollFactor(1).setDepth(70); this.camUI?.(t); }
    const gs=this.gameSpeed||1;if(gs>1)Sfx.orderCue?.('speed_change_x'+Math.min(4,gs),.3,.15); t._tw?.stop?.(); t.setText('x'+gs+(gs>1?' ⏩':'')).setColor(gs>1?'#bff5d8':'#fff0c7').setPosition(this.W/2,this.H*.38).setAlpha(1).setScale(.6).setVisible(true);
    t._tw=this.tweens.add({targets:t,scale:{from:.6,to:1.12},duration:150,ease:'Back.easeOut',onComplete:()=>{ t._tw=this.tweens.add({targets:t,alpha:0,y:t.y-18,scale:1,delay:380,duration:320,onComplete:()=>t.setVisible(false)}); }}); }
  // หลอดน้ำมุมโค้งนิด ๆ · pal 0 = ฟ้าเขียว (ภารกิจ) · 1 = ชมพูแดง (เลือดบอส) · pop 1→0 = กระเพื่อม + แสงแวบ
  liquidTube(g,L,tf,key,pal,pop,o={}){
    if(!g){ if(!L)return g; g=this.add.graphics().setScrollFactor(1).setDepth(53); this.camUI?.(g); }
    g.clear(); g.setVisible(!!L); if(!L){ if(o.ghost)this[o.ghost]=null; return g; }
    const PAL=[[0x0b1418,0x10242a,0x1fb5a8,0x52e3b8,0xc8fff0,0xe8fff8,0xa9f5e6,0xbffff0],[0x2a1018,0x3a1220,0xd93a6a,0xff7fa3,0xffd6e2,0xffeef3,0xffa3bf,0xffe0ea],
      [0x2a0c12,0x3a1018,0xc42848,0xf0587a,0xffc2cf,0xffe2e8,0xff8aa4,0xffd0da],[0x24060a,0x340a10,0x9e1028,0xd8304e,0xffa8b4,0xffd4da,0xff6b80,0xffc0c8]];
    const still=this.hubMotionAllowed?.()===false||(typeof Save!=='undefined'&&Save.data.settings?.vfx===0),now=this.time?.now||0,dt=Math.max(0,Math.min(.1,(now-(g._liquidAt??now))/1000));g._liquidAt=now;
    const {x,y,w,h}=L,r=Math.min(4,h/2),t=still?0:now/1000;tf=Phaser.Math.Clamp(tf||0,0,1);
    let f=this[key];f=f==null||still?tf:f+(tf-f)*(1-Math.exp(-dt*(o.boss?18:14)));this[key]=f;
    const P=o.boss?this.bossLiquidPalette(f):PAL[pal]||PAL[0],fw=Math.max(0,w*f),amp=Math.min(h*.15,.7+pop*1.2);if(still)pop=0;
    let gw=0; if(o.ghost){ let G=this[o.ghost]; if(!G||tf>G.v+.001)G={v:tf,hitAt:now,last:tf};if(tf<G.last-.0005&&G.v<=G.last+.002)G.hitAt=now;G.last=tf;
      if(still)G.v=tf;else if(now-G.hitAt>180)G.v+=(tf-G.v)*(1-Math.exp(-dt*11));this[o.ghost]=G;gw=G.v>tf+.0001?Math.max(0,w*G.v):0; }
    g.fillStyle(P[0],.85).fillRoundedRect(x-1.5,y-1.5,w+3,h+3,r+1.5);
    g.fillStyle(P[1],1).fillRoundedRect(x,y,w,h,r);
    if(fw>=2){ const rr=Math.min(r,fw/2),a=x+rr,b=x+fw-rr;
      g.fillStyle(P[2],1).fillRoundedRect(x,y,fw,h,rr);
      g.fillStyle(P[3],.9).fillRoundedRect(x,y,fw,h*.55,{tl:rr,tr:rr,bl:0,br:0});
      if(!still)for(let k=0;k<Math.ceil(w/24)+2;k++){ const sx=x+((t*18+k*24)%(w+48))-24,q=[sx,sx+6,sx+11,sx+5].map(v=>Phaser.Math.Clamp(v,a,b));
        if(q[1]-q[0]<.5&&q[2]-q[3]<.5)continue; g.fillStyle(P[4],.18).fillPoints([{x:q[0],y:y+h},{x:q[1],y:y+h},{x:q[2],y},{x:q[3],y}],true); }
      g.lineStyle(1,P[5],.5).beginPath();for(let px=a;px<=b;px+=6){const py=y+Math.min(2,h*.3)+(still?0:Math.sin(px*.12-t*3)*amp);px===a?g.moveTo(px,Math.max(y,py)):g.lineTo(px,Math.max(y,py));}g.strokePath();
      if(!still&&h>=8&&fw>10)for(let k=0;k<3;k++){const bx=x+((t*12+k*fw/3)%Math.max(4,fw-6))+3,by=y+h-3-((t*3+k*1.7)%Math.max(1,h-5));if(bx<b)g.fillStyle(0xfff4df,.3).fillCircle(bx,by,.8);}
      if(f<.995){const mr=Math.min(h*.22,fw*.22);g.fillStyle(P[7],.45).fillCircle(x+fw-mr,y+h/2,mr);}
    }
    if(gw>fw+.5)g.fillStyle(0xffffff,.72).fillRect(x+fw,y+1,gw-fw,h-2);   // เงาเลือดที่หาย ค้างแล้วค่อยหด
    g.lineStyle(1,P[6],.45).strokeRoundedRect(x,y,w,h,r);
    if(pop>0){ g.fillStyle(0xffffff,.55*pop).fillRoundedRect(x,y,w,h,r); g.lineStyle(2,P[7],.8*pop).strokeRoundedRect(x-2-4*(1-pop),y-2-4*(1-pop),w+4+8*(1-pop),h+4+8*(1-pop),r+3); }
    return g;
  }
  // v8.0.10 ใบ 47: อาร์ต HUD ส่วนบน วางทับตำแหน่ง/ขนาดเดิม · ไฟล์ไม่มา/ถูกลบ = กราฟิกโค้ดเดิม
  hudArtOn(){ return typeof HUD_KEYS!=='undefined'&&HUD_KEYS.every(k=>this.realTex(k)); }
  hudArtClear(){ const L=this._hudL; this._hudL=null; if(L){ L.c0?.destroy(); L.c1?.destroy(); }
    this.hudBtnC?.removeAll(true); this._hudBtns=null;
    for(const o of [this.waveObjBg,this.waveObjBar,this.bossBgW,this.bossBar,this.speedBtn,this.pauseBtn,this.muteBtn,this.pauseTxt,this.muteTxt])o?.setAlpha?.(1);
    this.lvlTxt?.setColor?.('#fff0c7');
    if(this.killTxt&&!/^KOs /.test(this.killTxt.text))this.killTxt.setText('KOs '+(this.stageKills||0));
    if(this.runSugarTxt&&!/^🍬/.test(this.runSugarTxt.text))this.runSugarTxt.setText('🍬 '+(this.sugarRun||0)).setX(this.W-140); }
  hudArtSync(){ const C=this.hudArtC; if(!C||!this.realTex)return false; const now=this.time?.now||0;
    if(now>=(this._hudArtChk||0)){ this._hudArtChk=now+1000; const ok=this.hudArtOn(); if(ok!==!!this._hudArt){ this._hudArt=ok; this.hudArtClear(); this._hudPipRedo=true; } }
    if(!this._hudArt){ this.hudBtnArtSync(); if(this._hudPipRedo){ this._hudPipRedo=false; this.drawWavePips?.(); } return false; }
    const w=this.W;
    let L=this._hudL;if(!L){L=this._hudL={c0:this.add.container(0,0),c1:this.add.container(0,0),pips:[]};C.add([L.c0,L.c1]);}
    const panels=[["hud_top_panel",8,9,this._hudTopW||w-152,29],...(this._hudBackings||[]).map(([col,alpha,x,y,pw,ph])=>[col===0x211522?'hud_boss_plate':'hud_mission_card',x,y,pw,ph])];
    const pk=panels.map(p=>p.join(':')).join('|');
    if(L.pk!==pk){L.pk=pk;L.c0.removeAll(true);for(const [key,x,y,pw,ph] of panels){const p=this.tuPanel(key,0,x,y,pw,ph);if(p)L.c0.add(p);}}
    // Minimal ImageGen frames sit behind live text and code-drawn progress bars.
    const kt=this.killTxt,st=this.runSugarTxt;
    this.hudFormatCounters?.();
    const ck=[kt?.x,st?.x,kt?.width,st?.width,w].join(':');
    if(L.ck!==ck){L.ck=ck;L.c1.list.filter(o=>!o._pip).forEach(o=>o.destroy());
      if(kt)L.c1.add(this.add.image(kt.x-9,24,'hud_ic_kill').setDisplaySize(13,13));
      if(st)L.c1.add(this.add.image(st.x-st.width-9,24,'hud_ic_sugar').setDisplaySize(13,13));}
    this.hudBtnArtSync(); if(this._hudPipRedo){ this._hudPipRedo=false; this.drawWavePips?.(); } return true; }
  hudPipsArt(list){ const L=this._hudL; if(!L)return; if(list&&list.length)this.tuFrames('hud_wave_pips');
    (list||[]).forEach((p,i)=>{ let im=L.pips[i]; if(!im||!im.active){ im=L.pips[i]=this.add.image(0,0,'hud_wave_pips','cell0'); im._pip=1; L.c1.add(im); }
      im.setFrame('cell'+p[2]).setPosition(p[0],p[1]).setDisplaySize(p[3],p[3]).setVisible(true); });
    for(let i=(list||[]).length;i<L.pips.length;i++)L.pips[i]?.setVisible?.(false); }
  hudBtnArtSync(){ const B=this.hudBtnC; if(!B)return; const on=!!this._hudArt;
    if(!on){ if(this._hudBtns)this.hudArtClear(); return; }
    let H=this._hudBtns; if(!H){ ['hud_round_btn','hud_speed_ring','hud_ic_sound'].forEach(k=>this.tuFrames(k)); H=this._hudBtns={};
      for(const k of ['speed','pause','mute'])H[k]=this.add.image(0,0,'hud_round_btn','cell0');
      H.ring=this.add.image(0,0,'hud_speed_ring','cell0'); H.pi=this.add.image(0,0,'hud_ic_pause'); H.mi=this.add.image(0,0,'hud_ic_sound','cell0'); B.add([H.speed,H.pause,H.mute,H.ring,H.pi,H.mi]); }
    const now=this.time?.now||0,pr=this._hudPress,gs=this.gameSpeed||1;
    for(const [k,b] of [['speed',this.speedBtn],['pause',this.pauseBtn],['mute',this.muteBtn]]){ if(!b)continue; b.setAlpha(0);
      const f=pr&&pr.k===k&&now-pr.t<140&&this.state!=='paused'?2:(k==='speed'&&gs>1?1:0); H[k].setFrame('cell'+f).setDisplaySize(36,36).setPosition(b.x,b.y).setVisible(!!b.visible); }
    const sb=this.speedBtn,pb=this.pauseBtn,mb=this.muteBtn;
    if(sb)H.ring.setFrame('cell'+Phaser.Math.Clamp(gs-1,0,3)).setDisplaySize(36,36).setPosition(sb.x,sb.y).setVisible(!!sb.visible);
    const showP=!!pb?.visible&&this.state!=='paused'; if(pb)H.pi.setPosition(pb.x,pb.y).setDisplaySize(17,17).setVisible(showP); this.pauseTxt?.setAlpha(showP?0:1);
    if(mb)H.mi.setFrame('cell'+(Sfx.muted?1:0)).setDisplaySize(18,18).setPosition(mb.x,mb.y).setVisible(!!mb.visible); this.muteTxt?.setAlpha(0);
  }
  hudVisible(v){ this._hudLayoutKey=null;this.hudList.forEach(o=>o.setVisible(v));this.sesRuneRefreshUI?.(v); this.traitTxt?.setVisible(!!(v&&this._runTrait)); if(v){this.refreshFlickerUI();this.renderWaveObjectiveHUD();if(this.replayProgressFrame)this.replayProgressFrame.setVisible(!!this._replayMeter&&this.mode==='wave');if(this.replayProgressFill)this.replayProgressFill.setVisible(!!this._replayMeter&&this.mode==='wave'&&this._replayMeter.kills>0);} if(this.skillBar)this.skillBar.setVisible(v); if(!v){for(const o of [...(this._hst62?.icons||[]),...(this._hst62?.nums||[])])o.setVisible(false);this.hudLiqG?.setVisible(false);this.hudBossLiqG?.setVisible(false);this._bossPipImg?.setVisible(false);} if(!v&&this.lowHpVig){this._lowHpOn=false;this.lowHpVig.setAlpha(0).setVisible(false);} }
  drawBars(){
    const pad=this._pad, g=this.barG; if(!g)return; g.clear();
    this.drawCombatHUDPanels?.(g);
    const art=this.hudArtSync?.();
    this.drawLiquidBar?.(); this.hudJuice?.();
    const bx=78, bw=Math.max(30,this.W-218);
    const hpf=Phaser.Math.Clamp(this.player.hp/this.player.maxhp,0,1);
    const xpf=Phaser.Math.Clamp(this.xp/this.xpNext,0,1);
    // เอาหลอด HP ด้านบนออก (ย้ายไปNorthหัวผู้เล่นแทน) · เหลือแถบ XP บาง ๆ ไว้ดูความคืบหน้าเลเวล
    if(this.hpIcon)this.hpIcon.setVisible(false); if(this.xpIcon?.visible)this.xpIcon.setVisible(false);   // v8.0.11 หลอด EXP ข้างบนเอาออก (มีใต้ตัวผู้เล่นแล้ว)

    this.drawOverheadStatus(hpf);
    // v4.64: HUD แนวตั้งโล่งขึ้น — บรรทัดสแตตเหลือแค่ Relic/โล่ (HP อยู่เหนือหัวผู้เล่นแล้ว · สแตตรบย้ายไปหน้า Pause)
    if(this.statTxt){const held=this.relics||[],rel=held.length?'🔮 '+held.slice(0,5).map(k=>RELICS[k].emoji).join(' ')+(held.length>5?' +'+(held.length-5):''):'',sh=(this._shield||0)>0?'🫧×'+this._shield:'';

      const fb=this._forgeState&&this._forgeState.barrierUntil>(this.elapsed||0)?this._forgeState.barrier:0;this.statTxt.setText((this._hudStatusIcons?[rel]:[rel,sh,fb>0?'Barrier '+Math.ceil(fb):'']).filter(Boolean).join('   '));   /* v8.0.85 มีไอคอนใบ 62 = โล่/Barrier เป็นไอคอนแทน */ }
    // บรรทัดชื่อด่านโชว์ 6 วิแรกของด่านแล้วจางหาย (ดูซ้ำได้ในหน้า Pause)
    if(this.stageTxt&&this.stageTxt.alpha)this.stageTxt.setAlpha(0);   // v8.0.11 ชื่อด่านอยู่ในม่านเปิดด่าน/หน้า Pause แล้ว

  }
  // หลอดเลือด+เลเวลNorthหัวผู้เล่น (แบบ Archero) — screen-space คำนวณจากกล้อง ให้ติดตัวเสมอ
  drawOverheadStatus(hpf){
    const og=this.pOverG; if(!og||!this.player)return;
    const cam=this.cameras.main, wv=cam.worldView; if(!wv||!wv.width||!wv.height){ og.clear(); og._k=NaN; return; }
    // แปลงPositionผู้เล่น (world) → พิกัดจอ logical (0..this.W/H) ที่ uiCam ใช้ · หาร width/height กัน DPR/zoom
    const ox=(this.player.x-wv.x)/wv.width*this.W;
    // v6.96 แถบสถานะใต้เท้า: ป้ายเลเวลซ้าย + หลอด HP (มีตัวเลข) + หลอด EXP บาง ๆ ข้างใต้
    let oy=(this.player.y-wv.y)/wv.height*this.H + 30;
    oy=Phaser.Math.Clamp(oy, this._pad+66, this.H-150);   // กันหลุดขอบบน/ล่าง
    const w=60,h=10,xh=4,bs=h+xh+3,bx=ox-w/2+bs/2+1,lx=bx-bs-3;
    const xf=Phaser.Math.Clamp((this.xp||0)/Math.max(1,this.xpNext||1),0,1),hpN=Math.max(0,Math.ceil(this.player.hp)),mxN=Math.round(this.player.maxhp),lvN=this.level||1;
    // v7.8.92 perf: วาดที่จุดเดิมแล้วเลื่อน graphics ตามผู้เล่น · วาดใหม่/ตั้งข้อความเฉพาะเมื่อเลือด/EXP/เลเวลเปลี่ยน
    const yf=this.yuzuOrchFrac?this.yuzuOrchFrac():-1;   // v7.9.42 แถบโตของสวน Yuzu
    og.setPosition(ox,oy); const rb=bx-ox,rl=lx-ox,k=hpN*7919+mxN*31+lvN*1000003+Math.round(xf*w)+(yf>=0?(Math.round(yf*w)+1)*65537:0);
    if(og._k!==k){ og._k=k; og.clear();
      og.fillStyle(0x000000,0.55); og.fillRoundedRect(rl-2,-2,bs+3+w+4,bs+4+(yf>=0?5:0),5);
      if(yf>=0){ og.fillStyle(0x1c2a14,1); og.fillRect(rb,h+xh+5,w,3); if(yf>0){ og.fillStyle(0x9be36f,1); og.fillRect(rb,h+xh+5,Math.max(1,w*yf),3); } }
      og.fillStyle(0x3a3150,1); og.fillRoundedRect(rl,0,bs,bs,4); og.lineStyle(1.5,0xffe27a,0.85); og.strokeRoundedRect(rl,0,bs,bs,4);
      og.fillStyle(0x3a1a24,1); og.fillRoundedRect(rb,0,w,h,3);
      const col=hpf>0.5?0x5ef07a:(hpf>0.25?0xffd166:0xff5f5f);
      if(hpf>0){ og.fillStyle(col,1); og.fillRoundedRect(rb,0,Math.max(3,w*hpf),h,3); }
      og.lineStyle(1,0xffffff,0.25); og.strokeRoundedRect(rb,0,w,h,3);
      og.fillStyle(0x1c1530,1); og.fillRect(rb,h+3,w,xh); if(xf>0){ og.fillStyle(0xffa63d,1); og.fillRect(rb,h+3,Math.max(1,w*xf),xh); }
      if(this.pOverHp)this.pOverHp.setText(hpN+' / '+mxN); if(this.pOverLv)this.pOverLv.setText(String(lvN)); }
    if(this.pOverHp)this.pOverHp.setPosition(bx+w/2,oy+h/2+0.5);
    if(this.pOverLv)this.pOverLv.setPosition(lx+bs/2,oy+bs/2+0.5);
  }
  // 🎮 ปุ่ม Dash/Unique ตาม Settings: ขนาด (ctrlSize 0-2) + ฝั่ง (ctrlLeft = ถนัดซ้าย)
  ctrlScale(){ const st=Save.data.settings||{}; return [1,1.2,1.4][st.ctrlSize||0]||1; }
  layoutControls(){ if(!this.dashBtn||!this.uniqueBtn)return; const st=Save.data.settings||{},k=this.ctrlScale(),r=36*k;
    const x=st.ctrlLeft?22+r:this.W-22-r, dy=this.H-42-r, uy=dy-r*2-30*k;
    this.dashBtn.setPosition(x,dy).setRadius(r); this.dashTxt.setPosition(x,dy).setScale(k);
    this.uniqueBtn.setPosition(x,uy).setRadius(r); this.uniqueTxt.setPosition(x,uy-6*k).setScale(k);
    this.uniqueHint?.setPosition(x,uy+19*k).setScale(k);
    const fx=x+(st.ctrlLeft?1:-1)*(r+12*k+31*k);
    this.sesRuneLayout?.();this.flickerBtn?.setPosition(fx,uy).setSize(62*k,46*k);this.flickerTxt?.setPosition(fx,uy).setScale(k);this.drawCombatControlBase?.(); }
  drawDashRing(){
    const g=this.dashRing; if(!g)return; const b=this.dashBtn; if(!b||!b.visible){ g.clear(); g._sk=NaN; this._dpTxt&&this._dpTxt.setVisible(false); return; }
    { let k; if(this.character==='cocoa'&&this._dpCh!=null){ const mx=this.cocoaDashMax(),ch=this._dpCh,f=ch<mx?Math.round(Phaser.Math.Clamp((this._dpT||0)/this.cocoaDashRecharge(),0,1)*120):121; k=1e7+((ch*16+mx)*16+(this._cocoaPhantom?.charges||0))*128+f; }
      else k=(!this.dashReady&&this.dashCd>0)?Math.round(Phaser.Math.Clamp(1-this.dashCd/(this.dashCdMax||1.1),0,1)*120):-1;
      if(g._sk===k&&g._sx===b.x&&g._sy===b.y&&g._sr===b.radius)return; g._sk=k;g._sx=b.x;g._sy=b.y;g._sr=b.radius; }   // v7.8.92 perf: วาดใหม่เมื่อค่าเปลี่ยนเท่านั้น
    g.clear();
    if(this.character==='cocoa'&&this._dpCh!=null){ const mx=this.cocoaDashMax(),ch=this._dpCh;const temp=this._cocoaPhantom?.charges||0;if(temp){g.lineStyle(3,0xc9a3ff,.9);for(let i=0;i<temp;i++)g.strokeCircle(b.x+(i-(temp-1)/2)*12,b.y-b.radius-13,3);}   // v5.70 จุดชาร์จ Dash รอบปุ่ม
      if(ch<mx){ const f=Phaser.Math.Clamp((this._dpT||0)/this.cocoaDashRecharge(),0,1); g.lineStyle(3.5,0xffa54d,0.9).beginPath(); g.arc(b.x,b.y,b.radius+4,-Math.PI/2,-Math.PI/2+TAU*f,false); g.strokePath(); }
      else g.lineStyle(2,0xffd9a8,0.5).strokeCircle(b.x,b.y,b.radius+4);
      for(let i=0;i<mx;i++){ const an=-Math.PI/2+(i-(mx-1)/2)*0.32; g.fillStyle(i<ch?0xffc233:0x3a2a1a,1).fillCircle(b.x+Math.cos(an)*(b.radius+12),b.y+Math.sin(an)*(b.radius+12),5); }
      return; }
    if(!this.dashReady && this.dashCd>0){
      const frac=Phaser.Math.Clamp(1-this.dashCd/(this.dashCdMax||1.1),0,1);
      g.lineStyle(3.5,0x66d3b3,0.9); g.beginPath();
      g.arc(b.x,b.y,b.radius+4,-Math.PI/2,-Math.PI/2+Math.PI*2*frac,false); g.strokePath();
    } else { g.lineStyle(2,0xbff3e8,0.35); g.strokeCircle(b.x,b.y,b.radius+4); }
  }
  syncUniqueIcon(){const tx=this.uniqueTxt;if(!tx)return;const tp=this.basicAttack?.path,ik=this.character!=='taro'?null:tp==='smite'?'ic_taro_storm_mark':tp==='tempest'?'ic_taro_overcharge':'ic_taro_plasma_field',want=!!ik&&this.textures?.exists?.(ik);   /* v7.8.30 ไอคอน Unique ตาม Build */
    if(want&&!this.uniqueImg?.active)this.uniqueImg=this.camUI(this.add.image(tx.x,tx.y,ik).setScrollFactor(1).setDepth(51));if(want&&this.uniqueImg?.active&&this.uniqueImg.texture.key!==ik)this.uniqueImg.setTexture(ik);
    if(this.uniqueImg?.active){this.uniqueImg.setVisible(!!want&&tx.visible).setPosition(tx.x,tx.y+6*tx.scaleY).setDisplaySize(52*tx.scaleX,52*tx.scaleY);}tx.setAlpha(want&&this.uniqueImg?.active?0:1);}
  drawUniqueRing(){
    this.sesRuneRefreshUI?.();
    const g=this.uniqueRing,b=this.uniqueBtn;this.syncUniqueIcon?.();if(!g||!b)return;g.clear();if(!b.visible)return;const u=this.uniqueInfo();this.updateUniqueHint();this.refreshFlickerUI();
    if(this.isSesRune?.()&&!u.ready){this.uniqueTxt.setAlpha(.35);g.lineStyle(1,0x7d7285,.5).strokeCircle(b.x,b.y,b.radius+4);return;}
    { const mx=this.lanceChMax?.()||1; if(mx>1){ const have=(this.uniqueCd<=0?1:0)+(this._lnBank|0); for(let k=0;k<mx;k++){ const a=-Math.PI/2+(k-(mx-1)/2)*.42,px=b.x+Math.cos(a)*(b.radius+13),py=b.y+Math.sin(a)*(b.radius+13); g.fillStyle(k<have?0x9fe8ff:0x2a3a4a,1).fillCircle(px,py,4); g.lineStyle(1.5,0xffffff,.85).strokeCircle(px,py,4); } } }   // v8.0.9 จุดชาร์จ Lance
    if(this._snipe){const charge=this.snipeCharge();g.lineStyle(2,u.color,.35).strokeCircle(b.x,b.y,b.radius+4);g.lineStyle(4,charge>=1?0xffd166:0xffffff,1).beginPath();g.arc(b.x,b.y,b.radius+4,-Math.PI/2,-Math.PI/2+TAU*charge,false);g.strokePath();this.uniqueTxt.setAlpha(1);return;}
    if(this.uniqueCd>0){const frac=Phaser.Math.Clamp(1-this.uniqueCd/(this.isSesRune?.()?(this._sesRune?.cdMax?.[u.key]||this.uniqueCooldown(u)):this.uniqueCooldown(u)),0,1);g.lineStyle(3.5,u.color,0.95);g.beginPath();g.arc(b.x,b.y,b.radius+4,-Math.PI/2,-Math.PI/2+Math.PI*2*frac,false);g.strokePath();this.uniqueTxt.setAlpha(0.48);}else{g.lineStyle(2,u.color,0.42);g.strokeCircle(b.x,b.y,b.radius+4);this.uniqueTxt.setAlpha(1);this.uniqueReadyGlow?.(g,b,u.color);}
    if(this.uniqueCd>0)this._uqReadyAt=null;
  }
  /* แถบ "Owned" — โชว์Attack Skill + Passiveที่มีตอนนี้ (ใช้ในเลเวลอัพ/หยุดเกม) · คืน y ล่างสุด */
  drawHeldBar(cont, topY){
    const landscape=this.W>this.H, chip=landscape?26:30, gap=landscape?4:5;
    const rowFn=(y,label,labelColor,keys,emojiOf,lvlOf,chipColor,awkOf,isPass,labelX,chipX0)=>{
      const lab=this.add.text(labelX,y+chip/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:labelColor}).setOrigin(0,0.5);
      cont.add(lab);
      chipX0=Math.max(chipX0,labelX+lab.width+8);   // v4.63: เริ่มไอคอนหลังป้ายจริง (เดิม x คงที่ → ไอคอนทับคำว่า Skills/Relics)
      if(!keys.length){ const none=this.add.text(chipX0,y+chip/2,'— none yet',{fontFamily:'sans-serif',fontSize:'11px',color:'#6a6078'}).setOrigin(0,0.5); cont.add(none); return; }
      let x=chipX0;
      keys.forEach(k=>{ const awk=awkOf&&awkOf(k), lvl=lvlOf(k), ik=awk?null:(label.includes('Relic')&&this.textures.exists('relic_'+k)?'relic_'+k:this.iconKey(k,isPass));
        let g;if(this.tuHas('lvl_held_chip_sheet')){this.tuFrames('lvl_held_chip_sheet');g=this.add.image(x,y,'lvl_held_chip_sheet','cell'+(awk?1:0)).setOrigin(0).setDisplaySize(chip,chip);}   // v7.8.59 ใบ 23 B1
        else{g=this.add.graphics(); g.fillStyle(0x2c2338,0.95); g.fillRoundedRect(x,y,chip,chip,7);
        g.lineStyle(1.5,awk?0xffcf5a:chipColor,awk?1:0.9); g.strokeRoundedRect(x,y,chip,chip,7);}
        const em = ik ? this.add.image(x+chip/2,y+chip/2-1,ik).setDisplaySize(chip*0.82,chip*0.82)
                      : this.add.text(x+chip/2,y+chip/2-1,emojiOf(k),{fontSize:'15px'}).setOrigin(0.5);
        const lt=this.add.text(x+chip-3,y+chip-2,awk?'⚡':String(lvl),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffe08a'}).setOrigin(1,1);
        cont.add([g,em,lt]); x+=chip+gap; });
    };
    const atk=Object.keys(this.skills||{}), pas=Object.keys(this.passives||{}), rel=(this.relics||[]).slice(), useRel=this.usesBasicAttackBuild();   // character-first ไม่มี passive → แถวนี้โชว์ Relic
    if(landscape){
      const half=this.W/2;
      rowFn(topY,'⚔️ Skills','#f0a54a',atk,k=>SKILLDEFS[k]?SKILLDEFS[k].emoji:'❓',k=>this.skills[k],0xf0a54a,k=>this.skills[k]>=SKILL_AWAKEN_LV,false,12,58);
      if(useRel)rowFn(topY,'🔮 Relics','#c9a0ff',rel,k=>RELICS[k].emoji,()=>'',0xc07bff,null,true,half+4,half+48);
      else rowFn(topY,'✨ Passives','#66d3b3',pas,k=>PASSIVES[k]?PASSIVES[k].emoji:'❓',k=>this.passives[k],0x66d3b3,null,true,half+4,half+48);
      return topY+chip+6;
    }
    rowFn(topY,       '⚔️ Skills','#f0a54a', atk, k=>SKILLDEFS[k]?SKILLDEFS[k].emoji:'❓', k=>this.skills[k], 0xf0a54a, k=>this.skills[k]>=SKILL_AWAKEN_LV, false,20,58);
    if(useRel)rowFn(topY+chip+8,'🔮 Relics','#c9a0ff',rel,k=>RELICS[k].emoji,()=>'',0xc07bff,null,true,20,58);
    else rowFn(topY+chip+8,'✨ Passives',  '#66d3b3', pas, k=>PASSIVES[k]?PASSIVES[k].emoji:'❓', k=>this.passives[k], 0x66d3b3, null, true,20,58);
    return topY+chip*2+8+6;
  }
  /* พาเนล "Cookable Recipes" — โชว์เป้าหมาย recipe/evolution แบบ Survivor.io: อาวุธ + passive ที่ต้องเก็บ = เมนู
     คืนค่า y ล่างสุด · ใช้ทั้งหน้าเลเวลอัพและหน้าหยุดเกม */
  /* แถบไอคอนสกิลด้านล่าง — บอกว่ามีสกิลอะไร เลเวลเท่าไหร่ */
  buildSkillBar(){
    if(this.skillBar)this.skillBar.destroy();
    this.skillBar=this.add.container(0,0).setScrollFactor(1).setDepth(53);
    this.camUI(this.skillBar);
    this.skillChips={};
    const keys=Object.keys(this.skills); if(!keys.length){ this.checkCombos(); return; }
    const cw=Math.min(38,Math.floor((this.W-16)/keys.length)), rad=Math.min(16,cw/2-3), fs=Math.round(rad)+'px';
    const total=keys.length*cw; let x=this.W/2-total/2+cw/2; const y=this.H-32;
    const tray=this.add.graphics();tray.fillStyle(0x20182b,.94).fillRoundedRect(this.W/2-total/2-7,y-22,total+14,44,12);tray.lineStyle(1,0xd4b178,.4).strokeRoundedRect(this.W/2-total/2-7,y-22,total+14,44,12);this.skillBar.add(tray);
    keys.forEach(k=>{
      const d=SKILLDEFS[k], lvl=this.skills[k], awk=lvl>=SKILL_AWAKEN_LV, maxed=lvl>=d.max;
      const bg=this.add.circle(x,y,rad,0x2c2338,0.72).setStrokeStyle(2,awk?0xffb020:(maxed?0xffd166:0xff8fb5),awk?1:0.9);
      const ik=awk?null:this.iconKey(k,false);
      let em; if(ik){ em=this.add.image(x,y-1,ik).setDisplaySize(rad*1.85,rad*1.85); em._baseScale=em.scaleX; }
      else { em=this.add.text(x,y-1,awk&&d.awaken?d.awaken.emoji:d.emoji,{fontSize:fs}).setOrigin(0.5); em._baseScale=1; }
      // ป้ายเลเวลอ่านชัด: จานพื้นเข้ม + ตัวอักษรใหญ่ขึ้น + เส้นขอบ (เดิมเลขจมทับไอคอนอ่านไม่ออก)
      const bx=x+rad*0.62,by=y+rad*0.62,lbl=awk?'⚡':(maxed?'MAX':String(lvl));
      const badge=this.add.circle(bx,by,maxed&&!awk?9.5:7.5,0x1c1526,0.96).setStrokeStyle(1.5,awk?0xffcf40:(maxed?0xffd166:0xff8fb5),1);
      const lv=this.add.text(bx,by,lbl,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:maxed&&!awk?'8px':'11px',color:awk?'#ffe08a':(maxed?'#ffe08a':'#ffffff'),stroke:'#000000',strokeThickness:2}).setOrigin(0.5);
      this.skillBar.add([bg,em,badge,lv]); this.skillChips[k]={bg,em};
      x+=cw;
    });
    this.skillBar.setVisible(false);   /* v8.1.88 เจ้าของ: เอาแถบไอคอนสกิลล่างจอออก (ดูสกิลได้ในหน้าหยุดเกม) */
    this.checkCombos();
  }
  // ไอคอนรูปจริงของสกิล/พร (ถ้าอาร์ตทำมา) — None=คืน null (ใช้อีโมจิแทน)
  iconKey(key,isPass){ const ik=(isPass?PASS_ICON:SKILL_ICON)[key]; return (ik&&this.textures.exists(ik))?ik:null; }
  pulseSkill(k){ const c=this.skillChips&&this.skillChips[k]; if(!c)return; const bs=c.em._baseScale||1;
    this.tweens.add({targets:[c.em],scale:{from:bs*1.4,to:bs},duration:240,ease:'Back.out'});
    this.tweens.add({targets:[c.bg],scale:{from:1.25,to:1},duration:240,ease:'Back.out'}); }
  /* ---- ระบบทำอาหาร (Recipe) — วัตถุดิบ(Attack Skill a) + เครื่องปรุง(Passive b) = Cook Dish ----
     ปลุก COMBOS เดิมที่เคยตายให้กลับมามีความหมาย: มีคู่ครบ = "Cook Dish" timesเดียว → บัฟเล็ก + โมเมนต์ทำอาหาร */
  checkCombos(){
    this.comboFlags={};
    if(!this.combosOwned)this.combosOwned={};
    for(const c of COMBOS){
      const hasA=(this.skills&&this.skills[c.a]>0);
      const hasB=(this.passives&&this.passives[c.b]>0);
      if(hasA&&hasB){
        this.comboFlags[c.key]=true;
        // เอาระบบ codex ปรุง (cookbook/banner/discover) ออก — คงเฉพาะโบนัส combo แบบเงียบ ๆ กันบิลด์เสียบาลานซ์
        if(!this.combosOwned[c.key]){ this.combosOwned[c.key]=true;
          if(this.player){ if(c.effect)c.effect(this.player); else this.player.dmgMul=(this.player.dmgMul||1)+0.05;
            clampPlayerStats(this.player);this.player.baseSpeed=Math.min(BALANCE.moveSpeed*1.35,this.player.baseSpeed); } }
      }
    }
  }
  // Cook Dishใหม่: บัฟดาเมจเล็ก (prototype) + แบนเนอร์ "Dish Cooked!" + เสียง
  cookDish(c){
    if(this.player){
      if(c.effect)c.effect(this.player); else this.player.dmgMul=(this.player.dmgMul||1)+0.05;
      clampPlayerStats(this.player);this.player.baseSpeed=Math.min(BALANCE.moveSpeed*1.35,this.player.baseSpeed);
    }
    const ai=SKILLDEFS[c.a], bi=PASSIVES[c.b];
    const recipe=((ai&&ai.emoji)||'🍬')+' + '+((bi&&bi.emoji)||'✨');
    this.dishCount=(this.dishCount||0)+1;
    // สมุดสูตร: ค้นพบครั้งแรก = รางวัล Sugar ถาวร + ป้ายพิเศษ
    const rew=Save.discoverDish(c.key,c.sig);
    const head=(c.sig?'⭐ Signature dish! ':'🍳 Dish cooked! ')+c.emoji+' '+c.name;
    let sub=recipe+' → '+c.desc; if(rew>0)sub='🆕 New recipe! +🍬'+rew+' · '+c.desc;
    this.showBanner(head, sub, c.sig?2100:1700);   // รางวัลค้นพบเข้าคลัง Sugar ถาวรทันที (Save.discoverDish บันทึกแล้ว)
    Sfx.clear(); if(Sfx.pop)Sfx.pop();
  }

  // zoom กล้องให้ "visible field width" คงที่ทุกเครื่อง (อ้างอิงมือถือ ~430px) — แท็บเล็ตจอกว้าง = zoom เข้ามากขึ้น ตัวละครไม่เล็กจิ๋ว
  computeViewZoom(){ const REF_W=430, BASE=0.74/1.2;   /* v8.3.13 เจ้าของ: เห็นแผนที่กว้างขึ้น 20% */   /* v8.1.161 เจ้าของ: ใกล้ไป → 0.74 (ถอยกล้อง ~5%) */   /* v6.95.1 wider view (was .76) · v8.1.118 เจ้าของ: ไกลไป → 0.78 (ใกล้ขึ้น ~11%) */ this.viewZoom=BASE*Phaser.Math.Clamp((this.W||REF_W)/REF_W,1,2.4); }
  // ซูมออกระหว่างบอสด้วย lerp ต่อเฟรม เพื่อให้เห็นสนามกว้างและทำงานสม่ำเสมอทุกอุปกรณ์
  applyMainZoom(){ if(this.cameras&&this.cameras.main)this.cameras.main.setZoom((this.viewZoom||1)*RENDER_DPR*(this._bossZoom||1)); }
  tickBossZoom(){
    const want=(this.mode==='boss'?0.58*1.2/1.08:(this.mode==='mini'?0.68*1.2/1.08:1))   /* v8.3.13 บอส/มินิบอส ถอยเพิ่มแค่ 8% จากเดิม */*(this.boss?._big?.stage==='charge'?1.14:1)*(this._snipe&&(this._snipe.kind!=='yuzu'||performance.now()-this._snipe.t0>250)?0.72:1);   // v8.0.65 Yuzu tap = no zoom pulse   // v6.0.66 ชาร์จสไนเปอร์ = ซูมออก
    if(this._bossZoom==null)this._bossZoom=1;
    if(Math.abs(this._bossZoom-want)>0.003){this._bossZoom+=(want-this._bossZoom)*0.10;this.applyMainZoom();}
    else if(this._bossZoom!==want){this._bossZoom=want;this.applyMainZoom();}
  }
  miniIntro(b){
    // เอา cutscene แพนกล้องออก (ตาม feedback) — เหลือแค่ flash/shake สั้น ๆ กล้องยังตามผู้เล่น สู้ต่อได้ทันที
    if(!b||!b.active)return;const st=STAGES[this.stageIndex];
    b.atkCd=Math.max(b.atkCd||0,1.2);this.screenFlash(st&&st.tint?st.tint:0xff4d8f,0.14,300);this.screenShake(200,0.008);
  }
  onResize(gs){
    if(!gs)return; this.W=gs.width/RENDER_DPR; this.H=gs.height/RENDER_DPR; this.computeViewZoom(); const pad=this._pad; this._barW=this.W-2*pad;
    if(this.cameras&&this.cameras.main){ this.cameras.main.setSize(gs.width,gs.height); this.applyMainZoom(); }
    if(this.uiCam){ this.uiCam.setSize(gs.width,gs.height); this.uiCam.setZoom(RENDER_DPR); this.uiCam.centerOn(this.W/2,this.H/2); }
    if(this.vig)this.vig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H); if(this.moodVig?.active)this.moodVig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H);
    if(this.lowHpVig)this.lowHpVig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H);
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-58,this.H-78); this.dashTxt.setPosition(this.W-58,this.H-78);
      if(this.uniqueBtn){this.uniqueBtn.setPosition(this.W-58,this.H-78-80);this.uniqueTxt.setPosition(this.W-58,this.H-78-80);}
      this.layoutControls();
      this.lvlTxt.setPosition(pad,pad+34); this.killTxt.setPosition(pad,pad+56); this.traitTxt?.setPosition(pad,pad+74);
      if(this.statTxt)this.statTxt.setPosition(pad,pad+75);
      if(this.runSugarTxt)this.runSugarTxt.setPosition(this.W-pad,pad+56);
      this.timeTxt.setPosition(this.W/2,pad+34).setWordWrapWidth(this.W-150);
      this.stageTxt.setPosition(this.W/2,pad+56).setWordWrapWidth(this.W-40);
      if(this.skills&&(this.state==='play'||this.state==='levelup')){ this.buildSkillBar(); this.drawWavePips(); }
      const cbY=pad+14;
      if(this.muteBtn){ this.muteBtn.setPosition(this.W-26,cbY); this.muteTxt.setPosition(this.W-26,cbY); }
      if(this.pauseBtn){ this.pauseBtn.setPosition(this.W-70,cbY); this.pauseTxt.setPosition(this.W-70,cbY); }
      if(this.speedBtn){ this.speedBtn.setPosition(this.W-114,cbY); this.speedTxt.setPosition(this.W-114,cbY); }
      if(this.state==='paused') this.buildPause();
      const meterW=Math.min(350,this.W-34),meterY=pad+HUD_ROWS.progress;
      if(this.waveObjTxt)this.waveObjTxt.setPosition(this.W/2,pad+HUD_ROWS.objective);
      if(this.replayProgressFrame)this.replayProgressFrame.setPosition(this.W/2,meterY).setDisplaySize(meterW,33);
      if(this.replayProgressFill)this.replayProgressFill.setPosition(this.W/2-meterW*.435,meterY).setDisplaySize(meterW*.87,15);
      if(this.waveObjBg)this.waveObjBg.setPosition(this.W/2,pad+131).setDisplaySize(Math.min(230,this.W-84),7);
      if(this.waveObjBar)this.waveObjBar.setPosition(this.W/2-Math.min(230,this.W-84)/2,pad+132);
      this.bossName.setPosition(this.W/2,pad+HUD_ROWS.bossName); this.bossBgW.setPosition(this.W/2,pad+HUD_ROWS.bossBg); this.bossBgW.width=this._barW*0.8;
      this.bossBar.setPosition(this.W/2-(this._barW*0.8)/2+2,pad+HUD_ROWS.bossBar);
      if(this.bossHpTxt)this.bossHpTxt.setPosition(this.W/2,pad+HUD_ROWS.bossHp);
      this.bannerT.setPosition(this.W/2,this.H*0.32); this.bannerS.setPosition(this.W/2,this.H*0.4); this.layoutCombatHUD(); }
    if(this.state==='menu') this.buildStartMenu();
    if(this.state==='startskill')this.openStartingSkillChoice();
    if(this.state==='dead') this.buildOver();
  }

  /* ---------- MENUS ---------- */
  buildMenus(){
    this.menu=this.add.container(0,0).setScrollFactor(1).setDepth(100);
    this.lvlUp=this.add.container(0,0).setScrollFactor(1).setDepth(100).setVisible(false);
    this.storyLayer=this.add.container(0,0).setScrollFactor(1).setDepth(118).setVisible(false);
    this.over=this.add.container(0,0).setScrollFactor(1).setDepth(100).setVisible(false);
    this.buildStartMenu();
  }
  /* ===== HUB MENU + SUB-SCREENS (tap-zone hit-test) ===== */
  _zone(x,y,w,h,fn,sound='click'){ this.tapZones.push({x,y,w,h,fn,sound}); }
  // ปุ่มลูกกวาด (รูปจริง) — สตWaitว์เบอร์รีอยู่ซ้าย ข้อความเลื่อนไปขวา · มี fallback graphics ถ้ารูปโหลดไม่ได้
  _lighten(c,amt){ const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
    return ((Math.round(r+(255-r)*amt))<<16)|((Math.round(g+(255-g)*amt))<<8)|Math.round(b+(255-b)*amt); }
  _darken(c,amt){ const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
    return ((Math.round(r*(1-amt)))<<16)|((Math.round(g*(1-amt)))<<8)|Math.round(b*(1-amt)); }
  // ปุ่มแบนโมเดิร์น: โค้งมน + ไล่เฉด + กลอสบน + ไอคอนcircleซ้าย + เงานุ่ม
  uiPillBtn(cont, cx, cy, w, h, color, emoji, label, fn){
    const chrome=this.controlTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',muted:'#cfc1d4',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d,edge:0xf4d9a1};
    const r=Math.min(h*0.36,24), x=cx-w/2, y=cy-h/2, g=this.add.graphics();
    g.fillStyle(0x000000,0.26); g.fillRoundedRect(x,y+5,w,h,r);                                  // เงาใต้ปุ่ม
    g.fillGradientStyle(this._lighten(color,0.22),this._lighten(color,0.22),color,color,1); g.fillRoundedRect(x,y,w,h,r);  // ตัวปุ่มไล่เฉด
    g.fillStyle(0xffffff,0.10); g.fillRoundedRect(x+4,y+4,w-8,h*0.40,{tl:r,tr:r,bl:5,br:5});     // กลอสบน
    g.lineStyle(1.5,this._lighten(color,0.45),0.7); g.strokeRoundedRect(x,y,w,h,r);                 // ขอบสว่าง
    cont.add(g);
    const icx=x+h*0.56, ig=this.add.graphics(); ig.fillStyle(this._darken(color,0.14),0.55); ig.fillCircle(icx,cy,h*0.32); cont.add(ig);
    const em=this.add.text(icx,cy-1,emoji,{fontSize:Math.round(h*0.4)+'px'}).setOrigin(0.5); cont.add(em);
    const t=this.add.text(x+h*1.06,cy,label,{fontFamily:chrome.font,fontStyle:'bold',fontSize:Math.round(h*0.34)+'px',color:chrome.text}).setOrigin(0,0.5);
    t.setShadow(0,1,'rgba(0,0,0,0.32)',2); cont.add(t);
    if(fn)this._zone(x,y,w,h,fn); }
  // ป้ายเมนูแฟนตาซี: กWaitบโลหะสองชั้น + ตราอัญมณี + แสงเฉพาะหมวด
  // v5.67 ปุ่มเล็ก: แทนอีโมจิหน้าข้อความด้วยอาร์ต tile_*
  _smallBtnIcon(t,key){ if(!t||!this.textures.exists(key))return; t.setText(t.text.replace(/^\S+\s/,'')); const sz=24, x=t.x-t.width/2-sz/2+8; t.x+=sz/2-2; const im=this.add.image(x,t.y,key).setDisplaySize(sz,sz); this.menu.add(im); }
  _coverImage(x,y,w,h,key){
    const img=this.add.image(x+w/2,y+h/2,key).setOrigin(0.5),fw=img.frame.realWidth||img.frame.width,fh=img.frame.realHeight||img.frame.height;
    // cover-crop: สเกลเท่ากันทั้งสองแกนให้ภาพคลุมFullกล่อง แล้วคWaitบ texture ตรงกลางให้พอดี w×h
    // (เดิมใช้ setDisplaySize(w,h) หลัง crop ทำให้สเกลเพี้ยน ภาพคลุมไม่Full เห็นพื้นด้านหลังโผล่ขอบบน)
    const scale=Math.max(w/fw,h/fh),cw=w/scale,ch=h/scale;
    img.setScale(scale).setCrop((fw-cw)/2,(fh-ch)/2,cw,ch);return img;
  }
  // การ์ดบทแบบภาพประกอบ — ภาพฉากจริง + overlay อ่านง่าย + status ที่เป็นส่วนหนึ่งของกWaitบ
  // v4.61: สถานะพลังเทียบค่าแนะนำของด่าน — ใช้ทั้งการ์ดด่านและหน้าเลือกความยาก
  powerStatus(idx){ const st=STAGES[idx]||STAGES[0],cur=Save.power(Save.data.character),rec=stageRecommendedPower(STAGES.indexOf(st)),ratio=cur/rec;
    const t=ratio>=1.15?{label:'💪 Strong',color:0x66e0a0}:ratio>=0.9?{label:'✅ Ready',color:0x8fe3d0}:ratio>=0.7?{label:'⚠️ Tough',color:0xffc857}:{label:'⛔ Underpowered',color:0xff6b7d};
    return {cur,rec,ratio,...t,hex:'#'+t.color.toString(16).padStart(6,'0')}; }
  // คำแนะนำ "ทำอะไรให้เก่งขึ้น" + หน้าที่จะพาไป
  powerAdvice(idx){ const thr=Save.threads(),afford=UPG_ORDER.filter(k=>Save.talCanBuy(k)).length; void thr;
    if(afford>0)return {text:'💡 You can afford '+afford+' Flavor Weave upgrade'+(afford>1?'s':'')+' — tap to power up ›',screen:'upgrade'};
    const prev=idx-1;if(prev>=0&&STAGES[prev]){const p=STAGES[prev],lab=p.chapterStage?('C'+(p.chapter+1)+'-'+p.chapterStage):('Stage '+(prev+1));return {text:'💡 Replay '+lab+' for better gear, then equip it ›',screen:'gear'};}
    return {text:'💡 Equip and enhance better gear ›',screen:'gear'}; }
  uiStageCard(cont,x,y,w,h,st,index,open,fn){
    const currentPower=Save.power(Save.data.character),recommended=stageRecommendedPower(STAGES.indexOf(st)),ps=this.powerStatus(index);
    const colors=[0xb9e85d,0x6ed7df,0xff9a62,0x9bdfff,0xff78a9],color=colors[index%colors.length],r=17;
    const shadow=this.add.graphics();shadow.fillStyle(0x000000,0.55);shadow.fillRoundedRect(x+3,y+6,w,h,r);shadow.fillStyle(color,0.18);shadow.fillRoundedRect(x-2,y-2,w+4,h+4,r+2);cont.add(shadow);
    const cardKey='stage_card_s'+String(index+1).padStart(2,'0'),artKey=this.textures.exists(cardKey)?cardKey:'bg'+(index+1),art=this.textures.exists(artKey)?this._coverImage(x+2,y+2,w-4,h-4,artKey):null;if(art)cont.add(art);
    const shade=this.add.graphics();
    shade.fillGradientStyle(0x090711,0x090711,0x090711,0x090711,0.18,0.72,0.92,0.92);shade.fillRoundedRect(x+2,y+2,w-4,h-4,r-2);
    if(!open){shade.fillStyle(0x100d18,0.64);shade.fillRoundedRect(x+2,y+2,w-4,h-4,r-2);}
    shade.lineStyle(2.2,open?color:0x625872,open?0.95:0.62);shade.strokeRoundedRect(x,y,w,h,r);
    shade.lineStyle(1,0xffffff,0.25);shade.strokeRoundedRect(x+4,y+4,w-8,h-8,r-4);
    shade.fillStyle(open?color:0x625872,0.96);shade.fillRoundedRect(x+10,y+10,54,20,7);
    const actionW=open?68:64,actionX=x+w-actionW-10;shade.fillStyle(open?0x11261f:0x211c29,0.93);shade.fillRoundedRect(actionX,y+h-35,actionW,25,9);shade.lineStyle(1.3,open?color:0x625872,0.8);shade.strokeRoundedRect(actionX,y+h-35,actionW,25,9);cont.add(shade);
    const stageLabel=st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):String(index+1).padStart(2,'0');
    const chapter=this.add.text(x+37,y+20,'Stage '+stageLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#172014':'#ddd5e5'}).setOrigin(0.5);
    const icon=this.add.text(x+19,y+h-25,open?st.emoji:(st.ready===false?'🛠️':'🔒'),{fontSize:'22px'}).setOrigin(0.5);
    const name=this.add.text(x+39,y+43,st.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:h<92?'13px':'15px',color:open?'#fffaf2':'#c4bdca',stroke:'#120a16',strokeThickness:2}).setOrigin(0,0.5);
    const en=this.add.text(x+39,y+61,st.en.toUpperCase(),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:open?Phaser.Display.Color.IntegerToColor(color).rgba:'#82798d'}).setOrigin(0,0.5);
    const power=this.add.text(x+w-16,y+20,open?('⚡ '+currentPower+' / '+recommended+'  '+ps.label):('⚡ '+currentPower+' / suggested '+recommended),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:open?'10px':'8px',color:open?ps.hex:'#8f8798'}).setOrigin(1,0.5);
    if(open){const pw=power.width+14,pb=this.add.graphics();pb.fillStyle(0x0d0913,0.82);pb.fillRoundedRect(x+w-16-pw+7,y+11,pw,18,9);pb.lineStyle(1.4,ps.color,0.9);pb.strokeRoundedRect(x+w-16-pw+7,y+11,pw,18,9);cont.add(pb);}
    const desc=open?st.lore:(st.ready===false?'Boss fight and stage art are still in production':('Clear the previous stage to unlock this path'));
    const lore=this.add.text(x+39,y+h-25,desc,{fontFamily:'sans-serif',fontSize:h<92?'8px':'9px',color:open?'#ddd4df':'#8f8798',wordWrap:{width:w-39-actionW-28},maxLines:2}).setOrigin(0,0.5);
    const action=this.add.text(actionX+actionW/2,y+h-22.5,open?'Play  ▶':(st.ready===false?'Coming soon':'Locked'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#d8ffe5':'#9b91a5'}).setOrigin(0.5);
    if(h<96)en.setVisible(false);   // การ์ดเตี้ย (แนวนอน) ซับไตเติลซ้อนทับ lore — ซ่อน (เป็นชื่อซ้ำตัวพิมพ์ใหญ่อยู่แล้ว)
    cont.add([chapter,icon,name,en,power,lore,action]);this._zone(x,y,w,h,open?fn:()=>Sfx.select());
  }
