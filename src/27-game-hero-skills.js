  myceliumArtKey(type){
    const id=type==='fast'||type==='dasher'?'hopper':type==='shooter'?'sniper':type==='bomber'?'mold_sac':type==='tank'?'bulwark':type==='siege'?'oracle':type==='sporeling'?'sporeling':'drifter';
    const key='c22_'+id+'_animated';return this.textures.exists(key)?key:'ch2_mycelium_enemy_atlas';
  }
  nectarArtKey(type){
    const id=type==='fast'||type==='dasher'?'dartwing':type==='shooter'?'pollen_sniper':type==='bomber'?'honey_bomb':type==='tank'?'wax_guard':type==='siege'?'choir_moth':type==='grub'?'grub':'drone';
    const key='c23_'+id+'_animated';return this.textures.exists(key)?key:'ch2_nectar_enemy_atlas';
  }
  seasonArtKey(type){
    const id=({sprout:'bloom_sprout',fast:'sunscarab',dasher:'leafblade',shooter:'frostbell',bomber:'stormfruit',tank:'equinox',siege:'season_wisp'})[type]||'budling';
    const key='c24_'+id+'_animated';return this.textures.exists(key)?key:'ch2_seasons_enemy_atlas';
  }
  rootArtKey(type){
    const id=({fast:'thorn_charger',dasher:'bramble_assassin',shooter:'sap_oracle',bomber:'seed_bomb',tank:'bark_guard',siege:'root_choir'})[type]||'rootling';
    const key='c25_'+id+'_animated';return this.textures.exists(key)?key:'ch2_root_enemy_atlas';
  }
  antSpitWindup(e){
    if(!['e_ant_spitter_animated','e_acid_animated','e_drain_caster_animated','e_fire_grinder_animated','e_ice_caster_animated','e_banquet_eye_animated','c3_e_shooter_animated','c21_spore_lantern_animated','c22_sniper_animated','c22_oracle_animated','c23_pollen_sniper_animated','c23_choir_moth_animated','c24_frostbell_animated','c24_season_wisp_animated','c25_sap_oracle_animated','c25_root_choir_animated'].includes(e._enemyArtKey))return;
    if(e.shootCd>0&&e.shootCd<=0.18&&(!e._enemyAction||e._enemyAction.state!=='windup'))this.enemyAction(e,'windup',e.shootCd*1000);
  }
  warnAntBomber(e){
    if(!e.bomber||!['e_ant_drone_animated','e_drain_bomber_animated','e_fire_bomber_animated','e_ice_bomber_animated','e_maw_truffle_animated','c3_e_bomber_animated','c21_fruit_pod_animated','c22_mold_sac_animated','c23_honey_bomb_animated','c24_stormfruit_animated','c25_seed_bomb_animated'].includes(e._enemyArtKey)||e._antBombWarn||e.hp<=0||e.hp/e.maxhp>0.35)return;
    e._antBombWarn=true;this.enemyAction(e,'windup',400);
  }
  applySpecialEnemyArt(e,key){
    if(!e||!this.textures.exists(key))return false;
    // Normalize source frame coordinates so the existing world circle and box stay fixed.
    const width=e.width||256,ratio=256/width,scale=e.baseScale||e.scaleX||1,body=e.body;
    const circle=body&&body.isCircle?[body.radius,body.offset.x,body.offset.y]:null;
    e.setTexture(key,0);e.baseScale=scale/ratio;e._baseScale=e.baseScale;e.setScale(e.baseScale);
    if(circle)e.setCircle(circle[0]*ratio,circle[1]*ratio,circle[2]*ratio);
    e.tintColor=null;e.clearTint();this.resetEnemyPresentation(e);return true;
  }
  stopEnemyPresentation(e){
    this.stopBossInk?.(e);
    if(e._artOv){ if(e._artOv.active)e._artOv.destroy(); e._artOv=null; e.setAlpha?.(1); }
    e._brSp=null; e._missionDeathArt=false;
    e._enemyWeight=null;
    e._readCrest?.destroy();e._readCrest=null;e._readWind=false;
    e._glacierLifeToken=(e._glacierLifeToken||0)+1;e._frostBurnStacks=0;e._trem=0;e._shock=0;e._frostBurnUntil=0;e._frostBurnPower=0;e._frostBurnTick=0;e._glacierFrost=0;e._glacierFrostAt=0;e._glacierBrittleUntil=0;e._mintImpale=0;e._mintImpaleAt=-Infinity;e._mintRuptureAt=-Infinity;e._glacierBurstAt=-Infinity;e._chill=0;e._chillAt=null;
    if(e.anims){e.anims.stop();e.anims.timeScale=1;}
    e._enemyAction=null;e._enemyActionT=0;e._enemyPlayed=null;e._enemyFrozen=false;
    e._enemyAnimState=null;e._enemyArtKey=null;e._antBombWarn=false;e._stage5PoseToken=(e._stage5PoseToken||0)+1;
    e.rotation=0;e.stepT=0;e._sqX=1;e._sqY=1;
  }
  resetEnemyPresentation(e,frame=0){
    e._emergeUntil=0;
    e._spawnGrace=0;
    if(e._enemyArtKey==='feast_target_animated'){this.tweens.killTweensOf(e);e._fleeing=false;e._huntFlee=false;e.setAlpha(1);}
    this.stopEnemyPresentation(e);if(e.body)e.setVelocity(0,0);e._enemyArtKey=e.texture.key;e._enemyRestFrame=frame;
    this.tickEnemyPresentation(e,0);
  }
  enemyAction(e,state,ms=300,frame=null){
    if(state==='attack'||state==='hurt')this.enemyAudio?.(e,state);
    if(!e||!e.active||e.isBoss||e.isMini)return;
    if(e._bossInk){if(!['hurt','windup','attack','dash'].includes(state)){this.bossInkIdle?.(e);return;}if(state==='hurt'&&e._bossInk.pose&&['wind','strike','attack'].includes(e._bossInk.pose.kind))return;this.bossInkPose?.(e,state==='hurt'?5:state==='windup'?2:3,ms,state==='hurt'?'recover':state==='windup'?'wind':'attack');return;}
    if(state==='hurt'&&frame==null&&!this.anims.exists((e._enemyArtKey||e.texture.key)+'_hurt'))return;
    if(state==='hurt'&&e._enemyAction&&['windup','attack','dash'].includes(e._enemyAction.state))return;
    e._enemyAction={state,frame};e._enemyActionT=Math.max(0,ms/1000);e._enemyPlayed=null;
    this.tickEnemyPresentation(e,0);
  }
  enemyMotionWeight(e){
    const key=e._enemyArtKey||e.texture.key;let u=e._enemyWeight;
    if(!u||u.key!==key){const role=e.siege||e.spd>0&&e.spd<=40||/tank|guard|bulwark|beetle|sentinel/.test(key)?'heavy':e.dasher||e.spd>=100?'swift':e.shooter||e.acid?'ranged':'normal';u=e._enemyWeight={key,role,clock:0,hit:0,hitSide:1,hitPower:0};}return u;
  }
  enemyWeightHit(e,amount,x,critical=false){
    this.hitFlash?.(e);
    if(!e?.active||e.isBoss||e.isMini||e.hp<=0)return;const u=this.enemyMotionWeight(e);
    const from=Number.isFinite(x)&&x!==e.x?x:this.player?.x??e.x-1;
    u.hit=.16;u.hitSide=e.x>=from?1:-1;u.hitPower=Math.min(1,(critical?.7:.35)+amount/Math.max(1,e.maxhp)*2);
  }
  tickEnemyWeight(e,dt,state,speed){
    if(this.state&&this.state!=='play')return;
    const u=this.enemyMotionWeight(e),span=Math.max(0,Math.min(.1,dt)),red=this.hubMotionAllowed?.()===false;
    u.hit=Math.max(0,u.hit-span);u.clock+=speed>8?span:0;
    if(red){e.rotation=0;return;}
    const role=u.role,rate=role==='heavy'?.78:role==='swift'?1.3:role==='ranged'?.95:1;
    if(state==='walk'&&e.anims)e.anims.timeScale=Math.max(.55,Math.min(1.65,speed/Math.max(36,e.spd||70)*rate));
    const protectedPose=['windup','attack','dash'].includes(state),side=e.flipX?-1:1;
    const sway=state==='walk'?Math.sin(u.clock*(role==='swift'?17:role==='heavy'?7:11))*(role==='heavy'?.009:role==='swift'?.022:.014):0;
    const brace=state==='windup'?-side*.025:state==='attack'?side*.018:0;
    const hit=!protectedPose&&u.hit>0?Math.sin(u.hit/.16*Math.PI)*u.hitPower*u.hitSide*(role==='heavy'?.018:.045):0;
    e.rotation=sway+brace+hit;
  }
  tickEnemyPresentation(e,dt){
    if(this.state&&this.state!=='play')return;
    if(e?._bossInk){this.tickEnemyReadability?.(e);return;}if(!e||!e.active||e.isBoss||e.isMini)return;this.tickEnemyReadability?.(e);
    const key=e._enemyArtKey||e.texture.key,S=(this._presC||(this._presC={}))[key]||(this._presC[key]={walk:key+'_walk',a:{},g:{}}),hasWalk=this.anims.exists(S.walk);   // v7.8.92 perf: ข้อความชื่อ anim สร้างครั้งเดียวต่อ key
    // Frozen time does not consume an action pose or advance the sprite animation.
    if(e.frozen>0||e._timeStop){if(e.anims&&e.anims.isPlaying&&!e.anims.isPaused)e.anims.pause();e._enemyFrozen=true;return;}
    if(e._enemyFrozen){if(e.anims&&e.anims.isPaused)e.anims.resume();e._enemyFrozen=false;}
    if(e._enemyAction){e._enemyActionT-=dt;if(e._enemyActionT<=0){e._enemyAction=null;e._enemyPlayed=null;}}
    const v=e.body&&e.body.velocity,speed=v?Math.hypot(v.x,v.y):0;
    const state=e._enemyAction?e._enemyAction.state:speed>8?(key==='feast_target_animated'&&(e._huntFlee||e._fleeing)?'flee':'walk'):'idle',anim=S.a[state]||(S.a[state]=key+'_'+state);
    const frame=e._enemyAction&&e._enemyAction.frame!=null?e._enemyAction.frame:(e._enemyRestFrame||0),sk=state+frame,signature=S.g[sk]||(S.g[sk]=state+':'+frame);
    e._enemyAnimState=state;
    if(e._enemyPlayed!==signature){
      if(this.anims.exists(anim))e.play(anim,true);
      else {if(e.anims)e.anims.stop();e.setTexture(key,frame);}
      e._enemyPlayed=signature;
    }
    if(e.anims)e.anims.timeScale=state==='walk'?Math.max(0.65,Math.min(1.5,speed/70)):1;
    e.stepT=(e.stepT||0)+dt*7;e.rotation=hasWalk?0:state==='walk'?Math.sin(e.stepT)*0.025:0;
    e._sqX=(e._sqX??1)+(1-(e._sqX??1))*Math.min(1,dt*14);
    e._sqY=(e._sqY??1)+(1-(e._sqY??1))*Math.min(1,dt*14);
    const perspective=this._chapter25D?Math.max(0.94,Math.min(1.07,1+(e.y-this.player.y)*0.00010)):1,sc=(e.baseScale||1)*perspective;
    // Keep authored silhouettes stable; retain only a small, brief hit reaction.
    const limit=hasWalk?0.07:0.12,bob=!hasWalk&&state==='walk'?Math.abs(Math.sin(e.stepT))*.07:0;   /* v8.2.9 เดิม 3%/8% → โดนตีเห็นยุบ · v8.2.10 มอนไม่มีท่าเดิน: เด้งกระดึ๊บตามก้าว */e.setScale(sc*Math.max(1-limit,Math.min(1+limit,e._sqX))*(1+bob*.5),sc*Math.max(1-limit,Math.min(1+limit,e._sqY))*(1-bob));
    this.tickEnemyWeight?.(e,dt,state,speed);
  }
  playEnemyDeath(e){
    if(e?._bossInk){this.bossInkGhost?.(e);return;}
    const key=e._enemyArtKey||e.texture.key,anim=key+'_death',def=ASSET_SHEETS[key],flip=def&&def.deathFlip?!e.flipX:!!e.flipX;
    if(!this.anims.exists(anim)||!this.fxOk()){this.deathFling(e);return;}
    const ghost=this.trackArtVfx(this.camWorld(this.add.sprite(e.x,e.y,key,e._enemyRestFrame||0).setScale(e.baseScale||1).setFlipX(flip).setDepth(e.depth||e.y)));
    ghost.once('animationcomplete',()=>ghost.destroy());ghost.play(anim);
  }
  /* v8.1.105 เจ้าของ: มอนปกติ (ไม่ใช่ event/ภารกิจ) ต้องเดินเข้ามาจากขอบจอเท่านั้น → จุดเกิด = นอกกรอบกล้องเล็กน้อยตามทิศ ang ·
     ถ้าชิดขอบแมพจนจุดนั้นตกลงในจอ ลองทิศอื่น (ด้านที่ยังมีพื้นที่) */
  chapterVisibleSpawn(angle,wantedDistance){
    const {x,y}=this.player,zoom=this.viewZoom||1,view=this.cameras?.main?.worldView;
    const width=view?.width||this.W/zoom,height=view?.height||this.H/zoom;
    const viewX=view?.width?view.x:x-width/2,viewY=view?.height?view.y:y-height/2;
    const [mapLeft,mapTop]=inMapPt(-Infinity,-Infinity),[mapRight,mapBottom]=inMapPt(Infinity,Infinity);
    const left=Math.max(mapLeft,viewX+32/zoom),right=Math.min(mapRight,viewX+width-32/zoom);
    const hudInset=Math.min(100/zoom,height*.19);
    const top=Math.max(mapTop,viewY+hudInset),bottom=Math.min(mapBottom,viewY+height-hudInset);
    const dx=Math.cos(angle),dy=Math.sin(angle),epsilon=1e-6;
    const tx=Math.abs(dx)>epsilon?((dx>0?right:left)-x)/dx:Infinity;
    const ty=Math.abs(dy)>epsilon?((dy>0?bottom:top)-y)/dy:Infinity;
    const distance=Math.min(wantedDistance,tx,ty);
    if(distance<92)return null;
    const [sx,sy]=inMapPt(x+dx*distance,y+dy*distance);
    if(sx<left-epsilon||sx>right+epsilon||sy<top-epsilon||sy>bottom+epsilon)return null;
    const actualDistance=Math.hypot(sx-x,sy-y);
    if(actualDistance<92)return null;
    return {x:sx,y:sy,angle:Math.atan2(sy-y,sx-x),distance:actualDistance};
  }
  edgeSpawnPt(ang){ const P=this.player,z=this.viewZoom||1,cam=this.cameras?.main?.worldView,cx=cam&&cam.width?cam.centerX:P.x,cy=cam&&cam.height?cam.centerY:P.y,
      hw=(cam&&cam.width?cam.width:this.W/z)/2+42,hh=(cam&&cam.height?cam.height:this.H/z)/2+42,clamp=typeof inMapPt==='function'?inMapPt:(x,y)=>[x,y];
    const at=a=>{ const c=Math.cos(a),s=Math.sin(a),t=Math.min(Math.abs(c)>1e-4?hw/Math.abs(c):1e9,Math.abs(s)>1e-4?hh/Math.abs(s):1e9); return clamp(cx+c*t,cy+s*t); },
      inView=(x,y)=>Math.abs(x-cx)<hw-30&&Math.abs(y-cy)<hh-30;
    let best=at(ang); if(!inView(best[0],best[1]))return best;
    for(let i=1;i<12;i++){ const p=at(ang+i*Math.PI/6); if(!inView(p[0],p[1]))return p; }
    return best; }
  spawnEnemy(type,angOverride,radOverride,chapterArrival=false){
    if(this.storyCanSpawn?.(false,type)===false)return null;
    if(this.enemies&&this.enemies.countActive(true)>=(this.maxLive||100)+24)return null;   // v4.60: เพดานรวมกันมอนล้น (Colony Call/Mold Sac ของ C2-2 เคยสะสมถึง 209 ตัว) · ผู้เรียกทุกจุด guard null แล้ว
    const ang=angOverride!=null?angOverride:Math.random()*Math.PI*2;
    const [x,y]=radOverride!=null?(typeof inMapPt==='function'?inMapPt:(x,y)=>[x,y])(this.player.x+Math.cos(ang)*radOverride,this.player.y+Math.sin(ang)*radOverride):this.edgeSpawnPt(ang);
    let e=this.enemies.getFirstDead(false);
    let key=type==='acid'?'e_acid':type==='dasher'?'e_dasher':type==='fast'?'e_fast':type==='shooter'?'e_shooter':type==='bomber'?'e_bomber':type==='siege'?'e_siege':type==='tank'?'e_tank':'e_basic';
    if(this.stageIndex===0)key=this.antArtKey(type);
    if(this.stageIndex===1)key=this.drainArtKey(type);
    if(this.stageIndex===2)key=this.fireArtKey(type);
    if(this.stageIndex===3)key=this.iceArtKey(type);
    if(this.stageIndex>=10&&(this.textures.exists('c3_e_basic_animated')||this.textures.exists('c3_e_basic')))key=this.chapter3ArtKey(type);
    if(this.stageIndex===4)key=this.stage5ArtKey(type);
    const ch2Frame={basic:0,fast:1,dasher:1,shooter:2,bomber:3,tank:4,siege:5}[type]??0,mycoFrame={basic:0,fast:1,dasher:1,shooter:2,bomber:3,tank:4,siege:5,sporeling:6}[type]??0,nectarFrame={basic:0,fast:1,dasher:1,shooter:2,bomber:3,tank:4,siege:5,grub:6}[type]??0,seasonFrame={basic:0,fast:1,dasher:2,shooter:3,bomber:4,tank:5,siege:6}[type]??0,rootFrame={basic:0,fast:1,dasher:2,shooter:3,bomber:4,tank:5,siege:6}[type]??0;let atlasFrame=0;
    if(this.stageIndex===5){key='ch2_enemy_atlas';atlasFrame=ch2Frame;}else if(this.stageIndex===6){key='ch2_mycelium_enemy_atlas';atlasFrame=mycoFrame;}else if(this.stageIndex===7){key='ch2_nectar_enemy_atlas';atlasFrame=nectarFrame;}else if(this.stageIndex===8){key='ch2_seasons_enemy_atlas';atlasFrame=seasonFrame;}else if(this.stageIndex===9){key='ch2_root_enemy_atlas';atlasFrame=rootFrame;}
    if(this.stageIndex===5){key=this.canopyArtKey(type);if(key!=='ch2_enemy_atlas')atlasFrame=0;}
    if(this.stageIndex===6){key=this.myceliumArtKey(type);if(key!=='ch2_mycelium_enemy_atlas')atlasFrame=0;}
    if(this.stageIndex===7){key=this.nectarArtKey(type);if(key!=='ch2_nectar_enemy_atlas')atlasFrame=0;}
    if(this.stageIndex===8){key=this.seasonArtKey(type);if(key!=='ch2_seasons_enemy_atlas')atlasFrame=0;}
    if(this.stageIndex===9){key=this.rootArtKey(type);if(key!=='ch2_root_enemy_atlas')atlasFrame=0;}
    if(!e) e=this.enemies.create(x,y,key,atlasFrame);
    else { e.setTexture(key,atlasFrame); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }
    if(!e)return;   // pool Full (600) → ข้ามการเกิด (เวฟคุมด้วยเวลา ไม่นับจำนวน) กัน null crash
    e._mxBorn=this.elapsed||0;e._bestiaryType=this.stageIndex>=10?'c3_'+(({dasher:'fast',siege:'tank'})[type]||(['basic','fast','shooter','bomber','tank'].includes(type)?type:'basic')):null;
    this.tagTaroEnemy?.(e);this.clearObjectiveTargetFx(e);e._waveObjectiveTarget=false;
    // สเกลตามด่าน+Wave (ยิ่งลึกยิ่งอึด/ดาเมจสูง)
    const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),storyHp=[1,1.29,1.664,2.147,2.769,3.572,4.608,5.945,7.669,9.893,12.761,16.462,23.047,32.266,45.172],stageCurve=this.recipeMode?stageCurveValue(this.stageIndex,[1,1.42,1.88,2.42,3.05,3.72],1.18):(storyHp[this.stageIndex]??storyHp[14]*Math.pow(1.4,this.stageIndex-14)),waveCurve=([1,1.08,1.17,1.27,1.38][this.waveIndex]||1.38)*(this.stageIndex>=2&&this.stageIndex<=4&&this.waveIndex<=1&&!this.recipeMode?1.35:1),c2Mul=!this.recipeMode?1:this.stageIndex===6?BALANCE.c2Mycelium.hp:this.stageIndex===7?BALANCE.c2Nectar.hp:this.stageIndex===8?BALANCE.c2Seasons.hp:this.stageIndex===9?BALANCE.c2Root.hp:1,s=stageCurve*waveCurve*c2Mul*pg.enemyHp*this.killPowerMul()*this.diffMul().hp*this.newbieEase()/0.9;   // v6.55.26: HP ×1/0.9 ชดเชยดาเมจฐาน 100%   // ฐานแฟร์ (diff 1) + สเกลตามมอนที่ตาย + ระดับความยาก + ผ่อนให้ผู้เล่นใหม่
    e._timeStop=false; e.shooter=false; e.bomber=false; e.acid=false; e.shootCd=0; e.dasher=false; e.siege=false; e.dashState=null; e.tintColor=null;e.mycoRole=null;e.nectarRole=null;e.seasonRole=null;e.rootRole=null;
    e.bloomStacks=0;e.bloomUntil=0;e.frostbite=this.stageIndex===3;
    let scale=1;
    e._burnT=0;e._burnDps=0;e._sourT=0;
    if(type==='sporeling'){e.hp=7*s;e.spd=96;e.dmg=7;e.xp=0;e.setCircle(13,5,5);scale=.26;}
    else if(type==='acid'){ e.hp=26*s; e.spd=52; e.dmg=11; e.xp=2; e.acid=true; e.shootCd=Phaser.Math.FloatBetween(0.8,1.6); e.setCircle(22,26,26); }
    else if(type==='fast'){ e.hp=10*s; e.spd=122; e.dmg=9; e.xp=1; e.setCircle(15,4,4); }
    else if(type==='tank'){ e.hp=80*s; e.spd=36; e.dmg=18; e.xp=4; e.setCircle(26,5,5); }
    else if(type==='shooter'){ e.hp=19*s; e.spd=62; e.dmg=9; e.xp=2; e.shooter=true; e.shootCd=Phaser.Math.FloatBetween(1.1,2.0); e.setCircle(17,5,5); }
    else if(type==='bomber'){ e.hp=24*s; e.spd=70; e.dmg=12; e.xp=2; e.bomber=true; e.setCircle(17,5,5); }
    else if(type==='dasher'){ e.hp=16*s; e.spd=70; e.dmg=14; e.xp=2; e.dasher=true; e.dashState='chase'; e.dashT=Phaser.Math.FloatBetween(0.6,1.6); e.setCircle(17,5,5); }  // สายพุ่งโฉบ (รูปจริง e_dasher 44px)
    else if(type==='siege'){ e.hp=72*s;   /* v7.8.64 เจ้าของ: Siege ต้องไม่ถึกกว่า Tank → 90% ของ Tank (เดิม 260 = 3.3× Tank, C2-4 130) */ e.spd=24; e.dmg=18; e.xp=5; e.siege=true;   /* v7.8.65 ดาเมจชน = Tank · XP 10→5 */ e.setCircle(34,4,4); scale=1.5; }  // ถึกโหด เดินบีบวงช้า ๆ (รูปจริง e_siege 76px)
    else { e.hp=19*s; e.spd=58; e.dmg=10; e.xp=1; e.setCircle(17,5,5); }
    const storyDmg=[1,1.082,1.171,1.267,1.371,1.483,1.605,1.736,1.879,2.033,2.199,2.38,2.689,3.038,3.433],dmgCurve=this.recipeMode?stageCurveValue(this.stageIndex,[1,1.05,1.12,1.20,1.30,1.42],1.09)*(this.stageIndex===6?BALANCE.c2Mycelium.dmg:this.stageIndex===7?BALANCE.c2Nectar.dmg:this.stageIndex===8?BALANCE.c2Seasons.dmg:this.stageIndex===9?BALANCE.c2Root.dmg:1):(storyDmg[this.stageIndex]??storyDmg[14]*Math.pow(1.13,this.stageIndex-14));e.dmg=Math.max(1,Math.round(e.dmg*1.3/*v6.55.66 mob dmg*/*dmgCurve*pg.enemyDmg*this.diffMul().dmg));if(this.stageIndex>=10&&!this.recipeMode)e.spd*=1.08;   /* v7.8.65 เจ้าของ: Story ไต่ความยากสม่ำเสมอ HP ×1.29 / ดาเมจ ×1.082 ต่อด่าน · C3-3/C3-4/C3-5 ×1.40 / ×1.13 · ตัวคูณ C2 รวมในตารางแล้ว (Recipe ใช้สูตรเดิม) · C3 เดินเร็ว ×1.08 เท่า C2-5 */if(this.stageIndex===6)e.spd*=BALANCE.c2Mycelium.speed;else if(this.stageIndex===7)e.spd*=BALANCE.c2Nectar.speed;else if(this.stageIndex===8)e.spd*=BALANCE.c2Seasons.speed;else if(this.stageIndex===9)e.spd*=BALANCE.c2Root.speed;if(this.recipeMode&&this.recipeHas('haste'))e.spd*=1.3;if(this.recipeMode&&this._amapInf&&this._amapInf.frosty)e.spd*=1-0.07*this._amapInf.frosty;if(this.recipeMode&&this._pact&&this._pact.speed)e.spd*=1+0.1*this._pact.speed;
    e._a21Armor=type==='tank'||type==='siege';   /* v8.2.85 A21 เสียงตีโดนแบบเกราะ */
    if(this.stageIndex===0&&type!=='acid'){
      scale=(type==='tank'||type==='siege')?0.86:(type==='fast'||type==='dasher')?0.68:0.74;
      e.setCircle(type==='tank'||type==='siege'?25:20,type==='tank'||type==='siege'?23:28,type==='tank'||type==='siege'?23:28);
    }
    if(this.stageIndex===1){const role={basic:['Rotten Foam Spawn',0.64],fast:['Backflow Fiend',0.66],dasher:['Backflow Fiend',0.66],shooter:['Sewage Spitter Bubble',0.68],bomber:['Ferment Pressure Sac',0.70],tank:['Armored Grate Crab',0.76],siege:['Armored Grate Crab',0.76]}[type]||['Loose Pipe Bubble',0.64];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(type==='tank'||type==='siege'?38:30,type==='tank'||type==='siege'?26:34,type==='tank'||type==='siege'?26:34);}
    if(this.stageIndex===2){const role={basic:['Boiling Mochi Ember',0.62,24,40,46],fast:['Dashing Chili',0.58,20,44,50],dasher:['Dashing Chili',0.58,20,44,50],shooter:['Air-Gun Chili Grinder',0.66,24,40,45],bomber:['Chili Pressure Pot',0.68,26,38,42],tank:['Charcoal Furnace Golem',0.78,36,28,36],siege:['Charcoal Furnace Golem',0.90,36,28,36]}[type]||['Boiling Mochi Ember',0.62,24,40,46];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===3){const role={basic:['Frozen Sugar Spirit',0.62,24,40,46],fast:['Dashing Ice Shard',0.58,20,44,50],dasher:['Dashing Ice Shard',0.58,20,44,50],shooter:['Cold Syrup Turret',0.66,24,40,45],bomber:['Frost Pressure Bubble',0.68,27,37,41],tank:['Frozen Gate Warden',0.80,36,28,36],siege:['Frozen Gate Warden',0.92,36,28,36]}[type]||['Frozen Sugar Spirit',0.62,24,40,46];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===4){const role={basic:['Void Shard',0.36,45,83,83],fast:['Crown-Ripper Fiend',0.34,42,86,86],dasher:['Crown-Ripper Fiend',0.34,42,86,86],shooter:['Banquet Eye',0.38,45,83,83],bomber:['Bomb-Mouth Truffle',0.40,46,82,82],tank:['Crown Oven Guard',0.48,54,74,74],siege:['Crown Oven Guard',0.56,54,74,74]}[type]||['Void Shard',0.36,45,83,83];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===5){const role={basic:['Ferment Sprout',0.38,45,83,83],fast:['Vine Hunter',0.38,43,85,85],dasher:['Vine Hunter',0.38,43,85,85],shooter:['Spore Lantern',0.40,44,84,84],bomber:['Rotten Fruit Pod',0.42,47,81,81],tank:['Root-Back Beetle',0.48,53,75,75],siege:['Thorn Oracle',0.48,50,78,78]}[type]||['Ferment Sprout',0.38,45,83,83];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===6){const role={basic:['Mycelium Drifter','drifter',.39,45,83,83],fast:['Cap Hopper','hopper',.38,43,85,85],dasher:['Cap Hopper','hopper',.38,43,85,85],shooter:['Puffcap Sniper','sniper',.40,45,83,83],bomber:['Mold Sac','moldSac',.42,47,81,81],tank:['Mycelium Bulwark','bulwark',.48,54,74,74],siege:['Threadweaver Oracle','oracle',.44,48,80,80],sporeling:['Sporeling','sporeling',.26,34,94,94]}[type]||['Mycelium Drifter','drifter',.39,45,83,83];
      e.roleName=role[0];e.mycoRole=role[1];scale=role[2];e.clearTint();e.setCircle(role[3],role[4],role[5]);if(e.mycoRole==='oracle'){e.shooter=true;e.shootCd=Phaser.Math.FloatBetween(1.5,2.3);}if(e.mycoRole==='bulwark'){e._aura=this.camWorld(this.add.image(e.x,e.y,'vfx_ring').setTint(0x9ae66e).setDisplaySize(235,168).setAlpha(.34).setDepth(e.y-1));}}
    if(this.stageIndex===7){const role={basic:['Nectar Drone','drone',.37,43,85,85],fast:['Dartwing','dartwing',.36,42,86,86],dasher:['Dartwing','dartwing',.36,42,86,86],shooter:['Pollen Sniper','pollenSniper',.39,44,84,84],bomber:['Honey Bomb','honeyBomb',.42,47,81,81],tank:['Wax Shieldbearer','waxGuard',.47,53,75,75],siege:['Choir Moth','choirMoth',.43,48,80,80],grub:['Tiny Grub','grub',.25,34,94,94]}[type]||['Nectar Drone','drone',.37,43,85,85];
      e.roleName=role[0];e.nectarRole=role[1];scale=role[2];e.clearTint();e.setCircle(role[3],role[4],role[5]);if(e.nectarRole==='choirMoth'){e.shooter=true;e.shootCd=Phaser.Math.FloatBetween(1.4,2.1);}if(e.nectarRole==='waxGuard'){e._aura=this.camWorld(this.add.image(e.x,e.y,'vfx_ring').setTint(0xffc95c).setDisplaySize(225,160).setAlpha(.32).setDepth(e.y-1));}}
    if(this.stageIndex===8){const role={basic:['Spring Budling','budling',.37,43,85,85],fast:['Summer Sunscarab','sunscarab',.35,41,87,87],dasher:['Autumn Leafblade','leafblade',.39,44,84,84],shooter:['Winter Frostbell','frostbell',.38,43,85,85],bomber:['Stormcloud Fruit','stormfruit',.43,47,81,81],tank:['Equinox Gardener','equinoxGuard',.48,54,74,74],siege:['Seasonal Wisp','seasonWisp',.42,47,81,81],sprout:['Bloom Sprout','bloomSprout',.3,40,88,88]}[type]||['Spring Budling','budling',.37,43,85,85];
      e.roleName=role[0];e.seasonRole=role[1];scale=role[2];if(type==='sprout')e.spd*=1.4;e.clearTint();e.setCircle(role[3],role[4],role[5]);if(e.seasonRole==='seasonWisp'){e.shooter=true;e.shootCd=Phaser.Math.FloatBetween(1.35,2.0);}if(e.seasonRole==='equinoxGuard'){e._aura=this.camWorld(this.add.image(e.x,e.y,'vfx_ring').setTint(0x8fdcff).setDisplaySize(230,165).setAlpha(.33).setDepth(e.y-1));}}
    if(this.stageIndex===9){const role={basic:['Crown Rootling','rootling',.38,44,84,84],fast:['Thorn Charger','thornCharger',.39,44,84,84],dasher:['Bramble Assassin','brambleAssassin',.40,45,83,83],shooter:['Sap Oracle','sapOracle',.41,46,82,82],bomber:['Memory Seed Bomb','seedBomb',.44,48,80,80],tank:['Bark Bulwark','barkGuard',.49,55,73,73],siege:['Root Choir Leech','rootChoir',.44,49,79,79]}[type]||['Crown Rootling','rootling',.38,44,84,84];
      e.roleName=role[0];e.rootRole=role[1];scale=role[2];e.clearTint();e.setCircle(role[3],role[4],role[5]);if(e.rootRole==='rootChoir'){e.shooter=true;e.shootCd=Phaser.Math.FloatBetween(1.3,1.95);}if(e.rootRole==='barkGuard'){e._aura=this.camWorld(this.add.image(e.x,e.y,'vfx_ring').setTint(0xd56bff).setDisplaySize(235,168).setAlpha(.34).setDepth(e.y-1));}}
    if(this.stageIndex>=10&&key.startsWith('c3_e_')){
      const role={basic:['Ash Mochi',.82,26,38,48],fast:['Sunseed Sprinter',.86,22,42,56],dasher:['Sunseed Sprinter',.86,22,42,56],shooter:['Hollow Apple Sniper',.82,25,39,49],bomber:['Crownseed Pod',.84,27,37,48],tank:['Acorn Shield Knight',.66,38,26,42],siege:['Acorn Shield Knight',.72,38,26,42]}[type]||['Ash Mochi',.82,26,38,48];
      e.roleName=role[0];scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);
    }
    if(this._runTrait){ e.hp*=this._runTrait.hp||1; e.spd*=this._runTrait.spd||1; } { const _hm=this.rpMul?.('foeHp')||1,_sm=this.rpMul?.('foeSpd')||1; if(_hm!==1)e.hp*=_hm; if(_sm!==1)e.spd*=_sm; }   /* v8.2.29 Pact Relics */   // v7.8.100 ลักษณะพิเศษของรอบ
    e.isBoss=false; e.isMini=false; e.isElite=false; if(!this.recipeMode)e.hp*=(typeof STORY_HP_MUL==="number"?STORY_HP_MUL:1); e.maxhp=e.hp; e.frozen=0; e._glacierLifeToken=(e._glacierLifeToken||0)+1;e._frostBurnStacks=0;e._trem=0;e._shock=0;e._frostBurnUntil=0;e._frostBurnPower=0;e._frostBurnTick=0; e._glacierFrost=0; e._glacierFrostAt=0; e._glacierBrittleUntil=0;e._mintImpale=0;e._mintImpaleAt=-Infinity;e._mintRuptureAt=-Infinity; e._glacierBurstAt=-Infinity; e._chill=0; e._chillAt=null; e.knock=0; e.baseScale=scale; e._sqX=1; e._sqY=1; e.setScale(scale);
    e.setFlipX(false);this.resetEnemyPresentation(e,atlasFrame);
    if(e.tintColor)e.setTint(e.tintColor); else e.clearTint();
    e._bloat=false; e._feast=false; if(this._biome==='fermented'&&!e.isBoss&&!e.isMini&&Math.random()<0.18){ e._bloat=true; e.tintColor=0xb07cff; e.setTint(0xb07cff); } e._ember=false; if(this._biome==='spicy'&&!e.isBoss&&!e.isMini&&Math.random()<0.15){ e._ember=true; e._emberT=Math.random(); e.tintColor=0xff7a3d; e.setTint(0xff7a3d); }
    e._gold=false; if(this._goldWave&&!e.tintColor&&!e.isElite&&!e.isMini){ e.tintColor=GOLD_TINT; e.setTint?.(GOLD_TINT); e._gold=true; if(this.realTex?.('ev90_gold_shimmer')&&(this._goldShimN=(this._goldShimN||0)+1)%2===0)this.goldShimAdd?.(e); }   /* v8.2.31 ใบ 90 ประกาย (ครึ่งหนึ่งของมอน กันหนัก) */   /* v8.2.28 เวฟทอง */
    this.camWorld(e);
    this.vfxSpawnPoof(x,y);this.spawnRise?.(e,x,y,chapterArrival);this.storySpawned?.();this.enemyAudio?.(e,'spawn');return e;
  }
  /* v8.1.120 เจ้าของ: มอนที่เกิดในจอ (ขอบแผนที่) ไม่โผล่ทับตัวทันที → ค่อย ๆ ปรากฏ 0.3 วิ + วงฝุ่นที่พื้น + ชนไม่เจ็บ 0.42 วิ · เกิดนอกจอไม่ต้องทำอะไร */
  /* v8.2.44 มอนภารกิจค่อย ๆ เกิด: ground = พื้นแตก → ดันตัวขึ้น + ฝุ่น · portal = วงวนม่วง → ก้าวออก + แสงวาบ */
  emergeFoe(e,kind='ground'){ if(!e||!e.active||e.isBoss||!this.time)return; const now=this.time.now||0,ms=typeof EMERGE_MS!=='undefined'?EMERGE_MS:520; e._emergeUntil=now+ms; e._spawnGrace=Math.max(e._spawnGrace||0,now+ms); e.setVelocity?.(0,0);
    const full=(this._emergeLive|0)<(typeof EMERGE_FX_MAX!=='undefined'?EMERGE_FX_MAX:8)&&(Save.data?.settings?.vfx??1)!==0;
    this.time.delayedCall(0,()=>{ if(!e.active)return; const T=(e._artOv&&e._artOv.active)?e._artOv:e,sx=T.scaleX||1,sy=T.scaleY||1,x=e.x,gy=e.y+(e.displayHeight||40)*.35;
      if(this.tweens){ T.setScale?.(sx*(kind==='portal'?.2:1.25),sy*(kind==='portal'?.2:.12)); this.tweens.add({targets:T,scaleX:sx,scaleY:sy,duration:kind==='portal'?300:380,delay:kind==='portal'?180:140,ease:'Back.out'}); }
      if(!full||!this.add?.graphics)return; this._emergeLive=(this._emergeLive|0)+1; const g=this.camWorld(this.add.graphics().setDepth(kind==='portal'?e.y+2:-98990)); let t=0; const seed=Math.random()*6;
      const ev=this.time.addEvent({delay:30,loop:true,callback:()=>{ t+=30; const w=Math.min(1,t/ms); g.clear();
        if(kind==='portal'){ const r=(w<.55?w/.55:1-(w-.55)/.45)*34+4; g.lineStyle(4,0xc58bff,.85).strokeEllipse(x,e.y,r*2,r*1.1); g.lineStyle(2,0xffd6ff,.7).strokeEllipse(x,e.y,r*1.3,r*.7); if(w>.3&&w<.6){ g.fillStyle(0xffffff,.5*(1-Math.abs(w-.45)/.15)).fillCircle(x,e.y,r*.8); } }
        else { const rw=Math.min(1,w/.4); g.fillStyle(0x1a0624,.55*(1-Math.max(0,w-.7)/.3)).fillEllipse(x,gy,56*rw,18*rw); g.lineStyle(2,0x7a2ad0,.8*(1-Math.max(0,w-.7)/.3)); for(let k=0;k<4;k++){ const a=seed+k*1.6; g.lineBetween(x,gy,x+Math.cos(a)*34*rw,gy+Math.sin(a)*11*rw); }
          if(w>.3){ const d=(w-.3)/.7; for(let k=0;k<6;k++){ const a=seed+k*1.05; g.fillStyle(0x6b4a3a,.8*(1-d)).fillCircle(x+Math.cos(a)*(10+30*d),gy+Math.sin(a)*8*d-26*d*(1-d)*2,3); } } }
        if(t>=ms+60){ ev.remove(); g.destroy(); this._emergeLive=Math.max(0,(this._emergeLive|0)-1); } }}); }); }
  spawnRise(e,x,y,chapterArrival=false){ if(!e)return; e._occ=false; const v=this.cameras?.main?.worldView; if(!v||!v.width||!v.contains?.(x,y)||e.isBoss)return; const now=this.time?.now||0; e._spawnGrace=now+420;
    if(chapterArrival)e._emergeUntil=e._spawnGrace;
    if(this.tweens){ e.setAlpha?.(0); this.tweens.add({targets:e,alpha:1,duration:300,ease:'Sine.out'}); const gy=y+(e.displayHeight||40)*.4,r=this.camWorld(this.add.ellipse(x,gy,24,9,0xb98cff,.0).setStrokeStyle(3,0xb98cff,.85).setDepth(-98990)); this.tweens.add({targets:r,scaleX:3.2,scaleY:3.2,alpha:0,duration:420,ease:'Cubic.out',onComplete:()=>r.destroy()}); } }


  /* ---------- COMBAT ---------- */
  getBullet(x,y,tint,scale){
    let b=this.bullets.getFirstDead(false);
    if(!b) b=this.bullets.create(x,y,'proj_sprinkle');
    else { b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }
    if(!b){ b=this.bullets.getFirstAlive(); if(!b)return null; b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }   // pool Full → รีไซเคิลกระสุนที่เก่าสุด (กัน null.body crash ตอน x3)
    if(b.texture&&b.texture.key!=='proj_sprinkle')b.setTexture('proj_sprinkle');   // คืนรูป projectile เริ่มต้น (กันรูปสกิลก่อนหน้าค้างจาก pool)
    if(b._chargeFx){b._chargeFx.destroy();b._chargeFx=null;}
    b._shotgunTrail?.destroy?.();
    b.setAlpha(1);
    b.setScale(scale||1).setTint(tint||0xffffff).setRotation(0).setDepth(90000); if(b.body)b.body.setAllowGravity(false); this.camWorld(b);
    b.pierce=false; b.hitCd=0; b.hitGapV=0.16; b.boomer=false; b.returned=false;
    b.bounce=0; b.firePool=0; b.firePoolT=0; b.rebound=false; b.reb=0; b.spin=false; b.homing=0; b.homeSpeed=0; b.homeRange=0; b.explode=0; b.sticky=false; b.faceVel=false; b.chain=0;b.knockback=0;b.lockedTarget=null; b.bubblePrison=false; b.bubbleAwaken=false; b.iceNeedle=null;b.impaler=null;b.mintEpoch=null;b.mintDashShard=false;b.berrySeed=null;b.sgPellet=false;b.frShot=false;b._uqRocket=false;b._bpBoom=null;b._ptSniper=false; b.seedPop=0; b.seedPierce=false; b.hitTargets=null; b.headshot=0; b.bigMul=0; b.closeMul=0; b.bounceGain=0; b.pierceLeft=0; b.shatterInfo=null; b.shatterState=null; b.penGain=0;b._fist=false;b.forceHs=false;b.oneShot=false;b.cqMul=0;b.dragon=false;b.lastMul=0;b.seekMul=1;b.splitCh=0;b.boomer2=false;b._boomed=false;b.loopT=false;b._bounced=false;b._split=false;
    return b;
  }
  // คูลดาวน์เกือบคงที่ — เลเวลอัพเน้น "Effect" ไม่ใช่ยิงถี่ขึ้น
  cdOf(key,lvl){
    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='smite')return this.taroSwarmProfile(lvl).interval/(this.player.cdMul||1);
    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='storm')return this.taroTempestProfile(lvl).interval/(this.player.cdMul||1);
    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='tempest')return this.taroSwarmProfile(lvl).interval/(this.player.cdMul||1);
    let base=lvl>=SKILL_AWAKEN_LV?this._cdBase(key,SKILL_AWAKEN_LV)*0.85:this._cdBase(key,lvl);
    const sw=this.signatureWeaponInfo(),b=this.basicAttackInfo()?.skill===key?this.basicAttack:null;
    if(b&&this.character==='cocoa'&&key==='meteor')base=0.64;
    if(b&&this.character==='mint'&&key==='frost')base=Math.max(1.0,1.7-lvl*0.07);   // v6.70 Mint buff (เดิม max(1.25,1.95-0.08lvl))
       // มินต์ = basic attack ยิงถี่ (แทนคูลดาวน์ frost ปกติที่ช้า)
    if(b&&this.character==='sesame'&&key==='mirror')base=Math.max(0.85,1.45-lvl*0.06);   // งาดำ = Mirror Beam ยิงเป็นจังหวะ (แทน pulse field เดิม)
    const basicRate=(b?Math.pow(b.character==='mint'?0.93:0.92,b.ranks.rate||0)*Math.pow(0.97,b.ranks.tempo||0)*(b.mutation==='rush'?0.82:1):1)*(this.windRushT>0&&this.character==='mint'&&!(b&&b.path)?0.65:1)*(this.uqReady?.()?0.87:1)*(this.windRushT>0&&b?.uqMut==='gale_tail'?0.77:1)*(b&&this.character==='momo'&&key==='sprinkle'&&!b.path?1/1.15:1)*(b&&this.isSesRune?.()?1/this.sesRuneStats().attackRate:1);   // v7.6.7 Mint Gale ก่อนเลือกสาย: ตีเร็วขึ้น 35%
    if(b&&key==='sprinkle'&&b.path==='ricochet')base*=0.8;
    if(b&&key==='sprinkle'&&b.path==='sniper')base*=1.18;
    if(b&&key==='sprinkle'&&b.path==='shotgun')base*=0.9;
    const f=this.player.forgeMods||{},r=this.player.forgeMods?forgeState(this):{},rate=b?(1+(f[5]||0)/200)/(1+Math.min(.5,(f[2]||0)/100+((this.elapsed||0)<(r.breakHasteUntil||0)?(f[95]||0)/100:0))):1;const interval=rate*base*(sw.skill===key?(this.player.weaponCdMul||1):1)*basicRate*(b&&b._pm?b._pm.cd:1);return b&&this.character==='cocoa'&&b.path==='titan'?Math.max(.5/(this.player.cdMul||1),interval):interval;
  }
  _cdBase(key,lvl){
    switch(key){
      // สายยิงไว ดาเมจเบา (spam)
      case 'sprinkle': return Math.max(0.72,1.08-lvl*0.025);   // v4.19 nerf: ยิงช้าลง (เดิม max0.6, 0.98-0.03lvl)
      case 'popcorn':  return Math.max(0.55,0.95-lvl*0.05);
      case 'aura':     return Math.max(0.60,1.0-lvl*0.04);
      case 'whirl':    return Math.max(1.05,1.7-lvl*0.07);
      case 'echoStep': return Math.max(1.6,2.4-lvl*0.08);
      // สายกลาง
      case 'fork':     return Math.max(1.1,1.7-lvl*0.08);
      case 'boomer':   return Math.max(1.3,2.0-lvl*0.07);
      case 'thunder':  return Math.max(1.4,2.2-lvl*0.08);
      case 'wave':     return Math.max(1.4,2.2-lvl*0.08);
      case 'mirror':   return Math.max(3.0,4.2-lvl*0.12);
      case 'thread':   return Math.max(2.5,3.6-lvl*0.10);
      // สายคุมพื้นที่/DoT (ออกช้า)
      case 'bubble':   return Math.max(1.4,2.2-lvl*0.10);
      case 'mine':     return Math.max(1.9,2.8-lvl*0.10);
      case 'cloud':    return Math.max(2.2,3.2-lvl*0.10);
      case 'frost':    return Math.max(3.0,4.2-lvl*0.14);
      case 'memory':   return Math.max(3.3,4.6-lvl*0.12);
      case 'decoy':    return Math.max(4.0,5.4-lvl*0.14);
      // สายนุ๊ก ดาเมจหนัก ออกช้า (heavy burst)
      case 'beam':     return Math.max(1.4,2.2-lvl*0.08);
      case 'rocket':   return Math.max(1.5,2.3-lvl*0.08);
      case 'meteor':   return Math.max(2.0,2.9-lvl*0.10);
      case 'triseal':  return Math.max(1.8,2.7-lvl*0.09);
      default: return 1.6;
    }
  }
  castSkill(key,lvl){
    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='smite'){this.pulseSkill(key);this.castTaroSpark(lvl);return;}
    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='storm'){this.pulseSkill(key);this.castTaroChainBasic(lvl);return;}
    if(key==='thunder'&&this.character==='taro'&&this.basicAttack?.path==='tempest'){this.pulseSkill(key);this.castTaroSentry(lvl);return;}
    if(key==='meteor'&&this.character==='cocoa'&&this.basicAttack&&(this._cc?.busy||this._cocoaFlicker||this.dashTime>0))return;
    const sw=this.signatureWeaponInfo(),weaponMul=sw.skill===key?(this.player.weaponDmgMul||1):1;
    const basic=this.basicAttackInfo()?.skill===key?this.basicAttack:null,basicDmg=basic?(1+(basic.ranks.power||0)*0.12+(basic.ranks.overdrive||0)*0.05)*(basic._pm?basic._pm.dmg:1)*(basic.infusion?(FLAVOR_INFUSIONS.find(f=>f.id===basic.infusion)||{direct:1}).direct:1):1;
    const dm=this.player.dmgMul*(BALANCE.skillPower[key]||1)*weaponMul*basicDmg, cf={}, aw=lvl>=SKILL_AWAKEN_LV; this.pulseSkill(key);   // cf ปิดแล้ว (เลิกระบบคอมโบ) — เหลือแต่ Awaken
    if(aw&&Math.random()<0.5)this.awakenSpark(key);
    const _castColors={sprinkle:0xffb6e1,star:0xffe08a,thunder:0xfff2a8,whirl:0x8fd0ff,boomer:0xf0a92e,frost:0x7fc9ff,popcorn:0xffed8a,bubble:0x80e8d0,aura:0xff9ec4,fork:0xcccccc,mine:0xff8fb5,beam:0xfff2a8,meteor:0xffa54d,cloud:0xb6f0d6,rocket:0xff5a6e,wave:0xbfe8ff,mirror:0x9fe8ff,memory:0xd59cff,thread:0xffc6df,decoy:0x8fe8d0,triseal:0xffd166,echoStep:0xbca7ff};
    if(!(this.character==='cocoa'&&key==='meteor'))this.vfxCastGlow(_castColors[key]||0xffffff);   // v6.58.6 Chocolate เรียกทุกจังหวะหมัด (แม้ไม่มีศัตรู) → แสงวับรอบตัวตลอด
    if((this.character==='taro'&&key==='thunder')||(this.character==='sesame'&&key==='mirror'))this.poseAttack(440);
    if(key==='meteor'&&basic&&this.character==='cocoa'){this.castCocoaRush(lvl,aw,dm,basic.evolved,basic);return;}
    if(key==='sprinkle'){ if(basic&&this.character==='momo'){this.castBerryBlaster(lvl,aw,dm,basic);return;} if(!this.nearestEnemy(aw?900:640))return;
      if(this.character==='momo')this.poseAttack(340);
      // ปืนกล: รัวเมล็ดรุ้งเป็นชุด ยิงเร็ว/เบา · โดน 1 ตัวแล้วหายไปเลย (ไม่ทะลุ ไม่เด้ง) · เก็บทีละตัวรัว ๆ
      let shots=aw?6:lvl>=6?4:lvl>=5?3:lvl>=3?2:1;   // v4.20 nerf ต่อ: multishot หายากขึ้นมาก (ส่วนใหญ่ 1-2 นัด) — ลดความ "ยิงรัวโกง"
      if(basic)shots=Math.min(12,shots+(basic.ranks.volley||0)+(basic.mutation==='fan'?2:0)+(basic.evolved?2:0));
      if(this.player.twinSprinkle) shots+=3;shots+=this.player.gearCount||0;if(sw.skill===key)shots+=this.player.weaponShots||0;if(basic)shots=Math.min(12,shots);if(basic&&Math.random()<.15*(basic.lv?.size||0))shots++;   /* v8.0.70 Twin Seed */
      const path=basic?basic.path:null,R=basic?basic.ranks:{}; if(path==='sniper')shots=Math.max(1,Math.ceil(shots/2)); else if(path==='shotgun')shots=Math.min(18,shots+5+(R.buckshot||0));
      const RAINBOW=[0xff5a6e,0xff9e3d,0xffe14d,0x66e06a,0x5ad1ff,0x8f7bff,0xff7bd5];
      const speed=(aw?1180:980)*(path==='sniper'?1.35:1), gap=path==='shotgun'?0:(aw?38:52);   // เร็ว + รัวถี่ (machine gun) ·s่งตรง ไม่โค้ง
      let idx=0;
      let _sgBig=null; if(path==='shotgun'){ let bd=430; this.enemies.children.iterate(e=>{ if(e&&e.active&&(e.isBoss||e.isMini||e.isElite)){ const dd=this.dist(e.x,e.y,this.player.x,this.player.y); if(dd<bd){bd=dd;_sgBig=e;} } }); }   // v6.50: เดิมเล็งลูกน้องที่ยืนใกล้กว่าบอส
      const PT=this.player._pt||{}; let _vol=0; if(path==='shotgun'){this._sgVol=(this._sgVol||0)+1;_vol=this._sgVol;} if(path==='shotgun')shots=Math.min(18,shots+(PT.shell||0));
      const fireOne=()=>{ if(this.state!=='play')return; const t=(_sgBig&&_sgBig.active)?_sgBig:this.nearestEnemy(aw?900:640); if(!t)return;
        const shotIndex=idx++,b=this.getBullet(this.player.x,this.player.y,0xffffff,0.12+lvl*0.008+(aw?0.03:0)); if(!b)return;    // ตัวเล็กลงอีก
        b.setTexture('proj_sprinkle').setTint(RAINBOW[shotIndex%RAINBOW.length]); b.faceVel=true;
        const evo=basic&&basic.evolved;
        b.dmg=(5.25+lvl*1.5)*dm*(aw?1.12:1)*(this.player.twinSprinkle?1.2:1)*(evo?1.35:1)*(this.character==='momo'&&basic&&!basic.path?1.5:1); b.life=aw?2.2:1.9; b.pierce=!!evo; b.hitGapV=evo?0.12:0.16; b.bounce=(basic?(basic.mutation==='ricochet'?2:0):0)+(this.player.gearBounce||0); b.homing=0;
        b.headshot=0;b.bigMul=0;b.closeMul=0;b.bounceGain=0;b.seedPierce=!!b.pierce;b.penGain=0;b.forceHs=false;b.oneShot=false;b.cqMul=0;b.dragon=false;b.lastMul=0;b.seekMul=1;b.splitCh=0;b.boomer2=false;b.loopT=false;b._ptSniper=false;
        if(path==='sniper'){this.attachChargedSeed(b,38+lvl*2);b.dmg*=3.2;b.pierce=true;b.seedPierce=true;b.hitGapV=0.22;b.headshot=0.07*(R.headshot||0);b.bigMul=0.15*(R.deadeye||0);
          b.dmg*=1+(PT.sDmg||0);b.headshot+=PT.hs||0;b.bigMul+=PT.big||0;b.penGain=PT.pen||0;b.oneShot=!!PT.oneShot;b._ptSniper=true; if(this._ptHsNext){b.forceHs=true;this._ptHsNext=false;} if(PT.ghillie&&(this._ptStill||0)>=1.5&&!this._ptGhUsed){b.dmg*=2;this._ptGhUsed=true;}}
        else if(path==='shotgun'){b.dmg*=(typeof SG_PELLET_MUL!=='undefined'?SG_PELLET_MUL:.45);b.life=0.4;b.sgPellet=true;b.sgBlast=this.time?.now||0;b.closeMul=0.40+0.15*(R.pointblank||0)+(PT.close||0);b.cqMul=PT.cq||0;b.knockback=110+(PT.kb?60*PT.kb:0);b.dragon=!!PT.dragon;if(PT.slug&&shotIndex===Math.floor((shots-1)/2))b.dmg*=1+PT.slug;}
        else if(path==='ricochet'){b.dmg*=0.8;b.bounce+=2+(R.carom||0);b.bounceGain=0.08*(R.gather||0)+(PT.mom||0);b.dmg*=1+(PT.rDmg||0);if((PT.rDmg||0)>=0.119)b.bounce++;if(PT.pinball)b.bounce=Math.max(b.bounce,12);b.lastMul=PT.last||0;b.seekMul=1+(PT.seek||0);b.splitCh=PT.split||0;b.boomer2=!!PT.boomer;b.loopT=!!PT.loop;}   // v4.23 buff: ต้นเกมตี ~4→6 (×1.5 จาก 3.5+lvl*1.0)
        const distance=this.dist(t.x,t.y,this.player.x,this.player.y);
        const closeLarge=path==='shotgun'&&(t.isBoss||t.isMini||t.isElite)&&distance<430;
        const spread=closeLarge?0.11:0.16;
        const fan=path==='shotgun'?(shotIndex-(shots-1)/2)*spread:(basic&&basic.mutation==='fan'?(shotIndex-(shots-1)/2)*0.055:0);
        const ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+fan+Phaser.Math.FloatBetween(closeLarge?-0.04:-0.08,closeLarge?0.04:0.08);
        this.physics.velocityFromRotation(ang,speed,b.body.velocity); if(path!=='shotgun'){if(this.character==='momo')Sfx.strawberryShoot();else Sfx.shoot();}
        if(path==='shotgun'&&shotIndex===0)this.shotgunKick(ang); };
      if(path==='sniper'){
        if(this.textures.exists('vfx_strawberry_charge')){const halo=this.trackArtVfx(this.camWorld(this.add.image(this.player.x,this.player.y-24,'vfx_strawberry_charge').setDisplaySize(88,88).setDepth(90490).setAlpha(0.65)));this.tweens.add({targets:halo,alpha:0,scaleX:halo.scaleX*0.65,scaleY:halo.scaleY*0.65,duration:340,onComplete:()=>halo.destroy()});}else this.vfxCastGlow(0xffd166);
        this.time.delayedCall(340,()=>{if(this.state==='play')fireOne();});
        for(let s=1;s<shots;s++)this.time.delayedCall(340+s*gap,fireOne);
      }else{fireOne(); for(let s=1;s<shots;s++)this.time.delayedCall(s*gap,fireOne);
        if(path==='shotgun'&&PT.dbarrel&&_vol%4===0){idx=0;this.time.delayedCall(140,()=>{for(let s=0;s<shots;s++)fireOne();});}
        if(path==='shotgun'&&PT.recoil&&(this.elapsed||0)>=(this._ptRecoilAt||0)){this._ptRecoilAt=(this.elapsed||0)+1.2;const t=this.nearestEnemy(640);if(t){const a=Math.atan2(this.player.y-t.y,this.player.x-t.x);this.player.x+=Math.cos(a)*40;this.player.y+=Math.sin(a)*40;this.iframe=Math.max(this.iframe||0,0.15);}}} }
    else if(key==='thunder'){
      if(this.character==='taro'&&!basic?.path){this.castTaroNeedle(lvl,dm);return;}
      // Basic Attack ของตาโร่ (Rift Bolt Compass): arc=จำนวนชิ่ง · surge=จำนวนจุดฟาด · chainlord/stormcaller=สายกลายรูป
      const tEvo=basic&&basic.evolved;   // EVO: พายุสายฟ้าทั้งจอ — ฟาดหลายจุด + ชิ่งไกล/ยาวขึ้นมาก
      const bArc=(basic?.ranks.arc||0)+(basic?.mutation==='chainlord'?2:0)+(tEvo?3:0), bSurge=(basic?.ranks.surge||0)+(basic?.mutation==='stormcaller'?2:0)+(tEvo?2:0);
      const bChainRange=(basic?.mutation==='chainlord'?1.4:1)*(tEvo?1.5:1), bDmgMut=(basic?.mutation==='stormcaller'?1.2:1)*(tEvo?1.2:1);
      const strikes=(aw?3:lvl>=4?2:1)+bSurge+(basic?._pm?.count||0), chain=(aw?5:lvl>=5?3:lvl>=3?2:1)+(sw.skill===key?(this.player.weaponChains||0):0)+bArc, dmg=(14+lvl*4.2)*dm*(cf.storm?1.4:1)*(aw?1.15:1)*bDmgMut;
      const cand=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<(aw?760:520)) cand.push(e); });
      cand.sort((a,b)=>this.dist(a.x,a.y,this.player.x,this.player.y)-this.dist(b.x,b.y,this.player.x,this.player.y));   // เล็งตัวใกล้สุดก่อน (เดิมเล็ง HP สูง = ผ่ามั่ว)
      this.hitCratesInRadius(this.player.x,this.player.y,aw?760:520,dmg);   // ฟ้าผ่าก็ทุบกล่องในระยะ
      // v4.89.0: Taro Storm Charge — ฟ้าผ่าเล็งตัวใกล้สุดปกติ · ทุกฮิตโดนมอนธรรมดา = ⚡+1 · ครบ 10 → Judgment Bolt ฟาดบอส/มินิ ×6
      let gain=0; const isBig=o=>o.isBoss||o.isMini;
      for(let i=0;i<Math.min(strikes,cand.length);i++){ const e=cand[i]; if(!e||!e.active)continue; this.zap(e.x,e.y); this.damage(e,dmg,e.x,e.y); if(!isBig(e))gain++;
        let from=e; const hit=new Set([e]);
        for(let c=0;c<chain;c++){ let nb=null,nd=((aw?210:150)*bChainRange)**2;
          this.enemies.children.iterate(o=>{ if(o&&o.active&&!hit.has(o)){ const d=(o.x-from.x)**2+(o.y-from.y)**2; if(d<nd){nd=d;nb=o;} } });
          if(!nb)break; this.chainBolt(from.x,from.y,nb.x,nb.y); this.damage(nb,dmg*0.7,nb.x,nb.y); if(!isBig(nb))gain++; hit.add(nb); from=nb; } }
      if(this.character==='taro')this.taroChargeGain(gain,dmg);
      Sfx.thunder(); }
    else if(key==='whirl'){ const cnt=aw?16:lvl>=6?12:lvl>=4?10:lvl>=2?8:6, dmg=(4+lvl*1.8)*dm*(aw?1.15:1);
      const big=(lvl>=3?1.4:1.1)*(aw?1.2:1), speed=(lvl>=3?340:300)*(aw?1.2:1), pierce=lvl>=6||aw, tint=aw?0xffd166:0x8fd0ff; this.whirlAng+=0.5;
      for(let i=0;i<cnt;i++){ const ang=this.whirlAng+(i/cnt)*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.32+lvl*0.018+(aw?0.08:0)); b.setTexture('proj_whirl').setTint(0xffffff); b.spin=true; b.dmg=dmg; b.life=aw?1.3:0.95; b.pierce=pierce; b.hitGapV=0.14;
        this.physics.velocityFromRotation(ang,speed,b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='boomer'){ const cnt=aw?6:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, dmg=(8+lvl*2.6)*dm*(aw?1.15:1);
      const big=(1.4+lvl*0.1)*(aw?1.2:1), rebound=lvl>=5||aw; let gap=lvl>=3?0.10:0.16; if(cf.ricochet)gap*=0.7; if(aw)gap*=0.7;
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(760);
        const base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle(), ang=base+(s-(cnt-1)/2)*0.4;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffcf70:0xd9a066,big); b.dmg=dmg; b.life=2.0; b.pierce=true; b.hitGapV=gap;
        if(this.textures.exists('proj_boomer')){ b.setTexture('proj_boomer').setTint(0xffffff).setScale(0.5+lvl*0.05); }
        b.boomer=true; b.bt=0; b.bdur=0.44; b.rebound=rebound; b.spin=true; if(aw)b.reb=-1;   // reb=-1 → เด้งได้ 2 Waitบ (0,1)
        this.physics.velocityFromRotation(ang,430,b.body.velocity); } Sfx.shoot(); }
    else if(key==='frost'){
      // Basic Attack ของมินต์ = "Frost Lance" หอกน้ำแข็งทะลุแนว + สายธาร DoT/ชะลอ — frost nova เดิมยังใช้กับสกิลทั่วไปตัวอื่น
      if(basic&&this.character==='mint'){ this.castFrostLance(lvl,aw,dm,basic); return; }
      const df=this.player.deepFreeze?1.4:1,wm=sw.skill===key?(this.player.weaponAreaMul||1):1,wc=sw.skill===key?(this.player.weaponControlMul||1):1;
      // Basic Attack ของมินต์ (Frost Core Nova): chill=รัศมี · linger=ระยะเวลา · blizzard/permafrost=สายกลายรูป
      const bChill=1+(basic?.ranks.chill||0)*0.12*(basic?.mutation==='blizzard'?1:1)+(basic?.mutation==='blizzard'?0.25:0);
      const bLinger=(1+(basic?.ranks.linger||0)*0.15)*(basic?.mutation==='permafrost'?1.5:1);
      const fEvo=basic&&basic.evolved;   // EVO (Glacier Sovereign): โนวาสองระลอก + แตกน้ำแข็งเสมอ + วงใหญ่ขึ้น
      const bShatterDmg=basic?.mutation==='permafrost'?1.4:1, bAlwaysShatter=(basic?.mutation==='blizzard')||fEvo;
      const r=(150+lvl*16)*(aw?1.6:1)*df*wm*bChill*(fEvo?1.25:1), dur=(1.1+lvl*0.24)*(aw?1.3:1)*df*wc*bLinger, dmg=(6+lvl*2.4)*dm*(aw?1.2:1)*df, shatter=lvl>=3||aw||this.player.deepFreeze||bAlwaysShatter;
      if(fEvo)this.time.delayedCall(240,()=>{ if(this.state!=='play')return; const r2=r*1.15;
        if(this.textures.exists('fx_frostnova')&&this.anims.exists('fx_frostnova'))this.spawnFxAnim('fx_frostnova',this.player.x,this.player.y,{scale:(2*r2)/ASSET_FX.fx_frostnova.fw*0.82,depth:3,anchor:'center',alpha:0.7});
        this.enemies.children.iterate(e=>{ if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>=r2)return;
          if(e.frozen>0){ this.damage(e,(16+lvl*4)*dm*df*bShatterDmg,e.x,e.y); this.burst(e.x,e.y,0x8fd0ff); }
          if(!e.isBoss&&!e.isMini){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }
          this.damage(e,(e.isBoss||e.isMini)?dmg*1.7:dmg,e.x,e.y); }); this.hitCratesInRadius(this.player.x,this.player.y,r2,Math.max(dmg,10)); Sfx.frost(); });
      if(this.textures.exists('fx_frostnova')&&this.anims.exists('fx_frostnova')) this.spawnFxAnim('fx_frostnova',this.player.x,this.player.y,{scale:(2*r)/ASSET_FX.fx_frostnova.fw*0.82,depth:3,anchor:'center',alpha:Math.min(1,0.5+lvl*0.1)});
      else if(this.textures.exists('fx_frost')) this.fxBurst('fx_frost',this.player.x,this.player.y,r,aw?520:380,true);
      else { const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,12,COLORS.ice,0.4).setDepth(3));
        this.tweens.add({targets:ring,radius:r,alpha:0,duration:320,onComplete:()=>ring.destroy()}); }
      this.enemies.children.iterate(e=>{ if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>=r)return;
        if(shatter&&e.frozen>0){ this.damage(e,(16+lvl*4)*dm*df*bShatterDmg,e.x,e.y); this.burst(e.x,e.y,0x8fd0ff); }
        if(!e.isBoss&&!e.isMini){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }
        this.damage(e,(e.isBoss||e.isMini)?dmg*1.7:dmg,e.x,e.y); }); this.hitCratesInRadius(this.player.x,this.player.y,r,Math.max(dmg,10)); Sfx.frost(); }   // บอส/มินิแช่ไม่ได้ → ชดเชยด้วยดาเมจเย็นเจาะเกราะ (แก้ Mint สู้มินิยาก)
    else if(key==='popcorn'){ const cnt=aw?18:lvl>=4?10:lvl>=2?7:5, dmg=(7+lvl*2.3)*dm*(aw?1.12:1);
      const speed=(lvl>=5?430:350)*(aw?1.2:1), bounce=aw?1:0;
      for(let i=0;i<cnt;i++){ const ang=Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.27+lvl*0.018+(aw?0.07:0)); b.setTexture('proj_popcorn').setTint(0xffffff); b.faceVel=true; b.dmg=dmg; b.life=aw?1.05:0.72; b.pierce=false; b.bounce=bounce;b.knockback=aw?430:300; b.spin=true; b.hitGapV=0.12;
        this.physics.velocityFromRotation(ang,speed*(0.7+Math.random()*0.5),b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='bubble'){ const cnt=aw?7:lvl>=4?3:lvl>=2?2:1, dmg=(8+lvl*2.3)*dm*(cf.fizz?1.25:1)*(aw?1.15:1);
      const big=(lvl>=3?1.35:1.12)*(cf.fizz?1.2:1)*(aw?1.25:1);
      const target=this.strongestEnemy(760);for(let s=0;s<cnt;s++){ const ang=target?Math.atan2(target.y-this.player.y,target.x-this.player.x)+(s-(cnt-1)/2)*0.13:Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.30+lvl*0.02+(aw?0.07:0));
        if(!b)continue; b.dmg=dmg; b.life=2.8; b.pierce=false; b.homing=aw?520:(lvl>=4?390:280);
        b.bubblePrison=true; b.bubbleAwaken=aw; b.bubbleLevel=lvl; b.bubbleRadius=(62+lvl*9)*(aw?1.3:1);b.lockedTarget=target;
        if(this.textures.exists('bubble'))b.setTexture('bubble').setTint(0xffffff);
        this.physics.velocityFromRotation(ang,165,b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='aura'){ this.ensureAuraFx();   // ออร่าถาวร: sprite วนลูป + tick ดาเมจใน update (tickAura) ไม่ยิงเป็นครั้ง ๆ
      if(!(this.textures.exists('fx_aura')&&this.anims.exists('fx_aura'))){ const r=((60+lvl*16)*(aw?1.3:1)), dmg=(5+lvl*2)*dm*(aw?1.2:1);   // fallback ถ้าNoneอาร์ต
        const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,r,0xff9ec4,0.10).setDepth(3).setStrokeStyle(2,0xffb6e1,0.55));
        this.tweens.add({targets:ring,alpha:0,scale:1.06,duration:300,onComplete:()=>ring.destroy()});
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){ this.damage(e,dmg,e.x,e.y);
          if(aw&&!e.isBoss){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); e.setVelocity(Math.cos(a)*140,Math.sin(a)*140); e.knock=0.15; } } }); this.hitCratesInRadius(this.player.x,this.player.y,r,dmg); } }
    else if(key==='fork'){ const cnt=aw?10:lvl>=4?5:lvl>=2?3:2, dmg=(9+lvl*3)*dm*(aw?1.15:1);
      const t=this.nearestEnemy(760), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
      for(let s=0;s<cnt;s++){ const ang=base+(s-(cnt-1)/2)*(aw?0.075:0.16);
        const b=this.getBullet(this.player.x,this.player.y,0xeaeaff,1.15+lvl*0.08); b.dmg=dmg; b.life=1.4; b.pierce=true; b.hitGapV=0.12; b.chain=aw?3:(lvl>=4?2:0);   // ส้อมทะลุ + ลูกโซ่ไฟฟ้า
        if(this.textures.exists('proj_fork')){ b.setTexture('proj_fork').setTint(0xffffff).setScale(0.85); b.faceVel=true; } else b.spin=true;
        this.physics.velocityFromRotation(ang,560,b.body.velocity); } Sfx.shoot(); }
    else if(key==='mine'){ const cnt=aw?3:lvl>=4?2:1;
      const r=(76+lvl*9)*(aw?1.25:1), dmg=(7+lvl*2.2)*dm*(aw?1.15:1);
      for(let m=0;m<cnt;m++)this.deployCupcakeSentry(
        this.player.x+Phaser.Math.Between(-48,48),this.player.y+Phaser.Math.Between(-48,48),lvl,aw,dmg,r,m*90);
    }
    else if(key==='beam'){ const t=this.nearestEnemy(900); if(!t)return;
      const beams=aw?3:1, len=(760+lvl*30)*(aw?1.25:1), wide=(12+lvl*3)*(aw?1.2:1), dmg=(11+lvl*3.6)*dm*(aw?1.15:1);
      const base=Math.atan2(t.y-this.player.y,t.x-this.player.x);
      for(let k=0;k<beams;k++) this.fireBeam(base+(k-(beams-1)/2)*0.18,len,wide,dmg); Sfx.zap(); }
    else if(key==='meteor'){ if(this.character==='cocoa'&&basic)this.castCocoaRush(lvl,aw,dm,basic.evolved,basic); else this.castBearDonut(lvl,aw,dm,basic&&basic.evolved,basic); }
    else if(key==='mirror'){
      // งาดำเป็น aura ถาวร (tickCharSignature) แล้ว → "cast" = พัลส์กระจกกระแทกในเขต (ไม่ยิง projectile)
      if(basic&&this.character==='sesame'){ this.castMirrorBeam(lvl,aw,dm,basic); return; }
      this.castMirrorGlaze(lvl,aw,dm,basic); }
    else if(key==='memory'){ this.castMemoryJam(lvl,aw,dm); }
    else if(key==='thread'){ this.castFlavorThread(lvl,aw,dm); }
    else if(key==='decoy'){ this.castCoreDecoy(lvl,aw,dm); }
    else if(key==='triseal'){ this.castTriadSeal(lvl,aw,dm); }
    else if(key==='echoStep'){ this.castEchoStep(lvl,aw,dm); }
    else if(key==='cloud'){ const t=this.densestEnemy(620)||this.player, cx=t.x, cy=t.y;
      const r=(70+lvl*12)*(aw?1.3:1), dmg=(3+lvl*1.2)*dm*(aw?1.2:1), dur=(aw?4:2+lvl*0.3);
      const cloud=this.camWorld(this.add.image(cx,cy,'vfx_cloud_field').setDepth(2).setScale((r*2)/256*0.5).setAlpha(0.78));
      this.tweens.add({targets:cloud,scale:(r*2)/256,duration:300});
      if(this.textures.exists('fx_vortex')&&this.anims.exists('fx_vortex')) this.spawnFxAnim('fx_vortex',cx,cy,{scale:(2*r)/ASSET_FX.fx_vortex.fw,depth:3,anchor:'center'});
      const ticks=Math.max(1,Math.floor(dur/0.3));
      for(let k=1;k<=ticks;k++) this.time.delayedCall(k*300,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(cx,cy,r,dmg); });
      this.tweens.add({targets:cloud,alpha:0,delay:Math.max(0,dur*1000-350),duration:400,onComplete:()=>cloud.destroy()}); Sfx.frost(); }
    else if(key==='rocket'){ const cnt=Math.min(5,(aw?5:lvl>=4?3:lvl>=2?2:1)+(basic?(basic.ranks.cluster||0)+(basic.evolved?1:0):0)), sizeMul=basic?1+(basic.ranks.size||0)*0.14:1, dmg=(14+lvl*4)*dm*(aw?1.15:1)*(basic&&basic.mutation==='seeker'?1.2:1), er=(54+lvl*7)*(aw?1.2:1)*sizeMul*(basic&&basic.mutation==='sticky'?1.35:1)*(basic&&basic.evolved?1.18:1);
      for(let s=0;s<cnt;s++){ const t=this.strongestEnemy(780), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
        const b=this.getBullet(this.player.x,this.player.y,0xff8b6b,(1.3+lvl*0.08)*sizeMul); b.dmg=dmg; b.life=2.2; b.homing=(aw?520:360)*(basic&&basic.mutation==='seeker'?1.65:1); b.explode=er;b.lockedTarget=t;b.sticky=!!(basic&&basic.mutation==='sticky');
        if(this.textures.exists('proj_rocket')){ b.setTexture('proj_rocket').setTint(0xffffff).setScale(0.7*sizeMul); b.faceVel=true; } else b.spin=true;
        this.physics.velocityFromRotation(base+(s-(cnt-1)/2)*0.3,300,b.body.velocity); } Sfx.shoot(); }
    else if(key==='wave'){ const rings=aw?3:1, maxR=(165+lvl*22)*(aw?1.2:1), dmg=(4+lvl*1.5)*dm*(aw?1.15:1);
      for(let k=0;k<rings;k++) this.creamWave(maxR,dmg,k*180,aw?520:390); Sfx.boom(); }
  }
  updateUniqueHint(){
    if(!this.uniqueHint)return;if(this.isSesRune?.()){const r=this.sesRuneRecipe();this.uniqueHint.setText(!r.ready?'NOT READY':this.uniqueCd>0?Math.ceil(this.uniqueCd)+'s':this._sesRune?.castLock>0?'RECOVER':'CAST').setAlpha(r.ready?1:.5);return;}const hold=this.isSniperUnique()||this.isBlastUnique()||this.mintChargeKind()||!!this.isTitanHold?.()||!!this.isYuzuCommand?.();
    const text=this._titanHold?('RAGE '+Math.floor(this._titanRage||0)+'/3'):this._snipe?(this._snipe.kind==='yuzu'?'AIM':this.snipeCharge()>=1?'RELEASE':'CHARGE '+Math.round(this.snipeCharge()*100)+'%'):this.uniqueCd>0?Math.ceil(this.uniqueCd)+'s':hold?'HOLD':'TAP';
    if(this._uniqueHintLabel!==text){this._uniqueHintLabel=text;this.uniqueHint.setText(text);}this.uniqueHint.setAlpha(this.uniqueCd>0?.65:1);
  }
  refreshFlickerUI(){
    if(!this.flickerBtn)return;const visible=false,on=!!this._cocoaFlickerOn;
    this.flickerBtn.setVisible(visible).setFillStyle(on?0x5d3894:0x33243f,.92).setStrokeStyle(2,on?0xe3c3ff:0x9d83bd,.9);this.flickerTxt.setVisible(visible);
    const text='Flicker\n'+(on?'ON':'OFF');if(text!==this._flickerLabel){this._flickerLabel=text;this.flickerTxt.setText(text);}
  }
  toggleCocoaFlicker(){
    if(this.character!=='cocoa'||this.state!=='play')return;this._cocoaFlickerOn=!this._cocoaFlickerOn;
    if(!this._cocoaFlickerOn&&this._cocoaFlicker)this._cocoaFlicker.stop=true;
    this.refreshFlickerUI();Sfx.uiAction('click',()=>{});
  }
  cocoaFlickerTarget(anchor,range,locked){
    const valid=e=>e?.active&&!e._phaseGateLocked&&!(e._phaseInvuln>0)&&this.dist(e.x,e.y,anchor.x,anchor.y)<=range;
    if(valid(locked)&&(locked.isBoss||locked.isMini))return locked;
    let best=null,score=-Infinity;this.enemies.children.iterate(e=>{if(!valid(e))return;const d=this.dist(e.x,e.y,anchor.x,anchor.y),aim=this.joy?.active&&this.moveDir?.lengthSq()>.04?((e.x-anchor.x)*this.moveDir.x+(e.y-anchor.y)*this.moveDir.y)/Math.max(1,d):0;
      const value=(e.isBoss?3000:e.isMini?2000:0)+aim*120-d;if(value>score){score=value;best=e;}});return best;
  }
  cocoaFlickerRetreat(anchor,target){
    if(!target||!this.joy?.active||Math.abs(this.joy.dx||0)+Math.abs(this.joy.dy||0)<=.12)return false;
    const x=target.x-anchor.x,y=target.y-anchor.y,d=Math.hypot(x,y);return d>20&&(x*(this.joy.dx||0)+y*(this.joy.dy||0))/d<-.25;
  }
  // v6.58.1 Flicker เคลื่อนแบบลื่น: เส้นทาง + เงาตามหลัง แทนการวาร์ปทันที
  cocoaGlideTo(dest,sec,noLine){
    const p=this.player;if(!p?.active)return;this._cocoaGlide={player:p,sx:p.x,sy:p.y,dest,t:0,dur:sec,ghostAt:0};const dx=dest.x-p.x,dy=dest.y-p.y;if(Math.hypot(dx,dy)>8)p.setFlipX?.(dx<0);
    if(noLine||!this.add?.graphics||!this.tweens)return;const g=this.camWorld(this.add.graphics().setDepth(p.depth-1));
    g.lineStyle(10,0xc9a3ff,.22).lineBetween(p.x,p.y,dest.x,dest.y).lineStyle(3,0xffffff,.75).lineBetween(p.x,p.y,dest.x,dest.y);
    this.tweens.add({targets:g,alpha:0,duration:Math.max(220,sec*1000+160),ease:'Quad.in',onComplete:()=>g.destroy()});
  }
  tickCocoaGlide(dt){
    const gl=this._cocoaGlide,p=this.player;if(!gl)return;if(!p?.active||gl.player!==p){this._cocoaGlide=null;return;}
    gl.t+=dt;const k=Math.min(1,gl.t/gl.dur),e=1-Math.pow(1-k,3),clamp=n=>Math.max(-WORLD/2+40,Math.min(WORLD/2-40,n));
    const x=clamp(gl.sx+(gl.dest.x-gl.sx)*e),y=clamp(gl.sy+(gl.dest.y-gl.sy)*e),v=p.body?.velocity,vx=v?.x||0,vy=v?.y||0;if(p.body?.reset){p.body.reset(x,y);p.setVelocity(vx,vy);}else p.setPosition(x,y);
    if(gl.t>=gl.ghostAt&&k<1&&this.add?.image&&this.tweens&&p.texture){gl.ghostAt=gl.t+.035;const gh=this.camWorld(this.add.image(x,y,p.texture.key,p.frame.name).setScale(p.scaleX,p.scaleY).setFlipX(p.flipX).setTint(0xc9a3ff).setAlpha(.45).setDepth(p.depth-1));this.tweens.add({targets:gh,alpha:0,duration:220,onComplete:()=>gh.destroy()});}
    if(k>=1)this._cocoaGlide=null;
  }
  finishCocoaFlicker(cancel=false){
    const f=this._cocoaFlicker;if(!f)return;this._cocoaFlicker=null;this._cocoaFlickerPose=null;this._cocoaGlide=null;
    if(cancel&&this._cc){this._cc.gen=(this._cc.gen||0)+1;this._cc.busy=false;}
    if(f.player===this.player&&this.player?.active){this._attackPoseTime=0;this._attackTextureKey=null;}
    if(this.cameras?.main&&this.player?.active)this.cameras.main.startFollow(this.player,false,.2,.2);
    if(!cancel&&this.skillCd)this.skillCd.meteor=Math.max(this.skillCd.meteor||0,.10);
  }
  startCocoaFlicker(lvl,aw,dm,evo,basic){
    if(this._cocoaFlicker||this._cc?.busy||this.dashTime>0||this.state!=='play'||(this._cocoaJobs?.length||0)>=20)return;
    const anchor={x:this.player.x,y:this.player.y},range=150,target=this.cocoaFlickerTarget(anchor,range,this._cocoaFlickerBoss);
    const near=target&&this.dist(target.x,target.y,anchor.x,anchor.y)<=(target.body?.halfWidth||20)+70;
    if(!target||near||this.cocoaFlickerRetreat(anchor,target)){this.castCocoaRush(lvl,aw,dm,evo,basic,false,true);return;}
    this._cocoaFlickerBoss=target.isBoss||target.isMini?target:null;
    const f=this._cocoaFlicker={player:this.player,basic,path:basic.path,anchor,range,target,epoch:this._cocoaEpoch||0,left:basic.path==='titan'?1:basic.path==='dashboxer'?3:2};f.total=f.left;
    const strike=()=>{
      if(this._cocoaFlicker!==f)return;
      if(f.stop||!this._cocoaFlickerOn){this.finishCocoaFlicker();return;}
      anchor.x=this.player.x;anchor.y=this.player.y;f.target=this.cocoaFlickerTarget(anchor,range,f.target);if(!f.target||this.cocoaFlickerRetreat(anchor,f.target)){this.finishCocoaFlicker(true);return;}
      if((this._cocoaJobs?.length||0)>=24){this.finishCocoaFlicker(true);return;}
      const beat=this._cc?.step||0,wind=basic.path==='titan'?.24:(beat%5===4?.10:.05);
      const a=Math.atan2(anchor.y-f.target.y,anchor.x-f.target.x)+(f.total-f.left)*(basic.path==='dashboxer'?1.1:.65),gap=Math.max(52,(f.target.body?.halfWidth||20)+32);
      const glide=.26;this.cocoaGlideTo({x:f.target.x+Math.cos(a)*gap,y:f.target.y+Math.sin(a)*gap},glide);
      if(!this.cocoaLater(glide,()=>{if(this._cocoaFlicker!==f)return;if(!f.target?.active){this.finishCocoaFlicker(true);return;}
        this._cocoaFlickerPose={t:0,wind};this._attackPoseTime=0;this._poseHold=0;
        this.castCocoaRush(lvl,aw,dm/f.total,evo,basic,true);f.left--;
        if(!this.cocoaLater(wind+.24,()=>{if(this._cocoaFlicker!==f)return;if(f.left>0&&!f.stop)strike();else this.finishCocoaFlicker();}))this.finishCocoaFlicker(true);}))this.finishCocoaFlicker(true);
    };strike();
  }
  tickCocoaFlicker(dt){
    this.tickCocoaGlide(dt);const f=this._cocoaFlicker;if(!f)return;
    if(f.player!==this.player||f.basic!==this.basicAttack||f.path!==this.basicAttack?.path||f.epoch!==(this._cocoaEpoch||0)){this.finishCocoaFlicker(true);return;}
    if(this.state!=='play')return;
    if(!this._cocoaGlide){f.anchor.x=this.player.x;f.anchor.y=this.player.y;}
    if(this.dashTime>0||this.cocoaFlickerRetreat(f.anchor,f.target))this.finishCocoaFlicker(true);
  }
  cocoaComboHold(){const b=this.basicAttack;return b?.path==='brawler'?2.5:b?.path==='dashboxer'?3+.4*(b.lv.p_phantom||0):3;}
  clearCocoaCombat(){this.finishCocoaFlicker(true);this._cocoaFlickerBoss=null;this._cocoaEpoch=(this._cocoaEpoch||0)+1;this._cocoaJobs=[];this._cocoaPhantom=null;this._cocoaTrail=null;this._cocoaNextPunch=false;this._cocoaUniqueT=0;this._cc=null;this._ccCdMul=0;this._ccLeech=null;this._cocoaUsedAt=null;this._cocoaMinGap=0;for(const fx of this._cocoaMarks||[]){this.tweens?.killTweensOf(fx);if(fx.active)fx.destroy();}this._cocoaMarks=new Set();this._ccDots?.clear?.();this._titanRage=0;this._rageG?.clear?.();for(const q of this._cocoaPools||[])q.g?.destroy?.();this._cocoaPools=[];}
  cocoaLater(delay,fn){const jobs=this._cocoaJobs||(this._cocoaJobs=[]);if(jobs.length>=32)return false;jobs.push({t:delay,fn,player:this.player,basic:this.basicAttack,path:this.basicAttack?.path,epoch:this._cocoaEpoch||0,src:this._mxSrc});return true;}   /* v8.2.2: delayed hits keep their Combat Meter source (Titan fist / aftershocks counted as Unique, not 'other') */
  tickCocoaCombat(dt){
    if(this.character!=='cocoa'){if(this._cocoaJobs?.length||this._cocoaPhantom)this.clearCocoaCombat();return;}if(this.state!=='play'||!this.player?.active)return;
    this._cocoaUniqueT=Math.max(0,(this._cocoaUniqueT||0)-dt);this.tickCocoaPools(dt);if(this._cocoaNextPunch&&!(this._dashBuffT>0))this._cocoaNextPunch=false;
    const jobs=this._cocoaJobs||[];this._cocoaJobs=[];let fired=0;
    for(const j of jobs){if(j.player!==this.player||j.basic!==this.basicAttack||j.path!==this.basicAttack?.path||j.epoch!==(this._cocoaEpoch||0))continue;j.t-=dt;if(j.t<=0&&fired<4&&this.state==='play'){fired++;const ps=this._mxSrc;this._mxSrc=j.src??ps;try{j.fn();}finally{this._mxSrc=ps;}}else this._cocoaJobs.push(j);}
    const ph=this._cocoaPhantom;if(ph){ph.t-=dt;if(ph.t<=0||this.basicAttack?.path!=='dashboxer'){this._cocoaPhantom=null;this._cocoaTrail=null;}}
    const tr=this._cocoaTrail;if(tr){const p=this.player;this.cocoaTrailHit(tr,p.x,p.y);tr.x=p.x;tr.y=p.y;if(this.dashTime<=0){if(tr.finale){const fr=tr.finaleR||85;this.cocoaHit(p.x,p.y,fr,tr.finale,{push:180});this.cocoaVisual(p.x,p.y,fr,tr.finaleR?'fist':'punch',0xc9a3ff);if(tr.bossT?.active&&this.dist(tr.bossT.x,tr.bossT.y,p.x,p.y)<=fr+(tr.bossT.body?.halfWidth||40))this.damage(tr.bossT,tr.finale*.9,tr.bossT.x,tr.bossT.y);if(tr.finaleR){p.iframe=Math.max(p.iframe||0,.3);this.screenShake?.(110,.005);this.hitStop?.(35);this.cocoaLandingFx(p.x,p.y,fr);if(tr.leap)this.cocoaLeapMutation(p.x,p.y,fr,tr.finale);}Sfx.comboPunch(tr.seen.size,'heavy');}this._cocoaTrail=null;}}
  }
  cocoaVisual(x,y,r,kind='wave',color=0xffb347){
    if(!this.fxOk())return;const now=this.elapsed||0;if(now-(this._cocoaFxAt??-99)>.2){this._cocoaFxAt=now;this._cocoaFxN=0;}if((this._cocoaFxN||0)>=6)return;this._cocoaFxN=(this._cocoaFxN||0)+1;
    const fresh=kind==='punch'?'bpx_cocoa810_punch':kind==='shadow'?'bpx_cocoa810_dashring':kind==='fist'?'bpx_cocoa810_slam':'bpx_cocoa810_shockwave';if((this.realTex?.(fresh)??this.textures?.exists(fresh))&&this.heroFx?.(fresh,x,y,r*2,{depth:8,ts:r>150?.7:1}))return;
    if(kind==='punch'){this.spawnFxAnim('fx_cocoa_punch',x,y,{scale:Math.min(1.3,r/100),depth:8,normal:true,tint:color});return;}
    const key=kind==='shadow'?'char_cocoa_attack':kind==='fist'?'proj_bear_donut':'vfx_bear_shockwave';if(!this.textures.exists(key)){this.vfxHitRing(x,y,color,kind!=='punch');return;}
    const fx=this.trackArtVfx(this.camWorld(this.add.image(x,y-(kind==='fist'?110:0),key).setDepth(8).setTint(color).setAlpha(.8).setDisplaySize(r*2,r*2)));
    this.tweens.add({targets:fx,y,alpha:0,duration:kind==='fist'?420:280,onComplete:()=>fx.destroy()});
  }
  cocoaMark(x,y,r){const art=this.heroFx?.('bpx_cocoa_slam_mark',x,y,r*2/.9,{must:true,depth:5});if(art){this._cocoaMarks=this._cocoaMarks||new Set();this._cocoaMarks.add(art);return art;}if(!this.fxOk())return null;const fx=this.camWorld(this.add.graphics().setDepth(6));fx.lineStyle(3,0xffcf80,.8).strokeCircle(x,y,r);fx.lineStyle(1,0xffffff,.6).strokeCircle(x,y,r*.5);this._cocoaMarks=this._cocoaMarks||new Set();this._cocoaMarks.add(fx);return fx;}
  cocoaUnmark(fx){if(fx){this._cocoaMarks?.delete(fx);if(fx.active)fx.destroy();}}
  cocoaHit(x,y,r,power,opts={}){
    let landed=false;const p=this.player;
    this.enemies.children.iterate(e=>{if(!e||!e.active||this.dist(e.x,e.y,x,y)>r)return;if((e.isBoss||e.isMini)&&(e._phaseGateLocked||e._phaseInvuln>0))return;landed=true;
      let tm=1;if(opts.tremor){const now=this.time?.now||0;if(!(now-(e._tremT??-1e9)<=3000))e._trem=0;tm=1+.06*(e._trem||0);e._trem=Math.min(opts.tremor,(e._trem||0)+1);e._tremT=now;}
      this.damage(e,tm*power*(opts.center&&this.dist(e.x,e.y,x,y)<=r*.48?opts.center:1)*(opts.bossMul&&(e.isBoss||e.isMini)?opts.bossMul:1),e.x,e.y);
      if(opts.leech&&(e.isBoss||e.isMini))this.cocoaBossLeech();
      if(e.active&&!e.isBoss&&!e.isMini&&!e.isElite&&opts.push){const a=Math.atan2(e.y-y,e.x-x);e.setVelocity(Math.cos(a)*opts.push,Math.sin(a)*opts.push);e.knock=Math.max(e.knock||0,.14);}
    });this.hitCratesInRadius(x,y,r,power);return landed;
  }
  castCocoaRush(lvl,aw,dm,evo,basic,flickerHit=false,noFlick=false){
    // v6.58.3 Flicker = ตัวตนของ Brawler เท่านั้น (อัตโนมัติ ไม่มีปุ่ม) · Titan ยืนง้าง · Dash Boxer ใช้ Dash Leap
    this._cocoaFlickerOn=false;// v6.59.2 Brawler = Earth Stomp: กระทืบรอบตัว ไม่ flicker
    if(this._cocoaFlickerOn&&!flickerHit&&!noFlick){this.startCocoaFlicker(lvl,aw,dm,evo,basic);return;}
    const p=this.player,cc=this._cc||(this._cc={n:0,t:0,step:0,gen:0});if(cc.busy||this.dashTime>0||(this._cocoaJobs?.length||0)>=24)return;
    const reach=Math.min(235,Math.max(flickerHit?((this._cocoaFlicker?.target?.body?.halfWidth||20)+32)*1.5:0,(82+lvl*6)*(1+(basic.ranks.size||0)*.12)*(1+(basic._pm?.range||0))*(aw?1.2:1)));
    const fire=basic.path==='brawler';const target=flickerHit?this._cocoaFlicker?.target:this.nearestEnemy(fire?Math.max(380,reach*2.6):reach*1.2);if(!target){this._ccCdMul=.5;return;}if(cc.t>this.cocoaComboHold()){cc.step=0;cc.n=0;}
    const path=basic.path,ti=path==='titan',beat=cc.step%5,fin=!ti&&beat===4,gen=cc.gen||0,empowered=path==='dashboxer'&&this._cocoaNextPunch;
    const unit=(12+lvl*3.5)*dm*1.4*(aw?1.1:1)*this.cocoaDashBuffMul(),finMul=1+(basic.ranks.combo||0)*.18;
    const angle=()=>{const next=target.active?target:this.nearestEnemy(reach*1.2)||target;if(!next.active&&!flickerHit&&this.joy?.active&&this.moveDir.lengthSq()>.04)return this.moveDir.angle();return Math.atan2(next.y-p.y,next.x-p.x);};
    const a=angle(),lock={x:p.x+Math.cos(a)*reach*.6,y:p.y+Math.sin(a)*reach*.6};p.setFlipX(Math.cos(a)<0);cc.busy=true;
    const wind=ti?.24:(fin?.16:.12),mark=ti?this.cocoaMark(lock.x,lock.y,reach*.9):null;
    /* v7.6.14 Titan ไม่มีรอบคอมโบ 5 หมัดแล้ว: ทุกหมัด = Ground Pound เท่ากัน + ติด Tremor ให้ศัตรู */
    this._ccCdMul=ti?1.05:fin?1.08:.72;if(ti){this.bpPose?.('char_cocoa_titan_slam',wind+.2);/* v6.77: no lunge — walk freely while attacking */}else{const pk=fire?(fin?'char_cocoa_fire_fin':'char_cocoa_fire_jab'):path==='dashboxer'?'char_cocoa_dash_jab':'char_cocoa_attack';if(pk&&this.bpPose)this.bpPose(pk,wind+.2);else this.poseAttack(wind*1000+150,pk||undefined);}
    this.cocoaLater(wind,()=>{
      this.cocoaUnmark(mark);if((cc.gen||0)!==gen)return;cc.busy=false;
      const ang=path==='titan'?a:angle(),td=target.active?Math.min(reach*.6,this.dist(p.x,p.y,target.x,target.y)):reach*.6,x=path==='titan'?lock.x:p.x+Math.cos(ang)*td,y=path==='titan'?lock.y:p.y+Math.sin(ang)*td;
      if(fire){this.cocoaFireFist(ang,unit*(fin?1.55*finMul:.85)*(1+Math.min(.4,cc.n*.01)),fin,reach,basic);cc.n=Math.min(40,cc.n+1);cc.t=0;cc.step=(beat+1)%5;this.cocoaBeatCharge(.25);return;}
      const r=ti?reach*.95:fin?reach*1.05:reach*.64;
      const rage=0,rr=r*(1+rage*.15);
      const power=unit*(ti?1.15*(1+(basic.ranks.combo||0)*.08)*(basic.mutation==='breaker'?1.12:1):fin?1.55*finMul*(basic.mutation==='breaker'?1.25:1):.8)*(1+Math.min(.4,cc.n*.01))*(empowered?1.35:1)*TITAN_RAGE_MUL[rage];
      const landed=this.cocoaHit(x,y,rr,power,{push:ti?170:fin?340+rage*80:70,leech:true,bossMul:ti?1.4:1,tremor:ti?5+(basic.ranks.combo||0):0});   /* v7.6.5 Titan หมัดหนัก +40% ใส่บอส/มินิ */const tSl=ti?this.heroFx?.('bpx_cocoa_titan_slam',x,y,rr*2/.9,{must:true,depth:6}):null;if(landed&&ti){if(!tSl)this.bpFx?.('bpx_cocoa_shockwave',x,y,rr*2);this.bpFx?.('bpx_cocoa_crack',x,y,rr*1.6,{depth:5});this.screenShake?.(70,.0028);}if(landed&&fin){if(rage>0)this.titanRageImpact(x,y,rr,rage,basic);else{this.hitStop?.(40);this.screenShake?.(path==='titan'?150:110,path==='titan'?.007:.005);}}if(!tSl)this.cocoaVisual(x,y,r,ti?'fist':'punch',path==='dashboxer'?0xc9a3ff:0xffb347);(ti&&Sfx.bp?.('cocoa_titan_slam',.52,.08))||Sfx.comboPunch(cc.n,fin?'heavy':'jab');
      if(ti)this.titanFaultLine?.(x,y,rr,power);   /* v8.2.2+ เจ้าของ C: Ground Pound ส่งรอยแยกไปหาบอส/มินิที่อยู่นอกวงไม่เกิน 200px */
      if(!landed)return;cc.n=Math.min(40,cc.n+1);cc.t=0;cc.step=ti?0:(beat+1)%5;this.cocoaBeatCharge(.25);if(empowered)this._cocoaNextPunch=false;
      const live=()=>this._cc===cc&&(cc.gen||0)===gen;
      if(fin&&path==='brawler'){
        const total=Math.max(1,basic._pm?.wave||1),waves=Math.min(3,total),waveMul=1+Math.max(0,total-3)*.08;
        for(let i=0;i<waves;i++)this.cocoaLater((evo?.25:.13)+i*.16,()=>{if(!live())return;const radius=reach*(evo?1.65:1.5);this.cocoaHit(p.x,p.y,radius,unit*.55*waveMul,{push:200});this.cocoaVisual(p.x,p.y,radius);});
        if(evo)for(let i=0;i<2;i++)this.cocoaLater(.07+i*.09,()=>{if(!live())return;this.cocoaHit(p.x+Math.cos(ang)*reach*.6,p.y+Math.sin(ang)*reach*.6,reach*.65,unit*.55);this.cocoaVisual(p.x,p.y,reach*.65,'punch');});
      }
      if(ti?(basic.mutation==='breaker'||evo):fin&&basic.mutation==='breaker')this.cocoaLater(.28,()=>{if(!live())return;const mul=ti?(evo?.35:.25):.5;this.cocoaHit(x,y,r*1.15,power*mul,{push:180});this.cocoaVisual(x,y,r*1.15);});
      if(ti&&basic.mutation==='rush')this.cocoaLater(.16,()=>{if(!live())return;this.cocoaHit(x,y,r*.85,power*.35,{push:120});this.cocoaVisual(x,y,r*.85,'wave',0xd59b65);});   /* v7.8.28 Rushdown บน Titan: ระลอก tremor ตาม (เดิมหมัดตามไม่ออกเพราะไม่มีหมัดที่ 5) */
      if(fin&&basic.mutation==='rush')for(let i=0;i<2;i++)this.cocoaLater(.08+i*.1,()=>{if(!live())return;this.cocoaHit(x,y,reach*.65,unit*.35);this.cocoaVisual(x,y,reach*.65,'punch');});
      if(empowered&&evo)this.cocoaLater(.14,()=>{if(!live())return;this.cocoaHit(x,y,r,power*.65);this.cocoaVisual(x,y,r,'shadow',0xc9a3ff);});
    });
  }
  // v6.59.0 Titan Blood Rage: ยืนนิ่งชาร์จ (เสียเลือด) · หมัดที่ 5 ใช้หมด · ยิ่งเสี่ยงยิ่งอลังการ · regen สูงกว่าสายอื่น
  // v6.59.3 Channeling ไม่ถูกขัด: นับว่าเดินเฉพาะเมื่อผู้เล่นโยกจอยเอง (แรงกระแทกไม่นับ) และไม่โดนผลักระหว่างชาร์จ
  isTitanHold(){return this.character==='cocoa'&&this.basicAttack?.path==='titan';}
  releaseTitanCharge(){const h=this._titanHold;this._titanHold=null;if(!h||this.state!=='play'||this.uniqueCd>0)return;this._titanRelease=Math.min(this.titanMaxLv(),Math.floor(this._titanRage||0));this._titanRage=0;this.useCharacterSkill(true);this._titanRelease=0;}   /* v8.2.1 owner 🐞: the hold IS the wind-up → release casts at once (noWind). Since v8.1.152 the 0.17 s tap wind-up ran after _titanRelease was reset → every Colossus Fist landed as Rage 0 */
  titanMoving(){return !!(this.joy?.active&&Math.hypot(this.joy.dx||0,this.joy.dy||0)>.15);}
  titanChanneling(){return this.titanRageOn()&&!this.titanMoving()&&(this._titanRage||0)>0;}
  titanRageOn(){return this.character==='cocoa'&&this.basicAttack?.path==='titan'&&this.state==='play'&&this.player?.active;}
  tickTitanRage(dt){
    const g=this._rageG;if(!this.titanRageOn()){this.titanRageArtOff?.();this._titanRage=0;Sfx.bpLoopStop?.('uq_titan_charge');if(g)g.clear();if(this._rageAura){if(this._rageAura.active)this._rageAura.destroy();this._rageAura=null;}return;}
    const p=this.player,b=this.basicAttack,iron=b.lv?.p_ironblood||0,moving=this.titanMoving();
    if(!this._rageG||!this._rageG.active)this._rageG=this.camWorld(this.add.graphics().setDepth(7));
    let r=this._titanRage||0;const prev=Math.floor(r);
    if(this._titanHold&&(this.uniqueCd>0||this.state!=='play'))this._titanHold=null;
    if(this.uniqueBtn){const k=this._titanHold?.86:1;if(this.uniqueBtn.scaleX!==k){this.uniqueBtn.setScale(k);this.uniqueTxt?.setScale(k);}}
    if(this._titanHold){const M=this.titanMaxLv();r=Math.min(M,r+dt*(1+.2*(b.lv?.p_fastrage||0)+this.ptv('trSpeed'))/TITAN_RAGE_SEC);const cost=p.maxhp*.025*(1+Math.floor(r)*.5)*(1-.2*iron)*(b.mutation==='bloodpact'?1.5:1)*(this.cocoaHasInf('sweet')?.7:1)*Math.max(.3,1-this.ptv('trCost'))*dt;p.hp=Math.max(1,p.hp-cost);this._rageCharging=true;Sfx.bpLoopStart?.('uq_titan_charge',.26);Sfx.bpLoopRate?.(.9+.08*r);}
    else{r=0;this._rageCharging=false;Sfx.bpLoopStop?.('uq_titan_charge');
      if(!this.recipeHas('noheal')&&!p._uqNoRegen&&p.hp<p.maxhp)p.hp=Math.min(p.maxhp,p.hp+p.maxhp*(.012+.004*iron+this.ptv('trRegen'))*this.pactHealMul()*dt);}
    this._titanRage=r;const lv=Math.floor(r);if(lv>prev){if(lv>=this.titanMaxLv())Sfx.bp?.('uq_titan_full',.65,.5);else Sfx.bp?.('cocoa_rage_level',.6,.1,0.92+0.08*lv);this.screenShake(60+lv*30,.002+lv*.0012);}
    {const base=r>0.02&&!(typeof CODE_VFX!=='undefined'&&CODE_VFX.cocoa)?'bpx_cocoa_rage'+Math.min(3,Math.max(1,lv||1)):null,want=base?(this.battleOutlineKey?.(base)||base):null,au=this._rageAura;if(au&&(!au.active||au.texture.key!==want)){if(au.active)au.destroy();this._rageAura=null;}if(want&&!this._rageAura)this._rageAura=this.bpLoop?.(want,p.x,p.y,120,p.depth-1)||null;if(this._rageAura)this._rageAura.setPosition(p.x,p.y-10).setDepth(p.y-1).setScale((120+r*24)/256);}   /* v8.1.66 คืนออร่ารอบตัวตามเดิม (v8.1.61 ย่อผิดชิ้น) */
    const G=this._rageG;G.clear();if(r<=0.02){this.titanRageArtOff?.();return;}
    const t=this.time.now/1000,col=lv>=3?0xff2a2a:lv>=2?0xff6a1a:0xffb347,rad=(34+r*12+Math.sin(t*(6+lv*4))*3)*.8;
    if(typeof CODE_VFX!=='undefined'&&CODE_VFX.cocoa){ /* v8.1.157 เจ้าของ: ออร่า Rage (ภาพวงไฟ+ปุยควัน ดูเป็นพวงดอกไม้ · เยอะไป) → เปลวไฟเล็ก ๆ ลุกที่เท้า + ถ่านลอยขึ้น · ระดับสูง = เปลวสูง/ถี่/แดงขึ้น */
      const fy=p.y+(p.displayHeight||56)*.38,n=4+lv*2,ew=rad*1.25; G.fillStyle(col,.10+lv*.05).fillEllipse(p.x,fy,ew*2,ew*.7);
      for(let i=0;i<n;i++){ const a=i/n*Math.PI*2+t*.8,fx=p.x+Math.cos(a)*ew*.85,fyy=fy+Math.sin(a)*ew*.3,h=(10+lv*7)*(.7+.3*Math.sin(t*(9+i)+i*1.7)),w=4+lv; G.fillStyle(col,.75).fillTriangle(fx-w,fyy,fx+w,fyy,fx+Math.sin(t*7+i)*2,fyy-h); G.fillStyle(0xfff1b0,.8).fillTriangle(fx-w*.45,fyy,fx+w*.45,fyy,fx,fyy-h*.55); }
      for(let i=0;i<2+lv*2;i++){ const ph=(t*.9+i*.37)%1,ex=p.x+Math.sin(i*2.3+t)*ew*.7,ey=fy-ph*(40+lv*16); G.fillStyle(i%2?0xffd166:col,.85*(1-ph)).fillCircle(ex,ey,1.6+lv*.4); } }
    else{ G.lineStyle(3+lv,col,.55+lv*.12).strokeCircle(p.x,p.y+6,rad);G.fillStyle(col,.08+lv*.05).fillCircle(p.x,p.y+6,rad); }
    {const SR=this.titanSlamRadius(r);let pv=this._ragePv;if(pv&&!pv.active)pv=this._ragePv=null;if(!pv&&this.bpAnim?.('bpx_cocoa_rage_preview')){pv=this._ragePv=this.heroFx('bpx_cocoa_rage_preview',p.x,p.y,256,{must:true,depth:4});}   // v7.8.45 C3 art วงพรีวิว
      if(pv){pv.setPosition(p.x,p.y+(p.displayHeight||56)*.38).setScale((70+r*18)/.9/256,(70+r*18)*.55/.9/256).setAlpha(.55+lv*.12+.1*Math.sin(t*5));if(lv>=3)pv.setTint(0xff8a7a);else if(lv>=2)pv.setTint(0xffb08a);else pv.clearTint();}
      else{G.fillStyle(col,.06+lv*.03).fillCircle(p.x,p.y,SR);G.lineStyle(3,col,.5+.35*Math.abs(Math.sin(t*5))).strokeCircle(p.x,p.y,SR);G.lineStyle(1.5,0xffffff,.35).strokeCircle(p.x,p.y,SR*.48);}
      const tg=this._rageTg||(this._rageTg=[]);let ti=0;   // v7.6.9 วงระยะทุบจริง (วงใน = โซนแรงพิเศษ)
      let n=0;this.enemies.children.iterate(e=>{if(n>=40||!e||!e.active||this.dist(e.x,e.y,p.x,p.y)>SR)return;n++;const er=Math.max(12,(e.body?.halfWidth||14)+4);
        if(ti<12){let s=tg[ti];if(s&&!s.active)s=tg[ti]=null;if(!s&&this.bpAnim?.('bpx_cocoa_rage_target'))s=tg[ti]=this.heroFx('bpx_cocoa_rage_target',e.x,e.y,56,{must:true});if(s){ti++;const k=e.isBoss||e.isMini?1.6:1;s.setVisible(true).setPosition(e.x,e.y-er-24*k).setDepth(e.y+40).setScale(56*k/128);return;}}   // v7.8.45 C4 ป้ายกำปั้นเหนือหัว (สูงสุด 12)
        G.lineStyle(2,e.isBoss||e.isMini?0xffe08a:col,.85).strokeCircle(e.x,e.y,er);});
      for(let i=ti;i<tg.length;i++)tg[i]?.active&&tg[i].setVisible(false);}
    {const bw=60,bh=8,bx=p.x-bw/2,by=p.y-66;G.fillStyle(0x1a0d06,.85).fillRoundedRect(bx-2,by-2,bw+4,bh+4,3);const MX=this.titanMaxLv();G.fillStyle(col,1).fillRect(bx,by,bw*(r/MX),bh);
     G.fillStyle(0xffffff,.9);for(let i=1;i<MX;i++)G.fillRect(bx+bw*i/MX-1,by-2,2,bh+4);if(lv>=MX){G.lineStyle(2,0xffe08a,.6+.4*Math.sin(t*12)).strokeRoundedRect(bx-3,by-3,bw+6,bh+6,3);}}
    if(lv>=2&&this.fxOk()&&Math.random()<.35){const a=Math.random()*Math.PI*2,d=rad*(.6+Math.random()*.6);const s=this.camWorld(this.add.circle(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d,2+lv,col).setDepth(8));this.tweens.add({targets:s,y:s.y-30-lv*10,alpha:0,duration:420,onComplete:()=>s.destroy()});}
  }
  ptv(k){return this.player?._pt?.[k]||0;}
  titanRageArtOff(){if(this._ragePv){if(this._ragePv.active)this._ragePv.destroy();this._ragePv=null;}if(this._rageTg){this._rageTg.forEach(s=>s?.active&&s.destroy());this._rageTg=null;}}
  titanMaxLv(){return typeof titanRage4Unlocked==='function'&&titanRage4Unlocked()?4:3;}   // v7.7.6 เจ้าของ: Rage 4 OP ไปสำหรับเริ่มต้น → ปกติ 3 · ปลด 4 จาก Endgame (Cocoa ชนะบอส Delve Depth 15)
  // v7.6.9 เจ้าของ: Colossus Fist ทุบรอบตัว · กว้างขึ้น · วงพรีวิวตอนชาร์จ = ระยะจริง
  // v7.6.10 regen ตาม % Max HP (เลือดเยอะ = ฟื้นเยอะ) + ขอบจอสีเขียวให้รู้ว่ากำลังฮีล
  startHeroRegen(sec,pct,label){ const on=this._cocoaRegenT>0; this._cocoaRegenT=Math.max(on?this._cocoaRegenT:0,sec); this._cocoaRegenPct=Math.max(on?(this._cocoaRegenPct||0):0,pct); this.healAura?.(); if(label&&this.player)this.floatText?.(this.player.x,this.player.y-70,'+'+(Math.round(pct*1000)/10)+'% HP/s','#7dff9a'); }
  // v7.6.11 เจ้าของ: เลิกขอบจอเขียว → ออร่าแบบอัปการ์ดเลเวลสูง (growth_unlock ย้อมเขียว ตามตัว) + เสียงฟื้นฟู revive
  /* v8.1.158 เจ้าของ: ฮีลก่อนเลือกสาย (Bear Grit Slam) เดิมเป็นภาพดอกไม้ (growth_unlock ย้อมเขียว) ดูเยอะ → แบบเกมทั่วไป: วงเขียวที่พื้นเต้นเบา ๆ + เครื่องหมาย ＋ ลอยขึ้นรอบตัว ตลอดเวลาที่ฟื้นเลือด */
  healAuraCode(){ const p=this.player; if(!p||!this.add?.graphics||!this.events)return null; if(this._healG?.active)this._healG.destroy(); const g=this._healG=this.camWorld(this.add.graphics().setDepth((p.depth||p.y)-1)),t0=this.time?.now||0,plus=[];
    const tick=()=>{ if(!g.active||!p.active){ this.events.off('postupdate',tick); if(g.active)g.destroy(); return; } const t=((this.time?.now||0)-t0)/1000,left=this._cocoaRegenT||0; if(left<=0&&t>.4){ this.events.off('postupdate',tick); this.tweens?.add({targets:g,alpha:0,duration:250,onComplete:()=>g.destroy()}); return; }
      const fy=p.y+(p.displayHeight||56)*.38,R=44+3*Math.sin(t*6),k=Math.min(1,t/.2); g.clear().setDepth((p.depth||p.y)-1);
      g.fillStyle(0x5dff8a,.14*k).fillEllipse(p.x,fy,R*2,R*.7); g.lineStyle(3,0x7dff9a,.85*k).strokeEllipse(p.x,fy,R*2,R*.7); g.lineStyle(1.5,0xeaffef,.7*k).strokeEllipse(p.x,fy,R*2-6,R*.7-3);
      if(t<.45){ const q=t/.45; g.fillStyle(0x9dffb6,.18*(1-q)).fillRect(p.x-R*.55,fy-110*q,R*1.1,110*q); }
      if(!plus.length||t-plus[plus.length-1].t>.32)plus.push({t,x:(Math.random()-.5)*R*1.4,s:7+Math.random()*4}); while(plus.length&&t-plus[0].t>1.1)plus.shift();
      for(const q of plus){ const u=(t-q.t)/1.1,x=p.x+q.x,y=fy-14-u*70,a=Math.sin(Math.PI*Math.min(1,u*1.3)),w=q.s*.38; g.fillStyle(0x1f6b38,.6*a).fillRect(x-q.s-1,y-w-1,q.s*2+2,w*2+2).fillRect(x-w-1,y-q.s-1,w*2+2,q.s*2+2); g.fillStyle(0x7dff9a,a).fillRect(x-q.s,y-w,q.s*2,w*2).fillRect(x-w,y-q.s,w*2,q.s*2); } };
    tick(); this.events.on('postupdate',tick); return g; }
  healAura(){ try{ Sfx.playFile?.('sfx_event_revive',.5,1.05); }catch(e){} const p=this.player; if(typeof CODE_VFX!=='undefined'&&CODE_VFX.heal&&(Save.data.settings?.vfx??2)!==0){ this.healAuraCode(); return; } if(!p||!this.textures.exists('growth_unlock')||(Save.data.settings?.vfx??2)===0)return;
    if(this._healAura&&this._healAura.active)this._healAura.destroy(); const fx=this.spawnFxAnim('growth_unlock',p.x,p.y-12,{scale:240/256,depth:p.depth+1,anchor:'center',normal:true}); if(!fx)return; fx.setTint(0x8dffb0); if(fx.anims)fx.anims.timeScale=.6; this._healAura=fx; this.trackArtVfx?.(fx);
    const follow=()=>{ if(!fx.active||!p.active){ this.events.off('postupdate',follow); return; } fx.setPosition(p.x,p.y-12); }; this.events.on('postupdate',follow); }
  // v7.6.12 เจ้าของเลือก A: Colossus Fist ใส่บอส/มินิในวงเพิ่ม % Max HP ตาม Rage 1/2/3/4 = 1/2/3/5% (มินิครึ่งเดียว) — โตตามด่านเอง · ไม่คริ/ไม่คูณ powerMul · Phase Gate ยังมีผล
  /* v8.1.62 เจ้าของ: บอสกระโดดหนีวง → รอยแยกแผ่นดินวิ่งไปหาบอส/มินิที่อยู่นอกวง (ไม่เกิน 3 เท่ารัศมี) ตัวใกล้สุด 1 ตัว · ดาเมจ 80% ของทุบ + %HP ครึ่งหนึ่ง */
  titanSeek(x,y,r,lv,dmg){ let best=null,bd=Infinity; this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active||!(e.isBoss||e.isMini))return; const d=this.dist(e.x,e.y,x,y),hw=e.body?.halfWidth||0; if(d<=r*1.5+hw||d>r*3+hw)return; if(d<bd){bd=d;best=e;} }); if(!best)return null;
    const t=best,tx=t.x,ty=t.y; this.cocoaVisual?.((x+tx)/2,(y+ty)/2,Math.max(40,bd/2),'wave',0xd59b65); this.cocoaLater?.(.25,()=>{ if(!t.active||t._phaseGateLocked||(t._phaseInvuln||0)>0)return; this.damage(t,dmg*.8,t.x,t.y); const pct=[0,.015,.03,.045,.075][Math.min(4,lv|0)]*.5; if(pct){ const was=this._frDmg; this._frDmg=true; try{ this.damage(t,(t.maxhp||t.hp||0)*pct*(t.isMini&&!t.isBoss?.5:1),t.x,t.y-30); }finally{ this._frDmg=was; } } this.bpFx?.('bpx_cocoa_shockwave',t.x,t.y,140); this.screenShake?.(80,.004); Sfx.bp?.('uq_titan_aftershock',.5,.2,1.1); }); return t; }
  /* v8.2.2+ เจ้าของเลือก A: Titan ตีเป้าเดี่ยวได้น้อย → Colossus Fist เป็นหมัดชุด 3 ครั้ง: ทุบหลักเดิม + หมัดตามอีก 2 ครั้ง (0.2 วิห่างกัน) ใส่บอส/มินิก่อน ไม่งั้นตัวเลือดเยอะสุดในวง ×1.5 · หมัดละ 60% ของทุบ (ไม่ซ้ำ %HP) */
  titanFistTarget(x,y,r){ let best=null,bs=-1; this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active||e._phaseGateLocked||(e._phaseInvuln||0)>0)return; const d=this.dist(e.x,e.y,x,y),hw=e.body?.halfWidth||0; if(d>r*1.5+hw)return; const sc=(e.isBoss?3e9:e.isMini?2e9:0)+(e.hp||0); if(sc>bs){bs=sc;best=e;} }); return best; }
  titanFistCombo(x,y,r,lv,dmg){ for(let i=1;i<=2;i++)this.cocoaLater(.2*i,()=>{ const p=this.player; if(!p?.active)return; const t=this.titanFistTarget(p.x,p.y,r); if(!t)return; this.damage(t,dmg*.6,t.x,t.y); this.cocoaVisual(t.x,t.y,Math.max(60,r*.45),'fist',lv>=2?0xff6a1a:0xd59b65); this.bpFx?.('bpx_cocoa_shockwave',t.x,t.y,r*.9); this.screenShake?.(90+lv*30,.004+lv*.001); this.hitStop?.(30); Sfx.bp?.('cocoa_titan_slam',.5,.08,1+.08*i); }); }
  /* v8.2.2+ เจ้าของเลือก C: Ground Pound ทุกครั้งส่งรอยแยกพื้นวิ่งไปหาบอส/มินิที่อยู่ "นอกวงทุบ" แต่ไม่เกิน 200px จากขอบ → ตีบอสที่กระโดดหนีได้ · 60% ของหมัด ×1.4 ใส่บอส */
  titanFaultLine(x,y,rr,power){ let best=null,bd=Infinity; this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active||!(e.isBoss||e.isMini)||e._phaseGateLocked||(e._phaseInvuln||0)>0)return; const d=this.dist(e.x,e.y,x,y),hw=e.body?.halfWidth||0; if(d<=rr+hw||d>rr+200+hw)return; if(d<bd){bd=d;best=e;} }); if(!best)return null;
    const t=best,tx=t.x,ty=t.y; if(this.add?.graphics&&this.fxOk?.()){ const g=this.camWorld(this.add.graphics().setDepth(5)),n=7,pts=[]; for(let i=0;i<=n;i++){ const k=i/n,j=i&&i<n?(Math.random()-.5)*18:0,a=Math.atan2(ty-y,tx-x); pts.push([x+(tx-x)*k-Math.sin(a)*j,y+(ty-y)*k+Math.cos(a)*j]); }
      g.lineStyle(7,0x2a170b,.7); for(let i=0;i<n;i++)g.lineBetween(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1]); g.lineStyle(3,0xffb347,.95); for(let i=0;i<n;i++)g.lineBetween(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1]); this.tweens?.add({targets:g,alpha:0,delay:220,duration:380,onComplete:()=>g.destroy()}); }
    this.cocoaLater(.12,()=>{ if(!t.active||t._phaseGateLocked||(t._phaseInvuln||0)>0)return; this.damage(t,power*.6*1.4,t.x,t.y); this.bpFx?.('bpx_cocoa_crack',t.x,t.y,90,{depth:5}); this.screenShake?.(50,.002); }); return t; }
  titanPctSlam(x,y,r,lv){ const pct=[0,.015,.03,.045,.075][Math.min(4,lv|0)]||0; if(!pct)return; this.enemies.children.iterate(e=>{ if(!e||!e.active||!(e.isBoss||e.isMini)||this.dist(e.x,e.y,x,y)>r*1.5+(e.body?.halfWidth||0))return;   /* v8.1.62 เจ้าของ: สู้บอสกระโดดยาก → %HP +50% (1.5/3/4.5/7.5%) · ระยะถึงบอส ×1.5 */ if(e._phaseGateLocked||(e._phaseInvuln||0)>0)return;
      const was=this._frDmg; this._frDmg=true; try{ this.damage(e,(e.maxhp||e.hp||0)*pct*(e.isMini&&!e.isBoss?.5:1),e.x,e.y-30); }finally{ this._frDmg=was; } }); }
  titanSlamRadius(rage){ const b=this.basicAttack,ul=this.uniqueLevel||1,size=Math.min(1.8,1+(b?.ranks?.size||0)*.12+(b?._pm?.range||0))*(this.player?.donutImpact?1.15:1),r=Math.max(0,rage||0),b0=(150+ul*12)*size;
    if(r<=3)return b0*(1+r*.22); const lo=b0*1.66,hi=Math.max(lo,600*Math.min(1.3,size)); return lo+(hi-lo)*(Math.min(4,r)-3); }   // v7.6.10 Rage 4 = เกือบทั้งจอ
  titanRageSpend(given){const lv=Math.min(this.titanMaxLv(),given||0);this._titanRage=0;
    const sw=this.basicAttack?.lv?.p_secondwind||0,p=this.player;if(lv>=2&&sw&&p)p.hp=Math.min(p.maxhp,p.hp+p.maxhp*.04*lv*sw);return Math.min(this.titanMaxLv(),lv);}
  titanRageImpact(x,y,r,lv,basic){
    const col=lv>=3?0xff2a2a:lv>=2?0xff6a1a:0xffb347;
    const slow=(o,ts)=>{try{if(o&&o.anims)o.anims.timeScale=ts;}catch(e){}return o;},ts=lv>=3?.38:lv>=2?.5:.7;   // v6.83 เล่น VFX ช้าลงให้เห็นความอลังการ
    slow(this.bpFx?.('bpx_cocoa_crack',x,y,r*2.6,{depth:5,force:true}),ts*.8);slow(this.bpFx?.('bpx_cocoa_shockwave',x,y,r*(2.4+lv*.3),{force:true}),ts);if(lv>=3)slow(this.bpFx?.('bpx_cocoa_crush',x,y-r*.3,r*3,{force:true}),ts);
    if(lv>=2)this.titanScreenCrack?.(lv);
    this.hitStop?.(lv>=3?220:50+lv*45);this.screenShake(160+lv*90,.006+lv*.004);
    if(lv>=2)this.screenFlash?.(col,.12+lv*.06,180+lv*60);
    for(let i=0;i<lv+1;i++)this.cocoaLater(i*.09,()=>{const ring=this.camWorld(this.add.circle(x,y,r*.4,col,0).setStrokeStyle(6-i,col,.9).setDepth(8));this.tweens.add({targets:ring,scale:2.4+lv*.5,alpha:0,duration:420+i*80,onComplete:()=>ring.destroy()});});
    if(lv>=1&&this.heroFx?.('bpx_cocoa_crater',x,y,r*1.6/.9,{must:true,depth:4,hold:1.6,fade:500})){}else if(lv>=2){const cr=this.camWorld(this.add.graphics().setDepth(5));cr.fillStyle(0x3a2414,.55).fillEllipse(x,y,r*1.6,r*.9);cr.lineStyle(3,0x1d120a,.8);for(let i=0;i<6+lv*2;i++){const a=Math.random()*Math.PI*2,l=r*(.6+Math.random()*.7);cr.lineBetween(x,y,x+Math.cos(a)*l,y+Math.sin(a)*l*.6);}this.tweens.add({targets:cr,alpha:0,delay:1600,duration:500,onComplete:()=>cr.destroy()});}
    if(lv>=3){this.cocoaVisual(x,y,r*1.5,'fist',0xff4a2a);const t=this.add.text(x,y-r*.6,'TITAN CRUSH!',{fontSize:'30px',fontStyle:'900',color:'#ffd27a',stroke:'#5a1500',strokeThickness:7}).setOrigin(.5).setDepth(9);this.camWorld(t);this.tweens.add({targets:t,y:t.y-50,scale:1.3,alpha:0,duration:900,onComplete:()=>t.destroy()});Sfx.beatFx?.('titan');}
  }
  // v6.84 Screen FX: overlay วาดด้วยโค้ด ยึดติดกล้อง (local 0..vw,0..vh) · draw(g,vw,vh,t01) เรียกทุกเฟรม · คืน object ให้ kill() ได้
  heroScreenEffect(life=.65,alpha=.32){
    if((Save.data.settings?.vfx??2)===0||!this.textures.exists('p1_skill_edges'))return null;
    const path=this.basicAttack?.path,frames={momo:{shotgun:1,sniper:2,ricochet:0},mint:{glacier:3,impaler:4,barrage:5},cocoa:{brawler:6,titan:7,dashboxer:8},taro:9,sesame:10,yuzu:11,berry:12},spec=frames[this.character],frame=typeof spec==='number'?spec:(spec?.[path]??({momo:0,mint:5,cocoa:7}[this.character]));if(frame===undefined)return null;
    this._heroScreen?.kill();life=Math.min(.75,Math.max(.25,life));alpha=Math.min(.34,alpha);const cam=this.cameras.main,t0=this.time.now,fx={dead:false};
    const images=[0,1].map(i=>this.camWorld(this.add.image(0,0,'p1_skill_edges',frame).setOrigin(i,1).setFlipX(i===1).setDepth(94000)));
    const step=()=>{if(fx.dead)return;const v=cam.worldView,k=Math.min(1,(this.time.now-t0)/(life*1000)),size=Math.min(150,v.width*.18,v.height*.24);images.forEach((im,i)=>{if(im.active)im.setPosition(v.x+(i?v.width:0),v.y+v.height*.72).setDisplaySize(size,size).setAlpha(alpha*Math.sin(Math.PI*k));});if(k>=1)fx.kill();};
    fx.kill=()=>{if(fx.dead)return;fx.dead=true;this.events.off('postupdate',step);for(const im of images)if(im.active)im.destroy();if(this._heroScreen===fx)this._heroScreen=null;};this._heroScreen=fx;this.events.on('postupdate',step);step();return fx;
  }
  clearStatusArt(){for(const pack of this._statusArt?.values()||[]){for(const o of pack.items)o.destroy();for(const o of pack.icons||[])o.destroy();pack.loop?.destroy();}this._statusArt?.clear();this.clearHeroStatus62?.();}
  statusList62(e,now,el){   /* v8.0.85 ใบ 62: สถานะบนตัวมอน (ลำดับสำคัญ) — ลูปบนตัว 1 อัน/ตัว (รวม ≤24) + ไอคอน ≤3 เหนือหัว ต่อแถวกับ Tremor/Frost Burn เดิม */
   const L=[],t=this._taro;
    if(!e.isBoss&&!e.isMini&&(e.knock||0)>=.4)L.push('stun');if((e.frozen||0)>0)L.push('frozen');
    if((e._shock>0&&t&&typeof TARO_SHOCK_LIFE!=='undefined'&&t.time-(e._shockAt??-1e9)<=TARO_SHOCK_LIFE)||(e._arcShockT||0)>el)L.push('shock');
    if((e._titanMarkT||0)>el||(this._forgeState&&this._forgeState.mark===e))L.push('mark');if(e._sourT>0)L.push('sour');if(e._burnT>0)L.push('burn');
    if((e._glacierBrittleUntil||0)>now)L.push('brittle');if(e._chill>0&&e._chillAt!=null&&now-e._chillAt<2500&&!(e.frozen>0))L.push('chill');if(e._decoyT>0)L.push('lured');if(e._enraged)L.push('enraged');return L;}
  tickStatusArt(){
    if((Save.data.settings?.vfx??2)===0){this.clearStatusArt();return;}if(!this.enemies?.children)return;
    const map=this._statusArt||(this._statusArt=new Map()),seen=new Set(),now=this.time.now,el=this.elapsed||0,ic=this.textures.exists('st_icons');let count=0,loops=0,pops=0;
    this.enemies.children.iterate(e=>{if(!e?.active||count>=40)return;const frost=e._frostBurnUntil>now?e._frostBurnStacks||0:0,tremor=now-(e._tremT??-1e9)<=3000?e._trem||0:0,st=this.statusList62(e,now,el);if(!frost&&!tremor&&!st.length)return;seen.add(e);count++;
      let pack=map.get(e);if(pack&&pack.icons.some(o=>!o.active)){for(const o of pack.items)o.destroy();pack.loop?.destroy();map.delete(e);pack=null;}if(!pack){const pairs=['ic_status_tremor','ic_status_frostburn'].map(key=>({im:this.textures.exists(key)?this.camWorld(this.add.image(0,0,key).setDisplaySize(18,18).setDepth(93000)):null,tx:this.camWorld(this.add.text(0,0,'',{fontSize:'11px',fontStyle:'bold',color:'#ffffff',stroke:'#201526',strokeThickness:3}).setDepth(93001).setOrigin(0,.5))}));pack={pairs,items:pairs.flatMap(p=>[p.im,p.tx].filter(Boolean)),icons:[],loop:null,loopKey:null,prev:new Set()};map.set(e,pack);}
      // ไอคอน: Tempest มีตัวนับ marker อยู่แล้ว → ไม่ซ้ำไอคอน shock
      const show=ic?st.filter(k=>ST62_ICON[k]!=null&&!(k==='shock'&&e._shockFx?.active)).slice(0,3):[];
      while(pack.icons.length<show.length)pack.icons.push(this.camWorld(this.add.image(0,0,'st_icons',0).setDisplaySize(18,18).setDepth(93000)));
      const row=[...[tremor,frost].map((n,i)=>n?{w:34,i,n}:null).filter(Boolean),...show.map((k,j)=>({w:22,k,j}))],tw=row.reduce((a,r)=>a+r.w,0),y=e.y-Math.min(75,Math.max(28,e.body?.halfHeight||28))-12;let x0=e.x-tw/2;
      pack.pairs.forEach((p,i)=>{const on=row.some(r=>r.i===i);p.im?.setVisible(on);p.tx.setVisible(on);});pack.icons.forEach((o,j)=>o.setVisible(j<show.length));
      for(const r of row){const cx=x0+r.w/2;x0+=r.w;if(r.k){pack.icons[r.j].setFrame(ST62_ICON[r.k]).setPosition(cx,y).setDisplaySize(18,18);continue;}const pair=pack.pairs[r.i];pair.im?.setPosition(cx-6,y).setAlpha(r.i===1?.8+.15*Math.sin(now*.006):.95);pair.tx.setPosition(cx+5,y).setText(String(r.n));}
      // ลูปบนตัว: Tempest ครบ 5 สแตกใช้ aura เดิมแทน st_shock
      let lk=null;if(loops<24)for(const k of st){const key=ST62_LOOP[k];if(!key||(k==='shock'&&e._shockAura?.active))continue;if(this.bpAnim?.(key)){lk=key;break;}}
      if(lk){loops++;if(pack.loopKey!==lk||!pack.loop?.active){pack.loop?.destroy();const sp=this.camWorld(this.add.sprite(e.x,e.y,lk,0));sp.play(lk);pack.loop=sp;pack.loopKey=lk;}
        const big=e.isBoss||e.isMini,sz=Math.max(56,Math.min(160,(e.body?.halfWidth||20)*2.6)),feet=lk==='st_chill';pack.loop.setDisplaySize(sz,sz).setOrigin(.5,feet?.85:.5).setPosition(e.x,feet?e.y+(e.body?.halfHeight||20)*.8:e.y).setDepth((e.depth||0)+(feet?-1:1)).setAlpha(big?.85:1);}
      else if(pack.loop){pack.loop.destroy();pack.loop=null;pack.loopKey=null;}
      // เพิ่งติดสถานะ → วงสีสั้น ๆ (≤6 ต่อเฟรม)
      for(const k of st)if(!pack.prev.has(k)&&pops<6&&ST62_COL[k]!=null&&this.bpAnim?.('st_fx_apply')){pops++;if(pops===1)(typeof Sfx!=='undefined'&&Sfx.orderCue?.('st_'+(k==='frozen'?'freeze':k==='brittle'?'chill':k),.22,.25));this.heroFx?.('st_fx_apply',e.x,e.y,Math.max(48,Math.min(120,(e.body?.halfWidth||20)*2.4)),{tint:ST62_COL[k],depth:(e.depth||0)+2});}
      pack.prev=new Set(st);
    });for(const [e,pack] of map)if(!seen.has(e)){for(const o of pack.items)o.destroy();for(const o of pack.icons)o.destroy();pack.loop?.destroy();map.delete(e);}
    this.tickHeroStatus62?.(el);
  }
  heroStatus62(el){   /* v8.0.85 ใบ 62: สถานะฮีโร่ — ลูปบนตัวสูงสุด 2 อัน (poison/bleed > slow > barrier > guard > haste) + แถวไอคอน HUD ต่อท้ายข้อความ relic */
   const P=this.player,o=[];if(!P)return o;const fs=this._forgeState,bo=this._heroBleed;
    if(this._huntCursed)o.push(['poison',this._huntStk||1]);if(bo&&bo._bleedStk>0&&el-(this._heroBleedAt??-9)<.3)o.push(['bleed',bo._bleedStk]);if((this.moveSlowT||0)>0)o.push(['slow',0]);
    if(fs&&fs.barrierUntil>el&&fs.barrier>0)o.push(['barrier',Math.ceil(fs.barrier)]);if((P.wardGuardT||0)>0)o.push(['guard',0]);if((this.pathHasteT||0)>0||(this.windRushT||0)>0)o.push(['haste',0]);
    if((this._shield||0)>0)o.push(['shell',this._shield]);if((this._cocoaRegenT||0)>0)o.push(['regen',0]);return o;}
  clearHeroStatus62(){const h=this._hst62;if(!h)return;for(const o of [...h.loops,...h.icons,...h.nums])o?.destroy?.();this._hst62=null;}
  tickHeroStatus62(el){const P=this.player;if(!P?.active||this.state!=='play'){if(this._hst62&&!P?.active)this.clearHeroStatus62();return;}
    if(this._hst62&&[...this._hst62.icons,...this._hst62.nums].some(o=>!o.active))this.clearHeroStatus62();   /* scene.restart เก็บฟิลด์เดิม → ของเก่าถูกทำลายแล้ว */
    const h=this._hst62||(this._hst62={loops:[],keys:[],icons:[],nums:[],prev:new Set(),fb:0}),st=this.heroStatus62(el),has=new Set(st.map(s=>s[0]));
    const want=['poison','bleed','slow','barrier','guard','haste'].filter(k=>has.has(k)).slice(0,2).map(k=>'st_p_'+k).filter(k=>this.bpAnim?.(k));
    for(let i=0;i<2;i++){const k=want[i];if(!k){if(h.loops[i]){h.loops[i].destroy();h.loops[i]=null;h.keys[i]=null;}continue;}
      if(h.keys[i]!==k||!h.loops[i]?.active){h.loops[i]?.destroy();const sp=this.camWorld(this.add.sprite(P.x,P.y,k,0));sp.play(k);h.loops[i]=sp;h.keys[i]=k;}
      const sz=Math.max(84,(P.body?.halfWidth||22)*4);h.loops[i].setDisplaySize(sz,sz).setOrigin(.5,.85).setPosition(P.x,P.y+(P.body?.halfHeight||22)).setDepth((P.depth||0)+1+i);}
    // หายจากพิษ/เลือด/ช้า → cleanse · Barrier แตก → barrier_break
    if(['poison','bleed','slow'].some(k=>h.prev.has(k)&&!has.has(k))){this.heroFx?.('st_fx_cleanse',P.x,P.y,110,{must:true,depth:(P.depth||0)+3});(typeof Sfx!=='undefined'&&Sfx.orderCue?.('st_cleanse',.35,.5));}
    const fb=this._forgeState?.barrier||0;if(h.fb>0&&!(fb>0)&&h.prev.has('barrier')){this.heroFx?.('st_fx_barrier_break',P.x,P.y,120,{must:true,depth:(P.depth||0)+3});(typeof Sfx!=='undefined'&&Sfx.orderCue?.('st_barrier_break',.4,.5));}h.fb=fb;h.prev=has;
    // แถวไอคอน HUD (แทน '🫧×n' / 'Barrier N' ใน statTxt)
    const T=this.statTxt,ic=this.textures.exists('st_icons')&&T;this._hudStatusIcons=!!ic;if(!ic)return;const vis=T.visible!==false&&(this.hudList?.[0]?.visible!==false);
    while(h.icons.length<st.length){const im=this.camUI?this.camUI(this.add.image(0,0,'st_icons',0)):this.add.image(0,0,'st_icons',0);im.setScrollFactor?.(1);im.setDepth(54);const tx=this.add.text(0,0,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#fff1df',stroke:'#141018',strokeThickness:3}).setOrigin(0,.5).setDepth(55);this.camUI?.(tx);tx.setScrollFactor?.(1);h.icons.push(im);h.nums.push(tx);}
    let x=T.x+(T.text?T.width+8:0),y=T.y+(T.height||14)/2;
    h.icons.forEach((im,i)=>{const s=st[i],n=h.nums[i];im.setVisible(!!s&&vis);n.setVisible(!!s&&vis&&!!(s&&s[1]));if(!s)return;if(s[1])n.setText(this.hudCompactNumber?.(s[1])||String(s[1]));const iw=22+(s[1]?n.width+2:0);if(x+iw>(this.W||Infinity)-16){x=20;y+=22;}im.setFrame(ST62_ICON['p_'+s[0]]).setDisplaySize(18,18).setPosition(x+9,y);if(s[1])n.setPosition(x+19,y);x+=iw;});if(st.length)this.traitTxt?.setY(Math.max((this._hudBottom||0)+21,y+13));}
  screenFx(life,draw,{fadeIn=0,hold=null}={}){ try{ const cam=this.cameras.main,g=this.camWorld(this.add.graphics().setDepth(95000)),t0=this.time.now,fx={g,dead:false};
    const step=()=>{ if(fx.dead||!g.active)return; const v=cam.worldView,el=(this.time.now-t0)/1000,k=life>0?Math.min(1,el/life):0; g.setPosition(v.x,v.y); g.clear(); try{draw(g,v.width,v.height,k,el);}catch(e){} if(life>0&&el>=life)fx.kill(); };
    fx.kill=()=>{ if(fx.dead)return; fx.dead=true; this.events.off('postupdate',step); if(g.active)g.destroy(); };
    this.events.on('postupdate',step); step(); return fx; }catch(e){ return {kill(){}}; } }
  scrEdge(g,w,h,col,a,th){ for(let i=0;i<6;i++){ const al=a*(1-i/6),d=i*th/6; g.lineStyle(th/6+1,col,al).strokeRect(d,d,w-2*d,h-2*d); } }
  // 🍓 Shotgun: ขอบจอสะบัด + ควันดินปืน
  fxShotgunScreen(ang){ const puffs=[...Array(7)].map(()=>({x:.5+Math.cos(ang)*(.1+Math.random()*.3)+(Math.random()-.5)*.15,y:.5+Math.sin(ang)*(.1+Math.random()*.3)+(Math.random()-.5)*.15,r:30+Math.random()*40}));
    this.screenFx(.7,(g,w,h,k)=>{ this.scrEdge(g,w,h,0xff76a8,.55*(1-k),36); for(const p of puffs){ g.fillStyle(0xd8d0d8,.28*(1-k)).fillCircle(p.x*w,p.y*h,p.r*(1+k*.8)); } }); }
  // 🍓 Sniper: กล้องเล็งระหว่างชาร์จ
  fxScopeStart(){ this.fxScopeStop(); this._scopeFx=this.screenFx(0,(g,w,h,k,el)=>{ const cx=w/2,cy=h/2,R=Math.min(w,h)*(.46-.06*Math.min(1,el/1.2));
      g.fillStyle(0x000000,.55); g.fillRect(0,0,w,cy-R); g.fillRect(0,cy+R,w,h-cy-R); g.fillRect(0,cy-R,cx-R,2*R); g.fillRect(cx+R,cy-R,w-cx-R,2*R);
      for(let i=0;i<10;i++){ g.lineStyle(R*.07,0x000000,.5*(1-i/10)).strokeCircle(cx,cy,R-i*R*.035); }
      g.lineStyle(1.5,0xff9ec4,.7); g.lineBetween(cx-R*.9,cy,cx-14,cy); g.lineBetween(cx+14,cy,cx+R*.9,cy); g.lineBetween(cx,cy-R*.9,cx,cy-14); g.lineBetween(cx,cy+14,cx,cy+R*.9); g.strokeCircle(cx,cy,6); }); }
  fxScopeStop(fire){ if(this._scopeFx){ this._scopeFx.kill(); this._scopeFx=null; } if(fire)this.screenFx(.22,(g,w,h,k)=>{ g.fillStyle(0xffffff,.65*(1-k)).fillRect(0,0,w,h); }); }
  // 🍓 Rebound: รอยกระแทกชมพูที่ขอบจอ
  fxReboundScreen(){ const hits=[...Array(5)].map((_,i)=>{ const s=i%4; return {s,u:.15+Math.random()*.7,d:i*.12}; });
    this.screenFx(1.1,(g,w,h,k,el)=>{ for(const p of hits){ const t=(el-p.d)/.6; if(t<0||t>1)continue; const x=p.s===0?0:p.s===1?w:p.u*w,y=p.s===2?0:p.s===3?h:p.u*h;
      g.fillStyle(0xff5c8a,.5*(1-t)).fillCircle(x,y,20+t*70); g.lineStyle(3,0xffd1e0,.8*(1-t)).strokeCircle(x,y,10+t*90);
      for(let j=0;j<6;j++){ const a=j/6*Math.PI*2; g.lineBetween(x+Math.cos(a)*(14+t*40),y+Math.sin(a)*(14+t*40),x+Math.cos(a)*(24+t*70),y+Math.sin(a)*(24+t*70)); } } }); }
  // 🍫 Fire: ขอบจอแดงร้อน + ขี้เถ้าลอยขึ้น
  fxHeatScreen(){ const ash=[...Array(24)].map(()=>({x:Math.random(),y:.8+Math.random()*.3,v:.25+Math.random()*.35,r:1.5+Math.random()*2.5,c:Math.random()<.4?0xffb347:0x5a4040}));
    this.screenFx(1.2,(g,w,h,k,el)=>{ this.scrEdge(g,w,h,0xff3a1a,.5*(1-k*k),60); for(const a of ash){ g.fillStyle(a.c,.8*(1-k)).fillCircle((a.x+Math.sin(el*3+a.y*9)*.02)*w,(a.y-a.v*el)*h,a.r); } }); }
  // 🍫 Dash Phantom: โลกหม่นม่วง เวลาหยุด
  fxPhantomScreen(sec){ this.screenFx(sec,(g,w,h,k,el)=>{ const a=k<.1?k/.1:k>.85?(1-k)/.15:1; g.fillStyle(0x1a0f2a,.42*a).fillRect(0,0,w,h); this.scrEdge(g,w,h,0xc9a3ff,.45*a,40);
      for(let i=0;i<5;i++){ const y=((el*.6+i/5)%1)*h; g.lineStyle(1,0xc9a3ff,.18*a).lineBetween(0,y,w,y); } }); }
  // 🌿 Glacier Bloom: น้ำแข็งเกาะจอจากมุม แล้วแตกร่วง
  fxFreezeScreen(){ const cs=[[0,0],[1,0],[0,1],[1,1]],spikes=cs.map(([cx,cy])=>[...Array(9)].map(()=>({a:Math.random()*Math.PI/2,l:.25+Math.random()*.35})));
    const shards=[...Array(26)].map(()=>({x:Math.random(),y:Math.random()*.5,v:.6+Math.random(),r:4+Math.random()*7,rot:Math.random()*6}));
    this.screenFx(2.2,(g,w,h,k,el)=>{ const grow=Math.min(1,el/.35),hold=el<1.5,fade=hold?1:Math.max(0,1-(el-1.5)/.7);
      if(hold){ g.fillStyle(0xbfeaff,.16*grow).fillRect(0,0,w,h);
        cs.forEach(([cx,cy],i)=>{ const ox=cx*w,oy=cy*h,sx=cx?-1:1,sy=cy?-1:1; g.fillStyle(0xe8f8ff,.55*grow);
          g.fillTriangle(ox,oy,ox+sx*w*.32*grow,oy,ox,oy+sy*h*.28*grow);
          for(const sp of spikes[i]){ const L=Math.min(w,h)*sp.l*grow,ex=ox+sx*Math.cos(sp.a)*L,ey=oy+sy*Math.sin(sp.a)*L; g.lineStyle(2.5,0xffffff,.8*grow).lineBetween(ox,oy,ex,ey); g.lineStyle(1,0x9fe8ff,.7*grow).lineBetween(ex,ey,ex+sx*12,ey-sy*8); } });
        this.scrEdge(g,w,h,0x9fe8ff,.6*grow,50); }
      else for(const s of shards){ const t=el-1.5; g.fillStyle(0xe8f8ff,.85*fade); const x=s.x*w,y=(s.y+s.v*t*t*1.6)*h; g.fillTriangle(x,y-s.r,x+s.r*.8,y+s.r,x-s.r*.8,y+s.r*.6); } }); }
  // 🌿 Frost Lance: รอยไอเย็นพาดจอตามทิศหอก
  fxLanceScreen(ang){ this.screenFx(.6,(g,w,h,k)=>{ const cx=w/2,cy=h/2,L=Math.hypot(w,h),c=Math.cos(ang),sn=Math.sin(ang); this.scrEdge(g,w,h,0x9fe8ff,.45*(1-k),30);
      g.lineStyle(26*(1-k)+2,0xbfeaff,.35*(1-k)).lineBetween(cx-c*L*.1,cy-sn*L*.1,cx+c*L*k*1.2,cy+sn*L*k*1.2); g.lineStyle(3,0xffffff,.8*(1-k)).lineBetween(cx,cy,cx+c*L*k*1.2,cy+sn*L*k*1.2); }); }
  // 🌿 Mint Gale: ลม+ใบมินต์พัดผ่านจอ ซ้าย→ขวา
  fxGaleScreen(){ const ls=[...Array(16)].map(()=>({y:Math.random(),d:Math.random()*.4,len:.15+Math.random()*.25})),lv=[...Array(14)].map(()=>({y:Math.random(),d:Math.random()*.5,r:4+Math.random()*4}));
    this.screenFx(1.3,(g,w,h,k,el)=>{ for(const l of ls){ const t=(el-l.d)/.8; if(t<0||t>1)continue; const x=(-.3+t*1.6)*w; g.lineStyle(2,0xd6fff0,.5*Math.sin(t*Math.PI)).lineBetween(x,l.y*h,x-l.len*w,l.y*h+6); }
      for(const f of lv){ const t=(el-f.d)/.9; if(t<0||t>1)continue; g.fillStyle(0x6fe0a8,.85*Math.sin(t*Math.PI)).fillEllipse((-.1+t*1.2)*w,f.y*h+Math.sin(t*12)*14,f.r*2.4,f.r); } }); }
  // v6.86 เส้นเชื่อม Ricochet: รูปนิ่งเฟรมเดียว จางหายใน .25 วิ แล้วทำลายเสมอ (เดิมเป็น anim loop ไม่ถูกลบ → ค้างจอ) · จำกัด 6 เส้นพร้อมกัน
  ricochetLink(x,y,tx,ty){ try{ if(!this.textures.exists('bpx_momo_link'))return; this._rlN=this._rlN||0; if(this._rlN>=6)return; const d=Math.hypot(tx-x,ty-y); if(d<12)return;
    const im=this.trackArtVfx(this.camWorld(this.add.sprite(x,y,this.battleOutlineKey?.('bpx_momo_link')||'bpx_momo_link',0).setOrigin(.1,.5).setRotation(Math.atan2(ty-y,tx-x)).setScale(d/205,.35).setDepth(90400).setAlpha(.9)));this.battleOutlineTrack?.(im,'bpx_momo_link',this.battleOutlineKey?.('bpx_momo_link')||'bpx_momo_link',null,true); this._rlN++;
    let done=false; const kill=()=>{ if(done)return; done=true; this._rlN=Math.max(0,this._rlN-1); if(im&&im.active)im.destroy(); };
    this.tweens.add({targets:im,alpha:0,duration:250,ease:'Quad.in',onComplete:kill}); this.time.delayedCall(600,kill); }catch(e){} }
  // v6.88 แจ้งเตือน APK เก่า: เทียบ versionName ของแอป (App.getInfo) กับ GitHub Release ล่าสุด · เฉพาะในแอป · วันละครั้ง
  async checkApkUpdate(){ try{
    if(!Cloud.native?.()||this._apkChecked)return; this._apkChecked=true;
    const App=window.Capacitor?.Plugins?.App; const info=App?await App.getInfo().catch(()=>null):null; const cur=(info&&info.version)||'0.0.0';
    if(/\.store$/.test(info?.id||'')){ await this.checkStoreApkUpdate(); return; }   /* v8.3.9 Store-like test APK (bundled, no live update) → compare with the live web version */
    const n=v=>String(v).split('.').map(x=>parseInt(x,10)||0), a=n(cur), b=n(MIN_APK_VERSION); let older=false; for(let k=0;k<3;k++){ if((a[k]||0)!==(b[k]||0)){ older=(a[k]||0)<(b[k]||0); break; } }
    let skip=null; try{skip=localStorage.getItem('mochi_apk_skip');}catch(e){} if(!older||skip===MIN_APK_VERSION+'|'+new Date().toDateString())return;
    this.showApkUpdate(cur,MIN_APK_VERSION,APK_DOWNLOAD_URL); }catch(e){} }
  /* v8.3.9 เจ้าของ: APK แบบ Play Store (appId .store) ไม่มี live update → ถาม version.json บนเว็บ ถ้าใหม่กว่า GAME_VERSION ขึ้นหน้าดาวน์โหลด (เล่นต่อได้ · Later = ไม่ถามซ้ำวันนี้) */
  async checkStoreApkUpdate(){ try{
    const r=await fetch(STORE_VERSION_URL+'?t='+Date.now(),{cache:'no-store'}); const j=r.ok?await r.json():null; const latest=j&&j.version; if(!latest)return;
    if(!verNewer(latest,GAME_VERSION))return;
    let skip=null; try{skip=localStorage.getItem('mochi_apk_skip');}catch(e){} if(skip===latest+'|'+new Date().toDateString())return;
    const show=()=>{ if(this.state==='menu')this.showApkUpdate(GAME_VERSION,latest,STORE_APK_URL); else this.time.delayedCall(4000,show); }; show(); }catch(e){} }
  showApkUpdate(cur,latest,url){ if(this.state!=='menu')return; const w=this.W,h=this.H,ov=this.add.container(0,0).setDepth(9000);
    const sh=this.add.rectangle(0,0,w,h,0x0a0612,0.82).setOrigin(0),bw=Math.min(w-32,400),bh=210,bx=(w-bw)/2,by=(h-bh)/2,g=this.add.graphics();
    g.fillStyle(0x2a2038,1).fillRoundedRect(bx,by,bw,bh,18); g.lineStyle(2.5,0xffd166,1).strokeRoundedRect(bx,by,bw,bh,18);
    const t=this.add.text(w/2,by+26,'📲 New app version',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffe08a'}).setOrigin(0.5);
    const d=this.add.text(w/2,by+62,'Your app is v'+cur+'. Version v'+latest+' is ready. Install it for the best loading speed and fixes. Your save is kept.',{fontFamily:'sans-serif',fontSize:'12px',color:'#e6dcf0',align:'center',wordWrap:{width:bw-36},lineSpacing:3}).setOrigin(0.5,0);
    ov.add([sh,g,t,d]); this.menu.add(ov);
    const prev=this.tapZones; this.tapZones=[]; const close=()=>{ ov.destroy(); this.tapZones=prev; };
    const btn=(y,label,col,fn)=>{ const bg=this.add.graphics(); bg.fillStyle(col,1).fillRoundedRect(w/2-bw/2+24,y-20,bw-48,40,14); const tx=this.add.text(w/2,y,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff'}).setOrigin(0.5); ov.add([bg,tx]); this._zone(w/2-bw/2+24,y-20,bw-48,40,fn); };
    btn(by+bh-72,'⬇ Download update',0x4fae6a,()=>{ try{ const B=window.Capacitor?.Plugins?.Browser; if(B)B.open({url}); else window.open(url,'_blank'); }catch(e){ try{window.open(url,'_blank');}catch(_){} } close(); });
    btn(by+bh-26,'Later',0x5a4b75,()=>{ try{localStorage.setItem('mochi_apk_skip',latest+'|'+new Date().toDateString());}catch(e){} close(); }); Sfx.select&&Sfx.select(); }
  // v6.93 พื้นด่านเดิมเป็น TileSprite 4000×4000 (canvas 64MB) → ย่อเหลือ ~จอ + ลายพื้น 2 รอบ แล้วขยับตามกล้องทีละ "1 รอบลาย" (ลายพื้นยึดโลก ไม่เลื่อน)
  syncBgTile(){ const t=this.bgTile,fk=t&&t.displayTexture&&t.displayTexture.key,fr=t&&(t.displayFrame||t.frame); if(!t||!t.active||!fr||!t.displayTexture)return;
    if(!fk||fk.startsWith('__')||!this.textures.exists(fk)){ if(t.visible)t.setVisible(false); for(const im of this._bgImgs||[])if(im&&im.scene&&im.visible)im.setVisible(false); return; }   /* v8.1.119 เจ้าของ: lobby ตอนแรกเห็นพื้นตารางเขียว = ภาพพื้นยังไม่มา (displayTexture '__MISSING' = กรอบเขียว Phaser) → ไม่วาดพื้นจนกว่าภาพจริงมา */ const cam=this.cameras.main,v=cam.worldView; if(!v||!v.width)return;
    // v7.4 GPU memory: the TileSprite stays 2×2 + hidden (its own canvas was WORLD-size = 43–64MB on the GPU); the floor is drawn by a small pool of plain Images sharing the source texture (0 extra GPU memory)
    if(t.width>4||t.height>4)t.setSize(2,2); if(t.visible)t.setVisible(false);
    const P=Math.max(32,fr.width*Math.abs(t.tileScaleX||1)),Q=Math.max(32,fr.height*Math.abs(t.tileScaleY||1));
    // The camera stays centred for aiming; floor art stops at the actual walkable world.
    const half=WORLD/2,left=Math.max(-half,v.x),top=Math.max(-half,v.y),right=Math.min(half,v.right),bottom=Math.min(half,v.bottom);
    const x0=Math.floor(left/P)*P,y0=Math.floor(top/Q)*Q,nx=Math.max(0,Math.ceil((right-x0)/P)),ny=Math.max(0,Math.ceil((bottom-y0)/Q)),need=right>left&&bottom>top?nx*ny:0,pool=this._bgImgs||(this._bgImgs=[]);
    for(let k=pool.length-1;k>=0;k--)if(!pool[k]||!pool[k].scene)pool.splice(k,1);
    while(pool.length<need&&pool.length<64)pool.push(this.camWorld(this.add.image(0,0,'__DEFAULT').setOrigin(0,0)));
    const tinted=t.isTinted,tint=t.tintTopLeft,key=fk;
    pool.forEach((im,k)=>{ if(k>=need){ if(im.visible)im.setVisible(false); return; } if(im.texture.key!==key||im.frame.name!==fr.name)im.setTexture(key,fr.name);
      const x=x0+(k%nx)*P,y=y0+Math.floor(k/nx)*Q,w=P+1,h=Q+1,cx=Math.max(0,-half-x),cy=Math.max(0,-half-y),cw=Math.min(w,half-x)-cx,ch=Math.min(h,half-y)-cy;
      im.setPosition(x,y).setDisplaySize(w,h).setCrop(cx/w*fr.width,cy/h*fr.height,cw/w*fr.width,ch/h*fr.height).setDepth(t.depth).setAlpha(t.alpha).setVisible(cw>0&&ch>0);if(tinted)im.setTint(tint);else if(im.isTinted)im.clearTint(); }); }
  // v6.83 หน้าจอแตก: เส้นร้าววาดด้วยโค้ดทับทั้งจอ (กล้องหลัก) ตอนปล่อย Titan Rage lv2+
  titanScreenCrack(lv){ try{ const cam=this.cameras.main,v=cam.worldView,cx=v.centerX+(Math.random()-.5)*v.width*.2,cy=v.centerY+(Math.random()-.5)*v.height*.2,R=Math.hypot(v.width,v.height)*.6,g=this.camWorld(this.add.graphics().setDepth(95000));
    const n=lv>=3?14:9; g.fillStyle(0xffffff,lv>=3?.22:.14).fillCircle(cx,cy,26+lv*8);
    for(let i=0;i<n;i++){ let a=i/n*Math.PI*2+(Math.random()-.5)*.4,px=cx,py=cy; const seg=5+Math.floor(Math.random()*3);
      for(let k=0;k<seg;k++){ const l=R/seg*(.7+Math.random()*.6); a+=(Math.random()-.5)*.5; const nx=px+Math.cos(a)*l,ny=py+Math.sin(a)*l;
        g.lineStyle(Math.max(1.2,(4.5-k*.6)*(lv>=3?1.2:1)),0xffffff,.85).lineBetween(px,py,nx,ny); g.lineStyle(1,0x2a1a10,.6).lineBetween(px+1.5,py+1.5,nx+1.5,ny+1.5);
        if(k>0&&Math.random()<.35){ const b=a+(Math.random()<.5?1:-1)*(.6+Math.random()*.5),bl=l*.6; g.lineStyle(1.5,0xffffff,.7).lineBetween(px,py,px+Math.cos(b)*bl,py+Math.sin(b)*bl); }
        px=nx; py=ny; } }
    for(let i=0;i<3;i++){ g.lineStyle(1.5,0xffffff,.45).strokeCircle(cx,cy,60+i*55+Math.random()*20); }
    this.tweens.add({targets:g,alpha:0,delay:lv>=3?900:550,duration:700,onComplete:()=>g.destroy()}); }catch(e){} }
  // v6.59.5 Brawler = Fire Fist: ปล่อยหมัดไฟเป็น projectile · หมัดที่ 5 ใหญ่ ทะลุ ระเบิด
  cocoaFireFist(ang,power,fin,reach,basic){
    const p=this.player;if(!this.getBullet||!p)return;const L=basic?.lv||{},mut=basic?.mutation;let n=fin&&mut==='rush'?3:1;
    if(!fin&&L.p_twin){this._ffN=(this._ffN||0)+1;if(this._ffN%(L.p_twin>=2?2:3)===0)n=2;}if(!fin&&n<2&&Math.random()<this.ptv('ffTwin'))n=2;const rng=1+this.ptv('ffRange');
    for(let i=0;i<n;i++){const a=ang+(i-(n-1)/2)*.22,b=this.getBullet(p.x+Math.cos(a)*24,p.y+Math.sin(a)*24,fin?0xff5a1f:0xff9a3c,fin?1.9:1.25);if(!b)continue;
      b.dmg=power*(n>1&&fin?.6:1);b.life=(fin?.9:.7)*rng;b.pierce=!!fin;b.explode=fin?Math.round(reach*.9*(1+(basic?._pm?.wave||1)*.12)*(1+.25*(L.p_shock||0)+this.ptv('ffBlast'))):0;b.knockback=fin?260:90;b.faceVel=true;
      if(fin&&mut==='breaker'){b.dmg*=1.25;b.explode=Math.round(b.explode*1.25);}   /* v7.8.28 Earthbreaker บน Fire Fist: ลูกไฟ +25% และระเบิดกว้างขึ้น */
      if(fin&&mut==='napalm'){b.firePool=Math.round(b.explode*.8);b.firePoolT=2;}else if(!fin&&(L.p_ember||this.ptv('ffBurn'))){b.firePool=40;b.firePoolT=1.2;}
      b._fist=!fin;
      if(!fin&&(this.elapsed||0)<(this._uqHotT||0)){b.explode=Math.max(b.explode||0,60);}   // v7.9.22 Heat Up
      if(!fin&&L.p_footwork){this._ffHot=(this._ffHot||0)+1;if(this._ffHot%[8,6,4][Math.min(3,L.p_footwork)-1]===0){b.explode=Math.max(b.explode||0,60);b.dmg*=1.3;}}   // v7.9.17 Hot Hands
      if(!fin&&mut==='ricochet')b.bounce=2;
      if(this.textures?.exists?.('proj_rocket')){b.setTexture('proj_rocket').setTint(fin?0xff5a1f:0xffa040).setScale(fin?.95:.6);}
      this.attachProjectileAnim?.(b,fin?'bpx_cocoa_fireball':'bpx_cocoa_fist',fin?120:76);if(fin)b._bpBoom='bpx_cocoa_explode';
      if(b.body&&this.physics)this.physics.velocityFromRotation(a,fin?620:720,b.body.velocity);}
    Sfx.bp?.(fin?'cocoa_fire_finisher':'cocoa_fire_fist',fin?.6:.42,.06);
    if(fin)this.screenShake?.(90,.004);
    const nMet=fin?(basic?.evolved?3:0)+(this.ptv('ffMeteor')?2:0):0;if(nMet){const d=Math.min(520,reach*3);for(let i=0;i<nMet;i++)this.cocoaLater(.35+i*.15,()=>{if(!p.active)return;const x=p.x+Math.cos(ang)*d*(.5+(i%3)*.25)+(Math.random()-.5)*60,y=p.y+Math.sin(ang)*d*(.5+(i%3)*.25)+(Math.random()-.5)*60;this.cocoaHit(x,y,reach*.7,power*.5,{push:120});this.bpFx?.('bpx_cocoa_meteor',x,y,reach*2);this.cocoaVisual(x,y,reach*.7,'fist',0xff5a1f);this.screenShake?.(60,.003);Sfx.bp?.('cocoa_meteor_impact',.5,.08);});}
  }
  cocoaEvoDash(){const b=this.basicAttack,p=this.player;if(b?.path!=='dashboxer'||!b.evolved||!p?.active||!this.getBullet)return;
    const lvl=this.skills?.meteor||1,power=(12+lvl*3.5)*(p.dmgMul||1)*1.1;
    for(let i=0;i<2;i++){const t=this.nearestEnemy(520);const a=t?Math.atan2(t.y-p.y,t.x-p.x)+(i?.4:-.4):i*Math.PI;const s=this.getBullet(p.x,p.y,0xc9a3ff,1.2);if(!s)continue;
      s.dmg=power;s.life=1.4;s.homing=480;s.lockedTarget=t||null;s.faceVel=true;s.knockback=120;if(this.textures?.exists?.('proj_rocket'))s.setTexture('proj_rocket').setTint(0xc9a3ff).setScale(.6);this.attachProjectileAnim?.(s,'bpx_cocoa_shadowfist',100);if(s.body&&this.physics)this.physics.velocityFromRotation(a,600,s.body.velocity);}Sfx.bp?.('cocoa_shadow_fist',.45,.12);}
  // v6.59.7 แอ่งไฟ/ลาวาของ Chocolate (สูงสุด 12)
  cocoaPool(x,y,r,dps,t,col=0xff6a1a){const pools=this._cocoaPools||(this._cocoaPools=[]);if(pools.length>=12){const o=pools.shift();o.g?.destroy?.();}
    /* v8.2.42 เจ้าของ: บ่อลาวา Titan วาดด้วยโค้ด (เดิมภาพ bpx_cocoa_lava) · ขอบเปลือกไหม้เป็นคลื่น + ลาวาส้ม + ใจกลางเหลือง + ฟองผุด · ดาเมจ/ขนาด/เวลาเท่าเดิม */
    const lava=col===0xff3a10;let g=lava?null:(this.bpLoop?.('bpx_cocoa_firepool',x,y,r*2.5,5)||null);if(!g&&this.add?.graphics){g=this.camWorld(this.add.graphics().setDepth(5));if(!lava){g.fillStyle(col,.28).fillCircle(x,y,r);g.lineStyle(2,col,.6).strokeCircle(x,y,r);}}
    const q={x,y,r,dps,t,tick:0,g,lava,seed:Math.random()*9,age:0};pools.push(q);if(lava)this.lavaDraw?.(q);}
  lavaDraw(q){const g=q.g;if(!g||!g.clear)return;const T=q.age||0,s=q.seed,r=q.r,N=16,ring=(k,ph)=>{const pts=[];for(let i=0;i<N;i++){const a=i/N*Math.PI*2,w=1+.07*Math.sin(s+i*1.9+T*1.6*ph)+.04*Math.sin(s*2+i*3.1-T*2.2);pts.push({x:q.x+Math.cos(a)*r*k*w,y:q.y+Math.sin(a)*r*k*w*.82});}return pts;};
    const pop=Math.min(1,T/.18),k=.6+.4*pop;g.clear();
    g.fillStyle(0x2a0d06,.5).fillPoints(ring(1.06*k,1),true);
    g.fillStyle(0xd83a0c,.62).fillPoints(ring(.94*k,1.3),true);
    g.fillStyle(0xff7a1a,.62).fillPoints(ring(.66*k,-1.1),true);
    g.fillStyle(0xffc23d,.55).fillPoints(ring(.34*k,.8),true);
    g.lineStyle(2,0x5a1c0a,.55).strokePoints(ring(1.06*k,1),true);
    for(let j=0;j<4;j++){const ph=(T*.9+j*.27+s)%1,a=s*3+j*1.7,d=r*k*(.2+.45*((j*.37+s)%1)),bx=q.x+Math.cos(a)*d,by=q.y+Math.sin(a)*d*.82,br=r*.09*Math.sin(ph*Math.PI);if(br>.5)g.fillStyle(0xffe27a,.7*(1-ph)).fillCircle(bx,by-ph*6,br);}}
  tickCocoaPools(dt){const pools=this._cocoaPools;if(!pools?.length)return;for(let i=pools.length-1;i>=0;i--){const q=pools[i];q.t-=dt;q.tick-=dt;if(q.lava){q.age=(q.age||0)+dt;this.lavaDraw(q);}
    if(q.tick<=0){q.tick=.3;this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,q.x,q.y)<q.r)this.damage(e,q.dps*.3,e.x,e.y);});}
    if(q.g&&q.t<.4)q.g.setAlpha(Math.max(0,q.t/.4));if(q.t<=0){q.g?.destroy?.();pools.splice(i,1);}}}
  cocoaOnDash(){if(this.basicAttack?.path==='dashboxer')this._phantomDashN=Math.min(5,(this._phantomDashN||0)+1);const cc=this._cc;if(cc){cc.gen=(cc.gen||0)+1;cc.busy=false;if(this.basicAttack?.path==='dashboxer'){cc.t=0;this._cocoaNextPunch=true;}else cc.step=0;}else if(this.basicAttack?.path==='dashboxer')this._cocoaNextPunch=true;this.skillCd.meteor=Math.max(this.skillCd.meteor||0,.22);}
  cocoaPriorityTarget(range){let best=null,rank=-1,hp=-1,near=Infinity;const p=this.player;this.enemies.children.iterate(e=>{if(!e||!e.active)return;const d=this.dist(e.x,e.y,p.x,p.y);if(d>range)return;const k=e.isBoss?3:e.isMini?2:e.isElite?1:0,value=e.maxhp||e.hp||0;if(k>rank||k===rank&&(value>hp||value===hp&&d<near)){best=e;rank=k;hp=value;near=d;}});return best;}
  castCocoaUnique(dm,ul){ this.heroScreenEffect?.(1.2);
    const b=this.basicAttack,path=b?.path,p=this.player,unit=(22+ul*6)*dm*this.uniquePower()*(1+(b?.ranks.power||0)*.12),size=Math.min(1.8,1+(b?.ranks.size||0)*.12+(b?._pm?.range||0))*(p.donutImpact?1.15:1);
    this._cocoaUsedAt=this.elapsed||0;this._cocoaMinGap=this.uniqueCd*.5;
    if(path==='brawler'){
      // v6.59.6 Rocket Gauntlet: ถุงมือไฟติดตามเป้า · โดนบอส/มินิเกาะติดแล้วระเบิดซ้ำ
      const n=ul>=4?6:ul>=2?5:4,r=(70+ul*8)*size*(ul>=3?1.2:1),stick=ul>=4?4:3,used=new Set(),pick=()=>{let best=null,bv=-1;this.enemies.children.iterate(e=>{if(!e||!e.active||used.has(e)||this.dist(e.x,e.y,p.x,p.y)>620)return;const v=(e.isBoss?1e9:e.isMini?1e8:0)+(e.maxhp||e.hp||0);if(v>bv){bv=v;best=e;}});if(best)used.add(best);return best;};
      this._cocoaUniqueT=1.2;this.bpPose?.(this.textures?.exists?.('char_cocoa_rocket_motion823')?'char_cocoa_rocket_motion823':'char_cocoa_rocket',.5);
      for(let i=0;i<n;i++){const t=pick()||this.cocoaPriorityTarget(620),a=t?Math.atan2(t.y-p.y,t.x-p.x)+(i-(n-1)/2)*.35:(this.moveDir?.angle?.()||0)+(i-(n-1)/2)*.5;
        this.cocoaLater(i*.08,()=>{const b=this.getBullet?.(p.x,p.y,0xff7a2a,1.4);if(!b)return;b.dmg=unit*1.1;b.life=6;b.homing=950;b.homeSpeed=640;b.homeRange=1400;b.lockedTarget=t||null;b.explode=r;   /* v7.8.58 เจ้าของ: จรวดเร็วขึ้น (240→640) + ไม่หายจนกว่าจะโดน (อายุ 6s กันค้าง, หาเป้าใหม่ไกล 1400) */b.faceVel=true;b.knockback=200;
          if(this.textures?.exists?.('proj_rocket'))b.setTexture('proj_rocket').setTint(0xff6a1a).setScale(.85);this.attachProjectileAnim?.(b,'bpx_cocoa_gauntlet',96);b._bpBoom='bpx_cocoa_explode';b._uqRocket=true;if(b.body&&this.physics)this.physics.velocityFromRotation(a,560,b.body.velocity);Sfx.bp?.('uq_rocket_salvo',.6,.8);});
        if(t&&(t.isBoss||t.isMini))for(let k=0;k<stick;k++)this.cocoaLater(.75+k*.35,()=>{if(!t.active)return;this.cocoaHit(t.x,t.y,r*.8,unit*.7,{push:0});this.bpFx?.('bpx_cocoa_stick',t.x,t.y,r*1.8);this.cocoaVisual(t.x,t.y,r*.8,'wave',0xff6a1a);this.screenShake?.(70,.003);Sfx.bp?.('cocoa_rocket_stick_burst',.5,.1);});}
    }else if(path==='titan'){
      const lv=this.titanRageSpend(this._titanRelease||0),rm=TITAN_RAGE_MUL[lv]*(b?.mutation==='bloodpact'?1.3:1)*(1+this.ptv('trRel'))*(lv>0&&lv>=this.titanMaxLv()&&this.ptv('rage4')?1.3:1),x=p.x,y=p.y,r=this.titanSlamRadius(lv),mark=this.cocoaMark(x,y,r);this._cocoaUniqueT=.8;this.bpPose?.(this.textures?.exists?.('char_cocoa_titan_motion823')?'char_cocoa_titan_motion823':'char_cocoa_titan_colossus',.7);Sfx.bp?.('uq_titan_drop',.6,.2);
      this.cocoaLater(.35,()=>{this.cocoaUnmark(mark);this.cocoaHit(x,y,r,unit*1.0*rm,{center:3.6,push:260+lv*80});this.titanPctSlam?.(x,y,r,lv);this.titanSeek?.(x,y,r,lv,unit*rm);this.startHeroRegen?.(3+lv*1.5,(.008+.006*lv)*(this.ptv('rage4')?2:1),'🗿 Titan Recovery');if(!(lv===0&&this.heroFx?.('bpx_cocoa_titan_slam',x,y,r*2/.9,{must:true,depth:6})))this.cocoaVisual(x,y,r,'fist',0xd59b65);if(lv>0&&lv>=this.titanMaxLv())Sfx.bp?.('uq_titan_slam_full',.8,.3);else Sfx.bp?.('cocoa_colossus_slam',.72,.15);if(lv>0)this.titanRageImpact(x,y,r,lv,b);else this.screenShake(130,.005);this.titanFistCombo?.(x,y,r,lv,unit*rm);
        if(b?.mutation==='quakestun')this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.applyFreeze(e,1.5,false);});
        if(this.cocoaHasInf('sour')){const until=(this.elapsed||0)+4;this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)e._titanMarkT=until;});}
        if(lv>=3&&b?.evolved){this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,p.x,p.y)<900&&!(e._phaseGateLocked||e._phaseInvuln>0))this.damage(e,unit*.85*rm*.5,e.x,e.y);});p.hp=Math.min(p.maxhp,p.hp+p.maxhp*.1);this.screenFlash?.(0xffd27a,.35,260);}
        if(lv>=2&&b?.lv?.p_crater)this.cocoaPool(x,y,r*.7,unit*.25*(1+.5*(b.lv.p_crater-1)),3,0xff3a10);});
      // v7.6.13 เจ้าของ: Aftershock 2 ระลอก แรงขึ้นตาม Rage (เดิม 1 ระลอก unit×0.7)
      [[.6,1.25,.9+.3*lv],[1.0,1.5,.7+.25*lv]].forEach(([dt,rs,pm],wi)=>this.cocoaLater(dt,()=>{ if(!p.active)return; this.cocoaHit(x,y,r*rs,unit*pm,{push:120+lv*30}); this.cocoaVisual(x,y,r*rs,'wave',wi?0xffb347:0xd59b65); this.bpFx?.('bpx_cocoa_shockwave',x,y,r*rs*1.6); this.screenShake?.(90+lv*25,.003+lv*.0012); Sfx.bp?.('uq_titan_aftershock',.45+wi*.1,.25,wi?.85:1); }));
    }else if(path==='dashboxer'){
      const duration=5+ul*.5;this._cocoaUniqueT=1.5;this._cocoaPhantom={t:duration,charges:2+(ul>=3?1:0),power:unit*(1+.1*(b.lv.p_phantom||0)),width:(35+ul*3)*size};this.cocoaVisual(p.x,p.y,110,'wave',0xc9a3ff);this.fxPhantomScreen?.(1.4);Sfx.bp?.('uq_phantom_enter',.65,.3)||Sfx.bp?.('cocoa_phantom_start',.65,.3);
      // v6.58.4 Phantom Rush: พุ่งทุบอัตโนมัติ 3–4 ครั้งใส่เป้าแข็งสุด (บอสก่อน)
      /* v7.8.58 เจ้าของ: ยิ่ง Dash ก่อนกด มากครั้ง → พุ่งทุบเพิ่ม +1/Dash และถี่ขึ้น (สูงสุด 5) · กดแล้วนับใหม่ */
      const dn=Math.min(5,this._phSpent||0);this._phSpent=0;this._phantomDashN=0;this._phRef=0;this._phCap=this.uniqueCooldown(this.uniqueInfo())*.4;if(this.ptv('dbRefund'))this.uniqueCd=Math.max(0,this.uniqueCd*(1-.2*this.ptv('dbRefund')));const leaps=(ul>=3?5:4)+dn,gapT=Math.max(.14,.3-.03*dn),slam=unit*1.1*(1+.1*(b.lv.p_phantom||0));if(dn)this.floatText?.(p.x,p.y-60,'👻 +'+dn+' leaps from Dash charges',0xc9a3ff);
      for(let i=0;i<leaps;i++)this.cocoaLater(.05+i*gapT,()=>{const t=this.cocoaPriorityTarget(480);if(!t||!p.active)return;const d=this.dist(t.x,t.y,p.x,p.y),gap=Math.max(36,(t.body?.halfWidth||20)+18),k=Math.max(0,(d-gap)/Math.max(1,d));
        p.iframe=Math.max(p.iframe||0,.5);this.bpPose?.('char_cocoa_phantom',.4);this.cocoaGlideTo({x:p.x+(t.x-p.x)*k,y:p.y+(t.y-p.y)*k},.14);
        this.cocoaLater(.14,()=>{if(!p.active)return;Sfx.bp?.('uq_phantom_strike',.6,.12);this.cocoaHit(p.x,p.y,110,slam,{push:200});this.cocoaVisual(p.x,p.y,110,'fist',0xc9a3ff);if(t.active&&(t.isBoss||t.isMini)&&!(t._phaseGateLocked||t._phaseInvuln>0))this.damage(t,slam*1.6,t.x,t.y);if(t.active){const now=this.elapsed||0;t._shadowN=Math.min(4,(t._shadowUntil>now?t._shadowN||0:0)+1);t._shadowUntil=now+5;this.floatText?.(t.x,t.y-50,'🌑 Shadow Mark ×'+t._shadowN,0xc9a3ff);Sfx.bp?.('cocoa_shadow_mark',.45,.1,0.94+0.05*t._shadowN);}this.cocoaLandingFx(p.x,p.y,110);this.screenShake?.(110,.005);this.hitStop?.(35);Sfx.bp?.('cocoa_dash_landing',.55,.1)||Sfx.comboPunch(i,'heavy');});});
    }else{this._cocoaUniqueT=.2;const r=(115+ul*10)*size;this.cocoaHit(p.x,p.y,r,unit*2.2,{push:250});if(!this.heroFx?.('bpx_cocoa_titan_slam',p.x,p.y,r*2/.9,{must:true,depth:6}))this.cocoaVisual(p.x,p.y,r);Sfx.comboPunch(0,'heavy');
      this.startHeroRegen?.(5+ul,.02+.005*ul);this.burst?.(p.x,p.y,0x7dff9a);this.showBanner('🐻 Bear Grit Slam','Regen '+Math.round((.02+.005*ul)*1000)/10+'% max HP/s for '+(5+ul)+'s',1100);}   // v7.6.7 เจ้าของ: ก่อนเลือกสาย กดแล้ว regen เลือดสูงขึ้น
    this.showBanner(this.uniqueInfo().emoji+' '+this.uniqueInfo().name,path==='dashboxer'?'Auto-leaping onto the strongest enemy · then Dash is free for a few seconds':path==='titan'?'Giant fist slams the strongest enemy':path==='brawler'?'Homing fire gauntlets · bosses take 3 extra blasts':'Slam nearby enemies',1400);
  }
  // v6.58.2 Dash Boxer: Dash พุ่งไปหามอนในทิศที่กด (ไม่กด = ตัวใกล้สุด) แล้วทุบลงพื้นตอนถึง
  cocoaDashLeap(d){
    const b=this.basicAttack,p=this.player,tr=this._cocoaTrail;if(b?.path!=='dashboxer'||!tr||!p?.active)return;
    const aim=this.joy?.active&&this.moveDir?.lengthSq()>.04,rng=1+.25*(b.lv?.p_longleap||0)+this.ptv('dbLeap');let best=null,score=-Infinity;
    const big=this.cocoaPriorityTarget(320*rng);if(big&&(big.isBoss||big.isMini)&&!big._phaseGateLocked){const dx=big.x-p.x,dy=big.y-p.y,dd=Math.hypot(dx,dy)||1;if(!aim||(dx*d.x+dy*d.y)/dd>.2)best=big;}
    if(!best)this.enemies.children.iterate(e=>{if(!e?.active||e._phaseGateLocked)return;const dx=e.x-p.x,dy=e.y-p.y,dist=Math.hypot(dx,dy);if(dist>280*rng||dist<20)return;const dot=(dx*d.x+dy*d.y)/dist;if(aim&&dot<.5)return;const v=(aim?dot*200:0)-dist;if(v>score){score=v;best=e;}});
    if(!best)return;if(b.lv?.p_leapstun&&!best.isBoss&&!best.isMini){best.knock=Math.max(best.knock||0,.4*b.lv.p_leapstun);best.setVelocity?.(0,0);}   // v7.9.23 Leap Stun
    if(b.lv?.p_recharge){const hl=p.maxhp*.015*b.lv.p_recharge;p.hp=Math.min(p.maxhp,p.hp+hl);this.popHeal?.(p.x,p.y,Math.round(hl));}   // v7.9.21 Leap Mend
    const dist=this.dist(best.x,best.y,p.x,p.y),gap=Math.max(36,(best.body?.halfWidth||20)+18),k=Math.max(0,(dist-gap)/dist);
    p.setVelocity(0,0);p.iframe=Math.max(p.iframe||0,.45);this.bpPose?.('char_cocoa_dash_leap',.32);this.cocoaAfterimages?.(p.x,p.y,best.x,best.y);if(best.isBoss||best.isMini)tr.bossT=best;this.cocoaGlideTo({x:p.x+(best.x-p.x)*k,y:p.y+(best.y-p.y)*k},.2);this.dashTime=.22;const sw=b.lv?.p_slamwave||0;tr.finale*=1.5*(1+.1*sw+this.ptv('dbSlam'));tr.finaleR=Math.round(110*(1+.2*sw));tr.leap=true;
  }
  cocoaAfterimages(x0,y0,x1,y1){if(!this.textures?.exists?.('bpx_cocoa_afterimage'))return;const fl=this.player.flipX;for(let i=0;i<3;i++){const k=i/3,g=this.trackArtVfx(this.camWorld(this.add.image(x0+(x1-x0)*k,y0+(y1-y0)*k,'bpx_cocoa_afterimage').setScale(.42).setFlipX(fl).setAlpha(.55-i*.12).setDepth(y0-1)));this.tweens.add({targets:g,alpha:0,duration:320+i*60,onComplete:()=>g.destroy()});}}
  cocoaLeapMutation(x,y,r,power){const m=this.basicAttack?.mutation,p=this.player;
    if(this.cocoaHasInf('minty'))this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.applyFreeze(e,1,false);});
    if(m==='afterimage')for(let i=0;i<3;i++)this.cocoaLater(.5+i*.6,()=>{this.cocoaHit(x,y,r*.8,power*.4,{push:80});this.cocoaVisual(x,y,r*.8,'punch',0xc9a3ff);});
    if(m==='chainleap')this.cocoaLater(.12,()=>{if(!p?.active)return;let best=null,bd=230;this.enemies.children.iterate(e=>{if(!e?.active||e._phaseGateLocked)return;const d=this.dist(e.x,e.y,p.x,p.y);if(d>r*.6&&d<bd){bd=d;best=e;}});if(!best)return;
      p.iframe=Math.max(p.iframe||0,.4);{const d=this.dist(p.x,p.y,best.x,best.y);this.bpFx?.('bpx_cocoa_chainline',p.x,p.y,256,{anchor:'left',rotation:Math.atan2(best.y-p.y,best.x-p.x),scaleX:d/256,scaleY:.5});}this.cocoaGlideTo({x:best.x,y:best.y},.16);this.cocoaLater(.17,()=>{if(!p.active)return;this.cocoaHit(p.x,p.y,r*.85,power*.7,{push:160});this.cocoaVisual(p.x,p.y,r*.85,'fist',0xc9a3ff);this.cocoaLandingFx(p.x,p.y,r*.85);});});}
  /* v8.1.156 CODE_VS_ART รอบ 2 ข้อ 4/7: คลื่นกระแทกโค้ด · วงพื้น (แบนตามมุมกล้อง) ขยาย หนา→บาง · ฝุ่น/เศษกระเด็น · รอยร้าวสั้น ๆ (ท่าหนัก) · วงซ้อนได้ · ขนาดตรงรัศมีจริง */
  /* v8.1.156 CODE_VS_ART รอบ 2 ข้อ 6: แทนภาพ vfx_ring / vfx_glow / vfx_line (ใช้ ~85 จุด) ด้วยภาพวาดโค้ด 256×256 สีขาว (ย้อมสีแล้วได้สีตรง · คม) · วงหนาไม่เท่ากัน + จุดประกาย · เช็กทุก 1 วิ เผื่อโหลดภาพเดิมทับ */
  codeGenericTex(){ if(typeof CODE_VFX==='undefined'||!CODE_VFX.generic||!this.textures||typeof document==='undefined')return 0; let n=0; let U=null; const inUse=k=>{ if(!U)U=this.texInUse?.()||new Set(); return U.has(k); }; this._texInUseFn=inUse;   /* v8.1.159 🐞 glTexture null: ห้ามเปลี่ยนภาพที่มีของบนจอใช้อยู่ (รอรอบถัดไป) */
    const make=(k,fn)=>{ if(!this.textures.exists(k))return; const t=this.textures.get(k); if(t&&t._codeTex)return; if(inUse(k))return; const c=document.createElement('canvas'); c.width=256; c.height=256; const x=c.getContext('2d'); if(!x)return; const id=x.createImageData(256,256),D=id.data;
      for(let py=0;py<256;py++)for(let px=0;px<256;px++){ const a=fn(px,py); if(a<=0)continue; const i=(py*256+px)*4,v=Math.min(1,a); D[i]=255;D[i+1]=255;D[i+2]=255;D[i+3]=Math.round(v*255); }
      x.putImageData(id,0,0); this.textures.remove(k); const nt=this.textures.addCanvas(k,c); if(nt)nt._codeTex=true; n++; };
    const sm=(e0,e1,v)=>{ const t=Math.max(0,Math.min(1,(v-e0)/(e1-e0))); return t*t*(3-2*t); };
    make('vfx_ring',(px,py)=>{ const dx=px-127.5,dy=py-127.5,r=Math.hypot(dx,dy)/128,a=Math.atan2(dy,dx),w=.12+.035*Math.sin(a*3+.7)+.015*Math.sin(a*7),c=.66; const band=1-sm(w*.5,w,Math.abs(r-c)); const glow=.25*(1-sm(0,.2,Math.abs(r-c))); const sp=(Math.sin(a*12)>.985&&Math.abs(r-c)<w*1.6)?.9:0; return Math.max(band,glow,sp)*(r<.99?1:0); });
    make('vfx_glow',(px,py)=>{ const r=Math.hypot(px-127.5,py-127.5)/128; if(r>=1)return 0; const k=1-r; return Math.min(1,k*k*.85+Math.pow(k,6)*.6); });
    this.codeBubbleTex?.();
    n+=this.codeSheets?.()||0;
    make('vfx_line',(px,py)=>{ const u=px/255,taper=Math.pow(Math.max(0,Math.sin(Math.PI*u)),.7)*(.35+.65*u),dy=(py-127.5)/(3+9*u); return taper*Math.exp(-dy*dy*.5); });
    return n; }
  /* v8.1.157 ข้อ 10: ระเบิดไฟฟ้าโค้ด · แฉกสายฟ้าหยักพุ่งออก + วงขยาย + แกนสว่างวาบ + ประกายกระเด็น */
  codeBurst(x,y,R,col,o={}){ if(!this.add?.graphics||!this.tweens||!(R>0))return null; const g=this.camWorld(this.add.graphics().setDepth(o.depth??90400)),clock={p:0},n=o.rays??9,RR=Math.random;
    const rays=Array.from({length:n},(_,i)=>{ const a=i/n*Math.PI*2+RR()*.3,L=R*(.6+RR()*.45),pts=[{x:0,y:0}]; for(let k=1;k<=3;k++){ const d=L*k/3,j=(RR()-.5)*R*.16; pts.push({x:Math.cos(a)*d-Math.sin(a)*j,y:Math.sin(a)*d+Math.cos(a)*j}); } return pts; });
    const sp=Array.from({length:10},()=>({a:RR()*Math.PI*2,s:.5+RR()*.7}));
    const draw=()=>{ if(!g.active)return; const p=clock.p,e=1-Math.pow(1-p,3),f=1-p; g.clear();
      if(p<.3)g.fillStyle(0xffffff,.8*(1-p/.3)).fillCircle(x,y,R*.28*(1+p));
      g.lineStyle(Math.max(1.5,8*f),col,.85*f).strokeCircle(x,y,R*(.2+.8*e)); g.lineStyle(Math.max(1,2.5*f),0xffffff,.7*f).strokeCircle(x,y,R*(.2+.8*e)-3);
      if(p<.6)for(const r of rays){ const k=Math.min(1,p/.25),pts=r.map(q=>({x:x+q.x*k,y:y+q.y*k})); g.lineStyle(7,col,.3*(1-p/.6)).strokePoints(pts); g.lineStyle(2.5,col,.95*(1-p/.6)).strokePoints(pts); g.lineStyle(1,0xffffff,.9*(1-p/.6)).strokePoints(pts); }
      for(const q of sp){ const d=R*(.3+q.s*e); g.fillStyle(q.s>.9?0xffffff:col,.9*f).fillCircle(x+Math.cos(q.a)*d,y+Math.sin(q.a)*d,2.2*f+1); } };
    draw(); this.tweens.add({targets:clock,p:1,duration:o.dur||360,ease:'Linear',onUpdate:draw,onComplete:()=>g.destroy()}); this.trackArtVfx?.(g); return g; }
  /* v8.1.157 CODE_VS_ART รอบ 3 ข้อ 11: ภาพฟองวาดด้วยโค้ด 'code_bubble' (ใสกลาง · ขอบรุ้งเปลี่ยนสีตามมุม · ไฮไลต์โค้งซ้ายบน + จุดวิ้ง) แทนฟอง/โล่ 5 จุด */
  /* v8.1.157 CODE_VS_ART รอบ 3 ข้อ 12–14: วาดชีตเดิมใหม่ด้วยโค้ด · ขนาด/จำนวนเฟรม/ชื่อเฟรมเหมือนเดิมทุกอย่าง (ที่เรียกใช้ไม่ต้องแก้) · ประกาย = ดาว 4 แฉกวิ้ง · หาง = แถบเรียวไหล · ฝุ่น = ปุยนุ่มขยายแล้วจาง */
  codeSheets(){ if(typeof CODE_VFX==='undefined'||!this.textures||typeof document==='undefined')return 0; let n=0;
    const SP=CODE_VFX.sparkle?{cs_fx_sparkle:0,vfx_lb_sparkle:0,lvl_sparkle_sheet:0,temple_sparkle_sheet:0,vfx_ruby_sparkle:0,vfx_tr_edge_sparkle:0,vfx_hub_wand_sparkle:0}:{};
    const TR=CODE_VFX.trail?{bpx_cocoa_dash_trail:[255,170,80],bpx_cocoa810_dashtrail:[255,170,80],vfx_b11_stampede_trail:[210,170,120],vfx_frost_lance_trail:[170,235,255],vfx_b08_dive_trail:[200,160,255]}:{};
    const DU=CODE_VFX.dust?{vfx_bk_dust:0,cs_fx_dust:0}:{};
    const star=(x,cx,cy,r,a,warm)=>{ if(r<.5||a<=0)return; x.save(); x.globalAlpha=a; const g=x.createRadialGradient(cx,cy,0,cx,cy,r*1.4); g.addColorStop(0,warm?'rgba(255,240,190,.9)':'rgba(255,255,255,.9)'); g.addColorStop(1,'rgba(255,220,140,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r*1.4,0,Math.PI*2); x.fill();
      x.fillStyle='#fffdf2'; x.beginPath(); for(let i=0;i<8;i++){ const ang=i*Math.PI/4-Math.PI/2,rr=i%2?r*.22:r; x.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr); } x.closePath(); x.fill(); x.restore(); };
    const redo=(k,paint)=>{ if(!this.textures.exists(k))return; const t=this.textures.get(k); if(!t||t._codeTex)return; if(this._texInUseFn?.(k))return; const src=t.getSourceImage?.(); const W=src?.width,H=src?.height; if(!W||!H)return;
      const names=t.getFrameNames().filter(f=>f!=='__BASE'),fr=names.map(f=>{ const q=t.get(f); return {f,x:q.cutX,y:q.cutY,w:q.cutWidth,h:q.cutHeight}; });
      const c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'); if(!x)return; const cells=fr.length?fr:[{f:null,x:0,y:0,w:W,h:H}];
      cells.forEach((q,i)=>{ x.save(); x.beginPath(); x.rect(q.x,q.y,q.w,q.h); x.clip(); paint(x,q,i,cells.length); x.restore(); });
      for(const a of this.anims?.anims?.getArray?.()||[])if((a.frames||[]).some(f=>f.textureKey===k))this.anims.remove(a.key);
      this.textures.remove(k); const nt=this.textures.addCanvas(k,c); if(!nt)return; nt._codeTex=true; for(const q of fr)nt.add(q.f,0,q.x,q.y,q.w,q.h); n++; };
    for(const k in SP)redo(k,(x,q,i,N)=>{ const ph=(i+.5)/Math.max(1,N),m=Math.min(q.w,q.h),cx=q.x+q.w/2,cy=q.y+q.h/2; star(x,cx,cy,m*.36*Math.sin(Math.PI*ph),1,true); star(x,cx-m*.26,cy+m*.2,m*.14*Math.sin(Math.PI*((ph+.4)%1)),.9,false); star(x,cx+m*.24,cy-m*.24,m*.11*Math.sin(Math.PI*((ph+.7)%1)),.9,false); });
    for(const k in TR)redo(k,(x,q,i,N)=>{ const [r,g,b]=TR[k],cy=q.y+q.h/2,L=q.w,hh=q.h*.32; const gr=x.createLinearGradient(q.x,0,q.x+L,0); gr.addColorStop(0,`rgba(${r},${g},${b},0)`); gr.addColorStop(.7,`rgba(${r},${g},${b},.55)`); gr.addColorStop(1,`rgba(255,255,255,.9)`); x.fillStyle=gr;
      x.beginPath(); x.moveTo(q.x,cy); for(let s2=0;s2<=20;s2++){ const u=s2/20; x.lineTo(q.x+u*L,cy-hh*u*(1+.15*Math.sin(u*12+i*1.7))); } for(let s2=20;s2>=0;s2--){ const u=s2/20; x.lineTo(q.x+u*L,cy+hh*u*(1+.15*Math.sin(u*10+i*2.3))); } x.closePath(); x.fill();
      x.fillStyle='rgba(255,255,255,.7)'; x.fillRect(q.x+L*.35,cy-1,L*.65,2); for(let j=0;j<5;j++){ const u=((j*.23+i*.17)%1),yy=cy+(Math.sin(j*3+i)*hh*.8)*u; x.fillStyle=`rgba(255,255,255,${.6*u})`; x.beginPath(); x.arc(q.x+u*L,yy,1.5+u*1.5,0,Math.PI*2); x.fill(); } });
    for(const k in DU)redo(k,(x,q,i,N)=>{ const ph=(i+1)/Math.max(1,N),cx=q.x+q.w/2,cy=q.y+q.h*.62,m=Math.min(q.w,q.h*1.6); for(let j=0;j<6;j++){ const a=Math.PI+j/5*Math.PI,d=m*.12+m*.28*ph,r=m*(.1+.08*ph)*(1-.15*(j%2)),px=cx+Math.cos(a)*d*(j%2?.8:1),py=cy+Math.sin(a)*d*.45-ph*m*.06;
        const g=x.createRadialGradient(px,py,0,px,py,r); g.addColorStop(0,`rgba(235,220,200,${.75*(1-ph*.85)})`); g.addColorStop(1,'rgba(235,220,200,0)'); x.fillStyle=g; x.beginPath(); x.arc(px,py,r,0,Math.PI*2); x.fill(); } });
    return n; }
  codeBubbleTex(){ if(typeof CODE_VFX==='undefined'||!CODE_VFX.bubble||!this.textures||typeof document==='undefined'||this.textures.exists('code_bubble'))return false; const c=document.createElement('canvas'); c.width=256; c.height=256; const x=c.getContext('2d'); if(!x)return false; const id=x.createImageData(256,256),D=id.data;
    for(let py=0;py<256;py++)for(let px=0;px<256;px++){ const dx=(px-127.5)/124,dy=(py-127.5)/124,r=Math.hypot(dx,dy); if(r>1)continue; const a=Math.atan2(dy,dx),rim=Math.pow(r,6),hl=Math.max(0,1-Math.hypot(dx+.38,dy+.42)/.22)*(r<.8?1:0),hl2=Math.max(0,1-Math.hypot(dx-.3,dy-.5)/.08);
      const R=200+55*Math.sin(a*2+1),G=215+40*Math.sin(a*2+3),B=255; const al=Math.min(1,.06+rim*.75+hl*.85+hl2*.7+(r>.94?.4*(1-(r-.94)/.06):0)); const i=(py*256+px)*4,w=Math.min(1,hl+hl2); D[i]=Math.round(R+(255-R)*w); D[i+1]=Math.round(G+(255-G)*w); D[i+2]=B; D[i+3]=Math.round(al*255); }
    x.putImageData(id,0,0); this.textures.addCanvas('code_bubble',c); return true; }
  codeBubbleOn(){ return typeof CODE_VFX!=='undefined'&&CODE_VFX.bubble&&(this.textures?.exists?.('code_bubble')||this.codeBubbleTex?.()); }
  codeShock(x,y,R,col,o={}){ if(!this.add?.graphics||!this.tweens||!(R>0))return null; const g=this.camWorld(this.add.graphics().setDepth(o.depth??(y-1))),fl=o.flat??.55,dur=o.dur||420,clock={p:0},R0=Math.random;
    const dust=Array.from({length:o.dust??10},(_,i)=>({a:i/(o.dust??10)*Math.PI*2+R0()*.5,s:.55+R0()*.6,r:2+R0()*3.5,c:R0()<.5?(o.dustCol??0xd9c3a5):col}));
    const cracks=o.crack?Array.from({length:6},(_,i)=>{ const a=i/6*Math.PI*2+R0()*.4,L=R*(.35+R0()*.25); return [[0,0],[Math.cos(a+.2)*L*.45,Math.sin(a+.2)*L*.45*fl],[Math.cos(a)*L,Math.sin(a)*L*fl]]; }):null;
    const draw=()=>{ if(!g.active)return; const p=clock.p,e=1-Math.pow(1-p,3); g.clear();
      if(p<.35)g.fillStyle(col,.22*(1-p/.35)).fillEllipse(x,y,R*2*(.3+.7*e),R*2*fl*(.3+.7*e));
      for(let k=0;k<(o.rings??1);k++){ const q=Math.max(0,e-k*.18); if(q<=0)continue; const rr=R*(.25+.75*q); g.lineStyle(Math.max(1.5,(o.w??10)*(1-p)),col,.9*(1-p)).strokeEllipse(x,y,rr*2,rr*2*fl); g.lineStyle(Math.max(1,3*(1-p)),0xffffff,.6*(1-p)).strokeEllipse(x,y,rr*2-4,rr*2*fl-3); }
      if(cracks&&p<.8){ g.lineStyle(3,o.crackCol??0x5b3a29,.85*(1-p/.8)); for(const c of cracks){ g.beginPath(); g.moveTo(x+c[0][0],y+c[0][1]); g.lineTo(x+c[1][0],y+c[1][1]); g.lineTo(x+c[2][0],y+c[2][1]); g.strokePath(); } }
      for(const d of dust){ const dd=R*(.2+d.s*e),h=Math.sin(p*Math.PI)*R*.18*d.s; g.fillStyle(d.c,.85*(1-p)).fillCircle(x+Math.cos(d.a)*dd,y+Math.sin(d.a)*dd*fl-h,d.r*(1-p*.5)); } };
    draw(); this.tweens.add({targets:clock,p:1,duration:dur,ease:'Linear',onUpdate:draw,onComplete:()=>g.destroy()}); this.trackArtVfx?.(g); return g; }
  cocoaLandingFx(x,y,r){
    if(typeof CODE_VFX!=='undefined'&&CODE_VFX.cocoa){ const db=this.basicAttack?.path==='dashboxer'; this.codeShock(x,y+6,Math.max(70,r),db?0xc9a3ff:0xd59b65,{dust:12,crack:!db,rings:db?2:1,dur:480}); return; }
    if(this.basicAttack?.path==='dashboxer')this.bpFx?.('bpx_cocoa_dashring',x,y,r*2.4,{depth:y-1});
    if(this.heroFx?.('bpx_cocoa_landing_dust',x,y+6,Math.max(160,r*2/.9),{must:true,depth:y-1}))return;   // v7.8.46 C8 ฝุ่นโกโก้ (fallback = เส้นร้าว+จุดฝุ่นเดิม)
    if(!this.add?.graphics||!this.tweens)return;const g=this.camWorld(this.add.graphics().setDepth(y-1));
    g.fillStyle(0xd9c3a5,.35).fillEllipse(x,y+8,r*1.6,r*.55);g.lineStyle(3,0x5b3a29,.8);
    for(let i=0;i<6;i++){const a=i*Math.PI/3+.3,l=r*(.45+.25*(i%2));g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.25+3);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l*.45);g.strokePath();}
    this.tweens.add({targets:g,alpha:0,duration:520,delay:120,onComplete:()=>g.destroy()});
    for(let i=0;i<8;i++){const a=i*Math.PI/4,d=this.camWorld(this.add.circle(x,y+4,5,0xe8d6bd,.8).setDepth(y));this.tweens.add({targets:d,x:x+Math.cos(a)*r*.9,y:y+4+Math.sin(a)*r*.35,alpha:0,scale:.3,duration:380,ease:'Quad.out',onComplete:()=>d.destroy()});}
  }
  cocoaStartTrail(){const b=this.basicAttack;if(b?.path!=='dashboxer')return;const ph=this._cocoaPhantom&&this._cocoaPhantom.t>0?this._cocoaPhantom:null,p=this.player;
    // v6.58.1 Dash Boxer: ทุก Dash ต่อยศัตรูตามเส้นทาง (Phantom Rush แรงกว่า) + หมัดปิดตอนจบ Dash
    const lvl=this.skills?.meteor||1,base=(12+3.5*lvl)*(p.dmgMul||1)*(1+(b.ranks?.power||0)*.12)*(1+.1*(b.lv?.p_blitz||0))*.9;
    this._cocoaTrail={x:p.x,y:p.y,power:ph?ph.power:base,width:ph?ph.width:40,seen:new Set(),fxAt:0,finale:ph?0:base*1.3};}
  cocoaTrailHit(tr,x,y){const dx=x-tr.x,dy=y-tr.y,len2=dx*dx+dy*dy;if(len2<1)return;
    this.enemies.children.iterate(e=>{if(!e||!e.active||tr.seen.has(e))return;const f=Math.max(0,Math.min(1,((e.x-tr.x)*dx+(e.y-tr.y)*dy)/len2)),nx=tr.x+dx*f,ny=tr.y+dy*f;if(this.dist(e.x,e.y,nx,ny)>tr.width)return;tr.seen.add(e);this.damage(e,tr.power,e.x,e.y);});
    if((this.elapsed||0)>=tr.fxAt){tr.fxAt=(this.elapsed||0)+.07;const fx0=tr._fxX??(tr._fxX=tr.x),fy0=tr._fxY??(tr._fxY=tr.y),L=this.dist(fx0,fy0,x,y);   // v7.8.45 C7 ริ้วช็อกโกแลตต่อกันตามทางพุ่ง
      if(this.bpAnim?.('bpx_cocoa_dash_trail')){if(L>4){this.heroFx('bpx_cocoa_dash_trail',fx0,fy0,L+8,{h:tr.width*1.5,rot:Math.atan2(y-fy0,x-fx0),depth:(this.player?.depth||8)-1,must:true,life:.35,fade:250});tr._fxX=x;tr._fxY=y;}}else this.cocoaVisual(x,y,tr.width*1.7,'shadow',0xc9a3ff);}
  }

  // ตัวนับ HITS เหนือหัว (อัปเดตทุกเฟรม)
  tickCocoaCombo(dt){const cc=this._cc;if(this.character!=='cocoa'||!cc)return;cc.t+=dt;const hold=this.cocoaComboHold();if(cc.t>hold){cc.n=0;cc.step=0;}if(this._ccTxt)this._ccTxt.setVisible(false);this.drawCocoaComboDots();}
  // v6.58.3 จุดคอมโบ 1–5 เหนือหัว: จุดสุดท้ายเรืองทองเมื่อหมัดถัดไปคือหมัดปิด
  drawCocoaComboDots(){const cc=this._cc,p=this.player;if(!this.add?.graphics||!p?.active)return;let g=this._ccDots;if(!g||!g.active){g=this._ccDots=this.add.graphics();this.camWorld?.(g);}g.clear();
    if(this.character!=='cocoa'||!cc||cc.step<=0||this.state!=='play')return;g.setDepth(p.depth+2);const y=p.y-62,gap=12,x0=p.x-gap*2,ready=cc.step===4;
    for(let i=0;i<5;i++){const on=i<cc.step,last=i===4;g.fillStyle(0x2a1530,.75).fillCircle(x0+i*gap,y,last?5.5:4.5);if(on)g.fillStyle(0xffb347,1).fillCircle(x0+i*gap,y,3.4);else if(last&&ready){const k=.6+.4*Math.sin((this.elapsed||0)*14);g.fillStyle(0xffe066,k).fillCircle(x0+i*gap,y,4.6);}}}

  newbieGuard(){ return (this.stageIndex===0&&(this.stageDiff||1)<=1&&!this.bossRush&&!this.riftMode)?0.6:1; }   // v5.71 ด่านแรกโดนตีเบาลง 40%
  cocoaGuard(){ const nb=this.newbieGuard(); if(this.character!=='cocoa')return nb; const n=this._cc?this._cc.n:0, b=this.basicAttack; return nb*(n>=25?0.65:n>=10?0.8:1)*(this._dashBuffT>0&&b&&b.mutation==='counter'?0.7:1); }
  cocoaBossLeech(){ const P=this.player,now=this.elapsed||0; if(!this._ccLeech||now-this._ccLeech.t>1)this._ccLeech={t:now,v:0};
    const cap=P.maxhp*0.04, amt=Math.min(P.maxhp*0.005,cap-this._ccLeech.v); if(amt<=0)return; this._ccLeech.v+=amt; P.hp=Math.min(P.maxhp,P.hp+amt); }
  // หลอดเติมเอง 30 วิ · ต่อยโดน/โดนตีลดเวลา · ใช้เร็วสุดทุก 15 วิ
  cocoaBeatCharge(sec){if(this.character!=='cocoa'||!(this.uniqueCd>0))return;sec*=1+.15*(this.basicAttack?.lv?.drum||0);const floor=Math.max(0,(this._cocoaMinGap||0)-((this.elapsed||0)-(this._cocoaUsedAt??-99)));this.uniqueCd=Math.max(floor,this.uniqueCd-sec);}

  cancelBeat(){ this.clearCocoaCombat(); }
  cocoaDashMax(){ const b=this.basicAttack; return 2+((b&&b.lv&&b.lv.dashp)||0)+((b&&b._pm&&b._pm.dashc)||0); }
  cocoaDashRecharge(){ return 1.3*(this.player.dashCdMul||1)*this.cocoaDashCdMul(); }
  cocoaDashCdMul(){ if(this.character!=='cocoa')return 1; const b=this.basicAttack; return (b&&b.mutation==='counter'?0.6:1)*(b&&b.evolved&&b.path==='dashboxer'?0.7:1)*((b&&b._pm&&b._pm.dashc)?0.75:1); }
  cocoaDashBuffPct(){ const b=this.basicAttack; return 0.1+((b&&b._pm&&b._pm.dashm)||0); }   // v7.9.21 Dash Stack = charges only (damage lives on Phantom Jab)
  cocoaDashBuff(){ if(this.character!=='cocoa')return; const b=this.basicAttack; this._dashBuffT=2.5+((b&&b._pm&&b._pm.dashc)||0)*1.0;
    const P=this.player; if(!this.heroFx?.('bpx_cocoa_dash_buff',P.x,P.y,120,{must:true,depth:P.depth+1,follow:P}))this.vfxHitRing(P.x,P.y,0xffa54d,false); P.setTint(0xffc477); this.time.delayedCall(180,()=>P.active&&P.clearTint()); }
  cocoaDashBuffMul(){ return this.character==='cocoa'&&this._dashBuffT>0?1+this.cocoaDashBuffPct():1; }
  tickCocoaDash(dt){ if(this.character==='cocoa'){ const mx=this.cocoaDashMax(); if(this._dpCh==null)this._dpCh=mx; if(this._dpCh>mx)this._dpCh=mx; if(this._dpCh<mx){ this._dpT=(this._dpT||0)+dt; if(this._dpT>=this.cocoaDashRecharge()){ this._dpT=0; this._dpCh++; } } else this._dpT=0; this.dashReady=this._dpCh>0||!!(this._cocoaPhantom&&this._cocoaPhantom.t>0&&this._cocoaPhantom.charges>0); }
    if(this._dashBuffT>0){ this._dashBuffT-=dt; if(this.player&&Math.random()<dt*14){ const P=this.player,p=this.camWorld(this.add.circle(P.x+Phaser.Math.Between(-18,18),P.y+10,3,0xffa54d,0.9).setDepth(P.depth-1)); this.tweens.add({targets:p,y:p.y-26,alpha:0,duration:380,onComplete:()=>p.destroy()}); } } }
  castBearDonut(lvl,aw,dm,evo,basic){
    // โกโก้ = ต่อยประชิด 2 หมัด (base) · คลื่นสะท้อน (shockwave) ต้อง Mutation 'breaker' หรือ Awaken/Evo ถึงจะมี
    const breaker=basic?.mutation==='breaker', wave=breaker||!!evo||aw;
    const sig=this.player.donutImpact?1.28:1,wm=this.signatureWeaponInfo().skill==='meteor'?(this.player.weaponAreaMul||1):1,hits=2+(aw?2:0)+(evo?2:0)+(basic?._pm?.count||0), r=(68+lvl*8)*(aw?1.22:1)*sig*wm*(evo?1.2:1)*(1+(basic?._pm?.range||0));
    const dmg=(12+lvl*3.5)*dm*(aw?1.1:1)*sig;
    for(let i=0;i<hits;i++)this.time.delayedCall(i*170,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const t=this.nearestEnemy(620),x=t?t.x+Phaser.Math.Between(-20,20):this.player.x+Phaser.Math.Between(-190,190),y=t?t.y+Phaser.Math.Between(-20,20):this.player.y+Phaser.Math.Between(-190,190);
      const donut=this.camWorld(this.add.image(x,y-190,'proj_bear_donut').setDepth(90001).setScale(0.34).setAlpha(0.95));
      this.tweens.add({targets:donut,y,scale:0.58,duration:210,ease:'Quad.in',onComplete:()=>{donut.destroy();this.bearDonutImpact(x,y,r,dmg,(i===hits-1||!!evo)&&wave,aw);}});
    }); Sfx.punch();
  }
  bearDonutImpact(x,y,r,dmg,final,aw){
    this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.damage(e,dmg,e.x,e.y);});
    this.hitCratesInRadius(x,y,r,dmg);this.burst(x,y,0xc97932);
    const glaze=this.camWorld(this.add.image(x,y,'vfx_choco_glaze').setDepth(2).setScale((r*2)/256).setAlpha(0.76));
    const ticks=aw?8:5;for(let n=1;n<=ticks;n++)this.time.delayedCall(n*260,()=>{if(!glaze.active)return;
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r){this.damage(e,dmg*0.12,e.x,e.y);this.applyFreeze(e,0.10,false);}});
    });
    this.tweens.add({targets:glaze,alpha:0,delay:ticks*260,duration:300,onComplete:()=>glaze.destroy()});
    if(final){const wave=this.camWorld(this.add.image(x,y,'vfx_bear_shockwave').setDepth(4).setScale(0.18).setAlpha(0.92));
      this.tweens.add({targets:wave,scale:(r*3.4)/256,alpha:0,duration:430,onComplete:()=>wave.destroy()});
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r*1.7)this.damage(e,dmg*(aw?1.05:0.8),e.x,e.y);});Sfx.boom();}
  }
  // 🪞 งาดำ Basic Attack: พัลส์กระจกกระแทกในเขตวงเวทถาวร (ไม่ยิง projectile) — ทำงานคู่กับ aura ใน tickCharSignature
  // 🪞 Mirror Beam — งาดำยิง "ลำแสงกระจก" ใส่เป้า (ดาเมจเต็มกับบอส · แรงขึ้นตาม Focus ที่ชาร์จจากการยืนนิ่ง)
  // แก้ปัญหางาดำเอาบอสไม่อยู่: field เดิม tick เบา → beam ลงดาเมจก้อนใหญ่ single-line เจาะทะลุ โดนบอสเต็ม
  castMirrorBeam(lvl,aw,dm,basic){
    if(this.isSesRune?.())return this.castSesRuneFlare(lvl,dm,basic);
    const evo=basic&&basic.evolved, px=this.player.x, py=this.player.y;
    // v7.9.40 Mirror Network: เส้นแสง งาดำ → กระจกเก่าสุด → … → ใหม่สุด → ศัตรู (บอส/มินิก่อน) · กระจกเกิน 700px ไม่นับ · ไม่มีกระจก = ยิงตรงแบบเดิม
    const pts=[{x:px,y:py}]; for(const m of this._sesMirrors||[])if(m.ring&&m.ring.active&&this.dist(m.x,m.y,px,py)<=SES_MIRROR_REACH)pts.push(m);
    const L=pts[pts.length-1], bounces=pts.length-1;
    let t=null,td=1e9; this.enemies.children.iterate(e=>{ if(!e||!e.active||!(e.isBoss||e.isMini))return; const d=this.dist(e.x,e.y,L.x,L.y); if(d<td&&d<1300){td=d;t=e;} });
    if(!t){ let nd=1300; this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=this.dist(e.x,e.y,L.x,L.y); if(d<nd){nd=d;t=e;} }); }
    const ang=t?Math.atan2(t.y-L.y,t.x-L.x):((!bounces&&this.moveDir&&(this.moveDir.x||this.moveDir.y))?this.moveDir.angle():(this._sesBeamAng||0));
    this._sesBeamAng=ang;
    const over=bounces>=3;   // เด้งครบ 3 บาน = รอย Mirror Mark ×2
    const bRad=1+(basic?.ranks.radius||0)*0.12, bPane=basic?.ranks.pane||0, bPow=basic?.ranks.power||0;
    const len=(360+lvl*26)*bRad*(aw?1.2:1)*(evo?1.15:1)*(1+(basic?._pm?.range||0));
    const wide=(10+lvl*0.9+bPane*2+bounces*1.5)*(basic?.mutation==='fortress'?1.25:1);
    const SL=basic?.lv||{},retreat=SL.p_swift&&(this.elapsed||0)<(this._sesRetreatT||0)?1+.3*SL.p_swift:1; if(retreat>1)this._sesRetreatT=0;   // v7.9.17 Retreat Shot
    const dmg=(20+lvl*6)*dm*(1+bPow*0.12)*(evo?1.3:1)*(aw?1.25:1)*(basic?.mutation==='retaliate'?1.25:1)*retreat;
    const beams=1+(evo?1:0)+(aw?1:0)+Math.min(2,bPane)+(this.player.mirrorWard?1:0)+(basic?._pm?.count||0), spread=0.12;   // ลำเสริมแตกออกที่ปลายทาง (จุดสุดท้าย)
    const PRISM=SES_PRISM;
    // 🔮 Mirror Mark: บีมโดน = สะสมรอยกระจก ครบ 5 → แตกระเบิดดาเมจก้อน (โดยเฉพาะบอส)
    const markHit=(e)=>{ const need=5; e._sesMark=(e._sesMark||0)+(over?2:1); e._sesMarkT=2.2;
      if(e._sesMark>=need){ e._sesMark=0; const burst=dmg*((e.isBoss||e.isMini)?1.8:2.6); this._mxSrc='sesame.mark'; this.damage(e,burst,e.x,e.y);
        if(this.anims.exists('fx_slash'))this.spawnFxAnim('fx_slash',e.x,e.y,{scale:1.1,depth:8,anchor:'center',tint:PRISM});
        else this.vfxHitRing(e.x,e.y,PRISM,true); this.popDmg(Math.round(burst),e.x,e.y,true); Sfx.boom(); } };
    const fireChain=(mul)=>{ const P=pts.filter((q,i)=>i===0||(q.ring&&q.ring.active));
      for(let i=0;i+1<P.length;i++){ const A=P[i],B=P[i+1],a=Math.atan2(B.y-A.y,B.x-A.x),d=Math.hypot(B.x-A.x,B.y-A.y);
        this._mxSrc=i?'sesame.bounce':'sesame.beam'; this.fireBeam(a,d,wide,dmg*mul*(1+SES_BOUNCE*i),{tint:PRISM,ox:A.x,oy:A.y,onHit:markHit}); if(i)this.vfxHitRing(A.x,A.y,0xffffff,false); }
      const E=P[P.length-1],k0=(P.length-1)*SES_BOUNCE; if(P.length>1)this.vfxHitRing(E.x,E.y,0xffffff,false);
      this._mxSrc=P.length>1?'sesame.bounce':'sesame.beam';
      for(let k=0;k<beams;k++){ const a=this._sesBeamAng+(k-(beams-1)/2)*spread; this.fireBeam(a,len,wide,(k===0?dmg:dmg*0.7)*mul*(1+k0),{tint:PRISM,ox:E.x,oy:E.y,onHit:markHit}); } };
    fireChain(1);
    if(SL.p_facet&&(this._sesEchoN=(this._sesEchoN||0)+1)%(SL.p_facet>=2?3:4)===0)this.artDelay(300,()=>{ if(this.state!=='play'||this.basicAttack!==basic)return; pts[0]={x:this.player.x,y:this.player.y}; fireChain(.5); });   // v7.9.17 Prism Echo
    // คงบทบาทป้องกัน: ลบกระสุนศัตรูรอบตัวเล็กน้อย (ward)
    this.foeBullets.children.iterate(f=>{ if(f&&f.active&&this.dist(f.x,f.y,this.player.x,this.player.y)<70){ this.vfxHitRing(f.x,f.y,PRISM,false); this.killFoe(f); } });
    this.vfxHitRing(this.player.x,this.player.y,over?0xffe08a:PRISM,true); Sfx.beam();
  }
  // ❄️ Mint active cast: สะบัดเกล็ดน้ำแข็งกระเด็นออกWaitบทิศ (เจาะ+แช่) · คู่กับเกล็ดโคจรใน tickCharSignature
  // ❄️ Frost Lance (Shatter Lance) — ชาร์จสั้น ๆ พุ่งหอกเจาะทะลุ แล้ว "shatters into ice shards" กระจายที่ปลายทาง (แบบลูกซอง)
  berryBullet(x,y,scale,basic){
    let n=0;this.bullets.children.iterate(b=>{if(b?.active&&b.berrySeed)n++;});if(n>=32)return null;
    const b=this.getBullet(x,y,0xffffff,scale);if(b)b.berrySeed={basic,epoch:this._artEpoch||0,visited:new Map(),splashed:new Map(),legs:0,base:0};return b;
  }
  berrySplash(x,y,power,r,skip=null,seed=null){
    let n=0;this.enemies.children.iterate(e=>{if(n>=16||!e?.active||e===skip||e._phaseGateLocked||(e._phaseInvuln||0)>0||this.dist(e.x,e.y,x,y)>r)return;
      if(seed?.path==='ricochet'){if(e.isBoss||e.isMini)return;const life=e._glacierLifeToken||0;if(seed.splashed.get(e)===life)return;seed.splashed.set(e,life);}n++;this.damage(e,power,e.x,e.y);});
    const now=this.time.now;if(this._berryFxAt==null||now-this._berryFxAt>=200){this._berryFxAt=now;this._berryFxCount=0;}
    if(this._berryFxCount<3){this._berryFxCount++;if(!this.heroFx?.('bpx_momo_seed_pop',x,y,Math.max(56,r*1.6)))this.vfxHitRing(x,y,0xff9ec4,false);}
  }
  castBerryBlaster(lvl,aw,dm,basic){
    if(!this.nearestEnemy(900))return;
    const profile=berryShotProfile(lvl,aw,basic,this.player),path=basic.path,PT=this.player._pt||{};
    const power=(5.25+lvl*1.5)*dm*(aw?1.12:1)*(this.player.twinSprinkle?1.2:1)*profile.power*(path?1:1.5)*(path==='sniper'||path==='shotgun'?1.15:1);   /* v8.0.18 เจ้าของ: Sniper/Shotgun ตีธรรมดาแรงขึ้น +15% */
    if(path==='sniper'){
      if(this._berryCharge)return;
      const ms=340+60*(basic.lv.s_draw||0),t=this.nearestEnemy(1100),a=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):0;
      const glow=this.textures.exists('vfx_strawberry_charge')?this.trackArtVfx(this.camWorld(this.add.image(this.player.x,this.player.y-24,'vfx_strawberry_charge').setDisplaySize(88,88).setDepth(90490).setAlpha(.6))):null;
      const c={basic,lvl,aw,power,ms,start:this.time.now,angle:a,epoch:this._artEpoch||0,glow};this._berryCharge=c;Sfx.bpLoopStart?.('strawberry_sniper_charge',.2);
      this.poseAttack(ms+200);c.timer=this.artDelay(ms,()=>{if(this._berryCharge===c)this.releaseBerryCharge(true);});return;
    }
    this.poseAttack(340);const epoch=this._artEpoch||0,shots=profile.count+(Math.random()<.15*(basic.lv?.size||0)?1:0);   /* v8.0.70 Twin Seed */
    const fire=(idx,repeat=false)=>{
      if(!this.player?.active||this.state!=='play'||this.basicAttack!==basic||(this._artEpoch||0)!==epoch)return;
      const t=this.nearestEnemy(900);if(!t)return;
      const b=this.berryBullet(this.player.x,this.player.y,.12+lvl*.008+(aw?.03:0),basic);if(!b)return;
      b.setTexture('proj_sprinkle').setTint(idx%2?0xffd166:0xff76a8);b.faceVel=true;b.dmg=power;b.life=aw?2.2:1.9;b.homing=0;
      b.seedPop=0;b.pierce=false;b.bounce=(basic.mutation==='ricochet'?2:0)+(this.player.gearBounce||0);b.bounceGain=0;b.seekMul=1;
      const meta=b.berrySeed;meta.path=path;meta.evolved=!!basic.evolved;
      if(path==='shotgun'){
        b.dmg*=(typeof SG_PELLET_MUL!=='undefined'?SG_PELLET_MUL:.45)*(basic.evolved?1.35:1);b.life=.3;b.sgPellet=true;b.sgBlast=this.time?.now||0;b.closeMul=.4+.15*(basic.ranks.pointblank||0)+(PT.close||0);b.cqMul=PT.cq||0;b.knockback=110+(PT.kb||0)*60;b.dragon=!!PT.dragon;
        if(idx===Math.floor((shots-1)/2)){b.dmg*=1+.6*(basic.lv.s_slug||0)+(basic.evolved?.6:0)+(PT.slug||0);if(basic.evolved||basic.lv.s_slug)this.attachChargedSeed(b,30);}
        meta.nearBonus=basic.evolved?1.2:1;
      }else if(path==='ricochet'){
        b.dmg*=.8*(1+(PT.rDmg||0));b.bounce+=2+(basic.lv.carom||0)+(basic.evolved?2:0)+((PT.rDmg||0)>=.119?1:0);if(PT.pinball)b.bounce=Math.max(b.bounce,12);
        b.bounceGain=.08*(basic.ranks.gather||0)+(PT.mom||0);b.seekMul=(1+(PT.seek||0))*(1+.2*(basic.lv.s_seek||0));b.lastMul=PT.last||0;b.splitCh=PT.split||0;b.loopT=!!PT.loop;b.boomer2=!!PT.boomer;
      }
      b.dmg*=1+.08*Math.min(10,Math.max(0,b.bounce-8));b.bounce=Math.min(8,b.bounce);meta.base=b.dmg;
      const closeBig=path==='shotgun'&&(t.isBoss||t.isMini||t.isElite)&&this.dist(t.x,t.y,this.player.x,this.player.y)<430;
      const spread=path==='shotgun'?(idx-(shots-1)/2)*(closeBig?.11:.16):(basic.mutation==='fan'?(idx-(shots-1)/2)*.055:0);
      const a=Math.atan2(t.y-this.player.y,t.x-this.player.x)+spread+Phaser.Math.FloatBetween(closeBig?-.04:-.08,closeBig?.04:.08);
      this.physics.velocityFromRotation(a,aw?1180:980,b.body.velocity);
      if(path!=='shotgun'&&!b._chargeFx)this.momoOutlineSeed?.(b,'seed',24);
      if(path==='shotgun'){
        if(repeat)this.shotgunFeedbackTrail?.(b,a);
        if(idx===0)this.shotgunKick(a,repeat,Math.atan2(t.y-this.player.y,t.x-this.player.x),!repeat&&PT.dbarrel&&this._sgVol%4===0);
      }else Sfx.strawberryShoot();
    };
    if(path==='shotgun'){
      this._sgVol=(this._sgVol||0)+1;for(let k=0;k<shots;k++)fire(k);
      if(PT.dbarrel&&this._sgVol%4===0)this.artDelay(140,()=>{for(let k=0;k<shots;k++)fire(k,true);});
      if(PT.recoil&&(this.elapsed||0)>=(this._ptRecoilAt||0)){this._ptRecoilAt=(this.elapsed||0)+1.2;const t=this.nearestEnemy(640);if(t){const a=Math.atan2(this.player.y-t.y,this.player.x-t.x);this.player.x+=Math.cos(a)*40;this.player.y+=Math.sin(a)*40;this.player.iframe=Math.max(this.player.iframe||0,.15);}}
    }else {fire(0);for(let k=1;k<shots;k++)this.artDelay(k*(aw?38:52),()=>fire(k));}
  }
  tickBerryCharge(){
    const c=this._berryCharge;if(!c?.glow?.active)return;
    c.glow.setPosition(this.player.x,this.player.y-24).setAlpha(.45+.4*Math.min(1,(this.time.now-c.start)/c.ms));
  }
  releaseBerryCharge(complete){
    const c=this._berryCharge;if(!c)return;this._berryCharge=null;Sfx.bpLoopStop?.('strawberry_sniper_charge');if(c.timer){c.timer.remove(false);this._artTimers?.delete(c.timer);}if(c.glow?.active)c.glow.destroy();
    const b0=c.basic;if(!this.player?.active||this.state!=='play'||this.basicAttack!==b0||b0.path!=='sniper'||c.epoch!==(this._artEpoch||0))return;
    const b=this.berryBullet(this.player.x,this.player.y,.12+c.lvl*.008+(c.aw?.03:0),b0);if(!b)return;
    const p=complete?1:Math.max(0,Math.min(.98,(this.time.now-c.start)/c.ms)),PT=this.player._pt||{};
    b.setTexture('proj_sprinkle').setTint(complete?0xffd166:0xff9ec4);b.faceVel=true;
    b.dmg=c.power*3.84*(.55+(.45+.15*(b0.lv.s_draw||0))*p)*(complete&&b0.evolved?1.3:1)*(1+(PT.sDmg||0));
    b.headshot=.07*(b0.ranks.headshot||0)+(PT.hs||0);b.bigMul=.15*(b0.ranks.deadeye||0)+(PT.big||0);b.penGain=PT.pen||0;b.oneShot=!!PT.oneShot;b._ptSniper=true;
    if(this._ptHsNext){b.forceHs=true;this._ptHsNext=false;}if(PT.ghillie&&(this._ptStill||0)>=1.5&&!this._ptGhUsed){b.dmg*=2;this._ptGhUsed=true;}
    b.pierce=true;b.seedPierce=true;b.hitTargets=new Set();b.seedPop=0;b.life=c.aw?2.2:1.9;b.homing=0;
    Object.assign(b.berrySeed,{path:'sniper',full:!!complete,base:b.dmg,pierces:(complete&&b0.evolved?10:6)+(b0.mutation==='ricochet'?2:0)+Math.min(6,this.player.gearBounce||0)+Math.min(3,b0.lv.size||0)});
    const t=this.nearestEnemy(1100),a=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):c.angle;this.attachChargedSeed(b,complete&&b0.evolved?64:38+c.lvl*2);
    this.physics.velocityFromRotation(a,(c.aw?1180:980)*1.35,b.body.velocity);this.poseAttack(340);Sfx.bp?.('strawberry_sniper_shot',complete?.62:.45,.1)||Sfx.shoot();
  }
  hitBerrySeed(b,e){
    const m=b.berrySeed;if(!b.active||!e?.active||!m)return;
    if(m.epoch!==(this._artEpoch||0)||this.basicAttack!==m.basic){this.killBullet(b);return;}
    const life=e._glacierLifeToken||0;if(m.visited.get(e)===life)return;m.visited.set(e,life);
    if(e._phaseGateLocked||(e._phaseInvuln||0)>0){this.killBullet(b);return;}
    let d=this.pathBulletDmg(b,e);if(b.sgPellet&&this.dist(e.x,e.y,this.player.x,this.player.y)<120)d*=m.nearBonus||1;
    const x=e.x,y=e.y;this.damage(e,d,b.x,b.y);if(b.hitTargets)b.hitTargets.add(e);
    if(m.path==='sniper'){this.bpFx?.('bpx_momo_sniperhit',x,y,110);Sfx.bp?.('strawberry_sniper_impact',.5,.08);}else if(b.sgPellet){const now=this.time.now;if(now-(this._bpPelletAt||0)>70){this._bpPelletAt=now;this.bpFx?.('bpx_momo_pellethit',x,y,56);}}else this.momoSeedPop?.(x,y);
    if(e.active&&b.knockback&&!e.isBoss&&!e.isMini){const a=Math.atan2(e.y-this.player.y,e.x-this.player.x);e.setVelocity(Math.cos(a)*b.knockback,Math.sin(a)*b.knockback);e.knock=.22;}
    this.chainFrom(b,e);
    if(b.seedPop>0)this.berrySplash(x,y,b.dmg*(.25+.12*b.seedPop),46+14*b.seedPop,e,m);
    if(m.path==='sniper'){if(m.visited.size>=m.pierces)this.killBullet(b);return;}
    let t=null,bd=(360*(b.seekMul||1))**2;this.enemies.children.iterate(o=>{if(!o?.active||m.visited.get(o)===(o._glacierLifeToken||0)||o._phaseGateLocked||(o._phaseInvuln||0)>0)return;const dd=(o.x-b.x)**2+(o.y-b.y)**2;if(dd<bd){bd=dd;t=o;}});
    if(b.bounce>0&&t){this.bpFx?.('bpx_momo_bounce',x,y,80);this.ricochetLink?.(x,y,t.x,t.y);b.bounce--;b._bounced=true;m.legs++;Sfx.bp?.('strawberry_ricochet_bounce',.36,.07,0.95+Math.min(.3,.04*m.legs));b.dmg=m.base*Math.min(2.2,1+(b.bounceGain||0)*m.legs);this.ptOnBounce(b,e);b.life=Math.max(b.life,.35);const a=Math.atan2(t.y-b.y,t.x-b.x);this.physics.velocityFromRotation(a,980,b.body.velocity);return;}
    if(!t&&m.legs===0&&m.visited.size===1&&!b._split&&m.path==='ricochet'&&(e.isBoss||e.isMini)&&e.active&&!e._phaseGateLocked&&!(e._phaseInvuln>0))this.damage(e,m.base*Math.min(.8,.25+.04*(b.bounce||0)+.1*(m.basic.lv.s_return||0)),x,y);
    if(m.path==='ricochet'&&m.evolved){this.bpFx?.('bpx_momo_pinball',x,y,170);Sfx.bp?.('strawberry_pinball_final',.55,.12);this.berrySplash(x,y,b.dmg*.25,72,e,m);}
    // Returning seed keeps its combat value, but cannot hit a visited lifetime again.
    if(b.boomer2&&!b._boomed&&b._bounced){b._boomed=true;m.path='sniper';m.pierces=m.visited.size+4;b.pierce=true;b.life=Math.max(b.life,.9);const a=Math.atan2(this.player.y-y,this.player.x-x);this.physics.velocityFromRotation(a,980,b.body.velocity);return;}
    this.killBullet(b);
  }
  mintBullet(x,y,tint,scale){
    let active=0;this.bullets.children.iterate(b=>{if(b?.active&&b.mintEpoch!=null)active++;});
    if(active>=24)return null;
    const b=this.getBullet(x,y,tint,scale);if(b)b.mintEpoch=this._artEpoch||0;return b;
  }
  mintOutlineKey(key){const map={fx_mint_snowstorm:'snowstorm',fx_mint_shatter:'blast',fx_mint_dash_shard:'shard',bpx_mint_rupture:'bloom',bpx_mint_needle_hit:'hit',bpx_mint_chill_hit:'hit',bpx_mint_lance_charge:'charge'},clip=map[key],next=clip&&'bpx_mint819_'+clip;return next&&(this.realTex?.(next)??this.textures?.exists(next))?next:key;}
  mintOutlineFrame(image,dt){const m=image?._mintOutline819;if(!image?.active||!m||this.state!=='play')return;m.t+=dt;const still=this.hubMotionAllowed?.()===false||(typeof Save!=='undefined'&&Save.data.settings?.vfx===0),n=Math.max(1,(image.texture?.frameTotal||7)-1),frame=still?Math.min(2,n-1):Math.floor(m.t*m.rate*n/6)%n;if(m.frame!==frame){m.frame=frame;image.setFrame(frame);}}   /* v8.2.74 เฟส 3: อ่านจำนวนเฟรมจริง (8) · รอบเวลาเท่าเดิม */
  mintOutlineProjectile(b,clip,w,h=w){const fresh='bpx_mint_needle821',has=k=>(this.realTex?.(k)??this.textures?.exists(k)),key=clip==='lance'&&has(fresh)?fresh:'bpx_mint819_'+clip;if(!has(key))return false;if(b._chargeFx?.active)b._chargeFx.destroy();const image=b._chargeFx=this.camWorld(this.add.sprite(b.x,b.y,key,0).setDisplaySize(w,h).setDepth(90000));image._mintOutline819={t:0,rate:18,frame:-1};this.mintOutlineFrame(image,0);b.setAlpha(0);return true;}
  mintOutlineTrail(x,y,a,L){const key='bpx_mint819_dash';if(!(this.realTex?.(key)??this.textures?.exists(key)))return null;const image=this.trackArtVfx(this.camWorld(this.add.sprite(x,y,key,0).setOrigin(.0625,.5).setRotation(a).setDepth(5).setDisplaySize(L/.875,108)));image._mintOutline819={t:0,rate:14,frame:-1};this.mintOutlineFrame(image,0);return image;}
  mintBurstFx(x,y,r=110){
    const now=this.time.now;
    if(this._mintVfxWindow==null||now-this._mintVfxWindow>=200){this._mintVfxWindow=now;this._mintVfxCount=0;}
    if(this._mintVfxCount>=3)return;this._mintVfxCount++;
    const fresh=this.mintOutlineKey?.('bpx_mint_rupture');if(fresh==='bpx_mint819_bloom'&&this.heroFx?.(fresh,x,y,r*2,{depth:6}))return;
    const painted=this.basicAttack?.path==='glacier'&&this.textures.exists('vfx_glacier_shatter'),key=painted?'vfx_glacier_shatter':'fx_mint_shatter';
    if(this.textures.exists(key))this.trackArtVfx(this.spawnFxAnim(key,x,y,{scale:r*2/(painted?192:320),depth:6,normal:true}));
    else this.vfxHitRing(x,y,0xbdf0ff,true);
  }
  mintHeavyImpact(){
    const now=this.time.now;if(now<(this._mintImpactAt??-Infinity)+350)return;this._mintImpactAt=now;
    if(this.hitStop)this.hitStop(25);if(this.screenShake)this.screenShake(60,.002);
  }
  queueHailstorm(lvl,damage,freeze,basic){
    const now=this.time.now;if(now<(this._mintArsenalAt??-Infinity)+4000)return;this._mintArsenalAt=now;
    for(let k=0;k<6;k++)this.artDelay(k*90,()=>{
      if(!this.player?.active||(this.state!=='play'&&this.state!=='levelup')||this.basicAttack!==basic||basic.path!=='barrage'||!basic.evolved)return;
      const t=this.nearestEnemy(900);if(!t)return;
      if(k===0){this.bpFx?.('bpx_mint_hail',t.x,t.y-40,280);Sfx.bp?.('mint_hailstorm_cast',.6,.5);}
      const b=this.mintBullet(this.player.x,this.player.y,0xffffff,.4+lvl*.028);if(!b)return;
      const a=Math.atan2(t.y-this.player.y,t.x-this.player.x)+(k%2?.08:-.08);
      b.setTexture(this.textures.exists('proj_frostlance')?'proj_frostlance':'proj_boomer').setTint(0xdaf7ff);
      b.faceVel=true;b.dmg=damage*.7;b.life=.65;b.homing=0;b.pierceLeft=1;
      b.iceNeedle={freeze,frozenBonus:1.2,shatter:false,dmg:b.dmg,lvl};
      this.physics.velocityFromRotation(a,900,b.body.velocity);
    });
  }
  impalerTarget(range){
    const boss=this.priorityBossTarget(range);if(boss)return boss;
    let target=null,dist=range*range;
    this.enemies.children.iterate(e=>{if(!e||!e.active||!e.isElite)return;const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2;if(d<dist){dist=d;target=e;}});
    return target||this.nearestEnemy(range);
  }
  castImpalerLance(lvl,aw,dm,basic){
    if(this._impalerCharge||!this.player?.active||(this.state!=='play'&&this.state!=='levelup'))return;
    const ms=320+80*(basic.lv.p_heavydraw||0),target=this.impalerTarget(1100);
    const angle=target?Math.atan2(target.y-this.player.y,target.x-this.player.x):(this._lanceAng||0);
    const c=this._impalerCharge={basic,player:this.player,lvl,aw,dm,ms,start:this.time.now,angle,glow:null,bp:null,epoch:this._artEpoch||0};
    this.poseAttack(ms+200);this.tickImpalerCharge();Sfx.bpLoopStart?.('mint_impaler_charge',.22);
    c.timer=this.artDelay(ms,()=>{if(this._impalerCharge===c)this.releaseImpalerCharge(true);});
  }
  tickImpalerCharge(){
    // Charge is painted on the player sprite, not on a separate glow or VFX plane.
    const c=this._impalerCharge;if(!c||!this.player)return;
  }
  releaseImpalerCharge(complete){
    const c=this._impalerCharge;if(!c)return;this._impalerCharge=null;Sfx.bpLoopStop?.('mint_impaler_charge');
    if(c.timer){c.timer.remove(false);this._artTimers?.delete(c.timer);}
    if(c.glow?.active)c.glow.destroy();if(c.bp?.active)c.bp.destroy();
    if(!this.player?.active||c.player&&c.player!==this.player||(this.state!=='play'&&this.state!=='levelup')||(this._artEpoch||0)!==c.epoch||this.basicAttack!==c.basic||c.basic.path!=='pierce')return;
    const {basic,lvl,aw,dm}=c,progress=complete?1:Math.max(0,Math.min(0.98,(this.time.now-c.start)/c.ms)),full=!!complete;
    const target=this.impalerTarget(1100),angle=target?Math.atan2(target.y-this.player.y,target.x-this.player.x):c.angle;
    this._lanceAng=angle;if(Math.abs(Math.cos(angle))>.1)this.player.setFlipX?.(Math.cos(angle)<0);this.poseAttack(360,this.textures?.exists?.('char_mint_impaler_release')?'char_mint_impaler_release':full?'char_mint_lance_charged':undefined);
    const raw=(basic.evolved?3:(lvl>=4?2:1))+(basic._pm?.count||0),countBonus=1+0.12*Math.max(0,raw-1);
    const damage=(16+lvl*4)*dm*(aw?1.2:1)*(basic.mutation==='permafrost'?1.15:1)*(.65+(.65+.18*(basic.lv.p_heavydraw||0))*progress)*countBonus*1.35;
    const range=(340+lvl*22)*(aw?1.28:1)*(1+.1*(basic.ranks.chill||0))*(1+(basic._pm?.range||0)),speed=1000;
    const b=this.mintBullet(this.player.x,this.player.y,0xffffff,0.4+lvl*.028);if(!b)return;
    if(this.uniqueCd>0)this.uniqueCd=Math.max(0,this.uniqueCd-.5);   /* v8.1.121 เจ้าของ: Mint สาย Impaler ยิงหอกแต่ละครั้ง = Unique คูลดาวน์ลด 0.5 วิ */
    if(full&&basic.evolved)basic._impalerFullShots=(basic._impalerFullShots||0)+1;
    const giant=full&&basic.evolved&&basic._impalerFullShots%3===0;
    b.setTexture(this.textures.exists('proj_frostlance')?'proj_frostlance':'proj_boomer').setTint(0xcaf3ff);b.faceVel=true;b.dmg=damage*(giant?1.35:1);b.life=range/speed;b.homing=0;
    b.impaler={full,giant,targets:new Set(),hits:0,pierces:(giant?8:2)+(basic.lv.p_coldblood||0),epoch:c.epoch,basic};
    // Larger painted lance is independent of its unchanged projectile collider.
    if(!this.mintOutlineProjectile?.(b,'lance',giant?78:full?58+4*(basic.lv.p_heavydraw||0):42)&&this.textures.exists('proj_frostlance'))this.attachProjectileArt(b,'proj_frostlance',giant?108:full?68+6*(basic.lv.p_heavydraw||0):38);
    this.physics.velocityFromRotation(angle,speed,b.body.velocity);Sfx.bp?.('mint_lance_launch',full?.62:.45,.09)||Sfx.frost();
  }
  tickImpaleMarks(){const S=this._impMarked;if(!S?.size)return;for(const e of S){const n=e.active&&this.basicAttack?.path==='pierce'?this.impaleStacks(e):0,key=n?'bpx_mint_impale'+n:null;let m=e._impMark;
      if(m&&(!m.active||m.texture.key!==key)){if(m.active)m.destroy();m=e._impMark=null;}if(!key){S.delete(e);continue;}
      if(!m&&this.textures.exists(key))m=e._impMark=this.trackArtVfx(this.camWorld(this.add.image(e.x,e.y,key).setScale(.45)));if(m)m.setPosition(e.x,e.y-(e.displayHeight||40)*.35).setDepth(e.y+1);}}
  impaleStacks(e){
    if(this.time.now-(e._mintImpaleAt??-Infinity)>5000)e._mintImpale=0;
    return Math.min(3,e._mintImpale||0);
  }
  applyImpale(e,power,full,ruptureBonus=1){
    if(!full||!e?.active||this.basicAttack?.path!=='pierce'||e._phaseGateLocked||(e._phaseInvuln||0)>0)return;
    const b=this.basicAttack,now=this.time.now,big=e.isBoss||e.isMini||e.isElite,stacks=this.impaleStacks(e);
    e._mintImpaleAt=now;
    if(stacks>=3){
      if(now<(e._mintRuptureAt??-Infinity)+600)return;
      e._mintImpale=0;e._mintRuptureAt=now;
      const rupture=power*(big?1.8:1.2)*(1+.1*(b.lv.p_shatterpt||0)+.08*(b.lv.linger||0))*ruptureBonus;
      this.damage(e,rupture,e.x,e.y);
      const ruptureKey=this.mintOutlineKey?.('bpx_mint_rupture')||'bpx_mint_rupture',ruptureArt=this.bpFx?.(ruptureKey,e.x,e.y,220,{force:true});if(ruptureKey!=='bpx_mint819_bloom'||!ruptureArt)this.mintBurstFx(e.x,e.y,120);this.mintHeavyImpact();Sfx.bp?.('mint_crystal_rupture',.7,.15);
      if(this.floatText)this.floatText(e.x,e.y-28,'CRYSTAL RUPTURE',0xbdf0ff);
    }else{
      e._mintImpale=Math.min(3,stacks+1+(big?(b.lv.p_impaler||0):0));if(e._mintImpale>stacks)Sfx.bp?.('mint_impale_stack',.45,.08,0.94+0.06*e._mintImpale);(this._impMarked||(this._impMarked=new Set())).add(e);
      if(big&&this.floatText)this.floatText(e.x,e.y-28,'IMPALE '+e._mintImpale+'/3',0xbdf0ff);
    }
  }
  hitImpaler(b,e){
    const i=b.impaler;if(!i||i.targets.has(e))return;
    if(i.epoch!==(this._artEpoch||0)||this.basicAttack!==i.basic||i.basic.path!=='pierce'){this.killBullet(b);return;}
    i.targets.add(e);
    if(e._phaseGateLocked||(e._phaseInvuln||0)>0){if(e.isBoss||e.isMini)this.killBullet(b);return;}
    const ranks=i.basic.lv,stacks=this.impaleStacks(e),pen=Math.min(3,i.hits),execute=e.hp/e.maxhp<.30?1+.08*(ranks.p_executioner||0):1;
    const damage=b.dmg*(1+.06*(ranks.p_coldblood||0)*pen)*(1+.06*stacks)*execute;
    this.damage(e,damage,b.x,b.y);if(e.active){this.mintChill(e,i.basic.mutation==='permafrost'?.96:.6);this.applyImpale(e,damage,i.full,i.giant?1.35:1);}
    // Keep previous impact-mutation investment with a bounded, non-marking splash.
    if(i.basic.mutation==='blizzard'){
      let n=0;this.enemies.children.iterate(o=>{if(n>=16||!o||!o.active||o===e||this.dist(o.x,o.y,b.x,b.y)>60)return;n++;this.damage(o,damage*.25,o.x,o.y);});
    }
    if(i.full){const big=e.isBoss||e.isMini||e.isElite;this.mintBurstFx(e.x,e.y,i.giant?74:52);if(big||i.giant)this.mintHeavyImpact();}
    i.hits++;if(i.hits>=i.pierces||e.isBoss||e.isMini)this.killBullet(b);
  }
  castFrostLance(lvl,aw,dm,basic){
    {const ec=basic?.path==='barrage'?(basic.lv?.p_bar_echo||0):0;if(ec&&!this._barEcho&&(this._barEchoN=(this._barEchoN||0)+1)%(ec>=2?3:4)===0)this.artDelay?.(250,()=>{if(this.state!=='play'||this.basicAttack!==basic)return;this._barEcho=true;try{this.castFrostLance(lvl,aw,dm,basic);}finally{this._barEcho=false;}});}   // v7.9.23 Lance Echo
    if(basic?.path==='pierce'){this.castImpalerLance(lvl,aw,dm,basic);return;}
    const evo=basic&&basic.evolved, permafrost=basic?.mutation==='permafrost', blizzard=basic?.mutation==='blizzard';
    const t=this.nearestEnemy(1000);
    const ang=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):((this.moveDir&&(this.moveDir.x||this.moveDir.y))?this.moveDir.angle():(this._lanceAng||0));
    this.poseAttack(360);
    this._lanceAng=ang;
    const dmg=(16+lvl*4)*dm*(aw?1.2:1)*(permafrost?1.15:1);
    const range=(340+lvl*22)*(aw?1.28:1)*(1+(basic?.ranks.chill||0)*0.1)*(1+(basic?._pm?.range||0));
    const volley=mintVolleyProfile(lvl,evo&&basic?.path!=='glacier',basic?._pm?.count||0,basic?.path),lances=volley.count,   // v5.24 เพดาน 4 หอก
      spread=0.16*(1+(basic?.path==='barrage'?0.2*(basic?.lv.p_quickdraw||0):0)), centerL=(lances-1)/2, flightT=range/900;   // Lv1 หอกเดียว · Lv4+ 2 หอก · evo 3 หอก (ยิงตรง ไม่โฮมมิ่ง)
    // Shard Bloom investment stays intact; shared budgets bound Barrage and Glacier maps it to bloom power.
    const shardBase=3+Math.min(3,(basic?.lv.linger||0))+(aw?2:0);   // v4.20: สะเก็ดน้อยลง (เดิม 6+..) ไม่ล้นจอ
    const shardPer=shardBase;   // M4: keep every Shard Bloom rank useful after Evolution; shared budgets bound spawning.
    const hitMul=volley.hitMul??1,shardDmg=dmg*hitMul*0.55*(1+0.12*(basic?.ranks.p_splinter||0))*volley.shardMul*volley.bloomMul, shardFreeze=(0.45+lvl*0.05)*(permafrost?1.7:1), shardFB=permafrost?1.4:1.2;
    // ท่าชาร์จ (ทางภาพ): เรืองแสงหุบเข้าที่ปลายหอกก่อนพุ่ง
    if(!this.heroFx?.(this.mintOutlineKey?.('bpx_mint_lance_charge')||'bpx_mint_lance_charge',this.player.x+Math.cos(ang)*26,this.player.y+Math.sin(ang)*26,70,{depth:this.player.y+2,life:.12,fade:90})){const chg=this.trackArtVfx(this.camWorld(this.add.image(this.player.x+Math.cos(ang)*26,this.player.y+Math.sin(ang)*26,'vfx_glow').setTint(0x9fe8ff).setDepth(this.player.y+2).setScale(0.55).setAlpha(0.9)));
    this.tweens.add({targets:chg,scale:0.12,alpha:0,duration:150,onComplete:()=>chg.destroy()});}
    const launch=()=>{
    if(!this.player?.active||(this.state!=='play'&&this.state!=='levelup'))return;
    const lanceKey=this.textures.exists('proj_frostlance')?'proj_frostlance':'proj_boomer';
    if(basic?.path==='barrage'&&lances>1)this.bpFx?.('bpx_mint_volley',this.player.x+Math.cos(ang)*30,this.player.y+Math.sin(ang)*30,70,{anchor:'center',rotation:ang});   /* v6.77.1: เดิม fan 220px ดูเหมือนตี 3 แฉกไกลเกินจริง → muzzle flash เล็ก */
    for(let L=0;L<lances;L++){ const a=ang+(L-centerL)*spread;
      const st={done:false,hits:0,targets:new Set()};   // แต่ละหอกแตกได้ครั้งเดียว (กระทบเป้า หรือสุดระยะ)
      // หอกวิ่ง — สายเจาะทะลุศัตรูปกติได้ก่อนแตก; บอสแตกทันที
      const b=this.mintBullet(this.player.x,this.player.y,0xffffff,0.5); if(!b)continue; {
        b.setTexture(lanceKey).setTint(0xcaf3ff).setScale(0.4+lvl*0.028); b.faceVel=true; b.dmg=dmg*hitMul; b.life=flightT+0.2; b.hitGapV=0.1; b.homing=0;   // ยิงตรง ไม่ตามเป้า + หอกเล็กลง
        b.iceNeedle={freeze:0.6*(permafrost?1.6:1),frozenBonus:permafrost?1.4:1.2,shatter:blizzard||evo,dmg:dmg*hitMul,lvl};
        this.mintOutlineProjectile?.(b,'lance',72+lvl*3);
        b.shatterState=st; b.shatterInfo={count:shardPer,dmg:shardDmg,freeze:shardFreeze,fb:shardFB,blizzard,lvl,ang:a,pierces:basic?.path==='pierce'?2+(basic.lv.p_coldblood||0):1};
        this.physics.velocityFromRotation(a,900,b.body.velocity); }
      // ถ้าพลาดทุกตัว → แตกที่สุดระยะ (fallback)
      const ex=this.player.x+Math.cos(a)*range, ey=this.player.y+Math.sin(a)*range;
      this.artDelay(flightT*1000,()=>{ if(this.basicAttack!==basic)return; if(!st.done){ st.done=true; this.frostShatterBurst(ex,ey,a,shardPer,shardDmg,shardFreeze,shardFB,blizzard,lvl); } });
    }
    this.hitCratesInRadius(this.player.x,this.player.y,range,dmg); Sfx.bp?.(basic?.path==='barrage'?'mint_barrage_volley':'mint_lance_launch',.5,.09)||Sfx.frost();
    };
    launch();
    if(evo&&basic?.path==='barrage')this.queueHailstorm(lvl,dmg,0.6*(permafrost?1.6:1),basic);
  }
  // แตกสะเก็ดน้ำแข็งที่ปลายหอก: โนวาวาบ + ยิงสะเก็ดกระจาย(เจาะ+แช่)
  // v5.10 Mint: โจมตีปกติไม่แช่ทันทีแล้ว → สะสม ❄ Chill (ช้าลง 30%) · ครบ 4 ชั้น (Permafrost 3) ภายใน 2.5 วิ = แช่แข็ง + ชั้นหาย · บอส/มินิแค่ช้าลงไม่แช่
  applyFrostBurn(e,power,n=1){
    if(this.basicAttack?.path!=='glacier'||!e?.active||e._phaseGateLocked||(e._phaseInvuln||0)>0)return;
    const now=this.time.now;if((e._frostBurnUntil||0)<=now){e._frostBurnStacks=0;e._trem=0;e._shock=0;e._frostBurnPower=0;e._frostBurnTick=0;}
    e._frostBurnStacks=Math.min(5,(e._frostBurnStacks||0)+n);e._frostBurnUntil=now+8000;e._frostBurnPower=Math.max(e._frostBurnPower||0,power*.08);e._frostBurnTick=e._frostBurnTick||0;
    this.floatText?.(e.x,e.y-38,'FROSTBITE ×'+e._frostBurnStacks,0x99eaff);
  }
  tickFrostBurn(e,dt){
    if(!e._frostBurnStacks)return;if(this.time.now>=e._frostBurnUntil){e._frostBurnStacks=0;e._trem=0;e._shock=0;e._frostBurnPower=0;e._frostBurnTick=0;return;}
    e._frostBurnTick+=dt;if(e._frostBurnTick<.5)return;e._frostBurnTick%=.5;
    if(e._phaseGateLocked||(e._phaseInvuln||0)>0)return;
    const oldInf=this._infTick,oldFr=this._frDmg,oldBusy=this._frBusy;this._infTick=true;this._frDmg=true;this._frBusy=true;
    try{this.damage(e,e._frostBurnPower*e._frostBurnStacks*.5,e.x,e.y);}finally{this._infTick=oldInf;this._frDmg=oldFr;this._frBusy=oldBusy;}
  }
  glacierBrittle(e){
    return this.basicAttack?.character==='mint'&&this.basicAttack.path==='glacier'&&(e._glacierBrittleUntil||0)>this.time.now;
  }
  glacierPrimed(e){ return !!(e&&e.active&&(e.frozen>0||this.glacierBrittle(e))); }
  glacierHitPower(){
    const b=this.basicAttack,p=this.player,lvl=this.skills.frost||1;
    const inf=b.infusion?(FLAVOR_INFUSIONS.find(f=>f.id===b.infusion)||{direct:1}).direct:1;
    return (16+lvl*4)*(p.dmgMul||1)*(p.weaponDmgMul||1)*(BALANCE.skillPower.frost||1)*(1+0.12*(b.ranks.power||0)+0.05*(b.ranks.overdrive||0))*(b._pm?.dmg||1)*inf;
  }
  glacierFrostHit(e){
    if(this._glacierBusy||!this.glacierPrimed(e)||e._phaseGateLocked||(e._phaseInvuln||0)>0)return;
    const now=this.time.now;
    if(now-(e._glacierFrostAt??-Infinity)>3000)e._glacierFrost=0;
    e._glacierFrostAt=now;
    if((e._glacierFrost||0)>=3){this.glacierShatter(e);return;}
    e._glacierFrost=Math.min(3,(e._glacierFrost||0)+1+(this.basicAttack.lv.p_froststack||0));
  }
  glacierEcho(e,freeze){
    const rank=this.basicAttack.lv.p_coldsnap||0;if(!rank)return;
    const r=90*(1+0.2*rank);let n=0;
    this.enemies.children.iterate(o=>{if(n>=24||!o||!o.active||o===e||this.dist(o.x,o.y,e.x,e.y)>r)return;n++;this.mintChill(o,freeze,true);});
    this.vfxHitRing(e.x,e.y,0x9fe8ff,false);
  }
  mintChill(e,freeze,echo=false){
    if(!e||!e.active)return;const now=this.time.now,b=this.basicAttack,glacier=b?.character==='mint'&&b.path==='glacier';
    if(glacier&&(e._phaseGateLocked||(e._phaseInvuln||0)>0))return;
    const primed=glacier&&this.glacierPrimed(e);
    if(e._chillAt==null||now-e._chillAt>2500)e._chill=0;
    e._chillAt=now;e._chill=(e._chill||0)+1;
    const _PT=(this.player&&this.player._pt)||{},need=Math.max(1,(freeze>=0.9?3:4)-(_PT.azero?1:0));
    const immune=e.isBoss||e.isMini||(glacier&&e.freezeImmune);
    if(immune){
      e._chill=Math.min(e._chill,need);
      if(glacier&&e._chill>=need){const fresh=!this.glacierBrittle(e);e._glacierBrittleUntil=now+3000;
        if(fresh&&!echo){this.glacierEcho(e,freeze);if(this.floatText)this.floatText(e.x,e.y-26,'BRITTLE',0xbdf0ff);}}
      if(primed&&!echo)this.glacierFrostHit(e);
      return;
    }
    if(e._chill>=need){e._chill=0;e.frozen=Math.max(e.frozen||0,freeze+0.5);e.setVelocity(e.body.velocity.x*0.2,e.body.velocity.y*0.2);e.setTint(COLORS.ice);
      if(!echo){this.ptOnFreeze(e);if(glacier&&e.active)this.glacierEcho(e,freeze);}
      if(e.active&&!this.mintFreezeFx?.(e)){this.burst(e.x,e.y,0xbdf0ff);if(this.floatText)this.floatText(e.x,e.y-26,'FROZEN',0xbdf0ff);}}
    else{e.setVelocity(e.body.velocity.x*0.7,e.body.velocity.y*0.7);if(!echo&&now-(e._chillFxAt??-1e9)>450&&this.heroFxThrottle?.('chill',5,100)){e._chillFxAt=now;this.heroFx?.(this.mintOutlineKey?.('bpx_mint_chill_hit')||'bpx_mint_chill_hit',e.x,e.y,Math.max(56,(e.body?.halfWidth||18)*2.6),{alpha:.85,depth:e.depth+1});}}
    if(primed&&!echo&&e.active)this.glacierFrostHit(e);
  }
  glacierShatter(root){
    if(this._glacierBusy||!this.glacierPrimed(root)||(this.state!=='play'&&this.state!=='levelup'))return;
    const now=this.time.now;
    if(now<(root._glacierBurstAt??-Infinity)+450||root._phaseGateLocked||(root._phaseInvuln||0)>0)return;
    if(this._glacierWindow==null||now-this._glacierWindow>=200){this._glacierWindow=now;this._glacierBursts=0;this._glacierVfx=0;}
    if(this._glacierBursts>=6)return;Sfx.bp?.('mint_glacier_shatter',.42,.12);
    const b=this.basicAttack,power=this.glacierHitPower(),chain=Math.min(3,(b.lv.p_chainshatter||0)+(b.evolved?1:0)),queue=[{e:root,depth:0}],seen=new Set();
    this._glacierBusy=true;
    try{
      while(queue.length&&seen.size<6&&this._glacierBursts<6&&(this.state==='play'||this.state==='levelup')){
        const {e,depth}=queue.shift();if(seen.has(e)||!this.glacierPrimed(e)||e._phaseGateLocked||(e._phaseInvuln||0)>0||now<(e._glacierBurstAt??-Infinity)+450)continue;
        seen.add(e);this._glacierBursts++;e._glacierBurstAt=now;e._glacierFrost=0;e._glacierFrostAt=now;
        const x=e.x,y=e.y,r=110*(b.evolved&&depth===0?1.65:1),immune=e.isBoss||e.isMini||e.freezeImmune;
        // Fixed attack scaling; normal damage() owns gear/crit/phase gates. No max-HP damage.
        this.damage(e,power*(immune?1.8:1.4),x,y);
        if(this._glacierVfx<3){this._glacierVfx++;this.mintBurstFx(x,y,r);}
        let targets=0;
        this.enemies.children.iterate(o=>{
          if(targets>=24||!o||!o.active||o===e||seen.has(o)||this.dist(o.x,o.y,x,y)>r)return;targets++;
          this.damage(o,power*0.55,o.x,o.y);if(!o.active||!chain||o._phaseGateLocked||(o._phaseInvuln||0)>0)return;
          this.mintChill(o,0.6,true);if(!o.active)return;
          if(now-(o._glacierFrostAt??-Infinity)>3000)o._glacierFrost=0;
          o._glacierFrost=Math.min(3,(o._glacierFrost||0)+1);o._glacierFrostAt=now;
          if(depth<chain&&o._glacierFrost>=3&&this.glacierPrimed(o))queue.push({e:o,depth:depth+1});
        });
      }
    } finally {this._glacierBusy=false;}
  }
  frostShatterBurst(x,y,baseAng,count,sdmg,freeze,fb,blizzard,lvl){
    if(this.state!=='play'&&this.state!=='levelup')return;
    const glacier=this.basicAttack?.path==='glacier',now=this.time.now;
    if(this._mintShardWindow==null||now-this._mintShardWindow>=200){this._mintShardWindow=now;this._mintShardCount=0;}
    const shardCount=glacier?0:Math.min(6,Math.max(0,count),Math.max(0,12-(this._mintShardCount||0)));
    // Planned count above six retains value in power; scene saturation never removes the bloom.
    const power=sdmg*(glacier?1+.08*Math.max(0,count-3):1+.12*Math.max(0,count-6));
    const bar=this.basicAttack?.path==='barrage'?this.basicAttack.lv||{}:{},noBloom=!this.basicAttack?.path||this.basicAttack.path==='barrage',bloomR=noBloom?0:(118+lvl*8+(blizzard?40:0));   /* v8.1.99 เจ้าของ: เลเวล 1 (ยังไม่เลือกบิลด์) + Barrage = ไม่มีระเบิดวงกว้าง เหลือแค่ shard · บิลด์อื่นระเบิดเหมือนเดิม */ if(!noBloom)this.mintBurstFx(x,y,bloomR);
    let hits=0;if(!noBloom)this.enemies.children.iterate(e=>{if(hits>=24||!e?.active||this.dist(e.x,e.y,x,y)>bloomR)return;hits++;
      this.damage(e,power*(this.basicAttack?.path==='barrage'?1.3:1.6)*((e.isBoss||e.isMini)?0.6:1),e.x,e.y);   // v8.0.0 Barrage bloom 1.6→1.3 (owner nerf)
      if(e.active)this.mintChill(e,freeze*1.2);
    });
    if(bar.p_bar_chain&&!this._barChain&&Math.random()<.25*bar.p_bar_chain){let t=null,td=220;this.enemies.children.iterate(o=>{if(o&&o.active&&o.hp>0){const d=this.dist(o.x,o.y,x,y);if(d>40&&d<td){td=d;t=o;}}});if(t){const tx=t.x,ty=t.y;this.time.delayedCall(150,()=>{if(this.state!=='play')return;this._barChain=true;try{this.frostShatterBurst(tx,ty,baseAng,count,sdmg*.6,freeze,fb,blizzard,lvl);}finally{this._barChain=false;}});}}   // v7.9.23 Shard Chain
    const arc=Math.PI*1.6;
    for(let i=0;i<shardCount;i++){
      const a=baseAng+(i/(shardCount-1||1)-.5)*arc+Phaser.Math.FloatBetween(-.06,.06),b=this.mintBullet(x,y,0xffffff,.28);if(!b)break;
      this._mintShardCount++;
      b.setTexture('proj_sprinkle').setTint(0xcaf3ff);if(!this.mintOutlineProjectile?.(b,'shard',40))this.attachProjectileArt(b,'proj_mint_shard',24,.67,.5);
      b.faceVel=true;b.dmg=power;b.life=.5*(1+.2*(bar.p_bar_wide||0));b.pierce=true;b.hitGapV=.1;b.homing=0;
      b.iceNeedle={freeze,frozenBonus:fb,shatter:blizzard,dmg:power,lvl};
      this.physics.velocityFromRotation(a,760+Math.random()*140,b.body.velocity);
    }
    this.hitCratesInRadius(x,y,bloomR,power);
  }
  // ประมวลผลIce Torrent: ทุก 0.4s ทำ DoT + ชะลอ (frozen สั้น ๆ เป็นจังหวะ = สโลว์) ให้ศัตรูในปล้อง แล้วค่อย ๆ จาง
  tickFrostStreams(dt){
    if(!this._frostStreams||!this._frostStreams.length)return;
    for(let i=this._frostStreams.length-1;i>=0;i--){ const st=this._frostStreams[i];
      st.life-=dt; st.tick-=dt;
      if(st.img&&st.img.active)st.img.setAlpha(0.30*Math.max(0,st.life/st.max)+0.05);
      if(st.tick<=0){ st.tick=0.4; const r2=st.r*st.r;
        this.enemies.children.iterate(e=>{ if(!e||!e.active)return; if((e.x-st.x)**2+(e.y-st.y)**2>r2)return;
          this.damage(e,st.dmg*((e.isBoss||e.isMini)?1.25:1),e.x,e.y);
          if(!e.isBoss&&!e.isMini){ e.frozen=Math.max(e.frozen||0,st.slow); e.setTint(COLORS.ice);
            if(st.shatter&&(e.frozen||0)>0&&Math.random()<0.2){ this.burst(e.x,e.y,0x8fd0ff); this.damage(e,st.dmg*0.7,e.x,e.y); } } }); }
      if(st.life<=0){ if(st.img&&st.img.active)st.img.destroy(); this._frostStreams.splice(i,1); }
    }
  }
  castMirrorGlaze(lvl,aw,dm,basic){
    const wm=this.signatureWeaponInfo().skill==='mirror'?(this.player.weaponAreaMul||1):1,wr=this.signatureWeaponInfo().skill==='mirror'?(this.player.weaponReflect||0):0;
    // Basic Attack ของงาดำ (Oath Mirror Field): radius=รัศมี · pane=จำนวนสะท้อน · fortress/retaliate=สายกลายรูป
    const bRad=(1+(basic?.ranks.radius||0)*0.12)*(basic?.mutation==='fortress'?1.25:1);
    const bPane=(basic?.ranks.pane||0)*2, bDur=basic?.mutation==='fortress'?1.3:1, bPierce=basic?.mutation==='retaliate', bDmgMut=basic?.mutation==='retaliate'?1.3:1;
    const mEvo=basic&&basic.evolved;   // EVO (Absolute Oath Mirror): กระจกยิงลำแสงสวนเองทุกจังหวะ (ไม่ต้องWaitโดนกระสุน) + วง/สะท้อนมากขึ้น
    const r=(125+lvl*15)*(this.player.mirrorWard?1.22:1)*(aw?1.2:1)*wm*bRad*(mEvo?1.2:1),duration=(1.15+lvl*0.14+(aw?0.8:0))*1000*bDur*(mEvo?1.35:1),max=3+lvl+(aw?5:0)+(this.player.mirrorWard?3:0)+wr+bPane+(mEvo?6:0);
    // Mirror Glaze ต้องอ่านเป็นเกราะสะท้อน ไม่ใช่อัลติ: วงบาง ค่อย ๆ หายใจ และNoneสายฟ้าซ้อนสนาม
    const ring=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_magic_circle').setTint(0x9fe8ff).setDepth(5).setDisplaySize(r*2,r*2).setAlpha(0.42));
    this.tweens.add({targets:ring,rotation:Math.PI*0.55,scaleX:ring.scaleX*1.035,scaleY:ring.scaleY*1.035,alpha:{from:0.20,to:0.32},yoyo:true,duration:Math.max(360,duration*0.48),repeat:1});let reflected=0;
    let evoTick=0;
    const pulse=this.time.addEvent({delay:120,loop:true,callback:()=>{if(!ring.active)return;ring.setPosition(this.player.x,this.player.y);
      if(mEvo&&(evoTick++%3===0)){const t=this.nearestEnemy(760),b=this.getBullet(this.player.x,this.player.y,0xffffff,0.2);if(b){b.setTexture('proj_sprinkle').setTint(0x9fe8ff);b.dmg=(9+lvl*2.6)*dm;b.life=2;b.homing=520;b.pierce=true;b.faceVel=true;const a=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):Math.random()*Math.PI*2;this.physics.velocityFromRotation(a,440,b.body.velocity);}}
      this.foeBullets.children.iterate(f=>{if(!f||!f.active||reflected>=max||this.dist(f.x,f.y,this.player.x,this.player.y)>r)return;
        const x=f.x,y=f.y;this.killFoe(f);const b=this.getBullet(x,y,0xffffff,0.18);if(!b)return;b.setTexture('proj_sprinkle').setTint(0x9fe8ff);b.dmg=(8+lvl*2.4)*dm*bDmgMut;b.life=2;b.homing=aw?520:360;b.pierce=aw||bPierce;b.faceVel=true;
        const t=this.nearestEnemy(800),a=t?Math.atan2(t.y-y,t.x-x):Math.random()*Math.PI*2;this.physics.velocityFromRotation(a,420,b.body.velocity);this.vfxHitRing(x,y,0x9fe8ff,false);reflected++;});
    }});
    if(aw)for(let i=0;i<3;i++){const a=i*Math.PI*2/3,b=this.getBullet(this.player.x,this.player.y,0xffffff,0.17);if(!b)continue;b.setTexture('proj_sprinkle').setTint(0x9fe8ff);b.dmg=(8+lvl*2.4)*dm;b.life=2;b.homing=480;b.pierce=true;b.faceVel=true;this.physics.velocityFromRotation(a,390,b.body.velocity);}
    this.time.delayedCall(duration,()=>{pulse.remove(false);if(ring.active)this.tweens.add({targets:ring,alpha:0,duration:180,onComplete:()=>ring.destroy()});});Sfx.zap();
  }
  castMemoryJam(lvl,aw,dm){
    const count=aw?3:(lvl>=4?2:1),cand=[];this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<700)cand.push(e);});
    cand.sort((a,b)=>b.hp-a.hp);for(let i=0;i<Math.min(count,cand.length);i++){const e=cand[i],token=Symbol('memory');e._memoryToken=token;e._memoryStored=0;e._memoryRatio=(0.35+lvl*0.06)*(1+(this.player.memoryAmp||0))*(aw?1.3:1);e._memoryRadius=(75+lvl*9)*(aw?1.25:1);
      const mark=this.camWorld(this.add.image(e.x,e.y,'ic_memory').setDepth(90002).setScale(0.20).setAlpha(0.84));e._memoryMarkObj=mark;mark._follow=e;
      this.tweens.add({targets:mark,rotation:Math.PI*2,scale:{from:0.17,to:0.25},alpha:{from:0.62,to:0.94},yoyo:true,duration:520,repeat:-1,ease:'Sine.inOut'});
      this.time.delayedCall((1.8+lvl*0.18)*1000,()=>{if(mark.active){this.tweens.killTweensOf(mark);mark.destroy();}if(e._memoryToken===token)this.resolveMemoryMark(e);});
    } Sfx.clear();
  }
  resolveMemoryMark(marked){
    if(!marked||!marked._memoryToken)return;const stored=marked._memoryStored||0,ratio=marked._memoryRatio||0,r=marked._memoryRadius||80,x=marked.x,y=marked.y;
    marked._memoryToken=null;marked._memoryStored=0;if(marked._memoryMarkObj&&marked._memoryMarkObj.active){this.tweens.killTweensOf(marked._memoryMarkObj);marked._memoryMarkObj.destroy();}marked._memoryMarkObj=null;if(stored<=0)return;this.burst(x,y,0xd59cff);
    this.enemies.children.iterate(e=>{if(e&&e.active&&(e!==marked||marked.hp>0)&&this.dist(e.x,e.y,x,y)<r)this.damage(e,stored*ratio,e.x,e.y);});
  }
  castFlavorThread(lvl,aw,dm){
    const count=aw?7:(3+Math.floor(lvl/2)),cand=[];this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<620)cand.push(e);});
    cand.sort((a,b)=>this.dist(a.x,a.y,this.player.x,this.player.y)-this.dist(b.x,b.y,this.player.x,this.player.y));const linked=cand.slice(0,count);if(linked.length<2)return;
    const cx=linked.reduce((s,e)=>s+e.x,0)/linked.length,cy=linked.reduce((s,e)=>s+e.y,0)/linked.length,ticks=aw?6:4,dmg=(4+lvl*1.8)*dm;
    const knot=this.camWorld(this.add.image(cx,cy,'ic_thread').setDepth(90001).setScale(0.13).setAlpha(0.78));
    this.tweens.add({targets:knot,rotation:Math.PI*2,scale:{from:0.10,to:0.18},alpha:{from:0.48,to:0.86},duration:ticks*90,yoyo:true,repeat:1,ease:'Sine.inOut',onComplete:()=>knot.destroy()});
    for(let n=0;n<ticks;n++)this.time.delayedCall(n*180,()=>{for(let i=0;i<linked.length;i++){const a=linked[i],b=linked[(i+1)%linked.length];if(a.active&&b.active)this.chainBolt(a.x,a.y,b.x,b.y);}linked.forEach(e=>{if(!e.active)return;this.damage(e,dmg,e.x,e.y);if(!e.isBoss&&!e.isMini){const a=Math.atan2(cy-e.y,cx-e.x);e.setVelocity(Math.cos(a)*150,Math.sin(a)*150);e.knock=0.10;}});});Sfx.zap();
  }
  castCoreDecoy(lvl,aw,dm){
    const dir=this.moveDir&&this.moveDir.lengthSq()>0.04?this.moveDir:new Phaser.Math.Vector2(1,0),x=this.player.x+dir.x*105,y=this.player.y+dir.y*105,dur=2.2+lvl*0.25+(aw?1.2:0),r=(95+lvl*11)*(aw?1.25:1),dmg=(12+lvl*3.2)*dm*(aw?1.3:1);
    const core=this.camWorld(this.add.image(x,y,'ic_decoy').setDepth(90000).setScale(0.42).setAlpha(0.95));this.tweens.add({targets:core,scale:{from:0.34,to:0.48},rotation:{from:-0.08,to:0.08},yoyo:true,repeat:-1,duration:300});
    const lure=this.time.addEvent({delay:460,loop:true,callback:()=>{if(!core.active)return;const wave=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0x8fe8d0).setDepth(4).setScale(0.10).setAlpha(0.34));this.tweens.add({targets:wave,scale:(r*1.55)/256,alpha:0,duration:420,ease:'Quad.out',onComplete:()=>wave.destroy()});}});
    this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r*3){e._decoyT=dur;e._decoyX=x;e._decoyY=y;}});
    this.time.delayedCall(dur*1000,()=>{lure.remove(false);this.tweens.killTweensOf(core);core.destroy();this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.damage(e,dmg,e.x,e.y);});this.burst(x,y,0x8fe8d0);if(aw)this.time.delayedCall(220,()=>{this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r*1.25)this.damage(e,dmg*0.7,e.x,e.y);});});if(aw)this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.04);Sfx.boom();});
  }
  castTriadSeal(lvl,aw,dm){
    if(!this._triSeals)this._triSeals=[];const t=this.nearestEnemy(640),x=t?t.x:this.player.x+Phaser.Math.Between(-170,170),y=t?t.y:this.player.y+Phaser.Math.Between(-170,170);
    const seal=this.camWorld(this.add.image(x,y,'ic_triseal').setDepth(3).setScale(0.30).setAlpha(0.82));this.tweens.add({targets:seal,rotation:Math.PI*2,scale:{from:0.25,to:0.34},alpha:{from:0.58,to:0.90},duration:760,yoyo:true,repeat:-1,ease:'Sine.inOut'});this._triSeals.push({x,y,obj:seal});if(this._triSeals.length<3)return;
    const pts=this._triSeals.splice(0,3),cx=pts.reduce((s,p)=>s+p.x,0)/3,cy=pts.reduce((s,p)=>s+p.y,0)/3,r=(125+lvl*14)*(aw?1.25:1),dmg=(18+lvl*4)*dm*(aw?1.32:1);
    for(let i=0;i<3;i++)this.chainBolt(pts[i].x,pts[i].y,pts[(i+1)%3].x,pts[(i+1)%3].y);const core=this.camWorld(this.add.image(cx,cy,'ic_triseal').setDepth(5).setScale(0.10).setAlpha(0.84));this.tweens.add({targets:core,rotation:-Math.PI,scale:(r*1.15)/128,alpha:0,duration:360,ease:'Quad.out',onComplete:()=>core.destroy()});pts.forEach(p=>{if(p.obj.active){this.tweens.killTweensOf(p.obj);this.tweens.add({targets:p.obj,scale:0.05,alpha:0,duration:240,onComplete:()=>p.obj.destroy()});}});
    if(lvl>=3||aw){const lineHit=new Set();this.enemies.children.iterate(e=>{if(!e||!e.active)return;for(let i=0;i<3;i++){const a=pts[i],b=pts[(i+1)%3],vx=b.x-a.x,vy=b.y-a.y,l2=vx*vx+vy*vy,q=Phaser.Math.Clamp(((e.x-a.x)*vx+(e.y-a.y)*vy)/(l2||1),0,1),d=this.dist(e.x,e.y,a.x+q*vx,a.y+q*vy);if(d<28+(aw?18:0)){lineHit.add(e);break;}}});lineHit.forEach(e=>this.damage(e,dmg*0.55,e.x,e.y));}
    const blast=()=>{this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r)this.damage(e,dmg,e.x,e.y);});this.burst(cx,cy,0xffd166);Sfx.boom();};blast();if(aw)this.time.delayedCall(300,blast);
  }
  castEchoStep(lvl,aw,dm){
    const count=(aw?7:3+Math.floor(lvl/2))+(this.player.echoPath?2:0),trail=(this._echoTrail||[]).slice(-count*3),dmg=(7+lvl*2.1)*dm*(aw?1.28:1),r=(48+lvl*5)*(this.player.echoPath?1.22:1);
    const pts=[];for(let i=0;i<count;i++){const p=trail[Math.max(0,trail.length-1-i*3)]||{x:this.player.x-this.moveDir.x*i*28,y:this.player.y-this.moveDir.y*i*28};pts.push(p);}
    pts.reverse().forEach((p,i)=>this.time.delayedCall(i*90,()=>{const burst=mult=>{const foot=this.camWorld(this.add.image(p.x,p.y,'sakura_petal').setTint(0xbca7ff).setDepth(4).setScale(0.7).setAlpha(0.8));this.tweens.add({targets:foot,scale:1.8,alpha:0,duration:300,onComplete:()=>foot.destroy()});this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,p.x,p.y)<r)this.damage(e,dmg*mult,e.x,e.y);});};burst(1);if(aw)this.time.delayedCall(180,()=>burst(0.65));}));
    if(aw){this.player.baseSpeed*=1.10;this.time.delayedCall(900,()=>{this.player.baseSpeed/=1.10;});}Sfx.shoot();
  }
  // Cupcake Sentry: ป้อมชั่วคราว ยิงหาเป้าหมายจากPositionป้อม และระเบิดเมื่อหมดเวลา
  deployCupcakeSentry(x,y,lvl,aw,dmg,r,delay=0){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const s=this.camWorld(this.add.image(x,y,'proj_mine').setDepth(3).setScale(0.40)); s._dead=false;
      this.tweens.add({targets:s,scale:{from:0.36,to:0.45},yoyo:true,repeat:-1,duration:320});
      const duration=(3.8+lvl*0.42+(aw?1.8:0))*1000, rate=Math.max(300,720-lvl*65-(aw?110:0));
      const gun=this.time.addEvent({delay:rate,loop:true,callback:()=>{ if(s._dead||(this.state!=='play'&&this.state!=='levelup'))return;
        let t=null,bd=(420+lvl*35)**2; this.enemies.children.iterate(e=>{ if(e&&e.active){const d=(e.x-x)**2+(e.y-y)**2;if(d<bd){bd=d;t=e;}}});
        if(!t)return; const shots=aw?2:1,base=Math.atan2(t.y-y,t.x-x);
        for(let i=0;i<shots;i++){const b=this.getBullet(x,y-8,0xffffff,0.22);if(!b)continue;
          b.setTexture('proj_sprinkle').setTint(i?0xffd166:0xff8fb5);b.dmg=dmg;b.life=1.8;b.pierce=lvl>=5;b.faceVel=true;
          this.physics.velocityFromRotation(base+(i-(shots-1)/2)*0.13,460,b.body.velocity);}
        s.setRotation(-0.08);this.tweens.add({targets:s,rotation:0,duration:120,ease:'Back.out'});Sfx.shoot();
      }});
      this.time.delayedCall(duration,()=>{ if(s._dead)return;s._dead=true;gun.remove(false);this.tweens.killTweensOf(s);s.destroy();
        if(this.state!=='play'&&this.state!=='levelup')return;
        if(this.anims.exists('fx_mine'))this.spawnFxAnim('fx_mine',x,y,{scale:(2*r)/ASSET_FX.fx_mine.fw,depth:5,anchor:'center'});
        this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.damage(e,dmg*2.2,e.x,e.y);});
        this.hitCratesInRadius(x,y,r,dmg*2.2);Sfx.boom();
      });
    });
  }
  // เล่น VFX flipbook (sprite animation) timesเดียวแล้วทำลาย · additive blend (พื้นดำหาย + เรืองแสง)
  spawnFxAnim(key,x,y,o={}){
    if(!this.textures.exists(key))return null;
    if(!this.anims.exists(key)){ const fd=ASSET_FX[key]||CODE_FX[key]; if(!fd)return null; this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:fd.frames-1}),frameRate:fd.rate,repeat:fd.loop?-1:0}); }   // v6.45 FX มาหลังเริ่มด่าน: สร้าง anim ตอนใช้ครั้งแรก
    if(!o.force&&!this.fxOk())return null;
    const fx=ASSET_FX[key]||CODE_FX[key]||{}; const s=this.camWorld(this.add.sprite(x,y,key,0));
    s.setDepth(o.depth!=null?o.depth:7); s.setBlendMode(o.normal?Phaser.BlendModes.NORMAL:Phaser.BlendModes.ADD);   // ชีต VFX ใช้พื้นดำ: ADD เป็นค่าเริ่มต้นเพื่อไม่ให้เกิดกล่องดำบน WebGL/Android
    const ax=o.anchor||fx.anchor||'center'; s.setOrigin(ax==='left'?0:0.5, ax==='bottom'?1:0.5);
    if(o.rotation!=null)s.setRotation(o.rotation);
    s.setScale(o.scaleX!=null?o.scaleX:(o.scale!=null?o.scale:1), o.scaleY!=null?o.scaleY:(o.scale!=null?o.scale:1));
    if(o.alpha!=null)s.setAlpha(o.alpha);if(this.combatFxAlpha)s.setAlpha(this.combatFxAlpha(key,s.displayWidth,s.alpha));
    if(o.tint!=null)s.setTint(o.tint);
    s.play(key); s.once('animationcomplete',()=>s.destroy()); return s;
  }
  // ออร่าถาวร: สร้าง sprite วนลูปติดตัว (ครั้งเดียว)
  ensureAuraFx(){
    const lvl=this.skills&&this.skills.aura||1,aw=lvl>=SKILL_AWAKEN_LV,want=aw?12:7;
    if(!this._auraFx&&this.textures.exists('fx_aura')&&this.anims.exists('fx_aura')){
      const s=this.camWorld(this.add.sprite(this.player.x,this.player.y,'fx_aura',0));
      s.setDepth(2).setBlendMode(Phaser.BlendModes.ADD).setOrigin(0.5);s.play('fx_aura');this._auraFx=s;
    }
    if(!this._auraPetals)this._auraPetals=[];
    if(this._auraPetals.length!==want){this._auraPetals.forEach(p=>p.destroy());this._auraPetals=[];
      for(let i=0;i<want;i++){const p=this.camWorld(this.add.image(this.player.x,this.player.y,'sakura_petal').setDepth(4).setScale(0.52).setAlpha(0.9));p._petalIndex=i;this._auraPetals.push(p);}}
  }
  clearAuraFx(){if(this._auraFx){this._auraFx.destroy();this._auraFx=null;}if(this._auraPetals){this._auraPetals.forEach(p=>p.destroy());this._auraPetals=[];}}
  sakuraBloom(target,lvl,aw){
    if(!target||!target.active)return;const x=target.x,y=target.y,r=(54+lvl*5)*(aw?1.3:1),dmg=(7+lvl*2.1)*this.player.dmgMul*(BALANCE.skillPower.aura||1);
    const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xff79b8).setDepth(5).setScale(0.12).setAlpha(0.9));
    this.tweens.add({targets:ring,scale:(r*2)/256,alpha:0,duration:360,ease:'Quad.out',onComplete:()=>ring.destroy()});
    for(let i=0;i<6;i++){const a=i*Math.PI/3,p=this.camWorld(this.add.image(x,y,'sakura_petal').setDepth(6).setRotation(a).setScale(0.5));this.tweens.add({targets:p,x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,rotation:a+2,alpha:0,duration:330,onComplete:()=>p.destroy()});}
    this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r){this.damage(e,dmg,e.x,e.y);if(lvl>=4)this.applyFreeze(e,0.16,false);}});
    if(aw&&this.player.hp<this.player.maxhp&&(this._sakuraHealCd||0)<=0){this.player.hp=Math.min(this.player.maxhp,this.player.hp+1.5);this._sakuraHealCd=1.8;this.popHeal(this.player.x,this.player.y,2);}
  }
  // Sakura Aura: กลีบอ่านระยะได้ + สะสม Bloom แทนการเผาดาเมจฟรีทุกเฟรม
  // ---- Signature aura ประจำตัว (rework Mint + งาดำ ให้แข็งแรงขึ้น มี DPS always-on) ----
  clearCharSignature(){this.clearSesRune?.();this._toxicSfxAt=-Infinity;this._uniqueRankSfxAt=-Infinity; if(this._frostStreams){this._frostStreams.forEach(s=>s&&s.img&&s.img.destroy());this._frostStreams=null;} if(this._mintOrbs){this._mintOrbs.forEach(o=>o&&o.destroy());this._mintOrbs=null;} if(this._mintField){this._mintField.destroy();this._mintField=null;} if(this._sesField){this._sesField.destroy();this._sesField=null;} if(this._sesShards){this._sesShards.forEach(s=>s&&s.destroy());this._sesShards=null;} this.clearSesMirrors(); }
  tickCharSignature(dt){
    const ch=this.character;
    // ❄️ Mint — Frost Lance เป็น Basic Attack แล้ว (ยิงเป็นจังหวะใน castSkill) · signature นี้แค่ดูแล "Ice Torrent" ที่หอกทิ้งไว้
    this.tickFrostStreams(dt);
    if(ch!=='mint'&&this._frostStreams&&this._frostStreams.length){ this._frostStreams.forEach(s=>s.img&&s.img.active&&s.img.destroy()); this._frostStreams=null; }
    // 🪞 งาดำ — วงเวทกระจกถาวรWaitบตัว (aura ไม่หาย): ทำดาเมจศัตรูในเขต + ลบกระสุนศัตรูที่เข้าเขต (ward) · Noneจรวด/ไม่ยิง projectile
    if(ch==='sesame'){
      if(this.isSesRune()){this.tickSesRune(dt);return;}
      // เอาวงแหวน/field ออกแล้ว (v4.20) — เหลือแค่ Focus: ยืนนิ่งชาร์จ → Mirror Beam แรง+กว้างขึ้น · ขยับ = Focus สลาย
      this.tickSesMirrors(dt);   // v7.9.40 Focus แบบยืนนิ่งเลิกใช้ → Oath Focus = +6%/กระจก (ใน damage())
      if(this._sesField){ this._sesField.destroy(); this._sesField=null; }
    } else { if(this._sesField){ this._sesField.destroy(); this._sesField=null; } if(this._sesMirrors&&this._sesMirrors.length)this.clearSesMirrors(); }
  }
  // 🪞 v7.9.40 Sesame Mirror Network (docs/SESAME_MIRROR_NETWORK.md) — Dash วางกระจก · Mirror Beam เด้งผ่านกระจกเก่า→ใหม่ แล้วออกไปหาศัตรู
  // Rune Invoker prototype: run-owned state, no timers or save migration.
  isSesRune(){return this.character==='sesame'&&!!this._sesRuneMode;}
  sesRuneEnsure(){
    if(!this.isSesRune()||!this.player||!this.basicAttack)return null;
    if(!this._sesRuneShutdownHook&&this.events?.once){this._sesRuneShutdownHook=true;this.events.once('shutdown',()=>{this.clearSesRune();this._sesRuneShutdownHook=false;});}
    if(this._sesRune&&(this._sesRune.player!==this.player||this._sesRune.basic!==this.basicAttack))this.clearSesRune();
    if(!this._sesRune)this._sesRune={player:this.player,basic:this.basicAttack,orbs:['p','p','p'],cooldowns:{},cdMax:{},inputCd:0,castLock:0,phase:0,actors:[],flares:[],echoes:[],fx:[],orbSprites:[],g:this.camWorld(this.add.graphics().setDepth(this.player.y+4))};return this._sesRune;
  }
  sesRuneRecipe(){return sesRuneRecipe(this._sesRune?.orbs||['p','p','p']);}
  sesRuneStats(){const v=sesRuneBonuses(this._sesRune?.orbs||['p','p','p'],this.basicAttack?.ranks||{}),s=this._sesRune;v.basicDamage=s?.empowerT>0?1.15:1;v.attackRate*=s?.empowerT>0?1.3:1;if(s?.tideT>0)v.regen+=.005;if(s?.hasteT>0&&!(s.mistT>0))v.speed*=1.3;return v;}
  sesRuneGuardMul(){const s=this._sesRune;return s?1-Math.max(s.guardT>0?s.guard||0:0,s.mistT>0?.35:0):1;}
  sesRuneCommitCooldown(){const s=this._sesRune;if(s?.projectKey&&Number.isFinite(this.uniqueCd)&&this.uniqueCd!==s.projectValue)s.cooldowns[s.projectKey]=Math.max(0,Math.min(s.cooldowns[s.projectKey]||0,this.uniqueCd));}
  sesRuneProjectCooldown(){const s=this._sesRune;if(!s)return;const key=this.sesRuneRecipe().key;s.projectKey=key;this.uniqueCd=s.projectValue=s.cooldowns[key]||0;}
  sesRuneCooldownTick(dt){const s=this.sesRuneEnsure();if(!s)return;this.sesRuneCommitCooldown();for(const key in s.cooldowns)s.cooldowns[key]=Math.max(0,s.cooldowns[key]-dt);for(const k of ['inputCd','castLock','guardT','mistT','orbFlash','tapFlash','empowerT','tideT','hasteT'])s[k]=Math.max(0,(s[k]||0)-dt);if(s.tideT<=0)s.shieldHp=0;this.sesRuneProjectCooldown();}
  sesRuneReduceCooldowns(amount){const s=this._sesRune;if(!s||!(amount>0))return;this.sesRuneCommitCooldown();for(const key in s.cooldowns)s.cooldowns[key]=Math.max(0,s.cooldowns[key]-amount);this.sesRuneProjectCooldown();}
  sesRuneSound(kind,vol=.4){if(typeof Sfx!=='undefined')Sfx.orderCue?.((kind==='tap_p'||kind==='tap_m'?'ses816_':kind==='tap_b'?'ses815_':'ses811_')+kind,vol,kind.startsWith('tap_')?.08:.18);}
  buildSesRunePause(){
    const w=this.W,h=this.H,v=this.sesRuneStats(),short=h<500,top=short?90:112,step=Math.min(58,(h-top-100)/5),cw=(w-32)/2;
    this.pauseUI.add(this.add.rectangle(w/2,h/2,w,h,0x171020,.97));
    const text=(x,y,t,size=12,color='#fff0cd',width=cw-12)=>{const n=this.add.text(x,y,t,{fontFamily:'NunitoUI, sans-serif',fontSize:size+'px',color,wordWrap:{width}}).setOrigin(0,0);this.pauseUI.add(n);};
    text(16,16,'Sesame · Recipes',18,'#fff0cd',w-32);text(16,44,'ATK +'+Math.round((v.damage-1)*100)+'% · SPD +'+Math.round((v.speed-1)*100)+'% · Regen '+(v.regen*100).toFixed(2)+'%/s',11,'#fff0cd',w-32);
    text(16,65,'Basic speed +'+Math.round((v.attackRate-1)*100)+'% · Echo '+Math.round(v.echo*100)+'%',11,'#aee9ff',w-32);
    Object.entries(SES_RUNE_RECIPES).forEach(([key,r],i)=>{const x=16+(i%2)*cw,y=top+Math.floor(i/2)*step,cd=this._sesRune?.cooldowns[key]||0;text(x,y,key.toUpperCase()+' · '+(cd>0?cd.toFixed(1)+'s':'READY'),12,cd>0?'#cbbfda':'#8de4ba');text(x,y+17,r.name+' · '+r.role,short?10:11);});
    const bw=(w-48)/3,by=h-38;
    [['Resume',()=>this.togglePause()],['Settings',()=>this.buildPauseSettings()],['Quit stage',()=>this.quitStage()]].forEach(([name,fn],i)=>{const x=16+bw/2+i*(bw+8);this.uiPillBtn(this.pauseUI,x,by,bw,42,i===0?COLORS.mint:COLORS.grape,'',name,null);this._pauseBtns.push({x:x-bw/2,y:by-21,w:bw,h:42,fn});});
  }
  sesRuneCreateControls(){
    this._sesRuneButtons=[];this._sesRuneUI=[];
    for(const [key,symbol,color] of SES_RUNE_TYPES){const b=this.camUI(this.add.circle(0,0,22,0x261e30,.94).setScrollFactor(1).setDepth(54).setStrokeStyle(2,color,.95)),t=this.camUI(this.add.text(0,0,({p:'▲',m:'➤',b:'◆'})[key]+'\n'+({p:'Power',m:'Motion',b:'Regen'})[key],{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:'#fff4dc',align:'center'}).setOrigin(.5).setScrollFactor(1).setDepth(55));const img=this.textures?.exists?.('ses_rune_btn')?this.camUI(this.add.image(0,0,'ses_rune_btn',({p:0,m:3,b:6})[key]).setScrollFactor(1).setDepth(54.5)):null;if(img){b.setFillStyle?.(0x000000,.001);b.setStrokeStyle?.(0,0,0);t.setText?.(({p:'Power',m:'Motion',b:'Regen'})[key]);t.setFontSize?.(10);}this._sesRuneButtons.push({key,b,t,img});this._sesRuneUI.push(b,t);if(img)this._sesRuneUI.push(img);}   /* v8.1.65 ใบ 68 ปุ่มรูนวาดจริง */
    this._sesRuneLabel=this.camUI(this.add.text(0,0,'',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff0cd',align:'center',lineSpacing:2}).setOrigin(.5,1).setScrollFactor(1).setDepth(55));this._sesRuneUI.push(this._sesRuneLabel);this.hudList?.push(...this._sesRuneUI);this.sesRuneLayout();this.sesRuneRefreshUI();
  }
  sesRuneLayout(){if(!this._sesRuneButtons?.length||!this.uniqueBtn)return;const boxes=sesRuneControlLayout(this.W,this.H,this.ctrlScale(),!!Save.data.settings?.ctrlLeft,this.uniqueBtn,this.dashBtn);this._sesRuneButtons.forEach((q,i)=>{const a=boxes[i];q.b.setPosition(a.x,a.y).setRadius(a.r);if(q.img){q.img.setPosition(a.x,a.y).setDisplaySize(a.r*2.15,a.r*2.15);q.t.setPosition(a.x,a.y+a.r+7);}else q.t.setPosition(a.x,a.y);});this._sesRuneLabel.setPosition(boxes.label.x,boxes.label.y);this.sesRuneClampLabel?.();}
  sesRuneClampLabel(){const l=this._sesRuneLabel;if(!l?.active)return;const hh=l.displayHeight||l.height||0,hw=(l.displayWidth||l.width||0)/2,w=this.W,h=this.H;l.x=Math.max(hw+4,Math.min(w-hw-4,l.x));if(l.y-hh<4)l.y=Math.min(h-4,hh+4);}   // v8.1.39 ข้อความสูตรห้ามล้นขอบจอ (จอนอน Unique อยู่สูง)
  sesRuneRefreshUI(show){
    if(!this._sesRuneUI)return;const on=!!(this.isSesRune()&&(show??this.uniqueBtn?.visible)&&this.state!=='menu');this._sesRuneUI.forEach(o=>o.setVisible(on));if(!on)return;
    const r=this.sesRuneRecipe(),s=this._sesRune,code=(s?.orbs||['p','p','p']).map((x,i)=>i===0?'['+x.toUpperCase()+']':x.toUpperCase()).join('  '),cd=s?.cooldowns[r.key]||0,status=s?.castLock>0?'RECOVER':cd>0?cd.toFixed(1)+'s':'READY',buffs=[s?.empowerT>0?'ARM '+s.empowerT.toFixed(1)+'s':'',s?.tideT>0?'WATER '+Math.ceil(s.shieldHp||0)+' · '+s.tideT.toFixed(1)+'s':''].filter(Boolean).join(' · '),text=r.name+(sesSpellLv(r.key,this.basicAttack?.ranks)>1?' '+'★'.repeat(sesSpellLv(r.key,this.basicAttack?.ranks)-1):'')+' · '+status+'\n'+code+'  → replace [first]'+(buffs?'\n'+buffs:'');if(this._sesRuneLabel.text!==text){this._sesRuneLabel.setText(text);this.sesRuneLayout?.();}
    this._sesRuneButtons.forEach(q=>{const color=SES_RUNE_TYPES.find(t=>t[0]===q.key)[2],pressed=s?.lastTap===q.key&&s.tapFlash>0;if(q.img){q.img.setFrame(({p:0,m:3,b:6})[q.key]+(pressed?1:(s?.inputCd||0)>0?2:0));return;}q.b.setAlpha((s?.inputCd||0)>0?.75:1).setStrokeStyle(pressed?3:2,color,1).setFillStyle(pressed?color:0x261e30,pressed?.4:.94);});if(this.uniqueTxt?.text!==r.emoji)this.uniqueTxt?.setText(r.emoji);{const fi=['ppp','mmm','bbb','ppm','ppb','pmm','mmb','pbb','mbb','pmb'].indexOf(r.key),u=this.uniqueBtn;if(fi>=0&&u&&this.textures?.exists?.('ses_spell_icons')){let ic=this._sesSpellIcon;if(!ic?.active){ic=this._sesSpellIcon=this.camUI(this.add.image(0,0,'ses_spell_icons',fi).setScrollFactor(1).setDepth((u.depth||52)+1));this._sesRuneUI.push(ic);}ic.setFrame(fi).setPosition(u.x,u.y).setDisplaySize((u.radius||34)*1.25,(u.radius||34)*1.25).setVisible(true);this.uniqueTxt?.setAlpha(0);}}   /* v8.1.65 ใบ 68 ไอคอนเวท */
  }
  sesRuneHit(p){if(!this.isSesRune()||!this._sesRuneButtons)return null;const u=this.uniqueBtn;if(u?.visible&&Math.hypot(p.x-u.x,p.y-u.y)<=(u.radius||0)+4)return null;let best=null,bd=1e9;for(const q of this._sesRuneButtons){if(!q.b.visible)continue;const m=Math.hypot(p.x-q.b.x,p.y-q.b.y);if(m<=q.b.radius*1.45+4&&m<bd){bd=m;best=q;}}return best;}   // v8.1.39 พื้นที่กดใหญ่กว่าปุ่ม ~45% · ใกล้ปุ่มไหนนับปุ่มนั้น · ไม่แย่งแตะ Unique
  sesRunePointerDown(p){const q=this.sesRuneHit(p);if(!q)return false;if(!this._sesRunePointers?.has(p.id)){this.sesRuneAdd(q.key);try{if(Save.data.settings?.haptics!==false)globalThis.navigator?.vibrate?.(12);}catch(e){}}(this._sesRunePointers||(this._sesRunePointers=new Set())).add(p.id);return true;}
  sesRuneAdd(key){
    if(this.state!=='play'||this._adBusy||this._rubyEntry?.active||!SES_RUNE_TYPES.some(t=>t[0]===key))return false;const s=this.sesRuneEnsure();if(!s||s.inputCd>0)return false;this.sesRuneCommitCooldown();const old=this.sesRuneRecipe().key;s.orbs=sesRunePush(s.orbs,key);s.inputCd=.16;s.lastTap=key;s.orbFlash=.25;s.tapFlash=.22;const now=this.sesRuneRecipe().key;if(now!==old){s.readySound=.14;s.readyKey=now;}this.sesRuneProjectCooldown();this.sesRuneSound('tap_'+key,{p:.38,m:.34,b:.36}[key]);this.sesRuneRefreshUI();this.refreshUniqueSkillUI();return true;
  }
  sesRuneTarget(x,y,range){let best=null,score=-Infinity;this.enemies.children.iterate(e=>{if(!sesRuneEnemyValid(e))return;const d=Math.hypot(e.x-x,e.y-y);if(d>range)return;const rank=e.isBoss?4:e.isMini?3:e._waveObjectiveTarget||e._objectiveMark?2:e.isElite?1:0,v=rank*2000-d;if(v>score){score=v;best=e;}});return best;}
  sesRuneCrowd(x,y,range){const a=[];this.enemies.children.iterate(e=>{if(sesRuneEnemyValid(e)&&Math.hypot(e.x-x,e.y-y)<range)a.push(e);});let best=null,n=0;for(const e of a.slice(0,24)){let count=0;for(const o of a)if((e.x-o.x)**2+(e.y-o.y)**2<22500)count++;if(count>n){n=count;best=e;}}return best||this.sesRuneTarget(x,y,range);}
  sesRuneDamage(e,d,key,orbDamage){if(this.state!=='play'||!this._sesRune||!sesRuneEnemyValid(e))return;const prev=this._mxSrc;this._mxSrc='sesame.rune.'+key;try{const role=SES_RUNE_RECIPES[key]?.role;const pt=this.player?._pt,tm=(typeof sesRuneTalentMul==='function'?sesRuneTalentMul(pt,key,'dmg'):1)*((e.isBoss||e.isMini)?1+(pt?.srBoss||0):1);this.damage(e,d*tm*((e.isBoss||e.isMini)?role==='Boss'?1.65:role==='Clear'?.8:1:1),e.x,e.y,orbDamage);}finally{this._mxSrc=prev;}}
  sesRuneArea(x,y,r,d,key,orbDamage){this.enemies.children.iterate(e=>{if(sesRuneEnemyValid(e)&&Math.hypot(e.x-x,e.y-y)<=r+(e.body?.halfWidth||0))this.sesRuneDamage(e,d,key,orbDamage);});this.hitCratesInRadius?.(x,y,r,d);}
  sesRunePushEnemy(e,x,y,force=200,sec=.25){if(!sesRuneEnemyValid(e)||e.isBoss||e.isMini||e.body?.immovable||e.frozen>0||e._fleeing||e._huntFlee||e._wispRaider)return;const a=Math.atan2(e.y-y,e.x-x);e.setVelocity(Math.cos(a)*force,Math.sin(a)*force);e.knock=Math.max(e.knock||0,sec);}
  sesRuneHeal(fraction){const p=this.player;if(this.recipeHas?.('noheal')||p._uqNoRegen)return;const amount=p.maxhp*fraction*(this.pactHealMul?.()||1),before=p.hp;p.hp=Math.min(p.maxhp,p.hp+amount);if(p.hp>before)this.popHeal?.(p.x,p.y,Math.round(p.hp-before));}
  sesRuneImage(frame,x,y,size,depth=8,clip){
    const spec=SES_RUNE_VFX817[clip],key=spec&&'fx_sesame_vfx817_'+spec[0],animated=key&&this.textures?.exists(key);if(!animated&&!this.textures?.exists('fx_sesame_invoker811'))return null;
    const image=this.camWorld(this.add.image(x,y,animated?key:'fx_sesame_invoker811',animated?spec[1]*6:frame).setDisplaySize(size,size).setDepth(depth));if(animated)image._ses817={row:spec[1],frame:-1};return image;
  }
  sesRuneFrame(image,progress,loop=true){const v=image?._ses817;if(!v)return;const still=Save.data.settings?.vfx===0||this.hubMotionAllowed?.()===false,t=loop?((progress%1)+1)%1:Math.max(0,Math.min(1,progress)),frame=v.row*6+(still?3:Math.min(5,Math.floor(t*6)));if(v.frame!==frame){v.frame=frame;image.setFrame(frame);}}
  sesRuneBurst(s,frame,x,y,size,life=.45,clip){if(s!==this._sesRune||this.state!=='play'||s.fx.length>=12)return;const image=this.sesRuneImage(frame,x,y,size,y+6,clip||(frame>=3?'impact':null));if(image)s.fx.push({image,life,total:life,size});}
  sesRuneCast(){
    if(this.state!=='play'||!this.isSesRune()||this._adBusy||this._rubyEntry?.active)return false;const s=this.sesRuneEnsure();if(!s)return false;this.sesRuneCommitCooldown();const r=this.sesRuneRecipe();if(!r.ready||s.castLock>0||(s.cooldowns[r.key]||0)>0||s.actors.length>=8)return false;
    if(r.role==='Buff'){for(let i=s.actors.length-1;i>=0;i--)if(s.actors[i].key===r.key){s.actors[i].g.destroy();s.actors[i].images.forEach(o=>o?.destroy());s.actors.splice(i,1);}}
    const mlv=sesSpellLv(r.key,this.basicAttack?.ranks);const p=this.player,v=this.sesRuneStats(),target=r.role==='Clear'?this.sesRuneCrowd(p.x,p.y,620):this.sesRuneTarget(p.x,p.y,620),angle=target?Math.atan2(target.y-p.y,target.x-p.x):Math.atan2(this.moveDir?.y||0,this.moveDir?.x||1),q={key:r.key,ul:this.uniqueLevel||1,t:0,next:0,index:0,x:p.x,y:p.y,sx:p.x,sy:p.y,angle,dm:(p.dmgMul||1)*this.uniquePower()*v.spell,orbDamage:v.damage,area:v.area,life:r.life,hit:new Map(),phaseHits:[new Map(),new Map()],g:this.camWorld(this.add.graphics().setDepth(8)),images:[]};
    q.target=target;q.targetId=target?._sesSpawnId;q.ex=target?.x??p.x+Math.cos(angle)*260;q.ey=target?.y??p.y+Math.sin(angle)*260;
    q.mlv=mlv;q.tw=mlv>=4;if(mlv>1&&r.key==='ppp')q.life=Math.max(q.life,.35+(3+(mlv-1))*(mlv>1?.28:.4)+.3);if(mlv>1&&r.key==='ppb')q.life=Math.max(q.life,.18+(3+((mlv-1)>>1))*.24+.3);q.area*=1+.05*(mlv-1);q.cnt=r.key==='ppp'?3+(mlv-1):r.key==='ppb'?3+((mlv-1)>>1):r.key==='mmm'?3+((mlv-1)>>1):3;if(r.key==='pbb'){q.life=6+(mlv-1);q.minion=true;}if(r.key==='pmm')q.life=6+.5*(mlv-1);   /* v8.2.64 Mastery */
    const image=this.sesRuneImage(r.frame,q.x,q.y,150,8,r.key);if(image)q.images.push(image);
    if(r.key==='mmm')for(let i=0;i<q.cnt-1;i++){const img=this.sesRuneImage(r.frame,p.x,p.y,85,8,'mmm');if(img)q.images.push(img);}
    if(r.key==='pmm'){s.empowerT=s.empowerMax=6+.5*(mlv-1);s.armBounce=mlv>=4;}
    if(r.key==='bbb'){s.tideReflect=mlv>=4;s.tideT=6;s.shieldHp=Math.max(s.shieldHp||0,p.maxhp*(.2+.04*(mlv-1)));s.tideBurst=mlv>=5;}
    if(r.key==='mbb'){p.iframe=Math.max(p.iframe||0,.65);s.mistT=2.6+.3*(mlv-1);if(mlv>=4)s.hasteT=s.mistT+3;this.dashReady=true;this.dashCd=0;if(mlv>=5){const dx=p.x,dy=p.y;this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&Math.hypot(e.x-dx,e.y-dy)<420){e._decoyT=2.6;e._decoyX=dx;e._decoyY=dy;}});this.sesRuneBurst(s,11,dx,dy,160,.6);}}
    if(v.guard){s.guardT=2;s.guard=Math.max(s.guard||0,v.guard);}
    if(r.key==='ppp')this.bpPose?.('char_sesame_meteor_motion823',.5);s.cooldowns[r.key]=s.cdMax[r.key]=this.uniqueCooldown(r)*v.cooldown*(typeof sesRuneTalentMul==='function'?sesRuneTalentMul(this.player?._pt,r.key,'cd'):1);s.castLock=.38;s.actors.push(q);this.sesRuneExtras?.(s,q,r,mlv);this.sesRuneProjectCooldown();this.flashBtn?.(this.uniqueBtn);this.poseAttack?.(420);this._coachUnique=(this._coachUnique||0)+1;this.uniqueCastFx?.();this.fireRecipes?.('unique');if(!(typeof PERF!=='undefined'&&PERF.lvl>=2)&&this.textures?.exists?.('ses_cast_'+r.key))this.heroFx?.('ses_cast_'+r.key,p.x,p.y+12,112,{depth:p.y-1});   /* v8.1.65 ใบ 68 ตราร่ายรายเวท */
    if(this.cache?.audio?.exists?.('sfx_ses_cast_'+r.key))Sfx.orderCue?.('ses_cast_'+r.key,.55,.12);else this.sesRuneSound(r.key==='pmb'?'impact':'cast',r.key==='pmb'?.62:.5);   /* v8.1.65 A11 เสียงร่ายรายเวท */this.sesRuneBurst(s,15,p.x,p.y,145,.45);
    const rank=this.basicAttack.ranks.pulse||0;if(rank){this.sesRuneArea(p.x,p.y,105*v.area,18*rank*q.dm,'orb_reprise',q.orbDamage);this.sesRuneBurst(s,14,p.x,p.y,210*v.area,.4);}this.sesRuneRefreshUI();return true;
  }
  /* v8.2.64 Spell Mastery: ร่างเพิ่ม (Sunlance พัด · มังกรหลายตัว · พายุลูกที่ 2 · Prismatic Blast วงที่ 2) · ใช้เพดาน actors ≤ 8 เดิม */
  /* v8.2.65 พื้นไฟ/หมอกค้าง (ไม่สร้าง actor ใหม่ · ตีทุก 0.5 วิ) */
  sesRuneLinger(s,x,y,r,dmg,sec,col,key,orbDamage){ if(!s||!this.time?.addEvent)return; const g=this.camWorld(this.add.graphics().setDepth(5)); let n=Math.round(sec/.5); const ev=this.time.addEvent({delay:500,repeat:n-1,callback:()=>{ if(s!==this._sesRune||this.state!=='play'){ ev.remove?.(false); g.destroy(); return; } this.sesRuneArea(x,y,r,dmg,key,orbDamage); n--; g.clear(); if(n>0){ g.fillStyle(col,.18).fillCircle(x,y,r); g.lineStyle(2,col,.5).strokeCircle(x,y,r); } else g.destroy(); }}); g.fillStyle(col,.22).fillCircle(x,y,r); }
  sesRuneReflect(s){ if(!s?.tideReflect||!(s.tideT>0))return; const p=this.player; this.foeBullets?.children.iterate(f=>{ if(!f?.active||Math.hypot(f.x-p.x,f.y-p.y)>70)return; const fx=f.x,fy=f.y; this.killFoe?.(f); const t=this.sesRuneTarget(fx,fy,420); if(t)this.sesRuneDamage(t,24*(p.dmgMul||1)*this.uniquePower(),'bbb',1); this.sesRuneBurst(s,11,fx,fy,60,.2); }); }
  sesRuneExtras(s,q,r,mlv){ if(!s||!q||mlv<2)return; const add=(o)=>{ if(s.actors.length>=8)return null; const c={...q,...o,t:o.t??0,next:0,index:0,hit:new Map(),phaseHits:[new Map(),new Map()],g:this.camWorld(this.add.graphics().setDepth(8)),images:[]}; const img=this.sesRuneImage(r.frame,c.x,c.y,150,8,r.key); if(img)c.images.push(img); s.actors.push(c); return c; };
    if(q.key==='ppm'){ const n=mlv>=4?2:mlv>=2?1:0; for(let i=1;i<=n;i++)add({angle:q.angle+(i%2?1:-1)*.22*Math.ceil(i/2)}); }
    else if(q.key==='pbb'){ const n=mlv>=5?2:mlv>=3?1:0; for(let i=1;i<=n;i++)add({phase:i*2.1,orb:i*2.1,small:true,target:null,targetId:null,x:q.x+Math.cos(i*2.1)*60,y:q.y+Math.sin(i*2.1)*40}); }
    else if(q.key==='mmb'&&mlv>=5){ add({ex:q.ex+Math.cos(q.angle+1.57)*170,ey:q.ey+Math.sin(q.angle+1.57)*170}); }
    else if(q.key==='pmb'&&mlv>=3){ add({t:-.35,life:q.life+.35}); if(mlv>=4)add({t:-.7,life:q.life+.7}); }
  }
  sesRuneDrawOrbs(s,dt){
    const p=this.player,red=this.hubMotionAllowed?.()===false||Save.data.settings?.vfx===0;s.phase+=red?0:dt*1.8;s.g.clear().setDepth(p.y+4);
    this.sesRuneReflect?.(s);
    /* v8.2.64 เจ้าของ: Prismatic Armament (PMM) ต้องเห็นชัด · ไอคอนบนหัว + วงนับเวลา */
    {const on=s.empowerT>0;let ic=s.armIcon;if(on&&!ic?.active){ic=s.armIcon=this.textures?.exists?.('ses_spell_icons')?this.camWorld(this.add.image(p.x,p.y,'ses_spell_icons',5)):this.camWorld(this.add.text(p.x,p.y,'✧',{fontFamily:'sans-serif',fontSize:'26px',color:'#ffe5b0',stroke:'#3a2a10',strokeThickness:4}).setOrigin(.5));}
      if(ic?.active){ic.setVisible(on);if(on){const bob=red?0:Math.sin((this.elapsed||0)*5)*3;ic.setPosition(p.x,p.y-74+bob).setDepth(p.y+90);if(ic.setDisplaySize&&ic.frame?.name!==undefined&&ic.type==='Image')ic.setDisplaySize(34,34);const f=Math.max(0,Math.min(1,s.empowerT/(s.empowerMax||6)));s.g.lineStyle(3,0xffe5b0,.95);s.g.beginPath?.();s.g.arc?.(p.x,p.y-74,22,-Math.PI/2,-Math.PI/2+Math.PI*2*f,false);s.g.strokePath?.();}}}
    s.orbs.forEach((key,i)=>{const a=s.phase+i*TAU/3,x=p.x+Math.cos(a)*30,y=p.y-18+Math.sin(a)*14,c=SES_RUNE_TYPES.find(t=>t[0]===key)[2],frame={p:0,m:1,b:2}[key];let img=s.orbSprites[i];const ok68=this.textures?.exists?.('ses_orb_'+key)&&this.bpAnim?.('ses_orb_'+key);if(img&&!!img._o68!==!!ok68){img.destroy();img=s.orbSprites[i]=null;}if(!img){img=ok68?this.camWorld(this.add.sprite(x,y,'ses_orb_'+key).play('ses_orb_'+key)):this.sesRuneImage(frame,x,y,25,p.y+4);if(img){img._o68=!!ok68;img._ok=key;s.orbSprites[i]=img;}}if(img){if(img._o68){if(img._ok!==key){img._ok=key;img.setTexture('ses_orb_'+key).play('ses_orb_'+key);}}else img.setFrame(frame);img.setPosition(x,y).setDepth(p.y+4).setDisplaySize(i===2&&s.orbFlash>0?32:25,i===2&&s.orbFlash>0?32:25);}   /* v8.1.65 ใบ 68 ลูกแก้วขยับได้ */
      s.g.lineStyle(i===0?2:1,i===0?0xfff0d2:c,.9).strokeCircle(x,y,13);if(!img)s.g.fillStyle(c,1).fillCircle(x,y,6);if(i===2&&s.orbFlash>0)s.g.lineStyle(2,c,s.orbFlash/.25).strokeCircle(x,y,14+(1-s.orbFlash/.25)*12);
    });
  }
  sesRuneTickFlares(s,dt){
    const step=Math.min(dt,.1);for(let i=(s.echoes||[]).length-1;i>=0;i--){const echo=s.echoes[i];echo.delay-=dt;if(echo.delay<=0){s.echoes.splice(i,1);this.sesRuneFireFlares(s,echo);this.sesRuneBurst(s,2,this.player.x,this.player.y,44,.2);this.sesRuneSound('tap_b',.14);}}for(let i=s.flares.length-1;i>=0;i--){const f=s.flares[i],ox=f.x,oy=f.y;f.life-=dt;f.x+=Math.cos(f.angle)*540*step;f.y+=Math.sin(f.angle)*540*step;f.image?.setPosition(f.x,f.y).setRotation(f.angle).setDepth(f.y+2);this.sesRuneFrame(f.image,(1.3-f.life)/.36);let hit=null;
      this.enemies.children.iterate(e=>{if(!hit&&sesRuneEnemyValid(e)&&sesRuneSegmentDistance(e.x,e.y,ox,oy,f.x,f.y)<18+(e.body?.halfWidth||0))hit=e;});if(hit){this.sesRuneArea(hit.x,hit.y,f.radius,f.dmg,'rainbow_flare');if(s!==this._sesRune)return;this.sesRuneBurst(s,3,hit.x,hit.y,65,.2);if(s.armBounce&&s.empowerT>0&&!f.bounced){let nb=null,bd=260;this.enemies.children.iterate(e=>{if(e!==hit&&sesRuneEnemyValid(e)){const d=Math.hypot(e.x-hit.x,e.y-hit.y);if(d<bd){bd=d;nb=e;}}});if(nb){f.bounced=true;f.x=hit.x;f.y=hit.y;f.angle=Math.atan2(nb.y-hit.y,nb.x-hit.x);f.life=.6;hit=null;}}}
      if(hit||f.life<=0){f.image?.destroy();s.flares.splice(i,1);}}
  }
  sesRuneWave(q,radius,damage,push=false){this.enemies.children.iterate(e=>{if(!sesRuneEnemyValid(e)||q.hit.get(e)===e._sesSpawnId&&q.hit.has(e))return;if(Math.hypot(e.x-q.x,e.y-q.y)>radius+(e.body?.halfWidth||0))return;q.hit.set(e,e._sesSpawnId);this.sesRuneDamage(e,damage*q.dm,q.key,q.orbDamage);if(push){this.sesRunePushEnemy(e,q.x,q.y,290,.4);if(!e.isBoss&&!e.isMini&&typeof e.shootCd==='number')e.shootCd=Math.max(e.shootCd,1.2);}});}
  tickSesRune(dt){
    if(!this.isSesRune()){if(this._sesRune)this.clearSesRune();return;}if(this.state!=='play')return;const s=this.sesRuneEnsure();if(!s)return;const p=this.player,red=this.hubMotionAllowed?.()===false||Save.data.settings?.vfx===0;this.sesRuneDrawOrbs(s,dt);this.sesRuneTickFlares(s,dt);if(s!==this._sesRune)return;
    if(s.readySound>0){s.readySound-=dt;if(s.readySound<=0&&s.readyKey===this.sesRuneRecipe().key)this.sesRuneSound('recipe',.38);}
    for(let i=s.fx.length-1;i>=0;i--){const f=s.fx[i];f.life-=dt;this.sesRuneFrame(f.image,1-f.life/f.total,false);f.image.setAlpha(Math.max(0,f.life/f.total)).setDisplaySize(f.size*(red?1:1+.3*(1-f.life/f.total)),f.size*(red?1:1+.3*(1-f.life/f.total)));if(f.life<=0){f.image.destroy();s.fx.splice(i,1);}}
    const step=Math.min(dt,.1);
    for(let i=s.actors.length-1;i>=0;i--){const q=s.actors[i],r=SES_RUNE_RECIPES[q.key];q.t+=dt;q.life-=dt;q.next-=dt;let done=false;
      if(q.key==='pmm'||q.key==='bbb'){q.x=p.x;q.y=p.y;const armor=q.key==='bbb';q.images[0]?.setPosition(p.x,p.y-8).setDepth(p.y+3).setDisplaySize(armor?112:92,armor?112:92).setAlpha(armor?.38:.65).setRotation(red?0:q.t*(armor?.3:1.2));q.g.clear().lineStyle(2,armor?0x51baff:0xffe5b0,.7).strokeCircle(p.x,p.y-8,armor?42:35);
      }else if(q.key==='ppb'){
        q.x=p.x;q.y=p.y;const range=300*q.area;
        while(q.index<(q.cnt||3)&&q.t>=.18+q.index*.24){q.index++;
          this.enemies.children.iterate(e=>{if(s!==this._sesRune||!sesRuneEnemyValid(e))return;const dx=e.x-q.x,dy=e.y-q.y,d=Math.hypot(dx,dy),body=e.body?.halfWidth||0,along=dx*Math.cos(q.angle)+dy*Math.sin(q.angle),side=Math.abs(-dx*Math.sin(q.angle)+dy*Math.cos(q.angle));if(d<=range+body&&(d<=45+body||along>=-body&&side<=Math.max(0,along)*Math.tan(.58)+body)){this.sesRuneDamage(e,(60+q.ul*6)*q.dm,q.key,q.orbDamage);this.sesRunePushEnemy(e,q.x,q.y,180,.18);}});
          if(s!==this._sesRune||!q.g.active)return;this.sesRuneSound('impact',.28);if(q.tw)this.enemies.children.iterate(e=>{if(sesRuneEnemyValid(e)&&!e.isBoss&&!e.isMini&&Math.hypot(e.x-q.x,e.y-q.y)<range)this.applyFreeze?.(e,.35,false);});
        }
        const phase=q.index?Math.min(1,.34+(q.t-(.18+(q.index-1)*.24))/.3*.66):q.t/.18*.3;
        this.sesRuneFrame(q.images[0],phase,false);q.images[0]?.setOrigin(.15,.5).setPosition(q.x,q.y).setRotation(q.angle).setDepth(p.y+4).setDisplaySize(range/.78,range/.78).setAlpha(q.t>.85?Math.max(0,(1.15-q.t)/.3):.9);
      }else if(q.key==='pbb'){
        /* v8.2.64 เจ้าของ: มังกรน้ำเป็นลูกสมุนนิด ๆ · ว่ายวนรอบตัวระหว่างกัด · กัดได้เรื่อย ๆ จนหมดเวลา (6–10 วิ) แล้วระเบิด · Lv3 = 2 ตัว · Lv5 = 3 ตัว */
        if(!sesRuneEnemyValid(q.target)||q.target._sesSpawnId!==q.targetId||Math.hypot(q.target.x-p.x,q.target.y-p.y)>540){q.target=this.sesRuneTarget(p.x,p.y,480);q.targetId=q.target?._sesSpawnId;}
        const target=q.target;
        if(target){const dx=target.x-q.x,dy=target.y-q.y,d=Math.hypot(dx,dy),reach=85+(target.body?.halfWidth||0),travel=Math.min(Math.max(0,d-reach*.6),760*step);q.angle=Math.atan2(dy,dx);q.x+=Math.cos(q.angle)*travel;q.y+=Math.sin(q.angle)*travel;
          if(q.t>=.35&&q.next<=0&&d-travel<=reach){q.index++;q.next=.9;q.biteAt=q.t;this.sesRuneDamage(target,(48+q.ul*6)*q.dm,q.key,q.orbDamage);if(s!==this._sesRune||!q.g.active)return;this.sesRuneBurst(s,12,target.x,target.y,110,.25,'mbb');this.sesRuneSound('impact',.32);if(q.tw){this.sesRuneArea(target.x,target.y,95*q.area,16*q.dm,q.key,q.orbDamage);if(s!==this._sesRune)return;this.sesRuneBurst(s,9,target.x,target.y,190*q.area,.35);}}
        }else{q.orb=(q.orb??q.phase??0)+dt*2.2;const tx=p.x+Math.cos(q.orb)*80,ty=p.y+Math.sin(q.orb)*55,dx=tx-q.x,dy=ty-q.y,d=Math.hypot(dx,dy),mv=Math.min(d,560*step);if(d>1){q.angle=Math.atan2(dy,dx);q.x+=dx/d*mv;q.y+=dy/d*mv;}}
        const sz=230*q.area*(q.small?.72:1);this.sesRuneFrame(q.images[0],q.biteAt!==undefined&&q.t-q.biteAt<.3?.5+(q.t-q.biteAt)/.6:(q.t%.6)/1.2,false);q.images[0]?.setPosition(q.x,q.y).setRotation(q.angle).setDepth(q.y+4).setDisplaySize(sz,sz).setAlpha(q.life<.4?Math.max(0,q.life/.4):1);
        if(q.life<=0&&!q.boomed){q.boomed=true;this.sesRuneArea(q.x,q.y,140*q.area,35*q.dm,q.key,q.orbDamage);if(s!==this._sesRune||!q.g.active)return;this.sesRuneBurst(s,12,q.x,q.y,300*q.area,.5,'mbb');}
      }else if(q.key==='ppp'){
        if(q.index<(q.cnt||3)&&q.lockedIndex!==q.index&&sesRuneEnemyValid(q.target)&&q.target._sesSpawnId===q.targetId){q.ex=q.target.x;q.ey=q.target.y;if(q.t>=.35+q.index*(q.cnt>3?.28:.4)-.12)q.lockedIndex=q.index;}
        if(q.t>=.35+q.index*(q.cnt>3?.28:.4)&&q.index<(q.cnt||3)){const n=q.index++,x=q.ex+(n-((q.cnt||3)-1)/2)*48,y=q.ey+(n%2?-26:26)*((q.cnt||3)>3?1:0),radius=115*q.area;this.sesRuneArea(x,y,radius,(65+q.ul*12)*q.dm,q.key,q.orbDamage);this.sesRuneBurst(s,4,x,y,radius*2,.5);if(q.tw)this.sesRuneLinger?.(s,x,y,radius*.75,10*q.dm,3,0xff7a3a,q.key,q.orbDamage);this.sesRuneSound('impact',.4);q.x=x;q.y=y;}
        if(!q.g.active)return;q.g.clear();if(q.index<(q.cnt||3)){q.g.lineStyle(2,r.color,.55).strokeCircle(q.ex,q.ey,105*q.area);const f=Math.max(0,Math.min(1,1-(.35+q.index*(q.cnt>3?.28:.4)-q.t)/.35));this.sesRuneFrame(q.images[0],f,false);q.images[0]?.setPosition(q.ex-90*(1-f),q.ey-220*(1-f)).setDisplaySize(220,220);}else q.images[0]?.setAlpha(0);
      }else if(q.key==='mmm'){
        const back=q.t>=.65;
        for(let arm=0,na=q.cnt||3;arm<na;arm++){if(!q.g.active)return;const angle=q.angle+(arm-(na-1)/2)*.28,prev=q.positions?.[arm]||{x:q.sx,y:q.sy};q.positions=q.positions||[];const ht=q.tw&&!back?this.sesRuneTarget(prev.x,prev.y,240):null,a=back?Math.atan2(p.y-prev.y,p.x-prev.x):ht?Math.atan2(ht.y-prev.y,ht.x-prev.x):angle,x=prev.x+Math.cos(a)*460*step,y=prev.y+Math.sin(a)*460*step;q.positions[arm]={x,y};q.images[arm]?.setPosition(x,y).setRotation(red?0:q.t*12).setDisplaySize(85,85);
          this.enemies.children.iterate(e=>{const hit=q.phaseHits[back?1:0],token=e._sesSpawnId+'_'+arm;if(!sesRuneEnemyValid(e)||hit.get(e)?.has(token)||sesRuneSegmentDistance(e.x,e.y,prev.x,prev.y,x,y)>32*q.area+(e.body?.halfWidth||0))return;const ids=hit.get(e)||new Set();ids.add(token);hit.set(e,ids);this.sesRuneDamage(e,35*q.dm,q.key,q.orbDamage);});}
        if(back&&q.positions.every(v=>Math.hypot(v.x-p.x,v.y-p.y)<30)){if(q.tw&&!q.loop2){q.loop2=true;q.t=0;q.sx=p.x;q.sy=p.y;q.positions=[];q.phaseHits=[new Map(),new Map()];q.life=Math.max(q.life,1.6);}else done=true;}
      }else if(q.key==='ppm'){
        const ox=q.x,oy=q.y;q.x+=Math.cos(q.angle)*850*step;q.y+=Math.sin(q.angle)*850*step;
        this.enemies.children.iterate(e=>{if(!sesRuneEnemyValid(e)||q.hit.get(e)===e._sesSpawnId&&q.hit.has(e)||sesRuneSegmentDistance(e.x,e.y,ox,oy,q.x,q.y)>32*q.area+(e.body?.halfWidth||0))return;q.hit.set(e,e._sesSpawnId);this.sesRuneDamage(e,(120+q.ul*25)*q.dm,q.key,q.orbDamage);this.sesRuneBurst(s,12,e.x,e.y,150,.3);if(q.tw&&s===this._sesRune)this.sesRuneArea(e.x,e.y,80*q.area,40*q.dm,q.key,q.orbDamage);this.sesRuneSound('impact',.45);if(e.isBoss||e.isMini)this.screenShake?.(100,.003);});
        if(!q.g.active)return;q.images[0]?.setPosition(q.x,q.y).setRotation(q.angle).setDisplaySize(210,90);
      }else if(q.key==='pmb'){
        const radius=Math.min(1,q.t/.65)*330*q.area;q.g.clear();for(let j=0;j<3;j++)q.g.lineStyle(5-j,SES_RUNE_TYPES[j][2],.8).strokeCircle(q.x,q.y,Math.max(1,radius-j*13));q.images[0]?.setPosition(q.x,q.y).setDisplaySize(Math.max(30,radius*2),Math.max(30,radius*2)).setAlpha(Math.max(.15,1-q.t/.85));this.sesRuneWave(q,radius,(100+q.ul*15),true);
      }else{
        if(q.key==='mmb'){const f=Math.min(1,q.t/.45);if(f<1||!q.tw){q.x=q.sx+(q.ex-q.sx)*f;q.y=q.sy+(q.ey-q.sy)*f;}else{const t=this.sesRuneTarget(q.x,q.y,320);if(t){const dx=t.x-q.x,dy=t.y-q.y,d=Math.hypot(dx,dy)||1,mv=Math.min(d,110*step);q.x+=dx/d*mv;q.y+=dy/d*mv;}}this.enemies.children.iterate(e=>{const d=Math.hypot(e.x-q.x,e.y-q.y);if(d<145*q.area&&d>25)this.sesRunePushEnemy(e,q.x,q.y,-130,.12);});}
        if(q.key==='mbb'){q.x=p.x;q.y=p.y;}
        const radius=(q.key==='mmb'?145:q.key==='bbb'?155:135)*q.area;q.images[0]?.setPosition(q.x,q.y).setDisplaySize(radius*2,radius*2).setAlpha(q.key==='bbb'?.5:.78).setRotation(red?0:q.t*.8);
        if(q.next<=0){q.next=.45;this.sesRuneArea(q.x,q.y,radius,(q.key==='mmb'?18:10)*q.dm,q.key,q.orbDamage);if(q.key!=='mmb'){this.enemies.children.iterate(e=>{if(Math.hypot(e.x-q.x,e.y-q.y)<radius)this.sesRunePushEnemy(e,q.x,q.y,150,.2);});this.foeBullets?.children.iterate(f=>{if(f?.active&&Math.hypot(f.x-q.x,f.y-q.y)<radius)this.killFoe(f);});}}
      }
      if(s!==this._sesRune||!q.g.active)return;
      if(!q.images.length)q.g.clear().lineStyle(3,r.color,.9).strokeCircle(q.x,q.y,(q.key==='pmb'?Math.min(1,q.t/.65)*330:q.key==='mmm'?40:110)*q.area);
      if(!['ppp','ppb','pbb'].includes(q.key))for(const image of q.images)this.sesRuneFrame(image,q.t/(q.key==='pmb'?.85:.55),q.key!=='pmb');
      if(done||q.life<=0||!q.g.active){q.g.destroy();q.images.forEach(img=>img?.destroy());s.actors.splice(i,1);}
    }
  }
  clearSesRune(){const s=this._sesRune;if(s){s.actors.forEach(q=>{q.g?.destroy();q.images?.forEach(i=>i?.destroy());});s.flares?.forEach(f=>f.image?.destroy());s.fx?.forEach(f=>f.image?.destroy());s.orbSprites?.forEach(o=>o?.destroy());s.armIcon?.destroy?.();s.g?.destroy();}this._sesRune=null;this._sesRunePointers?.clear();this._sesRuneUI?.forEach(o=>o.setVisible(false));}
  sesRuneFireFlares(s,shot){
    if(s!==this._sesRune||this.state!=='play')return;if(!shot.echo)Sfx.a21?.('sesame_flare',.26,.12);const p=this.player,t=this.sesRuneTarget(p.x,p.y,650),a=t?Math.atan2(t.y-p.y,t.x-p.x):Math.atan2(this.moveDir?.y||0,this.moveDir?.x||1);
    for(let i=0;i<shot.count&&s.flares.length<18;i++){const angle=a+(i-(shot.count-1)/2)*(shot.empowered?.3:.16),image=this.sesRuneImage(3,p.x,p.y,shot.empowered?64:48,p.y+2,'flare');image?.setDisplaySize(shot.empowered?72:54,shot.empowered?38:28).setRotation(angle).setAlpha(shot.echo?.65:1);s.flares.push({x:p.x,y:p.y,angle,life:1.3,dmg:shot.dmg,radius:shot.radius,image});}
  }
  castSesRuneFlare(lvl,dm,basic){
    if(this.state!=='play')return;const s=this.sesRuneEnsure();if(!s)return;const v=this.sesRuneStats(),shot={count:Math.min(3,1+Math.max(0,Math.floor(basic?._pm?.count||0)))+(s.empowerT>0?2:0),dmg:(19+lvl*5)*dm*v.basicDamage,radius:(36+v.p*8)*v.area,empowered:s.empowerT>0};this.sesRuneFireFlares(s,shot);
    if(v.echo>0&&s.flares.length<18&&Math.random()<v.echo){const queue=s.echoes||(s.echoes=[]);if(queue.length<4)queue.push({...shot,dmg:shot.dmg*.6,delay:.14,echo:true});}
  }
  sesRuneAbsorb(dmg){const s=this._sesRune;if(!(dmg>0)||!s||!(s.tideT>0)||!(s.shieldHp>0))return dmg;const block=Math.min(dmg,s.shieldHp);s.shieldHp-=block;this.sesRuneBurst(s,11,this.player.x,this.player.y,100,.2);if(s.shieldHp<=0&&s.tideBurst){s.tideBurst=false;const p=this.player;this.sesRuneArea(p.x,p.y,170,60*(p.dmgMul||1)*this.uniquePower(),'bbb',1);this.enemies.children.iterate(e=>{if(e&&e.active&&Math.hypot(e.x-p.x,e.y-p.y)<170)this.sesRunePushEnemy(e,p.x,p.y,260,.3);});this.sesRuneBurst(s,11,p.x,p.y,340,.5);}   /* v8.2.64 Tidal Armor Lv5 */return dmg-block;}

  sesPlaceMirror(x,y){
    const M=this._sesMirrors||(this._sesMirrors=[]); while(M.length>=SES_MIRROR_MAX)this.sesMirrorGone(M.shift(),false);
    const ring=this.camWorld(this.add.image(x,y,this.textures.exists('vfx_magic_circle')?'vfx_magic_circle':'vfx_glow').setDisplaySize(64,64).setTint(SES_PRISM).setAlpha(.5).setDepth(4));
    const shard=this.camWorld(this.add.rectangle(x,y-14,12,30,0xe9e3f6,.9).setStrokeStyle(2,SES_PRISM).setDepth(y+1).setRotation(.35));
    const m={x,y,life:SES_MIRROR_LIFE,ring,shard,ph:Math.random()*6}; M.push(m);
    this.tweens.add({targets:ring,scale:{from:ring.scale*.2,to:ring.scale},duration:160,ease:'Back.out'}); this.tweens.add({targets:shard,scale:{from:.2,to:1},duration:160,ease:'Back.out'}); this.vfxHitRing?.(x,y,SES_PRISM,false); return m;
  }
  sesMirrorGone(m,broken){ if(!m)return; if(broken){ this.burst?.(m.x,m.y,0xe9e3f6); this.vfxHitRing?.(m.x,m.y,0xffffff,false); } for(const o of [m.ring,m.shard])if(o&&o.active)o.destroy(); }
  clearSesMirrors(){ for(const m of this._sesMirrors||[])this.sesMirrorGone(m,false); this._sesMirrors=[]; }
  tickSesMirrors(dt){ const M=this._sesMirrors; if(!M||!M.length)return;
    for(let i=M.length-1;i>=0;i--){ const m=M[i]; m.life-=dt; m.ph+=dt*2; if(m.life<=0||!m.ring.active){ this.sesMirrorGone(m,false); M.splice(i,1); continue; }
      const a=m.life<2?Math.max(.15,m.life/2):1; m.ring.setRotation(m.ph*.25).setAlpha(.5*a); m.shard.setAlpha(.9*a).setY(m.y-14+Math.sin(m.ph)*2.5); } }
  // ท่าใหญ่ของบอส (วงระเบิด/คลื่น) ทำกระจกแตก · ศัตรูธรรมดาไม่ทำ (เจ้าของ 21 ต.ค. ตามแนะนำ)
  sesMirrorBreak(test){ const M=this._sesMirrors; if(this.character!=='sesame'||!M||!M.length)return; for(let i=M.length-1;i>=0;i--)if(test(M[i].x,M[i].y)){ this.sesMirrorGone(M[i],true); M.splice(i,1); } }
  /* v8.1.144 owner 🐞: EXP/items looked pasted on the floor → one soft ground shadow under every pickup (single Graphics, ≤ 260 drops, off on low performance) */
  tickDropShadows(){ if(typeof PERF!=='undefined'&&PERF.lvl>=2){ this._dropSh?.clear?.(); return; } let g=this._dropSh; if(!g||!g.scene){ if(!this.add?.graphics)return; g=this._dropSh=this.camWorld(this.add.graphics().setDepth(-97000)); } g.clear(); let n=0;
    const one=(o,w)=>{ if(!o||!o.active||!o.visible||n>=260)return; n++; const ww=Math.max(10,(o.displayWidth||w)*.7); g.fillStyle(0x1a0f1e,.22).fillEllipse(o.x,o.y+(o.displayHeight||w)*.42,ww,ww*.32); g.fillStyle(0x1a0f1e,.14).fillEllipse(o.x,o.y+(o.displayHeight||w)*.42,ww*1.4,ww*.45); };
    for(const grp of [this.loots,this.heals,this.vacs,this.gimmicks,this.chests,this.orbs])grp?.children?.iterate?.(o=>one(o,24)); }
  tickAura(dt){
    const lvl=this.skills&&this.skills.aura;if(!lvl){this.clearAuraFx();return;}
    const aw=lvl>=SKILL_AWAKEN_LV,r=(72+lvl*13)*(aw?1.35:1);this.ensureAuraFx();this._auraAngle=(this._auraAngle||0)+dt*(aw?1.45:1.05);this._sakuraHealCd=Math.max(0,(this._sakuraHealCd||0)-dt);
    if(this._auraFx&&this._auraFx.active){ this._auraFx.x=this.player.x; this._auraFx.y=this.player.y;
      this._auraFx.setScale((2*r)/CODE_FX.fx_aura.fw).setAlpha(Math.min(0.48,0.22+lvl*0.035)); }
    (this._auraPetals||[]).forEach((p,i)=>{const inner=aw&&i%2===1,rr=r*(inner?0.62:0.9),a=this._auraAngle+(i/this._auraPetals.length)*Math.PI*2*(inner?-1:1);p.setPosition(this.player.x+Math.cos(a)*rr,this.player.y+Math.sin(a)*rr).setRotation(a+Math.PI/2).setScale(inner?0.42:0.54);});
    this._auraTick=(this._auraTick||0)-dt;
    if(this._auraTick<=0){this._auraTick=lvl>=5?0.38:0.48;const touch=(1.2+lvl*0.5)*this.player.dmgMul*(BALANCE.skillPower.aura||1);
      this.enemies.children.iterate(e=>{if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>=r)return;this.damage(e,touch,e.x,e.y);if(!e.active)return;
        e.bloomStacks=(e.bloomStacks||0)+1;e.bloomUntil=2.2;const need=e.isBoss||e.isMini?5:3;if(e.bloomStacks>=need){e.bloomStacks=0;this.sakuraBloom(e,lvl,aw);}});
      this.hitCratesInRadius(this.player.x,this.player.y,r,touch);}
  }
  fireBeam(ang,len,wide,dmg,opt){
    opt=opt||{}; const tint=opt.tint!=null?opt.tint:0xffe08a, rectColor=opt.tint!=null?opt.tint:0xffe08a;
    const px=opt.ox!=null?opt.ox:this.player.x, py=opt.oy!=null?opt.oy:this.player.y;   // v7.9.40 ox/oy = ยิงจากกระจกงาดำ
    if(this.textures.exists('fx_beam')&&this.anims.exists('fx_beam')){
      const sx=len/CODE_FX.fx_beam.fw, sy=0.42*(wide/15);
      this.spawnFxAnim('fx_beam',px,py,{rotation:ang,scaleX:sx,scaleY:sy,depth:6,anchor:'left',tint:opt.tint!=null?tint:null});
    } else {
      const g=this.camWorld(this.add.rectangle(px,py,len,wide,rectColor,0.75).setOrigin(0,0.5).setDepth(6)); g.setRotation(ang);
      this.tweens.add({targets:g,alpha:0,scaleY:0.3,duration:260,onComplete:()=>g.destroy()});
    }
    const dx=Math.cos(ang),dy=Math.sin(ang), hitW=wide/2+16;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-px, ry=e.y-py;
      const proj=rx*dx+ry*dy; if(proj<0||proj>len)return; if(Math.abs(-rx*dy+ry*dx)<hitW){ this.damage(e,dmg,e.x,e.y); if(opt.onHit&&e.active)opt.onHit(e); } });
  }
  creamWave(maxR,dmg,delay,force=260){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const px=this.player.x, py=this.player.y, hit=new Set();
      this.hitCratesInRadius(px,py,maxR,dmg);
      if(this.textures.exists('fx_wave')&&this.anims.exists('fx_wave')){ const wl=this.skills.wave||1; this.spawnFxAnim('fx_wave',px,py,{scale:(2*maxR)/CODE_FX.fx_wave.fw,depth:3,anchor:'center',alpha:Math.min(1,0.5+wl*0.1)}); }
      const ring=this.camWorld(this.add.image(px,py,'vfx_cream_ring').setDepth(3).setScale(20/256).setAlpha(0.9));
      const waveTrack={radius:10};
      this.tweens.add({targets:waveTrack,radius:maxR,duration:420,ease:'Quad.out',
        onUpdate:(tw)=>{ const rr=waveTrack.radius; ring.setScale((rr*2)/256).setAlpha(0.9*(1-tw.progress));
          const o2=rr*rr,i2=rr>46?(rr-46)*(rr-46):0;   // v7.8.92 perf: เทียบระยะกำลังสอง (ไม่ถอดราก)
          this.enemies.children.iterate(e=>{ if(e&&e.active&&!hit.has(e)){ const dx=e.x-px,dy=e.y-py,d=dx*dx+dy*dy;
          if(d<o2&&d>i2){ hit.add(e); this.damage(e,dmg,e.x,e.y); if(!e.isBoss){ const a=Math.atan2(e.y-py,e.x-px); e.setVelocity(Math.cos(a)*force,Math.sin(a)*force); e.knock=0.2; } } } }); },
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
  awakenSpark(key){ const c=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_glow').setTint(0xfff2a8).setScale(0.08).setAlpha(0.8).setDepth(6));
    this.tweens.add({targets:c,scale:0.32,alpha:0,duration:280,onComplete:()=>c.destroy()}); }
  // v5.49: งบเอฟเฟกต์ต่อเฟรม — เกินแล้วข้ามภาพ (ดาเมจยังทำงานปกติ)
  fxOk(){ const f=this.game.loop.frame; if(this._fxFrame!==f){this._fxFrame=f;this._fxN=0;} return ++this._fxN<=FX_PER_FRAME-PERF.lvl*2; }
  // v5.50: เพดานมอนจริง = ฐาน × ระดับประหยัด
  applyPerfLive(){ if(this._baseMaxLive)this.maxLive=Math.max(20,Math.round(this._baseMaxLive*(1-0.15*PERF.lvl))); }
  tickPerf(dt){
    const q=perfQuality(); if(q===1){if(PERF.lvl!==2){PERF.lvl=2;this.applyPerfLive();}return;} if(q===2){if(PERF.lvl!==0){PERF.lvl=0;this.applyPerfLive();}return;}
    PERF.acc+=dt; if(PERF.acc<1)return; PERF.acc=0; const fps=this.game.loop.actualFps||60;
    if(fps<42){PERF.low++;PERF.high=0;}else if(fps>55){PERF.high++;PERF.low=0;}else{PERF.low=0;PERF.high=0;}
    PERF.hold=Math.max(0,(PERF.hold||0)-1);   // v8.1.41 เจ้าของ: ลดเอฟเฟกต์แล้วค้างไว้ ≥30 วิ ก่อนคืน (กันภาพกระพริบขึ้นลง)
    if(PERF.low>=3&&PERF.lvl<2){PERF.lvl++;PERF.low=0;PERF.high=0;PERF.hold=30;this.applyPerfLive();}
    else if(PERF.high>=10&&PERF.lvl>0&&!PERF.hold){PERF.lvl--;PERF.high=0;this.applyPerfLive();}
  }
  chainBolt(x1,y1,x2,y2,big=false){
    if(this.character==='taro'&&this._taro?.enabled){this.taroLightningVisual(x1,y1,x2,y2,false,big);return;}
    if(!this.fxOk())return;
    const len=this.dist(x1,y1,x2,y2), ang=Math.atan2(y2-y1,x2-x1);
    const bolt=this.camWorld(this.add.image(x1,y1,'vfx_chain_bolt').setOrigin(0,0.5).setDepth(7).setRotation(ang).setScale(len/256,0.42).setAlpha(0.95));
    this.tweens.add({targets:bolt,alpha:0,scaleY:0.18,duration:180,onComplete:()=>bolt.destroy()});
  }
  zap(x,y){
    if(this.character==='taro'&&this._taro?.enabled){this.taroLightningVisual(x,y-64,x,y,true);return;}
    if(!this.fxOk())return;
    if(this.textures.exists('fx_thunder')&&this.anims.exists('fx_thunder')){
      this.spawnFxAnim('fx_thunder',x,y,{scaleY:280/ASSET_FX.fx_thunder.fh,scaleX:2.4,depth:7,anchor:'bottom'});
      const fl=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xbfe3ff).setDepth(7).setScale(0.10).setAlpha(0.7));
      this.tweens.add({targets:fl,alpha:0,scale:0.32,duration:220,onComplete:()=>fl.destroy()}); return;
    }
    if(!this.add?.graphics||!this.tweens)return;const g=this.camWorld(this.add.graphics().setDepth(7)); g.lineStyle(3,0xfff2a8,1);
    g.beginPath(); g.moveTo(x,y-260); g.lineTo(x+Phaser.Math.Between(-14,14),y-130); g.lineTo(x,y); g.strokePath();
    const fl=this.camWorld(this.add.circle(x,y,22,0xfff2a8,0.6).setDepth(7));
    this.tweens.add({targets:[g,fl],alpha:0,duration:200,onComplete:()=>{ g.destroy(); fl.destroy(); }});
  }
  // v7.8.92 perf: รายชื่อผู้คุ้มกัน (ด่าน 6–9) และบอส/มินิ สร้างครั้งเดียวต่อเฟรม (เดิมวนศัตรูทุกตัวต่อการตี/ต่อกระสุน)
  _guardsNow(){ const f=this.game?.loop?.frame; if(f==null||this._gdF!==f){ this._gdF=f; const L=this._gdL||(this._gdL=[]),si=this.stageIndex; L.length=0;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&((o.mycoRole==='bulwark'&&si===6)||(o.nectarRole==='waxGuard'&&si===7)||(o.seasonRole==='equinoxGuard'&&si===8)||(o.rootRole==='barkGuard'&&si===9)))L.push(o); }); } return this._gdL; }
  _bigsNow(){ const f=this.game?.loop?.frame; if(f==null||this._bgF!==f){ this._bgF=f; const L=this._bgL||(this._bgL=[]); L.length=0;
      this.enemies.children.iterate(e=>{ if(e&&e.active&&(e.isBoss||e.isMini))L.push(e); }); } return this._bgL; }
  priorityBossTarget(maxD,x=this.player.x,y=this.player.y){
    const b=this.boss;
    if(b&&b.active&&(b.isBoss||b.isMini)&&(b.x-x)**2+(b.y-y)**2<=maxD*maxD)return b;
    if(this.mode!=='boss'&&this.mode!=='mini')return null;
    let best=null,bd=maxD*maxD;
    for(const e of this._bigsNow()){if(!e.active)continue;
      const d=(e.x-x)**2+(e.y-y)**2;if(d<bd){bd=d;best=e;}}
    return best;
  }
  nearestEnemy(maxD){ const fr=this.game.loop.frame,px=this.player.x,py=this.player.y; if(this._neF!==fr||this._nePX!==px||this._nePY!==py){ this._neF=fr; this._nePX=px; this._nePY=py; this._neC=new Map(); } const hit=this._neC.get(maxD); if(hit!==undefined&&(!hit||hit.active))return hit; const res=this._nearestEnemyRaw(maxD); this._neC.set(maxD,res); return res; }   // v6.92 จำผลต่อเฟรม (เรียก ~37 จุด)
  _nearestEnemyRaw(maxD){ const priority=this.priorityBossTarget(maxD);if(priority)return priority;let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2; if(d<bd){bd=d;best=e;} });
    return best; }
  strongestEnemy(maxD){const priority=this.priorityBossTarget(maxD);if(priority)return priority;let best=null,hp=-1,bd=maxD*maxD;this.enemies.children.iterate(e=>{if(!e||!e.active)return;const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2;if(d<=bd&&(e.hp||0)>hp){hp=e.hp||0;best=e;}});return best;}
  densestEnemy(maxD){const priority=this.priorityBossTarget(maxD);if(priority)return priority;let best=null,score=-1,bd=maxD*maxD,cand=[];this.enemies.children.iterate(e=>{if(e&&e.active&&(e.x-this.player.x)**2+(e.y-this.player.y)**2<=bd)cand.push(e);});for(const e of cand){let n=0;for(const o of cand)if((o.x-e.x)**2+(o.y-e.y)**2<145*145)n++;if(n>score){score=n;best=e;}}return best;}
  // chain: กระสุนเด้งไฟฟ้าไปศัตรูใกล้ ๆ ต่อกันเป็นทอด (สายฟ้าลูกโซ่)
  chainFrom(bullet,enemy){ if(!(bullet.chain>0))return; const hit=new Set([enemy]); let src=enemy;
    for(let j=0;j<bullet.chain;j++){ let nb=null,nd=300*300;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&!hit.has(o)){ const d=(o.x-src.x)**2+(o.y-src.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(!nb)break; hit.add(nb); this.chainBolt(src.x,src.y,nb.x,nb.y); this.damage(nb,bullet.dmg*0.55,nb.x,nb.y); src=nb; } }
  hitEnemy(bullet,enemy){ this._sgHit=!!bullet.sgPellet; const fr=!!bullet.frShot; if(fr)this._frDmg=true; try{ this._hitEnemyCore(bullet,enemy); this.hitNudge?.(enemy); } finally { this._sgHit=false; if(fr)this._frDmg=false; } }
  _hitEnemyCore(bullet,enemy){ if(!bullet.active||!enemy.active)return;
    if(bullet.mintEpoch!=null&&bullet.mintEpoch!==(this._artEpoch||0)){this.killBullet(bullet);return;}
    if(bullet.berrySeed){this.hitBerrySeed(bullet,enemy);return;}
    if(bullet.impaler){this.hitImpaler(bullet,enemy);return;}
    if(bullet.bubblePrison){
      const x=enemy.x,y=enemy.y,lvl=bullet.bubbleLevel||1,r=bullet.bubbleRadius||70,aw=!!bullet.bubbleAwaken,dmg=bullet.dmg||8,prisonHp=enemy.maxhp||0;
      this.killBullet(bullet);
      this.damage(enemy,dmg*0.45,x,y);
      if(enemy.active){ enemy.frozen=Math.max(enemy.frozen||0,enemy.isBoss?0.28:(0.62+lvl*0.10));
        const sc=Math.max(0.22,Math.min(0.62,((enemy.displayWidth||48)*1.55)/256));
        const cage=this.camWorld(this.add.image(enemy.x,enemy.y,'bubble').setDepth((enemy.depth||4)+1).setScale(sc).setAlpha(0.88));
        this.tweens.add({targets:cage,scaleX:sc*1.14,scaleY:sc*1.14,duration:180,yoyo:true,repeat:1});
        this.time.delayedCall(430+lvl*35,()=>{ const bx=enemy.active?enemy.x:x,by=enemy.active?enemy.y:y; cage.destroy();
          if(this.state!=='play'&&this.state!=='levelup')return;
          if(this.anims.exists('fx_bubble'))this.spawnFxAnim('fx_bubble',bx,by,{scale:(2*r)/CODE_FX.fx_bubble.fw,depth:6,anchor:'center'});
          const prisonBonus=Math.min(55,prisonHp*0.035);this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,bx,by)<r)this.damage(e,dmg*(aw?1.25:0.90)+prisonBonus,e.x,e.y); });
          this.hitCratesInRadius(bx,by,r,dmg); this.vfxHitRing(bx,by,0x80e8d0,true); Sfx.boom();
        }); }
      return;
    }
    if(bullet.iceNeedle){ if(bullet.shatterState?.targets.has(enemy))return; if(!bullet.shatterInfo&&bullet.hitCd>0)return; bullet.hitCd=bullet.shatterInfo?0:(bullet.hitGapV||0.10); const nd=bullet.iceNeedle;
      const frozenNow=enemy.frozen>0||this.glacierBrittle(enemy);
      this.damage(enemy,bullet.dmg*(frozenNow?nd.frozenBonus*(nd.shatter?1.25:1):1),bullet.x,bullet.y);
      if(enemy.active)this.mintChill(enemy,nd.freeze);if(this.heroFxThrottle?.('needle',4,100))this.heroFx?.(this.mintOutlineKey?.('bpx_mint_needle_hit')||'bpx_mint_needle_hit',bullet.x,bullet.y,34);
      if(nd.shatter){ const r=52+nd.lvl*5; this.burst(bullet.x,bullet.y,0x8fd0ff); this.enemies.children.iterate(e=>{ if(e&&e.active&&e!==enemy&&this.dist(e.x,e.y,bullet.x,bullet.y)<r)this.damage(e,nd.dmg*0.5,e.x,e.y); }); }
      // Frost Lance: แตกเมื่อครบจำนวนเป้าที่เจาะได้ หรือทันทีเมื่อโดนบอส
      if(bullet.shatterInfo&&bullet.shatterState&&!bullet.shatterState.done){ const si=bullet.shatterInfo,st=bullet.shatterState; st.targets.add(enemy); st.hits++;
        if(st.hits>=si.pierces||enemy.isBoss||enemy.isMini){st.done=true;this.frostShatterBurst(bullet.x,bullet.y,si.ang,si.count,si.dmg,si.freeze,si.fb,si.blizzard,si.lvl);this.killBullet(bullet);} return; }
      bullet.pierceLeft=(bullet.pierceLeft||1)-1; if(bullet.pierceLeft<=0)this.killBullet(bullet); return; }
    const _bd=this.pathBulletDmg(bullet,enemy);
    if(bullet.pierce){
      if(bullet.seedPierce){bullet.hitTargets=bullet.hitTargets||new Set();if(bullet.hitTargets.has(enemy))return;bullet.hitTargets.add(enemy);}
      else {if(bullet.hitCd>0)return;bullet.hitCd=bullet.hitGapV||0.16;}
      this.damage(enemy,_bd,bullet.x,bullet.y);this.momoSeedPop?.(bullet.x,bullet.y);
      if(bullet.seedPop>0){const pr=bullet.seedPop,r=46+pr*14,pd=bullet.dmg*(0.25+pr*0.12);this.burst(bullet.x,bullet.y,0xff6b8a);this.enemies.children.iterate(o=>{if(o&&o.active&&o!==enemy&&this.dist(o.x,o.y,bullet.x,bullet.y)<r)this.damage(o,pd,o.x,o.y);});}
      this.chainFrom(bullet,enemy);return; }
    this.damage(enemy,_bd,bullet.x,bullet.y);this.momoSeedPop?.(bullet.x,bullet.y);if(enemy.active&&bullet.knockback&&!enemy.isBoss&&!enemy.isMini){const a=Math.atan2(enemy.y-this.player.y,enemy.x-this.player.x);enemy.setVelocity(Math.cos(a)*bullet.knockback,Math.sin(a)*bullet.knockback);enemy.knock=0.22;} this.chainFrom(bullet,enemy);
    if(bullet.seedPop>0){ const pr=bullet.seedPop,r=46+pr*14,pd=bullet.dmg*(0.25+pr*0.12); this.burst(bullet.x,bullet.y,0xff6b8a); this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==enemy&&this.dist(o.x,o.y,bullet.x,bullet.y)<r)this.damage(o,pd,o.x,o.y); }); }   // Juicy Burst: เมล็ดแตกกระเซ็นโดนรอบข้าง
    if(bullet.firePool)this.cocoaPool(bullet.x,bullet.y,bullet.firePool,bullet.dmg*(bullet.firePoolT>1.5?.35:.2)*(1+.3*(this.basicAttack?.lv?.p_ember||0)+this.ptv('ffBurn')),bullet.firePoolT||1.2);
    if(bullet.explode){ if(bullet._bpBoom)this.bpFx?.(bullet._bpBoom,bullet.x,bullet.y,bullet.explode*2.4); if(bullet._uqRocket&&(this.time.now-(this._heatFxAt||0)>1500)){this._heatFxAt=this.time.now;this.fxHeatScreen?.();} if(bullet._uqRocket)Sfx.bp?.('uq_rocket_detonation',.6,.6)||Sfx.bp?.('cocoa_fire_explosion',.55,.09); else if(bullet._bpBoom==='bpx_cocoa_explode')Sfx.bp?.('cocoa_fire_explosion',.55,.09); this.explodeAt(bullet.x,bullet.y,bullet.explode,bullet.dmg*0.8);if(bullet.sticky)this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini&&this.dist(e.x,e.y,bullet.x,bullet.y)<bullet.explode)e.frozen=Math.max(e.frozen||0,0.45);});this.killBullet(bullet); return; }   // จรวดระเบิด AoE
    if(bullet.bounce>0){ bullet.bounce--; bullet._bounced=true; if(bullet.bounceGain)bullet.dmg*=1+bullet.bounceGain; this.ptOnBounce(bullet,enemy);
      let nb=null,nd=(360*(bullet.seekMul||1))**2;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==enemy){ const d=(o.x-bullet.x)**2+(o.y-bullet.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(nb&&bullet.body){ const sp=bullet.body.velocity.length()||460, ang=Math.atan2(nb.y-bullet.y,nb.x-bullet.x);
        this.physics.velocityFromRotation(ang,sp,bullet.body.velocity); return; } }
    if(bullet.boomer2&&!bullet._boomed&&bullet._bounced&&bullet.body&&this.player){bullet._boomed=true;bullet.pierce=true;bullet.life=Math.max(bullet.life||0,0.9);const a=Math.atan2(this.player.y-bullet.y,this.player.x-bullet.x);this.physics.velocityFromRotation(a,bullet.body.velocity.length()||700,bullet.body.velocity);return;}
    this.killBullet(bullet); }
  ptOnBounce(b,enemy){ {const hs=this.basicAttack?.path==='ricochet'?(this.basicAttack.lv?.r_spark||0):0;if(hs&&enemy&&Math.random()<.15*hs){let t=null,td=170;this.enemies.children.iterate(o=>{if(o&&o.active&&o!==enemy&&o.hp>0){const d=this.dist(o.x,o.y,enemy.x,enemy.y);if(d<td){td=d;t=o;}}});if(t){this.chainBolt?.(enemy.x,enemy.y,t.x,t.y);this.damage(t,(b.dmg||8)*.4,t.x,t.y);}}}   // v7.9.23 Heart Spark
    const PT=(this.player&&this.player._pt)||{};
    if(PT.sip){this._ptBounces=(this._ptBounces||0)+1;if(this._ptBounces>=20){this._ptBounces=0;const P=this.player;P.hp=Math.min(P.maxhp,P.hp+P.maxhp*0.01*PT.sip);}}
    if(b.loopT&&this.dist(b.x,b.y,this.player.x,this.player.y)<120&&(this.elapsed||0)>=(this._ptLoopAt||0)){this._ptLoopAt=(this.elapsed||0)+6;this._shield=Math.min(2,(this._shield||0)+1);this.popDmg('🍬 SHIELD',this.player.x,this.player.y-30,false);}
    if(b.splitCh&&!b._split&&Math.random()<b.splitCh){const c=b.berrySeed?this.berryBullet(b.x,b.y,b.scaleX||.13,b.berrySeed.basic):this.getBullet(b.x,b.y,0xffffff,b.scaleX||.13);if(c){b._split=true;c.setTexture('proj_sprinkle').setTint(0xff7bd5);c.faceVel=true;c.dmg=b.dmg*0.6;c.life=1.2;c.pierce=false;c.hitGapV=0.16;c.bounce=1;c.homing=0;c._split=true;c.headshot=0;c.bigMul=0;c.closeMul=0;c.bounceGain=0;c.seedPierce=false;c.penGain=0;c.forceHs=false;c.cqMul=0;c.dragon=false;c.lastMul=0;c.seekMul=1;c.splitCh=0;c.boomer2=false;c.loopT=false;if(c.berrySeed)Object.assign(c.berrySeed,{path:b.berrySeed.path,evolved:false,base:c.dmg,visited:new Map(b.berrySeed.visited),splashed:b.berrySeed.splashed});const t=this.nearestEnemy(400);const a=t&&t!==enemy?Math.atan2(t.y-b.y,t.x-b.x):Math.random()*Math.PI*2;this.physics.velocityFromRotation(a,700,c.body.velocity);}} }
  // v6.55.44: ตารางจับคู่ mod ชิ้นที่ใส่ ↔ ชิ้นที่เลือก + สรุปบรรทัดเดียว
  // v6.55.48: ตัวหนังสือขั้นต่ำ (หน้า Equipment/Craft) — ห่อ add.text ชั่วคราวระหว่างวาดหน้า
  _clampFonts(min){ const add=this.add,f=add.text; add.text=function(x,y,t,st){ if(st&&st.fontSize){const n=parseFloat(st.fontSize);if(n<min)st=Object.assign({},st,{fontSize:min+'px'});} return f.call(add,x,y,t,st); }; return ()=>{ delete add.text; if(add.text!==f)add.text=f; }; }
  drawModCompare(eqIt,selIt,isEq,y,w,maxY){ if(!selIt)return y;
    // v7.8.67 เจ้าของ: เลิกตารางเทียบ — บอกว่าชิ้นนี้มี mod อะไร + แต่ละตัวทำอะไร
    const lines=[],ib=GEAR_ALL.find(g=>g.id===selIt.baseId),im=ensureImplicit(selIt),idf=im&&implicitDef(im.id),active=gearActiveAffixes(selIt),mods=(selIt.affixes||[]).map(a=>({a,d:affixDef(a.id)})).filter(x=>x.d);
    if(idf)lines.push({t:'◇ '+idf.emoji+' '+modLine(idf,im.v),c:IMPLICIT_COLOR[idf.rank],d:MOD_EFFECT[idf.id]?'':modDesc(idf)});else if(ib&&ib.unique)lines.push({t:'★ Unique',c:'#ff8f3a',d:ib.desc||''});
    for(const {a,d} of mods){const open=active.includes(a),fit=open&&forgeModFits(d),tc=open?(MOD_TIER_COLOR[tierStars(d,a.t)]||MOD_TIER_COLOR[1]):'#8a809a';lines.push({t:(open?'':'🔒 Inactive · ')+d.emoji+' '+modLine(d,a.v)+(fit?'  ✓':''),c:tc,r:tierStarText(d,a.t),rc:tc,d:open?(MOD_EFFECT[d.id]?'':(fit?'✓ Fits your hero · ':'')+modDesc(d)):'Saved mod · requires higher item level'});}   // v7.8.95 สีตามขั้น mod
    if(!mods.length)lines.push({t:'No mods yet · tap Craft to add some',c:'#8a809a'});
    /* v7.8.102 เจ้าของ: หน้า Equipment ห้ามเลื่อน → ถ้าสูงเกิน maxY ตัดคำอธิบายก่อน แล้วค่อยตัดบรรทัด (+N more) */
    let compact=false; const hOf=()=>24+lines.reduce((n,l)=>n+(compact||!l.d?24:36),0)+4;
    if(maxY&&y+hOf()>maxY){compact=true; const cap=Math.max(1,Math.floor((maxY-y-28)/24)); if(lines.length>cap){const k=lines.length-cap+1;lines.splice(cap-1);lines.push({t:'+'+k+' more mod'+(k>1?'s':'')+' · open Craft to see all',c:'#a99fbb'});}}
    const free=[0,1,2,3,4,5].filter(i=>forgeLineOpen(selIt,i)&&!forgeLines(selIt)[i]).length,rh=l=>(compact||!l.d)?24:36,top=y,h=hOf(),g=this.add.graphics();
    const J=this._jrSkin; if(J)this.jrPanel('jr_panel',0,14,top-2,w-28,h+4,.3); else {g.fillStyle(0x221a30,0.96);g.fillRoundedRect(14,top,w-28,h,10);g.lineStyle(1,0x5a4f6e,0.9);g.strokeRoundedRect(14,top,w-28,h,10);} this.menu.add(g);
    this.menu.add(this.add.text(J?24:22,top+(J?5:6),'MODS · +'+gearEffectiveEnhance(selIt)+' / '+gearEnhanceCap(selIt)+' cap',{fontFamily:J?'Georgia, serif':'NunitoUI, sans-serif',fontStyle:'bold',fontSize:J?'12px':'10px',color:'#ffd9a0'}));
    this.menu.add(this.add.text(w-22,top+6,free?'🛠 '+free+' free slot'+(free>1?'s':''):'🛠 slots full',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'9px',color:free?'#7de0a1':'#a99fbb'}).setOrigin(1,0));
    let ry=top+22;
    lines.forEach((l,i)=>{ const hh=rh(l); if(J){if(i>0)this.jrImg('jr_divider',0,w/2,ry-1,w-52,10)?.setAlpha(.8);} else if(i%2===0){const zb=this.add.graphics();zb.fillStyle(0xffffff,0.045);zb.fillRect(16,ry-1,w-32,hh);this.menu.add(zb);}
      const t=this.add.text(22,ry+3,l.t,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:l.c});const room=w-44-(l.r?40:0);if(t.width>room)t.setScale(room/t.width);this.menu.add(t);
      if(l.r)this.menu.add(this.add.text(w-22,ry+3,l.r,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:l.rc||'#a99fbb'}).setOrigin(1,0));
      if(l.d&&!compact){const dt=this.add.text(22,ry+18,l.d,{fontFamily:'NunitoUI, sans-serif',fontSize:'9.5px',color:'#b9abc5'});if(dt.width>w-44)dt.setScale((w-44)/dt.width);this.menu.add(dt);}
      ry+=hh; });
    return top+h+6; }
  ptOnFreeze(e){ const PT=(this.player&&this.player._pt)||{};
    if(PT.fnova&&(this.elapsed||0)>=(this._ptNovaAt||0)){this._ptNovaAt=(this.elapsed||0)+0.25;const d=this.relicDmg?this.relicDmg(1.2):20;this.vfxHitRing(e.x,e.y,0xbdf0ff,false);this.enemies.children.iterate(o=>{if(o&&o.active&&o!==e&&this.dist(o.x,o.y,e.x,e.y)<95)this.damage(o,d,o.x,o.y);});}
    if(PT.farmor)this._ptArmorT=(this.elapsed||0)+3; }
  ptSkinBurst(){ const PT=(this.player&&this.player._pt)||{}; if(!PT.skin||(this.elapsed||0)<(this._ptSkinAt||0))return; this._ptSkinAt=(this.elapsed||0)+1.5;
    for(let i=0;i<3*PT.skin;i++){const c=this.getBullet(this.player.x,this.player.y,0xffffff,0.13);if(!c)break;c.setTexture('proj_sprinkle').setTint(0x5ad1ff);c.faceVel=true;c.dmg=(5.25+(this.skills.sprinkle||1)*1.5)*(this.player.dmgMul||1);c.life=1.4;c.pierce=false;c.hitGapV=0.16;c.bounce=2;c.homing=0;c.headshot=0;c.bigMul=0;c.closeMul=0;c.bounceGain=0;c.seedPierce=false;c.penGain=0;c.forceHs=false;c.cqMul=0;c.dragon=false;c.lastMul=0;c.seekMul=1;c.splitCh=0;c.boomer2=false;c.loopT=false;this.physics.velocityFromRotation(i*Math.PI*2/(3*PT.skin),720,c.body.velocity);} }
  tickPathTalents(dt){ const P=this.player; if(!P||!P._pt)return; const v=P.body?P.body.velocity.length():0; if(v<20)this._ptStill=(this._ptStill||0)+dt; else {this._ptStill=0;this._ptGhUsed=false;} }
  autoFusion(){ const fu=this.fusionReady(),b=this.basicAttack; if(!fu||!b)return; b.mods=(b.mods||[]).concat(fu.id); this.syncBasicAttack(); this.showBanner('🧬 '+fu.emoji+' '+fu.name,'Evolution + '+((RELICS[fu.relic]||{}).name||'Relic')+' · '+fu.desc,2200); Sfx.bp?.('shared_build_evolution',.6,1); }
  fusionReady(){ const b=this.basicAttack; if(!b||!b.evolved)return null; const L=FUSIONS[b.character]||[]; return L.find(f=>this._rel&&this._rel[f.relic]&&!(b.mods||[]).includes(f.id))||null; }
  modList(){ const b=this.basicAttack; return (b&&b.mods&&b.mods.length)?b.mods.map(modDef).filter(Boolean):null; }
  modDmgMul(e){ const L=this.modList(); if(!L)return 1; let m=1; const P=this.player,v=P.body?P.body.velocity.length():0,dd=this.dist(P.x,P.y,e.x,e.y);
    for(const d of L){ const k=d.kind;
      if(k==='stillPower'&&v<20)m*=d.mul; else if(k==='movePower'&&v>40)m*=d.mul; else if(k==='closeBonus'&&dd<d.r)m*=d.mul; else if(k==='farBonus'&&dd>d.r)m*=d.mul;
      else if(k==='killCharge'&&this._killChg>=d.n&&!this.taroIsSecondary?.()){ this._killChg=0; m*=d.mul; this.floatText?.(e.x,e.y-30,'🔋',0xffe066); }
      else if(k==='dashRage'&&this._rageStk>0)m*=1+0.06*this._rageStk;
      else if(k==='execute'&&e.hp<e.maxhp*d.hp)m*=d.mul; else if(k==='bossBonus'&&(e.isBoss||e.isMini||e.isElite))m*=d.mul; else if(k==='frozenMul'&&(e.frozen>0||this.glacierBrittle(e)))m*=d.mul;
      else if(k==='nthHit'&&!this.taroIsSecondary?.()){ this._modHits=(this._modHits||0)+1; if(this._modHits%d.n===0){ m*=d.mul; this.floatText&&this.floatText(e.x,e.y-30,d.emoji,0xffd166); if(d.boom)this.modBoom(e.x,e.y,d.boom,d.mul*0.5); } } }
    return m; }
  modBoom(x,y,r,mul,freeze){ if(this._modTick)return; const t=this.elapsed||0; if(t-(this._modBT||0)>0.25){this._modBT=t;this._modBN=0;} if(++this._modBN>8)return; this._modTick=true; this.explodeAt(x,y,r,this.relicDmg(mul)); if(freeze)this.modFreeze(x,y,r); this._modTick=false; }
  modFreeze(x,y,r){ this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.applyFreeze(e,0.6,false); }); }
  // v6.67: item Play mods
  gearModBoom(x,y,r,mul,col){ if(this._gmTick)return; this._gmTick=true; this.explodeAt(x,y,r,this.relicDmg(mul)); this._gmTick=false; if(col&&this.fxOk&&this.fxOk()){const c=this.camWorld(this.add.circle(x,y,r,col,0.18).setStrokeStyle(3,col,0.8).setDepth(8));this.tweens.add({targets:c,alpha:0,scale:1.15,duration:260,onComplete:()=>c.destroy()});} }
  gearCritArc(e,amount){ const t=this.elapsed||0; if(t<(this._critArcAt||0))return; this._critArcAt=t+0.15; this._gmTick=true; let n=0;
    this.enemies.children.iterate(o=>{ if(n>=2||!o||!o.active||o===e||this.dist(o.x,o.y,e.x,e.y)>220)return; n++; this.chainBolt(e.x,e.y,o.x,o.y); this.damage(o,amount*this.player.gearCritArc,o.x,o.y); }); this._gmTick=false; }
  gearKillShell(){ this._ksAcc=(this._ksAcc||0)+this.player.gearKillShell; if(this._ksAcc<100)return; this._ksAcc-=100; if((this._shield||0)<2){ this._shield=(this._shield||0)+1; this.floatText(this.player.x,this.player.y-44,'🫧 Kill Shell',0x9fe8ff); } }
  modOnHit(e){ const L=this.modList(); if(!L||this._modTick)return; const pm=this.taroIsSecondary?.()?.25:1;   /* v7.8.80 เจ้าของเลือก ข.: ดาเมจรองของ Taro (ลูกแตก Spark/ลูกบอล/Beacon) ติด on-hit ได้ แต่โอกาส ×1/4 · กันวนซ้ำด้วย _modTick + modBoom ≤8 ต่อ 0.25 วิ */
    for(const d of L){ if(d.kind==='hitBoom'&&Math.random()<d.p*pm)this.modBoom(e.x,e.y,d.r,d.mul);
      else if(d.kind==='stackShock'&&!this.taroIsSecondary?.()){ if(e._shockMod!==d.id){e._shockMod=d.id;e._shockN=0;} if(++e._shockN>=d.n){ e._shockN=0; this._modTick=true; this.chainBolt?.(e.x,e.y-60,e.x,e.y); this.damage(e,this.relicDmg(d.mul),e.x,e.y); this._modTick=false; if(!e.isBoss&&!e.isMini&&e.active){e.knock=Math.max(e.knock||0,0.6);e.setVelocity?.(0,0);} } }   // v7.9.19 Static Buildup
      else if(d.kind==='hitChain'&&Math.random()<d.p*pm){ this._modTick=true; let n=0; this.enemies.children.iterate(o=>{ if(n>=d.n||!o||!o.active||o===e||this.dist(o.x,o.y,e.x,e.y)>200)return; n++; this.chainBolt(e.x,e.y,o.x,o.y); this.damage(o,this.relicDmg(d.mul),o.x,o.y); if(d.freeze&&!o.isBoss&&!o.isMini)o.frozen=Math.max(o.frozen||0,0.5); }); this._modTick=false; } } }
  modOnKill(e){ const L=this.modList(); if(!L||this.taroIsSecondary?.())return; const x=e.x,y=e.y;
    const fz=e.frozen>0||this.glacierBrittle?.(e);
    for(const d of L){ if(d.kind==='killCharge'&&(this._killChg||0)<d.n)this._killChg=(this._killChg||0)+1;
      if(d.kind==='frozenKill'&&fz)this.time.delayedCall(40,()=>{ if(this.state==='play')this.modBoom(x,y,d.r,d.mul,true); });   // v7.9.19 Ice Breaker
      else if(d.kind==='killBurst'&&Math.random()<d.p)this.time.delayedCall(40,()=>{ if(this.state==='play')this.modBoom(x,y,d.r,d.mul); });
      else if(d.kind==='killTrap'&&Math.random()<0.35){ const blob=this.camWorld(this.add.circle(x,y,9,d.freeze?0x9fe8ff:0xff7aa8,0.9).setDepth(8).setStrokeStyle(2,0xffffff));
        this.tweens.add({targets:blob,scale:1.4,duration:260,yoyo:true,repeat:1}); this.time.delayedCall(650,()=>{ if(blob.active)blob.destroy(); if(this.state==='play')this.modBoom(x,y,70,d.mul,d.freeze); }); } } }
  modOnDash(dir){ const L=this.modList(); if(!L)return; const P=this.player;
    for(const d of L){ if(d.kind==='dashRage'){ this._rageStk=Math.min(5,(this._rageStk||0)+1); this.floatText?.(P.x,P.y-50,'🔥×'+this._rageStk,0xff8a3d); }   // v7.9.19 Rolling Rage
      else if(d.kind==='dashSeeds'){ for(let i=0;i<d.n;i++){ const c=this.getBullet(P.x,P.y,0xffffff,0.13); if(!c)break; c.setTexture('proj_sprinkle').setTint(0xff9ec4); c.faceVel=true; c.dmg=(5.25+(this.skills.sprinkle||1)*1.5)*1.2*(P.dmgMul||1); c.life=1.1; c.pierce=false; c.hitGapV=0.16; c.bounce=1; c.homing=0; c.headshot=0; c.bigMul=0; c.closeMul=0; c.bounceGain=0; c.seedPierce=false; c.penGain=0; c.forceHs=false; c.cqMul=0; c.dragon=false; c.lastMul=0; c.seekMul=1; c.splitCh=0; c.boomer2=false; c.loopT=false; this.physics.velocityFromRotation(i*Math.PI*2/d.n,700,c.body.velocity); } }   // v7.9.19 Petal Kick
      else if(d.kind==='dashNova')this.time.delayedCall(200,()=>{ if(this.state==='play')this.modBoom(P.x,P.y,d.r,d.mul); });
      else if(d.kind==='dashTrail'){ const x0=P.x,y0=P.y; for(let i=0;i<3;i++){ const x=x0+dir.x*45*i,y=y0+dir.y*45*i; this.time.delayedCall(450+i*70,()=>{ if(this.state==='play')this.modBoom(x,y,65,d.mul); }); } } } }
  modTick(dt){ const L=this.modList(); if(!L||this.state!=='play')return; this._modT=this._modT||{};
    for(const d of L){ if(d.kind==='skyStrike'){ this._modT[d.id]=(this._modT[d.id]||0)+dt; if(this._modT[d.id]>=d.every){ this._modT[d.id]=0; const v=this.cameras?.main?.worldView; let t=null; this.enemies.children.iterate(e=>{ if(e&&e.active&&e.hp>0&&(!v||v.contains(e.x,e.y))&&(!t||e.hp>t.hp))t=e; }); if(t){ this.chainBolt?.(t.x,t.y-220,t.x,t.y); this.modBoom(t.x,t.y,d.r,d.mul); } } continue; }   // v7.9.19 Sky Judge
      if(d.kind!=='pulse')continue; this._modT[d.id]=(this._modT[d.id]||0)+dt; if(this._modT[d.id]>=d.every){ this._modT[d.id]=0; this.modBoom(this.player.x,this.player.y,d.r,d.mul,d.freeze); } } }
  modCard(){ const b=this.basicAttack; if(!b)return null; const set=MODIFIERS[b.character]||MODIFIERS.momo,have=(b.mods||[]).filter(id=>!id.startsWith('f_')); if(have.length>=MOD_MAX)return null;
    const pool=set.filter(m=>!have.includes(m.id)&&!this.banishedKeys?.['b:'+m.id]); if(!pool.length)return null; const m=Phaser.Utils.Array.GetRandom(pool);
    return {type:'basic',key:m.id,lvl:1,max:1,kind:'Modifier',special:true,color:0xff9f43,emoji:m.emoji,title:m.name,desc:m.desc+'  ·  '+(have.length+1)+'/'+MOD_MAX,headline:'🧩 '+m.desc,iconKey:this.textures?.exists?.('mod_'+m.id.slice(2))?'mod_'+m.id.slice(2):SKILL_ICON[(this.basicAttackInfo()||{}).skill],
      apply:()=>{ b.mods=(b.mods||[]).concat(m.id); this.syncBasicAttack(); this.showBanner('🧩 '+m.emoji+' '+m.name,m.desc,1700); Sfx.clear(); }}; }
  tradeCard(){ const b=this.basicAttack; if(!b)return null; const have=b.trades||[]; if(have.length>=TRADE_MAX)return null;
    const pool=TRADEOFFS.filter(t=>!have.includes(t.id)&&!this.banishedKeys?.['b:'+t.id]); if(!pool.length)return null; const t=Phaser.Utils.Array.GetRandom(pool);
    return {type:'basic',key:t.id,lvl:1,max:1,kind:'Trade-off',special:true,color:0xe0566e,emoji:t.emoji,title:t.name,desc:'✅ '+t.gain+'   ❌ '+t.cost+(t.reward?'   🎁 '+t.reward:''),headline:'⚖️ '+t.gain+' · '+t.cost+(t.reward?' · 🎁 '+t.reward:''),iconKey:this.textures?.exists?.('trade_'+t.id.slice(2))?'trade_'+t.id.slice(2):SKILL_ICON[(this.basicAttackInfo()||{}).skill],
      apply:()=>{ b.trades=(b.trades||[]).concat(t.id); t.apply(this.player); clampPlayerStats(this.player); if(this.drawBars)this.drawBars(); this.syncBasicAttack(); this.showBanner('⚖️ '+t.emoji+' '+t.name,'✅ '+t.gain+'  ·  ❌ '+t.cost,1900); Sfx.clear(); }}; }
  // v6.59.9 Infuse ที่เข้ากับสาย Chocolate
  cocoaInfMatch(inf){const b=this.basicAttack;if(this.character!=='cocoa'||!b?.path)return null;const M={brawler:{spicy:'Burn ×1.5'},titan:{sour:'Release marks foes +25% dmg taken 4s',sweet:'Blood Rage costs 30% less HP'},dashboxer:{minty:'Dash Leap landing freezes foes'}};return M[b.path]?.[inf]||null;}
  cocoaHasInf(inf){const b=this.basicAttack;return b?.infusion===inf||b?.infusion2===inf;}
  infusionPow(){ const b=this.basicAttack; return 1+0.35*((b&&b.lv&&b.lv.inf_deep)||0); }
  // v7.8.88 สถานะกลาง: ติดไฟ/แช่แข็งทุกแหล่งของผู้เล่นใช้ 2 ฟังก์ชันนี้ (บอส/มินิไม่โดนแช่)
  applyBurn(e,add,cap,t=2){ if(!e||!e.active)return; const cur=e._burnDps||0; e._burnDps=Math.min(cur+add,Math.max(cap,cur)); e._burnT=Math.max(e._burnT||0,t); }
  applyFreeze(e,t,tint=true){ if(!e||!e.active||e.isBoss||e.isMini||!(t>0))return false; e.frozen=Math.max(e.frozen||0,t); if(tint&&e.setTint)e.setTint(COLORS.ice); return true; }
  infusionOnHit(e,amount,inf){ const pw=this.infusionPow();
    if(inf==='spicy'){ const bm=this.character==='cocoa'&&this.basicAttack?.path==='brawler'?1.5:1; this.applyBurn(e,amount*0.30*pw*bm/2,amount*0.6*pw*bm); }
    else if(inf==='sour'){ e._sourT=3; e._sourPow=pw; }
    else if(inf==='sweet'){ const now=this.elapsed||0; if(now>=(this._sweetCd||0)){ this._sweetCd=now+0.3; const p=this.player; p.hp=Math.min(p.maxhp,p.hp+Math.max(0.5,p.maxhp*0.005*pw)); } }
    else if(inf==='minty'){ if(Math.random()<0.30)this.applyFreeze(e,0.35*pw,false); } }
  tickInfusion(dt){ const b=this.basicAttack; if(!b)return; this._infAcc=(this._infAcc||0)+dt; if(this._infAcc<0.25)return; const step=this._infAcc; this._infAcc=0;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(e._sourT>0)e._sourT-=step;
      if(e._burnT>0){ e._burnT-=step; this._infTick=true; this.damage(e,(e._burnDps||0)*step,e.x,e.y); this._infTick=false; if(Math.random()<0.3)this.burst&&this.burst(e.x,e.y,0xff5a3d); if(e._burnT<=0)e._burnDps=0; } }); }
  shotgunFeedbackTrail(b,angle){
    const live=this._shotgunTrails||(this._shotgunTrails=new Set());
    if(live.size>=12)return;
    const trail=this.feedbackSprite('sg92_pellet_trail',b.x,b.y,32,16,b.depth-1,true);
    if(!trail)return;
    b._shotgunTrail=trail.setOrigin(.85,.5).setRotation(angle).setAlpha(.76); live.add(trail);
    trail.once('destroy',()=>{live.delete(trail);if(b._shotgunTrail===trail)b._shotgunTrail=null;});
  }
  shotgunKick(ang,repeat=false,aim=ang,double=false){ const pl=this.player;
    const x=pl.x+Math.cos(aim)*20,y=pl.y+Math.sin(aim)*20;
    const fireFx=(key,width)=>this.realTex?.(key)&&this.heroFx?.(key,x,y,width,{rot:aim,depth:90450,anchor:'left'});
    const painted=repeat?fireFx('sg92_muzzle_echo',90):
      (double&&fireFx('sg92_double_barrel',150))||fireFx('sg_new_primary',122);
    if(painted){}
    else if(this.realTex?.('bpx_momo810_muzzle')&&this.heroFx?.('bpx_momo810_muzzle',pl.x+Math.cos(ang)*20,pl.y+Math.sin(ang)*20,140,{rot:ang,depth:90450,life:.15,fade:0})){}
    else if(this.textures.exists('vfx_shotgun_muzzle'))this.trackArtVfx(this.spawnFxAnim('vfx_shotgun_muzzle',pl.x+Math.cos(ang)*20,pl.y+Math.sin(ang)*20,{scale:0.55,rotation:ang,depth:90450,normal:true}));
    else {const g=this.trackArtVfx(this.camWorld(this.add.graphics().setDepth(90450))); g.fillStyle(0xfff1a8,0.75); g.slice(pl.x,pl.y,70,ang-0.45,ang+0.45,false); g.fillPath(); g.fillStyle(0xffffff,0.9); g.fillCircle(pl.x+Math.cos(ang)*26,pl.y+Math.sin(ang)*26,9);
    this.tweens.add({targets:g,alpha:0,duration:120,onComplete:()=>g.destroy()});} this.screenShake(130,double?.009:0.0075); if(Sfx.shotgun)Sfx.shotgun(); this.jelly&&this.jelly(-Math.cos(ang)*0.18,-Math.sin(ang)*0.18); }
  pathBulletDmg(b,e){ let d=b.dmg;
    if(b._fist){const hs=this.basicAttack?.lv?.p_streak||0;if(hs){const T=this.elapsed||0;if(T>(this._hotT||0))this._hotN=0;this._hotN=Math.min(10,(this._hotN||0)+1);this._hotT=T+3;d*=1+.02*hs*this._hotN;}}   /* v7.9.23 Hot Streak */   // 🛤 Build Path: ตัวคูณตามสาย (sniper/shotgun)
    if(b.bigMul&&(e.isBoss||e.isMini||e.isElite))d*=1+b.bigMul;
    if(b.penGain&&b.hitTargets)d*=1+b.penGain*Math.max(0,b.berrySeed?b.hitTargets.size:b.hitTargets.size-1);
    if(b.forceHs||(b.headshot&&Math.random()<b.headshot)){b.forceHs=false;d*=2.5;if(b.oneShot){if(e.isBoss||e.isMini)d*=1.6;else d=Math.max(d,e.hp+1);}this.popDmg('HEADSHOT',e.x,e.y-18,true);}
    const _pd=this.player?this.dist(e.x,e.y,this.player.x,this.player.y):999;
    const sgBig=b.sgPellet&&(e.isBoss||e.isMini);
    if(b.sgPellet){ d*=_pd<120?(sgBig?1+b.closeMul:2*(1+b.closeMul)):_pd<200?1+b.closeMul:_pd>260?0.6:1; }   /* v8.2.76 เจ้าของ: แนบบอสแล้วละลาย → บอส/มินิบอสไม่ได้ ×2 ในระยะ 120 */   // v6.55.62 ลูกซอง: ใกล้แรงมาก ไกลอ่อน
    else if(b.closeMul&&_pd<170)d*=1+b.closeMul;
    if(sgBig){ if(e._sgBlast!==b.sgBlast){e._sgBlast=b.sgBlast;e._sgN=0;} if(++e._sgN>(typeof SG_BOSS_FULL_PELLETS!=='undefined'?SG_BOSS_FULL_PELLETS:6))d*=.5; }   /* v8.2.76 เม็ดที่ 7+ ในนัดเดียวกันโดนบอสตัวเดิม = ครึ่งแรง */
    if(b.cqMul&&_pd<120)d*=1+b.cqMul;
    if(b.dragon)this.infusionOnHit(e,d,'spicy');
    if(b.lastMul&&(b.bounce||0)===0&&b._bounced)d*=1+b.lastMul;
    return d; }
  damage(e,amount,x,y,sesameOrbDamage){ if(!e.active)return;if(e._emergeUntil&&(this.time?.now||0)<e._emergeUntil)return;if(e._hhShell>0&&this.hhShellBlock?.(e))return;if(this.isSesRune?.())amount*=sesameOrbDamage??this.sesRuneStats().damage;const taroDirect=this.taroTakeDirect?.(e);
    // Phase Gate: Lockedดาเมจทันทีที่ชนเส้นเลือด และInvincibleจนแอนิเมชันเปลี่ยนเฟสจบ
    if((e.isBoss||e.isMini)&&(e._phaseGateLocked||(e._phaseInvuln||0)>0)){
      const now=this.elapsed||0;if(now>=(e._phaseImmunePopAt||0)){e._phaseImmunePopAt=now+0.38;this.popDmg('Invincible',x,y,false);}return;
    }
    // v6.17: Flat DMG แบบ PoE — บวกเข้าฐานก่อนตัวคูณทั้งหมด (dmgMul/Power/คริ/บอส/เงื่อนไข) · ไม่ใส่ใน dot
    if(!this._infTick&&!e.isDummy){ const b=this.basicAttack,ef=(b&&FLAT_EFF_PATH[b.path])||FLAT_EFF[this.character]||1; void ef; amount*=1+((this.player.flatDmg||0)+gearAttackRoll(this.player))*ATK_PCT; }
    if((e.isBoss||e.isMini)&&this._bossShield)amount*=0.45;
    if(e._podShield>0)amount*=0.3;   // v7.9.15 ฝักเกราะ (กลไกสนาม)
    if((e.isBoss||e.isMini)&&this.player.bossDmg)amount*=1+this.player.bossDmg;
    if(this._frRageT>0)amount*=this._frRageMul||1;   // v5.36 🍳 Rage
    if((e.isBoss||e.isMini)&&this._fr&&this._fr.length&&!this._frBusy)this.fireRecipes('bossHit');
    if((this.stageIndex>=6&&this.stageIndex<=9)&&!e.isBoss&&!e.isMini&&e.mycoRole!=='bulwark'&&e.nectarRole!=='waxGuard'&&e.seasonRole!=='equinoxGuard'&&e.rootRole!=='barkGuard'){let guarded=false;for(const o of this._guardsNow()){if(o!==e&&o.active&&(o.x-e.x)**2+(o.y-e.y)**2<30625){guarded=true;break;}}if(guarded)amount*=this.stageIndex===9?.78:this.stageIndex===8?.76:this.stageIndex===7?.74:.72;}   // Objective: บอสกางเกราะ = ลดดาเมจ 55% (เดิม 88% ทำให้บอสแทบInvincible = เหมือนBoss vanished) ยังตีเข้าได้
    { const pm=this.basicAttack&&this.basicAttack._pm; if(pm&&(pm.big||pm.frozen||pm.far||pm.low)){   // 🛤 Build Path: โบนัสตามเงื่อนไข
      if(pm.big&&(e.isBoss||e.isMini||e.isElite))amount*=1+pm.big;
      if(pm.frozen&&(e.frozen>0||this.glacierBrittle(e)))amount*=1+pm.frozen;
      if(pm.far&&this.dist(e.x,e.y,this.player.x,this.player.y)>300)amount*=1+pm.far;
      if(pm.low&&this.player.hp/Math.max(1,this.player.maxhp)<0.5)amount*=1+pm.low; } }
    if(this.basicAttack?.character==='mint'&&(e.isBoss||e.isMini)){ if(e._chill>0&&this.time.now-(e._chillAt||0)<=2500)amount*=1+0.04*Math.min(4,e._chill); if(this.basicAttack.path==='glacier'&&this.glacierBrittle(e))amount*=1.15; }   // v6.70 Chill/Brittle มีผลกับบอส
    if(this.basicAttack?.character==='mint'&&this.basicAttack.ranks.rime&&e._chill>0&&this.time.now-(e._chillAt||0)<=2500)amount*=1+0.10*this.basicAttack.ranks.rime;
    if(e._sourT>0)amount*=1+0.12*(e._sourPow||1);if(e._titanMarkT>(this.elapsed||0))amount*=1.25;if(e._shadowUntil>(this.elapsed||0))amount*=1+0.08*(e._shadowN||0);
    /* v7.8.79 เจ้าของ: การ์ดฮิตแล้วฮีล/ทำให้โดนแรงขึ้น — เดิมข้ามดาเมจรองของ Taro (ลูกแตก Spark = 73% ของดาเมจ, ลูกบอล Sentry/Beacon ทั้งหมด) · Infusion ไม่ทำดาเมจทันที (ไม่วนซ้ำ) และ Sweet มีคูลดาวน์ 0.3 วิ จึงให้ติดทุกฮิต */{ const inf=this.basicAttack&&this.basicAttack.infusion; if(inf&&!this._infTick&&!e.isDummy)this.infusionOnHit(e,amount,inf); } if(!this._infTick&&!e.isDummy){ const P=this.player; if(P._tagIgnite&&Math.random()<P._tagIgnite)this.infusionOnHit(e,amount,'spicy'); if(P._tagChill&&Math.random()<P._tagChill)this.applyFreeze(e,0.35,false); } if(!this._infTick&&!e.isDummy&&this.basicAttack&&this.basicAttack.mods)this.modOnHit(e);
    if(this.player.lowHpDmg&&this.player.hp/this.player.maxhp<0.40)amount*=1+this.player.lowHpDmg;
    if(this._taro?.mag&&!e.isDummy)amount*=this.taroMagMul?.(e)||1;   // v7.8.69 Magnetic Field
    if(!this._infTick&&!e.isDummy&&this.basicAttack&&this.basicAttack.mods)amount*=this.modDmgMul(e); if(!this._infTick&&!e.isDummy)amount*=this.condDmgMul(e)*(this._frDmg?1:(this.player.powerMul||1)); if(this.player._tdBerserk)amount*=1+Math.max(0,1-this.player.hp/Math.max(1,this.player.maxhp)); const RL=this._rel; if(RL){ if(RL.firstbite&&e.hp>=e.maxhp)amount*=this.relicSyn('firstbite','glass')?1.70:1.35; if(!e.isDummy)amount*=this.relicDmg89(e,RL); if(!this.taroIsSecondary?.()&&RL.dashcharge&&this._sparkHits>0&&(this.elapsed||0)<this._sparkUntil&&!this._infTick){amount*=1.25;this._sparkHits--;} if(RL.crown&&(e.isBoss||e.isMini)&&!this._crownTick&&!this.taroIsSecondary?.()&&++this._crownHits>=40&&(this.elapsed||0)>=(this._crownAt||0)){ this._crownHits=0; this._crownAt=(this.elapsed||0)+6; this._crownTick=true; try{ e.knock=Math.max(e.knock||0,0.8); e.setVelocity?.(0,0); e.atkCd=Math.max(e.atkCd||0,1.2); this.floatText?.(e.x,e.y-70,'👑 CROWN BREAK',0xffd166); this.damage(e,this.relicDmg(6),e.x,e.y); } finally{ this._crownTick=false; } } if(RL.jam&&this._jamPools&&this._jamPools.length&&this.inJamPool(e))amount*=1.25; }
    if(e._arcShockT>(this.elapsed||0))amount*=1+(e._arcShockM||0);   // v7.9.23 Static Shock/Sparks
    const CP=this._cpas; if(CP&&CP.id==='sesame'&&this._sesMirrors&&this._sesMirrors.length)amount*=1+0.06*Math.min(3,this._sesMirrors.length)*CP.s;   // v7.9.40 Oath Focus = +6%/กระจก
    if(!this._infTick&&!e.isDummy){ const P=this.player; if(P.gearStillDmg&&P.body&&P.body.velocity.length()<25)amount*=1+P.gearStillDmg; if(P.gearOpener&&e.hp>=e.maxhp)amount*=1+P.gearOpener; }   // 🪞 Oath Focus
    if(!e.isDummy&&this.player.forgeMods)amount=forgeDamage(this,e,amount);
    let crit=false; if(!this._frDmg&&(this.player.critChance||this.player.forgeMods&&forgeValue(this.player,96))&&Math.random()<Math.min(STAT_CAPS.critChance,(this.player.critChance||0)+(this.player.forgeMods&&forgeState(this).barrier>0&&(this.elapsed||0)-forgeState(this).lastHurt>=3?forgeValue(this.player,96)/100:0))){ amount*=(this.player.critMul||1.55); crit=true; } if(crit&&!this._infTick){Sfx.crit();if(this.player.forgeMods)forgeCrit(this);}
    if(this.character==='yuzu'&&this._yzForceCrit===e&&!crit){amount*=(this.player.critMul||1.55);crit=true;Sfx.crit();if(this.player.forgeMods)forgeCrit(this);}
    if(crit&&CP&&CP.id==='momo'&&(this.elapsed||0)>=(CP.cd||0)){ CP.cd=(this.elapsed||0)+0.35; const p=this.player; p.hp=Math.min(p.maxhp,p.hp+Math.max(1,p.maxhp*0.006*CP.s)); }   // 🍓 Lucky Seeds
    if(crit&&RL&&(RL.splinter||RL.leech))this.relicOnCrit(e,amount,x,y);
    if(crit&&!this.taroIsSecondary?.()&&this.player.gearCritArc&&!this._gmTick&&!this._infTick&&!e.isDummy)this.gearCritArc(e,amount);
    if(crit&&!this.taroIsSecondary?.()&&this.player._uqCritBurst&&!this._uqBursting){ this._uqBursting=true; const bx=e.x,by=e.y,bd=amount*this.player._uqCritBurst; this.burst(bx,by,0xc9a3ff);
      for(const o of this.enemies.getChildren()){ if(o.active&&o!==e&&Phaser.Math.Distance.Between(bx,by,o.x,o.y)<80)this.damage(o,bd); } this._uqBursting=false; }
    if(taroDirect&&(taroDirect.owner!==this._taro||this.state!=='play'||!taroTargetValid(taroDirect.token,this.player,Infinity)))return;
    let gate=null;
    if(e.isBoss&&!e.delveBoss){
      const p2=this.stageIndex===4?0.72:(this.stageIndex===6?0.68:(this.stageIndex===7?0.70:(this.stageIndex===8?0.72:(this.stageIndex===9?0.75:(this.stageIndex===0?0.68:(this.stageIndex===1?0.65:0.50))))));
      const p3=this.stageIndex===4?0.40:(this.stageIndex===6?0.34:(this.stageIndex===7?0.35:(this.stageIndex===8?0.38:(this.stageIndex===9?0.42:(this.stageIndex===0?0.35:(this.stageIndex===1?0.32:0.25))))));
      if(!e.phase2)gate=p2;else if(!e.phase3)gate=p3;else if((this.stageIndex===4||this.stageIndex===9)&&!e.phase4)gate=this.stageIndex===9?0.18:0.14;
    }else if(e.isMini&&!e.phase2)gate=0.50;
    if(gate!=null){const floor=e.maxhp*gate;if(e.hp>floor&&e.hp-amount<=floor){amount=e.hp-floor;e._phaseGateLocked=true;}}
    if(e._memoryToken)e._memoryStored=(e._memoryStored||0)+amount;
    this.mxDeal?.(e,amount,crit);e.hp-=amount;if(taroDirect?.smiteProfile)this.taroAfterSmite(taroDirect,e);else if(!taroDirect?.noEffects)this.taroAfterDirect?.(taroDirect,e);
    if(e.hp>0&&Math.random()<0.24)this.c3BossPose(e,5,240);
    if(RL&&RL.chill&&e.hp>0&&(this.elapsed||0)>=(this._coldSnapAt||0)){ this._coldSnapAt=(this.elapsed||0)+6; this.relicColdSnap(e); }
    if(!e.isBoss&&!e.isMini&&e.hp>0)this.enemyAction(e,'hurt',120);
    this.enemyWeightHit?.(e,amount,x,crit);
    this.warnAntBomber(e);
    e._sqX = 1.35; e._sqY = 0.70;   // Effectยุบตัวเมื่อโดนตี (Hit squash)
    if(crit){ this.hitStop(35); this.screenShake(90, 0.005); this.fireRecipes('crit'); const nowT=this.time?.now||0; if(!e.isBoss&&e.setTintFill&&nowT-(e._critFlashAt||0)>220){ e._critFlashAt=nowT; e.setTintFill(0xffffff); this.time.delayedCall(50,()=>{ if(!e.active)return; if(e.tintColor)e.setTint(e.tintColor); else e.clearTint(); }); } }   /* v8.2.10 คริ = วาบขาว 50 ms (เฉพาะคริ กันกระพริบทั้งจอ) */
    // อย่าฟอก sprite ด้วย setTintFill ตอนโดนตี: skillsหลาย hit ทำให้ art กระพริบขาวจนอ่าน silhouette ไม่ออก
    // ใช้ ring + spark + damage number + squash เป็น hit feedback แทน จึงเห็นสีและ animation เดิมตลอดเวลา
    this.vfxHitRing(x,y,crit?0xffd166:0xff9ec4,crit);
    if(this._sgHit)this.popDmg(Math.round(amount),x+Phaser.Math.Between(-16,16),y+Phaser.Math.Between(-12,8),crit,true);   // v6.50.1 เจ้าของ: เม็ด shotgun แสดงดาเมจทุกเม็ด (ไม่ติด throttle)
    else this.popDmg(Math.round(amount),x,y,crit); if(e.hp<=0&&(!taroDirect||(e.active&&e._taroSpawnId===taroDirect.token.id))) this.killEnemy(e); }
