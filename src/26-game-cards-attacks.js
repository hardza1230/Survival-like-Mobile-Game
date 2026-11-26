  newCardIntro(opts){ if(this._inTutorial||typeof Save==='undefined'||!Save.data)return null; const seen=Save.data.cardSeen=Save.data.cardSeen||{};
    for(const o of opts||[]){ const t=cardTypeOf(o); if(t&&CARD_INTRO[t]&&!seen[t]){ seen[t]=1; try{Save.save();}catch(e){} return t; } } return null; }
  drawCardIntro(t,x,y,w,h){ if(t==='path'||t==='mutation'||t==='evolution'){this.pathTeach(t,{x,y,w,h});return;} const [em,name,txt]=CARD_INTRO[t],g=this.add.graphics();
    g.fillStyle(0x2a1a3a,.96).fillRoundedRect(x,y,w,h,14).lineStyle(2,0xffd54a,1).strokeRoundedRect(x,y,w,h,14);this.lvlUp.add(g);
    const a=this.add.text(x+14,y+8,'✨ NEW CARD TYPE: '+em+' '+name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffd54a'});this.lvlUp.add(a);
    const b=this.add.text(x+14,y+30,txt,{fontFamily:'sans-serif',fontSize:'12px',color:'#fff0df',wordWrap:{width:w-28}});this.lvlUp.add(b);
    this.tweens.add({targets:[g,a,b],alpha:{from:0,to:1},duration:300});
    this.levelCardReadyAt=Math.max(this.levelCardReadyAt||0,this.time.now+900);   // a moment to read before the first tap counts
  }
  /* v7.9.83 เจ้าของ: สอนเลือกบิลด์ Strawberry (ครั้งแรกที่เจอการ์ด Build Path) · Ruby อธิบาย 3 หน้า · แตะ = หน้าถัดไป · ระหว่างนี้แตะการ์ดไม่ได้ */
  pathTeach(kind,slot){if(!this.lvlUp||!this.add||this._pathTeach)return;
    const w=this.W,h=this.H,box=slot||{x:14,y:h-88,w:w-28,h:68},cards=this.lvlCards||[],c=this.add.container(0,0).setDepth(9999);this.lvlUp.add(c);
    const g=this.add.graphics();if(cards.length){const left=Math.min(...cards.map(q=>q.left)),right=Math.max(...cards.map(q=>q.right)),top=Math.min(...cards.map(q=>q.top)),bottom=Math.max(...cards.map(q=>q.bottom));
      g.fillStyle(0x000000,.65).fillRect(0,0,w,top).fillRect(0,bottom,w,h-bottom).fillRect(0,top,left,bottom-top).fillRect(right,top,w-right,bottom-top).lineStyle(3,0xffd590,1).strokeRoundedRect(left-3,top-3,right-left+6,bottom-top+6,14);}
    g.fillStyle(0x211725,1).fillRoundedRect(box.x,box.y,box.w,box.h,12).lineStyle(1,0xffd590,.8).strokeRoundedRect(box.x,box.y,box.w,box.h,12);c.add(g);
    const label=kind==='mutation'?'Mutation':kind==='evolution'?'Evolution':'Grandma’s Battle Recipe',message=kind==='mutation'?'Changes how your attack works. Read both choices; pick one for this floor.':kind==='evolution'?'Your attack’s final form! Read the card to discover its new power.':'Pick a fighting style for this floor. Later cards improve it. Try another next floor.';
    const title=this.add.text(box.x+12,box.y+7,'Ruby · '+label,{fontFamily:'NunitoUI, sans-serif',fontSize:'11px',fontStyle:'bold',color:'#ffd590'}),body=this.add.text(box.x+12,box.y+24,message,{fontFamily:'NunitoUI, sans-serif',fontSize:'12px',color:'#fff1df',wordWrap:{width:box.w-24}});c.add([title,body]);
    c._rubyCardGuideLayout={box,title,body};this.levelCardReadyAt=Infinity;this._pathTeachAt=this.time.now+600;
    const guide={next:()=>{if(this.time.now<this._pathTeachAt||this._pathTeach!==guide)return;c.destroy();this._pathTeach=null;this.levelCardReadyAt=this.time.now+300;}};this._pathTeach=guide;
    c.once('destroy',()=>{if(this._pathTeach===guide)this._pathTeach=null;});
  }
  /* ===== v8.1.122 ห้องสมบัติ Relic: ของ 3 ชิ้นลอยบนแท่นแก้ว + ลำแสง · แตะ = ซูม + อ่านผล · แตะซ้ำ = เก็บ · อาร์ตใบ 80 (vault80_bg / vault80_pedestal) ถ้ามี ไม่มี = วาดด้วยโค้ด ===== */
  lvlObjIcon(o,x,y,size){ const k=[o.iconKey,o.key].find(k=>k&&this.textures.exists(k)); if(k){ const im=this.add.image(x,y,k); im.setScale(size/Math.max(im.width||1,im.height||1)); return im; } return this.add.text(x,y,o.emoji||'✨',{fontSize:Math.round(size*.8)+'px'}).setOrigin(.5); }
  drawRelicVault(opts,top,hint){ const W=this.W,H=this.H,G=this.lvlUp; if(!G||!this.add)return false; const n=opts.length,bot=H-24,midY=top+Math.min(250,(bot-top)*.42),cw=Math.min(130,(W-24)/n);
    if(this.realTex?.('vault80_bg')){ const bg=this.add.image(W/2,H/2,'vault80_bg'); bg.setScale(Math.max(W/Math.max(1,bg.width),H/Math.max(1,bg.height))).setAlpha(.9); if(G.addAt)G.addAt(bg,Math.min(1,G.length||0)); else G.add(bg); }   /* v8.1.150 เจ้าของ: พื้นหลังห้องสมบัติไม่เต็มด้านบน → คลุมทั้งจอ อยู่ใต้หัวข้อ */
    hint?.setText('🔮 TREASURE VAULT · tap a treasure');
    const info=this.add.container(0,0); const iy=midY+110,ih=Math.max(110,Math.min(190,bot-iy)),ig=this.add.graphics(); ig.fillStyle(0x140c1e,.92); ig.fillRoundedRect(14,iy,W-28,ih,16); ig.lineStyle(2,0xc07bff,.8); ig.strokeRoundedRect(14,iy,W-28,ih,16);
    const it=this.add.text(W/2,iy+14,'Tap a treasure to look closer',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffe08a',align:'center',stroke:'#1a1224',strokeThickness:3,wordWrap:{width:W-60}}).setOrigin(.5,0),
      id=this.add.text(W/2,iy+48,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffffff',align:'center',wordWrap:{width:W-60},lineSpacing:6}).setOrigin(.5,0); info.add([ig,it,id]); G.add(info);
    const centre=()=>{ const gap=id.text?10:0,tot=it.height+gap+(id.text?id.height:0),y0=iy+Math.max(10,(ih-tot)/2); it.setY(y0); id.setY(y0+it.height+gap); };   /* v8.2.11 เจ้าของ: ข้อความไม่อยู่กลางกรอบ → จัดกึ่งกลางแนวตั้งทุกครั้งที่เปลี่ยนข้อความ */ centre();
    const items=[];
    opts.forEach((o,i)=>{ const cx=W/2+(i-(n-1)/2)*cw,col=o.color||0xc07bff,base=midY+50;
      const beam=this.add.graphics(); beam.fillStyle(0xfff4d6,.10); beam.fillTriangle(cx-14,top-6,cx+14,top-6,cx+cw*.42,base); beam.fillTriangle(cx-14,top-6,cx-cw*.42,base,cx+cw*.42,base);
      let ped; if(this.realTex?.('vault80_pedestal')){ ped=this.add.image(cx,base+34,'vault80_pedestal'); ped.setScale(Math.min(cw*.9,110)/Math.max(1,ped.width)); }
      else { ped=this.add.graphics(); ped.fillStyle(0x3a2a52,1); ped.fillRect(cx-cw*.3,base,cw*.6,46); ped.fillStyle(0x9fe8ff,.35); ped.fillEllipse(cx,base,cw*.72,18); ped.lineStyle(2,0xe7f8ff,.8); ped.strokeEllipse(cx,base,cw*.72,18); ped.fillStyle(0x251a36,1); ped.fillEllipse(cx,base+46,cw*.66,14); }
      const glow=this.add.circle(cx,midY,cw*.36,col,.22); const ic=this.lvlObjIcon(o,cx,midY,Math.min(70,cw*.62)); const lab=this.add.text(cx,base+56,o.title||'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#e8dcff',align:'center',wordWrap:{width:cw-6}}).setOrigin(.5,0);
      G.add([beam,ped,glow,ic,lab]); const s0=ic.scale||1;
      this.tweens.add({targets:ic,y:midY-7,duration:1100+i*90,yoyo:true,repeat:-1,ease:'Sine.inOut'}); this.tweens.add({targets:glow,alpha:{from:.14,to:.34},scale:{from:.92,to:1.1},duration:900,yoyo:true,repeat:-1});
      const card={left:cx-cw/2,right:cx+cw/2,top:midY-cw*.5,bottom:base+80,apply:o.apply,title:o.title,opt:o};
      card.onFocus=()=>{ for(const q of items){ const on=q.card===card; this.tweens.killTweensOf(q.ic); q.ic.setScale(q.s0*(on?1.35:1)); this.tweens.add({targets:q.ic,y:midY-7,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'}); for(const z of [q.ic,q.ped,q.lab])z.setAlpha?.(on?1:.4); q.glow.setVisible(on); }
        it.setText((o.emoji?o.emoji+' ':'')+(o.title||'')); id.setText([o.kind&&o.kind!=='Relic'?'['+o.kind+']':'',o.short||String(o.desc||'').split(/(?<=[.!])\s/)[0],o.note||''].filter(Boolean).join('\n')); centre();   /* v8.1.150 เจ้าของ: ข้อความ Relic ยาวไป → ประโยคสั้นเดียว + คอมโบ (ถ้ามี) */ hint?.setText('Tap again to take “'+(o.title||'')+'”'); };
      items.push({card,ic,ped,lab,glow,s0}); this.lvlCards.push(card); });
    return true; }
  /* ===== v8.1.122 เตาหลอม Evolution: อาวุธลอยเหนือทั่ง + ประกายไฟ · แตะ = ไฟลุก · แตะซ้ำ = หลอม ===== */
  drawEvoForge(o,top,hint){ const W=this.W,H=this.H,G=this.lvlUp; if(!G||!this.add)return false; const cy=top+Math.min(190,(H-top)*.32),b=this.basicAttack||{};
    hint?.setText('🔥 EVOLUTION FORGE · tap the forge');
    if(this.realTex?.('forge80_anvil')){ const a=this.add.image(W/2,cy+96,'forge80_anvil'); a.setScale(Math.min(220,W*.6)/Math.max(1,a.width)); G.add(a); }
    else { const a=this.add.graphics(); a.fillStyle(0x3b3346,1); a.fillRoundedRect(W/2-90,cy+70,180,30,8); a.fillRect(W/2-34,cy+100,68,34); a.fillRoundedRect(W/2-70,cy+130,140,16,6); a.fillStyle(0xff9a3d,.5); a.fillEllipse(W/2,cy+72,150,10); G.add(a); }
    const glow=this.add.circle(W/2,cy,92,0xffb347,.18),ik=['ic_path_'+b.path,o.iconKey].find(k=>k&&this.textures.exists(k)),ic=ik?this.add.image(W/2,cy,ik):this.add.text(W/2,cy,'⚔️',{fontSize:'64px'}).setOrigin(.5); if(ik)ic.setScale(110/Math.max(ic.width||1,ic.height||1)); const s0=ic.scale||1;
    const tt=this.add.text(W/2,cy+160,'✨ '+(o.title||'Evolution'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#ffd54a',align:'center',stroke:'#1a1224',strokeThickness:4,wordWrap:{width:W-40}}).setOrigin(.5,0),
      td=this.add.text(W/2,cy+194,o.desc||'',{fontFamily:'sans-serif',fontSize:'13px',color:'#ffffff',align:'center',wordWrap:{width:W-48},lineSpacing:3}).setOrigin(.5,0);
    G.add([glow,ic,tt,td]); this.tweens.add({targets:ic,y:cy-8,duration:1000,yoyo:true,repeat:-1,ease:'Sine.inOut'}); this.tweens.add({targets:glow,alpha:{from:.12,to:.3},duration:700,yoyo:true,repeat:-1});
    let hot=false; const card={left:16,right:W-16,top:cy-90,bottom:Math.min(H-10,cy+240),apply:o.apply,title:o.title,opt:o}; const spark=()=>{ if(!G.active||!this.lvlUp.visible||!(this.lvlCards||[]).includes(card))return; const n=hot?4:2; for(let i=0;i<n;i++){ const sp=this.add.text(W/2+(Math.random()-.5)*120,cy+70,'✦',{fontSize:(8+Math.random()*8)+'px',color:Math.random()<.5?'#ffd54a':'#ff8a3d'}).setOrigin(.5); G.add(sp); this.tweens.add({targets:sp,y:sp.y-60-Math.random()*70,x:sp.x+(Math.random()-.5)*40,alpha:0,duration:600+Math.random()*400,onComplete:()=>sp.destroy()}); } this.time.delayedCall(hot?120:260,spark); }; spark();
    card.onFocus=()=>{ hot=true; this.tweens.killTweensOf(ic); ic.setScale(s0*1.2); this.tweens.add({targets:ic,y:cy-8,duration:420,yoyo:true,repeat:-1,ease:'Sine.inOut'}); glow.setFillStyle(0xff8a3d,.32); hint?.setText('Tap again to forge “'+(o.title||'')+'”'); };
    this.lvlCards.push(card); return true; }
  /* ===== v8.1.137 ใบ 80 สมุดสูตรคุณยาย (Mutation 2 ตัวเลือก = หน้าซ้าย/ขวา) · แตะหน้า = หมึกเรืองแสง · แตะซ้ำ = เลือก ===== */
  drawRecipeBook(opts,top,hint){ const W=this.W,H=this.H,G=this.lvlUp; if(!G||!this.add||!this.realTex?.('book80_spread'))return false;
    const BW=Math.min(W-12,460),s=BW/1024,BH=640*s,bx=W/2-BW/2,by=top+Math.max(0,Math.min(40,(H-top-BH-150)/2)),book=this.add.image(W/2,by,'book80_spread').setOrigin(.5,0).setDisplaySize(BW,BH); G.add(book);
    hint?.setText('📖 GRANDMA’S BATTLE RECIPE · tap a page'); const pages=[];
    const info=this.add.text(W/2,by+BH+12,'Read both recipes · tap one page, then tap it again',{fontFamily:'sans-serif',fontSize:'13px',color:'#ffe08a',align:'center',stroke:'#1a1224',strokeThickness:3,wordWrap:{width:W-40}}).setOrigin(.5,0); G.add(info);
    opts.slice(0,2).forEach((o,i)=>{ const r=i?[560,70,380,480]:[70,70,380,480],x=bx+r[0]*s,y=by+r[1]*s,w=r[2]*s,h=r[3]*s,cx=x+w/2,fs=Math.max(10,Math.min(15,Math.round(w/11)));
      let glow=null; if(this.realTex?.('book80_page_glow')){ glow=this.add.sprite(cx,y+h/2,'book80_page_glow',0).setDisplaySize(w*1.08,h*1.08).setVisible(false); if(!this.anims.exists('book80_page_glow'))this.anims.create({key:'book80_page_glow',frames:this.anims.generateFrameNumbers('book80_page_glow',{start:0,end:5}),frameRate:10,repeat:-1}); G.add(glow); }
      const em=this.add.text(cx,y+h*.04,o.emoji||'⭐',{fontSize:Math.round(fs*2)+'px'}).setOrigin(.5,0),
        tt=this.add.text(cx,y+h*.04+fs*2.4,o.title||'',{fontFamily:'serif',fontStyle:'bold',fontSize:(fs+2)+'px',color:'#5a2a1c',align:'center',wordWrap:{width:w-6}}).setOrigin(.5,0),
        td=this.add.text(cx,tt.y+tt.height+6,[o.headline&&o.headline!==o.desc?o.headline:'',o.desc||''].filter(Boolean).join('\n'),{fontFamily:'serif',fontSize:fs+'px',color:'#3b2418',align:'center',wordWrap:{width:w-8},lineSpacing:2}).setOrigin(.5,0);
      if(td.y+td.height>y+h){ td.setFontSize(Math.max(9,fs-2)); } G.add([em,tt,td]);
      const card={left:x,right:x+w,top:y,bottom:y+h,apply:o.apply,title:o.title,opt:o};
      card.onFocus=()=>{ for(const q of pages){ const on=q.card===card; q.glow?.setVisible(on); if(on)q.glow?.play?.('book80_page_glow'); else q.glow?.stop?.(); for(const z of q.txt)z.setAlpha(on?1:.45); }
        info.setText('Tap the page again to learn “'+(o.title||'')+'”'); hint?.setText('📖 Tap again to choose “'+(o.title||'')+'”'); };
      pages.push({card,glow,txt:[em,tt,td]}); this.lvlCards.push(card); });
    this.tweens.add({targets:book,alpha:{from:0,to:1},duration:260}); return true; }
  /* ===== v8.1.137 ใบ 80 การ์ด Build Path แบบภาพวาด: 3 ใบคว่ำ → พลิกหงายทีละใบ · แตะ = ซูม + อ่าน · แตะซ้ำ = เลือก ===== */
  drawPathCards(opts,top,hint){ const W=this.W,H=this.H,G=this.lvlUp; if(!G||!this.add||!this.realTex?.('pathcard80_back'))return false;
    const n=opts.length,gap=10,cw=Math.min(132,(W-28-gap*(n-1))/n),ch=cw*1.5,cy=top+16+ch/2,items=[];
    const ig=this.add.graphics(),iy=cy+ch/2+34,ih=Math.max(100,Math.min(170,H-iy-14)); ig.fillStyle(0x140c1e,.92).fillRoundedRect(14,iy,W-28,ih,16).lineStyle(2,0xffd590,.8).strokeRoundedRect(14,iy,W-28,ih,16);
    const it=this.add.text(W/2,iy+12,'Tap a card to look closer',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffe08a',align:'center',stroke:'#1a1224',strokeThickness:3,wordWrap:{width:W-60}}).setOrigin(.5,0),
      id=this.add.text(W/2,iy+42,'',{fontFamily:'sans-serif',fontSize:'13px',color:'#ffffff',align:'center',wordWrap:{width:W-60},lineSpacing:3}).setOrigin(.5,0); G.add([ig,it,id]);
    hint?.setText('🛤 CHOOSE YOUR BUILD PATH · tap a card');
    opts.forEach((o,i)=>{ const cx=W/2+(i-(n-1)/2)*(cw+gap),im=this.add.image(cx,cy,'pathcard80_back').setDisplaySize(cw,ch),
        nm=this.add.text(cx,cy-ch/2+ch*(602+50)/768,o.title||'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.max(10,Math.round(cw/10))+'px',color:'#fff4dc',align:'center',stroke:'#2a1020',strokeThickness:3,wordWrap:{width:cw*400/512}}).setOrigin(.5).setAlpha(0);
      G.add([im,nm]); const sx=im.scaleX,sy=im.scaleY,flipAt=260+i*320;
      this.time.delayedCall(flipAt,()=>{ if(!im.active)return; Sfx.card?.(); this.tweens.add({targets:im,scaleX:0,duration:130,ease:'Sine.in',onComplete:()=>{ if(!im.active)return; im.setTexture(pathCardKey(o.key)).setDisplaySize(cw,ch); const fx=im.scaleX; im.scaleX=0; this.tweens.add({targets:im,scaleX:fx,duration:150,ease:'Back.out'}); this.tweens.add({targets:nm,alpha:1,duration:200}); } }); });
      const card={left:cx-cw/2,right:cx+cw/2,top:cy-ch/2,bottom:cy+ch/2,apply:o.apply,title:o.title,opt:o};
      card.onFocus=()=>{ for(const q of items){ const on=q.card===card; this.tweens.killTweensOf(q.im); this.tweens.add({targets:q.im,displayWidth:cw*(on?1.18:1),displayHeight:ch*(on?1.18:1),duration:180,ease:'Back.out'}); q.im.setAlpha(on?1:.5); q.nm.setAlpha(on?1:.5); q.im.setDepth?.(on?2:1); }
        it.setText((o.emoji?o.emoji+' ':'')+(o.title||'')); id.setText([o.pathStyle||'',o.desc||'',o.carry||''].filter(Boolean).join('\n')); hint?.setText('Tap again to choose “'+(o.title||'')+'”'); };
      items.push({card,im,nm}); this.lvlCards.push(card); });
    this.levelCardReadyAt=Math.max(this.levelCardReadyAt||0,this.time.now+260+n*320+300);   // อ่านหลังการ์ดหงายครบ
    return true; }
  pickCardAt(px,py){
    if(this._pathTeach){ this._pathTeach.next(); return; }
    const c=this.lvlCards.find(c=>px>=c.left&&px<=c.right&&py>=c.top&&py<=c.bottom);
    if(!c||this.time.now<(this.levelCardReadyAt||0)) return;
    if(this._pendingCardConfirm!==c){this._pendingCardConfirm=c;Sfx.ev?.('card_focus',.45,.05)||Sfx.select();this.highlightCard(c);if(this.levelChoiceHint&&!c.onFocus)this.levelChoiceHint.setText('Selected \u201c'+c.title+'\u201d · tap again to confirm');return;}
    this.lvlConfirmFx?.(c); this.mxPick?.(c); this.recipeNote?.(c); Stats.card(c.title,c.opt&&c.opt.kind); c.apply();if(c.opt?.evolution){this._voiceEvolvePending=true;this._voiceLevelPending=false;} if(!(c.opt&&c.opt.evolution)){this.playGrowthWorld?.('levelup',0.6);const kd=c.opt&&c.opt.kind,cue=kd==='Build Path'?'build_path_select':kd==='Flavor Infusion'?'infusion_apply':kd==='Relic'?'relic_acquire':kd==='Modifier'?'modifier_acquire':kd==='Trade-off'?'tradeoff_acquire':(c.opt&&c.opt.awaken)?'skill_awaken':(this._chestReward||this._relicPick)?'special_card_confirm':'card_confirm';Sfx.ev?.(cue,.55,.3);this._cardCueAt=Date.now();}   /* v6.95.2 level-up FX on every normal card pick, 60% speed */ this._pendingCardConfirm=null; this.closeLevelUp();   // v5.24: เหลือเสียงเดียว (Sfx.card ใน closeLevelUp)
  }
  // แตะครั้งแรก = โชว์กWaitบเรืองWaitบการ์ด ให้ผู้เล่นรู้ว่ากำลังเลือกใบนี้ (ก่อนแตะซ้ำยืนยัน)
  highlightCard(c){
    if(!this.lvlUp)return; if(c&&c.onFocus){ c.onFocus(); return; }
    const x=c.left,y=c.top,w=c.right-c.left,h=c.bottom-c.top,r=14;
    if(this.tuHas('lvl_card_select')){if(this._cardHi){this.tweens.killTweensOf(this._cardHi);this._cardHi.destroy();}const sel=this._cardHi=this.tuPanel('lvl_card_select',0,x-8,y-8,w+16,h+16);sel.setDepth(50);this.lvlUp.add(sel);this.tweens.add({targets:sel,alpha:{from:0.6,to:1},duration:260,yoyo:true,repeat:-1,ease:'Sine.inOut'});return;}   // v7.8.59 ใบ 23
    if(!this._cardHi||this._cardHi.type!=='Graphics'){this._cardHi=this.add.graphics().setDepth(50);this.lvlUp.add(this._cardHi);}
    const g=this._cardHi;g.clear();
    g.fillStyle(0xffe07a,0.12);g.fillRoundedRect(x,y,w,h,r);
    g.lineStyle(4,0xffe07a,0.95);g.strokeRoundedRect(x,y,w,h,r);
    g.lineStyle(2,0xffffff,0.7);g.strokeRoundedRect(x+3,y+3,w-6,h-6,r-3);
    g.setScale(1);this.tweens.killTweensOf(g);
    this.tweens.add({targets:g,alpha:{from:0.55,to:1},duration:260,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  }
  // Sweet-biome comet pickup still activates this temporary combat buff.
  sugarRush(got){ const p=this.player;
    if(!this._rushOn){ this._rushOn=true; p.cdMul*=0.6; p.dmgMul+=0.25; }
    this._rushEnd=(this.elapsed||0)+SUGAR_RUSH_SEC;
    const r=170; this.vfxHitRing&&this.vfxHitRing(p.x,p.y,0xff76c8,true); this.burst(p.x,p.y,0xffd166); this.screenFlash&&this.screenFlash(0xff9bd0,0.25,220);
    this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,p.x,p.y)<r){ this.damage(e,this.relicDmg(1.2),e.x,e.y); if(!e.isBoss&&!e.isMini){ const a=Math.atan2(e.y-p.y,e.x-p.x); e.setVelocity(Math.cos(a)*380,Math.sin(a)*380); e.knock=0.22; } } });
    this.showBanner('🍬 SUGAR RUSH!'+(got&&got.length?' Lv '+this.level:''),(got&&got.length?got.slice(-2).join(' · ')+' · ':'')+'attacks ×1.7 speed for '+SUGAR_RUSH_SEC+'s',1300); Sfx.clear&&Sfx.clear(); }
  closeLevelUp(){
    if(Date.now()-(this._cardCueAt||0)>250)Sfx.card();
    this._relicPick=false;
    this._coachCardPick=(this._coachCardPick||0)+1;   // นับการเลือกการ์ด (ใช้ในบทสอนเลเวลอัพ)
    this.lvlUp.setVisible(false); this.pendingLvl=Math.max(0,(this.pendingLvl||1)-1);
    if(this.pendingLvl>0){ this.openLevelUp(); return; }   // v6.23.1: Recipe เก็บแต้มไว้ที่ปุ่ม ⬆ ด้านข้าง — เดิมเรียก openLevelUp แล้วมันแค่ return (slotLevelUp) ทิ้ง state='levelup'+physics pause ไว้ = เกมค้างหลังเลือก Relic
    if(this._rushNextPending){ this._rushNextPending=false; this.time.delayedCall(60,()=>{ if(this.bossRush)this.bossRushNext(); }); }
    this.state='play'; this.physics.resume();const voiceEvent=this._voiceEvolvePending?'evolve':this._voiceLevelPending?'levelup':null;this._voiceEvolvePending=this._voiceLevelPending=false;if(voiceEvent)this.voiceBark?.(voiceEvent);
    const queued=this._queuedBossIntro;this._queuedBossIntro=null;
    if(queued)this.time.delayedCall(80,()=>{if(this.state!=='play')return;if(queued==='mini'&&this.mode==='miniWarning')this.spawnMiniBoss();else if(queued==='final')this.spawnFinalBoss();});
    this._chestReward=false;
  }
  // ♾️ การ์ดสแตตไม่รู้จบ — เติมช่องที่เหลือหลังอัพเกรดอาวุธตัน (แก้ปัญหา "เลเวลขึ้นแต่ไม่มีอะไรให้อัพ" ~lv15+)
  // stack เก็บใน b.endless[id] (รีเซ็ตทุกด่านผ่าน initBasicAttack) โชว์จำนวนชั้นในการ์ด
  // ===== 🔮 Relic system =====
  // 🏃 ช่วงเคลียร์: มอนธรรมดาวิ่งหนี + จางหาย (ไม่ดรอป/ไม่นับ kill) · elite/บอส/เป้าภารกิจอยู่ต่อ
  fleeRemainingEnemies(){
    let n=0;this.enemies.children.iterate(e=>{ if(!e||!e.active||e.isBoss||e.isMini||e.isElite||e._waveObjectiveTarget||e._fleeing)return; n++; e._fleeing=true;
      this.tweens.add({targets:e,alpha:0,duration:1600+Math.random()*500,ease:'Quad.in',onComplete:()=>{ if(!e.active||!e._fleeing)return; e._fleeing=false;
        if(e._aura){e._aura.destroy();e._aura=null;} if(e._dashTel){e._dashTel.destroy();e._dashTel=null;} e.setActive(false).setVisible(false).setAlpha(1); if(e.body)e.body.enable=false; }}); });
    if(n>0)this.showBanner('🏃 The swarm retreats!',this.enemies.countActive(true)>n?'Defeat the remaining Elites to advance':'The way ahead is clear',1300);
  }
  // All selected Taro paths opt in; pre-path retains its legacy resolver.
  clearTaroCombat(){const t=this._taro;if(t){t.run=-1;t.pathEpoch=-1;t.jobs.length=0;for(const fx of t.fx){this.tweens?.killTweensOf(fx);if(fx.active)fx.destroy();}t.fx.clear();t.charge=0;t.sample=null;t.sweep=null;t.mark=null;t.nodes=[];t.projectiles=[];}
    this._taroEpoch=(this._taroEpoch||0)+1;this._taro=null;this._taroDamageContext=null;
  }
  syncTaroCombat(){if(this.character!=='taro'||!this.player){if(this._taro)this.clearTaroCombat();return null;}const path=this.basicAttack?.path||null;
    if(!this._taro||this._taro.path!==path||this._taro.player!==this.player){this.clearTaroCombat();this._taroPathEpoch=(this._taroPathEpoch||0)+1;this._taro=taroNewState(this._taroEpoch,this._taroPathEpoch,path,this.player);if(path==='tempest'||path==='storm'||path==='smite'){this._taro.enabled=true;this._taroCharge=0;}}
    if(this.events&&!this._taroShutdownHook){this._taroShutdownHook=true;this.events.once('shutdown',()=>{this.events.off('postupdate',this.taroPostPhysics,this);this.clearTaroCombat();this._taroShutdownHook=false;});}
    return this._taro;
  }
  tagTaroEnemy(e){if(e&&this._v83Run)e._c1SpawnId=(e._c1SpawnId||0)+1;if(e&&this.character==='sesame')e._sesSpawnId=this._sesSpawnSeq=(this._sesSpawnSeq||0)+1;if(e&&this.character==='yuzu')e._yzSpawnId=this._yzSpawnSeq=(this._yzSpawnSeq||0)+1;if(e&&this.character==='taro'){e._taroSpawnId=this._taroSpawnSeq=(this._taroSpawnSeq||0)+1;}return e;}
  taroProfile(level,options={}){return this.character==='taro'&&this.basicAttack?taroCombatProfile(this.basicAttack,this.player,level,BASIC_PATHS.taro,options):null;}
  taroPickTarget(range){const t=this.syncTaroCombat();if(!t)return null;t.mark=taroPriorityTarget(this.enemies.getChildren(),this.player,range,t.mark);return t.mark;}
  suspendTaroCombat(){const t=this._taro;if(t){t.sample=null;t.motion=null;if(t.sweep)t.sweep.from={x:this.player.x,y:this.player.y};for(const fx of t.fx){if(fx.visible){fx._taroSuspended=true;fx.setVisible(false);}}}}
  tickTaroCombat(wallDt){this._taroWallDt=wallDt;this._taroFrameVelocity={x:this.player?.body?.velocity.x||0,y:this.player?.body?.velocity.y||0};const t=this._taro||(this.character==='taro'&&this.state==='play'?this.syncTaroCombat():null);if(!t)return;if(this.character!=='taro'||t.player!==this.player||t.path!==(this.basicAttack?.path||null)){this.clearTaroCombat();return;}if(!t.enabled)return;
    if(this.state!=='play'||!this.player?.active||!(this.player.hp>0)||!Number.isFinite(wallDt)||wallDt<=0||wallDt>.25){this.suspendTaroCombat();return;}   // v7.8.16 .1→.25: มือถือช่วงหนัก <10fps เคยหยุด Unique/ระเบิด/สะเก็ดทั้งหมด (dt ยัง clamp .05)
    const dt=Math.min(.05,wallDt)*(this.gameSpeed||1);t.time+=dt;for(const fx of t.fx){if(fx._taroLife>0){fx._taroLife-=dt;if(fx._taroLife<=0)this.taroRemoveFx(fx);else fx.setAlpha((fx._taroBaseAlpha??1)*fx._taroLife/fx._taroDuration);}}
    this.taroUpdateVisuals?.();
    taroAdvanceQueue(t,dt,job=>{if(this._taro!==t||!t.enabled||!this.player.active||!(this.player.hp>0))return false;if(this.state!=='play')return 'hold';return !job.token||taroTargetValid(job.token,this.player,job.range);});
    this.tickTaroDeployables?.(dt);
  }
  taroSchedule(kind,delay,callback,options={}){const t=this._taro;if(this.character!=='taro'||this.state!=='play'||!this.player?.active||!(this.player.hp>0)||!t||t.player!==this.player||t.path!==(this.basicAttack?.path||null))return null;return taroQueueEvent(t,kind,delay,callback,options);}
  taroWithDamage(kind,callback,meta={}){const t=this._taro;if(!t?.enabled||this.character!=='taro'||this.state!=='play'||!this.player?.active||!(this.player.hp>0)||t.player!==this.player||t.path!==(this.basicAttack?.path||null))return;
    if(!Object.hasOwn(TARO_SOURCE_POLICY,kind))throw new TypeError('Unknown Taro damage source');
    const previous=this._taroDamageContext;this._taroDamageContext={...meta,source:kind,terminal:!!(previous?.terminal||TARO_SOURCE_POLICY[kind]),run:t.run,pathEpoch:t.pathEpoch,attackId:meta.attackId??++t.attackSeq};
    try{return callback(this._taroDamageContext);}finally{this._taroDamageContext=this._taro===t?previous:null;}
  }
  taroIsSecondary(){return taroSecondary(this);}
  taroCarryContext(callback){if(!this.taroIsSecondary())return callback;const t=this._taro,context=this._taroDamageContext;
    return ()=>{if(this._taro===t&&t.run===context.run&&t.pathEpoch===context.pathEpoch)this.taroWithDamage(context.source,callback,context);};
  }
  /* v8.1.162 เจ้าของ (Taro B): มอนที่โดนสายฟ้ากระตุก (ส่ายมุมเร็ว ๆ 0.12 วิ) + วาบฟ้าขาวที่ตัว · ตัวละไม่เกิน 1 ครั้ง/0.15 วิ · ไม่แตะตำแหน่ง/ฟิสิกส์ */
  taroZapReact(e){ if(!e||!e.active||!this.tweens||(typeof CODE_VFX!=='undefined'&&CODE_VFX.taroReact===false))return false; const now=this.time?.now||0; if(now-(e._zapAt||-1e9)<150)return false; e._zapAt=now; const a0=e._zapA0??e.angle??0; e._zapA0=a0; const q={t:0};
    this.tweens.add({targets:q,t:1,duration:120,onUpdate:()=>{ if(e.active)e.angle=a0+Math.sin(q.t*Math.PI*6)*9*(1-q.t); },onComplete:()=>{ if(e.active)e.angle=a0; e._zapA0=undefined; }});
    if(this.add?.circle){ const f=this.camWorld(this.add.circle(e.x,e.y,Math.max(16,(e.displayWidth||40)*.42),0xdff6ff,.55).setDepth((e.depth||e.y)+1)); this.tweens.add({targets:f,alpha:0,scale:1.25,duration:110,onComplete:()=>f.destroy()}); } return true; }
  taroDealDamage(token,amount,kind,meta={}){const _sb=this.basicAttack,_sk=_sb?.path==='storm'&&kind==='chain'?(_sb.lv?.p_arc_shock||0)*.04:_sb?.path==='smite'&&(kind==='spark'||kind==='sparkChild')?(_sb.lv?.p_spark_shock||0)*.03:0;if(_sk>0&&token?.enemy){token.enemy._arcShockT=(this.elapsed||0)+2;token.enemy._arcShockM=_sk;}   /* v7.9.23 Static Shock/Sparks */if(!this.player||!Number.isFinite(amount)||amount<=0||!taroTargetValid(token,this.player,meta.range??Infinity))return false;
    // v7.8.56: only Spark Build miniboss damage is reduced; apply once at the shared damage boundary.
    if(this.basicAttack?.path==='smite'&&token.enemy.isMini&&!token.enemy.isBoss)amount*=.85;
    let dealt=false;this.taroWithDamage(kind,()=>{const e=token.enemy;this.damage(e,amount,e.x,e.y);dealt=true;},{...meta,targetId:token.id,directPending:true});return dealt;
  }

  taroSwarmProfile(level=this.skills?.thunder||1){return taroSwarmProfile(this.basicAttack,this.player,this.taroTempestProfile(level));}
  castTaroSpark(level){const t=this.syncTaroCombat();if(!t?.enabled||t.path!=='smite'||this.state!=='play')return;
    const f=this.taroSwarmProfile(level),targets=this.taroCandidates(this.player,f.range);if(!targets.length)return;const a=Math.random()*Math.PI*2,attackId=++t.attackSeq;   /* v7.8.23 เจ้าของ: ยิงออกรอบตัว แล้วเด้งขอบจอไปมา */
    for(let i=0;i<f.count;i++)this.taroSpawnProjectile({kind:'spark',gen:0,age:0,x:this.player.x,y:this.player.y,angle:a+i*Math.PI*2/f.count,speed:f.speed,life:f.life,damage:f.damage,pierce:f.pierce,split:f.split,range:f.range,attackId});
    this.taroArt?.('bpx_taro_spark_burst',this.player.x,this.player.y,130,{life:.3,depth:90390});this.poseAttack?.(280);this.taroSound('spark');
  }
  castTaroSentry(level){const t=this.syncTaroCombat();if(!t?.enabled||t.path!=='tempest'||this.state!=='play')return;const f=this.taroSwarmProfile(level);if(!this.taroCandidates(this.player,f.range).length)return;
    /* v7.8.19 วางใหม่เฉพาะตอนป้อมไม่ครบ 2 หรือ Taro เดินห่างป้อมไกลสุดเกิน 350px → ป้อมอยู่ครบอายุ · ป้อมเดิมรับค่าการ์ดใหม่ทุกรอบ */
    const p=this.player,regular=(t.nodes||[]).filter(n=>!n.beacon);for(const n of regular)Object.assign(n,{interval:f.pulse,range:f.range,damage:f.damage,orbRadius:f.radius,orbLife:f.orbLife,overload:f.overload,link:f.link});
    if(regular.length>=(f.sentries||TARO_SENTRY_MAX)){const far=regular.reduce((m,n)=>Math.hypot(n.x-p.x,n.y-p.y)>Math.hypot(m.x-p.x,m.y-p.y)?n:m);if(Math.hypot(far.x-p.x,far.y-p.y)<=TARO_SENTRY_LEASH)return;this.taroRemoveNode(far,true);}
    const a=[-.7,.7,Math.PI/2+.6][(++t.attackSeq)%3],x=p.x+Math.cos(a)*40,y=p.y+Math.sin(a)*40;this.taroPlaceNode({x,y,life:f.nodeLife,interval:f.pulse,range:f.range,damage:f.damage,orbRadius:f.radius,orbLife:f.orbLife,overload:f.overload,link:f.link,speed:TARO_BL_SPEED,beacon:false});this.poseAttack?.(300);if((f.sentries||1)>(t._sentryCap||1)&&t._sentryCap)(typeof Sfx!=='undefined'&&Sfx.orderCue?.('taro_extra_sentry',.45,.5));t._sentryCap=f.sentries||1;(typeof Sfx!=='undefined'&&Sfx.orderCue?.('taro_deploy',.4,.3))||this.taroSound('deploy');
  }
  /* v7.8.41 ตัวเลขจาก Combat Meter: Unique ทั้ง 3 ทำแค่ 0–3% ของดาเมจ → โตตามเลเวลรอบ (+12%/เลเวล) ให้ตามพลังตีปกติทัน */
  taroUniqueGrowth(){return 1+TARO_UQ_GROW*Math.max(0,(this.level||1)-1);}
  castStormBeacon(dm,ul=1){if(this.character!=='taro'||this.state!=='play'||!this.player?.active||!(this.player.hp>0))return;dm*=this.uqMul?.()||1;this._uqDm=dm;{const ug=this.taroUniqueGrowth?.()||1;dm*=this.basicAttack?.path==='smite'?Math.min(2,ug):ug;}   /* v7.8.78 เจ้าของ: Spark Unique ตีบอส 2 แสน — ตัวคูณเลเวลวิ่ง (Lv30 ×4.5) ซ้อนกับพายุ 18 ลูกที่วิ่งเข้าเป้า → สาย Spark ตัวคูณเลเวลไม่เกิน ×2 */if(!this.basicAttack?.path||this.basicAttack.path==='storm')return this.castTaroPlasma(dm,ul);if(this.basicAttack.path==='tempest')return this.castTaroOvercharge(dm,ul);return this.castTaroStormMark(dm,ul);}
  /* v7.8.33 Storm Beacon (เดิมเป็น Unique สาย Spark) — เก็บไว้เป็นเมธอดแยก ยังไม่ได้ผูกกับปุ่ม */
  /* v7.8.33 เจ้าของ: Unique สาย Spark = ปล่อย Spark รัว ๆ หมุนรอบตัว แล้วทุกลูกบังคับระเบิดหลัง ~1.1 วิ (หรือตอนทะลุครบ) */
  /* v7.8.35 เจ้าของเลือก B1 Storm Mark: ฟ้าผ่าใส่ตัว HP มากสุด (บอสก่อน) แล้วมาร์ก 6 วิ · Spark ทั้งจอพุ่งเข้าหา +50% · หมดเวลา = ฟ้าผ่าระเบิดอีกครั้ง · ใช้อาร์ตฟ้าผ่า beacon_strike เดิม */
  castTaroStormMark(dm,ul=1){const t=this.syncTaroCombat();if(!t)return;t.enabled=true;const n=Math.max(1,Math.min(4,ul||1)),p=this.player;let best=null,bs=-1;const vw=this.cameras?.main?.worldView,onScreen=e=>!vw||!(vw.width>0)||(e.x>=vw.x&&e.x<=vw.x+vw.width&&e.y>=vw.y&&e.y<=vw.y+vw.height);   /* v7.8.69 เจ้าของ: เลือกเป้าเฉพาะในจอ (เดิมเป้านอกจอ = Spark ไปกองที่ขอบจอ) */
    for(const k of this.taroCandidates(p,TARO_MARK_RANGE)){const e=k.enemy;if(!onScreen(e))continue;const sc=(e.isBoss?1e9:e.isMini?1e8:0)+(e.hp||0);if(sc>bs){bs=sc;best=k;}}
    if(!best)return this.castTaroSparkStorm(dm,ul);if(t.mark)this.taroEndMark(false);const e=best.enemy,attackId=++t.attackSeq;
    t.mark={token:best,until:t.time+TARO_MARK_FAST+(p.echoPath?.75:0),strike:(16+8*n)*dm,blast:(28+14*n)*dm,attackId,run:t.run,pathEpoch:t.pathEpoch,fx:this.taroArt?.('bpx_taro_shock_aura',e.x,e.y,(e.displayWidth||80)*1.1,{tint:0xffe066,depth:90395})||null};
    this.taroMarkStrike(best,t.mark.strike,attackId);this.castTaroSparkStorm(dm,ul,true,Math.atan2(e.y-p.y,e.x-p.x));this.showBanner?.('Storm Mark Lv'+n,'A Spark volley slams the mark · +50% damage',1000);   /* v8.2.83 เจ้าของ (A): Spark พุ่งเป็นพัดใส่เป้าพร้อมกัน ชนแล้วระเบิดทันที · มาร์ก 2→1 วิ */this.taroSound('beacon');}   /* v7.8.69 เจ้าของ: กดแล้วต้องมีลูก Spark ออกมาด้วย → ปล่อย Spark Storm ที่วิ่งหาเป้า */
  taroMarkStrike(token,dmg,attackId){const e=token.enemy;this.taroDealDamage(token,dmg*taroLightningRoll(),'unique',{attackId});if(!this.taroArt?.('bpx_taro_beacon_strike',e.x,e.y+16,170,{h:340,life:.5}))this.taroLightningVisual?.(e.x,e.y,e.x,e.y,true,true);this.screenShake?.(110,.005);}
  taroMarkToken(){const t=this._taro,m=t?.mark;if(!m)return null;return m.run===t.run&&m.pathEpoch===t.pathEpoch&&t.time<m.until&&m.token?.enemy?.active&&m.token.enemy.hp>0&&m.token.id===m.token.enemy._taroSpawnId?m.token:null;}
  taroEndMark(blast=true){const t=this._taro,m=t?.mark;if(!m)return;t.mark=null;if(m.fx)this.taroRemoveFx(m.fx);const e=m.token?.enemy;if(!blast||!e?.active||!(e.hp>0)||m.run!==t.run||m.pathEpoch!==t.pathEpoch||this.state!=='play')return;
    for(const k of this.taroCandidates(e,TARO_MARK_BLAST_R))this.taroDealDamage(k,(k===m.token||k.id===m.token.id?m.blast:m.blast*.4)*taroLightningRoll(),'unique',{attackId:m.attackId});if(!this.taroArt?.('bpx_taro_beacon_strike',e.x,e.y+16,200,{h:400,life:.5}))this.taroLightningVisual?.(e.x,e.y,e.x,e.y,true,true);this.screenShake?.(140,.006);this.taroRing?.(e.x,e.y,TARO_MARK_BLAST_R,.35);if(this.basicAttack?.uqMut==='mark_nova'){const R2=TARO_MARK_BLAST_R*2.2;for(const k of this.taroCandidates(e,R2))this.taroDealDamage(k,m.blast*.6*taroLightningRoll(),'unique',{attackId:m.attackId});this.taroRing?.(e.x,e.y,R2,.45);this.screenShake?.(200,.01);}}   /* v7.9.22 Mark Nova */
  taroTickMark(){const t=this._taro,m=t?.mark;if(!m)return;const tk=this.taroMarkToken();if(!tk){const timeUp=t.time>=m.until&&m.run===t.run&&m.pathEpoch===t.pathEpoch;if(!timeUp&&!m.jumped&&this.basicAttack?.uqMut==='mark_jump'&&m.run===t.run&&m.pathEpoch===t.pathEpoch){const from=m.token?.enemy||this.player;let best=null,bs=-1;for(const k of this.taroCandidates(from,TARO_MARK_RANGE)){if(k===m.token||!(k.enemy?.hp>0))continue;const sc=(k.enemy.isBoss?1e9:k.enemy.isMini?1e8:0)+(k.enemy.hp||0);if(sc>bs){bs=sc;best=k;}}if(best){m.token=best;m.jumped=true;this.taroMarkStrike(best,m.strike,m.attackId);this.floatText?.(best.enemy.x,best.enemy.y-60,'🎯 Mark jumps!',0xffe066);return;}}   /* v7.9.22 Leaping Mark */this.taroEndMark(timeUp);return;}if(m.fx?.active)m.fx.setPosition(tk.enemy.x,tk.enemy.y);}
  castTaroSparkStorm(dm,ul=1,quiet=false,aim=null){const t=this.syncTaroCombat();if(!t)return;t.enabled=true;const n=Math.max(1,Math.min(4,ul||1)),f=this.taroSwarmProfile();
    const sc=quiet?18:TARO_STORM_COUNT;   /* v7.8.76 เจ้าของ: Unique ยังแรงเพราะจำนวนลูก → พายุจาก Storm Mark เหลือ 1 รอบ 18 ลูก */   /* v7.8.63 เจ้าของ: ครบ 2 รอบนาฬิกาเสมอ (18 ลูก/รอบ) · ระดับ Unique เพิ่มความแรงแทนจำนวน */const qm=quiet?.5:1;   /* v7.8.74 เจ้าของ: Spark Unique แรงเกิน → พายุ Spark ที่มากับ Storm Mark แรง 50% */t.storm={left:sc,step:(quiet?2:4)*Math.PI/sc,next:0,angle:Math.random()*Math.PI*2,hit:(3+1.5*n)*dm*qm,blast:(5+2.5*n)*dm*qm,speed:Math.max(480,f.speed||460),pierce:Math.max(2,f.pierce||2),attackId:++t.attackSeq,run:t.run,pathEpoch:t.pathEpoch,burst:quiet&&aim!=null,aim};
    this.taroArt?.('bpx_taro_spark_burst',this.player.x,this.player.y,170,{life:.35,depth:90390});if(quiet)return;this.screenShake?.(90,.004);this.showBanner?.('Spark Storm Lv'+n,'Rapid Sparks · forced detonation',1000);this.taroSound('beacon');}
  taroTickSparkStorm(dt){const t=this._taro,st=t?.storm;if(!st)return;if(st.run!==t.run||st.pathEpoch!==t.pathEpoch||st.left<=0){t.storm=null;return;}st.next-=dt;
    if(st.burst){const p=this.player,N=st.left;for(let i=0;i<N;i++)this.taroSpawnProjectile({kind:'spark',gen:TARO_SPARK_GENS,age:0,x:p.x,y:p.y,angle:st.aim+(N>1?(i/(N-1)-.5)*TARO_BURST_SPREAD:0),speed:st.speed*TARO_BURST_SPEED,life:TARO_STORM_FUSE,damage:st.hit,pierce:st.pierce,split:0,range:600,attackId:st.attackId,blast:st.blast,storm:true,burst:true});st.left=0;t.storm=null;return;}   /* v8.2.83 ยิงพร้อมกันเป็นพัด */
    while(st.next<=0&&st.left>0){st.next+=TARO_STORM_GAP;st.left--;st.angle+=st.step||2.4;const p=this.player;this.taroSpawnProjectile({kind:'spark',gen:TARO_SPARK_GENS,age:0,x:p.x,y:p.y,angle:st.angle,speed:st.speed,life:TARO_STORM_FUSE,damage:st.hit,pierce:st.pierce,split:0,range:600,attackId:st.attackId,blast:st.blast,storm:true});}
    if(st.left<=0)t.storm=null;}
  taroSparkBlast(p){const t=this._taro;if(!t?.enabled||this.state!=='play'||p._stale||p._blasted||p.run!==t.run||p.pathEpoch!==t.pathEpoch)return;p._blasted=true;
    for(const token of this.taroCandidates(p,TARO_STORM_R))this.taroDealDamage(token,p.blast*taroLightningRoll(),'unique',{attackId:p.attackId});this.hitCratesInRadius?.(p.x,p.y,TARO_STORM_R,p.blast);
    if(!this.taroArt?.('bpx_taro_orb_burst',p.x,p.y,TARO_STORM_R*2/.84,{life:.3,tint:0xffe7a8}))this.taroRing?.(p.x,p.y,TARO_STORM_R,.25);}
  taroPlaceNode(options){const t=this._taro;if(!t?.enabled||this.state!=='play')return null;t.nodes=t.nodes||[];const same=t.nodes.filter(n=>n.beacon===options.beacon),cap=options.beacon?1:TARO_SENTRY_MAX;if(same.length>=cap)this.taroRemoveNode(same[0],true);
    const lim=WORLD/2-32,node={...options,x:Math.max(-lim,Math.min(lim,options.x)),y:Math.max(-lim,Math.min(lim,options.y)),left:options.life,next:0,run:t.run,pathEpoch:t.pathEpoch};
    const blocked=(this.solidProps?.getChildren?.()||[]).some(o=>o.active&&o.body&&node.x>=o.body.left&&node.x<=o.body.right&&node.y>=o.body.top&&node.y<=o.body.bottom);if(blocked){node.x=this.player.x;node.y=this.player.y;}
    node.fx=this.taroNodeVisual(node);t.nodes.push(node);return node;
  }
  taroRemoveNode(node,fade=false){const t=this._taro;if(!t)return;if(fade&&t.enabled&&this.state==='play')this.taroArt?.(node.beacon?'bpx_taro_orb_burst':'bpx_taro_sentry_expire',node.x,node.y-(node.beacon?24:14),node.beacon?100:58,{life:.45});this.taroRemoveFx(node.fx);t.nodes=(t.nodes||[]).filter(n=>n!==node);}
  // v7.8.20 Taro art sprite: anim from ASSET_FX, display size in px, tracked by Taro's own FX set (life 0 = persistent, owner removes)
  /* v7.8.30 sprite FX ที่ไม่ต้องพึ่งสถานะ Taro (ใช้ก่อนเลือก Build ได้) · เพดาน 28 ชิ้น · จางเองแล้วลบ */
  taroFx(key,x,y,w,o={}){if((typeof CODE_VFX!=='undefined'&&CODE_VFX.taroBurst)&&/^bpx_taro_(?:orb_burst|spark_burst|arc_overload_hit)$/.test(key))return this.codeBurst?.(x,y,w*.42,o.tint??(this._taro?.path==='smite'?0xffda89:this._taro?.path==='tempest'?0xa9e8ee:0xc6a2ed),{depth:o.depth??90400,dur:(o.life||.3)*1100});const oldKey=key;key=this.battleOutlineKey?.(key)||key;if(!this.bpAnim?.(key)||(this._taroFxLive||0)>=28||!this.add)return null;const fd=ASSET_FX[key],s=this.camWorld(this.add.sprite(x,y,key,0)).setDepth(o.depth??90400);s.setOrigin(fd.anchor==='left'?0:.5,fd.anchor==='bottom'?1:.5).setDisplaySize(w,o.h??w*fd.fh/fd.fw);if(o.rot!=null)s.setRotation(o.rot);if(o.tint)s.setTint(o.tint);s.play(key);this.battleOutlineTrack?.(s,oldKey,key);this._taroFxLive=(this._taroFxLive||0)+1;const life=o.life||.25;this.tweens.add({targets:s,alpha:0,delay:life*600,duration:life*400,onComplete:()=>{this._taroFxLive=Math.max(0,(this._taroFxLive||1)-1);s.destroy();}});return s;}
  /* v7.8.69 เจ้าของ: เหลือศัตรูตัวเดียว → Arc วนโค้งออกไปก่อนแล้วค่อยกลับมาชิ่งใส่ตัวเดิม (ดาเมจตอนกลับถึง) */
  taroArcLoopHop(token,fn){const e=token?.enemy;if(!e?.active)return;const a=(e._arcLoopA=(e._arcLoopA??Math.random()*Math.PI*2)+2.3),r=90+Math.min(40,(e.displayWidth||40)*.3),px=e.x+Math.cos(a)*r,py=e.y+Math.sin(a)*r;
    if(!this.time?.delayedCall){fn();return;}const mx=(e.x+px)/2+Math.cos(a+1.57)*r*.45,my=(e.y+py)/2+Math.sin(a+1.57)*r*.45;this.taroArcBolt?.(e.x,e.y,mx,my);this.time.delayedCall(TARO_ARC_HOP_MS*.2,()=>{if(this.state==='play')this.taroArcBolt?.(mx,my,px,py);});
    this.time.delayedCall(TARO_ARC_HOP_MS*.45,()=>{if(this.state!=='play'||!e.active)return;this.taroArcBolt?.(px,py,e.x,e.y,true);fn();});}
  taroZapAt(x,y){ let best=null,bd=26*26; (this.enemies?.getChildren?.()||[]).forEach(e=>{ if(!e||!e.active)return; const dx=e.x-x,dy=e.y-y,d=dx*dx+dy*dy; if(d<bd){bd=d;best=e;} }); return best?this.taroZapReact?.(best):false; }   /* v8.1.162 ปลายสายฟ้า → มอนที่โดน (resolver ดาเมจถูกล็อกด้วยเทส T5 จึงผูกที่ภาพแทน) */
  taroChainStop(){ const now=this.time?.now||0; if(now-(this._taroStopAt||-1e9)<700||this.state!=='play')return false; this._taroStopAt=now; this.hitStop?.(30); return true; }   /* v8.1.162 เจ้าของ (Taro A): ค้าง 0.03 วิ ตอนสายฟ้าโดนตัวแรกของโซ่ · ไม่เกินครั้งละ 0.45 วิ */
  taroArcBolt(x1,y1,x2,y2,loop=false){const d=Math.hypot(x2-x1,y2-y1);this.taroChainStop?.();if(d>=4&&typeof CODE_VFX!=='undefined'&&CODE_VFX.bolt){ this.taroLightningVisual?.(x1,y1,x2,y2,false,loop); this.taroFx(loop?'bpx_taro_arc_overload_hit':'bpx_taro_arc_hit',x2,y2,loop?90:44,{life:.25}); return; }if(d<4||!this.taroFx(loop?'bpx_taro_arc_loop':'bpx_taro_arc_bolt',x1,y1,d,{h:loop?40:26,rot:Math.atan2(y2-y1,x2-x1),life:.22}))return this.chainBolt?.(x1,y1,x2,y2);this.taroFx(loop?'bpx_taro_arc_overload_hit':'bpx_taro_arc_hit',x2,y2,loop?90:44,{life:.25});}
  taroArt(key,x,y,w,o={}){if((typeof CODE_VFX!=='undefined'&&CODE_VFX.taroBurst)&&/^bpx_taro_(?:orb_burst|spark_burst|arc_overload_hit)$/.test(key))return this.codeBurst?.(x,y,w*.42,o.tint??(this._taro?.path==='smite'?0xffda89:this._taro?.path==='tempest'?0xa9e8ee:0xc6a2ed),{depth:o.depth??90400,dur:(o.life||.3)*1100});const oldKey=key;key=this.battleOutlineKey?.(key)||key;const t=this._taro;if(!t?.enabled||!this.bpAnim?.(key))return null;if(o.life>0&&!this.taroVisualBudget(true))return null;const fd=ASSET_FX[key],s=this.camWorld(this.add.sprite(x,y,key,0)).setDepth(o.depth??90400);
    s.setOrigin(fd.anchor==='left'?0:.5,fd.anchor==='bottom'?1:.5).setDisplaySize(w,o.h??w*fd.fh/fd.fw);if(o.tint)s.setTint(o.tint);if(o.rot!=null)s.setRotation(o.rot);if(o.alpha!=null)s.setAlpha(o.alpha);s.play(key);this.battleOutlineTrack?.(s,oldKey,key);if(o.then&&this.bpAnim(o.then))s.chain(o.then);return o.track===false?s:this.taroTrackVisual(s,o.life||0);}
  taroNodeVisual(node){const t=this._taro;if(!t?.enabled)return null;const c=this.camWorld(this.add.container(node.x,node.y).setDepth(89990)),ring=this.add.circle(0,0,28,0x241c38,.12).setStrokeStyle(2,node.beacon?0xffda89:0xc6a2ed,.9),anim=this.bpAnim?.(node.beacon?'bpx_taro_beacon_idle':'bpx_taro_sentry_deploy'),art=anim?this.add.sprite(0,node.beacon?-24:-14,node.beacon?'bpx_taro_beacon_idle':'bpx_taro_sentry_deploy',0).setDisplaySize(node.beacon?80:58,node.beacon?80:58):this.textures.exists('fx_taro_sentry')?this.add.image(0,-14,'fx_taro_sentry').setDisplaySize(58,58):this.add.circle(0,-14,16,0xa98cf0,.9),bar=this.add.rectangle(-22,29,44,3,node.beacon?0xffda89:0xbba0ed).setOrigin(0,.5);c.add([ring,art,bar]);c._bar=bar;if(anim){c._art=art;art.play(node.beacon?'bpx_taro_beacon_idle':'bpx_taro_sentry_deploy');if(!node.beacon&&this.bpAnim('bpx_taro_sentry_idle'))art.chain('bpx_taro_sentry_idle');}c._taroDuration=node.life;this.taroTrackVisual(c,0);return c;}
  taroProjectileVisual(p){if(!this._taro?.enabled||this.state!=='play'||!this.add)return null;/* v7.8.76 เจ้าของ: Spark มีดาเมจแต่มองไม่เห็น — เดิมภาพลูกกระสุนใช้โควตาเดียวกับเอฟเฟกต์ตอนโดน (20 ชิ้น) · ตอนนี้ลูกกระสุนมีภาพเสมอ (จำนวนลูกถูกคุมด้วยเพดานอยู่แล้ว) */{const sp=p.kind==='spark'||p.kind==='sparkChild';if(sp&&this.bpAnim?.('bpx_taro_spark')){const s=this.taroArt('bpx_taro_spark',p.x,p.y,46*(TARO_SPARK_SCALE[p.gen||0]||.65),{rot:p.angle});if(s)return s;}
      if(!sp&&this.bpAnim?.('bpx_taro_ball_core')){const gold=p.kind==='beacon',s=this.taroArt(gold?'bpx_taro_ball_gold':'bpx_taro_ball_core',p.x,p.y,gold?30:26);if(s){const fl=this.bpAnim('bpx_taro_ball_field')?this.taroArt('bpx_taro_ball_field',p.x,p.y,Math.min(80,Math.max(34,p.radius||40)),{alpha:.3,depth:90380,tint:gold?0xffe7a8:null}):null;if(fl)s._taroAttached=[fl];return s;}}}const g=this.camWorld(this.add.graphics().setDepth(90400));if(p.kind==='spark'||p.kind==='sparkChild'){g.setScale(TARO_SPARK_SCALE[p.gen||0]||.65);g.lineStyle(4,0x34234d,.9);g.strokePoints([{x:-14,y:3},{x:-5,y:-3},{x:0,y:0},{x:6,y:-2}]);g.lineStyle(2,0xc6e9ff,1);g.strokePoints([{x:-14,y:3},{x:-5,y:-3},{x:0,y:0},{x:6,y:-2}]);g.fillStyle(0xf4edff,1);g.fillCircle(0,0,2);}else{const R=Math.min(40,Math.max(15,p.radius||15)),col=p.kind==='beacon'?0xffda89:0xa9e8ee;g.fillStyle(col,.05);g.fillCircle(0,0,R);g.lineStyle(1,col,.22);g.strokeCircle(0,0,R);g.fillStyle(col,.35);g.fillCircle(0,0,17);g.lineStyle(4,0x34234d,.85);g.strokeCircle(0,0,11);g.lineStyle(2.5,col,1);g.strokeCircle(0,0,11);g.fillStyle(0xffffff,.95);g.fillCircle(0,0,6);}if(p.kind!=='spark'&&p.kind!=='sparkChild')g.setScale(.7);/* Compact fallback art; gameplay zap radius stays unchanged. */this.taroTrackVisual(g,0);g.setPosition(p.x,p.y).setRotation(p.angle);return g;}
  taroSpawnProjectile(options){const t=this._taro;if(!t?.enabled||this.state!=='play')return null;t.projectiles=t.projectiles||[];const spark=options.kind==='spark'||options.kind==='sparkChild',cap=spark?(options.storm?72:80):TARO_ORB_CAP,pool=t.projectiles.filter(p=>p.left>0&&(p.kind==='spark'||p.kind==='sparkChild')===spark&&(!spark||!!p.storm===!!options.storm));
    /* v7.8.72 เจ้าของ: บางจังหวะ Spark ปกติไม่ออก — เดิมเพดาน 36 นับรวมลูกแตกตัว (1 ลูก→4) และลูกจาก Unique ด้วย · ตอนนี้แยกนับ ลูก Unique ไม่กินโควตา · เต็มแล้วการยิงใหม่ (gen 0) ไล่ลูกเก่าที่ใกล้หมดอายุออกแทน */
    if(pool.length>=cap){if(spark&&!options.storm&&!(options.gen>0)){pool.sort((a,b)=>a.left-b.left);const n=Math.min(pool.length,pool.length-cap+1);for(let i=0;i<n;i++){pool[i].left=0;this.taroRemoveFx(pool[i].fx);pool[i].fx=null;}}else return null;}
    const p={...options,origin:{x:options.x,y:options.y},left:options.life,hits:new Map(options.kind==='sparkChild'?(options.hits||[]):[]),seed:++t.attackSeq,run:t.run,pathEpoch:t.pathEpoch};p.fx=this.taroProjectileVisual(p);t.projectiles.push(p);return p;
  }
  /* v7.8.54 ครบ 40 ครั้ง (เดิม 10 · หลัง v7.8.51 Spark โดนถี่ขึ้นมาก มินิ C2-3 ตายใน 5 วิ) · v7.8.34 เจ้าของเลือก A2 Static Charge: Spark โดนบอส/มินิครบ 10 ครั้ง = ฟ้าผ่าลงบอส ×8 ดาเมจ Spark ลูกนั้น (นับแยกต่อบอส รีเซ็ตทุกรอบเล่น) */
  taroStaticCharge(token,p){const t=this._taro;if(!t?.enabled||this.state!=='play'||!token?.enemy?.active)return;t.charge=t.charge||new Map();const n=(t.charge.get(token.id)||0)+1;if(n<TARO_STATIC_HITS){t.charge.set(token.id,n);return;}t.charge.set(token.id,0);
    const e=token.enemy;this.taroDealDamage(token,p.damage*TARO_STATIC_MUL*taroLightningRoll(),p.kind,{attackId:p.attackId});if(!this.taroArt?.('bpx_taro_beacon_strike',e.x,e.y+16,150,{h:300,life:.45}))this.taroLightningVisual?.(e.x,e.y,e.x,e.y,true,true);this.screenShake?.(80,.004);this.taroSound?.('beacon');}
  /* v7.8.52 B Discharge: ลูกบอล Sentry/Beacon ช็อตบอส/มินิตัวเดิมครบ 25 ครั้ง = ฟ้าผ่า ×10 ดาเมจช็อต (คูณ Shock) · นับแยกต่อบอส */
  taroDischarge(token,p){const t=this._taro;if(!t?.enabled||this.state!=='play'||!token?.enemy?.active)return;t.discharge=t.discharge||new Map();const n=(t.discharge.get(token.id)||0)+1;if(n<TARO_DISCHARGE_HITS){t.discharge.set(token.id,n);return;}t.discharge.set(token.id,0);
    const e=token.enemy;this.taroDealDamage(token,p.damage*TARO_DISCHARGE_MUL*taroLightningRoll()*this.taroShockMul(e),p.kind,{attackId:p.attackId});if(!this.taroArt?.('bpx_taro_beacon_strike',e.x,e.y+16,150,{h:300,life:.45}))this.taroLightningVisual?.(e.x,e.y,e.x,e.y,true,true);this.screenShake?.(60,.003);this.taroSound?.('beacon');}
  taroProjectileHit(p,token,quiet=false){const t=this._taro;if(!t?.enabled||this.state!=='play'||p.run!==t.run||p.pathEpoch!==t.pathEpoch||!taroTargetValid(token,p,Infinity))return false;const spark=p.kind==='spark'||p.kind==='sparkChild';const marked=spark&&p.storm&&this.taroMarkToken?.()?.id===token.id,big=!!(token.enemy.isBoss||token.enemy.isMini||marked);if(p.hits.has(token.id)&&(spark?!(big&&!p.storm&&t.time-p.hits.get(token.id)>=TARO_SPARK_BOSS_GAP):t.time-p.hits.get(token.id)<(big?TARO_ORB_BIG_GAP:TARO_ORB_HIT_GAP)))return false;p.hits.set(token.id,t.time);
    const admitted=this.taroDealDamage(token,p.damage*(p.kind==='sparkChild'?.7+Math.random()*.6:taroLightningRoll())*(spark?(marked?TARO_MARK_BONUS:1):this.taroShockMul(token.enemy)),p.kind,{attackId:p.attackId});if(!admitted)return false;if(!spark){this.taroShockAdd(token.enemy);if(big)this.taroDischarge?.(token,p);}
    if(spark){this.taroArt?.('bpx_taro_spark_hit',token.enemy.x,token.enemy.y,44,{life:.17,rot:p.angle});if(big)this.taroStaticCharge?.(token,p);if(p.burst&&big&&p.left>0){p.left=0;this.taroOrbFade?.(p);}}   /* v8.2.83 ลูกพัดชนตัวใหญ่ = ระเบิดทันที */   /* v7.8.58 เจ้าของ: Spark ไม่หายเมื่อโดน — อยู่จนหมดเวลา (ระเบิด blast ตอนหมดอายุผ่าน taroOrbFade) */
    else if(!quiet&&!(typeof CODE_VFX==='undefined'||!CODE_VFX.bolt)){ this.taroLightningVisual(p.x,p.y,token.enemy.x,token.enemy.y); } else if(!quiet&&!this.taroArt?.('bpx_taro_orb_zap',token.enemy.x,token.enemy.y,48,{life:.2}))this.taroLightningVisual(p.x,p.y,token.enemy.x,token.enemy.y);
    return true;
  }
  tickTaroDeployables(dt){const t=this._taro;if(!t?.enabled||this.state!=='play'||!this.player?.active||!(this.player.hp>0))return;t.nodes=t.nodes||[];t.projectiles=t.projectiles||[];
    this.taroTickPlasma?.(dt);this.taroTickSparkStorm?.(dt);this.taroTickMark?.();this.taroTickShockMarks?.();if(this._taro!==t||this.state!=='play')return;
    const over=t.time<(t.overUntil||0)||t.nodes.some(n=>n.beacon&&n.run===t.run&&n.pathEpoch===t.pathEpoch);
    const cc=this.basicAttack?.path==='tempest'?Math.min(3,this.basicAttack.lv?.p_sentry_pulse||0):0;   // v7.9.17 Close Charge
    for(const n of [...t.nodes]){if(this._taro!==t||this.state!=='play')return;if(n.run!==t.run||n.pathEpoch!==t.pathEpoch){this.taroRemoveNode(n);continue;}n.left-=dt;n.next-=dt*(over&&!n.beacon?TARO_OVERCHARGE:1)*(!n.beacon&&cc>0&&this.dist(n.x,n.y,this.player.x,this.player.y)<260?1+.12*cc:1);if(!n.beacon&&n.fx?.active){if(over&&!n.fx._aura?.active&&this.bpAnim?.('bpx_taro_overcharge')){const au=this.add.sprite(0,-14,'bpx_taro_overcharge',0).setDisplaySize(84,84);au.play('bpx_taro_overcharge');n.fx.addAt?.(au,1);n.fx._aura=au;}n.fx._aura?.setVisible?.(over);}if(n.left<=0){this.taroRemoveNode(n,true);continue;}if(n.fx?._bar)n.fx._bar.width=44*Math.max(0,n.left/n.life);if(n.next<=0){n.next=n.interval;const target=this.taroNearestUnused(this.taroCandidates(n,n.range),n,n.range,new Set());if(target&&n.fx?._art?.active&&!n.beacon&&this.anims?.exists?.('bpx_taro_sentry_fire')){n.fx._art.play('bpx_taro_sentry_fire');if(this.anims.exists('bpx_taro_sentry_idle'))n.fx._art.chain('bpx_taro_sentry_idle');}if(target)this.taroArt?.('bpx_taro_orb_launch',n.x,n.y-(n.beacon?40:24),56,{life:.2});if(over&&!n.beacon&&t.time<(t.overUntil||0)){const k=t.overRing||6,id=++t.attackSeq;n._spin=(n._spin||0)+.45;for(let i=0;i<k;i++)this.taroSpawnProjectile({kind:'sentry',x:n.x,y:n.y,angle:n._spin+i*Math.PI*2/k,speed:n.speed,life:n.orbLife,damage:n.damage*(t.overDmg||1),radius:n.orbRadius,range:n.range,attackId:id});}   /* v7.8.63 Overdrive: ยิงรอบทิศ */
        else if(target)this.taroSpawnProjectile({kind:n.beacon?'beacon':'sentry',x:n.x,y:n.y,angle:Math.atan2(target.enemy.y-n.y,target.enemy.x-n.x),speed:n.speed,life:n.orbLife,damage:n.damage,radius:n.orbRadius,range:n.range,attackId:++t.attackSeq});}}
    this.taroTeslaLink?.(dt);
    const vw=this.cameras?.main?.worldView,view=vw&&vw.width>0?{left:vw.x+10,right:vw.x+vw.width-10,top:vw.y+10,bottom:vw.y+vw.height-10}:null;
    const tokens=this.taroCandidates(this.player,Infinity),bigs=tokens.filter(k=>k.enemy.isBoss||k.enemy.isMini);const boxes=(this.solidProps?.getChildren?.()||[]).filter(o=>o.active&&o.body).map(o=>({left:o.body.left,right:o.body.right,top:o.body.top,bottom:o.body.bottom}));
    for(const p of [...t.projectiles]){if(this._taro!==t||this.state!=='play')return;if(p.run!==t.run||p.pathEpoch!==t.pathEpoch){p.left=0;p._stale=true;}if(p.left<=0)continue;p.left-=dt;if(p.left<=0){this.taroOrbFade?.(p);continue;}const from={x:p.x,y:p.y},spark=p.kind==='spark'||p.kind==='sparkChild';if(spark)p.angle+=Math.sin(p.seed+t.time*8)*dt*2;/* v7.8.69 เจ้าของ: Ball Lightning วิ่งตรง ไม่เลี้ยวหาบอสแล้ว (เดิม v7.8.41 เลี้ยวหาบอส/มินิในระยะ 360) */
      const mk0=spark&&p.storm?this.taroMarkToken?.():null,mk=mk0&&(!view||(mk0.enemy.x>=view.left-40&&mk0.enemy.x<=view.right+40&&mk0.enemy.y>=view.top-40&&mk0.enemy.y<=view.bottom+40))?mk0:null;if(mk){let df=Math.atan2(mk.enemy.y-p.y,mk.enemy.x-p.x)-p.angle;df=Math.atan2(Math.sin(df),Math.cos(df));p.angle+=Math.max(-TARO_MARK_TURN*dt,Math.min(TARO_MARK_TURN*dt,df));}   /* v7.8.69 เจ้าของ: Spark วิ่งหาตัวถึกเฉพาะช่วง Storm Mark (2 วิ) — เลิกเลี้ยวหาบอสตลอดเวลา */
      if(spark&&!mk&&!p._homed){let tg=null,bd=TARO_SPARK_HOME_R;for(const k of tokens){if(p.hits.has(k.id))continue;const d=Math.hypot(k.enemy.x-p.x,k.enemy.y-p.y);if(d<bd){bd=d;tg=k;}}if(tg){let df=Math.atan2(tg.enemy.y-p.y,tg.enemy.x-p.x)-p.angle;df=Math.atan2(Math.sin(df),Math.cos(df));p.angle+=Math.max(-TARO_SPARK_HOME_TURN*dt,Math.min(TARO_SPARK_HOME_TURN*dt,df));}}p._homed=false;const aim=p.angle;
      const lg=!spark&&(p.kind==='sentry'||p.kind==='beacon')&&bigs.some(k=>Math.hypot(k.enemy.x-p.x,k.enemy.y-p.y)<(p.radius||95)*.7)?TARO_ORB_LINGER:1;   /* v8.1.163 เจ้าของ C: ลูกบอล Sentry ลอยช้าลง ×0.3 ตอนทับบอส/มินิ (ไม่วิ่งหา) */
      const moved=taroProjectileStep(p,dt*lg,spark?WORLD/2-12:Infinity,spark?boxes:[]);p.x=moved.x;p.y=moved.y;p.angle=moved.angle;if(spark&&view)taroBounceView(p,view);if(spark&&p.angle!==aim)this.taroArt?.('bpx_taro_spark_bounce',p.x,p.y,40,{life:.17,rot:p.angle});else if(!spark&&Math.hypot(p.x-p.origin.x,p.y-p.origin.y)>Math.min(1000,p.range+80)){p.left=0;this.taroOrbFade?.(p);continue;}
      if(!(p.crateAt>t.time)){p.crateAt=t.time+.3;this.hitCratesInRadius?.(p.x,p.y,spark?16:p.radius,p.damage);}   // v7.8.19 ลูกบอล/ประกายแตกกล่องได้
      if(spark&&(p.gen||0)<TARO_SPARK_GENS&&(p.age=(p.age||0)+dt)>=TARO_SPARK_SPLIT_AT&&p.left>.05){let made=0;for(const side of [-1,1])if(this.taroSpawnProjectile({...p,kind:'sparkChild',gen:(p.gen||0)+1,age:0,fx:null,angle:p.angle+side*.45,life:p.left,damage:p.damage*p.split,pierce:Math.max(1,p.pierce),attackId:p.attackId}))made++;if(made){this.taroArt?.('bpx_taro_spark_split',p.x,p.y,48,{life:.15,rot:p.angle});p.left=0;continue;}}
      if(!p.fx||!p.fx.active)p.fx=this.taroProjectileVisual(p);p.fx?.setPosition(p.x,p.y).setRotation(spark?p.angle:0);if(p.fx?._taroAttached)for(const o of p.fx._taroAttached)o.setPosition?.(p.x,p.y);const sk=spark?(TARO_SPARK_SCALE[p.gen||0]||.65):1;if(!spark){this.taroOrbZap?.(p,tokens);continue;}const radius=90*sk,candidates=tokens.filter(token=>taroTargetValid(token,p,radius+(spark?p.speed*dt:0)));for(const token of candidates){if(this._taro!==t||this.state!=='play'||p.left<=0)break;const e=token.enemy,er=e.body?.halfWidth||Math.max(12,(e.displayWidth||40)*.35);if(spark&&taroSegmentDistance(e,from,p)>er+TARO_SPARK_HIT_R*Math.max(.8,sk))continue;this.taroProjectileHit(p,token);}
    }
    if(this._taro!==t)return;for(const p of t.projectiles)if(p.left<=0)this.taroRemoveFx(p.fx);t.projectiles=t.projectiles.filter(p=>p.left>0);
  }

  // v7.8.19 Overload: ลูกบอลจากป้อมปกติระเบิดตอนหมดอายุ (ครั้งเดียว ไม่นับตอนเคลียร์รอบ)
  // v7.8.24 PoE-style Ball Lightning: every TARO_BL_TICK zaps up to 6 nearest foes inside its radius; at most 2 bolts drawn per tick
  taroOrbZap(p,tokens){const t=this._taro;if(!t?.enabled||this.state!=='play'||p.left<=0)return;if(t.time<(p.zapAt??0))return;p.zapAt=t.time+TARO_BL_TICK;
    const near=tokens.filter(token=>taroTargetValid(token,p,p.radius)).map(token=>({token,d:Math.hypot(token.enemy.x-p.x,token.enemy.y-p.y)})).sort((a,b)=>a.d-b.d).slice(0,TARO_BL_MAX_ZAPS);let drawn=0;
    for(const {token} of near){if(this._taro!==t||this.state!=='play'||p.left<=0)break;if(this.taroProjectileHit(p,token,true)&&drawn<1){drawn++;const ex=token.enemy.x,ey=token.enemy.y,d=Math.hypot(ex-p.x,ey-p.y);if(!(d>8&&!(typeof CODE_VFX!=='undefined'&&CODE_VFX.bolt)&&this.taroArt?.('bpx_taro_ball_zap',p.x,p.y,d,{h:14,life:.12,alpha:.32,rot:Math.atan2(ey-p.y,ex-p.x)})))this.taroLightningVisual?.(p.x,p.y,ex,ey,false,false,.32);else this.taroArt?.('bpx_taro_ball_zap_hit',ex,ey,18,{life:.15,alpha:.35});}}}
  /* v7.8.25 Shock (Sentry): Ball Lightning/Unique hits add a stack (max 5, 3s); each stack = +5% damage from Sentry sources */
  taroShockMul(e){const t=this._taro;if(!t||!e||!(e._shock>0)||t.time-(e._shockAt??-1e9)>TARO_SHOCK_LIFE)return 1;return 1+TARO_SHOCK_PER*e._shock;}
  taroShockAdd(e){const t=this._taro;if(!t||!e?.active||t.path!=='tempest')return;if(t.time-(e._shockAt??-1e9)>TARO_SHOCK_LIFE)e._shock=0;e._shock=Math.min(e.isBoss||e.isMini?TARO_SHOCK_MAX_BIG:TARO_SHOCK_MAX,(e._shock||0)+1);e._shockAt=t.time;this.taroShockMark?.(e);}
  /* v7.8.30 เครื่องหมาย Shock เหนือหัว (เฟรม = จำนวนชั้น) + ออร่าตอนครบ 5 · เพดาน 40 ตัว */
  taroShockMark(e){const t=this._taro;if((typeof CODE_VFX!=='undefined'&&CODE_VFX.taroBurst)){ if(!t?.enabled)return; t.shocked=t.shocked||new Set(); if(t.shocked.size<40)t.shocked.add(e); return; }if(!t?.enabled||!this.add||!this.textures?.exists?.('bpx_taro_shock_marker'))return;t.shocked=t.shocked||new Set();if(!e._shockFx?.active){if(t.shocked.size>=40)return;e._shockFx=this.taroTrackVisual(this.camWorld(this.add.sprite(e.x,e.y,'bpx_taro_shock_marker',0).setDepth(90410).setDisplaySize(26,26)),0);t.shocked.add(e);}
    e._shockFx?.setFrame(Math.max(0,Math.min(4,(e._shock||1)-1)));if(e._shock>=TARO_SHOCK_MAX&&!e._shockAura?.active&&this.bpAnim?.('bpx_taro_shock_aura')){e._shockAura=this.taroTrackVisual(this.camWorld(this.add.sprite(e.x,e.y,'bpx_taro_shock_aura',0).setDepth(90405).setDisplaySize(64,64)),0);e._shockAura?.play('bpx_taro_shock_aura');}}
  /* v8.1.157 CODE_VS_ART รอบ 3 ข้อ 10: เครื่องหมายช็อต = จุดไฟฟ้าเล็กวนเหนือหัวตามจำนวนชั้น · ชั้นเต็ม = วงไฟฟ้ากะพริบรอบตัว (1 graphics ทั้งด่าน) */
  taroShockCode(){ const t=this._taro; let g=this._shockG; if(!g||!g.active){ if(!this.add?.graphics)return 0; g=this._shockG=this.camWorld(this.add.graphics().setDepth(90410)); } g.clear(); if(!t?.shocked?.size)return 0; const T=this.time?.now/1000||0; let n=0;
    for(const e of t.shocked){ if(!e.active||!(e._shock>0))continue; const hy=e.y-(e.displayHeight||48)*.6-10,k=Math.min(5,e._shock|0),col=0xffe066;
      for(let i=0;i<k;i++){ const a=T*4+i*Math.PI*2/k,x=e.x+Math.cos(a)*12,y=hy+Math.sin(a)*4; g.fillStyle(col,.95).fillCircle(x,y,2.6); g.lineStyle(1.5,0xffffff,.8).lineBetween(x-2,y-3,x+1,y).lineBetween(x+1,y,x-1,y+3); }
      if(k>=TARO_SHOCK_MAX){ const r=(e.displayWidth||60)*.55,f=.5+.5*Math.abs(Math.sin(T*17)); g.lineStyle(2.5,col,.7*f).strokeEllipse(e.x,e.y,r*2,r*1.3); for(let j=0;j<4;j++){ const a=T*3+j*1.57,x0=e.x+Math.cos(a)*r,y0=e.y+Math.sin(a)*r*.65; g.lineStyle(2,0xffffff,.8*f).lineBetween(x0,y0,x0+Math.cos(a+1.2)*8,y0+Math.sin(a+1.2)*8); } }
      n++; } return n; }
  taroTickShockMarks(){const t=this._taro;if((typeof CODE_VFX!=='undefined'&&CODE_VFX.taroBurst)){ if(t?.shocked)for(const e of [...t.shocked]){ const live=e.active&&e._shock>0&&t.time-(e._shockAt??-1e9)<=TARO_SHOCK_LIFE; if(!live)t.shocked.delete(e); } this.taroShockCode(); return; }if(!t?.shocked?.size)return;for(const e of [...t.shocked]){const live=e.active&&e._shock>0&&t.time-(e._shockAt??-1e9)<=TARO_SHOCK_LIFE;if(!live){if(e._shockFx)this.taroRemoveFx(e._shockFx);if(e._shockAura)this.taroRemoveFx(e._shockAura);e._shockFx=e._shockAura=null;t.shocked.delete(e);continue;}const hy=e.y-(e.displayHeight||48)*.6-10;e._shockFx?.setPosition(e.x,hy);e._shockAura?.setPosition(e.x,e.y);}}
  /* v7.8.25 Sentry Unique: every regular sentry fires 6 orbs and explodes, then 2 fresh overcharged sentries appear */
  castTaroOvercharge(dm,ul=1){const t=this.syncTaroCombat();if(!t?.enabled||t.path!=='tempest'||this.state!=='play')return;const n=Math.max(1,Math.min(4,ul||1)),p=this.player,f=this.taroSwarmProfile(),boom=(40+20*n)*dm*(1+(n-1)*.22),attackId=++t.attackSeq;
    t.nodes=t.nodes||[];const mk=a=>this.taroPlaceNode({x:p.x+Math.cos(a)*40,y:p.y+Math.sin(a)*40,life:f.nodeLife,interval:f.pulse,range:f.range,damage:f.damage,orbRadius:f.radius,orbLife:f.orbLife,overload:f.overload,link:f.link,speed:TARO_BL_SPEED,beacon:false});
    /* v7.8.63 เจ้าของ: Unique = Sentry Overdrive — ป้อมไม่ระเบิดแล้ว · ครบ 3 ป้อม · 4 วิ: ยิง Ball Lightning รอบทิศทุกจังหวะ + ยิงถี่ขึ้น (TARO_OVERCHARGE) แล้วกลับแบบเดิม · ระดับ Unique = ลูกต่อวง/ดาเมจมากขึ้น */
    const ang=[-.7,.7,Math.PI/2+.6];for(let i=0;t.nodes.filter(x=>!x.beacon).length<f.sentries&&i<f.sentries;i++)mk(ang[i]);
    t.overRing=5+n;t.overDmg=1+.15*(n-1);
    for(const node of t.nodes.filter(x=>!x.beacon)){node._spin=Math.random()*Math.PI;for(let i=0;i<8;i++)this.taroSpawnProjectile({kind:'sentry',x:node.x,y:node.y,angle:node._spin+i*Math.PI/4,speed:TARO_BL_SPEED*1.15,life:f.orbLife,damage:f.damage*t.overDmg,radius:f.radius,range:f.range,overload:0,attackId});
      this.taroArt?.('bpx_taro_sentry_overload',node.x,node.y-14,180,{life:.45});if(!this.taroArt?.('bpx_taro_orb_burst',node.x,node.y,TARO_OVER_R*2/.84,{life:.4}))this.taroRing?.(node.x,node.y,TARO_OVER_R,.4);node.next=Math.min(node.next,.15);}
    void boom;t.overUntil=t.time+TARO_OVER_TIME+(p.echoPath?1.5:0)+(this.basicAttack?.uqMut==='over_long'?1.5:0);this.screenShake?.(160,.007);this.showBanner?.('Sentry Overdrive Lv'+n,'Ball Lightning in every direction · faster attacks for '+(TARO_OVER_TIME+(p.echoPath?1.5:0))+'s',1100);this.taroSound('beacon');}
  /* v7.8.25 Plasma Field (pre-path Unique, Dota 2 Razor style): ring grows to max radius then returns; hits each foe once each way, damage grows with distance */
  castTaroPlasma(dm,ul=1){const t=this.syncTaroCombat();if(!t)return;this.bpPose?.('char_taro_plasma_motion823',.45);t.enabled=true;const n=Math.max(1,Math.min(4,ul||1)),max=(280+30*(n-1)+(this.player.echoPath?40:0))*(this.basicAttack?.uqMut==='plasma_wide'?1.35:1);for(const fx of [t.plasma?.g,t.plasma?.ring])if(fx)this.taroRemoveFx(fx);
    t.plasma={r:24,dir:1,max,speed:max/.9,out:new Set(),back:new Set(),min:(6+3*n)*dm,top:(18+8*n)*dm*(1+(n-1)*.22),arc:t.path==='storm',attackId:++t.attackSeq,g:this.add?.graphics?this.taroTrackVisual(this.camWorld(this.add.graphics().setDepth(90390)),0):null};
    t.plasma.ring=this.taroArt?.('bpx_taro_plasma_ring',this.player.x,this.player.y,48,{depth:90390})||null;this.taroArt?.('bpx_taro_plasma_cast',this.player.x,this.player.y,190,{life:.4});this.screenShake?.(90,.004);this.showBanner?.('Plasma Field Lv'+n,'Lightning sweeps out and back',1000);this.taroSound('beacon');}
  /* v7.8.27 Plasma Field สาย Arc: ทุกตัวที่วงโดนปล่อย Arc 1 กระโดดไปหาตัวใกล้สุด · ไม่มีเป้าอื่น = เด้งกลับตัวเดิม 2 ครั้ง (Overload Loop) */
  taroPlasmaArc(token,dmg,pl){const t=this._taro;if(!t?.enabled||this.state!=='play'||!token?.enemy?.active)return;const e=token.enemy,used=new Set([token.id]),nx=this.taroNearestUnused(this.taroCandidates(e,TARO_ARC_JUMP),e,TARO_ARC_JUMP,used);
    if(nx){this.taroLightningVisual?.(e.x,e.y,nx.enemy.x,nx.enemy.y);this.taroDealDamage(nx,dmg,'unique',{attackId:pl.attackId});}else for(let i=0;i<2;i++){if(!taroTargetValid(token,e,Infinity))break;if(!i)this.taroLightningVisual?.(this.player.x,this.player.y,e.x,e.y);this.taroDealDamage(token,dmg*TARO_ARC_LOOP,'unique',{attackId:pl.attackId});}}
  taroArcFocus(list,range){const p=this.player;let best=null,bd=range;for(const k of list){const e=k.enemy;if(!(e?.isBoss||e?.isMini)||!e.active||!(e.hp>0))continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<=bd){bd=d;best=k;}}return best;}
  /* v7.8.69 เจ้าของ: Plasma กางสุดแล้วกลับมา → ทิ้ง Magnetic Field พื้นสายฟ้า 10 วิ · ศัตรูในวงรับดาเมจ +25% จากทุกแหล่ง */
  taroMagField(x,y,r){const t=this._taro;if(!t?.enabled||this.state!=='play')return;if(t.mag?.g)this.taroRemoveFx(t.mag.g);const g=this.add?.graphics?this.taroTrackVisual(this.camWorld(this.add.graphics().setDepth(4)),0):null;
    t.mag={x,y,r,until:t.time+TARO_MAG_TIME,run:t.run,pathEpoch:t.pathEpoch,g,draw:0};this.taroArt?.('bpx_taro_plasma_cast',x,y,Math.min(260,r),{life:.4});this.floatText?.(x,y-40,'🧲 Magnetic Field',0x9ad8ff);}
  taroMagMul(e){const t=this._taro,m=t?.mag;if(!m||!e||t.time>=m.until||m.run!==t.run||m.pathEpoch!==t.pathEpoch)return 1;return Math.hypot(e.x-m.x,e.y-m.y)<=m.r?TARO_MAG_MUL:1;}
  taroTickMagField(dt){const t=this._taro,m=t?.mag;if(!m)return;if(t.time>=m.until||m.run!==t.run||m.pathEpoch!==t.pathEpoch||this.state!=='play'){this.taroRemoveFx(m.g);t.mag=null;return;}const g=m.g;if(!g?.active)return;m.draw-=dt;if(m.draw>0)return;m.draw=.12;
    const left=m.until-t.time,fade=Math.min(1,left/1.2);g.clear().setPosition(m.x,m.y);
    for(let i=0;i<7;i++){const a=Math.random()*Math.PI*2,r0=Math.random()*m.r*.9,len=18+Math.random()*26;let x=Math.cos(a)*r0,y=Math.sin(a)*r0;g.lineStyle(2,0xcfeeff,.7*fade);g.beginPath();g.moveTo(x,y);for(let k=0;k<3;k++){x+=Math.cos(a+1.2+(Math.random()-.5)*1.6)*len/3;y+=Math.sin(a+1.2+(Math.random()-.5)*1.6)*len/3;g.lineTo(x,y);}g.strokePath();}}
  taroTickPlasma(dt){this.taroTickMagField?.(dt);const t=this._taro,pl=t?.plasma;if(!pl||this.state!=='play')return;const p=this.player;pl.r+=pl.dir*pl.speed*dt;if(pl.dir>0&&pl.r>=pl.max){pl.r=pl.max;pl.dir=-1;this.hitCratesInRadius?.(p.x,p.y,pl.max,pl.top);}
    if(pl.dir<0&&pl.r<=20){this.taroRemoveFx(pl.g);if(pl.ring)this.taroRemoveFx(pl.ring);t.plasma=null;this.taroMagField?.(p.x,p.y,pl.max);return;}const set=pl.dir>0?pl.out:pl.back;
    for(const token of this.taroCandidates(p,pl.r+40)){if(set.has(token.id))continue;const d=Math.hypot(token.enemy.x-p.x,token.enemy.y-p.y),band=26+Math.min(30,(token.enemy.displayWidth||40)*.3);if(Math.abs(d-pl.r)>band)continue;set.add(token.id);const k=Math.max(0,Math.min(1,d/pl.max));const pd=(pl.min+(pl.top-pl.min)*k)*taroLightningRoll()*(token.enemy.isBoss||token.enemy.isMini?TARO_PLASMA_BOSS:1);this.taroDealDamage(token,pd,'unique',{attackId:pl.attackId});this.taroArt?.('bpx_taro_plasma_hit',token.enemy.x,token.enemy.y,48,{life:.2});if(this._taro!==t||!t.plasma)return;if(pl.arc)this.taroPlasmaArc(token,pd*.5,pl);}
    if(pl.ring?.active){pl.ring.setPosition(p.x,p.y).setDisplaySize(pl.r*2/.92,pl.r*2/.92);if(pl.g?.active)pl.g.clear();return;}
    const g=pl.g;if(g?.active){g.clear().setPosition(p.x,p.y);for(let i=0;i<8;i++){const a=i*Math.PI/4+t.time*2,r=pl.r*(.25+(i%3)*.22),x=Math.cos(a)*r,y=Math.sin(a)*r,j=Math.min(22,pl.r*.2);g.lineStyle(2,0xcfeeff,.65).lineBetween(x-j,y-j*.4,x,y+j*.35);g.lineBetween(x,y+j*.35,x+j,y-j*.6);}}}

  taroOrbFade(p){if(p.blast>0)return this.taroSparkBlast?.(p);const t=this._taro;if(t?.enabled&&this.state==='play'&&!p._stale&&!p._fadeArt&&(p.kind==='sentry'||p.kind==='beacon')){p._fadeArt=true;this.taroArt?.('bpx_taro_ball_fade',p.x,p.y,p.kind==='beacon'?66:58,{life:.33,tint:p.kind==='beacon'?0xffe7a8:null});}if(!t?.enabled||this.state!=='play'||p._stale||p._faded||p.kind!=='sentry'||p.run!==t.run||p.pathEpoch!==t.pathEpoch)return;p._faded=true;
    const R=Math.round(p.radius*1.4),dmg=p.damage*(1+(p.overload||0));   /* v7.8.52 C ระเบิดพื้นฐาน ×1 · การ์ด Overload บวกเพิ่ม */for(const token of this.taroCandidates(p,R))this.taroDealDamage(token,dmg*taroLightningRoll()*this.taroShockMul(token.enemy),'sentry',{attackId:p.attackId});this.hitCratesInRadius?.(p.x,p.y,R,dmg);if(!this.taroArt?.('bpx_taro_orb_burst',p.x,p.y,R*2/.84,{life:.33}))this.taroRing?.(p.x,p.y,R===120?121:R,.3);}
  // v7.8.19 Tesla Link: ป้อมปกติ 2 ตัวห่างไม่เกิน 420px มีสายฟ้าเชื่อม ทุก 0.5 วิ ดาเมจศัตรูที่อยู่บนเส้น
  taroTeslaLink(dt){const t=this._taro;if(!t?.enabled||this.state!=='play')return;const ns=(t.nodes||[]).filter(n=>!n.beacon&&n.link>0&&n.run===t.run&&n.pathEpoch===t.pathEpoch);if(ns.length<2){t.linkAt=0;this.taroLinkBeam?.(null);return;}
    const [a,b]=ns,d=Math.hypot(a.x-b.x,a.y-b.y);if(d>TARO_LINK_RANGE){this.taroLinkBeam?.(null);return;}this.taroLinkBeam?.(a,b,d);t.linkAt=(t.linkAt||0)-dt;if(t.linkAt>0)return;t.linkAt=.5;
    const dmg=Math.max(a.damage,b.damage)*Math.max(a.link,b.link),attackId=++t.attackSeq;if(!t.linkFx?.active)this.taroLightningVisual?.(a.x,a.y-14,b.x,b.y-14);
    for(const token of this.taroCandidates(this.player,Infinity))if(taroSegmentDistance(token.enemy,a,b)<=26+Math.min(30,(token.enemy.displayWidth||40)*.3))this.taroDealDamage(token,dmg*taroLightningRoll()*this.taroShockMul(token.enemy),'sentry',{attackId});}
  taroLinkBeam(a,b,d){const t=this._taro;if(!t)return;if(!a){if(t.linkFx){this.taroRemoveFx(t.linkFx);t.linkFx=null;}return;}if(!t.linkFx?.active)t.linkFx=this.taroArt('bpx_taro_tesla',a.x,a.y-14,d,{h:40,depth:89995});t.linkFx?.setPosition(a.x,a.y-14).setRotation(Math.atan2(b.y-a.y,b.x-a.x)).setDisplaySize(d,40);}
  castTaroTempestUnique(dm,ul){return this.castTaroPathUnique(dm,ul);}
  castTaroPathUnique(dm,ul){
    const t=this.syncTaroCombat();if(!t?.enabled||this.state!=='play')return;ul=Math.max(1,Math.min(4,ul||1));const upgraded=!!this.player.echoPath,jumps=4+ul+(upgraded?2:0),range=Math.min(400,250+ul*16+(upgraded?40:0)),forks=ul>=3?2:1,damage=(9+ul*7)*dm*(1+(ul-1)*.22),hit=new Set(),attackId=++t.attackSeq,candidates=this.taroCandidates(this.player,Infinity),shrapnelD=t.path==='storm'?this.taroTempestProfile().unitD:0;
    const nearest=(origin,radius)=>candidates.filter(token=>!hit.has(token.id)&&taroTargetValid(token,origin,radius)).sort((a,b)=>Math.hypot(a.enemy.x-origin.x,a.enemy.y-origin.y)-Math.hypot(b.enemy.x-origin.x,b.enemy.y-origin.y)||a.id-b.id)[0];
    const rod=t.path==='smite'?(taroTargetValid(t.mark,this.player,760)?t.mark:taroPriorityTarget(candidates.map(token=>token.enemy),this.player,760)):null;
    if(!nearest(this.player,760))this.taroRing(this.player.x,this.player.y,44);
    else for(let f=0;f<forks;f++)this.taroSchedule('unique',f*.09,()=>{
      let from={x:this.player.x,y:this.player.y},token=f===0&&t.path==='smite'?taroPriorityTarget(candidates.filter(candidate=>!hit.has(candidate.id)&&taroTargetValid(candidate,from,760)).map(candidate=>candidate.enemy),from,760,rod):nearest(from,760);
      for(let j=0;j<jumps&&token&&hit.size<18;j++){
        if(this._taro!==t||this.state!=='play'||!taroTargetValid(token,from,j?range:760))break;
        const point={x:token.enemy.x,y:token.enemy.y};hit.add(token.id);{ const tk=token,fr=from,jj=j,go=()=>{ if(jj&&!taroTargetValid(tk,this.player,Infinity))return; this.chainBolt(fr.x,fr.y,tk.enemy.x,tk.enemy.y,true);this.vfxHitRing?.(tk.enemy.x,tk.enemy.y,0xd7b8ff,jj===0);if(jj===0)this.taroChainStop?.();this.taroDealDamage(tk,damage*Math.max(0,1-jj*.045),'unique',{attackId,shrapnelD}); }; if(jj&&this.time?.delayedCall)this.time.delayedCall(jj*45,()=>{ if(this.state==='play'&&this._taro===t)go(); }); else go(); }   /* v8.1.162 เจ้าของ (Taro C): โซ่ Unique ฟาดทีละตัว ห่าง 45 ms */from=point;token=nearest(from,range);
      }
      if(hit.size)Sfx.bp?.('uq_taro_chain_hit',.4,.3)||Sfx.zap?.();
    },{attackId});
    this.dashReady=true;this.dashCd=0;this.pathHasteT=1+ul*.38+(upgraded?.55:0);this.player.iframe=Math.max(this.player.iframe||0,.32+ul*.06);
    this.showBanner('Chain Bolt Lv'+ul,'Chains up to '+Math.min(18,jumps*forks)+' · Dash ready',950);Sfx.bp?.('uq_taro_chain_cast',.6,.3)||Sfx.zap();
  }

  taroRefreshRod(level){
    const t=this._taro;if(!t?.enabled||t.path!=='smite'||this.state!=='play')return null;
    const range=this.taroTempestProfile(level).rootRange,token=this.taroPickTarget(range);
    if(!token){t.rodFx?.setVisible(false);return null;}
    if(!t.rodFx){const fx=this.camWorld(this.add.graphics().setDepth(90001));fx.lineStyle(4,0x241c38,.95);fx.strokeCircle(0,0,23);fx.lineStyle(2,0xffda89,1);for(let i=0;i<4;i++){const a=i*Math.PI/2;fx.beginPath();fx.arc(0,0,23,a+.12,a+.7);fx.strokePath();}fx.fillStyle(0xffda89,1);fx.fillTriangle(0,-36,-5,-28,5,-28);t.rodFx=fx;t.fx.add(fx);}
    const zoom=Math.max(.4,this.cameras?.main?.zoom||1);t.rodFx.setScale(Math.max(1/zoom,Math.min(2.6,(token.enemy.displayWidth||46)/60))).setVisible(true).setPosition(token.enemy.x,token.enemy.y);return token;
  }
  taroAfterSmite(ticket,e){
    if(!ticket||ticket.used||ticket.owner!==this._taro||ticket.run!==this._taro.run||ticket.pathEpoch!==this._taro.pathEpoch||this.state!=='play'||!e.active||ticket.token?.enemy!==e||ticket.token.id!==e._taroSpawnId)return;
    ticket.used=true;const f=ticket.smiteProfile,token=ticket.token,attackId=ticket.attackId,origin=ticket.origin;
    if(e.hp>0&&(e.isBoss||e.isMini||e.isElite))this.taroSchedule('repeat',.22,()=>{
      this.zap(token.enemy.x,token.enemy.y);this.taroDealDamage(token,.9*f.unitD*f.extraStrikeBonus,'repeat',{attackId,range:f.rootRange});
    },{token,range:f.rootRange,attackId});
    if(f.splashTargets)this.taroSchedule('splash',0,()=>{
      const hit=new Set([token.id]),targets=[];
      for(let i=0;i<f.splashTargets;i++){const next=this.taroNearestUnused(ticket.candidates,origin,150,hit);if(!next)break;hit.add(next.id);targets.push(next);}
      this.taroRing(origin.x,origin.y,38,.16);
      for(const target of targets){if(this._taro!==ticket.owner||this.state!=='play')break;if(!taroTargetValid(target,origin,150))continue;this.chainBolt(origin.x,origin.y,target.enemy.x,target.enemy.y);this.taroDealDamage(target,.25*f.unitD*f.splashBonus,'splash',{attackId});}
    },{attackId});
  }

  taroNearestUnused(candidates,origin,range,hit){return candidates.filter(token=>!hit.has(token.id)&&taroTargetValid(token,origin,range)).sort((a,b)=>Math.hypot(a.enemy.x-origin.x,a.enemy.y-origin.y)-Math.hypot(b.enemy.x-origin.x,b.enemy.y-origin.y)||a.id-b.id)[0]||null;}
  castTaroNeedle(level,dm){
    if(this.character!=='taro'||this.basicAttack?.path||this.state!=='play'||!this.player?.active||!(this.player.hp>0))return;
    const p=this.player,b=this.basicAttack,t=this._taro,f=taroNeedleProfile(b,p,level,dm),targets=this.taroCandidates(p,f.range).sort((a,b)=>Math.hypot(a.enemy.x-p.x,a.enemy.y-p.y)-Math.hypot(b.enemy.x-p.x,b.enemy.y-p.y)||a.id-b.id).slice(0,f.shots);
    /* v7.8.27 เจ้าของ: ก่อนเลือก Build = Static Arc เล็ก (สายละ 3 กระโดด + Arc Reach) · กระโดดไม่มีเป้าใหม่ = เด้งกลับเป้าเดิม 60% (Overload Loop) */
    const jumps=Math.min(10,3+Math.min(3,Math.max(0,b?.ranks?.arc||0))+(b?.mutation==='chainlord'?2:0)+(b?.evolved?3:0)),hit=new Set(),all=this.taroCandidates(p,Infinity);
    /* v7.8.62 เจ้าของ: Arc = โจมตีปกติของ Taro (ก่อนเลือก Build) → กระโดดทีละตัวทุก TARO_ARC_HOP_MS เหมือนสาย Arc Build */
    const hopMs=this.time?.delayedCall?TARO_ARC_HOP_MS:0,at=(i,fn)=>{if(!i||!hopMs)return fn();this.time.delayedCall(i*hopMs,()=>{if(this.state==='play'&&this.player===p&&this.basicAttack===b)fn();});};
    for(const root of targets){if(this.state!=='play'||this.player!==p||this._taro!==t||this.basicAttack!==b||b?.path)break;if(!taroTargetValid(root,p,f.range)||hit.has(root.id))continue;let from={x:p.x,y:p.y},token=root,last=null,j=0,prev=null;
      for(;j<jumps&&token;j++){if(this.state!=='play'||this.player!==p||!taroTargetValid(token,from,j?TARO_ARC_JUMP:f.range))break;const tk=token,src=from,jj=j,pv=prev;hit.add(token.id);at(j,()=>{if(!taroTargetValid(tk,p,Infinity))return;const e=tk.enemy,sx=pv?.enemy?.active?pv.enemy.x:src.x,sy=pv?.enemy?.active?pv.enemy.y:src.y;(this.taroArcBolt||this.chainBolt)?.call(this,sx,sy,e.x,e.y);this.damage(e,f.damage*TARO_ARC_STARTER*Math.min(1.6,1+.12*jj),e.x,e.y);});from={x:token.enemy.x,y:token.enemy.y};prev=token;last=token;token=this.taroNearestUnused(all,from,TARO_ARC_JUMP,hit);}
      for(let k=0;last&&!token&&j<jumps&&k<Math.min(jumps,TARO_ARC_LOOP_MAX);k++,j++){if(this.state!=='play'||!taroTargetValid(last,p,Infinity))break;const lt=last;at(j,()=>{if(!taroTargetValid(lt,p,Infinity))return;(this.taroArcLoopHop||((tk,fn)=>fn())).call(this,lt,()=>{if(this.state==='play'&&taroTargetValid(lt,p,Infinity))this.damage(lt.enemy,f.damage*TARO_ARC_STARTER*TARO_ARC_LOOP,lt.enemy.x,lt.enemy.y);});});}}
    Sfx.bp?.('taro_chain',.22,.18,1.25);
  }
  castTaroChainBasic(level,_echo){
    const t=this.syncTaroCombat();if(!t?.enabled||t.path!=='storm'||this.state!=='play')return;
    {const tw=this.basicAttack?.lv?.p_arc_twin||0;if(tw&&!_echo&&(this._arcN=(this._arcN||0)+1)%(tw>=2?3:4)===0)this.time?.delayedCall?.(180,()=>{if(this._taro===t&&this.state==='play')this.castTaroChainBasic(level,true);});}   // v7.9.23 Double Arc
    const f=this.taroTempestProfile(level),candidates=this.taroCandidates(this.player,Infinity),hit=new Set(),attackId=++t.attackSeq;
    /* v7.8.58 เจ้าของ: Arc ไม่กระโดดทันที — แต่ละกระโดดเดินทางทีละช่วง TARO_ARC_HOP_MS (แบบ Chain Frost แต่เร็วกว่า) · เลือกเป้าทันทีเหมือนเดิม แค่ส่งดาเมจ/ภาพตามลำดับ */
    const hopMs=this.time?.delayedCall?TARO_ARC_HOP_MS:0,at=(i,fn)=>{if(!i||!hopMs)return fn();this.time.delayedCall(i*hopMs,()=>{if(this._taro===t&&this.state==='play')fn();});};
    /* v7.8.31 เจ้าของ: Arc ตีเป้าเดี่ยวเบา → มีบอส/มินิในระยะ = ทุกสายทุกกระโดดรวมเข้าบอส 100% (+15%/ใบ Overload) */
    const focus=this.taroArcFocus?.(candidates,f.rootRange);if(focus){const fm=1+.15*Math.max(0,this.basicAttack?.lv?.p_arc_overload??this.basicAttack?.ranks?.p_arc_overload??0);
      for(let root=0;root<f.roots;root++)for(let j=0;j<Math.min(f.victims,TARO_ARC_BOSS_HITS);j++){if(this._taro!==t||this.state!=='play'||!taroTargetValid(focus,this.player,Infinity))break;   /* v8.0.82 เจ้าของ: จำกัดการเด้งบนบอส = ตีเต็ม 1 + เด้งกลับ ≤2 ต่อสาย */at(j,()=>{if(!taroTargetValid(focus,this.player,Infinity))return;const hit=()=>{if(this._taro===t&&taroTargetValid(focus,this.player,Infinity))this.taroDealDamage(focus,f.primaryDamage*f.chainBonus*f.rootBonus*(j?TARO_ARC_LOOP*fm:1)*taroLightningRoll(),'chain',{attackId,shrapnelD:f.unitD});};   /* v8.0.79 เจ้าของ: Arc ตีบอสตัวเดียวโกง → กระโดดแรกเต็ม ที่เหลือ 60% (+15%/Overload) เหมือนเด้งกลับปกติ */if(!j){this.taroArcBolt?.(this.player.x,this.player.y,focus.enemy.x,focus.enemy.y,false);hit();}else (this.taroArcLoopHop||((tk,fn)=>fn())).call(this,focus,hit);});}
      if(this._taro===t&&this.state==='play')this.hitCratesInRadius(this.player.x,this.player.y,f.rootRange,f.primaryDamage);this.taroSound?.('chain')||Sfx.thunder();return;}
    for(let root=0;root<f.roots;root++){
      if(this._taro!==t||this.state!=='play')break;
      let from={x:this.player.x,y:this.player.y},token=this.taroNearestUnused(candidates,from,f.rootRange,hit),last=null,j=0,prevTok=null;
      for(;j<f.victims&&token;j++){
        if(this._taro!==t||this.state!=='play'||!taroTargetValid(token,from,j?f.jumpRange:f.rootRange))break;
        const point={x:token.enemy.x,y:token.enemy.y};hit.add(token.id);last=token;
        {const tk=token,src=from,jj=j,prev=j?prevTok:null;at(j,()=>{if(!taroTargetValid(tk,this.player,Infinity))return;const sx=prev?.enemy?.active?prev.enemy.x:src.x,sy=prev?.enemy?.active?prev.enemy.y:src.y;(this.taroArcBolt||this.chainBolt).call(this,sx,sy,tk.enemy.x,tk.enemy.y);this.taroDealDamage(tk,f.primaryDamage*f.chainBonus*f.rootBonus*Math.min(1.6,1+.12*jj),'chain',{attackId,shrapnelD:f.unitD});});}
        prevTok=token;from=point;token=this.taroNearestUnused(candidates,from,f.jumpRange,hit);
      }
      /* v7.8.27 Overload Loop: remaining jumps loop back into the last target at 60% (+15% per Overload card) so a lone boss takes every jump */
      const ov=TARO_ARC_LOOP*(1+.15*Math.max(0,this.basicAttack?.lv?.p_arc_overload??this.basicAttack?.ranks?.p_arc_overload??0));
      for(let k=0;last&&!token&&j<f.victims&&k<TARO_ARC_LOOP_MAX;k++,j++){   /* v8.0.82 เด้งกลับเป้าเดิม ≤2 */if(this._taro!==t||this.state!=='play'||!taroTargetValid(last,this.player,Infinity))break;const lt=last;at(j,()=>{if(!taroTargetValid(lt,this.player,Infinity))return;(this.taroArcLoopHop||((tk,fn)=>fn())).call(this,lt,()=>{if(this._taro===t&&taroTargetValid(lt,this.player,Infinity))this.taroDealDamage(lt,f.primaryDamage*f.chainBonus*f.rootBonus*ov*taroLightningRoll(),'chain',{attackId,shrapnelD:f.unitD});});});}
    }
    if(this._taro===t&&this.state==='play')this.hitCratesInRadius(this.player.x,this.player.y,f.rootRange,f.primaryDamage);this.taroSound?.('chain')||Sfx.thunder();
  }
  // A one-shot entry ticket belongs only to the direct damage() call. Nested gear,
  // infusion or recipe emissions cannot inherit a Chain kill, even on the same victim.
  taroTakeDirect(e){
    const c=this._taroDamageContext;if(!c?.directPending)return null;c.directPending=false;
    const t=this._taro;if(!t?.enabled||c.terminal||c.targetId!==e._taroSpawnId)return null;
    if(t.path==='smite'&&c.source==='smite'&&c.smiteProfile)return {owner:t,run:t.run,pathEpoch:t.pathEpoch,token:taroEnemyToken(e),attackId:c.attackId,smiteProfile:c.smiteProfile,origin:c.smiteOrigin,candidates:c.smiteCandidates};
    if(t.path==='smite'&&c.source==='unique')return {owner:t,run:t.run,pathEpoch:t.pathEpoch,token:taroEnemyToken(e),attackId:c.attackId,noEffects:true};
    if(t.path!=='storm'||!['chain','unique'].includes(c.source)||!(c.shrapnelD>0))return null;
    return {owner:t,run:t.run,pathEpoch:t.pathEpoch,token:taroEnemyToken(e),unitD:c.shrapnelD,attackId:c.attackId};
  }
  taroAfterDirect(ticket,e){
    if(!ticket||ticket.used||ticket.owner!==this._taro||ticket.run!==this._taro.run||ticket.pathEpoch!==this._taro.pathEpoch||this.state!=='play'||!e.active||e.hp>0||e.isDummy||ticket.token?.enemy!==e||ticket.token.id!==e._taroSpawnId)return;
    ticket.used=true;{const gr=this.basicAttack?.path==='storm'?(this.basicAttack.lv?.p_arc_ground||0):0;if(gr&&(this.elapsed||0)>=(this._groundAt||0)){this._groundAt=(this.elapsed||0)+.25;const p=this.player,h=p.maxhp*.004*gr;p.hp=Math.min(p.maxhp,p.hp+h);}}   // v7.9.23 Grounding
    const ss=this.basicAttack?.path==='storm'?Math.min(3,this.basicAttack.lv?.p_static||0):0,origin={x:e.x,y:e.y},damage=.3*ticket.unitD*(1+ss*.33),dead=ticket.token;   // v7.9.21 Static Shards
    const job=this.taroSchedule('shrapnel',.08,()=>{
      const hit=new Set([dead.id]),candidates=this.taroCandidates(origin,130).filter(token=>token.enemy!==dead.enemy),targets=[];
      for(let i=0;i<3+ss;i++){const token=this.taroNearestUnused(candidates,origin,130,hit);if(!token)break;hit.add(token.id);targets.push(token);}
      if(!this.heroFx?.('bpx_taro_shrapnel',origin.x,origin.y,90))this.taroRing(origin.x,origin.y,36,.16);
      for(const token of targets){if(this._taro!==ticket.owner||this.state!=='play')break;if(!taroTargetValid(token,origin,130))continue;this.chainBolt(origin.x,origin.y,token.enemy.x,token.enemy.y);this.taroDealDamage(token,damage,'shrapnel',{attackId:ticket.attackId});}
    },{attackId:ticket.attackId});
    if(!job){const t=this._taro,bucket=Math.floor(t.time/.25);if(t.shrapnelOverflowBucket!==bucket){t.shrapnelOverflowBucket=bucket;this.taroRing(origin.x,origin.y,24,.12);}}
  }

  taroTempestProfile(level=this.skills?.thunder||1){
    const p=this.player,b=this.basicAttack,sw=this.signatureWeaponInfo(),f=p.forgeMods||{},r=p.forgeMods?forgeState(this):{};
    const cadence=(1+(f[5]||0)/200)/(1+Math.min(.5,(f[2]||0)/100+((this.elapsed||0)<(r.breakHasteUntil||0)?(f[95]||0)/100:0)));
    return this.taroProfile(level,{skillPower:BALANCE.skillPower.thunder,weaponDamage:sw.skill==='thunder'?(p.weaponDmgMul||1):1,weaponCooldown:sw.skill==='thunder'?(p.weaponCdMul||1):1,forgeCadence:cadence,infusionDirect:b.infusion?(FLAVOR_INFUSIONS.find(f=>f.id===b.infusion)?.direct??1):1});
  }
  taroCandidates(origin,range){return this.enemies.getChildren().map(taroEnemyToken).filter(token=>taroTargetValid(token,origin,range));}
  taroRemoveFx(fx){const t=this._taro;if(!fx)return;for(const child of fx._taroAttached||[])this.taroRemoveFx(child);t?.fx.delete(fx);if(fx.active)fx.destroy();}
  // Presentation owns no damage, targeting, charge or gameplay timers.
  taroTrackVisual(fx,duration=.2){const t=this._taro;if(!t?.enabled){fx?.destroy();return null;}fx._taroLife=duration;fx._taroDuration=duration;fx._taroBaseAlpha=fx.alpha??1;t.fx.add(fx);return fx;}
  taroVisualBudget(own=false){const t=this._taro;if(!t?.enabled||this.state!=='play')return false;return [...t.fx].filter(fx=>fx._taroLife>0).length<20&&(own||this.fxOk());}
  taroSound(kind){if(kind==='spark'&&Sfx.a21?.('taro_spark',.3,.25))return true;Sfx.bp?.('taro_'+({spark:'chain',deploy:'smite',beacon:'ready'}[kind]||kind),kind==='ready'?.28:.32,kind==='chain'?.18:kind==='smite'?.22:.25,1);return true;}
  taroRing(x,y,radius,duration=.3){
    const t=this._taro;if(!t?.enabled)return;
    // Pending bombs are owned by the existing capped job, never a new fuse.
    if(duration===0){const fx=this.camWorld(this.add.circle(x,y,18,0xa98cf0,.15).setStrokeStyle(2,0xd9bfff,.9).setDepth(89990));fx._taroBombAt=t.time+.45;fx._taroAttached=[];
      if(this.textures.exists('fx_taro_dash_bomb')){const icon=this.taroTrackVisual(this.camWorld(this.add.image(x,y-5,'fx_taro_dash_bomb').setDisplaySize(40,40).setDepth(89991)),0);fx._taroAttached.push(icon);}
      const fuse=this.taroTrackVisual(this.camWorld(this.add.graphics().setPosition(x,y).setDepth(89992)),0);fx._taroFuse=fuse;fx._taroAttached.push(fuse);return this.taroTrackVisual(fx,0);}
    if(!this.taroVisualBudget())return;
    const g=this.camWorld(this.add.graphics().setPosition(x,y).setDepth(7)),nova=t.path==='tempest'&&radius>=150,bomb=t.path==='tempest'&&radius===120;
    // Open interiors preserve floor hazards. Shape and color both identify the effect.
    if(nova){for(let i=0;i<8;i++){const a=i*Math.PI/4;g.lineStyle(5,0x302348,.8);g.beginPath();g.arc(0,0,radius,a+.08,a+.58);g.strokePath();g.lineStyle(2,0xa9e8ee,.9);g.beginPath();g.arc(0,0,radius,a+.08,a+.58);g.strokePath();}this.taroSound('nova');}
    else if(bomb){g.lineStyle(5,0x302348,.8);g.strokePoints([{x:0,y:-radius},{x:radius,y:0},{x:0,y:radius},{x:-radius,y:0}],true);g.lineStyle(2,0xc6a2ed,.95);g.strokePoints([{x:0,y:-radius},{x:radius,y:0},{x:0,y:radius},{x:-radius,y:0}],true);this.taroSound('bomb');}
    else {g.lineStyle(2,t.path==='smite'?0xffda89:0xc6a2ed,.8);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;g.lineBetween(Math.cos(a)*8,Math.sin(a)*8,Math.cos(a)*radius,Math.sin(a)*radius);}}
    return this.taroTrackVisual(g,duration);
  }
  taroLightningVisual(x1,y1,x2,y2,strike=false,big=false,visualAlpha=1){
    // Lightning uses only Taro's own 20-live cap: the shared per-frame fxOk (2 in low-perf mode) dropped every link after the first in one chain.
    if(!this.taroVisualBudget(true))return;
    // v7.8.16 เส้นเดิม 2px/0.14วิ อยู่ depth 7 ใต้สไปรต์ → มองแทบไม่เห็น · วาดเรืองแสง+ขอบเข้ม+แกนขาว บน depth VFX (1 graphics/เส้น เคารพเพดาน 20)
    const t=this._taro,g=this.camWorld(this.add.graphics().setDepth(90400)),smite=t.path==='smite',arc=!smite&&t.path!=='tempest',col=smite?0xffda89:t.path==='tempest'?0xa9e8ee:0xd9b8ff,k=(big?1.6:1)*(arc?1.3:1),gw=arc?.34:.22,points=[];   /* v8.1.164 เจ้าของ: เส้น Arc มองไม่ค่อยเห็น → หนาขึ้น ×1.3 · สีสว่างขึ้น · เรืองแสงชัดขึ้น · ค้างนานขึ้น 0.24→0.32 วิ */
    g.setAlpha?.(visualAlpha);
    /* v8.1.156 CODE_VS_ART รอบ 2 ข้อ 2 · v8.1.160 เจ้าของ: สายฟ้ายังธรรมดา → ฟาดจากต้นทางวิ่งไปถึงเป้า (40 ms) · เส้นหลัก + เส้นรองบางอีก 2 เส้นแตกเปรี๊ยะคู่กัน · กิ่งแตก 1–2 กิ่ง · ประกายไฟวิ่งตามเส้น · ปลายทางวาบขาว + สะเก็ดไฟกระเด็น · หยักใหม่ 2 ครั้ง (กะพริบ) แล้วเหลือแสงค้างจาง ๆ · ต้นทางมีลูกไฟเล็ก */
    const RR=Math.random,dX=x2-x1,dY=y2-y1,LEN=Math.hypot(dX,dY)||1,NX=-dY/LEN,NY=dX/LEN,sparks=Array.from({length:strike?6:5},()=>({a:RR()*Math.PI*2,s:.5+RR()*.8}));
    const jag=(amp,seg)=>{ const P=[]; if(strike){const top=y2-(smite?150:110);P.push({x:x2,y:top});for(let i=1;i<5;i++)P.push({x:x2+(RR()*2-1)*amp*.8,y:top+(y2-top)*i/5});P.push({x:x2,y:y2});return P;} const n=Math.max(3,Math.min(9,Math.round(LEN/seg)));P.push({x:x1,y:y1});for(let i=1;i<n;i++){const j=(RR()*2-1)*Math.min(amp,LEN*.12);P.push({x:x1+dX*i/n+NX*j,y:y1+dY*i/n+NY*j});}P.push({x:x2,y:y2});return P; };
    const cut=(P,f)=>{ if(f>=1)return P; const out=[P[0]],tot=P.length-1,end=f*tot; for(let i=1;i<=tot;i++){ if(i<=end)out.push(P[i]); else { const a=P[i-1],b=P[i],u=end-(i-1); if(u>0)out.push({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u}); break; } } return out; };
    let main,sub1,sub2,forks;
    const build=()=>{ main=jag(16*k,34); sub1=jag(22*k,26); sub2=jag(12*k,30); forks=[]; if(!strike&&main.length>3){ for(let f=0;f<(LEN>140?2:1);f++){ const m=main[1+Math.floor(RR()*(main.length-2))],a=Math.atan2(dY,dX)+(RR()<.5?-1:1)*(.45+RR()*.5),L=Math.min(52,LEN*.3)*k; forks.push([m,{x:m.x+Math.cos(a)*L*.5+(RR()-.5)*10,y:m.y+Math.sin(a)*L*.5+(RR()-.5)*10},{x:m.x+Math.cos(a)*L,y:m.y+Math.sin(a)*L}]); } } };
    const FC=(c,a,x,y,r)=>{ g.fillStyle?.(c,a); g.fillCircle?.(x,y,r); };
    const paint=(f=1,flash=0,fade=1)=>{ if(!g.active)return; g.clear?.(); const M=cut(main,f);
      g.lineStyle(18*k,col,gw*fade);g.strokePoints(M);g.lineStyle(7*k,0x302348,.85*fade);g.strokePoints(M);g.lineStyle(3.5*k,col,fade);g.strokePoints(M);g.lineStyle(1.6*k,0xffffff,.95*fade);g.strokePoints(M);
      for(const S of [sub1,sub2]){ const T=cut(S,f); g.lineStyle(1.6*k,col,.65*fade);g.strokePoints(T);g.lineStyle(.8*k,0xffffff,.6*fade);g.strokePoints(T); }
      if(f>=1){ for(const F of forks){ g.lineStyle(6*k,col,.22*fade);g.strokePoints(F);g.lineStyle(2*k,col,.95*fade);g.strokePoints(F);g.lineStyle(1*k,0xffffff,.8*fade);g.strokePoints(F); }
        for(let i=0;i<3;i++){ const q=main[1+Math.floor(RR()*Math.max(1,main.length-2))]; FC(0xffffff,.9*fade,q.x+(RR()-.5)*8,q.y+(RR()-.5)*8,1.6*k); }
        const tr=(strike?20:12)*k; g.lineStyle(3*k,col,.9*fade);g.strokeCircle(x2,y2,tr*(1+flash*.5));g.lineStyle(2*k,0xffffff,.9*fade);g.strokeCircle(x2,y2,4*k);
        if(flash>0){ FC(0xffffff,.75*flash,x2,y2,tr*1.1*flash+3); for(const q of sparks){ const d=tr*(.8+q.s*(1.6-flash)); g.lineStyle(2*k,col,.9*flash); g.lineBetween?.(x2+Math.cos(q.a)*d*.5,y2+Math.sin(q.a)*d*.5,x2+Math.cos(q.a)*d,y2+Math.sin(q.a)*d); } } }
      if(!strike){ FC(col,.35*fade,x1,y1,7*k); FC(0xffffff,.8*fade,x1,y1,2.5*k); } };
    if(!strike)this.taroZapAt?.(x2,y2);
    build(); paint(.45); const on=this.time?.delayedCall&&(typeof CODE_VFX==='undefined'||CODE_VFX.bolt);
    if(on){ this.time.delayedCall(40,()=>paint(1,1)); this.time.delayedCall(85,()=>{ build(); paint(1,.6); }); this.time.delayedCall(140,()=>{ build(); paint(1,.25,.75); }); if(arc)this.time.delayedCall(220,()=>paint(1,0,.45)); } else paint(1,1);
    return this.taroTrackVisual(g,big?.36:strike?.28:arc?.32:.24);
  }
  taroUpdateVisuals(){const t=this._taro;if(!t?.enabled||this.state!=='play')return;
    for(const fx of t.fx){if(fx._taroSuspended){fx._taroSuspended=false;fx.setVisible(true);}if(fx._taroFuse?.active){const left=Math.max(0,Math.min(1,(fx._taroBombAt-t.time)/.45)),g=fx._taroFuse;g.clear();g.lineStyle(4,0x241c38,1);g.strokeCircle(0,0,24);g.lineStyle(2,0xd9bfff,1);g.beginPath();g.arc(0,0,24,-Math.PI/2,-Math.PI/2+Math.PI*2*left);g.strokePath();}}
    if(t.sweep&&t.time>=(t.trailAt||0)){t.trailAt=t.time+.07;if(this.taroVisualBudget()){const g=this.camWorld(this.add.graphics().setPosition(this.player.x,this.player.y).setRotation(Math.atan2(t.sweep.direction.y,t.sweep.direction.x)).setDepth(6));g.lineStyle(3,0xa9e8ee,.8);g.lineBetween(-18,-12,-5,0);g.lineBetween(-5,0,-18,12);this.taroTrackVisual(g,.12);}}
  }
  taroAreaHit(origin,radius,damage,kind,meta={}){
    const candidates=this.taroCandidates(origin,radius);this.taroRing(origin.x,origin.y,radius);if(!candidates.length)return false;
    for(const token of candidates){if(!taroTargetValid(token,origin,radius))continue;this.taroDealDamage(token,damage,kind,meta);}
    return true;
  }
  taroTryNova(){
    const t=this._taro;if(!t?.enabled||t.path!=='tempest'||t.charge<100||t.time<t.novaAt||this.state!=='play')return;
    const f=this.taroTempestProfile(),origin={x:this.player.x,y:this.player.y};if(!this.taroCandidates(origin,f.novaRadius).length)return;
    t.charge=0;t.novaAt=t.time+1.5;this.taroAreaHit(origin,f.novaRadius,f.unitD*1.4*f.extraStrikeBonus,'nova');
  }
  // POST_UPDATE runs after Arcade World.postUpdate copies collision-resolved body positions.
  // The previous frame's command owns this displacement, not the newly issued command.
  taroPostPhysics(){
    const t=this._taro;if(!t?.enabled||t.path!=='tempest')return;const p=this.player,wallDt=this._taroWallDt;
    if(this.state!=='play'||!p?.active||!(p.hp>0)||wallDt<=0||wallDt>.1||!Number.isFinite(wallDt)){this.suspendTaroCombat();return;}
    const dt=Math.min(.05,wallDt)*(this.gameSpeed||1),v=p.body?.velocity||{x:0,y:0},m=t.motion;
    const forced=!!(m&&Math.hypot((this._taroFrameVelocity?.x??v.x)-m.vx,(this._taroFrameVelocity?.y??v.y)-m.vy)>4),point={x:p.x,y:p.y};
    const result=taroMovementSample(t.sample,point,{playing:true,intentional:!!m?.intentional,intentX:m?.ix,intentY:m?.iy,maxSpeed:m?.speed||0,dt,dashing:!!(m?.dashing||this.dashTime>0||t.sweep),forced});
    t.charge=Math.min(100,t.charge+result.chargeGain);t.sample=result.sample;
    const sweep=t.sweep;
    if(sweep){
      const dx=p.x-sweep.from.x,dy=p.y-sweep.from.y,len=Math.hypot(dx,dy),along=dx*sweep.direction.x+dy*sweep.direction.y;
      if(!forced&&len>0&&len<=560*dt*1.25+2&&along>=len*.5&&t.time<=sweep.until+dt){
        const candidates=this.taroCandidates(point,len+32).filter(token=>!sweep.hit.has(token.id)&&taroSegmentDistance(token.enemy,sweep.from,point)<=32);
        for(const token of candidates){sweep.hit.add(token.id);if(this.taroDealDamage(token,sweep.damage,'sweep',{attackId:sweep.attackId})&&taroTargetValid(token,point,Infinity)&&!token.enemy.isBoss&&!token.enemy.isMini&&!token.enemy.isElite){token.enemy.frozen=Math.max(token.enemy.frozen||0,.35);token.enemy.setVelocity?.(0,0);}}
      }
      sweep.from=point;if(t.time>=sweep.until||this.dashTime<=0||forced)t.sweep=null;
    }
    if(this._taro!==t||this.state!=='play'){this.suspendTaroCombat();return;}
    t.motion={vx:v.x,vy:v.y,speed:Math.hypot(v.x,v.y),ix:this.joy?.dx||0,iy:this.joy?.dy||0,intentional:!!(this.joy?.active&&Math.abs(this.joy.dx)+Math.abs(this.joy.dy)>.12),dashing:this.dashTime>0};
    this.taroTryNova();this.drawTaroCharge();
  }
  drawTaroCharge(){
    const t=this._taro;if(!t?.enabled||this.state!=='play')return;
    if(!t.hud){const g=this.camWorld(this.add.container(0,0).setDepth(99000)),plate=this.add.rectangle(0,8,82,20,0x241c38,.94).setStrokeStyle(1,0xb997dd,.9),bar=this.add.rectangle(-36,13,0,4,0xa9e8ee).setOrigin(0,.5),label=this.add.text(0,2,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#eee1ff'}).setOrigin(.5);g.add([plate,bar,label]);g._bar=bar;g._label=label;t.hud=g;t.fx.add(g);}
    const charge=Math.max(0,Math.min(100,t.charge)),ready=charge>=100;
    const zoom=Math.max(.4,this.cameras?.main?.zoom||1);t.hud.setScale(1/zoom).setVisible(true).setPosition(this.player.x,this.player.y-66/zoom);t.hud._bar.width=72*charge/100;t.hud._bar.setFillStyle(ready?0xffda89:0xa9e8ee);t.hud._label.setText(ready?'READY':'STATIC '+Math.floor(charge)+'%');
    if(ready&&!t.readyShown)this.taroSound('ready');t.readyShown=ready;
  }

  taroChargeGain(n,dmg){ const MAX=10; this._taroCharge=Math.min(MAX,(this._taroCharge||0)+n);
    if(n>0&&this.player)this.floatText?.(this.player.x,this.player.y-58,'⚡'+this._taroCharge+'/'+MAX,this._taroCharge>=MAX?0xffe14d:0x9fd8ff);
    if(this._taroCharge<MAX)return; let tgt=null; this.enemies.children.iterate(e=>{ if(e&&e.active&&(e.isBoss||e.isMini)&&(!tgt||e.isBoss))tgt=e; });
    if(!tgt)return; this._taroCharge=0;
    for(let k=0;k<3;k++)this.time.delayedCall(k*70,()=>{ if(tgt.active)this.zap(tgt.x+Phaser.Math.Between(-18,18),tgt.y); });
    this.damage(tgt,dmg*6,tgt.x,tgt.y); this.screenShake(220,0.012); this.screenFlash?.(0xfff3a0,0.35,160); this.hitStop?.(60);
    this.showBanner('⚡ Judgment Bolt!','Storm Charge unleashed',1100); }
  // v4.89.2: Candy Shell — ใช้โล่ 1 ชั้น (กระสุน+ชน) + ฟองแตกให้เห็น
  consumeShell(){ if(!((this._shield||0)>0))return false; this._shield--; const p=this.player; p.iframe=0.6; this.time.delayedCall(0,()=>this.fireRecipes('shield'));
    this.floatText(p.x,p.y-44,'🫧 Blocked!',0x9fe8ff); this.screenFlash(0x9fe8ff,0.18,160); Sfx.pick?.();
    const r=this.camWorld(this.add.circle(p.x,p.y,34,0x9fe8ff,0.25).setStrokeStyle(4,0xdff8ff,0.95).setDepth(96000));
    this.tweens.add({targets:r,scale:2.2,alpha:0,duration:320,ease:'Cubic.out',onComplete:()=>r.destroy()});
    return true; }
  // ฟองโล่รอบตัววาดทุกเฟรม (หนาขึ้นตามจำนวนชั้น)
  drawShellBubble(){ const n=this._shield||0,p=this.player;
    const cb=this.codeBubbleOn?.(),sk=cb?'code_bubble':'vfx_shell_bubble';
    if(this.textures.exists(sk)){
      if(this._shellG)this._shellG.clear();
      if(!n||!p||this.state==='menu'){if(this._shellArt)this._shellArt.setVisible(false);return;}
      if(this._shellArt?.active&&(this._shellArt.texture?.key??sk)!==sk){this._shellArt.destroy();this._shellArt=null;}
      if(!this._shellArt||!this._shellArt.active)this._shellArt=this.trackArtVfx(this.camWorld(this.add.image(p.x,p.y,sk).setDepth(95500)));
      const r=36+Math.sin((this.elapsed||0)*5)*2.5+Math.min(3,n-1)*2,wb=cb?Math.sin((this.elapsed||0)*7)*.04:0,sz=cb?r*2.15:r*2.5;
      this._shellArt.setVisible(true).setPosition(p.x,p.y).setDisplaySize(sz*(1+wb),sz*(1-wb)).setAlpha(cb?Math.min(.85,.6+n*.08):Math.min(0.55,0.32+n*0.07));return;
    }
    if(!this._shellG){ if(!n)return; this._shellG=this.camWorld(this.add.graphics().setDepth(95500)); }
    const g=this._shellG; g.clear(); if(!n||!p||this.state==='menu')return;
    const t=this.elapsed||0,r=36+Math.sin(t*5)*2.5;
    g.fillStyle(0x9fe8ff,0.16).fillCircle(p.x,p.y,r);
    g.lineStyle(3,0xdff8ff,0.85).strokeCircle(p.x,p.y,r);
    if(n>1)g.lineStyle(2,0x9fe8ff,0.7).strokeCircle(p.x,p.y,r+6);
    g.fillStyle(0xffffff,0.7).fillCircle(p.x-r*0.45,p.y-r*0.5,4); }
  // ===== v5.36 🍳 Flavor Recipes runtime: fireRecipes(trigger) → effect · chain ลึกสุด 2 · จำกัด 8 ครั้ง/วิ =====
  frInit(){ const rs=frActive();
    this._fr=rs.map(r=>({t:r.t.slice(2),e:r.e.slice(2),m:r.m?r.m.slice(2):null,n:0,next:0,tl:FR_SIMPLE?1:Save.frLv(r.t),el:FR_SIMPLE?1:Save.frLv(r.e),sig:!!frSignature(r)})); this._frBusy=0; this._frBudget=0; this._frSec=0;
    this._frRageT=0; this._frHasteT=0; this._frRageCd=0; this._frHasteCd=0; this._frZones=[]; this._frTimer=0; this._frTimer10=0; this._frStill=0; this._frLowArm=true; this._frMoveT=0; this._frFullT=0; this._frSurT=0; this._frMk=[]; this._frBigWas=false; if(this._frOrbit&&this._frOrbit.sprs)this._frOrbit.sprs.forEach(x=>x.destroy()); this._frOrbit=null; if(this._frBuddy&&this._frBuddy.spr)this._frBuddy.spr.destroy(); this._frBuddy=null; }
  fireRecipes(trig){ const L=this._fr; if(!L||!L.length||this.state!=='play')return;
    const depth=this._frBusy||0; if(depth>0&&!(this._frCur&&this._frCur.m==='chain'))return; if(depth>=2)return;   // chain เฉพาะสูตรที่มี 🔗 Linked
    const now=this.elapsed||0; if(Math.floor(now)!==this._frSec){ this._frSec=Math.floor(now); this._frBudget=0; }
    for(const r of L){ if(r.t!==trig||(this.taroIsSecondary?.()&&!['heal','recover','shield','immune','cdr','vacuum','haste','cleanse'].includes(r.e)))continue; const td=FR_TRIGGERS.find(x=>x.id===trig)||{};
      if(trig==='kill10'||trig==='kill25'||trig==='xp20'){ r.n++; const need=(trig==='kill10'?10:trig==='kill25'?25:20)*(r.m==='faster'?0.7:1)*(1-0.15*((r.tl||1)-1)); if(r.n<need)continue; r.n=0; }
      const icd=(td.icd||0.25)*(r.m==='faster'&&td.icd?0.7:1)*(td.icd?1-0.15*((r.tl||1)-1):1); if(now<r.next||this._frBudget>=8)continue; r.next=now+icd; this._frBudget++;
      if(r.m==='slow'){ this.time.delayedCall(1500,this.taroCarryContext(()=>{ if(this.state==='play')this.frRun(r,depth); })); continue; }
      this.frRun(r,depth); if(r.m==='repeat'||r.m==='twin')this.time.delayedCall(r.m==='twin'?90:500,this.taroCarryContext(()=>{ if(this.state==='play')this.frRun(r,depth); })); } }
  // v6.55.67 เจ้าของ: heal/dash on hit = อมตะ → เพดานฮีลรวมจากสูตร 5% maxHP ต่อ 2 วิ · shield/immune ใช้ cooldown ร่วม 4 วิ
  frHealCap(n){ const p=this.player,now=this.elapsed||0; if(now-(this._frHealWin||-9)>=2){ this._frHealWin=now; this._frHealSum=0; } const room=Math.floor(p.maxhp*0.05)-(this._frHealSum||0); const g=Math.max(0,Math.min(n,room)); this._frHealSum=(this._frHealSum||0)+g; return g; }
  frGuardOk(){ const now=this.elapsed||0; if(now<(this._frGuardAt||0))return false; this._frGuardAt=now+4; return true; }
  frRun(r,depth){ const prev=this._frCur; this._frCur=r; this._frBusy=depth+1; Sfx.recipe();
    // 🎬 ป้ายสูตรเด้งเหนือหัว: ไอคอน trigger ▸ effect (จำกัด 1 ป้าย/0.3 วิ ต่อสูตร)
    const now=this.elapsed||0; if(now-(r._popAt||-9)>0.3){ r._popAt=now; const td=FR_TRIGGERS.find(x=>x.id===r.t),ed=FR_EFFECTS.find(x=>x.id===r.e),p=this.player;
      const t=this.camWorld(this.add.text(p.x,p.y-58,(td?td.emoji:'')+'▸'+(ed?ed.emoji:''),{fontSize:'16px',stroke:'#2a1f35',strokeThickness:3}).setOrigin(0.5).setDepth(99000).setScale(0.4));
      this.tweens.add({targets:t,scale:1,duration:140,ease:'Back.out'}); this.tweens.add({targets:t,y:t.y-26,alpha:0,delay:260,duration:420,onComplete:()=>t.destroy()}); }
    try{ this.frEffect(r); } finally{ this._frBusy=depth; this._frCur=prev; } }
  frHit(e,dmg,r){ if(!e||!e.active)return; this._frDmg=true; try{ this.damage(e,dmg,e.x,e.y); } finally{ this._frDmg=false; } if(!e.active)return;
    if(r.m==='fire')this.applyBurn(e,dmg*0.25,dmg*0.25);
    if(r.m==='ice'&&!e.isBoss&&!e.isMini&&(this.elapsed||0)>=(e._frIceAt||0)){ e._frIceAt=(this.elapsed||0)+3; this.applyFreeze(e,0.6); }
    if(r.m==='sour')e._sourT=Math.max(e._sourT||0,3);
    if(r.m==='sweet'){ const p=this.player,now=this.elapsed||0; if(now-(this._frSweetWin||-9)>=1){ this._frSweetWin=now; this._frSweetSum=0; } if(this._frSweetSum<p.maxhp*0.05){ const n=Math.max(1,Math.round(p.maxhp*0.01)); this._frSweetSum+=n; p.hp=Math.min(p.maxhp,p.hp+n); } } }
  frRing(x,y,R,col,key='vfx_recipe_shock'){
    if(this.textures.exists(key)){
      const g=this.trackArtVfx(this.camWorld(this.add.image(x,y,key).setDisplaySize(R*2.5,R*2.5).setDepth(90000).setAlpha(0.75))),sx=g.scaleX,sy=g.scaleY;
      g.setScale(sx*0.3,sy*0.3);this.tweens.add({targets:g,scaleX:sx,scaleY:sy,alpha:0,duration:360,ease:'Cubic.out',onComplete:()=>g.destroy()});return;
    }
    const g=this.trackArtVfx(this.camWorld(this.add.circle(x,y,R,col,0.16).setStrokeStyle(5,col,0.9).setDepth(90000).setScale(0.3)));this.tweens.add({targets:g,scale:1,alpha:0,duration:360,ease:'Cubic.out',onComplete:()=>g.destroy()});
  }
  recipeZoneArt(key,x,y,R,col,pull=false){
    if(this.textures.exists(key)){
      const g=this.trackArtVfx(this.camWorld(this.add.image(x,y,key).setDisplaySize(R*2.5,R*2.5).setDepth(-99000).setAlpha(0.6)));
      if(!pull)this.tweens.add({targets:g,alpha:{from:0.45,to:0.65},yoyo:true,repeat:-1,duration:450});return g;
    }
    return this.trackArtVfx(this.camWorld(this.add.circle(x,y,pull?R*0.5:R,col,0.22).setStrokeStyle(3,col,0.8).setDepth(-99000)));
  }
  recipeIcon(key,x,y,size,fallback){
    const o=this.textures.exists(key)?this.add.image(x,y,key).setDisplaySize(size,size):this.add.text(x,y,fallback,{fontSize:size+'px'});
    return this.trackArtVfx(this.camWorld(o.setOrigin(0.5).setDepth(95000)));
  }
  frEffect(r){ const p=this.player,px=p.x,py=p.y; let pw=(r.m==='strong'?1.5:r.m==='focus'?1.8:r.m==='slow'?1.8:r.m==='twin'?0.65:1)*(1+0.3*((r.el||1)-1))*(r.sig?1.25:1); const A=r.m==='big'?1.5:r.m==='focus'?0.6:1;
    if(r.m==='gamble'){ if(Math.random()<0.5){ this.floatText(px,py-50,'🎲 …nothing',0x9a8fb0); return; } pw*=2.5; this.floatText(px,py-50,'🎲 JACKPOT ×2.5',0xffd166); }
    pw=Math.min(pw,2.5);   // v6.69 เพดานพลังรวม
    const near=(R)=>{ const out=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,px,py)<=R)out.push(e); }); return out; };
    switch(r.e){
      case 'shock':{ const R=120*A; this.frRing(px,py,R,0xffc0e0,'vfx_recipe_shock'); near(R).forEach(e=>this.frHit(e,this.relicDmg(1.8)*pw,r)); break; }
      case 'shots':{ for(let i=0;i<8;i++){ const b=this.getBullet(px,py,0xffffff,0.2*A); if(!b)continue; b.setTexture('proj_sprinkle').setTint(r.m==='fire'?0xff7a3d:r.m==='ice'?0x9fe8ff:0xffd166); b.dmg=this.relicDmg(0.9)*pw; b.frShot=true; b.life=1.1; b.homing=0; b.faceVel=true; this.physics.velocityFromRotation(i/8*Math.PI*2,520,b.body.velocity); } break; }
      case 'heal':{ const n=this.frHealCap(Math.round(p.maxhp*0.02*pw*(p.healEffect||1))); if(n<=0)break; p.hp=Math.min(p.maxhp,p.hp+n); this.popHeal(px,py,n); this.fireRecipes('heal'); break; }
      case 'recover':{ const n=this.frHealCap(Math.round(p.maxhp*0.12*pw*(p.healEffect||1))); if(n<=0)break;p.hp=Math.min(p.maxhp,p.hp+n);this.popHeal(px,py,n);this.fireRecipes('heal');break; }
      case 'burst':{ const R=165*A;this.frRing(px,py,R,0xffd166,'vfx_recipe_burst');near(R).slice(0,16).forEach(e=>this.frHit(e,this.relicDmg(1.4)*pw,r));break; }
      case 'shield':{ if(!this.frGuardOk())break; this._shield=Math.min(3,(this._shield||0)+(pw>=2?2:1)); this.floatText(px,py-44,'🫧 Shield',0x9fe8ff); break; }
      case 'freeze':{ const R=140*A; this.frRing(px,py,R,0x9fe8ff,'vfx_recipe_freeze'); near(R).forEach(e=>{ if(this.applyFreeze(e,1.2*pw)){ e.setVelocity(0,0); } else this.frHit(e,this.relicDmg(0.8)*pw,r); }); break; }
      case 'rage':{ const nw=this.elapsed||0; if(nw<(this._frRageCd||0))break; this._frRageCd=nw+8; this._frRageT=4; this._frRageMul=Math.max(this._frRageMul&&this._frRageT>0?this._frRageMul:1,1+0.3*pw); this.floatText(px,py-50,'🔥 Rage',0xff7a3d); break; }
      case 'bolt':{ const L=near(360*A).sort((a,b)=>this.dist(a.x,a.y,px,py)-this.dist(b.x,b.y,px,py)).slice(0,3);
        L.forEach(e=>{ const ln=this.camWorld(this.add.line(0,0,px,py-20,e.x,e.y,0xfff27a,1).setOrigin(0,0).setLineWidth(3).setDepth(90000)); this.tweens.add({targets:ln,alpha:0,duration:200,onComplete:()=>ln.destroy()}); this.frHit(e,this.relicDmg(1.6)*pw,r); }); break; }
      case 'cdr':{ this.uniqueCd=Math.max(0,(this.uniqueCd||0)-2*pw); this.floatText(px,py-50,'⏳ −'+(2*pw).toFixed(1)+'s',0xc7a6ff); break; }
      case 'vacuum':{ this.orbs.children.iterate(o=>{ if(o&&o.active){ const a=Math.atan2(py-o.y,px-o.x); o.setVelocity(Math.cos(a)*520,Math.sin(a)*520); o._vac=true; } }); break; }
      case 'burn':{ const R=90*A,z=this.recipeZoneArt('vfx_recipe_burn',px,py,R,0xff5a3d); this._frZones.push({x:px,y:py,R,t:3,acc:0,dmg:this.relicDmg(0.5)*pw,r,spr:z}); break; }
      case 'buddy':{ const B=this._frBuddy; if(B){ B.t=Math.max(B.t,5*pw); B.pw=Math.max(B.pw,pw); B.r=r; } else { const spr=this.recipeIcon('vfx_recipe_buddy',px,py,42,'🍡'); this._frBuddy={t:5*pw,pw,r,acc:0,ang:0,spr}; } break; }
      case 'immune':{ if(!this.frGuardOk())break; p.iframe=Math.max(p.iframe||0,1); this.frRing(px,py,40,0xffffff,'vfx_recipe_immune'); this.floatText(px,py-50,'🛡️ Immune',0xffffff); break; }
      case 'meteor':{ const L=near(420).sort(()=>Math.random()-0.5).slice(0,3); if(!L.length)L.push({x:px+Phaser.Math.Between(-120,120),y:py+Phaser.Math.Between(-120,120)});
        L.forEach((t,i)=>{ const tx=t.x,ty=t.y,R=70*A,epoch=this._artEpoch||0;
          const warn=this.recipeZoneArt('vfx_recipe_shock',tx,ty,R,0xff9ad5,true).setAlpha(0.25);
          const m=this.recipeIcon('vfx_recipe_meteor',tx,ty-260,64,'☄️').setOrigin(0.5,0.75).setDepth(96000);
          this.tweens.add({targets:m,y:ty,duration:420,delay:i*120,ease:'Quad.in',onComplete:()=>{ m.destroy(); warn.destroy();
            if((this._artEpoch||0)!==epoch||(this.state!=='play'&&this.state!=='levelup'))return;
            this.frRing(tx,ty,R,0xff9ad5,'vfx_recipe_shock'); this.screenShake(80,0.004);
            this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,tx,ty)<=R)this.frHit(e,this.relicDmg(2.2)*pw,r); }); }}); }); break; }
      case 'orbit':{ const O=this._frOrbit; if(O){ O.t=Math.max(O.t,4*pw); O.pw=Math.max(O.pw,pw); O.r=r; } else { const sprs=[0,1,2].map(()=>this.recipeIcon('vfx_recipe_orbit',px,py,32,'🍭')); this._frOrbit={t:4*pw,pw,r,ang:0,acc:0,sprs,R:70*A}; } break; }
      case 'haste':{ const nw=this.elapsed||0; if(nw<(this._frHasteCd||0))break; this._frHasteCd=nw+8; this._frHasteT=4; this.floatText(px,py-50,'👟 Haste',0x8bd3a0); break; }
      case 'sour':{ const R=150*A; this.frRing(px,py,R,0xfff27a,'vfx_recipe_sour'); near(R).slice(0,12).forEach(e=>{ e._sourT=Math.max(e._sourT||0,5*pw); this.frHit(e,this.relicDmg(0.6)*pw,r); }); break; }
      case 'cleanse':{ const R=220*A; let n=0; if(this.foeBullets)this.foeBullets.children.iterate(b=>{ if(b&&b.active&&this.dist(b.x,b.y,px,py)<=R){ b.setActive(false).setVisible(false); if(b.body)b.body.enable=false; n++; } }); this.frRing(px,py,R,0xe8f4ff,'vfx_recipe_cleanse'); if(n)this.floatText(px,py-50,'🧽 ×'+n,0xe8f4ff); break; }
      case 'hole':{ const e0=this.nearestEnemy?this.nearestEnemy(360):null,hx=e0?e0.x:px,hy=e0?e0.y:py,R=160*A,z=this.recipeZoneArt('vfx_recipe_hole',hx,hy,R,0x7a3dbf,true); this.tweens.add({targets:z,angle:360,duration:2000}); this._frZones.push({x:hx,y:hy,R,t:2,acc:0,dmg:this.relicDmg(0.45)*pw,r,spr:z,pull:true}); break; }
    } }
  // Citrus Companions: one owned actor, bounded shots/zones, no extra physics bodies.
  clearYuzuSeeds(){for(const q of this._yzSeeds||[]){q.spr?.destroy();q.shadow?.destroy();}this._yzSeeds=[];}
  clearYuzuCrew(){this.clearYuzuBuff();this.clearYuzuSkillFx();this.clearYuzuSeeds();
    for(const m of this._yuzuCrew||[])for(const o of [m.spr,m.label,m.bar,m.shadow,m.formBadge])o?.destroy();
    for(const o of [...(this._yzShots||[]),...(this._yzZones||[]),...(this._yzFx||[])])o.spr?.destroy();
    this._yuzuCrew=[];this._yzShots=[];this._yzZones=[];this._yzFx=[];this._yzShield=null;this._yzHitOwner=null;this._yzForceCrit=false;this._yzRain=null;this._yzInfusion=null;this._yzSeedCd=0;this._yzTrailAt=-10;this._yuzuOrch=null;this._yuzuParadeT=0;this._yzMark=null;this._yzUnlockMiss=0;this._yzMarkG?.destroy?.();this._yzMarkG=null;
  }

  clearYuzuSkillFx(){for(const q of this._yzShow||[])q.spr?.destroy();this._yzShow=[];this._yzShowFlavor=0;}
  yuzuOutlineKey(kind,opt={}){
    const k=opt.key||'',row=Math.floor((opt.start||0)/4),a=k==='yz_54_pomelo'?['peel','peel']:k==='yz_54_lime'?['volley','trap','pierce']:k==='yz_54_bloodorange'||k==='yz_bo96_arsenal'?['sigil','comet','sigil','bloom','honey']:null;
    const clip=a?a[row]:k==='yz_51_pomelo'?(row?'slam':'guardian'):k==='yz_51_lime'?(row?'pierce':'volley'):k==='yz_51_bloodorange'||k==='yz_bo96_unique'?(row?'bloom':'honey'):({slam:'slam',peel:'peel',volley:'volley',rain:'trap',sweet:'honey',sour:'sigil',spicy:'bloom',roll:'roll'})[kind];
    const next=clip&&'bpx_yuzu810_'+clip;return next&&this.realTex?.(next)?next:null;
  }
  yuzuSkillFx(kind,x,y,size,angle=0,opt={}){
    const settings=typeof Save==='undefined'?{}:Save.data?.settings||{};
    if(settings.vfx===0&&!opt.essential||this.character!=='yuzu')return null;
    const outline=this.yuzuOutlineKey?.(kind,opt),key=outline||opt.key||'yz_49_'+kind;if(!this.textures.exists(key))return null;if(outline)opt={...opt,start:0,frames:6,hold:null};
    const L=this._yzShow||(this._yzShow=[]);if(L.length>=4){let i=opt.important?L.findIndex(q=>!q.important):-1;if(i<0&&opt.finisher)i=0;if(i<0)return null;L[i].spr.destroy();L.splice(i,1);}
    if(!this._yzShowHook&&this.events?.once){this._yzShowHook=true;this.events.once('shutdown',()=>{this.clearYuzuSkillFx();this._yzShowHook=false;});}
    const red=this.hubMotionAllowed?.()===false||settings.vfx===0,cone=outline?/_(?:volley|pierce)$/.test(outline):kind==='volley'||kind==='spicy',life=red?Math.min(.35,opt.life||.55):opt.life||.55,start=opt.start||0,frames=opt.frames||4,hold=Number.isInteger(opt.hold)?opt.hold:null;
    const alpha=opt.alpha==null?(size>250?.5:.68):Math.max(0,Math.min(.95,opt.alpha));
    const spr=this.camWorld(this.add.sprite(x,y,key,start+(hold??(red?2:0))).setOrigin(cone?.22:.5,.5).setDisplaySize(Math.min(420,size),Math.min(420,size)).setRotation(angle).setAlpha(alpha).setDepth(opt.ground?4:y+5));
    if(opt.tint!=null)spr.setTint(opt.tint);spr.setBlendMode?.(0);
    const q={spr,t:0,life,red,start,frames,hold,buff:opt.buff||null,important:!!opt.important,ground:!!opt.ground,alpha,player:this.player,basic:this.basicAttack,epoch:this._artEpoch||0,follow:opt.follow||null,followId:opt.follow?.spr?._yzSpawnId};L.push(q);return q;
  }
  yuzuTickSkillFx(dt){
    if(this.state==='menu'||this.state==='dead'){this.clearYuzuSkillFx();return;}
    if(this.state!=='play')return;
    const L=this._yzShow||[];for(let i=L.length-1;i>=0;i--){const q=L[i];
      const bad=q.spr?.active===false||this.character!=='yuzu'||this.player!==q.player||q.player?.active===false||this.basicAttack!==q.basic||(this._artEpoch||0)!==q.epoch||q.buff&&(this._yzBuff!==q.buff||!this.yuzuBuffValid(q.buff))||q.follow&&(q.follow.spr?.active===false||q.followId!=null&&q.follow.spr?._yzSpawnId!==q.followId);
      if(!bad){q.t+=Math.max(0,dt);if(q.follow){const p=q.follow==='player'?this.player:q.follow.spr;q.spr.setPosition(p.x,p.y);if(!q.ground)q.spr.setDepth(p.y+5);}
        if(!q.red&&q.hold==null)q.spr.setFrame((q.start||0)+Math.min((q.frames||4)-1,Math.floor(q.t/q.life*(q.frames||4))));q.spr.setAlpha(q.alpha*Math.min(1,Math.max(0,(q.life-q.t)/Math.min(.16,q.life*.4))));}
      if(bad||q.t>=q.life){q.spr.destroy();L.splice(i,1);}
    }
  }

  yuzuFx(kind,x,y,size,life=.5,follow=null){
    const key='yz_fx_'+kind;if(!this.textures.exists(key))return null;const L=this._yzFx||(this._yzFx=[]);if(L.length>=8){const old=L.shift();old.spr.destroy();}
    const spr=this.camWorld(this.add.sprite(x,y,key,0).setDisplaySize(size,size).setAlpha(.62).setDepth(follow?95001:5));const frames=Math.max(1,(this.textures.get?.(key)?.frameTotal||5)-1);
    const red=typeof Save!=='undefined'&&(Save.data?.settings?.reducedMotion||Save.data?.settings?.vfx===0);
    const q={spr,t:0,life,follow,frames,red,cycle:kind==='shield'||kind==='infusion'};
    L.push(q);return q;
  }
  yuzuTickFx(dt){
    if(this.state&&this.state!=='play')return;
    this.yuzuTickSkillFx(dt);const L=this._yzFx||[];
    for(let i=L.length-1;i>=0;i--){const q=L[i];
      if(q.evolve){
        const bad=this.character!=='yuzu'||this._yuzuCrew?.[0]!==q.owner||q.owner.spr?.active===false||this.player!==q.player||q.player?.active===false||this.basicAttack!==q.basic||(this._artEpoch||0)!==q.epoch||q.spr.active===false;
        if(bad){q.spr.destroy();L.splice(i,1);continue;}
        q.t+=Math.max(0,dt);q.spr.setPosition(q.owner.spr.x,q.owner.spr.y).setDepth(q.owner.spr.y+5);
        q.spr.setFrame(q.red?4:Math.min(7,Math.floor(q.t/q.life*8))).setAlpha(.85*Math.min(1,Math.max(0,(q.life-q.t)/.12)));
      }else{q.t+=dt;if(q.follow){q.spr.setPosition(this.player.x,this.player.y);if(q.follow==='shield'&&!this._yzShield)q.t=q.life;}if(q.staticFrame)q.spr.setAlpha(.7*Math.max(0,1-q.t/q.life));else {
          const frames=q.frames||4;
          let index=Math.min(3,Math.floor(q.t*8)%4);
          if(q.red)index=Math.min(2,frames-1);
          else if(q.frames)index=q.cycle?Math.floor(q.t*frames*2)%frames:Math.min(frames-1,Math.floor(q.t/q.life*frames));
          q.spr.setFrame(index);
        }}
      if(q.t>=q.life){q.spr.destroy();L.splice(i,1);}
    }
  }
  yuzuSound(name,gap=.2,volume=.4){return Sfx.bp?.('yz_'+name,volume,gap)||false;}
  yuzuKind(){return ({citrusGuardian:'pomelo',zestSwarm:'lime',juiceWorkshop:'bloodorange'})[this.basicAttack?.path]||'yuzling';}
  yuzuTalent(k){return this.player?._pt?.['yz'+k]||0;}
  yuzuRank(k){return this.basicAttack?.lv?.[k]||0;}

  // Presentation-only: one shared four-sprite budget; finishers replace incidental accents.
  yuzuEmpowerFx(kind,phase,x,y,size,angle=0,opt={}){
    if(kind==='yuzling')return null;
    const painted=kind==='bloodorange'&&this.textures.exists('yz_bo96_unique');
    return this.yuzuSkillFx('empower',x,y,size,angle,{...opt,alpha:painted?(size>250?.82:.9):opt.alpha,buff:phase==='open'?this._yzBuff:null,key:painted?'yz_bo96_unique':'yz_51_'+kind,start:phase==='finish'?4:0,finisher:phase==='finish',important:phase==='finish'||!!opt.important});
  }
  yuzuBuffArt(u,dt){
    u.artWait=(u.artWait??.9)-dt;
    const m=u.m,angle=m.kind==='lime'?m.aim||0:0;
    if(u.t>0&&u.t<=.6&&!u.finishCue){u.finishCue=true;this.yuzuEmpowerFx(m.kind,'open',m.spr.x,m.spr.y,135,angle,{life:.5,hold:1,follow:m,important:true});this.yuzuSound(m.kind==='lime'?'arrow':'grow',.5,.22);}
    else if(u.t>.6&&u.artWait<=0){u.artWait=1.2;this.yuzuEmpowerFx(m.kind,'open',m.spr.x,m.spr.y,105,angle,{life:.4,hold:2,follow:m});
      const e=m.target;if(m.kind==='lime'&&this.yuzuCombatTarget(e)&&this.yuzuEnemyPriority(e)>0)this.yuzuSkillFx('rain',e.x,e.y,60,0,{life:.3,hold:2,ground:true,follow:{spr:e}});}
  }
  yuzuImpactFx(m,e,source){
    if(!m||!['sweep','bite','arrow','twinArrow','focus_arrow'].includes(source))return;
    const now=this.elapsed||0;if(now-(m.hitArtAt??-10)<.14)return;m.hitArtAt=now;
    this.yuzuSkillFx(m.kind==='pomelo'?'peel':m.kind==='lime'?'rain':'spicy',e.x,e.y,m.kind==='pomelo'?74:52,0,{life:.22,hold:1});
    Sfx.bp?.(m.kind==='pomelo'?'pow_thud':'pow_pop',.12,.18);
  }

  yuzuActionValid(m,a){return this.character==='yuzu'&&this._yuzuCrew?.[0]===m&&this.player===a.player&&a.player?.active!==false&&this.basicAttack===a.basic&&(this._artEpoch||0)===a.epoch&&this.yuzuKind()===m.kind;}
  yuzuBeginAction(m,kind,release,target=null,period=1){
    if(m.action||m.motion||m.lunge)return false;
    const timing=({arrow:[.16,.2],volley:[.26,.3],trap:[.2,.18],sigil:[.24,.22],comet:[.4,.25],garden:[.34,.25],bloom:[.38,.25],honey:[.28,.2],vault:[.24,.22],pin:[.22,.28],breaker:[.3,.26]})[kind]||[.18,.2],tempo=Math.max(.35,Math.min(1,period/(timing[0]+timing[1])))*this.yuzuFormTempo(m);
    const angle=target?Math.atan2(target.y-m.spr.y,target.x-m.spr.x):m.aim||0;
    m.action={kind,t:0,wind:timing[0]*tempo,end:(timing[0]+timing[1])*tempo,release,fired:false,angle,player:this.player,basic:this.basicAttack,epoch:this._artEpoch||0};
    m.aim=angle;m.vx=m.vy=0;if(Math.abs(Math.cos(angle))>.1)m.spr.setFlipX(Math.cos(angle)<0);return true;
  }
  yuzuTickAction(m,dt){const a=m.action;if(!a)return false;if(!this.yuzuActionValid(m,a)||this.state==='menu'||this.state==='dead'){m.action=null;return false;}if(this.state!=='play')return true;a.t+=dt;
    if(!a.fired&&a.t>=a.wind){a.fired=true;a.release();if(!this.yuzuActionValid(m,a)){if(m.action===a)m.action=null;return true;}}
    if(a.t>=a.end&&m.action===a)m.action=null;return true;
  }
  yuzuPickTarget(m,dt){
    const p=this.player,reach=m.kind==='pomelo'?380:440,valid=e=>this.yuzuCombatTarget(e)&&this.dist(e.x,e.y,p.x,p.y)<(this.yuzuEnemyPriority(e)>0?720:500)&&this.dist(e.x,e.y,m.spr.x,m.spr.y)<(this.yuzuEnemyPriority(e)>0?800:reach+65);
    m.targetWait=Math.max(0,(m.targetWait||0)-dt);m.priorityWait=Math.max(0,(m.priorityWait||0)-dt);const old=m.target,oldOK=valid(old)&&old._yzSpawnId===m.targetId;
    if(m.priorityWait>0&&(oldOK||!old))return oldOK?old:null;
    let candidate=null,priority=-1,nearest=Infinity;for(const e of this.yuzuEnemies()){if(!valid(e))continue;const rank=this.yuzuFocusRank(e),distance=this.dist(e.x,e.y,m.spr.x,m.spr.y),score=distance+(e.hp/Math.max(1,e.maxhp||e.hp))*15;if(rank>priority||rank===priority&&score<nearest){priority=rank;nearest=score;candidate=e;}}
    const oldRank=oldOK?this.yuzuFocusRank(old):-1;
    const keep=oldOK&&oldRank>=priority&&(m.targetWait>0||!candidate||this.dist(old.x,old.y,m.spr.x,m.spr.y)<this.dist(candidate.x,candidate.y,m.spr.x,m.spr.y)*1.35);
    const next=keep?old:candidate;m.target=next;m.targetId=next?._yzSpawnId;m.priorityWait=.15;if(!keep)m.targetWait=.55;return next;
  }
  yuzuFormation(m,target){
    const p=this.player,px=p.x,py=p.y,dPlayer=this.dist(m.spr.x,m.spr.y,px,py);
    const priority=target&&this.yuzuEnemyPriority(target)>0;if(dPlayer>(priority?740:440)){m.returning=true;m.target=null;}if(m.returning&&dPlayer<110)m.returning=false;
    if(m.returning)return inMapPt(px-45,py+25);
    if(!target)return inMapPt(px-55,py+35);
    const a=Math.atan2(target.y-py,target.x-px),d=this.dist(m.spr.x,m.spr.y,target.x,target.y);
    if(m.kind==='pomelo'||m.kind==='yuzling'){
      const r=(target.body?.halfWidth||18)+35,b=Math.atan2(target.y-m.spr.y,target.x-m.spr.x);
      return inMapPt(target.x-Math.cos(b)*r,target.y-Math.sin(b)*r);
    }
    if(d<145)m.retreat=true;else if(d>215)m.retreat=false;
    if(m.retreat)return inMapPt(m.spr.x-Math.cos(Math.atan2(target.y-m.spr.y,target.x-m.spr.x))*90,m.spr.y-Math.sin(Math.atan2(target.y-m.spr.y,target.x-m.spr.x))*90);
    if(priority){const b=Math.atan2(target.y-m.spr.y,target.x-m.spr.x),reach=m.kind==='lime'?310:250;return d>reach+35?inMapPt(target.x-Math.cos(b)*reach,target.y-Math.sin(b)*reach):[m.spr.x,m.spr.y];}
    const tether=m.kind==='bloodorange'?155:240,max=m.kind==='bloodorange'?300:365;
    if(dPlayer>tether||d>max)return inMapPt(px-Math.cos(a)*(m.kind==='bloodorange'?65:90)+Math.sin(a)*35,py-Math.sin(a)*(m.kind==='bloodorange'?65:90)-Math.cos(a)*35);
    return [m.spr.x,m.spr.y];
  }
  yuzuAttackFx(frame,x,y,size,angle=0,life=.28){
    const outline=this.yuzuOutlineKey?.(frame===0?'peel':frame===3?'spicy':'volley');if(outline&&this.heroFxThrottle?.('yzSmall',3,120))return this.heroFx?.(outline,x,y,size,{rot:angle,depth:y+4,life,alpha:.7});
    if(!this.textures.exists('yz_47_attacks'))return;const L=this._yzFx||(this._yzFx=[]);if(L.length>=8)return;
    const spr=this.camWorld(this.add.sprite(x,y,'yz_47_attacks',frame).setDisplaySize(size,size).setRotation(angle).setAlpha(.7).setDepth(y+4));L.push({spr,t:0,life,staticFrame:true});
  }

  // Presentation only: positions remain the gameplay anchor used by targeting and collision.
  yuzuAnimate(m,dt,pose){
    const t=this.state==='play'?Math.max(0,Math.min(.1,dt||0)):0;
    const v=m._yzVisual||(m._yzVisual={x:m.spr.x,y:m.spr.y,gait:0,clock:0,sx:1,sy:1,bob:0,rot:0,recoil:0,state:''});
    const dx=m.spr.x-v.x,dy=m.spr.y-v.y,d=Math.hypot(dx,dy),walking=pose.state==='move'||pose.state==='retreat';
    if(t>0){if(walking&&d<110)v.gait+=d/(m.kind==='pomelo'?110:100)*Math.PI*2;v.clock+=t;
      if(pose.state==='release'&&v.state!=='release')v.recoil=1;v.recoil*=Math.exp(-18*t);
    }
    v.x=m.spr.x;v.y=m.spr.y;v.state=pose.state;
    const red=this.hubMotionAllowed?.()===false,face=m.spr.flipX?-1:1;
    let sx=1,sy=1,bob=0,rot=0;
    if(!red){
      if(pose.state==='idle'){sy+=Math.sin(v.clock*2.8)*.012;sx-=Math.sin(v.clock*2.8)*.006;}
      if(walking){const weight=m.kind==='pomelo'?1.6:1.1;bob=-Math.abs(Math.sin(v.gait))*weight;rot=Math.max(-.035,Math.min(.035,(m.vx||0)/7000));sy+=Math.cos(v.gait*2)*.018;sx-=Math.cos(v.gait*2)*.012;}
      if(pose.state==='windup'){sx=.96;sy=1.045;rot=-.025*face;}
      if(pose.state==='land'){sx=1.08;sy=.91;}
      sx+=v.recoil*.095;sy-=v.recoil*.075;rot-=v.recoil*.035*face;
      const f=1-Math.exp(-18*t);v.sx+=(sx-v.sx)*f;v.sy+=(sy-v.sy)*f;v.bob+=(bob-v.bob)*f;v.rot+=(rot-v.rot)*f;
    }else{v.sx=v.sy=1;v.bob=v.rot=v.recoil=0;}
    return v;
  }
  yuzuAnimationFrame(m,pose){
    const key='yz_48_'+m.kind;if(!this.textures.exists(key))return pose;const paintScale=({pomelo:1.0769,lime:1.1006,bloodorange:1.1325})[m.kind]||1;
    const v=m._yzVisual;
    if(pose.state==='idle')return{...pose,key,paintScale,frame:0};
    if(pose.state==='move'||pose.state==='retreat'){const step=Math.floor((v?.gait||0)/Math.PI/2*8)%8;return{...pose,key,paintScale,frame:pose.state==='retreat'?(8-step)%8:step};}
    if(m.lunge){const duration=m.lunge.duration||.3,wind=duration*.55,t=m.lunge.t;return{...pose,key,paintScale,frame:t<wind?8+Math.min(3,Math.floor(t/wind*4)):12+Math.min(3,Math.floor((t-wind)/(duration-wind)*4))};}
    const a=m.action;
    if(a&&['arrow','volley','orb','brew','sigil','comet','garden','bloom','honey','vault','pin','breaker'].includes(a.kind)){
      if(['comet','garden','bloom','honey'].includes(a.kind)&&a.t>=a.wind)return pose; // Retain the three authored flavor release poses.
      const frame=a.t<a.wind?8+Math.min(3,Math.floor(a.t/a.wind*4)):12+Math.min(3,Math.floor((a.t-a.wind)/Math.max(.001,a.end-a.wind)*4));
      return{...pose,key,paintScale,frame};
    }
    return pose;
  }

  yuzuVisualPose(m){
    const special='yz_47_'+m.kind,base='yz_'+m.kind;
    if(m.motion){const q=m.motion;if(q.t<(q.prep||0))return{key:special,frame:0,state:'windup'};
      if(q.kind==='roll')return{key:special,frame:2,state:'roll'};
      return{key:special,frame:m.kind==='pomelo'?1:3,state:q.kind};
    }
    if(m.lunge){const f=m.lunge.t/(m.lunge.duration||.3);return{key:base,frame:f<.3?4:f<.55?5:f<.78?6:7,state:f<.55?'windup':'release'};}
    if(m.action){const a=m.action,wind=a.t<a.wind;
      if(m.kind==='bloodorange'&&['comet','garden','bloom','honey'].includes(a.kind)){const flavor=m.castFlavor||0;return{key:wind?base:special,frame:wind?(a.t<a.wind*.5?4:5):flavor,state:wind?'windup':'release'};}
      if(m.kind==='bloodorange'&&a.kind==='sigil')return{key:wind?base:special,frame:wind?5:0,state:wind?'windup':'release'};
      if(m.kind==='lime'&&['arrow','volley','vault','pin'].includes(a.kind))return{key:special,frame:wind?(a.t<a.wind*.5?0:1):(a.t<a.wind+(a.end-a.wind)*.6?2:7),state:wind?'windup':'release'};
      return{key:base,frame:wind?(a.t<a.wind*.5?4:5):(a.t<a.wind+(a.end-a.wind)*.5?6:7),state:wind?'windup':'release'};
    }
    if(m.land>0)return{key:special,frame:3,state:'land'};
    if(m.retreat&&m.kind==='lime')return{key:special,frame:3,state:'retreat'};
    const moving=Math.hypot(m.vx,m.vy)>15;return{key:base,frame:moving?Math.floor(m.anim*8)%4:0,state:moving?'move':'idle'};
  }


  yuzuEnemyPriority(e){return e._waveObjectiveTarget?5:e._wispRaider&&this.waveObjective?.type==='purge'&&!this.waveObjective.done?4:e.isBoss?3:e.isMini?2:e.isElite||e._eventCourier?1:0;}
  // v8.0.62 ก: the mark only changes WHO is picked (above mobs/elites); leash range and skill gating use yuzuEnemyPriority without it
  yuzuFocusRank(e){const r=this.yuzuEnemyPriority(e);return r<=1&&this._yzMark?.e===e&&this.yuzuMarked()===e?1.5:r;}
  yuzuCombatTarget(e){return !!(e?.active&&e.hp>0&&!e.isDummy&&!e._coreLocked&&!e._waveObjectiveNode&&!e._phaseGateLocked&&!(e._phaseInvuln>0));}
  yuzuBuffValid(u){return !!u&&!u.finished&&this.character==='yuzu'&&this._yuzuCrew?.[0]===u.m&&u.m.spr?.active!==false&&this.player===u.player&&u.player?.active!==false&&!(u.player.hp<=0)&&this.basicAttack===u.basic&&(this._artEpoch||0)===u.epoch&&this.yuzuKind()===u.kind;}
  yuzuBuff(){const u=this._yzBuff;return this.yuzuBuffValid(u)&&u.t>0?u:null;}
  clearYuzuBuff(){this.clearYuzuArsenal();if(this._yzBuff)this._yzBuff.finished=true;this._yzBuff=null;this._yzBurst=[];this._yzSourTags?.clear();}
  yuzuTickBuff(dt){
    if(this.state!=='play')return;
    for(const[e,tag]of this._yzSourTags||[]){tag.t-=dt;if(tag.t<=0||!e.active||e._yzSpawnId!==tag.id)this._yzSourTags.delete(e);}
    const u=this._yzBuff;if(u&&!this.yuzuBuffValid(u)){this.clearYuzuBuff();return;}
    if(u){u.t=Math.max(0,u.t-dt);u.push-=dt;this.yuzuBuffArt(u,dt);this.yuzuTickStorm(u,dt);
      if(u.kind==='pomelo'&&u.push<=0){u.push=.8;for(const e of this.yuzuEnemies()){const d=this.dist(e.x,e.y,u.m.spr.x,u.m.spr.y);if(d>150||e.isBoss||e.isMini||e._waveObjectiveTarget)continue;const a=Math.atan2(e.y-u.m.spr.y,e.x-u.m.spr.x),p=inMapPt(e.x+Math.cos(a)*18,e.y+Math.sin(a)*18);e.setPosition?.(p[0],p[1]);e.knock=Math.max(e.knock||0,.12);}this.yuzuSkillFx('slam',u.m.spr.x,u.m.spr.y,220,0,{ground:true,life:.3});}
      if(u.t<=0){this.yuzuEndBuff(u,!u.cmd);if(this.state!=='play')return;}
    }
    const jobs=this._yzBurst||[];for(let i=jobs.length-1;i>=0;i--){const j=jobs[i];if(!this.yuzuBuffValid(j.u)||this._yzBuff!==j.u||j.u.t<=0){jobs.splice(i,1);continue;}j.delay-=dt;if(j.delay<=0){jobs.splice(i,1);const m=j.u.m;this.yuzuShot(m,m.spr.x+Math.cos(j.angle)*16,m.spr.y+Math.sin(j.angle)*16,j.angle,j.amount,j.opt);}}
  }
  yuzuFocusBurst(m,angle,amount,evolved=false){
    const u=this.yuzuBuff();if(!u||u.kind!=='lime')return false;
    const opt={first:true,pierce:evolved?4:2,source:'focus_arrow'},hit=amount*.48*u.power;
    this.yuzuSkillFx('volley',m.spr.x,m.spr.y,85,angle,{life:.24});
    this.yuzuShot(m,m.spr.x+Math.cos(angle)*16,m.spr.y+Math.sin(angle)*16,angle,hit,opt);
    const jobs=this._yzBurst||(this._yzBurst=[]);for(let i=1;i<=2&&jobs.length<8;i++)jobs.push({u,delay:i*.07,angle:angle+(i===1?-.025:.025),amount:hit,opt:{...opt}});
    return true;
  }
  // v8.0.60 owner: Yuzu's seed marks one enemy (aimed by walking direction); the companion focuses it and hits it ×1.25 for 4s.
  yuzuMark(e){if(!this.yuzuCombatTarget(e))return;const id=e._yzSpawnId||0,cur=this.yuzuMarked(),k=this._yzMark;   // v8.0.61 ก: a mark holds ≥2s and moves only after 2 seed hits in a row on the new enemy
    if(!cur){this._yzMark={e,id,t:4,age:0,pend:null};this.rubyOnce?.('yuzuAim',300);return;}if(cur===e){k.t=Math.max(k.t,4);k.pend=null;return;}
    const q=k.pend&&k.pend.e===e&&k.pend.id===id?k.pend:(k.pend={e,id,n:0});q.n++;if(q.n>=2&&(k.age||0)>=2)this._yzMark={e,id,t:4,age:0,pend:null};}
  yuzuMarked(){const k=this._yzMark;if(!k)return null;if(k.t<=0||!this.yuzuCombatTarget(k.e)||(k.e._yzSpawnId||0)!==k.id){this._yzMark=null;return null;}return k.e;}
  yuzuTickMark(dt){const k=this._yzMark;if(k){k.t-=dt;k.age=(k.age||0)+dt;}const e=this.yuzuMarked();let g=this._yzMarkG;if(!e){g?.clear?.();return;}
    if(!g||g.active===false)g=this._yzMarkG=this.camWorld(this.add.graphics());const r=(e.body?.halfWidth||16)+12,s=(this.elapsed||0)*3;g.clear().setDepth((e.depth||e.y||0)+1);g.lineStyle(2.5,0xffd34d,.9);
    for(let i=0;i<4;i++){const a=s+i*Math.PI/2;g.beginPath?.();g.arc?.(e.x,e.y,r,a,a+.9);g.strokePath?.();}g.fillStyle?.(0xffd34d,.9);g.fillTriangle?.(e.x,e.y-r-4,e.x-6,e.y-r-14,e.x+6,e.y-r-14);}
  yuzuSeedAim(p){const v=p.body?.velocity,vx=v?.x||0,vy=v?.y||0;
    if(Math.hypot(vx,vy)>20){const a=Math.atan2(vy,vx);let best=null,bd=Infinity;for(const e of this.yuzuEnemies()){const d=this.dist(p.x,p.y,e.x,e.y);if(d>440)continue;const t=Math.atan2(e.y-p.y,e.x-p.x)-a;if(Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))<.6&&d<bd){bd=d;best=e;}}if(best)return best;}
    return this.yuzuTarget(p.x,p.y,440);}
  // v8.0.60 owner: start with normal + one skill + Unique; the matching path card unlocks each extra skill (Evolution = all).
  yuzuHasSkill(k){if(this.basicAttack?.evolved)return true;const id=({trap:'y_bigsplat',vault:'p_pulp',pin:'y_strongarm',breaker:'y_giantslam',garden:'y_longroot',bloom:'y_elder',honey:'y_seedluck'})[k];return !id||this.yuzuRank(id)>0;}
  // v8.0.61 ง: after the Build, a card that unlocks a skill shows up within 2 level-ups (while one is still locked).
  yuzuUnlockGuard(out,atk){const b=this.basicAttack;if(b?.character!=='yuzu'||!b.path||b.evolved||!out?.length)return;const ids=['y_bigsplat','p_pulp','y_strongarm','y_giantslam','y_longroot','y_elder','y_seedluck'],locked=c=>c&&ids.includes(c.key)&&!(b.lv?.[c.key]>0);
    const cand=(atk||[]).map(x=>x.card).filter(locked);if(!cand.length||out.some(locked)){this._yzUnlockMiss=0;return;}
    if(!this._yzUnlockMiss){this._yzUnlockMiss=1;return;}let at=out.findIndex(c=>c.type!=='heal'&&c.poolGroup!=='path');if(at<0)at=out.findIndex(c=>c.type!=='heal');if(at<0)at=out.length-1;out[at]=cand[Math.floor(Math.random()*cand.length)];this._yzUnlockMiss=0;}
  yuzuTagSour(e){const tags=this._yzSourTags||(this._yzSourTags=new Map());if(tags.size>=64&&!tags.has(e))tags.delete(tags.keys().next().value);tags.set(e,{id:e._yzSpawnId,t:3});}
  yuzuEndBuff(u,fire){
    if(this._yzBuff!==u||!this.yuzuBuffValid(u))return;
    u.finished=true;this._yzBuff=null;this._yzBurst=[];u.m.boost=0;
    if(!fire||this.state!=='play'||this.mode==='reward'||this.mode==='clear')return;
    const m=u.m,p=this.player,target=this.yuzuTarget(m.spr.x,m.spr.y,780),angle=target?Math.atan2(target.y-m.spr.y,target.x-m.spr.x):m.aim||0;m.aim=angle;m.attack=.45;
    if(u.kind==='pomelo'||u.kind==='yuzling'){this.yuzuArea(m,m.spr.x,m.spr.y,180+this.yuzuTalent('Slam'),(4+.45*(u.ul-1))*u.power,'golden_final',.45);if(!this.yuzuEmpowerFx(u.kind,'finish',m.spr.x,m.spr.y,380,0,{ground:true,life:.72}))this.yuzuSkillFx('slam',m.spr.x,m.spr.y,380,0,{ground:true,life:.7});this.yuzuSound('slam',.3,.6);}
    if(u.kind==='lime'){this.yuzuShot(m,m.spr.x,m.spr.y,angle,this.yuzuPower()*(4+.25*u.marks)*u.power,{pierce:6,source:'focus_final',speed:620,life:1.5,seek:u.mut==='toss_home',focusFinal:true,finalSplash:55+this.yuzuTalent('Rain')});if(!this.yuzuEmpowerFx('lime','finish',m.spr.x,m.spr.y,210,angle,{life:.42}))this.yuzuSkillFx('volley',m.spr.x,m.spr.y,210,angle,{life:.45});this.yuzuSound('volley',.4,.6);}
    if(u.kind==='bloodorange'){const q={...u,ownerKind:u.kind};if(this.yuzuBigBusy())this._yzPendingBlend=q;else this.yuzuBlendFinish(q);}
    this.yuzuSound('grow',.5,.3);
  }

  yuzuEnsure(){
    if(this.character!=='yuzu'||!this.player||!this.basicAttack)return null;
    const kind=this.yuzuKind();let m=this._yuzuCrew?.[0];
    if(!m||m.kind!==kind){
      const x=m?.spr.x??this.player.x-55,y=m?.spr.y??this.player.y+25;
      this.clearYuzuCrew();
      const spr=this.camWorld(this.add.sprite(x,y,'minion_yuzling',0).setDepth(7));
      const label=this.camWorld(this.add.text(x,y,'',{fontFamily:'sans-serif',fontSize:'10px',color:'#fff2cf',stroke:'#26162c',strokeThickness:2}).setOrigin(.5).setDepth(95003));
      const bar=this.camWorld(this.add.graphics().setDepth(95002));
      const shadow=this.camWorld(this.add.graphics().setDepth(y+1));
      m={kind,spr,label,bar,shadow,cd:.35,skill:1.5,second:4,growth:kind==='pomelo'?[0,1,3][Math.min(2,this.basicAttack.lv?.companion_form||0)]:0,kills:0,form:1+(this.basicAttack.lv?.companion_form||0),formKills:0,bites:0,vx:0,vy:0,seen:new WeakMap()};this._yuzuCrew=[m];
      this.floatText?.(x,y-45,kind==='yuzling'?'Yuzling ready!':({pomelo:'Pomelo',lime:'Lime',bloodorange:'Blood Orange'})[kind]+' joins!',0xffdc7a);
    }
    return m;
  }
  yuzuOrchFrac(){if(this.character!=='yuzu')return -1;const u=this.yuzuBuff();return u?u.t/u.total:-1;}
  yuzuPower(){const b=this.basicAttack,cm=this._yuzuCrew?.[0],fm=cm&&cm.kind!=='pomelo'?1+.3*(this.yuzuForm(cm)-1):1;return .9*fm*24*(1+.12*(b.ranks?.power||0))*(b._pm?.dmg||1)*(this.player.dmgMul||1)*(1+this.yuzuTalent('Dmg'))*(1+.08*this.yuzuRank('family'));}
  clearYuzuArsenal(){for(const q of this._yzSpells||[]){q.canceled=true;q.art?.spr?.destroy();}this._yzSpells=[];this._yzPendingBlend=null;if(this._yuzuCrew?.[0])this._yuzuCrew[0].pin=null;}
  yuzuSpellValid(q){return !!q&&!q.canceled&&this.character==='yuzu'&&this.player===q.player&&q.player?.active!==false&&!(q.player.hp<=0)&&this.basicAttack===q.basic&&(this._artEpoch||0)===q.epoch&&this._yuzuCrew?.[0]===q.m&&this.yuzuKind()===q.ownerKind;}
  yuzuBigBusy(){return (this._yzSpells||[]).some(q=>q.big&&q.t<q.life&&this.yuzuSpellValid(q));}
  yuzuArsenalFx(kind,x,y,size,angle=0,opt={}){
    const table={sigil:['bloodorange',0],comet:['bloodorange',4],garden:['bloodorange',8],bloom:['bloodorange',12],honey:['bloodorange',16],combo:['pomelo',0],breaker:['pomelo',4],vault:['lime',0],pin:['lime',4],pierce:['lime',8]},a=table[kind];if(!a)return null;
    const painted=a[0]==='bloodorange'&&this.textures.exists('yz_bo96_arsenal');
    const fx=this.yuzuSkillFx('arsenal',x,y,size,angle,{...opt,alpha:painted?(size>250?.82:.9):opt.alpha,essential:kind==='sigil',key:painted?'yz_bo96_arsenal':'yz_54_'+a[0],start:a[1]});
    if(!fx)return this.yuzuSkillFx(a[0]==='lime'?'volley':a[0]==='pomelo'?'slam':kind==='garden'?'sour':kind==='honey'?'sweet':'spicy',x,y,size,angle,{...opt,essential:kind==='sigil'});return fx;
  }
  yuzuQueueSpell(m,kind,target){
    const big=['comet','garden','bloom'].includes(kind),L=this._yzSpells||(this._yzSpells=[]);if(L.length>=12||big&&this.yuzuBigBusy())return false;
    const p=this.player,b=this.basicAttack,u=this.yuzuBuff(),infused=m.kind==='bloodorange'&&u?.kind==='bloodorange',x=target?.x??p.x,y=target?.y??p.y,angle=Math.atan2(y-m.spr.y,x-m.spr.x);
    const q={m,kind,big,player:p,basic:b,epoch:this._artEpoch||0,ownerKind:m.kind,t:0,index:0,events:[],x,y,sx:m.spr.x,sy:m.spr.y,angle,hit:new Map(),infused,power:infused?u.power:1,ul:infused?u.ul:1,target,id:target?._yzSpawnId};
    const add=(at,dx,dy,r,mul,source,extra={})=>q.events.push({at,x:dx,y:dy,r,mul,source,...extra});
    if(kind==='sigil'){const r=48+8*this.yuzuRank('splash')+5*this.yuzuRank('y_elder'),mul=(b.evolved?1.1:.9)*(infused?1.25+.05*(u.ul-1):1);add(.24,x,y,r,mul,'sigil',{tag:infused});if(infused)add(.36,x,y,r+10,.35*q.power,'blend_fire');q.art=this.yuzuArsenalFx(kind,x,y,r*2,0,{ground:true,life:.55});}
    if(kind==='comet'){add(.6,x,y,105+10*this.yuzuRank('y_elder'),3.4+.25*this.yuzuRank('p_sourMixer'),'comet',{sour:infused,burn:infused});q.art=this.yuzuArsenalFx(kind,x,y-130,220,0,{life:.95,important:true});}
    if(kind==='garden'){for(let i=0;i<3;i++){const a=angle+(i-1)*.45;add(.18+i*.16,x+Math.cos(a)*45,y+Math.sin(a)*45,65+8*this.yuzuRank('y_elder'),.6,'garden',{sour:true});}q.art=this.yuzuArsenalFx(kind,x,y,270,0,{ground:true,life:.95,important:true});}
    if(kind==='bloom'){for(let i=0;i<3;i++)add(.18+i*.18,x,y,65+i*55,1.8-i*.3,'bloom_petals',{inner:i?65+(i-1)*55:0,once:true,burn:true});if(infused)add(.8,x,y,160,.35*q.power,'blend_fire');q.art=this.yuzuArsenalFx(kind,x,y,350,0,{ground:true,life:1.1,important:true});}
    if(kind==='honey'){add(.22,p.x,p.y,0,0,'honey',{heal:true});q.art=this.yuzuArsenalFx(kind,p.x,p.y,150,0,{follow:'player',life:.7});}
    if(kind==='breaker'){for(let i=1;i<=4;i++)add(.09*i,m.spr.x+Math.cos(angle)*i*75,m.spr.y+Math.sin(angle)*i*75,48+this.yuzuTalent('Slam')/2,2.6*Math.pow(1.4,m.growth),'breaker',{once:true});q.art=this.yuzuArsenalFx(kind,m.spr.x+Math.cos(angle)*145,m.spr.y+Math.sin(angle)*145,300,angle,{ground:true,life:.7,important:true});}
    if(kind==='vault'){add(.55,x,y,48+this.yuzuRank('splash')*8,1.9+.12*this.yuzuRank('p_pulp'),'vault',{critical:true});q.art=this.yuzuArsenalFx(kind,m.spr.x,m.spr.y,110,angle,{life:.7,important:true});}
    if(kind==='pin'){add(.2,x,y,25,.65,'pin',{critical:true,mark:true});add(.75,x,y,30,2.35+.15*this.yuzuRank('p_pulp'),'pierce',{line:true,critical:true,once:true});q.art=this.yuzuArsenalFx(kind,x,y,74,0,{life:.7,follow:target?{spr:target}:null});}
    if(!q.events.length)return false;q.life=Math.max(q.events.at(-1).at+.3,q.art?.life||0);L.push(q);m.attack=.45;this.yuzuSound(({sigil:'sour',comet:'infusion',garden:'sour',bloom:'spicy',honey:'sweet',breaker:'slam',vault:'volley',pin:'arrow'})[kind],.25,kind==='sigil'?.23:.45);return true;
  }
  yuzuSpellImpact(q,event){
    const m=q.m,p=this.player;
    if(event.heal){const rank=this.yuzuRank('y_seedluck'),h=p.maxhp*(.04+.01*rank+this.yuzuTalent('Heal'));p.hp=Math.min(p.maxhp,p.hp+h);this.popHeal?.(p.x,p.y,Math.round(h));this.yuzuShield(.08+.02*rank,4+this.yuzuTalent('ShieldTime'));return true;}
    if(event.line&&!event.artDone){event.artDone=true;this.yuzuArsenalFx('pierce',q.sx+Math.cos(q.angle)*150,q.sy+Math.sin(q.angle)*150,300,q.angle,{life:.4,important:true});}
    const visited=event.visited||(event.visited=new Map());for(const e of this.yuzuEnemies()){if(!this.yuzuSpellValid(q)||this.state!=='play')return false;
      const d=this.dist(e.x,e.y,event.x,event.y);let inside=d<=event.r+(e.body?.halfWidth||0)&&!(event.inner&&d<event.inner);
      if(event.line){const dx=e.x-q.sx,dy=e.y-q.sy,along=dx*Math.cos(q.angle)+dy*Math.sin(q.angle),side=Math.abs(-dx*Math.sin(q.angle)+dy*Math.cos(q.angle));inside=along>=0&&along<=650&&side<=event.r+(e.body?.halfWidth||0);}
      const id=e._yzSpawnId||0;if(!inside||visited.get(e)===id||event.once&&q.hit.get(e)===id)continue;visited.set(e,id);if(event.once)q.hit.set(e,id);
      let mul=event.mul*(q.infused&&q.big?1+.15*q.power:1),critical=false;if(event.critical){const id=e._yzSpawnId||0;if(m.seen.get(e)!==id){critical=true;mul*=1+this.yuzuTalent('Opener');m.seen.set(e,id);}if(this.dist(e.x,e.y,m.spr.x,m.spr.y)>250)mul*=1.3+this.yuzuTalent('Far');}
      if(event.line&&m.pin?.e===e&&m.pin.id===e._yzSpawnId)mul*=1.25;
      this.yuzuHit(m,e,this.yuzuPower()*mul,event.source,critical);if(event.tag&&e.active&&(e._yzSpawnId||0)===id)this.yuzuTagSour(e);
      if(event.burn&&e.active&&(e._yzSpawnId||0)===id)this.applyBurn?.(e,this.yuzuPower()*mul*.15,this.yuzuPower()*mul*.45,3);
      if(event.mark&&e===q.target&&e._yzSpawnId===q.id)m.pin={e,id:q.id,t:2};
    }
    if(this.state!=='play'||!this.yuzuSpellValid(q))return false;
    if(event.sour)this.yuzuZone(m,'sour',event.x,event.y,event.r,3+this.yuzuRank('y_longroot')+this.yuzuTalent('Duration'),.14+.02*this.yuzuRank('p_sourMixer'));
    if(q.kind==='comet'){this.yuzuSound('slam',.25,.5);this.yuzuArsenalFx('sigil',event.x,event.y,180,0,{ground:true,life:.4});}
    if(event.line)m.pin=null;
    return true;
  }
  yuzuTickSpells(dt){
    if(this.state!=='play')return;const L=this._yzSpells||[];
    for(let i=L.length-1;i>=0;i--){const q=L[i];if(!this.yuzuSpellValid(q)){q.art?.spr?.destroy();L.splice(i,1);continue;}q.t+=Math.max(0,dt);
      if(q.art?.spr?.active&&q.kind==='comet')q.art.spr.setPosition(q.x,q.y-130*(1-Math.min(1,q.t/.6)));
      if(q.art?.spr?.active&&q.kind==='vault'){const k=Math.min(1,q.t/.55);q.art.spr.setPosition(q.sx+(q.x-q.sx)*k,q.sy+(q.y-q.sy)*k-Math.sin(Math.PI*k)*90);}
      while(q.index<q.events.length&&q.events[q.index].at<=q.t){const event=q.events[q.index];if(this.yuzuSpellImpact(q,event)===false)return;q.index++;if(this.state!=='play'||!this.yuzuSpellValid(q))return;}
      if(q.t>=q.life)L.splice(i,1);
    }
    const pending=this._yzPendingBlend;if(pending&&!this.yuzuSpellValid(pending))this._yzPendingBlend=null;else if(pending&&!this.yuzuBigBusy()){this._yzPendingBlend=null;this.yuzuBlendFinish(pending);}
  }
  yuzuBlendFinish(q){const p=this.player,r=180+(q.mut==='grow_burst'?50:0);this.yuzuArea(q.m,p.x,p.y,r,(3.6+.4*(q.ul-1)+(q.mut==='grow_burst'?.5:0))*q.power,'blend_final');this.yuzuEmpowerFx('bloodorange','finish',p.x,p.y,r*1.9,0,{ground:true,life:.8});this.yuzuSound('infusion',.5,.6);}
  yuzuArsenalClock(m,dt){
    const cds=m.arsenal||(m.arsenal={comet:2,garden:4,bloom:6,honey:0,breaker:3,vault:3,pin:5});for(const k of Object.keys(cds))cds[k]=Math.max(0,cds[k]-dt);
    if(m.pin){m.pin.t-=dt;if(m.pin.t<=0||!m.pin.e.active||m.pin.e._yzSpawnId!==m.pin.id)m.pin=null;}
  }
  yuzuPeelStrike(m,q,mul){
    const step=q.step||1,r=step===1?78:step===2?110:125;
    this.yuzuArea(m,m.spr.x,m.spr.y,r+10*this.yuzuRank('splash')+(this.yuzuBuff()?.kind==='pomelo'?35:0),mul*(step===1?.85:step===3?1.45*(1+.2*Math.min(3,this.yuzuRank('y_keepripe'))):1),'sweep',0,step===3?null:q.a);
    this.yuzuArsenalFx('combo',m.spr.x+Math.cos(q.a)*35,m.spr.y+Math.sin(q.a)*35,step===3?190:125,q.a,{life:.28,hold:step-1,important:true});
    if(step===3&&this.yuzuForm(m)>=2){const titan=this.yuzuForm(m)>=3;this.yuzuArea(m,m.spr.x+Math.cos(q.a)*55,m.spr.y+Math.sin(q.a)*55,titan?155:105,mul*(titan?.45:.25),'form_aftershock');this.yuzuSkillFx('slam',m.spr.x,m.spr.y,titan?310:220,0,{ground:true,life:.38,important:true});}
  }
  yuzuArsenalThink(m,target,rate,dt){
    if(!m.arsenal)this.yuzuArsenalClock(m,0);const cds=m.arsenal;
    if(m.action||m.motion||m.lunge||m.returning)return false;
    const p=this.player,rank=target?this.yuzuEnemyPriority(target):0,near=target?this.yuzuEnemies().filter(e=>(e.x-target.x)**2+(e.y-target.y)**2<150**2).length:0;
    let kind=null,cd=0,aim=target;
    if(m.kind==='bloodorange'){
      if(p.hp/p.maxhp<.7&&cds.honey<=0&&this.yuzuHasSkill('honey')){kind='honey';cd=10;aim=p;}
      else if(target&&!this.yuzuBigBusy()){
        if(cds.comet<=0&&(rank>0||near<3)){kind='comet';cd=9;}
        else if(cds.garden<=0&&this.yuzuHasSkill('garden')&&(near>=3||rank>0&&this.yuzuVulnerable(target)<=1)){kind='garden';cd=10;}
        else if(cds.bloom<=0&&this.yuzuHasSkill('bloom')){kind='bloom';cd=9;}
        else if(cds.comet<=0){kind='comet';cd=9;}
      }
    }
    if(m.kind==='pomelo'&&target&&this.dist(m.spr.x,m.spr.y,target.x,target.y)<=380&&cds.breaker<=0&&this.yuzuHasSkill('breaker')&&(rank>0||near>=3)){kind='breaker';cd=9;}
    if(m.kind==='lime'&&target){const d=this.dist(m.spr.x,m.spr.y,target.x,target.y),a=Math.atan2(target.y-m.spr.y,target.x-m.spr.x);let screen=0;
      for(const e of this.yuzuEnemies()){if(e===target)continue;const dx=e.x-m.spr.x,dy=e.y-m.spr.y,along=dx*Math.cos(a)+dy*Math.sin(a);if(along>0&&along<d-35&&Math.abs(-dx*Math.sin(a)+dy*Math.cos(a))<45)screen++;}
      if(cds.vault<=0&&this.yuzuHasSkill('vault')&&(screen>=2||d>320)){kind='vault';cd=8;}
      else if(cds.pin<=0&&this.yuzuHasSkill('pin')&&rank>0&&d<=600){kind='pin';cd=10;}
      else if(cds.vault<=0&&this.yuzuHasSkill('vault')&&near>=3){kind='vault';cd=8;}
    }
    if(!kind)return false;m.castFlavor=kind==='garden'?1:kind==='bloom'?2:0;
    const point=aim?{x:aim.x,y:aim.y}:null;
    if(this.yuzuBeginAction(m,kind,()=>this.yuzuQueueSpell(m,kind,kind==='pin'?target:point),point)){cds[kind]=this.yuzuCd(cd)*rate*(m.kind==='bloodorange'&&this.basicAttack.evolved?.8:1);return true;}return false;
  }
  yuzuBite(){return this.yuzuPower();}
  yuzuCd(base){return Math.max(.22,base*Math.pow(.92,this.basicAttack.ranks?.rate||0)/(this.uqReady?.()?1.15:1)*(this.basicAttack._pm?.cd||1)*(this.player.cdMul||1)*(1-this.yuzuTalent('Tempo')));}
  yuzuHit(m,e,amount,source,critical=false,shot=null){
    if(!e?.active||!(e.hp>0))return;
    if(m){m.combo=(m.combo||0)+1;if(this.basicAttack.mutation==='second'&&m.combo%4===0)amount*=1.5;if(this.basicAttack.mutation==='pack'&&this.dist(m.spr.x,m.spr.y,this.player.x,this.player.y)<200)amount*=1.2;if(e===this.yuzuMarked())amount*=this._yzBuff?.cmd?1.5:1.25;}
    const u=this.yuzuBuff();if(u&&m===u.m&&u.kind==='pomelo'&&source==='sweep')amount*=1+.45*u.power;if(u&&m===u.m&&u.kind==='yuzling'&&source==='bite')amount*=1+.25*u.power;
    const own=this._yzHitOwner,src=this._mxSrc,crit=this._yzForceCrit,before=e.hp,id=e._yzSpawnId;
    this._yzHitOwner=m;this._mxSrc='yuzu.'+source;this._yzForceCrit=critical?e:null;
    try{this.damage(e,amount,e.x,e.y);if(e._yzSpawnId===id&&e.hp<before){this.yuzuImpactFx(m,e,source);if(u&&m===u.m)Sfx.bp?.('uq_yuzu_crew_hit',.28,.22);if(u&&u.kind==='lime'&&source==='focus_arrow')u.marks=Math.min(12,u.marks+1);}}
    finally{this._yzHitOwner=own;this._mxSrc=src;this._yzForceCrit=crit;}
  }
  yuzuOnKill(){const m=this._yzHitOwner;if(this.character!=='yuzu'||!m||m!==this._yuzuCrew?.[0])return;if(m.kind==='lime')m.cd=Math.max(0,m.cd-.3*this.yuzuRank('p_feast'));m.kills=(m.kills||0)+1;}

  yuzuForm(m){if(!m||m.kind==='yuzling')return 1;return 1+Math.max(0,Math.min(2,this.basicAttack?.lv?.companion_form||0));}

  yuzuFormKills(m){return false;} // Evolution is selected from cards, never granted by kills.

  yuzuFormTempo(m,skill=false){const f=this.yuzuForm(m)-1;return (skill?[1,.9,.78]:[1,.8,.62])[f]*Math.max(.6,1-(this.yuzuRank('y_fastripe')*.06)-this.yuzuTalent('Ripen'));}
  yuzuChooseForm(b,rank){
    if(this.state==='menu'||this.state==='dead'||this.character&&this.character!=='yuzu'||this.basicAttack!==b||b.character!=='yuzu'||!b.path||(b.lv?.companion_form||0)!==rank-1)return false;
    b.lv=b.lv||{};b.ranks=b.ranks||{};b.lv.companion_form=rank;b.ranks.companion_form=rank;const m=this._yuzuCrew?.[0];if(m){if(m.groundY!=null)m.spr.setPosition(m.spr.x,m.groundY);m.groundY=null;m.form=rank+1;m.growth=m.kind==='pomelo'?[0,1,3][rank]:0;m.action=null;m.motion=null;m.lunge=null;m.cd=Math.min(m.cd||0,.15);m.skill=Math.min(m.skill||0,.8);if(m.arsenal)for(const k of Object.keys(m.arsenal))m.arsenal[k]=Math.min(m.arsenal[k],1);this.yuzuEvolveFx(m);}this.syncBasicAttack();return true;
  }
  yuzuDraftGuard(cards,noSpecial=false){
    const b=this.basicAttack,rank=b?.lv?.companion_form||0,issuedPath=b?.path;if(noSpecial||this._inTutorial||b?.character!=='yuzu'||!b.path||this.banishedKeys?.['b:companion_form']||rank>=2||(this.level||1)<[7,11][rank])return cards;
    const kind=({citrusGuardian:'pomelo',zestSwarm:'lime',juiceWorkshop:'bloodorange'})[b.path],next=rank+2,name=(typeof YUZU_FORMS==='undefined'?{}:YUZU_FORMS)[kind]?.[next-1]||'Companion',attack=kind==='pomelo'?(next===2?'Shield Combo ends in a forward shockwave.':'Heavy combos release an aftershock; Rolling Pomelo unlocks.'):kind==='lime'?(next===2?'Twin piercing arrows.':'Three piercing arrows per normal attack.'):(next===2?'Sigils launch an elemental bolt.':'Sigils unleash a three-element fan.');
    const card={type:'basic',key:'companion_form',lvl:next,max:3,special:true,companionForm:true,kind:'Companion Evolution',role:'Companion · Form '+next,title:name,emoji:'✨',iconKey:yuzuCardArt(b.path,'evolution'),color:0xffd466,headline:'Companion Form '+next+' · '+'+1 Minion',desc:attack+' '+(next===2?'20%':'38%')+' shorter attack cooldown; '+(next===2?'10%':'22%')+' shorter skill cooldown. '+(kind==='pomelo'?'Heavier growth-powered hits.':next===2?'+30% Companion power.':'+60% Companion power.'),apply:()=>b.path===issuedPath&&this.yuzuChooseForm(b,rank+1)};
    const out=cards.slice();const protectedCard=c=>c.type==='heal'||['y_bigsplat','p_pulp','y_strongarm','y_giantslam','y_longroot','y_elder','y_seedluck'].includes(c.key)&&!(b.lv?.[c.key]>0);let at=out.findLastIndex(c=>!protectedCard(c)&&!c.companionForm);if(at<0)at=out.findLastIndex(c=>c.type!=='heal');if(at>=0)out[at]=card;else if(!out.length)out.push(card);return out;
  }
  yuzuEvolutionArt(m,col){
    const settings=typeof Save==='undefined'?{}:Save.data?.settings||{};
    if(settings.vfx===0||!this.textures?.exists('yz_fx_evolve'))return false;
    const L=this._yzFx||(this._yzFx=[]);if(L.length>=8)L.shift().spr.destroy();
    const red=this.hubMotionAllowed?.()===false,size=m.kind==='pomelo'?180:150;
    const spr=this.camWorld(this.add.sprite(m.spr.x,m.spr.y,'yz_fx_evolve',red?4:0).setDisplaySize(size,size).setTint(col).setAlpha(.85).setDepth(m.spr.y+5));
    spr.setBlendMode?.('NORMAL');L.push({spr,evolve:true,t:0,life:red?.25:.6,red,owner:m,player:this.player,basic:this.basicAttack,epoch:this._artEpoch||0});return true;
  }
  yuzuEvolveFx(m){const f=this.yuzuForm(m),name=((typeof YUZU_FORMS!=='undefined'?YUZU_FORMS:{})[m.kind]||[])[f-1]||'Companion',col=({pomelo:0xffd466,lime:0xb7ff7c,bloodorange:0xef91c8})[m.kind]||0xffdc88;this.showBanner?.('✨ Evolved!',name,1400);if(!this.yuzuEvolutionArt?.(m,col)){this.screenFlash?.(col,.3,260);this.vfxHitRing?.(m.spr.x,m.spr.y,col,true);}(typeof Sfx!=='undefined'&&Sfx.orderCue?.('yz_evolve_f'+Math.max(2,f),.55,.5))||this.yuzuSound('grow',.6);}
  yuzuGuard(){
    if(this.character!=='yuzu')return 1;const m=this._yuzuCrew?.[0];if(!m)return 1;
    return this.dist(this.player.x,this.player.y,m.spr.x,m.spr.y)<170?Math.max(.55,1-.06*this.yuzuRank('loyal')-this.yuzuTalent('Guard')):1;
  }
  yuzuShield(fraction,seconds){const n=this.player.maxhp*fraction*(1+.15*this.yuzuRank('family')+this.yuzuTalent('Hp')),old=this._yzShield;this._yzShield={hp:Math.max(old?.hp||0,n),t:Math.max(old?.t||0,seconds)};const fx=this._yzFx?.find(q=>q.follow==='shield');if(fx){fx.t=0;fx.life=this._yzShield.t;}else this.yuzuFx('shield',this.player.x,this.player.y,95,this._yzShield.t,'shield');this.floatText?.(this.player.x,this.player.y-50,'Citrus shield',0xffe190);}
  yuzuAbsorb(dmg){const s=this._yzShield;if(!s||s.t<=0)return dmg;const n=Math.min(s.hp,dmg);s.hp-=n;if(s.hp<=0)this._yzShield=null;return dmg-n;}
  yuzuEnemies(){const out=[];this.enemies.children.iterate(e=>{if(this.yuzuCombatTarget(e))out.push(e);});return out;}
  yuzuTarget(x,y,r,far=false,skip=null){let best=null,rank=-1,bd=far?-1:r;for(const e of this.yuzuEnemies()){if(!this.yuzuCombatTarget(e)||skip?.has(e)&&(!(skip instanceof Map)||skip.get(e)===(e._yzSpawnId||0)))continue;const d=this.dist(x,y,e.x,e.y),priority=this.yuzuFocusRank(e);if(d<=r&&(priority>rank||priority===rank&&(far?d>bd:d<bd))){best=e;rank=priority;bd=d;}}return best;}
  yuzuCluster(range){const L=this.yuzuEnemies().filter(e=>this.yuzuCombatTarget(e)&&this.dist(e.x,e.y,this.player.x,this.player.y)<range);let best=null,bn=-1;const candidates=L.filter(e=>this.yuzuEnemyPriority(e)>0);for(let i=0;i<L.length;i+=Math.max(1,Math.ceil(L.length/20)))if(!candidates.includes(L[i]))candidates.push(L[i]);for(const e of candidates){let n=this.yuzuEnemyPriority(e)*8;for(const q of L)if((q.x-e.x)**2+(q.y-e.y)**2<14400)n++;if(n>bn){bn=n;best=e;}}return best;}
  yuzuArea(m,x,y,r,mul,source,stun=0,arc=null){
    for(const e of this.yuzuEnemies()){if(this.dist(x,y,e.x,e.y)>r+(e.body?.halfWidth||0))continue;if(arc!=null&&Math.cos(Math.atan2(e.y-y,e.x-x)-arc)<0)continue;
      if(stun&&!e.isBoss&&!e.isMini){e.knock=Math.max(e.knock||0,stun);e.setVelocity?.(0,0);}if(source==='blend_fire'||source==='blend_final')this.applyBurn?.(e,this.yuzuPower()*mul*.15,this.yuzuPower()*mul*.45,3);this.yuzuHit(m,e,this.yuzuPower()*mul*(['fortress','rain','infusion','bloom'].includes(source)?(this.uniquePower?.()||1):1),source);}
    if(source==='slam'&&this.hubMotionAllowed?.()!==false){this.hitStop?.(35);this.screenShake?.(100,.004);}
    if(source==='sweep'){const a=arc||0;if(!this.yuzuSkillFx('peel',x+Math.cos(a)*r*.22,y+Math.sin(a)*r*.22,r*2,a,{life:.32}))this.yuzuAttackFx(0,x+Math.cos(a)*r*.28,y+Math.sin(a)*r*.28,r*2,a+Math.PI);}
    if(source==='slam'||source==='fortress'){if(!this.yuzuSkillFx('slam',x,y,r*2.2,0,{ground:true,life:.65}))this.yuzuFx('slam',x,y,r*2.2);}
    if(source==='rain'){if(!this.yuzuSkillFx('rain',x,y,r*2.2,0,{ground:true,life:.48}))this.yuzuFx('rain',x,y,r*2.2,.4);}
    if(source==='infusion'||source==='bloom'){const flavor=['sweet','sour','spicy'][(this._yzShowFlavor=(this._yzShowFlavor||0)+1)%3];this.yuzuSkillFx(flavor,x,y,r*1.75,0,{ground:true,life:.65});}this.vfxHitRing?.(x,y,({lime:0x9fe879,bloodorange:0xea85a4})[m.kind]||0xffd873,false);
  }
  yuzuShot(m,x,y,angle,amount,opt={}){
    const L=this._yzShots||(this._yzShots=[]);if(L.length>=48||opt.mini&&L.filter(q=>q.mini).length>=24)return;this.yuzuSound(opt.seed?'seed':opt.burn?'spicy':'arrow',.15,.22);
    const shotClip=opt.element||((opt.focusFinal||opt.source==='command_arrow')?'pierce':opt.burn?'comet':!opt.seed?'arrow':null),outline=shotClip&&'bpx_yuzu810_'+shotClip,outlined=!!(outline&&this.realTex?.(outline));
    const roleArt=!!(opt.minionRole||opt.element||opt.formArrow)&&this.textures.exists('yz_mn97_shots'),roleFrame=opt.element?({fire:3,frost:4,lightning:5})[opt.element]:Math.max(0,Math.min(2,(opt.formArrow||1)-1)),seedArt=!outlined&&!roleArt&&opt.mini&&opt.source==='seedling'&&this.textures.exists('yzs_seed_shot');
    const finalArt=(opt.focusFinal||opt.source==='command_arrow')&&this.textures.exists('yz_51_lime')&&(typeof Save==='undefined'||Save.data?.settings?.vfx!==0),painted=outlined||roleArt||seedArt||finalArt||!opt.seed&&this.textures.exists('yz_47_attacks'),key=outlined?outline:roleArt?'yz_mn97_shots':seedArt?'yzs_seed_shot':finalArt?'yz_51_lime':painted?'yz_47_attacks':this.textures.exists('proj_yuzu')?'proj_yuzu':this.textures.exists('proj_sprinkle')?'proj_sprinkle':'vfx_glow';
    const frame=outlined?0:roleArt?roleFrame:seedArt?0:finalArt?6:opt.burn?3:1,u=this.yuzuBuff();
    const shotSize=opt.size||(opt.focusFinal||opt.source==='command_arrow'?98:opt.source==='focus_arrow'?52:null);
    const spr=this.camWorld((painted?this.add.sprite(x,y,key,frame):this.add.image(x,y,key)).setDisplaySize(shotSize||(painted?(opt.burn?45:42):opt.seed?11:20),shotSize||(painted?(opt.burn?45:42):8)).setRotation(angle).setDepth(90000));
    if(outlined)this.battleOutlineTrack?.(spr,key,key,null,true);
    if(!painted)spr.setTint(opt.seed?0xffd975:0xb8ef85);
    if(m&&!opt.seed&&opt.source==='arrow')this.yuzuSkillFx('volley',x,y,72,angle,{life:.24});
    if(m&&opt.burn)this.yuzuSkillFx('spicy',x,y,148,angle,{life:.42});
    L.push({spr,m,x,y,angle,seedArt,seedArtTime:0,player:this.player,basic:this.basicAttack,epoch:this._artEpoch||0,blendPower:u?.power||1,seek:!!opt.seek,focusFinal:!!opt.focusFinal,finalSplash:opt.finalSplash||0,speed:opt.speed||440,life:opt.life||1.35,amount,hit:new Map(),pierce:opt.pierce||0,first:!!opt.first,source:opt.source||'arrow',element:opt.element||null,seed:!!opt.seed,burn:!!opt.burn,cmdMark:!!opt.cmdMark,mini:!!opt.mini});
  }
  yuzuShootFan(m,target,n,mul=1,source='volley'){
    if(!target)return;const a=Math.atan2(target.y-m.spr.y,target.x-m.spr.x),spread=.14;this.yuzuSkillFx('volley',m.spr.x,m.spr.y,150,a,{life:.4});
    for(let i=0;i<n;i++)this.yuzuShot(m,m.spr.x,m.spr.y,a+(i-(n-1)/2)*spread,this.yuzuPower()*mul,{pierce:3,source,first:true});
    m.attack=.35;this.yuzuSound('volley',.4);
  }
  yuzuZone(m,kind,x,y,r,life,mul=0){const L=this._yzZones||(this._yzZones=[]);if(L.length>=10){const o=L.shift();o.spr?.destroy();}const outline=this.yuzuOutlineKey?.(kind==='trap'?'rain':kind==='sour'?'sour':'sweet'),fresh=kind==='sour'&&this.textures.exists('yz_bo96_arsenal'),painted=kind==='sour'&&(fresh||this.textures.exists('yz_54_bloodorange')),alpha=fresh?.38:.18,spr=this.camWorld(outline?this.add.sprite(x,y,outline,0).setDisplaySize(r*2,r*2).setAlpha(.3).setDepth(3):painted?this.add.sprite(x,y,fresh?'yz_bo96_arsenal':'yz_54_bloodorange',10).setDisplaySize(r*2,r*2).setAlpha(alpha).setDepth(3):this.add.circle(x,y,r,kind==='trap'?0xa6e56e:kind==='sour'?0xbee96a:0xf6a45c,.12).setStrokeStyle(2,kind==='sour'?0xc2ee78:0xffce88,.7).setDepth(3));if(outline)this.battleOutlineTrack?.(spr,outline,outline,null,true);L.push({m,kind,x,y,r,life,tick:0,mul,spr,alpha:painted?alpha:1,player:this.player,basic:this.basicAttack,epoch:this._artEpoch||0});}
  yuzuSlow(e){
    if(this.character!=='yuzu')return 1;let f=1;const m=this._yuzuCrew?.[0];
    if(m?.kind==='bloodorange'&&this.dist(e.x,e.y,this.player.x,this.player.y)<=160+30*this.yuzuRank('y_elder'))f=.85-this.yuzuTalent('Aroma');
    if(!e.isBoss&&!e.isMini)for(const z of this._yzZones||[])if(z.kind==='root'&&this.dist(z.x,z.y,e.x,e.y)<z.r)return 0;
    return Math.max(0,f);
  }
  yuzuVulnerable(e){if(this.character!=='yuzu')return 1;let f=1;const tag=this._yzSourTags?.get(e);if(tag&&tag.id===e._yzSpawnId&&tag.t>0)f=1.15+.02*this.yuzuRank('p_sourMixer')+this.yuzuTalent('Sour');for(const z of this._yzZones||[])if(z.kind==='sour'&&this.dist(z.x,z.y,e.x,e.y)<z.r)f=Math.max(f,1.2+.04*this.yuzuRank('p_sourMixer')+this.yuzuTalent('Sour'));return f;}
  yuzuTaunt(e){const m=this._yuzuCrew?.[0];if(!(this.character==='yuzu'&&m?.kind==='pomelo'&&!e.isBoss&&!e.isMini&&!e._waveObjectiveTarget&&!e._wispRaider&&!e._fleeing))return null;if(this.dist(e.x,e.y,m.spr.x,m.spr.y)<140+this.yuzuTalent('Taunt'))return m.spr;
    return null;}
  yuzuSeedPaint(q,dt){
    const sp=q.spr;if(!sp?.active||this.state!=='play'||q.player!==this.player||q.basic!==this.basicAttack||q.epoch!==(this._artEpoch||0))return;
    const key=this.yuzuMinionArt(q),painted=this.textures.exists(key),red=this.hubMotionAllowed?.()===false;
    const moved=Math.hypot(sp.x-(q.paintX??sp.x),sp.y-(q.paintY??sp.y));q.paintX=sp.x;q.paintY=sp.y;
    q.walkPaint=(q.walkPaint||0)+Math.min(1,moved/YZ_SEED_SIZE)*1.6;
    if(q.attackPaint!=null){q.attackPaint+=Math.max(0,dt);if(q.attackPaint>=.24)q.attackPaint=null;}
    let frame=red||moved<.3?0:Math.floor(q.walkPaint)%4;
    if(q.attackPaint!=null)frame=red?5:Math.min(7,5+Math.floor(q.attackPaint/.08));
    else if(!red&&q.cd<=.1&&this.yuzuCombatTarget(q.target)&&this.dist(sp.x,sp.y,q.target.x,q.target.y)<(q.kind==='throw'?300:(q.target.body?.halfWidth||14)+26))frame=4;
    if(painted){sp.stop?.();if(sp.texture?.key!==key)sp.setTexture(key,frame);else sp.setFrame(frame);}
    else if(sp.texture?.key==='yzs_regrow'||(sp.texture?.key?.startsWith('yzs_seed_')||sp.texture?.key?.startsWith('yz_mn97_'))){const fallback=this.textures.exists('minion_yuzling')?'minion_yuzling':'vfx_glow';sp.setTexture(fallback,0);if(fallback==='minion_yuzling'&&this.anims?.exists?.('minion_yuzling_walk'))sp.play?.('minion_yuzling_walk');}
    q.hurtPaint=0;sp.clearTint?.();if(!painted)sp.setTint?.(q.cfg.color);
    sp.setDisplaySize(YZ_SEED_SIZE,YZ_SEED_SIZE).setAlpha(1);
    q.shadow?.setPosition(sp.x,sp.y+YZ_SEED_SIZE*(120/128-.5)).setDepth(sp.y-1).setVisible(true);
  }
  yuzuSeedGrow(q,n){
    const sp=q.spr,settings=typeof Save==='undefined'?{}:Save.data?.settings||{},red=this.hubMotionAllowed?.()===false,window=red?.12:.45;
    if(!this.textures.exists('yzs_regrow')||settings.vfx===0||q.regrow>window){sp.setVisible(false);q.shadow?.setVisible(false);return;}
    const a=q.idx/Math.max(1,n)*Math.PI*2,x=this.player.x+Math.cos(a)*60,y=this.player.y+Math.sin(a)*60,frame=red?5:Math.min(5,Math.floor((.45-Math.max(0,q.regrow))/.45*6));
    sp.stop?.();if(sp.texture?.key!=='yzs_regrow')sp.setTexture('yzs_regrow',frame);else sp.setFrame(frame);
    sp.clearTint?.();sp.setPosition(x,y).setDepth(y).setDisplaySize(YZ_SEED_SIZE,YZ_SEED_SIZE).setVisible(true).setAlpha(1);
    q.shadow?.setPosition(x,y+YZ_SEED_SIZE*(120/128-.5)).setDepth(y-1).setVisible(true);
  }
  yuzuElementHit(q,e,amount){
    if(!q.element||!e?.active||!(e.hp>0))return;const now=this.elapsed||0;
    if(q.element==='fire')this.applyBurn?.(e,amount*.06,amount*.18,1.2);
    if(q.element==='frost'&&(e._yzMinionFrostId!==e._yzSpawnId||now>=(e._yzMinionFrostAt??-1))){e._yzMinionFrostAt=now+2;e._yzMinionFrostId=e._yzSpawnId;this.applyFreeze?.(e,.16);}
    if(q.element==='lightning'&&(e._yzMinionArcId!==e._yzSpawnId||now>=(e._yzMinionArcAt??-1))){e._yzMinionArcAt=now+.5;e._yzMinionArcId=e._yzSpawnId;let other=null,near=80;for(const t of this.yuzuEnemies()){if(t===e||!this.yuzuCombatTarget(t))continue;const d=this.dist(t.x,t.y,e.x,e.y);if(d<near){near=d;other=t;}}if(other)this.yuzuHit(q.m,other,amount*.25,'element_arc');}
  }
  yuzuMinionStrike(q,t){
    const role=q.cfg.role||'fighter';
    if(role==='fighter'){this.yuzuHit(q,t,this.yuzuPower()*q.cfg.mul*.95,'minion_punch');const k=this.yuzuOutlineKey?.('peel');if(k&&this.heroFxThrottle?.('yzMini',3,120))this.heroFx?.(k,t.x,t.y,32,{rot:Math.atan2(t.y-q.spr.y,t.x-q.spr.x),depth:t.y+4,life:.18,alpha:.65});}
    else{const element=role==='mage'?['fire','frost','lightning'][((q.casts||0)+q.idx)%3]:null;q.casts=(q.casts||0)+1;this.yuzuShot(q,q.spr.x,q.spr.y,Math.atan2(t.y-q.spr.y,t.x-q.spr.x),this.yuzuPower()*q.cfg.mul*.95,{source:'seedling',mini:true,minionRole:role,element,size:role==='archer'?24:20,speed:role==='archer'?500:440,life:1.1,pierce:role==='archer'&&(this.basicAttack.lv?.companion_form||0)>=2?1:0});}
  }
  yuzuMinionArt(q){const key=({tank:'yz_mn97_guard',throw:'yz_mn97_archer',pop:'yz_mn97_mage'})[q.kind];return key&&this.textures.exists(key)?key:'yzs_seed_'+q.kind;}
  yuzuMinionHome(q,n,target=null){
    const leader=this._yuzuCrew?.[0],p=leader?.spr||this.player,aim=leader?.aim||0,role=q.cfg?.role||'fighter';
    if(target&&role==='fighter'&&this.dist(target.x,target.y,this.player.x,this.player.y)<650&&this.dist(target.x,target.y,p.x,p.y)<340){const a=Math.atan2(target.y-p.y,target.x-p.x)+Math.PI+((q.idx%8)-Math.min(7,n-1)/2)*.26,r=(target.body?.halfWidth||14)+18+Math.floor(q.idx/8)*18;return{x:target.x+Math.cos(a)*r,y:target.y+Math.sin(a)*r};}
    const row=Math.floor(q.idx/5),count=Math.max(1,Math.min(5,n-row*5)),a=aim+Math.PI+(q.idx%5-(count-1)/2)*.34+row*.12,r=(role==='fighter'?42:78)+row*28+(q.idx%2)*11;return{x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r};
  }
  yuzuMinionTarget(q,leader,foes){
    const focus=this.yuzuCombatTarget(leader?.target)?leader.target:null,p=q.spr||leader?.spr||this.player,cover=(q.idx||0)%3===2;let best=null,score=-Infinity;
    for(const e of foes){if(!this.yuzuCombatTarget(e)||this.dist(e.x,e.y,this.player.x,this.player.y)>650)continue;const rank=this.yuzuEnemyPriority(e),near=this.dist(e.x,e.y,(leader?.spr||this.player).x,(leader?.spr||this.player).y),assigned=(this._yzSeeds||[]).filter(o=>o!==q&&o.target===e).length,value=rank*10000-this.dist(e.x,e.y,p.x,p.y)-assigned*110+(e===focus?75:0)+(cover&&rank===0&&near<240?35000:0);if(value>score){score=value;best=e;}}return best;
  }
  yuzuSeedMax(){const b=this.basicAttack;if(this.character!=='yuzu'||!b)return 0;const r=Math.max(0,Math.min(5,this.yuzuRank('seedling'))),f=Math.max(0,Math.min(2,b.lv?.companion_form||0));return Math.min(typeof YZ_MINION_CAP==='undefined'?10:YZ_MINION_CAP,(b.path?2:1)+YZ_SEED_COUNT[r]+f+(b.evolved?YZ_SEED_EVO:0));}

  yuzuSeedSpawn(q,i,n){const p=this.yuzuMinionHome(q,n);q.alive=true;q.hp=q.maxhp||1;q.regrow=0;q.cd=.25+.11*(i%6)+.025*Math.floor(i/6);q.hurtT=0;q.pending=null;q.spr.setPosition(p.x,p.y).setVisible(true).setAlpha(1);q.attackPaint=null;q.walkPaint=0;q.hurtPaint=0;q.paintX=q.spr.x;q.paintY=q.spr.y;this.yuzuSeedPaint(q,0);}

  yuzuTickSeeds(dt){
    if(this.state==='menu'||this.state==='dead'||this.character!=='yuzu'||!this.player||this.player.active===false||!this.basicAttack){this.clearYuzuSeeds();return;}if(this.state!=='play')return;
    const b=this.basicAttack,p=this.player,want=this.yuzuSeedMax();let L=this._yzSeeds||(this._yzSeeds=[]);const cfg=YZ_SEED_KIND[b.path]||YZ_SEED_KIND.none;
    if(L.length&&(L[0].player!==p||L[0].basic!==b||L[0].kind!==cfg.t||L[0].epoch!==(this._artEpoch||0))){this.clearYuzuSeeds();L=this._yzSeeds;}
    while(L.length>want){const q=L.pop();q.spr?.destroy();q.shadow?.destroy();}
    while(L.length<want){const art=this.yuzuMinionArt({kind:cfg.t}),key=this.textures.exists(art)?art:this.textures.exists('minion_yuzling')?'minion_yuzling':'vfx_glow',spr=this.camWorld(this.add.sprite(p.x,p.y,key,0).setDisplaySize(YZ_SEED_SIZE,YZ_SEED_SIZE).setDepth(p.y));if(key!==art)spr.setTint(cfg.color);
      const shadow=this.add.graphics?this.camWorld(this.add.graphics().setPosition(p.x,p.y)):this.add.ellipse?this.camWorld(this.add.ellipse(p.x,p.y,16,5,0x17111b,.16)):null; if(shadow?.fillEllipse)shadow.fillStyle(0x17111b,.09).fillEllipse(0,0,28,10).fillStyle(0x17111b,.18).fillEllipse(0,0,18,6);   /* v8.1.149 เจ้าของ: ลูกน้อง Yuzu มีเงานุ่ม 2 ชั้น */
      const q={spr,shadow,kind:cfg.t,cfg,maxhp:1,player:p,basic:b,epoch:this._artEpoch||0,idx:L.length,vx:0,vy:0,retarget:0,target:null,combo:0,seen:new WeakMap()};L.push(q);this.yuzuSeedSpawn(q,q.idx,want);}
    const leader=this._yuzuCrew?.[0],foes=this.yuzuEnemies();
    for(const q of L){const sp=q.spr;q.alive=true;q.hp=q.maxhp||1;q.regrow=0;q.cd-=dt;q.retarget-=dt;
      if(q.pending){const a=q.pending;a.t-=dt;if(a.t<=0){q.pending=null;if(this.yuzuCombatTarget(a.target)&&(a.target._yzSpawnId||0)===a.id&&this.dist(sp.x,sp.y,a.target.x,a.target.y)<(q.cfg.role==='fighter'?(a.target.body?.halfWidth||14)+60:470))this.yuzuMinionStrike(q,a.target);else q.cd=Math.min(q.cd,.15);}}
      if(q.retarget<=0||!this.yuzuCombatTarget(q.target)){q.retarget=.25+(q.idx%4)*.03;const old=q.target;q.target=this.yuzuMinionTarget(q,leader,foes);if(q.target&&q.target!==old&&q.cd<=0)q.cd=.035+(q.idx%7)*.045;}
      const t=this.yuzuCombatTarget(q.target)?q.target:null,home=this.yuzuMinionHome(q,L.length,t);let tx=home.x,ty=home.y;
      if(t){const d=this.dist(sp.x,sp.y,t.x,t.y),role=cfg.role||'fighter';if(q.cd<=0&&!q.pending&&d<(role==='fighter'?(t.body?.halfWidth||14)+46:440)){q.cd=Math.max(.3,this.yuzuCd(cfg.cd)*(1-.08*(this.basicAttack.lv?.companion_form||0))*(.94+((q.idx*37)%11)*.012));q.attackPaint=0;q.pending={target:t,id:t._yzSpawnId||0,t:.08};}
        if(Math.abs(t.x-sp.x)>6)sp.setFlipX(t.x<sp.x);}
      const anchor=leader?.spr||p;if(this.dist(sp.x,sp.y,p.x,p.y)>850||this.dist(sp.x,sp.y,anchor.x,anchor.y)>550){sp.setPosition(tx,ty);q.vx=q.vy=0;}
      const dx=tx-sp.x,dy=ty-sp.y,d=Math.hypot(dx,dy),v=d>4?Math.min(340,d*5):0,k=1-Math.exp(-12*dt);q.vx+=((d>1?dx/d*v:0)-q.vx)*k;q.vy+=((d>1?dy/d*v:0)-q.vy)*k;const pt=inMapPt(sp.x+q.vx*dt,sp.y+q.vy*dt);sp.setPosition(pt[0],pt[1]).setDepth(pt[1]);this.yuzuSeedPaint(q,dt);
    }
  }

  yuzuSeedPop(q){if(!q)return;q.alive=true;q.hp=q.maxhp||1;q.regrow=0;q.spr?.setVisible(true);q.shadow?.setVisible(true);} // Compatibility: old damage callers cannot down a Minion.

  yuzuMotion(m,x,y,kind,mul=2.5,r=90,duration=.45){if(kind==='roll')this.yuzuSound('roll',.4);const p=inMapPt(x,y);m.action=null;m.aim=Math.atan2(p[1]-m.spr.y,p[0]-m.spr.x);m.spr.setFlipX(Math.cos(m.aim)<0);m.motion={sx:m.spr.x,sy:m.spr.y,tx:p[0],ty:p[1],t:0,duration,prep:kind==='rush'?0:kind==='roll'?.12:.16,kind,mul,r,hit:new Map()};m.lunge=null;m.vx=m.vy=0;if(kind==='roll'||kind==='rush')this.yuzuSkillFx(m.kind==='pomelo'?'roll':m.kind==='lime'?'volley':'spicy',m.spr.x,m.spr.y,kind==='roll'?150:100,m.aim,{life:Math.min(.85,duration+.12),follow:m});}
  // v8.0.60 owner: frequent Dashes kept yanking the companion off its target. Rush only when it is not fighting, at most once per 1.2s.
  yuzuRush(){const m=this.yuzuEnsure();if(!m)return;
    if(this.basicAttack.mutation==='parting')this.yuzuZone(m,'sour',m.spr.x,m.spr.y,65,2,.3);if(this.yuzuTalent('DashShield'))this.yuzuShield(.08,2);
    const busy=m.action||m.motion||m.target&&this.yuzuCombatTarget(m.target)&&m.target._yzSpawnId===m.targetId,now=this.elapsed||0;
    if(busy||now-(this._yzRushAt??-9)<1.2)return;this._yzRushAt=now;const p=this.player,mv=this.moveDir||{},t=this.yuzuTarget(p.x,p.y,500),a=mv.x||mv.y?Math.atan2(mv.y,mv.x):t?Math.atan2(t.y-p.y,t.x-p.x):0;
    this.yuzuSound('rush',.3);this.yuzuMotion(m,p.x+Math.cos(a)*220,p.y+Math.sin(a)*220,'rush',2,42,.3);
  }
  // v8.1.25 เจ้าของ: Unique Cut-in (Yuzu ก่อน) · ทุกครั้งที่ใช้ · ~0.7 วิ สโลว์ 20% → ท่าลงตอนจบ · ปิดได้ใน Settings (Unique Cut-in) · อาร์ตจริงใบ 64 cutin_yuzu_<kind> ยังไม่มา = ใช้ภาพตัวละครเดิม
  uniqueCutin(hero,kind,name,color,done){
    // v8.1.27 เจ้าของ: แถบเฉียงกวาดซ้าย→ขวา (ไม่มีม่านดำ) · ค้างสั้น ๆ · ตอนหุบ (หางแถบกวาดตามไปทางขวา) เกมสโลว์เล็กน้อย · ใกล้จบท่าค่อยออก
    const S=(typeof Save!=='undefined'&&Save.data?.settings)||{};if(S.cutin===false||!this.add||!this.cameras?.main){done();return;}
    const W=this.W,H=this.H,epoch=this._artEpoch||0,objs=[],ui=o=>{this.camUI?.(o);o.setScrollFactor?.(0);objs.push(o);return o;},motion=this.hubMotionAllowed?.()!==false;
    const bh=Math.min(H*.12,W*.27),by=H*.66,sl=bh*.2,band=ui(this.add.graphics().setDepth(99991));
    const draw=(a,b)=>{band.clear();if(b<=a)return;const x0=a*(W+sl*2)-sl,x1=b*(W+sl*2)-sl,y=x=>by-bh*.42-(x/W)*bh*.2;band.fillStyle(color,.92);band.beginPath();band.moveTo(x0,y(x0));band.lineTo(x1,y(x1));band.lineTo(x1,y(x1)+bh*1.04);band.lineTo(x0,y(x0)+bh*1.04);band.closePath();band.fillPath();band.lineStyle(3,0xfff3c4,.95);band.strokePath();};
    const real='cutin_'+hero+'_'+kind,has=this.textures.exists(real);
    const add=(key,frame,x,h,flip)=>{if(!this.textures.exists(key))return null;const o=ui(this.add.image(x,by,key,frame).setDepth(99992));o.setScale(h/Math.max(1,o.height));if(flip)o.setFlipX(true);return o;};
    const arts=(has?[add(real,0,W*.5,bh*1.25)]:[add('char_'+hero,0,W*.32,bh*1.15),add('yz_'+kind,0,W*.7,bh*1.05,true)]).filter(Boolean);
    const txt=ui(this.add.text(W/2,by+bh*.5,name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.round(Math.min(22,W*.055))+'px',color:'#ffffff',stroke:'#3a1a10',strokeThickness:4}).setOrigin(.5).setDepth(99993));
    const show=[...arts,txt],T={a:0,b:motion?0:1};show.forEach(o=>o.setAlpha(motion?0:1));draw(T.a,T.b);this._cutinOn=true;
    const IN=220,HOLD=260,OUT=280;let fin=false,dead=false,slowed=false,oldPhys=1;
    const slow=on=>{const w=this.physics?.world;if(!w||this._isHitStop)return;if(on&&!slowed){slowed=true;oldPhys=w.timeScale;w.timeScale=2;}else if(!on&&slowed){slowed=false;w.timeScale=oldPhys;}};   // 2 = ช้าลงครึ่งหนึ่ง (กลับด้าน)
    const end=()=>{if(fin)return;fin=true;this._cutinOn=false;slow(false);objs.forEach(o=>o.active&&o.destroy());};
    this.events.once('shutdown',()=>{dead=true;end();});
    const cast=()=>{if(dead||(this._artEpoch||0)!==epoch||!this.player?.active)return;if(this.state==='play')done();else this.time.delayedCall(150,cast);};   // ท่าออกเมื่อกำลังเล่น (กันชนหน้าเลเวลอัป/หยุด)
    if(motion){this.tweens.add({targets:T,b:1,duration:IN,ease:'Quad.out',onUpdate:()=>draw(T.a,T.b)});arts.forEach((o,i)=>{const tx=o.x;o.x=tx-W*.25;this.tweens.add({targets:o,x:tx,alpha:1,duration:IN+60,delay:i*50,ease:'Back.out'});});this.tweens.add({targets:txt,alpha:1,duration:160,delay:IN*.6});
      this.time.delayedCall(IN+HOLD,()=>{if(fin)return;slow(true);this.tweens.add({targets:T,a:1,duration:OUT,ease:'Quad.in',onUpdate:()=>draw(T.a,T.b)});this.tweens.add({targets:show,alpha:0,duration:OUT*.8});});}
    else this.time.delayedCall(IN+HOLD,()=>slow(true));
    if(typeof Sfx!=='undefined')(Sfx.bp?.('uq_yuzu_parade',.45,.6)||Sfx.select?.());
    this.time.delayedCall(IN+HOLD+OUT*.8,cast);this.time.delayedCall(IN+HOLD+OUT,end);
  }
  yuzuParadeCast(ul){
    const m=this.yuzuEnsure();if(!m)return;this._yzPendingBlend=null;
    if(this._yzBuff)this.yuzuEndBuff(this._yzBuff,false);
    m.action=null;m.lunge=null;m.boost=0;
    const p=this.player,b=this.basicAttack,k=m.kind,mut=b.uqMut,total=4+(p.yuzuParade?2:0)+this.yuzuTalent('UniqueTime')+(k==='lime'&&mut==='toss_rain'?1.5:0);   // v8.0.64 Citrus Command: the big move comes first, then 4s In Sync
    const u=this._yzBuff={m,player:p,basic:b,epoch:this._artEpoch||0,kind:k,t:total,total,ul:ul||1,power:this.uniquePower?.()||1,mut,marks:0,push:.6,finished:false,cmd:true};this._yzBurst=[];this._yzRain=null;this._yzInfusion=null;
    const newArt=this.yuzuEmpowerFx(k,'open',m.spr.x,m.spr.y,165,k==='lime'?m.aim||0:0,{life:.65,follow:m,important:true});
    const extra=(b.mutation==='hardy'?.12:0)+this.yuzuTalent('ReviveShield')*.12;
    if(k==='pomelo'){this.yuzuShield(.25+.04*(u.ul-1)+(mut==='ripe_shield'?.15:0)+extra,total+this.yuzuTalent('ShieldTime'));if(mut==='ripe_fest'){u.power*=1.15;}if(!newArt)this.yuzuSkillFx('slam',m.spr.x,m.spr.y,240,0,{ground:true,life:.7});}
    else if(k==='bloodorange'){this.yuzuShield(.18+.03*(u.ul-1)+(mut==='grow_grove'?.2:0)+extra,total+this.yuzuTalent('ShieldTime'));if(!newArt){this.yuzuFx('infusion',p.x,p.y,300,Math.min(1,total),'player');this.yuzuSkillFx('sweet',p.x,p.y,150,0,{follow:'player',life:.7});}}
    else if(extra>0)this.yuzuShield(extra,3+this.yuzuTalent('ShieldTime'));
    if(k==='yuzling')this.yuzuShield(.1+extra,3);
    if(!newArt)this.yuzuSkillFx(k==='lime'?'volley':k==='pomelo'?'peel':'sweet',m.spr.x,m.spr.y,150,m.aim||0,{life:.6});
    this.yuzuSound(({pomelo:'fortress',lime:'rain',bloodorange:'infusion'})[k]||'rush',.5,.55);this.showBanner(this.uniqueInfo().name,'In Sync!',1100);
    const pt=this._yzCmdPt||this.yuzuCmdPoint(null);this._yzCmdPt=null;this.yuzuCommand(u,pt);
    // Yuzu joins her companion's command: a real seed can mark a target for the existing In Sync bonus.
    const a=pt.ang??Math.atan2(pt.y-p.y,pt.x-p.x),d=Math.hypot(pt.x-p.x,pt.y-p.y);
    this.yuzuShot(null,p.x,p.y,a,this.yuzuPower()*.8*u.power,{seed:true,source:'duo_seed',speed:850,life:Math.max(.35,Math.min(1,(d+80)/850)),pierce:k==='lime'?2:0});
    this.bpPose?.('char_yuzu_combo_motion823',.5);
    // v8.1.30 เจ้าของ: เลิก cut-in · ท่าประสาน — จังหวะที่คู่หูลงท่า Yuzu ยิงเมล็ด 3 ลูกแบบพัดเข้าจุดเดียวกัน
    const ep=this._artEpoch||0;this.time?.delayedCall?.(450,()=>{if(this.state!=='play'||(this._artEpoch||0)!==ep||!p.active)return;const a2=Math.atan2(pt.y-p.y,pt.x-p.x),d2=Math.hypot(pt.x-p.x,pt.y-p.y);
      // v8.1.31 เจ้าของ: ท่าประสานต่างกันตามคู่หู · pomelo = วงเมล็ดระเบิดออกจากจุดกระแทก · lime = เมล็ดทองลูกเดียวทะลุทั้งแนว · bloodorange = เมล็ดตามเป้า 5 ลูก · ไม่มีคู่หู = พัด 3 ลูก
      const yp=this.yuzuPower()*u.power,life=Math.max(.35,Math.min(1,(d2+80)/900));
      if(k==='pomelo'){for(let i=0;i<8;i++)this.yuzuShot(null,pt.x,pt.y,i*Math.PI/4,yp*.4,{seed:true,source:'duo_finish',speed:520,life:.45,pierce:2});}
      else if(k==='lime'){this.yuzuShot(null,p.x,p.y,a2,yp*1.6,{seed:true,source:'duo_finish',speed:1150,life:.9,pierce:99});}
      else if(k==='bloodorange'){for(let i=0;i<5;i++)this.yuzuShot(null,p.x,p.y,a2+(i-2)*.35,yp*.45,{seed:true,source:'duo_finish',speed:620,life:1.1,seek:true,pierce:0});}
      else for(const o of [-.16,0,.16])this.yuzuShot(null,p.x,p.y,a2+o,yp*.6,{seed:true,source:'duo_finish',speed:900,life,pierce:1});
      if(typeof DuoVoice!=='undefined')DuoVoice.play(this,k,u);this.bpPose?.('char_yuzu_combo_motion823',.4);this.screenShake?.(k==='pomelo'?140:90,k==='pomelo'?.007:.004);(typeof Sfx!=='undefined'&&Sfx.orderCue?.('yz_triple_arrow',.35,.4));});
  }
  // v8.0.64 owner picked Citrus Command: hold the Unique to aim a spot (auto = 🎯 mark / priority target), the companion does its big move there.
  isYuzuCommand(){return this.character==='yuzu'&&!!this.basicAttack;}
  yuzuCmdPoint(s){const p=this.player;if(!p)return{x:0,y:0};const R=380;let x,y;
    if(s?.dragged){const d=Math.min(R,Math.max(160,(s.dl||0)*2.2));x=p.x+Math.cos(s.ang)*d;y=p.y+Math.sin(s.ang)*d;}
    else{const t=this.yuzuMarked()||this.yuzuTarget(p.x,p.y,440);if(t){x=t.x;y=t.y;}else{const mv=this.moveDir||{},a=mv.x||mv.y?Math.atan2(mv.y,mv.x):(p.flipX?Math.PI:0);x=p.x+Math.cos(a)*220;y=p.y+Math.sin(a)*220;}}
    const d=this.dist(p.x,p.y,x,y);if(d>R){x=p.x+(x-p.x)*R/d;y=p.y+(y-p.y)*R/d;}const q=typeof inMapPt==='function'?inMapPt(x,y):[x,y];return{x:q[0],y:q[1],ang:s?.dragged?s.ang:null};}
  // v8.0.65 ค: Pomelo leaps at most 450px from where it stands
  yuzuCmdLeapPt(m,pt){const d=this.dist(m.spr.x,m.spr.y,pt.x,pt.y);if(d<=450)return{x:pt.x,y:pt.y,d};const k=450/d;return{x:m.spr.x+(pt.x-m.spr.x)*k,y:m.spr.y+(pt.y-m.spr.y)*k,d:450};}
  yuzuCmdAim(s){const m=this.yuzuEnsure(),g=s.g;if(!m||!g)return;const pt=s.pt=this.yuzuCmdPoint(s),k=m.kind,t=this.elapsed||0;g.clear();
    if(k==='lime'){const a=pt.ang??Math.atan2(pt.y-m.spr.y,pt.x-m.spr.x),L=pt.ang!=null?800:this.dist(m.spr.x,m.spr.y,pt.x,pt.y)+400,ex=m.spr.x+Math.cos(a)*L,ey=m.spr.y+Math.sin(a)*L;g.lineStyle(26,0xafe57a,.16);g.lineBetween(m.spr.x,m.spr.y,ex,ey);g.lineStyle(3,0xeaffc8,.8);g.lineBetween(m.spr.x,m.spr.y,ex,ey);}
    else{const q=k==='bloodorange'?pt:this.yuzuCmdLeapPt(m,pt),r=k==='pomelo'?160:k==='bloodorange'?150:120,c=k==='bloodorange'?0xdf87a7:0xffd77b;g.fillStyle(c,.14);g.fillCircle(q.x,q.y,r);g.lineStyle(3,c,.75+.2*Math.sin(t*10));g.strokeCircle(q.x,q.y,r);g.lineStyle(2,0xffffff,.35);g.lineBetween(m.spr.x,m.spr.y,q.x,q.y);g.fillStyle(0xffffff,.85);g.fillCircle(q.x,q.y,5);return;}
    g.fillStyle(0xffffff,.85);g.fillCircle(pt.x,pt.y,5);}
  yuzuCommand(u,pt){const m=u.m,k=u.kind,pw=u.power,ul=u.ul;
    if(k==='pomelo'||k==='yuzling'){const q=this.yuzuCmdLeapPt(m,pt);this.yuzuMotion(m,q.x,q.y,'command',(k==='pomelo'?6:3)+.5*(ul-1),(k==='pomelo'?160:120)+this.yuzuTalent('Slam'),Math.max(.35,Math.min(.7,.35+q.d/1200)));if(m.motion)m.motion.cmd=u;return;}
    if(k==='lime'){const a=pt.ang??Math.atan2(pt.y-m.spr.y,pt.x-m.spr.x),L=pt.ang!=null?800:this.dist(m.spr.x,m.spr.y,pt.x,pt.y)+400;m.aim=a;m.attack=.45;m.action=null;
      this.yuzuShot(m,m.spr.x+Math.cos(a)*16,m.spr.y+Math.sin(a)*16,a,this.yuzuPower()*(5+.4*(ul-1))*pw,{pierce:99,source:'command_arrow',speed:950,life:L/950,seek:u.mut==='toss_home',cmdMark:true,focusFinal:true,finalSplash:55+this.yuzuTalent('Rain')});for(const da of [-.16,.16])this.yuzuShot(m,m.spr.x+Math.cos(a+da)*16,m.spr.y+Math.sin(a+da)*16,a+da,this.yuzuPower()*(3+.25*(ul-1))*pw,{pierce:99,source:'command_arrow',speed:950,life:L/950,finalSplash:45});this.screenShake?.(160,.008);(typeof Sfx!=='undefined'&&Sfx.orderCue?.('yz_triple_arrow',.5,.3));   /* v8.0.90 เจ้าของ: Piercing Shot แรงขึ้น — ยิง 3 ดอกแบบพัด */
      if(!this.yuzuEmpowerFx('lime','finish',m.spr.x,m.spr.y,210,a,{life:.42}))this.yuzuSkillFx('volley',m.spr.x,m.spr.y,210,a,{life:.45});this.yuzuSound('volley',.4,.6);return;}
    u.storm={x:pt.x,y:pt.y,n:u.mut==='grow_burst'?4:3,t:.3};this.yuzuArsenalFx('sigil',pt.x,pt.y,300,0,{ground:true,life:1.4});}
  yuzuCommandLand(m,q){const u=q.cmd;this.yuzuArea(m,q.tx,q.ty,q.r,q.mul*(u?.power||1),'command',.8);if(m.kind==='pomelo'){this.screenShake?.(260,.014);this.hitStop?.(70);const ep=this._artEpoch||0;[[350,1.5,.6],[700,2,.45]].forEach(([ms,rk,mk])=>this.time?.delayedCall?.(ms,()=>{if(this.state!=='play'||(this._artEpoch||0)!==ep||!m.spr?.active)return;this.yuzuArea(m,q.tx,q.ty,q.r*rk,q.mul*mk*(u?.power||1),'command',.5);this.yuzuSkillFx('slam',q.tx,q.ty,q.r*rk*2.2,0,{ground:true,life:.5});this.screenShake?.(140,.007);(typeof Sfx!=='undefined'&&Sfx.orderCue?.('yz_aftershock',.4,.2))||this.yuzuSound('slam',.25,.3);}));}   /* v8.0.90 เจ้าของ: Meteor Peel แรงขึ้น — แผ่นดินไหวต่อ 2 วง */if(!this.yuzuEmpowerFx(m.kind==='pomelo'?'pomelo':'yuzling','finish',q.tx,q.ty,q.r*2.2,0,{ground:true,life:.72}))this.yuzuSkillFx('slam',q.tx,q.ty,q.r*2.2,0,{ground:true,life:.7});if(!this.yuzuSound('slam',.4,.6))Sfx.boom?.();}
  yuzuTickStorm(u,dt){const s=u.storm;if(!s||s.n<=0)return;s.t-=dt;if(s.t>0)return;s.n--;s.t=.45;const fin=s.n===0;this.yuzuArea(u.m,s.x,s.y,fin?230:150,(fin?2.4:1)*(2.2+.2*(u.ul-1))*u.power,'command',fin?.6:0);if(fin){this.screenShake?.(240,.012);(typeof Sfx!=='undefined'&&Sfx.orderCue?.('yz_storm_final',.55,.3));this.hitStop?.(60);this.yuzuArsenalFx('sigil',s.x,s.y,460,0,{ground:true,life:.6});}   /* v8.0.90 เจ้าของ: Flavor Storm แรงขึ้น — ระเบิดสุดท้ายใหญ่ ×2.4 วงกว้าง 230 */this.yuzuArsenalFx('sigil',s.x,s.y,300,0,{ground:true,life:.45});this.yuzuSound('slam',.25,.4);
    for(const e of this.yuzuEnemies()){if(e.isBoss||e.isMini||e._waveObjectiveTarget)continue;const d=this.dist(e.x,e.y,s.x,s.y);if(d>150||d<10)continue;const a=Math.atan2(s.y-e.y,s.x-e.x),pull=Math.min(35,d-10),q=inMapPt(e.x+Math.cos(a)*pull,e.y+Math.sin(a)*pull);e.setPosition?.(q[0],q[1]);}}
  yuzuTickShots(dt){
    const L=this._yzShots||[];for(let i=L.length-1;i>=0;i--){const q=L[i];if(q.player&&(q.player!==this.player||q.basic!==this.basicAttack||q.epoch!==(this._artEpoch||0)||q.mini&&q.m?.spr?.active===false)){q.spr.destroy();L.splice(i,1);continue;}q.life-=dt;if(q.seedArt){q.seedArtTime+=dt;q.spr.setFrame(Math.floor(q.seedArtTime*24)%8);   /* v8.2.74 ใบเฟส 3: 8 เฟรม */}
      if(q.seek){const t=this.yuzuTarget(q.x,q.y,420,false,q.hit);if(t){const a=Math.atan2(t.y-q.y,t.x-q.x),diff=Phaser.Math.Angle.Wrap(a-q.angle);q.angle+=Math.max(-dt*7,Math.min(dt*7,diff));}}
      const ox=q.x,oy=q.y;q.x+=Math.cos(q.angle)*q.speed*dt;q.y+=Math.sin(q.angle)*q.speed*dt;q.spr.setPosition(q.x,q.y).setRotation(q.angle);
      if(q.source==='focus_arrow'&&(this.elapsed||0)-(this._yzTrailAt??-10)>=.18){this._yzTrailAt=this.elapsed||0;this.yuzuSkillFx('volley',ox,oy,42,q.angle,{life:.2,hold:3});}
      for(const e of this.yuzuEnemies()){
        if(q.hit.get(e)===(e._yzSpawnId||0))continue;const dx=q.x-ox,dy=q.y-oy,f=Math.max(0,Math.min(1,((e.x-ox)*dx+(e.y-oy)*dy)/(dx*dx+dy*dy||1)));
        if(this.dist(e.x,e.y,ox+dx*f,oy+dy*f)>Math.max(14,e.body?.halfWidth||14)+6)continue;
        q.hit.set(e,e._yzSpawnId||0);let d=q.amount,critical=false;
        if(q.first&&q.m?.kind==='lime'){if(this.dist(q.m.spr.x,q.m.spr.y,e.x,e.y)>250)d*=1.3+this.yuzuTalent('Far');if(q.m.seen.get(e)!==(e._yzSpawnId||0)){critical=true;d*=1+this.yuzuTalent('Opener');q.m.seen.set(e,e._yzSpawnId||0);}}
        if(q.burn)this.applyBurn(e,d*.18,d*.6,3);const elementId=e._yzSpawnId;this.yuzuHit(q.m,e,d,q.source,critical,q);if(e._yzSpawnId===elementId)this.yuzuElementHit?.(q,e,d);if(q.seed)this.yuzuMark(e);if(q.cmdMark&&!q.marked&&(e.isBoss||e.isMini||e.isElite||e._waveObjectiveTarget)&&this.yuzuCombatTarget(e)){q.marked=true;this._yzMark={e,id:e._yzSpawnId||0,t:6,age:2,pend:null};}
        if(q.focusFinal&&!q.finalSplashDone){q.finalSplashDone=true;this.yuzuArea(q.m,e.x,e.y,q.finalSplash,.9*q.blendPower,'focus_burst');this.yuzuSkillFx('rain',e.x,e.y,q.finalSplash*2,0,{ground:true,life:.4});}
        if(this.yuzuRank('splash')&&!q.seed&&!q.mini)this.yuzuArea(q.m,e.x,e.y,24+12*this.yuzuRank('splash'),.18*this.yuzuRank('splash'),'splash');
        if(q.pierce>0)q.pierce--;else q.life=0;
        if(q.life<=0)break;
      }
      if(q.life<=0){q.spr.destroy();L.splice(i,1);}
    }
  }
  yuzuTickZones(dt){const L=this._yzZones||[];for(let i=L.length-1;i>=0;i--){const z=L[i];if(z.player&&(z.player!==this.player||z.basic!==this.basicAttack||z.epoch!==(this._artEpoch||0))){z.spr.destroy();L.splice(i,1);continue;}z.life-=dt;z.tick-=dt;z.spr.setAlpha((z.alpha??1)*Math.min(1,z.life*2));
      if(z.kind==='trap'){const e=this.yuzuTarget(z.x,z.y,z.r);if(e){this.yuzuSound('trap',.3);this.yuzuArea(z.m,z.x,z.y,z.r,2+.3*this.yuzuRank('y_bigsplat'),'trap');this.yuzuZone(z.m,'root',z.x,z.y,z.r,1+.25*this.yuzuRank('y_bigsplat'));z.life=0;}}
      else if(z.kind==='sour'&&z.tick<=0){z.tick=.6;this.yuzuArea(z.m,z.x,z.y,z.r,z.mul,'sour');}
      if(z.life<=0){z.spr.destroy();L.splice(i,1);}
    }
  }
  yuzuFormFrame(m,pose,clip){
    if(clip.key==='yz_48_'+m.kind){const f=Math.max(0,Math.min(15,clip.frame));return f<8?Math.floor(f/2):f<12?4+Math.floor((f-8)/2):6+Math.floor((f-12)/2);}
    if(pose.key==='yz_47_'+m.kind){
      if(pose.state==='windup'){const a=m.action,q=m.motion;return a?(a.t<a.wind*.5?4:5):q&&q.t<(q.prep||0)*.5?4:5;}
      if(pose.state==='release'){const a=m.action;return a&&a.t>=a.wind+(a.end-a.wind)*.6?7:6;}
      if(pose.state==='land'||pose.state==='roll')return 6;
      if(m.motion)return 5;
      return pose.frame%4;
    }
    return pose.frame%8;
  }
  yuzuFormBadge(m,form){
    if(m.kind==='yuzling'||!this.add?.image||!this.textures.exists('yz_form_badge')){m.formBadge?.destroy();m.formBadge=null;return;}
    if(!m.formBadge?.active)m.formBadge=this.camWorld(this.add.image(0,0,'yz_form_badge',form-1).setDisplaySize(16,16).setDepth(95003));
    m.formBadge.setFrame(form-1).setTint(({pomelo:0xffd466,lime:0xb7ff7c,bloodorange:0xef91c8})[m.kind]||0xffffff).setPosition(m.spr.x-(m.label.width||0)/2-12,m.label.y);
  }
  yuzuVisual(m,dt){
    const sp=m.spr;const paintDt=this.state==='play'?dt:0;m.anim=(m.anim||0)+paintDt;m.attack=Math.max(0,(m.attack||0)-paintDt);
    if(m.lunge)sp.setFlipX(Math.cos(m.lunge.a)<0);
    const pose=this.yuzuVisualPose(m),v=this.yuzuAnimate(m,dt,pose),clip=this.yuzuAnimationFrame(m,pose),base='yz_'+m.kind,painted=this.textures.exists(base),form=this.yuzuForm?.(m)||1,fk='yz_'+m.kind+'_f'+form,key=form>1&&this.textures.exists(fk)?fk:this.textures.exists(clip.key)?clip.key:painted?base:'minion_yuzling';
    const frame=key===fk?this.yuzuFormFrame(m,pose,clip):key===clip.key?clip.frame:pose.frame%8;
    if(sp.texture.key!==key)sp.setTexture(key,frame);else sp.setFrame(frame);
    if(painted)sp.clearTint();else sp.setTint(({pomelo:0xffd173,lime:0x9bd65e,bloodorange:0xc9719d})[m.kind]||0xffffff);
    const red=this.hubMotionAllowed?.()===false,size=m.kind==='pomelo'?64*(1+.14*m.growth):m.kind==='yuzling'?45:53*(1+.12*(form-1)),foot=248/256;
    const paintScale=key===fk?1:clip.paintScale||1;sp.setDisplaySize(size*paintScale*v.sx,size*paintScale*v.sy);
    // Stretch/breath/recoil move the paint around a stable foot; never move the logical actor.
    sp.setOrigin(.5,foot-((foot-.5)*size+v.bob)/(size*paintScale*v.sy));
    sp.setRotation(!red&&pose.state==='roll'?(m.motion.t-m.motion.prep)*14:v.rot).setAlpha(1).setDepth((m.groundY??sp.y)+2);
    m.visualState=pose.state;
    if(m.shadow){const air=Math.min(1,Math.max(0,((m.groundY??sp.y)-sp.y)/75)),gy=(m.groundY??sp.y)+size*(foot-.5);
      m.shadow.clear().setDepth((m.groundY??sp.y)+1);m.shadow.fillStyle(0x160d20,.1-air*.06).fillEllipse(sp.x,gy,size*.9*(1-air*.35),Math.max(7,size*.22*(1-air*.3)));m.shadow.fillStyle(0x160d20,.2-air*.13).fillEllipse(sp.x,gy,size*.62*(1-air*.35),Math.max(5,size*.15*(1-air*.3)));}
    m.label.setText((()=>{const F=typeof YUZU_FORMS!=='undefined'?YUZU_FORMS:{};return m.kind==='pomelo'?((F.pomelo||['Pomelo'])[form-1]||'Pomelo')+' · Form '+form:((F[m.kind]||[])[form-1]||({lime:'Lime',bloodorange:'Blood Orange',yuzling:'Yuzling'})[m.kind]);})()).setPosition(sp.x,sp.y-size*.58-14);
    const w=42,x=sp.x-w/2,y=sp.y-size*.58-4,u=this.yuzuBuff(),f=u?u.t/u.total:0;
    m.bar.clear();if(u){const color=({pomelo:0xffd466,lime:0xb7ff7c,bloodorange:0xef91c8})[m.kind]||0xffdc88;sp.setTint(color);m.label.setText(({pomelo:'Pomelo',lime:'Lime',bloodorange:'Blood Orange',yuzling:'Yuzling'})[m.kind]+' · '+Math.ceil(u.t)+'s');const gy=(m.groundY??sp.y)+size*(foot-.5)+7;m.bar.lineStyle(2,color,.7).strokeCircle(sp.x,gy,11);m.bar.lineStyle(3,color,.95);m.bar.beginPath?.();m.bar.arc?.(sp.x,gy,11,-Math.PI/2,-Math.PI/2+Math.PI*2*f);m.bar.strokePath?.();}
    this.yuzuFormBadge(m,form);

  }
  tickYuzuCrew(dt){
    if(this.character!=='yuzu'||this.state!=='play'||!this.basicAttack||!this.player)return;const m=this.yuzuEnsure(),p=this.player,b=this.basicAttack;
    if(this._yzShield){this._yzShield.t-=dt;if(this._yzShield.t<=0)this._yzShield=null;}
    this.yuzuTickSpells(dt);if(this.state!=='play')return;this.yuzuTickFx(dt);this.yuzuTickShots(dt);if(this.state!=='play')return;this.yuzuTickZones(dt);if(this.state!=='play')return;
    this.yuzuTickBuff(dt);if(this.state!=='play')return;this.yuzuTickMark(dt);
    this._yzSeedCd=Math.max(0,(this._yzSeedCd||0)-dt);const seedTarget=this.yuzuSeedAim(p);
    if(seedTarget&&this._yzSeedCd<=0){this._yzSeedCd=this.yuzuCd(.85);this.yuzuShot(null,p.x,p.y,Math.atan2(seedTarget.y-p.y,seedTarget.x-p.x),9.6*(p.dmgMul||1)*(1+.12*(b.ranks.power||0)),{seed:true,source:'seed'});this.poseAttack?.(220);}
    this.yuzuTickSeeds(dt);if(this.state!=='play')return;
    m.groundY=null;m.land=Math.max(0,(m.land||0)-dt);m.cd-=dt;m.skill-=dt;m.second-=dt;
    const target=this.yuzuPickTarget(m,dt);
    this.yuzuArsenalClock(m,dt);
    if(m.land>0){this.yuzuVisual(m,dt);return;}
    if(m.action){this.yuzuTickAction(m,dt);this.yuzuVisual(m,dt);return;}
    const tooFar=this.dist(m.spr.x,m.spr.y,p.x,p.y)>(target&&this.yuzuEnemyPriority(target)>0?740:440);if(tooFar)m.returning=true;
    const pm=b._pm||{},skillRate=Math.pow(.9,m.kind==='bloodorange'?this.yuzuRank('p_sweetHelper'):m.kind==='lime'?this.yuzuRank('y_strongarm'):0)*Math.max(.35,1-this.yuzuTalent('Skill')-this.yuzuTalent('Recover'))*this.yuzuFormTempo(m,true);
    if(this.yuzuArsenalThink(m,target,skillRate,dt)){this.yuzuVisual(m,dt);return;}
    if(m.skill<=0&&!m.motion&&!m.lunge&&!m.returning){
      if(m.kind==='yuzling'){const t=this.yuzuTarget(m.spr.x,m.spr.y,260,true);if(t){this.yuzuMotion(m,t.x,t.y,'pounce',2.5,65);m.skill=this.yuzuCd(6);}}
      if(m.kind==='pomelo'){const t=this.yuzuCluster(480);if(t){this.yuzuMotion(m,t.x,t.y,'slam',2.6*(1+.15*this.yuzuRank('p_heavyPeel'))*(b.evolved?1.25:1),130*(1+.2*this.yuzuRank('y_giantslam'))+this.yuzuTalent('Slam'));m.skill=this.yuzuCd(8)*skillRate;const gr=Math.min(3,this.yuzuRank('p_bodyguard'));if(gr>0)this.yuzuShield(.04*gr,3);}}
      if(m.kind==='lime'&&target&&this.dist(target.x,target.y,m.spr.x,m.spr.y)>=110){const aim={x:target.x,y:target.y};this.yuzuBeginAction(m,'volley',()=>this.yuzuShootFan(m,aim,5+2*this.yuzuRank('y_double')+this.yuzuTalent('Arrows'),.7+.1*this.yuzuRank('p_pulp')),aim);m.skill=this.yuzuCd(7)*skillRate;}
      // Blood Orange selects its new spells through yuzuArsenalThink.
    }
    if(m.second<=0&&!m.motion&&!m.action&&!m.lunge&&!m.returning){
      if(m.kind==='pomelo'&&m.growth>=3&&target){const a=Math.atan2(target.y-m.spr.y,target.x-m.spr.x);this.yuzuMotion(m,m.spr.x+Math.cos(a)*400,m.spr.y+Math.sin(a)*400,'roll',2.7,55,.65);m.second=this.yuzuCd(12)*(1-this.yuzuTalent('Roll'))*this.yuzuFormTempo(m,true);}
      if(m.kind==='lime'&&target&&this.yuzuHasSkill('trap')){this.yuzuBeginAction(m,'trap',()=>this.yuzuZone(m,'trap',m.spr.x,m.spr.y,75+15*this.yuzuRank('y_bigsplat'),7,2));m.second=this.yuzuCd(10)*(1-this.yuzuTalent('Trap'))*this.yuzuFormTempo(m,true);}
    }
    if(m.action){this.yuzuVisual(m,dt);return;}
    if(m.motion){const q=m.motion,ox=m.spr.x,oy=m.spr.y;q.t+=dt;if(q.t<q.prep){this.yuzuVisual(m,dt);return;}const k=Math.min(1,(q.t-q.prep)/q.duration),air=q.kind==='slam'||q.kind==='pounce'||q.kind==='command';m.groundY=q.sy+(q.ty-q.sy)*k;m.spr.setPosition(q.sx+(q.tx-q.sx)*k,m.groundY-(air?Math.sin(Math.PI*k)*75:0));
      if(!air){const dx=m.spr.x-ox,dy=m.spr.y-oy;for(const e of this.yuzuEnemies()){const f=Math.max(0,Math.min(1,((e.x-ox)*dx+(e.y-oy)*dy)/(dx*dx+dy*dy||1)));if(q.hit.get(e)!==(e._yzSpawnId||0)&&this.dist(e.x,e.y,ox+dx*f,oy+dy*f)<q.r+(e.body?.halfWidth||0)){q.hit.set(e,e._yzSpawnId||0);this.yuzuHit(m,e,this.yuzuPower()*q.mul*Math.pow(1.4,m.growth),'dash');}}}
      if(k>=1){m.motion=null;m.land=.22;m.attack=.45;if(q.kind==='command')this.yuzuCommandLand(m,q);else if(air){if(!this.yuzuSound(q.kind,.35,.45)&&q.kind==='slam')Sfx.boom?.();this.yuzuArea(m,q.tx,q.ty,q.r,q.mul*Math.pow(1.4,m.growth),q.kind,q.kind==='slam'?.6:0);if(m.kind==='pomelo'&&b.evolved)this.yuzuArea(m,q.tx,q.ty,q.r*1.2,.6,'aftershock');}}
      this.yuzuVisual(m,dt);return;
    }
    let [tx,ty]=this.yuzuFormation(m,target);
    if(target&&!m.returning){const a=Math.atan2(target.y-m.spr.y,target.x-m.spr.x),d=this.dist(target.x,target.y,m.spr.x,m.spr.y),reach=m.kind==='pomelo'?75:58;
      if(m.kind==='pomelo'||m.kind==='yuzling'){m.aim=a;
        if(d<reach+(target.body?.halfWidth||0)&&m.cd<=0&&!m.lunge){if(m.kind==='pomelo')m.peelStep=(m.peelStep||0)%3+1;m.lunge={step:m.peelStep||1,duration:(m.kind==='pomelo'?(m.peelStep===3?.4:m.peelStep===1?.26:.3):.3)*this.yuzuFormTempo(m),t:0,ax:m.spr.x,ay:m.spr.y,a,target,targetId:target._yzSpawnId,hit:false};m.cd=Math.max(.18,this.yuzuCd(m.kind==='pomelo'?1.15:1.25)*this.yuzuFormTempo(m));}}
      else if(m.cd<=0&&d>=95){const period=Math.max(.18,this.yuzuCd(m.kind==='lime'?1.05:1.25)*this.yuzuFormTempo(m)),kind=m.kind==='lime'?'arrow':'sigil';
        if(this.yuzuBeginAction(m,kind,()=>{const angle=m.action.angle,dx=Math.cos(angle)*16,dy=Math.sin(angle)*16;
          if(m.kind==='bloodorange'){this.yuzuQueueSpell(m,'sigil',{x:target.x,y:target.y});const form=this.yuzuForm(m);if(form>1){const elements=form===2?['fire']:['fire','frost','lightning'];elements.forEach((element,i)=>this.yuzuShot(m,m.spr.x,m.spr.y,angle+(i-(elements.length-1)/2)*.13,this.yuzuPower()*.38,{source:'element_bolt',element,size:30,speed:500,life:1.3}));}return;}
          const baseHit=this.yuzuPower()*.8*(b.evolved&&this.yuzuForm(m)>1?1.2:1);if(this.yuzuFocusBurst(m,angle,baseHit,b.evolved))return;
          const form=this.yuzuForm(m),fan=form===3?[-.12,0,.12]:form===2?[-.055,.055]:[0];for(const da of fan)this.yuzuShot(m,m.spr.x+dx,m.spr.y+dy,angle+da,baseHit*(da===0||fan.length===2?1:.65),{first:true,source:'arrow',pierce:Math.max(b.evolved?2:0,form-1)+(b.evolved&&form>1?1:0),formArrow:form,size:form>1?48:42});
          if(b.evolved&&form===1)this.yuzuShot(m,m.spr.x+dx,m.spr.y+dy,angle+.12,this.yuzuPower()*.55,{first:true,pierce:2,source:'twinArrow'});
        },target,period))m.cd=period;
      }
      if(Math.abs(target.x-m.spr.x)>12)m.spr.setFlipX(target.x<m.spr.x);
    }
    if(m.action){this.yuzuVisual(m,dt);return;}
    if(m.lunge){const q=m.lunge;q.t+=dt;const k=Math.min(1,q.t/(q.duration||.3)),off=k<.3?-8*k/.3:k<.65?22*(k-.3)/.35:22*(1-k)/.35;m.spr.setPosition(q.ax+Math.cos(q.a)*off,q.ay+Math.sin(q.a)*off);m.attack=.3;
      if(k>=.55&&!q.hit){q.hit=true;m.bites++;this.yuzuSound(m.kind==='pomelo'?'sweep':'bite',.25,.28);const mul=Math.pow(1.4,m.growth)*(1+.1*this.yuzuRank('p_heavyPeel'));
        if(q.target.active&&q.target._yzSpawnId===q.targetId&&this.dist(m.spr.x,m.spr.y,q.target.x,q.target.y)<125+(q.target.body?.halfWidth||0)){if(m.kind==='pomelo')this.yuzuPeelStrike(m,q,mul);else this.yuzuHit(m,q.target,this.yuzuPower()*mul,'bite');}}
      if(k>=1)m.lunge=null;
    }else{const d=this.dist(m.spr.x,m.spr.y,tx,ty),speed=(m.returning?520:300)*(1+.1*this.yuzuRank('p_pulp'))*(1+.08*(this.yuzuForm(m)-1)),v=d>20?Math.min(speed,d*5):0,k=1-Math.exp(-9*dt);
      m.vx+=(d>1?(tx-m.spr.x)/d*v-m.vx:-m.vx)*k;m.vy+=(d>1?(ty-m.spr.y)/d*v-m.vy:-m.vy)*k;const bounded=inMapPt(m.spr.x+m.vx*dt,m.spr.y+m.vy*dt);m.spr.setPosition(bounded[0],bounded[1]);
      if(this.dist(m.spr.x,m.spr.y,p.x,p.y)>1200){m.spr.setPosition(p.x-55,p.y+35);m.vx=m.vy=0;this.yuzuFx('shield',p.x-55,p.y+35,60,.25);}
    }
    this.yuzuVisual(m,dt);
  }

  tickFR(dt){ if(!this._fr||this.state!=='play')return; const p=this.player;
    if(this._frRageT>0)this._frRageT-=dt; if(this._frHasteT>0)this._frHasteT-=dt;
    if(this._fr.length){ const mv=p.body?Math.hypot(p.body.velocity.x,p.body.velocity.y):0;
      if(mv>=8){ this._frMoveT+=dt; if(this._frMoveT>=3){ this._frMoveT=0; this.fireRecipes('moving'); } }
      if(p.hp>=p.maxhp){ this._frFullT+=dt; if(this._frFullT>=3){ this._frFullT=0; this.fireRecipes('fullHp'); } } else this._frFullT=0;
      this._frSurT+=dt; if(this._frSurT>=0.5){ this._frSurT=0; let n=0; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,p.x,p.y)<=170)n++; }); if(n>=8)this.fireRecipes('surround'); }
      const big=!!(this.boss&&this.boss.active)||this.mode==='mini'; if(big&&!this._frBigWas)this.fireRecipes('bossAppear'); this._frBigWas=big; }
    const O=this._frOrbit; if(O){ O.t-=dt; O.ang+=dt*4; O.acc+=dt; O.sprs.forEach((s2,k)=>s2.setPosition(p.x+Math.cos(O.ang+k*2.094)*O.R,p.y+Math.sin(O.ang+k*2.094)*O.R));
      if(O.acc>=0.25){ O.acc=0; O.sprs.forEach(s2=>this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,s2.x,s2.y)<=34)this.frHit(e,this.relicDmg(0.5)*O.pw,O.r); })); }
      if(O.t<=0){ O.sprs.forEach(x=>x.destroy()); this._frOrbit=null; } }
    if(this._fr.length){ this._frTimer+=dt; if(this._frTimer>=5*(this._fr.some(r=>r.t==='timer5'&&r.m==='faster')?0.7:1)){ this._frTimer=0; this.fireRecipes('timer5'); }this._frTimer10=(this._frTimer10||0)+dt;if(this._frTimer10>=10*(this._fr.some(r=>r.t==='timer10'&&r.m==='faster')?0.7:1)){this._frTimer10=0;this.fireRecipes('timer10');}
      const v=p.body?Math.hypot(p.body.velocity.x,p.body.velocity.y):0; if(v<8){ this._frStill+=dt; if(this._frStill>=1.5){ this._frStill=0; this.fireRecipes('still'); } } else this._frStill=0;
      const low=p.hp/p.maxhp<0.3; if(low&&this._frLowArm){ this._frLowArm=false; this.fireRecipes('lowHp'); } else if(p.hp/p.maxhp>0.5)this._frLowArm=true; }
    for(let i=this._frZones.length-1;i>=0;i--){ const z=this._frZones[i]; z.t-=dt; z.acc+=dt;
      if(z.pull)this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&!e.isMini){ const d=this.dist(e.x,e.y,z.x,z.y); if(d<=z.R&&d>12){ const k=Math.min(1,dt*3.2); e.setPosition(e.x+(z.x-e.x)*k*0.35,e.y+(z.y-e.y)*k*0.35); } } });
      if(z.acc>=0.5){ z.acc=0; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,z.x,z.y)<=z.R)this.frHit(e,z.dmg,z.r); }); }
      if(z.t<=0){this.tweens.killTweensOf(z.spr); z.spr.destroy(); this._frZones.splice(i,1); } }
    const B=this._frBuddy; if(B){ B.t-=dt; B.ang+=dt*2.4; B.spr.setPosition(p.x+Math.cos(B.ang)*56,p.y+Math.sin(B.ang)*56-10); B.acc+=dt;
      if(B.acc>=0.45){ B.acc=0; const e=this.nearestEnemy(420); if(e){ const b=this.getBullet(B.spr.x,B.spr.y,0xffffff,0.18); if(b){ b.setTexture('proj_sprinkle').setTint(0xffb3cd); b.dmg=this.relicDmg(0.7)*B.pw; b.life=1.2; b.homing=0; b.faceVel=true; this.physics.velocityFromRotation(Math.atan2(e.y-B.spr.y,e.x-B.spr.x),560,b.body.velocity); } } }
      if(B.t<=0){ B.spr.destroy(); this._frBuddy=null; } } }
  resetRelics(){ if(this._relCond&&this.player?._cond){for(const k in this._relCond)this.player._cond[k]=Math.max(0,(this.player._cond[k]||0)-this._relCond[k]);} this._relCond={};
    this.clearTaroCombat?.();this.clearCocoaCombat?.();this.frInit(); this._agUsed=false; this._swDone=false; this._shovelFind=0; this._dashChain=[]; this._tagTier={}; this.relics=[]; this._rel={}; this._shield=0; this._relicKills=0; this._coldSnapAt=0; this._crownHits=0; this._rageStk=0; this._killChg=0; this._uqUses=0;this._lnBank=0;this._lnT=0; this._uqGuardT=0; this._uqHotT=0; this._uqWinT=0; this._jamPools=[]; this._harvestKills=0; this._sparkHits=0; this._sparkUntil=0; this._lastBreathUsed=false; this._relicLvDone=false; this._relicLvN=0; this._leechT=0; this._burstT=0; this._burstN=0; this._taroCharge=0; this._cc=null; this._dashBuffT=0; this._dpCh=null; this._dpT=0; }
  relicSyn(a,b){ return !!(this._rel&&this._rel[a]&&this._rel[b]); }
  relicSlotsLeft(){ const b=this.basicAttack||{},m=(b.mods||[]).filter(id=>!id.startsWith('f_')).length+((b.trades||[]).length)+((b.condRelics||[]).length); return RELIC_CAP-((this.relics&&this.relics.length)||0)-m; }   // v6.72 A2/A3: Modifier + Trade-off share Relic slots
  // v5.30 🌀 Echo Dash: Dash 3 ครั้งใน 2.5 วิ = คลื่นกระแทก
  ancientEchoDash(){ this.heroDashFx?.(); if(!Save.ancientHas('echoDash'))return; const t=this.elapsed||0; this._dashChain=(this._dashChain||[]).filter(x=>t-x<2.5); this._dashChain.push(t);
    if(this._dashChain.length<3)return; this._dashChain=[]; const p=this.player,R=130,dmg=this.relicDmg(2.2);
    const ring=this.camWorld(this.add.circle(p.x,p.y,R,0xc7a6ff,0.18).setStrokeStyle(5,0xe0c8ff,0.9).setDepth(90000).setScale(0.3)); this.tweens.add({targets:ring,scale:1,alpha:0,duration:380,ease:'Cubic.out',onComplete:()=>ring.destroy()});
    this.enemies.getChildren().forEach(e=>{ if(e.active&&this.dist(e.x,e.y,p.x,p.y)<=R)this.damage(e,dmg); }); }
  // v5.30 ⛏️ Treasure Sense: ฆ่ามอนมีโอกาสได้พลั่ว (สูงสุด 3/ด่าน)
  ancientTreasure(e){ if(!Save.ancientHas('treasureSense')||(this._shovelFind||0)>=3||Math.random()>0.005)return; this._shovelFind=(this._shovelFind||0)+1; Save.addShovels(1); this.floatText(e.x,e.y-24,'+'+(typeof SHOVEL_CRUMBS!=='undefined'?SHOVEL_CRUMBS+' 🍪':'1 ⛏️'),0xffd9a8); }
  relicDmg(mul){ return (10+(this.level||1)*1.5)*(this.player.dmgMul||1)*(1+(this.stageIndex||0)*0.35)*mul; }
  /* v8.2.29 Pact Relics: รวมผลกับด่านจาก Relic + Trade-off ที่ถือ + คำสาป Cursed Crown ของเวฟนี้ */
  rpIds(){ const out=Object.keys(this._rel||{}).filter(k=>this._rel[k]); for(const t of (this.basicAttack?.trades||[]))out.push(t); return out; }
  rpMul(key){ if(typeof RP_FX==='undefined')return 1; let m=1; for(const id of this.rpIds()){ const f=RP_FX[id]; if(f&&typeof f[key]==='number')m*=f[key]; } const c=this._crownCurse; if(c&&c.fx&&typeof c.fx[key]==='number')m*=c.fx[key]; return m; }
  rpAdd(key){ if(typeof RP_FX==='undefined')return 0; let a=0; for(const id of this.rpIds()){ const f=RP_FX[id]; if(f&&typeof f[key]==='number')a+=f[key]; } return a; }
  rpHas(key){ return this.rpIds().some(id=>typeof RP_FX!=='undefined'&&RP_FX[id]&&RP_FX[id][key]!=null); }
  rpMsnRw(type){ let m=this.rpMul('msnRw'); for(const id of this.rpIds()){ const f=typeof RP_FX!=='undefined'&&RP_FX[id]; if(f&&f.rwType&&f.rwType[type])m*=f.rwType[type]; } return m; }
  rpCurPlus(type){ let n=0; for(const id of this.rpIds()){ const f=typeof RP_FX!=='undefined'&&RP_FX[id]; if(f&&Array.isArray(f.cur)&&f.cur.includes(type))n++; } return n; }
  rpMissionSetup(o){ if(!o)return; if(o.type==='frozenPantry'){ const m=this.rpMul('pantry'); if(m>1&&o.target>0)o.target=Math.ceil(o.target*m); } if(['creepingRoots','breakRoots'].includes(o.type))o._rpFast=this.rpMul('rootFast'); }
  rpWaveCurse(){ this._crownCurse=null; if(!this.rpHas('curse')||typeof RP_CURSES==='undefined')return null; const c=RP_CURSES[Math.floor(Math.random()*RP_CURSES.length)]; this._crownCurse=c;
    this.time?.delayedCall?.(1300,()=>{ if(this.state!=='play'||this._crownCurse!==c)return; this.showBanner?.('👑 Cursed Crown: '+c.em+' '+c.name,'Mission rewards +50% this stage',1800); this.a12?.('a18_curse',.45,.5); this.rubyVoiceReact?.('curse',400);
      const P=this.player,fi=RP_CURSES.indexOf(c); if(P&&fi>=0&&this.realTex?.('ev90_curses')&&this.add?.image){ const im=this.camWorld(this.add.image(P.x,P.y-80,'ev90_curses',fi).setDisplaySize(40,40).setDepth(95001)); this.tweens?.add?.({targets:im,y:P.y-130,alpha:{from:1,to:0},duration:1500,ease:'Cubic.out',onComplete:()=>im.destroy()}); } }); return c; }   /* v8.2.31 ใบ 90 + A18 */
  rollRelicChoices(n){
    if(this.relicSlotsLeft()<=0)return [];
    const own=this._rel||{},ch2=(this.stageIndex||0)>=5||!!this.recipeMode,pool=Object.keys(RELICS).filter(k=>!own[k]&&(!RELICS[k].ch2||ch2));   /* v8.2.29 Pact Relics ใหม่ออกตั้งแต่ Chapter 2 */
    // ถืออีกครึ่งของคู่ synergy อยู่ → น้ำหนัก ×2.5 ให้เจอบ่อยขึ้น
    const fr=((FUSIONS[(this.basicAttack||{}).character]||[]).map(f=>f.relic)),w=pool.map(k=>(RELIC_SYNERGIES.some(s=>(s.a===k&&own[s.b])||(s.b===k&&own[s.a]))?2.5:1)*(fr.includes(k)?2:1)*((RELICS[k].paths||[]).includes((this.basicAttack||{}).path)?1.8:1)),out=[];   // v8.0.89 Relic ที่เข้ากับสายที่เล่นอยู่ ออกบ่อยขึ้น
    while(out.length<n&&pool.length){ let tot=w.reduce((a,b)=>a+b,0),r=Math.random()*tot,i=0; for(;i<pool.length-1;i++){r-=w[i];if(r<=0)break;} const k=pool.splice(i,1)[0];w.splice(i,1);
      const d=RELICS[k],syn=RELIC_SYNERGIES.find(s=>(s.a===k&&own[s.b])||(s.b===k&&own[s.a])),fu=(FUSIONS[(this.basicAttack||{}).character]||[]).find(f=>f.relic===k);   // v7.8.88 บอกล่วงหน้าว่า Relic นี้ + Evolution = Fusion
      out.push({type:'relic',key:'relic_'+k,iconKey:'relic_'+k,lvl:1,max:1,kind:'Relic',color:0xc07bff,emoji:d.emoji,title:d.name,desc:d.desc+(d.stage?'\n🔴 Stage: '+d.stage+(d.reward?'\n🎁 '+d.reward:''):''),short:d.headline,note:[syn?'🔗 Combo: '+syn.name:'',fu?'🧬 Evolves into '+fu.name:''].filter(Boolean).join('\n'),headline:[syn?'🔗 '+syn.name+': '+syn.desc:'',fu?'🧬 + Evolution → '+fu.name:'',d.headline||'',d.for?'👍 '+d.for:''].filter(Boolean).join('  ')||undefined,apply:()=>this.gainRelic(k)}); }
    // v6.72 A2/A3: Modifier/Trade-off ออกในหน้า Relic แทนการ์ดเลเวลอัพ (แทนที่ช่องสุ่ม 1 ใบต่อชนิด)
    if(!this._inTutorial&&this.basicAttack){ const extra=[]; if(this.cardOpen?.('mod')!==false&&Math.random()<0.6){const mc=this.modCard();if(mc)extra.push(mc);} if(((this.stageIndex||0)>=5||this.recipeMode)&&this.cardOpen?.('trade')!==false&&Math.random()<0.35){const tc=this.tradeCard();if(tc)extra.push(tc);}
      for(const c of extra){ if(out.length<n)out.push(c); else { const i=Phaser.Math.Between(0,out.length-1); if(out[i].type==='relic')out[i]=c; } } }
    return out;
  }
  offerRelic(){ if(this._inTutorial||this.cardOpen?.('relic')===false)return false; const opts=this.rollRelicChoices(3); if(!opts.length)return false;
    this._forcedOpts=opts; this._relicPick=true; this.pendingLvl=(this.pendingLvl||0)+1; this.openLevelUp(); return true; }
  gainRelic(k){ if(!RELICS[k]||(this._rel&&this._rel[k]))return; if(!this._rel)this.resetRelics(); this.time.delayedCall(600,()=>{if(this.state==='play'||this.state==='levelup')this.autoFusion();});
    this.relics.push(k); this._rel[k]=true; const p=this.player,d=RELICS[k];
    if(k==='streak'||k==='laststand'){ const ck=k==='streak'?'c_streak':'c_close'; p._cond=p._cond||{}; p._cond[ck]=(p._cond[ck]||0)+2; (this._relCond=this._relCond||{})[ck]=(this._relCond[ck]||0)+2; }
    if(k==='glass'){ p.dmgMul+=(1.4)-1; clampPlayerStats(p); }   /* v8.2.29 Pact: ไม่ลด HP แล้ว · มอน HP +20% แทน (RP_FX) */
    if(k==='goldenappetite')p.sugarFindMul=(p.sugarFindMul||1)*1.3; if(k==='hastyclock'){ p.cdMul=(p.cdMul||1)*.9; clampPlayerStats(p); }
    if(k==='heavydough'){ p.dmgMul+=.30; p.cdMul=(p.cdMul||1)*1.2; clampPlayerStats(p); }   // v8.0.89
    if(k==='sugarrush'){ p.dmgMul=Math.max(.2,p.dmgMul-.15); p.cdMul=(p.cdMul||1)*.8; clampPlayerStats(p); }
    if(k==='twinbake'){ p.uniqueCdMul=(p.uniqueCdMul||1)*.85; }
    const syn=RELIC_SYNERGIES.find(s=>(s.a===k||s.b===k)&&this._rel[s.a]&&this._rel[s.b]);
    if(syn&&syn.a==='jam')p.dashCdMul=(p.dashCdMul||1)*0.65;   // Sticky Rush
    this.showBanner(syn?('🔗 '+syn.name+'!'):(d.emoji+' Relic: '+d.name),syn?syn.desc:d.desc,syn?2200:1700);
    if(syn){this.screenFlash(0xc07bff,0.35,300);(typeof Sfx!=='undefined'&&Sfx.orderCue?.('relic_synergy',.5,.3));}
  }
  relicDmg89(e,RL){ let m=1; const P=this.player,now=this.time?.now||0,el=this.elapsed||0,d=P?Math.hypot(e.x-P.x,e.y-P.y):0;   /* v8.0.89 Relic ใหม่ที่ขึ้นกับเป้า/ระยะ/ที่มา */
    if(RL.frostcandy&&((e.frozen||0)>0||(e._chill>0&&now-(e._chillAt??-1e9)<2500)||(e._glacierBrittleUntil||0)>now))m*=this.relicSyn('frostcandy','chill')?1.6:1.3;
    if(RL.copperwhisk&&((e._shock>0&&this._taro&&typeof TARO_SHOCK_LIFE!=='undefined'&&this._taro.time-(e._shockAt??-1e9)<=TARO_SHOCK_LIFE)||(e._arcShockT||0)>el))m*=1.3;
    if(RL.longspoon&&d>350)m*=this.relicSyn('heavydough','longspoon')?1.5:1.25;
    if(RL.crowdcrush&&d<160)m*=this.relicSyn('sugarrush','crowdcrush')?1.5:1.25;
    if(RL.twinbake&&this._mxSrc==='unique')m*=1.4;
    if(RL.giantslayer)m*=(e.isBoss||e.isMini||e.isElite)?1.25:.9;
    if(RL.stormlantern&&((e._shock>0&&this._taro&&typeof TARO_SHOCK_LIFE!=='undefined'&&this._taro.time-(e._shockAt??-1e9)<=TARO_SHOCK_LIFE)||(e._arcShockT||0)>el))m*=1.3;   /* v8.2.29 Pact Relics */
    if(RL.elitebait&&(e.isBoss||e.isMini||e.isElite))m*=1.2; if(RL.frostdebt&&((e.frozen||0)>0||(e._chill>0&&now-(e._chillAt??-1e9)<2500)))m*=1.2; if(RL.glassgarden)m*=1.25;
    if(RL.rootpact&&['creepingRoots','breakRoots'].includes(this.waveObjective?.type))m*=1.2;
    return m; }
  relicOnCrit(e,amount,x,y){ const R=this._rel;
    if(R.splinter&&!this._inSplinter&&!this.taroIsSecondary?.()){ const near=[];
      this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==e){ const dd=this.dist(o.x,o.y,x,y); if(dd<180)near.push([dd,o]); } });
      near.sort((a,b)=>a[0]-b[0]); this._inSplinter=true;
      try{ for(const [,o] of near.slice(0,2)){ const ln=this.camWorld(this.add.line(0,0,x,y,o.x,o.y,0xffb3cd,0.95).setOrigin(0,0).setLineWidth(2).setDepth(9));
        this.tweens.add({targets:ln,alpha:0,duration:180,onComplete:()=>ln.destroy()}); o._splinterHit=this.elapsed; this.damage(o,amount*0.4,o.x,o.y); } }
      finally{ this._inSplinter=false; } }
    if(R.leech&&this.elapsed>=(this._leechT||0)){ this._leechT=this.elapsed+0.25; const p=this.player,big=e.isBoss||e.isMini;
      const heal=p.maxhp*0.01*((big&&this.relicSyn('leech','crown'))?3:1); p.hp=Math.min(p.maxhp,p.hp+heal); }
  }
  relicOnKill(e){ const R=this._rel;
    if(R.harvest&&++this._harvestKills>=20){this._harvestKills=0;const heal=this.player.maxhp*0.05;this.player.hp=Math.min(this.player.maxhp,this.player.hp+heal);this.popHeal(this.player.x,this.player.y,Math.round(heal));if(this.relicSyn('harvest','shell')&&(this._shield||0)<(this.relicSyn('shell','lastbreath')?2:1)){this._shield=(this._shield||0)+1;this.floatText(this.player.x,this.player.y-44,'🫧 Full Belly',0x9fe8ff);}}
    if(R.shell){ this._relicKills=(this._relicKills||0)+1; if(this._relicKills>=15||e.isElite||e.isMini||e.isBoss){ this._relicKills=0; const cap=this.relicSyn('shell','lastbreath')?2:1;
      if((this._shield||0)<cap){ this._shield=(this._shield||0)+1; this.floatText(this.player.x,this.player.y-44,'🫧 Shield',0x9fe8ff); } } }
    if(R.burst&&!this.taroIsSecondary?.()){ const chain=this.relicSyn('splinter','burst')&&e._splinterHit!=null&&this.elapsed-e._splinterHit<0.3;
      if(chain||Math.random()<0.18){
        if(this.elapsed-(this._burstT||0)>0.1){ this._burstT=this.elapsed; this._burstN=0; }
        if((this._burstN=(this._burstN||0)+1)<=6){ const x=e.x,y=e.y,dmg=(e.isBoss||e.isMini)?this.relicDmg(2):Math.max(this.relicDmg(1),(e.maxhp||10)*0.5);
          this.time.delayedCall(50,()=>{ if(this.state==='play'||this.state==='levelup')this.explodeAt(x,y,80,dmg); }); } } }
  }
  relicJamTrail(d){ const x=this.player.x,y=this.player.y,r=70,P=this._jamPools=(this._jamPools||[]).filter(o=>o.until>(this.elapsed||0));   // v7.9.17 Sticky Jam: บ่อแยม 3 วิ — ติดชั่วครู่ + โดนแรงขึ้น 25%
    if(P.length>=4)P.shift()?.img?.destroy();
    const img=this.trackArtVfx(this.camWorld(this.textures.exists('vfx_relic_jam')?this.add.image(x,y,'vfx_relic_jam').setDisplaySize(r*2,r*1.6).setAlpha(.75).setDepth(3):this.add.ellipse(x,y,r*2,r*1.6,0xff5f88,0.35).setDepth(3).setStrokeStyle(2,0xffd1e0)));
    const o={x,y,r,until:(this.elapsed||0)+3,left:12,img,stuck:new Set()};P.push(o);
    const tick=()=>{ if(img.active===false)return; if(--o.left<0){o.until=0;this.tweens.add({targets:img,alpha:0,duration:250,onComplete:()=>img.destroy()});return;}
      if(this.state==='play')this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&!e.isMini&&!o.stuck.has(e)&&this.dist(e.x,e.y,x,y)<r){ o.stuck.add(e); e.frozen=Math.max(e.frozen||0,this.relicSyn?.('chill','jam')?1:0.5); e.setVelocity?.(0,0); } });
      this.artDelay(250,tick); };
    tick(); }
  inJamPool(e){ const t=this.elapsed||0; for(const o of this._jamPools){ if(o.until>t&&this.dist(e.x,e.y,o.x,o.y)<o.r)return true; } return false; }
  relicColdSnap(e){ const x=e.x,y=e.y; this.burst?.(x,y,0x9fe8ff,14);   // v7.9.17 Cold Snap: ทุก 6 วิ ตีครั้งถัดไปแช่แข็งเป้า + รอบ ๆ 1 วิ (บอส/มินิไม่โดน)
    this.enemies.children.iterate(o=>{ if(o&&o.active&&!o.isBoss&&!o.isMini&&o.hp>0&&this.dist(o.x,o.y,x,y)<110&&this.applyFreeze(o,1))o.setVelocity(0,0); }); }
  endlessCards(n){ const b=this.basicAttack,d=this.basicAttackInfo(); b.endless=b.endless||{}; const out=[];
    for(const s of Phaser.Utils.Array.Shuffle(this.endlessStatDefs().slice())){ if(out.length>=n)break; const stack=(b.endless[s.id]||0)+1,rr=rollRarity();
      out.push({type:'basic',key:'endless_'+s.id,lvl:stack,max:99,kind:'Power Up',color:rr.color,rarity:rr,emoji:s.emoji,title:s.title,desc:s.desc+(stack>1?('  ·  Stack '+stack):''),iconKey:SKILL_ICON[d.skill],apply:()=>{b.endless[s.id]=(b.endless[s.id]||0)+1;s.apply(this.player);if(s.id==='ehp'&&this.drawBars)this.drawBars();}}); }
    return out; }
  endlessStatDefs(){
    // v4.55: ใช้เพดานเดียวกับ meta (STAT_CAPS) · ดาเมจ +5% แบบบวก (ไม่คูณทบ) · capped()=true → ไม่เสนอการ์ดนั้น
    const C=STAT_CAPS,p=this.player||{};
    return [
      {id:'edmg',  emoji:'🔥', title:'Sweet Surge',    desc:'+5% damage',         capped:()=>p.dmgMul>=C.dmgMul, apply:p=>{p.dmgMul=Math.min(C.dmgMul,p.dmgMul+0.05);}},
      {id:'ehp',   emoji:'🧁', title:'Mochi Heart+',  desc:'+10% max HP (+heal)', capped:()=>false, apply:p=>{const add=Math.max(1,Math.round(p.maxhp*0.10));p.maxhp+=add;p.hp=Math.min(p.maxhp,p.hp+add);}},
      {id:'ecrit', emoji:'🎯', title:'Keen Sights',     desc:'+3% crit chance',    capped:()=>(p.critChance||0)>=C.critChance, apply:p=>{p.critChance=Math.min(C.critChance,(p.critChance||0)+0.03);}},
      {id:'ecdmg', emoji:'💥', title:'Critical Force',  desc:'+10% crit damage',   capped:()=>false, apply:p=>{p.critMul=(p.critMul||1.55)+0.10;}},
      {id:'ecdr',  emoji:'⚡', title:'Quick Cast',      desc:'-4% cooldown',       capped:()=>(p.cdMul||1)<=C.cdMulMin, apply:p=>{p.cdMul=Math.max(C.cdMulMin,(p.cdMul||1)*0.96);}},
      {id:'espd',  emoji:'👟', title:'Nimble Step',     desc:'+4% move speed',     capped:()=>p.baseSpeed>=BALANCE.moveSpeed*C.speedMul, apply:p=>{p.baseSpeed=Math.min(BALANCE.moveSpeed*C.speedMul,p.baseSpeed*1.04);}},
      {id:'eregen',emoji:'💗', title:'Sweet Renewal',   desc:'+0.5 HP/s regen',    capped:()=>false, apply:p=>{p.regen=(p.regen||0)+0.5;}},
      {id:'eguard',emoji:'🛡️', title:'Mochi Shell',     desc:'Take 4% less damage',capped:()=>(p.dmgTakenMul||1)<=C.dmgTakenMin, apply:p=>{p.dmgTakenMul=Math.max(C.dmgTakenMin,(p.dmgTakenMul||1)*0.96);}},
      // v6.74 A4: การ์ดเงื่อนไขย้ายไปหน้า Relic (condRelicCard)
    ].filter(d=>!d.capped());
  }
  condRelicCard(){ const b=this.basicAttack; if(!b)return null; const own=b.condRelics||[];
    const D=[['c_streak','🔥','Kill Streak','+3% damage per kill in your streak (max +40%)'],['c_close','🛡️','Last Stand','Take 30% less damage while HP < 35%']].filter(d=>!own.includes(d[0]));
    if(!D.length)return null; const [id,emoji,title,desc]=Phaser.Utils.Array.GetRandom(D);
    return {type:'relic',key:'cond_'+id,iconKey:'relic_'+({c_streak:'streak',c_close:'laststand'})[id],lvl:1,max:1,kind:'Instinct',color:0xc07bff,emoji,title,desc,headline:'🎯 '+desc,apply:()=>{ b.condRelics=(b.condRelics||[]).concat(id); const p=this.player; p._cond=p._cond||{}; p._cond[id]=(p._cond[id]||0)+2; this.showBanner(emoji+' '+title,desc,1600); Sfx.clear(); }}; }
  bestiaryKey(e){ const si=this.stageIndex|0; if(e.isBoss)return 'boss'+si; if(e.isMini)return 'mini'+si;
    if(e._bkS===si&&e._bkR===e.roleName&&e._bk)return e._bk; let k=null;
    if(si>=1&&si<=9&&e.roleName){ const f='f'+si+'_'+bestSlug(e.roleName); if(BESTIARY_IDS.has(f))k=f; }
    if(!k)k=e._bestiaryType||(e.acid?'acid':e.dasher?'dasher':e.siege?'siege':e.shooter?'shooter':e.bomber?'bomber':(e.texture&&e.texture.key==='e_fast'?'fast':(e.texture&&e.texture.key==='e_tank')||e.isElite?'tank':'basic'));
    e._bkS=si; e._bkR=e.roleName; e._bk=k; return k; }
  // v8.0.30 จุดอ่อนจาก Bestiary ขั้น 3: +5% ดาเมจใส่ชนิดนั้น (ชุดคำนวณตอนเริ่มด่าน)
  bestWeakMul(e){ const W=this._bestW; if(!W||!W.size||!e||e.isDummy)return 1; const k=this.bestiaryKey(e); return W.has(k)?BEST_WEAK_MUL+(typeof codexLv==='function'?codexLv(k)*CODEX_STEP:0):1; }
  codexUpgrade(id){ const m=BESTIARY.find(x=>x.id===id); if(!m||bestiaryLv(id)<BEST_MAX_TIER){ Sfx.error?.(); return false; } const lv=codexLv(id); if(lv>=CODEX_MAX){ Sfx.error?.(); return false; } const c=codexCost(id),have=Save.data.memories|0; if(have<c){ Sfx.error?.(); this.showBanner?.('💭 Need '+c+' Memories','Unlock more Bestiary tiers to remember more',1500); return false; }
    Save.data.memories=have-c; const cx=Save.data.codex||(Save.data.codex={}); cx[id]=lv+1; Save.save(); if(this._bestW&&this._bestW.has(id)){} Sfx.menuCue?.('forge_lv_up',.45)||Sfx.select?.(); this.showBanner?.('📖 Codex Lv '+(lv+1),m.name+' · weak spot +'+Math.round((BEST_WEAK_MUL-1+(lv+1)*CODEX_STEP)*100)+'% damage',1500); this.buildBestiary?.(); this.a12?.('ui_codex_up',.45); this.menuArtFx?.('vfx78_codex_up',this.W/2,this.H*.45,140); return true; }
  condDmgMul(e){ const yz=this.character==='yuzu'?this.yuzuVulnerable(e):1; const P=this.player,c=P&&P._cond; if(!c)return yz*(this.bestWeakMul?this.bestWeakMul(e):1); let m=yz*(this.bestWeakMul?this.bestWeakMul(e):1); const f=P.hp/Math.max(1,P.maxhp);
    if(c.c_low&&f<0.5)m+=0.20*c.c_low; if(c.c_full&&f>=0.9)m+=0.12*c.c_full;
    if(c.c_dash&&(this.elapsed||0)-(this._lastDashAt??-99)<2)m+=0.25*c.c_dash;
    if(c.c_still&&P.body&&P.body.velocity.length()<20)m+=0.15*c.c_still;
    if(c.c_boss&&(e.isBoss||e.isMini||e.isElite))m+=0.15*c.c_boss;
    if(c.c_streak&&this.killStreak)m+=Math.min(0.20,0.015*this.killStreak)*c.c_streak;
    return m; }
  condTakenMul(){ const P=this.player,c=P&&P._cond; return this.ptTakenMul()*((!c||!c.c_close||P.hp/Math.max(1,P.maxhp)>=0.35)?1:Math.max(0.4,1-0.15*c.c_close)); }
  ptTakenMul(){ const P=this.player,PT=P&&P._pt; if(!PT)return 1; let m=1; const st=this._ptStill||0;
    if(PT.still&&st>=0.6)m*=1-PT.still; if(PT.ghillie&&st>=1.5)m*=0.4; if(PT.stillWall&&st>=0.6)m*=0.6; if(PT.moveGuard&&st===0&&P.body&&P.body.velocity.length()>40)m*=1-PT.moveGuard; if(PT.farmor&&(this.elapsed||0)<(this._ptArmorT||0))m*=0.7; if(PT.chin)m*=1-PT.chin; if(PT.dashGuard&&this._dashBuffT>0)m*=0.7; if(PT.trGuard&&this._titanHold)m*=1-PT.trGuard;
    if(PT.surround){let n=0;this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,P.x,P.y)<170)n++;});if(n>=5)m*=1-PT.surround;} return m; }
  cardOpen(t){ const n=CARD_UNLOCK[t]; if(n==null||this._inTutorial||!this.usesStoryBudget?.()||typeof Save==='undefined'||!Save.data)return true; return Math.max(this.stageIndex||0,Save.data.unlockedStage||0)>=n; }
  rollBasicAttackUpgrades(n,opts){
    const d=this.basicAttackInfo(),b=this.basicAttack;if(!d||!b)return [];
    const noSpecial=opts&&opts.noSpecial;
   // กล่องสุ่ม: ข้ามช่วง mutation/evolution (กันสุ่มได้อันเดิมซ้ำ)
    const fallbackIcon=SKILL_ICON[d.skill],makeCard=(u,extra={})=>{const c={type:'basic',key:u.id,lvl:extra.lvl||1,max:extra.max||u.max||1,kind:'Basic Attack',color:d.color,emoji:u.emoji,title:u.name,desc:u.desc,headline:u.headline,iconKey:u.iconKey||fallbackIcon,...extra};if(b.character==='yuzu'){c.iconKey=yuzuCardArt(b.path,u.id)||c.iconKey;const unl=({y_bigsplat:'Sour Trap',p_pulp:'Vaulting Shot',y_strongarm:'Pin & Pierce',y_giantslam:'Rind Breaker',y_longroot:'Sour Garden',y_elder:'Spicy Bloom',y_seedluck:'Honey Rescue'})[u.id];if(unl&&!b.evolved&&!(b.lv?.[u.id]>0))c.headline='🔓 Unlocks '+unl;if(u.id==='seedling'){const count=this.yuzuSeedMax?.()||0,add=1;c.headline='+'+add+(add===1?' Minion · ':' Minions · ')+count+' → '+Math.min(10,count+add);}if(u.id==='uq_power'){c.headline='+20% Unique power';c.desc='Increase the power of empowered companion hits and the Unique finisher by 20% per rank.';}}return c;};
    // 🛤 Build Path: เลเวล 5 เลือกสายครั้งเดียว (ก่อน mutation) · v7.8.90 เดิม 6 ชนกับ Relic → สายเลื่อนเป็น 7 ทุกครั้ง
    const PATHS=this.isSesRune?.()?null:BASIC_PATHS[b.character];
    if(!noSpecial&&PATHS&&!b.path&&!this._inTutorial&&(this.level||1)>=5&&this.cardOpen?.('path')!==false){
      this.showBanner('🛤 Choose your Build Path','Pick one · the other two lock for this stage',1600);
      return PATHS.map(pt=>makeCard(pt,{desc:pt.desc,carry:this.pathCarryText?.(pt)||'',headline:pt.headline,kind:'Build Path',pathStyle:BUILD_PATH_STYLES[pt.id]||'New combat style',special:true,color:0x7fd4ff,apply:()=>{b.path=pt.id;this.syncBasicAttack();this.showBanner(pt.emoji+' '+pt.name,'Build path locked in · new upgrades unlocked',1800);Sfx.clear();this.playGrowthWorld?.('unlock');}}));
    }
    // 🍯 Flavor Infusion: เลเวล 10 เลือกธาตุ (หลังเลือกสายแล้ว)
    if(!noSpecial&&!b.infusion&&!this._inTutorial&&(this.level||1)>=13&&(!PATHS||b.path)&&this.cardOpen?.('infusion')!==false){
      this.showBanner('🍯 Flavor Infusion','Infuse your attack with a flavor',1600);
      return Phaser.Utils.Array.Shuffle(FLAVOR_INFUSIONS.slice()).slice(0,3).map(f=>makeCard(f,{desc:f.desc,kind:'Flavor Infusion',special:true,color:f.color,...(this.cocoaInfMatch(f.id)?{headline:'★ Build match: '+this.cocoaInfMatch(f.id)}:{}),apply:()=>{b.infusion=f.id;this.syncBasicAttack();this.showBanner(f.emoji+' '+f.name,'Your attacks now carry this flavor',1800);Sfx.clear();}}));
    }
    // ⭐ ช่วงพิเศษ #1 — เลือกสายกลายรูป (Mutation) timesเดียว: การ์ดทั้งจอเป็น mutation ล้วน
    if(!noSpecial&&b.mastery>=10&&!b.mutation&&this.cardOpen?.('mutation')!==false){   // v5.9: 8→10 ห่างขึ้น (เจ้าของ: เก่งเร็วไป)   // Mutation ออกช้าลง (เดิม mastery 5 → 8)
      const muts=d.mutations.filter(u=>!this.banishedKeys?.['b:'+u.id]);
      if(muts.length){ this.showBanner('⭐ Mutation Fork!','Choose one playstyle (the other locks)',1500);
        return muts.map(u=>makeCard(u,{mutation:true,special:true,apply:()=>{b.mutation=u.id;this.syncBasicAttack();this.showBanner(u.emoji+' '+u.name,'Mutation path chosen · the other is locked',1700);}})); }
    }
    // ✨ ช่วงพิเศษ #2 — Evolution timesเดียว: การ์ดเดียวเด่น ๆ ให้รู้สึกใหญ่
    const evoAt=Math.min(16,d.upgrades.reduce((s,u)=>s+(this.banishedKeys?.['b:'+u.id]?(b.lv[u.id]||0):u.max),0)+1);   // v4.54: เดิม 20 แต่ mastery สูงสุดได้แค่ 17 (16 อัพ+1 mutation) = evolution ไม่มีวันออก
    if(!this.isSesRune?.()&&!noSpecial&&b.mastery>=evoAt&&!b.evolved&&!this.banishedKeys?.['b:evolution']&&this.cardOpen?.('evolution')!==false){
      this.showBanner('✨ Ready to Evolve!','Ultimate upgrade for your Basic Attack',1600);
      const EVO_DESC=BASIC_EVO_DESC||{sprinkle:'Seeds fly straight and fast, piercing everything (no homing)',thunder:'Screen-wide lightning storm — multiple strikes, far longer chains',frost:'Fires 3 piercing lances (trident), each shattering ice shards at the end',meteor:'Bear Slam echoes, heals 2% HP, and Dash recharges 30% faster',mirror:'An extra mirror beam + longer, wider, harder-hitting shots'};
      const evo={id:'evolution',name:d.evolution,emoji:'✨',desc:'✨ '+(d.evolutionDesc||EVO_DESC[d.skill]||'Upgrades the whole Basic Attack!')+(()=>{const L=(typeof FUSIONS!=='undefined'&&FUSIONS[b.character])||[];return L.length?'  🧬 Fusion with '+L.map(f=>((typeof RELICS!=='undefined'&&RELICS[f.relic])||{}).name||f.relic).join(' / '):'';})()};
      return [makeCard(evo,{evolution:true,special:true,tags:WEAPON_TAGS[b.character]||[],color:0xffd54a,apply:()=>{b.evolved=true;this.syncBasicAttack();this.time.delayedCall(2300,()=>{if(this.state==='play'||this.state==='levelup')this.autoFusion();});Sfx.bp?.('shared_build_evolution',.7,1);this.showBanner('✨ EVOLUTION',d.name+' → '+d.evolution,2200);Sfx.clear();this.playGrowthWorld?.('unlock');}})];
    }
    // ----- WaitบNormal: ผสมสาย attack + passive + heal ให้หลากหลาย (แก้ปัญfind +ยิง ออกถี่) -----
    // สายอัพเกรด attack — ยิ่ง rank สูง โอกาสยิ่งน้อย (กันเจอใบเดิมซ้ำ)
    const mintLocked=b.character==='mint'&&!!b.path,berryLocked=b.character==='momo'&&!!b.path,cocoaLocked=b.character==='cocoa'&&!!b.path,storyCards=!noSpecial&&(this.usesStoryBudget?.()||(this.recipeMode&&!this._inTutorial)),chosenPath=PATHS?.find(pt=>pt.id===b.path);
    const focused=mintLocked||berryLocked||cocoaLocked||storyCards,groupOf=id=>this.isSesRune?.()?'shared':mintLocked?mintUpgradeGroup(b.path,id):berryLocked?berryUpgradeGroup(b.path,id):chosenPath?.upgrades.some(u=>u.id===id)?'path':'shared';
    const atk=[];
    const COUNT_IDS={seedling:1,s_slug:1,s_seek:1,s_return:1,p_heavydraw:1,p_impaler:1,p_executioner:1,p_froststack:1,p_chainshatter:1,p_quiver:1,family:1,p_pulp:1,volley:1,arc:1,surge:1,cluster:1,pane:1,buckshot:1,m_grow:1,m_hold:1,m_shard:1,l_far:1,l_twin:1,l_burst:1,b_wide:1,b_recoil:1,b_double:1,carom:1,p_shock:1,p_squall:1,p_facet:1};   // อัพเกรดแบบ "นับนัด" → +1 เต็มเสมอ (potency ใช้ไม่ได้กับจำนวน)
    const pathUps=(PATHS&&b.path)?(PATHS.find(x=>x.id===b.path)||{upgrades:[]}).upgrades.slice():[];
    if(b.infusion)pathUps.push(INFUSION_UP);
    for(const u of d.upgrades.concat(pathUps)){if(focused&&!groupOf(u.id))continue;if(b.character==='taro'&&b.path==='tempest'&&u.id==='rate')continue;   /* v8.1.135 same as Reserve Cell */const cur=b.lv[u.id]||0;if(cur>=u.max||this.banishedKeys?.['b:'+u.id])continue;
      const rr=rollRarity(),potNote=(!COUNT_IDS[u.id]&&rr.potency>1)?('  ⚡+'+Math.round((rr.potency-1)*100)+'% roll'):''; atk.push({group:focused?groupOf(u.id):null,w:b.character==='yuzu'&&u.id==='seedling'?Math.max(4,9-cur*1.5):Math.max(1,5-cur*1.5),card:makeCard(u,{lvl:cur+1,max:u.max,rarity:rr,color:rr.color,headline:berryLocked?(berryCardHeadline(b,u.id,this.skills[d.skill]||1,this.player)||u.headline):u.headline,desc:u.desc+potNote,apply:()=>{
        const isCount=COUNT_IDS[u.id],pot=isCount?1:(rr.potency||1);
        b.lv[u.id]=Math.min(u.max,(b.lv[u.id]||0)+1);
        b.ranks[u.id]=Math.min(u.max*(isCount?1:1.55),(b.ranks[u.id]||0)+pot);   // scalar = magnitude ถ่วง potency · count = จำนวนเต็ม
        this.syncBasicAttack();}})});}
    // v7.9.22 ⭐ Unique cards: หลังใช้ Unique ครบ 3 ครั้งในด่าน (เจ้าของเลือก ก) · ไม่โผล่ใน tutorial/ตัวละครที่ยังพัฒนา (Mutation)
    if((this._uqUses||0)>=3&&!this._inTutorial&&this.cardOpen?.('unique')!==false){ const UQ={kind:'⭐ Unique',color:0xffc94a,special:true,uniqueCard:true};
      for(const u of UNIQUE_CARDS){ const cur=b.lv[u.id]||0; if(cur>=u.max||this.banishedKeys?.['b:'+u.id])continue;
        atk.push({group:focused?'universal':null,w:2.2,card:makeCard(u,{...UQ,lvl:cur+1,max:u.max,iconKey:null,apply:()=>{ b.lv[u.id]=Math.min(u.max,(b.lv[u.id]||0)+1); this.syncBasicAttack(); }})}); }
      const MU=UNIQUE_MUTS[b.path]; if(MU&&!b.uqMut&&!HEROES_WIP.includes(b.character||this.character))for(const m of MU)atk.push({group:focused?'universal':null,w:2.6,card:makeCard({...m,max:1},{...UQ,kind:'⭐ Unique Mutation',color:0xff9f43,headline:'⭐ '+m.desc,iconKey:null,apply:()=>{ b.uqMut=m.id; this.showBanner?.('⭐ '+m.emoji+' '+m.name,m.desc,1800); this.syncBasicAttack(); }})}); }
    // v4.23: เลิกแจกการ์ด passive ใช้ร่วม (shared) — เหลือเฉพาะสายอัพเกรดอาวุธประจำตัว + mutation/evo · heal ไว้กันตันจอ/ฉุกเฉิน
    const hpFrac=this.player.hp/Math.max(1,this.player.maxhp);
    let healCard=null;
    if(hpFrac<0.999){const rr=rollRarity(),amount=Math.max(1,Math.round(this.player.maxhp*0.25*(this.player.healEffect||1)*(1+(rr.ranks-1)*0.5)));healCard={type:'heal',key:'sweetRecovery',iconKey:'ic_sweet_recovery',lvl:1,max:1,rarity:rr,color:rr.color,kind:'Instant Heal',emoji:'💖',title:'Sweet Recovery',desc:'Restore HP instantly '+amount+' HP · No passive slot',apply:()=>{const before=this.player.hp;this.player.hp=Math.min(this.player.maxhp,this.player.hp+amount);const healed=Math.round(this.player.hp-before);if(healed>0)this.popHeal(this.player.x,this.player.y,healed);Sfx.heal();}};}
    const pick=(arr)=>{if(!arr.length)return null;let tot=arr.reduce((s,x)=>s+x.w,0),r=Math.random()*tot;for(let i=0;i<arr.length;i++){r-=arr[i].w;if(r<=0)return arr.splice(i,1)[0].card;}return arr.splice(0,1)[0].card;};
    const out=[];
    if(focused){
      const pool=atk.slice();
      // Modifier/trade choices are shared options, not replacements of a path card.
      for(const c of this.endlessCards(this.endlessStatDefs().length))pool.push({group:'universal',w:1,card:c});
      if(healCard)pool.push({group:'universal',w:3,card:healCard});
      const buildDraft=storyCards||cocoaLocked;
      out.push(...pickMintCards(pool,n,buildDraft));
      if(hpFrac<0.40&&healCard&&!out.some(c=>c.key===healCard.key)){if(out.length<n)out.push(healCard);else{const protectedChoice=buildDraft?(out.find(c=>c.poolGroup==='path')||out.find(c=>c.poolGroup==='shared'&&c.type==='basic'&&!c.special)):null,at=buildDraft?out.findLastIndex(c=>c!==protectedChoice):n-1;if(at>=0)out[at]=healCard;}}
      Phaser.Utils.Array.Shuffle(out);const res=out.slice(0,n);this.yuzuUnlockGuard?.(res,atk);return this.yuzuDraftGuard?.(res,!!noSpecial)||res;
    }
    while(out.length<n&&atk.length){const c=pick(atk);if(c)out.push(c);else break;}
    if(hpFrac<0.40&&healCard){ out.length>=n?out[n-1]=healCard:out.push(healCard); }   // เลือดวิกฤต = การันตีการ์ดฟื้น
    else if(out.length<n&&healCard){out.push(healCard);healCard=null;}
    // ♾️ เติมช่องที่เหลือด้วยการ์ดสแตตไม่รู้จบ (อาวุธตันแล้วก็ยังมีอะไรให้เลือกเสมอ)
    if(out.length<n){
      b.endless=b.endless||{};
      const defs=Phaser.Utils.Array.Shuffle(this.endlessStatDefs().slice());
      for(const s of defs){ if(out.length>=n)break;
        const stack=(b.endless[s.id]||0)+1,rr=rollRarity();
        out.push({type:'basic',key:'endless_'+s.id,lvl:stack,max:99,kind:'Power Up',color:rr.color,rarity:rr,emoji:s.emoji,title:s.title,desc:s.desc+(stack>1?('  ·  Stack '+stack):''),iconKey:SKILL_ICON[d.skill],apply:()=>{b.endless[s.id]=(b.endless[s.id]||0)+1;s.apply(this.player);if(s.id==='ehp'&&this.drawBars)this.drawBars();}});
      }
    }
    Phaser.Utils.Array.Shuffle(out);
    const res=out.slice(0,n);this.yuzuUnlockGuard?.(res,atk);return this.yuzuDraftGuard?.(res,!!noSpecial)||res;
  }
  rollUpgrades(n,opts){ return this.rollBasicAttackUpgrades(n,opts); }   // v7.8.93 กองการ์ดสกิล/Passive/Awaken ยุคเก่าตัดแล้ว (ทุกฮีโร่ใช้ Basic Attack)
  clearStarGuardFx(){
    (this.ringBalls||[]).forEach(b=>{if(b&&b.active)b.destroy();});this.ringBalls=[];
    (this.starGuardFields||[]).forEach(f=>{if(f&&f.active)f.destroy();});this.starGuardFields=[];
    this._starTrailTick=0;this._starTrailIndex=0;
  }
  rebuildRing(){
    this.clearStarGuardFx();
    const lvl=this.skills.star||0; if(lvl<1)return;
    const isSesame=this.character==='sesame';
    const aw=lvl>=SKILL_AWAKEN_LV;            // ตื่นรู้: วงกาแล็กซี 3 ชั้น
    const count=aw?12:(2+lvl+(isSesame?1:0));                  // Sesame เริ่มต้นด้วยดาว +1 ดวง
    const rOuter=(aw?78:48+lvl*3)*(isSesame?1.15:1);          // วงคุ้มกันกว้างขึ้น
    const rMid=rOuter*0.72, rInner=rOuter*0.5;
    const twoRing=lvl>=6&&!aw;                // L6 วงคู่
    const size=(0.27+lvl*0.012)*(aw?1.18:1)*(isSesame?1.08:1); // ดาวห้าแฉกอ่านชัดราว 34–48px บนมือถือ
    const spark=lvl>=5||isSesame;             // กระจายประกายเมื่อชน
    this.ringSpin=(aw?4.6:2.6+lvl*0.28)*(isSesame?1.3:1);      // หมุนเร็วขึ้น 30%
    // เส้นทางโคจรโปร่งบางช่วยให้ Star Guard อ่านระยะป้องกันได้ โดยไม่เพิ่มแสงทึบกลางสนาม
    const fieldRadii=aw?[rOuter,rMid,rInner]:[rOuter];
    fieldRadii.forEach((rr,i)=>{const f=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_ring').setTint(i===0?0xff9ec4:0xffd166).setDepth(3).setDisplaySize(rr*2,rr*1.64).setAlpha(i===0?0.12:0.07));f._phase=i*1.7;f._spinDir=i%2?-1:1;this.starGuardFields.push(f);});
    for(let i=0;i<count;i++){
      const tier=aw?(i%3):(twoRing?(i%2===0?0:2):0);   // aw: 3 ชั้น (0=นอก,1=กลาง,2=ใน)
      const rr=tier===0?rOuter:tier===1?rMid:rInner;
      // ใช้ silhouette จากไอคอนแทน flipbook เดิมซึ่งมีดาวจริงเล็กเกินไปจนเห็นเป็นวงเหลืองเมื่อย่อ
      const b=this.camWorld(this.physics.add.sprite(0,0,'ic_star').setScale(size).setDepth(88000));
      b.setCircle(38,26,26); b.body.setAllowGravity(false); b.dmg=(4+lvl*1.5)*(BALANCE.skillPower.star||1)*(aw?1.12:1)*(isSesame?1.10:1); b.hitCd=0;
      b.rr=rr; b.ang0=(i/count)*Math.PI*2;b._baseScale=size;b._motionPhase=(i/count)*Math.PI*2;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{ if(ball.hitCd>0)return; ball.hitCd=isSesame?0.09:0.12;
        this.damage(en,ball.dmg*this.player.dmgMul,ball.x,ball.y);
        if(spark)this.burst(ball.x,ball.y,0xffe08a); });
      this.ringBalls.push(b);
    }
  }

  /* ---------- SPAWN ---------- */
  antArtKey(type){
    const base=type==='acid'?'e_acid':type==='elite'||type==='bomber'?'e_ant_drone':type==='fast'||type==='dasher'?'e_ant_scout':type==='shooter'?'e_ant_spitter':type==='tank'||type==='siege'?'e_ant_soldier':'e_ant_worker';
    if(this.textures.exists(base+'_animated'))return base+'_animated';
    return this.textures.exists(base+'_readable')?base+'_readable':base;
  }
  drainArtKey(type){
    const base=type==='fast'||type==='dasher'?'e_drain_dasher':type==='shooter'?'e_drain_caster':type==='bomber'?'e_drain_bomber':type==='tank'||type==='siege'||type==='elite'?'e_drain_tank':'e_drain_slime';
    return this.textures.exists(base+'_animated')?base+'_animated':base;
  }
  fireArtKey(type){
    const base=type==='fast'||type==='dasher'?'e_fire_chili':type==='shooter'?'e_fire_grinder':type==='bomber'?'e_fire_bomber':type==='tank'||type==='siege'||type==='elite'?'e_fire_golem':'e_fire_ember';
    return this.textures.exists(base+'_animated')?base+'_animated':base;
  }
  iceArtKey(type){
    const base=type==='fast'||type==='dasher'?'e_ice_shard':type==='shooter'?'e_ice_caster':type==='bomber'?'e_ice_bomber':type==='tank'||type==='siege'||type==='elite'?'e_ice_guardian':'e_ice_wisp';
    return this.textures.exists(base+'_animated')?base+'_animated':base;
  }
  stage5ArtKey(type){
    const base=type==='fast'||type==='dasher'?'e_crown_ripper':type==='shooter'?'e_banquet_eye':type==='bomber'?'e_maw_truffle':type==='tank'||type==='siege'||type==='elite'?'e_royal_oven_sentinel':'e_void_crumb';
    return this.textures.exists(base+'_animated')?base+'_animated':base;
  }
  chapter3ArtKey(type){
    const base='c3_e_'+(type==='fast'||type==='dasher'?'fast':type==='shooter'?'shooter':type==='bomber'?'bomber':type==='tank'||type==='siege'?'tank':'basic');
    return this.textures.exists(base+'_animated')?base+'_animated':base;
  }
  canopyArtKey(type){
    const id=type==='fast'||type==='dasher'?'vine_hunter':type==='shooter'?'spore_lantern':type==='bomber'?'fruit_pod':type==='tank'?'root_beetle':type==='siege'?'thorn_oracle':'sprout';
    const key='c21_'+id+'_animated';return this.textures.exists(key)?key:'ch2_enemy_atlas';
  }
