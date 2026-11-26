  // C1-1 Ant Empress · Tunnel: มุดดิน เงาไล่ตาม 2 วิ → หยุด → โผล่พุ่งขึ้น · เฟส 2 เงา 2 อัน (ตัวจริงมีกรดหยด)
  antTunnel(b){ const two=!!b.phase2,chase=2000,lock=b.phase3?800:950,hd=Math.round(22+this.stageIndex*6+(b.dmg||40)*.4);
    b._arenaBusy=true; b.knock=9; b.setVelocity(0,0); this.bossPose?.(b,2,600); this.showBanner('🕳️ Tunnel','She digs under you — walk out of the shadow before she bursts out!',1100);
    this.tweens.add({targets:b,alpha:.0,scale:b.scale*.6,duration:380,onComplete:()=>{ if(!b.active)return; if(b.body)b.body.enable=false;
      const sk=this.bpAnim?.('vfx_b01_burrow_shadow')?'vfx_b01_burrow_shadow':null,mk=(real)=>{ const s=this.arenaFx(this.camWorld(sk?this.add.sprite(this.player.x,this.player.y,sk,0).setDisplaySize(156,82).setDepth(2).setAlpha(real?1:.55):this.add.ellipse(this.player.x,this.player.y,140,74,0x1f3a12,.55).setStrokeStyle(3,real?0x75ff4b:0x5c7a4a,.9).setDepth(2))); if(sk){ s.play(sk); if(!real)s.setTint(0x8a9a7a); s._bx=s.scaleX; s._by=s.scaleY; } s._real=real; return s; };   /* v8.0.21 ใบ 48 A1 */
      const sh=[mk(true)]; if(two)sh.push(mk(false)); let t=0,dr=0;
      const ev=this.time.addEvent({delay:16,loop:true,callback:()=>{ t+=16; const p=this.player; sh.forEach((s,k)=>{ if(t<chase){ const tx=p.x+(k?Math.cos(t/300)*150:0),ty=p.y+(k?Math.sin(t/300)*90:0),a=Math.atan2(ty-s.y,tx-s.x),d=Math.hypot(tx-s.x,ty-s.y),v=Math.min(d,(k?260:210)*.016); s.x+=Math.cos(a)*v; s.y+=Math.sin(a)*v; }
            else { const k=1+Math.sin(t/40)*.06; s.setScale((s._bx||1)*k,(s._by||1)*k); } });
          if(two&&(dr+=16)>140){ dr=0; const s=sh[0],d=this.arenaFx(this.camWorld(this.add.circle(s.x+Phaser.Math.Between(-40,40),s.y-40,5,0x75ff4b,.9).setDepth(3))); this.tweens.add({targets:d,y:d.y+40,alpha:0,duration:420,onComplete:()=>d.destroy()}); }
          if(t>=chase+lock){ ev.remove(false); sh.forEach(s=>{ const real=s._real; if(real)this.bossSig?.('01_burrow_burst',s.x,s.y-10,180,{depth:s.y+2}); this.vfxHitRing?.(s.x,s.y,real?0x75ff4b:0x8a9a7a,real); if(real){ b.setPosition(s.x,s.y); if(b.body){b.body.enable=true;b.body.reset(s.x,s.y);} this.arenaHurt(hd,s.x,s.y,78); this.bossNovaWave?.(s.x,s.y,170,Math.round(hd*.6),120); this.screenShake?.(300,.016); }
              else this.arenaHurt(Math.round(hd*.4),s.x,s.y,60); s.destroy(); });
            this.tweens.add({targets:b,alpha:1,scale:b.scale/.6,duration:260}); b.knock=.6; b._arenaBusy=false; b.atkCd=1.6;
            this.spawnCounter(b,b.x+Phaser.Math.Between(-110,110),b.y+Phaser.Math.Between(60,120),{key:this.counterArt(b)||'nest_eggs',emoji:'🥚',tint:0x75ff4b,onHit:bb=>{this.bossPctHit(bb,.04);this.bossStun(bb,1.2,'Acid splash!');}}); } }}); }});
    b.atkCd=99; }
  // C1-5 Great Hunger · Feast: ดูดเข้าปาก 4 วิ + จานลอยเข้าปาก (ถึงปาก = บอสฟื้น 3%) · Dash เตะจาน = บอสสำลัก
  hungerFeast(b){ const n=b.phase2?5:4,pull=b.phase3?195:b.phase2?175:150; b._arenaBusy=true;
    this.stage5Pose?.(b,5,1400); this.showBanner('🍽️ The Feast','It pulls you in and eats the plates — dash into a plate to make it choke!',1200);
    this.drainPull={x:b.x,y:b.y,t:4.2,strength:pull}; this.bossSig?.('05_void_maw',b.x,b.y,240,{life:4.2,depth:2,alpha:.6});
    for(let i=0;i<n;i++){ const a=i*TAU/n+Math.random()*.4,r=Math.min(this.arenaVw()*.45,400);
      this.spawnCounter(b,b.x+Math.cos(a)*r,b.y+Math.sin(a)*r,{emoji:['🍰','🍗','🍩','🍮','🥧'][i%5],frame:i%5,tint:0xffb36b,drift:62+i*6,
        onArrive:bb=>{ if(!bb.active)return; const h=Math.round(bb.maxhp*.03); bb.hp=Math.min(bb.maxhp,bb.hp+h); this.popDmg?.('+3% HP',bb.x,bb.y-70,false); this.vfxHitRing?.(bb.x,bb.y,0x6dffb4,false); },
        onHit:bb=>{ this.bossPctHit(bb,.03); this.bossStun(bb,1.2,'Choking!'); this.drainPull=null; }}); }
    this.time.delayedCall(4400,()=>{ b._arenaBusy=false; }); b.atkCd=4.6; }
  /* v7.9.15 กลไกสนามที่เหลือ (docs/BOSS_ARENA_MECHANICS.md) · เครื่องมือกลาง: arenaTick / Sweep / Grid / Rings / Hands / Fog / Pillars / Pods / Decoys */
  arenaDmg(b,mul=1){ return Math.round((16+this.stageIndex*6)*(b.isBoss?1:.9)*(b._pinnacleArt||this._pinnacleRun?1.15:1)*mul); }
  arenaView(){ const v=this.cameras.main.worldView; return {x:v.x,y:v.y,w:v.width,h:v.height,cx:v.centerX,cy:v.centerY}; }
  arenaTick(fn){ (this._arenaTicks||(this._arenaTicks=[])).push(fn); }
  runArenaTicks(dt){ const L=this._arenaTicks; if(!L||!L.length)return; this._arenaTicks=L.filter(f=>{ try{ return f(dt)!==false; }catch(e){ return false; } }); }
  arenaEnd(b,ms,cd=1.4){ this.time.delayedCall(ms,()=>{ if(b?.active){ b._arenaBusy=false; b.atkCd=Math.min(b.atkCd??cd,cd); } }); }
  // T2 Sweep: แถบกวาดข้ามจอ มีช่องลอด (ตะแกรง) · dir 'h' = แถบแนวนอนเลื่อนลง/ขึ้น · 'v' = แถบแนวตั้งเลื่อนซ้าย/ขวา
  arenaSweep(b,{dir='h',rev=false,warn=1500,dur=2400,gapW=170,band=70,color=0x6bd07a,dmg,art}={}){ art=art&&this.bpAnim?.(art)?(this.battleOutlineKey?.(art)||art):null; let S=null;   /* v7.9.29 ใบ 30: แถบภาพ 2 ท่อน (ซ้าย/ขวาของช่อง) ตอนกวาดจริง */ const V=this.arenaView(),p=this.player,hz=dir==='h',len=(hz?V.w:V.h)+200,gapC=hz?Phaser.Math.Clamp(p.x+Phaser.Math.Between(-120,120),V.x+gapW,V.x+V.w-gapW):Phaser.Math.Clamp(p.y+Phaser.Math.Between(-120,120),V.y+gapW,V.y+V.h-gapW);
    const start=hz?(rev?V.y+V.h+band:V.y-band):(rev?V.x+V.w+band:V.x-band),end=hz?(rev?V.y-band:V.y+V.h+band):(rev?V.x-band:V.x+V.w+band);
    const mk=()=>{ const g=this.arenaFx(this.camWorld(this.add.graphics().setDepth(9000))); return g; },g=mk(); let t=-warn,hit=false;Sfx.orderCue?.('arena_warn',.3,.5); dmg=dmg??this.arenaDmg(b);
    const band2=(pos,gl,gr)=>{ if(!S)S=[0,1].map(()=>{const q=this.arenaFx(this.camWorld(this.add.sprite(0,0,art,0).setOrigin(0,.5).setDepth(9000)));q.play(art);this.battleOutlineTrack?.(q,art,art,null,true);return q;}); const H=band*1.5;
      if(hz){ const x0=V.x-100; S[0].setPosition(x0,pos).setRotation(0).setDisplaySize(Math.max(1,gl-x0),H); S[1].setPosition(gr,pos).setRotation(0).setDisplaySize(Math.max(1,V.x+V.w+100-gr),H); }
      else { const y0=V.y-100; S[0].setPosition(pos,y0).setRotation(Math.PI/2).setDisplaySize(Math.max(1,gl-y0),H); S[1].setPosition(pos,gr).setRotation(Math.PI/2).setDisplaySize(Math.max(1,V.y+V.h+100-gr),H); } };
    const draw=(pos,a)=>{ g.clear(); const gl=gapC-gapW/2,gr=gapC+gapW/2; if(art&&a>=.7){ band2(pos,gl,gr); g.lineStyle(3,0xffffff,a*.8); if(hz)g.strokeRect(gl,pos-band/2,gapW,band); else g.strokeRect(pos-band/2,gl,band,gapW); return; } g.fillStyle(color,a); if(hz){ const x0=V.x-100; g.fillRect(x0,pos-band/2,gl-x0,band); g.fillRect(gr,pos-band/2,V.x+V.w+100-gr,band); g.lineStyle(3,0xffffff,a*.8).strokeRect(gl,pos-band/2,gapW,band); }
      else { const y0=V.y-100; g.fillRect(pos-band/2,y0,band,gl-y0); g.fillRect(pos-band/2,gr,band,V.y+V.h+100-gr); g.lineStyle(3,0xffffff,a*.8).strokeRect(pos-band/2,gl,band,gapW); } };
    // เตือน: เส้นบางทั้งแนว + ช่องตะแกรงเรือง
    this.arenaTick(dt=>{ if(!g.active)return false; t+=dt*1000; if(t<0){ draw(start+(hz?(rev?-1:1):(rev?-1:1))*band*.6,.25+.2*Math.sin(t/60)); return true; }
      Sfx.eventLoopStart?.('arena_sweep',.13);const k=Math.min(1,t/dur),pos=start+(end-start)*k; draw(pos,.75); const pp=hz?p.y:p.x,pq=hz?p.x:p.y;
      if(!hit&&Math.abs(pp-pos)<band/2+6&&Math.abs(pq-gapC)>gapW/2+6){   /* v7.9.61 ขอบช่องให้อภัยขึ้น (เดิมต้องอยู่ลึกเข้าไป 10px) */ hit=true; this.hurtPlayer(dmg,hz?(rev?-Math.PI/2:Math.PI/2):(rev?Math.PI:0)); }
      if(k>=1){Sfx.eventLoopStop?.('arena_sweep'); g.destroy(); S?.forEach(q=>q.destroy()); return false; } return true; }); return warn+dur; }
  // T1 Grid: ช่องสี่เหลี่ยมรอบผู้เล่น สว่างตามลาย แล้วระเบิด · patterns = ฟังก์ชัน (c,r)=>bool ทีละรอบ
  arenaGrid(b,{n=5,cell=86,warn=1300,gap=600,patterns,color=0xff7a3a,dmg,art}={}){ art=art&&this.bpAnim?.(art)?(this.battleOutlineKey?.(art)||art):null;   /* v7.9.29 ใบ 30: ช่องเมล็ด (เฟรม 0–1 เตือน · 2–5 แทงขึ้น) */ const p=this.player,ox=p.x-cell*n/2,oy=p.y-cell*n/2; dmg=dmg??this.arenaDmg(b); let t=0;
    patterns.forEach((pat,i)=>this.time.delayedCall(i*(warn+gap),()=>{ if(!b.active)return;Sfx.orderCue?.('arena_warn',.3,.5); const cells=[];
      for(let c=0;c<n;c++)for(let r=0;r<n;r++)if(pat(c,r)){ const x=ox+c*cell+cell/2,y=oy+r*cell+cell/2,q=this.arenaFx(this.camWorld(this.add.rectangle(x,y,cell-6,cell-6,color,.16).setStrokeStyle(2,color,.9).setDepth(3))); cells.push(q);
        if(art){ q.setFillStyle(color,0).setStrokeStyle(1,color,.35); const sp=this.arenaFx(this.camWorld(this.add.sprite(x,y,art,0).setDisplaySize(cell*1.15,cell*1.15).setDepth(3))); q._art=sp; this.tweens.add({targets:sp,alpha:{from:.55,to:1},duration:warn/4,yoyo:true,repeat:1,onComplete:()=>{if(sp.active)sp.setFrame(1);}}); }
        else this.tweens.add({targets:q,fillAlpha:{from:.12,to:.45},duration:warn/3,yoyo:true,repeat:1}); }
      this.time.delayedCall(warn,()=>{if(b.active)Sfx.orderCue?.('arena_grid_burn',.35,.3); let hurt=false; for(const q of cells){ if(!q.active)continue; if(!hurt&&Math.abs(p.x-q.x)<cell/2&&Math.abs(p.y-q.y)<cell/2){ hurt=true; this.hurtPlayer(dmg,0); }
          if(q._art?.active){ const sp=q._art; q.destroy(); sp.setAlpha(1).play({key:art,startFrame:2});this.battleOutlineTrack?.(sp,art,art);if(sp._battleOutline810){sp._battleOutline810.t=2/sp._battleOutline810.rate;this.battleOutlineFrame?.(sp,0);} sp.once('animationcomplete',()=>sp.destroy()); continue; }
          q.setFillStyle(0xffffff,.8); this.tweens.add({targets:q,alpha:0,duration:220,onComplete:()=>q.destroy()}); } this.screenShake?.(120,.006); }); }));
    return patterns.length*(warn+gap); }
  // T3 Rings: วงแหวนซ้อนรอบผู้เล่น แต่ละวงมีช่องเดียว หมุนคนละทิศ แล้วหดเข้าหาตัว · แตะขอบวง (นอกช่อง) = โดน
  arenaRings(b,{rings=2,r0=230,shrink=3400,warn=1100,gapA=.75,color=0xd8b25a,dmg,cx,cy,art}={}){ art=art&&this.bpAnim?.(art)?(this.battleOutlineKey?.(art)||art):null;   /* v7.9.29 ใบ 30: ท่อนวงเรียงตามขอบ (นอกช่อง) */ const p=this.player; cx=cx??p.x; cy=cy??p.y; dmg=dmg??this.arenaDmg(b); const g=this.arenaFx(this.camWorld(this.add.graphics().setDepth(9000)));
    const R=Array.from({length:rings},(_,i)=>({r:r0+i*85,a:Math.random()*TAU,s:(i%2?-1:1)*(.9+i*.25),hit:false})); let t=-warn,sounded=false;Sfx.orderCue?.('arena_warn',.3,.5);
    if(art)for(const q of R){ const n=Math.max(8,Math.ceil((TAU-gapA)*q.r/100)); q.seg=Array.from({length:n},()=>{const sp=this.arenaFx(this.camWorld(this.add.sprite(cx,cy,art,0).setDepth(9000)));sp.play(art);this.battleOutlineTrack?.(sp,art,art,null,true);return sp;}); }
    this.arenaTick(dt=>{ if(!g.active)return false; t+=dt*1000; if(t>=0&&!sounded){sounded=true;Sfx.orderCue?.('arena_ring_close',.32,.5);}const k=t<0?0:Math.min(1,t/shrink); g.clear();
      for(const q of R){ q.a+=q.s*dt; const rr=q.r*(1-k*.82);
        if(q.seg){ const n=q.seg.length,span=TAU-gapA,sw=span*rr/n*1.12; q.seg.forEach((sp,j)=>{ const th=q.a+gapA/2+span*(j+.5)/n; sp.setPosition(cx+Math.cos(th)*rr,cy+Math.sin(th)*rr).setRotation(th+Math.PI/2).setDisplaySize(sw,t<0?14:30).setAlpha(t<0?.5:1); }); }
        else { g.lineStyle(t<0?3:9,color,t<0?.45:.9); g.beginPath(); g.arc(cx,cy,rr,q.a+gapA/2,q.a+TAU-gapA/2,false); g.strokePath(); }
        if(t>=0&&!q.hit){ const d=Math.hypot(p.x-cx,p.y-cy),an=Phaser.Math.Angle.Wrap(Math.atan2(p.y-cy,p.x-cx)-q.a); if(Math.abs(d-rr)<14&&Math.abs(an)>gapA/2){ q.hit=true; this.hurtPlayer(dmg,Math.atan2(p.y-cy,p.x-cx)); } } }
      if(k>=1){ g.destroy(); R.forEach(q=>q.seg?.forEach(sp=>sp.destroy())); return false; } return true; }); return warn+shrink; }
  // T2 หมุน: เข็มนาฬิกา 2 เข็มหมุนรอบบอส (ยาวช้า · สั้นเร็ว) · แตะเข็ม = โดน (กันโดนซ้ำ .8 วิ)
  arenaHands(b,{dur=5200,warn=1400,long=520,short=330,sl=.9,ss=-1.7,color=0xffd166,dmg}={}){ const g=this.arenaFx(this.camWorld(this.add.graphics().setDepth(9000))),p=this.player; dmg=dmg??this.arenaDmg(b); Sfx.orderCue?.('arena_warn',.3,.5);let soundTick=0,t=-warn,cd=0,aL=Math.atan2(p.y-b.y,p.x-b.x)+1.6,aS=aL+Math.PI;
    const seg=(x,y,a,l)=>{ const ex=x+Math.cos(a)*l,ey=y+Math.sin(a)*l,dx=ex-x,dy=ey-y,u=Phaser.Math.Clamp(((p.x-x)*dx+(p.y-y)*dy)/(dx*dx+dy*dy),0,1); return Math.hypot(p.x-(x+dx*u),p.y-(y+dy*u)); };
    const hk=['vfx_b09_clock_hand_long','vfx_b09_clock_hand_short'].map(k=>this.bpAnim?.(k)?(this.battleOutlineKey?.(k)||k):null),HS=hk.map(k=>{ if(!k)return null; const q=this.arenaFx(this.camWorld(this.add.sprite(b.x,b.y,k,0).setOrigin(0,.5).setDepth(9000))); q.play(k);this.battleOutlineTrack?.(q,k,k,null,true);return q; });   /* v8.0.21 ใบ 48 A9/A10 */
    this.arenaTick(dt=>{ if(!g.active||!b.active){g.destroy?.();HS.forEach(q=>q?.destroy());return false;} t+=dt*1000; cd-=dt; if(t>=0){if((soundTick-=dt)<=0){soundTick=.5;Sfx.orderCue?.('arena_clock_tick',.13,.45);}aL+=sl*dt;aS+=ss*dt;} g.clear();
      for(const [a,l,w,hi] of [[aL,long,14,0],[aS,short,10,1]]){ const hs=HS[hi]; if(hs?.active)hs.setPosition(b.x,b.y).setRotation(a).setDisplaySize(l,w*2.2).setAlpha(t<0?.4:1); else { g.lineStyle(t<0?3:w,color,t<0?.4:.9); g.lineBetween(b.x,b.y,b.x+Math.cos(a)*l,b.y+Math.sin(a)*l); } if(t>=0&&cd<=0&&seg(b.x,b.y,a,l)<w+12){ cd=.8; this.hurtPlayer(dmg,a+Math.PI/2); } }
      if(t>=dur){ g.destroy(); HS.forEach(q=>q?.destroy()); return false; } b.setVelocity?.(0,0); return true; }); b.knock=Math.max(b.knock||0,(warn+dur)/1000); return warn+dur; }
  /* v8.2.2 เจ้าของ: ระเบิดสปอร์ตอนบอสร่ายจบต้องรู้สึกแรง → คลื่นวงแหวน 3 ชั้นจากตัวบอสกวาดทั้งจอ + ฟองที่ปลอดภัยสั่น (ภาพเท่านั้น · ดาเมจคิดที่ hurtPlayer เดิม) */
  arenaFogBlastRings(b,color,pocket){ if(!this.add?.graphics||!this.tweens)return; const V=this.arenaView?.()||{w:this.W,h:this.H},R=Math.hypot(V.w||this.W,V.h||this.H);
    for(let i=0;i<3;i++){ const g=this.camWorld(this.add.graphics().setDepth(8995)); const st={r:30}; this.tweens.add({targets:st,r:R,delay:i*110,duration:520+i*90,ease:'Cubic.out',onUpdate:()=>{ if(!g.active)return; const k=1-st.r/R; g.clear(); g.lineStyle(26*k+4,color,.55*k+.1).strokeCircle(b.x,b.y,st.r); g.lineStyle(4,0xffffff,.8*k).strokeCircle(b.x,b.y,st.r*.97); },onComplete:()=>g.destroy()}); }
    if(pocket){ const ring=this.camWorld(this.add.circle(pocket.x,pocket.y,(pocket.r||90),0xffffff,0).setStrokeStyle(6,0xeafff2,.9).setDepth(8996)); this.tweens.add({targets:ring,scale:1.18,alpha:0,duration:380,yoyo:false,onComplete:()=>ring.destroy()}); } }
  // Timed shelter: fixed distant air pocket, stationary boss, one clearly warned blast.
  arenaFogPocket(b,r){const p=this.player,V=this.arenaView(),away=Math.atan2(p.y-b.y,p.x-b.x),clear=r+(b.body?.halfWidth||70)+80;let best=null,score=Infinity;
    for(let i=0;i<24;i++)for(const reach of [180,260,clear+12,340]){const a=away+i*TAU/24,pt=inMapPt(p.x+Math.cos(a)*reach,p.y+Math.sin(a)*reach),q={x:pt[0],y:pt[1],r};if(this.dist(q.x,q.y,b.x,b.y)<clear)continue;let blocked=false;this.solidProps?.children.iterate(o=>{if(o?.active&&this.dist(o.x,o.y,q.x,q.y)<135)blocked=true;});if(blocked)continue;const outside=Math.max(0,V.x+24-q.x,q.x-(V.x+V.w-24))+Math.max(0,V.y+24-q.y,q.y-(V.y+V.h-24)),value=this.dist(p.x,p.y,q.x,q.y)+outside*4;if(value<score){score=value;best=q;}}return best;
  }
  holdArenaFogBoss(b){const q=b?._fogCharge;if(!q)return false;if(q!==this._arenaFogCast||q.player!==this.player||q.stage!==this.stageIndex||q.epoch!==(this._artEpoch||0)){this.endArenaFog(q);return false;}b.setVelocity?.(0,0);b.setPosition(q.bx,q.by);if(b.anims?.isPlaying)b.anims.stop();if(!b._bossInk)b.setFrame?.(q.burst?7:6);return true;}
  endArenaFog(q){if(!q)return;if(q.shutdown)this.events?.off('shutdown',q.shutdown);if(q.b?._fogCharge===q){q.b._fogCharge=null;q.b._arenaBusy=false;q.b.atkCd=Math.max(q.b.atkCd||0,1.2);if(q.b.active){if(this.bossInkIdle?.(q.b)){}else if(this.anims?.exists('boss7_mycelium_behemoth_walk'))q.b.play?.('boss7_mycelium_behemoth_walk',true);else q.b.setFrame?.(0);}}for(const o of [q.fog,q.tile,q.bubble,q.label])if(o?.active)o.destroy();if(this._arenaFogCast===q){this._arenaFogCast=null;Sfx.eventLoopStop?.('arena_fog');}}
  arenaFog(b,{dur=4000,r=120,color=0x6a3a8a,dmg}={}){
    if(this._arenaFogCast)this.endArenaFog(this._arenaFogCast);const pocket=this.arenaFogPocket(b,r);if(!pocket)return 600;const V=this.arenaView(),p=this.player,fog=this.arenaFx(this.camWorld(this.add.graphics().setDepth(8990))),q=this._arenaFogCast={b,player:p,stage:this.stageIndex,epoch:this._artEpoch||0,bx:b.x,by:b.y,pocket,fog,t:0,burst:false};b._fogCharge=q;this.holdArenaFogBoss(b);this.behemothPose?.(b,6,dur+600);dmg=dmg??Math.round(this.arenaDmg(b)*2.4);   // v8.2.2 เจ้าของ: ระเบิดตอนบอสร่ายจบแรงขึ้น ×1.6→×2.4
    q.shutdown=()=>this.endArenaFog(q);this.events?.once('shutdown',q.shutdown);
    if(this.textures.exists('vfx_b07_fog_tile'))q.tile=this.arenaFx(this.camWorld(this.add.tileSprite(V.x-60,V.y-60,V.w+120,V.h+120,'vfx_b07_fog_tile',0).setOrigin(0,0).setDepth(8990).setAlpha(.3)));
    if(this.codeBubbleOn?.()){q.bubble=this.arenaFx(this.camWorld(this.add.image(pocket.x,pocket.y,'code_bubble').setDepth(8991).setDisplaySize(r*2,r*2).setAlpha(.9)));this.tweens.add({targets:q.bubble,scaleX:q.bubble.scaleX*1.05,scaleY:q.bubble.scaleY*.95,duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
    else if(this.bpAnim?.('vfx_b07_air_bubble')){q.bubble=this.arenaFx(this.camWorld(this.add.sprite(pocket.x,pocket.y,'vfx_b07_air_bubble',0).setDepth(8991).setDisplaySize(r*2.1,r*2.1)));q.bubble.play('vfx_b07_air_bubble');}
    q.label=this.arenaFx(this.camWorld(this.add.text(pocket.x,pocket.y,'SAFE AIR · '+(dur/1000).toFixed(1),{fontFamily:'sans-serif',fontSize:'18px',fontStyle:'bold',color:'#eafff2',stroke:'#173b35',strokeThickness:5}).setOrigin(.5).setDepth(8993)));
    this.bossInkPose?.(b,2,dur,'wind');Sfx.orderCue?.('arena_warn',.35,.5);Sfx.eventLoopStart?.('arena_fog',.1);
    this.arenaTick(dt=>{if(!fog.active||!b.active||q!==this._arenaFogCast||this.player!==p||this.stageIndex!==q.stage||q.epoch!==(this._artEpoch||0)||['dead','menu','summary'].includes(this.state)){this.endArenaFog(q);return false;}if(this.state!=='play')return true;q.t+=dt*1000;this.holdArenaFogBoss(b);const W=this.arenaView(),left=Math.max(0,(dur-q.t)/1000),safe=this.dist(p.x,p.y,pocket.x,pocket.y)<=r;fog.clear();
      if(q.tile?.active){q.tile.setPosition(W.x-60,W.y-60).setSize(W.w+120,W.h+120).setTilePosition(W.x-60,W.y-60).setFrame(Math.floor(q.t/125)%4).setAlpha(q.burst?.85:.25+.35*q.t/dur);}else{fog.fillStyle(color,q.burst?.55:.15+.22*q.t/dur);fog.fillRect(W.x-60,W.y-60,W.w+120,W.h+120);}
      const cx=pocket.x,cy=pocket.y;if(!q.bubble){const q=pocket;fog.fillStyle(0xeafff2,.22);fog.fillCircle(q.x,q.y,q.r);}fog.lineStyle(4,safe?0xeafff2:0x9fffd2,.95).strokeCircle(cx,cy,r);fog.lineStyle(5,0xffd166,.9).beginPath().arc(b.x,b.y,(b.body?.halfWidth||70)+30,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,q.t/dur)).strokePath();
      if(cx<W.x+24||cx>W.x+W.w-24||cy<W.y+24||cy>W.y+W.h-24){const dx=cx-p.x,dy=cy-p.y,len=Math.hypot(dx,dy)||1,edge=Math.min((W.w/2-28)/Math.max(.01,Math.abs(dx/len)),(W.h/2-28)/Math.max(.01,Math.abs(dy/len))),x=W.cx+dx/len*edge,y=W.cy+dy/len*edge;fog.lineStyle(5,0xbfffe0,1).lineBetween(x-dx/len*28,y-dy/len*28,x,y).strokeCircle(x,y,10);}
      q.label.setText(q.burst?(safe?'SAFE!':'SPORE BLAST!'):(safe?'SAFE · ':'HIDE · ')+left.toFixed(1)+'s');
      if(!q.burst&&q.t>=dur){q.burst=true;this.bossInkPose?.(b,3,600,'strike');Sfx.orderCue?.('arena_warn',.55,.1);this.vfxHitRing?.(b.x,b.y,color,true);this.screenFlash?.(color,.55,420);this.screenShake?.(420,.02);this.hitStop?.(90);this.arenaFogBlastRings?.(b,color,q.pocket);if(!safe)this.hurtPlayer(dmg,.8);if(q!==this._arenaFogCast)return false;}
      if(q.t>=dur+600){this.endArenaFog(q);return false;}return true;});return dur+600;
  }
  // T4 Pillars + ลมหายใจทั้งจอ: หลบหลังเสา (เสาอยู่ระหว่างบอสกับผู้เล่น) · เสาบังได้ครั้งเดียวแล้วแตก
  arenaPillars(b,{n=3,warn=1800,color=0x9fe0ff,dmg}={}){ const p=this.player; dmg=dmg??Math.round(this.arenaDmg(b)*1.3); const P=[];Sfx.orderCue?.('arena_warn',.3,.5);
    for(let i=0;i<n;i++){ const a=Math.atan2(p.y-b.y,p.x-b.x)+(i-(n-1)/2)*.9,d=Math.min(260,this.dist(b.x,b.y,p.x,p.y)*.6+90),x=b.x+Math.cos(a)*d,y=b.y+Math.sin(a)*d;
      const s=this.arenaFx(this.camWorld(this.add.rectangle(x,y,40,70,color,.85).setStrokeStyle(3,0xffffff,.9).setDepth(y))); P.push(s);
      if(this.textures.exists('arena_b04_ice_pillar')){ s.setAlpha(0); const a=s._art=this.arenaFx(this.camWorld(this.add.sprite(x,y+35,'arena_b04_ice_pillar',0).setOrigin(.5,.9375).setDisplaySize(52,78).setDepth(y))),sy=a.scaleY; this.tweens.add({targets:a,scaleY:{from:sy*.1,to:sy},duration:300}); s.once('destroy',()=>{ if(a.active&&!a._breaking)a.destroy(); }); }   /* v8.0.21 ใบ 48 B1 — rect ล่องหนคงตำแหน่ง/hit เดิม */
      else this.tweens.add({targets:s,scaleY:{from:.1,to:1},duration:300}); }
    const fk=this.bpAnim?.('vfx_b04_frost_breath')?(this.battleOutlineKey?.('vfx_b04_frost_breath')||'vfx_b04_frost_breath'):null,fan=this.arenaFx(this.camWorld(fk?this.add.sprite(b.x,b.y,fk,0).setDisplaySize(60,60).setDepth(2).setAlpha(.5):this.add.circle(b.x,b.y,30,color,.12).setDepth(2))); if(fk){ const f0=fan.scaleX; this.tweens.add({targets:fan,scaleX:f0*28,scaleY:f0*28,alpha:.85,duration:warn}); } else this.tweens.add({targets:fan,scale:28,alpha:.28,duration:warn});   /* v8.0.21 ใบ 48 A5 */
    this.time.delayedCall(warn,()=>{ if(fk&&fan.active){ fan.play({key:fk,startFrame:1});this.battleOutlineTrack?.(fan,'vfx_b04_frost_breath',fk);if(fan._battleOutline810){fan._battleOutline810.t=1/12;this.battleOutlineFrame?.(fan,0);} fan.once('animationcomplete',()=>fan.destroy()); } else fan.destroy(); if(!b.active){P.forEach(s=>s.destroy());return;} Sfx.orderCue?.('arena_freeze_breath',.35,.6);const a=Math.atan2(p.y-b.y,p.x-b.x),dP=this.dist(b.x,b.y,p.x,p.y);
      const cover=P.find(s=>{ const ds=this.dist(b.x,b.y,s.x,s.y); if(ds>dP)return false; const aa=Math.atan2(s.y-b.y,s.x-b.x),ang=Math.abs(Phaser.Math.Angle.Wrap(aa-a)); return Math.sin(ang)*dP<44&&ang<Math.PI/2; });
      this.screenFlash?.(color,.35,300); this.screenShake?.(260,.012); if(cover){Sfx.orderCue?.('arena_pillar_crack',.35,.3); this.popDmg?.('Blocked!',cover.x,cover.y-50,true); const a=cover._art; if(a?.active){ a._breaking=true; a.setFrame(1); this.time.delayedCall(160,()=>{ if(a.active)a.setFrame(2); }); this.time.delayedCall(320,()=>{ if(a.active){ a.setFrame(3); this.tweens.add({targets:a,alpha:0,duration:260,onComplete:()=>a.destroy()}); } }); } cover.destroy(); } else this.hurtPlayer(dmg,a);
      this.time.delayedCall(2200,()=>P.forEach(s=>s.active&&s.destroy())); }); return warn+400; }
  // T4 Pods: ฝักเกราะ 3 ฝักรอบบอส (บอสโดนเบาลง 70%) · Dash เตะฝักใส่บอส = ฝักแตก · ไม่แตกใน 8 วิ = สปอร์ระเบิดรอบตัว
  arenaPods(b,{n=3,emoji='🌰',tint=0x9be86b,life=11}={}){ const had=(b._podShield||0)>0; b._podShield=(b._podShield||0)+n; this.popDmg?.('Shielded!',b.x,b.y-70,true);Sfx.orderCue?.('arena_warn',.3,.5);if(!had)this.arenaTick(()=>{if(!b.active||!b._podShield){Sfx.eventLoopStop?.('arena_pod_shield');return false;}Sfx.eventLoopStart?.('arena_pod_shield',.1);return true;});
    const cbS=this.codeBubbleOn?.();
    if(!had&&(cbS||this.bpAnim?.('vfx_b06_pod_shield'))){ const sk=cbS?'code_bubble':(this.battleOutlineKey?.('vfx_b06_pod_shield')||'vfx_b06_pod_shield'),sd=this.arenaFx(this.camWorld(cbS?this.add.image(b.x,b.y,sk).setTint(0xc8ffd0).setAlpha(.9):this.add.sprite(b.x,b.y,sk,0)).setDepth((b.depth||0)+1));if(!cbS){sd.play(sk);this.battleOutlineTrack?.(sd,'vfx_b06_pod_shield',sk,null,true);} this.arenaTick(()=>{ if(!sd.active)return false; if(!b.active||!(b._podShield>0)){ this.tweens.add({targets:sd,alpha:0,scale:sd.scale*1.3,duration:240,onComplete:()=>sd.destroy()}); return false; } const D=Math.max(150,(b.displayWidth||120)*1.35); sd.setPosition(b.x,b.y).setDisplaySize(D,D).setDepth((b.depth||0)+1); return true; }); }   /* v8.0.21 ใบ 48 A6 */
    for(let i=0;i<n;i++){ const a=i*TAU/n+Math.random()*.5,x=b.x+Math.cos(a)*170,y=b.y+Math.sin(a)*170;
      const c=this.spawnCounter(b,x,y,{emoji,tint,life,onHit:bb=>{ bb._podShield=Math.max(0,(bb._podShield||0)-1); this.bossPctHit(bb,.02); if(!bb._podShield){Sfx.orderCue?.('arena_shield_break',.4,.4);Sfx.eventLoopStop?.('arena_pod_shield'); this.bossStun(bb,1.2,'Shield broken!'); } }});
      if(!c)b._podShield=Math.max(0,b._podShield-1); }
    this.time.delayedCall(life*1000+200,()=>{ if(b.active&&b._podShield>0){ b._podShield=0; this.bossNovaWave?.(b.x,b.y,240,this.arenaDmg(b),0); } }); }
  // T5 Decoys: บอสหายเป็น 3 ร่าง ร่างจริงหยดน้ำหวาน · ร่างหลอกยิงได้แต่ตีไม่เข้า
  arenaDecoys(b,{n=3,dur=6500,tint=0xc98aa8}={}){ const p=this.player,spots=[];for(let i=0;i<n;i++){const a=i*TAU/n+Math.random()*.6;spots.push([p.x+Math.cos(a)*230,p.y+Math.sin(a)*170]);}
    const real=Phaser.Math.Between(0,n-1),F=[]; b.setPosition(...spots[real]); b.body?.reset(...spots[real]);
    spots.forEach((s,i)=>{ if(i===real)return; const f=this.arenaFx(this.camWorld(this.add.image(s[0],s[1],b.texture.key,b.frame?.name).setScale(b.scaleX,b.scaleY).setDepth(s[1]).setAlpha(.92))); if(b.tintColor)f.setTint(b.tintColor); F.push(f); });
    const dk=this.battleOutlineKey?.('vfx_b12_nectar_drip')||'vfx_b12_nectar_drip',drip=this.bpAnim?.(dk)?this.arenaFx(this.camWorld(this.add.sprite(b.x,b.y+26,dk,0).setDisplaySize(72,72).setDepth(b.depth+1))):null; if(drip){drip.play(dk);this.battleOutlineTrack?.(drip,'vfx_b12_nectar_drip',dk,null,true);}   /* v7.9.29 ใบ 30 หยดน้ำหวานใต้ตัวจริง */
    let dr=0,sh=1.4; this.arenaTick(dt=>{ if(!b.active){F.forEach(f=>f.destroy());drip?.destroy();return false;} dr+=dt; sh-=dt; if(drip?.active)drip.setPosition(b.x,b.y+26).setDepth(b.depth+1);
      if(!drip&&dr>.16){ dr=0; const d=this.arenaFx(this.camWorld(this.add.circle(b.x+Phaser.Math.Between(-30,30),b.y+20,5,0xffd166,.95).setDepth(b.depth+1))); this.tweens.add({targets:d,y:d.y+40,alpha:0,duration:500,onComplete:()=>d.destroy()}); }
      if(sh<=0){ sh=1.8; for(const o of [b,...F]){ const a=Math.atan2(p.y-o.y,p.x-o.x); for(let k=-1;k<=1;k++)this.foeShot(o.x,o.y,a+k*.22,240,Math.round(this.arenaDmg(b)*.55),tint,1); } }
      if((dur-=dt*1000)<=0){Sfx.orderCue?.('arena_decoy_reveal',.35,.4); drip?.destroy(); F.forEach(f=>{ this.tweens.add({targets:f,alpha:0,duration:300,onComplete:()=>f.destroy()}); }); return false; } return true; });
    return dur; }
  // แต่ละบอส: เลือกกลไกตามด่าน · คืนเวลาที่ใช้ (ms) · ใช้ร่วม Counter Object จากตัวนำร่อง
  arenaMech(b){ const si=this.stageIndex,pin=!!(b._pinnacleArt||this._pinnacleRun),p2=!!b.phase2,p3=!!b.phase3; b._arenaBusy=true; let ms=3000;
    const banner=(n,h)=>this.showBanner(n,h,1100),counter=(emoji,tint,label,pct=.03)=>this.time.delayedCall(Math.max(600,ms-400),()=>{ if(b.active)this.spawnCounter(b,this.player.x+Phaser.Math.Between(-100,100),this.player.y+Phaser.Math.Between(-80,80),{emoji,tint,onHit:bb=>{this.bossPctHit(bb,pct);this.bossStun(bb,1.2,label);}}); });
    const pick=a=>Phaser.Utils.Array.GetRandom(a);
    if(pin){ const m=pick(p3?['jaws','tongue','jaws']:['jaws','tongue']);
      if(m==='jaws'){ banner('🦷 Closing Jaws','The teeth close in — stay inside the safe circle and slip through the gap!'); ms=this.arenaRings(b,{rings:p3?3:2,r0:300,shrink:3800,color:0xb46cff,art:'vfx_bpin_jaw_ring'}); }
      else { banner('👅 The Tongue','It sweeps across the screen — line up with the open gap!'); ms=this.arenaSweep(b,{dir:'h',color:0xd95cff,band:90,art:'vfx_bpin_tongue'}); if(p2){ this.time.delayedCall(1400,()=>{ if(b.active)this.arenaSweep(b,{dir:'v',rev:true,color:0xd95cff,band:90,art:'vfx_bpin_tongue'}); }); ms+=1400; } }
      counter('🍖',0xd95cff,'Choking!',.03); }
    else if(si===1){ banner('🌊 Sewer Flood','Sludge sweeps across the screen — stand in the grate gap!'); /* v7.9.61 เจ้าของ: หลบยาก → ช้าลง ~40% ช่องกว้างขึ้น เตือนนานขึ้น รอบสอง (P2) เริ่มหลังรอบแรกจบ */ const SW={color:0x6bd07a,warn:1900,dur:3800,gapW:250,band:60,art:'vfx_b02_sludge_band'}; ms=this.arenaSweep(b,{dir:'h',...SW}); if(p2)this.time.delayedCall(ms+400,()=>{ if(b.active)this.arenaSweep(b,{dir:'v',rev:true,...SW}); }); ms+=p2?ms+400:0; counter('🧽',0x74e3cf,'Clogged!'); }
    else if(si===2){ banner('🔥 Hot Grid','Red tiles light up, then burn — step onto the dark ones!'); const chk=(o)=>(c,r)=>(c+r)%2===o,row=(c,r)=>r%2===0,col=(c,r)=>c%2===1;
      ms=this.arenaGrid(b,{patterns:p2?[chk(0),chk(1),row,col]:[chk(0),chk(1),row],warn:p3?1100:1300,art:'vfx_b03_hot_tile'}); counter('🍳',0xff7a3a,'Oil splash!'); }
    else if(si===3){ banner('🧊 Frost Breath','The Golem breathes ice over everything — hide behind a pillar!'); ms=this.arenaPillars(b,{n:p2?2:3}); counter('🧊',0x9fe0ff,'Frozen!'); }
    else if(si===5){ banner('🌰 Spore Pods','Three pods shield the Bud — dash into them to break the shield!'); this.arenaPods(b,{n:3}); ms=1600; }
    else if(si===6){ banner('🫧 Spore Cataclysm','The Behemoth is charging! Reach the safe bubble before the blast!'); ms=this.arenaFog(b,{}); counter('🍄',0xb46cff,'Bonk!'); }
    else if(si===8){ banner('🕰️ Clock Hands','Two golden hands sweep around the Orchid — keep out of their path!'); ms=this.arenaHands(b,{sl:p2?.85:.7,ss:p2?1.5:-1.3}); counter('🌱',0xffd166,'Season sealed!'); }
    else if(si===9){ banner('🌳 Root Surge','Roots burst across the throne room — find the gap, twice!'); ms=this.arenaSweep(b,{dir:'h',color:0x8a6a3a,band:80,art:'vfx_b10_root_band'}); this.time.delayedCall(1400,()=>{ if(b.active)this.arenaSweep(b,{dir:'v',rev:true,color:0x8a6a3a,band:80,art:'vfx_b10_root_band'}); }); ms+=1400; if(p2){ this.arenaPods(b,{n:2,emoji:'🌱',tint:0x8a6a3a}); } else counter('🌱',0x8a6a3a,'Root-bound!'); }
    else if(si===10){ banner('🌾 Great Scythe','The giant scythe cuts the side you stand on — cross to the other side!'); const side=this.player.x<b.x?-1:1,V=this.arenaView(),half=this.arenaFx(this.camWorld(this.add.rectangle(side<0?(V.x+b.x)/2:(b.x+V.x+V.w)/2,V.cy,Math.abs((side<0?V.x:V.x+V.w)-b.x)+80,V.h+160,0xe0b04a,.12).setStrokeStyle(4,0xffd166,.9).setDepth(8990)));
      this.tweens.add({targets:half,fillAlpha:{from:.08,to:.35},duration:280,yoyo:true,repeat:5}); this.time.delayedCall(1900,()=>{ const hx=half.x,hw=half.width; half.destroy(); if(!b.active)return; Sfx.orderCue?.('arena_scythe',.4,.4);this.bossSig?.('11_scythe_cut',hx,V.cy,Math.max(260,hw*1.05),{h:Math.max(130,hw*.53),depth:9001}); const sx=this.player.x-b.x; this.screenShake?.(300,.016); this.screenFlash?.(0xffd166,.3,200); if(Math.sign(sx||1)===side)this.hurtPlayer(Math.round(this.arenaDmg(b)*1.4),side>0?0:Math.PI); }); ms=2300; counter('🌾',0xe0b04a,'Toppled!'); }
    else if(si===11){ banner('🥀 Hollow Husks','The Bloom splits into husks — only the one dripping nectar is real!'); ms=this.arenaDecoys(b,{}); counter('🍑',0xffb36b,'Revealed!',.04); }
    else if(si===12){ banner('🪞 Mirror Beams','Beams bounce between the mirrors — stay off the lines, or dash a mirror into the Gardener!'); const p=this.player,M=[];
      for(let i=0;i<3;i++){ const a=Math.random()*TAU,x=p.x+Math.cos(a)*(120+i*50),y=p.y+Math.sin(a)*(100+i*40),c=this.spawnCounter(b,x,y,{emoji:'💎',tint:0xa8ecff,life:4,onHit:bb=>{this.bossPctHit(bb,.03);this.bossStun(bb,1.2,'Reflected!');}}); if(c)M.push(c); }
      const g=this.arenaFx(this.camWorld(this.add.graphics().setDepth(9000))); let t=-1600,hit=false; const pts=()=>[{x:b.x,y:b.y},...M.filter(c=>!c.dead).map(c=>({x:c.x,y:c.y}))];
      const BA=this.bpAnim?.('vfx_b13_prism_beam')?(this.battleOutlineKey?.('vfx_b13_prism_beam')||'vfx_b13_prism_beam'):null,BS=[];   /* v7.9.29 ใบ 30 ลำแสงปริซึม */
      this.arenaTick(dt=>{ if(!g.active||!b.active){g.destroy?.();BS.forEach(q=>q.destroy());return false;} t+=dt*1000; const P=pts(); g.clear();
        if(BA){ while(BS.length<P.length-1){const q=this.arenaFx(this.camWorld(this.add.sprite(0,0,BA,0).setOrigin(0,.5).setDepth(9000)));q.play(BA);this.battleOutlineTrack?.(q,BA,BA,null,true);BS.push(q);} BS.forEach((q,i)=>{ const A=P[i],B=P[i+1]; if(!B){q.setVisible(false);return;} q.setVisible(true).setPosition(A.x,A.y).setRotation(Math.atan2(B.y-A.y,B.x-A.x)).setDisplaySize(Math.max(1,Math.hypot(B.x-A.x,B.y-A.y)),t<0?10:30).setAlpha(t<0?.5:1); }); }
        else { g.lineStyle(t<0?3:11,0xa8ecff,t<0?.45:.9); for(let i=1;i<P.length;i++)g.lineBetween(P[i-1].x,P[i-1].y,P[i].x,P[i].y); }
        if(t>=0&&!hit)for(let i=1;i<P.length;i++){ const A=P[i-1],B=P[i],dx=B.x-A.x,dy=B.y-A.y,u=Phaser.Math.Clamp(((p.x-A.x)*dx+(p.y-A.y)*dy)/(dx*dx+dy*dy||1),0,1); if(Math.hypot(p.x-(A.x+dx*u),p.y-(A.y+dy*u))<24){hit=true;this.hurtPlayer(this.arenaDmg(b),0);break;} }
        if(t>900){ g.destroy(); BS.forEach(q=>q.destroy()); return false; } return true; }); ms=2700; }
    else if(si===13){ banner('🔐 Vault Rings','The vault rings close in — slip out through each gap before they reach you!'); ms=this.arenaRings(b,{rings:p2?3:2,color:0xd8b25a,art:'vfx_b14_vault_ring'}); counter('💣',0xd8b25a,'Locked!'); }
    else if(si===14){ const m=pick(p3?['grid','sweep','rings','crown']:p2?['grid','sweep','crown']:['grid','crown']);
      if(m==='grid'){ banner('🌱 Seed Grid','Seeds sprout under the red tiles — step onto the dark ones!'); ms=this.arenaGrid(b,{patterns:[(c,r)=>(c+r)%2===0,(c,r)=>(c+r)%2===1,(c,r)=>c===2||r===2],color:0xff7aa8,art:'vfx_b15_seed_tile'}); }
      else if(m==='sweep'){ banner('🌿 Crown Roots','Crown roots sweep across — find the gap!'); ms=this.arenaSweep(b,{dir:Math.random()<.5?'h':'v',color:0xff7aa8,band:80,art:'vfx_b15_crown_sweep'}); }
      else if(m==='rings'){ banner('👑 Crown Cage','The crown cage closes in — slip out through the gaps!'); ms=this.arenaRings(b,{rings:3,color:0xff7aa8}); }
      else { banner('🌺 Crown Seeds','Crown seeds make the Planter immortal — dash them into it!'); this.arenaPods(b,{n:3,emoji:'🌺',tint:0xff7aa8}); ms=1600; } }
    else { b._arenaBusy=false; return; }
    this.arenaEnd(b,ms+200,1.2); b.atkCd=(ms+400)/1000; }
  royalStingerPose(b,frame,ms=900){
    if(this.bossInkPose?.(b,frame===0?0:3,ms))return;
    if(!b||!b.active||b.texture.key!=='mb8_royal_stinger')return;frame=Phaser.Math.Clamp(frame|0,0,3);const token=b._stingerPoseToken=(b._stingerPoseToken||0)+1;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._stingerPoseToken!==token)return;if(this.anims.exists('mb8_royal_stinger_walk'))b.play('mb8_royal_stinger_walk',true);else b.setFrame(0);});
  }
  royalStingerAttack(b){const inkCast=this.bossInkBegin?.(b);
    const fast=b.phase2?.78:1,pick=Phaser.Utils.Array.GetRandom(b.phase2?['dive','waxCage','lance','guardCall','dive']:['dive','waxCage','lance']),bd=Math.max(13,Math.round(b.dmg*.55)),px=this.player.x,py=this.player.y;
    if(pick==='dive'){this.royalStingerPose(b,1,1000);this.showBanner('🐝 Royal Dive','The red lance locks in — sidestep the chained dives!',780);this.chargeTelegraph(b,650,610,24);if(b.phase2)this.time.delayedCall(940,()=>{if(b.active)this.chargeTelegraph(b,500,650,20);});b.atkCd=2.45*fast;}
    else if(pick==='waxCage'){this.royalStingerPose(b,2,1100);this.showBanner('🍯 Wax Cage','Two gates stay open — cross the amber ring!',820);const n=16,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n||i===(gap+8)%n||i===(gap+9)%n)continue;const a=i*TAU/n,wx=px+Math.cos(a)*150,wy=py+Math.sin(a)*150;(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('acid',wx,wy,5.5));this.bossSigHold('08_honey_wall',wx,wy-26,54,82,4,4.1,{depth:wy+2});}b.atkCd=2.8*fast;}
    else if(pick==='lance'){this.royalStingerPose(b,1,900);this.showBanner('🌼 Pollen Lance','Watch the fan, then cut behind the Stinger!',760);const a=Math.atan2(py-b.y,px-b.x);for(let i=-3;i<=3;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.13,320,bd,i?0xffc95c:0xff6b8a,1.05));b.atkCd=2.15*fast;}
    else{this.royalStingerPose(b,3,1200);this.showBanner('👑 Guard Call','Shieldbearers cover the royal flank!',800);for(const t of ['tank','shooter','fast']){const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(t));if(e)e.setPosition(b.x+Phaser.Math.Between(-120,120),b.y+Phaser.Math.Between(-80,80));}b.atkCd=3.1*fast;}
  }
  hornetQueenPose(b,frame,ms=1050,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||b.texture.key!=='boss8_hornet_queen')return;frame=Phaser.Math.Clamp(frame|0,0,7);const token=b._queenPoseToken=(b._queenPoseToken||0)+1;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._queenPoseToken!==token)return;if(this.anims.exists('boss8_hornet_queen_walk'))(this.bossInkIdle?.(b)||b.play('boss8_hornet_queen_walk',true));else b.setFrame(0);});
  }
  hornetQueenMetamorph(b,phase){
    const color=phase===3?0xd95cff:0xffc95c;this.hornetQueenPose(b,phase===3?7:6,phase===3?2050:1650);
    for(let i=0;i<(phase===3?18:12);i++){const a=i*TAU/(phase===3?18:12),ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(i%3?color:0xffffff).setScale(.08,.46).setAlpha(.9).setDepth(b.y+3));this.tweens.add({targets:ray,scaleX:phase===3?2.3:1.7,alpha:0,duration:850+i*30,onComplete:()=>ray.destroy()});}
    this.screenFlash(color,phase===3?.66:.42,phase===3?850:600);this.screenShake(phase===3?900:580,phase===3?.026:.017);Sfx.bossWarn();
  }
  hornetQueenAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(this.arenaMechDue(b)){this.hiveRush(b);return;}   // v7.9.13 กลไกสนาม
    const fast=b.phase3?.62:b.phase2?.78:1,pool=b.phase3?['decree','spiral','swarm','dive','prison','decree']:b.phase2?['dive','fan','prison','swarm','spiral']:['dive','fan','prison'],pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(18,Math.round(b.dmg*.48));
    if(pick==='dive'){this.hornetQueenPose(b,2,1250);this.showBanner('🐝 Royal Dive','Three crimson lanes — keep moving across their angle!',850);for(let i=0;i<(b.phase3?3:2);i++)this.time.delayedCall(i*460,()=>{if(b.active)this.chargeTelegraph(b,620-i*70,650+i*45,30);});b.atkCd=3.1*fast;}
    else if(pick==='fan'){this.hornetQueenPose(b,3,980);this.showBanner('🌼 Pollen Fan','The center shot tracks ahead; dodge late through a side gap!',800);let a=Math.atan2(py-b.y,px-b.x);if(this.player.body)a=Math.atan2(py+this.player.body.velocity.y*.38-b.y,px+this.player.body.velocity.x*.38-b.x);for(let i=-5;i<=5;i++)if(i!==0)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.105,300+(Math.abs(i)%2)*35,bd,0xffc95c,1.08));b.atkCd=2.35*fast;}
    else if(pick==='prison'){this.hornetQueenPose(b,4,1150);this.showBanner('🍯 Honey Prison','Amber walls form around your last position — leave before they harden!',850);for(let i=0;i<8;i++){const a=i*TAU/8,wx=px+Math.cos(a)*118,wy=py+Math.sin(a)*118;(this.bossInkRelease?.(b,inkCast),this.spawnBossObject('acid',wx,wy,6.2));this.bossSigHold('08_honey_wall',wx,wy-30,64,96,4,4.8,{depth:wy+2});}this.spawnHazard(px,py,62,bd,0xffc95c,b,inkCast);b.atkCd=2.75*fast;}
    else if(pick==='swarm'){this.hornetQueenPose(b,5,1350);this.showBanner('👑 Swarm Coronation','Break formation before the royal guards close in!',900);for(const t of ['tank','shooter','dasher','bomber']){const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(t));if(e)e.setPosition(b.x+Phaser.Math.Between(-155,155),b.y+Phaser.Math.Between(-110,110));}b.atkCd=3.25*fast;}
    else if(pick==='spiral'){this.hornetQueenPose(b,4,1200);this.showBanner('🍷 Ferment Spiral','Rotate with the violet pollen, then reverse!',850);const n=22,off=Math.random()*TAU;for(let i=0;i<n;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,off+i*TAU/n,220+(i%2)*55,bd,i%2?0xd95cff:0xffc95c,1.1));b.atkCd=2.85*fast;}
    else{this.hornetQueenPose(b,7,1750);this.showBanner("👑 QUEEN'S DECREE",'Two shockwaves, a closing crown, one safe wedge — survive!',1150);this.screenFlash(0xd95cff,.55,600);this.bossNovaWave(b.x,b.y,280,bd+3,300,b,inkCast);this.bossNovaWave(b.x,b.y,395,bd+6,820,b,inkCast);this.time.delayedCall(620,()=>{if(!b.active)return;const n=28,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++)if(![gap,(gap+1)%n,(gap+2)%n,(gap+3)%n].includes(i))(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,275,bd,i%2?0xd95cff:0xffc95c,1.16));});b.atkCd=4.0*fast;}
  }

  seasonKeeperPose(b,frame,ms=950){
    if(this.bossInkPose?.(b,frame===0?0:3,ms))return;
    if(!b||!b.active||b.texture.key!=='mb9_season_keeper')return;frame=Phaser.Math.Clamp(frame|0,0,3);const token=b._keeperPoseToken=(b._keeperPoseToken||0)+1;if(b.anims)b.anims.stop();b.setFrame(frame);this.time.delayedCall(ms,()=>{if(!b.active||b._keeperPoseToken!==token)return;if(this.anims.exists('mb9_season_keeper_walk'))b.play('mb9_season_keeper_walk',true);else b.setFrame(0);});
  }
  seasonKeeperAttack(b){const inkCast=this.bossInkBegin?.(b);
    const fast=b.phase2?.76:1,pick=Phaser.Utils.Array.GetRandom(b.phase2?['lance','shield','solstice','calendar','lance']:['lance','shield','solstice']),bd=Math.max(14,Math.round(b.dmg*.54)),a=Math.atan2(this.player.y-b.y,this.player.x-b.x);
    if(pick==='lance'){this.seasonKeeperPose(b,1,980);this.showBanner('🌿 Calendar Sweep','Cross behind the lance before the four-season fan opens!',800);for(let i=-4;i<=4;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.12,335,bd,i<0?0xff7040:0x8fdcff,1.02));b.atkCd=2.35*fast;}
    else if(pick==='shield'){this.seasonKeeperPose(b,2,1150);this.showBanner('🛡️ Equinox Guard','Four warnings bloom — hold the open diagonal!',830);for(let i=0;i<4;i++){const q=i*TAU/4;this.spawnHazard(this.player.x+Math.cos(q)*120,this.player.y+Math.sin(q)*120,56,bd,this.seasonInfo(i).color,b,inkCast);}b.atkCd=2.75*fast;}
    else if(pick==='solstice'){this.seasonKeeperPose(b,1,1050);this.showBanner('☀️ Solstice Charge','The watering lance fixes its lane — dodge across it!',780);this.chargeTelegraph(b,700,620,27);if(b.phase2)this.time.delayedCall(980,()=>{if(b.active)this.chargeTelegraph(b,520,670,23);});b.atkCd=2.7*fast;}
    else{this.seasonKeeperPose(b,3,1300);this.showBanner('🌦️ Calendar Call','Every crest summons its own guardian!',850);for(const t of ['tank','shooter','dasher','bomber']){const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(t));if(e)e.setPosition(b.x+Phaser.Math.Between(-145,145),b.y+Phaser.Math.Between(-95,95));}b.atkCd=3.2*fast;}
  }
  chronobloomPose(b,frame,ms=1100,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||b.texture.key!=='boss9_chronobloom_orchid')return;frame=Phaser.Math.Clamp(frame|0,0,7);const token=b._chronoPoseToken=(b._chronoPoseToken||0)+1;if(b.anims)b.anims.stop();b.setFrame(frame);this.time.delayedCall(ms,()=>{if(!b.active||b._chronoPoseToken!==token)return;if(this.anims.exists('boss9_chronobloom_orchid_walk'))(this.bossInkIdle?.(b)||b.play('boss9_chronobloom_orchid_walk',true));else b.setFrame(0);});
  }
  chronobloomMetamorph(b,phase){
    const color=phase===3?0xffd166:0x8fdcff;this.chronobloomPose(b,phase===3?7:6,phase===3?2150:1750);for(let i=0;i<(phase===3?20:14);i++){const a=i*TAU/(phase===3?20:14),ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(this.seasonInfo(i%4).color).setScale(.08,.46).setAlpha(.92).setDepth(b.y+3));this.tweens.add({targets:ray,scaleX:phase===3?2.45:1.8,alpha:0,duration:900+i*28,onComplete:()=>ray.destroy()});}this.screenFlash(color,phase===3?.70:.45,phase===3?900:640);this.screenShake(phase===3?920:600,phase===3?.027:.018);this.c24Fx('vfx_c24_metamorph',b.x,b.y,phase===3?520:420,{must:true,depth:b.y-1});Sfx.bossWarn();
  }
  chronobloomAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(true&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase3?.60:b.phase2?.77:1,pool=b.phase3?['timebreak','spiral','crown','summon','cleave','timebreak']:b.phase2?['cleave','solar','crown','spiral','summon']:['cleave','solar','crown'],pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(19,Math.round(b.dmg*.47));
    if(pick==='cleave'){this.chronobloomPose(b,1,1050);this.showBanner('🌿 Vine Cleave','A delayed fan follows the green line — cross the stem!',820);const a=Math.atan2(py-b.y,px-b.x),fan=this.c24Fx('vfx_c24_vine_fan',b.x,b.y,520,{rot:a,keep:true,must:true,depth:3});for(let i=-4;i<=4;i++)this.time.delayedCall(420,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.11,360,bd,0xff9fcf,1.08));});this.time.delayedCall(420,()=>{this.c24Drop(fan);if(b.active)this.c24Fx('vfx_c24_vine_slash',b.x,b.y,520,{rot:a,must:true,depth:3});});b.atkCd=2.45*fast;}
    else if(pick==='solar'){this.chronobloomPose(b,2,1200);this.showBanner('☀️ Solar Bloom','Sun rings chase your last steps — keep changing direction!',840);for(let i=0;i<(b.phase2?7:5);i++)this.time.delayedCall(i*140,()=>{if(!b.active)return;const hx=this.player.x+Phaser.Math.Between(-85,85),hy=this.player.y+Phaser.Math.Between(-85,85);this.spawnHazard(hx,hy,58,bd,0xffb12b,b,inkCast);this.c24Fx('vfx_c24_solar_ring',hx,hy,150,{must:true,depth:3});});b.atkCd=2.8*fast;}
    else if(pick==='crown'){this.chronobloomPose(b,3,1100);this.showBanner('❄️ Frost Crown','The rim closes inward; the wide wedge is safe!',850);const n=18,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if([gap,(gap+1)%n,(gap+2)%n].includes(i))continue;const a=i*TAU/n,x=px+Math.cos(a)*300,y=py+Math.sin(a)*300;this.c24Bullet((this.bossInkRelease?.(b,inkCast),this.foeShot(x,y,a+Math.PI,245,bd,0x8fdcff,1.06)),'proj_c24_frost_shard');}b.atkCd=2.7*fast;}
    else if(pick==='spiral'){this.chronobloomPose(b,4,1250);this.showBanner('🍂 Autumn Spiral','Turn with the first leaf ring, then reverse through the second!',880);const n=24,off=Math.random()*TAU;for(let i=0;i<n;i++)this.c24Bullet((this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,off+i*TAU/n,225+(i%2)*60,bd,i%2?0xff7040:0xffd166,1.1)),'proj_c24_autumn_leaf');b.atkCd=2.9*fast;}
    else if(pick==='summon'){this.chronobloomPose(b,5,1450);this.showBanner('🌦️ Fourfold Garden','Each season sends one specialist into the arena!',900);for(const t of ['tank','shooter','dasher','bomber']){const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(t));if(e)e.setPosition(b.x+Phaser.Math.Between(-170,170),b.y+Phaser.Math.Between(-115,115));}b.atkCd=3.3*fast;}
    else{this.chronobloomPose(b,7,1850);this.showBanner('⏳ TIME BREAK','The clock rewinds two shockwaves, then seals all but one season!',1200);this.screenFlash(0xffd166,.58,650);this.c24Fx('vfx_c24_time_break',b.x,b.y,720,{must:true,depth:3});this.bossNovaWave(b.x,b.y,290,bd+3,320,b,inkCast);this.bossNovaWave(b.x,b.y,410,bd+6,880,b,inkCast);this.time.delayedCall(700,()=>{if(!b.active)return;const n=30,gap=Phaser.Math.Between(0,n-1),gc=(gap+2)*TAU/n;for(let q=1;q<4;q++)this.c24Fx('vfx_c24_season_seal',b.x,b.y,520,{rot:gc+q*Math.PI/2+Math.PI/4,tint:this.seasonInfo(q).color,life:1.3,must:true,depth:3});for(let i=0;i<n;i++)if(![gap,(gap+1)%n,(gap+2)%n,(gap+3)%n,(gap+4)%n].includes(i))(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,285,bd,this.seasonInfo(i%4).color,1.18));});b.atkCd=4.15*fast;}
  }

  rootKnightMotion(b){
    if(!b||!b.active||b.hp<=0||b.texture.key!=='mb10_ancient_root_knight'||(b._rootKnightPoseUntil||0)>this.time.now)return;
    const velocity=b.body&&b.body.velocity,moving=velocity&&Math.hypot(velocity.x,velocity.y)>8;
    const key='mb10_ancient_root_knight_'+(moving&&!b.frozen?'walk':'idle');
    if(this.anims.exists(key))b.play(key,true);
  }
  rootKnightPose(b,frame,ms=1000){
    if(!b||!b.active||b.hp<=0||b.texture.key!=='mb10_ancient_root_knight')return;
    const name=typeof frame==='string'?frame:['idle','cleave','bastion','oath'][Phaser.Math.Clamp(frame|0,0,3)],key='mb10_ancient_root_knight_'+name;
    const token=b._rootKnightPoseToken=(b._rootKnightPoseToken||0)+1;b._rootKnightPoseUntil=this.time.now+ms;
    if(this.anims.exists(key))b.play(key);else{if(b.anims)b.anims.stop();b.setFrame({idle:0,cleave:8,bastion:12,oath:14,charge:4}[name]||0);}
    this.time.delayedCall(ms,()=>{if(!b.active||b.hp<=0||b.texture.key!=='mb10_ancient_root_knight'||b._rootKnightPoseToken!==token)return;b._rootKnightPoseUntil=0;this.rootKnightMotion(b);});
  }
  rootKnightAttack(b){
    const fast=b.phase2?.72:1,pool=b.phase2?['cleave','bastion','charge','call','cleave']:['cleave','bastion','charge'],pick=Phaser.Utils.Array.GetRandom(pool),bd=Math.max(16,Math.round(b.dmg*.56)),a=Math.atan2(this.player.y-b.y,this.player.x-b.x);
    if(pick==='cleave'){this.rootKnightPose(b,1,1050);this.showBanner('⚔️ Crown Cleave','The blade marks two crossing fans — step through the first gap!',820);for(const d of [-.48,.48])for(let i=-3;i<=3;i++)this.time.delayedCall(d<0?300:650,()=>{if(b.active)this.foeShot(b.x,b.y,a+d+i*.10,350,bd,0xffd166,1.08);});b.atkCd=2.45*fast;}
    else if(pick==='bastion'){this.rootKnightPose(b,2,1250);this.showBanner('🛡️ Root Bastion','The shield roots four lanes; the diagonal remains open!',850);for(let i=0;i<4;i++){const q=i*TAU/4;this.spawnHazard(this.player.x+Math.cos(q)*125,this.player.y+Math.sin(q)*125,58,bd,0x56e5bd);}b.atkCd=2.8*fast;}
    else if(pick==='charge'){this.rootKnightPose(b,'charge',1100);this.showBanner('🌿 Thorn Charge','The sword locks its lane — cross the warning line!',780);this.chargeTelegraph(b,760,650,29);if(b.phase2)this.time.delayedCall(1050,()=>{if(b.active)this.chargeTelegraph(b,560,700,24);});b.atkCd=2.75*fast;}
    else{this.rootKnightPose(b,3,1450);this.showBanner('👑 Oathbound Call','The old guard answers — break formation before the next cleave!',900);for(const t of ['tank','shooter','dasher']){const e=this.spawnEnemy(t);if(e)e.setPosition(b.x+Phaser.Math.Between(-150,150),b.y+Phaser.Math.Between(-105,105));}b.atkCd=3.3*fast;}
  }
  trueRootPose(b,frame,ms=1150,kind){
    if(this.bossInkPose?.(b,frame,ms,kind))return;
    if(!b||!b.active||b.texture.key!=='boss10_true_rootmother')return;frame=Phaser.Math.Clamp(frame|0,0,7);const token=b._trueRootPoseToken=(b._trueRootPoseToken||0)+1;if(b.anims)b.anims.stop();b.setFrame(frame);this.time.delayedCall(ms,()=>{if(!b.active||b._trueRootPoseToken!==token)return;if(this.anims.exists('boss10_true_rootmother_walk'))(this.bossInkIdle?.(b)||b.play('boss10_true_rootmother_walk',true));else b.setFrame(0);});
  }
  trueRootMetamorph(b,phase){
    const colors=[0,0,0x56e5bd,0xd95cff,0xffd166],color=colors[phase]||0xffd166;this.trueRootPose(b,phase===4?7:6,phase===4?2450:1900);const n=phase===4?24:phase===3?18:14;
    for(let i=0;i<n;i++){const a=i*TAU/n,ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setTint(i%3===0?0xffd166:color).setScale(.07,.5).setAlpha(.94).setDepth(b.y+4));this.tweens.add({targets:ray,scaleX:phase===4?2.8:2.1,alpha:0,duration:980+i*30,onComplete:()=>ray.destroy()});}
    for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'vfx_ring').setTint(i%2?color:0xffd166).setScale(.16).setAlpha(.9).setDepth(b.y+2));this.tweens.add({targets:ring,scale:phase===4?3.4+i*.5:2.5+i*.4,rotation:(i%2?1:-1)*TAU,alpha:0,duration:1350+i*180,onComplete:()=>ring.destroy()});}
    this.screenFlash(phase===4?0x08000e:color,phase===4?.86:.58,phase===4?1100:760);this.screenShake(phase===4?1100:760,phase===4?.032:.023);Sfx.bossWarn();
  }
  trueRootmotherAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(true&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase4?.54:b.phase3?.62:b.phase2?.76:1,pool=b.phase4?['eclipse','spiral','cage','choir','cleave','eclipse']:b.phase3?['spiral','cage','choir','eruption','cleave']:b.phase2?['cleave','eruption','cage','choir']:['cleave','eruption','cage'],pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(21,Math.round(b.dmg*.48));
    if(pick==='cleave'){this.trueRootPose(b,1,1100);this.showBanner('🌿 Thorn Cleave','Two delayed thorn fans cross — read the gold stem and change sides!',850);const a=Math.atan2(py-b.y,px-b.x);for(let pass=0;pass<2;pass++)for(let i=-4;i<=4;i++)this.time.delayedCall(360+pass*380,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+(pass?-.34:.34)+i*.105,370,bd,pass?0xd95cff:0xffd166,1.1));});b.atkCd=2.55*fast;}
    else if(pick==='eruption'){this.trueRootPose(b,2,1250);this.showBanner('💧 Sap Eruption','The roots remember your path — keep turning after each bloom!',860);for(let i=0;i<(b.phase3?9:6);i++)this.time.delayedCall(i*125,()=>{if(b.active)this.spawnHazard(this.player.x+Phaser.Math.Between(-75,75),this.player.y+Phaser.Math.Between(-75,75),60,bd,0x56e5bd,b,inkCast);});b.atkCd=2.85*fast;}
    else if(pick==='cage'){this.trueRootPose(b,3,1250);this.showBanner('👑 Crown Cage','The crown closes inward; follow the wide golden gap!',900);const n=b.phase4?28:22,gap=Phaser.Math.Between(0,n-1),ck=this.bpAnim?.('vfx_b10_crown_cage')&&'vfx_b10_crown_cage';if(ck){const [w,h]=this.kitSize(ck,340);this.bossSig('10_crown_cage',px,py,w,{h,life:1.3,depth:2,rot:(gap+1.5)*TAU/n-Math.PI/2});}for(let i=0;i<n;i++){if([gap,(gap+1)%n,(gap+2)%n,(gap+3)%n].includes(i))continue;const a=i*TAU/n,x=px+Math.cos(a)*340,y=py+Math.sin(a)*340;(this.bossInkRelease?.(b,inkCast),this.foeShot(x,y,a+Math.PI,270,bd,i%2?0xd95cff:0xffd166,1.12));}b.atkCd=2.95*fast;}
    else if(pick==='choir'){this.trueRootPose(b,5,1500);this.showBanner('🎵 Root Choir','Seven voices form a fan — silence the summons or use their gaps!',900);for(let i=0;i<4;i++){const e=(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(i%2?'shooter':'tank'));if(e)e.setPosition(b.x+Phaser.Math.Between(-185,185),b.y+Phaser.Math.Between(-125,125));}const a=Math.atan2(py-b.y,px-b.x);for(let i=-3;i<=3;i++){(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.16,285,bd,0xb77cff,1.06));this.bossSig('10_choir_note',b.x+Math.cos(a+i*.16)*95,b.y+Math.sin(a+i*.16)*95-20,52,{life:.9,depth:b.depth+2});}b.atkCd=3.25*fast;}
    else if(pick==='spiral'){this.trueRootPose(b,4,1450);this.showBanner('🌍 World-Root Spiral','Rotate with the first ring, then reverse through the violet roots!',960);const n=30,off=Math.random()*TAU;for(let i=0;i<n;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,off+i*TAU/n,230+(i%3)*48,bd,i%2?0x56e5bd:0xd95cff,1.14));b.atkCd=3.15*fast;}
    else{this.trueRootPose(b,7,2100);this.showBanner('🌑 MEMORY ECLIPSE','The world root remembers every season — survive three waves and the final crown!',1350);this.screenFlash(0x09000d,.76,780);this.bossSig('10_memory_eclipse',b.x,b.y,900,{depth:2,alpha:.9});this.bossNovaWave(b.x,b.y,300,bd+3,260,b,inkCast);this.bossNovaWave(b.x,b.y,420,bd+6,800,b,inkCast);this.time.delayedCall(680,()=>{if(!b.active)return;const n=34,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++)if(![gap,(gap+1)%n,(gap+2)%n,(gap+3)%n,(gap+4)%n].includes(i))(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,300,bd,i%3===0?0xffd166:i%2?0xd95cff:0x56e5bd,1.2));});b.atkCd=4.35*fast;}
  }

  chapter2DeathGhost(e){
    if(!e||!['boss6_rootmother','mb6_sporewarden','mb7_fungal_juggernaut','boss7_mycelium_behemoth','mb8_royal_stinger','boss8_hornet_queen','mb9_season_keeper','boss9_chronobloom_orchid','mb10_ancient_root_knight','boss10_true_rootmother'].includes(e.texture.key))return;const boss=e.isBoss,deathFrame=e.texture.key==='mb10_ancient_root_knight'?15:(e.texture.key==='mb8_royal_stinger'||e.texture.key==='mb9_season_keeper')?3:7;
    const ghost=this.camWorld(this.add.image(e.x,e.y,e.texture.key,deathFrame).setScale(e.baseScale||e.scaleX||1).setFlipX(e.flipX).setDepth(e.y+9).setAlpha(1));
    for(let i=0;i<(boss?10:6);i++){const seed=this.camWorld(this.add.image(e.x,e.y,'vfx_glow').setTint(i%3?0x56e5bd:0xffd166).setScale(.08).setDepth(e.y+10).setAlpha(.8));this.tweens.add({targets:seed,x:e.x+Phaser.Math.Between(-150,150),y:e.y-Phaser.Math.Between(50,190),scale:.32,alpha:0,duration:700+i*70,onComplete:()=>seed.destroy()});}
    this.tweens.add({targets:ghost,y:ghost.y+24,scaleX:ghost.scaleX*1.08,scaleY:ghost.scaleY*.78,alpha:0,duration:boss?1500:880,ease:'Cubic.in',onComplete:()=>ghost.destroy()});
  }

  greatHungerMetamorph(b,phase,color){
    if(!b||!b.active)return;this.stage5Pose(b,6,phase===4?2100:1650);const count=phase===4?14:phase===3?11:8,reach=phase===4?330:phase===3?270:220;
    if(this.textures.exists('fx_hunger_metamorph')){const fx=this.trackArtVfx(this.spawnFxAnim('fx_hunger_metamorph',b.x,b.y,{scale:reach*2.3/320,depth:b.y-2,normal:true,alpha:0.82,force:true}));if(fx)this.tweens.add({targets:fx,alpha:0,delay:650,duration:350});}
    else {
    for(let i=0;i<count;i++){const a=i*TAU/count,ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(b.y+5).setRotation(a).setTint(i%3===0?0xffd166:color).setScale(0.08,0.38).setAlpha(0.92));this.tweens.add({targets:ray,scaleX:reach/256,scaleY:phase===4?0.9:0.62,alpha:0,duration:720+i*22,onComplete:()=>ray.destroy()});}
    for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y+3).setTint(i%2?color:0xffd166).setScale(0.35+i*0.18).setAlpha(0.88));this.tweens.add({targets:ring,scale:phase===4?3.4+i*0.35:2.45+i*0.28,rotation:(i%2?1:-1)*Math.PI*1.4,alpha:0,duration:850+i*130,onComplete:()=>ring.destroy()});}
    const shadow=this.camWorld(this.add.circle(b.x,b.y,32,0x030006,0.86).setDepth(b.y-2).setStrokeStyle(8,color,0.8));this.tweens.add({targets:shadow,radius:phase===4?240:175,alpha:0,duration:1100,onComplete:()=>shadow.destroy()});
    }
    this.screenFlash(phase===4?0x030005:color,phase===4?0.82:0.46,phase===4?950:650);this.screenShake(phase===4?980:700,phase===4?0.032:0.022);Sfx.bossWarn();
  }

  greatHungerAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(this.arenaMechDue(b)){this.hungerFeast(b);return;}   // v7.9.13 กลไกสนาม
    const fast=b.phase4?0.60:b.phase3?0.70:b.phase2?0.82:1;
    const pool=b.phase4?['eclipse','voidMaw','crownRain','ovenCross','eclipse']:b.phase3?['voidMaw','spiral','lastSupper','ovenCross','crownRain']:b.phase2?['ovenCross','spiral','cleave','crownRain','lastSupper']:['crownRain','cleave','spiral'];
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(12,Math.round(b.dmg*0.45)),pose={crownRain:4,cleave:2,ovenCross:2,spiral:4,voidMaw:3,lastSupper:5,eclipse:6}[pick]??1;
    this.stage5Pose(b,pose,pick==='eclipse'?1550:pick==='lastSupper'?1150:900);
    if(pick==='crownRain'){
      this.showBanner('👑 Bitter Crown Rain','Warning rings chase your path — keep changing direction!',850);const n=b.phase4?9:b.phase3?7:b.phase2?6:5;
      for(let i=0;i<n;i++)this.time.delayedCall(i*135,()=>{if(b.active&&this.state==='play')this.spawnHazard(this.player.x+Phaser.Math.Between(-95,95),this.player.y+Phaser.Math.Between(-95,95),58,bd,0xd95cff,b,inkCast);});
      b.atkCd=2.7*fast;
    }else if(pick==='cleave'){
      const a=Math.atan2(py-b.y,px-b.x),len=Math.max(420,this.dist(b.x,b.y,px,py)+120),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(4).setRotation(a).setScale(len/256,0.70).setTint(0xffd166).setAlpha(0.78));this.kitLane(line);
      this.showBanner('🔪 Sovereign’s Blade','Dodge off the gold line before the blade strikes!',760);this.tweens.add({targets:line,alpha:{from:0.30,to:1},duration:120,yoyo:true,repeat:3,onComplete:()=>line.destroy()});
      this.time.delayedCall(560,()=>{if(!b.active)return;this.bossSig('05_crown_blade',b.x,b.y,len,{h:Math.min(240,len*.42),anchor:'left',rot:a,depth:b.depth+2});for(let s=-3;s<=3;s++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+s*0.115,390,bd,0xffd166,1.15));this.spawnHazard(px,py,86,bd+5,0xff8a4d,b,inkCast);this.screenShake(260,0.010);Sfx.zap();});b.atkCd=2.45*fast;
    }else if(pick==='ovenCross'){
      this.showBanner('🔥 Oven Cross','Get off the red cross lines!',820);const marks=[];
      for(const rot of [0,Math.PI/2])marks.push(this.camWorld(this.add.image(px,py,'vfx_line').setDepth(3).setRotation(rot).setScale(3.8,0.58).setTint(0xff514f).setAlpha(0.75)));marks.forEach(m=>this.kitLane(m));
      this.tweens.add({targets:marks,alpha:{from:0.25,to:0.95},duration:130,yoyo:true,repeat:4,onComplete:()=>marks.forEach(o=>o.destroy())});
      this.time.delayedCall(720,()=>{if(!b.active)return;for(let i=-3;i<=3;i++){if(Math.abs(i)<1)continue;this.spawnHazard(px+i*92,py,50,bd,0xff514f,b,inkCast);this.spawnHazard(px,py+i*92,50,bd,0xff514f,b,inkCast);}this.screenFlash(0xff514f,0.15,300);});b.atkCd=3.05*fast;
    }else if(pick==='spiral'){
      this.showBanner('🌀 Spiral of Hunger','Circle against the bullet flow!',780);const arms=b.phase4?5:b.phase3?4:3,a0=Math.random()*TAU;
      for(let k=0;k<9;k++)this.time.delayedCall(k*85,()=>{if(!b.active||this.state!=='play')return;for(let j=0;j<arms;j++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a0+k*0.42+j*TAU/arms,205+k*4,Math.max(8,bd-4),j%2?0xffd166:0xd95cff,0.92));});
      b.atkCd=2.55*fast;
    }else if(pick==='voidMaw'){
      this.showBanner('🌑 Maw of the Void','Run against the pull, then slip through the bullet gaps!',950);this.drainPull={x:b.x,y:b.y,t:b.phase4?2.2:1.75,strength:b.phase4?190:155};this.bossSig('05_void_maw',b.x,b.y,b.phase4?210:150,{life:this.drainPull.t,depth:2,alpha:b.phase4?.45:.3});   /* v8.1.123 เจ้าของ: เอฟเฟกต์บอส C1-5 เยอะไป → ท่าธรรมดาเล็ก/จาง · เต็มขนาดเฉพาะเฟส 4 (ท่าใหญ่ Eclipse คงเดิม) */
      for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(2).setScale(1.4+i*0.35).setAlpha(0.55));this.tweens.add({targets:ring,scale:0.10,rotation:(i%2?1:-1)*Math.PI,alpha:0,duration:1050+i*120,onComplete:()=>ring.destroy()});}
      this.time.delayedCall(720,()=>{if(!b.active)return;const n=b.phase4?22:18,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,185+(i%2)*45,bd,0xd95cff,1.0));}Sfx.zap();});b.atkCd=3.15*fast;
    }else if(pick==='lastSupper'){
      this.showBanner('🍽️ The Last Banquet','Destroy the minions — don’t let the table surround you!',900);const n=b.phase3?5:3;
      for(let i=0;i<n;i++)this.time.delayedCall(i*160,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(i%3===0?'tank':i%2?'fast':'shooter'));});
      for(let i=0;i<3;i++)this.spawnHazard(px+Math.cos(i*TAU/3)*155,py+Math.sin(i*TAU/3)*155,65,bd,0xff8a4d,b,inkCast);b.atkCd=3.25*fast;
    }else{
      this.showBanner('🌘 Eclipse of Flavor','A three-layered wave is swallowing the whole field!',1050);this.screenFlash(0x26002f,0.55,480);this.bossSig('05_eclipse',b.x,b.y,620,{depth:2,alpha:.6});
      this.bossNovaWave(b.x,b.y,270,bd+4,250,b,inkCast);this.bossNovaWave(b.x,b.y,340,bd+4,700,b,inkCast);this.bossNovaWave(b.x,b.y,420,bd+7,1180,b,inkCast);
      this.time.delayedCall(520,()=>{if(!b.active)return;for(let i=0;i<18;i++){if(i%6===0)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/18,245,bd,0xffd166,1.12));}this.screenShake(520,0.017);Sfx.bossWarn();});b.atkCd=3.6*fast;
    }
  }

  rootmotherAttack(b){const inkCast=this.bossInkBegin?.(b);
    if(true&&this.arenaMechDue(b)){this.arenaMech(b);return;}   // v7.9.15 กลไกสนาม
    const fast=b.phase3?0.72:b.phase2?0.86:1,pool=b.phase3?['fullBloom','rootLattice','blossomRain','seedArmy']:b.phase2?['rootLattice','blossomRain','thornFan','seedArmy']:['thornFan','rootLattice','blossomRain'],pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(13,Math.round(b.dmg*.44));
    if(pick==='thornFan'){
      this.chapter2Pose(b,2,900);const a=Math.atan2(py-b.y,px-b.x),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setScale(Math.max(430,this.dist(b.x,b.y,px,py)+100)/256,.58).setTint(0x56e5bd).setDepth(4).setAlpha(.78));this.kitLane(line);this.showBanner('🌿 Vine Scythe','Dodge the green line before the thorns fan out!',760);this.tweens.add({targets:line,alpha:{from:.2,to:1},duration:120,yoyo:true,repeat:3,onComplete:()=>line.destroy()});this.time.delayedCall(540,()=>{if(!b.active)return;for(let i=-3;i<=3;i++)(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,a+i*.14,390,bd,i%2?0xd95cff:0x56e5bd,1.08));this.screenShake(220,.008);});b.atkCd=2.35*fast;
    }else if(pick==='rootLattice'){
      this.chapter2Pose(b,3,1100);this.showBanner('🌱 Root Breach','Leave the intersection before the roots erupt!',840);this.time.delayedCall(700,()=>{if(b.active)this.bossSig('06_root_breach',px,py,380,{depth:py+3});});for(const off of [-150,0,150]){this.spawnHazard(px+off,py,52,bd,0x56e5bd,b,inkCast);this.spawnHazard(px,py+off,52,bd,0x56e5bd,b,inkCast);}b.atkCd=2.75*fast;
    }else if(pick==='blossomRain'){
      this.chapter2Pose(b,4,1150);this.showBanner('🌺 Poison Bloom Rain','Purple rings chase your path — keep changing direction!',880);const n=b.phase3?9:b.phase2?7:5;for(let i=0;i<n;i++)this.time.delayedCall(i*145,()=>{if(b.active&&this.state==='play')this.spawnHazard(this.player.x+Phaser.Math.Between(-110,110),this.player.y+Phaser.Math.Between(-110,110),58,bd,0xd95cff,b,inkCast);});b.atkCd=2.95*fast;
    }else if(pick==='seedArmy'){
      this.chapter2Pose(b,5,1250);this.showBanner('🌰 Swarm Seed','Kill the sprouts before the field is sealed off!',900);const n=b.phase3?6:4;for(let i=0;i<n;i++)this.time.delayedCall(i*130,()=>{if(b.active)(this.bossInkRelease?.(b,inkCast),this.spawnEnemy(i%3===0?'shooter':i%2?'fast':'basic'));});b.atkCd=3.1*fast;
    }else{
      this.chapter2Pose(b,6,1650);this.showBanner('🌸 FULL BLOOM','A two-layer petal wave — slip through the bullet gaps!',1000);this.time.delayedCall(200,()=>{if(b.active)this.bossSig('06_full_bloom',b.x,b.y,600,{depth:2});});this.screenFlash(0xd95cff,.34,420);this.bossNovaWave(b.x,b.y,280,bd+3,260,b,inkCast);this.bossNovaWave(b.x,b.y,390,bd+6,820,b,inkCast);this.time.delayedCall(520,()=>{if(!b.active)return;const n=22,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;(this.bossInkRelease?.(b,inkCast),this.foeShot(b.x,b.y,i*TAU/n,235,bd,i%2?0x56e5bd:0xd95cff,1.06));}this.screenShake(420,.014);});b.atkCd=3.45*fast;
    }
  }

  charPassiveOnHurt(){ if(this._rageStk)this._rageStk=0;   // v7.9.19 Rolling Rage หายเมื่อโดนตี
    if(this.player.gearThorns&&(this.elapsed||0)>=(this._thornsAt||0)){this._thornsAt=(this.elapsed||0)+1;this.gearModBoom(this.player.x,this.player.y,130,this.player.gearThorns,0x9be37a);} this.fireRecipes('hurt'); this.ptSkinBurst(); this.cocoaBeatCharge(0.6); const CP=this._cpas; if(!CP||CP.id!=='mint'||(this.elapsed||0)<(CP.cd||0))return; CP.cd=(this.elapsed||0)+1.2; const px=this.player.x,py=this.player.y,r=110+20*CP.s;
    this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,px,py)<r)this.applyFreeze(e,0.9*CP.s); }); this.burst(px,py,0x8fe7ff); }
  charPassiveOnDash(){ if(!this.isSesRune?.()&&this.character==='sesame'&&this.basicAttack?.lv?.p_swift)this._sesRetreatT=(this.elapsed||0)+2;   // v7.9.17 Retreat Shot
    if(!this.isSesRune?.()&&this.character==='sesame'&&this.state==='play'&&this.player)this.sesPlaceMirror(this.player.x,this.player.y);   // v7.9.40 Mirror Network: Dash ทิ้งกระจก
    if(this.character==='yuzu'&&this.state==='play'&&this.player)this.yuzuRush();   // v7.9.41 Dash = ฝูงพุ่งตาม
    const CP=this._cpas; if(!CP||CP.id!=='taro'||this.state!=='play')return; const px=this.player.x,py=this.player.y,d=(10+(this.stageIndex||0)*4)*(this.player.dmgMul||1)*CP.s;
    if(!this.heroFx?.('bpx_taro_rift_step',px,py,120,{must:true,depth:this.player.depth-1}))this.burst(px,py,0xc9a2ff); this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,px,py)<95)this.damage(e,d,e.x,e.y); }); }
  charPassiveOnKill(e){ if(this._titanHold&&this.ptv('trLust')){const p=this.player;p.hp=Math.min(p.maxhp,p.hp+p.maxhp*.01);} const CP=this._cpas; if(!CP||CP.id!=='berry'||Math.random()>0.06)return; const p=this.player; p.hp=Math.min(p.maxhp,p.hp+p.maxhp*0.02*CP.s); }
  // v4.88: หน้า Talent ประจำตัวละคร — ใช้ TP จากเลเวลตัวละคร (Save.cp) + โชว์ passive ประจำตัว
  talentIcon(hero,node,x,y,size,open=true){
    if(hero==='sesame'&&String(node.id||'').startsWith('pt_sesRune_')&&this.textures.exists('ses_talent_icons')){const f=TAL_SLOTS.indexOf(node.slot);if(f>=0){const im=this.add.image(x,y,'ses_talent_icons',f).setDisplaySize(size,size).setAlpha(open?1:.35);this.menu.add(im);return im;}}   /* v8.1.65 ใบ 68 */
    const key=node.id==='unique'?'ic_unique_mastery':'talent_'+hero,frame=node.id==='unique'?0:(TALENT_ICON_FRAMES[hero]||{})[node.id];
    const icon=frame!==undefined&&this.textures.exists(key)?this.add.image(x,y,key,frame).setDisplaySize(size,size):this.add.text(x,y,node.emoji||'✦',{fontSize:Math.round(size*0.72)+'px'}).setOrigin(0.5);
    icon.setAlpha(open?1:0.35);this.menu.add(icon);return icon;
  }
  buildTalents(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Heroes · Talents','screen_heroes');this.drawHeroesTabs();
    const id=Save.data.character||'momo',ch=CHARACTERS[id]||{},cp=Save.cp(id),defs=charTalents(id),ps=CHAR_PASSIVES[id],sc=charPassiveScale(cp.lvl);
    const W=this.W,top=this.heroesContentTop()+18,bw=Math.min(W-32,400),bx=W/2-bw/2;
    const need=charExpNeed(cp.lvl),g=this.add.graphics();
    // v5.41 ‹ › เปลี่ยนตัวละคร (เฉพาะที่มีแล้ว) — เปลี่ยนตัวที่ใช้เล่นด้วย
    const own=CHAR_ORDER.filter(c=>typeof heroRevealed==='function'?heroRevealed(c):(FIGHTER_PLAYTEST_ALL||(Save.data.chars||[]).includes(c))),oi=Math.max(0,own.indexOf(id));
    if(own.length>1){ const sw=d=>{ const n=own[(oi+d+own.length)%own.length]; Save.data.character=n; Save.save(); this.character=n; Sfx.select(); this.buildMenuScreen(); };
      const la=this.add.text(bx+12,top,'‹',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffd166'}).setOrigin(0.5); this.menu.add(la); this._zone(bx-6,top-18,40,36,()=>sw(-1)); }
    const hx=own.length>1?bx+28:bx;
    const hd=this.add.text(hx,top,(ch.emoji||'🍡')+' '+(ch.name||id)+'  ·  Lv '+cp.lvl,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffe9b0'}).setOrigin(0,0.5);
    const tp=this.add.text(bx+bw,top,'🌟 '+(cp.tp||0)+' TP',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'14px',color:(cp.tp||0)>0?'#8ff0b0':'#9a90ab'}).setOrigin(1,0.5);
    g.fillStyle(0x2c2338,1);g.fillRoundedRect(bx,top+14,bw,8,4);g.fillStyle(0xffc85a,1);g.fillRoundedRect(bx,top+14,Math.max(6,bw*Math.min(1,(cp.exp||0)/need)),8,4);
    const ex=this.add.text(W/2,top+32,'EXP '+(cp.exp||0)+' / '+need+'  ·  earn EXP by playing this character',{fontFamily:'NunitoUI, sans-serif',fontSize:'9px',color:'#b7abc9'}).setOrigin(0.5);
    const py=top+46;g.fillStyle(0x3a2450,1);g.fillRoundedRect(bx,py,bw,44,12);g.lineStyle(2,0xc58bff,0.9);g.strokeRoundedRect(bx,py,bw,44,12);
    const pt=this.add.text(bx+12,py+13,(ps?ps.emoji+' Passive · '+ps.name:'Passive'),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:'#f3e4ff'}).setOrigin(0,0.5);
    const pd=this.add.text(bx+12,py+31,(ps?ps.desc:'')+'  (power ×'+sc.toFixed(2)+' from Lv)',{fontFamily:'NunitoUI, sans-serif',fontSize:'9.5px',color:'#d4c2e6'}).setOrigin(0,0.5);
    this.menu.add([g,hd,tp,ex,pt,pd]);
    if(own.length>1){ const ra=this.add.text(hd.x+hd.width+14,top,'›',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffd166'}).setOrigin(0.5); this.menu.add(ra); this._zone(ra.x-20,top-18,40,36,()=>{ const n=own[(oi+1)%own.length]; Save.data.character=n; Save.save(); this.character=n; Sfx.select(); this.buildMenuScreen(); }); }
    // v6.52.2: Skill tree แบบ Tap Titans 2 — แท็บสาย · root แตก 3 สาย · ราคาแต้มเพิ่มตามเลเวล (ต้องเลือก)
    const tal=cp.tal||{},cols=[{key:'core',name:'Core',emoji:'⭐',col:0xffd166,nodes:defs}].concat(sesTalentPaths(id).map((pt,k)=>({key:pt.id,name:String(pt.name).replace(/ Build$/,''),emoji:pt.emoji,col:[0x7fd4ff,0xff8fb5,0x8ff0b0][k%3],nodes:talentBranch(pt)})));
    if(!cols.some(c=>c.key===this._talTab))this._talTab='core'; const C=cols.find(c=>c.key===this._talTab),tTop=py+56,tw=bw/cols.length;
    cols.forEach((c,ci)=>{const x=bx+ci*tw,on=c===C,pts=c.nodes.reduce((a,n)=>a+(tal[n.id]||0),0);
      this.heroButton(x+2,tTop,tw-4,32,c.name+(pts?' '+pts:''),()=>{this._talTab=c.key;this._talSel=null;this.buildMenuScreen();},{active:on,fontSize:tw<95?10:12});});
    const N=C.nodes,root=N[0],isPath=C.key!=='core',chains=[[],[],[]],par={};
    if(isPath){ ['a','b','c'].forEach((br,k)=>{ const x1=N.find(n=>n.slot===br+'1'),x2=N.find(n=>n.slot===br+'2'),cp2=N.find(n=>n.slot==='cap'+br.toUpperCase()); chains[k]=[x1,x2,cp2]; par[x1.id]=root.id; par[x2.id]=x1.id; par[cp2.id]=x2.id; }); }
    else { N.slice(1).forEach((n,i)=>chains[i%3].push(n)); chains.forEach(ch2=>ch2.forEach((n,i)=>par[n.id]=i===0?root.id:ch2[i-1].id)); }
    const detH=id==='taro'?140:110,aTop=tTop+44,rows=1+Math.max(...chains.map(c=>c.length)),ns=Math.min(58,bw*0.16),rh2=Math.max(ns+20,Math.min(96,(this.H-aTop-detH-70)/rows));
    const area=this.add.graphics(); area.fillStyle(0x140f1c,0.82); area.fillRoundedRect(bx,aTop-4,bw,rows*rh2+8,14); area.lineStyle(2,C.col,0.55); area.strokeRoundedRect(bx,aTop-4,bw,rows*rh2+8,14); this.menu.add(area);
    const pos={}; pos[root.id]={x:bx+bw/2,y:aTop+rh2/2}; chains.forEach((ch2,k)=>ch2.forEach((n,i)=>pos[n.id]={x:bx+bw*(k+0.5)/3,y:aTop+rh2*(i+1.5)}));
    const ln=this.add.graphics(); this.menu.add(ln); const okN=n=>isPath?talNodeOpen(N,tal,n):(n===root||n.free||(tal[par[n.id]]||0)>0),costN=(n,r)=>isPath?talNodeCost(n,r):n.costs?n.costs[r]:talCost(r);
    N.forEach(n=>{ if(n===root||n.free)return; const a2=pos[par[n.id]],b2=pos[n.id],lit=okN(n); ln.lineStyle(5,lit?C.col:0x3a3048,lit?0.95:0.7);
      if(a2.x===b2.x)ln.lineBetween(a2.x,a2.y+ns/2,b2.x,b2.y-ns/2); else { const my=(a2.y+b2.y)/2; ln.lineBetween(a2.x,a2.y+ns/2,a2.x,my); ln.lineBetween(a2.x,my,b2.x,my); ln.lineBetween(b2.x,my,b2.x,b2.y-ns/2); } });
    if(!this._talSel||!N.some(n=>n.id===this._talSel))this._talSel=root.id; let sel=null;
    N.forEach(n=>{ const P2=pos[n.id],r=tal[n.id]||0,ok=okN(n),mx=r>=n.max,on=this._talSel===n.id,x=P2.x-ns/2,y=P2.y-ns/2,g2=this.add.graphics();
      g2.fillStyle(mx?0x6a4d10:r>0?this._darken(C.col,0.55):ok?0x2a2236:0x15111c,1); g2.fillRoundedRect(x,y,ns,ns,12); g2.lineStyle(on?4:2.5,on?0xffffff:mx?0xffd166:ok?C.col:0x3a3048,1); g2.strokeRoundedRect(x,y,ns,ns,12);
      this.menu.add(g2);
      this.talentIcon(id,n,P2.x,P2.y-2,ns*0.8,ok);
      if(!ok){const lock=this.add.text(x+ns-3,y+3,'🔒',{fontSize:'12px',stroke:'#000000',strokeThickness:2}).setOrigin(1,0);this.menu.add(lock);}
      const lb=this.add.text(x+ns-4,y+ns-3,String(r),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffffff',stroke:'#000',strokeThickness:3}).setOrigin(1,1);
      this.menu.add(lb); if(n.cap){g2.lineStyle(1.5,0xffd166,0.6);g2.strokeRoundedRect(x-3,y-3,ns+6,ns+6,14);} if(ok&&!mx&&(cp.tp||0)>=costN(n,r)){ const up=this.add.text(x+ns-2,y+2,'⬆',{fontSize:'13px',color:'#8ff0b0',stroke:'#000',strokeThickness:3}).setOrigin(1,0); this.menu.add(up); }
      if(on)sel=n; this._zone(x-6,y-6,ns+12,ns+12,()=>{ this._talSel=n.id; Sfx.select&&Sfx.select(); this.buildMenuScreen(); }); });
    { const n=sel,r=tal[n.id]||0,ok=okN(n),mx=r>=n.max,cost=costN(n,r),can=ok&&!mx&&(cp.tp||0)>=cost,dy=aTop+rows*rh2+12,dg=this.add.graphics();
      dg.fillStyle(0x0f0b15,0.97); dg.fillRoundedRect(bx,dy,bw,detH-8,14); dg.lineStyle(2,C.col,0.9); dg.strokeRoundedRect(bx,dy,bw,detH-8,14);
      this.menu.add(dg);this.talentIcon(id,n,bx+24,dy+17,24,ok);
      const t1=this.add.text(bx+42,dy+17,n.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0,0.5),t1b=this.add.text(bx+bw-14,dy+17,'Lv. '+r+' / '+n.max,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffd166'}).setOrigin(1,0.5);
      const titleRoom=Math.max(80,bw-64-t1b.width);if(t1.width>titleRoom)t1.setFontSize(Math.max(9,15*titleRoom/t1.width)+'px');
      const t2=this.add.text(bx+14,dy+(id==='taro'?32:42),(n.cap?'Capstone · pick 1: ':'Each level: ')+n.per,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#8ff0b0',wordWrap:{width:bw-150}}).setOrigin(0,id==='taro'?0:0.5);
      const t3=this.add.text(bx+14,dy+(id==='taro'?112:70),C.key==='core'?'Always active':C.key==='sesRune'?'Rune spells (Unique)':'Only in runs with '+C.name+' Build',{fontFamily:'NunitoUI, sans-serif',fontSize:'10px',color:'#b7abc9',wordWrap:{width:bw-150}}).setOrigin(0,0.5);
      const pbw=118,pbh=58,pbx=bx+bw-pbw-10,pby=dy+30,pg=this.add.graphics(); this.rosterChrome(can?'tab_on':'tab_off',pbx,pby,pbw,pbh).setAlpha(can?1:.55);
      const pc=this.add.text(pbx+pbw/2,pby+15,mx?'':ok?cost+' Talent Point'+(cost>1?'s':''):'Locked',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffe0bc'}).setOrigin(0.5),pt2=this.add.text(pbx+pbw/2,pby+38,mx?'MAX':ok?'Upgrade':'🔒',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffffff',stroke:'#3a2400',strokeThickness:3}).setOrigin(0.5);
      this.menu.add([t1,t1b,t2,t3,pg,pc,pt2]);
      this._zone(pbx,pby,pbw,pbh,()=>{ if(!can){Sfx.select&&Sfx.select();this.menuToast(mx?'Already maxed':!ok?(n.soon?'Coming in a later update':n.cap&&N.some(o=>o.cap&&o!==n&&(tal[o.id]||0)>0)?'Only 1 Capstone per path — reset to change':'Upgrade the node above first'):'Need '+cost+' Talent Points — level up this hero','#ff9bb5');return;}
        cp.tal=cp.tal||{};cp.tal[n.id]=r+1;cp.tp-=cost;Save.save();Sfx.progress('talent');this.menuToast('🌟 '+n.name+' Lv '+(r+1),'#8ff0b0');this.menuChanged?.(0x8ff0b0);this.buildMenuScreen(); }); }
    const defsN=0,listTop=aTop+rows*rh2+12+detH-8+2,rh=0;
    if(Save.data.talRefundNote){Save.data.talRefundNote=0;Save.save();this.menuToast('Path talents reworked — points refunded','#8ff0b0');}
    // v4.88.2: รีเซ็ต Talent คืน TP ทั้งหมด (จ่าย Sugar · แตะ 2 ครั้งยืนยัน)
    const spent=talSpent(cp.tal),cost=80+40*spent,armed=this._talResetArm&&this._talResetArm.id===id&&Date.now()-this._talResetArm.t<2500;
    const ry=listTop+defsN*(rh+6)+22;
    this.heroButton(W/2-Math.min(bw,230)/2,ry-20,Math.min(bw,230),36,spent<=0?'Reset (nothing spent)':armed?'Confirm · 🍬'+cost:'Reset · 🍬'+cost,()=>{
      if(spent<=0){this.menuToast('No talent points spent yet');return;}
      if((Save.data.sugar||0)<cost){this.menuToast('Need 🍬'+cost+' Sugar');return;}
      if(!armed){this._talResetArm={id,t:Date.now()};this.buildTalents();return;}
      this._talResetArm=null; Save.data.sugar-=cost; cp.tp=(cp.tp||0)+spent; cp.tal={}; Save.save(); Sfx.select&&Sfx.select(); this.menuToast('↺ Talents reset · +'+spent+' TP'); this.buildTalents(); },{disabled:spent<=0,fontSize:12});
    this.menu.setVisible(true);
  }
  // v4.87: บอสดุขึ้น — ตัวเร่งรอบโจมตี (ทุกบอส/มินิ) + คลั่งเมื่อ HP<30%
  bossAggro(b){ let m=b.isBoss?1.45:1.3; if(b.hp<b.maxhp*0.3){ m*=1.2; if(!b._enraged&&!(b._phaseInvuln>0)){ b._enraged=true; if(b._pinnacleArt)b.setFrame(6); if(b.delveBoss)return m; b.spd*=1.12; this.screenFlash(0xff4d6d,0.18,300); this.showBanner('💢 ENRAGED','It attacks faster — keep moving!',1200); } } return m; }
  // เล็งดักทาง: ยิงไปตำแหน่งที่ผู้เล่นกำลังจะไป (ไม่ใช่ที่ยืนอยู่)
  leadAim(x,y,speed){ const p=this.player,v=p.body?p.body.velocity:{x:0,y:0},t=Math.min(0.9,this.dist(x,y,p.x,p.y)/Math.max(1,speed)); return Math.atan2(p.y+v.y*t-y,p.x+v.x*t-x); }
  // คอมโบต่อท้าย: หลังบอสใช้ท่า มีโอกาสตามด้วยท่าสั้น (ยิงดักทาง / วงไล่ / พุ่งสั้น)
  bossFollowUp(b){ if(b._fogCharge||!b.active||this.state!=='play'||(b._phaseInvuln||0)>0||b._phaseGateLocked)return;
    const d=Math.max(6,Math.round((b.dmg||14)*0.55)),hot=b.hp<b.maxhp*0.3,r=Math.random();
    if(r<0.45){ const n=hot?5:3,sp=260; for(let i=0;i<n;i++)this.time.delayedCall(i*110,()=>{ if(!b.active||this.state!=='play')return; const a=this.leadAim(b.x,b.y,sp)+(i-(n-1)/2)*0.07; this.foeShot(b.x,b.y,a,sp,d,0xffd166,1.0); }); }
    else if(r<0.75){ const p=this.player,v=p.body?p.body.velocity:{x:0,y:0}; for(let i=0;i<(hot?3:2);i++)this.spawnHazard(p.x+v.x*(0.45+i*0.3),p.y+v.y*(0.45+i*0.3),60,d,0xff7a5c); }
    else if(b.isBoss||b.isMini){ this.chargeTelegraph(b,520,640,20); } }
  // v6.39 บอสเฉพาะ Delve: ชั้นบอสลงท้าย 10 = Jelly Warden · ลงท้าย 20 = Madame Candlewick (สลับไปเรื่อย ๆ)
  setupDelveBoss(b){
    const nd=this._amapNode; if(!this.recipeMode||!nd||nd.type!=='boss'||this._pinnacleRun)return null;
    const kind=(nd.d%20===10)?'warden':'candle', key=kind==='warden'?'boss_delve10':'boss_delve20';
    if(!this.textures.exists(key))return null;
    if(b.anims)b.anims.stop(); b.setTexture(key,0); b.tintColor=null; b.clearTint();
    b.baseScale=0.72; b._baseScale=0.72; b.setScale(0.72); b.setCircle(92,68,110);
    b.delveBoss=kind; b._dv={t:0,cd:2.2,act:null,split:false,dark:false,pose:0,poseT:0,objs:[]}; b.spd=kind==='warden'?78:70;
    this._dvObjs=[]; return kind==='warden'?'⛓️ THE JELLY WARDEN · Floor '+nd.d:'🕯️ MADAME CANDLEWICK · Floor '+nd.d;
  }
  dvPose(b,f,ms){ b.setFrame(f); b._dv.pose=f; b._dv.poseT=ms/1000; }
  dvObj(o){ if(!this.boss||!this.boss.active||!this.boss.delveBoss){ if(o.img)o.img.destroy(); return o; } (this._dvObjs||(this._dvObjs=[])).push(o); return o; }
  clearDelveBoss(){ (this._dvObjs||[]).forEach(o=>{ if(o.img)o.img.destroy(); if(o.g)o.g.destroy(); if(o.destroy&&!o.img)o.destroy(); }); this._dvObjs=[]; if(this._dvDark){ this._dvDark.rect.destroy(); this._dvDark.mg.destroy(); this._dvDark=null; } }
  delveBossThink(b,dt){
    const v=b._dv,p=this.player; if(!b.visible)b.setVisible(true); if(!Number.isFinite(b.x)){ b.setPosition(p.x+140,p.y); if(b.body)b.body.reset(b.x,b.y); }
    v.t+=dt; if(v.poseT>0){ v.poseT-=dt; if(v.poseT<=0&&!v.act)b.setFrame(b._enraged?6:(Math.sin(v.t*3)>0?1:0)); } else if(!v.act&&Math.floor(v.t*2.5)!==v._bf){ v._bf=Math.floor(v.t*2.5); b.setFrame(b._enraged?6:(v._bf%2)); }
    const agg=this.bossAggro(b); if(b._phaseInvuln>0)return;
    this.tickDelveObjs(b,dt);
    if(v.act){ b.knock=0.1; b.setVelocity(0,0); return; }
    v.cd-=dt*agg; if(v.cd>0)return;
    if(b.delveBoss==='warden')this.wardenAct(b); else this.candleAct(b);
  }
  // ── Jelly Warden ──
  wardenAct(b){
    const v=b._dv,p=this.player;
    if(!v.split&&b.hp<=b.maxhp*0.5){ v.split=true; this.dvPose(b,5,700); this.showBanner('🟢 The Warden splits!','Three jelly guards break off',1400); this.screenShake(220,0.008);
      for(let i=0;i<3;i++){ const e=this.spawnEnemy('tank'); if(!e)continue; const a=i*TAU/3; e.setPosition(b.x+Math.cos(a)*90,b.y+Math.sin(a)*90); if(e.body)e.body.reset(e.x,e.y); const jellyKey=this.textures.exists('mini_jelly_animated')?'mini_jelly_animated':this.textures.exists('delve10_minijelly')?'delve10_minijelly':null;if(jellyKey){ if(e.anims)e.anims.stop(); e.setTexture(jellyKey); e.baseScale=0.36;e.setScale(0.36);this.resetEnemyPresentation(e); e.setCircle(70,58,70); e.tintColor=null; e.clearTint(); } e.hp=e.maxhp=b.maxhp*0.05; e.dmg=Math.round(b.dmg*0.45); e.isElite=true; }
      v.cd=1.6; return; }
    const r=(b._enraged?150:120), jumps=b._enraged?3:(b.hp<b.maxhp*0.5?2:1); v.act='jump'; let n=0;
    const one=()=>{ if(!b.active||this.state!=='play'){ v.act=null; return; }
      const tx=p.x+(p.body?p.body.velocity.x*0.35:0), ty=p.y+(p.body?p.body.velocity.y*0.35:0);
      this.dvPose(b,2,420); const mark=this.camWorld(this.add.image(tx,ty,'vfx_ring').setDepth(-99300).setTint(0x7fe0c0).setScale(r*2/256).setAlpha(0.3));
      this.tweens.add({targets:mark,alpha:0.9,duration:820});
      this.time.delayedCall(420,()=>{ if(!b.active){ mark.destroy(); v.act=null; return; } b.setFrame(3); if(b.body)b.body.enable=false; const sx=b.x,sy=b.y;
        this.tweens.addCounter({from:0,to:1,duration:440,ease:'Sine.easeInOut',onUpdate:tw=>{ const k=tw.getValue(); b.setPosition(sx+(tx-sx)*k,sy+(ty-sy)*k-Math.sin(k*Math.PI)*170); },onComplete:()=>{ mark.destroy(); if(!b.active){ v.act=null; return; } if(b.body){ b.body.enable=true; b.body.reset(tx,ty); }
          this.dvPose(b,4,380); this.screenShake(160,0.009); this.vfxHitRing&&this.vfxHitRing(tx,ty,0x7fe0c0,true);
          if(this.dist(p.x,p.y,tx,ty)<r)this.hurtPlayer(Math.round(b.dmg*0.9),0.5);
          this.dvPuddle(tx,ty,r*0.9);
          n++; if(n<jumps)this.time.delayedCall(260,one); else { v.act=null; v.cd=b._enraged?1.6:2.4; } } }); }); };
    one();
  }
  dvPuddle(x,y,r){ const img=this.camWorld(this.add.image(x,y,this.textures.exists('delve10_puddle')?'delve10_puddle':'vfx_glow').setDepth(-99340).setDisplaySize(r*2.1,r*1.5).setAlpha(0.85)); this.dvObj({kind:'puddle',x,y,r,life:7,img}); const L=this._dvObjs.filter(o=>o.kind==='puddle'); if(L.length>6){ const o=L[0]; o.img.destroy(); this._dvObjs.splice(this._dvObjs.indexOf(o),1); } }
  // ── Madame Candlewick ──
  candleAct(b){
    const v=b._dv,p=this.player,lit=this._dvObjs.filter(o=>o.kind==='candle'&&o.lit).length;
    if(!v.dark&&b.hp<=b.maxhp*0.4){ v.dark=true; this.dvPose(b,6,1200); v.act='blow'; this.showBanner('🌑 Lights out!','Only the candles light the room — snuff them to stop the flames',1800);
      this.time.delayedCall(700,()=>{ v.act=null; this.dvDarkOn(); this.dvCandles(b,4,true); }); v.cd=2.5; return; }
    const r=Math.random();
    if(lit<2||r<0.35){ this.dvPose(b,4,700); v.act='light'; this.time.delayedCall(500,()=>{ v.act=null; this.dvCandles(b,b._enraged?4:3,false); }); v.cd=b._enraged?2.6:3.4; return; }
    // สาดขี้ผึ้ง 3 แอ่งเล็งผู้เล่น
    this.dvPose(b,2,450); v.act='splash';
    this.time.delayedCall(450,()=>{ if(!b.active){ v.act=null; return; } this.dvPose(b,3,500); const n=b._enraged?4:3;
      for(let i=0;i<n;i++){ const x=p.x+(i?Phaser.Math.Between(-140,140):0), y=p.y+(i?Phaser.Math.Between(-140,140):0), rr=70;
        const g=this.camWorld(this.add.image(x,y,'vfx_ring').setDepth(-99300).setTint(0xff8a3d).setScale(rr*2/256).setAlpha(0.3)); this.tweens.add({targets:g,alpha:0.9,duration:700,onComplete:()=>{ g.destroy(); if(this.state!=='play')return;
          if(this.dist(p.x,p.y,x,y)<rr)this.hurtPlayer(Math.round(b.dmg*0.7),0.4);
          const img=this.camWorld(this.add.image(x,y,this.textures.exists('delve20_wax_pool')?'delve20_wax_pool':'vfx_glow').setDepth(-99340).setDisplaySize(rr*2.2,rr*1.6).setAlpha(0.9)); this.dvObj({kind:'wax',x,y,r:rr,life:6,tick:0,img}); }}); }
      this.time.delayedCall(500,()=>{ v.act=null; }); });
    v.cd=b._enraged?2.0:2.8;
  }
  dvCandles(b,n,around){ const p=this.player;
    for(let i=0;i<n;i++){ const a=Math.random()*TAU,d=around?200+Math.random()*120:240+Math.random()*200, x=(around?p.x:b.x)+Math.cos(a)*d, y=(around?p.y:b.y)+Math.sin(a)*d;
      const img=this.camWorld(this.add.image(x,y,this.textures.exists('delve20_candle_lit')?'delve20_candle_lit':'vfx_glow').setOrigin(0.5,0.9).setScale(0.32).setDepth(y));
      img.setScale(0); this.tweens.add({targets:img,scale:0.32,duration:300,ease:'Back.out'});
      this.dvObj({kind:'candle',x,y,lit:true,tick:1.4+Math.random(),img}); }
    const L=this._dvObjs.filter(o=>o.kind==='candle'); while(L.length>9){ const o=L.shift(); o.img.destroy(); this._dvObjs.splice(this._dvObjs.indexOf(o),1); }
  }
  dvFlameRing(b,x,y){ const R=210,img=this.camWorld(this.add.image(x,y,this.textures.exists('delve20_flame_ring')?'delve20_flame_ring':'vfx_ring').setDepth(-99320).setScale(0.05).setAlpha(0.95));
    this.dvObj({kind:'ring',x,y,r:0,R,life:1.1,hit:false,img,dmg:Math.round(b.dmg*0.55)}); }
  dvDarkOn(){ if(this._dvDark)return; const rect=this.camWorld(this.add.rectangle(0,0,10,10,0x0b0614,0.86).setOrigin(0).setDepth(95000)); const mg=this.make.graphics({x:0,y:0,add:false}); const m=mg.createGeometryMask(); m.setInvertAlpha(true); rect.setMask(m); this._dvDark={rect,mg}; }
  tickDelveObjs(b,dt){ const p=this.player,L=this._dvObjs||[];
    for(let i=L.length-1;i>=0;i--){ const o=L[i];
      if(o.kind==='puddle'||o.kind==='wax'){ o.life-=dt; if(o.life<1)o.img.setAlpha(Math.max(0,o.life)*0.85); if(this.dist(p.x,p.y,o.x,o.y)<o.r*0.8){ this.moveSlowT=Math.max(this.moveSlowT||0,0.3); if(o.kind==='wax'){ o.tick-=dt; if(o.tick<=0){ o.tick=0.6; this.hurtPlayer(Math.round(b.dmg*0.18),0.15); } } } if(o.life<=0){ o.img.destroy(); L.splice(i,1); } }
      else if(o.kind==='candle'&&o.lit){ if(this.dist(p.x,p.y,o.x,o.y)<54){ o.lit=false; if(this.textures.exists('delve20_candle_out'))o.img.setTexture('delve20_candle_out'); this.floatText&&this.floatText(o.x,o.y-60,'💨 snuffed','#cfe8ff'); this.tweens.add({targets:o.img,alpha:0,delay:1400,duration:500,onComplete:()=>{ o.img.destroy(); const k=L.indexOf(o); if(k>=0)L.splice(k,1); }}); continue; }
        o.tick-=dt*(b._enraged?1.3:1); if(o.tick<=0){ o.tick=2.6; this.dvFlameRing(b,o.x,o.y-8); } }
      else if(o.kind==='ring'){ o.life-=dt; o.r=o.R*(1-o.life/1.1); o.img.setScale(o.r*2/256); o.img.setAlpha(Math.min(1,o.life*2)); const d=this.dist(p.x,p.y,o.x,o.y); if(!o.hit&&Math.abs(d-o.r)<22){ o.hit=true; this.hurtPlayer(o.dmg,0.4); } if(o.life<=0){ o.img.destroy(); L.splice(i,1); } }
    }
    if(this._dvDark){ const cam=this.cameras.main,wv=cam.worldView,D=this._dvDark; D.rect.setPosition(wv.x-40,wv.y-40).setSize(wv.width+80,wv.height+80); D.mg.clear(); D.mg.fillStyle(0xffffff); D.mg.fillCircle(p.x,p.y,150); L.forEach(o=>{ if(o.kind==='candle'&&o.lit)D.mg.fillCircle(o.x,o.y-30,105); }); D.mg.fillCircle(b.x,b.y,70); }
  }
  bossThink(b,dt){ if(this.holdArenaFogBoss(b))return;if(b.delveBoss){ this.delveBossThink(b,dt); return; } if(this.bossBigMove?.(b,dt)){ b.atkCd=Math.max(b.atkCd||0,1); this._bossThinkCore(b,dt); b.atkCd=Math.max(b.atkCd,.6); return; } const before=b.atkCd; this._bossThinkCore(b,dt);this.rootKnightMotion(b);
    if(b.active&&before!==undefined&&before<=0.05&&b.atkCd>0.4&&!b._comboLock){ const ch=b.hp<b.maxhp*0.3?0.6:b.phase2?0.45:0.3; if(Math.random()<ch){ b._comboLock=true; this.time.delayedCall(Phaser.Math.Between(520,780),()=>{ b._comboLock=false; this.bossFollowUp(b); }); } } }
  /* v8.1.124 เจ้าของ: บอสต้องมีจังหวะหยุดยืนนิ่ง แล้วปล่อยท่าใหญ่ → ทุก 14 วิ (เฟส 2: 11 · เฟส 3+: 9) บอสหยุด ชาร์จ 1.4 วิ (วงแดงค่อย ๆ เต็ม) → กระแทกในวง + กระสุน 2 วง → ยืนพัก 1.1 วิให้ตีสวน */
  /* v8.2.47 Ice Cage Sealing: ซี่กรงน้ำแข็งกระแทกทั้งแนวตั้งตามเส้นเตือน · ยืนในแนว (ห่างกลางแนว ≤ ICE_CAGE_HW) = โดน 1 ครั้ง · ช่องว่างที่เว้นไว้ 1 ช่องคือทางรอด */
  iceCageSlam(x,py,d){ const p=this.player; if(!p?.active)return; const HW=typeof ICE_CAGE_HW!=='undefined'?ICE_CAGE_HW:30,L=490;
    if(this.add?.graphics){ const g=this.camWorld(this.add.graphics().setDepth(py+3)); g.fillStyle(0xdff8ff,.55).fillRect(x-HW,py-L,HW*2,L*2); g.fillStyle(0xffffff,.8).fillRect(x-4,py-L,8,L*2); this.tweens.add({targets:g,alpha:0,duration:260,onComplete:()=>g.destroy()}); }
    if(Math.abs(p.x-x)<=HW&&Math.abs(p.y-py)<=L&&!this._iceCageHit){ this._iceCageHit=true; this.time.delayedCall(80,()=>{ this._iceCageHit=false; }); this.hurtPlayer(d,.5); this.moveSlowT=Math.max(this.moveSlowT||0,.6); } }
  bossBigMove(b,dt){ if(!b||!b.isBoss||!b.active||this._inTutorial||this.state!=='play')return false; const B=b._big,R=280,col=0xff4d6d;
    if(B&&B.boss!==this._bossEpoch){ b._big=null; b._bigHold=false; b._bigT=0; return false; }   /* บอสตัวใหม่จาก pool: ล้างสถานะเก่า */
    if(!B){ if((b._phaseInvuln||0)>0||b.frozen>0)return false; b._bigT=(b._bigT||0)+dt; if(b._bigT<(b.phase3?9:b.phase2?11:14))return false; b._bigT=0;
      const ring=this.camWorld(this.add.circle(b.x,b.y,R,col,.1).setStrokeStyle(5,col,.9).setDepth(2)),fill=this.camWorld(this.add.circle(b.x,b.y,R,col,.22).setDepth(2).setScale(.05));
      this.tweens.add({targets:fill,scale:1,duration:1400,ease:'Sine.in'}); this.tweens.add({targets:ring,alpha:{from:.5,to:1},duration:180,yoyo:true,repeat:3});
      b._big={t:1.4,stage:'charge',objs:[ring,fill],boss:this._bossEpoch}; b._bigHold=true; b.setVelocity?.(0,0); this.time.delayedCall(3200,()=>{ for(const o of [ring,fill])if(o.active)o.destroy(); });
      const nm=(STAGES[this.stageIndex]||{}).boss||'The boss'; this.showBanner?.('⚠️ '+nm+' gathers power!','Get out of the red circle!',1300); if(typeof Sfx!=='undefined')Sfx.bossWarn?.(); this.screenShake?.(240,.004); return true; }
    B.t-=dt; if(B.objs)for(const o of B.objs)if(o.active)o.setPosition(b.x,b.y);
    if(B.stage==='charge'){ if(B.t>0)return true; const p=this.player,bd=Math.max(12,Math.round((b.dmg||20)*.45));
      for(const o of B.objs||[])if(o.active)o.destroy(); B.objs=null;
      if(p&&this.dist(p.x,p.y,b.x,b.y)<R)this.hurtPlayer(Math.max(15,Math.round((b.dmg||20)*.9)));
      for(let w=0;w<2;w++)this.time.delayedCall(w*240,()=>{ if(!b.active||this.state!=='play')return; const n=b.phase3?24:18,off=w*Math.PI/n; for(let i=0;i<n;i++)this.foeShot(b.x,b.y,off+i*TAU/n,230+w*40,bd,col,1.1); });
      for(let w=0;w<2;w++){ const sw=this.camWorld(this.add.circle(b.x,b.y,30,col,0).setStrokeStyle(w?4:10,w?0xffffff:col,.95).setDepth(90005)); this.tweens.add({targets:sw,scale:R/30,alpha:{from:1,to:0},duration:420+w*160,delay:w*70,ease:'Cubic.easeOut',onComplete:()=>sw.destroy()}); }
      this.screenShake?.(320,.014); this.screenFlash?.(col,.18,240); if(typeof Sfx!=='undefined')Sfx.zap?.();
      B.stage='rest'; B.t=1.1; this.floatText?.(b.x,b.y-(b.displayHeight||120)*.6,'💫 Opening!',0xffe08a); return true; }
    if(B.t>0)return true; b._bigHold=false; b._big=null; b.atkCd=Math.min(b.atkCd||1,.8); return false; }
  _bossThinkCore(b,dt){
    if(!b.visible)b.setVisible(true); if(b.alpha<1)b.setAlpha(1);   // safety: บอสต้องมองเห็นเสมอตอนสู้ (กันค้างล่องหนจาก tween คัตซีน)
    if(!Number.isFinite(b.spd))b.spd=94;   // safety: กัน spd หลุด (undefined→NaN velocity→Position NaN→บอสล่องหน)
    if(!Number.isFinite(b.x)||!Number.isFinite(b.y)){ b.setPosition(this.player.x+140,this.player.y); if(b.body)b.body.reset(b.x,b.y); }   // Positionเสีย → รีเซ็ตข้างผู้เล่น
    // หายใจ "Alive" (สเกลเต้นเบา ๆ) —sชวลล้วน ไม่กระทบ body
    if(b._baseScale===undefined)b._baseScale=b.scaleX;
    b._breathe=(b._breathe||0)+dt*(b.phase2?5:3.2);
    if(b._drainMotion){
      b._drainKick=Math.max(0,(b._drainKick||0)-dt);const kick=b._drainKick>0?Math.sin((0.48-b._drainKick)*Math.PI/0.24)*0.13:0;
      const pulse=Math.sin(b._breathe),s=b._baseScale*(1+kick);
      b.setScale(s*(1+pulse*0.055),s*(1-pulse*0.045));
      b.setRotation(Math.sin(b._breathe*0.55)*(b._drainMotionKind==='boss'?0.045:0.065)+(b._drainLean||0)*kick*0.12);
    }else b.setScale(b._baseScale*(1+Math.sin(b._breathe)*(b.phase2?0.06:0.035)));
    if(b._aura){ b._aura.setPosition(b.x,b.y);   // ออร่าEnraged
      if(b._auraIsFx) b._aura.setScale((b._baseScale||1)*2.4*(1+Math.sin(b._breathe*1.5)*0.06));
      else b._aura.setScale(1+Math.sin(b._breathe*1.5)*0.12).setAlpha(0.12+Math.abs(Math.sin(b._breathe))*0.1); }
    if(b._hungerHalo){b._hungerHalo.forEach((h,i)=>{if(!h||!h.active)return;h.setPosition(b.x,b.y).setDepth(b.y-3-i).setRotation((b._hungerSpin||0)*(i?-.34:.48)).setScale((i?2.62:2.05)*(b.phase4?1.24:b.phase3?1.13:b.phase2?1.06:1)).setAlpha((i?0.1:0.2)+(b.phase4?0.06:0));});}
    if(b._hungerOrbs){b._hungerSpin=(b._hungerSpin||0)+dt*(b.phase4?2.35:b.phase3?1.82:1.18);b._hungerOrbs.forEach((o,i)=>{if(!o||!o.active)return;const a=b._hungerSpin+i*TAU/b._hungerOrbs.length,r=(b.phase4?174:b.phase3?151:b.phase2?132:119);o.setPosition(b.x+Math.cos(a)*r,b.y+Math.sin(a)*r*0.55).setDepth(b.y-4).setScale((b.phase4?0.36:0.26)+(Math.sin(a)+1)*0.06).setAlpha(0.32+Math.abs(Math.sin(a))*0.2);});}
    if(this.tickBossPhaseTransition(b,dt))return;
    if(b.frozen>0)return;
    if(b.atkCd===undefined)b.atkCd=1.6; b.atkCd-=dt*this.bossAggro(b)/(b.rageCdMul||1);
    if(b.isBoss&&this.stageIndex===4){const f=b.hp/b.maxhp;
      if(!b.phase2&&b.hp<=b.maxhp*0.72){b.phase2=true;this.beginBossPhaseTransition(b,1.8,0xff3f58);this.greatHungerMetamorph(b,2,0xff3f58);b.spd*=1.16;b.atkCd=0.55;this.showBanner('👑 Phase 2 · Crown Shatters','The first seal breaks — the Sovereign’s claws and blood-furnace awaken!',1900);}
      else if(!b.phase3&&b.hp<=b.maxhp*0.40){b.phase3=true;this.beginBossPhaseTransition(b,2.0,0xd95cff);this.greatHungerMetamorph(b,3,0xd95cff);b.spd*=1.14;b.atkCd=0.42;this.showBanner('🌑 Phase 3 · True Form of Hunger','All six eyes open — the void’s pull is swallowing the field!',2050);}
      else if(!b.phase4&&b.hp<=b.maxhp*0.14){b.phase4=true;this.beginBossPhaseTransition(b,2.35,0xffd166);this.greatHungerMetamorph(b,4,0xffd166);b.spd*=1.12;b.atkCd=0.24;this.showBanner('🌘 Final Phase · World Devourer','The sky goes dark — slay it before every memory is eaten!',2400);}
      if((b._phaseInvuln||0)>0)return;if(b.atkCd<=0)this.greatHungerAttack(b);return;}
    // v4.51: เช็กเฟสด้วย b.hp<=b.maxhp*X (ตรง ๆ) แทน f=b.hp/b.maxhp; f<=X — เพราะ phase-gate ใน damage() clamp hp=maxhp*gate พอดี แล้วการหาร (maxhp*.72)/maxhp อาจได้ .7200000001 > .72 → เฟสไม่ทริก → บอสค้าง gate-lock = อมตะ (Chapter 2 เจอเพราะใช้ f หาร ต่างจากด่าน 0-4 ที่เทียบ hp ตรง)
    if(b.isBoss&&this.stageIndex===9){
      if(!b.phase2&&b.hp<=b.maxhp*.75){b.phase2=true;this.beginBossPhaseTransition(b,2.05,0x56e5bd);this.trueRootMetamorph(b,2);b.spd*=1.12;b.atkCd=.43;this.showBanner('💚 Phase 2 · Heart Unveiled','The living cathedral opens — sap eruptions and the Root Choir join the fight!',2150);}
      else if(!b.phase3&&b.hp<=b.maxhp*.42){b.phase3=true;this.beginBossPhaseTransition(b,2.3,0xd95cff);this.trueRootMetamorph(b,3);b.spd*=1.10;b.atkCd=.26;this.showBanner('👑 Phase 3 · Crown of Memory','Every stolen memory takes root — cage, spiral and summons now overlap!',2350);}
      else if(!b.phase4&&b.hp<=b.maxhp*.18){b.phase4=true;this.beginBossPhaseTransition(b,2.55,0xffd166);this.trueRootMetamorph(b,4);b.spd*=1.08;b.atkCd=.18;this.showBanner('🌍 Final Phase · World Root','The throne binds every season together — survive Memory Eclipse and finish Chapter 2!',2600);}
      if((b._phaseInvuln||0)>0)return;if(b.atkCd<=0)this.trueRootmotherAttack(b);return;}
    if(b.isBoss&&this.stageIndex===8){
      if(!b.phase2&&b.hp<=b.maxhp*.72){b.phase2=true;this.beginBossPhaseTransition(b,1.95,0x8fdcff);this.chronobloomMetamorph(b,2);b.spd*=1.13;b.atkCd=.46;this.showBanner('🌦️ Phase 2 · Equinox Fracture','All four seasons overlap — spirals and guardians join the cycle!',2050);}
      else if(!b.phase3&&b.hp<=b.maxhp*.38){b.phase3=true;this.beginBossPhaseTransition(b,2.25,0xffd166);this.chronobloomMetamorph(b,3);b.spd*=1.11;b.atkCd=.26;this.showBanner('⏳ Phase 3 · Time Break','The conservatory clock shatters — survive the final rewind!',2300);}
      if((b._phaseInvuln||0)>0)return;if(b.atkCd<=0)this.chronobloomAttack(b);return;}
    if(b.isBoss&&this.stageIndex===7){
      if(!b.phase2&&b.hp<=b.maxhp*.70){b.phase2=true;this.beginBossPhaseTransition(b,1.9,0xffc95c);this.hornetQueenMetamorph(b,2);b.spd*=1.13;b.atkCd=.48;this.showBanner('🍯 Phase 2 · Royal Ferment','The hive crowns its queen — prisons, spirals and guards awaken!',2000);}
      else if(!b.phase3&&b.hp<=b.maxhp*.35){b.phase3=true;this.beginBossPhaseTransition(b,2.2,0xd95cff);this.hornetQueenMetamorph(b,3);b.spd*=1.11;b.atkCd=.28;this.showBanner("👑 Phase 3 · Queen's Decree",'Violet honey boils over — survive the final coronation!',2250);}
      if((b._phaseInvuln||0)>0)return;if(b.atkCd<=0)this.hornetQueenAttack(b);return;}
    if(b.isBoss&&this.stageIndex===6){
      if(!b.phase2&&b.hp<=b.maxhp*.68){b.phase2=true;this.beginBossPhaseTransition(b,1.85,0x56e5bd);this.behemothMetamorph(b,2);b.spd*=1.12;b.atkCd=.5;this.showBanner('🍄 Phase 2 · The Colony Awakens','The whole marsh joins the fight — formations and root lattices activate!',1950);}
      else if(!b.phase3&&b.hp<=b.maxhp*.34){b.phase3=true;this.beginBossPhaseTransition(b,2.15,0xd95cff);this.behemothMetamorph(b,3);b.spd*=1.10;b.atkCd=.3;this.showBanner('🫀 Phase 3 · Heart of the Marsh','The crown opens completely — survive the Heartstorm and destroy its core!',2200);}
      if((b._phaseInvuln||0)>0)return;if(b.atkCd<=0)this.myceliumBehemothAttack(b);return;}
    // เฟส 2 ตอนเลือดครึ่ง (เร็ว/ดุขึ้น) — Effectโกรธ
    const phase2At=(b.isBoss&&this.stageIndex===0)?0.68:(b.isBoss&&this.stageIndex===1?0.65:0.5),phase3At=(b.isBoss&&this.stageIndex===0)?0.35:(b.isBoss&&this.stageIndex===1?0.32:0.25);
    if(!b.phase2 && b.hp<=b.maxhp*phase2At){ b.phase2=true; this.beginBossPhaseTransition(b,b.isBoss?1.55:1.25,this.stageIndex===1?0x62e5cf:0xff6a4d); b.spd*=1.28; b.atkCd=0.6;
      if(this.stageIndex===1&&b.isBoss)this.drainBossPose(b,7,1100);
      if(b.isBoss&&(this.stageIndex===2||this.stageIndex===3))this.stageBossPose(b,6,1250);if(b.isMini&&this.stageIndex===4)this.stage5Pose(b,6,1250);
      if(this.stageIndex===5)this.chapter2Pose(b,6,1450);if(b.isMini&&this.stageIndex===9){this.rootKnightPose(b,3,1650);for(const t of ['tank','shooter','dasher']){const e=this.spawnEnemy(t);if(e)e.setPosition(b.x+Phaser.Math.Between(-145,145),b.y+Phaser.Math.Between(-100,100));}}
      if(b.isMini&&this.stageIndex===8){this.seasonKeeperPose(b,3,1550);for(const t of ['tank','shooter']){const e=this.spawnEnemy(t);if(e)e.setPosition(b.x+Phaser.Math.Between(-135,135),b.y+Phaser.Math.Between(-95,95));}}
      if(b.isMini&&this.stageIndex===7){this.royalStingerPose(b,3,1500);for(const t of ['tank','shooter']){const e=this.spawnEnemy(t);if(e)e.setPosition(b.x+Phaser.Math.Between(-130,130),b.y+Phaser.Math.Between(-90,90));}}
      if(b.isMini&&this.stageIndex===6){this.juggernautPose(b,3,1450);for(const t of ['tank','shooter']){const e=this.spawnEnemy(t);if(e)e.setPosition(b.x+Phaser.Math.Between(-130,130),b.y+Phaser.Math.Between(-90,90));}}
      this.showBanner(this.stageIndex===1?'🫧 Phase 2 · Pressure Surge':this.stageIndex===2?'🔥 Phase 2 · Overheat':this.stageIndex===3?'❄️ Phase 2 · Seal Broken':this.stageIndex===5?'🌱 Phase 2 · Root Breach':'🔥 Boss Enraged!',this.stageIndex===1?'The valve opens — suction and trapping bubbles activate!':this.stageIndex===2?'The conveyors speed up and the furnace unleashes fire waves!':this.stageIndex===3?'The ice cage starts closing in faster!':this.stageIndex===5?'The Rootmother opens toxic sap channels and forces the whole garden’s seasons!':'Phase 2 — attacks grow fiercer!',1500); if(b.isBoss&&this.stageIndex===0)this.bossPose(b,6,1000); this.screenShake(420,0.014); this.screenFlash(this.stageIndex===1?0x62e5cf:this.stageIndex===3?0x9fe0ff:this.stageIndex===5?0x56e5bd:0xff4d5a,0.3,420);
      if(!b.atks.includes('nova'))b.atks.push('nova');
      if(b.isBoss&&this.stageIndex===0){this.showBanner('💚 Phase 2 · Nest Breach','The Queen summons a swarm of acid ants!',1700);for(let i=0;i<3;i++)this.spawnEnemy(i%2?'acid':'fast');}   // เลิกเรียกเสาผลึก → เรียกลูกน้องแทน
      if(!b._aura&&this.anims.exists('fx_enrage')){ b._aura=this.camWorld(this.add.sprite(b.x,b.y,'fx_enrage',0).setDepth(3).setAlpha(0.72).setBlendMode(Phaser.BlendModes.ADD)); b._aura.play('fx_enrage'); b._auraIsFx=true; }
      for(let i=0;i<2;i++){ const r=this.camWorld(this.add.circle(b.x,b.y,20,0xff5a4d,0).setDepth(6).setStrokeStyle(4,0xff7a5a,0.9));
        this.tweens.add({targets:r,radius:150,alpha:{from:0.9,to:0},duration:500,delay:i*100,onComplete:()=>r.destroy()}); } }
    // เฟส 3 (บอสใหญ่) ตอนเลือด 25% — Enraged
    if(b.isBoss && !b.phase3 && b.hp<=b.maxhp*phase3At){ b.phase3=true; this.beginBossPhaseTransition(b,1.8,this.stageIndex===1?0x66d8ff:0xd95cff); b.spd*=1.2; b.atkCd=0.4;
      if(this.stageIndex===1)this.drainBossPose(b,7,1350);
      if(this.stageIndex===2||this.stageIndex===3)this.stageBossPose(b,6,1450);
      if(this.stageIndex===5)this.chapter2Pose(b,6,1650);
      this.showBanner(this.stageIndex===0?'👑 Phase 3 · Queen Enraged':this.stageIndex===1?'🌊 Phase 3 · Pipe Overflow':this.stageIndex===2?'🌋 Phase 3 · Furnace Rupture':this.stageIndex===3?'🌨️ Phase 3 · Frost Storm':this.stageIndex===5?'🌺 Phase 3 · Full Bloom':'💢 Total Frenzy!',this.stageIndex===0?'The breeding mounds open — the ant swarm won’t stop!':this.stageIndex===1?'Double-layered bubble waves — don’t stop moving!':this.stageIndex===2?'The fire cross and grinders activate together!':this.stageIndex===3?'The cage, ice blast, and storm will stack their timings!':this.stageIndex===5?'Poison petals fill the sky — destroy the crown seed before the roots devour the kitchen!':'Final phase — stay sharp!',1800); this.screenShake(520,0.016); this.screenFlash(this.stageIndex===1||this.stageIndex===3?0x66d8ff:this.stageIndex===5?0xd95cff:0xff2d4a,0.4,500);
      if(this.stageIndex===0){this.bossPose(b,6,1300);this.spawnBossObject('mound',b.x-230,b.y,16);this.spawnBossObject('mound',b.x+230,b.y,16);} }
    if((b._phaseInvuln||0)>0)return;
    if(b.atkCd>0)return;
    if(b.isMini&&this.stageIndex===9){this.rootKnightAttack(b);return;}
    if(b.isMini&&this.stageIndex===8){this.seasonKeeperAttack(b);return;}
    if(b.isMini&&this.stageIndex===7){this.royalStingerAttack(b);return;}
    if(b.isMini&&this.stageIndex===6){this.fungalJuggernautAttack(b);return;}
    if(b.isMini&&b.royalGuard){this.royalGuardAttack(b);return;}
    if(b.isBoss&&this.stageIndex===0){this.antQueenAttack(b);return;}
    if(this.stageIndex===1&&(b.isBoss||b.isMini)){this.drainBossAttack(b);return;}
    if(b.isBoss&&this.stageIndex===2){this.chiliBossAttack(b);return;}
    if(b.isBoss&&this.stageIndex===3){this.frostBossAttack(b);return;}
    if(b.isBoss&&this.stageIndex===5){this.rootmotherAttack(b);return;}
    if((b.isBoss&&this.stageIndex>=10)||(b.isMini&&[2,3,4,5,10,11,12,13,14].includes(this.stageIndex))){this.kitAttack(b);return;}   // v7.9.11 ท่าเฉพาะตัวที่เหลือ (BOSS_KITS)
    const atks=b.atks||['slam']; const pick=atks[Math.floor(Math.random()*atks.length)];if(this.stageIndex>=10)this.c3BossPose(b,pick==='summon'?4:pick==='charge'?2:3,pick==='charge'?900:pick==='summon'?900:550);if(b.isMini&&this.stageIndex===4)this.stage5Pose(b,{slam:5,aimed:5,radial:5,nova:6,charge:3,spiral:5,summon:5}[pick]??1,900);if(this.stageIndex===5)this.chapter2Pose(b,{slam:3,aimed:4,radial:4,nova:6,charge:3,spiral:4,summon:5,trap:3}[pick]??2,pick==='summon'?1150:900);
    const dm=1+this.stageIndex*0.12, pw=b.isBoss?1:0.9, fast=b.phase3?0.72:b.phase2?0.85:1;   // เว้นจังหวะให้ telegraph จบก่อนเริ่มท่าถัดไป
    if(pick==='slam'){ // สแลม AoE ตรงPositionผู้เล่น (เตือนก่อน หลบได้) · เฟส 3 = 3 points
      const hits=b.phase3?3:1;
      for(let i=0;i<hits;i++){ const tx=this.player.x+Phaser.Math.Between(-i*70,i*70), ty=this.player.y+Phaser.Math.Between(-i*70,i*70);
        this.spawnHazard(tx,ty,80+this.stageIndex*8, Math.round((16+this.stageIndex*6)*pw), 0xff5a4d); }
      b.atkCd=1.5*fast;
    } else if(pick==='radial'){ // ยิงWaitบทิศ (เฟส 3 = 2 วงหมุนต่าง)
      const n=(b.isBoss?10:7)+this.stageIndex+(b.phase3?6:0); const spd=150+this.stageIndex*12, dmg=Math.round((8+this.stageIndex*3)*pw);
      const off=Math.random()*Math.PI;
      for(let i=0;i<n;i++) this.foeShot(b.x,b.y,off+(i/n)*Math.PI*2,spd,dmg,0xffa54d);
      if(b.phase3) for(let i=0;i<n;i++) this.foeShot(b.x,b.y,-off+(i/n)*Math.PI*2,spd*0.7,dmg,0xff8fb5);
      Sfx.zap(); b.atkCd=1.6*fast;
    } else if(pick==='aimed'){ // ยิงกระจายเล็งผู้เล่น
      const base=Math.atan2(this.player.y-b.y,this.player.x-b.x), shots=b.phase3?7:b.phase2?5:3, spd=210+this.stageIndex*12, dmg=Math.round((10+this.stageIndex*3)*pw);
      for(let s=0;s<shots;s++) this.foeShot(b.x,b.y,base+(s-(shots-1)/2)*0.20,spd,dmg,0xff6b8a);
      Sfx.zap(); b.atkCd=1.3*fast;
    } else if(pick==='charge'){ // ชาร์จ ~900ms → ลำแสงเล็งหนาชัด → พุ่ง (หลบด้านข้างได้)
      this.chargeTelegraph(b,900,600+this.stageIndex*20,b.isBoss?30:24);
      b.atkCd=2.4*fast;
    } else if(pick==='summon'){ // วงเรียกลูกน้องแบบสะอาด Noneแถบขาวจาก sprite
      for(let i=0;i<3;i++){ const portal=this.anims.exists('fx_bossportal')
          ? this.spawnFxAnim('fx_bossportal',b.x,b.y+24,{scale:(90+i*20)/ASSET_FX.fx_bossportal.fw,depth:2,anchor:'center',alpha:0.8})
          : this.camWorld(this.add.image(b.x,b.y+24,'vfx_glow').setDepth(2).setTint(0xc58cff).setScale(0.25+i*0.06));
        if(portal)this.tweens.add({targets:portal,alpha:0,rotation:Math.PI,duration:620,delay:i*90,onComplete:()=>{if(portal.active)portal.destroy();}}); }
      const n=2+this.stageIndex+(b.phase3?2:0); this.time.delayedCall(360,()=>{ if(!b.active)return; for(let i=0;i<n;i++)this.spawnEnemy(Math.random()<0.5?'fast':'basic'); });
      Sfx.bossWarn(); b.atkCd=2.4*fast;
    } else if(pick==='nova'){ // คลื่นสังหารขยายจากบอส — ต้องหลบให้อยู่ในวง/นอกวง
      const px=b.x,py=b.y, maxR=220+this.stageIndex*22, novaDmg=Math.round((14+this.stageIndex*5)*pw);
      this.bossNovaWave(px,py,maxR,novaDmg,0);
      if(b.phase3)this.bossNovaWave(px,py,maxR,novaDmg,320);
      Sfx.zap(); this.screenShake(160,0.006); b.atkCd=1.8*fast;
    } else if(pick==='spiral'){ // ยิงเป็นเกลียวหมุน — ต้องวิ่งหนีเป็นวง
      const arms=b.isBoss?3:2, spd=165+this.stageIndex*10, dmg=Math.round((7+this.stageIndex*2.4)*pw), a0=Math.random()*Math.PI*2;
      for(let k=0;k<10;k++) this.time.delayedCall(k*60,()=>{ if(!b.active||this.state!=='play')return;
        for(let arm=0;arm<arms;arm++) this.foeShot(b.x,b.y,a0+k*0.5+arm*(Math.PI*2/arms),spd,dmg,0xffd0e8); });
      Sfx.zap(); b.atkCd=2.1*fast;
    } else if(pick==='trap'){ // วงกับดักล้อมผู้เล่น เว้นช่องเดียว — บังคับให้วิ่งหนีออกช่อง
      const n=10, R=150, gap=Math.floor(Math.random()*n), dmg=Math.round((12+this.stageIndex*4)*pw);
      for(let i=0;i<n;i++){ if(i===gap||i===(gap+1)%n)continue; const a=(i/n)*Math.PI*2;
        this.spawnHazard(this.player.x+Math.cos(a)*R,this.player.y+Math.sin(a)*R,58,dmg,0xff7a4d); }
      this.showBanner('⚠️ Encirclement!','Run out through the gap!',900); b.atkCd=2.1*fast;
    }
  }

  /* ---------- FX & ANIMATIONS ---------- */
  hitStop(ms){
    if(this._isHitStop) return;
    this._isHitStop = true;
    const oldSpd = this.physics.world.timeScale;
    this.physics.world.timeScale = 12;   // inverted: big = near-freeze (impact punch)
    this.time.delayedCall(ms, () => {
      this.physics.world.timeScale = oldSpd;
      this._isHitStop = false;
    });
  }
  // Juice: ป็อปคอมโบกลางจอตอนถึงหมุดหมาย (10/25/50/...) — เด้ง + เสียง + เขย่าเบา
  // Presentation-only sprites: central clearArtVfx destroys all tracked world art on transitions.
  combatReadSprite(key,x,y,w,h=w,depth=8){if(!this.textures?.exists?.(key))return null;const o=this.add.image(x,y,key).setDisplaySize(w,h).setDepth(depth);this.camWorld?.(o);this.trackArtVfx?.(o);return o;}
  combatReadSpark(key,x,y,size){if((Save.data.settings?.vfx??1)===0)return null;const set=this._readSparks||(this._readSparks=new Set());if(set.size>=10)return null;
    const o=this.combatReadSprite(key,x,y,size,size,93005);if(!o)return null;set.add(o);o.once('destroy',()=>{set.delete(o);this.tweens.killTweensOf(o);});this.tweens.add({targets:o,alpha:0,duration:200,onComplete:()=>o.destroy()});return o;}
  tickPlayerReadability(){const p=this.player;if(this.state!=='play'||!p?.active)return;
    let rim=this._readPlayerRing;if(!rim?.active)rim=this._readPlayerRing=this.combatReadSprite('cr_player_ring',p.x,p.y+31,68,28,p.depth-.1);
    rim?.setPosition(p.x,p.y+31).setDepth(p.depth-.1).setAlpha(.75).setVisible(p.visible!==false);
    if(this._readPlayerEdge){ if(this._readPlayerEdge.active)this._readPlayerEdge.destroy(); this._readPlayerEdge=null; }   /* v8.1.119 เจ้าของ: กรอบขาวรอบตัวละครไม่เอา → เลิกวาดเงาขอบสีครีม (เหลือวงใต้เท้า) */
  }
  tickEnemyReadability(e){if(!e?.active)return;if(e.isElite){const set=this._readElites||(this._readElites=new Set());let crest=e._readCrest;
      if(!crest?.active&&set.size<12){crest=e._readCrest=this.combatReadSprite('cr_elite_crest',e.x,e.y,20,20,93004);if(crest){set.add(crest);crest.once('destroy',()=>{set.delete(crest);if(e._readCrest===crest)e._readCrest=null;});}}
      crest?.setPosition(e.x,e.y-Math.max(28,e.body?.halfHeight||28)-34).setAlpha(.92);
      /* v8.1.129 เจ้าของ: Elite มีแสงเรืองรอบตัว (นอกจากตัวใหญ่) */ let gl=e._eliteGlow; if((!gl||!gl.active)&&set.size<12&&this.softGlowTex?.()){ gl=e._eliteGlow=this.camWorld(this.add.image(e.x,e.y,'mm_rglow').setTint(0xffa040)); gl.setBlendMode?.(Phaser.BlendModes.ADD); this.trackArtVfx?.(gl); gl._owner=e; (this._eliteGlows||(this._eliteGlows=new Set())).add(gl); }
      if(gl?.active){ const sz=Math.max(70,(e.displayWidth||60)*1.55); gl.setPosition(e.x,e.y).setDisplaySize(sz,sz*.8).setDepth((e.depth||e.y)-.2).setAlpha(.38+Math.sin((this.elapsed||0)*4+e.x*.01)*.12).setVisible(e.visible!==false); }
    }else if(e._readCrest||e._eliteGlow){if(e._readCrest){e._readCrest.destroy();e._readCrest=null;}if(e._eliteGlow){if(e._eliteGlow.active)e._eliteGlow.destroy();e._eliteGlow=null;}}
    const wind=e.frozen<=0&&(e._enemyAction?.state==='windup'||e.dashState==='wind');if(wind&&!e._readWind)this.combatReadSpark('cr_windup',e.x,e.y-Math.max(28,e.body?.halfHeight||28)-8,30);e._readWind=!!wind;
  }
  combatFxAlpha(key,w,alpha=1){key=key.replace(/^vfx81[345]_b/,'vfx_b');if(w<180)return alpha;
    if(/^(?:bpx_|fx_(?:momo|mint|cocoa|taro|sesame|yuzu|berry)|vfx_(?:glacier|frost|berry|recipe_))/.test(key))return Math.min(alpha,.68);
    if(w>=500&&/^vfx_b(?:05_eclipse|10_memory_eclipse|06_full_bloom|07_heartstorm|11_harvest_moon|12_empty_heart|15_first_bloom|pin_eclipse|pin_maw)$/.test(key))return Math.min(alpha,.58);return alpha;
  }
  /* v8.1.155 วงเตือนด้วยโค้ด: ขนาดตรงพื้นที่โดนจริง · ไส้สีค่อย ๆ ขยายจากกลาง = เวลาที่เหลือ · ขอบกะพริบถี่ขึ้นช่วงท้าย · ขาววาบก่อนตก · สีตามท่า/บอส */
  codeTelegraph(x,y,r,ms,color){ if(!this.add?.graphics||!this.tweens)return null; const fill=this.camWorld(this.add.graphics().setDepth(2)),rim=this.camWorld(this.add.graphics().setDepth(89001)),clock={p:0};
    const draw=()=>{ if(!fill.active||!rim.active)return; const p=clock.p,e=1-(1-p)*(1-p);
      fill.clear().fillStyle(color,.10).fillCircle(x,y,r).fillStyle(color,.16+.12*p).fillCircle(x,y,Math.max(2,r*e));
      const blink=p<.55?.85:.55+.45*Math.abs(Math.sin(p*p*42));
      rim.clear().lineStyle(6,0x1a0f24,.5).strokeCircle(x,y,r).lineStyle(3,color,blink).strokeCircle(x,y,r);
      if(p>.82)rim.lineStyle(2.5,0xffffff,Math.min(1,(p-.82)/.15)).strokeCircle(x,y,r-1); };
    draw(); this.tweens.add({targets:clock,p:1,duration:ms,ease:'Linear',onUpdate:draw,onComplete:draw}); return {fill,rim,clock,draw}; }
  makeHazardReadability(x,y,r,ms){if(!this.add?.graphics)return null;const g=this.add.graphics().setDepth(89001);this.camWorld?.(g);this.trackArtVfx?.(g);
    const rim=this.combatReadSprite('cr_warning_rim',x,y,r*2/COMBAT_WARN_FILL,r*2/COMBAT_WARN_FILL,89000),clock={p:0};let tween,dead=false;
    const draw=()=>{if(!g.active)return;g.clear().lineStyle(3,0x291124,.9).strokeCircle(x,y,r).lineStyle(1.5,0xff7352,.95).strokeCircle(x,y,r);if(clock.p>0)g.lineStyle(2.5,0xfff3ce,1).beginPath().arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*clock.p,false).strokePath();};
    const kill=()=>{if(dead)return;dead=true;tween?.remove();if(g.active)g.destroy();if(rim?.active)rim.destroy();};
    g.once('destroy',()=>{tween?.remove();if(rim?.active)rim.destroy();});draw();tween=this.tweens.add({targets:clock,p:1,duration:ms,ease:'Linear',onUpdate:draw});return{kill};
  }
  popDmg(n,x,y,crit,force){
    if(Save.data.settings&&Save.data.settings.damageNumbers===false)return;
    // v5.23: ลดตัวเลขลอยรก · v6.49.4: 90ms (มอนเยอะ 200ms) · คริโชว์เสมอ
    if(!force){const now=this.time.now,dense=this.enemies.countActive()>60;if(crit){if(now-(this._critNumAt??-Infinity)<(dense?160:90))return;this._critNumAt=now;}else{if(now-(this._dmgNumAt||0)<(dense?200:90))return;this._dmgNumAt=now;}}
    let t=this.dmgPool.pop();
    if(!t){ t=this.add.text(x,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px'}).setDepth(99999).setOrigin(0.5).setStroke('#2a1830',5).setShadow(0,2,'#000000',2,true,true); this.camWorld(t); }
    else t.setActive(true).setVisible(true);
    // v6.49.4: ใหญ่ขึ้น+ขอบเข้ม ชดเชยการซูมกล้องโลก ให้อ่านออกบนพื้นสว่าง
    const z=Math.max(0.5,this.viewZoom||1), fs=Math.round((crit?21:16)/z);
    const str=n;if(crit)this.combatReadSpark?.('cr_crit_spark',x+14/z,y-20/z,16/z);
    t.setText(str).setColor(crit?'#ffd23f':'#fff6e0').setFontSize(fs+'px').setStroke('#2a1830',Math.round(3/z)).setPosition(x+Phaser.Math.Between(-6,6),y-14).setAlpha(1).setScale(crit?1.22:1.1);
    this.tweens.add({targets:t,scale:1,duration:crit?140:110,ease:'Back.out'});
    this.tweens.add({targets:t,y:y-(crit?54:42),alpha:0,delay:crit?280:240,duration:crit?360:320,ease:'Quad.easeIn',
      onComplete:()=>{ t.setVisible(false); this.dmgPool.push(t); }});
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
  deathFling(e){ if(!this.fxOk()||!e.texture)return; const g=this.camWorld(this.add.image(e.x,e.y,e.texture.key,e.frame&&e.frame.name).setScale(e.scaleX,e.scaleY).setFlipX(!!e.flipX).setDepth(e.depth||e.y)); if(e.tintColor)g.setTint(e.tintColor);
    const a=Math.atan2(e.y-this.player.y,e.x-this.player.x)+Phaser.Math.FloatBetween(-0.35,0.35), d=Phaser.Math.Between(50,85);
    this.tweens.add({targets:g,x:e.x+Math.cos(a)*d,y:e.y+Math.sin(a)*d-18,angle:(Math.cos(a)>0?1:-1)*Phaser.Math.Between(160,300),scaleX:e.scaleX*0.55,scaleY:e.scaleY*0.55,alpha:0,duration:280,ease:'Cubic.out',onComplete:()=>g.destroy()}); }
  hitNudge(e){ if(!e?.active||e.isBoss||e.isMini||!this.player||(this.elapsed||0)<(e._nudgeAt||0))return; e._nudgeAt=(this.elapsed||0)+.12; const a=Math.atan2(e.y-this.player.y,e.x-this.player.x); e.x+=Math.cos(a)*4; e.y+=Math.sin(a)*4; }   // v8.1.49 กระเด็นถอยสั้น ๆ ตอนโดนกระสุน (ทุก 0.12 วิ/ตัว)
  mochiPop(e){ if((typeof PERF!=='undefined'&&PERF.lvl>=2)||!e?.texture||(this._popN||0)>=18)return; const P=this._popPool||(this._popPool=[]); let g=P.pop(); while(g&&!g.scene)g=P.pop();
    const sx=Math.abs(e.scaleX||1),sy=Math.abs(e.scaleY||1); if(g)g.setActive(true).setVisible(true).setTexture(e.texture.key,e.frame?.name).setPosition(e.x,e.y).setAlpha(1).setRotation(0); else g=this.camWorld(this.add.image(e.x,e.y,e.texture.key,e.frame?.name));
    g.setFlipX(!!e.flipX).setOrigin(e.originX??.5,e.originY??.5).setDepth(e.depth||e.y).setScale(sx,sy).setTintFill?.(0xffffff); this._popN=(this._popN||0)+1;
    const pc=this._cosPop; if(pc){ const pk='cos_'+pc.id; if(!(this.realTex?.(pk)&&this.heroFx?.(pk,e.x,e.y,40,{tint:Cos.tint(pc)})))this.burst?.(e.x,e.y,Cos.col(pc)); }
    this.tweens.add({targets:g,scaleX:sx*1.28,scaleY:sy*.62,alpha:.85,duration:90,ease:'Quad.out',onComplete:()=>{ g.clearTint?.(); this.tweens.add({targets:g,scaleX:sx*.2,scaleY:sy*1.15,alpha:0,duration:170,ease:'Quad.in',onComplete:()=>{ this._popN=Math.max(0,(this._popN||1)-1); if(!g.scene)return; if(P.length<24){g.setVisible(false).setActive(false);P.push(g);} else g.destroy(); }}); }}); }
  /* v8.1.128 เจ้าของ (ชุดขัดเกลาภาพ 1): วาบขาวตอนโดนตี · จำกัด 1 ครั้ง/0.3 วิ/ตัว (เดิมเอาออกเพราะโดนรัวแล้วขาวค้างจนมองไม่เห็นตัว) · 55 ms แล้วคืนสีเดิม */
  hitFlash(e){ if(!e||!e.active||!e.setTintFill||e._timeStop||e.frozen>0||(Save.data?.settings?.vfx??1)===0)return; const now=this.time?.now||0; if(now-(e._flAt||0)<(e.isBoss||e.isMini?650:300))return; e._flAt=now;
    const was=e.isTinted&&!e.tintFill,prev=e.tintTopLeft; e.setTintFill(0xffffff); this.time?.delayedCall?.(55,()=>{ if(!e.active)return; if(e._timeStop){ e.setTint?.(0xc9c9d2); return; } if(was)e.setTint(prev); else if(e.tintColor)e.setTint(e.tintColor); else e.clearTint(); }); }
  /* ตายแล้วแตกเป็นก้อนแป้งโมจิ 4–6 ก้อน กระเด็นโค้ง เด้งพื้น แล้วจาง · ใช้ภาพก้อนกลมนุ่มภาพเดียว · มีพร้อมกันสูงสุด 48 ก้อน */
  mochiChunks(x,y,color,big){ if(!this.add?.image||typeof document==='undefined'||(Save.data?.settings?.vfx??1)===0)return; const K='mm_chunk'; if(!this.textures.exists(K)){ const c=document.createElement('canvas'); c.width=c.height=32; const g=c.getContext('2d'),gr=g.createRadialGradient(12,11,2,16,16,15); gr.addColorStop(0,'#ffffff'); gr.addColorStop(.55,'#f4f0f4'); gr.addColorStop(1,'rgba(220,210,225,0)'); g.fillStyle=gr; g.beginPath(); g.ellipse(16,16,14,12,0,0,Math.PI*2); g.fill(); this.textures.addCanvas(K,c); }
    const n=big?6:4,live=this._chunkN||0; if(live>48)return; for(let i=0;i<n;i++){ const a=-Math.PI/2+(Math.random()-.5)*2.4,d=26+Math.random()*(big?60:38),tx=x+Math.cos(a)*d,ty=y+Math.abs(Math.sin(a))*10+8,sz=(big?.55:.38)+Math.random()*.25,o=this.camWorld(this.add.image(x,y,K).setTint(color).setScale(sz).setDepth(y+2)); this._chunkN=(this._chunkN||0)+1;
      this.tweens.add({targets:o,x:tx,duration:420,ease:'Quad.out'}); this.tweens.add({targets:o,y:{from:y,to:y-26-Math.random()*22},duration:200,ease:'Quad.out',yoyo:true,onComplete:()=>{ if(!o.active)return; o.y=ty; this.tweens.add({targets:o,scaleY:sz*.55,scaleX:sz*1.25,duration:90,yoyo:true}); this.tweens.add({targets:o,alpha:0,delay:380,duration:320,onComplete:()=>{ this._chunkN=Math.max(0,(this._chunkN||1)-1); o.destroy(); }}); }}); } }
  softGlowTex(){ const K='mm_rglow'; if(this.textures.exists(K))return K; if(typeof document==='undefined')return null; const cv=document.createElement('canvas'); cv.width=cv.height=128; const x2=cv.getContext('2d'),gg=x2.createRadialGradient(64,64,0,64,64,64); gg.addColorStop(0,'rgba(255,255,255,0.85)'); gg.addColorStop(.5,'rgba(255,255,255,0.35)'); gg.addColorStop(1,'rgba(255,255,255,0)'); x2.fillStyle=gg; x2.fillRect(0,0,128,128); this.textures.addCanvas(K,cv); return K; }
  /* v8.1.129 ฝุ่นแป้งเล็ก ๆ ที่เท้าตอนเดิน (ทุก 0.2 วิ ตอนเดินเร็วพอ) */
  playerStepDust(dt){ const p=this.player,v=p?.body?.velocity; if(!p||!v||this.state!=='play'||!this.pDust||(Save.data?.settings?.vfx??1)===0)return; if(v.x*v.x+v.y*v.y<60*60){ this._stepT=0; return; } this._stepT=(this._stepT||0)-dt; if(this._stepT>0)return; this._stepT=.2; this._emit(this.pDust,p.x+(Math.random()-.5)*14,p.y+26,0xf3e6d8,1); }
  /* v8.1.129 ละอองลอยในฉากตามสีด่าน (ฝุ่นแป้ง/ไอเย็น/สปอร์) · ตัวปล่อยอนุภาคเดียว เกิดในกรอบกล้อง ~4 ต่อวิ */
  stageAmbient(i){ if(this._ambEm){ this._ambEm.destroy?.(); this._ambEm=null; } if(i==null||!this.add?.particles||(Save.data?.settings?.vfx??1)===0||!this.textures.exists('dot'))return; const col=STAGE_MOOD[i]??0xffffff,cam=this.cameras.main,zone=new Phaser.Geom.Rectangle(0,0,10,10);
    const em=this._ambEm=this.add.particles(0,0,'dot',{ frequency:240, lifespan:{min:4200,max:6500}, speedX:{min:-10,max:10}, speedY:{min:-16,max:-4}, scale:{start:.55,end:.15}, alpha:{start:.42,end:0}, tint:[col,0xffffff], emitZone:{type:'random',source:zone}, quantity:1 }); em.setDepth(90001); this.camWorld(em);
    em._zone=zone; em._cam=cam; }
  tickStageAmbient(){ if(this._eliteGlows)for(const g of this._eliteGlows){ const o=g._owner; if(!g.active||!o||!o.active||!o.isElite){ this._eliteGlows.delete(g); if(g.active)g.destroy(); if(o&&o._eliteGlow===g)o._eliteGlow=null; } } const em=this._ambEm; if(!em||!em.active)return; const v=em._cam?.worldView; if(v&&v.width)em._zone.setTo(v.x,v.y,v.width,v.height); }
  /* ไฟส่องฉากตามธีมด่าน: ขอบจอเรืองสีประจำด่านจาง ๆ (มี 'vignette' ดำอยู่แล้ว · อันนี้ย้อมสี) */
  stageMood(i){ if(!this.add?.image||typeof document==='undefined')return; const K='mm_mood'; if(!this.textures.exists(K)){ const c=document.createElement('canvas'); c.width=c.height=256; const g=c.getContext('2d'),gr=g.createRadialGradient(128,128,70,128,128,182); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(1,'rgba(255,255,255,0.75)'); g.fillStyle=gr; g.fillRect(0,0,256,256); this.textures.addCanvas(K,c); }
    if(!this.moodVig||!this.moodVig.active){ this.moodVig=this.add.image(this.W/2,this.H/2,K).setScrollFactor(1).setDepth(39); this.camUI(this.moodVig); }
    this.stageAmbient?.(i); const col=i==null?null:STAGE_MOOD[i]; this.moodVig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H); if(col==null){ this.moodVig.setVisible(false); return; } this.moodVig.setTint(col).setAlpha(.26).setVisible(true); }
  burst(x,y,color){ const P=this._burstPool||(this._burstPool=[]);   // v7.8.92 perf: ใช้จุดซ้ำ (เดิมสร้าง/ทำลาย 7 รูปต่อครั้ง)
    for(let i=0;i<7;i++){ let p=P.pop(); while(p&&!p.scene)p=P.pop();
      if(p)p.setActive(true).setVisible(true).setPosition(x,y).setAlpha(1); else p=this.camWorld(this.add.image(x,y,'dot').setDepth(6));
      p.setTint(color).setScale(Phaser.Math.FloatBetween(0.5,1.1));
      const a=Math.random()*Math.PI*2, s=Phaser.Math.Between(40,150);
      this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:420,onComplete:()=>{ if(!p.scene)return; if(P.length<140){p.setVisible(false).setActive(false);P.push(p);} else p.destroy(); }}); } }
  squash(o,sx,sy){ o.setScale(sx,sy); this.tweens.add({targets:o,scaleX:1,scaleY:1,duration:220,ease:'Back.out'}); }
  // VFX ระเบิดวง (รูปจริง) — ขยายจากเล็ก→Fullรัศมี แล้วจางหาย · โอเวอร์เลย์แบนราบ (oval) เข้ากับมุมกล้อง
  fxBurst(key,x,y,radius,dur,spin){
    if(!this.textures.exists(key))return null;
    const base=this.textures.get(key).getSourceImage().width||256, full=(radius*2*1.15)/base;
    const im=this.camWorld(this.add.image(x,y,key).setDepth(6).setScale(full*0.35, full*0.35*0.82));
    const t={scaleX:full, scaleY:full*0.82, alpha:{from:0.95,to:0}, duration:dur, ease:'Quad.out', onComplete:()=>im.destroy()};
    if(spin)im.setRotation(Math.random()*Math.PI*2);
    this.tweens.add({targets:im, ...t}); return im; }
  // --- VFX: hit impact ring (expanding ring + sparks) --- throttled for performance
  vfxHitRing(x,y,color,big){
    if(!this.fxOk())return;
    if(!big){ this._hitVfxT=this._hitVfxT||0; const now=this.time.now; if(now-this._hitVfxT<60)return; this._hitVfxT=now; }
    const r=big?1.6:0.85;
    const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(color).setDepth(7).setScale(0.045*r,0.038*r).setAlpha(big?0.6:0.3));  // เบาลง ไม่สาดขาวFullจอ
    this.tweens.add({targets:ring,scaleX:0.36*r,scaleY:0.30*r,alpha:0,duration:big?300:200,ease:'Quad.out',onComplete:()=>ring.destroy()});
    this._emit(this.pSpark,x,y,color,big?7:3);
  }
  // --- VFX: death poof (smoke cloud) ---
  /* v8.2.10 มอนตาย: ร่างขาววาบ บีบแบนแล้วพองหาย ~140 ms (สำเนาภาพ · ไม่เกิน 14 ชิ้นพร้อมกัน) */
  enemyDeathPop(e){ const pose=e._fpTok&&e._artOv?.active?e._artOv:e;
    if(!this.add?.image||(this._deathGhosts||0)>=14||!pose.texture?.key||!e.visible)return; try{ const g=this.camWorld(this.add.image(pose.x,pose.y,pose.texture.key,pose.frame?.name).setOrigin(pose.originX,pose.originY).setScale(pose.scaleX,pose.scaleY).setFlipX(!!pose.flipX).setRotation(pose.rotation||0).setDepth((pose.depth||0)+1)); g.setTintFill?.(0xffffff); this._deathGhosts=(this._deathGhosts||0)+1;
    this.tweens.add({targets:g,scaleX:e.scaleX*1.35,scaleY:e.scaleY*.55,alpha:0,duration:140,ease:'Quad.out',onComplete:()=>{ g.destroy(); this._deathGhosts=Math.max(0,(this._deathGhosts||1)-1); }}); }catch(err){} }
  vfxDeathPoof(x,y,color,big){
    const sc=big?2.2:1.0;
    const halo=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xffffff).setDepth(6).setScale(0.035*sc,0.03*sc).setAlpha(0.6));
    this.tweens.add({targets:halo,scaleX:0.30*sc,scaleY:0.25*sc,alpha:0,duration:big?360:240,ease:'Quad.out',onComplete:()=>halo.destroy()});
    this._emit(this.pSmoke,x,y,color,big?14:6);
    this._emit(this.pSpark,x,y,color,big?7:3);
  }
  // --- VFX: skill cast glow (radial flash at caster) ---
  vfxCastGlow(color){
    const p=this.player; if(!p)return;
    const glow=this.camWorld(this.add.image(p.x,p.y,'vfx_glow').setTint(color).setDepth(5).setScale(0.13).setAlpha(0.75));
    this.tweens.add({targets:glow,scale:0.70,alpha:0,duration:300,ease:'Quad.out',onComplete:()=>glow.destroy()});
  }
  // --- VFX: speed lines during dash ---
  vfxSpeedLine(x,y,ang){
    const ln=this.camWorld(this.add.image(x,y,'vfx_line').setTint(0xbfe8ff).setDepth(4).setRotation(ang+Math.PI).setScale(0.55,0.25).setAlpha(0.65));
    this.tweens.add({targets:ln,scaleX:0.85,alpha:0,duration:200,onComplete:()=>ln.destroy()});
  }
  // --- VFX: enemy spawn poof --- throttled
  vfxSpawnPoof(x,y){
    this._spawnVfxT=this._spawnVfxT||0; const now=this.time.now; if(now-this._spawnVfxT<120)return; this._spawnVfxT=now;
    const p=this.camWorld(this.add.image(x,y,'vfx_poof').setTint(0xb98cff).setDepth(3).setScale(0.035).setAlpha(0.55));
    this.tweens.add({targets:p,scale:0.28,alpha:0,duration:260,ease:'Quad.out',onComplete:()=>p.destroy()});
  }
  // --- VFX: hurt vignette flash ---
  vfxHurtFlash(){
    const f=this.add.rectangle(this.W/2,this.H/2,this.W,this.H,0xff3344,0.18).setScrollFactor(1).setDepth(79);
    this.camUI(f); this.tweens.add({targets:f,alpha:0,duration:280,onComplete:()=>f.destroy()});
  }
  // --- VFX: level up celebration burst ---
  vfxLevelUp(){
    const p=this.player; if(!p)return;
    if(!this.playGrowthWorld('levelup')){
    if(this.textures.exists('fx_levelup')&&this.anims.exists('fx_levelup')) this.spawnFxAnim('fx_levelup',p.x,p.y,{scale:220/ASSET_FX.fx_levelup.fw,depth:8,anchor:'center'});
    else { const ring=this.camWorld(this.add.image(p.x,p.y,'vfx_ring').setTint(0xffe08a).setDepth(8).setScale(0.2,0.16).setAlpha(0.9));
      this.tweens.add({targets:ring,scaleX:3.2,scaleY:2.6,alpha:0,duration:450,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
    }
    const cols=[0xffe08a,0xff8fb5,0xbfe8ff,0xb6f0d6];
    cols.forEach(c=>this._emit(this.pDust,p.x,p.y,c,4));   // ฝุ่นหลากสีพุ่งฉลอง
  }
  // --- VFX: collect sparkle (orb pickup) ---
  vfxCollectSparkle(x,y,color){ this._emit(this.pSpark,x,y-6,color,4); }
  // faux-2.5D: วาดเงาวงรีใต้ทุกตัวในเลเยอร์เดียว (เรียกทุกเฟรม)
  drawShadows(){
    const g=this.shadowG; if(!g)return; g.clear(); g.fillStyle(this._chapter25D?0x041711:0x0a0510,this._chapter25D?0.40:0.28);
    const p=this.player; g.fillEllipse(p.x,p.y+31,this._chapter25D?52:46,this._chapter25D?18:15);
    // Android WebView บางรุ่น render ellipse จำนวนมากเป็นแท่งดำ จึงไม่วาดเงาศัตรูรวมใน Graphics นี้
    this.crates.children.iterate(c=>{ if(c&&c.active) g.fillEllipse(c.x, c.y+16, 30, 11); });
    this.heals.children.iterate(h=>{ if(h&&h.active) g.fillEllipse(h.x, h.y+11, 20, 8); });
    this.drawFoeShadows?.(); this.playerStepDust?.(1/60); this.tickStageAmbient?.();
  }
  /* v8.1.118 เจ้าของ: มอนกลืนไปกับฉาก → เงานุ่มใต้เท้าทุกตัว · ใช้รูปเดียว (canvas ไล่สี) เป็น image pool ไม่ใช่ ellipse ใน Graphics (เคยเป็นแท่งดำบน Android WebView) · ภาพเดียวกัน depth เดียวกัน = batch เดียว */
  /* v8.1.120 เจ้าของ: แสงนุ่มรอบตัวผู้เล่น (พื้นรอบตัวสว่างกว่าขอบจอ) · รูป canvas ไล่สีครั้งเดียว · ADD จาง ๆ ใต้ทุกตัว */
  drawPlayerLight(){ const p=this.player; if(!p||!this.add||typeof document==='undefined')return; const K='mm_player_light'; let L=this._pLight;
    if(!this.textures.exists(K)){ const c=document.createElement('canvas'); c.width=c.height=256; const x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(255,244,222,0.9)'); g.addColorStop(.45,'rgba(255,236,206,0.45)'); g.addColorStop(1,'rgba(255,230,200,0)'); x.fillStyle=g; x.fillRect(0,0,256,256); this.textures.addCanvas(K,c); }
    if(!L||!L.active){ L=this._pLight=this.camWorld(this.add.image(p.x,p.y,K)); L.setDepth?.(-99500); L.setBlendMode?.(typeof Phaser!=='undefined'?Phaser.BlendModes.ADD:1); L.setDisplaySize?.(620,460); } const on=this.state==='play'&&p.visible!==false; L.setVisible(on); if(on)L.setPosition(p.x,p.y+18).setAlpha(this._chapter25D?.12:.17); }
  drawFoeShadows(){ if(!this.enemies||!this.add||typeof document==='undefined')return; const K='mm_soft_shadow';
    if(!this.textures.exists(K)){ const c=document.createElement('canvas'); c.width=128; c.height=48; const x=c.getContext('2d'); x.scale(1,48/128); const g=x.createRadialGradient(64,64,4,64,64,64); g.addColorStop(0,'rgba(10,5,16,0.62)'); g.addColorStop(.55,'rgba(10,5,16,0.34)'); g.addColorStop(1,'rgba(10,5,16,0)'); x.fillStyle=g; x.fillRect(0,0,128,128); this.textures.addCanvas(K,c); }
    const P=this._foeSh||(this._foeSh=[]),dark=this._chapter25D?1.25:1; let n=0;
    const pl=this.player; this.enemies.children.iterate(e=>{ if(!e||!e.active||!e.visible)return;
      const pantry=e._fpTok&&e._artOv?.active?e._artOv:null;
      const pose=pantry||e;
      if(pantry){
        const occludes=pl&&e.depth>pl.depth&&Math.abs(e.x-pl.x)<pose.displayWidth*.42&&e.y-pl.y<pose.displayHeight*.7;
        pantry.setAlpha(occludes?.5:1);
      }
      /* v8.1.120 เจ้าของ: มอนที่ยืนบังตัวเรา (อยู่หน้าและทับตัว) จางลงครึ่งหนึ่ง เห็นตัวเราชัด */ const occ=!pantry&&!!pl&&e.depth>pl.depth&&Math.abs(e.x-pl.x)<(e.displayWidth||40)*.42&&e.y-pl.y<(e.displayHeight||40)*.7; if(occ&&!e._occ&&e.alpha>=.95){ e._occ=true; e._occA=1; e.setAlpha(.5); } else if(!occ&&e._occ){ e._occ=false; if(e.alpha<=.55)e.setAlpha(1); }   /* v8.1.155 เจ้าของ 🐞 มอนตัวจางค้าง: เดิมจำค่า alpha ตอนกำลังเฟดเข้า (spawnRise 0→1) แล้วคืนค่านั้น = จางถาวร → จางเฉพาะตัวที่ทึบเต็ม · คืนเป็น 1 เสมอ */
      const ea=pantry?1:e._occ?(e._occA??1):e.alpha; if(ea<.05)return; let sh=P[n]; if(!sh||!sh.active){ sh=P[n]=this.camWorld(this.add.image(0,0,K).setDepth(-99000)); } n++;
      const w=Math.max(26,Math.min(260,(pose.displayWidth||40)*.72)); sh.setPosition(e.x,e.y+(pose.displayHeight||40)*.4).setDisplaySize(w,w*.34).setAlpha(Math.min(1,ea*dark)).setVisible(true); });
    this.drawPlayerLight?.();
    for(let i=n;i<P.length;i++)if(P[i]&&P[i].visible)P[i].setVisible(false); }

  // ปรับสเกล+ขอบชนของตัวละครให้เท่ากราฟิกเดิม (60px) ไม่ว่ารูปจริงจะกี่พิกเซล
  setCharScale(key){
    const src = (ASSET_SHEETS[key]&&ASSET_SHEETS[key].frame)
      || (this.player&&this.player.frame&&this.player.frame.width)
      || 60;
    // ปรับสเกลตาม "real footprints" ของอาร์ต (bbox เฉลี่ย กว้าง+สูง /2 วัดจากชีต) ให้ทุกตัวดูขนาดพอ ๆ กัน
    // Momo/Mint/Chocolate ใช้สัดส่วนอาร์ตมาตรฐานเดียวกันและแสดงผลขนาดเดียวกัน
    const baseKey=key.replace(/_(idle|run|attack|dash|hurt|gale)$/,'');
    const FP={ char_momo:110, char_mint:110, char_cocoa:110, char_taro:107, char_sesame:117, char_berry:116, char_yuzu:112 }[baseKey];
    const TARGET=['char_momo','char_mint','char_cocoa','char_berry'].includes(baseKey)?56:66;
    this._pBase = FP ? (TARGET/FP) : (90/src);
    this._charKey=key;
    this._attackPoseTime=0;this._attackTextureKey=null;this._momoIdleT=0;this._momoDashT=0;
    this._castRecoilT=0;this._charRunT=0;
    this._hasFrames = this.textures.exists(key) && this.textures.get(key).frameTotal>1;
    if(this._hasFrames){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2,4); this._poseHold=0; }
    const r=24, off=Math.max(0,(src-2*r)/2);
    if(this.player&&this.player.body)this.player.body.setCircle(r,off,off);this._bodyMul=1;
    this.resetCharacterRenderer();
  }
  resetCharacterRenderer(){
    this._actorWeight=null;
    this.player.setVisible(true);
  }
  actorMotionStyle(){
    const styles=this._actorStyles||(this._actorStyles={normal:{kick:.045,duration:.18,wind:.12,sway:.02},sniper:{kick:.11,duration:.26,wind:.22,sway:.012},pierce:{kick:.085,duration:.25,wind:.23,sway:.014},shotgun:{kick:.09,duration:.22,wind:.14,sway:.018},titan:{kick:.065,duration:.28,wind:.25,sway:.012},magic:{kick:.035,duration:.2,wind:.14,sway:.016}});
    const path=this.basicAttack?.path;return styles[path]||(this.character==='taro'||this.character==='yuzu'||this.character==='sesame'?styles.magic:styles.normal);
  }
  actorMotionState(){
    const p=this.player,path=this.basicAttack?.path,epoch=this._artEpoch||0;let u=this._actorWeight;
    if(!u||u.player!==p||u.hero!==this.character||u.path!==path||u.epoch!==epoch)u=this._actorWeight={player:p,hero:this.character,path,epoch,clock:0,speed:0,lean:0,stop:0,land:0,kick:0,kickTotal:.18};return u;
  }
  actorAttackKick(){
    if(this.state&&this.state!=='play')return;
    const u=this.actorMotionState();if(this._impalerCharge||this._berryCharge||this._snipe){u.charging=true;return;}
    const style=this.actorMotionStyle();u.fromCharge=!!u.charging;u.charging=false;u.kick=u.kickTotal=style.duration;
  }
  actorGaitStep(dt,moving){const u=this.actorMotionState();if(moving){const speed=this.player.body.velocity.length(),rate=Math.max(.35,Math.min(1.6,speed/(this.player.baseSpeed||160)));u.gait=(u.gait||0)+dt*rate*(this.character==='cocoa'&&this.dashTime>0?1.6:1);}return u.gait||0;}
  actorDashLand(){const u=this.actorMotionState();u.land=.2;} // Visual recovery never holds a walking pose.
  actorAttackFrame(progress,n){
    const p=Math.max(0,Math.min(1,progress));if(this.hubMotionAllowed?.()===false)return Math.min(n-1,Math.floor(p*n));
    if(this.actorMotionState().fromCharge)return Math.min(n-1,Math.floor((.3+.7*p)*n));
    const wind=this.actorMotionStyle().wind,release=wind+.2;
    const phase=p<wind?p/wind*.18:p<release?.18+(p-wind)/.2*.45:.63+(p-release)/(1-release)*.37;
    return Math.min(n-1,Math.floor(phase*n));
  }
  actorChargePose(){
    const c=this._impalerCharge||this._berryCharge||this._snipe;if(!c||this._poseHold>0||this.player?.active===false||c.basic&&c.basic!==this.basicAttack||c.epoch!=null&&c.epoch!==(this._artEpoch||0))return false;
    const sniper=this.character==='momo'&&this.basicAttack?.path==='sniper'&&this.textures.exists('char_momo_sniper_charge_motion823'),key=sniper?'char_momo_sniper_charge_motion823':'char_'+this.character+'_attack';if(!this.textures.exists(key))return false;
    this.actorMotionState().charging=true;
    const n=Math.max(1,(this.textures.get?.(key)?.frameTotal||9)-1),progress=c.ms?Math.max(0,Math.min(1,((this.time?.now||0)-c.start)/c.ms)):(this.snipeCharge?.()||0);
    this.player.setTexture(key).setFrame(sniper?Math.min(n-1,Math.floor(progress*n)):Math.min(n-1,progress<.4?0:1));return true;
  }
  mintImpalerPose(dt,moving){
    const c=this._impalerCharge,p=this.player;if(this.state&&this.state!=='play'||this.character!=='mint'||!c||!p?.active||p.hp<=0||c.player&&c.player!==p||this._poseHold>0||this.dashTime>0||this.basicAttack!==c.basic||c.basic?.path!=='pierce'||(this._artEpoch||0)!==c.epoch)return false;
    const key=moving?'char_mint_impaler_move':'char_mint_impaler_charge';if(!this.textures.exists(key))return false;
    const progress=Math.max(0,Math.min(1,((this.time?.now||0)-c.start)/Math.max(1,c.ms))),red=this.hubMotionAllowed?.()===false;
    this.actorMotionState().charging=true;
    let frame;if(moving){this._charRunT=(this._charRunT||0)+dt;const gait=this.actorGaitStep(dt,true);frame=red?5:Math.floor(gait*32/3)%8;}else frame=red?5:Math.min(7,Math.floor(progress*8));
    if(p.texture.key!==key)p.setTexture(key);p.setFrame(frame);if(!moving&&Math.abs(Math.cos(c.angle))>.1)p.setFlipX(Math.cos(c.angle)<0);return true;
  }
  tickActorWeight(dt){
    const p=this.player;if(!p?.body||this.state&&this.state!=='play')return;
    const u=this.actorMotionState(),style=this.actorMotionStyle(),span=Math.max(0,Math.min(.1,dt)),v=p.body.velocity,speed=Math.hypot(v.x,v.y),moving=speed>24,red=this.hubMotionAllowed?.()===false;
    if(u.speed>24&&!moving)u.stop=.2;u.speed=speed;u.stop=Math.max(0,u.stop-span);u.land=Math.max(0,u.land-span);u.kick=Math.max(0,u.kick-span);
    u.clock+=moving?span*Math.max(.5,Math.min(1.6,speed/160)):0;
    const target=moving?Math.max(-.09,Math.min(.09,v.x/1800)):0;u.lean+=(target-u.lean)*(1-Math.exp(-span*10));
    if(red){p.rotation=0;return;}
    const c=this._impalerCharge||this._berryCharge||this._snipe,angle=c?.angle??c?.ang,side=angle!=null?Math.cos(angle):(p.flipX?-1:1);
    const kick=u.kick>0?Math.sin(Math.PI*(1-u.kick/u.kickTotal))*style.kick:0;
    const settle=(u.stop>0?Math.sin(u.stop/.2*Math.PI)*.018:0)+(u.land>0?Math.sin(u.land/.2*Math.PI)*.035:0);
    const charge=c&&!moving?-.025*side:0,gait=moving?Math.sin(u.clock*14)*style.sway:0;
    p.rotation=Math.max(-.17,Math.min(.17,u.lean+gait-kick*side+settle*(p.flipX?-1:1)+charge));
  }
  // เลือกเฟรมท่าทาง: พุ่ง=ยืด ·s่ง=สลับก้าว · โดนตี=ย่อ · Normal=ยืน+กะพริบตา
  bpPose(key,d){if(this.textures?.exists?.(key)){if(/_motion823$/.test(key))d=Math.max(d||0,.95);this._bpPose={key,t:0,d};this._attackPoseTime=0;}}   // v8.1.32 เจ้าของ: ท่าใหม่เห็นแต่ไม่ชัด → เล่นอย่างน้อย 0.95 วิ (เดิม 0.4–0.5) + ค้างเฟรมกลาง
  updatePose(dt){
    if(this.state&&this.state!=='play')return;
    if(!this._hasFrames)return;
    if(this._bpPose){const q=this._bpPose;q.t+=dt;if(q.t<q.d&&this.textures.exists(q.key)){if(this.player.texture.key!==q.key)this.player.setTexture(q.key);const n=Math.max(1,(this.textures.get?.(q.key)?.frameTotal||9)-1);const k=q.t/q.d,e=/_motion823$/.test(q.key)?(k<.3?k/.3*.45:k<.75?.45+(k-.3)/.45*.2:.65+(k-.75)/.25*.35):k;this.player.setFrame(Math.min(n-1,Math.floor(e*n)));return;}this._bpPose=null;}   // motion823: เร็วช่วงง้าง ค้างช่วงท่าเด่นกลางชีต แล้วกลับ
    if(this.character==='cocoa'&&this._titanHold&&this.textures.exists('char_cocoa_titan_charge')){const mv=this.player.body&&this.player.body.velocity.length()>24,k=mv&&this.textures.exists('char_cocoa_titan_walk')?'char_cocoa_titan_walk':'char_cocoa_titan_charge';this._bpLoopT=(this._bpLoopT||0)+dt;if(this.player.texture.key!==k)this.player.setTexture(k);this.player.setFrame(Math.floor(this._bpLoopT*10)%(k==='char_cocoa_titan_walk'?12:8));return;}
    if(this.character==='cocoa'&&this._cocoaFlickerPose){
      const pose=this._cocoaFlickerPose;pose.t+=dt;
      if(this.textures.exists('char_cocoa_attack')){if(this.player.texture.key!=='char_cocoa_attack')this.player.setTexture('char_cocoa_attack');this.player.setFrame(pose.t<pose.wind?Math.min(2,Math.floor(pose.t/Math.max(.01,pose.wind)*3)):Math.min(7,3+Math.floor((pose.t-pose.wind)/.05)));   /* v8.2.9 ใช้ครบ 8 เฟรม (เดิม 0–3) */return;}
    }
    const moving=this.player.body&&this.player.body.velocity.length()>24;
    if(this.mintImpalerPose?.(dt,moving))return;
    if(!moving&&this.dashTime<=0&&this.actorChargePose?.())return;
    // Keep gait phase through casts, hits and Dash; Chocolate accelerates its cadence during Dash.
    this._charRunT=(this._charRunT||0)+(moving?dt*(this.character==='cocoa'&&this.dashTime>0?1.6:1):0);
    const gait=this.actorGaitStep?this.actorGaitStep(dt,moving):this._charRunT;
    // A suppressed Chocolate punch must not appear halfway through when movement stops.
    if(this.character==='cocoa'&&(moving||this.dashTime>0)){this._attackPoseTime=0;this._attackTextureKey=null;}
    if(this._attackPoseTime>0){
      this._attackPoseTime=Math.max(0,this._attackPoseTime-dt);
      const attackKey=this._attackTextureKey||'char_'+this.character+'_attack';
      if(this.textures.exists(attackKey)&&!(moving||this.dashTime>0)){
        if(this.player.texture.key!==attackKey)this.player.setTexture(attackKey);
        {const n=Math.max(1,(this.textures.get?.(attackKey)?.frameTotal||9)-1),progress=1-this._attackPoseTime/this._attackPoseDuration;this.player.setFrame(this.actorAttackFrame?this.actorAttackFrame(progress,n):Math.min(n-1,Math.floor(progress*n)));}
        if(this._attackPoseTime>0)return;
      }
    }
    if(this._poseHold>0){
      this._poseHold=Math.max(0,this._poseHold-dt);
      if(this.player.texture.key==='char_'+this.character+'_hurt'){ const n=Math.max(1,(this.textures.get?.(this.player.texture.key)?.frameTotal||9)-1);
        this.player.setFrame(Math.min(n-1,Math.floor((1-this._poseHold/this._poseDuration)*n))); }
      if(this._poseHold>0)return;
    }
    const baseCharKey='char_'+this.character;
    const runCharKey=baseCharKey+'_run';
    const hasRun=this.textures.exists(runCharKey);
    if(this.dashTime>0){
      if(this.character==='cocoa'&&hasRun){
        if(this.player.texture.key!==runCharKey)this.player.setTexture(runCharKey);
        this.player.setFrame(Math.floor(gait*16)%12);return;
      }
      if(this.character==='momo'&&this.textures.exists('char_momo_dash')){
        if(this.player.texture.key!=='char_momo_dash'){this.player.setTexture('char_momo_dash');this._momoDashT=0;}
        this._momoDashT+=dt;this.player.setFrame(Math.min(7,Math.floor(this._momoDashT*40)));return;
      }
      if(hasRun&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);
      this.player.setFrame(CF.stretch); return;
    }
    if(moving){
      const path=this.basicAttack?.path,buildRun=this.character==='momo'&&path==='sniper'?'char_momo_sniper_run_motion823':this.character==='mint'&&path==='pierce'?'char_mint_impaler_run_motion823':this.character==='cocoa'&&path==='titan'?'char_cocoa_titan_run_motion823':null;
      if(buildRun&&this.textures.exists(buildRun)){if(this.player.texture.key!==buildRun)this.player.setTexture(buildRun);this.player.setFrame(Math.floor(gait*12)%8);return;}
      if(hasRun){
        if(this.player.texture.key!==runCharKey)this.player.setTexture(runCharKey);
        this.player.setFrame(Math.floor(gait*16)%12);
      }else{
        if(this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);
        const stepIdx = Math.floor((this._wob / (Math.PI * 0.5)) % 4);
        const frames = [CF.idle, CF.squash, CF.stretch, CF.blink];
        this.player.setFrame(frames[stepIdx] || CF.idle);
      }
      return;
    }
    if(this.character==='momo'&&this.textures.exists('char_momo_idle')){
      if(this.player.texture.key!=='char_momo_idle'){this.player.setTexture('char_momo_idle');this._momoIdleT=0;}
      this._momoIdleT=(this._momoIdleT||0)+dt;
      this.player.setFrame(Math.floor(this._momoIdleT*5)%8);return;
    }
    if(this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);
    this._blinkT-=dt;
    if(this._blinkT<=0){ this.player.setFrame(CF.blink);
      if(this._blinkT<-0.13){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2.2,4.5); } }
    else this.player.setFrame(CF.idle);
  }
  poseFlash(frame,ms){ if(this.bpPose&&this.character!=='cocoa'&&frame===CF.cheer&&!this._uqWind&&this.textures?.exists?.('char_'+this.character+'_victory')){ this.bpPose('char_'+this.character+'_victory',1); return; }   /* v8.2.12 ใบ 83 ท่าชนะ */
    if(this.bpPose&&this.character==='cocoa'&&!this._titanHold&&(frame===CF.hurt||frame===CF.cheer)&&this.textures?.exists?.(frame===CF.hurt?'char_cocoa_hurt':'char_cocoa_victory')){if(frame===CF.hurt&&this._cocoaFlicker)this.finishCocoaFlicker(true);this.bpPose(frame===CF.hurt?'char_cocoa_hurt':'char_cocoa_victory',frame===CF.hurt?.3:1);return;}
    if(frame===CF.hurt&&this._cocoaFlicker)this.finishCocoaFlicker(true);if(frame===CF.hurt&&this._impalerCharge)this.releaseImpalerCharge(false);if(frame===CF.hurt&&this._berryCharge)this.releaseBerryCharge(false);if(!this._hasFrames)return; this._attackPoseTime=0;this._attackTextureKey=null;
    { const hk='char_'+this.character+'_hurt'; if(frame===CF.hurt&&this.character!=='cocoa'&&this.textures.exists(hk)){   /* v8.2.12 ใบ 83: ทุกฮีโร่ที่มีชีตโดนตี (Momo เดิม + Yuzu/Mint/Taro/Sesame) */
      this._poseDuration=Math.max(.26,(ms||160)/1000);this._poseHold=this._poseDuration;this.player.setTexture(hk).setFrame(0);return; } }
    const baseCharKey='char_'+this.character; if(this.textures.exists(baseCharKey)&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey); this.player.setFrame(frame); this._poseHold=(ms||160)/1000; }
  poseAttack(ms,textureKey){
    const key=textureKey&&this.textures?.exists?.(textureKey)?textureKey:'char_'+this.character+'_attack';
    if(!this._hasFrames)return;
    this.actorAttackKick?.();
    const moving=this.player.body&&this.player.body.velocity.length()>24;
    if(this.character!=='cocoa'&&!moving&&this._attackTextureKey===key&&this._attackPoseTime>this._attackPoseDuration*.55&&!this._impalerCharge&&!this._berryCharge&&!this._snipe&&!this._actorWeight?.fromCharge)return;
    if(this.character!=='cocoa')this._castRecoilT=0.18;
    // No full-body pose should interrupt locomotion, including fallback casts.
    if(!this.textures.exists(key)){
      if(!moving&&this.dashTime<=0)this.poseFlash(CF.cast,ms);
      return;
    }
    if(this.character==='cocoa'){
      if(moving||this.dashTime>0||this._poseHold>0)return;
      // Finish the visible clip; fast attacks still deal damage on their original schedule.
      if(this._attackPoseTime>this._attackPoseDuration*.45&&this.player.texture.key===key)return;
      ms=Math.max(320,ms||400);
    }
    if(this.character==='cocoa')this._castRecoilT=0.18;
    this._poseHold=0;this._attackTextureKey=key;this._attackPoseDuration=(ms||400)/1000;this._attackPoseTime=this._attackPoseDuration;
    if(moving||this.dashTime>0)return;
    this.player.setTexture(key).setFrame(0);
  }
  // อนิเมชันตัวละคร: สปริงเจลลี่ + หายใจ + หันหน้าตามทิศ + ควันฝุ่น + เงา Dash
  animatePlayer(dt){
    const p=this.player; if(!p||!p.body)return;
    if(this.state&&this.state!=='play')return;
    if(this._sqVX===undefined){ this._sqVX=0; this._sqVY=0; this._wob=0; this._lean=0; }
    const stiff=210, damp=12;
    {
      // All heroes share stable, bounded visual spring integration on slow frames.
      const span=Math.max(0,Math.min(dt,.1)),steps=Math.max(1,Math.ceil(span*120)),step=span/steps;
      for(let i=0;i<steps;i++){
        this._sqVX += (-(this._sqX-1)*stiff-this._sqVX*damp)*step;
        this._sqVY += (-(this._sqY-1)*stiff-this._sqVY*damp)*step;
        this._sqX += this._sqVX*step;this._sqY += this._sqVY*step;
      }
    }
    this._sqX=Phaser.Math.Clamp(this._sqX,0.55,1.6); this._sqY=Phaser.Math.Clamp(this._sqY,0.55,1.6);
    const sp=p.body.velocity.length(), moving=sp>24;
    // หันหน้าซ้าย-ขวาตามทิศทางการวิ่ง
    if(Math.abs(p.body.velocity.x)>15) p.setFlipX(p.body.velocity.x < 0);
    this._wob += dt*(moving?14:3.4);
    const breathe=Math.sin(this._wob)*(moving?0.025:0.012);
    const waddle=moving?Math.sin(this._wob*0.5)*0.025:0;
    const leanT=moving?Phaser.Math.Clamp(p.body.velocity.x/1100,-0.16,0.16):0;
    this._lean += (leanT-this._lean)*(this.character==='cocoa'?1-Math.exp(-dt*7):Math.min(1,dt*7));
    this._castRecoilT=Math.max(0,(this._castRecoilT||0)-dt);
    const recoil=Math.sin(Math.PI*this._castRecoilT/0.18)*0.035;
    p.rotation = waddle + this._lean*0.45 - recoil*(p.flipX?-1:1);
    // ชดเชยชีตตัวละครที่ "idle art smaller than run art" (เช่น Mint Frostleaf) → กันตัวหด/บีบตอนหยุดเดิน
    const runKey='char_'+this.character+'_run';
    const texture=this.player.texture.key;
    // Padding compensation must switch with the texture, never ease between sheets.
    if(this._skinTagFor!==this.character){ this._skinTagFor=this.character; this._skinTag=(typeof Cos!=='undefined'&&Cos.skin?.(this.character)?.tag)||''; }
    const actMul=(this._skinTag&&typeof BP_POSE_SCALE_SKIN!=='undefined'&&BP_POSE_SCALE_SKIN[texture+'__'+this._skinTag])||(typeof BP_POSE_SCALE!=='undefined'&&BP_POSE_SCALE[texture])||(this.character==='cocoa'&&texture==='char_cocoa_attack'?1.14:
      this.character==='mint'&&texture==='char_mint_attack'?1.23:
      this.character==='mint'&&texture==='char_mint_gale'?1.26:
      ((texture!==runKey&&CHAR_ACTION_SCALE[this.character])||1));
    const base=(this._pBase||1)*actMul;
    { const idleK='char_'+this.character; if(texture!==this._lastPoseTex){ const a=this._lastPoseTex; this._lastPoseTex=texture; const calm=k=>k===idleK||k===runKey||k===idleK+'_idle'; if(a&&!(calm(a)&&calm(texture))){ this._sqX=1.08; this._sqY=.92; } } }   /* v8.2.9 สลับท่า = บีบสั้น ๆ กลบรอยต่อ */
    const sqX=Phaser.Math.Clamp(this._sqX,0.85,1.15);   /* v8.2.9 เดิม ±6% → ยืด/บีบตอน Dash/โดนตี/ชาร์จเห็นได้ */
    const sqY=Phaser.Math.Clamp(this._sqY,0.85,1.15);
    p.setScale(base*sqX*(1-breathe), base*sqY*(1+breathe));
    if(this._bodyMul!==actMul&&p.body?.setCircle){ this._bodyMul=actMul; const fw=p.frame?.realWidth||p.frame?.width||128,r=24/actMul; p.body.setCircle(r,Math.max(0,fw/2-r),Math.max(0,fw/2-r)); }   /* v8.2.7 ท่าที่ขยายภาพ (BP_POSE_SCALE) ไม่ทำให้ฮิตบ็อกซ์โตตาม */
    const motion=this.hubMotionAllowed?.()!==false;if(!motion)p.setScale(base,base);this.tickActorWeight?.(dt);
    // ปล่อยฝุ่นละอองน้ำตาลใต้เท้าขณะวิ่ง
    if(moving&&motion){
      this._dustT = (this._dustT || 0) - dt;
      if(this._dustT <= 0){ this._dustT = 0.16; this.spawnDust(p.x,p.y+32); }
    }
    // ปล่อยเงาตามตัว (Ghost Trail) + เส้นความเร็ว ตอนพุ่ง Dash
    if(this.dashTime > 0&&motion){
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
  die(){this.clearChapterCombatWave?.(true);this.clearBossStory?.();this.clearSesRune?.(); this.clearTaroCombat?.();this._heroScreen?.kill();if(this._uniqueNotice?.active)this._uniqueNotice.destroy(); if(this.state==='dead')return; Sfx.bpLoopStop?.();Sfx.eventLoopStop?.();Sfx.stopSlotSpin?.(); this.cancelBeat();
    // v5.30 🗿 Ancient Guard: ตายครั้งแรกของด่าน = รอด 1 HP + อมตะ 3 วิ
    if(Save.ancientHas('ancientGuard')&&!this._agUsed&&!this._inTutorial){ this._agUsed=true; this.player.hp=1; if(this.player.body)this.player.body.enable=true; this.player.iframe=3; this.screenFlash(0xc7a6ff,0.45,380); this.showBanner('🗿 Ancient Guard!','The temple shields you · 3s invulnerable',1600); return; }
    this.clearSugarCoins();
    const _closeStory=()=>{ if(this.storyLayer){this.storyLayer.setVisible(false);this.storyLayer.removeAll(true);} this._finishStoryCutscene=null; };
    // 🔮 Relic Last Breath: ครั้งแรกที่ตายในด่าน = รอด (Second Wind = 40% HP + โล่)
    if(this._rel&&this._rel.lastbreath&&!this._lastBreathUsed){ this._lastBreathUsed=true; const sw=this.relicSyn('shell','lastbreath');
      this.player.hp=sw?Math.round(this.player.maxhp*0.40):1; if(sw)this._shield=Math.min(2,(this._shield||0)+1);
      if(this.player.body)this.player.body.enable=true; this.player.iframe=2; this.screenFlash(0xffe08a,0.45,380);
      this.showBanner('🕯️ Last Breath!',sw?'Second Wind — back up with 40% HP and a shield':'Clinging on at 1 HP · 2s invulnerable',1800); return; }
    // Rank Perk 🕯️ เทียนคืนชีพ: ล้มแล้วฟื้น 1 times/Stage ที่ HP 45%
    if((this._reviveLeft||0)>0){ this.voiceBark?.('revive');this.rubyVoiceReact?.('revive',1600);this._reviveLeft--; this.player.hp=Math.round(this.player.maxhp*0.45);
      if(this.player.body)this.player.body.enable=true; this.clearFoes(); this.screenFlash(0xffe08a,0.5,420); if(Sfx.clear)Sfx.clear();
      this.player.iframe=2.2; this.player.wardGuardT=1.6; if(this.popHeal)this.popHeal(this.player.x,this.player.y,Math.round(this.player.hp));
      if(this.showBanner)this.showBanner('🕯️ Revive Candle!','Revived to fight on · remaining '+this._reviveLeft+' times',1800); return; }
    Stats.end(this,'dead'); _closeStory();  this.state='dead'; if(this.lowHpVig){this._lowHpOn=false;this.lowHpVig.setAlpha(0).setVisible(false);} Sfx.bgmIntense(false);Sfx.dead();
    this._openedBoxes=this.openRunBoxes();   // เปิดกล่องที่สะสมมา (ไม่ให้หายตอนตาย)
    this._deathSugar=this.sugarStage||0;this._deathPowerBefore=Save.power(this.character);Save.addSugar(this._deathSugar);const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),exp=Math.round((this.kills+this.stageIndex*15)*pg.reward);this.gainCharExp(exp);this._deathExp=exp;this._deathPowerAfter=Save.power(this.character);this.sugarStage=0;this.physics.pause();this.player.setVelocity(0,0);
    if(this._hasFrames){const baseCharKey='char_'+this.character;if(this.textures.exists(baseCharKey)&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);this.player.setFrame(CF.ko);this.player.setScale(this._pBase||1);this.player.setRotation(0);}
    this.buildOver(); }
  buildOver(){const w=this.W,h=this.H;this.over.removeAll(true);this._overBtns=[];this.endLock(1100);
    // v6.44: หน้าตายใช้แผงเดียวกับหน้าสรุป Endgame/ด่าน + ปุ่มเด่น
    const bg=this.resultBackdrop('result_defeat');
    const canRevive=!this._adRevived,extra=(canRevive?58:0)+56+50;
    const pw=Math.min(w-20,(h-20-extra)*2/3),ph=pw*1.5,px=(w-pw)/2,py=Math.max(8,(h-ph-extra)/2);
    const panel=this.textures.exists('stage_summary_panel')?this.add.image(w/2,py+ph/2,'stage_summary_panel').setDisplaySize(pw,ph).setTint(0xffd6e2):this.add.rectangle(w/2,py+ph/2,pw,ph,0x241c2d);
    const font=Math.max(8,Math.min(13,pw*.035));
    const t=this.add.text(w/2,py+ph*.194,'🫠 Your mochi melted!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(19,pw*.049)+'px',color:'#ffd0dc',align:'center',wordWrap:{width:pw*.62}}).setOrigin(.5);
    const mm=Math.floor(this.elapsed/60),ss=Math.floor(this.elapsed%60),st=STAGES[this.stageIndex]||STAGES[0],diff=DIFFS[(this.stageDiff||1)-1]||DIFFS[0];
    // v6.51.2: สรุปกระชับ — ด่าน/ความยากใต้หัว · 3 ตัวเลขหลักตัวใหญ่ · สาเหตุตาย 1 บรรทัด
    const box=[bg,panel,t],stName=this.recipeMode&&this._recipe&&this._recipe.node?'Delve depth '+(this._recipe.node.d||'?'):st.name,TS='#2a0f1e';
    box.push(this.add.text(w/2,py+ph*.262,stName+' · '+diff.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(15,pw*.04)+'px',color:'#f3dceb',align:'center',wordWrap:{width:pw*.72}}).setOrigin(.5));
    const big=Math.min(26,pw*.07),lab=Math.min(12,pw*.032),cols=[['⏱ TIME',mm+':'+ss.toString().padStart(2,'0'),'#ffffff'],['☠ KILLS',String(this.kills),'#ffffff'],['LV',String(this.level),'#ffffff']];
    cols.forEach((c,i)=>{const x=px+pw*(.27+i*.23),y0=py+ph*.335;box.push(this.add.text(x,y0,c[0],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:lab+'px',color:'#c9a9cf'}).setOrigin(.5),this.add.text(x,y0+big*.95,c[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:big+'px',color:c[2],stroke:TS,strokeThickness:4}).setOrigin(.5));});
    const rr=[['🍬 Sugar','+'+(this._deathSugar||0),'#ffe18b'],['⚡ Power',(this._deathPowerBefore||0)+' → '+(this._deathPowerAfter||0),'#8dffb0'],['⭐ Hero EXP','+'+(this._deathExp||0),'#b9e3ff']];
    rr.forEach((r,i)=>{const y=py+ph*(.475+i*.072),f=Math.min(20,pw*.052);box.push(this.add.text(px+pw*.15,y,r[0],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:f*.85+'px',color:'#e8d6ee'}).setOrigin(0,.5),this.add.text(px+pw*.85,y,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:f+'px',color:r[2],stroke:TS,strokeThickness:4}).setOrigin(1,.5));});
    const why=this.deathReason(),ps=this.powerStatus(this.stageIndex),adv=this.powerAdvice(this.stageIndex);
    box.push(this.add.text(w/2,py+ph*.715,'💀 '+why[0],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(15,pw*.04)+'px',color:'#ff9fb8',align:'center',wordWrap:{width:pw*.7}}).setOrigin(.5));
    box.push(this.add.text(w/2,py+ph*.775,ps.label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(14,pw*.037)+'px',color:'#ffe6a3'}).setOrigin(.5));
    let y=py+ph+8;
    if(canRevive){const z=this._endBtn(box,w/2,y+25,Math.min(w-28,pw*.92),50,0x2fae6a,'📺 REVIVE (Watch Ad) · HP 50%',{primary:true,pulse:true});this._overBtns.push({...z,fn:()=>this.showRewardedAd('Revive back into the field · HP 50%',()=>this.adRevive())});y+=58;}
    const zl=this._endBtn(box,w/2,py+ph*.88,pw*.66,Math.max(40,ph*.082),COLORS.pink,'↻ Replay',{primary:!canRevive,font:Math.min(16,pw*.045)}),bh=46,zr=this._endBtn(box,w/2,y+bh/2,Math.min(w-28,pw*.92),bh,COLORS.grape,this.recipeMode?'⛏ Back to Delve':'🏠 Back to Hub');
    this._overBtns.push({...zl,fn:()=>{window.__pendingRun=this.stageIndex;this.scene.restart();}});
    this._overBtns.push({...zr,fn:()=>{if(this.recipeMode){window.__pendingMenu='atlas';}this.scene.restart();}});
    y+=bh+10;
    { const z=this._endBtn(box,w/2,y+20,Math.min(w-28,pw*.92),40,0x4a3466,adv.text,{font:11});this._overBtns.push({...z,fn:()=>{window.__pendingMenu=adv.screen;this.scene.restart();}});}
    this.over.add(box);this.over.setVisible(true); }
  // ---- Rewarded Ad: แสดงโฆษณาแล้วให้รางวัล (ตอนนี้เดโมจำลอง · ต่อ AdMob จริงได้ที่ hasRealAds/plugin) ----
  showRewardedAd(label,onReward){
    if(this._adBusy)return;
    if(AdManager.hasRealAds()){ this._adBusy=true;
      const ctx=Sfx.ctx,gs=window.__g&&window.__g.sound,wasMute=!!(gs&&gs.mute); try{ if(ctx&&ctx.state==='running')ctx.suspend(); if(gs)gs.mute=true; }catch(e){}   /* v8.1.142 owner 🐞: game music kept playing under the ad */
      const back=()=>{ this._adBusy=false; try{ if(ctx&&!Sfx.muted)ctx.resume(); if(gs)gs.mute=wasMute; }catch(e){} };
      AdManager.show().then(r=>{ back(); try{ Tele.ev('ad',{where:label||'',r,test:ADS_TEST,err:r==='failed'?AdManager.lastError||'':undefined}); }catch(e){}
        if(r==='rewarded'){ onReward&&onReward(); return; }
        if(r==='skipped'){ this.showBanner?.('📺 Ad closed early','Watch to the end to get the reward',1600); return; }
        this.showBanner?.('📺 No ad right now','Check your connection and try again in a moment',1800); }).catch(()=>back());
      return; }
    this._playSimAd(label,onReward);
  }
  _playSimAd(label,onReward){
    if(this._adBusy)return; this._adBusy=true; const w=this.W,h=this.H;
    const c=this.add.container(0,0).setScrollFactor(1).setDepth(99999); this.camUI(c);
    const bg=this.add.rectangle(0,0,w,h,0x05030a,0.93).setOrigin(0).setScrollFactor(1);
    const tag=this.add.text(w/2,h*0.33,'📺 Ad',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'30px',color:'#ffe08a'}).setOrigin(0.5).setScrollFactor(1);
    const sub=this.add.text(w/2,h*0.41,label||'Watch an ad for a reward',{fontFamily:'sans-serif',fontSize:'14px',color:'#e6dcf0',align:'center',wordWrap:{width:w-70}}).setOrigin(0.5).setScrollFactor(1);
    const cd=this.add.text(w/2,h*0.53,'3',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'64px',color:'#ffffff'}).setOrigin(0.5).setScrollFactor(1);
    const note=this.add.text(w/2,h*0.64,'(demo — replaced by real ads on the Play Store)',{fontFamily:'sans-serif',fontSize:'10px',color:'#8f849f'}).setOrigin(0.5).setScrollFactor(1);
    c.add([bg,tag,sub,cd,note]);
    let n=3; const tick=()=>{ n--; if(n>0){ cd.setText(String(n)); this.time.delayedCall(700,tick); }
      else { cd.setText('🎁'); Sfx.clear&&Sfx.clear(); this.time.delayedCall(520,()=>{ c.destroy(true); this._adBusy=false; onReward&&onReward(); }); } };
    this.time.delayedCall(700,tick);
  }
  // ฟื้นคืนชีพจากโฆษณา (ครั้งเดียวต่อWaitบ)
  adRevive(){
    this._adRevived=true; if(this.over)this.over.setVisible(false); this.state='play'; this.physics.resume();
    this.player.hp=Math.round(this.player.maxhp*0.5); if(this.player.body)this.player.body.enable=true;
    this.player.iframe=2.6; this.player.wardGuardT=1.8; this.clearFoes();
    if(this._hasFrames){ const bk='char_'+this.character; if(this.textures.exists(bk))this.player.setTexture(bk); this.player.setFrame(CF.idle); this.player.setScale(this._pBase||1); }
    this.screenFlash(0xffe08a,0.5,420); Sfx.clear&&Sfx.clear();
    if(this.showBanner)this.showBanner('✨ Revived!','Ad watched — back to the fight · HP 50%',1800);
  }

  _offscreenHuntTarget(){const wv=this.cameras?.main?.worldView,p=this.player;if(!wv||!wv.width||!p||!this.enemies)return null;let mini=null,md=Infinity,any=null,ad=Infinity,seen=false;
    this.enemies.children.iterate(e=>{if(seen||!e||!e.active||e.isDummy||!(e.hp>0))return;if(wv.contains(e.x,e.y)){seen=true;return;}const d=Math.hypot(e.x-p.x,e.y-p.y);if(e.isMini&&d<md){md=d;mini=e;}if(d<ad){ad=d;any=e;}});return seen?null:(mini||any);}
  _nearestEnemy(){ let best=null,bd=Infinity; this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=this.dist(e.x,e.y,this.player.x,this.player.y); if(d<bd){bd=d;best=e;} }); return best; }
  _nearestWaveObjective(){
    const o=this.waveObjective;if(!o)return null;if(o.type==='capture'&&this._crack){const T=this._crack.st==='final'?this._crack.holes[this._crack.holes.length-1]:this._crack.tip;return this.dist(this.player.x,this.player.y,T.x,T.y)<=HC_TOUCH?null:T;}if(o.type==='capture'&&this._captureZone)return this.dist(this.player.x,this.player.y,this._captureZone.x,this._captureZone.y)<=this._captureZone.radiusGoal?null:this._captureZone;
    if(o.type==='cleanAir'&&this._cleanAir?.v2){ const c=this._cleanAir,P=this.player; if(c.phase==='lure')return this.dist(P.x,P.y,c.x,c.y)<70?null:c; let b=null,bd=Infinity; for(const w of c.wisps||[]){ if(w.freed)continue; const d=this.dist(P.x,P.y,w.x,w.y); if(d<bd){bd=d;b=w;} } return b&&bd>85?b:null; }
    if(o.type==='cleanAir'&&this._cleanAir)return this.dist(this.player.x,this.player.y,this._cleanAir.x,this._cleanAir.y)<=this._cleanAir.r?null:this._cleanAir;
    let best=null,bd=Infinity;
    if(o.type==='breakRoots'&&this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n||!n.active||!n._rootAnchor)return;const d=this.dist(n.x,n.y,this.player.x,this.player.y);if(d<bd){bd=d;best=n;}});

    if(o.type==='defendNectar'&&this._nectarFlowers){for(const f of this._nectarFlowers){if(!f.alive)continue;const d=this.dist(f.x,f.y,this.player.x,this.player.y)+(f.hp/f.maxhp)*100;if(d<bd){bd=d;best=f;}}}
    if(o.type==='purge'){if(this._wisp&&this._wisp.active)return this.dist(this.player.x,this.player.y,this._wisp.x,this._wisp.y)<=this._wispTuning().escortR?null:this._wisp;if(this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n||!n.active||!n._waveObjectiveNode||n._purified)return;const d=this.dist(n.x,n.y,this.player.x,this.player.y);if(d<bd){bd=d;best=n;}});}
    if(o.type==='hunt'&&this.enemies)this.enemies.children.iterate(e=>{if(!e||!e.active||!e._waveObjectiveTarget)return;const d=this.dist(e.x,e.y,this.player.x,this.player.y);if(d<bd){bd=d;best=e;}});return best;
  }
  updateObjectiveArrow(){
    let target=(this.boss&&this.boss.active)?this.boss:(this.portalTarget&&this.portalTarget.active?this.portalTarget:null);
    if(!target&&this.mode==='wave'&&this._feastOn&&this._feastOn.active)target=this._feastOn;
    if(!target&&this.mode==='wave')target=this._nearestWaveObjective();
    if(!target&&this.mode==='wave'&&this._waveEvent){const ev=this._waveEvent;if(ev.type==='courier'&&ev.courier&&ev.courier.active)target=ev.courier;
      else if(ev.type==='cache'){let nearest=Infinity;for(const c of ev.crates||[]){if(!c.active)continue;const d=this.dist(this.player.x,this.player.y,c.x,c.y);if(d<nearest){nearest=d;target=c;}}}}
    if(!target && this.mode==='waveclear') target=this._nearestEnemy();   // ชี้ไปหาศัตรูที่เหลือตอนต้องเคลียร์
    let hunt=false;if(!target){target=this._offscreenHuntTarget();hunt=!!target;}   // v7.8.31 เจ้าของ: ไม่มีศัตรูในจอ = ชี้หามินิ/ศัตรูใกล้สุด
    if(!target){if(this.objectiveArrow)this.objectiveArrow.setVisible(false);this._objArrowImg?.setVisible(false);if(this.objectiveDist)this.objectiveDist.setVisible(false);const wv0=this.cameras?.main?.worldView,p0=this.player;if(wv0&&wv0.width&&p0)this.updateSideArrow((p0.x-wv0.x)/wv0.width*this.W,(p0.y-wv0.y)/wv0.height*this.H-10);else this.sideArrow?.setVisible(false);return;}
    // ลูกศรหมุนWaitบ "screen center" → ต้องวัดมุมจากจุดกึ่งกลางกล้อง (โลก) ไม่ใช่Positionผู้เล่น (กล้อง lerp/deadzone ทำให้ผู้เล่นไม่อยู่กลางจอเป๊ะ = ลูกศรเพี้ยน)
    // v6.86 ลูกศรโคจรรอบตัวผู้เล่น (เจ้าของขอ ให้สังเกตง่าย) · ซ่อนเมื่อเป้าอยู่ใกล้ในจอ
    const cam=this.cameras.main,wv=cam.worldView,p=this.player; if(!wv||!wv.width)return;
    const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
    const px=(p.x-wv.x)/wv.width*this.W,py=(p.y-wv.y)/wv.height*this.H-10,R=62,bob=Math.sin((this.elapsed||0)*6)*4;
    const near=d<140;
    this.objectiveArrow.setPosition(px+Math.cos(a)*(R+bob),py+Math.sin(a)*(R+bob)).setRotation(a).setVisible(!near).setScale(.8).setColor(hunt?(target.isMini?'#ff9b6b':'#ffd0d0'):this.mode==='portal'?'#c99cff':'#ffef7a');
    this.objectiveDist.setVisible(false);   // บอกเฉพาะทิศ ไม่เปิดเผยระยะตามดีไซน์
    this.arrowArt?.(this.objectiveArrow,'_objArrowImg',0,26,hunt?(target.isMini?0xff9b6b:0xffd0d0):this.mode==='portal'?0xc99cff:null);
    this.updateSideArrow(px,py);
  }
  /* v8.2.27 เจ้าของ (SCAMPER): ลูกศรสีฟ้าชี้เป้าของภารกิจเสริม · วงนอกกว่าลูกศรหลัก · หาเป้าทุก 0.25 วิ ด้วย questFocusTargets ในบริบทภารกิจเสริม */
  /* v8.2.31 ใบ 90 ลูกศรภาพ: ซ้อนบนลูกศรตัวอักษรเดิม (ตามตำแหน่ง/มุม/การมองเห็น) · ไม่มีภาพ = ตัวอักษร ➤ เดิม */
  arrowArt(txt,slot,frame,px,tint){ if(!txt)return; const ok=this.realTex?.('ev90_arrows'); let im=this[slot]; if(!ok){ if(im)im.setVisible(false); txt.setAlpha?.(1); return; }
    if(!im||!im.scene){ im=this[slot]=this.add.image(txt.x,txt.y,'ev90_arrows',frame).setScrollFactor(1).setDepth(70); this.camUI?.(im); }
    const on=!!txt.visible; txt.setAlpha?.(0); im.setPosition(txt.x,txt.y).setRotation(txt.rotation||0).setDisplaySize(px,px).setVisible(on); if(tint)im.setTint(tint); else im.clearTint(); }
  stackArrowTarget(){ const K=this._stack,p=this.player; if(!K||K.o.done||!p)return null; const now=this.elapsed||0; if(K._arT!=null&&now-K._arT<.25)return K._ar; K._arT=now;
    let tg=[]; try{ tg=this.stackRun(()=>this.questFocusTargets(K.type))||[]; }catch(e){ tg=[]; } let best=null,bd=Infinity; for(const t of tg){ const d=Math.hypot(t.x-p.x,t.y-p.y)-(t.r||0)*.5; if(d<bd){ bd=d; best=t; } } K._ar=best; return best; }
  updateSideArrow(px,py){ const A=this.sideArrow; if(!A)return; const t=(this.mode==='wave'||this._stack?.boss)?this.stackArrowTarget():null,p=this.player; if(!t||!p||px==null){ A.setVisible(false); this._sideArrowImg?.setVisible(false); return; }
    const dx=t.x-p.x,dy=t.y-p.y,d=Math.hypot(dx,dy); if(d<Math.max(120,(t.r||0)*.8)){ A.setVisible(false); this._sideArrowImg?.setVisible(false); return; } const a=Math.atan2(dy,dx),R=88+Math.sin((this.elapsed||0)*6+1.6)*4;
    A.setPosition(px+Math.cos(a)*R,py+Math.sin(a)*R).setRotation(a).setScale(.75).setVisible(true); this.arrowArt?.(A,'_sideArrowImg',1,20,null); }
  /* ---------- UPDATE ---------- */
  // ระบบตื่นเต้นตอนใกล้ตาย: ขอบจอแดงเต้นเป็นจังหวะ + เสียงหัวใจ (ยิ่งเลือดน้อย ยิ่งถี่/แดงเข้ม)
  tickNearDeath(dt){
    const v=this.lowHpVig; if(!v)return;
    const hpf=this.player.hp/this.player.maxhp, TH=0.30;
    if(this.player.hp>0 && hpf<TH){
      const sev=Phaser.Math.Clamp((TH-hpf)/TH,0,1);   // 0 ที่ 30% → 1 ที่ใกล้ 0
      if(!this._lowHpOn){ this._lowHpOn=true; v.setVisible(true); this._hbAcc=0; }
      const pulse=0.5+0.5*Math.sin(this.elapsed*(6+sev*7));   // เต้นเร็วขึ้นเมื่อวิกฤต
      v.setAlpha((0.18+sev*0.34)*(0.55+0.45*pulse));
      this._hbAcc-=dt;
      if(this._hbAcc<=0){ this._hbAcc=Math.max(0.34,0.92-sev*0.55); Sfx.heartbeat(sev); this.screenShake(70,0.001+sev*0.0016); }
    } else if(this._lowHpOn){
      this._lowHpOn=false; v.setAlpha(0).setVisible(false);
    }
  }
  update(time,delta){
    if(time>(this._genTexAt||0)){ this._genTexAt=time+1000; this.codeGenericTex?.(); }   /* v8.1.156 */
    if(this._shockG?.active&&(!this._taro?.enabled||this.state!=='play'))this._shockG.clear();   /* v8.1.157 */
    let dt=delta/1000; if(this.state!==this._stSeen){ if(this.state!=='play')this.voiceStop?.(this.player);this._stSeen=this.state; this._stAt=Date.now(); }   // v7.9.45 เวลาเริ่มของแต่ละ state (ล็อกหน้าจบด่านนับจากตอนเปิด)
    this.tickBossInk?.(delta/1000);this.tickBossShotLoops?.(delta/1000);this.tickMenuMotion(dt); this.tickLobbyVoice(dt); if(this.state!=='play'){this.suspendTaroCombat?.();if(this.state==='menu'&&this._cosObjs?.length){this._cosObjs.forEach(o=>o?.destroy?.());this._cosObjs=[];this._cosW=this._cosP=this._cosTrail=null;}return;} this.tickCos?.(dt); this.tickBossSay(); this.tickKeyboard(); this.tickPerf(delta/1000); this.tickDecor(delta/1000); dt*=(this.gameSpeed||1); this.elapsed+=dt;this.tickBattleOutlineFx?.(dt);this.tickTaroCombat?.(delta/1000); if(this._rushOn)this.tickSugarRush(); if(this.recipeMode)this.tickDelveMods(dt);   // gameSpeed = ปุ่มเร่งเวลา
    this.tickWindRush(dt);this.moveSlowT=Math.max(0,(this.moveSlowT||0)-dt);this.pathHasteT=Math.max(0,(this.pathHasteT||0)-dt);this.player.wardGuardT=Math.max(0,(this.player.wardGuardT||0)-dt);this._lifeOnKillCd=Math.max(0,(this._lifeOnKillCd||0)-dt);
    this._echoTrailAcc=(this._echoTrailAcc||0)+dt;if(this._echoTrailAcc>=0.08){this._echoTrailAcc=0;if(!this._echoTrail)this._echoTrail=[];this._echoTrail.push({x:this.player.x,y:this.player.y});if(this._echoTrail.length>80)this._echoTrail.shift();}

    if(this.joy.active&&(this.joy.dx||this.joy.dy)){ this.moveDir.set(this.joy.dx,this.joy.dy); if(this.moveDir.lengthSq()>0.04)this.moveDir.normalize(); }

    if(this.dashTime>0){ this.dashTime-=dt; if(this.dashTime<=0){ this._sqX=0.8; this._sqY=1.22; this._sqVX=0; this._sqVY=0; if(this.actorDashLand)this.actorDashLand();else this.poseFlash(CF.squash,150); } }
    else {
      const spd=this.player.baseSpeed*(this.isSesRune?.()?this.sesRuneStats().speed*(this._sesRune?.mistT>0?1.2:1):1)*(1+((this.elapsed||0)<(this._forgeState&&this._forgeState.pickupUntil||0)?Math.min(.3,forgeValue(this.player,45)/100):0))*(this.moveSlowT>0?0.52:1)*(this.pathHasteT>0?1.18:1)*(this.uqReady?.()?1.15:1)*(this.windRushT>0?(this.windRushMul||1.5):1)*(this._frHasteT>0?1.35:1);
      if(this.joy.active&&(Math.abs(this.joy.dx)+Math.abs(this.joy.dy))>0.12) this.player.setVelocity(this.joy.dx*spd,this.joy.dy*spd);
      else { this.player.setVelocity(this.player.body.velocity.x*0.8,this.player.body.velocity.y*0.8); if(this.player.body.velocity.length()<8)this.player.setVelocity(0,0); }
    }
    if(this.drainPull)this.drainPull=null;   // v6.55.2 เจ้าของ: เอาสกิลดูดของบอสออก
    if(this.drainPull&&this.drainPull.t>0){this.drainPull.t-=dt;const a=Math.atan2(this.drainPull.y-this.player.y,this.drainPull.x-this.player.x),v=this.player.body.velocity,s=this.drainPull.strength||120;this.player.setVelocity(v.x+Math.cos(a)*s,v.y+Math.sin(a)*s);if(this.drainPull.t<=0)this.drainPull=null;}
    // ยิ่งยืนนิ่งนาน มอนยิ่งไหลมาเยอะ (กันแคมป์ + เพิ่มความกดดัน)
    { const movingNow=this.player.body&&this.player.body.velocity.length()>40; this._idleT=movingNow?0:Math.min(14,(this._idleT||0)+dt); this._idleP=Math.min(0.7,Math.max(0,(this._idleT-1.5))*0.075); }

    if(this.player.iframe>0)this.player.iframe-=dt;
    if(!Number.isFinite(this.player.maxhp)||this.player.maxhp<=0)this.player.maxhp=90;
    if(!Number.isFinite(this.player.hp))this.player.hp=this.player.maxhp;if(!this._voiceLowHp&&this.player.hp>0&&this.player.hp/this.player.maxhp<.25){if(this.voiceBark?.('lowhp'))this._voiceLowHp=true;if(!this._rubyLowHp){this._rubyLowHp=true;this.rubyVoiceReact?.('lowhp',4000);}}   // safety net: กัน HP ค้าง NaN
    const regenPerSec=(this.recipeHas('noheal')||this.player._uqNoRegen?0:1)*this.pactHealMul()*Math.min(this.player.maxhp*0.03,(this.player.regen||0)+(this.player.regenFlat||0)+this.player.maxhp*((this.player.regenPct||0)+(this.isSesRune?.()?this.sesRuneStats().regen:0)));
    if(regenPerSec>0){if(this.player.forgeMods&&forgeValue(this.player,24))forgeHeal(this,regenPerSec*dt);else if(this.player.hp<this.player.maxhp)this.player.hp=Math.min(this.player.maxhp,this.player.hp+regenPerSec*dt);}
    if(this._cocoaRegenT>0){ this._cocoaRegenT-=dt; if(!this.recipeHas('noheal')&&this.player.hp<this.player.maxhp)this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*(this._cocoaRegenPct||0)*this.pactHealMul()*dt); }   // v7.6.7 Cocoa Unique regen (นอกเพดาน 3%)
    this.tickStatusArt?.();this.tickTitanRage(dt);this.tickImpaleMarks?.();
    this.tickNearDeath(dt);
    if(this.aura)this.aura.setPosition(this.player.x,this.player.y);
    this.tickCocoaFlicker(dt);this.updatePose(dt);this.animatePlayer(dt);if(this._impalerCharge)this.tickImpalerCharge();if(this._berryCharge)this.tickBerryCharge();
    if(this.iso){ this.player.setDepth(this.player.y); this.drawShadows(); }
    if(this._cosW?.active)this._cosW.setDepth((this.player.depth||5)-2);   // v8.1.48 ปีกต้องอยู่หลังตัวเสมอ (ตั้งหลัง depth ของผู้เล่นในเฟรมนี้)
    // Copy the current depth after Y sorting; stale depth can cover the hero when walking upward.
    this.tickPlayerReadability?.();
    if(!this.dashReady){ this.dashCd-=dt; if(this.dashCd<=0)this.dashReady=true; }
    this.tickCocoaCombat(dt);this.tickCocoaDash(dt);
    if(this.dashBtn) this.dashBtn.setFillStyle(COLORS.mint,this.dashReady?0.28:0.10);
    this.drawDashRing();
    if(this.player.forgeMods)forgeTick(this,dt);this.updatePickupReadability(); this.tickLootMagnet(dt); this.tickProximityObjects(dt); this.animateProgressBar(dt);
    if(this.isSesRune?.())this.sesRuneCooldownTick(dt);else if(this.uniqueCd>0)this.uniqueCd=Math.max(0,this.uniqueCd-dt);this.tickLanceCharges?.(dt);if(this.uniqueBtn){const u=this.uniqueInfo();this.uniqueBtn.setFillStyle(u.color,this.uniqueCd>0?0.10:0.28);}this.drawUniqueRing();
    this.tickAura(dt); this.tickDropShadows?.();
    if(this._mintDashTween?.isPaused())this._mintDashTween.resume();if(this._mintDashFinish)this.finishFrostLance(this._mintDashFinish);this.tickGlacierSnow(dt);
    this.tickSnipe(); this.tickIceTrails(dt); this.tickCrossroads(dt); this.tickCharSignature(dt); this.tickCocoaCombo(dt); this.tickYuzuCrew(dt); this.tickFR(dt); this.drawShellBubble(); this.tickInfusion(dt); this.modTick(dt); this.tickPathTalents(dt);
    if(this._coach)this.tickTutorialCoach(dt);
    this.tickStage(dt);
    this.tickBossZoom();
    this.tickBossObjects(dt);
    this.tickArenaMech(dt);
    this.runArenaTicks(dt);

    // enemies
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(this.iso)e.setDepth(e.y);
      if(e.bloomUntil>0){e.bloomUntil-=dt;if(e.bloomUntil<=0)e.bloomStacks=0;}if(e._aura&&e._aura.active)e._aura.setPosition(e.x,e.y).setDepth(e.y-1);
      this.tickFrostBurn(e,dt);if(!e.active)return;this.tickEnemyPresentation(e,dt);
      if(e.frozen>0){ e.frozen-=dt; e.setVelocity(0,0); if(e.frozen<=0){ if(e.tintColor)e.setTint(e.tintColor); else e.clearTint(); } return; }
      if(e._timeStop){ e.setVelocity(0,0); return; }
      if(e._emergeUntil){ if((this.time?.now||0)<e._emergeUntil){ e.setVelocity(0,0); return; } e._emergeUntil=0; }   /* v8.2.44 กำลังเกิด */
      if(e.alpha<.05&&!(e._artOv&&e._artOv.active)&&!e._hideOk&&!e._fleeing){ if(e._artOv)e._artOv=null; e.setAlpha(1); }   /* v8.2.51 กันมอนล่องหน: โปร่งเกือบ 0 แต่ไม่มีภาพซ้อน = คืนความทึบ */
      if(e._bigHold&&e._big&&e.isBoss&&this.boss===e){ e.setVelocity(0,0); return; }   /* v8.1.124 บอสยืนชาร์จท่าใหญ่/พัก */   // v8.1.113 หยุดเวลา (Frozen Pantry) แยกจากแช่แข็ง: ไม่เดิน ไม่ยิง ไม่ทำดาเมจสัมผัส · โดนตีได้ปกติ ไม่นับเป็น frozen (ไม่ไปเพิ่มดาเมจ Mint)
      if(this.holdArenaFogBoss(e))return;
      if(e.knock>0){ e.knock-=dt; return; }
      { // v5.50: มอนที่หลุดไกล → ย้ายมาเกิดใกล้ผู้เล่นใหม่ · มอนไกลคิดทิศทุก 4 เฟรม
        const fx=e.x-this.player.x,fy=e.y-this.player.y,fd2=fx*fx+fy*fy,view=Math.max(this.W,this.H)/(this.viewZoom||1);
        if(fd2>view*view*1.9&&!e.isBoss&&!e.isMini&&!e.isElite&&!e._objectiveMark&&!e._fleeing&&!e._huntFlee&&!e._wispRaider&&!e._goTo){
          const a=Math.random()*TAU,r=view*0.62;e.setPosition(...(typeof inMapPt==='function'?inMapPt:(x,y)=>[x,y])(this.player.x+Math.cos(a)*r,this.player.y+Math.sin(a)*r));e.setVelocity(0,0);return; }
        if(fd2>view*view*0.5&&!e.isBoss&&!e.isMini){ e._aiSlot=e._aiSlot??((Math.random()*4)|0); if((this.game.loop.frame+e._aiSlot)&3)return; }
      }
      if(e._decoyT>0)e._decoyT-=dt;
      let tx=e._decoyT>0?e._decoyX:this.player.x,ty=e._decoyT>0?e._decoyY:this.player.y;if(e._fleeing||e._huntFlee){tx=e.x*2-this.player.x;ty=e.y*2-this.player.y;}if(e._wispRaider&&this._wisp&&this._wisp.active){tx=this._wisp.x;ty=this._wisp.y;}if(e._goTo){tx=e._goTo.x;ty=e._goTo.y;}
      if(this.stageIndex===7&&this.waveObjective&&this.waveObjective.type==='defendNectar'&&['drone','honeyBomb','dartwing'].includes(e.nectarRole)&&this._nectarFlowers){let target=null,bd=Infinity;for(const f of this._nectarFlowers){if(!f.alive)continue;const d=this.dist(e.x,e.y,f.x,f.y);if(d<bd){bd=d;target=f;}}if(target){tx=target.x;ty=target.y;}}
      if(this.character==='yuzu'){const friend=this.yuzuTaunt(e);if(friend){tx=friend.x;ty=friend.y;}}
      const spd=e.spd*(this.character==='yuzu'?this.yuzuSlow(e):1);
      const dx=tx-e.x, dy=ty-e.y, ang=Math.atan2(dy,dx), dd=Math.hypot(dx,dy);
      // หันหน้าเข้าหาผู้เล่นเสมอ
      const sheet=ASSET_SHEETS[e._enemyArtKey||e.texture.key];e.setFlipX(e._bossInk?.pose&&['wind','strike','attack'].includes(e._bossInk.pose.kind)?e._bossInk.pose.flipX:sheet&&sheet.facingLeft?dx>0:dx<0);

      if(e.acid){ e.shootCd-=dt;
        if(dd<430){this.antSpitWindup(e); e.setVelocity(Math.cos(ang)*(dd<210?-spd*0.7:spd*0.18),Math.sin(ang)*(dd<210?-spd*0.7:spd*0.18));
          if(e.shootCd<=0){ e.shootCd=Phaser.Math.FloatBetween(1.45,2.15); this.enemyAction(e,'attack',260,e._enemyArtKey==='e_acid_animated'?null:3);
            this.foeShot(e.x,e.y,ang,205,e.dmg,0x72ff3d,this.stageIndex===0?ANT_SHOT_C11[0]:1.05);Sfx.zap();   /* v8.2.20 เจ้าของ: กระสุนมดเขียว C1-1 ใหญ่ไป */
}
          return;}
      }
      if(e.shooter){ e.shootCd-=dt;
        if(dd<300){this.antSpitWindup(e); e.setVelocity(Math.cos(ang)*spd*0.12,Math.sin(ang)*spd*0.12);
          if(e.shootCd<=0){ e.shootCd=Phaser.Math.FloatBetween(1.3,2.2);if(this.stageIndex===4)this.stage5EnemyPose(e,4,430);else this.enemyAction(e,'attack',430);let fireAng=ang;if(((this.stageIndex===6&&(e.mycoRole==='sniper'||e.mycoRole==='oracle'))||(this.stageIndex===7&&(e.nectarRole==='pollenSniper'||e.nectarRole==='choirMoth'))||(this.stageIndex===8&&(e.seasonRole==='frostbell'||e.seasonRole==='seasonWisp'))||(this.stageIndex===9&&(e.rootRole==='sapOracle'||e.rootRole==='rootChoir')))&&this.player.body){const lead=(e.mycoRole==='sniper'||e.nectarRole==='pollenSniper'||e.seasonRole==='frostbell'||e.rootRole==='sapOracle')?.48:.28,px=this.player.x+this.player.body.velocity.x*lead,py=this.player.y+this.player.body.velocity.y*lead;fireAng=Math.atan2(py-e.y,px-e.x);}const shotColor=this.stageIndex===6?0xb46cff:this.stageIndex===7?0xffc95c:this.stageIndex===8?0x8fdcff:this.stageIndex===9?0xd56bff:0xffd27f;this.foeShot(e.x,e.y,fireAng,225+this.stageIndex*15,e.dmg,shotColor,this.stageIndex===0?ANT_SHOT_C11[1]:undefined);if(e.nectarRole==='choirMoth'){this.foeShot(e.x,e.y,fireAng-.18,245,e.dmg,0xd95cff,.92);this.foeShot(e.x,e.y,fireAng+.18,245,e.dmg,0xd95cff,.92);}if(e.seasonRole==='seasonWisp'){for(const off of [-.27,-.09,.09,.27])this.foeShot(e.x,e.y,fireAng+off,255,e.dmg,off<0?0xff7040:0x8fdcff,.90);}if(e.rootRole==='rootChoir'){for(const off of [-.32,-.16,0,.16,.32])this.foeShot(e.x,e.y,fireAng+off,270,e.dmg,off===0?0xffd166:0xd56bff,.92);} Sfx.zap(); }
          return; } }
      if(e.dasher){   // สายพุ่งโฉบ: เข้าfind → หน่วงเล็ง(ตัวสั่น) → พุ่งเร็วตัดผ่าน → พักแล้ววนใหม่
        e.dashT-=dt;
        if(e.dashState==='chase'){ e.setVelocity(Math.cos(ang)*spd,Math.sin(ang)*spd);
          if(e.dashT<=0 && dd<360){ e.dashState='wind'; e.dashT=0.5; e.setVelocity(0,0);if(this.stageIndex===4)this.stage5EnemyPose(e,4,400);else this.enemyAction(e,'windup',500);   // wind ยาวขึ้นเล็กน้อยให้อ่านทัน
            if(!e._dashTel){ e._dashTel=this.camWorld(this.add.image(e.x,e.y,'vfx_line').setDepth(3).setTint(0xff5a3c).setAlpha(0)); this.tweens.add({targets:e._dashTel,alpha:0.8,duration:160}); } } }
        else if(e.dashState==='wind'){
          e.setVelocity(0,0);
          e.x += (Math.random() - 0.5) * 5;   // ตัวสั่นตอนชาร์จ
          // เส้นเตือนทิศพุ่ง (แบบ Archero) — เล็งไปที่ผู้เล่นตอนชาร์จ ให้หลบทัน
          if(e._dashTel){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x),len=Math.min(dd,320); e._dashTel.setPosition(e.x+Math.cos(a)*len/2,e.y+Math.sin(a)*len/2).setRotation(a).setDisplaySize(len,9); }
          if(e.dashT<=0){ e.dashState='dash'; e.dashT=0.32; e._da=(((this.stageIndex===6&&e.mycoRole==='hopper')||(this.stageIndex===7&&e.nectarRole==='dartwing')||(this.stageIndex===8&&e.seasonRole==='leafblade')||(this.stageIndex===9&&e.rootRole==='brambleAssassin'))&&this.player.body)?Math.atan2(this.player.y+this.player.body.velocity.y*.30-e.y,this.player.x+this.player.body.velocity.x*.30-e.x):ang;if(this.stageIndex===4)this.stage5EnemyPose(e,5,340);else this.enemyAction(e,'dash',320); if(e.tintColor)e.setTint(e.tintColor); else e.clearTint();
            if(e._dashTel){this.tweens.killTweensOf(e._dashTel);e._dashTel.destroy();e._dashTel=null;}
            if(e.body)this.physics.velocityFromRotation(ang,spd*4.6,e.body.velocity); Sfx.dash&&Sfx.dash(); } }
        else if(e.dashState==='dash'){ if(e.body)this.physics.velocityFromRotation(e._da,spd*4.6,e.body.velocity);
          if(e.dashT<=0){ e.dashState='chase'; e.dashT=Phaser.Math.FloatBetween(0.9,1.8); } }
        return; }
      e.setVelocity(Math.cos(ang)*spd,Math.sin(ang)*spd);
    });

    // orb vacuum + ออร์บAlive (หมุนช้า + เต้นวิบวับ)
    if(this._xpTr)for(const s of this._xpTr)if(s._own&&!s._own.active)this.xpTrailOff(s._own);
    if(this._xpTrG?.active)this._xpTrG.clear();   /* v8.1.156 หางเม็ด EXP โค้ด: ล้างทุกเฟรม แล้ว xpTrail วาดใหม่ */
    this.orbs.children.iterate(o=>{ if(!o||!o.active){if(o&&o._sh&&o._sh.visible)o._sh.setVisible(false);return;}
      if(o._xp){o.rotation=0;o.setScale((o._sc||1)*(1+Math.sin(this.elapsed*4+o.x*0.05)*0.05));}   // v7.9.26 หยดไม่หมุน · เต้นเบา ๆ
      else{ o.rotation+=dt*2.2; const bob=1+Math.sin(this.elapsed*5+o.x*0.05)*0.12; o.setScale((o._sc||1)*bob); }
      if(o._hop){ const H=o._hop; if(o._vac){ o._hop=null; } else { H.t+=dt/.3; const k=Math.min(1,H.t),bx=H.x0+(H.x1-H.x0)*k,by=H.y0+(H.y1-H.y0)*k; o.setVelocity(0,0); o.setPosition(bx,by-Math.sin(Math.PI*k)*22); if(o._sh)o._sh.setPosition(bx,by+(o._shDy||0)); if(k>=1)o._hop=null; else return; } }
      const d=this.dist(o.x,o.y,this.player.x,this.player.y);
      if((o._vac||d<this.player.pickup)&&d<24){ this.collectOrb(this.player,o); return; }   // v8.1.105 ถึงตัวแล้วเก็บเลย (เดิมบางเม็ดวนรอบตัวไม่เข้า)
      if(o._vac || d<this.player.pickup){ o._mT=(o._mT||0)+dt; const cur=Math.max(0,.5-o._mT)*(o._mSide||(o._mSide=Math.random()<.5?-1:1))*.9,ang=Math.atan2(this.player.y-o.y,this.player.x-o.x)+cur, sp=Math.min(o._vac?900:760,(o._vac?300:160)+o._mT*1500); o.setVelocity(Math.cos(ang)*sp,Math.sin(ang)*sp);   /* v8.1.49 เร่งเข้าตัวเป็นโค้ง */ if(o._xp)this.xpTrail(o,ang); if(o._sh)o._sh.setPosition(o.x,o.y+o._shDy); }
      else { o._mT=0; o.setVelocity(0,0); if(o._trail)this.xpTrailOff(o); } });

    // bullets life + boomerang return/rebound + spin + pierce cd
    this.bullets.children.iterate(b=>{ if(!b||!b.active)return;
      b.life-=dt; if(b.hitCd>0)b.hitCd-=dt;
      if(b.spin)b.rotation+=dt*14;
      else if(b.faceVel&&b.body&&(b.body.velocity.x||b.body.velocity.y))b.rotation=Math.atan2(b.body.velocity.y,b.body.velocity.x);   // จรวด/ส้อมหันตามทิศพุ่ง
      if(b.homing&&b.body){ const hr=b.homeRange||520,t=b.mintDashShard?this.lanceShardTarget(b.x,b.y,hr):(this.priorityBossTarget(hr,b.x,b.y)||(b.lockedTarget&&b.lockedTarget.active?b.lockedTarget:this.nearestEnemy(hr))); if(t){ const desired=Math.atan2(t.y-b.y,t.x-b.x);
        const cur=Math.atan2(b.body.velocity.y,b.body.velocity.x), turn=b.homing*0.02*dt;
        const d=Phaser.Math.Angle.Wrap(desired-cur), step=Phaser.Math.Clamp(d,-turn,turn);
        this.physics.velocityFromRotation(cur+step,b.homeSpeed||240,b.body.velocity); } }
      if(b.boomer){ b.bt+=dt;
        if(!b.returned && b.bt>=b.bdur){ b.returned=true; const ang=Math.atan2(this.player.y-b.y,this.player.x-b.x); this.physics.velocityFromRotation(ang,480,b.body.velocity); }
        if(b.returned && this.dist(b.x,b.y,this.player.x,this.player.y)<42){
          if(b.rebound && b.reb<1){ b.reb++; b.returned=false; b.bt=0; b.life=1.6;
            const t=this.nearestEnemy(760), ang=t?Math.atan2(t.y-b.y,t.x-b.x):this.moveDir.angle();
            this.physics.velocityFromRotation(ang,440,b.body.velocity); }
          else {if(this.skillCd&&this.skillCd.boomer!=null)this.skillCd.boomer=Math.max(0,this.skillCd.boomer-0.32);this.killBullet(b); return; } } }
      if(b._chargeFx){if(b._chargeFx._mintOutline819)this.mintOutlineFrame(b._chargeFx,dt);b._chargeFx.setPosition(b.x,b.y).setRotation(b.rotation);}
      if(b._shotgunTrail?.active===true)b._shotgunTrail.setPosition(b.x,b.y).setRotation(b.rotation);
      if(b.life<=0)this.killBullet(b); });

    // auto-cast skills tick
    if(!this._holdFire)for(const key in this.skills){ if(SKILLDEFS[key].orbit) continue;
      this.skillCd[key]-=dt;if(key==='meteor'&&this.character==='cocoa'&&this._cocoaFlicker)continue; if(this.skillCd[key]<=0){ this._ccCdMul=0; this._mxSrc=key; if(this._mx)this._mx.casts[key]=(this._mx.casts[key]||0)+1; this.castSkill(key,this.skills[key]); this.skillCd[key]=this.cdOf(key,this.skills[key])*(this.player.cdMul||1)*(key==='meteor'&&this._ccCdMul?this._ccCdMul:1); } }
    if(this.ringBalls.length){ this.ringRot=(this.ringRot||0)+dt*(this.ringSpin||2.6);
      this.ringBalls.forEach(b=>{ if(b.hitCd>0)b.hitCd-=dt; const a=this.ringRot+(b.ang0||0),pulse=1+Math.sin(this.elapsed*7+(b._motionPhase||0))*0.11;
        b.setPosition(this.player.x+Math.cos(a)*(b.rr||54),this.player.y+Math.sin(a)*(b.rr||54)).setScale((b._baseScale||0.24)*pulse).setRotation(a+this.elapsed*1.8); });
      (this.starGuardFields||[]).forEach(f=>{if(!f.active)return;f.setPosition(this.player.x,this.player.y).setRotation((f.rotation||0)+dt*0.32*f._spinDir).setAlpha((f._phase?0.055:0.10)+Math.sin(this.elapsed*3.2+(f._phase||0))*0.018);});
      this._starTrailTick=(this._starTrailTick||0)-dt;if(this._starTrailTick<=0){this._starTrailTick=0.11;this._starTrailIndex=((this._starTrailIndex||0)+1)%this.ringBalls.length;const s=this.ringBalls[this._starTrailIndex],ghost=this.camWorld(this.add.image(s.x,s.y,'ic_star').setDepth(4).setScale((s._baseScale||0.28)*0.72).setRotation(s.rotation).setAlpha(0.22));this.tweens.add({targets:ghost,scale:ghost.scaleX*0.45,alpha:0,duration:180,onComplete:()=>ghost.destroy()});} }
    this._starGuardTick=(this._starGuardTick||0)-dt;if(this.ringBalls.length&&this._starGuardTick<=0){this._starGuardTick=0.12;this.foeBullets.children.iterate(f=>{if(!f||!f.active)return;for(const star of this.ringBalls){if(this.dist(f.x,f.y,star.x,star.y)<30){const x=star.x,y=star.y;this.killFoe(f);this.vfxHitRing(x,y,0xffe08a,false);break;}}});}

    // เครื่องหมาย Memory Jam ต้องเกาะเป้าหมายขณะเป้าหมายเคลื่อนที่ ไม่ทิ้งภาพนิ่งไว้บนพื้น
    this.enemies.children.iterate(e=>{if(e&&e.active&&e._memoryMarkObj&&e._memoryMarkObj.active)e._memoryMarkObj.setPosition(e.x,e.y-8);});

    // กระสุนศัตรู (อายุ)
    this.foeBullets.children.iterate(b=>{ if(!b||!b.active)return; if(b.beh)this.bossShotTick(b,dt); else if(b.spin)b.rotation+=b.spin*dt; if(!b.active)return; b.life-=dt; if(b.life<=0)this.killFoe(b); });

    // boss/mini HP bar + AI แพทเทิร์นโจมตี
    if(this.boss && this.boss.active){
      this.bossThink(this.boss,dt);
      this.tickBossObjective(dt);
      this.bossBar.width=Math.max(0,((this.bossBgW?.width||this._barW*.8)-4)*(this.boss.hp/this.boss.maxhp));
      if(this.bossHpTxt)this.bossHpTxt.setText('P'+(this.boss.phase3?3:this.boss.phase2?2:1)+' · '+this.hudCompactNumber(Math.ceil(this.boss.hp))+' / '+this.hudCompactNumber(Math.ceil(this.boss.maxhp))+' · '+Math.max(0,Math.min(100,Math.round(this.boss.hp/this.boss.maxhp*100)))+'%');
    }
    this.updateObjectiveArrow();
    this.mxTick?.(dt);this.heroFxTick?.();if(this.state==='play'&&this.player?.maxhp>0)this._minHpPct=Math.min(this._minHpPct??1,Math.max(0,this.player.hp)/this.player.maxhp);
    this.drawBars();
  }
}
