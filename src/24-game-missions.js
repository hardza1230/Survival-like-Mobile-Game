  /* v8.2.2 เจ้าของ: ออกนอกวง Wisp ต้องเข้าใจได้ทันทีในฉาก → ทุกครั้งที่เลือดไหล (0.5 วิ) มีเงาดำพุ่งออกจากความมืดมาฟันตัวเรา (ทิศสุ่มฝั่งที่ห่าง Wisp) · ซ้อนมาก = ยาว/หนาขึ้น · ภาพเท่านั้น ดาเมจเท่าเดิม */
  escortShadowStrike(P,w,stk=1){ if(!P||!this.add?.graphics||!this.tweens||((typeof Save!=='undefined'&&Save.data?.settings?.vfx)??1)===0)return null;
    const away=Math.atan2(P.y-w.y,P.x-w.x)+(Math.random()-.5)*1.6,d=150+Math.min(10,stk)*8,sx=P.x+Math.cos(away)*d,sy=P.y+Math.sin(away)*d,g=this.camWorld(this.add.graphics().setDepth((P.depth||P.y)+5)),st={k:0},L=26+stk*3;
    this.tweens.add({targets:st,k:1,duration:170,ease:'Quad.in',onUpdate:()=>{ if(!g.active)return; const x=sx+(P.x-sx)*st.k,y=sy+(P.y-20-sy)*st.k,a=Math.atan2(P.y-20-sy,P.x-sx),tx=x-Math.cos(a)*L,ty=y-Math.sin(a)*L; g.clear(); g.lineStyle(10+stk*.6,0x1a0822,.75).lineBetween(tx,ty,x,y); g.lineStyle(4,0x7a2a9a,.9).lineBetween(tx,ty,x,y); g.fillStyle(0xff3355,.95).fillCircle(x,y,4+stk*.3); g.fillStyle(0xffd6e0,1).fillCircle(x+Math.cos(a+1.4)*6,y+Math.sin(a+1.4)*6,1.8).fillCircle(x+Math.cos(a-1.4)*6,y+Math.sin(a-1.4)*6,1.8); },
      onComplete:()=>{ if(!g.active)return; g.clear(); const cx=P.x,cy=P.y-20; for(let i=0;i<3;i++){ const a=-.6+i*.6+Math.random()*.2; g.lineStyle(3,0xff3355,.95).lineBetween(cx-Math.cos(a)*16,cy-Math.sin(a)*16+i*4-4,cx+Math.cos(a)*16,cy+Math.sin(a)*16+i*4-4); } this.tweens.add({targets:g,alpha:0,duration:220,onComplete:()=>g.destroy()}); }});
    return g; }
  tickPurifyWisp(dt){
    const o=this.waveObjective;if(!o||o.done)return;const t=this._wispTuning();
    if(!this._wisp){ this._wispRespawn-=dt; if(this._wispRespawn<=0&&o.progress<o.target)this.spawnPurifyWisp(); this.renderWispHUD(); return; }
    const w=this._wisp,near=this.dist(this.player.x,this.player.y,w.x,w.y)<=t.escortR;
    if(!near){w._awayHint=(w._awayHint||0)-dt;if(w._awayHint<=0){w._awayHint=5;this.floatText(w.x,w.y-70,'Stay near the Wisp!',0xffc6a2);}}else w._awayHint=0;
    // v7.9.82 เจ้าของ: ยืนนอกวง Wisp = เลือดไหล ซ้อนแรงขึ้นทุก 1.5 วิ (สูงสุด 10) · กลับเข้าวง = หายเร็ว
    { const P=this.player; if(!near&&!this._inTutorial){ w._out=(w._out||0)+dt; const stk=Math.min(10,1+Math.floor(w._out/1.5));this._heroBleed=w;this._heroBleedAt=this.elapsed||0; if(stk!==w._bleedStk){ w._bleedStk=stk; this.floatText(P.x,P.y-60,'🩸 Bleeding ×'+stk,0xff4a5a); }
        w._bleedT=(w._bleedT||0)+dt; if(w._bleedT>=.5){ w._bleedT=0; this.escortShadowStrike?.(P,w,stk); P.hp-=P.maxhp*.004*stk; P.setTint?.(0xff6a6a); this.time.delayedCall(120,()=>{ if(P.active)P.clearTint?.(); }); if(P.hp<=0){ this.die(); return; } } }
      else if(w._out){ w._out=Math.max(0,w._out-dt*4); if(!w._out){ w._bleedStk=0; w._bleedT=0; } } }
    // 🕯️ Raiders: ทุก ~7s ส่งมอนแดง 2 ตัวพุ่งเข้าหา Wisp (ต้องคอยสกัด)
    this._raidT=(this._raidT??5)-dt;if(this._raidT<=0){this._raidT=7;if(this.enemies.countActive(true)<this.maxLive){let rx=0,ry=0,rn=0;for(let i=0;i<2;i++){const e=this.spawnEnemy('fast');if(e){e._wispRaider=true;e.tintColor=0xff6a6a;e.setTint(0xff6a6a);rx+=e.x;ry+=e.y;rn++;}}this.floatText(w.x,w.y-60,'⚠ Raiders!',0xff6a6a);if(rn){const a=Math.atan2(ry/rn-w.y,rx/rn-w.x);this.floatText(w.x+Math.cos(a)*120,w.y+Math.sin(a)*120,'⚠',0xff6a6a);}   /* v8.1.79 บอกทิศโจร */}}
    // มอนกัดกินแสง
    let foes=0;this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini&&this.dist(e.x,e.y,w.x,w.y)<=t.drainR)foes++;});
    if(foes>0)w._light-=t.drain*foes*dt; else if(near)w._light=Math.min(1,w._light+t.regen*dt);
    if(w.setStrokeStyle)w.setStrokeStyle(3,foes>0?0xff5a6a:o.color,0.9);
    if(w.texture)w.setTint(foes>0?0xffa2a2:0xffffff);
    if(w._light<=0){this.killPurifyWisp(true);this.floatText(w?w.x:this.player.x,(w?w.y:this.player.y)-40,'Wisp snuffed out!',0xff5a6a);this.renderWispHUD();return;}
    const target=this.nearestCore();
    if(!target){this.renderWispHUD();return;}
    w._glow.setPosition(w.x,w.y);
    if(w._state==='travel'){
      {const a=Math.atan2(target.y-w.y,target.x-w.x),close=near&&this.dist(this.player.x,this.player.y,w.x,w.y)<=90,sp=t.speed*(near?(close?1.25:1):t.away);if(close&&Math.random()<dt*2)this.vfxHitRing?.(w.x,w.y,0xffe6a0,false);w.x+=Math.cos(a)*sp*dt;w.y+=Math.sin(a)*sp*dt;   /* v8.1.79 เจ้าของ: ยืนชิดดวงไฟ = เดินเร็วขึ้น ×1.7 */w.setDepth(w.y+2);w._glow.setDepth(w.y+1);}
      if(this.dist(w.x,w.y,target.x,target.y)<=44){w._state='channel';w._channel=0;}
    } else {  // channel
      if(near){ if(!this._wispSnd||!Sfx._eventLoops?.event_wisp_purify_charge?.isPlaying){this._wispSnd=true;Sfx.eventLoopStart?.('event_wisp_purify_charge',.32);} } else if(this._wispSnd){ this._wispSnd=false; Sfx.eventLoopStop?.('event_wisp_purify_charge'); }   // v7.2 charge loop only while channeling + near
      if(near){w._channel+=dt;const cf=Phaser.Math.Clamp(w._channel/t.channel,0,1),painted=target.texture.key==='objective_cursed_core';target.setTint(cf>0.5?0xffffff:painted?0xffd7e9:o.color);target.setScale((painted?.68:.66)*(1+Math.sin(this.time.now/90)*0.06*cf));}
      if(w._channel>=t.channel){this.purifyCore(target);w._state='travel';w._channel=0;if(o.done)return;}
    }
    this.renderWispHUD();
  }
  /* v8.2.45 เจ้าของ (ใบ 92 ชุด C + ไอเดียโดม): เลิกเส้นวงกลมแข็ง → โดมแสงบาง ๆ รอบ Wisp · ขอบไหวนิด ๆ (ไร้รูปร่าง) · ในเขต = ทองอุ่น · นอกเขต = หรี่ลงเป็นแดงม่วง (เลือดไหลเหมือนเดิม) · ขอบจริงยังอยู่ที่ escortR */
  wispDome(g,w,R,near){ const T=(this.time?.now||0)/1000,N=36,col=near?0xffe6a0:0xff6a7a,pts=k=>{const a=[];for(let i=0;i<N;i++){const q=i/N*Math.PI*2,r=R*k*(1+.022*Math.sin(i*2.1+T*1.3)+.014*Math.sin(i*3.7-T*2.1));a.push({x:w.x+Math.cos(q)*r,y:w.y+Math.sin(q)*r});}return a;};
    g.fillStyle(col,near?.07:.04).fillCircle(w.x,w.y,R); g.fillStyle(col,near?.06:.03).fillCircle(w.x,w.y,R*.62);
    const edge=pts(1); if(g.strokePoints){ g.lineStyle(7,col,near?.07:.05).strokePoints(edge,true,true); g.lineStyle(3,col,near?.16:.12).strokePoints(edge,true,true); g.lineStyle(1.2,0xffffff,near?.38:.22).strokePoints(edge,true,true); } else { g.lineStyle(2,col,near?.3:.45); g.strokeCircle(w.x,w.y,R); }
    if(g.beginPath&&g.arc){ g.lineStyle(3,0xffffff,near?.22:.1); g.beginPath(); g.arc(w.x,w.y,R*.84,Math.PI*1.08,Math.PI*1.42,false); g.strokePath?.(); g.lineStyle(2,0xffffff,near?.12:.06); g.beginPath(); g.arc(w.x,w.y,R*.72,Math.PI*1.12,Math.PI*1.3,false); g.strokePath?.(); } }
  wispFeedback(w,r,near){
    const p=this.player;
    let art=w._feedbackArt;
    if(!art){
      art=w._feedbackArt={};
      w.once?.('destroy',()=>{for(const sprite of Object.values(art))if(sprite?.active)sprite.destroy();});
    }
    const show=(slot,key,x,y,width,height,depth,visible)=>{
      let sprite=art[slot];
      if(visible&&(!sprite||!sprite.active))sprite=art[slot]=this.feedbackSprite?.(key,x,y,width,height,depth,true);
      if(!sprite?.active)return null;
      sprite.setVisible(visible);
      if(visible)sprite.setPosition(x,y).setDepth(depth).setDisplaySize(width,height);
      return sprite;
    };
    const dome=show('dome','ws92_light_pool',w.x,w.y,r*2/.8,r*2/.8,-99300,true);
    if(dome)dome.setTint(near?0xffffff:0xff6a7a).setAlpha(near?.94:.62);
    show('creep','ws92_dark_creep',p.x,p.y+18,90,90,p.y+2,!near);
    const dx=w.x-p.x,dy=w.y-p.y,len=Math.hypot(dx,dy);
    const tether=show('tether','ws92_tether',(p.x+w.x)/2,(p.y+w.y)/2,len,10,-99299,near&&len>8);
    if(tether?.visible)tether.setRotation(Math.atan2(dy,dx)).setAlpha(.7);
    return !!dome;
  }
  renderWispHUD(){
    if(!this.objNodeG)return;const g=this.objNodeG;g.clear();const o=this.waveObjective;if(!o||o.type!=='purge'||o.done)return;const t=this._wispTuning(),w=this._wisp;
    // ไฮไลต์แกนคำสาปที่ยังไม่ถูกชำระ
    if(this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n||!n.active||!n._waveObjectiveNode||!n._coreLocked||n._purified)return;g.lineStyle(2,o.color,0.5);g.strokeCircle(n.x,n.y,30);});
    if(!w)return;
    const next=this.nearestCore();if(next){g.lineStyle(2,0xffe8ab,0.32);g.lineBetween(w.x,w.y,next.x,next.y);}
    // วง escort (จางลงเมื่อไกล)
    const near=this.dist(this.player.x,this.player.y,w.x,w.y)<=t.escortR;if(!this.wispFeedback?.(w,t.escortR,near))this.wispDome(g,w,t.escortR,near);
    // หลอดแสงของ Wisp
    const bw=56,bx=w.x-bw/2,by=w.y-40;g.fillStyle(0x000000,0.55);g.fillRoundedRect(bx-2,by-2,bw+4,8,4);g.fillStyle(0x241a10,1);g.fillRoundedRect(bx,by,bw,4,2);
    if(w._light>0){g.fillStyle(w._light>0.35?0xffe08a:0xff6a5a,1);g.fillRoundedRect(bx,by,Math.max(2,bw*w._light),4,2);}
    // หลอด channel เมื่อกำลังชำระแกน
    if(w._state==='channel'){const cf=Phaser.Math.Clamp(w._channel/t.channel,0,1),cx=w.x-bw/2,cy=w.y-52;g.fillStyle(0x000000,0.55);g.fillRoundedRect(cx-2,cy-2,bw+4,8,4);g.fillStyle(0x1a2a24,1);g.fillRoundedRect(cx,cy,bw,4,2);g.fillStyle(0x8affd0,1);g.fillRoundedRect(cx,cy,Math.max(2,bw*cf),4,2);}
  }
  /* v8.2.27 เจ้าของ (SCAMPER): ข้อความลอยพร้อมกันไม่เกิน FLOAT_MAX · ข้อความเดียวกันใกล้กันภายใน 0.6 วิ = รวมเป็นอันเดียว (เด้งเตือน) · เกินแล้วอันเก่าสุดหายก่อน */
  floatText(x,y,msg,color){ const L=this._floatList||(this._floatList=[]),now=this.time?.now||0; for(let i=L.length-1;i>=0;i--)if(!L[i].active)L.splice(i,1);
    const dup=L.find(q=>q._msg===msg&&now-q._at<600&&Math.abs(q._x-x)<90&&Math.abs(q._y-y)<90); if(dup){ dup._n=(dup._n||1)+1; if(dup._n<=9)this.tweens.add({targets:dup,scale:{from:1.25,to:1},duration:160}); return dup; }
    while(L.length>=(typeof FLOAT_MAX!=='undefined'?FLOAT_MAX:5)){ const o=L.shift(); this.tweens.killTweensOf?.(o); o.destroy?.(); }
    const t=this.camWorld(this.add.text(x,y,msg,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#'+(color||0xffffff).toString(16).padStart(6,'0'),stroke:'#000',strokeThickness:4}).setOrigin(.5).setDepth(95000)); t._msg=msg; t._at=now; t._x=x; t._y=y; L.push(t); this.tweens.add({targets:t,y:y-28,alpha:{from:1,to:0},duration:1100,ease:'Cubic.out',onComplete:()=>t.destroy()}); return t; }
  startStoryHuntRound(o){ Sfx.ev?.('hunt_threat_start',.55,2);
    o._huntPhase='clear';o._huntKills=0;o._huntKillGoal=6+2*Math.floor((this.stageIndex||0)/5);o._huntSpawnAt=0;
  }
  /* v7.9.81 เจ้าของ: แนะนำเควส = หยุดเกม แพนกล้องไปที่เป้าหมาย + สปอตไลต์ + ชื่อ แล้วกลับมาที่ผู้เล่น · 3 ครั้งแรกต่อชนิด · แตะ = ข้าม */
  questFocusTargets(type){ const o=this.waveObjective,out=[],pt=(q,r,l)=>{ if(q&&(q.active!==false))out.push({x:q.x,y:q.y,r,l}); };
    if(type==='hunt'){ this.enemies.children.iterate(e=>{ if(e?.active&&e._waveObjectiveTarget)pt(e,95,'🎯 Marked Elite'); }); }
    else if(type==='purge'){ pt(this._wisp,80,'🕯️ The Wisp'); this.waveNodes?.children.iterate(n=>{ if(n?.active&&n._waveObjectiveNode&&out.length<3)pt(n,90,'Cursed core'); }); }
    else if(type==='capture'&&this._crack)pt(this._crack.st==='final'?(this._crack.holes[this._crack.holes.length-1]):this._crack.tip,60,this._crack.st==='final'?'🕳️ Clear the last hole':'🕳️ Touch the crack');
    else if(type==='capture')pt(this._captureZone,(this._captureZone?.radius||130)+20,'🔷 Stand in the ring');
    else if(type==='cleanAir')pt(this._cleanAirZone,(this._cleanAirZone?.radius||145)+20,'🫧 Clean-air ring');
    else if(type==='defendNectar')(this._nectarFlowers||[]).slice(0,1).forEach(f=>pt(f,90,'🌺 Protect the flower'));
    else if(type==='breakRoots')this.waveNodes?.children.iterate(n=>{ if(n?.active&&n._rootAnchor&&out.length<4)pt(n,95,n._lure?'🪨 Lure the root here':'🌳 Root anchor'); });
    else if((typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(type))&&this._sig){ const S=this._sig; if(type==='seedRift')(S.carriers||[]).filter(e=>e&&e.active).slice(0,3).forEach(e=>pt(e,60,'🌰 Catch the carrier')); else if(type==='shakeTrees')(S.trees||[]).filter(t=>!t.done).forEach(t=>pt(t,100,'🌳 Stand under the tree'))   /* v8.2.14 ไม่ชี้ต้นที่เขย่าแล้ว */; else if(type==='mirrorPath'){ if((S.mirrors||[]).every(m=>m.lit))pt({x:S.cx,y:S.cy},80,'💎 The crystal');   /* v8.2.14 คริสตัลชี้เมื่อชาร์จกระจกครบแล้วเท่านั้น */ (S.mirrors||[]).filter(m=>!m.lit).slice(0,1).forEach(m=>pt(m,90,'🪞 Charge each mirror'))   /* v8.2.14 ชี้กระจกบานที่ยังไม่ชาร์จ */; } else if(type==='vaultAltar'||type==='ultimatum'){ if(S.phase==='fight'&&S.goal==='collect'&&S.seed)pt(S.seed,40,'✨ Grab the seed'); else pt({x:S.x,y:S.y},200,S.phase==='fight'?'🗝️ Stay near the altar':'🗝️ Pick a pact stone'); }   /* v8.2.14 รอบเก็บเมล็ดชี้ที่เมล็ด */ else if(type==='hungerHerald'){ let t=null,bd=1e9; this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&(e._hhPow||e._hhMin)){ const d=this.player?Math.hypot(e.x-this.player.x,e.y-this.player.y):0; if(d<bd){ bd=d; t=e; } } }); if(t)pt(t,60,t._hhMin?'💥 Stop the '+(HH_MIN_LOOK[t._hhMin]?.name||'minion'):'💜 Beat the empowered one'); }   /* v8.2.20 Herald ตีไม่ได้ → ชี้ตัวที่ถูกบัฟ/ลูกน้องพิเศษที่ใกล้สุด */ else if(type==='grandmasGolem'){ if(S.golem&&S.golem.active)pt(S.golem,110,'🗿 Beat the golem'); else if(S.parts&&S.parts.length>=S.min&&!S.carriers.some(c=>c.e&&c.e.active))pt({x:S.x,y:S.y},100,'🔥 Bake it in the oven'); else { const d=(S.drops||[])[0],c=(S.carriers||[]).find(c=>c.e&&c.e.active); if(d)pt(d,50,'Grab the golem part'); else if(c)pt(c.e,90,c.p.em+' Flavor carrier'); if(S.parts&&S.parts.length>=S.min)pt({x:S.x,y:S.y},100,'🔥 Bake now or find more parts'); } } else if(type==='grandmasPot'){ pt({x:S.x,y:S.y},(S.R||200)+10,S.phase==='wait'?'🍲 Step in to begin':'🍲 Fight inside the light'); } else if(type==='hungerDomain'){ if(S.lord&&S.lord.active)pt(S.lord,130,'🖐️ The Breachlord'); } else if(type==='hungerSiege')pt({x:S.x,y:S.y},S.R+10,'🏰 Hold the circle'); else if(type==='hungersMouth'){ if(S.phase==='seek')pt({x:S.x,y:S.y},85,'✋ Touch the Hunger’s hand'); else { const c=(S.chests||[]).find(c=>c.t&&!c.open),sh=(S.shards||[])[0]; if(c)pt(c,70,'🤲 Breach chest'); else if(sh)pt(sh,50,'🔮 Splinter'); } } else if(type==='creepingRoots'){ pt({x:S.x,y:S.y},90,'🌺 The nectar flower'); (S.lanes||[]).filter(L=>L.open).slice(0,1).forEach(L=>pt(L.pts[0],80,'🌱 Stand on the root mother')); } else if(type==='frozenPantry'){ if(S.phase==='seek')pt({x:S.x,y:S.y},95,'🫙 Open the sugar jar'); else (S.st||[]).filter(q=>q.state==='frozen').slice(0,1).forEach(q=>pt(q,70,'🧊 Walk close to paint it')); } else if(type==='lastLight')(S.lamps||[]).filter(L=>L.alive).sort((a,b)=>a.hp/a.maxhp-b.hp/b.maxhp).slice(0,1).forEach(L=>pt(L,120,'🏮 Keep the lanterns lit'))   /* v8.2.14 ชี้โคมที่ใกล้ดับที่สุด */; }
    if(!out.length&&type==='grandmasGolem'&&this._sig){ const S=this._sig; if(S.golem&&S.golem.active)pt(S.golem,90,'🗿 Beat Grandma’s Golem'); else if(S.x!=null)pt({x:S.x,y:S.y},90,'🗿 Grandma’s Golem'); }
    if(!out.length&&type==='seedRift'&&this._sig?.type==='seedRift'&&this._sig.x!=null){ const S=this._sig; pt({x:S.x,y:S.y},S.curR||S.R||110,'🌀 The Seed Rift'); }
    if(!out.length&&type==='cleanAir'&&this._cleanAir?.v2){ const c=this._cleanAir; pt({x:c.x,y:c.y-20},60,c.phase==='lure'?'🫧 Grab the fresh air':'🫧 Fresh air'); }
    return out; }
  /* v8.2.40 เป้าหมายบางภารกิจโผล่ทีหลัง (Herald/Seed Rift/Golem/Clean Air) → ลองทุก 1 วิ นานสุด 20 วิ แล้วส่องตอนเจอ */
  questFocusWhenReady(o,type,n=0){ this.time?.delayedCall?.(n?1000:350,()=>{ if(this.waveObjective!==o||o.done||(this._qfRun||{})[type])return; let tg=[]; try{ tg=this.questFocusTargets(type)||[]; }catch(e){}
    if(tg.length&&this.state==='play'){ this.questFocus(type); return; } if(n<20)this.questFocusWhenReady(o,type,n+1); }); }
  counterTeach(x,y){ const d=typeof Save!=='undefined'&&Save.data; if(!d||this._inTutorial||(d.counterTaught||0)>=2||this._counterTaughtRun)return; this._counterTaughtRun=true; d.counterTaught=(d.counterTaught||0)+1; Save.save?.();
    this.rubyTip?.('counter',0); this.time?.delayedCall(150,()=>{ if(this.state==='play')this.questFocus('counter',true,[{x,y,r:52,l:'🦶 Dash into it!'}]); }); }
  questFocus(type,force,tgs){ if(this.state!=='play'||this._inTutorial||this.recipeMode&&!this._recipeMission||!this.time||!this.cameras)return; const d=Save.data,seen=d.questFocusSeen||(d.questFocusSeen={});
    const run=this._qfRun||(this._qfRun={}); if(!force&&run[type])return; const tg=tgs||this.questFocusTargets(type); if(!tg.length)return; run[type]=1; seen[type]=(seen[type]||0)+1;   /* v8.2.40 เจ้าของ (แผน ก): ส่องครั้งแรกที่ภารกิจนั้นขึ้นในแต่ละด่าน (เดิม 3 ครั้งแรกตลอดเซฟ) */Sfx.orderCue?.('quest_focus',.3,.7);
    const cam=this.cameras.main,vz=this.viewZoom||cam.zoom||1; this.state='cinematic'; this.physics.pause(); this.player.setVelocity?.(0,0); cam.stopFollow();
    const g=this.camWorld(this.add.graphics().setDepth(95000)),lab=this.camUI(this.add.text(this.W/2,this.H*.24,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#fff1a8',stroke:'#1a0f1e',strokeThickness:6,align:'center'}).setOrigin(.5).setDepth(130).setAlpha(0));
    const hint=this.camUI(this.add.text(this.W/2,this.H*.24+30,'',{fontFamily:'sans-serif',fontSize:'11px',color:'#d9cce6'}).setOrigin(.5).setDepth(130).setAlpha(0));   /* v8.0.70 เจ้าของ: สอนในด่านแตะข้ามไม่ได้ (นิ้วแตะเดินบ่อย ข้ามก่อนได้อ่าน) */
    const ruby=this.camUI(this.add.container(this.W-86,this.H*.24+60).setDepth(131)); let pointTick=null;
    ruby.once('destroy',()=>pointTick?.remove());
    if(this.tuHas('ruby_point')){ const im=this.tuImg('ruby_point',0,0,0,84,84); ruby.add(im); let frame=0; const rn=this.textures.get('ruby_point')?.has?.('cell7')?8:4; pointTick=this.time.addEvent({delay:rn>=8?90:180,loop:true,callback:()=>{ if(im.active)im.setFrame('cell'+(++frame%rn)); }}); }   /* v8.2.84 เฟส 6: Ruby ชี้ 8 เฟรม × 90ms (รอบ 720ms เท่าเดิม) */
    else ruby.add(this.rubyAvatar(-40,40,76,'cheer')); this.rubySparkle(ruby,0,0);
    let done=false,cur=null; const spot={r:600,a:0},timers=[];
    const draw=()=>{ g.clear(); if(!cur)return; const R=spot.r; g.lineStyle(3000,0x080410,.62*spot.a).strokeCircle(cur.x,cur.y,R+1500); g.lineStyle(4,0xfff1a8,.9*spot.a).strokeCircle(cur.x,cur.y,R); };
    const tw=this.tweens.addCounter({from:0,to:1,duration:1e9,onUpdate:draw});
    const finish=()=>{ if(done)return; done=true; timers.forEach(t=>t.remove?.()); pointTick?.remove(); ruby.destroy(); tw.remove(); g.destroy(); lab.destroy(); hint.destroy(); this._finishStoryCutscene=null;
      cam.pan(this.player.x,this.player.y,380,'Sine.easeInOut',true,(c,k)=>{ if(k<1)return; cam.startFollow(this.player,false,.2,.2); if(this.state==='cinematic'){ this.state='play'; this.physics.resume(); } }); };
    this._finishStoryCutscene=()=>{}; let t=0;
    tg.forEach((q,i)=>{ timers.push(this.time.delayedCall(t,()=>{ if(done)return; cur=q; cam.pan(q.x,q.y,i?420:520,'Sine.easeInOut',true); spot.r=Math.max(420,q.r*4); spot.a=0;
      this.tweens.add({targets:spot,r:q.r,a:1,duration:520,delay:i?260:360,ease:'Cubic.out'}); lab.setText(q.l).setAlpha(0); this.tweens.add({targets:lab,alpha:1,duration:220,delay:i?300:420}); Sfx.ui?.(); })); t+=i?1350:1550; });
    timers.push(this.time.delayedCall(t+150,finish)); }
  huntTargetActive(){
    let found=false;this.enemies.children.iterate(e=>{if(e?.active&&e._waveObjectiveTarget)found=true;});return found;
  }
  ensureHuntTarget(){
    const o=this.waveObjective;if(!o||o.type!=='hunt'||o.done||this.state!=='play'||this.mode!=='wave'||o._huntPhase==='clear'||this.huntTargetActive())return;
    if(this.time.now<(o._huntSpawnAt||0))return;this.spawnObjectiveElite();
  }
  spawnObjectiveElite(){
    const o=this.waveObjective;if(!o||o.type!=='hunt'||o.done||o._huntPhase==='clear'||this.huntTargetActive())return;const e=this.spawnElite(false,true);if(!e){
      // Keep the retry on the objective; level-up pauses cannot consume it.
      o._huntSpawnAt=this.time.now+1000;return;
    }
    o._huntSpawnAt=0;this.tweens.killTweensOf(e);e._fleeing=false;e._huntFlee=false;e._blinkCd=2.5;e.setAlpha(1);
    const lim=WORLD/2-120;e.setPosition(Phaser.Math.Clamp(e.x,-lim,lim),Phaser.Math.Clamp(e.y,-lim,lim));
    const cap=o.target>=2&&o.progress>=o.target-1; e.hp*=cap?3.2:1.6;e.maxhp=e.hp;e._waveObjectiveTarget=true;e._huntCaptain=cap;if(cap)this.artFollow?.(e,'msn71_stalker_captain',130);   /* v8.1.77 เจ้าของ: ตัวสุดท้ายเป็นหัวหน้า (ถึก ×2 ตัวใหญ่) ล้มแล้วได้กล่อง */   // เป้าหมายล่า = ถึกกว่าNormal (เดิม ×0.68 อ่อนไป)
    // Dedicated Hunt creature across every stage; stop any stage elite walk cycle before replacing its texture.
    e.anims.stop();e.setTexture('objective_sugar_stalker');e.setCircle(48,80,80);
    e.baseScale=cap?0.64:0.47;e.setScale(e.baseScale);e.roleName=cap?'Stalker Captain':'Sugar Stalker';e.tintColor=null;e.clearTint();this.resetEnemyPresentation(e); if(cap){ e.setTint?.(0xffe08a); this.showBanner?.('👑 The Stalker Captain','Defeat it to finish the Hunt — it drops a gear box',1800); if(typeof Sfx!=='undefined')Sfx.bossWarn?.(); }
    // ออร่าเรืองWaitบตัว (วงแหวนหมุน + เต้น) ให้เห็นชัดว่าตัวไหนเป็นเป้าหมาย
    e._objectiveAura=this.camWorld(this.add.image(e.x,e.y,'vfx_ring').setTint(0xff5a8a).setDepth(e.y-1).setScale(0.42).setAlpha(0.85).setBlendMode(Phaser.BlendModes.ADD));
    this.tweens.add({targets:e._objectiveAura,scale:{from:0.42,to:0.58},alpha:{from:0.9,to:0.45},rotation:TAU,duration:620,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    e._objectiveMark=this.camWorld((this.textures.exists('objective_hunt_mark')?this.add.image(e.x,e.y-72,'objective_hunt_mark').setScale(.8):this.add.text(e.x,e.y-72,'🎯',{fontSize:'27px',stroke:'#2a102f',strokeThickness:5}).setOrigin(.5)).setDepth(e.y+8));
    this.tweens.add({targets:e._objectiveMark,y:e.y-80,duration:520,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    if(!o._focused){ o._focused=true; try{ this.questFocus?.('hunt'); }catch(err){} }
  }
  clearObjectiveTargetFx(e){ if(e._objectiveAura){this.tweens.killTweensOf(e._objectiveAura);if(e._objectiveAura.active)e._objectiveAura.destroy();e._objectiveAura=null;} if(e._objectiveMark){this.tweens.killTweensOf(e._objectiveMark);if(e._objectiveMark.active)e._objectiveMark.destroy();e._objectiveMark=null;} }
  onWaveObjectiveTargetDown(e){
    const o=this.waveObjective;if(!o||o.type!=='hunt'||o.done||o._huntPhase==='clear')return;o.progress++;
    if(e&&e._huntCaptain&&!this._inTutorial&&this.spawnLoot){ const g=this.spawnLoot(e.x,e.y,Math.min(2,Math.floor((this.stageIndex||0)/5)+1)); if(g)this.lootHold?.(g,1500); }
    if(o.progress>=o.target){this.completeWaveObjective();return;}
    if(o._huntPhase){this.startStoryHuntRound(o);this.renderWaveObjectiveHUD();this.showBanner('Next Hunt round','Clear foes to reveal the next Elite',1400);return;}
    this.renderWaveObjectiveHUD();o._huntSpawnAt=this.time.now+700;
  }
  /* ===== v8.1.79 เจ้าของ: เลือกจังหวะเริ่มเอง (แท่น ✨) + Overcharge (เสี่ยงต่อ 12 วิ ได้ของ ×2) — แรงบันดาลใจ Ritual / Delirium ===== */
  missionArmable(o,planned,p){ return !!o&&!planned&&!(p&&p.forceType)&&!this._inTutorial&&!this.recipeMode&&!this.riftMode&&!this.bossRush&&!['survive','fill','hunt','vaultAltar','ultimatum'].includes(o.type)&&!(o.type==='cleanAir'&&typeof CLEANAIR_V2!=='undefined'&&CLEANAIR_V2)&&this.usesStoryBudget?.(); }
  /* v8.1.142 owner 🐞: the ✨ start ring → a "Start mission" button like Frozen Pantry's jar (tap anywhere in the stage · still starts by itself after 10 s) */
  missionArm(o,planned,p){ if(!this.missionArmable(o,planned,p)||!this.player)return; const q=this.objectivePosition(0,1,120,170),R=o._rw||(o._rw=this.missionReward?.(o)),objs=[];
    if(o.type==='cleanAir'&&this._cleanAir){ const c=this._cleanAir,l=this.camWorld(this.add.text(c.x,c.y+c.r+18,'⬇ Step in',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#e8fbff',stroke:'#0d0a14',strokeThickness:4}).setOrigin(.5).setDepth(95000)); this.tweens.add({targets:l,alpha:{from:1,to:.45},duration:600,yoyo:true,repeat:-1}); objs.push(l); o._armPad={x:c.x,y:c.y,objs,t:Infinity,ring:true,btn:null,btnR:{w:0,h:0}}; return; }   /* v8.1.159 เจ้าของ: Clean Air เริ่มได้เฉพาะตอนยืนในวง (ไม่มีปุ่ม/ไม่เริ่มเอง) */
    const W=this.W||390,H=this.H||844,bw=240,bh=58; let btn=null;
    if(typeof MISSION_AUTO_START!=='undefined'&&MISSION_AUTO_START){ o._armPad={x:q.x,y:q.y,objs,t:1.2,btn:null,btnR:{w:bw,h:bh}}; return; }   /* v8.2.70 เจ้าของ: ไม่ต้องกด Start mission · เริ่มเองหลัง 1.2 วิ */
    if(this.add.container&&this.camUI){ btn=this.add.container(W/2,H-232).setDepth(9500); const g=this.add.graphics(); g.fillStyle(0x2a1a0e,.94).fillRoundedRect(-bw/2,-bh/2,bw,bh,bh/2); g.lineStyle(3,0xffe08a,1).strokeRoundedRect(-bw/2,-bh/2,bw,bh,bh/2);
      const t=this.add.text(0,R?-9:0,'▶ Start mission',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'19px',color:'#fff3cf',stroke:'#2a1a0e',strokeThickness:4}).setOrigin(.5),c=this.add.text(0,R?13:20,R?'🎁 '+R.txt:'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#9fe8ff',stroke:'#2a1a0e',strokeThickness:3}).setOrigin(.5);
      btn.add([g,t,c]); this.camUI(btn); btn.setScrollFactor?.(1); objs.push(btn); this.tweens.add({targets:btn,scale:{from:1,to:1.06},duration:520,yoyo:true,repeat:-1}); btn._cd=c; btn._R=R; }
    o._armPad={x:q.x,y:q.y,objs,t:10,btn,btnR:{w:bw,h:bh}}; }
  missionBtnOver(p){ const A=this.waveObjective&&this.waveObjective._armPad; if(!A||!A.btn||!A.btn.visible||this.state!=='play')return false; const b=A.btn,r=A.btnR; return Math.abs(p.x-b.x)<=r.w/2+10&&Math.abs(p.y-b.y)<=r.h/2+10; }
  missionBtnHit(p){ if(!this.missionBtnOver(p))return false; const A=this.waveObjective._armPad; A.t=0; A.tap=true; return true; }
  missionArmClear(o){ const A=o&&o._armPad; if(!A)return; for(const q of A.objs){ this.tweens.killTweensOf(q); q.destroy(); } o._armPad=null; }
  /* ===== v8.1.116 เจ้าของ (รีวิวภารกิจ ข้อ 4): แม่แบบการนำเสนอร่วมทุกภารกิจ · เปิด = การ์ดภารกิจ (ชื่อ/สิ่งที่ต้องทำ/รางวัล) + คลื่นกระแทก · ระหว่าง = แถบเดียว · จบ = ตราประทับ MISSION COMPLETE + ของรางวัล ===== */
  missionReward(o){ if(!o||this._inTutorial||(this.recipeMode&&!this._recipeMission)||typeof MISSION_REWARDS==='undefined')return null; const r=MISSION_REWARDS[o.type]; if(!r)return null; const si=this.stageIndex||0,k=r[0];
    if(k==='gear'){ const ep=si>=10||!!this.endgameDropActive?.(); return {k,n:1,tier:ep?2:1,txt:'🎁 Gear box ('+(ep?'Epic+':'Rare+')+')'}; }
    const n=r[1]+(si>=5?1:0)+(si>=10?1:0),d=typeof currencyDef==='function'?currencyDef(k):null; return {k,n,txt:(d&&d.emoji||'💠')+' '+(d&&d.name||k)+' ×'+n}; }
  missionRewardGive(o){ const R=o&&(o._rw||this.missionReward(o)); if(!R||o._rwGiven||!this.player)return null; o._rwGiven=true; const P=this.missionPoint?.(o)||this.player,rep=o._gold?(typeof GOLD_WAVE_MUL!=='undefined'?GOLD_WAVE_MUL:2):1;   /* v8.2.28 เวฟทอง = รางวัล ×2 */
    if(R.k==='gear'){ this._lootMinRare=true; try{ for(let j=0;j<rep;j++){ const g=this.spawnLoot?.(P.x+50-j*90,P.y-36,R.tier); if(g)this.lootHold?.(g,1900); } }finally{ this._lootMinRare=false; } return R; }
    const _n=Math.ceil(R.n*rep*(this.rpMsnRw?.(o.type)||1)*(o._maRw||1))+(this.rpCurPlus?.(o.type)||0)+(o._maCur||0);   /* v8.2.29 Pact Relics · v8.2.30 Atlas */
    for(let i=0;i<_n;i++){ const a=i*2.4+.6,g=this.spawnCurrencyDrop?.(P.x+Math.cos(a)*64,P.y+Math.sin(a)*48,R.k); if(g&&typeof g==='object'){ g.forgeQuantity=1; this.lootHold?.(g,1900); } } return R; }
  missionCardClear(){ const c=this._msnCard; this._msnCard=null; if(c){ this.tweens?.killTweensOf?.(c); if(c.active!==false)c.destroy?.(); } }
  missionPanel(lines,col,minW){ const W=this.W,pw=Math.min(Math.max(minW||0,300),W-28),items=[]; let y=0;
    for(const L of lines){ if(!L||!L.t)continue; const t=this.add.text(0,y,L.t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(L.sz||13)+'px',color:L.c||'#ffffff',align:'center',stroke:'#1a1224',strokeThickness:L.st||3,wordWrap:{width:pw-28}}).setOrigin(.5,0); items.push(t); y+=(t.height||L.sz||13)+(L.gap??4); }
    const h=y+20,g=this.add.graphics(); g.fillStyle?.(0x1a1224,.86); g.fillRoundedRect?.(-pw/2,-12,pw,h,16); g.lineStyle?.(3,col,.95); g.strokeRoundedRect?.(-pw/2,-12,pw,h,16); g.fillStyle?.(col,.9); g.fillRoundedRect?.(-pw/2+18,-12,pw-36,4,2);
    const c=this.add.container(0,0,[g,...items]); c._h=h; return c; }
  missionIntro(o,armed){ if(!o||this._inTutorial||!this.add?.container||!this.W)return false; this.missionCardClear(); const W=this.W,H=this.H,col=o.color||0xffd166,R=o._rw=this.missionReward(o),hx='#'+col.toString(16).padStart(6,'0');
    /* v8.1.121 เจ้าของ: อ่านไม่ทัน ข้อความเยอะ เร็ว รก → 3 บรรทัด (ชื่อ · สิ่งที่ต้องทำสั้น ๆ · รางวัล) ค้าง 5.5 วิ */ const tip=typeof RUBY_TIPS!=='undefined'&&RUBY_TIPS[o.type]&&RUBY_TIPS[o.type].short,line=armed?(o.type==='cleanAir'?'Step into the ring to begin':'Step on ✨ to begin'):((o.desc||'').length<=48?o.desc:(tip?tip.replace(/[\[\]]/g,''):o.desc));
    const c=this.missionPanel([{t:o.emoji+' '+o.name,sz:22,c:hx,st:5,gap:6},{t:line,sz:15,c:'#ffffff',gap:6},R&&{t:'🎁 '+R.txt,sz:14,c:'#ffe08a',gap:2}],col);
    const y=Math.max(H*.2,this._ruby?this._ruby.bottom+28:0); c.setPosition(W/2,y-24).setDepth(61).setAlpha(0).setScale(.86); c.setScrollFactor?.(1); this.camUI(c); this._msnCard=c;
    this.tweens.add({targets:c,y,alpha:1,scale:1,duration:320,ease:'Back.out'});
    const T=this.waveObjTxt; this.time?.delayedCall?.(5500,()=>{ if(this._msnCard!==c)return; this.tweens.add({targets:c,x:T?T.x:W/2,y:T?T.y:30,scale:.25,alpha:0,duration:420,ease:'Cubic.easeIn',onComplete:()=>{ if(this._msnCard===c)this.missionCardClear(); if(T?.active!==false&&T?.visible)this.tweens.add({targets:T,scale:{from:1.35,to:1},duration:380,ease:'Back.out'}); }}); });
    return true; }
  missionGo(o,x,y,loud){ if(!o||this._inTutorial||!this.add)return; x=x??this.player?.x; y=y??this.player?.y; if(x==null)return; const col=o.color||0xffd166; if(loud&&typeof Sfx!=='undefined')Sfx.orderCue?.('wave_start',.4,.3);
    for(let w=0;w<2;w++){ const r=this.camWorld(this.add.circle(x,y,30,col,0).setStrokeStyle(w?4:9,w?0xffffff:col,.95).setDepth(90005)); this.tweens.add({targets:r,scale:9+w*3,alpha:{from:1,to:0},duration:620+w*200,delay:w*90,ease:'Cubic.easeOut',onComplete:()=>r.destroy()}); }
    if(loud){ this.screenFlash?.(col,.12,260); this.floatText?.(x,y-70,'▶ GO!',col); } }
  missionStamp(o,title,sub,reward){ if(!o||!this.add?.container||!this.W)return false; this.missionCardClear(); const W=this.W,H=this.H,col=o.color||0xffd166;
    const c=this.missionPanel([{t:title,sz:24,c:'#ffe08a',st:6,gap:6},{t:sub,sz:13,c:'#ffffff'},reward&&{t:'🎁 '+reward,sz:15,c:'#9fe8ff',gap:2}],col);
    const y=Math.max(H*.28,this._ruby?this._ruby.bottom+30:0); c.setPosition(W/2,y).setDepth(61).setAlpha(0).setScale(2.1).setRotation(-.12); c.setScrollFactor?.(1); this.camUI(c); this._msnCard=c;
    this.tweens.add({targets:c,alpha:1,scale:1,rotation:-.03,duration:300,ease:'Back.out',onComplete:()=>{ this.screenShake?.(140,.006); for(let i=0;i<12;i++){ const a=i/12*Math.PI*2,sp=this.camUI(this.add.text(W/2,y+(c._h||60)/2-12,i%2?'✦':'✧',{fontSize:(14+(i%3)*5)+'px',color:i%3?'#ffe08a':'#ffffff'}).setOrigin(.5).setDepth(62)); this.tweens.add({targets:sp,x:W/2+Math.cos(a)*(150+Math.random()*50),y:y+(c._h||60)/2+Math.sin(a)*(80+Math.random()*30),alpha:0,angle:180,duration:700,ease:'Cubic.easeOut',onComplete:()=>sp.destroy()}); } }});
    const P=this.missionPoint?.(o); if(P)this.missionGo(o,P.x,P.y,false);
    this.time?.delayedCall?.(2300,()=>{ if(this._msnCard!==c)return; this.tweens.add({targets:c,y:y-40,alpha:0,duration:380,onComplete:()=>{ if(this._msnCard===c)this.missionCardClear(); }}); });
    return true; }
  missionArmTick(o,dt){ const A=o._armPad; if(A.ring){ const c=this._cleanAir,P=this.player; if(c&&P&&Math.hypot(P.x-c.x,P.y-c.y)<=c.r){ A.t=0; this.floatText?.(P.x,P.y-70,'🌬️ Follow the Wisp',0xe8fbff); }   /* v8.1.161 เจ้าของ: ป้ายเยอะรก → ไม่มีแบนเนอร์ · ยังสว่างจนกว่าจะเข้าวง */ else { this.renderWaveObjectiveHUD?.(); return true; } } A.t-=dt; if(A.btn?._cd?.active&&!A.btn._R)A.btn._cd.setText('Starts by itself in '+Math.ceil(Math.max(0,A.t))+'s');
    if(A.t<=0){ this.missionArmClear(o); this.vfxHitRing?.(A.x,A.y,0xffe08a,true); if(this.missionGo)this.missionGo(o,A.x,A.y,true); else { Sfx.orderCue?.('wave_start',.4,.3); this.floatText?.(this.player.x,this.player.y-70,'▶ Mission start!',0xffe08a); } return false; } this.renderWaveObjectiveHUD?.(); return true; }
  /* ===== v8.1.78 ภารกิจประจำด่าน Chapter 3 (ภาพชั่วคราว: วงกราฟิก + อีโมจิ · ใบสั่งอาร์ตรอบ 4) ===== */
  sigAdd(o){ if(o){ this.camWorld(o); (this._sig.objs||(this._sig.objs=[])).push(o); } return o; }
  sigText(x,y,t,fs=26){ return this.sigAdd(this.add.text(x,y,t,{fontSize:fs+'px',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5).setDepth(y+5)); }
  sigClear(){ const S=this._sig; this._sig=null; this._holdFire=false; if(!S)return; for(const e of S.carriers||[])if(e&&e._seedCarrier===S.tag){ e._seedCarrier=null; e._goTo=null; e.tintColor=null; e.clearTint?.(); } for(const e of S.foes||[])if(e)e._gpFoe=false; for(const e of S.stopped||[])if(e){ e._timeStop=false; if(e.active){ if(e.tintColor)e.setTint?.(e.tintColor); else e.clearTint?.(); } } if(S.lanes||S.herald||S.guards||S.minions||S.carriers||S.chests||S.domain||S.shades||S.moths||S.saps)this.enemies?.children?.iterate?.(e=>{ if(e&&(e._lanePath||e._herald||e._hhGuard||e._hhMin||e._mpShade||e._llMoth||e._hsSapper||e._ggPart||e._golem||e._breach||e._hdLord)){ e._lanePath=null; e._herald=false; e._hhGuard=false; e._hhMin=null; e._hhTo=null; e._mpShade=false; e._llMoth=null; e._hsSapper=false; e._goTo=null; e._ggPart=null; e._golem=false; e._breach=false; e._hmLord=false; e._hdLord=false; e._brSp=null; } }); for(const q of S.objs||[]){ if(q){ this.tweens?.killTweensOf?.(q); if(q.active)q.destroy(); } } }
  sigSpawnAt(x,y,elite,type){ const S0=this._sig; this._sigForce=!!(S0&&(typeof LEAGUE_MISSIONS!=='undefined'&&LEAGUE_MISSIONS.includes(S0.type))); let e; try{ e=elite?this.spawnElite?.(false,true):this.spawnEnemy?.(type||'basic'); }finally{ this._sigForce=false; } if(e){ const lim=WORLD/2-120; e.setPosition(Phaser.Math.Clamp(x,-lim,lim),Phaser.Math.Clamp(y,-lim,lim)); if(this.emergeFoe)this.emergeFoe(e,this._emergeKind||'ground'); else this.vfxSpawnPoof?.(e.x,e.y); } return e; }
  llExtrasTick(dt,o,S){ const full=this.fpFull?.(),p=this.player,live=S.lamps.filter(L=>L.alive); S.moths=(S.moths||[]).filter(e=>e&&e.active&&e._llMoth);
    S.mothCd-=dt; if(S.mothCd<=0&&live.length&&S.moths.length<6){ S.mothCd=LL_MOTH_CD[full?1:0]/(this.rpMul?.('shade')||1); const L=live[Math.floor(Math.random()*live.length)]; for(let k=0;k<(full?3:2);k++){ const a=Math.random()*TAU,e=this.sigSpawnAt(L.x+Math.cos(a)*420,L.y+Math.sin(a)*420,false,'fast'); if(e){ e._llMoth=L; e._goTo={x:L.x,y:L.y}; e.setTint?.(0xd9c8ff); e.tintColor=0xd9c8ff; this.artFollow?.(e,'ll85_moth',56); S.moths.push(e); } } this.floatText?.(L.x,L.y-90,'🦋 Moths fly at a lantern!',0xd9c8ff); }
    for(const e of S.moths){ const L=e._llMoth; if(!L||!L.alive){ e._llMoth=null; e._goTo=null; continue; } if(this.dist(e.x,e.y,L.x,L.y)<55){ L.hp=Math.max(1,L.hp-LL_MOTH_STEAL); e._llMoth=null; e._goTo=null; if(e._aura){ e._aura.destroy(); e._aura=null; } this.stopEnemyPresentation?.(e); e.setActive?.(false); e.setVisible?.(false); if(e.body)e.body.enable=false; this.vfxSpawnPoof?.(e.x,e.y); this.floatText?.(L.x,L.y-60,'🦋 A moth stole some light!',0xd9c8ff); this.a12?.('a16_moth_steal',.4,.4); } }
    if(!S.wisp){ S.wispCd-=dt; if(S.wispCd<=0&&live.length){ S.wispCd=LL_WISP_CD; const q=this.objectivePosition?.(0,1,150,300)||{x:p.x+200,y:p.y}; S.wisp={x:q.x,y:q.y,t:this.sigArt('ll85_light_wisp',0,q.x,q.y,60,'✨',34),life:12}; if(this.artIsSpr(S.wisp.t)){ S.wisp.t.setBlendMode?.(Phaser.BlendModes.ADD); this.tweens?.add?.({targets:S.wisp.t,alpha:{from:.75,to:1},duration:500,yoyo:true,repeat:-1}); } else this.tweens?.add?.({targets:S.wisp.t,scale:{from:.8,to:1.25},duration:500,yoyo:true,repeat:-1});   /* v8.2.23 ใบ 85 */ } }
    else { const w=S.wisp; w.life-=dt; if(p&&this.dist(p.x,p.y,w.x,w.y)<60){ const L=live.sort((a,b)=>a.hp/a.maxhp-b.hp/b.maxhp)[0]; if(L){ L.hp=L.maxhp; this.vfxHitRing?.(L.x,L.y,0xffd166,true); this.floatText?.(L.x,L.y-60,'✨ Lantern rekindled!',0xffd166); } w.t?.setVisible?.(false); S.wisp=null; } else if(w.life<=0){ w.t?.setVisible?.(false); S.wisp=null; } } }   // v8.2.19
  segD(px,py,ax,ay,bx,by){ const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/L)); return Math.hypot(px-(ax+dx*t),py-(ay+dy*t)); }
  mpShadeTick(dt,o,S){ const lit=S.mirrors.filter(m=>m.lit),full=this.fpFull?.(),si=this.stageIndex||0; S.shades=(S.shades||[]).filter(e=>e&&e.active&&e._mpShade);   // v8.2.19 Mirror Path: เงามืดบังลำแสง
    S.shadeCd-=dt; if(lit.length&&S.shadeCd<=0&&S.shades.length<3){ S.shadeCd=MP_SHADE_CD[full?1:0]/(this.rpMul?.('shade')||1); const m=lit[Math.floor(Math.random()*lit.length)],mx=(m.x+S.cx)/2,my=(m.y+S.cy)/2,a=Math.random()*TAU,e=this.sigSpawnAt(mx+Math.cos(a)*320,my+Math.sin(a)*320,false,'tank'); if(e){ e._mpShade=true; e._goTo={x:mx,y:my}; e.setTint?.(0x3a2a5a); e.tintColor=0x3a2a5a; this.artFollow?.(e,'mp85_shade',90); S.shades.push(e); this.floatText?.(e.x,e.y-50,'🌑 A shade comes for the light!',0xb8a8ff); } }
    for(const m of lit){ const blk=S.shades.some(e=>this.segD(e.x,e.y,S.cx,S.cy,m.x,m.y)<50); if(blk){ m.pow-=dt*MP_DRAIN; if(m.pow<=0){ m.lit=false; m.pow=1; m.pc=1.2; S.dimmed++; m.ring.setStrokeStyle(3,0x9fe0ff,.6); if(this.artIsSpr(m.t))m.t.setFrame(0); this.floatText?.(m.x,m.y-60,'🌑 Mirror dimmed — recharge it!',0xb8a8ff); this.objBonusFail?.(); } } else m.pow=Math.min(1,m.pow+dt*.5); }
    S.beamCd-=dt; if(S.beamCd<=0&&lit.length){ S.beamCd=.5; const dm=Math.round(6+si*1.5); this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active||e.isBoss)return; for(const m of lit)if(this.segD(e.x,e.y,S.cx,S.cy,m.x,m.y)<34){ this.damage?.(e,e._mpShade?dm*1.5:dm,e.x,e.y); break; } }); } }   // ลำแสงเผามอนที่ขวาง
  srPick(){ let r=Math.random(); for(const [k,w] of SR_KINDS){ if((r-=w)<0)return k; } return 'basic'; }   // v8.2.18 ตัวขนเมล็ดหลายแบบ: ธรรมดา · เร็ว · มีเกราะ (นับ 2) · แตกตัว (ตายแล้วแตกเป็นตัวเล็ก 2 ตัวที่ยังวิ่งไปหารอยแยก)
  srCarrier(S,x,y,kind,small){ const L=SR_LOOK[kind]||SR_LOOK.basic,e=this.sigSpawnAt(x,y,false,small?'fast':L.type); if(!e)return null; e._seedCarrier=S.tag; e._goTo={x:S.x,y:S.y}; e._srC=L.c; this.artFollow?.(e,'sr87_carrier_'+(kind==='armored'?'armored':kind==='split'?'split':'fast'),small?48:(kind==='armored'?72:64));   /* v8.2.24 ใบ 87 */ e._srWorth=small?1:(L.worth||1); if(L.split&&!small)e._srSplit=true; e.setTint?.(L.c); e.tintColor=L.c; if(small){ e.setScale?.((e.scaleX||1)*.7); if(e.maxhp){ e.maxhp*=.4; e.hp=e.maxhp; } } S.carriers.push(e); return e; }
  /* v8.2.83 เจ้าของ: Seed Rift = แค่เหตุการณ์สุ่ม ไม่ใช่ภารกิจ เหมือนภัยธรรมชาติ · Ch2 ขึ้นไป สุ่ม 15%/เวฟ (C3-1 บ้านเกิด 35%) · รอยแยกเปิด 20 วิ ดูดเบา ๆ · ตัวขนเมล็ดวิ่งเข้า (ป้อนแล้วรอยแยกโตขึ้น + มอนทะลักออก) · ฆ่าตัวขน = 🍬 · ไม่ยืด/ไม่บังคับเวฟ */
  seedRiftEventTick(dt){ const R=this._srEv; if(R){ this.seedRiftEventRun(R,dt); return; } if(!SR_EVENT_ON||this.state!=='play'||this.mode!=='wave'||this.recipeMode||this.riftMode||this.bossRush||this._replayMeter||this._inTutorial||(this.stageIndex||0)<SR_EVENT_FROM)return;
    if(this._srWave!==this.waveIndex){ this._srWave=this.waveIndex; this._srClock=0; const ch=(this.stageIndex===SR_EVENT_HOME?SR_EVENT_CHANCE[1]:SR_EVENT_CHANCE[0]); this._srAt=Math.random()<ch?SR_EVENT_AT[0]+Math.random()*(SR_EVENT_AT[1]-SR_EVENT_AT[0]):null; }
    if(this._srAt==null)return; const o=this.waveObjective; if(o&&(o.type==='cleanAir'||o.type==='seedRift'))return; this._srClock=(this._srClock||0)+dt; if(this._srClock<this._srAt)return; this._srAt=null; this.seedRiftEventStart(); }
  seedRiftEventStart(){ const q=this.objectivePosition?.(0,1,260,360)||{x:(this.player?.x||0)+300,y:this.player?.y||0},R=this._srEv={x:q.x,y:q.y,R:90,pull:SR_EVENT_PULL,t:SR_EVENT_DUR,spawn:.8,fed:0,hurtT:0,tag:'srev'+Math.random(),carriers:[],objs:[],kills:0};
    const ring=this.camWorld?.(this.add.circle(q.x,q.y,R.R,0x6a2bd8,.18).setStrokeStyle(5,0xb88cff,.9).setDepth(q.y-3)); if(ring){ R.ring=ring; R.objs.push(ring); }
    if(this.realTex?.('msn71_rift')){ const c=this.camWorld?.(this.add.image(q.x,q.y,'msn71_rift',0).setDisplaySize(R.R*2.1,R.R*2.1).setDepth(q.y-3)); if(c){ R.core=c; R.objs.push(c); this.tweens?.add?.({targets:c,rotation:TAU,duration:1600,repeat:-1}); } }
    R.warnT=SR_EVENT_WARN; for(const o of R.objs)o.setVisible?.(false); R.warn=this.a94Loop?.('sr94_rift_warn',q.x,q.y,200,{depth:q.y-2}); if(R.warn)R.objs.push(R.warn); else if(R.ring){ R.ring.setVisible(true); this.tweens?.add?.({targets:R.ring,alpha:{from:.2,to:1},duration:250,yoyo:true,repeat:2}); }   /* v8.2.86 ใบ 94: เตือน 1.5 วิก่อนเปิด */
    this.a12?.('a22_rift_warn',.34,.4); this.floatText?.(q.x,q.y-60,'⚠️ The ground trembles…',0xb88cff); return R; }
  seedRiftEventRun(R,dt){ if(this.mode!=='wave'||this.state==='menu'){ this.seedRiftEventEnd(false); return; } if(this.state!=='play')return;
    if(R.warnT>0){ R.warnT-=dt; if(R.warnT>0)return; R.warn?.destroy?.(); R.ring?.setVisible?.(true)?.setAlpha?.(1); R.core?.setVisible?.(true); this.showBanner?.('🌀 Seed Rift!','A rift tears open — catch the seed carriers for Sugar',1800); this.screenShake?.(240,.008); this.a12?.('a22_rift_open',.42,.4)||Sfx.orderCue?.('wave_start',.35,.6); this.a22Voice?.('vo_ruby_rift_event',()=>this._srEv===R,R); } const P=this.player,si=this.stageIndex||0; R.t-=dt; const rad=R.R+R.fed*10; R.ring?.setRadius?.(rad); R.core?.setDisplaySize?.(rad*2.1,rad*2.1);
    if(P){ const d=this.dist(P.x,P.y,R.x,R.y); if(d>30&&d<900){ const k=Math.min(d-20,R.pull*dt); P.x-=(P.x-R.x)/d*k; P.y-=(P.y-R.y)/d*k; } R.hurtT-=dt; if(d<rad*.55&&R.hurtT<=0){ R.hurtT=.7; this.hurtPlayer?.(Math.round(5+si*.7)); } }
    for(const e of R.carriers){ if(!e||e._srevDone)continue; if(!e.active||e._seedCarrier!==R.tag){ e._srevDone=true; if(!e._srevFed){ R.kills++; const v=Math.round((2+si*.3)*(e._srWorth||1)); this.sugarStage=(this.sugarStage||0)+v; this.sugarRun=(this.sugarRun||0)+v; this.floatText?.(e.x,e.y-50,'🌰 🍬+'+v,0x9cff6b); } continue; }
      if(this.dist(e.x,e.y,R.x,R.y)<rad*.5){ e._srevFed=true; e._srevDone=true; e._seedCarrier=null; e._goTo=null; this.stopEnemyPresentation?.(e); e.setActive?.(false); e.setVisible?.(false); if(e.body)e.body.enable=false; R.fed++; this.a12?.('a22_rift_feed',.28,.18); R.pull=Math.min(140,R.pull+15); this.floatText?.(R.x,R.y-rad-20,'🌰 The rift feeds — monsters pour out!',0x9cff6b); this.screenShake?.(140,.006);
        for(let k=0;k<SR_EVENT_SPILL;k++){ const a=Math.random()*TAU,x=R.x+Math.cos(a)*rad,y=R.y+Math.sin(a)*rad,m=this.sigSpawnAt?.(x,y,false,'fast'); if(m)this.emergeFoe?.(m,'ground'); } } }
    R.carriers=R.carriers.filter(e=>e&&!e._srevDone);
    R.spawn-=dt; if(R.t>3&&R.spawn<=0&&R.carriers.length<4){ R.spawn=SR_EVENT_GAP; const a=Math.random()*TAU; this.srCarrier?.(R,R.x+Math.cos(a)*520,R.y+Math.sin(a)*520,this.srPick?.()||'basic'); }
    if(R.t<=0)this.seedRiftEventEnd(true); }
  seedRiftEventEnd(ok){ const R=this._srEv; if(!R)return; if(typeof VoiceActing!=='undefined')VoiceActing.stop(R); this._srEv=null; for(const e of R.carriers)if(e&&e._seedCarrier===R.tag){ e._seedCarrier=null; e._goTo=null; }
    for(const o of R.objs){ try{ this.tweens?.killTweensOf?.(o); if(o?.active){ if(ok&&this.tweens?.add)this.tweens.add({targets:o,scale:0,alpha:0,duration:420,onComplete:()=>o.destroy()}); else o.destroy(); } }catch(e){} }
    if(ok){ this.a12?.('a22_rift_close',.38,.4); this.burst?.(R.x,R.y,0xb88cff); this.floatText?.(R.x,R.y-60,'🌀 The rift closes'+(R.kills?' · '+R.kills+' caught':''),0xd7b8ff); } }
  srSplit(e,S){ for(let k=0;k<2;k++)this.srCarrier(S,e.x+(k?26:-26),e.y,'split',true); this.floatText?.(e.x,e.y-70,'🌿 It splits!',0x6bffd0); }
  sigSetup(o,type,p){ const si=this.stageIndex||0,c=o.color; this._sig={type,objs:[]}; const S=this._sig; if(!this.objNodeG){ this.objNodeG=this.add.graphics().setScrollFactor(1).setDepth(90040); this.camWorld(this.objNodeG); }
    if(type==='seedRift'){ const q=this.objectivePosition(0,1,260,360); Object.assign(S,{x:q.x,y:q.y,R:110,pull:55,seeds:0,spawn:.6,hurtT:0,tag:'sr'+Math.random(),carriers:[]}); o.target=8; o.desc='The rift pulls you in — catch '+o.target+' green seed carriers before they feed it';   /* v8.2.8 เจ้าของ: ไม่ซ้ำ Hunger's Mouth → แรงดูด + ไล่จับตัวขนเมล็ด */
      S.ring=this.sigAdd(this.add.circle(q.x,q.y,S.R,0x6a2bd8,.18).setStrokeStyle(5,0xb88cff,.9).setDepth(q.y-3)); S.core=this.sigArt('msn71_rift',0,q.x,q.y,S.R*2.1,'🌀',40); if(this.artIsSpr(S.core))S.core.setDepth(q.y-3); this.tweens.add({targets:S.core,rotation:TAU,duration:1600,repeat:-1}); }
    else if(type==='shakeTrees'){ const n=this.fpFull?.()?ST_TREES[1]:ST_TREES[0],kinds=ST_KINDS.slice(0,n); for(let i=kinds.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [kinds[i],kinds[j]]=[kinds[j],kinds[i]]; } o.target=n; S.trees=[];   /* v8.2.17 เจ้าของ: ต้นไม้หลายแบบ — ผลไม้ · รังผึ้ง · ต้นทอง (มีประกายให้เห็น) · ต้นไม้ปลอม (กลายเป็นมอน) */ for(let i=0;i<n;i++){ const q=this.objectivePosition(i,n,200,380),tk87={hive:'st87_tree_hive',golden:'st87_tree_golden',mimic:'st87_tree_mimic'}[kinds[i]],use87=tk87&&this.realTex?.(tk87),t=this.sigArt(use87?tk87:'msn71_tree',0,q.x,q.y+50,130,'🌳',54,q.y-20),ring=this.sigAdd(this.add.circle(q.x,q.y+10,92,c,.08).setStrokeStyle(3,c,.6).setDepth(q.y-2)); const kind=kinds[i],shine=kind==='golden'?this.sigText(q.x,q.y-70,'✨',26):null; if(kind==='golden'){ if(!use87)t.setTint?.(0xfff2a8); if(shine)this.tweens.add({targets:shine,alpha:{from:.35,to:1},scale:{from:.85,to:1.2},duration:620,yoyo:true,repeat:-1}); } S.trees.push({x:q.x,y:q.y,t,ring,pc:0,done:false,kind,shine}); } }
    else if(type==='mirrorPath'){ const cq=this.objectivePosition(0,1,140,220); S.cx=cq.x; S.cy=cq.y; S.crystal=this.sigArt('msn71_crystal',0,cq.x,cq.y+30,110,'💎',46,cq.y-16); S.mirrors=[]; o.target=3; for(let i=0;i<3;i++){ const a=i/3*TAU+Math.random()*.6,r=230+Math.random()*80,x=Phaser.Math.Clamp(cq.x+Math.cos(a)*r,-WORLD/2+130,WORLD/2-130),y=Phaser.Math.Clamp(cq.y+Math.sin(a)*r,-WORLD/2+130,WORLD/2-130); S.mirrors.push({x,y,pc:0,lit:false,pow:1,t:this.sigArt('msn71_mirror',0,x,y+30,90,'🪞',40,y-14),ring:this.sigAdd(this.add.circle(x,y+8,84,0x9fe0ff,.08).setStrokeStyle(3,0x9fe0ff,.6).setDepth(y-2))}); } S.beam=this.sigAdd(this.add.graphics().setDepth(90030)); S.shades=[]; S.shadeCd=4; S.beamCd=0; S.dimmed=0; }   /* v8.2.19 เงามืด 🌑 มายืนบังลำแสง (กระจกค่อย ๆ มืด) · ลำแสงทำดาเมจมอนที่ขวาง */
    else if(type==='vaultAltar'||type==='ultimatum'){ this.ultSetup(o,S,type==='ultimatum'?4:2); }
    else if(type==='frozenPantry'){ this.fpSetup(o,S); }
    else if(type==='hungersMouth'){ this.hmSetup(o,S); }
    else if(type==='creepingRoots'){ this.crSetup(o,S); }
    else if(type==='hungerHerald'){ this.hhSetup(o,S); }
    else if(type==='grandmasPot'){ this.gpSetup(o,S); }
    else if(type==='grandmasGolem'){ this.ggSetup(o,S); }
    else if(type==='hungerSiege'){ this.hsSetup(o,S); }
    else if(type==='hungerDomain'){ this.hdSetup(o,S); }   /* v8.1.80 เจ้าของ: Ultimatum แบบ PoE · Vault Altar = ฉบับย่อ 2 รอบ */
    else if(type==='lastLight'){ o.target=Math.max(36,Math.round((p.dur||50)*.8)); o.desc='Keep a lantern burning for '+o.target+'s · stand close to rekindle'; S.lamps=[]; for(let i=0;i<3;i++){ const q=this.objectivePosition(i,3,170,280); S.lamps.push({x:q.x,y:q.y,hp:220,maxhp:220,alive:true,t:this.sigArt('msn71_lantern',0,q.x,q.y+40,110,'🏮',40,q.y-16),ring:this.sigAdd(this.add.circle(q.x,q.y+8,120,0xffb347,.08).setStrokeStyle(3,0xffb347,.6).setDepth(q.y-2))}); } S.mothCd=5; S.wispCd=LL_WISP_CD*.6; S.wisp=null; S.moths=[]; } }   /* v8.2.19 ผีเสื้อกลางคืน 🦋 บินมาขโมยแสง (ฆ่าก่อนถึงโคม) · วิญญาณแสง ✨ เดินเก็บ = เติมโคมที่ใกล้ดับที่สุดเต็ม */
  /* ===== v8.1.81 Frozen Pantry (League → Legion ปรับเข้า lore) — The Hunger แช่แข็งโมจิไว้เป็นเชื้อเพลิง (คุกน้ำตาล C1-4)
     เดินไปเปิดโหลน้ำตาล → รูปปั้นโมจิแช่แข็งรอบโหล · ระบบยิงอัตโนมัติไม่เล็งรูปปั้น · ผู้เล่นเดินเข้าใกล้ = วงเติมสีรอบตัว → สีเต็ม = ตื่นมาสู้
     🎁 = ตัวที่ถือรางวัล · แบบเต็ม (เล่นซ้ำ/Delve/หลังจบ Chapter 2): ตื่นแล้วต้องฆ่าใน 14s ไม่งั้นแช่แข็งกลับแล้วหายไปพร้อมรางวัล · ตัวที่ไม่ทาสีแตกใน 34s · มีนายพลน้ำแข็งสุ่ม
     แบบเบา (เล่นครั้งแรกใน Chapter 1–2): ไม่มีเวลาจำกัด ไม่มีนายพล ===== */
  /* v8.1.114 เจ้าของ (วิจารณ์ภารกิจข้อ 2): Chapter 1 เล่นครั้งแรกหนักเกิน (League ทุกด่าน) → ครั้งแรกเหลือแค่ Herald (C1-1) + Frozen Pantry (C1-4)
     Hunger's Mouth / Grandma's Pot / Grandma's Golem โผล่เมื่อเล่นด่านนั้นซ้ำ (ผ่านแล้ว) หรือหลังจบ Chapter 1 · โหมดอื่น (Delve/Replay bounty) ไม่ถูกกรอง */
  missionRoamPool(){ const d=(typeof Save!=='undefined'&&Save.data)||{},sn=d.seenMissions||{},ss=d.stageStars||{},sm=d.stageMastery||{},st=STAGES[this.stageIndex]||{},own=new Set(Array.isArray(st.objectives)?st.objectives:[]);
    return Object.keys(MISSION_HOME).filter(t=>WAVE_OBJECTIVES[t]&&!own.has(t)&&MISSION_HOME[t]!==this.stageIndex&&(sn[t]||ss[MISSION_HOME[t]]>0||sm[MISSION_HOME[t]])&&(t!=='grandmasPot'||sm[3])); }
  missionRoamBag(bag){ if(this.recipeMode||this.riftMode||this.bossRush||this._inTutorial||this._replayMeter||!Array.isArray(bag))return bag; const d=(typeof Save!=='undefined'&&Save.data)||{};
    if((this.stageIndex||0)<=4&&!(d.stageMastery||{})[this.stageIndex||0]&&!(typeof storyCleared==='function'&&storyCleared()>=5))return bag;   // Chapter 1 รอบแรกยังเป็นแผนสอนเดิม
    const pool=Phaser.Utils.Array.Shuffle(this.missionRoamPool()),got=[];
    for(let i=0;i<bag.length&&pool.length;i++){ if(!['capture','purge','survive'].includes(bag[i])||Math.random()>=MISSION_ROAM_CHANCE)continue; const t=pool.pop(); bag[i]=t; got.push(t); }
    if(got.length){ this._roamMissions=got; this.missionRoamArt(got); }
    return bag; }
  missionRoamArt(types){ const ks=new Set(); for(const t of types)for(const k of (this.missionArtKeys?.(MISSION_HOME[t])||[]))ks.add(k);
    if(ks.size)try{ this.ensureGroup(k=>ks.has(k),()=>{ try{ this.buildDeferredAnims?.(); }catch(e){} },{all:true,fx:true,quiet:true}); }catch(e){} }
  /* v8.2.6 สำรับภารกิจ: ใบที่จั่วได้ = ภารกิจทั่วไป 5 + ภารกิจประจำด่านอื่นที่ปลดแล้ว (เคยเจอ / ผ่านด่านบ้านแล้ว) · ไม่ซ้ำจนกว่าใช้ครบรอบ · ใบที่ยังไม่เคยเจอมาก่อน */
  missionDeckPool(){ const d=(typeof Save!=='undefined'&&Save.data)||{},sn=d.seenMissions||{},ss=d.stageStars||{},sm=d.stageMastery||{},idx=this.stageIndex||0,lead=(STAGES[idx]||{}).lead,ch1First=idx<=4&&!sm[idx]&&!(typeof storyCleared==='function'&&storyCleared()>=5);
    const sig=Object.keys(MISSION_HOME).filter(t=>WAVE_OBJECTIVES[t]&&!MISSION_DECK_SKIP.includes(t)&&MISSION_HOME[t]!==idx&&(sn[t]||ss[MISSION_HOME[t]]>0||sm[MISSION_HOME[t]])&&(t!=='grandmasPot'||sm[3])&&!(ch1First&&C1_LATER_LEAGUE.includes(t)));
    return MISSION_DECK_BASE.concat(sig).filter(t=>t!==lead); }
  missionDeckDraw(n,exclude){ const d=(typeof Save!=='undefined'&&Save.data)||{},D=d.missionDeck=d.missionDeck&&Array.isArray(d.missionDeck.used)?d.missionDeck:{used:[],recent:[]},log=Object.assign({},d.seenMissions||{},d.missionLog||{}),ex=new Set(exclude||[]),out=[],elig=this.missionDeckPool();
    for(let i=0;i<n;i++){ let cand=elig.filter(t=>!ex.has(t)&&!D.used.includes(t));
      if(!cand.length){ D.used=[]; cand=elig.filter(t=>!ex.has(t)); const fresh=cand.filter(t=>!(D.recent||[]).includes(t)); if(fresh.length)cand=fresh; }
      if(!cand.length)break; const un=cand.filter(t=>!log[t]),base=un.length?un:cand,fo=(typeof maData==='function'&&typeof maUnlocked==='function'&&maUnlocked())?maData().focus:[],bag=base.concat(base.filter(t=>fo.includes(t))),pick=bag[Math.floor(Math.random()*bag.length)];   /* v8.2.30 Atlas Focus ×2 */
      out.push(pick); ex.add(pick); D.used.push(pick); D.recent=(D.recent||[]).concat(pick).slice(-4); }
    return out; }
  missionDeckDeal(){ if(this.recipeMode||this.riftMode||this.bossRush||this._replayMeter||this._inTutorial)return null; const idx=this.stageIndex||0,st=STAGES[idx]; if(!st)return null; const d=(typeof Save!=='undefined'&&Save.data)||{},sm=d.stageMastery||{};
    const slots=[]; for(let w=0;w<(st.waves||5);w++)if(w!==st.miniAt)slots.push(w); const waves={};
    if(idx===0&&!sm[0]&&CH1_EARLY_WAVE_PLAN[0]){ for(const w of slots){ const pl=earlyWaveMission(0,w); waves[w]=pl?pl.type:'survive'; } return {waves,slots,lead:st.lead,plan:true}; }   // C1-1 รอบแรก: แผนสอนเดิม (เจ้าของ 18 พ.ย.)
    const lead=st.lead&&WAVE_OBJECTIVES[st.lead]&&this.c1FirstPool([st.lead,'survive']).includes(st.lead)?st.lead:null,rest=slots.slice();
    const leadSlot=lead?rest.shift():null; if(lead)waves[leadSlot]=lead; const got=this.missionDeckSort(this.missionDeckDraw(rest.length,lead?[lead]:[])); rest.forEach((w,i)=>{ waves[w]=got[i]||'survive'; });
    const roam=Object.values(waves).filter(t=>MISSION_HOME[t]!=null&&MISSION_HOME[t]!==idx); if(roam.length){ this._roamMissions=roam; this.missionRoamArt?.(roam); }
    return {waves,slots,lead,leadSlot,plan:false}; }
  /* v8.2.27 เจ้าของ (SCAMPER): การ์ดยังสุ่มเหมือนเดิม แต่เรียงง่าย→ยากตามเวฟ (ภารกิจทั่วไป → ภารกิจประจำด่าน → ภารกิจใหญ่) */
  missionDeckSort(arr){ const tier=t=>typeof MISSION_TIER!=='undefined'&&MISSION_TIER[t]!=null?MISSION_TIER[t]:2; return (arr||[]).map((t,i)=>({t,i})).sort((a,b)=>tier(a.t)-tier(b.t)||a.i-b.i).map(q=>q.t); }
  /* v8.2.27 เจ้าของ: Reroll ได้ 1 ครั้งต่อการแจก · สุ่มชุดใหม่ทั้งชุด (ยกเว้นใบประจำด่าน) · ผู้เล่นเลือกเองไม่ได้ */
  missionDealReroll(deal,ad){ if(!deal||deal.plan||(ad?deal.adRerolled:deal.rerolled)||!Array.isArray(deal.slots))return false; const idx=this.stageIndex||0,rest=deal.slots.filter(w=>w!==deal.leadSlot),old=rest.map(w=>deal.waves[w]);
    const got=this.missionDeckSort(this.missionDeckDraw(rest.length,(deal.lead?[deal.lead]:[]).concat(old))); rest.forEach((w,i)=>{ deal.waves[w]=got[i]||old[i]||'survive'; }); deal.rerolled=true; if(ad)deal.adRerolled=true;
    const roam=Object.values(deal.waves).filter(t=>MISSION_HOME[t]!=null&&MISSION_HOME[t]!==idx); this._roamMissions=roam; if(roam.length)this.missionRoamArt?.(roam); try{ Save.save?.(); }catch(e){} return true; }
  /* v8.2.6 แจกไพ่ก่อนเริ่มด่าน: สับ → แจก 1 ใบต่อเวฟ (มินิบอส = 💀) → พลิกเปิด · ใบประจำด่านขอบทอง · NEW = ยังไม่เคยเจอ · แตะเพื่อข้าม */
  missionDealShow(deal,done){ const st=STAGES[this.stageIndex]||{},W=this.W,H=this.H,n=(st.waves||5)+1;   /* v8.2.7 เจ้าของ: 6 ใบ = เวฟ 1–5 + บอสใบสุดท้าย (จั่วจริงแค่ 4) */ if(!deal||!this.add?.container||!W){ done(); return; }
    const d=(typeof Save!=='undefined'&&Save.data)||{},log=Object.assign({},d.seenMissions||{},d.missionLog||{});
    const L=this.camUI(this.add.container(0,0).setDepth(119)); L.setScrollFactor?.(1); this._dealL=L; this.physics.pause(); const prevState=this.state; this.state='cinematic';
    const dim=this.add.rectangle(0,0,W,H,0x0b0612,.55).setOrigin(0); L.add(dim);
    const gap=8,cw=Math.min(66,(W-28-gap*(n-1))/n),chh=Math.round(cw*1.42),cy=Math.round(H*.56),x0=W/2-((cw+gap)*n-gap)/2+cw/2,P=i=>x0+i*(cw+gap);
    const cap=this.add.text(W/2,cy-chh/2-26,deal.preview?'In this stage':'Missions in this stage',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe08a',stroke:'#24172c',strokeThickness:4}).setOrigin(.5).setAlpha(0); L.add(cap);
    const mk=(i)=>{ const c=this.add.container(W/2,cy);
      if(this.realTex?.('cb93_back')&&this.add.image){
        const back=this.add.image(0,0,'cb93_back').setDisplaySize(cw,chh);
        c._back=[back]; c.add(back); L.add(c); return c;
      }
      const g=this.add.graphics(); g.fillStyle(0x2b1d3d,1).fillRoundedRect(-cw/2,-chh/2,cw,chh,8); g.lineStyle(2,0xc9a3ff,.9).strokeRoundedRect(-cw/2,-chh/2,cw,chh,8); g.lineStyle(1,0xc9a3ff,.35).strokeRoundedRect(-cw/2+5,-chh/2+5,cw-10,chh-10,5);
      const bk=this.add.text(0,0,'🍡',{fontSize:Math.round(cw*.42)+'px'}).setOrigin(.5); c.add([g,bk]); c._back=[g,bk]; L.add(c); return c; };
    const face=(c,i)=>{ const w=i,isBoss=w===n-1,isMini=w===st.miniAt||isBoss,t=isBoss?null:deal.waves[w],lab=!isMini&&deal.labels?.[w],o=lab||t&&WAVE_OBJECTIVES[t]||{},sig=!isMini&&(lab?!!lab.event:t&&t===deal.lead),col=isBoss?0xff3b3b:isMini?0xff5c8a:sig?0xffd166:0x8fd9ff,g=this.add.graphics();
      g.fillStyle(isBoss?0x420d12:isMini?0x3a1424:0x241a33,1).fillRoundedRect(-cw/2,-chh/2,cw,chh,8); g.fillStyle(col,.16).fillRoundedRect(-cw/2+3,-chh/2+3,cw-6,chh-6,6); g.lineStyle(sig?3:2,col,1).strokeRoundedRect(-cw/2,-chh/2,cw,chh,8);
      const num=this.add.text(-cw/2+5,-chh/2+3,String(w+1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#d8cce0'}).setOrigin(0,0);
      const fi=MC86_ORDER.indexOf(isBoss?'boss':isMini?'miniboss':t),em=fi>=0&&this.realTex?.('mc86_faces')&&this.add.image?this.add.image(0,-chh*.1,'mc86_faces',fi).setDisplaySize(cw*.86,cw*.86):this.add.text(0,-chh*.1,isBoss?'👑':isMini?'💀':(o.emoji||'✨'),{fontSize:Math.round(cw*.42)+'px'}).setOrigin(.5);   /* v8.2.24 ใบ 86 ภาพหน้าการ์ด (ไม่มีภาพ = อีโมจิเดิม) */
      const nm=this.add.text(0,chh*.2,isBoss?'Boss':isMini?'Miniboss':(o.name||''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(cw<56?7:8)+'px',color:'#ffffff',align:'center',wordWrap:{width:cw-6},lineSpacing:-2}).setOrigin(.5,0);
      const parts=[g,num,em,nm]; if(sig){ const r=this.add.text(0,-chh/2-1,'STAGE',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:'#24172c',backgroundColor:'#ffd166',padding:{x:3,y:1}}).setOrigin(.5); parts.push(r); }
      if(!isMini&&t&&!lab&&!log[t]){ const nw=this.add.text(cw/2-2,-chh/2+2,'NEW',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:'#ffffff',backgroundColor:'#ff4d8f',padding:{x:2,y:1}}).setOrigin(1,0); parts.push(nw); }
      parts.forEach(q=>q.setVisible(false)); c.add(parts); c._face=parts; c._sig=sig; };
    const cards=[]; for(let i=0;i<n;i++){ const c=mk(i); c.x=W/2+(i-n/2)*1.5; c.y=cy-i*1.5; face(c,i); cards.push(c); }
    let fin=false; const tw=(o)=>this.tweens.add(o),T=(ms,f)=>this.time.delayedCall(ms,()=>{ if(!fin&&!hold)f(); });
    const finish=()=>{ if(fin)return; fin=true; this._finishDeal=null; this.input?.off?.('pointerdown',onTap); const tx=this.waveObjTxt?this.waveObjTxt.x:W/2,ty=this.waveObjTxt?this.waveObjTxt.y:40;
      tw({targets:cards,x:tx,y:ty,scale:.2,alpha:0,duration:320,ease:'Cubic.easeIn',delay:(t,k,v,i)=>i*30}); tw({targets:[dim,cap].concat(rb?[rb]:[],ri?[ri]:[],go?[go]:[]),alpha:0,duration:300,onComplete:()=>{ L.destroy(); if(this._dealL===L)this._dealL=null; }});
      const proceed=()=>{if(this.state==='cinematic')this.state=prevState==='cinematic'?'play':prevState; this.physics.resume(); done();};if(this.prepareStageEncounter)this.prepareStageEncounter(proceed);else proceed(); };
    const canRe=!deal.plan&&!deal.adRerolled&&Array.isArray(deal.slots)&&deal.slots.some(w=>w!==deal.leadSlot),isAd=!!deal.rerolled; let rb=null,hold=false;   /* v8.2.27 เจ้าของ: ฟรี 1 ครั้ง · ครั้งที่ 2 ดูโฆษณา */
    const reArt=this.realTex?.('ev90_reroll'); let ri=null;
    let go=null;   /* v8.2.41 เจ้าของ: จั่วเสร็จแล้วหยุดรอผู้เล่นเลือก ▶ ไปต่อ หรือ 🔄 Reroll (มีปุ่ม Reroll = ไม่เข้าด่านเอง) */
    if(canRe){ rb=this.add.text(W/2,cy+chh/2+40,(reArt?'      ':'')+(isAd?(reArt?'':'📺 ')+'Reroll again (watch ad)':(reArt?'':'🔄 ')+'Reroll missions (free)'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff',backgroundColor:'#5a3d86',padding:{x:14,y:8},stroke:'#24172c',strokeThickness:3}).setOrigin(.5).setAlpha(0); L.add(rb); if(reArt){ ri=this.add.image(rb.x-(rb.width||200)/2+24,rb.y,'ev90_reroll',isAd?1:0).setDisplaySize(24,24).setAlpha(0); L.add(ri); } }   /* v8.2.31 ใบ 90 ไอคอน */
    const reroll=()=>{ if(fin)return; hold=false; fin=true; this._finishDeal=null; this.input?.off?.('pointerdown',onTap); try{ this.tweens.killTweensOf?.(cards); }catch(e){} L.destroy(); if(this._dealL===L)this._dealL=null; (this.a12?.('a18_reroll',.5,.2))||snd(); this.rubyVoiceReact?.('reroll',200); this.missionDealReroll(deal,isAd); this.missionDealShow(deal,done); };
    const tapRe=()=>{ if(!isAd){ reroll(); return; } if(hold||!this.showRewardedAd)return; hold=true; rb.setAlpha(.45); let got=false; this.showRewardedAd('Watch an ad to reroll the stage missions',()=>{ got=true; reroll(); }); this.time.delayedCall(400,()=>{ if(!got&&!this._adBusy&&hold&&!fin){ hold=false; finish(); } });
      const chk=this.time.addEvent({delay:300,loop:true,callback:()=>{ if(fin||got){ chk.remove(); return; } if(!this._adBusy&&hold){ chk.remove(); hold=false; finish(); } }}); };
    this._finishDeal=finish; const t0=this.time.now,onTap=(p0)=>{ if(hold||!p0)return; const k=(typeof RENDER_DPR!=='undefined'&&RENDER_DPR)||1,pt={x:p0.x/k,y:p0.y/k},on=b=>b&&b.alpha>.5&&Math.abs(pt.x-b.x)<=(b.width||200)/2+14&&Math.abs(pt.y-b.y)<=(b.height||34)/2+14;   /* v8.2.46 เจ้าของ: กด Start/Reroll ไม่ติด — pointer ตอนเล่นเป็นพิกเซลจอ (×RENDER_DPR) ต้องหารก่อนเทียบกับพิกัด UI */ if(on(rb)){ tapRe(); return; } if(on(go)){ (this.a12?.('a18_reroll',.3,.2))||snd(); finish(); return; } if(!rb&&this.time.now-t0>350)finish(); }; this.input?.on?.('pointerdown',onTap);
    const snd=()=>{ try{ Sfx.card&&Sfx.card(); }catch(e){} };
    // สับ 2 ครั้ง
    for(let k=0;k<2;k++)T(k*260,()=>{ snd(); cards.forEach((c,i)=>tw({targets:c,x:W/2+(i%2?1:-1)*cw*.7,angle:(i%2?8:-8),duration:110,yoyo:true,ease:'Sine.easeInOut'})); });
    // แจก
    cards.forEach((c,i)=>T(560+i*90,()=>{ snd(); tw({targets:c,x:P(i),y:cy,angle:0,duration:240,ease:'Cubic.easeOut'}); }));
    T(560,()=>tw({targets:cap,alpha:1,duration:250})); if(rb)T(560+n*90,()=>tw({targets:[rb].concat(ri?[ri]:[]),alpha:1,duration:220}));
    // พลิก · v8.2.22 เจ้าของ: ช้าลง + ยกทีละใบขึ้นมาโชว์กลางจอให้เห็นชัด แล้วค่อยกลับเข้าแถว
    /* v8.2.46 เจ้าของ: เอาข้อความคำอธิบายใต้การ์ดที่ยกขึ้นออก (อ่านไม่ออก/ยาวไป) · ยกการ์ดโชว์อย่างเดียว */
    const base=1100+n*90,big=DEAL_BIG,cyBig=Math.round(H*.36);
    const shine=c=>{
      if(c._back.length!==1||!this.realTex?.('cb93_back_shine'))return;
      const foil=this.add.image(0,0,'cb93_back_shine').setOrigin(0,.5).setDisplaySize(cw,chh).setBlendMode(Phaser.BlendModes.ADD);
      c.add(foil); c._back.push(foil);
      tw({targets:{progress:0},progress:1,duration:350,ease:'Sine.easeInOut',onUpdate:(_,q)=>{
        if(!foil.active)return;
        const shift=(q.progress-.5)*cw*.9, frame=foil.frame;
        const left=Math.max(0,-shift/cw*frame.width),right=Math.min(frame.width,(1-shift/cw)*frame.width);
        // Taper the sweep inside the card edge. Its authored glow has clear corners.
        foil.setPosition(-cw/2+shift,0).setCrop(left,0,right-left,frame.height).setAlpha(.68*Math.sin(Math.PI*q.progress));
      },onComplete:()=>{if(foil.active)foil.setVisible(false);}});
    };
    const flipFlash=()=>{
      if(!this.realTex?.('cb93_flip')||!this.bpAnim?.('cb93_flip'))return;
      const flash=this.add.sprite(W/2,cyBig,'cb93_flip',0).setDisplaySize(220,220).setAlpha(.82);
      L.add(flash); flash.once('animationcomplete',()=>flash.destroy()); flash.play('cb93_flip');
    };
    cards.forEach((c,i)=>T(base+i*DEAL_SHOW_MS,()=>{ L.bringToTop?.(c); snd(); shine(c); tw({targets:c,x:W/2,y:cyBig,scaleX:big,scaleY:big,duration:260,ease:'Cubic.easeOut',onComplete:()=>{ if(fin)return; tw({targets:c,scaleX:0,duration:120,ease:'Sine.easeIn',onComplete:()=>{ c._back.forEach(q=>q.setVisible(false)); c._face.forEach(q=>q.setVisible(true)); flipFlash(); tw({targets:c,scaleX:big,duration:150,ease:'Back.out'}); if(c._sig)tw({targets:c,angle:{from:-4,to:0},duration:300,ease:'Back.out'}); }}); }});
      T(DEAL_SHOW_MS-300,()=>{ tw({targets:c,x:P(i),y:cy,scaleX:1,scaleY:1,angle:0,duration:260,ease:'Cubic.easeInOut'}); }); }));
    if(!rb)T(base+n*DEAL_SHOW_MS+700,finish);
    else T(base+n*DEAL_SHOW_MS+200,()=>{ go=this.add.text(W/2,rb.y+(rb.height||34)/2+30,'▶  Start the stage',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#2a1a10',backgroundColor:'#ffd166',padding:{x:22,y:10},stroke:'#fff4d6',strokeThickness:1}).setOrigin(.5).setAlpha(0); L.add(go); tw({targets:go,alpha:1,duration:220}); tw({targets:go,scale:{from:1,to:1.05},duration:600,yoyo:true,repeat:-1,ease:'Sine.inOut',delay:300}); });
  }
  c1FirstPool(pool){ const idx=this.stageIndex||0,d=(typeof Save!=='undefined'&&Save.data)||{}; if(!(d.stageMastery||{})[3]&&pool.includes('grandmasPot')){ const p2=pool.filter(t=>t!=='grandmasPot'); if(p2.length)pool=p2; }   /* v8.1.115 Pot ปลดหลังเจอคุณยาย (ผ่าน C1-4) แม้เล่นซ้ำ */ if(idx>4||this.recipeMode||this.riftMode||this.bossRush||this._replayMeter||(d.stageMastery||{})[idx]||(typeof storyCleared==='function'&&storyCleared()>=5))return pool;
    const out=pool.filter(t=>!C1_LATER_LEAGUE.includes(t)); return out.length?out:pool; }
  fpFull(){ return !!(this._replayMeter||this.riftMode||(typeof storyCleared==='function'&&storyCleared()>=10)); }
  /* v8.1.111 เจ้าของ: Frozen Pantry ยังจืด → ทำแบบเสา Legion ของ PoE ทั้งหมด (ปรับอาร์ตเข้าธีม)
     เดินไปโหล = ปุ่ม "Open the Jar" ขึ้นบนจอ · กด → กองทัพโมจิแช่แข็งเยอะ ๆ ผุดจากพื้นเป็นกลุ่มพร้อมเอฟเฟกต์น้ำแข็ง · นับถอยหลัง
     เดินแล้วพื้นเป็นสีระบาย (ไม่มีวง) · ตัวที่โดนสีระบาย = ตื่นมาสู้ได้ · หมดเวลา/ทาครบ = ทุกตัวแตกน้ำแข็งพร้อมกัน (ตัวที่ไม่โดนสี = แตกหายไปพร้อมรางวัล)
     แบบเบา 14 ตัว 22 วิ · แบบเต็ม 24 ตัว + นายพลน้ำแข็ง 16 วิ และหลังตื่นต้องล้มใน 25 วิ
     v8.2.16 เจ้าของ: กว้างขึ้น (โดม FP_DOME) มอนเยอะ/หลายแบบเป็นหมู่ (FP_ROLES) มี Captain 👑 ต่อหมู่ (ล้ม Captain = ลูกหมู่อ่อนลง) + Frost General ทุกครั้ง
     ลังแช่แข็ง (FP_CRATES) เดินไปทาสีเหมือนรูปปั้น → ตอนเวลาเดินแตกเป็นของ · ไม่ทาสี = แตกหาย · แค่เดินปลดล็อก ไม่ตี มอนตื่นมาเลือดเต็ม
     ล้มกองทัพได้มาก = รางวัลท้ายภารกิจดีขึ้น (≥50% Honey Drop · ≥80% กล่อง Gear) */
  fpSetup(o,S){ const full=this.fpFull(),q=this.objectivePosition(0,1,220,320); Object.assign(S,{x:q.x,y:q.y,phase:'seek',full,st:[],cr:[],sq:[],PR:95,T:full?10:12,blobs:0,lx:null,ly:null,fight:0}); S.T0=S.T;
    o.target=full?FP_ARMY[1]:FP_ARMY[0];   /* v8.2.16 เจ้าของ: กองทัพใหญ่ขึ้น หลายแบบ มีหัวหน้า + ลังแช่แข็ง (แบบ Legion) */ o.progress=0; o.desc='Open Grandma’s sugar jar · walk through the frozen army and crates before time runs out · painted ones break free · beat the 👑 Captains first';
    S.jar=this.sigArt('fp_jar',0,q.x,q.y+30,90,'🫙',46,q.y-10); S.glow=this.sigAdd(this.add.circle(q.x,q.y+10,70,0x9fe0ff,.12).setDepth(q.y-3)); this.tweens.add({targets:S.glow,alpha:{from:.5,to:1},scale:{from:.9,to:1.1},duration:800,yoyo:true,repeat:-1});
    S.paint=this.sigAdd(this.add.graphics().setDepth(-98000));   /* เหนือพื้น ใต้ทุกอย่างที่เรียงตาม y */ S.fx=this.sigAdd(this.add.graphics().setDepth(90010));
    if(this.add.container&&this.camUI){ const W=this.W||390,H=this.H||844,bw=210,bh=54,c=this.add.container(W/2,H-232).setDepth(9500); const g=this.add.graphics(); g.fillStyle(0x0d2a3a,.92).fillRoundedRect(-bw/2,-bh/2,bw,bh,bh/2); g.lineStyle(3,0x9fe0ff,1).strokeRoundedRect(-bw/2,-bh/2,bw,bh,bh/2);
      const t=this.add.text(0,0,'🧊 Open the Jar',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'19px',color:'#e8faff',stroke:'#0d2a3a',strokeThickness:4}).setOrigin(.5); c.add([g,t]); this.camUI(c); c.setScrollFactor?.(1); c.setVisible(false); S.btn=c; S.btnR={w:bw,h:bh}; S.objs.push(c); this.tweens.add({targets:c,scale:{from:1,to:1.06},duration:520,yoyo:true,repeat:-1}); } }
  fpBtnOver(p){ const S=this._sig; if(!S||S.type!=='frozenPantry'||S.phase!=='seek'||!S.btn?.visible)return false; const b=S.btn,r=S.btnR; return Math.abs(p.x-b.x)<=r.w/2+10&&Math.abs(p.y-b.y)<=r.h/2+10; }
  fpBtnHit(p){ if(!this.fpBtnOver(p))return false; this.fpOpen(this.waveObjective,this._sig); return true; }
  fpStatueArt(role,x,y,px){
    const key='fp_new_'+role;
    if(!this.realTex?.(key))return null;
    const statue=this.artSpr(key,x,y+px*.42,px,0,{anim:false,depth:y+2});
    statue?.setTint?.(0x96b9e8);
    return statue;
  }
  fpOpen(o,S){ if(S.phase!=='seek')return; this.missionMusic?.('bgm_m_frozen_still'); this.a12?.('lg_jar_open',.45,.3); const si=this.stageIndex||0,n=o.target; S.phase='paint'; S.btn?.setVisible(false); S.glow?.setVisible(false);
    /* v8.1.112 เจ้าของ: ช่วงกดปุ่มต้องอลังแบบ Legion ของ PoE → โหลสั่นแล้วแตกเป็นคลื่นน้ำแข็งแผ่ออก · พื้นที่ในคลื่นกลายเป็นโซนเวลาหยุด (โดมน้ำแข็ง) · รูปปั้นผุดตามคลื่นที่ผ่านไป */
    const BR=S.BR=FP_DOME,jx=S.x,jy=S.y; this.tweens.add({targets:S.jar,x:{from:(S.jar.x||jx)-4,to:(S.jar.x||jx)+4},duration:50,yoyo:true,repeat:5,onComplete:()=>{ S.jar.setAlpha?.(.45); }});
    this.time?.delayedCall?.(320,()=>{ if(S.phase!=='paint')return; this.screenFlash?.(0xdff6ff,.35,320); this.screenShake?.(320,.012); if(typeof Sfx!=='undefined')Sfx.bossWarn?.(); this.artFx?.('fp_shatter',jx,jy,200);
      S.bubble=this.sigAdd(this.add.circle(jx,jy,BR,0xe9e9ef,.82).setStrokeStyle(6,0xffffff,.9).setDepth(-98500).setAlpha(0)); this.tweens.add({targets:S.bubble,alpha:1,duration:700});   // v8.1.113 เจ้าของ: ในโดม = โลกขาวเทา (เวลาหยุด) แล้วผู้เล่นระบายสีรุ้งพาสเทลลงไป
      S.stopOn=true; S.global=true; this._holdFire=true; this.fpTimeStop(S,true);   /* v8.1.125 เจ้าของ: ช่วงระบายสี = มอนทั้งแผนที่หยุด + ตัวละครไม่โจมตี · ช่วงสั้น ๆ */
      for(let w=0;w<2;w++){ const wave=this.sigAdd(this.add.circle(jx,jy,40,0xdff6ff,0).setStrokeStyle(w?4:10,w?0x9fe0ff:0xffffff,.95).setDepth(90005)); this.tweens.add({targets:wave,scale:BR/40,alpha:{from:1,to:0},duration:760+w*220,delay:w*90,ease:'Cubic.easeOut',onComplete:()=>wave.destroy?.()}); }
      this.showBanner?.('⏳ TIME STANDS STILL','Paint the frozen army before time resumes — '+S.T+'s',1800); });
    const groups=S.full?6:5,lim=WORLD/2-130,gen=n-1; let k=0;   // v8.2.16 หมู่ละ: Captain 1 · Tank 1 · Shooter 2 · ที่เหลือ basic/fast/dasher · Frost General ทุกครั้ง (ยืนใกล้โหล)
    const rise=(t,x,y,d,big)=>this.time?.delayedCall?.(d,()=>{ if(!t.active&&t.active!==undefined)return; t.setAlpha(.85); const sx=t.scaleX||1,sy=t.scaleY||1,ty=t.y; t.setScale?.(sx*.2,sy*.2); t.y=ty+18; this.tweens.add({targets:t,scaleX:sx,scaleY:sy,y:ty,duration:340,ease:'Back.easeOut'}); this.artFx?.('fp_shatter',x,y,big?110:70); if(big||Math.random()<.34)this.vfxHitRing?.(x,y,0xbfe8ff,false); });
    const at=(x,y)=>380+Math.hypot(x-jx,y-jy)/.68,per=Math.ceil((n-1)/groups);
    for(let gi=0;gi<groups;gi++){ const ga=gi/groups*TAU+Math.random()*.5,gr=270+Math.random()*(BR-380),cx=S.x+Math.cos(ga)*gr,cy=S.y+Math.sin(ga)*gr; S.sq.push({cap:null,leaderless:false});   // กองทัพเป็นหมู่ ๆ กระจายทั่วโดม
      for(let j=0;j<per&&k<n-1;j++,k++){ const a=Math.random()*TAU,r=j?40+Math.sqrt(Math.random())*90:0,x=Phaser.Math.Clamp(cx+Math.cos(a)*r,-lim,lim),y=Phaser.Math.Clamp(cy+Math.sin(a)*r*.8,-lim,lim),role=FP_ROLES[j]||(j===5?'fast':j%3?'basic':(si>=2?'dasher':'fast')),R=FP_ROLE_LOOK[role]||FP_ROLE_LOOK.basic,cap=role==='captain';
        const c85=cap&&this.realTex?.('fp85_captain_statue'),art=this.fpStatueArt?.(role,x,y,R.px);
        const t=art||this.sigArt(c85?'fp85_captain_statue':'fp_statues',c85?0:cap?1:0,x,y+R.px*.42,R.px,cap?'🗿':'🍡',R.fs,y-8);
        if(!art)t.setTint?.(R.tint); t.setAlpha(0);
        const crown=cap?this.sigText(x,y-R.px*.62,'👑',20):null; crown?.setAlpha?.(0); const mark=!cap&&k%5===2?this.sigText(x+20,y-36,'🎁',18):null; mark?.setAlpha?.(0);
        const d=at(x,y); rise(t,x,y,d,cap); [crown,mark].forEach(m=>m&&this.time?.delayedCall?.(d+300,()=>m.setAlpha?.(1)));
        const q={x,y,t,mark,crown,chest:!!mark||cap,cap,role,art:!!art,px:R.px,sq:gi,gen:false,fill:0,state:'frozen',e:null,tok:0}; if(cap)S.sq[gi].cap=q; S.st.push(q); } }
    { const a=Math.random()*TAU,x=Phaser.Math.Clamp(jx+Math.cos(a)*170,-lim,lim),y=Phaser.Math.Clamp(jy+Math.sin(a)*130,-lim,lim),g85=this.realTex?.('fp85_general_statue'),px=S.full?130:118,art=this.fpStatueArt?.('general',x,y,px);
      const t=art||this.sigArt(g85?'fp85_general_statue':'fp_statues',g85?0:1,x,y+50,px,'🗿',62,y-8);
      if(!art)t.setTint?.(0x9fc4e0); t.setAlpha(0);
      const crown=this.sigText(x,y-84,'❄️👑',24); crown.setAlpha?.(0); const d=at(x,y)+200; rise(t,x,y,d,true); this.time?.delayedCall?.(d+300,()=>crown.setAlpha?.(1));
      S.st.push({x,y,t,mark:null,crown,chest:true,cap:false,role:'general',art:!!art,px,sq:-1,gen:true,fill:0,state:'frozen',e:null,tok:0}); k++;
      this.fpCrate(S,x+(x>jx?70:-70),y+40,S.full?'starsugar':'recipeink',true,d+260); }
    const tiers=S.full?FP_CRATES[1]:FP_CRATES[0]; tiers.forEach((tier,i)=>{ const a=(i+.5)/tiers.length*TAU+Math.random()*.4,r=200+Math.random()*(BR-300),x=Phaser.Math.Clamp(jx+Math.cos(a)*r,-lim,lim),y=Phaser.Math.Clamp(jy+Math.sin(a)*r*.85,-lim,lim); this.fpCrate(S,x,y,tier,false,at(x,y)); });   // ลังแช่แข็งระหว่างหมู่ · ต้องเดินไปทาสีก่อนเวลาเดิน
    S.T+=1.2; }   // เผื่อเวลาช่วงคลื่นแผ่
  fpCrate(S,x,y,tier,big,d){ const L=FP_CRATE_LOOK[tier]||FP_CRATE_LOOK.sugar,w=big?78:60,h=big?62:48;   // v8.2.16 ลังน้ำแข็ง (ของปลอมก่อนสั่งอาร์ต: กล่องน้ำแข็ง + อีโมจิของข้างใน)
    const row=FP85_ROW[tier]??0,spr=this.realTex?.('fp85_crates')?this.artSpr('fp85_crates',x,y+h/2,big?80:60,row*3,{feet:true}):null;   /* v8.2.23 ใบ 85 ลังแช่แข็ง (ไม่มีภาพ = กล่องสี+อีโมจิแบบเดิม) */
    const box=!spr&&this.add.rectangle?this.sigAdd(this.add.rectangle(x,y,w,h,0xcfeeff,.62).setStrokeStyle(3,L.edge,.95).setDepth(y-6)):null; const ic=spr?null:this.sigText(x,y-2,L.em,big?30:24); const lb=this.sigText(x,y+h/2+12,L.name,13);
    [spr,box,ic,lb].forEach(o=>{ if(!o)return; o.setAlpha?.(0); this.time?.delayedCall?.(d||400,()=>{ o.setAlpha?.(o===box?.62:1); if(o===box||o===spr)this.artFx?.('fp_shatter',x,y,80); }); });
    S.cr.push({x,y,tier,big,box,ic,lb,spr,row,fill:0,state:'frozen'}); }
  fpCrateGone(c,open){ if(c.spr){ c.spr.setFrame?.(c.row*3+2); this.tweens?.add?.({targets:c.spr,alpha:0,delay:open?380:120,duration:420}); } [c.box,c.ic,c.lb].forEach(o=>o?.setVisible?.(false)); }
  fpCrateOpen(S,c){ c.state='open'; this.fpCrateGone(c,true); this.a12?.('a16_crate_shatter',.4,.15); this.artFx?.('fp_shatter',c.x,c.y,c.big?130:100); this.vfxHitRing?.(c.x,c.y,0xffd166,!!c.big); const si=this.stageIndex||0;
    if(c.tier==='sugar'){ const su=Math.round((5+si*1.2)*(c.big?2:1)); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:c.x,y:c.y}; try{ this.missionLootBurst?.({type:'tree',noCur:true,noHold:true},su); }finally{ this._lootAt=L0; } }
    else if(c.tier==='gear'){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(c.x,c.y-20,(si>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }finally{ this._lootMinRare=false; } }
    else for(let i=0;i<(c.big?2:1);i++){ const g=this.spawnCurrencyDrop?.(c.x+i*34-(c.big?17:0),c.y-16,c.tier); if(g&&typeof g==='object'){ g.forgeQuantity=1; this.lootHold?.(g,1900); } }
    this.floatText?.(c.x,c.y-40,(FP_CRATE_LOOK[c.tier]||FP_CRATE_LOOK.sugar).em+' Frozen crate!',0xbfe8ff); }
  fpBlob(S,x,y){ const g=S.paint; if(!g||S.blobs>520)return; S.blobs++; const R=[0xffb3c7,0xffd1a3,0xfff2a8,0xb8f2c4,0xa8dcff,0xc9b8ff,0xffc4f0];   // v8.1.113 สีรุ้งพาสเทลไล่ตามทางเดิน + ประกาย
    S.hue=((S.hue||0)+1)%(R.length*3); const c=R[Math.floor(S.hue/3)];
    /* v8.1.123 เจ้าของ: พาสเทลใต้เท้าเล็กลง + เหมือนน้ำไร้รูปร่าง กระจายออก มีขยับเบา ๆ → แอ่งสีจากภาพนุ่ม (canvas ครั้งเดียว) ย้อมสี ยืด/หมุนสุ่ม ขยายออกตอนเกิด · วนใช้ซ้ำสูงสุด 320 แอ่ง · ไม่มี add.image (เทส) = วงกลมแบบเดิม */
    if(this.add?.image&&typeof document!=='undefined'){ const K='mm_puddle'; if(!this.textures.exists(K)){ const cv=document.createElement('canvas'); cv.width=cv.height=96; const x2=cv.getContext('2d'); for(const [ox,oy,rr] of [[48,48,40],[36,42,26],[60,40,24],[44,60,24],[62,58,20]]){ const gr=x2.createRadialGradient(ox,oy,0,ox,oy,rr); gr.addColorStop(0,'rgba(255,255,255,0.75)'); gr.addColorStop(.6,'rgba(255,255,255,0.4)'); gr.addColorStop(1,'rgba(255,255,255,0)'); x2.fillStyle=gr; x2.fillRect(0,0,96,96); } this.textures.addCanvas(K,cv); }
      const P=S.pud||(S.pud=[]); for(let i=0;i<2;i++){ const a=Math.random()*TAU,r=Math.random()*14,sz=22+Math.random()*20,tint=i?R[(Math.floor(S.hue/3)+2)%R.length]:c; let q; if(P.length<320){ q=this.sigAdd(this.add.image(0,0,K).setDepth(-98000)); P.push(q); } else { S.pi=((S.pi||0)+1)%P.length; q=P[S.pi]; this.tweens?.killTweensOf?.(q); }
        q.setPosition(x+Math.cos(a)*r,y+Math.sin(a)*r*.7).setTint?.(tint); q.setRotation?.(Math.random()*TAU); q.bx=sz/96*(.75+Math.random()*.5); q.by=sz/96*(.6+Math.random()*.4); q.ph=Math.random()*TAU; q._ready=false; q.setAlpha?.(.55+Math.random()*.2); q.setScale?.(q.bx*.25,q.by*.25);
        this.tweens?.add?.({targets:q,scaleX:q.bx,scaleY:q.by,duration:650+Math.random()*300,ease:'Cubic.easeOut',onComplete:()=>{ q._ready=true; }}); } }
    else for(let i=0;i<3;i++){ const a=Math.random()*TAU,r=Math.random()*20,rad=14+Math.random()*16; g.fillStyle?.(i?R[(Math.floor(S.hue/3)+i)%R.length]:c,.42+Math.random()*.18); g.fillCircle?.(x+Math.cos(a)*r,y+Math.sin(a)*r*.75,rad); }
    if(S.blobs%2===0&&this.add?.text&&(S.spk=(S.spk||0))<40){ S.spk++; const sx=x+(Math.random()-.5)*70,sy=y+(Math.random()-.5)*50,sp=this.add.text(sx,sy,Math.random()<.5?'✦':'✧',{fontSize:(12+Math.random()*10|0)+'px',color:'#ffffff'}).setOrigin(.5).setDepth(-97900).setAlpha(0); this.camWorld?.(sp);
      this.tweens.add({targets:sp,alpha:{from:0,to:1},scale:{from:.5,to:1.2},y:sy-10,duration:420,yoyo:true,hold:300,onComplete:()=>{ S.spk--; sp.destroy(); }}); } }
  fpTimeStop(S,on){ const R=(S.BR||520)+30,R2=R*R; this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active)return; if(on){ if(e._timeStop||e.isBoss||e._fpTok)return; const dx=e.x-S.x,dy=e.y-S.y; if(!S.global&&dx*dx+dy*dy>R2)return; e._timeStop=true; e.setVelocity?.(0,0); e.setTint?.(0xc9c9d2); (S.stopped||(S.stopped=[])).push(e); } });
    if(!on){ for(const e of S.stopped||[]){ if(!e)continue; e._timeStop=false; if(e.active){ if(e.tintColor)e.setTint?.(e.tintColor); else e.clearTint?.(); } } S.stopped=[]; S.stopOn=false; } }
  fpThaw(o,S){ S.phase='fight'; this.missionMusic?.('bgm_m_frozen_fight','thaw'); this._holdFire=false; S.global=false; this.fpTimeStop(S,false); S.fx?.clear?.(); if(S.pfx?.active)S.pfx.destroy(); S.pfx=null; this.screenFlash?.(0xdff6ff,.42,360); this.screenShake?.(380,.014); this.vfxHitRing?.(S.x,S.y,0xbfe8ff,true); this.a12?.('lg_statue_wake',.5,.3);
    if(S.bubble){ const b=S.bubble; b.setStrokeStyle?.(10,0xffffff,1); this.tweens.add({targets:b,scale:1.12,alpha:0,duration:420,ease:'Cubic.easeIn'}); }   // โดมเวลาหยุดแตก
    const wv=this.add.circle?.(S.x,S.y,40,0xffffff,0); if(wv){ this.sigAdd(wv.setStrokeStyle(12,0xdff6ff,1).setDepth(90005)); this.tweens.add({targets:wv,scale:(S.BR||520)/40,alpha:{from:1,to:0},duration:520,ease:'Cubic.easeOut'}); }
    this.showBanner?.('⏳ TIME RESUMES','',900);
    let woke=0,lost=0; for(const q of S.st){ if(q.state!=='frozen')continue; if(q.fill>=1){ this.fpWake(o,S,q); woke++; } else { this.artFx?.('fp_shatter',q.x,q.y,90); this.fpResolve(q,'lost'); lost++; } }   // ทุกตัวแตกพร้อมกัน
    let cOpen=0; for(const c of S.cr||[]){ if(c.state!=='frozen')continue; if(c.fill>=1){ cOpen++; c.state='opening'; this.time?.delayedCall?.(120+cOpen*140,()=>{ if(c.state==='opening')this.fpCrateOpen(S,c); }); } else { c.state='lost'; this.fpCrateGone(c,false); this.artFx?.('fp_shatter',c.x,c.y,80); } }
    S.army=woke;
    if(lost)this.objBonusFail?.(); o.target=woke+S.st.filter(q=>q.state==='pending').length; o.progress=0; S.fight=S.full?25:0;
    this.time?.delayedCall?.(700,()=>this.showBanner?.(woke?'❄️ They break free!':'🧊 Nothing was painted',woke?(woke+' awake'+(cOpen?' · '+cOpen+' crates':'')+(lost?' · '+lost+' shattered':'')):'The frozen army crumbles',1500)); if(!o.target)this.completeWaveObjective(); }
  fpWake(o,S,q){ const e=this.sigSpawnAt(q.x,q.y,q.gen,q.cap?'tank':q.role&&q.role!=='captain'&&q.role!=='general'?q.role:'basic'); if(!e){ q.state='pending'; return; } this._fpSeq=(this._fpSeq||0)+1; q.tok=this._fpSeq; e._fpTok=q.tok; q.e=e; q.state='awake'; this.tweens?.killTweensOf?.(q.t); q.t.setVisible(false); if(q.gen&&e.setScale)e.setScale((e.baseScale||e.scaleX||1)*1.25); q.crown?.setVisible?.(false); if(q.cap){ e.hp=(e.hp||1)*FP_CAPTAIN_HP; e.maxhp=e.hp; e.setScale?.((e.scaleX||1)*1.3); e.tintColor=0xffe39a; e.setTint?.(0xffe39a); }   /* Captain = Tank ตัวใหญ่สีทอง */
    const key='fp_new_'+q.role;
    if(this.realTex?.(key))this.artFollow?.(e,key,q.px);
    this.artFx?.('fp_shatter',q.x,q.y,110); if(q.gen)this.floatText?.(q.x,q.y-50,'🗿 The Frost General wakes!',0xffd0ea); }
  fpResolve(q,how){ q.state=how; q.e=null; this.tweens?.killTweensOf?.(q.t); q.t.setVisible(false); if(q.mark){ q.mark.setVisible(false); } q.crown?.setVisible?.(false); }
  fpVanish(q){ const e=q.e; if(e&&e.active&&e._fpTok===q.tok){ this.a12?.('lg_statue_refreeze',.35,.25); if(e._aura){ e._aura.destroy(); e._aura=null; } this.stopEnemyPresentation?.(e); e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; this.vfxSpawnPoof?.(e.x,e.y); }
    if(e)e._fpTok=0; this.artFx?.('fp_shatter',q.x,q.y,110); this.fpResolve(q,'lost'); }
  fpTick(dt,o,S){ const p=this.player; if(!p)return;
    if(S.phase==='seek'){ const near=this.sigNear(S.x,S.y,120); S.btn?.setVisible(near); if(!S.btn&&near)this.fpOpen(o,S); return; }
    if(S.phase==='paint'){ S.T-=dt; if(S.lx==null||Math.hypot(p.x-S.lx,p.y-S.ly)>16){ S.lx=p.x; S.ly=p.y; this.fpBlob(S,p.x,p.y); }
      if(S.pud&&(S.wob=((S.wob||0)+1)%2)===0){ const t=(this.time?.now||0)/1000; for(const q of S.pud)if(q._ready&&q.active)q.setScale(q.bx*(1+.06*Math.sin(t*1.7+q.ph)),q.by*(1+.06*Math.cos(t*1.3+q.ph))); }   /* แอ่งสีกระเพื่อมเบา ๆ */
      if(S.stopOn&&((S.stopT=(S.stopT||0)-dt)<=0)){ S.stopT=.3; this.fpTimeStop(S,true); }
      if(!S.pfx&&this.textures?.exists?.('vfx78_statue_paint'))S.pfx=this.artSpr('vfx78_statue_paint',p.x,p.y,110); S.pfx?.setPosition?.(p.x,p.y);   // ละอองสีหมุนรอบตัวตอนระบาย (ใบ 78)
      let painted=0,all=0; for(const q of S.st){ if(q.state!=='frozen')continue; all++; if(q.fill<1&&this.sigNear(q.x,q.y,S.PR)){ q.fill=Math.min(1,q.fill+dt/(q.gen?1.1:q.cap?.6:.35)); if(q.fill>=1){ q.t.clearTint?.(); if(!q.art)q.t.setTint?.(0xffd6ec); this.vfxHitRing?.(q.x,q.y,0xffb3d9,false); } } if(q.fill>=1)painted++; }
      for(const c of S.cr||[]){ if(c.state!=='frozen'||c.fill>=1)continue; all++; if(this.sigNear(c.x,c.y,S.PR)){ c.fill=Math.min(1,c.fill+dt/.5); if(c.fill>=1){ c.spr?.setFrame?.(c.row*3+1); c.box?.setStrokeStyle?.(4,0xffb3d9,1); c.box?.setFillStyle?.(0xffd6ec,.7); this.vfxHitRing?.(c.x,c.y,0xffb3d9,false); } } }
      o.progress=painted; const g=S.fx; if(g){ g.clear?.(); const f=Math.min(1,Math.max(0,S.T)/(S.T0||14)); g.fillStyle?.(0x190b24,.8); g.fillRoundedRect?.(p.x-60,p.y-96,120,10,5); g.fillStyle?.(f<.3?0xff5f7a:0x9fe0ff,.95); g.fillRoundedRect?.(p.x-58,p.y-94,116*f,6,3); }
      if(S.T<=0||painted>=all)this.fpThaw(o,S); return; }
    if(S.phase!=='fight')return; let left=0,done=0; if(S.full&&S.fight>0)S.fight-=dt;
    for(const q of S.st){ if(q.state==='pending'){ left++; this.fpWake(o,S,q); continue; }
      if(q.state==='awake'){ const e=q.e; if(!e||!e.active||e._fpTok!==q.tok){ this.fpResolve(q,'lost'); continue; } left++; if(q.mark)q.mark.setPosition(e.x+20,e.y-44); if(S.full&&S.fight<=0)this.fpVanish(q); continue; }
      if(q.state==='done')done++; }
    o.progress=done; if(S.full&&S.fight>0&&S.fx){ const g=S.fx,f=S.fight/25; g.clear?.(); g.fillStyle?.(0x190b24,.8); g.fillRoundedRect?.(p.x-60,p.y-96,120,10,5); g.fillStyle?.(f<.3?0xff5f7a:0xffb3d9,.95); g.fillRoundedRect?.(p.x-58,p.y-94,116*f,6,3); }
    if(!(S.full&&S.fight>0)&&S.fx){ S.fx.clear?.(); }
    for(const sq of S.sq||[]){ const c=sq.cap; if(!c||c.state!=='awake'||!c.e?.active)continue; S.fx?.lineStyle?.(3,0xffd166,.55); S.fx?.strokeCircle?.(c.e.x,c.e.y,120); }   // ออร่า Captain (ล้มก่อน = ลูกหมู่อ่อนลง)
    if(left<=0){ S.fx?.clear?.(); this.fpArmyBonus(S,done); this.completeWaveObjective(); } }
  fpArmyBonus(S,done){ const tot=(S.st||[]).length||1,r=done/tot; if(S._bonusGiven||r<.5)return; S._bonusGiven=true; const p=this.player; if(!p)return;   // v8.2.16 ล้มได้มาก = รางวัลดีขึ้น
    if(r>=.8){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(p.x+40,p.y-40,(this.stageIndex>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }finally{ this._lootMinRare=false; } this.floatText?.(p.x,p.y-70,'🏆 Army defeated! Gear box',0xffd166); }
    else { const g=this.spawnCurrencyDrop?.(p.x+40,p.y-30,'transmute'); if(g&&typeof g==='object'){ g.forgeQuantity=1; this.lootHold?.(g,1900); } this.floatText?.(p.x,p.y-70,'🟢 Most of the army defeated!',0xffd166); } }
  fpOnKill(e,o,S){ const tok=e._fpTok; e._fpTok=0; if(!o||o.done||!S||S.type!=='frozenPantry')return false; const q=(S.st||[]).find(x=>x.tok===tok&&x.state==='awake'); if(!q)return false; this.fpResolve(q,'done');
    if(q.cap&&S.sq?.[q.sq]&&!S.sq[q.sq].leaderless){ S.sq[q.sq].leaderless=true; let n=0; for(const m of S.st){ if(m.sq!==q.sq||m.state!=='awake'||!m.e?.active)continue; const me=m.e; me.spd=(me.spd||60)*FP_LEADERLESS; me.dmg=(me.dmg||10)*FP_LEADERLESS; me.setTint?.(0xb8b8c8); me.tintColor=0xb8b8c8; n++; } this.floatText?.(e.x,e.y-56,n?'👑 Captain down! Squad weakened':'👑 Captain down!',0xffd166); this.rubyVoiceReact?.('captain',200); this.vfxHitRing?.(e.x,e.y,0xffd166,true); }   // v8.2.16 ล้ม Captain = ลูกหมู่ช้าลง/ตีเบาลง
    if(q.chest){ const si=this.stageIndex||0,su=Math.round((4+si*1.1)*(q.gen?2.5:1)); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:e.x,y:e.y}; try{ this.missionLootBurst?.({type:'tree',noCur:true,noHold:true},su); }finally{ this._lootAt=L0; } } return true; }
  /* ===== v8.1.91 Hunger's Mouth แบบ PoE Breach (เจ้าของ: อยากให้เหมือน PoE เลย · C1-2 + เล่นซ้ำ/Delve)
     มือของ The Hunger โผล่จากพื้น → เดินไปแตะ = รอยแยกเปิด · วงขยายออกเรื่อย ๆ จนใหญ่กว่าจอ (โลกของความหิว) · มอนรอยแยก (ม่วง) เกิดทั่ววง
     ตัวจับเวลาเดินลง · ฆ่ามอนในวง = เวลาเพิ่ม · หมดเวลา = วงหดกลับเข้ามือ มอนรอยแยกที่เหลือถูกดูดหายไป
     มอนรอยแยกดรอป 🔮 Hunger Splinter (เดินเก็บ) · ครบ 100 = Hunger Stone · หีบมือประสาน 🤲 เกิดในวง เดินไปเปิดได้ตอนวงยังเปิด
     แบบเต็ม: วงใหญ่กว่า เวลาน้อยกว่า มอนถี่กว่า + Hand of the Hunger (บอสรอยแยก) เมื่อฆ่าครบ 40 ===== */
  hmSetup(o,S){ const full=this.fpFull(),q=this.objectivePosition(0,1,220,320); Object.assign(S,{x:q.x,y:q.y,full,phase:'seek',R:0,Rmax:full?1150:820,grow:full?150:115,life:full?9:11,lifeMax:20,kills:0,spawn:.6,chests:[],shards:[],gotSp:0,lord:full?40:HM_LORD_LIGHT,pk:0});   /* v8.2.17 Hand of the Hunger มาทั้งแบบเบาและเต็ม · มือโตตามจำนวนที่ฆ่า · มอนรอยแยกหลายแบบ */
    o.target=full?60:30; o.desc='Touch the Hunger’s hand to open the breach · kills inside keep it open · grab 🔮 splinters and open 🤲 chests before it closes';
    S.hand=this.sigArt('hm_hand',0,q.x,q.y+40,100,'✋',48,q.y-10); S.handS=S.hand.scaleX||1; S.ring=this.sigAdd(this.add.circle(q.x,q.y,1,0x2a0a3d,.18).setStrokeStyle(8,0xb36bff,.95).setDepth(q.y-60)); S.ring.setVisible(false);
    S.cue=this.sigAdd(this.add.circle(q.x,q.y,80,0xb36bff,.12).setStrokeStyle(3,0xd9a6ff,.8).setDepth(q.y-3)); this.tweens.add({targets:S.cue,scale:{from:.9,to:1.1},duration:650,yoyo:true,repeat:-1}); }
  hmOpen(o,S){ this.missionMusic?.('bgm_m_breach'); this.a12?.('lg_breach_open',.5,.5); S.phase='open'; S.openLeft=S.lifeMax; S.R=60; S.ring.setRadius(S.R).setVisible(true); S.cue.setVisible(false);
    if(this.artIsSpr(S.hand))S.hand.setFrame(1); else S.hand.setText?.('🖐️');
    this.hmRiftFx?.(S); this.artFx?.('vfx78_breach_open',S.x,S.y,135);
    const n=S.full?3:2,a0=Math.random()*TAU; for(let i=0;i<n;i++){ const a=a0+i*TAU/n,r=S.Rmax*(.35+.4*Math.random()),lim=WORLD/2-140; S.chests.push({x:Phaser.Math.Clamp(S.x+Math.cos(a)*r,-lim,lim),y:Phaser.Math.Clamp(S.y+Math.sin(a)*r,-lim,lim),t:null,open:false}); }
    S.hud=this.sigAdd(this.add.text(0,0,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#f1dcff',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5).setDepth(99990));
    this.showBanner?.('🖐️ The breach opens!','Kill inside to keep it open · grab 🔮 splinters · open 🤲 chests',1600); }
  hmRiftFx(S){
    if(!S.riftG){
      const graphics=this.add.graphics();
      if(!graphics.fillPoints||!graphics.strokePoints){ graphics.destroy?.(); return; }
      S.riftG=this.sigAdd(graphics.setPosition(S.x,S.y).setDepth(-98010));
      S.riftPoints=Array.from({length:64},(_,i)=>{
        const a=TAU*i/64;
        return {a,ux:Math.cos(a),uy:Math.sin(a),ridge:.55*Math.sin(13*a)+.30*Math.cos(23*a)+.15*Math.sin(29*a),x:0,y:0};
      });
      S.ring.setVisible(false);
    }
    const g=S.riftG,points=S.riftPoints,r=S.R;
    g.clear();
    if(r<=0)return;
    const reduced=!!Save.data?.settings?.reducedMotion,closing=S.phase==='close';
    const t=reduced?0:(S.t||0),low=closing?1:Math.max(0,1-S.life/2.5);
    const strength=Math.min(1,r/150),roughness=Math.min(28,r*.17);
    for(const p of points){
      const edge=r+roughness*(p.ridge+.14*Math.sin(p.a*7+t*2.3));
      p.x=p.ux*edge; p.y=p.uy*edge;
    }
    g.fillStyle(0x381857,(closing?.29:.36)*strength).fillPoints(points,true);
    g.lineStyle(30,0x642b8d,.19*strength).strokePoints(points,true,true);
    g.lineStyle(11,0x190c30,.72*strength).strokePoints(points,true,true);
    for(let i=0;i<points.length;i+=4){
      const a=points[i],b=points[(i+1)%64],c=points[(i+2)%64];
      const inward=Math.min(r*.21,22+(i%3)*12);
      const offset=closing?-inward*.12:0;
      const veinAlpha=(.24+.16*Math.sin(a.a*11-t*2)+.20*low)*strength;
      g.lineStyle(2.4,closing?0xd18eec:0xa263d5,veinAlpha);
      g.lineBetween(a.x+a.ux*offset,a.y+a.uy*offset,b.x+b.ux*offset,b.y+b.uy*offset);
      g.lineBetween(b.x,b.y,c.x*(1-inward/r),c.y*(1-inward/r));
      if(i%8===0)g.lineBetween(c.x*(1-inward/r),c.y*(1-inward/r),c.x*(1-inward*1.8/r),c.y*(1-inward*1.8/r));
    }
  }
  hmTick(dt,o,S){ const p=this.player,g=this.objNodeG; if(!p)return; S.t=(S.t||0)+dt;
    if(S.phase==='seek'){ if(this.sigNear(S.x,S.y,85))this.hmOpen(o,S); return; }
    if(S.phase==='open'){
      S.openLeft=Math.max(0,(S.openLeft??S.lifeMax)-dt);
      S.life=Math.min(S.openLeft,S.life-dt);
      if(S.life<=1e-6){ S.life=0; S.phase='close'; this.a12?.('lg_breach_collapse',.5,.5); this.artFx?.('hm_collapse',S.x,S.y,420); this.showBanner?.('🌀 The breach collapses','Everything inside is pulled back through',1200); return; }
      S.R=Math.min(S.Rmax,S.R+S.grow*dt);
      S.ring.setRadius(S.R); this.hmRiftFx?.(S);
      for(const c of S.chests){ if(c.open)continue; const inside=this.dist(c.x,c.y,S.x,S.y)<S.R-30; if(inside&&!c.t){ c.t=this.sigArt('hm_breach_chest',0,c.x,c.y+30,80,'🤲',40,c.y-8); this.vfxSpawnPoof?.(c.x,c.y); } if(c.t&&this.dist(p.x,p.y,c.x,c.y)<70){ c.open=true; if(this.artIsSpr(c.t))c.t.setFrame(1); else c.t.setText?.('✨'); this.hmChest(S,c); } }
      S.spawn-=dt; if(S.spawn<=0){ S.spawn=S.full?.7:.95; const n=Math.min(5,2+Math.floor(S.R/350)); let cx=S.x,cy=S.y; for(let t=0;t<4;t++){ const a=Math.random()*TAU,r=S.R*(.25+.7*Math.random()); cx=S.x+Math.cos(a)*r; cy=S.y+Math.sin(a)*r; if(this.dist(cx,cy,p.x,p.y)>180)break; }
        S.pk++; { for(let k=0;k<n;k++){ const el=k===0&&S.pk%6===0,si0=this.stageIndex||0; let ty=el?(si0>=2?undefined:'tank'):HM_MIX[Math.floor(Math.random()*HM_MIX.length)]; if(ty==='tank'&&!el&&S.R<500)ty='basic'; const e=this.sigSpawnAt(cx+(Math.random()-.5)*90,cy+(Math.random()-.5)*90,el&&si0>=2,ty); if(e){ e._breach=true; e.setTint?.(0xc59bff); e.tintColor=0xc59bff; this.breachFoeArt?.(e); } } } }
      if(S.lord>0&&S.kills>=S.lord){ S.lord=-1; const a=Math.random()*TAU,e=this.sigSpawnAt(p.x+Math.cos(a)*320,p.y+Math.sin(a)*320,true); if(e){ this.a12?.('lg_hand_lord',.5,.5); e._breach=true; e._hmLord=true; if(e.setScale)e.setScale((e.baseScale||e.scaleX||1)*1.6); this.artFollow?.(e,'hm_hand_lord',160); if(e.maxhp){ e.maxhp*=S.full?4:2.5; e.hp=e.maxhp; } e.setTint?.(0x9b6bff); this.showBanner?.('🖐️ Hand of the Hunger','The breach’s master reaches through — beat it for a splinter hoard',1500); } }
    }
    if(S.phase==='close'){ S.R=Math.max(0,S.R-S.Rmax*dt/.85); S.ring.setRadius(Math.max(1,S.R)); this.hmRiftFx?.(S); this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&e._breach&&this.dist(e.x,e.y,S.x,S.y)>S.R){ e._breach=false; e._hmLord=false; e._brSp=null; if(e._aura){ e._aura.destroy(); e._aura=null; } this.stopEnemyPresentation?.(e); e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; this.vfxSpawnPoof?.(e.x,e.y); } });
      for(const c of S.chests)if(c.t&&!c.open&&this.dist(c.x,c.y,S.x,S.y)>S.R){ c.open=true; c.t.setVisible?.(false); }
      if(S.R<=0){ S.phase='sealed'; S.ring.setVisible(false); this.hmBurst(o,S); return; } }
    for(const sh of S.shards){ if(sh.got)continue; sh.life-=dt; const d=this.dist(p.x,p.y,sh.x,sh.y); if(d<90){ sh.got=true; sh.t.setVisible?.(false); S.gotSp+=sh.n; this.a12?.('lg_splinter_pick',.26,.12); this.artFx?.('vfx78_splinter_pick',p.x,p.y,60); this.hmSplinters(sh.n); } else if(sh.life<=0){ sh.got=true; sh.t.setVisible?.(false); } }
    S.shards=S.shards.filter(x=>!x.got); o.progress=Math.min(o.target,S.kills); if(S.hand?.setScale&&S.handS){ const f=1+HM_HAND_GROW*Math.min(1,S.kills/(o.target||30)); if(Math.abs((S.hand._gf||1)-f)>.02){ S.hand._gf=f; S.hand.setScale(S.handS*f); } }   // มือโตขึ้นตามที่ฆ่า
    S.hud?.setText(S.phase==='open'?'⏳ '+Math.ceil(S.life)+'s   🔮 '+S.gotSp:'').setPosition(p.x,p.y-84);
    g?.clear(); if(S.phase==='open'){ const f=Math.max(0,Math.min(1,S.life/S.lifeMax)); g?.fillStyle(0x190b24,.8).fillRoundedRect(p.x-40,p.y-70,80,7,3).fillStyle(0xb36bff,.95).fillRoundedRect(p.x-39,p.y-69,78*f,5,2); } }
  hmOnKill(e,o,S){ if(!e||e.isBoss||S.phase!=='open')return; const lord=e._hmLord; e._hmLord=false; const inside=e._breach||this.dist(e.x,e.y,S.x,S.y)<S.R; e._breach=false; if(!inside)return;
    S.kills++; if(lord)this.hmLordHoard(S,e); S.life=Math.min(S.openLeft??S.lifeMax,S.life+(lord?5:e.isElite||e.isMini?1.5:.35)); const n=lord?10:e.isElite||e.isMini?3:Math.random()<.3?1:0;
    if(n){ const t=this.sigArt('hm_splinter',0,e.x,e.y,lord?40:28,'🔮',lord?32:22); S.shards.push({x:e.x,y:e.y,n,t,life:20}); } }
  hmLordHoard(S,e){ const si=this.stageIndex||0,su=Math.round((14+si*2)*(S.full?1.3:1)),L0=this._lootAt; this.sugarStage+=su; this.sugarRun+=su; this._lootAt={x:e.x,y:e.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; }   // v8.2.17 Hand of the Hunger ล้ม = กองสมบัติ (+ กล่อง Gear แบบเต็ม)
    if(S.full){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(e.x+40,e.y-20,(si>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }finally{ this._lootMinRare=false; } } this.floatText?.(e.x,e.y-70,'🖐️ The Hand falls!',0xe3c4ff); this.screenShake?.(260,.01); }
  hmChest(S,c){ const si=this.stageIndex||0,su=Math.round((8+si*1.6)*(S.full?1.3:1)),L0=this._lootAt; this.sugarStage+=su; this.sugarRun+=su; this.vfxHitRing?.(c.x,c.y,0xd9a6ff,true); this.a12?.('lg_breach_chest',.45,.2); this.artFx?.('vfx78_breach_chest',c.x,c.y,160); this.floatText?.(c.x,c.y-60,'🤲 Breach chest!',0xe3c4ff);
    this._lootAt={x:c.x,y:c.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; } const n=S.full?6:3; S.gotSp+=n; this.hmSplinters(n); }
  hmSplinters(n){ const d=Save.data; if(!d||!n)return; d.splinters=(d.splinters|0)+n; let made=0; while(d.splinters>=100){ d.splinters-=100; d.hungerStones=(d.hungerStones|0)+1; made++; } if(made){ this.showBanner?.('🪨 Hunger Stone!','100 splinters fused into a stone',1500); const p=this.player; if(p)this.a12?.('lg_hunger_stone',.5,.5); this.artFx?.('vfx78_stone_fuse',p.x,p.y,150); } }
  hmBurst(o,S){ if(o.done)return; const si=this.stageIndex||0,su=Math.max(6,Math.round(S.kills*(.5+si*.15)*(S.full?1.3:1))); this.screenFlash?.(0xb36bff,.25,240); this.vfxHitRing?.(S.x,S.y,0xb36bff,true);
    this.floatText?.(S.x,S.y-60,'🖐️ The breach seals · '+S.kills+' slain · 🔮 '+S.gotSp,0xe3c4ff); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:S.x,y:S.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; } S.hud?.setText(''); this.completeWaveObjective(); }
  /* ===== v8.1.82 Creeping Roots (League → Blight · รากของ The Hunger เลื้อยมาดูดดอกความทรงจำ C2-3 · แทน Defend Nectar)
     รากเป็นเส้นทาง (เห็นล่วงหน้า) · มอนเดินตามเส้นเข้าหาดอก (ไม่ไล่ผู้เล่น) · ไม่มีป้อม · ยืนบนรากแม่ปลายเส้น 2.2s = ปิดเส้น · ดอกล้ม = เวลา −20% ไม่เสียเลือดผู้เล่น
     แบบเบา: 2 เส้น · แบบเต็ม: 3 เส้น + แตกกิ่งเส้นที่ 4 ที่ 18s · ปิดครบทุกเส้น = จบก่อนเวลา + รางวัลพิเศษ ===== */
  crLane(S,a,kind){ const K=CR_KINDS[kind]||CR_KINDS.fast,L0=560+Math.random()*60,pts=[],lim=WORLD/2-120; for(let k=0;k<=4;k++){ const r=L0*(1-k/4),w=k>0&&k<4?(Math.random()-.5)*160:0,x=S.x+Math.cos(a)*r+Math.cos(a+Math.PI/2)*w,y=S.y+Math.sin(a)*r+Math.sin(a+Math.PI/2)*w; pts.push({x:Phaser.Math.Clamp(x,-lim,lim),y:Phaser.Math.Clamp(y,-lim,lim)}); }
    pts[4]={x:S.x,y:S.y}; const m=pts[0],rk87='cr87_root_'+(kind||'fast'),r87=this.realTex?.(rk87),t=this.sigArt(r87?rk87:'cr_root_mother',0,m.x,m.y+40,100,'🌱',50,m.y-12),ring=this.sigAdd(this.add.circle(m.x,m.y+6,84,0xb36bff,.1).setStrokeStyle(4,K.c,.85).setDepth(m.y-2)),lb=this.sigText(m.x,m.y-78,K.em,26);
    t?.setAlpha?.(0); ring.setVisible(false); lb?.setAlpha?.(0); if(!r87)t?.setTint?.(K.c);   /* v8.2.24 ใบ 87 รากแม่ 3 แบบ */   /* v8.2.18 รากแม่ 3 แบบ: เร็ว (ปล่อยมอนเร็วถี่) · หนา (Tank ตัดนานกว่า) · แตกตัว (มอนตายแล้วแตกเป็น 2) */   // v8.1.136 เจ้าของ: รากงอกออกจากตรงกลางแบบ Blight จริง → รากแม่โผล่ตอนรากงอกถึงปลาย
    return {pts,open:true,pc:0,spawn:1+Math.random(),grow:0,t,ring,lb,kind:kind||'fast',K}; }
  /* v8.1.136 รากงอกจากดอกตรงกลางออกไปหารากแม่ (grow 0→1) · ระหว่างงอกยังไม่ปล่อยมอน/ตัดไม่ได้ */
  crGrowPts(L){ const P=L.pts,seg=P.length-1,g=Math.max(0,Math.min(1,L.grow==null?1:L.grow))*seg,out=[P[seg]]; for(let k=seg;k>0&&g>seg-k;k--){ const a=P[k],b=P[k-1],f=Math.min(1,g-(seg-k)); out.push({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f}); } return out; }
  crDraw(S){ const G=S.laneG; if(!G)return; G.clear(); const vine=this.textures?.exists?.('cr_root_vine');
    for(const L of S.lanes){ const Q=this.crGrowPts(L);
      if(vine){ if(!L.vines){ L.vines=[]; for(let k=L.pts.length-1;k>0;k--){ const a=L.pts[k],b=L.pts[k-1],v=this.camWorld(this.add.tileSprite(a.x,a.y,1,28,'cr_root_vine').setOrigin(0,.5).setRotation(Math.atan2(b.y-a.y,b.x-a.x)).setDepth(S.y-42)); v.tileScaleX=v.tileScaleY=28/((ASSET_FX.cr_root_vine&&ASSET_FX.cr_root_vine.fh)||32); v._len=Math.hypot(b.x-a.x,b.y-a.y); this.sigAdd(v); L.vines.push(v); } }
        L.vines.forEach((v,i)=>{ const q0=Q[i],q1=Q[i+1],w=q1?Math.hypot(q1.x-q0.x,q1.y-q0.y):0; v.setVisible(w>1); if(w>1)v.setSize?.(w,28); v.width=w; v.setAlpha(L.open?1:.3); }); }
      else { G.lineStyle(L.open?14:8,L.open?0x7a3dbf:0x5a5560,L.open?.38:.18); G.beginPath(); G.moveTo(Q[0].x,Q[0].y); for(let k=1;k<Q.length;k++)G.lineTo(Q[k].x,Q[k].y); G.strokePath(); if(L.open&&L.grow>=1){ G.fillStyle(0xd9a6ff,.5); for(let k=1;k<4;k++)G.fillCircle(L.pts[k].x,L.pts[k].y,7); } }
      if(L.grow<1){ const tip=Q[Q.length-1]; G.fillStyle(0xd9a6ff,.85); G.fillCircle?.(tip.x,tip.y,9); G.lineStyle(3,0xb36bff,.6); G.strokeCircle?.(tip.x,tip.y,15); } } }
  crGrowTick(dt,S){ let any=false; for(const L of S.lanes){ if(L.grow>=1)continue; any=true; L.grow=Math.min(1,L.grow+dt/1.8);
      if(L.grow>=1){ const m=L.pts[0]; L.t?.setAlpha?.(1); L.ring?.setVisible(true); this.vfxHitRing?.(m.x,m.y,0xb36bff,false); this.screenShake?.(80,.003); } }
    if(any)this.crDraw(S); return any; }
  crSplit(e,L,i){ for(let k=0;k<2;k++){ const m=this.sigSpawnAt(e.x+(k?24:-24),e.y+(Math.random()-.5)*30,false,'fast'); if(!m)continue; m.setScale?.((m.scaleX||1)*.7); if(m.maxhp){ m.maxhp*=.4; m.hp=m.maxhp; } m.setTint?.(0xd9a6ff); m.tintColor=0xd9a6ff; if(L&&L.open){ m._lanePath=L; m._laneI=Math.min(4,i||1); m._goTo=L.pts[m._laneI]; } } }   // v8.2.18 รากแตกตัว: ตายแล้วแตกเป็น 2 ตัวเล็กเดินตามรากต่อ
  crSetup(o,S){ const full=this.fpFull(),q=this.objectivePosition(0,1,120,200); Object.assign(S,{x:q.x,y:q.y,full,hp:300,maxhp:300,lanes:[],branch:full?18:CR_BRANCH_LIGHT});
    o.target=full?48:38; o.desc='Roots crawl toward the nectar flower · stand on each 🌱 root mother to cut its path · hold until the timer ends';
    const tex=this.textures?.exists?.('objective_nectar_flower'); S.flower=tex?this.sigAdd(this.add.image(q.x,q.y,'objective_nectar_flower').setScale(.6).setDepth(q.y+2)):this.sigText(q.x,q.y-10,'🌺',48);
    S.laneG=this.sigAdd(this.add.graphics().setDepth(q.y-40)); const n=full?3:2,a0=Math.random()*TAU,ks=Object.keys(CR_KINDS); for(let i=ks.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [ks[i],ks[j]]=[ks[j],ks[i]]; } S.kq=ks; for(let i=0;i<n;i++)S.lanes.push(this.crLane(S,a0+i/n*TAU+(Math.random()-.5)*.5,ks[i%ks.length])); this.crDraw(S);
    this.showBanner?.('🌱 Creeping Roots','Roots burst from the flower — cut them at the root mother',1500); }
  crTick(dt,o,S){ const g=this.objNodeG; S.t=(S.t||0)+dt; this.crGrowTick(dt*(o._rpFast||1),S);
    if(S.branch>0&&S.t>=S.branch){ S.branch=-1; const a=Math.atan2(S.lanes[0].pts[0].y-S.y,S.lanes[0].pts[0].x-S.x)+Math.PI*(.8+Math.random()*.4); const kd=(S.kq||['split'])[S.lanes.length%(S.kq?.length||1)]; S.lanes.push(this.crLane(S,a,kd)); this.crDraw(S); this.showBanner?.('🌱 A new root splits off!',(CR_KINDS[kd]?.name||'Another root')+' is crawling in',1100); }
    g?.clear(); let open=0;
    for(const L of S.lanes){ if(!L.open)continue; open++; if(L.grow<1)continue; const m=L.pts[0],near=this.sigNear(m.x,m.y,90),CUT=L.K?.cut||2.2; if(L.lb&&!L.lbOn){ L.lbOn=true; L.lb.setAlpha?.(1); } L.pc=Math.max(0,Math.min(CUT,L.pc+(near?dt:-dt*.5))); L.ring.setFillStyle(0xb36bff,near?.24:.1);
      if(L.pc>0){ g?.lineStyle(7,0xffffff,.95); g?.beginPath(); g?.arc(m.x,m.y+6,78,-Math.PI/2,-Math.PI/2+TAU*L.pc/CUT,false); g?.strokePath(); }
      if(L.pc>=CUT){ L.open=false; open--; L.lb?.setVisible?.(false); if(this.artIsSpr(L.t))L.t.setFrame(1); else L.t.setAlpha(.35); L.ring.setVisible(false); this.crDraw(S); this.vfxHitRing?.(m.x,m.y,0xd9a6ff,true); this.a12?.('lg_root_cut',.4,.2); this.artFx?.('vfx78_root_cut',m.x,m.y,140); this.floatText?.(m.x,m.y-60,'✂️ Root cut!',0xd9a6ff); continue; }
      L.spawn-=dt; if(L.spawn<=0){ L.spawn=(S.full?2:2.6)*(L.K?.spawn||1); const e=this.sigSpawnAt(m.x+(Math.random()-.5)*40,m.y+(Math.random()-.5)*40,false,L.K?.type); if(e){ e._lanePath=L; e._laneI=1; e._goTo=L.pts[1]; if(L.K?.split)e._crSplit=true; if(L.K){ e.setTint?.(L.K.c); e.tintColor=L.K.c; } } } }
    let att=0; this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active)return; if(e._lanePath){ if(!S.lanes.includes(e._lanePath)){ e._lanePath=null; e._goTo=null; return; } if(this.dist(e.x,e.y,e._goTo.x,e._goTo.y)<40&&e._laneI<4){ e._laneI++; e._goTo=e._lanePath.pts[e._laneI]; } }
      if(!e.isBoss&&this.dist(e.x,e.y,S.x,S.y)<120)att++; });
    S.hp-=att*(S.full?3:2.4)*dt; if(this.sigNear(S.x,S.y,135))S.hp=Math.min(S.maxhp,S.hp+16*dt);
    if(S.hp<=0){ S.hp=S.maxhp*.6; o.progress=Math.max(0,o.progress-o.target*.2); this.objBonusFail?.(); this.screenShake?.(120,.006); this.showBanner?.('🥀 The flower wilted · timer -20%','It sprouts again — keep the roots away!',1400); }
    const f=S.hp/S.maxhp; g?.fillStyle(0x190b24,.78).fillRoundedRect(S.x-36,S.y-78,72,8,4).fillStyle(f<.35?0xff5f7a:0xffc95c,.95).fillRoundedRect(S.x-34,S.y-76,68*f,4,2); S.flower?.setTint?.(att?0xff8a9c:0xffffff);
    o.progress=Math.min(o.target,o.progress+dt);
    if(open<=0&&!S.allCut){ S.allCut=true; const si=this.stageIndex||0,su=Math.round(10+si*1.6); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:S.x,y:S.y}; try{ this.missionLootBurst?.({type:'tree',noCur:true,noHold:true},su); }finally{ this._lootAt=L0; } this.floatText?.(S.x,S.y-96,'🌺 Every root cut!',0xffc95c); o.progress=o.target; }
    if(o.progress>=o.target)this.completeWaveObjective(); }
  /* ===== v8.1.83 Hunger Herald (League → Harbinger · ทูตของ The Hunger เปิดประตูให้ฝูงโมจิจืด C1-1 · เจอหลังจบบทสอน = Bounty แรกตอนเล่นซ้ำ)
     Herald ลอยไปมา (ไม่ไล่ผู้เล่น · e._goTo จุดสุ่มรอบสนาม) · ประตู 2/3 บานปล่อยฝูงพุ่งใส่ผู้เล่นเป็นระยะ · ฆ่า Herald = ปิดทุกประตู + รางวัลรวมเศษสกุลเงินตีบวก ===== */
  /* v8.2.20 เจ้าของ 19 พ.ย.: Herald ตีไม่ได้ · ลอยอยู่ในจอใกล้ผู้เล่น (เดิมเกิดมุมไกลหาไม่เจอ) · ยิงลำแสงฟ้าม่วงเส้นเดียวใส่มอนให้เก่งขึ้น (_hhPow)
     ประตูเปิดค้างจนจบภารกิจ (ปิดไม่ได้) · ปล่อยฝูง + ลูกน้องพิเศษ: 💚 ฮีล · 🎺 บัฟ (ปล่อยพลังให้ตัวข้าง ๆ) · 👻 สิง (วิ่งเข้าไปสิงมอนอื่น) · จบเมื่อหมดเวลา · ล้มตัวที่ถูกบัฟได้มาก = รางวัลมาก */
  hhSetup(o,S){this.a23Cue?.('event_hunger_herald_open',.3,1); this.missionMusic?.('bgm_m_herald'); const full=this.fpFull(),n=full?3:2,p=this.player||{x:0,y:0}; Object.assign(S,{full,gates:[],h:null,t:0,beamCd:2,beam:null,minions:[],powKills:0,mCd:6,ang:Math.random()*TAU}); o.target=HH_DUR; o.progress=0; o._timedGoal=true; const kinds=HH_GATES.slice(); for(let i=kinds.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [kinds[i],kinds[j]]=[kinds[j],kinds[i]]; }
    o.desc='The 📯 Herald can’t be hurt — it beams power into monsters while its '+n+' gates stay open · beat the empowered ones · last '+HH_DUR+'s';
    for(let i=0;i<n;i++){ const q=this.objectivePosition(i,n,280,420); const EL=(x,y,w,h,c,al)=>this.add.ellipse?this.add.ellipse(x,y,w,h,c,al):this.add.circle(x,y,w/2,c,al),sh=this.sigAdd(EL(q.x,q.y+44,190,58,0x12081c,.38).setDepth(q.y-12)),gl=this.sigAdd(EL(q.x,q.y+40,160,46,0xb36bff,.18).setDepth(q.y-11)); gl.setBlendMode?.(Phaser.BlendModes.ADD); this.tweens.add({targets:gl,alpha:{from:.1,to:.32},scaleX:{from:.92,to:1.08},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
      const kind=kinds[i%kinds.length],GL=HH_GATE_LOOK[kind],lb=this.sigText(q.x,q.y-92,GL.em,28); S.gates.push({x:q.x,y:q.y,cd:1.5+i*.8,kind,lb,t:this.sigArt('hh_gate',0,q.x,q.y,140,'🌀',46,q.y-10),ring:this.sigAdd(EL(q.x,q.y+40,150,46,0x7a3dbf,.12).setStrokeStyle(4,GL.c,.85).setDepth(q.y-10)),sh,gl}); }
    const hx=p.x+Math.cos(S.ang)*HH_ORBIT,hy=p.y+Math.sin(S.ang)*HH_ORBIT*.7; S.h={x:hx,y:hy,t:this.sigArt('hh_herald',0,hx,hy,120,'📯',52,hy-10)}; S.h.t?.setDepth?.(90020); S.fx=this.sigAdd(this.add.graphics().setDepth(90025));
    this.showBanner?.('📯 Hunger Herald','It can’t be hurt — it empowers monsters while its gates stay open!',1600); }
  hhEmpower(S,e,by){ if(!e||!e.active||e._hhPow||e.isBoss)return false; e._hhPow=true; if(e.maxhp){ e.maxhp=Math.round(e.maxhp*HH_POW.hp); e.hp=Math.min(e.maxhp,Math.round((e.hp||e.maxhp)*HH_POW.hp)); } else if(e.hp)e.hp=Math.round(e.hp*HH_POW.hp); if(e.spd)e.spd*=HH_POW.spd; if(e.dmg)e.dmg=Math.round(e.dmg*HH_POW.dmg); e.setScale?.((e.scaleX||1)*1.15); e.setTint?.(0x9a7bff); e.tintColor=0x9a7bff; this.vfxHitRing?.(e.x,e.y,0xb36bff,false); this.a12?.('a16_empower',.35,.3); if(S&&!S._saidPow){ S._saidPow=true; this.rubyVoiceReact?.('empowered',300); } this.hhMutate?.(e); return true; }   // v8.2.20 มอนที่ถูกบัฟ: เลือด/ความเร็ว/ดาเมจขึ้น + สีม่วง + วงออร่า
  hhMutate(e){ if(!e||e._hhMut||e._hhKid)return null; const pool=(this.stageIndex||0)<5?HH_MUT_CH1:HH_MUT_ALL,k=pool[Math.floor(Math.random()*pool.length)],M=HH_MUT[k]; e._hhMut=k; e._hhMT=.8+Math.random()*.8; e._hhPh='idle'; if(k==='shell')e._hhShell=HH_SHELL; this.floatText?.(e.x,e.y-66,M.em+' '+M.name,M.c); return k; }
  /* ทุกเฟรม: ไอคอน + พฤติกรรมของแต่ละ mutation · วาดลงกราฟิก S.fx (เคลียร์ทุกเฟรมอยู่แล้ว) */
  hhMutTick(dt,S,g){ const p=this.player; if(!p)return; const si=this.stageIndex||0; S.mi=(S.mi||[]).filter(q=>{ if(q.e&&q.e.active&&q.e._hhPow&&q.e._hhMut){ q.t.setPosition?.(q.e.x,q.e.y-50*(q.e.scaleY||1)); q.t.setDepth?.(q.e.y+30); return true; } q.t?.destroy?.(); if(q.e)q.e._hhMi=null; return false; });
    this.enemies?.children?.iterate?.(e=>{ if(!e||!e.active||!e._hhPow||!e._hhMut)return; const k=e._hhMut,M=HH_MUT[k],sc=e.scaleX||1;
      if(!e._hhMi&&S.mi.length<HH_MUT_ICONS&&this.add?.text){ const t=this.sigAdd(this.add.text(e.x,e.y-50,M.em,{fontSize:'18px',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5)); e._hhMi=t; S.mi.push({e,t}); }
      e._hhMT-=dt; const d=this.dist(e.x,e.y,p.x,p.y);
      if(k==='shell'&&e._hhShell>0){ g?.lineStyle?.(3,M.c,.35+.18*e._hhShell); g?.strokeCircle?.(e.x,e.y,30*sc+e._hhShell*4); }
      else if(k==='frenzy'){ if(e._hhPh==='idle'&&e._hhMT<=0&&d<520){ e._hhPh='aim'; e._hhMT=.6; e._hhTo={x:p.x,y:p.y}; }
        else if(e._hhPh==='aim'){ const T=e._hhTo; g?.lineStyle?.(6,0xff5a3c,.25+.35*(1-e._hhMT/.6)); g?.lineBetween?.(e.x,e.y,T.x,T.y); if(e._hhMT<=0){ e._hhPh='dash'; e._hhMT=.35; } }
        else if(e._hhPh==='dash'){ const T=e._hhTo,dd=Math.hypot(T.x-e.x,T.y-e.y),st=Math.min(dd,560*dt); if(dd>1)e.setPosition?.(e.x+(T.x-e.x)/dd*st,e.y+(T.y-e.y)/dd*st); if(e._hhMT<=0||dd<4){ e._hhPh='idle'; e._hhMT=HH_FRENZY_CD; } } }
      else if(k==='orbs'&&e._hhMT<=0&&d<600){ e._hhMT=HH_ORB_CD; const a=Math.atan2(p.y-e.y,p.x-e.x); for(const o of [-.28,0,.28])this.foeShot?.(e.x,e.y,a+o,170,Math.round(5+si*1.1),0xc28bff,1.2); }
      else if(k==='leech'){ if(e._hhMT<=0){ e._hhMT=1; let best=null,bd=1e9; this.enemies.children.iterate(q=>{ if(q&&q.active&&q!==e&&!q.isBoss&&q.maxhp&&q.hp<q.maxhp){ const dd=this.dist(q.x,q.y,e.x,e.y); if(dd<HH_LEECH_R&&dd<bd){ bd=dd; best=q; } } }); e._hhLeech=best; e._hhLT=.45; if(best)best.hp=Math.min(best.maxhp,best.hp+best.maxhp*HH_LEECH_HEAL); }
        e._hhLT=(e._hhLT||0)-dt; const L=e._hhLeech; if(L&&L.active&&e._hhLT>0){ g?.lineStyle?.(3,M.c,.75); g?.lineBetween?.(e.x,e.y,L.x,L.y); g?.fillStyle?.(M.c,.8); g?.fillCircle?.(L.x,L.y-30,5); } } }); }
  /* กระดองกันดาเมจ: ฮิตละชั้น · กันหนึ่งชุดกระสุนลบหลายชั้น (เว้น .12 วิ) */
  hhShellBlock(e){ if(!(e&&e._hhPow&&e._hhShell>0))return false; const now=this.elapsed||0; if(now-(e._hhShT??-9)<.12)return true; e._hhShT=now; e._hhShell--; this.vfxHitRing?.(e.x,e.y,0x9fe4ff,false); if(!e._hhShell){ this.floatText?.(e.x,e.y-50,'🛡️ Shell broken!',0x9fe4ff); this.a12?.('a16_bottle_shatter',.3,.3); } return true; }
  hhMutDeath(e,k,S){ const x=e.x,y=e.y,si=this.stageIndex||0;
    if(k==='bloat'){ const g=this.camWorld(this.add.graphics().setDepth(y+4)); let t=0; const ev=this.time.addEvent({delay:40,loop:true,callback:()=>{ t+=40; const w=Math.min(1,t/HH_BLOAT_T); g.clear(); g.fillStyle(0xff3b3b,.12+.2*w).fillCircle(x,y,HH_BLOAT_R*(.6+.4*w)); g.lineStyle(3,0xff5a5a,.8).strokeCircle(x,y,HH_BLOAT_R);
        if(t>=HH_BLOAT_T){ ev.remove(); g.destroy(); this.vfxHitRing?.(x,y,0xff5a5a,true); this.cameras?.main?.shake?.(80,.006); const p=this.player; if(p&&this.state==='play'&&this.dist(p.x,p.y,x,y)<HH_BLOAT_R)this.hurtPlayer?.(Math.round(8+si*1.5)); } }}); this.floatText?.(x,y-40,'💥 Get away!',0xff5a5a); }
    else if(k==='split'){ for(const o of [-1,1]){ const c=this.sigSpawnAt(x+o*26,y+6,false,'basic'); if(c){ c._hhKid=true; c.setScale?.((c.scaleX||1)*.75); if(c.maxhp){ c.maxhp=Math.max(1,Math.round(c.maxhp*.45)); c.hp=c.maxhp; } else if(c.hp)c.hp=Math.max(1,Math.round(c.hp*.45)); c.setTint?.(0xb9a3ff); c.tintColor=0xb9a3ff; } } this.floatText?.(x,y-40,'👯 Split!',0xffd166); } }
  hhBeamGuide(g,H,e,w,t){
    if(!g?.lineBetween)return;
    const reduced=!!Save.data?.settings?.reducedMotion;
    const dx=e.x-H.x,dy=e.y-H.y;
    const size=Math.max(16,Math.min(36,(e.displayWidth||42)*.5));
    g.lineStyle?.(2.4,0xe2c2ff,.55+.35*w);
    for(const side of [-1,1]){
      const x=e.x+side*size;
      g.lineBetween(x,e.y-9,x,e.y+6);
      g.lineBetween(x,e.y+6,x-side*7,e.y+6);
    }
    if(reduced)return;
    for(let i=0;i<3;i++){
      const end=.15+.82*((w*1.4+i/3)%1),start=Math.max(.04,end-.09);
      g.lineStyle?.(i===1?3:2,0xd7f7ff,.52+.23*Math.sin(t*8+i));
      g.lineBetween(H.x+dx*start,H.y+dy*start,H.x+dx*end,H.y+dy*end);
    }
  }
  hhEmpoweredMark(g,e){
    if(!g?.lineBetween)return;
    const x=e.x,y=e.y+Math.min(26,(e.displayHeight||40)*.42);
    const half=Math.max(10,Math.min(21,(e.displayWidth||40)*.30));
    g.lineStyle?.(2,0xd3a4ff,.8);
    g.lineBetween(x-half,y,x,y+6);
    g.lineBetween(x,y+6,x+half,y);
    g.lineStyle?.(1.5,0xeec9ff,.75);
    g.lineBetween(x-half*.6,y+5,x,y+9);
    g.lineBetween(x,y+9,x+half*.6,y+5);
  }
  hhTick(dt,o,S){ const p=this.player,H=S.h,g=S.fx; if(!p||!H)return; S.t=(S.t||0)+dt; o.progress=Math.min(o.target,S.t);
    S.ang+=dt*.35; const tx=p.x+Math.cos(S.ang)*HH_ORBIT,ty=p.y+Math.sin(S.ang)*HH_ORBIT*.7,d=Math.hypot(tx-H.x,ty-H.y),mv=d>900?d-600:Math.min(d,(d>600?600:150)*dt); if(d>0){ H.x+=(tx-H.x)/d*mv; H.y+=(ty-H.y)/d*mv; } H.t?.setPosition?.(H.x,H.y+(this.artIsSpr(H.t)?0:-10));   // ลอยวนรอบผู้เล่นในจอเสมอ
    const near=[]; this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&!e.isBoss&&!e._hhPow&&!e._hhMin&&this.dist(e.x,e.y,H.x,H.y)<HH_BEAM_R)near.push(e); });
    S.beamCd-=dt; if(S.beamCd<=0&&!S.beam&&near.length){ S.beamCd=S.full?HH_BEAM_CD[1]:HH_BEAM_CD[0]; const e=near[Math.floor(Math.random()*near.length)]; S.beam={e,t:.55}; this.tweens?.add?.({targets:H.t,scale:{from:(H.t?.scaleX||1)*1.12,to:H.t?.scaleX||1},duration:260}); this.a12?.('a16_herald_beam',.35,1.2)||this.a12?.('lg_breach_open',.18,1.5); }
    g?.clear?.(); if(!S.beamSpr&&this.realTex?.('hh85_beam')){ S.beamSpr=this.artSpr('hh85_beam',H.x,H.y,512,0,{depth:90024}); S.beamSpr?.setBlendMode?.(Phaser.BlendModes.ADD); S.beamSpr?.setVisible?.(false); }   /* v8.2.23 ใบ 85 ลำแสง (ไม่มีภาพ = เส้นวาดแบบเดิม) */
    if(S.beamSpr&&!(S.beam&&S.beam.e&&S.beam.e.active))S.beamSpr.setVisible?.(false);
    if(S.beam){ const B=S.beam,e=B.e; B.t-=dt; if(!e||!e.active){ S.beam=null; } else { const w=Math.min(1,Math.max(0,1-B.t/.55)); if(S.beamSpr){ const dx=e.x-H.x,dy=e.y-H.y; S.beamSpr.setVisible?.(true); S.beamSpr.setPosition?.((H.x+e.x)/2,(H.y+e.y)/2); S.beamSpr.setRotation?.(Math.atan2(dy,dx)); S.beamSpr.setDisplaySize?.(Math.max(40,Math.hypot(dx,dy)),8+13*w); } else { g?.lineStyle?.(5+5*w,0x7ad7ff,.35+.3*w); g?.lineBetween?.(H.x,H.y,e.x,e.y); g?.lineStyle?.(4,0xb36bff,.9); g?.lineBetween?.(H.x,H.y,e.x,e.y); } this.hhBeamGuide?.(g,H,e,w,S.t);
      if(B.t<=0){ this.hhEmpower(S,e); S.beamSpr?.setVisible?.(false); S.beam=null; } } }   // ลำแสงสีฟ้า-ม่วงเส้นเดียว
    let pw=0; const AU=this.realTex?.('hh85_empower_aura'); S.auras=(S.auras||[]).filter(a=>{ if(a.e&&a.e.active&&a.e._hhPow)return true; a.s?.destroy?.(); if(a.e)a.e._hhAu=null; return false; });
    this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&e._hhPow){ pw++; if(AU&&!e._hhAu&&S.auras.length<12){ const sp=this.artSpr('hh85_empower_aura',e.x,e.y,84*(e.scaleX||1),0,{depth:e.y-1}); if(sp){ sp.setBlendMode?.(Phaser.BlendModes.ADD); e._hhAu=sp; S.auras.push({e,s:sp}); } } if(e._hhAu){ e._hhAu.setPosition?.(e.x,e.y); e._hhAu.setDepth?.(e.y-1); e._hhAu.setAlpha?.(.63); } else { g?.lineStyle?.(2,0xb36bff,.55); g?.strokeCircle?.(e.x,e.y,29*(e.scaleX||1)); } this.hhEmpoweredMark?.(g,e); } });   /* v8.2.23 ใบ 85 ออร่าม่วง (สูงสุด 12) */
    this.hhMutTick?.(dt,S,g);
    for(const G of S.gates){ G.cd-=dt;
      const charge=Math.max(0,1-G.cd/.38);
      G.ring?.setStrokeStyle?.(2+1.5*charge,HH_GATE_LOOK[G.kind].c,.52+.43*charge);
      if(!this.artIsSpr(G.t))G.t.setRotation?.((S.t*2)%TAU); if(G.cd<=0){ G.cd=S.full?2.6:3.4; this.a12?.('lg_breach_open',.22,2); this.hhPack(S,G,1); } }   // ประตูเปิดค้างจนจบภารกิจ
    S.minions=S.minions.filter(m=>m&&m.active&&m._hhMin); S.mCd-=dt; if(S.mCd<=0&&S.minions.length<HH_MIN_MAX&&S.gates.length){ S.mCd=S.full?5:7; const G=S.gates[Math.floor(Math.random()*S.gates.length)],k=HH_MINIONS[Math.floor(Math.random()*HH_MINIONS.length)],L=HH_MIN_LOOK[k]; this._emergeKind='portal'; let m; try{ m=this.sigSpawnAt(G.x+(Math.random()-.5)*50,G.y+(Math.random()-.5)*50,false,L.type); }finally{ this._emergeKind=null; } if(m){ m._hhMin=k; m._hhT=0; m.setTint?.(L.c); m.tintColor=L.c; if(k==='possess')m.setAlpha?.(.75); this.artFollow?.(m,HH87_ART[k],64); S.minions.push(m); this.floatText?.(m.x,m.y-50,L.em+' '+L.name,L.c); } }
    S.icons=(S.icons||[]).filter(q=>{ if(q.m&&q.m.active&&q.m._hhMin){ q.s.setPosition?.(q.m.x,q.m.y-46); q.s.setDepth?.(q.m.y+20); return true; } q.s?.destroy?.(); if(q.m)q.m._hhIc=null; return false; });
    for(const m of S.minions){ const L=HH_MIN_LOOK[m._hhMin]; m._hhT+=dt; if(!m._hhIc&&this.realTex?.('hh85_minion_icons')){ const sp=this.artSpr('hh85_minion_icons',m.x,m.y-46,26,Math.max(0,HH_MINIONS.indexOf(m._hhMin))); if(sp){ m._hhIc=sp; S.icons.push({m,s:sp}); } } if(!m._hhIc){ g?.fillStyle?.(L.c,.95); g?.fillCircle?.(m.x,m.y-40,7); }   /* v8.2.23 ใบ 85 ไอคอนลูกน้อง */
      if(m._hhMin==='heal'&&m._hhT>=1){ m._hhT=0; let n=0; this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&e!==m&&!e.isBoss&&e.maxhp&&this.dist(e.x,e.y,m.x,m.y)<HH_HEAL_R&&e.hp<e.maxhp){ e.hp=Math.min(e.maxhp,e.hp+e.maxhp*HH_HEAL); n++; } }); if(n){ if(!this.artFx?.('hh87_heal_pulse',m.x,m.y,HH_HEAL_R*2)){ g?.lineStyle?.(3,0x6dffb4,.8); g?.strokeCircle?.(m.x,m.y,HH_HEAL_R); } this.a12?.('a16_heal_pulse',.28,1.2); } }
      else if(m._hhMin==='buff'&&m._hhT>=HH_BUFF_CD){ m._hhT=0; let best=null,bd=1e9; this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&e!==m&&!e._hhPow&&!e._hhMin&&!e.isBoss){ const dd=this.dist(e.x,e.y,m.x,m.y); if(dd<HH_HEAL_R&&dd<bd){ bd=dd; best=e; } } }); if(best&&this.hhEmpower(S,best))this.floatText?.(best.x,best.y-50,'🎺 Pumped up!',0xffd166); }
      else if(m._hhMin==='possess'){ if(!m._hhTo||!m._hhTo.active||m._hhTo._hhPow){ let best=null,bd=1e9; this.enemies?.children?.iterate?.(e=>{ if(e&&e.active&&e!==m&&!e._hhPow&&!e._hhMin&&!e.isBoss){ const dd=this.dist(e.x,e.y,m.x,m.y); if(dd<bd){ bd=dd; best=e; } } }); m._hhTo=best; }
        if(m._hhTo){ m._goTo={x:m._hhTo.x,y:m._hhTo.y}; if(this.dist(m.x,m.y,m._hhTo.x,m._hhTo.y)<40){ const t=m._hhTo; m._hhMin=null; m._goTo=null; m._hhTo=null; if(m._aura){ m._aura.destroy(); m._aura=null; } this.stopEnemyPresentation?.(m); m.setActive?.(false); m.setVisible?.(false); if(m.body)m.body.enable=false; this.vfxSpawnPoof?.(m.x,m.y); if(this.hhEmpower(S,t))this.floatText?.(t.x,t.y-50,'👻 Possessed!',0xe8e8ff); } } } }
    if(this.waveObjTxt?.active&&!this._waveTimed)this.waveObjTxt.setText('📯 Herald · '+Math.ceil(Math.max(0,o.target-S.t))+'s · 💜 '+S.powKills);
    if(S.t>=o.target)this.hhFinish(o,S); }   /* v8.2.23 จบเมื่อครบเวลาของตัวเองเสมอ (เวฟจับเวลาตั้ง target = เวลาเวฟ−1 อยู่แล้ว) · เดิมรอเวลาเวฟที่บางทางเข้าไม่มี → ค้าง */
  hhFinish(o,S){ if(o.done||S.fin)return; S.fin=true; for(const q of S.mi||[]){ q.t?.destroy?.(); if(q.e){ q.e._hhMi=null; q.e._hhMut=null; q.e._hhShell=0; } } S.mi=[]; this.a12?.('lg_gates_shut',.5,.5); S.fx?.clear?.(); for(const m of S.minions||[])if(m){ m._hhMin=null; m._goTo=null; m._hhTo=null; }
    for(const G of S.gates){ [G.t,G.ring,G.sh,G.gl,G.lb].forEach(q=>q?.setVisible?.(false)); this.vfxHitRing?.(G.x,G.y,0xd9a6ff,true); this.artFx?.('vfx78_gates_shut',G.x,G.y,160); } S.gates=[]; S.h?.t?.setVisible?.(false); const H=S.h||this.player;
    const si=this.stageIndex||0,su=Math.round((10+si*1.8)*(S.full?1.4:1)+(S.powKills+(S.mutKills||0))*(2+si*.4)),L0=this._lootAt; this.sugarStage+=su; this.sugarRun+=su; this.floatText?.(H.x,H.y-70,'📯 The Herald retreats · 💜 '+S.powKills+' empowered beaten',0xe3c4ff); this._lootAt={x:this.player?.x??H.x,y:this.player?.y??H.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; }   // ล้มตัวที่ถูกบัฟได้มาก = รางวัลมาก
    if(S.powKills>=HH_GEAR_AT){ this._lootMinRare=true; try{ const g=this.spawnLoot?.((this.player?.x||0)+50,(this.player?.y||0)-30,(si>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }finally{ this._lootMinRare=false; } }
    o.progress=o.target; if(!o.done)this.completeWaveObjective(); }
  hhPack(S,G,mul){ const f=S.full,list=G.kind==='brute'?(f?['tank','tank','basic']:['tank','basic']):G.kind==='archer'?(f?['shooter','shooter','shooter','shooter']:['shooter','shooter','shooter']):(f?['fast','fast','fast','fast','fast']:['fast','fast','fast','fast']);   // v8.2.17 ประตูแต่ละแบบปล่อยมอนต่างกัน
    this._emergeKind='portal'; try{ for(let r=0;r<(mul||1);r++)for(const ty of list){ const m=this.sigSpawnAt(G.x+(Math.random()-.5)*70,G.y+(Math.random()-.5)*70,false,ty); if(m)m._xpMul=.25; } }finally{ this._emergeKind=null; } this.vfxHitRing?.(G.x,G.y,HH_GATE_LOOK[G.kind]?.c||0xb36bff,false); }
  /* ===== v8.1.83 Grandma’s Pot (League → Ritual แนว ก. · หม้อของคุณยาย + การ์ดสูตร · C1-3 ห้องเครื่องพริก)
     มอนดรอปวัตถุดิบ (🍓🍋🍫 · ⭐ ทองจาก Elite ในแบบเต็ม) · เดินเก็บ = ถือไว้ · เดินเข้าวงหม้อ = ใส่ที่สูตรต้องการ · วัตถุดิบเสียตามเวลา · ครบสูตร = จานรางวัล (สูตรมี ⭐ = ดีกว่า) ===== */
  /* v8.1.106 เจ้าของ: Grandma's Pot เดิม (เก็บผลไม้ส่งหม้อ) จืด → ทำแบบ Ritual ของ PoE ต่างแค่การดรอปรางวัล
     เดินเข้าวงหม้อ = เริ่มพิธี · นอกวงมืด (สปอตไลต์) · มอนหิวไหลเข้ามาเป็นคอร์ส (เบา 2 · เต็ม 3 + Elite คอร์สสุดท้าย) · ภัยพริกตกเป็นจุดเตือน
     ฆ่าในวง = รส 🍲 เข้าหม้อ (นอกวงไม่นับ) · ครบทุกคอร์ส = หม้อระเบิดของ ยิ่งรสเต็มยิ่งได้มาก (≥80% = กล่องอุปกรณ์) */
  gpSetup(o,S){ const full=this.fpFull(),q=this.objectivePosition(0,1,160,260),R=210; { const d=(typeof Save!=='undefined'&&Save.data)||{}; if(!d.potStory){ d.potStory=1; (typeof Save!=='undefined'&&Save.save?.()); this.rubySay?.('That’s Grandma’s pot! She’s still frozen in the Sugar Prison, but her pot remembers her recipes. Feed it flavor!',5200,{face:'happy'}); } }
    Object.assign(S,{x:q.x,y:q.y,R,full,phase:'wait',round:0,rounds:full?3:2,foes:[],flavor:0,maxFlavor:0,spice:2,spices:[],rt:0}); o.target=S.rounds; o.progress=0;
    o.desc='Step into Grandma’s ring · beat the hungry mochi inside the light for '+S.rounds+' courses · then spend the flavor at Grandma’s table';
    S.pot=this.sigArt('gp_pot',0,q.x,q.y+40,110,'🍲',50,q.y-8); S.ring=this.sigAdd(this.add.circle(q.x,q.y,R,0xffb347,.08).setStrokeStyle(5,0xffd166,.85).setDepth(q.y-3));
    S.dark=this.sigAdd(this.add.circle(q.x,q.y,R+700,0x000000,0).setStrokeStyle(1400,0x0b0612,1).setAlpha(0).setDepth(90030));
    S.card=this.sigAdd(this.add.text(q.x,q.y-92,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#fff4dc',stroke:'#1a0f1e',strokeThickness:4,align:'center'}).setOrigin(.5).setDepth(q.y+6)); this.gpCard(S); }
  gpCard(S){ S.card?.setText(S.phase==='wait'?'🍲 Step in to begin':S.phase==='rest'?'✨ Next course…':S.phase==='table'?'🍽️ '+(S.tribute|0)+' 🍲 to spend':'Course '+S.round+'/'+S.rounds+'  ·  🍲 '+S.flavor); }
  gpDark(S,on){ if(!S.dark)return; this.tweens?.killTweensOf?.(S.dark); if(this.tweens?.add)this.tweens.add({targets:S.dark,alpha:on?.55:0,duration:on?500:400}); else S.dark.setAlpha?.(on?.55:0); }
  gpRound(o,S){ if(S.round===0)this.missionMusic?.('bgm_m_ritual'); S.round++; S.phase='ritual'; S.rt=0; S.foes=[]; const n=(S.full?7:5)+S.round*2,elite=S.full&&S.round===S.rounds;
    for(let i=0;i<n;i++){ const a=i/n*TAU+Math.random()*.3,e=this.sigSpawnAt(S.x+Math.cos(a)*(S.R+70),S.y+Math.sin(a)*(S.R+70),elite&&i===0); if(e){ e._gpFoe=true; e.setTint?.(0xffc078); e.tintColor=0xffc078; S.foes.push(e); } }
    S.maxFlavor+=n+(elite?3:0); this.gpDark(S,true); this.vfxHitRing?.(S.x,S.y,0xffd166,true); this.floatText?.(S.x,S.y-120,'🍲 Course '+S.round+'! Feed the pot',0xffe08a); if(typeof Sfx!=='undefined')(this.a12?.('lg_pot_ritual',.5,.5)||Sfx.bossWarn?.()); this.gpCard(S); }
  gpOnKill(e,o,S){ if(!e||!e._gpFoe||!S)return; e._gpFoe=false; if(this.sigNear(S.x,S.y,S.R+40)){ const v=e.isElite?4:1; S.flavor+=v; this.a12?.('lg_pot_flavor',.26,.12); this.floatText?.(e.x,e.y-40,'+'+v+' 🍲',0xffd166); } else this.floatText?.(e.x,e.y-40,'Too far from the pot!',0xffb0c8); this.gpCard(S); }
  gpTick(dt,o,S){ const p=this.player; if(!p||o.done)return;
    if(S.phase==='wait'){ if(this.sigNear(S.x,S.y,S.R))this.gpRound(o,S); return; }
    if(S.phase==='rest'){ S.rt-=dt; if(S.rt<=0)this.gpRound(o,S); return; }
    if(S.phase==='table'){ S.tt-=dt; let any=false; for(const P of S.plates||[]){ if(P.taken)continue; if(!P.done&&P.cost<=S.tribute)any=true; P.pad?.setStrokeStyle?.(4,P.done||P.cost<=S.tribute?0xffd166:0x6a5a70,.9); if(this.sigNear(P.x,P.y,44)){ P.pc+=dt; if(P.pc>=.5){ P.pc=0; if(P.done){ this.gpFinish(o,S); return; } this.gpBuy(S,P); } } else { P.pc=0; P.warn=0; } }
      if(S.tt<=0||!any||!this.sigNear(S.x,S.y,520))this.gpFinish(o,S); return; }
    S.rt+=dt;
    if(S.full||S.round>1){ S.spice-=dt; if(S.spice<=0){ S.spice=S.full?2.2:3.2; const x=p.x+(Math.random()-.5)*120,y=p.y+(Math.random()-.5)*120,w=this.sigAdd(this.add.circle(x,y,70,0xff5a3c,.18).setStrokeStyle(3,0xff8a5c,.9).setDepth(y-2)); S.spices.push({x,y,t:1.1,w}); } }   // ภัยพริกตก: จุดเตือน 1.1 วิ
    for(const q of S.spices){ q.t-=dt; if(q.t<=0&&!q.done){ q.done=true; q.w.setVisible?.(false); this.vfxHitRing?.(q.x,q.y,0xff7a4d,false); if(this.dist(p.x,p.y,q.x,q.y)<70)this.hurtPlayer?.(Math.round(6+(this.stageIndex||0)*2.5),.4); } }
    S.spices=S.spices.filter(q=>!q.done);
    S.foes=S.foes.filter(e=>e&&e.active&&e._gpFoe);
    if(!S.foes.length||S.rt>30){ for(const e of S.foes)e._gpFoe=false; S.foes=[]; o.progress=S.round; this.gpDark(S,false);
      if(S.round>=S.rounds){ this.gpTable(o,S); return; } S.phase='rest'; S.rt=2.5; this.floatText?.(S.x,S.y-120,'✨ Course cleared!',0xffe08a); }
    this.gpCard(S); }
  /* v8.1.115 เจ้าของ: Pot แบบ Ritual ของ PoE ตัวจริง (ไม่ใช่ Ultimatum ซ้ำกับ Trial) → จบคอร์สแล้วเป็น "โต๊ะอาหารของคุณยาย"
     จาน 4 ใบรอบหม้อ ราคาเป็นรส 🍲 ที่สะสมจากการฆ่าในวง · เดินไปยืนบนจาน = ซื้อ · ✔ Done = จบ · รสที่เหลือเก็บไว้ครึ่งหนึ่ง (สูงสุด 30) และจานแพงที่ซื้อไม่ไหว "ฝากคุณยาย" ไว้โผล่ครั้งหน้า (Defer)
     เนื้อเรื่อง: คุณยายแช่แข็งอยู่ในคุกน้ำตาล (C1-4) แต่หม้อยังจำสูตรของเธอได้ → ปลดหลังเจอคุณยาย (ผ่าน C1-4) */
  gpMenu(S){ const si=this.stageIndex||0,d=(typeof Save!=='undefined'&&Save.data)||{},full=!!S.full,M={
      sugar_s:{em:'🍬',name:'Sugar Bowl',cost:4,sugar:Math.round(8+si*1.5)},sugar_l:{em:'🍰',name:'Sugar Feast',cost:10,sugar:Math.round(25+si*4)},
      jam:{em:'🟢',name:'Twist Cream ×2',cost:9,cur:'transmute',n:2},ink:{em:'🖋️',name:'Recipe Ink',cost:12,cur:'recipeink',n:1},
      box_r:{em:'🎁',name:'Gear Box',cost:13,box:'rare'},box_e:{em:'💜',name:'Epic Box',cost:22,box:'epic'},stone:{em:'🪨',name:'Hunger Stone',cost:30,stone:1}};
    const pick=[]; if(d.potDeferred&&M[d.potDeferred])pick.push(d.potDeferred); if(!pick.includes('sugar_s'))pick.push('sugar_s');
    const pool=['sugar_l','jam','ink','box_r',...(full?['box_e']:[]),...(Math.random()<.2?['stone']:[])].filter(k=>!pick.includes(k));
    while(pick.length<4&&pool.length)pick.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); d.potDeferred=null; return pick.map(id=>Object.assign({id},M[id])); }
  gpTable(o,S){ const d=(typeof Save!=='undefined'&&Save.data)||{}; S.phase='table'; S.tribute=S.flavor+(d.potFlavor|0); d.potFlavor=0; S.tt=25; this.gpDark(S,false);
    this.screenFlash?.(0xffd166,.18,220); this.vfxHitRing?.(S.x,S.y,0xffd166,true); this.a12?.('lg_dish_served',.5,.5); this.artFx?.('vfx78_dish_served',S.x,S.y,220);
    const menu=this.gpMenu(S),n=menu.length; S.plates=[];
    menu.forEach((m,i)=>{ const a=-Math.PI/2+(i-(n-1)/2)*.62,x=S.x+Math.cos(a)*175,y=S.y+Math.sin(a)*175+40; S.plates.push(this.gpPlate(S,x,y,m)); });
    S.plates.push(this.gpPlate(S,S.x,S.y+190,{id:'done',em:'✔',name:'Done',cost:0,done:true}));
    this.showBanner?.('🍽️ Grandma’s Table','Spend '+S.tribute+' 🍲 flavor — stand on a dish to take it',1800);
    if(!d.potTableSeen){ d.potTableSeen=1; (typeof Save!=='undefined'&&Save.save?.()); this.rubySay?.('Grandma’s recipes still live in her pot! Spend the flavor on a dish. Too pricey? She’ll save it for next time.',5200,{face:'happy'}); }
    this.gpCard(S); }
  gpPlate(S,x,y,m){ const pad=this.sigAdd(this.add.circle(x,y,44,0x2a1a30,.85).setStrokeStyle(4,0xffd166,.9).setDepth(y-3)),
      em=this.sigAdd(this.add.text(x,y-6,m.em,{fontSize:'30px'}).setOrigin(.5).setDepth(y+2)),
      nm=this.sigAdd(this.add.text(x,y+30,m.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff4dc',stroke:'#1a0f1e',strokeThickness:3}).setOrigin(.5,0).setDepth(y+3)),
      pr=m.done?null:this.sigAdd(this.add.text(x,y-48,'🍲 '+m.cost,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffe08a',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5).setDepth(y+3));
    return Object.assign({x,y,pad,em,nm,pr,pc:0,taken:false},m); }
  gpBuy(S,P){ const si=this.stageIndex||0; if(P.taken)return; if(S.tribute<P.cost){ if(!P.warn){ P.warn=1; this.floatText?.(P.x,P.y-70,'Not enough flavor',0xffb0c8); } return; }
    S.tribute-=P.cost; P.taken=true; [P.pad,P.em,P.nm,P.pr].forEach(q=>q?.setVisible?.(false)); this.vfxHitRing?.(P.x,P.y,0xffd166,false); this.a12?.('lg_pot_flavor',.35,.1);
    if(P.sugar){ const L0=this._lootAt; this.sugarStage+=P.sugar; this.sugarRun+=P.sugar; this._lootAt={x:P.x,y:P.y}; try{ this.missionLootBurst?.({type:'tree',noCur:true,noHold:true},P.sugar); }finally{ this._lootAt=L0; } }
    if(P.cur){ if(typeof Save!=='undefined')Save.addCurrency?.(P.cur,P.n); const r=this._runCurrency||(this._runCurrency={}); r[P.cur]=(r[P.cur]||0)+P.n; }
    if(P.box){ (this._runBoxes||(this._runBoxes=[])).push(P.box); }
    if(P.stone&&typeof Save!=='undefined'){ Save.data.hungerStones=(Save.data.hungerStones|0)+1; (typeof Save!=='undefined'&&Save.save?.()); }
    this.floatText?.(P.x,P.y-70,P.em+' '+P.name,0xffe08a); this.gpCard(S); }
  gpFinish(o,S){ if(o.done)return; const d=(typeof Save!=='undefined'&&Save.data)||{},left=S.tribute|0,want=(S.plates||[]).filter(P=>!P.taken&&!P.done&&P.cost>left).sort((a,b)=>b.cost-a.cost)[0];
    d.potFlavor=Math.min(30,Math.floor(left/2)); if(want)d.potDeferred=want.id; (typeof Save!=='undefined'&&Save.save?.());
    for(const P of S.plates||[])[P.pad,P.em,P.nm,P.pr].forEach(q=>q?.setVisible?.(false));
    if(d.potFlavor||want)this.floatText?.(S.x,S.y-120,'👵 Grandma saves'+(d.potFlavor?' '+d.potFlavor+' 🍲':'')+(want?(d.potFlavor?' and ':' ')+want.em+' '+want.name:'')+' for next time',0xffe08a);
    this.completeWaveObjective(); }
  gpServe(o,S){ if(o.done)return; const si=this.stageIndex||0,ratio=Math.min(1,S.flavor/Math.max(1,S.maxFlavor)),su=Math.round((9+si*1.6)*(S.full?1.4:1)*(.6+.8*ratio)),L0=this._lootAt; this.sugarStage+=su; this.sugarRun+=su; this.gpDark(S,false);
    this.screenFlash?.(0xffd166,.2,220); this.vfxHitRing?.(S.x,S.y,0xffd166,true); this.a12?.('lg_dish_served',.5,.5); this.artFx?.('vfx78_dish_served',S.x,S.y,220); this.floatText?.(S.x,S.y-110,(ratio>=.8?'🌟 Grandma’s feast!':'🍲 Dish served!')+'  '+S.flavor+'/'+S.maxFlavor,0xffe08a);
    this._lootAt={x:S.x,y:S.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true,bonus:{ok:ratio>=.8}},su); }finally{ this._lootAt=L0; } this.completeWaveObjective(); }
  /* ===== v8.1.85 Grandma’s Golem (League → Metamorph · ตำราคุณยายมีสูตรอบโกเลมขนมจากชิ้นรส · C1-5 เตาอบมงกุฎ)
     Elite "ผู้ถือรส" ถือชิ้นส่วนคนละชิ้น (หัว แขน ขา หาง ใจ) · ฆ่า = ชิ้นตก เดินเก็บ · ยืนที่เตา 2s (มีอย่างน้อย min ชิ้น) = อบโกเลม
     ทุกชิ้นให้สกิล (หัว ยิงแยม · แขน ทุบพื้น · ขา วิ่งเร็ว · หาง เรียกลูกน้อง · ใจ ฟื้นเลือด) · ยิ่งใส่ชิ้นมาก โกเลมยิ่งแกร่ง รางวัลยิ่งมาก (เลือกอบเร็วได้)
     แบบเบา: 3 ชิ้น (อบได้ตั้งแต่ 2) · แบบเต็ม: 5 ชิ้น (อบได้ตั้งแต่ 3) + โกเลมเลือดหนากว่า ===== */
  ggSetup(o,S){ const full=this.fpFull(),q=this.objectivePosition(0,1,160,240),n=full?5:3,pool=GOLEM_PARTS.slice(); if(!full){ for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; } }
    Object.assign(S,{x:q.x,y:q.y,full,min:full?3:2,want:pool.slice(0,n),parts:[],drops:[],carriers:[],golem:null,phase:'collect',bake:0,respawn:0}); o.target=n;
    o.desc='Beat the flavor carriers for golem parts · bake at the oven (min '+S.min+') · more parts = tougher golem, bigger reward';
    S.oven=this.sigArt('gg_oven',0,q.x,q.y+40,110,'🔥',50,q.y-10); S.ring=this.sigAdd(this.add.circle(q.x,q.y,100,0xff9b4d,.1).setStrokeStyle(4,0xffb46b,.8).setDepth(q.y-3));
    S.list=this.sigAdd(this.add.text(q.x,q.y-72,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5).setDepth(q.y+6));
    for(const p of S.want)S.carriers.push({p,e:null,cd:.5+S.carriers.length*.9,label:null,gold:Math.random()<GG_GOLD}); S.gold=[]; this.ggList(S); }   /* v8.2.17+1 ชิ้นทอง ✨ (หายาก) = ท่าแรงขึ้น + รางวัลดีขึ้น · ตัวถือชิ้นมีลูกน้องคุ้มกัน */
  ggList(S){ S.list?.setText(S.want.map(p=>S.parts.includes(p.k)?((S.gold||[]).includes(p.k)?'✨':'')+p.em:'▫️').join(' ')); }
  ggCarrier(S,c){ const p=this.player,a=Math.random()*TAU,e=this.sigSpawnAt(p.x+Math.cos(a)*420,p.y+Math.sin(a)*420,true); if(!e){ c.cd=1; return; } e._ggPart=c.p.k; e._ggGold=!!c.gold; c.e=e; const tc=c.gold?0xffd700:0xffd59a; e.setTint?.(tc); e.tintColor=tc; if(c.gold&&e.maxhp){ e.maxhp*=1.6; e.hp=e.maxhp; e.setScale?.((e.scaleX||1)*1.15); } c.label=this.sigArt('gg_parts',GOLEM_PARTS.indexOf(c.p),e.x,e.y-60,30,(c.gold?'✨':'')+c.p.em,26);
    for(let i=0;i<GG_ESCORT;i++)this.sigSpawnAt(e.x+(Math.random()-.5)*110,e.y+(Math.random()-.5)*110,false,'basic');   // ลูกน้องคุ้มกันตัวถือชิ้น
    if(c.gold){ this.floatText?.(e.x,e.y-90,'✨ Golden part carrier!',0xffd700); c.glint=this.realTex?.('gg87_gold_glint')?this.artSpr('gg87_gold_glint',e.x,e.y,70,0,{depth:e.y+5}):null; c.glint?.setBlendMode?.(Phaser.BlendModes.ADD); } }
  ggDropPart(S,e,k){ const c=S.carriers.find(c=>c.p.k===k),gold=!!(c&&c.gold); c?.glint?.setVisible?.(false); if(c){ c.e=null; c.label?.setVisible?.(false); c.done=true; } const p=GOLEM_PARTS.find(x=>x.k===k); if(!p)return; const t=this.sigArt('gg_parts',GOLEM_PARTS.indexOf(p),e.x,e.y,36,p.em,32); if(gold)t?.setTint?.(0xffd700); const gl=gold&&this.realTex?.('gg87_gold_glint')?this.artSpr('gg87_gold_glint',e.x,e.y,56,0,{depth:e.y+5}):null; gl?.setBlendMode?.(Phaser.BlendModes.ADD); S.drops.push({x:e.x,y:e.y,k,gold,t,gl}); this.floatText?.(e.x,e.y-60,(gold?'✨ Golden ':'')+p.em+' '+p.name+' dropped',gold?0xffd700:0xffd59a); }
  ggTick(dt,o,S){ const p=this.player,g=this.objNodeG; if(!p)return; S.t=(S.t||0)+dt;
    if(S.phase==='collect'){
      for(const c of S.carriers){ if(c.done||S.parts.includes(c.p.k))continue; if(c.e&&(!c.e.active||c.e._ggPart!==c.p.k)){ c.e=null; c.label?.setVisible?.(false); c.cd=2; } if(!c.e){ c.cd-=dt; if(c.cd<=0)this.ggCarrier(S,c); } else { c.label?.setPosition?.(c.e.x,c.e.y-60); c.glint?.setPosition?.(c.e.x,c.e.y-10); } }
      for(const d of S.drops){ if(this.dist(p.x,p.y,d.x,d.y)<60){ d.got=true; d.t.setVisible?.(false); d.gl?.setVisible?.(false); S.parts.push(d.k); if(d.gold)(S.gold||(S.gold=[])).push(d.k); this.a12?.('lg_golem_part',.35,.15); const P=GOLEM_PARTS.find(x=>x.k===d.k); this.floatText?.(p.x,p.y-80,P.em+' '+P.name+' · '+P.skill,0xffe08a); this.ggList(S); } }
      S.drops=S.drops.filter(d=>!d.got); o.progress=S.parts.length;
      if(S.parts.length>=S.want.length&&!S.told){ S.told=true; this.showBanner?.('🔥 All parts found!','Bake the golem at the oven',1300); }
      const near=S.parts.length>=S.min&&this.sigNear(S.x,S.y,100); S.bake=Math.max(0,Math.min(2,S.bake+(near?dt:-dt))); S.ring.setFillStyle(0xff9b4d,near?.24:.1);
      g?.clear(); if(S.bake>0){ g?.lineStyle(7,0xffffff,.95); g?.beginPath(); g?.arc(S.x,S.y,90,-Math.PI/2,-Math.PI/2+TAU*S.bake/2,false); g?.strokePath(); }
      if(S.bake>=2)this.ggBake(o,S); return; }
    if(S.phase==='fight'){ const e=S.golem; if(!e||!e.active||!e._golem){ S.respawn-=dt; if(S.respawn<=0)this.ggSpawnGolem(o,S); return; } const has=k=>S.parts.includes(k),si=this.stageIndex||0,dm=Math.round(8+si*1.6);
      S.cd=S.cd||{}; const tick=(k,sec,fn)=>{ if(!has(k))return; if((S.gold||[]).includes(k))sec*=.7; S.cd[k]=(S.cd[k]??sec*.6)-dt; if(S.cd[k]<=0){ S.cd[k]=sec; this.artFollowAct?.(e); fn(); } };
      tick('head',3.6,()=>{ for(let i=0;i<8;i++)this.foeShot?.(e.x,e.y,i*TAU/8+S.t,200,dm,0xff6f9c,.9); });
      tick('arms',5,()=>{ this.a12?.('lg_golem_slam',.45,.3); this.spawnHazard?.(p.x,p.y,90,Math.round(dm*1.4),0xffb46b); });
      tick('tail',7,()=>{ for(let i=0;i<2;i++)this.sigSpawnAt(e.x+(Math.random()-.5)*120,e.y+(Math.random()-.5)*120); });
      if(has('heart')&&e.maxhp)e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.008*dt);
      if(has('legs')&&!S.legsT){ S.legsT=1; if(e.speed)e.speed*=1.4; if(e.baseSpeed)e.baseSpeed*=1.4; } } }
  ggBake(o,S){ S.phase='fight'; for(const c of S.carriers){ c.label?.setVisible?.(false); if(c.e&&c.e.active&&c.e._ggPart){ c.e._ggPart=null; c.e.clearTint?.(); } } for(const d of S.drops)d.t.setVisible?.(false); S.drops=[];
    this.objNodeG?.clear(); S.ring.setVisible(false); this.screenFlash?.(0xffb46b,.25,240); this.vfxHitRing?.(S.x,S.y,0xffb46b,true); this.a12?.('lg_golem_bake',.5,.5); this.artFx?.('vfx78_golem_bake',S.x,S.y,240); this.ggSpawnGolem(o,S);
    o.desc='Beat Grandma’s Golem · '+S.parts.length+' parts: '+S.parts.map(k=>GOLEM_PARTS.find(x=>x.k===k).em).join(''); }
  ggSpawnGolem(o,S){ const e=this.sigSpawnAt(S.x,S.y,true); if(!e){ S.respawn=1; return; } e._golem=true; S.golem=e; S.legsT=0; const n=S.parts.length; this.artFollow?.(e,'gg_golem',150+n*10); if(e.setScale)e.setScale((e.baseScale||e.scaleX||1)*(1.5+n*.1)); if(e.maxhp){ e.maxhp*=(S.full?3:2)+n*.8+(S.gold||[]).length*.4; e.hp=e.maxhp; } const gc=(S.gold||[]).length?0xffd77a:0xffc38a; e.setTint?.(gc); e.tintColor=gc;
    this.showBanner?.('🗿 Grandma’s Golem','Baked with '+n+' part'+(n>1?'s':'')+': '+S.parts.map(k=>GOLEM_PARTS.find(x=>x.k===k).skill).join(' · '),1800); }
  ggDown(e,o,S){ this.a12?.('lg_golem_crumble',.5,.5); const si=this.stageIndex||0,n=S.parts.length,su=Math.round((8+si*2)*(1+n*.35)*(S.full?1.4:1)),L0=this._lootAt; o.progress=o.target; this.sugarStage+=su; this.sugarRun+=su; this.screenFlash?.(0xffe08a,.25,240);
    this.floatText?.(e.x,e.y-80,'🗿 The golem crumbles into treats!',0xffe08a); this._lootAt={x:e.x,y:e.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; } this.ggGoldLoot(S,e); this.completeWaveObjective(); }
  ggGoldLoot(S,e){ const G=(S.gold||[]).length; if(!G)return; for(let i=0;i<G;i++){ const g=this.spawnCurrencyDrop?.(e.x+(i-(G-1)/2)*36,e.y-10,'recipeink'); if(g&&typeof g==='object'){ g.forgeQuantity=1; this.lootHold?.(g,1900); } }   // v8.2.18 ชิ้นทองละ 1 Recipe Ink · ทอง ≥2 = กล่อง Gear
    if(G>=2){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(e.x+50,e.y-30,(this.stageIndex>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }finally{ this._lootMinRare=false; } } this.floatText?.(e.x,e.y-110,'✨ Golden parts bonus ×'+G,0xffd700); }
  /* ===== v8.1.86 Siege of the Hunger (League → Legion แบบ 5 Way · ห้องพิเศษใน Delve ตั้งแต่ชั้น 3)
     วงให้ยืน (คงที่) · ประตู 5 ทิศปล่อยมอนเป็นระลอก (ยิ่งนานยิ่งหลายประตู) · ฆ่าขณะยืนในวง = เติมกอง · ออกนอกวง = เวลาหยุด + กองรั่ว 1/s
     สุ่ม 45% Hunger Warlord ช่วงกลาง (+15 กอง) · ครบเวลา = กองระเบิดเป็นรางวัล (คูณตามความลึก) ===== */
  hsSetup(o,S){ this.missionMusic?.('bgm_m_siege'); const q=this.objectivePosition(0,1,120,200),d=(this._amapNode&&this._amapNode.d)||Math.max(3,this.stageIndex||0); Object.assign(S,{x:q.x,y:q.y,R:230,d,pot:0,wave:1.5,gates:[],warlord:Math.random()<.45?22:-1,leak:0,sapCd:HS_SAPPER_CD,saps:[],sup:0,crate:null});   /* v8.2.19 Sapper 💣 วิ่งมาระเบิดกองในวง (ฆ่าก่อน = +2) · ลังเสบียง 📦 ตกในวงที่ 15/30 วิ (ฮีล 25% + กอง +5) */
    o.target=45; o.desc='Hold the circle for 45s · five gates pour monsters in · kills inside fill the pot · leaving the circle drains it';
    S.ring=this.sigAdd(this.add.circle(q.x,q.y,S.R,0xffd166,.08).setStrokeStyle(6,0xffd166,.85).setDepth(q.y-3)); if(this.artSpr('hs_circle',q.x,q.y,S.R*2.06,0,{depth:q.y-2}))S.ring.setStrokeStyle(0); S.potT=this.sigAdd(this.add.text(q.x,q.y,'🍬 0',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff4dc',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5).setDepth(q.y+6));
    const a0=Math.random()*TAU,lim=WORLD/2-140; for(let i=0;i<5;i++){ const a=a0+i*TAU/5,x=Phaser.Math.Clamp(q.x+Math.cos(a)*(S.R+300),-lim,lim),y=Phaser.Math.Clamp(q.y+Math.sin(a)*(S.R+300),-lim,lim); S.gates.push({x,y,t:this.sigArt('hh_gate',0,x,y,120,'🌀',40,y-8)}); }
    this.showBanner?.('🏰 Siege of the Hunger','Hold the circle — five gates are opening!',1500); }
  hsTick(dt,o,S){ const g=this.objNodeG,inside=this.sigNear(S.x,S.y,S.R); S.t=(S.t||0)+dt; S.ring.setFillStyle(0xffd166,inside?.16:.06);
    if(inside)o.progress=Math.min(o.target,o.progress+dt); else { S.leak+=dt; if(S.leak>=1){ S.leak=0; if(S.pot>0){ S.pot--; S.potT?.setText('🍬 '+S.pot); this.floatText?.(S.x,S.y-40,'-1 · get back in!',0xff9b9b); } } }
    S.wave-=dt; if(S.wave<=0){ const k=o.progress<15?2:o.progress<30?3:5,per=2+Math.floor(S.d/8); S.wave=2.4; const order=S.gates.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,k); this.a12?.('lg_siege_gate',.22,1.2); for(const i of order){ const G=S.gates[i]; for(let n=0;n<per;n++)this.sigSpawnAt(G.x+(Math.random()-.5)*60,G.y+(Math.random()-.5)*60); this.vfxHitRing?.(G.x,G.y,0xb36bff,false); } }
    if(S.warlord>0&&o.progress>=S.warlord){ S.warlord=-1; const G=S.gates[Math.floor(Math.random()*5)],e=this.sigSpawnAt(G.x,G.y,true); if(e){ e._hsWarlord=true; if(e.setScale)e.setScale((e.baseScale||e.scaleX||1)*1.6); this.artFollow?.(e,'hs_warlord',160); if(e.maxhp){ e.maxhp*=4; e.hp=e.maxhp; } e.setTint?.(0xff9b6a); this.showBanner?.('👑 Hunger Warlord','A warlord storms the gate — beat it for a huge pot bonus',1400); } }
    for(const G of S.gates)if(!this.artIsSpr(G.t))G.t.setRotation?.((S.t*2)%TAU);
    this.hsExtrasTick(dt,o,S);
    g?.clear(); const f=o.progress/o.target; g?.fillStyle(0x190b24,.8).fillRoundedRect(S.x-60,S.y-S.R-24,120,8,4).fillStyle(0xffd166,.95).fillRoundedRect(S.x-58,S.y-S.R-22,116*f,4,2);
    if(o.progress>=o.target)this.hsBurst(o,S); }
  hsExtrasTick(dt,o,S){ const p=this.player; S.saps=(S.saps||[]).filter(e=>e&&e.active&&e._hsSapper);
    if(o.progress>=8){ S.sapCd-=dt; if(S.sapCd<=0){ S.sapCd=HS_SAPPER_CD; const G=S.gates[Math.floor(Math.random()*S.gates.length)],e=G&&this.sigSpawnAt(G.x,G.y,false,'fast'); if(e){ e._hsSapper=true; e._goTo={x:S.x,y:S.y}; e.setTint?.(0xff7a3a); e.tintColor=0xff7a3a; this.artFollow?.(e,'hs85_sapper',64); S.saps.push(e); this.floatText?.(G.x,G.y-60,'💣 A sapper runs for the pot!',0xff9b6a); } } }
    for(const e of S.saps){ if(this.dist(e.x,e.y,S.x,S.y)<60){ e._hsSapper=false; e._goTo=null; if(e._aura){ e._aura.destroy(); e._aura=null; } this.stopEnemyPresentation?.(e); e.setActive?.(false); e.setVisible?.(false); if(e.body)e.body.enable=false; this.vfxHitRing?.(S.x,S.y,0xff7a3a,true); this.screenShake?.(160,.008); S.pot=Math.max(0,S.pot-HS_SAPPER_COST); S.potT?.setText('🍬 '+S.pot); this.floatText?.(S.x,S.y-40,'💣 -'+HS_SAPPER_COST+' · the sapper blew the pot!',0xff9b6a); this.a12?.('a16_sapper_boom',.45,.3); } }
    if(S.sup<HS_SUPPLY.length&&o.progress>=HS_SUPPLY[S.sup]&&!S.crate){ S.sup++; const a=Math.random()*TAU,r=60+Math.random()*(S.R-90); S.crate={x:S.x+Math.cos(a)*r,y:S.y+Math.sin(a)*r}; S.crate.t=this.sigArt('hs85_supply_crate',0,S.crate.x,S.crate.y+30,70,'📦',32); if(this.artIsSpr(S.crate.t)){ const C=S.crate.t,ty=C.y; C.y=ty-260; this.tweens?.add?.({targets:C,y:ty,duration:700,ease:'Bounce.easeOut',onComplete:()=>C.setFrame?.(1)}); }   /* v8.2.23 ใบ 85 ลังห้อยร่มตกลงมา */ this.floatText?.(S.crate.x,S.crate.y-50,'📦 Supplies!',0xffe08a); }
    if(S.crate&&p&&this.dist(p.x,p.y,S.crate.x,S.crate.y)<55){ S.crate.t?.setVisible?.(false); S.crate=null; if(p.maxhp)p.hp=Math.min(p.maxhp,(p.hp||0)+p.maxhp*.25); S.pot+=5; S.potT?.setText('🍬 '+S.pot); this.floatText?.(p.x,p.y-70,'📦 +25% HP · +5 pot',0xffe08a); } }
  hsOnKill(e,o,S){ if(!e||e.isBoss)return; const w=e._hsWarlord; e._hsWarlord=false; if(e._hsSapper){ e._hsSapper=false; e._goTo=null; S.pot+=2; S.potT?.setText('🍬 '+S.pot); this.floatText?.(e.x,e.y-50,'💣 Sapper stopped · +2',0xffe08a); return; } if(!this.sigNear(S.x,S.y,S.R+20))return; S.pot+=w?15:e.isElite||e.isMini?3:1; S.potT?.setText('🍬 '+S.pot); }
  hsBurst(o,S){ if(o.done)return; const su=Math.max(10,Math.round(S.pot*(1+S.d*.05)*(.8+(this.stageIndex||0)*.15))); this.screenFlash?.(0xffd166,.25,240); this.screenShake?.(220,.01); this.vfxHitRing?.(S.x,S.y,0xffd166,true); this.a12?.('lg_siege_break',.55,.5); this.artFx?.('vfx78_siege_break',S.x,S.y,460);
    this.floatText?.(S.x,S.y-60,'🏰 The siege breaks!',0xffe08a); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:S.x,y:S.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; } for(const G of S.gates)G.t.setVisible?.(false); this.completeWaveObjective(); }
  /* ===== v8.1.92 Hunger's Domain (เจ้าของ: Hunger Stone = ห้องพิเศษ · แบบ Breachstone ของ PoE)
     ใช้ 🪨 1 ก้อนที่แผนที่ Delve (ปุ่ม Domain) → ทั้งถ้ำอยู่ในรอยแยก: 30s มอนรอยแยกหลั่งไหล (ฆ่า = ดรอป 🔮) → Breachlord โผล่กลางวง
     บอส: วงกระสุน 12 ทิศ 3.2s · ระเบิดใต้เท้า 4.5s · เรียกมือ (Elite) 9s · ตาย = รางวัลใหญ่ (Sugar + สกุลแถว 4 + 🔮 20 + ของ Legend) · ตายในห้อง = เสียหิน ===== */
  hdSetup(o,S){ this.missionMusic?.('bgm_m_domain'); this.a12?.('lg_domain_open',.55,.5); const p=this.player,d=(this._amapNode&&this._amapNode.d)||Math.max(5,this.stageIndex||0); Object.assign(S,{x:p.x,y:p.y,d,domain:true,phase:'flood',T:30,spawn:.4,lord:null,cd:{},sp:0}); o.target=1;
    o.desc='Survive the flood, then defeat the Breachlord'; S.ring=this.sigAdd(this.add.circle(p.x,p.y,1400,0x2a0a3d,.2).setStrokeStyle(10,0xb36bff,.9).setDepth(p.y-80));
    S.hud=this.sigAdd(this.add.text(0,0,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#f1dcff',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5).setDepth(99990));
    this.screenFlash?.(0x8a4fd8,.3,300); this.artFx?.('vfx78_breach_open',S.x,S.y,420); this.showBanner?.('🪨 Hunger’s Domain','The stone tears the cave open — survive the flood',1800); }
  hdTick(dt,o,S){ const p=this.player,g=this.objNodeG; if(!p)return; S.t=(S.t||0)+dt; const dm=Math.round(10+S.d*1.4);
    if(S.phase==='clearing'){ S.re=(S.re||0)-dt; if(S.re<=0)this.hdLord(o,S); return; }
    if(S.phase==='flood'){ S.T-=dt; S.spawn-=dt; if(S.spawn<=0){ S.spawn=.55; for(let k=0;k<3+Math.floor(S.d/10);k++){ const a=Math.random()*TAU,r=280+Math.random()*260,e=this.sigSpawnAt(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,Math.random()<.08); if(e){ e._breach=true; e.setTint?.(0xc59bff); this.breachFoeArt?.(e); } } }
      S.hud?.setText('🪨 Flood '+Math.ceil(S.T)+'s   🔮 '+S.sp).setPosition(p.x,p.y-84); if(S.T<=0)this.hdLord(o,S); return; }
    const e=S.lord; if(!e||!e.active||!e._hdLord){ S.re=(S.re||0)-dt; if(S.re<=0)this.hdLord(o,S); return; }
    const hpf=e.maxhp?e.hp/e.maxhp:1,ph=hpf>HD_PHASE[0]?1:hpf>HD_PHASE[1]?2:3; if(ph!==(S.ph||1)){ S.ph=ph; this.screenShake?.(320,.014); this.screenFlash?.(ph===3?0xff4d6a:0x8a4fd8,.3,300); S.ring?.setStrokeStyle?.(12,ph===3?0xff4d6a:0xd9a6ff,.95); if(ph===3){ e.setTint?.(0xff6a8a); e.tintColor=0xff6a8a; } this.showBanner?.(ph===2?'🖐️ The Breachlord splits the ground':'🖐️ The Breachlord rages!',ph===2?'Quake lines now crack toward you':'Faster rings and more hands',1400); }   // v8.2.19 บอส 3 เฟส (66% / 33%)
    const sp=ph===3?.75:1,tick=(k,sec,fn)=>{ sec*=sp; S.cd[k]=(S.cd[k]??sec*.5)-dt; if(S.cd[k]<=0){ S.cd[k]=sec; this.artFollowAct?.(e); fn(); } };
    if(ph>=2)tick('quake',5,()=>{ const a=Math.atan2(p.y-e.y,p.x-e.x); for(let k=1;k<=7;k++)this.time?.delayedCall?.(k*90,()=>this.spawnHazard?.(e.x+Math.cos(a)*k*80,e.y+Math.sin(a)*k*80,50,dm,0xb36bff)); });
    tick('ring',3.2,()=>{ for(let i=0;i<12;i++)this.foeShot?.(e.x,e.y,i*TAU/12+S.t,210,dm,0xb36bff,1); });
    tick('slam',4.5,()=>{ this.spawnHazard?.(p.x,p.y,100,Math.round(dm*1.5),0xb36bff); });
    tick('hands',ph===3?6:9,()=>{ for(let i=0;i<2;i++){ const h=this.sigSpawnAt(e.x+(Math.random()-.5)*160,e.y+(Math.random()-.5)*160,true); if(h){ h._breach=true; h.setTint?.(0x9b6bff); } } });
    S.hud?.setText(e.maxhp?'🖐️ Breachlord '+Math.max(0,Math.round(e.hp/e.maxhp*100))+'%':'').setPosition(p.x,p.y-84); g?.clear(); }
  hdLord(o,S){ this.a12?.('lg_breachlord',.55,.5); const p=this.player,a=Math.random()*TAU,lx=p.x+Math.cos(a)*300,ly=p.y+Math.sin(a)*300; if(S.phase==='flood'){ S.phase='clearing'; this.enemies?.children?.iterate?.(q=>{ if(q&&q.active&&q._breach&&!q.isBoss){ q._breach=false; q._brSp=null; if(q._aura){ q._aura.destroy(); q._aura=null; } this.stopEnemyPresentation?.(q); q.setActive(false).setVisible(false); if(q.body)q.body.enable=false; this.vfxSpawnPoof?.(q.x,q.y); } }); }   /* น้ำท่วมจบ → ดูดมอนรอยแยกกลับ เปิดที่ให้บอส */
    let e=this.sigSpawnAt(lx,ly,true); if(!e){ e=this.spawnElite?.(true,true); if(e)e.setPosition?.(lx,ly); } if(!e){ S.re=1; return; } S.phase='lord'; S.lord=e; e._hdLord=true; e._breach=false; this.artFollow?.(e,'hm_breachlord',240);
    if(e.setScale)e.setScale((e.baseScale||e.scaleX||1)*2.2); if(e.maxhp){ e.maxhp*=10*(1+S.d*.05); e.hp=e.maxhp; } e.setTint?.(0x8a4fd8); e.tintColor=0x8a4fd8;
    this.screenShake?.(300,.012); this.showBanner?.('🖐️ The Breachlord','The master of the breach reaches through — beat it!',1800); }
  hdDown(e,o,S){ if(o.done)return; const si=this.stageIndex||0,su=Math.round((40+S.d*6)*(1+si*.05)),L0=this._lootAt; o.progress=1; this.sugarStage+=su; this.sugarRun+=su; this.screenFlash?.(0xd9a6ff,.35,320); this.screenShake?.(320,.014);
    this.floatText?.(e.x,e.y-90,'🖐️ The Breachlord falls!',0xe3c4ff); this._lootAt={x:e.x,y:e.y}; try{ this.missionLootBurst?.({type:'tree',noHold:true},su); }finally{ this._lootAt=L0; }
    for(let i=0;i<3;i++)this.leagueCurrencyDrop?.(o); this.hmSplinters?.(20); try{ this.grantGear?.('legend'); }catch(_){} this.completeWaveObjective(); }
  /* v8.1.84 ภารกิจ League ดรอปสกุลแถว Reforge (Herald ได้เพิ่ม 1) */
  leagueCurrencyDrop(o){ const P=this.missionPoint?.(o)||this.player,si=this.stageIndex||0,S=this._sig,n=(this.fpFull?.()?2:1)+(o&&o.type==='hungerHerald'?1:0),W=[['transmute',73],['starsugar',si>=5?15:5],['recipeink',12]],T=W.reduce((a,b)=>a+b[1],0);
    for(let i=0;i<n;i++){ let r=Math.random()*T,k=W[0][0]; for(const [kk,w] of W){ r-=w; if(r<0){ k=kk; break; } } this.spawnCurrencyDrop?.(P.x+(Math.random()-.5)*70,P.y+(Math.random()-.5)*50,k); } }
  /* ===== v8.1.93 อาร์ตภารกิจ ใบ 71–74 · ไม่มีภาพ = ใช้อีโมจิ/วงกราฟิกเดิม ===== */
  missionArtKeys(idx){ const A=typeof ASSET_FX!=='undefined'?ASSET_FX:{},pre=p=>Object.keys(A).filter(x=>x.startsWith(p)),k=[],by={0:['hh_'],1:['hm_','brm_'],2:['gp_'],3:['fp_'],4:['gg_'],7:['cr_root_'],13:['ult_']},m={6:['msn71_bubble'],8:['msn71_season_shrines','msn71_petals'],10:['msn71_rift','vfx_seed_rift_feed'],11:['msn71_tree'],12:['msn71_mirror','msn71_crystal','msn71_crystal_blast','vfx_mirror_path_lock'],14:['msn71_lantern','msn71_lantern_out']};
    const fx={hh_:['gates_shut'],hm_:['breach_open','splinter_pick','breach_chest','stone_fuse'],gp_:['dish_served'],fp_:['statue_paint'],gg_:['golem_bake'],cr_root_:['root_cut'],hs_:['siege_break'],ult_:['trial_curse','trial_take','trial_risk']};
    const prefixes=[...(by[idx]||[])];
    if(this.recipeMode||this._recipeRequested||this.riftMode)prefixes.push('hm_','brm_','hs_','ult_');
    for(const prefix of prefixes)k.push(...pre(prefix),...(fx[prefix]||[]).map(name=>'vfx78_'+name));
    { const M85={0:['hh85_','hh87_'],3:['fp85_'],4:['gg87_'],7:['cr87_'],10:['sr87_'],11:['st87_'],12:['mp85_'],13:['ult85_'],14:['ll85_']}; for(const pf of M85[idx]||[])k.push(...pre(pf)); k.push(...pre('mc86_'),...pre('hn87_')); k.push(...pre('cb93_'),...pre('hn92_'),...pre('ws92_'),...pre('hc_new_'));   /* v8.2.24 การ์ดแจก + ขวดพิษ Hunt ทุกด่าน */ if(idx>=(typeof STACK_FROM!=='undefined'?STACK_FROM:5))k.push(...pre('hh87_'),...pre('st87_'),...pre('cr87_'),...pre('sr87_'),...pre('gg87_'),...pre('ui87_')); if(this.recipeMode||this._recipeRequested||this.riftMode)k.push(...pre('hs85_'),...pre('ult85_')); if(idx>=(typeof STACK_FROM!=='undefined'?STACK_FROM:5))k.push(...pre('hh85_'),...pre('mp85_'),...pre('ll85_')); }   /* v8.2.23 ใบ 85 · ภารกิจเสริม (ซ้อน) ใน Ch2+ อาจเป็น Herald/Mirror/Last Light */
    k.push(...(m[idx]||[]),'msn71_stalker_captain','msn71_stalker_captain_attack','msn71_stalker_captain_death'); if(idx<5)k.push('msn71_supply_crate');
    if(idx>=5&&idx!==10&&typeof SR_EVENT_ON!=='undefined'&&SR_EVENT_ON)k.push('msn71_rift',...pre('sr87_'));   /* v8.2.83 เหตุการณ์ Seed Rift สุ่มได้ทุกด่าน Ch2–3 */
    return [...new Set(k)].filter(x=>x!=='hm_rim'&&A[x]); }
  artSpr(key,x,y,px,frame=0,o={}){ if(!key||!this.textures?.exists?.(key))return null; const fd=(typeof ASSET_FX!=='undefined'&&ASSET_FX[key])||{},s=this.camWorld(this.add.sprite(x,y,key,frame)),fw=fd.fw||s.width,fh=fd.fh||s.height;
    s.setScale(px/Math.max(fw,fh)); s.setOrigin(.5,(o.feet!=null?o.feet:fd.anchor==='feet')?.94:.5); s.setDepth(o.depth!=null?o.depth:y+2);
    if(o.anim!==false&&fd.loop&&fd.frames>1){ if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:fd.frames-1}),frameRate:fd.rate||8,repeat:-1}); s.play(key); }
    if(o.sig!==false&&this._sig)this._sig.objs.push(s); return s; }
  sigArt(key,frame,x,y,px,emoji,fs,ey){ return this.artSpr(key,x,y,px,frame)||this.sigText(x,ey!=null?ey:y,emoji,fs); }
  artIsSpr(o){ return !!o&&o.type==='Sprite'; }
  artFx(key,x,y,px){ if(!this.textures?.exists?.(key))return null; const fd=ASSET_FX[key]||{}; const sprite=this.spawnFxAnim?.(key,x,y,{normal:true,scale:px/Math.max(fd.fw||256,fd.fh||256),depth:90020}); if(sprite&&(/^(?:vfx78|brm)_/.test(key)||fd.url?.includes('/motion77/')))this.trackArtVfx?.(sprite); return sprite; }
  artFollow(e,key,px){
    if(!e||!this.textures?.exists?.(key))return null;
    if(e._artOv?.active)e._artOv.destroy();
    const s=this.artSpr(key,e.x,e.y,px,0,{sig:false,feet:false});
    if(!s)return null;
    s._fe=e; s._idle=key; s._act=key+'_attack'; s._die=key+'_death'; s._px=px;
    s._nearActAt=(this.time?.now||0)+2500;
    e._artOv=s; (this._artFol||(this._artFol=[])).push(s);
    return s;
  }
  artFollowAct(e){
    const s=e?._artOv,now=this.time?.now||0;
    if(!e?.active||!s?.active||s._acting||now<(s._actAt||0)||!this.textures?.exists?.(s._act))return false;
    const key=s._act,def=ASSET_FX[key];
    if(!def)return false;
    if(!this.anims.exists(key)){
      this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{start:0,end:def.frames-1}),frameRate:def.rate,repeat:0});
    }
    s._acting=true; s._actAt=now+1200; s._nearActAt=now+2500;
    s.once('animationcomplete-'+key,()=>{
      if(!s.active||!e.active||e._artOv!==s)return;
      s._acting=false;
      if(ASSET_FX[s._idle]?.loop)s.play(s._idle);
      else s.setTexture(s._idle,0);
    });
    s.play(key);
    return true;
  }
  artFollowDeath(e,s=e?._artOv){
    if(!s?.active||s._deathTried||!this.textures?.exists?.(s._die))return;
    s._deathTried=true;
    const sprite=this.artFx?.(s._die,e?.x??s.x,e?.y??s.y,s._px);
    if(sprite){
      sprite.setFlipX?.(!!s.flipX);
      if(e)e._missionDeathArt=true;
    }
  }
  artFollowTick(){
    const list=this._artFol;
    if(!list?.length)return;
    this._artFol=list.filter(s=>{
      const e=s._fe;
      if(!s.active){ if(e&&e._artOv===s){ e._artOv=null; e.setAlpha?.(1); } return false; }   /* v8.2.51 เจ้าของ: ภาพซ้อนถูกลบก่อน → ตัวมอนค้างโปร่ง (เห็นแต่เงา) */
      if(!e||!e.active||e._artOv!==s){
        if(e&&e._artOv===s){
          this.artFollowDeath?.(e,s);
          e._artOv=null; e.setAlpha?.(1);
        }
        s.destroy();
        return false;
      }
      s.setPosition(e.x,e.y).setDepth((e.depth||e.y)+1);
      if(e.alpha>.02)e.setAlpha(.01);
      if(e._fpTok){
        const frozen=e.frozen>0;
        if(frozen!==s._fpFrozen){
          s._fpFrozen=frozen;
          if(frozen){ s.setTint?.(0x9dd7ff); s.anims?.pause?.(); }
          else { s.clearTint?.(); s.anims?.resume?.(); }
        }
      }
      const vx=e.body?.velocity?.x||0;
      if(Math.abs(vx)>5)s.setFlipX(vx<0);
      const p=this.player;
      if(p&&this.time?.now>=s._nearActAt&&this.dist(e.x,e.y,p.x,p.y)<180)this.artFollowAct?.(e);
      return true;
    });
  }
  /* v8.2.31 ใบ 90 ประกายมอนทอง: สไปรต์ซ้อนตามตัว (ไม่ซ่อนมอน) · สูงสุด 16 · หายเมื่อมอนตาย/ถูกใช้ซ้ำ */
  goldShimAdd(e){ const L=this._goldShims||(this._goldShims=[]); if(L.length>=16||!this.add?.sprite)return null; const sp=this.camWorld(this.add.sprite(e.x,e.y,'ev90_gold_shimmer',0).setDisplaySize(64,64).setDepth((e.depth||e.y)+1)); try{ if(this.anims&&!this.anims.exists('ev90_gold_shimmer'))this.anims.create({key:'ev90_gold_shimmer',frames:this.anims.generateFrameNumbers('ev90_gold_shimmer',{start:0,end:5}),frameRate:12,repeat:-1}); sp.play?.('ev90_gold_shimmer'); }catch(err){} L.push({s:sp,e}); return sp; }
  goldShimTick(){ const L=this._goldShims; if(!L||!L.length)return; this._goldShims=L.filter(q=>{ if(!q.s.active)return false; if(!q.e||!q.e.active||!q.e._gold){ q.s.destroy(); return false; } q.s.setPosition(q.e.x,q.e.y-6).setDepth((q.e.depth||q.e.y)+1); return true; }); }
  artFollowClear(){ for(const s of this._artFol||[]){ const e=s._fe; if(e&&e._artOv===s){ e._artOv=null; e.setAlpha?.(1); } if(s.active)s.destroy(); } this._artFol=[]; }
  sigNear(x,y,R){ const p=this.player; return !!p&&this.dist(p.x,p.y,x,y)<R; }
  sigTick(dt,o){ const S=this._sig; if(!S||S.type!==o.type||this.state!=='play')return; const g=this.objNodeG,si=this.stageIndex||0; S.t=(S.t||0)+dt;
    if(o.type==='seedRift'){ const P=this.player,R=S.R+S.seeds*12; S.curR=R; S.ring.setRadius(R); if(this.artIsSpr(S.core))S.core.setDisplaySize(R*2.1,R*2.1);
      if(P){ const d=this.dist(P.x,P.y,S.x,S.y); if(d>30&&d<1100){ const k=Math.min(d-20,S.pull*dt*(d<700?1:.5)); P.x-=(P.x-S.x)/d*k; P.y-=(P.y-S.y)/d*k; }
        S.hurtT-=dt; if(d<R*.55&&S.hurtT<=0){ S.hurtT=.7; this.hurtPlayer?.(Math.round(6+si*.8)); } }
      S.carriers=S.carriers.filter(e=>e&&e.active&&e._seedCarrier===S.tag);
      S.spawn-=dt; if(S.spawn<=0&&S.carriers.length<4){ S.spawn=2.1; const a=Math.random()*TAU; this.srCarrier(S,S.x+Math.cos(a)*560,S.y+Math.sin(a)*560,this.srPick()); }
      let feedCue=false;
      for(const e of S.carriers){ if(this.dist(e.x,e.y,S.x,S.y)<R*.5){ e._seedCarrier=null; e._goTo=null; if(e._aura){ e._aura.destroy(); e._aura=null; } this.stopEnemyPresentation?.(e); e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; if(!feedCue&&this.realTex?.('vfx_seed_rift_feed'))feedCue=!!this.artFx?.('vfx_seed_rift_feed',S.x,S.y-44,144);
          if(!feedCue)this.vfxSpawnPoof?.(e.x,e.y);
          S.seeds++; S.pull=Math.min(170,S.pull+20); this.floatText?.(S.x,S.y-R-20,'🌰 The rift feeds — it pulls harder!',0x9cff6b); this.screenShake?.(140,.006); } }
      g?.clear(); const tt=S.t||0; for(let i=0;i<6;i++){ const a=tt*1.6+i/6*TAU,r1=R+70+((tt*90+i*40)%120),r2=R*.8; g?.lineStyle(2,0xb88cff,.35); g?.beginPath(); g?.moveTo(S.x+Math.cos(a)*r1,S.y+Math.sin(a)*r1*.7); g?.lineTo(S.x+Math.cos(a+.5)*r2,S.y+Math.sin(a+.5)*r2*.7); g?.strokePath(); }
      for(const e of S.carriers){ const r=e._srWorth>1?9:6; g?.fillStyle(e._srC||0x9cff6b,.9).fillCircle(e.x,e.y-38,r); g?.lineStyle(2,0x2c5a14,1).strokeCircle(e.x,e.y-38,r); } }
    else if(o.type==='shakeTrees'){ g?.clear(); for(const t of S.trees){ if(t.done)continue; const near=this.sigNear(t.x,t.y,100); t.pc=Math.max(0,Math.min(1.8,t.pc+(near?dt:-dt*.5))); t.ring.setFillStyle(o.color,near?.2:.08); if(t.pc>0){ g?.lineStyle(7,0xffffff,.95); g?.beginPath(); g?.arc(t.x,t.y+10,86,-Math.PI/2,-Math.PI/2+TAU*t.pc/1.8,false); g?.strokePath(); }
        if(near)t.t.setRotation(Math.sin(S.t*30)*.08*(t.pc/1.8)); if(t.pc>=1.8){ t.done=true; t.t.setRotation(0).setAlpha(this.artIsSpr(t.t)?1:.45); if(this.artIsSpr(t.t))t.t.setFrame(1);; t.ring.setVisible(false); o.progress++; this.screenShake?.(90,.004);
          t.shine?.setVisible?.(false); if(t.kind==='hive'||t.kind==='mimic'||t.kind==='golden')this.stTreeSurprise(t,si);
          else { const su=Math.round(4+si*1.2); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:t.x,y:t.y+20}; try{ this.missionLootBurst?.({type:'tree',noCur:true,noHold:true},su); }finally{ this._lootAt=L0; } } } }
      if(o.progress>=o.target)this.completeWaveObjective(); }
    else if(o.type==='mirrorPath'){ const bg=S.beam; bg?.clear(); g?.clear(); let lit=0; this.mpShadeTick(dt,o,S); for(const m of S.mirrors){ if(m.lit){ lit++; const blk=m.pow<1; bg?.lineStyle(6,blk?0x6a5a9a:0x9fe0ff,(.55+.25*Math.sin(S.t*8))*(.35+.65*m.pow)).lineBetween(S.cx,S.cy,m.x,m.y); continue; } const near=this.sigNear(m.x,m.y,92); m.pc=Math.max(0,Math.min(2.4,m.pc+(near?dt:-dt*.4))); m.ring.setFillStyle(0x9fe0ff,near?.2:.08);
        if(m.pc>0){ g?.lineStyle(7,0xffffff,.95); g?.beginPath(); g?.arc(m.x,m.y+8,78,-Math.PI/2,-Math.PI/2+TAU*m.pc/2.4,false); g?.strokePath(); } if(m.pc>=2.4){ m.lit=true; m.pow=1; m.ring.setStrokeStyle(4,0xffffff,.9); if(this.artIsSpr(m.t))m.t.setFrame(1);
          if(!this.realTex?.('vfx_mirror_path_lock')||!this.artFx?.('vfx_mirror_path_lock',m.x,m.y-38,128))this.vfxHitRing?.(m.x,m.y,0x9fe0ff,true); } }
      o.progress=lit; if(lit>=o.target&&!S.blast){ S.blast=true; const R=520; this.screenFlash?.(0xbfe8ff,.3,260); this.screenShake?.(260,.012); this.vfxHitRing?.(S.cx,S.cy,0xbfe8ff,true); this.artFx?.('msn71_crystal_blast',S.cx,S.cy,1040); const dmg=60+si*18;
        this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&this.dist(e.x,e.y,S.cx,S.cy)<R)this.damage(e,e.isMini||e.isElite?dmg*1.5:dmg*3,e.x,e.y); }); this.completeWaveObjective(); } }
    else if(o.type==='vaultAltar'||o.type==='ultimatum'){ this.ultTick(dt,o,S); }
    else if(o.type==='frozenPantry'){ this.fpTick(dt,o,S); }
    else if(o.type==='hungersMouth'){ this.hmTick(dt,o,S); }
    else if(o.type==='creepingRoots'){ this.crTick(dt,o,S); }
    else if(o.type==='hungerHerald'){ this.hhTick(dt,o,S); }
    else if(o.type==='grandmasPot'){ this.gpTick(dt,o,S); }
    else if(o.type==='grandmasGolem'){ this.ggTick(dt,o,S); }
    else if(o.type==='hungerSiege'){ this.hsTick(dt,o,S); }
    else if(o.type==='hungerDomain'){ this.hdTick(dt,o,S); }
    else if(o.type==='lastLight'){ let alive=0; g?.clear(); this.llExtrasTick?.(dt,o,S); for(const L of S.lamps){ if(!L.alive)continue; alive++; let att=0; this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&this.dist(e.x,e.y,L.x,L.y)<130)att++; }); L.hp-=att*(2.2+si*.15)*dt; if(this.sigNear(L.x,L.y,125))L.hp=Math.min(L.maxhp,L.hp+16*dt);
        if(L.hp<=0){ L.alive=false; alive--; (this.artIsSpr(L.t)&&this.textures.exists('msn71_lantern_out')?L.t.stop?.().setTexture('msn71_lantern_out',0):L.t.setAlpha(.3)); L.ring.setVisible(false); this.objBonusFail?.(); this.floatText?.(L.x,L.y-60,'🏮 Lantern out!',0xff9b6a); continue; }
        const w=70,f=L.hp/L.maxhp; g?.fillStyle(0x190b24,.78).fillRoundedRect(L.x-w/2,L.y-70,w,8,4).fillStyle(f<.35?0xff5f7a:0xffb347,.95).fillRoundedRect(L.x-w/2+2,L.y-68,(w-4)*f,4,2); L.t.setScale(1+.04*Math.sin(S.t*6+L.x)); }
      if(alive<=0){ o.progress=Math.max(0,o.progress-o.target*.3); for(const L of S.lamps){ L.alive=true; L.hp=L.maxhp*.6; (this.artIsSpr(L.t)&&this.anims.exists('msn71_lantern')?L.t.setTexture('msn71_lantern',0).play('msn71_lantern'):L.t.setAlpha(1)); L.ring.setVisible(true); } this.showBanner?.('🌑 All lights out · timer -30%','The lanterns flicker back — guard them!',1500); }
      o.progress=Math.min(o.target,o.progress+dt); if(o.progress>=o.target)this.completeWaveObjective(); } }
  /* ===== v8.1.80 Ultimatum (Sugar Crown Trial) — แต่ละรอบ: เลือกคำสาป 1/3 (ซ้อนกัน) → ทำเป้ารอบ → รับของออก หรือ สู้ต่อ · แพ้ = ได้ครึ่งกอง ===== */
  ultPad(x,y,em,label,col){ const ci=(typeof ULT_CURSES!=='undefined'?ULT_CURSES.findIndex(c=>c.em===em):-1),pk=ci>=0&&ci<6?'ult_curse_pads':ci>=6?(this.realTex?.('ult85_curse_pads')?'ult85_curse_pads':null):(em==='🎁'||em==='⚔️')?'ult_choice_pads':null,   /* v8.2.23 ใบ 85 คำสาปช่อง 7–8 */   /* v8.2.19 คำสาปใหม่ (ช่อง 7–8) ยังไม่มีภาพ → แผ่นวาดด้วยโค้ด */pf=ci>=6?ci-6:ci>=0?ci:em==='⚔️'?1:0,art=pk&&this.artSpr(pk,x,y,100,pf,{depth:y-1});   /* v8.1.93 ใบ 74 */
    const ring=this.sigAdd(this.add.circle(x,y,50,col,art?.06:.2).setStrokeStyle(3,col,art?.4:.9).setDepth(y-2)),t=art||this.sigText(x,y-4,em,30),l=this.sigAdd(this.add.text(x,y+40,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffeef6',stroke:'#1a0f1e',strokeThickness:3,align:'center'}).setOrigin(.5).setDepth(y+6)); this.tweens.add({targets:ring,scale:{from:.94,to:1.06},duration:600,yoyo:true,repeat:-1}); return {x,y,objs:[ring,t,l]}; }
  ultPadsClear(S){ for(const pd of S.pads||[])for(const q of pd.objs){ this.tweens.killTweensOf(q); q.destroy(); } S.pads=[]; }
  ultSetup(o,S,rounds){ const q=this.objectivePosition(0,1,170,240),si=this.stageIndex||0,tier=(this._recipe&&this._recipe.tier)||0; Object.assign(S,{x:q.x,y:q.y,rounds,r:0,curses:[],mult:1,pot:0,boxes:0,phase:'pick',pads:[],base:Math.round((10+3*Math.max(si,8)+tier*4)*(this.diffMul?.().reward||1))});
    S.altar=this.sigArt('ult_altar',0,q.x,q.y+44,110,'⚖️',46,q.y); S.ring=this.sigAdd(this.add.circle(q.x,q.y,230,0xffd166,.04).setStrokeStyle(3,0xffd166,.45).setDepth(q.y-4)); if(this.artSpr('ult_circle',q.x,q.y,470,0,{depth:q.y-3}))S.ring.setStrokeStyle(0); o._ocDone=true; this.ultNextPick(o,S); }
  ultNextPick(o,S){ S.r++; S.phase='pick'; this.ultPadsClear(S); o._ultSec=false; o.target=1; o.progress=0; o.name=(o.type==='ultimatum'?'Trial':'Vault Altar')+' · Round '+S.r+'/'+S.rounds; o.desc='Walk onto a curse stone — curses stack every round';
    const all=ULT_CURSES.filter(c=>!S.curses.includes(c.id)),pick=Phaser.Utils.Array.Shuffle(all.slice()).slice(0,3);
    pick.forEach((c,i)=>{ const a=-Math.PI/2+(i-1)*1.05,x=S.x+Math.cos(a)*165,y=S.y+Math.sin(a)*165+40,pd=this.ultPad(x,y,c.em,c.name+'\nWin: 🍬 +'+Math.round((S.base||0)*(1+.5*S.r)*((S.mult||1)+c.v)),0xff8fb0);   /* v8.2.27 เจ้าของ: บอก 🍬 ที่จะได้จริงแทน % */ pd.c=c; S.pads.push(pd); });
    this.showBanner?.('⚖️ Round '+S.r+'/'+S.rounds+' · choose a curse','Pot: 🍬 '+S.pot+(S.boxes?' · 🎁 ×'+S.boxes:''),1600); this.ultLadder(S); this.renderWaveObjectiveHUD?.(); }
  ultStartFight(o,S,c){ this.missionMusic?.('bgm_m_trial'); this.a12?.('tr_curse_pick',.45,.3); S.curses.push(c.id); S.mult+=c.v; if(c.id==='noheal')S.noHeal=true; this.ultPadsClear(S); const G=ULT_GOALS[(S.r+Math.floor(Math.random()*ULT_GOALS.length))%ULT_GOALS.length]; S.goal=G; S.phase='fight'; S.t=G==='slay'?28:22; S.kills=0; S.altHp=300; S.seeds=[]; S.cd={};
    o._ultSec=G!=='slay'&&G!=='collect'; o.target=G==='slay'?14+S.r*4:G==='collect'?5:20; o.progress=0; o.name=(o.type==='ultimatum'?'Trial':'Vault Altar')+' · R'+S.r+' · '+{survive:'Hold the circle',slay:'Slay',defend:'Defend the altar',collect:'Grab the seeds'}[G];
    if(G==='collect')this.ultSeed(S); if(c.id==='elite')this.sigSpawnAt(S.x+200,S.y,true); this.screenFlash?.(0xff8fb0,.12,200); this.artFx?.('vfx78_trial_curse',S.x,S.y,200); if(typeof Sfx!=='undefined')Sfx.bossWarn?.();
    this.showBanner?.(c.em+' '+c.name+' · '+o.name.split(' · ').pop(),G==='slay'?'Defeat '+o.target+' in '+S.t+'s':G==='collect'?'Grab 5 seeds in '+S.t+'s':G==='defend'?'Keep the altar alive for 20s':'Stay inside the gold circle for 20s',1800); this.renderWaveObjectiveHUD?.(); }
  ultLadder(S){ if(!S.lad&&this.add?.text)S.lad=this.sigAdd(this.add.text(S.x,S.y-230,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#fff4dc',stroke:'#1a0f1e',strokeThickness:4,align:'center'}).setOrigin(.5).setDepth(S.y+8)); let t=''; for(let i=1;i<=S.rounds;i++)t+=(i<S.r||(i===S.r&&S.phase==='decide')?'✅':i===S.r?'⚔️':i===S.rounds?'👑':'▫️')+' '; S.lad?.setText(t.trim()+'\n🍬 '+S.pot+(S.boxes?'  🎁×'+S.boxes:'')); }   // v8.2.19 แถบขั้นรางวัลเหนือแท่น
  ultSeed(S){ const a=Math.random()*TAU,r=80+Math.random()*170; S.seed={x:S.x+Math.cos(a)*r,y:S.y+Math.sin(a)*r}; S.seed.o=this.sigArt('ult_seed',0,S.seed.x,S.seed.y,34,'🌰',26); }
  ultCurseTick(dt,S){ const p=this.player,cd=S.cd,has=id=>S.curses.includes(id),tick=(id,every,f)=>{ if(!has(id))return; cd[id]=(cd[id]??every)-dt; if(cd[id]<=0){ cd[id]=every; f(); } };
    tick('swarm',1.4,()=>{ for(let k=0;k<2;k++){ const a=Math.random()*TAU; this.sigSpawnAt(p.x+Math.cos(a)*300,p.y+Math.sin(a)*300); } });
    tick('elite',7,()=>{ const a=Math.random()*TAU; this.sigSpawnAt(p.x+Math.cos(a)*320,p.y+Math.sin(a)*320,true); });
    tick('bombs',2.6,()=>{ this.spawnHazard?.(p.x+(Math.random()-.5)*120,p.y+(Math.random()-.5)*120,58,Math.round(8+(this.stageIndex||0)*1.6),0xff8fb0); });
    tick('shots',3.6,()=>{ const n=10,gap=Math.floor(Math.random()*n); for(let i=0;i<n;i++){ if(i===gap||i===(gap+1)%n)continue; const a=i*TAU/n; this.foeShot?.(p.x+Math.cos(a)*270,p.y+Math.sin(a)*270,a+Math.PI,220,Math.round(8+(this.stageIndex||0)*1.5),0xff8fb0,.9); } });
    tick('drain',1,()=>{ if(p.hp>p.maxhp*.25)p.hp-=p.maxhp*.015; });
    tick('ghosts',4.5,()=>{ const a=Math.atan2(p.vy||p.body?.velocity?.y||0,p.vx||p.body?.velocity?.x||1)+Math.PI,e=this.sigSpawnAt(p.x+Math.cos(a)*260,p.y+Math.sin(a)*260,false,'fast'); if(e){ e.setTint?.(0xe8e8ff); e.tintColor=0xe8e8ff; e.setAlpha?.(.7); } });   // v8.2.19 ผีหิวโผล่ข้างหลัง
    tick('quake',5,()=>{ const a=Math.random()*Math.PI,dm=Math.round(8+(this.stageIndex||0)*1.5); for(let k=-3;k<=3;k++)this.spawnHazard?.(p.x+Math.cos(a)*k*70,p.y+Math.sin(a)*k*70,46,dm,0xff8f4d); }); }   // v8.2.19 แนวแผ่นดินไหวผ่านตัว
  ultTick(dt,o,S){ const p=this.player; if(!p)return; S.t=(S.t||0);
    if(S.phase==='pick'){ for(const pd of S.pads)if(this.dist(p.x,p.y,pd.x,pd.y)<52){ this.ultStartFight(o,S,pd.c); break; } return; }
    if(S.phase==='decide'){ S.dt-=dt; const lab=S.pads[0]?.objs[2]; if(lab?.active)lab.setText('Take & leave\n'+Math.ceil(Math.max(0,S.dt))+'s'); for(const pd of S.pads)if(this.dist(p.x,p.y,pd.x,pd.y)<52){ if(pd.act==='take'){ this.a12?.('tr_take',.45,.3); this.artFx?.('vfx78_trial_take',pd.x,pd.y,160); this.ultFinish(o,S,'take'); } else{ this.a12?.('tr_risk',.45,.3); this.artFx?.('vfx78_trial_risk',pd.x,pd.y,160); this.ultNextPick(o,S); } return; } if(S.dt<=0)this.ultFinish(o,S,'take'); return; }
    if(S.phase!=='fight')return; S.t-=dt; this.ultCurseTick(dt,S); const G=S.goal,g=this.objNodeG; g?.clear();
    if(G==='survive'){ const inside=this.dist(p.x,p.y,S.x,S.y)<230; if(inside)o.progress=Math.min(o.target,o.progress+dt); S.ring.setFillStyle(0xffd166,inside?.12:.04); }
    else if(G==='defend'){ let att=0; this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&this.dist(e.x,e.y,S.x,S.y)<120)att++; }); S.altHp-=att*3*dt; if(this.dist(p.x,p.y,S.x,S.y)<130)S.altHp=Math.min(300,S.altHp+10*dt); o.progress=Math.min(o.target,o.progress+dt);
      g?.fillStyle(0x190b24,.8).fillRoundedRect(S.x-50,S.y-70,100,8,4).fillStyle(S.altHp<100?0xff5f7a:0xffd166,.95).fillRoundedRect(S.x-48,S.y-68,96*Math.max(0,S.altHp/300),4,2); if(S.altHp<=0)return this.ultFinish(o,S,'fail'); }
    else if(G==='collect'){ if(S.seed&&this.dist(p.x,p.y,S.seed.x,S.seed.y)<40){ S.seed.o.destroy(); o.progress++; this.burst?.(S.seed.x,S.seed.y,0xffd166); if(o.progress<o.target)this.ultSeed(S); else S.seed=null; } }
    if(o.progress>=o.target)return this.ultRoundWon(o,S); if(G!=='survive'&&G!=='defend'&&S.t<=0)return this.ultFinish(o,S,'fail'); if(this.waveObjTxt?.active&&(G==='slay'||G==='collect'))this.waveObjTxt.setText('⚖️ '+o.name+' · '+o.progress+'/'+o.target+' · '+Math.ceil(Math.max(0,S.t))+'s'); }
  ultRoundWon(o,S){ S.phase='decide'; S.noHeal=false; S.curses.includes('noheal')&&(S.noHeal=true); const add=Math.round(S.base*(1+.5*S.r)*S.mult); S.pot+=add; if(S.r>=2)S.boxes++; this.vfxHitRing?.(S.x,S.y,0xffd166,true); (this.a12?.('tr_round_won',.45,.3))||Sfx.orderCue?.('mission_bonus_get',.45,.3); this.floatText?.(S.x,S.y-80,'🍬 +'+add+' to the pot',0xffd166);
    if(S.r>=S.rounds)return this.ultFinish(o,S,'clear'); S.dt=8; this.ultPadsClear(S); const nx=Math.round(S.base*(1+.5*(S.r+1))*S.mult),last=S.r+1>=S.rounds,tk=this.ultPad(S.x-110,S.y+60,'🎁','Take & leave\n🍬 '+S.pot+(S.boxes?' 🎁×'+S.boxes:''),0x7fe3a8),go=this.ultPad(S.x+110,S.y+60,'⚔️','Risk it: +🍬~'+nx+(S.r+1>=2?' +🎁':'')+(last?'\n👑 clear = Epic box':'\nlose = half'),0xff8fb0);   /* v8.2.19 เห็นขั้นรางวัลชัด ๆ */ tk.act='take'; go.act='go'; S.pads=[tk,go];
    o.name=(o.type==='ultimatum'?'Trial':'Vault Altar')+' · Pot 🍬 '+S.pot+(S.boxes?' 🎁×'+S.boxes:''); this.ultLadder(S); this.showBanner?.('⚖️ Round '+S.r+' cleared','Take the pot, or risk it — losing costs half',2000); this.renderWaveObjectiveHUD?.(); }
  ultFinish(o,S,how){ this.ultPadsClear(S); S.phase='done'; S.lad?.setVisible?.(false); S.noHeal=false; let pot=S.pot,boxes=S.boxes; if(how==='fail'){ this.a12?.('tr_fail',.5,.5); pot=Math.floor(pot/2); boxes=Math.floor(boxes/2); this.showBanner?.('⚖️ Trial failed','You keep half the pot',1800); } else if(how==='clear'){ boxes+=1; this.showBanner?.('👑 Trial conquered!','The whole pot is yours',2000); this.screenFlash?.(0xffd166,.25,300); }
    if(pot>0){ this.sugarStage+=pot; this.sugarRun+=pot; const L0=this._lootAt; this._lootAt={x:S.x,y:S.y}; try{ this.missionLootBurst?.({type:'trial',noCur:how==='fail'},pot); }finally{ this._lootAt=L0; } }
    if(this.spawnLoot)for(let k=0;k<boxes;k++){ this._lootMinRare=true; try{ const a=k/Math.max(1,boxes)*TAU,g=this.spawnLoot(S.x+Math.cos(a)*90,S.y+Math.sin(a)*70,how==='clear'&&k===boxes-1?3:2); if(g){ if(how==='clear'&&k===boxes-1&&g.lootTier!=='legend')g.lootTier='epic'; this.lootHold?.(g,1900); } } finally{ this._lootMinRare=false; } }
    o.progress=o.target; o._ultResult=how; if(!o.done)this.completeWaveObjective(); }
  breachFoeArt(e){
    if(e._hmLord||e._hdLord)return;
    const species=['mite','maw','claw','eye'];
    const sp=species[Math.abs((e.x*31+e.y*17)|0)%species.length];
    const size={mite:56,maw:90,claw:70,eye:64}[sp];
    const overlay=this.artFollow?.(e,'brm_'+sp+'_walk',size);
    if(!overlay)return;
    e._brSp=sp;
    e.clearTint?.();
  }
  breachFoeDeath(e){
    const sp=e?._brSp;
    if(!sp)return;
    e._brSp=null;
    const sprite=this.artFx?.('brm_'+sp+'_death',e.x,e.y,{mite:56,maw:90,claw:70,eye:64}[sp]);
    if(sprite){
      sprite.setFlipX?.(!!e._artOv?.flipX);
      e._missionDeathArt=true;
    }
  }
  stTreeSurprise(t,si){ const L0=this._lootAt; this._lootAt={x:t.x,y:t.y+20};   // v8.2.17 ผลของต้นไม้แต่ละแบบ
    try{ if(t.kind==='golden'){ const su=Math.round((4+si*1.2)*2.5); this.sugarStage+=su; this.sugarRun+=su; this.missionLootBurst?.({type:'tree',noCur:true,noHold:true},su); for(let i=0;i<2;i++){ const g=this.spawnCurrencyDrop?.(t.x+(i?40:-40),t.y,'berryjam'); if(g&&typeof g==='object'){ g.forgeQuantity=1; this.lootHold?.(g,1900); } } this.showBanner?.('✨ Golden tree!','Extra Sugar and Berry Jam',1100); this.vfxHitRing?.(t.x,t.y,0xffd166,true); }
      else if(t.kind==='hive'){ this.showBanner?.('🐝 A beehive!','Angry bees — the honey is yours',1100); for(let k=0;k<ST_HIVE;k++){ const m=this.sigSpawnAt(t.x+(Math.random()-.5)*120,t.y+(Math.random()-.5)*90,false,'fast'); if(m){ m.setTint?.(0xffd34d); m.tintColor=0xffd34d; m._xpMul=.5; this.artFollow?.(m,'st87_bee',44); } } const g=this.spawnCurrencyDrop?.(t.x,t.y+10,'honeydrop'); if(g&&typeof g==='object'){ g.forgeQuantity=1; this.lootHold?.(g,1900); } }
      else if(t.kind==='mimic'){ const e=this.sigSpawnAt(t.x,t.y,si>=5,si>=5?undefined:'tank'); t.t.setVisible?.(false); this.showBanner?.('🌳 It was a monster!','Beat the tree mimic for a Gear box',1200); this.screenShake?.(220,.008); if(e){ e._stMimic=true; e.setScale?.((e.scaleX||1)*1.4); e.setTint?.(0x7fbf5a); e.tintColor=0x7fbf5a; if(e.maxhp){ e.maxhp*=1.5; e.hp=e.maxhp; } } } }
    finally{ this._lootAt=L0; } }
  stMimicDown(e){ this._lootMinRare=true; try{ const g=this.spawnLoot?.(e.x,e.y-20,(this.stageIndex>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1900); }finally{ this._lootMinRare=false; } this.floatText?.(e.x,e.y-60,'🌳 Mimic down!',0x9cff6b); }
  sigOnKill(e){ if(this._stack&&!this._stackSwap&&!this._stack.o.done)this.stackRun(()=>this.sigOnKill(e));   // v8.2.21 แจ้งภารกิจเสริมด้วย
    const o=this.waveObjective,S=this._sig; if(e?._breach)this.breachFoeDeath?.(e); this.artFollowDeath?.(e); if(e&&e._stMimic){ e._stMimic=false; this.stMimicDown(e); return; } if(e&&e._hhPow){ e._hhPow=false; const mut=e._hhMut; e._hhMut=null; e._hhShell=0; if(o&&!o.done&&S&&o.type==='hungerHerald'){ S.powKills=(S.powKills||0)+1; this.floatText?.(e.x,e.y-50,mut?'💜 +2':'💜 +1',0xc9a6ff); if(mut){ S.mutKills=(S.mutKills||0)+1; this.hhMutDeath(e,mut,S); } } } if(e&&e._hhMin){ e._hhMin=null; e._goTo=null; } if(e&&e._crSplit){ e._crSplit=false; if(o&&!o.done&&S&&o.type==='creepingRoots')this.crSplit(e,e._lanePath,e._laneI); } if(e&&e._srSplit){ e._srSplit=false; if(o&&!o.done&&S&&o.type==='seedRift'&&e._seedCarrier===S.tag)this.srSplit(e,S); } if(e&&e._fpTok&&this.fpOnKill(e,o,S))return; if(e&&e._lanePath){ e._lanePath=null; e._goTo=null; } if(o&&!o.done&&S&&o.type==='hungersMouth'){ this.hmOnKill(e,o,S); return; } if(e&&e._breach){ e._breach=false; e._hmLord=false; if(o&&!o.done&&S&&o.type==='hungerDomain'&&Math.random()<.35){ this.hmSplinters?.(1); S.sp=(S.sp|0)+1; } } if(o&&!o.done&&S&&o.type==='hungerSiege'){ this.hsOnKill(e,o,S); return; } if(e&&e._hdLord){ e._hdLord=false; if(o&&!o.done&&S&&o.type==='hungerDomain')this.hdDown(e,o,S); return; } if(e&&e._herald){ e._herald=false; e._goTo=null; return; } if(o&&!o.done&&S&&o.type==='grandmasPot'){ this.gpOnKill(e,o,S); return; } if(e&&(e._ggPart||e._golem)){ const part=e._ggPart,gol=e._golem; e._ggPart=null; e._golem=false; if(o&&!o.done&&S&&o.type==='grandmasGolem'){ if(gol)this.ggDown(e,o,S); else this.ggDropPart(S,e,part); } return; } if(o&&!o.done&&S&&(o.type==='ultimatum'||o.type==='vaultAltar')&&S.phase==='fight'&&S.goal==='slay'&&e&&!e.isBoss){ o.progress=Math.min(o.target,o.progress+(e.isElite?2:1)); return; } if(!o||o.done||!S||o.type!=='seedRift'||!e||e.isBoss)return; if(e._seedCarrier!==S.tag)return; const w=e._srWorth||1; e._srWorth=0; e._seedCarrier=null; e._goTo=null; o.progress=Math.min(o.target,o.progress+w); this.floatText?.(e.x,e.y-50,w>1?'🌰 Armored carrier ×'+w+'!':'🌰 Caught!',0x9cff6b); if(o.progress>=o.target)this.time?.delayedCall?.(0,()=>{ if(this.waveObjective===o&&!o.done)this.completeWaveObjective(); }); }
  /* v8.1.77 เจ้าของ: Survive มีอะไรให้ทำ → กล่องเสบียงตก 2 ครั้ง (30% / 65% ของเวลา) วิ่งไปเก็บ Sugar (+หัวใจบางครั้ง) */
  surviveSupply(o){ if(this._inTutorial||this.recipeMode||!this.player||!this.loots)return; const at=[.3,.65],k=o._sup||0; if(k>=at.length||o.progress<o.target*at[k])return; o._sup=k+1;
    const P=this.objectivePosition(0,1,150,240),gift=this.artSpr('msn71_supply_crate',P.x,P.y-320,80,0,{sig:false,depth:P.y+6})||this.camWorld(this.add.image(P.x,P.y-320,'gift').setScale(.8).setDepth(P.y+6)),sh=this.camWorld(this.add.ellipse(P.x,P.y+10,16,6,0x000000,.35).setDepth(P.y-1));
    this.showBanner?.('📦 Supply drop!','Grab it before the swarm does',1400); Sfx.orderCue?.('quest_focus',.3,.5);
    this.tweens.add({targets:sh,width:60,height:20,duration:650,ease:'Quad.in'});
    this.tweens.add({targets:gift,y:P.y,duration:650,ease:'Quad.in',onComplete:()=>{ gift.destroy(); sh.destroy(); if(this.state!=='play'||this.waveObjective!==o)return; this.burst?.(P.x,P.y,0xffd166); this.screenShake?.(90,.004);
      const su=Math.round(3+(this.stageIndex||0)*1.2); this.sugarStage+=su; this.sugarRun+=su; const L0=this._lootAt; this._lootAt={x:P.x,y:P.y}; try{ this.missionLootBurst?.({type:'supply',noCur:true,noHold:true},su); }finally{ this._lootAt=L0; } if(Math.random()<.5)this.dropHeal?.(P.x+30,P.y-10,'mini'); }}); }
  tickWaveObjective(dt){ this.artFollowTick?.();
    { const o0=this.waveObjective; if(o0&&!o0.done&&o0._armPad&&this.missionArmTick?.(o0,dt))return; }
    this.objBonusTick?.(dt);
    const o=this.waveObjective;if(!o||o.done)return;
    this.ensureHuntTarget?.();
    this.tickWaveEvent(dt);
    // v4.87.1: กันปั๊มเลเวล — ภารกิจไม่มี timer (hunt/purge/capture) ถ้าลากนานเกิน มอนธรรมดาหยุดให้ EXP + เป้า Hunt เลิกวาร์ปหนี
    if(['hunt','purge','capture'].includes(o.type)&&!o._overtime){ o._objT=(o._objT||0)+dt; const lim=o.type==='hunt'?25*o.target+20:o.type==='purge'?30*o.target+20:Math.round(o.target*1.6+25); if(o._objT>=lim){ o._overtime=true; this.showBanner(this.usesStoryBudget?.()?'Find the objective':'⏰ Overtime!',this.usesStoryBudget?.()?'Follow the marker — progress and EXP are preserved':'Enemies no longer drop EXP — finish the objective!',1800); } }
    let huntD=Infinity;
    this.enemies.children.iterate(e=>{if(e&&e.active&&e._waveObjectiveTarget){
      // 🎯 Hunt: เป้าหมายวาร์ปหนีเมื่อเข้าใกล้ + ทิ้งกับดักไว้ที่เดิม
      if(o.type==='hunt'){const lim=WORLD/2-120;e.setPosition(Phaser.Math.Clamp(e.x,-lim,lim),Phaser.Math.Clamp(e.y,-lim,lim));const dd=this.dist(this.player.x,this.player.y,e.x,e.y);if(dd<huntD)huntD=dd;e._huntFlee=!o._overtime&&e._hnPh==='flee'&&Math.abs(e.x)<lim-8&&Math.abs(e.y)<lim-8;}   // v8.2.22 เจ้าของ: หนีเฉพาะหลังปาของใส่ (เดิมหนีเมื่อเข้าใกล้)
      if(o.type==='hunt'&&!o._overtime)this.huntThrowAI(e,dt);   // v8.2.22 เจ้าของ: ตัวพิเศษเดินมาปาของใส่แล้วหนี (แทนวาร์ปหนี + พิษตามเวลา)
      if(e._objectiveMark)e._objectiveMark.setPosition(e.x,e.y-72).setDepth(e.y+8);if(e._objectiveAura)e._objectiveAura.setPosition(e.x,e.y).setDepth(e.y-1);}});
    if(o.type==='hunt'&&o._huntPhase!=='clear')this.tickHuntCurse(dt,huntD);else if(o._huntPhase==='clear')this.endHuntCurse();
    if(o.type==='survive'){o.progress=Phaser.Math.Clamp(o.target-Math.max(0,this.waveTimer),0,o.target);this.surviveSupply?.(o);if(!o._rubyTimer&&o.target>=20&&this.waveTimer>0&&this.waveTimer<=10){o._rubyTimer=true;this.rubyVoiceReact?.('timer');}}
    else if(o.type==='purge'){
      this.tickPurifyWisp(dt);
    }
    else if(o.type==='cleanAir'){
      this.tickCleanAir(dt);if(!this.waveObjective)return;
    }
    else if(o.type==='breakRoots'&&this._lure){ this.tickCrownRoot(dt,o); if(!this.waveObjective)return; }
    else if(o.type==='defendNectar'){
      this.tickNectarGarden(dt);if(!this.waveObjective)return;
    }
    else if(o.type==='seasonCycle'){
      this.tickSeasonObjective(dt);if(!this.waveObjective)return;
    }
    else if((typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(o.type))){
      this.sigTick(dt,o);if(!this.waveObjective)return;
    }
    else if(o.type==='capture'&&this._crack){this.tickHungerCrack(dt,o);if(!this.waveObjective)return;}
    else if(o.type==='capture'&&this._captureZone){const inside=this.dist(this.player.x,this.player.y,this._captureZone.x,this._captureZone.y)<=this._captureZone.radiusGoal;
      o.progress=Phaser.Math.Clamp(o.progress+(inside?dt:0),0,o.target);this._captureZone.setFillStyle(o.color,inside?0.24:0.10);this.tickCaptureFX(dt,inside,o);this.captureBleed?.(dt,inside,o);if(!this.waveObjective)return;if(o.progress>=o.target){this.captureDoneFX();this.completeWaveObjective();return;}}   // v5.21: ยืนในวง 25 วิจริง (ไม่มีโบนัสฆ่าแล้ว)
    if(o.type!=='purge'&&o.type!=='defendNectar'&&o.type!=='seasonCycle'&&!(typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(o.type))&&this.objNodeG)this.objNodeG.clear();   // Nectar draws its flower HP bars into the same graphics layer.
    this.renderWaveObjectiveHUD();
  }
  renderWaveObjectiveHUD(){
    const o=this.waveObjective;if(!o||o.done){for(const q of [this.waveObjTxt,this.waveObjBg,this.waveObjBar])if(q)q.setVisible(false);this.syncSeasonIcons?.(null);return;}
    const frac=Phaser.Math.Clamp(o.progress/Math.max(1,o.target),0,1),value=o._v2?Math.floor(o.progress)+' / '+o.target+' 🌟':(o.type==='capture'&&this._crack)?this.hungerCrackGlyph(frac):o.type==='survive'?Math.ceil(Math.max(0,this.waveTimer))+'s':(o.type==='capture'||o.type==='cleanAir'||o.type==='defendNectar'||o.type==='lastLight'||o._ultSec)?o.progress.toFixed(1)+' / '+o.target+'s':(o.type==='seasonCycle'?this.stormHudText(o,this.realTex?.('ui_c24_season_icons')):Math.floor(o.progress)+' / '+o.target);
    const step=o._huntPhase?'Step '+(o.progress*2+(o._huntPhase==='clear'?1:2))+'/'+(o.target*2)+' · '+(o._huntPhase==='clear'?'Clear '+o._huntKills+'/'+o._huntKillGoal:'Defeat marked Elite'):(o.type==='fill'&&this.usesStoryBudget?.()?'Step 1/2 · Defeat '+Math.floor(o.progress)+'/'+o.target:null);
    const bw=Math.min(230,this.W-84);this.waveObjTxt.setText((step||(o.type==='seasonCycle'?value:(o.emoji+' '+o.name+' · '+value)))+(this.objBonusTag?.(o)||'')).setVisible(true).setColor('#'+o.color.toString(16).padStart(6,'0'));this.waveObjBg.setVisible(true);this.waveObjBar.setVisible(true).setFillStyle(o.color);this.waveObjBar.width=Math.max(2,bw*(o._huntPhase?(o.progress*2+(o._huntPhase==='elite'?1:o._huntKills/o._huntKillGoal))/(o.target*2):(o.type==='fill'&&this.usesStoryBudget?.()?frac/2:frac)));
    this.syncSeasonIcons?.(o);
    const now=Date.now(); if(!this._objPulseAt)this._objPulseAt=now; if(now-this._objPulseAt>12000){ this._objPulseAt=now; this.tweens.add({targets:this.waveObjTxt,scale:{from:1.04,to:1},duration:450,ease:'Back.out'}); const wo=this.waveObjective; if(wo&&!wo.done&&!this._ruby&&(now-(this._rubyRemAt||0)>24000)){ this._rubyRemAt=now; const tp=RUBY_TIPS[wo._huntPhase?'huntClear':wo.type]; if(tp&&tp.short&&this.rubySay)this.rubySay(tp.short+(wo.target&&wo.type!=='seasonCycle'?'  ·  '+Math.floor(wo.progress)+'/'+wo.target:''),2600,{face:'cheer'}); else if(!this._speech)this.showSpeechBubble(wo.emoji+' '+wo.name+' · '+(wo.target?Math.floor(wo.progress)+'/'+wo.target:''),2400); } }   // v5.71 เตือนภารกิจทุก 12 วิ
  }
  /* v7.8.32 ไอคอนฤดู (อาร์ต A10) หน้าข้อความภารกิจ Season Storm: แถวบน=ยังไม่ผ่าน 0–3 · ผ่านแล้ว 4–7 */
  syncSeasonIcons(o){const T=this.waveObjTxt;if(!T)return;const on=!!(o&&o.type==='seasonCycle'&&o.storm&&T.visible&&this.realTex?.('ui_c24_season_icons'));
    if(!on){if(this._seasonIcons)for(const i of this._seasonIcons)i.setVisible(false);if(this._seasonIconsOn){this._seasonIconsOn=false;T.setOrigin(.5,0).setX(this.W/2).setFontSize(12).setWordWrapWidth(this.W-54);}return;}
    if(!this._seasonIcons?.every(i=>i.active))this._seasonIcons=[0,1,2,3].map(()=>{const i=this.add.image(0,0,'ui_c24_season_icons',0).setScrollFactor(1).setDepth(54);this.camUI(i);return i;});
    const sz=16,gap=2,iw=4*sz+3*gap;T.setFontSize(11).setWordWrapWidth(this.W-54-iw-6);const total=iw+6+T.width,x0=this.W/2-total/2,cy=T.y+T.height/2;this._seasonIconsOn=true;T.setOrigin(0,0).setX(x0+iw+6);
    this._seasonIcons.forEach((im,k)=>{const cur=o.storm.cur&&o.storm.cur.idx===k&&!o.storm.passed[k];im.setTexture('ui_c24_season_icons',o.storm.passed[k]?4+k:k).setDisplaySize(cur?sz+4:sz,cur?sz+4:sz).setPosition(x0+sz/2+k*(sz+gap),cy).setVisible(true);});}
  /* v8.1.50 เจ้าของ: เป้ารองต่อภารกิจ (แบบ Deep Rock) · ทำได้ = EXP +50% ของรางวัลคลื่น + Sugar +50% · ไม่มีในบทสอน/Fill */
  objBonusInit(o,planned){ const B={survive:['Take 5 hits or fewer','hits',5],hunt:['Catch them before Overtime','overtime'],purge:['Keep the Wisp lit','wisp'],capture:['Never bleed outside the ring','bleed'],cleanAir:['Stay in clean air (3s outside max)','out',3],defendNectar:['Don’t lose a flower','flower'],seasonCycle:['Take 8 hits or fewer','hits',8],breakRoots:['Take 6 hits or fewer','hits',6],seedRift:['Never let the rift close','rift'],shakeTrees:['Take 6 hits or fewer','hits',6],mirrorPath:['Take 6 hits or fewer','hits',6],vaultAltar:['Take 8 hits or fewer','hits',8],ultimatum:['Take 12 hits or fewer','hits',12],lastLight:['Keep all 3 lanterns lit','lantern'],frozenPantry:['Take 6 hits or fewer','hits',6],hungersMouth:['Take 6 hits or fewer','hits',6],creepingRoots:['Don’t lose the flower','flower'],hungerHerald:['Take 6 hits or fewer','hits',6],grandmasPot:['Take 8 hits or fewer','hits',8],grandmasGolem:['Take 8 hits or fewer','hits',8],hungerSiege:['Take 10 hits or fewer','hits',10],hungerDomain:['Take 12 hits or fewer','hits',12]}[o.type];
    if(!B||planned||this._inTutorial||this.recipeMode||this.riftMode){o.bonus=null;return;} o.bonus={label:B[0],kind:B[1],lim:B[2]||0,n:0,ok:true}; this.time?.delayedCall?.(6600,()=>{ if(this.waveObjective===o&&o.bonus?.ok)this.floatText?.(this.player.x,this.player.y-90,'⭐ Bonus: '+o.bonus.label,0xffe08a); }); }
  objBonusFail(){ const b=this.waveObjective?.bonus; if(!b||!b.ok||this.waveObjective.done)return; b.ok=false; Sfx.orderCue?.('out_of_zone',.18,.8); this.floatText?.(this.player.x,this.player.y-80,'☆ Bonus lost',0xb8a8c8); }
  objBonusHit(){ const b=this.waveObjective?.bonus; if(!b||!b.ok||b.kind!=='hits')return; b.n++; if(b.n>b.lim)this.objBonusFail(); }
  objBonusTick(dt){ const o=this.waveObjective,b=o?.bonus; if(!b||!b.ok||o.done)return;
    if(b.kind==='overtime'&&o._overtime)this.objBonusFail();
    else if(b.kind==='bleed'){ const z=this._captureZone; if(z&&this.dist(this.player.x,this.player.y,z.x,z.y)<=(z.radiusGoal||z.radius||110))b._in=true; if(b._in&&(o._bleedStk||0)>0)this.objBonusFail(); }   /* v8.1.67 นับหลังเข้าวงครั้งแรก (เดิมเสียโบนัสตอนเดินไปหาวง) */
    else if(b.kind==='wisp'&&this._wisp&&(this._wisp._light??1)<=0)this.objBonusFail();
    else if(b.kind==='wisp'&&!this._wisp&&o.progress<o.target&&b._seen)this.objBonusFail();
    else if(b.kind==='out'&&this._cleanAir){ const c=this._cleanAir; if(this.dist(this.player.x,this.player.y,c.x,c.y)<=c.r)b._in=true; else if(b._in){ b.n+=dt; if(b.n>b.lim)this.objBonusFail(); } }
    if(b.kind==='wisp'&&this._wisp)b._seen=true; }
  objBonusTag(o){ const b=o?.bonus; if(!b)return ''; return b.ok?(b.kind==='hits'?' · ⭐ '+Math.max(0,b.lim-b.n):' · ⭐'):' · ☆'; }
  objBonusPay(o,sugar){ const b=o?.bonus; if(!b||!b.ok)return 0; const extra=Math.round(sugar*.5); this.sugarStage+=extra; this.sugarRun+=extra;
    const sb=this._storyBudget,xp=Math.round(((sb&&sb.reward)||20)*.5); if(xp>0)this.gainXp(xp); this.floatText?.(this.player.x,this.player.y-96,'⭐ Bonus · EXP +'+xp,0xffe08a); return extra; }
  /* v8.1.51 เจ้าของ: ภารกิจเสร็จ = ของทะลักออกจากจุดภารกิจ (แบบ POE) · Sugar เป็นก้อนให้เดินเก็บ · ⭐ = กล่องอุปกรณ์ขั้นต่ำ Rare · 6 วิแล้วดูดเข้าตัวเอง */
  missionPoint(o){ if(this._lootAt)return this._lootAt; const z=this._crack?.tip||this._captureZone||this._cleanAir; if(z&&z.x!=null)return {x:z.x,y:z.y}; const w=this._wisp; if(w?.active)return {x:w.x,y:w.y}; return {x:this.player.x,y:this.player.y}; }
  lootHold(g,ms){ if(!g)return g; g._holdUntil=(this.time?.now||0)+(ms||1800); g._mag=false; g._vac=false; return g; }
  /* v8.1.75 เจ้าของ: มินิบอส/บอสดรอปเยอะขึ้น · มินิ = น้ำพุ Sugar + กล่องการันตี (ขั้นต่ำ Rare) ค้างให้เห็นแล้วดูดเข้าตัว · บอส = กล่องเพิ่มเข้ารางวัลจบด่าน (ด่านปิดบท +1) + Sugar โบนัส */
  bigFoeLoot(x,y,kind){ if(this._inTutorial||!this.loots)return null; const si=this.stageIndex||0,ch=Math.min(2,Math.floor(si/5)),end=si%5===4,rw=this.diffMul?.().reward||1;   /* v8.1.76 เจ้าของ: ด่านแรกไม่ต้องเยอะ (ของเฟ้อ) → ไล่ตาม Chapter */
    if(kind==='mini'){ const sugar=Math.round([4+si,8+si*2,10+si*3][ch]*rw); this.sugarStage+=sugar; this.sugarRun+=sugar; const o={type:'mini'},P0=this._lootAt; this._lootAt={x,y}; let out=[]; try{ out=this.missionLootBurst(o,sugar)||[]; }finally{ this._lootAt=P0; }
      const boxes=ch===0?(Math.random()<.3?1:0):ch===1?1:(Math.random()<.3?2:1); this._lootMinRare=ch===2; let gn=0; try{ for(let k=0;k<boxes;k++){ const a=Math.random()*Math.PI*2,g=this.spawnLoot(x+Math.cos(a)*64,y+Math.sin(a)*48,ch===0?1:2); if(g){ this.lootHold(g,1900); gn++; } } } finally{ this._lootMinRare=false; }
      const cur=out.filter(g=>g&&g.dropType&&g.dropType!=='sugar').length; this.time?.delayedCall?.(700,()=>{ if(this.state==='play')this.showBanner?.('🎁 Miniboss loot','🍬 +'+sugar+' Sugar'+(gn?' · 🎁 '+gn+' gear':'')+(cur?' · ✨ crafting':''),2000); });   /* v8.1.144 owner 🐞: say what dropped while it is on screen */ return out; }
    if(kind==='boss'){ if(!this._runBoxes)this._runBoxes=[]; const n=[end?1:0,end?2:1,end?3:2][ch],epic=Math.min(.6,.12+si*.03); for(let k=0;k<n;k++)this._runBoxes.push(ch===0?'rare':Math.random()<epic?'epic':'rare'); const sugar=Math.round([8+si*2,15+si*4,25+si*6][ch]*rw); this.sugarStage+=sugar; this.sugarRun+=sugar; this._bossLoot={boxes:n,sugar}; return this._bossLoot; }
    return null; }
  /* v8.2.27 เจ้าของ (SCAMPER): จบภารกิจให้สะใจ = จอหยุดชั่วครู่ + แสงทอง + วงแหวน · ของรางวัลพุ่งเข้าตัวเอง (missionLootBurst) · Ruby/แฟนแฟร์ใช้ของเดิม */
  missionJuice(o){ if(!this.player||this.state==='menu')return; this.a12?.('a18_mission_impact',.45,.3); try{ this.hitStop?.(typeof MISSION_JUICE_STOP!=='undefined'?MISSION_JUICE_STOP:90); }catch(e){} this.screenFlash?.(0xffe08a,.16,200); this.screenShake?.(140,.004); const P=this.missionPoint?.(o)||this.player; this.vfxHitRing?.(P.x,P.y,0xffd166,true); }
  /* v8.2.27 Double Clear: ภารกิจหลัก + ภารกิจเสริมสำเร็จในเวฟเดียวกัน → กล่องของ 1 ชิ้น + Sugar เพิ่ม */
  doubleClearMark(kind){ const w=this.waveIndex||0,si=this.stageIndex||0; let D=this._dblClear; if(!D||D.w!==w||D.si!==si)D=this._dblClear={w,si,main:false,side:false,paid:false}; D[kind]=true; if(!D.main||!D.side||D.paid||!this.player)return false; D.paid=true; this.maEarn?.(1);
    const P=this.player,su=Math.round(8+(si+1)*2+w*2); this.sugarStage+=su; this.sugarRun+=su; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);
    this._lootMinRare=true; try{ const g=this.spawnLoot?.(P.x+40,P.y-50,(si>=10||this.endgameDropActive?.())?2:1); if(g)this.lootHold?.(g,1400); }finally{ this._lootMinRare=false; }
    this.time?.delayedCall?.(900,()=>{ if(this.state==='menu')return; this.showBanner?.('✨ DOUBLE CLEAR!','Main + side mission in one wave · Gear box · Sugar +'+su,1900); (this.a12?.('a18_double_clear',.5,.3))||Sfx.orderCue?.('mission_bonus_get',.5,.3); this.screenFlash?.(0x9fe8ff,.18,220); if(this.player)this.artFx?.('ev90_double_clear',this.player.x,this.player.y,260); this.rubyVoiceReact?.('double',300); }); return true; }
  missionLootBurst(o,sugar){ if(!this.loots||!this.player)return []; const P=this.missionPoint(o),out=[],n=Math.max(4,Math.min(6,Math.round(sugar/8)||4)); sugar=Math.max(0,Math.round(sugar||0));
    if(sugar>0){ this.sugarStage-=sugar; this.sugarRun-=sugar; let left=sugar; for(let i=0;i<n;i++){ const v=i===n-1?left:Math.floor(sugar/n); left-=v; let g=this.loots.getFirstDead(false); const tex=this.textures?.exists?.('ic_sugar')?'ic_sugar':'gift'; if(!g)g=this.loots.create(P.x,P.y,tex); else { g.setActive(true).setVisible(true); if(g.body)g.body.enable=true; g.setPosition(P.x,P.y); } if(!g){ this.sugarStage+=v; this.sugarRun+=v; continue; }
      g.setTexture(tex).clearTint().setAlpha(1); g.setScale(22/Math.max(1,g.width||36)); g.dropType='sugar'; g.sugarVal=v; g.curKey=null; g.lootTier=null; g.forgeExtra=false; g._mag=false; g._holdUntil=(this.time?.now||0)+(typeof MISSION_PULL_MS!=='undefined'?MISSION_PULL_MS:600); g._vac=false; if(g.body)g.body.setAllowGravity?.(false); this.camWorld(g); out.push(g); } }   /* v8.2.27 พุ่งเข้าตัวหลัง 0.6 วิ */
    const ck=o?.noCur?null:typeof forgeCurrency==='function'?forgeCurrency(this.currencyTierFor?.(),this._forgeLoot):null; if(ck){ const cg=this.spawnCurrencyDrop(P.x,P.y,ck); if(cg&&typeof cg==='object')out.push(cg); } 
    if(o?.bonus?.ok){ this._lootMinRare=true; try{ const ga=Math.random()*Math.PI*2; const lg=this.spawnLoot(P.x+Math.cos(ga)*70,P.y+Math.sin(ga)*56,(this.stageIndex>=10||this.endgameDropActive?.())?2:1); if(lg)this.lootHold(lg,1900); } finally { this._lootMinRare=false; } }   /* v8.1.67 กล่องเกิดที่จุดตกเลย (เดิมวงแสง/ลำแสงค้างที่จุดกลาง) */
    if(!o?.noHold)out.forEach(g=>this.lootHold(g,1900));   /* v8.1.75 เจ้าของ: ของภารกิจค้างให้เห็นก่อน ~1.9 วิ แล้วดูดเข้าตัวพร้อมกันทั้งหมด */
    out.forEach((g,i)=>{ if(g.dropType!=='sugar')return; const a=i/out.length*Math.PI*2+Math.random()*.5,d=50+Math.random()*60; this.tweens.killTweensOf(g); g.setPosition(P.x,P.y); this.tweens.add({targets:g,x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d*.8,duration:420,ease:'Quad.out',onUpdate:()=>g.body?.reset?.(g.x,g.y)}); });
    this.time?.delayedCall?.(6000,()=>out.forEach(g=>{ if(g.active)g._mag=true; })); this.vfxHitRing?.(P.x,P.y,0xffd166,true); if(typeof Sfx!=='undefined')Sfx.orderCue?.('mission_loot_burst',.45,.3); return out; }
  completeWaveObjective(){
    if(this._stackSwap)return this.stackComplete();
    if(this.waveObjective&&!this.waveObjective.done&&this.waveObjective.type!=='fill')this.missionMusicEnd?.(true);   // v8.2.21 ภารกิจเสริม (ซ้อน) จบ → ไม่ปิดเวฟ
    const o=this.waveObjective;if(!o||o.done)return;if(o.type==='defendNectar')this.a23Cue?.('event_defend_nectar_complete',.34,1);this.rubyVoiceReact?.('objdone',300);Sfx.orderCue?.('mission_tube_pop',.4,.5);
    if(!this.recipeMode&&o.type!=='fill')(typeof DailyQ!=='undefined')&&!this._inTutorial&&DailyQ.tick('objective'); this._liqPop=this.time?.now||0;   // v8.0.14 หลอดน้ำกระเพื่อม + เปล่งแสงตอนสำเร็จ
    if(o.type!=='fill'||!this.usesStoryBudget?.())this.rubySay?.('We did it! Another little piece of [flavor] is safe. Nice work!',2400,{face:'happy'});
    if(o.type==='hunt'&&o._huntPhase!=='clear')Sfx.rewardCue?.('sfx_event_hunt_threat_complete',.65);
    if(o.type==='fill'&&this.usesStoryBudget?.()){o.type='hunt';o.name='Elite Showdown';o.emoji='🎯';o.progress=0;o.target=1;o._huntPhase='elite';o._huntSpawnAt=this.time.now;o.desc='Defeat the marked Elite to finish this mission';this.renderWaveObjectiveHUD();this.showBanner('Step 2/2: Elite Showdown',o.desc,1800);return;}
    if(this.recipeMode&&this._recipeMission){ o.done=true; const bn=Math.round((20+((this._amapNode&&this._amapNode.d)||1)*4)*this.diffMul().reward); this.sugarStage+=bn; this.sugarRun+=bn; this.clearWaveObjective(); this._recipeMission.done=true; this._hunger+=this.recipeHungerGoal()*MISSION_HUNGER; this.showBanner('✅ Mission complete · Sugar +'+bn+' · Hunger +'+Math.round(MISSION_HUNGER*100)+'%',this._hunger>=this.recipeHungerGoal()?'The boss is coming':'Fill the Hunger Meter to call the boss',2000); if(!['capture','hunt','purge'].includes(o.type))Sfx.clear(); return; }
    if(this._replayMeter&&this._replayMission&&this._replayMission.o===o){ o.done=true; const m=this._replayMeter,bn=Math.round((10+this.stageIndex*3)*(this.diffMul?.().reward||1)); this.sugarStage+=bn; this.sugarRun+=bn; const _rb=this.objBonusPay?.(o,bn)||0; this.missionLootBurst?.(o,bn+_rb); const _rw=this.missionRewardGive?.(o); m.kills=Math.min(m.goal,m.kills+m.goal*.08); this.clearWaveObjective(); this._replayMission=null; m.nextBounty=m.time+50+Math.random()*20; if(!this.missionStamp?.(o,'⭐ BOUNTY COMPLETE','Sugar +'+(bn+_rb)+' · Stage progress +8%',_rw&&_rw.txt))this.showBanner('⭐ Bounty complete · Sugar +'+(bn+_rb),'Stage progress +8%',1800); if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun); return; }   /* v8.1.75 Bounty ตอนเล่นซ้ำ */
    o.done=true;const zoneObj=['purge','capture','cleanAir','breakRoots','defendNectar',...(typeof SIG_MISSIONS!=='undefined'?SIG_MISSIONS:[])].includes(o.type),bonus=Math.round((6+(this.stageIndex+1)*2+this.waveIndex*2)*(zoneObj?1.5:1)*(o._altarMul||1)*(o._ocMul||1)*(o._gold?GOLD_WAVE_MUL:1)*(this.rpMsnRw?.(o.type)||1)*(this.maPay?.(o)||1));this.sugarStage+=bonus;this.sugarRun+=bonus;const _ob=this.objBonusPay?.(o,bonus)||0;if(_ob)Sfx.orderCue?.('mission_bonus_get',.5,.3);if(!this._inTutorial)this.missionLootBurst?.(o,bonus+_ob);if(!this._inTutorial&&typeof LEAGUE_MISSIONS!=='undefined'&&LEAGUE_MISSIONS.includes(o.type))this.leagueCurrencyDrop?.(o);   /* v8.0.18 เจ้าของ: ภารกิจคุ้มกัน/ยืนในวงได้ Sugar ×1.5 + ฟื้น HP 20% */ if(zoneObj&&this.player){const P=this.player,h=Math.round(P.maxhp*.2);P.hp=Math.min(P.maxhp,P.hp+h);this.floatText?.(P.x,P.y-70,'+'+h+' ❤️',0x6dffb4);}if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);
    if(!this._inTutorial){ this.missionJuice?.(o); this.doubleClearMark?.('main'); this.maEarn?.((1+(_ob?1:0))*(o._gold?2:1)); }
    const _rw=this._inTutorial?null:this.missionRewardGive?.(o),title=(_ob?'⭐ Bonus! · ':'✅ Objective Complete · ')+'Sugar +'+(bonus+_ob)+(zoneObj?' · ❤️ +20%':'');this.clearWaveObjective();const _wrap=!!this._waveTimed&&this.waveTimer>WAVE_WRAP;this._waveTimed=false;if(_wrap){this.rubyVoiceReact?.('early',900);const _sk=this._stack,_left=this.waveTimer;this.waveTimer=WAVE_WRAP;if(_sk&&!_sk.o.done)this.waveTimer=Math.max(WAVE_WRAP,Math.min(_sk.T,_left));}   /* v8.2.21 ภารกิจเสริมยังทำอยู่ → เวฟรอจนภารกิจเสริมหมดเวลา */else{this.mode='waveclear';this.waveTimer=0;if(this.usesStoryBudget?.()){this.clearFoes();this.clearEnemies();this.settleStoryBudget(true);}}{ const sub=_wrap?'Done early! The wave ends in '+WAVE_WRAP+'s':this.usesStoryBudget?.()?'Earned EXP collected + objective reward — choose upgrades':'Clear the remaining enemies to advance'; if(!this.missionStamp?.(o,_ob?'⭐ BONUS CLEAR!':'✅ MISSION COMPLETE','Sugar +'+(bonus+_ob)+(zoneObj?' · ❤️ +20%':'')+'\n'+sub,_rw&&_rw.txt))this.showBanner(title,sub,1500); }if(!['capture','hunt','purge'].includes(o.type))Sfx.clear();
  }
  clearWaveObjective(){if(!this._stackSwap)this.missionMusicEnd?.(false);this.artFollowClear?.();this.sigClear?.();{ const o=this.waveObjective; if(o){ this.missionArmClear?.(o); if(o._oc){ for(const q of o._oc.objs||[]){ this.tweens?.killTweensOf?.(q); q.destroy?.(); } o._oc=null; } } }Sfx.eventLoopStop?.('event_capture_charge');if(this._wispSnd){this._wispSnd=false;Sfx.eventLoopStop?.('event_wisp_purify_charge');}this._pbTarget=null;this._pbShow=0;if(this.pbFx&&this.pbFx.scene)this.pbFx.clear();if(this.replayProgressFrame)this.replayProgressFrame.setVisible(false);if(this.replayProgressFill)this.replayProgressFill.setVisible(false); if(this.endHuntCurse)this.endHuntCurse(); this._huntFar=0;
    this.clearWaveEvent();
    if(this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n)return;if(n._objectiveCue){this.tweens.killTweensOf(n._objectiveCue);if(n._objectiveCue.active)n._objectiveCue.destroy();n._objectiveCue=null;}n._waveObjectiveNode=false;n.setActive(false).setVisible(false);if(n.body)n.body.enable=false;});
    if(this.enemies)this.enemies.children.iterate(e=>{if(!e)return;this.clearObjectiveTargetFx(e);e._waveObjectiveTarget=false;e._wispRaider=false;});
    this._raidT=null;
    for(const s of this._seasonShrines||[]){for(const q of [s.zone,s.ring,s.label])if(q){this.tweens.killTweensOf(q);if(q.active)q.destroy();}}this._seasonShrines=null;
    { const st=this.waveObjective?.storm; if(st){ for(const d of st.drops||[]){ this.tweens.killTweensOf(d.img); d.img?.destroy(); } st.drops=[]; for(const sh of st.shrines||[]){ sh.ring?.destroy(); sh.t?.destroy(); } st.shrines=null; } }
    for(const b of this._cleanAir?.bub||[]){ this.tweens.killTweensOf(b.img); if(b.img.active)b.img.destroy(); }
    this.cleanAirV2Clear?.();
    this.clearHungerCrack?.();this.clearCrownRoot?.();for(const k of ['_captureZone','_captureRing','_captureFill','_captureArc','_captureSec','_cleanAirZone','_cleanAirRing','_cleanAirWisp','_cleanAirPath','_cleanAirFog','_cleanAirFogRT']){const q=this[k];if(q){this.tweens.killTweensOf(q);if(q.active)q.destroy();this[k]=null;}}this._cleanAir=null;for(const f of this._nectarFlowers||[]){for(const q of [f.sprite,f.ring,f.floor])if(q){this.tweens.killTweensOf(q);if(q.active)q.destroy();}}this._nectarFlowers=null;
    this.killPurifyWisp(false);this._wispRespawn=0;
    if(this.objNodeG)this.objNodeG.clear();
    this.waveObjective=null;for(const q of [this.waveObjTxt,this.waveObjBg,this.waveObjBar])if(q)q.setVisible(false);this.syncSeasonIcons?.(null);
  }
  // ล้างมอนธรรมดาที่ค้าง (เก็บบอส/มินิไว้) — ใช้ตอนจบเวฟ/Waitดครบเวลา
  // v5.19.1 Hunt: ถ้าไม่ไล่ตามเป้า (ห่าง >460 นาน 2.5 วิ) โดนคำสาปเลือดลดเรื่อย ๆ จนกว่าจะเข้าใกล้
  huntThrowAI(e,dt){ const p=this.player; if(!p)return; e._hnPh=e._hnPh||'approach'; e._hnT=(e._hnT??HUNT_THROW_CD)-dt; const dd=this.dist(p.x,p.y,e.x,e.y);
    if(e._hnPh==='approach'){ if(e._hnT<=0&&dd<HUNT_THROW_R){ e._hnPh='wind'; e._hnT=HUNT_WIND; e.setVelocity?.(0,0); this.tweens?.add?.({targets:e,scaleX:(e.scaleX||1)*1.12,scaleY:(e.scaleY||1)*.9,duration:HUNT_WIND*500,yoyo:true}); this.floatText?.(e.x,e.y-60,'🧪',0xb37bff); } }
    else if(e._hnPh==='wind'){ e.setVelocity?.(0,0); if(e._hnT<=0){ const dmg=Math.round(6+(this.stageIndex||0)*1.2); if(this.huntLob)this.huntLob(e.x,e.y,p.x,p.y,dmg); else { const a=Math.atan2(p.y-e.y,p.x-e.x),b=this.foeShot?.(e.x,e.y,a,280,dmg,0x9b5bff,1.7); if(b)b._huntCurse=true; } e._hnPh='flee'; e._hnT=HUNT_FLEE; this.a12?.('a16_bottle_throw',.4,.3)||Sfx.zap?.(); }   /* v8.2.24 ใบ 87 ขวด + A16 เสียงปา */ }   // ปาขวดพิษ
    else if(e._hnPh==='flee'&&e._hnT<=0){ e._hnPh='approach'; e._hnT=HUNT_THROW_CD; } }
  /* v8.2.45 เจ้าของอนุมัติใบ 92 ชุด B: ขวดพิษโยนโค้งลงจุดที่ฮีโร่ยืนตอนปา · เป้าบนพื้นหดเข้าหากลาง (บอกเวลา) · ลอย HUNT_LOB_T วิ · ยืนในวงตอนตก = พิษ 1 ชั้น + ดาเมจเท่าเดิม · เดินออกได้ = หลบได้ · ภาพวาดด้วยโค้ด (อาร์ตใบ 92 มาแล้วค่อยสลับ) */
  feedbackSprite(key,x,y,w,h,depth,loop=false){
    if(!this.realTex?.(key)||(loop&&!this.bpAnim?.(key)))return null;
    const sprite=this.trackArtVfx(this.camWorld(this.add.sprite(x,y,key,0).setDisplaySize(w,h).setDepth(depth)));
    if(loop)sprite.play(key);
    return sprite;
  }
  huntLob(sx,sy,tx,ty,dmg){ const T=(typeof HUNT_LOB_T!=='undefined'?HUNT_LOB_T:.85)*1000,R=typeof HUNT_LOB_R!=='undefined'?HUNT_LOB_R:44,RY=R*.62,pl=this.player,ep=this._artEpoch,gone=()=>this.state!=='play'||this.player!==pl||this._artEpoch!==ep;
    const mark=this.camWorld(this.add.graphics().setDepth(-99300)),bt=this.realTex?.('hn87_poison_bottle');
    const danger=this.feedbackSprite?.('hn92_target_mark',tx,ty,R*2/.88,R*2/.88,-99299);
    const shadow=this.feedbackSprite?.('hn92_bottle_shadow',sx,sy,22,11,-99290);
    const sh=shadow?null:this.camWorld(this.add.graphics().setDepth(-99290));
    const bot=this.camWorld(bt?this.add.sprite(sx,sy,'hn87_poison_bottle',0).setScale(30/64):this.add.circle(sx,sy,8,0x9b5bff,1).setStrokeStyle(2,0xe6d0ff,1)); bot.setDepth(99000);
    if(bt&&this.bpAnim?.('hn87_poison_bottle'))bot.play?.('hn87_poison_bottle');
    const st={k:0},H=90+Math.min(120,this.dist(sx,sy,tx,ty)*.25),kill=()=>{ for(const o of [mark,danger,shadow,sh,bot])if(o?.active)o.destroy(); };
    this.tweens.add({targets:st,k:1,duration:T,ease:'Linear',onUpdate:()=>{ if(!bot.active)return; if(gone()){ kill(); return; } const k=st.k,z=H*4*k*(1-k),x=sx+(tx-sx)*k,y=sy+(ty-sy)*k;
        bot.setPosition(x,y-z).setRotation(k*Math.PI*3);
        mark.clear(); mark.fillStyle(0x9b5bff,.16+.14*k).fillEllipse(tx,ty,R*2,RY*2); mark.lineStyle(2.5,0xd9b3ff,.55+.4*k).strokeEllipse(tx,ty,R*2,RY*2); if(danger?.active)danger.setFrame(Math.min(7,Math.floor(k*8))); else mark.lineStyle(2,0xb37bff,.85).strokeEllipse(tx,ty,R*2*(1-k),RY*2*(1-k)); mark.fillStyle(0xe6d0ff,.7).fillCircle(tx,ty,2.5);
        const ss=.45+.55*k; if(shadow?.active)shadow.setPosition(x,y).setDisplaySize(22*ss,11*ss); else if(sh){sh.clear(); sh.fillStyle(0x000000,.28).fillEllipse(x,y,22*ss,10*ss);} },
      onComplete:()=>{ kill(); if(gone())return; this.huntLobLand(tx,ty,R,RY,dmg); }}); }
  huntLobLand(x,y,R,RY,dmg){ const p=this.player; this.artFx?.('hn87_poison_splash',x,y,90)||this.burst?.(x,y,0x9b5bff); this.a12?.('a16_bottle_shatter',.45,.2);
    let pd=this.feedbackSprite?.('hn92_poison_puddle',x,y,R*2.3,RY*3.1,-99310,true);
    if(!pd){pd=this.camWorld(this.add.graphics().setDepth(-99310)); pd.fillStyle(0x6b2fa8,.32).fillEllipse(x,y,R*2.3,RY*2.3); pd.fillStyle(0x9b5bff,.28).fillEllipse(x+R*.2,y-RY*.1,R*1.2,RY*1.1);} this.tweens.add({targets:pd,alpha:0,delay:1400,duration:600,onComplete:()=>pd.destroy()});
    if(!p?.active||this._inTutorial)return; const dx=(p.x-x)/R,dy=(p.y-y)/RY; if(dx*dx+dy*dy>1)return;
    if(this.huntTargetActive?.())this.huntCurseHit?.(); this.hurtPlayer?.(dmg,0.5); }
  huntCurseHit(){ const p=this.player; if(!p||this._inTutorial)return; this._huntStk=Math.min(HUNT_STK_MAX,(this._huntStk||0)+1);   // v8.2.22 พิษซ้อนตามจำนวนครั้งที่โดนปา (ไม่ใช่ตามเวลา) · ฆ่าตัวพิเศษ = หาย
    if(!this._huntCursed){ this._huntCursed=true; this.showBanner?.('☠️ Elite Poison','Every bottle it throws stacks more poison — defeat it to cure!',1600); Sfx.rewardCue?.('sfx_event_hunt_curse_apply',.62); }
    this.floatText?.(p.x,p.y-62,'☠️ Poison ×'+this._huntStk,0x7dff6a); }
  tickHuntCurse(dt,d){ const p=this.player;if(!p||this._inTutorial||!this.huntTargetActive()){this.endHuntCurse();return;}
    // v8.2.22 เจ้าของ: ชั้นพิษมาจากขวดที่โดนปา (huntCurseHit) ไม่เพิ่มตามเวลาแล้ว
    const stk=this._huntStk||0; if(stk<=0||!this._huntCursed)return;
    this._curseTick=(this._curseTick||0)+dt;if(this._curseTick>=0.5){this._curseTick=0;Sfx.orderCue?.('poison_tick',.12,.45);const dmg=Math.max(1,Math.round(p.maxhp*0.003*stk));p.hp-=dmg;this.floatText(p.x,p.y-46,'-'+dmg+' ☠️',0x7dff6a);
      const r=this.camWorld(this.add.circle(p.x,p.y,34,0x5adf4a,0.28).setDepth(p.depth-1));this.tweens.add({targets:r,scale:1.8,alpha:0,duration:420,onComplete:()=>r.destroy()}); if(p.hp<=0){this.die();return;}}
    p.setTint(0xa6ff8c); }
  endHuntCurse(){ this._huntPois=0;this._huntStk=0; if(!this._huntCursed)return;this._huntCursed=false;this._curseTick=0;if(this.player)this.player.clearTint(); }
  clearEnemies(){ this.enemies.children.iterate(e=>{ if(e&&e._fleeing){e._fleeing=false;this.tweens.killTweensOf(e);e.setAlpha(1);} if(e&&e.active&&!e.isBoss&&!e.isMini){ if(e._aura){e._aura.destroy();e._aura=null;} this.stopEnemyPresentation(e);e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } }); }
  // เรียกทุกเฟรม: คุมนับเวลา + เกิดมอนต่อเนื่อง
  tickJackpotEvent(dt){
    if(this.state!=='play'||this.mode!=='wave'||this._inTutorial||this.bossRush||this.boss||(this.pendingLvl||0)>0||this._jackpotEventRolled)return false;
    this._jackpotEventTime=(this._jackpotEventTime||0)+dt;if(this._jackpotEventTime<60)return false;
    this._jackpotEventRolled=true;if(Math.random()>=0.15)return false;
    this.openMysteryCards(()=>{});return true;
  }
  chapterCombatFormation(pattern,n,r){
    const points=[],add=(x,y,type='basic')=>points.push({x,y,type});
    for(let i=0;i<n;i++){
      const col=i%3-1,row=Math.floor(i/3),side=i%2?1:-1;
      if(pattern==='Ambush'){
        const a=i*TAU/n;add(Math.cos(a)*r,Math.sin(a)*r);
      }else if(pattern==='Stampede')add(r+row*58,col*61,'fast');
      else if(pattern==='Commander')add(r+(i===0?30:0),i===0?0:(i%2?1:-1)*Math.ceil(i/2)*48,i===0?'elite':'basic');
      else if(pattern==='Barrage')add(r+(i<2?0:46),(i-(n-1)/2)*58,i<2?'shooter':'basic');
      else if(pattern==='Pincer')add(side*r,(Math.floor(i/2)-(Math.ceil(n/2)-1)/2)*58,i<2?'fast':'basic');
      else if(pattern==='Hunter Pack')add(r+row*42,col*38,i===0?'dasher':'fast');
      else if(pattern==='Fortress')add(r+(i%2===0?0:72),(Math.floor(i/2)-1)*76,i%2===0?'tank':i===1?'shooter':'basic');
      else if(pattern==='Hazard Shift')add(side*r,(Math.floor(i/2)-1)*64,'fast');
      else if(pattern==='Loot Rush')add(r+(i%2)*45,(i-(n-1)/2)*56);
      else add(side*(r+Math.floor(i/2)*36),side*(Math.floor(i/2)-1)*50,i%3===0?'fast':'basic');
    }
    return points;
  }
  /* v8.3.10 เจ้าของ: ภารกิจแทรกเฉพาะที่เคยเจอ (home ≤ ด่านนี้) · ของด่านนี้มาก่อน แล้วสุ่มที่เหลือ */
  c1SideDeck(i){const own=C1_SIDE_EVENTS.filter(e=>e.home===i),past=Phaser.Utils.Array.Shuffle(C1_SIDE_EVENTS.filter(e=>e.home<i));return own.concat(past);}
  /* v8.3.10 เจ้าของ: แจกไพ่ก่อนด่าน C1 แบบใหม่ = บอกเฉย ๆ ว่าแต่ละเวฟเจออะไร (ไม่มี Reroll) · ภารกิจแทรกโผล่ในเวฟ 2 และ 4 */
  c1PreviewDeal(i){const st=STAGES[i];if(!st)return null;const deck=this._c1Combat?.deck||[],labels={},waves={},slots=[];
    const base=[{name:'Warm-up',emoji:'🌱'},{name:'Pressure',emoji:'⚔️'},null,{name:'Escalation',emoji:'🔥'},{name:'Swarm',emoji:'🌊'}];
    let k=0;for(let w=0;w<(st.waves||5);w++){if(w===st.miniAt)continue;slots.push(w);waves[w]='_c1';const ev=(w===1||w===3)?deck[k++]:null;if(ev&&this._c1Combat)(this._c1Combat.plan=this._c1Combat.plan||{})[w]=ev;labels[w]=ev?{name:ev.name,emoji:ev.icon,event:true}:(base[w]||{name:'Combat',emoji:'⚔️'});}
    return {waves,slots,lead:null,plan:true,preview:true,labels};}
  chapterCombatPhase(){
    if(this.waveIndex===0)return 'warm';
    if(this.waveIndex===1)return 'pressure';
    if(this.waveIndex===3)return this.waveTimer>C1_WAVE_SEC[3]-C1_RECOVERY_SEC?'recovery':'escalation';
    return 'swarm';
  }
  tickChapterCombat(dt){
    const d=this._c1Combat;
    if(!d)return;
    this.tickChapterCombatHazard(d,dt);
    if(d.route){
      d.route.left-=dt;
      if(d.route.left<=0)this.clearChapterCombatRoute(d);
    }
    if(d.command){
      const {leader,id,followers}=d.command;
      if(!leader.active||leader._c1SpawnId!==id)this.clearChapterCombatCommand(d);
      else for(const f of followers)if(f.enemy.active&&f.enemy._c1SpawnId===f.id){
        f.enemy.spd=this.dist(f.enemy.x,f.enemy.y,leader.x,leader.y)<240?f.speed*1.22:f.speed;
      }
    }
    for(const [foe,id] of d.loot)if(!foe.active||foe._c1SpawnId!==id)d.loot.delete(foe);
    if(d.event)this.tickChapterSideEvent(d,dt);
    if(d.nextEvent!=null&&!d.offered.has(this.waveIndex)&&!d.event&&!d.hazard&&this.waveTimer>16){
      d.nextEvent-=dt;
      const planned=d.plan?d.plan[this.waveIndex]:d.deck[0];   /* v8.3.10 เวฟตรงกับการ์ดที่แจกก่อนด่าน */
      if(d.nextEvent<=0){
        d.offered.add(this.waveIndex);
        if(planned){if(!d.plan)d.deck.shift();this.startChapterSideEvent(d,planned);}
      }
    }
    const phase=this.chapterCombatPhase();
    if(d.phase!==phase){
      d.phase=phase;
      d.patterns=[];
    }
    d.delay-=dt;
    if(d.delay>0||d.event||d.hazard||d.route||this.waveTimer<4)return;
    const room=Math.min(this.maxLive,this.storyLiveCap())-this.enemies.countActive(true);
    if(room<3){d.delay=1;return;}
    if(!d.patterns.length){
      const minimum={Commander:1,Fortress:1,'Hazard Shift':2};
      d.patterns=Phaser.Utils.Array.Shuffle(C1_COMBAT_PATTERNS[phase].filter(name=>this.stageIndex>=(minimum[name]||0)));
    }
    const available=name=>!(name==='Commander'&&d.command);
    let candidate=d.patterns.findIndex(name=>name!==d.last&&available(name));
    if(candidate<0)candidate=d.patterns.findIndex(available);
    if(candidate<0){d.patterns=[];d.delay=3;return;}
    const pattern=d.patterns.splice(candidate,1)[0];
    this.spawnChapterCombatPattern(d,pattern,room);
    d.last=pattern;
    d.delay=7+Math.random()*3;
  }
  spawnChapterCombatPattern(d,pattern,room){
    const audioPattern=pattern.toLowerCase().replace(/ /g,'_'),player=this.player,epoch=this._artEpoch;
    this.a23Cue?.('pattern_'+audioPattern+'_warning',.29,2);
    for(const [delay,action] of [[250,'arrival'],[4800,'release']])this.time?.delayedCall?.(delay,()=>{if(this.state==='play'&&this.player===player&&this._artEpoch===epoch)this.a23Cue?.('pattern_'+audioPattern+'_'+action,.18,2);});
    if(typeof VoiceActing!=='undefined'){if(pattern==='Pincer')VoiceActing.reaction?.(this,1,'ruby');else if(pattern==='Last Stand')VoiceActing.reaction?.(this,6,'ruby');else if(pattern==='Ambush'&&Math.random()<.3)VoiceActing.reaction?.(this,2,'ruby');else if(Math.random()<.2)VoiceActing.reaction?.(this,1);}
    const P=this.player,angle=Math.random()*TAU,c=Math.cos(angle),s=Math.sin(angle);
    const r=Math.max(210,Math.min(330,this.W/(this.viewZoom||1)*.66));
    const [ox,oy]=[P.x,P.y];
    const n=Math.min(room,pattern==='Last Stand'?7:pattern==='Loot Rush'?4:5);
    const points=this.chapterCombatFormation(pattern,n,r),followers=[],routes=[];
    let leader=null;
    for(const p of points){
      const dx=p.x*c-p.y*s,dy=p.x*s+p.y*c;
      const point=this.chapterVisibleSpawn(Math.atan2(dy,dx),Math.hypot(dx,dy));
      if(!point)continue;
      const enemy=p.type==='elite'?this.spawnElite(false,false,point):this.spawnEnemy(p.type,point.angle,point.distance,true);
      if(!enemy)continue;
      const id=enemy._c1SpawnId;
      if(p.type==='elite'){
        this.spawnRise(enemy,point.x,point.y,true);
        leader=enemy;
      }else if(pattern==='Commander')followers.push({enemy,id,speed:enemy.spd});
      if(pattern==='Stampede'){
        const [x,y]=inMapPt(ox-r*c-p.y*s,oy-r*s+p.y*c);
        const target={x,y};enemy._goTo=target;routes.push({enemy,id,target});
      }
      if(pattern==='Barrage'&&enemy.shooter)enemy.shootCd=2;
      if(pattern==='Loot Rush'){
        enemy.hp*=.65;enemy.maxhp=enemy.hp;
        d.loot.set(enemy,id);
      }
    }
    if(leader)d.command={leader,id:leader._c1SpawnId,followers};
    if(routes.length)d.route={left:5.8,entries:routes};
    if(pattern==='Hazard Shift')this.startChapterCombatHazard(d,angle);
    if(pattern==='Loot Rush'||pattern==='Last Stand')this.floatText?.(ox,oy-58,pattern,0xffd166);
  }
  clearChapterCombatRoute(d){
    for(const {enemy,id,target} of d.route?.entries||[]){
      if(enemy._c1SpawnId===id&&enemy._goTo===target)enemy._goTo=null;
    }
    d.route=null;
  }
  clearChapterCombatCommand(d){
    for(const f of d.command?.followers||[])if(f.enemy._c1SpawnId===f.id)f.enemy.spd=f.speed;
    d.command=null;
  }
  startChapterCombatHazard(d,angle){
    const P=this.player,c=Math.cos(angle),s=Math.sin(angle);
    const circles=[-1,1].map(k=>{
      const [x,y]=inMapPt(P.x+k*(c*150-s*104),P.y+k*(s*150+c*104));
      return {vx:-k*c*54,vy:-k*s*54,ring:this.camWorld(this.add.circle(x,y,52,0x83c9fd,.14)
        .setStrokeStyle(2,0xcaeeff,.85).setDepth(-990))};
    });
    d.hazard={left:6,cd:0,circles};
    this.floatText?.(P.x,P.y-55,'Ice drifts across the floor',0xcaeeff);
  }
  tickChapterCombatHazard(d,dt){
    const h=d.hazard;
    if(!h)return;
    h.left-=dt;h.cd-=dt;
    if(h.left<=0){this.clearChapterCombatHazard(d);return;}
    if(h.left>5)return;
    for(const {ring,vx,vy} of h.circles){
      ring.setPosition(...inMapPt(ring.x+vx*dt,ring.y+vy*dt));
      ring.setFillStyle(0x83c9fd,.28);
      if(h.cd<=0&&this.dist(this.player.x,this.player.y,ring.x,ring.y)<52){
        h.cd=1.1;this.hurtPlayer?.(4+this.stageIndex);
        if(this.state!=='play')return;
      }
    }
  }
  clearChapterCombatHazard(d){
    for(const q of d.hazard?.circles||[])q.ring.destroy();
    d.hazard=null;
  }
  startChapterSideEvent(d,def){
    const {x,y}=this.objectivePosition(0,1,95,132),active=d.event={
      def,x,y,left:20,hold:0,spawned:0,spawnDelay:.25,progress:0,targets:new Map(),visuals:[]
    };
    active.visuals.push(this.camWorld(this.add.circle(x,y,58,def.color,.10)
      .setStrokeStyle(3,def.color,.85).setDepth(-989)));
    const art=this.artSpr(def.key,x,y+22,72,0,{sig:false,depth:y+3});
    active.visuals.push(art||this.camWorld(this.add.text(x,y-12,def.icon,{fontSize:'27px',stroke:'#171321',strokeThickness:3}).setOrigin(.5).setDepth(y+4)));
    this.vfxHitRing?.(x,y,def.color,true);
    if(!this.chapterEventAudio?.(def,'open'))Sfx.orderCue?.('wave_start',.32,.25);
    if(typeof VoiceActing!=='undefined')VoiceActing.reaction?.(this,3,Math.random()<.5?'ruby':undefined);
  }
  tickChapterSideEvent(d,dt){
    const e=d.event,{def}=e;
    e.left-=dt;e.spawnDelay-=dt;
    if(e.left<=0){this.endChapterSideEvent(d,false);return;}
    if(e.spawnDelay<=0&&e.spawned<def.types.length){
      const a=e.spawned*TAU/def.types.length+.7;
      const dx=e.x+Math.cos(a)*76-this.player.x,dy=e.y+Math.sin(a)*76-this.player.y;
      const foe=this.spawnEnemy(def.types[e.spawned],Math.atan2(dy,dx),Math.max(86,Math.hypot(dx,dy)));
      if(foe){
        e.spawned++;
        if(!def.hold){
          const marker=this.camWorld(this.add.circle(foe.x,foe.y-35,4,def.color,1)
            .setStrokeStyle(2,0x171321,1).setDepth(90020));
          e.targets.set(foe,{id:foe._c1SpawnId,marker});
        }
      }
      e.spawnDelay=.45;
    }
    if(def.hold&&this.dist(this.player.x,this.player.y,e.x,e.y)<58)e.hold=Math.min(def.hold,e.hold+dt);
    if(def.hold&&e.hold>=def.hold){this.endChapterSideEvent(d,true);return;}
    for(const [foe,mark] of e.targets){
      if(foe.active&&foe._c1SpawnId===mark.id)mark.marker.setPosition(foe.x,foe.y-foe.displayHeight*.6);
      else{mark.marker.destroy();e.targets.delete(foe);}
    }
    const goal=def.hold||def.types.length,progress=def.hold?e.hold:e.progress;
    const count=def.hold?'Hold '+Math.floor(progress)+'/'+goal+'s':'Defeat '+progress+'/'+goal;
    this.waveObjTxt.setText(def.name+' · '+count+' · '+Math.ceil(e.left)+'s').setVisible(true).setColor('#ffe9bd');
    this.waveObjBg.setVisible(true);
    this.waveObjBar.setVisible(true).setFillStyle(def.color);
    this.waveObjBar.width=Math.max(2,Math.min(230,this.W-84)*progress/goal);
  }
  chapterCombatKill(enemy){
    const d=this._c1Combat;
    if(!d)return;
    if(d.loot.has(enemy)){
      const id=d.loot.get(enemy);d.loot.delete(enemy);
      if(id===enemy._c1SpawnId)this.spawnSugarCoins(3,enemy);
    }
    const e=d.event,mark=e?.targets.get(enemy);
    if(!mark||mark.id!==enemy._c1SpawnId)return;
    e.targets.delete(enemy);mark.marker.destroy();
    this.chapterEventAudio?.(e.def,'progress');if(Math.random()<.25&&typeof VoiceActing!=='undefined')VoiceActing.reaction?.(this,4,'ruby');
    if(++e.progress>=e.def.types.length)this.endChapterSideEvent(d,true);
  }
  endChapterSideEvent(d,success,silent=false){
    const e=d.event;
    if(!e)return;
    d.event=null;
    if(!silent){this.chapterEventAudio?.(e.def,success?'complete':'close');if(success&&typeof VoiceActing!=='undefined')VoiceActing.reaction?.(this,5,Math.random()<.5?'ruby':undefined);}
    for(const o of e.visuals)o.destroy();
    for(const {marker} of e.targets.values())marker.destroy();
    for(const o of [this.waveObjTxt,this.waveObjBg,this.waveObjBar])o?.setVisible(false);
    if(success){
      this.spawnSugarCoins(e.def.reward);
      this.floatText?.(this.player.x,this.player.y-55,'+'+e.def.reward+' Sugar',0xffe08a);
    }
  }
  clearChapterCombatWave(){
    const d=this._c1Combat;
    if(!d)return;
    this.endChapterSideEvent(d,false,true);
    this.clearChapterCombatRoute(d);
    this.clearChapterCombatCommand(d);
    this.clearChapterCombatHazard(d);
    d.loot.clear();
  }
  tickA23Audio(){
    if(this.state!=='play'||!this.player?.active||this._inTutorial||typeof A23_STAGE_FAMILY==='undefined')return;
    const stage=this.stageIndex;if(!Number.isInteger(stage)||stage<0||stage>=15||this.recipeMode||this.riftMode)return;
    const boss=this.mode==='boss'||this.mode==='mini',key=boss?'a23_boss_ambience_s'+String(Math.floor(stage/5)*5+5).padStart(2,'0'):'a23_ambience_s'+String(stage+1).padStart(2,'0')+'_1';
    if((this._a23AudioAt||0)>(this.elapsed||0))return;this._a23AudioAt=(this.elapsed||0)+1;
    if(this._a23AmbientKey&&this._a23AmbientKey!==key)Sfx.eventLoopStop?.(this._a23AmbientKey);this._a23AmbientKey=key;
    Sfx.eventLoopStart?.(key,boss?.1:.24);
  }
  enemyAudio(e,action){
    if(!e?.active||e.isBoss||e.isMini||e.isDummy||this.state!=='play'||typeof A23_STAGE_FAMILY==='undefined')return false;
    const p=this.player;if(!p||Math.hypot(e.x-p.x,e.y-p.y)>430)return false;
    const family=A23_STAGE_FAMILY[this.stageIndex]||'shadow';
    return this.a23Cue?.('monster_'+family+'_'+action,action==='hurt'?.1:action==='death'?.14:.17,action==='spawn'?.8:action==='hurt'?.5:.3);
  }
  chapterEventAudio(def,action){
    const type={hm_hand:'breach',fp_jar:'frozen_pantry',gp_pot:'ritual'}[def?.key];
    return type&&this.a23Cue?.('event_'+type+'_'+action,action==='progress'?.2:.32,.4);
  }
  tickStage(dt){
    if(this._inTutorial)return; this.tickA23Audio?.();this.goldShimTick?.();   // freeze เวลาระหว่างสอน — ไม่สปอน ไม่นับเวลา ไม่ขึ้นWave (สนามควบคุมโดย coach)
    if(this.mode==='wave'){
      if(!this._v83Run&&this.tickJackpotEvent(dt))return;
      const _obj=this.waveObjective, _timed=!this._replayMeter&&(!_obj||_obj.type==='survive'||!!this._waveTimed);   // v8.2.20 เวฟภารกิจ Story นับเวลาด้วย (_waveTimed)   // นับถอยหลังเฉพาะเวฟ survive · เวฟภารกิจอื่นต้องเคลียร์ให้จบ (ไม่หมดเวลา)
      if(_timed)this.waveTimer-=dt;
      if(this._waveTimed&&!this._hurrySaid&&this.waveTimer>0&&this.waveTimer<=10&&this.waveObjective&&!this.waveObjective.done){ this._hurrySaid=true; this.rubyVoiceReact?.('hurry'); }   // v8.2.24 A16
      if(!this._replayMeter){if(this.stageIndex===8)this.tickSeasonArena(dt);if(this.stageIndex===9)this.tickRootThrone(dt);}this.tickWaveObjective(dt);this.stackTick?.(dt);this.seedRiftEventTick?.(dt);
      if(this.mode!=='wave')return;
      if(this.recipeMode)this.tickRecipeHunger(dt);else if(this.checkEndgameCurse(this.bossRush?(this._rushPos||0)/Math.max(1,this._rushList.length):this.waveIndex/Math.max(1,STAGES[this.stageIndex].waves)))return;if(this.state!=='play')return;if(this._replayMeter)this.tickReplayProgress(dt); if(this.mode!=='wave')return;
      if(this._v83Run)this.tickChapterCombat(dt);
      if(this.state!=='play')return;
      this.spawnAcc-=dt*(this.rpMul?.('spawn')||1);
      if(this.spawnAcc<=0){const idleP=this._idleP||0,pressure=Math.min(1,this.wavePressure()+idleP),dynamicInterval=this.spawnInterval*(1-pressure*0.32);this.spawnAcc=dynamicInterval;
        const live=this.enemies.countActive(true);
        const dynamicMax=Math.min(74+Math.round(idleP*26),this.maxLive+Math.round(pressure*10)),dynamicBatch=this.spawnBatch+(pressure>=0.50?1:0)+(idleP>=0.45?1:0);
        if(this.usesStoryBudget?.()){const cap=Math.min(this.maxLive,this.storyLiveCap())-(this._c1Combat?.event?4:0),pace=this.storySpawnPace();this.spawnAcc=pace.interval;if(live<Math.ceil(cap*pace.refill))this.spawnWaveRing(Math.min(pace.batch,cap-live));}
        else if(live<dynamicMax){const n=Math.min(dynamicBatch,dynamicMax-live);this.spawnWaveRing(n);} }
      if(this.waveAllowsElite){ this.eliteAcc-=dt*(this.rpMul?.('eliteRate')||1); if(this.eliteAcc<=0){ this.eliteAcc=this.eliteEvery; if(this.enemies.countActive(true)<this.maxLive) this.spawnElite(); } }
      if(this.swarmAcc!=null&&(!this.usesStoryBudget?.()||this.storyTimedSwarm())){ this.swarmAcc-=dt; if(this.swarmAcc<=0){ this.swarmAcc=this.usesStoryBudget?.()?14:Phaser.Math.FloatBetween(14,22); this.spawnSwarm(); } }
      const st=STAGES[this.stageIndex]; if(this.recipeMode||this._replayMeter)return;
      if(st&&this._v83Run)this.timeTxt.setText(this.continuousCombatWaveText());
      else if(st){ if(_timed)this.timeTxt.setText('Wave '+(this.waveIndex+1)+'/'+st.waves+' · '+Math.max(0,Math.ceil(this.waveTimer))+'s');
        else this.timeTxt.setText('Wave '+(this.waveIndex+1)+'/'+st.waves);
        if(this.usesStoryBudget?.()&&this._storyBudget&&!this.storyTimedSwarm())this.timeTxt.setText(this.timeTxt.text+' · Left '+Math.max(0,this._storyBudget.quota-this._storyBudget.spawned)); }
      if(_timed&&this.waveTimer<=0){
        const _o=this.waveObjective;
        if(_o&&(_o.type==='survive'||!this._waveTimed))this.completeWaveObjective();   // survive ครบเวลา = สำเร็จ
        else if(_o&&_o._timedGoal&&_o.type==='hungerHerald')this.hhFinish?.(_o,this._sig);   // v8.2.20 Herald จบเมื่อหมดเวลา
        else if(_o)this.expireWaveObjective();   // v8.2.20 หมดเวลา: ≥50% ได้ครึ่ง
        else if(this._v83Run)this.onWaveCleared(true,false);
        else if(this.usesStoryBudget?.()&&!this._replayMeter){ this.clearFoes?.(); this.clearEnemies?.(); this.settleStoryBudget?.(true); this.mode='waveclear'; this.showBanner('🌊 Wave complete','Collect your EXP — next wave soon',1400); }
        else{this.mode='waveclear';this.showBanner('⏳ Time’s Up!','Clear all remaining enemies to advance',1800);}
      }   // เวฟภารกิจ (hunt/purge/capture) = ไม่หมดเวลา ต้องเคลียร์ภารกิจให้จบ
    } else if(this.mode==='waveclear'){
      if(this._stack)this.stackEnd?.(true);   // v8.2.21 เวฟจบ = ภารกิจเสริมหมดเวลาไปด้วย
      // หยุดเกิดมอนใหม่ · Waitผู้เล่นกำจัดที่เหลือให้หมดจึงไปเวฟถัดไป
      const st=STAGES[this.stageIndex], live=this.enemies.countActive(true);
      // v4.59: มอนธรรมดาที่เหลือหนีหายไปหลัง 4 วิ (ไม่ต้องไล่เก็บ 90 ตัว) · Elite/ของซุ่มโจมตียังต้องฆ่าเอง
      this._clearT=(this._clearT||0)+dt; if(this._clearT>=4&&!this._clearFled){ this._clearFled=true; this.fleeRemainingEnemies(); }
      if(st)this.timeTxt.setText('Wave '+(this.waveIndex+1)+'/'+st.waves+' · '+(this._clearFled?'🏃 Swarm retreating · '+live+' left':'🧹 Clear remaining '+live));
      if(live<=0) this.onWaveCleared(false);
    } else if(this.mode==='mini'){
      // ระหว่างสู้มินิ = ยังมีลูกน้องไหลมาเรื่อย ๆ (กดดันต่อเนื่อง แต่เบากว่า)
      this.spawnAcc-=dt;
      if(this.spawnAcc<=0){ this.spawnAcc=this.spawnInterval*1.7;
        const live=this.enemies.countActive(true);
        if(live<this.maxLive*0.7){ const n=Math.max(1,Math.floor(this.spawnBatch*0.5)); for(let i=0;i<n;i++) this.spawnWaveEnemy(); } }
    } else if(this.mode==='boss'){ this.bossMissionTick?.(dt); }
    if(this.mode!=='boss'){ this._bossMsnTried=false; this._twistN=0; if(this._twist)this.bossTwistEnd?.(false); if(this._stack&&this._stack.boss)this.stackEnd?.(true); }
  }
  // HP บอสไต่ตามเลเวลในรันและ Power Guide แบบอ่อน ๆ เท่านั้น ไม่สเกลตาม rank Fullจน progression ไร้ความหมาย
  bossHpMul(){const pg=this._powerGuide||this.getPowerGuide(this.stageIndex);return Math.min(3.0,(1+Math.max(0,(this.level||1)-1)*(this.usesStoryBudget?.()?0.025:0.055))*pg.enemyHp); }
  // ยิ่งฆ่ามอนในด่านเยอะ ศัตรู/บอสยิ่งถึกขึ้น (ทวีคูณ) — ทำให้เกมยากขึ้นเรื่อย ๆ ระหว่างด่าน
  killPowerMul(){ if(this.usesStoryBudget?.())return 1;return (1 + Math.min(1.8, (this.stageKills||0)*0.005)); }
  // ผ่อนความยากให้ผู้เล่นใหม่: Stage 1 + ช่วงต้นStage (ฆ่ายังน้อย) + ยังไม่จบ tutorial → มอนเลือดน้อยลง (แก้ feedback "~4 hits per enemy")
  newbieEase(){ let m=1; if(this.stageIndex===0)m*=0.60; if((this.stageKills||0)<25)m*=0.85; if(!Save.data.tutorialDone)m*=0.8; return m; }
  zoneModMul(){ let hp=1,dmg=1,reward=1; if(Save.zoneModsUnlocked()){ for(const id of (this._activeZoneMods||[])){ const m=ZONE_MODIFIERS.find(x=>x.id===id); if(m){ hp*=m.hp; dmg*=m.dmg; reward*=m.reward; } } } return {hp,dmg,reward}; }
  diffMul(){ const d=DIFFS[Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1))],z=this._zoneMul||{hp:1,dmg:1,reward:1},r=this.riftMul(),c=this._challengeRun||[]; return {...d,hp:d.hp*z.hp*r.hp*(c.includes('iron')?1.35:1)*(c.includes('crowd')?1.15:1),dmg:d.dmg*z.dmg*r.dmg*(c.includes('fang')?1.25:1),reward:d.reward*z.reward*r.reward}; }
  riftMul(){ if(!this.riftMode)return {hp:1,dmg:1,reward:1}; const m=(this.recipeMode&&this._amapNode)?delveMul(this._amapNode.d):riftTierMul(this._riftTier); for(const id of this._riftMods||[]){const x=recipeModDef(id);if(x){m.hp*=x.hp;m.dmg*=x.dmg;m.reward*=x.reward;}} if(this.recipeMode){ m.reward*=1+atlasLv('fortune')*0.08; const pl=this._pact||{}; m.hp*=1+0.15*(pl.hp||0); m.dmg*=1+0.15*(pl.dmg||0); m.reward*=1+PACT_REWARD_PER_HEAT*(this._pactHeat||0); const fi=this._amapInf||{},L=amapInfLayers(fi); if(L){ m.hp*=1+0.1*L+0.06*(fi.frosty||0); m.dmg*=1+0.1*L+0.08*(fi.fermented||0); m.reward*=1+0.15*L; } } return m; }   // ตัวคูณความยาก × Zone Modifiers
  zoneLevel(){ return stageZoneLevel(this.stageIndex||0,this.stageDiff||1); }   // Zone Level ของด่านที่กำลังเล่น
  // แนะนำระดับความยากจาก Power Rating เทียบค่าพลังแนะนำของด่าน
  bossRageInfo(kills){
    const n=kills==null?(this.stageKills||0):kills,tiers=[
      {min:0,name:'Normal',emoji:'😐',color:0xb8b0c4,hp:1,dmg:1,spd:1,cd:1,reward:1,gear:0.45,minTier:'common'},
      {min:60,name:'Getting Angry',emoji:'💢',color:0xffb35c,hp:1.22,dmg:1.10,spd:1.04,cd:0.93,reward:1.20,gear:0.52,minTier:'common'},
      {min:140,name:'Furious',emoji:'🔥',color:0xff7a4d,hp:1.5,dmg:1.22,spd:1.09,cd:0.86,reward:1.45,gear:0.62,minTier:'rare'},
      {min:240,name:'Enraged',emoji:'👹',color:0xff405c,hp:1.9,dmg:1.38,spd:1.14,cd:0.78,reward:1.80,gear:0.74,minTier:'rare'},
      {min:360,name:'Berserk',emoji:'👑',color:0xd95cff,hp:2.4,dmg:1.58,spd:1.20,cd:0.70,reward:2.30,gear:0.88,minTier:'epic'},
    ];let tier=0;for(let i=1;i<tiers.length;i++)if(n>=tiers[i].min)tier=i;return Object.assign({tier,kills:n},tiers[tier]);
  }
  applyBossRage(b,announce){
    if(!b||!b.active)return;const r=this.bossRageInfo(),old=b.rage||this.bossRageInfo(0);if(b.rage&&r.tier<=b.rage.tier)return;
    if(!b._rageBaseHp){b._rageBaseHp=b.maxhp;b._rageBaseDmg=b.dmg;b._rageBaseSpd=b.spd;}
    const hpPct=b.maxhp>0?b.hp/b.maxhp:1,spdRatio=r.spd/(old.spd||1);b.maxhp=b._rageBaseHp*r.hp;b.hp=Math.max(1,b.maxhp*hpPct);b.dmg=Math.round((b.dmg||b._rageBaseDmg)*(r.dmg/(old.dmg||1)));b.spd=(b.spd||b._rageBaseSpd)*spdRatio;b.rage=r;b.rageCdMul=r.cd;
    const st=STAGES[this.stageIndex];this.bossName.setText((b.isBoss?'👹 ':'💢 ')+(b.isBoss?(b.delveBoss?(b.delveBoss==='warden'?'The Jelly Warden':'Madame Candlewick'):this._pinnacleRun?'The Hunger Beneath':st.boss):st.mini)+' · '+r.emoji+' '+r.name).setColor('#'+r.color.toString(16).padStart(6,'0'));
    if(announce&&r.tier>old.tier){this.showBanner(r.emoji+' Boss '+r.name,'Minions killed '+r.kills+' · reward x'+r.reward.toFixed(2),1500);this.screenFlash(r.color,0.14,300);Sfx.bossWarn();}
  }
  spawnMiniBoss(){ if(!this.recipeMode&&!this.bossRush)this.rubyTip?.('mini',3200);
    if(this.state==='levelup'){this._queuedBossIntro='mini';return;}
    if(this.state!=='play')return;
    this._miniFight={t0:this.elapsed||0,hits:0}; Sfx.ev?.('miniboss_arrival',.6,2);   // v5.13 วัดผลงานสู้มินิบอส → ระดับกล่อง
    const st=STAGES[this.stageIndex];
    this.showBanner('💢 Miniboss!', st.mini, 2000); Sfx.bossWarn(); Sfx.playMiniBgm(this.stageIndex+1); this.screenShake(200,0.008);
    const adds=2+this.stageIndex;
    for(let i=0;i<adds;i++) this.spawnEnemy(Math.random()<0.5?'fast':'basic');
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const mkey=this.stageIndex>=10?'c3_mini'+(this.stageIndex-9):this.stageIndex===4?'mb5_banquet_executioner':this.stageIndex===5?'mb6_sporewarden':this.stageIndex===6?'mb7_fungal_juggernaut':this.stageIndex===7?'mb8_royal_stinger':this.stageIndex===8?'mb9_season_keeper':this.stageIndex===9?'mb10_ancient_root_knight':'mb'+(this.stageIndex+1), mArt=this.textures.exists(mkey);
    const [mx0,my0]=(typeof inMapPt==='function'?inMapPt:(x,y)=>[x,y])(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad),b=this.enemies.create(mx0,my0, mArt?mkey:'e_brute');
    this.tagTaroEnemy?.(b);
    let mScale=this.stageIndex===4?0.78:(this.stageIndex===5?0.72:(this.stageIndex===6?0.82:(this.stageIndex===7?0.78:(this.stageIndex===1?0.88:(mArt?1.15:1.7)))));if(this.stageIndex===8)mScale=.82;if(this.stageIndex===9)mScale=1.19; b.baseScale=mScale; b._sqX=1; b._sqY=1;
    let mRadius=this.stageIndex===4?57:(this.stageIndex===5?54:(this.stageIndex===6?58:(this.stageIndex===7?55:(this.stageIndex===1?48:(mArt?52:26))))),mOff=this.stageIndex===4?71:(this.stageIndex===5?74:(this.stageIndex===6?70:(this.stageIndex===7?73:(this.stageIndex===1?48:(mArt?18:5)))));
    if(this.stageIndex===8){mRadius=57;mOff=71;}if(this.stageIndex===9){mRadius=42.64;mOff=85.36;}
    if(this.stageIndex>=10&&ASSET_SHEETS[mkey]){mScale=.62;mRadius=70;mOff=58;}
    b.setScale(mScale).setCircle(mRadius,mOff,this.stageIndex>=10&&ASSET_SHEETS[mkey]?82:mOff); b.isMini=true; b.isBoss=false;
    const _mdI=Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1)),_mStoryC=[1,1.45,2.11,3.07,4.47,6.49,9.44,13.73,19.96,29.02,42.18,61.33,82.25,114.5,159],_mStory=!this.recipeMode,_mScale=_mdI===0?1.0:(_mdI===1?this.bossHpMul()*this.diffMul().hp:this.bossHpMul()*this.diffMul().hp*1.6);b.hp=_mStory?STAGES[0].bossHp*2*1.75/0.9*(_mStoryC[this.stageIndex]??_mStoryC[14]*Math.pow(1.578,this.stageIndex-14))*0.25*_mScale*(typeof STORY_HP_MUL==="number"?STORY_HP_MUL:1):st.bossHp*1.0/0.9*realStageBossMul(this.stageIndex,this.recipeMode)*this.bossHpMul()*this.diffMul().hp; b.maxhp=b.hp;   /* v7.8.66 เจ้าของ A+B+C: Story มินิ = 25% ของบอสด่านเดียวกัน · สเกลเลเวล/ความยากแบบเดียวกับบอส · Recipe คงสูตรเดิม */ b.spd=this.stageIndex===6?104:96;   // มินิบอส C2-2 เดินเร็วขึ้นเล็กน้อย แต่ทุกท่าหนักมี telegraph
    b.dmg=Math.round(st.bossDmg*1.1*0.75/*v6.55.66 boss dmg*/*(this._powerGuide||this.getPowerGuide(this.stageIndex)).enemyDmg*this.diffMul().dmg);if(!this.recipeMode){const _sd=[1,1.082,1.171,1.267,1.371,1.483,1.605,1.736,1.879,2.033,2.199,2.38,2.689,3.038,3.433],_tk=18*1.3*(_sd[this.stageIndex]??_sd[14]*Math.pow(1.13,this.stageIndex-14))*(this._powerGuide||this.getPowerGuide(this.stageIndex)).enemyDmg*this.diffMul().dmg;b.dmg=Math.max(b.dmg,Math.round(_tk*1.2));}   /* v7.8.66 D: มินิชน ≥ 1.2× Tank */ b.xp=15; b.frozen=0; b._glacierLifeToken=(b._glacierLifeToken||0)+1;b._frostBurnStacks=0;b._frostBurnUntil=0;b._frostBurnPower=0;b._frostBurnTick=0; b._glacierFrost=0; b._glacierFrostAt=0; b._glacierBrittleUntil=0;b._mintImpale=0;b._mintImpaleAt=-Infinity;b._mintRuptureAt=-Infinity; b._glacierBurstAt=-Infinity; b._chill=0; b._chillAt=null; b.knock=0; b.phase3=false;   // ต้องอยู่นอก comment: ป้องกันมินิบอสไร้ดาเมจ/ค่า combat undefined
    if(mArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.shooter=false; b.bomber=false; b.acid=false; b.dasher=false; b.siege=false; b.dashState=null; b.juggernaut=this.stageIndex===6;b.royalStinger=this.stageIndex===7;b.seasonKeeper=this.stageIndex===8;b.rootKnight=this.stageIndex===9;b._rootKnightPoseUntil=0;b._rootKnightPoseToken=(b._rootKnightPoseToken||0)+1;
    b.atkCd=0.85; b.phase2=false;b._enraged=false;b._comboLock=false;b._phaseInvuln=0;b._phaseGateLocked=false;b._phaseShieldFx=null;b._phaseImmunePopAt=0;b.rage=null;b._rageBaseHp=0;b.rageCdMul=1; b.royalGuard=this.stageIndex===0; b.atks=['slam','aimed','radial','nova']; if(this.stageIndex>=1)b.atks.push('charge'); if(this.stageIndex>=2)b.atks.push('spiral'); if(this.stageIndex>=3)b.atks.push('summon');   // Minibossมีลูกเล่นมากขึ้น + โจมตีถี่ขึ้น (buff จาก feedback)
    b._drainMotion=this.stageIndex===1; b._drainMotionKind='mini'; b._breathe=0; b._baseScale=mScale;
    if(this.anims.exists(mkey+'_idle'))b.play(mkey+'_idle',true);else if(this.anims.exists(mkey+'_walk'))b.play(mkey+'_walk',true);
    this.boss=b;this._bossEpoch=(this._bossEpoch||0)+1;b._big=null;b._bigHold=false;b._bigT=0;b._said=false;b._sayAt=0;b._sayI=-1; this.camWorld(b);this.applyBossRage(b,false);this.bossUI.forEach(o=>o.setVisible(true));this.resetBossObjective();this._weakAcc=9;
    this.waveAlive=adds+1;
    this.mode='mini';this.updateWaveText();
    this.applyBossInk?.(b);this.miniIntro(b);
  }
  // บอสเรียกลูกน้อง "Miniboss" ออกมาช่วยตอนปรากฏตัว (flag เป็น elite เพื่อไม่ให้ตายแล้วจบเวฟ)
  spawnBossEscorts(n){
    const st=STAGES[this.stageIndex]; if(!st)return;
    const mkey=this.stageIndex>=10?'c3_mini'+(this.stageIndex-9):this.stageIndex===4?'mb5_banquet_executioner':this.stageIndex===5?'mb6_sporewarden':this.stageIndex===6?'mb7_fungal_juggernaut':this.stageIndex===7?'mb8_royal_stinger':this.stageIndex===8?'mb9_season_keeper':this.stageIndex===9?'mb10_ancient_root_knight':'mb'+(this.stageIndex+1), mArt=this.textures.exists(mkey);
    const cx=this.boss?this.boss.x:this.player.x, cy=this.boss?this.boss.y:this.player.y;
    for(let i=0;i<n;i++){
      if(this.storyCanSpawn?.()===false)break;
      const ang=(i/n)*Math.PI*2+Phaser.Math.FloatBetween(-0.4,0.4), rad=190+Phaser.Math.Between(0,90);
      const ex=cx+Math.cos(ang)*rad, ey=cy+Math.sin(ang)*rad;
      let e=this.enemies.getFirstDead(false);
      if(!e) e=this.enemies.create(ex,ey,mArt?mkey:'e_brute');
      else { e.setTexture(mArt?mkey:'e_brute'); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(ex,ey); }
      if(!e)continue;
      this.tagTaroEnemy?.(e);const c3Raster=this.stageIndex>=10&&!!ASSET_SHEETS[mkey];
      const sc=c3Raster?0.48:this.stageIndex===4?0.5:(this.stageIndex===5?0.46:(this.stageIndex===1?0.62:(mArt?0.8:1.25))); e.baseScale=sc; e._sqX=1; e._sqY=1; e.setScale(sc);
      const rr=c3Raster?58:this.stageIndex===4?46:(this.stageIndex===5?42:(mArt?40:22)), off=c3Raster?70:this.stageIndex===4?74:(this.stageIndex===5?78:(mArt?16:5)); e.setCircle(rr,off,c3Raster?90:off);
      e.isBoss=false; e.isMini=false; e.isElite=true;   // elite = ตายแล้วไม่ทริกเกอร์จบเวฟ
      e.hp=st.bossHp*0.6*this.bossHpMul(); e.maxhp=e.hp; e.spd=68; e.dmg=Math.round(st.bossDmg); e.xp=12; e.frozen=0; e._glacierLifeToken=(e._glacierLifeToken||0)+1;e._frostBurnStacks=0;e._trem=0;e._shock=0;e._frostBurnUntil=0;e._frostBurnPower=0;e._frostBurnTick=0; e._glacierFrost=0; e._glacierFrostAt=0; e._glacierBrittleUntil=0;e._mintImpale=0;e._mintImpaleAt=-Infinity;e._mintRuptureAt=-Infinity; e._glacierBurstAt=-Infinity; e._chill=0; e._chillAt=null; e.knock=0; e.phase3=false;
      e.shooter=false; e.bomber=false; e.acid=false; e.dasher=false; e.siege=false; e.dashState=null; e.bloomStacks=0; e.bloomUntil=0;
      if(mArt){ e.tintColor=null; e.clearTint(); } else { e.tintColor=st.tint; e.setTint(st.tint); }
      if(mkey==='mb10_ancient_root_knight'&&this.anims.exists(mkey+'_walk'))e.play(mkey+'_walk',true);else if(this.anims.exists(mkey+'_idle'))e.play(mkey+'_idle',true);else if(this.anims.exists((mArt?mkey:'e_brute')+'_walk')) e.play((mArt?mkey:'e_brute')+'_walk',true); else if(e.anims){ e.anims.stop(); e.setFrame(0); }
      this.applyBossInk?.(e);this.camWorld(e); this.vfxSpawnPoof(ex,ey);this.storySpawned?.();
    }
    this.screenShake(180,0.006);
  }
  tickDelveMods(dt){ const p=this.player; if(!p||!p.active)return; const now=this.elapsed||0;
    if(this.recipeHas('restless')){ const v=p.body?Math.hypot(p.body.velocity.x,p.body.velocity.y):0; this._stillT=v<25?(this._stillT||0)+dt:0;
      if(this._stillT>1){ this._rlAcc=(this._rlAcc||0)+dt; if(this._rlAcc>=0.25){ this._rlAcc=0; if(!(p.iframe>0)){ p.hp=Math.max(1,p.hp-p.maxhp*0.01); this.drawBars&&this.drawBars(); } p.setTint&&p.setTint(0xff7a5a); this.time.delayedCall(90,()=>p.active&&p.clearTint&&p.clearTint()); if(now-(this._rlMsgAt||0)>4){ this._rlMsgAt=now; this.floatText?.(p.x,p.y-60,'🏃 Keep moving!',0xff9b7a); } } } }
    if(this.recipeHas('shrink')){ if(!this._shz){ this._shz={x:p.x,y:p.y,t0:now}; this._shzG=this.camWorld(this.add.graphics().setDepth(-90000)); }
      const z=this._shz,r=Math.max(360,950-(now-z.t0)*6.5); z.r=r; const g=this._shzG; g.clear(); g.lineStyle(6,0xff4d6d,0.75); g.strokeCircle(z.x,z.y,r); g.lineStyle(2,0xffffff,0.35); g.strokeCircle(z.x,z.y,r-8);
      if(this.dist(p.x,p.y,z.x,z.y)>r){ this._shAcc=(this._shAcc||0)+dt; if(this._shAcc>=0.25){ this._shAcc=0; if(!(p.iframe>0)){ p.hp=Math.max(1,p.hp-p.maxhp*0.015); this.drawBars&&this.drawBars(); } if(now-(this._shMsgAt||0)>3){ this._shMsgAt=now; this.floatText?.(p.x,p.y-60,'⭕ Back inside!',0xff4d6d); } } } } }
  clearDelveMods(){ if(this._shzG){ this._shzG.destroy(); this._shzG=null; } this._shz=null; this._stillT=0; }
  spawnFinalBoss(){ if(this.state==='play'&&this.stageIndex===12&&this.mcStory?.()&&this.mcGate?.('s15',()=>this.spawnFinalBoss()))return;if(this.state==='play')this.voiceBark?.('boss');   // v8.0.2 กระจกความทรงจำก่อนบอส C3-3
    if(!this.bossRush)this.rubyTip?.('boss',4200);
    if(this.state==='levelup'){this._queuedBossIntro='final';return;}
    if(this.state!=='play')return;
    if(this.usesStoryBudget?.()&&this._storyBudget&&!this._storyBudget.bossAdds){this._storyBudget.bossAdds=true;this._storyBudget.done=false;this._storyBudget.quota=this._storyBudget.spawned+[8,12,16][Math.min(2,Math.floor(this.stageIndex/5))];}
    if(this.stageIndex===4&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('story_final_hunger','FINAL ENCOUNTER','THE GREAT HUNGER','The crown shadow swallows all light — six eyes stare down, and the bottomless hunger awakens',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===5&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('chapter2_cover','CHAPTER 2 · FIRST BLOOM',"ROOTMOTHER'S BUD",'The root tears open a first avatar of the Rootmother — only a fragment of the body growing deeper in the garden',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===6&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg7','CHAPTER 2 · HEART OF THE MARSH','MYCELIUM BEHEMOTH','Every fungal thread pulls tight — the whole marsh rises around one ancient heart',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===7&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg8','CHAPTER 2 · ROYAL FERMENT','FERMENT HORNET QUEEN','The protected flowers ring one final warning as violet crystal reaches the royal honey',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===8&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg9','CHAPTER 2 · BROKEN EQUINOX','CHRONOBLOOM ORCHID','The greenhouse clock strikes every season at once — the Orchid opens where time should have ended',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===9&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg10','CHAPTER 2 · THE ROOT THRONE','THE TRUE ROOTMOTHER','Every stolen memory returns to the living cathedral — the crown opens its heart for one final judgment',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===10&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg11','CHAPTER 3 · ASHEN SEEDFIELDS','THE HARVEST COLOSSUS','Every burned row rises at once — the harvest has become a single giant body',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===11&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg12','CHAPTER 3 · HOLLOW ORCHARD','THE HOLLOW BLOOM','Every flavor carved from the orchard blooms together into one hungry flower',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===12&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg13','CHAPTER 3 · GLASS GREENHOUSE','THE GLASS GARDENER','A thousand reflections turn toward Strawberry — the gardener chooses which future grows',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===13&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg14','CHAPTER 3 · THE SEED VAULT','THE SEEDWARDEN','The vault shakes as its last guardian lights every jar of crown seeds',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===14&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('bg15','FINAL CHAPTER · THE FIRST SEED','THE FIRST PLANTER','The throne turns. The one who wears the Crown finally looks at the Heart Seed',()=>this.spawnFinalBoss());return;}
    const st=STAGES[this.stageIndex]; this.mode='boss';
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const [bx,by]=(typeof inMapPt==='function'?inMapPt:(x,y)=>[x,y])(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad);
    const bkey=this.stageIndex>=10?'c3_boss'+(this.stageIndex-9):this.stageIndex===4?'boss5_sovereign':this.stageIndex===5?'boss6_rootmother':this.stageIndex===6?'boss7_mycelium_behemoth':this.stageIndex===7?'boss8_hornet_queen':this.stageIndex===8?'boss9_chronobloom_orchid':this.stageIndex===9?'boss10_true_rootmother':'boss'+(this.stageIndex+1);
    let b=this.enemies.create(bx,by,this.textures.exists(bkey)?bkey:'e_brute');
    if(!b){ b=this.enemies.getFirstAlive(); if(!b){ this.clearEnemies(); b=this.enemies.create(bx,by,this.textures.exists(bkey)?bkey:'e_brute'); } if(b){ b.setTexture(this.textures.exists(bkey)?bkey:'e_brute'); b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(bx,by); } }   // pool Full → รีไซเคิล/Cleared กันบอสเป็น null
    this.tagTaroEnemy?.(b);const isArt=this.textures.exists(bkey);
    let fScale=this.stageIndex===4?1.08:(this.stageIndex===5?0.96:(this.stageIndex===6?1.12:(this.stageIndex===7?1.06:([1,2,3].includes(this.stageIndex)?1.18:(isArt?1.55:2.5)))));if(this.stageIndex===8)fScale=1.08;if(this.stageIndex===9)fScale=1.12; b.baseScale=fScale; b._sqX=1; b._sqY=1;   // บอสStage 2-4 ตัวใหญ่ขึ้น (0.88→1.18)
    let fRadius=this.stageIndex===4?61:(this.stageIndex===5?60:(this.stageIndex===6?62:(this.stageIndex===7?58:([1,2,3].includes(this.stageIndex)?58:(isArt?54:26))))),fOff=this.stageIndex===4?67:(this.stageIndex===5?68:(this.stageIndex===6?66:(this.stageIndex===7?70:([1,2,3].includes(this.stageIndex)?70:(isArt?16:5)))));
    if(this.stageIndex===8){fRadius=60;fOff=68;}if(this.stageIndex===9){fRadius=62;fOff=66;}
    if(this.stageIndex>=10&&ASSET_SHEETS[bkey]){fScale=.88;fRadius=82;fOff=46;}
    b.setScale(fScale).setCircle(fRadius,fOff,this.stageIndex>=10&&ASSET_SHEETS[bkey]?74:fOff); b.isBoss=true; b.isMini=false;
    const _dIdx=Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1));   // 0=Normal 1=ยาก 2=นรก
    // Normal (ง่าย) = เลือด Fix ตายตัว Noneตัวคูณ (ไม่สเกลตามเลเวล/ความยาก) · ยาก = เริ่มคูณ · นรก = คูณโหดมาก
    const _bossScale=_dIdx===0?1.0:(_dIdx===1?this.bossHpMul()*this.diffMul().hp:this.bossHpMul()*this.diffMul().hp*1.6);
    const _bStoryC=[1,1.45,2.11,3.07,4.47,6.49,9.44,13.73,19.96,29.02,42.18,61.33,82.25,114.5,159];b.hp=(this.recipeMode?st.bossHp*(2.0+this.stageIndex*0.13)*1.75/0.9*realStageBossMul(this.stageIndex,this.recipeMode):STAGES[0].bossHp*2*1.75/0.9*(typeof STORY_HP_MUL==="number"?STORY_HP_MUL:1)*(_bStoryC[this.stageIndex]??_bStoryC[14]*Math.pow(1.578,this.stageIndex-14)))*_bossScale*(this.recipeMode?(this._amapNode?(this._amapNode.type==='boss'?2:this._amapNode.type==='elite'?1.5:1):1)*this.riftMul().hp*RECIPE_BOSS_HP*(1+0.25*((this._pact&&this._pact.boss)||0)):1);
    if(this.recipeMode&&this._amapNode&&!this._pinnacleRun){ const L=STAGES.length-1,ref=STAGES[L].bossHp*(2.0+L*0.13)*1.75/0.9*realStageBossMul(L,false),nm=this._amapNode.type==='boss'?2:this._amapNode.type==='elite'?1.5:1; b.hp=Math.max(b.hp,ref*DELVE_BOSS_FLOOR*nm*delveMul(this._amapNode.d||1).hp*(1+0.25*((this._pact&&this._pact.boss)||0))); }   /* v6.98 Delve boss ≥ C3-5 boss (owner: continuity) */ b.maxhp=b.hp;   // R10: เดิม diff1 ไม่คูณ diffMul → บอส Recipe/Rift ไม่สเกลตาม Tier เลย   // บอสใหญ่ HP: easy fix · hard/hell คูณ
    b.spd=94;   // เดิม 46 ช้าเกิน → บอสตามผู้เล่นไม่ทัน ลากออกนอกจอ = "Boss vanished" · เร่งให้เกาะติด
    b.dmg=Math.round(st.bossDmg*1.3*0.75/*v6.55.66 boss dmg*/*(this._powerGuide||this.getPowerGuide(this.stageIndex)).enemyDmg*this.diffMul().dmg);if(!this.recipeMode){const _sd=[1,1.082,1.171,1.267,1.371,1.483,1.605,1.736,1.879,2.033,2.199,2.38,2.689,3.038,3.433],_tk=18*1.3*(_sd[this.stageIndex]??_sd[14]*Math.pow(1.13,this.stageIndex-14))*(this._powerGuide||this.getPowerGuide(this.stageIndex)).enemyDmg*this.diffMul().dmg;b.dmg=Math.max(b.dmg,Math.round(_tk*1.5));}   /* v7.8.66 D: บอสชน ≥ 1.5× Tank */ b.xp=30; b.frozen=0; b._glacierLifeToken=(b._glacierLifeToken||0)+1;b._frostBurnStacks=0;b._frostBurnUntil=0;b._frostBurnPower=0;b._frostBurnTick=0; b._glacierFrost=0; b._glacierFrostAt=0; b._glacierBrittleUntil=0;b._mintImpale=0;b._mintImpaleAt=-Infinity;b._mintRuptureAt=-Infinity; b._glacierBurstAt=-Infinity; b._chill=0; b._chillAt=null; b.knock=0; b.phase3=false; b.phase4=false;
    if(isArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.shooter=false; b.bomber=false; b.acid=false; b.dasher=false; b.siege=false; b.dashState=null; b.myceliumBehemoth=this.stageIndex===6;b.hornetQueen=this.stageIndex===7;b.chronobloom=this.stageIndex===8;b.trueRootmother=this.stageIndex===9;
    b.atkCd=0.8; b.phase2=false;b._enraged=false;b._comboLock=false;b._phaseInvuln=0;b._phaseGateLocked=false;b._phaseShieldFx=null;b._phaseImmunePopAt=0;b.rage=null;b._rageBaseHp=0;b.rageCdMul=1; b.atks=this.stageIndex===0?['queen']:['slam','radial','aimed','charge','spiral','trap']; if(this.stageIndex>=1)b.atks.push('summon');
    b._drainMotion=this.stageIndex===1; b._drainMotionKind='boss'; b._breathe=0; b._baseScale=fScale;
    if(this.anims.exists(bkey+'_idle'))b.play(bkey+'_idle',true);else if(this.anims.exists(bkey+'_walk')){ b.play(bkey+'_walk',true); }else if(bkey==='boss6_rootmother'&&this.anims.exists('boss6_rootmother_idle'))(this.bossInkIdle?.(b)||b.play('boss6_rootmother_idle',true)); else if(b.anims){ b.anims.stop(); b.setFrame(0); }
    this.boss=b;this._bossEpoch=(this._bossEpoch||0)+1;b._big=null;b._bigHold=false;b._bigT=0;b._said=false;b._sayAt=0;b._sayI=-1; this.camWorld(b);this.applyBossRage(b,false);if(this.recipeMode&&this.recipeHas('twinboss'))this.time.delayedCall(900,()=>{if(this.state!=='play'||!this.boss)return;const g=this.spawnElite();if(g){g.hp*=6;g.maxhp=g.hp;g.setPosition(this.boss.x+120,this.boss.y);g.setScale((g.baseScale||1)*1.4);g.tintColor=0xb07aff;g.setTint(0xb07aff);this.showBanner('👥 Bodyguard','The boss brought a giant elite!',1600);}});this.bossUI.forEach(o=>o.setVisible(true));this.resetBossObjective();this._weakAcc=11;
    this.waveAlive=1; this.updateWaveText();
    if(this._pinnacleRun){ b.hp*=2; b.maxhp=b.hp; b.dmg=Math.round(b.dmg*1.4); b.spd=104; if(this.textures.exists('boss_pinnacle')){ if(b.anims)b.anims.stop(); b.setTexture('boss_pinnacle',0); b._pinnacleArt=true; b.tintColor=null; b.clearTint(); } else { b.tintColor=0x8a4dff; b.setTint(0x8a4dff); } b.setScale((b.baseScale||1.55)*1.25); b.baseScale=(b.baseScale||1.55)*1.25; b._baseScale=b.baseScale; }
    const _dvb=this.setupDelveBoss(b); if(_dvb){ if(this.bossName)this.bossName.setText('👹 '+(b.delveBoss==='warden'?'The Jelly Warden':'Madame Candlewick')+' · Floor '+this._amapNode.d); this.bossIntro(b,_dvb); return; }
    this.applyBossInk?.(b);this.bossIntro(b, this._pinnacleRun?'✦ PINNACLE · The Hunger Beneath':st.boss);
  }
