  // แตะเมนู: ตรงกรอบก่อน → ไม่โดนเลยค่อยขยายปุ่มเล็กให้ได้อย่างน้อย 44px (+slop) เลือกตัวที่ใกล้สุด
  // v7.9.47 เจ้าของ: แถบเมนูล่างแบบเกมทั่วไป (หน้าแนวตั้งหลังจบบทสอน · ไม่แสดงบนแผนที่ Delve)
  navBarOn(s){ return this.state==='menu'&&s!=='title'&&this.W<this.H&&!Save._cloudConflict&&!['atlas','rift','recipes','recipeprep'].includes(s); }
  // v8.0.1 เจ้าของ: แท็บล่างหายเมื่อหน้าวาดตัวเองใหม่ตรง ๆ (ไม่ผ่าน buildMenuScreen) → ห่อ builder ทุกหน้า (ท้ายไฟล์ NAV_WRAP) ให้จัดความสูง + วาดแท็บล่างเหมือนกัน
  navWrapBuild(f,a){ if(this._inMenuBuild||this.state!=='menu'||!this.menu)return f.apply(this,a); const s=this.menuScreen||'hub',nav=this.navBarOn(s),H0=this.H; if(nav)this.H=H0-NAV_H; this._navOn=nav; this._spotBuild=false; this._inMenuBuild=true; let r;
    try{ r=f.apply(this,a); }finally{ this.H=H0; this._inMenuBuild=false; } if(this.state==='menu'){ this.menu.setVisible(true); if(nav&&!this._spotBuild)this.drawNavBar(s,H0); this.setupMenuScroll(s); } return r; }
  navTabOf(s){ if(s==='hub')return 'hub'; if(['char','stats','talents'].includes(s))return 'char'; if(['chapter','stage'].includes(s))return 'hub'; if(['bazaar','tradein'].includes(s))return 'bazaar';   // v7.9.68 เจ้าของ: เลือกด่านจากกล่องด่านใน Lobby · Bazaar ได้แท็บของตัวเอง
    if(s==='dig')return this._expFrom==='upgrade'?'gLoadout':'gActivity'; if(['gLoadout','upgrade','perks','gear','gearInbox','craft','merge'].includes(s))return 'gLoadout'; if(['gActivity','daily','achievements','kitchen','playstats'].includes(s))return 'gActivity'; return null; }
  drawNavBar(s,H0){ const W=this.W,y0=H0-NAV_H,act=this.navTabOf(s),fix=o=>{o._menuBackdrop=true;o._menuFixedY=o.y;this.menu.add(o);return o;}; this.loadLobbyArt?.();
    const g=fix(this.add.graphics()),bgArt=this.tuHas('lb_nav_bg'); g.fillStyle(0x000000,.35).fillRect(0,y0-6,W,6);
    if(bgArt){ const p=this.tuPanel('lb_nav_bg',0,0,y0,W,NAV_H); p._menuBackdrop=true;p._menuFixedY=y0;this.menu.add(p); }   // v7.9.51 ใบ 33 พื้นแถบ C1
    else{ g.fillStyle(0x1a1024,.98).fillRect(0,y0,W,NAV_H); g.lineStyle(2,0xffd36e,.4).lineBetween(0,y0,W,y0); }
    const tabs=[['hub','ic_nav_home','','🏠','Home'],['char','ic_nav_heroes','hub_btn_heroes','🧸','Heroes'],['bazaar','ic_nav_bazaar','','🛒','Bazaar'],['gLoadout','ic_nav_upgrade','ic_nav_gear','🎒','Upgrade'],['gActivity','ic_nav_activities','hub_btn_activity','🎯','Activities']];
    // v7.9.51 ชื่อใต้ทุกช่อง (เจ้าของเลือกแบบภาพอ้างอิงอบอุ่น) · ช่องที่เปิดกว้างขึ้นนิดและมีไฮไลต์ทอง C2
    // v7.9.52 ช่องกว้างเท่ากัน (ไอคอนไม่ย้ายที่เมื่อเปลี่ยนแท็บ) · ไฮไลต์เลื่อนจากแท็บเดิมไปแท็บใหม่ (เจ้าของ: เดิมดูวาป)
    for(let i=tabs.length-1;i>=0;i--)if(!featureOpen(tabs[i][0]))tabs.splice(i,1);   // v7.9.76 แท็บที่ยังไม่ปลดซ่อนไว้
    const wt=tabs.map(()=>1),sum=wt.reduce((a,b)=>a+b,0); let x0=0;
    const g2=fix(this.add.graphics()),cwE=W/tabs.length,nf=this._navFrom,fromI=(nf&&Date.now()-nf.at<600&&nf.t!==act)?tabs.findIndex(q=>q[0]===nf.t):-1; this._navFrom=null;
    tabs.forEach(([t,nk,key,em,lab],i)=>{ const cw=W*wt[i]/sum,cx=x0+cw/2,on=act===t,play=t==='chapter'; x0+=cw;
      if(on){ let hp=this.tuHas('lb_nav_active')?this.tuPanel('lb_nav_active',0,cx-cw/2+3,y0+4,cw-6,NAV_H-7):null;
        if(!hp){ hp=this.add.graphics(); hp.fillStyle(0xffc43d,1).fillRoundedRect(0,0,cw-6,NAV_H-6,14).fillStyle(0xffe08a,1).fillRoundedRect(3,3,cw-12,(NAV_H-12)*.42,10); hp.setPosition(cx-cw/2+3,y0+4); }
        hp._menuBackdrop=true;hp._menuFixedY=y0+4;this.menu.add(hp);
        if(fromI>=0){ const tx0=hp.x; hp.x=fromI*cwE+3; this.tweens.add({targets:hp,x:tx0,duration:240,ease:'Cubic.easeOut'}); } }
      else if(!bgArt) g2.fillStyle(play?0x6a2a4e:0x2a1d38,1).fillRoundedRect(cx-cw/2+3,y0+6,cw-6,NAV_H-10,12);
      if(i>0&&!on&&tabs[i-1][0]!==act&&this.tuHas('lb_nav_divider'))fix(this.tuImg('lb_nav_divider',0,cx-cw/2,y0+NAV_H/2,2,NAV_H*.6));
      const iy=y0+NAV_H*(on?.36:.4),sz=on?30:28,ik=this.textures.exists(nk)?nk:(key&&this.textures.exists(key)?key:null);
      const icO=ik?fix(this.hubIconFit(this.add.image(cx,iy,ik),ik,cx,iy,sz)).setAlpha(on?1:.9):fix(this.add.text(cx,iy,em,{fontSize:(on?23:20)+'px'}).setOrigin(.5)).setAlpha(on?1:.9);
      if(on&&fromI>=0){ const s1x=icO.scaleX,s1y=icO.scaleY; icO.setScale(s1x*.78,s1y*.78); this.tweens.add({targets:icO,scaleX:s1x,scaleY:s1y,duration:260,delay:90,ease:'Back.easeOut'}); }
      const lbO=fix(this.add.text(cx,y0+NAV_H-(on?15:11),lab,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(on?12:10)+'px',color:on?'#3a1d08':'#f3dcc0',stroke:on?'#fff3cf':'#1a1024',strokeThickness:on?3:2}).setOrigin(.5)); if(on&&fromI>=0){ lbO.setAlpha(0); this.tweens.add({targets:lbO,alpha:1,duration:200,delay:120}); }
      if(this.navBadge?.(t)){   /* v8.0.75 เจ้าของ: จุดแดงเยอะเกิน → แถบล่างโชว์เฉพาะของที่รับได้ตอนนี้ */ const n0=this.menu.list.length; this.drawBadgeDot(this.menu,cx+sz/2,y0+10); for(let k=n0;k<this.menu.list.length;k++){const o=this.menu.list[k];o._menuBackdrop=true;o._menuFixedY=o.y;} }
      this._zone(cx-cw/2,y0,cw,NAV_H,()=>{ if(t===s)return; this._navFrom={t:act,at:Date.now()}; { const a=tabs.findIndex(q=>q[0]===act),b=tabs.findIndex(q=>q[0]===t); this._navDir={d:b>a?1:-1,at:Date.now()}; } this._navStack=[]; this._curMenu='hub'; if(t==='chapter')this.selectedChapter=this.selectedChapter||0; this.menuScreen=t; this.buildMenuScreen(); });
      const z=this.tapZones[this.tapZones.length-1]; z.fixedY=y0; z.tag=t; z.nav=true; }); }
  // v7.9.47 ปุ่มย้อนกลับของมือถือ (Android back / ปัดย้อนกลับในเบราว์เซอร์) · คืน 'exit' เมื่อกดซ้ำที่ Hub ภายใน 2 วิ
  handleBackKey(){ const st=this.state;
    if(st==='menu'){ if(this._bookSkip){this._bookSkip();return true;} if(this._gachaBusy||this._craftRolling||this._bazBusy)return true;
      const z=(this.tapZones||[]).find(q=>q.back); if(z){ Sfx.back?.(); z.fn(); return true; }
      if((this.menuScreen||'hub')!=='hub'){ Sfx.back?.(); this._navStack=[]; this.menuScreen='hub'; this.buildMenuScreen(); return true; }
      const now=Date.now(); if(now-(this._exitAskAt||0)<2000)return 'exit'; this._exitAskAt=now; this.menuToast?.('Press back again to exit','#ffe08a'); return true; }
    if(st==='play'||st==='paused'){ this.togglePause(); return true; }
    return true; }
  handleTap(px,py){ if(this._bookSkip&&this.state==='menu'){this._bookSkip();return;} const zs=this.tapZones;let hit=null; const _sc=(this.state==='menu'&&this._mScrollMax>0)?(this._mScroll||0):0; py+=_sc;const feedback=(z,x,y)=>this._tapFeedback({...z,y:z.y-_sc},x,y-_sc);
    { const bz=zs.find(z=>z.back); if(bz&&px>=bz.x&&px<=bz.x+bz.w&&py>=bz.y&&py<=bz.y+bz.h){ feedback(bz,px,py); (this._pressBounce?this._pressBounce(bz,()=>bz.fn(),'back'):Sfx.uiAction('back',()=>bz.fn())); return; } }   // v6.50.8 Back ชนะเสมอในกรอบขยาย
    for(let i=zs.length-1;i>=0;i--){ const z=zs[i]; if(px>=z.x&&px<=z.x+z.w&&py>=z.y&&py<=z.y+z.h){hit=z;break;} }
    if(!hit){ let best=1e9; const MIN=44,SLOP=6;
      for(let i=zs.length-1;i>=0;i--){ const z=zs[i]; const ew=Math.max(0,(MIN-z.w)/2)+SLOP,eh=Math.max(0,(MIN-z.h)/2)+SLOP;
        if(px>=z.x-ew&&px<=z.x+z.w+ew&&py>=z.y-eh&&py<=z.y+z.h+eh){ const d=Math.hypot(px-(z.x+z.w/2),py-(z.y+z.h/2)); if(d<best){best=d;hit=z;} } } }
    if(!hit)return; this._lastTapZ={x:hit.x,y:hit.y,w:hit.w,h:hit.h,screen:this.menuScreen}; feedback(hit,px,py); (this._pressBounce?this._pressBounce(hit,()=>hit.fn(),hit.sound||'click'):Sfx.uiAction(hit.sound||'click',()=>hit.fn())); }
  // v7.9.53 เจ้าของ: กดแล้วเด้ง ๆ ให้รู้สึกสนุก · ชิ้นส่วนของปุ่ม (ภาพ/ตัวหนังสือ/กรอบที่อยู่ในกรอบแตะ) ยุบ 0.86 → เด้ง 1.08 แล้วค่อยทำงาน (~130ms) · ไม่มีชิ้นให้เด้ง = ทำทันทีเหมือนเดิม
  /* v8.1.131 เจ้าของ (UI polish): สิ่งที่เพิ่งเปลี่ยนเด้งเรือง · ใช้กรอบปุ่มที่เพิ่งแตะ (handleTap เก็บไว้) วาดหลังหน้าวาดใหม่ */
  menuChanged(col=0xffe08a){ const z=this._lastTapZ; if(!z||!this.time)return; const scr=this.menuScreen; this.time.delayedCall(0,()=>{ if(this.state==='menu'&&this.menuScreen===scr)this.menuPulse(z.x,z.y,z.w,z.h,col); }); }
  menuPulse(x,y,w,h,col=0xffe08a){ if(!this.menu||!this.add||!this.tweens)return; const g=this.add.graphics().setPosition(x+w/2,y+h/2); g.lineStyle(3,col,1).strokeRoundedRect(-w/2,-h/2,w,h,Math.min(12,h/2)); g.fillStyle(col,.18).fillRoundedRect(-w/2,-h/2,w,h,Math.min(12,h/2)); this.menu.add(g);
    this.tweens.add({targets:g,scaleX:1.08,scaleY:1.12,alpha:0,duration:520,ease:'Cubic.easeOut',onComplete:()=>g.destroy()});
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2,sp=this.add.text(x+w/2,y+h/2,'✦',{fontSize:(9+i%3*3)+'px',color:'#'+col.toString(16).padStart(6,'0')}).setOrigin(.5); this.menu.add(sp); this.tweens.add({targets:sp,x:x+w/2+Math.cos(a)*(w*.55+10),y:y+h/2+Math.sin(a)*(h*.55+8),alpha:0,duration:560,delay:i*25,onComplete:()=>sp.destroy()}); } }
  /* ใส่อุปกรณ์: ไอคอนบินจากช่องกระเป๋าเข้าช่องอุปกรณ์ แล้วช่องเรืองตามสีความหายาก */
  gearEquipFly(f){ if(!f||!this.time)return; const scr=this.menuScreen; this.time.delayedCall(0,()=>{ const P=this._gearSlotPos?.[f.slot]; if(!P||this.state!=='menu'||this.menuScreen!==scr||!this.add||!this.tweens)return; const hex=(TIER_LABEL[(typeof gearGrade==='function'&&f.item)?gearGrade(f.item):'common']||TIER_LABEL.common||{}).color||'#ffe08a',col=Phaser.Display.Color.HexStringToColor(hex).color;
      if(!this.textures.exists(f.key)){ this.menuPulse(P.x-P.ss/2,P.y-P.ss/2,P.ss,P.ss,col); return; } const im=this.add.image(f.x,f.y,f.key).setDisplaySize(P.ss*.9,P.ss*.9).setAlpha(.95); this.menu.add(im); const s0=im.scaleX;
      this.tweens.add({targets:im,x:P.x,y:P.y,scaleX:s0*.7,scaleY:s0*.7,duration:360,ease:'Cubic.easeIn',onComplete:()=>{ im.destroy(); this.menuPulse(P.x-P.ss/2,P.y-P.ss/2,P.ss,P.ss,col); }}); }); }
  _pressBounce(z,fn,kind){ const run=()=>Sfx.uiAction(kind,fn);
    if(this._pressBusy)return; if(this.state!=='menu'||!this.time||!this.tweens||!this.menu?.list||z.nav||z.noBounce)return run();
    const sc=this._mScrollMax>0?(this._mScroll||0):0,zx=z.x,zy=z.y,zw=z.w,zh=z.h,cx=zx+zw/2,cy=zy+zh/2,objs=[];
    for(const o of this.menu.list){ if(!o||!o.active||o._menuBackdrop||!o.visible)continue; let b=null;
      if(o.type==='Graphics'){ const q=o._bb; if(q&&q.x1>q.x0)b={x:q.x0*o.scaleX+o.x,y:q.y0*o.scaleY+o.y,w:(q.x1-q.x0)*o.scaleX,h:(q.y1-q.y0)*o.scaleY}; }
      else if(o.getBounds){ try{ const r=o.getBounds(); b={x:r.x,y:r.y+sc,w:r.width,h:r.height}; }catch(e){} }
      if(!b||b.w<=0||b.h<=0||b.w>zw*1.3+10||b.h>zh*1.3+10)continue; const mx=b.x+b.w/2,my=b.y+b.h/2;
      if(mx<zx-4||mx>zx+zw+4||my<zy-4||my>zy+zh+4)continue; const q0=o._pbBase; objs.push(q0?{o,x:q0.x,y:q0.y,sx:q0.sx,sy:q0.sy}:{o,x:o.x,y:o.y,sx:o.scaleX,sy:o.scaleY}); }   /* v8.2.49 กดซ้ำระหว่างเด้งกลับ = ใช้ขนาดเดิมก่อนกด (ไม่โตสะสม) */
    if(!objs.length)return run();
    const br=this._lbBreathe; if(br){ br.tw.remove(); for(const p of br.parts){ if(p.o.active){ p.o.x=p.x; p.o.y=p.y; p.o.setScale(p.sx,p.sy); } } this._lbBreathe=null; for(const p of objs){ const q=br.parts.find(r=>r.o===p.o); if(q){ p.x=q.x; p.y=q.y; p.sx=q.sx; p.sy=q.sy; } } }
    for(const p of objs){ p.b={x:p.x,y:p.y,sx:p.sx,sy:p.sy}; p.o._pbBase=p.b; }
    this._pressBusy=true; Sfx.ui?.(kind); const st={k:1},apply=()=>{ for(const p of objs){ if(!p.o.active)continue; p.o.x=cx+(p.x-cx)*st.k; p.o.y=cy+(p.y-cy)*st.k; p.o.setScale(p.sx*st.k,p.sy*st.k); } };
    const done=()=>{ this._pressBusy=false; const S=Sfx; if(S._uiPending===undefined){ S._uiPending=kind; try{fn();}finally{ const cue=S._uiPending; delete S._uiPending; if(cue!==kind)S.ui(cue); } } else fn();
      if(objs.some(p=>p.o.active))this.tweens.add({targets:st,k:1,duration:160,ease:'Back.easeOut',onUpdate:apply,onComplete:()=>{ apply(); for(const p of objs)if(p.o._pbBase===p.b)delete p.o._pbBase; }}); };
    this.tweens.add({targets:st,k:.86,duration:60,ease:'Quad.easeOut',onUpdate:apply,onComplete:()=>this.tweens.add({targets:st,k:1.08,duration:70,ease:'Quad.easeOut',onUpdate:apply,onComplete:done})});
 }
  // ไฟกระพริบบนปุ่ม + วงกระเพื่อมที่นิ้ว (อยู่นอก this.menu จึงไม่หายตอน rebuild)
  // v6.55.45: หน้าเมนูที่ยาวเกินจอ ลากเลื่อนขึ้นลงได้ (แตะ = ปล่อยนิ้วโดยไม่ลาก)
  setupMenuScroll(s){const m=this.menu;this._mScrollMax=0;
    if(!m||!m.list||s==='atlas'||s==='hub'||s==='craft'){if(m)m.y=0;this._mScroll=0;this._mScrollFor=s;this.drawMenuScrollIndicator?.();return;}
    if(this._mScrollFor!==s){this._mScroll=0;this._mVelocity=0;this._mScrollFor=s;}
    // Measure content in its unscrolled coordinate system, including tall panels.
    m.y=0;if(this._gearPinned)this._gearPinned.y=0;
    if(this._mScrollFill){if(m.list.includes(this._mScrollFill))m.remove(this._mScrollFill,true);this._mScrollFill=null;}
    let bottom=0;for(const o of m.list){if(!o||!o.visible||o._menuBackdrop||o===this._gearPinned)continue;try{const bounds=o.getBounds();if(bounds&&Number.isFinite(bounds.bottom))bottom=Math.max(bottom,bounds.bottom);}catch(e){}}
    for(const z of this.tapZones||[])if(z.fixedY==null&&Number.isFinite(z.y+z.h))bottom=Math.max(bottom,z.y+z.h);
    const vh=this.H-(this._navOn?NAV_H:0); this._mScrollMax=bottom>vh+2?Math.ceil(bottom-vh+24):0;this.setMenuScroll(this._mScroll||0);}   // v7.8.99 เลื่อนเฉพาะเมื่อของล้นจอจริง (เดิมขอบล่าง 24px ทำให้หลายหน้าเลื่อนได้นิดเดียว)
  // v7.8.60 สลับหน้าเมนู: ม่านม่วงเข้มปิดทั้งจอแล้ว "ปาด" ออก (หน้าใหม่ = ปาดไปซ้าย · ย้อนกลับ = ปาดไปขวา) + แถบแสงขอบ · ไม่ใช้ alpha ของเมนู (เคยเห็นพื้นโลกวาบ)
  /* v7.9.10 ใบ 28 หนังสือ: โหลดหลังเมนูแรกขึ้น (lazy · ไม่อยู่ในงบบูต) · ครบทุกชิ้นถึงใช้ */
  bookReady(){ return BOOK_KEYS.every(k=>this.realTex(k)); }
  loadBook(cb){ if(this.bookReady()){cb&&cb();return;} if(this._bookLoading){if(cb)(this._bookCbs||(this._bookCbs=[])).push(cb);return;} this._bookLoading=true;this._bookCbs=cb?[cb]:[];
    const fin=()=>{ if(!this._bookLoading)return; this._bookLoading=false; const cbs=this._bookCbs||[];this._bookCbs=[]; cbs.forEach(f=>{try{f();}catch(e){}}); };
    try{ this.ensureGroup(k=>BOOK_KEYS.includes(k),fin,{all:true,quiet:true}); }catch(e){ fin(); } setTimeout(fin,12000); }
  // พลิกหน้า: แผ่นกระดาษเปล่าพลิกทับหน้าใหม่ 6 เฟรม 320ms + เงา + สัน + ฝุ่น · ย้อนกลับ = flipX + สันขวา · ไม่บล็อกการแตะ
  bookTurn(forward){ const w=this.W,h=this.H,c=this.camUI(this.add.container(0,0).setScrollFactor(1).setDepth(5000));this._menuWipe=c;
    ['bk_page_turn','bk_page_shadow','vfx_bk_dust'].forEach(k=>this.tuFrames(k));
    const sx=forward?0:w,fl=!forward,sh=this.add.image(0,0,'bk_page_shadow','cell0').setOrigin(0).setDisplaySize(w,h).setFlipX(fl).setAlpha(.4),
      pg=this.add.image(0,0,'bk_page_turn','cell0').setOrigin(0).setDisplaySize(w,h).setFlipX(fl),
      sp=this.add.image(sx,0,'bk_spine').setOrigin(forward?0:1,0).setDisplaySize(Math.max(22,w*.07),h).setFlipX(fl).setAlpha(0);
    c.add([sh,pg,sp]); this.tweens.add({targets:sp,alpha:1,duration:60});
    let f=0; const ev=this.time.addEvent({delay:82,repeat:5,callback:()=>{ f++; if(!pg.active)return; if(f<=5){pg.setFrame('cell'+f);sh.setFrame('cell'+f);} if(f===5){ const d=this.add.image(sx+(forward?28:-28),h*.56,'vfx_bk_dust','cell0').setDisplaySize(130,130).setFlipX(fl);c.add(d);
        const A=[.7,.95,1,.6,.25,0];let n=0;d.setAlpha(A[0]);this.time.addEvent({delay:60,repeat:5,callback:()=>{n++;if(!d.active)return;if(n>5){d.setVisible(false);return;}d.setFrame('cell'+n).setAlpha(A[n]);}}); } }});
    this.tweens.add({targets:sp,alpha:0,duration:120,delay:420});   // v7.9.20 เจ้าของ: พลิกหน้าช้าลง ×1.5 (360→540ms)
    this.time.delayedCall(540,()=>{ ev.remove(false); if(this._menuWipe===c)this._menuWipe=null; c.destroy(); }); }
  // เปิดปก: ครั้งแรกตอนเข้าเมนูหลังเปิดเกม/กลับจากด่าน · ปกปิด 150ms + แสงตรา → 5 เฟรม 400ms · แตะ = ข้าม
  bookCover(){ if(this._bookCover||!this.bookReady()||this.state!=='menu')return; const w=this.W,h=this.H,c=this.camUI(this.add.container(0,0).setScrollFactor(1).setDepth(5200));this._bookCover=c;this.tuFrames('bk_cover_open');
    const sc=Math.max(w/432,h/768),cw=432*sc,chh=768*sc,ox=(w-cw)/2,oy=(h-chh)/2,cl=this.add.image(ox,oy,'bk_cover_closed').setOrigin(0).setDisplaySize(cw,chh),gl=this.add.image(w/2,h/2,'bk_cover_glow').setDisplaySize(Math.min(w,h)*.7,Math.min(w,h)*.7).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD),
      op=this.add.image(ox,oy,'bk_cover_open','cell0').setOrigin(0).setDisplaySize(cw,chh).setVisible(false);
    c.add([cl,gl,op]); c.setAlpha(0); this.tweens.add({targets:c,alpha:1,duration:120});
    this.tweens.add({targets:gl,alpha:{from:0,to:.9},scale:gl.scale*1.25,duration:200,yoyo:true});
    const end=()=>{ if(this._bookCover!==c)return; this._bookCover=null; this._bookSkip=null; this.tweens.killTweensOf(c); c.destroy(); };
    this._bookSkip=end; let f=-1;
    this.time.delayedCall(270,()=>{ if(!c.active)return; cl.setVisible(false); gl.setVisible(false); op.setVisible(true);
      this.time.addEvent({delay:80,repeat:5,callback:()=>{ f++; if(!op.active)return; if(f<5)op.setFrame('cell'+f); else this.tweens.add({targets:c,alpha:0,duration:120,onComplete:end}); }}); });
    this.time.delayedCall(1400,end); }
  // v7.9.68 เจ้าของ: หลัง TAP TO START เปิดหนังสือช้าลง + ขยับมากขึ้น (~3 วิ) · ปกลอยเข้า → สั่น+แสงตรา 2 ครั้ง → เปิดปก 150ms/เฟรม + ซูมช้า → พลิกหน้า 2 แผ่น → ซูมเข้าหน้าแล้วจาง · แตะ = ข้าม · reveal = สร้างหน้าใหม่ใต้ปกตอนเริ่มเปิด (Lobby) · ไม่ reveal (บทสอน) = done() ตอนเริ่มซูม (หน้าใหม่สร้างใต้หนังสือ แล้วหนังสือจางออก)
  // v7.9.69 ใบ 39: เปิดหนังสือเต็มชุด (~4.6 วิ) · ปกเรียบ + ตราโมจิขยับ + ประกายเวท → ตัวล็อกปลด + ปกสั่น → ปกเปิด 12 เฟรม (Lobby อยู่ใต้ปก) → หน้ากระดาษพลิกรัว → แสงพุ่ง → ซูมจาง · แตะ = ข้าม · จบแล้วคืนเท็กซ์เจอร์ใบ 39
  bkPlusReady(){ return BKP_KEYS.every(k=>this.realTex?.(k)); }
  loadBookPlus(){ if(this.bkPlusReady()||this._bkpLoading)return; this._bkpLoading=true; try{ this.ensureGroup(k=>BKP_KEYS.includes(k),()=>{ this._bkpLoading=false; },{all:true,quiet:true}); }catch(e){ this._bkpLoading=false; } }
  bookOpeningPlus(done,reveal){ const w=this.W,h=this.H; BKP_KEYS.forEach(k=>this.tuFrames(k));
    const c=this.camUI(this.add.container(w/2,h/2).setScrollFactor(1).setDepth(5200));this._bookCover=c;
    const veil=this.add.rectangle(-w/2,-h/2,w,h,0x0d0816,1).setOrigin(0).setAlpha(0);
    const sc=Math.max(w/432,h/768),cw=432*sc,chh=768*sc,P=(x,y)=>[(x-216)*sc,(y-384)*sc],bk=this.add.container(0,0);
    const plate=this.add.image(0,0,'bk_cover_clean_plate','cell0').setDisplaySize(cw,chh),[ex,ey]=P(222,359),
      em=this.add.image(ex,ey,'bk_emblem_spin','cell0').setDisplaySize(340*sc,380*sc),[kx0,ky]=P(400,384),kx=Math.min(kx0,w/2-62*sc),cl=this.add.image(kx,ky,'bk_clasp','cell0').setDisplaySize(140*sc,140*sc),
      mg=this.add.image(kx,ky,'vfx_bk_magic','cell0').setDisplaySize(260*sc,260*sc).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0),
      op=this.add.image(0,0,'bk_open_long','cell0').setDisplaySize(cw,chh).setAlpha(0);
    bk.add([plate,em,cl,op,mg]); c.add([veil,bk]);   /* v8.1.102 เจ้าของ: วงแหวนเวทอยู่ที่ตัวล็อกขวา · ตัดหน้ากระดาษพลิก/แสงพุ่ง (เห็นกระดาษเต็มหน้าแว้บหนึ่ง) → ปกเปิดแล้วเข้า Lobby เลย */
    let fin=false,gone=false; const T=[],at=(ms,f)=>T.push(this.time.delayedCall(ms,()=>{ if(!fin&&c.active)f(); })),
      loop=(img,key,n,ms)=>{ let i=0; T.push(this.time.addEvent({delay:ms,loop:true,callback:()=>{ if(!img.active)return; i=(i+1)%n; img.setFrame('cell'+i); }})); },
      play=(img,n,ms,t0,end)=>{ for(let i=1;i<n;i++)at(t0+i*ms,()=>img.setFrame('cell'+i)); if(end)at(t0+n*ms,end); };
    const go=()=>{ if(gone)return; gone=true; try{ done&&done(); }catch(e){ console.warn(e); } };
    const end=()=>{ if(fin)return; fin=true; T.forEach(t=>t.remove(false)); if(this._bookCover===c)this._bookCover=null; if(this._bookSkip===end)this._bookSkip=null; this.tweens.killTweensOf([c,bk,plate,em,cl,mg,op,veil]); c.destroy(); go();
      this.time.delayedCall(60,()=>{ try{ const used=this.texInUse?.()||new Set(); BKP_KEYS.forEach(k=>{ if(!used.has(k)&&this.textures.exists(k))this.textures.remove(k); }); }catch(e){} }); };   // ใช้ครั้งเดียวต่อการเปิดเกม → คืน ~40 MB
    const finish=()=>{ if(fin)return; this._bookSkip=null; go(); if(reveal&&this.state==='menu'&&this.menuScreen==='hub'&&!this._bkRose){ this._enterLast=null; this._enterRise=true; this.buildMenuScreen(); } this._bkRose=false; this.tweens.killTweensOf([c,bk]); this.tweens.add({targets:bk,scale:bk.scale*1.45,duration:480,ease:'Cubic.in'}); this.tweens.add({targets:c,alpha:0,duration:480,ease:'Quad.in',onComplete:end}); };
    this._bookSkip=finish;
    // 1) ปกลอยเข้า + ตราขยับวน
    this.tweens.add({targets:veil,alpha:.85,duration:300}); bk.setScale(.78).setAngle(-3).setAlpha(0).setY(h*.06);
    this.tweens.add({targets:bk,scale:1,angle:0,alpha:1,y:0,duration:700,ease:'Back.out'}); loop(em,'bk_emblem_spin',8,100);
    // 2) วงแหวนเวทที่ตัวล็อกด้านขวา
    at(650,()=>{ this.tweens.add({targets:mg,alpha:1,duration:300}); loop(mg,'vfx_bk_magic',8,100); Sfx.select&&Sfx.select(); });
    // 3) ตัวล็อกปลด + ปกสั่น
    at(1500,()=>{ Sfx.orderCue?.('book_open',.35,2)||Sfx.ui&&Sfx.ui(); this.tweens.add({targets:bk,x:{from:-4,to:4},duration:45,yoyo:true,repeat:5,ease:'Sine.inOut',onComplete:()=>bk.setX(0)}); }); play(cl,6,100,1500,()=>cl.setVisible(false));
    // 4) เฟดเข้าเฟรมแรกของปกเปิด (150ms) แล้วเปิด 12 เฟรม × 100ms · Lobby สร้างใต้ปกตอนนี้
    at(2150,()=>{ this.tweens.add({targets:[mg,em],alpha:0,duration:150}); this.tweens.add({targets:op,alpha:1,duration:150,onComplete:()=>plate.setVisible(false)}); });
    at(2300,()=>{ em.setVisible(false); mg.setVisible(false); if(reveal){ this._enterLast=null; this._enterRise=true; this._enterRiseDelay=1500; this._bkRose=true; go(); c.setDepth(5200); this.tweens.add({targets:veil,alpha:0,duration:400}); } this.tweens.add({targets:bk,scale:1.06,duration:1800,ease:'Sine.inOut'}); });
    play(op,12,100,2300,()=>{ op.setVisible(false); finish(); });   // ปกเปิดจบ → จางออก เห็น Lobby ว่างใต้ปก แล้วไอคอนค่อยลอยเข้า
    at(6500,end); }
  bookOpening(done,reveal){ const w=this.W,h=this.H; if(this.bkPlusReady?.()&&this.bookOpeningPlus)return this.bookOpeningPlus(done,reveal); ['bk_cover_open','bk_page_turn','bk_page_shadow','vfx_bk_dust'].forEach(k=>this.tuFrames(k));
    const c=this.camUI(this.add.container(w/2,h/2).setScrollFactor(1).setDepth(5200));this._bookCover=c;
    const veil=this.add.rectangle(-w/2,-h/2,w,h,0x0d0816,1).setOrigin(0).setAlpha(0);
    const sc=Math.max(w/432,h/768),cw=432*sc,chh=768*sc,bk=this.add.container(0,0);
    const cl=this.add.image(0,0,'bk_cover_closed').setDisplaySize(cw,chh),gl=this.add.image(0,0,'bk_cover_glow').setDisplaySize(Math.min(w,h)*.75,Math.min(w,h)*.75).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD),
      op=this.add.image(0,0,'bk_cover_open','cell0').setDisplaySize(cw,chh).setVisible(false),
      sh=this.add.image(0,0,'bk_page_shadow','cell0').setDisplaySize(cw,chh).setAlpha(0),pg=this.add.image(0,0,'bk_page_turn','cell0').setDisplaySize(cw,chh).setVisible(false);
    bk.add([cl,op,sh,pg,gl]); c.add([veil,bk]);
    let fin=false; const T=[],at=(ms,f)=>T.push(this.time.delayedCall(ms,()=>{ if(!fin&&c.active)f(); }));
    const end=()=>{ if(fin)return; fin=true; T.forEach(t=>t.remove(false)); if(this._bookCover===c)this._bookCover=null; if(this._bookSkip===end)this._bookSkip=null; this.tweens.killTweensOf([c,bk,cl,gl,op,sh,pg,veil]); c.destroy(); go(); };
    let gone=false; const go=()=>{ if(gone)return; gone=true; try{ done&&done(); }catch(e){ console.warn(e); } };
    const finish=()=>{ if(fin)return; this._bookSkip=null; go(); if(reveal&&this.state==='menu'&&this.menuScreen==='hub'&&!this._bkRose){ this._enterLast=null; this._enterRise=true; this.buildMenuScreen(); } this._bkRose=false; c.setDepth(5200); this.tweens.killTweensOf([c,bk]); this.tweens.add({targets:bk,scale:bk.scale*1.45,duration:480,ease:'Cubic.in'}); this.tweens.add({targets:c,alpha:0,duration:480,ease:'Quad.in',onComplete:end}); };
    this._bookSkip=finish;
    const dust=(x,y,s)=>{ const d=this.add.image(x,y,'vfx_bk_dust','cell0').setDisplaySize(s,s).setAlpha(.9);bk.add(d);let n=0;const ev=this.time.addEvent({delay:70,repeat:5,callback:()=>{n++;if(!d.active)return;if(n>5){d.destroy();return;}d.setFrame('cell'+n).setAlpha(.9-n*.15);}}); };
    // 1) ปกลอยเข้า (ย่อ + เอียงนิด → ตั้งตรง)
    this.tweens.add({targets:veil,alpha:.85,duration:300}); bk.setScale(.78).setAngle(-3).setAlpha(0).setY(h*.06);
    this.tweens.add({targets:bk,scale:1,angle:0,alpha:1,y:0,duration:700,ease:'Back.out'});
    at(520,()=>{ dust(-cw*.32,chh*.34,120); dust(cw*.3,chh*.36,110); });
    // 2) ตราเรืองแสง 2 ครั้ง + ปกสั่นเหมือนเวทกำลังปลดล็อก
    at(760,()=>{ this.tweens.add({targets:gl,alpha:{from:0,to:1},scale:{from:gl.scale*.85,to:gl.scale*1.3},duration:260,yoyo:true,repeat:1,ease:'Sine.inOut'}); Sfx.select&&Sfx.select(); });
    at(820,()=>this.tweens.add({targets:bk,x:{from:-4,to:4},duration:45,yoyo:true,repeat:7,ease:'Sine.inOut',onComplete:()=>bk.setX(0)}));
    // 3) เปิดปก 5 เฟรม × 150ms + ซูมเข้าช้า ๆ
    at(1820,()=>{ if(reveal){ go(); c.setDepth(5200); this.tweens.add({targets:veil,alpha:0,duration:300}); } cl.setVisible(false); op.setVisible(true); dust(cw*.36,0,140); this.tweens.add({targets:bk,scale:1.08,duration:1500,ease:'Sine.inOut'}); Sfx.ui&&Sfx.ui(); });
    for(let f=1;f<5;f++)at(1820+f*150,()=>op.setFrame('cell'+f));
    // 4) พลิกหน้า 2 แผ่น (ขวา → ซ้าย) + เงา + ฝุ่น
    for(let k=0;k<2;k++){ const t0=2700+k*420;
      at(t0,()=>{ pg.setVisible(true).setFrame('cell0'); sh.setAlpha(.4).setFrame('cell0'); Sfx.ui&&Sfx.ui(); });
      for(let f=1;f<6;f++)at(t0+f*60,()=>{ pg.setFrame('cell'+f); sh.setFrame('cell'+f); if(f===5)dust(-cw*.3,chh*.1,110); });
      at(t0+380,()=>{ pg.setVisible(false); sh.setAlpha(0); }); }
    // 5) ซูมเข้าหน้ากระดาษแล้วจาง → done
    at(3560,finish); at(6500,end); }
  menuTransition(forward){ return;   // v7.9.35 เจ้าของ: ไม่ต้องมี transition ระหว่างหน้า — เหลือแค่เปิดปกตอนเข้าเมนู (showMenu → bookCover) · โค้ดเดิมด้านล่างเก็บไว้
    if(this.state!=='menu'||!this.add||!this.hubMotionAllowed?.())return; const w=this.W,h=this.H; if(this._menuWipe){this.tweens.killTweensOf(this._menuWipe);this._menuWipe.destroy();}
    if(this.bookReady()){ if(this._bookCover)this._bookSkip?.(); this.bookCover(); return; }   // v7.9.34 เจ้าของ: ทุกหน้าใช้การเปิดปกแบบตอนจบด่านกลับเมนู (bookTurn เก็บไว้)   // v7.9.10 ใบ 28 พลิกหน้าหนังสือ (ม่านใบ 26 = สำรองตอนยังโหลดไม่เสร็จ)
    const c=this.camUI(this.add.container(0,0).setScrollFactor(1).setDepth(5000)),T=this.textures,art=T.exists('tr_curtain')&&T.exists('tr_edge');this._menuWipe=c;
    if(!art){ const veil=this.add.rectangle(0,0,w,h,0x24142f,1).setOrigin(0),edge=this.add.rectangle(forward?0:w,0,10,h,0xffd6ea,.9).setOrigin(forward?1:0,0);c.add([veil,edge]);
      const prog={t:0};this.tweens.add({targets:prog,t:1,duration:450,ease:'Cubic.inOut',onUpdate:()=>{const x=w*prog.t;if(forward){veil.setX(-x);edge.setX(w-x);}else{veil.setX(x);edge.setX(x);}veil.setAlpha(1-.35*prog.t);edge.setAlpha(.9*(1-prog.t*.6));},onComplete:()=>{if(this._menuWipe===c)this._menuWipe=null;c.destroy();}}); return; }
    // v7.8.68 ใบ 26: ผ้าม่านร้านขนม (tile) + ขอบครีมหยัก + ประกายที่ขอบ + ตรากลางจอหมุนย่อ + ควันแป้ง · ทึบสนิท ห้ามโปร่ง
    const k=h/960,veil=this.add.tileSprite(0,0,w,h,'tr_curtain').setOrigin(0).setTileScale(k),ew=80*k,edge=this.add.image(0,0,'tr_edge').setOrigin(forward?0:1,0).setDisplaySize(ew,h).setFlipX(!forward);c.add([veil,edge]);
    const sp=[];if(T.exists('vfx_tr_edge_sparkle')&&this.anims.exists('vfx_tr_edge_sparkle'))for(let i=0;i<2;i++){const o=this.add.sprite(0,h*(.3+.4*i),'vfx_tr_edge_sparkle',0).setDisplaySize(64*k*1.4,128*k*1.4).setFlipX(!forward);o.play({key:'vfx_tr_edge_sparkle',startFrame:i*2});sp.push(o);c.add(o);}
    const em=T.exists('tr_emblem')?this.add.image(w/2,h/2,'tr_emblem').setDisplaySize(Math.min(w,h)*.34,Math.min(w,h)*.34):null;if(em)c.add(em);const es=em?em.scaleX:1;let puffed=false;
    const prog={t:0};this.tweens.add({targets:prog,t:1,duration:500,ease:'Cubic.inOut',onUpdate:()=>{const t=prog.t,x=w*t,vx=forward?-x:x,lead=forward?w-x:x;veil.setX(vx).setTilePosition((forward?x:-x)*.25/k,0);edge.setX(lead);
        for(const o of sp)o.setX(lead+(forward?ew*.55:-ew*.55));
        if(em){const q=Math.min(1,t/.6);em.setScale(es*(1-q)).setRotation((forward?-1:1)*q*Math.PI*.6).setAlpha(1-q*.4).setX(w/2+vx*.35);
          if(!puffed&&q>=1){puffed=true;em.setVisible(false);if(T.exists('vfx_tr_puff')&&this.anims.exists('vfx_tr_puff')){const pf=this.add.sprite(w/2+vx*.35,h/2,'vfx_tr_puff',0).setDisplaySize(Math.min(w,h)*.42,Math.min(w,h)*.42);c.add(pf);pf.play('vfx_tr_puff');}}}},
      onComplete:()=>{if(this._menuWipe===c)this._menuWipe=null;c.destroy();}}); }
  cancelMenuMotion(){ this._mVelocity=0;this._mDrag=null;if(this._menuPress){this._menuPress.destroy();this._menuPress=null;} }
  menuPointerDown(p){
    if(this._mDrag)return;const moving=Math.abs(this._mVelocity||0)>35;this._mVelocity=0;
    this._mDrag={id:p.id,x0:p.x,y0:p.y,lastY:p.y,lastAt:performance.now(),s0:this._mScroll||0,moved:false,stopped:moving,velocity:0};
    if(moving)return;const y=p.y+(this._mScroll||0),zones=this.tapZones||[];let z=zones.find(q=>q.back&&p.x>=q.x&&p.x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h);
    if(!z)for(let i=zones.length-1;i>=0;i--){const q=zones[i];if(p.x>=q.x&&p.x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h){z=q;break;}}
    if(z&&z.sound!=='none'){const g=this.camUI(this.add.graphics().setScrollFactor(1).setDepth(139));g.fillStyle(0xffffff,.16).fillRoundedRect(z.x,z.y-(this._mScroll||0),z.w,z.h,Math.min(12,z.h/2));this._menuPress=g;}
  }
  menuPointerMove(p){const d=this._mDrag;if(!d||d.id!==p.id)return;const now=performance.now(),dx=p.x-d.x0,dy=p.y-d.y0,wasMoved=d.moved;
    if(Math.hypot(dx,dy)>8){d.moved=true;if(!d.axis)d.axis=Math.abs(dy)>=Math.abs(dx)?'vertical':'horizontal';if(this._menuPress){this._menuPress.destroy();this._menuPress=null;}}
    if(d.moved&&d.axis==='vertical'&&(this._mScrollMax||0)>0&&!this._craftRolling&&!this._bazBusy&&!this._gachaBusy){
      const delta=wasMoved?d.lastY-p.y:d.y0-p.y,before=this._mScroll||0;this.setMenuScroll(before+delta);
      const applied=(this._mScroll||0)-before,elapsed=Math.max(.008,(now-d.lastAt)/1000),velocity=Math.max(-1600,Math.min(1600,applied/elapsed));
      d.velocity=applied===0?0:d.velocity*.35+velocity*.65;
    }d.lastY=p.y;d.lastAt=now;}
  menuPointerUp(p){const d=this._mDrag;if(!d||d.id!==p.id)return;this._mDrag=null;if(this._menuPress){this._menuPress.destroy();this._menuPress=null;}
    if(d.moved){this._mVelocity=performance.now()-d.lastAt<100?d.velocity:0;return;}
    if(!d.stopped&&Math.hypot(p.x-d.x0,p.y-d.y0)<=8)this.handleTap(p.x,p.y);
  }
  tickMenuMotion(dt){if(this.state!=='menu'){if(this._mDrag||this._mVelocity||this._menuPress)this.cancelMenuMotion();this._menuScrollbar?.setVisible(false);return;}this.drawMenuScrollIndicator?.();if(this._mDrag||!(this._mScrollMax>0)||this._craftRolling||this._bazBusy||this._gachaBusy)return;
    const v=this._mVelocity||0;if(Math.abs(v)<8){this._mVelocity=0;return;}dt=Math.min(.05,Math.max(0,dt));const decay=Math.exp(-9*dt),before=this._mScroll||0;this.setMenuScroll(before+v*(1-decay)/9);this._mVelocity=(this._mScroll<=0||this._mScroll>=this._mScrollMax)?0:v*decay;
  }
  setMenuScroll(v){const max=this._mScrollMax||0;this._mScroll=Math.max(0,Math.min(max,Number.isFinite(v)?v:0));if(this.menu){this.menu.y=-this._mScroll;for(const o of this.menu.list||[])if(o&&o._menuBackdrop)o.y=o._menuFixedY+this._mScroll;}
    if(this._gearPinned)this._gearPinned.y=this._mScroll;for(const z of this.tapZones||[])if(z.fixedY!=null)z.y=z.fixedY+this._mScroll;this.drawMenuScrollIndicator?.();}
  drawMenuScrollIndicator(){if(!this.add||!this.camUI)return;const max=this._mScrollMax||0,visible=this.state==='menu'&&max>0&&!this._craftRolling&&!this._bazBusy&&!this._gachaBusy;
    if(!visible){this._menuScrollbar?.setVisible(false);return;}if(!this._menuScrollbar)this._menuScrollbar=this.camUI(this.add.graphics().setScrollFactor(1).setDepth(138));
    const g=this._menuScrollbar,top=Math.min(100,this.H*.2),track=Math.max(40,this.H-top-24),thumb=Math.max(24,track*this.H/(this.H+max)),y=top+(track-thumb)*(this._mScroll||0)/max;
    g.clear().setVisible(true);g.fillStyle(0xffffff,this._mDrag||Math.abs(this._mVelocity||0)>8?.6:.22).fillRoundedRect(this.W-6,y,3,thumb,1.5);}
  _tapFeedback(z,px,py){ try{
    const g=this.camUI(this.add.graphics().setScrollFactor(1).setDepth(140));
    const r=Math.min(14,z.h/2,z.w/2); g.fillStyle(0xffffff,0.22).fillRoundedRect(z.x,z.y,z.w,z.h,r);
    this.tweens.add({targets:g,alpha:0,duration:220,ease:'Quad.easeOut',onComplete:()=>g.destroy()});
    const c=this.camUI(this.add.circle(px,py,10,0xffffff,0.35).setScrollFactor(1).setDepth(141));
    this.tweens.add({targets:c,scale:3.2,alpha:0,duration:320,ease:'Cubic.easeOut',onComplete:()=>c.destroy()});
  }catch(e){} }
  _rowBtn(y,h,iconRef,name,sub,rightLabel,rightColor,fn,xOverride,wOverride){
    const w=wOverride||Math.min(this.W-32,400), x=xOverride==null?this.W/2-w/2:xOverride;
    const compact=h<74, rightW=Math.min(96,w*0.27), textW=Math.max(80,w-62-rightW);
    const g=this.add.graphics(); g.fillStyle(0x2c2338,fn?1:0.6); g.fillRoundedRect(x,y,w,h,15);
    g.lineStyle(2,fn?0x4a4059:0x39304a,1); g.strokeRoundedRect(x,y,w,h,15);
    const m5=typeof M59_EMOJI!=='undefined'&&M59_EMOJI[iconRef]?this.m59Img?.(M59_EMOJI[iconRef],x+27,y+h/2,compact?32:38):null;   /* ใบ 59 */
    const em=m5||(this.textures.exists(iconRef)?this.add.image(x+27,y+h/2,iconRef).setDisplaySize(compact?29:34,compact?29:34):this.add.text(x+27,y+h/2,iconRef,{fontSize:(compact?'21px':'24px')}).setOrigin(0.5));
    const safeName=compact&&name.length>31?name.slice(0,30)+'…':name;
    const safeSub=compact&&sub.length>46?sub.slice(0,45)+'…':sub;
    const nm=this.add.text(x+52,y+h*(compact?0.34:0.32),safeName,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:compact?'12px':'14px',color:fn?'#ffffff':'#9a90ab'}).setOrigin(0,0.5);
    const ds=this.add.text(x+52,y+h*(compact?0.70:0.69),safeSub,{fontFamily:'sans-serif',fontSize:compact?'9px':'10.5px',color:'#b7abc9'}).setOrigin(0,0.5);   // v7.8.70: บรรทัดเดียว (เดิมตัดคำ 2 บรรทัดแล้วทับชื่อแถว)
    if(ds.width>textW){let t=safeSub;while(ds.width>textW&&t.length>6){t=t.slice(0,-2);ds.setText(t.replace(/[\s·,]+$/,'')+'…');}}
    const rt=this.add.text(x+w-12,y+h/2,rightLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:compact?'11px':'12px',color:rightColor,align:'right',wordWrap:{width:rightW}}).setOrigin(1,0.5);
    this.menu.add([g,em,nm,ds,rt]); if(fn)this._zone(x,y,w,h,fn);
  }
  headerTheme(){return this._headerTheme||(this._headerTheme={font:'NunitoUI, sans-serif',text:'#fff1e7',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d});}
  controlTheme(){const h=this.headerTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d};return this._controlTheme||(this._controlTheme={...h,muted:'#cfc1d4',disabled:'#d9cdb4',edge:0xf4d9a1});}
  _screenBg(title,artKey,backScreen,drawHeader=true){ const w=this.W,h=this.H; title=String(title??'').replace(/^[^A-Za-z0-9‹]+\s*/,'')||String(title??'');   // v8.0.75 เจ้าของ: ชื่อหน้าไม่ใส่อีโมจิ ให้เหมือนกันทุกหน้า
    if(this._jrSkin&&(title==='Equipment'||title==='Affix Forge')){ const pg=this.add.image(0,0,'jr_page_bg').setOrigin(0).setDisplaySize(w,h);pg._menuBackdrop=true;pg._menuFixedY=0;this.menu.add(pg);   /* v7.9.10 ใบ 27 หน้ากระดาษสมุด */
      if(drawHeader){const p=w/941,q=Math.max(p,.44),cy=w>h?27:Math.max(59*p,4+30.5*q)+4;this.jrHeader(title,cy,()=>{Sfx.back();const prev=backScreen||(this._navStack&&this._navStack.length?this._navStack.pop():null)||'hub';this._curMenu=prev;this.menuScreen=prev;this.buildMenuScreen();});} return; }
    const compact=w>h;
    const bg=artKey&&this.textures.exists(artKey)?this._coverImage(0,0,w,h,artKey):this.add.rectangle(0,0,w,h,0x1a1420,0.97).setOrigin(0,0);
    const veil=artKey&&this.textures.exists(artKey)?this.add.rectangle(0,0,w,h,0x110c19,0.54).setOrigin(0,0):null;
    bg._menuBackdrop=true;bg._menuFixedY=bg.y;if(veil){veil._menuBackdrop=true;veil._menuFixedY=veil.y;}
    if(artKey&&!this.textures.exists(artKey)&&ASSET_IMAGES[artKey]){   // v7.4 พื้นหลังทุกหน้า (ไม่ใช่แค่ screen_) โหลดตอนเปิดหน้า
      const url=ASSET_IMAGES[artKey];
      this.load.once('filecomplete-image-'+artKey,()=>{
        if(!bg.active||this.state!=='menu'||!this.menu.list.includes(bg))return;
        const art=this._coverImage(0,0,w,h,artKey).setAlpha(0);art._menuBackdrop=true;art._menuFixedY=art.y;art.y=art._menuFixedY+(this._mScroll||0);this.menu.addAt(art,0);
        this.menu.remove(bg,true);const tint=this.add.rectangle(0,this._mScroll||0,w,h,0x110c19,(title==='Equipment'||title==='Affix Forge')?.84:.54).setOrigin(0,0);tint._menuBackdrop=true;tint._menuFixedY=0;this.menu.addAt(tint,1);
        this.tweens.add({targets:art,alpha:1,duration:180});
      });
      this.load.image(artKey,verUrl(url));if(!this.load.isLoading())this.load.start();
    }
    if(artKey==='screen_heroes'||title==='Equipment'||title==='Affix Forge'){if(title==='Affix Forge'&&veil)veil.setFillStyle(0x110c19,.84).setAlpha(1);else if(title!=='Heroes'&&veil)veil.setAlpha(.84);this.menu.add(veil?[bg,veil]:[bg]);if(drawHeader)this.drawRosterHeader(backScreen,artKey==='screen_heroes'?'Heroes':title);return;}
    if(!drawHeader){this.menu.add(veil?[bg,veil]:[bg]);return;}   // v8.0.85 หน้าที่วาดหัวเอง (Forge) ไม่ให้หัวมาตรฐานซ้อน
    const headY=compact?27:52;
    const chrome=this.headerTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',currency:'#f4d9a1',shadow:'#27182f',surface:0x261e30,border:0x6d536d};
    const t=this.add.text(w/2,headY,title,{fontFamily:chrome.font,fontStyle:'bold',fontSize:compact?'20px':'22px',color:chrome.text}).setOrigin(0.5);
    const sKey=this.textures.exists('hr_ic_candy')?'hr_ic_candy':this.textures.exists('ic_sugar')?'ic_sugar':null,sugar=this.add.text(w-22,headY,(sKey?'':'🍬 ')+(Save.data.sugar||0),{fontFamily:chrome.font,fontStyle:'bold',fontSize:compact?'14px':'15px',color:chrome.currency}).setOrigin(1,0.5);   // v8.0.75 ชิป Sugar มีไอคอน (แบบเดียวกับหน้า Heroes)
    // v4.63: ชื่อหน้าต้องอยู่ระหว่างปุ่ม Back (ขวาสุด x=94) กับตัวนับ Sugar — ยาวเกินให้ย่อฟอนต์ลง (เดิมจอแนวตั้งชื่อยาววิ่งทับปุ่ม)
    const room=2*Math.min(w/2-94-8,(w-14-sugar.width-(sKey?40:8))-w/2);let fs=compact?20:22;while(t.width>room&&fs>12){fs--;t.setFontSize(fs+'px');}
    const temple=false;   // v8.0.70 เจ้าของ: หน้า Weave ไม่เข้ากับหน้าอื่น → ใช้หัวหน้าแบบเดียวกับทุกหน้า (โค้ดกรอบวิหารเก็บไว้)
    // veil = .54 เหมือนหน้าอื่น
    this.menu.add(veil?[bg,veil]:[bg]);
    if(temple){ t.setColor(chrome.text).setStroke(chrome.shadow,1.5);sugar.setText(String(Save.data.sugar||0));
      const cwid=Math.max(78,sugar.width+40),room2=2*Math.min(w/2-104,(w-12-cwid)-w/2-4);while(t.width>room2&&fs>12){fs--;t.setFontSize(fs+'px');}if(t.width>room2)t.setScale(room2/t.width);
      // v7.8.70: กรอบชื่อพอดีตัวหนังสือ (เดิมกว้างเลยเข้าไปใต้ปุ่ม Back/ชิป ตัวหนังสือเหลือ 11px)
      const tw=Math.min(room2+18,t.displayWidth+36),th=Math.max(26,tw*.11),tf=this.tuPanel('temple_title_frame',0,w/2-tw/2,headY-th/2,tw,th); if(tf){tf.setAlpha(.95);this.menu.add(tf);}
      const cc=this.tuPanel('temple_currency_chip',0,w-8-cwid,headY-15,cwid,30); if(cc){this.menu.add(cc);sugar.setX(w-18);
        if(this.textures.exists('ic_sugar'))this.menu.add(this.add.image(w-8-cwid+15,headY,'ic_sugar').setDisplaySize(19,19)); } }
    if(!temple){ const cw=sugar.width+(sKey?44:22),cx0=w-12-cw,cg=this.add.graphics(); cg.fillStyle(0x291733,.95).fillRoundedRect(cx0,headY-15,cw,30,15).lineStyle(1.5,0xe5bb6b,.9).strokeRoundedRect(cx0,headY-15,cw,30,15); this.menu.add(cg); if(sKey)this.menu.add(this.add.image(cx0+16,headY,sKey).setDisplaySize(22,22)); }
    this.menu.add([t,sugar]);
    const by=compact?10:38, bh=compact?32:34;
    const bp=temple?this.tuPanel('temple_back_btn',0,10,by,88,bh):null;
    const bg2=bp||this.add.graphics(); if(!bp){bg2.fillStyle(0x291733,.95); bg2.fillRoundedRect(12,by,82,bh,bh/2); bg2.lineStyle(1.5,0xe5bb6b,.9); bg2.strokeRoundedRect(12,by,82,bh,bh/2);}   // v8.0.75 ปุ่ม Back แบบเดียวกับหน้า Heroes
    const bt=this.add.text(bp?60:53,by+bh/2,bp?'Back':'‹ Back',{fontFamily:chrome.font,fontStyle:'bold',fontSize:'13px',color:chrome.text}).setOrigin(0.5);
    this.menu.add([bg2,bt]); this._zone(0,Math.max(0,by-16),110,bh+28,()=>{ Sfx.back(); if(backScreen&&this._navStack&&this._navStack[this._navStack.length-1]===backScreen)this._navStack.pop(); const prev=backScreen||(this._navStack&&this._navStack.length?this._navStack.pop():null)||'hub'; this._curMenu=prev; this.menuScreen=prev; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].back=true;
  }
  // v4.63: แนวตั้ง header อยู่ต่ำกว่าแนวนอน 25px (safe-area) — หน้าที่วางข้อความย่อยใต้หัวด้วยพิกัดแนวนอนให้บวกค่านี้
  _hdrShift(){ return this.W<=this.H?30:0; }
  buildMenuScreen(){ if(this._patrolOn&&this.menuScreen!=='patrol')this.patrolStop(); { const sc=this.menuScreen||'hub',M={wardrobe:'ui_wardrobe_open',ranking:'ui_rank_open',bestiary:'ui_codex_open',skills:'ui_codex_open',atlas:'ui_map_open',bossrush:'ui_bossrush_open'}; if(sc!==this._cueScreen&&M[sc]&&!this._chestOpen)Sfx.menuCue?.(M[sc],.4); if(sc!==this._cueScreen){ try{ Tele.ev('screen',{s:sc}); }catch(e){} if(sc==='dig')this._expFrom=this._cueScreen==='upgrade'?'upgrade':'gActivity'; } this._cueScreen=sc; }   /* v8.2.62 Expedition กลับไปหน้าที่มา (Activities หรือ Weave) */   /* v8.1.65 A11 เสียงเปิดหน้า */
    if(this._chestOpen||this._rubyTalk?.active)return; this.cancelMenuMotion(); const s=this.menuScreen||'hub'; this._jrSkin=false; if(Save._cloudConflict){ this.stopHubMotion?.(); this.buildCloudConflict(); return; }if(s==='atlas'&&this.state==='menu'&&this.mcGate?.('s17',()=>this.buildMenuScreen()))return;   // v8.0.2 Motion Comic ก่อน Delve ครั้งแรก
    if(s!=='hub')this.stopHubMotion?.(); this._gearPinned=null;
    let fullCached=false; try{ fullCached=localStorage.getItem('mochi_full_cached')==='1'; }catch(e){}
    // v6.49.5: เคยโหลดครบแล้ว (หรือกำลังโหลดเบื้องหลัง) = ไม่บล็อกหน้าเมนู · preloadAll จบแล้ว rebuild เอง
    /* v7.9.59 เจ้าของ: เปลี่ยนหน้าแล้วขึ้นจอ Loading = ติดขัด → ไม่บังจอแล้ว: รอเงียบ ๆ ≤300ms ถ้ายังไม่เสร็จก็วาดหน้าด้วยภาพสำรองก่อน แล้ววาดใหม่เมื่อภาพมาครบ */
    if(s!=='hub'&&this._menuNoWait!==s&&!(this._grpOk&&this._grpOk[s])&&!fullCached&&!this._allComplete){ this._grpOk=this._grpOk||{};
      const pred=['gear','craft'].includes(s)?((k,u)=>menuGroupRe(s).test(u||'')&&this.equipmentAssetNeeded(k,u||'')):menuGroupRe(s);
      this.menuLoadSoft(s,(go)=>this.ensureGroup(pred,go,{quiet:true}),()=>{ this._grpOk[s]=true; },true); return; }
    // v7.4 ภาพของหน้าย่อยถอดรหัสตอนเปิดหน้า (ไม่ได้ถอดรหัสตอนบูตแล้ว) · ลองครั้งเดียวต่อ 15 วิ กันวนถ้าไฟล์เสีย
    if(s!=='hub'){ const T=this._menuArtTry||(this._menuArtTry={}),miss=Date.now()-(T[s]||0)>15000?this.menuLazyMissing(s):[];
      if(miss.length&&this._menuNoWait!==s){ T[s]=Date.now(); const ks=new Set(miss); this.menuLoadSoft(s,(go)=>this.ensureGroup(k=>ks.has(k),go,{all:true,quiet:true})); return; } }
    if(s!=='dig'&&this._curMenu==='dig')this.stopDigPresentation(); this.menuMusic(s);
    if(!this._navStack)this._navStack=[];   // นำทางย้อนกลับหน้าก่อนหน้า (แทนที่จะเด้งไป hub เสมอ)
    const navN0=this._navStack.length,prevMenu=this._curMenu;
    if(s==='hub')this._navStack=[]; else if(this._curMenu&&this._curMenu!==s){ this._navStack.push(this._curMenu); if(this._navStack.length>12)this._navStack.shift(); }
    const changed=this._curMenu!==s; this._curMenu=s;
    // v6.49.3: เลิก fade เมนู — alpha 0 ทำให้เห็นพื้นกริดเขียวของโลกด้านหลังวาบ
    if(changed&&this.menu&&this.tweens){ this.tweens.killTweensOf(this.menu); this.menu.setAlpha(1).setY(0); }
    if(changed&&prevMenu)this.time?.delayedCall?.(0,()=>this.menuTransition?.(this._navStack.length>navN0));   // v7.8.60 เจ้าของ: มีแอนิเมชันตอนสลับหน้าเมนู
    const _nav=this.navBarOn(s),_H0=this.H; if(_nav)this.H=_H0-NAV_H; this._navOn=_nav; this._spotBuild=false; this._inMenuBuild=true; try{   // v7.9.47 แถบเมนูล่าง: สร้างหน้าในพื้นที่สูง H−NAV_H แล้ววาดแถบทับส่วนล่าง
    if(s==='stage')this.buildStageSelect(); else if(s==='chapter')this.buildChapterSelect(); else if(s==='upgrade'){this.buildUpgrade();this.time?.delayedCall?.(450,()=>this.rankTeach?.());} else if(s==='perks')this.buildRankPerks(); else if(s==='dig'){ if(featureOpen('dig'))this.buildDig(); else { this.menuScreen='upgrade'; this.buildUpgrade(); } } else if(s==='kitchen')this.buildKitchen(); else if(s==='gear'){const r=this._clampFonts(10);try{this.buildGear();}finally{r();}} else if(s==='gearInbox')this.buildGearInbox(); else if(s==='craft'){this.buildCraftBench();} else if(s==='merge')this.buildMerge(); else if(s==='bazaar')this.buildBazaar(); else if(s==='gm')this.buildGm(); else if(s==='ranking')this.buildRanking(); else if(s==='wardrobe')this.buildWardrobe(); else if(s==='patrol'){ this.menuScreen='dig'; this.buildExpedition(); } else if(s==='tradein')this.buildTradeIn(); else if(s==='stats'){this._heroesTab='stats';this.menuScreen='char';this.buildHeroes();} else if(s==='talents'){this._heroesTab='talents';this.menuScreen='char';this.buildHeroes();} else if(s==='char')this.buildHeroes(); else if(s==='news')this.buildNews(); else if(s==='story')this.buildStoryBook(); else if(s==='bestiary')this.buildBestiary(); else if(s==='skills')this.buildSkillArchive(); else if(s==='settings')this.buildSettings(); else if(s==='playstats')this.buildPlayStats(); else if(s==='achievements')this.buildAchievements(); else if(s==='daily')this.buildDaily(); else if(s==='rewards'){ this.menuScreen=this._rwLast==='achievements'||(!this.hasTargetBadge('daily')&&this.hasTargetBadge('achievements'))?'achievements':'daily'; if(this.menuScreen==='daily')this.buildDaily(); else this.buildAchievements(); }  else if(s==='bossrush')this.buildHub(); else if(s==='rift'||s==='recipes'||s==='recipeprep'){this.menuScreen='atlas';this._atlasTab='board';this.buildAtlas();} else if(s==='atlas')this.buildAtlas(); else if(s==='title')this.buildTitle(); else if(HUB_GROUPS[s])this.buildHubGroup(s); else this.buildHub(); }finally{ this.H=_H0; this._inMenuBuild=false; } if(this.state==="menu")this.menu.setVisible(true); const _n0=this.menu.list.length; if(_nav&&!this._spotBuild)this.drawNavBar(this.menuScreen,_H0); this.applyGearTut(); this.setupMenuScroll(s); this.menuEnterAnim?.(this.menuScreen,_n0);
    // v6.54.1: ภาพยังโหลดอยู่ → วาดหน้านี้ใหม่เมื่อโหลดเสร็จ (กันไอคอนหาย/เห็นเป็น ◆)
    if(this.load&&this.load.isLoading&&this.load.isLoading()&&!this._rebuildOnLoad){ this._rebuildOnLoad=true; const scr=s; let t=null; const re=()=>{ if(t)return; t=setTimeout(()=>{ t=null; this._rebuildOnLoad=false; if(this.state==='menu'&&this.menuScreen===scr&&!this._gachaBusy)this.buildMenuScreen(); },150); }; this.load.once('complete',re); setTimeout(()=>{ if(this._rebuildOnLoad&&this.menuScreen===scr)re(); },4000); }
    // v7.4 ภาพที่แสดงอยู่ = ใช้ล่าสุด · เกินงบ GPU → คืนภาพ lazy ที่ไม่ได้แสดง (LRU)
    try{ this.texTouch(this.texInUse()); this.texBudget(); if(this.texMB()>MENU_TEX_SOFT_MB)this.texEvict((k,c)=>c==='menu',MENU_TEX_SOFT_MB); }catch(e){} }   /* v8.1.127 หน้าเมนู: คืนอาร์ตเมนูที่ไม่ได้แสดง เมื่อเกิน 300 MB */
  // v6.52.0: สอนใส่ไอเทม/สุ่ม/คราฟ หลังล้มบอสด่าน 1 ครั้งแรก — สปอตไลต์บังคับกดทีละขั้น
  applyGearTut(){ if(this._featBusy||(this._featQ&&this._featQ.length))return; const d=Save.data; if(this.state!=='menu')return;
    if(this._weaveTour){ const T=this._weaveTour,s=this.menuScreen,find=f=>this.tapZones.find(f);   // v7.9.45 ทัวร์หลังบทสอน: Hub → Gear & Power → Weave & Rank → อัปแก่น → Back → Back → Play → ด่าน 1
      const spot=(z,label,fn)=>{ if(!z)return false; const f0=z.fn; z.fn=fn||(()=>f0()); this.tapZones=[z]; const c=this.add.container(0,0); this.menu.add(c); this.drawSpotlight(c,z.x,z.y,z.w,z.h,label); return true; };
      if(T==='hub'&&s==='hub'&&!this._coreLoreDone&&!this._rubyTalk&&find(q=>q.tag==='gLoadout')&&!Save.data?.settings?.noRuby){ this._coreLoreDone=true; this.rubyGuide(CORE_LORE_LINES,()=>{ Save.data.coreLoreTaught=true; Save.save(); this.applyGearTut(); },{target:'gLoadout',art:'core79_heart_seed'}); return; }   // v8.1.103 เจ้าของ: Flavor Core ไม่มีที่มา → Ruby เล่าว่าแก่นคือเส้นใยในเมล็ดหัวใจ · Sugar = รสที่ชิงคืนมา
      if(T==='hub'&&s==='hub'){ const z=find(q=>q.tag==='gLoadout'),f0=z&&z.fn; if(spot(z,'Use your Sugar to grow stronger · Tap Upgrade',()=>{ this._weaveTour='gear'; f0(); }))return; }
      if(T==='gear'&&s==='gLoadout'){ const z=find(q=>q.tag==='upgrade'),f0=z&&z.fn; if(spot(z,'Weave gives every hero permanent strength',()=>{ this._weaveTour='weave'; this._tutorialWeaveCoach=true; f0(); }))return; }
      if(T==='weave'&&s==='upgrade'&&Date.now()-(this._weaveSpotAt||0)>300){ this._weaveTour='back'; this._tutorialWeaveCoach=false; return this.applyGearTut(); }   // ไม่มีแก่นที่ซื้อได้ → ข้ามไปสอนปุ่ม Back
      if(T==='back'&&s!=='hub'){ const z=find(q=>q.back),f0=z&&z.fn; if(spot(z,s==='upgrade'?'Power stays with you! Tap Back':'Tap Back again to reach the Hub',()=>f0()))return; }
      if(T==='back'&&s==='hub')this._weaveTour=T==='back'?'play':T;
      if(this._weaveTour==='play'&&s==='hub'){ const z=find(q=>q.tag==='chapter'); if(spot(z,'Ready! Choose Stage 1 to meet Ruby in the pantry',()=>{ this._weaveTour=null; this._stage1Coach=true; this.selectedChapter=0; this.menuScreen='stage'; this.buildMenuScreen(); }))return; }
      if(s==='hub'&&(T==='gear'||T==='weave')){ this._weaveTour='hub'; const z=find(q=>q.tag==='gLoadout'),f0=z&&z.fn; if(spot(z,'Use your Sugar to grow stronger · Tap Upgrade',()=>{ this._weaveTour='gear'; f0(); }))return; }   // ผู้เล่นกด Back กลางทาง → เริ่มขั้นแรกใหม่
    }
    if(this._mintCoach){ const hi=this._mintCoach===true?HERO_INTROS[0]:this._mintCoach; const z=this.tapZones.find(q=>q.tag==='char_'+hi.id); if(!z)return; z.fn=()=>{ this._mintCoach=false; Save.data.character=hi.id; this.character=hi.id; Save.data[hi.flag]=1; Save.save(); Sfx.select&&Sfx.select(); this.startStoryStage(hi.idx); };
      this.tapZones=[z]; const c=this.add.container(0,0); this.menu.add(c); const st=STAGES[hi.idx],lab=st&&st.chapterStage?'C'+(st.chapter+1)+'-'+st.chapterStage:'Stage '+(hi.idx+1); this.drawSpotlight(c,z.x,z.y,z.w,z.h,'Pick '+hi.name+' for '+lab+'!'); return; }
    if(this._stage1Coach){ const z=this.tapZones.find(q=>q.tag==='stage_0'); if(!z)return; const fn=z.fn; z.fn=()=>{ this._stage1Coach=false; fn(); };
      this.tapZones=[z]; const c=this.add.container(0,0); this.menu.add(c); this.drawSpotlight(c,z.x,z.y,z.w,z.h,'Play Stage 1!'); return; }
    if(d.gearTut===undefined){ if(!(d.stageMastery||{})[0]||!d.tutorialDone||(d.unlockedStage||0)>1){ if((d.unlockedStage||0)>1)d.gearTut=-1; return; }
      d.gearTut=0; const gs=chestSugarCost(CHESTS[0]); Save.addSugar(gs); Save.save(); this.menuToast('🎁 Gear tutorial gift: 🍬'+gs+' Sugar','#ffd166'); }   /* v8.2.54 กล่องจ่ายด้วย Sugar */   // v8.0.19 เจ้าของ: สอนเปิดหีบเงิน/ทอง (ไม่ใช่ Gacha)
    const st=d.gearTut; if(st<0||st>4)return;
    // v7.8.90 กระจายบทแนะนำ: ด่าน 1 = ของ · ด่าน 2 = Forge (+3 Twist Cream) · ด่าน 3 = Talent
    const sm=d.stageMastery||{}; if(st>=2&&st<=3&&!sm[1])return; if(st===4&&!sm[2])return;
    if(st===2&&!d._craftTutGift){ d._craftTutGift=true; Save.addCurrency&&Save.addCurrency('transmute',3); Save.save(); this.menuToast('🎁 Forge unlocked: +3 🟢 Twist Cream','#ffd166'); }
    // Never route Equipment → Power → Equipment when the selected starter/locked item cannot be crafted.
    if(st===2||st===3){const items=(d.gearItems||[]).filter(it=>it&&!it.locked&&GEAR_ALL.some(b=>b.id===it.baseId&&b.tier!=='start')&&[0,1,2,3,4,5].some(i=>forgeLineOpen(it,i)&&!forgeLines(it)[i]));   // v8.0.83 ต้องมีแถวว่างให้ Add
      if(!items.length){if(!this._gearTutWaiting){this._gearTutWaiting=true;this.menuToast?.('Forge lesson paused: find unlocked gear with an empty mod row, then open Forge','#ffd166');}return;}
      if(st===3&&(Save.currency?.('transmute')||0)<forgePrice(items.find(it=>it.uid===this.craftSelectedUid)||items[0])){if(!this._gearTutWaiting){this._gearTutWaiting=true;this.menuToast?.('Forge lesson paused: you need Twist Cream to add a stat','#ffd166');}return;}
      this._gearTutWaiting=false;const chosen=items.find(it=>it.uid===this.craftSelectedUid)||items.find(it=>it.uid===this.gearSelectedUid)||items[0];
      if(this.craftSelectedUid!==chosen.uid||this.gearSelectedUid!==chosen.uid){this.gearSlot=chosen.slot;this.craftSelectedUid=chosen.uid;this.gearSelectedUid=chosen.uid;this.gearFilter=null;this.craftLineIndex=0;this.forgePick=null;
        if(this.menuScreen==='gear'||this.menuScreen==='craft'){this.buildMenuScreen();return;}}
    }
 if(st===4){const cp=Save.cp(d.character||'momo');if((cp.tp||0)<1&&!d._talTutGift){cp.tp=(cp.tp||0)+1;d._talTutGift=true;Save.save();}}
    if(st===2&&this.menuScreen==='craft'){d.gearTut=3;Save.save();return this.applyGearTut();}
    const STEPS=[{m:/openChest\(/,t:'Open a Silver Chest for a new item!'},{m:/equipGearInstance/,t:'Equip your new item!'},{m:/menuScreen='craft'/,t:'Now craft it — add a stat!'},{m:/forgeAdd\(/,t:'Add a random mod! It costs 🟢 Twist Cream'},{m:/\.tal\[\w+\.id\]=\w+\+1/,t:'Spend a Talent Point — talents are permanent!'}];
    if(st===0&&this.menuScreen==='bazaar'&&this._bazTab!=='chests'){ this._bazTab='chests'; this.buildMenuScreen(); return; }   // v8.0.19 เจ้าของ: บทสอนพาไปหน้าหีบเงิน/ทอง
    // v8.0.70 เจ้าของ: บทสอนสวมของต้องชี้ปุ่ม Equip จริง (ไม่ใช่ช่องในกระเป๋า) แล้วสอนปุ่ม ⚡ Quick Equip ต่อ
    if(st===1&&this.menuScreen==='gear'){ const sk={x:this.W-96,y:this.H-40,w:86,h:30,fn:()=>{ d.gearTut=-1; delete d._gearTutQE; Save.save(); this.buildMenuScreen(); }};
      const show=(z,label)=>{ this._gearTutLabel=label; this.tapZones=[z,sk]; const c=this.add.container(0,0); this.menu.add(c); this.drawSpotlight(c,z.x,z.y,z.w,z.h,label); c.add(this.add.text(this.W-14,this.H-25,'Skip ›',{fontFamily:'sans-serif',fontSize:'12px',color:'#aaa0b8'}).setOrigin(1,0.5)); };
      if(d._gearTutQE){ const q=this.tapZones.find(t=>t.tag==='gear_best'); if(!q){ d.gearTut=2; delete d._gearTutQE; Save.save(); return; } const f=q.fn; q.fn=()=>{ d.gearTut=2; delete d._gearTutQE; Save.save(); f(); this.time?.delayedCall(1800,()=>this.menuToast('🌟 Next: the Forge opens after Stage 2','#ffd166')); }; show(q,'⚡ Quick Equip: wear your best gear in one tap'); return; }
      const items=d.gearItems||[],it=[...items].reverse().find(x=>x&&x.grade!=='start'&&!Save.isGearEquipped(x.uid));
      if(it&&this.gearSelectedUid!==it.uid){ this.gearSlot=it.slot; this.gearFilter=null; this.gearSelectedUid=it.uid; this.buildMenuScreen(); return; }
      const e=it&&this.tapZones.find(t=>t.tag==='gear_equip'); if(!e){ d._gearTutQE=1; Save.save(); this.buildMenuScreen(); return; }
      const f=e.fn; e.fn=()=>{ d._gearTutQE=1; Save.save(); f(); }; show(e,'Tap ⚔ Equip to wear your new item!'); return; }
    const cur=STEPS[st],src=z=>{try{return String(z.fn).replace(/"/g,"'")}catch(e){return ''}};   // v7.9.35 เวอร์ชัน live ย่อโค้ด (esbuild) → เครื่องหมายคำพูดเป็น " · ชื่อตัวแปรเปลี่ยน
    let z=(st===0&&this.tapZones.find(q=>q.tag==='chest_silver'))||(st===1&&this.tapZones.find(q=>q.tag==='gear_equip'))||(st===2&&this.tapZones.find(q=>q.tag==='craft'||q.tag==='gear_craft'))||(st===3&&this.tapZones.find(q=>q.tag?.startsWith('add_')))||this.tapZones.find(q=>cur.m.test(src(q))),label=cur.t,adv=true;
        if(!z&&st===4){ adv=false; z=this.tapZones.find(q=>q.tag==='tab_talents'); label='Open Talents'; if(!z){ z=this.tapZones.find(q=>/menuScreen='char'/.test(src(q))&&!/_heroesTab/.test(src(q))); label='Open Heroes'; } if(!z){ z=this.tapZones.find(q=>q.tag==='talents'||q.tag==='char'); label='Open Talents'; } if(!z){ z=this.tapZones.find(q=>q.back); label='Go back'; } }
    if(!z&&st<4){ adv=false; const want=st===0?'bazaar':st===2||st===3?'craft':'gear'; z=this.tapZones.find(q=>q.tag===want); label='Open '+(st===0?'Bazaar':st===2||st===3?'Forge':'Equipment');   // v7.9.35 กาชาย้ายไป Bazaar แล้ว (v7.8.95)
      if(!z&&this.menuScreen!=='gLoadout'&&this.menuScreen!=='craft'){ z=this.tapZones.find(q=>q.tag==='gLoadout'||/menuScreen='gLoadout'/.test(src(q))); label='Open Upgrade'; }
      if(!z&&this.menuScreen!=='hub'&&!(st===1&&this.menuScreen==='gear')){ z=this.tapZones.find(q=>q.back)||this.tapZones.find(q=>/Sfx\.back\(\)/.test(src(q))); label='Go back'; } }
    if(!z){ if(st===1&&this.menuScreen==='gear'){ const items=d.gearItems||[],it=items[items.length-1],b=it&&GEAR_ALL.find(g=>g.id===it.baseId);
        if(it&&b&&!Save.isGearEquipped(it.uid)&&this.gearSelectedUid!==it.uid){ this.gearSlot=b.slot; this.gearSelectedUid=it.uid; this.buildMenuScreen(); return; }
        d.gearTut=2; Save.save(); this.buildMenuScreen(); } return; }
    const fn=z.fn; z.fn=()=>{ if(adv&&st===3){const {item}=this._craftContext(),line=/^add_(\d)$/.test(z.tag||'')?Number(z.tag.slice(4)):(this.craftLineIndex??0);if(!item||item.locked||!forgeLineOpen(item,line)||forgeLines(item)[line]||(Save.currency?.('transmute')||0)<forgePrice(item)){fn();return;}} if(adv){ d.gearTut=st===4?-1:st+1; Save.save(); if(st===1)this.time.delayedCall(1800,()=>this.menuToast('🌟 Next: the Forge opens after Stage 2','#ffd166')); if(st===3)this.time.delayedCall(1800,()=>this.menuToast('🌟 Next: Talents after Stage 3','#ffd166')); if(st===4)this.time.delayedCall(800,()=>this.menuToast('✨ Tutorial done! Gear, crafting and talents make you stronger','#8dffb0')); } fn(); };
    const skip={x:this.W-96,y:this.H-40,w:86,h:30,fn:()=>{ d.gearTut=-1; Save.save(); this.buildMenuScreen(); }};
    this._gearTutLabel=label; this.tapZones=[z,skip]; const c=this.add.container(0,0); this.menu.add(c); this.drawSpotlight(c,z.x,z.y,z.w,z.h,label);
    c.add(this.add.text(this.W-14,this.H-25,'Skip ›',{fontFamily:'sans-serif',fontSize:'12px',color:'#aaa0b8'}).setOrigin(1,0.5)); }
  // หน้ากลุ่มเมนู (รวมปุ่มย่อยให้ Hub สะอาดขึ้น) — รายการจาก HUB_GROUPS
  gearPowerLayout(){const w=this.W,h=this.H,portrait=w<=h,bw=Math.min(w-28,520),x=(w-bw)/2,gap=10,cols=portrait?2:4,tw=(bw-gap*(cols-1))/cols,top=portrait?112:90,powerH=bw*231/768,tileH=tw*267/384,gearY=top+powerH+36;return{portrait,bw,x,top,gap,cols,tw,powerH,tileH,gearY};}
  // v8.0.26 เจ้าของ: หน้าสรุปพลัง — Power ปัจจุบัน vs Power แนะนำด่านถัดไป · 3 ทางเพิ่มพลังที่คุ้มสุดตอนนี้ · ปุ่ม Weave/Equipment/Forge (ไม่มี Bazaar)
  // v8.0.31 เจ้าของ (A): ทุกการ์ดเรียงตาม Power ที่เพิ่มจริง (จำลองแล้วคืนค่า) · ของที่ไม่ใช่ Power (Mail / Rank reward / Talent สาย Build) ไปอยู่แถบ "รออยู่"
  powerTips(){ const d=Save.data,cid=d.character||'momo',base=heroPower(cid,null),out=[],wait=[],thr=Save.threads?Save.threads():(d.threads||0);
    // ของในกระเป๋า: ชิ้นที่ดีที่สุดต่อช่อง
    try{ let sum=0,n=0; for(const sd of GEAR_SLOTS){ let bv=0; for(const it of Save.gearItemsForSlot(sd.slot)||[]){ if(!it||it.grade==='start'||it.forgeChoice||Save.isGearEquipped(it.uid))continue; const v=gearPowerDelta(it,base); if(v>bv)bv=v; } if(bv>0){sum+=bv;n++;} }
      if(sum>0)out.push({k:'gear',icon:'🎒',title:'Equip better gear',sub:n+' slot'+(n>1?'s':'')+' can be upgraded from your bag',gain:sum,go:'gear'}); }catch(e){}
    // Weave: แก่นที่คุ้มสุด · Sugar ที่มีซื้อได้กี่ขั้น (สูงสุด 10) รวมได้เท่าไร
    try{ const up=d.upgrades||(d.upgrades={}),keep={...up}; let best=null;
      for(const k of UPG_ORDER){ let sug=d.sugar||0,n=0,cost=0; try{ while(n<10&&(up[k]||0)<TAL_MAX){ const c=Save.talCost(k); if(sug<c)break; sug-=c; cost+=c; up[k]=(up[k]||0)+1; n++; } const g=n?heroPower(cid,null)-base:0; if(n&&(!best||g>best.g))best={k,n,g,cost}; }finally{ for(const q of UPG_ORDER){ if(keep[q]===undefined)delete up[q]; else up[q]=keep[q]; } } }
      if(best&&best.g>0)out.push({k:'weave',icon:UPGRADES[best.k].emoji,title:'Weave '+UPGRADES[best.k].name+(best.n>1?' ×'+best.n:''),sub:'Your Sugar buys '+best.n+' level'+(best.n>1?'s':'')+' · 🍬 '+best.cost,gain:best.g,go:'upgrade'});
      else if(Save.talAllMax?.()&&thr>=Save.promoteThreadCost())wait.push({k:'rank',icon:'🎖',label:'Weave Rank up',go:'upgrade'}); }catch(e){}
    // Talent แกนหลัก: จุดที่ลงได้และคุ้มสุด (Talent สาย Build ไม่นับใน Power → แถบรออยู่)
    try{ const cp=Save.cp(cid)||{},tp=cp.tp||0; if(tp>0){ const tal=cp.tal||(cp.tal={}),core=charTalents(cid)||[]; let best=null;
        if(core.length){ const root=core[0],par={},ch=[[],[],[]]; core.slice(1).forEach((n,i)=>ch[i%3].push(n)); ch.forEach(c=>c.forEach((n,i)=>par[n.id]=i===0?root.id:c[i-1].id));
          for(const n of core){ const r=tal[n.id]||0,ok=n===root||n.free||(tal[par[n.id]]||0)>0,c=n.costs?n.costs[r]:talCost(r); if(!ok||r>=n.max||c==null||tp<c)continue;
            tal[n.id]=r+1; let g=0; try{ g=heroPower(cid,null)-base; }finally{ if(r)tal[n.id]=r; else delete tal[n.id]; } if(g>0&&(!best||g>best.g))best={n,g}; } }
        if(best)out.push({k:'tal',icon:'🌟',title:'Talent: '+best.n.name,sub:tp+' point'+(tp>1?'s':'')+' free · Heroes → Talents',gain:best.g,go:'talents'});
        else if(heroTalentSpendable(cid))wait.push({k:'tal',icon:'🌟',label:tp+' Talent pt'+(tp>1?'s':''),go:'talents'}); } }catch(e){}
    // ตีบวกของที่ใส่อยู่
    if(!d.enhDone)try{ let best=null,bg=0; for(const sd of GEAR_SLOTS){ const it=Save.equippedGearItem(sd.slot); if(!it||it.grade==='start')continue; const lv=gearEffectiveEnhance(it); if(lv>=gearEnhanceCap(it))continue; const cost=gearEnhShardCost(lv); if(thr<cost)continue; const was=it.enhanceLv; it.enhanceLv=lv+1; let g=0; try{ g=heroPower(cid,null)-base; }finally{ it.enhanceLv=was; } if(g>bg){bg=g;best={it,lv,cost};} }
      if(best){ const b=GEAR_ALL.find(x=>x.id===best.it.baseId)||{name:'gear'}; out.push({k:'enh',icon:'⚒',title:'Enhance '+b.name+' to +'+(best.lv+1),sub:'🧶 '+best.cost+' Thread'+(best.lv>=3?' · may drop a level on a miss':''),gain:bg,go:'gear',uid:best.it.uid}); } }catch(e){}
    try{ if(Save.rankUnpicked&&Save.rankUnpicked()>0)wait.push({k:'perk',icon:'🎁',label:'Rank reward',go:'perks'}); }catch(e){}
    try{ const nb=(Save.gearInboxItems?.()||[]).length; if(nb)wait.push({k:'mail',icon:'📦',label:nb+' in Mail',go:'gearInbox'}); }catch(e){}
    out.sort((x,y)=>y.gain-x.gain); const top=out.slice(0,3); top.wait=wait; return top; }
  powerHubLayout(tipCount=3,waitCount=0,routeCount=4,heights=[]){
    const w=this.W,h=this.H,portrait=w<=h,bw=Math.min(w-28,portrait?480:800),x=(w-bw)/2,top=(portrait?82:68)+(this._hdrShift?.()||0),gap=8;
    const roomy=portrait&&h>=820,summaryH=112,tipH=roomy?80:74,tileH=roomy?84:66,cols=portrait?2:4,waitCols=portrait?2:4;
    const tipsY=top+summaryH+28,tipHeights=Array.from({length:Math.max(1,tipCount)},(_,i)=>Math.max(tipH,heights[i]||0)),tipYs=[];let at=tipsY;for(const ph of tipHeights){tipYs.push(at);at+=ph+gap;}
    const tipsBottom=at-gap,waitY=tipsBottom+12,waitRows=Math.ceil(waitCount/waitCols),optionsY=waitY+(waitRows?waitRows*48+8:0)+26,rows=Math.ceil(routeCount/cols),bottom=optionsY+rows*(tileH+gap)-gap+8;
    return{portrait,bw,x,top,gap,summaryH,tipH,tipHeights,tipYs,tileH,cols,waitCols,tipsY,waitY,optionsY,bottom};
  }
  powerHubIcon(kind,x,y,size){
    const frames={power:0,weave:1,gear:2,merge:3,enh:4,craft:4,tal:5},fallback={power:'lb_star',weave:'temple_life_core',gear:'ic_nav_upgrade',merge:'tile_gear',enh:'tile_craft',craft:'tile_craft',tal:'tile_talents'};
    let o=null;if(this.textures.exists('power56_icons')&&frames[kind]!=null)o=this.add.image(x,y,'power56_icons',frames[kind]);
    else if(this.textures.exists(fallback[kind]))o=this.add.image(x,y,fallback[kind]);
    if(o){o.setScale(size/Math.max(o.width,o.height));this.menu.add(o);}return o;
  }
  // v8.0.77 ใบ 57: ไอคอน Power family · โหลดเมื่อเปิดหน้า (ไม่ใช่ boot) · ยังไม่มี = ไอคอนเดิม/อีโมจิ
  pwIcon(key,x,y,size){ const i=PW57.indexOf(key); if(i<0)return null; if(!this.textures.exists('power57_icons')){ this.loadPower57?.(); return null; }
    const o=this.add.image(x,y,'power57_icons',i); o.setScale(size/192); this.menu.add(o); return o; }
  loadPower57(){ if(this._pw57Loading||this.textures.exists('power57_icons')||!this.load)return; this._pw57Loading=true; const scr=this.menuScreen;
    this.load.once('filecomplete-spritesheet-power57_icons',()=>{ this._pw57Loading=false; if(this.state==='menu'&&this.menuScreen===scr)this.buildMenuScreen(); });
    this.load.spritesheet('power57_icons',verUrl(ASSET_SHEETS.power57_icons.url),{frameWidth:192,frameHeight:192}); if(!this.load.isLoading())this.load.start(); }
  // v8.0.79 ใบ 59 + 58: ไอคอนเมนู / ภาพประกอบ โหลดตอนใช้ · ยังไม่มี = null (ใช้ของเดิม)
  m59Img(key,x,y,size){ const i=MENU59.indexOf(key); if(i<0)return null; if(!this.textures.exists('menu59_icons')){ this.loadMenuSheet?.('menu59_icons'); return null; } return this.add.image(x,y,'menu59_icons',i).setScale(size/192); }
  loadMenuSheet(k){ const L=this._mSheetL||(this._mSheetL={}); if(L[k]||this.textures.exists(k)||!this.load||!ASSET_SHEETS[k])return; L[k]=1; const scr=this.menuScreen;
    this.load.once('filecomplete-spritesheet-'+k,()=>{ L[k]=0; if(this.state==='menu'&&this.menuScreen===scr)this.buildMenuScreen(); }); this.load.spritesheet(k,verUrl(ASSET_SHEETS[k].url),{frameWidth:ASSET_SHEETS[k].frame,frameHeight:ASSET_SHEETS[k].frame}); if(!this.load.isLoading())this.load.start(); }
  pwArt(key,x,y,w,h){ if(!ASSET_IMAGES[key])return null; if(!this.textures.exists(key)){ const L=this._mSheetL||(this._mSheetL={}); if(!L[key]&&this.load){ L[key]=1; const scr=this.menuScreen; this.load.once('filecomplete-image-'+key,()=>{ L[key]=0; if(this.state==='menu'&&this.menuScreen===scr)this.buildMenuScreen(); }); this.load.image(key,verUrl(ASSET_IMAGES[key])); if(!this.load.isLoading())this.load.start(); } return null; }
    const o=this.add.image(x,y,key).setDisplaySize(w,h); this.menu.add(o); return o; }
  pwCard(x,y,w,h,accent){ const g=this.add.graphics(); g.fillStyle(accent?0x423039:0x261e30,.97).fillRoundedRect(x,y,w,h,14).lineStyle(accent?1.8:1,accent?0xf4d9a1:0x6d536d,accent?.95:.8).strokeRoundedRect(x,y,w,h,14); this.menu.add(g); return g; }
  pwSection(label,x,y){ const t=this.add.text(x,y,label,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff1e7'}).setOrigin(0,.5); this.menu.add(t); return t; }
  buildGearPower(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Power','screen_gear_power_789','hub');
    const d=Save.data,w=this.W,h=this.H,nxt=this.hubNextStep?.();
    const tips=this.powerTips(),waiting=tips.wait||[];
    const rows=[['upgrade','Weave','weave'],['gear','Equipment','gear'],['merge','Merge','merge'],['craft','Forge','craft']].filter(r=>featureOpen(r[0]));
    const L=this.powerHubLayout(tips.length,waiting.length,rows.length),{bw,x,top,gap,tipH,tileH}=L,F='NunitoUI, sans-serif';
    const T=(tx,ty,t,sz=12,color='#fff1e7',bold=false,ox=0)=>{const o=this.add.text(tx,ty,t,{fontFamily:F,fontSize:sz+'px',fontStyle:bold?'bold':'normal',color}).setOrigin(ox,.5);this.menu.add(o);return o;};
    const fit=(o,width,min=11)=>{let fs=parseFloat(o.style.fontSize);while(o.width>width&&fs>min){fs-=.5;o.setFontSize(fs);}if(o.width>width){const original=o.text;let text=original;while(text.length>1&&o.width>width){text=text.slice(0,-1);o.setText(text+'…');}}return o;};
    const panel=(px,py,pw,ph,accent=false)=>{const g=this.add.graphics();g.fillStyle(accent?0x423039:0x261e30,.97).fillRoundedRect(px,py,pw,ph,16).lineStyle(accent?1.8:1,accent?0xf4d9a1:0x6d536d,accent?.95:.8).strokeRoundedRect(px,py,pw,ph,16);this.menu.add(g);return g;};
    const metrics=tips.map(t=>{const gain=String(Math.round(t.gain||0)),gainW=Math.max(54,Math.min(bw*.24,gain.length*10+20)),room=bw-60-gainW-21,title=this.add.text(0,0,t.title,{fontFamily:F,fontSize:'13px',fontStyle:'bold',wordWrap:{width:room}}),probe=this.add.text(0,0,t.sub,{fontFamily:F,fontSize:'11px',wordWrap:{width:room}}),descY=16+Math.ceil(title.height),height=descY+Math.ceil(probe.height)+10;title.destroy();probe.destroy();return{gain,gainW,room,height,descY};});
    Object.assign(L,this.powerHubLayout(tips.length,waiting.length,rows.length,metrics.map(m=>m.height)));
    // Keep existing scenic painting; the quiet content veil stays fixed during scrolling.
    const veil=this.add.rectangle(0,80,w,Math.max(0,h-80),0x1b1424,.22).setOrigin(0);veil._menuBackdrop=true;veil._menuFixedY=80;this.menu.add(veil);
    let si=Math.min(d.unlockedStage||0,STAGES.length-1);while(si>0&&!isStageReady(si))si--;
    const ps=this.powerStatus(si),st=STAGES[si]||STAGES[0],code=st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):('C'+(Math.floor(si/5)+1)+'-'+(si%5+1));
    panel(x,top,bw,L.summaryH);this.powerHubIcon('power',x+34,top+43,52);
    T(x+68,top+17,'Your Power',11,'#d9cadb',true);
    const cid=d.character||'momo',prev=this._pwShown&&this._pwShown.cid===cid?this._pwShown.v:ps.cur;this._pwShown={cid,v:ps.cur};
    const valueWidth=bw*.51-70,pt=fit(T(x+68,top+44,String(ps.cur),28,'#fff3d7',true),valueWidth,18),numberFont=parseFloat(pt.style.fontSize);
    fit(T(x+bw-16,top+18,'Next stage '+code,11,'#d9cadb',true,1),bw*.45);
    fit(T(x+bw-16,top+42,'Recommended '+ps.rec,13,'#f5ddb6',true,1),bw*.44,11);
    const bx=x+16,bwid=bw-32,by=top+79,bar=this.add.graphics(),fr=Math.max(0,Math.min(1,ps.ratio)),fr0=Math.max(0,Math.min(1,prev/Math.max(1,ps.rec)));
    const drawBar=f=>{bar.clear().fillStyle(0x17121d,1).fillRoundedRect(bx,by,bwid,9,4);if(f>0)bar.fillStyle(0x85d5b2,1).fillRoundedRect(bx,by,Math.max(3,bwid*f),9,4);};this.menu.add(bar);drawBar(fr);
    fit(T(x+16,top+101,ps.label,11,ps.hex,true),bw*.4);
    fit(T(x+bw-16,top+101,ps.cur>=ps.rec?'Ready for the next stage':(ps.rec-ps.cur)+' Power to go',11,'#d4c4d7',false,1),bw*.53);
    if(ps.cur>prev){const gain=ps.cur-prev,pop=fit(T(x+68,top+65,'+'+gain+' ⚡',11,'#9ceac2',true),valueWidth,10),motion=this.hubMotionAllowed?.()!==false;
      if(motion&&this.tweens){const o={v:0};pt.setText(String(prev));drawBar(fr0);this.tweens.add({targets:o,v:1,duration:700,ease:'Cubic.out',onUpdate:()=>{if(!pt.active||this.state!=='menu'||this.menuScreen!=='gLoadout')return;pt.setFontSize(numberFont);fit(pt.setText(String(Math.round(prev+gain*o.v))),valueWidth,18);drawBar(fr0+(fr-fr0)*o.v);},onComplete:()=>{if(pt.active){pt.setText(String(ps.cur));drawBar(fr);}}});this.tweens.add({targets:pop,alpha:0,duration:300,delay:1800});}
      Sfx.menuCue?.('power_up',.35);
    }
    T(x+2,L.tipsY-15,'BEST NEXT STEPS',11,'#e9d6be',true);
    if(!tips.length){panel(x,L.tipsY,bw,tipH);const o=T(x+16,L.tipsY+tipH/2,'No Power upgrades available. Replay a stage for Sugar and gear.',12,'#d9cadb');o.setWordWrapWidth(bw-32);}
    tips.forEach((t,i)=>{const cy=L.tipYs[i],rowH=L.tipHeights[i],{gain,gainW,room,descY}=metrics[i],tx=x+60;
      panel(x,cy,bw,rowH,i===0);this.powerHubIcon(t.k==='weave'?'weave':t.k,x+29,cy+rowH/2,43);
      const title=T(tx,cy+10,t.title,13,'#fff3e6',true);title.setWordWrapWidth(room);title.setOrigin(0,0);
      // Measure complete cost/risk text first; long descriptions expand the row and scroll naturally.
      const sub=T(tx,cy+descY,t.sub,11,'#cfc1d4');sub.setWordWrapWidth(room);sub.setOrigin(0,0);
      fit(T(x+bw-27,cy+rowH/2,t.gain>0?'+'+gain:'',17,'#9ceac2',true,1),gainW-10,13);T(x+bw-12,cy+rowH/2,'›',21,'#ceb6cc',false,1);
      this._zone(x,cy,bw,rowH,()=>{Sfx.select?.();if(t.uid)this.gearSelectedUid=t.uid;this.menuScreen=t.go;this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='tip_'+t.k;
    });
    waiting.forEach((q,i)=>{const cw=(bw-gap*(L.waitCols-1))/L.waitCols,cx=x+(i%L.waitCols)*(cw+gap),cy=L.waitY+Math.floor(i/L.waitCols)*48;
      panel(cx,cy,cw,42);fit(T(cx+10,cy+21,q.label,11,'#e9d6be',true),cw-31);T(cx+cw-10,cy+21,'›',18,'#d6bad3',false,1);
      this._zone(cx,cy,cw,42,()=>{Sfx.select?.();this.menuScreen=q.go;this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='wait_'+q.k;
    });
    T(x+2,L.optionsY-15,'ALL POWER OPTIONS',11,'#e9d6be',true);
    rows.forEach(([target,title,kind],i)=>{const tw=(bw-gap*(L.cols-1))/L.cols,tx=x+(i%L.cols)*(tw+gap),ty=L.optionsY+Math.floor(i/L.cols)*(tileH+gap),size=Math.min(64,tileH-8,tw*.44);
      panel(tx,ty,tw,tileH);this.powerHubIcon(kind,tx+size/2+5,ty+tileH/2,size);fit(T(tx+size+5,ty+tileH/2,title,13,'#fff1e7',true),tw-size-23,11);T(tx+tw-10,ty+tileH/2,'›',19,'#ceb6cc',false,1);
      this._zone(tx,ty,tw,tileH,()=>{if(target==='merge'){this._mergeBack='gLoadout';this._mergeMain=null;}this.menuScreen=target;this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag=target;
      if(this.hasTargetBadge(target))this.drawBadgeDot(this.menu,tx+tw-9,ty+9);
      if(this.hasClaimableTarget(target))this.drawBadgeDot(this.menu,tx+tw-9,ty+9);else if(nxt&&nxt.group==='gLoadout'&&nxt.target===target){const mark=this.add.graphics();mark.lineStyle(1.5,0xf4d9a1,.85).strokeRoundedRect(tx+2,ty+2,tw-4,tileH-4,14);this.menu.add(mark);}
    });
    this.menu.setVisible(true);
  }

  // v8.0.32 เจ้าของ: 🔗 Merge แบบ Archero — หลัก + 2 ชิ้นช่อง/ระดับเดียวกัน → ระดับถัดไป · เลือกย้าย mod 1 อัน
  mergeMains(){ return (Save.data.gearItems||[]).filter(x=>Save.mergeCanMain(x)&&Save.mergeFodder(x).length>=2).sort((a,b)=>((Save.isGearEquipped(b.uid)?1:0)-(Save.isGearEquipped(a.uid)?1:0))||((b.itemLevel||1)-(a.itemLevel||1))); }
  buildMerge(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Merge','screen_gear_power_789',this._mergeBack||'gear');   /* v8.0.81 ธีม Power */
    const w=this.W,h=this.H,bw=Math.min(w-28,440),x=(w-bw)/2,hs=this._hdrShift?this._hdrShift():0,F='NunitoUI, sans-serif',RN=['common','rare','epic','legend'];
    const T=(tx,ty,t,sz,c,bold,ox=0,oy=.5)=>{const q=this.add.text(tx,ty,t,{fontFamily:F,fontStyle:bold?'bold':'normal',fontSize:sz+'px',color:c||'#fff'}).setOrigin(ox,oy);this.menu.add(q);return q;};
    const fit=(q,mw)=>{if(q.width>mw)q.setScale(mw/q.width);return q;};
    const mains=this.mergeMains();let main=Save.gearItem(this._mergeMain);
    if(!Save.mergeCanMain(main)){const s=Save.gearItem(this.gearSelectedUid);main=Save.mergeCanMain(s)&&Save.mergeFodder(s).length>=2?s:mains[0]||(Save.mergeCanMain(s)?s:null);this._mergeMain=main&&main.uid;this._mergeF=null;this._mergeCarry=undefined;}
    let y=(w<=h?92:70)+hs;
    { const sh=62; this.pwCard?.(x,y-14,bw,sh,false); this.pwArt?.('pw_hero_merge',x+bw-sh*.95,y-14+sh/2,sh*1.9,sh*.95)?.setAlpha(.3); const ic=this.pwIcon?.('rarity_up',x+30,y-14+sh/2,40),tx=ic?x+58:x+14; fit(T(tx,y+2,'Merge 3 items of the same slot and rarity',13,'#fff1e7',true),bw-(tx-x)-14); fit(T(tx,y+22,'→ 1 item of the next rarity (more mod slots)',11,'#cfc1d4',false),bw-(tx-x)-14); y+=sh+4; }
    if(!main){const g=this.add.graphics();g.fillStyle(0x261e30,.97).fillRoundedRect(x,y,bw,120,14).lineStyle(1,0x6d536d,.8).strokeRoundedRect(x,y,bw,120,14);this.menu.add(g);
      T(w/2,y+34,'Nothing to merge yet',16,'#ffffff',true,.5);T(w/2,y+60,'Collect 3 items of the same slot and rarity.',12,'#cdbfd8',false,.5);T(w/2,y+80,'Silver Chests in the Bazaar are a good source!',12,'#cdbfd8',false,.5);this.pwArt?.('pw_empty_merge',w/2,y+160,120,120);
      this.heroButton(x,y+136,(bw-8)/2,40,'🎒 Equipment',()=>{this.menuScreen='gear';this.buildMenuScreen();});this.heroButton(x+(bw+8)/2,y+136,(bw-8)/2,40,'🏪 Bazaar',()=>{this._bazTab='chests';this.menuScreen='bazaar';this.buildMenuScreen();});
      this.menu.setVisible(true);return;}
    const fod=Save.mergeFodder(main);let sel=(this._mergeF||[]).filter(u=>fod.some(f=>f.uid===u));if(!this._mergeF)sel=fod.slice(0,2).map(f=>f.uid);this._mergeF=sel;
    const fItems=sel.map(u=>fod.find(f=>f.uid===u)),from=gearGrade(main),to=GRADE_NEXT[from],tl=TIER_LABEL[from]||TIER_LABEL.common,tn=TIER_LABEL[to]||TIER_LABEL.common;
    const card=(cx,cy,cw,ch,it,title,col,objs)=>{const g=this.add.graphics(),b=it&&GEAR_ALL.find(q=>q.id===it.baseId),c=Phaser.Display.Color.HexStringToColor(col||tl.color).color;g.fillStyle(it?0x261e30:0x1d1726,.97).fillRoundedRect(cx,cy,cw,ch,14).lineStyle(2.4,it?c:0x5b4f6c,it?1:.7).strokeRoundedRect(cx,cy,cw,ch,14);this.menu.add(g);objs&&objs.push(g);const painted=it?this.menuRarityFrame?.(it,cx,cy,cw,ch,'rar_frame'):this.menuArtPanel?.('merge_slot_empty',0,cx,cy,cw,ch);if(painted){if(it)g.clear().fillStyle(0x2a2036,.97).fillRoundedRect(cx+3,cy+3,cw-6,ch-6,12);else g.clear();objs&&objs.push(painted);}
      const sz=Math.min(cw-20,ch-44);if(b){const k='gear_'+b.id,ic=this.textures.exists(k)?this.add.image(cx+cw/2,cy+8+sz/2,k):this.add.text(cx+cw/2,cy+8+sz/2,b.emoji||'🎁',{fontSize:Math.round(sz*.7)+'px'}).setOrigin(.5);if(ic.type==='Image')ic.setScale(sz/Math.max(ic.width,ic.height));this.menu.add(ic);objs&&objs.push(ic);
        const q=fit(T(cx+cw/2,cy+ch-26,'iLv '+(it.itemLevel||1)+(it.enhanceLv?' · +'+it.enhanceLv:''),11,'#e9dcff',true,.5),cw-8);objs&&objs.push(q);}
      else if(!painted){const q=T(cx+cw/2,cy+ch/2-8,'+',30,'#6f6283',true,.5);objs&&objs.push(q);}
      const q2=fit(T(cx+cw/2,cy+ch-11,title,10,it?(col||tl.color):painted?'#6b4a33':'#8f83a3',true,.5),cw-8);objs&&objs.push(q2);};
    // แถวบน: หลัก + วัตถุดิบ 2 ชิ้น
    const cw=Math.min(104,(bw-24)/3),ch=Math.round(cw*1.18),gx=(bw-cw*3)/2,fly=[[],[]],mainX=x;
    card(mainX,y,cw,ch,main,'MAIN',tl.color);
    if(mains.length>1){const i=Math.max(0,mains.findIndex(m=>m.uid===main.uid)),go=d=>{const m=mains[(i+d+mains.length)%mains.length];this._mergeMain=m.uid;this._mergeF=null;this._mergeCarry=undefined;Sfx.menuCue?.('merge_select')||Sfx.select?.();this.buildMerge();};
      this.heroButton(mainX,y+ch+4,cw/2-2,26,'‹',()=>go(-1),{fontSize:14});this.tapZones[this.tapZones.length-1].tag='merge_prev';this.heroButton(mainX+cw/2+2,y+ch+4,cw/2-2,26,'›',()=>go(1),{fontSize:14});this.tapZones[this.tapZones.length-1].tag='merge_next';}
    [0,1].forEach(k=>{const fx=x+cw+gx+k*(cw+gx);card(fx,y,cw,ch,fItems[k],fItems[k]?tl.name:'Material',tl.color,fly[k]);fly[k].forEach(o=>o._mdx=mainX-fx);if(fItems[k]){this._zone(fx,y,cw,ch,()=>{this._mergeF=sel.filter(u=>u!==fItems[k].uid);this._mergeCarry=undefined;Sfx.select?.();this.buildMerge();});this.tapZones[this.tapZones.length-1].tag='merge_slot_'+k;}});
    T(x+cw+gx/2,y+ch/2,'+',18,'#ffd166',true,.5);T(x+2*cw+gx*1.5,y+ch/2,'+',18,'#ffd166',true,.5);
    y+=ch+(mains.length>1?36:10);
    // ผลลัพธ์
    const res={baseId:main.baseId,slot:main.slot,grade:to,itemLevel:Math.max(main.itemLevel||1,...fItems.map(f=>f.itemLevel||1)),affixes:main.affixes},ln=it=>[0,1,2,3,4,5].filter(i=>forgeLineOpen(it,i)).length,base=GEAR_ALL.find(b=>b.id===main.baseId)||{name:main.baseId};
    {const rh=58,g=this.add.graphics(),c=Phaser.Display.Color.HexStringToColor(tn.color).color;g.fillStyle(0x423039,.97).fillRoundedRect(x,y,bw,rh,14).lineStyle(1.8,c,.95).strokeRoundedRect(x,y,bw,rh,14);this.menu.add(g);
      fit(T(x+14,y+18,'RESULT · '+base.name,13,'#ffffff',true),bw-28);const r1=T(x+14,y+40,tl.name,13,tl.color,true);const ar=T(x+18+r1.width,y+40,' → ',13,'#ffffff',true);T(x+18+r1.width+ar.width,y+40,tn.name,13,tn.color,true);
      T(x+bw-14,y+40,'iLv '+res.itemLevel+' · Mod slots '+ln(main)+' → '+ln(res),11,'#e9dcff',true,1);this._mergeRes={x,y,w:bw,h:rh};y+=rh+10;}
    // ย้าย mod 1 อัน
    const opts=sel.length===2?Save.mergeCarryOptions(main,fItems):[];if(this._mergeCarry===undefined)this._mergeCarry=opts[0]?{uid:opts[0].uid,id:opts[0].id}:null;
    if(opts.length){{ const ki=this.pwIcon?.('merge_keep',x+10,y+6,20); T(x+(ki?24:2),y+6,'KEEP 1 MOD FROM THE MATERIALS (tap to pick)',11,'#fff1e7',true); } y+=18;const rh=30;
      opts.slice(0,3).forEach(o=>{const d=affixDef(o.id),on=this._mergeCarry&&this._mergeCarry.uid===o.uid&&this._mergeCarry.id===o.id,g=this.add.graphics();g.fillStyle(on?0x423039:0x261e30,.97).fillRoundedRect(x,y,bw,rh,10).lineStyle(on?1.8:1,on?0xf4d9a1:0x6d536d,on?.95:.8).strokeRoundedRect(x,y,bw,rh,10);this.menu.add(g);
        T(x+12,y+rh/2,on?'✓':'○',14,on?'#ffd166':'#8f83a3',true);const st=tierStars(d,o.a.t);fit(T(x+32,y+rh/2,modLine(d,o.a.v),12,MOD_TIER_COLOR[st]||'#fff',true),bw-90);T(x+bw-12,y+rh/2,tierStarText(d,o.a.t),12,MOD_TIER_COLOR[st]||'#fff',true,1);
        this._zone(x,y,bw,rh,()=>{this._mergeCarry=on?null:{uid:o.uid,id:o.id};Sfx.select?.();this.buildMerge();});this.tapZones[this.tapZones.length-1].tag='merge_mod_'+o.id;y+=rh+4;});y+=4;}
    // รายการวัตถุดิบ
    {const sd=GEAR_SLOTS.find(q=>q.slot===main.slot)||{};T(x+2,y+6,'MATERIALS · '+tl.name+' '+(sd.label||sd.name||main.slot)+' ('+fod.length+')',11,'#fff1e7',true);}y+=18;
    if(!fod.length){T(x+2,y+8,'No more '+tl.name+' items for this slot — get more from chests and stages.',11,'#cdbfd8');y+=24;}
    const btnH=46,room=h-y-btnH-14,cols=5,gap=6,cs=Math.min(58,(bw-gap*(cols-1))/cols),rows=Math.max(1,Math.floor((room+gap)/(cs+gap))),show=fod.slice(0,cols*rows);
    show.forEach((f,i)=>{const cx=x+(i%cols)*(cs+gap),cy=y+Math.floor(i/cols)*(cs+gap),on=sel.includes(f.uid),b=GEAR_ALL.find(q=>q.id===f.baseId),g=this.add.graphics();g.fillStyle(0x261e30,.97).fillRoundedRect(cx,cy,cs,cs,10).lineStyle(on?1.8:1,on?0xf4d9a1:0x6d536d,on?.95:.8).strokeRoundedRect(cx,cy,cs,cs,10);this.menu.add(g);
      this.menuRarityFrame?.(f,cx,cy,cs,cs);const k=b&&'gear_'+b.id,ic=k&&this.textures.exists(k)?this.add.image(cx+cs/2,cy+cs/2-4,k):this.add.text(cx+cs/2,cy+cs/2-4,(b&&b.emoji)||'🎁',{fontSize:Math.round(cs*.42)+'px'}).setOrigin(.5);if(ic.type==='Image')ic.setScale((cs-20)/Math.max(ic.width,ic.height));this.menu.add(ic);
      T(cx+cs/2,cy+cs-8,'Lv'+(f.itemLevel||1),9,'#e9dcff',true,.5);if(on)T(cx+cs-6,cy+8,'✓',12,'#ffd166',true,1);
      this._zone(cx,cy,cs,cs,()=>{let s2=sel.slice();if(on)s2=s2.filter(u=>u!==f.uid);else{if(s2.length>=2)s2.pop();s2.push(f.uid);}this._mergeF=s2;this._mergeCarry=undefined;Sfx.menuCue?.('merge_select')||Sfx.select?.();this.buildMerge();});this.tapZones[this.tapZones.length-1].tag='merge_f_'+f.uid;});
    // ปุ่ม Merge
    const by=h-btnH-10,ready=sel.length===2&&!!to;
    this.heroButton(x,by,bw,btnH,ready?'🔗 Merge → '+tn.name:'Pick 2 materials',ready?()=>this.mergeNow(fly):null,{active:ready,disabled:!ready,fontSize:16});this.tapZones[this.tapZones.length-1].tag='merge_go';
    this.menu.setVisible(true);
  }
  mergeNow(fly){ if(this._mergeBusy)return; const main=Save.gearItem(this._mergeMain),sel=(this._mergeF||[]).slice(),carry=this._mergeCarry||null; if(!main||sel.length!==2)return;
    const done=()=>{ this._mergeBusy=false; const r=Save.mergeGear(main.uid,sel,carry); if(!r){Sfx.error?.();this.buildMerge();return;}
      this._adBase=null;this._mergeF=null;this._mergeCarry=undefined;this.gearSelectedUid=r.item.uid;try{Sfx.menuCue?.('merge_rarity_'+r.to,.5)||Sfx.craft?.();if(r.carried)this.time.delayedCall(300,()=>{if(this.state==='menu'&&this.menuScreen==='merge')Sfx.menuCue?.('merge_keep_mod',.3);});}catch(e){} this.screenFlash?.(Phaser.Display.Color.HexStringToColor((TIER_LABEL[r.to]||TIER_LABEL.common).color).color,.45,320);
      // Rarity cue already includes the Legend flourish.
      const keep=Save.mergeCanMain(r.item)&&Save.mergeFodder(r.item).length>=2;if(!keep)this._mergeMain=null; this.buildMerge();const fxY=this._mergeRes?this._mergeRes.y+this._mergeRes.h/2:this.H*.4;this.menuArtFx?.('vfx_merge_fuse',this.W/2,fxY,200,{tint:Phaser.Display.Color.HexStringToColor((TIER_LABEL[r.to]||TIER_LABEL.common).color).color});this.menuArtFx?.('vfx_rarity_up',this.W/2,fxY,160);
      const d=r.carried&&affixDef(r.carried); this.showBanner('🔗 Merged! '+(TIER_LABEL[r.from]||{}).name+' → '+(TIER_LABEL[r.to]||{}).name,d?'Kept mod: '+(d.label||r.carried):'iLv '+(r.item.itemLevel||1)+(r.item.enhanceLv?' · +'+r.item.enhanceLv:''),1600); };
    Sfx.menuCue?.('merge_fuse',.4);const objs=[].concat(...(fly||[])),R=this._mergeRes; if(!this.tweens||!objs.length||!R)return done(); this._mergeBusy=true;
    objs.forEach(o=>o.active&&this.tweens.add({targets:o,x:(o.x||0)+(o._mdx||0),alpha:.15,duration:260,ease:'Cubic.in'}));
    this.time.delayedCall(280,done); }
  buildHubGroup(key){
    if(key==='gLoadout')return this.buildGearPower();
    this.menu.removeAll(true); this.tapZones=[]; const grp=HUB_GROUPS[key]; const groupArt={gLoadout:'screen_group_gear',gActivity:'screen_group_activity',gCodex:'screen_group_codex',gMore:'screen_group_more'}; this._screenBg(grp.title,groupArt[key]);
    const w=this.W,h=this.H,portrait=w<=h,rows=grp.rows.filter(r=>featureOpen(r[0]));
    const bw=Math.min(w-28,440),x=(w-bw)/2,y0=portrait?116:92,gap=10,rh=Math.min(portrait?80:64,(h-y0-56-gap*(rows.length-1))/rows.length);
    // v4.25: หมวด Gear&Power — เปิด stats/upgrade (3 แก่น) ได้ตั้งแต่เริ่ม · gear/craft/bazaar/inbox ล็อกจนผ่านด่าน 1
    const nxtG=this.hubNextStep(), GATED=new Set(['gear','craft','bazaar','gearInbox']),afterS1=(Save.data.unlockedStage||0)>=1||!!Save.data.tutorialDone;   // v4.28: จบ tutorial = ปลดทุกอย่างในหมวดนี้
    if(grp.sections){ this._buildHubTiles(key,grp,nxtG,GATED,afterS1); return; }
    rows.forEach(([target,emoji,label,sub],i)=>{ const y=y0+i*(rh+gap);
      const kLock=target==='kitchen'&&!kitchenOpen(), locked=(GATED.has(target)&&!afterS1)||kLock;
      const g=this.add.graphics(); g.fillStyle(0x241a30,locked?0.7:0.96); g.fillRoundedRect(x,y,bw,rh,14); g.lineStyle(2,locked?0x4a4059:0x6a5b86,0.85); g.strokeRoundedRect(x,y,bw,rh,14); g.fillStyle(locked?0x4a4059:0x8f7de8,1); g.fillRoundedRect(x,y,7,rh,4);
      const ic=this.add.circle(x+40,y+rh/2,21,0x3a2f50,1).setAlpha(locked?0.5:1); const tk='tile_'+target, em=(M59_ROW[target]&&this.m59Img?.(M59_ROW[target],x+40,y+rh/2,48))||(this.textures.exists(tk)?this.add.image(x+40,y+rh/2,tk).setDisplaySize(50,50):this.add.text(x+40,y+rh/2,emoji,{fontSize:'22px'}).setOrigin(0.5)).setAlpha(locked?0.45:1);
      const nm=this.add.text(x+72,y+rh*0.34,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:locked?'#8d8399':'#ffffff'}).setOrigin(0,0.5);
      const ds=this.add.text(x+72,y+rh*0.68,locked?(kLock?'🔒 Clear Chapter 2 to unlock':'🔒 Clear Stage 1 to unlock'):sub,{fontFamily:'sans-serif',fontSize:'10px',color:locked?'#9a8fac':'#bfb5ca',wordWrap:{width:bw-160}}).setOrigin(0,0.5);
      const ar=this.add.text(x+bw-16,y+rh/2,locked?'🔒':'›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#cbb8e0'}).setOrigin(1,0.5);
      this.menu.add([g,ic,em,nm,ds,ar]);
      if(!locked&&this.hasTargetBadge(target))this.drawBadgeDot(this.menu,x+13,y+13);
      if(!locked&&this.hasClaimableTarget(target))this._drawNextGuide(x,y,bw,rh,'Reward ready');
      else if(!locked&&nxtG&&nxtG.group===key&&nxtG.target===target)this._drawNextGuide(x,y,bw,rh,nxtG.tag);
      this._zone(x,y,bw,rh,()=>{ if(locked){Sfx.select();this.menuToast&&this.menuToast(kLock?'🔒 Kitchen unlocks after clearing Chapter 2':'🔒 Clear Stage 1 of Chapter 1 to unlock this');return;}
        if(target==='__tutorial'){ this.startTutorial(()=>{this.state='menu';this.menu.setVisible(true);this.menuScreen='hub';this.buildMenuScreen();},true); }
        else { if(target==='skills'){this._skillArchiveTab='attack';this._skillArchivePage=0;this._skillArchiveSelected=null;} this.menuScreen=target; this.buildMenuScreen(); } }); this.tapZones[this.tapZones.length-1].tag=this.tapZones[this.tapZones.length-1].tag||'row_'+target;
    });
    this.menu.setVisible(true);
  }
  // v5.48: เลย์เอาต์ไทล์แบ่งหมวด (Gear & Power)
  _buildHubTiles(key,grp,nxtG,GATED,afterS1){
    const w=this.W,h=this.H,portrait=w<=h,bw=Math.min(w-28,440),x0=(w-bw)/2,gap=10,cols=portrait?2:4;
    grp={...grp,sections:grp.sections.map(sc=>[sc[0],sc[1],sc[2].filter(t=>featureOpen(t[0]))]).filter(sc=>sc[2].length)};
    const tw=(bw-gap*(cols-1))/cols; let nRows=0; grp.sections.forEach(s=>nRows+=Math.ceil(s[2].length/cols));
    const y0=portrait?112:88,hdrH=26,avail=h-y0-30-grp.sections.length*hdrH-gap*nRows;
    const th=Math.max(62,Math.min(portrait?104:80,avail/nRows)); let y=y0;
    grp.sections.forEach(([title,col,tiles])=>{
      const hx=this.add.text(x0+4,y+hdrH/2,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#'+col.toString(16).padStart(6,'0')}).setOrigin(0,0.5);
      const ln=this.add.rectangle(x0+hx.width+14,y+hdrH/2,bw-hx.width-14,1,col,0.35).setOrigin(0,0.5); this.menu.add([hx,ln]); y+=hdrH;
      tiles.forEach(([target,emoji,label],i)=>{
        const c=i%cols,r=Math.floor(i/cols),span=(tiles.length===1)?cols:1,ww=span>1?bw:tw;
        const x=x0+c*(tw+gap),ty=y+r*(th+gap),locked=GATED.has(target)&&!afterS1;
        const g=this.add.graphics(); g.fillStyle(0x241a30,locked?0.7:0.96); g.fillRoundedRect(x,ty,ww,th,16);
        g.lineStyle(2,locked?0x4a4059:col,locked?0.8:0.55); g.strokeRoundedRect(x,ty,ww,th,16);
        const horiz=span>1; const icx=horiz?x+44:x+ww/2, icy=horiz?ty+th/2:ty+th*0.4;
        const ic=this.add.circle(icx,icy,Math.min(24,th*0.26),0x3a2f50,1).setAlpha(locked?0.5:1);
        const tk='tile_'+target, em=(this.textures.exists(tk)?this.add.image(icx,icy,tk).setDisplaySize(Math.min(58,th*0.62),Math.min(58,th*0.62)):this.add.text(icx,icy,emoji,{fontSize:'24px'}).setOrigin(0.5)).setAlpha(locked?0.45:1);
        const nm=this.add.text(horiz?x+80:x+ww/2,horiz?ty+th/2:ty+th*0.78,locked?'🔒 '+label:label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:locked?'#8d8399':'#ffffff'}).setOrigin(horiz?0:0.5,0.5);
        this.menu.add([g,ic,em,nm]);
        if(horiz){ const ar=this.add.text(x+ww-16,ty+th/2,'›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#cbb8e0'}).setOrigin(1,0.5); this.menu.add(ar); }
        if(!locked&&this.hasTargetBadge(target))this.drawBadgeDot(this.menu,x+12,ty+12);
        if(!locked&&this.hasClaimableTarget(target))this._drawNextGuide(x,ty,ww,th,'Reward ready');
        else if(!locked&&nxtG&&nxtG.group===key&&nxtG.target===target)this._drawNextGuide(x,ty,ww,th,nxtG.tag);
        this._zone(x,ty,ww,th,()=>{ if(locked){Sfx.select();this.menuToast&&this.menuToast('🔒 Clear Stage 1 of Chapter 1 to unlock this');return;}
          this.menuScreen=target; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag=target;
      });
      y+=Math.ceil(tiles.length/cols)*(th+gap);
    });
    this.menu.setVisible(true);
  }
  // หน้าUpdates/ดาวน์โหลด — โชว์เวอร์ชันปัจจุบัน + บันทึกUpdates + ลิงก์ดาวน์โหลดแอป
  buildNews(){
    if(Save.data.seenVersion!==GAME_VERSION){ Save.data.seenVersion=GAME_VERSION; Save.save(); }   // เปิดดูข่าว = Cleared badge Updates
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Updates','screen_news');
    const w=this.W,h=this.H;
    const hs=this._hdrShift();
    /* v8.3.14 เจ้าของ: แอป Store รู้ว่ามีเวอร์ชันใหม่ → บอกในหน้านี้ + ปุ่มสีทองกระพริบ · ปุ่มโหลด APK แบบ Store (เดิมโหลด debug APK ผิดตัว) */
    const st=!!this._isStoreApp,nv=st&&this._storeLatest&&verNewer(this._storeLatest,GAME_VERSION)?this._storeLatest:null; if(st)this.storeUpdateTick?.();
    const cur=this.add.text(w/2,53+hs,'Current version v'+GAME_VERSION+(nv?'  ·  v'+nv+' available':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:nv?'#9dffc0':'#ffe08a'}).setOrigin(0.5);
    this.menu.add(cur);
    // ปุ่มดาวน์โหลด APK (เปิดหน้า releases ในเบราว์เซอร์)
    const dlW=Math.min(w-40,250),dx=w/2-dlW/2,dy=65+hs,dlH=34;
    const dg=this.add.graphics(); dg.fillStyle(nv?0xffd166:COLORS.mint,1); dg.fillRoundedRect(dx,dy,dlW,dlH,11); dg.lineStyle(nv?3:2,0xffffff,nv?0.85:0.3); dg.strokeRoundedRect(dx,dy,dlW,dlH,11);
    const dt=this.add.text(w/2,dy+dlH/2,nv?'📥 Download v'+nv+' now':'📥 Download latest APK',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:nv?'#3a2600':'#12331f'}).setOrigin(0.5);
    this.menu.add([dg,dt]); if(nv&&this.tweens)this.tweens.add({targets:[dg,dt],alpha:.6,duration:650,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const dlUrl=st?STORE_APK_URL:RELEASES_URL; this._zone(dx,dy,dlW,dlH,()=>{ try{ const B=window.Capacitor?.Plugins?.Browser; if(B)B.open({url:dlUrl}); else window.open(dlUrl,'_blank'); }catch(e){ try{window.open(dlUrl,'_blank');}catch(_){} } });
    const portrait=w<=h, cols=portrait?1:3, gap=portrait?8:9, y=portrait?116+hs:110;
    const cw=portrait?w-28:(w-28-gap*2)/3;
    // v4.52: แบ่งหน้าดู CHANGELOG ทั้งหมดย้อนหลังได้ (เดิมโชว์แค่ 3 อันล่าสุด) — 3 การ์ด/หน้า + ปุ่ม ‹ › เลื่อน
    const navH=26, perPage=3, pages=Math.max(1,Math.ceil(CHANGELOG.length/perPage));
    this.newsPage=Math.max(0,Math.min(pages-1,this.newsPage||0));
    const rows=portrait?perPage:1;
    const cardH=portrait?Math.max(104,Math.min(170,(h-y-18-navH-gap*2)/rows)):h-y-12-navH;
    const start=this.newsPage*perPage;
    CHANGELOG.slice(start,start+perPage).forEach((c,i)=>{
      const cx=14+(i%cols)*(cw+gap), cy=y+Math.floor(i/cols)*(cardH+gap),g=this.add.graphics();g.fillStyle(0x2c2338,0.94);g.fillRoundedRect(cx,cy,cw,cardH,12);g.lineStyle(1.5,0x4a4059,0.9);g.strokeRoundedRect(cx,cy,cw,cardH,12);this.menu.add(g);
      const head=this.add.text(cx+12,cy+10,'v'+c.v+' · '+c.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:portrait?'12px':'11px',color:'#ff9ec4',wordWrap:{width:cw-24}}).setOrigin(0,0);
      const dd=this.add.text(cx+cw-12,cy+12,c.date,{fontFamily:'sans-serif',fontSize:'9px',color:'#7a7088'}).setOrigin(1,0);this.menu.add([head,dd]);
      let iy=cy+36;c.items.slice(0,portrait?3:4).forEach(it=>{const short=it.length>80?it.slice(0,79)+'…':it;const li=this.add.text(cx+12,iy,'• '+short,{fontFamily:'sans-serif',fontSize:portrait?'10px':'8.5px',color:'#c7bdd6',wordWrap:{width:cw-24}}).setOrigin(0,0);this.menu.add(li);iy+=li.height+5;});
    });
    // แถบเลื่อนหน้า ‹ N / total ›
    const navY=h-navH-8;
    const mk=(cx,label,enabled,fn)=>{const bw=46,g=this.add.graphics();g.fillStyle(enabled?0x463653:0x28212e,1);g.fillRoundedRect(cx-bw/2,navY,bw,navH,9);g.lineStyle(1,enabled?0xa98cf0:0x44394d,1);g.strokeRoundedRect(cx-bw/2,navY,bw,navH,9);const t=this.add.text(cx,navY+navH/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:enabled?'#f5eaff':'#665d70'}).setOrigin(0.5);this.menu.add([g,t]);if(enabled)this._zone(cx-bw/2,navY,bw,navH,fn);};
    mk(w/2-70,'‹',this.newsPage>0,()=>{this.newsPage--;this.buildNews();});
    const pt=this.add.text(w/2,navY+navH/2,(this.newsPage+1)+' / '+pages,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#d4c6df'}).setOrigin(0.5);this.menu.add(pt);
    mk(w/2+70,'›',this.newsPage<pages-1,()=>{this.newsPage++;this.buildNews();});
    this.menu.setVisible(true);
  }
  // 🍳 สมุดสูตร — โชว์สูตร (COMBOS) แยกตามตัวละคร · ค้นพบแล้ว (Save.cookbook) / ยังไม่พบ / Signature Recipe ⭐
  buildBestiary(){   // v8.0.30 เจ้าของ: 3 ขั้น (พบ/100/1,000 · บอส 1/5/25) · ขั้น 3 = เกร็ด + จุดอ่อน +5% · เรียงตามด่าน · แตะดูรายละเอียด
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('📖 Bestiary','screen_bestiary');
    const w=this.W,h=this.H,hs=this._hdrShift(),L=BESTIARY.slice().sort((x,y)=>x.ord-y.ord),seen=L.filter(m=>Save.kills(m.id)>0).length,weak=L.filter(m=>bestiaryLv(m.id)>=BEST_MAX_TIER).length;
    const paperAreas=[];const T=(x,y,t,sz,c,st,ox=0,oy=0)=>{const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:paperAreas.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)?this.menuArtInk(c):c||'#fff'}).setOrigin(ox,oy);this.menu.add(q);return q;};
    T(w/2,48+hs,'Found '+seen+' / '+L.length+' · Weak spots '+weak+' · 💭 '+(Save.data.memories|0)+' Memories',11,'#ffe08a','bold',.5,.5);
    T(w/2,63+hs,'Tiers: first sight · 100 · 1,000 defeats (bosses 1/5/25) · each tier gives 💭 · Tier 3 opens the Codex',8.5,'#8bd3ff','normal',.5,.5);
    const portrait=w<=h,cols=portrait?2:3,gap=7,cardW=(w-28-gap*(cols-1))/cols,rows=portrait?6:3,perPage=cols*rows,pages=Math.max(1,Math.ceil(L.length/perPage));
    if(this._bestFocus){ const k=L.findIndex(m=>m.id===this._bestFocus); if(k>=0)this._bestPage=Math.floor(k/perPage); this._bestFocus=null; }
    this._bestPage=Phaser.Math.Clamp(this._bestPage||0,0,pages-1);
    const items=L.slice(this._bestPage*perPage,this._bestPage*perPage+perPage),y0=portrait?(78+hs):72,cardH=Math.min(portrait?84:80,(h-y0-46-gap*(rows-1))/rows);
    this._bestArtQueued=this._bestArtQueued||new Set();let queued=false;
    for(const m of items){if(!m.tex||!m.tex.startsWith('codex_c3_')||this.textures.exists(m.tex)||this._bestArtQueued.has(m.tex))continue;
      this._bestArtQueued.add(m.tex);queued=true;
      this.load.once('filecomplete-image-'+m.tex,()=>{if(this.state!=='menu'||this.menuScreen!=='bestiary'||this._bestArtRebuild)return;
        this._bestArtRebuild=true;this.time.delayedCall(80,()=>{this._bestArtRebuild=false;if(this.state==='menu'&&this.menuScreen==='bestiary')this.buildBestiary();});});
      this.load.image(m.tex,verUrl(ASSET_IMAGES[m.tex]));}
    if(queued&&!this.load.isLoading())this.load.start();
    const icon=(m,x,y,sz,dark)=>{if(dark){const unknown=this.menuArtIcon?.('bs_unknown',0,x,y,sz);if(unknown)return unknown;} const has=m.tex&&this.textures.exists(m.tex),o=has?this.add.image(x,y,m.tex,ASSET_SHEETS[m.tex]?0:undefined):this.add.text(x,y,dark?'❔':m.emoji,{fontSize:Math.round(sz*.75)+'px'}).setOrigin(.5); if(has){ o.setScale(sz/Math.max(o.width,o.height)); if(dark)o.setTint(0x000000).setAlpha(.7); } this.menu.add(o); return o; };
    items.forEach((m,idx)=>{ const cx=14+(idx%cols)*(cardW+gap),cy=y0+Math.floor(idx/cols)*(cardH+gap),k=Save.kills(m.id),lv=bestiaryLv(m.id),tiers=bestiaryTiers(m.id),found=k>0,max=lv>=BEST_MAX_TIER,g=this.add.graphics();
      g.fillStyle(found?0x2c2338:0x1a1520,1).fillRoundedRect(cx,cy,cardW,cardH,12).lineStyle(2,max?0xffd166:found?0x4a4059:0x2f283a,1).strokeRoundedRect(cx,cy,cardW,cardH,12); if(max){ g.fillStyle(0xffd166,.08).fillRoundedRect(cx,cy,cardW,cardH,12); } this.menu.add(g);const paperCard=!!this.menuArtPanel?.('bs_card',!found?2:/^(boss|mini)/.test(m.id)?1:0,cx,cy,cardW,cardH);if(paperCard){g.clear();paperAreas.push({x:cx,y:cy,w:cardW,h:cardH});}const textX=paperCard?cx+cardW*.49:cx+46,textRoom=paperCard?cardW*.51-8:cardW-52;
      icon(m,paperCard?cx+cardW*.24:cx+24,paperCard?cy+cardH*.49:cy+26,paperCard?Math.min(cardH*.6,cardW*.34):portrait?34:30,!found);
      const nm=T(textX,cy+10,found?m.name:'???',10.5,found?'#ffffff':'#6f6680','bold'); if(nm.width>textRoom)nm.setScale(textRoom/nm.width);
      const info=T(textX,cy+26,found?STAGE_LABEL(Math.min(14,m.stage))+' · '+(/^boss/.test(m.id)?'Boss':/^mini/.test(m.id)?'Miniboss':'Field'):'Not met yet',8.5,'#a89cb6');if(info.width>textRoom)info.setScale(textRoom/info.width);
      const px=paperCard?textX:cx+8,pw=paperCard?Math.min(16,(textRoom-8)/3):(cardW-16-8)/3,py=cy+cardH-22; for(let t=0;t<3;t++){ const on=lv>t,pg=this.add.graphics(); pg.fillStyle(on?[0x8bd3a0,0x7fc9ff,0xffd166][t]:0x120d18,1).fillRoundedRect(px+t*(pw+4),py,pw,6,3); this.menu.add(pg);const pip=this.menuArtIcon?.('bs_tier_pip',on?(t===2?2:1):0,px+t*(pw+4)+pw/2,py+3,14);if(pip)pg.clear(); }
      const next=lv<3?tiers[lv]:null; const foot=T(paperCard?textX:cx+8,cy+cardH-12,next?(k+' / '+next):paperCard?'Weak spot +5%':'★ Weak spot +5% dmg',8,max?'#ffe08a':'#b7abc9','bold');if(paperCard&&foot.width>textRoom)foot.setScale(textRoom/foot.width);
      this._zone(cx,cy,cardW,cardH,()=>{ this._bestSel=m.id; Sfx.select&&Sfx.select(); this.buildBestiary(); }); this.tapZones[this.tapZones.length-1].tag='best_'+m.id; });
    this._codexNav(this._bestPage,pages,()=>{this._bestPage--;this.buildBestiary();},()=>{this._bestPage++;this.buildBestiary();});
    // รายละเอียด (แตะการ์ด)
    const sel=this._bestSel&&L.find(m=>m.id===this._bestSel);
    if(sel){ const bossStory=/^boss\d+$/.test(sel.id)&&Save.kills(sel.id)>0&&typeof BOSS_STORIES!=='undefined'&&BOSS_STORIES[sel.stage]; const k=Save.kills(sel.id),lv=bestiaryLv(sel.id),tiers=bestiaryTiers(sel.id),found=k>0,pw=Math.min(w-28,380),ph=Math.min(h-120,this.tuHas?.('bs_detail_panel')?420:330),px=(w-pw)/2,py=Math.max(70,(h-ph)/2),dim=this.add.rectangle(0,0,w,h,0x07040c,.78).setOrigin(0); dim._menuBackdrop=true; this.menu.add(dim);
      const g=this.add.graphics(); g.fillStyle(0x241a30,1).fillRoundedRect(px,py,pw,ph,18).lineStyle(2.5,lv>=3?0xffd166:0x8f7de8,1).strokeRoundedRect(px,py,pw,ph,18); this.menu.add(g);if(this.menuArtPanel?.('bs_detail_panel',0,px,py,pw,ph)){g.clear();paperAreas.push({x:px,y:py,w:pw,h:(ph>=360?ph*.45:96)+60});}
      icon(sel,px+46,py+48,64,!found); T(px+90,py+26,found?sel.name:'???',16,'#ffffff','bold'); T(px+90,py+50,found?sel.desc:'Defeat it once to learn more',10,'#cfc2d5'); T(px+90,py+66,'Defeated: '+k,10,'#ffe08a','bold');
      let yy=py+(this.tuHas?.('bs_detail_panel')&&ph>=360?ph*.45:96); ['First sight','Tier 2','Tier 3'].forEach((lab,t)=>{ const on=lv>t; T(px+18,yy,(on?'✓ ':'○ ')+lab+' · '+tiers[t]+(tiers[t]===1?' defeat':' defeats'),11,on?'#8bffb4':'#a89cb6','bold'); T(px+pw-18,yy,'🍬 '+BEST_TIER_SUGAR[t],11,on?'#8bffb4':'#a89cb6','bold',1); yy+=20; });
      yy+=6; const lg=this.add.graphics(); lg.fillStyle(lv>=3?0x3a2f18:0x1a1520,1).fillRoundedRect(px+12,yy,pw-24,ph-(yy-py)-52,12); this.menu.add(lg);
      if(lv>=3){this.menuArtIcon?.('bs_weak',0,px+pw-26,yy+16,18); T(px+24,yy+12,'📜 Monster note',11,'#ffe08a','bold'); const lt=this.add.text(px+24,yy+30,sel.lore,{fontFamily:'sans-serif',fontSize:'11px',color:'#fff5dd',wordWrap:{width:pw-48}}); this.menu.add(lt); T(px+24,yy+36+lt.height,'⚔️ Weak spot: +'+Math.round((BEST_WEAK_MUL-1+codexLv(sel.id)*CODEX_STEP)*100)+'% damage to '+sel.name,11,'#8dffb0','bold'); }
      else T(px+pw/2,yy+(ph-(yy-py)-52)/2,'🔒 Reach Tier 3 to learn its weak spot\n(+5% damage to this monster)',11,'#a89cb6','bold',.5,.5).setAlign('center');
      const bw=bossStory?110:120,bx=bossStory?px+18:w/2-bw/2,by=py+ph-42,bb=this.add.graphics(); const cdx=lv>=BEST_MAX_TIER?{lv:codexLv(sel.id),cost:codexCost(sel.id),have:Save.data.memories|0}:null; if(cdx){ const uw=Math.min(pw-36,240),ux=w/2-uw/2,uy=by-40,full=cdx.lv>=CODEX_MAX,ok=!full&&cdx.have>=cdx.cost,ug=this.add.graphics(); ug.fillStyle(ok?0x6a4a1e:0x2f2638,1).fillRoundedRect(ux,uy,uw,32,10).lineStyle(1.4,ok?0xffd166:0x6d536d,1).strokeRoundedRect(ux,uy,uw,32,10); this.menu.add(ug); T(ux+uw/2,uy+16,full?'📖 Codex Lv '+CODEX_MAX+' · weak spot +'+Math.round((BEST_WEAK_MUL-1+CODEX_MAX*CODEX_STEP)*100)+'%':'📖 Codex Lv '+cdx.lv+' → '+(cdx.lv+1)+' · 💭'+cdx.cost+' ('+cdx.have+')',11,ok?'#ffe7b0':'#a89cb6','bold',.5,.5); sel._cdxRect={x:ux,y:uy,w:uw,h:32}; if(cdx.lv>0&&this.textures.exists('codex_badges')){ const b=this.add.sprite(ux-4,uy+16,'codex_badges',Math.min(4,cdx.lv-1)).setDisplaySize(30,30); this.menu.add(b); } else if(this.textures.exists('ic_memory_book')){ const b=this.add.image(ux-4,uy+16,'ic_memory_book').setDisplaySize(26,26); this.menu.add(b); } }   /* v8.1.93 ใบ 73 */ else sel._cdxRect=null;   /* v8.1.87 Memory Book */ bb.fillStyle(0x3c3048,1).fillRoundedRect(bx,by,bw,32,10).lineStyle(1.4,0xa98cf0,1).strokeRoundedRect(bx,by,bw,32,10); this.menu.add(bb); T(bx+bw/2,by+16,'Close',12,'#ffffff','bold',.5,.5);
      this.tapZones=[]; this._zone(0,0,w,h,()=>{ this._bestSel=null; this.buildBestiary(); }); const z=this.tapZones[this.tapZones.length-1]; z.noBounce=true; z.tag='best_close'; z.back=true; if(sel._cdxRect){ z.back=false; const R=sel._cdxRect; this._zone(R.x,R.y,R.w,R.h,()=>this.codexUpgrade(sel.id)); this.tapZones[this.tapZones.length-1].tag='codex_up'; }
      if(bossStory){z.back=false;const sx=px+pw-128,sw=110,sg=this.add.graphics();sg.fillStyle(0x67422c,1).fillRoundedRect(sx,by,sw,32,10).lineStyle(1,0xffd590,1).strokeRoundedRect(sx,by,sw,32,10);this.menu.add(sg);T(sx+sw/2,by+16,'Read story',12,'#fff1d4','bold',.5,.5);this.tapZones.push({x:sx,y:by,w:sw,h:32,tag:'best_story',noBounce:true,fn:()=>this.openBossStoryPanel(sel.stage,{name:sel.name,replay:true})});} }

    this.menu.setVisible(true);
  }
  // คำนวณสแตตจริงของ loadout (base + char + weapon + Flavor Weave + gear + bestiary + perks) โดยไม่แตะ player จริง
  previewStats(){ return computeHeroStats(Save.data.character,this.basicAttack); }
  buildStats(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Heroes · Stats','screen_heroes');this.drawHeroesTabs();
    const w=this.W,p=this.previewStats(),ch=CHARACTERS[Save.data.character]||CHARACTERS.momo,pow=Save.power(Save.data.character);
    let y=this.heroesContentTop()+18;
    const hd=this.add.text(w/2,y,ch.emoji+' '+ch.name+'  ·  ⚡ Power '+pow,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffd9a8'}).setOrigin(0.5); y+=16;
    const note=this.add.text(w/2,y,'Your equipped loadout',{fontFamily:'NunitoUI, sans-serif',fontSize:'10px',color:'#cbbfd4'}).setOrigin(0.5); this.menu.add([hd,note]); y+=22;
    const rows=[
      ['💥','Attack Power',Math.round(p.dmgMul*100)+'','Power ×'+(p.powerMul||1).toFixed(2)+' · ATK '+(p.gearAttackMin||0)+'-'+(p.gearAttackMax||0),0xff8f5a],
      ['🎯','Crit Chance',Math.round(p.critChance*100)+'%','×'+p.critMul.toFixed(2)+' crit damage',0xffd166],
      ['⏱️','Cooldown',Math.round((1-p.cdMul)*100)+'% faster','skill cooldown ×'+p.cdMul.toFixed(2),0xb388ff],
      ['❤️','Max HP',Math.round(p.maxhp)+'','',0xff5f7a],
      ['🛡️','Defense',Math.round((1-p.dmgTakenMul*armorDamageMultiplier(p))*100)+'% less','Armor '+(p.armor||0)+' · armor reduction '+Math.round((1-armorDamageMultiplier(p))*100)+'%',0x6ec6ff],
      ['💗','Regen',((p.regen||0)+(p.regenFlat||0)).toFixed(1)+' /s','',0x66d3b3],
      ['👟','Move Speed',Math.round(p.baseSpeed)+'','',0x8bd3a0],
    ];
    // v4.65: แนวตั้งมีที่เหลือเยอะ → ใส่อาร์ตตัวละครด้านบน แล้วขยายแถวให้เต็มจอ
    const portrait=w<=this.H,gap=6,cardW=w-28;
    if(portrait){ const artH=Math.min(260,Math.max(0,this.H-y-rows.length*(40+gap)-40)); if(artH>120){ this._characterCardArt(Save.data.character,w/2,y+artH/2,w*0.7,artH); y+=artH+8; } }
    const rh=portrait?Phaser.Math.Clamp((this.H-y-36-gap*(rows.length-1))/rows.length,44,58):44;
    const keys=['dmgMul','critChance','cdMul','maxhp','dmgTakenMul','regen','baseSpeed'];   // v6.55.25: เรียงตามสูตร — โจมตี → ป้องกัน → เคลื่อนที่
    const statArt=['attack','crit','cooldown','hp','defense','regen','speed'];
    rows.forEach((r,i)=>{const ry=y+i*(rh+gap),g=this.add.graphics(),frame=this.menuRasterPanel('mui_stat_frame_'+statArt[i],14,ry,cardW,rh);this._zone(14,ry,cardW,rh,()=>{Sfx.select&&Sfx.select();this.showStatSources(p,keys[i],r);});this.tapZones[this.tapZones.length-1].tag='stat_'+keys[i];
      if(!frame){g.fillStyle(0x232738,.96).fillRoundedRect(14,ry,cardW,rh,12);g.lineStyle(1.2,r[4],.55).strokeRoundedRect(14,ry,cardW,rh,12);g.fillStyle(r[4],.24).fillRoundedRect(15,ry+1,6,rh-2,3);}
      const em=this.menuRasterIcon('mui_stat_icon_'+statArt[i],36,ry+rh/2,34)||this.add.text(34,ry+rh/2,r[0],{fontSize:'21px'}).setOrigin(.5);
      const nm=this.add.text(62,ry+rh/2,r[1],{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#fff0e3'}).setOrigin(0,.5);
      const val=this.add.text(w-56,ry+rh/2,r[2],{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffffff'}).setOrigin(1,.5);
      let nf=13;while(nm.width>val.x-val.width-72&&nf>10)nm.setFontSize(--nf+'px');
      const inf=this.menuRasterIcon('mui_stat_icon_info',w-34,ry+rh/2,24)||this.add.text(w-34,ry+rh/2,'!',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ddd1ee'}).setOrigin(.5);this.menu.add([g,em,nm,val,inf]);});
    this.menu.add(this.add.text(w/2,y+rows.length*(rh+gap)+6,'Tap a stat for sources',{fontFamily:'NunitoUI, sans-serif',fontSize:'10px',color:'#cbbfd4'}).setOrigin(.5));
    this.menu.setVisible(true);
  }
  // v6.55.24: แผงที่มาของสแตต — จัดกลุ่ม + ไอคอน + % สัดส่วน (Pareto) + สูตรอ่านง่าย
  showStatSources(p,key,row){
    const tr=p._trace||[],w=this.W,h=this.H;
    const GROUPS=[{id:'hero',icon:'🧬',name:'Hero',test:l=>/^(Base|Hero profile|Signature weapon|Talent|Path talents)/.test(l),col:'#ffb3c7'},
      {id:'weave',icon:'✦',name:'Temple',test:l=>/^(Weave|Special Cores)/.test(l),col:'#ffd166'},
      {id:'gear',icon:'⚔️',name:'Gear',test:l=>/^(Gear|Mod|Set)/.test(l),col:'#9fd8ff'},
      {id:'prog',icon:'🏆',name:'Progress',test:l=>/^(Bestiary|Perk|Ancient)/.test(l),col:'#b9f0a8'},
      {id:'cap',icon:'🔒',name:'Limits',test:()=>true,col:'#b0a6bf'}];
    // ค่าที่ "นับได้" ต่อแหล่ง (หน่วยเดียวกันทั้งตาราง) เพื่อคิด % สัดส่วน
    const val=s=>key==='dmgTakenMul'?(1-s.dmgTakenMul*100/(100+Math.max(0,s.armor||0)))*100:key==='cdMul'?(1-s.cdMul)*100:key==='dmgMul'||key==='critChance'?s[key]*100:s[key];
    const unit=key==='maxhp'||key==='baseSpeed'?'':key==='regen'?'/s':'%';
    const fmt=v=>(v>0?'+':v<0?'−':'')+(key==='regen'?Math.abs(v).toFixed(1):Math.round(Math.abs(v)*10)/10)+unit;
    const items=[];if(tr[0])items.push({label:'Base',v:val(tr[0].s),base:true});
    for(let i=1;i<tr.length;i++){const d=val(tr[i].s)-val(tr[i-1].s);if(Math.abs(d)>1e-6)items.push({label:tr[i].label,v:d});}
    const posSum=items.reduce((a,it)=>a+(it.base?0:Math.max(0,it.v)),0)||1;let top=null;for(const it of items)if(!it.base&&it.v>0&&(!top||it.v>top.v))top=it;   // share = สัดส่วนของโบนัส (ไม่รวม Base)
    const lines=[],bIt=items.find(it=>it.base);if(bIt)bIt._g=1;   // v6.55.27: ซ่อนค่าเริ่มต้น (เจ้าของ: ไม่จำเป็น) — อยู่ในกล่องสูตรแทน
    lines.push({step:true,label:key==='dmgMul'||key==='critChance'||key==='regen'?'①  + Bonuses (added together)':key==='maxhp'?'①  + Flat, then × %':'①  × Bonuses (multiplied)'});
    GROUPS.forEach(g=>{const its=items.filter(it=>!it._g&&g.test(it.label));if(!its.length)return;its.forEach(it=>it._g=1);const sub=its.reduce((a,it)=>a+it.v,0),bsub=its.reduce((a,it)=>a+(it.base?0:Math.max(0,it.v)),0);
      lines.push({hdr:true,g,label:g.icon+'  '+g.name,v:sub,pct:bsub/posSum*100});its.sort((a,b)=>(a.base?-1:b.base?1:b.v-a.v)).forEach(it=>lines.push({g,label:it.base?'Hero base':it.label.replace(/^(Talent|Weave|Gear|Mod|Set collection|Set|Perk) · /,''),v:it.v,base:it.base,pct:it.base?0:Math.max(0,it.v)/posSum*100,top:it===top}));});
    const FORM={dmgMul:'Hit = Weapon damage × Attack Power% × Item Power × Crit (if crit) × more bonuses\nAttack Power starts at 100% and every “+%” source adds together (increased), then multiplies the hit once.',
      maxhp:'Max HP = Base 90 + flat HP sources, then × % HP sources (Vigor, Resolve, Ancient).',
      critChance:'Crit chance = sum of all crit % · Crit hit = damage × Crit damage ('+'×'+p.critMul.toFixed(2)+')',
      dmgTakenMul:'Damage taken = Hit × 100/(100+Armor) × each “less damage” source multiplied together.\nArmor gives less and less as it grows — never reaches 100%.',
      baseSpeed:'Speed = Base × each % speed source multiplied.',cdMul:'Cooldown = Base cooldown × each “faster” source multiplied.',regen:'Regen = sum of all HP/s sources.'};
    const multi=[];if(key==='dmgMul'&&(p.powerMul||1)!==1)multi.push({note:true,label:'⚡ Weapon Item Power ×'+p.powerMul.toFixed(2)+' (multiplies separately)'});
    if(key==='critChance')multi.push({note:true,label:'💥 Crit damage ×'+p.critMul.toFixed(2)});
    if(key==='dmgTakenMul')multi.push({note:true,label:'🛡️ Armor '+Math.round(p.armor||0)+' → −'+Math.round((1-armorDamageMultiplier(p))*100)+'% damage'});
    if(multi.length){lines.push({step:true,label:'②  × Separate multipliers'});lines.push(...multi);}
    const ov=this.add.container(0,0).setDepth(150000),bg=this.add.rectangle(w/2,h/2,w,h,0x000000,0.66),pw=Math.min(w-16,430),px=(w-pw)/2;
    const ftxt=this.add.text(0,0,'ⓘ '+(FORM[key]||''),{fontFamily:'sans-serif',fontSize:'10px',color:'#cfc3dd',wordWrap:{width:pw-28},lineSpacing:2});
    const avail=h-60-64-ftxt.height-24,rh=Math.max(14,Math.min(24,avail/Math.max(1,lines.length))),ph=64+lines.length*rh+ftxt.height+24,py=Math.max(24,(h-ph)/2),g=this.add.graphics();
    g.fillStyle(0x1f1729,0.98);g.fillRoundedRect(px,py,pw,ph,14);g.lineStyle(2,row[4],1);g.strokeRoundedRect(px,py,pw,ph,14);
    const t=this.add.text(px+14,py+20,row[0]+' '+row[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0,0.5),tv=this.add.text(px+pw-14,py+20,row[2],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffd166'}).setOrigin(1,0.5);
    const hc=this.add.text(px+pw-14,py+42,'value   bonus share',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#8a7f99'}).setOrigin(1,0.5);ov.add([bg,g,t,tv,hc]);
    const fs=rh<18?'9.5px':'11px',barX=px+pw*0.50,barW=pw*0.16;
    lines.forEach((l,i)=>{const ly=py+56+i*rh+rh/2;
      if(l.step){ov.add(this.add.text(px+12,ly,l.label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:fs,color:'#fff4d6'}).setOrigin(0,0.5));return;}
      if(l.note){ov.add(this.add.text(px+14,ly,l.label,{fontFamily:'sans-serif',fontSize:fs,color:'#ffd9a8'}).setOrigin(0,0.5));return;}
      if(l.hdr){const hb=this.add.graphics();hb.fillStyle(0x30253d,1);hb.fillRoundedRect(px+8,ly-rh/2+1,pw-16,rh-2,6);ov.add(hb);}
      const x0=l.hdr?px+14:px+28,a=this.add.text(x0,ly,(l.top?'★ ':'')+l.label,{fontFamily:'sans-serif',fontStyle:l.hdr?'bold':'normal',fontSize:fs,color:l.top?'#e8c87a':l.hdr?l.g.col:'#a99fb8',fixedWidth:barX-x0-6}).setOrigin(0,0.5);
      const b=this.add.text(px+pw-62,ly,fmt(l.v),{fontFamily:'sans-serif',fontStyle:l.hdr?'bold':'normal',fontSize:fs,color:l.v<0?(l.hdr?'#ff9bb5':'#c98a9c'):(l.hdr?'#8ff0b0':'#7fbf96')}).setOrigin(1,0.5);
      const pc=this.add.text(px+pw-14,ly,l.v>0&&!l.base?Math.round(l.pct)+'%':'—',{fontFamily:'sans-serif',fontStyle:l.hdr?'bold':'normal',fontSize:fs,color:l.pct>=30?(l.hdr?'#ffd166':'#c9ad6a'):(l.hdr?'#cfc3dd':'#8f859e')}).setOrigin(1,0.5);
      const bar=this.add.graphics();bar.fillStyle(0x0f0b15,1);bar.fillRect(barX,ly-3,barW,6);if(l.v>0&&!l.base){bar.fillStyle(l.top||l.pct>=30?0xffd166:Phaser.Display.Color.HexStringToColor(l.g.col).color,l.hdr?1:0.8);bar.fillRect(barX,ly-3,barW*Math.min(1,l.pct/100),6);}
      ov.add([a,b,pc,bar]);});
    ftxt.setPosition(px+14,py+56+lines.length*rh+8);ov.add(ftxt);
    const hint=this.add.text(w/2,py+ph-8,'Tap anywhere to close · ★ biggest source',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#8a7f99'}).setOrigin(0.5,1);ov.add(hint);this.menu.add(ov);
    const prev=this.tapZones;this.tapZones=[];this._zone(0,0,w,h,()=>{ov.destroy();this.tapZones=prev;});
  }
  /* v8.2.5 เจ้าของ: หน้า Missions — ภารกิจที่เคยเจอ ✓ / ยังไม่เจอ ??? + บอกด่านที่เจอ */
  logMission(type){ if(!type||!WAVE_OBJECTIVES[type]||typeof Save==='undefined'||!Save.data)return; const L=Save.data.missionLog=Save.data.missionLog||{}; L[type]=1; }
  buildMissionCodex(top){ if(this._missionAtlas&&typeof maUnlocked==='function'&&maUnlocked())return this.buildMissionAtlas(top); if(typeof maUnlocked==='function'&&maUnlocked()){ this.maArtLoad?.(); const m=maData(),bw=118,bx=this.W-bw-10,go=()=>{ const first=!m.seen; this._missionAtlas=true; this._maSel=null; m.seen=1; try{Save.save();}catch(e){} this.buildSkillArchive(); if(first)try{ VoiceActing?.play?.(this,'vo_ruby_tip_atlas',()=>this.state==='menu'&&!!this._missionAtlas); }catch(e){} };
      if(this.realTex?.('ma89_button')&&this.add.nineslice&&this.game?.renderer?.type===Phaser.WEBGL){ const by=top+8; this.menu.add(this.add.nineslice(bx+bw/2,by,'ma89_button',0,bw,28,32,32,8,8)); if(this.realTex('ma89_emblem'))this.menu.add(this.add.image(bx+16,by,'ma89_emblem').setDisplaySize(22,22)); this.menu.add(this.add.text(bx+bw/2+10,by,'Atlas'+(m.seen?'':' NEW'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#fff1e7'}).setOrigin(.5)); this._zone(bx,by-14,bw,28,go); }
      else this.uiPillBtn(this.menu,bx+bw/2,top+8,bw,28,0x6b4fa8,'🗺️','Atlas'+(m.seen?'':' NEW'),go); top+=22; }
    const w=this.W,h=this.H,portrait=w<=h,pages=missionCodexPages(),seen=missionSeenMap(),n=pages.reduce((a,p)=>a+p.rows.length,0),got=pages.reduce((a,p)=>a+p.rows.filter(r=>seen[r.t]).length,0);
    this._missionPage=Phaser.Math.Clamp(this._missionPage||0,0,pages.length-1); const pg=pages[this._missionPage];
    const hd=this.add.text(w/2,top+4,'Missions found: '+got+' / '+n,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#b7f08a'}).setOrigin(0.5,0);this.menu.add(hd);
    const y0=top+hd.height+10,bottom=h-(portrait?54:42),heads=1+pg.rows.filter(r=>r.head).length,cnt=pg.rows.length-heads,rh=Phaser.Math.Clamp(Math.floor((bottom-y0-heads*24)/Math.max(1,cnt))-4,26,48);
    const rows=[{head:pg.title,hex:'#ffe08a'}];
    for(const r of pg.rows){ if(r.head){rows.push(r);continue;} const o=WAVE_OBJECTIVES[r.t]||{},on=!!seen[r.t];
      rows.push(on?{emoji:o.emoji||'✨',title:(r.where?r.where+' · ':'')+o.name+'  ✓',desc:o.desc||'',color:0x8ee04b}:{emoji:'❔',title:(r.where?r.where+' · ':'')+'???',desc:r.hint||('Not found yet'+(r.where?' — try '+r.where:'')),color:0x51445f}); }
    this._codexRows(y0,rows,rh);
    if(pages.length>1)this._codexNav(this._missionPage,pages.length,()=>{this._missionPage--;this.buildSkillArchive();},()=>{this._missionPage++;this.buildSkillArchive();},pg.title+' · '+(this._missionPage+1)+' / '+pages.length);
  }
  /* v8.2.30 Mission Atlas หน้าจอ: รายการ 23 ภารกิจ (หน้าละ 8) → แตะ = ต้นไม้ 3 ขั้น × 2 ทาง · ⭐ ว่าง/เพดาน · Focus · Reset */
  maArtLoad(){ if(this._maArt||!this.ensureGroup)return; const miss=Object.keys(ASSET_FX).filter(k=>k.startsWith('ma89_')&&!this.realTex(k)); if(!miss.length)return; this._maArt=true;
    try{ this.ensureGroup(k=>miss.includes(k),()=>{ this._maArt=false; if(this.state==='menu'&&this._skillArchiveTab==='missions')this.buildSkillArchive(); },{all:true,fx:true,quiet:true}); }catch(e){ this._maArt=false; } }
  buildMissionAtlas(top){ this.maArtLoad?.(); const ART=!!(this.realTex?.('ma89_nodes')&&this.realTex?.('ma89_node_frame')&&this.add.nineslice&&this.game?.renderer?.type===Phaser.WEBGL); const w=this.W,h=this.H,m=maData(),types=maTypes(),cap=maCap(),used=maSpent(),free=maFree(),fs=maFocusSlots(),T=(x,y,t,sz,c,b,o)=>{ const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:b?'bold':'normal',fontSize:sz+'px',color:c||'#ffffff',align:'center',wordWrap:{width:w-40}}).setOrigin(o??.5,0); this.menu.add(q); return q; },rebuild=()=>{ try{Save.save();}catch(e){} this.buildSkillArchive(); };
    T(w/2,top,'🗺️ Mission Atlas  ·  ⭐ '+free+' free  ·  used '+used+' / '+cap,12,'#ffe08a',true); if(this.realTex?.('ma89_emblem'))this.menu.add(this.add.image(26,top+14,'ma89_emblem').setDisplaySize(36,36)); T(w/2,top+18,'Earned '+m.pts+' · Focus '+m.focus.length+'/'+fs+(fs<3?' (next at '+MA_FOCUS_AT[fs]+')':''),10,'#c8bcd8');
    const back=this._maSel?'‹ Missions':'‹ Found list'; this.uiPillBtn(this.menu,70,top+48,120,28,0x4a3a60,'↩',back.replace('‹ ',''),()=>{ if(this._maSel)this._maSel=null; else this._missionAtlas=false; rebuild(); });
    if(!this._maSel){ this.uiPillBtn(this.menu,w-70,top+48,120,28,0x7a3a4a,'♻️','Reset',()=>{ maReset(); this.a12?.('a18_atlas_remove',.45,.1); rebuild(); });
      const per=8,pages=Math.ceil(types.length/per); this._maPage=Phaser.Math.Clamp(this._maPage||0,0,pages-1); const y0=top+72,rh=Math.max(34,Math.min(52,Math.floor((h-y0-70)/per)-4)),bw=Math.min(w-24,460),bx=(w-bw)/2;
      types.slice(this._maPage*per,this._maPage*per+per).forEach((t,i)=>{ const o=WAVE_OBJECTIVES[t],a=m.nodes[t]||[],y=y0+i*(rh+4),g=this.add.graphics(),fo=m.focus.includes(t);
        g.fillStyle(0x241a30,.96).fillRoundedRect(bx,y,bw,rh,10); g.lineStyle(1.6,fo?0xffd166:a.some(Boolean)?0xc9a3ff:0x51445f,1).strokeRoundedRect(bx,y,bw,rh,10); this.menu.add(g);
        const fi=MC86_ORDER.indexOf(t); if(fi>=0&&this.realTex?.('mc86_faces'))this.menu.add(this.add.image(bx+rh/2+2,y+rh/2,'mc86_faces',fi).setDisplaySize(rh-6,rh-6)); else T(bx+rh/2+2,y+rh/2-10,o.emoji||'✨',16);
        T(bx+rh+8,y+rh/2-8,(fo?'⭐ ':'')+o.name,12,'#ffffff',true,0); if(ART)[0,1,2].forEach(k=>{ const ix=bx+bw-14-(2-k)*24,iy=y+rh/2; if(a[k])this.menu.add(this.add.image(ix,iy,'ma89_nodes',k*2+a[k]-1).setDisplaySize(20,20)); else this.menu.add(this.add.circle(ix,iy,4,0x6f6680,.8)); }); else T(bx+bw-10,y+rh/2-7,[0,1,2].map(k=>a[k]?MA_TREE[k][a[k]-1].em:'▫️').join(' '),12,'#ffffff',false,1);
        this._zone(bx,y,bw,rh,()=>{ this._maSel=t; rebuild(); }); });
      if(pages>1)this._codexNav(this._maPage,pages,()=>{this._maPage--;rebuild();},()=>{this._maPage++;rebuild();},'Atlas · '+(this._maPage+1)+' / '+pages); return; }
    const t=this._maSel,o=WAVE_OBJECTIVES[t]||{},a=m.nodes[t]||[0,0,0],fo=m.focus.includes(t);
    this.uiPillBtn(this.menu,w-70,top+48,120,28,fo?0x8a6a1a:0x4a3a60,'⭐',fo?'Focused':'Focus',()=>{ if(!maToggleFocus(t))this.menuToast?.(fs?'All Focus slots are used':'Focus unlocks at '+MA_FOCUS_AT[0]+' earned','#ffb4b4'); rebuild(); });
    T(w/2,top+72,(o.emoji||'')+' '+(o.name||t),15,'#ffffff',true); T(w/2,top+92,'Pick 1 of 2 on each tier · tiers unlock in order · tap again to remove',9.5,'#b7abc9');
    const bw=Math.min(w-24,460),bx=(w-bw)/2,cw=(bw-10)/2,ch=Math.max(70,Math.min(96,(h-top-190)/3-10)); let y=top+112;
    for(let k=0;k<3;k++){ T(bx,y,'Tier '+(k+1)+' · ⭐ '+MA_COST[k],11,'#ffe08a',true,0); y+=16;
      for(let c=0;c<2;c++){ const n=MA_TREE[k][c],x=bx+c*(cw+10),on=a[k]===c+1,lock=k>0&&!a[k-1],g=this.add.graphics();
        if(ART){ this.menu.add(this.add.nineslice(x+cw/2,y+ch/2,'ma89_node_frame',on?1:lock?2:0,cw,ch,24,24,24,24)); g.destroy(); const ic=this.add.image(x+20,y+18,'ma89_nodes',k*2+c).setDisplaySize(28,28).setAlpha(lock?.45:1); this.menu.add(ic); }
        else { g.fillStyle(on?0x3b2f5a:0x221a2c,.97).fillRoundedRect(x,y,cw,ch,10); g.lineStyle(on?3:1.6,on?0xffd166:lock?0x3a3048:0x7a6a95,1).strokeRoundedRect(x,y,cw,ch,10); this.menu.add(g); }   /* v8.2.31 ใบ 89 */
        T(x+cw/2+(ART?10:0),y+8,(ART?'':n.em+' ')+n.name,12,lock?'#6f6680':'#ffffff',true); const d=T(x+cw/2,y+28,n.desc,10,lock?'#5f5670':'#d8cde2'); d.setWordWrapWidth?.(cw-14);
        if(on)T(x+cw/2,y+ch-18,'✓ Chosen',10,'#8ff0b0',true);
        this._zone(x,y,cw,ch,()=>{ const was=a[k]===c+1; if(!maPick(t,k,c+1))this.menuToast?.(lock?'Choose tier '+k+' first':'Not enough ⭐ (free '+maFree()+')','#ffb4b4'); else this.a12?.(was?'a18_atlas_remove':'a18_atlas_pick',.45,.1); rebuild(); }); }
      y+=ch+10; } }
  // v6.53: Codex ชุดเซ็ท — ชิ้นไหนเข้าชุดไหน · โบนัสสวม 2/3 ชิ้น · เก็บครบ = โบนัสถาวร
  buildSetCodex(top){ const w=this.W,bw=Math.min(w-24,460),bx=(w-bw)/2,cnt=gearSetCounts(); let y=top;
    const col=(Object.keys(GEAR_SETS).length);
    const hd=this.add.text(w/2,y+6,'Wear pieces of the same set for bonuses',{fontFamily:'sans-serif',fontSize:'10px',color:'#b7abc9',align:'center',wordWrap:{width:bw}}).setOrigin(0.5,0);this.menu.add(hd);y+=hd.height+10;const ch=Math.max(92,Math.min(124,(this.H-y-10)/col-8));
    SET_ORDER.filter(k=>GEAR_SETS[k]).forEach(sid=>{ const d=GEAR_SETS[sid],ps=gearSetPieces(sid),done=false,wear=cnt[sid]||0,g=this.add.graphics();
      g.fillStyle(0x241a30,0.96);g.fillRoundedRect(bx,y,bw,ch,12);g.lineStyle(2,done?0xffd166:0x5a4b75,1);g.strokeRoundedRect(bx,y,bw,ch,12);
      const t=this.add.text(bx+12,y+14,d.emoji+' '+d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff'}).setOrigin(0,0.5),st=this.add.text(bx+bw-12,y+14,done?'Collection ✓'+(wear>=2?' · Wearing '+wear:''):'Wearing '+wear+'/'+ps.length,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:wear>=2?'#8ff0b0':done?'#ffd166':'#9a90ab'}).setOrigin(1,0.5);
      this.menu.add([g,t,st]); const is=Math.min(46,(bw*0.55-16)/ps.length-6);
      ps.forEach((it,i)=>{ const x=bx+12+i*(is+6),iy=y+30,has=gearOwnsBase(it.id),eq=Object.values(Save.data.gear||{}).includes(it.id),bg=this.add.graphics();bg.fillStyle(has?0x3a2f50:0x1a1522,1);bg.fillRoundedRect(x,iy,is,is,8);bg.lineStyle(2,eq?0x8ff0b0:has?0xc9a3ff:0x3a3048,1);bg.strokeRoundedRect(x,iy,is,is,8);
        const k=it.iconKey&&this.textures.exists(it.iconKey)?it.iconKey:('gear_'+it.id),ic=this.textures.exists(k)?this.add.image(x+is/2,iy+is/2,k).setDisplaySize(is-8,is-8):this.add.text(x+is/2,iy+is/2,it.emoji||'?',{fontSize:Math.round(is*0.5)+'px'}).setOrigin(0.5);ic.setAlpha(has?1:0.3);
        const nm=this.add.text(x+is/2,iy+is+3,has?it.name:'???',{fontFamily:'sans-serif',fontSize:'7.5px',color:has?'#d8cde2':'#6f6680',align:'center',wordWrap:{width:is+6}}).setOrigin(0.5,0);this.menu.add([bg,ic,nm]); });
      const tx=bx+bw*0.47; let ly=y+32; Object.keys(d.bonuses).forEach(n=>{ const on=wear>=+n,l=this.add.text(tx,ly,(on?'✅ ':'▫️ ')+d.bonuses[n].desc,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10.5px',color:on?'#8ff0b0':'#cfc3dd',wordWrap:{width:bw*0.5}}).setOrigin(0,0);this.menu.add(l);ly+=l.height+4; });
      y+=ch+8; }); }
  buildSkillArchive(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Recipe Book','screen_codex');
    const w=this.W,h=this.H,portrait=w<=h;let tab=this._skillArchiveTab||'builds';if(tab==='attack'||tab==='passive'||tab==='weapons')tab='builds';   // v8.0.29 Weapons → Heroes & Builds   // v4.62: สกิล/passive เดิมเลิกใช้แล้ว (character-first)
    const tabY=portrait?82:50,tabH=32,tabGap=6,tabN=5,tabW=Math.min(120,(w-32-tabGap*(tabN-1))/tabN),tabX=w/2-(tabW*tabN+tabGap*(tabN-1))/2;
    const drawTab=(x,label,on,fn,color)=>{const g=this.add.graphics();g.fillStyle(on?this._darken(color,.55):0x292032,0.96);g.fillRoundedRect(x,tabY,tabW,tabH,10);g.lineStyle(1.8,on?color:0x51445f,1);g.strokeRoundedRect(x,tabY,tabW,tabH,10);const t=this.add.text(x+tabW/2,tabY+tabH/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:tabW<72?'8px':tabW<110?'9px':'10px',color:on?'#ffffff':'#998da7'}).setOrigin(0.5);this.menu.add([g,t]);this._zone(x,tabY,tabW,tabH,fn);};
    drawTab(tabX,'📖 Builds',tab==='builds',()=>{this._skillArchiveTab='builds';this._skillArchiveSelected=null;this.buildSkillArchive();},0xf0a54a);
    drawTab(tabX+tabW+tabGap,'🔮 Relics '+Object.keys(RELICS).length,tab==='relics',()=>{this._skillArchiveTab='relics';this._codexRelicPage=0;this._skillArchiveSelected=null;this.buildSkillArchive();},0xc07bff);
    drawTab(tabX+(tabW+tabGap)*2,'🎁 Items',tab==='items',()=>{this._skillArchiveTab='items';this._skillArchiveSelected=null;this.buildSkillArchive();},0xc9a3ff);
    drawTab(tabX+(tabW+tabGap)*3,'🧩 Sets',tab==='sets',()=>{this._skillArchiveTab='sets';this._skillArchiveSelected=null;this.buildSkillArchive();},0x7fd4ff);
    drawTab(tabX+(tabW+tabGap)*4,'🗺️ Missions',tab==='missions',()=>{this._skillArchiveTab='missions';this._missionPage=0;this._skillArchiveSelected=null;this.buildSkillArchive();},0x8ee04b);
    if(tab==='missions'){this.buildMissionCodex(tabY+tabH+10);this.menu.setVisible(true);return;}
    if(tab==='sets'){this.buildSetCodex(tabY+tabH+10);this.menu.setVisible(true);return;}
    if(tab==='items'){this.buildItemCodex(tabY+tabH+12);this.menu.setVisible(true);return;}
    if(tab==='builds'){this.buildRecipeBook(tabY+tabH+10);this.menu.setVisible(true);return;}
    if(tab==='relics'){this.buildRelicCodex(tabY+tabH+10);this.menu.setVisible(true);return;}
    if(this._skillArchiveSelected){this.buildSkillArchiveDetail(this._skillArchiveSelected,portrait,tabY+tabH+10);this.menu.setVisible(true);return;}
    const isPass=tab==='passive',defs=isPass?PASSIVES:SKILLDEFS,keys=Object.keys(defs),cols=portrait?2:4,rows=portrait?3:2,perPage=cols*rows;
    const pages=Math.max(1,Math.ceil(keys.length/perPage));this._skillArchivePage=Phaser.Math.Clamp(this._skillArchivePage||0,0,pages-1);const page=this._skillArchivePage;
    const gap=portrait?8:7,side=14,top=tabY+tabH+12,bottom=h-(portrait?54:42),cardW=(w-side*2-gap*(cols-1))/cols,cardH=(bottom-top-gap*(rows-1))/rows;
    keys.slice(page*perPage,page*perPage+perPage).forEach((key,i)=>{const d=defs[key],col=i%cols,row=Math.floor(i/cols),x=side+col*(cardW+gap),y=top+row*(cardH+gap),color=isPass?(d.color||COLORS.mint):0xf0a54a;
      const g=this.add.graphics();g.fillStyle(0x211929,0.97);g.fillRoundedRect(x,y,cardW,cardH,12);g.fillStyle(color,0.13);g.fillRoundedRect(x+3,y+3,cardW-6,cardH-6,9);g.lineStyle(1.7,color,0.82);g.strokeRoundedRect(x,y,cardW,cardH,12);
      const ik=this.iconKey(key,isPass),iconSize=Math.min(portrait?44:38,cardH*0.36),ic=ik?this.add.image(x+cardW/2,y+iconSize*0.62+5,ik).setDisplaySize(iconSize,iconSize):this.add.text(x+cardW/2,y+iconSize*0.62+5,d.emoji,{fontSize:Math.round(iconSize*0.78)+'px'}).setOrigin(0.5);
      const nm=this.add.text(x+cardW/2,y+iconSize+10,d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:cardW<150?'9px':'10.5px',color:'#fff7ed',align:'center',wordWrap:{width:cardW-12},maxLines:1}).setOrigin(0.5,0);
      const role=this.add.text(x+cardW/2,y+iconSize+25,!isPass&&d.role?d.role:'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:'#ffc978',align:'center',wordWrap:{width:cardW-12},maxLines:1}).setOrigin(0.5,0);
      const pair=isPass?COMBOS.filter(c=>c.b===key).map(c=>SKILLDEFS[c.a]&&SKILLDEFS[c.a].name).filter(Boolean).join(', '):((COMBOS.find(c=>c.a===key)||{}).name||'No Awaken pair');
      const desc=this.add.text(x+8,y+cardH-34,d.desc,{fontFamily:'sans-serif',fontSize:cardW<150?'7.5px':'8px',color:'#c9bdd2',align:'center',wordWrap:{width:cardW-16},maxLines:2}).setOrigin(0,1);
      const ft=this.add.text(x+cardW/2,y+cardH-8,(isPass?'Pairs with: ':'Awaken pair: ')+(pair||'—'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:isPass?'#8fe6c5':'#ffd08a',align:'center',wordWrap:{width:cardW-12},maxLines:1}).setOrigin(0.5,1);
      this.menu.add([g,ic,nm,role,desc,ft]);this._zone(x,y,cardW,cardH,()=>{this._skillArchiveSelected={key,isPass};this.buildSkillArchive();});
    });
    const navY=h-(portrait?31:20),navW=92,navH=28;
    const pageTxt=this.add.text(w/2,navY,'Page '+(page+1)+' / '+pages,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#d8cce0'}).setOrigin(0.5);this.menu.add(pageTxt);
    const nav=(cx,label,enabled,fn)=>{const g=this.add.graphics();g.fillStyle(enabled?0x463653:0x28212e,1);g.fillRoundedRect(cx-navW/2,navY-navH/2,navW,navH,9);g.lineStyle(1,enabled?0xa98cf0:0x44394d,1);g.strokeRoundedRect(cx-navW/2,navY-navH/2,navW,navH,9);const t=this.add.text(cx,navY,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:enabled?'#f5eaff':'#665d70'}).setOrigin(0.5);this.menu.add([g,t]);if(enabled)this._zone(cx-navW/2,navY-navH/2,navW,navH,fn);};
    nav(w/2-120,'‹ Prev',page>0,()=>{this._skillArchivePage--;this.buildSkillArchive();});nav(w/2+120,'Next ›',page<pages-1,()=>{this._skillArchivePage++;this.buildSkillArchive();});
    this.menu.setVisible(true);
  }
  // ปุ่มเปลี่ยนหน้า (‹ / ›) ล่างจอ — ใช้ร่วม Bestiary / Weapons / Relics
  _codexNav(page,pages,onPrev,onNext,label,options={}){
    const w=this.W,h=this.H,portrait=w<=h,navY=options.y??h-(portrait?31:20),navW=92,navH=options.touch?44:28,spread=Math.min(120,(w-100)/2);
    const t=this.add.text(w/2,navY,label||('Page '+(page+1)+' / '+pages),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#d8cce0'}).setOrigin(0.5);this.menu.add(t);
    const nav=(cx,lab,en,fn)=>{const g=this.add.graphics();g.fillStyle(en?0x463653:0x28212e,1);g.fillRoundedRect(cx-navW/2,navY-navH/2,navW,navH,9);g.lineStyle(1,en?0xa98cf0:0x44394d,1);g.strokeRoundedRect(cx-navW/2,navY-navH/2,navW,navH,9);const tt=this.add.text(cx,navY,lab,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:en?'#f5eaff':'#665d70'}).setOrigin(0.5);this.menu.add([g,tt]);if(en)this._zone(cx-navW/2,navY-navH/2,navW,navH,()=>{Sfx.select&&Sfx.select();fn();});};
    nav(w/2-spread,'‹ Prev',page>0,onPrev);nav(w/2+spread,'Next ›',page<pages-1,onNext);
  }
  // แถวข้อมูลแบบลิสต์ (emoji · ชื่อ · คำอธิบาย) — rows: [{emoji,title,desc,color,head}]
  _codexRows(top,rows,rh){
    const w=this.W,x=14,cw=w-28,gap=4;let y=top;
    for(const r of rows){
      if(r.head){const t=this.add.text(x+4,y+rh*0.5,r.head,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:r.hex||'#ffe08a'}).setOrigin(0,0.5);this.menu.add(t);y+=rh*0.8+gap;continue;}
      if(r.stack){const nm=this.add.text(x+36,y+12,r.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#fff7ed'}).setOrigin(0,0),ds=this.add.text(x+36,y+30,r.desc,{fontFamily:'sans-serif',fontSize:'11px',color:'#d8cce0',wordWrap:{width:cw-48}}).setOrigin(0,0),height=Math.max(58,ds.height+40),g=this.add.graphics();g.fillStyle(0x211929,.97).fillRoundedRect(x,y,cw,height,9);g.lineStyle(1.3,r.color,.75).strokeRoundedRect(x,y,cw,height,9);const em=this.add.text(x+18,y+16,r.emoji,{fontSize:'18px'}).setOrigin(.5);this.menu.add([g,em,nm,ds]);y+=height+gap;continue;}
      const g=this.add.graphics();g.fillStyle(0x211929,.97);g.fillRoundedRect(x,y,cw,rh,9);g.fillStyle(r.color,.12);g.fillRoundedRect(x+2,y+2,cw-4,rh-4,7);g.lineStyle(1.3,r.color,.75);g.strokeRoundedRect(x,y,cw,rh,9);
      const em=r.icon&&this.textures.exists(r.icon)?this.add.image(x+18,y+rh/2,r.icon).setDisplaySize(Math.min(28,rh*0.8),Math.min(28,rh*0.8)):this.add.text(x+18,y+rh/2,r.emoji,{fontSize:Math.round(Math.min(22,rh*0.6))+'px'}).setOrigin(.5);
      const nm=this.add.text(x+36,y+rh/2,r.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff7ed'}).setOrigin(0,.5);
      const ds=this.add.text(x+36+Math.max(120,nm.width+10),y+rh/2,r.desc,{fontFamily:'sans-serif',fontSize:'9.5px',color:'#c9bdd2',wordWrap:{width:cw-(36+Math.max(120,nm.width+10))-10},maxLines:2}).setOrigin(0,.5);
      this.menu.add([g,em,nm,ds]);y+=rh+gap;
    }return y;
  }
  // ⚔️ อาวุธประจำตัวรายตัวละคร: อัพเกรด 4 · Mutation 2 · Evolution
  buildWeaponCodex(top){
    const ids=CHAR_ORDER.filter(c=>BASIC_ATTACKS[c]&&(typeof heroRevealed==='function'?heroRevealed(c):(c==='momo'||FIGHTER_PLAYTEST_ALL||(Save.data.chars||[]).includes(c)))),pages=ids.length;this._codexChar=Phaser.Math.Clamp(this._codexChar||0,0,pages-1);
    const ch=ids[this._codexChar],c=CHARACTERS[ch],d=ch==='taro'?taroAttackInfo(BASIC_ATTACKS[ch],{path:this._codexTaroPath==='base'?null:this._codexTaroPath||'storm'}):BASIC_ATTACKS[ch],col=c.color||0xf0a54a,hex='#'+col.toString(16).padStart(6,'0');
    if(ch==='taro'){const paths=[{id:'base',name:'Starter'},...BASIC_PATHS.taro],cw=(this.W-32)/4;paths.forEach((path,i)=>this.heroButton(10+i*(cw+4),top,cw,44,path.name.replace(/ Build$/,''),()=>{this._codexTaroPath=path.id;this.buildSkillArchive();},{active:path.id===(this._codexTaroPath||'storm'),fontSize:12}));top+=50;}
    const rows=[{head:c.emoji+' '+c.name+' — '+d.emoji+' '+d.name,hex}];
    for(const u of d.upgrades)rows.push({emoji:u.emoji,title:u.name+'  (max '+u.max+')',desc:u.desc,color:0xf0a54a});
    rows.push({head:ch==='taro'?'Mutation: mastery 10 · pick one':'⭐ Mutation — pick 1 of 2 around Lv 9 (the other locks)',hex:'#ffd08a'});
    for(const m of d.mutations)rows.push({emoji:m.emoji,title:m.name,desc:m.desc,color:0xffc857});
    rows.push({head:ch==='taro'?'Evolution: mastery 16 · earlier ranks stay':'✨ Evolution — around Lv 15, then endless Power-Ups',hex:'#ffe98a'});
    if(ch==='momo')for(const e of Object.values(BERRY_EVOLUTIONS))rows.push({emoji:'✨',title:e.name,desc:e.desc,color:0xffd54a});
    else if(ch==='yuzu')for(const e of Object.values(YUZU_EVOLUTIONS))rows.push({emoji:'✨',title:e.name,desc:e.desc,color:0xffd54a});
    else if(ch==='mint')for(const e of Object.values(MINT_EVOLUTIONS))rows.push({emoji:'✨',title:e.name,desc:e.desc,color:0xffd54a});
    else if(ch==='cocoa'){for(const e of Object.values(COCOA_EVOLUTIONS))rows.push({emoji:'✨',title:e.name,desc:e.desc,color:0xffd54a});for(const u of Object.values(COCOA_UNIQUES))rows.push({emoji:u.emoji,title:u.name,desc:u.desc,color:u.color});}
    else rows.push({emoji:'✨',title:d.evolution,desc:d.evolutionDesc||BASIC_EVO_DESC[d.skill]||'Upgrades the whole Basic Attack',color:0xffd54a});
    const n=rows.filter(r=>!r.head).length,nh=rows.length-n,avail=this.H-top-(this.W<=this.H?54:42),rh=Math.max(24,Math.min(this.W<=this.H?46:34,(avail-nh*4-rows.length*4)/(n+nh*0.8)));
    if(ch==='taro')for(const row of rows)row.stack=!row.head;
    const bottom=this._codexRows(top,rows,rh);
    this._codexNav(this._codexChar,pages,()=>{this._codexChar--;this.buildSkillArchive();},()=>{this._codexChar++;this.buildSkillArchive();},c.emoji+' '+c.name+'  ·  '+(this._codexChar+1)+' / '+pages,ch==='taro'?{y:Math.max(this.H-31,bottom+24),touch:true}:{});
    this.setupMenuScroll?.('skills');
  }
  // 🔮 Relic ทั้งหมด + คู่ Synergy
  buildRelicCodex(top){
    const all=Object.keys(RELICS).map(k=>({icon:'relic_'+k,emoji:RELICS[k].emoji,title:RELICS[k].name,desc:RELICS[k].desc,color:0xc07bff}));
    all.push({head:'🔗 Synergy pairs — hold both for a bonus',hex:'#d9b8ff'});
    for(const sy of RELIC_SYNERGIES)all.push({emoji:RELICS[sy.a].emoji+RELICS[sy.b].emoji,title:sy.name,desc:sy.desc,color:0xff9ad5});
    const portrait=this.W<=this.H,rh=portrait?44:30,avail=this.H-top-(portrait?54:42),per=Math.max(3,Math.floor(avail/(rh+4))),pages=Math.max(1,Math.ceil(all.length/per));
    this._codexRelicPage=Phaser.Math.Clamp(this._codexRelicPage||0,0,pages-1);
    const note=this.add.text(this.W/2,top+2,'Found in-run: Lv 6 pick · Miniboss Box · secret boxes · Bonus Challenges  (hold up to '+RELIC_CAP+')',{fontFamily:'sans-serif',fontSize:'9px',color:'#bfa9dc'}).setOrigin(0.5,0);this.menu.add(note);
    this._codexRows(top+16,all.slice(this._codexRelicPage*per,this._codexRelicPage*per+per),rh);
    this._codexNav(this._codexRelicPage,pages,()=>{this._codexRelicPage--;this.buildSkillArchive();},()=>{this._codexRelicPage++;this.buildSkillArchive();});
  }
  buildRecipeBook(top){ const w=this.W,h=this.H,d=Save.data,heroes=awHeroList().filter(x=>BASIC_PATHS[x]),C=(typeof CHARACTERS!=='undefined'?CHARACTERS:{});
    const paper=!!this.menuArtPanel?.('rb_page',0,8,top-4,w-16,h-top+4);const T=(x,y,t,sz,c,st,ox=0,oy=.5)=>{const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:paper?this.menuArtInk(c):c||'#fff'}).setOrigin(ox,oy);this.menu.add(q);return q;};
    let hero=heroes.includes(this._rbHero)?this._rbHero:(heroes.includes(d.character)?d.character:heroes[0]); this._rbHero=hero; if(!hero)return;
    const paths=BASIC_PATHS[hero]||[]; let pid=paths.some(p=>p.id===this._rbPath)?this._rbPath:paths[0].id; this._rbPath=pid;
    let y=top; const hw=Math.min(78,(w-28-(heroes.length-1)*6)/heroes.length);
    heroes.forEach((hid,i)=>{ const x=14+i*(hw+6),on=hid===hero,g=this.add.graphics(); g.fillStyle(paper?0xf4e5c8:on?0x3a2f50:0x221a2b,1).fillRoundedRect(x,y,hw,34,10).lineStyle(on?2:1.5,on?0xffd166:0x4a4059,1).strokeRoundedRect(x,y,hw,34,10); this.menu.add(g);if(this.menuArtPanel?.('rb_chip',on?1:0,x,y,hw,34))g.clear();
      const n=(BASIC_PATHS[hid]||[]).reduce((a,p)=>a+recipeCards(hid,p.id).filter(c=>recipeSeen(hid,p.id)[c.id]).length,0),all=(BASIC_PATHS[hid]||[]).reduce((a,p)=>a+recipeCards(hid,p.id).length,0);
      T(x+hw/2,y+12,(C[hid]&&C[hid].emoji)||'🍡',14,'#fff','normal',.5); const nt=T(x+hw/2,y+27,n+'/'+all,9,on?'#ffe08a':'#a89cb6','bold',.5);
      this._zone(x,y,hw,34,()=>{ this._rbHero=hid; this._rbPath=null; Sfx.select&&Sfx.select(); this.buildSkillArchive(); }); this.tapZones[this.tapZones.length-1].tag='rb_hero_'+hid; });
    y+=42; const pw=(w-28-12)/3;
    paths.forEach((p,i)=>{ const x=14+i*(pw+6),on=p.id===pid,L=recipeCards(hero,p.id),S=recipeSeen(hero,p.id),n=L.filter(c=>S[c.id]).length,g=this.add.graphics(); g.fillStyle(paper?0xf4e5c8:on?0x2f3a50:0x221a2b,1).fillRoundedRect(x,y,pw,40,10).lineStyle(on?2:1.5,S._done?0x7fe3a8:on?0x7fd4ff:0x4a4059,1).strokeRoundedRect(x,y,pw,40,10); this.menu.add(g);if(this.menuArtPanel?.('rb_chip',on?1:0,x,y,pw,40))g.clear();
      const nm=T(x+pw/2,y+13,p.emoji+' '+String(p.name).replace(/ Build$/,''),10,'#ffffff','bold',.5); if(nm.width>pw-8)nm.setScale((pw-8)/nm.width);
      T(x+pw/2,y+29,S._done?'✓ Complete':n+' / '+L.length+' found',9,S._done?'#8bffb4':'#cfc2d5','bold',.5);
      this._zone(x,y,pw,40,()=>{ this._rbPath=p.id; Sfx.select&&Sfx.select(); this.buildSkillArchive(); }); this.tapZones[this.tapZones.length-1].tag='rb_path_'+p.id; });
    y+=48; const L=recipeCards(hero,pid),S=recipeSeen(hero,pid),pt=paths.find(p=>p.id===pid);
    if(S._done)this.menuArtIcon?.('rb_complete',0,w-28,y+4,40);const status=T(14,y+6,S._done?'📖 Every card found · 🧶 '+RECIPE_PATH_THREAD+' claimed':'Pick every card of this Build in runs → 🧶 +'+RECIPE_PATH_THREAD+' Thread',10,S._done?'#8bffb4':'#ffe08a','bold');if(status.width>w-(S._done?74:28))status.setScale((w-(S._done?74:28))/status.width); y+=18;
    const rh=Math.max(34,Math.min(46,(h-y-12)/Math.max(1,L.length)-4));
    L.forEach(c=>{ const seen=!!S[c.id],g=this.add.graphics(); g.fillStyle(paper?0xf4e5c8:seen?0x231c2e:0x1a1520,.97).fillRoundedRect(14,y,w-28,rh,10).lineStyle(1.5,seen?(c.uq?0xff9f43:0x7fd4ff):0x3a3046,1).strokeRoundedRect(14,y,w-28,rh,10); this.menu.add(g);if(this.menuArtPanel?.('rb_chip',0,14,y,w-28,rh))g.clear();
      const isz=rh-10; if(seen&&c.iconKey&&this.textures.exists(c.iconKey))this.menu.add(this.add.image(34,y+rh/2,c.iconKey).setDisplaySize(isz,isz)); else if(seen||!this.menuArtIcon?.('rb_unknown',0,34,y+rh/2,Math.min(32,isz)))T(34,y+rh/2,seen?c.emoji:'❔',Math.round(isz*.55),'#fff','normal',.5);
      const nm=T(56,y+rh*.34,seen?c.name:'???',12,seen?'#ffffff':'#7a7088','bold'); const room=w-28-56-30; if(nm.width>room)nm.setScale(room/nm.width);
      const ds=T(56,y+rh*.7,seen?c.desc:(c.uq?'A hidden Unique Mutation':'Not found yet — try this Build'),9,seen?'#c9bdd2':'#6f6680'); if(ds.width>room)ds.setScale(room/ds.width);
      if(seen)T(w-24,y+rh/2,'✓',14,'#8bffb4','bold',.5); y+=rh+4; });
  }
  buildItemCodex(top){
    const w=this.W,h=this.H,portrait=w<=h,rows=[
      ['ic_heart','Heart','Heals 18% HP + 6 · always drops from bosses/minibosses, rarely from normal enemies',0xff6f9f],
      ['ic_magnet','Magnet','Vacuums all EXP orbs on the field · save it for after a big clear',0x7fd0ff],
      ['prize_chest','Gear box','Halo color = rarity: green Common · gold Rare · purple Epic',0xc9a3ff],
      ['✦','Stage gimmick','After a wave: vacuum EXP / clear slows / reset cooldowns / freeze field / heal and gain Sugar',0xffcf5a],
      ['p_crate','Crate break','Gives EXP with a chance of hearts, magnets, Gear or Sugar · higher stage/difficulty raises rarity',0xe59a4d]
    ],gap=portrait?9:8,x=14,cw=w-28,rh=Math.min(portrait?78:58,(h-top-18-gap*(rows.length-1))/rows.length);
    rows.forEach((r,i)=>{const y=top+i*(rh+gap),g=this.add.graphics();g.fillStyle(0x211929,.97);g.fillRoundedRect(x,y,cw,rh,12);g.lineStyle(1.6,r[3],.82);g.strokeRoundedRect(x,y,cw,rh,12);g.fillStyle(r[3],.11);g.fillRoundedRect(x+3,y+3,cw-6,rh-6,9);const em=this.textures.exists(r[0])?this.add.image(x+28,y+rh/2,r[0]).setDisplaySize(portrait?36:30,portrait?36:30):this.add.text(x+28,y+rh/2,r[0],{fontSize:(portrait?28:23)+'px'}).setOrigin(.5),nm=this.add.text(x+54,y+rh*.32,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(portrait?13:11)+'px',color:'#fff7ed'}).setOrigin(0,.5),ds=this.add.text(x+54,y+rh*.68,r[2],{fontFamily:'sans-serif',fontSize:(portrait?9.5:8.5)+'px',color:'#c9bdd2',wordWrap:{width:cw-68},maxLines:2}).setOrigin(0,.5);this.menu.add([g,em,nm,ds]);});
  }
  buildSkillArchiveDetail(sel,portrait,top){ if(this._pageSel!==sel){ if(this._pageSel!==undefined)Sfx.menuCue?.('ui_page_flip',.3); this._pageSel=sel; }
    const w=this.W,h=this.H,d=sel.isPass?PASSIVES[sel.key]:SKILLDEFS[sel.key];if(!d){this._skillArchiveSelected=null;this.buildSkillArchive();return;}
    const panelX=16,panelW=w-32,panelY=top,panelH=h-top-16,g=this.add.graphics(),color=sel.isPass?(d.color||COLORS.mint):0xf0a54a;
    g.fillStyle(0x1f1728,0.98);g.fillRoundedRect(panelX,panelY,panelW,panelH,16);g.lineStyle(2,color,0.9);g.strokeRoundedRect(panelX,panelY,panelW,panelH,16);g.fillStyle(color,0.11);g.fillRoundedRect(panelX+4,panelY+4,panelW-8,Math.min(panelH-8,portrait?118:72),12);this.menu.add(g);
    const ik=this.iconKey(sel.key,sel.isPass),size=portrait?72:58,ix=panelX+18+size/2,iy=panelY+16+size/2,ic=ik?this.add.image(ix,iy,ik).setDisplaySize(size,size):this.add.text(ix,iy,d.emoji,{fontSize:Math.round(size*0.75)+'px'}).setOrigin(0.5);
    const tx=ix+size/2+14,title=this.add.text(tx,panelY+17,d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:portrait?'18px':'16px',color:'#fff7ed'}).setOrigin(0,0);
    const type=this.add.text(tx,panelY+43,sel.isPass?'PASSIVE · up to 5 stars':'ATTACK · '+d.role+' · up to 5 stars',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:sel.isPass?'#8fe6c5':'#ffd08a',wordWrap:{width:panelX+panelW-tx-14}}).setOrigin(0,0);
    const desc=this.add.text(tx,panelY+59,d.desc,{fontFamily:'sans-serif',fontSize:portrait?'11px':'9px',color:'#d8cce0',wordWrap:{width:panelX+panelW-tx-14},maxLines:portrait?3:2}).setOrigin(0,0);this.menu.add([ic,title,type,desc]);
    let body='';if(sel.isPass){const pairs=COMBOS.filter(c=>c.b===sel.key);body='Per level\n'+d.desc+'\n\nPairs to unlock Awaken\n'+(pairs.length?pairs.map(c=>'• '+SKILLDEFS[c.a].name+' → '+SKILLDEFS[c.a].awaken.name).join('\n'):'• No skill pairs with this passive yet');}
    else{const tiers=SKILL_TIERS[sel.key]||{},combo=COMBOS.find(c=>c.a===sel.key);body='Skill progression\n• Lv1 — '+d.desc+'\n'+[2,3,4,5].map(l=>'• Lv'+l+' — '+(tiers[l]||'Upgrade')).join('\n')+'\n\n⚡ Awaken: '+d.awaken.name+'\n'+d.awaken.desc+'\nRequired pair: '+(combo&&PASSIVES[combo.b]?PASSIVES[combo.b].name:'None');}
    const bodyY=panelY+(portrait?112:84),bodyTxt=this.add.text(panelX+18,bodyY,body,{fontFamily:'sans-serif',fontSize:portrait?'11px':'9px',color:'#ddd1e5',lineSpacing:portrait?5:2,wordWrap:{width:panelW-36},maxLines:portrait?14:9}).setOrigin(0,0);this.menu.add(bodyTxt);
    const bw=Math.min(180,panelW-36),bh=30,bx=panelX+panelW/2-bw/2,by=panelY+panelH-bh-12,bg=this.add.graphics();bg.fillStyle(0x3c3048,1);bg.fillRoundedRect(bx,by,bw,bh,10);bg.lineStyle(1.4,0xa98cf0,1);bg.strokeRoundedRect(bx,by,bw,bh,10);const bt=this.add.text(bx+bw/2,by+bh/2,'‹ Back to skills',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(0.5);this.menu.add([bg,bt]);this._zone(bx,by,bw,bh,()=>{this._skillArchiveSelected=null;this.buildSkillArchive();});
  }
  buildStartMenu(){ this.buildMenuScreen(); }   // เผื่อโค้ดเก่าเรียก
  ensureDaily(){
    const d=Save.data.daily||(Save.data.daily={claimDay:'',streak:0,challengeDay:'',challengeDone:false}),today=localDayKey();
    if(d.challengeDay!==today){d.challengeDay=today;d.challengeDone=false;d.challengeProgress=0;d.challengeSpec=dailySpec();Save.save();}
    else if(!d.challengeSpec){d.challengeSpec=dailySpec();d.challengeProgress=d.challengeDone?d.challengeSpec.target:0;Save.save();}
    return{data:d,spec:d.challengeSpec};
  }
  advanceDaily(kind,n=1){ if(typeof DailyQ!=='undefined')DailyQ.tick(kind,n); }   // v7.8.87 Daily เก่าตัดแล้ว เหลือ Daily Quests
  // v8.0.71 เจ้าของ: หน้า Rewards = แท็บ Login (ปฏิทิน 7 วัน) · Daily · Awards — คืนความสูงที่ใช้
  rewardsTabs(active){ if(typeof featureOpen==='function'&&!featureOpen('rewards'))return 0; this._rwLast=active; const w=this.W,y=w<=this.H?80:46,h=32,gap=6,nT=(typeof RANKING_ON==='undefined'||RANKING_ON)?4:3,bw=Math.min(118,(w-28-gap*(nT-1))/nT),x0=(w-(bw*nT+gap*(nT-1)))/2,cal=typeof LoginCal!=='undefined'?LoginCal.data():null,ready=typeof LoginCal!=='undefined'&&LoginCal.ready();
    const tabs=[['login','📅 Login',ready],['daily','📋 Daily',typeof DailyQ!=='undefined'&&DailyQ.claimable()],['achievements','🏆 Awards',this.hasTargetBadge('achievements')],...((typeof RANKING_ON==='undefined'||RANKING_ON)?[['ranking','👑 Ranks',false]]:[])];   /* v8.2.54 ECRS2 E5: ซ่อน Ranking ช่วง Closed test (ไม่มีใครเปิด · ยังไม่มีเซิร์ฟเวอร์ตรวจคะแนน) */
    tabs.forEach(([k,lab,dot],i)=>{ const x=x0+i*(bw+gap),on=k===active,g=this.add.graphics(); g.fillStyle(on?0xf4d9a1:0x261e30,on?1:.94).fillRoundedRect(x,y,bw,h,12).lineStyle(1.5,on?0xfff1e7:0x6d536d,1).strokeRoundedRect(x,y,bw,h,12); this.menu.add(g);
      const ik={login:'tab_login',daily:'tab_daily',achievements:'tab_awards'}[k],ic=this.m59Img?.(ik,0,y+h/2,24),lb=ic?lab.replace(/^\S+\s/,''):lab,t=this.add.text(x+bw/2+(ic?12:0),y+h/2,lb,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:on?'#3b2416':'#fff1e7'}).setOrigin(.5); if(t.width>bw-(ic?40:10))t.setScale((bw-(ic?40:10))/t.width); this.menu.add(t); if(ic){ ic.setX(t.x-t.displayWidth/2-14); this.menu.add(ic); }   /* ใบ 59 */ if(dot)this.drawBadgeDot?.(this.menu,x+bw-6,y+5);
      this._zone(x,y,bw,h,()=>{ if(k==='login'){ this.loginPopup(ready?'daily':'preview'); return; } if(k===active)return; Sfx.select?.(); this.menuScreen=k; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag='rw_'+k; });
    return h+10; }
  buildDaily(){   // v7.5 Daily Quests: รางวัลเข้าเกม + แต้มภารกิจ 5 ข้อ + กล่อง 3 ขั้น
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('📅 Daily Quests','screen_daily');
    const w=this.W,h=this.H,q=DailyQ.data();const seen=this._dqSoundSeen||(this._dqSoundSeen=new Set());let freshDone=false;for(const it of q.quests){const id=q.day+':'+it.id;if(DailyQ.done(it)&&!seen.has(id)){seen.add(id);freshDone=true;}}if(freshDone)Sfx.menuCue?.('dq_done',.25);
    const T=(x,y,t,sz,c,st,ox=0.5,oy=0.5)=>{const q2=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:Math.max(11,sz)+'px',color:c||'#ffffff'}).setOrigin(ox,oy);this.menu.add(q2);return q2;};
    const panel=(y,height,color)=>{const g=this.add.graphics();g.fillStyle(0x241d2d,0.97);g.fillRoundedRect(14,y,w-28,height,14);g.lineStyle(2,color,0.9);g.strokeRoundedRect(14,y,w-28,height,14);this.menu.add(g);return g;};
    // v8.0.24 รางวัลเข้าเกมย้ายไปเป็นป๊อปอัปปฏิทิน 7 วัน (loginPopup) · หน้านี้เหลือแต่ภารกิจ
    const y1=(w<=h?84:62)+(this.rewardsTabs?.('daily')||0),h1=-8;
    // 2) v8.0.20 ความคืบหน้า n/10 + กล่อง 3/6/8 ข้อ + Weekly 7 ช่อง (หีบทอง)
    const N=q.quests.length,cnt=DailyQ.count(),wk=DailyQ.week(),y2=y1+h1+8,h2=128;panel(y2,h2,0xd95cff);
    T(28,y2+18,'⭐ Today',14,'#e7b7ff','bold',0);T(w-28,y2+18,cnt+' / '+N+' done',13,'#ffffff','bold',1);
    const bx0=34,bw0=w-68,barY=y2+56,bar=this.add.graphics();bar.fillStyle(0x120d18,1);bar.fillRoundedRect(bx0,barY-5,bw0,10,5);if(cnt>0){bar.fillStyle(0xd95cff,1);bar.fillRoundedRect(bx0,barY-5,Math.max(10,bw0*Math.min(1,cnt/N)),10,5);}this.menu.add(bar);
    DQ_BOXES.forEach((b,i)=>{ const sz=i===2?40:34,cx=Math.min(bx0+bw0*b.n/N,w-22-sz*.62),opened=!!q.boxes[i],ready=!opened&&cnt>=b.n;
      const ring=this.add.graphics();ring.fillStyle(ready?0xffd166:0x1d1724,ready?0.35:0.9);ring.fillCircle(cx,barY-2,sz*0.62);ring.lineStyle(2,ready?0xffe08a:opened?0x7fe3a8:0x4a4059,1);ring.strokeCircle(cx,barY-2,sz*0.62);this.menu.add(ring);
      const ic=this.menuArtIcon?.('dq_box',i*2+(opened?1:0),cx,barY-2,sz,sz)|| (this.textures.exists(b.art)?this.add.image(cx,barY-2,b.art).setDisplaySize(sz,sz):this.add.text(cx,barY-2,'🎁',{fontSize:Math.round(sz*0.6)+'px'}).setOrigin(0.5));ic.setAlpha(opened?0.7:ready?1:0.6);this.menu.add(ic);
      T(cx,barY+sz*0.62+8,opened?'✓':b.n+' quests',9,opened?'#7fe3a8':ready?'#ffe08a':'#cfc1d4','bold');
      if(ready){ this.drawBadgeDot(this.menu,cx+sz*0.45,barY-sz*0.55); this.tweens.add({targets:ic,scaleX:ic.scaleX*1.12,scaleY:ic.scaleY*1.12,duration:420,yoyo:true,repeat:-1,ease:'Sine.easeInOut'}); this._zone(cx-sz*0.7,barY-sz*0.7,sz*1.4,sz*1.4+14,()=>this.dqOpenBox(i)); } });
    { const wy=y2+104,ss=Math.min(22,(w-150)/DQ_WEEK-4); T(28,wy,'📆 Week',11,'#ffe08a','bold',0,.5);
      for(let k=0;k<DQ_WEEK;k++){ const cx=84+k*(ss+4)+ss/2,on=k<wk.days.length,gg=this.add.graphics(); gg.fillStyle(on?0xffcf5a:0x1d1724,1).fillRoundedRect(cx-ss/2,wy-ss/2,ss,ss,5); gg.lineStyle(1.5,on?0xffe08a:0x4a4059,1).strokeRoundedRect(cx-ss/2,wy-ss/2,ss,ss,5); this.menu.add(gg); const pip=this.menuArtIcon?.('dq_week_pip',on?1:0,cx,wy,ss,ss);if(pip)gg.clear();else if(on)T(cx,wy,'✓',11,'#2a1a08','bold'); }
      const gx=w-44,ready=DailyQ.weekReady(),gk='chest_gold',gi=this.textures.exists(gk)?this.add.image(gx,wy,gk).setDisplaySize(32,32):this.add.text(gx,wy,'🧰',{fontSize:'22px'}).setOrigin(.5); gi.setAlpha(wk.got?.4:ready?1:.55); this.menu.add(gi);
      T(gx,wy+19,wk.got?'✓':DQ_WEEK_NEED+'/'+N+' a day',8,'#cfc1d4','normal');
      if(ready){ this.drawBadgeDot(this.menu,gx+14,wy-14); this._zone(gx-22,wy-20,44,40,()=>{ if(!DailyQ.weekReady())return; DailyQ.week().got=1; Save.save(); this.openChest(CHESTS.find(c=>c.id==='gold')||CHESTS[CHESTS.length-1],'weekly'); }); } }
    // 3) ภารกิจ 10 ข้อ · แถบสีซ้าย = ระดับ · 🔄 เปลี่ยนได้ฟรีวันละ 1
    const y3=y2+h2+8,rows=q.quests,gap=4,rh=Math.max(30,Math.min(46,(h-y3-26)/rows.length-gap)),fs=rh<36?11:12;
    rows.forEach((it,i)=>{ const def=dqDef(it.id),done=DailyQ.done(it),y=y3+i*(rh+gap),bd=DQ_BAND[def.b]||DQ_BAND[0],g=this.add.graphics();g.fillStyle(done?0x1f3328:0x221a2b,0.97);g.fillRoundedRect(14,y,w-28,rh,10);g.lineStyle(1.5,done?0x7fe3a8:0x4a4059,1);g.strokeRoundedRect(14,y,w-28,rh,10);g.fillStyle(bd.col,1);g.fillRoundedRect(14,y,5,rh,3);this.menu.add(g);
      if(!this.menuArtIcon?.('dq_band',def.b,34,y+rh/2,18))T(34,y+rh/2,def.emoji,rh<36?15:18,'#fff','normal',0.5);
      const rr=!q.rr&&!done,right=rr?78:56,nm=T(52,y+rh*.36,def.name,fs,done?'#a8f0c0':'#ffffff','bold',0); const maxW=w-28-52-right-6; if(nm.width>maxW)nm.setScale(maxW/nm.width);
      const pw=Math.min(150,w-28-52-right-60),pb=this.add.graphics(),fr=Math.min(1,(it.p||0)/def.target);pb.fillStyle(0x120d18,1);pb.fillRoundedRect(52,y+rh*.7-3,pw,6,3);if(fr>0){pb.fillStyle(done?0x7fe3a8:bd.col,1);pb.fillRoundedRect(52,y+rh*.7-3,Math.max(6,pw*fr),6,3);}this.menu.add(pb);
      T(52+pw+6,y+rh*.7,Math.min(it.p||0,def.target)+' / '+def.target+' · '+bd.name,9,'#cfc2d5','normal',0);
      T(w-28-(rr?44:20),y+rh/2,done?'✓':'›',done?16:16,done?'#7fe3a8':'#cbb8e0','bold',0.5);
      if(!done)this._zone(14,y,w-28-(rr?40:0),rh,()=>{ Sfx.select&&Sfx.select(); this.menuScreen=def.go==='stage'?'chapter':def.go; this.buildMenuScreen(); });
      if(rr){ const rx=w-28-18,rb=this.add.graphics(); rb.fillStyle(0x3a2f50,1).fillRoundedRect(rx-17,y+rh/2-13,34,26,8); rb.lineStyle(1.5,0x8f7de8,1).strokeRoundedRect(rx-17,y+rh/2-13,34,26,8); this.menu.add(rb); if(!this.menuArtIcon?.('ic_reroll',0,rx,y+rh/2,20))T(rx,y+rh/2,'🔄',13,'#fff','normal');
        this._zone(rx-20,y,40,rh,()=>{ if(DailyQ.reroll(i)){ Sfx.menuCue?.('dq_reroll',.32)||Sfx.select&&Sfx.select(); this.menuToast?.('🔄 Quest changed — next free change tomorrow','#cfe9ff'); } this.buildDaily(); }); } });
    const left=Math.max(0,new Date().setHours(24,0,0,0)-Date.now()),hh=Math.floor(left/3.6e6),mm=Math.floor(left%3.6e6/6e4);
    T(w/2,Math.min(h-10,y3+rows.length*(rh+gap)+8),'New quests in '+hh+'h '+mm+'m · '+(q.rr?'free change used today':'🔄 1 free change today'),10,'#cfc1d4');
    this.menu.setVisible(true); if(typeof LoginCal!=='undefined'&&LoginCal.ready())this.time?.delayedCall(300,()=>{ if(this.menuScreen==='daily')this.loginPopup('daily'); });
  }
  // เปิดกล่อง Daily: ยิ่งกล่องใหญ่ ยิ่งได้มาก · ไม่นับเป็นความคืบหน้าภารกิจ (เช่น Sugar)
  dqOpenBox(i){ const q=DailyQ.data(),b=DQ_BOXES[i]; if(!b||q.boxes[i]||DailyQ.count()<b.n)return; q.boxes[i]=1;
    const ch=Math.min(2,Math.floor((Save.data.unlockedStage||0)/5)),m=Save.data.stageMastery||{},lines=[];
    DailyQ._mute=true; try{
      const sug=Math.round([80,160,320][i]*(1+ch*0.5)); Save.addSugar(sug); lines.push('🍬 +'+sug+' Sugar');
      if(m[0]){ const sh=[8,16,32][i]; Save.addThreads(sh); lines.push('🧶 +'+sh+' Weave Thread');
        const nc=[0,2,4][i],got={}; for(let k=0;k<nc;k++){ const rk=typeof rollWeightedCurrency==='function'?rollWeightedCurrency('rare'):'transmute',c=CURRENCY.find(x=>x.key===rk)||CURRENCY[0]; Save.addCurrency(c.key,1); got[c.key]=(got[c.key]||0)+1; }
        for(const k in got){ const c=CURRENCY.find(x=>x.key===k); lines.push((c.emoji||'✦')+' +'+got[k]+' '+c.name); } }
      if(i===2&&m[0]){ const it=this.grantGear(Math.random()<0.25?'epic':'rare'); if(it)lines.push('🎁 '+(it.name||'Gear item')+(it.delivery==='inbox'?' (Inbox)':'')); }
    } finally { DailyQ._mute=false; }
    Save.save(); try{ Sfx.menuCue?.('dq_box_'+['s','m','l'][i],.45)||Sfx.rewardCue(['sfx_event_loot_rare_reveal','sfx_event_loot_epic_reveal','sfx_chest_win'][i],0.6); }catch(e){ try{Sfx.clear();}catch(_){} }
    const w=this.W,h=this.H,c=this.add.container(0,0).setDepth(9000);this.menu.add(c);
    const ov=this.add.rectangle(0,0,w,h,0x07040c,0.78).setOrigin(0,0),pw=Math.min(w-40,320),ph=170+lines.length*24,px=(w-pw)/2,py=(h-ph)/2,g=this.add.graphics();g.fillStyle(0x241d2d,1);g.fillRoundedRect(px,py,pw,ph,16);g.lineStyle(2,0xffd166,1);g.strokeRoundedRect(px,py,pw,ph,16);c.add([ov,g]);
    if(this.tuHas?.('dq_box')||this.textures.exists(b.art)){ const im=this.menuArtIcon?.('dq_box',i*2+1,w/2,py+52,72,72,c)||this.add.image(w/2,py+52,b.art).setDisplaySize(72,72);c.add(im);this.tweens.add({targets:im,scaleX:im.scaleX*1.15,scaleY:im.scaleY*1.15,duration:260,yoyo:true}); }
    c.add(this.add.text(w/2,py+100,b.name+' opened!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffe08a'}).setOrigin(0.5));
    lines.forEach((t,k)=>c.add(this.add.text(w/2,py+132+k*24,t,{fontFamily:'sans-serif',fontSize:'13px',color:'#ffffff'}).setOrigin(0.5)));
    c.add(this.add.text(w/2,py+ph-22,'Tap to continue',{fontFamily:'sans-serif',fontSize:'11px',color:'#a89cb6'}).setOrigin(0.5));
    this.tapZones=[{x:0,y:0,w,h,fn:()=>this.buildDaily()}];
  }
  // 👑 BOSS RUSH — สู้บอสทุกตัวที่เคยล้มติดกัน · เลือกความยาก (กฎเหล็ก: ยิ่งยากรางวัลยิ่งดี) · จับเวลา + สถิติดีสุด
  bossRushList(){ const m=Save.data.stageMastery||[],out=[]; for(let i=0;i<STAGES.length;i++)if(m[i]&&isStageReady(i))out.push(i); return out; }
  buildBossRush(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('👑 Boss Rush','screen_bossrush');
    const w=this.W,h=this.H,portrait=w<=h,list=this.bossRushList(),best=Save.data.bossRushBest||{},top=portrait?100:70,cw=Math.min(w-28,460),cx=(w-cw)/2;
    const diff=this._rushDiff||1; this._rushDiff=diff;
    const T=(y,t,sz,c,st)=>{const o=this.add.text(w/2,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:c,align:'center',wordWrap:{width:cw-20}}).setOrigin(0.5,0);this.menu.add(o);return o;};
    T(top,'Fight every boss you’ve defeated, back-to-back.\nNo waves — just bosses. Level-ups between fights.',12,'#e6dcf0');
    const locked=list.length<2;
    // รายชื่อบอส
    const rowY=top+48,rh=Math.min(30,(h*0.40)/Math.max(1,STAGES.length));
    {const pg=this.add.graphics();pg.fillStyle(0x1a1222,.82).fillRoundedRect(cx,rowY-8,cw,STAGES.length*rh+14,12);pg.lineStyle(1.5,0x4a4059,1).strokeRoundedRect(cx,rowY-8,cw,STAGES.length*rh+14,12);this.menu.add(pg);}   // v7.8.70: แผงเข้มรองรายชื่อ (เดิมตัวเทาบนพื้นสว่างอ่านไม่ออก)
    STAGES.forEach((st,i)=>{ const y=rowY+i*rh,on=list.includes(i); const t=this.add.text(cx+14,y,(on?'✅ ':'🔒 ')+st.emoji+' '+(st.boss||st.name),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:on?'#ffffff':'#a89cb6'}).setOrigin(0,0); this.menu.add(t); });
    let y=rowY+STAGES.length*rh+10;
    if(locked){ T(y,'🔒 Defeat at least 2 stage bosses to unlock Boss Rush',13,'#ff9bb5','bold'); this.menu.setVisible(true); return; }
    const b=best[diff]; T(y,'🏆 Best ('+DIFFS[diff-1].name+'): '+(b?(b.n+' bosses · '+this._fmtTime(b.t)):'—'),12,'#ffe08a','bold'); y+=30;
    // เลือกความยาก
    const dw=(cw-16)/3; DIFFS.slice(0,3).forEach((d,i)=>{ const x=cx+i*(dw+8),sel=diff===i+1,g=this.add.graphics(); g.fillStyle(sel?0x5a3d7a:0x241a30,1); g.fillRoundedRect(x,y,dw,40,10); g.lineStyle(2,sel?0xffd166:0x4a4059,1); g.strokeRoundedRect(x,y,dw,40,10);
      const t=this.add.text(x+dw/2,y+20,d.emoji+' '+d.name+'\n×'+d.reward+' reward',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff',align:'center'}).setOrigin(0.5); this.menu.add([g,t]); this._zone(x,y,dw,40,()=>{this._rushDiff=i+1;this.buildBossRush();}); });
    y+=56;
    this.uiPillBtn(this.menu,w/2,y+26,Math.min(cw,300),52,COLORS.pink,'👑','Start Boss Rush ('+list.length+')',()=>{ this.stageDiff=this._rushDiff||1; this._bossRushRequested=true; this.startRun(list[0]); });
    this.menu.setVisible(true);
  }
  // 🌀 Mochi Rift menu — เลือก Tier · สุ่มด่าน+mod (Reroll ฟรี) · Pinnacle ใช้ 3 กุญแจ
  recipeBag(){ if(!Array.isArray(Save.data.recipes))Save.data.recipes=[]; return Save.data.recipes; }
  // R9: เซฟเก่าที่เคยเล่น Rift → แจก recipe ตาม Tier ที่ไปถึง 1 ครั้ง (กุญแจเดิมใช้เปิด Pinnacle ต่อได้)
  startPinnacle(){ const keys=Save.data.riftKeys||0; if(atlasPinnacleOpen()&&!Save.data.pinnacleFreeUsed){ Save.data.pinnacleFreeUsed=true; Save.save(); this._pinnaclePaid={free:true}; this.stageDiff=3; this._pinnacleRequested=true; this.startRun(14); return; } if(keys<PINNACLE_KEY_COST){this.menuToast('Need '+PINNACLE_KEY_COST+' 🗝️ keys — every '+RECIPE_FRAGS_PER_KEY+' 🧩 fragments from recipe bosses make one','#ff9bb5');return;}
    Save.data.riftKeys=keys-PINNACLE_KEY_COST; Save.save(); this._pinnaclePaid={keys:PINNACLE_KEY_COST}; this.stageDiff=3; this._pinnacleRequested=true; this.startRun(14); }
  buildAtlas(){
    this.menu.removeAll(true);this.tapZones=[];this._amRect=null;this._amView=null;this._amDrag=null;this._screenBg('⛏ Mochi Delve','screen_atlas');
    const w=this.W,h=this.H,cw=Math.min(w-28,460),cx=(w-cw)/2,at=atlasData();let top=(w<=h?100:70);const th=recipeThemes(),best=Save.data.recipeBest||{};
    const T=(x,y,t,sz,c,st)=>{const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:c,align:'center',wordWrap:{width:cw-16}}).setOrigin(0.5,0);this.menu.add(q);return q;};
    const tab=this._atlasTab==='tree'?'tree':'board',tw2=(cw-10)/2;
    [['board','⛏ Delve'],['tree','🏁 Depth Track']].forEach(([k,l],i)=>{ const x=cx+i*(tw2+10),g=this.add.graphics();g.fillStyle(tab===k?0x6b2bd9:0x241a30,1);g.fillRoundedRect(x,top-4,tw2,30,10);this.menu.add(g);
      const q=this.add.text(x+tw2/2,top+11,l,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffffff'}).setOrigin(0.5);this.menu.add(q); this._zone(x,top-4,tw2,30,()=>{this._atlasTab=k;this.buildAtlas();}); });
    if(tab==='tree'){ this.buildAtlasTree(cx,cw,top+36,T); this.menu.setVisible(true); return; }
    top+=36;
    this.buildAtlasMap(cx,cw,top); this.menu.setVisible(true);
  }
  // v6.3.0: หน้าเตรียมรัน Recipe หน้าเดียว — แผนที่ · Build · Pact · เป้าดรอป · ตัวคูณรวม · Run
  // v6.19: แผนที่ Atlas แบบเดินทาง — วาดด้วยโค้ด (ถ้ามีอาร์ต atlas_map_bg / atlas_node_* / atlas_hub / atlas_pinnacle จะใช้แทน)
  // v6.21: Atlas ทั้ง 100 แมพบนผืนเดียว · ลากเพื่อ pan · หยิก/ปุ่ม +− เพื่อซูม · แตะแมพ = ดูข้อมูล แตะซ้ำ = วางแผนรัน
  // v6.30 Mochi Delve: ผืนแผนที่สูงไม่จำกัด · วาดเฉพาะแถวรอบมุมมอง (band) แล้ว rebuild เมื่อเลื่อนออกนอก band
  atlasLayout(){ if(this._amLayout)return this._amLayout; const CW=64,RH=96,C0=(DELVE_W+1.5)*CW,top=90,maxD=delveDeepest()+1;
    const pos=n=>({x:C0+(n.x+n.jx)*CW,y:top+(n.d+n.jy)*RH});
    return (this._amLayout={CW,RH,C0,top,MW:C0*2,H:top+(maxD+10)*RH,maxD,fogD:maxD+3,landD:maxD+8,pos,rowAt:y=>Math.floor((y-top)/RH)}); }
  atlasViewClamp(){ const v=this._amv,R=this._amRect,L=this.atlasLayout(); if(!v||!R)return; v.s=Math.max(v.min,Math.min(2.4,v.s));
    const w=L.MW*v.s,h=L.H*v.s; v.x=w<=R.w?(R.w-w)/2:Math.min(0,Math.max(R.w-w,v.x)); v.y=h<=R.h?(R.h-h)/2:Math.min(0,Math.max(R.h-h,v.y));
    if(this._amView)this._amView.setPosition(R.x+v.x,R.y+v.y).setScale(v.s); }
  atlasViewFocus(mx,my,s){ const v=this._amv,R=this._amRect; if(s)v.s=s; v.x=R.w/2-mx*v.s; v.y=R.h/2-my*v.s; this.atlasViewClamp(); this.atlasBandCheck(); }
  atlasZoomAt(sx,sy,ns){ const v=this._amv,R=this._amRect,mx=(sx-R.x-v.x)/v.s,my=(sy-R.y-v.y)/v.s; v.s=Math.max(v.min,Math.min(2.4,ns)); v.x=sx-R.x-mx*v.s; v.y=sy-R.y-my*v.s; this.atlasViewClamp(); this.atlasBandCheck(); }
  atlasVisRows(){ const v=this._amv,R=this._amRect,L=this.atlasLayout(); return [L.rowAt(-v.y/v.s)-1,L.rowAt((R.h-v.y)/v.s)+1]; }
  atlasBandCheck(){ const b=this._amBand; if(!b||!this._amView)return; const [a,z]=this.atlasVisRows(); if(a<b[0]||z>b[1])this.buildAtlas(); }
  atlasPointerDown(p){ const R=this._amRect; if(!R||p.x<R.x||p.x>R.x+R.w||p.y<R.y||p.y>R.y+R.h)return false;
    const d=this._amDrag||(this._amDrag={pts:{}}); d.pts[p.id]={x:p.x,y:p.y,sx:p.x,sy:p.y}; const ids=Object.keys(d.pts);
    if(ids.length===1){ d.moved=false; d.ox=this._amv.x; d.oy=this._amv.y; d.id=p.id; }
    else if(ids.length===2){ const [a,b]=ids.map(k=>d.pts[k]); d.pinch={d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:this._amv.s}; d.moved=true; }
    return true; }
  atlasPointerMove(p){ const d=this._amDrag; if(!d||!d.pts[p.id])return false; const q=d.pts[p.id]; q.x=p.x; q.y=p.y; const ids=Object.keys(d.pts);
    if(ids.length>=2&&d.pinch){ const [a,b]=ids.slice(0,2).map(k=>d.pts[k]); const v=this._amv,R=this._amRect,ns=Math.max(v.min,Math.min(2.4,d.pinch.s0*Math.hypot(a.x-b.x,a.y-b.y)/d.pinch.d0)),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2,mx=(cx-R.x-v.x)/v.s,my=(cy-R.y-v.y)/v.s; v.s=ns; v.x=cx-R.x-mx*v.s; v.y=cy-R.y-my*v.s; this.atlasViewClamp(); return true; }
    if(p.id===d.id){ if(Math.hypot(p.x-q.sx,p.y-q.sy)>8)d.moved=true; if(d.moved){ this._amv.x=d.ox+(p.x-q.sx); this._amv.y=d.oy+(p.y-q.sy); this.atlasViewClamp(); } }
    return true; }
  atlasPointerUp(p){ const d=this._amDrag; if(!d||!d.pts[p.id])return false; const tap=!d.moved&&Object.keys(d.pts).length===1; delete d.pts[p.id];
    if(!Object.keys(d.pts).length){ this._amDrag=null; if(!tap){ this.atlasBandCheck(); } } else { d.pinch=null; const k=Object.keys(d.pts)[0],q=d.pts[k]; q.sx=q.x; q.sy=q.y; d.id=+k; d.ox=this._amv.x; d.oy=this._amv.y; d.moved=true; }
    if(tap)this.atlasTapAt(p.x,p.y); return true; }
  atlasTapAt(sx,sy){ const v=this._amv,R=this._amRect,L=this.atlasLayout(),mx=(sx-R.x-v.x)/v.s,my=(sy-R.y-v.y)/v.s; let hit=null,bd=26+14/v.s;
    const d0=Math.max(0,L.rowAt(my)-1); for(let d=d0;d<=Math.min(d0+2,L.landD);d++)delveRow(d).forEach(n=>{ const q=L.pos(n),dd=Math.hypot(mx-q.x,my-q.y); if(dd<bd){bd=dd;hit=n;} }); if(!hit)return;
    Sfx.select&&Sfx.select();
    if(hit.d===0){ if(atlasPinnacleOpen()||(Save.data.riftKeys||0)>=PINNACLE_KEY_COST)this.startPinnacle(); else this.menuToast('🏠 Mochitopia · conquer Boss Floor 30 (or find 🗝 in Candy Cities) to face The Hunger Beneath','#ff9bb5'); return; }
    if(!amapOpen(hit.id)){ const nd=amapNode(hit.id); this.menuToast(nd&&(nd.type==='city'||nd.type==='boss')&&hit.d<=L.landD?'🌫️ '+AMAP_TYPES[nd.type].emoji+' '+AMAP_TYPES[nd.type].name+' at Depth '+hit.d+' · dig a path to reach it':'🌫️ Clear a connected cave to reveal this place','#ff9bb5'); return; }
    this._amapSel=hit.id; const mt=mapTable(); mt.node=hit.id; Save.save(); this.buildAtlas(); }
  buildAtlasMap(cx,cw,top){
    const w=this.W,h=this.H; this._amLayout=null; const L=this.atlasLayout(),next=amapNext(),dv=delveSave();
    if(Save.data.delveComp){ const N=Save.data.delveComp; delete Save.data.delveComp; Save.addSugar(40*N); Save.addCurrency('chaos',Math.ceil(N/4)); Save.save(); this.menuToast('⛏ The Atlas became Mochi Delve · '+N+' old maps refunded: 🍬'+(40*N)+' + chaos ×'+Math.ceil(N/4),'#9dff9d'); }
    const T=(x,y,t,sz,c,st,o)=>{const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:c,align:'center'}).setOrigin(0.5,o===undefined?0.5:o);this.menu.add(q);return q;};
    T(w/2,top+6,'⛏ Mochi Delve · Record Depth '+(dv.best||0)+' · Bosses '+delveBossesDown(),w<360?10:12,'#ffe08a','bold');
    const selN=this._amapSel!=null?amapNode(this._amapSel):null,panel=!!(selN&&selN.d>0&&amapOpen(selN.id)),PH=panel?232:0;
    const R=this._amRect={x:cx,y:top+62,w:cw,h:h-62-(top+62)-PH};
    const fit=R.w/L.MW; if(!this._amv){ this._amv={x:0,y:0,s:0.8,min:fit}; const nn=next&&amapNode(next),q=nn?L.pos(nn):{x:L.C0,y:L.top}; this._amv.x=R.w/2-q.x*0.8; this._amv.y=R.h/2-q.y*0.8; } this._amv.min=fit;
    const tb=(cw-3*8)/4; [{e:'🏠',lbl:'Mochitopia',fn:()=>this.atlasViewFocus(L.C0,L.top,Math.max(this._amv.s,0.8))},
      {e:'⬇',lbl:'frontier',fn:()=>{ const nn=next&&amapNode(next); if(nn){const q=L.pos(nn); this._amapSel=next; this.atlasViewFocus(q.x,q.y,Math.max(this._amv.s,0.8)); this.buildAtlas();} }},
      {e:'➕',lbl:'zoom in',fn:()=>this.atlasZoomAt(R.x+R.w/2,R.y+R.h/2,this._amv.s*1.35)},
      {e:'➖',lbl:'zoom out',fn:()=>this.atlasZoomAt(R.x+R.w/2,R.y+R.h/2,this._amv.s/1.35)}].forEach((t,k)=>{ const x=cx+k*(tb+8),y=top+20,g=this.add.graphics();
      g.fillStyle(0x241a30,1); g.fillRoundedRect(x,y,tb,36,8); g.lineStyle(2,0x8d8499,0.8); g.strokeRoundedRect(x,y,tb,36,8); this.menu.add(g); T(x+tb/2,y+12,t.e,13,'#ffffff'); T(x+tb/2,y+28,t.lbl,8,'#cfc2df','bold'); this._zone(x,y,tb,36,t.fn); });
    const bgG=this.add.graphics(); bgG.fillStyle(0x0d0913,1); bgG.fillRoundedRect(R.x,R.y,R.w,R.h,14); this.menu.add(bgG);
    const view=this._amView=this.add.container(0,0); this.menu.add(view);
    const mk=this.make.graphics({x:0,y:0},false); mk.fillStyle(0xffffff); mk.fillRoundedRect(R.x,R.y,R.w,R.h,14); view.setMask(mk.createGeometryMask());
    const V=(o)=>{view.add(o);return o;}, VT=(x,y,t,sz,c,st)=>V(this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:c,align:'center'}).setOrigin(0.5));
    this.atlasViewClamp(); const [va,vz]=this.atlasVisRows(),d0=Math.max(0,va-12),d1=Math.min(L.landD,vz+12); this._amBand=[d0,d1];
    // เขตรส (พื้น) · แถบสีต่อช่อง (placeholder ของ delve_bg_<flavor>)
    // v6.34.1: เลิกปูพื้นรสเป็น tileSprite ต่อช่วง (158 ชิ้น → มือถือค้าง/แอปปิด) · ใช้แถบสีเดิม
    const bg=V(this.add.graphics());
    for(let d=Math.max(1,d0);d<=d1;d++){ const fogA=d>L.fogD?0.35:1; for(let x=-DELVE_W-1;x<=DELVE_W+1;x++){ const fl=delveFlavorAt(x,d); bg.fillStyle(fl.color,0.10*fogA); bg.fillRect(L.C0+(x-0.5)*L.CW,L.top+(d-0.5)*L.RH,L.CW+1,L.RH+1); }
      if(d%DELVE_SEG===0){ bg.lineStyle(2,0xffd166,0.35); bg.lineBetween(0,L.top+d*L.RH,L.MW,L.top+d*L.RH); }
      if(d%5===0||d===1)VT(18,L.top+d*L.RH,'D'+d,11,'#cfc2df','bold').setAlpha(0.7); }
    if(this.textures.exists('delve_fog')&&d1>L.fogD){ const fy=L.top+(Math.max(d0,L.fogD)+0.5)*L.RH; V(this.add.tileSprite(0,fy,L.MW,L.top+(d1+1)*L.RH-fy,'delve_fog').setOrigin(0,0).setAlpha(0.55)); }
    // ป้ายเขตรส (ทุก 10 ชั้น)
    for(let d=Math.max(5,d0-(d0%10)+5);d<=d1;d+=10){ let prev=null; for(let x=-DELVE_W;x<=DELVE_W;x++){ const fl=delveFlavorAt(x,d); if(fl!==prev){ VT(L.C0+x*L.CW+40,L.top+(d-0.42)*L.RH,fl.emoji+' '+fl.name.toUpperCase(),11,'#ffffff','bold').setAlpha(d<=L.fogD?0.55:0.25); prev=fl; } } }
    // เส้นทาง
    const lg=V(this.add.graphics()),vis=n=>n.d<=L.fogD;
    for(let d=d0;d<=d1;d++){ if(d+1>L.fogD&&d>L.fogD)break; const Lk=delveLinks(d); [...Lk.E,...Lk.H].forEach(([a,b])=>{ const A=amapNode(a),B=amapNode(b); if(!vis(A)||!vis(B))return; const pa=L.pos(A),pb=L.pos(B),ca=amapCleared(a),cb=amapCleared(b);
      const w=ca&&cb?7:ca||cb?5:3,col=ca&&cb?0xffd166:ca||cb?0xe6dcf0:0x5a4d6a,al=ca&&cb?0.95:ca||cb?0.75:0.45;
      // v6.32 ทางแบบอุโมงค์ Delve: ลง → เลี้ยว → ลง (มุมฉาก) · จุดเลี้ยวขยับตาม seed
      const path=A.d===B.d?[pa,pb]:(()=>{ const my=pa.y+(pb.y-pa.y)*(0.3+0.4*_dh(A.x*31+B.x,A.d+977)); return [pa,{x:pa.x,y:my},{x:pb.x,y:my},pb]; })();
      lg.lineStyle(w+4,0x0a0710,al*0.8); for(let i=0;i+1<path.length;i++)lg.lineBetween(path[i].x,path[i].y,path[i+1].x,path[i+1].y);
      lg.lineStyle(w,col,al); for(let i=0;i+1<path.length;i++)lg.lineBetween(path[i].x,path[i].y,path[i+1].x,path[i+1].y);
      lg.fillStyle(col,al); for(let i=1;i+1<path.length;i++)lg.fillCircle(path[i].x,path[i].y,w/2); }); }
    // node
    const ng=V(this.add.graphics());
    for(let d=d0;d<=d1;d++)delveRow(d).forEach(r=>{ const n=amapNode(r.id),q=L.pos(n),open=amapOpen(n.id),t=amapClears(n.id),sel=this._amapSel===n.id,land=n.type==='city'||n.type==='boss'||n.type==='home';
      if(!open&&d>L.fogD&&!land)return; const big=land?24:n.type==='normal'?15:18,col=n.flavor.color,tk=(n.type==='trial'||n.type==='siege')&&this.textures.exists('amap_'+n.type)?'amap_'+n.type:'delve_node_'+(n.type==='home'?'home':n.type);   /* v8.1.93 ใบ 74 ไอคอนห้อง */
      if(n.type==='home'){ if(this.textures.exists('delve_home')){ V(this.add.image(q.x,q.y,'delve_home')).setDisplaySize(96,96); } else { ng.fillStyle(0x3a2a50,1); ng.fillCircle(q.x,q.y,34); ng.lineStyle(3,atlasPinnacleOpen()?0xff7ab8:0xffffff,1); ng.strokeCircle(q.x,q.y,34); VT(q.x,q.y,'🏠',28,'#ffffff'); }
        VT(q.x,q.y-50,'MOCHITOPIA',13,'#ffffff','bold'); VT(q.x,q.y+48,atlasPinnacleOpen()?'✦ The Hunger Beneath is open':'✦ Floor 30 opens the Pinnacle',10,atlasPinnacleOpen()?'#ff9bd0':'#9d93aa','bold'); return; }
      if(!open){ ng.fillStyle(0x14101a,land?0.9:0.7); ng.fillCircle(q.x,q.y,land?big:9); ng.lineStyle(2,land?0x8d7aa8:0x3a3048,land?0.8:0.5); ng.strokeCircle(q.x,q.y,land?big:9); if(land)VT(q.x,q.y,AMAP_TYPES[n.type].emoji,16,'#ffffff').setAlpha(0.55); return; }
      if(this.textures.exists(tk)){ V(this.add.image(q.x,q.y,tk)).setDisplaySize(big*2.4,big*2.4); if(sel||!t){ ng.lineStyle(sel?4:3,sel?0xffffff:col,1); ng.strokeCircle(q.x,q.y,big+3); } }
      else { if(!t){ ng.fillStyle(col,0.25); ng.fillCircle(q.x,q.y,big+7); } ng.fillStyle(t?0x3a2f12:0x1f1830,1); ng.fillCircle(q.x,q.y,big); ng.lineStyle(sel?4:3,sel?0xffffff:t?0xffd166:col,1); ng.strokeCircle(q.x,q.y,big); }
      if(!this.textures.exists(tk))VT(q.x,q.y-1,AMAP_TYPES[n.type].emoji,land?20:13,'#ffffff'); // v6.35: ไอคอนข้อมูลย้ายไปแผง
      if(t){ if(this.textures.exists('delve_cleared_mark'))V(this.add.image(q.x+big-2,q.y+big-4,'delve_cleared_mark')).setDisplaySize(20,20); else VT(q.x,q.y+big+8,'✓',10,'#ffe08a','bold'); }
      if(n.id===next){ const a=VT(q.x,q.y-big-13,'▼',13,'#9dff9d','bold'); this.tweens.add({targets:a,y:a.y-5,yoyo:true,repeat:-1,duration:420}); } });
    // v6.31 แผงถ้ำที่เลือก: ข้อมูล + mod ประจำถ้ำ + Build/Heat + Start (แทนหน้า Map Table)
    if(panel){ const sn=selN,ty=AMAP_TYPES[sn.type],t=amapClears(sn.id),r=mapTableRecipe(),m=recipeMul(r),inf=amapInfluence(sn.id),IL=amapInfLayers(inf),rw=amapRewardOf(sn.id),y0=h-PH+6;
      const pg=this.add.graphics(); pg.fillStyle(0x1c1426,0.97); pg.fillRoundedRect(cx,y0,cw,PH-12,12); pg.lineStyle(2,sn.flavor.color,1); pg.strokeRoundedRect(cx,y0,cw,PH-12,12); this.menu.add(pg);
      { const bk='delve_bossfloor_'+sn.flavor.id; if(sn.type==='boss'&&this.textures.exists(bk)){ const im=this.add.image(cx+cw/2,y0+(PH-12)/2,bk); im.setScale(Math.max(cw/752,(PH-12)/416)); im.setCrop((752-cw/im.scaleX)/2,(416-(PH-12)/im.scaleY)/2,cw/im.scaleX,(PH-12)/im.scaleY); im.setAlpha(0.32); this.menu.add(im); } }
      const TL=(x,y,txt,sz,c,st)=>{const q=this.add.text(x,y,txt,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:c}).setOrigin(0,0.5);this.menu.add(q);return q;};
      // v6.35 แผงอ่านง่าย: หัว / ตาราง 2×2 / mods / ตัวคูณ / ปุ่ม
      TL(cx+14,y0+18,sn.name,16,'#ffffff','bold');
      { const bl=ty.emoji+' '+ty.name,bwid=bl.length*6.5+18; const g=this.add.graphics(); g.fillStyle(sn.flavor.color,0.28); g.fillRoundedRect(cx+cw-14-bwid,y0+8,bwid,20,10); this.menu.add(g); TL(cx+cw-14-bwid/2,y0+18,bl,10,'#ffffff','bold').setOrigin(0.5,0.5); }
      {const lt=delveLoot(sn.d);TL(cx+14,y0+38,'⛏ Depth '+sn.d+'  ·  💠 '+(lt.tier==='legend'?'Legend':'Epic')+' loot ×'+lt.mul.toFixed(2)+(t?'  ·  ✓ ×'+t:''),11,t?'#ffe08a':'#bfb5ca');}
      const sep=this.add.graphics(); sep.lineStyle(1,0x4a4059,1); sep.lineBetween(cx+12,y0+52,cx+cw-12,y0+52); this.menu.add(sep);
      const md=sn.mission?WAVE_OBJECTIVES[sn.mission]:null,colW=(cw-28)/2;
      const cell=(i,lab,val,c)=>{ const xx=cx+14+(i%2)*colW,yy=y0+66+Math.floor(i/2)*34; TL(xx,yy,lab,9,'#8d8499','bold'); const v=TL(xx,yy+15,val,12,c||'#ffffff','bold'); if(v.width>colW-8)v.setScale((colW-8)/v.width); };
      cell(0,'FLAVOR',sn.flavor.emoji+' '+sn.flavor.name); cell(1,'REWARD',rw.emoji+' '+rw.name,'#ffe08a');
      cell(2,'MISSION',md?md.emoji+' '+md.name:'—','#9dff9d'); { const pb=pactBestChar(egCharKey()),nm=(egCharKey()==='cocoa'&&pb<TITAN_RAGE4_HEAT&&!PACT_MILESTONES.some(m=>m.heat>pb&&m.heat<TITAN_RAGE4_HEAT))?{heat:TITAN_RAGE4_HEAT,emoji:'🗿',name:'Titan Rage IV'}:PACT_MILESTONES.find(m=>m.heat>pb); cell(3,'NEXT MILESTONE',nm?'Depth '+nm.heat*5+' '+nm.emoji+' '+nm.name:'All claimed ✓','#ffb070'); }
      const my=y0+142; TL(cx+14,my,'MODS',9,'#8d8499','bold');
      if(!sn.mods.length)TL(cx+56,my,'No mods — easy cave',11,'#8d8499');
      else { const n=sn.mods.length,gap=5,tw=Math.min(130,(cw-70-gap*(n-1))/n); let x=cx+56;
        sn.mods.forEach(id=>{ const d=recipeModDef(id); if(!d)return; const g=this.add.graphics(); g.fillStyle(d.mech?0x5a2340:0x3a2a50,1); g.fillRoundedRect(x,my-12,tw,24,8); this.menu.add(g);
          const l=TL(x+6,my,d.emoji+' '+d.name,10,'#ffffff'); if(l.width>tw-10)l.setScale((tw-10)/l.width); this._zone(x,my-12,tw,24,()=>this.menuToast(d.emoji+' '+d.name+': '+d.desc+' · rewards ×'+d.reward.toFixed(2),'#e6dcf0')); x+=tw+gap; }); }
      const heat=0;
      TL(cx+14,y0+166,'❤ Enemy HP ×'+(m.hp*(1+0.1*IL)).toFixed(1)+'      🎁 Rewards ×'+(m.reward*(1+0.15*IL)*(1+PACT_REWARD_PER_HEAT*heat)).toFixed(2),11,'#ffe08a','bold');
      const by=y0+PH-30,bw=(cw-24)/3;
      const chip=(bx,label,col,fn)=>{const g=this.add.graphics(); g.fillStyle(0x241a30,1); g.fillRoundedRect(bx,by-16,bw,32,9); g.lineStyle(2,col,0.9); g.strokeRoundedRect(bx,by-16,bw,32,9); this.menu.add(g); T(bx+bw/2,by,label,11,'#ffffff','bold'); this._zone(bx,by-16,bw,32,fn);};
      const stones=Save.data.hungerStones|0,dom=stones>0&&!['home','boss','vault','shrine'].includes(sn.type),sw=dom?(cw-24)*.58:cw-16;   /* v8.1.92 🪨 Hunger Stone → Hunger's Domain */
      if(dom)this.uiPillBtn(this.menu,cx+cw-8-((cw-24)*.42)/2,by,(cw-24)*.42,34,0x8a4fd8,'🪨','Domain ×'+stones,()=>{ this.a12?.('ui_domain_button',.45); const rr=mapTableRecipe(); this.stageDiff=1; this._recipeRequested=rr; this._domainRequested=true; this._farmFocusRequested=rw.id==='sugar'?'all':rw.id; this._sugarRewardMap=rw.id==='sugar'; this.startRun(rr.theme); });
      this.uiPillBtn(this.menu,dom?cx+8+sw/2:cx+cw/2,by,sw,34,COLORS.pink,'▶','Start',()=>{
        const rr=mapTableRecipe(); this.stageDiff=1; this._recipeRequested=rr; this._domainRequested=false; this._farmFocusRequested=rw.id==='sugar'?'all':rw.id; this._sugarRewardMap=rw.id==='sugar'; this.startRun(rr.theme); }); }
    else T(w/2,h-34,'Drag to dig through the map · pinch or ➕➖ to zoom · tap a cave',10,'#9d93aa');
  }
  buildAtlasTree(cx,cw,y,T){ const w=this.W,h=this.H,best=delveBestDepth(),pb=pactBestChar(egCharKey())*5;   // v6.80 E3 Depth Track
    T(w/2,y,'Go deeper to unlock permanent Delve bonuses and hero milestones.',11,'#e6dcf0');
    T(w/2,y+18,'Record depth '+best,13,'#ffe08a','bold'); y+=44;
    const per=Math.max(1,Math.floor((h-y-40)/34)),pages=Math.ceil(DEPTH_TRACK.length/per),pg=Math.max(0,Math.min(pages-1,this._dtPage==null?Math.floor(Math.max(0,DEPTH_TRACK.findIndex(t=>t.d>best))/per):this._dtPage));
    DEPTH_TRACK.slice(pg*per,pg*per+per).forEach(t=>{ const n=t.kind==='passive'?ATLAS_NODES.find(x=>x.id===t.id):null,done=t.kind==='passive'?t.d<=best:t.d<=pb,g=this.add.graphics();
      g.fillStyle(done?0x2a2040:0x1c1426,1);g.fillRoundedRect(cx,y,cw,30,8);g.lineStyle(1.5,done?0xffd166:0x4a4059,1);g.strokeRoundedRect(cx,y,cw,30,8);this.menu.add(g);
      const lab=t.kind==='passive'?(n.emoji+' '+n.name+' +1 · '+n.desc):(t.m.emoji+' '+t.m.name+' (per hero)');
      this.menu.add(this.add.text(cx+10,y+15,'D'+t.d,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:done?'#ffe08a':'#8d8499'}).setOrigin(0,0.5));
      this.menu.add(this.add.text(cx+48,y+15,lab,{fontFamily:'sans-serif',fontSize:'9.5px',color:done?'#ffffff':'#a99fb8',fixedWidth:cw-80}).setOrigin(0,0.5));
      this.menu.add(this.add.text(cx+cw-10,y+15,done?'✓':'🔒',{fontFamily:'sans-serif',fontSize:'12px',color:'#9dff9d'}).setOrigin(1,0.5)); y+=34; });
    if(pages>1)this.uiPillBtn(this.menu,w/2,y+20,Math.min(cw,240),36,0x5a4b75,'','Page '+(pg+1)+'/'+pages+' ›',()=>{ this._dtPage=(pg+1)%pages; this.buildAtlas(); });
  }
  finishPinnacle(won){ this._pinnacleRun=false; let label='';
    if(won){ Save.data.pinnacleKills=(Save.data.pinnacleKills||0)+1; this.sugarStage+=900; this.grantCurrencyReward(8,'legend','✦ Pinnacle defeated!');
      const pool=GEAR_ALL.filter(g=>g.tier==='legend'&&!g.unique); const it=Phaser.Utils.Array.GetRandom(pool); if(it){ const ilv=95+Phaser.Math.Between(0,5),d=Save.receiveGearInstance(it.id,{isNew:true,itemLevel:ilv,chapter:5}); if(d)label=it.name+' (iLv '+ilv+')'; } Save.save(); }
    const sug=this.sugarStage||0; Save.addSugar(sug); this.sugarStage=0;
    this.state='rushDone'; this.physics.pause(); this.player.setVelocity(0,0); this.over.removeAll(true); this._overBtns=[];
    const w=this.W,h=this.H,box=[this.add.rectangle(0,0,w,h,0x0b0714,1).setOrigin(0,0),this.add.text(w/2,h*0.22,won?'✦':'💥',{fontSize:'64px',color:'#c9a3ff'}).setOrigin(0.5),
      this.add.text(w/2,h*0.33,won?'Pinnacle Defeated!':'The Hunger Endures',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:won?'#e0c3ff':'#ff8fb5'}).setOrigin(0.5),
      this.add.text(w/2,h*0.45,(won?'🌟 '+(label||'Legendary reward')+'\n':'')+'Sugar: +'+sug,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',align:'center',lineSpacing:6,wordWrap:{width:w-50}}).setOrigin(0.5)];
    const bw=Math.min(240,w-60),by=h*0.66,g=this.add.graphics(); g.fillStyle(COLORS.grape,1); g.fillRoundedRect(w/2-bw/2,by-24,bw,48,15);
    box.push(g,this.add.text(w/2,by,'↩ Back to the Rift',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff'}).setOrigin(0.5));
    this._overBtns.push({x:w/2-bw/2,y:by-24,w:bw,h:48,fn:()=>{window.__pendingMenu='recipes';this.scene.restart();}});
    this.over.add(box); this.over.setVisible(true); }
  _fmtTime(t){ t=Math.max(0,Math.round(t||0)); return Math.floor(t/60)+':'+String(t%60).padStart(2,'0'); }
  // เข้าบอสถัดไปของ rush (คง build/เลเวลไว้ ไม่ reset loadout)
  bossRushNext(){ if(this.checkEndgameCurse((this._rushPos||0)/Math.max(1,this._rushList.length),()=>this.bossRushNext()))return; const i=this._rushList[this._rushPos]; this._finalStoryShown=true;
    this.state='loading'; this.player.setVelocity(0,0);
    if(window.GameLoader)window.GameLoader.show('Preparing next boss...',0.1);
    this.texFreeStages?.(i);   /* v8.2.82 */
    this.ensureStageArt(i,()=>this.ensureStageAudio(i,()=>{ this.clearFoes();this.clearEnemies();this.clearPickups(true);this.clearBossObjects(); this.state='play'; this.startStage(i);if(window.GameLoader)window.GameLoader.hide(); })); }
  bossRushBossDown(){ const d=this.stageDiff||1,dr=this.diffMul().reward,si=this.stageIndex;
    const sug=Math.round((50+si*25)*dr); this.sugarStage+=sug; this.sugarRun=(this.sugarRun||0)+sug; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);
    this._rushPos++; this._rushDown=this._rushPos;
    if(this._rushPos>=this._rushList.length){ this.finishBossRush(true); return; }
    this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.40);
    this.showBanner('👑 Boss '+this._rushPos+'/'+this._rushList.length+' down!','+🍬'+sug+' · +40% HP · next boss incoming',2200);
    this.pendingLvl=(this.pendingLvl||0)+2; this.time.delayedCall(2300,()=>{ if(this.state==='play')this.bossRushNext(); else if(this.state==='levelup')this._rushNextPending=true; }); }
  recordBossRush(){ const d=this.stageDiff||1,n=this._rushDown||0,t=this.elapsed-(this._rushT0||0); if(!Save.data.bossRushBest)Save.data.bossRushBest={};
    const b=Save.data.bossRushBest[d]; let isBest=false; if(n>0&&(!b||n>b.n||(n===b.n&&t<b.t))){Save.data.bossRushBest[d]={n,t};isBest=true;} Save.save(); return {n,t,isBest}; }
  finishBossRush(won){ this.bossRush=false;
    if(this._pinnacleRun){ this.finishPinnacle(won); return; }
    const r=this.recordBossRush(),dr=this.diffMul().reward;
    if(won){ const bonus=Math.round((120+this._rushList.length*40)*dr); this.sugarStage+=bonus; this.grantCurrencyReward(2+this._rushList.length,this.currencyTierFor(),'👑 Boss Rush complete!'); }
    const sug=this.sugarStage||0; Save.addSugar(sug); this.sugarStage=0;
    this.state='rushDone'; this.physics.pause(); this.player.setVelocity(0,0); this.over.removeAll(true); this._overBtns=[];
    const w=this.W,h=this.H,box=[this.add.rectangle(0,0,w,h,0x0b0714,1).setOrigin(0,0),
      this.add.text(w/2,h*0.22,won?'👑':'💥',{fontSize:'64px'}).setOrigin(0.5),
      this.add.text(w/2,h*0.33,won?'Boss Rush Cleared!':'Boss Rush Over',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:won?'#ffe08a':'#ff8fb5'}).setOrigin(0.5),
      this.add.text(w/2,h*0.45,'Bosses defeated: '+r.n+' / '+this._rushList.length+'\nTime: '+this._fmtTime(r.t)+'\nSugar: +'+sug+(r.isBest?'\n🏆 NEW BEST!':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',align:'center',lineSpacing:6}).setOrigin(0.5)];
    const bw=Math.min(240,w-60),by=h*0.66,g=this.add.graphics(); g.fillStyle(COLORS.grape,1); g.fillRoundedRect(w/2-bw/2,by-24,bw,48,15);
    box.push(g,this.add.text(w/2,by,'↩ Back to Boss Rush',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff'}).setOrigin(0.5));
    this._overBtns.push({x:w/2-bw/2,y:by-24,w:bw,h:48,fn:()=>{window.__pendingMenu='bossrush';this.scene.restart();}});
    this.over.add(box); this.over.setVisible(true); }
  startTutorial(done,manual=false){
    this._tutorialDone=done;this._tutorialStep=0;this._tutorialManual=manual;this.state='tutorial';this.menu.setVisible(false);this.physics.pause();this.drawTutorial();
  }
  // 🍓 โมโม่เป็นครูสอนเล่น — พูดทีละสเต็ป มีรูปโมโม่ + บับเบิลคำพูด
  tutorialPages(){
    return [
      {e:'👋',t:'Hi! My name is Berry',d:'Welcome to Mochi Mayhem! I will teach you how to play — tap the screen to continue~'},
      {e:'🕹️',t:'Move with the joystick',d:'Drag anywhere on the screen — you move where you drag · keep running from enemies!'},
      {e:'⚔️',t:'Weapon auto-fires!',d:'No need to shoot — your weapon auto-attacks the nearest enemy · your job is to dodge and aim well'},
      {e:'💨',t:'Dash to dodge',d:'Tap the Dash button (bottom-right) to dodge · when you see red ground or boss bullets, Dash out before they hit!'},
      {e:'⭐',t:'Level up = pick a card',d:'Walk over EXP drops to fill the bar, then pick 1 of 3 power-up cards · the same card can be picked again to rank it up'},
      {e:'🍳',t:'Pick a Build Path',d:'At level 5 you choose a Build Path — it changes how your attack works · later cards grow that path and can Evolve it!'},
      {e:'✨',t:'Unique power',d:'The button above Dash is your ultimate · save it for when you are swarmed or fighting a boss'},
      {e:'🎒',t:'Collect Sugar to upgrade',d:'Kill enemies / clear stages to earn 🍬 Sugar for permanent upgrades and gear · you grow stronger the more you play!'},
      {e:'🔥',t:'Ready to go!',d:'Harder stages give better rewards! Climb up step by step · go have fun in the chaotic kitchen~ 🍡'},
    ];
  }
  drawTutorial(){
    const pages=this._tutPages||(this._tutPages=this.tutorialPages());
    const p=pages[this._tutorialStep]||pages[0],w=this.W,h=this.H,last=this._tutorialStep===pages.length-1;this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x08050e,0.93).setOrigin(0,0);this.over.add(bg);
    // ---- รูปโมโม่ (ครู) มุมล่างซ้าย ----
    const teachH=Math.min(h*0.42,300), teachW=teachH*0.75, tx=w*0.06+teachW/2, ty=h-teachH*0.5-6;
    if(this.textures.exists('card_berry')){ const im=this.add.image(tx,ty,'card_berry'); const s=Math.min(teachW/im.width,teachH/im.height); im.setScale(s); this.over.add(im); }
    else { const em=this.add.text(tx,ty,'🍓',{fontSize:Math.round(teachH*0.5)+'px'}).setOrigin(0.5); this.over.add(em); }
    // ตัวเด้งเบา ๆ ให้Alive
    if(this.over.list.length){ const teacher=this.over.list[this.over.list.length-1]; this.tweens.add({targets:teacher,y:teacher.y-8,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
    // ---- บับเบิลคำพูด ด้านบน ----
    const bx=24,bw=w-48,byy=h*0.10,bh=h*0.40, card=this.add.graphics();
    card.fillStyle(0xfff6fb,0.98);card.fillRoundedRect(bx,byy,bw,bh,22);card.lineStyle(3,0xff9ec4,1);card.strokeRoundedRect(bx,byy,bw,bh,22);
    // หางบับเบิลชี้ไปหาโมโม่
    card.fillStyle(0xfff6fb,0.98);card.fillTriangle(bx+34,byy+bh-2, bx+64,byy+bh-2, bx+20,byy+bh+26);
    this.over.add(card);
    const step=this.add.text(bx+bw-14,byy+12,'Part '+(this._tutorialStep+1)+'/'+pages.length,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#d98cae'}).setOrigin(1,0);
    const em=this.add.text(bx+26,byy+18,p.e,{fontSize:'40px'}).setOrigin(0,0);
    const name=this.add.text(bx+80,byy+22,'Berry',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ff6f9c'}).setOrigin(0,0);
    const title=this.add.text(bx+26,byy+70,p.t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'19px',color:'#3a2740',wordWrap:{width:bw-52}}).setOrigin(0,0);
    const desc=this.add.text(bx+26,byy+70+title.height+10,p.d,{fontFamily:'sans-serif',fontSize:'13.5px',color:'#5a4a63',wordWrap:{width:bw-52},lineSpacing:6}).setOrigin(0,0);
    const hint=this.add.text(w/2,h-24,last?'👆 Tap to start!':'Tap to continue  ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe08a'}).setOrigin(0.5);
    this.over.add([step,em,name,title,desc,hint]);this.over.setVisible(true);Sfx.select();
    // ปุ่มข้าม (ยกเว้นหน้าสุดท้าย)
    if(!last){ const sk=this.add.text(w-16,byy-4,'Skip ✕',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#c7bdd6'}).setOrigin(1,1); this.over.add(sk); this._tutSkip={x:w-70,y:byy-18,w:70,h:24}; }
    else this._tutSkip=null;
  }
  advanceTutorial(){
    const pages=this._tutPages||this.tutorialPages();
    // แตะปุ่มข้าม = จบเลย
    const pt=this.input.activePointer, sk=this._tutSkip;
    if(sk&&pt&&pt.x>=sk.x&&pt.x<=sk.x+sk.w&&pt.y>=sk.y&&pt.y<=sk.y+sk.h){ this._tutorialStep=pages.length-1; }
    if(this._tutorialStep<pages.length-1){this._tutorialStep++;this.drawTutorial();return;}
    Save.data.tutorialDone=true;Save.save();try{ Tele.ev('tutorial_done'); }catch(e){}this.over.setVisible(false);this._tutPages=null;this._tutSkip=null;const done=this._tutorialDone;this._tutorialDone=null;if(done)done();
  }
  buildAchievements(){   // v8.0.23 Awards ใหม่: ใกล้สำเร็จ 3 รายการ · 4 หมวด · ขั้น ★ · รับทีละขั้น
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('🏆 Awards','screen_achievements');
    const w=this.W,h=this.H,d=Save.data,L=awardList(),cat=this._awCat||'story',top=(w<=h?78:52)+(this.rewardsTabs?.('achievements')||0);
    if(!d.awards)d.awards={}; if(!d.titles)d.titles=[];
    const T=(x,y,t,sz,c,st,ox=0,oy=0.5)=>{const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:Math.max(11,sz)+'px',color:c||'#ffffff'}).setOrigin(ox,oy);this.menu.add(q);return q;};
    const box=(x,y,bw,bh,fill,line,a=.97)=>{const g=this.add.graphics();g.fillStyle(fill,a).fillRoundedRect(x,y,bw,bh,10);g.lineStyle(1.5,line,1).strokeRoundedRect(x,y,bw,bh,10);this.menu.add(g);return g;};
    const stars=(n,max)=>'★'.repeat(n)+'☆'.repeat(Math.max(0,max-n));
    let got=0,all=0; for(const a of L){ got+=awClaimed(a,d); all+=a.tiers.length; }
    T(14,top,'★ '+got+' / '+all,12,'#ffe08a','bold');
    // ฉายา + กรอบ (แตะเพื่อสลับ)
    { const tl=d.title||'No title',tw=Math.min(170,w*.46),tx=w-14-tw-40; const ribbon=this.menuArtPanel?.('aw_title_ribbon',0,tx,top-12,tw,24);if(!ribbon)box(tx,top-12,tw,24,0x2a2036,0x8f7de8); const tt=T(tx+8,top,(ribbon?'':'🎖 ')+tl,10,ribbon?'#5d3c21':d.title?'#ffe08a':'#cfc1d4','bold'); if(tt.width>tw-14)tt.setScale((tw-14)/tt.width);
      this._zone(tx,top-12,tw,24,()=>{ const opts=[null,...d.titles]; if(opts.length<2){ this.menuToast?.('🎖 Reach the last ★ of an award to earn a title','#cfe9ff'); return; } const i=opts.indexOf(d.title||null); d.title=opts[(i+1)%opts.length]; Save.save(); Sfx.select&&Sfx.select(); this.buildAchievements(); });
      const fr=awFrames(d),fc=AW_CATS.find(c=>c.id===d.frame),fx=w-14-34; box(fx,top-12,34,24,0x2a2036,fc?fc.col:0x4a4059); T(fx+17,top,'🖼',13,'#fff','normal',.5);
      this._zone(fx,top-12,34,24,()=>{ if(!fr.length){ this.menuToast?.('🖼 Finish every ★ of one award to unlock a profile frame','#cfe9ff'); return; } const opts=[null,...fr],i=opts.indexOf(d.frame||null); d.frame=opts[(i+1)%opts.length]; Save.save(); Sfx.select&&Sfx.select(); this.buildAchievements(); }); }
    let y=top+20;
    // v8.0.28 Claim all: รับทุกขั้นที่พร้อม (ขั้นหีบทองยังกดรับทีละอัน เพราะเปิดฉากเปิดหีบ)
    { const ready=L.filter(a=>awReached(a,d)>awClaimed(a,d)&&!awReward(a,awClaimed(a,d)).chest).length;
      if(ready>0){ const bw=w-28,b=this.add.graphics(); y+=4; b.fillStyle(0xffb020,1).fillRoundedRect(14,y,bw,32,10).fillStyle(0xffffff,.2).fillRoundedRect(17,y+3,bw-6,12,8); this.menu.add(b); this.menuArtIcon?.('aw_claim_all',0,35,y+16,22);T(w/2,y+16,(this.tuHas?.('aw_claim_all')?'':'🎁 ')+'Claim all ('+ready+')',13,'#21131a','bold',.5); this.drawBadgeDot(this.menu,w-18,y+4);
        this._zone(14,y,bw,32,()=>this.awClaimAll()); this.tapZones[this.tapZones.length-1].tag='aw_claim_all'; y+=36; } }
    // ใกล้สำเร็จ 3 รายการ (ยังไม่ถึงขั้นถัดไป เรียงตาม % มากสุด)
    const near=L.map(a=>{ const c=awClaimed(a,d),r=awReached(a,d); if(a.secret||r>c||c>=a.tiers.length)return null; const v=a.val(d),lo=c?a.tiers[c-1]:0,nx=a.tiers[c]; return {a,v,nx,f:Math.max(0,Math.min(.999,(v-lo)/Math.max(1,nx-lo)))}; }).filter(Boolean).sort((p,q)=>q.f-p.f).slice(0,3);
    if(near.length){ T(14,y+6,'ALMOST THERE',9,'#ffcf5a','bold'); y+=14;
      for(const n of near){ box(14,y,w-28,28,0x221a2b,0x4a4059); T(24,y+14,n.a.emoji,13,'#fff','normal',.5); const nm=T(36,y+14,n.a.name,10,'#ffffff','bold'); const bx=Math.max(nm.x+nm.width*nm.scaleX+8,w*.46),bw=w-28-bx-60,g=this.add.graphics(); g.fillStyle(0x120d18,1).fillRoundedRect(bx,y+11,bw,6,3); g.fillStyle(0xffcf5a,1).fillRoundedRect(bx,y+11,Math.max(6,bw*n.f),6,3); this.menu.add(g); T(w-20,y+14,Math.floor(n.v)+' / '+n.nx,9,'#cfc2d5','normal',1); y+=32; } }
    // แท็บหมวด
    y+=4; const tw=(w-28-6*3)/4;
    AW_CATS.forEach((c,i)=>{ const x=14+i*(tw+6),on=c.id===cat,g=this.add.graphics(); g.fillStyle(on?0x3a2f50:0x221a2b,1).fillRoundedRect(x,y,tw,30,9); g.lineStyle(on?2:1.5,on?c.col:0x4a4059,1).strokeRoundedRect(x,y,tw,30,9); this.menu.add(g);
      const medal=this.menuArtIcon?.('aw_medal',i*2,x+14,y+15,22);const t=T(x+tw/2+(medal?8:0),y+15,(medal?'':c.emoji+' ')+c.name,10,on?'#ffffff':'#bfb5ca','bold',.5); if(t.width>tw-8)t.setScale((tw-8)/t.width);
      if(L.some(a=>a.cat===c.id&&awReached(a,d)>awClaimed(a,d)))this.drawBadgeDot(this.menu,x+tw-6,y+5);
      this._zone(x,y,tw,30,()=>{ this._awCat=c.id; Sfx.select&&Sfx.select(); this.buildAchievements(); }); });
    y+=38;
    // รายการในหมวด
    const C=AW_CATS.find(c=>c.id===cat)||AW_CATS[0],rh=54;
    let rows=L.filter(a=>a.cat===cat);
    // v8.0.28 ฮีโร่ = ตัวละ 1 แถว (Champion + Builds) แตะเพื่อกางดู
    if(cat==='heroes'){ const out=[]; for(const a of rows){ const m=/^h[wb]_(.+)$/.exec(a.id); if(!m){ out.push(a); continue; } let gp=out.find(x=>x.group===m[1]); if(!gp){ gp={group:m[1],emoji:a.emoji,list:[]}; out.push(gp); } gp.list.push(a); } rows=out; }
    const drawRow=(a,indent)=>{ const x0=14+indent,rw0=w-28-indent,c=awClaimed(a,d),r=awReached(a,d),max=a.tiers.length,done=c>=max,ready=r>c,v=a.val(d),nx=a.tiers[Math.min(c,max-1)],hid=awHidden(a,d);
      box(x0,y,rw0,rh,done?0x1f3328:ready?0x342d25:0x221a2b,done?0x7fe3a8:ready?0xffd166:hid?0x6a4a8a:0x4a4059); const sg=this.add.graphics(); sg.fillStyle(hid?0x8f6ad8:C.col,1).fillRoundedRect(x0,y,5,rh,3); this.menu.add(sg);
      if(!this.menuArtIcon?.(hid?'aw_secret':'aw_medal',hid?0:AW_CATS.findIndex(q=>q.id===cat)*2+(r?0:1),x0+22,y+rh/2,34))T(x0+22,y+rh/2,hid?'❔':a.emoji,20,'#fff','normal',.5);
      const right=ready?86:70,lx=x0+42,room=w-14-right-(this.tuHas?.('aw_star')?78:60)-lx,nm=T(lx,y+14,hid?'??? Secret award':a.name,12,hid?'#d8c0ff':'#ffffff','bold'); if(nm.width>room)nm.setScale(room/nm.width);
      if(!a.secret){if(this.tuHas?.('aw_star'))for(let si=0;si<max;si++)this.menuArtIcon?.('aw_star',si<c?(si===max-1?2:1):0,w-14-right-13-(max-1-si)*13,y+14,14);else T(w-14-right-6,y+14,stars(c,max),11,done?'#8bffb4':'#ffcf5a','bold',1);} else if(!hid)T(w-14-right-6,y+14,'SECRET',9,'#d8c0ff','bold',1);
      const ds=T(lx,y+30,hid?'Hidden — keep playing to discover it':done?'All done · title “'+a.title+'”':a.desc+(a.secret?'':' · next '+nx),9,'#bfb5ca'); if(ds.width>w-28-lx-right)ds.setScale((w-28-lx-right)/ds.width);
      if(!hid){ const bw=w-14-right-10-lx,f=done?1:Math.min(1,v/Math.max(1,nx)),g=this.add.graphics(); g.fillStyle(0x120d18,1).fillRoundedRect(lx,y+41,bw,6,3); g.fillStyle(done?0x7fe3a8:C.col,1).fillRoundedRect(lx,y+41,Math.max(6,bw*f),6,3); this.menu.add(g); }
      const rw=awReward(a,c),rtxt=done?'✓':hid?'🎖':[rw.sugar?'🍬'+rw.sugar:'',rw.thread?'🧶'+rw.thread:'',rw.shovel?'⛏️'+rw.shovel:'',rw.chest?'🧰 Gold':'',rw.title?'🎖':''].filter(Boolean).join(' ');
      if(ready){ const bx=w-14-right+4,b=this.add.graphics(); b.fillStyle(0xffb020,1).fillRoundedRect(bx,y+rh/2-15,right-12,30,9); this.menu.add(b); T(bx+(right-12)/2,y+rh/2-5,'Claim',11,'#21131a','bold',.5); const rt=T(bx+(right-12)/2,y+rh/2+7,rtxt,8,'#3a2406','bold',.5); if(rt.width>right-16)rt.setScale((right-16)/rt.width);
        this.drawBadgeDot(this.menu,w-18,y+6); this._zone(x0,y,rw0,rh,()=>this.awClaim(a)); }
      else { const rt=T(w-20,y+rh/2,rtxt,9,done?'#8bffb4':'#cfc1d4','bold',1); if(rt.width>right-6)rt.setScale((right-6)/rt.width); }
      y+=rh+6; };
    rows.forEach(a=>{ if(!a.group){ drawRow(a,0); return; }
      const H=(typeof CHARACTERS!=='undefined'&&CHARACTERS[a.group])||{},open=this._awOpen===a.group,rd=a.list.some(x=>awReached(x,d)>awClaimed(x,d)),allDone=a.list.every(x=>awClaimed(x,d)>=x.tiers.length);
      box(14,y,w-28,rh,allDone?0x1f3328:rd?0x342d25:0x221a2b,allDone?0x7fe3a8:rd?0xffd166:open?C.col:0x4a4059); const sg=this.add.graphics(); sg.fillStyle(C.col,1).fillRoundedRect(14,y,5,rh,3); this.menu.add(sg);
      T(36,y+rh/2,a.emoji,20,'#fff','normal',.5); T(56,y+16,H.name||a.group,13,'#ffffff','bold');
      const sum=a.list.map(x=>(x.id.startsWith('hw_')?'Wins ':'Builds ')+stars(awClaimed(x,d),x.tiers.length)).join('   '); const st=T(56,y+36,sum,10,'#ffcf5a','bold'); if(st.width>w-28-56-40)st.setScale((w-28-56-40)/st.width);
      T(w-24,y+rh/2,open?'▾':'▸',16,'#cbb8e0','bold',.5); if(rd)this.drawBadgeDot(this.menu,w-18,y+6);
      this._zone(14,y,w-28,rh,()=>{ this._awOpen=open?null:a.group; Sfx.select&&Sfx.select(); this.buildAchievements(); }); this.tapZones[this.tapZones.length-1].tag='aw_hero_'+a.group;
      y+=rh+6; if(open)a.list.forEach(x=>drawRow(x,18)); });
    this.menu.setVisible(true);
  }
  // v8.0.28 รับทุกขั้นที่พร้อมในครั้งเดียว (ยกเว้นขั้นหีบทอง) · รวมรางวัลเป็นแบนเนอร์เดียว
  awClaimAll(){ const d=Save.data,L=awardList(),sum={sugar:0,thread:0,shovel:0,titles:[]}; let n=0,guard=0;
    const dq=typeof DailyQ!=='undefined'?DailyQ:null; if(dq)dq._mute=true;
    try{ for(const a of L){ while(guard++<500){ const c=awClaimed(a,d); if(awReached(a,d)<=c)break; const r=awReward(a,c); if(r.chest)break; d.awards[a.id]=c+1; n++;
          if(r.sugar){Save.addSugar(r.sugar);sum.sugar+=r.sugar;} if(r.thread){Save.addThreads(r.thread);sum.thread+=r.thread;} if(r.shovel){Save.addShovels(r.shovel);sum.shovel+=r.shovel;}
          if(r.title&&!d.titles.includes(a.title)){ d.titles.push(a.title); if(!d.title)d.title=a.title; sum.titles.push(a.title); } } } } finally{ if(dq)dq._mute=false; }
    if(!n)return; Save.save(); Sfx.menuCue?.('aw_claim_all',.5)||Sfx.progress&&Sfx.progress('achievement');
    this.showBanner?.('🏆 Claimed '+n+' award step'+(n>1?'s':''),[sum.sugar?'🍬 +'+sum.sugar:'',sum.thread?'🧶 +'+sum.thread:'',sum.shovel?'⛏️ +'+sum.shovel:'',sum.titles.length?'🎖 '+sum.titles.length+' title'+(sum.titles.length>1?'s':''):''].filter(Boolean).join(' · '),1800); this.buildAchievements();this.menuArtFx?.('vfx_aw_claim',this.W/2,110,110); }
  // รับรางวัลขั้นถัดไป 1 ขั้น (ไม่นับเป็นความคืบหน้า Daily)
  awClaim(a){ const d=Save.data,c=awClaimed(a,d); if(awReached(a,d)<=c)return; const r=awReward(a,c); d.awards[a.id]=c+1;
    const dq=typeof DailyQ!=='undefined'?DailyQ:null; if(dq)dq._mute=true; try{ if(r.sugar)Save.addSugar(r.sugar); if(r.thread)Save.addThreads(r.thread); if(r.shovel)Save.addShovels(r.shovel); } finally{ if(dq)dq._mute=false; }
    if(r.title&&!d.titles.includes(a.title)){ d.titles.push(a.title); if(!d.title)d.title=a.title; }
    Save.save(); Sfx.menuCue?.(a.secret?'aw_secret':r.title?'aw_title':'aw_star',.45,.12,a.secret||r.title?1:1+c*.06)||Sfx.progress&&Sfx.progress('achievement');
    const line=[r.sugar?'🍬 +'+r.sugar:'',r.thread?'🧶 +'+r.thread:'',r.shovel?'⛏️ +'+r.shovel:'',r.title?'🎖 Title “'+a.title+'”':''].filter(Boolean).join(' · ');
    if(r.chest){ this.showBanner?.(a.emoji+' '+a.name+' ★'+(c+1),'Free Gold Chest!',1400); this.openChest(CHESTS.find(x=>x.id==='gold')||CHESTS[CHESTS.length-1],'gift'); return; }
    this.showBanner?.(a.emoji+' '+a.name+' ★'+(c+1),line,1600); this.buildAchievements();this.menuArtFx?.(a.secret?'aw_secret_open':'vfx_aw_claim',this.W/2,110,120); }
  buildSettings(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('⚙️ Settings','screen_settings');
    const w=this.W,h=this.H,st=Save.data.settings||Object.assign({},DEFAULT_SETTINGS),portrait=w<=h;
    const rows=[
      {k:'sound',e:'🔊',n:'Sound & Music',sub:'Turn all audio on or off',value:()=>st.sound?'On':'Off',toggle:()=>{st.sound=!st.sound;Sfx.muted=!st.sound;if(Sfx.muted){Sfx.eventLoopStop?.();this.voiceStop?.();}if(Sfx.master)Sfx.master.gain.value=Sfx.muted?0:0.24;if(this.sound)this.sound.mute=Sfx.muted;}},
      {k:'musicVol',e:'🎵',n:'Music Volume',sub:'Background music level',value:()=>Math.round((st.musicVol==null?1:st.musicVol)*100)+'%',toggle:()=>{const c=st.musicVol==null?1:st.musicVol,i=VOL_STEPS.indexOf(c);st.musicVol=VOL_STEPS[(i+1)%VOL_STEPS.length];applyVolSettings(st);}},
      {k:'sfxVol',e:'🔔',n:'Effects Volume',sub:'Hits, pickups and skill sounds',value:()=>Math.round((st.sfxVol==null?1:st.sfxVol)*100)+'%',toggle:()=>{const c=st.sfxVol==null?1:st.sfxVol,i=VOL_STEPS.indexOf(c);st.sfxVol=VOL_STEPS[(i+1)%VOL_STEPS.length];applyVolSettings(st);}},
      {k:'voices',e:'💬',n:'Character Voices',sub:'Spoken dialogue and character sounds',value:()=>st.voices!==false?'On':'Off',toggle:()=>{st.voices=st.voices===false;if(!st.voices)this.voiceStop?.();}},
      {k:'shake',e:'📳',n:'Screen Shake',sub:'Camera shake strength',value:()=>['Off','Light','Normal'][st.shake||0],toggle:()=>{st.shake=((st.shake||0)+1)%3;}},
      {k:'flash',e:'✨',n:'Screen Flash',sub:'Flashes on big moves & phase changes',value:()=>st.flash?'On':'Off',toggle:()=>{st.flash=!st.flash;}},
      {k:'damageNumbers',e:'💥',n:'Damage Numbers',sub:'Show damage and criticals',value:()=>st.damageNumbers?'On':'Off',toggle:()=>{st.damageNumbers=!st.damageNumbers;}},
      {k:'ctrlSize',e:'🎮',n:'Button Size',sub:'Dash & Unique button size',value:()=>['Normal','Large','Extra Large'][st.ctrlSize||0],toggle:()=>{st.ctrlSize=((st.ctrlSize||0)+1)%3;}},
      {k:'ctrlLeft',e:'✋',n:'Button Side',sub:'Left-handed? Move buttons left',value:()=>st.ctrlLeft?'Left':'Right',toggle:()=>{st.ctrlLeft=!st.ctrlLeft;}},
      {k:'vfx',e:'🎆',n:'VFX Quality',sub:'Particle count and boss effects',value:()=>['Low','Mid','High'][st.vfx||0],toggle:()=>{st.vfx=((st.vfx||0)+1)%3;}},
      {k:'quality',e:'⚡',n:'Performance',sub:'Auto adapts to your phone · resolution applies on restart',value:()=>(_lowMemFlag?'Low-memory · ':'')+['Auto','Low','High'][st.quality||0],toggle:()=>{st.quality=((st.quality||0)+1)%3;clearLowMem();this.menuToast&&this.menuToast('Resolution changes apply next launch');}},
      {k:'share',e:'📡',n:'Share Play Stats',sub:'Send each finished stage’s stats to the developer · anonymous',value:()=>Tele.status(),toggle:()=>{st.share=!st.share;Save.data.settings=st;if(st.share)setTimeout(()=>Tele.flush(),50);}},
            ...((typeof DEV_STATS_ON!=='undefined'&&!DEV_STATS_ON&&!(typeof GM!=='undefined'&&GM.on()))?[]:[{k:'mx',e:'📈',n:'Combat Meter',sub:'Live DPS / boss / FPS numbers in battle · full report in Play Stats',value:()=>st.mx?'On':'Off',toggle:()=>{st.mx=!st.mx;}}]),   /* v8.2.54 ECRS2 E4: เครื่องมือพัฒนา → เห็นเฉพาะ GM */
      ...(AdManager.privacyRequired?[{k:'adPrivacy',e:'🛡',n:'Ad Privacy',sub:'Change your ad consent choices',value:()=>'Open',toggle:()=>{AdManager.privacyForm();}}]:[]),
      ...((typeof DEV_STATS_ON!=='undefined'&&!DEV_STATS_ON&&!(typeof GM!=='undefined'&&GM.on()))?[]:[{k:'stats',e:'📊',n:'Play Stats',sub:'Your runs on this device: wins, deaths, cards',value:()=>'Open',toggle:()=>{},open:true}]),
    ];
    if(typeof GM!=='undefined'&&GM.on())rows.push({k:'gm',e:'🛠',n:'GM Tools'+(GM.testing()?' · TEST PROFILE':''),sub:'Testing only · resources, unlocks, save tools',value:()=>'Open',toggle:()=>{},gm:true});
    const nRows=rows.length+1;   // +1 = แถวบัญชี Cloud
    const top=portrait?92:66,gap=portrait?10:8,rowH=Math.min(portrait?68:54,(h-top-52-gap*(nRows-1))/nRows),rw=Math.min(w-30,520),rx=(w-rw)/2;
    rows.forEach((r,i)=>{const y=top+i*(rowH+gap);this._rowBtn(y,rowH,r.e,r.n,r.sub,r.value(),'#ffe08a',()=>{if(r.gm){Sfx.select();this.menuScreen='gm';this.buildMenuScreen();return;}if(r.open){Sfx.select();this._heroesTab='roster';this.menuScreen='playstats';this.buildMenuScreen();return;}r.toggle();Save.data.settings=st;Save.save();Sfx.select();this.layoutControls();this.buildSettings();},rx,rw);});
    if(typeof GM!=='undefined'&&GM_ENABLED&&!GM.on()){ this._zone(w-40,h-40,40,40,()=>{ const now=Date.now(); this._gmTaps=(now-(this._gmTapAt||0)<1500)?(this._gmTaps||0)+1:1; this._gmTapAt=now; if(this._gmTaps>=7){ this._gmTaps=0; let c=null; try{ c=window.prompt('Code'); }catch(e){} if(c!=null){ if(GM.unlock(c)){ Sfx.clear?.(); this.showBanner?.('🛠 GM Tools on','Open GM Tools in Settings',1500); } else Sfx.error?.(); this.buildSettings(); } } }); const z=this.tapZones[this.tapZones.length-1]; z.noBounce=true; z.quiet=true; }
    // ☁️ บัญชี Cloud Save + เข้าสู่ระบบด้วย Google
    const accY=top+rows.length*(rowH+gap);
    const isG=(typeof Cloud!=='undefined'&&Cloud.isGoogle&&Cloud.isGoogle());
    const label=(typeof Cloud!=='undefined'&&Cloud.accountLabel)?Cloud.accountLabel():'Not connected';
    this._rowBtn(accY,rowH,isG?'✅':'☁️','Cloud Save Account',isG?('Google: '+label):'Link Google to protect your save + play across devices',isG?'Sign out':'Sign in with Google',isG?'#e0788a':'#8bd3a0',()=>this.doGoogleAuth(isG),rx,rw);
    // โหลดสถานะบัญชีจากคลาวด์ (async) แล้ว rebuild ให้แถวUpdates (เช่น หลังกลับจาก Google redirect โชว์อีเมล)
    if(typeof Cloud!=='undefined'&&Cloud.ensureClient&&!this._acctChecked){ this._acctChecked=true; Cloud.ensureClient().then(()=>{ if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); }); }
    // 🗑️ รีเซ็ตความคืบหน้า — ซ่อนลึกในหน้าSettings + ต้องยืนยัน 3 timesกันกดพลาด (เดิมอยู่หน้า Hub แรกเข้าถึงง่ายไป)
    const rc=this._resetTaps||0;
    const labels=['🗑️ Reset progress (tap to wipe)','⚠️ Tap 2 more times to confirm','⚠️ Tap 1 more time to confirm'];
    const rt=this.add.text(w/2,h-30,labels[Math.min(rc,2)],{fontFamily:'sans-serif',fontSize:'11px',color:rc>0?'#ff8fb5':'#6f6578'}).setOrigin(0.5);this.menu.add(rt);
    this._zone(w/2-140,h-44,280,30,()=>{
      this._resetTaps=(this._resetTaps||0)+1;
      if(this._resetTaps>=3){ this._resetTaps=0; Sfx.clear(); this.wipeAndRestart?.(true); return; }   // v7.9.73 เจ้าของ: รีเซ็ตแล้วโหลดเกมใหม่ (หน้าเปิดเกม → บทสอน)
      Sfx.select(); this.buildSettings();
      clearTimeout(this._resetTapTimer); this._resetTapTimer=setTimeout(()=>{ if(this._resetTaps){ this._resetTaps=0; if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); } },2600);
    });
    const hint=this.add.text(w/2,h-14,'Tap a row to change it · saved automatically',{fontFamily:'sans-serif',fontSize:'10px',color:'#8f849f'}).setOrigin(0.5);this.menu.add(hint);this.menu.setVisible(true);
  }
  // v6.95 📊 หน้าสถิติการเล่น (ข้อมูลในเครื่องนี้เท่านั้น)
  buildPlayStats(){   // v7.4.2 ชื่อแยกจาก buildStats (แท็บ Stats หน้า Heroes) — เดิมชื่อซ้ำ ตัวหลังทับ → เปิด Heroes แล้วเด้งมาหน้านี้
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('📊 Play Stats','screen_settings','settings');
    const w=this.W,h=this.H,cw=Math.min(w-24,520),x0=(w-cw)/2,runs=Stats.load();let y=w<=h?88:62;
    const T=(x,yy,t,sz,c,st,o)=>{const q=this.add.text(x,yy,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:c||'#e6dcf0',wordWrap:{width:cw-12}}).setOrigin(o===undefined?0:o,0);this.menu.add(q);return q;};
    const lab=i=>{const st=STAGES[i];return st&&st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):('C'+(Math.floor(i/5)+1)+'-'+(i%5+1));};
    const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    // v7.4 หน่วยความจำกราฟิกที่ใช้อยู่ (ภาพที่ถอดรหัสเข้า GPU) — ไว้เทียบเวลาเจอจอขาว/กราฟิกดับ
    { const mem='Graphics memory: '+Math.round(this.texMB())+' MB / budget '+TEX_BUDGET_MB+' MB · render ×'+(Math.round(RENDER_DPR*100)/100)+(LOW_MEMORY_DEVICE?' · low-memory':''); Stats._mem=mem; T(x0,y,mem,11,'#8fd3ff','bold'); y+=18; }
    if(!runs.length){ T(w/2,y+40,'No runs recorded yet.\nPlay a stage and come back here.',14,'#bfb5ca','bold',0.5); this.menu.setVisible(true); return; }
    const wins=runs.filter(r=>r.result==='win').length;
    T(x0,y,'Saved on this device only · last '+runs.length+' runs · '+wins+' wins ('+Math.round(100*wins/runs.length)+'%)',11,'#9dff9d','bold'); y+=22;
    // ต่อด่าน (story)
    const by={}; runs.filter(r=>r.mode==='story').forEach(r=>{ const k=r.stage+'|'+r.diff,o=by[k]||(by[k]={stage:r.stage,diff:r.diff,n:0,w:0,sec:0,cause:{}}); o.n++; if(r.result==='win'){o.w++;o.sec+=r.sec||0;} else if(r.cause)o.cause[r.cause]=(o.cause[r.cause]||0)+1; });
    const rows=Object.values(by).sort((a,b)=>a.stage-b.stage||a.diff-b.diff);
    T(x0,y,'STORY · stage ★diff — wins/tries · avg clear time · top death cause',11,'#ffe08a','bold'); y+=18;
    const maxRows=Math.max(3,Math.floor((h-y-200)/16));
    rows.slice(0,maxRows).forEach(o=>{ const top=Object.keys(o.cause).sort((a,b)=>o.cause[b]-o.cause[a])[0];
      T(x0+6,y,lab(o.stage)+' ★'+o.diff+'   '+o.w+'/'+o.n+' ('+Math.round(100*o.w/o.n)+'%)   '+(o.w?fmt(Math.round(o.sec/o.w)):'—')+(top?'   ☠ '+top:''),11,o.w/o.n<0.4?'#ff9bb5':'#e6dcf0'); y+=16; });
    if(rows.length>maxRows){T(x0+6,y,'… +'+(rows.length-maxRows)+' more',10,'#8f849f');y+=16;}
    // ฮีโร่ + build + โหมด
    y+=6; const cnt=(f)=>{const m={};runs.forEach(r=>{const k=f(r);if(k)m[k]=(m[k]||0)+1;});return Object.keys(m).sort((a,b)=>m[b]-m[a]).map(k=>k+' '+m[k]).join(' · ');};
    T(x0,y,'Heroes: '+cnt(r=>(CHARACTERS[r.hero]||{}).name||r.hero),11,'#bfe8ff'); y+=18;
    T(x0,y,'Builds: '+(cnt(r=>r.path)||'—'),11,'#bfe8ff'); y+=18;
    T(x0,y,'Modes: '+cnt(r=>r.mode),11,'#bfe8ff'); y+=22;
    // รอบล่าสุด
    T(x0,y,'RECENT RUNS',11,'#ffe08a','bold'); y+=18;
    const icon={win:'🏆',dead:'☠',quit:'🚪'};
    runs.slice(-Math.max(2,Math.floor((h-y-96)/30))).reverse().forEach(r=>{ const where=r.mode==='story'?lab(r.stage)+' ★'+r.diff:r.mode+(r.depth!=null?' D'+r.depth:'');
      T(x0+6,y,(icon[r.result]||'?')+' '+where+' · '+((CHARACTERS[r.hero]||{}).name||r.hero)+(r.path?' ('+r.path+')':'')+' · '+fmt(r.sec||0)+' · Lv'+r.level+' · '+r.kills+' kills'+(r.cause?' · by '+r.cause:''),10,'#e6dcf0'); y+=14;
      if(r.cards&&r.cards.length){ const q=T(x0+18,y,'Cards: '+r.cards.slice(0,8).join(', ')+(r.cards.length>8?'…':''),9,'#9d93aa'); q.setWordWrapWidth(cw-24); if(q.height>13)q.setText(q.text.slice(0,Math.floor(q.text.length*13/q.height))+'…'); y+=16; } });
    { const bw2=Math.min((cw-10)/2,200),cp=(n,msg)=>{ Sfx.select(); Stats.copy(n).then(ok=>this.menuToast(ok?msg:'Copy failed on this device',ok?'#8ff0b0':'#ff9bb5')); };   /* v7.8.39 แชทตัดข้อความยาว → ปุ่ม copy รอบล่าสุด */
      this.uiPillBtn(this.menu,w/2-bw2/2-5,h-62,bw2,36,COLORS.mint,'📋','Copy last 3 runs',()=>cp(3,'📋 Last 3 runs copied — paste them anywhere'));
      this.uiPillBtn(this.menu,w/2+bw2/2+5,h-62,bw2,36,COLORS.grape,'📋','Copy all',()=>cp(0,'📋 All stats copied')); }
    const ct=this._statsClear||0,clr=this.add.text(w/2,h-26,ct?'⚠️ Tap again to delete all stats':'🗑️ Clear stats',{fontFamily:'sans-serif',fontSize:'11px',color:ct?'#ff8fb5':'#6f6578'}).setOrigin(0.5);this.menu.add(clr);
    this._zone(w/2-110,h-40,220,28,()=>{ if(this._statsClear){ this._statsClear=0; Stats.clear(); this.menuToast('Stats cleared'); } else this._statsClear=1; Sfx.select(); this.buildPlayStats(); });
    this.menu.setVisible(true);
  }
  // toast ที่เห็นได้ในหน้าเมนู (showBanner ผูกกล้องโลก ไม่โชว์ตอนอยู่เมนู)
  menuToast(msg,color){ if(this._toast){this._toast.destroy();this._toast=null;} if(this._toastBg){this._toastBg.destroy();this._toastBg=null;}
    const chrome=this.controlTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',muted:'#cfc1d4',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d,edge:0xf4d9a1};const w=this.W,y=this.H-88; const g=this.add.graphics(); g.fillStyle(chrome.surface,0.94); g.fillRoundedRect(w/2-170,y-20,340,40,12); g.lineStyle(1.5,chrome.border,1); g.strokeRoundedRect(w/2-170,y-20,340,40,12);
    const t=this.add.text(w/2,y,msg,{fontFamily:chrome.font,fontStyle:'bold',fontSize:'12px',color:color||chrome.currency,align:'center',wordWrap:{width:320}}).setOrigin(0.5);
    if(this.menu){this.menu.add([g,t]);} this._toast=t; this._toastBg=g;
    this.time.delayedCall(2600,()=>{ if(this._toast===t){t.destroy();g.destroy();this._toast=null;this._toastBg=null;} }); }
  // v7.9.73 ล้างเซฟในเครื่องแล้วโหลดหน้าใหม่ · cloudToo = รีเซ็ตบัญชี (เขียนเซฟว่างทับบนคลาวด์ด้วย ถ้าเข้าระบบอยู่) · false = ออกจากระบบ (คลาวด์เก็บไว้)
  async wipeAndRestart(cloudToo){ try{ GameLoader.show?.(cloudToo?'Resetting…':'Signing out…',.3); }catch(e){}
    try{ const r=(Save.data.rev||0)+1; Save.reset(); if(cloudToo&&typeof Cloud!=='undefined'&&Cloud.ready){ Save.data.rev=r; Save.data.savedAt=Date.now(); try{ localStorage.setItem('mochi_save',JSON.stringify(Save.data)); }catch(e){} await Cloud.push(Save.data); } }catch(e){}
    if(!cloudToo){ try{ await Cloud.signOut(); }catch(e){} try{ localStorage.removeItem('mochi_save'); }catch(e){} }
    try{ localStorage.removeItem('mochi_cloud_base'); }catch(e){} window.__titleShown=false; setTimeout(()=>location.reload(),150); }
  // เข้าสู่ระบบ / ออกจากระบบ Google สำหรับ Cloud Save
  doGoogleAuth(signedIn){
    Sfx.select();
    if(typeof Cloud==='undefined'||!Cloud.enabled||!Cloud.enabled()){ this.menuToast('☁️ Cannot reach the cloud (SDK failed) — check your connection and refresh','#ff9bb5'); return; }
    if(signedIn){
      this.wipeAndRestart?.(false);   // v7.9.73 เจ้าของ: ออกจากระบบ = ล้างเซฟในเครื่อง (เซฟบนคลาวด์ยังอยู่ · เข้าระบบใหม่ได้คืน) แล้วโหลดเกมใหม่
      return;
    }
    this.menuToast('☁️ Opening Google…','#8bd3a0');
    Cloud.signInGoogle().then(r=>{
      if(!(r&&r.ok)){ this.menuToast('⚠️ '+((r&&r.msg)||'Connection failed — try again'),'#ff9bb5'); }
      // r.ok=true → เบราว์เซอร์รีไดเรกต์ไป Google เอง (ไม่ต้องทำอะไรต่อ)
    }).catch(e=>{ this.menuToast('⚠️ '+String(e&&e.message||e),'#ff9bb5'); });
  }
  // ---- Quest chain + badge helpers ----
  hasTargetBadge(target){try{const d=Save.data,day=localDayKey();
    if(target==='daily')return (typeof LoginCal!=='undefined'&&LoginCal.ready())||(typeof DailyQ!=='undefined')&&DailyQ.claimable();   // v7.5 รางวัลเข้าเกม หรือกล่อง Daily พร้อมเปิด
    if(target==='achievements')return awReady(d);   // v8.0.23 Awards ใหม่
    if(target==='rewards')return this.hasTargetBadge('daily')||this.hasTargetBadge('achievements');
    if(target==='gearInbox')return Save.gearInboxItems().length>0;
    if(target==='talents')return (typeof talentsOpen!=='function'||talentsOpen())&&heroTalentSpendable(d.character||'momo');
    if(target==='char')return Object.values(d.charUnlockNew||{}).some(Boolean)||this.hasTargetBadge('talents');
    if(target==='weave')return UPG_ORDER.some(k=>Save.talCanBuy(k))||(Save.talAllMax()&&Save.threads()>=Save.promoteThreadCost());   // v7.9.55 ซื้อ Core ได้ / เลื่อนยศได้
    if(target==='specialCores')return false;   // v8.0.22 รวมเข้า Rank Rewards
    if(target==='gear')return (d.gearItems||[]).some(g=>g.isNew)||!!this._gearBetter?.();   // v7.9.56 +ของในกระเป๋าที่ดีกว่าที่สวม
    if(target==='kitchen')return kitchenOpen()&&(FR_SIMPLE?Save.data.frPick==null:Save.frRecipes().slice(0,Save.frSlots()).some(r=>['t','e'].some(k=>!(r&&r[k])&&Object.entries(Save.frParts()).some(([pk,n])=>n>0&&pk[0]===k&&!(frPart(pk)||{}).cut))));   // v8.2.37 แบบย่อ: ยังไม่เคยเลือกสูตร · v7.9.56 ช่องสูตรว่าง + มีชิ้นส่วนวางได้
    if(target==='perks')return Save.rankUnpicked()>0;   // v8.0.22 ยศใหม่ยังไม่เลือกรางวัล
    if(target==='dig')return featureOpen('dig')&&Save.expReady();
    if(target==='upgrade')return this.hasTargetBadge('perks')||this.hasTargetBadge('weave')||this.hasTargetBadge('specialCores');
    if(target==='news')return this.hasNewsBadge();
    return false;}catch(e){return false;}}
  _gearBetter(){try{const d=Save.data,cid=d.character||'momo',items=d.gearItems||[],sig=cid+'|'+JSON.stringify(d.equippedGear||{})+'|'+items.map(g=>g.uid+':'+(g.enhanceLv||0)+':'+(g.itemLevel||0)+':'+((g.affixes||[]).length)).join(',');
    if(this._gbSig===sig)return this._gbVal; let v=false; const base=heroPower(cid,null);
    for(const it of items){ if(!it||it.grade==='start'||it.forgeChoice||Save.isGearEquipped(it.uid))continue; if(gearPowerDelta(it,base)>0){v=true;break;} }
    this._gbSig=sig; this._gbVal=v; return v;}catch(e){return false;}}
  hasClaimableTarget(target){const d=Save.data;
    if(target==='daily')return (typeof LoginCal!=='undefined'&&LoginCal.ready())||(typeof DailyQ!=='undefined')&&DailyQ.claimable();
    if(target==='achievements')return this.hasTargetBadge('achievements');
    if(target==='rewards')return this.hasClaimableTarget('daily')||this.hasClaimableTarget('achievements');
    if(target==='gearInbox')return this.hasTargetBadge('gearInbox');
    if(target==='dig')return this.hasTargetBadge('dig');
    return false;}
  navBadge(t){const d=Save.data||{},C=k=>this.hasClaimableTarget?.(k);
    if(t==='char')return Object.values(d.charUnlockNew||{}).some(Boolean);
    if(t==='gLoadout')return C('gearInbox')||!!this.hasTargetBadge?.('perks');
    if(t==='gActivity')return C('daily')||C('achievements')||C('dig');
    return false;}
  hasGroupBadge(key){const grp=HUB_GROUPS[key];return !!grp&&grp.rows.some(row=>this.hasTargetBadge(row[0]));}
  hasNewsBadge(){ return Save.data.seenVersion!==GAME_VERSION; }
  // v7.9.54 เปิดหน้าเมนูใหม่ → ชิ้นในหน้าไหลขึ้น+จางเข้า ทีละชิ้นจากบนลงล่าง (~0.3 วิ) · เฉพาะตอนเปลี่ยนหน้า (วาดหน้าเดิมซ้ำ = ไม่เล่น) · ข้ามพื้นหลังใหญ่/แถบเมนู/ชิ้นที่มี tween อยู่แล้ว
  menuEnterAnim(scr,n){ if(scr===this._enterLast||!this.tweens||this.state!=='menu')return; this._enterLast=scr; const W=this.W,H=this.H,list=this.menu.list.slice(0,n),nd=this._navDir,slide=(nd&&Date.now()-nd.at<700)?nd.d:0; this._navDir=null; const rise=!!this._enterRise,riseD=this._enterRiseDelay||0; this._enterRise=false; this._enterRiseDelay=0;   // v7.9.77 riseD: หนังสือเปิดให้เห็นหน้าก่อน แล้วชิ้นค่อยลอยขึ้น (ไม่โผล่-หาย-โผล่)
    for(const o of list){ if(!o||!o.active||!o.visible||o._menuBackdrop||o._noEnter)continue; if(this.tweens.isTweening(o)){ if(rise){ const a0=o.alpha; o.setAlpha(0); this.tweens.add({targets:o,alpha:a0,duration:700,delay:riseD+500,ease:'Sine.easeInOut'}); } continue; } let b=null;
      if(o.type==='Graphics'){ const q=o._bb; if(q&&q.x1>q.x0)b={y:q.y0+o.y,w:q.x1-q.x0,h:q.y1-q.y0}; } else if(o.getBounds){ try{ const r=o.getBounds(); b={y:r.y,w:r.width,h:r.height}; }catch(e){} }
      if(!b||(b.w>W*.9&&b.h>H*.35))continue; const y0=o.y,x0=o.x,a0=o.alpha,d=Math.max(0,Math.min(200,(b.y+b.h/2)/H*200));
      if(slide){ o.x=x0+slide*W*.18; o.setAlpha(0); this.tweens.add({targets:o,x:x0,duration:260,delay:d*.4,ease:'Cubic.easeOut'}); this.tweens.add({targets:o,alpha:a0,duration:180,delay:d*.4,ease:'Quad.easeOut'}); continue; }
      if(rise){ const rd=riseD+150+(1-(b.y+b.h/2)/H)*900; o.y=y0+34; o.setAlpha(0); this.tweens.add({targets:o,y:y0,duration:900,delay:rd,ease:'Cubic.easeOut'}); this.tweens.add({targets:o,alpha:a0,duration:700,delay:rd,ease:'Sine.easeInOut'}); continue; }   // v8.1.102 เจ้าของ: ลอยเข้านุ่มขึ้น (ไม่เด้งเกิน · ระยะสั้นลง · จางช้าลง)   // v7.9.71 หลังเปิดหนังสือ: ลอยขึ้นช้า ๆ ทีละชิ้น (ล่างก่อน → บน)
      o.y=y0+16; o.setAlpha(0); this.tweens.add({targets:o,y:y0,duration:280,delay:d,ease:'Back.easeOut'}); this.tweens.add({targets:o,alpha:a0,duration:200,delay:d,ease:'Quad.easeOut'}); } }
  // v7.9.54 จุดแจ้งเตือนเต้นเป็นจังหวะหัวใจ (เด้งใหญ่ 2 ครั้ง แล้วพัก) · tween หยุดเองเมื่อจุดถูกทำลาย
  drawBadgeDot(cont,x,y){ let g;
    if(this.textures.exists('ui_notify_dot')){ g=this.add.image(x,y,'ui_notify_dot').setDisplaySize(16,16); }
    else{ g=this.add.graphics(); g.fillStyle(0x000000,0.4); g.fillCircle(1,1,7); g.fillStyle(0xff3b5c,1); g.fillCircle(0,0,6.5); g.lineStyle(1.5,0xffffff,0.95); g.strokeCircle(0,0,6.5); g.setPosition(x,y); }
    cont.add(g); const s0x=g.scaleX,s0y=g.scaleY,st={k:1},ph=Math.random()*600;
    const tw=this.tweens.add({targets:st,k:1.38,duration:150,ease:'Quad.easeOut',yoyo:true,repeat:1,delay:ph,repeatDelay:60,loop:-1,loopDelay:1100,
      onUpdate:()=>{ if(!g.active){ tw.remove(); return; } g.setScale(s0x*st.k,s0y*st.k); }});
    return g; }
  hubArt(key,cx,cy,maxW,maxH){
    const k='hub_ui_'+key;if(!this.textures.exists(k))return null;const im=this.add.image(cx,cy,k),scale=Math.min(maxW/im.width,maxH/im.height);im.setScale(scale);this.menu.add(im);return im;
  }
  // v7.8.67: ไอคอนแต่ละรูปมีขอบโปร่งไม่เท่ากัน → วัดกรอบเนื้อภาพ (alpha) แล้วย่อให้เนื้อภาพเท่ากันทุกปุ่ม
  hubIconBox(key){const C=this._hubIconBox||(this._hubIconBox={});if(C[key])return C[key];let r={x:0,y:0,w:1,h:1};
    try{const img=this.textures.get(key).getSourceImage(),W=img.width,H=img.height,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.drawImage(img,0,0);const d=c.getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;
      for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2)if(d[(y*W+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
      if(x1>x0&&y1>y0)r={x:x0/W,y:y0/H,w:(x1-x0+2)/W,h:(y1-y0+2)/H};}catch(e){}
    return C[key]=r;}
  hubIconFit(o,key,cx,cy,size){const b=this.hubIconBox(key),fw=o.frame?.width||o.width||1,fh=o.frame?.height||o.height||1,k=size/Math.max(b.w*fw,b.h*fh);
    o.setScale(k);o.setPosition(cx+(.5-(b.x+b.w/2))*fw*k,cy+(.5-(b.y+b.h/2))*fh*k);return o;}
  hubGuideTag(B,label){
    const t=this.hubText(B.x+B.w-12,B.y+1,label,Math.max(9,Math.min(14,this.W*.027)),'#51300e',1),tw=t.width+16,th=Math.max(19,this.W*.043),x=B.x+B.w-tw-5,y=B.y-th*.38;
    const g=this.add.graphics();g.fillStyle(0x5b330c,.55).fillRoundedRect(x,y+2,tw,th,5);g.fillStyle(0xffdc72,1).fillGradientStyle(0xffeda8,0xffdc72,0xf4c65a,0xe7ae3e,1).fillRoundedRect(x,y,tw,th,5);g.lineStyle(1.5,0xfff0b8,1).strokeRoundedRect(x,y,tw,th,5);this.menu.add(g);t.setPosition(x+tw/2,y+th/2).setOrigin(.5);this.menu.remove(t);this.menu.add(t);
  }
  hubText(x,y,value,size,color='#fff0df',originX=0,originY=.5){
    const t=this.add.text(x,y,value,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:size+'px',color,stroke:'#482139',strokeThickness:0}).setOrigin(originX,originY);this.menu.add(t);return t;
  }
  hubTone(i){return [
    {top:0xc53b58,bottom:0x8b2945,edge:0xffba8f,text:'#fff5e6'},
    {top:0x234e4a,bottom:0x172f35,edge:0x86dcc3,text:'#c7f6e6'},
    {top:0x373957,bottom:0x242a43,edge:0xa5b5f3,text:'#dce4ff'},
    {top:0x534132,bottom:0x302e35,edge:0xf1c37c,text:'#ffe3b0'},
    {top:0x204751,bottom:0x1c303e,edge:0x7acbdb,text:'#c9eff5'},
    {top:0x333541,bottom:0x232633,edge:0x979cad,text:'#daddeb'}
  ][i];}
  hubPanel(x,y,w,h,tone=null){
    const t=tone||{top:0x292839,bottom:0x1c1e2c,edge:0xaaa6b5},r=Math.min(16,h*.24),g=this.add.graphics();
    g.fillStyle(0x0c101b,.38).fillRoundedRect(x,y+3,w,h,r);
    g.fillStyle(t.top,.97).fillGradientStyle(t.top,t.top,t.bottom,t.bottom,.97).fillRoundedRect(x,y,w,h,r);
    g.lineStyle(1.2,t.edge,tone?.65:.38).strokeRoundedRect(x+.5,y+.5,w-1,h-1,r);
    if(tone)g.fillStyle(t.edge,.85).fillRoundedRect(x+7,y+h*.25,3,h*.5,1.5);
    this.menu.add(g);return g;
  }
  hubMotionAllowed(){return !(typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}
  hubTween(config){if(!this.hubMotionAllowed())return null;const t=this.tweens.add(config);if(t)(this._hubTweens||(this._hubTweens=[])).push(t);return t;}
  stopHubMotion(){this._lobbyVoice=null;for(const t of this._hubTweens||[])t.remove();this._hubTweens=[];for(const e of this._hubEvents||[])e.remove(false);this._hubEvents=[];for(const n of this._hubMotes||[])if(n.active)n.destroy();this._hubMotes=[];}
  startHubAmbience(logoY){
    if(!this.hubMotionAllowed())return;
    this._hubMotes=[];const w=this.W,h=this.H,land=w>h,span=land?w*.43:w,top=Math.max(64,h*.13),bottom=Math.max(top+32,logoY-18);
    if(this.bpAnim?.('vfx_hub_petals')){for(let i=0;i<12;i++){const sz=14+(i%4)*4,x=span*((i*41)%97)/97,s=this.add.sprite(x,top-30,'vfx_hub_petals',i%8).setDisplaySize(sz,sz).setAlpha(.85);s.play({key:'vfx_hub_petals',startFrame:i%8});this.menu.add(s);this._hubMotes.push(s);   /* v7.8.59 ใบ 25 C1: กลีบดอกจริงปลิวแทนจุดกลม */
        const fall=()=>{if(!s.active)return;const x0=span*Math.random(),dur=7000+Math.random()*5000;s.setPosition(x0,top-30-Math.random()*60).setAlpha(.85);this.hubTween({targets:s,x:x0+(Math.random()<.5?-1:1)*(60+Math.random()*90),y:Math.min(h*.95,bottom+h*.25),alpha:.15,angle:'+='+(Math.random()<.5?-180:180),duration:dur,ease:'Sine.inOut',onComplete:fall});};this.time.delayedCall(i*650,fall);}
      if(this.events&&!this._hubShutdownHook){this._hubShutdownHook=true;this.events.once('shutdown',()=>{this.stopHubMotion();this._hubShutdownHook=false;});}return;}
    for(let i=0;i<8;i++){const x=span*(.08+((i*37)%83)/100),y=top+(bottom-top)*((i*29)%89)/100,r=1.8+(i%3)*.7,g=this.add.graphics();
      g.fillStyle(i%3===0?0xffda9b:0xffb5c7,1).fillEllipse(-r,-r*.5,r*2,r*1.2);g.setPosition(x,y).setAlpha(.35);this.menu.add(g);this._hubMotes.push(g);
      this.hubTween({targets:g,x:x+(i%2?12:-10),y:Math.min(bottom,y+18+i*2),angle:i%2?50:-40,alpha:.12,duration:4200+i*370,delay:i*190,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    }
    if(this.events&&!this._hubShutdownHook){this._hubShutdownHook=true;this.events.once('shutdown',()=>{this.stopHubMotion();this._hubShutdownHook=false;});}
  }
  // v7.8.59 ใบ 25: ฉากเมนูแบบชั้น · พิกัดผืน 1080×1920 ใน container root ที่สเกลตาม cover ของพื้นหลัง · คืน true ถ้าวางโมโม่ได้
  buildHubScene(bg){ const L=Object.fromEntries(HUB_LAYERS.map(r=>[r[0],r])),has=k=>this.textures.exists(k);if(!has('hub_momo_body')||bg?.type!=='Image')return false;
    const fw=bg.frame.realWidth||bg.frame.width,sc=Math.max(this.W/fw,this.H/(bg.frame.realHeight||bg.frame.height)),k=sc*fw/1080,root=this.add.container(this.W/2-540*k,this.H/2-960*k).setScale(k);this.menu.add(root);
    const motion=this.hubMotionAllowed(),put=(cont,key,dx=0,dy=0)=>{const r=L[key];if(!r||!has(key))return null;const [,x,y,w,h,ox,oy]=r,im=ox==null?this.add.image(x-dx,y-dy,key).setOrigin(0):this.add.image(x+w*ox-dx,y+h*oy-dy,key).setOrigin(ox,oy);im.setDisplaySize(w,h);cont.add(im);return im;},
      sway=(o,deg,ms,d=0)=>{if(o&&motion)this.hubTween({targets:o,angle:{from:-deg,to:deg},duration:ms,delay:d,yoyo:true,repeat:-1,ease:'Sine.inOut'});};
    const sky=put(root,'hub_sky_glow');if(sky&&motion)this.hubTween({targets:sky,alpha:{from:.6,to:1},duration:3000,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const win=put(root,'hub_window_lights');if(win&&motion)this.hubTween({targets:win,alpha:{from:.72,to:1},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut',repeatDelay:300});
    if(has('hub_cloud_sheet')&&motion&&this.tuFrames){TEMPLE_UI.hub_cloud_sheet&&this.tuFrames('hub_cloud_sheet');for(let i=0;i<3;i++){const c=this.add.image(-420,120+i*95,'hub_cloud_sheet','cell'+i).setDisplaySize(400,160).setAlpha(.55);root.add(c);const go=()=>{if(!c.active)return;c.x=-420;this.hubTween({targets:c,x:1500,duration:52000+i*9000,onComplete:go});};this.time.delayedCall(i*14000,go);}}
    if(this.bpAnim?.('vfx_hub_moon_twinkle'))for(let i=0;i<6;i++){const s=this.add.sprite(120+((i*173)%840),50+((i*97)%300),'vfx_hub_moon_twinkle',0).setDisplaySize(40,40);if(motion)s.play({key:'vfx_hub_moon_twinkle',startFrame:i%4});root.add(s);}
    const fl=L.vfx_hub_flag;if(fl&&this.bpAnim?.('vfx_hub_flag')){const s=this.add.sprite(fl[7],fl[8],'vfx_hub_flag',0).setDisplaySize(96,96);if(motion)s.play('vfx_hub_flag');root.add(s);}
    // โมโม่: hero bob ทั้งตัว · ชิ้นแกว่งรอบ pivot · แขน+ริบบิ้น+ประกายไม้เท้าอยู่ใน armC (หมุนรอบไหล่)
    const hero=this.add.container(0,0);root.add(hero);sway(put(hero,'hub_momo_cape'),2.5,2600);sway(put(hero,'hub_momo_braid'),3,2300,400);put(hero,'hub_momo_body');
    const bl=L.hub_momo_blink;let blink=null;if(bl&&has('hub_momo_blink')&&TEMPLE_UI.hub_momo_blink){this.tuFrames('hub_momo_blink');blink=this.add.image(bl[1],bl[2],'hub_momo_blink','cell1').setOrigin(0).setDisplaySize(bl[3],bl[4]).setVisible(false);hero.add(blink);}
    sway(put(hero,'hub_momo_hairflower'),3,2000,200);
    const ar=L.hub_momo_arm;if(ar&&has('hub_momo_arm')){const px=ar[1]+ar[3]*ar[5],py=ar[2]+ar[4]*ar[6],armC=this.add.container(px,py);hero.add(armC);put(armC,'hub_momo_arm',px,py);const rb=put(armC,'hub_momo_ribbon',px,py);sway(rb,5,900);
      const wa=L.vfx_hub_wand_sparkle;if(wa&&this.bpAnim?.('vfx_hub_wand_sparkle')){const s=this.add.sprite(wa[7]-px,wa[8]-py,'vfx_hub_wand_sparkle',0).setDisplaySize(230,230);if(motion)s.play('vfx_hub_wand_sparkle');armC.add(s);}
      if(motion)this.hubTween({targets:armC,angle:{from:-2,to:2},duration:2000,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
    if(motion){this.hubTween({targets:hero,y:-6,duration:1800,yoyo:true,repeat:-1,ease:'Sine.inOut'});
      if(blink)this.hubEvery(3000,3000,()=>{if(!blink.active)return;blink.setVisible(true).setFrame('cell1');this.time.delayedCall(50,()=>blink.active&&blink.setFrame('cell2'));this.time.delayedCall(120,()=>blink.active&&blink.setFrame('cell1'));this.time.delayedCall(170,()=>blink.active&&blink.setVisible(false));});}
    sway(put(root,'hub_fg_flowers_left'),1.5,3200);sway(put(root,'hub_fg_flowers_right'),1.5,2800,600);
    if(this.bpAnim?.('vfx_hub_firefly'))for(let i=0;i<7;i++){const x=80+((i*149)%920),y=1000+((i*61)%380),s=this.add.sprite(x,y,'vfx_hub_firefly',0).setDisplaySize(34,34);if(motion){s.play({key:'vfx_hub_firefly',startFrame:i%4});this.hubTween({targets:s,x:x+(i%2?40:-40),y:y-30-(i%3)*12,duration:2600+i*300,yoyo:true,repeat:-1,ease:'Sine.inOut'});}root.add(s);}
    return true; }
  // ทำซ้ำทุก ms (+สุ่ม jitter) ล้างใน stopHubMotion
  /* v8.1.130 เจ้าของ (UI polish lobby): เงินที่เพิ่มขึ้นตั้งแต่ครั้งก่อนที่เห็น → ตัวเลขวิ่งขึ้น 0.8 วิ + เด้ง + ประกายที่ไอคอน · ครั้งแรกไม่วิ่ง */
  lobbyCountUp(t,key,val,fmt,ix,iy){ val=Math.floor(Number(val)||0); const seen=this._lbSeen||(this._lbSeen={}),old=seen[key]; seen[key]=val; if(!t||!t.setText||old==null||val<=old||!this.tweens||!this.hubMotionAllowed?.())return;
    const st={v:old},sx=t.scaleX,sy=t.scaleY; t.setText(fmt(old)); this.time?.delayedCall?.(350,()=>{ if(!t.active)return; this.tweens.add({targets:st,v:val,duration:800,ease:'Cubic.easeOut',onUpdate:()=>{ if(t.active)t.setText(fmt(Math.round(st.v))); },onComplete:()=>{ if(!t.active)return; t.setText(fmt(val)); this.tweens.add({targets:t,scaleX:sx*1.25,scaleY:sy*1.25,duration:110,yoyo:true,ease:'Quad.out'}); }});
      if(ix!=null)for(let i=0;i<5;i++){ const sp=this.add.text(ix,iy,'✦',{fontSize:(9+i*2)+'px',color:'#fff3c4'}).setOrigin(.5); this.menu.add(sp); const a=i/5*Math.PI*2; this.tweens.add({targets:sp,x:ix+Math.cos(a)*22,y:iy+Math.sin(a)*16,alpha:0,duration:600,delay:i*40,onComplete:()=>sp.destroy()}); } }); }
  hubEvery(ms,jitter,fn){if(!this.hubMotionAllowed()||!this.time?.addEvent)return null;const ev={stop:false,remove(){this.stop=true;t?.remove(false);}};let t=null;const loop=()=>{if(ev.stop)return;t=this.time.delayedCall(ms+Math.random()*jitter,()=>{if(ev.stop)return;fn();loop();});};loop();(this._hubEvents||(this._hubEvents=[])).push(ev);return ev;}
  // แสงวิ่ง 1 ครั้งทับกล่อง (โลโก้/ปุ่ม Play)
  hubFlash(key,x,y,w,h){if(this.state!=='menu'||(this.menuScreen!=='hub'&&this.menuScreen!=='title')||!this.bpAnim?.(key))return;const s=this.add.sprite(x,y,key,0).setDisplaySize(w,h).setAlpha(.9);this.menu.add(s);s.play(key);s.once('animationcomplete',()=>s.destroy());}
  hubLayout(){
    const w=this.W,h=this.H,portrait=w<=h,side=Math.max(10,w*.026),gap=Math.max(9,w*.022),right=portrait?w-side:w*.97,left=portrait?side:w*.48;
    const width=right-left,menuTop=portrait?h*(h<680?.55:.57):94,bottom=h-(portrait?Math.max(36,h*.065):12),unit=(bottom-menuTop-gap*3)/4.3;
    const playH=unit*1.30,rowH=unit,half=(width-gap)/2;
    return {portrait,side,gap,menuTop,boxes:[{x:left,y:menuTop,w:width,h:playH},{x:left,y:menuTop+playH+gap,w:half,h:rowH},{x:left+half+gap,y:menuTop+playH+gap,w:half,h:rowH},{x:left,y:menuTop+playH+rowH+gap*2,w:half,h:rowH},{x:left+half+gap,y:menuTop+playH+rowH+gap*2,w:half,h:rowH}]};
  }
  // v7.9.48 เจ้าของ (อ้างอิงเกมอื่น ข้อ 1–4): Lobby = ฮีโร่ยืนในฉากด่านถัดไป + ป้ายด่านใหญ่ (กดเข้าด่าน) + ปุ่มทางลัดข้างจอ + ป้ายโปรไฟล์ · เมนูอื่นอยู่แถบล่าง
  lobbyStage(){ const us=Math.min(STAGES.length-1,Save.data.unlockedStage||0); let i=this._lobbyStage; if(i==null||i>us||i<0){ i=us; const m=Save.data.stageMastery||{}; while(i>0&&!isStageReady(i))i--; if(m[i]&&i<us)i++; } return i; }
  // v7.9.76 ระบบใหม่ที่เพิ่งปลด → แจ้งครั้งเดียว (เซฟเก่า: นับของที่เปิดอยู่แล้วว่าเห็นแล้ว ไม่แจ้งย้อนหลัง)
  featureReveal(){ const d=Save.data; if(!d||!d.tutorialDone)return; const open=Object.keys(FEATURE_NAME).filter(t=>featureOpen(t)&&FEATURE_OPEN[t]!=null&&t!=='daily'&&t!=='achievements');   // v8.0.71 รวมใน Rewards
    if(!d.featSeen){ d.featSeen={}; open.forEach(t=>d.featSeen[t]=1); Save.save(); return; }
    const nw=open.filter(t=>!d.featSeen[t]&&!(this._featQ||[]).includes(t)); if(!nw.length&&!(this._featQ||[]).length)return; if(!this._featQ)this._featQ=[]; this._featQ.push(...nw);
    this.time.delayedCall(350,()=>{ if(!(this._featC&&this._featC.active)&&!this._featFly){ this._featBusy=false; this.featRevealNext(); } }); }   // หน้าเมนูถูกสร้างใหม่ระหว่างแนะนำ (ภาพโหลดเสร็จ) → เริ่มตัวเดิมต่อ
  // v7.9.77 เจ้าของ: ระบบใหม่ต้องมีการแนะนำ → ไอคอนโผล่กลางจอ + Ruby อธิบาย → แตะ → ไอคอนลอยไปที่ปุ่มจริง + วงแสง → ตัวถัดไป · จบแล้วบทสอนเดิม (gearTut) ทำงานต่อ
  featHideAt(z){ const out=[],sc=this._mScrollMax>0?(this._mScroll||0):0,cx=z.x+z.w/2,cy=z.y+z.h/2-(z.fixedY==null?sc:0);
    for(const o of this.menu?.list||[]){ if(!o||!o.active||!o.visible||o===this._featC||!(o.alpha>0))continue; let b=null;
      if(o.type==='Graphics'){ const q=o._bb; if(q&&q.x1>q.x0)b={x:q.x0*o.scaleX+o.x,y:q.y0*o.scaleY+o.y,w:(q.x1-q.x0)*o.scaleX,h:(q.y1-q.y0)*o.scaleY}; }
      else if(o.getBounds){ try{ const r=o.getBounds(); b={x:r.x,y:r.y,w:r.width,h:r.height}; }catch(e){} }
      if(!b||b.w<=0||b.h<=0||b.w>z.w*1.4+12||b.h>z.h*1.4+12)continue; const mx=b.x+b.w/2,my=b.y+b.h/2;
      if(Math.abs(mx-cx)<=z.w/2+4&&Math.abs(my-cy)<=z.h/2+4){ out.push([o,o.alpha]); o.setAlpha(0); } }
    return out; }
  featShow(list,anim){ for(const [o,a] of list||[]){ if(!o.active)continue; if(anim&&this.tweens){ o.setAlpha(0); this.tweens.add({targets:o,alpha:a,duration:260}); } else o.setAlpha(a); } }
  // v8.0.24 ป๊อปอัปปฏิทินเข้าเกม 7 วัน ตอนเปิด Lobby ครั้งแรกของวัน (หรือเปิดหน้า Daily) · รอให้บทสอน/เปิดฟีเจอร์ใหม่จบก่อน
  loginPopup(from){ const d=Save.data; if(!d||typeof LoginCal==='undefined'||(from!=='preview'&&!LoginCal.ready())||!d.tutorialDone||!featureOpen('daily')||this.state!=='menu'||this._loginC?.active||this._chestOpen||this._gachaBusy)return;
    if(from!=='daily'&&from!=='preview'&&this.menuScreen!=='hub')return;   // v8.1.44 preview = ดูปฏิทินซ้ำหลังรับแล้ว (ไม่ให้ของ)
    if(this._rubyTalk||this._featBusy||(this._featQ&&this._featQ.length)||this._weaveTour||this._stage1Coach||(d.gearTut>=0&&d.gearTut<=1)||this._bookCover){ if(from!=='daily'&&from!=='preview')this.time?.delayedCall(1500,()=>this.loginPopup()); return; }
    if(this.ensureGroup&&!this.tuHas?.('l30_panel')&&Date.now()-(this._loginArtTriedAt||0)>15000){if(this._loginArtLoading)return;this._loginArtLoading=true;const screen=this.menuScreen;
      this.ensureGroup(k=>/^(login_|day_reward|l30_)/.test(k),()=>{this._loginArtLoading=false;this._loginArtTriedAt=Date.now();if(this.state==='menu'&&this.menuScreen===screen)this.loginPopup(from);},{all:true,quiet:true});return;}
    const W=this.W,H=this.H,cal=LoginCal.data(),cur=((cal.i%LOGIN_DAYS)+LOGIN_DAYS)%LOGIN_DAYS,c=this.add.container(0,0); c._menuBackdrop=true; this.menu.add(c); this._loginC=c;Sfx.menuCue?.('login_open',.32);
    const dim=this.add.rectangle(0,0,W,H,0x07040c,.82).setOrigin(0); c.add(dim);
    const wk=Math.floor(cur/7),wS=wk*7,wE=Math.min(LOGIN_DAYS,wS+7),wN=wE-wS,COLS=4,ROWS=Math.ceil(wN/COLS),GAP=6,pw=Math.min(W-24,400),cell=Math.max(30,Math.min(Math.floor((pw-28-(COLS-1)*GAP)/COLS),Math.floor((H-24-220-(ROWS-1)*GAP)/ROWS),84)),ph=ROWS*cell+(ROWS-1)*GAP+220,px=(W-pw)/2,py=Math.max(12,(H-ph)/2-10),g=this.add.graphics();
    g.fillStyle(0x241a30,1).fillRoundedRect(px,py,pw,ph,18).lineStyle(2.5,0xffd166,1).strokeRoundedRect(px,py,pw,ph,18); c.add(g);const l30=!!this.menuArtPanel?.('l30_panel',0,px,py,pw,ph,c),paper=l30||!!this.menuArtPanel?.('login_panel',0,px,py,pw,ph,c);if(paper)g.clear();   /* v8.1.43 ใบ 65 · ไม่มีภาพใหม่ = ภาพใบ 51 / วาดเอง */
    if(l30){this.menuArtIcon?.('l30_header',0,W/2,py+16,300,75,c);if(W>=340)this.menuArtIcon?.('l30_ruby',0,px+pw-24,py-2,92,92,c);}   /* v8.1.52 menuArtIcon วางจากจุดกึ่งกลาง (เดิมส่งมุมซ้ายบน → เลื่อนซ้าย/ขึ้น) */
    const T=(x,y,t,sz,col,st,ox=.5)=>{ const q=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:st||'normal',fontSize:sz+'px',color:paper?this.menuArtInk(col):col||'#fff',align:'center'}).setOrigin(ox,.5); c.add(q); return q; };
    {const tt=T(W/2,py+(l30?14:24),l30?'Daily Login':'📅 Daily Login',19,'#ffe08a','bold');if(l30)tt.setColor('#fff4dc').setStroke('#5a2340',3);} T(W/2,py+(l30?54:46),'Day '+(cur+1)+' of '+LOGIN_DAYS+' · a new gift every day',11,'#cfc2d5');
    const cells=[]; LOGIN_CAL.forEach((r,j)=>{ if(j<wS||j>=wE)return; const k=j-wS,row=Math.floor(k/COLS),col=k%COLS,rn=row===0?Math.min(COLS,wN):wN-COLS,big=!!r.big,cw=cell,gw=rn*cell+(rn-1)*GAP,x=px+(pw-gw)/2+col*(cell+GAP),y=py+(l30?70:64)+row*(cell+GAP),done=j<cur,today=j===cur,cg=this.add.graphics();
      cg.fillStyle(today?0x5a3d1a:done?0x1f3328:0x1a1422,1).fillRoundedRect(x,y,cw,cell,10).lineStyle(big?3:2,today||big?0xffd166:done?0x7fe3a8:0x4a4059,1).strokeRoundedRect(x,y,cw,cell,10); c.add(cg);if(paper)cg.clear().fillStyle(0xf3e4cc,1).fillRoundedRect(x,y,cw,cell,12);if((l30&&(big?this.menuArtIcon?.('l30_cell30',done?1:0,x+cw/2,y+cell/2,cw,cell,c):this.menuArtIcon?.('l30_cell',today?1:done?2:r.k==='gold'?3:0,x+cw/2,y+cell/2,cw,cell,c)))||this.menuArtPanel?.('login_cell',today?1:done?2:0,x,y,cw,cell,c))cg.clear();if(today)(l30&&this.menuArtFx?.('l30_today_fx',x+cw/2,y+cell/2,cell*1.22,{parent:c,loop:true}))||this.menuArtFx?.('login_glow',x+cw/2,y+cell/2,cell*1.18,{parent:c,loop:true});
      { const dn=T(x+cw/2,y+Math.max(7,cell*.18),(cell<44||l30)?String(j+1):'Day '+(j+1),l30?11:cell<44?8:9,today?'#ffe08a':'#a89cb6','bold'); if(l30)dn.setColor('#5a2340').setStroke('#fff4dc',3).setPosition(x+cell*.2,y+cell*.2); }   /* v8.1.67 เลขวันอ่านออกบนกรอบภาพ */
      const ck=r.k==='silver'?'chest_silver':r.k==='gold'?'chest_gold':null,isz=cell*.42; let ic;
      const l30i=l30?(big?this.menuArtIcon?.('l30_reward30',0,x+cw/2,y+cell*.48,isz*1.5,isz*1.5,c):this.menuArtIcon?.('l30_reward',r.k==='sugar'?(r.n>=600?1:0):r.k==='thread'?2:r.k==='cur'?3:r.k==='silver'?4:5,x+cw/2,y+cell*.48,isz*1.15,isz*1.15,c)):null;
      if(l30i)ic=l30i; else if(ck&&this.realTex(ck)){ ic=this.add.image(x+cw/2,y+cell*.48,ck); ic.setScale(isz*1.15/Math.max(ic.width,ic.height)); } else ic=this.menuArtIcon?.('day_reward',r.k==='sugar'&&r.n>=600?3:r.k==='thread'?1:r.k==='cur'?2:0,x+cw/2,y+cell*.48,isz,isz,c)||this.add.text(x+cw/2,y+cell*.48,r.emoji,{fontSize:Math.round(isz*.8)+'px'}).setOrigin(.5);
      ic.setAlpha(done?.45:1); c.add(ic); T(x+cw/2,y+cell-Math.max(7,cell*.16),r.k==='silver'||r.k==='gold'?(cell<48?(r.k==='gold'?'Gold':'Silver'):r.name):'+'+LoginCal.amount(r),cell<48?8:r.k==='silver'||r.k==='gold'?9:10,done?'#7fe3a8':'#ffffff','bold')[l30?'setStroke':'setAlpha'](...(l30?['#5a2340',3]:[1]))[l30?'setColor':'setAlpha'](l30?(done?'#b9f5cf':'#ffffff'):1);
      if(done&&!(l30&&this.menuArtIcon?.('l30_stamp',0,x+cw-cell*.24,y+cell*.24,cell*.56,cell*.56,c))&&!this.menuArtIcon?.('login_stamp',0,x+cw-cell*.24,y+cell*.24,cell*.46,cell*.46,c))T(x+cw-10,y+10,'✓',12,'#7fe3a8','bold');
      if(today&&this.tweens)this.tweens.add({targets:ic,scaleX:ic.scaleX*1.12,scaleY:ic.scaleY*1.12,duration:480,yoyo:true,repeat:-1,ease:'Sine.inOut'});
      cells[j]={x,y,cw}; });
    const ny=py+(l30?70:64)+ROWS*cell+(ROWS-1)*GAP+14;   /* v8.1.53 เจ้าของ: 30 วันแต่แสดงทีละสัปดาห์ (ช่องใหญ่ขึ้น) + แถบความคืบหน้าไปวันที่ 30 */
    { const bw2=pw-96,bx2=px+30,bg2=this.add.graphics(); bg2.fillStyle(0x3a2a40,.35).fillRoundedRect(bx2,ny+4,bw2,12,6).fillStyle(0xffb020,1).fillRoundedRect(bx2,ny+4,Math.max(12,bw2*cur/LOGIN_DAYS),12,6); c.add(bg2);
      T(bx2,ny-8,'Week '+(wk+1)+' of '+Math.ceil(LOGIN_DAYS/7)+' · '+cur+' / '+LOGIN_DAYS,10,'#cfc2d5','bold',0);
      const gx=bx2+bw2+30,gy=ny+8; if(!(l30&&this.menuArtIcon?.('l30_reward30',0,gx,gy,40,40,c)))T(gx,gy,'🎁',22); T(gx,gy+26,'Day '+LOGIN_DAYS,9,'#ffe08a','bold'); }
    T(W/2,ny+44,'Missed a day? No problem — the calendar just waits for you.',10,'#a89cb6');
    const bw=Math.min(pw-40,240),bh=46,bx=W/2-bw/2,by=py+ph-bh-18,bg=this.add.graphics(); bg.fillStyle(0xffb020,1).fillRoundedRect(bx,by,bw,bh,14).fillStyle(0xffffff,.2).fillRoundedRect(bx+3,by+3,bw-6,bh*.42,10); c.add(bg);let btnArt=l30?this.menuArtPanel?.('l30_button',0,bx,by,bw,bh,c):null;if(btnArt)bg.clear();
    const bt=T(W/2,by+bh/2,from==='preview'?'Day '+(cur+1)+' · comes tomorrow':'🎁 Claim Day '+(cur+1),16,'#21131a','bold'); const t0=Date.now();
    this.tapZones=[]; this._zone(0,0,W,H,()=>{ if(Date.now()-t0<600)return; const res=from==='preview'?{i:cur,lines:['Preview only · next gift tomorrow']}:LoginCal.claim(); this.tapZones=[]; if(!res){ c.destroy(); this._loginC=null; this.buildMenuScreen(); return; }
      try{ (res.i===LOGIN_DAYS-1&&Sfx.menuCue?.('login_day30',.5))||Sfx.menuCue?.(LOGIN_CAL[res.i]?.k==='gold'?'login_day7':'login_claim',.45)||Sfx.progress&&Sfx.progress('daily'); }catch(e){}
      const at=cells[res.i]; if(at&&l30)this.menuArtFx?.('l30_claim_burst',at.x+at.cw/2,at.y+at.cw/2,at.cw*2.1,{parent:c}); if(at&&!(l30&&this.menuArtIcon?.('l30_stamp',0,at.x+at.cw-14,at.y+14,28,28,c))&&!this.menuArtIcon?.('login_stamp',0,at.x+at.cw-16,at.y+16,32,32,c)){ const ok=this.add.text(at.x+at.cw-12,at.y+12,'✓',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#7fe3a8'}).setOrigin(.5); c.add(ok); }
      if(res.chest){ const ch=CHESTS.find(x=>x.id===res.chest)||CHESTS[0]; this.time?.delayedCall(350,()=>{ c.destroy(); this._loginC=null; this._gachaBusy=false; this.openChest(ch,'login'); }); return; }
      if(btnArt){btnArt.destroy();btnArt=this.menuArtPanel?.('l30_button',1,bx,by,bw,bh,c);if(btnArt)c.moveBelow?.(btnArt,bt);}if(!btnArt)bg.clear().fillStyle(0x7fe3a8,1).fillRoundedRect(bx,by,bw,bh,14); bt.setText(res.lines.join('  ')).setFontSize('14px'); let f=14; while(bt.width>bw-12&&f>9)bt.setFontSize((--f)+'px');
      T(W/2,by-14,'Tap to continue',10,'#a89cb6'); const t1=Date.now();
      this._zone(0,0,W,H,()=>{ if(Date.now()-t1<500)return; c.destroy(); this._loginC=null; this.buildMenuScreen(); }); const z=this.tapZones[this.tapZones.length-1]; z.noBounce=true; z.tag='login_close'; });
    const z=this.tapZones[this.tapZones.length-1]; z.noBounce=true; z.tag='login_claim'; }
  rankTeach(){ const d=Save.data; if(!d||d.settings?.noRuby||d.rankTaught||this.state!=='menu'||this.menuScreen!=='upgrade'||!(Save.rankUnpicked?.()>0)||this._rubyTalk||this._featBusy||(this._featQ&&this._featQ.length)||this._weaveTour)return;   // v8.0.86 เจ้าของ: Rank up ครั้งแรก → สอนรับ Rank Reward
    if(!this.tapZones.some(z=>z.tag==='weave_perks'))return;
    this.rubyGuide(['Rank up! You earned a Rank Reward.','Tap Rank Rewards to pick one. It stays forever.'],()=>{d.rankTaught=true;Save.save();},{target:'weave_perks'}); }
  starTeach(){ const d=Save.data; if(!d||d.settings?.noRuby||d.starTaught||this._loginC||this.state!=='menu'||this.menuScreen!=='hub'||!(d.stageStars&&d.stageStars[0]!=null)||this._rubyTalk||this._featBusy||(this._featQ&&this._featQ.length)||this._weaveTour||this._stage1Coach||(d.gearTut>=0&&d.gearTut<=1))return;
    this.rubyGuide(['Each floor has three stars: clear it, finish with 70% HP, and never fall below 30% HP.','New stars give bonus Sugar. Tap the stage box any time to replay a floor.'],()=>{d.starTaught=true;Save.save();if(this.state==='menu')this.buildMenuScreen();},{target:'chapter'}); }
  revealBackdrop(cont,W,H){const bg=this.add.rectangle(0,0,W,H,0x170c20,1).setOrigin(0);cont.add(bg);if(this.realTex('reveal_theater'))cont.add(this._coverImage(0,0,W,H,'reveal_theater'));else if(this.ensureGroup)this.ensureGroup(k=>k==='reveal_theater',()=>{if(bg.active&&cont.active&&this.realTex('reveal_theater'))cont.addAt(this._coverImage(0,0,W,H,'reveal_theater'),cont.getIndex(bg)+1);},{all:true,quiet:true});return bg;}
  loadRevealTheater(done){if(this.realTex('reveal_theater')||this._revealArtTried||!this.ensureGroup)return false;if(this._revealArtLoading)return true;this._revealArtLoading=true;const zones=this.tapZones;this.ensureGroup(k=>k==='reveal_theater',()=>{this._revealArtLoading=false;this._revealArtTried=true;if(this.state==='menu'&&this.tapZones===zones)done();},{all:true,quiet:true});return true;}
  featRevealNext(){ const q=this._featQ||[]; if(!q.length){ this._featQ=null; this._featBusy=false; this._featHid=null; this._featZones=null; if(this.state==='menu')this.buildMenuScreen(); return; }
    if(this.state!=='menu'||this.menuScreen!=='hub'){ this._featBusy=false; return; }
    if(this._bookCover||this._bookSkip){ this.time.delayedCall(400,()=>this.featRevealNext()); return; }
    if(q[0]==='dig')(typeof Sfx!=='undefined'&&Sfx.orderCue?.('dig_unlock',.45,1));   // v8.0.91
    if(this.loadRevealTheater(()=>this.featRevealNext()))return;
    this._featBusy=true; const t=q[0],d=Save.data; d.featSeen[t]=1; Save.save();
    const W=this.W,H=this.H,zs=(this.tapZones.length>1?this.tapZones:(this._featZones||[])).slice(),tag=FEAT_TAG[t]||t,tz=zs.find(z=>z.tag===tag&&z.nav)||zs.find(z=>z.tag===tag); this._featZones=zs;   // v7.9.93 ตัวที่ 2 เป็นต้นไป tapZones ถูกล้างแล้ว → ใช้ชุดเดิมของ Lobby (เดิมหาไม่เจอ = ลอยลงล่างจอ)
    if(!this._featHid||this._featHidZs!==zs[0]){ this._featHid={}; this._featHidZs=zs[0]; for(const k of q){ const tg=FEAT_TAG[k]||k,zk=zs.find(z=>z.tag===tg&&z.nav)||zs.find(z=>z.tag===tg); if(zk)this._featHid[k]=this.featHideAt(zk); } }
    const hid=this._featHid[t]||[];   // ซ่อนไอคอนจริงไว้ก่อน แล้วค่อยโผล่ตอนไอคอนลอยไปถึง (ไม่ซ้อนกัน)
    const c=this.add.container(0,0); c._menuBackdrop=true; this.menu.add(c); this._featC=c; const dim=this.revealBackdrop(c,W,H);
    const cy=H*.34,ray=this.add.circle(W/2,cy,58,0xffe3b4,.025);c.add(ray);
    const ik=FEAT_ICON[t]; let ic; if(ik&&this.textures.exists(ik)){ ic=this.add.image(W/2,cy,ik); ic.setScale(110/Math.max(ic.width,ic.height)); } else ic=this.add.text(W/2,cy,(FEATURE_NAME[t]||'✨').split(' ')[0],{fontSize:'72px'}).setOrigin(.5);
    const s1=ic.scale; ic.setScale(s1*.1); c.add(ic); this.tweens.add({targets:ic,scale:s1,duration:520,ease:'Back.out'}); Sfx.menuCue?.('feature_unlock',.45)||Sfx.select&&Sfx.select();
    const nb=this.add.text(W/2,cy-78,'NEW DISCOVERY',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffe5bc',padding:{x:10,y:3}}).setOrigin(.5); c.add(nb);
    const nm=this.add.text(W/2,cy+76,(FEATURE_NAME[t]||t).replace(/^\S+\s/,''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffe08a',stroke:'#1a0f1e',strokeThickness:5}).setOrigin(.5); c.add(nm);
    const bw=Math.min(W-32,380),bx=(W-bw)/2,by=H*.61,bh=Math.min(144,H*.27),box=this.add.graphics(); box.fillStyle(0x231324,.94).fillRoundedRect(bx,by,bw,bh,18).lineStyle(1.5,0xdcb78a,.9).strokeRoundedRect(bx,by,bw,bh,18); c.add(box);
    const av=this.rubyAvatar(bx-6,by+bh/2+30,58); if(av)c.add(av);
    c.add(this.add.text(bx+86,by+16,FEAT_LINE[t]||'Something new just opened!',{fontFamily:'sans-serif',fontSize:'15px',color:'#ffffff',lineSpacing:5,wordWrap:{width:bw-104}}));if(FEAT_LINE[t]){this.voiceLine?.('ruby',FEAT_LINE[t],()=>this._featC===c&&c.active,c);c.once?.('destroy',()=>this.voiceStop?.(c));}
    const hint=this.add.text(W/2,by+bh-16,'Show me where  ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#8fe8ff'}).setOrigin(.5).setAlpha(0); c.add(hint); this.tweens.add({targets:hint,alpha:1,delay:700,duration:300});
    const t0=Date.now(); this.tapZones=[]; this._zone(0,0,W,H,()=>{ if(Date.now()-t0<800)return; this.tapZones=[]; Sfx.ui&&Sfx.ui();
      this.tweens.add({targets:[dim,box,nb,nm,hint,ray].concat(av?[av]:[]),alpha:0,duration:220}); c.each(o=>{ if(o!==ic&&o!==dim&&o!==box&&o!==nb&&o!==nm&&o!==hint&&o!==ray&&o!==av)this.tweens.add({targets:o,alpha:0,duration:220}); });
      Sfx.menuCue?.('feature_fly',.3);this._featFly=true; this.time.delayedCall(1500,()=>{ if(this._featFly){ this.featShow(hid); this._featFly=false; if(this._featQ&&this._featQ[0]===t)this._featQ.shift(); if(c.active)c.destroy(); this.featRevealNext(); } });   // ถ้าหน้าถูกสร้างใหม่ระหว่างลอย → ข้ามไปตัวถัดไปเอง
      const tx=tz?tz.x+tz.w/2:W/2,ty=tz?tz.y+tz.h/2-(tz.fixedY==null?(this._mScroll||0):0):H-30;
      this.tweens.add({targets:ic,x:tx,y:ty,scale:s1*.32,duration:620,ease:'Cubic.inOut',onComplete:()=>{ this.featShow(hid,true); const ring=this.add.circle(tx,ty,30,0xffd36e,0).setStrokeStyle(4,0xffe08a,1); c.add(ring);
        this.tweens.add({targets:ring,scale:2.2,alpha:0,duration:520,onComplete:()=>{ c.destroy(); if(!this._featFly)return; this._featFly=false; if(this._featQ&&this._featQ[0]===t)this._featQ.shift(); this.featRevealNext(); }}); this.tweens.add({targets:ic,alpha:0,duration:420,delay:120}); }}); });
    const z=this.tapZones[this.tapZones.length-1]; z.tag='feat_reveal'; z.noBounce=true; }
  // v8.1.107 ฉากด่าน + การ์ดฮีโร่ของ Lobby: เริ่มโหลดตั้งแต่หน้า Title (ก่อนเปิดหนังสือ) · โหลดเสร็จแล้วถ้าอยู่ Lobby สร้างใหม่ (ฉากจางเข้า)
  /* v8.1.142 owner 🐞 "menus bounce 2-3 times after C1-1": art batches finishing one after another each rebuilt the whole Lobby (8 rebuilds in 15 s) → merge into one rebuild, never during a feature reveal */
  hubRefresh(){ const now=Date.now(); if(this._hubRefreshAt&&now-this._hubRefreshAt<2000)return; this._hubRefreshAt=now;
    const go=()=>{ this._hubRefreshAt=0; if(this.state!=='menu'||this.menuScreen!=='hub')return; if(this._featBusy||this._bookCover){ this._hubRefreshAt=Date.now(); this.time?.delayedCall?.(500,go); return; } this.buildMenuScreen(); };
    if(this.time?.delayedCall)this.time.delayedCall(700,go); else go(); }
  lobbyPreload(){ const d=Save.data||{},c=CHARACTERS[d.character]?d.character:'momo',si=this.lobbyStage?.()||0,sk='stage_card_s'+String(si+1).padStart(2,'0'),hk=this.skinKey?.('card_'+c,c)||('card_'+c),
      miss=[sk,hk,'roster_'+c].filter(k=>!this.realTex(k)&&ASSET_IMAGES[k]); if(!miss.length||(this._lobbyLoading&&Date.now()-this._lobbyLoading<8000))return; this._lobbyLoading=Date.now();   /* v8.1.110 ภาพสำรอง (canvas) นับว่ายังไม่โหลด · ค้างเกิน 8 วิ = ลองใหม่ */
    try{ this.ensureGroup(k=>miss.includes(k),()=>{ this._lobbyLoading=false; this._lobbyBgIn=true; const go=()=>{ if(this.state!=='menu'||this.menuScreen!=='hub')return; if(this._bookCover)return this.time?.delayedCall?.(400,go); this.hubRefresh(); }; go(); },{all:true,quiet:true}); }catch(e){ this._lobbyLoading=false; } }
  buildLobby(){ if(!this._bookCover&&!this._bkFreed){ this._bkFreed=true; const free=(n)=>this.time?.delayedCall?.(n?8000:1500,()=>{ if(this._bookCover){ free(1); return; } const left=Object.keys(this.textures?.list||{}).some(k=>k.startsWith('bk_')&&this.realTex(k)); if(!left)return; this.texEvict?.(k=>k.startsWith('bk_'),null); if((n||0)<4)free((n||0)+1); }); free(0); }   /* v8.1.127 ลองซ้ำจนคืนได้ (ภาพที่เพิ่งโหลดไม่ถึง 20 วิ ถูกกันไว้) */   /* v8.1.122 อาร์ตหนังสือเปิด (~44 MB) ไม่ใช้แล้วหลังเข้า lobby */
    this.menu.setVisible(true);if(typeof Board!=='undefined')Board.submit(false); this.menuPrefetch?.(); this.featureReveal?.(); this.time?.delayedCall(700,()=>this.loginPopup?.()); this.time?.delayedCall(900,()=>this.starTeach?.());   // v7.9.49 หลังจบด่าน startRun ซ่อน menu ไว้ — ทุก builder ต้องเปิดเอง (Lobby ลืม → จอค้างโลกเกม)
    this.stopHubMotion();this.menu.removeAll(true);this.tapZones=[];const w=this.W,h=this.H,d=Save.data,c=CHARACTERS[d.character]?d.character:'momo',ch=CHARACTERS[c],si=this.lobbyStage(),st=STAGES[si]||STAGES[0];
    const sk='stage_card_s'+String(si+1).padStart(2,'0'),hk=this.skinKey?.('card_'+c,c)||('card_'+c);
    this.lobbyPreload();
    /* v8.1.141 owner 🐞: Strawberry stayed a placeholder in the Lobby after the tutorial → keep retrying the hero card every 3 s (max 10) and rebuild once it is real */
    if(!this.realTex(hk)&&ASSET_IMAGES[hk]&&Date.now()-(this._lobbyHeroRetryAt||0)>4000){ let n=0; const retry=()=>{ this._lobbyHeroRetryAt=Date.now(); if(this.state!=='menu'||this.menuScreen!=='hub'){ if(++n<=10)this.time?.delayedCall?.(3000,retry); return; }   /* v8.3.13 เจ้าของ: หลังบทสอนยังเห็นภาพสำรอง → ระหว่างมีหน้าต่าง Ruby ทับก็ลองต่อ */ if(this.realTex(hk)){ this.hubRefresh(); return; } if(++n>10)return; this._lobbyLoading=false; this.lobbyPreload(); this.time?.delayedCall?.(3000,retry); }; this._lobbyHeroRetryAt=Date.now(); this.time?.delayedCall?.(3000,retry); }
    const bgk=this.realTex(sk)?sk:null;   /* v8.1.107 เจ้าของ: หลังเปิดหนังสือเห็นภาพสำรอง (ฉาก Hub) แปลก → ไม่ใช้ภาพสำรองแล้ว · ฉากด่านโหลดตั้งแต่หน้า Title · ยังไม่มา = พื้นมืดเรียบ แล้วฉากด่านค่อย ๆ จางเข้า */
    const bg=bgk?this._coverImage(0,0,w,h,bgk):this.add.rectangle(0,0,w,h,0x1a1420,1).setOrigin(0);this.menu.add(bg);
    if(bgk&&this._lobbyBgIn){ this._lobbyBgIn=false; bg.setAlpha(0); this.tweens.add({targets:bg,alpha:1,duration:600,ease:'Sine.easeOut'}); }
    if(bg.type==='Image')this.hubTween({targets:bg,scaleX:bg.scaleX*1.015,scaleY:bg.scaleY*1.015,duration:9000,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const shade=this.add.graphics(),T0=48,B0=72;for(let i=0;i<T0;i++){const y0=Math.floor(i*h*.22/T0),y1=Math.floor((i+1)*h*.22/T0);shade.fillStyle(0x0d0816,.5*(1-i/T0)).fillRect(0,y0,w,y1-y0);}for(let i=0;i<B0;i++){const y0=Math.floor(h*.5+i*h*.5/B0),y1=Math.floor(h*.5+(i+1)*h*.5/B0);shade.fillStyle(0x0d0816,.66*(i+1)/B0).fillRect(0,y0,w,y1-y0);}this.menu.add(shade);
    // ── ข้อ 4 ป้ายโปรไฟล์ (ซ้ายบน): ฮีโร่ · Lv + EXP · Power · Rank · v7.9.51 ใบ 33 = กรอบ lb_profile_frame + lb_avatar_ring
    this.loadLobbyArt();
    const art=k=>this.tuHas(k),panel=(k,x,y,pw0,ph0,tone,cell=0)=>{ const p=art(k)?this.tuPanel(k,cell,x,y,pw0,ph0):null; if(p)this.menu.add(p); else this.hubPanel(x,y,pw0,ph0,tone); return p; },img=(k,cell,x,y,w0,h0)=>{ const o=art(k)?this.tuImg(k,cell,x,y,w0,h0):null; if(o)this.menu.add(o); return o; };
    const dim=this.add.graphics();dim.fillStyle(0x0d0816,.24).fillRect(0,0,w,h);this.menu.add(dim);
    const top=Math.max(10,h*.014),side=12,pw=Math.min(184,w*.47),ph=58;panel('lb_profile_frame',side,top,pw,ph);
    const fc=LOBBY_FACE[c];   // v7.9.62 หน้าฮีโร่จาก card_<hero> (roster_ เป็นภาพแนวนอน ครอปแล้วเห็นแค่ผม)
    if(fc&&this.textures.exists(hk)){ const av=this.add.image(0,0,hk).setOrigin(0),iw=av.width,ih=av.height,q=fc[2]*ih,fx=fc[0]*iw-q/2,fy=fc[1]*ih-q/2,k=44/q;av.setCrop(fx,fy,q,q).setScale(k).setPosition(side+31-(fx+q/2)*k,top+ph/2-(fy+q/2)*k);this.menu.add(av); }
    else if(this.textures.exists('roster_'+c)){ const av=this.add.image(side+31,top+ph/2,this.skinKey?.('roster_'+c,c)||('roster_'+c)),q=Math.min(av.width,av.height);av.setCrop((av.width-q)/2,(av.height-q)/2,q,q).setScale(44/q);this.menu.add(av); }
    if(!img('lb_avatar_ring',0,side+31,top+ph/2,54,54)){ const fr=this.add.graphics();fr.lineStyle(2,0xffd36e,.9).strokeRoundedRect(side+8,top+ph/2-23,46,46,8);this.menu.add(fr); }
    const cp=Save.cp(c)||{lvl:1,exp:0},need=charExpNeed(cp.lvl||1),tx=side+62;
    const fit=(t,max,min=11)=>{let fs=parseFloat(t.style.fontSize)||13;while(t.width>max&&fs>min)t.setFontSize(--fs+'px');return t;};
    const name=this.hubText(tx,top+14,ch.name+'  Lv '+(cp.lvl||1),13,'#fff3e0');fit(name,pw-74);let shortName=ch.name;while(name.width>pw-74&&shortName.length>1){shortName=shortName.slice(0,-1);name.setText(shortName+'…  Lv '+(cp.lvl||1));}
    const bw=pw-tx+side-12,bar=this.add.graphics();bar.fillStyle(0x000000,.45).fillRoundedRect(tx,top+25,bw,6,3).fillStyle(0x8fe3d0,1).fillRoundedRect(tx,top+25,Math.max(3,bw*Math.min(1,(cp.exp||0)/need)),6,3);this.menu.add(bar);
    const ps=this.powerStatus(si),titleRibbon=d.title&&this.menuArtPanel?.('aw_title_ribbon',0,tx-5,top+33,pw-68,20);fit(this.hubText(tx+(titleRibbon?3:0),top+43,'Rank '+(d.rank||0)+(d.title?' · '+d.title:''),11,titleRibbon?'#624124':'#ffe08a'),pw-74,8);   // v8.0.23 ฉายาจาก Awards
    { const fc=AW_CATS.find(q=>q.id===d.frame); if(fc){ const fg=this.add.graphics(); fg.lineStyle(2.5,fc.col,.95).strokeRoundedRect(side+2,top+2,pw-4,ph-4,12); this.menu.add(fg); } }   // v8.0.23 กรอบโปรไฟล์สีหมวด
    this._zone(side,top,pw,ph,()=>{this.menuScreen='char';this.buildMenuScreen();});
    // Sugar + ตั้งค่า (ขวาบน) · ช่อง Sugar = lb_currency_pill (ปุ่ม + ขวา → Bazaar)
    const gearW=36,gx=w-side-gearW;panel('lb_side_btn',gx,top,gearW,gearW);
    if(!img('ic_lb_settings',0,gx+gearW/2,top+gearW/2,27,27)){const cog=this.add.graphics(),cx=gx+gearW/2,cy=top+gearW/2;cog.fillStyle(0xe7e4ed,1);for(let i=0;i<8;i++){const a=i*Math.PI/4;cog.fillCircle(cx+Math.cos(a)*7,cy+Math.sin(a)*7,2.4);}cog.fillCircle(cx,cy,8).fillStyle(0x283041,1).fillCircle(cx,cy,3.2);this.menu.add(cog);}
    this._zone(gx-4,top-4,gearW+8,gearW+8,()=>{this.menuScreen='gMore';this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='gMore';
    const sx=side+pw+8,sw=gx-8-sx,moneyKey=art('lb_currency_plain')?'lb_currency_plain':'lb_power_pill';
    const compact=n=>{const v=Math.max(0,Math.floor(Number(n)||0)),units=['','K','M','B','T','Q'];let i=0,q=v;while(q>=1000&&i<units.length-1){q/=1000;i++;}const rounded=Number(q.toFixed(i?2:0));if(rounded>=1000&&i<units.length-1)return '1'+units[i+1];return String(rounded)+units[i];};
    panel(moneyKey,sx,top,sw,gearW);this.hubArt('candy',sx+16,top+gearW/2,20,20);
    { const t=fit(this.hubText(sx+sw-8,top+gearW/2,compact(d.sugar),14,'#ffe5aa',1),sw-36)||null; this.lobbyCountUp?.(t,'sugar',d.sugar,compact,sx+16,top+gearW/2); }
    if(featureOpen('bazaar')){ this._zone(sx,top,sw,gearW,()=>{this._bazTab=this._bazTab||'chests';this.menuScreen='bazaar';this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='bazaar'; }
    { const ty=top+gearW+6,th=30;panel(moneyKey,sx,ty,sw,th);
      if(this.realTex('ic_thread'))this.menu.add(this.add.image(sx+16,ty+th/2,'ic_thread').setDisplaySize(22,22)); else this.menu.add(this.add.text(sx+16,ty+th/2,'🧶',{fontSize:'15px'}).setOrigin(.5));
      { const t=fit(this.hubText(sx+sw-8,ty+th/2,compact(Save.threads?.()),13,'#cfe9ff',1),sw-36)||null; this.lobbyCountUp?.(t,'thread',Save.threads?.(),compact,sx+16,ty+th/2); }
      if(featureOpen('bazaar')){ this._zone(sx,ty-2,sw,th+4,()=>{this._bazTab='wardrobe';this.menuScreen='bazaar';this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='thread_pill';   /* v8.2.54 Thread ใช้กับของแต่งตัว (กล่อง Gear จ่าย Sugar แล้ว) */ }
      try{ const mr=(typeof MINERS_ON==='undefined'||MINERS_ON)&&Save.minersReady&&Save.minersReady()&&Save.minersTick(),mn=mr?Math.floor(mr.store||0):0;   // v8.0.27 เจ้าของ: เก็บด้ายจาก Miners ได้จาก Lobby
        if(mn>=1){ const my=ty+th+6,mh=26,mw=sw-16,mg=this.add.graphics(); mg.fillStyle(0x3d5a2a,.95).fillRoundedRect(sx,my,mw,mh,13).lineStyle(1.5,0xa8ffb0,1).strokeRoundedRect(sx,my,mw,mh,13); this.menu.add(mg);
          const miner=this.menuArtIcon?.('dig_miner',0,sx+14,my+mh/2,22);const mt=this.hubText(sx+mw/2+(miner?8:0),my+mh/2,(miner?'':'🧶 ')+'+'+mn+' ready',11,'#e8ffe0',.5); fit(mt,mw-10); this.drawBadgeDot(this.menu,sx+mw-4,my+2);
          this._zone(sx,my-2,mw,mh+4,()=>{ const n=Save.minersCollect(); if(n>0){ Sfx.menuCue?.('miners_collect',.35)||Sfx.digFind&&Sfx.digFind(); this.menuToast('👷 Miners dug 🧶 +'+n+' Thread','#a8ffb0'); } this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag='miners_collect'; } }catch(e){}
      try{ const lp=Save.lollipops?.()||0; if(lp>0){ const my=ty+th+6,mh=26,mw=sw-16,lg=this.add.graphics(); lg.fillStyle(0x4a2340,.95).fillRoundedRect(sx,my,mw,mh,13).lineStyle(1.5,0xffb8e8,1).strokeRoundedRect(sx,my,mw,mh,13); this.menu.add(lg);   /* v8.2.55 🍭 Lollipops (เงินจริง · ของแต่งตัวเท่านั้น) · โชว์เฉพาะตอนมี */
          fit(this.hubText(sx+mw/2,my+mh/2,'🍭 '+compact(lp),11,'#ffe0f4',.5),mw-10); this._zone(sx,my-2,mw,mh+4,()=>{ this._bazTab=(typeof IAP_ENABLED!=='undefined'&&IAP_ENABLED)?'thread':'wardrobe'; this.menuScreen='bazaar'; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag='lolli_pill'; } }catch(e){} }
    this.hubText(side,h-5,'v'+GAME_VERSION,8,'#d9cce6',0,1);
    // ── ข้อ 2 ปุ่มทางลัดข้างจอ (มีจุดแดงเมื่อมีของรอ) · กรอบ lb_side_btn + ไอคอน ic_side_*
    const sideBtn=(x,y,em,lab,t,ik,badge)=>{ if(!featureOpen(t))return; const s0=54;panel('lb_side_btn',x,y,s0,s0);
      if(!img(ik,0,x+s0/2,y+s0*.42,34,34))this.menu.add(this.add.text(x+s0/2,y+s0*.4,em,{fontSize:'22px'}).setOrigin(.5));
      this.hubText(x+s0/2,y+s0-9,lab,9,'#fff0df',.5);
      this._zone(x,y,s0,s0,()=>{this.menuScreen=t;this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='side_'+t; if(badge)this.drawBadgeDot(this.menu,x+s0-5,y+5); };
    // v7.9.63 ขวา 3 (ของรายวัน) · ซ้าย 2 (สะสม) ให้สมดุล
    const shortcuts=(x,rows)=>rows.filter(q=>featureOpen(q[2])).forEach(([em,lab,t,ik],i)=>sideBtn(x,top+ph+28+i*62,em,lab,t,ik,t==='gCodex'?false:this.hasTargetBadge(t)));
    shortcuts(w-side-54,[['📰','News','news','ic_side_news'],['🎁','Rewards','rewards','ic_side_daily']]);   // v8.0.71 เจ้าของ: Daily + Login + Awards รวมเป็นปุ่มเดียว
    shortcuts(side,[['📖','Codex','gCodex','ic_side_codex'],['📦','Mail','gearInbox',this.textures.exists('ic_side_mail')?'ic_side_mail':'ic_side_inbox']]);
    // ── v7.9.51 ใบ 33: กล่องด่าน (ข้อมูล) แยกจากปุ่ม BATTLE (กดเล่น) · ฮีโร่ยืนเหนือกล่อง
    const ready=isStageReady(si),btnW=Math.min(w*.78,300),btnH=Math.round(btnW*90/320),btnY=h-btnH-Math.max(10,h*.014),bx=(w-btnW)/2;
    const arW=36,panW=Math.min(300,w-2*(side+arW+6)),panH=Math.max(80,Math.min(96,h*.115)),panY=btnY-panH-8,px=(w-panW)/2;
    const seen=d.cardSeen||{},nw=Object.keys(CARD_UNLOCK).filter(k=>CARD_UNLOCK[k]===si&&!seen[k]);   // v7.9.50 progression hint
    const heroY=panY-(nw.length?20:10),heroH=Math.min(h*.46,heroY-(top+ph+126));
    // v7.9.62 ฉากหลังมืดลง + แสงนุ่มหลังตัว + แท่นแสง/เงาใต้เท้า (เดิมฮีโร่ลอยและกลืนกับฉาก)
    { const g=this.add.graphics(),hc=ch.color||0xffc6e0,gx0=w/2,gy0=heroY-heroH*.5,R0=heroH*.62,fy=heroY-heroH*(1-((LOBBY_FACE[c]||[])[3]||1))-2;
      for(let i=32;i>=1;i--)g.fillStyle(i>22?hc:0xfff1dc,.014).fillCircle(gx0,gy0,R0*i/32);
      for(let i=10;i>=1;i--)g.fillStyle(0xffe2a6,.08).fillEllipse(w/2,fy,heroH*.8*i/10,heroH*.15*i/10);
      const sg=this.add.graphics().setPosition(w/2,fy); if(!art('lb_hero_shadow')){sg.lineStyle(1.5,0xffe7b0,.5).strokeEllipse(0,0,heroH*.6,heroH*.1);sg.fillStyle(0x1a0f24,.35).fillEllipse(0,0,heroH*.4,heroH*.06).fillStyle(0x1a0f24,.25).fillEllipse(0,0,heroH*.24,heroH*.035);}this.menu.add(g);this.menu.add(sg);const si=img('lb_hero_shadow',0,w/2,fy,heroH*.8,heroH*.24);
      /* v8.1.148 เจ้าของ: ฮีโร่ Lobby มีมิติ/มีชีวิต → เงาหดตามตอนกระโดด + แสงหลังตัวหายใจ + ละอองลอยหลังตัว */
      this._lhShadow=[sg,si].filter(Boolean).map(o=>({o,sx:o.scaleX,sy:o.scaleY,a:o.alpha})); this.hubTween({targets:g,alpha:{from:.78,to:1},duration:2800,yoyo:true,repeat:-1,ease:'Sine.inOut'}); this.lobbyHeroAmbient?.('back',w/2,fy,heroH,ch.color||0xffc6e0); }
    this.lobbyCos?.(w/2,heroY,heroH);   // v8.1.47 ของแต่งที่ Lobby (ปีกอยู่หลังฮีโร่ เพราะวาดก่อน)
    this._lhSprite=null;   /* v8.2.36 E1: ชีตฮีโร่ขยับ (ใบ 34) ลบแล้ว */
    if(this.textures.exists(hk)&&this.lobbyHeroWarp?.(hk,w/2,heroY,heroH)){}
    else if(this.textures.exists(hk)){ const hi=this.add.image(w/2,heroY,hk).setOrigin(.5,1);hi.setScale(heroH/hi.height);this.menu.add(hi);this.hubTween({targets:hi,y:heroY-5,duration:1600,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
    else this.hubText(w/2,heroY-heroH/2,ch.emoji||'🍡',Math.min(96,heroH*.5),'#fff',.5);
    this.lobbyHeroAmbient?.('front',w/2,heroY,heroH,ch.color||0xffc6e0);
    /* v7.9.94 เจ้าของ: กล่องคำพูดลอยเหนือหัวฮีโร่ (หางชี้ลง) · กว้างไม่เกินช่องระหว่างปุ่มข้างจอ */
    { const gapW=w-2*(side+54)-8,bw=Math.max(120,Math.min(170,gapW-16)),lf=LOBBY_FACE[c]||[.5,.28,.27,1],headY=Math.min(heroY-heroH*(1-lf[1]+lf[2]*.62),heroY-heroH*.95+10),hx=w/2+(lf[0]-.5)*heroH*.55;
      this.startLobbyVoice(c,hx,headY,bw,top+ph+8,side+54+4,w-side-54-4); }
    // กล่องด่าน (A1) · CHAPTER · C1-1 · ชื่อ · ดาว 3 ดวง (D1)
    if(!panel('lb_stage_panel',px,panY,panW,panH)){ const pg=this.add.graphics();pg.fillStyle(0x000000,.4).fillRoundedRect(px+3,panY+4,panW,panH,18).fillStyle(0x2a1a3a,.96).fillRoundedRect(px,panY,panW,panH,18).lineStyle(3,0xffc43d,1).strokeRoundedRect(px,panY,panW,panH,18);this.menu.add(pg); }
    const chN=st.chapter||0,lab='C'+(chN+1)+'-'+(st.chapterStage||STAGES.slice(0,si+1).filter(x=>(x.chapter||0)===chN).length),starW=Math.round(panH*.22),SM=30,tcx=px+(panW-starW*3-SM)/2+8;   // v7.9.65 SM = ระยะดาวจากขอบขวา (เดิม 14 ชิดขอบเกิน)
    this.hubText(tcx,panY+panH*.2,'✦  C H A P T E R  '+(chN+1)+'  ✦',10,'#ffd98a',.5);
    const big=this.add.text(tcx,panY+panH*.5,lab,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.round(panH*.33)+'px',color:'#fff3df',stroke:'#2a1a3a',strokeThickness:3}).setOrigin(.5);this.menu.add(big);
    const nm=this.hubText(tcx,panY+panH*.82,st.name||'',11,'#f3dcc0',.5),nameRoom=panW-starW*3-SM-64;fit(nm,nameRoom,10);let stageName=st.name||'';while(nm.width>nameRoom&&stageName.length>1){stageName=stageName.slice(0,-1);nm.setText(stageName+'…');}
    const stars=(d.stageStars||{})[si]||0,scx=px+panW-SM-starW*1.5;[1,2,4].forEach((b,i)=>{ const sx0=px+panW-SM-starW*(3-i)+starW/2,sy0=panY+panH*.42; if(!img('lb_star',(stars&b)?0:1,sx0,sy0,starW,starW))this.hubText(sx0,sy0,(stars&b)?'★':'☆',Math.round(starW*.9),(stars&b)?'#ffd54a':'#6d6078',.5);
      if(!(stars&b)){ const og=this.add.graphics(),pts=[],R1=starW*.43,R2=R1*.45;for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?R2:R1;pts.push(new Phaser.Math.Vector2(sx0+Math.cos(a)*r,sy0+Math.sin(a)*r+starW*.03));} og.lineStyle(1.6,0xffd98a,.8).strokePoints(pts,true,true);this.menu.add(og); } });   // v7.9.63 ดาวที่ยังไม่ได้ = ขอบทอง (เดิมม่วงเข้มบนแผงม่วง)
    // v7.9.62 พลังย้ายเข้ากล่องด่าน (ใต้ดาว) · การ์ดใหม่ = ป้ายเล็กบนขอบกล่อง
    const pw2=this.hubText(px+panW-SM,panY+panH*.76,'⚡ '+Math.round(ps.cur)+' / '+Math.round(ps.rec),11,ps.ratio<.9?'#ffc58a':ps.hex,1);let f3=11;while(pw2.width>starW*3+16&&f3>8)pw2.setFontSize(--f3+'px');
    { const L0=px+20,room=(px+panW-SM-pw2.width)-L0-10; nm.setOrigin(0,.5).setX(L0).setText(st.name||'').setFontSize('11px'); let fs=11; while(nm.width>room&&fs>10)nm.setFontSize(--fs+'px'); if(nm.width>room){ const top=big.y+big.displayHeight/2,maxH=panY+panH-8-top; nm.setFontSize('10px').setWordWrapWidth(Math.max(48,room),true).setLineSpacing(-3).setOrigin(0,0).setY(top); if(nm.height>maxH){ let n2=st.name||''; while(nm.height>maxH&&n2.length>1){ n2=n2.slice(0,-1); nm.setText(n2+'…'); } } } }   // v8.0.75 เจ้าของ: ชื่อด่านถูกตัด → ชิดซ้าย ใช้ที่จนถึงตัวเลขพลัง · ยาวเกิน = 2 บรรทัด
    { const cy0=panY+panH-1,ct=this.add.text(w/2,cy0,'📜 All stages ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#3a2208'}).setOrigin(.5),cbw=ct.width+18,cg=this.add.graphics();   // v7.9.68 เจ้าของ: แตะกล่องด่าน = เลือกด่าน (แทนแท็บ Stages)
      cg.fillStyle(0x000000,.35).fillRoundedRect(w/2-cbw/2+1,cy0-8,cbw,17,8).fillStyle(0xffe08a,1).fillRoundedRect(w/2-cbw/2,cy0-9,cbw,17,8).lineStyle(1.5,0x8a5a12,1).strokeRoundedRect(w/2-cbw/2,cy0-9,cbw,17,8);this.menu.add(cg);this.menu.add(ct);
      this._zone(px,panY,panW,panH+8,()=>{ this.selectedChapter=chN; this.menuScreen='chapter'; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag='chapter'; }
    let spw=0; if(typeof MC_GALLERY!=='undefined'&&MC_GALLERY.some(g=>this.mcOpen?.(g[0]))){ const t=this.add.text(0,panY-1,'📖 Story',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#3a1530'}).setOrigin(.5);spw=t.width+16;const cx=px+panW-spw/2-6,g=this.add.graphics();t.x=cx;   // v8.0.4 แท็กดูเรื่องย้อนหลัง มุมขวาบนของกล่องด่าน
      g.fillStyle(0x000000,.35).fillRoundedRect(cx-spw/2+1,panY-9+2,spw,17,8).fillStyle(0xffc6e0,1).fillRoundedRect(cx-spw/2,panY-9,spw,17,8).lineStyle(1.5,0x8a3a5a,1).strokeRoundedRect(cx-spw/2,panY-9,spw,17,8);this.menu.add(g);this.menu.add(t);
      const zw=Math.max(64,spw+16);this._zone(cx-zw/2,panY-22,zw,44,()=>{ this.menuScreen='story'; this.buildMenuScreen(); });this.tapZones[this.tapZones.length-1].tag='story'; }
    if(nw.length){ const ncx=spw?px+(panW-spw-12)/2:w/2,nt=this.add.text(ncx,panY-1,'NEW: '+nw.map(k=>CARD_INTRO[k][0]+' '+CARD_INTRO[k][1]).join(' · '),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#3a2208'}).setOrigin(.5);let f4=10;while(nt.width>(spw?panW-spw-30:panW-40)&&f4>7)nt.setFontSize(--f4+'px');
      const bw2=nt.width+18,bh2=18,bg3=this.add.graphics();bg3.fillStyle(0x000000,.35).fillRoundedRect(ncx-bw2/2+1,panY-bh2/2+2,bw2,bh2,9).fillStyle(0xffd54a,1).fillRoundedRect(ncx-bw2/2,panY-bh2/2-1,bw2,bh2,9).lineStyle(1.5,0x8a5a12,1).strokeRoundedRect(ncx-bw2/2,panY-bh2/2-1,bw2,bh2,9);this.menu.add(bg3);this.menu.add(nt); }
    // ปุ่ม BATTLE (A2 + B1 + แสงวิ่ง D4) · แท็ก lobby_play
    const bN0=this.menu.list.length;
    if(!panel('lb_battle_btn',bx,btnY,btnW,btnH,null,ready?0:2)){ const bg2=this.add.graphics();bg2.fillStyle(0x000000,.4).fillRoundedRect(bx+3,btnY+5,btnW,btnH,22).fillStyle(ready?0xffc43d:0x8a7a6a,1).fillRoundedRect(bx,btnY,btnW,btnH,22).fillStyle(ready?0xffe08a:0xa89a8a,1).fillRoundedRect(bx+5,btnY+5,btnW-10,btnH*.42,16).lineStyle(3,0x5a3510,1).strokeRoundedRect(bx,btnY,btnW,btnH,22);this.menu.add(bg2); }
    const ic=img('ic_lb_battle',0,bx+btnW*.27,btnY+btnH*.46,btnH*.72,btnH*.72);
    this.menu.add(this.add.text(ic?bx+btnW*.6:w/2,btnY+btnH*.46,ready?'BATTLE':'SOON',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.round(btnH*.4)+'px',color:'#57300f',stroke:'#fff3cf',strokeThickness:3}).setOrigin(.5));
    if(ready&&art('vfx_lb_battle_shine')){ this.tuFrames('vfx_lb_battle_shine'); const sh=this.add.image(bx+btnW/2,btnY+btnH/2,'vfx_lb_battle_shine','cell0').setDisplaySize(btnW,btnH).setAlpha(0);this.menu.add(sh);
      this.hubEvery(3000,600,()=>{ if(!sh.active)return; sh.setAlpha(.85); for(let f=0;f<6;f++)this.time.delayedCall(f*80,()=>{ if(sh.active)sh.setFrame('cell'+f); }); this.time.delayedCall(500,()=>{ if(sh.active)sh.setAlpha(0); }); }); }
    // v7.9.54 ปุ่ม BATTLE หายใจ (ขยาย 3.5% เข้าออก รอบละ 1.8 วิ) · หยุดเมื่อกดปุ่ม/หน้าถูกวาดใหม่
    if(ready){ const parts=this.menu.list.slice(bN0).map(o=>(o._noEnter=true,{o,x:o.x,y:o.y,sx:o.scaleX,sy:o.scaleY})),bcx=bx+btnW/2,bcy=btnY+btnH/2,st={k:1};
      const tw=this.tweens.add({targets:st,k:1.035,duration:900,ease:'Sine.easeInOut',yoyo:true,repeat:-1,onUpdate:()=>{ if(!parts[0].o.active){ tw.remove(); return; } for(const p of parts){ p.o.x=bcx+(p.x-bcx)*st.k; p.o.y=bcy+(p.y-bcy)*st.k; p.o.setScale(p.sx*st.k,p.sy*st.k); } }});
      this._lbBreathe={tw,parts}; }
    if(art('vfx_lb_sparkle')){ this.tuFrames('vfx_lb_sparkle'); [[px+10,panY+6],[px+panW-10,panY+panH-6]].forEach(([x0,y0],i)=>{ const sp=this.add.image(x0,y0,'vfx_lb_sparkle','cell0').setDisplaySize(30,30);this.menu.add(sp); let f=i*2; this.hubEvery(140,0,()=>{ if(sp.active)sp.setFrame('cell'+(f=(f+1)%4)); }); }); }
    this._zone(bx,btnY,btnW,btnH,()=>{ if(!ready){this.menuToast('🛠️ Stage in production','#ffb4c7');return;}
      if(ps.ratio<.7&&!(this._lbWarnAt&&Date.now()-this._lbWarnAt<4000&&this._lbWarnSi===si)){ this._lbWarnAt=Date.now(); this._lbWarnSi=si; this.menuToast('⚡ Recommended '+Math.round(ps.rec)+' — tap BATTLE again to go','#ffc58a'); return; }
      this._lbWarnAt=0; this.startStoryStage(si); });this.tapZones[this.tapZones.length-1].tag='lobby_play';
    // ‹ › เลือกด่านที่ปลดแล้ว (A3)
    const us=Math.min(STAGES.length-1,d.unlockedStage||0),arH=Math.round(arW*60/48),arrow=(x,dir,ok)=>{ const ay=panY+panH/2;
      const a=img('lb_arrow_btn',0,x+arW/2,ay,arW,arH); if(a){ if(dir>0)a.setFlipX(true); a.setAlpha(ok?1:.4); } else { this.hubPanel(x,ay-22,arW,44);this.hubText(x+arW/2,ay,dir<0?'‹':'›',28,ok?'#fff0df':'#6d6078',.5); }
      this._zone(x-4,ay-arH/2-4,arW+8,arH+8,()=>{ if(!ok)return; Sfx.menuCue?.('ui_stage_swipe',.35); this._lobbyStage=si+dir; this.buildMenuScreen(); }); };
    arrow(px-arW-6,-1,si>0); arrow(px+panW+6,1,si<us&&isStageReady(si+1));
  }
  // v7.9.51 ใบ 33: โหลดชิ้น Lobby/แถบเมนูครั้งเดียวตอนเปิดเมนู (ไม่โหลดตอนบูต) แล้ววาดหน้าใหม่
  /* v7.9.58 ฮีโร่ขยับใน Lobby: โหลดชีตทีละอัน · anim ใช้เวลาต่อเฟรมจาก MANIFEST · ทิ้งชีตท่าชั่วคราวหลังเล่น */
  /* v7.9.61 ฮีโร่ใน Lobby ขยับจากภาพนิ่ง: ตัดภาพเป็นแถบแนวนอน 28 แถบ (setCrop) แล้วเลื่อนแต่ละแถบตามคลื่น — ส่วนบน (ผม/หัว) โยกมากกว่าเท้า
     หายใจ = ยืด/หดแนวตั้งรอบเท้า · แตะ = ยุบแล้วเด้ง · แตะรัว 5 ครั้งใน 3 วิ = กระโดดหมุนตัว · ใช้ได้ทั้ง canvas/WebGL */
  startLobbyVoice(hero,x,y,width,minY,left,right){
    const root=this.add.container(x,y),g=this.add.graphics(),label=this.add.text(0,0,'',{fontFamily:'NunitoUI, sans-serif',fontSize:'11px',fontStyle:'bold',color:'#583849'}).setOrigin(.5,0),text=this.add.text(0,17,'',{fontFamily:'NunitoUI, sans-serif',fontSize:'13px',fontStyle:'bold',color:'#302938',align:'center',wordWrap:{width:width-16,useAdvancedWrap:true}}).setOrigin(.5,0);
    root.add([g,label,text]);root.setVisible(false);this.menu.add(root);
    this._lobbyVoice={hero,root,g,label,text,width,t:1.5,showing:false,hx:x,hy:y,minY:minY??y-120,left:left??-1e9,right:right??1e9};
  }
  lobbyTapSay(){const v=this._lobbyVoice;if(!v||!v.root?.active||this.state!=='menu'||this.menuScreen!=='hub')return;const now=Date.now();if(now-(this._lobbyTapAt||0)<150)return;this._lobbyTapAt=now;   // v8.1.35 เจ้าของ: กดรัว = ตัดเสียงเดิม เปลี่ยนประโยคทันที (กันแตะซ้อนแค่ 0.15 วิ)
    if(v.showing)this.voiceStop?.(v);const lines=LOBBY_LINES[v.hero]||LOBBY_LINES.momo,c=this._lobbyLineCursor||(this._lobbyLineCursor={});for(let n=0;n<lines.length&&lines[(c[v.hero]||0)%lines.length][0]!=='says';n++)c[v.hero]=(c[v.hero]||0)+1;v.showing=false;v.t=0;this.tickLobbyVoice(0);}
  tickLobbyVoice(dt){
    const v=this._lobbyVoice;if(!v||!v.root.active)return;
    if(this.state!=='menu'||this.menuScreen!=='hub'||(Save.data.character||'momo')!==v.hero){this.voiceStop?.(v);v.root.setVisible(false);return;}
    // Tutorials and modal dialogue take precedence. No tap zone: the hero stays tappable.
    if(this._rubyTalk||this._featBusy||this._featC||this._coach||this._weaveTour||this._stage1Coach||this._mintCoach||this._titleGo){v.root.setVisible(false);v.t=1.5;v.showing=false;return;}
    v.t-=Math.min(.1,Math.max(0,dt));if(v.t>0)return;
    if(v.showing){this.voiceStop?.(v);v.root.setVisible(false);v.showing=false;v.t=5;return;}
    const lines=LOBBY_LINES[v.hero]||LOBBY_LINES.momo,cursors=this._lobbyLineCursor||(this._lobbyLineCursor={}),i=cursors[v.hero]||0,[kind,line]=lines[i%lines.length];cursors[v.hero]=i+1;
    v.label.setText((CHARACTERS[v.hero]?.name||'Hero')+(kind==='thinks'?' · thinking':' says'));
    v.text.setText(line);const H=21+v.text.height+10,PH=H+32,pw=v.width+16;
    v.g.clear();if(v.panel?.active)v.panel.destroy();v.panel=null;
    /* v7.9.94 หางของภาพอยู่มุมขวาบน → พลิกแนวตั้งให้หางชี้ลงที่หัว · เลื่อนกล่องไปซ้ายให้หางใกล้หัวที่สุดโดยไม่ทับปุ่มข้างจอ */
    const d=Math.min(PH*.28,pw/2),tailX=pw/2-d*.77,cx=Math.max(v.left+pw/2,Math.min(v.right-pw/2,(v.hx??0)-tailX));
    if(Number.isFinite(v.hy)){v.root.x=cx;v.root.y=Math.max(v.minY+24,v.hy-(H+8));}
    const key=kind==='thinks'?'lb_dialog_thought':'lb_dialog_speech';
    if(this.realTex?.(key)&&this.menuRasterPanel){v.panel=this.menuRasterPanel(key,-pw/2,-24,pw,PH,64);if(v.panel){if(v.panel.setScale){v.panel.setScale(1,-1);v.panel.y=-24+PH;}v.root.add(v.panel);v.root.sendToBack(v.panel);}}
    if(!v.panel){v.g.fillStyle(kind==='thinks'?0xebf3ff:0xfff6e7,.96).fillRoundedRect(-v.width/2,-4,v.width,H,12).lineStyle(1.5,kind==='thinks'?0xabc9eb:0xe3b976,1).strokeRoundedRect(-v.width/2,-4,v.width,H,12);
      if(kind==='thinks'){v.g.fillStyle(0xebf3ff,.96).fillCircle(tailX-6,H+3,4).fillCircle(tailX,H+10,2);}
      else{v.g.fillStyle(0xfff6e7,.96).fillTriangle(tailX-14,H-4,tailX,H-4,tailX+2,H+8);}}
    v.root.setVisible(true);v.showing=true;v.t=5.5;if(kind==='says'){const role=v.hero==='momo'?'strawberry':v.hero;this.voiceLine?.(role,line,()=>v.root.active&&v.showing&&this.menuScreen==='hub'&&v.text.text===line,v);}
    if(this.tweens&&v.root.setScale){v.root.setScale(.8);this.tweens.add({targets:v.root,scale:1,duration:220,ease:'Back.easeOut'});}
  }
  lobbyHeroWarp(key,x,y,H){ if(!this.textures.exists(key)||!this.tweens)return false; const src=this.textures.get(key).getSourceImage(),tw=src.width,th=src.height; if(!tw||!th)return false;
    const N=28,sc=H/th,c=this.add.container(x,y); this.menu.add(c); const strips=[];
    for(let i=0;i<N;i++){ const y0=Math.floor(th*i/N),y1=Math.ceil(th*(i+1)/N)+1,im=this.add.image(0,0,key).setOrigin(.5,1).setScale(sc); im.setCrop(0,y0,tw,Math.min(th,y1)-y0); c.add(im); strips.push({im,h:1-(i+.5)/N}); }
    const st={t:Math.random()*10,sq:0,hop:0,spin:0,amp:1,lean:0,H}; this._lhWarp={c,st,x,y}; const shd=this._lhShadow||[]; this._lhShadow=null;
    const upd=()=>{ if(!c.active)return; const t=st.t,br=Math.sin(t*2.1);
      const sy=(1+.018*br)*(1-st.sq),sx=(1-.010*br)*(1+st.sq*.7); c.setScale(sx,sy); c.y=y-st.hop; c.rotation=st.spin; this.cosFollow?.(st,x,y,sx,sy);
      for(const q of strips){ const h=q.h,bend=h*h; q.im.x=(st.amp*(bend*4.2*Math.sin(t*1.15)+h*h*h*1.6*Math.sin(t*3.3+h*5))+st.lean*h)/Math.max(.01,sx); }
      if(shd.length){ const k=Math.max(.45,1-st.hop/(H*.5)),wb=1+.02*br+st.sq*.5; for(const s of shd)if(s.o.active){ s.o.setScale(s.sx*k*wb,s.sy*k); s.o.setAlpha(s.a*(.4+.6*k)); s.o.x=x+st.lean*.15; } } };
    this.hubTween({targets:st,t:st.t+TAU*20,duration:120000,repeat:-1,onUpdate:upd}); upd();
    this._zone(x-H*.3,y-H*.95,H*.6,H*.95,()=>this.lobbyHeroTap()); const hz=this.tapZones[this.tapZones.length-1]; hz.tag='lobby_hero'; hz.noBounce=true;
    /* v8.1.148 เจ้าของ: ยืนเฉย ๆ นานแล้วขยับเอง (เขย่งดู / เอียงมอง / ยืดตัว / ส่ายดีใจ / กระโดดเบา ๆ) · ไม่เล่นถ้า FPS ต่ำ */
    this._lhIdleAt=Date.now(); this.hubEvery?.(5500,4000,()=>{ if(this._lhWarp?.st!==st||!c.active||st.busy||Date.now()-(this._lhIdleAt||0)<5000||(this.game?.loop?.actualFps||60)<35)return; this.lobbyHeroAct(st); });
    return true; }
  lobbyHeroAct(st,pick){ if(!this.tweens||!st)return; const H=st.H||300,acts=['peek','look','stretch','wiggle','hop'],a=pick||acts.filter(v=>v!==st.last)[Math.floor(Math.random()*(acts.length-1))]; st.last=a; st.busy=true;
    const done=()=>{ st.busy=false; },T=(cfg)=>this.tweens.add(Object.assign({targets:st},cfg));
    if(a==='peek'){ T({sq:-.05,hop:H*.025,duration:260,ease:'Sine.out',yoyo:true,hold:420,onComplete:()=>T({sq:0,hop:0,duration:120,ease:'Sine.inOut',onComplete:done})}); }
    else if(a==='look'){ const d=Math.random()<.5?-1:1; T({lean:d*H*.07,duration:420,ease:'Sine.inOut',onComplete:()=>T({lean:-d*H*.06,duration:620,delay:700,ease:'Sine.inOut',onComplete:()=>T({lean:0,duration:420,delay:600,ease:'Sine.inOut',onComplete:done})})}); }
    else if(a==='stretch'){ T({sq:-.08,duration:520,ease:'Sine.out',onComplete:()=>T({sq:.06,duration:180,delay:350,ease:'Quad.in',onComplete:()=>T({sq:0,duration:380,ease:'Back.out',onComplete:done})})}); }
    else if(a==='wiggle'){ st.amp=3; T({amp:1,duration:1100,ease:'Quad.out',onComplete:done}); }
    else { T({sq:.08,duration:110,ease:'Quad.out',onComplete:()=>T({sq:-.04,hop:H*.07,duration:200,ease:'Quad.out',onComplete:()=>T({sq:0,hop:0,duration:260,ease:'Bounce.out',onComplete:()=>T({sq:.06,duration:90,yoyo:true,onComplete:done})})})}); }
    return a; }
  /* v8.1.148 เจ้าของ: เพิ่มมิติ → 'back' ละอองแสงลอยขึ้นหลังตัว · 'front' โบเก้จาง ๆ หน้าตัว (ขยับช้า = รู้สึกมีระยะลึก) · ไม่มีภาพใหม่ */
  lobbyHeroAmbient(layer,x,footY,H,col){ if(!this.hubMotionAllowed?.()||!this.add?.graphics||!this.menu)return 0; const R=Math.random; let n=0;
    if(layer==='back'){ for(let i=0;i<7;i++){ const m=this.add.graphics(),r=1.6+R()*2.2; m.fillStyle(i%3?0xfff1dc:col,.9).fillCircle(0,0,r).fillStyle(0xffffff,.25).fillCircle(0,0,r*2.2); this.menu.add(m); n++;
        const go=()=>{ if(!m.active)return; const x0=x+(R()-.5)*H*.7; m.setPosition(x0,footY-H*(.05+R()*.25)).setAlpha(0); this.hubTween({targets:m,y:footY-H*(.75+R()*.25),x:x0+(R()-.5)*H*.15,alpha:{from:0,to:.8},duration:4200+R()*3000,ease:'Sine.inOut',onComplete:go}); };
        this.time?.delayedCall?.(i*650,go); } }
    else { const spots=[[-.46,-.22,.11],[.47,-.62,.08],[.34,-.04,.13]]; for(const [fx,fy,fr] of spots){ const b=this.add.graphics(),r=H*fr; for(let k=6;k>=1;k--)b.fillStyle(k>3?col:0xfff1dc,.035).fillCircle(0,0,r*k/6); b.setPosition(x+fx*H,footY+fy*H); this.menu.add(b); n++;
        this.hubTween({targets:b,x:b.x+(R()<.5?-1:1)*(8+R()*10),y:b.y-(10+R()*12),alpha:{from:1,to:.55},duration:5200+R()*2500,yoyo:true,repeat:-1,ease:'Sine.inOut'}); } }
    return n; }
  lobbyHeroTap(){ const W=this._lhWarp; if(!W||!W.c.active)return; this._lhIdleAt=Date.now(); const st=W.st,now=Date.now(),tp=(this._lhTaps||[]).filter(v=>now-v<3000); tp.push(now); this._lhTaps=tp;
    const big=tp.length>=5; if(big)this._lhTaps=[]; this.tweens.add({targets:st,sq:big?.16:.12,duration:90,ease:'Quad.out',onComplete:()=>{ this.tweens.add({targets:st,sq:-.05,hop:big?70:22,duration:big?260:170,ease:'Quad.out',onComplete:()=>{ this.tweens.add({targets:st,sq:0,hop:0,duration:big?320:220,ease:'Bounce.out'}); }}); }});
    /* v7.9.77 เจ้าของ: แตะรัวแล้วไม่หมุนตัวแล้ว → ส่ายแรงขึ้นแทน */
    st.amp=big?4:2.2; this.tweens.add({targets:st,amp:1,duration:900,ease:'Quad.out'}); Sfx.voice?.((Save.data.character||'momo')+(big?'_poke':'_tap'),.24)||Sfx.select&&Sfx.select(); }
  loadLobbyArt(){ if(this._lbArt)return; const miss=[...LB_KEYS,'dig_miner','aw_title_ribbon'].filter(k=>!this.realTex(k)&&ASSET_IMAGES[k]); if(!miss.length)return; this._lbArt=true;   // v7.9.70 เช็กทุกครั้ง (เดิมโหลดครั้งเดียว → ถูกคืนหน่วยความจำตอนเปิดหนังสือแล้วไม่โหลดกลับ = Lobby ไม่มีกรอบ)
    try{ this.ensureGroup(k=>miss.includes(k),()=>{ this._lbArt=false; if(this.state==='menu'){ if(this.menuScreen==='hub')this.hubRefresh(); else this.buildMenuScreen(); } },{all:true,quiet:true}); }catch(e){ this._lbArt=false; } }
  /* v7.9.64 หน้าเปิดเกม: ฉาก Hub เดิม (Strawberry ถือคทาแยกชิ้น ใบ 25) + โลโก้ + TAP TO START · แตะที่ไหนก็ได้ → Lobby (เปิดปกหนังสือ) */
  buildTitle(){ try{ this.lobbyPreload?.(); }catch(e){} this.stopHubMotion();this.menu.removeAll(true);this.tapZones=[];const w=this.W,h=this.H;
    const bgKey=this.textures.exists('hub_ui_background')?'hub_ui_background':'menu_hub_v3';
    const bg=this.textures.exists(bgKey)?this._coverImage(0,0,w,h,bgKey):this.add.rectangle(0,0,w,h,0x1a1420,1).setOrigin(0);this.menu.add(bg);
    const live=bgKey==='hub_ui_background'&&this.buildHubScene?.(bg);
    if(bg.type==='Image'&&!live)this.hubTween({targets:bg,scaleX:bg.scaleX*1.012,scaleY:bg.scaleY*1.012,duration:9000,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const shade=this.add.graphics();for(let i=0;i<24;i++){const y=h*.52+i*h*.48/24;shade.fillStyle(0x140a1e,.03+i*.03).fillRect(0,y,w,h*.48/24+1);}this.menu.add(shade);
    const logoW=Math.min(w*.86,460),logoH=logoW*310/1200,logoY=h*.62;this.startHubAmbience(h*.5);this.loadBook?.();this.loadBookPlus?.();if(!Save.data.tutorialDone)this.loadTutArt?.();
    if(this.textures.exists('hub_ui_logo')){ const logo=this.hubArt('logo',w/2,logoY,logoW,logoH);this.hubTween({targets:logo,y:logoY+3,duration:2600,yoyo:true,repeat:-1,ease:'Sine.inOut'});this.hubEvery?.(5000,1500,()=>this.hubFlash('vfx_hub_logo_shine',w/2,logoY,logoW,logoH)); }
    else this.menu.add(this.add.text(w/2,logoY,'MOCHI MAYHEM',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.round(Math.min(40,w*.1))+'px',color:'#fff0df',stroke:'#5a2440',strokeThickness:6}).setOrigin(.5));
    const ty=Math.min(h*.82,logoY+logoH/2+h*.12);
    this.hubText(w/2,h-Math.max(18,h*.03),'v'+GAME_VERSION,11,'#d9cce6',.5);
    /* v8.1.167 เจ้าของ: เลือก Sign in with Google หรือ Play as Guest ตั้งแต่หน้าเปิดเกม (เดิมอยู่แค่ใน Settings) · ล็อกอินแล้ว = TAP TO START + บอกบัญชี */
    const C=typeof Cloud!=='undefined'?Cloud:null,cloudOn=!!(C&&C.enabled&&C.enabled()),isG=!!(C&&C.isGoogle&&C.isGoogle());
    if(cloudOn&&!this._titleAuthChecked&&C.ensureClient){ this._titleAuthChecked=true; C.ensureClient().then(()=>{ if(this.state==='menu'&&this.menuScreen==='title'&&!this._titleGo&&!!C.isGoogle()!==isG)this.buildTitle(); }).catch(()=>{}); }
    const start=()=>{ if(this._titleGo)return; this._titleGo=true; Sfx.ui?.();
      if(Save.data.tutorialDone&&this.bookReady()&&this.hubMotionAllowed()&&this.bookOpening){ const tut=!Save.data.tutorialDone; this.bookOpening(()=>{ this._titleGo=false; if(this.state!=='menu')return; this.menuScreen='hub'; if(tut){ this.startChapterTutorial(); return; } this.buildMenuScreen(); },!tut); return; }   // v7.9.68 เปิดหนังสือช้า ๆ ก่อนเข้า Lobby / บทสอน
      if(!Save.data.tutorialDone){ this._titleGo=false; this.menuScreen='hub'; if(this.mcGateList?.(['s00','s01'],()=>this.startChapterTutorial()))return; this.startChapterTutorial(); return; }   // v7.9.66 ผู้เล่นใหม่: แตะ → เข้าบทสอนเลย
      this.menuScreen='hub'; this.buildMenuScreen(); this._titleGo=false;
      };
    if(!cloudOn||isG){
      const tap=this.add.text(w/2,ty,'TAP TO START',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.round(Math.min(24,w*.062))+'px',color:'#ffe08a',stroke:'#3a1830',strokeThickness:5}).setOrigin(.5);this.menu.add(tap);
      tap._noEnter=true;this.hubTween({targets:tap,alpha:{from:1,to:.35},scale:{from:1,to:.94},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
      if(isG)this.hubText(w/2,ty+Math.max(26,h*.04),'☁️ '+(C.accountLabel?.()||'Google account'),11,'#bfe8cf',.5);
      this._zone(0,0,w,h,start);
    } else {
      const bw=Math.min(w*.74,300),bh=46,gap=12,y1=Math.min(ty-6,h-bh*2-gap-70)-Math.round(h*.09),x0=w/2-bw/2;   // v8.2.1+ เจ้าของ: ยกปุ่มขึ้น ~9% ของความสูงจอ
      const btn=(y,label,fill,stroke,col,fn)=>{ const g=this.add.graphics();g.fillStyle(0x140a1e,.55).fillRoundedRect(x0+2,y+4,bw,bh,14);g.fillStyle(fill,1).fillRoundedRect(x0,y,bw,bh,14);g.lineStyle(2,stroke,1).strokeRoundedRect(x0,y,bw,bh,14);
        const t=this.add.text(w/2,y+bh/2,label,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'17px',color:col}).setOrigin(.5);this.menu.add([g,t]);this._zone(x0,y,bw,bh,fn); };
      btn(y1,'Sign in with Google',0xfff7ec,0xffe08a,'#3a1830',()=>{ if(this._titleGo)return; this.doGoogleAuth(false); });
      btn(y1+bh+gap,'▶  Play as Guest',0x3a2450,0xb58ad9,'#ffe08a',start);
      this.hubText(w/2,y1+bh*2+gap+22,'Guest progress stays on this device · sign in later in Settings',10,'#d9cce6',.5);
    }
    const z=this.tapZones[this.tapZones.length-1]; z.tag='title_start'; z.noBounce=true; }
  buildHub(){
    if(this._navOn&&this.W<this.H)return this.buildLobby();
    this.stopHubMotion();this.menu.removeAll(true);this.tapZones=[];const w=this.W,h=this.H,L=this.hubLayout(),p=w/941,portrait=L.portrait,side=L.side;
    const bgKey=this.textures.exists('hub_ui_background')?'hub_ui_background':'menu_hub_v3';
    const bg=this.textures.exists(bgKey)?this._coverImage(0,0,w,h,bgKey):this.add.rectangle(0,0,w,h,0x1a1420,1).setOrigin(0);this.menu.add(bg);
    const hubLive=bgKey==='hub_ui_background'&&this.buildHubScene?.(bg);   // v7.8.59 ใบ 25: ชั้นฉาก + โมโม่หุ่นเชิด
    const shade=this.add.graphics();for(let i=0;i<16;i++){const y=h*.40+i*h*.60/16;shade.fillStyle(0x111b2c,.04+i*.034).fillRect(0,y,w,h*.60/16+1);}this.menu.add(shade);
    // Subtle background motion stays behind every interactive UI element.
    if(bg.type==='Image'&&!hubLive)this.hubTween({targets:bg,scaleX:bg.scaleX*1.012,scaleY:bg.scaleY*1.012,duration:9000,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const pillW=portrait?Math.max(112,w*.28):150,pillH=portrait?Math.max(34,h*.044):34,versionW=pillW*.76,gearW=36,versionX=w-side-gearW-8-versionW,top=portrait?Math.max(12,h*.016):10;
    this.hubPanel(side,top,pillW,pillH);const candySize=pillH*.60,candyX=side+pillH*.67;
    this.hubArt('candy',candyX,top+pillH/2,candySize,candySize);
    const sugar=this.hubText(side+pillW-pillH*.48,top+pillH/2,String(Save.data.sugar||0),Math.max(14,pillH*.46),'#ffe5aa',1);let sf=parseFloat(sugar.style.fontSize);while(sugar.width>pillW-pillH*1.45&&sf>10)sugar.setFontSize(--sf+'px');
    this.hubPanel(versionX,top,versionW,pillH);this.hubText(versionX+versionW/2,top+pillH/2,'v'+GAME_VERSION,Math.max(11,pillH*.34),'#fff0df',.5);
    this._zone(versionX,top,versionW,pillH,()=>{this.menuScreen='news';this.buildMenuScreen();});if(this.hasNewsBadge())this.drawBadgeDot(this.menu,versionX+versionW-7,top+6);
    const gearX=w-side-gearW,gearY=top+(pillH-gearW)/2;this.hubPanel(gearX,gearY,gearW,gearW);   /* v7.8.67 เจ้าของ: ปุ่มฟันเฟืองเล็กลง 44→36 */
    const cog=this.add.graphics(),cx=gearX+gearW/2,cy=gearY+gearW/2;cog.fillStyle(0xe7e4ed,1);for(let i=0;i<8;i++){const a=i*Math.PI/4;cog.fillCircle(cx+Math.cos(a)*7,cy+Math.sin(a)*7,2.4);}cog.fillCircle(cx,cy,8).fillStyle(0x283041,1).fillCircle(cx,cy,3.2);this.menu.add(cog);
    this._zone(gearX-4,gearY-4,gearW+8,gearW+8,()=>{this.menuScreen='gMore';this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='gMore';
    const logoW=portrait?w*.82:w*.43,logoH=logoW*310/1200,logoX=portrait?w/2:w*.245,logoY=portrait?Math.min(h*.445,L.menuTop-Math.max(25,h*.03)-12-logoH):h*.40;
    this.startHubAmbience(logoY);if(this.textures.exists('hub_ui_logo')){const logo=this.hubArt('logo',logoX,logoY+logoH/2,logoW,logoH);this.hubTween({targets:logo,y:logo.y+1.5,duration:2600,yoyo:true,repeat:-1,ease:'Sine.inOut'});this.hubEvery?.(6000,1200,()=>this.hubFlash('vfx_hub_logo_shine',logoX,logoY+logoH/2,logoW,logoH));}else this.hubText(logoX,logoY+logoH/2,'MOCHI MAYHEM',Math.min(30,w*.06),'#fff0df',.5);
    const ch=CHARACTERS[this.character||'momo'],heroW=portrait?w*.66:w*.42,heroH=portrait?Math.max(25,h*.03):28,heroY=portrait?L.menuTop-heroH-8:h*.65;
    const ht=this.hubText(logoX,heroY+heroH/2,ch.name+' · '+CHARACTER_UNIQUES[ch.unique].name,Math.max(9,Math.min(14,w*.025)),'#fff0df',.5);let hf=parseFloat(ht.style.fontSize);while(ht.width>heroW*.88&&hf>8)ht.setFontSize(--hf+'px');
    const items=[['Play','Choose a stage','chapter','hub_btn_play'],['Heroes','Choose & awaken','char','hub_btn_heroes'],['Gear & Power','Equipment · Craft','gLoadout','hub_btn_gear'],['Activities','Daily · Achievements','gActivity','hub_btn_activity'],['Codex','Skills · Bestiary','gCodex','hub_btn_codex']];
    const tutDone=!!Save.data.tutorialDone,us=Save.data.unlockedStage||0,need=[0,0,1,0,1,0],nxt=this.hubNextStep();   // v7.8.90 Activities/Daily เปิดตั้งแต่แรก (เดิมหลังด่าน 2)
    const iconSz=Math.min(...L.boxes.slice(1,5).map(B=>Math.min(B.h*.66,B.w*.19)));   /* v7.8.67 เจ้าของ: ไอคอนทุกปุ่มขนาดเท่ากัน */
    items.forEach(([label,sub,target,icon],i)=>{const B=L.boxes[i],locked=us<need[i]&&!tutDone,primary=i===0,tone=this.hubTone(i),art=this.hubPanel(B.x,B.y,B.w,B.h,tone);if(locked)art.setAlpha(.60);
      if(primary){const glow=this.add.graphics();glow.lineStyle(2,tone.edge,.45).strokeRoundedRect(B.x+2,B.y+2,B.w-4,B.h-4,14);this.menu.add(glow);this.hubTween({targets:glow,alpha:.25,duration:2200,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
      const more=i===5,size=more?Math.min(B.h*.66,B.w*.16):iconSz,cy=B.y+B.h/2,arrowSize=Math.max(17,B.h*.30),arrowX=B.x+B.w-Math.max(20,B.h*.38);
      const tx=more?B.x+B.w/2+size*.36:B.x+size*1.35,ix=more?B.x+B.w/2-size*.85:B.x+size*.72,room=more?B.w*.5:arrowX-tx-arrowSize*.65;
      if(!locked&&primary&&this.bpAnim?.(icon+'_anim')&&this.hubMotionAllowed()){/* v7.8.67 เจ้าของ: ขยับแค่ปุ่ม Play */const s=this.add.sprite(ix,cy,icon+'_anim',0);this.hubIconFit(s,icon,ix,cy,size);s.play(icon+'_anim');this.menu.add(s);}   /* v7.8.59 ใบ 25 D: ไอคอนปุ่มขยับ */
      else if(!locked&&this.textures.exists(icon))this.menu.add(this.hubIconFit(this.add.image(ix,cy,icon),icon,ix,cy,size));
      if(primary&&!locked)this.hubEvery?.(4200,900,()=>this.hubFlash('vfx_hub_play_shimmer',B.x+B.w/2,B.y+B.h/2,B.w,B.h));else this.hubText(ix,cy,locked?'🔒':'✦',Math.max(18,size*.5),'#ffe3aa',.5);
      const fs=primary?Math.min(44,B.h*.43):more?Math.min(28,B.h*.35):Math.max(14,Math.min(23,w*.039));
      const title=this.hubText(tx,B.y+B.h*.40,label,fs,'#fff7ed',more?.5:0);let tf=fs;while(title.width>room&&tf>12)title.setFontSize(--tf+'px');
      const st=this.hubText(tx,B.y+B.h*.69,locked?'Clear Stage '+need[i]+' to unlock':sub,primary||more?Math.max(10,Math.min(15,B.h*.18)):Math.max(9,Math.min(12,w*.024)),tone.text,more?.5:0);let ss=parseFloat(st.style.fontSize);while(st.width>room&&ss>8)st.setFontSize(--ss+'px');
      this.hubText(arrowX,cy,'›',Math.max(26,arrowSize*1.4),tone.text,.5);
      this._zone(B.x,B.y,B.w,B.h,()=>{if(locked){this.menuToast('Locked — clear Stage '+need[i]+' first','#ff9bb5');return;}this.menuScreen=target;this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag=target;
      if(!locked&&((i===1&&this.hasTargetBadge('char'))||(i===2&&this.hasGroupBadge('gLoadout'))||(i===3&&this.hasGroupBadge('gActivity'))))this.drawBadgeDot(this.menu,B.x+9,B.y+8);
      if(nxt&&nxt.hub===i)this.hubGuideTag(B,nxt.tag);
    });

    // แจ้งเตือนเมื่อมีเมนูใหม่เพิ่งปลดLocked (ครั้งเดียว)
    const seen=Save.data.hubUnlockSeen||0;
    if(us>seen){ if(need.some(n=>n>seen&&n<=us))this.time.delayedCall(350,()=>{if(this.state==='menu'&&this.menuScreen==='hub'&&this.menuToast)this.menuToast('🔓 New menu unlocked! Go explore~','#8bd3a0');}); Save.data.hubUnlockSeen=us; Save.save(); }
    // ปุ่มรีเซ็ตเซฟย้ายไปหน้า "Settings" แล้ว (buildSettings) — กันกดพลาดตั้งแต่หน้าแรก
    this.menu.setVisible(true);
  }
  // 👉 ไกด์ "ทำอะไรต่อ" (หลังจบ tutorial) — hub idx + group target
  hubNextStep(){ if(!Save.data.tutorialDone)return null; const us=Save.data.unlockedStage||0;
    if(Save.gearInboxItems().length>0)return {hub:2,group:'gLoadout',target:'gearInbox',tag:'Claim gear'};
    if(this.hasClaimableTarget('daily')||this.hasClaimableTarget('achievements'))return {hub:3,group:'gActivity',target:null,tag:'Rewards ready'};
    if(Save.rankPointsFree()>0)return {hub:2,group:'gLoadout',target:'upgrade',tag:'Spend Rank Points'};
    if(this.hasClaimableTarget('dig'))return {hub:2,group:'gLoadout',target:'upgrade',tag:'Daily chest'};
    const adv=this.powerAdvice(Math.min(us,STAGES.length-1));
    if(adv.screen==='upgrade')return {hub:2,group:'gLoadout',target:'upgrade',tag:'Upgrade Weave'};
    return {hub:0,group:null,target:null,tag:'Next stage'}; }
  _drawNextGuide(x,y,w,h,tag){ const g=this.add.graphics(); g.lineStyle(3,0xffe066,1); g.strokeRoundedRect(x-3,y-3,w+6,h+6,16);
    const tg=this.add.text(x+w-8,y+5,'👉 '+tag,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#2a1600',backgroundColor:'#ffe066',padding:{x:6,y:2}}).setOrigin(1,0);
    this.menu.add([g,tg]); this.tweens.add({targets:g,alpha:{from:1,to:0.3},duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  _characterCardArt(id,cx,cy,maxW,maxH,alpha=1){
    const key=this.skinKey?.('card_'+id,id)||('card_'+id);if(!this.textures.exists(key))return null;
    const sp=this.add.image(cx,cy,key).setOrigin(0.5).setAlpha(alpha),scale=Math.min(maxW/sp.width,maxH/sp.height);
    sp.setScale(scale);this.menu.add(sp);return sp;
  }
  paintedNavButton(cont,cx,cy,w,h,label,active,fn,icon){
    const chrome=this.controlTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',muted:'#cfc1d4',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d,edge:0xf4d9a1};
    const texture=this.textures.get('painted_nav_button');
    if(!texture.has('button')){const q=texture.getSourceImage().width/2172;texture.add('button',0,93*q,135*q,1985*q,425*q);}   // v7.4.1 พิกัดตามขนาดจริง
    const halo=this.add.graphics();if(active){halo.fillStyle(chrome.edge,.10);halo.fillRoundedRect(cx-w/2-2,cy-h/2-2,w+4,h+4,12);halo.lineStyle(1.5,chrome.edge,.95);halo.strokeRoundedRect(cx-w/2,cy-h/2,w,h,10);}cont.add(halo);
    const art=this.add.image(cx,cy,'painted_nav_button','button').setDisplaySize(w,h).setAlpha(active?1:.72);
    const text=this.add.text(cx,cy,label,{fontFamily:chrome.font,fontStyle:'bold',fontSize:w<100?'10px':'12px',color:active?chrome.text:chrome.muted,stroke:chrome.shadow,strokeThickness:1.5}).setOrigin(.5);
    cont.add([art,text]);{const z=Math.min(h*.66,26),ic=icon&&this.m59Img?.(icon,cx,cy,z);if(ic){text.x+=z*.55;ic.x=text.x-text.width/2-z*.6;ic.setAlpha(active?1:.75);cont.add(ic);}}   // v8.1.28 ใบ 59 ไอคอนแท็บ (ไม่มีภาพ = ตัวหนังสือเดิม)
    if(fn)this._zone(cx-w/2,cy-h/2,w,h,()=>{Sfx.select&&Sfx.select();fn();});
  }
  drawHeroesTabs(){this.drawRosterTabs();}
  buildHeroes(){
    let tab=this._heroesTab||'roster';if(tab==='talents'&&!(typeof talentsOpen!=='function'||talentsOpen()))tab=this._heroesTab='roster';if(tab==='talents')this.buildTalents();else if(tab==='stats')this.buildStats();else this.buildChars();
  }
  /* v7.8.103 เจ้าของ: เซฟในเครื่องกับบนคลาวด์ไม่ตรงกัน → ให้เลือกก่อน (ระหว่างนี้ไม่ส่งเซฟขึ้นคลาวด์) */
  buildCloudConflict(){ const c=Save._cloudConflict; this.menu.removeAll(true); this.tapZones=[]; const w=this.W,h=this.H;
    const bg=this.add.rectangle(w/2,h/2,w,h,0x1d1428,1); this.menu.add(bg);
    const T=(x,y,t,o)=>{const tx=this.add.text(x,y,t,Object.assign({fontFamily:'NunitoUI, sans-serif',color:'#f1e5ef',align:'center'},o||{})).setOrigin(.5,0);this.menu.add(tx);return tx;};
    let y=Math.max(40,h*.07); T(w/2,y,'☁️ Save Mismatch',{fontStyle:'bold',fontSize:'22px',color:'#ffd9a0'}); y+=40;
    const it=T(w/2,y,'This device and your cloud save have different progress.\nPick the one to keep — the other one will be replaced.',{fontSize:'12px',color:'#c9bdd6',wordWrap:{width:w-40}}); y+=it.height+18;
    const card=(title,d,useCloud,col)=>{ const sm=Save.saveSummary(d),ch=150,g=this.add.graphics(); g.fillStyle(0x2c2140,1).fillRoundedRect(16,y,w-32,ch,12); g.lineStyle(1.5,col,1).strokeRoundedRect(16,y,w-32,ch,12); this.menu.add(g);
      T(w/2,y+10,title,{fontStyle:'bold',fontSize:'15px',color:'#'+col.toString(16).padStart(6,'0')});
      T(w/2,y+36,'⭐ Stages cleared '+sm.stages+'   ·   🎖 Rank '+sm.rank+'\n🍬 Sugar '+sm.sugar.toLocaleString()+'   ·   🧸 Heroes '+sm.heroes+'   ·   🎒 Items '+sm.gear+'\n🕒 Last saved '+sm.when,{fontSize:'12px',lineSpacing:4});
      this.heroButton(30,y+ch-46,w-60,36,useCloud?'☁️ Use Cloud Save':'📱 Keep This Device',()=>{ Save.resolveCloud(useCloud); this.menuScreen='hub'; this.buildMenuScreen(); this.menuToast?.(useCloud?'☁️ Cloud save loaded':'📱 This device’s save is now in the cloud','#8bd3a0'); },{active:true,fontSize:14});
      y+=ch+14; };
    card('📱 This Device',Save.data,false,0x8bd3ff); card('☁️ Cloud',c&&c.remote,true,0xffd166);
    T(w/2,y+2,'Not sure? Keep the one with more stages cleared.',{fontSize:'11px',color:'#a99fbb'});
    this.menu.setVisible(true); }
  heroButton(x,y,w,h,label,fn,{active=false,disabled=false,fontSize=13}={}){
    if(String(label).startsWith('🔗')&&this.tuHas?.('ic_merge')){const start=this.menu.list.length,bg=this.heroButton(x,y,w,h,label.slice(2).trim(),fn,{active,disabled,fontSize});this.menuArtFitButton(start,x,y,w,h);this.menuArtIcon?.('ic_merge',0,x+17,y+h/2,18)?.setAlpha(disabled?.45:1);return bg;}
    if(this._jrSkin){ const ic={'♻':2,'⚡':3,'⚠':11}[label]; return this.jrButton(x,y,w,h,label,fn,{kind:ic!=null&&w<=44?'icon':active?'primary':h<=30?'pill':'secondary',disabled,fontSize,icon:ic!=null&&w<=44?ic:null,on:label==='⚠'}); }   /* v7.9.10 ใบ 27 */
    const art=this.rosterChrome(active?'tab_on':'tab_off',x,y,w,h);if(disabled)art.setAlpha(.48);
    const text=this.add.text(x+w/2,y+h/2,label,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:fontSize+'px',color:disabled?'#b9a7be':'#fff0df',stroke:'#482139',strokeThickness:1,align:'center'}).setOrigin(.5);
    let fs=fontSize;while(text.width>w-16&&fs>9){fs--;text.setFontSize(fs+'px');}this.menu.add(text);
    if(fn)this._zone(x,y,w,h,()=>{Sfx.select&&Sfx.select();fn();});return art;
  }
  heroesContentTop(){const L=this.rosterTabLayout();return Math.max(this.W<=this.H?193*this.W/941:102,L.y+L.h+10);}
  rosterTabLayout(){const w=this.W,p=w/941,h=Math.max(36,Math.min(48,86*p)),gap=Math.max(8,18*p),tw=Math.min(w*.245,220),y=w<=this.H?Math.max(42,110*p):50;return{tw,h,gap,y,x0:(w-tw*3-gap*2)/2};}
  heroTone(){const id=(this._heroesTab||'roster')==='roster'?(this._heroPreview||Save.data.character):Save.data.character;return({momo:{fill:0xa52f53,edge:0xffb99b},mint:{fill:0x22616b,edge:0x8bece5},cocoa:{fill:0x754327,edge:0xf5bd7c},taro:{fill:0x63398c,edge:0xd3a1ff},yuzu:{fill:0x756123,edge:0xffe67d},sesame:{fill:0x444552,edge:0xe9e3f6}})[id]||{fill:0xa52f53,edge:0xffb99b};}
  menuRasterIcon(key,x,y,size){if(!this.textures.exists(key))return null;const im=this.add.image(x,y,key),scale=Math.min(size/im.width,size/im.height);im.setScale(scale);this.menu.add(im);return im;}
  menuRasterPanel(key,x,y,w,h,sourceCap){
    if(!this.textures.exists(key)||!this.textures.get||!this.add.container)return null;
    const src=this.textures.get(key).getSourceImage(),sw=src.width,sh=src.height,cap=sourceCap??sh*.28,d=Math.min(h*.28,w/2),xs=[0,cap,sw-cap,sw],ys=[0,cap,sh-cap,sh],xd=[0,d,w-d,w],yd=[0,d,h-d,h],group=this.add.container(x,y);
    // Cropped ordinary images preserve painted corners in Phaser Canvas and WebGL.
    for(let r=0;r<3;r++)for(let c=0;c<3;c++){const sx=xs[c],sy=ys[r],cw=xs[c+1]-sx,ch=ys[r+1]-sy,dw=xd[c+1]-xd[c],dh=yd[r+1]-yd[r];if(dw<=0||dh<=0)continue;const ax=dw/cw,ay=dh/ch;group.add(this.add.image(xd[c]-sx*ax,yd[r]-sy*ay,key).setOrigin(0).setCrop(sx,sy,cw,ch).setScale(ax,ay));}this.menu.add(group);return group;
  }
  rosterChrome(key,x,y,w,h){
    // Compact controls are drawn natively so ornaments cannot be stretched.
    if(['tab_on','tab_off','footer','badge'].includes(key)){const tone=this.heroTone(),g=this.add.graphics(),active=key==='tab_on'||key==='footer',r=Math.min(12,h/2);g.fillStyle(active?tone.fill:0x27283a,.96).fillRoundedRect(x,y,w,h,r);g.lineStyle(active?2:1.2,active?tone.edge:0x8b8fac,.85).strokeRoundedRect(x,y,w,h,r);this.menu.add(g);return g;}
    const k='hr_ui_'+key;if(this.textures.exists(k)){const im=this.add.image(x+w/2,y+h/2,k).setDisplaySize(w,h);this.menu.add(im);return im;}
    const g=this.add.graphics();g.fillStyle(key==='footer'||key==='tab_on'?0xc93970:0x291733,.95).fillRoundedRect(x,y,w,h,Math.min(14,h/2));g.lineStyle(2,0xe5bb6b,.9).strokeRoundedRect(x,y,w,h,Math.min(14,h/2));this.menu.add(g);return g;
  }
  rosterIcon(key,x,y,size){
    const k='hr_ic_'+key;if(!this.textures.exists(k))return null;const im=this.add.image(x,y,k).setDisplaySize(size,size);this.menu.add(im);return im;
  }
  drawRosterHeader(backScreen,title='Heroes'){
    // v7.8.70: จอเล็ก ชิ้นหัวหน้าเล็กเกินจนไอคอนลูกอมทับตัวเลข → สเกลขั้นต่ำ .44 (มากกว่านี้ทับแถบแท็บ Heroes/Talents/Stats)
    const w=this.W,p=w/941,q=Math.max(p,.44),landscape=w>this.H,cy=landscape?27:Math.max(59*p,4+30.5*q),bw=180*q,bh=61*q,left=Math.max(10,38*p);
    const chrome=this.headerTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',currency:'#f4d9a1',shadow:'#27182f'};
    this.rosterChrome('back',left,cy-bh/2,bw,bh);this.rosterIcon('back',left+44*q,cy,30*q);
    this.menu.add(this.add.text(left+110*q,cy,'Back',{fontFamily:chrome.font,fontStyle:'bold',fontSize:Math.max(12,31*q)+'px',color:chrome.text}).setOrigin(.5));
    this._zone(left,cy-bh/2,bw,bh,()=>{Sfx.back();const prev=backScreen||(this._navStack&&this._navStack.length?this._navStack.pop():null)||'hub';this._curMenu=prev;this.menuScreen=prev;this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].back=true;
    const rx=w-Math.max(10,38*p)-bw;this.rosterChrome('currency',rx,cy-bh/2,bw,bh);this.rosterIcon('candy',rx+39*q,cy,40*q);
    const st=this.add.text(rx+bw-21*q,cy,String(Save.data.sugar||0),{fontFamily:chrome.font,fontStyle:'bold',fontSize:Math.max(13,34*q)+'px',color:chrome.currency}).setOrigin(1,.5);const room=bw-21*q-62*q;if(st.width>room)st.setScale(room/st.width);this.menu.add(st);
    const tw=w-2*(left+bw)-12;if(title==='Heroes'&&tw>150){this.rosterIcon('blossom',w/2-139*p,cy,28*p);this.rosterIcon('blossom',w/2+139*p,cy,28*p);}
    const tt=this.add.text(w/2,cy,title,{fontFamily:chrome.font,fontStyle:'bold',fontSize:Math.max(22,54*p)+'px',color:chrome.text,stroke:chrome.shadow,strokeThickness:Math.min(1.5,Math.max(1,3*p))}).setOrigin(.5);if(tt.width>tw)tt.setScale(tw/tt.width);this.menu.add(tt);
  }
  drawRosterTabs(){
    const chrome=this.controlTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',muted:'#cfc1d4',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d,edge:0xf4d9a1};
    const w=this.W,p=w/941,{tw,h,y,x0,gap}=this.rosterTabLayout();
    [['roster','Heroes'],['talents','Talents'],['stats','Stats']].forEach(([id,label],i)=>{const x=x0+i*(tw+gap),lock=id==='talents'&&!(typeof talentsOpen!=='function'||talentsOpen());if(lock)label='🔒 '+label;this.rosterChrome(id===(this._heroesTab||'roster')?'tab_on':'tab_off',x,y,tw,h);
      {const t=this.add.text(x+tw/2,y+h/2,label,{fontFamily:chrome.font,fontStyle:'bold',fontSize:Math.max(13,31*p)+'px',color:chrome.text,stroke:chrome.shadow,strokeThickness:Math.min(1.5,Math.max(1,2*p))}).setOrigin(.5);this.menu.add(t);
       const z=Math.min(h*.66,28),ic=this.m59Img?.(({roster:'tab_heroes',talents:'tab_talents',stats:'tab_stats'})[id],x+tw/2,y+h/2,z);if(ic){t.x+=z*.55;ic.x=t.x-t.width/2-z*.6;if(lock)ic.setAlpha(.5);this.menu.add(ic);}}   // v8.1.28 ใบ 59
      this._zone(x,y,tw,h,()=>{if(lock){Sfx.error?.();this.menuToast?.('🔒 Talents open after Stage 3','#ffd166');return;}this._heroesTab=id;this.menuScreen='char';this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='tab_'+id;
      if(id==='talents'&&this.hasTargetBadge?.('talents'))this.drawBadgeDot(this.menu,x+tw-8,y+8);   // v7.9.55
    });
  }
