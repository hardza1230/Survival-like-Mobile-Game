  _busy(){ return this.state==='play'||this.state==='levelup'; }  // ยังเล่นอยู่ (levelup แค่พักชั่วคราว)

  /* ---------- STAGES / WAVES (Archero-style) ---------- */
  getPowerGuide(stageIndex){
    const st=STAGES[stageIndex]||STAGES[0],rating=Save.power(this.character),recommended=stageRecommendedPower(STAGES.indexOf(st)),ratio=rating/recommended;
    // v6.55.17: ช่วยเฉพาะด่าน 1-2 · ด่าน 3+ = ของจริง ไม่ผ่อน และพลังเกินแนะนำ → ศัตรูถึกขึ้น (มีเพดาน)
    const gap=stageIndex<2?Phaser.Math.Clamp(1-ratio,0,0.60):0,assist=gap*0.32,over=stageIndex>=2&&!this._v83Run?Math.max(0,ratio-1):0;   /* v8.3.12 เจ้าของ: C1 ต่อเนื่อง ไม่เพิ่มเลือด/ดาเมจศัตรูเพราะพลังผู้เล่นเกินแนะนำ */
    return{rating,recommended,ratio,enemyHp:(1-assist)*(1+Math.min(0.35,over*0.25)),enemyDmg:(1-assist*0.78)*(1+Math.min(0.20,over*0.15)),reward:1+gap*0.50,label:ratio>=1.15?'Above recommended':ratio>=0.90?'Ready':ratio>=0.70?'Challenging':'Underpowered'};
  }
  clearChapterDepth(){
    for(const o of this._chapterDepthObjs||[]){if(!o)continue;this.tweens.killTweensOf(o);if(o.active)o.destroy();}this._chapterDepthObjs=[];
  }
  buildChapterDepth(i){
    this.clearChapterDepth();this._chapter25D=i===5||i===6||i===7;if(!this._chapter25D||!this.textures.exists('ch2_prop_atlas'))return;
    const add=(x,y,frame,scale,depth,scroll,alpha,drift)=>{const o=this.camWorld(this.add.image(x,y,'ch2_prop_atlas',frame).setScale(scale).setDepth(depth).setScrollFactor(scroll).setAlpha(alpha));this._chapterDepthObjs.push(o);if(drift)this.tweens.add({targets:o,y:y+drift,x:x+drift*.25,duration:4200+Math.abs(x)%1700,yoyo:true,repeat:-1,ease:'Sine.inOut'});return o;};
    // back terraces → mid canopy → foreground leaves: parallax ต่างกันแต่None physics จึงเบาสำหรับมือถือ
    add(-720,-520,6,.92,-100001,.46,.24,18);add(680,-610,6,.82,-100001,.52,.20,-15);
    add(-900,120,1,.62,-400,.82,.34,22);add(920,-90,2,.56,-350,.86,.30,-18);
    add(-980,760,4,.92,1900,1.08,.48,-24);add(1030,720,4,.86,1880,1.06,.44,20);
    for(let k=0;k<5;k++){const fog=this.camWorld(this.add.image(-880+k*430,-620+k%2*760,'vfx_cloud_field').setTint(0x56e5bd).setScale(1.7+k*.12,.72).setAlpha(.055).setDepth(-200).setScrollFactor(.72+k*.045));this._chapterDepthObjs.push(fog);this.tweens.add({targets:fog,x:fog.x+180,y:fog.y-35,duration:7200+k*820,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
  }
  // v5.51: placeholder ของตกแต่ง (วาดด้วย canvas ถ้ายังไม่มีอาร์ตจริง)
  makeDecorTexture(it){
    if(this.textures.exists(it.key))return; const S=128,ct=this.textures.createCanvas(it.key,S,S),c=ct.getContext();
    if(it.draw==='puddle'){ const g=c.createRadialGradient(64,70,6,64,70,60),col='#'+it.col.toString(16).padStart(6,'0'); g.addColorStop(0,col+'aa');g.addColorStop(0.7,col+'44');g.addColorStop(1,col+'00'); c.fillStyle=g; c.save();c.translate(64,70);c.scale(1,0.55);c.beginPath();c.arc(0,0,60,0,Math.PI*2);c.fill();c.restore(); c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(50,62,14,4,0,0,Math.PI*2);c.fill(); }
    else if(it.draw==='root'){ c.strokeStyle='#'+it.col.toString(16).padStart(6,'0');c.lineCap='round'; for(let k=0;k<3;k++){c.lineWidth=10-k*3;c.beginPath();c.moveTo(10+k*8,90-k*10);c.bezierCurveTo(40,60+k*12,80,110-k*14,120-k*6,70+k*12);c.stroke();} }
    else { if(it.base!=null){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(64,104,40,12,0,0,Math.PI*2);c.fill();}
      if(it.glow){const g=c.createRadialGradient(64,64,4,64,64,56);g.addColorStop(0,'rgba(140,255,215,.55)');g.addColorStop(1,'rgba(140,255,215,0)');c.fillStyle=g;c.fillRect(0,0,S,S);}
      c.font='84px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(it.emoji,64,62); }
    ct.refresh();
  }
  buildDecor(i){
    this.clearDecor();this.buildStageLife?.(i); const cfg=STAGE_DECOR[i]; if(!cfg)return;
    cfg.items.forEach(it=>this.makeDecorTexture(it)); const tw=cfg.items.reduce((a,b)=>a+b.w,0);
    this._decor={cfg,tw,chunks:new Map(),pool:[],acc:1};
  }
  clearDecor(){this.clearStageLife?.(); const d=this._decor; if(!d)return; for(const arr of d.chunks.values())arr.forEach(o=>o.destroy()); d.pool.forEach(o=>o.destroy()); this._decor=null; }
  stageLifeNoise(n){const v=Math.sin(n*12.9898+78.233)*43758.5453;return v-Math.floor(v);} // Local visual seed never consumes gameplay RNG.
  stageLifeBudget(){
    const st=typeof Save==='undefined'?{}:Save.data?.settings||{},perf=typeof PERF==='undefined'?0:PERF.lvl;
    if(st.vfx===0||st.quality===1||perf>=2||this.hubMotionAllowed?.()===false)return 0;
    return this.mode==='boss'||this.boss?.active?2:perf>=1?3:6;
  }
  buildStageLife(i){
    this.clearStageLife();if(this._inTutorial||this.recipeMode||!Number.isInteger(i)||i<0||i>14)return;
    const profiles=this._stageLifeProfiles||(this._stageLifeProfiles=[
      ['dust',0xcdb588],['drip',0x8ababa],['ember',0xeeb16f],['snow',0xc8dce4],['dust',0xbca7c0],
      ['leaf',0xb4cfab,'dec_c21_leaf'],['spore',0xb9c9ae,'dec_c22_spore_puff'],['pollen',0xd3bd83,'dec_c23_pollen'],['leaf',0xc0bcac,'dec_c24_spring_petals'],['spore',0xb4a2bd],
      ['ash',0xaaa39c],['leaf',0xb1ab8a,'dec_c32_fallen_leaves'],['dust',0xb8cec2],['dust',0xd1c395],['spore',0xb8a6cb]
    ]);
    this._stageLife={stage:i,player:this.player,epoch:this._artEpoch||0,profile:profiles[i],clock:0,slots:[],props:[],scan:0};
    if(!this._stageLifeHook&&this.events?.once){this._stageLifeHook=true;this.events.once('shutdown',()=>{this.clearStageLife();this._stageLifeHook=false;});}
  }
  restoreStageLifeProps(u){for(const q of u?.props||[])if(q.o.active&&q.o._stageLifeBase===q.base)q.o.setRotation(q.base.rotation).setAlpha(q.base.alpha);if(u)u.props=[];}
  clearStageLife(){const u=this._stageLife;if(!u)return;this.restoreStageLifeProps(u);for(const q of u.slots)q.o.destroy();this._stageLife=null;}
  tickStageLife(dt){
    if(this.state!=='play'||!this.player?.active)return;
    let u=this._stageLife;if(u&&(u.player!==this.player||u.stage!==this.stageIndex||u.epoch!==(this._artEpoch||0))){this.clearStageLife();u=null;}
    if(!u){this.buildStageLife(this.stageIndex);u=this._stageLife;}if(!u)return;
    const budget=this.stageLifeBudget();if(!budget){for(const q of u.slots)q.o.setVisible(false);this.restoreStageLifeProps(u);u.scan=0;return;}
    if(u.budget!==budget){u.budget=budget;u.scan=0;}
    const span=Math.max(0,Math.min(.1,dt));u.clock+=span;u.scan-=span;
    const p=this.player,v=this.cameras?.main?.worldView,w=v?.width||this.W/(this.viewZoom||1)||400,h=v?.height||this.H/(this.viewZoom||1)||700,rect={x:v?.x??p.x-w/2,y:v?.y??p.y-h/2,w,h},profile=u.profile;
    const tex=profile[2]&&this.textures.exists(profile[2])?profile[2]:'vfx_glow';
    if(this.textures.exists(tex))while(u.slots.length<budget){const id=u.slots.length,o=this.camWorld(this.add.image(0,0,tex).setDepth(-99400).setVisible(false));if(tex==='vfx_glow')o.setTint(profile[1]);u.slots.push({o,id,phase:-1,cycle:0});}
    for(const q of u.slots){if(q.id>=budget){q.o.setVisible(false);continue;}
      if(q.o.texture.key!==tex){q.o.setTexture(tex);if(tex==='vfx_glow')q.o.setTint(profile[1]);else q.o.clearTint?.();}
      const phase=(u.clock+q.id*1.37)%8,alive=phase<4.5;
      if(q.phase<0||phase<q.phase||q.x==null||Math.abs(q.x-(rect.x+w/2))>w*.8||Math.abs(q.y-(rect.y+h/2))>h*.8){
        const seed=u.stage*97+q.id*19+(q.cycle++)*7;q.x=rect.x+w*(q.id%2?.84+.1*this.stageLifeNoise(seed):.06+.1*this.stageLifeNoise(seed));q.y=rect.y+h*(.08+.8*this.stageLifeNoise(seed+3));
      }q.phase=phase;
      const kind=profile[0],fall=kind==='drip'?18:kind==='snow'?7:kind==='leaf'?5:kind==='ash'?3:-4,x=q.x+Math.sin(phase*.8+q.id)*5,y=q.y+phase*fall;
      const clear=(x-p.x)**2+(y-p.y)**2<165**2||this.boss?.active&&(x-this.boss.x)**2+(y-this.boss.y)**2<220**2||this._wisp?.active&&(x-this._wisp.x)**2+(y-this._wisp.y)**2<120**2;
      if(!alive||clear||x<rect.x||x>rect.x+w||y<rect.y||y>rect.y+h){q.o.setVisible(false);continue;}
      const painted=tex!=='vfx_glow',size=painted?12:kind==='snow'?4:3,alpha=(painted?.18:.22)*Math.min(1,phase/.7,(4.5-phase)/.9);
      q.o.setPosition(x,y).setDisplaySize(size,painted?size:kind==='drip'?9:kind==='ember'?5:size).setRotation(painted?Math.sin(phase*.5+q.id)*.35:0).setAlpha(Math.max(0,alpha)).setVisible(true);
    }
    if(u.scan<=0){this.restoreStageLifeProps(u);u.scan=.5;const cap=budget===2?3:8;
      for(const arr of this._decor?.chunks?.values()||[]){for(const o of arr){const b=o._stageLifeBase;if(!o.active||o.visible===false||!b||o.x<rect.x||o.x>rect.x+w||o.y<rect.y||o.y>rect.y+h||!/(leaf|leaves|reed|grass|flower|petal|vine|root|lamp|glow|crystal|drip|puddle|spore)/.test(b.key))continue;u.props.push({o,base:b,phase:this.stageLifeNoise(o.x+o.y)*6.28});if(u.props.length>=cap)break;}if(u.props.length>=cap)break;}
    }
    for(const q of u.props){const o=q.o,b=q.base;if(!o.active||o.visible===false||o._stageLifeBase!==b)continue;
      const t=u.clock*.7+q.phase,pulse=/(lamp|glow|crystal|puddle|drip|spore)/.test(b.key),light=typeof Save==='undefined'||Save.data?.settings?.flash!==false;o.setRotation(b.rotation+(pulse?0:Math.sin(t)*(/root/.test(b.key)?.006:.025))).setAlpha(b.alpha*(pulse&&light?.94+.06*Math.sin(t):1));
    }
  }
  tickDecor(dt){
    this.tickStageLife?.(dt);
    const d=this._decor; if(!d)return; d.acc+=dt; if(d.acc<0.2)return; d.acc=0;
    const C=DECOR_CHUNK,px=this.player.x,py=this.player.y,view=Math.max(this.W,this.H)/(this.viewZoom||1),R=Math.ceil(view/C/2)+1,pcx=Math.floor(px/C),pcy=Math.floor(py/C),want=new Set(),half=WORLD/2;
    for(let cx=pcx-R;cx<=pcx+R;cx++)for(let cy=pcy-R;cy<=pcy+R;cy++){ if(cx*C>=half||(cx+1)*C<=-half||cy*C>=half||(cy+1)*C<=-half)continue; const k=cx+','+cy; want.add(k); if(d.chunks.has(k))continue;
      const rng=mulberry32((d.cfg.seed*73856093)^(cx*19349663)^(cy*83492791)),n=d.cfg.per[0]+Math.floor(rng()*(d.cfg.per[1]-d.cfg.per[0]+1)),arr=[];
      for(let j=0;j<n;j++){ let r=rng()*d.tw,it=d.cfg.items[0]; for(const q of d.cfg.items){r-=q.w;if(r<=0){it=q;break;}}
        const x=cx*C+rng()*C,y=cy*C+rng()*C,sc=(it.size/128)*(0.8+rng()*0.5),flip=rng()<0.5,rot=it.rot?rng()*6.28:(rng()-0.5)*0.2,al=0.78+rng()*0.2;
        if(Math.abs(x)>half-30||Math.abs(y)>half-30||Math.hypot(x,y)<(d.cfg.clearR||0))continue;
        let o=d.pool.pop(); if(!o)o=this.camWorld(this.add.image(0,0,it.key)); o.setTexture(it.key).setPosition(x,y).setScale(sc).setFlipX(flip).setRotation(rot).setAlpha(al).setDepth(-99500).setVisible(true);o._stageLifeBase={key:it.key,rotation:rot,alpha:al}; arr.push(o); }
      d.chunks.set(k,arr); }
    for(const [k,arr] of d.chunks){ if(want.has(k))continue; arr.forEach(o=>{o.setVisible(false);d.pool.push(o);}); d.chunks.delete(k); }
  }
  clearStageProps(){ this.clearBiome&&this.clearBiome(); this.clearDecor(); this.clearChapterDepth();if(this.decoProps)this.decoProps.clear(true,true); if(this.solidProps)this.solidProps.clear(true,true); }
  // จัดวาง props เป็น "Room" Waitบจุดเกิด (0,0) — เดินเรื่องด้วยเลย์เอาต์ที่ตั้งใจ ไม่ใช่พื้นลอย ๆ
  buildStageProps(i){
    this.clearStageProps();
    const add=(key,x,y,solid,sc,frame=0,depthOffset=0)=>{ if(!this.textures.exists(key))return; sc=sc||1;
      const physical=i===0&&key!=='nest_acid'&&key!=='nest_hole';
      if(solid||physical){ const s=this.solidProps.create(x,y,key,frame); this.camWorld(s); s.setScale(sc).setDepth(y+depthOffset).refreshBody();   /* v6.84.1 กันโผล่ค้างบน uiCam (แท็บเล็ต) */
        if(s.body){
          if(key==='nest_hole'){ // หลุมกลม → กล่องชนอยู่ตรงกลางคลุมเกือบทั้งปาก กันเดินทะลุทุกมุม
            const d=Math.max(24,Math.min(s.displayWidth,s.displayHeight)*0.72);
            s.body.setSize(d,d);s.body.setOffset((s.displayWidth-d)/2,(s.displayHeight-d)/2);
          }else{const bw=Math.max(24,s.displayWidth*0.72),bh=Math.max(18,s.displayHeight*0.34);s.body.setSize(bw,bh);s.body.setOffset((s.displayWidth-bw)/2,s.displayHeight-bh);}
        }
      }else{ const im=this.add.image(x,y,key,frame).setScale(sc).setDepth(y+depthOffset); this.camWorld(im); this.decoProps.add(im); }
    };
    const L=STAGE_PROPS[i]; if(!L)return;
    for(const p of L)add(p[0],p[1],p[2],p[3],p[4],p[5],p[6]);
  }
  startStage(i){this._rubyOnce=null;this._rubyEpoch=(this._rubyEpoch|0)+1;this.rubyHide?.(true);this._rubyQ=[];this._qfRun={};this._a23AudioAt=0;this._holdFire=false;this.time?.delayedCall?.(0,()=>this.stageMood?.(this.recipeMode||this.riftMode?null:i));this.voiceStop?.();this._popN=0;this._huntUsed=false;this.time?.delayedCall?.(0,()=>{this.skinSwap?.(true);this.cosSetup?.();this.gmApply?.();});if(typeof VoiceActing!=='undefined')VoiceActing.preloadUnique?.(this);this.storyMusicStop?.();this._voiceSlipSeen=false;this._voiceLowHp=false;this._rubyLowHp=false;this._voiceLevelPending=this._voiceEvolvePending=false;this.time?.delayedCall?.(1600,()=>{if(this.state==='play'&&this.stageIndex===i)this.voiceBark?.('start');});this.stopHubMotion?.(); this._pathTeach=null; this._newSpecies=[]; try{ this._bestW=new Set(BESTIARY.filter(m=>bestiaryLv(m.id)>=BEST_MAX_TIER).map(m=>m.id)); }catch(e){ this._bestW=null; } this.rubyStoryAt?.(i);this._bossSayObj?.destroy();this._bossSayObj=null;this._lvlQueued=false;this._minHpPct=1;this._starRes=null;
    this.clearChapterCombatWave(true);
    this._c1Combat=null;
    this._v83Run=false;this.seasonEnvEnd?.();this._seasonEnv=null;
    this._a22Said={};
    this._forgeState=null;this._forgeLoot=Object.assign({},this.player&&this.player.forgeMods||{});this.clearCocoaCombat();const st=STAGES[i]; this.clearCrossroads(); this._xrNext=null; this._xrDuel=false; this.clearExitPortal(); this.clearBossObjects();this.clearWaveObjective(); this.clearPickups(true); this.clearOrbs(); this.stageIndex=i; this._fieldDrops=null;this._storyKillHeal=null;this._lifeOnKillCd=0;this._storyBudget=null;this._replayMeter=null;this._leadUsed=false;this._bountyLead=false;if(this.pipG)this.pipG.setVisible(true); this._seasonState=null; this._rootThrone=null; this.stageElapsed=0; this.boss=null; this.mode='breather'; this.waveIndex=0; this.waveAlive=0;this.moveSlowT=0;this.drainPull=null;
    this._runBoxes=[]; this._runCurrency={};   // เคลียร์ไอเทม/กล่องค้างจากรอบก่อน + รีเซ็ตสะสมกล่อง/currency ของด่านนี้
    this._bossZoom=1;this.applyMainZoom();
    this.bossUI.forEach(o=>o.setVisible(false));
    // 🎓 Training Ground — พื้นที่เปล่าสำหรับสอนเล่น (ไม่มี props / ไม่มีเวฟ / พื้นหลังโล่ง) coach คุมการสปอนเอง
    if(this._inTutorial){ this.clearStageProps(); this.gridBg.fillColor=0x2e2740;
      if(this.bgTile&&this.textures.exists('train_floor')){ this.bgTile.setTexture('train_floor'); if(this.bgTile.setTileScale)this.bgTile.setTileScale(0.9); this.bgTile.setAlpha(1); }
      this._waveObjectiveBag=[]; this._powerGuide=this.getPowerGuide(0);
      this.player.setPosition(0,0).setVelocity(0,0);
      this.stageTxt.setText('🎓 Training Ground'); this.updateWaveText();
      this.showBanner('🎓 Training Ground','A safe empty space — Berry will teach you step by step',2600);
      Sfx.playStageBgm(1);   // v6.49.7: เดิม return ก่อนเล่นเพลง → tutorial เงียบ
      return;   // ไม่ตั้งเวฟ (coach เป็นคนสปอนมอนให้ลอง)
    }
    let objectivePool=Array.isArray(st.objectives)&&st.objectives.length?st.objectives:['survive','hunt','purge','capture'];objectivePool=this.c1FirstPool(objectivePool);this._waveObjectiveBag=Phaser.Utils.Array.Shuffle(objectivePool.slice());if(st.lead){ const b=this._waveObjectiveBag,k=b.indexOf(st.lead); if(k>=0){ b.splice(k,1); b.push(st.lead); this._leadUsed=true; } }   /* v8.1.82 ภารกิจ League ประจำด่านมาก่อน */
    Sfx.playStageBgm(i+1);
    this.gridBg.fillColor=st.grid;
    if(this.bgTile){ const bgKey='bg'+(i+1); if(this.bgTile.clearTint)this.bgTile.clearTint(); if(this.textures.exists(bgKey))this.bgTile.setTexture(bgKey);
      // v4.50: Chapter 2 bg (bg6-10) เป็นภาพฉากเต็มใบ ไม่ใช่ texture ต่อได้ (seamless) → ปูซ้ำแล้วเห็นลายนางฟ้าเรียงเต็มจอ
      //         แก้: ด่าน 1-5 (bg1-5) คงปูซ้ำ 1.12 เหมือนเดิม · Chapter 2 = ยืดภาพเดียวคลุมทั้งโลก (cover, ไม่ซ้ำ)
      if(i>=5&&i<10&&this.textures.exists(bgKey)){ const src=this.textures.get(bgKey).getSourceImage(),cover=Math.min(2,Math.max(WORLD/(src.width||WORLD),WORLD/(src.height||WORLD))); this.bgTile.tileScaleX=this.bgTile.tileScaleY=cover; }
      else this.bgTile.tileScaleX=this.bgTile.tileScaleY=1.12;
      const fk=FLOOR_KEYS[i]; if(fk&&this.textures.exists(fk)){ this.bgTile.setTexture(fk); this.bgTile.tileScaleX=this.bgTile.tileScaleY=0.8; } }   // v5.54 พื้น seamless จริงแทน bg (bg ยังใช้เป็นภาพ story panel)   // พื้นหลังโซนตามด่าน + คืน tileScale (เผื่อมาจาก Training Ground)
    this.buildStageProps(i);this.buildChapterDepth(i);this.buildDecor(i);   // props หลัก + parallax 2.5D เฉพาะ Chapter 2
    this._powerGuide=this.getPowerGuide(i);const pg=this._powerGuide;
    const stageNo=st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):(i+1),_d=this.diffMul();this._stageTxtAt=this.elapsed||0;this.stageTxt.setText(`Stage ${stageNo} · ${st.name} · ${_d.emoji}${_d.name} · Zone ${this.zoneLevel()}`);
    this.showBanner(`${st.emoji} Stage ${stageNo}: ${st.name}`, st.lore+' · ⚡ '+pg.rating+'/'+pg.recommended+' '+pg.label, 3000);
    this.updateWaveText();
    this.expSupplyApply?.();   /* v8.2.32 Expedition Supplies */
    if(this.bossRush){ this._finalStoryShown=true; this.stageTxt.setText(this._pinnacleRun?'✦ Pinnacle · The Hunger Beneath':'👑 Boss Rush '+(this._rushPos+1)+'/'+this._rushList.length+' · '+st.name);
      if(this._rushPos===0){ this._rushT0=this.elapsed||0; this.pendingLvl=(this.pendingLvl||0)+6; }
      if(this.pendingLvl>0)this.time.delayedCall(600,()=>{ if(this.state==='play'&&this.pendingLvl>0)this.openLevelUp(); });
      this.time.delayedCall(1400,()=>{ if(!this._busy())return; this.mode='bossWarning'; this.updateWaveText(); Sfx.bossWarn(); this.scheduleStageEvent(1600,'bossWarning',()=>this.spawnFinalBoss()); }); return; }
    if(this.recipeMode){ this.startRecipeRun(st); return; }
    if(this.usesReplaySurvival()){this.startReplayRun(st);return;}
    this._v83Run=i>=0&&i<15&&!this.riftMode&&!this._inTutorial&&!this.recipeMode&&!this.bossRush
      &&(typeof window==='undefined'||new URLSearchParams(window.location.search).get('combat83')!=='0');
    if(this._v83Run){
      this._powerGuide=this.getPowerGuide(i);   /* v8.3.12 คิดใหม่หลังรู้ว่าเป็น C1 ต่อเนื่อง (ไม่สเกลตามพลังผู้เล่น) */
      this._c1Combat={deck:this.c1SideDeck(i),offered:new Set(),loot:new Map()};
      this._missionDeal=this.c1PreviewDeal?.(i)||null;this.updateWaveText();this.seasonEnvPick?.(i);
    }
    else this._missionDeal=MISSION_DECK&&!this.riftMode&&!this._inTutorial?this.missionDeckDeal?.():null;   /* v8.2.6 สำรับภารกิจ + แจกไพ่ */
    if(this._missionDeal)this.time.delayedCall(700,()=>{ if(this._busy())this.missionDealShow(this._missionDeal,()=>{ if(this._busy())this.startWave(0); }); });
    else this.time.delayedCall(1400,()=>{ if(this._busy()) this.startWave(0); });
  }
  // 📜 Recipe run (R2): ไม่มีเวฟ/มินิ · ฆ่าเติม Hunger Meter เต็ม → บอสโผล่ทันที · เคลียร์เร็ว=จบเร็ว · กันค้าง: ครบ RECIPE_HUNGER_CAP วิ บอสมาเอง
  warmStageTextures(idx,done){
    const list=this.stageRequiredKeys(idx).filter(k=>this.realTex(k)),token=this._runWatchN;
    if(!list.length){done();return;}window.GameLoader?.show?.('Preparing battle…',.9);
    const cam=this.cameras.main,c=this.add.container(cam.midPoint.x,cam.midPoint.y).setDepth(-1e6);let i=0;
    const step=()=>{if(token!==this._runWatchN){c.destroy(true);return;}c.removeAll(true);for(let n=0;n<12&&i<list.length;n++,i++)c.add(this.add.image(0,0,list[i]).setAlpha(.01).setScale(.05));if(i<list.length)setTimeout(step,16);else setTimeout(()=>{c.destroy(true);if(token===this._runWatchN)done();},32);};step();
  }

  usesReplaySurvival(){return !!(Save.data.stageMastery||{})[this.stageIndex]&&!this._inTutorial&&!this.recipeMode&&!this.riftMode&&!this.bossRush;}
  startReplayRun(st){
    this.clearWaveObjective();this._finalStoryShown=true;if(this.pipG)this.pipG.setVisible(false);
    this._replayMeter={kills:0,goal:REPLAY_GOAL,time:0,miniTriggered:false,miniDone:false,done:false,nextEv:60+Math.floor(Math.random()*31),nextBounty:22,bounties:0};this._replayMission=null;
    this.waveIndex=0;this.scheduleStageEvent(1200,'breather',()=>this.beginReplaySwarm());
    this.showBanner('Replay · Survival rules','Defeat monsters to fill the meter · ⭐ Bounty missions pop up for extra loot · Miniboss at half, boss when full',3600);   // v7.8.91 บอกกฎ replay
  }
  beginReplaySwarm(){
    this.clearWaveObjective();this.mode='wave';this.startSurvivalWave(Math.max(1,this.waveIndex),false);this.updateWaveText();this.renderReplayProgress();
  }
  replayOnKill(e){const m=this._replayMeter;if(!m||m.done||this.mode!=='wave'||e.isBoss||e.isMini)return;m.kills=Math.min(m.goal,m.kills+(e.isElite?6:0.75));}
  renderReplayProgress(){
    const m=this._replayMeter;if(!m||m.done)return;const frac=Math.min(1,m.kills/m.goal),bw=Math.min(230,this.W-84);
    this.timeTxt.setText('Survival replay');this.waveObjTxt.setText('Stage progress · '+Math.floor(frac*100)+'%').setColor('#ffe08a').setVisible(true);
    this.waveObjBg.setVisible(false);this.waveObjBar.setVisible(false);this.replayProgressFrame.setVisible(true);this._pbTarget=frac;this.replayProgressFill.setVisible(frac>0);
  }
  /* v8.1.75 เจ้าของ: เล่นซ้ำไม่มีภารกิจ ไม่ตื่นเต้น → ภารกิจ Bounty สุ่มจากภารกิจของด่าน (ไม่เอา Survive/Fill) ทุก ~50–70 วิ · 45 วิ · สำเร็จ = น้ำพุของ + หลอด +8% · พลาด = ไม่เสียอะไร */
  replayBountyPool(){ const st=STAGES[this.stageIndex]||{},sm=(Save.data||{}).stageMastery||{},pool=(Array.isArray(st.objectives)&&st.objectives.length?st.objectives:['survive','hunt','purge','capture']).filter(t=>t!=='survive'&&t!=='fill'&&WAVE_OBJECTIVES[t]&&(t!=='grandmasPot'||sm[3])); return pool.length?pool:['hunt','capture']; }
  replayBountyTick(m){ const B=this._replayMission;
    if(B){ const o=this.waveObjective; if(!o||o!==B.o){ this._replayMission=null; m.nextBounty=m.time+50+Math.random()*20; return; }
      if(!o.done&&m.time>=B.until){ this.clearWaveObjective(); this._replayMission=null; m.nextBounty=m.time+50+Math.random()*20; this.showBanner?.('⭐ Bounty escaped','Another one will turn up soon',1400); } return; }
    if(this.state!=='play'||this.mode!=='wave'||this.waveObjective||(m.miniTriggered&&!m.miniDone)||m.kills>=m.goal*.94||m.time<(m.nextBounty||22))return;
    const pool=this.replayBountyPool(); let type=pool[Math.floor(Math.random()*pool.length)]; const stL=(STAGES[this.stageIndex]||{}).lead; if(stL&&!this._bountyLead&&pool.includes(stL)){ type=stL; this._bountyLead=true; } else if(MISSION_DECK){ const dk=this.missionDeckDraw(1,new Set(['survive','fill',stL]))[0]; if(dk){ type=dk; this.missionRoamArt?.([dk]); } } else if(type!=='hunt'&&Math.random()<MISSION_ROAM_CHANCE){ const rp=this.missionRoamPool?.()||[]; if(rp.length){ type=rp[Math.floor(Math.random()*rp.length)]; this.missionRoamArt?.([type]); } } m.bounties++;   /* v8.1.164 Bounty สุ่มจาก pool กลางด้วย */   /* v8.1.83 ภารกิจ League ของด่านเป็น Bounty แรก */
    this.setupWaveObjective(Math.max(1,this.waveIndex||1),{dur:40,forceType:type}); const o=this.waveObjective; if(!o){ m.nextBounty=m.time+30; return; }
    o.name='Bounty · '+o.name; const bt=(typeof LEAGUE_MISSIONS!=='undefined'&&LEAGUE_MISSIONS.includes(type))?70:45; this._replayMission={o,type,until:m.time+bt}; this.renderWaveObjectiveHUD?.(); Sfx.orderCue?.('wave_start',.4,.6); { const d0=o.desc; o.desc=bt+'s · finish it for a loot fountain'; const ok=this.missionIntro?.(o,!!o._armPad); o.desc=d0; if(!ok)this.showBanner?.('⭐ Bounty! '+WAVE_OBJECTIVES[type].emoji+' '+WAVE_OBJECTIVES[type].name,bt+'s · finish it for a loot fountain',2200); } }
  tickReplayProgress(dt){
    const m=this._replayMeter;if(!m||m.done)return;m.time+=dt;this.replayBountyTick?.(m); if(!this._replayMission)this.renderReplayProgress();
    if(this.mode==='wave'&&m.nextEv&&m.time>=m.nextEv&&this.state==='play'){ m.nextEv=m.time+60+Math.floor(Math.random()*31); this.triggerRecipeEvent?.(true); }   // v7.8.100 Lens of Interest Curve: เหตุการณ์สุ่มระหว่าง Replay
    if(this._replayMeter&&this._shrine)this.tickRecipeShrine(dt);
    if(!m.miniTriggered&&m.kills>=m.goal*0.5){
      m.miniTriggered=true;this.waveIndex=STAGES[this.stageIndex].miniAt;this.mode='miniWarning';this.updateWaveText();
      this.showBanner('Miniboss incoming','Defeat it, then continue filling the meter',2200);Sfx.bossWarn();this.scheduleStageEvent(2200,'miniWarning',()=>this.spawnMiniBoss());return;
    }
    if(m.miniDone&&m.kills>=m.goal){
      m.done=true;this.rubyVoiceReact?.('objdone',200);this.clearWaveObjective();this.mode='bossWarning';this.settleStoryBudget?.(true);this.updateWaveText();Sfx.bossWarn();
      this.showBanner('Progress complete','The boss is coming',1800);this.scheduleStageEvent(1600,'bossWarning',()=>this.spawnFinalBoss());
    }
  }
  recipeHungerGoal(){ return Math.round((260+((this._recipe&&this._recipe.tier)||1)*10)*(1+0.2*((this._pact&&this._pact.hunger)||0))); }
  pactHealMul(){ return this.recipeMode&&this._pact?Math.max(0,1-0.5*(this._pact.heal||0)):1; }   // R10: T16=246 (เดิม 310) เพราะมอนอึดขึ้นตาม tier อยู่แล้ว
  startRecipeRun(st){ this._domainRun=!!this._domainRequested; this._domainRequested=false; if(this._domainRun){ if((Save.data.hungerStones|0)>0){ Save.data.hungerStones--; Save.save(); } else this._domainRun=false; }   /* v8.1.92 เจ้าของ: Hunger Stone = ห้องพิเศษ Hunger's Domain */
    this.clearDelveMods(); this._recipeMission=null; this._feastT=null; this._feastOn=null; this._waitMsgAt=0; const r=this._recipe; this._rushOn=false; const nd=r&&r.node!=null?amapNode(r.node):null; this._amapNode=nd; this._amapInf=nd?amapInfluence(nd.id):{}; { const L=amapInfLayers(this._amapInf); if(L)this.time.delayedCall(2600,()=>this.showBanner('🍽 Flavor Influence '+amapInfText(this._amapInf),AMAP_FLAVORS.filter(f=>this._amapInf[f.id]).map(f=>f.eff).join(' · ')+' · rewards +'+Math.round(15*L)+'%',2600)); } if(nd){ this.clearStageProps&&this.clearStageProps(); if(this.bgTile&&this.textures.exists('train_floor')){ this.bgTile.setTexture('train_floor'); if(this.bgTile.setTileScale)this.bgTile.setTileScale(0.9); this.bgTile.setAlpha(1); this.bgTile.setTint(Phaser.Display.Color.HSLToColor(nd.hue/360,0.45,0.74).color); } if(this.stageTxt)this.stageTxt.setText(nd.emoji+' '+nd.name+' · Depth '+nd.d); } this.setupBiome(nd); this._finalStoryShown=true; this._hunger=0; this._hungerT=0; this._hungerDone=false; this._recipeEventDone=false; this._recipeEventN=0; this.clearRecipeShrine(); this._recipeFillT=0;
    const pf=(this._pact&&this._pact.frail)||0; if(pf){ const p=this.player; p.maxhp=Math.max(1,Math.round(p.maxhp*(1-0.1*pf))); p.hp=Math.min(p.hp,p.maxhp); }
    this.stageTxt.setText((nd?'⛏ Depth '+nd.d:'📜 Recipe T'+r.tier)+(this._pactHeat?' · 🔥'+this._pactHeat:'')+' · '+(nd?nd.emoji+' '+nd.name:st.name));
    this.time.delayedCall(1200,()=>{ if(!this._busy())return; this.waveIndex=1; this.waveObjective=null; this.mode='wave'; this.startSurvivalWave(1);
      this.spawnInterval*=(this.recipeHas('horde')?0.5:0.7)*(1-0.15*((this._pact&&this._pact.horde)||0)); this.spawnBatch+=this.recipeHas('horde')?2:1; { const fi=this._amapInf||{}; if(fi.sweet){this.spawnInterval*=1-0.08*fi.sweet; this.spawnBatch+=fi.sweet>=2?1:0;} if(fi.sour&&this.eliteEvery)this.eliteEvery*=1-0.15*fi.sour; } this.maxLive=Math.min(this.maxLive+10,110); this.waveTimer=99999; if(this.recipeHas('elitepack')&&this.eliteEvery){this.eliteEvery*=0.4;this.eliteAcc=Math.min(this.eliteAcc||0,this.eliteEvery);}
      { const ms=this._domainRun?'hungerDomain':nd&&nd.mission; this._recipeMission=ms?{type:ms,done:false}:null; if(ms){ this.setupWaveObjective(1,{dur:52,forceType:ms}); const d=WAVE_OBJECTIVES[ms]; this.showBanner('🎯 '+d.name+' + 🍽 Hunger','Fill the meter to call the boss · mission = bonus Sugar',2600); } else this.showBanner('🍽 Feed the Hunger Meter','Kill to fill it — the boss appears when it’s full',2400); }
      // v6.14 (B9): Starting Relic — เลือก relic 1 ชิ้นตอนเริ่มรัน Endgame
      this.time.delayedCall(900,()=>{ if(this._busy()&&this.state==='play'&&!(this.relics&&this.relics.length)){ if(this.offerRelic())this.showBanner('🔮 Starting Relic','Choose one to shape this run',1800); } }); }); }
  tickSugarRush(){ if(this._rushOn&&(this.elapsed||0)>=this._rushEnd){ this._rushOn=false; this.player.cdMul/=0.6; this.player.dmgMul-=0.25; } }
  tickRecipeHunger(dt){ this._hungerT+=dt; const goal=this.recipeHungerGoal(),t=Math.floor(this._hungerT);
    this.drawWavePips();
    this.timeTxt.setText('🍽 Hunger '+Math.min(goal,Math.floor(this._hunger))+'/'+goal+(this._recipeMission?(this._recipeMission.done?' · 🎯✓':' · 🎯'):'')+' · '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0'));
    this.tickRecipeShrine(dt); this.tickBiome(dt);
    if(this._hungerDone)return;
    this.tickFeast(dt);
    if(this.checkEndgameCurse(this._hunger/goal))return;
    const evAt=atlasLv('eventful')>=1?[0.3]:[0.4]; if(atlasLv('eventful')>=2)evAt.push(0.7); const en=this._recipeEventN|0; if(en<evAt.length&&this._hunger>=goal*evAt[en]){ this._recipeEventN=en+1; this.triggerRecipeEvent(); }
    const missionOk=true;   /* v6.80 E1: boss needs Hunger only — mission is optional bonus Sugar */ if(this._hunger>=goal&&!missionOk){ this._hunger=goal; if(!this._waitMsgAt||this._hungerT-this._waitMsgAt>10){ this._waitMsgAt=this._hungerT; this.showBanner('🍽 Meter full','Finish the 🎯 mission to call the boss',1600); } }
    const full=this._hunger>=goal&&missionOk, late=false;   // v6.2.3: บอสมาเมื่อหลอดเต็มเท่านั้น
    if(full||late){ if(this._recipeMission&&!this._recipeMission.done){ this._recipeMission=null; this.clearWaveObjective?.(); }   // v6.80 E1: unfinished mission ends with the meter
      this._hungerDone=true; this._recipeFillT=this._hungerT; this._recipeFast=full&&this._hungerT<=recipePar();
      this.showBanner(full?(this._recipeFast?'⚡ Fast clear!':'🍽 Hunger Meter full!'):'⏳ The boss grows impatient','The boss is coming',1800);
      this.mode='bossWarning'; this.updateWaveText(); Sfx.bossWarn(); this.scheduleStageEvent(1600,'bossWarning',()=>this.spawnFinalBoss()); } }
  // R5: เหตุการณ์สุ่มกลางรัน (1 ครั้ง/รัน ที่ Hunger 40%)
  triggerRecipeEvent(replay){ if(!replay)this._recipeEventDone=true; const ev=Phaser.Utils.Array.GetRandom(replay&&!((this.relicSlotsLeft?.()??0)>0)?['treasure','shrine','rare']:['treasure','shrine','merchant','rare']);this._recipeEvent=ev; const p=this.player;
    if(ev==='treasure'){ for(let i=0;i<6;i++)this.spawnCrate(); this.spawnVac(p.x+Phaser.Math.Between(-120,120),p.y+Phaser.Math.Between(-120,120)); this.showBanner('💰 Treasure Room','Jam jars spilled everywhere — smash them for loot',2200); }
    else if(ev==='shrine'){ this.clearRecipeShrine(); const a=Math.random()*Math.PI*2,x=p.x+Math.cos(a)*260,y=p.y+Math.sin(a)*260,g=this.camWorld(this.add.graphics().setDepth(3));
      this._shrine={x,y,t:0,life:22,g}; this.showBanner('⛩️ Sugar Shrine','Stand in the glowing circle for 2s to gain power',2200); }
    else if(ev==='merchant'){ this.showBanner('🧺 Wandering Merchant','A traveller offers you a relic',1800); this.time.delayedCall(900,()=>{ if(this.state==='play'&&!this.offerRelic())this.grantCurrencyReward(2,this.currencyTierFor(),'🧺 The merchant pays in currency'); }); }
    else { const e=this.spawnElite(); if(e){ e.hp*=4; e.maxhp=e.hp; e._rareElite=true; e.tintColor=0xffd166; e.setTint(0xffd166); e.setScale((e.baseScale||1)*1.25); } this.showBanner('✨ Rare Elite',replay?'A golden elite appeared — worth a big chunk of the meter':'A golden elite appeared — worth big Hunger and currency',2200); } }
  tickRecipeShrine(dt){ const sh=this._shrine; if(!sh)return; sh.life-=dt; const p=this.player,inside=Phaser.Math.Distance.Between(p.x,p.y,sh.x,sh.y)<90;
    if(inside)sh.t+=dt; const g=sh.g; g.clear(); g.lineStyle(4,0xffd166,0.9); g.strokeCircle(sh.x,sh.y,90); g.fillStyle(0xffd166,0.12+0.1*Math.sin(this.elapsed*6)); g.fillCircle(sh.x,sh.y,90);
    if(sh.t>0){ g.fillStyle(0xffffff,0.35); g.slice(sh.x,sh.y,40,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,sh.t/2),false); g.fillPath(); }
    if(sh.t>=2){ this.clearRecipeShrine(); p.dmgMul+=(1.3)-1; p.cdMul*=0.85; this.burst(p.x,p.y,0xffd166); this.showBanner('⛩️ Shrine Blessing','+30% damage · faster attacks for 25s',1800);
      const run=this._artEpoch||0; this.time.delayedCall(25000,()=>{ if((this.recipeMode||this._replayMeter)&&(this._artEpoch||0)===run){p.dmgMul-=0.3;p.cdMul/=0.85;} }); }
    else if(sh.life<=0)this.clearRecipeShrine(); }
  // v6.33: Biome ต่อรส (เริ่มที่ 🌶️ Spicy) · พื้นของตัวเอง + กลไกฉาก + มอนประจำรส
  makeSpicyFloor(){ if(this.textures.exists('biome_spicy_floor'))return; const S=512,c=this.textures.createCanvas('biome_spicy_floor',S,S),x=c.getContext(),R=mulberry32(7331);
    x.fillStyle='#3a1a17'; x.fillRect(0,0,S,S);
    for(let i=0;i<160;i++){ const px=R()*S,py=R()*S,r=6+R()*26; x.fillStyle=`rgba(${70+R()*40|0},${28+R()*20|0},${22+R()*14|0},0.55)`; x.beginPath(); x.ellipse(px,py,r,r*0.7,R()*3,0,TAU); x.fill(); }
    x.lineCap='round'; for(let k=0;k<14;k++){ let px=R()*S,py=R()*S; x.strokeStyle='rgba(255,110,40,0.55)'; x.lineWidth=2+R()*2.5; x.shadowColor='#ff5a1e'; x.shadowBlur=8; x.beginPath(); x.moveTo(px,py); for(let j=0;j<5;j++){ px+=(R()-0.5)*90; py+=(R()-0.5)*90; x.lineTo(px,py); } x.stroke(); }
    x.shadowBlur=0; for(let i=0;i<40;i++){ x.fillStyle='rgba(255,190,90,0.35)'; x.beginPath(); x.arc(R()*S,R()*S,1+R()*2,0,TAU); x.fill(); }
    c.refresh(); }
  setupBiome(nd){ this.clearBiome(); const fl=nd&&nd.flavor; if(!fl||nd.type==='home')return; this._biome=fl.id; const fk='biome_'+fl.id+'_floor'; if(fl.id!=='spicy'){ if(this.bgTile&&this.textures.exists(fk)){ this.bgTile.setTexture(fk); if(this.bgTile.setTileScale)this.bgTile.setTileScale(0.8); this.bgTile.clearTint(); this.bgTile.setAlpha(1); } this.setupBiome2(fl.id); return; }
    this.makeSpicyFloor(); if(this.bgTile){ this.bgTile.setTexture('biome_spicy_floor'); if(this.bgTile.setTileScale)this.bgTile.setTileScale(this.textures.get('biome_spicy_floor').getSourceImage().width>600?0.8:1); this.bgTile.clearTint(); this.bgTile.setAlpha(1); }
    this._vents=[]; for(let i=0;i<7;i++)this._vents.push(this.makeVent(i));
    this.time.delayedCall(1800,()=>this.showBanner('🌶️ Spicy Depths','Lava vents erupt in rhythm — lure monsters onto them! · Ember monsters leave fire trails',3000)); }
  makeVent(i){ const p=this.player,a=Math.random()*TAU,d=180+Math.random()*420,v={x:p.x+Math.cos(a)*d,y:p.y+Math.sin(a)*d,t:-(1.2+i*0.75+Math.random()),per:4.6+Math.random()*1.6,r:78};
    v.g=this.camWorld(this.add.image(v.x,v.y,'vfx_glow').setDepth(-99400).setTint(0xff4a1a).setScale(v.r*1.6/256).setAlpha(0.35));
    v.core=this.camWorld((this.textures.exists('biome_spicy_vent')?this.add.image(v.x,v.y,'biome_spicy_vent').setDisplaySize(110,110):this.add.text(v.x,v.y,'🌋',{fontSize:'26px'}).setOrigin(0.5)).setDepth(-99300)); return v; }
  placeVent(v){ const p=this.player,mv=this.moveDir||{x:0,y:-1},a=Math.atan2(mv.y,mv.x)+(Math.random()-0.5)*2.2,d=360+Math.random()*260; v.x=p.x+Math.cos(a)*d; v.y=p.y+Math.sin(a)*d; v.g.setPosition(v.x,v.y); v.core.setPosition(v.x,v.y); }
  tickBiome(dt){ if(this.state!=='play')return; if(this._biome&&this._biome!=='spicy'){ this.tickBiome2(dt); return; } if(this._biome!=='spicy')return; const p=this.player,dmgB=Math.max(6,Math.round(8*this.diffMul().dmg));
    for(const v of this._vents||[]){ if(this.dist(p.x,p.y,v.x,v.y)>1000){ this.placeVent(v); v.t=-1.5; } v.t+=dt;
      const warn=v.per-1.1; if(v.t>0&&v.t<warn){ v.g.setAlpha(0.3+0.08*Math.sin(v.t*3)); v.g.setScale(v.r*1.6/256); }
      else if(v.t>=warn&&v.t<v.per){ const k=(v.t-warn)/1.1; v.g.setAlpha(0.45+0.5*k*(0.6+0.4*Math.sin(v.t*30))); v.g.setScale(v.r*(1.6+0.6*k)/256); }
      if(v.t>=v.per){ v.t=0; this.ventErupt(v,dmgB); } }
    this._emberAcc=(this._emberAcc||0)+dt; if(this._emberAcc>=0.3){ const step=this._emberAcc; this._emberAcc=0;
      this.enemies.getChildren().forEach(e=>{ if(!e.active||!e._ember||e.frozen)return; e._emberT+=step; if(e._emberT>=1.3){ e._emberT=0; this.dropEmber(e.x,e.y,Math.max(3,Math.round((e.dmg||8)*0.35))); } }); }
    const P=this._embers; if(P&&P.length){ for(let i=P.length-1;i>=0;i--){ const f=P[i]; f.life-=dt; f.img.setAlpha(Math.min(0.75,f.life*0.5)); if(f.life<=0){ f.img.destroy(); P.splice(i,1); continue; } if(this.dist(p.x,p.y,f.x,f.y)<f.r+14&&(this._emberHitAt||0)<this.elapsed-0.6){ this._emberHitAt=this.elapsed; this.hurtPlayer(f.dmg,0.3); } } } }
  ventErupt(v,dmg){ const p=this.player; v.g.setScale(v.r*1.6/256).setAlpha(0.35);
    if(this.anims.exists('fx_chilinova'))this.spawnFxAnim('fx_chilinova',v.x,v.y,{scale:(v.r*2.2)/ASSET_FX.fx_chilinova.fw,depth:4,anchor:'center'});
    else { const b=this.camWorld(this.add.image(v.x,v.y,'vfx_ring').setDepth(4).setTint(0xff5a1e).setScale(v.r*2/256)); this.tweens.add({targets:b,alpha:0,scale:b.scale*1.3,duration:320,onComplete:()=>b.destroy()}); }
    let n=0; this.enemies.getChildren().forEach(e=>{ if(e.active&&this.dist(e.x,e.y,v.x,v.y)<v.r+16){ this.damage(e,e.isBoss?Math.round(e.maxhp*0.012):e.isMini?Math.round(e.maxhp*0.04):Math.max(25,Math.round(e.maxhp*0.6))); n++; } });
    if(n>=3)this.floatText(v.x,v.y-60,'🔥 Roasted ×'+n,0xff8a3d);
    if(this.dist(p.x,p.y,v.x,v.y)<v.r+8)this.hurtPlayer(dmg,0.5);
    if(this.dist(p.x,p.y,v.x,v.y)<520)Sfx.boom(); }
  dropEmber(x,y,dmg){ const P=this._embers||(this._embers=[]); if(P.length>=26){ const o=P.shift(); o.img.destroy(); }
    P.push({x,y,r:26,dmg,life:2.4,img:this.camWorld((this.textures.exists('biome_spicy_ember')?this.add.image(x,y,'biome_spicy_ember').setDisplaySize(56,56):this.add.image(x,y,'vfx_glow').setTint(0xff6a20).setScale(60/256)).setDepth(-99350).setAlpha(0.75))}); }
  clearBiome(){ (this._vents||[]).forEach(v=>{v.g.destroy();v.core.destroy();}); this._vents=null; (this._embers||[]).forEach(f=>f.img.destroy()); this._embers=null; (this._bzones||[]).forEach(z=>{z.img.destroy();if(z.g)z.g.destroy();}); this._bzones=null; this._biome=null; }
  // v6.36 กลไก biome อีก 4 รส: frosty แผ่นน้ำแข็งแช่มอน · sweet ดาวตกน้ำตาล = Sugar Rush · sour ฝนกรด · fermented มอนบวมระเบิดลูกโซ่
  setupBiome2(id){ this._bzones=[]; this._bzT=0;
    const B={frosty:['❄️ Frosty Depths','Ice patches freeze monsters that cross them — but they slow you too'],sweet:['🍯 Sweet Depths','Sugar comets fall nearby — stand in one when it lands for a Sugar Rush'],sour:['🍋 Sour Depths','Acid rain! Dodge the drops — monsters caught take extra damage'],fermented:['🍄 Fermented Depths','Bloated monsters burst when they die — chain them, but keep your distance']}[id];
    if(id==='frosty')for(let i=0;i<6;i++){ const z=this.bzMake('biome_frosty_slick',0x9fe6ff,90,0.5); this.bzPlace(z,true); this._bzones.push(z); }
    if(B)this.time.delayedCall(1800,()=>this.showBanner(B[0],B[1],3000)); }
  bzMake(key,tint,r,alpha){ const z={x:0,y:0,r,t:0}; z.img=this.camWorld((this.textures.exists(key)?this.add.image(0,0,key).setDisplaySize(r*2.2,r*2.2):this.add.image(0,0,'vfx_glow').setTint(tint).setScale(r*2/256)).setDepth(-99350).setAlpha(alpha)); return z; }
  bzPlace(z,any){ const p=this.player,mv=this.moveDir||{x:0,y:-1},a=any?Math.random()*TAU:Math.atan2(mv.y,mv.x)+(Math.random()-0.5)*2.2,d=any?160+Math.random()*420:360+Math.random()*260; z.x=p.x+Math.cos(a)*d; z.y=p.y+Math.sin(a)*d; z.img.setPosition(z.x,z.y); }
  bzWarn(x,y,r,col,ms,fn){ const g=this.camWorld(this.add.image(x,y,'vfx_ring').setDepth(-99300).setTint(col).setScale(r*2/256).setAlpha(0.25)); this.tweens.add({targets:g,alpha:0.85,duration:ms,onComplete:()=>{ g.destroy(); if(this.state==='play'&&this._biome)fn(); }}); return g; }
  tickBiome2(dt){ const p=this.player,id=this._biome,dmgB=Math.max(5,Math.round(7*this.diffMul().dmg)); this._bzT+=dt;
    if(id==='frosty'){ if((this._bzAcc=(this._bzAcc||0)+dt)<0.2)return; this._bzAcc=0;
      for(const z of this._bzones){ if(this.dist(p.x,p.y,z.x,z.y)>1000)this.bzPlace(z,false);
        if(this.dist(p.x,p.y,z.x,z.y)<z.r)this.moveSlowT=Math.max(this.moveSlowT||0,0.3);
        this.enemies.getChildren().forEach(e=>{ if(!e.active||e.isBoss||e.isMini||this.dist(e.x,e.y,z.x,z.y)>z.r)return; if((e._iceAt||0)>this.elapsed-3)return; e._iceAt=this.elapsed; e.frozen=Math.max(e.frozen||0,1.6); this.burst&&this.burst(e.x,e.y,0x9fe6ff); }); } return; }
    if(id==='sweet'){ if(this._bzT<(this._bzNext||4))return; this._bzT=0; this._bzNext=8+Math.random()*3;
      const a=Math.random()*TAU,d=130+Math.random()*150,x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d,r=95;
      const ic=this.camWorld((this.textures.exists('biome_sweet_bomb')?this.add.image(x,y-260,'biome_sweet_bomb').setDisplaySize(70,70):this.add.text(x,y-260,'☄️',{fontSize:'34px'}).setOrigin(0.5)).setDepth(9000));
      this.tweens.add({targets:ic,y,duration:1400,ease:'Quad.easeIn'});
      this.bzWarn(x,y,r,0xffd166,1400,()=>{ ic.destroy(); this.burst&&this.burst(x,y,0xffd166); this.vfxHitRing&&this.vfxHitRing(x,y,0xffd166,true);
        this.enemies.getChildren().forEach(e=>{ if(e.active&&this.dist(e.x,e.y,x,y)<r+14)this.damage(e,e.isBoss?Math.round(e.maxhp*0.015):e.isMini?Math.round(e.maxhp*0.05):Math.max(20,Math.round(e.maxhp*0.5))); });
        if(this.dist(p.x,p.y,x,y)<r){ this.sugarRush(); this.sugarStage=(this.sugarStage||0)+3; this.floatText(p.x,p.y-60,'🍯 Sugar Rush!',0xffd166); } }); return; }
    if(id==='sour'){ if(this._bzT<(this._bzNext||3))return; this._bzT=0; this._bzNext=2.2+Math.random()*0.8;
      for(let i=0;i<2;i++){ const a=Math.random()*TAU,d=i?Math.random()*60:80+Math.random()*180,x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d,r=72;
        this.bzWarn(x,y,r,0xd8ff4a,1200,()=>{ const pd=this.camWorld((this.textures.exists('biome_sour_pool')?this.add.image(x,y,'biome_sour_pool').setDisplaySize(r*2.2,r*2.2):this.add.image(x,y,'vfx_glow').setTint(0xd8ff4a).setScale(r*2/256)).setDepth(-99340).setAlpha(0.7)); this.tweens.add({targets:pd,alpha:0,delay:500,duration:700,onComplete:()=>pd.destroy()});
          this.enemies.getChildren().forEach(e=>{ if(!e.active||this.dist(e.x,e.y,x,y)>r+14)return; e._sourT=Math.max(e._sourT||0,4); this.damage(e,e.isBoss?Math.round(e.maxhp*0.008):e.isMini?Math.round(e.maxhp*0.03):Math.max(12,Math.round(e.maxhp*0.3))); });
          if(this.dist(p.x,p.y,x,y)<r)this.hurtPlayer(dmgB,0.4); }); } return; } }
  bloatBurst(x,y){ const r=95,p=this.player; if((this._bloatN=(this._bloatN||0))>24)return; this._bloatN++;
    this.bzWarn(x,y,r,0xb07cff,450,()=>{ this._bloatN--; this.burst&&this.burst(x,y,0xb07cff); if(this.textures.exists('biome_fermented_patch')){ const c=this.camWorld(this.add.image(x,y,'biome_fermented_patch').setDisplaySize(r*2,r*2).setDepth(-99340).setAlpha(0.7)); this.tweens.add({targets:c,alpha:0,duration:900,onComplete:()=>c.destroy()}); }
      this.enemies.getChildren().forEach(e=>{ if(e.active&&this.dist(e.x,e.y,x,y)<r+14)this.damage(e,e.isBoss?Math.round(e.maxhp*0.01):e.isMini?Math.round(e.maxhp*0.04):Math.max(20,Math.round(e.maxhp*0.7))); });
      if(this.dist(p.x,p.y,x,y)<r)this.hurtPlayer(Math.max(5,Math.round(7*this.diffMul().dmg)),0.4); }); }
  clearRecipeShrine(){ if(this._shrine){ this._shrine.g.destroy(); this._shrine=null; } }
  recipeHas(id){ return !!(this.recipeMode&&this._recipe&&(this._recipe.mods||[]).includes(id)); }
  recipeOnKill(e){ if(!this.recipeMode||this.mode!=='wave'||this._hungerDone)return; if(e._rareElite){ e._rareElite=false; this._hunger+=20; this.grantCurrencyReward(2,this.currencyTierFor(),'✨ Rare Elite down!'); } if(e._feast){ e._feast=false; this._feastOn=null; const g=this.recipeHungerGoal(),add=g*FEAST_SHARE; this._hunger+=add; this.floatText&&this.floatText(e.x,e.y-40,'🍖 +'+Math.round(add)+' Hunger','#ffd166'); this.screenShake&&this.screenShake(120,0.004); Sfx.chestWin&&Sfx.chestWin(); this._feastT=Math.min(this._feastT,FEAST_EVERY*0.5); return; } this._hunger+=(e.isElite?6:HUNGER_PER_KILL)*(this.recipeHas('horde')?1.15:1)*(1+atlasLv('appetite')*0.06); }
  // v6.42 Feast Targets (เจ้าของเลือกข้อ 1: เติมหลอดด้วยเป้าหมาย) · มอนธรรมดาเติมนิดเดียว · เป้า 🍖 โผล่เป็นระยะ ฆ่าทัน = +15% หลอด · ไม่ทัน = หนีหาย
  tickFeast(dt){ if(this._feastOn){ const e=this._feastOn; if(!e.active||!e._feast){ this._feastOn=null; } else { e._feastLife-=dt; e._huntFlee=this.dist(this.player.x,this.player.y,e.x,e.y)<320; if(e._feastLife<=0){ e._huntFlee=false; e._feast=false; e._fleeing=true; this._feastOn=null; this.showBanner('💨 The Feast escaped','Catch the next one faster',1400); this.tweens.add({targets:e,alpha:0,duration:1200,onComplete:()=>{ if(e.active&&e._fleeing){ e.setAlpha(1); e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } }}); } } return; }
    this._feastT=(this._feastT==null?FEAST_FIRST:this._feastT)-dt; if(this._feastT>0)return; this._feastT=FEAST_EVERY;
    const e=this.spawnElite(); if(!e)return; e.hp*=2.2; e.maxhp=e.hp; e._feast=true; e._feastLife=FEAST_LIFE; e.tintColor=0xffb04d; e.setTint(0xffb04d); e.setScale((e.baseScale||1)*1.2);this.applySpecialEnemyArt(e,'feast_target_animated'); this._feastOn=e;
    this.showBanner('🍖 Feast Target!','Hunt it down within '+FEAST_LIFE+'s — worth '+Math.round(FEAST_SHARE*100)+'% of the Hunger Meter',2000); }
  claimPactMilestones(){ const ch=egCharKey(),heat=this._amapNode?Math.floor(this._amapNode.d/5):0,pb=pactBestChar(ch); if(heat<=pb)return; Save.data.pactBestChar=Save.data.pactBestChar||{}; Save.data.pactBestChar[ch]=heat;Sfx.menuCue?.('ui_pact_claim',.45);
    const got=[]; PACT_MILESTONES.forEach(m=>{ if(m.heat>pb&&m.heat<=heat){ got.push(m.emoji+' '+m.name);
      if(m.heat===2)this.sugarStage+=500; else if(m.heat===4)this.grantCurrencyReward(5,'epic','⛏ Depth milestone'); else if(m.heat===6)Save.data.riftKeys=(Save.data.riftKeys||0)+1; else if(m.heat===8)this.grantGear('legend');
      else { const u=GEAR_ALL.filter(g=>g.unique); const it=Phaser.Utils.Array.GetRandom(u); if(it)Save.receiveGearInstance(it.id,{isNew:true,itemLevel:85,chapter:5}); } } });
    if(ch==='cocoa'&&pb<TITAN_RAGE4_HEAT&&heat>=TITAN_RAGE4_HEAT)got.push('🗿 Titan Rage IV unlocked');
    Save.save(); if(got.length)this.time.delayedCall(5000,()=>this.showBanner('⛏ Depth milestone · '+(heat*5),got.join(' · '),2600)); }
  finishRecipeBoss(){ const r=this._recipe; if(!r)return; this.clearRecipeShrine(); this.claimPactMilestones();
    if(this._sugarRewardMap){ this._sugarRewardMap=false; this.sugarStage=Math.round((this.sugarStage||0)*1.5); } if((this._pactHeat||0)>(Save.data.pactBest||0)){ Save.data.pactBest=this._pactHeat; Save.save(); this.time.delayedCall(2600,()=>this.showBanner('🔥 New Pact record: Heat '+this._pactHeat,'',2000)); }
    const at=atlasData(); at[r.theme]=Math.max(at[r.theme]||0,r.tier);
    if(r.node!=null&&amapNode(r.node)){ const dv=delveSave(),am=dv.clears,nd=amapNode(r.node),first=!am[r.node]; am[r.node]=(am[r.node]|0)+1; const newBest=nd.d>(dv.best||0); if(newBest)dv.best=nd.d;
      { const fi=this._amapInf||{},dr=this.diffMul().reward,got=[];
        if(fi.spicy){ this.grantCurrencyReward(fi.spicy,this.currencyTierFor(),'🌶️ Spicy influence'); }
        if(fi.frosty){ const n=Math.round(6*fi.frosty*dr); Save.addThreads(n); got.push('❄️ +'+n+' Thread'); }
        if(fi.sweet){ const n=Math.round((40+r.tier*15)*fi.sweet*dr); this.sugarStage+=n; got.push('🍯 +'+n+' Sugar'); }
        if(fi.sour){ let n=0; for(let i=0;i<fi.sour;i++)if(Math.random()<0.5&&this.grantGear(Math.random()<0.25?'epic':'rare'))n++; if(n)got.push('🍋 +'+n+' gear'); }
        if(got.length)this.time.delayedCall(3800,()=>this.showBanner('🍽 Flavor rewards',got.join(' · '),2200)); }
      if(first)this.time.delayedCall(5200,()=>this.showBanner('⛏ '+nd.name+' · Depth '+nd.d,(amapNodePts(nd)?'+'+amapNodePts(nd)+' Delve point'+(amapNodePts(nd)>1?'s':'')+' · ':'')+'new paths revealed'+(newBest?' · new record!':''),2600));
      const dr=this.diffMul().reward;
      if(nd.type==='vault'){ const vb=Math.round((80+nd.d*12)*dr); this.sugarStage+=vb; this.grantGear('rare'); this.time.delayedCall(1200,()=>this.showBanner('💎 Treasure Pocket','🍬 +'+vb+' Sugar · bonus gear',1800)); }
      if(nd.type==='elite'){ this.grantGear('epic'); this.time.delayedCall(1200,()=>this.showBanner('💀 Elite Den','Epic gear secured',1800)); }
      if(nd.type==='city'&&first){ const cb=Math.round((300+nd.d*25)*dr); this.sugarStage+=cb; Save.data.riftKeys=(Save.data.riftKeys||0)+1; this.grantCurrencyReward(3,this.currencyTierFor(),'🏰 Candy City'); this.time.delayedCall(1200,()=>this.showBanner('🏰 Candy City','🍬 +'+cb+' Sugar · 🗝 +1 Pinnacle key',2200)); }
      if(nd.type==='boss'&&first){ this.grantCurrencyReward(4,this.currencyTierFor(),'👑 Floor '+nd.d); this.time.delayedCall(1200,()=>this.showBanner('👑 Floor '+nd.d+' conquered','Checkpoint saved'+(nd.d===30?' · ✦ The Hunger Beneath is open':''),2400)); } }
    if(!Save.data.recipeBest)Save.data.recipeBest={}; const k=r.theme,prev=Save.data.recipeBest[k],fill=Math.round(this._recipeFillT);
    let best=false; if(this._hungerDone&&this._recipeFillT<RECIPE_TIME_CAP&&(!prev||fill<prev)){Save.data.recipeBest[k]=fill;best=true;}
    let bonus=0; if(this._recipeFast){ bonus=Math.round((60+r.tier*25)*this.diffMul().reward); this.sugarStage+=bonus; }
    const got=[],lost=0; const capBefore=mapTierCap(); Save.data.recipeMaxClear=Math.max(Save.data.recipeMaxClear||0,r.tier); const newCap=mapTierCap();
    const frag=1+Math.floor(r.tier/4)+(this._recipeFast?1:0); Save.data.pinnacleFrags=(Save.data.pinnacleFrags||0)+frag; let keys=0;
    while(Save.data.pinnacleFrags>=RECIPE_FRAGS_PER_KEY){Save.data.pinnacleFrags-=RECIPE_FRAGS_PER_KEY;Save.data.riftKeys=(Save.data.riftKeys||0)+1;keys++;}
    const uqPool=uniqueForTheme(r.theme),uqChance=0.05+r.tier*0.01+(r.rarity==='rare'?0.05:0)+(this._recipeFast?0.03:0)+0.03*((this._amapInf&&this._amapInf.fermented)||0); let uqGot=null;
    if(uqPool.length&&Math.random()<uqChance){ const u=Phaser.Utils.Array.GetRandom(uqPool),d=Save.receiveGearInstance(u.id,{isNew:true,itemLevel:Math.min(100,70+r.tier*2),chapter:5}); if(d)uqGot=u; }
    if(uqGot){ Save.data.uniqueFound=Save.data.uniqueFound||{}; Save.data.uniqueFound[uqGot.id]=(Save.data.uniqueFound[uqGot.id]||0)+1; this.time.delayedCall(7800,()=>{ this.screenFlash(0xc9a3ff,0.6,500); this.showBanner('🟣 UNIQUE: '+uqGot.emoji+' '+uqGot.name,uqGot.desc.replace('UNIQUE · ',''),3000); }); }
    Save.data.recipeMaxTier=Math.max(Save.data.recipeMaxTier||1,...got.map(d=>d.tier),r.tier);
    Save.save(); this._recipeLoot={got,lost,frag,keys};
    this.showBanner((this._amapNode?'⛏ Depth '+this._amapNode.d:'📜 Recipe T'+r.tier)+' cleared!',(this._recipeFast?'⚡ Speed bonus 🍬'+bonus+' · ':'')+'Fill '+fill+'s'+(best?' · NEW BEST':''),2400);
    const line=got.map(d=>STAGES[d.theme].emoji+' T'+d.tier+(d.rarity!=='normal'?' '+RECIPE_RARITY[d.rarity].label:'')).join(', ');
    this.time.delayedCall(2500,()=>this.showBanner(newCap>capBefore?'🗺 Tier '+newCap+' unlocked!':'🗺 Map cleared','🧩 +'+frag+' Pinnacle fragment'+(frag>1?'s':'')+(keys?' · 🗝️ +'+keys+' Key':'')+' ('+(Save.data.pinnacleFrags||0)+'/'+RECIPE_FRAGS_PER_KEY+')',2600)); }
  // R3: ดรอป recipe ถัดไป — การันตี 1 ใบ (Tier เท่าเดิม; 35% +1, เร็ว +20%) · ใบที่ 2 ลุ้น 25% (+ตาม mod) · rarity ดีขึ้นตาม Tier (กฎเหล็ก)
  drawContinuousCombatStrip(g,w){
    const width=Math.min(182,w-32),x=Math.round((w-width)/2),y=45;
    g.fillStyle(0x111c2a,.93).fillRoundedRect(x,y,width,32,8);
    g.lineStyle(1,0x9ed5ea,.36).strokeRoundedRect(x+.5,y+.5,width-1,31,8);
    const remaining=Math.max(0,this.waveTimer||0);
    const step=this.mode==='bossWarning'||this.mode==='bossIntro'?6:
      this.waveIndex===3?(remaining>C1_WAVE_SEC[3]-C1_RECOVERY_SEC?3:4):this.waveIndex===4?5:this.waveIndex;
    const gap=4,segment=(width-28-gap*6)/7;
    for(let i=0;i<7;i++){
      const tone=i<step?0x7dbea9:i===step?0xbfeaff:0x3f556b;
      g.fillStyle(tone,1).fillRoundedRect(x+14+i*(segment+gap),y+23,segment,3,1.5);
    }
  }
  continuousCombatWaveText(){
    const remaining=Math.max(0,this.waveTimer||0);
    const recovering=this.waveIndex===3&&remaining>C1_WAVE_SEC[3]-C1_RECOVERY_SEC;
    const phase=recovering?'Recovery':(['Warm-up','Pressure','Miniboss','Escalation','Swarm'][this.waveIndex]||'Combat');
    return phase+' · '+Math.ceil(remaining-(recovering?C1_WAVE_SEC[3]-C1_RECOVERY_SEC:0))+'s';
  }
  updateWaveText(){
    const st=STAGES[this.stageIndex]; if(!st)return;
    if(this.mode==='boss') this.timeTxt.setText('👹 Boss');
    else if(this.mode==='bossWarning') this.timeTxt.setText('Boss incoming');
    else if(this.mode==='miniWarning') this.timeTxt.setText('Miniboss incoming');
    else if(this.mode==='portal') this.timeTxt.setText('Enter the portal');
    else if(this.mode==='mini') this.timeTxt.setText('Miniboss encounter');
    else if(this.mode==='breather') this.timeTxt.setText(this._v83Run?'Get ready':'Next wave…');
    else if(this._v83Run&&this.mode==='wave')this.timeTxt.setText(this.continuousCombatWaveText());
    else this.timeTxt.setText('Wave '+(this.waveIndex+1)+'/'+st.waves+' · '+Math.max(0,Math.ceil(this.waveTimer||0))+'s');
    this.drawWavePips();
  }
  drawWavePips(){
    const g=this.pipG; if(!g)return; g.clear(); const pips=null; this.hudPipsArt?.(pips); this._bossPipImg?.setVisible(false);
    if(this.recipeMode){ this.renderRecipeProgress(g); return; }
    if(this._v83Run)return;
    const st=STAGES[this.stageIndex]; if(!st||this.mode==='boss'||this.bossName?.visible)return;
    const n=st.waves, seg=this._pipX0!=null?10:Math.min(12,(this.W*.28)/n), w=seg-4, h=this._pipX0!=null?6:4;
    const x0=this._pipX0!=null?this._pipX0:this.W-28-n*seg, y=this._pipX0!=null?Math.round(this._pipY-h/2):49;   // ย้ายลงใต้แถบ stat (กันจุดเวฟทับเลข atk/def/crit)
    for(let i=0;i<n;i++){ const x=x0+i*seg;
      let col=0x4a4059, a=0.7;                       // ยังไม่ถึง
      if(i<this.waveIndex){ col=0x8bd3a0; a=0.9; }    // ผ่านแล้ว
      else if(i===this.waveIndex){ col=0xffd166; a=1; }// เวฟปัจจุบัน
      if(pips)pips.push([x+w/2,y+h/2,i<this.waveIndex?0:i===this.waveIndex?1:2,Math.min(13,seg-1)]); else{ g.fillStyle(col,a); g.fillRoundedRect(x,y,w,h,3); }
      if(i===st.miniAt){ g.fillStyle(0xff7ac0,1); g.fillCircle(x+w/2,y-3,1.5); } // pointsชมพู=Miniboss
    }
    // ปลายแถว = บอสใหญ่
    const bx=x0+n*seg+5,by=y+h/2;   // v8.0.14 ท้ายแถว = หัวกะโหลกบอส
    let sk=this._bossPipImg; if(!sk||!sk.active){ sk=this._bossPipImg=this.textures?.exists?.('hud_ic_kill')?this.add.image(0,0,'hud_ic_kill').setDisplaySize(12,12):this.add.text(0,0,'💀',{fontSize:'10px'}).setOrigin(.5); sk.setScrollFactor?.(1); sk.setDepth?.(52); this.camUI?.(sk); this.hudList?.push(sk); }
    if(sk.type==='Image')sk.setTint(0xff8fb0); sk.setPosition(bx,by).setVisible(!!g.visible);
    if(pips)this.hudPipsArt(pips);
  }
  // Endgame: หลอดความคืบหน้า Recipe แบบเดียวกับจุดเวฟของด่าน (event / boss เป็นหมุดบนหลอด)
  // v6.2.3: ใช้อาร์ตหลอด replay (ย่อ ~70%) · หมุด event วาดใน pipG ทับหลอด
  // v6.98 หลอด progress มีชีวิต: เติมแบบลื่น + แสงวิ่ง + หัวหลอดเรือง + เด้งเมื่อเพิ่ม
  animateProgressBar(dt){ const L=this.replayProgressFill; if(!L)return; if(!this.pbFx||!this.pbFx.scene){ this.pbFx=this.camUI(this.add.graphics().setDepth(56)); }
    const g=this.pbFx; g.clear(); if(!L.visible||this._pbTarget==null){ this._pbShow=this._pbTarget||0; return; }
    const tgt=this._pbTarget; if(this._pbShow==null||tgt<this._pbShow-0.2)this._pbShow=tgt;
    if(tgt>(this._pbLast??tgt)+0.004)this._pbPop=1; this._pbLast=tgt;
    this._pbShow+=(tgt-this._pbShow)*Math.min(1,dt*6); const f=Math.max(0,Math.min(1,this._pbShow));
    L.setCrop(0,0,Math.max(1,L.frame.width*f),L.frame.height); const x0=L.x,w=L.displayWidth*f,h=L.displayHeight,y=L.y; if(w<3)return;
    const t=(this.time.now||0)/1000,sx=x0+((t*0.55)%1.4-0.2)*Math.max(w,40);
    if(sx>x0&&sx<x0+w){ g.fillStyle(0xffffff,0.28); g.fillRect(Math.max(x0,sx-7),y-h/2+1,Math.min(14,x0+w-Math.max(x0,sx-7)),h-2); g.fillStyle(0xffffff,0.5); g.fillRect(Math.max(x0,sx-1.5),y-h/2+1,3,h-2); }
    this._pbPop=Math.max(0,(this._pbPop||0)-dt*3); const pul=0.5+0.5*Math.sin(t*6),hx=x0+w;
    g.fillStyle(0xfff2b0,0.22+0.18*pul+0.3*this._pbPop); g.fillCircle(hx,y,h*0.9+3*this._pbPop+2*pul);
    g.fillStyle(0xffffff,0.85); g.fillCircle(hx,y,Math.max(2,h*0.32)); }
  renderRecipeProgress(g){ const F=this.replayProgressFrame,L=this.replayProgressFill; if(!F||!L)return;
    if(this.mode==='boss'||this._hungerDone||this.state!=='play'&&this.state!=='levelup'){ F.setVisible(false); L.setVisible(false); return; }
    const goal=this.recipeHungerGoal(),f=Math.max(0,Math.min(1,(this._hunger||0)/goal)),mw=Math.min(250,(this.W-34)*0.72),y=(this._pad||0)+HUD_ROWS.progress;
    F.setPosition(this.W/2,y).setDisplaySize(mw,24).setVisible(true);
    L.setPosition(this.W/2-mw*.435,y).setDisplaySize(mw*.87,11).setVisible(f>0); this._pbTarget=f;
    const marks=atlasLv('eventful')>=1?[0.3]:[0.4]; if(atlasLv('eventful')>=2)marks.push(0.7);
    marks.forEach((m,i)=>{ const mx=this.W/2-mw*.435+mw*.87*m; g.fillStyle((this._recipeEventN||0)>i?0x8bd3a0:0xb98cff,1); g.fillCircle(mx,y-9,3); }); }
  waveProfile(w){
    const si=this.stageIndex;
    if(si===9){const root=[
      {name:'Crown Roots Stir',desc:'Rootlings teach the throne pulse while Thorn Chargers close open lanes',dur:52,interval:1.14,batch:2,max:30,pressureCap:.32,types:['basic','basic','fast','basic']},
      {name:'Bramble Oath',desc:'Bramble Assassins and Sap Oracles punish straight retreat',dur:55,interval:.88,batch:3,max:40,pressureCap:.47,types:['fast','dasher','shooter','basic','basic']},
      {name:'Knight of the First Root',desc:'The Ancient Root Knight rises with shielded retainers',dur:0,interval:1.00,batch:3,max:34,pressureCap:.52,types:['tank','fast','shooter','basic']},
      {name:'Memory Siege',desc:'Bark Bulwarks cover Seed Bombs and Root Choir Leeches',dur:58,interval:.84,batch:4,max:46,pressureCap:.68,types:['tank','siege','shooter','bomber','fast','basic']},
      {name:'The Crown Remembers',desc:'Every root caste answers before the True Rootmother awakens',dur:64,interval:.66,batch:5,max:54,pressureCap:.82,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return root[w]||root[root.length-1];}
    if(si===8){const seasons=[
      {name:'Spring Unsealed',desc:'Budlings regenerate the garden while Sunscarabs test the outer lanes',dur:52,interval:1.18,batch:2,max:32,pressureCap:.30,types:['basic','basic','fast','basic']},
      {name:'Solstice Crossfire',desc:'Frostbells predict movement while Leafblades cut across the arena',dur:55,interval:.90,batch:3,max:42,pressureCap:.45,types:['fast','dasher','shooter','basic','basic']},
      {name:'Keeper of the Dial',desc:'The Season Keeper locks all four crests into combat formation',dur:0,interval:1.02,batch:3,max:36,pressureCap:.50,types:['tank','fast','shooter','basic']},
      {name:'Equinox Storm',desc:'Gardeners shield Stormcloud Fruit and Seasonal Wisps',dur:58,interval:.88,batch:4,max:48,pressureCap:.66,types:['tank','siege','shooter','bomber','fast','basic']},
      {name:'Chronobloom Paradox',desc:'Every season overlaps before the Orchid rewinds the greenhouse',dur:62,interval:.68,batch:5,max:56,pressureCap:.80,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return seasons[w]||seasons[seasons.length-1];}
    if(si===7){const hive=[
      {name:'Nectar Bell',desc:'Nectar Drones teach that the flowers are now part of the battlefield',dur:52,interval:1.22,batch:2,max:34,pressureCap:.30,types:['basic','basic','basic','fast']},
      {name:'Crosswind Hunt',desc:'Dartwings and Pollen Snipers enter from fast aerial lanes',dur:55,interval:.92,batch:3,max:44,pressureCap:.44,types:['fast','dasher','shooter','basic','basic']},
      {name:'Royal Intercept',desc:'Royal Stinger descends with a guard of Dartwings',dur:0,interval:1.10,batch:3,max:38,pressureCap:.50,types:['fast','dasher','basic','shooter']},
      {name:'Flower Siege',desc:'Wax Shieldbearers and Choir Moths protect Honey Bomb assaults',dur:58,interval:.94,batch:4,max:50,pressureCap:.64,types:['tank','siege','shooter','bomber','basic','fast']},
      {name:'Crown Fermentation',desc:'Every hive caste attacks before the Queen opens her crystal crown',dur:62,interval:.70,batch:5,max:58,pressureCap:.78,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return hive[w]||hive[hive.length-1];}
    if(si===6){const marsh=[
      {name:'Marsh Awakening',desc:'Mycelium Drifters teach that every kill can leave dangerous ground behind',dur:52,interval:1.30,batch:2,max:34,pressureCap:0.28,types:['basic','basic','basic','fast']},
      {name:'Predictive Hunt',desc:'Cap Hoppers and Puffcap Snipers punish straight-line retreat',dur:54,interval:0.98,batch:3,max:46,pressureCap:0.42,types:['fast','dasher','shooter','basic','basic']},
      {name:'Colony Gate',desc:'The Fungal Juggernaut arrives with Drifters and Hoppers',dur:0,interval:1.20,batch:3,max:40,pressureCap:0.48,types:['basic','fast','dasher','shooter']},
      {name:'Living Network',desc:'Bulwarks protect the line while Oracles and Mold Sacs close the safe routes',dur:57,interval:1.02,batch:4,max:54,pressureCap:0.62,types:['tank','tank','siege','shooter','bomber','basic']},
      {name:'Heart Under the Mire',desc:'Every fungal role attacks together before the Behemoth wakes',dur:61,interval:0.76,batch:5,max:68,pressureCap:0.76,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return marsh[w]||marsh[marsh.length-1];}
    if(si===5){const canopy=[
      {name:'Ferment Sprout',desc:'Ferment Sprouts grow from memories forced through the seasons',dur:50,interval:1.42,batch:2,max:30,pressureCap:0.22,types:['basic','basic','basic','basic','fast']},
      {name:'Hunting Vines',desc:'Vine Skippers leap across roots while sprouts cut off retreat',dur:52,interval:1.04,batch:3,max:42,pressureCap:0.36,types:['fast','fast','dasher','basic','basic']},
      {name:'Spore Warden',desc:'The Sporewarden Mantis seals the canopy and calls sprouts from the fermented floor',dur:0,interval:1.34,batch:3,max:36,pressureCap:0.42,types:['basic','fast','fast','shooter']},
      {name:'Toxic Fruit Rain',desc:'Spore Lanterns fire from afar while Rotfruit Pods explode to squeeze the field',dur:55,interval:1.14,batch:3,max:46,pressureCap:0.56,types:['tank','siege','shooter','shooter','bomber','basic']},
      {name:'Season Collapse',desc:'Mutated plants of every kind bloom before the Rootmother wakes',dur:59,interval:0.82,batch:4,max:62,pressureCap:0.70,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return canopy[w]||canopy[canopy.length-1];}
    if(si===4){const crown=[
      {name:'Void Shard',desc:'Void Crumbs drift from the banquet table and start devouring scraps of flavor',dur:50,interval:1.48,batch:2,max:28,pressureCap:0.20,types:['basic','basic','basic','basic','basic','fast']},
      {name:'Crown Shredder',desc:'Crown Rippers dash through the ranks amid swarms of Void Crumbs',dur:52,interval:1.08,batch:3,max:40,pressureCap:0.34,types:['fast','fast','dasher','basic','basic']},
      {name:'Banquet Executioner',desc:'The Banquet Executioner leads the crown army to seal the oven doors',dur:0,interval:1.40,batch:2,max:32,pressureCap:0.40,types:['basic','basic','fast','fast']},
      {name:'Banquet Eye',desc:'Banquet Eyes fire from the rear while Maw Truffles squeeze the field',dur:54,interval:1.24,batch:3,max:42,pressureCap:0.52,types:['tank','siege','shooter','shooter','bomber','basic']},
      {name:'Tasteless Banquet',desc:'An army of every kind pours in before the Sovereign who devours flavor arrives',dur:58,interval:0.88,batch:4,max:58,pressureCap:0.66,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return crown[w]||crown[crown.length-1];}
    if(si===1){const drain=[
      {name:'Loose Pipe Bubble',desc:'Basic rot-bubbles lead the way — learn their movement slowly',dur:46,interval:1.55,batch:2,max:24,pressureCap:0.20,types:['basic','basic','basic','basic','basic','basic','basic','basic']},
      {name:'Backflow Current',desc:'Swoopers ride the current, forcing you to change your path',dur:48,interval:1.15,batch:3,max:34,pressureCap:0.32,types:['fast','fast','dasher','basic','basic']},
      {name:'Boiling Valve',desc:'Boiling valve-keepers lead a fast reinforcement wave',dur:0,interval:1.50,batch:2,max:28,pressureCap:0.38,types:['basic','basic','basic','basic','fast','fast','fast']},
      {name:'Clogged Grate',desc:'Heavy-armored bubbles squeeze the field while spitters fire from behind',dur:50,interval:1.32,batch:2,max:34,pressureCap:0.48,types:['tank','tank','basic','basic','basic','shooter','bomber']},
      {name:'Sewer Overflow',desc:'Every kind pours in together before the sponge-demon’s chamber',dur:54,interval:0.98,batch:3,max:46,pressureCap:0.62,types:['fast','fast','dasher','shooter','bomber','tank','basic','basic']}
    ];return drain[w]||drain[drain.length-1];}
    const profiles=[
      {name:'Opening Move',desc:'A basic melee swarm eases in — read their movement first',dur:48,interval:1.60,batch:2,max:25,pressureCap:0.18,types:si===0?['basic','basic','basic','basic','basic','basic','basic','basic','basic','acid']:['basic','basic','basic','fast']},
      {name:'Lightning Swarm',desc:'Fast enemies charge in groups — don’t stand still',dur:50,interval:1.10,batch:3,max:38,pressureCap:0.30,types:['fast','fast','dasher','basic','basic']},
      {name:'Stage Warden',desc:'A miniboss with a melee support wave',dur:0,interval:1.50,batch:2,max:30,pressureCap:0.36,types:si===0?['basic','basic','basic','basic','acid']:['basic','basic','basic','basic','fast','fast']},
      {name:'Iron Wall',desc:'Tanks and ranged lines squeeze the field',dur:52,interval:1.35,batch:2,max:36,pressureCap:0.48,types:si<2?['tank','tank','basic','basic','basic','basic','acid','shooter']:['tank','siege','shooter','basic','basic']},
      {name:'Final Trial',desc:'A mixed wave before the boss confrontation',dur:56,interval:0.92,batch:4,max:52,pressureCap:0.62,types:si===0?['acid','dasher','tank','basic','basic','basic']:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];
    return profiles[w]||profiles[profiles.length-1];
  }
  // v5.7: บทพูดคั่นเวฟ = บับเบิลเหนือหัวตัวละคร ไม่หยุดเกม (เดิมหยุดเกม 3.6-7 วิทุกเวฟ) · ชื่อเวฟยังขึ้นเป็นแบนเนอร์ใน beginWave
  playWaveCutscene(w,beat,done){
    if(this._inTutorial){done();return;}
    const reactions=STORY_REACTIONS[this.character]||STORY_REACTIONS.momo,quote=reactions[w%reactions.length];
    this.showSpeechBubble(quote,Phaser.Math.Clamp(1800+quote.length*45,2600,4200));
    done();
  }
  /* v7.9.60 Ruby: กรอบดำขอบขาว + รูปมาสคอต (ภาพ mascot_ruby ถ้ามี ไม่งั้นวาดโมจิชั่วคราว) + ป้ายชื่อ · [คำ] = สีทอง/เขียวสลับ · คิวทีละข้อความ */
  /* v8.0.2 ใบ 45 Motion Comic: เล่นฉากเรื่องราวแบบเลเยอร์ (ฉาก far/mid/fg ขยับ zoom/pan + หุ่น + FX) บน storyLayer · โหลดภาพทีละฉาก เล่นจบลบ texture cs_ · ภาพไม่มา = คืน false ให้ใช้ของเดิม */
  mcScene(id){const m=/^b(\d{2})$/.exec(id||'');const P=typeof mcPlain==='function'?mcPlain:x=>x;return P(m?bossMotionScene(Number(m[1]),!!(this._mc61Off&&this._mc61Off[id])):(typeof MOTION_COMICS!=='undefined'?MOTION_COMICS[id]||null:null));}
  mcKeys(sc){ const s=new Set(); for(const sh of sc.shots){ (sh.bg||[]).forEach(k=>s.add(k)); (sh.L||[]).forEach(l=>s.add(l[0])); } return [...s]; }
  mcSeen(id){ return !!((Save.data||{}).mcSeen||{})[id]; }
  mcStory(){ return !this.recipeMode&&!this.riftMode&&!this.bossRush&&!this._inTutorial&&!this._pinnacleRun; }
  mcGate(id,cont){ const d=Save.data||{}; if(!id||!this.mcScene(id)||!this.add||!this.storyLayer||d.settings?.noRuby||this.mcSeen(id)||(this._mcFail||{})[id])return false;
    if(this._mc&&!this._mc.done)return true; this.playMotionComic(id,ok=>cont&&cont(ok)); return true; }
  mcGateList(ids,cont){ let ok=true,started=false; const step=i=>{ for(;i<(ids||[]).length;i++){ if(this.mcGate(ids[i],r=>{ ok=ok&&r; step(i+1); })){ started=true; return; } } if(started&&cont)cont(ok); }; step(0); return started; }
  playMotionComic(id,done){ const sc=this.mcScene(id),layer=this.storyLayer; if(!sc||!layer){ done&&done(false); return; }
    const prev=this.state,wasPlay=prev==='play',W=this.W,H=this.H,owner=this._bossComicOwner,prevMusic=Sfx._currentBgmKey; const mood=/^(s16|s17)$/.test(id)?'finale':/^(s11|s13|s06|s07|s08|s09)$/.test(id)?'hope':/^(s01|s12|s14|s15|b)/.test(id)?'tension':'calm'; if(wasPlay)this.physics.pause(); this.state='cinematic';
    layer.removeAll(true); layer.setVisible(true);
    const menuHid=!!this.menu?.visible; if(menuHid)this.menu.setVisible(false);   // v8.1.21 ฉากเรื่องทึบเต็มจอ: ไม่ต้องวาดฉากเมนูหลักซ้อนข้างหลัง (GPU)
    const mc={id,sc,layer,i:-1,objs:[],tw:[],ev:[],done:false,ready:false,shotAt:0,t0:Date.now(),red:!(this.hubMotionAllowed?this.hubMotionAllowed():true)}; this._mc=mc;
    const veil=this.add.rectangle(0,0,W,H,0x07040b,1).setOrigin(0),lt=this.add.text(W/2,H/2,'✦ Loading story…\nTap to skip',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffd166',align:'center',lineSpacing:6}).setOrigin(.5).setAlpha(0);
    layer.add([veil,lt]); this.tweens.add({targets:lt,alpha:.85,duration:500,delay:700});
    let keys=this.mcKeys(sc);const drop=()=>keys.filter(k=>/^(cs_|cs61_|vfx_cs61_)/.test(k)&&this.textures.exists(k)).forEach(k=>{ if(this.anims.exists(k))this.anims.remove(k); this.textures.remove(k); });
    let to=null; const finish=seen=>{ if(mc.done)return;const owned=!owner||this.bossComicValid(owner);if(!owned)seen=false; mc.done=true; to&&to.remove(false); this.mcClearShot(mc); this._finishStoryCutscene=null; layer.removeAll(true); layer.setVisible(false); if(menuHid&&this.menu)this.menu.setVisible(true);
      const d=Save.data; if(seen){ (d.mcSeen||(d.mcSeen={}))[id]=1; if(id==='s01'){ d.storyIntroSeen=true; (d.rubyStorybook||(d.rubyStorybook={}))[0]=3; (d.rubyStory||(d.rubyStory={}))[0]=1; } Save.save(); } else (this._mcFail||(this._mcFail={}))[id]=1;
      this.voiceStop?.(mc);this.storyMusicStop?.();if((Sfx._currentBgmKey||'').startsWith('bgm_a04_bgm_story_')){if(!prevMusic||!Sfx._playTrack(prevMusic,prevMusic.startsWith('bgm_boss')?.34:.28))Sfx.playMainBgm();}drop(); if(this._mc===mc)this._mc=null; if(owned){if(this.state==='cinematic')this.state=prev;if(wasPlay)this.physics.resume();done&&done(!!seen);} };
    mc.finish=finish; this._finishStoryCutscene=p=>this.mcTap(mc,p);
    to=this.time.delayedCall(12000,()=>{ if(!mc.ready)finish(false); });
    const go=()=>this.ensureGroup(k=>keys.includes(k),()=>{ if(mc.done){ drop(); return; } if(keys.some(k=>!this.realTex(k))){ if(mc.sc.v61){ const lg=bossMotionScene(Number(String(id).slice(1)),true); if(lg){ drop(); (this._mc61Off||(this._mc61Off={}))[id]=1; mc.sc=lg; keys=this.mcKeys(lg); go(); return; } } finish(false); return; } to.remove(false); mc.ready=true;this.storyMusicPlay?.('bgm_a04_bgm_story_'+mood,()=>this._mc===mc&&!mc.done,.22); this.mcTitle(mc); },{all:true,quiet:true,fx:true});   // v8.0.84 ใบ 61 โหลดไม่ได้ → ฉาก 2 ช็อตเดิม
    go();
  }
  mcTap(mc,p){ if(mc.done)return; if(!mc.ready){ if(Date.now()-(mc.t0||0)<2500)return; mc.finish(false); return; }   /* v8.2.1 owner 🐞: a tap right as the story opened (still loading) skipped the hero rescue scene → loading ignores taps for 2.5 s */ const s=mc.skip;
    if(p&&s&&p.x>=s.x&&p.x<=s.x+s.w&&p.y>=s.y&&p.y<=s.y+s.h){ Sfx.select&&Sfx.select(); mc.finish(true); return; }
    if(mc.typing){ mc.typing(); return; }   // แตะครั้งแรก = พิมพ์ข้อความให้ครบก่อน
    if(Date.now()-mc.shotAt<350)return; this.mcNext(mc); }
  mcNext(mc){ if(mc.done)return; if(mc.i+1>=mc.sc.shots.length){ mc.finish(true); return; } this.mcShot(mc,mc.i+1); }
  mcClearShot(mc){ this.voiceStop?.(mc); mc.tw.forEach(t=>t&&t.remove&&t.remove()); mc.ev.forEach(e=>e&&e.remove&&e.remove(false)); mc.objs.forEach(o=>o&&o.active&&o.destroy()); mc.tw=[]; mc.ev=[]; mc.objs=[]; mc.typing=null; mc.layer.removeAll(true); }
  mcOpen(id){ const d=Save.data||{},g=MC_GALLERY.find(x=>x[0]===id); if(!g||!this.mcScene(id))return false; if((d.mcSeen||{})[id])return true; return g[3]<0?!!d.tutorialDone:!!(d.stageMastery||{})[g[3]]; }
  buildStoryBook(){ this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Story','screen_chapter','hub');
    const w=this.W,h=this.H,hs=this._hdrShift(),list=MC_GALLERY.filter(g=>this.mcScene(g[0])),open=list.filter(g=>this.mcOpen(g[0])).length,F='NunitoUI, sans-serif';
    this.menu.add(this.add.text(w/2,54+hs,'📖 Story so far · '+open+' / '+list.length+' scenes',{fontFamily:F,fontStyle:'bold',fontSize:'13px',color:'#ffe08a'}).setOrigin(.5));
    const top=74+hs,gap=8,cols=2,cw=(w-28-gap)/cols,rows=Math.ceil(list.length/cols),th=Math.max(52,Math.min(66,(h-top-12)/rows-gap));
    list.forEach(([id,em,name],i)=>{ const x=14+(i%cols)*(cw+gap),y=top+Math.floor(i/cols)*(th+gap),ok=this.mcOpen(id),sc=this.mcScene(id),g=this.add.graphics();
      g.fillStyle(0x000000,.35).fillRoundedRect(x+2,y+3,cw,th,12).fillStyle(ok?0x2c1f3c:0x1d1726,.95).fillRoundedRect(x,y,cw,th,12).lineStyle(1.5,ok?0xe0b981:0x463c55,ok?.9:.8).strokeRoundedRect(x,y,cw,th,12);
      const r=Math.min(18,th*.32),cx=x+10+r,cy=y+th/2; g.fillStyle(ok?0x4a2f5e:0x2a2334,1).fillCircle(cx,cy,r); this.menu.add(g);
      this.menu.add(this.add.text(cx,cy,ok?em:'🔒',{fontSize:Math.round(r*1.05)+'px'}).setOrigin(.5).setAlpha(ok?1:.6));
      const tx=cx+r+8,tw=x+cw-8-tx,nm=this.add.text(tx,y+th*.3,ok?name:'???',{fontFamily:F,fontStyle:'bold',fontSize:'13px',color:ok?'#fff1df':'#7d728c'}).setOrigin(0,.5); let f=13; while(nm.width>tw&&f>9)nm.setFontSize(--f+'px'); this.menu.add(nm);
      const sub=this.add.text(tx,y+th*.68,ok?(sc.tag||''):'Keep playing to unlock',{fontFamily:F,fontStyle:'italic',fontSize:'10px',color:ok?'#cbb8dc':'#5f566c'}).setOrigin(0,.5); let st=sub.text; while(sub.width>tw&&st.length>2){ st=st.slice(0,-1); sub.setText(st.trimEnd()+'…'); } this.menu.add(sub);
      this._zone(x,y,cw,th,()=>{ if(!ok){ this.menuToast?.('🔒 Keep playing to unlock this scene'); return; } this.storyReplay(id); }); this.tapZones[this.tapZones.length-1].tag='story_'+id; });
    this.menu.setVisible(true); }
  storyReplay(id){ if(this._mc&&!this._mc.done)return; if(this._mcFail)delete this._mcFail[id];
    this.playMotionComic(id,ok=>{ if(!ok)this.menuToast?.('Story art could not load — try again'); if(this.state==='menu'){ this.menuScreen='story'; this.buildMenuScreen(); } }); }
  /* v8.0.3 การ์ดชื่อแบบหนัง: ตัวหนังสือค่อย ๆ ลอยขึ้น + เส้นทอง + คำโปรย + ฝุ่นลอย · ใช้ทั้งตอนเข้าด่านและก่อนฉากเรื่อง · คืน {objs,dur,out(ms,cb)} */
  cineTitle(parent,o={},reg){ const W=this.W,H=this.H,red=!(this.hubMotionAllowed?this.hubMotionAllowed():true),sp=o.speed||1,y0=o.y??H*.42,F='NunitoUI, sans-serif',objs=[],motes=[];
    Sfx.orderCue?.(o.kicker?.includes('STORY')?'story_title':'stage_title',.35,1);const T=c=>{ const t=this.tweens.add(c); reg&&reg(t); return t; },add=x=>{ parent.add(x); objs.push(x); return x; };
    if(!red)for(let j=0;j<16;j++){ const x=Math.random()*W,y=H*(.3+Math.random()*.6),m=this.add.circle(x,y,.8+Math.random()*1.6,j%3?0xffe7c2:0xffc36b,1).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD); parent.add(m); motes.push(m); const d=3800+Math.random()*3200;
      T({targets:m,y:y-(70+Math.random()*120),x:x+(Math.random()*40-20),duration:d,delay:Math.random()*1500,repeat:-1}); T({targets:m,alpha:.25+Math.random()*.45,duration:d/2,delay:Math.random()*1500,yoyo:true,repeat:-1}); }
    const kick=add(this.add.text(W/2,y0-30,o.kicker||'',{fontFamily:F,fontStyle:'bold',fontSize:'12px',color:'#e0b981',letterSpacing:4}).setOrigin(.5));
    const title=add(this.add.text(W/2,y0,o.title||'',{fontFamily:F,fontStyle:'bold',fontSize:Math.round(Math.min(30,W*.078))+'px',color:'#fff1df',align:'center',wordWrap:{width:W-80},padding:{x:22,y:14}}).setOrigin(.5,0)); title.setShadow(0,0,'#ff9e5e',14,true,true);
    const ly=y0+title.height-6,line=add(this.add.graphics({x:W/2,y:ly})); line.lineStyle(2,0xe0b981,.85); line.lineBetween(-Math.min(120,W*.3),0,Math.min(120,W*.3),0); line.fillStyle(0xffd98a,1); line.fillCircle(0,0,3);
    const tag=add(this.add.text(W/2,ly+16,o.tag||'',{fontFamily:F,fontStyle:'italic',fontSize:'15px',color:'#dccbe8',align:'center',wordWrap:{width:W-60},lineSpacing:4}).setOrigin(.5,0));
    const dur=Math.round((o.tag?3900:2700)*sp);
    if(red){ objs.forEach(x=>x.setAlpha(1)); }
    else { [kick,title,tag].forEach(x=>x.setAlpha(0)); line.setScale(0,1);
      T({targets:kick,alpha:1,y:kick.y,duration:900*sp,delay:300*sp,ease:'Sine.easeOut'}); kick.y+=8;
      title.y+=18; title.setScale(.95); T({targets:title,alpha:1,y:y0,scale:1,duration:1500*sp,delay:800*sp,ease:'Sine.easeOut'});
      T({targets:line,scaleX:1,duration:900*sp,delay:1900*sp,ease:'Cubic.easeOut'});
      tag.y+=10; T({targets:tag,alpha:1,y:ly+16,duration:1400*sp,delay:2500*sp,ease:'Sine.easeOut'}); }
    const out=(ms,cb)=>{ const all=[...objs,...motes]; if(red||!all.length){ cb&&cb(); return; } T({targets:objs,alpha:0,y:'-=10',duration:ms,ease:'Sine.easeIn'}); T({targets:motes,alpha:0,duration:ms,onComplete:()=>cb&&cb()}); };
    return {objs:[...objs,...motes],dur,out};
  }
  mcTitle(mc){ if(mc.sc.noTitle){ mc.i=-1; this.mcNext(mc); return; } this.mcClearShot(mc); mc.i=-1; mc.shotAt=Date.now(); const L=mc.layer,W=this.W,H=this.H,bg=this.add.rectangle(0,0,W,H,0x07040b,1).setOrigin(0); L.add(bg); mc.objs.push(bg);
    const ct=this.cineTitle(L,{kicker:'MOCHITOPIA · STORY',title:mc.sc.title,tag:mc.sc.tag,speed:.72},t=>mc.tw.push(t)); mc.objs.push(...ct.objs);
    mc.ev.push(this.time.delayedCall(ct.dur+800,()=>{ if(mc.done||mc.i!==-1)return; ct.out(650,()=>{ if(!mc.done&&mc.i===-1)this.mcNext(mc); }); })); }
  mcMotes(mc,kind,n){ const W=this.W,H=this.H,C={dust:[0xfff1d6,.45],ember:[0xff8a3d,.9],snow:[0xffffff,.85],spark:[0xffe27a,.9]}[kind]||[0xfff1d6,.45],fall=kind==='snow';
    for(let j=0;j<n;j++){ const x=Math.random()*W,y=Math.random()*H*.7,m=this.add.circle(x,y,fall?1.4+Math.random()*1.8:.8+Math.random()*1.5,C[0],1).setAlpha(0); if(kind==='ember'||kind==='spark')m.setBlendMode(Phaser.BlendModes.ADD);
      mc.layer.add(m); mc.objs.push(m); const d=kind==='ember'?1800+Math.random()*1600:3200+Math.random()*3200,dl=Math.random()*1400;
      mc.tw.push(this.tweens.add({targets:m,y:y+(fall?1:-1)*(90+Math.random()*160),x:x+(Math.random()*50-25),duration:d,delay:dl,repeat:-1}));
      mc.tw.push(this.tweens.add({targets:m,alpha:C[1]*(.5+Math.random()*.5),duration:d/2,delay:dl,yoyo:true,repeat:-1})); } }
  mcLines(mc,at,dur,cx,cy){ const W=this.W,H=this.H,R=Math.hypot(W,H)*.62,g=this.add.graphics().setAlpha(0); mc.layer.add(g); mc.objs.push(g);
    const draw=()=>{ g.clear(); g.fillStyle(0xffffff,.9); for(let j=0;j<34;j++){ const a=Math.random()*Math.PI*2,w=.01+Math.random()*.018,r0=R*(.4+Math.random()*.24); g.beginPath(); g.moveTo(cx+Math.cos(a-w)*R,cy+Math.sin(a-w)*R); g.lineTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0); g.lineTo(cx+Math.cos(a+w)*R,cy+Math.sin(a+w)*R); g.closePath(); g.fillPath(); } };
    const go=()=>{ if(!g.active)return; g.setAlpha(.7); draw(); mc.ev.push(this.time.addEvent({delay:60,repeat:Math.ceil(dur/60),callback:()=>{ if(g.active)draw(); }})); mc.tw.push(this.tweens.add({targets:g,alpha:0,delay:dur*.55,duration:dur*.45})); };
    if(at)mc.ev.push(this.time.delayedCall(at,go)); else go(); }
  mcRays(mc,at,cx,cy,color){ const R=Math.hypot(this.W,this.H)*.7,g=this.add.graphics({x:cx,y:cy}).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD); g.fillStyle(color||0xfff1c8,1);
    for(let j=0;j<14;j++){ const a=j/14*Math.PI*2,w=.065; g.fillTriangle(0,0,Math.cos(a-w)*R,Math.sin(a-w)*R,Math.cos(a+w)*R,Math.sin(a+w)*R); } mc.layer.add(g); mc.objs.push(g);
    mc.ev.push(this.time.delayedCall(Math.max(0,at-150),()=>{ if(!g.active)return; mc.tw.push(this.tweens.add({targets:g,alpha:.3,duration:420,yoyo:true,hold:700,ease:'Sine.inOut'})); mc.tw.push(this.tweens.add({targets:g,rotation:.45,duration:2000})); })); }
  mcPow(mc,at,text,red){ const W=this.W,H=this.H,left=(mc.i%2)===0,t=this.add.text(left?W*.3:W*.7,H*.2,text,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.round(Math.min(46,W*.12))+'px',color:'#ffd34d',stroke:'#2a0f1c',strokeThickness:8}).setOrigin(.5).setAngle(left?-10:9).setScale(0);
    t.setShadow(3,4,'#000000',0,true,true); mc.layer.add(t); mc.objs.push(t);
    mc.ev.push(this.time.delayedCall(at||0,()=>{ if(!t.active)return; const cue=String(text).toLowerCase().replace(/[^a-z]/g,'');Sfx.orderCue?.('pow_'+({poof:'pop'}[cue]||cue),.45,.12)||Sfx.boom?.();if(red){ t.setScale(1); return; } mc.tw.push(this.tweens.add({targets:t,scale:1.22,duration:140,ease:'Back.easeOut',onComplete:()=>{ if(t.active)mc.tw.push(this.tweens.add({targets:t,scale:1,duration:120})); }})); mc.tw.push(this.tweens.add({targets:t,alpha:0,y:t.y-14,delay:1100,duration:420})); })); }
  mcShot(mc,i){ this.mcClearShot(mc); const sc=mc.sc,sh=sc.shots[i],n=sc.shots.length,W=this.W,H=this.H,L=mc.layer,red=mc.red,ms=sh.ms||3200;
    mc.i=i; mc.shotAt=Date.now(); const bossWide=!!sc.boss&&W>H,viewW=bossWide?W*.58:W,k=Math.min(viewW/360,H/780),X=x=>viewW/2+(x-180)*k,Y=y=>H/2+(y-390)*k;
    const add=o=>{ L.add(o); mc.objs.push(o); return o; },at=(t,fn)=>{ if(!t){ fn(); return; } mc.ev.push(this.time.delayedCall(t,fn)); };
    const tw=(c,loop)=>{ if(red){ if(loop)return null; for(const p in c)if(!['targets','duration','delay','ease','yoyo','repeat','onComplete','onUpdate'].includes(p))[].concat(c.targets).forEach(t=>{ t[p]=c[p]; }); c.onComplete&&c.onComplete(); return null; } const t=this.tweens.add(c); mc.tw.push(t); return t; };
    add(this.add.rectangle(0,0,W,H,0x07040b,1).setOrigin(0));
    const z=sh.zoom||[1,1],pan=sh.pan||[0,0],bgs=sh.bg||[],par=[.35,.7,1.15],dur=ms+1200;
    let bg0=null;bgs.forEach((key,j)=>{ const im=add(this.add.image(W/2,H/2,key)),p=bgs.length>1?(par[j]??1):1;if(!j)bg0=im;
      if(sh.fit==='portrait'&&W>H&&im.width<im.height){ im.setScale(Math.max(W/im.width,H/im.height)).setAlpha(.28);const c=add(this.add.image(viewW/2,H/2,key)),f=H/c.height;c.setScale(f*z[0]);tw({targets:c,scale:f*z[1],duration:dur,ease:'Sine.inOut'});bg0=c;return; }   // v8.0.84 ภาพแนวตั้งบนจอแนวนอน: วางทั้งภาพ (ไม่ตัดมงกุฎ) + ภาพเดียวกันจางด้านหลัง
      if(sh.scroll){ im.setOrigin(.5,0).setScale(Math.max(W/im.width,H/im.height)); im.y=0; tw({targets:im,y:Math.min(0,H-im.displayHeight),duration:ms,ease:'Sine.easeIn'}); return; }
      const mp=Math.max(Math.abs(pan[0]),Math.abs(pan[1]))*k*p,f=Math.max((W+mp*2+4)/im.width,(H+4)/im.height),zs=a=>f*(1+(a-1)*p);
      if(sh.tint)im.setTint(sh.tint); im.setScale(zs(z[0])); im.x=W/2+pan[0]*k*p; tw({targets:im,scale:zs(z[1]),x:W/2+pan[1]*k*p,duration:dur,ease:'Sine.inOut'}); });
    if(sh.night)add(this.add.rectangle(0,0,W,H,0x0a0822,sh.night).setOrigin(0));   // v8.0.6 โทนกลางคืนชั่วคราว (ใบ 46 จะมีฉากกลางคืนจริง)
    for(const l of sh.L||[]){ const [key,x,y,w,h,o={}]=l,fx=ASSET_FX[key],sheet=ASSET_SHEETS[key]; if(!this.textures.exists(key))continue;
      const pt=o.bgPt&&bg0?[bg0.x+(o.bgPt[0]-.5)*bg0.displayWidth,bg0.y+(o.bgPt[1]-.5)*bg0.displayHeight]:null,im=add(fx||sheet?this.add.sprite(pt?pt[0]:X(x),pt?pt[1]:Y(y),key,o.fr||0):this.add.image(pt?pt[0]:X(x),pt?pt[1]:Y(y),key)),s=pt?(o.bgW||.4)*bg0.displayWidth/im.width:Math.min(w*k/im.width,h*k/im.height),a=o.a??1;   /* bgPt = จุดบนภาพพื้นหลัง (สัดส่วน) */ im.setScale(s).setAlpha(0); if(fx&&fx.add)im.setBlendMode(Phaser.BlendModes.ADD);
      const show=()=>{ if(!im.active)return; tw({targets:im,alpha:a,duration:o.fade||(o.at?160:260)});
        if(fx){ const nf=fx.frames,loop=o.loop!==false; let f=o.fr||0; if(red){ if(!loop)im.setFrame(nf-1); if(!loop&&!o.hold)im.setAlpha(0); }
          else { const ev=this.time.addEvent({delay:1000/(o.fps||fx.rate||12),loop:true,callback:()=>{ if(!im.active){ ev.remove(false); return; } f++; if(f>=nf){ if(loop)f=0; else { ev.remove(false); if(!o.hold)tw({targets:im,alpha:0,duration:240}); return; } } im.setFrame(f); }}); mc.ev.push(ev); } }
        if(sheet&&o.frames&&!red){let f=0;mc.ev.push(this.time.addEvent({delay:1000/(o.fps||3),loop:true,callback:()=>{if(im.active)im.setFrame(o.frames[(++f)%o.frames.length]);}}));}
        if(o.to)tw({targets:im,x:X(o.to[0]),y:Y(o.to[1]),duration:o.ms||ms,ease:o.ease||'Sine.inOut'});
        if(o.bob)tw({targets:im,y:im.y-o.bob*k,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'},true);
        if(o.glow)tw({targets:im,scale:s*1.05,duration:850,yoyo:true,repeat:-1,ease:'Sine.inOut'},true);
        if(o.rot){ if(Math.abs(o.rot)<=15){ im.angle=-o.rot/2; tw({targets:im,angle:o.rot/2,duration:1600,yoyo:true,repeat:-1,ease:'Sine.inOut'},true); } else tw({targets:im,angle:o.rot,duration:dur,ease:'Linear'}); } };
      at(o.at||0,show);
      if(o.sq!=null)at(o.sq,()=>{ if(im.active)tw({targets:im,scaleX:s*1.14,scaleY:s*.82,duration:90,yoyo:true,ease:'Quad.easeOut',onComplete:()=>{ if(im.active)im.setScale(s); }},true); });
      if(o.out)at(o.out,()=>{ if(im.active)tw({targets:im,alpha:0,duration:200}); }); }
    if(sh.shake&&!red)at(sh.shake[0],()=>this.uiCam?.shake(sh.shake[1],sh.shake[2]));
    if(sh.flash)at(sh.flash[0],()=>{ const r=add(this.add.rectangle(0,0,W,H,sh.flash[1],red?.35:.85).setOrigin(0)); tw({targets:r,alpha:0,duration:520}); });
    if(!red&&!sc.plain){ this.mcMotes(mc,sh.mote||sc.mote||'dust',sh.motes??14);   // v8.0.3 ลูกเล่นการ์ตูน: ฝุ่น/ถ่านไฟ/หิมะลอย · เส้นโฟกัสตอนสั่น · แสงแฉกตอนวาบ · คำเสียง
      if(sh.shake)this.mcLines(mc,sh.shake[0],Math.max(450,sh.shake[1]+250),W/2,H*.4);
      if(sh.flash)this.mcRays(mc,sh.flash[0],W/2,H*.36,sh.flash[1]);
      if(sh.lines)this.mcLines(mc,sh.lines[0]||0,sh.lines[1]||900,W/2,H*.4); }
    if(sh.pow)this.mcPow(mc,sh.powAt??(sh.shake?sh.shake[0]:300),sh.pow,red);
    { const vg=add(this.add.graphics()); vg.fillGradientStyle(0,0,0,0,.6,.6,0,0); vg.fillRect(0,0,W,H*.2); vg.fillGradientStyle(0,0,0,0,.45,0,.45,0); vg.fillRect(0,0,W*.14,H); vg.fillGradientStyle(0,0,0,0,0,.45,0,.45); vg.fillRect(W*.86,0,W*.14,H);
      const bh=Math.round(H*.045),bar=add(this.add.rectangle(0,0,W,bh,0x000000,1).setOrigin(0)); if(i===0&&!red){ bar.y=-bh; tw({targets:bar,y:0,duration:500,ease:'Quad.easeOut'}); } }
    const by=sc.boss?H*.68:H*.7,panelX=bossWide?viewW:0,panelW=bossWide?W-viewW:W,bodyY=bossWide?116:by+44,band=add(this.add.graphics());
    if(bossWide){band.fillStyle(0x07040b,.97).fillRect(panelX,0,panelW,H);band.lineStyle(1,0xffd166,.65).lineBetween(panelX,0,panelX,H);}
    else{band.fillGradientStyle(0x07040b,0x07040b,0x07040b,0x07040b,0,0,.94,.94);band.fillRect(0,by-40,W,40);band.fillStyle(0x07040b,.96).fillRect(0,by,W,H-by);band.lineStyle(2,0xffd166,.7).lineBetween(22,by+8,W-22,by+8);}
    const fs=bossWide?14:W<380?16:17,kick=add(this.add.text(panelX+panelW/2,bossWide?74:by+24,sc.title+'  ·  '+(i+1)+' / '+n,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd166',align:'center',wordWrap:{width:panelW-32}}).setOrigin(.5));
    const cap=add(this.add.text(panelX+22,bodyY,sh.cap||'',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:fs+'px',color:'#ffffff',align:'left',lineSpacing:5,wordWrap:{width:panelW-44},stroke:'#120a18',strokeThickness:3}).setOrigin(0,0));
    if(sc.boss){let fit=fs;while(cap.height>H-bodyY-44&&fit>11)cap.setFontSize(--fit);}
    let shotVoiceMs=0;{ const speech=sh.cap||'',bossRole='boss'+((this.stageIndex||0)+1),storyKey='vo_story_'+mc.id+'_'+(i+1),specific=A07_CATALOG[storyKey],vk=sh.voiceKey||(specific&&specific.text===speech?storyKey:null)||this.voiceCaption?.('ruby',speech)||this.voiceCaption?.(bossRole,speech);if(vk&&VoiceActing.busy?.())this.voiceStop?.();   /* v8.1.66 เจ้าของ: แผ่นถัดไปต้องพูด แม้เสียงแผ่นก่อนยังไม่จบ (เดิมถูกข้าม เช่น 1-1 แผ่นสุดท้าย) */
    if(vk&&this.voicePlay?.(vk,()=>this._mc===mc&&!mc.done&&mc.i===i,mc))shotVoiceMs=A07_CATALOG[vk]?.duration||0;const full=sh.cap||'',wrapped=full?cap.getWrappedText(full).join('\n'):''; cap.setText(wrapped); cap.x=Math.round(panelX+(panelW-cap.width)/2);   // v8.0.3 พิมพ์คำบรรยายทีละตัว (ตัดบรรทัดก่อน ข้อความไม่กระโดด)
      if(!red&&wrapped){ let n=0; const step=Math.max(1,Math.round(wrapped.length/95)); cap.setText(''); const ev=this.time.addEvent({delay:24,loop:true,callback:()=>{ n=Math.min(wrapped.length,n+step); if(cap.active){cap.setText(wrapped.slice(0,n));if(n%2===0){Sfx.voiceBlip?.('ruby')||Sfx.orderCue?.('type_tick',.06,.08);}} if(n>=wrapped.length){ ev.remove(false); mc.typing=null; } }}); mc.ev.push(ev); mc.typing=()=>{ ev.remove(false); if(cap.active)cap.setText(wrapped); mc.typing=null; }; } }
    const hint=add(this.add.text(W-18,H-16,i+1<n?'Tap ▶':'Tap to continue ▶',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe08a'}).setOrigin(1,1).setAlpha(.8));
    [kick,cap].forEach(t=>t.setAlpha(0)); tw({targets:[kick,cap],alpha:1,duration:380,delay:220}); tw({targets:hint,alpha:.35,duration:700,yoyo:true,repeat:-1},true);
    const pad=this._pad||14,sw=70,shh=30,sx=W-sw-12,sy=pad+8,sg=add(this.add.graphics()); sg.fillStyle(0x000000,.45); sg.fillRoundedRect(sx,sy,sw,shh,15); sg.lineStyle(2,0xffffff,.7); sg.strokeRoundedRect(sx,sy,sw,shh,15);
    add(this.add.text(sx+sw/2,sy+shh/2,'Skip ⏭',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffffff'}).setOrigin(.5)); mc.skip={x:sx-8,y:sy-8,w:sw+16,h:shh+16};
    if(!red){ const dip=add(this.add.rectangle(0,0,W,H,0x000000,1).setOrigin(0)); tw({targets:dip,alpha:0,duration:320,ease:'Quad.easeOut'}); }
    at(Math.max(shotVoiceMs+500,mc.sc.fast?Math.max(ms+600,1700+(sh.cap||'').length*34):Math.max(ms+900,2200+(sh.cap||'').length*45)),()=>this.mcNext(mc));   // v8.0.73 เรื่องบอสเดินเร็วขึ้น
  }
  rubyStageStory(idx,done){ const entry=RUBY_STORYBOOK[idx],d=Save.data;
    if(!entry||d.settings?.noRuby||Number(d.rubyStorybook?.[idx])>=3||this.state!=='menu')return false;
    if(this._rubyTalk||(this._mc&&!this._mc.done))return true;
    const mark=()=>{(d.rubyStorybook||(d.rubyStorybook={}))[idx]=3;(d.rubyStory||(d.rubyStory={}))[idx]=1;if(idx===0)d.storyIntroSeen=true;Save.save();},fin=()=>{mark();this.rubyEntryCurtain?.(idx);if(done)done();};
    const talk=()=>{ this.rubyTalk(entry.pages.map(p=>p.text),fin,{title:entry.title,pages:entry.pages,storybook:true}); };
    const mcs=typeof MC_STAGE_STORY!=='undefined'?MC_STAGE_STORY[idx]:null;   // v8.0.2 ฉาก Motion Comic แทนหน้าหนังสือ (ภาพไม่มา = หน้าหนังสือเดิม)
    if(mcs&&this.mcSeen){ if(mcs.every(id=>this.mcSeen(id))){ mark(); return false; } if(this.mcGateList(mcs,ok=>ok?fin():talk()))return true; }
    talk();return true;
  }
  rubyStoryAt(i){ if(this.recipeMode||this.bossRush||this.riftMode||this._pinnacleRun||this._inTutorial||!RUBY_STORY[i]||!this.time)return; const d=Save.data,st=d.rubyStory||(d.rubyStory={}); if(st[i])return;
    this.time.delayedCall(300,()=>{ if(!this.rubyOn()||this.stageIndex!==i)return; st[i]=1; Save.save(); this.rubySay(RUBY_STORY[i],5600,{face:[1,3,6,10,11,14].includes(i)?'sad':'normal'}); }); }   // v7.9.81 เรื่องของ Ruby ทีละด่าน (ครั้งแรกเท่านั้น)
  rubyOn(){ return this.state==='play'&&!this._coach&&!this.tutorialMode&&!(Save.data.settings||{}).noRuby; }
  /* v8.1.43 A09 Ruby ปฏิกิริยาในด่าน · หมุน 2 บท ไม่ซ้ำติดกัน · เว้น ≥8 วิ · clear พูดอย่างเดียว (หน้าสรุปไม่มีกล่อง Ruby) */
  rubyVoiceReact(ev,delay=0){const k1='vo_ruby_react_'+ev+'_1';if(typeof A07_CATALOG==='undefined'||!A07_CATALOG[k1]||!this.rubyOn?.())return false;const nw=Date.now(),big=ev==='clear'||ev==='bossdown';if(!big&&nw-(this._rubyReactAt||0)<30000)return false;if(ev==='objdone'||ev==='wave'||ev==='timer'){const O=this._rubyOnce||(this._rubyOnce={});if(O[ev])return false;O[ev]=1;}this._rubyReactAt=nw;   /* v8.1.88 เจ้าของ: Ruby พูดถี่เกิน → เว้น 30s · Objective/Wave/Timer พูดด่านละครั้ง */
    const h=this._rubyReactPick||(this._rubyReactPick={}),i=h[ev]===1?2:1;h[ev]=i;const row=A07_CATALOG['vo_ruby_react_'+ev+'_'+i]||A07_CATALOG[k1],face={lowhp:'alert',wave:'alert',timer:'cheer',bossdown:'cheer',objdone:'cheer',revive:'happy',clear:'cheer'}[ev]||'normal';
    const go=()=>{if(ev==='clear'){this.voiceLine?.('ruby',row.text,()=>true,this);return;}if(this.state!=='play'||this._speech)return;this.rubySay(row.text,Math.max(2200,row.duration+400),{face});};if(delay&&this.time){const ep=this._rubyEpoch|0;this.time.delayedCall(delay,()=>{if((this._rubyEpoch|0)===ep)go();});}else go();return true;}
  rubySay(text,ms=4000,opt={}){ if(!this.add||!this.time||!this.rubyOn())return; const q=this._rubyQ||(this._rubyQ=[]); if(opt.replace){ q.length=0; this.rubyHide(true); } if(q.some(m=>m.text===text)||(this._ruby&&this._ruby.text===text))return; q.push({text,ms,face:opt.face||'normal'}); if(!this._ruby)this.rubyNext(); }
  rubyNext(){ const m=(this._rubyQ||[]).shift(); if(!m)return;m.ms=Math.max(m.ms||4000,(this.voiceDuration?.('ruby',m.text)||0)+400); if(!this.rubyOn()){ this._rubyQ=[]; return; }
    const W=this.W,pad=this._pad||14,av0=58,bw=Math.min(Math.round(W*.62),260),ax=W-pad-av0/2,bx=ax-av0/2-6-bw,by=pad+138,fs=W<380?12:13,lines=rubyWrap(m.text,Math.floor((bw-26)/(fs*.6))),lh=fs+6,bh=Math.max(54,18+lines.length*lh),   /* v8.1.100 เจ้าของ: คำพูด Ruby บังจอ → ป้ายเล็กมุมขวาบน เลื่อนเข้าจากขวา */c=this.add.container(0,0).setScrollFactor(1).setDepth(64);
    const g=this.add.graphics(); g.fillStyle(0x000000,.35); g.fillRoundedRect(bx+3,by+4,bw,bh,16); g.fillStyle(0x0b0710,.94); g.fillRoundedRect(bx,by,bw,bh,16); g.lineStyle(3,0xffffff,1); g.strokeRoundedRect(bx,by,bw,bh,16); c.add(g);
    g.fillStyle(0x0b0710,.94); g.fillTriangle(bx+bw-2,by+bh-30,bx+bw-2,by+bh-12,bx+bw+9,by+bh-16); g.lineStyle(3,0xffffff,1); g.lineBetween(bx+bw,by+bh-30,bx+bw+9,by+bh-16); g.lineBetween(bx+bw+9,by+bh-16,bx+bw,by+bh-12);
    const tx0=bx+13,cols=['#ffd54a','#7dff6a','#ff8fb8']; let ci=0; lines.forEach((ln,li)=>{ const parts=ln.split(/(\[[^\]]+\])/).filter(Boolean),row=[]; let x=0;
      for(const pt of parts){ const hl=pt[0]==='['; const t=this.add.text(0,by+11+li*lh,hl?pt.slice(1,-1):pt,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:(hl?fs+1:fs)+'px',color:hl?cols[ci++%cols.length]:'#ffffff',stroke:'#000000',strokeThickness:hl?3:0}); row.push(t); x+=t.width; }
      const k=Math.min(1,(bw-26)/Math.max(1,x)); let cx=tx0; row.forEach(t=>{ t.setScale(k).setPosition(cx,t.y+(1-k)*fs*.5); cx+=t.width*k; c.add(t); }); });
    const av=this.rubyAvatar(ax-40,by+bh+4,av0,m.face); c.add(av); this.rubySparkle(c,ax-14,by+bh-30);
    const nm=this.add.text(bx+34,by+2,'Ruby',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffffff'}).setOrigin(.5,1); const nb=this.add.graphics(); nb.fillStyle(0x6a2fd6,1); nb.fillRoundedRect(bx+34-nm.width/2-9,by+2-nm.height-2,nm.width+18,nm.height+4,8); nb.lineStyle(2,0xffffff,.9); nb.strokeRoundedRect(bx+34-nm.width/2-9,by+2-nm.height-2,nm.width+18,nm.height+4,8); c.add([nb,nm]);
    this.camUI(c); c.setAlpha(0); c.x=bw*.7; this.tweens.add({targets:c,alpha:1,x:0,duration:260,ease:'Back.easeOut'}); this.rubyReact?.(c,av,m,ax-52,by,bh);
    Sfx.orderCue?.('ruby_pop_in',.25,.5)||Sfx.select&&Sfx.select(); if(this._speech){ try{ this._speech.ev.remove(); this._speech.box.destroy(); }catch(e){} this._speech=null; } this._ruby={c,text:m.text,bottom:by+bh};{const vk=this.voiceLookup?.('ruby',m.text),sa=this._rubyShortAt||(this._rubyShortAt={}),nw=Date.now();if(!(vk&&vk.includes('_short_')&&nw-(sa[vk]||0)<30000)){if(vk&&vk.includes('_short_'))sa[vk]=nw;this.voiceLine?.('ruby',m.text,()=>this._ruby?.c===c&&this.rubyOn(),c);}}   /* v8.1.43 เตือนสั้นพูดซ้ำได้ทุก 30 วิต่อภารกิจ */
    this._ruby.ev=this.time.addEvent({delay:150,loop:true,callback:()=>{ if(!this.rubyOn())this.rubyHide(true); }});
    this._ruby.end=this.time.delayedCall(m.ms,()=>this.rubyHide()); }
  /* v8.0.18 เจ้าของ: Ruby แข็งเหมือนหุ่นยนต์ → ท่าตามอารมณ์ · alert = สะดุ้งกระโดด สั่น + ‘!’ เด้งบนหัว + กล่องสั่น · happy/cheer = กระโดดดีใจ · sad = ห่อตัว · อื่น ๆ = หายใจยืดหด */
  rubyReact(c,av,m,bx,by,bh){ if(!this.tweens||!av)return; const sx=av.scaleX,sy=av.scaleY,y0=av.y,x0=av.x,f=m.face,rep=Math.max(1,Math.round(m.ms/900)-1);
    if(!this.voiceLookup?.('ruby',m.text))Sfx.voice?.('ruby_'+(['happy','alert','sad','cheer'].includes(f)?f:'happy'),.2);if(f==='alert')Sfx.orderCue?.('ruby_alert',.25,.6);const breathe=(d=0)=>this.tweens.add({targets:av,scaleY:{from:sy,to:sy*1.05},scaleX:{from:sx,to:sx*.97},y:y0,duration:450,delay:d,yoyo:true,repeat:rep,ease:'Sine.inOut'});
    if(f==='alert'){ av.setScale(sx*1.12,sy*.78); this.tweens.add({targets:av,scaleX:sx*.9,scaleY:sy*1.22,y:y0-18,duration:150,ease:'Quad.out',onComplete:()=>{ if(!av.active)return; this.tweens.add({targets:av,scaleX:sx,scaleY:sy,y:y0,duration:260,ease:'Bounce.out',onComplete:()=>{ if(!av.active)return; this.tweens.add({targets:av,x:{from:x0-3,to:x0+3},duration:45,yoyo:true,repeat:5,onComplete:()=>{ if(av.active){av.x=x0;breathe();} }}); }}); }});
      const ex=this.add.text(bx+62,by+bh-74,'!',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'34px',color:'#ffd54a',stroke:'#7a1020',strokeThickness:6}).setOrigin(.5,1).setScale(0).setAngle(-12); c.add(ex);
      this.tweens.add({targets:ex,scale:1,angle:8,duration:220,ease:'Back.out',onComplete:()=>{ if(ex.active)this.tweens.add({targets:ex,y:ex.y-4,angle:-8,duration:160,yoyo:true,repeat:4,onComplete:()=>{ if(ex.active)this.tweens.add({targets:ex,alpha:0,duration:300}); }}); }});
      this.tweens.add({targets:c,y:{from:-4,to:4},duration:40,yoyo:true,repeat:4,delay:140,onComplete:()=>{ if(c.active)c.y=0; }}); return; }
    if(f==='happy'||f==='cheer'){ this.tweens.add({targets:av,y:y0-14,scaleY:sy*1.1,scaleX:sx*.94,duration:170,yoyo:true,repeat:1,ease:'Quad.out',onComplete:()=>{ if(av.active){av.y=y0;av.setScale(sx,sy);breathe();} }}); return; }
    if(f==='sad'){ this.tweens.add({targets:av,scaleY:sy*.92,scaleX:sx*1.04,y:y0,duration:900,yoyo:true,repeat:rep,ease:'Sine.inOut'}); return; }
    breathe(); }
  rubyHide(now){ const r=this._ruby; if(!r)return; this.voiceStop?.(r.c);this._ruby=null; r.ev&&r.ev.remove(false); r.end&&r.end.remove(false);
    const fin=()=>{ if(r.c&&r.c.active)r.c.destroy(); if(!now)this.time?.delayedCall(250,()=>this.rubyNext()); else this._rubyQ=[]; };
    if(now||!this.tweens)fin(); else this.tweens.add({targets:r.c,alpha:0,x:30,duration:220,onComplete:fin}); }
  rubyAvatar(x,y,sz=84,face='normal'){ const wanted=face==='normal'?'mascot_ruby':'mascot_ruby_'+face,k=this.textures.exists(wanted)?wanted:'mascot_ruby'; if(this.textures.exists(k)){ const im=this.add.image(x+40,y,k).setOrigin(.5,1); im.setScale(sz/Math.max(im.width,im.height)); return im; }
    /* ภาพชั่วคราว: โมจิสีชมพูทับทิม + อัญมณีบนหัว (ใบสั่งอาร์ต 36 จะมาแทน) */
    const g=this.add.graphics(); g.fillStyle(0x000000,.25); g.fillEllipse(40,2,58,12); g.fillStyle(0xff6f9a,1); g.fillEllipse(40,-30,72,60); g.fillStyle(0xffb3c9,1); g.fillEllipse(30,-44,26,14);
    g.lineStyle(3,0x7a1838,1); g.strokeEllipse(40,-30,72,60); g.fillStyle(0x2a0f1c,1); g.fillCircle(28,-30,5); g.fillCircle(52,-30,5); g.fillStyle(0xffffff,1); g.fillCircle(30,-32,2); g.fillCircle(54,-32,2);
    g.fillStyle(0xff3d6e,.6); g.fillEllipse(19,-20,11,6); g.fillEllipse(61,-20,11,6); g.lineStyle(2.5,0x2a0f1c,1); g.beginPath(); g.arc(40,-22,6,0.2,Math.PI-0.2); g.strokePath();
    g.fillStyle(0xe0103f,1); g.fillTriangle(40,-74,30,-62,50,-62); g.fillTriangle(30,-62,50,-62,40,-52); g.fillStyle(0xff7f9f,1); g.fillTriangle(40,-72,34,-63,40,-63); g.lineStyle(2,0x7a0a24,1); g.strokeTriangle(40,-74,30,-62,50,-62); g.strokeTriangle(30,-62,50,-62,40,-52);
    g.setScale(sz/84); g.setPosition(x+40*(1-sz/84),y); return g; }
  /* เล่าภารกิจ: เห็นภารกิจนี้ <3 ครั้ง = อธิบายเต็ม · หลังจากนั้นสรุปบรรทัดเดียว */
  rubyTip(key,delay=650){ const t=RUBY_TIPS[key]; if(!t||!this.time)return; const d=Save.data,seen=d.rubySeen||(d.rubySeen={}),n=seen[key]||0; seen[key]=n+1;
    const text=(n<3||!t.short)?t.say:t.short,face=['mini','boss'].includes(key)?'alert':['magnet','heal','chest'].includes(key)?'think':n>=3?'cheer':'normal'; this.rubyLater(delay,()=>this.rubySay(text,n<3?4300:2700,{face})); }
  rubyOnce(key,delay=0){ const d=Save.data,seen=d.rubySeen||(d.rubySeen={}); if(seen[key]||!RUBY_TIPS[key])return; seen[key]=1; Save.save?.(); this.rubyLater(delay,()=>this.rubySay(RUBY_TIPS[key].say,4200,{face:['mini','boss'].includes(key)?'alert':'think'})); }
  rubyLater(delay,fn){ const ep=this._rubyEpoch|0; this.time?.delayedCall?.(delay,()=>{ if((this._rubyEpoch|0)===ep)fn(); }); }   /* v8.1.89 เจ้าของ: ข้อความ Ruby ค้างข้ามด่าน → ทิ้งของด่านก่อน */
  rubySparkle(c,x,y){ if(!this.tuHas('vfx_ruby_sparkle'))return; const fx=this.tuImg('vfx_ruby_sparkle',0,x,y,84,84); c.add(fx); fx.setBlendMode(Phaser.BlendModes.ADD); const v={frame:0}; const tw=this.tweens.add({targets:v,frame:5,duration:420,onUpdate:()=>{ if(fx.active)fx.setFrame('cell'+Math.floor(v.frame)); },onComplete:()=>fx.destroy()}); c.once('destroy',()=>{tw.remove(); if(fx.active)fx.destroy();}); }
  showSpeechBubble(text,ms=3000){ if(this._ruby)return;   // v7.9.60 Ruby กำลังพูด = ไม่ซ้อนข้อความเดียวกัน
    if(this._speech){this._speech.ev.remove();this._speech.box.destroy();}
    const p=this.player;if(!p)return;
    const t=this.add.text(0,0,text,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#3a2140',align:'center',wordWrap:{width:200},backgroundColor:'#fffaf5',padding:{x:10,y:7}}).setOrigin(0.5);
    const bh=t.height,g=this.add.graphics();g.fillStyle(0xfffaf5,1);g.fillTriangle(-7,bh/2-1,7,bh/2-1,0,bh/2+9);
    const box=this.add.container(p.x,p.y-92-bh/2,[g,t]).setDepth(95000).setAlpha(0).setScale(0.6);this.camWorld(box);
    this.tweens.add({targets:box,alpha:1,scale:1,duration:180,ease:'Back.out'});
    const t0=this.time.now,ev=this.time.addEvent({delay:30,loop:true,callback:()=>{
      if(!box.active||!this.player){ev.remove();return;}
      box.setPosition(this.player.x,this.player.y-92-bh/2);
      if(this.time.now-t0>ms&&!box._out){box._out=true;this.tweens.add({targets:box,alpha:0,duration:260,onComplete:()=>{ev.remove();box.destroy();if(this._speech&&this._speech.box===box)this._speech=null;}});}
    }});
    this._speech={box,ev};
  }
  playStoryPanel(key,kicker,title,body,done){
    const layer=this.storyLayer;if(!layer||!this.textures.exists(key)){done();return;}layer.removeAll(true);layer.setVisible(true);this.physics.pause();this.state='cinematic';
    const w=this.W,h=this.H,art=this._coverImage(0,0,w,h,key),dim=this.add.rectangle(0,0,w,h,0x08050d,0.28).setOrigin(0),band=this.add.graphics();
    band.fillGradientStyle(0x08050d,0x08050d,0x08050d,0x08050d,0.02,0.02,0.96,0.96);band.fillRect(0,h*0.55,w,h*0.45);band.lineStyle(2,0xffd166,0.78);band.lineBetween(18,h*0.64,w-18,h*0.64);
    const k=this.add.text(w/2,h*0.60,kicker,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd166',letterSpacing:3}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.70,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(28,w*0.07)+'px',color:'#ffffff',stroke:'#240916',strokeThickness:5,align:'center',wordWrap:{width:w-38}}).setOrigin(0.5);
    const b=this.add.text(w/2,h*0.79,body,{fontFamily:'sans-serif',fontSize:'12px',color:'#f2dfe8',align:'center',lineSpacing:4,wordWrap:{width:w-46},maxLines:3}).setOrigin(0.5,0);
    const skip=this.add.text(w-18,h-18,'Tap to continue  ▶',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffe08a'}).setOrigin(1,1);layer.add([art,dim,band,k,t,b,skip]);
    let finished=false;const finish=()=>{if(finished)return;finished=true;this._finishStoryCutscene=null;layer.setVisible(false);layer.removeAll(true);this.state='play';this.physics.resume();done();};this._finishStoryCutscene=finish;this.time.delayedCall(6500,finish);
  }
  startWave(w,seamless){
    if(this._replayMeter){this.waveIndex=w;this.beginReplaySwarm();return;}
    if(this.stageIndex===2&&w===0&&!seamless&&!Save.data.mintIntro&&!this.recipeMode&&!this.riftMode&&!this.bossRush&&!this._inTutorial&&this.textures.exists('card_mint')){   // v6.55.3 แนะนำ Mint ที่ Stage 3
      Save.data.mintIntro=1;Save.save();const me=this.character==='mint';
      this.playStoryPanel('card_mint','NEW ALLY · MINT 🌿','Mint, the Frostleaf Guard',me?'Your Frost Lances stack Chill — 4 stacks freeze enemies solid. Mint Gale lets you dash through the swarm!':'A cool, agile fighter: Frost Lances stack Chill and 4 stacks freeze enemies. Try her in Heroes — she is already unlocked!',()=>this.startWave(w,seamless));return;}
    if(this._v83Run){this.waveIndex=w;this.boss=null;this.bossUI.forEach(o=>o.setVisible(false));this.beginWave(w,seamless,null);return;}
    const beat=(STAGE_STORY_BEATS[this.stageIndex]||[])[w];this.waveIndex=w;this.boss=null;this.bossUI.forEach(o=>o.setVisible(false));
    this.playWaveCutscene(w,beat,()=>this.beginWave(w,seamless,beat));
  }
  beginWave(w,seamless,beat){
    const st=STAGES[this.stageIndex],p=this.waveProfile(w); this._waveTimed=false; this._goldWave=false; this._crownCurse=null;
    if(this._v83Run&&w!==st.miniAt){
      const d=this._c1Combat;
      if(d){d.delay=3;d.phase=null;d.patterns=[];}
      this.mode='wave';this.clearWaveObjective();this.startSurvivalWave(w,!!seamless);
      this.waveDur=this.waveTimer=(C1_WAVE_SEC[w]||45);
      this.startChapterSituationWave?.(w);   /* v8.3.12 ภารกิจหลัก = สถานการณ์การต่อสู้ทุกเวฟ */
      this.updateWaveText();return;
    }
    if(w===st.miniAt){this.mode='miniWarning';this.setupSpawnRates(w);this.updateWaveText();
      this.showBanner('⚠️ '+(beat?beat.title:st.mini),beat?beat.sub:(st.mini+' — get ready to find space to dodge'),2600);Sfx.bossWarn();this.screenFlash(0xff4d8f,0.18,500);
      this.scheduleStageEvent(2800,'miniWarning',()=>this.spawnMiniBoss());
    }else{this.mode='wave';this._goldWave=this.goldWaveRoll?.(w)||false;this.rpWaveCurse?.();this.startSurvivalWave(w,false);this.setupWaveObjective(w,p);const o=this.waveObjective; if(o&&this._goldWave)o._gold=true; this.waveTimedSetup?.(o); this.missionIntroExtra?.(o);
      if(!this.recipeMode&&!this.riftMode&&!this.bossRush&&(this.stageIndex>0||(Save.data.stageMastery||{})[0])&&(w===3||w===4&&Math.random()<0.5))
        this.time.delayedCall(9500,()=>{if(this.state==='play'&&this.mode==='wave'&&this.waveObjective===o&&!o.done)this.startWaveEvent();});
      const _card=o&&!this._inTutorial&&this.missionIntro?.(o,!!o._armPad);   /* v8.1.116 การ์ดเปิดภารกิจแทนป้ายกลางจอ + ฟองคำพูดซ้ำ */
      if(!this._inTutorial&&!_card)this.showBanner(o?(o.emoji+' '+o.name):(beat?beat.title:('Part '+(w+1))),o?((o.lesson?'MISSION '+o.lesson+': ':'MISSION: ')+o.desc):(beat?beat.sub:p.desc),3800);if(o&&!this._inTutorial&&!_card&&this.waveObjTxt)this.tweens.add({targets:this.waveObjTxt,scale:{from:1.5,to:1},duration:500,ease:'Back.out',delay:3800});if(o&&!this._inTutorial){if(!_card)this.showSpeechBubble(o.emoji+' '+o.desc,4200);Sfx.card&&Sfx.card();}}
    this.updateWaveText();
  }
  /* v8.2.20 เจ้าของ 19 พ.ย. (ขั้น A): เวฟจบด้วยเวลา · ภารกิจเป็นเหตุการณ์ในเวฟ · ทำเสร็จก่อน = รางวัลเต็ม แล้วเวฟปิดใน WAVE_WRAP วิ
     หมดเวลาแต่ทำได้ ≥50% = ได้ครึ่ง · ต่ำกว่านั้นไม่ได้ · เฉพาะ Story (ไม่ใช่ เล่นซ้ำ/Delve/บทสอน) · มินิบอส/บอสยังจบเมื่อล้มบอส */
  /* v8.2.21 เจ้าของ 19 พ.ย. (ขั้น B): ภารกิจซ้อนได้สูงสุด 2 อัน (หลัก + เสริม 1) · ตั้งแต่ Chapter 2 (STACK_FROM) ในเวฟจับเวลาของ Story
     ภารกิจเสริมเลือกจาก STACK_POOL (เก็บ state ใน _sig ทั้งหมด) · ห้ามกลุ่มเดียวกับภารกิจหลัก (STACK_CAT) · ภารกิจหลักกลุ่ม global (หยุดเวลา/ทั้งถ้ำ/หลายรอบ) ไม่ซ้อน
     ทำงานด้วยการสลับบริบท: waveObjective/_sig/objNodeG ของภารกิจเสริมถูกสลับเข้าเฉพาะตอน tick/kill แล้วสลับกลับ (stackRun) */
  stackRun(fn){ const K=this._stack; if(!K)return; const o0=this.waveObjective,s0=this._sig,g0=this.objNodeG; this._stackSwap=true; this.waveObjective=K.o; this._sig=K.S; this.objNodeG=K.g;
    try{ return fn(); }finally{ K.S=this._sig||K.S; this.waveObjective=o0; this._sig=s0; this.objNodeG=g0; this._stackSwap=false; } }
  /* v8.2.28 เจ้าของ (SCAMPER รอบ 2): เวฟทอง 5% · มอนสีทอง · รางวัลภารกิจ ×2 · เฉพาะ Story หลังผ่าน C1-1 (ไม่ใช่บทสอน/เล่นซ้ำ/Delve) */
  /* v8.2.30 Mission Atlas ในด่าน */
  maActive(){ return typeof maUnlocked==='function'&&maUnlocked()&&!this._inTutorial; }
  maSetup(o){ if(!o||!this.maActive())return; const f=maFx(o.type); o._maFx=f; if(f.hard>1){ if(!o._timedGoal&&(o.target||0)>=3)o.target=Math.ceil(o.target*f.hard); else o._maTime=1/f.hard; } if(f.time!==1)o._maTime=(o._maTime||1)*f.time; }
  maPay(o){ if(!o||o._maPaid||!this.maActive())return 1; o._maPaid=true; const f=o._maFx||maFx(o.type),jack=f.jackpot>0&&Math.random()<f.jackpot; o._maRw=f.rw*(jack?3:1); o._maCur=f.cur|0;
    if(jack)this.time?.delayedCall?.(700,()=>{ if(this.state!=='menu'){ this.showBanner?.('🎰 ATLAS JACKPOT!','Mission rewards ×3',1800); this.screenFlash?.(0xffd166,.25,260); this.a12?.('a18_jackpot',.5,.5); this.rubyVoiceReact?.('jackpot',200); } });
    if(f.box>0&&Math.random()<f.box&&this.player){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(this.player.x-50,this.player.y-40,(this.stageIndex>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1600); }finally{ this._lootMinRare=false; } }
    if(f.star>0&&typeof Save!=='undefined')try{ Save.addCurrency('starsugar',f.star); }catch(e){} return o._maRw; }
  maEarn(n){ if(!this.maActive()||!(n>0)||this.recipeMode&&!this._recipeMission)return; const m=maData(); m.pts+=n; this.a12?.('a18_atlas_star',.25,.3); if(this.player)this.floatText?.(this.player.x,this.player.y-110,'⭐ +'+n+' Atlas',0xffe08a); }
  goldWaveRoll(w){ if(this.recipeMode||this.riftMode||this.bossRush||this._replayMeter||this._inTutorial||!this.usesStoryBudget?.())return false; const d=(typeof Save!=='undefined'&&Save.data)||{}; if((this.stageIndex||0)===0&&!(d.stageMastery||{})[0])return false;
    const r=Math.random()<Math.max(typeof GOLD_WAVE_CHANCE!=='undefined'?GOLD_WAVE_CHANCE:.05,this.rpAdd?.('gold')||0); if(r)this.time?.delayedCall?.(900,()=>{ if(this.state!=='play'||!this._goldWave)return; this.showBanner?.('✨ GOLDEN WAVE!','Golden monsters · mission rewards ×2',2200); this.screenFlash?.(0xffd76a,.22,320); (this.a12?.('a18_golden_wave',.5,.3))||Sfx.orderCue?.('mission_bonus_get',.5,.3); if(this.player)this.artFx?.('ev90_gold_burst',this.player.x,this.player.y,300); this.rubyVoiceReact?.('golden',500); }); return r; }
  /* v8.2.28 เจ้าของ: ภารกิจที่เจอครั้งแรก = เวลา +20% · ชี้เป้า (questFocus) แน่นอน · ป้าย NEW บอกขั้นตอน */
  missionIntroExtra(o){ if(!o||!o._first||o.done)return; const def=WAVE_OBJECTIVES[o.type]||{}; this.time?.delayedCall?.(1600,()=>{ if(this.waveObjective!==o||o.done||this.state!=='play')return; this.rubyVoiceReact?.('newmission',200); this.showBanner?.('🆕 New mission: '+(def.emoji||'')+' '+(def.name||''),(o.desc||def.desc||'')+(this._waveTimed?' · +20% time':''),3200); this.questFocus?.(o.type,true); }); }
  /* v8.2.28 เจ้าของ: บอส Chapter 2–3 เรียกใช้ระบบภารกิจ · เลือดเหลือ 60% → ภารกิจเสริมที่เข้ากับบอส (BOSS_MISSION) 45 วิ · สำเร็จ = รางวัลภารกิจเสริม */
  /* v8.2.83 เจ้าของ: ภารกิจตอนสู้บอสไม่ควรเป็นภารกิจทั้งอัน → "ลูกเล่นบอส" ชิ้นส่วนจากภารกิจ ทำให้สู้ยากขึ้น · ไม่มีแถบ/เป้า · บอสเลือด 60% และ 30% = ลูกเล่นละ 15 วิ · รอดครบ = 🍬 · กล่อง Gear ย้ายไปเป็นรางวัลชนะบอส (Ch2–3) */
  bossMissionTick(dt){ if(this._stack){ this.stackTick(dt); return; } const b=this.boss; if(this._twist){ this.bossTwistRun(this._twist,dt); return; }
    if(!BOSS_TWIST_ON||!b||!b.active||this.recipeMode||this.riftMode||this.bossRush||this._replayMeter||this._inTutorial||this.state!=='play')return;
    const list=BOSS_TWIST[this.stageIndex||0]; if(!list)return; const mx=b.maxhp||b.maxHp||0,n=this._twistN||0; if(!mx||n>=BOSS_TWIST_AT.length||(b.hp||0)/mx>BOSS_TWIST_AT[n])return; this._twistN=n+1; this.bossTwistStart(list[n%list.length]); }
  bossTwistStart(kind){ const D=BOSS_TWIST_DEF[kind]; if(!D)return null; const T=this._twist={kind,t:BOSS_TWIST_DUR,acc:0,objs:[],seeds:[],buffed:[],g:this.camWorld?.(this.add.graphics().setDepth(90015))};
    if(T.g)T.objs.push(T.g); T.auras=[]; T.icon=['roots','seeds','fruit','dark','shadows'].indexOf(kind);
    if(this.realTex?.('tw95_chip')&&this.camUI&&this.add?.text){ const y=(this.waveObjTxt?.y||40)+(this.waveObjTxt?.height||18)+14,ch=this.add.image(this.W/2,y+9,'tw95_chip').setDisplaySize(230,24).setScrollFactor(1).setDepth(53),tx=this.add.text(this.W/2+10,y+9,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe0e0',stroke:'#1a0f1e',strokeThickness:3}).setOrigin(.5).setScrollFactor(1).setDepth(54); this.camUI(ch); this.camUI(tx); T.objs.push(ch,tx); T.txt=tx; T.chip=ch;
      if(this.realTex?.('tw95_icons')){ const ic=this.add.image(this.W/2-100,y+9,'tw95_icons',Math.max(0,T.icon)).setDisplaySize(22,22).setScrollFactor(1).setDepth(54); this.camUI(ic); T.objs.push(ic); T.ic=ic; } }   /* v8.2.86 ใบ 95 แถบลูกเล่นบอส */
    this.showBanner?.('⚠️ '+D.emoji+' '+D.name,D.desc,1800); this.screenShake?.(200,.008); (this.a12?.('a22_twist_'+kind,.5,.5))||(this.a12?.('a18_boss_mission',.5,.5))||Sfx.card?.(); this.a22Voice?.('vo_ruby_twist_'+kind,()=>this._twist===T,T,'twist_'+kind);
    if(kind==='dark'&&this.realTex?.('tw95_dark_vignette')&&this.camUI){ const v=this.add.image(this.W/2,this.H/2,'tw95_dark_vignette').setDisplaySize(this.W,this.H).setScrollFactor(1).setDepth(52).setAlpha(0); this.camUI(v); this.tweens?.add?.({targets:v,alpha:1,duration:600}); T.objs.push(v); }   /* v8.2.86 ใบ 95 */
    else if(kind==='dark'&&this.add?.rectangle&&this.camUI){ const r=this.add.rectangle(0,0,(this.W||390)*2,(this.H||844)*2,0x0a0610,0).setOrigin(0).setScrollFactor(1).setDepth(52); this.camUI(r); this.tweens?.add?.({targets:r,fillAlpha:.42,duration:600}); T.objs.push(r); }
    if(kind==='shadows')this.bossTwistShadows(T); return T; }
  bossTwistRun(T,dt){ const b=this.boss; if(this.mode!=='boss'||!b||!b.active){ this.bossTwistEnd(false); return; } if(this.state!=='play')return; T.t-=dt; T.acc+=dt; const P=this.player,si=this.stageIndex||0; T.g?.clear?.();
    if(T.txt){ const D=BOSS_TWIST_DEF[T.kind]||{}; T.txt.setText((D.name||'')+' · '+Math.ceil(Math.max(0,T.t))+'s'); }
    for(const A of T.auras){ if(A.s?.active&&A.e?.active)A.s.setPosition(A.e.x,A.e.y+(A.dy||0)).setDepth(A.e.y-1); else if(A.s?.active)A.s.setVisible(false); }
    if(T.kind==='roots'){ if(!T.tips){ T.tips=[0,1,2].map(i=>({a:Math.atan2(P.y-b.y,P.x-b.x)+(i-1)*.7,d:40})); if(this.realTex?.('tw95_root_tile')&&this.add?.tileSprite)for(const q of T.tips){ q.tile=this.camWorld(this.add.tileSprite(b.x,b.y,64,64,'tw95_root_tile',0).setOrigin(0,.5).setScale(.36)); q.tip=this.a94Loop?.('tw95_root_tip',b.x,b.y,56); T.objs.push(q.tile); if(q.tip)T.objs.push(q.tip); } }   /* v8.2.86 ใบ 95 รากจริง */
      const tf=Math.floor((this.time?.now||0)/100)%8; for(const q of T.tips){ q.d=Math.min(520,q.d+dt*120); const x=b.x+Math.cos(q.a)*q.d,y=b.y+Math.sin(q.a)*q.d; q.x=x; q.y=y;
        if(q.tile?.active){ q.tile.setPosition(b.x,b.y).setRotation(q.a).setDepth(Math.min(b.y,y)-1); q.tile.width=q.d/.36; q.tile.setFrame?.(tf); q.tip?.setPosition?.(x,y)?.setDepth?.(y+2); }
        else { T.g?.lineStyle?.(10,0x5a3a22,.9); T.g?.lineBetween?.(b.x,b.y,x,y); T.g?.fillStyle?.(0xd56bff,.7); T.g?.fillCircle?.(x,y,9); } }
      if(T.acc>=BOSS_TWIST_RATE.roots){ T.acc=0; for(const q of T.tips){ const e=this.spawnEnemy?.(Math.random()<.5?'fast':'normal',Math.atan2(q.y-P.y,q.x-P.x),Math.max(60,this.dist(P.x,P.y,q.x,q.y))); if(e){ e.setPosition?.(q.x,q.y); e.body?.reset?.(q.x,q.y); this.emergeFoe?.(e,'ground'); } } } }
    else if(T.kind==='seeds'){ if(T.acc>=BOSS_TWIST_RATE.seeds){ T.acc=0; for(let k=0;k<2;k++){ const a=Math.random()*Math.PI*2,d=90+Math.random()*130; const sx=P.x+Math.cos(a)*d,sy=P.y+Math.sin(a)*d,q={x:sx,y:sy,t:BOSS_SEED_HATCH}; if(this.realTex?.('tw95_seed_idle')){ this.a94Once?.('tw95_seed_drop',sx,sy+6,70); q.spr=this.a94Loop?.('tw95_seed_idle',sx,sy+6,44); q.spr?.setVisible?.(false); q.show=.55; } T.seeds.push(q); } }   /* v8.2.86 ใบ 95 เมล็ดจริง */
      for(let i=T.seeds.length-1;i>=0;i--){ const q=T.seeds[i]; q.t-=dt; if(q.spr&&q.show>0){ q.show-=dt; if(q.show<=0)q.spr.setVisible?.(true); } if(this.dist(P.x,P.y,q.x,q.y)<42){ T.seeds.splice(i,1); T.popped=(T.popped||0)+1; q.spr?.destroy?.(); this.a12?.('a22_seed_pop',.24,.1); if(!this.a94Once?.('tw95_seed_pop',q.x,q.y,80))this.burst?.(q.x,q.y,0x9be86b); this.floatText?.(q.x,q.y-30,'🌱 Popped!',0x9be86b); continue; }
        if(q.t<=0){ T.seeds.splice(i,1); q.spr?.destroy?.(); this.a12?.('a22_seed_hatch',.3,.15); this.a94Once?.('tw95_seed_hatch',q.x,q.y,90); const e=this.spawnEnemy?.('fast',Math.atan2(q.y-P.y,q.x-P.x),Math.max(60,this.dist(P.x,P.y,q.x,q.y))); if(e){ e.setPosition?.(q.x,q.y); e.body?.reset?.(q.x,q.y); this.emergeFoe?.(e,'ground'); } continue; }
        if(!q.spr){ T.g?.fillStyle?.(0x4a8a2a,.9); T.g?.fillCircle?.(q.x,q.y,11); } T.g?.lineStyle?.(3,0x9be86b,.9); T.g?.beginPath?.(); T.g?.arc?.(q.x,q.y,20,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,q.t/BOSS_SEED_HATCH),false); T.g?.strokePath?.(); } }
    else if(T.kind==='fruit'){ if(T.acc>=BOSS_TWIST_RATE.fruit){ T.acc=0; for(let k=0;k<3;k++){ const a=Math.random()*Math.PI*2,d=k?60+Math.random()*160:0; const fx=P.x+Math.cos(a)*d,fy=P.y+Math.sin(a)*d; this.spawnHazard?.(fx,fy,58,Math.round(10+si*1.8),0xffa040); this.a94Once?.('tw95_fruit_fall',fx,fy,90,{depth:fy+30}); this.time?.delayedCall?.(760,()=>{ if(this.state!=='menu')this.a94Once?.('tw95_fruit_splat',fx,fy,130,{depth:fy-1}); if(this._twist===T&&(this.state==='play'||this.state==='levelup'))this.a12?.('a22_fruit_splat',.26,.1); }); } } }   /* v8.2.86 ใบ 95 ผลไม้จริง */
    else if(T.kind==='dark'){ (this.enemies?.getChildren?.()||[]).forEach(e=>{ if(!e||!e.active||e.isBoss||e._twistBuff||!e.spd)return; e._twistBuff=e.spd; e.spd*=BOSS_DARK_SPD; e.setTint?.(0xff6a8a); T.buffed.push(e); if(T.auras.length<20){ const s=this.a94Loop?.('tw95_frenzy_aura',e.x,e.y,60); if(s){ s.setAlpha?.(.85); T.auras.push({e,s,dy:10}); T.objs.push(s); } } }); }   /* v8.2.86 ใบ 95 ออร่า frenzy (สูงสุด 20) */
    else if(T.kind==='shadows'){ if(T.foes&&T.foes.every(e=>!e||!e.active))T.t=Math.min(T.t,0); }
    if(T.t<=0)this.bossTwistEnd(true); }
  bossTwistShadows(T){ const b=this.boss; T.foes=[]; T.auras=T.auras||[]; if(b)this.a94Once?.('tw95_shadow_summon',b.x,b.y,200); for(let k=0;k<BOSS_SHADOWS;k++){ let e=null; try{ e=this.spawnElite?.(true,true); }catch(err){} if(!e)continue; const a=k/BOSS_SHADOWS*Math.PI*2; e.setPosition?.(b.x+Math.cos(a)*120,b.y+Math.sin(a)*120); e.body?.reset?.(e.x,e.y); e.tintColor=0x6a4a9a; e.setTint?.(0x6a4a9a); e.setAlpha?.(.85); this.emergeFoe?.(e,'ground'); T.foes.push(e); const au=this.a94Loop?.('tw95_shadow_aura',e.x,e.y,120); if(au){ T.auras.push({e,s:au}); T.objs.push(au); } } }   /* v8.2.86 ใบ 95 ออร่าเงา */
  bossTwistEnd(ok){ const T=this._twist; if(!T)return; if(typeof VoiceActing!=='undefined')VoiceActing.stop(T); this._twist=null; for(const o of T.objs){ try{ this.tweens?.killTweensOf?.(o); if(o?.active)o.destroy(); }catch(e){} }
    for(const e of T.buffed)if(e&&e._twistBuff){ e.spd=e._twistBuff; e._twistBuff=0; if(e.active){ if(e.tintColor)e.setTint?.(e.tintColor); else e.clearTint?.(); } }
    if(!ok)return; this.a12?.('a22_twist_survive',.4,.5); const si=this.stageIndex||0,b=Math.round(BOSS_TWIST_SUGAR[0]+si*BOSS_TWIST_SUGAR[1]+(T.popped||0)); this.sugarStage=(this.sugarStage||0)+b; this.sugarRun=(this.sugarRun||0)+b; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun); this.showBanner?.('✅ Survived!','Sugar +'+b,1200); }
  stackPick(primary){ const pc=STACK_CAT[primary?.type]; if(pc==='global')return null; const ok=STACK_POOL.filter(t=>t!==primary?.type&&STACK_CAT[t]!==pc&&WAVE_OBJECTIVES[t]); return ok.length?ok[Math.floor(Math.random()*ok.length)]:null; }
  stackStart(type,opt){ if(this._stack||!type)return null; const boss=!!(opt&&opt.boss); const def=WAVE_OBJECTIVES[type],color=0xb8f0ff,o={type,emoji:def.emoji,name:def.name,desc:def.desc,color,progress:0,target:0,done:false,_stack:true},g=this.add.graphics().setScrollFactor(1).setDepth(90041); this.camWorld?.(g);
    const T=boss?(typeof BOSS_MISSION_DUR!=='undefined'?BOSS_MISSION_DUR:45):this._v83Run?(MISSION_WAVE_DUR[type]||MISSION_WAVE_DUR._):Math.max(30,Math.min(MISSION_WAVE_DUR[type]||MISSION_WAVE_DUR._,(this.waveTimer||60)-4));   /* v8.3.24 C2–C3 ภารกิจรองข้ามเวฟ = เวลาเต็มของภารกิจ */ this._stack={o,S:null,g,T,T0:T,type,txt:null,boss}; this.logMission?.(type);
    this.stackRun(()=>{ this._sig=null; this.sigSetup(o,type,{dur:T}); this.rpMissionSetup?.(o); this.maSetup?.(o); }); if(o._timedGoal)o.target=Math.max(1,Math.floor(T)-1);
    if(this.add?.text&&this.camUI){ const y=(this.waveObjTxt?.y||40)+(this.waveObjTxt?.height||18)+14,t=this.add.text(this.W/2,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#b8f0ff',stroke:'#1a0f1e',strokeThickness:3}).setOrigin(.5,0).setScrollFactor(1).setDepth(54); this.camUI(t); this._stack.txt=t; const ck=boss&&this.realTex?.('ev90_boss_chip')?'ev90_boss_chip':'ui87_side_chip'; if(this.realTex?.(ck)){ const ch=this.add.image(this.W/2,y+9,ck).setScrollFactor(1).setDepth(53).setDisplaySize(230,24); this.camUI(ch); this._stack.chip=ch; } }   /* v8.2.24 ใบ 87 แถบภารกิจเสริม */
    this.showBanner?.((boss?'👑 Boss mission: ':'➕ Side mission: ')+def.emoji+' '+def.name,boss?'The boss calls on the stage — finish it for a Gear box':def.desc,2200); if(boss){ (this.a12?.('a18_boss_mission',.5,.5))||Sfx.card?.(); this.rubyVoiceReact?.('bossmission',600); } else { this.a12?.('a16_side_mission',.45,.5)||Sfx.card?.(); this.rubyVoiceReact?.('side',600); } return this._stack; }
  stackTick(dt){ const K=this._stack;
    if(!K){ if(!STACK_ON||this._stackTried||this.mode!=='wave'||!this._waveTimed||this.state!=='play'||(this.stageIndex||0)<STACK_FROM||this._replayMeter||!this.usesStoryBudget?.())return; const o=this.waveObjective; if(!o||o.done||(this.waveDur||0)-(this.waveTimer||0)<STACK_AT)return; this._stackTried=true; if((this.waveTimer||0)<STACK_MIN_LEFT||Math.random()>=STACK_CHANCE)return; this.stackStart(this.stackPick(o)); return; }
    if(K.o.done){ this.stackEnd(false); return; } if(K.boss?(this.mode!=='boss'||!this.boss?.active):(this._v83Run?['boss','bossWarning','reward'].includes(this.mode):this.mode!=='wave')){ this.stackEnd(true); return; }   /* v8.3.24 C2–C3 ภารกิจรองทำต่อข้ามเวฟ (หยุดเวลาช่วงมินิบอส) */
    K.T-=dt; this.stackRun(()=>{ this.sigTick(dt,K.o); if(K.o._timedGoal&&K.S&&(K.S.t||0)>=K.o.target&&!K.o.done)this.hhFinish?.(K.o,K.S); if(!K.o.done&&K.o.target>0&&K.o.progress>=K.o.target)this.stackComplete(); });
    if(!K.o.done&&K.T<=0){ if(K.o._timedGoal)this.stackRun(()=>this.hhFinish?.(K.o,K.S)); else this.stackEnd(true); return; }
    const o=K.o,v=o._timedGoal?Math.ceil(Math.max(0,K.T))+'s':Math.floor(o.progress)+'/'+(o.target||1); K.txt?.setText('➕ '+o.emoji+' '+o.name+' · '+v+(o._timedGoal?'':' · '+Math.ceil(Math.max(0,K.T))+'s')).setVisible(true); if(K.chip&&K.txt)K.chip.setDisplaySize(Math.max(160,K.txt.width+40),24); }
  stackComplete(){ const K=this._stack; if(!K||K.o.done)return; const o=K.o; o.done=true; o._won=true; const bonus=Math.round((6+(this.stageIndex+1)*2+this.waveIndex*2)*(this.maPay?.(o)||1)); this.maEarn?.(1); this.sugarStage+=bonus; this.sugarRun+=bonus;   // ภารกิจเสริมจบ: รางวัลเต็มเหมือนภารกิจหลัก แต่ไม่ปิดเวฟ
    const sw=this._stackSwap; const give=()=>{ this.missionLootBurst?.(o,bonus); this.missionRewardGive?.(o); if(typeof LEAGUE_MISSIONS!=='undefined'&&LEAGUE_MISSIONS.includes(o.type))this.leagueCurrencyDrop?.(o); }; if(sw)give(); else this.stackRun(give);
    this.missionJuice?.(o); this.doubleClearMark?.('side');
    if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun); this.showBanner?.('✅ Side mission complete','Sugar +'+bonus,1400); Sfx.orderCue?.('mission_tube_pop',.4,.5); this.time?.delayedCall?.(0,()=>this.stackEnd(false)); }
  stackEnd(expired){ const K=this._stack; if(!K)return; if(expired&&!K.o.done){ const f=Math.max(0,Math.min(1,(K.o.progress||0)/Math.max(1,K.o.target||1))); K.o.done=true; if(f>=MISSION_HALF_AT){ const su=Math.round((6+(this.stageIndex+1)*2+this.waveIndex*2)*.5); this.sugarStage+=su; this.sugarRun+=su; this.stackRun(()=>this.missionLootBurst?.({...K.o,noCur:true},su)); this.floatText?.(this.player?.x||0,(this.player?.y||0)-90,'⌛ Side mission · half reward +'+su,0xb8f0ff); } else this.floatText?.(this.player?.x||0,(this.player?.y||0)-90,'⌛ Side mission missed',0xb8f0ff); }
    this.stackRun(()=>this.sigClear?.()); K.g?.destroy?.(); K.txt?.destroy?.(); K.chip?.destroy?.(); this._stack=null; }
  /* v8.2.25 A17 เพลงภารกิจใหญ่: เปลี่ยนเพลงตอนภารกิจหลักเริ่มช่วงสำคัญ · ภารกิจเสริม (ซ้อน) ไม่เปลี่ยน · มินิบอส/บอสชนะเสมอ · จบภารกิจ = กลับเพลงด่าน */
  missionMusic(key,sting){ if(this._stackSwap||this.boss?.active||this.mini?.active||this.mode==='boss'||this.mode==='mini'||typeof Sfx==='undefined')return false; if(!this._missionBgm&&sting!==false)Sfx.orderCue?.('m_mission_start',.45,1); if(sting==='thaw')Sfx.orderCue?.('m_thaw_hit',.5,1); this._missionBgm=key; return Sfx.playMissionBgm?.(key); }
  missionMusicEnd(ok){ if(!this._missionBgm)return; this._missionBgm=null; if(typeof Sfx==='undefined')return; if(ok)Sfx.orderCue?.('m_mission_clear',.45,1); if(this.state!=='menu'&&!this.boss?.active&&!this.mini?.active&&this.mode!=='boss'&&this.mode!=='mini')Sfx.playStageBgm?.((this.stageIndex||0)+1); }
  waveTimedSetup(o){ this._waveTimed=false; this._hurrySaid=false; if(!WAVE_TIMED||!o||o.done||o.type==='survive'||this._replayMeter||!this.usesStoryBudget?.())return false;
    const d=Math.round(Math.max(MISSION_WAVE_DUR[o.type]||MISSION_WAVE_DUR._,MISSION_TIMED_GOAL.includes(o.type)?(o.target||0)+25:0)*(o._first?(typeof FIRST_TIME_MUL!=='undefined'?FIRST_TIME_MUL:1.2):1)*(this.rpMul?.('msnTime')||1)*(o._maTime||1));   /* v8.2.28 เจอครั้งแรก +20% */ this.waveDur=this.waveTimer=Math.max(this.waveDur||0,d); this._waveTimed=true;
    if(o._timedGoal){ o.target=Math.max(1,Math.floor(this.waveDur)-1); o.desc=o.desc.replace(/last \d+s/,'last '+o.target+'s'); } return true; }
  expireWaveObjective(){ const o=this.waveObjective; if(!o||o.done)return; this.missionMusicEnd?.(false); const f=Math.max(0,Math.min(1,(o.progress||0)/Math.max(1,o.target||1))),half=f>=MISSION_HALF_AT; o.done=true; let su=0;
    if(half){ su=Math.round((6+(this.stageIndex+1)*2+this.waveIndex*2)*.5*(o._gold?GOLD_WAVE_MUL:1)); this.sugarStage+=su; this.sugarRun+=su; if(!this._inTutorial)this.missionLootBurst?.({...o,noCur:true},su); if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun); }
    this.clearWaveObjective(); this._waveTimed=false; if(this.usesStoryBudget?.()){ this.clearFoes?.(); this.clearEnemies?.(); this.settleStoryBudget?.(true,!half); } this.mode='waveclear'; this.waveTimer=0;
    this.a12?.('a16_time_up',.45,.5); if(half)this.rubyVoiceReact?.('half',400);
    this.showBanner?.(half?'⌛ Time’s up · half reward':'⌛ Time’s up · mission missed',half?'Sugar +'+su+' for getting '+Math.round(f*100)+'% done':'Only '+Math.round(f*100)+'% done — no mission reward this wave',1800); return su; }
  usesStoryBudget(){return !this._inTutorial&&!this.recipeMode&&!this.riftMode&&!this.bossRush;}
  beginStoryBudget(w){
    if(!this.usesStoryBudget?.()){this._storyBudget=null;return;}
    const key=this._replayMeter?'replay':w;if(this._storyBudget?.key===key)return;
    const p=STORY_WAVE_PLAN[Math.min(4,Math.max(0,w))];
    this._storyBudget={key,reward:this._replayMeter?200:p.reward,questPaid:0,quota:this._replayMeter?REPLAY_QUOTA:p.quota,spawned:0,issued:0,paid:0,done:false};
  }
  storyTimedSwarm(){return !!(this.usesStoryBudget?.()&&!this._replayMeter&&this.mode==='wave'&&this.waveObjective?.type==='survive'&&!this.waveObjective.done&&this.waveTimer>0);}
  storySpawnPace(){
    if(this.storyTimedSwarm())return {batch:6+Math.min(2,this.waveIndex||0),interval:1.2,refill:.85};
    const late=this.usesStoryBudget?.()&&!this._replayMeter&&this.stageIndex>=2&&this.mode==='wave'&&!this.waveObjective?.done?Math.min(2,Math.max(0,(this.waveIndex||0)-2)):0;
    return {batch:late?4+late:4+(this.waveIndex>=3?1:0),interval:late?1.6-.2*late:1.6,refill:.8};
  }
  storyLiveCap(){
    const chapter=Math.min(2,Math.floor(this.stageIndex/5));
    if(this.mode==='boss'||this.mode==='bossWarning')return [4,6,8][chapter];
    if(this.mode==='mini'||this.mode==='miniWarning')return [8,10,12][chapter];
    const base=STORY_WAVE_PLAN[Math.min(4,Math.max(0,this.waveIndex||0))].live+chapter*4;
    return this.storyTimedSwarm()?base+6:Math.max(8,Math.floor(base*(this.waveObjective&&this.waveObjective.type!=='survive'?.8:1)));
  }
  storyCanSpawn(objective=false,type=null){
    if(!this.usesStoryBudget?.()||!this._storyBudget)return true;
    if(this._sigForce&&this.enemies.countActive(true)<(this.maxLive||100))return true;   /* v8.1.82 ภารกิจ League ต้องเกิดมอนได้ (ปาก/เส้นราก/รูปปั้น) */
    let cap=Math.min(this.maxLive||100,this.storyLiveCap());
    if(!objective&&this.waveObjective?.type==='hunt'&&!this.waveObjective.done&&this.waveObjective._huntPhase!=='clear'&&!this.huntTargetActive?.())cap=Math.max(0,cap-1);
    if(this.enemies.countActive(true)>=cap)return false;
    if(type==='shooter'){let n=0;this.enemies.children.iterate(e=>{if(e?.active&&e.shooter)n++;});if(n>=2+Math.min(2,Math.floor(this.stageIndex/5)))return false;}
    const o=this.waveObjective,gateNeedsFoes=o?.type==='hunt'&&o._huntPhase==='clear'&&this.enemies.countActive(true)<Math.max(0,o._huntKillGoal-o._huntKills);
    /* v7.8.37 บั๊กค้าง C2-4: บททดสอบใบไม้ผลิต้องฆ่า 10 ตัว แต่ Reserves หมด → spawnEnemy ถูกบล็อกตรงนี้ (ฟิกซ์ v7.8.29 ไม่มีผล) · ยอมให้เติมเท่าที่ยังขาด */
    const sc=o?.type==='seasonCycle'&&!o.done?o.storm?.cur:null,seasonNeedsFoes=!!(sc&&((sc.idx===0&&!sc.partial&&!o.storm.passed[0]&&this.enemies.countActive(true)<Math.max(0,(this.stormRule?.(0,o)?.need??10)-sc.kills))||this.enemies.countActive(true)<(o.storm?.harvest?10:6)));   /* v7.8.53 พายุฤดู: Reserves หมดแล้วสนามว่างทั้งเวฟ → เติมเบา ๆ ให้มีมอนอย่างน้อย 6 ตัว */
    const rm=this._replayMeter,replayNeedsFoes=!!(rm&&!rm.done&&this.mode==='wave');   /* v7.8.48 replay ไม่มีตัดเวลา → เติมมอนจนหลอดเต็ม ไม่ให้ Reserves หมดแล้วค้าง */
    const timedNeedsFoes=!!(this.mode==='wave'&&this.waveTimer>0&&(this._waveTimed||!this.waveObjective)&&this.enemies.countActive(true)<8);   /* v8.2.20 เวฟจับเวลา: Reserves หมดแล้วยังเหลือเวลา → เติมเบา ๆ ไม่ให้สนามว่าง */
    return objective||(!this._storyBudget.done&&(this.storyTimedSwarm()||timedNeedsFoes||this._storyBudget.spawned<this._storyBudget.quota||gateNeedsFoes||seasonNeedsFoes||replayNeedsFoes));
  }
  storySpawned(objective=false){if(this.usesStoryBudget?.()&&this._storyBudget&&!objective)this._storyBudget.spawned++;}
  storyEnemyXp(e){
    if(e.isMini)return 50;
    if(e._waveObjectiveTarget)return 20;
    return Math.max(1,Math.round((e.xp||1)*1.7));
  }
  settleStoryBudget(completed=false,partial=false){
    const b=this._storyBudget;if(!this.usesStoryBudget?.()||!b||b.done)return;
    const collected=0;   /* v7.9.12 เจ้าของ: จบเวฟเม็ด EXP อยู่บนพื้นต่อ ผู้เล่นต้องเดินเก็บเอง (collectOrb นับ paid) · จบด่าน onBossDown เก็บที่เหลือให้ */
    const target=completed?(partial?40:b.reward):b.questPaid,grant=Math.max(0,target-b.questPaid);b.questPaid+=grant;
    if(!partial)b.done=true;b.paid+=collected+grant;
    if(collected+grant>0)this.gainXp(collected+grant);
  }
  setupSpawnRates(w){
    const p=this.waveProfile(w),si=this.stageIndex;this.waveTypes=p.types.slice();
    // Stage 3 ขึ้นไป (si>=2): เพิ่มจำนวนมอน (แน่นขึ้น) + ลดสัดส่วนตัวตีไกล (shooter) ให้เน้นประชิด
    if(si>=2){ let sh=0; this.waveTypes=this.waveTypes.map(t=>{ if(t==='shooter'){ sh++; return sh>1?'basic':t; } return t; }); }   // เหลือ shooter ได้มากสุด 1 ช่องในลิสต์ = ตัวตีไกลออกน้อยลง
    this.spawnInterval=Math.max(0.5,p.interval-si*0.03-(si>=2?0.14:0));this.spawnBatch=p.batch+Math.floor(si/2)+1+(si>=2?1:0);if(this._challengeRun.includes('crowd')){this.spawnInterval=Math.max(0.5,this.spawnInterval*0.85);this.spawnBatch+=1;}
    const liveCap=si===6?BALANCE.c2Mycelium.maxLive:si===7?BALANCE.c2Nectar.maxLive:si===8?BALANCE.c2Seasons.maxLive:si===9?BALANCE.c2Root.maxLive:115;this.maxLive=Math.round(Math.min(liveCap,p.max+si*(si>=2?7:4)+6+(si>=2?12:0))*PERF_LIVE_MUL);this._baseMaxLive=this.maxLive;this.applyPerfLive();this.eliteEvery=14+Math.max(0,3-w);this.eliteAcc=this.eliteEvery;   // เพดานฝูงบนจอมากขึ้น
    if(this.usesStoryBudget?.()){
      this.beginStoryBudget(w);this.maxLive=STORY_WAVE_PLAN[Math.min(4,w)].live+6+Math.min(2,Math.floor(si/5))*4;
      this._baseMaxLive=this.maxLive;this.applyPerfLive();this.spawnBatch=4+(w>=3?1:0);this.spawnInterval=1.6;
    }
    this.waveAllowsElite=w===3||w===4;this.swarmAcc=this.usesStoryBudget?.()?10:Phaser.Math.FloatBetween(24,32);
  }
  spawnWaveEnemy(){const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['basic'];let t=Phaser.Utils.Array.GetRandom(types);if(this.stageIndex===0&&t!=='basic'&&Math.random()<0.55)t='basic';if(t==='siege'&&this.stageIndex===9&&!this.recipeMode){let n=0;this.enemies?.children?.iterate?.(e=>{if(e&&e.active&&e.rootRole==='rootChoir')n++;});if(n>=2||Math.random()<.6)t='basic';}   /* v7.8.63 เจ้าของ: Root Choir (ยิงหลายแฉก ถึก) ออกน้อยลง — 40% ของช่อง siege · บนจอพร้อมกันไม่เกิน 2 */this.spawnEnemy(t);}   // v5.71 ด่านแรกตัวพุ่ง/ยิงน้อยลง
  // Soft director: ผู้เล่นฆ่าเร็วได้เจอฝูงเพิ่มเล็กน้อย แต่มี cap รายเวฟและไม่เปลี่ยน type pool/ดาเมจ
  wavePressure(){
    const p=this.waveProfile(this.waveIndex),elapsed=Math.max(8,(this.waveDur||0)-Math.max(0,this.waveTimer||0)),kills=Math.max(0,(this.stageKills||0)-(this.waveKillStart||0));
    const target=0.48+this.waveIndex*0.10+this.stageIndex*0.05,pace=kills/elapsed,raw=Phaser.Math.Clamp((pace-target)/Math.max(0.25,target),0,1);
    return Math.min(p.pressureCap==null?0.45:p.pressureCap,raw);
  }
  // เกิดมอนเป็น "circle" Waitบผู้เล่นแล้วบีบวงเข้ามา (chase AI ทำให้ค่อย ๆ หุบวง)
  spawnWaveRing(n){
    if(n<=0)return; const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['basic'];
    if(this._v83Run&&this.mode==='wave'){
      const direction=Math.random()*Math.PI*2;
      for(let i=0;i<n;i++){
        // Adjacent enemies approach as a pack, leaving an escape lane on the opposite side.
        const angle=direction+(i-(n-1)/2)*Math.min(.24,1.4/n);
        const distance=250+(i%2)*32;
        let point=this.chapterVisibleSpawn(angle,distance);
        if(!point)point=this.chapterVisibleSpawn(angle+Math.PI,distance);
        if(!point)point=this.chapterVisibleSpawn(angle+Math.PI/2,distance)||this.chapterVisibleSpawn(angle-Math.PI/2,distance);
        if(point)this.spawnEnemy(Phaser.Utils.Array.GetRandom(types),point.angle,point.distance,true);
      }
      return;
    }
    const base=Math.random()*Math.PI*2, step=Math.PI*2/n, jitter=step*0.26;
    const rad=Math.max(this.W,this.H)/this.viewZoom*0.62+40;
    for(let i=0;i<n;i++){ const ang=base+i*step+Phaser.Math.FloatBetween(-jitter,jitter);
      this.spawnEnemy(Phaser.Utils.Array.GetRandom(types),ang,rad*Phaser.Math.FloatBetween(0.94,1.06)); }
  }
  spawnSwarm(){
    if(this.usesStoryBudget?.()){
      if(!this.storyTimedSwarm())return;
      const room=Math.min(this.maxLive,this.storyLiveCap())-this.enemies.countActive(true),n=Math.min(room,10+Math.min(4,this.waveIndex||0));
      if(n<3)return;this.spawnWaveRing(n);this.rubyVoiceReact?.('wave',400);this.showBanner('Swarm surge','Keep moving — another group is closing in',900);Sfx.bossWarn();return;
    }
    const n=Math.min(this.maxLive-this.enemies.countActive(true),10+this.stageIndex*2+this.waveIndex*2);if(n<=4)return;
    const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['fast','basic'];
    for(let i=0;i<n;i++)this.spawnEnemy(Phaser.Utils.Array.GetRandom(types));
    const beat=STAGE_SWARM_BEATS[this.stageIndex]||STAGE_SWARM_BEATS[0];
    this.showBanner(beat.title,beat.sub,1800);Sfx.bossWarn();this.screenShake(180,0.005);
  }
  spawnElite(allowRecycle=true,objective=false,arrival=null){
    if(this.storyCanSpawn?.(objective)===false)return null;
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.6+40;
    const [x,y]=arrival?[arrival.x,arrival.y]:(typeof inMapPt==='function'?inMapPt:(x,y)=>[x,y])(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad);
    let e=this.enemies.getFirstDead(false); const eliteKey=this.stageIndex===0?this.antArtKey('elite'):(this.stageIndex===1?this.drainArtKey('elite'):this.stageIndex===2?this.fireArtKey('elite'):this.stageIndex===3?this.iceArtKey('elite'):this.stageIndex===4?this.stage5ArtKey('elite'):this.stageIndex===5?'ch2_enemy_atlas':this.stageIndex===8?'ch2_seasons_enemy_atlas':'e_tank'),eliteFrame=this.stageIndex===5?6:this.stageIndex===8?5:0;
    if(!e) e=this.enemies.create(x,y,eliteKey,eliteFrame); else { e.setTexture(eliteKey,eliteFrame); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }
    if(!e){ if(!allowRecycle)return null;e=this.enemies.getFirstAlive(); if(!e)return null; e.setTexture(eliteKey,eliteFrame); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }   // Other elite events retain their existing pool fallback.
    this.tagTaroEnemy?.(e);this.clearObjectiveTargetFx(e);e._waveObjectiveTarget=false;
    const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),storyHp=[1,1.29,1.664,2.147,2.769,3.572,4.608,5.945,7.669,9.893,12.761,16.462,23.047,32.266,45.172],stageCurve=this.recipeMode?stageCurveValue(this.stageIndex,[1,1.32,1.72,2.18,2.72,3.35],1.17):(storyHp[this.stageIndex]??storyHp[14]*Math.pow(1.4,this.stageIndex-14)),waveCurve=this.recipeMode?([1,1.06,1.13,1.21,1.30][this.waveIndex]||1.30):([1,1.08,1.17,1.27,1.38][this.waveIndex]||1.38),s=stageCurve*waveCurve*pg.enemyHp*this.killPowerMul()*this.diffMul().hp/0.9*(this.recipeMode?1.15*70/120:1);   /* v7.8.65 เจ้าของ: Elite = 1.5× Tank (120 vs 80) ใช้สเกลเดียวกับมอน · Recipe คงเดิม */   // v6.55.26: HP ×1/0.9 ชดเชยดาเมจฐาน 100%   // elite ถึกขึ้นเล็กน้อย + สเกลตามมอนที่ตาย + ระดับความยาก
    e.hp=120*s*(this.recipeMode||typeof STORY_HP_MUL!=="number"?1:STORY_HP_MUL); e.maxhp=e.hp; e.spd=48; e.dmg=Math.round(18*1.3/*v6.55.66 mob dmg*/*(this.recipeMode?stageCurveValue(this.stageIndex,[1,1.05,1.12,1.20,1.30,1.42],1.09):([1,1.082,1.171,1.267,1.371,1.483,1.605,1.736,1.879,2.033,2.199,2.38,2.689,3.038,3.433][this.stageIndex]??3))*pg.enemyDmg*this.diffMul().dmg); e.xp=8;
    if(this.stageIndex===0)e.setCircle(28,20,20);else if(this.stageIndex===4)e.setCircle(54,74,74);else if(this.stageIndex===5||this.stageIndex===8)e.setCircle(48,80,80);else e.setCircle(26,5,5); e._rootKnightPoseToken=(e._rootKnightPoseToken||0)+1;e._rootKnightPoseUntil=0;
      e.isBoss=false; e.isMini=false; e.isElite=true; e.frozen=0; e._glacierLifeToken=(e._glacierLifeToken||0)+1;e._frostBurnStacks=0;e._trem=0;e._shock=0;e._frostBurnUntil=0;e._frostBurnPower=0;e._frostBurnTick=0; e._glacierFrost=0; e._glacierFrostAt=0; e._glacierBrittleUntil=0;e._mintImpale=0;e._mintImpaleAt=-Infinity;e._mintRuptureAt=-Infinity; e._glacierBurstAt=-Infinity; e._chill=0; e._chillAt=null; e.knock=0;   // v4.50: stage8 (C2-4) elite ใช้ atlas 256px → hitbox เหมือน stage5
    e.shooter=false; e.bomber=false; e.acid=false; e.dasher=false; e.siege=false; e.dashState=null; e.tintColor=this.stageIndex===1?0x72e5d0:null;e.frostbite=this.stageIndex===3;e.bloomStacks=0;e.bloomUntil=0;
    e.baseScale=this.stageIndex===0?0.95:(this.stageIndex===1?0.84:this.stageIndex===2?0.92:this.stageIndex===3?0.94:this.stageIndex===4?0.56:(this.stageIndex===5||this.stageIndex===8)?0.42:1.55);if(this.stageIndex===4)e.roleName='Crown Oven Guard';if(this.stageIndex===5)e.roleName='Crown Sapling';if(this.stageIndex===8)e.roleName='Equinox Colossus';   /* v4.50: stage8 (C2-4) elite ใช้ ch2_seasons atlas 256px → scale 0.42 (เดิม 1.55 = ตัวยักษ์+hitbox ผิด = ตีไม่โดน) */ e._sqX=1; e._sqY=1; e.setScale(e.baseScale).clearTint();if(e.tintColor)e.setTint(e.tintColor);e._rareElite=false;e._feast=false;e._duelElite=false;e._mimic=null;this.resetEnemyPresentation(e,eliteFrame);if(this.stageIndex===5&&this.textures.exists('c21_crown_sapling_animated'))this.applySpecialEnemyArt(e,'c21_crown_sapling_animated');else if(this.stageIndex===8&&this.textures.exists('c24_equinox_animated'))this.applySpecialEnemyArt(e,'c24_equinox_animated');else if({6:1,7:1,9:1}[this.stageIndex]){const k={6:'c22_bulwark_animated',7:'c23_wax_guard_animated',9:'c25_bark_guard_animated'}[this.stageIndex];if(this.textures.exists(k))this.applySpecialEnemyArt?.(e,k);}   /* v7.8.63 เจ้าของ: Elite ม่วง (e_tank) ไม่เข้าธีม C2-2/C2-3/C2-5 → ใช้ตัวโล่ของด่านนั้น */else if(this.stageIndex>=10&&this.textures.exists('c3_elite_animated'))this.applySpecialEnemyArt(e,'c3_elite_animated');this.camWorld(e);this.storySpawned?.(objective);return e;
  }
  // เวฟธรรมดา = "Survive the timer" (นับถอยหลัง + มอนเกิดต่อเนื่องเป็นฝูง)
  startSurvivalWave(w, seamless){
    const si=this.stageIndex;
    this.setupSpawnRates(w); if(!seamless)this.fireRecipes('newWave');
    this.waveDur=this.waveProfile(w).dur;               // เวฟละ 48–56s รวมบอส/พัก ≈ 5 นาทีต่อด่าน
    this.waveTimer=this.waveDur; this.spawnAcc=0;this.waveKillStart=this.stageKills||0;
    // ระลอกเปิดตัว — เวฟที่ไหลต่อ (seamless) ข้ามการถล่มเปิดตัว เพราะมอนสเตอร์เดิมยังFullจออยู่
    if(!seamless){
      const burst=Math.min(this.maxLive, 5 + w*2 + si);
      this.spawnWaveRing(burst);   // ระลอกเปิดตัวเป็นcircleล้อมWaitบแล้วบีบเข้า
      if(this.waveAllowsElite) for(let i=0;i<1+Math.floor(si/3);i++)this.spawnElite();
    } else {
      const live=this.enemies.countActive(true);   // เติมให้ถึงราวครึ่งเพดานถ้ามอนเดิมเหลือน้อย
      const fill=Math.max(0, Math.min(this.maxLive, Math.floor(this.maxLive*0.55))-live);
      this.spawnWaveRing(fill);
    }
    // กล่อง/โหลทุบได้ (ธีมครัว) — ทุบเอาของ (ออร์บ/ฟื้นฟู)
    const nc=2+Math.floor(si*0.6); if(!this._v83Run||!seamless)for(let i=0;i<nc;i++) this.spawnCrate();
    if(!this._replayMeter&&(!this._v83Run||!seamless))this.spawnStageGimmick();
  }
  setupWaveObjective(w,p){
    this.stackEnd?.(false); this._stackTried=false;
    this.clearWaveObjective();
    const dealT=!(p&&p.forceType)&&this._missionDeal&&!this._missionDeal.preview&&!this.recipeMode&&!this.riftMode&&!this.bossRush?this._missionDeal.waves[w]:null;
    const planned=dealT?(this._missionDeal.plan?earlyWaveMission(this.stageIndex,w):null):(!this.recipeMode&&!this.riftMode&&!MISSION_DECK?earlyWaveMission(this.stageIndex,w):null);
    if(!(p&&p.forceType)&&!dealT&&!planned&&(!this._waveObjectiveBag||!this._waveObjectiveBag.length)){const st=STAGES[this.stageIndex],pool=this.c1FirstPool(Array.isArray(st&&st.objectives)&&st.objectives.length?st.objectives:['survive','hunt','purge','capture']);this._waveObjectiveBag=Phaser.Utils.Array.Shuffle(pool.slice());if(st&&st.lead&&!this._leadUsed){ const b=this._waveObjectiveBag,i=b.indexOf(st.lead); if(i>=0){ b.splice(i,1); b.push(st.lead); this._leadUsed=true; } }}   /* v8.1.82 ภารกิจ League ประจำด่านมาก่อน */
    if(!(p&&p.forceType)&&!dealT&&!planned&&this._waveObjectiveBag&&!this._waveObjectiveBag._roamed){ this._waveObjectiveBag._roamed=true; this.missionRoamBag?.(this._waveObjectiveBag); }
    let type=p&&p.forceType?p.forceType:dealT?dealT:planned?planned.type:this._waveObjectiveBag.pop();
    if(MISSION_HOME[type]!=null&&!this.recipeMode&&!this.riftMode&&!this.bossRush&&typeof Save!=='undefined'&&Save.data){ const sn=Save.data.seenMissions=Save.data.seenMissions||{}; sn[type]=1; }
    if(!(p&&p.forceType)&&!dealT&&!planned&&type==='hunt'&&this._huntUsed){ const st0=STAGES[this.stageIndex]||{},alt=(Array.isArray(st0.objectives)&&st0.objectives.length?st0.objectives:['survive','purge','capture']).filter(t=>t!=='hunt'); if(alt.length)type=alt[Math.floor(Math.random()*alt.length)]; }   /* v8.1.76 เจ้าของ: Hunt ไม่เกินด่านละครั้ง */
    if(type==='hunt'&&!(p&&p.forceType))this._huntUsed=true;
    const _first=!(p&&p.forceType)&&!planned&&!this._inTutorial&&!this.recipeMode&&!this.riftMode&&!this.bossRush&&!this._replayMeter&&type!=='survive'&&typeof Save!=='undefined'&&!!Save.data&&!(Save.data.missionLog||{})[type];   /* v8.2.28 เจอครั้งแรก */
    this.logMission?.(type);   /* v8.2.5 เจ้าของ: หน้า Missions ใน Recipe Book — จำทุกภารกิจที่เคยเจอ (ทุกโหมด) */
    const def=WAVE_OBJECTIVES[type]||WAVE_OBJECTIVES.survive,color=CH1_OBJECTIVE_COLORS[this.stageIndex]||STAGES[this.stageIndex].tint||0xffd166;
    const _pk=planned?Object.keys(CH1_EARLY_WAVE_PLAN[this.stageIndex]).map(Number):[],lesson=planned?((_pk.indexOf(w)+1)+'/'+_pk.length):null;
    Sfx.orderCue?.('wave_start',.35,.6);const o=this.waveObjective={type,emoji:def.emoji,name:def.name,desc:def.desc,lesson,color,progress:0,target:0,done:false,_first};
    if(type==='survive')o.target=Math.max(1,p.dur||48);
    else if(type==='fill')o.target=Math.min(FILL_TARGET_MAX,this.usesStoryBudget?.()?this._storyBudget.quota:30+this.stageIndex*10);   /* v8.2.14 เจ้าของ: Fill ขั้นแรกไม่เกิน 35 ตัว (เดิมเท่าโควตาเวฟ 50–80) */
    else if(type==='hunt'){
      o.target=2+(w>=4&&this.stageIndex>0?1:0)+(this.stageIndex>=3?1:0);o.desc='Find and defeat '+o.target+' marked Elite targets';if(this.usesStoryBudget?.())this.startStoryHuntRound(o);else this.spawnObjectiveElite();
    }else if(type==='purge'){
      o.target=3+(w>=4?1:0);o.desc='Protect the wisp as it purifies '+o.target+' cores — clear raiders near it';for(let i=0;i<o.target;i++)this.spawnWaveObjectiveNode(i,o.target);this.spawnPurifyWisp();
    }else if(type==='cleanAir'){
      o.target=Math.max(20,Math.round((p.dur||52)*0.45));if(typeof CLEANAIR_V2!=='undefined'&&CLEANAIR_V2){ o._v2=true; o.target=(this.stageIndex||0)>=10?5:4; o.desc='Find '+o.target+' lost Wisps in the dark'; this.cleanAirV2Spawn?.(o); } else { o.desc='Follow the Wisp '+o.target+'s · the fog lifts where it walks';this.spawnCleanAirZone(); }
    }else if(type==='defendNectar'){
      o.target=Math.max(34,Math.round((p.dur||52)*.74));o.desc='Protect 1 flower · '+o.target+'s · stand close to heal it';this.spawnNectarGarden();
    }else if(type==='seasonCycle'){
      o.target=4;o.desc='Pick up petals from defeated monsters · step on a shrine to call its season · fill all 4 ('+SEASON_PETALS+' each)';this.spawnSeasonSanctuaries();
    }else if(type==='breakRoots'){
      o.target=3;o.desc='A crown root burrows after you — lead its strike into the '+o.target+' anchor stones';this.spawnRootAnchors(o.target);this.spawnCrownRoot?.(o);   /* v8.2.8 เจ้าของ: Sever → Lure the Crown Root (ล่อรากให้พุ่งชนหิน) */
    }else if((typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(type))){
      this.sigSetup(o,type,p||{});
    }else{
      o.target=25;o.desc='Purify the ring for '+o.target+'s — it grows as you purify, enemies swarm to stop you';if(CAPTURE_CRACK){o.desc='Touch the glowing crack — it races to the next hole. Each hole bursts with monsters and loot; clear the last one!';this.spawnHungerCrack();}else this.spawnCaptureZone();
    }
    if(planned)o.desc=planned.tip;
    this.rpMissionSetup?.(o);   /* v8.2.29 Pact Relics */ this.maSetup?.(o);   /* v8.2.30 Mission Atlas */
    this.objBonusInit?.(o,!!planned);
    if(o._huntPhase)o.desc='Clear foes to reveal each marked Elite, then defeat it';
    this.renderWaveObjectiveHUD();
    if(!this.recipeMode||this._recipeMission)this.rubyTip?.(o._huntPhase?'huntClear':type,this._inTutorial?650:6200);   // v7.9.60 Ruby อธิบายภารกิจ · v8.1.121 หลังการ์ดภารกิจหุบ (ไม่ซ้อนข้อความ)
    if(type!=='hunt')this.questFocusWhenReady(o,type);
    this.missionArm?.(o,planned,p);
    if(!o._armPad&&!this._inTutorial)this.time?.delayedCall?.(450,()=>{ if(this.waveObjective===o&&!o.done)this.missionGo?.(o,null,null,false); });   /* v8.1.116 คลื่นเปิดภารกิจ */
  }
  /* ===== v8.1.162 เจ้าของ: Clean Air ใหม่ "Lost Wisps" ·
     lure: Wisp ดวงเดียวลอยเรืองแสง (ยังสว่าง ไม่มีป้าย) → เดินชน ·
     close: ขอบจอมืดบีบเข้ากลาง 1 วิ + มืดสนิท 0.3 วิ → แสงวาบจากตัว · Wisp แตก 4 ดวง (C3 5) บินกระจายทั่วแมพ ·
     dark: เห็นแค่ตะเกียงรอบตัว (130→85 หรี่ช้า ๆ · ปลดได้ = เต็มใหม่) · Wisp กะพริบให้เห็นในความมืด · มอนโผล่จากความมืดข้างหน้า (ตาเรืองแสงก่อน 0.6 วิ) ·
     ยืนใกล้ 1.5 วิ (ออกแล้วหยุดไว้ ไม่รีเซ็ต) → ระเบิดแสง ผลัก/ดาเมจมอนรอบ ๆ · สว่างถาวร r260 · Sugar นิดหน่อย ·
     ครบ = Wisp บินกลับหาเรา แสงวาบ หมอกสลาย 1 วิ · จบใน 45 วิ (นับจากมืด) = โบนัส Sugar ===== */
  cleanAirV2Spawn(o){ const pos=this.objectivePosition(0,1,170,250); const c=this._cleanAir={v2:true,phase:'lure',x:pos.x,y:pos.y,r:70,t:0,darkT:0,lantern:130,wisps:[],lit:[],eyes:[],spawnT:1.6,dark:0,objs:[]}; c.lantern=CA_LANTERN[0];
    const glow=this.camWorld(this.add.circle(pos.x,pos.y-20,46,0xbff6ff,.22).setDepth(94590)); this.tweens.add({targets:glow,scale:{from:.85,to:1.25},alpha:{from:.32,to:.12},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const bub=this.realTex?.('msn71_bubble'),spr=this.camWorld(bub?this.add.image(pos.x,pos.y-22,'msn71_bubble',0).setDisplaySize(74,74).setDepth(94600):this.add.image(pos.x,pos.y-22,'ch2_mycelium_enemy_atlas',7).setScale(.26).setDepth(94600)); this.tweens.add({targets:spr,y:pos.y-30,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});   /* v8.2.8 ฟองอากาศดี */
    c.lure=[glow,spr]; c.objs.push(glow,spr); c.g=this.camWorld(this.add.graphics().setDepth(94610)); c.objs.push(c.g); return c; }
  cleanAirV2Clear(){ const c=this._cleanAir; if(!c?.v2)return; if(c.charging)Sfx.eventLoopStop?.('event_wisp_purify_charge'); for(const q of [...c.objs,...c.wisps.map(w=>w.spr),...c.wisps.map(w=>w.glow),...c.eyes.map(e=>e.g)]){ if(q){ this.tweens?.killTweensOf?.(q); if(q.active)q.destroy(); } } c.objs=[]; c.eyes=[]; }
  cleanAirV2Fog(c,holes,alpha){ const cam=this.cameras?.main; if(!cam||!this.add?.renderTexture)return; const v=cam.worldView,PAD=60,VW=Math.ceil((v.width||this.W||390)+PAD*2),VH=Math.ceil((v.height||this.H||844)+PAD*2);
    let rt=this._cleanAirFogRT; if(rt&&rt.scene&&(rt.width<VW||rt.height<VH)){ rt.destroy(); rt=null; } if(!rt||!rt.scene){ rt=this._cleanAirFogRT=this.camWorld(this.add.renderTexture(0,0,VW+80,VH+80).setOrigin(0)); rt.setDepth?.(94500); }
    if(!(alpha>0)){ rt.setVisible?.(false); return; } rt.setVisible?.(true);
    if(!this._fogBrush){ if(!this.textures.exists('fog_brush')&&typeof document!=='undefined'){ const cv=document.createElement('canvas'); cv.width=cv.height=128; const x=cv.getContext('2d'),g=x.createRadialGradient(64,64,8,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.62,'rgba(255,255,255,.92)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=g; x.fillRect(0,0,128,128); this.textures.addCanvas('fog_brush',cv); } this._fogBrush=this.make?.image?.({key:'fog_brush',add:false})?.setOrigin(.5); }
    const ox=v.x-PAD,oy=v.y-PAD,B=this._fogBrush; rt.setPosition?.(ox,oy); rt.clear(); rt.fill(0x1b2410,Math.min(.95,alpha)); if(!B)return;   /* v8.2.80 เจ้าของ: ลบวงขาวลอย (RT วาดแปรงไม่รับสี → ขาว) */
    const t=(this.time?.now||0)/1000;
    if(this.realTex?.('fg94_fog_tile')&&this.make?.tileSprite){ let T=this._fogTile; if(!T||T.width!==VW+80||T.height!==VH+80){ T?.destroy?.(); T=this._fogTile=this.make.tileSprite({x:0,y:0,width:VW+80,height:VH+80,key:'fg94_fog_tile',add:false}).setOrigin(0); } T.tilePositionX=ox+t*14; T.tilePositionY=oy+t*6; rt.draw?.(T,0,0,Math.min(.95,alpha)); }   /* v8.2.86 ใบ 94 หมอกพิษจริง (เลื่อนช้า ๆ) */
    const EDGE=this.realTex?.('fg94_lantern_edge')?(this._fogEdge||(this._fogEdge=this.make?.image?.({key:'fg94_lantern_edge',add:false})?.setOrigin(.5))):null;
    for(const h of holes){ if(!(h.r>1))continue; const sx=h.x-ox,sy=h.y-oy; if(sx<-h.r||sy<-h.r||sx>VW+h.r||sy>VH+h.r)continue;
      if(h.wob&&EDGE){ B.setPosition(sx,sy).setScale(h.r*2.1/128); rt.erase(B); EDGE.setPosition(sx,sy).setScale(h.r/.6*2/512).setRotation(t*.15); rt.draw?.(EDGE,sx,sy,Math.min(1,alpha)); continue; }   /* v8.2.86 ใบ 94 ขอบแสงหยักแบบหมอก */
      if(h.wob){ B.setPosition(sx,sy).setScale(h.r*1.7/128); rt.erase(B); for(let i=0;i<CA_LOBES;i++){ const a=i/CA_LOBES*Math.PI*2+t*.35,d=h.r*(.62+.1*Math.sin(t*1.6+i*2.1)),lr=h.r*(.42+.12*Math.sin(t*2.3+i*1.7)); B.setPosition(sx+Math.cos(a)*d,sy+Math.sin(a)*d).setScale(lr*2/128); rt.erase(B); } continue; }   /* v8.2.80 ขอบแสงหยัก ๆ ขยับเหมือนความมืดกำลังคืบ */
      B.setPosition(sx,sy).setScale(h.r*2/128); rt.erase(B); }
    const CL=this.realTex?.('fg94_dark_claw')?(this._fogClaw||(this._fogClaw=this.make?.image?.({key:'fg94_dark_claw',frame:0,add:false})?.setOrigin(.5,.5))):null;
    if(CL)for(const h of holes){ if(!h.wob||!(h.r>1))continue; const sx=h.x-ox,sy=h.y-oy; for(let i=0;i<CA_CLAWS;i++){ const ph=(t*.55+i*.37)%1,a=i/CA_CLAWS*Math.PI*2+Math.sin(t*.7+i)*.5,d=h.r*(1.12-.32*Math.sin(ph*Math.PI)),px=sx+Math.cos(a)*d,py=sy+Math.sin(a)*d; CL.setFrame(Math.floor(t*8+i)%8).setPosition(px,py).setScale(h.r*.55/128).setRotation(a-Math.PI/2); rt.draw?.(CL,px,py,Math.min(1,alpha)*Math.sin(ph*Math.PI)); } }   /* v8.2.86 ใบ 94 กรงเล็บความมืดจริง ชี้เข้าหาตัว */
    const D=CL?null:this.cleanAirDarkBrush?.(); if(D)for(const h of holes){ if(!h.wob||!(h.r>1))continue; const sx=h.x-ox,sy=h.y-oy; for(let i=0;i<CA_CLAWS;i++){ const ph=(t*.55+i*.37)%1,a=i/CA_CLAWS*Math.PI*2+Math.sin(t*.7+i)*.5,d=h.r*(1.05-.38*Math.sin(ph*Math.PI)),cr=h.r*(.22+.06*Math.sin(t*3+i)); const px=sx+Math.cos(a)*d,py=sy+Math.sin(a)*d; D.setPosition(px,py).setScale(cr*2/128); rt.draw?.(D,px,py,.55*Math.min(1,alpha)*Math.sin(ph*Math.PI)); } } }   /* v8.2.80 กรงเล็บความมืดยื่นเข้าหาตัวแล้วถอยออก */
  cleanAirDarkBrush(){ if(this._fogDark)return this._fogDark; if(!this.textures?.exists?.('fog_brush_dark')){ if(typeof document==='undefined')return null; const cv=document.createElement('canvas'); cv.width=cv.height=128; const x=cv.getContext('2d'),g=x.createRadialGradient(64,64,6,64,64,64); g.addColorStop(0,'rgba(10,14,6,1)'); g.addColorStop(.55,'rgba(14,18,8,.85)'); g.addColorStop(1,'rgba(20,26,12,0)'); x.fillStyle=g; x.fillRect(0,0,128,128); this.textures.addCanvas('fog_brush_dark',cv); } this._fogDark=this.make?.image?.({key:'fog_brush_dark',add:false})?.setOrigin(.5)||null; return this._fogDark; }
  cleanAirV2Tick(dt,o){ const c=this._cleanAir,P=this.player; if(!c||!o||!P)return; c.t+=dt; const g=c.g; g?.clear?.(); const ease=k=>1-Math.pow(1-Math.max(0,Math.min(1,k)),3);
    if(c.phase==='lure'){ this.cleanAirV2Fog(c,[],0); if(this.dist(P.x,P.y,c.x,c.y)<c.r){ c.phase='close'; c.t=0; for(const q of c.lure)this.tweens.add({targets:q,x:P.x,y:P.y-20,alpha:0,duration:300,onComplete:()=>q.setVisible(false)}); Sfx.orderCue?.('wave_start',.4,.3); } return; }
    const W=this.W||390,H=this.H||844,big=Math.hypot(W,H)/(this.cameras?.main?.zoom||1)*.6;
    if(c.phase==='close'){ const k=c.t/1.0,hr=c.t<1?big*(1-ease(k)):0; this.cleanAirV2Fog(c,[{x:P.x,y:P.y,r:hr}],1);
      if(c.t>=1.3){ c.phase='dark'; c.t=0; c.darkT=0; this.screenFlash?.(0xf2fbff,.7,320); this.screenShake?.(160,.006); this.cleanAirV2Burst(c,P.x,P.y,160,false); c.lgrow=0;
        for(let i=0;i<o.target;i++){ const q=this.objectivePosition(i,o.target,420,820),glow=this.camWorld(this.add.circle(P.x,P.y-20,30,0xbff6ff,.25).setDepth(94590)),spr=this.camWorld(this.add.image(P.x,P.y-22,'ch2_mycelium_enemy_atlas',7).setScale(.2).setDepth(94600)),w={x:q.x,y:q.y,spr,glow,charge:0,freed:false,ph:Math.random()*3};
          this.tweens.add({targets:[spr],x:q.x,y:q.y-22,duration:900+i*90,ease:'Cubic.out'}); this.tweens.add({targets:[glow],x:q.x,y:q.y-20,duration:900+i*90,ease:'Cubic.out'}); c.wisps.push(w); } }
      return; }
    if(c.phase==='end'){ const a=Math.max(0,1-c.t/1.0); this.cleanAirV2Fog(c,[{x:P.x,y:P.y,r:c.lantern+c.t*900},...c.lit],a*.92); if(c.t>=1.0&&!c.done){ c.done=true; this.cleanAirV2Fog(c,[],0); this.completeWaveObjective(); } return; }
    // dark
    c.darkT+=dt; c.lgrow=Math.min(1,(c.lgrow||0)+dt/.35); c.lantern=Math.max(CA_LANTERN[1],c.lantern-dt*2.2); const lr=c.lantern*ease(c.lgrow);
    let near=null;
    for(const w of c.wisps){ if(!w.spr?.active)continue; const pulse=((c.darkT+w.ph)%3)<.35; w.spr.setAlpha(w.freed?.55:pulse?1:.6); w.glow?.setAlpha(w.freed?.18:pulse?.5:.2).setScale(pulse?1.5:1);
      if(w.freed)continue; const d=this.dist(P.x,P.y,w.x,w.y); if(d<85)near=w;
      if(w.charge>0&&g){ g.lineStyle(5,0x1a1028,.6).strokeCircle(w.x,w.y,40); g.lineStyle(4,0xbff6ff,.95); g.beginPath(); g.arc(w.x,w.y,40,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,w.charge/1.5),false); g.strokePath(); } }
    if(near){ near.charge+=dt; if(!c.charging){ c.charging=true; Sfx.eventLoopStart?.('event_wisp_purify_charge',.2,1); } if(near.charge>=1.5)this.cleanAirV2Free(c,o,near); } else if(c.charging){ c.charging=false; Sfx.eventLoopStop?.('event_wisp_purify_charge'); }
    // monsters from the dark
    c.spawnT-=dt; if(c.spawnT<=0&&this.state==='play'){ c.spawnT=2.4; const mv=this.player.body?.velocity,ang0=mv&&Math.hypot(mv.x,mv.y)>20?Math.atan2(mv.y,mv.x):Math.random()*Math.PI*2,n=2+((this.stageIndex||0)>=10?1:0);
      for(let i=0;i<n;i++){ const a=ang0+(Math.random()*2-1)*.9,d=lr+70+Math.random()*90,x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d; if(c.lit.some(L=>this.dist(x,y,L.x,L.y)<L.r*.8))continue; this.cleanAirV2Eyes(c,x,y); } }
    for(let i=c.eyes.length-1;i>=0;i--){ const E=c.eyes[i]; E.t-=dt; if(E.t<=0){ c.eyes.splice(i,1); if(E.g?.active)E.g.destroy(); if(this.state!=='play')continue; const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['basic'],e=this.spawnEnemy?.(types[Math.floor(Math.random()*types.length)]); if(e){ e.setPosition(E.x,E.y); if(e.body)e.body.reset?.(E.x,E.y); this.spawnRise?.(e,E.x,E.y); } } }
    this.cleanAirV2Fog(c,[{x:P.x,y:P.y,r:lr,wob:true},...c.lit,...c.wisps.filter(w=>!w.freed).map(w=>({x:w.x,y:w.y,r:34}))],.9); }
  cleanAirV2Eyes(c,x,y){ const g=this.camWorld(this.add.graphics().setDepth(94605)); g.fillStyle(0xffe066,.95).fillCircle(x-7,y-4,3.2).fillCircle(x+7,y-4,3.2); g.fillStyle(0xff4d6d,.4).fillCircle(x-7,y-4,6).fillCircle(x+7,y-4,6); g.setAlpha(0); this.tweens.add({targets:g,alpha:1,duration:250}); c.eyes.push({x,y,t:.6,g}); }
  cleanAirV2Burst(c,x,y,R,dmg){ this.codeShock?.(x,y,R,0xbff6ff,{depth:94606,dust:14,rings:2,dur:520,flat:.8}); if(!dmg)return 0; let n=0; (this.enemies?.getChildren?.()||[]).slice().forEach(e=>{ if(!e||!e.active||e.isBoss||e.isDummy)return; const d=this.dist(e.x,e.y,x,y); if(d>R)return; const hard=e.isElite||e.isMini,a=Math.atan2(e.y-y,e.x-x); this.damage?.(e,(e.maxhp||e.hp||10)*(hard?.15:.6),e.x,e.y); if(e.active&&!hard){ e.knock=Math.max(e.knock||0,.35); e.setVelocity?.(Math.cos(a)*560,Math.sin(a)*560); } n++; }); return n; }
  cleanAirV2Free(c,o,w){ w.freed=true; w.charge=1.5; c.lit.push({x:w.x,y:w.y,r:260}); c.lantern=CA_LANTERN[0]; o.progress=Math.min(o.target,(o.progress||0)+1); this.screenFlash?.(0xe8fbff,.35,260); this.cleanAirV2Burst(c,w.x,w.y,230,true); Sfx.orderCue?.('mission_tube_pop',.45,.3);
    const su=Math.round(4+(this.stageIndex||0)*1.2); this.sugarStage=(this.sugarStage||0)+su; this.sugarRun=(this.sugarRun||0)+su; this.floatText?.(w.x,w.y-60,'🌟 '+o.progress+'/'+o.target+'  🍬+'+su,0xbff6ff); this.renderWaveObjectiveHUD?.();
    if(o.progress>=o.target){ if(c.charging){ c.charging=false; Sfx.eventLoopStop?.('event_wisp_purify_charge'); } const P=this.player; for(const q of c.wisps){ if(q.spr?.active)this.tweens.add({targets:q.spr,x:P.x,y:P.y-24,alpha:0,duration:700,ease:'Cubic.in'}); }
      if(c.darkT<=45){ const b=Math.round(su*3); this.sugarStage+=b; this.sugarRun+=b; this.floatText?.(P.x,P.y-90,'⚡ Fast clear! 🍬+'+b,0xffe08a); }
      this.time?.delayedCall?.(650,()=>{ if(this._cleanAir!==c)return; this.screenFlash?.(0xffffff,.8,420); c.phase='end'; c.t=0; }); } }
  spawnCleanAirZone(){
    const o=this.waveObjective;if(!o||o.type!=='cleanAir')return;const pos=this.objectivePosition(0,1,110,220),r=145;
    this._cleanAir={x:pos.x,y:pos.y,tx:pos.x,ty:pos.y,t:0,moveIn:3.5,r,damageIn:0};
    this._cleanAirZone=this.camWorld(this.add.circle(pos.x,pos.y,r,o.color,0.12).setStrokeStyle(3,0xe8fbff,0.45).setDepth(1));this._cleanAirZone.radiusGoal=r;
    this._cleanAirRing=this.camWorld(this.add.image(pos.x,pos.y,'vfx_ring').setTint(0xbff6ff).setDisplaySize(r*2.15,r*1.58).setAlpha(.4).setDepth(2));
    this._cleanAirWisp=this.camWorld(this.add.image(pos.x,pos.y-22,'ch2_mycelium_enemy_atlas',7).setScale(.24).setDepth(pos.y+3));
    this.tweens.add({targets:this._cleanAirRing,rotation:TAU,alpha:{from:.22,to:.42},duration:2600,repeat:-1,ease:'Linear'});
  }
  /* v8.1.79 เจ้าของ: ฟองอากาศโบนัสตามเส้นทาง · แตะฟอง = +1.5 วิ */
  cleanAirBubbles(c,o,dt){ const B=c.bub||(c.bub=[]),p=this.player; c.bt=(c.bt||0)-dt; if(c.bt<=0&&B.length<3&&Math.hypot(c.tx-c.x,c.ty-c.y)>90){ c.bt=2.2; const f=.3+Math.random()*.5,x=c.x+(c.tx-c.x)*f+(Math.random()-.5)*60,y=c.y+(c.ty-c.y)*f+(Math.random()-.5)*60,img=(this.codeBubbleOn?.()?this.camWorld(this.add.image(x,y,'code_bubble').setDisplaySize(30,30).setDepth(y+2)):null)||this.artSpr('msn71_bubble',x,y,32,0,{sig:false})||this.camWorld(this.add.circle(x,y,13,0xbff6ff,.55).setStrokeStyle(2,0xffffff,.9).setDepth(y+2)); this.tweens.add({targets:img,y:y-6,duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'}); B.push({img,life:8}); }
    for(let i=B.length-1;i>=0;i--){ const b=B[i]; b.life-=dt; const hit=p&&this.dist(p.x,p.y,b.img.x,b.img.y)<34; if(hit||b.life<=0){ if(hit){ o.progress=Math.min(o.target,o.progress+1.5); this.floatText?.(b.img.x,b.img.y-24,'+1.5s',0xbff6ff); this.burst?.(b.img.x,b.img.y,0xbff6ff); Sfx.orderCue?.('pickup_sugar_piece',.25,.05,1.3); } this.tweens.killTweensOf(b.img); b.img.destroy(); B.splice(i,1); } } }
  /* v8.1.154 เจ้าของ 🐞: Clean Air ต้องดูเป็นอากาศจริง → รอบนอกเป็นหมอกพิษฟุ้ง (ม่วงเขียว) ลอยช้า ๆ · วงของ Wisp กับทางที่จะไปโล่งสะอาด · ขอบวงเป็นปุยเมฆฟ้าขาว · ยืนนอกวง = หมอกรอบตัวหนาขึ้น */
  cleanAirFog(c,o,dt){ if(!this.add?.graphics)return 0; let g=this._cleanAirFog; if(!g||!g.scene)g=this._cleanAirFog=this.camWorld(this.add.graphics().setDepth(94000));
    const V=this.cameras?.main?.worldView||{x:c.x-400,y:c.y-500,width:800,height:1000},low=typeof PERF!=='undefined'&&PERF.lvl>=2,N=(typeof CLEANAIR_FOGWAR!=='undefined'&&CLEANAIR_FOGWAR)?0:low?12:26,F=c.fog||(c.fog=[]),R=Math.random,pad=120;
    const put=q=>{ q.x=V.x-pad+R()*(V.width+pad*2); q.y=V.y-pad+R()*(V.height+pad*2); q.r=55+R()*70; q.ph=R()*TAU; q.vx=(R()-.5)*14; q.vy=-4-R()*8; return q; };
    while(F.length<N)F.push(put({})); if(F.length>N)F.length=N;
    const segD=(x,y,x0,y0,x1,y1)=>{ const vx=x1-x0,vy=y1-y0,L=vx*vx+vy*vy||1,t=Math.max(0,Math.min(1,((x-x0)*vx+(y-y0)*vy)/L)); return Math.hypot(x-(x0+vx*t),y-(y0+vy*t)); };
    const clear=(x,y)=>{ const dz=Math.hypot(x-c.x,y-c.y)-c.r*1.05,dp=segD(x,y,c.x,c.y,c.tx??c.x,c.ty??c.y)-c.r*.55; return Math.max(0,Math.min(1,Math.min(dz,dp)/90)); };
    g.clear(); c.ft=(c.ft||0)+dt; let drawn=0;
    for(const q of F){ q.x+=q.vx*dt; q.y+=q.vy*dt; if(q.x<V.x-pad*1.5||q.x>V.x+V.width+pad*1.5||q.y<V.y-pad*1.5||q.y>V.y+V.height+pad*1.5)put(q);
      const k=clear(q.x,q.y); if(k<=0)continue; const br=1+.08*Math.sin(c.ft*.9+q.ph),a=.075*k;
      g.fillStyle(0x6b4a86,a).fillCircle(q.x,q.y,q.r*br); g.fillStyle(0x7f9a52,a*.8).fillCircle(q.x+q.r*.25,q.y-q.r*.15,q.r*.7*br); g.fillStyle(0x4a3560,a*.9).fillCircle(q.x-q.r*.2,q.y+q.r*.2,q.r*.45*br); drawn++; }
    const P=this.player; if(P&&!low&&!(typeof CLEANAIR_FOGWAR!=='undefined'&&CLEANAIR_FOGWAR)&&Math.hypot(P.x-c.x,P.y-c.y)>c.r){ for(let i=0;i<5;i++){ const an=c.ft*.6+i*TAU/5,d=60+12*Math.sin(c.ft*2+i); g.fillStyle(0x6b4a86,.09).fillCircle(P.x+Math.cos(an)*d,P.y+Math.sin(an)*d*.7,48); } }
    const n=low?8:14; for(let i=0;i<n;i++){ const an=c.ft*.35+i*TAU/n,rr=c.r*(.98+.04*Math.sin(c.ft*2+i)); g.fillStyle(0xe8fbff,.08).fillCircle(c.x+Math.cos(an)*rr,c.y+Math.sin(an)*rr,c.r*.2); g.fillStyle(0xbff6ff,.06).fillCircle(c.x+Math.cos(an+.2)*rr*.92,c.y+Math.sin(an+.2)*rr*.92,c.r*.14); }
    return drawn; }
  /* v8.1.159 เจ้าของ: Clean Air แบบป่า Wildwood (PoE) · ทั้งจอมืดเป็นหมอก · วง Wisp สว่าง · ทางที่ Wisp เดินผ่านเปิดค้างไว้ (จำจุดทุก 34px สูงสุด 320 จุด) · รอบตัวเราสว่างเล็กน้อย · RenderTexture บนกล้อง UI ใต้ HUD */
  cleanAirFogWar(c,dt,started){ if(typeof CLEANAIR_FOGWAR==='undefined'||!CLEANAIR_FOGWAR||!this.add?.renderTexture||!c)return 0; const cam=this.cameras?.main; if(!cam)return 0;
    /* v8.1.161 เจ้าของ: วงไม่ตรงกับที่สว่าง → หมอกวาดในพิกัดโลก (RenderTexture คลุมพื้นที่ที่กล้องเห็น วางตาม worldView ทุกเฟรม) ไม่ต้องแปลงพิกัด/ซูม · ก่อนเข้าวงยังสว่าง → เข้าวงแล้วมืดลงค่อย ๆ 1.6 วิ */
    const v=cam.worldView,PAD=60,VW=Math.ceil((v.width||this.W||390)+PAD*2),VH=Math.ceil((v.height||this.H||844)+PAD*2);
    let rt=this._cleanAirFogRT; if(rt&&rt.scene&&(rt.width<VW||rt.height<VH)){ rt.destroy(); rt=null; }
    if(!rt||!rt.scene){ rt=this._cleanAirFogRT=this.camWorld(this.add.renderTexture(0,0,VW+80,VH+80).setOrigin(0)); rt.setDepth?.(94500); }
    if(!this._fogBrush){ if(!this.textures.exists('fog_brush')&&typeof document!=='undefined'){ const cv=document.createElement('canvas'); cv.width=cv.height=128; const x=cv.getContext('2d'),g=x.createRadialGradient(64,64,8,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.62,'rgba(255,255,255,.92)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=g; x.fillRect(0,0,128,128); this.textures.addCanvas('fog_brush',cv); } this._fogBrush=this.make?.image?.({key:'fog_brush',add:false})?.setOrigin(.5); }
    c.dark=started?Math.min(1,(c.dark||0)+(dt||0)/1.6):0; if(c.dark<=0){ rt.setVisible?.(false); return 0; } rt.setVisible?.(true);
    const R=c.rev||(c.rev=[]); const L=R[R.length-1]; if(!L||Math.hypot(L.x-c.x,L.y-c.y)>34){ R.push({x:c.x,y:c.y,r:c.r*.95}); if(R.length>320)R.shift(); }
    const ox=v.x-PAD,oy=v.y-PAD,B=this._fogBrush; rt.setPosition?.(ox,oy); rt.clear(); rt.fill(0x0b0814,.76*c.dark); let n=0;
    const hole=(wx,wy,r)=>{ if(!B)return; const sx=wx-ox,sy=wy-oy; if(sx<-r||sy<-r||sx>VW+r||sy>VH+r)return; B.setPosition(sx,sy).setScale(r*2/128); rt.erase(B); n++; };
    for(const q of R)hole(q.x,q.y,q.r); hole(c.x,c.y,c.r*1.12); const P=this.player; if(P)hole(P.x,P.y,90); return n; }
  cleanAirPreview(c,o){ const g=this._cleanAirPath||(this._cleanAirPath=this.camWorld(this.add.graphics().setDepth(2))); if(!g.scene)return; g.clear(); const pts=[[c.x,c.y],[c.tx,c.ty],[c.nx,c.ny]],a=.35+.25*Math.sin((c.t||0)*5);
    for(let k=0;k<2;k++){ const [x0,y0]=pts[k],[x1,y1]=pts[k+1],d=Math.hypot(x1-x0,y1-y0); if(d<20)continue; const n=Math.floor(d/26); for(let i=0;i<n;i+=2){ const t0=i/n,t1=Math.min(1,(i+1)/n); g.lineStyle(5,o.color,a*(k?0.55:1)).lineBetween(x0+(x1-x0)*t0,y0+(y1-y0)*t0,x0+(x1-x0)*t1,y0+(y1-y0)*t1); } }
    g.lineStyle(3,o.color,a*.8).strokeEllipse(c.tx,c.ty,c.r*1.6,c.r*1.1); g.lineStyle(2,o.color,a*.45).strokeEllipse(c.nx,c.ny,c.r*1.2,c.r*.8); }
  tickCleanAir(dt){ if(this._cleanAir?.v2)return this.cleanAirV2Tick?.(dt,this.waveObjective);
    const o=this.waveObjective,c=this._cleanAir;if(!o||o.type!=='cleanAir'||!c)return;c.t+=dt;c.moveIn-=dt;
    if(!c.nx){const q=this.objectivePosition(0,1,210,420);c.nx=q.x;c.ny=q.y;}
    if(c.moveIn<=0){c.tx=c.nx;c.ty=c.ny;const q=this.objectivePosition(0,1,210,420);c.nx=q.x;c.ny=q.y;c.moveIn=3.5;}
    this.cleanAirPreview?.(c,o);   /* v8.1.77 โชว์ทางที่วงจะไป */
    this.cleanAirBubbles?.(c,o,dt);
    this.cleanAirFog?.(c,o,dt);   /* v8.1.154 */
    this.cleanAirFogWar?.(c,dt,true);   /* v8.1.159 */
    const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy),step=Math.min(d,82*dt);if(d>1){c.x+=dx/d*step;c.y+=dy/d*step;}
    for(const q of [this._cleanAirZone,this._cleanAirRing])if(q&&q.active)q.setPosition(c.x,c.y);if(this._cleanAirWisp&&this._cleanAirWisp.active)this._cleanAirWisp.setPosition(c.x,c.y-22+Math.sin(c.t*4)*5).setDepth(c.y+3);
    const inside=this.dist(this.player.x,this.player.y,c.x,c.y)<=c.r;o.progress=Phaser.Math.Clamp(o.progress+(inside?dt:0),0,o.target);this._cleanAirZone.setFillStyle(o.color,inside?.20:.07);
    if(!inside){c.damageIn-=dt;if(c.damageIn<=0){c.damageIn=1.15;this.hurtPlayer(Math.round(5+this.stageIndex*1.2),.35);this.vfxHitRing(this.player.x,this.player.y,0xa461d8,false);}}
    if(o.progress>=o.target)this.completeWaveObjective();
  }
  // v7.2 owner: object missions = stand close to charge (auto-attacks never target objects). Golden jars 1.2s · root anchors 2.6s
  tickProximityObjects(dt){ const p=this.player; if(!p||this.state!=='play')return; const g=(this._proxG&&this._proxG.scene)?this._proxG:(this._proxG=this.camWorld(this.add.graphics().setDepth(95005))); g.clear();
    const run=(o,R,need,done,col)=>{ if(!o||!o.active)return; const d=this.dist(o.x,o.y,p.x,p.y),near=d<R; o._pc=Math.max(0,Math.min(need,(o._pc||0)+(near?dt:-dt*0.5)));
      g.lineStyle(3,col,near?0.9:0.35); g.strokeCircle(o.x,o.y,R); if(o._pc>0){ g.lineStyle(7,0xffffff,0.95); g.beginPath(); g.arc(o.x,o.y,R-6,-Math.PI/2,-Math.PI/2+TAU*o._pc/need,false); g.strokePath(); }
      if(near&&(this._proxFx=(this._proxFx||0)+dt)>0.18){ this._proxFx=0; this.vfxHitRing?.(o.x,o.y,col,false); }
      if(o._pc>=need){ o._pc=0; done(o); } };
    const ev=this._waveEvent; if(ev&&ev.type==='cache')for(const c of ev.crates||[])run(c,105,1.2,c=>this.breakCrate(c),0xffd166);
    const pulse=((this.elapsed||0)%3)<1;   /* v8.1.79 เจ้าของ: รากเต้นเป็นจังหวะ · ตัดตอนสว่าง = เร็ว 2 เท่า · เริ่มตัดครั้งแรก = ผู้พิทักษ์โผล่ */
    if(this.waveNodes)this.waveNodes.children.iterate(n=>{ if(!(n&&n.active&&n._rootAnchor&&n._waveObjectiveNode)||n._lure)return; if(n._objectiveCue)n._objectiveCue.setTint(pulse?0xffffff:0xd56bff); if(!n._guarded&&this.dist(n.x,n.y,p.x,p.y)<140){ n._guarded=true; this.floatText?.(n.x,n.y-80,'🌿 Root guardians!',0xd56bff); for(let k=0;k<3;k++){ const e=this.spawnEnemy?.('basic'); if(e){ const a=k/3*TAU; e.setPosition(n.x+Math.cos(a)*110,n.y+Math.sin(a)*110); this.vfxSpawnPoof?.(e.x,e.y); } } } run(n,140,pulse?1.3:2.6,n=>this.destroyWaveObjectiveNode(n),pulse?0xffffff:0xd56bff); }); }
  /* ---- v8.2.8 🐛 Lure the Crown Root (เจ้าของอนุมัติ: เปลี่ยน "ยืน" เป็น "ล่อ") ----
     หัวรากมุดดินไล่ผู้เล่น (ช้ากว่าผู้เล่น) · ใกล้ ≤150 หรือครบ 4 วิ → ล็อกจุดที่ผู้เล่นยืน · รอยแตกเตือน 0.9 วิ → พุ่งขึ้น: โดนผู้เล่นเจ็บ · หินสมอในรัศมี 95 แตก
     หินกันกระสุน (_coreLocked) และไม่ตัดด้วยการยืน (_lure) · แตกครบ 3 ก้อน = รากติดระเบิด จบภารกิจ */
  /* v8.2.81 เจ้าของ: Lure the Crown Root จืด → SCAMPER 1–4 · (1) ยิ่งแตกยิ่งโหด: เร็วขึ้น เตือนสั้นลง หินก้อน 2 แตก = รากแยก 2 หัว · ล็อกเร็ว (ไม่รอ 4 วิ)
     (2) วงเตือนดูดมอนเข้ามา · รากฟาดฆ่ามอนธรรมดา = คอมโบ 🍬 · (3) อยู่ในวงช่วงท้ายแล้วหลบออกทัน = Perfect Dodge (เวลาหยุดวูบ · รากติดดินนานขึ้น)
     (4) หินก้อนสุดท้ายแตก → หัวรากมงกุฎติดพื้น 8 วิ รุมตีได้ · เลือดลดทุก 10% = 🍬 เด้ง · ตายหรือหมดเวลา = ระเบิด จบภารกิจ */
  /* v8.2.86 ใบ 94/95: ตัวช่วยวางภาพ (มีภาพ = ใช้ · ไม่มี = คืน null ให้ผู้เรียกใช้ภาพที่โค้ดวาดเดิม) */
  a94Once(key,x,y,px,o={}){ if(!this.realTex?.(key))return null; const fd=ASSET_FX[key]||{}; return this.spawnFxAnim?.(key,x,y,{normal:true,force:true,scale:px/Math.max(fd.fw||256,fd.fh||256),depth:o.depth??(y+3),anchor:fd.anchor==='feet'?'bottom':'center',rotation:o.rot})||null; }
  a94Loop(key,x,y,px,o={}){ if(!this.realTex?.(key))return null; const s=this.artSpr?.(key,x,y,px,0,{feet:(ASSET_FX[key]||{}).anchor==='feet'}); if(s&&o.depth!=null)s.setDepth(o.depth); return s||null; }
  a94Badge(key,x,y,w){ if(!this.realTex?.(key)||!this.add?.sprite)return null; const fd=ASSET_FX[key]||{}; if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:(fd.frames||6)-1}),frameRate:fd.rate||20,repeat:0});
    const s=this.camWorld(this.add.sprite(x,y,key,0).setScale(w/(fd.fw||256)).setDepth(90090)); s.play(key); this.tweens?.add?.({targets:s,y:y-30,alpha:0,delay:850,duration:300,onComplete:()=>s.destroy()}); return s; }
  crownRootHead(x,y){ return {x,y,st:'burrow',t:0,tx:0,ty:0,trail:[],close:false,g:this.camWorld(this.add.graphics().setDepth(90020))}; }
  spawnCrownRoot(o){ this.clearCrownRoot(); const q=this.objectivePosition(0,1,380,520);
    this.waveNodes?.children?.iterate?.(n=>{ if(n&&n.active&&n._rootAnchor){ n._lure=true; n._coreLocked=true; n._objectiveCue?.setTint?.(0xc9a27a); } });
    this._lure=this.crownRootHead(q.x,q.y); this._lure.heads=[this._lure]; this.floatText?.(q.x,q.y-50,'🐛 The root is coming!',0xd56bff); }
  clearCrownRoot(){ if(typeof Sfx!=='undefined')Sfx.eventLoopStop?.('a22_root_burrow'); const L=this._lure; if(!L)return; if(typeof VoiceActing!=='undefined'){VoiceActing.stop(L);for(const h of L.heads||[L])VoiceActing.stop(h);} this._lure=null; for(const h of (L.heads||[L]))if(h.g?.active)h.g.destroy(); const F=L.fin; if(F?.e?.active&&F.e._crownHead){ F.e._timeStop=false; F.e._crownHead=false; } }
  crownRootSplit(o){ const L=this._lure; if(!L||L.heads.length>1||L.fin)return; const P=this.player,a=Math.random()*Math.PI*2,h=this.crownRootHead(P.x+Math.cos(a)*420,P.y+Math.sin(a)*420); h.t=-1.2; L.heads.push(h); this.floatText?.(h.x,h.y-50,'🐛🐛 The root splits!',0xd56bff); this.screenShake?.(180,.007); }
  tickCrownRoot(dt,o){ const L=this._lure,P=this.player; if(!L||!P)return; if(L.fin){ this.crownRootFinTick(dt,o); return; } for(const h of L.heads)this.crownRootTickHead(h,dt,o); this.a22RootLoop?.(); }
  crownRootTickHead(L,dt,o){ const P=this.player,play=this.state==='play'&&!o.done; L.t+=dt; const si=this.stageIndex||0,k=Math.max(0,Math.floor(o.progress||0)),warn=Math.max(CR_WARN[2],CR_WARN[0]-CR_WARN[1]*k);
    if(play){ if(L.st==='burrow'){ if(L.t<0){ this.drawCrownRoot(L); return; } const d=this.dist(L.x,L.y,P.x,P.y),sp=(165+si*4)*(1+CR_ESC_SPD*k); if(d>1){ L.x+=(P.x-L.x)/d*Math.min(d,sp*dt); L.y+=(P.y-L.y)/d*Math.min(d,sp*dt); } L.trail.push({x:L.x,y:L.y,a:1}); if(L.trail.length>18)L.trail.shift();
        if(d<CR_LOCK_D||L.t>CR_LOCK_T){ L.st='warn'; L.t=0; L.tx=P.x; L.ty=P.y; L.close=false; L.warn=warn; this.a94Once?.('cr94_warn_crack',L.tx,L.ty,150,{depth:L.ty-2}); this.a12?.('a22_root_warn',.38,.18)||Sfx.orderCue?.('wave_start',.3,.4); } }
      else if(L.st==='warn'){ const kk=Math.min(1,dt*7); L.x+=(L.tx-L.x)*kk; L.y+=(L.ty-L.y)*kk;
        (this.enemies?.getChildren?.()||[]).forEach(e=>{ if(!e||!e.active||e.isBoss||e.isMini||e.isElite||e.isDummy)return; const d=this.dist(e.x,e.y,L.tx,L.ty); if(d>CR_PULL_R||d<20)return; e.knock=Math.max(e.knock||0,.08); e.setVelocity?.((L.tx-e.x)/d*150,(L.ty-e.y)/d*150); });   /* (2) วงดูดมอน */
        if(L.t>=L.warn-CR_PERFECT&&this.dist(P.x,P.y,L.tx,L.ty)<75)L.close=true;
        if(L.t>=L.warn){ L.st='strike'; L.t=0; L.hold=.75; this.crownRootStrike(L,o); } }
      else if(L.st==='strike'&&L.t>=(L.hold||.75)){ L.st='burrow'; L.t=0; } }
    for(const q of L.trail)q.a=Math.max(0,q.a-dt*1.6); this.drawCrownRoot(L); }
  crownRootStrike(L,o){ const x=L.tx,y=L.ty,P=this.player,si=this.stageIndex||0; this.a12?.('a22_root_strike',.44,.15); L._strikeArt=!!this.a94Once?.('cr94_strike',x,y+10,120,{depth:y+6}); this.screenShake?.(220,.01); this.hitStop?.(40); this.burst?.(x,y,0x8a5a3a);
    if(this.add?.circle)for(let k=0;k<2;k++){ const r=this.camWorld(this.add.circle(x,y,30,0xd56bff,0).setStrokeStyle(7-k*2,0xffd0ff,1).setDepth(90000)); this.tweens.add({targets:r,scale:4+k*1.5,alpha:0,duration:480,delay:k*70,ease:'Cubic.out',onComplete:()=>r.destroy()}); }
    const out=!P||this.dist(P.x,P.y,x,y)>=75; if(!out)this.hurtPlayer?.(Math.round(10+si*1.6));
    else if(L.close){ this.a12?.('a22_perfect_dodge',.38,.2); this.a22Voice?.('vo_ruby_perfect',()=>!!this._lure&&!o.done,L,'perfect'); L.hold=1.6; this.hitStop?.(140); this.screenFlash?.(0xe0b3ff,.35,220); const b=3; this.sugarStage=(this.sugarStage||0)+b; this.sugarRun=(this.sugarRun||0)+b; this.a94Badge?.('fb94_perfect_badge',P.x,P.y-80,170); this.floatText?.(P.x,P.y-80,'✨ Perfect dodge! 🍬+'+b,0xffe08a); }   /* (3) */
    let n=0; (this.enemies?.getChildren?.()||[]).slice().forEach(e=>{ if(!e||!e.active||e.isBoss||e.isDummy||e._crownHead||this.dist(e.x,e.y,x,y)>=CR_HIT_R)return; const hard=e.isElite||e.isMini; this.damage?.(e,(e.maxhp||20)*(hard?.3:1.2),e.x,e.y); if(!hard&&(!e.active||e.hp<=0))n++; });
    if(n>=2){ this.a12?.('a22_root_combo',.3,.16); const b=n; this.sugarStage=(this.sugarStage||0)+b; this.sugarRun=(this.sugarRun||0)+b; this.a94Badge?.('fb94_combo_badge',x,y-110,170); this.floatText?.(x,y-110,'🐛 Root combo ×'+n+'  🍬+'+b,0xd56bff); }   /* (2) คอมโบ */
    let hit=null; this.waveNodes?.children?.iterate?.(n=>{ if(!hit&&n&&n.active&&n._lure&&n._waveObjectiveNode&&this.dist(n.x,n.y,x,y)<95)hit=n; });
    if(hit){ this.a12?.('a22_anchor_break',.42,.16); const hx=hit.x,hy=hit.y; this.a94Once?.('cr94_anchor_break',hx,hy,140); this.floatText?.(hx,hy-70,'💥 Anchor smashed!',0xffd166); this.screenFlash?.(0xffe0a0,.3,240); this.destroyWaveObjectiveNode(hit);
      if(!this._lure?.fin&&(o.progress||0)>=2)this.crownRootSplit(o); }   /* (1) ก้อนที่ 2 แตก = แยก 2 หัว */
    if(this.renderWaveObjectiveHUD)this.renderWaveObjectiveHUD(); }
  crownRootFinale(x,y,o){ const L=this._lure; if(!L||L.fin)return false; if(typeof Sfx!=='undefined')Sfx.eventLoopStop?.('a22_root_burrow'); this.a22Voice?.('vo_ruby_crown_stuck',()=>this._lure===L&&!o.done,L); for(const h of L.heads){ h.st='gone'; h.g?.clear?.(); }
    const P=this.player,e=this.spawnEnemy?.('tank',Math.atan2(y-(P?.y||0),x-(P?.x||0)),Math.max(60,P?this.dist(P.x,P.y,x,y):200)); const F=L.fin={x,y,t:CR_STUCK,last:1,e:null,pops:0};
    if(e){ e.setPosition?.(x,y); if(e.body)e.body.reset?.(x,y); e._crownHead=true; e._timeStop=true; e.hp=Math.round((e.maxhp||e.hp||100)*CR_HEAD_HP); e.maxhp=e.hp; e.setScale?.((e.scaleX||1)*1.7,(e.scaleY||1)*1.7); if(this.realTex?.('cr94_crown_head')&&this.artFollow?.(e,'cr94_crown_head',130)){ e.clearTint?.(); e.tintColor=null; } else { e.tintColor=0xd56bff; e.setTint?.(0xd56bff); } this.emergeFoe?.(e,'ground'); F.e=e; F.lastHp=e.hp; }   /* v8.2.86 ใบ 94 หัวรากมงกุฎ */
    this.screenShake?.(380,.014); this.screenFlash?.(0xd56bff,.45,320); this.showBanner?.('👑 The Crown Root is stuck!','Hit it before it breaks free',1600); this.floatText?.(x,y-110,'👑 Hit the Crown Root!',0xffd166); return true; }   /* (4) */
  crownRootFinTick(dt,o){ const L=this._lure,F=L.fin,e=F.e,si=this.stageIndex||0; if(this.state!=='play')return; F.t-=dt; const g=L.g;
    if(g?.active){ g.clear(); const t=(this.time?.now||0)/1000; for(let i=0;i<5;i++){ const a=-Math.PI/2+(i-2)*.32,h=80+i%2*30+Math.sin(t*6+i)*6; g.lineStyle(14-Math.abs(i-2)*3,0x6b3f22,1); g.beginPath(); g.moveTo(F.x+(i-2)*12,F.y+8); g.lineTo(F.x+(i-2)*12+Math.cos(a)*h*.5,F.y+8+Math.sin(a)*h); g.strokePath(); } g.lineStyle(4,0xffd166,.6+.3*Math.sin(t*8)); g.beginPath(); g.arc(F.x,F.y,70,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,F.t/CR_STUCK),false); g.strokePath(); }
    const alive=!!(e&&e.active&&e._crownHead&&e.hp>0),frac=alive?e.hp/Math.max(1,e.maxhp):0;
    if(alive&&e.hp<(F.lastHp??e.hp)&&(this.time?.now||0)-(F.hurtAt||0)>300){ F.hurtAt=this.time?.now||0; if(typeof Sfx!=='undefined')Sfx.a21?.('hit_plant',.22,.1)||Sfx.pop?.(); this.a94Once?.('cr94_crown_hurt',e.x,e.y+8,130,{depth:e.y+20}); } if(alive)F.lastHp=e.hp;
    while(F.last-frac>=CR_HEAD_POP-1e-9&&F.last>0){ F.last-=CR_HEAD_POP; F.pops++; const v=Math.round(2+si*.4); this.sugarStage=(this.sugarStage||0)+v; this.sugarRun=(this.sugarRun||0)+v; this.floatText?.(F.x+Phaser.Math.Between(-40,40),F.y-90-F.pops*4,'🍬+'+v,0xffe08a); this.burst?.(F.x,F.y-30,0xffd166); }
    if(alive&&F.t>0)return;
    if(alive){ e._timeStop=false; e._crownHead=false; e._emergeUntil=0; this.damage?.(e,e.hp+1,e.x,e.y); if(e.active&&e.hp>0)this.killEnemy?.(e); }
    this.a12?.('a22_head_burst',.48,.4); this.a94Once?.('cr94_crown_burst',F.x,F.y,240); this.captureFinishSweep?.(F.x,F.y,240); this.screenShake?.(420,.014); this.screenFlash?.(0xd56bff,.6,420); this.floatText?.(F.x,F.y-90,alive?'🐛 The root bursts!':'👑 Crown Root smashed!',0xd56bff);
    o._crownFinDone=true; this.clearCrownRoot(); this.completeWaveObjective(); }
  drawCrownRoot(L){ const g=L.g; if(!g?.active)return;
    if(this.realTex?.('cr94_burrow')&&L.st!=='gone'){ if(!L.spr?.active){ L.spr=this.a94Loop('cr94_burrow',L.x,L.y,64); if(L.spr)g.once?.('destroy',()=>L.spr?.destroy?.()); } const show=L.st==='burrow'||L.st==='warn'; if(L.spr){ L.spr.setPosition(L.x,L.y+8).setDepth(L.y+4).setVisible(show&&!(L.t<0&&L.st==='burrow')); }
      g.clear(); for(const q of L.trail)if(q.a>0){ g.fillStyle(0x5a3a22,.35*q.a).fillEllipse(q.x,q.y+6,26,10); } if(L.st==='strike'&&!L._strikeArt){} else return; }   /* v8.2.86 ใบ 94: หัวรากมุด/รอยเตือน/รากพุ่ง = ภาพจริง */
    if(L.spr?.active&&L.st==='gone')L.spr.setVisible(false); g.clear(); const t=(this.time?.now||0)/1000;
    for(const q of L.trail)if(q.a>0){ g.fillStyle(0x5a3a22,.35*q.a).fillEllipse(q.x,q.y+6,26,10); }
    if(L.st==='burrow'||L.st==='warn'){ const bob=Math.sin(t*14)*2; g.fillStyle(0x3a2414,.9).fillEllipse(L.x,L.y+4,46,20); g.fillStyle(0x7a5232,1).fillEllipse(L.x,L.y+bob,34,16); g.fillStyle(0xd56bff,.5+.3*Math.sin(t*9)).fillCircle(L.x,L.y-4+bob,4); }
    if(L.st==='warn'){ const k=Math.min(1,L.t/.9),r=30+60*k; g.lineStyle(3,0xff4d6d,.5+.5*k); for(let i=0;i<7;i++){ const a=i/7*Math.PI*2+.3; g.beginPath(); g.moveTo(L.tx,L.ty); g.lineTo(L.tx+Math.cos(a)*r*.55,L.ty+Math.sin(a)*r*.35+3); g.lineTo(L.tx+Math.cos(a+.15)*r,L.ty+Math.sin(a+.15)*r*.6); g.strokePath(); } g.lineStyle(2,0xff4d6d,.3+.4*k).strokeEllipse(L.tx,L.ty,150,84); }
    if(L.st==='strike'){ const k=Math.min(1,L.t/.12),f=L.t>.5?Math.max(0,1-(L.t-.5)/.25):1; for(let i=0;i<5;i++){ const a=-Math.PI/2+(i-2)*.32,h=(70+i%2*30)*k*f; g.lineStyle(14-Math.abs(i-2)*3,0x6b3f22,1); g.beginPath(); g.moveTo(L.tx+(i-2)*10,L.ty+4); g.lineTo(L.tx+(i-2)*10+Math.cos(a)*h*.5,L.ty+Math.sin(a)*h); g.strokePath(); g.lineStyle(3,0xd56bff,.8); g.beginPath(); g.moveTo(L.tx+(i-2)*10,L.ty); g.lineTo(L.tx+(i-2)*10+Math.cos(a)*h*.45,L.ty+Math.sin(a)*h*.9); g.strokePath(); } g.fillStyle(0x2a1810,.8*f).fillEllipse(L.tx,L.ty+6,90,30); } }
  spawnRootAnchors(n=4){
    const o=this.waveObjective;if(!o||o.type!=='breakRoots')return;for(let i=0;i<n;i++){const p=this.objectivePosition(i,n,285,440),painted=this.textures.exists('objective_root_anchor'),key=painted?'objective_root_anchor':'ch2_root_enemy_atlas';let node=this.waveNodes.getFirstDead(false);if(!node)node=this.waveNodes.create(p.x,p.y,key,painted?undefined:7);else{node.setTexture(key,painted?undefined:7).setActive(true).setVisible(true).setPosition(p.x,p.y);if(node.body)node.body.enable=true;}if(!node)continue;
      node.hp=150*(1+(this.stageDiff||1)*.18);node.maxhp=node.hp;node._waveObjectiveNode=true;node._rootAnchor=true;node._coreLocked=false;node._lure=false;node.setScale(painted?.9:.48).setDepth(node.y+1);this.camWorld(node);if(node.body){node.body.setAllowGravity(false);node.body.setImmovable(true);node.body.setCircle(48,painted?16:80,painted?16:78);}
      node._objectiveCue=this.camWorld(this.add.image(node.x,node.y,'vfx_ring').setTint(0xd56bff).setDepth(node.y).setDisplaySize(145,110).setAlpha(.62));this.tweens.add({targets:node._objectiveCue,rotation:TAU,alpha:{from:.38,to:.78},duration:1350+i*120,yoyo:true,repeat:-1,ease:'Sine.inOut'});this.vfxSpawnPoof(node.x,node.y);
    }
  }
  tickRootThrone(dt){
    if(this.stageIndex!==9||!['wave','mini','boss'].includes(this.mode))return;if(!this._rootThrone)this._rootThrone={t:4.5,pulse:0};const r=this._rootThrone;r.t-=dt;if(r.t>0)return;r.pulse++;r.t=this.mode==='boss'?7.8:10.5;
    if(r.pulse%2){this.showBanner('🌳 Throne Pulse','The living floor erupts in three delayed root marks',650);for(let i=0;i<3;i++){const a=i*TAU/3+Math.random()*.6,d=Phaser.Math.Between(85,185);this.spawnHazard(this.player.x+Math.cos(a)*d,this.player.y+Math.sin(a)*d,60,Math.round(12+this.stageIndex*2.2),0xd56bff);}}
    else{this.showBanner('👑 Crown Recall','The throne pulls every memory toward its first root',650);this.drainPull={x:0,y:0,t:2.0,strength:this.mode==='boss'?125:90};if(this.mode==='wave'&&this.enemies.countActive(true)<this.maxLive-2)this.spawnEnemy('siege');}
  }

  seasonInfo(i){
    return [
      {name:'Spring Renewal',emoji:'🌸',color:0xff9fcf,sub:'The garden restores its wounded creatures'},
      {name:'Summer Flare',emoji:'☀️',color:0xffb12b,sub:'Solar warnings ignite around your path'},
      {name:'Autumn Rush',emoji:'🍂',color:0xff7040,sub:'Leafblades sweep in from changing lanes'},
      {name:'Winter Crown',emoji:'❄️',color:0x8fdcff,sub:'Frost volleys close from the arena rim'}
    ][i&3];
  }
  /* v7.8.32 อาร์ตใบสั่ง 19: sprite VFX ด่าน C2-4 · ไม่มีภาพ = null (ใช้ภาพโค้ดเดิม) · keep=ค้าง (คนเรียกต้องลบเอง) · ui=ติดจอ */
  c24Fx(key,x,y,w,o={}){const fd=ASSET_FX[key];if(!fd||!this.add||!this.realTex?.(key))return null;if(!o.must&&(this.fxOk?.()===false||(this._c24Live||0)>=40))return null;
    if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:fd.frames-1}),frameRate:fd.rate,repeat:fd.loop?-1:0});
    const s=this.add.sprite(x,y,key,0);if(o.ui){s.setScrollFactor(1);this.camUI(s);}else this.camWorld(s);s.setDepth(o.depth??90380).setOrigin(fd.anchor==='left'?0:.5,.5).setDisplaySize(w,o.h??w*fd.fh/fd.fw);
    if(o.rot!=null)s.setRotation(o.rot);if(o.tint!=null)s.setTint(o.tint);if(o.alpha!=null)s.setAlpha(o.alpha);s.play(key);this.trackArtVfx(s);this._c24Live=(this._c24Live||0)+1;s.once('destroy',()=>{this._c24Live--;this._c24Keep?.delete(s);});
    if(o.keep){(this._c24Keep||(this._c24Keep=new Set())).add(s);}else if(o.life>0)this.time.delayedCall(o.life*1000,()=>{if(s.active)this.tweens.add({targets:s,alpha:0,duration:220,onComplete:()=>s.destroy()});});else if(!fd.loop)s.once('animationcomplete',()=>s.destroy());return s;}
  c24Drop(s){if(s?.active)s.destroy();return null;}
  c24ClearCur(c){if(!c)return;c.burn=this.c24Drop(c.burn);for(const L of c.lines||[])L.s=this.c24Drop(L.s);for(const P of c.patches||[])P.s=this.c24Drop(P.s);}
  c24HealFx(n){const wv=this.cameras?.main?.worldView;let k=0;this.enemies.children.iterate(e=>{if(k>=n||!e||!e.active||e.isBoss||e.isMini||(wv&&!wv.contains(e.x,e.y)))return;k++;this.c24Fx('vfx_c24_spring_heal',e.x,e.y-10,64);});}
  c24Bullet(b,key){if(!b||!this.realTex?.(key))return b;b.setTexture(key,0);if(this.anims.exists(key+'_walk'))b.play(key+'_walk');return b;}
  /* v8.3.26 เจ้าของ: Seasonal Harvest = Environment Event · ด่าน 10+ (หลัง C2-4) สุ่ม 1 ฤดู ใน 1 เวฟ (ไม่ใช่เวฟมินิบอส) · ผลเดิมของ C2-4 ทุก 10 วิ · จบเวฟ = จบ */
  seasonEnvPick(i){ this._seasonEnv=null; const st=STAGES[i]; if(!this._v83Run||!st||i<SEASON_ENV_FROM||Math.random()>=SEASON_ENV_CHANCE)return; const ws=[];for(let w=0;w<(st.waves||5);w++)if(w!==st.miniAt)ws.push(w); this._seasonEnv={wave:ws[Math.floor(Math.random()*ws.length)],idx:Math.floor(Math.random()*4),t:3,on:false,done:false}; }
  tickSeasonEnv(dt){ const E=this._seasonEnv; if(!E||E.done||this.mode!=='wave')return; if(this.waveIndex>E.wave){ if(E.on)this.seasonEnvEnd(); E.done=true; return; } if(this.waveIndex!==E.wave)return; const info=this.seasonInfo(E.idx);
    if(!E.on){ E.on=true; this.showBanner?.('🌦️ '+info.emoji+' '+info.name,'A season sweeps the stage this wave',1800); this.screenFlash?.(info.color,.2,400); E.ov=this.camUI?.(this.add.rectangle(0,0,this.W,this.H,info.color,.07).setOrigin(0).setScrollFactor(1).setDepth(40)); }
    E.t-=dt; if(E.t>0)return; E.t=SEASON_ENV_EVERY; this.seasonEffect(E.idx,info); }
  seasonEnvEnd(){ const E=this._seasonEnv; if(!E)return; E.ov?.destroy?.(); E.ov=null; if(E.on)this.floatText?.(this.player?.x||0,(this.player?.y||0)-70,'The season passes',0xcfc6dc); }
  seasonEffect(idx,info){ const P=this.player; if(!P)return; if(!this.c24Fx?.(['vfx_c24_season_shift_spring','vfx_c24_season_shift_summer','vfx_c24_season_shift_autumn','vfx_c24_season_shift_winter'][idx],this.W/2,this.H/2,this.W,{ui:true,h:this.H,depth:81,must:true}))this.screenFlash?.(info.color,.14,300);
    if(idx===0){this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini)e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.055);});this.c24HealFx?.(5);}
    else if(idx===1){for(let i=0;i<3;i++){const a=i*TAU/3+Math.random()*.5;this.spawnHazard?.(P.x+Math.cos(a)*Phaser.Math.Between(80,175),P.y+Math.sin(a)*Phaser.Math.Between(80,175),58,Math.round(10+this.stageIndex*2.1),info.color);}}
    else if(idx===2){if(this.enemies.countActive(true)<this.maxLive-3)for(let i=0;i<2;i++)this.spawnEnemy('dasher',Math.random()*TAU,Math.max(this.W,this.H)/(this.viewZoom||1)*.58);}
    else {const n=10,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;const a=i*TAU/n,x=P.x+Math.cos(a)*260,y=P.y+Math.sin(a)*260;this.foeShot?.(x,y,a+Math.PI,230,Math.round(9+this.stageIndex*1.7),info.color,.96);}} }
  tickSeasonArena(dt){
    if(this._c24Keep?.size&&!(this.waveObjective?.type==='seasonCycle'&&this.waveObjective.storm&&!this.waveObjective.done))for(const k of [...this._c24Keep])k.destroy();
    if(this.stageIndex!==8||!['wave','mini','boss'].includes(this.mode))return;
    if(!this._seasonState)this._seasonState={idx:0,t:2.5,cycle:0};const s=this._seasonState;s.t-=dt;if(s.t>0)return;
    s.idx=(s.idx+1)%4;s.cycle++;s.t=this.mode==='boss'?8.2:10.0;const info=this.seasonInfo(s.idx);this.showBanner(info.emoji+' '+info.name,info.sub,720);if(!this.c24Fx(['vfx_c24_season_shift_spring','vfx_c24_season_shift_summer','vfx_c24_season_shift_autumn','vfx_c24_season_shift_winter'][s.idx],this.W/2,this.H/2,this.W,{ui:true,h:this.H,depth:81,must:true}))this.screenFlash(info.color,.16,320);
    if(s.idx===0){this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini)e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.055);});this.c24HealFx(5);}
    const storm=this.waveObjective&&this.waveObjective.type==='seasonCycle';
    if(storm)return;
    else if(s.idx===1){for(let i=0;i<3;i++){const a=i*TAU/3+Math.random()*.5;this.spawnHazard(this.player.x+Math.cos(a)*Phaser.Math.Between(80,175),this.player.y+Math.sin(a)*Phaser.Math.Between(80,175),58,Math.round(10+this.stageIndex*2.1),info.color);}}
    else if(s.idx===2&&this.mode==='wave'&&this.enemies.countActive(true)<this.maxLive-3){for(let i=0;i<2;i++)this.spawnEnemy('dasher',Math.random()*TAU,Math.max(this.W,this.H)/this.viewZoom*.58);}
    else if(s.idx===3){const n=10,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;const a=i*TAU/n,x=this.player.x+Math.cos(a)*260,y=this.player.y+Math.sin(a)*260;this.foeShot(x,y,a+Math.PI,230,Math.round(9+this.stageIndex*1.7),info.color,.96);}}
  }
  // v6.0.73: Season Storm — แต่ละฤดูมีภัยต่างกัน ผ่านเงื่อนไขของฤดูนั้น = ✓ (ครบ 4 = จบ) · ไม่ผ่านไม่เสียอะไร รอรอบถัดไป
  spawnSeasonSanctuaries(){
    const o=this.waveObjective;if(!o||o.type!=='seasonCycle')return;this._seasonShrines=null;if(!this._seasonState)this._seasonState={idx:0,t:2.5,cycle:0};
    if(!this.objNodeG){this.objNodeG=this.add.graphics().setScrollFactor(1).setDepth(90040);this.camWorld(this.objNodeG);}
    o.storm={passed:[false,false,false,false],cur:null,harvest:[0,0,0,0]}; this.stormBeginSeason(o,this._seasonState.idx,true); this.time.delayedCall(1700,()=>{ if(this.waveObjective===o&&!o.done)this.showBanner('🌦️ Seasonal Harvest','Seasons change every 10s · defeated monsters drop petals of the current season · fill all four',3200); }); }
  // v7.8.55 Seasonal Harvest: กลีบเข้าฤดูปัจจุบัน (Elite = 3) · ฤดูนี้เต็มแล้ว → ล้นไปฤดูที่ขาดมากสุดครึ่งเดียว ไม่ต้องรอ · ครบ 4 = จบ
  /* v8.1.79 เจ้าของ: กลีบตกที่พื้น ต้องเดินไปเก็บ (เดิมบินเข้าตัวเอง) · ศาล 4 ฤดู ยืน 1 วิ = เปลี่ยนเป็นฤดูนั้น */
  seasonDropPetal(o,e){ const D=o.storm.drops||(o.storm.drops=[]); if(D.length>=24){ const d=D.shift(); d.img?.destroy(); } const idx=this._seasonState?.idx??0,info=this.seasonInfo(idx),key=this.textures?.exists?.('sakura_petal')?'sakura_petal':null;
    const img=this.artSpr('msn71_petals',e.x,e.y,28,idx%4,{sig:false})||this.camWorld(key?this.add.image(e.x,e.y,key).setTint(info.color).setScale(.9):this.add.circle(e.x,e.y,9,info.color,.95)); img.setDepth(e.y+2); this.tweens?.add({targets:img,angle:{from:-15,to:15},duration:600,yoyo:true,repeat:-1}); D.push({x:e.x,y:e.y,idx,elite:!!e.isElite,img,life:14}); return false; }
  seasonPetalTick(o,dt){ const D=o.storm?.drops; if(!D||!D.length)return false; const p=this.player; for(let i=D.length-1;i>=0;i--){ const d=D[i]; d.life-=dt; const dd=this.dist(p.x,p.y,d.x,d.y); if(dd<110&&dd>1){ const k=Math.min(dd,380*dt); d.x+=(p.x-d.x)/dd*k; d.y+=(p.y-d.y)/dd*k; d.img.setPosition(d.x,d.y); }
      if(dd<36){ d.img.destroy(); D.splice(i,1); if(this.seasonHarvest(o,{isElite:d.elite,x:d.x,y:d.y},d.idx))return true; } else if(d.life<=0){ d.img.destroy(); D.splice(i,1); } } return false; }
  seasonShrineTick(o,dt){ const st=o.storm; if(!st.shrines){ st.shrines=[0,1,2,3].map(k=>{ const q=this.objectivePosition(k,4,230,330),info=this.seasonInfo(k); return {k,x:q.x,y:q.y,pc:0,ring:this.camWorld(this.add.circle(q.x,q.y,58,info.color,.12).setStrokeStyle(3,info.color,.8).setDepth(q.y-2)),t:this.artSpr('msn71_season_shrines',q.x,q.y+40,110,k,{sig:false})||this.camWorld(this.add.text(q.x,q.y,info.emoji,{fontSize:'30px'}).setOrigin(.5).setDepth(q.y+4))}; }); }
    const S=this._seasonState; if(!S)return; for(const sh of st.shrines){ const done=st.passed[sh.k],cur=S.idx===sh.k; sh.ring.setAlpha(done?.25:cur?1:.75); sh.t.setAlpha(done?.35:1); if(done||cur){ sh.pc=0; continue; } const near=this.dist(this.player.x,this.player.y,sh.x,sh.y)<58; sh.pc=near?sh.pc+dt:0;
      if(sh.pc>=1){ sh.pc=0; S.idx=sh.k; S.t=10; const info=this.seasonInfo(sh.k); this.showBanner?.(info.emoji+' '+info.name,'You called this season',900); this.screenFlash?.(info.color,.14,200); } } }
  seasonHarvest(o,e,forceIdx){ if(forceIdx==null&&o.storm&&o.storm.harvest)return this.seasonDropPetal(o,e); const H=o.storm.harvest,idx=forceIdx??(this._seasonState?.idx??0);let k=idx,amt=e.isElite?3:1;
    if(H[k]>=SEASON_PETALS){k=-1;let lo=1e9;for(let j=0;j<4;j++)if(H[j]<SEASON_PETALS&&H[j]<lo){lo=H[j];k=j;}if(k<0)return false;o._spill=(o._spill||0)+amt*.5;amt=Math.floor(o._spill);o._spill-=amt;if(!amt)return false;}
    H[k]=Math.min(SEASON_PETALS,H[k]+amt);const info=this.seasonInfo(k);
    if(forceIdx==null&&this.add&&this.textures?.exists?.('sakura_petal')&&this.player){const p=this.camWorld(this.add.image(e.x,e.y,'sakura_petal').setTint(info.color).setDepth(90300).setScale(.7));this.tweens.add({targets:p,x:this.player.x,y:this.player.y-30,scale:.3,alpha:.2,duration:420,ease:'Quad.in',onComplete:()=>p.destroy()});} else if(forceIdx!=null)this.burst?.(e.x,e.y,info.color);
    if(H[k]>=SEASON_PETALS&&!o.storm.passed[k]){o.storm.passed[k]=true;this.c24Fx?.('vfx_c24_trial_pass',this.player.x,this.player.y,190,{tint:info.color});this.floatText?.(this.player.x,this.player.y-60,info.emoji+' '+info.name.split(' ')[0]+' harvest full!',info.color);this.screenFlash?.(info.color,.18,240);Sfx.clear&&Sfx.clear();}
    o.progress=H.reduce((s,v)=>s+Math.min(SEASON_PETALS,v),0)/SEASON_PETALS;this.renderWaveObjectiveHUD();
    if(o.storm.passed.every(Boolean)){o.progress=o.target;this.completeWaveObjective();return true;}
    return false; }
  stormRule(i,o){ const f=o?.storm?.fails?.[i&3]||0,r=[{goal:'Defeat 10 — they heal!',need:10},{goal:'Keep moving — standing still burns',max:1},{goal:'Dodge the leaf gusts',max:1},{goal:'Dodge the frost patches on the ice',max:1}][i&3];   /* v7.8.53 เจ้าของ: C2-4 ค้าง — ทดสอบที่พลาดง่ายขึ้นทุกรอบ (โดนได้ +1 / ฆ่าน้อยลง 3) จบได้แน่นอน */
    return r.need?{...r,need:Math.max(4,r.need-3*f),goal:'Defeat '+Math.max(4,r.need-3*f)+' — they heal!'}:{...r,max:r.max+f}; }
  stormBeginSeason(o,idx,partial){ this.c24ClearCur(o.storm.cur);o.storm.cur={idx,kills:0,hits:0,still:0,ev:1.2,lines:[],patches:[],partial:!!partial,windA:Math.random()*TAU,regen:0};
    if(!partial&&!o.storm.passed[idx]){const info=this.seasonInfo(idx);this.showBanner(info.emoji+' '+info.name,'Defeat monsters to collect '+info.name.split(' ')[0]+' petals · '+(o.storm.harvest?.[idx]||0)+'/'+SEASON_PETALS,1300);} }
  stormEndSeason(o){ if(o.storm.harvest)return;   /* v7.8.55 Harvest: ไม่มีผ่าน/ไม่ผ่านตอนจบฤดู */ const c=o.storm.cur;if(!c||c.partial||o.storm.passed[c.idx])return;const r=this.stormRule(c.idx,o),ok=r.need?c.kills>=r.need:c.hits<=r.max,info=this.seasonInfo(c.idx);
    if(ok){o.storm.passed[c.idx]=true;o.progress=o.storm.passed.filter(Boolean).length;this.c24Fx('vfx_c24_trial_pass',this.player.x,this.player.y,190,{tint:info.color});this.floatText(this.player.x,this.player.y-60,info.emoji+' TRIAL PASSED!',info.color);this.screenFlash(info.color,.22,260);Sfx.clear&&Sfx.clear();}
    else{o.storm.fails=o.storm.fails||[0,0,0,0];o.storm.fails[c.idx]++;this.floatText(this.player.x,this.player.y-60,info.emoji+' Trial failed — easier next cycle',0xbbbbbb);const r2=this.stormRule(c.idx,o);this.showBanner(info.emoji+' '+info.name+' trial failed','It returns in 30s · next time: '+(r2.need?'defeat '+r2.need:'up to '+r2.max+' hits'),2000);} }
  stormHit(o,dmgMul){ const c=o.storm.cur;c.hits++;this.player.iframe=0;this.hurtPlayer(Math.max(4,Math.round((this.player.maxhp||100)*dmgMul)),.5);this.cameras.main.shake(120,.004); }
  tickSeasonObjective(dt){
    const o=this.waveObjective;if(!o||o.type!=='seasonCycle'||!o.storm)return;const g=this.objNodeG;if(!g)return;g.clear();
    if(o.storm.harvest){ this.seasonShrineTick?.(o,dt); if(this.seasonPetalTick?.(o,dt))return; }
    this._stormHudT=(this._stormHudT||0)-dt;if(this._stormHudT<=0){this._stormHudT=.25;this.renderWaveObjectiveHUD();}
    const idx=this._seasonState?this._seasonState.idx:0;let c=o.storm.cur;if(!c||c.idx!==idx){this.stormEndSeason(o);if(o.progress>=o.target){this.completeWaveObjective();return;}this.stormBeginSeason(o,idx,false);c=o.storm.cur;}
    if(o.storm.passed[idx]){this.c24ClearCur(c);return;}   // ฤดูที่ผ่านแล้ว = พัก ไม่มีภัย
    const pl=this.player,info=this.seasonInfo(idx),t=this.elapsed||0;
    if(idx===0){ c.sprout=(c.sprout||0)-dt;if(c.sprout<=0&&this.mode==='wave'){c.sprout=1.2;let live=0;this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini)live++;});const want=o.storm.harvest?6:Math.min(6,this.stormRule(0,o).need-c.kills);for(let i=0;i<Math.min(2,want-live);i++)this.spawnEnemy('sprout',Math.random()*TAU,Math.max(this.W,this.H)/this.viewZoom*.55);}   /* v7.8.29 บั๊กค้าง: Reserves หมดแล้วด่านฤดูใบไม้ผลิต้องฆ่า 10 ตัวแต่ไม่มีศัตรูเกิด → เติม Bloom Sprout เอง */
      c.regen-=dt;if(c.regen<=0){c.regen=1;this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini)e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.04);});this.c24HealFx(4);} }
    else if(idx===1){ const v=pl.body?pl.body.velocity.length():0;c.still=v<40?c.still+dt:Math.max(0,c.still-dt*2);const f=Phaser.Math.Clamp(c.still/1.4,0,1);
      if(f>0.05){if(!c.burn?.active)c.burn=this.c24Fx('vfx_c24_summer_burn',pl.x,pl.y,140,{keep:true,must:true,depth:3});if(c.burn){const d=(70-30*f)*2.3;c.burn.setPosition(pl.x,pl.y).setDisplaySize(d,d).setAlpha(.35+.65*f).setVisible(true);}else{g.lineStyle(4,0xff5a1f,.4+.5*f);g.strokeCircle(pl.x,pl.y,70-30*f);g.fillStyle(0xffb12b,.18*f);g.fillCircle(pl.x,pl.y,70-30*f);}}else if(c.burn)c.burn.setVisible(false);
      if(c.still>=1.4){c.still=0;if(!this.c24Fx('vfx_c24_summer_ignite',pl.x,pl.y,150,{must:true}))this.spawnFxAnim&&this.spawnFxAnim('fx_chilinova',pl.x,pl.y,{scale:.5});this.stormHit(o,.07);} }
    else if(idx===2){ c.windA+=dt*.35;if(pl.body&&!(this.dashTime>0)){pl.body.x+=Math.cos(c.windA)*75*dt;pl.body.y+=Math.sin(c.windA)*75*dt;}
      for(let k=0;k<3;k++){const a=c.windA,ox=pl.x+Math.cos(a+1.6)*(k-1)*60,oy=pl.y+Math.sin(a+1.6)*(k-1)*60;g.lineStyle(2,0xffd0a0,.35);g.lineBetween(ox-Math.cos(a)*30,oy-Math.sin(a)*30,ox+Math.cos(a)*30,oy+Math.sin(a)*30);}
      c.ev-=dt;if(c.ev<=0){c.ev=2.2;const a=Math.random()*Math.PI,v=pl.body?pl.body.velocity:{x:0,y:0};c.lines.push({x:pl.x+v.x*.85+Math.cos(c.windA)*75,y:pl.y+v.y*.85+Math.sin(c.windA)*75,a,t:1.0});}
      for(const L of c.lines){L.t-=dt;const dx=Math.cos(L.a)*900,dy=Math.sin(L.a)*900;if(L.t>0){if(L.s===undefined)L.s=this.c24Fx('vfx_c24_autumn_lane',L.x,L.y,1800,{h:84,rot:L.a,keep:true,must:true,depth:3});if(L.s)L.s.setAlpha(L.t<.35?1:.6);else{g.lineStyle(L.t<.35?10:4,0xff7040,L.t<.35?.85:.4);g.lineBetween(L.x-dx,L.y-dy,L.x+dx,L.y+dy);}}
        else if(!L.done){L.done=true;const px=pl.x-L.x,py=pl.y-L.y,perp=Math.abs(-px*Math.sin(L.a)+py*Math.cos(L.a));L.s=this.c24Drop(L.s);if(!this.c24Fx('vfx_c24_autumn_slash',L.x,L.y,1800,{h:110,rot:L.a,must:true})){g.lineStyle(14,0xffe0b0,.9);g.lineBetween(L.x-dx,L.y-dy,L.x+dx,L.y+dy);}if(perp<38)this.stormHit(o,.08);}}
      c.lines=c.lines.filter(L=>{if(L.t>-.2)return true;L.s=this.c24Drop(L.s);return false;}); }
    else { // winter: ลื่น + แผ่นน้ำแข็ง
      if(pl.body&&!(this.dashTime>0)){const v=pl.body.velocity;if(c.vx===undefined){c.vx=v.x;c.vy=v.y;}c.vx+=(v.x-c.vx)*Math.min(1,dt*3.2);c.vy+=(v.y-c.vy)*Math.min(1,dt*3.2);pl.setVelocity(c.vx,c.vy);}
      c.ev-=dt;if(c.ev<=0){c.ev=1.6;const v=pl.body?pl.body.velocity:{x:0,y:0};c.patches.push({x:pl.x+v.x*.6,y:pl.y+v.y*.6,t:1.1,r:64});}
      for(const P of c.patches){P.t-=dt;if(P.t>0){if(P.s===undefined)P.s=this.c24Fx('vfx_c24_winter_patch',P.x,P.y,P.r*2.15,{keep:true,must:true,depth:3});if(!P.s){g.fillStyle(0x8fdcff,.12+.25*(1-P.t/1.1));g.fillCircle(P.x,P.y,P.r);g.lineStyle(3,0xd8f4ff,.8);g.strokeCircle(P.x,P.y,P.r*(P.t/1.1)+4);}}
        else if(!P.done){P.done=true;P.s=this.c24Drop(P.s);if(!this.c24Fx('vfx_c24_winter_freeze',P.x,P.y,P.r*2.6,{must:true})){g.fillStyle(0xffffff,.7);g.fillCircle(P.x,P.y,P.r);}if(this.dist(pl.x,pl.y,P.x,P.y)<P.r)this.stormHit(o,.08);}}
      c.patches=c.patches.filter(P=>{if(P.t>-.2)return true;P.s=this.c24Drop(P.s);return false;}); }
  }
  stormHudText(o,noMarks){ if(!o.storm)return'';const c=o.storm.cur,marks=noMarks?'':[0,1,2,3].map(i=>this.seasonInfo(i).emoji+(o.storm.passed[i]?'✓':'')).join(' ')+' · ';const s=this._seasonState,left=Math.max(0,Math.ceil(s?.t||0)),idx=s?.idx??0;   /* v7.8.54 เจ้าของ: เพิ่งรู้ว่าฤดูวนหลังเล่น 10 รอบ → บอกฤดูตอนนี้ + นับถอยหลัง + ฤดูถัดไป */
    if(o.storm.harvest){const H=o.storm.harvest,info=this.seasonInfo(idx),full=o.storm.passed.filter(Boolean).length;return marks+info.emoji+' '+info.name.split(' ')[0]+' '+H[idx]+'/'+SEASON_PETALS+(o.storm.passed[idx]?' ✓':'')+' · next season '+left+'s · '+full+'/4 full';}
    if(!c||o.storm.passed[c.idx]||c.partial){let n=-1;for(let k=1;k<=4;k++){const j=(idx+k)%4;if(!o.storm.passed[j]){n=j;break;}}const nx=n<0?null:this.seasonInfo(n),wait=n<0?0:left+((n-idx+4)%4-1)*10;return marks+(nx?'next trial '+nx.emoji+' '+nx.name.split(' ')[0]+' in '+wait+'s':'rest');}
    const r=this.stormRule(c.idx,o),info=this.seasonInfo(c.idx);
    return marks+info.emoji+' '+info.name.split(' ')[0]+' trial '+left+'s · '+(r.need?('kills '+c.kills+'/'+r.need):('hits '+c.hits+'/'+r.max)); }
  spawnNectarGarden(){
    const o=this.waveObjective;if(!o||o.type!=='defendNectar')return;this.a23Cue?.('event_defend_nectar_open',.3,1);this._nectarFlowers=[];this._nectarPulse=0;
    if(!this.objNodeG){this.objNodeG=this.add.graphics().setScrollFactor(1).setDepth(90040);this.camWorld(this.objNodeG);}
    for(let i=0;i<1;i++){const p=this.objectivePosition(i,1,185,300),painted=this.textures.exists('objective_nectar_flower'),sprite=this.camWorld(this.add.image(p.x,p.y,painted?'objective_nectar_flower':'ch2_nectar_enemy_atlas',painted?undefined:7).setScale(painted?.65:.34).setDepth(p.y+2)),ring=this.camWorld(this.add.image(p.x,p.y+18,'vfx_ring').setTint(0xffc95c).setDisplaySize(150,105).setAlpha(.44).setDepth(p.y-1));
      const floor=this.add?.graphics?.();
      if(floor?.fillEllipse&&floor?.strokeEllipse){ this.camWorld(floor.setDepth(-98000)); ring.setVisible(false); }
      else floor?.destroy?.();
      this._nectarFlowers.push({x:p.x,y:p.y,hp:300,maxhp:300,sprite,ring,painted,alive:true,
        floor:floor?.fillEllipse&&floor?.strokeEllipse?floor:null,bloom:.85,attacked:false,healing:false});if(ring.visible!==false)this.tweens.add({targets:ring,rotation:TAU,alpha:{from:.28,to:.56},duration:1900+i*170,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
  }
  nectarLifeLoss(){this.a23Cue?.('event_defend_nectar_close',.22,.8);const p=this.player;if(this.state!=='play'||!p||this._inTutorial)return;const loss=p.maxhp/3;p.hp=Math.max(0,p.hp-loss);p.iframe=Math.max(p.iframe||0,.6);this._noteHit?.('objective',loss);Sfx.hurt();this.vfxHurtFlash?.();this.screenShake?.(150,.009);if(p.hp<=0)this.die();}
  nectarRelocate(old){let best=null,score=-Infinity;for(let i=0;i<12;i++){const p=this.objectivePosition(i,12,220,340),d=this.dist(p.x,p.y,old.x,old.y);let near=500;this.enemies.children.iterate(e=>{if(e?.active)near=Math.min(near,this.dist(e.x,e.y,p.x,p.y));});const value=Math.min(d,360)+Math.min(near,200);if(value>score){score=value;best=p;}}return best;}
  nectarFlowerFx(f,dt){
    const g=f.floor;
    if(!g?.active)return;
    const reduced=!!Save.data?.settings?.reducedMotion,x=f.x,y=f.y,ground=y+18;
    const hp=f.hp/f.maxhp,threat=f.attacked||hp<.35;
    const tone=threat?0xf87889:f.healing?0x9aebbf:0xffcc69;
    f.bloom=Math.max(0,f.bloom-dt);
    g.clear();
    g.fillStyle(0x1d1423,.34).fillEllipse(x,ground,112,55);
    g.lineStyle(2,tone,.52).strokeEllipse(x,ground,101,45);
    for(let i=0;i<4;i++){
      const angle=Math.PI/4+i*TAU/4;
      const px=x+Math.cos(angle)*45,py=ground+Math.sin(angle)*19;
      g.fillStyle(tone,threat?.78:.60).fillEllipse(px,py,13,5);
    }
    if(f.healing){
      g.lineStyle(1.5,0x9aebbf,.37).strokeCircle(x,y,135);
      if(!reduced){
        for(let i=0;i<4;i++){
          const progress=((this.elapsed||0)*.85+i/4)%1,angle=i*TAU/4;
          g.fillStyle(0xc4f6bf,.64*(1-progress)).fillCircle(x+Math.cos(angle)*42,ground+Math.sin(angle)*16-progress*45,2.7);
        }
      }
    }
    if(f.bloom>0){
      const progress=1-f.bloom/.85,spread=reduced?0:progress*62;
      g.lineStyle(2.5,0xffe0a0,.68*(1-progress)).strokeEllipse(x,ground,90+spread,42+spread*.46);
      for(let i=0;i<6;i++){
        const angle=i*TAU/6;
        g.fillStyle(i%2?0xffdf9a:0xf6b5ac,.71*(1-progress)).fillEllipse(
          x+Math.cos(angle)*(42+spread*.6),ground+Math.sin(angle)*19-(reduced?0:progress*30),7,4);
      }
    }
  }
  tickNectarGarden(dt){
    if(this.state!=='play')return;
    const o=this.waveObjective,flowers=this._nectarFlowers;if(!o||o.type!=='defendNectar'||!flowers||!flowers.length)return;let alive=0;
    for(const f of flowers){if(!f.alive)continue;alive++;let attackers=0;this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini&&this.dist(e.x,e.y,f.x,f.y)<145)attackers++;});
      f.attacked=attackers>0;
      f.hp-=attackers*2.6*dt;
      const inRange=this.dist(this.player.x,this.player.y,f.x,f.y)<135;
      f.healing=inRange&&f.hp<f.maxhp;if(f.healing)this.a23Cue?.('event_defend_nectar_progress',.1,4);
      if(inRange)f.hp=Math.min(f.maxhp,f.hp+18*dt);
      if(f.hp<=0){f.hp=0;f.alive=false;alive--;if(f.sprite)f.sprite.setVisible(false);if(f.ring)f.ring.setVisible(false);f.floor?.clear?.();this.burst(f.x,f.y,0xffa17d);Sfx.boom();}
      else{const pulse=(f.painted?.65:.31)+Math.sin((this.elapsed||0)*5+f.x*.01)*.02;if(f.sprite)f.sprite.setScale(pulse).setTint(attackers||f.hp<f.maxhp*.35?0xff8a9c:0xffffff);if(f.ring&&!f.floor)f.ring.setTint(attackers?0xff6b8a:0xffc95c);if(attackers&&(!f._warnAt||(this.elapsed||0)-f._warnAt>3)){f._warnAt=this.elapsed||0;this.floatText(f.x,f.y-82,'⚠ Nectar under attack!',0xff849e);}}}
    if(alive<=0){this.objBonusFail?.();o.progress=Math.max(0,o.progress-o.target*.2);Sfx.hurt?.();this.screenShake?.(120,.006);if(this.state!=='play'||this.waveObjective!==o||this._nectarFlowers!==flowers)return;this.showBanner('🥀 Nectar Lost · timer -20%','A fresh flower has bloomed elsewhere — protect it!',1500);   /* v8.1.77 เจ้าของ: เลิกหัก 1/3 Max HP */for(const f of flowers){const p=this.nectarRelocate(f);f.x=p.x;f.y=p.y;f.hp=f.maxhp;f.alive=true;f._warnAt=-99;f.bloom=.85;f.attacked=false;f.healing=false;if(f.sprite)f.sprite.setPosition(f.x,f.y).setDepth(f.y+2).setVisible(true).clearTint();if(f.ring)f.ring.setPosition(f.x,f.y+18).setDepth(f.y-1).setVisible(!f.floor).setTint(0xffc95c);}alive=1;}
    o.progress=Phaser.Math.Clamp(o.progress+dt,0,o.target);
    const hud=this.objNodeG;
    hud?.clear();
    for(const f of flowers){
      if(!f.alive)continue;
      this.nectarFlowerFx?.(f,dt);
      if(!hud)continue;
      const w=72,frac=f.hp/f.maxhp,color=frac<.35?0xff637a:frac<.7?0xffc368:0x8ceab2;
      hud.fillStyle(0x190b24,.86).fillRoundedRect(f.x-w/2,f.y-78,w,9,4);
      hud.fillStyle(color,.96).fillRoundedRect(f.x-w/2+2,f.y-76,(w-4)*frac,5,2);
      if(f.healing&&hud.lineBetween){
        hud.lineStyle(2,0xb6f4c1,.95);
        hud.lineBetween(f.x+42,f.y-74,f.x+50,f.y-74);
        hud.lineBetween(f.x+46,f.y-78,f.x+46,f.y-70);
      }
    }
    if(o.progress>=o.target)this.completeWaveObjective();
  }
  // Optional mid-wave detours. They never delay the main objective.
  startWaveEvent(){
    this.clearWaveEvent();
    const cache=Math.random()<0.5;
    if(cache){
      const crates=[];
      for(let i=0;i<3;i++){const c=this.spawnCrate();if(c){c._eventCache=true;c.setTint(0xffd166);crates.push(c);}}
      if(!crates.length)return;
      const labels=crates.map(c=>this.camWorld(this.add.text(c.x,c.y-69,'24s',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffe08a',stroke:'#331926',strokeThickness:4}).setOrigin(.5).setDepth(95010)));
      const icons=crates.map(c=>this.textures.exists('objective_cache')?this.camWorld(this.add.image(c.x,c.y-43,'objective_cache').setScale(.5).setDepth(95011)):null);
      this._waveEvent={type:'cache',time:24,crates,labels,icons,remaining:crates.length};
      this.showBanner('🧰 Supply Cache','Stand next to the '+crates.length+' golden jars to crack them open within 24s for bonus candy',2200);
    }else{
      // spawnElite may recycle a live enemy when the pool is full; never replace an objective target.
      if(this.enemies.countActive(true)>=this.enemies.maxSize-1)return;
      const e=this.spawnElite();if(!e)return;
      e._eventCourier=true;e.setTint(0xffd166);
      const icon=this.textures.exists('objective_courier')?this.camWorld(this.add.image(e.x,e.y-88,'objective_courier').setScale(.52).setDepth(95011)):null;
      this._waveEvent={type:'courier',time:22,courier:e,icon};
      this.showBanner('🍬 Sugar Courier','Catch the golden courier within 22s for bonus candy',1900);
    }
  }
  tickWaveEvent(dt){
    const ev=this._waveEvent;if(!ev)return;
    ev.time-=dt;
    if(ev.type==='courier'&&ev.courier&&ev.courier.active){
      const e=ev.courier;if(!ev.label||!ev.label.active)ev.label=this.camWorld(this.add.text(e.x,e.y-112,Math.ceil(ev.time)+'s',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffe08a',stroke:'#331926',strokeThickness:4}).setOrigin(.5).setDepth(95010));
      ev.label.setPosition(e.x,e.y-112).setText(Math.ceil(ev.time)+'s');if(ev.icon&&ev.icon.active)ev.icon.setPosition(e.x,e.y-88);
    }
    if(ev.type==='cache')ev.crates.forEach((c,i)=>{if(ev.labels[i]&&ev.labels[i].active)ev.labels[i].setVisible(c.active).setText('🍯 Stand close · '+Math.ceil(ev.time)+'s');if(ev.icons[i]&&ev.icons[i].active)ev.icons[i].setVisible(c.active);});
    if(ev.time<=0){
      if(ev.type==='courier'&&ev.courier&&ev.courier.active){ev.courier._eventCourier=false;ev.courier.setActive(false).setVisible(false);if(ev.courier.body)ev.courier.body.enable=false;}
      this.clearWaveEvent();this.showBanner('⌛ Bonus expired','Continue the main mission',1100);
    }
  }
  clearWaveEvent(){
    const ev=this._waveEvent;if(!ev)return;
    if(ev.label){this.tweens.killTweensOf(ev.label);if(ev.label.active)ev.label.destroy();}
    for(const label of ev.labels||[])if(label&&label.active)label.destroy();
    for(const icon of [ev.icon,...(ev.icons||[])])if(icon&&icon.active)icon.destroy();
    if(ev.courier){ev.courier._eventCourier=false;if(ev.courier.active)ev.courier.clearTint();}
    for(const c of ev.crates||[]){c._eventCache=false;if(c.active)c.clearTint();}
    this._waveEvent=null;
  }
  onWaveEventCourier(e){
    const ev=this._waveEvent;if(!ev||ev.type!=='courier'||ev.courier!==e)return;
    this.clearWaveEvent();this.spawnSugarCoins(Math.round(35*this.diffMul().reward));
    this.grantCurrencyReward(1,this.currencyTierFor(),'🍬 Courier caught!');
  }
  onWaveEventCache(c){
    const ev=this._waveEvent;if(!ev||ev.type!=='cache'||!c._eventCache)return;
    c._eventCache=false;ev.remaining--;
    if(ev.remaining>0){this.floatText(c.x,c.y-35,ev.remaining+' jars left',0xffd166);return;}
    this.clearWaveEvent();this.spawnSugarCoins(Math.round(30*this.diffMul().reward));
    this.grantCurrencyReward(1,this.currencyTierFor(),'🧰 Cache opened!');
  }
  // Main objective kill tracking.
  objOnKill(e){
    const o=this.waveObjective;if(!o||o.done)return;
    if(o.type==='hunt'&&o._huntPhase==='clear'&&e&&!e.isBoss&&!e.isMini&&!e._waveObjectiveTarget){o._huntKills=Math.min(o._huntKillGoal,o._huntKills+1);if(o._huntKills>=o._huntKillGoal){o._huntPhase='elite';o._huntSpawnAt=this.time.now;this.showBanner('Elite revealed','Follow the marker and defeat the Elite',1500);}this.renderWaveObjectiveHUD();}
    if(o.type==='fill'&&e&&!e.isBoss&&!e.isMini){o.progress=Math.min(o.target,o.progress+1);this.renderWaveObjectiveHUD();if(o.progress>=o.target){this.completeWaveObjective();return;}}
    if(o.type==='seasonCycle'&&o.storm?.harvest&&e&&!e.isBoss&&!e.isMini&&this.seasonHarvest(o,e))return;
  }

  objectivePosition(i=0,n=1,minR=240,maxR=390){
    const lim=WORLD/2-130;let pos={x:this.player.x,y:this.player.y};
    if(n>1){ minR=Math.round(minR*1.6); maxR=Math.round(maxR*2.2); }   /* v8.1.105 เจ้าของ: ภารกิจหลายจุด (แกน Escort the Wisp ฯลฯ) กระจุกกลางแมพ → กระจายไกลขึ้นทั่วแมพ · ภารกิจจุดเดียวคงระยะเดิม */
    const base=Math.random()*TAU;   /* v8.1.77 เจ้าของ: Clean Air เดินไปขวาตลอด → จุดเดียวเคยเริ่มที่มุม 0 (ขวา) เสมอ */
    for(let tryN=0;tryN<8;tryN++){const a=base+(i/n)*TAU+Phaser.Math.FloatBetween(-.38,.38)+tryN*.72,r=Phaser.Math.Between(minR,maxR);pos={x:Phaser.Math.Clamp(this.player.x+Math.cos(a)*r,-lim,lim),y:Phaser.Math.Clamp(this.player.y+Math.sin(a)*r,-lim,lim)};let blocked=false;
      if(this.solidProps)this.solidProps.children.iterate(s=>{if(s&&s.active&&this.dist(pos.x,pos.y,s.x,s.y)<135)blocked=true;});if(!blocked)break;}
    return pos;
  }
  spawnWaveObjectiveNode(i,n){
    const o=this.waveObjective;if(!o||o.type!=='purge')return;
    // เกิดห่างกันขึ้น: วงกว้างขึ้น + เว้นระยะจากแกนอื่นอย่างน้อย ~260
    let pos=this.objectivePosition(i,n,340,560);
    for(let tryN=0;tryN<6;tryN++){ let tooClose=false;
      this.waveNodes.children.iterate(nd=>{ if(nd&&nd.active&&nd._waveObjectiveNode&&this.dist(pos.x,pos.y,nd.x,nd.y)<260)tooClose=true; });
      if(!tooClose)break; pos=this.objectivePosition(i,n,340,560); }
    const coreKey=this.textures.exists('objective_cursed_core')?'objective_cursed_core':'nest_crystal';
    let node=this.waveNodes.getFirstDead(false);if(!node)node=this.waveNodes.create(pos.x,pos.y,coreKey);else{node.setTexture(coreKey).setActive(true).setVisible(true).setPosition(pos.x,pos.y);if(node.body)node.body.enable=true;}
    if(!node)return;
    node.hp=1;node.maxhp=1;node._purifyCd=0;node._waveObjectiveNode=true;node._coreLocked=true;node._purified=false;node.setScale(coreKey==='objective_cursed_core'?.68:.66).setDepth(node.y+1);if(coreKey!=='objective_cursed_core')node.setTint(o.color);else node.clearTint();this.camWorld(node);   // แกนคำสาป = ทำลายด้วยกระสุนไม่ได้ ต้องให้ Wisp ชำระ
    if(node.body){node.body.setAllowGravity(false);node.body.setImmovable(true);node.body.setCircle(42,22,22);}
    node._objectiveCue=this.camWorld(this.add.image(node.x,node.y,'vfx_ring').setTint(o.color).setDepth(node.y).setDisplaySize(112,92).setAlpha(.52));
    this.tweens.add({targets:node._objectiveCue,rotation:TAU,alpha:{from:.34,to:.62},duration:1500,yoyo:true,repeat:-1,ease:'Sine.inOut'});this.vfxSpawnPoof(node.x,node.y);
  }
  hitWaveNode(b,node){
    if(!b.active||!node.active||!node._waveObjectiveNode)return;
    if(node._coreLocked){if(!b.pierce)this.killBullet(b);this.vfxHitRing(node.x,node.y,0x8a5cff,false);return;}   // แกนคำสาปกันกระสุน — สะท้อนเป็นประกาย ไม่ลด HP
    const dmg=b.dmg||8;node.hp-=dmg;this.popDmg(Math.round(dmg),node.x,node.y,false);this.vfxHitRing(node.x,node.y,this.waveObjective?.color||0xffd166,false);if(!b.pierce)this.killBullet(b);if(node.hp<=0)this.destroyWaveObjectiveNode(node);
  }
  destroyWaveObjectiveNode(node){
    if(!node||!node.active)return;const x=node.x,y=node.y;if(node._objectiveCue){this.tweens.killTweensOf(node._objectiveCue);node._objectiveCue.destroy();node._objectiveCue=null;}
    node._waveObjectiveNode=false;node._lure=false;node.setActive(false).setVisible(false);if(node.body)node.body.enable=false;this.burst(x,y,this.waveObjective?.color||0xffd166);
    const o=this.waveObjective;if(o&&(o.type==='purge'||o.type==='breakRoots')&&!o.done){o.progress++;this.renderWaveObjectiveHUD();if(o.progress>=o.target){ if(o.type==='breakRoots'&&this._lure&&!o._crownFinDone&&this.crownRootFinale?.(x,y,o))return; this.completeWaveObjective();}}   /* v8.2.81 หินก้อนสุดท้าย = ช่วงตีหัวราก */
  }
  /* ---- v8.2.4 🕳️ Hunger Crack (เจ้าของเลือก PoE Abyss) ----
     เส้นทาง 7 ท่อน คดเคี้ยวในแมพ · ปลายที่เปิดแล้ว (tip) เรืองแสง · ยืนใกล้ปลาย ≤ HC_NEAR → รอยแยกงอกต่อ (ครบทั้งเส้น ~22 วิ) · ไม่อยู่ = หยุดงอก (ไม่ถอย ไม่เลือดไหล)
     มอนคลานออกจากรอยแยกที่เปิดแล้วทุก ~2.4 วิ (ถี่ขึ้นตามความคืบหน้า) · ปลายทางเป็นหลุมเห็นจาง ๆ ตั้งแต่ต้น · ถึงหลุม = หลุมระเบิด ล้างมอนรอบ ๆ + รางวัลของภารกิจตามปกติ */
  spawnHungerCrack(){ const o=this.waveObjective;if(!o)return;this.a23Cue?.('event_hunger_crack_open',.3,1); const start=this.objectivePosition(0,1,220,320),pts=[{x:start.x,y:start.y}]; let a=Math.atan2(-start.y,-start.x)+Phaser.Math.FloatBetween(-1,1);
    const segN=(this.stageIndex||0)<5?HC_SEGS[0]:HC_SEGS[1]; for(let i=0;i<segN;i++){ a+=Phaser.Math.FloatBetween(-.75,.75); const L=Phaser.Math.Between(120,170),q=pts[pts.length-1],[nx,ny]=inMapPt(q.x+Math.cos(a)*L,q.y+Math.sin(a)*L,160); if(Math.hypot(nx-q.x,ny-q.y)<60){a+=Math.PI*.6;i--;if(pts.length>40)break;continue;} pts.push({x:nx,y:ny}); }
    const cum=[0]; for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
    const jag=[]; for(let i=0;i<pts.length-1;i++){ const A=pts[i],B=pts[i+1],n=4,ang=Math.atan2(B.y-A.y,B.x-A.x); for(let k=0;k<n;k++){ const t=k/n,j=k?Phaser.Math.FloatBetween(-14,14):0; jag.push({x:A.x+(B.x-A.x)*t-Math.sin(ang)*j,y:A.y+(B.y-A.y)*t+Math.cos(ang)*j,d:cum[i]+(cum[i+1]-cum[i])*t}); } } jag.push({...pts[pts.length-1],d:cum[cum.length-1]});
    const end=pts[pts.length-1],L=cum[cum.length-1],holes=HC_HOLES.map(f=>{ const d=Math.min(L,Math.max(80,L*f)),   /* v8.2.79 หลุมต้องอยู่บนเส้นเสมอ (เส้นสั้น <80 เคยค้าง) */
      q=this.hungerCrackAt0(pts,cum,d); return {d,x:q.x,y:q.y,open:false}; });
    this._crack={pts,cum,jag,L,head:0,tip:{x:start.x,y:start.y},holes,hi:0,st:'wait',tag:'hc'+Date.now()+Math.random(),pack:null,packT:0,g:this.camWorld(this.add.graphics().setDepth(4)),hole:this.camWorld(this.add.graphics().setDepth(3)),end};
    this._crack.holes.forEach((H,i)=>{ H.stream=0; H.sT=0; H.pack=[]; H.final=i===this._crack.holes.length-1; }); this._crack.trT=1; this._crack.fw=0; this._crack.fwT=0; this._crack.pack=[];
    this.tickHungerCrack(0,o); this.floatText?.(start.x,start.y-50,'🕳️ Stay near the crack!',0xc58bff); }
  hungerCrackAt0(P,C,d){ for(let i=1;i<P.length;i++)if(d<=C[i]){ const t=(d-C[i-1])/Math.max(1,C[i]-C[i-1]); return {x:P[i-1].x+(P[i].x-P[i-1].x)*t,y:P[i-1].y+(P[i].y-P[i-1].y)*t}; } return {...P[P.length-1]}; }
  hungerCrackAt(d){ const c=this._crack; return this.hungerCrackAt0(c.pts,c.cum,Phaser.Math.Clamp(d,0,c.L)); }
  hungerCrackGlyph(f){ const c=this._crack,n=c?c.holes.length:HC_HOLES.length,k=c?c.holes.filter(h=>h.open).length:Math.round(Phaser.Math.Clamp(f,0,1)*n); return '▰'.repeat(k)+'▱'.repeat(Math.max(0,n-k)); }
  /* v8.2.7 สถานะ: wait (รอแตะปลาย) → run (วิ่งเอง HC_SPEED px/วิ) → ถึงหลุม: แตก (มอน + ของ) → wait … หลุมสุดท้าย: final (มอนกลุ่มใหญ่ + Elite · ฆ่าหมดหรือ 35 วิ = จบ) */
  tickHungerCrack(dt,o){ const c=this._crack;if(!c)return; const P=this.player,play=this.state==='play'&&!o.done,ch=(this.stageIndex||0)<5?0:1,near=!!P&&this.dist(P.x,P.y,c.tip.x,c.tip.y)<=HC_FOLLOW;
    if(play&&c.st!=='final'){ if(near){ if(c.st==='wait'){ c.st='run'; if(!c.started){ c.started=true; Sfx.orderCue?.('wave_start',.3,1.3); this.screenShake?.(120,.004); } } } else if(c.st==='run'){ c.st='wait'; const now=this.time?.now||0; if(now-(c.callAt||0)>6000){ c.callAt=now; this.floatText?.(c.tip.x,c.tip.y-50,'🕳️ Stay near the crack!',0xc58bff); } } }
    if(play&&c.st==='run'&&dt>0){ c.head=Math.min(c.L,c.head+dt*HC_CRAWL[ch]); Sfx.eventLoopStart?.('event_capture_charge',.2,.9);
      c.trT-=dt; if(c.trT<=0){ c.trT=HC_TRICKLE[ch]; const k=Math.random()<.4?2:1; for(let i=0;i<k;i++){ const q=this.hungerCrackAt(Math.max(0,c.head-Phaser.Math.Between(40,300))); this.hungerCrackCrawlAt(c,q.x,q.y,i); } }
      const H=c.holes[c.hi]; if(H&&c.head>=H.d){ this.hungerCrackErupt(c,c.hi); c.hi++; if(H.final){ c.st='final'; Sfx.eventLoopStop?.('event_capture_charge'); } } }
    else Sfx.eventLoopStop?.('event_capture_charge');
    const tp=this.hungerCrackAt(c.head); c.tip.x=tp.x; c.tip.y=tp.y;
    if(play)for(const H of c.holes){ if(H.stream>0){ H.sT-=dt; if(H.sT<=0){ H.sT=H.final?HC_FINAL_STREAM:HC_HOLE_GAP; H.stream--; const tk=H.final&&(H.tank||0)>0&&H.stream%3===1; if(tk)H.tank--; const e=this.hungerCrackCrawlAt(c,H.x,H.y,H.stream,tk?'tank':null); if(e)H.pack.push(e); } }
      if(H.open&&!H.final&&!H.looted&&H.stream<=0&&H.pack.length&&H.pack.every(e=>!e||!e.active||e._hcTag!==c.tag)){ H.looted=true; this.hungerCrackHoleLoot(c,H); } }
    o.progress=Math.min(o.target*.95,o.target*(c.head/Math.max(1,c.L))*.9);
    if(c.st==='final'&&play){ const F=c.holes[c.holes.length-1]; c.packT+=dt; c.fwT-=dt;
      if(c.fw>0&&c.fwT<=0&&F.stream<=0){ c.fw--; c.fwT=HC_FINAL_GAP; c.fwN=(c.fwN||0)+1; F.stream=HC_FINAL_PER[ch]; F.tank=HC_FINAL_TANKS[c.fwN-1]||0; F.sT=0; this.floatText?.(F.x,F.y-60,F.tank?'🕳️ Something big is coming!':'🕳️ More pour out!',0xc58bff); }
      if(c.fw<=0&&F.stream<=0&&!c.elite){ c.elite=true; try{ const e=this.spawnElite(true,true); if(e){ e.setPosition?.(F.x+20,F.y); e._hcTag=c.tag; F.pack.push(e); this.emergeFoe?.(e,'ground'); } }catch(err){} try{ const b=this.hungerCrackBrute?.(c,F); if(b)F.pack.push(b); }catch(err){} }
      if(c.brute){ const b=c.brute; if(b.active){ c.bx=b.x; c.by=b.y; } else if(!c.bruteLoot){ c.bruteLoot=true; try{ const g=this.spawnLoot?.(c.bx??F.x,c.by??F.y,1); if(g)this.lootHold?.(g,1400); }catch(err){} this.floatText?.(c.bx??F.x,(c.by??F.y)-60,'💜 Abyss Brute down!',0xe0b3ff); } }
      const left=F.pack.filter(e=>e&&e.active&&e._hcTag===c.tag).length; o._hcLeft=left; c.pack=F.pack;
      if(c.elite&&left>0&&left<=HC_FINAL_TAIL){ c.tailT=(c.tailT||0)+dt; }else c.tailT=0;   /* v8.2.79 เจ้าของ: ค้างตอนจบ → เหลือ ≤2 ตัวนาน 6 วิ = จบเลย (ตัวที่เหลือกลายเป็นมอนปกติ) */
      if((c.elite&&left===0)||(c.tailT||0)>=HC_FINAL_TAIL_SEC||c.packT>=HC_FINAL_MAX){ if(left>0)for(const e of F.pack)if(e&&e._hcTag===c.tag)e._hcTag=null; this.drawHungerCrack(c); this.hungerCrackDone(c); this.completeWaveObjective(); return; } }
    this.drawHungerCrack(c); }
  hungerCrackErupt(c,i){this.a23Cue?.('event_hunger_crack_progress',.2,.5); const H=c.holes[i],last=!!H.final; H.open=true; const col=0xc58bff,ch=(this.stageIndex||0)<5?0:1;
    const eruption=this.hungerCrackFeedbackBurst?.(H.x,H.y,last?145:86,true);
    this.screenShake?.(last?320:160,last?.012:.005); this.hitStop?.(last?60:25); this.screenFlash?.(0xb06bff,eruption?(last?.16:.07):(last?.4:.18),last?380:200); Sfx.rewardCue?.('sfx_event_capture_complete',last?.5:.28);
    if(!eruption&&this.add?.circle)for(let k=0;k<(last?3:2);k++)this.time.delayedCall(k*90,()=>{ const r=this.camWorld(this.add.circle(H.x,H.y,40,col,0).setStrokeStyle(8-k*2,0xffe0ff,1).setDepth(90000)); this.tweens.add({targets:r,scale:(last?6:3.5)+k,alpha:0,duration:620,ease:'Cubic.out',onComplete:()=>r.destroy()}); });
    this.burst?.(H.x,H.y,col);
    if(last){ c.fw=HC_FINAL_WAVES; c.fwT=0; c.packT=0; this.floatText?.(H.x,H.y-46,'🕳️ The Hunger pours out!',col); }
    else { H.stream=HC_HOLE_N[ch]; H.sT=.2; this.floatText?.(H.x,H.y-46,'🕳️ Something crawls out!',col); } }
  /* v8.2.48 Abyss Brute: ตัวถังใหญ่ ×1.4 เลือด ×3 ย้อมม่วงดำ ออกพร้อม Elite ที่หลุมสุดท้าย · ล้มได้ของ 1 ชิ้น */
  hungerCrackBrute(c,F){ if(!this.spawnEnemy||!this.player)return null; const B=typeof HC_BRUTE!=='undefined'?HC_BRUTE:{scale:1.4,hp:3,tint:0x8a5cc8},P=this.player,pa=Math.atan2(F.y-P.y,F.x-P.x),pd=Math.max(60,this.dist(P.x,P.y,F.x,F.y)); const e=this.spawnEnemy('tank',pa,pd); if(!e)return null;
    e.setPosition?.(F.x-24,F.y+6); e._hcTag=c.tag; e._hcBrute=true; e.hp=Math.round((e.hp||100)*B.hp); e.maxhp=e.hp; e.setScale?.((e.scaleX||1)*B.scale,(e.scaleY||1)*B.scale); const ov=this.realTex?.('hc94_abyss_brute')?this.artFollow?.(e,'hc94_abyss_brute',110):null; if(ov){ if(!this.anims.exists('hc94_brute_walk'))this.anims.create({key:'hc94_brute_walk',frames:this.anims.generateFrameNumbers('hc94_abyss_brute',{start:0,end:3}),frameRate:7,repeat:-1}); ov.play('hc94_brute_walk'); } else { e.tintColor=B.tint; e.setTint?.(B.tint); } c.brute=e;   /* v8.2.86 ใบ 94 Abyss Brute */ c.bx=e.x; c.by=e.y;
    this.emergeFoe?.(e,'ground'); this.floatText?.(F.x,F.y-80,'💜 Abyss Brute!',0xe0b3ff); this.screenShake?.(220,.008); return e; }
  /* หลุมกลางทาง: ฆ่ามอนที่ไหลออกมาครบ = ของรางวัลที่หลุม */
  hungerCrackHoleLoot(c,H){ try{ const v=Math.round(6+(this.stageIndex||0)*.9),L0=this._lootAt; this.sugarStage=(this.sugarStage||0)+v; this.sugarRun=(this.sugarRun||0)+v; this._lootAt={x:H.x,y:H.y}; try{ this.missionLootBurst?.({noCur:true,noHold:false},v); }finally{ this._lootAt=L0; } }catch(err){} this.floatText?.(H.x,H.y-50,'✨ Hole cleared!',0xffe08a); this.vfxHitRing?.(H.x,H.y,0xffe08a,true); }
  hungerCrackCrawlAt(c,x,y,i,type){ if(!this.enemies||!this.player)return null; const P=this.player; if(this.enemies.countActive(true)>=(this.maxLive||60)+(c.st==='final'?(typeof HC_FINAL_CAP!=='undefined'?HC_FINAL_CAP:30):12))return null; const q={x:x+Phaser.Math.Between(-24,24),y:y+Phaser.Math.Between(-14,14)},pa=Math.atan2(q.y-P.y,q.x-P.x),pd=Math.max(60,this.dist(P.x,P.y,q.x,q.y));
    const e=(type&&this.spawnEnemy(type,pa,pd))||this.spawnEnemy((i|0)%3===2?'dasher':(i|0)%3===1?'fast':'normal',pa,pd)||this.spawnEnemy('fast',pa,pd); if(!e)return null; e.setPosition?.(q.x,q.y); e._hcTag=c.tag; this.emergeFoe?.(e,'ground'); this.hungerCrackFeedbackBurst?.(q.x,q.y,type==='tank'?82:58); return e; }
  hungerCrackCrawl(c,H,k,last){ const out=[]; for(let i=0;i<k;i++){ const e=this.hungerCrackCrawlAt(c,H.x,H.y,i); if(e)out.push(e); } return out; }
  hungerCrackFeedbackBurst(x,y,size,major=false){
    if(!this.realTex?.('hc_new_emerge'))return null;
    if(!major&&!this.heroFxThrottle('hc_new_emerge',2,240))return null;
    return this.heroFx('hc_new_emerge',x,y+8,size,{anchor:'bottom',depth:y-1,alpha:major?.92:.7,must:major});
  }
  hungerCrackMouth(H,next,t){
    const frame=H.open?(H.final?2:1):0;
    const width=H.final?(H.open?144:85):(H.open?106:65);
    let sprite=H._mouth;
    if(!sprite?.active)H._mouth=sprite=this.feedbackSprite('hc_new_mouth',H.x,H.y,width,width,-99291);
    if(!sprite)return false;
    sprite.setFrame(frame).setDisplaySize(width,width).setAlpha(H.looted?.34:H.open?.9+.09*Math.sin(t*4):next?.74:.27);
    return true;
  }
  drawHungerCrack(c){ const g=c.g,h=c.hole; if(!g?.active)return; const t=(this.time?.now||0)/1000,J=c.jag,head=c.head,run=c.st==='run'; g.clear();
    const seg=(w,col,a,from,to)=>{ g.lineStyle(w,col,a).beginPath(); let on=false; for(let i=0;i<J.length;i++){ const d=J[i].d; if(d<from)continue; if(d>to){ const q=this.hungerCrackAt(to); on?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y); break; } on?g.lineTo(J[i].x,J[i].y):g.moveTo(J[i].x,J[i].y); on=true; } g.strokePath(); };
    const nx=c.holes[c.hi]; if(nx)seg(2,0x8a5cff,.18+.12*Math.sin(t*3),head,nx.d);   // เส้นจาง ๆ ไปหลุมถัดไป
    seg(17,0x170925,.5,0,head);
    seg(9,0x1b0929,.94,0,head);
    seg(4,0x8b43cd,.68,0,head);
    seg(1.8,0xe0a6ff,run?.85:.52,Math.max(0,head-140),head);
    // Branches appear only on traversed ground. The live tip stays brightest.
    for(let i=2;i<J.length&&J[i].d<head;i+=3){
      const a=J[i],b=J[i-1],angle=Math.atan2(a.y-b.y,a.x-b.x)+(i%2?1:-1)*.8;
      const len=10+i%5*3,fade=.24+.3*Math.max(0,1-(head-a.d)/320);
      g.lineStyle(2,0x9959d2,fade).lineBetween(a.x,a.y,a.x+Math.cos(angle)*len,a.y+Math.sin(angle)*len);
    }
    if(c.st!=='final'){ const T=c.tip,pr=1+.22*Math.sin(t*(run?18:7)); g.fillStyle(0xbd7dff,run?.19:.13).fillCircle(T.x,T.y,(run?28:24)*pr);
      g.fillStyle(0xffd6ff,.91).fillCircle(T.x,T.y,(run?6:4)*pr);
      if(!run)g.lineStyle(1.5,0xcb8dff,.4).strokeCircle(T.x,T.y,17*pr); }
    if(h?.active){ h.clear(); c.holes.forEach((H,i)=>{ const big=i===c.holes.length-1,s=big?1.4:1,nextOne=i===c.hi&&c.st!=='final'; if(this.hungerCrackMouth?.(H,nextOne,t))return; if(H.open){ h.fillStyle(0x07020c,.9).fillEllipse(H.x,H.y,84*s,42*s); h.lineStyle(4,0xb06bff,.7+.2*Math.sin(t*5+i)).strokeEllipse(H.x,H.y,92*s,48*s); h.fillStyle(0x7a2ad0,.35+.15*Math.sin(t*4+i)).fillEllipse(H.x,H.y,46*s,20*s); }
      else { h.fillStyle(0x07020c,.25+(nextOne?.2:0)).fillEllipse(H.x,H.y,64*s,32*s); h.lineStyle(2,0xb06bff,(nextOne?.45:.2)+.1*Math.sin(t*5)).strokeEllipse(H.x,H.y,70*s,36*s); } }); } }
  hungerCrackDone(c){ Sfx.eventLoopStop?.('event_capture_charge'); if(!this.a23Cue?.('event_hunger_crack_complete',.4,1))Sfx.rewardCue?.('sfx_event_capture_complete',.65); const E=c.holes[c.holes.length-1]||c.end;
    this.screenFlash?.(0xd9a8ff,.85,520); this.screenShake?.(460,.014); this.hitStop?.(70); this.captureFinishSweep?.(E.x,E.y,200);
    if(this.add?.circle)for(let i=0;i<4;i++)this.time.delayedCall(i*110,()=>{ const r=this.camWorld(this.add.circle(E.x,E.y,60,0xb06bff,0).setStrokeStyle(10-i*2,0xffe0ff,1).setDepth(90000)); this.tweens.add({targets:r,scale:8+i*2,alpha:0,duration:820,ease:'Cubic.out',onComplete:()=>r.destroy()}); });
    for(let i=0;i<3;i++)this.burst?.(E.x+Phaser.Math.Between(-40,40),E.y+Phaser.Math.Between(-30,30),i%2?0xffe08a:0xc58bff);
    try{ const si=this.stageIndex||0,v=Math.round((16+si*2.2)*(typeof HC_CHEST_MUL!=='undefined'?HC_CHEST_MUL:1)),L0=this._lootAt; this.sugarStage=(this.sugarStage||0)+v; this.sugarRun=(this.sugarRun||0)+v; this._lootAt={x:E.x,y:E.y}; try{ this.missionLootBurst?.({noHold:false},v); }finally{ this._lootAt=L0; }
      this._lootMinRare=true; try{ const g=this.spawnLoot?.(E.x+30,E.y-20,(si>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1600); }finally{ this._lootMinRare=false; } this.floatText?.(E.x,E.y-70,'🎁 Abyss chest!',0xffe08a); }catch(err){}   /* v8.2.44 หีบ Abyss */
    this.clearHungerCrack(true); }
  clearHungerCrack(fade){ const c=this._crack; if(!c)return; this._crack=null; Sfx.eventLoopStop?.('event_capture_charge'); for(const o of [c.g,c.hole,...c.holes.map(h=>h._mouth)]){ if(!o?.active)continue; if(fade&&this.tweens){ this.tweens.add({targets:o,alpha:0,duration:700,onComplete:()=>o.destroy()}); } else o.destroy(); } }
  captureKillBonus(e){ const o=this.waveObjective,z=this._captureZone; if(!o||o.done||o.type!=='capture'||!z||!e||e.isBoss)return; if(this.dist(e.x,e.y,z.x,z.y)>z.radiusGoal)return; const cap=o.target*.25,left=cap-(o._killB||0); if(left<=0)return; const add=Math.min(left,e.isElite||e.isMini?1.5:.15); o._killB=(o._killB||0)+add; o.progress=Math.min(o.target,o.progress+add);   /* v8.1.164 เจ้าของ: มอนกรูเข้าวงเยอะ หลอดเต็มเร็วไป → ฆ่าในวง +0.15 วิ (Elite/มินิ +1.5) · โบนัสรวมไม่เกิน 25% ของหลอด */ if(add>=1||Math.random()<.2)this.floatText?.(e.x,e.y-30,'+'+(Math.round(add*10)/10)+'s',0xffd166); }   /* v8.1.77 ฆ่าในวง = หลอดเร็วขึ้น */
  spawnCaptureZone(){
    const o=this.waveObjective;if(!o||o.type!=='capture')return;const pos=this.objectivePosition(0,1,250,370),r=140;   /* v8.1.77 เจ้าของ: วงใหญ่ขึ้น ขยายมากขึ้น · หลอดไม่ลดเลย */
    this._captureZone=this.camWorld(this.add.circle(pos.x,pos.y,r,o.color,.12).setStrokeStyle(4,o.color,.82).setDepth(pos.y-2));this._captureZone.radiusGoal=r;this._captureZone.r0=r;   // ขยายเขต (112→140) ให้ยืนในวงแล้วนับแน่นอน
    this._captureRing=this.camWorld(this.add.image(pos.x,pos.y,'vfx_magic_circle').setTint(o.color).setDisplaySize(r*2,r*1.72).setDepth(pos.y-1).setAlpha(.7));
    this.tweens.add({targets:this._captureRing,rotation:TAU,alpha:{from:.36,to:.68},duration:1800,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  }
  // v5.19.1 Capture ลูกเล่น: สีวงค่อย ๆ เปลี่ยนเป็นทอง · วงในโตตาม progress · เสียงติ๊งทุก 10% · มอนพุ่งเข้ามาเป็นระลอกพร้อมลูกศรเตือน
  // v8.0.18 เจ้าของ: ไม่ยืนในวง = เลือดไหลเหมือน Escort · ผ่อนผัน 2.5 วิ (เริ่มภารกิจ 4.5 วิ ให้เดินไปถึงวง) · กลับเข้าวง = ชั้นลดเร็ว
  captureBleed(dt,inside,o){ const P=this.player; if(!P||this._inTutorial||this.state!=='play')return; if(o._out==null)o._out=-2;
    if(inside){o._zoneWarn=false; if(o._out>0){ o._out=Math.max(0,o._out-dt*4); if(!o._out){ o._bleedStk=0; o._bleedT=0; } } return; }
    if(o._out<=0&&!o._zoneWarn){o._zoneWarn=true;Sfx.orderCue?.('out_of_zone',.22,1);}o._out+=dt; if(o._out<2.5)return; const stk=Math.min(10,1+Math.floor((o._out-2.5)/1.5));this._heroBleed=o;this._heroBleedAt=this.elapsed||0; if(stk!==o._bleedStk){ o._bleedStk=stk; this.floatText(P.x,P.y-60,'🩸 Bleeding ×'+stk,0xff4a5a); if(stk===1)this.showBanner('🩸 Get back in the ring!','Standing outside the ring makes you bleed',1400); }
    o._bleedT=(o._bleedT||0)+dt; if(o._bleedT>=.5){ o._bleedT=0;Sfx.orderCue?.('bleed_tick',.12,.45); P.hp-=P.maxhp*.004*stk; P.setTint?.(0xff6a6a); this.time.delayedCall(120,()=>{ if(P.active)P.clearTint?.(); }); if(P.hp<=0)this.die(); } }
  tickCaptureFX(dt,inside,o){ const z=this._captureZone;if(!z)return;if(inside&&this.state==='play'&&!o.done){const f=Math.min(1,o.progress/Math.max(1,o.target));Sfx.eventLoopStart?.('event_capture_charge',.16+.18*f,.8+.5*f);}else Sfx.eventLoopStop?.('event_capture_charge');const f=Phaser.Math.Clamp(o.progress/Math.max(1,o.target),0,1);
    const r0=z.r0||140,want=r0+f*240;z.radiusGoal+=(want-z.radiusGoal)*Math.min(1,dt*3);const R=z.radiusGoal;z.setRadius(R);if(this._captureRing)this._captureRing.setDisplaySize(R*2,R*1.72);
    const c0=Phaser.Display.Color.ValueToColor(o.color),c1=Phaser.Display.Color.ValueToColor(0xffd166),mix=Phaser.Display.Color.Interpolate.ColorWithColor(c0,c1,100,Math.round(f*100)),col=Phaser.Display.Color.GetColor(mix.r,mix.g,mix.b);
    z.setStrokeStyle(4+f*4,col,0.85);if(this._captureRing)this._captureRing.setTint(col);
    if(!this._captureFill){this._captureFill=this.camWorld(this.add.circle(z.x,z.y,R,col,0.3).setDepth(z.depth).setScale(0.02));}
    const fl=this._captureFill;fl.setFillStyle(col,inside?0.34:0.18);fl.setRadius(R);fl.scale+=((Math.max(0.02,f))-fl.scale)*Math.min(1,dt*6);
    z.setScale(1+Math.sin(this.time.now/(inside?140:320))*(inside?0.025:0.01));
    const step=Math.floor(f*10);if(step>(o._capStep||0)){o._capStep=step;if(Sfx.chestTick)Sfx.chestTick(step*3);
      const p=this.camWorld(this.add.circle(z.x,z.y,R*Math.max(.1,f),col,0).setStrokeStyle(5,col,0.9).setDepth(z.depth+1));this.tweens.add({targets:p,scale:1.35,alpha:0,duration:480,onComplete:()=>p.destroy()});
      this.floatText(z.x,z.y-R-10,(step*10)+'%',col);}
    if(inside&&f>0.05){o._rushT=(o._rushT??5)-dt;if(o._rushT<=0){o._rushT=Phaser.Math.FloatBetween(3.6,5.2)-f*1.2;this.captureRush(z);}}
    this.captureHud?.(z,R,f,col,inside,o); const q=Math.floor(f*4); if(q>(o._capQ||0)&&q<4){ o._capQ=q; this.capturePulse?.(z,R,col); } }
  /* v8.1.150 เจ้าของ: Capture the Zone ยืนเฉย ๆ ไม่รู้ทำอะไร → เส้นความคืบหน้ารอบขอบวง + วินาทีที่เหลือกลางวง + ทุก 25% วงปล่อยคลื่นผลักมอน · จบ = ล้างมอนรอบวง */
  captureHud(z,R,f,col,inside,o){ if(!this.add?.graphics)return; let g=this._captureArc; if(!g||!g.scene){ g=this._captureArc=this.camWorld(this.add.graphics().setDepth(z.depth+2)); }
    g.clear(); g.lineStyle(9,0x1a0f24,.45).strokeCircle(z.x,z.y,R+8); if(f>0){ g.lineStyle(7,col,.95).beginPath(); g.arc(z.x,z.y,R+8,-Math.PI/2,-Math.PI/2+TAU*f,false); g.strokePath(); }
    const left=Math.max(0,Math.ceil((o.target||0)-(o.progress||0))); let t=this._captureSec;
    if(!t||!t.scene){ t=this._captureSec=this.camWorld(this.add.text(z.x,z.y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'40px',color:'#ffffff',stroke:'#1a0f24',strokeThickness:7}).setOrigin(.5).setDepth(z.depth+3)); }
    t.setPosition(z.x,z.y).setText(inside?left+'s':'⬇ '+left+'s').setAlpha(inside?.95:.7).setColor(inside?'#ffffff':'#ffd0d8'); return left; }
  capturePulse(z,R,col){ if(!z)return 0; let n=0; const PR=R*1.25;
    (this.enemies?.getChildren?.()||[]).slice().forEach(e=>{ if(!e||!e.active||e.isBoss||e.isDummy)return; const d=this.dist(e.x,e.y,z.x,z.y); if(d>PR)return; const a=Math.atan2(e.y-z.y,e.x-z.x),hard=e.isElite||e.isMini;
      this.damage?.(e,(e.maxhp||e.hp||10)*(hard?.08:.4),e.x,e.y); if(e.active&&!hard){ e.knock=Math.max(e.knock||0,.35); e.setVelocity?.(Math.cos(a)*520,Math.sin(a)*520); } n++; });
    if(this.add?.circle){ const w=this.camWorld(this.add.circle(z.x,z.y,R*.3,col,0).setStrokeStyle(10,0xfff1b0,.95).setDepth(z.depth+2)); this.tweens?.add({targets:w,scale:PR/(R*.3),alpha:0,duration:420,ease:'Cubic.out',onComplete:()=>w.destroy()}); }
    this.screenShake?.(160,.006); Sfx.orderCue?.('mission_tube_pop',.35,.3); return n; }
  captureRush(z){ const a=Math.random()*TAU,far=Math.max(this.W,this.H)/this.viewZoom*0.55,sx=z.x+Math.cos(a)*far,sy=z.y+Math.sin(a)*far;
    const ang=Math.atan2(z.y-sy,z.x-sx),mx=z.x+Math.cos(a)*(z.radiusGoal+90),my=z.y+Math.sin(a)*(z.radiusGoal+90);
    const warn=this.camWorld(this.add.text(mx,my,'➤➤',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'34px',color:'#ff5a6e',stroke:'#1a0f24',strokeThickness:6}).setOrigin(0.5).setRotation(ang).setDepth(90000));
    this.tweens.add({targets:warn,alpha:{from:1,to:0.25},scale:{from:1,to:1.25},yoyo:true,repeat:3,duration:180,onComplete:()=>warn.destroy()});
    this.showBanner('⚠ Incoming!','Enemies are rushing the zone',900);if(Sfx.select)Sfx.select();
    this.time.delayedCall(1100,()=>{ if(!this._captureZone)return;const n=6+Math.min(4,this.stageIndex||0)+Math.round(Phaser.Math.Clamp(this.waveObjective?this.waveObjective.progress/25:0,0,1)*4),pa=Math.atan2(sy-this.player.y,sx-this.player.x),pd=this.dist(sx,sy,this.player.x,this.player.y);
      for(let i=0;i<n;i++){const e=this.spawnEnemy(i%2?'fast':'dasher',pa+Phaser.Math.FloatBetween(-0.18,0.18),pd*Phaser.Math.FloatBetween(0.95,1.08));if(e&&e.spd)e.spd*=1.35;} }); }
  // v5.22: จบ capture = วงชำระขยายใหญ่ทั่วจอ + จอแฟลชขาวทอง + เสียง
  captureFinishSweep(x,y,R){ let n=0; const FR=Math.max(R*2.2,520); (this.enemies?.getChildren?.()||[]).slice().forEach(e=>{ if(!e||!e.active||e.isBoss||e.isDummy||this.dist(e.x,e.y,x,y)>FR)return; const hard=e.isElite||e.isMini; this.damage?.(e,(e.maxhp||e.hp||10)*(hard?.25:5),e.x,e.y); n++; }); return n; }   /* v8.1.150 จบวง = ล้างมอนธรรมดารอบวง (Elite/มินิบอส −25%) */
  captureDoneFX(){ Sfx.eventLoopStop?.('event_capture_charge');Sfx.rewardCue?.('sfx_event_capture_complete',.65);this._captureSfxAt=this.time.now;const z=this._captureZone;if(!z)return;const R=z.radiusGoal,x=z.x,y=z.y;

    this.screenFlash(0xfff4c2,0.85,520);this.screenShake(420,0.012);if(this.hitStop)this.hitStop(60);
    this.captureFinishSweep?.(x,y,R);
    const big=Math.max(this.W,this.H)/this.viewZoom/R*1.1;
    const disc=this.camWorld(this.add.circle(x,y,R,0xffe08a,0.55).setDepth(89990));this.tweens.add({targets:disc,scale:big,alpha:0,duration:900,ease:'Cubic.out',onComplete:()=>disc.destroy()});
    const ring=this.camWorld(this.add.image(x,y,'vfx_magic_circle').setTint(0xffd166).setDisplaySize(R*2,R*1.72).setDepth(89995));this.tweens.add({targets:ring,scaleX:ring.scaleX*big*0.8,scaleY:ring.scaleY*big*0.8,rotation:TAU*0.5,alpha:0,duration:1000,ease:'Cubic.out',onComplete:()=>ring.destroy()});
    for(let i=0;i<4;i++)this.time.delayedCall(i*120,()=>{const r=this.camWorld(this.add.circle(x,y,R,0xffd166,0).setStrokeStyle(10-i*2,0xfff1b0,1).setDepth(90000));this.tweens.add({targets:r,scale:big*(0.6+i*0.15),alpha:0,duration:800,ease:'Cubic.out',onComplete:()=>r.destroy()});});
    this.floatText(x,y-R-20,'✨ PURIFIED!',0xffd166); }
  // ===== Escort the Wisp (purge objective) =====
  _wispTuning(){ return {escortR:130,channel:2.4+this.stageIndex*0.18,speed:96,away:.38,drainR:56,drain:(0.34+this.stageIndex*0.05)*.6,regen:0.42,respawn:2.5}; }   /* v8.1.144 owner 🐞: ring 160→130 · wisp drifts slowly on its own (was stopping) · in the ring a bit faster but not rushing (120→96, close ×1.7→×1.25) · tougher (drain ×0.6) */   /* v8.1.121 เจ้าของ: วงคุ้มกัน Wisp เล็กลง 220 → 160 */
  spawnPurifyWisp(){
    const o=this.waveObjective;if(!o||o.type!=='purge')return;
    this.killPurifyWisp(false);
    const a=Phaser.Math.FloatBetween(0,TAU),x=Phaser.Math.Clamp(this.player.x+Math.cos(a)*70,-WORLD/2+90,WORLD/2-90),y=Phaser.Math.Clamp(this.player.y+Math.sin(a)*70,-WORLD/2+90,WORLD/2-90);
    const painted=this.textures.exists('objective_wisp');
    const wisp=this.camWorld((painted?this.add.image(x,y,'objective_wisp').setScale(.36):this.add.circle(x,y,14,0xfff2b8,1).setStrokeStyle(3,o.color,0.9)).setDepth(y+2));
    wisp._light=1;wisp._state='travel';wisp._channel=0;
    wisp._glow=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(o.color).setDepth(y+1).setScale(0.5).setAlpha(0.8).setBlendMode(Phaser.BlendModes.ADD));
    this.tweens.add({targets:wisp._glow,scale:{from:0.5,to:0.72},alpha:{from:0.85,to:0.4},rotation:TAU,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    wisp._bob=this.tweens.add({targets:wisp,scale:{from:painted?.33:.9,to:painted?.39:1.12},duration:640,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    this._wisp=wisp;this._wispRespawn=0;this.vfxSpawnPoof(x,y);
    if(!this.objNodeG){this.objNodeG=this.add.graphics().setScrollFactor(1).setDepth(90040);this.camWorld(this.objNodeG);}
  }
  killPurifyWisp(respawn){
    if(this._wispSnd){ this._wispSnd=false; Sfx.eventLoopStop?.('event_wisp_purify_charge'); if(respawn)Sfx.ev?.('wisp_purify_interrupt',.45,1.5); }
    const w=this._wisp;if(w){if(w._bob)this.tweens.killTweensOf(w);if(w._glow){this.tweens.killTweensOf(w._glow);if(w._glow.active)w._glow.destroy();}this.burst(w.x,w.y,0xfff2b8);if(w.active)w.destroy();this._wisp=null;}
    const t=this._wispTuning();this._wispRespawn=respawn?t.respawn:0;
  }
  nearestCore(){ let best=null,bd=1e9;if(this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n||!n.active||!n._waveObjectiveNode||!n._coreLocked||n._purified)return;const d=this.dist(n.x,n.y,this._wisp.x,this._wisp.y);if(d<bd){bd=d;best=n;}});return best; }
  purifyCore(node){
    if(!node||node._purified)return;node._purified=true; if(this._wispSnd){this._wispSnd=false;Sfx.eventLoopStop?.('event_wisp_purify_charge');} Sfx.ev?.('wisp_purify_complete',.6,.5);const x=node.x,y=node.y;
    for(let i=0;i<3;i++)this.time.delayedCall(i*90,()=>this.vfxHitRing(x,y,0xfff2b8,false));
    this.destroyWaveObjectiveNode(node);   // นับ progress + เช็คจบ
  }
