  // ฉากปรากฏตัวบอส: WARNING → แพนfind → ปรากฏตัว/คำราม → แพนกลับ
  storyVoice(){ return !this.recipeMode&&!this.bossRush&&!this.riftMode&&!this._inTutorial&&!this._pinnacleRun&&!!STAGES[this.stageIndex]; }
  /* v7.8.102 กรอบคำพูดติดจอ (UI) — เดิมลอยเหนือบอสในโลก พอกล้องแพนกลับบอสหลุดจอเลยไม่เห็น */
  bossSay(text,who,ms,src0){ if(!text)return;if(this._bossSayObj)this.voiceStop?.(this._bossSayObj); this._bossSayObj?.destroy(); this._bossSayEv?.remove(false);
    const src=src0&&src0.active!==false?src0:(this.boss?.active?this.boss:null),over=!!src&&!!this.camWorld,full='“'+text+'”',head=who&&!over?who+'\n':'',hold=Math.max(ms||Math.max(3300,1800+text.length*70),(this.voiceDuration?.('boss'+((this.stageIndex||0)+1),text)||0)+300);   /* v7.9.9 พิมพ์ทีละตัว · ค้างนานตามความยาว */
    /* v8.1.116 เจ้าของ: คำพูดบอสไปอยู่บนหัวบอส · เล็กลง · เหลือแค่คำพูด (ไม่มีชื่อ) · ไม่มีตัวบอส = มุมซ้ายบนแบบเดิม */
    const hy=()=>src.y-Math.max(60,(src.displayHeight||120)*.55)-8,zk=()=>1/Math.max(.25,(this.cameras?.main?.zoom||1)/(typeof RENDER_DPR!=='undefined'?RENDER_DPR:1)); if(over){ const t=this.camWorld(this.add.text(src.x,hy(),full.slice(0,1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#3a1f2b',backgroundColor:'#fff6ea',padding:{x:7,y:4},align:'center',lineSpacing:1,wordWrap:{width:170}}).setOrigin(.5,1).setDepth(90010).setAlpha(0)); t.setText(full); const fw=t.width,fh=t.height; t.setText(full.slice(0,1)); t.setFixedSize?.(fw,fh); t.setResolution?.(2);   /* ขนาดบนจอคงที่ ~11px ไม่ขึ้นกับซูมกล้อง */
      this._bossSayObj=t;this.voiceLine?.('boss'+((this.stageIndex||0)+1),text,()=>this._bossSayObj===t&&t.active,t); t.setScale(zk()*.6); this.tweens.add({targets:t,alpha:1,scale:zk(),duration:200,ease:'Back.easeOut',onComplete:()=>{ t._zk=true; }});
      let n=1; const fol=this.time.addEvent({delay:30,loop:true,callback:()=>{ if(!t.active){ fol.remove(false); return; } if(src.active!==false)t.setPosition(src.x,hy()); if(t._zk)t.setScale(zk()); }});
      this._bossSayEv=this.time.addEvent({delay:38,repeat:full.length-2,callback:()=>{ if(t.active){t.setText(full.slice(0,++n));if(n%2===0)Sfx.voiceBlip?.('boss_c'+Math.min(3,1+Math.floor((this.stageIndex||0)/5)))||Sfx.orderCue?.('type_tick',.05,.08);} }});
      this._bossSayEnd=this.time.now+full.length*38+hold;
      this.time.delayedCall(full.length*38+hold,()=>{ if(this._bossSayObj===t)this._bossSayObj=null; if(t.active)this.tweens.add({targets:t,alpha:0,duration:300,onComplete:()=>{ fol.remove(false); t.destroy(); }}); }); return; }
    const t=this.camUI(this.add.text(8,Math.max((this._pad||14)+182,this._ruby?.c?.active&&this._ruby.bottom?this._ruby.bottom+8:0),head+full,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#3a1f2b',backgroundColor:'#fff6ea',padding:{x:10,y:6},align:'left',lineSpacing:2,wordWrap:{width:Math.min(230,Math.round(this.W*.6))}}).setOrigin(0,0).setScrollFactor(1).setDepth(130).setAlpha(0));   /* v8.1.100 เจ้าของ: คำพูดบอสบังจอ → ป้ายมุมซ้ายบน (Ruby อยู่ขวาบน) */
    const fh=t.height; t.setFixedSize(t.width,0).setText(head+'“'); t.setFixedSize(t.width,fh);
    this._bossSayObj=t;this.voiceLine?.('boss'+((this.stageIndex||0)+1),text,()=>this._bossSayObj===t&&t.active,t); t.x=-40; this.tweens.add({targets:t,alpha:1,x:8,duration:220,ease:'Back.easeOut'});
    let n=1; this._bossSayEv=this.time.addEvent({delay:38,repeat:full.length-2,callback:()=>{ if(t.active){t.setText(head+full.slice(0,++n));if(n%2===0)Sfx.voiceBlip?.('boss_c'+Math.min(3,1+Math.floor((this.stageIndex||0)/5)))||Sfx.orderCue?.('type_tick',.05,.08);} }});
    this._bossSayEnd=this.time.now+full.length*38+hold;
    this.time.delayedCall(full.length*38+hold,()=>{ if(this._bossSayObj===t)this._bossSayObj=null; if(t.active)this.tweens.add({targets:t,alpha:0,duration:300,onComplete:()=>t.destroy()}); }); }
  bossLine(i){ const L=this.storyVoice()&&BOSS_LINES[this.stageIndex];if(!L)return null;const story=typeof BOSS_STORIES!=='undefined'&&BOSS_STORIES[this.stageIndex];return story?(i===0?story.reply:i===1?story.release:i===3?story.fight:L[i]):L[i]; }
  tickBossSay(){ const b=this.boss; if(!b||!b.active||!(b.isBoss||b.isMini))return; const st=STAGES[this.stageIndex];
    if(!b._said){ b._said=true; this.bossSay(this.bossLine(b.isMini?2:0),b.isMini?st?.mini:st?.boss,0,b); return; }if(this.voiceBossSlip?.(b,st))return;
    /* v7.9.9 พูดวนระหว่างสู้: รอให้ข้อความเดิมหายก่อน แล้วเว้น ~6–9 วิ */
    let loop=this.bossLine(b.isMini?4:3);if(!b.isMini&&loop?.length&&this.storyVoice?.()){const extra=BOSS_LINES[this.stageIndex]?.[3]?.[2];if(extra&&!loop.includes(extra))loop=[...loop,extra];} if(!loop||!loop.length)return; const now=this.time.now;
    if(!b._sayAt){ b._sayAt=Math.max(now,this._bossSayEnd||0)+6000+Math.random()*3000; return; }
    if(now<b._sayAt||(this._bossSayObj&&this._bossSayObj.active))return;
    b._sayI=((b._sayI??-1)+1)%loop.length; this.bossSay(loop[b._sayI],b.isMini?st?.mini:st?.boss,0,b); b._sayAt=this._bossSayEnd+6000+Math.random()*3000; }
  bossComicValid(owner){return this._bossComicOwner===owner&&this.player===owner.player&&(!owner.player||owner.player.active!==false)&&this.stageIndex===owner.stage&&(this._artEpoch||0)===owner.epoch&&this.state!=='dead';}
  ownBossComic(replay=false){this.clearBossStory();const owner=this._bossComicOwner={player:this.player,stage:this.stageIndex,epoch:this._artEpoch||0,replay};
    if(!this._bossStoryShutdownHook){this._bossStoryShutdownHook=true;this.events.once('shutdown',()=>{this.clearBossStory();this._bossStoryShutdownHook=false;});}return owner;
  }
  clearBossStory(){const owner=this._bossComicOwner;if(!owner)return;this._bossComicOwner=null;if(this._mc&&!this._mc.done)this._mc.finish(false);}
  openBossStoryPanel(idx,opt={}){if(!opt.replay||this.state!=='menu'||Save.kills('boss'+idx)<1)return;const id=bossMotionId(idx);if(!id)return;
    const owner=this.ownBossComic(true);if(this._mcFail)delete this._mcFail[id];
    this.playMotionComic(id,ok=>{if(!this.bossComicValid(owner)||this.state!=='menu')return;this._bossComicOwner=null;this.menuScreen='bestiary';this.buildMenuScreen();if(!ok)this.menuToast?.('Story art could not load. Tap Read story to retry.');});
  }
  bossIntro(b,name){
    if(this.recipeMode){ this.bossIntroQuick(b,name); return; }
    { const ln=this.bossLine(0); if(ln){ b._said=true; this.time.delayedCall(1750,()=>{ if(b.active)this.bossSay(ln,STAGES[this.stageIndex]?.boss,0,b); }); } }
    const cam=this.cameras.main,px=this.player.x,py=this.player.y,base=b.baseScale||1.55,targetY=b.y;
    this.state='cinematic';this.mode='bossIntro';this.player.setVelocity(0,0);b.setVelocity(0,0);b.setVisible(false).setScale(base*0.82).setDepth(targetY+1);if(b.body)b.body.enable=false;
    Sfx.playBossBgm(this.stageIndex+1);Sfx.bossWarn();
    const band=this.add.rectangle(this.W/2,this.H/2,this.W,128,0x17090d,0.92).setScrollFactor(1).setDepth(120);
    const warn=this.add.text(this.W/2,this.H/2-18,'⚠  W A R N I N G  ⚠',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'34px',color:'#ff355e',stroke:'#41000e',strokeThickness:7}).setOrigin(0.5).setScrollFactor(1).setDepth(121);
    const sub=this.add.text(this.W/2,this.H/2+27,name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff1a8'}).setOrigin(0.5).setScrollFactor(1).setDepth(121);
    [band,warn,sub].forEach(o=>this.camUI(o));this.tweens.add({targets:[band,warn,sub],alpha:{from:0,to:1},duration:200,yoyo:true,hold:1050,onComplete:()=>{band.destroy();warn.destroy();sub.destroy();}});
    cam.stopFollow();this.time.delayedCall(850,()=>cam.pan(b.x,targetY,850,'Sine.easeInOut'));
    if(this.stageIndex===1){
      this.time.delayedCall(1600,()=>{if(!b.active)return;const drain=this.camWorld(this.add.image(b.x,targetY+58,'drain_grate').setDepth(targetY-3).setScale(0.9).setAlpha(0));this.decoProps.add(drain);
        this.tweens.add({targets:drain,alpha:1,rotation:0.25,duration:420});b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+58).setScale(base*0.25);if(this.anims.exists('boss2_reveal'))b.play('boss2_reveal');
        for(let i=0;i<10;i++){const bubble=this.camWorld(this.add.image(b.x+Phaser.Math.Between(-55,55),targetY+60,'bubble').setDepth(targetY+3).setScale(Phaser.Math.FloatBetween(0.5,1.2)).setAlpha(0.8));this.tweens.add({targets:bubble,y:targetY-Phaser.Math.Between(35,130),x:bubble.x+Phaser.Math.Between(-30,30),alpha:0,duration:620+i*35,delay:i*45,onComplete:()=>bubble.destroy()});}
        this.tweens.add({targets:b,y:targetY,scale:base,alpha:1,duration:920,ease:'Back.out',onComplete:()=>{this.drainBossPose(b,3,900);this.screenShake(420,0.012);this.screenFlash(0x7fe8d2,0.25,420);}});});
      this.time.delayedCall(3100,()=>cam.pan(px,py,760,'Sine.easeInOut'));
      this.time.delayedCall(3900,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss2_walk'))(this.bossInkIdle?.(b)||b.play('boss2_walk',true));this.state='play';this.mode='boss';b.atkCd=1.7;this.spawnBossEscorts(2);this.showBanner('🫧 Valve Burst','Trapping bubbles slow you — escape the pull and find gaps between waves!',2300);});
      return;
    }
    if(this.stageIndex===9){
      this.time.delayedCall(1120,()=>{if(!b.active)return;b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+125).setScale(base*.12);this.trueRootPose(b,6,2100);
        const eclipse=this.camWorld(this.add.circle(b.x,targetY,205,0x07000b,.88).setDepth(targetY-4).setStrokeStyle(12,0xffd166,.72));this.tweens.add({targets:eclipse,scale:{from:.08,to:1.25},alpha:{from:0,to:.88},duration:1350,ease:'Cubic.out'});
        for(let i=0;i<20;i++){const a=i*TAU/20,ray=this.camWorld(this.add.image(b.x,targetY,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(i%3===0?0xffd166:i%2?0xd95cff:0x56e5bd).setScale(.06,.52).setAlpha(.94).setDepth(targetY));this.tweens.add({targets:ray,scaleX:2.75,alpha:0,duration:1250+i*28,onComplete:()=>ray.destroy()});}
        for(let i=0;i<5;i++){const ring=this.camWorld(this.add.image(b.x,targetY,'vfx_ring').setTint(i%2?0xd95cff:0xffd166).setScale(.14).setAlpha(.9).setDepth(targetY+1));this.tweens.add({targets:ring,scale:3+i*.48,rotation:(i%2?1:-1)*TAU,alpha:0,duration:1500+i*180,onComplete:()=>ring.destroy()});}
        this.tweens.add({targets:b,y:targetY,scale:base,alpha:1,duration:1350,ease:'Back.out',onComplete:()=>{this.trueRootPose(b,7,1100);this.screenFlash(0xffd166,.78,820);this.screenShake(920,.029);this.tweens.add({targets:eclipse,alpha:0,duration:500,onComplete:()=>eclipse.destroy()});}});});
      this.time.delayedCall(3500,()=>cam.pan(px,py,820,'Sine.easeInOut'));
      this.time.delayedCall(4420,()=>{if(!b.active)return;cam.startFollow(this.player,false,.2,.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss10_true_rootmother_walk'))(this.bossInkIdle?.(b)||b.play('boss10_true_rootmother_walk',true));this.state='play';this.mode='boss';b.atkCd=1.35;this.spawnBossEscorts(3);this.showBanner('🌳 THE TRUE ROOTMOTHER','Four phases. Every attack preserves a route — trust the gold warnings, not the spectacle!',2550);});
      return;
    }
    if(this.stageIndex===8){
      this.time.delayedCall(1200,()=>{if(!b.active)return;b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+90).setScale(base*.18);this.chronobloomPose(b,6,1800);
        for(let i=0;i<16;i++){const a=i*TAU/16,ray=this.camWorld(this.add.image(b.x,targetY,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(this.seasonInfo(i%4).color).setScale(.06,.46).setAlpha(.92).setDepth(targetY));this.tweens.add({targets:ray,scaleX:2.35,alpha:0,duration:1100+i*32,onComplete:()=>ray.destroy()});}
        for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,targetY,'vfx_ring').setTint(this.seasonInfo(i).color).setScale(.18).setAlpha(.88).setDepth(targetY+1));this.tweens.add({targets:ring,scale:2.6+i*.42,rotation:(i%2?1:-1)*TAU,alpha:0,duration:1400+i*170,onComplete:()=>ring.destroy()});}
        this.tweens.add({targets:b,y:targetY,scale:base,alpha:1,duration:1120,ease:'Back.out',onComplete:()=>{this.chronobloomPose(b,7,950);this.screenFlash(0xffd166,.66,700);this.screenShake(760,.023);}});});
      this.time.delayedCall(3300,()=>cam.pan(px,py,800,'Sine.easeInOut'));
      this.time.delayedCall(4180,()=>{if(!b.active)return;cam.startFollow(this.player,false,.2,.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss9_chronobloom_orchid_walk'))(this.bossInkIdle?.(b)||b.play('boss9_chronobloom_orchid_walk',true));this.state='play';this.mode='boss';b.atkCd=1.45;this.spawnBossEscorts(3);this.showBanner('⏳ CHRONOBLOOM PARADOX','Read the season colors — every spectacular attack preserves a safe route!',2350);});
      return;
    }
    if(this.stageIndex===7){
      this.time.delayedCall(1250,()=>{if(!b.active)return;b.setVisible(true).setAlpha(0).setPosition(b.x,targetY-120).setScale(base*.35);this.hornetQueenPose(b,6,1700);
        for(let i=0;i<16;i++){const a=i*TAU/16,ray=this.camWorld(this.add.image(b.x,targetY,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(i%2?0xffc95c:0xd95cff).setScale(.08,.48).setAlpha(.9).setDepth(targetY));this.tweens.add({targets:ray,scaleX:2.15,alpha:0,duration:1050+i*35,onComplete:()=>ray.destroy()});}
        for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,targetY,'vfx_ring').setTint(i%2?0xd95cff:0xffc95c).setScale(.2).setAlpha(.85).setDepth(targetY+1));this.tweens.add({targets:ring,scale:2.3+i*.45,rotation:(i%2?1:-1)*TAU,alpha:0,duration:1300+i*180,onComplete:()=>ring.destroy()});}
        this.tweens.add({targets:b,y:targetY,scale:base,alpha:1,duration:1050,ease:'Back.out',onComplete:()=>{this.hornetQueenPose(b,7,900);this.screenFlash(0xffc95c,.62,650);this.screenShake(720,.022);}});});
      this.time.delayedCall(3250,()=>cam.pan(px,py,780,'Sine.easeInOut'));
      this.time.delayedCall(4100,()=>{if(!b.active)return;cam.startFollow(this.player,false,.2,.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss8_hornet_queen_walk'))(this.bossInkIdle?.(b)||b.play('boss8_hornet_queen_walk',true));this.state='play';this.mode='boss';b.atkCd=1.5;this.spawnBossEscorts(3);this.showBanner('👑 ROYAL FERMENT','Protect the nectar gaps — every queen attack has a readable escape route!',2300);});
      return;
    }
    if(this.stageIndex===4){
      this.time.delayedCall(1180,()=>{if(!b.active)return;
        const eclipse=this.camWorld(this.add.circle(b.x,targetY,176,0x020006,0.94).setDepth(targetY-4).setStrokeStyle(13,0xd95cff,0.72));
        const corona=this.camWorld(this.add.image(b.x,targetY,'hunger_seal').setDepth(targetY-5).setScale(0.2).setAlpha(0.9).setTint(0xff3f78));
        this.tweens.add({targets:eclipse,scale:{from:0.08,to:1.35},alpha:{from:0,to:0.94},duration:1250,ease:'Cubic.out'});
        this.tweens.add({targets:corona,scale:3.1,rotation:Math.PI*2,alpha:{from:0.95,to:0.24},duration:1900});
        this.screenFlash(0x050008,0.90,1050);b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+92).setScale(base*0.05);
        for(let i=0;i<7;i++){const seal=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(targetY-2+i%2).setTint(i%2?0xff3f78:0xffd166).setScale(0.14+i*0.07).setAlpha(0.82).setRotation(i*Math.PI/7));this.tweens.add({targets:seal,rotation:(i%2?1:-1)*Math.PI*2.4,scale:1.45+i*0.13,alpha:0,duration:1350+i*95,onComplete:()=>seal.destroy()});}
        for(let i=0;i<12;i++){const ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(targetY-1).setRotation(i*TAU/12).setTint(i%2?0xd95cff:0xff3f78).setScale(0.15,0.42).setAlpha(0.76));this.tweens.add({targets:ray,scaleX:1.65,alpha:0,duration:900+i*45,delay:300,onComplete:()=>ray.destroy()});}
        this.tweens.add({targets:b,alpha:1,y:targetY,scale:base,duration:1700,ease:'Back.out',onComplete:()=>{if(!b.active)return;this.screenShake(980,0.030);this.screenFlash(0xff3f78,0.52,760);Sfx.bossWarn();eclipse.destroy();corona.destroy();}});
      });
      this.time.delayedCall(3300,()=>{if(!b.active)return;this.showBanner('🌑 THE GREAT HUNGER','The primordial Hunger has awakened — there is nothing left to bargain with!',2600);});
      this.time.delayedCall(4500,()=>cam.pan(px,py,900,'Sine.easeInOut'));
      this.time.delayedCall(5550,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);this.state='play';this.mode='boss';b.atkCd=1.35;
        if(this.anims.exists('boss5_sovereign_idle'))(this.bossInkIdle?.(b)||b.play('boss5_sovereign_idle',true));
        b._aura=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y-2).setAlpha(0.32).setTint(0xff3f78));b._auraIsFx=true;   /* v8.1.149 เจ้าของ 🐞: ออร่ารอบ Great Hunger บังตัวบอส → วง/ลูกแสงจางลง ลูกแสง 8→4 อยู่หลังตัว */
        b._hungerHalo=[this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y-3).setScale(2.05).setAlpha(0.2).setTint(0xd95cff)),this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y-4).setScale(2.62).setAlpha(0.1).setTint(0xffd166))];
        b._hungerOrbs=[];for(let i=0;i<4;i++)b._hungerOrbs.push(this.camWorld(this.add.image(b.x,b.y,'vfx_glow').setTint(i%3===0?0xffd166:i%2?0xff3f78:0xd95cff).setDepth(b.y+2).setScale(0.38).setAlpha(0.88)));
        this.spawnBossEscorts(3);
      });return;
    }
    if(this.stageIndex===6){
      this.time.delayedCall(1250,()=>{if(!b.active)return;b.setVisible(true).setAlpha(0).setScale(base*.08);this.behemothPose(b,6,1700);
        const heart=this.camWorld(this.add.image(b.x,targetY,'vfx_glow').setTint(0xd95cff).setScale(.18).setDepth(targetY+3).setAlpha(.95));
        const shadow=this.camWorld(this.add.circle(b.x,targetY+48,34,0x080713,.78).setDepth(targetY-4).setStrokeStyle(8,0x56e5bd,.82));
        this.tweens.add({targets:shadow,radius:210,alpha:.18,duration:1500,ease:'Cubic.out'});
        this.tweens.add({targets:heart,scale:1.65,rotation:TAU,alpha:{from:.95,to:.38},duration:1500,onComplete:()=>heart.destroy()});
        for(let i=0;i<14;i++){const a=i*TAU/14,root=this.camWorld(this.add.image(b.x,targetY+30,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(i%2?0x56e5bd:0xd95cff).setScale(.06,.34).setAlpha(.82).setDepth(targetY-2));this.tweens.add({targets:root,scaleX:1.7+(i%3)*.18,alpha:0,duration:1050+i*45,onComplete:()=>root.destroy()});}
        this.tweens.add({targets:b,alpha:1,scale:base,duration:1650,ease:'Back.out',onComplete:()=>{if(!b.active)return;this.behemothPose(b,7,1200);this.screenFlash(0x7d3cff,.48,620);this.screenShake(760,.022);Sfx.bossWarn();shadow.destroy();}});
      });
      this.time.delayedCall(3300,()=>{if(b.active)this.showBanner('🍄 MYCELIUM BEHEMOTH','The marsh has one heart — and every creature is part of its body',2500);});
      this.time.delayedCall(4500,()=>cam.pan(px,py,850,'Sine.easeInOut'));
      this.time.delayedCall(5450,()=>{if(!b.active)return;cam.startFollow(this.player,false,.2,.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss7_mycelium_behemoth_walk'))(this.bossInkIdle?.(b)||b.play('boss7_mycelium_behemoth_walk',true));this.state='play';this.mode='boss';b.atkCd=1.65;
        for(const t of ['basic','fast','shooter']){const e=this.spawnEnemy(t);if(e)e.setPosition(b.x+Phaser.Math.Between(-190,190),b.y+Phaser.Math.Between(-120,120));}
        this.showBanner('🫀 The Marsh Heart Beats','Read the violet core: every major attack begins with a distinct pose',2200);
      });return;
    }
    if(this.stageIndex!==0){
      this.time.delayedCall(1650,()=>{if(!b.active)return;b.setVisible(true).setAlpha(0).setScale(base*0.25);if(this.stageIndex===2||this.stageIndex===3)this.stageBossPose(b,1,1250);if(this.stageIndex===5)this.chapter2Pose(b,1,1350);const glow=this.camWorld(this.add.image(b.x,b.y,'vfx_glow').setTint(STAGES[this.stageIndex].tint).setScale(0.2).setDepth(b.y-1));this.tweens.add({targets:[b,glow],alpha:1,scale:base,duration:850,ease:'Back.out',onComplete:()=>glow.destroy()});});
      this.time.delayedCall(3000,()=>cam.pan(px,py,760,'Sine.easeInOut'));this.time.delayedCall(3800,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setScale(base);const idle=b.texture.key+'_idle';if(this.anims.exists(idle))b.play(idle,true);this.state='play';this.mode='boss';b.atkCd=1.6;this.spawnBossEscorts(2);this.showBanner(BOSS_STORIES[this.stageIndex]?.title||STAGES[this.stageIndex].boss,BOSS_STORIES[this.stageIndex]?.goal||'Watch the warnings and keep a clear path.',2100);});return;
    }
    // Stage 1 (ราชินีมด): ฉากปรากฏตัวยาว+อลังการ — เรืองแสง → ลอยขึ้นช้า ๆ → คำราม 2 จังหวะ
    this.time.delayedCall(1950,()=>{if(!b.active)return;
      b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+46).setScale(base*0.2);this.bossPose(b,1,1000);
      const glow=this.camWorld(this.add.image(b.x,targetY,'vfx_glow').setTint(STAGES[0].tint||0x9dff45).setScale(0.15).setDepth(targetY-1));
      this.tweens.add({targets:glow,scale:1.35,alpha:{from:0.95,to:0.45},duration:1350,yoyo:true});
      this.tweens.add({targets:b,alpha:1,y:targetY,scale:base,duration:1350,ease:'Back.out',onComplete:()=>{if(!b.active)return;glow.destroy();
        this.bossPose(b,6,1500);this.screenShake(560,0.016);this.screenFlash(0x9dff45,0.30,470);   // คำรามครั้งที่ 1
        for(let i=0;i<3;i++){const r=this.camWorld(this.add.circle(b.x,b.y,25,0,0).setDepth(6).setStrokeStyle(6,0x9dff45,0.9));this.tweens.add({targets:r,radius:210+i*60,alpha:0,duration:720+i*110,delay:i*100,onComplete:()=>r.destroy()});}}});
    });
    this.time.delayedCall(4100,()=>{if(!b.active)return;this.bossPose(b,6,1000);this.screenShake(380,0.013);this.screenFlash(0xff6a8f,0.16,400);   // คำรามครั้งที่ 2 (ย้ำ)
      for(let i=0;i<2;i++){const r=this.camWorld(this.add.circle(b.x,b.y,20,0,0).setDepth(6).setStrokeStyle(5,0xff9ec4,0.8));this.tweens.add({targets:r,radius:160+i*55,alpha:0,duration:620+i*100,delay:i*90,onComplete:()=>r.destroy()});}});
    this.time.delayedCall(5600,()=>cam.pan(px,py,950,'Sine.easeInOut'));
    this.time.delayedCall(6650,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss1_idle'))(this.bossInkIdle?.(b)||b.play('boss1_idle',true));this.state='play';this.mode='boss';b.atkCd=1.55;this.spawnBossEscorts(2);this.showBanner('👑 The Queen Awakens','Destroy the nests and crystals to cut her power! (2 guardians)',2400);});
  }
  // v6.32: Delve รันไม่หยุดเกม/ไม่แพนกล้อง — บอสโผล่ข้างตัว ผู้เล่นยืนที่เดิม
  bossIntroQuick(b,name){ const base=b.baseScale||1.55; Sfx.playBossBgm(this.stageIndex+1); Sfx.bossWarn();
    this.showBanner('⚠ '+name,'The boss has arrived!',1800);
    if(b.body)b.body.enable=true; b.setVisible(true).setAlpha(0).setScale(base*0.6);
    this.tweens.add({targets:b,alpha:1,scale:base,duration:520,ease:'Back.out',onComplete:()=>{ if(!b.active)return; this.screenShake(320,0.01); }});
    this.mode='boss'; b.atkCd=2.0; this.spawnBossEscorts&&this.spawnBossEscorts(2); }
  // จอวาบFullหน้าจอ (บนกล้อง UI) — ใช้ตอนบอสปรากฏ/เข้าเฟส/ตาย
  screenFlash(color,alpha,dur){
    if(Save.data.settings&&Save.data.settings.flash===false)return;
    const f=this.add.rectangle(this.W/2,this.H/2,this.W,this.H,color,alpha).setScrollFactor(1).setDepth(80);
    this.camUI(f); this.tweens.add({targets:f,alpha:0,duration:dur,onComplete:()=>f.destroy()});
  }
  // ลด motion sickness บนมือถือ: ทุกจุดสั่นผ่านตัวคูณกลางเดียวกัน
  screenShake(duration,intensity){
    const level=Save.data.settings?Number(Save.data.settings.shake):1;if(level<=0)return;const mul=level===2?0.72:0.45;
    this.cameras.main.shake(Math.max(35,Math.round(duration*(level===2?0.82:0.65))),Math.max(0.0004,intensity*mul));
  }
  // ฉากบอสตาย: สโลว์โมชัน + จอวาบ + ระเบิดเป็นชุด + คลื่นกระแทก
  bossDefeat(x,y){ const _db=this.boss; if(_db&&_db.delveBoss){ this.clearDelveBoss(); const gh=this.camWorld(this.add.image(x,y,_db.texture.key,7).setScale(_db.scaleX).setDepth(y+1)); this.tweens.add({targets:gh,alpha:0,delay:900,duration:900,onComplete:()=>gh.destroy()}); }
    const grand=this.stageIndex===4||this.stageIndex===6||this.stageIndex===7||this.stageIndex===8||this.stageIndex===9;if(grand)this.showBanner(this.stageIndex===9?'🌳 The Root Throne Falls':this.stageIndex===8?'⏳ The Broken Equinox Blooms':this.stageIndex===7?'👑 The Ferment Crown Shatters':this.stageIndex===6?'✨ The Marsh Heart Falls':'✨ The Hunger Crumbles',this.stageIndex===9?'Every stolen memory returns to its owner — Chapter 2 is complete!':this.stageIndex===8?'The greenhouse clock releases every season back into its rightful path!':this.stageIndex===7?'Royal honey rains as harmless golden light — the Nectar Hive is free!':this.stageIndex===6?'The fungal network releases every trapped memory into the clean air!':'All flavor is returning to the world!',2200);
    Sfx.clear(); this.hitStop(grand?140:90); this.screenFlash(0xffffff,grand?0.92:0.7,grand?680:420); this.screenShake(grand?900:600,grand?0.024:0.016);
    for(let i=0;i<(grand?11:5);i++) this.time.delayedCall(60+i*(grand?70:80),()=>{
      this.burst(x+Phaser.Math.Between(grand?-95:-50,grand?95:50),y+Phaser.Math.Between(grand?-95:-50,grand?95:50),[0xffd166,0xff5f97,0xd95cff,0xbfe8ff][i%4]); });
    for(let i=0;i<(grand?6:3);i++){ const ring=this.camWorld(this.add.circle(x,y,20,0xffe08a,0).setDepth(7).setStrokeStyle(5,0xffd166,0.9));
      this.tweens.add({targets:ring,radius:220+i*70,alpha:{from:0.9,to:0},duration:700+i*150,delay:i*110,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
  }

  // Campaign-only presentation, independent of pooled boss lifetime and x1–x4 speed.

  storyGateKeyTarget(){const next=this.stageIndex+1;return this.storyVoice?.()&&next>0&&next<STAGES.length&&next>(Save.data.unlockedStage||0)?next:null;}
  collectStoryGateKey(next=this.storyGateKeyTarget()){
    if(!this.storyVoice?.()||next!==this.stageIndex+1||next<=0||next>=STAGES.length)return false;
    const keys=Save.data.storyGateKeys||(Save.data.storyGateKeys={});if(keys[next])return false;
    keys[next]=1;Save.data.unlockedStage=Math.max(Save.data.unlockedStage||0,next);Save.unlockCoreCharacters?.();this._storyKeyJustCollected=next;Save.save();return true;   /* v8.2.15 กุญแจเปิดด่านถัดไป = ปลดฮีโร่ของด่านนี้ด้วย */
  }

  bossVictoryValid(v){return this._bossVictory===v&&this.player===v.player&&v.player?.active!==false&&this.stageIndex===v.stage&&(this._artEpoch||0)===v.epoch&&this.state!=='menu'&&this.state!=='dead'&&(!v.started||(this.state==='cinematic'&&this.mode==='bossVictory'));}
  clearBossVictory(){const v=this._bossVictory;if(!v)return;this._bossVictory=null;v.events.forEach(e=>e.remove(false));v.tweens.forEach(t=>t.remove());if(v.root?.active)v.root.destroy();}
  queueBossVictory(pose,x,y){
    if(this._bossVictory)return;this._storyKeyJustCollected=null;
    const v=this._bossVictory={player:this.player,stage:this.stageIndex,epoch:this._artEpoch||0,pose,x,y,events:[],tweens:[],started:false};
    if(!this._bossVictoryHook){this._bossVictoryHook=true;this.events.once('shutdown',()=>{this.clearBossVictory();this._bossVictoryHook=false;});}
    const begin=()=>{if(!this.bossVictoryValid(v)){if(this._bossVictory===v)this.clearBossVictory();return;}
      if(this.state!=='play'){v.events.push(this.time.delayedCall(150,begin));return;}
      this.renderBossVictory(v);
    };begin();
  }
  renderBossVictory(v){
    if(!this.bossVictoryValid(v)||v.started)return;v.started=true;this.state='cinematic';this.mode='bossVictory';this.physics.pause();this.player.setVelocity(0,0);
    if(this.joy){this.joy.active=false;this.joy.dx=0;this.joy.dy=0;this.joyBase?.setVisible(false);this.joyKnob?.setVisible(false);}
    Sfx.eventLoopStop?.();Sfx.duckBgm?.(2200,.16);Sfx.orderCue?.('kill_freeze',.4,.5);
    const W=this.W,H=this.H,red=this.hubMotionAllowed?.()===false,low=(Save.data.settings?.vfx??1)===0,speed=this.gameSpeed||1;
    const cam=this.cameras.main,view=cam.worldView||{x:0,y:0},zoom=cam.zoom||1;
    const x=Math.max(W*.2,Math.min(W*.8,(v.x-view.x)*zoom)),y=Math.max(H*.25,Math.min(H*.65,(v.y-view.y)*zoom));
    const root=v.root=this.camUI(this.add.container(0,0).setDepth(19500)),add=o=>{root.add(o);return o;};
    const tw=c=>{if(red)return;const t=this.tweens.add({...c,duration:(c.duration||300)*speed,delay:(c.delay||0)*speed});v.tweens.push(t);return t;};
    const at=(ms,fn)=>{v.events.push(this.time.delayedCall(ms*speed,()=>{if(this.bossVictoryValid(v))fn();else if(this._bossVictory===v)this.clearBossVictory();}));};
    add(this.add.rectangle(0,0,W,H,0x090611,.62).setOrigin(0));
    v.keyTarget=this.storyGateKeyTarget();const pose=v.pose;let boss=null;
    if(pose?.key&&this.textures.exists(pose.key)){
      boss=add(this.add.image(x,y,pose.key,pose.frame).setOrigin(pose.ox??.5,pose.oy??.5).setScale(pose.sx*zoom,pose.sy*zoom).setFlipX(pose.flip));
      const cap=Math.min(W*.66,H*.48),factor=Math.min(1,cap/Math.max(boss.displayWidth,boss.displayHeight));boss.setScale(boss.scaleX*factor,boss.scaleY*factor);
    }
    const glow=this.textures.exists('vfx_glow')?add(this.add.image(x,y,'vfx_glow').setDisplaySize(180,180).setTint(0xcba3ff).setAlpha(red?.18:0)):null;
    const veil=add(this.add.rectangle(0,0,W,H,0x07040b,0).setOrigin(0));v.boss=boss;v.veil=veil;
    at(red?100:120,()=>{
      Sfx.orderCue?.('pow_shatter',.52,.4);if(!red)this.screenShake(140,.006);
      if(glow){glow.setAlpha(.42);tw({targets:glow,alpha:0,scaleX:glow.scaleX*2,scaleY:glow.scaleY*2,duration:520});}
      if(boss){if(!red)boss.setTint(0xe9d6ff);tw({targets:boss,alpha:0,y:y-14,scaleX:boss.scaleX*.93,scaleY:boss.scaleY*1.03,duration:740});if(red)boss.setAlpha(.38);}
      if(!red&&!low){for(let i=0;i<8;i++){const a=i*Math.PI/4,shard=add(this.add.graphics({x,y}));shard.fillStyle(i%2?0xd9bcff:0x9661dd,.9).fillTriangle(-3,5,0,-10,4,5);shard.rotation=a;
        tw({targets:shard,x:x+Math.cos(a)*76,y:y+Math.sin(a)*64,rotation:a+.7,alpha:0,duration:520});}}
      // Soft local flash only; global flash preference also applies here.
      if(!red&&Save.data.settings?.flash!==false){const flash=add(this.add.circle(x,y,42,0xf3e5ff,.24));tw({targets:flash,alpha:0,scale:2,duration:180});}
    });
    at(red?330:700,()=>{
      Sfx.rewardCue?.('sfx_event_wisp_purify_complete',.36);
      if(boss&&red)boss.setAlpha(0);
      if(!red){for(let i=0;i<(low?3:9);i++){const a=i*2.4,r=18+i*3,m=add(this.add.circle(x+Math.cos(a)*r,y+Math.sin(a)*r,low?2:2.6,0xffe4a4,.85));tw({targets:m,x:W*.5+(i-4)*8,y:H*.28-i*5,alpha:0,duration:650,delay:i*22});}}

      if(v.keyTarget!=null){
        const title=add(this.add.text(W/2,H*.55,'WAYSEED KEY',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffe1a1'}).setOrigin(.5));
        const sub=add(this.add.text(W/2,H*.55+25,'Opens C'+(Math.floor(v.keyTarget/5)+1)+'-'+(v.keyTarget%5+1),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#d8efdf'}).setOrigin(.5));
        const item=add(this.textures.exists('bv46_key')?this.add.image(W/2,H*.40,'bv46_key').setDisplaySize(108,108):this.add.text(W/2,H*.40,'🗝',{fontSize:'64px'}).setOrigin(.5));
        v.keyArt=item;v.keyLabels=[title,sub];
        if(!red)tw({targets:item,y:H*.38,duration:360});
        at(red?500:850,()=>{this.collectStoryGateKey(v.keyTarget);if(!red){tw({targets:item,y:H*.23,alpha:0,duration:260});tw({targets:[title,sub],alpha:0,duration:240});}else{item.setAlpha(0);title.setAlpha(0);sub.setAlpha(0);}});
      }

      // Keep the final curtain above all fragments and freed-flavor motes.
      root.bringToTop(veil);tw({targets:veil,alpha:1,duration:400,delay:v.keyTarget!=null?850:480});
    });
    const finishAt=red?(v.keyTarget!=null?1150:850):(v.keyTarget!=null?2100:1750);
    at(finishAt-130,()=>{veil.setAlpha(1);});
    at(finishAt,()=>this.finishBossVictory(v));
  }
  finishBossVictory(v){
    if(!this.bossVictoryValid(v))return;
    // Leave the opaque curtain up while the comic loader takes ownership; no battlefield flicker.
    if(v.keyTarget!=null)this.collectStoryGateKey(v.keyTarget);
    const owner=this.ownBossComic(),next=()=>{if(!this.bossComicValid(owner))return;this._bossComicOwner=null;this.state='play';this.physics.resume();this.onBossDown(v.x,v.y);};
    this.state='play';this.mode='reward';
    const started=this.mcGate?.(bossMotionId(v.stage),next);
    this.clearBossVictory();
    if(!started)next();
  }

  clearFoes(){ this.foeBullets.children.iterate(b=>{ if(b&&b.active)this.killFoe(b); }); }
  clearOrbs(){ if(this.orbs)this.orbs.children.iterate(o=>{ if(o&&o.active){ this.tweens.killTweensOf(o); o._vac=false; o.setActive(false).setVisible(false); if(o.body){o.body.enable=false;o.setVelocity&&o.setVelocity(0,0);} } }); }
  clearPickups(alsoHeals){ if(alsoHeals&&this.loots)this.loots.children.iterate(g=>{ if(g?.active&&g.dropType==='sugar'){ this.sugarStage=(this.sugarStage||0)+(g.sugarVal||0); this.sugarRun=(this.sugarRun||0)+(g.sugarVal||0); g.dropType=null; } });   // v8.1.51 Sugar ภารกิจที่ยังไม่เก็บไม่หาย
    if(this.crates)this.crates.children.iterate(c=>{ if(c&&c.active){ this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false; } });
    if(alsoHeals){ for(const grp of [this.heals,this.vacs,this.loots,this.chests,this.gimmicks]){ if(grp)grp.children.iterate(o=>{ if(o&&o.active){ this.tweens.killTweensOf(o); if(o._glow){this.tweens.killTweensOf(o._glow);o._glow.destroy();o._glow=null;} this.hidePickupCue(o); this.clearMimicCue(o); o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; } }); } } }
  // ตั้งเวลาเหตุการณ์ประจำStage (เริ่มเวฟ/บอส/รางวัล) แบบทนต่อ modal: ถ้าตอนถึงเวลายังติดหน้าเลเวลอัพ/กล่องสุ่ม/pause
  // จะ "Wait" แล้วยิงเมื่อกลับมาเล่นจริง (state==='play') — กันบั๊กเวฟไม่มา/เกมค้างหลังMiniboss
  scheduleStageEvent(delayMs,mode,fn){
    this.time.delayedCall(delayMs,()=>{
      if(this.state==='menu'||this.state==='dead')return;   // ออกจากด่าน/ตาย = ยกเลิก
      if(this.mode!==mode)return;                            // โหมดเปลี่ยน (ถูก override) = ยกเลิก
      if(this.state!=='play'){ this.scheduleStageEvent(350,mode,fn); return; }   // ยังติด modal (levelup/rolling/paused) → Waitแล้วลองใหม่
      fn();
    });
  }
  onWaveCleared(keep,fromMini){
    if(this._v83Run){this.clearChapterCombatWave?.();this.settleStoryBudget(true);}
    else if(this.usesStoryBudget?.())this.settleStoryBudget(!!fromMini,!!(this._replayMeter&&fromMini));
    this._clearT=0;this._clearFled=false;
    if(this._v83Run&&this.waveIndex+1<STAGES[this.stageIndex].waves){
      this.boss=null;Sfx.bgmIntense(false);if(fromMini)Sfx.playStageBgm(this.stageIndex+1);
      this.bossUI.forEach(o=>o.setVisible(false));this.clearWaveObjective();
      const next=this.waveIndex+1,run=this._lootTok;this.mode='breather';
      this.scheduleStageEvent(0,'breather',()=>{
        if(this._v83Run&&run===this._lootTok)this.startWave(next,true);
      });return;
    }
    this.boss=null;Sfx.bgmIntense(false);if(String(Sfx._currentBgmKey||'').startsWith('bgm_m'))Sfx.playStageBgm(this.stageIndex+1);this.bossUI.forEach(o=>o.setVisible(false));this.clearWaveObjective();this.clearFoes();this.clearEnemies();
    if(fromMini&&this._replayMeter){this._replayMeter.miniDone=true;this.mode='breather';this.clearPickups(false);this.scheduleStageEvent(900,'breather',()=>this.startWave(this.waveIndex+1,false));return;}
    const st=STAGES[this.stageIndex],next=this.waveIndex+1;this.mode='breather';this.clearPickups(false);this.updateWaveText();this.poseFlash(CF.cheer,600);
    if(next>=st.waves){this.mode='bossWarning';this.updateWaveText();
      this.scheduleStageEvent(300,'bossWarning',()=>{const rage=this.bossRageInfo();this.showBanner('⚠️ '+rage.emoji+' Boss '+rage.name,st.boss+' · Minions '+rage.kills+' · reward x'+rage.reward.toFixed(2),2600);Sfx.bossWarn();this.screenFlash(rage.color,0.20,650);
        this.scheduleStageEvent(3000,'bossWarning',()=>this.spawnFinalBoss());});return;}
    this.scheduleStageEvent(300,'breather',()=>{this.showBanner('Breather: 3 seconds','Wave '+(next+1)+' incoming',2400);
      this.scheduleStageEvent(3200,'breather',()=>this.startWave(next,false));});
  }
  // Two explicit screen choices; combat waits until the player chooses.
  openCrossroads(next){
    if(this.state!=='play'){this.scheduleStageEvent(350,'breather',()=>this.openCrossroads(next));return;}
    this.clearCrossroads();this._xrNext=null;this.player.setVelocity(0,0);this.state='rolling';this.physics.pause();
    const w=this.W,h=this.H,cw=Math.min(w-40,350),ch=116,gap=18,top=Math.max(130,h*0.35);
    const cont=this.camUI(this.add.container(0,0).setDepth(96));
    cont.add(this.add.rectangle(0,0,w,h,0x0b0714,0.94).setOrigin(0));
    cont.add(this.add.text(w/2,top-66,'Miniboss cleared',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffe08a'}).setOrigin(0.5));
    cont.add(this.add.text(w/2,top-34,'Choose one reward',{fontFamily:'sans-serif',fontSize:'15px',color:'#e8dcff'}).setOrigin(0.5));
    this._xr={next,cont,picked:false};
    this._rollBtns=CROSSROADS.map((d,i)=>{
      const x=(w-cw)/2,y=top+i*(ch+gap),g=this.add.graphics();
      g.fillStyle(0x21172f,1);g.fillRoundedRect(x,y,cw,ch,16);g.lineStyle(2,d.color,1);g.strokeRoundedRect(x,y,cw,ch,16);
      const art=this.add.image(x+44,y+ch/2,d.artKey).setDisplaySize(52,52);
      const tx=x+82,tw=cw-94;
      cont.add([g,art,this.add.text(tx,y+18,d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'19px',color:'#'+d.color.toString(16).padStart(6,'0')}),
        this.add.text(tx,y+48,d.desc,{fontFamily:'sans-serif',fontSize:'14px',color:'#ffffff',wordWrap:{width:tw}}),
        this.add.text(tx,y+82,d.detail,{fontFamily:'sans-serif',fontSize:'12px',color:'#cfc2df',wordWrap:{width:tw}})]);
      return {x,y,w:cw,h:ch,fn:()=>this.chooseCrossroad(d)};
    });Sfx.chest();
  }
  tickCrossroads(dt){} // No world doors or automatic expiry.
  chooseCrossroad(d){
    const xr=this._xr;if(!xr||xr.picked||!CROSSROADS.some(o=>o.id===d.id))return;xr.picked=true;
    const p=this.player,next=xr.next;this.clearCrossroads();this._xrNext=next;
    if(d.id==='blood'){
      p.hp=Math.max(1,p.hp*0.7);p.dmgMul+=(1.25)-1;const si=this.stageIndex,runPlayer=p;
      this.time.delayedCall(90000,()=>{if(this.player===runPlayer&&this.stageIndex===si&&this.state!=='menu')p.dmgMul-=0.25;});
      this.showBanner('Blood Pact','−30% current HP · +25% damage for 90s',2400);
    }else{p.hp=Math.min(p.maxhp,p.hp+p.maxhp*0.4);Sfx.heal();this.showBanner('Recovered HP','Restored 40% of maximum HP',2000);}
    Sfx.chestWin&&Sfx.chestWin();this.resumeAfterCrossroads();
  }
  duelEliteDown(){ if(!this._xrDuel)return; this._xrDuel=false; this.time.delayedCall(600,()=>{ if(this.state==='play'&&!this.offerRelic())this.grantCurrencyReward(3,this.currencyTierFor(),'👹 Champion defeated!'); }); this.resumeAfterCrossroads(1500); }
  resumeAfterCrossroads(ms=0){ this.clearCrossroads(); const next=this._xrNext!=null?this._xrNext:this.waveIndex+1; this._xrNext=null;
    this.scheduleStageEvent(300+ms,'breather',()=>{this.showBanner('Breather: 3 seconds','Wave '+(next+1)+' incoming',2400);
      this.scheduleStageEvent(3200,'breather',()=>this.startWave(next,false));}); }
  clearCrossroads(){
    const xr=this._xr;if(!xr)return;if(this._xrNext==null)this._xrNext=xr.next;
    if(xr.cont){xr.cont.destroy(true);this._rollBtns=[];if(this.state==='rolling'){this.state='play';this.physics.resume();}}
    this._xr=null;
  }
  // บอสตาย → เปิดกล่องรางวัลจบStage (Sugar/อุปกรณ์) แล้วกลับหน้าเลือกด่าน
  onBossDown(x,y){this.voiceBark?.('win');this.rubyVoiceReact?.('bossdown',1800);
    { let left=0; this.orbs.children.iterate(q=>{if(!q||!q.active)return;left+=q.value||1;if(q._storyBudget)q._storyBudget.paid+=q.value||1;q._vac=false;q.setActive(false).setVisible(false);if(q.body)q.body.enable=false;}); if(left>0)this.gainXp(left); }   // v7.9.8 เม็ดที่ยังเหลือก่อนหน้ารางวัล = นับให้ครบ
    this._rewardRage=this.bossRageInfo();{ const bx=this.player?.x||0,by=this.player?.y||0; if(this._twist)this.bossTwistEnd?.(false); if(BOSS_TWIST_ON&&BOSS_TWIST_BOX&&BOSS_TWIST[this.stageIndex||0]&&!this.bossRush&&!this.recipeMode&&!this.riftMode&&!this._replayMeter){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(bx+40,by-40,(this.stageIndex>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }catch(e){}finally{ this._lootMinRare=false; } } }   /* v8.2.83 กล่อง Gear จากภารกิจบอส → รางวัลชนะบอส Ch2–3 */
    this.boss=null;this.mode='reward';if(this._stack?.boss)this.stackEnd?.(true);this.bossUI.forEach(o=>o.setVisible(false));Sfx.bossClear();this.time.delayedCall(3000,()=>{if(!this.boss&&this.state!=='menu')Sfx.playStageBgm(this.stageIndex+1);});this.clearFoes();this.clearEnemies();this.clearBossObjects();
    // 🧪 ล้มบอส = การันตี currency ก้อนใหญ่ (ยิ่งด่าน/ยากสูง ยิ่งเยอะ+ดี — กฎเหล็ก)
    this.grantCurrencyReward(4+(this.stageIndex||0)+((this.stageDiff||1)-1)*2,this.currencyTierFor(),'🏆 Boss Down! Currency gained');
    if(this.bossRush){ this.screenFlash(0xffd166,0.42,420);this.burst(x,y,0xffd166);Sfx.chest(); this.mode='breather'; this.bossRushBossDown(); return; }
    if(this.recipeMode)this.finishRecipeBoss();
    if(this.riftMode&&!this.recipeMode){ const t=this._riftTier||1,keys=1+(t>=5?1:0)+(t>=10?1:0); Save.data.riftKeys=(Save.data.riftKeys||0)+keys; Save.data.riftBest=Math.max(Save.data.riftBest||1,t+1); Save.save(); this.showBanner('🌀 Rift Tier '+t+' cleared!','+'+keys+' 🗝️ Rift Key · Tier '+(t+1)+' unlocked',2600); }
    const next=this.stageIndex+1,progressUnlock=next<STAGES.length&&(Save.data.unlockedStage||0)<next&&(!this.storyVoice?.()||!!Save.data.storyGateKeys?.[next]),canUnlock=(progressUnlock||this._storyKeyJustCollected===next)&&isStageReady(next);
    if(progressUnlock){Save.data.unlockedStage=next;Save.unlockCoreCharacters?.();Save.save();}
   // v7.8.93 diffBest ไม่บันทึกแล้ว (Story ระดับเดียว)
    this.screenFlash(0xffd166,0.42,420);this.burst(x,y,0xffd166);Sfx.chest();
    const _note=canUnlock?((this._storyKeyJustCollected===next?'🗝 Wayseed Key · ':'🔓 Unlocked ')+STAGES[next].name):(progressUnlock?'🛠️ The next Chapter 2 stage is still in production':null);
    const _bl=this._bossLoot,_show=this.bossLootShow?.(x,y,_bl);   /* v8.1.101 เจ้าของ: บอสไม่เห็น loot bomb เพราะวงล้อเด้งทันที → ของระเบิดออก ลอยค้าง แล้วบินเข้าตัวก่อน ค่อยเปิดวงล้อ */
    this.time.delayedCall(_show?2400:700,()=>this.openBossLootCards(()=>this.revealStageReward(_note)));
  }
  // ภาพล้วน: Sugar/กล่องของบอสพุ่งออกจากจุดตาย ค้าง ~1.1 วิ แล้วบินเข้าผู้เล่น (รางวัลถูกบวกไปแล้วใน bigFoeLoot — ไม่แตะยอด)
  bossLootShow(x,y,bl){ if(!this.add||!this.tweens||this._inTutorial)return false; const P=this.player; if(!P)return false;
    const n=8,boxes=Math.min(4,bl?.boxes||0),items=[]; const mk=(key,emo,sz)=>{ const o=this.textures?.exists?.(key)?this.add.image(x,y,key).setDisplaySize(sz,sz):this.add.text(x,y,emo,{fontSize:Math.round(sz*.8)+'px'}).setOrigin(.5); o.setDepth?.(90000); this.camWorld?.(o); return o; };
    for(let i=0;i<n;i++)items.push(mk('ic_sugar','🍬',24)); for(let i=0;i<boxes;i++)items.push(mk('gift','🎁',40));
    this.vfxHitRing?.(x,y,0xffd166,true); this.screenShake?.(160,.008); Sfx.orderCue?.('mission_loot_burst',.5,.3);
    items.forEach((o,i)=>{ const a=i/items.length*Math.PI*2+Math.random()*.4,d=(o.width>30?70:90)+Math.random()*60,tx=x+Math.cos(a)*d,ty=y+Math.sin(a)*d*.8;
      this.tweens.add({targets:o,x:tx,y:ty,duration:460,ease:'Quad.out',onComplete:()=>{ this.tweens.add({targets:o,y:ty-8,duration:300,yoyo:true,repeat:1,ease:'Sine.inOut'}); }});
      this.time.delayedCall(1500+i*45,()=>{ if(!o.active)return; this.tweens.killTweensOf(o); this.tweens.add({targets:o,x:{getEnd:()=>this.player?.x??tx},y:{getEnd:()=>this.player?.y??ty},scale:o.scale*.5,duration:380,ease:'Quad.in',onComplete:()=>{ o.destroy(); if(i%3===0)Sfx.xp?.(); }}); }); });
    if(bl)this.time.delayedCall(1900,()=>this.floatText?.(this.player?.x||x,(this.player?.y||y)-90,(bl.boxes?'🎁 +'+bl.boxes+' boss loot · ':'')+'🍬 +'+bl.sugar,0xffd166));
    return true; }
  // v6.54.9: ล้มบอส = การ์ดสุ่ม 3 ใบ (ของหลายชนิด) เลือก 1 แบบ Jackpot Event
  openBossLootCards(done){ if(this._bossLootOpen)return; this._bossLootOpen=true; const _d0=done; done=()=>{this._bossLootOpen=false;_d0&&_d0();};   // v7.8.97 เจ้าของ (แบบ A): รางวัลบอส = วงล้อทอง + ปุ่ม Double or Nothing
    const si=this.stageIndex||0,dr=this.diffMul?this.diffMul().reward:1,S=n=>Math.max(1,Math.round(n*(1+si*0.3)*dr));
    const pool=[
      {id:'sugar',artKey:'prize_sugar',name:'Sugar',sub:'+'+S(120),w:5,color:0xff7fb0,give:()=>{this.sugarStage+=S(120);}},
      {id:'currency',artKey:'prize_currency',name:'Currency',sub:'×'+(2+Math.floor(si/3)),w:5,color:0x7fd0ff,give:()=>this.grantCurrencyReward(2+Math.floor(si/3),this.currencyTierFor(),'Boss wheel')},
      {id:'shovel',artKey:'prize_shovel',name:'Shovels',sub:'+'+(3+Math.floor(dr)),w:4,color:0xc9a36b,give:()=>Save.addShovels(3+Math.floor(dr))},
      {id:'thread',artKey:'prize_thread',name:'Weave Thread',sub:'+'+S(25),w:5,color:0xd59bff,give:()=>Save.addThreads(S(25))},
      {id:'gear',artKey:'prize_chest',name:'Gear',sub:'Random item',w:3,color:0x8ff0b0,give:()=>{ const t=Math.random()<0.15*dr?'epic':'rare'; this.grantGear&&this.grantGear(t); }},
      {id:'jackpot',artKey:'prize_jackpot',name:'JACKPOT',sub:'Sugar +'+S(250)+' · Currency ×3 · Shovels +5',w:2.4,color:0xffd166,jackpot:true,give:()=>{this.sugarStage+=S(250);this.grantCurrencyReward(3,this.currencyTierFor(),'JACKPOT');Save.addShovels(5);}}];
    this.openPrizeWheel('gold',()=>done(),{prizes:pool,title:'👑 Boss Loot',double:true});
  }
  openDoubleOrNothing(p,done){
    const skull={emoji:'💀',name:'Nothing',sub:'You lost the prize',color:0x8a3a4a,give:()=>{}},win={emoji:p.emoji,artKey:p.artKey,name:p.name+' ×2',sub:p.sub+' ×2',color:0xffd166,jackpot:true,give:()=>{p.give();p.give();}};
    this.openMysteryCards(()=>{ this._bossRerolled=false; done&&done(); },{prizes:Phaser.Utils.Array.Shuffle([skull,win,Object.assign({},win)]),title:'Double or Nothing',hint:'2 cards double your prize · 1 card loses it all'});
  }
  // v4.23: เลิกให้เลือกกล่อง (การเลือกแบบไม่รู้ผล = ไม่มีความหมาย) → สุ่มรางวัลให้เลยแล้วโชว์ผลชัด ๆ
  revealStageReward(note){
    this.state='rewardChoice';this.physics.pause();this.player.setVelocity(0,0);this.lvlUp.setVisible(false);this.over.removeAll(true);this._rewardBtns=[];
    this._stageReward=this.rollStageReward('fortune');Sfx.clear();
    const w=this.W,h=this.H,r=this._stageReward,bg=this.add.rectangle(0,0,w,h,0x090611,0.96).setOrigin(0),glow=this.add.image(w/2,h*0.40,'vfx_glow').setTint(r.type==='gear'?0x6ed7df:0xffd166).setScale(1.5).setAlpha(0.5),em=r.artKey&&this.textures.exists(r.artKey)?this.add.image(w/2,h*0.38,r.artKey).setDisplaySize(104,104):this.add.text(w/2,h*0.38,r.emoji,{fontSize:'86px'}).setOrigin(0.5),t=this.add.text(w/2,h*0.55,r.type==='gear'?'Gear reward!':'Sugar reward!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffe08a'}).setOrigin(0.5),d=this.add.text(w/2,h*0.62,r.label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',align:'center',wordWrap:{width:w-40}}).setOrigin(0.5);glow.setVisible(false);this.over.add(bg);this.revealBackdrop?.(this.over,w,h);glow.setScale(.5).setAlpha(.16);this.over.add([glow,em,t,d]);
    if(note){const n=this.add.text(w/2,h*0.70,note,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#9be89b'}).setOrigin(0.5);this.over.add(n);}
    if(r.type==='gear')this.over.add(this.add.text(w/2,h*0.76,'Equip it from the Gear menu on the Stage Select screen',{fontFamily:'sans-serif',fontSize:'11px',color:'#bfb4cc',align:'center',wordWrap:{width:w-60}}).setOrigin(0.5));
    const sx=em.scaleX,sy=em.scaleY;this.tweens.add({targets:em,scaleX:{from:sx*0.4,to:sx},scaleY:{from:sy*0.4,to:sy},duration:420,ease:'Back.out'});this.screenFlash(0xffd166,0.35,350);
    this.time.delayedCall(1650,()=>{if(this.state==='rewardChoice'){this.over.setVisible(false);this.onStageClear();}});
  }
  rollStageReward(kind='fortune'){
    const stage=this.stageIndex+1,rage=this._rewardRage||this.bossRageInfo(),dr=this.diffMul().reward;   // กฎเหล็ก: ยิ่งยาก better rewards
    const diffHi=(this.stageDiff||1)>=4;   // ความยากสูง = ลุ้นของแรร์/เอปิกมากขึ้น
    const gearChance=kind==='sugar'?0:(kind==='gear'?Math.min(0.98,(0.72+stage*0.035)*Math.min(1.35,dr)):Math.min(0.95,rage.gear*dr));
    if(Math.random()<gearChance){
      let tier=rage.minTier;if(tier==='common')tier=(stage>=4||diffHi)&&Math.random()<0.24*dr?'epic':(stage>=2||this.stageDiff>=3)&&Math.random()<0.38*dr?'rare':'common';else if(tier==='rare'&&Math.random()<(rage.tier>=3||diffHi?0.40:0.22)*Math.min(1.8,dr))tier='epic';
      const gear=this.grantGear(tier);
      if(gear){const slot=GEAR_SLOTS.find(s=>s.slot===gear.slot);return{type:'gear',artKey:'gear_'+gear.id,emoji:slot?slot.emoji:'🎁',label:rage.emoji+' '+rage.name+' · '+(slot?slot.emoji+' ':'')+gear.name+gearDeliverySuffix(gear),rage};}
    }
    const guide=this._powerGuide||this.getPowerGuide(this.stageIndex),jackpot=kind==='fortune'&&Math.random()<0.18?1.8:1,sugar=Math.round((30+stage*15+Phaser.Math.Between(0,15))*rage.reward*guide.reward*dr*(kind==='sugar'?1.35:1)*jackpot*(this.rankSugarMul||1)*(this.player.sugarFindMul||1));
    this.sugarStage+=sugar;this.sugarRun+=sugar;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);
    return{type:'sugar',artKey:jackpot>1?'prize_jackpot':'prize_sugar',emoji:jackpot>1?'💰':'🍬',label:rage.emoji+' '+rage.name+' · Sugar +'+sugar+(jackpot>1?' · JACKPOT!':''),amount:sugar,rage};
  }
  clearExitPortal(){if(!this.portals)return;this.portals.children.iterate(p=>{if(p&&p.active){this.tweens.killTweensOf(p);p.setActive(false).setVisible(false);if(p.body)p.body.enable=false;}});this.portalTarget=null;}
  enterPortal(player,p){
    if(!p.active||p.used||this.mode!=='portal')return;p.used=true;this.mode='transition';this.tweens.killTweensOf(p);p.setActive(false).setVisible(false);if(p.body)p.body.enable=false;this.portalTarget=null;
    const next=this.stageIndex+1,last=!isStageReady(next);Save.addSugar(this.sugarStage);this.gainCharExp(40+this.stageIndex*25);
    if(next<STAGES.length&&(Save.data.unlockedStage||0)<next){Save.data.unlockedStage=next;Save.save();}
    this.screenFlash(0xb98cff,0.75,520);Sfx.clear();
    if(last){this.time.delayedCall(500,()=>this.victory());return;}
    this.player.setVelocity(0,0);this.state='loading';
    if(window.GameLoader)window.GameLoader.show('Opening the door to the next stage...',0.18);
    this.stageLoadCover?.(next);this.time.delayedCall(520,()=>this.ensureStageArt(next,()=>this.ensureStageAudio(next,()=>{this.resetStageLoadout();this.state='play';this.startStage(next);
      if(window.GameLoader){window.GameLoader.set(1,'Entering a new stage!');this.time.delayedCall(160,()=>window.GameLoader.hide());}})));
  }
  resetStageLoadout(){ this.cancelSnipe();this.clearArtVfx();
    if(this._triSeals)this._triSeals.forEach(p=>{if(p.obj&&p.obj.active)p.obj.destroy();});this._triSeals=[];this._echoTrail=[];
    this.clearFoes();this.clearEnemies();this.clearPickups(true);this.clearBossObjects();this.clearStarGuardFx();this.clearCharSignature();
    this.bullets.children.iterate(b=>{if(b&&b.active)this.killBullet(b);});this.clearAuraFx();
    this.clearYuzuCrew();this.skills={};this.basicAttack=null;this.passives={};this.resetRelics();this.comboFlags={};this.combosOwned={};this.dishCount=0;this.uniqueCd=0;this.uniqueLevel=typeof uniqueTalentLevel==='function'?uniqueTalentLevel(this.character||Save.data.character):1;this._cocoaRegenT=0;this.wardGuardT=0;this.pathHasteT=0;this.windRushT=0;this.stageKills=0;
    this.banishedKeys={};this._boxAcc=null;this._reviveLeft=(Save.rankHas?.("revive")?1:0)+Save.gearReviveCount();
    this.skillCd={};for(const k in SKILLDEFS)this.skillCd[k]=0;this.level=1;this.xp=0;this.xpNext=12;this.pendingLvl=0;this._queuedBossIntro=null;this.sugarStage=0;
    this.player.maxhp=90;this.player.baseSpeed=BALANCE.moveSpeed;this.player.pickup=105;this.player.dmgMul=1;this.applyMeta();this.equipSignatureWeapon();this.player.hp=this.player.maxhp;
    this.player.setPosition(0,0).setVelocity(0,0);this.buildSkillBar();this.lvlTxt.setText('Lv 1');
  }
  onStageClear(){ try{ const _ss=this.rpAdd?.('starsugar')||0; if(_ss>0&&typeof Save!=='undefined'){ Save.addCurrency('starsugar',_ss); this.showBanner?.('🪟 Glass Garden','+'+_ss+' Star Sugar',1500); } }catch(e){}   /* v8.2.29 */ this.clearSugarCoins(); this.evalStageStars?.();
    // v5.32 ⛏️ พลั่วจากการผ่านด่าน: ปกติ 1 / ยาก 2 / นรก 3 (กฎเหล็ก) · ไม่ให้ใน tutorial
    this._clearShovels=0;if(!this._inTutorial){ const n=Math.max(1,Math.min(3,this.stageDiff||1))+2; Save.addShovels(n);this._clearShovels=n; this.time.delayedCall(900,()=>this.showBanner&&this.showBanner('⛏️ +'+n+' Shovel'+(n>1?'s':''),'Dig for treasure in the Temple Depths',1600)); }
    this.boss=null; this.mode='clear'; this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e&&e.active){ e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
    this.clearFoes(); this.clearPickups(true); this.waveAlive=0; this.pipG.clear();
    this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.35); // heal reward
    this._openedBoxes=this.openRunBoxes();   // เปิดกล่องไอเทมที่สะสมทั้งด่าน (แจกจริง · duplicate → sugarStage ก่อนฝาก)
    Sfx.clear();
    const next=this.stageIndex+1,last=!isStageReady(next),guide=this._powerGuide||this.getPowerGuide(this.stageIndex);this._powerBefore=Save.power(this.character);
    this._firstMastery=!Save.data.stageMastery[this.stageIndex];if(this._firstMastery){Save.data.stageMastery[this.stageIndex]=true;this.sugarStage+=40+this.stageIndex*25;Save.unlockCoreCharacters();Save.save();}
    this._dailyBonus=0;
    Save.addSugar(this.sugarStage);                                   // ฝาก Sugar + โบนัส Mastery/Daily
    sweepRecord(this.stageIndex,this.sugarStage-(this._firstMastery?40+this.stageIndex*25:0));   // v8.1.70 จำรางวัลด่านไว้ให้ Sweep/Patrol
    this.gainCharExp(Math.round((75 + this.stageIndex*35)*guide.reward)); // catch-up EXP มากขึ้นเมื่อผ่านด่านด้วยพลังต่ำกว่าคำแนะนำ
    this._powerAfter=Save.power(this.character);
    if(next<STAGES.length&&(Save.data.unlockedStage||0)<next){ Save.data.unlockedStage=next; Save.save(); }
    // Mochi Bazaar restock: ผ่านด่านใดก็ได้ = สุ่มร้านใหม่ · stock อ้างอิง Zone Level ของด่านที่เพิ่งผ่าน
    Save.data.bazaarSeed=(Save.data.bazaarSeed||0)+1; Save.data.bazaarZone=this.zoneLevel(); Save.data.bazaarBought=[]; Save.save();
    this._summaryDoubled=false;this._summaryPresentationShown=false;   // รีเซ็ตสิทธิ์ดูโฆษณา x2 ต่อการเคลียร์ด่าน
    this.showStageEpilogue(last);   // Already granted boxes are presented together on the result screen.
  }
  /* หน้าสรุปเรื่องราวตอนล้มบอส — เกิดอะไรขึ้น + ทำไมไปด่านต่อไป → แตะไปหน้าสรุปสถิติ */
  resultBackdrop(key){
    if(key==='result_victory'&&this.textures.exists('sc44_background'))return this._coverImage(0,0,this.W,this.H,'sc44_background');
    if(this.textures.exists(key))return this._coverImage(0,0,this.W,this.H,key).setTint(key==='result_defeat'?0x9b8eaa:0xbca8bf);
    return this.add.rectangle(0,0,this.W,this.H,0x100b19,0.92).setOrigin(0,0);
  }
  playGrowthWorld(kind,ts){
    const key='growth_'+kind,p=this.player;if(!p||!this.textures.exists(key))return false;
    const now=this.time.now;this._growthVfxAt=this._growthVfxAt||{};
    if(now-(this._growthVfxAt[kind]??-Infinity)<500)return true;this._growthVfxAt[kind]=now;
    const fx=this.spawnFxAnim(key,p.x,p.y-12,{scale:220/256,depth:8,anchor:'center',normal:true});if(fx){if(ts&&fx.anims)fx.anims.timeScale=ts;this.trackArtVfx(fx);}return !!fx;
  }
  playSummaryGrowth(kind){
    const key='growth_'+kind;if(!this.textures.exists(key))return;
    const def=ASSET_FX[key];if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:7}),frameRate:def.rate,repeat:0});
    const x=this.W/2+(this._firstMastery&&this._lastLvlUps>0?(kind==='mastery'?-45:45):0);
    const fx=this.camUI(this.add.sprite(x,this.H*.14,key,0).setDisplaySize(Math.min(100,this.W*.25),Math.min(100,this.W*.25)).setBlendMode(Phaser.BlendModes.NORMAL));
    this.over.add(fx);this._summaryGrowthVfx=this._summaryGrowthVfx||new Set();this._summaryGrowthVfx.add(fx);
    fx.once('destroy',()=>this._summaryGrowthVfx&&this._summaryGrowthVfx.delete(fx));fx.once('animationcomplete',()=>fx.destroy());fx.play(key);
  }
  showStageEpilogue(last){
    // Post-victory boss memory, then the existing chapter ending, then rewards. No legacy still/caption recap.
    const owner=this._bossComicOwner||this.ownBossComic();if(!this.bossComicValid(owner))return;
    const next=()=>{if(this.bossComicValid(owner))this.showStageEpilogue(last);};
    if(this.mcStory?.()){
      if(this.mcGate?.(bossMotionId(this.stageIndex),next))return;
      const chapter=typeof MC_AFTER_STAGE!=='undefined'?MC_AFTER_STAGE[this.stageIndex]:null;if(chapter&&this.mcGate?.(chapter,next))return;
    }
    this._bossComicOwner=null;this.showStageSummary(last);
  }
  /* หน้าสรุปStage — แตะเพื่อไปต่อ */
  /* v7.9.9 ฉากเปิดกล่องตอนจบด่าน: กล่องเรียงเป็นตาราง เปิดทีละใบ (สั่น → แสง → ของ) · แตะ = เปิดที่เหลือทันที · Continue ไปต่อ */
  playBoxOpening(list,done){
    list=(list||[]).filter(Boolean); if(!list.length||this._inTutorial){done();return;}
    this.state='rolling';this.physics.pause();this.player.setVelocity(0,0);this.over.removeAll(true);this._rollBtns=[];
    const w=this.W,h=this.H,cont=this.over,F='NunitoUI, sans-serif',TC=t=>(FIELD_DROP_TABLE[t]||FIELD_DROP_TABLE.common).color,hex=c=>'#'+c.toString(16).padStart(6,'0');
    const veil=(this.add.rectangle(w/2,h/2,w,h,0x150d1c,.96));cont.add(veil);
    const ttl=(this.add.text(w/2,h*.12,'🎁 Boxes found this stage',{fontFamily:F,fontStyle:'bold',fontSize:'22px',color:'#ffe9a8',stroke:'#3b1d2a',strokeThickness:5}).setOrigin(.5));cont.add(ttl);
    const sub=(this.add.text(w/2,h*.12+30,'Tap to open them all',{fontFamily:F,fontSize:'12px',color:'#c9bdd6'}).setOrigin(.5));cont.add(sub);
    const order={legend:0,epic:1,rare:2,common:3},show=list.slice().sort((a,b)=>(order[b.tier]??3)-(order[a.tier]??3)).slice(-15),extra=list.length-show.length;   // ของดีเปิดทีหลัง (ลุ้น)
    const cols=Math.min(5,show.length),rows=Math.ceil(show.length/cols),cell=Math.min(68,(w-40)/cols-10),gap=10,gw=cols*cell+(cols-1)*gap,top=h*.24+Math.max(0,(3-rows))*((cell+30)/2);
    const slots=show.map((b,i)=>{ const c=i%cols,r=Math.floor(i/cols),rowN=Math.min(cols,show.length-r*cols),x=w/2-(rowN*cell+(rowN-1)*gap)/2+cell/2+c*(cell+gap),y=top+r*(cell+34)+cell/2,col=TC(b.tier);
      const glow=(this.add.circle(x,y,cell*.55,col,.18));
      const box=((this.textures.exists('chest')?this.add.image(x,y,'chest').setDisplaySize(cell*.86,cell*.86):this.add.text(x,y,'🎁',{fontSize:Math.round(cell*.6)+'px'}).setOrigin(.5)));if(box.setTint)box.setTint(col);
      cont.add([glow,box]);return {b,x,y,col,glow,box,open:false}; });
    if(extra>0){const t=(this.add.text(w/2,top+rows*(cell+34)+4,'+'+extra+' more',{fontFamily:F,fontSize:'12px',color:'#c9bdd6'}).setOrigin(.5));cont.add(t);}
    let idx=0,timer=null,fin=false;
    const reveal=(sl,fast)=>{ if(sl.open)return;sl.open=true;const {b,x,y,col}=sl;this.tweens.killTweensOf(sl.box);
      const ring=(this.add.circle(x,y,cell*.3,0xffffff,.0).setStrokeStyle(3,col,1));cont.add(ring);this.tweens.add({targets:ring,scale:2.2,alpha:0,duration:380,onComplete:()=>ring.destroy()});
      sl.box.destroy();sl.glow.setAlpha(b.tier==='legend'||b.tier==='epic'?.45:.25);
      const key=b.id&&'gear_'+b.id,art=((key&&this.textures.exists(key)?this.add.image(x,y,key).setDisplaySize(cell*.82,cell*.82):this.add.text(x,y,b.emoji||'✨',{fontSize:Math.round(cell*.5)+'px'}).setOrigin(.5)));
      const nm=(this.add.text(x,y+cell/2+4,b.name||'',{fontFamily:F,fontStyle:'bold',fontSize:'9px',color:hex(col),align:'center',wordWrap:{width:cell+gap}}).setOrigin(.5,0));if(nm.height>24)nm.setScale(24/nm.height);
      cont.add([art,nm]);if(!fast){art.setScale(art.scaleX*.3,art.scaleY*.3);this.tweens.add({targets:art,scaleX:art.scaleX/.3,scaleY:art.scaleY/.3,duration:260,ease:'Back.out'});}
      if(b.tier==='legend'){Sfx.orderCue?.('box_reveal_legend',.5,.15)||Sfx.legend?.();this.screenFlash?.(0xffb347,.35,300);}else if(b.tier==='epic'){Sfx.orderCue?.('box_reveal_epic',.4,.15)||Sfx.ev?.('pickup_gear',.6,.1);}else Sfx.orderCue?.('box_reveal_'+(b.tier==='rare'?'rare':'common'),.3,.15)||Sfx.select?.(); };
    const finish=()=>{ if(fin)return;fin=true;if(timer)timer.remove();slots.forEach(sl=>reveal(sl,true));sub.setText(list.length+' box'+(list.length>1?'es':'')+' opened · items are in your bag');
      const bw=Math.min(240,w-60),bh=46,bx=w/2-bw/2,by=Math.min(h-bh-30,top+rows*(cell+34)+40),g=(this.add.graphics());g.fillStyle(0x3f8f5a,1).fillRoundedRect(bx,by,bw,bh,14);g.lineStyle(2,0xffe9a8,1).strokeRoundedRect(bx,by,bw,bh,14);
      const t=(this.add.text(w/2,by+bh/2,'Continue',{fontFamily:F,fontStyle:'bold',fontSize:'16px',color:'#ffffff'}).setOrigin(.5));cont.add([g,t]);
      this.time.delayedCall(250,()=>{this._rollBtns=[{x:bx,y:by,w:bw,h:bh,fn:()=>{this._rollBtns=[];this.over.removeAll(true);done();}}];}); };
    const step=()=>{ if(fin)return;const sl=slots[idx++];if(!sl){finish();return;}
      this.tweens.add({targets:sl.box,angle:{from:-10,to:10},duration:60,yoyo:true,repeat:2,onComplete:()=>{reveal(sl,false);timer=this.time.delayedCall(sl.b.tier==='legend'?520:sl.b.tier==='epic'?380:200,step);}}); };
    this.over.setVisible(true);this._rollBtns=[{x:0,y:0,w,h,fn:()=>finish()}];
    timer=this.time.delayedCall(450,step);
  }
  stopSummaryPresentation(){
    this._summarySoundToken=(this._summarySoundToken||0)+1;
    (this._summarySoundTimers||[]).forEach(t=>t.remove(false));this._summarySoundTimers=[];
    for(const fx of [...(this._summaryGrowthVfx||[])]){this.tweens.killTweensOf(fx);if(fx.active)fx.destroy();}if(this._summaryGrowthVfx)this._summaryGrowthVfx.clear();
    if(this._summaryExpTween){this._summaryExpTween.stop();this._summaryExpTween=null;}
    for(const tw of this._summaryTweens||[])tw?.stop?.();this._summaryTweens=[];
    this._summaryExpFinish=null;this._summaryReveal=null;
    this._summaryDetailsLayer?.destroy();this._summaryDetailsLayer=null;
    Sfx.stopCraft();
  }
  animateSummaryRewards(sugarText,rewards){
    const token=this._summarySoundToken,total=Math.max(0,Math.floor(this.sugarStage||0));
    if(this.hubMotionAllowed&&!this.hubMotionAllowed()){sugarText.setText('+'+total);rewards.flat().forEach(o=>o.setAlpha(1));this._summaryStarObjs?.forEach(o=>o.setAlpha(1));return;}
    this._summaryReveal={sugarText,rewards,stars:this._summaryStarObjs||[]};
    const later=(ms,fn)=>{this._summarySoundTimers.push(this.time.delayedCall(ms,()=>{if(this.state==='summary'&&this._summarySoundToken===token)fn();}));};
    Sfx.result('open');if((this._newSpecies||[]).length)later(180,()=>Sfx.orderCue?.('best_new',.3));const stars=this._quitSummary?null:this._starRes;/* v8.1.144 owner 🐞: everything popped at once → stars, then Sugar, then each reward in turn */ const nStar=stars?[0,1,2].filter(b=>stars.mask&(1<<b)).length:0; if(stars)for(let b=0;b<3;b++)if(stars.mask&(1<<b))later(250+b*330,()=>{Sfx.orderCue?.('stage_star_'+(b+1),.3);const o=this._summaryStarObjs?.[b];if(o?.active){o.setAlpha(1);const tw=this.tweens.add({targets:o,scale:{from:1.18,to:1},duration:180,ease:'Back.out'});(this._summaryTweens||(this._summaryTweens=[])).push(tw);}});
    const ticks=total>0?Math.min(8,total):0;
    const s0=250+nStar*330+150; if(ticks){sugarText.setText('+0');for(let i=1;i<=ticks;i++)later(s0+i*70,()=>{sugarText.setText('+'+Math.floor(total*i/ticks));Sfx.result('count',.9+i*.025);});}
    const at=s0+ticks*70;
    const step=Math.max(110,Math.min(380,1400/Math.max(1,rewards.length)));rewards.forEach((group,i)=>{group.forEach(o=>o.setAlpha(0));later(at+350+i*step,()=>{group.forEach(o=>{o.setAlpha(1);if(o.setScale&&o.type!=='Graphics'&&this.tweens){const sx=o.scaleX||1,sy=o.scaleY||1;o.setScale(sx*1.2,sy*1.2);const tw=this.tweens.add({targets:o,scaleX:sx,scaleY:sy,duration:220,ease:'Back.out'});(this._summaryTweens||(this._summaryTweens=[])).push(tw);}});Sfx.result('reveal');});});
    if(this._firstMastery||this._lastLvlUps>0)later(at+350+Math.max(0,rewards.length-1)*step+250,()=>{Sfx.result('important');if(this._firstMastery)this.playSummaryGrowth?.('mastery');if(this._lastLvlUps>0)this.playSummaryGrowth?.('levelup');});
    if(this.events&&!this._summaryShutdownHook){this._summaryShutdownHook=true;this.events.once('shutdown',()=>{this.stopSummaryPresentation();this._summaryShutdownHook=false;});}
  }
  buildSummaryExpBar(box,px,py,pw,ph,font,animate){
    const cp=Save.cp(this.character),snapshot=this._charExpGain&&this._charExpGain.character===this.character?this._charExpGain:null;
    const before=snapshot?snapshot.before:{lvl:cp.lvl,exp:cp.exp||0},gain=snapshot?snapshot.gain:0;
    const L=this._summaryLayout?.growth,x=L?L.x+16:px+pw*.15,y=L?L.y+L.h-22:py+ph*.652,width=L?L.w-32:pw*.70,height=L?10:Math.max(12,Math.min(18,ph*.03));
    const frame=this.add.graphics(),fill=this.add.graphics(),label=this.add.text(L?L.x+L.w/2:px+pw/2,L?y-13:py+ph*.632,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.max(11,font-1)+'px',color:'#c0ffe3',stroke:'#10202a',strokeThickness:3}).setOrigin(.5);
    frame.fillStyle(0x101c25,.95);frame.fillRoundedRect(x,y,width,height,height/2);frame.lineStyle(1,0xd9fff0,.55);frame.strokeRoundedRect(x,y,width,height,height/2);box.push(frame,fill,label);
    const token=this._summarySoundToken,draw=p=>{if(this.state!=='summary'||this._summarySoundToken!==token)return;
      const value=characterExpProgress(before,gain,p),ratio=Math.min(1,value.exp/value.need);fill.clear();
      if(ratio>0){fill.fillStyle(0x6dffb4,1);fill.fillRoundedRect(x+2,y+2,Math.max(2,(width-4)*ratio),height-4,(height-4)/2);fill.fillStyle(0xffffff,.35);fill.fillRoundedRect(x+3,y+3,Math.max(2,(width-6)*ratio),(height-4)*.4,2);}
      label.setText('Character EXP · Lv '+value.lvl+' · '+Math.floor(value.exp)+' / '+value.need+(gain?'  (+'+gain+')':''));
    };
    draw(animate&&gain?0:1);
    this._summaryExpFinish=()=>draw(1);
    if(animate&&gain)this._summaryExpTween=this.tweens.addCounter({from:0,to:1,duration:900,delay:180,ease:'Sine.inOut',onUpdate:t=>draw(t.getValue()),onComplete:()=>draw(1)});
  }
  // ดาวของรอบนี้ (เรื่องหลักเท่านั้น) · เรียกก่อนฮีลรางวัลเคลียร์ด่าน
  evalStageStars(){ this._starRes=null; if(this._inTutorial||this.bossRush||this.riftMode||this.recipeMode||!this.player)return null; const p=this.player,hp=p.maxhp>0?Math.max(0,p.hp)/p.maxhp:0,min=Math.min(this._minHpPct??1,hp);
    const mask=1|(hp>=.7?2:0)|(min>=.3?4:0),all=Save.data.stageStars||(Save.data.stageStars={}),prev=all[this.stageIndex]|0,fresh=mask&~prev,n=[0,1,2].filter(b=>fresh&(1<<b)).length;
    const d=DIFFS[Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1))],bonus=n?Math.round(n*(STAGE_STAR_SUGAR+this.stageIndex*10)*(d.reward||1)):0;
    if(mask===7)(typeof DailyQ!=='undefined')&&!this._inTutorial&&DailyQ.tick('star3'); all[this.stageIndex]=prev|mask; if(bonus)this.sugarStage=(this.sugarStage||0)+bonus; Save.save?.();
    return this._starRes={mask,fresh,bonus,hp,min}; }
  // แถวดาว ★★☆ (ทอง = ได้ · เทา = ยัง)
  starText(mask){ return [0,1,2].map(b=>mask&(1<<b)?'★':'☆').join(''); }
  finishSummaryPresentation(){const r=this._summaryReveal;if(!r)return;this._summaryExpFinish?.();this.stopSummaryPresentation();r.sugarText.setText('+'+Math.max(0,Math.floor(this.sugarStage||0)));r.rewards.flat().forEach(o=>{if(o.active!==false)o.setAlpha(1);});r.stars.forEach(o=>{if(o.active!==false)o.setAlpha(1).setScale(1);});}
  summaryText(box,x,y,text,size=14,color='#fff4e1',width=200,origin=0){
    const o=this.add.text(x,y,text,{fontFamily:'NunitoUI, sans-serif',fontSize:size+'px',fontStyle:'bold',color,align:origin===.5?'center':'left',wordWrap:{width},maxLines:2,lineSpacing:2}).setOrigin(origin,.5);box.push(o);return o;
  }
  /* v8.1.100 แผงหัวหน้าจบด่าน: พื้นแผง ขอบทอง เหรียญวงกลมหลังฮีโร่ แสงหมุน เส้นคั่นใต้หัวข้อ ประกาย (ไม่มีภาพ = กราฟิกโค้ดล้วน) */
  summaryHeaderDeco(box,H,hx,hy,size,animate){
    const quit=!!this._quitSummary,gold=quit?0xa995b8:0xf5c879,art=k=>!!this.realTex?.(k),plate=this.tuHas?.('sc79_header_plate')&&this.tuPanel?.('sc79_header_plate',0,H.x,H.y,H.w,H.h);   /* v8.1.108 ใบ 79: มีภาพ = ใช้ภาพ · ไม่มี = กราฟิกโค้ดเดิม */
    if(plate){ if(quit)plate.list?.forEach?.(i=>i.setTint?.(0xb8a8c8)); box.push(plate); }
    const g=this.add.graphics(); if(!plate){ g.fillStyle(0x000000,.28).fillRoundedRect(H.x+2,H.y+4,H.w,H.h,18);g.fillStyle(quit?0x231c2e:0x2b1d36,.96).fillRoundedRect(H.x,H.y,H.w,H.h,18);
    g.fillStyle(0xffffff,.05).fillRoundedRect(H.x+4,H.y+4,H.w-8,H.h*.42,14);g.lineStyle(2,gold,.85).strokeRoundedRect(H.x,H.y,H.w,H.h,18);g.lineStyle(1,gold,.3).strokeRoundedRect(H.x+5,H.y+5,H.w-10,H.h-10,14); } box.push(g);
    const r=size*.5;if(!quit){let rays;if(art('sc79_rays'))rays=this.add.image(hx,hy,'sc79_rays').setDisplaySize(size*1.6,size*1.6).setAlpha(.85);else{rays=this.add.graphics();rays.x=hx;rays.y=hy;rays.fillStyle?.(0xffe4aa,.16);for(let i=0;i<12;i++){const a=i*Math.PI/6,b=a+.16;rays.fillTriangle?.(0,0,Math.cos(a)*r*1.5,Math.sin(a)*r*1.5,Math.cos(b)*r*1.5,Math.sin(b)*r*1.5);}}box.push(rays);
      if(animate||this.hubMotionAllowed?.()!==false){const tw=this.tweens.add({targets:rays,angle:360,duration:16000,repeat:-1});(this._summaryTweens||(this._summaryTweens=[])).push(tw);}}
    if(art('sc79_medallion_back')){ const mb=this.add.image(hx,hy,'sc79_medallion_back').setDisplaySize(size,size); if(quit)mb.setTint?.(0x9a8aa8); box.push(mb); } else { const m=this.add.graphics();m.fillStyle?.(quit?0x3a3046:0x4a2d52,1);m.fillCircle?.(hx,hy,r);m.fillStyle?.(0xffffff,.08);m.fillCircle?.(hx,hy-r*.25,r*.7);m.lineStyle?.(3,gold,1);m.strokeCircle?.(hx,hy,r);m.lineStyle?.(1.5,0xffffff,.35);m.strokeCircle?.(hx,hy,r-5);box.push(m); }
    const tx=H.x+size+24,dv=this.add.graphics();dv.lineStyle?.(2,gold,.55);dv.lineBetween?.(tx,H.y+H.h*.385,H.x+H.w-18,H.y+H.h*.385);dv.fillStyle?.(gold,1);dv.fillCircle?.(tx,H.y+H.h*.385,3);box.push(dv);
    if(!quit)for(const [px,py,sz] of [[H.x+H.w-22,H.y+16,13],[hx+r*.82,hy-r*.82,11],[H.x+H.w-40,H.y+H.h-16,9]]){const sp=this.summaryText(box,px,py,'✦',sz,'#ffe9b0',20,.5);if(animate||this.hubMotionAllowed?.()!==false){const tw=this.tweens.add({targets:sp,alpha:{from:.25,to:1},scale:{from:.7,to:1.2},yoyo:true,repeat:-1,duration:700+sz*40});(this._summaryTweens||(this._summaryTweens=[])).push(tw);}}
  }
  summaryCard(box,r,fill=0x211a30,stroke=0x75617a){const g=this.add.graphics().fillStyle(fill,.95).fillRoundedRect(r.x,r.y,r.w,r.h,16).lineStyle(1,stroke,.65).strokeRoundedRect(r.x,r.y,r.w,r.h,16);box.push(g);return g;}
  summaryRewardPanel(box,r){
    const key='sc44_frame';if(!this.textures.exists(key))return this.summaryCard(box,r);
    const tex=this.textures.get(key),im=tex.getSourceImage(),W=im.width,H=im.height;
    // Five horizontal sections keep the central painted leaf and both corners undistorted.
    const xs=[0,Math.round(W*.14),Math.round(W*.41),Math.round(W*.59),Math.round(W*.86),W],ys=[0,Math.round(H*.25),Math.round(H*.78),H];
    const k=Math.min(.38,(r.h+12)/(H*.47+24),(r.w+12)/(W*.46+24)),fixed=(xs[1]+xs[3]-xs[2]+W-xs[4])*k,stretch=(r.w+12-fixed)/2;
    const dx=[r.x-6,r.x-6+xs[1]*k,r.x-6+xs[1]*k+stretch,r.x-6+xs[1]*k+stretch+(xs[3]-xs[2])*k,r.x+r.w+6-(W-xs[4])*k,r.x+r.w+6],dy=[r.y-6,r.y-6+ys[1]*k,r.y+r.h+6-(H-ys[2])*k,r.y+r.h+6];
    box.push(this.add.graphics().fillStyle(0x231a2c,1).fillRoundedRect(r.x,r.y,r.w,r.h,12));const c=this.add.container();for(let j=0;j<3;j++)for(let i=0;i<5;i++){if(j===1&&i>0&&i<4)continue;const f='result_'+i+'_'+j;if(!tex.has(f))tex.add(f,0,xs[i],ys[j],xs[i+1]-xs[i],ys[j+1]-ys[j]);c.add(this.add.image(dx[i],dy[j],key,f).setOrigin(0).setDisplaySize(dx[i+1]-dx[i]+.25,dy[j+1]-dy[j]+.25));}box.push(c);return c;
  }
  // v8.0.70 เจ้าของ: ปุ่มดูโฆษณาไม่เด่น → ปุ่มเขียวสด ใหญ่ เด้ง + ส่ายเป็นจังหวะ (ปิดเมื่อลดการเคลื่อนไหว)
  summaryAdButton(box,r,label,fn){
    const cx=r.x+r.w/2,cy=r.y+r.h/2,w=r.w,h=r.h,c=this.add.container(cx,cy),g=this.add.graphics();
    g.fillStyle(0x0b4f27,1).fillRoundedRect(-w/2,-h/2+4,w,h,16);g.fillStyle(0x27c265,1).fillRoundedRect(-w/2,-h/2,w,h,16);g.fillStyle(0xffffff,.24).fillRoundedRect(-w/2+6,-h/2+4,w-12,h*.4,12);g.lineStyle(2.5,0xeaffd9,1).strokeRoundedRect(-w/2,-h/2,w,h,16);
    const t=this.add.text(0,0,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',stroke:'#0b4f27',strokeThickness:4}).setOrigin(.5);if(t.width>w-18)t.setScale((w-18)/t.width);
    const shine=this.add.graphics();shine.fillStyle(0xffffff,.32).fillRoundedRect(-10,-h/2,20,h,4);shine.x=-w/2-30;c.add([g,shine,t]);box.push(c);
    if(this.hubMotionAllowed?.()!==false&&this.tweens){const tw=[this.tweens.add({targets:c,scale:{from:1,to:1.07},duration:620,yoyo:true,repeat:-1,ease:'Sine.inOut'}),
      this.tweens.add({targets:c,angle:{from:-3.5,to:3.5},duration:70,yoyo:true,repeat:5,repeatDelay:0,loop:-1,loopDelay:1900}),
      this.tweens.add({targets:shine,x:w/2+30,duration:700,repeat:-1,repeatDelay:1600,ease:'Sine.inOut',onRepeat:()=>{shine.x=-w/2-30;}})];
      c.once?.('destroy',()=>tw.forEach(x=>x.remove?.()));shine.visible=true;}else shine.visible=false;
    const generation=this._summaryView;const z={...r,tag:'ad',fn:()=>{if(this.state==='summary'&&generation===this._summaryView&&this._summaryBtns.includes(z))fn();}};this._summaryBtns.push(z);return[c,t];
  }
  summaryButton(box,r,label,fn,primary=false,tag=''){
    const g=this.summaryCard(box,r,primary?0xf5c879:0x241c32,primary?0xffecbf:0x84718a),t=this.summaryText(box,r.x+r.w/2,r.y+r.h/2,label,primary?16:12,primary?'#33202c':'#dfcfe4',r.w-20,.5);
    const generation=this._summaryView;const z={...r,tag,fn:()=>{if(this.state==='summary'&&generation===this._summaryView&&this._summaryBtns.includes(z))fn();}};this._summaryBtns.push(z);return[g,t];
  }
  showStageSummary(last){
    this.stopSummaryPresentation();this.loadBook?.();
    if(this.state!=='dead'&&!this._quitSummary&&typeof Stats!=='undefined')Stats.end(this,'win');
    this.state='summary';this.physics.pause();this.player.setVelocity(0,0);this._summaryLast=last;
    if(!this._summaryPresentationShown){this._summaryOwner={player:this.player,stage:this.stageIndex};}
    this._summaryView=(this._summaryView||0)+1;this._summaryBtns=[];this._summaryMainBtns=null;
    if(!this._quitSummary&&!this._inTutorial&&!this.recipeMode&&!this.riftMode){const seen=Save.data.stageEpiloguesSeen||(Save.data.stageEpiloguesSeen={});if(!seen[this.stageIndex]){seen[this.stageIndex]=1;Save.save();}}
    if(!this._summaryPresentationShown&&!this._quitSummary&&typeof Sfx!=='undefined')Sfx.orderCue?.(((this.stageIndex||0)+1)%5===0?'chapter_clear':'stage_victory',.5,2);
    this.over.removeAll(true);const box=[],w=this.W,h=this.H,L=this._summaryLayout=stageSummaryLayout(w,h),motion=this.hubMotionAllowed?this.hubMotionAllowed():true,animate=motion&&!this._summaryPresentationShown;
    const bg=this.resultBackdrop(this._quitSummary?'result_defeat':'result_victory');box.push(bg,this.add.rectangle(0,0,w,h,0x100d1b,this._quitSummary?.64:.12).setOrigin(0));
    const st=STAGES[this.stageIndex],H=L.header,heroKey=this.textures.exists('char_'+this.character+'_victory')?'char_'+this.character+'_victory':'char_'+this.character;   /* v8.2.12 ใบ 83: ทุกฮีโร่ที่มีชีตท่าชนะ */
    const artSize=Math.min(H.h-16,H.w*.32,132),hx=H.x+10+artSize*.5,hy=H.y+H.h*.5;
    this.summaryHeaderDeco(box,H,hx,hy,artSize,animate);   /* v8.1.100 เจ้าของ: หัวหน้าจบด่านดูไม่เสร็จ → แผงหัว + เหรียญฮีโร่ + แสงหมุน */
    if(this.textures.exists(heroKey)){const im=this.add.image(hx,hy+artSize*.06,heroKey,/_victory$/.test(heroKey)?7:CF.cheer).setDisplaySize(artSize*1.08,artSize*1.08);box.push(im);const mk=this.make?.graphics?.({add:false});if(mk&&im.setMask){mk.fillCircle(hx,hy,artSize*.5-3);im.setMask(mk.createGeometryMask());}if(this.realTex?.('sc79_medallion'))box.push(this.add.image(hx,hy,'sc79_medallion').setDisplaySize(artSize*1.12,artSize*1.12));if(animate){const y0=im.y,tw=this.tweens.add({targets:im,y:y0-18,duration:240,yoyo:true,repeat:2,ease:'Quad.out',repeatDelay:120});   /* v8.2.9 ท่าชนะ: กระโดดดีใจ 3 ครั้ง (ฮีโร่ที่ไม่มีชีตท่าชนะ) */(this._summaryTweens||(this._summaryTweens=[])).push(tw);}}
    const tx=H.x+artSize+24,tw=H.x+H.w-tx-12;
    this.summaryText(box,tx,H.y+H.h*.24,this._quitSummary?'RUN ENDED':'STAGE CLEAR',Math.min(28,Math.max(19,tw*.13)),this._quitSummary?'#dac7e2':'#ffe4aa',tw);
    const title=this.summaryText(box,tx,H.y+H.h*.53,st.name,15,'#fff4e1',tw);while(title.height>H.h*.36&&parseInt(title.style.fontSize)>11)title.setFontSize(parseInt(title.style.fontSize)-1);
    this.summaryText(box,tx,H.y+H.h*.83,this._firstMastery&&!this._quitSummary?'FIRST CLEAR':(CHARACTERS[this.character]?.name||this.character),11,'#bcaacb',tw);
    const sr=this._quitSummary?null:this._starRes,S=L.stars;this._summaryStarObjs=[];
    if(sr||S)this.summaryCard(box,S,0x1f1730,0x8a6a4f);
    if(sr){const cell=S.w/3;for(let b=0;b<3;b++){const got=!!(sr.mask&(1<<b)),x=S.x+cell*(b+.5);{const si79=this.tuHas?.('sc79_star_socket')&&this.tuImg?.('sc79_star_socket',got?1:0,x-12,S.y+22,38,38);if(si79)box.push(si79);else{const so=this.add.graphics();so.fillStyle?.(got?0x5a3a1c:0x2a2236,1);so.fillCircle?.(x-12,S.y+22,17);so.lineStyle?.(2,got?0xffd27a:0x5d5070,got?.95:.6);so.strokeCircle?.(x-12,S.y+22,17);box.push(so);}}const star=this.add.star?this.add.star(x-12,S.y+22,5,7.5,16,got?0xffda89:0x3a3048).setStrokeStyle(2,got?0xfff1c4:0x796c8b,got?.9:.8):this.summaryText(box,x-12,S.y+22,got?'★':'☆',28,got?'#ffda89':'#796c8b',40,.5);if(this.add.star)box.push(star);this._summaryStarObjs.push(star);   /* v8.1.144 owner 🐞: ★ glyph sat off the socket → shape centred on it */if(animate&&got)star.setAlpha(0);
      this.summaryText(box,x+16,S.y+23,sr.fresh&(1<<b)?'NEW':'',9,'#bff0d3',30,.5);this._summaryBtns.push({x:S.x+b*cell,y:S.y,w:cell,h:S.h,tag:'star_'+b,fn:()=>this.openSummaryDetails('stars',b)});}
    }else this.summaryText(box,S.x+S.w/2,S.y+22,this._quitSummary?'Collected rewards are saved':'Adventure complete',13,'#c5b4d1',S.w-16,.5);
    const R=L.loot;this.summaryRewardPanel(box,R);this.summaryText(box,R.x+32,R.y+22,'REWARDS',10,'#c9b4d4',R.w-32);this.summaryText(box,R.x+R.w-32,R.y+22,'View all ›',10,'#e8d1a3',90,1);
    const topH=R.h-46,sugarText=this.summaryText(box,R.x+16,R.y+topH*.56,'+'+Math.max(0,this.sugarStage||0),Math.min(32,R.w*.09),'#ffdf9a',R.w*.4-20);
    this.summaryText(box,R.x+17,R.y+topH*.85,'Sugar earned',11,'#c1adcd',R.w*.4-20);
    const loot=stageSummaryLoot(this._openedBoxes),best=loot.find(v=>v.id),bx=R.x+R.w*.44,by=R.y+Math.max(50,topH*.58);
    const rewardGroups=[];
    if(best){const col=(FIELD_DROP_TABLE[best.tier]||FIELD_DROP_TABLE.common).color,hex='#'+col.toString(16).padStart(6,'0');
      const icon=this.textures.exists('gear_'+best.id)?this.add.image(bx+18,by,'gear_'+best.id).setDisplaySize(36,36):this.add.text(bx+18,by,best.emoji||'🎁',{fontSize:'26px'}).setOrigin(.5);box.push(icon);
      const name=this.summaryText(box,bx+43,by,best.name||'Equipment',12,hex,R.x+R.w-bx-55);const sub=R.h>=160?this.summaryText(box,bx+43,by+30,(best.tier||'common').toUpperCase()+(best.ilv?' · iLv '+best.ilv:''),10,'#c8b4d0',R.x+R.w-bx-55):null;rewardGroups.push([icon,name,...(sub?[sub]:[])]);
    }else this.summaryText(box,bx,by,loot.length?'Box rewards saved':'Rewards collected',12,'#dccce4',R.w*.5-12);
    const cur=this._runCurrency||{},keys=Object.keys(cur).filter(k=>cur[k]>0),max=R.w<350?4:6,shown=keys.slice(0,max),rowY=R.y+R.h-22,cell=(R.w-24)/Math.max(1,shown.length+(keys.length>max?1:0));
    shown.forEach((k,i)=>{const x=R.x+12+cell*(i+.5),d=currencyDef(k),icon=this.textures.exists(d?.asset)?this.add.image(x-10,rowY,d.asset).setDisplaySize(22,22):this.add.text(x-10,rowY,d?.emoji||'💠',{fontSize:'18px'}).setOrigin(.5),qty=this.summaryText(box,x+5,rowY,'×'+cur[k],11,'#fff4e1',cell-14);box.push(icon);rewardGroups.push([icon,qty]);});
    if(keys.length>max)this.summaryText(box,R.x+R.w-30,rowY,'+'+(keys.length-max),12,'#d6bfdc',40,.5);if(!keys.length)this.summaryText(box,R.x+16,rowY,loot.length+' box'+(loot.length===1?'':'es')+' opened · in your bag',11,'#ad9cba',R.w-32);
    this._summaryBtns.push({...R,tag:'rewards',fn:()=>{this.finishSummaryPresentation();this.openSummaryDetails('loot');}});
    const G=L.growth,cp=Save.cp(this.character),gain=Math.max(0,(this._powerAfter??Save.power(this.character))-(this._powerBefore??Save.power(this.character)));this.summaryCard(box,G,0x182b2b,0x466e65);
    this.summaryText(box,G.x+16,G.y+18,'CHARACTER GROWTH',10,'#a2d2ba',G.w*.6);
    this.summaryText(box,G.x+G.w-16,G.y+18,this._lastLvlUps>0?'LEVEL UP! +'+this._lastLvlUps:'Lv '+cp.lvl,12,'#e6ffd5',G.w*.4,1);
    this.summaryText(box,G.x+16,G.y+40,gain>0?'Power +'+gain:'Power '+(this._powerAfter??Save.power(this.character)),14,'#efffe9',G.w-32);
    this.buildSummaryExpBar(box,L.x,L.y,L.w,L.h,12,animate);
    const T=L.stats;this.summaryCard(box,T,0x1c1627,0x49384e);const mm=Math.floor((this.elapsed||0)/60),ss=Math.floor((this.elapsed||0)%60),detailW=Math.min(96,T.w*.32);
    this.summaryText(box,T.x+4,T.y+22,mm+':'+ss.toString().padStart(2,'0')+'  ·  '+(this.stageKills||0)+' KOs',12,'#c8b5d2',T.w-detailW-12);
    this.summaryButton(box,{x:T.x+T.w-detailW,y:T.y,w:detailW,h:T.h},'Details',()=>this.openSummaryDetails('run'),false,'details');
    const F=L.footer,hasAd=this.sugarStage>0&&!this._summaryDoubled,primary=L.land?{x:F.x,y:F.y,w:hasAd?F.w*.58:F.w,h:48}:{x:F.x,y:F.y,w:F.w,h:48};
    this.summaryButton(box,primary,last&&!this._quitSummary?'View Adventure Summary':this.recipeMode?'Back to Delve':'Back to Lobby',()=>this.continueFromSummary(),true,'continue');
    this._summaryBonus=this.sugarStage;
    if(hasAd){const ad=L.land?{x:F.x+F.w*.58+12,y:F.y,w:F.w*.42-12,h:48}:{x:F.x,y:F.y+60,w:F.w,h:44};const owner=this._summaryOwner;
      this.summaryAdButton(box,ad,'📺 Watch Ad · ×2 Sugar (+'+this._summaryBonus+')',()=>{if(this._adBusy)return;this.finishSummaryPresentation();this.showRewardedAd('Get double Sugar (+'+this._summaryBonus+')',()=>{if(this.state!=='summary'||this._summaryOwner!==owner)return;this.adDoubleSugar();});});
    }else if(!L.land)this.summaryText(box,F.x+F.w/2,F.y+79,'Rewards saved · ready when you are',11,'#af9ebc',F.w-24,.5);
    this.over.add(box);this.over.setVisible(true);
    if(!this._summaryPresentationShown){this._summaryPresentationShown=true;this.animateSummaryRewards(sugarText,rewardGroups);}
  }
  openSummaryDetails(tab='run',page=0){
    if(this.state!=='summary')return;this.finishSummaryPresentation();this._summaryDetailsLayer?.destroy();
    if(!this._summaryMainBtns)this._summaryMainBtns=this._summaryBtns;this._summaryBtns=[];
    const layer=this._summaryDetailsLayer=this.add.container(),box=[],w=this.W,h=this.H,p=16,pw=Math.min(w-24,620),ph=Math.min(h-24,680),x=(w-pw)/2,y=(h-ph)/2;
    box.push(this.add.rectangle(0,0,w,h,0x0b0812,.94).setOrigin(0));this.summaryCard(box,{x,y,w:pw,h:ph},0x211a30,0xa28a9b);
    this.summaryText(box,x+20,y+25,'STAGE DETAILS',17,'#ffe3ad',pw-40);
    const tabs=['run','loot','stars'],cw=(pw-40)/3;tabs.forEach((id,i)=>this.summaryButton(box,{x:x+20+i*cw,y:y+50,w:cw-6,h:44},id===tab?'• '+id.toUpperCase():id.toUpperCase(),()=>this.openSummaryDetails(id),false,'tab_'+id));
    let rows=[];const cp=Save.cp(this.character),sr=this._quitSummary?null:this._starRes;
    if(tab==='stars')rows=STAGE_STARS.map((v,i)=>({label:(sr?.mask&(1<<i)?'★ ':'☆ ')+v.name,value:sr?(sr.mask&(1<<i)?'Earned':'Not earned'):'Not evaluated'}));
    else if(tab==='loot'){rows=stageSummaryLoot(this._openedBoxes).map(v=>({label:v.name||'Box reward',value:(v.tier||'common').toUpperCase()+(v.ilv?' · iLv '+v.ilv:''),key:v.id?'gear_'+v.id:null}));if(this._clearShovels>0)rows.push({label:'Temple shovels',value:'×'+this._clearShovels});for(const [k,n]of Object.entries(this._runCurrency||{}))if(n>0){const d=currencyDef(k);rows.push({label:d?.name||k,value:'×'+n,key:d?.asset});}}
    else{rows=[{label:'Time',value:Math.floor((this.elapsed||0)/60)+':'+Math.floor((this.elapsed||0)%60).toString().padStart(2,'0')},{label:'Enemies defeated',value:String(this.stageKills||0)},{label:'Sugar earned',value:'+'+(this.sugarStage||0)},{label:'Boxes opened',value:String((this._openedBoxes||[]).length)},{label:'Character level',value:'Lv '+cp.lvl},{label:'Power',value:(this._powerBefore??Save.power(this.character))+' → '+(this._powerAfter??Save.power(this.character))}];
      if(sr?.bonus)rows.push({label:'Included: star Sugar',value:'+'+sr.bonus});if(this._dailyBonus)rows.push({label:'Included: daily Sugar',value:'+'+this._dailyBonus});if((this._newSpecies||[]).length)rows.push({label:'New monsters discovered',value:String(this._newSpecies.length),action:true});}
    const per=Math.max(1,Math.floor((ph-216)/54)),pages=Math.max(1,Math.ceil(rows.length/per)),pg=Math.max(0,Math.min(pages-1,page)),slice=rows.slice(pg*per,pg*per+per);
    if(!rows.length)this.summaryText(box,x+pw/2,y+135,'No additional rewards',14,'#bda9cb',pw-48,.5);
    slice.forEach((r,i)=>{const yy=y+110+i*54,icon=r.key&&this.textures.exists(r.key),xx=x+20+(icon?36:0);if(icon)box.push(this.add.image(x+34,yy+22,r.key).setDisplaySize(28,28));
      this.summaryText(box,xx,yy+12,r.label,12,'#eee0ec',pw-(xx-x)-24);this.summaryText(box,xx,yy+32,r.value,11,'#c9b3d1',pw-(xx-x)-24);
      if(r.action&&!this._summaryLast&&!this.recipeMode)this.summaryButton(box,{x:x+20,y:yy,w:pw-40,h:44},r.value+' new monsters · Bestiary ›',()=>this.continueFromSummary(this._newSpecies[0]),false,'bestiary');
    });
    if(pages>1){this.summaryButton(box,{x:x+20,y:y+ph-100,w:64,h:44},'‹',()=>this.openSummaryDetails(tab,pg-1),false,'prev');this.summaryText(box,x+pw/2,y+ph-80,(pg+1)+' / '+pages,12,'#d4c1dc',100,.5);this.summaryButton(box,{x:x+pw-84,y:y+ph-100,w:64,h:44},'›',()=>this.openSummaryDetails(tab,pg+1),false,'next');}
    this.summaryButton(box,{x:x+20,y:y+ph-52,w:pw-40,h:44},'Back to rewards',()=>{layer.destroy();this._summaryDetailsLayer=null;this._summaryBtns=this._summaryMainBtns||[];this._summaryMainBtns=null;},true,'close_details');
    layer.add(box);this.over.add(layer);
  }
  endLock(ms=1000){ this._endLockAt=Date.now()+ms; this._endOpenAt=Date.now(); this._endScreenState=this.state; }
  _endBtn(box,cx,cy,bw,bh,color,label,opt={}){   // v6.44: ปุ่มหน้าจบด่านแบบเด่น (เงา+กลอส+ขอบ+เต้น)
    const g=this.add.graphics(),r=Math.min(18,bh/2);
    g.fillStyle(0x000000,0.35);g.fillRoundedRect(cx-bw/2,cy-bh/2+4,bw,bh,r);
    g.fillStyle(color,1);g.fillRoundedRect(cx-bw/2,cy-bh/2,bw,bh,r);
    g.fillStyle(0xffffff,0.22);g.fillRoundedRect(cx-bw/2+4,cy-bh/2+3,bw-8,bh*0.42,r*0.8);
    g.lineStyle(opt.primary?3:2,opt.primary?0xfff3c4:0xffffff,opt.primary?0.95:0.45);g.strokeRoundedRect(cx-bw/2,cy-bh/2,bw,bh,r);
    const t=this.add.text(cx,cy,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(opt.font||Math.min(17,bh*0.38))+'px',color:opt.dark?'#3a2208':'#ffffff',stroke:opt.dark?'#ffe9a8':'#2a1636',strokeThickness:opt.dark?0:3,align:'center',wordWrap:{width:bw*0.92}}).setOrigin(0.5);
    box.push(g,t);
    [g,t].forEach(o=>{o.setAlpha(0);this.tweens.add({targets:o,alpha:1,duration:260,delay:opt.delay||650});});
    if(opt.pulse){ const c=this.add.container(cx,cy);g.setPosition(-cx,-cy);t.setPosition(0,0);c.add([g,t]);box.splice(box.length-2,2,c);this.tweens.add({targets:c,scale:1.06,duration:560,yoyo:true,repeat:-1,ease:'Sine.inOut',delay:900}); }
    return {x:cx-bw/2,y:cy-bh/2,w:bw,h:bh};
  }
  adDoubleSugar(){ if(this._summaryDoubled)return; this._summaryDoubled=true; const bonus=this._summaryBonus||0; if(bonus>0)Save.addSugar(bonus);
    this.stopSummaryPresentation();
    if(this.showBanner)this.showBanner('🍬 Sugar x2!','Get an extra +'+bonus+' from an ad',1700);
    if(this.state==='summary')this.showStageSummary(this._summaryLast);if(bonus>0)Sfx.result('double'); }
  continueFromSummary(focus){
    if(this.state!=='summary')return;
    this.stopSummaryPresentation();
    this.over.setVisible(false); this.physics.resume(); this.state='play';
    if(this._summaryLast&&!this._quitSummary){ this._quitSummary=false; this.victory(); return; }
    this._quitSummary=false;this._stageReward=null;this.sugarStage=0;const wasAtlas=!!this.recipeMode;this.exitStage();if(wasAtlas){this._atlasTab='board';this.menuScreen='atlas';}else if(typeof focus==='string'){this._bestFocus=focus;this._bestSel=focus;this.menuScreen='bestiary';}else this.menuScreen='hub';this.buildMenuScreen();   // v4.29 (v6.28: Atlas run กลับหน้า Atlas): จบด่านกลับหน้าเมนูหลักเสมอ
  }
  // v4.27: จบ tutorial → พาเข้าหน้า Flavor Weave ตรง ๆ + สอนให้ใช้ Sugar อัพแก่น (Weave เปิดตั้งแต่เริ่ม แม้ Gear&Power ตัวอื่นยังล็อก)
  openTutorialWeave(){
    if(this.state!=='summary')return;
    this.stopSummaryPresentation();
    this.over.setVisible(false); this.physics.resume(); this.state='play';
    this._quitSummary=false;this._stageReward=null;this.sugarStage=0;this._tutorialWeaveCoach=true;
    try{ if(!this.realTex?.('core79_heart_seed')&&ASSET_IMAGES.core79_heart_seed)this.ensureGroup?.(k=>k==='core79_heart_seed',()=>{},{all:true,quiet:true}); }catch(e){}   // v8.1.108 ใบ 79 โหลดภาพเรื่องก่อน Ruby เล่า
    this._weaveTour='hub'; this.exitStage(); this.menuScreen='hub'; this.buildMenuScreen();   // v7.9.45 เจ้าของ: เดิมวาปเข้าหน้า Weave ตรง ๆ แล้ววาปไปหน้าเลือกด่าน → พาเดินจาก Hub ทีละปุ่มแทน
    this.menuToast&&this.menuToast('🍓 Let’s power up! Follow the glowing buttons','#ffe08a');
  }
  showBanner(title,sub,ms){
    if(!this.bannerT||!this.bannerS)return;   // กันเรียกตอนยังNone HUD (เช่นจากหน้าเมนู) → ไม่ให้ crash
    { const rb=this._ruby?this._ruby.bottom+34:0; this.bannerT.y=Math.max(this.H*0.30,rb); this.bannerS.y=this.bannerT.y+this.H*0.06; }   // v7.9.60 ไม่ทับกรอบ Ruby
    /* v8.2.40 เจ้าของ: คำอธิบายยาวกลางจอบังสนามตอนเล่น → ระหว่างเล่น ชื่อกลางจอ ~1 วิ · คำอธิบายบรรทัดเดียวใต้แถบภารกิจ ~3 วิ */
    const inPlay=this.state!=='menu'&&this.state!=='title', line=inPlay?(typeof bannerLine==='function'?bannerLine(sub):(sub||'')):(sub||'');
    this.tweens.killTweensOf?.([this.bannerT,this.bannerS]); this._bannerTok=(this._bannerTok||0)+1; const tok=this._bannerTok;
    if(inPlay){ this.bannerS.y=(this.waveObjBg?.y||this.H*0.17)+48; this.bannerS.setWordWrapWidth?.(this.W*0.94); }
    else this.bannerS.setWordWrapWidth?.(this.W*0.72);
    this.bannerT.setText(title).setVisible(true).setAlpha(0).setScale(0.7);
    this.bannerS.setText(line).setVisible(!!line).setAlpha(0);
    this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:1,duration:250});
    this.tweens.add({targets:this.bannerT,scale:1,duration:420,ease:'Back.out'});
    const hide=(objs)=>this.tweens.add({targets:objs,alpha:0,duration:400,onComplete:()=>{ if(tok!==this._bannerTok)return; objs.forEach(q=>q.setVisible(false)); }});
    if(inPlay){ this.time.delayedCall(Math.min(ms||1100,1100),()=>{ if(tok===this._bannerTok)hide([this.bannerT]); }); this.time.delayedCall(Math.max(3000,Math.min(ms||3000,4000)),()=>{ if(tok===this._bannerTok)hide([this.bannerS]); }); }
    else this.time.delayedCall(ms,()=>{ if(tok===this._bannerTok)hide([this.bannerT,this.bannerS]); });
  }
  victory(){
    Stats.end(this,'win');this.rubyVoiceReact?.('clear',1200);
    this.state='win'; this.physics.pause(); this.player.setVelocity(0,0);
    this.gainCharExp(this.kills+200);
    Sfx.victory();
    const w=this.W,h=this.H; this.over.removeAll(true);
    const bg=this.resultBackdrop('result_victory');
    const em=this.add.text(w/2,h*0.24,'🏆',{fontSize:'70px'}).setOrigin(0.5);
    const ch2=this.stageIndex===5,t=this.add.text(w/2,h*0.37,ch2?'First Canopy Conquered!':'Victory! The curse is broken',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:'#ffd166',align:'center',wordWrap:{width:w*0.85}}).setOrigin(0.5);
    const lore=this.add.text(w/2,h*0.47,ch2?'The Rootmother pulls up her roots and flees to the deeper garden, warning that four crown seeds remain — the Chapter 2 path has only just begun 🌿':'The Great Hunger collapses; flavor and memory return to the great kitchen 🍡',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6',align:'center',wordWrap:{width:w*0.82}}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const stat=this.add.text(w/2,h*0.56,`Time ${mm}:${ss.toString().padStart(2,'0')}  ·  Kills ${this.kills}  ·  Lv ${this.level}`,{fontFamily:'sans-serif',fontSize:'15px',color:'#9a90ab'}).setOrigin(0.5);
    const btn=this.add.rectangle(w/2,h*0.68,210,58,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.3);
    const bt=this.add.text(w/2,h*0.68,'↻ Play Again',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.restart());
    this.over.add([bg,em,t,lore,stat,btn,bt]); this.over.setVisible(true);
  }

  /* ---------- STARTING ATTACK ---------- */
  // ตัวเลขหลักจากคำอธิบาย (+8% damage, +2 simultaneous strikes) → โชว์ใหญ่แทนบรรทัด role ให้อ่านปราดเดียว
  // v5.11: ทุกการ์ดมีบรรทัดเน้นอ่านเร็ว · สีบอกชนิด: เขียว=ตัวเลขบัฟ · แดง=ข้อเสีย · ม่วง=Mutation · ทอง=Evolution · ฟ้า=Build Path · ส้ม=Infusion · ชมพู=Relic/ฟื้น · เหลือง=อื่น ๆ
  _cardHeadline(o){
    if(!o)return null;const desc=String(o.desc||'').replace(/\s*\[[^\]]*\]\s*$/,'').replace(/\s+·\s+\S+\s(Precision|Swarm|Guard|Tempo)\b.*$/,'').replace(/\s+🔗.*$/,''),kind=String(o.kind||'');
    const clause=(last)=>{const parts=desc.split(/\s[·—]\s|\.(?=\s|$)|[;(]|\n/).map(x=>x.trim()).filter(Boolean);let c=(last?(parts[1]||parts[0]):parts[0])||'';if(c.length>30)c=c.slice(0,28).replace(/\s+\S*$/,'');return c;};
    const num=desc.match(/[+\-−×]\s?\d+(?:\.\d+)?%?(?:\s+[A-Za-z][A-Za-z/&]*){0,2}/);
    const G={t:'',c:'#8ff0b0',s:'#0c2a1a'};
    if(o.headline)return {t:o.headline,c:o.evolution?'#ffd76a':o.mutation?'#d9a8ff':kind==='Build Path'?'#8fe3ff':kind==='Flavor Infusion'?'#ffc27a':kind==='Relic'?'#ffb3e0':'#8ff0b0',s:'#172333'};
    if(o.evolution)return {t:'✨ '+clause(),c:'#ffd76a',s:'#3a2a00'};
    if(o.mutation)return {t:'🧬 '+clause(),c:'#d9a8ff',s:'#2a1440'};
    if(kind==='Build Path')return {t:o.pathStyle||('🛤 '+clause()),c:'#8fe3ff',s:'#0b2633'};
    if(kind==='Flavor Infusion')return {t:clause(true),c:'#ffc27a',s:'#3a1f00'};
    if(/relic/i.test(kind)||this._relicPick)return {t:'🔮 '+clause(),c:'#ffb3e0',s:'#3a0f2a'};
    if(o.type==='heal')return {t:num?num[0]:clause(),c:'#ff9dbb',s:'#3a0f1a'};
    if(num){const t=num[0].replace(/\s+(per|and|to|of|for|on|in)$/,''),bad=/damage taken/i.test(desc.slice(num.index,num.index+30))&&/^[+]/.test(t);return {t,c:bad?'#ff9a9a':G.c,s:bad?'#3a0c0c':G.s};}
    const c=clause();return c?{t:c,c:'#ffe9a8',s:'#2e2410'}:null;
  }
  // v7.9.25 การ์ดอัปเกรดซ้ำ: '+8% attack speed' Lv3 → '+16% → +24% attack speed' (ค่ารวมจากการ์ดนี้ก่อน/หลังเลือก, นับแบบบวกต่อ rank)
  _cardProgress(o,hl){const cur=(o.lvl||1)-1;if(cur<1||(o.max||1)<2||o.type!=='basic'||o.mutation||o.evolution||/Build Path|Infusion|Relic|Modifier|Fusion|Trade-off|Mutation/.test(o.kind||''))return null;
    const m=String(hl.t||'').match(/^([+\-−])(\d+(?:\.\d+)?)(%|s)?(\s.*)?$/);if(!m||/\d/.test(m[4]||''))return null;const v=+m[2],f=n=>m[1]+(o.key==='uq_cd'&&m[3]==='%'?Math.round((1-Math.pow(1-v/100,n))*100):+(n*v).toFixed(2))+(m[3]||'');   /* uq_cd ×.9^rank */
    return {...hl,t:f(cur)+' → '+f(cur+1)+(m[4]||''),prog:true};}
  // v7.8.68 ใบ 26: การ์ดที่เดิมยืมไอคอนอาวุธ → ไอคอนของตัวเอง (ไม่มีภาพ = ใช้ของเดิม)
  cardArtKey(o){ if(!o||o.type!=='basic'||!this.textures)return null; const k=String(o.key||''),h=(this.basicAttack&&this.basicAttack.character)||'',kind=o.kind||'';
    const yz=h==='yuzu'&&yuzuCardArt(this.basicAttack?.path,k);if(yz&&this.textures.exists(yz))return yz;
    const c=o.uniqueCard?(kind==='⭐ Unique Mutation'?'ic_uqm_'+k:'ic_uq_'+k.replace(/^uq_/,'')):kind==='Modifier'?'ic_mod_'+k.replace(/^m_/,''):kind==='Fusion'?'ic_fus_'+k.replace(/^f_/,''):kind==='Trade-off'?'ic_trade_'+k.replace(/^t_/,''):kind==='Flavor Infusion'?'ic_inf_'+k:o.mutation?'ic_mut_'+h+'_'+k:o.evolution?'ic_evo_'+h:h==='cocoa'&&(k==='dashp'||k==='drum')?'ic_cocoa_'+k:null;
    return c&&this.textures.exists(c)?c:null; }
  drawReadableChoiceCard(group,o,x,y,w,h,options={}){
    const type=o.type||'atk';let color=type==='basic'?(o.color||0xff8fb5):type==='heal'?0xff6f9d:type==='util'?0xffd166:type==='uni'?(o.color||0xff76a8):type==='pas'?(PASSIVES[o.key]?.color||0x66d3b3):type==='awk'?0xffc447:(SKILL_CARD_COLOR[o.key]||0xff8fb5);
    const rar=o.rarity; if(rar)color=rar.color;   // สีเฟรม = ความหายาก (สัญญาณอ่านเร็ว)
    const wide=w>=h*1.35, isPath=o.kind==='Build Path', title=o.title||o.name||'', lvl=o.lvl||1, jump=rar&&rar.ranks>1?('→Lv'+(lvl+rar.ranks-1)):'';
    const role=o.role||(type==='basic'?'Basic Attack · Character growth':type==='heal'?'Instant heal · No passive slot':type==='util'?'Utility · Instant use':type==='atk'&&SKILLDEFS[o.key]?SKILLDEFS[o.key].role:type==='uni'?'Unique skill · Grows during the run':type==='pas'?'Passive · Boosts stats':'Ultimate · Awaken');
    const badge0=isPath?'':options.starting?'Starting skill · LV1':type==='basic'?(o.companionForm?'COMPANION · EVOLUTION':o.evolution?'BASIC · EVOLUTION':o.mutation?'BASIC · MUTATION':'BASIC · UPGRADE'):type==='heal'?'RECOVERY':type==='util'?'UTILITY':type==='uni'?'UNIQUE · EVOLVE':type==='awk'?'AWAKEN':type==='pas'?'PASSIVE':o.isNew?'ATTACK · NEW':'ATTACK · UPGRADE';
    const badge=rar?('◆ '+rar.name.toUpperCase()+(rar.ranks>1?' +'+rar.ranks:'')):badge0;   // rarity เด่นสุด อ่านปราดเดียว
    // v4.25: rarity ให้เห็นชัด — epic/legend กรอบหนา + เรืองแสงรอบการ์ด + พื้นอมสี + ป้ายเรืองแสง
    const rarIdx=rar?['common','rare','epic','legend'].indexOf(rar.id):-1;
    const glow=this.add.graphics();
    if(rarIdx>=1){const gw=rarIdx>=3?7:rarIdx>=2?5:3,ga=rarIdx>=3?0.55:rarIdx>=2?0.36:0.18;glow.lineStyle(gw,color,ga);glow.strokeRoundedRect(x-3,y-3,w+6,h+6,19);if(rarIdx>=2){glow.lineStyle(gw+6,color,ga*0.4);glow.strokeRoundedRect(x-5,y-5,w+10,h+10,21);}}
    const cat=(/relic/i.test(o.kind||'')||this._relicPick)?'relic':(o.uniqueCard||o.kind==='⭐ Unique Mutation'||type==='awk')?'unique':(o.mutation||o.evolution||o.companionForm||/Mutation|Evolution/.test(o.kind||''))?'mutation':'normal';
    const templateKey='lvl_tpl_'+cat, template=this.tuHas(templateKey)?this.tuPanel(templateKey,0,x,y,w,h):null;
    const lightCard=!!template&&cat==='normal';
    let panel=template||(this.tuHas('lvl_card_base')?this.tuPanel('lvl_card_base',0,x,y,w,h):null);
    if(panel&&(!template||lightCard)){
      const accent=this.tuPanel('lvl_card_accent',0,0,0,w,h);
      if(accent){accent.list.forEach(i=>i.setTint(color));panel.add(accent);}
    }
    if(template){
      const fxKey='lvl_tpl_fx_'+cat;
      if(cat!=='normal'&&this.tuHas(fxKey)){
        const texture=this.tuFrames(fxKey);
        if(!texture._lvlTemplateAnim||!this.anims.exists(fxKey)){
          if(this.anims.exists(fxKey))this.anims.remove(fxKey);
          const frames=Array.from({length:6},(_,i)=>({key:fxKey,frame:'cell'+i}));
          this.anims.create({key:fxKey,frames,frameRate:8,repeat:-1});
          texture._lvlTemplateAnim=true;
        }
        const fx=this.add.sprite(w/2,h/2,fxKey,'cell0').setDisplaySize(w,h);
        panel.add(fx);
        if(!Save.data?.settings?.reducedMotion)fx.play(fxKey);
      }
      const crest=this.tuImg('lvl_tpl_crest',{normal:0,mutation:1,relic:2,unique:3}[cat],18,18,30,30);
      if(crest)panel.add(crest);
    }
    const badgeColor='#'+(lightCard?this._darken(color,.60):color).toString(16).padStart(6,'0');
    const nameColor=lightCard?'#342137':'#ffffff', roleColor=lightCard?'#664521':'#f4d694';
    const descriptionColor=lightCard?'#493a4b':'#e9e3ef', rankColor=lightCard?'#704926':'#ffe07a';
    if(!panel){panel=this.add.graphics();const bgMix=rarIdx>=2?this._darken(color,rarIdx>=3?0.60:0.70):0x21172b;
    panel.fillStyle(bgMix,0.98);panel.fillRoundedRect(x,y,w,h,16);panel.lineStyle(2+Math.max(0,rarIdx)*0.9,color,0.96);panel.strokeRoundedRect(x,y,w,h,16);panel.fillStyle(color,1);panel.fillRoundedRect(x,y,7,h,4);}
    if(rarIdx>=2){this.tweens.add({targets:glow,alpha:{from:rarIdx>=3?0.58:0.42,to:1},yoyo:true,repeat:-1,duration:rarIdx>=3?520:780,ease:'Sine.inOut'});}
    group.add(glow);
    let iconKey=this.cardArtKey?.(o)||(o.iconKey&&this.textures.exists(o.iconKey)?o.iconKey:type==='heal'?(this.textures.exists('ic_heart')?'ic_heart':null):type==='awk'?this.iconKey(o.key,false):this.iconKey(o.key,type==='pas')),iconFrame;
    /* v8.1.144 owner 🐞: Build Path back to the wide card layout, with the painted path card (order 80) as its picture (square crop of the illustration) */
    if(o.kind==='Build Path'&&typeof pathCardKey==='function'){ const pk=pathCardKey(o.key); if(this.realTex?.(pk)){ const T=this.textures.get(pk),src=T.getSourceImage(); if(!T.has('sq')){ const sw=src.width,sy=Math.round(src.height*.12); T.add('sq',0,0,sy,sw,Math.min(sw,src.height-sy)); } iconKey=pk; iconFrame='sq'; } }
    let icon,badgeT,nameT,roleT,descT,starsT,ctaT; let hl=options.starting?null:this._cardHeadline(o);if(hl&&(hl.t==null||hl.t==='undefined'||/undefined/.test(String(hl.t))))hl=null;   /* v7.8.59 การ์ด Relic บางใบขึ้น "undefined" */
    if(hl&&!options.starting)hl=this._cardProgress(o,hl)||hl;   /* v7.9.25 เจ้าของ: บอกค่าเดิม → ค่าหลังเลือก */
    // v6.52.1: คำอธิบายสั้นลง — แยกแท็กไปบรรทัดดาว · ตัดท่อนที่ซ้ำกับหัวข้อเขียว
    let dd=String(o.desc||''),tagS=''; if(o.kind==='Build Path'){ const m=dd.match(/^[^.!?]*[.!?]/); if(m&&m[0].length>=20)dd=m[0]; }   /* v8.1.144 owner: short, simple text */{const ti=dd.search(/\s{2}·\s{2}|\s⬆\s/);if(ti>=0){tagS=dd.slice(ti).replace(/^\s*·\s*/,'').trim();dd=dd.slice(0,ti);}}
    if(hl&&hl.t){const h=hl.t.replace(/^[^A-Za-z0-9+\-−×]+/,'').replace(/…$/,'').trim();if(h.length>3&&dd.trim().startsWith(h)){const r=dd.trim().slice(h.length).replace(/^[\s,·;—-]+/,'');if(r.length>3)dd=r.charAt(0).toUpperCase()+r.slice(1);}}
    if(wide){
      /* v8.1.146 art order 82: Build Path = painted Unique art over the whole card, text on the darker right side */
      const fk=isPath?'pathuq82_'+((this.basicAttack&&this.basicAttack.character)||this.character||'')+'_'+o.key:null,full=!!(fk&&this.realTex?.(fk));
      const iconX=x+Math.min(66,h*0.40),iconY=y+h/2,iconSize=Math.min(78,h*0.56),textX=full?x+w*0.5:x+Math.min(118,h*0.76),textW=w-(textX-x)-14;
      let halo; if(full){ const bg=this.add.image(x+w/2,y+h/2,fk),tw=bg.width||720,th=bg.height||298,sc=Math.max((w-4)/tw,(h-4)/th),cw=Math.min(tw,(w-4)/sc),chh=Math.min(th,(h-4)/sc); bg.setScale(sc); bg.setCrop?.((tw-cw)/2,(th-chh)/2,cw,chh); halo=bg; icon=this.add.graphics(); icon.lineStyle?.(2,color,0.85); icon.strokeRoundedRect?.(x+2,y+2,w-4,h-4,16); }
      else { halo=this.lvlSocket(iconX,iconY,Math.min(45,h*0.34)*2.05,color)||this.add.circle(iconX,iconY,Math.min(45,h*0.34),color,0.13).setStrokeStyle(2,color,0.30);
      icon=iconKey?this.add.image(iconX,iconY,iconKey,iconFrame).setDisplaySize(iconSize,iconSize):this.add.text(iconX,iconY,o.emoji||'?',{fontSize:Math.round(iconSize*0.72)+'px'}).setOrigin(0.5); }
      badgeT=this.add.text(textX,y+10,badge,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:badgeColor}).setOrigin(0,0);
      nameT=this.add.text(textX,y+29,title+(options.starting||isPath?'':'  Lv'+lvl+jump),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:isPath?'18px':w<300?'14px':'16px',color:nameColor,wordWrap:{width:textW},maxLines:1}).setOrigin(0,0);
      roleT=hl?this.add.text(textX,y+51,hl.t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:hl.c,stroke:hl.s,strokeThickness:3,wordWrap:{width:textW},maxLines:1}).setOrigin(0,0):this.add.text(textX,y+55,role,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:roleColor,wordWrap:{width:textW},maxLines:1}).setOrigin(0,0);
      if(hl&&hl.prog){roleT.setWordWrapWidth(null);let fs=parseInt(roleT.style.fontSize)||14;while(roleT.width>textW&&fs>9)roleT.setFontSize(--fs+'px');}
      descT=this.add.text(textX,y+75,dd,{fontFamily:'sans-serif',fontSize:w<300?'9px':'11px',color:descriptionColor,lineSpacing:2,wordWrap:{width:textW},maxLines:2}).setOrigin(0,0);
      let stars='';if(!options.starting&&!isPath&&type!=='awk'&&type!=='heal'&&type!=='util'){const mx=o.max||5;stars='Lv '+lvl+' / '+(mx>=99?'∞':mx);}   /* v7.6.1 เจ้าของ: ตัวเลขแทนดาว · อัปไม่จำกัด = ∞ */
      starsT=isPath&&o.carry?this.add.text(textX,y+h-20,o.carry,{fontFamily:'sans-serif',fontSize:'9px',color:'#9be8ff',wordWrap:{width:Math.max(60,textW-110)},maxLines:2}).setOrigin(0,0.5):this.add.text(textX,y+h-20,stars+(tagS?'   '+tagS:''),{fontFamily:'sans-serif',fontSize:'10px',color:rankColor}).setOrigin(0,0.5);   /* v7.8.28 การ์ด Build Path: บรรทัดการ์ดเริ่มต้นที่พาไปด้วย */
      ctaT=this.add.text(x+w-16,y+h-18,'CHOOSE ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(1,0.5);
      if(full){ for(const t of [nameT,descT,starsT]){ t.setColor?.(t===nameT?'#fff6e6':t===descT?'#f1e7f7':'#bfeaff'); t.setStroke?.('#120a1c',3); } }
      group.add([panel,halo]);this.lvlCta(group,ctaT,color,options);group.add([icon,badgeT,nameT,roleT,descT,starsT,ctaT]);this.lvlBadge(group,o,badgeT);
    }else{
      const iconX=x+w/2,iconY=y+h*0.25,iconSize=Math.min(70,h*0.25),textW=w-22;
      const halo=this.lvlSocket(iconX,iconY,Math.min(42,w*0.22)*2.05,color)||this.add.circle(iconX,iconY,Math.min(42,w*0.22),color,0.13).setStrokeStyle(2,color,0.30);
      icon=iconKey?this.add.image(iconX,iconY,iconKey,iconFrame).setDisplaySize(iconSize,iconSize):this.add.text(iconX,iconY,o.emoji||'?',{fontSize:Math.round(iconSize*0.72)+'px'}).setOrigin(0.5);
      badgeT=this.add.text(x+w/2,y+9,badge,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:badgeColor}).setOrigin(0.5,0);
      nameT=this.add.text(x+w/2,y+h*0.42,title+(options.starting||isPath?'':'  Lv'+lvl+jump),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:isPath?'18px':'14px',color:nameColor,align:'center',wordWrap:{width:textW},maxLines:1}).setOrigin(0.5,0);
      roleT=hl?this.add.text(x+w/2,y+h*0.505,hl.t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:hl.c,stroke:hl.s,strokeThickness:3,align:'center',wordWrap:{width:textW},maxLines:1}).setOrigin(0.5,0):this.add.text(x+w/2,y+h*0.52,role,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:roleColor,align:'center',wordWrap:{width:textW},maxLines:1}).setOrigin(0.5,0);
      if(hl&&hl.prog){roleT.setWordWrapWidth(null);let fs=parseInt(roleT.style.fontSize)||14;while(roleT.width>textW&&fs>9)roleT.setFontSize(--fs+'px');}
      descT=this.add.text(x+w/2,y+h*0.60,dd,{fontFamily:'sans-serif',fontSize:'9px',color:descriptionColor,align:'center',lineSpacing:2,wordWrap:{width:textW},maxLines:3}).setOrigin(0.5,0);
      let stars='';if(!options.starting&&!isPath&&type!=='awk'&&type!=='heal'&&type!=='util'){const mx=o.max||5;stars='Lv '+lvl+' / '+(mx>=99?'∞':mx);}   /* v7.6.1 เจ้าของ: ตัวเลขแทนดาว · อัปไม่จำกัด = ∞ */
      starsT=isPath&&o.carry?this.add.text(x+w/2,y+h*0.85,o.carry,{fontFamily:'sans-serif',fontSize:'8.5px',color:'#9be8ff',align:'center',wordWrap:{width:textW},maxLines:2}).setOrigin(0.5):this.add.text(x+w/2,y+h*0.87,stars+(tagS?'   '+tagS:''),{fontFamily:'sans-serif',fontSize:'10px',color:rankColor}).setOrigin(0.5);
      ctaT=this.add.text(x+w/2,y+h-14,'CHOOSE ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(0.5);
      group.add([panel,halo]);this.lvlCta(group,ctaT,color,options);group.add([icon,badgeT,nameT,roleT,descT,starsT,ctaT]);
    }
    // v6.51.0: การ์ดพิเศษ (Mutation/Evolution/Relic/Path/Infusion/Fusion/Modifier) เด่นขึ้น — กรอบทองเต้น+ริบบิ้น+แสงวิ่ง+ประกาย
    const SPK={'Companion Evolution':['COMPANION FORM',0xffd447],'Build Path':['PICK ONE BUILD',0x7fd8ff],'Flavor Infusion':['INFUSION',0xff9a4d],'Dual Infusion':['DUAL INFUSION',0xff9a4d],'Fusion':['FUSION',0xc58bff],'Relic':['RELIC',0xff7ad9],'Modifier':['MODIFIER',0x6fe3c4]};
    const sp=o.evolution?['✨ EVOLUTION',0xffd447]:o.mutation?['🧬 MUTATION',0xc58bff]:SPK[o.kind]?['✦ '+SPK[o.kind][0],SPK[o.kind][1]]:null;
    if(!options.starting)this.lvlCardJuice(group,x,y,w,h,color,icon,!!sp,options.index||0);
    if(sp&&!options.starting){
      const sc=sp[1],fx=this.tuPanel('lvl_card_glow',0,x-16,y-16,w+32,h+32)||this.add.graphics();
      if(fx.type==='Container')fx.list.forEach(i=>i.setTint(sc));else{fx.lineStyle(4,sc,1);fx.strokeRoundedRect(x-2,y-2,w+4,h+4,18);fx.lineStyle(10,sc,0.35);fx.strokeRoundedRect(x-6,y-6,w+12,h+12,22);}
      this.tweens.add({targets:fx,alpha:{from:0.45,to:1},yoyo:true,repeat:-1,duration:450,ease:'Sine.inOut'});
      const rw=Math.min(w-30,sp[0].length*8+26),ri={'✨ EVOLUTION':0,'🧬 MUTATION':1}[sp[0]]??({'Build Path':2,'Flavor Infusion':3,'Dual Infusion':3,'Fusion':1,'Relic':4,'Modifier':5}[o.kind]??0);let rib=this.tuPanel('lvl_ribbon_sheet',ri,x+w/2-(rw+20)/2,y-14,rw+20,26);
      if(!rib){rib=this.add.graphics();rib.fillStyle(sc,1);rib.fillRoundedRect(x+w/2-rw/2,y-11,rw,20,10);rib.lineStyle(2,0xffffff,0.9);rib.strokeRoundedRect(x+w/2-rw/2,y-11,rw,20,10);}
      const ribT=this.add.text(x+w/2,y-1,sp[0],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#2a1530'}).setOrigin(0.5);
      const shine=this.textures.exists('lvl_shine_strip')?this.add.image(x,y+h/2,'lvl_shine_strip').setDisplaySize(26,h-6).setAlpha(.55).setAngle(14):this.add.rectangle(x,y+h/2,18,h-6,0xffffff,0.22).setAngle(14);
      const mk=this.make.graphics({add:false});mk.fillRoundedRect(x,y,w,h,16);shine.setMask(mk.createGeometryMask());
      this.tweens.add({targets:shine,x:{from:x-20,to:x+w+20},duration:900,repeat:-1,repeatDelay:700,delay:(options.index||0)*65+200});
      const spk=[];for(let i=0;i<5;i++){const sz=(9+Math.random()*7|0),s=this.tuHas('lvl_sparkle_sheet')?(this.tuFrames('lvl_sparkle_sheet'),this.add.image(x+Math.random()*w,y+Math.random()*h,'lvl_sparkle_sheet','cell'+(i%4)).setDisplaySize(sz*1.4,sz*1.4).setAlpha(0)):this.add.text(x+Math.random()*w,y+Math.random()*h,'✦',{fontSize:sz+'px',color:'#ffffff'}).setOrigin(0.5).setAlpha(0);spk.push(s);const bs=s.scaleX||1;this.tweens.add({targets:s,alpha:{from:0,to:0.9},scale:{from:bs*0.5,to:bs*1.2},yoyo:true,repeat:-1,duration:600+Math.random()*500,delay:Math.random()*900});}
      group.add([fx,shine,rib,ribT,...spk]);
      if(!this._spSndAt||this.time.now-this._spSndAt>800){this._spSndAt=this.time.now;Sfx.legend&&Sfx.legend();}
    }
    this.drawComboHints(group,o,x,y,w,h,wide,options.index||0);
    const baseX=icon.scaleX||1,baseY=icon.scaleY||1;panel.setAlpha(0);icon.setScale(baseX*0.25,baseY*0.25);
    this.tweens.add({targets:[panel,badgeT,nameT,roleT,descT,starsT,ctaT],alpha:{from:0,to:1},duration:180,delay:(options.index||0)*65});
    this.tweens.add({targets:icon,scaleX:baseX,scaleY:baseY,duration:280,delay:(options.index||0)*65,ease:'Back.out'});
  }
  // คำใบ้คอมโบบนการ์ด: ไอคอนคู่คอมโบมุมขวาบน — จางถ้ายังNoneอีกครึ่ง / สว่าง+เรืองถ้ามีแล้ว (ชี้ว่าควWaitัพใบนี้)
  // v7.8.59 ใบ 23 helpers: วงไอคอน (ฐาน + วงแหวนย้อมสี) · เม็ดยาหลังข้อความ · สัญลักษณ์ประเภทหน้าป้าย
  lvlSocket(x,y,size,color){if(!this.tuHas('lvl_icon_socket'))return null;this.tuFrames('lvl_icon_socket');const c=this.add.container(x,y);c.add(this.add.image(0,0,'lvl_icon_socket','cell0').setDisplaySize(size,size));c.add(this.add.image(0,0,'lvl_icon_socket','cell1').setDisplaySize(size,size).setTint(color));return c;}
  lvlPill(group,t,cell){if(!this.tuHas('lvl_pill_sheet')||!t)return null;const pw=t.width+22,ph=Math.max(20,t.height+8),px=t.x-t.originX*t.width-11,py=t.y-t.originY*t.height-(ph-t.height)/2,p=this.tuPanel('lvl_pill_sheet',cell,px,py,pw,ph);if(p)group.add(p);return p;}
  /* v8.1.100 เจ้าของ: "Tap to choose" ดูไม่เข้า → ป้าย CHOOSE สีตามการ์ด (ไม่ใช้ pill art) */
  lvlCta(group,t,color,options={}){if(!t)return null;const pw=t.width+20,ph=t.height+8,px=t.x-t.originX*t.width-10,py=t.y-t.originY*t.height-4,g=this.add.graphics();
    g.fillStyle(this._darken?this._darken(color,.55):color,1);g.fillRoundedRect(px,py,pw,ph,ph/2);g.lineStyle(1.5,0xffffff,.85);g.strokeRoundedRect(px,py,pw,ph,ph/2);group.add(g);
    if(!Save.data?.settings?.reducedMotion)this.tweens.add({targets:[g,t],alpha:{from:1,to:.62},yoyo:true,repeat:-1,duration:760,delay:(options.index||0)*120,ease:'Sine.inOut'});return g;}
  /* v8.1.100 เจ้าของ: การ์ดจืด → ลูกเล่นเบา ๆ ทุกใบ: แสงวิ่งผ่าน (การ์ดพิเศษมีของตัวเองแล้ว) · ไอคอนลอย · ประกายมุม · เด้งเข้าตอนเปิด */
  lvlCardJuice(group,x,y,w,h,color,icon,special,idx){if(Save.data?.settings?.reducedMotion)return;
    if(icon){const iy=icon.y;this.tweens.add({targets:icon,y:iy-3,yoyo:true,repeat:-1,duration:900+idx*70,ease:'Sine.inOut'});const sx=icon.scaleX,sy=icon.scaleY;icon.setScale(sx*.4,sy*.4);this.tweens.add({targets:icon,scaleX:sx,scaleY:sy,duration:340,delay:80+idx*90,ease:'Back.easeOut'});}
    if(!special){const sh=this.add.rectangle(x-24,y+h/2,22,h*1.3,0xffffff,.22).setAngle(16),mk=this.make.graphics({add:false});mk.fillRoundedRect(x,y,w,h,16);sh.setMask(mk.createGeometryMask());group.add(sh);
      this.tweens.add({targets:sh,x:x+w+24,duration:760,repeat:-1,repeatDelay:2300,delay:500+idx*260,ease:'Sine.inOut'});}
    for(let i=0;i<2;i++){const sx=i?x+w-12:x+12,sy=i?y+h-10:y+10,st=this.add.text(sx,sy,'✦',{fontSize:'11px',color:'#'+(color>>>0).toString(16).padStart(6,'0')}).setOrigin(.5).setAlpha(0);group.add(st);
      this.tweens.add({targets:st,alpha:{from:0,to:.95},scale:{from:.6,to:1.25},yoyo:true,repeat:-1,duration:620,repeatDelay:900+i*500,delay:idx*180+i*400});}
    const fl=this.add.graphics();fl.lineStyle(3,0xffffff,.9);fl.strokeRoundedRect(x,y,w,h,16);group.add(fl);this.tweens.add({targets:fl,alpha:{from:.9,to:0},duration:420,delay:60+idx*90,onComplete:()=>fl.destroy()});}
  lvlBadge(group,o,t){if(!this.tuHas('lvl_type_badge_sheet')||!t)return;const i={atk:0,pas:1,basic:2,heal:3,util:4,uni:5,awk:6}[o.type||'atk'];if(i==null)return;this.tuFrames('lvl_type_badge_sheet');const s=t.height+6;group.add(this.add.image(t.x+t.width+5+s/2,t.y+t.height/2,'lvl_type_badge_sheet','cell'+i).setDisplaySize(s,s));}
  // ป้ายหัวเรื่อง (ช่องตามโหมด) วางหลังข้อความ + ระเบิดดาวตอนเปิด (ไม่ซ้ำภายใน 1.5s) · ข้อความหดให้พอดีจอ
  lvlTitleArt(t,cell,open){if(!t)return;let fs=13;const tr=this.tuHas('lvl_title_banner_sheet')?this.W-120:this.W-40;while(t.width>tr&&fs>9)t.setFontSize(--fs+'px');   /* v7.8.70: ตัวหนังสือไม่ทับหัวท้ายริบบิ้น */if(!this.tuHas('lvl_title_banner_sheet'))return;const bw=Math.min(this.W-12,t.width+70),bh=t.height+14,b=this.tuPanel('lvl_title_banner_sheet',cell,t.x-bw/2,t.y-7,bw,bh);if(!b)return;const i=this.lvlUp.getIndex(t);this.lvlUp.addAt(b,Math.max(0,i));t.setColor('#fff7e0').setStroke('#3a1b2e',3);
    if(open&&this.bpAnim?.('vfx_lvl_open')&&performance.now()-(this._lvlOpenFxAt||0)>1500){this._lvlOpenFxAt=performance.now();const s=this.add.sprite(t.x,t.y+bh/2,'vfx_lvl_open',0).setDisplaySize(260,260).setAlpha(.9);this.lvlUp.addAt(s,Math.max(0,i));s.play('vfx_lvl_open');s.once('animationcomplete',()=>s.destroy());}}
  // แตะยืนยัน: การ์ดแตกเป็นประกาย (การ์ดพิเศษใช้ชุดใหญ่) · sprite บนกล้อง UI เพราะ lvlUp ถูกซ่อนทันที
  lvlConfirmFx(c){const o=c.opt||{},big=o.evolution||o.kind==='Relic'||o.kind==='Build Path',k=big?'vfx_lvl_special_confirm':'vfx_lvl_confirm';if(!this.bpAnim?.(k))return;const w=c.right-c.left,h=c.bottom-c.top,s=this.add.sprite(c.left+w/2,c.top+h/2,k,0).setDisplaySize(w*1.15,h*1.6).setDepth(95);s.setScrollFactor?.(1);this.camUI?.(s);s.play(k);s.once('animationcomplete',()=>s.destroy());}
  comboPartners(o){
    const key=o.key,isAtk=(o.type==='atk'||o.type==='awk'),out=[];
    for(const c of COMBOS){
      if(isAtk&&c.a===key){const owned=(this.passives?.[c.b]||0)>0;out.push({pk:c.b,isPass:true,owned,name:c.name});}
      else if(o.type==='pas'&&c.b===key){const owned=(this.skills?.[c.a]||0)>0;out.push({pk:c.a,isPass:false,owned,name:c.name});}
    }
    return out;
  }
  drawComboHints(group,o,x,y,w,h,wide,index){
    if(o.type!=='atk'&&o.type!=='pas'&&o.type!=='awk')return;
    const partners=this.comboPartners(o); if(!partners.length)return;
    const anyOwned=partners.some(p=>p.owned);
    const sz=18,gap=4,pad=10,list=partners.slice(0,3);
    let cx=x+w-pad-sz/2, cy=y+pad+sz/2;   // เริ่มมุมขวาบน ไล่ลงซ้าย
    // ป้ายเล็ก "🔗" นำหน้าเมื่อพร้อมคอมโบ ให้สังเกตง่าย
    if(anyOwned){const tag=this.add.text(x+w-pad,cy+sz/2+6,'🍳 Can cook a dish!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:'#ffe07a'}).setOrigin(1,0);group.add(tag);}
    list.forEach((p,i)=>{
      const ix=cx-i*(sz+gap),iy=cy;
      const ring=this.add.circle(ix,iy,sz/2+2,p.owned?0xffe07a:0x6a6076,p.owned?0.9:0.35).setStrokeStyle(1.5,p.owned?0xffd23f:0x8a7f98,p.owned?1:0.5);
      const ik=this.iconKey(p.pk,p.isPass);
      let ic;
      if(ik)ic=this.add.image(ix,iy,ik).setDisplaySize(sz,sz);
      else{const em=(p.isPass?(PASSIVES[p.pk]?.emoji):(SKILLDEFS[p.pk]?.emoji))||'✦';ic=this.add.text(ix,iy,em,{fontSize:Math.round(sz*0.72)+'px'}).setOrigin(0.5);}
      if(!p.owned){ic.setAlpha(0.42);if(ic.setTintFill)ic.setTintFill(0x9a90a8);}   // ยังNoneอีกครึ่ง = จางเทา
      else{ic.clearTint&&ic.clearTint();ic.setAlpha(1);this.tweens.add({targets:[ring,ic],alpha:{from:0.55,to:1},yoyo:true,repeat:-1,duration:520,ease:'Sine.inOut'});}   // มีแล้ว = สว่าง+กระพริบ (ไม่ปรับ scale กันไอคอนพองใหญ่)
      group.add([ring,ic]);
    });
  }
  signatureWeaponInfo(){const ch=CHARACTERS[this.character]||CHARACTERS.momo;return SIGNATURE_WEAPONS[ch.weapon]||SIGNATURE_WEAPONS.berryBlaster;}
  usesBasicAttackBuild(){return !!BASIC_ATTACKS[this.character];}
  /* v7.8.28 การ์ด Build Path บอกว่าการ์ดเริ่มต้นที่ลงไว้จะกลายเป็นอะไรในสายนั้น (การ์ดเริ่มต้นห้ามเสียเปล่า) */
  pathCarryText(pt){const b=this.basicAttack,d0=BASIC_ATTACKS[this.character];if(!b||!d0||!pt)return '';const own=(d0.upgrades||[]).filter(u=>(b.lv?.[u.id]||0)>0);if(!own.length&&!b.mutation)return '';
    const prev=b.path;let info=null;try{b.path=pt.id;info=this.basicAttackInfo();}catch(e){info=null;}finally{b.path=prev;}if(!info)return '';
    const parts=own.map(u=>{const v=(info.upgrades||[]).find(x=>x.id===u.id)||u;return (v.name!==u.name?u.name+' → '+v.name:v.name)+' ×'+b.lv[u.id];});
    if(b.mutation){const m=(info.mutations||[]).find(x=>x.id===b.mutation)||(d0.mutations||[]).find(x=>x.id===b.mutation);if(m)parts.push(m.name);}
    return parts.length?'↪ Keeps: '+parts.slice(0,3).join(' · ')+(parts.length>3?' +'+(parts.length-3)+' more':''):'';}
  basicAttackInfo(){if(this.isSesRune?.())return {name:'Rainbow Flare',emoji:'✧',skill:'mirror',color:0xffe0a3,evolution:'Rune Invoker',mutations:[],upgrades:SES_RUNE_CARDS};const d=BASIC_ATTACKS[this.character]||null,b=this.basicAttack;if(this.character==='momo')return berryAttackInfo(d,b);if(this.character==='cocoa')return cocoaAttackInfo(d,b);if(this.character==='taro')return taroAttackInfo(d,b);if(this.character==='yuzu'){const ye=YUZU_EVOLUTIONS[b?.path],splash=({citrusGuardian:'Pomelo sweeps gain 10px radius per rank.',zestSwarm:'Arrow impacts splash for 18% companion power per rank (24px + 12px per rank). Vaulting Shot gains 8px radius per rank.',juiceWorkshop:'Blood Orange ground Sigils gain 8px radius per rank.'})[b?.path];const sd=YZ_SEED_DESC[b?.path]||YZ_SEED_DESC.none;return {...d,...(ye?{evolution:ye.name,evolutionDesc:ye.desc}:{}),upgrades:d.upgrades.map(u=>u.id==='splash'&&splash?{...u,desc:splash}:u.id==='seedling'?{...u,desc:u.desc+' '+sd}:u)};}const e=this.character==='mint'&&MINT_EVOLUTIONS[b?.path];if(!e)return d;return {...d,evolution:e.name,evolutionDesc:e.desc,upgrades:d.upgrades.map(u=>u.id==='linger'&&b.path==='pierce'?{...u,name:'Rupture Shards',headline:'+8% Rupture damage',desc:'Crystal Impaler Rupture deals +8% damage per rank. Ranks taken before the build carry over.'}:u.id==='linger'&&b.path==='glacier'?{...u,name:'Frost Bloom',headline:'+8% Bloom splash',desc:'Glacier frost-bloom splash gains +8% base power per rank. Shatter chains remain bounded; no shard projectiles.'}:u)};}
  initBasicAttack(){const d=this.basicAttackInfo();if(!d){this.basicAttack=null;return;}this.basicAttack={character:this.character,ranks:{},lv:{},mutation:null,evolved:false,mastery:0,comboStep:0,lastComboAt:-9,endless:{}};this.syncBasicAttack();}
  // v4.25: b.ranks[id] = magnitude ถ่วง potency (ใช้กับค่า scalar) · b.lv[id] = เลเวลจำนวนเต็ม (display/mastery/gate + upgrade แบบนับนัด)
  syncBasicAttack(){if(this.character==='taro')this.syncTaroCombat?.();const d=this.basicAttackInfo(),b=this.basicAttack;if(!d||!b)return;if(this.character==='cocoa'&&b._cocoaPath!==b.path){this.clearCocoaCombat?.();b._cocoaPath=b.path;}if(b.path&&b._ptal!==b.path&&this.player){applyPathTalents(this.player,this.character,b.path,(Save.cp(this.character)||{}).tal);b._ptal=b.path;}b._pm=pathMods(b);if(this.player){ptMergeFx(b._pm,this.player._pt);b._pm.count+=this.player.gearCount||0;b._pm.range+=this.player.gearArea||0;}{const tk=b._pm.taken,prev=b._takenApplied||0;if(tk!==prev&&this.player){this.player.dmgTakenMul=Math.max(STAT_CAPS.dmgTakenMin||0.35,(this.player.dmgTakenMul||1)*(1-tk)/(1-prev));b._takenApplied=tk;}}b.mastery=Object.values(b.lv||{}).reduce((s,v)=>s+(v||0),0)+(b.mutation?1:0);this.skills[d.skill]=Math.min(5,1+Math.floor(b.mastery/3));this.skillCd[d.skill]=Math.min(this.skillCd[d.skill]||0,0.15);this.buildSkillBar();if(this.character==='cocoa')this.refreshUniqueSkillUI();}
  equipSignatureWeapon(){const w=this.signatureWeaponInfo();this.signatureWeapon=w;this.skills[w.skill]=Math.max(1,this.skills[w.skill]||0);if(this.usesBasicAttackBuild())this.initBasicAttack();if(w.skill==='star')this.rebuildRing();}
  rollRunTrait(){ if(this._inTutorial||this.recipeMode||this.bossRush||this._pinnacleRun||this.riftMode||(this.stageIndex||0)<(typeof CH1_CALM_UNTIL!=='undefined'?CH1_CALM_UNTIL:5))return;   /* v8.2.54 ECRS2 S4: Run trait เริ่ม Chapter 2 (เดิมด่าน 3) */ const T=Phaser.Utils.Array.GetRandom(RUN_TRAITS); this._runTrait=T;Sfx.orderCue?.('run_trait',.35,1); this.traitTxt?.setText(T.emoji+' '+T.name).setVisible(true);
    if(T.player&&this.player)T.player(this.player); this.time.delayedCall(4600,()=>{ if(this._runTrait===T&&(this.state==='play'||this.state==='levelup'))this.showBanner(T.emoji+' Run trait: '+T.name,T.desc,2600); }); }   /* v7.8.102 เลื่อน 2.3→4.6s ให้พ้นแบนเนอร์เริ่มด่าน/Replay */
  launchStageLoadout(extraSkillKey=null){const sw=this.signatureWeaponInfo(),basic=this.basicAttackInfo(),extra=extraSkillKey&&SKILLDEFS[extraSkillKey];
    const begin=()=>{this.physics.resume();this.state='play';this._runTrait=null;this.traitTxt?.setVisible(false);this.startStage(this.stageIndex);this.rollRunTrait?.();if(!this._v83Run)this.showBanner(sw.emoji+' '+(basic?basic.name:sw.name)+(extra?' + '+extra.emoji+' '+extra.name:''),basic?'Signature Basic Attack · '+this.uniqueInfo().emoji+' Unique ready':'Signature + secondary weapon ready · '+this.uniqueInfo().emoji+' Unique ready',1900);};
    const launch=()=>{if(this.mcStory?.()){ if(this.stageIndex===5&&!Save.data.storyCh2Seen&&this.mcGate('s12',ok=>{ if(!ok){launch();return;} Save.data.storyCh2Seen=true;Save.save();begin(); }))return; if(this.stageIndex===10&&this.mcGate('s14',()=>begin()))return; }   // v8.0.2 Motion Comic เปิดบท 2/3
      if(this.stageIndex===0&&!Save.data.storyIntroSeen){Save.data.storyIntroSeen=true;Save.save();this.playStoryPanel('story_intro_fall','CHAPTER 1 · PROLOGUE','Fall Below the Kitchen','The starving Hunger’s roots crack the pantry floor — a cursed strawberry mochi falls, and the sleeping Heart Seed wakes in her hands',begin);}else if(this.stageIndex===5&&!Save.data.storyCh2Seen){Save.data.storyCh2Seen=true;Save.save();this.playStoryPanel('chapter2_cover','CHAPTER 2 · PROLOGUE','The Root Goes Deeper','The wounded root fled into the garden — now it grows the Hunger a new body from stolen memories',begin);}else begin();};
    // ผู้เล่นใหม่: เข้าเล่นจริงเลย แล้วครูBerryสอนแบบ "Talk + try it + pass to continue"
    // ผู้เล่นใหม่ → เข้า Training Ground (พื้นที่เปล่า) ให้ครูBerryสอนก่อน · ไม่แตะ story intro (เก็บไว้เล่นตอนลงด่าน 1 จริง)
    if(this._forceCoachTutorial||!Save.data.tutorialDone){ this._rubyEntry?.destroy();this._forceCoachTutorial=false; this._inTutorial=true; begin(); this.startCoach(); return; }
    if(this._rubyEntry){this.rubyEnterStage(launch);return;}launch();
  }
  /* ---- 🍓 ครูBerryสอนเล่นแบบ interactive (พูด → ลองทำ → ผ่าน → ถัดไป) ---- */
  coachSteps(){ return [   // v7.9.66 เจ้าของ: สอนช้า ๆ เข้าใจง่าย → ทุกขั้นมีหน้าอธิบาย (เกมหยุด, แตะเพื่อไปต่อ) ก่อนให้ลองทำ · ทำได้แล้วชม 1.5 วิค่อยไปขั้นถัดไป
    { id:'welcome', icon:'👋', title:'Hi, I’m Ruby!', body:'The Heart Seed broke your curse — you’re a person again!\nLet’s get you ready to save the others.', introOnly:true },
    { id:'move', icon:'👆', title:'Moving', body:'Slide one finger to walk.\nLift it to stop.', say:'Slide your finger to walk', sub:'Walk around a little', spot:'move', goal:c=>'Walk around · '+Math.min(100,Math.round((c.trav||0)/7))+'%', check:c=>(c.trav||0)>=700 },
    { id:'attack', icon:'⚔️', title:'Attacking', body:'Your Heart Seed fights on its own.\nJust walk near the sour critters!', say:'Defeat the enemies', sub:'Walk near them — you attack on your own', spot:'enemy', goal:c=>'Defeat '+Math.min(3,this.kills-c.kills)+'/3', spawn:3, check:c=>this.kills-c.kills>=3 },
    { id:'sweets', icon:'🍬', title:'Sweets = EXP', body:'Beaten foes drop stolen sweets.\nWalk over them to take them back!', say:'Pick up the sweets', sub:'Walk over the shiny drops', spot:'orb', orbs:4, goal:c=>'Collected '+Math.min(3,(this._coachOrbs||0)-c.orbs)+'/3', check:c=>(this._coachOrbs||0)-c.orbs>=3, timeout:30 },
    { id:'cards', icon:'🃏', title:'Level Up!', body:'Full EXP bar = 3 flavor cards.\nTap one to read, tap again to take it.', say:'Pick a card', sub:'Tap once to read, tap again to take', spot:'card', goal:'Pick a card', level:true, check:c=>(this._coachCardPick||0)-c.card>=1 },
    { id:'dash', icon:'💨', title:'Dash', body:'Green button: zoom past danger.\nIt needs a moment to recharge.', say:'TAP Dash two times', sub:'Wait for it to recharge between dashes', spot:'dash', label:'TAP', goal:c=>'Dash '+Math.min(2,(this._coachDash||0)-c.dash)+'/2', check:c=>(this._coachDash||0)-c.dash>=2 },
    { id:'unique', icon:'⭐', title:'Your Unique', body:'Pink button: your seed’s big attack.\nIt charges up again over time.', say:'TAP your Unique', sub:'Pink button above Dash', spot:'unique', label:'TAP', spawn:6, ready:true, goal:'Use your Unique', check:c=>(this._coachUnique||0)-c.uniq>=1, timeout:25 },
    { id:'hp', icon:'❤️', title:'Stay Healthy', body:'HP at zero ends the stage.\nPink mochi hearts heal you.', introOnly:true },
    { id:'heal', icon:'❤️', title:'A Heal Mochi! Grab it to get HP back.', say:'A Heal Mochi! Grab it to get HP back.', sub:'Ouch! Walk over the pink heart', spot:'heal', hurt:true, goal:c=>(this._coachHeals||0)-c.heals>=1?'Healed!':'Grab the heart', check:c=>(this._coachHeals||0)-c.heals>=1, timeout:30 },   // v8.1.74 เจ้าของ: หลังการ์ดเสียง HP → จำลองเลือดลด + หัวใจให้เก็บ
    { id:'ready', icon:'🎁', title:'You’re Ready!', body:'Training complete! Use your starter Sugar\nto upgrade one core, then enter the pantry.', introOnly:true },
  ]; }
  startCoach(){ this.loadTutArt?.(); this._coach={step:-1,px:0,py:0,kills:0,dash:0,uniq:0,lvl:1,card:0,t:0}; this._coachNext(); }
  _coachNext(){ const c=this._coach; if(!c)return; c.step++; const steps=this.coachSteps(); this.coachControls?.();
    if(c.step>=steps.length){ this._coachFinish(); return; }
    const step=steps[c.step];
    const go=()=>{ if(this._coach!==c)return; if(step.introOnly){ this._coachNext(); return; }
      c.px=this.player.x; c.py=this.player.y; c.lx=c.px; c.ly=c.py; c.trav=0; c.kills=this.kills; c.dash=this._coachDash||0; c.uniq=this._coachUnique||0; c.lvl=this.level; c.card=this._coachCardPick||0; c.orbs=this._coachOrbs||0; c.heals=this._coachHeals||0; c.t=0; c.done=false;
      this.tutorialSetupStep(step); this.drawCoachBubble(step); this.coachControls?.(); Sfx.select&&Sfx.select(); };
    if(step.introOnly&&this.showCoachIntro)this.showCoachIntro(step,go); else go(); }
  // v7.9.66 หน้าอธิบายก่อนลองทำ: หยุดเกม + การ์ดใหญ่ (Ruby, หัวข้อ, 2–3 บรรทัด) · แตะได้หลัง 1.2 วิ (กันแตะข้ามโดยไม่ได้อ่าน)
  showCoachIntro(step,go){ if(this._coachUI){this._coachUI.destroy();this._coachUI=null;} if(this._coachSpot){this._coachSpot.destroy();this._coachSpot=null;}
    if(this._coachIntro)this._coachIntro.destroy(); this.state='coachIntro'; this.physics.pause(); if(this.player){ this.player.setVelocity(0,0); if(this._pBase)this.player.setScale(this._pBase); } /* v7.9.75 ตัวละครขนาดจริงตั้งแต่หน้าแรก */ if(this.joy)this.joy.active=false;
    const w=this.W,h=this.H,steps=this.coachSteps(),n=(this._coach?this._coach.step:0)+1,cont=this.add.container(0,0).setScrollFactor(1).setDepth(70); this.camUI(cont);
    cont.add(this.add.rectangle(0,0,w,h,0x0d0816,.72).setOrigin(0));
    const bw=Math.min(w-28,390),bx=(w-bw)/2,tw=bw-(this.tuHas('tut_card_frame')?72:40),body=this.add.text(w/2,0,step.body||'',{fontFamily:'sans-serif',fontSize:'16px',color:'#ffffff',align:'center',lineSpacing:7,wordWrap:{width:tw}}).setOrigin(.5,0);
    const bh=Math.max(250,150+body.height+70),by=Math.max(40,(h-bh)/2-h*.04),g=this.add.graphics();
    const fr=this.tuHas('tut_card_frame')&&this.tuPanel('tut_card_frame',0,bx-8,by-30,bw+16,bh+84); if(fr)cont.add(fr); else{ g.fillStyle(0x000000,.4).fillRoundedRect(bx+4,by+6,bw,bh,22).fillStyle(0x2a1030,.98).fillRoundedRect(bx,by,bw,bh,22).lineStyle(3,0xffd166,1).strokeRoundedRect(bx,by,bw,bh,22); cont.add(g); }   // ใบ 38 กรอบการ์ด (ไม่มีภาพ = กรอบวาด)
    const av=this.rubyAvatar(w/2-40,by+78,78); if(av)cont.add(av);
    this.voiceStop?.(); this.voiceLine?.('ruby',(step.id==='welcome'?step.title+' ':'')+String(step.body||'').replace(/\n/g,' '),()=>cont.active,cont);   // v8.1.63 Ruby พากย์บทสอน (ไม่มีไฟล์ = เงียบเหมือนเดิม)
    cont.add(this.add.text(bx+(fr?26:16),by+(fr?62:12),'STEP '+n+' / '+steps.length,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffb3c8'}));
    const ik='tut_ic_'+step.id,hasIc=this.textures.exists(ik); if(hasIc){ const ic=this.add.image(bx+bw-(fr?58:52),by+(fr?88:52),ik); ic.setScale(72/Math.max(ic.width,ic.height)); cont.add(ic); }   // ใบสั่งอาร์ต 38 (ไอคอนประจำขั้น) · ไม่มีภาพ = ใช้อีโมจิในหัวข้อ
    const tt=this.add.text(w/2,by+96,(step.icon&&!hasIc?step.icon+' ':'')+step.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:'#ffe08a',stroke:'#1a0f1e',strokeThickness:5}).setOrigin(.5,0); if(tt.width>tw)tt.setScale(tw/tt.width); cont.add(tt);
    body.setY(by+142); cont.add(body);
    const last=n===steps.length,hint=this.add.text(w/2,by+bh-(fr?16:30),last?'👆 Finish training, then power up':(step.introOnly?'👆 Tap to continue':'👆 Tap to try it'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#8fe8ff'}).setOrigin(.5).setAlpha(0); cont.add(hint);
    cont.setAlpha(0); this.tweens.add({targets:cont,alpha:1,duration:320});
    this._coachIntro=cont; this._coachIntroGo=null;
    this.time.delayedCall(1200,()=>{ if(this._coachIntro!==cont)return; this._coachIntroGo=()=>{ this._coachIntroGo=null; Sfx.select&&Sfx.select(); this.tweens.add({targets:cont,alpha:0,duration:200,onComplete:()=>{ cont.destroy(); if(this._coachIntro===cont)this._coachIntro=null; this.state='play'; this.physics.resume(); go(); }}); };
      this.tweens.add({targets:hint,alpha:{from:.35,to:1},duration:650,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }); }
  tutGreatFx(){ Sfx.orderCue?.('tutorial_great',.35,.5);if(!this.tuHas('vfx_tut_great'))return; this.tuFrames('vfx_tut_great'); const im=this.camUI(this.add.image(this.W/2,this.H*.4,'vfx_tut_great','cell0').setScrollFactor(1).setDepth(66).setDisplaySize(170,170)); let f=0;   // ใบ 38 ตราดาวตอนผ่านขั้น (เล่นครั้งเดียวแล้วลบ)
    const ev=this.time.addEvent({delay:83,repeat:6,callback:()=>{ f++; if(!im.active)return; if(f>5){ ev.remove(false); im.destroy(); return; } im.setFrame('cell'+f); }}); }
  coachIntroTap(){ if(this._coachIntroGo)this._coachIntroGo(); }
  // จัดสนามให้เข้ากับบทที่สอน: เคลียร์มอนเก่าให้โล่ง (freeze/calm) · บทฆ่า = สปอนมอนอ่อน ๆ ให้ลอง · บทเลเวล = เปิดการ์ดให้เลือก
  /* v8.1.74 บทสอน HP: เลือดลดเหลือ 35% (ไม่ตาย) แล้ววางหัวใจโมจิให้เดินไปเก็บ · ข้ามโควตาหัวใจของด่าน */
  coachHurt(){ const p=this.player; if(!p)return null; p.hp=Math.max(1,Math.min(p.hp,Math.round(p.maxhp*.35))); this.screenFlash?.(0xff4d6d,.18,220); this.screenShake?.(160,.004); try{ p.setTint?.(0xff6a8a); this.time.delayedCall(260,()=>p.clearTint?.()); }catch(e){} Sfx.hurt?.();
    this.heals?.children?.iterate?.(o=>{ if(o&&o.active){ o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; } });
    let h=this.heals?.getFirstDead?.(false); const x=p.x+170,y=p.y-40; if(!h)h=this.heals?.create?.(x,y,'heal'); else { h.setActive(true).setVisible(true); if(h.body)h.body.enable=true; h.setPosition(x,y); } if(!h)return null;
    h.body?.setAllowGravity?.(false); this.camWorld(h); this.showPickupCue?.(h,0xff5f97,1.35); if(this.iso)h.setDepth(Math.max(80000,h.y)); this.tweens.add({targets:h,y:y-10,duration:560,yoyo:true,repeat:-1,ease:'Sine.inOut'}); return h; }
  tutorialSetupStep(step){
    if(this.clearEnemies)this.clearEnemies(); if(this.clearFoes)this.clearFoes();
    if(step.spawn){ for(let i=0;i<step.spawn;i++){ const a=Math.PI*2*i/step.spawn; this.spawnEnemy('basic', a, step.spawn<=3?230:175); } }
    if(step.orbs&&this.dropOrb&&this.player){ for(let i=0;i<step.orbs;i++){ const a=Math.PI*2*i/step.orbs+.4; this.dropOrb(this.player.x+Math.cos(a)*150,this.player.y+Math.sin(a)*150,1); } }
    if(step.ready)this.uniqueCd=0;
    if(step.hurt&&this.player)this.coachHurt();
    if(step.level){ this.pendingLvl=(this.pendingLvl||0)+1; this.time.delayedCall(220,()=>{ if(this._inTutorial&&this.state==='play')this.openLevelUp(); }); }
  }
  _coachFinish(){ this.time?.delayedCall?.(0,()=>this.coachControls?.()); if(this._coachIntro){this._coachIntro.destroy();this._coachIntro=null;} if(this._coachUI){this._coachUI.destroy();this._coachUI=null;} if(this._coachSpot){this._coachSpot.destroy();this._coachSpot=null;} this._coach=null; this._inTutorial=false; if(this.clearEnemies)this.clearEnemies(); Save.data.tutorialDone=true; Save.data.tutorialCoachPassed=true; Save.save(); try{ Tele.ev('tutorial_done'); }catch(e){}
    // v4.25: รางวัลจบสอน = 🍬 Sugar (พออัพ Flavor Weave 3 แก่นได้ — เปิดตั้งแต่เริ่ม · gear ยังล็อกจนผ่านด่าน 1)
    const rewardGranted=!Save.data.tutorialRewardGiven;
    if(rewardGranted){ Save.data.tutorialRewardGiven=true; Save.addSugar(140); Save.addShovels(10); Save.save(); }   // รางวัลครั้งเดียว; เซฟเก่าที่รับรางวัลแล้วไม่รับซ้ำ
    this.sugarStage=0; Sfx.clear&&Sfx.clear();
    // หน้า "จบการสอน" ค้างจนกว่าจะแตะ (ไม่เด้งออกเองให้ดูไม่ทัน)
    this.showTutorialComplete(rewardGranted);
  }
  showTutorialComplete(rewardGranted){
    this.lobbyPreload?.();   /* v8.3.13 เจ้าของ: โหลดภาพ Lobby ระหว่างหน้าจบบทสอน (กันภาพสำรองตอนกลับ Lobby) */
    this.state='summary'; if(this.physics)this.physics.pause(); if(this.player)this.player.setVelocity(0,0);
    const w=this.W,h=this.H; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x160f21,0.92).setOrigin(0,0);
    const panel=this.add.graphics(),pw=Math.min(w-24,340),px=(w-pw)/2,py=h*0.235,ph=h*0.48;
    panel.fillStyle(0x291a35,0.96); panel.fillRoundedRect(px,py,pw,ph,20);
    panel.lineStyle(1.5,0xffd18c,0.5); panel.strokeRoundedRect(px,py,pw,ph,20);
    const glow=this.add.image(w/2,h*0.33,'vfx_glow').setTint(0xffd166).setScale(0.85).setAlpha(0.15);
    const cap=this.add.image(w/2,h*0.31,'tile___tutorial').setDisplaySize(78,78);
    const t=this.add.text(w/2,h*0.415,'Tutorial Complete!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffe1a2'}).setOrigin(0.5);
    const rlabel=this.add.text(w/2,h*0.485,rewardGranted?'STARTER REWARDS':'REWARDS ALREADY CLAIMED',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#9ce5e1'}).setOrigin(0.5);
    const cards=this.add.graphics(),items=[],gap=8,cw=(pw-32-gap)/2,cy=h*0.575;
    const rewards=[{key:'ic_sugar',name:'Sugar',amount:'+140',color:0xffd782},{key:'dig_shovel',name:'Shovels',amount:'+10',color:0xaee8df}];
    rewards.forEach((reward,i)=>{
      const x=w/2+(i?gap/2:-gap/2-cw),y=cy-35;
      cards.fillStyle(0x42304e,1);cards.fillRoundedRect(x,y,cw,70,13);
      cards.lineStyle(1,reward.color,0.55);cards.strokeRoundedRect(x,y,cw,70,13);
      const icon=this.add.image(x+30,cy,reward.key).setDisplaySize(43,43);
      const name=this.add.text(x+55,cy-13,reward.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#f6e9f8'}).setOrigin(0,0.5);
      const amount=this.add.text(x+55,cy+11,rewardGranted?reward.amount:'Claimed',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:rewardGranted?'18px':'12px',color:rewardGranted?'#ffe0a0':'#b8a9c5'}).setOrigin(0,0.5);
      items.push(icon,name,amount);
    });
    const hint=this.add.text(w/2,h*0.67,'Feed your Sugar to the Heart Seed’s Flavor Cores before your first stage',{fontFamily:'sans-serif',fontSize:'12px',color:'#e3d2e8',align:'center',wordWrap:{width:pw-32}}).setOrigin(0.5);
    // ปุ่มหลัก: ไปหน้า Flavor Weave (สอนอัพแก่น) · ปุ่มรอง: ข้ามไปเลือกด่าน
    const bw2=Math.min(w-40,270),bh2=56,byc=h*0.80;
    const btn=this.add.graphics(); btn.fillStyle(COLORS.pink,1); btn.fillRoundedRect(w/2-bw2/2,byc-bh2/2,bw2,bh2,20); btn.lineStyle(2,0xffffff,0.35); btn.strokeRoundedRect(w/2-bw2/2,byc-bh2/2,bw2,bh2,20);
    const bt=this.add.text(w/2,byc,'Upgrade Flavor Cores',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#382237'}).setOrigin(0.5);
    const sy=h*0.90, sg=this.add.graphics(); sg.fillStyle(0x2c2338,0.9); sg.fillRoundedRect(w/2-110,sy-18,220,36,12); sg.lineStyle(1.5,0x6a5b86,0.7); sg.strokeRoundedRect(w/2-110,sy-18,220,36,12);
    const stt=this.add.text(w/2,sy,'Skip to Stage Select',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#e5d8ee'}).setOrigin(0.5);
    this.over.add([bg,panel,glow,cap,t,rlabel,cards,...items,hint,btn,bt,sg,stt]); this.over.setVisible(true);
    sg.setAlpha(0);stt.setAlpha(0); this.drawSpotlight(this.over,w/2-bw2/2,byc-bh2/2,bw2,bh2,'Tap to power up!');
    this._summaryLast=false; this._summaryBtns=[{x:w/2-bw2/2,y:byc-bh2/2,w:bw2,h:bh2,fn:()=>this.openTutorialWeave()}];   // ปิดได้เฉพาะกดปุ่ม
  }
  // v6.50.6 สปอตไลต์ tutorial: มืดรอบนอก เจาะรูที่ปุ่ม + กรอบทองเต้น + นิ้วชี้
  // v7.9.75 เจ้าของ: บทสอนในเมนูมีคนสอน · Ruby พูดทีละประโยค (แตะ = ถัดไป, แตะได้หลัง .6 วิ) · ใช้ในทัวร์ Weave
  rubyGuide(lines,done,opt={}){ if(this._rubyTalk?.active)return;
    const W=this.W,H=this.H,oldZones=this.tapZones.slice(),target=oldZones.find(z=>z.tag===(opt.target||'chapter'))||oldZones.find(z=>!z.back),c=this.add.container();this.menu.add(c);this._rubyTalk=c;
    let i=0,at=Date.now(),closed=false;const tweens=[];
    c.once('destroy',()=>{tweens.forEach(t=>t.remove());if(this._rubyTalk===c)this._rubyTalk=null;});
    const close=()=>{if(closed||!c.active)return;closed=true;this.tapZones=oldZones;c.destroy();done?.();};
    const render=()=>{tweens.splice(0).forEach(t=>t.remove());c.removeAll(true);
      const r=target?{x:Math.max(8,target.x),y:Math.max(8,target.y),w:Math.min(target.w,W-16),h:Math.min(target.h,H-16)}:{x:W*.2,y:H*.25,w:W*.6,h:80},g=this.add.graphics();
      g.fillStyle(0x08050d,.7).fillRect(0,0,W,r.y).fillRect(0,r.y+r.h,W,Math.max(0,H-r.y-r.h)).fillRect(0,r.y,r.x,r.h).fillRect(r.x+r.w,r.y,Math.max(0,W-r.x-r.w),r.h);
      g.lineStyle(3,0xffd590,1).strokeRoundedRect(r.x,r.y,r.w,r.h,12);c.add(g);
      const bw=Math.min(W-24,440),bx=(W-bw)/2,tx=this.add.text(bx+18,0,lines[i],{fontFamily:'NunitoUI, sans-serif',fontSize:'14px',color:'#fff1df',wordWrap:{width:bw-36},lineSpacing:4}),bh=tx.height+86,by=r.y+r.h+bh+20<H?r.y+r.h+16:Math.max(12,r.y-bh-16);
      const bg=this.add.graphics().fillStyle(0x211725,.98).fillRoundedRect(bx,by,bw,bh,14).lineStyle(1,0xffd590,.7).strokeRoundedRect(bx,by,bw,bh,14);c.add(bg);
      if(opt.art&&this.realTex?.(opt.art)){ const aw=Math.min(W-32,420),ah=aw*512/768,ay=by-ah-8>=8?by-ah-8:Math.min(H-ah-8,by+bh+8),im=this.add.image(W/2,ay+ah/2,opt.art).setDisplaySize(aw,ah); c.add(im); }   // v8.1.108 ใบ 79: ภาพประกอบหน้าคุย (เมล็ดหัวใจกับ Flavor Cores)
      c.add(this.add.text(bx+18,by+12,'Ruby · Try it here',{fontFamily:'NunitoUI, sans-serif',fontSize:'12px',color:'#ffc0cf'}));tx.y=by+34;c.add(tx);
      c.add(this.add.text(bx+bw-18,by+bh-15,i===lines.length-1?'Got it ›':'Next ›',{fontFamily:'NunitoUI, sans-serif',fontSize:'13px',color:'#ffe0a0'}).setOrigin(1,1));
      if(c._voicePage!==i){this.voiceStop?.(c);c._voicePage=i;const page=i;if(!this.voiceLine?.('ruby',lines[i],()=>c.active&&c._voicePage===page,c))Sfx.voiceBlip?.('ruby');}c._rubyGuideLayout={target:r,body:{x:bx,y:by,w:bw,h:bh},text:tx,page:i};
      this.tapZones=[{x:bx,y:by,w:bw,h:bh,tag:'ruby_guide_next',noBounce:true,fn:()=>{if(Date.now()-at<400)return;at=Date.now();if(++i>=lines.length)close();else render();}}];
    };render();
  }
  /* v8.0.3 ม่านเข้าด่านแบบเปิดหนัง: ชื่อค่อย ๆ ลอยขึ้น + คำโปรย (ครั้งแรกเต็ม ~5 วิ · เล่นซ้ำสั้นลง) · แตะเพื่อข้าม */
  rubyEntryCurtain(idx){this.tapZones=[];this._rubyEntry?.destroy();const c=this.add.container(0,0).setDepth(10000);this.camUI(c);this._rubyEntry=c;
    c.add(this.add.rectangle(0,0,this.W,this.H,0x09070c,1).setOrigin(0));
    const st=STAGES[idx]||{},first=!(Save.data?.stageMastery||{})[idx],tag=typeof STAGE_TAGLINES!=='undefined'?STAGE_TAGLINES[idx]:'';
    const ct=this.cineTitle?this.cineTitle(c,{kicker:'CHAPTER '+((st.chapter||0)+1)+' · STAGE '+(st.chapterStage||idx+1),title:st.name||'Into the pantry',tag,speed:first?1:.55},t=>(c._tw||(c._tw=[])).push(t)):null;
    c._t0=Date.now(); c._need=ct?ct.dur+(first?700:250):0; c._ct=ct;
    this.rubyEntryAudio?.(c,idx,first);
    c.once('destroy',()=>{(c._tw||[]).forEach(t=>t.remove?.());if(this._rubyEntry===c)this._rubyEntry=null;});
  }
  /* v8.2.84 A20: ม่านเข้าด่านมีเสียง · ม่านขึ้น → สติงเกอร์ตามบท (ด่านบอส 5/10/15 = boss) · ครั้งแรก = เท้าวิ่ง + Ruby แนะนำด่าน · เล่นซ้ำ 50% = ประโยคสั้น · ไม่มีไฟล์ = เงียบ */
  rubyEntryAudio(c,idx,first){ if(typeof Sfx==='undefined')return; try{ const miss=Object.keys(ASSET_AUDIO).filter(k=>k.startsWith('sfx_a20_')&&!this.cache.audio.exists(k)); if(miss.length&&this.load?.audio){ miss.forEach(k=>this.load.audio(k,verUrl(ASSET_AUDIO[k]))); if(!this.load.isLoading())this.load.start(); } }catch(e){} const ok=()=>this._rubyEntry===c&&c.active,st=STAGES[idx]||{},boss=idx%5===4,ti=boss?'a20_title_boss':'a20_title_ch'+Math.min(3,(st.chapter||0)+1);
    Sfx.orderCue?.('a20_curtain_in',.45,.3); this.time?.delayedCall?.(320,()=>{ if(ok())Sfx.orderCue?.(ti,.5,.3); });
    const vo=first?'vo_ruby_go_'+String(idx+1).padStart(2,'0'):(Math.random()<.5?'vo_ruby_go_again_'+(1+Math.floor(Math.random()*4)):null);
    if(first)this.time?.delayedCall?.(150,()=>{ if(ok())Sfx.orderCue?.('a20_steps',.35,.3); });
    if(vo&&typeof VoiceActing!=='undefined'&&A07_CATALOG[vo]&&!Save.data?.settings?.noRuby)this.time?.delayedCall?.(first?650:380,()=>{ if(ok())VoiceActing.play?.(this,vo,ok); }); }
  rubyEnterStage(done){const c=this._rubyEntry;if(!c?.active){done();return;}let ended=false;
    const finish=()=>{if(ended||!c.active)return;ended=true;c._skip=null;c.destroy();done();if(this.hubMotionAllowed())this.cameras.main.fadeIn(650,9,7,12);};
    if(!this.hubMotionAllowed()){finish();return;}
    let leaving=false;const leave=ms=>{if(leaving)return;leaving=true;try{Sfx.orderCue?.('a20_curtain_out',.45,.3);}catch(e){}if(c._ct)c._ct.out(ms,finish);else finish();};   /* v8.2.84 A20 */
    c._skip=()=>leave(300);
    const wait=Math.max(0,(c._t0||0)+(c._need||0)-Date.now());this.tweens.add({targets:{v:0},v:1,duration:Math.max(1,wait),onComplete:()=>leave(1000)});
  }
  rubyClearStory(last){const d=Save.data,idx=this.stageIndex;
    if(this.recipeMode||this.riftMode||this.bossRush||this._inTutorial||![0,4].includes(idx)||d.settings?.noRuby||d.rubyMemories?.[idx])return false;
    this.physics.pause();this.player?.setVelocity(0,0);this.over.setVisible(false);this.state='menu';this.menu.setVisible(true);
    this.rubyTalk([],()=>{(d.rubyMemories||(d.rubyMemories={}))[idx]=1;Save.save();this.menu.setVisible(false);this.state='epilogue';this.showStageSummary(last);},{memory:idx===0?'ruby_memory_grandma':'ruby_memory_jar',bridge:(idx===0?'The freed ants point to the poisoned drains. ':'The cut root slithers away, down toward the garden. ')+(STAGE_EPILOGUE[idx]?.why||'')});return true;
  }
  rubyTalk(lines,done,opt={}){ if(this._rubyTalk?.active)return;
    if(!opt.memory&&!opt.pages?.some(p=>p.art))return this.rubyGuide(lines,done,opt);
    if(opt.memory&&!opt.pages){const jar=opt.memory==='ruby_memory_jar',pages=jar?[
      {art:'ruby_comic_s2_2',text:'Grandma’s jar slipped through the pantry floor just before the Hunger caught her.',mood:'sad'},
      {art:'ruby_comic_s2_3',text:'The root we cut was only one of many. It slid down toward the garden to grow a new body.',mood:'sad'},
      {art:'ruby_comic_s5_3',text:'Grandma’s flavor is still inside the Crown. Let’s follow the roots and find it!',mood:'normal'}
    ]:[
      {art:'ruby_comic_s2_1',text:'Grandma was the royal head cook. From her very last jar of ruby jam, she made me.',mood:'happy'},
      {art:'ruby_comic_s1_2',text:'She gave me her recipe book and a sleeping seed. “Wait for the one brave enough,” she said.',mood:'normal'},
      {art:'ruby_comic_s1_3',text:'I can’t fight, and I can’t use the seed. But I can guide you. Let’s bring everyone home.',mood:'happy'}
    ];if(opt.bridge)pages.push({art:pages.at(-1).art,text:opt.bridge,mood:'normal'});opt={...opt,pages};lines=pages.map(p=>p.text);}
    const W=this.W,H=this.H,c=this.add.container(0,0);this.menu.add(c);c._menuBackdrop=true;let i=0,at=Date.now(),finished=false,revealTweens=[],lastCue=-1;
    const clearReveal=()=>{for(const tw of revealTweens)tw.remove();revealTweens=[];};
    this._rubyTalk=c;c.once('destroy',()=>{this.voiceStop?.(c);clearReveal();if(this._rubyTalk===c)this._rubyTalk=null;});
    // Opaque foundation keeps the Lobby and navigation out of every narration page.
    const backdrop=this.add.rectangle(0,0,W,H,0x09070c,1).setOrigin(0);c.add(backdrop);
    const page=this.add.container();c.add(page);const margin=Math.max(16,Math.min(32,W*.05)),bw=Math.min(W-2*margin,560),bx=(W-bw)/2,land=W>H;
    const footerY=H-60,headY=Math.max(22,Math.min(38,H*.045)),hasArt=!!(opt.memory||opt.pages?.some(p=>p.art)),comic=opt.pages?.length>=2&&opt.pages.every(p=>p.art);
    const finish=()=>{if(finished||!c.active)return;finished=true;this.tapZones=this.tapZones.filter(z=>!z._rubyPage);c.destroy();done?.();};
    const render=()=>{if(!c.active)return;clearReveal();page.removeAll(true);
      const paper=false; // Black theatrical canvas: each painted shot supplies its own atmosphere.
      const ink=paper?'#462d29':'#fff1df',muted=paper?'#8c6244':'#d3b28e',entry=opt.pages?.[i],artKey=entry?.art||opt.memory;
      if(artKey&&this.realTex(artKey)){const atmosphere=this.add.container(),scene=this._coverImage(0,0,W,H,artKey);scene.setAlpha(.18);atmosphere.add(scene);page.add(atmosphere);
        if(this.hubMotionAllowed())revealTweens.push(this.tweens.add({targets:scene,alpha:.28,duration:2600,ease:'Sine.out'}));
        page.add(this.add.rectangle(0,0,W,headY+66,0x09070c,.86).setOrigin(0));
      }
      const text=(x,y,t,size,color=ink,wrap=bw)=>{const o=this.add.text(x,y,t,{fontFamily:'NunitoUI, sans-serif',fontSize:size+'px',fontStyle:'bold',color,wordWrap:{width:wrap,useAdvancedWrap:true},lineSpacing:4}).setOrigin(.5,0);page.add(o);return o;};
      text(land?W*.265:W/2,headY,opt.memory?'A MEMORY RETURNS':'MOCHITOPIA · RUBY’S STORY',10,muted);
      const title=text(land?W*.265:W/2,headY+24,opt.title||(opt.memory?'A memory returns':'A word from Ruby'),land?20:Math.min(25,W*.064));
      const rowH=land?H-96:Math.min(190,Math.max(168,H*.24)),rowY=land?78:footerY-20-rowH,artTop=headY+24+title.height+18;
      const bodyX=land?W*.56:bx,bodyW=land?W*.40:bw,bodyY=rowY,bodyH=land?H-148:rowH;
      const panels=[];
      if(hasArt){const maxW=land?W*.46:bw,maxH=land?footerY-artTop-16:rowY-artTop-16,artCx=land?W*.265:W/2,artCy=artTop+maxH/2;
        if(comic){const gap=10,count=opt.pages.length,gw=Math.max(1,Math.min(maxW,(maxH-gap)/(0.5+0.5/count))),thumbW=(gw-gap*(count-1))/count,gh=gw/2+gap+thumbW/2,left=artCx-gw/2,top=artCy-gh/2;
          // The active shot becomes the camera's focus; past shots stay in the memory strip.
          for(let j=0;j<=i;j++){const active=j===i,x=active?left:left+j*(thumbW+gap),y=active?top:top+gw/2+gap,pw=active?gw:thumbW,ph=pw/2,key=opt.pages[j].art,frame=this.add.container(x,y),border=this.add.graphics();border.fillStyle(0x18131c,1).fillRect(0,0,pw,ph).lineStyle(active?2:1,active?0xffd590:0x69546a,1).strokeRect(0,0,pw,ph);frame.add(border);page.add(frame);let im=null;
            if(this.realTex(key)){im=this.add.image(pw/2,ph/2,key);im.setScale(Math.min((pw-6)/im.width,(ph-6)/im.height));frame.add(im);}
            if(active&&im&&lastCue!==i&&this.hubMotionAllowed()){
              frame.setAlpha(0);frame.y+=10;revealTweens.push(this.tweens.add({targets:frame,alpha:1,y,duration:520,ease:'Cubic.out'}));
              const scale=im.scaleX;im.setScale(scale*.94);revealTweens.push(this.tweens.add({targets:im,scaleX:scale,scaleY:scale,duration:3000,ease:'Sine.out'}));
              // Bounded, scene-specific atmosphere: ice falls; furnace embers rise; memories glow.
              const cold=key.includes('_s4_'),fire=key.includes('_s3_')||key.includes('_s5_'),color=cold?0xc9f2ff:fire?0xffb46a:0xffe5af;
              for(let n=0;n<12;n++){const px=8+(pw-16)*((n*.618)%1),py=8+(ph-16)*((n*.381)%1),dot=this.add.circle(px,py,cold?1.7:1.2,color,.6);frame.add(dot);revealTweens.push(this.tweens.add({targets:dot,y:Math.max(6,Math.min(ph-6,py+(cold?16:-16))),alpha:.1,duration:1500+n*70,yoyo:true,repeat:-1,ease:'Sine.inOut'}));}
            }
            panels.push({index:j,key,frame,image:im,rect:{x,y,w:pw,h:ph},active});
          }
          if(panels[i]?.image)lastCue=i;
        }else if(artKey&&this.realTex(artKey)){const im=this.add.image(artCx,artCy,artKey),k=Math.min(maxW/im.width,maxH/im.height);im.setScale(k);page.add(im);}
        else text(artCx,artCy-12,'Opening the illustration…',12,muted,maxW-12);
      }
      const box=this.add.graphics();box.fillStyle(paper?0xfffcf2:0x201923,paper ? .70 : .96).fillRoundedRect(bodyX,bodyY,bodyW,bodyH,14).lineStyle(1,paper?0xc7a77a:0x886b55,.7).strokeRoundedRect(bodyX,bodyY,bodyW,bodyH,14);page.add(box);
      const portraitKey='ruby_talk_'+({sad:'worried',alert:'worried',happy:'proud',normal:'normal'}[entry?.mood]||(opt.memory?'worried':i===lines.length-1?'proud':i?'explain':'normal'));
      let av;if(this.realTex(portraitKey)){av=this.add.image(0,0,portraitKey);this.hubIconFit(av,portraitKey,bodyX+52,bodyY+bodyH*.58,86);}
      else av=this.rubyAvatar(bodyX+5,bodyY+bodyH-22,86,opt.memory?'sad':'normal');if(av)page.add(av);
      const txLeft=bodyX+108,txWidth=bodyW-124;const name=text(txLeft,bodyY+16,'Ruby',13,paper?'#a23c50':'#ffb1c4',txWidth).setOrigin(0,0);
      const tx=text(txLeft,bodyY+42,lines[i],land?14:15,ink,txWidth).setOrigin(0,0);let fs=land?14:15;while(tx.height>bodyH-56&&fs>12)tx.setFontSize(--fs+'px');
      if(this.hubMotionAllowed()){tx.setAlpha(0);revealTweens.push(this.tweens.add({targets:tx,alpha:1,delay:140,duration:380}));if(av){av.setAlpha(0);revealTweens.push(this.tweens.add({targets:av,alpha:1,duration:360}));}}
      const controls=this.add.graphics();controls.fillStyle(paper?0xe8d2a7:0x302431,1).fillRoundedRect(bx,footerY,bw,44,12);page.add(controls);
      text(bx+40,footerY+13,'‹ Back',12,i?ink:muted,70).setAlpha(i?1:.4);
      text(W/2,footerY+14,(i+1)+' / '+lines.length,11,muted,60);
      text(bx+bw-48,footerY+13,i<lines.length-1?(comic?'Follow ›':'Next ›'):(opt.storybook?'Enter stage ›':'Continue ›'),12,ink,96);
      text(W-margin-22,headY,'Skip',11,muted,44);
      if(c._voicePage!==i){this.voiceStop?.(c);c._voicePage=i;const page=i;if(!this.voiceLine?.('ruby',lines[i],()=>c.active&&c._voicePage===page,c))Sfx.voice?.('ruby_'+({normal:'happy',alert:'alert',sad:'sad',happy:'happy',cheer:'cheer'}[entry?.mood]||'happy'),.2);}c._rubyLayout={body:{x:bodyX,y:bodyY,w:bodyW,h:bodyH},text:tx,portrait:av,page:i,art:artKey,paper,panels,comic};
    };
    const advance=()=>{if(Date.now()-at<600)return;at=Date.now();Sfx.ev?.('story_advance',.4,.05);if(++i>=lines.length)finish();else render();};
    this.tapZones=[];const zone=(x,y,w,h,fn,tag)=>{this._zone(x,y,w,h,fn);const z=this.tapZones[this.tapZones.length-1];z.noBounce=true;z._rubyPage=true;z.tag=tag;};
    zone(0,headY+36,W,Math.max(1,footerY-headY-36),advance,'ruby_talk');
    zone(bx,footerY,86,44,()=>{if(!i||Date.now()-at<600)return;i--;at=Date.now();render();},'ruby_previous');
    zone(bx+bw-108,footerY,108,44,advance,'ruby_next');
    zone(W-margin-44,headY-12,44,44,()=>{if(Date.now()-at>=600)finish();},'ruby_skip');
    Sfx.ev?.('story_panel_open',.45,.1);render();const keys=new Set([...RUBY_MENU_KEYS,...(opt.pages||[]).map(p=>p.art),opt.memory].filter(Boolean));if([...keys].some(k=>!this.realTex(k)))this.ensureGroup(k=>keys.has(k),render,{all:true,quiet:true});
  }
  drawSpotlight(cont,x,y,bw,bh,label){ this._spotBuild=true; const W=this.W,H=this.H,p=8,X=x-p,Y=y-p,R=bw+p*2,B=bh+p*2,g=this.add.graphics(); g.fillStyle(0x000000,0.74);
    g.fillRect(0,0,W,Y); g.fillRect(0,Y+B,W,H-Y-B); g.fillRect(0,Y,X,B); g.fillRect(X+R,Y,W-X-R,B);
    const fr=this.add.graphics(); fr.lineStyle(4,0xffd166,1); fr.strokeRoundedRect(X,Y,R,B,14); this.tweens.add({targets:fr,alpha:{from:1,to:0.35},yoyo:true,repeat:-1,duration:520});
    const below=Y+B+60<H, hy=below?Y+B+26:Y-26, hand=this.add.text(x+bw/2,hy,below?'👆':'👇',{fontSize:'34px'}).setOrigin(0.5); this.tweens.add({targets:hand,y:hy+(below?-10:10),yoyo:true,repeat:-1,duration:420,ease:'Sine.inOut'});
    const lt=this.add.text(W/2,below?hy+34:hy-38,label||'Tap here!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffe08a',stroke:'#1a0f1e',strokeThickness:5,align:'center',wordWrap:{width:W-40}}).setOrigin(0.5);
    cont.add([g,fr,hand,lt]); return {x,y,w:bw,h:bh}; }
  drawCoachBubble(step){ if(this._coachUI)this._coachUI.destroy(); const w=this.W,h=this.H; const cont=this.add.container(0,0).setScrollFactor(1).setDepth(60); this.camUI(cont);
    // v7.9.36 การ์ดคำสั่งใหญ่กลางจอด้านบน (เดิมแถบเล็กล่างจอ ทับปุ่ม Dash/นิ้ว) · ขั้นที่ n/6 · หัวข้อใหญ่ + อธิบาย + เป้าหมาย
    const steps=this.coachSteps(),n=steps.indexOf(step)+1||((this._coach&&this._coach.step)+1), bw=Math.min(w-24,380),bh=112,bx=(w-bw)/2,by=Math.max(86,h*0.13), g=this.add.graphics();
    g.fillStyle(0x000000,0.35); g.fillRoundedRect(bx+3,by+5,bw,bh,18); g.fillStyle(0x2a1030,0.96); g.fillRoundedRect(bx,by,bw,bh,18); g.lineStyle(3,0xffd166,1); g.strokeRoundedRect(bx,by,bw,bh,18); cont.add(g);
    { const av=this.rubyAvatar(bx-6,by+bh/2+28,52); if(av)cont.add(av); }   // v7.9.66 Ruby สอนทั้งบท (เดิมรูปสตรอว์เบอร์รี)
    const tx=bx+70,tw=bw-82;
    cont.add(this.add.text(tx,by+10,'STEP '+n+' / '+steps.length,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffb3c8'}).setOrigin(0,0));
    if(step.say&&this._coachSaid!==step.id){this._coachSaid=step.id;this.voiceLine?.('ruby',step.say,()=>!!this._coach,this);}   // v8.1.63 พากย์ครั้งเดียวต่อขั้น (bubble วาดใหม่บ่อย)
    const title=this.add.text(tx,by+26,(step.icon?step.icon+' ':'')+step.say,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffe08a',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(0,0); if(title.width>tw)title.setScale(tw/title.width); cont.add(title);
    const sub=this.add.text(tx,by+58,step.sub||'',{fontFamily:'sans-serif',fontSize:'13px',color:'#ffffff',wordWrap:{width:tw}}).setOrigin(0,0); cont.add(sub);
    const goalStr=typeof step.goal==='function'?step.goal(this._coach):step.goal;
    this._coachGoalTxt=this.add.text(tx,by+bh-10,'🎯 '+goalStr,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#8fe8ff'}).setOrigin(0,1); cont.add(this._coachGoalTxt);
    cont.setAlpha(0); cont.y=-14; this.tweens.add({targets:cont,alpha:1,y:0,duration:240,ease:'Back.out'});
    this.tweens.add({targets:title,scale:{from:title.scale*1.08,to:title.scale},duration:520,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    this._coachUI=cont;
    this.buildCoachSpotlight(step); }
  // 🔦 สปอตไลต์ชี้จุดที่ต้องทำ (วงกลมเต้น + นิ้วชี้) — reposition ต่อเฟรมใน tickTutorialCoach
  buildCoachSpotlight(step){ if(this._coachSpot){this._coachSpot.destroy();this._coachSpot=null;}
    if(!step||!step.spot)return; const cont=this.add.container(0,0).setScrollFactor(1).setDepth(59); this.camUI(cont);
    const rArt=this.tuHas('vfx_tut_ring'); let ring; if(rArt){ this.tuFrames('vfx_tut_ring'); ring=this.add.image(0,0,'vfx_tut_ring','cell0').setDisplaySize(128,128); let rf=0; const ev=this.time.addEvent({delay:125,loop:true,callback:()=>{ if(!ring.active){ev.remove(false);return;} rf=(rf+1)%6; ring.setFrame('cell'+rf); }}); } else ring=this.add.circle(0,0,44,0xffe08a,0).setStrokeStyle(5,0xffe08a,1); /* ใบ 38 วงไอซิ่งหมุน */ const finger=this.textures.exists('tut_finger')?this.add.image(0,0,'tut_finger').setOrigin(.297,.016).setDisplaySize(56,56):this.add.text(0,0,'👆',{fontSize:'34px'}).setOrigin(0.5,0);   // ใบ 38
    const lab=this.add.text(0,0,step.label||'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#1a0f1e',backgroundColor:'#ffe08a',padding:{x:10,y:4}}).setOrigin(1,0.5).setVisible(!!step.label);
    /* v8.1.141 owner (🐞 feedback): Dash/Unique steps = spotlight (screen dims around the button) · enemy/heal = pointing finger only, no moving ring · sweets = glow on the nearest drop */
    const shade=(step.spot==='dash'||step.spot==='unique')?[0,1,2,3].map(()=>this.add.rectangle(0,0,1,1,0x07040c,.62).setOrigin(0)):null; if(shade)cont.add(shade); this._coachShade=shade;
    if(step.spot==='enemy'||step.spot==='heal')ring.setVisible(false);
    const glow=step.spot==='orb'?this.add.circle(0,0,30,0xfff3a0,.28).setStrokeStyle(3,0xffffff,.9):null; if(glow){ cont.add(glow); this.tweens.add({targets:glow,scale:{from:.85,to:1.3},alpha:{from:1,to:.55},yoyo:true,repeat:-1,duration:480,ease:'Sine.inOut'}); ring.setVisible(false); } this._coachGlow=glow;
    cont.add([ring,finger,lab]); this._coachSpot=cont; this._coachSpotRing=ring; this._coachSpotFinger=finger; this._coachSpotLab=lab; this._coachSpotKind=step.spot;
    if(rArt){ const k0=ring.scale; this.tweens.add({targets:ring,scale:{from:k0*.92,to:k0*1.08},yoyo:true,repeat:-1,duration:620,ease:'Sine.inOut'}); } else this.tweens.add({targets:ring,scale:{from:0.8,to:1.25},alpha:{from:1,to:0.45},yoyo:true,repeat:-1,duration:620,ease:'Sine.inOut'});
    this.tweens.add({targets:lab,scale:{from:1,to:1.12},yoyo:true,repeat:-1,duration:420,ease:'Sine.inOut'});
    if(step.spot==='move'){ ring.setVisible(false); this._coachDrag=0; } else this.tweens.add({targets:finger,y:'+=8',yoyo:true,repeat:-1,duration:520,ease:'Sine.inOut'}); }
  coachSpotTarget(kind){ const w=this.W,h=this.H;
    if(kind==='dash')return this.dashBtn?{x:this.dashBtn.x,y:this.dashBtn.y}:{x:w-58,y:h-78};
    if(kind==='unique')return this.uniqueBtn?{x:this.uniqueBtn.x,y:this.uniqueBtn.y}:{x:w-58,y:h-78-80};
    if(kind==='card')return {x:w/2,y:h*0.52};
    if(kind==='heal'){ let t=null; this.heals?.children?.iterate?.(o=>{ if(o&&o.active&&!t)t=o; }); if(t&&this.cameras?.main){ const cam=this.cameras.main; return {x:(t.x-cam.worldView.x)*cam.zoom,y:(t.y-cam.worldView.y)*cam.zoom}; } return null; }
    if(kind==='orb'){ let t=null,bd=1e9; const P=this.player; this.orbs?.children?.iterate?.(o=>{ if(!o||!o.active||!P)return; const d=Math.hypot(o.x-P.x,o.y-P.y); if(d<bd){bd=d;t=o;} }); if(t&&this.cameras?.main){ const cam=this.cameras.main; return {x:(t.x-cam.worldView.x)*cam.zoom,y:(t.y-cam.worldView.y)*cam.zoom}; } return null; }
    if(kind==='move')return {x:w*0.28,y:h*0.64};
    if(kind==='enemy'){ const e=this.nearestEnemy?this.nearestEnemy(2000):null; if(e&&this.cameras&&this.cameras.main){ const cam=this.cameras.main; return {x:(e.x-cam.worldView.x)*cam.zoom,y:(e.y-cam.worldView.y)*cam.zoom}; } return {x:w/2,y:h*0.4}; }
    return null; }
  /* v8.1.72 เจ้าของ: บทสอน Ruby — ปุ่ม Dash ยังไม่ขึ้นจนถึงบท Dash · ปุ่ม Unique ยังไม่ขึ้นจนถึงบท Unique */
  coachControls(){ const c=this._coach,ids=this.coachSteps().map(s=>s.id),cur=c?c.step:1e9,hd=!!c&&cur<ids.indexOf('dash'),hu=!!c&&cur<ids.indexOf('unique'),H=this._coachHid||(this._coachHid={d:false,u:false});
    const set=(list,v)=>list.forEach(o=>{ if(o&&o.setVisible)o.setVisible(v); });
    if(hd){ set([this.dashBtn,this.dashTxt,this.dashRing],false); H.d=true; } else if(H.d){ H.d=false; set([this.dashBtn,this.dashTxt,this.dashRing],true); }
    if(hu){ set([this.uniqueBtn,this.uniqueTxt,this.uniqueRing,this.uniqueHint,this.flickerBtn,this.flickerTxt],false); H.u=true; } else if(H.u){ H.u=false; set([this.uniqueBtn,this.uniqueTxt,this.uniqueRing],true); this.refreshUniqueSkillUI?.(); this.refreshFlickerUI?.(); }
    this.drawCombatControlBase?.(); return {dash:!hd,unique:!hu}; }
  tickTutorialCoach(dt){ const c=this._coach; if(!c||this.state!=='play')return; this.coachControls(); const steps=this.coachSteps(),step=steps[c.step]; if(!step)return; c.t+=dt;
    if(this._coachGoalTxt&&typeof step.goal==='function')this._coachGoalTxt.setText('🎯 '+step.goal(c));
    if(this._coachSpot&&this._coachSpotKind){ const p=this.coachSpotTarget(this._coachSpotKind); if(p){ this._coachSpot.setVisible(true); this._coachSpotRing.setPosition(p.x,p.y); if(this._coachGlow)this._coachGlow.setPosition(p.x,p.y); if(this._coachShade){ const r=50,W=this.W,H=this.H,x0=Math.max(0,p.x-r),y0=Math.max(0,p.y-r),x1=Math.min(W,p.x+r),y1=Math.min(H,p.y+r),S=this._coachShade; S[0].setPosition(0,0).setSize(W,y0); S[1].setPosition(0,y1).setSize(W,H-y1); S[2].setPosition(0,y0).setSize(x0,y1-y0); S[3].setPosition(x1,y0).setSize(W-x1,y1-y0); } if(this._coachSpotKind==='move'){ this._coachDrag=((this._coachDrag||0)+dt*0.6)%1; const k=Math.sin(this._coachDrag*Math.PI*2); this._coachSpotFinger.setPosition(this.W/2+k*this.W*0.22,this.H*0.62).setAlpha(0.95); } else this._coachSpotFinger.setPosition(p.x,p.y+22); if(this._coachSpotLab)this._coachSpotLab.setPosition(p.x-52,p.y); } else this._coachSpot.setVisible(false); }
    if(this.player&&c.lx!=null){ c.trav=(c.trav||0)+this.dist(this.player.x,this.player.y,c.lx,c.ly); c.lx=this.player.x; c.ly=this.player.y; }
    if(step.tap){ if(this.input.activePointer&&this.input.activePointer.isDown&&c.t>0.4)this._coachNext(); return; }
    if((step.check&&step.check(c))||(step.timeout&&c.t>=step.timeout)){ if(!c.done){c.done=true; if(this._coachGoalTxt)this._coachGoalTxt.setText('✅ Done!'); this.showBanner&&this.showBanner('✅ Great job!','',1300); this.tutGreatFx?.(); Sfx.select&&Sfx.select(); const adv=()=>{ if(this._coach!==c)return; if(this.state!=='play'){this.time.delayedCall(300,adv);return;} this._coachNext(); }; this.time.delayedCall(1600,adv);} }   // v7.9.68 รอให้ปิดการ์ดเลเวลอัพก่อน (เดิมขึ้นหน้าอธิบายทับการ์ด → การ์ดค้างแตะไม่ได้)
  }
  openStartingSkillChoice(){ this.state='startskill';this.physics.pause();this.lvlUp.setVisible(false);this.time.delayedCall(0,()=>this.launchStageLoadout()); }   // v7.8.93 หน้าเลือกสกิลเริ่มต้นยุคเก่าตัดแล้ว
  pickStartingSkillAt(px,py){
    const c=(this.startSkillCards||[]).find(z=>px>=z.left&&px<=z.right&&py>=z.top&&py<=z.bottom);if(!c)return;Sfx.select();this.skills[c.key]=1;if(c.key==='star')this.rebuildRing();this.lvlUp.setVisible(false);this.buildSkillBar();
    this.launchStageLoadout(c.key);
  }

  /* ---------- LEVEL UP ---------- */
  gainXp(n){
    if(this._mx)this._mx.xp+=(+n||0)*(this.player?.xpMul||1);
    if(this.player.forgeMods)forgeXp(this,n);this.xp+=n*(this.player.xpMul||1);   /* v6.99 Delve = Story XP */
    while(this.xp+1e-8>=this.xpNext){ this.xp=Math.max(0,this.xp-this.xpNext); this.level++; this.xpNext=(this.usesStoryBudget?.()||this.recipeMode)?storyXpNext(this.level):Math.round((this.stageIndex>=2&&!this.recipeMode)?this.xpNext*1.32+9:this.xpNext*1.26+6); /* v6.55.17 ด่าน 3+ ช้าลง */ /* v5.25 ช้าลงเล็กน้อย (เดิม 10 · ×1.26+4) */ this.pendingLvl=(this.pendingLvl||0)+1; if(!this._swDone&&Save.ancientHas('secondWeave')){ this._swDone=true; this.pendingLvl++; } /* v7.6 Unique อัปที่ Talent เท่านั้น (เดิม checkUniqueAutoUpgrade) */ if(this.player.forgeMods){const r=forgeState(this);r.levelUntil=(this.elapsed||0)+4;if(forgeValue(this.player,100))this.uniqueCd=Math.max(0,(this.uniqueCd||0)*(1-Math.min(.3,forgeValue(this.player,100)/100)));}this.jelly(0,3.2); this.vfxLevelUp(); this.fireRecipes('levelup'); }
    this.lvlTxt.setText('Lv '+this.level);
    if(this.pendingLvl>0 && this.state==='play' && this.mode!=='reward' && !this._bossLootOpen) (this.queueLevelUp?this.queueLevelUp():this.openLevelUp());
  }
  // v7.8.58 เจ้าของ: การ์ดเลเวลอัพไม่เด้งทันที — โชว์ LEVEL UP ก่อน LEVELUP_DELAY_MS แล้วค่อยเปิด (ไม่ซ้อนคิว)
  queueLevelUp(){ if(this._levelHoldUntil&&this.time?.now<this._levelHoldUntil){ if(!this._lvlHoldAt||Date.now()-this._lvlHoldAt>4000){ this._lvlHoldAt=Date.now(); this.time.delayedCall(this._levelHoldUntil-this.time.now+60,()=>{ this._lvlHoldAt=0; if(this.state==='play'&&this.pendingLvl>0)this.queueLevelUp(); }); } return; } if(this._inTutorial&&this._coach&&['welcome','move','attack','sweets'].includes(this.coachSteps()[this._coach.step]?.id))return;   // v7.9.68 บทสอน: เก็บเลเวลไว้จนถึงขั้นสอนการ์ด
    if(!this.time?.delayedCall||this._inTutorial){this.openLevelUp();return;} if(this._lvlQueued)return; this._lvlQueued=true;
    const p=this.player;if(p?.active)this.floatText?.(p.x,p.y-70,'LEVEL UP!',0xffe07a);
    this.time.delayedCall(LEVELUP_DELAY_MS,()=>{ this._lvlQueued=false; if(this.state==='play'&&this.pendingLvl>0&&this.mode!=='reward'&&!this._bossLootOpen)this.openLevelUp(); }); }   // v7.9.45 บอสตายแล้วไม่เปิดการ์ดซ้อนวงล้อรางวัล (ด่านจบอยู่แล้ว)
  checkUniqueAutoUpgrade(){
    let target=1;for(let lv=2;lv<=UNIQUE_MAX_LV;lv++)if(this.level>=uniqueAt[lv])target=lv;if(target<=(this.uniqueLevel||1))return;
    const u=this.uniqueInfo();this.uniqueLevel=target;this.uniqueCd=0;this.refreshUniqueSkillUI();this.showBanner('✨ Unique auto-upgraded to Lv'+target,u.name+' · '+(u.tiers||UNIQUE_TIERS[(CHARACTERS[this.character]||CHARACTERS.momo).unique])[target],1900);this._uniqueRankSfxAt=performance.now();Sfx.rewardCue?.('sfx_event_unique_rank_up',.72);this.uniqueRankNotice?.(target,u);this.playGrowthWorld?.('unlock');
  }
  openLevelUp(){
    // v6.66: Delve picks cards like Story (no auto upgrades)   // v6.24: Recipe = สแตตอัตโนมัติ + Sugar Rush · ทุก 5 เลเวล = Draft การ์ดเปลี่ยนวิธีเล่น
    Sfx.eventLoopStop?.();const _wasLvl=this.state==='levelup'; this.state='levelup'; this.physics.pause();
    const _sndForced=!!this._forcedOpts;   // v7.2 sound picked after the final choices are known (guaranteed Relic levels build their offer below)
    const w=this.W,h=this.H; if(this._cardHi){this.tweens.killTweensOf(this._cardHi);} this.lvlUp.removeAll(true); this._cardHi=null; this.lvlCards=[];
    const bg=this.add.rectangle(0,0,w,h,0x1c1326,0.94).setOrigin(0,0);   /* v8.1.143 code instead of lvl_screen_veil (same flat dark veil, -2 MB GPU) · v8.1.142 darker + fade in */
    this.lvlUp.add(bg);
    const heldBot0=this.drawHeldBar(this.lvlUp, 8);
    const heldBot=heldBot0;   // (เอา recipe panel ออกแล้ว — ยกเลิกระบบ codex ปรุง)
    const t=this.add.text(w/2,heldBot+2,this._chestReward?'🎁 Treasure — tap a card twice to pick':'⭐ LEVEL UP — tap a card twice to pick',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe07a'}).setOrigin(0.5,0);this.levelChoiceHint=t;this._pendingCardConfirm=null;this.levelCardReadyAt=this.time.now+300;
    this.lvlUp.add(t);
    // 🔮 เลเวล 6 = การันตีเลือก Relic แทนการ์ดหนึ่งรอบ
    const _rlv=[6,12,18][this._relicLvN||0]; if(!this._forcedOpts&&_rlv&&!this._inTutorial&&this.cardOpen?.('relic')!==false&&(this.level||1)>=_rlv&&this.relicSlotsLeft()>0){ this._relicLvN=(this._relicLvN||0)+1; this._relicLvDone=true; const r=this.rollRelicChoices(3); if(r.length){ this._forcedOpts=r; this._relicPick=true; } }
    if(this._relicPick)t.setText((this._forcedOpts||[]).every(o=>o&&String(o.key||'').startsWith('relic_'))?'🔮 RELIC — choose 1 · tap again to confirm':'🔮 SPECIAL PICK — choose 1 · tap again to confirm');
    if(!_wasLvl&&performance.now()-(this._uniqueRankSfxAt||-9999)>1800){ const special=_sndForced||this._relicPick||this._chestReward; if(special)Sfx.ev?.('special_card_offer',.55,1); else if(performance.now()-(this._lvlSndAt||0)>1500){ this._lvlSndAt=performance.now(); Sfx.levelup();if((this.level||0)%3===0)this._voiceLevelPending=true; } else Sfx.ev?.('card_offer_open',.45,.6); }
    const opts=this._forcedOpts||this.rollUpgrades(this.usesBasicAttackBuild()?3:4); this._forcedOpts=null; this._lvlOpts=opts;
    const portrait=w<=h,cols=portrait?1:2,gap=portrait?12:10,side=portrait?14:10,startY=heldBot+33;
    const rows=Math.ceil(opts.length/cols),cardW=Math.min(portrait?190:178,(w-side*2-gap*(cols-1))/cols);
    const finalCardW=portrait?(w-side*2):cardW;
    const _nt=this.newCardIntro(opts),_nH=_nt?78:0;   // v7.9.50 first time a card type shows up → short explainer under the cards
    const ch=Math.min(portrait?150:220,(h-startY-22-_nH-gap*(rows-1))/rows);   // เว้นล่าง 40px ให้ปุ่มสุ่มใหม่/ลบสกิล
    const total=finalCardW*cols+gap*(cols-1), lx=(w-total)/2;
    /* v8.1.122 เจ้าของ: Relic / Evolution ไม่ใช่การ์ด → ห้องสมบัติ (ของลอยบนแท่น) / เตาหลอม · ใช้ระบบแตะ 2 ครั้งเดิม (lvlCards + onFocus) */
    const vault=this._relicPick&&!this._chestReward&&opts.length>0&&opts.length<=3&&!this._inTutorial,forge=!vault&&opts.length===1&&opts[0]&&opts[0].evolution;
    const book=!vault&&!forge&&!this._inTutorial&&opts.length===2&&opts.every(o=>o&&o.mutation)&&this.realTex?.('book80_spread'),pcards=false&&!vault&&!forge&&opts.length===3&&opts.every(o=>o&&o.kind==='Build Path'&&this.realTex?.(pathCardKey(o.key)))&&this.realTex?.('pathcard80_back');   /* v8.1.137 ใบ 80 สมุดสูตร Mutation · การ์ด Build Path */
    if(vault&&this.drawRelicVault?.(opts,startY,t)){} else if(forge&&this.drawEvoForge?.(opts[0],startY,t)){} else if(book&&this.drawRecipeBook?.(opts,startY,t)){} else if(pcards&&this.drawPathCards?.(opts,startY,t)){} else
    opts.forEach((o,i)=>{
      const col=i%cols,row=Math.floor(i/cols),x=lx+col*(finalCardW+gap), y=startY+row*(ch+gap);
      this.drawReadableChoiceCard(this.lvlUp,o,x,y,finalCardW,ch,{index:i});
      this.lvlCards.push({left:x,right:x+finalCardW,top:y,bottom:y+ch,apply:o.apply,title:o.title,opt:o});
    });
    const pathPick=opts[0]&&(opts[0].kind==='Build Path'||opts[0].kind==='Flavor Infusion'); if(pathPick)t.setText(opts[0].kind==='Build Path'?'🛤 CHOOSE YOUR BUILD PATH · tap twice':'🍯 INFUSION — pick 1 · tap again to confirm');
    this.lvlTitleArt?.(t,this._chestReward?1:this._relicPick?2:pathPick?3:0,!_wasLvl);
    if(_nt)this.drawCardIntro(_nt,side,startY+rows*(ch+gap)+4,w-side*2,_nH-10);
    this.lvlUp.setVisible(true); if(this.tweens&&this.lvlUp.setAlpha){ this.lvlUp.setAlpha(0); this.tweens.add({targets:this.lvlUp,alpha:1,duration:280,ease:'Sine.out'}); }
  }
