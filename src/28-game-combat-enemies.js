  killEnemy(e){ if(e&&e.active&&!e.isBoss&&!e.isMini&&!e.isDummy)this.enemyDeathPop?.(e); if(e?.active&&this._v83Run)this.chapterCombatKill?.(e); if(e?.active)this.enemyAudio?.(e,'death'); const victory=!!(e.active&&e.isBoss&&!e.isDummy&&this.storyVoice?.()),victoryPose=victory?{key:e.texture.key,frame:e.frame?.name??0,sx:e.scaleX,sy:e.scaleY,ox:e.originX,oy:e.originY,flip:e.flipX}:null; if(e.active&&(e.isBoss||e.isMini)&&!e.isDummy&&!victory)this.killSlowmo?.(e.isBoss?1:.6); if(e.active)this.mxKill?.(e); if(e.active&&!victory&&e._bossInk&&(e.isBoss||e.isMini))this.bossInkGhost?.(e);if(e.active&&!victory&&!e._bossInk&&/^c3_(mini|boss)[1-5]$/.test(e.texture.key)){
      const fall=this.camWorld(this.add.sprite(e.x,e.y,e.texture.key,7).setDepth(e.depth||e.y).setScale(e.scaleX,e.scaleY));
      this.tweens.add({targets:fall,alpha:0,y:fall.y+12,duration:700,onComplete:()=>fall.destroy()});
    } if(e._bloat){ e._bloat=false; this.bloatBurst(e.x,e.y); } e._huntFlee=false; e._burnT=0;e._burnDps=0;e._sourT=0; if(e._dashTel){this.tweens.killTweensOf(e._dashTel);e._dashTel.destroy();e._dashTel=null;} if(e._memoryToken)this.resolveMemoryMark(e);const isBoss=e.isBoss,isMini=e.isMini,isElite=e.isElite,big=isBoss||isMini,wasWaveTarget=!!e._waveObjectiveTarget;
    if(e.active&&!this._inTutorial&&this.state!=='menu'){ if(isElite||isMini)(typeof DailyQ!=='undefined')&&DailyQ.tick('elite'); if(isBoss)(typeof DailyQ!=='undefined')&&DailyQ.tick('boss'); }   /* v7.5 Daily Quests (kills นับผ่าน advanceDaily) */if(this.player.forgeMods)forgeKill(this,e);this.kills++;if(e._eventCourier)this.onWaveEventCourier(e);if(this.state==='play')this.advanceDaily('kills');this.charPassiveOnKill(e);if(this._fr&&this._fr.length){this.fireRecipes('kill10');this.fireRecipes('kill25');if(isElite||isMini)this.fireRecipes('eliteKill');{const t=this.elapsed||0;this._frMk=(this._frMk||[]).filter(x=>t-x<1);this._frMk.push(t);if(this._frMk.length>=5){this._frMk=[];this.fireRecipes('multikill');}}}if(this._rel&&(this._rel.shell||this._rel.burst||this._rel.trophy||this._rel.harvest))this.relicOnKill(e);this.uqOnKill?.(e);this.yuzuOnKill?.(e);if(this.basicAttack&&this.basicAttack.mods)this.modOnKill(e);if(this.player.gearKillShell)this.gearKillShell();e._wispRaider=false;if(e._fleeing){e._fleeing=false;this.tweens.killTweensOf(e);e.setAlpha(1);}if(e._duelElite){e._duelElite=false;this.duelEliteDown();}this.replayOnKill(e);this.captureKillBonus?.(e);this.sigOnKill?.(e);if(this.waveObjective&&!big)this.objOnKill(e);if(this.recipeMode&&!big){this.recipeOnKill(e);if(this.recipeHas('splitter')&&!e._splitKid){const x0=e.x,y0=e.y;for(let k=0;k<2;k++){const c=this.spawnEnemy('fast');if(c){c.setPosition(x0+(k?18:-18),y0);c._splitKid=true;c.hp*=0.35;c.maxhp=c.hp;c.setScale((c.baseScale||c.scaleX)*0.75);}}}e._splitKid=false;if(this.recipeHas('volatile')&&Math.random()<0.35)this.spawnHazard(e.x,e.y,70,Math.max(4,Math.round((e.dmg||8)*0.8)),0xff7a3d);else if(this._amapInf&&this._amapInf.spicy&&Math.random()<0.06*this._amapInf.spicy)this.spawnHazard(e.x,e.y,60,Math.max(3,Math.round((e.dmg||8)*0.6)),0xff6b4a);}
    if(!big){this.stageKills=(this.stageKills||0)+1;if(this.killTxt)this.killTxt.setText('KOs '+this.stageKills);if(this.boss&&this.boss.active)this.applyBossRage(this.boss,true);
      // Juice: kill-streak — ฆ่าต่อเนื่องเร็ว = คอมโบไต่ขึ้น เด้งป็อป + เสียง pitch สูงขึ้นที่หมุดหมาย
      if(this.elapsed-(this._lastKillAt??-9)>1.6)this.killStreak=0;
      this.killStreak=(this.killStreak||0)+1; this._lastKillAt=this.elapsed;
      // v5.23: เจ้าของสั่งเอาป็อปคอมโบออก (นับ streak ไว้เฉย ๆ)
    }
    if(isElite||isMini){this.hitStop(45);Sfx.bigKill();}   // Juice: ฆ่าตัวใหญ่/elite = กระแทกหยุดเสี้ยววิ (บอสมีฉากตายของตัวเอง)
    // 🧪 currency ให้คนขยัน: elite = ลุ้นดWaitป · Miniboss = การันตี (เกรดตามความยาก)
    if(isMini) this.grantCurrencyReward(2+Math.floor(Math.random()*2),this.currencyTierFor(),'🧪 Miniboss Down!');
    else if(isElite && Math.random()<0.75) this.grantCurrencyReward(1,this.currencyTierFor(),null);
    // 🧪 มอนธรรมดามีโอกาสดรอป currency เป็นชิ้นในสนาม (เก็บ → สะสมในสรุปด่าน)
    else if(!big && Math.random()<0.028*(1+forgeLootValue(this,118))){ const ck=forgeCurrency(this.currencyTierFor(),this._forgeLoot); if(ck)this.spawnCurrencyDrop(e.x,e.y,ck); }
    if((isElite||isMini)&&Math.random()<forgeLootValue(this,121))this.grantCurrencyReward(1,this.currencyTierFor(),null);
    if(isBoss&&Math.random()<forgeLootValue(this,122))this.grantCurrencyReward(2,this.currencyTierFor(),null);
    if(this._forgeLoot){const r=forgeState(this);if(!isBoss&&this.player.hp<this.player.maxhp*.4&&(this.elapsed||0)>=(r.medicAt||0)&&Math.random()<forgeLootValue(this,142)){if(this.dropHeal(e.x,e.y,'elite'))r.medicAt=(this.elapsed||0)+25;}}
    if(this.usesStoryBudget?.())this.storyOnKillHealing();
    else if(this.player.lifesteal) this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.lifesteal);   // ดูดเลือด (พรสวรรค์)
    if(!this.usesStoryBudget?.()&&this.player.lifeOnKill&&(!this._lifeOnKillCd||this._lifeOnKillCd<=0)){this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.lifeOnKill*(this.player.healEffect||1));this._lifeOnKillCd=0.45;}
    if(!big){ if(!Sfx.a21?.('hit_'+this.a21Mat(e),.22,.085))Sfx.pop(); }   /* v8.2.85 A21 เสียงตีโดนตามวัสดุ */
    // Bestiary: นับจำนวนที่ฆ่าตามชนิด
    const si=Math.min(STAGES.length-1,Math.max(0,this.stageIndex||0));   // v4.62: เดิม cap 5 → บอส/มินิ C2-2..C2-5 ถูกนับเป็นของ C2-1
    const btype=this.bestiaryKey(e);
    const bSugar=Save.addKill(btype);if(bSugar&&Save.kills(btype)>1)Sfx.orderCue?.('best_tier',.3,1); if(Save.kills(btype)===1&&!this._inTutorial)(this._newSpecies||(this._newSpecies=[])).push(btype);   // v8.0.30 ชนิดใหม่ → หน้าสรุปด่าน
    if(bSugar){ this.showBanner('📖 Codex Rank Unlocked','+🍬 '+bSugar,1100); Sfx.chest&&Sfx.chest(); }
    const deathColor=big?0xffd166:(isElite?0xffb15a:(e.texture.key==='e_tank'?0x8b5cf0:0xffd166));
    if(!victory){/* v8.1.144 owner 🐞: orange dots on death looked like EXP/items → pale mochi-powder puff, flying dots only for big/elite and small */ if(big||isElite)this.burst(e.x,e.y,0xfff3e6);this.vfxDeathPoof(e.x,e.y,0xf1e6f4,big||isElite);this.mochiChunks?.(e.x,e.y,e.tintColor||(STAGE_MOOD[this.stageIndex]??0xffe3ef),big||isElite);}
    if(!big&&!e._missionDeathArt)this.playEnemyDeath(e);   // v5.78 ตัวกระเด็นหมุนออกจากผู้เล่น
    { const now=this.time.now; this._mkT=(this._mkT||[]).filter(t=>now-t<260); this._mkT.push(now); if(this._mkT.length>=6&&now-(this._mkShakeAt||0)>450){ this._mkShakeAt=now; this._mkT=[]; this.screenShake(90,0.0035); } }   // ฆ่ารวดเป็นกลุ่ม = จอสั่นเบา
    if(big&&!victory){ this.screenShake(isBoss?400:220,isBoss?0.012:0.008); this.burst(e.x,e.y,0xff9ec4); if(isMini)(Sfx.ev?.('miniboss_defeat',.65,1)||Sfx.clear()); }
    if(e._aura){ e._aura.destroy(); e._aura=null; }   // เก็บออร่าEnraged
    if(e._phaseShieldFx){this.tweens.killTweensOf(e._phaseShieldFx);if(e._phaseShieldFx.active)e._phaseShieldFx.destroy();e._phaseShieldFx=null;}
    e._phaseInvuln=0;e._phaseGateLocked=false;
    if(e._hungerOrbs){e._hungerOrbs.forEach(o=>{if(o&&o.active)o.destroy();});e._hungerOrbs=null;}
    if(e._hungerHalo){e._hungerHalo.forEach(o=>{if(o&&o.active)o.destroy();});e._hungerHalo=null;}
    if(!victory&&!e._missionDeathArt){this.stage5DeathGhost(e);this.chapter2DeathGhost(e);}
    if(isBoss&&!victory) this.bossDefeat(e.x,e.y);   // ฉากบอสตายอลังการ
    if(isBoss&&!e.isDummy&&!this.bossRush&&!this.recipeMode&&!this.riftMode&&!e.delveBoss){ this.bigFoeLoot(e.x,e.y,'boss'); }   /* v8.1.75 บอสดรอปเยอะขึ้น */
    { const wo=this.waveObjective,_fb=this.boss; if(isBoss||(!this.bossRush&&_fb&&_fb.active&&_fb.isBoss)){} else if(this.usesStoryBudget?.()||!(wo&&wo._overtime&&!wo.done&&!e.isMini&&!e.isElite)) { let xv=this.usesStoryBudget?.()&&this._storyBudget?this.storyEnemyXp(e):(e.xp||1); if(e._xpMul!=null)xv=Math.floor(xv*e._xpMul+Math.random()); if(xv>0)this.dropOrb(e.x,e.y,xv); } }   /* v8.1.144 e._xpMul: Herald gate packs give ¼ EXP (owner: standing at the gates farmed EXP) */   // v6.54.8: บอสไม่ดรอป EXP/หัวใจ (ด่านจบแล้ว ไร้ค่า) → Sugar Bounty เข้ารางวัลตรง   // v4.87.1: ภารกิจเกินเวลา = มอนธรรมดาไม่ดรอป EXP (กันปั๊มเลเวล) · ออร์บเดียวต่อศัตรู · สีบอกค่า EXP (ไม่สแปมหลายเม็ด)
    if(this.usesStoryBudget?.())this.storyFieldDrops(e);
    else if(isMini||(isElite&&Math.random()<0.18)) this.dropHeal(e.x+Phaser.Math.Between(-10,10),e.y+Phaser.Math.Between(-10,10));  // หัวใจเป็นรางวัลตัวอันตรายเท่านั้น · มอนสเตอร์ธรรมดาไม่ดWaitป
    // กล่องสูตรลับ (เลือกเอง 1 ใบ) — RNG จากการฆ่ามอนสเตอร์: elite 5% · ธรรมดา 0.6% (บอส/มินิมีกล่องของตัวเองแล้ว)
    if(!isBoss&&!isMini&&this.chests&&this.chests.countActive(true)<3){ const rate=(isElite?0.05:0.006)*(this._boxLuckMul||1)*(this.player.boxFindMul||1); if(Math.random()<rate)this.spawnChest(e.x,e.y,'pick'); }
    if(!this.usesStoryBudget?.()&&(isMini||(isElite&&Math.random()<0.08)||(!big&&Math.random()<0.005))) this.spawnVac(e.x,e.y);   // ไอเทมMagnet (สุ่มน้อย · มินิแน่นอน)
    if(isMini&&!this.bossRush)this.bigFoeLoot(e.x,e.y,'mini'); else if((isMini&&Math.random()<0.25*this.earlyLootMul()*(1+forgeLootValue(this,117)))||(isElite&&Math.random()<0.06*this.earlyLootMul()*(1+forgeLootValue(this,117))*(this.rpMul?.('eliteDrop')||1))) this.spawnLoot(e.x,e.y,isMini?2:1); // ตัวใหญ่เพิ่มโอกาส Rare/Epic · v8.1.75 มินิ = น้ำพุของ
    if(this.stageIndex===6&&e.mycoRole==='drifter')this.spawnBossObject('acid',e.x,e.y,4.2);
    if(this.stageIndex===6&&e.mycoRole==='moldSac'){const sx=e.x,sy=e.y;for(let i=0;i<2;i++)this.time.delayedCall(80+i*90,()=>{if(!this._busy())return;const child=this.spawnEnemy('sporeling');if(child)child.setPosition(sx+Phaser.Math.Between(-34,34),sy+Phaser.Math.Between(-34,34));});}
    // bomber: ระเบิดตอนตาย (เตือนสั้น ๆ ด้วยวง แล้วโดนถ้าอยู่ใกล้)
    if(e.bomber){ const bx=e.x,by=e.y, r=70;
      const ring=this.camWorld(this.add.image(bx,by,'vfx_ring').setTint(0xff7a4d).setDepth(3).setScale(0.08).setAlpha(0.85));
      this.tweens.add({targets:ring,scale:(r*2)/256,alpha:0,duration:260,onComplete:()=>ring.destroy()});
      this.burst(bx,by,0xff8b6b); Sfx.boom();
      if(this.dist(this.player.x,this.player.y,bx,by)<r) this.hurtPlayer(Math.round(12+this.stageIndex*4),0.5); }
    // เก็บ Sugar (สกุลเงินเมต้า ใช้Waitบหน้า)
    const sugRaw=(isBoss?40:isMini?18:isElite?4:1)*this.diffMul().reward*(this.player.sugarFindMul||1)*(Save.ancientHas('sugarVein')?1.2:1),sug=Math.max(1,Math.floor(sugRaw)+(Math.random()<sugRaw%1?1:0)); this.sugarStage+=sug; this.sugarRun+=sug; this.ancientTreasure(e);   // v4.93 Sugar Find (ปัดแบบสุ่ม) · ยิ่งยาก Sugar ยิ่งเยอะ
    if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);   // UpdatesเงินWaitบนี้แบบ realtime
    this.clearObjectiveTargetFx(e);if(wasWaveTarget)this.onWaveObjectiveTargetDown(e);
    if(e._dashTel){this.tweens.killTweensOf(e._dashTel);e._dashTel.destroy();e._dashTel=null;}
    if(!e.isBoss&&!e.isMini&&!e.isDummy&&!e._missionDeathArt)this.mochiPop?.(e);   // v8.1.49 เจ้าของ: มอนตายแบบโมจิ (ป่อง → แบน → หาย)
    this.stopEnemyPresentation(e);e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; e._timeStop=false; e.isBoss=false; e.isMini=false; e.isElite=false; e.shooter=false; e.bomber=false; e.acid=false; e.dasher=false; e.siege=false; e.dashState=null;e.mycoRole=null;e.nectarRole=null;e.seasonRole=null;e.rootRole=null;e._waveObjectiveTarget=false;e.bloomStacks=0;e.bloomUntil=0;e._memoryToken=null;e._memoryStored=0;e._decoyT=0;e.clearTint();e.setScale(1);
    if(isBoss){ // หน่วงเปิดกล่องรางวัลให้เห็นฉากบอสตาย (bossDefeat) ก่อน — ไม่งั้นหน้าสรุปเด้งทับทันที
      // v7.9.12 เจ้าของ: ไม่ดูดเม็ดเข้าตัวแล้ว (เก็บเอง) · onBossDown ยังนับเม็ดที่เหลือให้ตอนจบด่าน
      const bx=e.x,by=e.y,_ln=this.bossLine(1); if(_ln&&!victory){Sfx.voice?.('boss_defeat',.3);this.bossSay(_ln,STAGES[this.stageIndex]?.boss,1800,{x:bx,y:by,active:true,displayHeight:e.displayHeight});} this.mode='reward'; this.boss=null; if(this._stack?.boss)this.stackEnd?.(true); if(this.usesStoryBudget?.())this.settleStoryBudget();this.clearFoes(); this.bossUI.forEach(o=>o.setVisible(false));
      if(victory){this.queueBossVictory(victoryPose,bx,by);return;}
      this.scheduleStageEvent(_ln?2400:1600,'reward',()=>this.onBossDown(bx,by)); return; }   // Waitจนพ้นหน้าเลเวลอัพ/กล่องสุ่มก่อนเปิดหน้ารางวัล (กันทับหน้าการ์ด)
    if(e._mimic){ const t=e._mimic; e._mimic=null; this._noMimicNext=true; this._nextChestTier=t; this.spawnChest(e.x,e.y,'mini'); }
    if(isMini&&!this._inTutorial&&Math.random()<0.25){ Save.addShovels(1); this.floatText(e.x,e.y-40,'+'+(typeof SHOVEL_CRUMBS!=='undefined'?SHOVEL_CRUMBS+' 🍪':'1 ⛏️'),0xffd9a8); }   // v5.32 มินิบอส 25% +1 พลั่ว
    if(isMini){ const mt=this.miniChestTier(),mx=e.x,my=e.y,ms=this._lootTok||0; if(!this._inTutorial&&!this.bossRush)this._levelHoldUntil=(this.time?.now||0)+2900;   /* v8.1.144 owner 🐞: loot → EXP/level-up → chest, one after another (level-up and the Spin wheel used to cover the loot) */
      let tries=0; const drop=()=>{ if(this.state==='menu'||this.state==='summary'||ms!==(this._lootTok||0))return; if((this.state!=='play'||(this.pendingLvl||0)>0)&&tries++<40){ this.time.delayedCall(400,drop); return; } this._nextChestTier=mt; this.spawnChest(mx,my,'mini'); }; this.time.delayedCall(this._inTutorial||this.bossRush?0:3600,drop);this.onWaveCleared(false,true); return; }   /* v8.1.101 เจ้าของ: วงล้อ (Spin) เปิดทับ loot bomb → กล่องมินิบอสหล่นหลังของระเบิดออกและดูดเข้าตัวแล้ว (~2.3 วิ) */   // Minibossตาย = ดWaitปกล่องสกิล 1 ใบแน่นอน แล้วผ่านเวฟ
  }
  killBullet(b){ b._shotgunTrail?.destroy?.(); if(b._chargeFx){b._chargeFx.destroy();b._chargeFx=null;} b.setActive(false).setVisible(false); if(b.body){b.body.enable=false; b.body.stop();} }
  // ของสำคัญมีฮาโล+วงชีพจรให้อ่านชัด โดยไม่ดึงเข้าหาผู้เล่น เพื่อเก็บไว้ใช้ภายหลังได้
  showPickupCue(o,color,baseScale){
    if(!o)return;this.hidePickupCue(o);o._pickupColor=color;o._pickupBaseScale=baseScale||1;o._pickupEmphasis=o.dropType==='currency'?.4:o.dropType==='gear'&&o.lootTier==='common'?.45:1;
    // ปรับให้ไอเทมมี "ขนาดบนสนาม" คงที่ตาม native width (กันอาร์ต PNG ความละเอียดสูงเช่น gear_gift.png 256px โผล่ใหญ่เกินจอ)
    const nativeW=(o.width||36),target=o._pickupBaseScale*36; o.setScale(nativeW>0?target/nativeW:o._pickupBaseScale).setDepth(80000);
    o._pickupGlow=this.camWorld(this.add.image(o.x,o.y,'vfx_glow').setTint(color).setDepth(79980).setAlpha(0.32).setScale(0.30));
    o._pickupRing=this.camWorld(this.add.image(o.x,o.y,'vfx_ring').setTint(color).setDepth(79981).setAlpha(0.66).setScale(0.20));
  }
  // v6.97 ของตก (currency/gear) ดูดเข้าหาตัวเมื่ออยู่ใกล้ ~120px · ช้ากว่าเม็ด EXP
  tickLootMagnet(dt){ const p=this.player; if(!p||!this.loots||this.state!=='play')return; const R=120,R2=R*R,now=this.time?.now||0;
    this.loots.children.iterate(g=>{ if(!g||!g.active)return; if(g._holdUntil){ if(now<g._holdUntil)return; g._holdUntil=0; g._vac=true; g._mag=false; }   /* v8.1.75 ของที่ค้างไว้ → ดูดจากทุกระยะ */ const dx=p.x-g.x,dy=p.y-g.y,d2=dx*dx+dy*dy; if(d2>R2&&!g._mag&&!g._vac)return;
      if(!g._mag){ g._mag=true; this.tweens.killTweensOf(g); this.hidePickupCue(g); }
      const d=Math.sqrt(d2)||1,sp=Math.min(d,(g._vac?Math.max(620,d*2.4):(160+380*(1-Math.min(1,d/R))))*(1+forgeLootValue(this,139))*dt); g.x+=dx/d*sp; g.y+=dy/d*sp; if(g.body)g.body.reset(g.x,g.y); if(Math.abs(p.x-g.x)+Math.abs(p.y-g.y)<30)this.collectLoot(p,g); }); }   /* v8.1.105 เจ้าของ: ของถูกดูดมาแล้วติดตัวไม่เข้า → ถึงตัวแล้วเก็บเลย ไม่รอ overlap */
  hidePickupCue(o){if(!o)return;for(const k of ['_pickupGlow','_pickupRing','_dropBeam','_pickupGlint','_curIcon','_pillar','_pillarCore']){const q=o[k];if(q){this.tweens.killTweensOf(q);if(q.active)q.destroy();o[k]=null;}}}
  // ลำแสงเล็ก ๆ ชี้จุดที่ไอเทม/currency ตก (มองเห็นง่ายขึ้น)
  spawnDropBeam(o,color){ if(!o||o.dropType==='currency'||(o.dropType==='gear'&&o.lootTier==='common'))return; const beam=this.camWorld(this.add.image(o.x,o.y-2,'vfx_glow').setTint(color).setDepth((o.depth||80000)-1).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD));
    beam.setDisplaySize(12,96); o._dropBeam=beam;if(o.dropType==='gear'&&o.lootTier&&o.lootTier!=='common'&&this.textures.exists('cr_loot_glint'))o._pickupGlint=this.camWorld(this.add.image(o.x+12,o.y-24,'cr_loot_glint').setDisplaySize(16,16).setDepth(80002).setAlpha(.85));
    this.tweens.add({targets:beam,alpha:{from:0.5,to:0.16},displayWidth:10,yoyo:true,repeat:-1,duration:640,ease:'Sine.inOut'}); this.rareLootPillar?.(o,color); }
  /* v8.1.75 เจ้าของ: ลำแสงพิเศษของหายาก · Rare เส้นเล็ก · Epic สูงขึ้น · Legend เสาใหญ่ + วงพื้น + เสียง (ลบพร้อม hidePickupCue) */
  rareLootPillar(o,color){ const t=o&&o.dropType==='gear'?o.lootTier:null,L={rare:[18,180,.22],epic:[30,320,.3],legend:[44,520,.36]}[t]; if(!L||(Save.data.settings?.vfx??2)===0)return null; const [w,h,a]=L,x=o.x,y=o.y+6,dp=(o.depth||80000)-2;
    const pl=this.camWorld(this.add.rectangle(x,y,w,h,color,a).setOrigin(.5,1).setBlendMode(Phaser.BlendModes.ADD).setDepth(dp)),core=this.camWorld(this.add.rectangle(x,y,Math.max(4,w*.22),h,0xffffff,a*.75).setOrigin(.5,1).setBlendMode(Phaser.BlendModes.ADD).setDepth(dp+.5)); o._pillar=pl; o._pillarCore=core;
    pl.scaleY=0; core.scaleY=0; this.tweens.add({targets:[pl,core],scaleY:1,duration:280,ease:'Cubic.out'}); this.tweens.add({targets:pl,alpha:{from:a*.6,to:a*1.25},scaleX:{from:.85,to:1.2},yoyo:true,repeat:-1,duration:560,delay:280});
    if(t==='legend'){ for(let k=0;k<2;k++){ const r=this.camWorld(this.add.ellipse(x,y,24,9,color,.7).setBlendMode(Phaser.BlendModes.ADD).setDepth(dp)); this.tweens.add({targets:r,width:120+k*50,height:40+k*16,alpha:0,duration:700+k*160,repeat:-1,delay:k*350,onUpdate:()=>{ if(!o.active||!o._pillar)r.destroy(); }}); } Sfx.orderCue?.('mission_bonus_get',.45,.4); this.screenFlash?.(color,.06,180); }
    return pl; }
  updatePickupReadability(){
    const groups=[this.heals,this.vacs,this.loots,this.chests,this.gimmicks];
    for(const grp of groups){if(!grp)continue;grp.children.iterate(o=>{if(!o||!o.active)return;const pulse=1+Math.sin(this.elapsed*5+(o.x||0)*0.03)*0.12;
      if(o._pickupGlow)o._pickupGlow.setPosition(o.x,o.y+3).setScale(0.30*pulse).setAlpha((0.25+0.10*pulse)*(o._pickupEmphasis??1));
      if(o._pickupRing)o._pickupRing.setPosition(o.x,o.y+5).setScale(0.20+0.035*pulse).setAlpha((0.48+0.16*pulse)*(o._pickupEmphasis??1)).setRotation(this.elapsed*0.7);
      if(o._dropBeam)o._dropBeam.setPosition(o.x,o.y-40);if(o._pickupGlint)o._pickupGlint.setPosition(o.x+12,o.y-24).setAlpha(.65+.2*pulse);
      if(o._curIcon)o._curIcon.setPosition(o.x,o.y-4).setScale(pulse);
      // ฮาโลและการลอยช่วยให้อ่านออก แต่ไม่ดึงไอเทมเข้าหาตัว ผู้เล่นจึงเก็บหัวใจ/Magnetไว้ใช้ภายหลังได้
      if(o.body)o.setVelocity(0,0);
    });}
  }
  // สีออร์บตามค่า EXP: ยิ่งค่ามาก สียิ่งพรีเมียม (เขียว→ฟ้า→ม่วง→ทอง) + เม็ดใหญ่ขึ้น
  orbStyle(v){
    if(v>=50) return {tint:0xffd75e, sc:2.05, t:6};   // v7.9.26 T6 = เม็ดรวม/บอส
    if(v>=20) return {tint:0xffd75e, sc:2.05, t:5};   // ทอง = ค่าสูงสุด (บอส)
    if(v>=10) return {tint:0xb98cff, sc:1.75, t:4};  // ม่วง
    if(v>=5)  return {tint:0x7fc9ff, sc:1.55, t:3};  // ฟ้า
    if(v>=2)  return {tint:0x8be6a4, sc:1.38, t:2};   // เขียว
    return {tint:0xffffff, sc:1.22, t:1};              // ขาว/ชมพู = 1 (Normal)
  }
  /* v7.9.26 ใบ 29 Flavor Drops: รูปหยดตามระดับแทนลูกอมย้อมสี · body คงขนาดเดิม (30px×sc ในโลก) ระยะเก็บไม่เปลี่ยน · ยังไม่โหลด = candy+tint เดิม */
  xpOrbAnim(t){if(!this.textures.exists('xp_orbs'))return false;const k='xp_t'+t;if(!this.anims.exists(k))this.anims.create({key:k,frames:this.anims.generateFrameNumbers('xp_orbs',{start:(t-1)*6,end:(t-1)*6+5}),frameRate:10,repeat:-1});return true;}
  orbSkin(o,v){const st=this.orbStyle(v);o._tier=st.t;
    if(this.xpOrbAnim(st.t)){const k='xp_t'+st.t,sc=XP_ORB_PX[st.t]/.75/96;if(o.texture.key!=='xp_orbs')o.setTexture('xp_orbs',0);o.clearTint();o._xp=true;o._sc=sc;if(o.anims?.currentAnim?.key!==k)o.play({key:k,startFrame:(Math.random()*6)|0});if(o.body){const bw=30*st.sc/sc;o.body.setSize(bw,bw,true);}this.xpShadow(o);}
    else{if(o.texture.key!=='candy'){o.anims?.stop();o.setTexture('candy');if(o.body)o.body.setSize(30,30,true);}o._xp=false;o._sc=st.sc;o.setTint(st.tint);if(o._sh?.scene)o._sh.setVisible(false);}
    if(!this._xpIconArt&&this.textures.exists('xp_bar_icon')&&this.xpIcon&&this.xpIcon.type==='Text'){const t=this.xpIcon,im=this.camUI(this.add.image(t.x,t.y,'xp_bar_icon').setDisplaySize(15,15).setScrollFactor(1).setDepth(52).setVisible(t.visible)),i=this.hudList?.indexOf(t);if(i>=0)this.hudList[i]=im;this.xpIcon=im;t.destroy();this._xpIconArt=true;}
    return st;}
  /* v7.9.27 เจ้าของ: เงาใต้เม็ด (ภาพเดียวกันทุกเม็ด depth เดียวกัน = วาดรวดเดียว) · ขยับเฉพาะตอนเม็ดบิน · เม็ดหาย = ซ่อนใน orb loop */
  xpShadow(o){if(!this.textures.exists('xp_orb_shadow')){if(o._sh?.scene)o._sh.setVisible(false);return;}let s=o._sh;if(!s||!s.scene)s=o._sh=this.camWorld(this.add.image(0,0,'xp_orb_shadow').setDepth(79998));const w=XP_ORB_PX[o._tier||1]*.6;s.setDisplaySize(w,w*.5).setVisible(true);o._shDy=XP_ORB_PX[o._tier||1]*.42;s.setPosition(o.x,o.y+o._shDy);}
  xpFxOk(){const n=this.time.now;if(n-(this._xpFxT||0)>100){this._xpFxT=n;this._xpFxN=0;}return (this._xpFxN=(this._xpFxN||0)+1)<=6;}   // ≤6 ชิ้น/100ms ตอนดูดทีละเยอะ
  /* v8.1.156 CODE_VS_ART รอบ 2 ข้อ 5: หางประกายวิ่งตามเม็ด EXP (จำตำแหน่งย้อนหลัง 7 จุด · เรียวลง · สีตามระดับเม็ด) · 1 graphics ทั้งด่าน */
  xpTrailCode(o){ let g=this._xpTrG; if(!g||!g.active){ if(!this.add?.graphics)return 0; g=this._xpTrG=this.camWorld(this.add.graphics().setDepth(79999)); }
    const H=o._th||(o._th=[]); if(H.length&&Math.hypot(H[0]-o.x,H[1]-o.y)>90)H.length=0; H.unshift(o.x,o.y); if(H.length>14)H.length=14; const col=(typeof XP_TIER_COL!=='undefined'&&XP_TIER_COL[o._tier||1])||0x9fe8ff,w=Math.max(4,((typeof XP_ORB_PX!=='undefined'&&XP_ORB_PX[o._tier||1])||20)*.32); let n=0;
    for(let i=2;i<H.length;i+=2){ const k=1-i/H.length; g.lineStyle(w*k*2.2,col,.18*k).lineBetween(H[i-2],H[i-1],H[i],H[i+1]); g.lineStyle(w*k,0xffffff,.55*k).lineBetween(H[i-2],H[i-1],H[i],H[i+1]); n++; }
    if(H.length>=6&&Math.random()<.3)g.fillStyle(0xffffff,.8).fillCircle(H[4]+(Math.random()-.5)*6,H[5]+(Math.random()-.5)*6,1.6);
    return n; }
  xpTrail(o,ang){if(typeof CODE_VFX!=='undefined'&&CODE_VFX.xp)return this.xpTrailCode(o);if(!this.bpAnim('vfx_xp_trail'))return;let s=o._trail;
    if(!s){const P=this._xpTr=(this._xpTr||[]).filter(q=>q.scene);s=P.find(q=>!q._own);if(!s){if(P.length>=40)return;s=this.camWorld(this.add.sprite(0,0,'vfx_xp_trail',0).setDepth(79999));s.play('vfx_xp_trail');P.push(s);}
      s._own=o;o._trail=s;const w=Math.max(16,XP_ORB_PX[o._tier||1]*.55);s.setVisible(true).setTint(XP_TIER_COL[o._tier||1]).setDisplaySize(w,w*2);}
    const L=s.displayHeight*.45;s.setRotation(ang+Math.PI/2).setPosition(o.x-Math.cos(ang)*L,o.y-Math.sin(ang)*L);}
  xpTrailOff(o){if(o)o._th=null;const s=o&&o._trail;if(s){s._own=null;if(s.scene)s.setVisible(false);o._trail=null;}}
  dropOrb(x,y,value){ value=value||1;
    const budget=this.usesStoryBudget?.()?this._storyBudget:null;
    /* v7.9.8 เจ้าของ: EXP ห้ามหาย — เม็ดบนพื้นเยอะ (≥300) รวมเข้าเม็ดที่ใกล้สุด · pool เต็มทุกโหมดให้ EXP ทันที */
    if((this.orbs.countActive?.(true)||0)>=300){let best=null,bd=90*90;this.orbs.children.iterate(q=>{if(!q||!q.active||q._storyBudget!==budget)return;const dx=q.x-x,dy=q.y-y,d2=dx*dx+dy*dy;if(d2<bd){bd=d2;best=q;}});
      if(best){if(budget)budget.issued+=value;best.value=(best.value||1)+value;this.orbSkin(best,best.value);if(best._xp&&this.xpFxOk())this.heroFx('vfx_xp_merge',best.x,best.y,XP_ORB_PX[best._tier]*1.3,{depth:80001});return;}}
    let o=this.orbs.getFirstDead(false);
    if(!o) o=this.orbs.create(x,y,'candy'); else { o.setActive(true).setVisible(true); o.body.enable=true; o.setPosition(x,y); }
    if(!o){if(budget){budget.issued+=value;budget.paid+=value;}this.gainXp(value);return;}   // v7.9.8 pool เต็ม = ได้ EXP ทันทีทุกโหมด (เดิมเฉพาะ Story)
    if(budget)budget.issued+=value;
    o._storyBudget=budget; o.value=value; o._vac=false; this.orbSkin(o,value); o.setRotation(0).setDepth(80000);
    o.body.setAllowGravity(false); o.setScale(o._sc); this.camWorld(o);
    { const a=Math.random()*Math.PI*2,r=14+Math.random()*22; o._hop={t:0,x0:x,y0:y,x1:x+Math.cos(a)*r,y1:y+Math.sin(a)*r*.7}; }   /* v8.1.120 เจ้าของ: EXP กระเด็นเป็นโค้งออกจากมอนก่อน แล้วค่อยดูดเข้าตัว */ }
  collectOrb(player,o){ if(!o.active)return; if(this._inTutorial)this._coachOrbs=(this._coachOrbs||0)+1; const ox=o.x,oy=o.y,ov=o.value||1; o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; o.clearTint(); this.xpTrailOff(o); if(o._storyBudget)o._storyBudget.paid+=ov;Sfx.xp(); this.jelly(0.9,-0.9);
    {const t=o._tier||1;if(!o._xp||!this.xpFxOk()||!(t>=5?this.heroFx('vfx_xp_pickup_big',ox,oy,100,{depth:80001}):this.heroFx('vfx_xp_pickup',ox,oy,48,{tint:XP_TIER_COL[t],depth:80001})))this.vfxCollectSparkle(ox,oy,this.orbStyle(ov).tint);} this.gainXp(ov); this.fireRecipes('xp20'); }
  // ---- ไอเทมฟื้นฟู HP ----
  fieldDropState(){return this._fieldDrops||(this._fieldDrops={heartAt:-Infinity,magnetAt:-Infinity,hearts:0,magnets:0,magnetProgress:0});}
  healingItemPower(){return Math.max(0,this.player.healEffect??1)*(this.recipeHas?.('noheal')?0:1)*this.pactHealMul();}
  storyFieldDrops(e){
    const d=this.fieldDropState();if(e.isBoss)return;
    d.magnetProgress=Math.min(70,d.magnetProgress+(e.isMini?8:e.isElite?4:1));
    if(e.isMini||(e.isElite&&Math.random()<.18))this.dropHeal(e.x,e.y,e.isMini?'mini':'elite');
    // A post-mini magnet has no purpose because P1 already gathers earned orbs.
    if(e.isMini||d.magnets>=2||this.vacs.countActive(true)>=1||(this.elapsed||0)-d.magnetAt<50||!(d.magnetProgress>=25||(e.isElite&&d.magnetProgress>=10)))return;
    let count=0,xp=0;this.orbs.children.iterate(o=>{if(o?.active){count++;xp+=o.value||1;}});
    if((count>=6||xp>=20)&&(d.magnetProgress>=25||(e.isElite&&d.magnetProgress>=10))&&(d.magnetProgress>=70||Math.random()<(e.isElite?0.1:0.012)))this.spawnVac(e.x,e.y);
  }
  storyOnKillHealing(){
    const p=this.player,power=(this.recipeHas?.('noheal')?0:1)*this.pactHealMul();if(power<=0||p.hp>=p.maxhp)return;
    let raw=p.lifesteal||0;if(p.lifeOnKill&&!(this._lifeOnKillCd>0)){raw+=p.lifeOnKill*(p.healEffect>0?p.healEffect:1);this._lifeOnKillCd=.45;}
    if(raw<=0)return;const now=this.elapsed||0;
    if(!this._storyKillHeal||now-this._storyKillHeal.at>=1)this._storyKillHeal={at:now,sum:0};
    const w=this._storyKillHeal,amount=Math.max(0,Math.min(raw*power,p.maxhp*.03-w.sum,p.maxhp-p.hp));
    p.hp+=amount;w.sum+=amount;
  }
  dropHeal(x,y,source='crate'){ if(this._sig?.noHeal)return null;
    const story=this.usesStoryBudget?.(),d=story?this.fieldDropState():null,now=this.elapsed||0;
    if(story){if(this.healingItemPower()<=0||this.heals.countActive(true)>=2||d.hearts>=4||(source!=='mini'&&now-d.heartAt<25))return null;}
    let h=this.heals.getFirstDead(false);
    if(!h) h=this.heals.create(x,y,'heal'); else { h.setActive(true).setVisible(true); h.body.enable=true; h.setPosition(x,y); }
    if(!h)return null;
    if(d){d.heartAt=now;d.hearts++;}
    h.body.setAllowGravity(false); this.camWorld(h); this.showPickupCue(h,0xff5f97,1.35); if(this.iso)h.setDepth(Math.max(80000,h.y));
    this.tweens.add({targets:h,y:y-10,duration:560,yoyo:true,repeat:-1,ease:'Sine.inOut'});return h; }
  collectHeal(player,h){ if(!h.active)return; if(this._inTutorial)this._coachHeals=(this._coachHeals||0)+1; this.rubyOnce?.('heal');
    const power=this.healingItemPower(),p=this.player;
    const requested=Math.round((this.usesStoryBudget?.()?p.maxhp*.18:p.maxhp*.18+6)*power),amt=Math.max(0,Math.min(p.maxhp-p.hp,this.usesStoryBudget?.()?Math.min(requested,p.maxhp*.35):requested));
    this.tweens.killTweensOf(h); this.hidePickupCue(h); h.setActive(false).setVisible(false); if(h.body)h.body.enable=false;
    this.player.hp+=amt;if(this._forgeLoot){const r=forgeState(this);if(forgeLootValue(this,143)&&requested>amt)r.storedHeal=Math.min(this.player.maxhp*.2,(r.storedHeal||0)+(requested-amt)*forgeLootValue(this,143));}
    Sfx.heal(); this.jelly(0,2.2); if(amt>=0.5)this.popHeal(this.player.x,this.player.y,amt); this.fireRecipes('heal'); this.burst(h.x,h.y,0xff8fb5); this.vfxCollectSparkle(h.x,h.y,0xff8fb5);
    if(this.textures.exists('fx_heal')&&this.anims.exists('fx_heal')) this.spawnFxAnim('fx_heal',this.player.x,this.player.y,{scale:150/ASSET_FX.fx_heal.fw,depth:8,anchor:'center'}); }
  popHeal(x,y,n){ const t=this.camWorld(this.add.text(x,y-20,'+'+Math.round(n)+' HP',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#8bffb0'}).setDepth(20).setOrigin(0.5));
    this.tweens.add({targets:t,y:y-56,alpha:0,duration:700,onComplete:()=>t.destroy()}); }
  // ---- กล่อง/โหลทุบได้ (ธีมครัว) ----
  spawnCrate(){ const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*(0.25+Math.random()*0.3);
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let c=this.crates.getFirstDead(false);
    if(!c) c=this.crates.create(x,y,'crate'); else { c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    if(!c)return;
    c.body.setAllowGravity(false); c.body.setImmovable(true); c.setCircle(18,4,4); c._eventCache=false; c.hp=14+this.stageIndex*6; c.maxhp=c.hp; c.setScale(1.12).clearTint(); this.camWorld(c); if(this.iso)c.setDepth(c.y);
    this.tweens.add({targets:c,scale:{from:0.2,to:1},duration:220,ease:'Back.out'}); return c; }
  // ดาเมจใส่กล่อง (รวม flat damage) + Effect + แตก — ใช้ร่วมทั้งกระสุนและ AoE
  crateHit(c,amount){ if(!c||!c.active)return; c.hp-=amount+(this.player.flatDmg||0);
    c.setTintFill(0xffffff); this.time.delayedCall(50,()=>{ if(c.active)c.clearTint(); });
    if(c.hp<=0) this.breakCrate(c); }
  hitCrate(bullet,c){ if(!c.active||!bullet.active)return;
    this.crateHit(c,(bullet.dmg||5)*this.player.dmgMul);
    if(!bullet.pierce) this.killBullet(bullet); }
  // skills AoE (ระเบิด/ฟ้าผ่า/ออร่า ฯลฯ) ก็ต้องตีกล่องแตกได้ด้วย (แก้บั๊กบางสกิลตีกล่องไม่โดน)
  hitCratesInRadius(x,y,r,amount){ if(this.crates)this.crates.children.iterate(c=>{ if(c&&c.active&&this.dist(c.x,c.y,x,y)<r+18) this.crateHit(c,amount); });
    // แกนคำสาป (purge) โดนสกิล AoE ด้วย — ไม่งั้นตัวที่ไม่ยิงกระสุน (ทาโร่ฟ้าผ่า/มินต์แช่/โกโก้/งาดำ) ทำลายไม่ได้
    if(this.waveNodes)this.waveNodes.children.iterate(n=>{ if(n&&n.active&&n._waveObjectiveNode&&!n._coreLocked&&this.dist(n.x,n.y,x,y)<r+18){ n.hp-=amount; this.popDmg(Math.round(amount),n.x,n.y,false); this.vfxHitRing(n.x,n.y,this.waveObjective?.color||0xffd166,false); if(n.hp<=0)this.destroyWaveObjectiveNode(n); } }); }
  breakCrate(c){ const x=c.x,y=c.y; this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false;
    if(c._eventCache)this.onWaveEventCache(c);
    this.burst(x,y,0xe59a4d); Sfx.boom(); this.screenShake(90,0.004);
    this.dropOrb(x,y, 3+Phaser.Math.Between(0,this.stageIndex*2));   // ดWaitปออร์บ
    if(Math.random()<(this.usesStoryBudget?.()?0.20:0.28)) this.dropHeal(x+Phaser.Math.Between(-12,12),y+Phaser.Math.Between(-12,12));   // โอกาสดWaitปฟื้นฟู (ลดจากครึ่งนึง ให้หัวใจหายากขึ้น)
    if(Math.random()<0.08*this.earlyLootMul()) this.spawnLoot(x,y);   // v8.1.51 ลดจาก 10% ชดเชยของจากภารกิจ   // โอกาสเล็ก ๆ ได้ของสวมใส่ (low tier)
    if(Math.random()<0.04) this.spawnVac(x,y);    // โอกาสเล็ก ๆ ได้Magnet
    if(Math.random()<0.25){ this.sugarStage+=3; this.sugarRun+=3; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun); }
  }
  // ---- ไอเทมกิมมิคประจำด่าน: ไม่ถูกดูดอัตโนมัติและค้างไว้ให้วางแผนเก็บ ----
  spawnStageGimmick(){
    const def=STAGE_GIMMICKS[this.stageIndex]||STAGE_GIMMICKS[0],a=Math.random()*Math.PI*2,r=Phaser.Math.Between(150,240),x=this.player.x+Math.cos(a)*r,y=this.player.y+Math.sin(a)*r;
    let g=this.gimmicks.getFirstDead(false);if(!g)g=this.gimmicks.create(x,y,this.textures.exists(def.tex)?def.tex:'gift');else{g.setTexture(this.textures.exists(def.tex)?def.tex:'gift');g.setActive(true).setVisible(true);if(g.body)g.body.enable=true;g.setPosition(x,y);}
    if(!g)return;g.gimmickStage=this.stageIndex;g.body.setAllowGravity(false);this.camWorld(g);this.showPickupCue(g,def.color,def.tex==='bubble'?1.15:0.72);if(this.iso)g.setDepth(Math.max(80000,g.y));this.tweens.add({targets:g,y:y-12,duration:620,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    this.showBanner(def.emoji+' found '+def.name,def.desc+' · save it for key moments',1300);
  }
  collectStageGimmick(player,g){
    if(!g.active)return;const stage=g.gimmickStage==null?this.stageIndex:g.gimmickStage,def=STAGE_GIMMICKS[stage]||STAGE_GIMMICKS[0],x=g.x,y=g.y;this.tweens.killTweensOf(g);this.hidePickupCue(g);g.setActive(false).setVisible(false);if(g.body)g.body.enable=false;
    if(stage===0){this.orbs.children.iterate(o=>{if(o&&o.active&&this.dist(o.x,o.y,this.player.x,this.player.y)<520){const a=Math.atan2(this.player.y-o.y,this.player.x-o.x);o.setVelocity(Math.cos(a)*480,Math.sin(a)*480);o._vac=true;}});}
    else if(stage===1){this.moveSlowT=0;this.player.iframe=Math.max(this.player.iframe,2.2);const amt=Math.round(this.player.maxhp*0.12);this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);this.popHeal(this.player.x,this.player.y,amt);}
    else if(stage===2){for(const k in this.skillCd)this.skillCd[k]=0;this.uniqueCd=0;this.pathHasteT=Math.max(this.pathHasteT||0,5);}
    else if(stage===3){this.enemies.children.iterate(e=>{if(e&&e.active)e.frozen=Math.max(e.frozen||0,e.isBoss?0.8:2.8);});}
    else if(stage===5){this.moveSlowT=0;for(const k in this.skillCd)this.skillCd[k]=Math.min(this.skillCd[k],0.25);this.uniqueCd=Math.min(this.uniqueCd||0,1);this.pathHasteT=Math.max(this.pathHasteT||0,4);const amt=Math.round(this.player.maxhp*0.16);this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);this.popHeal(this.player.x,this.player.y,amt);}
    else{const amt=Math.round(this.player.maxhp*0.2);this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);this.sugarStage+=12;this.sugarRun+=12;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);this.popHeal(this.player.x,this.player.y,amt);}
    this.burst(x,y,def.color);this.vfxCollectSparkle(x,y,def.color);this.showBanner(def.emoji+' '+def.name,def.desc,1250);Sfx.clear();
  }

  // ---- ไอเทมMagnet (vacuum): เก็บแล้วดูดออร์บ EXP ทั้งจอเข้าตัวทันที ----
  spawnVac(x,y){
    const story=this.usesStoryBudget?.(),d=story?this.fieldDropState():null,now=this.elapsed||0;
    if(story&&(this.vacs.countActive(true)>=1||d.magnets>=2||now-d.magnetAt<50))return null;
    let v=this.vacs.getFirstDead(false);
    if(!v) v=this.vacs.create(x,y,'vac'); else { v.setActive(true).setVisible(true); v.body.enable=true; v.setPosition(x,y); }
    if(!v)return null;
    if(d){d.magnetAt=now;d.magnets++;d.magnetProgress=0;}
    v.body.setAllowGravity(false); this.camWorld(v); this.showPickupCue(v,0xff5a6e,1.40); if(this.iso)v.setDepth(Math.max(80000,v.y));
    this.tweens.add({targets:v,y:y-10,duration:540,yoyo:true,repeat:-1,ease:'Sine.inOut'});return v; }
  collectVac(player,v){ if(!v.active)return; this.rubyOnce?.('magnet');Sfx.magnet(); this.tweens.killTweensOf(v); this.hidePickupCue(v); v.setActive(false).setVisible(false); if(v.body)v.body.enable=false;
    this.burst(v.x,v.y,0xff5a6e); this.floatText(v.x,v.y-24,'Magnet!',0xff9dcc);
    this.orbs.children.iterate(o=>{ if(o&&o.active){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x); o.setVelocity(Math.cos(ang)*520,Math.sin(ang)*520); o._vac=true; } });
  }
  // ---- ของสวมใส่ดWaitป: rarity ตามStage ความยาก และชนิดศัตรู ----
  earlyLootMul(){ return !this.recipeMode&&(this.stageIndex||0)<5?.25:1; }   /* v8.0.19 เจ้าของ: .45 → .25 ให้ได้ของหลัก ๆ จาก Bazaar */   // v7.9.94 เจ้าของ: Chapter 1 ได้ของสวมใส่เยอะเกิน → ดรอปน้อยลง
  spawnLoot(x,y,boost=0){ let g=this.loots.getFirstDead(false);
    const box='gift';   // ไอเทมปิดกล่องจนจบด่าน ใช้ภาพกล่องของขวัญจริง
    if(!g) g=this.loots.create(x,y,box); else { g.setActive(true).setVisible(true); g.body.enable=true; g.setPosition(x,y); } if(g){ g._mag=false; g._holdUntil=0; g._vac=false; }
    if(!g)return;g.setTexture(box);g.dropType='gear';g.curKey=null;g.lootTier=rollFieldGearTier(this.stageIndex,this.stageDiff||1,boost+(this.endgameDropActive()?1:0)+(Math.random()<(this.rpAdd?.('lootUp')||0)?1:0));if(this._lootMinRare&&g.lootTier==='common')g.lootTier='rare';const rarity=FIELD_DROP_TABLE[g.lootTier]||FIELD_DROP_TABLE.common;
    g.forgeExtra=Math.random()<forgeLootValue(this,119);g.body.setAllowGravity(false);g.clearTint();g.setAlpha(1);this.camWorld(g);this.showPickupCue(g,rarity.color,1.4);this.spawnDropBeam(g,rarity.color); if(this.iso)g.setDepth(Math.max(80000,g.y));
    this.lootPopIn?.(g,y); return g; }
  // 🧪 Currency ดรอปเป็นชิ้นในสนาม (เก็บ = สะสมเข้า _runCurrency + Save · โชว์ในสรุปด่าน)
  spawnCurrencyDrop(x,y,key){ let g=this.loots.getFirstDead(false);
    if(!g) g=this.loots.create(x,y,'gift'); else { g.setActive(true).setVisible(true); g.body.enable=true; g.setPosition(x,y); }
    if(!g)return;g._mag=false;g._holdUntil=0;g._vac=false;g.dropType='currency';g.curKey=key;g.forgeExtra=false;g.forgeQuantity=1+(Math.random()<forgeLootValue(this,120)?1:0);g.lootTier=null;const col=0x9fe8ff,d=currencyDef(key);
    g.setTexture(d.asset&&this.textures.exists(d.asset)?d.asset:'prize_currency').clearTint().setAlpha(1); if(d.tint&&!(d.asset&&this.textures.exists(d.asset)))g.setTint(d.tint);
    g.body.setAllowGravity(false);this.camWorld(g);this.showPickupCue(g,col,1.0);this.spawnDropBeam(g,col); if(this.iso)g.setDepth(Math.max(80000,g.y));
    this.lootPopIn?.(g,y); return g; }
  /* v8.2.10 เจ้าของ (วิจารณ์แอนิเมชัน): ของดรอปเด้งออกมาเป็นวิถีโค้ง กระดอนพื้น แล้วค่อยลอยขึ้นลงเหมือนเดิม */
  lootPopIn(g,y){ if(!g||!this.tweens)return; const sx=g.scaleX||1,sy=g.scaleY||1; this.tweens.killTweensOf(g); g.y=y-34; g.setScale(sx*.2,sy*.2);
    this.tweens.add({targets:g,scaleX:sx,scaleY:sy,duration:240,ease:'Back.out'});
    this.tweens.add({targets:g,y,duration:420,ease:'Bounce.out',onComplete:()=>{ if(g.active)this.tweens.add({targets:g,y:y-11,duration:520,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }}); }
  collectLoot(player,g){ if(!g.active||(g._holdUntil&&(this.time?.now||0)<g._holdUntil))return; g._vac=false; this.tweens.killTweensOf(g); this.hidePickupCue(g); g.setActive(false).setVisible(false); if(g.body)g.body.enable=false; g.clearTint();
    if(g.dropType==='sugar'){ const v=g.sugarVal||0; this.sugarStage+=v; this.sugarRun+=v; (Sfx.orderCue?.('pickup_sugar_piece',.3,.06,.9+Math.random()*.25)||Sfx.ev?.('pickup_currency',.4,.08)||Sfx.select()); this.burst(g.x,g.y,0xffc6df); return; }
    if(g.dropType==='currency'&&g.curKey){ const k=g.curKey,n=g.forgeQuantity||1; Save.addCurrency(k,n); if(!this._runCurrency)this._runCurrency={}; this._runCurrency[k]=(this._runCurrency[k]||0)+n;
      (Sfx.ev?.('pickup_currency',.5,.08)||Sfx.select());this.burst(g.x,g.y,0x9fe8ff); return; }
    // ไอเทม = เก็บเป็น "กล่อง" ไว้ก่อน เปิดลุ้นตอนจบด่าน (suspense)
    const tier=g.lootTier||'common',rarity=FIELD_DROP_TABLE[tier]||FIELD_DROP_TABLE.common;((tier!=='common'&&Sfx.orderCue?.('pickup_gear_rare',.5,.1))||Sfx.ev?.('pickup_gear',.5,.08)||Sfx.select());this.burst(g.x,g.y,rarity.color);
    if(!this._runBoxes)this._runBoxes=[]; this._runBoxes.push(tier);if(g.forgeExtra)this._runBoxes.push(tier);
  }
  // เปิดกล่องไอเทมที่สะสมมาทั้งด่าน → แจกจริง คืน list สำหรับหน้าสรุป
  openRunBoxes(){ const boxes=this._runBoxes||[]; const opened=[]; for(const tier of boxes){ const got=this.grantGear(tier);
      if(got){ opened.push({emoji:GEAR_SLOTS.find(s=>s.slot===got.slot).emoji, name:got.name, tier, id:got.id, ilv:got.instance&&got.instance.itemLevel}); }
      else { const refund=tier==='legend'?90:tier==='epic'?60:tier==='rare'?25:8, sh=tier==='legend'?12:tier==='epic'?6:tier==='rare'?3:1; this.sugarStage+=refund; Save.addThreads(sh); opened.push({emoji:'🍬', name:'+'+refund+' Sugar · +'+sh+' Thread', tier}); } }
    this._runBoxes=[]; return opened; }
  // สุ่ม currency ดWaitปตาม tier ของ loot (นรก/ของสูง = ได้ orb ระดับสูง)
  rollCurrencyDrop(tier){
    if(Math.random()>0.72)return null;
    return rollWeightedCurrency(tier);
  }
  // เกรด orb pool ตามความยาก+Stage (คนขยัน/เล่นยาก ได้ของดี — กฎเหล็ก)
  currencyTierFor(){ if(this.recipeMode&&this._amapNode&&!this._pinnacleRun)return delveLoot(this._amapNode.d).tier; const diff=this.stageDiff||1, st=this.stageIndex||0; if(diff>=3)return 'legend'; if(diff>=2)return st>=3?'legend':'epic'; return st>=3?'epic':'rare'; }
  // แจก currency แน่นอน N ชิ้น (ข้าม 28% miss ของ rollCurrencyDrop) + แบนเนอร์
  grantCurrencyReward(n,tier,head){
    if(n>0)n=Math.max(1,Math.round(n*(this._currencyLuckMul||1)*(this.player.currencyFindMul||1)*(this.isEndgameRun()?this.zoneModMul().reward:1)*(this.recipeMode&&this._amapNode&&!this._pinnacleRun?delveLoot(this._amapNode.d).mul:1)));   // Fortune perk
    if(n>0&&typeof FORGE_DROP_MUL==='number'){const h=n*FORGE_DROP_MUL;n=Math.floor(h)+(Math.random()<h-Math.floor(h)?1:0);}   // v8.0.33 Forge ไม่สุ่มแล้ว → ดรอปครึ่งเดียว
    const got={}; for(let i=0;i<n;i++){ const k=forgeCurrency(tier,this._forgeLoot); got[k]=(got[k]||0)+1; Save.addCurrency(k,1); }
    if(head&&this.showBanner){ const txt=Object.keys(got).map(k=>currencyDef(k).emoji+'×'+got[k]).join(' '); this.showBanner(head,txt,1800); } return got; }
  // ---- หีบสมบัติ (ดWaitปจากบอส) → เดินไปเก็บ = เปิดหน้าสุ่มสกิล ----
  spawnChest(x,y,kind){ let c=this.chests.getFirstDead(false);
    const art=kind==='pick'?'pickup_upgrade_card':'chest';
    if(!c) c=this.chests.create(x,y,art); else { c.setTexture(art);c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    if(!c)return; this.clearMimicCue(c);
    c.setTexture(art).clearTint().setAlpha(1);
    if(kind==='pick')c.body.setSize(120,154).setOffset(36,51);else c.body.setSize(c.width*0.82,c.height*0.72).setOffset(c.width*0.09,c.height*0.14);
    c.rewardKind=kind||'level';c.body.setAllowGravity(false); this.camWorld(c);
    if(kind==='mini'){ c._tier=this._nextChestTier||'bronze'; this._nextChestTier=null; c._mimic=false; c._noMimic=!!this._noMimicNext; this._noMimicNext=false;   /* v6.89.1 Mimic สุ่มในวงล้อแทน */ this.miniChestDrop(c,x,y); return; }
    this.showPickupCue(c,kind==='pick'?0xff9dc4:0xffd166,kind==='pick'?1.18:1.42); if(this.iso)c.setDepth(Math.max(80000,c.y));
    this.tweens.add({targets:c,y:y-12,duration:500,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  // v5.12: กล่องมินิบอสหล่นจากฟ้า → กระแทกพื้น (จอสั่น+ฝุ่น) → เสาแสงสีตามระดับกล่อง มองเห็นจากไกล
  // Random tier: Bronze 70%, Silver 25%, Gold 5%; independent of fight performance.
  miniChestTier(){
    this._miniFight=null;this._miniChestInfo=null;
    const roll=Math.random();return roll<0.70?'bronze':roll<0.95?'silver':'gold';
  }

  // โบนัสตามระดับ (นอกจาก Relic): silver = Sugar+currency 1 · gold = Sugar ก้อนใหญ่+currency 3
  miniChestBonus(tier){
    const si=this.stageIndex||0,dr=this.diffMul?this.diffMul().reward:1;
    if(tier==='bronze')return {sugar:0,cur:0};
    return tier==='gold'?{sugar:Math.round((80+si*25)*dr),cur:3}:{sugar:Math.round((40+si*15)*dr),cur:1};
  }
  grantMiniChestBonus(tier,quiet){
    const b=this.miniChestBonus(tier);if(b.sugar>0){this.sugarStage+=b.sugar;this.sugarRun+=b.sugar;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);}
    if(b.cur>0)this.grantCurrencyReward(b.cur,this.currencyTierFor(),quiet?null:(MINI_CHEST_TIERS[tier]||{}).name+' Chest bonus');
    else if(b.sugar>0&&!quiet)this.showBanner('🍬 +'+b.sugar,'Chest bonus',1200);
    return b;
  }
  // v5.14 วงล้อจับรางวัล: ของรางวัล 8 ช่องเรียงเป็นวง · ไฟวิ่งกระพริบช่องนั้นทีช่องนี้ทีเร็ว ๆ แล้วช้าลงจนหยุดที่ของที่ได้ → ของที่ได้โตขึ้นกลางจอ
  miniPrizePool(tier){
    const si=this.stageIndex||0,dr=this.diffMul?this.diffMul().reward:1,S=n=>Math.round(n*(1+si*0.3)*dr);
    return [
      {id:'sugarS',artKey:'prize_sugar',emoji:'🍬',name:'Sugar +'+S(25),w:tier==='gold'?4:10,color:0xff9dc4,give:()=>this.addRunSugar(S(25))},
      {id:'sugarM',artKey:'prize_sugar',emoji:'🍭',name:'Sugar +'+S(60),w:7,color:0xff7fb0,give:()=>this.addRunSugar(S(60))},
      {id:'sugarL',artKey:'prize_sugar_bag',emoji:'🎂',name:'Sugar +'+S(130),w:tier==='bronze'?2:4,color:0xffb347,give:()=>this.addRunSugar(S(130))},
      {id:'cur1',artKey:'prize_currency',emoji:'💠',name:'Currency ×1',w:8,color:0x7fd0ff,give:()=>this.grantCurrencyReward(1,this.currencyTierFor(),'Prize')},
      {id:'cur3',artKey:'prize_currency',emoji:'💎',name:'Currency ×3',w:tier==='bronze'?2:4,color:0x62b7ff,give:()=>this.grantCurrencyReward(3,this.currencyTierFor(),'Prize')},
      {id:'heal',artKey:'heal',emoji:'❤️',name:'Heal 40%',w:6,color:0xff6f9d,give:()=>{const p=this.player,a=Math.round(p.maxhp*0.4);p.hp=Math.min(p.maxhp,p.hp+a);this.popHeal(p.x,p.y,a);}},
      {id:'card',artKey:'prize_levelup',emoji:'⭐',name:'Bonus Level-up',w:5,color:0x8ff0b0,give:()=>{this.pendingLvl=(this.pendingLvl||0)+1;this._prizeLevelUp=true;}},
      {id:'thread',artKey:'prize_thread',name:'Weave Thread +'+(tier==='gold'?5:3),w:5,color:0xcaa4ff,give:()=>{Save.data.threads=Save.threads()+(tier==='gold'?5:3);Save.save();this.showBanner('Weave Thread gained','Use it in Flavor Weave Temple',1400);}},
      {id:'shovel',artKey:'prize_shovel',name:'Shovels +'+(tier==='gold'?2:1),w:4,color:0xffd782,give:()=>{Save.addShovels(tier==='gold'?2:1);this.showBanner('Shovels gained','Explore Temple Depths',1400);}},
      {id:'recharge',artKey:'prize_recharge',name:'Unique ready + Heal 15%',w:4,color:0x8fe3df,give:()=>{this.uniqueCd=0;const p=this.player,a=Math.round(p.maxhp*0.15);p.hp=Math.min(p.maxhp,p.hp+a);this.popHeal(p.x,p.y,a);this.showBanner('Unique ready','Your Unique skill can be used again',1400);}},
      {id:'jackpot',artKey:'prize_jackpot',emoji:'🌟',name:'JACKPOT!',w:tier==='gold'?3:tier==='silver'?1.5:0.7,color:0xffd166,jackpot:true,give:()=>{this.addRunSugar(S(150));this.grantCurrencyReward(3,this.currencyTierFor(),'JACKPOT');const p=this.player;p.hp=p.maxhp;}},
    ];
  }
  addRunSugar(n){ this.showBanner('🍬 +'+n,'Grab the candy!',1100); this.spawnSugarCoins(n); }
  // v5.17: รางวัล Sugar = ลูกกวาดพุ่งกระจายรอบตัวให้วิ่งเก็บ · ไม่เก็บใน 3 วิ จะบินเข้าตัวเอง (ไม่หาย)
  spawnSugarCoins(n,source=null){
    const cnt=source?Math.max(1,Math.min(n,4)):Math.max(4,Math.min(18,Math.ceil(n/8))),per=Math.floor(n/cnt);let rest=n-per*cnt;
    const at=source||this.player,px=at.x,py=at.y;if(!this._coins)this._coins=[];
    for(let i=0;i<cnt;i++){ const v=per+(rest-->0?1:0),a=Math.random()*TAU,d=source?20+Math.random()*45:70+Math.random()*110;
      const c=this.camWorld(this.add.image(px,py,'candy').setTint([0xffd166,0xff9dc4,0x9fe8ff][i%3]).setScale(1.4).setDepth(85000));
      c._v=v;c._t=0;this._coins.push(c);
      this.tweens.add({targets:c,x:px+Math.cos(a)*d,y:py+Math.sin(a)*d,duration:420,ease:'Cubic.out'});
      this.tweens.add({targets:c,scale:{from:0.6,to:1.4},angle:360,duration:420}); }
    if(!this._coinEv)this._coinEv=this.time.addEvent({delay:30,loop:true,callback:()=>this.tickSugarCoins(0.03)});
  }
  tickSugarCoins(dt){
    const arr=this._coins||[];if(!arr.length||!this.player)return;const p=this.player,pick=Math.max(48,(p.pickup||105)*0.45);
    for(let i=arr.length-1;i>=0;i--){const c=arr[i];if(!c.active){arr.splice(i,1);continue;}
      if(this.state!=='play')continue;c._t+=dt;const d=this.dist(c.x,c.y,p.x,p.y);
      if(c._t>3.5||(c._t>0.8&&d<pick)){const sp=c._t>3?9:14;c.x+=(p.x-c.x)*Math.min(1,dt*sp);c.y+=(p.y-c.y)*Math.min(1,dt*sp);}
      if(c._t>0.5&&d<26){this.sugarStage+=c._v;this.sugarRun+=c._v;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);(Sfx.ev?.('pickup_sugar',.35,.07)||(Sfx.xp&&Sfx.xp()));c.destroy();arr.splice(i,1);}}
  }
  clearSugarCoins(){ const arr=this._coins||[];for(const c of arr){if(c.active){this.sugarStage+=c._v;this.sugarRun+=c._v;c.destroy();}}this._coins=[];if(this._coinEv){this._coinEv.remove(false);this._coinEv=null;} }
  openPrizeWheel(tier,done,opts={}){
    if(this.state==='rolling'){done&&done();return;}
    // v5.15: ลุ้นอัปเกรดระดับกลางวงล้อ (ตัดสินตั้งแต่ต้น โชว์ตอนหมุนไปได้ ~55%) bronze→silver 25% · silver→gold 15%
    const order=['bronze','silver','gold'],ri=Math.max(0,order.indexOf(tier)),upChance=opts.prizes?0:[0.25,0.15,0][ri]+(this._runTrait?.lucky&&ri<2?0.25:0),upTier=Math.random()<upChance?order[ri+1]:null;
    const T0=MINI_CHEST_TIERS[tier]||MINI_CHEST_TIERS.bronze,T=MINI_CHEST_TIERS[upTier||tier],rewards=opts.prizes?opts.prizes.slice():this.miniPrizePool(upTier||tier);
    let mim=null; if(opts.onMimic&&!((this.stageIndex||0)<(typeof CH1_CALM_UNTIL!=='undefined'?CH1_CALM_UNTIL:5)&&!this.recipeMode&&!this.riftMode)){   /* v8.2.54 ECRS2 S4: Ch1 ไม่มี Mimic */ let base=0; rewards.forEach(p=>base+=p.w); mim={id:'mimic',artKey:this.textures.exists('mimic_chest_animated')?'mimic_chest_animated':'prize_chest',emoji:'🦷',name:'MIMIC!',w:base*MIMIC_WHEEL_CHANCE/(1-MIMIC_WHEEL_CHANCE),color:0xd23a5a,mimic:true,give:()=>{}}; rewards.push(mim); }   // v6.89.1 Mimic เป็นช่องหนึ่งในวงล้อเสมอ
    let rel=null; if(opts.relic){ let base=0; rewards.forEach(p=>base+=p.w); rel={id:'relic',artKey:this.textures.exists('relic_crown')?'relic_crown':'prize_jackpot',emoji:'🔮',name:'🔮 Relic!',w:base*WHEEL_RELIC_CHANCE/(1-WHEEL_RELIC_CHANCE),color:0xc07bff,give:()=>{}}; rewards.push(rel); }   // v7.8.97 เจ้าของ: Relic เป็นช่องในวงล้อ 30% (เดิมได้ทุกครั้งเป็นหน้าแยก)
    let tw=0;rewards.forEach(p=>tw+=p.w);let r=Math.random()*tw,winner=rewards[rewards.length-1];for(const prize of rewards){r-=prize.w;if(r<=0){winner=prize;break;}}
    // Roll from every reward first, then show eight slots including the winner.
    // This keeps all reward odds intact and leaves readable spacing on phones.
    const must=[winner].concat(mim&&winner!==mim?[mim]:[],rel&&winner!==rel?[rel]:[]),pool=rewards.length<=8?rewards:Phaser.Utils.Array.Shuffle([...must,...Phaser.Utils.Array.Shuffle(rewards.filter(p=>!must.includes(p))).slice(0,8-must.length)]),winIdx=pool.indexOf(winner);
    Sfx.eventLoopStop?.();this._prevRollState=this.state;this.state='rolling';this.physics.pause();
    const w=this.W,h=this.H,texture=this.textures.get('prize_wheel_bg').getSourceImage(),layout=prizeWheelLayout(w,h,texture.width,texture.height),{cx,cy,R}=layout,n=pool.length;
    const cont=this.add.container(0,0).setDepth(96);this.camUI(cont);
    const backdrop=this.add.rectangle(cx,h/2,w,h,0x201323);
    const bg=this.add.image(cx,layout.bgY,'prize_wheel_bg').setScale(layout.bgScale);
    const rays=this.add.circle(cx,cy,R+42,T0.color,0.05).setStrokeStyle(1,T0.color,0.18);
    this.tweens.add({targets:rays,alpha:{from:0.45,to:1},duration:1100,yoyo:true,repeat:-1});
    const ring=this.add.graphics();ring.lineStyle(3,T0.color,0.5);ring.strokeCircle(cx,cy,R);
    const ttl=this.add.text(cx+17,cy-R-70,opts.title||T0.name+' Chest',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#'+T0.color.toString(16).padStart(6,'0'),stroke:'#1a0f24',strokeThickness:5}).setOrigin(0.5);
    const tierBadge=this.add.image(cx-92,cy-R-70,T0.artKey).setDisplaySize(38,38);
    const hint=this.add.text(cx,cy+R+62,'Spinning…',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#c7bdd6'}).setOrigin(0.5);
    const center=this.add.image(cx,cy,'prize_chest').setDisplaySize(65,65);
    this.tweens.add({targets:center,angle:{from:-8,to:8},yoyo:true,repeat:-1,duration:120});Sfx.slotSpin();
    this.tweens.add({targets:center,y:{from:cy,to:cy-22},yoyo:true,repeat:-1,duration:210,ease:'Quad.out'});
    cont.add([backdrop,bg,rays,ring,tierBadge,ttl,hint,center]);
    const slots=pool.map((p,i)=>{const a=-Math.PI/2+i/n*TAU,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;
      const g=this.add.graphics();const lab=this.add.image(x,y,p.artKey).setDisplaySize(42,42);cont.add([g,lab]);
      const draw=(on)=>{g.clear();g.fillStyle(on?p.color:0x2a1f38,on?0.95:0.92);g.fillCircle(x,y,on?31:27);g.lineStyle(on?4:2,on?0xffffff:p.color,on?1:0.7);g.strokeCircle(x,y,on?31:27);};
      draw(false);return {x,y,g,lab,baseScaleX:lab.scaleX,baseScaleY:lab.scaleY,draw,p};});
    // ไฟวิ่ง: เร็วมากก่อนแล้วค่อยช้าลง ต้องจบที่ winIdx พอดี
    // v5.44 🛑 กดหยุดเอง: หมุนเร็วค้างไว้จนกด STOP (หรือครบ 6 วิ) แล้วไหลต่อ ~1.5 รอบค่อย ๆ ช้าลงไปจบที่ winIdx (ผลสุ่มไว้แล้ว)
    let total=1e9,steps=[],stopped=false,cur=-1,k=0;
    const bw=150,bh=46,bx=cx-bw/2,by=cy+R+84,sg=this.add.graphics();sg.fillStyle(0xd23a5a,1);sg.fillRoundedRect(bx,by,bw,bh,14);sg.lineStyle(3,0xffffff,0.9);sg.strokeRoundedRect(bx,by,bw,bh,14);
    const st=this.add.text(cx,by+bh/2,'🛑 STOP!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#ffffff'}).setOrigin(0.5);cont.add([sg,st]);
    this.tweens.add({targets:[st],scale:{from:1,to:1.08},yoyo:true,repeat:-1,duration:260});
    const doStop=()=>{ if(stopped)return;stopped=true;this._rollBtns=[];Sfx.card?Sfx.card():Sfx.select();this.tweens.killTweensOf(st);st.setText('…').setScale(1);sg.setAlpha(0.45);hint.setText('Slowing down…');
      const pos=cur,dist=((winIdx-pos)%n+n)%n,rem=n*2+dist+(dist<2?n:0);total=k+rem;steps=[];for(let q=0;q<rem;q++){const t=q/Math.max(1,rem-1);steps.push(50+Math.pow(t,3)*380);} this._stopBase=k;
      try{ Sfx.stopSlotSpin?.(); const left=steps.reduce((a2,b2)=>a2+b2,0); this.time.delayedCall(Math.max(0,left-2400),()=>{ if(cont.active)Sfx.wheelRoll?.(); }); }catch(e){} };   // v7.5.1 กด STOP: เพลงหมุนหยุด เหลือหมุดไม้ช้าลง + กลองรัวจบตอนวงล้อหยุด
    this._rollBtns=[{x:bx,y:by,w:bw,h:bh,fn:doStop}];hint.setText('Tap STOP!');
    this.time.delayedCall(6000,()=>{ if(cont.active)doStop(); });
    const chestScaleX=center.scaleX,chestScaleY=center.scaleY;
    const hop=()=>{ if(!cont.active)return; if(cur>=0){const prev=slots[cur];prev.draw(false);prev.lab.setScale(prev.baseScaleX,prev.baseScaleY);}
      cur=(cur+1)%n;const sl=slots[cur];sl.draw(true);sl.lab.setScale(sl.baseScaleX*1.2,sl.baseScaleY*1.2);if(Sfx.wheelTick)Sfx.wheelTick(stopped);else Sfx.chestTick(k);this.tweens.add({targets:sl.lab,y:{from:sl.y-12,to:sl.y},duration:170,ease:'Bounce.out'});
      this.tweens.add({targets:center,scaleX:{from:chestScaleX*1.18,to:chestScaleX},scaleY:{from:chestScaleY*0.84,to:chestScaleY},duration:150,ease:'Back.out'});
      k++;if(upTier&&stopped&&k===this._stopBase+Math.floor((total-this._stopBase)*0.5))upgrade();
      if(k>=total){sg.setVisible(false);st.setVisible(false);Sfx.wheelWin?.();this.time.delayedCall(260,()=>land());return;}
      this.time.delayedCall(stopped?steps[k-this._stopBase]||60:45,hop); };
    const upgrade=()=>{ const hex='#'+T.color.toString(16).padStart(6,'0');
      rays.setFillStyle(T.color,0.05).setStrokeStyle(1,T.color,0.18);ring.clear();ring.lineStyle(4,T.color,0.8);ring.strokeCircle(cx,cy,R);
      tierBadge.setTexture(T.artKey).setDisplaySize(38,38);ttl.setText(T.name+' Chest').setColor(hex);this.tweens.add({targets:ttl,scale:{from:1.35,to:1},duration:380,ease:'Back.out'});
      this.tweens.add({targets:tierBadge,alpha:{from:0.25,to:1},duration:380,ease:'Sine.out'});
      const up=this.add.text(cx,cy-R-38,'⬆ UPGRADE!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:hex,stroke:'#1a0f24',strokeThickness:5}).setOrigin(0.5);cont.add(up);
      this.tweens.add({targets:up,y:up.y-18,alpha:{from:1,to:0},delay:700,duration:600});
      const fl=this.add.circle(cx,cy,55,T.color,0.15).setScale(0.3);cont.add(fl);
      this.tweens.add({targets:fl,scale:3.4,alpha:0,duration:520,ease:'Cubic.out',onComplete:()=>fl.destroy()});
      this.screenFlash(T.color,0.35,260);Sfx.rewardCue?.('sfx_event_slot_stop',.45); };
    const land=()=>{ const sl=slots[winIdx],p=sl.p;
      this.tweens.killTweensOf(center);center.setVisible(false);Sfx.stopChestSpin();Sfx.slotReward(p.jackpot);
      for(let t=0;t<6;t++)this.time.delayedCall(t*90,()=>{sl.draw(t%2===0);});
      const big=this.add.image(sl.x,sl.y,p.artKey).setDisplaySize(42,42);cont.add(big);
      this.tweens.add({targets:big,x:cx,scaleX:big.scaleX*3.2,scaleY:big.scaleY*3.2,duration:520,ease:'Back.out'});
      this.tweens.add({targets:big,y:{from:sl.y,to:cy},duration:700,ease:'Bounce.out',onComplete:()=>{ if(!big.active)return;
        this.tweens.add({targets:big,y:cy-10,duration:420,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }});
      const glow=this.add.circle(cx,cy,72,p.color,0.08).setStrokeStyle(2,p.color,0.5).setScale(0.2);cont.addAt(glow,2);
      this.tweens.add({targets:glow,scale:1.25,alpha:{from:1,to:0.55},duration:520,ease:'Cubic.out'});
      hint.setText(p.name+(opts.prizes&&p.sub?'\n'+p.sub:'')).setAlign('center').setWordWrapWidth(w-32).setFontSize(opts.prizes&&p.sub?(p.jackpot?'20px':'18px'):(p.jackpot?'26px':'20px')).setColor('#'+p.color.toString(16).padStart(6,'0'));
      this.tweens.add({targets:hint,scale:{from:0.5,to:1},duration:320,ease:'Back.out'});
      for(let i=0;i<(p.jackpot?28:14);i++){const a=i/(p.jackpot?28:14)*TAU,sp=this.add.circle(cx,cy,p.jackpot?6:4,p.color,1);cont.add(sp);
        this.tweens.add({targets:sp,x:cx+Math.cos(a)*(120+Math.random()*80),y:cy+Math.sin(a)*(120+Math.random()*80),alpha:0,duration:700,ease:'Cubic.out'});}
      this.screenFlash(p.color,p.jackpot?0.6:0.35,320);if(p.jackpot){this.screenShake(400,0.012);}
      { const bt=!p.mimic&&opts.bonusText?opts.bonusText(upTier||tier):''; if(bt){const bl=this.add.text(cx,Math.min(cy+R+92,h-30),'Chest bonus  '+bt,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffe08a',stroke:'#1a0f24',strokeThickness:4}).setOrigin(0.5);cont.add(bl);} }   // v7.8.97 โบนัสหีบแสดงในหน้าวงล้อ (เดิมเป็นป้ายแยก)
      const finish=(dn)=>{ this._rollBtns=[]; this.tweens.add({targets:cont,alpha:0,duration:220,onComplete:()=>{ cont.destroy(true);
        this.state=this._prevRollState==='rolling'?'play':(this._prevRollState||'play');if(this.state!=='paused')this.physics.resume();
        if(p.mimic){ opts.onMimic&&opts.onMimic(); return; }
        if(dn){ this.openDoubleOrNothing(p,()=>done&&done(upTier||tier,p)); return; }
        p.give(); done&&done(upTier||tier,p); if(this._prizeLevelUp){this._prizeLevelUp=false;if(this.state==='play')this.openLevelUp();} }}); };
      if(opts.double&&!p.mimic){ this.time.delayedCall(700,()=>{ if(!cont.active)return; const bw2=Math.min(150,(w-48)/2),bh2=44,by2=Math.min(cy+R+118,h-bh2-12),mk=(x,label,col,fn)=>{const g=this.add.graphics();g.fillStyle(col,1);g.fillRoundedRect(x,by2,bw2,bh2,14);g.lineStyle(2,0xffffff,0.85);g.strokeRoundedRect(x,by2,bw2,bh2,14);const t=this.add.text(x+bw2/2,by2+bh2/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0.5);if(t.width>bw2-10)t.setScale((bw2-10)/t.width);cont.add([g,t]);return {x,y:by2,w:bw2,h:bh2,fn};};
          this._rollBtns=[mk(cx-bw2-6,'✓ Take it',0x3f8f5a,()=>finish(false)),mk(cx+6,'🎲 Double or Nothing',0xb8402f,()=>finish(true))]; }); }   // v7.8.97 บอส: เสี่ยง Double or Nothing จากหน้าวงล้อ
      else this.time.delayedCall(p.jackpot?1700:1250,()=>finish(false));
    };
    this.time.delayedCall(250,hop);
  }
  // Independent random event: three cards, one jackpot.
  attachChargedSeed(b,height){if(this.momoOutlineSeed?.(b,'charged',height*1.75))return;this.attachProjectileArt(b,'proj_strawberry_charge',height,0.78,0.52);}
  momoOutlineSeed(b,clip,size){const k='bpx_momo810_'+clip;if(!this.realTex?.(k)||(this._battlePaintFx?.size||0)>=48)return false;return this.attachProjectileAnim?.(b,k,size)||false;}
  bossInkBase(e){return e?._bossInk?.base||e?.texture?.key||'';}
  bossInkRetarget(e,key,from,to){
    const ratio=to/from,body=e.body,sx=e.scaleX??1,sy=e.scaleY??sx,circle=body?.isCircle?[body.radius,body.offset?.x||0,body.offset?.y||0]:null;
    const rect=body&&!circle?[body.sourceWidth??body.width/Math.max(.0001,Math.abs(sx)),body.sourceHeight??body.height/Math.max(.0001,Math.abs(sy)),body.offset?.x||0,body.offset?.y||0]:null;
    e.anims?.stop();e.setTexture(key,0);e.setScale(sx/ratio,sy/ratio);
    if(Number.isFinite(e.baseScale))e.baseScale/=ratio;if(Number.isFinite(e._baseScale))e._baseScale/=ratio;
    if(circle)e.setCircle(circle[0]*ratio,circle[1]*ratio,circle[2]*ratio);
    else if(rect){body.setSize?.(rect[0]*ratio,rect[1]*ratio,false);body.setOffset?.(rect[2]*ratio,rect[3]*ratio);}
  }
  applyBossInk(e){
    if(!e?.active||e.delveBoss||e.isDummy)return false;const current=e._bossInk;
    if(current){if(e.texture?.key!==current.key){e.anims?.stop();e.setTexture(current.key,current.frame<0?0:current.frame);}return true;}
    const base=this.bossInkBase(e),fd=BOSS_BODY816_MAP[base];if(!fd||!(e.isBoss||e.isMini||e.isElite&&/^(?:c3_mini[1-5]|mb[1-9](?:_|$))/.test(base))||!this.realTex?.(fd.key))return false;
    this.bossInkRetarget(e,fd.key,fd.oldFrame,256);
    e._bossInk={base,key:fd.key,player:this.player,stage:this.stageIndex,epoch:this._artEpoch||0,spawn:e._taroSpawnId,clock:0,pose:null,frame:-1};
    (this._bossInkActors||(this._bossInkActors=new Set())).add(e);
    if(!this._bossInkHook&&this.events?.once){this._bossInkHook=true;this.events.once('shutdown',()=>{this.clearBossInk();this._bossInkHook=false;});}
    e._bossInk.clips=this.bossInkClips(fd);this.bossInkFrame(e,0);return true;
  }
  bossInkClips(fd){const c=fd.frames===18?{idle:[0,1,2,3,4,5],wind:[6,7,8,9,10,11],strike:[12,13,14,15,16,17],recover:[14,15,16,17]}:{idle:[0,1,2,3,4,5],wind:[6,7,8],strike:[9,10,11],recover:[10,11]};if(fd.idle8)c.idle=fd.idle8;return c;}   /* v8.2.75 เฟส 5B: idle 8 เฟรม (ต่อท้ายชีต) */
  bossInkBegin(e,newCast=true){if(!this.applyBossInk(e))return null;const m=e._bossInk;if(newCast)m.cast=(m.cast||0)+1;return{owner:e,m,cast:m.cast||0};}
  bossInkRelease(e,guard){
    const m=e?._bossInk,p=m?.pose;if(!e?.active||!m||!p?.waitRelease||p.kind!=='attack'||(e._phaseInvuln||0)>0||m.player!==this.player||m.stage!==this.stageIndex||m.epoch!==(this._artEpoch||0)||m.spawn!==e._taroSpawnId)return false;
    if(guard&&(guard.owner!==e||guard.m!==m||guard.cast!==(m.cast||0)))return false;
    m.pose={kind:'strike',t:0,duration:Math.max(.3,Math.min(.65,p.duration*.6)),flipX:p.flipX,cast:m.cast||0};this.bossInkFrame(e,0);return true;
  }
  bossInkFrame(e,wallDt){
    const m=e?._bossInk;if(!m||!e.active||!(this.state==='play'||this.state==='cinematic'&&this.mode==='bossIntro')||e.frozen>0||this._isHitStop)return;
    const fd=BOSS_BODY816_MAP[m.base],clips=m.clips||(m.clips=this.bossInkClips(fd)),still=this.hubMotionAllowed?.()===false||(typeof Save!=='undefined'&&Save.data.settings?.vfx===0),dt=Math.max(0,wallDt||0)*Math.max(0,this.time?.timeScale??this.gameSpeed??1);
    const sample=(a,t,d)=>a[Math.min(a.length-1,Math.floor(Math.max(0,t)/Math.max(.001,d)*a.length))];
    m.clock+=dt;let f=still?2:clips.idle[Math.floor(m.clock*clips.idle.length)%clips.idle.length];   /* v8.2.75 รอบ idle 1 วิ เท่าเดิม (6 หรือ 8 เฟรม) */const p=m.pose;
    if(p){p.t+=dt;
      if(p.waitRelease){f=still?clips.wind[Math.floor(clips.wind.length/2)]:sample(clips.wind,p.t,Math.min(.6,p.duration*.8));if(p.t>=Math.max(2,p.duration+1)){p.waitRelease=false;p.kind='recover';p.t=0;p.duration=.3;f=clips.recover[0];}}
      else if(p.kind==='wind'&&p.t<p.duration+1.2)f=still?clips.wind[Math.floor(clips.wind.length/2)]:sample(clips.wind,p.t,p.duration);
      else if(p.t>=p.duration){m.pose=null;m.clock=0;f=still?2:clips.idle[0];}
      else if(p.kind==='strike')f=still?clips.strike[0]:sample(clips.strike,p.t,p.duration);
      else if(p.kind==='recover')f=still?clips.recover.at(-1):sample(clips.recover,p.t,p.duration);
      else{const lead=p.duration*.4;f=p.t<lead?(still?clips.wind[Math.floor(clips.wind.length/2)]:sample(clips.wind,p.t,lead)):(still?clips.strike[0]:sample(clips.strike,p.t-lead,p.duration-lead));}}
    if(fd.phaseStride&&e.phase2)f+=fd.phaseStride;
    if(e.anims?.isPlaying)e.anims.stop();if(e.texture?.key!==m.key)e.setTexture(m.key,f);
    if(m.frame!==f||+e.frame?.name!==f){m.frame=f;e.setFrame(f);}
  }
  tickBossInk(wallDt){
    for(const e of this._bossInkActors||[]){const m=e._bossInk;if(!e.active||!m||m.player!==this.player||m.stage!==this.stageIndex||m.epoch!==(this._artEpoch||0)||m.spawn!==e._taroSpawnId){this.stopBossInk(e);continue;}this.bossInkFrame(e,wallDt);}
  }
  bossInkPose(e,frame,ms=700,kind){
    if(!this.applyBossInk(e))return false;const m=e._bossInk;
    if(frame<=1){if(m.pose)m.clock=0;m.pose=null;}
    else{const k=kind||(m.base==='boss1'&&frame===2?'wind':m.base==='boss1'&&frame===3?'strike':frame===5&&ms<=300?'recover':'attack');
      if(k==='recover'&&m.pose&&['wind','strike','attack'].includes(m.pose.kind))return true;
      m.pose={t:0,duration:Math.max(.06,ms/1000),kind:k,waitRelease:k==='attack'&&BOSS_BODY816_MAP[m.base].frames===18&&this.state==='play'&&!e._arenaBusy&&!(e._phaseInvuln>0),flipX:!!e.flipX,cast:m.cast||0};}
    this.bossInkFrame(e,0);return true;
  }
  bossInkIdle(e){if(!this.applyBossInk(e))return false;const m=e._bossInk;if(m.pose){m.pose=null;m.clock=0;}this.bossInkFrame(e,0);return true;}
  stopBossInk(e,restore=true){
    const m=e?._bossInk;if(!m)return;const fd=BOSS_BODY816_MAP[m.base];
    if(restore&&fd&&(e.scene||!("scene" in e))&&(e.texture?.key===m.key||e.texture?.key===m.base))this.bossInkRetarget(e,m.base,256,fd.oldFrame);
    this._bossInkActors?.delete(e);delete e._bossInk;
  }
  clearBossInk(){for(const e of [...(this._bossInkActors||[])])this.stopBossInk(e);this._bossInkActors?.clear();}
  bossInkGhost(e){
    const m=e?._bossInk;if(!m||m.ghost)return false;m.ghost=true;
    const g=this.trackArtVfx(this.camWorld(this.add.image(e.x,e.y,m.key,e.frame?.name??0).setOrigin(e.originX??.5,e.originY??.5).setScale(e.scaleX,e.scaleY).setFlipX(!!e.flipX).setDepth(e.depth||e.y)));
    this.tweens.add({targets:g,alpha:0,y:g.y+12,duration:700,onComplete:()=>g.destroy()});return true;
  }

  bossOutlineKey(key){if(!(this.stageIndex>=0&&this.stageIndex<15))return null;const pin=!!(this._pinnacleRun||this.boss?._pinnacleArt),map=pin?BOSS_OUTLINE815_MAP:this.stageIndex<5?BOSS_OUTLINE813_MAP:this.stageIndex<10?BOSS_OUTLINE814_MAP:BOSS_OUTLINE815_MAP,next=(pin&&!key.startsWith('vfx_bpin_')?null:map[key])||(!pin&&key.startsWith('vfx_body_')?BOSS_OUTLINE813_MAP[key]:null);return next&&(this.realTex?.(next)??this.textures?.exists(next))?next:null;}
  battleOutlineKey(key){const next=this.bossOutlineKey?.(key)||BATTLE_OUTLINE810_MAP[key];return next&&(this.realTex?.(next)??this.textures?.exists(next))?next:key;}
  battleOutlineTrack(image,oldKey,newKey,bullet=null,loop){if(!image||oldKey===newKey&&!/^(?:bpx_(?:cocoa|taro|yuzu|momo)810_|vfx81[345]_)/.test(newKey))return image;const prev=ASSET_FX[oldKey],fd=ASSET_FX[newKey];if(!fd)return image;const set=this._battlePaintFx||(this._battlePaintFx=new Set());image.anims?.stop();image._battleOutline810={t:0,rate:fd.frames/(prev?prev.frames/prev.rate:fd.frames/fd.rate),frames:fd.frames,loop:loop??!!prev?.loop,wall:/^vfx81[345]_/.test(newKey),player:this.player,basic:this.basicAttack,epoch:this._artEpoch||0,frame:-1,bullet,done:false};set.add(image);image.once('destroy',()=>{set.delete(image);if(bullet?._chargeFx===image){bullet._chargeFx=null;bullet.setAlpha?.(1);}});if(!this._battlePaintHook&&this.events?.once){this._battlePaintHook=true;this.events.once('shutdown',()=>{this.clearBattleOutline();this._battlePaintHook=false;});}this.battleOutlineFrame(image,0);return image;}
  battleOutlineFrame(image,dt){const m=image?._battleOutline810;if(!image?.active||!m||m.done||this.state!=='play')return;let step=Math.max(0,dt)*(image.anims?.timeScale??1)/(m.wall?(this.gameSpeed||1):1);if(m.holdLeft>0){const consumed=Math.min(step,m.holdLeft);m.holdLeft-=consumed;step-=consumed;}if(m.holdAt!=null&&!m.held&&m.t+step>=m.holdAt/m.rate){const before=Math.max(0,m.holdAt/m.rate-m.t);m.t+=before;step-=before;m.held=true;m.holdLeft=m.holdSec;const consumed=Math.min(step,m.holdLeft);m.holdLeft-=consumed;step-=consumed;}m.t+=step;const still=this.hubMotionAllowed?.()===false||(typeof Save!=='undefined'&&Save.data.settings?.vfx===0),at=Math.floor(m.t*m.rate),frame=still?2:m.loop?at%m.frames:Math.min(m.frames-1,at);if(m.frame!==frame){m.frame=frame;image.setFrame(frame);}if(!m.loop&&at>=m.frames){m.done=true;image.emit('animationcomplete');}}
  tickBattleOutlineFx(dt){if(this.state!=='play')return;for(const image of this._battlePaintFx||[]){const m=image._battleOutline810;if(!image.active){this._battlePaintFx.delete(image);continue;}if(!m||m.player!==this.player||m.basic!==this.basicAttack||m.epoch!==(this._artEpoch||0)){image.destroy();continue;}this.battleOutlineFrame(image,dt);}}
  clearBattleOutline(){for(const image of [...(this._battlePaintFx||[])])if(image.active)image.destroy();this._battlePaintFx?.clear();}
  bpAnim(key){if(!this.textures?.exists?.(key))return false;if(!this.anims.exists(key)){const fd=ASSET_FX[key];if(!fd)return false;this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:fd.frames-1}),frameRate:fd.rate,repeat:fd.loop?-1:0});}return true;}
  // v6.60.3 one-shot painted build-path effect; size = on-screen cell width in px
  bpFx(key,x,y,size,o={}){ if(typeof CODE_VFX!=='undefined'&&CODE_VFX.cocoa&&/^bpx_cocoa_(?:dashring|landing_dust)$/.test(key))   /* v8.1.159 เจ้าของ: Titan crush เสียความอลังการ → คลื่นกระแทก/รอยร้าวกลับเป็นภาพเดิม · โค้ดเหลือแค่วง Dash/ฝุ่นลงพื้น */return this.codeShock?.(x,y,size*.45,key==='bpx_cocoa_dashring'?0xc9a3ff:0xd59b65,{depth:o.depth,crack:key==='bpx_cocoa_crack',dust:key==='bpx_cocoa_crack'?0:10,rings:key==='bpx_cocoa_dashring'?2:1,dur:440}); const oldKey=key;key=this.battleOutlineKey?.(key)||key;if(!this.bpAnim(key))return null;const s=this.spawnFxAnim(key,x,y,{scale:size/256,scaleX:o.scaleX,scaleY:o.scaleY,rotation:o.rotation,anchor:o.anchor,depth:o.depth??8,normal:true,force:o.force});if(s){this.trackArtVfx(s);this.battleOutlineTrack?.(s,oldKey,key);}return s;}
  // v7.8.45 art order 20: hero VFX · w = on-screen width px (h defaults to frame aspect) · must = ignore fxOk budget (⭐⭐⭐) · loop sheets stay until destroyed or life · hold = keep last frame N sec then fade · follow = stick to an object
  heroFx(key,x,y,w,o={}){const oldKey=key;key=this.battleOutlineKey?.(key)||key;if(!this.bpAnim(key))return null;const fd=ASSET_FX[key];if(!o.must&&(this._artVfx?.size||0)>48)return null;const h=o.h??w*fd.fh/fd.fw;
    const s=this.spawnFxAnim(key,x,y,{scaleX:w/fd.fw,scaleY:h/fd.fh,rotation:o.rot,anchor:o.anchor,depth:o.depth??8,normal:true,force:o.must,tint:o.tint,alpha:o.alpha});if(!s)return null;this.trackArtVfx(s);
    this.battleOutlineTrack?.(s,oldKey,key);if(o.ts&&s.anims)s.anims.timeScale=o.ts;
    if(o.hold!=null){s.off('animationcomplete');s.once('animationcomplete',()=>{if(!s.active)return;this.tweens.add({targets:s,alpha:0,delay:o.hold*1000,duration:o.fade??400,onComplete:()=>s.destroy()});});}
    if(o.life!=null)this.tweens.add({targets:s,alpha:0,delay:o.life*1000,duration:o.fade??200,onComplete:()=>s.destroy()});
    if(o.follow){const f=o.follow,dy=o.dy||0,tk=()=>{if(!s.active||!f.active){this.events.off('postupdate',tk);return;}s.setPosition(f.x,f.y+dy);};this.events.on('postupdate',tk);}
    return s;}
  heroDashFx(){const P=this.player;if(!P||this.character!=='momo')return;this.heroFx('bpx_momo_dash',P.x,P.y+6,104,{must:true,depth:P.depth-1});}
  heroFxThrottle(k,n,ms){const now=this.time.now,t=this._hfxT||(this._hfxT={});let b=t[k];if(!b||now-b.at>=ms)b=t[k]={at:now,n:0};if(b.n>=n)return false;b.n++;return true;}
  momoSeedPop(x,y,w=52){if(this.character!=='momo'||!this.heroFxThrottle?.('seed',4,100))return null;return this.heroFx('bpx_momo_seed_pop',x,y,w);}
  // M2 แช่แข็ง: เล่นเฟรม 0–4 แล้วค้างเฟรม 4 ตลอดที่ e.frozen>0 → เฟรม 5 แตกแล้วหาย
  mintFreezeFx(e){if(e._frzFx?.active)return true;const set=this._frzFx||(this._frzFx=new Set());if(set.size>=24)return !!this.bpAnim('bpx_mint_freeze');const s=this.heroFx('bpx_mint_freeze',e.x,e.y,Math.max(70,(e.body?.halfWidth||20)*3.2),{must:true,depth:e.depth+1});if(!s)return false;
    s._frzE=e;e._frzFx=s;set.add(s);s.once('destroy',()=>{set.delete(s);if(e._frzFx===s)e._frzFx=null;});return true;}
  heroFxTick(){const set=this._frzFx;if(!set||!set.size)return;set.forEach(s=>{const e=s._frzE;if(!s.active)return;const on=e&&e.active&&(e.frozen||0)>0;if(on){s.setPosition(e.x,e.y).setDepth(e.depth+1);if(!s.anims.isPaused&&+s.frame.name>=4)s.anims.pause();}else if(s.anims.isPaused)s.anims.resume();});}
  bpLoop(key,x,y,size,depth=6){const oldKey=key;key=this.battleOutlineKey?.(key)||key;if(!this.bpAnim(key))return null;const s=this.trackArtVfx(this.camWorld(this.add.sprite(x,y,key,0).setDepth(depth).setScale(size/256)));s.play(key);this.battleOutlineTrack?.(s,oldKey,key,null,true);return s;}
  attachProjectileAnim(b,key,size){const oldKey=key;key=this.battleOutlineKey?.(key)||key;if(!this.bpAnim(key))return false;if(b._chargeFx){b._chargeFx.destroy();b._chargeFx=null;}b._chargeFx=this.camWorld(this.add.sprite(b.x,b.y,key,0).setDepth(90000).setScale(size/256));b._chargeFx.play(key);this.battleOutlineTrack?.(b._chargeFx,oldKey,key,b,true);b.setAlpha(0);return true;}
  attachProjectileArt(b,key,height,ox=0.5,oy=0.5){
    if(!this.textures.exists(key))return;
    b._chargeFx=this.camWorld(this.add.image(b.x,b.y,key).setOrigin(ox,oy).setDepth(90000));
    b._chargeFx.setScale(height/this.textures.get(key).getSourceImage().height);
    b.setAlpha(0); // Preserve the original bullet body and collision behavior.
  }
  trackArtVfx(o){
    if(!o)return o;
    if(!this._artVfx)this._artVfx=new Set();this._artVfx.add(o);
    o.once('destroy',()=>this._artVfx&&this._artVfx.delete(o));
    if(this.events&&!this._artVfxHook){this._artVfxHook=true;this.events.once('shutdown',()=>{this.clearArtVfx();this._artVfxHook=false;});}
    return o;
  }
  artDelay(ms,fn){
    if(!this._artTimers)this._artTimers=new Set();const epoch=this._artEpoch||0;
    const ev=this.time.delayedCall(ms,()=>{this._artTimers.delete(ev);if((this._artEpoch||0)===epoch)fn();});
    this._artTimers.add(ev);return ev;
  }
  artLoop(ms,fn){
    if(!this._artTimers)this._artTimers=new Set();const epoch=this._artEpoch||0;
    const ev=this.time.addEvent({delay:ms,loop:true,callback:()=>{if((this._artEpoch||0)===epoch&&(this.state==='play'||this.state==='levelup'))fn();}});
    this._artTimers.add(ev);return ev;
  }
  clearArtVfx(){this.clearStatusArt?.();this.clearStageLife?.();this.clearBossInk?.();this.clearBossShotLoops?.();this.clearBattleOutline?.();this.clearYuzuSkillFx?.();this.clearYuzuBuff?.();this.clearBossStory?.();this.clearBossVictory?.();if(typeof Sfx!=='undefined')Sfx.eventLoopStop?.();this._heroScreen?.kill();
    this.clearSesRune?.();
    if(this._impalerCharge&&typeof Sfx!=='undefined')Sfx.bpLoopStop?.('mint_impaler_charge');
    if(['char_mint_impaler_charge','char_mint_impaler_move'].includes(this.player?.texture?.key)){this._attackPoseTime=0;this._attackTextureKey=null;}
    this.clearTaroCombat?.();this.clearCocoaCombat?.();this._impalerCharge=null;this._berryCharge=null;this._berryFxAt=null;this._berryFxCount=0;this._growthVfxAt=null;
    this._mintDashTween?.stop();this._mintDashTween=null;this._mintDashFinish=null;this._glacierStorms=[];
    this._mintArsenalAt=-Infinity;this._mintVfxWindow=null;this._mintVfxCount=0;this._mintShardWindow=null;this._mintShardCount=0;this._mintImpactAt=-Infinity;
    if(this.basicAttack)this.basicAttack._impalerFullShots=0;
    this._glacierBusy=false;this._glacierWindow=null;this._glacierBursts=0;this._glacierVfx=0;
    this._artEpoch=(this._artEpoch||0)+1;
    for(const ev of this._artTimers||[])ev.remove(false);if(this._artTimers)this._artTimers.clear();
    for(const o of [...(this._artVfx||[])]){this.tweens.killTweensOf(o);if(o.active)o.destroy();}
    if(this._artVfx)this._artVfx.clear();this._iceTrails=[];this._shellArt=null;this._frZones=[];this._frBuddy=null;this._frOrbit=null;
  }
  drawChargedSeed(x,y,ang,len,width){
    const k='bpx_momo810_charged';if(this.realTex?.(k)){const a=this.heroFx?.(k,x,y,Math.min(220,width*3.4),{rot:ang,life:.26,fade:0,depth:90410});if(a){this.tweens.add({targets:a,x:x+Math.cos(ang)*len,y:y+Math.sin(ang)*len,duration:260,ease:'Quad.in'});return;}}
    if(!this.textures.exists('proj_strawberry_charge'))return;
    const fx=this.trackArtVfx(this.camWorld(this.add.image(x,y,'proj_strawberry_charge').setOrigin(0.78,0.52).setRotation(ang).setDepth(90410)));
    fx.setScale(Math.min(110,width*1.7)/this.textures.get('proj_strawberry_charge').getSourceImage().height);
    this.tweens.add({targets:fx,x:x+Math.cos(ang)*len,y:y+Math.sin(ang)*len,alpha:0,duration:260,ease:'Quad.in',onComplete:()=>fx.destroy()});
  }
  clearMysteryCards(){
    const modal=this._mysteryCards;if(!modal)return;
    this._mysteryCards=null;modal.alive=false;
    for(const ev of modal.timers)ev.remove(false);
    const stop=o=>{this.tweens.killTweensOf(o);if(Array.isArray(o.list))for(const child of [...o.list])stop(child);};
    stop(modal.cont);modal.cont.destroy();
    this._rollBtns=null;
  }
  openMysteryCards(done,opt={}){
    this.clearMysteryCards();
    if(this.events&&!this._mysteryShutdownHook){this._mysteryShutdownHook=true;this.events.once('shutdown',()=>{this.clearMysteryCards();this._mysteryShutdownHook=false;});}
    const si=this.stageIndex||0,dr=this.diffMul?this.diffMul().reward:1,S=n=>Math.round(n*(1+si*0.3)*dr);
    const prizes=opt.prizes||Phaser.Utils.Array.Shuffle([
      {artKey:'prize_jackpot',emoji:'🌟',name:'JACKPOT',sub:'Sugar +'+S(200)+' · Currency ×2 · Full heal',color:0xffd166,jackpot:true,give:()=>{this.addRunSugar(S(200));this.grantCurrencyReward(2,this.currencyTierFor(),'JACKPOT');this.player.hp=this.player.maxhp;}},
      {artKey:'prize_sugar',emoji:'🍭',name:'Sugar',sub:'+'+S(70),color:0xff7fb0,give:()=>this.addRunSugar(S(70))},
      {artKey:'prize_currency',emoji:'💠',name:'Currency',sub:'×1',color:0x7fd0ff,give:()=>this.grantCurrencyReward(1,this.currencyTierFor(),'Mystery card')},
    ]);
    Sfx.eventLoopStop?.();this._prevRollState=this.state;this.state='rolling';this.physics.pause();
    const w=this.W,h=this.H,cw=Math.min(104,(w-60)/3),ch=cw*1.45,gap=12,x0=w/2-(cw*3+gap*2)/2,cy=h*0.48;
    const cont=this.add.container(0,0).setDepth(96);this.camUI(cont);
    const bg=this.add.rectangle(0,0,w,h,0x0b0714,0.9).setOrigin(0);
    const ttl=this.add.text(w/2+16,cy-ch/2-60,opt.title||'Jackpot Event',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffd166',stroke:'#1a0f24',strokeThickness:5}).setOrigin(0.5);
    const tierBadge=this.add.image(w/2-82,cy-ch/2-60,'prize_jackpot').setDisplaySize(38,38);
    const hint=this.add.text(w/2,cy-ch/2-30,opt.hint||'One card hides the JACKPOT — pick one!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#e8dcff'}).setOrigin(0.5);
    cont.add([bg,tierBadge,ttl,hint]);
    const modal={cont,timers:[],alive:true};this._mysteryCards=modal;
    const active=()=>modal.alive&&this._mysteryCards===modal;
    const later=(ms,fn)=>{const ev=this.time.delayedCall(ms,()=>{if(active())fn();});modal.timers.push(ev);return ev;};
    let picked=false,closing=false;
    const cards=prizes.map((p,i)=>{const x=x0+i*(cw+gap)+cw/2;const c=this.add.container(x,cy);const g=this.add.graphics();
      const drawBack=()=>{g.clear();g.fillStyle(0x3a2352,1);g.fillRoundedRect(-cw/2,-ch/2,cw,ch,14);g.lineStyle(3,0xffd166,0.9);g.strokeRoundedRect(-cw/2,-ch/2,cw,ch,14);};
      const q=this.add.image(0,0,'mystery_card_back').setDisplaySize(cw,ch);drawBack();c.add([g,q]);cont.add(c);
      this.tweens.add({targets:c,y:cy-6,yoyo:true,repeat:-1,duration:600+i*90,ease:'Sine.inOut'});
      return {c,g,q,p,x};});
    const flip=(cd,mine)=>{ if(!active())return; this.tweens.killTweensOf(cd.c);
      this.tweens.add({targets:cd.c,scaleX:0,duration:140,onComplete:()=>{ if(!active())return;const p=cd.p;cd.g.clear();cd.g.fillStyle(mine?0x2c2038:0x1d1626,1);cd.g.fillRoundedRect(-cw/2,-ch/2,cw,ch,14);cd.g.lineStyle(mine?4:2,p.color,mine?1:0.6);cd.g.strokeRoundedRect(-cw/2,-ch/2,cw,ch,14);
        cd.q.setAlpha(0.24);const art=p.artKey&&this.textures.exists(p.artKey)?this.add.image(0,-16,p.artKey).setDisplaySize(p.jackpot?54:46,p.jackpot?54:46):this.add.text(0,-16,p.emoji||'🎁',{fontSize:(p.jackpot?40:34)+'px'}).setOrigin(0.5);cd.c.add(art);
        const nm=this.add.text(0,ch*0.2,p.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#'+p.color.toString(16).padStart(6,'0')}).setOrigin(0.5);
        const sb=this.add.text(0,ch*0.34,p.sub,{fontFamily:'sans-serif',fontSize:'9px',color:'#d8cce6',align:'center',wordWrap:{width:cw-10}}).setOrigin(0.5,0);
        cd.c.add([nm,sb]);if(!mine)cd.c.setAlpha(0.55);
        this.tweens.add({targets:cd.c,scaleX:mine?1.12:1,scaleY:mine?1.12:1,duration:160,ease:'Back.out'}); }});};
    this._rollBtns=cards.map(cd=>({x:cd.x-cw/2,y:cy-ch/2,w:cw,h:ch,fn:()=>{ if(picked||!active())return;picked=true;this._rollBtns=[];
      if(Sfx.select)Sfx.select();flip(cd,true);const p=cd.p;
      later(420,()=>{ this.screenFlash(p.color,p.jackpot?0.6:0.3,300);if(p.jackpot){this.screenShake(360,0.012);if(Sfx.legend)Sfx.legend();hint.setText('JACKPOT!').setColor('#ffd166').setFontSize('20px');}else{if(Sfx.clear)Sfx.clear();hint.setText('You got '+p.name+' '+p.sub);}
        cards.forEach((o,j)=>{if(o!==cd)later(350+j*160,()=>flip(o,false));}); });
      const close=(times,after)=>{ if(closing||!active())return;closing=true;this._rollBtns=[];this.tweens.add({targets:cont,alpha:0,duration:220,onComplete:()=>{ if(!active())return;this.clearMysteryCards();
        if(!after){ this.state=this._prevRollState==='rolling'?'play':(this._prevRollState||'play');if(this.state!=='paused')this.physics.resume(); }
        for(let k=0;k<times;k++)p.give(); if(after)after(); else done&&done(); }}); };
      if(!opt.choice){ later(2300,()=>close(1)); return; }
      // v6.55: Double or Nothing / Reroll (Ad)
      later(1500,()=>{ const by=cy+ch/2+34,bw=Math.min(w-40,300),bh=46,btns=[];
        const mk=(i,label,col,fn)=>{ const y=by+i*(bh+10),g=this.add.graphics();g.fillStyle(col,1);g.fillRoundedRect(w/2-bw/2,y,bw,bh,12);g.lineStyle(2,0xffffff,0.5);g.strokeRoundedRect(w/2-bw/2,y,bw,bh,12);const t=this.add.text(w/2,y+bh/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',stroke:'#000',strokeThickness:3}).setOrigin(0.5);cont.add([g,t]);btns.push({x:w/2-bw/2,y,w:bw,h:bh,fn}); };
        mk(0,'✅ Keep '+p.name,0x3f9160,()=>{ this._rollBtns=[]; close(1); });
        if(!opt.noDouble)mk(1,'🎲 Double or Nothing',0xb8402f,()=>{ this._rollBtns=[]; close(0,()=>this.openDoubleOrNothing(p,done)); });
        if(!opt.noReroll)mk(opt.noDouble?1:2,'📺 Reroll cards (Ad)',0x5a4fb8,()=>{ this._rollBtns=[]; this.showRewardedAd?this.showRewardedAd('Reroll the Boss Loot cards',()=>close(0,()=>opt.reroll())):close(0,()=>opt.reroll()); });
        this._rollBtns=btns; }); }}));
  }
  // v5.18 กล่องมิมิค 12%: แตะแล้วกล่องกลายเป็นมอนกัด · ฆ่าได้ = กล่องระดับสูงขึ้น 1 ขั้น (ไม่เป็นมิมิคซ้ำ)
  awakenMimic(x,y,tier){
    const e=this.spawnElite(true,true);   /* v7.2 objective spawn: story budget often exhausted after the miniboss → mimic used to fall back to a chest */if(!e){this._noMimicNext=true;this._nextChestTier=tier;this.spawnChest(x,y,'mini');return;}
    e.setPosition(x,y).setTexture('chest').setFrame(0);if(e.anims)e.anims.stop();
    const sc=64/(e.width||48);e.setScale(sc);e.baseScale=sc;e._baseScale=sc;if(e.body)e.body.setCircle((e.width||48)*0.42,(e.width||48)*0.08,(e.width||48)*0.08);
    e.hp=e.maxhp=e.maxhp*2.6;e.spd=(e.spd||48)*1.6;e.dmg=Math.round((e.dmg||18)*1.15);e._mimic=tier;e.frozen=Math.max(e.frozen||0,0.9);e.setTint(0xffd6a0);e.tintColor=0xffd6a0;const painted=this.applySpecialEnemyArt(e,'mimic_chest_animated');
    this.screenShake(260,0.014);this.screenFlash(0xff5a6e,0.3,260);if(Sfx.bossWarn)Sfx.bossWarn();this.burst(x,y,0xff5a6e);
    if(!painted){this.resetEnemyPresentation(e);this.tweens.add({targets:e,scaleY:sc*1.35,yoyo:true,duration:140,repeat:2});}
    this.showBanner('🦷 MIMIC!','The chest bites back — defeat it for a better chest',1800);
  }
  clearMimicCue(c){if(!c._mimicCue)return;for(const o of c._mimicCue){this.tweens.killTweensOf(o);o.destroy();}c._mimicCue=null;}
  miniChestDrop(c,x,y){
    const T=MINI_CHEST_TIERS[c._tier||'bronze']||MINI_CHEST_TIERS.bronze;
    c.body.enable=false; c.setPosition(x,y-320).setAlpha(0.2).setDepth(90000); c.setScale(1.42*36/(c.width||36));
    const shadow=this.camWorld(this.add.ellipse(x,y+10,20,8,0x000000,0.35).setDepth(79970));
    this.tweens.add({targets:shadow,width:64,height:22,duration:460,ease:'Quad.in'});
    this.tweens.add({targets:c,y,alpha:1,duration:460,ease:'Quad.in',onComplete:()=>{ if(!c.active){shadow.destroy();return;}
      shadow.destroy(); this.screenShake(220,0.012); if(Sfx.boom)Sfx.boom(); this.burst(x,y,T.color);
      for(let k=0;k<2;k++){const r=this.camWorld(this.add.ellipse(x,y+8,30,12,0xe8dcc8,0.7).setDepth(79975));this.tweens.add({targets:r,width:170+k*60,height:52+k*18,alpha:0,duration:420+k*120,ease:'Cubic.out',onComplete:()=>r.destroy()});}
      this.tweens.add({targets:c,scaleY:c.scaleY*0.72,scaleX:c.scaleX*1.25,yoyo:true,duration:110,onComplete:()=>{ if(!c.active)return;
        c.body.enable=true; this.showPickupCue(c,T.color,1.42); if(this.iso)c.setDepth(Math.max(80000,c.y));
        c._pillar=this.camWorld(this.add.rectangle(x,y+6,46,560,T.color,0.3).setOrigin(0.5,1).setBlendMode(Phaser.BlendModes.ADD).setDepth(79960));
        c._pillarCore=this.camWorld(this.add.rectangle(x,y+6,10,560,0xffffff,0.22).setOrigin(0.5,1).setBlendMode(Phaser.BlendModes.ADD).setDepth(79961));
        c._pillar.scaleY=0;c._pillarCore.scaleY=0;
        this.tweens.add({targets:[c._pillar,c._pillarCore],scaleY:1,duration:260,ease:'Cubic.out'});
        this.tweens.add({targets:c._pillar,alpha:{from:0.2,to:0.42},scaleX:{from:0.85,to:1.2},yoyo:true,repeat:-1,duration:520,delay:260});
        this.tweens.add({targets:c,y:y-10,duration:500,yoyo:true,repeat:-1,ease:'Sine.inOut'});
        const inf=this._miniChestInfo;   /* v6.89 ไม่เฉลย Mimic ก่อน — โผล่ในวงล้อ */
        this.showBanner(T.name+' Chest',inf?('Beat it in '+Math.round(inf.dur)+'s · '+inf.hits+' hits taken'):'Walk into the light to open it',1600); }});
    }});
  }
  collectChest(player,c){ if(!c.active)return; this.rubyOnce?.('chest',1400);
    const kind=c.rewardKind;if(kind!=='mini'&&kind!=='pick')return;
    // Claim the pooled pickup before callbacks can open a modal or overlap again.
    const tier=c._tier||'bronze',noMimic=!!c._noMimic;
    c.rewardKind=null;c._mimic=false;
    c.setActive(false).setVisible(false);if(c.body){c.body.enable=false;if(c.body.stop)c.body.stop();}
    this.tweens.killTweensOf(c);this.hidePickupCue(c);this.clearMimicCue(c);
    for(const key of ['_pillar','_pillarCore']){if(c[key]){this.tweens.killTweensOf(c[key]);c[key].destroy();c[key]=null;}}

    if(c._glow){ this.tweens.killTweensOf(c._glow); c._glow.destroy(); c._glow=null; }
    Sfx.clear(); this.burst(c.x,c.y,0xffd166); this.screenFlash(0xffe08a,0.4,300);
    const mx=c.x,my=c.y;
    if(kind==='mini'){ this.openPrizeWheel(tier,(ft,won)=>{const finalTier=ft||tier;this.grantMiniChestBonus(finalTier,true);if(won&&won.id==='relic')this.offerRelic();},{onMimic:(this._inTutorial||noMimic)?null:()=>this.awakenMimic(mx,my,tier),relic:!this._inTutorial&&this.cardOpen?.('relic')!==false&&(this.relicSlotsLeft?.()??1)>0,bonusText:t=>{const b=this.miniChestBonus(t);return [b.sugar?'+'+b.sugar+' 🍬':'',b.cur?'+'+b.cur+' crafting':''].filter(Boolean).join('  ·  ');}});return;} // Keep the full reward sequence; no random upgrade box fallback.
    if(kind==='pick'&&Math.random()<0.10&&this.offerRelic())return;   // 🔮 กล่องลับ 10% = Relic (v5.19.1 ลดจาก 30%)
    if(kind==='pick'){this._chestReward=false; this.pendingLvl=(this.pendingLvl||0)+1; this.openLevelUp(); return;}   // กล่องในแมพ = เลือกเอง 1 ใบ
  }
  // กล่องสุ่ม (Miniboss): หมุนสล็อตแล้วลงที่รางวัลเดียว — ตื่นเต้นกว่าเลือกเอง
  // v4.25: ชาร์จแล้วพุ่ง — ลำแสงเล็งหนา สว่าง+หนาขึ้นเรื่อย ๆ ตอนชาร์จ แล้วพุ่งตามทิศที่ตรึงไว้ (หลบด้านข้างได้)
  chargeTelegraph(b,windMs,dashSpeed,thick){
    this.c3BossPose(b,2,windMs,'wind');
    const tx=this.player.x,ty=this.player.y,ang=Math.atan2(ty-b.y,tx-b.x);
    const reach=Math.max(this.dist(b.x,b.y,tx,ty)+200,540);
    const beam=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(b.y+1).setRotation(ang).setTint(0xff3a4a).setAlpha(0.22));
    beam.setDisplaySize(reach,Math.max(6,thick*0.42));this.kitLane(beam,this.stageIndex===10&&ASSET_FX.vfx_b11_stampede_trail&&this.bpAnim?.('vfx_b11_stampede_trail')?{h:thick*1.35,key:'vfx_b11_stampede_trail'}:{h:thick*1.35});   /* v7.9.29 C3-1 = รอยฝุ่นฟาง */   // v7.8.57 ใบ 22 lane
    this.tweens.add({targets:beam,alpha:0.92,duration:windMs*0.9,ease:'Sine.in'});
    this.tweens.add({targets:beam,scaleY:beam.scaleY*2.6,duration:windMs*0.9,ease:'Quad.in'});
    const gl=this.camWorld(this.add.image(b.x,b.y,'vfx_glow').setDepth(b.y+2).setTint(0xff5a6e).setScale(0.18).setAlpha(0.75));
    this.tweens.add({targets:gl,scale:thick>26?1.1:0.82,alpha:0,duration:windMs,ease:'Quad.in',onComplete:()=>{if(gl.active)gl.destroy();}});
    const follow=this.time.addEvent({delay:16,loop:true,callback:()=>{if(beam.active){beam.setPosition(b.x,b.y);}if(gl.active)gl.setPosition(b.x,b.y);}});
    Sfx.bossWarn&&Sfx.bossWarn();
    this.time.delayedCall(windMs,()=>{ follow.remove(false);
      if(beam.active)this.tweens.add({targets:beam,alpha:0,duration:160,onComplete:()=>{if(beam.active)beam.destroy();}});
      if(!b.active)return; if(b.tintColor)b.setTint(b.tintColor); else b.clearTint();
      this.screenFlash(0xff5a6e,0.16,150);Sfx.dash&&Sfx.dash();
      this.c3BossPose(b,3,460,'strike');b.setVelocity(Math.cos(ang)*dashSpeed,Math.sin(ang)*dashSpeed); b.knock=0.5;
      if(this.stageIndex===7)this.bossSig('08_dive_trail',b.x,b.y,240,{h:thick*1.6,anchor:'left',rot:ang+Math.PI,follow:b,life:.5,depth:b.depth-1}); });
  }
  landRollBox(cont,g,halo,rays,ico,em,nm,sub,cx,cy,cardW,cardH,winner,onDone){
    Sfx.stopSlotSpin();Sfx.rewardCue('sfx_event_special_card_pickup',.6);const col=winner.color||0xffd166;
    g.clear();g.fillStyle(0x2c2038,1);g.fillRoundedRect(cx-cardW/2,cy-cardH/2,cardW,cardH,18);g.lineStyle(5,col,1);g.strokeRoundedRect(cx-cardW/2,cy-cardH/2,cardW,cardH,18);
    halo.clear();halo.fillStyle(col,0.22);halo.fillRoundedRect(cx-cardW/2-8,cy-cardH/2-8,cardW+16,cardH+16,24);
    sub.setText('✨ '+(winner.desc||'Reward received!')).setColor('#ffe08a');
    const face=ico.visible?ico:em;
    this.tweens.add({targets:[face,nm],scale:{from:1.3,to:1},duration:340,ease:'Back.out'});
    if(rays){this.tweens.add({targets:rays,scale:{from:1.9,to:2.6},alpha:{from:0.35,to:0.6},yoyo:true,repeat:2,duration:260});}
    this.tweens.add({targets:halo,alpha:{from:0.22,to:0.5},yoyo:true,repeat:3,duration:200});
    this.screenFlash(col,0.42,340); this.hitStop&&this.hitStop(8);  this.burst(this.player.x,this.player.y,col); this.vfxLevelUp&&this.vfxLevelUp();
    // ประกายกระจายรอบการ์ด
    for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2,sp=this.add.circle(cx,cy,4,col,1).setScrollFactor(1);this.camUI(sp);cont.add(sp);this.tweens.add({targets:sp,x:cx+Math.cos(a)*(90+Math.random()*40),y:cy+Math.sin(a)*(90+Math.random()*40),alpha:0,scale:0.3,duration:520,ease:'Cubic.out'});}
    this.time.delayedCall(1050,()=>{
      this.tweens.add({targets:cont,alpha:0,duration:220,onComplete:()=>{cont.destroy(true);
        this.state=this._prevRollState==='rolling'?'play':(this._prevRollState||'play'); if(this.state!=='paused')this.physics.resume();
        if(onDone)onDone();
      }});
    });
  }
  // มอบของสวมใส่ตาม tier (สุ่มชิ้นที่ยังNone) — คืน item หรือ null ถ้ามีครบแล้ว
  // Endgame drop = โหมด endgame (Boss Rush/Endless/Zone Mods) และจบเนื้อเรื่องแล้วเท่านั้น
  endgameDropActive(){ return storyComplete()&&(!!this.riftMode||!!this.bossRush||((this._activeZoneMods||[]).length>0)); }
  endgameDepth(){ return (this._pinnacleRun?24:0)+(this.riftMode?(this._riftTier||1)*3:0)+(this._activeZoneMods||[]).length*4+(this.bossRush?(this._rushPos||0)*2:0); }
  grantGear(tier,opts={}){ if(tier==='legend')Sfx.legend(); const inPlay=!opts.tradeLv&&(this.state==='play'||(this.state!=='menu'&&!opts.gacha&&this.endgameDropActive())),sourceStage=inPlay?this.stageIndex:rewardSourceStage();
    // v4.32: gacha เลือก base item level ได้ (opts.itemLevel) → chapter ตาม iLv นั้น · in-play/menu ใช้ stage เดิม
    const gachaLv=(opts.gacha||opts.tradeLv)?Math.max(1,Math.min(100,Math.floor(opts.itemLevel||opts.tradeLv||1))):0,eg=inPlay&&this.endgameDropActive(),
      chapter=(opts.gacha||opts.tradeLv)?itemChapterFromLevel(gachaLv):eg?(Math.random()<0.5?4:5):itemChapterForStage(sourceStage);
    let pool=gearPool(tier,chapter); if(!pool.length&&tier==='common')pool=gearPool('rare',chapter);
    if(eg&&!opts.gacha){if(this._farmFocus==='materials'){this.grantCurrencyReward(2,tier,'Crafting materials');return null;}pool=this.focusGearPool(pool);}
    if(!pool.length)return null;
    // v4.29: ของนอกด่าน (forge/menu) ตั้ง floor iLv 12 → ได้ 2 mod · in-play ใช้ค่าจริง
    const it=Phaser.Utils.Array.GetRandom(pool),
      itemLevel=inPlay?(this.endgameDropActive()?rollEndgameItemLevel(this.stageDiff||1,this.endgameDepth()):rollItemLevel(sourceStage,this.stageDiff||1)):((opts.gacha||opts.tradeLv)?gachaLv:Math.max(12,rollItemLevel(sourceStage,1))),
      extra={isNew:true,itemLevel,chapter};
    /* v8.0.19 เจ้าของ: ของดรอป/กล่องท้ายด่านไม่มี mod จนกว่าจะสอน Forge (ร้าน/หีบ Bazaar ยังมี mod ได้) */ if(!opts.gacha&&!opts.tradeLv&&!opts.shop&&!this.recipeMode&&typeof Save!=='undefined'&&Save.data&&!Save.data._craftTutGift&&(typeof storyCleared!=='function'||storyCleared()<3)){ extra.affixes=[]; extra.craftState='common'; }
    // v4.32: gacha สุ่ม 0-1 mod เสมอ (50/50) · 0 mod = common (พื้นขาว) · 1 mod = magic
    if(opts.gacha){ const cnt=Math.random()<0.5?0:1, affs=cnt?rollAffixes(it.tier,itemLevel,it).slice(0,1):[]; extra.affixes=affs; extra.craftState=affs.length?'magic':'common'; }
    const delivery=Save.receiveGearInstance(it.id,extra); if(delivery&&!this._inTutorial)(typeof DailyQ!=='undefined')&&DailyQ.tick('gear');   // v7.5
    return delivery?Object.assign({},it,{instance:delivery.item,delivery:delivery.destination,shards:delivery.shards||0}):null; }
  // v4.31: gacha ลดเกรด — ส่วนใหญ่ common/rare, epic หายาก, ไม่มี legend (legend ได้จาก forge/ดรอปนรกเท่านั้น) · v4.32 รับ itemLevel ที่ผู้เล่นเลือก
  gachaRoll(itemLevel=1){ const r=Math.random(), roll=r<0.68?'common':r<0.97?'rare':'epic';   // 68% common · 29% rare · 3% epic
    for(const t of [roll,'rare','common','epic']){ const it=this.grantGear(t,{gacha:true,itemLevel}); if(it)return it; } return null; }
  touchEnemy(player,e){ if(!e.active||this.player.iframe>0||e._timeStop||(e._spawnGrace&&(this.time?.now||0)<e._spawnGrace))return;
    if(!e.shooter&&!e.acid&&!e.bomber&&!e.dasher&&this.anims.exists((e._enemyArtKey||e.texture.key)+'_attack'))this.enemyAction(e,'attack',340);
    if(this._inTutorial){ this.player.iframe=0.3; const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); if(!this.titanChanneling?.())this.player.setVelocity(Math.cos(a)*180,Math.sin(a)*180); return; }   // ระหว่างสอน = ไม่เสียเลือด แค่กระเด้งเบา ๆ
    if(typeof GM!=='undefined'&&GM.opt('god')){ this.player.iframe=0.3; return; }   /* v8.1.139 GM god: ชนมอนก็ไม่เสียเลือด (เดิมกันแค่กระสุน) */
    if(e.frostbite)this.moveSlowT=Math.max(this.moveSlowT||0,0.75);
    if(this.consumeShell()){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); if(!this.titanChanneling?.())this.player.setVelocity(Math.cos(a)*220,Math.sin(a)*220); return; }   // v4.89.2: ชนมอนก็ใช้โล่ Candy Shell (เดิมบล็อกแค่กระสุน)
    this._noteHit(e.isBoss?'boss':e.isMini?'mini':e.isElite?'elite':'swarm',Number.isFinite(e.dmg)?e.dmg:10);
    this.player.iframe=0.6*HURT_IFRAME_MUL; const wardMul=this.player.wardGuardT>0?0.70:1,crisisMul=this.player.hp/this.player.maxhp<0.40?1-(this.player.lowHpGuard||0):1; const edmg=Number.isFinite(e.dmg)?e.dmg:10; let taken=edmg*armorDamageMultiplier(this.player)*(this.player.dmgTakenMul||1)*wardMul*crisisMul*this.cocoaGuard()*this.condTakenMul()*(this.uqGuardMul?.()||1)*(this.sentryWardMul?.()||1);if(this.player.forgeMods){if(this.player.body&&this.player.body.velocity&&Math.hypot(this.player.body.velocity.x,this.player.body.velocity.y)<25)taken*=(100+Math.max(0,this.player.armor||0))/(100+Math.max(0,this.player.armor||0)+forgeValue(this.player,67));taken=forgeHurt(this,taken);}this.player.hp-=taken; this.charPassiveOnHurt(); Sfx.hurt(); this.screenShake(120,0.008);   // guard e.dmg NaN (กัน HP กลายเป็น NaN)
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>this.player.clearTint());
    this._sqX=0.7; this._sqY=1.3; this.poseFlash(CF.hurt,260);   // โดนตี = หน้าเจ็บ (เจลลี่แบน)
    const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x); if(!this.titanChanneling?.()){this.player.setVelocity(Math.cos(ang)*260,Math.sin(ang)*260); this.dashTime=0.12;}
    if(this.player.hp<=0) this.die(); }
  // 💀 สะสมดาเมจที่รับตามแหล่ง (หน้าตายบอกสาเหตุ) · รีเซ็ตใน startRun
  mxReset(){this._mx={t0:this.elapsed||0,dealt:0,over:0,hits:0,crits:0,dBoss:0,dMini:0,dElite:0,dMob:0,kills:0,src:{},fights:new Map(),done:[],taken:0,takenHits:0,dash:0,uq0:this._coachUnique||0,lv:[],lv0:this.level||1,waves:[],w0:this.waveIndex,sec:{},peak5:0,fpsN:0,fpsSum:0,fpsMin:999,lowSec:0,spikes:0,pFoe:0,pShot:0,pFx:0,acc:0,bsrc:{},wv:[],cw:null,heal:0,hpMin:1,lowHp:0,lastHp:null,lastMax:null,move:0,still:0,px:null,py:null,active:0,xp:0,maxHit:0,picks:[],casts:{},life:0,lifeN:0,mobHp:0,last5:[],maxTaken:0,maxTakenSrc:'',uqIdle:0,spd:{},sugar0:this.sugarRun||0};this._mx.cw={w:(this.waveIndex|0)+1,o:this.waveObjective?.name||'',t0:this.elapsed||0,d:0,k:0,tk:0,h:0};this._mx.wv.push(this._mx.cw);this._mxSrc=null;}
  mxSrcName(){if(this._infTick)return'infusion';if(this._frDmg)return'recipe';if(this._gmTick)return'gear';const c=this._taroDamageContext;if(c&&c.source)return'taro.'+c.source;return this._mxSrc||'other';}
  mxDeal(e,amount,crit){const m=this._mx;if(!m||e.isDummy||!(amount>0))return;const eff=Math.min(amount,Math.max(0,e.hp||0));m.dealt+=eff;m.over+=amount-eff;m.hits++;if(crit)m.crits++;
    if(e.isBoss)m.dBoss+=eff;else if(e.isMini)m.dMini+=eff;else if(e.isElite)m.dElite+=eff;else m.dMob+=eff;
    const k=this.mxSrcName(),r=m.src[k]||(m.src[k]=[0,0]);r[0]+=eff;r[1]++;if(m.cw)m.cw.d+=eff;if(eff>m.maxHit)m.maxHit=eff;if(e.isBoss||e.isMini){const q=m.bsrc[k]||(m.bsrc[k]=[0,0]);q[0]+=eff;q[1]++;}const b=Math.floor((this.elapsed||0)-m.t0);m.sec[b]=(m.sec[b]||0)+eff;
    if(e.isBoss||e.isMini){let f=m.fights.get(e);if(!f){f={n:(e.isBoss?'Boss ':'Mini ')+((this.boss===e&&this.bossName?.text?this.bossName.text.replace(/^\S+\s/,'').split(' · ')[0].slice(0,28):'')||e.roleName||e.texture?.key||'?'),hp:e.maxhp||0,t0:this.elapsed||0,d:0,e};m.fights.set(e,f);}f.d+=eff;f.t1=this.elapsed||0;}}
  recipeNote(c){ try{ const o=c&&c.opt,b=this.basicAttack,d=Save.data; if(!o||!b||!d||this._inTutorial)return; const hero=b.character||this.character; if(typeof HEROES_WIP!=='undefined'&&HEROES_WIP.includes(hero))return;
      const pid=o.kind==='Build Path'?o.key:b.path; if(!pid)return; const L=recipeCards(hero,pid); if(!L.length)return; const id=o.kind==='⭐ Unique Mutation'?'uq:'+o.key:o.key,R=d.recipeBook||(d.recipeBook={}),H=R[hero]||(R[hero]={}),P=H[pid]||(H[pid]={});
      if(o.kind==='Build Path'){ P._path=1; return; } if(!L.some(x=>x.id===id)||P[id])return; P[id]=1;
      if(L.every(x=>P[x.id])&&!P._done){ P._done=1;Save.addThreads(RECIPE_PATH_THREAD);if(typeof Sfx!=='undefined')Sfx.orderCue?.('recipe_complete',.45,1); const pt=(BASIC_PATHS[hero]||[]).find(x=>x.id===pid); this.time?.delayedCall(1200,()=>this.showBanner?.('📖 Recipe complete!',(pt?pt.emoji+' '+pt.name:'Build')+' · every card found · 🧶 +'+RECIPE_PATH_THREAD,2000)); } Save.save(); }catch(e){} }
  mxPick(c){const m=this._mx;if(!m||!c)return;const others=(this.lvlCards||[]).filter(x=>x!==c).map(x=>x.title);m.picks.push('L'+(this.level||1)+' '+mxClock((this.elapsed||0)-m.t0)+' '+c.title+(others.length?' (over '+others.join(' / ')+')':''));}
  mxDash(){if(this._mx&&this.state==='play')this._mx.dash++;}
  mxKill(e){const m=this._mx;if(!m||e.isDummy)return;m.kills++;if(m.cw)m.cw.k++;if(!e.isBoss&&!e.isMini&&e._mxBorn!=null){m.life+=Math.max(0,(this.elapsed||0)-e._mxBorn);m.lifeN++;m.mobHp+=e.maxhp||0;}const f=m.fights.get(e);if(f){f.done=true;f.t1=this.elapsed||0;m.done.push(f);m.fights.delete(e);}}
  mxTick(dt){const m=this._mx;if(!m)return;const now=this.elapsed||0;
    if(this.state==='play'){const fps=this.game?.loop?.actualFps||60,dm=this.game?.loop?.delta||16;if(dm>50)m.spikes++;m.acc+=dt;if(m.acc>=1){m.acc=0;m.fpsN++;m.fpsSum+=fps;m.fpsMin=Math.min(m.fpsMin,fps);if(fps<30)m.lowSec++;
        const b=Math.floor(now-m.t0);let s5=0;for(let i=b-5;i<b;i++)s5+=m.sec[i]||0;m.peak5=Math.max(m.peak5,s5/5);if((m.sec[b-1]||0)>0)m.active++;for(const k in m.sec)if(+k<b-6)delete m.sec[k];
        m.pFoe=Math.max(m.pFoe,this.enemies?.countActive?.(true)||0);m.pShot=Math.max(m.pShot,this.foeBullets?.countActive?.(true)||0);m.pFx=Math.max(m.pFx,(this._artVfx?.size||0)+(this._taroFxLive||0)+(this._c24Live||0));}
      if(m.lvAt==null)m.lvAt=this.level||1;while((this.level||1)>m.lvAt){m.lvAt++;m.lv.push('L'+m.lvAt+' '+mxClock(now-m.t0));}   /* v7.8.40 นับทีละเลเวล · เริ่มจากเลเวลตอนเฟรมแรกของรอบ (เดิมใช้เลเวลรอบก่อน) */
      if(this.waveIndex!==m.w0){m.w0=this.waveIndex;m.waves.push('W'+((this.waveIndex|0)+1)+' '+mxClock(now-m.t0));if(m.cw)m.cw.t1=now;m.cw={w:(this.waveIndex|0)+1,o:this.waveObjective?.name||'',t0:now,d:0,k:0,tk:0,h:0};m.wv.push(m.cw);}
      if(m.cw&&!m.cw.o&&this.waveObjective?.name)m.cw.o=this.waveObjective.name;
      if(m.cw&&this.mode==='boss'&&!m.cw.boss){m.cw.t1=now;m.cw={w:'boss',boss:true,t0:now,d:0,k:0,tk:0,h:0};m.wv.push(m.cw);}
      if((this.uniqueCd||0)<=0&&this.uniqueBtn?.visible)m.uqIdle+=dt;const gs='x'+(this.gameSpeed||1);m.spd[gs]=(m.spd[gs]||0)+dt;
      const P=this.player;if(P){const hp=Math.max(0,P.hp||0),mx=Math.max(1,P.maxhp||1);if(m.lastHp!=null&&hp>m.lastHp)m.heal+=Math.max(0,(hp-m.lastHp)-Math.max(0,mx-(m.lastMax||mx)));m.lastHp=hp;m.lastMax=mx;const f=hp/mx;if(f<m.hpMin)m.hpMin=f;if(f<.3)m.lowHp+=dt;
        if(m.px!=null){const d=Math.hypot(P.x-m.px,P.y-m.py);if(d<200)m.move+=d;}m.px=P.x;m.py=P.y;if((P.body?.velocity?.length?.()||0)<25)m.still+=dt;}
      for(const f of m.fights.values()){const e=f.e;if(!e?.active)continue;if(e.phase2&&f.p2==null)f.p2=now-f.t0;if(e.phase3&&f.p3==null)f.p3=now-f.t0;}}
    this.mxOverlay(now);}
  mxOverlay(now){const on=!!Save.data.settings?.mx&&(this.state==='play'||this.state==='levelup'),m=this._mx;
    if(!on||!m){if(this._mxTxt)this._mxTxt.setVisible(false);return;}
    if(!this._mxTxt?.active){this._mxTxt=this.add.text(8,0,'',{fontFamily:'monospace',fontStyle:'bold',fontSize:'10px',color:'#bff4ff',stroke:'#14101c',strokeThickness:3,lineSpacing:1}).setScrollFactor(1).setDepth(56);this.camUI(this._mxTxt);}
    if(now-(this._mxAt||0)<.5){this._mxTxt.setVisible(true);return;}this._mxAt=now;const b=Math.floor(now-m.t0);let s5=0;for(let i=b-5;i<b;i++)s5+=m.sec[i]||0;
    let f=null;for(const x of m.fights.values())if(x.e.active&&(!f||x.e.isBoss))f=x;const t=Math.max(1,now-m.t0);
    const L=['DPS '+mxFmt(s5/5)+' · avg '+mxFmt(m.dealt/t)+' · '+mxFmt(m.dealt),f?(f.n.slice(0,18)+' '+mxFmt(f.d/Math.max(.5,(f.t1||now)-f.t0))+'/s · '+((now-f.t0)|0)+'s · '+Math.round(100*Math.max(0,f.e.hp)/Math.max(1,f.e.maxhp))+'%'):('kills '+m.kills+' · taken '+mxFmt(m.taken)+' ('+m.takenHits+')'),
      'FPS '+Math.round(this.game?.loop?.actualFps||0)+' · foes '+(this.enemies?.countActive?.(true)||0)+' · shots '+(this.foeBullets?.countActive?.(true)||0)+' · fx '+((this._artVfx?.size||0)+(this._taroFxLive||0)+(this._c24Live||0))];
    this._mxTxt.setText(L.join('\n')).setPosition(8,Math.round(this.H*.36)).setVisible(true);}
  mxSummary(){const m=this._mx;if(!m)return null;const now=this.elapsed||0,sec=Math.max(1,Math.round(now-m.t0)),tot=m.dealt||1;
    const fights=[...m.done,...[...m.fights.values()].map(f=>({...f,done:false}))].map(f=>{const s=Math.max(.1,(f.t1||now)-f.t0);return {n:f.n,hp:Math.round(f.hp),sec:+s.toFixed(1),dps:Math.round(f.d/s),done:!!f.done,p2:f.p2!=null?+f.p2.toFixed(1):null,p3:f.p3!=null?+f.p3.toFixed(1):null,hpLeft:f.done?0:Math.round(100*Math.max(0,f.e?.hp||0)/Math.max(1,f.hp))};}).slice(0,12);
    const src=Object.entries(m.src).sort((a,b)=>b[1][0]-a[1][0]).slice(0,10).map(([k,v])=>[k,Math.round(100*v[0]/tot),Math.round(v[0]),v[1]]),btot=(m.dBoss+m.dMini)||1;
    const bsrc=Object.entries(m.bsrc).sort((a,b)=>b[1][0]-a[1][0]).slice(0,6).map(([k,v])=>[k,Math.round(100*v[0]/btot),Math.round(v[0]),v[1]]);
    const wv=m.wv.filter(w=>w.d||w.k||w.tk).map(w=>({w:w.w,sec:+Math.max(.1,(w.t1||now)-w.t0).toFixed(1),d:Math.round(w.d),k:w.k,tk:Math.round(w.tk),h:w.h}));
    return {sec,dealt:Math.round(m.dealt),over:Math.round(m.over),hits:m.hits,crits:m.crits,dBoss:Math.round(m.dBoss),dMini:Math.round(m.dMini),dElite:Math.round(m.dElite),dMob:Math.round(m.dMob),kills:m.kills,peak5:Math.round(m.peak5),fights,src,taken:Math.round(m.taken),takenHits:m.takenHits,dash:m.dash,uq:Math.max(0,(this._coachUnique||0)-m.uq0),lv:m.lv.join(' '),waves:m.waves.join(' '),
      bsrc,wv:wv.map((w,i)=>({...w,o:(m.wv.filter(x=>x.d||x.k||x.tk)[i]||{}).o||''})),picks:m.picks.slice(0,40),casts:m.casts,mobLife:m.lifeN?+(m.life/m.lifeN).toFixed(2):0,mobHp:m.lifeN?Math.round(m.mobHp/m.lifeN):0,last5:(()=>{const o={};for(const [,k,d] of m.last5)o[k]=(o[k]||0)+d;return Object.entries(o).map(([k,d])=>k+' '+Math.round(d)).join(', ');})(),maxTaken:Math.round(m.maxTaken),maxTakenSrc:m.maxTakenSrc,uqIdle:Math.round(m.uqIdle),spd:Object.entries(m.spd).map(([k,v])=>k+' '+Math.round(100*v/sec)+'%').join(' '),sugar:Math.max(0,(this.sugarRun||0)-m.sugar0),boxes:(this._runBoxes||[]).length,cur:Object.values(this._runCurrency||{}).reduce((a,b)=>a+(+b||0),0),
      end:(()=>{const P=this.player||{};return 'HP '+Math.round(P.maxhp||0)+' · DMG ×'+(P.dmgMul||1).toFixed(2)+' · power ×'+(P.powerMul||1).toFixed(2)+' · crit '+Math.round(100*(P.critChance||0))+'% · CD ×'+(P.cdMul||1).toFixed(2)+' · speed '+Math.round(P.baseSpeed||0)+' · taken ×'+(P.dmgTakenMul||1).toFixed(2);})(),heal:Math.round(m.heal),hpMin:Math.round(100*m.hpMin),lowHp:Math.round(m.lowHp),move:Math.round(m.move),still:Math.round(100*m.still/sec),active:Math.round(100*m.active/sec),xp:Math.round(m.xp),maxHit:Math.round(m.maxHit),
      fpsAvg:m.fpsN?Math.round(m.fpsSum/m.fpsN):0,fpsMin:m.fpsN?Math.round(m.fpsMin):0,lowSec:m.lowSec,spikes:m.spikes,pFoe:m.pFoe,pShot:m.pShot,pFx:m.pFx,texMB:Math.round(this.texMB?.()||0)};}
  _noteHit(src,dmg){ if(this._mx){const M=this._mx,now=this.elapsed||0;M.last5.push([now,src,+dmg||0]);while(M.last5.length&&now-M.last5[0][0]>5)M.last5.shift();if((+dmg||0)>M.maxTaken){M.maxTaken=+dmg||0;M.maxTakenSrc=src;}this._mx.taken+=+dmg||0;this._mx.takenHits++;if(this._mx.cw){this._mx.cw.tk+=+dmg||0;this._mx.cw.h++;}} if(this._miniFight&&this.mode==='mini')this._miniFight.hits++; const d=this._dmgBy||(this._dmgBy={}); d[src]=(d[src]||0)+(+dmg||0); this._lastHitSrc=src; }
  deathReason(){ const d=this._dmgBy||{},top=Object.keys(d).sort((a,b)=>d[b]-d[a])[0]||this._lastHitSrc||'swarm';
    const R={boss:['👑 Boss attacks','Watch the red telegraphs and Dash through big attacks.'],mini:['😈 Miniboss','Kite in circles and Dash when it charges.'],
      elite:['💪 Elite enemies','Focus elites first — they hit hard up close.'],shot:['🎯 Projectiles & hazards','Keep moving; don’t stand in glowing zones.'],
      swarm:['🐜 Swarmed by enemies','Keep moving and use Dash to escape crowds.']};
    return R[top]||R.swarm; }
  // โดนกระสุน/สแลม/hazard ของศัตรู (iframe สั้นกว่า → หลบยาก)
  hurtPlayer(dmg,ix){ if(this.state!=='play'||this.player.iframe>0)return;
    if(this.consumeShell())return;   // 🔮 Candy Shell
    if(this._inTutorial)return;
    if(typeof GM!=='undefined'&&GM.opt('god'))return;
    this.objBonusHit?.();   // ระหว่างสอน = Invincible (freeze safe zone) ผู้เล่นใหม่จะได้ไม่ตายตอนเรียน
    if(!Number.isFinite(dmg))dmg=10;
    if(this.character==='yuzu'){dmg=this.yuzuAbsorb(dmg*this.yuzuGuard());if(dmg<=0)return;}   // guard NaN
    dmg*=armorDamageMultiplier(this.player)*(this.player.dmgTakenMul||1)*this.cocoaGuard()*this.condTakenMul()*(this.player.wardGuardT>0?0.70:1)*(this.player.hp/this.player.maxhp<0.40?1-(this.player.lowHpGuard||0):1);   // เกราะ + เขตคำสัตย์ + emergency guard
    if(this.player.forgeMods){const p=this.player;if(p.body&&p.body.velocity&&Math.hypot(p.body.velocity.x,p.body.velocity.y)<25)dmg*=(100+Math.max(0,p.armor||0))/(100+Math.max(0,p.armor||0)+forgeValue(p,67));dmg=forgeHurt(this,dmg);}
    if(this.isSesRune?.()){dmg=this.sesRuneAbsorb(dmg);if(dmg<=0){this.player.iframe=(ix||.5)*HURT_IFRAME_MUL;return;}}
    this._noteHit(this.mode==='boss'?'boss':this.mode==='mini'?'mini':'shot',dmg);
    this.player.iframe=(ix||0.5)*HURT_IFRAME_MUL; this.player.hp-=dmg; this.charPassiveOnHurt(); Sfx.hurt(); this.screenShake(150,0.009);
    this._sqX=0.72; this._sqY=1.28; this.poseFlash(CF.hurt,260);
    this.vfxHurtFlash();
    this.vfxHitRing(this.player.x,this.player.y,0xff5a6e,false);
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>{ if(this.player.active)this.player.clearTint(); });
    if(this.player.hp<=0) this.die(); }
  hitByFoe(player,b){ if(!b.active)return; if(b._huntCurse){ b._huntCurse=false; this.huntCurseHit?.(); this.artFx?.('hn87_poison_splash',player.x,player.y,80); this.a12?.('a16_bottle_shatter',.45,.2); } if(b.frost)this.moveSlowT=Math.max(this.moveSlowT||0,0.9); this.killFoe(b); this.hurtPlayer(b.dmg||10,0.5); }
  killFoe(b){ b.beh=null;this.dropBossShotLoop?.(b); b.spin=0; b._bst=null; b.setAlpha?.(1); b.setActive(false).setVisible(false); if(b.body){ b.body.enable=false; b.body.stop(); } }
  // ยิงกระสุนศัตรู 1 นัด
  foeShot(x,y,ang,speed,dmg,tint,scale){
    if(this.bossNoShotAt?.(x,y,dmg))return null; speed*=(this.rpMul?.('foeShot')||1);   /* v8.2.29 Glass Garden */   // v8.0.74 บอสสายร่างกาย: ไม่มีกระสุน
    let b=this.foeBullets.getFirstDead(false);
    if(!b) b=this.foeBullets.create(x,y,'proj_enemy'); else { b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }
    if(!b)return null;   // pool Full → ข้ามการยิง กัน null crash
    this.dropBossShotLoop?.(b,false);if(b.anims?.isPlaying)b.anims.stop();   // v7.8.32 กระสุนอาร์ตบอส C2-4 เล่นอนิเมชัน → หยุดก่อนใช้ซ้ำ
    b.setTexture(this.textures.exists('cr_foe_bolt')?'cr_foe_bolt':this.textures.exists('proj_foe')?'proj_foe':'proj_enemy').setScale((scale||1.4)*0.34).setRotation(ang).setDepth(90000);
    b.clearTint();   // v5.78 กระสุนศัตรูสีเดียวทั้งเกม (เขียวเรือง+ขอบเข้ม) ไม่ย้อมตามด่าน → อ่านง่ายบนทุกพื้น
    if(b.body){b.body.setAllowGravity(false);} b.dmg=dmg; b._huntCurse=false; b.frost=this.stageIndex===3; b.life=3.0; this.camWorld(b);
    if(b.body)this.physics.velocityFromRotation(ang,speed,b.body.velocity); b.beh=null; const st=this.bossShotStyleAt?.(x,y); if(st)this.bossShotApply(b,st,ang,speed,true); return b; }
  bossNoShotAt(x,y,dmg){ if(this._bsChild||this._pinnacleRun||typeof BOSS_NO_SHOT==='undefined'||!BOSS_NO_SHOT.has(this.stageIndex|0))return false; const L=this._bigsNow?.()||[];
    for(const e of L){ if(e.delveBoss||e._pinnacleArt)continue; const r=Math.max(e.displayWidth||0,e.displayHeight||0)*.6+40,dx=x-e.x,dy=y-e.y; if(dx*dx+dy*dy>r*r)continue; const now=this.time?.now??Date.now(); if(now-(e._nsAt||-1e9)>1100){ e._nsAt=now; this.bossBodyMove(e,dmg); } return true; } return false; }
  bossBodyMove(e,dmg){const p=this.player;if(!p||!e.active||e._fogCharge)return;const inkCast=this.bossInkBegin?.(e);this.bossInkPose?.(e,3,1250,'attack'); const k=e._nsK=((e._nsK||0)+1)%4,dm=Math.max(1,Math.round((dmg||10)*2)),c=BOSS_SHOT[this.stageIndex|0]?.c||0xff5a4d,a=Math.atan2(p.y-e.y,p.x-e.x),T=(ms,f)=>this.time.delayedCall(ms,()=>{ if(e.active&&this.state==='play')f(); });
    const fx=(key,fx0,fy0,w,o)=>{const impact=e.isBoss&&/^vfx_body_(shockwave|skydrop)$/.test(key)?'vfx_b'+String(this.stageIndex+1).padStart(2,'0')+'_impact':null,base=impact&&this.bossOutlineKey?.(impact)?impact:key,fresh=this.bossOutlineKey?.(base);if(fresh&&key==='vfx_body_skydrop'){const pl=this.player,ba=this.basicAttack,stage=this.stageIndex;this.artDelay?.(760,()=>{if(e.active&&this.state==='play'&&this.player===pl&&this.basicAttack===ba&&this.stageIndex===stage)this.heroFx?.(fresh,fx0,fy0,w,base===key?{...o,tint:c}:o);});return null;}return this.heroFx?.(base,fx0,fy0,w,fresh&&base===key?{...o,tint:c}:o);};   /* ใบ 60 ภาพทับวงเตือนเดิม (เวลา/รัศมีเดิม) */
    if(k===0){ for(let i=1;i<=6;i++)T(i*110,()=>{ const hx=e.x+Math.cos(a)*i*72,hy=e.y+Math.sin(a)*i*72; this.spawnHazard(hx,hy,46,dm,c,e,inkCast); this.time.delayedCall(700,()=>fx('vfx_body_shockwave',hx,hy,102)); }); }   // คลื่นพื้นเป็นเส้นตรงไปหาผู้เล่น
    else if(k===1){ const n=this.time?.now??0; if(n>(e._nsChg||0)&&typeof this.chargeTelegraph==='function'){ e._nsChg=n+1600; this.chargeTelegraph(e,650,700,26); this.time.delayedCall(650,()=>{ if(e.active)fx('vfx_body_charge',e.x,e.y,200,{rot:a+Math.PI,follow:e}); }); } else this.spawnHazard(p.x,p.y,80,dm,c,e,inkCast); }   // พุ่งชน
    else if(k===2){ const px=p.x,py=p.y; for(let i=0;i<3;i++){ const r=Math.random()*110,t=Math.random()*Math.PI*2; T(i*180,()=>{ const hx=px+Math.cos(t)*r,hy=py+Math.sin(t)*r; this.spawnHazard(hx,hy,64,dm,c,e,inkCast); fx('vfx_body_skydrop',hx,hy,142); }); } }   // ของตกจากฟ้ารอบตัวผู้เล่น
    else { for(let i=0;i<5;i++){ const t=a+(i/4-.5)*Math.PI*.67; this.spawnHazard(e.x+Math.cos(t)*140,e.y+Math.sin(t)*140,56,dm,c,e,inkCast); } this.time.delayedCall(700,()=>{ if(e.active)fx('vfx_body_sweep',e.x+Math.cos(a)*110,e.y+Math.sin(a)*110,300,{rot:a}); }); } }   // ปัดกวาดเป็นโค้งหน้าบอส
  // v8.0.72 กระสุนที่เกิดใกล้บอส/มินิบอส (รวมท่าหน่วงเวลา) = กระสุนของบอสนั้น
  bossShotStyleAt(x,y){ if(this._bsChild||typeof BOSS_SHOT==='undefined')return null; const L=this._bigsNow?.()||[]; for(const e of L){ if(e.delveBoss)continue; const r=Math.max(e.displayWidth||0,e.displayHeight||0)*.6+40,dx=x-e.x,dy=y-e.y; if(dx*dx+dy*dy<=r*r)return (e._pinnacleArt||this._pinnacleRun)?BOSS_SHOT_PIN:BOSS_SHOT[Math.max(0,Math.min(BOSS_SHOT.length-1,this.stageIndex|0))]; } return null; }
  bossShotLoop(b,base){
    this.dropBossShotLoop(b,false);const key=BOSS_SHOT817_MAP[base];if(!b?.active||!key||!this.realTex?.(key))return false;
    b.anims?.stop();b.setTexture(key,0);b._bossShot817={base,key,player:this.player,stage:this.stageIndex,epoch:this._artEpoch||0,serial:b._bossShotSerial817=(b._bossShotSerial817||0)+1,t:0,frame:0};
    (this._bossShotLoops||(this._bossShotLoops=new Set())).add(b);if(!this._bossShotLoopHook&&this.events?.once){this._bossShotLoopHook=true;this.events.once('shutdown',()=>{this.clearBossShotLoops();this._bossShotLoopHook=false;});}return true;
  }
  dropBossShotLoop(b,restore=true){
    const m=b?._bossShot817;if(!m)return;if(restore&&b.texture?.key===m.key&&this.realTex?.(m.base))b.setTexture(m.base);
    this._bossShotLoops?.delete(b);delete b._bossShot817;
  }
  tickBossShotLoops(wallDt){
    if(this.state!=='play')return;const still=this.hubMotionAllowed?.()===false||(typeof Save!=='undefined'&&Save.data.settings?.vfx===0);
    for(const b of this._bossShotLoops||[]){const m=b._bossShot817;if(!b.active||!m||m.serial!==b._bossShotSerial817||m.player!==this.player||m.stage!==this.stageIndex||m.epoch!==(this._artEpoch||0)||b.texture?.key!==m.key){this.dropBossShotLoop(b);continue;}
      m.t+=Math.max(0,wallDt||0);const fd=(typeof ASSET_FX!=='undefined'&&ASSET_FX[m.key])||{},nf=Math.max(1,fd.frames||4),rt=fd.rate||8;const f=still?1:Math.floor(m.t*rt)%nf;if(m.frame!==f){m.frame=f;b.setFrame(f);}}   /* v8.2.84 เฟส 5D: เล่นตามจำนวนเฟรม/ความเร็วที่ลงทะเบียน (8@16 = รอบ 0.5 วิเท่าเดิม) */
  }
  clearBossShotLoops(){for(const b of [...(this._bossShotLoops||[])])this.dropBossShotLoop(b);this._bossShotLoops?.clear();}

  bossShotApply(b,st,ang,speed,beh){ const pk=st.p&&this.textures.exists(st.p)?st.p:null; if(!pk&&!this.textures.exists(st.k))return; if(pk)b.setTexture(pk).clearTint(); else b.setTexture(st.k).setTint(st.c); if(st.s!==1)b.setScale(b.scaleX*st.s); b.beh=beh?st.b:null; b._bst=st; b.bt=0; b.ba=ang; b.bspd=speed; b._bn=0; b._bdone=0; b.spin=st.k==='boss_star'&&!pk?6:0; if(pk)b.rotation=ang;if(pk)this.bossShotLoop?.(b,pk); }
  bossShotKids(p,n,spread,base,spdMul,dmgMul){ if((this.foeBullets.countActive?.(true)||0)>210)return; this._bsChild=true; try{ for(let i=0;i<n;i++){ const a=base+(n===1?0:spread*(i/(n-1)-.5)),c=this.foeShot(p.x,p.y,a,p.bspd*spdMul,Math.max(1,Math.round(p.dmg*dmgMul)),null,1.4); if(c){ this.bossShotApply(c,p._bst,a,p.bspd*spdMul,false); c.setScale(c.scaleX*.72); c.frost=p.frost; c.life=1.8; } } } finally{ this._bsChild=false; } }
  bossShotTick(b,dt){ const v=b.body?.velocity; if(!v)return; b.bt+=dt; if(b.spin)b.rotation+=b.spin*dt;
    switch(b.beh){
      case 'wave':{ const a=b.ba+Math.sin(b.bt*7)*.55; this.physics.velocityFromRotation(a,b.bspd,v); if(!b.spin)b.rotation=a; break; }
      case 'home':{ if(b.bt>1.3||!this.player)break; const want=Math.atan2(this.player.y-b.y,this.player.x-b.x),cur=Math.atan2(v.y,v.x),d=Phaser.Math.Angle.Wrap(want-cur),a=cur+Math.max(-1.7*dt,Math.min(1.7*dt,d)); this.physics.velocityFromRotation(a,b.bspd,v); if(!b.spin)b.rotation=a; break; }
      case 'boomer':{ if(!b._bdone&&b.bt>=.85){ b._bdone=1; v.x*=-.9; v.y*=-.9; b.life=Math.max(b.life,1.7); if(!b.spin)b.rotation+=Math.PI; } break; }
      case 'bounce':{ const V=this.cameras.main.worldView; if(b._bn>=2)break; if((b.x<V.x&&v.x<0)||(b.x>V.right&&v.x>0)){ v.x=-v.x; b._bn++; } if((b.y<V.y&&v.y<0)||(b.y>V.bottom&&v.y>0)){ v.y=-v.y; b._bn++; } if(!b.spin)b.rotation=Math.atan2(v.y,v.x); break; }
      case 'split':{ if(b.bt>=.7){ b.beh=null; this.bossShotKids(b,3,.9,Math.atan2(v.y,v.x),.9,.55); this.killFoe(b); } break; }
      case 'delay':{ if(b.bt>=.55&&!b._bdone){ b._bdone=1; v.x=0; v.y=0; } if(b._bdone)b.setAlpha(.55+.45*Math.abs(Math.sin(b.bt*18))); if(b.bt>=1.25){ b.beh=null; b.setAlpha(1); this.bossShotKids(b,6,Math.PI*2*5/6,Math.random()*Math.PI,.7,.5); this.killFoe(b); } break; }
    } }
  // hazard บอส: วงเตือน vector โปร่งใสจริง → ระเบิดหลัง 760ms
  spawnHazard(x,y,r,dmg,tint,inkOwner=null,inkGuard=null){
    const color=tint||0xff5a4d,wk=this.bossKit('warn'),ik=this.bossKit('impact');let warn,inner,codeTg=null;
    if(typeof CODE_TELEGRAPH!=='undefined'&&CODE_TELEGRAPH&&(codeTg=this.codeTelegraph?.(x,y,r,760,color))){ warn=codeTg.rim; inner=codeTg.fill; }   /* v8.1.155 เจ้าของ: วงเตือนวาดด้วยโค้ด (CODE_VS_ART รอบ 2 ข้อ 1) · ปิด = CODE_TELEGRAPH=false กลับเป็นภาพเดิม */
    else if(wk){const [w,h]=this.kitSize(wk,r);warn=this.camWorld(this.add.sprite(x,y,wk,0).setDepth(2).setDisplaySize(w,h).setAlpha(0.5));warn.play(wk);inner=this.camWorld(this.add.image(x,y,'vfx_glow').setDepth(2).setScale((r*0.5)/256).setTint(color).setAlpha(0.08));
      this.tweens.add({targets:warn,alpha:1,duration:700,ease:'Quad.in'});this.tweens.add({targets:inner,scale:(r*1.6)/256,alpha:0.28,duration:700,ease:'Linear'});}   // v7.8.57 ใบ 22: วงเตือนตามธีมด่าน · ค่อย ๆ ชัดขึ้น = จังหวะระเบิด (ระยะ/เวลาเดิม)
    else{
    warn=this.camWorld(this.add.image(x,y,'vfx_telegraph').setDepth(2).setScale((r*2)/256*0.94).setTint(color).setAlpha(0.65));
    inner=this.camWorld(this.add.image(x,y,'vfx_glow').setDepth(2).setScale((r*0.65)/256).setTint(color).setAlpha(0.18));
    this.tweens.add({targets:warn,alpha:{from:0.4,to:0.92},scale:{from:(r*2)/256*0.92,to:(r*2)/256*1.03},duration:190,yoyo:true,repeat:1});
    this.tweens.add({targets:inner,scale:(r*1.75)/256,alpha:{from:0.12,to:0.48},duration:700,ease:'Linear'});}
    const readable=codeTg?null:this.makeHazardReadability?.(x,y,r,760);if(readable){this.tweens.killTweensOf(warn);this.tweens.killTweensOf(inner);warn.setAlpha(.18);inner.setAlpha(0);}
    this.time.delayedCall(760,()=>{ readable?.kill();if(this.state!=='play'&&this.state!=='levelup'){ warn.destroy();inner.destroy();return; }
      this.bossInkRelease?.(inkOwner,inkGuard);
      const cwi=this.bossCodeWaveCol?.(); if(cwi)this.codeShock?.(x,y,r,cwi,{depth:4,flat:.85,crack:true,dust:14,rings:2,w:14,dur:460,crackCol:0x3a2230});
      else if(ik)this.heroFx(ik,x,y,r*2/.88,{must:true,depth:4});
      else if(this.anims.exists('fx_bossnova'))this.spawnFxAnim('fx_bossnova',x,y,{scale:(r*2)/ASSET_FX.fx_bossnova.fw,depth:4,anchor:'center'});
      else { const boom=this.camWorld(this.add.image(x,y,'vfx_ring').setDepth(4).setTint(color).setScale((r*2)/256).setAlpha(0.9));
        this.tweens.add({targets:boom,alpha:0,scaleX:boom.scaleX*1.18,scaleY:boom.scaleY*1.18,duration:280,onComplete:()=>boom.destroy()}); }
      this.tweens.add({targets:[warn,inner],alpha:0,duration:180,onComplete:()=>{warn.destroy();inner.destroy();}});
      this.sesMirrorBreak?.((mx,my)=>this.dist(mx,my,x,y)<r+8);   // v7.9.40 กระจกงาดำแตก
      if(this.dist(this.player.x,this.player.y,x,y)<r+8){const hp=this.player.hp;this.hurtPlayer(dmg,0.5);if(this.player.hp<hp&&[0xd95cff,0xb46cff,0x56e5bd,0x53caa4].includes(color)&&this.time.now-(this._toxicSfxAt??-Infinity)>3000){this._toxicSfxAt=this.time.now;Sfx.rewardCue?.('sfx_event_poison_apply',.58);this.floatText(this.player.x,this.player.y-58,'TOXIC HIT',0xb7ffbc);}}
      Sfx.boom();
    });
  }
  /* v8.1.156 CODE_VS_ART รอบ 2 ข้อ 7 (ทดลอง): บอสที่อยู่ใน CODE_VFX.bossWave ใช้คลื่น/แรงกระแทกวาดด้วยโค้ด · คืนสีบอส หรือ null = ใช้ภาพเดิม */
  bossCodeWaveCol(){ if(typeof CODE_VFX==='undefined'||!CODE_VFX.bossWave?.length||this._pinnacleRun)return null; const i=this.stageIndex; if(!(i>=0&&i<15))return null; const id='b'+(i<9?'0':'')+(i+1); if(!CODE_VFX.bossWave.includes(id))return null; return (typeof STAGES!=='undefined'&&STAGES[i]?.tint)||0xff8fb5; }
  bossNovaWave(x,y,maxR,dmg,delay=0,inkOwner=null,inkGuard=null){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      this.bossInkRelease?.(inkOwner,inkGuard);
      let hitOnce=false;
      const cw=this.bossCodeWaveCol?.(); if(cw&&this.add?.graphics){ const g=this.camWorld(this.add.graphics().setDepth(4)),track={radius:10},bits=Array.from({length:14},(_,i)=>({a:i/14*Math.PI*2+Math.random()*.3,o:(Math.random()-.5)*20,s:2+Math.random()*3}));
        this.tweens.add({targets:track,radius:maxR,duration:720,ease:'Quad.out',onUpdate:(tw)=>{ const rr=track.radius,f=1-tw.progress*.7; if(g.active){ g.clear().lineStyle(56,cw,.10*f).strokeCircle(x,y,rr).lineStyle(14,cw,.75*f).strokeCircle(x,y,rr).lineStyle(4,0xffffff,.8*f).strokeCircle(x,y,rr-3); for(const q of bits)g.fillStyle(q.s>3.5?0xffffff:cw,.9*f).fillCircle(x+Math.cos(q.a)*(rr+q.o),y+Math.sin(q.a)*(rr+q.o),q.s); }
            const d=this.dist(this.player.x,this.player.y,x,y); if(!hitOnce&&Math.abs(d-rr)<28){hitOnce=true;this.hurtPlayer(dmg,0.6);} this.sesMirrorBreak?.((mx,my)=>Math.abs(this.dist(mx,my,x,y)-rr)<28); },
          onComplete:()=>g.destroy()}); return; }   /* v8.1.156 ข้อ 7: วงคลื่นโค้ด · แถบโปร่ง 56px = ช่วงที่โดนจริง (±28) */
      const wk=this.bossKit('wave'),wave=wk?this.camWorld(this.add.sprite(x,y,wk,0).setDepth(4).setAlpha(0.95)):this.camWorld(this.add.image(x,y,'vfx_cream_ring').setTint(0xff8fb5).setDepth(4).setScale(20/256).setAlpha(0.95));if(wk){wave.play(wk);this.battleOutlineTrack?.(wave,wk,wk);if(wave._battleOutline810){wave._battleOutline810.rate=6/.72;wave._battleOutline810.loop=false;}}   // v7.8.57 ใบ 22: วงคลื่นตามธีมด่าน (ขอบนอก = รัศมีที่โดน)
      const track={radius:10};
      this.tweens.add({targets:track,radius:maxR,duration:720,ease:'Quad.out',
        onUpdate:(tw)=>{ const rr=track.radius; if(wk){const [w,h]=this.kitSize(wk,rr);wave.setDisplaySize(w,h).setAlpha(0.95*(1-tw.progress*.7));}else wave.setScale((rr*2)/256).setAlpha(0.95*(1-tw.progress));
          const d=this.dist(this.player.x,this.player.y,x,y);
          if(!hitOnce&&Math.abs(d-rr)<28){hitOnce=true;this.hurtPlayer(dmg,0.6);}
          this.sesMirrorBreak?.((mx,my)=>Math.abs(this.dist(mx,my,x,y)-rr)<28); },
        onComplete:()=>wave.destroy()});
    });
  }

  // v7.8.57 art order 22: ชุด VFX บอสรายด่าน C1–C2 · คืน key vfx_bNN_<kind> ถ้า texture ของด่านนี้โหลดแล้ว ไม่งั้น null (ใช้ภาพกลางเดิม)
  bossKit(kind){const i=this.stageIndex;if(!(i>=0&&i<15))return null;if(this._pinnacleRun||this.boss?._pinnacleArt){const q='vfx_bpin_'+kind,k=this.battleOutlineKey?.(q)||q;if(ASSET_FX[k]&&this.bpAnim?.(k))return k;}const base='vfx_b'+(i<9?'0':'')+(i+1)+'_'+kind,k=this.battleOutlineKey?.(base)||base;return ASSET_FX[k]&&this.bpAnim?.(k)?k:null;}   // v7.9.29 ใบ 30: C3 (b11–b15) + Pinnacle (bpin)
  /* v7.9.29 ใบ 30: ของให้เตะ C3 / Pinnacle (ไม่มีภาพ = emoji เดิม) */
  rootCageArt(x,y,r,gapA,life){if(!this.bpAnim?.('vfx_b15_root_cage'))return null;const w=r*2/(ASSET_FX.vfx_b15_root_cage.fill?.[0]||.96);const sp=this.bossSig('15_root_cage',x,y,w,{h:w,life,rot:gapA-Math.PI/2,depth:3});return sp;}
  counterArt(b){const k=(b?._pinnacleArt||this._pinnacleRun)?'counter_pin_meat':['counter_c11_egg','counter_c12_sponge','counter_c13_pan','counter_c14_ice','counter_c15_dishes','counter_c21_pod','counter_c22_mushroom','counter_c23_honey','counter_c24_season_seed','counter_c25_root_seed','counter_c31_sheaf','counter_c32_nectar','counter_c33_mirror','counter_c34_vault_bomb','counter_c35_crown_seed'][this.stageIndex];return k&&ASSET_FX[k]&&this.bpAnim?.(k)?k:null;}
  // วงรี (มุมมองเฉียง): ขอบนอกแนวนอน = รัศมีจริง · วงแบนมากยืดแนวตั้งให้สูงอย่างน้อย 55% ของกว้าง
  kitSize(k,r){const f=ASSET_FX[k].fill||[.92,.6],w=r*2/f[0];return [w,w*Math.max(f[1],.55)];}
  // เส้นเตือน: sprite ลายด่านทับเส้นเดิม (ซ่อนเส้นเดิม แต่ยังใช้ตำแหน่ง/หมุน/ยาว/alpha/tween ของมัน → เวลาเท่าเดิม)
  /* v8.1.157 CODE_VS_ART รอบ 3 ข้อ 8: เส้นเตือนพุ่ง/ลำแสงบอสวาดด้วยโค้ด · ตามภาพเส้นเดิม (ตำแหน่ง/มุม/ยาว/สี/จาง) · แถบโปร่ง + ขอบ 2 ข้าง + ลูกศร ›› ไหลไปทางที่จะพุ่ง · ขอบกะพริบตอนใกล้ปล่อย (จางมาก = ใกล้จบ) */
  codeLane(img,o={}){ if(!img||!img.active||!this.add?.graphics)return null; const g=this.camWorld(this.add.graphics().setDepth(img.depth)),col=img.tintTopLeft??0xff5a4d,t0=this.time?.now||0; img.setVisible(false);
    const tk=()=>{ if(!img.active||!g.active){ this.events.off('postupdate',tk); if(g.active)g.destroy(); return; }
      const L=img.displayWidth,H=o.h??Math.max(16,img.displayHeight*.5),sx=-(img.originX??0)*L,a=Math.min(1,img.alpha*1.15),t=((this.time?.now||0)-t0)/1000; g.setPosition(img.x,img.y).setRotation(img.rotation).clear();
      g.fillStyle(col,.16*a).fillRect(sx,-H/2,L,H); g.fillStyle(col,.12*a).fillRect(sx,-H*.18,L,H*.36);
      const bl=.55+.45*Math.abs(Math.sin(t*(6+t*6))); g.lineStyle(3,col,.85*a*bl).lineBetween(sx,-H/2,sx+L,-H/2).lineBetween(sx,H/2,sx+L,H/2); g.lineStyle(1.5,0xffffff,.5*a).lineBetween(sx,-H/2+2,sx+L,-H/2+2).lineBetween(sx,H/2-2,sx+L,H/2-2);
      const step=46,off=(t*240)%step,cw=Math.min(14,H*.32); g.lineStyle(3,0xffffff,.55*a); for(let x=sx+off;x<sx+L-cw;x+=step){ g.beginPath(); g.moveTo(x,-H*.28); g.lineTo(x+cw,0); g.lineTo(x,H*.28); g.strokePath(); } };
    tk(); this.events.on('postupdate',tk); return g; }
  kitLane(img,o={}){ if(typeof CODE_VFX!=='undefined'&&CODE_VFX.lane&&!o.key)return this.codeLane(img,o); const base=o.key?(this.bpAnim?.(o.key)?o.key:null):this.bossKit('lane'),lk=base&&(this.battleOutlineKey?.(base)||base);if(!lk||!img||!img.active)return null;const s=this.camWorld(this.add.sprite(img.x,img.y,lk,0).setOrigin(img.originX,img.originY).setDepth(img.depth));s.play(lk);this.battleOutlineTrack?.(s,base,lk,null,true);img.setVisible(false);
    const tk=()=>{if(!img.active||!s.active){this.events.off('postupdate',tk);if(s.active)s.destroy();return;}s.setPosition(img.x,img.y).setRotation(img.rotation).setDisplaySize(img.displayWidth,o.h??Math.max(14,img.displayHeight*.32)).setAlpha(Math.min(1,img.alpha*1.1));};tk();this.events.on('postupdate',tk);return s;}
  // Signature ประจำท่า (ใบ 22 ตาราง B) · ไม่มีภาพ = null ไม่วาดอะไรเพิ่ม · loop ต้องใส่ life
  bossSig(name,x,y,w,o={}){const k='vfx_b'+name;if(!ASSET_FX[k])return null;return this.heroFx(k,x,y,w,Object.assign({must:true,depth:3},o));}
  // ภาพที่ต้องค้างเฟรม (ice bars / honey wall): เล่นถึงเฟรม f แล้วค้าง sec วินาที → เล่นต่อจนจบ
  bossSigHold(name,x,y,w,h,f,sec,o={}){const s=this.bossSig(name,x,y,w,Object.assign({h},o));if(!s)return null;if(s._battleOutline810&&/^vfx81[345]_/.test(s.texture?.key||'')){const m=s._battleOutline810;m.holdAt=Math.min(m.frames-1,f);m.holdSec=sec;return s;}const on=(an,fr)=>{if(+fr.textureFrame>=f){s.off('animationupdate',on);s.anims.pause();this.time.delayedCall(sec*1000,()=>{if(s.active)s.anims.resume();});}};s.on('animationupdate',on);return s;}

  spawnBossObject(kind,x,y,life=10){
    if(kind==='crystal'||kind==='obelisk')return null;   // เอา "pillar-summon skill" (ผลึก/โอเบลิสก์) ออกจากบอส/มอนทุกตัว — ยิงไกลโกง + น่ารำคาญ
    const map={hole:'nest_hole',egg:'nest_eggs',crystal:'nest_crystal',obelisk:'nest_obelisk',mound:'nest_mound',acid:'nest_acid'},key=map[kind];if(!key||!this.textures.exists(key))return null;
    let o=this.bossObjects.getFirstDead(false);if(!o)o=this.bossObjects.create(x,y,key);else{o.setTexture(key);o.setActive(true).setVisible(true);if(o.body)o.body.enable=true;o.setPosition(x,y);}
    if(!o)return null;o.kind=kind;o.life=life;o.tick=Phaser.Math.FloatBetween(1.0,1.9);o.hp=kind==='egg'?70:kind==='crystal'?68:kind==='obelisk'?95:kind==='mound'?150:999;o.maxhp=o.hp;   // ลด HP ให้ทำลายได้จริง (โดยเฉพาะสายดาเมจต่ำอย่าง Mint)
    o.setScale(kind==='acid'?0.34:kind==='egg'?0.54:0.66).setDepth(kind==='acid'?(y-100000):(y-1)).clearTint().setAlpha(kind==='acid'?0.5:1);this.camWorld(o);   // acid = บ่อพื้น ย่อเล็ก โปร่ง วางใต้ตัวละคร กันบังจอ
    const ghost=kind==='acid'||kind==='hole';if(o.body){o.body.setAllowGravity(false);o.body.setImmovable(!ghost);o.body.setSize(ghost?1:80,ghost?1:58,true);if(ghost)o.body.checkCollision.none=true;else o.body.checkCollision.none=false;}
    this.vfxSpawnPoof(x,y);return o;
  }
  hitBossObject(b,o){if(!b.active||!o.active||o.kind==='acid'||o.kind==='hole')return;const dmg=b.dmg||8;o.hp-=dmg;this.popDmg(Math.round(dmg),o.x,o.y,false);this.vfxHitRing(o.x,o.y,0x9dff45,false);if(!b.pierce)this.killBullet(b);if(o.hp<=0)this.killBossObject(o,false);}
  killBossObject(o,hatch){if(!o||!o.active)return;const k=o.kind,x=o.x,y=o.y,wasWeak=o._weak;this.burst(x,y,k==='egg'?0xffd0df:0x9dff45);o.setActive(false).setVisible(false);if(o.body){o.body.enable=false;o.body.checkCollision.none=false;}o.kind=null;o._weak=false;if(hatch){const n=k==='mound'?3:2;for(let i=0;i<n;i++)this.spawnEnemy(i%2?'acid':'fast');}
    if(wasWeak){this._weakCount=Math.max(0,(this._weakCount||1)-1);this.vfxHitRing(x,y,0xffe07a,true);if(this._weakCount<=0&&this._weakActive)this.time.delayedCall(50,()=>this.endWeakPoint(this.boss,true));}}
  // Objective ระหว่างสู้บอส/มินิ: บอสกางเกราะเป็นระยะ ต้องทำลาย "weak point" 3 pointsเพื่อทลายเกราะ (แก้เบื่อ)
  tickBossObjectiveGate(b){ return false; }   // ปิดระบบเกราะweak point (อิงเสาผลึกที่เอาออกแล้ว) — บอสซัดตรง ๆ ได้ตลอด
  tickBossObjective(dt){
    const b=this.boss; if(!b||!b.active)return;
    if(this._bossShieldFx&&this._bossShieldFx.active)this._bossShieldFx.setPosition(b.x,b.y);
    if(this._weakActive){ this._weakTimer-=dt; if(this._weakTimer<=0)this.endWeakPoint(b,false); return; }
    if(!this.tickBossObjectiveGate(b))return;   // เฉพาะเฟส 2+
    const frac=b.hp/b.maxhp; if(frac<0.15||frac>0.92)return;
    this._weakAcc=(this._weakAcc==null?16:this._weakAcc)-dt;
    if(this._weakAcc<=0)this.startWeakPoint(b);
  }
  startWeakPoint(b){
    this._weakActive=true;this._weakTimer=7;this._bossShield=true;this._weakCount=0;
    const n=2,rad=175;   // 3→2 points · โผล่นานสุด 7s (เดิม 9)
    for(let i=0;i<n;i++){const a=-Math.PI/2+i*Math.PI*2/n,o=this.spawnBossObject('crystal',b.x+Math.cos(a)*rad,b.y+Math.sin(a)*rad,12);if(o){o._weak=true;o.setTint(0xffe07a);this._weakCount++;}}
    if(this._weakCount===0){this._bossShield=false;this._weakActive=false;this._weakAcc=11;return;}   // ด่านNoneอาร์ต crystal → ข้าม
    this._bossShieldFx=this.camWorld(this.add.image(b.x,b.y,'vfx_ring').setTint(0xffe07a).setDepth(6).setDisplaySize(120,120).setAlpha(0.5));
    this.tweens.add({targets:this._bossShieldFx,alpha:{from:0.3,to:0.6},scale:{from:0.9,to:1.05},yoyo:true,repeat:-1,duration:520,ease:'Sine.inOut'});
    this.showBanner('🛡️ Boss Shielded!','Destroy the weak points: '+this._weakCount+' (gold) to break the shield!',2000);Sfx.bossWarn();
  }
  endWeakPoint(b,broken){
    this._weakActive=false;this._bossShield=false;this._weakAcc=broken?20:15;   // เว้นช่วงนานขึ้น (เกราะไม่ถี่)
    if(this._bossShieldFx){this.tweens.killTweensOf(this._bossShieldFx);if(this._bossShieldFx.active)this._bossShieldFx.destroy();this._bossShieldFx=null;}
    if(this.bossObjects)this.bossObjects.children.iterate(o=>{if(o&&o.active&&o._weak){o._weak=false;this.killBossObject(o,false);}});
    if(broken&&b&&b.active){const dmg=b.maxhp*0.08;b.hp-=dmg;this.popDmg(Math.round(dmg),b.x,b.y,true);b.atkCd=Math.max(b.atkCd||1,2.2);b.frozen=Math.max(b.frozen||0,0.6);this.screenFlash(0xffe07a,0.3,360);this.screenShake(220,0.01);this.hitStop(60);this.showBanner('🛡️ Shield Broken!','The boss is stunned — hit it hard!',1600);Sfx.bp?.('boss_shield_break',.7,.5)||Sfx.clear();if(b.hp<=0)this.killEnemy(b);}
  }
  resetBossObjective(){this._weakActive=false;this._bossShield=false;this._weakAcc=11;this._weakCount=0;if(this._bossShieldFx){this.tweens.killTweensOf(this._bossShieldFx);if(this._bossShieldFx.active)this._bossShieldFx.destroy();this._bossShieldFx=null;}}
  clearBossObjects(){this.clearArenaMech?.();this.clearDelveBoss&&this.clearDelveBoss();this._weakActive=false;if(this.bossObjects)this.bossObjects.children.iterate(o=>{if(o&&o.active){o._weak=false;this.killBossObject(o,false);}});this.resetBossObjective();}
  tickBossObjects(dt){
    if(!this.bossObjects)return;this.bossObjects.children.iterate(o=>{if(!o||!o.active)return;o.life-=dt;o.tick-=dt;if(o.kind==='acid'){if(this.dist(o.x,o.y,this.player.x,this.player.y)<68&&o.tick<=0){o.tick=0.55;this.hurtPlayer(11,0.28);}if(o.life<=0)this.killBossObject(o,false);return;}
      if(o.kind==='hole'){if(o.life<=0)this.killBossObject(o,false);return;}
      if(o.kind==='egg'&&o.life<=0){this.killBossObject(o,true);return;}
      if(o.tick<=0){
        if(o._weak){o.tick=1.5;}   // weak point (สีทอง) = แค่ทำลาย ไม่ยิงใส่ผู้เล่น (เดิมยิงด้วย = โหดซ้อน)
        else if(o.kind==='crystal'){o.tick=3.4;const a=Math.atan2(this.player.y-o.y,this.player.x-o.x);this.foeShot(o.x,o.y,a,145,10,0x86ff48,1.05);}   // ยิงช้าลง+ช้าลง หลบทันขึ้น
        else if(o.kind==='obelisk'){o.tick=4.4;for(let i=0;i<4;i++)this.foeShot(o.x,o.y,i*Math.PI/2,120,8,0xc7ff66,0.9);}   // 6→4 นัด ช้าลงอีก
        else if(o.kind==='mound'){o.tick=3.4;this.spawnEnemy(Math.random()<0.55?'fast':'acid');}
      }
      if(o.life<=0)this.killBossObject(o,o.kind==='mound');
    });
  }
  royalGuardAttack(b){const inkCast=this.bossInkBegin?.(b);
    this.bossInkPose?.(b,3,700);
    const pick=Phaser.Utils.Array.GetRandom(b.phase2?['charge','summon','slam']:['charge','slam']),px=this.player.x,py=this.player.y;   // เอา 'prison' (กรงเสาผลึก) ออก
    if(pick==='charge'){this.chargeTelegraph(b,780,700,22);b.atkCd=2.2;}
    else if(pick==='prison'){this.showBanner('💎 Acid Crystal Cage','Destroy the crystals to open a path!',850);for(let i=0;i<3;i++){const a=Math.PI/2+i*Math.PI*2/3;(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('crystal',px+Math.cos(a)*135,py+Math.sin(a)*135,7));}b.atkCd=3.0;}   // 4→3 ผลึก เว้นช่องหนีมากขึ้น
    else if(pick==='summon'){this.showBanner('🐜 Scouts Summoned','The guardians are surrounding you!',850);for(let i=0;i<4;i++)(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(i%2?'fast':'basic'));b.atkCd=2.7;}
    else{this.spawnHazard(px,py,105,20,0xff6d4a,b,inkCast);b.atkCd=2.2;}
  }
  bossPose(b,frame,ms=520,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||b.texture.key!=='boss1')return;
    b._poseToken=(b._poseToken||0)+1;const token=b._poseToken;
    if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(b.active&&b.texture.key==='boss1'&&b._poseToken===token){if(this.anims.exists('boss1_idle'))(this.bossInkIdle?.(b)||b.play('boss1_idle',true));else b.setFrame(0);}});
  }
  antQueenAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(this.arenaMechDue(b)){this.antTunnel(b);return;}   // v7.9.13 กลไกสนาม
    const fast=b.phase3?0.72:b.phase2?0.84:1,pool=b.phase3?['slam','acid','brood','rush','nova','collapse','nova']:b.phase2?['slam','acid','brood','rush','nova']:['slam','acid','brood','rush'];   // เอา 'crystal' (เสาผลึก) ออก
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y;
    if(pick==='slam'){this.bossPose(b,2,900);const n=b.phase3?3:b.phase2?2:1;for(let i=0;i<n;i++)this.time.delayedCall(280+i*130,()=>{if(b.active){this.bossPose(b,3,420);this.spawnHazard(px+Phaser.Math.Between(-70,70),py+Phaser.Math.Between(-70,70),100,22,0x75ff4b,b,inkCast);}});b.atkCd=2.2*fast;}
    else if(pick==='acid'){this.bossPose(b,4,900);this.time.delayedCall(320,()=>{if(!b.active)return;const n=b.phase3?16:b.phase2?12:9,a0=Math.random()*Math.PI*2;for(let i=0;i<n;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a0+i/n*Math.PI*2,180+(i%2)*55,12,0x74ff38,1.2));for(let i=0;i<(b.phase3?5:3);i++)(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('acid',px+Phaser.Math.Between(-190,190),py+Phaser.Math.Between(-190,190),8));Sfx.zap();});b.atkCd=2.1*fast;}
    else if(pick==='brood'){this.bossPose(b,5,1100);this.showBanner('🥚 BROOD COMMAND','Destroy the eggs before the ants hatch!',900);for(let i=0;i<(b.phase3?4:3);i++){const a=i*Math.PI*2/(b.phase3?4:3);(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('egg',b.x+Math.cos(a)*175,b.y+Math.sin(a)*175,6.5));}b.atkCd=2.9*fast;}
    else if(pick==='rush'){this.bossPose(b,2,780);const a=Math.atan2(py-b.y,px-b.x),len=this.dist(b.x,b.y,px,py),aim=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(3).setRotation(a).setScale(len/256,0.46).setTint(0x75ff4b));this.kitLane(aim);this.tweens.add({targets:aim,alpha:{from:0.2,to:1},duration:110,yoyo:true,repeat:3,onComplete:()=>aim.destroy()});this.time.delayedCall(500,()=>{if(b.active){this.bossPose(b,3,500);b.setVelocity(Math.cos(a)*650,Math.sin(a)*650);b.knock=0.5;}});b.atkCd=2.1*fast;}
    else if(pick==='crystal'){this.bossPose(b,4,1000);this.showBanner('💎 Acid Crystal','Destroy the crystal — it fires slowly, you can dodge!',900);for(let i=0;i<2;i++){const a=Math.PI/4+i*Math.PI;(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('crystal',px+Math.cos(a)*230,py+Math.sin(a)*230,9));}b.atkCd=3.4*fast;}   // 3→2 ผลึก · เลิกใช้ obelisk (ยิงWaitบทิศโหด)
    else if(pick==='collapse'){this.bossPose(b,6,1250);this.showBanner('⛰️ Nest Collapse!','Destroy the breeding mound — don’t stop moving!',1000);for(let i=0;i<2;i++){const mx=b.x+(i?1:-1)*220,my=b.y+Phaser.Math.Between(-120,120);this.bossSig('01_nest_collapse',mx,my,230,{depth:my-2});(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('mound',mx,my,13));}for(let i=0;i<4;i++)(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('acid',px+Phaser.Math.Between(-240,240),py+Phaser.Math.Between(-240,240),9));b.atkCd=3.4*fast;}
    else{this.bossPose(b,6,1200);this.showBanner('☣️ ACID CROWN NOVA','Find the gaps between the waves!',900);this.time.delayedCall(360,()=>{if(!b.active)return;this.bossNovaWave(b.x,b.y,285,20,0,b,inkCast);if(b.phase3)this.bossNovaWave(b.x,b.y,285,20,380,b,inkCast);for(let i=0;i<16;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*Math.PI/8,155+(i%2)*75,12,0xa7ff54,1.3));this.screenShake(340,0.014);Sfx.bossWarn();});b.atkCd=2.7*fast;}
  }
  drainBossPose(b,frame,ms=620,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||b.texture.key!=='boss2')return;
    // ชีต 4×2 ผ่านการซ่อม PNG/alpha และมีภาพครบ 8 เฟรมแล้ว ใช้ท่า 0–7 ได้โดยตรง
    frame=Phaser.Math.Clamp(frame|0,0,7);
    if(b.anims)b.anims.stop();b.setFrame(frame);b._poseToken=(b._poseToken||0)+1;const token=b._poseToken;
    this.time.delayedCall(ms,()=>{if(b.active&&b.texture.key==='boss2'&&b._poseToken===token&&this.anims.exists('boss2_walk'))(this.bossInkIdle?.(b)||b.play('boss2_walk',true));});
  }
  drainBossAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(b.isBoss&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase3?0.78:b.phase2?0.88:1,pool=b.phase3?['prison','suction','overflow','sludge','split','overflow']:b.phase2?['prison','suction','overflow','sludge','split']:['prison','overflow','sludge'];
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y;
    b._drainKick=0.48; b._drainLean=pick==='suction'?-1:pick==='overflow'?1:0;
    if(b.isBoss)this.drainBossPose(b,pick==='prison'||pick==='split'?4:pick==='suction'?5:6,pick==='overflow'?900:680);
    if(pick==='prison'){const r=b.isMini?66:82,bk=this.bpAnim?.('vfx_b02_bubble_cage')&&(this.battleOutlineKey?.('vfx_b02_bubble_cage')||'vfx_b02_bubble_cage'),mark=this.codeBubbleOn?.()?this.camWorld(this.add.image(px,py,'code_bubble').setTint(0xbff4ff).setDepth(3).setDisplaySize(r*2,r*2).setAlpha(0.85)):bk?this.camWorld(this.add.sprite(px,py,bk,0).setDepth(3).setDisplaySize(...this.kitSize(bk,r)).setAlpha(0.7)):this.camWorld(this.add.image(px,py,'vfx_telegraph').setTint(0x78e8ff).setDepth(3).setScale((r*2)/256).setAlpha(0.7));if(bk&&mark.play){mark.play(bk);this.battleOutlineTrack?.(mark,bk,bk,null,true);}this.showBanner('🫧 Trapping Bubble','Leave the ring before the bubble closes!',760);
      this.tweens.add({targets:mark,alpha:{from:0.35,to:0.95},duration:180,yoyo:true,repeat:2});this.time.delayedCall(720,()=>{mark.destroy();if(this.state!=='play'||!b.active)return;if(this.dist(this.player.x,this.player.y,px,py)<r){this.moveSlowT=1.45;const cage=this.camWorld(this.add.image(this.player.x,this.player.y,'bubble').setDepth(90002).setScale(2.2).setAlpha(0.9));this.tweens.add({targets:cage,scale:2.7,alpha:0,duration:850,onComplete:()=>cage.destroy()});this.hurtPlayer(Math.round(b.dmg*0.35),0.35);}});b.atkCd=2.5*fast;}
    else if(pick==='suction'){this.showBanner('🌀 Suction Valve Open','Run against the pull — don’t get near the center!',900);this.drainPull={x:b.x,y:b.y,t:b.phase3?1.8:1.35,strength:b.phase3?155:120};
      if(!this.bossSig('02_suction',b.x,b.y,380,{life:this.drainPull.t,depth:2}))for(let i=0;i<3;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'vfx_cream_ring').setTint(0x74e3cf).setDepth(2).setScale(1.3+i*0.55).setAlpha(0.55));this.tweens.add({targets:ring,scale:0.12,alpha:0,duration:900+i*150,onComplete:()=>ring.destroy()});}b.atkCd=2.8*fast;}
    else if(pick==='overflow'){this.showBanner('🌊 Sewer Overflow','Slip through the gaps between bubble waves!',780);const max=b.isMini?210:270;this.bossNovaWave(b.x,b.y,max,Math.round(b.dmg*0.62),0,b,inkCast);if(b.phase2)this.bossNovaWave(b.x,b.y,max,Math.round(b.dmg*0.62),420,b,inkCast);b.atkCd=2.5*fast;}
    else if(pick==='split'){for(let i=0;i<(b.phase3?5:3);i++)this.time.delayedCall(i*130,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(i%2?'shooter':'fast'));});this.showBanner('🫧 Bubble Split','Kill the bubble spawns before you’re surrounded!',780);b.atkCd=2.9*fast;}
    else{const n=b.phase3?5:b.phase2?4:3;for(let i=0;i<n;i++)this.spawnHazard(px+Phaser.Math.Between(-180,180),py+Phaser.Math.Between(-180,180),64,Math.round(b.dmg*0.55),0x53caa4,b,inkCast);b.atkCd=2.35*fast;}
  }
  stageBossPose(b,frame,ms=650,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||!['boss3','boss4'].includes(b.texture.key))return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._poseToken=(b._poseToken||0)+1;const token=b._poseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(b.active&&['boss3','boss4'].includes(b.texture.key)&&b._poseToken===token){const idle=b.texture.key+'_idle';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);}});
  }
  chiliBossAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(true&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase3?0.72:b.phase2?0.84:1,pool=b.phase3?['belt','pepper','furnace','gears','furnace']:b.phase2?['belt','pepper','furnace','gears']:['belt','pepper','gears'],px=this.player.x,py=this.player.y,pick=Phaser.Utils.Array.GetRandom(pool),d=Math.max(12,Math.round(b.dmg*0.48));
    if(pick==='belt'){this.stageBossPose(b,4,900);const a=Math.atan2(py-b.y,px-b.x),len=Math.max(430,this.dist(b.x,b.y,px,py)+120),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setRotation(a).setScale(len/256,0.62).setTint(0xffb14a).setDepth(4));this.kitLane(line);this.showBanner('🔥 Conveyor Charge','Dodge off the orange line before the grill charges!',780);this.tweens.add({targets:line,alpha:{from:.25,to:1},duration:120,yoyo:true,repeat:3,onComplete:()=>line.destroy()});this.time.delayedCall(560,()=>{if(b.active){b.setVelocity(Math.cos(a)*690,Math.sin(a)*690);b.knock=.52;this.screenShake(240,.009);}});b.atkCd=2.35*fast;}
    else if(pick==='pepper'){this.stageBossPose(b,3,900);this.showBanner('🌶️ Chili Rain','Don’t run in a straight line — the hot rings track your position!',820);for(let i=0;i<(b.phase3?9:b.phase2?7:5);i++)this.time.delayedCall(i*125,()=>{if(b.active&&this.state==='play')this.spawnHazard(this.player.x+Phaser.Math.Between(-105,105),this.player.y+Phaser.Math.Between(-105,105),56,d,0xff5a38,b,inkCast);});b.atkCd=2.75*fast;}
    else if(pick==='gears'){this.stageBossPose(b,5,950);this.showBanner('⚙️ Flavor Grinder','Slip through the gaps between the spinning blades!',820);for(let i=0;i<3;i++){const g=this.bossSig('03_grinder_blade',b.x+Math.cos(i*TAU/3)*70,b.y+Math.sin(i*TAU/3)*70,96,{life:.8,depth:b.depth+1});if(g)this.tweens.add({targets:g,rotation:(i%2?-1:1)*TAU*1.5,duration:900});}const n=b.phase3?18:b.phase2?14:11,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,190+(i%2)*48,d,0xffb04f,1.05));}b.atkCd=2.45*fast;}
    else{this.stageBossPose(b,2,1100);this.showBanner('♨️ Furnace Overheat','Leave the cross, then cross the fire waves!',930);for(const rot of [0,Math.PI/2]){const mark=this.camWorld(this.add.image(px,py,'vfx_line').setRotation(rot).setScale(4.2,.72).setTint(0xff4938).setAlpha(.72).setDepth(3));if(!this.kitLane(mark,{key:'vfx_b03_fire_cross',h:96}))this.kitLane(mark);this.tweens.add({targets:mark,alpha:{from:.22,to:1},duration:130,yoyo:true,repeat:4,onComplete:()=>mark.destroy()});}this.time.delayedCall(720,()=>{if(!b.active)return;for(let i=-3;i<=3;i++){if(i===0)continue;this.spawnHazard(px+i*88,py,49,d,0xff4938,b,inkCast);this.spawnHazard(px,py+i*88,49,d,0xff4938,b,inkCast);}this.bossNovaWave(b.x,b.y,285,d+4,320,b,inkCast);});b.atkCd=3.15*fast;}
  }
  frostBossAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(true&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase3?0.74:b.phase2?0.86:1,pool=b.phase3?['bars','shards','blizzard','quake','bars']:b.phase2?['bars','shards','blizzard','quake']:['shards','quake','bars'],px=this.player.x,py=this.player.y,pick=Phaser.Utils.Array.GetRandom(pool),d=Math.max(12,Math.round(b.dmg*0.46));
    if(pick==='bars'){this.stageBossPose(b,5,1050);this.showBanner('🔒 Ice Cage Sealing','Find the one gap before the seal slams shut!',900);const gap=Phaser.Math.Between(-2,2);for(let i=-3;i<=3;i++){if(i===gap)continue;const x=px+i*78,mark=this.camWorld(this.add.image(x,py,'vfx_line').setRotation(Math.PI/2).setScale(3.8,.52).setTint(0x8fe7ff).setAlpha(.70).setDepth(3));this.kitLane(mark);this.tweens.add({targets:mark,alpha:{from:.22,to:1},duration:140,yoyo:true,repeat:4,onComplete:()=>mark.destroy()});this.time.delayedCall(760,()=>{if(b.active){this.spawnHazard(x,py,45,d,0x83ddff,b,inkCast);this.bossSigHold('04_ice_bars',x,py-40,62,124,4,.55,{depth:py+4});this.iceCageSlam?.(x,py,d);}});}b.atkCd=3.0*fast;}   /* v8.2.47 เจ้าของ: เส้นเตือนเป็นทั้งแนวตั้ง แต่โดนแค่วงเล็กตรงแถวเรา → ทั้งแนวตั้งโดนจริง (iceCageSlam) */
    else if(pick==='shards'){this.stageBossPose(b,3,850);const base=Math.atan2(py-b.y,px-b.x),shots=b.phase3?11:b.phase2?9:7;this.showBanner('❄️ Ice Shard Blast','Cut across the blast angle — don’t back up straight!',760);this.time.delayedCall(360,()=>{if(!b.active)return;for(let i=0;i<shots;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,base+(i-(shots-1)/2)*.14,245,d,0x9fe8ff,1.0));});b.atkCd=2.15*fast;}
    else if(pick==='blizzard'){this.stageBossPose(b,6,1100);this.showBanner('🌨️ Frost Prison Storm','The wind pulls to the center — run out sideways!',900);this.drainPull={x:b.x,y:b.y,t:b.phase3?2.1:1.55,strength:b.phase3?170:135};this.bossSig('04_blizzard',b.x,b.y,460,{life:this.drainPull.t,depth:2});this.moveSlowT=Math.max(this.moveSlowT||0,1.1);for(let i=0;i<3;i++)this.bossNovaWave(b.x,b.y,210+i*58,d,250+i*360,b,inkCast);b.atkCd=3.25*fast;}
    else{this.stageBossPose(b,2,980);this.showBanner('🧊 Glacier Hammer','A three-beat shockwave — weave in and out!',850);for(let i=0;i<(b.phase3?3:2);i++)this.time.delayedCall(300+i*430,()=>{if(b.active)this.bossNovaWave(b.x,b.y,230+i*55,d+3,0,b,inkCast);});b.atkCd=2.85*fast;}
  }
  beginBossPhaseTransition(b,duration,color){
    if(!b||!b.active)return;Sfx.bp?.('boss_phase_transition',.7,1);b._phaseGateLocked=false;b._phaseInvuln=Math.max(0.2,duration||1.4);b._phaseInvulnColor=color||0xffd166;b.setVelocity(0,0);
    this.c3BossPose(b,6,Math.round((duration||1.4)*1000));
    if(b._phaseShieldFx){this.tweens.killTweensOf(b._phaseShieldFx);if(b._phaseShieldFx.active)b._phaseShieldFx.destroy();}
    const isFinal=b.isBoss&&b.phase4,sc=b.isBoss?2.15:1.55,phaseLabel=isFinal?'FINAL PHASE':b.phase3?'PHASE 3':b.phase2?'PHASE 2':'PHASE SHIFT';
    b._phaseShieldFx=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setTint(b._phaseInvulnColor).setDepth(b.y+4).setScale(sc).setAlpha(0.72));
    this.tweens.add({targets:b._phaseShieldFx,rotation:Math.PI*2,scale:{from:sc*0.88,to:sc*1.08},alpha:{from:0.42,to:0.82},duration:420,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    // มาตรฐาน Phase VFX สำหรับบอสทุกตัว — สั้น อ่านง่าย และไม่บัง telegraph
    this.hitStop(b.isBoss?85:55);this.screenFlash(b._phaseInvulnColor,b.isBoss?0.22:0.14,b.isBoss?420:300);this.screenShake(b.isBoss?360:220,b.isBoss?0.010:0.006);
    const q=Save.data.settings?Number(Save.data.settings.vfx):1,rays=(b.isBoss?8:5)+(q===2?3:q===0?-3:0);for(let i=0;i<rays;i++){const a=i*TAU/rays,ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(b.y+2).setRotation(a).setTint(b._phaseInvulnColor).setScale(0.06,0.24).setAlpha(0.72));this.tweens.add({targets:ray,scaleX:b.isBoss?0.92:0.62,alpha:0,duration:520+i*25,onComplete:()=>ray.destroy()});}
    for(let i=0;i<(b.isBoss?3:2);i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y+3).setTint(i%2?0xffffff:b._phaseInvulnColor).setScale(sc*(0.25+i*0.13)).setAlpha(0.76));this.tweens.add({targets:ring,scale:sc*(1.05+i*0.20),rotation:(i%2?1:-1)*Math.PI,alpha:0,duration:620+i*130,onComplete:()=>ring.destroy()});}
    const tag=this.camWorld(this.add.text(b.x,b.y-(b.isBoss?118:82),phaseLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:b.isBoss?'24px':'17px',color:'#ffffff',stroke:'#210026',strokeThickness:6}).setOrigin(0.5).setDepth(b.y+8).setAlpha(0));
    this.tweens.add({targets:tag,y:tag.y-18,alpha:{from:0,to:1},duration:220,yoyo:true,hold:Math.max(240,(duration||1.4)*1000-520),onComplete:()=>tag.destroy()});
  }
  tickBossPhaseTransition(b,dt){
    if(!b||!b.active||(b._phaseInvuln||0)<=0)return false;b._phaseInvuln=Math.max(0,b._phaseInvuln-dt);b.setVelocity(0,0);
    if(b._phaseShieldFx&&b._phaseShieldFx.active)b._phaseShieldFx.setPosition(b.x,b.y).setDepth(b.y+4);
    if(b._phaseInvuln<=0){if(b._phaseShieldFx){this.tweens.killTweensOf(b._phaseShieldFx);if(b._phaseShieldFx.active)b._phaseShieldFx.destroy();b._phaseShieldFx=null;}
      const c=b._phaseInvulnColor||0xffd166;this.screenFlash(c,0.12,240);const burst=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y+4).setTint(c).setScale(0.65).setAlpha(0.86));this.tweens.add({targets:burst,scale:b.isBoss?2.6:1.8,alpha:0,duration:520,onComplete:()=>burst.destroy()});this.showBanner('⚔️ New Phase Begins','The boss can take damage again!',850);}
    return b._phaseInvuln>0;
  }

  c3BossPose(b,frame,ms=700,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||!/^c3_(mini|boss)[1-5]$/.test(b.texture.key))return;
    b._c3PoseToken=(b._c3PoseToken||0)+1;const token=b._c3PoseToken;
    if(b.anims)b.anims.stop();b.setFrame(Phaser.Math.Clamp(frame|0,0,7));
    if(ms>0)this.time.delayedCall(ms,()=>{if(!b.active||b._c3PoseToken!==token)return;
      const idle=b.texture.key+'_idle';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);});
  }
  stage5Pose(b,frame,ms=850,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||!['boss5_sovereign','mb5_banquet_executioner'].includes(b.texture.key))return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._stage5PoseToken=(b._stage5PoseToken||0)+1;const token=b._stage5PoseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._stage5PoseToken!==token)return;const idle=b.texture.key==='boss5_sovereign'?'boss5_sovereign_idle':b.texture.key+'_walk';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);});
  }
  stage5EnemyPose(e,frame,ms=360){
    const keys=['e_void_crumb','e_crown_ripper','e_banquet_eye','e_maw_truffle','e_royal_oven_sentinel'];if(!e||!e.active)return;const key=e._enemyArtKey||e.texture.key,base=key.replace(/_animated$/,'');if(!keys.includes(base))return;
    if(ASSET_SHEETS[key]&&ASSET_SHEETS[key].actions){const state=frame===6?'hurt':base==='e_crown_ripper'?(frame===4?'windup':'dash'):base==='e_banquet_eye'?'attack':frame===4?'windup':'attack';this.enemyAction(e,state,ms);return;}
    this.enemyAction(e,frame===4?'windup':frame===5?'attack':frame===6?'hurt':'attack',ms,Math.max(0,Math.min(7,frame|0)));
  }
  stage5DeathGhost(e){
    const keys=['boss5_sovereign','mb5_banquet_executioner','e_void_crumb','e_crown_ripper','e_banquet_eye','e_maw_truffle','e_royal_oven_sentinel'];if(!e||!keys.includes(e.texture.key))return;
    const deathFrame=e.texture.key==='mb7_fungal_juggernaut'?3:7,ghost=this.camWorld(this.add.image(e.x,e.y,e.texture.key,deathFrame).setScale(e.baseScale||e.scaleX||1).setFlipX(e.flipX).setDepth(e.y+8).setAlpha(1));
    const boss=e.isBoss,mini=e.isMini;this.tweens.add({targets:ghost,y:ghost.y+(boss?28:14),scaleX:ghost.scaleX*(boss?1.12:.82),scaleY:ghost.scaleY*(boss?.76:.82),alpha:0,duration:boss?1450:mini?900:520,ease:'Cubic.in',onComplete:()=>ghost.destroy()});
  }

  chapter2Pose(b,frame,ms=850,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||!['boss6_rootmother','mb6_sporewarden'].includes(b.texture.key))return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._ch2PoseToken=(b._ch2PoseToken||0)+1;const token=b._ch2PoseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._ch2PoseToken!==token)return;const idle=b.texture.key==='boss6_rootmother'?'boss6_rootmother_idle':'mb6_sporewarden_walk';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);});
  }
  juggernautPose(b,frame,ms=820){
    if(this.bossInkPose?.(b,frame===0?0:3,ms))return;
    if(!b||!b.active||b.texture.key!=='mb7_fungal_juggernaut')return;frame=Phaser.Math.Clamp(frame|0,0,3);
    b._jugPoseToken=(b._jugPoseToken||0)+1;const token=b._jugPoseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._jugPoseToken!==token)return;if(this.anims.exists('mb7_fungal_juggernaut_walk'))b.play('mb7_fungal_juggernaut_walk',true);else b.setFrame(0);});
  }
  fungalJuggernautAttack(b){const inkCast=this.bossInkBegin?.(b);
    const fast=b.phase2?.76:1,pool=b.phase2?['quake','stampede','livingWall','sporeMortar','colonyCall','stampede']:['quake','stampede','livingWall','sporeMortar'],pick=Phaser.Utils.Array.GetRandom(pool);
    const px=this.player.x,py=this.player.y,bd=Math.max(18,Math.round((b.dmg||32)*.54));
    if(pick==='quake'){
      this.juggernautPose(b,2,1050);this.showBanner('🍄 Mycelium Quake','Three rings erupt in sequence — cross each wave after it passes!',900);
      for(let i=0;i<3;i++)this.time.delayedCall(300+i*360,()=>{if(b.active)this.bossNovaWave(b.x,b.y,190+i*72,bd+i*2,0,b,inkCast);});b.atkCd=3.15*fast;
    }else if(pick==='stampede'){
      this.juggernautPose(b,1,900);this.showBanner('💥 Triple Stampede','Sidestep the violet line — it re-aims between charges!',900);
      for(let i=0;i<(b.phase2?3:2);i++)this.time.delayedCall(i*780,()=>{if(b.active)this.chargeTelegraph(b,620,720,34);});b.atkCd=(b.phase2?3.1:2.65)*fast;
    }else if(pick==='livingWall'){
      this.juggernautPose(b,3,1150);this.showBanner('🛡️ Living Wall','Bulwarks advance while spores seal most of the ring — find the two gaps!',950);
      const gap=Phaser.Math.Between(0,7);for(let i=0;i<8;i++){if(i===gap||i===(gap+4)%8)continue;const a=i*TAU/8;(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('acid',px+Math.cos(a)*155,py+Math.sin(a)*155,7.5));}
      for(let i=0;i<(b.phase2?2:1);i++){const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy('tank'));if(e)e.setPosition(b.x+(i?1:-1)*105,b.y+Phaser.Math.Between(-45,45));}b.atkCd=3.25*fast;
    }else if(pick==='sporeMortar'){
      this.juggernautPose(b,2,980);this.showBanner('🟣 Spore Mortar','Move through the missing wedges, then leave the impact circle!',900);this.time.delayedCall(950,()=>this.bossSig('07_spore_mortar',px,py,86*2/.85,{depth:3}));const n=b.phase2?18:14,gap=Phaser.Math.Between(0,n-1);
      this.time.delayedCall(360,()=>{if(!b.active)return;for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n||i===(gap+2)%n)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,205+(i%2)*48,bd-4,i%2?0xb46cff:0x56e5bd,1.08));}this.spawnHazard(px,py,86,bd+5,0xb46cff,b,inkCast);});b.atkCd=2.85*fast;
    }else{
      this.juggernautPose(b,3,1200);this.showBanner('🕸️ Colony Call','Break the Mold Sacs before the marsh multiplies!',900);const types=['bomber','shooter','fast','bomber'];for(let i=0;i<(b.phase2?4:3);i++)this.time.delayedCall(i*140,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(types[i]));});b.atkCd=3.35*fast;
    }
  }
  behemothPose(b,frame,ms=1050,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||b.texture.key!=='boss7_mycelium_behemoth')return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._behemothPoseToken=(b._behemothPoseToken||0)+1;const token=b._behemothPoseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._behemothPoseToken!==token)return;if(this.anims.exists('boss7_mycelium_behemoth_walk'))(this.bossInkIdle?.(b)||b.play('boss7_mycelium_behemoth_walk',true));else b.setFrame(0);});
  }
  behemothMetamorph(b,phase){
    if(!b||!b.active)return;const color=phase===3?0xd95cff:0x56e5bd;this.behemothPose(b,phase===3?7:6,phase===3?1900:1550);
    const rays=phase===3?16:11;for(let i=0;i<rays;i++){const a=i*TAU/rays,ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(i%3?color:0xffffff).setScale(.08,.42).setAlpha(.9).setDepth(b.y+2));this.tweens.add({targets:ray,scaleX:phase===3?2.1:1.55,alpha:0,duration:800+i*35,onComplete:()=>ray.destroy()});}
    for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setTint(i%2?color:0x86f5ff).setScale(.3+i*.14).setAlpha(.78).setDepth(b.y+3));this.tweens.add({targets:ring,scale:phase===3?3.2+i*.28:2.35+i*.22,rotation:(i%2?1:-1)*TAU,alpha:0,duration:900+i*130,onComplete:()=>ring.destroy()});}
    this.screenFlash(color,phase===3?.52:.34,phase===3?720:520);this.screenShake(phase===3?760:520,phase===3?.022:.014);Sfx.bossWarn();
  }
  myceliumBehemothAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(true&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase3?.68:b.phase2?.82:1,pool=b.phase3?['heartstorm','rootReaper','lattice','sporeCrown','colonyRise','heartstorm']:b.phase2?['rootReaper','mireQuake','sporeCrown','lattice','colonyRise']:['rootReaper','mireQuake','sporeCrown'];
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(20,Math.round((b.dmg||46)*.46));
    if(pick==='rootReaper'){
      this.behemothPose(b,2,1050);const a=Math.atan2(py-b.y,px-b.x),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setScale(Math.max(480,this.dist(b.x,b.y,px,py)+130)/256,.82).setTint(0x56e5bd).setAlpha(.82).setDepth(4));this.kitLane(line);
      this.showBanner('🌿 Root Reaper','Step off the green line before the claw fans outward!',820);this.tweens.add({targets:line,alpha:{from:.25,to:1},duration:130,yoyo:true,repeat:4,onComplete:()=>line.destroy()});
      this.time.delayedCall(650,()=>{if(!b.active)return;for(let i=-4;i<=4;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.12,425,bd,i%2?0x56e5bd:0xb46cff,1.05));this.screenShake(260,.009);});b.atkCd=2.65*fast;
    }else if(pick==='mireQuake'){
      this.behemothPose(b,3,1300);this.showBanner('🌊 Mire Quake','Three shockwaves expand at different speeds — cross behind each rim!',900);
      this.bossNovaWave(b.x,b.y,235,bd,300,b,inkCast);this.bossNovaWave(b.x,b.y,325,bd+2,720,b,inkCast);this.bossNovaWave(b.x,b.y,420,bd+4,1180,b,inkCast);b.atkCd=3.35*fast;
    }else if(pick==='sporeCrown'){
      this.behemothPose(b,4,1250);this.showBanner('☂️ Spore Crown','The crown opens — move into the missing violet wedge!',850);const n=b.phase3?24:b.phase2?20:16,gap=Phaser.Math.Between(0,n-1);
      this.time.delayedCall(480,()=>{if(!b.active)return;for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n||i===(gap+2)%n)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,220+(i%2)*52,bd-3,i%2?0xb46cff:0x6fffe0,1.12));}Sfx.zap();});b.atkCd=2.85*fast;
    }else if(pick==='lattice'){
      this.behemothPose(b,5,1400);this.showBanner('🕸️ Mycelial Lattice','Leave the glowing intersections — the center lane stays open!',920);
      for(const off of [-210,-105,105,210]){this.spawnHazard(px+off,py,55,bd,0x56e5bd,b,inkCast);this.spawnHazard(px,py+off,55,bd,0xb46cff,b,inkCast);}b.atkCd=3.15*fast;
    }else if(pick==='colonyRise'){
      this.behemothPose(b,6,1450);this.showBanner('🍄 Colony Rise','Bulwarks protect the Oracles — break the formation before it closes!',950);const types=b.phase3?['tank','shooter','bomber','fast','tank']:['tank','shooter','bomber','fast'];
      for(let i=0;i<types.length;i++)this.time.delayedCall(i*140,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(types[i]));});for(let i=0;i<4;i++){const a=i*TAU/4;(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('acid',px+Math.cos(a)*185,py+Math.sin(a)*185,8));}b.atkCd=3.55*fast;
    }else{
      this.behemothPose(b,7,1900);this.showBanner('🫀 HEARTSTORM','Run against the pull, cross the shockwaves, then take the open wedge!',1150);this.screenFlash(0xd95cff,.42,520);this.drainPull={x:b.x,y:b.y,t:2.25,strength:175};this.bossSig('07_heartstorm',b.x,b.y,420,{life:2.25,depth:2});
      this.bossNovaWave(b.x,b.y,270,bd+3,380,b,inkCast);this.bossNovaWave(b.x,b.y,370,bd+5,920,b,inkCast);
      this.time.delayedCall(720,()=>{if(!b.active)return;const n=26,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n||i===(gap+2)%n||i===(gap+3)%n)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,245+(i%2)*42,bd,i%2?0xd95cff:0x56e5bd,1.15));}this.screenShake(520,.017);Sfx.bossWarn();});b.atkCd=4.05*fast;
    }
  }
  /* v7.9.11 เจ้าของ: ท่าเฉพาะตัวให้บอส/มินิที่เหลือ (มินิ C1-3/4/5, C2-1, C3 ทั้ง 5 · บอส C3 ทั้ง 5 + Pinnacle) · ดาเมจเท่าชุดกลางเดิม (shot 9+3·si, ระเบิด 16+6·si) */
  kitPose(b,f,ms=800){if(this.bossInkPose?.(b,f,ms))return; if(/^c3_(mini|boss)[1-5]$/.test(this.bossInkBase?.(b)||b.texture?.key||''))this.c3BossPose(b,f,ms); else if(this.stageIndex===4)this.stage5Pose(b,f,ms); else if(this.stageIndex===5)this.chapter2Pose(b,f,ms); }
  kitAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(b.isBoss&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม C3 + Pinnacle
    const si=this.stageIndex,pin=!!(b._pinnacleArt||this._pinnacleRun),key=b.isBoss?(pin?'pin':'b'+si):'m'+si,K=BOSS_KITS[key]; if(!K){b.atkCd=1.5;return;}
    const pool=b.phase3&&K.p3?[...K.base,...(K.p2||[]),...K.p3]:b.phase2&&K.p2?[...K.base,...K.p2]:K.base,pick=Phaser.Utils.Array.GetRandom(pool),mv=K.moves[pick];
    const pw=b.isBoss?1:.9,sd=Math.round((9+si*3)*pw*(pin?1.15:1)),hd=Math.round((16+si*6)*pw*(pin?1.15:1)),fast=b.phase3?.72:b.phase2?.85:1,px=this.player.x,py=this.player.y,aim=Math.atan2(py-b.y,px-b.x),tint=mv.c||K.c||0xffa54d,T=(ms,fn)=>this.time.delayedCall(ms,()=>{if(b.active&&this.state!=='dead')fn();});
    const ring=(n,gap,spd,d=sd,c=tint,off=Math.random()*TAU,ox=b.x,oy=b.y)=>{const g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(gap&&((i-g+n)%n)<gap)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(ox,oy,off+i*TAU/n,spd,d,c,1.05));}Sfx.zap?.();};
    const fan=(a,n,step,spd,d=sd,c=tint)=>{for(let i=0;i<n;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+(i-(n-1)/2)*step,spd,d,c,1.05));Sfx.zap?.();};
    const lane=(a,ms,c=tint,len=640)=>{const l=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setScale(len/256,.7).setTint(c).setAlpha(.8).setDepth(4));this.kitLane(l,si===12&&this.bpAnim?.('vfx_b13_prism_beam')?{key:'vfx_b13_prism_beam',h:30}:{h:26});   /* v7.9.29 ใบ 30 */this.tweens.add({targets:l,alpha:{from:.25,to:1},duration:120,yoyo:true,repeat:Math.max(1,Math.round(ms/240)),onComplete:()=>l.destroy()});};
    const haz=(x,y,r,d=hd,c=tint)=>this.spawnHazard(x,y,r,d,c,b,inkCast);
    const adds=(types)=>types.forEach((t,i)=>T(i*140,()=>{const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(t));if(e)e.setPosition(b.x+Phaser.Math.Between(-140,140),b.y+Phaser.Math.Between(-90,90));}));
    if(mv.pose!=null)this.kitPose(b,mv.pose,mv.pms||850);
    this.showBanner(mv.n,mv.h,mv.long?1000:780);
    const cd=mv.run({s:this,b,inkCast,si,sd,hd,px,py,aim,fast,ring,fan,lane,haz,adds,T,tint});
    b.atkCd=(cd||2.4)*fast;
  }
  /* v7.9.13 เจ้าของ: กลไกสนามที่ต้องใช้ฝีมือ (docs/BOSS_ARENA_MECHANICS.md · นำร่อง 3 ตัว) · Counter Object = Dash ชนแล้วพุ่งกลับใส่บอส */
  arenaMechDue(b){ const now=this.elapsed||0; if(b._mechNext==null){b._mechNext=now+4.5;return false;} if(now<b._mechNext||b._arenaBusy)return false; b._mechNext=now+(b.phase3?8.5:b.phase2?10:12); return true; }
  arenaVw(){ return this.W/(this.cameras?.main?.zoom||1); }
  arenaHurt(dmg,x,y,r){ const p=this.player; if(p&&this.dist(p.x,p.y,x,y)<r)this.hurtPlayer(dmg,Math.atan2(p.y-y,p.x-x)); }
  bossStun(b,sec,label){ if(!b?.active)return; b.knock=Math.max(b.knock||0,sec); b.setVelocity?.(0,0); b.atkCd=Math.max(b.atkCd||0,sec+.4); b._mechNext=Math.max(b._mechNext||0,(this.elapsed||0)+sec+3);
    this.popDmg?.(label||'Stunned!',b.x,b.y-60,true); const r=this.camWorld(this.add.circle(b.x,b.y-70,14,0xffe08a,.9).setDepth(b.depth+2)); this.tweens.add({targets:r,angle:360,alpha:0,y:r.y-20,duration:sec*1000,onComplete:()=>r.destroy()}); }
  bossPctHit(b,pct){ if(!b?.active)return; const was=this._infTick; this._infTick=true; try{ this.damage(b,b.maxhp*pct,b.x,b.y); }finally{ this._infTick=was; } }
  // ของตอบโต้: kind ใช้สี/emoji · onHit(boss) ตอนพุ่งชนบอส · ไม่โดนเตะ 6 วิ = แตกเอง (เตือน 1 วิ)
  spawnCounter(b,x,y,{emoji='🥚',key=null,frame=null,tint=0xffe08a,life=10,onHit=null,drift=null,onArrive=null}={}){ const L=this._counters||(this._counters=[]); if(L.filter(c=>c.boss===b&&!c.dead).length>=(drift?6:2))return null;
    /* v8.0.18 เจ้าของ: ของให้เตะเกิดใกล้บอสเกินไป → ดันออกให้ห่างบอสอย่างน้อย 260px (ไปทางผู้เล่น) และอยู่นานขึ้น 6 → 10 วิ */ if(!drift&&b&&this.player){ const p=this.player,MD=260; let dx=x-b.x,dy=y-b.y,d=Math.hypot(dx,dy); if(d<MD){ if(d<20){ dx=p.x-b.x; dy=p.y-b.y; d=Math.hypot(dx,dy)||1; } x=b.x+dx/d*MD; y=b.y+dy/d*MD; } }
    const ra=this.bpAnim?.('vfx_counter_ring'),ring=this.camWorld(ra?this.add.sprite(x,y,'vfx_counter_ring',0).setDisplaySize(78,78).setTint(tint).setDepth(y-1):this.add.circle(x,y,26,tint,.18).setStrokeStyle(3,tint,.95).setDepth(y-1)); if(ra)ring.play('vfx_counter_ring');   /* v7.9.30 ใบ 31 B1 */
    key=key||this.counterArt?.(b); const an=key&&ASSET_FX[key]&&this.bpAnim?.(key);   /* v7.9.29 ใบ 30: ชีตของให้เตะ (loop) */
    const spr=this.camWorld(an?this.add.sprite(x,y,key,0).setDisplaySize(54,54).setDepth(y):key&&this.textures.exists(key)?this.add.image(x,y,key).setDisplaySize(46,46).setDepth(y):this.add.text(x,y,emoji,{fontSize:'34px'}).setOrigin(.5).setDepth(y)); if(an){ if(frame!=null||!ASSET_FX[key].loop)spr.setFrame(frame??0); else spr.play(key); }
    this.counterTeach?.(x,y);   // v7.9.93 เจ้าของ: สอนครั้งแรกว่า Dash ชนของเพื่อเตะใส่บอส
    { const bx=ring.scaleX,by=ring.scaleY; this.tweens.add({targets:ring,scaleX:{from:bx*.85,to:bx*1.15},scaleY:{from:by*.85,to:by*1.15},yoyo:true,repeat:-1,duration:420}); }
    const c={b,boss:b,x,y,spr,ring,tint,t:life,life,onHit,drift,onArrive,launched:false,dead:false}; L.push(c);Sfx.orderCue?.('counter_spawn',.3,.25); return c; }
  killCounter(c){ if(c.dead)return; c.dead=true; this.tweens.killTweensOf(c.ring); c.spr?.destroy(); c.ring?.destroy(); }
  tickArenaMech(dt){ const L=this._counters; if(!L||!L.length)return; const p=this.player,kick=(this.dashTime||0)>0||((this.elapsed||0)-(this._lastDashAt??-9))<.22;
    for(const c of L){ if(c.dead)continue; const b=c.boss;
      if(!b||!b.active){this.killCounter(c);continue;}
      if(c.launched){ const a=Math.atan2(b.y-c.y,b.x-c.x),sp=760*dt; c.x+=Math.cos(a)*sp; c.y+=Math.sin(a)*sp; c.spr.setPosition(c.x,c.y).setAngle((c.spr.angle||0)+900*dt); c.ring.setPosition(c.x,c.y);
        if(this.dist(c.x,c.y,b.x,b.y)<Math.max(48,(b.displayWidth||90)*.32)){ this.killCounter(c); this.screenShake?.(220,.012); Sfx.orderCue?.('counter_hit',.45,.2)||Sfx.hit?.(); this.vfxHitRing?.(b.x,b.y,0xffe08a,true); this.heroFx?.('vfx_counter_hit',b.x,b.y,170,{must:true,depth:b.depth+2,tint:c.tint}); c.onHit?.(b); }   /* v7.9.30 ใบ 31 B2 */ continue; }
      if(c.drift){ const a=Math.atan2(b.y-c.y,b.x-c.x),sp=c.drift*dt; c.x+=Math.cos(a)*sp; c.y+=Math.sin(a)*sp; c.spr.setPosition(c.x,c.y); c.ring.setPosition(c.x,c.y);
        if(this.dist(c.x,c.y,b.x,b.y)<60){ this.killCounter(c); c.onArrive?.(b); continue; } }
      if(p&&kick&&this.dist(p.x,p.y,c.x,c.y)<56){ c.launched=true; if(!this._inTutorial&&Save.data)Save.data.kicks=(Save.data.kicks||0)+1; (typeof DailyQ!=='undefined')&&!this._inTutorial&&DailyQ.tick('kick'); this.tweens.killTweensOf(c.ring); c.ring.setAlpha(.6); Sfx.orderCue?.('counter_kick',.4,.2)||Sfx.select?.(); this.popDmg?.('KICK!',c.x,c.y-30,true); continue; }
      c.t-=dt; if(!c.drift&&c.t<1&&!c._warn){ c._warn=true;Sfx.orderCue?.('counter_fuse',.22,.5); this.tweens.add({targets:c.spr,alpha:.35,yoyo:true,repeat:4,duration:100}); }
      if(c.t<=0){ this.killCounter(c); if(!c.drift){ this.vfxHitRing?.(c.x,c.y,0xff6b6b,false); this.arenaHurt(Math.round((b.dmg||30)*.35),c.x,c.y,70); } } }
    this._counters=L.filter(c=>!c.dead); }
  clearArenaMech(){ if(this._arenaFogCast)this.endArenaFog(this._arenaFogCast);this._arenaTicks=[];['arena_sweep','arena_fog','arena_pod_shield'].forEach(k=>Sfx.eventLoopStop?.(k)); for(const c of this._counters||[])this.killCounter(c); this._counters=[]; for(const o of this._arenaFx||[])if(o?.active)o.destroy(); this._arenaFx=[]; }
  arenaFx(o){ (this._arenaFx||(this._arenaFx=[])).push(o); return o; }
  // C2-3 Hornet Queen · Hive Rush (แบบผึ้งยักษ์ Terraria): บินไปข้างจอ → เส้นเตือนแนวนอนที่ระดับผู้เล่น → พุ่งข้ามจอ ซ้ายขวาสลับ
  hiveRush(b){ const passes=b.phase3?5:b.phase2?4:3,warn=b.phase3?820:b.phase2?900:1000,vw=this.arenaVw(),off=Math.min(vw*.62,560),sp=b.phase3?1250:1100;
    b._arenaBusy=true; this.hornetQueenPose?.(b,2,1200); this.showBanner('🐝 Hive Rush','She rushes across the screen — move up or down out of her lane!',1100);
    let side=b.x<this.player.x?-1:1; const step=i=>{ if(!b.active||this.state==='dead'){b._arenaBusy=false;return;} if(i>=passes){ b._arenaBusy=false; b.knock=0; b.atkCd=1.4;
        const c=this.spawnCounter(b,this.player.x+Phaser.Math.Between(-90,90),this.player.y+Phaser.Math.Between(-70,70),{emoji:'🍯',tint:0xffc23a,onHit:bb=>{this.bossPctHit(bb,.03);this.bossStun(bb,1.2,'Sticky!');if(!bb._sticky){bb._sticky=true;bb.spd*=.6;this.time.delayedCall(3200,()=>{if(bb.active){bb.spd/=.6;bb._sticky=false;}});}}});
        if(c)this.showBanner('🍯 Royal Jelly','Dash into the jelly to kick it back at the Queen!',1000); return; }
      const py=this.player.y,tx=this.player.x+side*off; b.knock=9; b.setVelocity(0,0);
      this.tweens.add({targets:b,x:tx,y:py,duration:360,ease:'Sine.inOut',onUpdate:()=>b.body?.reset(b.x,b.y),onComplete:()=>{ if(!b.active)return;
        const ln=this.arenaFx(this.camWorld(this.add.rectangle(this.player.x,py,vw*1.6,Math.max(46,(b.displayHeight||100)*.55),0xff3a4a,.24).setStrokeStyle(3,0xff6b6b,.95).setDepth(9000)));
        this.tweens.add({targets:ln,alpha:{from:.35,to:1},duration:110,yoyo:true,repeat:Math.round(warn/220)}); Sfx.bossWarn?.();
        this.time.delayedCall(warn,()=>{ ln.destroy(); if(!b.active)return; const dir=-side; b.knock=off*2/sp+.05; b.setVelocity(dir*sp,0); Sfx.dash?.(); this.screenFlash?.(0xffc95c,.12,120);
          this.bossSig?.('08_dive_trail',b.x,b.y,260,{h:60,anchor:'left',rot:dir>0?Math.PI:0,follow:b,life:.5,depth:b.depth-1});
          this.time.delayedCall(Math.round(b.knock*1000),()=>{ if(!b.active)return; b.setVelocity(0,0); side=-side; step(i+1); }); }); }}); };
    step(0); b.atkCd=99; }
