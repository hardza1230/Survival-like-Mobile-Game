  buildChars(){
    this.menu.y=0;this.menu.removeAll(true);this.tapZones=[];if(!this._heroPreview)this._heroPreview=Save.data.character||'momo';this._screenBg('Heroes','screen_heroes');this.drawRosterTabs();
    if(Object.values(Save.data.charUnlockNew||{}).some(Boolean)){Save.data.charUnlockNew={};Save.save();}
    const w=this.W,h=this.H,p=w/941,landscape=w>h,side=30*p,extra=landscape?0:Math.max(0,h-1672*p),gap=18*p,rowGap=Math.min(gap+extra*.20,26*p);
    const roster=CHAR_ORDER.filter(id=>typeof heroRevealed==='function'?heroRevealed(id):(id==='momo'||FIGHTER_PLAYTEST_ALL||(Save.data.chars||[]).includes(id)));   // v7.9.83 เจ้าของ: ซ่อนฮีโร่ที่ยังไม่ปลด (ไม่โชว์ล็อก) จนกว่าจะถึงด่าน
    if(!roster.includes(this._heroPreview))this._heroPreview=roster.includes(Save.data.character)?Save.data.character:roster[0];
    const id=this._heroPreview,c=CHARACTERS[id];
    const info={momo:['Ranged · Easy','Ranged','Fast seed shots.\nA great first hero.',0xff93b3],mint:['Control','Control','Frost lances.\nSlow and freeze.',0x81e9eb],cocoa:['Melee','Melee','Powerful bear punches.\nHold the frontline.',0xf5bb7e],taro:['Lightning','Lightning','Arc, Sparks and sentries.\nControl the battlefield.',0xd1a0ff],yuzu:['Summoner','Summoner','Seeds and one citrus friend.\nChoose tank, ranger or witch.',0xf5ec83],sesame:['Invoker','Invoker','Mix P / M / B runes.\nTen elemental invocations.',0xe4e0eb]};
    const detail=info[id],cols=landscape?Math.max(2,Math.min(4,Math.floor(w/215))):2;
    const panelW=w-side*2,top=this.heroesContentTop(),panelH=landscape?160:368*p+extra*.35,g=this.add.graphics();
    this.rosterChrome('preview',side,top,panelW,panelH);this.menu.add(g);
    const aw=panelW*.53;
    if(!this._characterCardArt(id,side+aw*.50,top+panelH*.51,aw*.96,panelH*.96))this.menu.add(this.add.text(side+aw/2,top+panelH/2,c.emoji,{fontSize:'64px'}).setOrigin(.5));
    const tx=side+aw+5,rw=panelW-aw-18,fs=Math.max(18,58*p);
    const infoSize=32,infoX=side+panelW-infoSize-9,infoY=top+9;
    const title=this.add.text(tx,top+14,c.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:fs+'px',color:'#fff1de',stroke:'#692e43',strokeThickness:2});this.menu.add(title);
    let nf=fs;while(title.width>rw-infoSize-6&&nf>12){nf--;title.setFontSize(nf+'px');}
    const badgeY=top+panelH*.27;
    g.lineStyle(1.5,detail[3],.9).lineBetween(tx,top+panelH*.23,tx+rw,top+panelH*.23);
    const badgeText=this.add.text(0,0,detail[0],{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(10,24*p)+'px',color:'#ffe8ee'}),badgeH=Math.max(24,54*p),badgeW=Math.min(rw,badgeText.width+badgeH+12);
    this.rosterChrome('badge',tx,badgeY,badgeW,badgeH);this.rosterIcon(detail[1].toLowerCase(),tx+badgeH*.5,badgeY+badgeH/2,badgeH*.65);
    badgeText.setPosition(tx+badgeH+3,badgeY+badgeH/2).setOrigin(0,.5);let bf=parseFloat(badgeText.style.fontSize);while(badgeText.width>badgeW-badgeH-7&&bf>8)badgeText.setFontSize(--bf+'px');this.menu.add(badgeText);
    const sw=SIGNATURE_WEAPONS[c.weapon],weapon=this.add.text(tx,top+panelH*.47,sw.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(11,28*p)+'px',color:'#ffe5aa',wordWrap:{width:rw},maxLines:1});this.menu.add(weapon);
    const hint=this.add.text(tx,top+panelH*.60,detail[2],{fontFamily:'NunitoUI, sans-serif',fontSize:Math.max(10,25*p)+'px',color:'#ddd0e3',lineSpacing:2,wordWrap:{width:rw},maxLines:2});this.menu.add(hint);
    this.rosterChrome('badge',infoX,infoY,infoSize,infoSize);this.menu.add(this.add.text(infoX+infoSize/2,infoY+infoSize/2,'!',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff1ee'}).setOrigin(.5));
    this._zone(infoX,infoY,infoSize,infoSize,()=>this.showCharacterInfo(id));this.tapZones[this.tapZones.length-1].tag='hero_details';

    const labelY=top+panelH+49*p;
    this.rosterIcon('flower',w*.30,labelY,27*p);this.rosterIcon('flower',w*.70,labelY,27*p);
    this.menu.add(this.add.text(w/2,labelY,'Choose your hero',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(15,36*p)+'px',color:'#fff0df',stroke:'#44233c',strokeThickness:2}).setOrigin(.5));
    const cw=(panelW-gap*(cols-1))/cols,ch=cw*.60,y0=labelY+33*p;
    roster.forEach((key,i)=>{const row=Math.floor(i/cols),col=i%cols,rowCount=Math.min(cols,roster.length-row*cols),rowW=rowCount*cw+(rowCount-1)*gap,x=(w-rowW)/2+col*(cw+gap),y=y0+row*(ch+rowGap),hero=CHARACTERS[key],owned=FIGHTER_PLAYTEST_ALL||Save.data.chars.includes(key),chosen=Save.data.character===key,preview=key===id,meta=info[key],round=cw*42/768,artKey='roster_'+key;
      const back=this.add.graphics();back.fillStyle(0x211427,.95).fillRoundedRect(x,y,cw,ch,round);this.menu.add(back);
      if(this.textures.exists(artKey))this.menu.add(this.add.image(x+cw/2,y+ch/2,artKey).setDisplaySize(cw,ch).setAlpha(owned?1:.4));else this._characterCardArt(key,x+cw*.57,y+ch*.48,cw*.85,ch*.93,owned?1:.4);
      const shade=this.add.graphics();shade.fillStyle(0x1b0c26,.30).fillRoundedRect(x+2,y+ch-108*p,cw-4,106*p,Math.max(3,round-2));this.menu.add(shade);
      const frame=this.add.graphics();if(chosen){frame.lineStyle(9,0xffd366,.18).strokeRoundedRect(x,y,cw,ch,round);frame.lineStyle(3,0xffdc79,1).strokeRoundedRect(x,y,cw,ch,round);frame.lineStyle(1,0xfff0af,.95).strokeRoundedRect(x+3,y+3,cw-6,ch-6,Math.max(2,round-3));}else frame.lineStyle(preview?2.5:1.6,preview?0xffe3b7:meta[3],preview?1:.7).strokeRoundedRect(x,y,cw,ch,round);
      this.menu.add(frame);
      this.menu.add(this.add.text(x+11,y+ch-98*p,hero.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(13,32*p)+'px',color:'#ffffff',stroke:'#251124',strokeThickness:3}).setOrigin(0,0));
      this.menu.add(this.add.text(x+67*p,y+ch-28*p,owned?meta[1]:'Locked',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(10,25*p)+'px',color:'#'+meta[3].toString(16).padStart(6,'0'),stroke:'#251124',strokeThickness:2}).setOrigin(0,.5));
      this.rosterIcon(meta[1].toLowerCase(),x+36*p,y+ch-28*p,32*p);
      if(HEROES_WIP.includes(key)&&key!=='sesame'){const bh=Math.max(18,30*p),bt=this.add.text(x+cw/2,y+10*p+bh/2,'🚧 In development',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(10,20*p)+'px',color:'#2a1a00'}).setOrigin(.5),bw2=Math.min(cw-8,bt.width+16),bg=this.add.graphics();bg.fillStyle(0xffc94a,.95).fillRoundedRect(x+cw/2-bw2/2,y+10*p,bw2,bh,bh/2);this.menu.add([bg,bt]);}
      if(typeof heroTalentSpendable==='function'&&heroTalentSpendable(key))this.drawBadgeDot(this.menu,x+cw-10,y+10);   // v7.9.55 มี TP ใช้ได้
      if(chosen)this.rosterIcon('check',x+cw-34*p,y+34*p,59*p);
      this._zone(x,y,cw,ch,()=>{this._heroPreview=key;Sfx.select();this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='char_'+key;
    });
    const rows=Math.ceil(roster.length/cols),fy=y0+rows*ch+(rows-1)*rowGap+70*p+Math.min(extra*.25,24*p),bw=Math.min(panelW*.78,390),buttonH=Math.max(44,Math.min(60,110*p)),owned=FIGHTER_PLAYTEST_ALL||Save.data.chars.includes(id),chosen=Save.data.character===id,button=this.add.graphics();
    this.rosterChrome('footer',w/2-bw/2,fy-buttonH/2,bw,buttonH);
    this.menu.add(this.add.text(w/2,fy,chosen?'Selected: '+c.name:owned?'Select '+c.name:'Locked: '+c.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.max(14,38*p)+'px',color:'#fff5ed',stroke:'#81334e',strokeThickness:1}).setOrigin(.5));
    this._zone(w/2-bw/2,fy-buttonH/2,bw,buttonH,()=>{if(!owned){this.showCharacterInfo(id);return;}if(chosen)return;Save.data.character=id;Save.save();this.character=id;Sfx.select();this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='hero_confirm';
    this.menu.add(this.add.text(w/2,fy+buttonH/2+13,'Tap a hero to preview',{fontFamily:'NunitoUI, sans-serif',fontSize:Math.max(10,24*p)+'px',color:'#cbb6d1'}).setOrigin(.5));this.menu.setVisible(true);
  }
  showCharacterInfo(id){const returnScroll=this._mScroll||0;this.cancelMenuMotion();this.setMenuScroll(0);const c=CHARACTERS[id],w=this.W,h=this.H,bw=Math.min(w-32,430),bh=Math.min(h-60,410),x=(w-bw)/2,y=(h-bh)/2;
    const shade=this.add.rectangle(0,0,w,h,0x0c0815,0.88).setOrigin(0),panel=this.add.graphics();panel.fillStyle(0x281e34,1);panel.fillRoundedRect(x,y,bw,bh,18);panel.lineStyle(2,c.color,1);panel.strokeRoundedRect(x,y,bw,bh,18);
    const gate=CORE_UNLOCK_STAGE[id],owned=Save.data.chars.includes(id),unlock=HEROES_WIP.includes(id)&&id!=='sesame'?'🚧 In development — cards and balance will change':FIGHTER_PLAYTEST_ALL?'Available for playtest ✓':owned?'Unlocked ✓':gate!=null?'Unlock: Clear Stage '+(gate+1):'In development · unlock plan reserved';
    const title=this.add.text(w/2,y+32,c.emoji+' '+c.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffffff'}).setOrigin(0.5);
    const role=this.add.text(w/2,y+71,c.role+' · '+SIGNATURE_WEAPONS[c.weapon].name,{fontFamily:'NunitoUI, sans-serif',fontSize:'12px',color:'#ffe6ad',align:'center',wordWrap:{width:bw-34}}).setOrigin(0.5);
    const desc=this.add.text(x+22,y+111,c.desc,{fontFamily:'NunitoUI, sans-serif',fontSize:'14px',color:'#e7daed',wordWrap:{width:bw-44},lineSpacing:6}).setOrigin(0,0);
    const condition=this.add.text(w/2,y+bh-62,unlock,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#a8f0c0',align:'center'}).setOrigin(0.5);
    const close=this.add.text(w/2,y+bh-26,'Tap to close',{fontFamily:'NunitoUI, sans-serif',fontSize:'12px',color:'#b9aac9'}).setOrigin(0.5);this.menu.add([shade,panel,title,role,desc,condition,close]);
    this.tapZones=[];this._zone(0,0,w,h,()=>{this._mScroll=returnScroll;this.buildMenuScreen();});
  }
  buildChapterSelect(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Choose Chapter','screen_chapter');
    const w=this.W,h=this.H,portrait=w<=h,cols=portrait?1:2,gap=9,side=14,top=portrait?88:62;
    const cw=(w-side*2-gap*(cols-1))/cols,rows=Math.ceil((CHAPTERS.length+2)/cols),ch=Math.min(portrait?94:82,(h-top-16-gap*(rows-1))/rows);
    const tutorialPassed=!!(Save.data.tutorialCoachPassed||Save.data.tutorialRewardGiven);
    { const x=side,y=top;
      const g=this.add.graphics();g.fillStyle(0x261a38,0.98);g.fillRoundedRect(x,y,cw,ch,15);g.lineStyle(2.4,tutorialPassed?0x8de2ac:0xffcf88,0.98);g.strokeRoundedRect(x,y,cw,ch,15);
      const art=this.textures.exists('tile___tutorial')?this.add.image(x+ch/2,y+ch/2,'tile___tutorial').setDisplaySize(ch-14,ch-14):null;
      const tx=x+Math.min(ch+3,99),name=this.add.text(tx,y+17,'Tutorial',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#fff2dc'}).setOrigin(0,0);
      const desc=this.add.text(tx,y+40,'Training Ground · Learn the basics',{fontFamily:'sans-serif',fontSize:'10px',color:'#d6c4e3',wordWrap:{width:cw-(tx-x)-80},maxLines:2}).setOrigin(0,0);
      const state=this.add.text(x+cw-13,y+ch/2,tutorialPassed?'PASS ✓':'Start ▶',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:tutorialPassed?'#aaf0bd':'#ffe08a'}).setOrigin(1,0.5);
      this.menu.add([g,...(art?[art]:[]),name,desc,state]);this._zone(x,y,cw,ch,()=>this.startChapterTutorial());
    }
    CHAPTERS.forEach((c,i)=>{const slot=i+1,col=slot%cols,row=Math.floor(slot/cols),x=side+col*(cw+gap),y=top+row*(ch+gap),progressOpen=i===0||!!(Save.data.stageMastery||{})[((c.stages||[0])[0])-1],open=!!c.ready&&progressOpen&&(i!==0||tutorialPassed);
      const coverKey=['chapter1_cover','chapter2_cover','chapter3_cover'][i],art=coverKey&&this.textures.exists(coverKey)?this._coverImage(x+2,y+2,cw-4,ch-4,coverKey):null;if(art)this.menu.add(art);
      const g=this.add.graphics();g.fillStyle(open?0x17101f:0x1d1924,art?0.48:0.97);g.fillRoundedRect(x,y,cw,ch,15);g.lineStyle(open?2.4:1.5,open?0xffc85a:0x4b4354,open?0.95:0.65);g.strokeRoundedRect(x,y,cw,ch,15);
      if(open){g.fillStyle(0xffc85a,0.12);g.fillRoundedRect(x+3,y+3,cw-6,ch-6,12);}
      const icon=this.add.text(x+30,y+ch/2,open?c.emoji:'🔒',{fontSize:open?'30px':'25px'}).setOrigin(0.5),name=this.add.text(x+57,y+18,c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:open?'#fff4df':'#98909f'}).setOrigin(0,0);
      const desc=this.add.text(x+57,y+40,c.desc,{fontFamily:'sans-serif',fontSize:'9px',color:open?'#cfc2d5':'#746d7a',wordWrap:{width:cw-126},maxLines:2}).setOrigin(0,0);
      const state=this.add.text(x+cw-13,y+ch/2,open?'Enter  ▶':i===0&&!tutorialPassed?'Clear Tutorial':c.ready?('Clear Chapter '+i):'Coming soon',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#ffe08a':'#756d7e'}).setOrigin(1,0.5);
      this.menu.add([g,icon,name,desc,state]);this._zone(x,y,cw,ch,open?()=>{this.selectedChapter=i;this.menuScreen='stage';this.buildMenuScreen();}:()=>this.showBanner('🔒 '+c.name,i===0&&!tutorialPassed?'Clear the Tutorial card above to unlock Chapter 1':c.ready?'Defeat The Great Hunger and clear Chapter 1 first':'This Chapter is in development',1200));
    });
    // การ์ด Endgame ต่อท้าย Chapter 3 → เข้า Recipe Maps
    { const slot=CHAPTERS.length+1,col=slot%cols,row=Math.floor(slot/cols),x=side+col*(cw+gap),y=top+row*(ch+gap),open=Save.endgameUnlocked();
      const art=this.textures.exists('chapter_endgame_cover')?this._coverImage(x+2,y+2,cw-4,ch-4,'chapter_endgame_cover'):null;if(art)this.menu.add(art);
      const g=this.add.graphics();g.fillStyle(open?0x1a1030:0x1d1924,art?0.48:0.97);g.fillRoundedRect(x,y,cw,ch,15);g.lineStyle(open?2.4:1.5,open?0xc58bff:0x4b4354,open?0.95:0.65);g.strokeRoundedRect(x,y,cw,ch,15);
      if(open){g.fillStyle(0xc58bff,0.12);g.fillRoundedRect(x+3,y+3,cw-6,ch-6,12);}
      const icon=this.add.text(x+30,y+ch/2,open?'📜':'🔒',{fontSize:open?'30px':'25px'}).setOrigin(0.5),name=this.add.text(x+57,y+18,'Endgame · Recipe Maps',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:open?'#f3e4ff':'#98909f'}).setOrigin(0,0);
      const desc=this.add.text(x+57,y+40,'Maps, Atlas, Uniques and the Pinnacle Boss',{fontFamily:'sans-serif',fontSize:'9px',color:open?'#d4c2e6':'#746d7a',wordWrap:{width:cw-126},maxLines:2}).setOrigin(0,0);
      const state=this.add.text(x+cw-13,y+ch/2,open?'Enter  ▶':'Finish Chapter 3',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#e2b8ff':'#756d7e'}).setOrigin(1,0.5);
      this.menu.add([g,icon,name,desc,state]);this._zone(x,y,cw,ch,open?()=>{this.menuScreen='recipes';this.buildMenuScreen();}:()=>this.showBanner('🔒 Endgame','Finish the story (Chapter 3) to unlock Recipe Maps',1200));
    }
    this.menu.setVisible(true);
  }
  loadTutArt(){ const miss=TUT_KEYS.filter(k=>!this.textures.exists(k)); if(!miss.length||this._tutArt)return; this._tutArt=true; try{ this.ensureGroup(k=>miss.includes(k),()=>{ this._tutArt=false; },{all:true,quiet:true}); }catch(e){ this._tutArt=false; } }   // v7.9.68 ใบ 38
  startChapterTutorial(){ this.loadTutArt?.();
    this._forceCoachTutorial=true;this.stageDiff=1;this.startRun(0);
  }
  buildStageSelect(){
    const chapterIndex=Phaser.Math.Clamp(this.selectedChapter||0,0,CHAPTERS.length-1),chapter=CHAPTERS[chapterIndex],range=chapter.stages||[0,STAGES.length-1],stageIds=[];for(let i=range[0];i<=range[1];i++)stageIds.push(i);
    this.ensureStageCards(chapterIndex);
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Choose stage · Chapter '+(chapterIndex+1),'screen_stage','chapter');
    const unlocked=Math.max(0,Save.data.unlockedStage||0);
    const note=this.add.text(this.W/2,this.W<=this.H?83:55,'CHAPTER SELECT  ·  Power ⚡ '+Save.power(Save.data.character),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#d3bce1'}).setOrigin(0.5);
    this.menu.add(note);
    const portrait=this.W<=this.H,cols=portrait?1:2,gapX=10,gapY=portrait?10:8,cardW=portrait?Math.min(this.W-28,410):Math.min(370,(this.W-38)/2),totalW=cardW*cols+gapX*(cols-1),x0=(this.W-totalW)/2;
    const rows=Math.ceil(stageIds.length/cols),y0=portrait?100:69,rowH=Math.min(portrait?112:90,(this.H-y0-18-gapY*(rows-1))/rows);
    stageIds.forEach((i,pos)=>{const st=STAGES[i],col=pos%cols,row=Math.floor(pos/cols),x=x0+col*(cardW+gapX),y=y0+row*(rowH+gapY),open=i<=unlocked&&isStageReady(i);
      this.uiStageCard(this.menu,x,y,cardW,rowH,st,i,open,()=>this.startStoryStage(i)); const lz=this.tapZones[this.tapZones.length-1]; if(lz)lz.tag='stage_'+i;
      if(open){const m=(Save.data.stageStars||{})[i]|0;this.menu.add(this.add.text(x+cardW-12,y+rowH*.36,this.starText(m),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:m?'#ffd84a':'#9a8fa8',stroke:'#2a1530',strokeThickness:3}).setOrigin(1,0)); if(sweepOk(i))this.sweepBtn(x+cardW-96,y+rowH-8,i);}   // v7.8.60 ดาวรายด่าน · v8.1.70 Sweep
    });
    this.menu.setVisible(true);
  }
  // เลือกระดับความยาก 1-5 ก่อนเข้าStage — กฎเหล็ก: ยิ่งยาก ศัตรูยิ่งถึก/แรง แต่better rewards
  startStoryStage(idx){
    if(!Save.data.tutorialDone){this.startChapterTutorial();return;}
    // Mint is an optional ally; Stage 3 accepts the player's selected hero.   // v6.55.4 Mint เตือนก่อนเข้าด่าน 3
    { const hi=typeof HERO_INTROS!=='undefined'?HERO_INTROS.find(x=>x.idx===idx):(idx===1?{idx:1,id:'mint',flag:'mintIntro'}:null),d=Save.data; if(hi&&!d[hi.flag]&&!(d.stageMastery||{})[idx]){ if(typeof MC_HERO_SCENE!=='undefined'&&this.mcGate?.(MC_HERO_SCENE[hi.id],()=>this.startStoryStage(idx)))return; d[hi.flag]=1; Save.save(); const owned=(typeof FIGHTER_PLAYTEST_ALL!=='undefined'&&FIGHTER_PLAYTEST_ALL)||(d.chars||[]).includes(hi.id)||hi.id==='mint'; if(owned&&(this.character||d.character)!==hi.id){ this._mintIntroIdx=idx; this.showMintWarning(hi); return; } } }   // v6.85 แนะนำ Mint · v7.6.3 + Cocoa (ข้ามถ้ายังไม่ปลดหรือใช้ตัวนั้นอยู่แล้ว)
    if(this.rubyStageStory(idx,()=>this.startStoryStage(idx)))return;
    if(!this._rubyEntry&&isStageReady(idx))this.rubyEntryCurtain?.(idx);
    this._dailyRun=false;this._challengeChoice=null;this._challengeRequested=null;this.stageDiff=1;this.startRun(idx);
  }
  showMintWarning(hi=HERO_INTROS[0]){ const w=this.W,h=this.H; this.tapZones=[];   // ชื่อเดิม · ใช้กับฮีโร่ทุกตัวใน HERO_INTROS
    const shade=this.add.rectangle(0,0,w,h,0x0a0612,0.86).setOrigin(0); this.menu.add(shade);
    const ah=Math.min(h*0.46,360),aw=ah*0.75,art=this.textures.exists(hi.card)?this.add.image(w/2,h*0.30,hi.card).setDisplaySize(aw,ah):this.add.text(w/2,h*0.30,hi.emoji,{fontSize:'90px'}).setOrigin(0.5); this.menu.add(art);
    this.tweens.add({targets:art,y:art.y-8,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    const bw=Math.min(w-30,420),bh=96,bx=(w-bw)/2   /* v8.1.150 เจ้าของ: คำแนะนำตัวฮีโร่ยาวไป → ประโยคสั้น ตัวใหญ่ขึ้น */,by=h*0.30+ah/2+6,g=this.add.graphics();
    g.fillStyle(0xffffff,0.97);g.fillRoundedRect(bx,by,bw,bh,18);g.fillTriangle(w/2-12,by+1,w/2+12,by+1,w/2,by-14);g.lineStyle(3,hi.edge,1);g.strokeRoundedRect(bx,by,bw,bh,18);
    const nm=this.add.text(bx+16,by+12,hi.emoji+' '+hi.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:hi.color});
    const tx=this.add.text(bx+16,by+40,hi.text,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#2a1a33',wordWrap:{width:bw-32},lineSpacing:4});
    this.menu.add([g,nm,tx]);
    const btw=Math.min(w-60,300),bth=48,bty=Math.min(h-40,by+bh+40),btn=this.add.graphics();btn.fillStyle(hi.btn,1);btn.fillRoundedRect(w/2-btw/2,bty-bth/2,btw,bth,20);btn.lineStyle(3,hi.btnEdge,1);btn.strokeRoundedRect(w/2-btw/2,bty-bth/2,btw,bth,20);
    const bt=this.add.text(w/2,bty,hi.label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffffff',stroke:hi.stroke,strokeThickness:3}).setOrigin(0.5);this.menu.add([btn,bt]);
    this.tweens.add({targets:[btn,bt],alpha:0.75,duration:600,yoyo:true,repeat:-1});
    this.menu.setVisible(true);Sfx.select&&Sfx.select();
    const t0=Date.now();this._zone(w/2-btw/2,bty-bth/2,btw,bth,()=>{if(Date.now()-t0<900)return;this._mintCoach=hi;this._heroesTab='roster';this.menuScreen='char';this.buildMenuScreen();});   // v8.2.1 owner 🐞: the tap that closed the rescue scene fell through to this button → straight to Heroes; ignore taps for 0.9 s
    { const ky=Math.min(h-14,bty+bth/2+30),kt=this.add.text(w/2,ky,'Keep my hero ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#d8cde2'}).setOrigin(0.5);this.menu.add(kt);
      this._zone(w/2-110,ky-18,220,36,()=>{ const i=this._mintIntroIdx??hi.idx; this._mintIntroIdx=null; this.startStoryStage(i); }); }
  }
  // แผงเลือก Zone Modifiers (สแตกได้ · เปิดเยอะ = ยาก+รางวัลดี) — เปิดจากหน้าเลือกความยาก
  // Painted menu assets own their timers through the image lifetime (rebuild/navigation destroys them).
  menuArtFitButton(start,x,y,w,h){for(const o of this.menu.list.slice(start))if(o.type==='Text'){o.setOrigin(.5).setPosition(x+w/2+10,y+h/2);if(o.displayWidth>w-36)o.setScale(Math.min(o.scaleX,(w-36)/Math.max(1,o.width)));}}
  menuArtPanel(key,cell,x,y,w,h,parent=this.menu){const o=this.tuPanel(key,cell,x,y,w,h);if(o)parent.add(o);return o;}
  menuArtIcon(key,cell,x,y,w,h=w,parent=this.menu){const o=this.tuImg(key,cell,x,y,w,h);if(o)parent.add(o);return o;}
  menuArtInk(c){return JR_INK[String(c||'#ffffff').toLowerCase()]||({'#fff':'#3b2416','#ffffff':'#3b2416','#cfc2d5':'#6b4a33','#c9bdd2':'#6b4a33','#a89cb6':'#78614f','#ffe08a':'#805409','#7fe3a8':'#286d40','#8bffb4':'#286d40','#a8f0c0':'#286d40','#7a7088':'#78614f','#6f6680':'#78614f'})[String(c).toLowerCase()]||'#4c3341';}
  menuArtFx(key,x,y,size,{parent=this.menu,loop=false,tint=null}={}){
    const d=MENU_ORDER_ART[key],o=this.menuArtIcon(key,0,x,y,size,size,parent);if(!o||!d)return null;
    if(tint!=null)o.setTint(tint);if(d[6]==='ADD')o.setBlendMode(Phaser.BlendModes.ADD);
    const motion=this.hubMotionAllowed?this.hubMotionAllowed():!Save.data?.settings?.reducedMotion;let timer;
    const clean=()=>{if(timer)timer.remove(false);timer=null;};o.once('destroy',clean);
    if(!motion){o.setFrame('cell'+(loop?0:Math.floor(d[4]/2)));if(!loop)timer=this.time.delayedCall(500,()=>{if(o.active)o.destroy();});return o;}
    let f=0;timer=this.time.addEvent({delay:loop?180:75,loop,repeat:loop?0:d[4]-1,callback:()=>{
      if(!o.active){clean();return;}f++;if(!loop&&f>=d[4]){o.destroy();return;}o.setFrame('cell'+(f%d[4]));}});return o;
  }
  /* v8.1.123 เจ้าของ: ช่องอุปกรณ์ ไอคอนใหญ่ + กรอบความหายากอ่านยาก → ไม่มีกรอบ ใช้แสงไล่สีตามความหายาก (พื้นไล่สีจากล่าง + แสงนุ่มหลังไอคอน) · Epic+ เต้นเบา ๆ · Legend+ มีประกาย */
  gearRarityFx(item,x,y,w,h,parent=this.menu){ if(!item||!this.add||!parent)return null; const gr=gearGrade(item),rk=typeof gradeRank==='function'?gradeRank(gr):1,hex=(TIER_LABEL[gr]||TIER_LABEL.common||{}).color||'#ffffff',c=Phaser.Display.Color.HexStringToColor(hex).color,out=[];
    const g=this.add.graphics(); g.fillGradientStyle?.(c,c,c,c,0,0,.42,.42); g.fillRect?.(x+3,y+h*.3,w-6,h*.7-3); out.push(g);
    const K='mm_rglow'; if(!this.textures.exists(K)&&typeof document!=='undefined'){ const cv=document.createElement('canvas'); cv.width=cv.height=128; const x2=cv.getContext('2d'),gg=x2.createRadialGradient(64,64,0,64,64,64); gg.addColorStop(0,'rgba(255,255,255,0.85)'); gg.addColorStop(.5,'rgba(255,255,255,0.35)'); gg.addColorStop(1,'rgba(255,255,255,0)'); x2.fillStyle=gg; x2.fillRect(0,0,128,128); this.textures.addCanvas(K,cv); }
    if(this.textures.exists(K)){ const gl=this.add.image(x+w/2,y+h*.54,K).setTint(c).setDisplaySize(w*.95,h*.95).setAlpha(rk>=2?.55:.35); out.push(gl); if(rk>=3&&this.tweens){ this.tweens.add({targets:gl,alpha:{from:.35,to:.75},duration:1100,yoyo:true,repeat:-1,ease:'Sine.inOut'}); gl.once?.('destroy',()=>this.tweens.killTweensOf(gl)); } }
    if(rk>=4&&this.tweens){ for(let i=0;i<2;i++){ const sp=this.add.text(x+w*(i?.78:.22),y+h*(i?.3:.72),'✦',{fontSize:Math.round(Math.max(8,w*.16))+'px',color:hex}).setOrigin(.5).setAlpha(0); out.push(sp); this.tweens.add({targets:sp,alpha:{from:0,to:1},scale:{from:.6,to:1.1},duration:700,yoyo:true,repeat:-1,delay:i*700,ease:'Sine.inOut'}); sp.once?.('destroy',()=>this.tweens.killTweensOf(sp)); } }
    parent.add(out); return out; }
  menuRarityFrame(item,x,y,w,h,key='rar_cell',parent=this.menu){const g=gearGrade(item),i=Math.min(3,Math.max(0,['common','rare','epic','legend'].indexOf(g),gradeRank(g)-1)),o=this.menuArtPanel(key,i,x,y,w,h,parent);if(o&&gradeRank(g)>4){const c=Phaser.Display.Color.HexStringToColor((TIER_LABEL[g]||{}).color||'#ffffff').color;(o.list||[o]).forEach(q=>q?.setTint?.(c));}return o;}
  templeArtFrames(){
    for(const [key,cols,rows] of [['temple_special_cores',5,1],['temple_rank_emblems',3,2]]){
      if(!this.textures.exists(key))continue;const tex=this.textures.get(key),src=tex.getSourceImage();
      for(let i=0;i<cols*rows;i++){const frame='cell'+i;if(tex.has(frame))continue;
        const x=Math.round((i%cols)*src.width/cols),y=Math.round(Math.floor(i/cols)*src.height/rows),right=Math.round((i%cols+1)*src.width/cols),bottom=Math.round((Math.floor(i/cols)+1)*src.height/rows);
        tex.add(frame,0,x,y,right-x,bottom-y);}
    }
  }
  // v7.8.49 art order 21: ชิ้น UI วิหาร · null = ยังไม่มีรูป → ผู้เรียกวาด graphics เดิม
  tuHas(key){ return !!(TEMPLE_UI[key]&&this.textures?.exists?.(key)); }
  tuFrames(key){ const tex=this.textures.get(key); if(tex._tuDone)return tex; tex._tuDone=true; const [cw,ch,cols,ns]=TEMPLE_UI[key],src=tex.getSourceImage(),rows=Math.max(1,Math.round(src.height/ch));
    for(let i=0;i<cols*rows;i++){ const x0=(i%cols)*cw,y0=Math.floor(i/cols)*ch; if(!tex.has('cell'+i))tex.add('cell'+i,0,x0,y0,cw,ch); if(!ns)continue;
      const [l,t,r,b]=ns,xs=[0,l,cw-r,cw],ys=[0,t,ch-b,ch];
      for(let j=0;j<9;j++){ const cx=j%3,cy=Math.floor(j/3),fw=xs[cx+1]-xs[cx],fh=ys[cy+1]-ys[cy]; if(fw>0&&fh>0)tex.add('c'+i+'_'+j,0,x0+xs[cx],y0+ys[cy],fw,fh); } }
    return tex; }
  // ภาพทั้งช่อง (ไม่ยืดแบบ 9 ส่วน) · h ไม่ใส่ = ตามสัดส่วนช่อง
  tuImg(key,cell,x,y,w,h){ if(!this.tuHas(key))return null; this.tuFrames(key); const [cw,ch]=TEMPLE_UI[key]; return this.add.image(x,y,key,'cell'+cell).setDisplaySize(w,h??w*ch/cw); }
  // กรอบ 9 ส่วน มุมบนซ้ายที่ (x,y) · มุมย่อตามความสูง (k=h/cellH) ไม่ยืด · คืน container
  tuPanel(key,cell,x,y,w,h){ if(!this.tuHas(key))return null; const [cw,ch,,ns]=TEMPLE_UI[key]; this.tuFrames(key);
    const c=this.add.container(x,y); if(!ns){ c.add(this.add.image(0,0,key,'cell'+cell).setOrigin(0).setDisplaySize(w,h)); return c; }
    const [l,t,r,b]=ns; let k=h/ch; if((l+r)*k>w)k=w/(l+r);
    const xs=[0,l*k,w-r*k,w],ys=[0,t*k,h-b*k,h];
    for(let j=0;j<9;j++){ const cx=j%3,cy=Math.floor(j/3),f='c'+cell+'_'+j,dw=xs[cx+1]-xs[cx],dh=ys[cy+1]-ys[cy]; if(dw<=0.01||dh<=0.01||!this.textures.get(key).has(f))continue;
      c.add(this.add.image(xs[cx],ys[cy],key,f).setOrigin(0).setDisplaySize(dw+(cx<2?.5:0),dh+(cy<2?.5:0))); }   // +.5 กันรอยต่อ
    c._tuK=k; return c; }
  // ประกายดาวตอนกดสำเร็จ (ชีต 6 เฟรม · ADD) · อยู่นอก menu เพราะ rebuild ทันที
  tuSparkle(x,y,s=56){ if(!this.tuHas('temple_sparkle_sheet'))return; this.tuFrames('temple_sparkle_sheet');
    for(let n=0;n<3;n++){ const img=this.add.image(x+(n-1)*s*.45,y-(n%2)*s*.3,'temple_sparkle_sheet','cell0').setDisplaySize(s,s).setDepth(99990).setBlendMode(Phaser.BlendModes.ADD);
      let f=0; const ev=this.time.addEvent({delay:55,repeat:5,callback:()=>{ f++; if(f>5||!img.active){ ev.remove(); img.destroy(); return; } img.setFrame('cell'+f); }}); } }
  // v7.8.49 แท็บวิหาร (art order 21 A6) · cell 0 ม่วง / 1 ทอง / 2 มินต์ / 3 ทองเรือง · null = ไม่มีรูป
  tuTab(x,y,w,h,cell,label,iconKey,color){ const p=this.tuPanel('temple_tab_sheet',cell,x,y,w,h); if(!p)return null; const k=p._tuK||h/65,cx=x+33*k;
    const t=this.add.text((cx+20*k+x+w-10)/2,y+h/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color,stroke:'#2a1020',strokeThickness:3}).setOrigin(0.5);
    const out=[p,t]; if(iconKey&&this.textures.exists(iconKey))out.push(this.add.image(cx,y+h/2,iconKey).setDisplaySize(h*.66,h*.66)); return out; }
  buildUpgrade(){
    this._templeSpecial=false;   // v8.0.22 Special Cores → Rank Rewards
    if(this.W<=this.H&&this.buildWeavePW?.())return;   // v8.0.77 เจ้าของ: หน้า Weave ธีมเดียวกับหน้า Power (แนวนอนใช้แบบเดิม)
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Flavor Weave Temple',ASSET_IMAGES.screen_temple_weave?'screen_temple_weave':'ui_talent_hall');   // v7.8.49 A1 (โหลดตอนเปิดหน้าใน _screenBg)
    const w=this.W,h=this.H, rank=Save.data.rank||0, allMax=Save.talAllMax();
    this.templeArtFrames();
    const portrait=w<=h,ry=portrait?82:55;
    const rk=this.add.text(w/2,ry,'Current weave rank   ·   🧶 '+Save.threads()+' Weave Thread',{fontFamily:'NunitoUI, sans-serif',fontSize:'10px',color:'#efe4f7',stroke:'#1d0f16',strokeThickness:3}).setOrigin(0.5);
    const rn=this.add.text(w/2,ry+17,rankName(rank),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffd166'}).setOrigin(0.5);
    { const rbw=Math.min(w-80,Math.max(200,rn.width+90)),rb=this.tuPanel('temple_rank_ribbon',0,w/2-rbw/2,ry+17-12,rbw,24); if(rb)this.menu.add(rb); }   // A5
    this.menu.add([rk,rn]);
    if(this.textures.exists('temple_rank_emblems')){const badge=this.add.image(32,ry+13,'temple_rank_emblems','cell'+Math.min(5,rank)).setDisplaySize(42,42);this.menu.add(badge);rn.setFontSize(w<360?'14px':'17px');}
    // ปุ่มเข้าหน้า Rank Perks (โชว์ RP ที่ยังใช้ได้)
    const rpFree=Save.rankUnpicked(), rkW=portrait?Math.min(150,(w-40)/2):124,rkH=30,rkX=portrait?w/2-rkW-3:w-14-rkW,rkY=portrait?ry+32:44;   // v8.0.22 แท็บเหลือ 2 (Rank Rewards · Depths)
    // v5.27 ⛏️ ปุ่มลงห้องลับใต้วิหาร (ข้างปุ่ม Perks)
    if(featureOpen('dig')){ const ex=Save.exp(),dx=portrait?w/2+3:rkX-rkW-8,glow=Save.expReady(),art=this.tuTab(dx,rkY,rkW,rkH,glow?3:1,'Expedition · '+ex.best,'tile_dig','#fff1d6');
      if(art)this.menu.add(art); else { const g2=this.add.graphics(); g2.fillStyle(glow?0x3a2a1a:0x2c2338,1); g2.fillRoundedRect(dx,rkY,rkW,rkH,9); g2.lineStyle(1.5,glow?0xe0a060:0x4a4059,1); g2.strokeRoundedRect(dx,rkY,rkW,rkH,9);
      const t2=this.add.text(dx+rkW/2,rkY+rkH/2,'⚔️ Expedition · '+ex.best,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:glow?'#ffd9a8':'#cbbfda'}).setOrigin(0.5);
      this.menu.add([g2,t2]); this._smallBtnIcon(t2,'tile_dig'); }
      this._zone(dx,rkY,rkW,rkH,()=>{ this.menuScreen='dig'; this.buildMenuScreen(); });
      if(Save.expReady()&&this.drawBadgeDot)this.drawBadgeDot(this.menu,dx+rkW-6,rkY+6); }
    // v5.37 🍳 ปุ่มเข้าครัวสูตร (Flavor Recipes)
    // v8.0.22 แท็บ Special Cores ถูกรวมเข้า Rank Rewards
    { const art=this.tuTab(rkX,rkY,rkW,rkH,rpFree>0?3:0,rpFree>0?('Rank Rewards · '+rpFree+' new'):'Rank Rewards','tile_perks',rpFree>0?'#fff4c8':'#f1e4ff');
      if(art)this.menu.add(art); else { const rkg=this.add.graphics(); rkg.fillStyle(rpFree>0?0x4a3a1a:0x2c2338,1); rkg.fillRoundedRect(rkX,rkY,rkW,rkH,9); rkg.lineStyle(1.5,rpFree>0?0xffd166:0x4a4059,1); rkg.strokeRoundedRect(rkX,rkY,rkW,rkH,9);
      const rkt=this.add.text(rkX+rkW/2,rkY+rkH/2,rpFree>0?('🏅 Rewards · '+rpFree+' new'):'🏅 Rank Rewards',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:rpFree>0?'#ffe08a':'#cbbfda'}).setOrigin(0.5);
      this.menu.add([rkg,rkt]); this._smallBtnIcon(rkt,'tile_perks'); }
      this._zone(rkX,rkY,rkW,rkH,()=>{ this.menuScreen='perks'; this.buildMenuScreen(); });
      if(rpFree>0)this.drawBadgeDot(this.menu,rkX+rkW-6,rkY+6); }
    // v7.8.49 A2/A3 แท่นแกน 3 ลูก (แนวตั้งที่มีที่ว่างเท่านั้น) · ออร่าแต่ละลูกสว่างตามเลเวลแกน
    const gapY=10,artCard=portrait&&this.tuHas('temple_core_card_sheet'),btnH=artCard?48:40;
    let altH=portrait&&this.tuHas('temple_altar_trio')?Math.min(190,h-26-(150+8+36+3*(106+gapY)+8+btnH)):0; if(altH<70)altH=0;   // v7.8.50 พอดีจอไม่ต้องเลื่อน
    if(altH){ const altW=Math.min(w-30,altH/.6),ah=altW*.6,ax=w/2,ay=150+ah/2,alt=this.tuImg('temple_altar_trio',0,ax,ay,altW,ah); altH=ah;
      [['hp',0,.26,.58,.36],['dmg',1,.5,.27,.4],['def',2,.74,.58,.36]].forEach(([k,cell,fx,fy,fs])=>{ const lv=Save.talLvl(k); if(!lv)return;
        const gl=this.tuImg('temple_altar_glow_sheet',cell,ax-altW/2+altW*fx,ay-ah/2+ah*fy,altW*fs); if(!gl)return; const a=Math.min(.9,.45+.15*lv); gl.setAlpha(a).setScale(gl.scaleX*1.12); this.menu.add(gl);
        this.tweens.add({targets:gl,alpha:{from:a,to:a*.55},yoyo:true,repeat:-1,duration:900+cell*170}); }); this.menu.add(alt); }   // ออร่าอยู่หลังแท่น (ADD ทับทำให้ภาพจืด)
    const barW=Math.min(w-(portrait?64:180),420), bx=w/2-barW/2, by=portrait?(altH?150+altH+8:158):86, barH=9, need=UPG_ORDER.length*TAL_MAX;
    const frac=Phaser.Math.Clamp(Save.talFilled()/need,0,1);
    { const tr=this.tuPanel('temple_power_bar',0,bx-14,by-4,barW+28,barH+8); if(tr){ this.menu.add(tr); const fw=Math.max(barH+4,(barW-4)*frac); if(frac>0){const fl=this.tuPanel('temple_power_fill',allMax?1:0,bx+2,by+1,fw,barH-2); if(fl)this.menu.add(fl);} }   // A7/A8
      else { const bg=this.add.graphics(); bg.fillStyle(0x2c2338,1); bg.fillRoundedRect(bx,by,barW,barH,6);
        bg.fillStyle(allMax?0x8bd3a0:0xffc24a,1); if(frac>0)bg.fillRoundedRect(bx,by,Math.max(barH,barW*frac),barH,6);
        this.menu.add(bg); } }
    const prog=this.add.text(w/2,by+19,'Woven core power '+Save.talFilled()+' / '+need+(allMax?' · ready to weave':''),
      {fontFamily:'NunitoUI, sans-serif',fontSize:'10px',color:allMax?'#8bd3a0':(artCard?'#e8dcf2':'#8f849f')}).setOrigin(0.5);
    this.menu.add(prog);
    if(this._tutorialWeaveCoach){ prog.setText('🍓 Tap a core below to spend your Sugar!').setColor('#ffe08a'); this.tweens.add({targets:prog,alpha:{from:0.55,to:1},yoyo:true,repeat:-1,duration:640}); }
    /* v6.78 C2: Special cores moved to Rank Perks screen */
    const marginX=16,gapX=portrait?0:10,cardW=portrait?w-marginX*2:(w-marginX*2-gapX*2)/3,top=portrait?(altH?by+36:230):144,cardH=portrait?Math.min(106,(h-top-btnH-24-gapY*2)/3):Math.min(132,h-202);
    UPG_ORDER.forEach((k,i)=>{ const u=UPGRADES[k], lvl=Save.talLvl(k), tot=Save.talTotal(k), maxed=lvl>=TAL_MAX;
      const cost=maxed?0:Save.talCost(k), afford=Save.talCanBuy(k);
      const x=portrait?marginX:marginX+i*(cardW+gapX), y=portrait?top+i*(cardH+gapY):top;
      // A9/A10 การ์ดแกน (แนวตั้ง) · เหรียญซ้าย / ข้อความกลาง / เส้นคั่น + ปุ่มขวา
      const card=artCard?(maxed&&this.tuHas('temple_core_card_max')?this.tuPanel('temple_core_card_max',0,x,y,cardW,cardH):this.tuPanel('temple_core_card_sheet',i,x,y,cardW,cardH)):null;
      const ck=card?card._tuK:0,mxArt=card&&maxed&&this.tuHas('temple_core_card_max'),icx=card?x+(mxArt?130:111)*ck:x+32,icy=card?y+cardH*(mxArt?.5:.47):y+32,isz=card?Math.min(64,(mxArt?118:112)*ck):48,tx=card?x+(mxArt?250:205)*ck+6:x+75,rightW=card?(mxArt?213:263)*ck:0;   /* v7.8.70 เจ้าของ: การ์ด Max มีวงเหรียญใหญ่/ตำแหน่งต่างจากการ์ดปกติ → ไอคอน/ข้อความ/ปุ่มใช้ตำแหน่งของภาพ Max (เดิมเยื้องดูเอียง) */
      let g=card; if(!card){ g=this.add.graphics(); g.fillStyle(0x2c2338,1); g.fillRoundedRect(x,y,cardW,cardH,16);
        g.lineStyle(2.5,maxed?0x8bd3a0:u.color,0.9); g.strokeRoundedRect(x,y,cardW,cardH,16);
        g.fillStyle(u.color,0.14); g.fillRoundedRect(x,y,64,cardH,16); }
      const em=this.textures.exists(u.iconKey)?this.add.image(icx,icy,u.iconKey).setDisplaySize(isz,isz):this.add.text(icx,icy,u.emoji,{fontSize:'29px'}).setOrigin(0.5);
      let stars=''; for(let s=0;s<TAL_MAX;s++) stars+=(s<lvl?'★':'☆');
      const starArt=this.tuHas('temple_star_sheet'),ss=card?Math.max(11,Math.min(15,cardH*.13)):12,sy=card?y+cardH-ss*.8:y+61;
      const st=this.add.text(icx+(starArt?ss*1.5+4:0),sy,starArt?'':stars,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'9px',color:maxed?'#8bd3a0':'#ffd166'}).setOrigin(starArt?0:0.5,0.5);
      const starImgs=[]; if(starArt)for(let s=0;s<TAL_MAX;s++)starImgs.push(this.tuImg('temple_star_sheet',s<lvl?0:1,icx+(s-1)*ss*1.05,sy,ss,ss));   // A11
      const tag=this.add.text(tx,y+13,u.tag+' · Lv '+lvl+'/'+TAL_MAX,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:card?'#'+u.color.toString(16).padStart(6,'0'):'#cbbfda'}).setOrigin(0,0);
      const nm=this.add.text(tx,y+29,u.name,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0,0);
      const gain=this.add.text(tx,y+49,'Total: '+u.show(tot),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10.5px',color:'#8bd3a0'}).setOrigin(0,0);
      if(card){ const room=x+cardW-rightW-tx-6; for(const [o,mn] of [[nm,11],[gain,8],[tag,8]]){ let fz=parseFloat(o.style.fontSize); while(o.width>room&&fz>mn){fz-=.5;o.setFontSize(fz+'px');} } }
      const buyArt=this.tuHas('temple_buy_btn_sheet'),pw=card?Math.min(118,rightW-18):Math.min(100,cardW-82),ph=card?31:29,ppx=card?x+cardW-rightW/2-pw/2+4:x+cardW-pw-10,ppy=y+cardH-ph-(card?Math.max(10,cardH*.14):10);
      const bp=buyArt?this.tuPanel('temple_buy_btn_sheet',maxed?2:(afford?0:1),ppx,ppy,pw,ph):null,bk=bp?bp._tuK:0;   // A12
      let pg=bp; if(!bp){ pg=this.add.graphics(); pg.fillStyle(maxed?0x3a3550:(afford?0x2f4a38:0x4a2f38),1); pg.fillRoundedRect(ppx,ppy,pw,ph,10); }
      const tcx=bp?(ppx+66*bk+ppx+pw-8)/2:ppx+pw/2;
      const pt=this.add.text(tcx,ppy+ph/2,maxed?'Full ✓':((bp?'':'🍬')+cost),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:bp?'13px':'11px',color:bp?'#ffffff':(maxed?'#8bd3a0':(afford?'#a8f0c0':'#f0a0b0')),stroke:bp?'#1d0f16':undefined,strokeThickness:bp?3:0}).setOrigin(0.5);
      const coin=bp&&!maxed&&this.textures.exists('ic_sugar')?this.add.image(ppx+40*bk,ppy+ph/2,'ic_sugar').setDisplaySize(32*bk,32*bk):null;
      const nx=maxed?null:this.add.text(bp?ppx+pw/2:ppx+pw/2,ppy-3,'Upgrade: '+u.show(1),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffe08a'}).setOrigin(0.5,1);
      this.menu.add([g,em,st,...starImgs.filter(Boolean),tag,nm,gain,pg,pt]); if(coin)this.menu.add(coin); if(nx)this.menu.add(nx);
      if(this._tutorialWeaveCoach&&!maxed&&afford&&!this._coachSpot)this._coachSpot={x:ppx,y:ppy,w:pw,h:ph};
      if(!maxed) this._zone(ppx,ppy,pw,ph,()=>{ if(Save.buyTal(k)){ Sfx.progress('core'); if(this.tuSparkle)this.tuSparkle(ppx+pw/2,ppy+ph/2); if(this._tutorialWeaveCoach){ if(this._weaveTour){ this._weaveTour='back'; this.menuToast('✨ Core upgraded! Your hero is stronger in every stage','#8dffb0'); } else { this._stage1Coach=true; this.menuToast('✨ Core upgraded! Now try Stage 1','#8dffb0'); this.time.delayedCall(900,()=>{ if(this.state==='menu'&&this._stage1Coach){ this.selectedChapter=0; this.menuScreen='stage'; this.buildMenuScreen(); } }); } } this._tutorialWeaveCoach=false; } else { Sfx.select(); this.menuToast('Need 🍬 '+cost+' Sugar','#ff9bb5'); } this.buildMenuScreen(); });
    });
    if(this._coachSpot){ const sp=this._coachSpot; this._coachSpot=null; this._spotZone=sp; }
    const py=portrait?Math.min(h-btnH-18,top+UPG_ORDER.length*(cardH+gapY)+(artCard?8:4)):h-48,bw=Math.min(w-40,330),pbx=w/2,ph=artCard?btnH:40;
    if(artCard){ const kn=this.tuImg('temple_ribbon_knot',0,pbx,py-3,Math.min(96,bw*.3)); if(kn)this.menu.add(kn); }   // A14
    const wb=this.tuPanel('temple_weave_btn_sheet',allMax?1:0,pbx-bw/2,py,bw,ph),wk=wb?wb._tuK:0;   // A13
    let pg=wb; if(!wb){ pg=this.add.graphics(); pg.fillStyle(allMax?0xffb020:0x3a3550,1); pg.fillRoundedRect(pbx-bw/2,py,bw,ph,14);
      pg.lineStyle(2,allMax?0xffe08a:0x4a4059,allMax?1:0.6); pg.strokeRoundedRect(pbx-bw/2,py,bw,ph,14); }
    const lx=wb?pbx+40*wk:pbx;
    const pl=this.add.text(lx,py+ph/2-(wb?7:6),(wb?'':'⭐ ')+(allMax?('Weave up → '+rankName(rank+1)):(wb?'Weave Up':'Weave up · max the cores first')),
      {fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:wb?'15px':'13px',color:allMax?'#fff':(wb?'#efe6f5':'#7a7088'),stroke:wb?(allMax?'#7a3b00':'#2a2236'):undefined,strokeThickness:wb?3:0}).setOrigin(0.5);
    const psub=this.add.text(lx,py+ph/2+(wb?10:9),allMax?('Spend 🧶'+Save.promoteThreadCost()+' · get 🍬'+promoteReward(rank)):(wb?'Max all 3 cores to unlock':'Max all 3: CORE / FLAVOR / BOND'),
      {fontFamily:'NunitoUI, sans-serif',fontSize:'9px',color:allMax?'#ffe9c2':(wb?'#d8cde3':'#8f849f')}).setOrigin(0.5);
    this.menu.add([pg,pl,psub]);
    if(allMax) this._zone(pbx-bw/2,py,bw,ph,()=>{ const cost=Save.promoteThreadCost(),rew=Save.promote(); if(rew){ Sfx.progress('promotion'); if(this.tuSparkle)this.tuSparkle(pbx,py+ph/2,72);
      if(this.showBanner)this.showBanner('⭐ The weave grows stronger! '+rankName(Save.data.rank),'Memory and flavor become one · get 🍬 '+rew,2400); }else this.menuToast('Need 🧶 '+cost+' Weave Thread','#ff9bb5');this.buildMenuScreen(); });
    if(this._spotZone){ const sp=this._spotZone; this._spotZone=null; this.tapZones=this.tapZones.filter(z=>z.x===sp.x&&z.y===sp.y); this._weaveSpotAt=Date.now(); const c=this.add.container(0,0); this.menu.add(c); this.drawSpotlight(c,sp.x,sp.y,sp.w,sp.h,this._weaveTour?'Step 3/5 · Tap a core to spend your Sugar':'Tap to upgrade this core!'); }
    this.menu.setVisible(true);
  }
  // v8.0.77 Weave ธีม Power: การ์ดสรุป · YOUR CORES 3 แถว · RANK UP · ทางไป Rank Rewards / Depths · ระบบ/ราคา/บทสอนเดิม
  buildWeavePW(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Flavor Weave','screen_gear_power_789');
    const w=this.W,h=this.H,d=Save.data,rank=d.rank||0,allMax=Save.talAllMax(),bw=Math.min(w-28,480),x=(w-bw)/2,F='NunitoUI, sans-serif',gap=8;
    const T=(tx,ty,str,sz,col,bold,ox=0,oy=.5)=>{ const t=this.add.text(tx,ty,str,{fontFamily:F,fontStyle:bold?'bold':'normal',fontSize:sz+'px',color:col}).setOrigin(ox,oy); this.menu.add(t); return t; };
    const icon=(k,ix,iy,sz,fb)=>this.pwIcon(k,ix,iy,sz)||T(ix,iy,fb,Math.round(sz*.6),'#fff',false,.5);
    const pill=(px,py,pw,ph,label,on,fn,ic)=>{ const g=this.add.graphics(); g.fillStyle(on?0x2f6b55:0x2c2338,1).fillRoundedRect(px,py,pw,ph,ph/2).lineStyle(1.5,on?0x85d5b2:0x6d536d,.9).strokeRoundedRect(px,py,pw,ph,ph/2); this.menu.add(g);
      const hasIc=ic&&this.textures.exists(ic),t=T(px+pw/2+(hasIc?9:0),py+ph/2,label,13,on?'#ffffff':'#cfc1d4',true,.5); if(hasIc)this.menu.add(this.add.image(t.x-t.width/2-11,py+ph/2,ic).setDisplaySize(18,18)); if(t.width>pw-(hasIc?34:14))t.setScale((pw-(hasIc?34:14))/t.width); if(fn)this._zone(px,py,pw,ph,fn); return t; };
    let y=82+(this._hdrShift?.()||0);
    // สรุป: ตรา · ชื่ออันดับ · แถบพลังแก่น · Thread
    const need=UPG_ORDER.length*TAL_MAX,filled=Save.talFilled(),frac=Phaser.Math.Clamp(filled/need,0,1),sh=104; this.pwCard(x,y,bw,sh,false); this.pwArt?.('pw_hero_weave',x+bw-sh*.95,y+sh*.55,sh*1.8,sh*.9)?.setAlpha(.3);   /* ใบ 58 */
    icon('weave_crest',x+36,y+40,56,'⭐'); T(x+72,y+22,'Weave rank',11,'#cfc1d4',true); { const rnT=T(x+72,y+44,rankName(rank),20,'#fff1e7',true),rr=bw-72-112; if(rnT.width>rr)rnT.setScale(rr/rnT.width); }
    { const thr=Save.threads(),tt=T(x+bw-14,y+22,String(thr),15,'#fff1e7',true,1); icon('thread_knot',tt.x-tt.width-14,y+22,26,'🧶'); T(x+bw-14,y+44,'Weave Thread',11,'#cfc1d4',false,1); }
    { const g=this.add.graphics(),bx=x+16,bwid=bw-32,byy=y+68; g.fillStyle(0x17121d,1).fillRoundedRect(bx,byy,bwid,8,4); if(frac>0)g.fillStyle(0x85d5b2,1).fillRoundedRect(bx,byy,Math.max(8,bwid*frac),8,4); this.menu.add(g); }
    T(x+16,y+90,'Woven core power '+filled+' / '+need,11,'#cfc1d4',false); if(allMax)T(x+bw-16,y+90,'Ready to weave up',11,'#85d5b2',true,1);
    y+=sh+28; const tip=this.pwSection('YOUR CORES',x+2,y-12); if(this._tutorialWeaveCoach){ tip.setText('YOUR CORES · tap a price to spend Sugar').setColor('#ffe08a'); }
    // แถวแก่น 3 แถว · แถวที่คุ้มสุด (ซื้อได้ก่อน) = ขอบทอง
    const best=UPG_ORDER.findIndex(k=>Save.talLvl(k)<TAL_MAX&&Save.talCanBuy(k)),rh=78,cores=['core_life','core_flavor','core_bond'];
    UPG_ORDER.forEach((k,i)=>{ const u=UPGRADES[k],lvl=Save.talLvl(k),maxed=lvl>=TAL_MAX,cost=maxed?0:Save.talCost(k),afford=Save.talCanBuy(k),ry=y+i*(rh+gap);
      this.pwCard(x,ry,bw,rh,i===best); icon(cores[i],x+34,ry+rh/2,50,u.emoji);
      const pw=Math.min(104,bw*.3),ph=34,ppx=x+bw-pw-12,ppy=ry+rh-ph-10,room=ppx-(x+68)-8;
      const nm=T(x+68,ry+18,u.name,15,'#fff1e7',true);
      const sub=T(x+68,ry+39,'Lv '+lvl+'/'+TAL_MAX,11,maxed?'#85d5b2':'#ffd98a',true); { let sx=sub.x+sub.width+8; for(let s2=0;s2<TAL_MAX;s2++){ const st=T(sx,ry+39,'★',12,s2<lvl?'#ffd166':'#4f4360',true); sx+=st.width+1; } }   /* ดาวที่ยังไม่ได้ = สีเข้ม */ const tot=T(x+68,ry+58,'Total: '+u.show(Save.talTotal(k)),11,'#cfc1d4',false);
      for(const o of [nm,sub,tot])if(o.width>room)o.setScale(room/o.width);
      if(!maxed)T(x+bw-14,ry+18,'+'+u.show(1).replace(/^\+/,''),14,'#85d5b2',true,1);
      const buy=()=>{ if(Save.buyTal(k)){ Sfx.progress('core'); if(this.tuSparkle)this.tuSparkle(ppx+pw/2,ppy+ph/2); if(this._tutorialWeaveCoach){ if(this._weaveTour){ this._weaveTour='back'; this.menuToast('✨ Core upgraded! Your hero is stronger in every stage','#8dffb0'); } else { this._stage1Coach=true; this.menuToast('✨ Core upgraded! Now try Stage 1','#8dffb0'); this.time.delayedCall(900,()=>{ if(this.state==='menu'&&this._stage1Coach){ this.selectedChapter=0; this.menuScreen='stage'; this.buildMenuScreen(); } }); } } this._tutorialWeaveCoach=false; } else { Sfx.select(); this.menuToast('Need 🍬 '+cost+' Sugar','#ff9bb5'); } this.buildMenuScreen(); };
      pill(ppx,ppy,pw,ph,maxed?'Full ✓':String(cost),afford&&!maxed,maxed?null:buy,maxed?null:(this.textures.exists('hr_ic_candy')?'hr_ic_candy':'ic_sugar'));
      if(this._tutorialWeaveCoach&&!maxed&&afford&&!this._coachSpot)this._coachSpot={x:ppx,y:ppy,w:pw,h:ph}; });
    y+=3*(rh+gap)-gap+28; this.pwSection('RANK UP',x+2,y-12);
    { const rh2=70; this.pwCard(x,y,bw,rh2,allMax); icon('weave_up',x+34,y+rh2/2,48,'⭐');
      T(x+68,y+22,allMax?('Weave up → '+rankName(rank+1)):'Weave Up',15,'#fff1e7',true); const sub=T(x+68,y+46,allMax?('Spend 🧶'+Save.promoteThreadCost()+' · get 🍬'+promoteReward(rank)):'Max all 3 cores to unlock',11,allMax?'#85d5b2':'#cfc1d4',false);
      const room=bw-68-(allMax?118:20); if(sub.width>room)sub.setScale(room/sub.width);
      if(allMax)pill(x+bw-110,y+rh2/2-17,98,34,'Weave',true,()=>{ const cost=Save.promoteThreadCost(),rew=Save.promote(); if(rew){ Sfx.progress('promotion'); if(this.tuSparkle)this.tuSparkle(x+bw-61,y+rh2/2,72); if(this.showBanner)this.showBanner('⭐ The weave grows stronger! '+rankName(Save.data.rank),'Memory and flavor become one · get 🍬 '+rew,2400); }else this.menuToast('Need 🧶 '+cost+' Weave Thread','#ff9bb5'); this.buildMenuScreen(); });
      y+=rh2+28; }
    this.pwSection('MORE',x+2,y-12);
    { const tw=(bw-gap)/2,th=60,rpFree=Save.rankUnpicked(),dg=Save.dig(),tiles=[['perks','Rank Rewards',rpFree>0?rpFree+' new':'Rank perks','tile_perks','🏅',rpFree>0],featureOpen('dig')?['dig','Expedition','Best stage '+Save.exp().best,'tile_dig','⚔️',Save.expReady()]:['dig','Expedition','🔒 After Chapter 1','tile_dig','⚔️',false]];
      tiles.forEach(([to,name,sub,ik,em,dot],i)=>{ const tx=x+i*(tw+gap); this.pwCard(tx,y,tw,th,false); if(this.textures.exists(ik))this.menu.add(this.add.image(tx+28,y+th/2,ik).setDisplaySize(38,38)); else T(tx+28,y+th/2,em,22,'#fff',false,.5);
        const nt=T(tx+54,y+22,name,13,'#fff1e7',true),st=T(tx+54,y+41,sub,11,'#cfc1d4',false); for(const o of [nt,st])if(o.width>tw-74)o.setScale((tw-74)/o.width); T(tx+tw-12,y+th/2,'›',18,'#cfc1d4',true,1);
        if(dot&&this.drawBadgeDot)this.drawBadgeDot(this.menu,tx+tw-8,y+8); this._zone(tx,y,tw,th,()=>{ if(to==='dig'&&!featureOpen('dig')){ Sfx.error?.(); this.menuToast?.('🔒 Expedition opens after you clear Chapter 1','#ffd166'); return; } this.menuScreen=to; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag='weave_'+to; }); }
    if(this._coachSpot){ const sp=this._coachSpot; this._coachSpot=null; this.tapZones=this.tapZones.filter(z=>z.x===sp.x&&z.y===sp.y); this._weaveSpotAt=Date.now(); const c=this.add.container(0,0); this.menu.add(c); this.drawSpotlight(c,sp.x,sp.y,sp.w,sp.h,this._weaveTour?'Step 3/5 · Tap a core to spend your Sugar':'Tap to upgrade this core!'); }
    this.menu.setVisible(true); return true; }
  // v8.0.22 buildSpecialCores ถูกรวมเข้า Rank Rewards (buildRankPerks)
  // ⛏️ v5.27 Temple Depths — หน้าขุด
  // ===== v5.37 🍳 Recipe Kitchen: ประกอบ perk เอง · แตะช่องสูตร → แตะชิ้นส่วนในถุง =====
  /* v8.2.37 แบบย่อ (FR_SIMPLE): การ์ดสูตรสำเร็จ · แตะ = ใช้ · แตะใบที่ใช้อยู่ = ถอด · ฟรี */
  buildKitchenSimple(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('🍳 Flavor Kitchen','ui_talent_hall','gActivity');
    const w=this.W,h=this.H,hs=this._hdrShift(),cur=frPick(),cw=w-28,top=100+hs,n=FR_PRESETS.length,rowH=Math.max(62,Math.min(86,(h-top-70)/n-8));
    this.menu.add(this.add.text(w/2,70+hs,'Pick one signature move. It fires in every run.\nFree to swap any time.',{fontFamily:'sans-serif',fontSize:'11px',color:'#b7abc9',align:'center'}).setOrigin(0.5));
    FR_PRESETS.forEach((p,i)=>{ const y=top+i*(rowH+8),on=i===cur,t=frPart(p.t)||{},e=frPart(p.e)||{},g=this.add.graphics();
      g.fillStyle(on?0x3a2c48:0x2c2338,1); g.fillRoundedRect(14,y,cw,rowH,14); g.lineStyle(on?3:1.5,on?0xffd166:0x4a4059,1); g.strokeRoundedRect(14,y,cw,rowH,14); this.menu.add(g);
      const iz=Math.min(34,rowH-28),iy=y+rowH/2; [[p.t,t.emoji,26],[p.e,e.emoji,26+iz+4]].forEach(([k,fb,x])=>{ const ik=frIconKey(k); this.menu.add(ik&&this.textures.exists(ik)?this.add.image(x+iz/2,iy,ik).setDisplaySize(iz,iz):this.add.text(x+iz/2,iy,fb||'?',{fontSize:Math.round(iz*.75)+'px'}).setOrigin(0.5)); });
      const tx=26+iz*2+14,tw=cw-(tx-14)-74;
      this.menu.add(this.add.text(tx,y+10,p.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:on?'#ffe08a':'#ffffff'}));
      this.menu.add(this.add.text(tx,y+30,p.desc,{fontFamily:'sans-serif',fontSize:'11px',color:'#e6dcf2',wordWrap:{width:tw}}));
      this.menu.add(this.add.text(tx,y+rowH-16,(t.emoji||'')+' '+(t.name||'')+'  ▸  '+(e.emoji||'')+' '+(e.name||''),{fontFamily:'sans-serif',fontSize:'9px',color:'#9d90b0'}));
      this.menu.add(this.add.text(14+cw-12,iy,on?'✓ In use':'Use',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:on?'#9ff0c8':'#ffd9a8'}).setOrigin(1,0.5));
      this._zone(14,y,cw,rowH,()=>{ Save.data.frPick=on?-1:i; Save.save(); if(on){ Sfx.select(); this.menuToast?.('Signature move removed','#d8cce6'); } else { Sfx.card?Sfx.card():Sfx.select(); this.menuToast?.('🍳 '+p.name+' is ready for your next run!','#9ff0c8'); } this.buildMenuScreen(); }); });
    if(Object.keys(Save.data.fparts||{}).length)this.menu.add(this.add.text(w/2,h-22,'Custom recipes are resting for now — your parts are kept safe.',{fontFamily:'sans-serif',fontSize:'9px',color:'#8d8195'}).setOrigin(0.5));
  }
  buildKitchen(){ if(FR_SIMPLE)return this.buildKitchenSimple();
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('🍳 Flavor Kitchen','ui_talent_hall','gActivity');
    const w=this.W,h=this.H,hs=this._hdrShift(),slots=Save.frSlots(),R=Save.frRecipes();
    if(this._kSel==null)this._kSel={slot:0,k:'t'};
    const sel=this._kSel; if(sel.slot>=slots)sel.slot=0;
    const sub=this.add.text(w/2,62+hs,'Each recipe costs −6% Max HP & −4% AP (+2% per ★ / signature)'+(frActive().length?' · now −'+Math.round(frUpkeep().hp*100)+'% HP':''),{fontFamily:'sans-serif',fontSize:'10px',color:'#b7abc9'}).setOrigin(0.5); this.menu.add(sub);
    const cw=w-28,rowH=portraitRow(h),top=78+hs; function portraitRow(H){ return Math.max(44,Math.min(58,(H-420)/5)); }
    const lbl={t:'WHEN',e:'DO',m:'TWIST'},col={t:0xffb36b,e:0x7fd0ff,m:0xc7a6ff};
    for(let i=0;i<FR_SLOT_MAX;i++){ const y=top+i*(rowH+6),locked=i>=slots,r=R[i],on=!locked&&sel.slot===i;
      const g=this.add.graphics(); g.fillStyle(locked?0x221c2a:0x2c2338,1); g.fillRoundedRect(14,y,cw,rowH,12); g.lineStyle(on?2.5:1.5,on?0xffd166:0x4a4059,1); g.strokeRoundedRect(14,y,cw,rowH,12); this.menu.add(g);
      if(locked){ const nx=i===slots,rc=Save.frSlotCost(),can=nx&&Save.rankPointsFree()>=rc; this.menu.add(this.add.text(w/2,y+rowH/2,nx?'🔒 Unlock slot '+(i+1)+' · 🏅 '+rc+' RP (you have '+Save.rankPointsFree()+')':'🔒 Recipe slot '+(i+1),{fontFamily:'sans-serif',fontStyle:nx?'bold':'normal',fontSize:'11px',color:can?'#ffe08a':'#6f6580'}).setOrigin(0.5));
        if(nx)this._zone(14,y,cw,rowH,()=>{ if(Save.frUnlockSlot()){ Sfx.digRare(); this.menuToast('🍳 Recipe slot '+(i+1)+' unlocked!','#9ff0c8'); } else { Sfx.select(); this.menuToast('Need 🏅 '+rc+' Rank Points — raise your Weave rank','#ff9bb5'); } this.buildMenuScreen(); });
        continue; }
      const cost=frCost(r),full=r.t&&r.e; const pw=(cw-70)/3;
      ['t','e','m'].forEach((k,j)=>{ const px=22+j*(pw+4),py=y+5,ph=rowH-24,pt=frPart(r[k]),act=on&&sel.k===k,pg=this.add.graphics();
        pg.fillStyle(pt?col[k]:0x1b1624,pt?0.22:1); pg.fillRoundedRect(px,py,pw,ph,8); pg.lineStyle(act?2.5:1,act?0xffffff:col[k],act?1:0.6); pg.strokeRoundedRect(px,py,pw,ph,8);
        const ik=pt&&frIconKey(r[k]),isz=Math.min(22,ph-2),tx=this.add.text(px+(ik?isz+3:0)+(pw-(ik?isz+3:0))/2,py+ph/2,pt?pt.name+(Save.frLv(r[k])>1?' ★'+Save.frLv(r[k]):''):lbl[k]+(k==='m'?' (opt)':' ?'),{fontFamily:'sans-serif',fontStyle:pt?'bold':'normal',fontSize:'9px',color:pt?'#ffffff':'#8d8195',align:'center',wordWrap:{width:pw-(ik?isz+6:6)}}).setOrigin(0.5);
        this.menu.add([pg,tx]); if(ik)this.menu.add(this.add.image(px+isz/2+2,py+ph/2,ik).setDisplaySize(isz,isz)); this._zone(px,py,pw,ph,()=>{ if(sel.slot===i&&sel.k===k&&r[k]){ if(Save.frRemove(i,k)==='sugar')this.menuToast('Removing a part costs 🍬'+FR_SWAP_SUGAR,'#ff9bb5'); Sfx.select(); } else { if(sel.k!==k)this._kPage=0; sel.slot=i; sel.k=k; Sfx.select(); } this.buildMenuScreen(); }); });
      const cc=this.add.text(14+cw-8,y+rowH/2-6,'🍯'+cost,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:cost>FR_FLAVOR_CAP?'#ff7a7a':'#ffd166'}).setOrigin(1,0.5);
      const st=this.add.text(22,y+rowH-15,full?frSentence(r):'Needs a WHEN and a DO',{fontFamily:'sans-serif',fontSize:'9px',color:full?'#9ff0c8':'#8d8195'});
      this.menu.add([cc,st]); }
    // ถุงชิ้นส่วนของหมวดที่เลือก
    const by=top+FR_SLOT_MAX*(rowH+6)+6,parts=Save.frParts(),kind=sel.k,list=FR_KIND[kind],cur=R[sel.slot];
    const bh=this.add.text(14,by,'🎒 '+({t:'WHEN (trigger)',e:'DO (effect)',m:'TWIST (modifier)'})[kind]+' parts · tap to place in slot '+(sel.slot+1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd9a8'}); this.menu.add(bh);
    const cols=3,gw=(w-28-(cols-1)*6)/cols,gh=40,rowsFit=Math.max(1,Math.floor((h-(by+18)-50)/(gh+5))),per=cols*rowsFit,own=list.filter(pt=>!pt.cut&&(parts[kind+':'+pt.id]||0)>0),pages=Math.max(1,Math.ceil(own.length/per)),pg=Math.min(pages-1,this._kPage||0); this._kPage=pg; let n=0;
    if(pages>1){ const ny=by+18+rowsFit*(gh+5)+4,nt=this.add.text(w/2,ny+8,'‹   '+(pg+1)+' / '+pages+'   ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd9a8'}).setOrigin(0.5); this.menu.add(nt); this._zone(w/2-80,ny-4,60,24,()=>{ this._kPage=(pg-1+pages)%pages; this.buildKitchen(); }); this._zone(w/2+20,ny-4,60,24,()=>{ this._kPage=(pg+1)%pages; this.buildKitchen(); }); }
    own.slice(pg*per,pg*per+per).forEach(pt=>{ const key=kind+':'+pt.id,c=parts[key]||0; const x=14+(n%cols)*(gw+6),y=by+18+Math.floor(n/cols)*(gh+5); n++;
      const trial=Object.assign({},cur,{[kind]:key}),ok=frCost(trial)<=FR_FLAVOR_CAP,g=this.add.graphics();
      g.fillStyle(ok?0x2c2338:0x241c2a,1); g.fillRoundedRect(x,y,gw,gh,8); g.lineStyle(1.5,ok?col[kind]:0x4a4059,1); g.strokeRoundedRect(x,y,gw,gh,8);
      const lv=Save.frLv(key),mg=c>=FR_MERGE_N&&lv<FR_LV_MAX,zw=mg?gw-34:gw;
      const ik=frIconKey(key),isz=28;
      const t1=this.add.text(x+(ik?isz+8:6),y+5,pt.name+(lv>1?' ★'+lv:''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:ok?'#ffffff':'#7a7088',wordWrap:{width:zw-(ik?isz+12:10)}});
      const t2=this.add.text(x+(ik?isz+8:6),y+gh-13,'🍯'+pt.cost+'  ×'+c,{fontFamily:'sans-serif',fontSize:'8px',color:'#b7abc9'});
      if(mg){ const mb=this.add.graphics(); mb.fillStyle(0x4a3a1a,1); mb.fillRoundedRect(x+gw-32,y+4,28,gh-8,6); const mt=this.add.text(x+gw-18,y+gh/2,'⬆\n×3',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:'#ffe08a',align:'center'}).setOrigin(0.5); this.menu.add([mb,mt]);
        this._zone(x+gw-32,y,32,gh,()=>{ if(Save.frMerge(key)){ Sfx.recipeMerge(); this.digRareBurst&&this.digRareBurst(x+gw/2,y+gh/2,gh,0xffd166); this.menuToast('✨ '+pt.name+' is now ★'+Save.frLv(key)+'!','#ffe08a'); } this.buildMenuScreen(); }); }
      this.menu.add([g,t1,t2]); if(ik)this.menu.add(this.add.image(x+isz/2+4,y+gh/2,ik).setDisplaySize(isz,isz).setAlpha(ok?1:0.45)); this._zone(x,y,zw,gh,()=>{ const pr=Save.frPlace(sel.slot,key); if(pr==='sugar'){ Sfx.select(); this.menuToast('Swapping a part costs 🍬'+FR_SWAP_SUGAR,'#ff9bb5'); } else if(pr){ Sfx.card?Sfx.card():Sfx.select(); if(kind==='t')sel.k='e'; else if(kind==='e')sel.k='m'; } else { Sfx.select(); this.menuToast('Too much flavor! Max 🍯'+FR_FLAVOR_CAP+' per recipe','#ff9bb5'); } this.buildMenuScreen(); }); });
    if(!n)this.menu.add(this.add.text(w/2,by+40,'No parts of this kind yet — dig 🧩 in ⛏️ Temple Depths',{fontFamily:'sans-serif',fontSize:'10px',color:'#8d8195'}).setOrigin(0.5));
    const reset=this.add.text(w/2,h-20,this._kResetConfirm?'⚠ Confirm Kitchen reset · 🧶'+Save.kitchenResetCost():'♻ Reset Kitchen · 🧶'+Save.kitchenResetCost(),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#f0a0b0'}).setOrigin(0.5);this.menu.add(reset);
    this._zone(w/2-135,h-34,270,29,()=>{if(this._kResetConfirm){if(Save.frResetRecipes()){Sfx.clear();this._kSel={slot:0,k:'t'};}else this.menuToast('Need recipes and 🧶'+Save.kitchenResetCost()+' Weave Thread','#ff9bb5');this._kResetConfirm=false;}else{this._kResetConfirm=true;Sfx.select();}this.buildKitchen();});
  }
  stopDigPresentation(){ if(this._exOn&&this.menuScreen!=='dig')this.expStop?.(); }   /* v8.2.36 E1 */
  /* v8.2.34 A19: เสียง Expedition โหลดตอนเปิดหน้า (เสียงเมนูไม่ได้โหลดล่วงหน้า) · SFX + เสียง Ruby ex · เพลงโหลดผ่าน menuMusic */
  exAudioLoad(){ if(this._exAud||!this.load?.audio||!this.cache?.audio)return; let n=0; const add=(k,u)=>{ if(u&&!this.cache.audio.exists(k)){ this.load.audio(k,verUrl(u)); n++; } };
    for(const k in ASSET_AUDIO)if(k.startsWith('sfx_ex_'))add(k,ASSET_AUDIO[k]); if(typeof A07_CATALOG!=='undefined')for(const k of ['vo_ruby_react_exboss_1','vo_ruby_react_exfail_1','vo_ruby_react_exwelcome_1','vo_ruby_tip_expedition'])add(k,A07_CATALOG[k]?.url);
    if(!n){ this._exAud=true; return; } this._exAud=true; this.load.once?.('complete',()=>{ this._exAud=true; }); if(!this.load.isLoading?.())this.load.start(); }
  exSfx(k,vol=.4,gap=.05){ return typeof Sfx!=='undefined'&&Sfx.playFile?.('sfx_ex_'+k,vol); }   /* v8.2.34 A19 · ไม่มีไฟล์ = เงียบ/เสียงเดิม */
  expHelpers(){ const own=new Set((Save.data.chars||[]).concat(Save.data.character||'momo')); return EXP_HELPERS.filter(h=>h.id==='ruby'||own.has(h.id)); }
  expDps(){ const e=Save.exp(); let d=expTapDmg(e.tap||1)*(typeof EXP_HERO_APS!=='undefined'?EXP_HERO_APS:0);   /* v8.2.61 เจ้าของ: ไม่อยากให้กดเยอะ → ฮีโร่ตีเอง (Hero Power = e.tap เดิม) */ for(const h of EXP_HELPERS)d+=expHelpDps(h,e.help[h.id]|0); return d; }
  /* v8.2.61 ปุ่มเดียว: อัปตัวที่ได้ DPS ต่อ Crumb คุ้มสุดซ้ำจนเงินไม่พอ */
  expUpgradeAll(){ const e=Save.exp(),aps=typeof EXP_HERO_APS!=='undefined'?EXP_HERO_APS:2,mx=typeof EXP_UPALL_MAX!=='undefined'?EXP_UPALL_MAX:200,hs=this.expHelpers(),got={}; let n=0;
    for(;n<mx;n++){ let best=null; const tc=expTapCost(e.tap); if(e.crumbs>=tc)best={k:'tap',c:tc,v:(expTapDmg(e.tap+1)-expTapDmg(e.tap))*aps/tc};
      for(const h of hs){ const lv=e.help[h.id]|0,c=expHelpCost(h,lv); if(e.crumbs<c)continue; const v=(expHelpDps(h,lv+1)-expHelpDps(h,lv))/c; if(!best||v>best.v)best={k:h.id,c,v,h}; }
      if(!best)break; e.crumbs-=best.c; if(best.k==='tap')e.tap++; else e.help[best.k]=(e.help[best.k]|0)+1; got[best.k]=(got[best.k]||0)+1; }
    if(!n)return null; Save.save(); this.exSfx?.('upgrade',.4)||Sfx.select?.(); const nm=k=>k==='tap'?'⚔️ Hero':(EXP_HELPERS.find(x=>x.id===k)?.em||'')+' '+(EXP_HELPERS.find(x=>x.id===k)?.name||k);
    this.menuToast?.('⬆ '+Object.keys(got).map(k=>nm(k)+' +'+got[k]).join('  '),'#a8ffb0'); return got; }
  /* v8.2.61 Supplies เติมเอง: ของที่เลือกล่าสุด (e.supplyAuto) ซื้อใหม่ถ้า Crumbs พอ */
  expSupplyRefill(){ const e=Save.exp(); if(e.supply||!e.supplyAuto||!EXP_SUPPLIES.some(q=>q.id===e.supplyAuto))return null; const c=expSupplyCost(e.best); if(e.crumbs<c)return null; e.crumbs-=c; e.supply=e.supplyAuto; Save.save(); return e.supply; }
  expOffline(){ const e=Save.exp(),now=Date.now(),dt=Math.min(EXP_OFF_MAX_H*3600,Math.max(0,(now-(e.at||now))/1000)); e.at=now; const dps=this.expDps(); if(dt<60||dps<=0)return null;
    const s=expIsBoss(e.s)?Math.max(1,e.s-1):e.s,kills=Math.floor(dt*dps*EXP_OFF_RATE/expHp(s)),cr=kills*expCrumb(s); if(kills<1)return null; e.crumbs+=cr; Save.save(); return {sec:dt,kills,cr}; }
  expFoeNew(){ const e=Save.exp(),boss=expIsBoss(e.s)&&!e.farm,hp=expHp(e.s)*(boss?EXP_BOSS_HP:1); this._ex={hp,max:hp,boss,t:boss?EXP_BOSS_T:0}; this.expFoeDraw?.();
    if(boss&&this._exV&&this.state==='menu'){ this.exSfx('boss_appear',.5); this.rubyVoiceReact?.('exboss',400); this.menuMusic?.('dig'); } }   /* v8.2.34 A19 */
  expHit(dmg,crit,tap){ const X=this._ex; if(!X||X.hp<=0)return; X.hp=Math.max(0,X.hp-dmg); const V=this._exV;
    if(tap&&V){ if(V.foe?.active){ this.tweens.killTweensOf(V.foe); V.foe.setScale(V.fs*1.06,V.fs*.94); this.tweens.add({targets:V.foe,scaleX:V.fs,scaleY:V.fs,duration:120}); V.foe.setTintFill?.(0xffffff); this.time.delayedCall(50,()=>{ if(V.foe?.active){ V.foe.clearTint(); if(X.boss&&V.tint)V.foe.setTint(0xff9a9a); } }); }
      if(V.hero?.active){ this.tweens.killTweensOf(V.hero); V.hero.y=V.hy; this.tweens.add({targets:V.hero,y:V.hy-10,duration:60,yoyo:true}); if(V.back){ const n8=(V.hero.texture?.frameTotal||5)-1>=8,hs=n8?[1,2,3,4,5,6,7,0]:[1,2,3,0],ts=n8?[0,27.5,55,82.5,110,137.5,151.25,165]:[0,55,110,165]; hs.forEach((fr,i)=>this.time.delayedCall(ts[i],()=>{ if(V.hero?.active)V.hero.setFrame(fr); })); } }   /* v8.2.84 เฟส 6: ท่าตีมุมหลัง 8 เฟรม เวลาเดิม 165ms */   /* v8.2.33 ใบ 91 ท่าตีมุมหลัง */
      if(this.realTex?.('ex91_hit')){ if(!this.anims.exists('ex91_hit_a'))this.anims.create({key:'ex91_hit_a',frames:this.anims.generateFrameNumbers('ex91_hit',{start:0,end:5}),frameRate:24,repeat:0}); const hx=V.fx+Phaser.Math.Between(-40,40),hy=V.fy-V.fh*Phaser.Math.FloatBetween(.15,.35),hf=this.add.sprite(hx,hy,'ex91_hit',0).setScale((crit?150:110)/160).setTint(V.hcol||0xffffff); this.menu.add(hf); hf.play('ex91_hit_a'); hf.once?.('animationcomplete',()=>hf.destroy()); this.time.delayedCall(400,()=>{ if(hf.active)hf.destroy(); }); }
      const t=this.add.text(V.fx+Phaser.Math.Between(-50,50),V.fy-V.fh*.3,(crit?'💥':'')+expFmt(dmg),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:crit?'22px':'16px',color:crit?'#ffd166':'#ffffff',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5); this.menu.add(t); this.tweens.add({targets:t,y:t.y-50,alpha:0,duration:650,onComplete:()=>t.destroy()}); }
    if(X.hp<=0)this.expKill(); else this.expHud(); }
  expKill(){ const e=Save.exp(),X=this._ex,cr=Math.round(expCrumb(e.s)*(X.boss?EXP_BOSS_CR:1)*(1+.1*Math.min(5,e.mb||0)));   /* v8.2.54 โบนัสจาก Miners เดิม */ e.crumbs+=cr; this.advanceDaily?.('dig'); const V=this._exV;
    if(!X.boss){ this.exSfx('foe_pop',.35); this.time?.delayedCall?.(120,()=>this.exSfx('crumbs',.25)); }
    if(V){ this.patrolPop?.(V.fx,V.fy-V.fh*.25,X.boss?0xffd166:0xffb6d9); const t=this.add.text(V.fx,V.fy-V.fh*.5,'🍪 +'+expFmt(cr),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffe08a',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5); this.menu.add(t); this.tweens.add({targets:t,y:t.y-40,alpha:0,duration:900,onComplete:()=>t.destroy()}); }
    if(X.boss){ const s=e.s; e.s++; e.k=0; e.best=Math.max(e.best,e.s); this.exSfx('boss_down',.5)||Sfx.digRare?.(); this.time?.delayedCall?.(300,()=>{ if(this.state==='menu'&&this.menuScreen==='dig')this.menuMusic?.('dig'); }); if(!e.boss[s]){ e.boss[s]=1; this.expBossReward(s); } }
    else { e.k++; if(e.k>=EXP_KILLS){ e.k=0; if(!e.farm){ e.s++; e.best=Math.max(e.best,e.s); this.exSfx('stage_up',.35); } else { e.farm=false; e.s=Math.ceil(e.s/EXP_BOSS_EVERY)*EXP_BOSS_EVERY; if(!expIsBoss(e.s))e.s++; } } }   /* v8.2.61 ฝึกครบ → ลองบอสใหม่เอง (เลิกปุ่ม Fight Boss) */
    Save.save(); this.expFoeNew(); this.expHud(); }
  expBossFail(){ this.exSfx('boss_fail',.45); this.rubyVoiceReact?.('exfail',300); const e=Save.exp(); e.farm=true; e.s=Math.max(1,e.s-1); e.k=0; this.menuToast?.('⏱ Out of time! Training '+EXP_KILLS+' foes, then the boss again','#ffb4b4'); Save.save(); this.expFoeNew(); this.buildMenuScreen(); }
  /* บอสครั้งแรก = รางวัลเข้าเกมหลัก (แทนของที่เคยขุดได้) · ทุก 10 ด่าน + Recipe Part · ทุก 25 ด่าน + Currency */
  expBossReward(s){ const got=[],su=15+3*s,th=3+Math.floor(s/5); Save.addSugar(su); got.push('🍬 +'+su); Save.addThreads(th); got.push('🧶 +'+th);
    if(s%10===0&&FR_SIMPLE){ Save.addThreads(10); got.push('🧶 +10'); }   /* v8.2.37 Kitchen แบบย่อไม่ใช้ชิ้นส่วน → ด้ายแทน */
    else if(s%10===0&&typeof frRollPart==='function'){ const k=frRollPart(),pt=frPart(k); Save.frAddPart(k,1); got.push(pt.emoji+' '+pt.name); }
    if(s%25===0&&typeof rollWeightedCurrency==='function'){ const k=rollWeightedCurrency(s>=75?'legend':s>=40?'epic':'rare'),n=2+Math.floor(s/25); if(k){ Save.addCurrency(k,n); got.push(currencyDef(k).emoji+'×'+n); } }
    this.menuToast?.('👑 Boss '+s+' first clear! '+got.join('  '),'#ffd166'); }
  expDaily(){ const e=Save.exp(); if(!Save.expDailyReady())return false; e.daily=localDayKey(); const b=e.best,su=40+b*3,th=25+b,got=['🍬 +'+su,'🧶 +'+th]; Save.addSugar(su); Save.addThreads(th);
    if(!FR_SIMPLE&&typeof frRollPart==='function'){ const k=frRollPart(),pt=frPart(k); Save.frAddPart(k,1); got.push(pt.emoji+' '+pt.name); } Save.save(); this.exSfx('daily_chest',.5)||Sfx.chestWin?.(); this.menuToast?.('🎁 Daily Expedition chest: '+got.join('  '),'#a8ffb0'); return true; }
  expBuy(kind,id){ const e=Save.exp(); if(kind==='tap'){ const c=expTapCost(e.tap); if(e.crumbs<c)return false; e.crumbs-=c; e.tap++; }
    else if(kind==='help'){ const h=EXP_HELPERS.find(x=>x.id===id),lv=e.help[id]|0,c=h?expHelpCost(h,lv):Infinity; if(e.crumbs<c)return false; e.crumbs-=c; e.help[id]=lv+1; }
    else if(kind==='supply'){ const c=expSupplyCost(e.best); if(e.supply||e.crumbs<c)return false; e.crumbs-=c; e.supply=id; e.supplyAuto=id; }
    Save.save(); const hl=kind==='help'?(e.help[id]|0):0; (kind==='help'?this.exSfx(hl%25===0?'milestone':'hire',.4):kind==='supply'?this.exSfx('supply',.4):this.exSfx('upgrade',.35))||Sfx.select?.(); return true; }
  expStop(){ this._exEv?.remove?.(false); this._exEv=null; this._exOn=false; this._exV=null; try{ Save.exp().at=Date.now(); Save.save(); }catch(e){} }
  expTick(){ if(!this._exOn)return; if(this.state!=='menu'||this.menuScreen!=='dig'){ this.expStop(); return; } const now=Date.now(),dt=Math.min(.5,Math.max(0,(now-(this._exAt||now))/1000)); this._exAt=now; Save.exp().at=now;
    const X=this._ex; if(!X)return; const d=this.expDps()*dt; if(d>0)this.expHit(d,false,false); if(X.boss&&this._ex===X&&X.hp>0){ const t0=X.t; X.t-=dt; if(X.t<=5&&Math.ceil(X.t)<Math.ceil(t0))this.exSfx('boss_tick',.35); if(X.t<=0){ this.expBossFail(); return; } } this.expHud(); if((this._exSave=(this._exSave||0)+1)%50===0)Save.save(); }
  expHud(){ const V=this._exV,X=this._ex,e=Save.exp(); if(!V||!X||!V.bar?.active)return; const f=X.max>0?X.hp/X.max:0; V.bar.clear(); V.bar.fillStyle(0x1a0f1e,.85).fillRoundedRect(V.bx,V.by,V.bw,12,6).fillStyle(X.boss?0xff5a6e:0x7be08a,1).fillRoundedRect(V.bx+2,V.by+2,Math.max(0,(V.bw-4)*f),8,4);
    V.hpT?.setText(expFmt(X.hp)+' / '+expFmt(X.max)); V.stT?.setText(X.boss?'👑 BOSS · Stage '+e.s+' · ⏱ '+Math.ceil(X.t)+'s':(e.farm?'🔁 Training · boss in '+(EXP_KILLS-e.k)+' · Stage '+e.s:'Stage '+e.s+' · '+(e.k+1)+'/'+EXP_KILLS)); V.crT?.setText('🍪 '+expFmt(e.crumbs)+'   ⚔️ '+expFmt(this.expDps())+'/s'); }
  expFoeDraw(){ const V=this._exV,X=this._ex; if(!V)return; V.foe?.destroy?.(); const e=Save.exp(),ch=Math.floor((e.s-1)/25)%3; let f=null;
    const tk=X.boss?'ex91_bosses':'ex91_titans';
    if(this.realTex?.(tk)){ f=this.add.sprite(V.fx,V.fy+V.fh*.08,tk,X.boss?ch:ch*4+((e.s*3+e.k)%4)).setOrigin(.5,.96); V.fs=(V.fh*(X.boss?.7:.56))/(X.boss?448:320); f.setScale(V.fs); }   /* v8.2.33 ใบ 91 ไททัน/บอสหน้าตรง */
    else if(this.textures.exists('pt_foes')){ const row=ch*2+((e.s+e.k)%2),key='pt_foe_r'+row; if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers('pt_foes',{start:row*6,end:row*6+5}),frameRate:8,repeat:-1}); f=this.add.sprite(V.fx,V.fy,'pt_foes',row*6).setOrigin(.5,.9); f.play(key); V.fs=(V.fh*(X.boss?.62:.46))/128; f.setScale(V.fs); if(X.boss)f.setTint(0xff9a9a); V.tint=true; }
    else { f=this.add.ellipse(V.fx,V.fy-V.fh*.15,V.fh*(X.boss?.5:.36),V.fh*(X.boss?.42:.3),X.boss?0xff7a8a:0xffb6d9,1).setStrokeStyle(4,0xffffff,.8); V.fs=1; }
    this.menu.addAt?.(f,V.foeAt||0) ?? this.menu.add(f); V.foe=f; if(V.crown){ V.crown.setVisible(!!X.boss); } }
  buildExpedition(){ this.stopDigPresentation?.(); this.exAudioLoad?.(); this.menu.removeAll(true); this.tapZones=[]; this._screenBg('⚔️ Temple Expedition','dig_bg',this._expFrom==='upgrade'?'upgrade':'gActivity'); const w=this.W,h=this.H,top=70+this._hdrShift(),e=Save.exp();
    if(this._patrolOn)this.patrolStop?.(); try{ const a=Save.data.afk; if(a&&a.pend&&(a.pend.sugar>=1||a.pend.exp>=1))this.patrolCollect?.(true); }catch(err){}   /* ของค้างจาก Patrol เดิม → รับเลย */
    const off=this.expOffline(); this.expSupplyRefill(); const T=(x,y,str,fs,col,ox=.5)=>{ const o=this.add.text(x,y,str,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:fs+'px',color:col,stroke:'#1a0f1e',strokeThickness:3,align:'center',wordWrap:{width:w-36}}).setOrigin(ox,.5); this.menu.add(o); return o; };
    const fh=Math.round(Math.max(260,Math.min(380,h*.44))),fx=10,fw=w-20,gy=top+fh-24,ch=Math.floor((e.s-1)/25)%3,bgk='ex91_bg_c'+(ch+1);
    if(this.realTex?.(bgk)){ const im=this.add.image(fx+fw/2,top+fh/2,bgk),sw=im.width,sh=im.height,sc=Math.max(fw/sw,fh/sh); im.setScale(sc).setCrop((sw-fw/sc)/2,(sh-fh/sc)/2,fw/sc,fh/sc); this.menu.add(im); const fr=this.add.graphics(); fr.lineStyle(3,0xffd166,.85).strokeRoundedRect(fx,top,fw,fh,20); this.menu.add(fr); }   /* v8.2.33 ใบ 91 ฉากลึก */
    else if(!this.patrolScene?.(ch,fx,top,fw,fh,gy)){ const g=this.add.graphics(); g.fillStyle(0x1d2a3a,.95).fillRoundedRect(fx,top,fw,fh,20).fillStyle(0x2c3f2c,1).fillRoundedRect(fx,top+fh*.62,fw,fh*.38,{tl:0,tr:0,bl:20,br:20}); this.menu.add(g); }
    const V=this._exV={fx:w/2,fy:top+fh*.6,fh,bx:w/2-110,by:top+44,bw:220,foeAt:this.menu.list.length};
    V.bar=this.add.graphics(); this.menu.add(V.bar); V.stT=T(w/2,top+20,'',13,'#fff0b8'); V.hpT=T(w/2,top+66,'',10,'#ffffff'); V.crown=T(w/2,top+fh*.18,'👑',26,'#ffd166'); V.crown.setVisible(false);
    // ฮีโร่หลัก (หลังหันหาไททัน · อาร์ตมุมหลังรอใบสั่ง) + ผู้ช่วย
    const hc=Save.data.character||'momo',hk='char_'+hc,bk='ex91_back_'+hc; V.hy=top+fh+8; V.hcol=(typeof CHARACTERS!=='undefined'&&CHARACTERS[hc]?.color)||0xfff3d6;
    if(this.realTex?.(bk)){ V.back=true; V.hy=top+fh-4; V.hero=this.add.sprite(w/2,V.hy,bk,0).setOrigin(.5,240/256).setScale(fh*.46/192); this.menu.add(V.hero); }   /* v8.2.33 ใบ 91 ฮีโร่มุมหลัง */
    else if(this.textures.exists(hk)){ V.hero=this.add.sprite(w/2,V.hy,hk,0).setOrigin(.5,1).setScale(Math.min(1.25,fh*.36/128)); this.menu.add(V.hero); } else V.hero=T(w/2,V.hy-30,'🍡',40,'#fff');
    this.expHelpers().filter(x=>(e.help[x.id]|0)>0).slice(0,6).forEach((hh,i)=>{ const side=i%2?1:-1,col=Math.floor(i/2),x=w/2+side*(64+col*44),y=V.hy-18-col*10; const hb='ex91_back_'+hh.id; if(hh.id!==hc&&this.realTex?.(hb)){ this.menu.add(this.add.sprite(x,y+16,hb,0).setOrigin(.5,240/256).setScale(fh*.2/192)); } else { const c=this.add.circle(x,y,15,0x2a1f3a,.92).setStrokeStyle(2,0xffd166,.9); this.menu.add(c); T(x,y,hh.em,15,'#fff'); } T(x,y+22,'Lv'+e.help[hh.id],8,'#ffe08a'); });
    this._zone(fx,top,fw,fh+10,()=>{ const crit=Math.random()<EXP_CRIT,d=expTapDmg(Save.exp().tap)*(crit?EXP_CRIT_MUL:1); this.expHit(d,crit,true); const nw=Date.now(); if(nw-(this._exTapSnd||0)>=70){ this._exTapSnd=nw; if(!(crit?this.exSfx('crit',.45):this.exSfx('tap_'+(1+Math.floor(Math.random()*3)),.3)))Sfx.digHit?.(); } },null); this.tapZones[this.tapZones.length-1].tag='exp_tap'; this.tapZones[this.tapZones.length-1].noBounce=true;   /* v8.2.49 เจ้าของ: แตะตีรัว ๆ แล้วตัวละครโตขึ้นเรื่อย ๆ (ลูกเล่นกดปุ่มเด้งซ้อนกัน) → พื้นที่ตีไม่เด้ง */
    // แถบข้อมูล + ปุ่ม
    let y=top+fh+18; V.crT=T(w/2,y,'',12,'#ffe0f0'); if(this.realTex?.('ex91_icons'))this.menu.add(this.add.image(20,y,'ex91_icons',0).setDisplaySize(20,20)); y+=20;
    const bh=34,btn=(x,bw,label,fill,on,fn,tag)=>{ const b=this.add.graphics(); b.fillStyle(on?fill:0x2c2338,1).fillRoundedRect(x,y,bw,bh,11).lineStyle(1.5,on?0xffe08a:0x4a4059,1).strokeRoundedRect(x,y,bw,bh,11); this.menu.add(b); T(x+bw/2,y+bh/2,label,11,on?'#ffffff':'#7a7088'); if(on){ this._zone(x,y,bw,bh,fn); this.tapZones[this.tapZones.length-1].tag=tag; } };
    const dOn=typeof EXP_DAILY_ON==='undefined'||EXP_DAILY_ON,dr=dOn&&Save.expDailyReady(),bw3=dOn?(w-40)/3:(w-34)/2,x2=dOn?20+bw3:14,x3=dOn?26+bw3*2:20+bw3; if(dOn)btn(14,bw3,dr?'🎁 Daily chest':'✓ Chest tomorrow',0x3a5a3a,dr,()=>{ if(this.expDaily())this.buildMenuScreen(); },'exp_daily');   /* v8.2.54 ECRS2 E3: เลิก Daily chest (ซ้ำหน้า Rewards · Daily Quest 'Defeat 30 Expedition foes' มีอยู่แล้ว) */
    const upOk=e.crumbs>=expTapCost(e.tap)||this.expHelpers().some(hh=>e.crumbs>=expHelpCost(hh,e.help[hh.id]|0)); btn(x2,bw3,'⬆ Upgrade all',0x2f9a66,upOk,()=>{ if(this.expUpgradeAll())this.buildMenuScreen(); },'exp_upall');   /* v8.2.61 แทนปุ่ม Fight Boss (บอสลองใหม่เอง) */
    btn(x3,bw3,e.supply?'🎒 '+(EXP_SUPPLIES.find(q=>q.id===e.supply)?.em||'')+' packed':'🎒 Supplies',0x4a3a8a,true,()=>{ this._exTab=this._exTab==='supply'?'tap':'supply'; this.buildMenuScreen(); },'exp_supply_tab');
    y+=bh+10;
    // แท็บ: อัปแตะ + ผู้ช่วย · หรือ Supplies
    const rw=w-28,rx=14,rh=40,row=(em,name,sub,cost,can,fn,tag)=>{ const g=this.add.graphics(); g.fillStyle(0x221a2c,.95).fillRoundedRect(rx,y,rw,rh,10).lineStyle(1.2,0x5a4b75,1).strokeRoundedRect(rx,y,rw,rh,10); this.menu.add(g); T(rx+22,y+rh/2,em,18,'#fff'); T(rx+44,y+13,name,12,'#ffffff',0); T(rx+44,y+29,sub,9.5,'#cfc1d4',0);
      const b=this.add.graphics(),bx=rx+rw-96; b.fillStyle(can?0x2f9a66:0x3a3045,1).fillRoundedRect(bx,y+6,88,rh-12,9); this.menu.add(b); T(bx+44,y+rh/2,cost,11,can?'#ffffff':'#8a8098'); if(can){ this._zone(bx,y+6,88,rh-12,fn); this.tapZones[this.tapZones.length-1].tag=tag; } y+=rh+5; };
    if(this._exTab==='supply'){ T(w/2,y+6,'1 supply for your next stage · refills itself when you have Crumbs',10,'#b7abc9'); y+=20; const c=expSupplyCost(e.best);
      for(const q of EXP_SUPPLIES){ const pk=e.supply===q.id,au=e.supplyAuto===q.id; row(q.em,q.name+(pk?'  ✓ packed':'')+(au?'  🔁':''),q.desc,pk||(au&&!e.supply)?(au?'🔁 Auto on':'Auto off'):e.supply?'—':'🍪 '+expFmt(c),pk||(au&&!e.supply)||(!e.supply&&e.crumbs>=c),()=>{ const E=Save.exp(); if(E.supply===q.id||(E.supplyAuto===q.id&&!E.supply)){ E.supplyAuto=E.supplyAuto===q.id?null:q.id; Save.save(); this.menuToast?.(E.supplyAuto?'🔁 Auto refill on':'Auto refill off','#c7a6ff'); this.buildMenuScreen(); return; } if(this.expBuy('supply',q.id)){ this.menuToast?.(q.em+' '+q.name+' packed · refills itself after each stage','#a8ffb0'); this.buildMenuScreen(); } },'exp_supply_'+q.id); } }   /* v8.2.61 เติมเอง · แตะของที่ใช้อยู่ = เปิด/ปิดเติมเอง */
    else { const tc=expTapCost(e.tap); row('⚔️','Hero Power · Lv '+e.tap,expFmt(expTapDmg(e.tap)*EXP_HERO_APS)+' → '+expFmt(expTapDmg(e.tap+1)*EXP_HERO_APS)+'/s · fights on its own','🍪 '+expFmt(tc),e.crumbs>=tc,()=>{ if(this.expBuy('tap'))this.buildMenuScreen(); },'exp_tap_up');
      const hs=this.expHelpers(),maxRows=Math.max(1,Math.floor((h-y-14)/(rh+5)));
      hs.slice(0,maxRows).forEach(hh=>{ const lv=e.help[hh.id]|0,c=expHelpCost(hh,lv),nx=25*(Math.floor(lv/25)+1); row(hh.em,hh.name+' · Lv '+lv,(lv?expFmt(expHelpDps(hh,lv))+'/s':'Hire to fight for you')+' · ×2 at Lv '+nx,'🍪 '+expFmt(c),e.crumbs>=c,()=>{ if(this.expBuy('help',hh.id))this.buildMenuScreen(); },'exp_help_'+hh.id); }); }
    if(!this._ex||this._ex.hp<=0)this.expFoeNew(); else this.expFoeDraw(); this.expHud();
    if(!e.tip){ e.tip=1; try{ VoiceActing?.play?.(this,'vo_ruby_tip_expedition',()=>this.state==='menu'&&this.menuScreen==='dig'); }catch(err){} }
    if(off)this.time.delayedCall(250,()=>{ this.exSfx('welcome_back',.45); this.rubyVoiceReact?.('exwelcome',200); const hm=Math.floor(off.sec/3600)+'h '+Math.floor(off.sec%3600/60)+'m'; this.menuToast?.('💤 While you were away ('+hm+'): helpers beat '+expFmt(off.kills)+' foes · 🍪 +'+expFmt(off.cr),'#c7a6ff'); });
    if(!this._exOn){ this._exOn=true; this._exAt=Date.now(); } this._exEv?.remove?.(false); this._exEv=this.time.addEvent({delay:100,loop:true,callback:()=>this.expTick()}); this.menu.setVisible(true); }
  /* Supplies: ใช้ตอนเริ่มด่านจริง (Story/Delve) · 1 ชิ้นต่อด่าน แล้วหายไป */
  expSupplyApply(){ if(typeof EXP_ON==='undefined'||!EXP_ON||this._inTutorial)return null; this.expSupplyRefill?.(); const e=Save.exp(),id=e.supply,p=this.player; if(!id||!p)return null; e.supply=null; Save.save();
    if(id==='shield')this._shield=Math.max(this._shield||0,1); else if(id==='xp')p.xpMul=(p.xpMul||1)*1.25; else if(id==='sugar')p.sugarFindMul=(p.sugarFindMul||1)*1.2; else if(id==='hp'){ p.maxhp=Math.round(p.maxhp*1.15); p.hp=p.maxhp; }
    const q=EXP_SUPPLIES.find(x=>x.id===id); if(q)this.time?.delayedCall?.(1600,()=>this.showBanner?.('🎒 Supply: '+q.em+' '+q.name,q.desc.replace('in your next stage','this stage').replace('your next stage','this stage'),1600)); return id; }
  buildDig(){ return this.buildExpedition();   /* v8.2.36 E1: กระดานขุดเดิมลบแล้ว · หน้า dig = Temple Expedition */ }
  tuHeader(key,x,y,w,label,color){ const bw=Math.min(w*.7,Math.max(150,label.length*6.4+64)),p=this.tuPanel(key,0,x,y-2,bw,18); if(!p)return false;
    const t=this.add.text(x+(TEMPLE_UI[key][3]?.[0]||60)*(p._tuK||.4)+4,y+7,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color,stroke:'#3a0d22',strokeThickness:2}).setOrigin(0,0.5); this.menu.add([p,t]);
    if(this.tuHas('perk_tier_line')){ const lw=x+w-(x+bw+4); if(lw>20)this.menu.add(this.tuImg('perk_tier_line',0,x+bw+4,y+7,lw,6).setOrigin(0,0.5)); }
    return true; }
  /* v8.3.15 เจ้าของ: หน้า Rank Rewards วาดด้วยโค้ดทั้งหมด (เลิกใช้การ์ด/ป้าย/ไอคอนจากรูป) + VFX · เอาส่วน Ancient ออก · ตำแหน่งการ์ด/ปุ่มกดเหมือนเดิม
     VFX: เลือกแล้ว = ขอบเรืองแสง + ประกายวิ่งรอบการ์ด · กดเลือก = การ์ดเด้ง + ระเบิดประกาย · ยศที่ยังไม่เลือก = กระพริบทอง · ยศล็อก = หมอกม่วง + โซ่ + กุญแจ */
  buildRankPerks(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('🏅 Rank Rewards',ASSET_IMAGES.screen_temple_perks?'screen_temple_perks':'screen_weave_perks');
    for(const t of this._rrTw||[]){ try{ t.remove?.(); }catch(e){} } this._rrTw=[];
    const TW=(c,host)=>{ if(!this.tweens)return null; const h0=host||(Array.isArray(c.targets)?c.targets[0]:c.targets),up=c.onUpdate; let t=null;
      c.onUpdate=(...a)=>{ if(h0&&!h0.scene){ try{ t&&t.remove(); }catch(e){} return; } up&&up(...a); };
      t=c.targets?this.tweens.add(c):this.tweens.addCounter?.(c); if(t)this._rrTw.push(t); return t; };
    const w=this.W,h=this.H,F='NunitoUI, sans-serif',add=o=>{ this.menu.add(o); return o; };
    const rank=Save.data.rank||0,rb=rankAutoBonus(rank),hs=this._hdrShift(),gap=7,cardW=(w-28-gap)/2,burst=this._rrBurst; this._rrBurst=null;
    const hd=add(this.add.text(w/2,56+hs,'Rank '+rank+'  ·  auto bonus +'+Math.round(rb.sugar*100)+'% Sugar · +'+Math.round(rb.cur*100)+'% crafting currency',{fontFamily:F,fontStyle:'bold',fontSize:'11px',color:'#ffd166',stroke:'#1d0f16',strokeThickness:3}).setOrigin(0.5));
    const sub=add(this.add.text(w/2,72+hs,'Each new Rank lets you pick 1 of 2 rewards · tap the other one any time to switch',{fontFamily:F,fontSize:'10.5px',color:'#e2d6ee',stroke:'#1d0f16',strokeThickness:2}).setOrigin(0.5));
    if(hd.width>w-20)hd.setScale((w-20)/hd.width); if(sub.width>w-16)sub.setScale((w-16)/sub.width);
    let y=88+hs; const rowH=Math.max(52,Math.min(72,(h-hs-88-24)/RANK_REWARDS.length-26));
    // ป้าย RANK: ริบบิ้น + อัญมณีซ้าย + หัวลูกศร + เส้นยาวถึงขอบขวา
    const banner=(y,label,st)=>{ const col=st==='lock'?0x5a4372:st==='pick'?0xe0a23a:0xc8406f,lite=st==='lock'?0x9a86b8:st==='pick'?0xffe08a:0xff9ec4,x=14,bw=Math.min(w-90,label.length*6.3+46),g=add(this.add.graphics());
      g.fillStyle(0x000000,.35).fillRoundedRect(x+11,y+2,bw-10,16,3); g.fillStyle(col,1).fillRoundedRect(x+10,y,bw-10,16,3).fillTriangle(x+bw-1,y,x+bw+10,y+8,x+bw-1,y+16);
      g.fillStyle(0xffffff,.2).fillRect(x+14,y+2,bw-16,5); g.lineStyle(1,lite,.9).strokeRoundedRect(x+10,y,bw-10,16,3);
      g.lineStyle(1.5,lite,.55).lineBetween(x+bw+14,y+8,w-22,y+8); g.fillStyle(lite,.9).fillPoints([{x:w-22,y:y+4},{x:w-18,y:y+8},{x:w-22,y:y+12},{x:w-26,y:y+8}],true);
      g.fillStyle(lite,1).fillPoints([{x:x+10,y:y-1},{x:x+19,y:y+8},{x:x+10,y:y+17},{x:x+1,y:y+8}],true); g.lineStyle(1.2,0xffffff,.8).strokePoints([{x:x+10,y:y-1},{x:x+19,y:y+8},{x:x+10,y:y+17},{x:x+1,y:y+8}],true,true); g.fillStyle(0xffffff,.85).fillCircle(x+10,y+8,2);
      const t=add(this.add.text(x+26,y+8,label,{fontFamily:F,fontStyle:'bold',fontSize:'10.5px',color:st==='lock'?'#d8cce6':'#ffffff',stroke:'#2a0b1c',strokeThickness:2}).setOrigin(0,0.5));
      if(st==='pick'){ const gl=add(this.add.graphics()); gl.lineStyle(4,0xffe08a,.6).strokeRoundedRect(x+8,y-2,bw-6,20,4); TW({targets:gl,alpha:{from:1,to:.1},yoyo:true,repeat:-1,duration:650,ease:'Sine.inOut'}); TW({targets:t,alpha:{from:1,to:.65},yoyo:true,repeat:-1,duration:650,ease:'Sine.inOut'}); } };
    // ประกายดาว 4 แฉก
    const star=(c,r)=>{ const g=this.add.graphics(); g.fillStyle(c,1).fillPoints([{x:0,y:-r},{x:r*.28,y:-r*.28},{x:r,y:0},{x:r*.28,y:r*.28},{x:0,y:r},{x:-r*.28,y:r*.28},{x:-r,y:0},{x:-r*.28,y:-r*.28}],true); g.fillStyle(0xffffff,.9).fillCircle(0,0,r*.25); return g; };
    // จุดบนเส้นขอบการ์ด (u = 0..1 รอบเดียว)
    const edge=(x,y,cw,ch,u)=>{ const P=2*(cw+ch); let d=((u%1)+1)%1*P; if(d<cw)return {x:x+d,y}; d-=cw; if(d<ch)return {x:x+cw,y:y+d}; d-=ch; if(d<cw)return {x:x+cw-d,y:y+ch}; d-=cw; return {x,y:y+ch-d}; };
    const padlock=(cx,cy,s,a)=>{ const g=add(this.add.graphics()); g.lineStyle(2*s,0xc9b8e0,a).beginPath(); g.arc(cx,cy-3*s,4*s,Math.PI,0,false); g.strokePath(); g.fillStyle(0x9d8ab8,a).fillRoundedRect(cx-6*s,cy-3*s,12*s,9*s,2*s); g.fillStyle(0x2a2038,a).fillCircle(cx,cy+1*s,1.6*s).fillRect(cx-.6*s,cy+1*s,1.2*s,3*s); return g; };
    const chain=(x0,x1,yy,a)=>{ const g=add(this.add.graphics()); let i=0; for(let x=x0;x<x1-6;x+=9,i++){ if(i%2)g.lineStyle(2,0x8f7fa8,a).lineBetween(x+1,yy,x+8,yy); else { g.lineStyle(1.6,0xb3a3cc,a).strokeEllipse(x+4.5,yy,10,5.5); } } return g; };
    RANK_REWARDS.forEach(row=>{ const open=rank>=row.r,pick=Save.rankPick(row.r);
      const lbl=open?(pick?'RANK '+row.r:'RANK '+row.r+' · CHOOSE ONE'):'RANK '+row.r+' · 🔒 WEAVE UP TO RANK '+row.r;
      banner(y,lbl,!open?'lock':(pick?'on':'pick')); if(open&&!pick)this.drawBadgeDot(this.menu,w-20,y+6);
      y+=22;
      row.opts.forEach((o,i)=>{ const x=14+i*(cardW+gap),on=pick===o.id,st=!open?'lock':on?'on':(!pick?'pick':'open'),cx=x+cardW/2,cy=y+rowH/2,cw=cardW,ch=rowH;
        const bd=st==='on'?0xffd38a:st==='pick'?0xffe08a:st==='open'?0x8f7ab8:0x3d3150;
        if(st==='on'){ const gl=add(this.add.graphics()); gl.lineStyle(8,0x8bffb4,.22).strokeRoundedRect(x-2,y-2,cw+4,ch+4,13); gl.lineStyle(4,0xfff0b0,.4).strokeRoundedRect(x-1,y-1,cw+2,ch+2,12); TW({targets:gl,alpha:{from:1,to:.35},yoyo:true,repeat:-1,duration:1100,ease:'Sine.inOut'}); }
        const box=add(this.add.container(cx,cy)),g=this.add.graphics(); box.add(g);
        g.fillStyle(0x000000,.38).fillRoundedRect(-cw/2+2,-ch/2+3,cw,ch,11);
        g.fillStyle(st==='on'?0x5a1a3e:st==='lock'?0x1a1424:0x261d36,st==='lock'?.94:.97).fillRoundedRect(-cw/2,-ch/2,cw,ch,11);
        g.fillStyle(st==='on'?0x9a2f66:0x3a2e52,st==='on'?.55:.35).fillRoundedRect(-cw/2+3,-ch/2+3,cw-6,ch*.42,{tl:9,tr:9,bl:3,br:3});
        g.lineStyle(st==='on'?2.5:1.6,bd,st==='lock'?.8:1).strokeRoundedRect(-cw/2,-ch/2,cw,ch,11); g.lineStyle(1,0xffffff,st==='lock'?.05:.12).strokeRoundedRect(-cw/2+4,-ch/2+4,cw-8,ch-8,8);
        for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){ const px=sx*(cw/2-7),py=sy*(ch/2-7); g.fillStyle(bd,st==='lock'?.6:1).fillPoints([{x:px,y:py-3.5},{x:px+3.5,y:py},{x:px,y:py+3.5},{x:px-3.5,y:py}],true); }
        const mx=-cw/2+24; g.fillStyle(st==='on'?0x3a0f28:0x1a1426,1).fillCircle(mx,0,15); g.lineStyle(2,bd,st==='lock'?.6:1).strokeCircle(mx,0,15); g.lineStyle(1,0xffffff,.18).strokeCircle(mx,0,11.5);
        const em=this.add.text(mx,0,o.emoji||'✦',{fontSize:'15px'}).setOrigin(0.5).setAlpha(open?1:.35); box.add(em);
        const nm=this.add.text(-cw/2+46,-ch*.18,o.name+(on?'  ✓':''),{fontFamily:F,fontStyle:'bold',fontSize:'11.5px',color:on?'#a8ffc8':(open?'#ffffff':'#b9adc9'),stroke:'#1a0d18',strokeThickness:2}).setOrigin(0,0.5);
        const ds=this.add.text(-cw/2+46,ch*.18,o.desc,{fontFamily:F,fontSize:'10.5px',color:open?'#e2d6ee':'#a99dba',wordWrap:{width:cw-54}}).setOrigin(0,0.5);
        if(nm.width>cw-54)nm.setScale((cw-54)/nm.width); if(ds.height>ch*.55)ds.setScale(Math.max(.75,ch*.55/ds.height)); box.add([nm,ds]);
        if(st==='on'){ // ประกายวิ่งรอบขอบ 2 ดวง
          for(const off of [0,.5]){ const sp=add(star(0xfff3b0,4.5)),host={v:0}; const put=u=>{ const q=edge(x+2,y+2,cw-4,ch-4,u+off); sp.setPosition(q.x,q.y); }; put(0);
            TW({from:0,to:1,duration:2800,repeat:-1,onUpdate:tw=>{ put(tw.getValue?tw.getValue():0); sp.setAngle((sp.angle||0)+4); }},sp); TW({targets:sp,scale:{from:.7,to:1.25},yoyo:true,repeat:-1,duration:420}); } }
        else if(st==='pick'){ const gl=add(this.add.graphics()); gl.lineStyle(2.5,0xffe08a,.9).strokeRoundedRect(x+2,y+2,cw-4,ch-4,9); gl.lineStyle(6,0xffd166,.25).strokeRoundedRect(x,y,cw,ch,11); TW({targets:gl,alpha:{from:1,to:.15},yoyo:true,repeat:-1,duration:650,ease:'Sine.inOut'}); }
        else if(st==='lock'){ // หมอกม่วงลอย + โซ่ล่าง + กุญแจที่เหรียญ
          for(let k=0;k<3;k++){ const fg=add(this.add.graphics()); fg.fillStyle(0x8a5cc8,.11).fillEllipse(0,0,cw*.42,ch*.7); fg.fillStyle(0xb48cf0,.07).fillEllipse(0,0,cw*.26,ch*.42); fg.setPosition(x+cw*(.22+.28*k),y+ch*.5);
            TW({targets:fg,x:fg.x+cw*(k%2?-.12:.12),alpha:{from:.5,to:1},yoyo:true,repeat:-1,duration:2600+k*700,ease:'Sine.inOut'}); }
          chain(x+8,x+cw-8,y+ch-6,.55); padlock(x+cw-16,y+15,1,.85); padlock(x+24+9,y+ch/2+8,.75,.95); }
        if(burst&&burst.r===row.r&&burst.id===o.id){ box.setScale(1.14,.86); TW({targets:box,scaleX:1,scaleY:1,duration:420,ease:'Back.easeOut'});
          const ring=add(this.add.graphics().setPosition(cx,cy)); ring.lineStyle(3,0xfff0b0,1).strokeRoundedRect(-cw/2,-ch/2,cw,ch,11); TW({targets:ring,scaleX:1.18,scaleY:1.45,alpha:0,duration:520,ease:'Cubic.easeOut',onComplete:()=>ring.destroy()});
          const cols=[0xffe08a,0x8bffb4,0xff9ec4,0xffffff];
          for(let k=0;k<16;k++){ const a=Math.PI*2*k/16+Math.random()*.3,d=38+Math.random()*48,p=add(star(cols[k%4],3+Math.random()*3)); p.setPosition(cx,cy);
            TW({targets:p,x:cx+Math.cos(a)*d*1.4,y:cy+Math.sin(a)*d*.8,scale:.2,alpha:0,angle:180,duration:520+Math.random()*260,ease:'Cubic.easeOut',onComplete:()=>p.destroy()}); } }
        if(open&&!on)this._zone(x,y,cw,ch,()=>{ if(Save.setRankPick(row.r,o.id)){ Sfx.menuCue?.('rank_pick',.4)||Sfx.progress('perk'); this._rrBurst={r:row.r,id:o.id}; this.menuToast?.((pick?'🔄 Switched to ':'✨ ')+o.name,'#ffe08a'); } this.buildRankPerks(); });
        else if(!open)this._zone(x,y,cw,ch,()=>{ Sfx.select&&Sfx.select(); this.menuToast?.('🔒 Weave Up to Rank '+row.r+' to unlock','#ffb4c7'); });
      });
      y+=rowH+8; });
    this.menu.setVisible(true);
  }
  /* v7.9.10 ใบ 27 ชุดสมุด (Equipment + Forge) · this._jrSkin ตั้งตอนสร้างหน้า · ยังโหลดไม่ครบ = ธีมม่วงเดิม */
  jrOn(){ return JR_REQ.every(k=>this.realTex?.(k)); }
  // กรอบ 9 ส่วนแบบ tuPanel แต่มุมไม่ขยายเกินขนาดจริง (kMax) · เพิ่มเข้า menu
  jrPanel(key,cell,x,y,w,h,kMax=1){ if(!this.tuHas(key))return null; const [,ch,,ns]=TEMPLE_UI[key]; this.tuFrames(key); const c=this.add.container(x,y);
    if(!ns)c.add(this.add.image(0,0,key,'cell'+cell).setOrigin(0).setDisplaySize(w,h));
    else{ const [l,t,r,b]=ns; let k=Math.min(kMax,h/ch); if((l+r)*k>w)k=w/(l+r); if((t+b)*k>h)k=h/(t+b); const xs=[0,l*k,w-r*k,w],ys=[0,t*k,h-b*k,h];
      for(let j=0;j<9;j++){ const cx=j%3,cy=Math.floor(j/3),f='c'+cell+'_'+j,dw=xs[cx+1]-xs[cx],dh=ys[cy+1]-ys[cy]; if(dw<=0.01||dh<=0.01||!this.textures.get(key).has(f))continue;
        c.add(this.add.image(xs[cx],ys[cy],key,f).setOrigin(0).setDisplaySize(dw+(cx<2?.5:0),dh+(cy<2?.5:0))); } c._k=k; }
    this.menu.add(c); return c; }
  jrImg(key,cell,x,y,w,h){ const im=this.tuImg(key,cell,x,y,w,h); if(im)this.menu.add(im); return im; }
  jrFit(t,max){ if(t.width>max)t.setScale(max/t.width); return t; }
  jrIcon(i,x,y,size){ return this.jrImg('jr_icon_sheet',i,x,y,size,size); }
  jrText(x,y,label,size,color,o={}){ const t=this.add.text(x,y,String(label),{fontFamily:o.serif?'Georgia, "Times New Roman", serif':'NunitoUI, sans-serif',fontStyle:o.bold===false?'normal':'bold',fontSize:size+'px',color,stroke:o.stroke||undefined,strokeThickness:o.stroke?(o.st||2):0}).setOrigin(o.ox??.5,o.oy??.5);
    if(o.max&&t.width>o.max)t.setScale(o.max/t.width); if(o.keep)t._jrKeep=true; this.menu.add(t); return t; }
  // ปุ่มสมุด: primary (เขียวมีช่องไอคอนซ้าย) · secondary · accent (แดงไวน์) · icon (สี่เหลี่ยม) · pill / pill2 (เขียวอ่อน หมึกเข้ม) · pager
  jrButton(x,y,w,h,label,fn,{kind='secondary',disabled=false,on=false,fontSize=13,tag=null,icon=null}={}){
    const chrome=this.controlTheme?.()||{font:'NunitoUI, sans-serif',text:'#fff1e7',muted:'#cfc1d4',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f',surface:0x261e30,border:0x6d536d,edge:0xf4d9a1};
    const KEY={primary:'jr_btn_primary',secondary:'jr_btn_secondary',accent:'jr_btn_accent',icon:'jr_btn_icon',pill:'jr_btn_pill',pill2:'jr_btn_pill',pager:'jr_btn_pager'}[kind]||'jr_btn_secondary';
    let cell=disabled?2:0; if(kind==='icon')cell=on?1:0; if(kind==='pill')cell=0; if(kind==='pill2')cell=1; if(kind==='pager')cell=disabled?2:1;
    const bg=(kind==='icon'||kind==='pager')?this.jrImg(KEY,cell,x+w/2,y+h/2,w,h):this.jrPanel(KEY,cell,x,y,w,h,1); if(disabled&&bg&&(kind==='icon'||kind==='pill'||kind==='pill2'))bg.setAlpha(.5);
    if(kind==='pager'){ if(bg&&label==='‹')bg.setFlipX(true); }
    else { const ink=kind==='pill2',col=disabled?chrome.disabled:ink?chrome.ink:chrome.text,st=ink?null:chrome.shadow; let lx=x+w/2,room=w-14,txt=String(label);
      if(kind==='primary'){ const m=/^(\S+)\s+(.+)$/.exec(txt),sx=x+h*1.05; if(icon!=null){this.jrIcon(icon,sx,y+h/2,h*.58);}else if(m&&!/[A-Za-z0-9]/.test(m[1])){this.jrText(sx,y+h/2,m[1],Math.round(h*.42),'#ffffff',{keep:true});txt=m[2];} lx=(x+h*1.6+x+w-h*.45)/2; room=w-h*2.05; }
      else if(icon!=null&&kind==='icon'){ this.jrIcon(icon,x+w/2,y+h/2,Math.min(w,h)*.7); txt=''; }
      if(txt){ const t=this.jrText(lx,y+h/2+(kind==='primary'?1:0),txt,fontSize,col,{stroke:st,st:1.5,keep:true}); let fs=fontSize; while(t.width>room&&fs>9){fs--;t.setFontSize(fs+'px');} } }
    if(fn&&!disabled){ this._zone(x,y,w,h,()=>{Sfx.select&&Sfx.select();fn();}); if(tag)this.tapZones[this.tapZones.length-1].tag=tag; }
    return bg; }
  // หัวหน้า: ปุ่ม Back เขียว · ป้ายชื่อ · ชิป Sugar แดงไวน์
  jrHeader(title,cy,onBack,tag){ const w=this.W,bw=Math.min(100,Math.round(w*.25)),bh=Math.round(bw*55/180);
    const chrome=this.headerTheme?.()||{text:'#fff1e7',currency:'#f4d9a1',ink:'#3b2416',shadow:'#27182f'};
    const b=this.jrImg('jr_btn_back',0,10+bw/2,cy,bw,bh); this.jrText(10+bw*.63,cy,'Back',13,chrome.text,{stroke:chrome.shadow,keep:true});
    this._zone(4,cy-bh/2-6,bw+12,bh+12,onBack); const z=this.tapZones[this.tapZones.length-1]; z.back=true; if(tag)z.tag=tag;
    const sug=Save.data.sugar||0,st=sug>=100000?(sug/1000).toFixed(0)+'K':String(sug),cw=Math.min(110,Math.max(76,st.length*9+44)),cx=w-10-cw;
    this.jrPanel('jr_chip_currency',0,cx,cy-15,cw,30,1); const ik=this.textures.exists('ic_sugar')?'ic_sugar':this.textures.exists('hr_ic_candy')?'hr_ic_candy':null;
    if(ik)this.menu.add(this.add.image(cx+17,cy,ik).setDisplaySize(20,20)); else this.jrText(cx+17,cy,'🍬',14,'#fff',{keep:true});
    this.jrText(cx+cw-12,cy,st,14,chrome.currency,{ox:1,keep:true,max:cw-40});
    const room=cx-(10+bw)-12,pw=Math.min(room+40,w*.62); this.jrImg('jr_header_plaque',0,w/2,cy+9,pw,pw*75/450)?.setAlpha(.85);
    const t=this.jrText(w/2,cy-2,title,w<360?19:21,chrome.ink); if(t.width>room)t.setScale(room/t.width); }
  // ข้อความบนกระดาษ: เปลี่ยนสีอ่อน (ธีมม่วง) เป็นหมึก · ข้ามข้อความบนปุ่ม/ช่องมืด (_jrKeep) และข้อความมีพื้นหลัง
  jrInkPass(){ if(!this._jrSkin)return; for(const o of this.menu.list){ if(!o||o.type!=='Text'||o._jrKeep||o.style.backgroundColor)continue; const c=JR_INK[String(o.style.color).toLowerCase()]; if(c)o.setColor(c); if(o.style.strokeThickness>0)o.setStroke('#f3e6c8',Math.min(2,o.style.strokeThickness)); } }
  buildGear(){
    this.menu.removeAll(true); this.tapZones=[]; const J=this._jrSkin=false; this._screenBg('Equipment','screen_gear_power_789');   /* v8.0.78 ธีม Power */   /* v8.0.75 เจ้าของ: เลือกแผงม่วงเหมือนหน้าอื่นแทนกระดาษ (โค้ดสมุดเก็บไว้ · jrOn) */
    { const mv=Save.drainGearInbox?.()||0; if(mv)this.time.delayedCall(60,()=>this.menuToast?.('📦 '+mv+' item'+(mv>1?'s':'')+' moved from Inbox to your bag','#8bd3a0')); }
    const w=this.W,h=this.H, id=this.character||Save.data.character||'momo';
    const sel=this.gearSlot||'weapon';
    /* v7.9.2 เจ้าของ ECRS ชุดแรก: E1 เอารูปตัวละครใหญ่ออก (เหลือแถบชื่อ + ATK/DEF) · C1 ช่องสวมใส่ = ตัวกรองกระเป๋า (แตะซ้ำ = ดูทั้งหมด) · กระเป๋า 2 แถวตามเจ้าของ */
    const cols=this.W>this.H?10:5, invRows=2, cy0=Math.max(58,112*w/941), flt=this.gearFilter||null, ax=12, ay=cy0+4, pbh=30;
    this._pwBox=[ax,ay,w-24,pbh];
    { const cp=Save.cp?Save.cp(id):null,[px,py,pw]=this._pwBox,ad=this._adBase=heroAD(id,null),pg=this.add.graphics(); if(J)this.jrPanel('jr_panel',0,px-2,py-3,pw+4,pbh+6,.4); else {pg.fillStyle(0x261e30,.97); pg.fillRoundedRect(px,py,pw,pbh,12); pg.lineStyle(1,0x6d536d,.8).strokeRoundedRect(px,py,pw,pbh,12);} this._pwG=pg;
      this._pwT=this.add.text(px+pw/2,py+pbh/2,((CHARACTERS[id]&&CHARACTERS[id].name)||id)+(cp?' Lv'+cp.lvl:'')+'    ⚔ ATK '+ad.a+'    🛡 DEF '+ad.d,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffffff',align:'center'}).setOrigin(.5); if(this._pwT.width>pw-10)this._pwT.setScale((pw-10)/this._pwT.width); this.menu.add([pg,this._pwT]); }
    const sgap=6, ss=Math.min(64,Math.floor((w-24-sgap*5)/6)), sx0=12+((w-24)-(ss*6+sgap*5))/2+ss/2, sy=ay+pbh+8+13+ss/2;
    ['weapon','armor','gloves','amulet','ring','boots'].forEach((slot,i)=>{ const sx=sx0+i*(ss+sgap), y=sy; (this._gearSlotPos||(this._gearSlotPos={}))[slot]={x:sx,y,ss};
      const def=GEAR_SLOTS.find(g=>g.slot===slot), curId=Save.data.gear[slot], it=GEAR[slot].find(g=>g.id===curId)||GEAR[slot][0];
      const lv=Save.gearLv(it.id), on=it.id.indexOf('_none')<0, isSel=slot===flt;
      const g=this.add.graphics(); if(J)this.jrImg('jr_slot',isSel?1:on?0:3,sx,y,ss+4,(ss+4)*1.06); else { g.fillStyle(isSel?0x423039:0x261e30,.97); g.fillRoundedRect(sx-ss/2,y-ss/2,ss,ss,10);
      g.lineStyle(isSel?1.8:1, isSel?0xf4d9a1:(on?0x85d5b2:0x6d536d), isSel?.95:.8); g.strokeRoundedRect(sx-ss/2,y-ss/2,ss,ss,10); }
      const artKey=on?'gear_'+it.id:null;
      const em=artKey&&this.textures.exists(artKey)?this.add.image(sx,y,artKey).setDisplaySize(ss*0.66,ss*0.66):this.pwIcon?.('slot_'+slot,sx,y,ss*.8)?.setAlpha(on?.9:.5)||this.add.text(sx,y,on?it.emoji:'—',{fontSize:Math.round(ss*0.5)+'px'}).setOrigin(0.5).setAlpha(on?1:0.4);   /* v8.0.78 ช่องว่าง = ไอคอนใบ 57 */
      this.menu.add(g);if(on){const equippedArt=Save.equippedGearItem(slot);if(equippedArt&&gearGrade(equippedArt)!=='start')this.gearRarityFx?.(equippedArt,sx-ss/2,y-ss/2,ss,ss);}this.menu.add(em);this.menu.bringToTop?.(em);   /* pwIcon ถูกเพิ่มก่อนกรอบช่อง → ดึงขึ้นบน */this.menu.add(J?this.jrFit(this.add.text(sx,y-(ss+4)*.53+5,def.label,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'8px',color:isSel?'#ffb3cf':'#e9dce8'}).setOrigin(.5,.5),ss-14):this.add.text(sx,y-ss/2-13,def.label,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:isSel?'#ffb3cf':'#e9dce8'}).setOrigin(.5,0));
      const newN=Save.gearItemsForSlot(slot).filter(x=>x.isNew).length;
      if(newN){ const nd=J?this.tuImg('jr_badge_new',0,sx+ss/2-2,y-ss/2+2,16,16):this.add.circle(sx+ss/2-2,y-ss/2+2,7,0xff5689,1); const nn=this.add.text(nd.x,nd.y,String(Math.min(9,newN)),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'8px',color:'#ffffff'}).setOrigin(0.5); nn._jrKeep=true; this.menu.add([nd,nn]); }
      if(on&&lv>0){ const bd=this.add.text(sx+ss/2-3,y+ss/2-2,'+'+lv,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd166'}).setOrigin(1,1); this.menu.add(bd); }
      this._zone(sx-ss/2,y-ss/2-14,ss,ss+14,()=>{ this.gearFilter=flt===slot?null:slot; this.gearSlot=slot; this.gearInvPage=0; this.gearSelectedUid=null; this.buildMenuScreen(); });
    });
    const setBot=sy+ss/2+6;
    // ---- v7.8.67 เจ้าของ: กระเป๋าเดียวรวมทุกช่อง · ช่องมีแค่รูป + ป้าย Lv มุมขวาบน · เอา Clean/Sell/Scrap ออก ----
    const _so=GEAR_SLOTS.map(q=>q.slot),_go=['legend','epic','rare','common'],items=Save.gearItemsForSlot(null).filter(x=>x.grade!=='start'&&String(x.baseId).indexOf('_none')<0&&GEAR_ALL.some(g=>g.id===x.baseId))
      .filter(x=>!flt||x.slot===flt).sort((a,b)=>(_so.indexOf(a.slot)-_so.indexOf(b.slot))||((Save.isGearEquipped(b.uid)?1:0)-(Save.isGearEquipped(a.uid)?1:0))||(flt?(gearCompareScore(b,this._adBase).sum-gearCompareScore(a,this._adBase).sum):0)||((b.itemLevel||1)-(a.itemLevel||1))||(_go.indexOf(a.grade)-_go.indexOf(b.grade)));   /* v7.9.2 กรองช่อง = ชิ้นที่ดีกว่าขึ้นก่อน */   // v7.8.95 เรียงตามช่อง · ที่ใส่อยู่ก่อน · Lv สูงก่อน
    let selected=Save.gearItem(this.gearSelectedUid);
    if(!selected||selected.slot!==sel){ selected=Save.equippedGearItem(sel)||items.find(x=>x.slot===sel)||null; this.gearSelectedUid=selected?selected.uid:null; }
    const pageSize=cols*invRows,pages=Math.max(1,Math.ceil(items.length/pageSize));
    let page=Math.max(0,Math.min(pages-1,this.gearInvPage||0)); this.gearInvPage=page;
    let y=setBot+12;
    const cap=Save.data.gearInventoryCap||100;
    const hdr=this.add.text(14,y,flt?((GEAR_SLOTS.find(g=>g.slot===flt)||{}).label||flt)+' ✕':'Inventory',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'18px',color:flt?'#ffb3cf':'#fff0e7'}); if(flt)this._zone(10,y-4,hdr.width+10,30,()=>{this.gearFilter=null;this.gearInvPage=0;this.buildMenuScreen();});
    /* v7.9.4 R2 Salvage weaker / Equip Best เป็นไอคอนเล็กบนหัวกระเป๋า · Inbox โชว์เฉพาะตอนมีของค้าง */
    const ib=36,ix2=w-14-ib,ix1=ix2-6-ib,salArm=this._gearConfirm==='salw';
    this.heroButton(ix1,y-3,ib,26,salArm?'⚠':(this.textures.exists('power57_icons')?'':'♻'),()=>{const worse=this.gearWorseItems();if(!worse.length){this._gearConfirm=null;this.showBanner('♻ Nothing to salvage','No weaker unlocked items in the bag',1300);return;}
      if(this._gearConfirm!=='salw'){const t=worse.reduce((o,it)=>({sh:o.sh+gearDismantleValue(it),su:o.su+gearSellSugar(it)}),{sh:0,su:0});this._gearConfirm='salw';Sfx.error();this.buildMenuScreen();this.showBanner('♻ Salvage '+worse.length+' weaker items?','🧶 +'+t.sh+'  🍬 +'+t.su+' · tap ⚠ again to confirm (locked kept)',2200);return;}
      this._gearConfirm=null;let sh=0,su=0;for(const it of worse){const r=Save.salvageGearInstance(it.uid);if(r){sh+=r.shards;su+=r.sugar;}}this.gearSelectedUid=null;this._adBase=null;Sfx.equipment('dismantle');this.buildMenuScreen();this.showBanner('♻ Salvaged '+worse.length+' items','🧶 +'+sh+'   🍬 +'+su,1600);},{fontSize:14});
    const _q57=this.textures.exists('power57_icons'); this.heroButton(ix2,y-3,ib,26,_q57?'':'⚡',()=>{this._gearConfirm=null;this.gearEquipBest();},{fontSize:14});{const qz=this.tapZones[this.tapZones.length-1];if(qz){qz.tag='gear_best';qz.label='⚡';}} { const sz=this.tapZones.find(z=>z.x===ix1&&z.y===y-3); if(sz&&!sz.label)sz.label=salArm?'⚠':'♻'; } if(_q57){ this.pwIcon?.('equip_best',ix2+ib/2,y+10,24); if(!salArm)this.pwIcon?.('salvage',ix1+ib/2,y+10,24); } else this.loadPower57?.();
    if(this._gearBetter?.())this.drawBadgeDot?.(this.menu,ix2+ib-3,y);   // v7.9.56 มีของที่ดีกว่าให้สวม
    const count=this.add.text(ix1-8,y+4,Save.gearInventoryCount()+' / '+cap,{fontFamily:'NunitoUI, sans-serif',fontSize:'11px',color:Save.gearInventoryFull()?'#ff8da2':'#b9abc5'}).setOrigin(1,0);this.menu.add([hdr,count]);
    let rightX=count.x-count.width; const inboxN=Save.gearInboxCount();
    if(inboxN){const inbox=this.add.text(rightX-8,y+4,'📦 '+inboxN,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd166'}).setOrigin(1,0);this.menu.add(inbox);this._zone(inbox.x-inbox.width-4,y-2,inbox.width+8,28,()=>{this.menuScreen='gearInbox';this.buildMenuScreen();});rightX=inbox.x-inbox.width;}
    {const sc=gearSetCounts(),k=SET_ORDER.filter(x=>sc[x]).sort((p,q)=>sc[q]-sc[p])[0],lbl=k?GEAR_SETS[k].emoji+' '+GEAR_SETS[k].name.replace(/ Set$/,'').split(' ').pop()+' '+sc[k]+'/'+gearSetPieces(k).length:'🧩 Sets',bx=14+hdr.width+10,bw=Math.max(56,Math.min(110,rightX-10-bx));
      this.heroButton(bx,y-3,bw,26,lbl,()=>{this._skillArchiveTab='sets';this.menuScreen='skills';this.buildMenuScreen();},{fontSize:11});}
    y+=34; const bagY=y;   // v7.8.95 ปุ่มทั้งกระเป๋า (Salvage weaker · Equip Best) อยู่ใต้หัว Inventory
    if(!items.length){ this.pwArt?.('pw_empty_bag',w/2,y+110,120,120); const empty=this.add.text(w/2,y+30,'No items yet',{fontFamily:'NunitoUI, sans-serif',fontSize:'13px',color:'#e8dcf2',stroke:'#1a0f1e',strokeThickness:3}).setOrigin(0.5);this.menu.add(empty);this.jrInkPass?.();this.menu.setVisible(true);return; }
    const gap=6,cw=(w-28-gap*(cols-1))/cols,ch=cw,visible=items.slice(page*pageSize,page*pageSize+pageSize);
    visible.forEach((item,i)=>{ const base=GEAR_ALL.find(g=>g.id===item.baseId); if(!base)return; const col=i%cols,row=Math.floor(i/cols),x=14+col*(cw+gap),iy=y+row*(ch+gap),on=selected&&selected.uid===item.uid,eq=Save.isGearEquipped(item.uid),tl=TIER_LABEL[item.grade]||TIER_LABEL.common;
      const color=Phaser.Display.Color.HexStringToColor(tl.color).color,g=this.add.graphics();if(J){const bc=this.jrImg('jr_bag_cell',on?1:eq?2:0,x+cw/2,iy+ch/2,cw,ch);if(bc&&!on&&!eq)bc.setTint(color);}else{g.fillStyle(on?0x423039:0x261e30,.97);g.fillRoundedRect(x,iy,cw,ch,10);g.lineStyle(on?1.8:eq?1.6:1,on?0xf4d9a1:eq?0x85d5b2:color,on?.95:.9);g.strokeRoundedRect(x,iy,cw,ch,10);}
      const artKey='gear_'+base.id,em=this.textures.exists(artKey)?this.add.image(x+cw/2,iy+ch*.54,artKey).setDisplaySize(cw*.62,cw*.62):this.add.text(x+cw/2,iy+ch*.54,base.emoji,{fontSize:Math.round(cw*.42)+'px'}).setOrigin(0.5);
      const lt=this.add.text(x+cw-3,iy+3,'Lv'+(item.itemLevel||1),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffffff',backgroundColor:'#2e2140',padding:{x:3,y:1}}).setOrigin(1,0);
      this.menu.add(g);this.gearRarityFx?.(item,x,iy,cw,ch);this.menu.add([em,lt]);
      if(item.isNew){const nd=this.add.circle(x+6,iy+6,4,0xff5689,1);this.menu.add(nd);}
      if(eq&&!J){const ck=this.add.text(x+4,iy+ch-3,'✓',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'11px',color:'#8bd3a0'}).setOrigin(0,1);this.menu.add(ck);}   /* สมุด: ช่องใส่อยู่มี ✓ ในภาพแล้ว */
      if(!eq&&item.grade!=='start'){const sc=gearCompareScore(item,this._adBase||(this._adBase=heroAD(Save.data.character||'momo',null))),up=sc.sum;   /* v7.8.78 เจ้าของ: ลูกศรบอกว่าดีกว่าชิ้นที่ใส่อยู่ไหม (ATK+DEF รวม) · v7.8.84 รองเท้านับวิ่ง/Dash ด้วย */
        if(sc.any&&up){const both=sc.mixed,col=both?(up>0?'#ffd166':'#ffb27a'):(up>0?'#5df08a':'#ff6b81'),ar=this.add.text(x+5,iy+ch-3,up>0?'▲':'▼',{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:Math.round(Math.max(13,cw*.2))+'px',color:col,stroke:'#1a1022',strokeThickness:3}).setOrigin(0,1);ar._jrKeep=true;this.menu.add(ar);}}
      if((item.enhanceLv||0)>0){const lv=this.add.text(x+cw-4-(J?3:0),iy+ch-3-(J?3:0),'+'+item.enhanceLv,{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd166'}).setOrigin(1,1);lv._jrKeep=true;this.menu.add(lv);}
      this._zone(x,iy,cw,ch,()=>{ if(on&&!eq){ if(Save.equipGearInstance(item.slot,item.uid)){ Sfx.equipment('equip'); this.gearEquipFly?.({key:'gear_'+base.id,x:x+cw/2,y:iy+ch*.54,slot:item.slot,item}); } this._adBase=null; this.buildMenuScreen(); return; }   /* v7.9.2 S1 แตะซ้ำ = ใส่ */
        this.gearSelectedUid=item.uid;this.gearSlot=item.slot;if(item.isNew)Save.markGearSeen(item.uid);this.buildMenuScreen();});
    });
    y+=Math.ceil(visible.length/cols)*(ch+gap);
    if(pages>1){ const py=y-1,pw=68,ph=24;
      const pt=this.add.text(w/2,py+ph/2,(page+1)+' / '+pages,{fontFamily:'NunitoUI, sans-serif',fontSize:'10px',color:'#a99fbb'}).setOrigin(0.5);this.menu.add(pt);
      for(const [dir,label,px] of [[-1,'‹',w/2-76],[1,'›',w/2+76]]){const enabled=(dir<0?page>0:page<pages-1);if(J){this.jrButton(px-26,py-3,52,ph+6,label,enabled?()=>{this.gearInvPage=page+dir;this.buildMenuScreen();}:null,{kind:'pager',disabled:!enabled});continue;}const pg=this.add.graphics();pg.fillStyle(enabled?0x3a3550:0x241a2e,1);pg.fillRoundedRect(px-pw/2,py,pw,ph,8);const tx=this.add.text(px,py+ph/2,label,{fontSize:'18px',color:enabled?'#ffffff':'#5e5062'}).setOrigin(0.5);this.menu.add([pg,tx]);if(enabled)this._zone(px-pw/2,py,pw,ph,()=>{this.gearInvPage=page+dir;this.buildMenuScreen();});} y+=ph+5; }
    selected=Save.gearItem(this.gearSelectedUid)||selected; const base=selected&&GEAR_ALL.find(g=>g.id===selected.baseId),equipped=Save.equippedGearItem(sel);
    if(selected&&base){ const eqBase=equipped&&GEAR_ALL.find(g=>g.id===equipped.baseId),tl=TIER_LABEL[selected.grade]||TIER_LABEL.common,rl=RARITY_LABEL[selected.craftState]||RARITY_LABEL.magic,eq=Save.isGearEquipped(selected.uid);
      const rows=gearCompareRows(equipped,selected).filter(r=>r.key==='attack'||r.key==='armor'),affLines=it=>{if(!it)return[];const ib=GEAR_ALL.find(g=>g.id===it.baseId),im=ensureImplicit(it),idf=im&&implicitDef(im.id),out=[];if(idf)out.push({t:'◇ '+implicitText(it)+' · '+IMPLICIT_TIER[idf.rank],c:IMPLICIT_COLOR[idf.rank]});else if(ib&&ib.unique)out.push({t:'★ '+ib.desc,c:'#ff8f3a'});const af=(it.affixes||[]).map(a=>({a,d:affixDef(a.id)})).filter(x=>x.d);for(const kind of ['prefix','suffix'])af.filter(x=>(x.d.kind||'suffix')===kind).slice(0,3).forEach(x=>out.push({t:(kind==='prefix'?'P ':'S ')+x.d.emoji+x.d.label+' '+x.d.fmt(x.a.v)+' T'+(x.a.t||3),c:kind==='prefix'?'#ffb27a':'#8be0c8'}));return out;},eqAff=affLines(equipped),selAff=affLines(selected),affN=0,AH=Math.min(58,Math.round(w*0.15)),affTop=26+AH+Math.max(1,rows.length)*14+6,panelH=affTop+2,cgap=6,cw=(w-28-cgap)/2,leftX=14,rightX=14+cw+cgap;
      const _cardY=y;
      if(!eq&&equipped&&eqBase){   /* v7.9.2 C2 เทียบ 2 คอลัมน์: ที่ใส่อยู่ → ชิ้นนี้ + ATK/DEF ที่เปลี่ยน */
        const sh=98,cg=6,cw2=(w-28-cg)/2,g=this.add.graphics();if(J){this.jrPanel('jr_panel',0,14,y-2,w-28,sh+4,.3);g.lineStyle(1,0x8a6a48,.7).lineBetween(14+cw2+cg/2,y+10,14+cw2+cg/2,y+sh-26);}else{g.fillStyle(0x261e30,.97).fillRoundedRect(14,y,w-28,sh,12);g.lineStyle(1,0x6d536d,.8).strokeRoundedRect(14,y,w-28,sh,12);g.lineStyle(1,0x4a3f5c,1).lineBetween(14+cw2+cg/2,y+8,14+cw2+cg/2,y+sh-26);}this.menu.add(g);
        const colD=(it,b,x,title,tc)=>{ const t=TIER_LABEL[it.grade]||TIER_LABEL.common,F='NunitoUI, sans-serif';
          this.menu.add(this.add.text(x+8,y+6,title,{fontFamily:F,fontStyle:'bold',fontSize:'10px',color:tc}));
          this.menuRarityFrame?.(it,x+4,y+24,40,40);const ak='gear_'+b.id;this.menu.add(this.textures.exists(ak)?this.add.image(x+24,y+44,ak).setDisplaySize(34,34):this.add.text(x+24,y+44,b.emoji,{fontSize:'22px'}).setOrigin(.5));
          const tw=cw2-50,nm=this.add.text(x+44,y+22,gearAffixName(b.name,it.affixes||[]),{fontFamily:F,fontStyle:'bold',fontSize:'11px',color:t.color});if(nm.width>tw)nm.setScale(tw/nm.width);
          const st=this.add.text(x+44,y+38,gearBaseStatText(it),{fontFamily:F,fontSize:'10px',color:'#f1e5ef'});if(st.width>tw)st.setScale(tw/st.width);
          const lv=this.add.text(x+44,y+58,t.name+' · Lv'+(it.itemLevel||1)+((it.enhanceLv||0)>0?' · +'+it.enhanceLv:''),{fontFamily:F,fontSize:'10px',color:t.color});if(lv.width>tw)lv.setScale(tw/lv.width);this.menu.add([nm,st,lv]); };
        colD(equipped,eqBase,14,'EQUIPPED','#9a90ab'); colD(selected,base,14+cw2+cg,'THIS ITEM · tap again to equip','#7de0a1');
        const ad=this._adBase||heroAD(id,null),dd=gearADDelta(selected,ad),f=(ic,l,v)=>ic+' '+l+' '+(v>0?'+'+v:v<0?'−'+Math.abs(v):'±0'),up=dd.a>=0&&dd.d>=0&&(dd.a||dd.d),dn=dd.a<=0&&dd.d<=0&&(dd.a||dd.d);
        const dl=this.add.text(w/2,y+sh-13,f('⚔','ATK',dd.a)+'     '+f('🛡','DEF',dd.d),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:up?'#5df08a':dn?'#ff6b81':'#ffd166'}).setOrigin(.5);this.menu.add(dl);
        y+=sh+8;
      } else {const sh=64,g=this.add.graphics();if(J)this.jrPanel('jr_panel',0,14,y-2,w-28,sh+4,.3);else{g.fillStyle(0x261e30,.97).fillRoundedRect(14,y,w-28,sh,12);g.lineStyle(1,0x6d536d,.8).strokeRoundedRect(14,y,w-28,sh,12);}this.menu.add(g);
        this.menuRarityFrame?.(selected,17,y+7,50,50);const ak='gear_'+base.id,ic=this.textures.exists(ak)?this.add.image(42,y+sh/2,ak).setDisplaySize(46,46):this.add.text(42,y+sh/2,base.emoji,{fontSize:'26px'}).setOrigin(.5);
        const nm=this.add.text(74,y+13,gearAffixName(base.name,selected.affixes||[]),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'14px',color:tl.color}).setOrigin(0,.5);let nf=14;while(nm.width>w-94&&nf>11)nm.setFontSize(--nf+'px');
        const st=this.add.text(74,y+31,(eq?'Equipped · ':'')+tl.name,{fontFamily:'NunitoUI, sans-serif',fontSize:'11px',color:tl.color}).setOrigin(0,.5);
        const bs=this.add.text(74,y+49,gearBaseStatText(selected)+' · Lv'+(selected.itemLevel||1),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'12px',color:'#f1e5ef'}).setOrigin(0,.5);this.menu.add([ic,nm,st,bs]);y+=sh+8;}
      { const lk=!!selected.locked,cx=w-14-34,cy=y-8-30,cg=this.add.graphics(); if(J){this.jrImg('jr_btn_icon',lk?1:0,cx+14,cy+12,28,28);this.jrIcon(lk?4:5,cx+14,cy+12,20);}else{ cg.fillStyle(lk?0x85506f:0x3a3550,1).fillRoundedRect(cx,cy,28,24,8); cg.lineStyle(1,lk?0xff9ec4:0x6f6283,1).strokeRoundedRect(cx,cy,28,24,8); }   /* v7.9.3 C3 ปุ่มล็อกย้ายมาเป็นไอคอนบนการ์ด */
        const ct=this.add.text(cx+14,cy+12,J?'':lk?'🔒':'🔓',{fontSize:'13px'}).setOrigin(.5); this.menu.add([cg,ct]); this._zone(cx-4,cy-4,36,32,()=>{ if(Save.gearItem(selected.uid)){const l=Save.toggleGearLock(selected.uid);Sfx.equipment(l?'lock':'unlock');} this._gearConfirm=null; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].lockChip=true; }
      this._cmpBase=eq?[]:rows;
      const _enhCap=gearEnhanceCap(selected),_actH=40+6+34+12,_od0=base.enh&&(selected.enhanceLv||0)<_enhCap?enhanceOdds(selected.enhanceLv||0):null,_warnH=_od0&&(_od0.destroy>0||_od0.brk>0)?18:0,_actTop=Math.max(y+60,h-_actH-_warnH);   // v7.8.102 ปุ่มติดล่างจอ ไม่ต้องเลื่อน
      y=this.drawModCompare(equipped,selected,eq,y,w,_actTop-4);
      const setChange=gearSetCompareText(sel,selected); if(setChange&&y+14<=_actTop){const st=this.add.text(16,y,setChange,{fontFamily:'NunitoUI, sans-serif',fontSize:'8.5px',color:'#8bd3ff',wordWrap:{width:w-32}}).setOrigin(0,0);this.menu.add(st);y+=Math.max(14,st.height+3);}
      y=Math.max(y,_actTop);
      if(base.enh&&(selected.enhanceLv||0)<_enhCap){const od=enhanceOdds(selected.enhanceLv||0);if(od.destroy>0||od.brk>0){if(J)this.jrPanel('jr_warning_ribbon',0,18,y-4,w-36,22);const pc=v=>Math.round(v*100)+'%',wt=this.add.text(w/2,y,(od.destroy>0?'⚠ Risky: ':'⚠ ')+pc(od.success)+' success · '+pc(od.brk)+' drops a level'+(od.destroy>0?' · '+pc(od.destroy)+' DESTROYS the item':''),{fontFamily:'NunitoUI, sans-serif',fontStyle:'bold',fontSize:'10px',color:od.destroy>0?'#ff8da2':'#ffd166',align:'center',wordWrap:{width:w-32}}).setOrigin(.5,0);this.menu.add(wt);y+=Math.max(16,wt.height+4);}}   /* v7.8.67 เจ้าของ: ตีบวกมีโอกาสพังต้องเตือน */
      // v6.55.50: ลำดับปุ่ม — หลักเต็มกว้าง (Equip/Enhance) · รอง Craft + ★/🔒 ไอคอน + ⋯ More · ขาย/ย่อยซ่อนใน More
      const bgap=6,full=w-28,bh=40,bh2=34,y1=y,y2=y+bh+bgap,y3=y2+bh2+bgap,cw2=Math.round(full*0.52),sw=(full-cw2-bgap*2)/2,hw=(full-bgap)/2,moreOpen=true;   // v7.6.4 เจ้าของ: เลิกปุ่ม ⋯ · ย่อย/ขาย แสดงตลอด
      const cW=Math.round((full-bgap*2)*.25),dW=full-bgap*2-cW*2,SL={2:eq?[14,y1,full,bh]:[14,y1,hw,bh],e:[14+hw+bgap,y1,hw,bh],c:[14,y2,cW,bh2],g:[14+cW+bgap,y2,cW,bh2],3:[14+cW*2+bgap*2,y2,dW,bh2],s:[14,bagY,hw,30],m:[14+hw+bgap,bagY,hw,30]};   /* v7.9.3 R1 Equip|Enhance คู่กัน · C3 แถว 2 = Craft | Salvage/Unlock/Lock */
      const conf=(ck,label)=>this._gearConfirm===ck?'⚠ Tap again to confirm':label, arm=ck=>{this._gearConfirm=ck;Sfx.error();this.buildMenuScreen();};   /* v7.9.3 S2 ยืนยันที่ตัวปุ่ม */   // v7.8.94 ★ รวมกับ 🔒 · แถว 2 Craft|Lock|Salvage · แถว 3 Salvage weaker|Equip Best   // v7.8.84 แถวล่าง 3 ปุ่ม: Salvage · Salvage ▼ · Best
      const drawAction=(i,label,color,fn,tc)=>{const [bx,by,bw,bhh]=SL[i];this.heroButton(bx,by,bw,bhh,label,fn,{active:(i===2||i==='e')&&!!fn,disabled:!fn,fontSize:(i===2||i==='e')?(eq?15:13):12});if(fn){const z=this.tapZones[this.tapZones.length-1];z.fn=fn;if(i==='c')z.tag='gear_craft';if(i===2&&!eq)z.tag='gear_equip';}};
      if(!eq)drawAction(2,'⚔ Equip',0x3fa868,()=>{if(Save.equipGearInstance(sel,selected.uid)){Sfx.equipment('equip');const z=this._lastTapZ,b0=GEAR_ALL.find(g=>g.id===selected.baseId);if(b0)this.gearEquipFly?.({key:'gear_'+b0.id,x:z?z.x+z.w/2:this.W/2,y:z?z.y+z.h/2:this.H*.7,slot:sel,item:selected});}this.buildMenuScreen();});   /* v8.1.134 ปุ่ม Equip ก็บินเข้าช่อง */
      {const lv=gearEffectiveEnhance(selected),can=base.enh&&lv<_enhCap,cost=gearEnhShardCost(lv),afford=Save.threads()>=cost,od=enhanceOdds(lv),risk=od.destroy>0?' ⚠':od.brk>0?' ~':'';
        drawAction(eq?2:'e',can?conf('enh:'+selected.uid+':'+lv,'⚒ Enhance +'+(lv+1)+(eq?'   ':' ')+'🧶'+cost+risk):'iLv cap +'+_enhCap,can?(afford?0xb88925:0x73404b):0x3f6d54,can?()=>{ if(!afford){Sfx.error();this.showBanner('🧶 Not enough Thread','Requires '+cost+' Thread · salvage gear to get more',1400);return;} const live=Save.gearItem(selected.uid);if(!live||gearEffectiveEnhance(live)!==lv||gearEffectiveEnhance(live)>=gearEnhanceCap(live)){this.buildMenuScreen();return;} const _el=live.enhanceLv||0,_od=typeof enhanceOdds==='function'?enhanceOdds(_el):{destroy:0},ck='enh:'+selected.uid+':'+_el;if(_od.destroy>0&&this._gearConfirm!==ck){arm(ck);return;} this._gearConfirm=null; if(Save.spendShards(cost)){ const res=Save.enhance(selected.uid); Sfx.equipmentEnhance(res);
            if(res.result==='success'){this.screenFlash(0xffd166,.4,260);this.showBanner('⚒️ Enhanced!','Now +'+res.lv,1100);}
            else if(res.result==='break'){this.screenFlash(0xff8a5a,.42,320);this.showBanner('💥 Enhancement broke','Dropped to +'+res.lv,1500);}
            else {this.gearSelectedUid=null;this.screenFlash(0xff4a5a,.6,440);this.showBanner('💀 Item destroyed','It shattered at high enhancement',1800);} }
          this.buildMenuScreen(); }:null);}
      const canDis=!eq&&!selected.locked&&!selected.favorite&&selected.grade!=='start',gain=gearDismantleValue(selected),canSell=canDis,sv=gearSellSugar(selected);
      const togLock=()=>{if(Save.gearItem(selected.uid)){const l=Save.toggleGearLock(selected.uid);Sfx.equipment(l?'lock':'unlock');}this._gearConfirm=null;this.buildMenuScreen();};
      if(eq)drawAction(3,selected.locked?'🔒 Locked':'🔓 Lock',0x3a3550,togLock); else if(selected.locked||selected.favorite)drawAction(3,'🔓 Unlock to salvage',0x3a3550,togLock);
      if(canDis)drawAction(3,conf('sal:'+selected.uid,'♻ Salvage +'+gain+'🧶 +'+sv+'🍬'),0x8d4b3e,()=>{const ck='sal:'+selected.uid;if((selected.affixes||[]).length&&selected.craftedAt&&this._gearConfirm!==ck){arm(ck);return;}this._gearConfirm=null;const r=Save.salvageGearInstance(selected.uid);if(r){this.gearSelectedUid=null;this._adBase=null;Sfx.equipment('dismantle');this.buildMenuScreen();this.showBanner('♻ Salvaged','🧶 +'+r.shards+'   🍬 +'+r.sugar,1200);}});
      { const fOpen=typeof featureOpen!=='function'||featureOpen('craft'),canCraft=fOpen&&selected.grade!=='start'&&!selected.locked; { const mOk=fOpen&&!!Save.mergeCanMain?.(selected),mN=mOk?Save.mergeFodder(selected).length:0; drawAction('g',fOpen?(selected.grade==='legend'?'Max rarity':'🔗 Merge'+(mOk?' '+Math.min(2,mN)+'/2':'')):'🔒 Merge',0x5a3f8c,mOk?()=>{this._mergeBack='gear';this._mergeMain=selected.uid;this._mergeF=null;this._mergeCarry=undefined;this.menuScreen='merge';this.buildMenuScreen();}:null); if(mN>=2)this.drawBadgeDot?.(this.menu,SL.g[0]+SL.g[2]-6,SL.g[1]+6); }
        drawAction('c',fOpen?'🧪 Craft':'🔒 Forge',canCraft?0x5a3f8c:0x3a3550,canCraft?()=>{this.gearSlot=sel;this.craftSelectedUid=selected.uid;this.gearSelectedUid=selected.uid;this.craftLineIndex=0;this._craftRolledId=null;this.menuScreen='craft';this.buildMenuScreen();}:null,canCraft?'#e9dcff':'#8d8195'); }
      if(!eq&&!selected.locked&&!selected.favorite&&!canDis){this.menu.add(this.add.text(SL[3][0]+dW/2,y2+bh2/2,'Starter items are protected',{fontFamily:'NunitoUI, sans-serif',fontSize:'11px',color:'#b9abc5'}).setOrigin(.5));}
      y=y2+bh2;
    }
    this.jrInkPass?.(); this.menu.setVisible(true);
  }
  // v6.55.35 🧹 Clean up: ขาย/ย่อยหลายชิ้นในครั้งเดียวตามตัวกรอง · ไม่แตะของสวม/ล็อก/★/คราฟแล้ว/unique · + ตั้งค่า auto ตอนดรอป
  // v7.8.84 เจ้าของ: ใส่ของดีสุดทุกช่อง (Power สูงสุด · รองเท้าเทียบวิ่ง/Dash ด้วย)
  gearEquipBest(){const cid=Save.data.character||'momo';let n=0;for(const sd of GEAR_SLOTS){const pool=Save.gearItemsForSlot(sd.slot).filter(it=>it&&it.grade!=='start'&&!it.forgeChoice);let best=null,bv=0;const basePow=heroPower(cid,null);for(const it of pool){if(Save.isGearEquipped(it.uid))continue;const v=gearPowerDelta(it,basePow)+(sd.slot==='boots'?gearCompareScore(it).m*2:0);if(v>bv){bv=v;best=it;}}if(best&&Save.equipGearInstance(sd.slot,best.uid))n++;}
    this._adBase=null;if(n){Sfx.equipment('equip');this.showBanner('⚡ Equipped best gear',n+' slot'+(n>1?'s':'')+' upgraded',1300);}else this.showBanner('⚡ Already the best','Nothing stronger in your bag',1200);this.buildMenuScreen();}
  gearWorseItems(){const ad=this._adBase||(this._adBase=heroAD(Save.data.character||'momo',null));return Save.gearItemsForSlot(null).filter(it=>it&&it.grade!=='start'&&!it.locked&&!it.favorite&&!it.forgeChoice&&!Save.isGearEquipped(it.uid)&&gearCompareScore(it,ad).worse);}
  buildGearInbox(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('📦 Reward Inbox','screen_inbox','gLoadout');
    const w=this.W,cap=Save.data.gearInventoryCap||100,items=Save.gearInboxItems(),mode=Save.data.gearAutoDismantle||'off',labels={off:'OFF',common:'COMMON',rare:'COMMON + RARE'};
    let y=w<=this.H?96:64;   /* v7.8.70: เดิม 64 ทับปุ่ม Back บนจอแนวตั้ง */const info=this.add.text(14,y,'Bag '+Save.gearInventoryCount()+' / '+cap+'   ·   Inbox '+items.length+' / '+GEAR_INBOX_CAP,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:Save.gearInventoryFull()?'#ff8da2':'#d8cde2'}).setOrigin(0,0);
    const auto=this.add.graphics();auto.fillStyle(mode==='off'?0x3a3550:0x704a20,1);auto.fillRoundedRect(w-170,y-6,156,28,9);const at=this.add.text(w-92,y+8,'Auto: '+labels[mode],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:mode==='off'?'#a99fbb':'#ffd166'}).setOrigin(.5);this.menu.add([info,auto,at]);
    this._zone(w-170,y-6,156,28,()=>{Save.setGearAutoDismantle(mode==='off'?'common':mode==='common'?'rare':'off');this.buildGearInbox();});y+=34;
    const note=this.add.text(14,y,'Auto mode affects overflow only. Favorite, Locked, Epic and Legend are always protected.',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#a99fbb',wordWrap:{width:w-28}}).setOrigin(0,0);this.menu.add(note);y+=Math.max(30,note.height+10);
    if(!items.length){const empty=this.add.text(w/2,y+80,'Inbox is empty\nLoot goes here when your '+cap+'-slot bag is full.',{fontFamily:'sans-serif',fontSize:'13px',color:'#9a90ab',align:'center',lineSpacing:7}).setOrigin(.5);this.menu.add(empty);this.menu.setVisible(true);return;}
    if(!this.inboxPage)this.inboxPage=0;const pageSize=5,pages=Math.max(1,Math.ceil(items.length/pageSize));this.inboxPage=Math.max(0,Math.min(pages-1,this.inboxPage));const visible=items.slice(this.inboxPage*pageSize,this.inboxPage*pageSize+pageSize);
    visible.forEach((item,i)=>{const base=GEAR_ALL.find(g=>g.id===item.baseId),tl=TIER_LABEL[item.grade]||TIER_LABEL.common,ry=y+i*68,g=this.add.graphics();g.fillStyle(0x241a33,.97);g.fillRoundedRect(14,ry,w-28,60,12);g.lineStyle(1.5,Phaser.Display.Color.HexStringToColor(tl.color).color,1);g.strokeRoundedRect(14,ry,w-28,60,12);this.menu.add(g);
      const key=base&&'gear_'+base.id,art=key&&this.textures.exists(key)?this.add.image(43,ry+30,key).setDisplaySize(42,42):this.add.text(43,ry+30,base?base.emoji:'🎁',{fontSize:'25px'}).setOrigin(.5);
      const nm=this.add.text(70,ry+9,(base?base.name:'Unknown')+' · iLv '+(item.itemLevel||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:tl.color}).setOrigin(0,0);
      const sub=this.add.text(70,ry+27,tl.name+' · '+(item.affixes||[]).length+' affix'+((item.affixes||[]).length===1?'':'es'),{fontFamily:'sans-serif',fontSize:'8.5px',color:'#bbaabd'}).setOrigin(0,0);this.menu.add([art,nm,sub]);
      const by=ry+8,bh=44,bw=56,cx=w-132,claim=this.add.graphics();claim.fillStyle(Save.gearInventoryFull()?0x3a3550:0x3f9160,1);claim.fillRoundedRect(cx,by,bw,bh,9);const ct=this.add.text(cx+bw/2,by+bh/2,Save.gearInventoryFull()?'Bag Full':'Claim',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:'#fff'}).setOrigin(.5);this.menu.add([claim,ct]);if(!Save.gearInventoryFull())this._zone(cx,by,bw,bh,()=>{if(Save.claimGearInbox(item.uid)){Sfx.progress('claim');this.buildGearInbox();}});
      const safe=gradeRank(item.grade)<3&&!item.locked&&!item.favorite,dg=this.add.graphics();dg.fillStyle(safe?0x8d4b3e:0x3a3550,1);dg.fillRoundedRect(w-70,by,bw,bh,9);const dt=this.add.text(w-42,by+bh/2,safe?('Dismantle\n🔩+'+gearDismantleValue(item)):'Protected',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7.5px',color:'#fff',align:'center'}).setOrigin(.5);this.menu.add([dg,dt]);if(safe)this._zone(w-70,by,bw,bh,()=>{const n=Save.dismantleGearInbox(item.uid);if(n){Sfx.equipment('dismantle');this.buildGearInbox();this.showBanner('🔩 Dismantled','Gear shards +'+n,1200);}});
    });
    if(pages>1){const py=y+visible.length*68+2,txt=this.add.text(w/2,py+13,'‹   '+(this.inboxPage+1)+' / '+pages+'   ›',{fontFamily:'sans-serif',fontSize:'11px',color:'#c7bdd6'}).setOrigin(.5);this.menu.add(txt);this._zone(w/2-70,py,55,26,()=>{this.inboxPage=(this.inboxPage-1+pages)%pages;this.buildGearInbox();});this._zone(w/2+15,py,55,26,()=>{this.inboxPage=(this.inboxPage+1)%pages;this.buildGearInbox();});}
    this.menu.setVisible(true);
  }
  // v4.49: forgeLegend ถูกถอดออก — Legend เป็น drop-only (ดรอปในด่าน/นรก) เท่านั้น
  // 🎲 สุ่มคุณสมบัติเสริม (affix) ของชิ้นที่สวมในช่องนี้ใหม่ (loot chase)
  _craftContext(){const slot=this.gearSlot||'weapon',item=Save.gearItem(this.craftSelectedUid||this.gearSelectedUid)||Save.equippedGearItem(slot),base=item&&GEAR_ALL.find(g=>g.id===item.baseId);return{slot,item,base};}
  // 🎲 คราฟต์แบบสุ่ม: ผู้เล่นเห็นแค่ว่าเป็นอะไรได้บ้าง → ใช้ currency แล้วสุ่ม stat มา 1 อัน แล้วไฮไลท์อันที่ติด
  // v8.0.83 Simple Forge (docs/FORGE_SIMPLE.md): Add = เลือก 1 ใน 3 (ข้อเสนอเก็บในชิ้นนั้น กันสุ่มใหม่) · Upgrade = +1 ดาว · Remove ฟรี (แตะ 2 ครั้ง)
  _forgeItem(){const {item}=this._craftContext();return item&&!item.locked&&!GEAR_ALL.some(b=>b.id===item.baseId&&b.tier==='start')?item:null;}
  _forgePay(item,key='transmute',price=null){const p=price??forgePrice(item),have=Save.currency(key),d=currencyDef(key)||{};if(have<p){Sfx.menuCue?.('forge_no_points')||Sfx.error();this.showBanner((d.emoji||'🟢')+' Need '+p+' '+(d.name||key),'You have '+have+' · '+(key==='transmute'?'find more in stages, chests and the Bazaar':'drops from harder fights and League missions'),1700);return 0;}return p;}
  _forgeDone(item,price,kind,title,before,na,noCraft,key='transmute'){const cur=Save.data.currency||(Save.data.currency={});if(price){cur[key]=Save.currency(key)-price;if(!noCraft)item.crafts=(Number(item.crafts)||0)+1;}item.craftedAt=Date.now();this.gearSelectedUid=item.uid;this._forgePanel=null;this._forgeRm=null;Save.save();
    const m=na&&affixDef(na.id);this._craftRolledId=m?m.id:null;this._craftResult={uid:item.uid,title,before,after:m?modLine(m,na.v)+' · '+tierStarText(m,na.t):'Empty'};
    try{Sfx.menuCue?.(({add:'forge_roll_good',bad:'forge_roll_bad',up:'forge_lv_up',remove:'forge_remove_paid'})[kind],.45)||Sfx.menuCue?.(kind==='up'?'forge_star_up':kind==='bad'?'forge_no_points':'forge_'+kind,.45)||Sfx.craft(kind==='up'?'reroll':'rare');}catch(e){} if(kind!=='remove')this.screenFlash?.(kind==='bad'?0xff5d6a:0xffffff,.34,240);
    this.showBanner(kind==='up'?'⬆ Upgraded':kind==='add'?'✨ Mod added':kind==='bad'?'💀 Bad mod!':'🗑 Mod removed',(m?modLine(m,na.v)+' · '+tierStarText(m,na.t)+'  ·  ':'')+((currencyDef(key)||{}).emoji||'🟢')+' '+Save.currency(key)+' left',1500);
    this.buildCraftBench();const R=this._forgeRowRects&&this._forgeRowRects[this.craftLineIndex],fy=R?R.y+R.h/2:this.H*.45;if(kind!=='remove'&&kind!=='bad')this.menuArtFx?.(kind==='up'?'vfx_star_up':'vfx_forge_hit',this.W/2,fy,120);}
  forgeOpenAdd(line){return this.forgeAdd(line);}   // v8.0.87 เจ้าของ: ไม่ให้เลือก 1 ใน 3 แล้ว — Add = สุ่ม mod ทันที
  forgeAdd(line){const item=Number.isInteger(line)&&line>=0&&line<6&&this._forgeItem();if(!item)return false;this.craftLineIndex=line;
    if(!forgeLineOpen(item,line)){Sfx.error();this.showBanner('🔒 Row locked','Merge to a higher rarity to open more rows',1500);return false;}const ls=forgeLines(item);if(ls[line])return false;
    if(!forgePool(item,line).length){Sfx.error();this.showBanner('No mods for this item','',1200);return false;}
    const p=this._forgePay(item);if(!p)return false;const mod=forgeRollMod(item,line);if(!mod)return false;const na=Object.assign(makeAffixAtStar(item,mod,1),{line});ls[line]=na;forgeSetLines(item,ls);
    this._forgeDone(item,p,mod.bad?'bad':'add','NEW MOD','Empty',na);return true;}
  forgeUpgrade(line){const item=Number.isInteger(line)&&line>=0&&line<6&&this._forgeItem();if(!item)return false;const ls=forgeLines(item),a=ls[line],cur=a&&affixDef(a.id);if(!cur)return false;this.craftLineIndex=line;
    if(cur.bad){Sfx.error();this.showBanner('💀 Bad mod','It can’t be upgraded — remove it instead',1600);return false;}
    const st=tierStars(cur,a.t);if(st>=forgeStarCap(item,cur)){Sfx.error();this.showBanner('⬆ '+forgeStarCapText(item,cur).split(' · ')[0],forgeNextStarLevel(item,cur)?'Next level at iLv '+forgeNextStarLevel(item,cur):'This mod is at its best',1700);return false;}
    const ck=forgeRowCur(line),p=this._forgePay(item,ck,forgeUpPrice(item,line));if(!p)return false;const before=modLine(cur,a.v)+' · '+tierStarText(cur,a.t),na=Object.assign(makeAffixAtStar(item,cur,st+1),{line});ls[line]=na;forgeSetLines(item,ls);
    if(line>0)this.a12?.('ui_forge_row_up',.4);   // v8.1.108 A12 แถวสูง (แถว 1 ใช้เสียงเดิม)
    this._forgeDone(item,p,'up','UPGRADE',before,na,false,ck);return true;}
  /* v8.1.84 เจ้าของ (Enchant): ย้าย mod 1 แถวไปแถวว่างของอีกชิ้น · ต้นทางเสีย mod · 1 Recipe Ink · Lv เกินเพดาน iLv ของชิ้นปลายทาง = ลดลงเท่าเพดาน */
  forgeMoveTargets(item,line){const a=forgeLines(item)[line],mod=a&&affixDef(a.id);if(!mod||mod.bad)return [];const out=[];for(const it of Save.gearItemsForSlot(null)){if(!it||it.uid===item.uid||it.locked||!GEAR_ALL.some(b=>b.id===it.baseId&&b.tier!=='start'))continue;const L=forgeLines(it);for(let i=0;i<L.length;i++){if(L[i]||!forgeLineOpen(it,i))continue;if(forgePool(it,i).some(m=>m.id===mod.id)){out.push({item:it,line:i});break;}}}return out;}
  forgeOpenMove(line){const item=Number.isInteger(line)&&this._forgeItem();if(!item)return false;const a=forgeLines(item)[line],mod=a&&affixDef(a.id);if(!mod)return false;this.craftLineIndex=line;if(mod.bad){Sfx.error();this.showBanner('💀 Bad mod','Bad mods can’t be moved — remove it instead',1500);return false;}
    if(Save.currency('recipeink')<FORGE_MOVE_COST){Sfx.error();this.showBanner('🖋️ Need '+FORGE_MOVE_COST+' Recipe Ink','Drops from harder fights and League missions',1600);return false;}const t=this.forgeMoveTargets(item,line);if(!t.length){Sfx.error();this.showBanner('🖋️ Nowhere to move it','Another item needs an empty open row that can take this mod',1700);return false;}
    this._forgePanel={type:'move',data:{uid:item.uid,line,targets:t},page:0};Sfx.select?.();this.buildCraftBench();return true;}
  forgeMove(srcUid,line,dstUid,dline){const src=Save.gearItem(srcUid),dst=Save.gearItem(dstUid);if(!src||!dst||src===dst||src.locked||dst.locked)return false;const ls=forgeLines(src),a=ls[line],mod=a&&affixDef(a.id);if(!mod||mod.bad)return false;const ld=forgeLines(dst);if(ld[dline]||!forgeLineOpen(dst,dline)||!forgePool(dst,dline).some(m=>m.id===mod.id))return false;
    if(!Save.spendCurrency('recipeink',FORGE_MOVE_COST)){Sfx.error();return false;}const cap=forgeStarCap(dst,mod),st=tierStars(mod,a.t);let na=Object.assign({},a,{line:dline}),capped=false;if(st>cap){na=Object.assign(makeAffixAtStar(dst,mod,cap),{line:dline});capped=true;}
    ls[line]=null;forgeSetLines(src,ls);ld[dline]=na;forgeSetLines(dst,ld);src.craftedAt=dst.craftedAt=Date.now();this._forgePanel=null;Save.save();const db=GEAR_ALL.find(g=>g.id===dst.baseId);
    try{Sfx.menuCue?.('forge_roll_good',.45)||Sfx.craft?.('rare');}catch(e){} this.showBanner('🖋️ Mod moved','→ '+(db?db.name:'item')+' · row '+(dline+1)+(capped?' · Lv lowered to '+cap+' (iLv cap)':''),1800);this.buildCraftBench(); this.a12?.('ui_forge_ink_move',.45); this.menuArtFx?.('vfx78_ink_move',this.W/2,this.H*.45,140);return true;}
  forgeRemove(line){const item=Number.isInteger(line)&&line>=0&&line<3&&this._forgeItem();if(!item)return false;const ls=forgeLines(item),a=ls[line],cur=a&&affixDef(a.id);if(!a)return false;this.craftLineIndex=line;
    const now=Date.now(),arm=this._forgeRm;if(!arm||arm.uid!==item.uid||arm.line!==line||now-arm.at>3000){this._forgeRm={uid:item.uid,line,at:now};Sfx.select?.();this.menuToast?.('Tap 🗑 again to remove this mod · 🟢'+forgePrice(item),'#ffb0a0');this.buildCraftBench();return false;}
    const p=this._forgePay(item);if(!p)return false;const before=cur?modLine(cur,a.v)+' · '+tierStarText(cur,a.t):'Unknown mod';ls[line]=null;forgeSetLines(item,ls);this._forgeDone(item,p,'remove','MOD REMOVED',before,null,true);return true;}   // v8.0.87 เจ้าของ: ลบต้องจ่าย Twist Cream (ราคาเท่าการตี 1 ครั้ง · ไม่นับเป็นการตี)
  affixHype(mod,rolled){ const t=rolled.t??10, wt=AFFIX_WEIGHT[mod.id]??100; let h=t<=1?3:t<=3?2:t<=5?1:0; if(wt<=30&&h<3)h++; return h; }
  // v4.46: mobile-first Gear → Affix → Roll layout with category clarity and roulette reveal.

  forgeFrame(key){
    const tex=this.textures.get('fg_ui_atlas'),r=FORGE_UI_FRAMES[key];if(r&&!tex.has(key))tex.add(key,0,...r);return r;
  }
  forgeChrome(key,x,y,w,h){
    if(this._jrSkin){ const row=c=>this.jrPanel('jr_row',c,x,y,w,h,.6);   /* v7.9.10 ใบ 27 */
      switch(key){ case 'panel': return h>50?this.jrPanel('jr_panel',0,x,y,w,h,.3):row(0); case 'panel_on': return row(1); case 'row_pick': return row(2); case 'chip': return row(0);
        case 'primary': return this.jrPanel('jr_btn_primary',0,x,y,w,h); case 'secondary': return this.jrPanel('jr_btn_secondary',0,x,y,w,h); case 'accent': return this.jrPanel('jr_btn_accent',0,x,y,w,h);
        case 'equipped': case 'choice': return this.jrPanel('jr_btn_pill',1,x,y,w,h); case 'slot': case 'slot_on': return this.jrImg('jr_slot',key==='slot_on'?2:0,x+w/2,y+h/2,w,h);
        case 'summary': return this.jrPanel('jr_forge_summary',0,x,y,w,h,.6); case 'footer': return this.jrPanel('jr_forge_footer',0,x,y,w,h,.6); } }
    if(this.textures.exists('fg_ui_atlas')&&this.add.container){
      const r=this.forgeFrame(key),sw=r[2],sh=r[3],edge=Math.min(key.startsWith('panel')?44:40,sw/3,sh/3),corner=Math.min(key.startsWith('panel')?12:10,w/2,h/2),xs=[0,edge,sw-edge,sw],ys=[0,edge,sh-edge,sh],xd=[0,corner,w-corner,w],yd=[0,corner,h-corner,h],group=this.add.container(x,y);
      for(let j=0;j<3;j++)for(let i=0;i<3;i++){const cw=xs[i+1]-xs[i],ch=ys[j+1]-ys[j],dw=xd[i+1]-xd[i],dh=yd[j+1]-yd[j];if(dw<=0||dh<=0)continue;const ax=dw/cw,ay=dh/ch;group.add(this.add.image(xd[i]-xs[i]*ax,yd[j]-ys[j]*ay,'fg_ui_atlas',key).setOrigin(0).setCrop(xs[i],ys[j],cw,ch).setScale(ax,ay));}
      this.menu.add(group);return group;
    }
    const g=this.add.graphics(),on=['primary','chip_on','panel_on'].includes(key),mint=['choice','equipped'].includes(key);g.fillStyle(mint?0x75ddb4:on?0x39243e:0x241c30,.98).fillRoundedRect(x,y,w,h,10);g.lineStyle(on?2:1,mint?0x75ddb4:on?0xff7ba8:0x564365,1).strokeRoundedRect(x,y,w,h,10);this.menu.add(g);return g;
  }
  forgeText(x,y,label,size=12,color='#fff0df',bold=false,width=0,origin=0){
    const t=this.add.text(x,y,String(label),{fontFamily:'NunitoUI, sans-serif',fontSize:size+'px',fontStyle:bold?'bold':'normal',color}).setOrigin(origin,0);
    if(width>0&&t.width>width){let s=String(label);while(s.length&&t.width>width){s=s.slice(0,-1);t.setText(s+'…');}}this.menu.add(t);return t;
  }
  forgeIcon(key,x,y,size,fallback='◇'){
    if(key.startsWith('fg_ui_')&&this.textures.exists('fg_ui_atlas')){const frame=key.slice(6),r=this.forgeFrame(frame),im=this.add.image(x,y,'fg_ui_atlas',frame).setScale(size/Math.max(r[2],r[3]));this.menu.add(im);return im;}
    if(this.textures.exists(key)){const im=this.add.image(x,y,key),src=this.textures.get?.(key)?.getSourceImage?.();if(src)im.setScale(size/Math.max(src.width,src.height));else im.setDisplaySize(size,size);this.menu.add(im);return im;}
    return this.forgeText(x,y-size/2,fallback,size,'#fff0df',true,0,.5);
  }
  forgeButton(x,y,w,h,label,fn,{kind='secondary',cost=null,icon=null,tag=null,disabled=false}={}){
    const paintedKey=tag==='up'&&String(label).startsWith('⭐')?'ic_star_up':tag==='remove'&&String(label).startsWith('🗑')?'ic_mod_remove':null;if(paintedKey&&this.tuHas?.(paintedKey)){const start=this.menu.list.length,bg=this.forgeButton(x,y,w,h,label.slice(String(label).startsWith('🗑')?2:1).trim(),fn,{kind,cost,icon,tag,disabled});this.menuArtFitButton(start,x,y,w,h);this.menuArtIcon?.(paintedKey,0,x+13,y+h/2,18)?.setAlpha(disabled?.45:1);return bg;}
    if(this._jrSkin){ const pager=label==='‹'||label==='›',k=pager?'pager':(tag==='tier'||tag==='tier_locked')?'accent':kind==='choice'?'pill2':kind==='primary'?'primary':'secondary';   /* v7.9.10 ใบ 27 */
      const kk=k==='primary'&&w<120?'secondary':k,ji={roll:6,auto:12,unlock:5}[tag]; let bg;
      if(cost&&!pager){ bg=this.jrButton(x,y,w,h,'',null,{kind:kk,disabled}); const ic=currencyDef(cost)?.asset,t=this.jrText(0,y+h/2,label,h>=40?13:12,disabled?'#d9cdb4':'#fff3dc',{stroke:'#1d2a17',keep:true}); if(t.width>w-40)t.setScale((w-40)/t.width); const tw=t.displayWidth,x0=x+w/2-(tw+20)/2; t.setX(x0+20+tw/2); if(ic)this.forgeIcon(ic,x0+8,y+h/2,16); }
      else bg=this.jrButton(x,y,w,h,label,null,{kind:kk,disabled,fontSize:h>=40?14:12,icon:kk==='primary'?ji??null:null});
      if(fn&&!disabled){this._zone(x,y,w,h,fn);this.tapZones[this.tapZones.length-1].tag=tag||label;} return bg; }
    const bg=this.forgeChrome(kind,x,y,w,h);if(disabled)bg.setAlpha(.45);const color=disabled?'#b9a7be':kind==='choice'?'#123b31':(this.controlTheme?.()?.text||'#fff1e7');
    if(cost){const lab=this.forgeText(0,y+(h-18)/2,label,15,color,true),lw=lab.width,total=16+4+8+5+lw,start=x+(w-total)/2;this.forgeIcon(currencyDef(cost)?.asset,start+8,y+h/2,16);this.forgeText(start+20,y+(h-16)/2,'1',12,color,true);lab.setX(start+33);}
    else if(icon){const im=this.forgeIcon(icon,x+w/2,y+h/2,22);if(disabled)im.setAlpha(.45);}
    else this.forgeText(x+w/2,y+(h-18)/2,label,h>=40?15:13,color,true,w-12,.5);
    if(fn&&!disabled){this._zone(x,y,w,h,fn);this.tapZones[this.tapZones.length-1].tag=tag||label;}return bg;
  }
  forgeResetPick(){this.craftLineIndex=0;this.forgePick=null;this._forgeRm=null;this._poolPage=0;this._familyPage=0;this.craftGroup=null;this._craftResult=null;this._craftRolledId=null;this._forgePanel=null;}
  forgeSelectItem(it){this.gearSlot=it.slot;this.craftSelectedUid=it.uid;this.gearSelectedUid=it.uid;this.forgeResetPick();this.buildCraftBench();}
  forgeOpenPanel(type,data=null){this._forgePanel={type,data,page:0};this.buildCraftBench();}
  buildCraftBench(){this._buildCraftBenchRaw();this.setupMenuScroll('craft');if(!this._inMenuBuild&&Save.data.gearTut===3)this.applyGearTut?.();}
  _buildCraftBenchRaw(){
    this.menu.y=0;this.menu.removeAll(true);this.tapZones=[];this._mScroll=0;this._mScrollMax=0;this._mVelocity=0;this._jrSkin=false;   /* v8.0.75 แผงม่วง */
    this._screenBg('Forge','screen_gear_power_789','gLoadout',false);   /* v8.0.83 Simple Forge ธีม Power */
    const L=forgeLayout(this.W,this.H);this._forgeLayout=L;const {header:H,slots:SL,summary:S,mods:M}=L,IL=null;
    const back=()=>{Sfx.back();this._forgePanel=null;const i=(this._navStack||[]).lastIndexOf('gLoadout');if(i>=0)this._navStack.length=i;this._curMenu='gLoadout';this.menuScreen='gLoadout';this.buildMenuScreen();};
    const J=this._jrSkin;
    if(J)this.jrHeader('Affix Forge',H.y+Math.min(44,H.h)/2,back,'forge_back');   /* v7.9.10 ใบ 27 หัวสมุด */
    else{ this.forgeButton(H.x,H.y,72,Math.min(44,H.h),'‹ Back',back,{tag:'forge_back'});this.tapZones[this.tapZones.length-1].back=true;
    this.forgeChrome('secondary',H.x+H.w-76,H.y+4,76,36);this.forgeIcon('hr_ic_candy',H.x+H.w-62,H.y+22,18,'🍬');
    const sugar=Save.data.sugar||0;this.forgeText(H.x+H.w-8,H.y+14,sugar>=10000?(sugar/1000).toFixed(1)+'K':sugar,13,this.headerTheme?.()?.currency||'#f4d9a1',true,52,1);
    this.forgeText(this.W/2,H.y+8,'Forge',this.W<350?19:22,this.headerTheme?.()?.text||'#fff1e7',true,H.w-152,.5); }
    let slot=this.gearSlot||'weapon';
    const items=Save.gearItemsForSlot(null).filter(it=>it&&GEAR_ALL.some(b=>b.id===it.baseId&&b.tier!=='start'));
    if(!items.length){const ey=S.y,eh=Math.min(300,M.y+M.h-S.y);this.pwCard(S.x,ey,S.w,eh,false);this.forgeText(S.x+12,ey+20,'No craftable gear',16,'#fff0df',true,S.w-24);this.forgeText(S.x+12,ey+48,'Find gear in stages or the Bazaar',12,'#c5b6ce',false,S.w-24);this.pwArt?.('pw_empty_forge',S.x+S.w/2,ey+Math.min(150,eh-110),Math.min(140,eh-140),Math.min(140,eh-140));const by=ey+eh-54;this.forgeButton(S.x+10,by,110,44,'Equipment',()=>{this.menuScreen='gear';this.buildMenuScreen();});this.forgeButton(S.x+130,by,100,44,'Bazaar',()=>{this.menuScreen='bazaar';this.buildMenuScreen();});this.menu.setVisible(true);return;}
    for(const it of items)if(it.forgeChoice){const k=curKey(it.forgeChoice.paid||'transmute');Save.data.currency=Save.data.currency||{};Save.data.currency[k]=(Save.data.currency[k]||0)+1;delete it.forgeChoice;Save.save();}   /* v8.0.33 ผลสุ่มค้างจากระบบเก่า → คืนสกุลเงิน */
    let selected=Save.gearItem(this.craftSelectedUid);if(!selected||!items.some(it=>it.uid===selected.uid)){selected=Save.equippedGearItem(slot);if(!selected||!items.some(it=>it.uid===selected.uid))selected=items[0];this.forgeResetPick();this.craftSelectedUid=selected.uid;}slot=this.gearSlot=selected.slot;
    const base=GEAR_ALL.find(b=>b.id===selected.baseId),isEq=Save.isGearEquipped(selected.uid),affs=forgeLines(selected);
    this.craftKind='mod';this.craftLineIndex=Math.max(0,Math.min(2,this.craftLineIndex||0));this.craftPageBySlot=this.craftPageBySlot||{};const ipages=Math.ceil(items.length/3);
    if(this._forgeShownUid!==selected.uid){this.craftPageBySlot[slot]=Math.floor(items.findIndex(it=>it.uid===selected.uid)/3);this._forgeShownUid=selected.uid;}
    const ipage=Math.max(0,Math.min(ipages-1,this.craftPageBySlot[slot]||0));
    if(IL){const inset=ipages>1?28:0,iw=(IL.w-2*inset-12)/3;
      items.slice(ipage*3,ipage*3+3).forEach((it,i)=>{const x=IL.x+inset+i*(iw+6),b=GEAR_ALL.find(g=>g.id===it.baseId);this.forgeChrome(it.uid===selected.uid?'panel_on':'panel',x,IL.y,iw,IL.h);this.forgeIcon('gear_'+b.id,x+iw/2,IL.y+(IL.h-14)/2,Math.min(32,IL.h-18),b.emoji);this.forgeText(x+iw/2,IL.y+IL.h-15,'iLv '+(it.itemLevel||1),11,'#c5b6ce',true,iw-8,.5);
        if(Save.isGearEquipped(it.uid)){this.forgeChrome('equipped',x+4,IL.y+3,Math.min(72,iw-8),18);this.forgeText(x+4+Math.min(72,iw-8)/2,IL.y+4,'✓ Equipped',10,'#123b31',true,Math.min(72,iw-8)-8,.5);}
        this._zone(x,IL.y,iw,IL.h,()=>this.forgeSelectItem(it));this.tapZones[this.tapZones.length-1].tag='item_'+it.uid;});
      if(ipages>1){this.forgeButton(IL.x,IL.y,24,IL.h,'‹',()=>{this.craftPageBySlot[slot]=(ipage-1+ipages)%ipages;this.buildCraftBench();},{tag:'gear_previous'});this.forgeButton(IL.x+IL.w-24,IL.y,24,IL.h,'›',()=>{this.craftPageBySlot[slot]=(ipage+1)%ipages;this.buildCraftBench();},{tag:'gear_next'});}
    }
    if(SL){ const order=['weapon','armor','gloves','amulet','ring','boots'],g=6,cw=(SL.w-g*5)/6;   /* v7.9.7 R1 แตะช่อง = ชิ้นที่ใส่อยู่ในช่องนั้น · แตะซ้ำ = ชิ้นถัดไปในช่องเดียวกัน */
      order.forEach((sl,i)=>{ const x=SL.x+i*(cw+g),list=items.filter(it=>it.slot===sl),on=sl===slot,eqIt=Save.equippedGearItem(sl),show=on?selected:(list.find(it=>eqIt&&it.uid===eqIt.uid)||list[0]),b=show&&GEAR_ALL.find(q=>q.id===show.baseId);
        this.forgeChrome(J?(on?'slot_on':'slot'):(on?'panel_on':'panel'),x,SL.y,cw,SL.h); if(b)this.forgeIcon('gear_'+b.id,x+cw/2,SL.y+SL.h/2,Math.min(SL.h-8,cw-8),b.emoji); else this.forgeText(x+cw/2,SL.y+(SL.h-14)/2,'—',12,'#6f6283',true,cw,.5);
        if(list.length>1)this.forgeText(x+cw-4,SL.y+2,String(list.length),9,'#ffd9a0',true,20,1);
        if(list.length)this._zone(x,SL.y,cw,SL.h,()=>{ let pick; if(on){const k=list.findIndex(it=>it.uid===selected.uid);pick=list[(k+1)%list.length];}else pick=list.find(it=>eqIt&&it.uid===eqIt.uid)||list[0]; this.forgeSelectItem(pick); }); if(list.length)this.tapZones[this.tapZones.length-1].tag='fslot_'+sl; }); }
    /* v8.0.83 การ์ดสรุป: ภาพของ ชื่อ ความหายาก iLv · Twist Cream ที่มี + ราคาครั้งถัดไป */
    const price=forgePrice(selected),have=Save.currency('transmute'),grade=gearGrade(selected),tl=TIER_LABEL[grade]||TIER_LABEL.common,sIx=S.x+30,sTx=S.x+60,rW=S.x+S.w-90-sTx;
    this.pwCard(S.x,S.y,S.w,S.h,true);this.pwArt?.('pw_hero_forge',S.x+S.w-S.h*.95,S.y+S.h/2,S.h*1.9,S.h*.95)?.setAlpha(.3);
    this.forgeIcon('gear_'+base.id,sIx,S.y+Math.min(S.h,86)/2,40,base.emoji);this.menuRarityFrame?.(selected,sIx-24,S.y+Math.min(S.h,86)/2-24,48,48);this.menuArtIcon?.('rar_gem',Math.min(3,Math.max(0,gradeRank(grade)-1)),sIx+22,S.y+12,16);
    this.forgeText(sIx,S.y+Math.min(S.h,86)/2+22,'⇄',11,'#ffd9a0',true,0,.5);this._zone(S.x,S.y,56,Math.min(S.h,86),()=>this.forgeOpenPanel('items',items));this.tapZones[this.tapZones.length-1].tag='gear_browse';
    this.forgeText(sTx,S.y+8,gearAffixName(base.name,affs),15,'#fff0df',true,rW);
    const im=ensureImplicit(selected),imp=im&&implicitDef(im.id);this.forgeText(sTx,S.y+30,tl.name+' · iLv '+(selected.itemLevel||1)+(imp?' · ◇ '+modLine(imp,im.v):''),11,tl.color||'#cfc1d4',true,rW);
    { const ca=this.forgeIcon('currency_twist_cream',sTx+8,S.y+56,16,'🟢');this.forgeText(sTx+20,S.y+48,have+'  ⭐'+Save.currency('starsugar')+'  🖋️'+Save.currency('recipeink'),12,have>=price?'#a8f0bf':'#ffb0a0',true,S.x+S.w-14-sTx-20); }   /* v8.1.84 กระเป๋าสกุลแถว */
    if(isEq){this.forgeChrome('equipped',S.x+S.w-80,S.y+8,70,26);this.forgeText(S.x+S.w-45,S.y+14,'Equipped',10,'#123b31',true,64,.5);}
    else this.forgeButton(S.x+S.w-80,S.y+6,70,36,'Equip',()=>{if(Save.equipGearInstance(slot,selected.uid))Sfx.equipment('equip');this.buildCraftBench();},{kind:'primary',tag:'equip'});
    /* v8.0.83 MOD ROWS (v8.0.87: แถวตามขั้น สูงสุด 6 · Lv แทนดาว · mod ไม่ดี · ลบเสีย Twist Cream): เต็ม = mod + Lv + ปุ่ม Upgrade (หรือเหตุผลที่ตัน) + 🗑 · ว่าง = + Add a mod · ล็อก = Merge to open */
    this.pwCard(M.x,M.y,M.w,M.h,false);{const ic=this.pwIcon?.('mod_add',M.x+20,M.y+15,20);this.pwSection('MOD ROWS',M.x+(ic?34:12),M.y+15);const pc=this.forgeText(M.x+M.w-12,M.y+8,'🟢'+price+' per craft',11,'#cfc1d4',true,M.w*.5,1);this.menuArtIcon?.('ic_forge_point',0,M.x+M.w-12-(pc.width||0)-10,M.y+15,14);}   /* ค้อน = ราคาต่อการตี */
    const fl0=affs.findIndex((_,i)=>!forgeLineOpen(selected,i)),firstLock=fl0>=0?fl0:(affs.length<6&&GRADE_NEXT[grade]?affs.length:-1),vis=[...affs.map((a,i)=>i).filter(i=>forgeLineOpen(selected,i)),...(firstLock>=0?[firstLock]:[])],nR=Math.max(1,vis.length),BAR=affs.some((a,i)=>a&&forgeLineOpen(selected,i)&&affixDef(a.id))?52:26,rowH=Math.max(40,Math.min(L.rowH,Math.floor((M.h-30-BAR-(nR-1)*6)/nR))),rg=Math.max(4,Math.min(10,Math.floor((M.h-30-BAR-nR*rowH)/nR))),rx=M.x+10,rw=M.w-20,lockedItem=!!selected.locked;this._forgeRowRects=[];
    const pill=(px,py,pw,ph,label,on,icon,fn,tag)=>{const g=this.add.graphics();g.fillStyle(on?0xf4d9a1:0x3a3046,on?1:.95).fillRoundedRect(px,py,pw,ph,ph/2).lineStyle(1,on?0xfff1e7:0x6d536d,on?.6:.8).strokeRoundedRect(px,py,pw,ph,ph/2);this.menu.add(g);
      const ic=icon&&this.pwIcon?.(icon,px+ph/2+2,py+ph/2,ph-6),tx=ic?px+ph+2:px+10,mw=px+pw-10-tx,t=this.forgeText(tx+mw/2,py+(ph-15)/2,label,12,on?'#3a2530':'#cfc1d4',true,0,.5);if(t.width>mw)t.setScale?.(mw/t.width);
      if(fn){this._zone(px,py,pw,ph,fn);this.tapZones[this.tapZones.length-1].tag=tag;}return g;};
    /* v8.1.132 เจ้าของ: แถว mod รก (ปุ่ม 3 ปุ่ม × 6 แถว) → แตะแถวเพื่อเลือก · ปุ่ม Upgrade / 🖋️ / 🗑 ของแถวที่เลือกอยู่แถบเดียวด้านล่าง */
    const filled=vis.filter(i=>{const a=affs[i];return a&&forgeLineOpen(selected,i)&&affixDef(a.id);}); let selL=this._forgeSel&&this._forgeSel.uid===selected.uid?this._forgeSel.line:null; if(!filled.includes(selL))selL=filled.length?filled[0]:null; this._forgeSel=selL==null?null:{uid:selected.uid,line:selL};
    let ry=M.y+30;vis.forEach(i=>{const a=affs[i],open=forgeLineOpen(selected,i),mod=a&&affixDef(a.id),bad=!!mod?.bad,isSel=i===selL,st=mod?tierStars(mod,a.t):0,col=bad?'#ff7a85':mod?(MOD_TIER_COLOR[st]||'#fff0df'):'#a99fbb',g=this.add.graphics();this._forgeRowRects[i]={x:rx,y:ry,w:rw,h:rowH};
      g.fillStyle(bad?0x3a1e26:isSel?0x3d2f4a:mod?0x2f2438:0x221a2b,.97).fillRoundedRect(rx,ry,rw,rowH,12).lineStyle(isSel?2.6:1,isSel?0xf4d9a1:0x6d536d,isSel?1:.55).strokeRoundedRect(rx,ry,rw,rowH,12); if(mod)g.fillStyle(Phaser.Display.Color.HexStringToColor(col).color,1).fillRoundedRect(rx+3,ry+6,4,rowH-12,2); this.menu.add(g);   /* v8.1.133 สีระดับเป็นแถบซ้าย แทนกรอบสีทั้งแถว */
      this.forgeText(rx+10,ry+4,'MOD '+(i+1)+(bad?'  ·  💀 BAD':mod?'  ·  '+'●'.repeat(Math.min(st,10))+'○'.repeat(Math.max(0,Math.min(10,forgeStarCap(selected,mod))-Math.min(st,10))):''),10,bad?'#ff9aa3':mod?col:'#bfaecd',true,rw*.6);   /* v8.1.133 Lv เป็นจุด ●●●○○ */
      const two=rowH>=66,ph=two?Math.max(26,Math.min(34,rowH-42)):Math.min(34,rowH-14),py=ry+rowH-ph-6,pw=Math.min(190,Math.floor(rw*.5));
      if(mod){ drawForgeModIcon(this,mod,rx+22,ry+rowH/2+6,24);
        this.forgeModText?.(rx+40,ry+Math.min(19,rowH-20),mod,a.v,col,rw-50);   /* v8.1.133 ตัวเลขม็อดเด่น (ขาวหนา) · ข้อความเต็มกว้างแถว */
        if(isSel)this.forgeText(rx+rw-10,ry+4,'▼ actions below',9,'#f4d9a1',true,rw*.4,1);
        this._zone(rx,ry,rw,rowH,()=>{ if(this._forgeSel?.line===i)return; Sfx.select?.(); this._forgeSel={uid:selected.uid,line:i}; this._forgeRm=null; this.buildCraftBench(); }); this.tapZones[this.tapZones.length-1].tag='row_'+i; }
      else if(open){ this.forgeText(rx+10,ry+Math.min(21,rowH-20),'Empty',13,'#a99fbb',true,rw-pw-30);
        pill(rx+rw-pw-6,py,pw,ph,'+ Add random mod · 🟢'+price,!lockedItem&&have>=price,'mod_add',null,null);
        if(!lockedItem){this._zone(rx,ry,rw,rowH,()=>this.forgeAdd(i));this.tapZones[this.tapZones.length-1].tag='add_'+i;} }
      else{ const need=GRADE_ORDER.find(g=>(RAR_LINES[g]||0)>i);this.forgeText(rx+10,ry+Math.min(21,rowH-20),'🔒 Merge to open',13,'#a99fbb',true,rw-20);this.forgeText(rx+rw-10,ry+(rowH-14)/2,need?'Needs '+(TIER_LABEL[need]||{name:need}).name+'+':'',11,'#8f83a3',true,rw*.4,1);
        this._zone(rx,ry,rw,rowH,()=>{Sfx.select?.();this._mergeMain=selected.uid;this._mergeF=null;this._mergeCarry=undefined;this._mergeBack='craft';this.menuScreen='merge';this.buildMenuScreen();});this.tapZones[this.tapZones.length-1].tag='merge_'+i; }
      ry+=rowH+rg;});
    if(lockedItem)this.forgeButton(rx,Math.min(ry,M.y+M.h-50),rw,44,'🔓 Unlock to craft',()=>{if(Save.gearItem(selected.uid)){Save.toggleGearLock(selected.uid);Sfx.equipment('unlock');}this.buildCraftBench();},{kind:'primary',tag:'unlock'});
    else if(selL!=null){ const i=selL,a=affs[i],mod=affixDef(a.id),bad=!!mod.bad,st=tierStars(mod,a.t),cap=forgeStarCap(selected,mod),rm=this._forgeRm&&this._forgeRm.uid===selected.uid&&this._forgeRm.line===i,ph=40,py=M.y+M.h-ph-8,bx=rx+rw-44,mx=bx-46,pw=(bad?bx:mx)-rx-8;
      this.forgeText(rx+4,py-15,'MOD '+(i+1)+' · '+(bad?'💀 BAD':'Lv '+st+' / '+cap),10,bad?'#ff9aa3':'#f4d9a1',true,rw*.6);
      if(bad)pill(rx,py,pw,ph,'Remove it with 🗑',false,null,()=>this.forgeUpgrade(i),'cap_'+i);
      else if(st>=cap)pill(rx,py,pw,ph,forgeStarCapText(selected,mod),false,null,()=>this.forgeUpgrade(i),'cap_'+i);
      else { const ck=forgeRowCur(i),up=forgeUpPrice(selected,i); pill(rx,py,pw,ph,'Upgrade · '+((currencyDef(ck)||{}).emoji||'🟢')+up,Save.currency(ck)>=up,'star_up',()=>this.forgeUpgrade(i),'up_'+i); }
      if(!bad){ const mg=this.add.graphics();mg.fillStyle(0x23314a,1).fillRoundedRect(mx,py,40,ph,10).lineStyle(1,0x7fd8ff,.7).strokeRoundedRect(mx,py,40,ph,10);this.menu.add(mg);this.forgeText(mx+20,py+(ph-15)/2,'🖋️',13,'#fff0df',true,0,.5);this._zone(mx-2,py-4,44,ph+8,()=>this.forgeOpenMove(i));this.tapZones[this.tapZones.length-1].tag='mv_'+i; }
      const bg=this.add.graphics();bg.fillStyle(rm?0x8d3b3e:0x2a2134,1).fillRoundedRect(bx,py,40,ph,10).lineStyle(1,rm?0xffb0a0:0x6d536d,.8).strokeRoundedRect(bx,py,40,ph,10);this.menu.add(bg);
      if(!this.pwIcon?.('mod_remove',bx+20,py+ph/2,ph-10))this.forgeText(bx+20,py+(ph-15)/2,'🗑',13,'#fff0df',true,0,.5);
      this._zone(bx-2,py-4,46,ph+8,()=>this.forgeRemove(i));this.tapZones[this.tapZones.length-1].tag='rm_'+i;
      if(rm)this.forgeText(rx+rw-4,py-15,'Tap 🗑 again · 🟢'+price,10,'#ffb0a0',true,rw*.5,1); }
    else{const t=this.forgeText(M.x+M.w/2,M.y+M.h-20,'Add / 🗑 = 🟢 · Upgrade: row 1 🟢 · row 2 🍓 · row 3 🍯 · rows 4–6 ⭐ · 🖋️ = move a mod',10,'#9a8aa7',false,0,.5);if(t.width>M.w-16)t.setScale?.((M.w-16)/t.width);}
    if(this._forgePanel)this.drawForgePanel(selected,items);this.menu.setVisible(true);
  }
  /* v8.1.133 เจ้าของ: ม็อดอ่านยาก → แยกตัวเลขเป็นสีขาวตัวโต ส่วนข้อความใช้สีระดับ · ยาวเกินย่อทั้งชุด (ไม่ต่ำกว่า 75%) แล้วค่อยตัดท้าย */
  forgeModText(x,y,mod,v,col,maxW){ const line=modLine(mod,v),f=typeof mod.fmt==='function'?String(mod.fmt(v)):String(v??''),at=f?line.indexOf(f):-1; if(at<0){ const t=this.forgeText(x,y,line,13,col,true,0); if(t.width>maxW){ const k=Math.max(.75,maxW/t.width); t.setScale?.(k); let q=String(t.text); while(q.length>4&&t.width*k>maxW){ q=q.slice(0,-1); t.setText(q+'…'); } } return [t]; }
    const parts=[[line.slice(0,at),13,col],[f,15,'#ffffff'],[line.slice(at+f.length),13,col]].filter(p=>p[0]),objs=[]; let cx=x; for(const [tx,fs,c] of parts){ const t=this.forgeText(cx,y+(fs===15?-1:0),tx,fs,c,true,0); objs.push(t); cx+=t.width||0; }
    const total=cx-x; if(total>maxW){ const k=Math.max(.75,maxW/total); let px=x; for(const t of objs){ t.setScale?.(k); t.x=px; px+=(t.width||0)*k; } } return objs; }
  drawForgePanel(selected,items){   // v8.0.83 เหลือแค่ตัวเลือกชิ้น (⇄) · odds/families/details ของระบบเก่าเอาออก
    const state=this._forgePanel;if(state&&state.type==='move')return this.drawForgeMovePanel(selected,state);if(!state||state.type!=='items'){this._forgePanel=null;return;}const w=this.W,h=this.H,pw=Math.min(w-28,460),ph=Math.min(h-32,430),x=(w-pw)/2,y=(h-ph)/2;
    const shade=this.add.rectangle(0,0,w,h,0x0b0711,.88).setOrigin(0);shade._menuBackdrop=true;this.menu.add(shade);this.pwCard(x,y,pw,ph,false);this.tapZones=[];
    const close=()=>{this._forgePanel=null;this.buildCraftBench();};this.forgeButton(x+pw-78,y+10,66,32,'Close',close,{tag:'panel_close'});this.tapZones[this.tapZones.length-1].back=true;
    const rows=items,per=Math.max(1,Math.floor((ph-104)/54)),rh=54,pages=Math.max(1,Math.ceil(rows.length/per)),p=Math.min(Math.max(0,state.page||0),pages-1),top=y+60;
    this.forgeText(x+12,y+16,'Choose gear',16,'#fff0df',true,pw-100);
    rows.slice(p*per,p*per+per).forEach((row,i)=>{const yy=top+i*rh,b=GEAR_ALL.find(g=>g.id===row.baseId),tl=TIER_LABEL[gearGrade(row)]||TIER_LABEL.common;this.pwCard(x+10,yy,pw-20,rh-4,row.uid===selected.uid);this.forgeIcon('gear_'+b.id,x+30,yy+24,30,b.emoji);this.forgeText(x+52,yy+4,b.name,13,'#fff0df',true,pw-72);this.forgeText(x+52,yy+25,tl.name+' · iLv '+(row.itemLevel||1)+(Save.isGearEquipped(row.uid)?' · Equipped':''),12,tl.color||'#9fd4bc',false,pw-72);this._zone(x+10,yy,pw-20,rh-4,()=>this.forgeSelectItem(row));this.tapZones[this.tapZones.length-1].tag='picker_'+row.uid;});
    const py=y+ph-42;this.forgeText(w/2,py+8,(p+1)+' / '+pages,13,'#c5b6ce',true,0,.5);this.forgeButton(w/2-80,py,36,32,'‹',()=>{state.page=(p-1+pages)%pages;this.buildCraftBench();},{disabled:pages===1,tag:'panel_previous'});this.forgeButton(w/2+44,py,36,32,'›',()=>{state.page=(p+1)%pages;this.buildCraftBench();},{disabled:pages===1,tag:'panel_next'});
  }
  drawForgeMovePanel(selected,state){const w=this.W,h=this.H,pw=Math.min(w-28,460),ph=Math.min(h-32,430),x=(w-pw)/2,y=(h-ph)/2,D=state.data||{},src=Save.gearItem(D.uid),a=src&&forgeLines(src)[D.line],mod=a&&affixDef(a.id);if(!mod){this._forgePanel=null;return;}
    const shade=this.add.rectangle(0,0,w,h,0x0b0711,.88).setOrigin(0);shade._menuBackdrop=true;this.menu.add(shade);this.pwCard(x,y,pw,ph,false);this.tapZones=[];const close=()=>{this._forgePanel=null;this.buildCraftBench();};this.forgeButton(x+pw-78,y+10,66,32,'Close',close,{tag:'panel_close'});this.tapZones[this.tapZones.length-1].back=true;
    this.forgeText(x+12,y+12,'🖋️ Move a mod · 1 Recipe Ink',15,'#fff0df',true,pw-100);this.forgeText(x+12,y+34,modLine(mod,a.v)+' · '+tierStarText(mod,a.t),12,'#9fe0ff',true,pw-24);
    const rows=(D.targets||[]).filter(t=>Save.gearItem(t.item.uid)),rh=54,per=Math.max(1,Math.floor((ph-120)/rh)),pages=Math.max(1,Math.ceil(rows.length/per)),p=Math.min(Math.max(0,state.page||0),pages-1),top=y+62;
    rows.slice(p*per,p*per+per).forEach((t,i)=>{const it=t.item,yy=top+i*rh,b=GEAR_ALL.find(g=>g.id===it.baseId),tl=TIER_LABEL[gearGrade(it)]||TIER_LABEL.common,cap=forgeStarCap(it,mod),low=tierStars(mod,a.t)>cap;this.pwCard(x+10,yy,pw-20,rh-4,false);this.forgeIcon('gear_'+b.id,x+30,yy+24,30,b.emoji);this.forgeText(x+52,yy+4,b.name+' → row '+(t.line+1),13,'#fff0df',true,pw-72);this.forgeText(x+52,yy+25,tl.name+' · iLv '+(it.itemLevel||1)+(low?' · Lv drops to '+cap:'')+(Save.isGearEquipped(it.uid)?' · Equipped':''),12,low?'#ffb0a0':(tl.color||'#9fd4bc'),false,pw-72);this._zone(x+10,yy,pw-20,rh-4,()=>this.forgeMove(src.uid,D.line,it.uid,t.line));this.tapZones[this.tapZones.length-1].tag='move_'+it.uid;});
    const py=y+ph-42;this.forgeText(w/2,py+8,(p+1)+' / '+pages,13,'#c5b6ce',true,0,.5);this.forgeButton(w/2-80,py,36,32,'‹',()=>{state.page=(p-1+pages)%pages;this.buildCraftBench();},{disabled:pages===1,tag:'panel_previous'});this.forgeButton(w/2+44,py,36,32,'›',()=>{state.page=(p+1)%pages;this.buildCraftBench();},{disabled:pages===1,tag:'panel_next'}); }
  /* ---- 🏪 NPC Bazaar (Phase 4): ซื้อ · เสี่ยงดวง · ขาย (single-player) ---- */
  // stock หมุนเวียนตาม bazaarSeed (เปลี่ยนทุกครั้งที่ผ่านด่าน) · อ้างอิง Zone Level ของด่านล่าสุด → ยิ่ง Zone สูง ของยิ่งดี
  // v8.0.25 เจ้าของ: ของ 4 ช่อง (ช่องแรก = ของแนะนำ ช่องที่สวมอ่อนสุด) + วัสดุ 2 ช่อง · ตามบทที่ถึง
  bazaarWeakSlot(){ const TB={start:-12,common:0,rare:5,epic:10,legend:15,mythic:20,ancient:25,divine:30}; let best=null,bs=1e9;
    for(const g of GEAR_SLOTS){ const it=Save.equippedGearItem?.(g.slot),sc=it?(it.itemLevel||1)+(TB[it.grade||it.tier]||0)+(it.enhanceLv||0):-99; if(sc<bs){bs=sc;best=g.slot;} } return best; }
  bazaarStock(){ const seed=(Save.data.bazaarSeed||0),zone=Math.max(1,Math.min(18,Save.data.bazaarZone||1)),rng=mulberry32(((seed*2654435761)>>>0)^0x9e37);
    const chapter=Math.max(1,Math.min(5,Math.floor((zone-1)/3)+1)); const bases=GEAR_ALL.filter(it=>it.tier!=='start'&&it.tier!=='legend'&&(it.chapter||1)<=chapter);
    const tierW=t=>({common:zone<6?5:2,rare:4,epic:zone>=7?4:zone>=4?2:1})[t]||1;
    const pick=(avail)=>{ let tot=0; avail.forEach(it=>tot+=tierW(it.tier)); let r=rng()*tot,p=avail[0]; for(const it of avail){ r-=tierW(it.tier); if(r<=0){p=it;break;} } return p; };
    const gear=[],used=new Set(),weak=this.bazaarWeakSlot?.(); let rec=-1;
    { const ws=bases.filter(it=>it.slot===weak); if(ws.length){ const p=pick(ws); used.add(p.id); gear.push(p); rec=0; } }
    for(let i=gear.length;i<4&&bases.length;i++){ const avail=bases.filter(it=>!used.has(it.id)); if(!avail.length)break; const p=pick(avail); used.add(p.id); gear.push(p); }
    const cur=[{key:'transmute',qty:1+Math.floor(rng()*3)},{key:'transmute',qty:3+Math.floor(rng()*3)}];   // v8.0.83 เหลือ Twist Cream อย่างเดียว · 2 ขนาด
    return {gear,cur,zone,chapter,rec,weak}; }
  bazaarProductCard(x,y,w,h,product){
    const g=this.add.graphics(),color=product.color||0xa88bcd;
    g.fillStyle(0x251b31,.98);g.fillRoundedRect(x,y,w,h,12);g.lineStyle(1.5,color,product.sold?.35:.85);g.strokeRoundedRect(x,y,w,h,12);this.menu.add(g);
    const size=Math.min(58,h*(h<110?.29:.40)),key=this.textures.exists(product.art)?product.art:'prize_chest';
    const icon=this.add.image(x+w/2,y+size/2+9,key).setDisplaySize(size,size).setAlpha(product.sold?.35:1);
    const name=this.add.text(x+w/2,y+size+13,product.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff0dc',align:'center',wordWrap:{width:w-12},maxLines:1}).setOrigin(.5,0);
    const desc=this.add.text(x+w/2,y+h-42,h<110?'':product.desc||'',{fontFamily:'sans-serif',fontSize:'8px',color:'#c5b5d1',align:'center',wordWrap:{width:w-12},maxLines:1}).setOrigin(.5);
    const price=this.add.text(x+w/2,y+h-20,product.sold?'SOLD':product.price,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:product.sold?'#75697e':product.afford===false?'#f295a8':'#a8edc6'}).setOrigin(.5);
    this.menu.add([icon,name,desc,price]);
    if(product.alt&&!product.sold){ const bw=Math.min(w-24,150),bh=34,bx=x+(w-bw)/2,by=y+h*.52-bh/2,ag=this.add.graphics();ag.fillStyle(0x3a2a14,1);ag.fillRoundedRect(bx,by,bw,bh,10);ag.lineStyle(2,0xffd166,.95);ag.strokeRoundedRect(bx,by,bw,bh,10);
      const at=this.add.text(bx+bw/2,by+bh/2,product.alt.label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffd166'}).setOrigin(.5);this.menu.add([ag,at]);this._zone(bx,by,bw,bh,product.alt.fn);
      if(product.fn){this._zone(x,y,w,by-y-4,product.fn);this._zone(x,by+bh+4,w,y+h-(by+bh+4),product.fn);} }
    else if(!product.sold&&product.fn)this._zone(x,y,w,h,product.fn);
  }
  /* v7.9.77 เจ้าของ: หีบแบบเกมทั่วไป (หีบเงิน / หีบทอง) แลกด้วย 🧶 Thread · แตะหีบ = สุ่มอุปกรณ์ · หีบเงินฟรีวันละ 1 · หีบทองการันตี Legend ทุก 10 ครั้ง · ต่อไปเป็นจุดขาย Thread (IAP) */
  loadChestArt(){ if(this._chArt)return; const miss=CHEST_KEYS.filter(k=>!this.realTex(k)); if(!miss.length)return; this._chArt=true;
    try{ this.ensureGroup(k=>miss.includes(k),()=>{ this._chArt=false; if(this.state==='menu'&&this.menuScreen==='bazaar'&&!this._chestOpen&&!this._gachaBusy)this.buildMenuScreen(); },{all:true,quiet:true}); }catch(e){ this._chArt=false; } }
  /* v8.0.25 เจ้าของ: แท็บหีบ = หีบเงิน · หีบทอง (เห็นประกัน Legend) · หีบ Sugar (Gacha เดิม) */
  buildChestShop(top){ this.loadChestArt(); const w=this.W,h=this.H,d=Save.data,day=localDayKey(),free=d.chestFreeDay!==day,thr=Save.threads(),sug=d.sugar||0,pity=Math.max(1,CHEST_PITY-(d.chestPity||0));
    this.menu.add(this.add.text(w/2,top,'🧶 Thread '+thr,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#cfe9ff',stroke:'#1a0f1e',strokeThickness:4}).setOrigin(.5,0));
    const band=Math.max(0,Math.min(gachaMaxBand(),this._gachaLevel||0)),gb=GACHA_LEVELS[band];
    const list=CHESTS.concat([{id:'sugar',name:'Sugar Chest',sugar:gb.cost,odds:[['common',.68],['rare',.29],['epic',.03]],tint:0xff9ad5,bg:0x3a1f33,edge:0xff9ad5,title:'#ffd0e8'}]);
    const cw=Math.min(w-28,400),cx=(w-cw)/2,ch=Math.max(124,Math.min(176,(h-top-64)/list.length-10)); let y=top+28;
    list.forEach(c=>{ const isS=c.id==='sugar',isFree=c.id==='silver'&&free,cs=isS?c.sugar:chestSugarCost(c),can=isS?sug>=c.sugar:(isFree||sug>=cs),g=this.add.graphics(); g.fillStyle(0x000000,.35).fillRoundedRect(cx+3,y+5,cw,ch,20);
      const card=this.tuPanel('bz_chest_card',0,cx,y,cw,ch); if(card){ g.destroy(); this.menu.add(card); } else { g.fillStyle(c.bg,.96).fillRoundedRect(cx,y,cw,ch,20).lineStyle(3,c.edge,1).strokeRoundedRect(cx,y,cw,ch,20); this.menu.add(g); }
      const isz=Math.min(ch*.7,110),im=this.chestVisual(isS?{id:'sugar'}:c,cx+isz*.5+14,y+ch/2,isz); if(isS&&im.setTint)im.setTint(0xffb8de); this.menu.add(im);
      this.hubTween({targets:im,y:y+ch/2-5,duration:1300+(c.id==='gold'?200:isS?400:0),yoyo:true,repeat:-1,ease:'Sine.inOut'});
      const tx=cx+isz+24,tw=cw-isz-(card?40:34),small=ch<150;
      { const nt=this.add.text(tx,y+(card?18:14),c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(small?16:19)+'px',color:c.title,stroke:'#1a0f1e',strokeThickness:3}); let f=small?16:19; while(nt.width>tw&&f>12)nt.setFontSize(--f+'px'); this.menu.add(nt); }
      const od=this.add.text(tx,y+(small?38:44),c.odds.map(([t,p])=>TIER_LABEL[t].name+' '+(p<.01?(p*100).toFixed(1):Math.round(p*100))+'%').join(' · '),{fontFamily:'sans-serif',fontSize:(small?10:11)+'px',color:'#e8ddf2',wordWrap:{width:tw}}); this.menu.add(od);
      const ly=y+(small?40:48)+od.height;
      if(c.id==='gold'){ const lt=this.add.text(tx,ly,'🌟 '+pity+' more '+(pity===1?'open':'opens')+' → guaranteed Legend',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffe08a',wordWrap:{width:tw}}); this.menu.add(lt);
        const pg=this.add.graphics(),pw=Math.min(tw,CHEST_PITY*13),pc=(d.chestPity||0)%CHEST_PITY,pby=y+ch-(ch<150?34:40)-12; if(ly+lt.height+11<pby)for(let k=0;k<CHEST_PITY;k++){   /* v8.0.75 ไม่มีที่ = ไม่วาดแถบ (เดิมทับปุ่ม) */ const px=tx+k*(pw/CHEST_PITY); pg.fillStyle(k<pc?0xffc43d:0x2a1f12,1).fillRoundedRect(px,ly+lt.height+3,pw/CHEST_PITY-3,6,2); } this.menu.add(pg); }
      else this.menu.add(this.add.text(tx,ly,isS?'Gear iLv '+gb.lo+'–'+gb.hi+' · paid with Sugar':'Daily free chest · resets every day',{fontFamily:'sans-serif',fontSize:'11px',color:isS?'#ffd0e8':'#ffe08a',wordWrap:{width:tw}}));
      const bh=small?34:40,by=y+ch-bh-12,bw=isS&&gachaMaxBand()>0?tw-50:tw,bg=this.add.graphics(); bg.fillStyle(can?c.edge:0x5a4d66,1).fillRoundedRect(tx,by,bw,bh,14).fillStyle(0xffffff,.18).fillRoundedRect(tx+3,by+3,bw-6,bh*.42,10); this.menu.add(bg);
      { const bt=this.add.text(tx+bw/2,by+bh/2,isFree?'🎁 OPEN FREE':'Open · 🍬 '+cs,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#1a0f1e'}).setOrigin(.5); let f=15; while(bt.width>bw-12&&f>10)bt.setFontSize(--f+'px'); this.menu.add(bt); }
      if(isFree)this.drawBadgeDot(this.menu,tx+bw-4,by+4);
      const open=()=>{ if(!can){ Sfx.error?.(); this.menuToast('🍬 Need '+cs+' Sugar — earn it from stages and missions','#ffb3c8'); return; } if(isS)this.openGachaReveal(); else this.openChest(c,isFree); };
      if(isS&&gachaMaxBand()>0){ const ax=tx+bw+6,ag=this.add.graphics(); ag.fillStyle(0x3a1f33,1).fillRoundedRect(ax,by,44,bh,12).lineStyle(2,0xff9ad5,1).strokeRoundedRect(ax,by,44,bh,12); this.menu.add(ag); this.menu.add(this.add.text(ax+22,by+bh/2,'iLv\n►',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd0e8',align:'center'}).setOrigin(.5));
        this._zone(cx,y,ax-cx-2,ch,open); this.tapZones[this.tapZones.length-1].tag='chest_sugar'; this._zone(ax,by,44,bh,()=>{ this._gachaLevel=(band+1)%(gachaMaxBand()+1); Sfx.select&&Sfx.select(); this.buildBazaar(); }); this.tapZones[this.tapZones.length-1].tag='sugar_band'; }
      else { this._zone(cx,y,cw,ch,open); this.tapZones[this.tapZones.length-1].tag='chest_'+c.id; }
      y+=ch+10; });
    this.menu.add(this.add.text(w/2,y+2,'Chests drop gear for your current item level · paid with Sugar you earn by playing',{fontFamily:'sans-serif',fontSize:'10px',color:'#c5b5d1',align:'center',wordWrap:{width:w-36}}).setOrigin(.5,0)); }
  chestVisual(c,x,y,sz){ for(const k of ['chest_'+c.id,'prize_chest','chest']){ if(this.realTex(k)){ const im=this.add.image(x,y,k); im.setScale(sz/Math.max(im.width,im.height)); if(k!=='chest_'+c.id&&c.id==='silver')im.setTint(0xd8e2f0); return im; } }
    return this.add.text(x,y,'🧰',{fontSize:Math.round(sz*.7)+'px'}).setOrigin(.5); }   // ใบสั่งอาร์ต 40 จะส่ง chest_silver/chest_gold
  /* v8.1.142 owner 🐞 "chest effects not grand": confetti + light rings by rarity (code-drawn, no new art) */
  chestSfxLoad(){ try{ const sc=this,keys=['chest_shake_build','chest_burst_common','chest_burst_rare','chest_burst_epic','chest_burst_legend','chest_confetti','chest_item_land','chest_duplicate'].map(k=>'sfx_'+k).filter(k=>ASSET_AUDIO[k]&&!sc.cache?.audio?.exists(k)); if(!keys.length||!sc.load?.audio)return; keys.forEach(k=>sc.load.audio(k,verUrl(ASSET_AUDIO[k]))); if(!sc.load.isLoading())sc.load.start(); }catch(e){} }
  chestBurst(x,y,color,tier){ if(!this.add||!this.tweens)return; const n={legend:40,epic:26,rare:16}[tier]||10,rings=tier==='legend'?3:tier==='epic'?2:1,cols=[color,0xffffff,0xfff1a8];
    for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2,d=110+Math.random()*(tier==='legend'?260:180),r=3+Math.random()*(tier==='legend'?7:5),dot=i%3===2?this.add.star(x,y,5,r*.6,r*1.4,cols[i%3]):this.add.circle(x,y,r,cols[i%3]); dot.setDepth?.(60); this.menu.add(dot);
      this.tweens.add({targets:dot,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d+40,alpha:0,scale:{from:1.2,to:.3},angle:Math.random()*360,duration:700+Math.random()*700,ease:'Cubic.out',onComplete:()=>dot.destroy()}); }
    for(let k=0;k<rings;k++){ const rg=this.add.circle(x,y,30,color,0).setStrokeStyle(6-k,color,.95); this.menu.add(rg); this.tweens.add({targets:rg,scale:tier==='legend'?9:6,alpha:0,delay:k*180,duration:750,ease:'Cubic.out',onComplete:()=>rg.destroy()}); }
    if(tier==='legend'||tier==='epic')this.time.delayedCall(220,()=>this.screenFlash?.(0xffffff,tier==='legend'?.45:.25,260)); }
  openChest(c,isFree){ if(this._gachaBusy)return; const d=Save.data; if(isFree==='weekly'||isFree==='gift'||isFree==='login'){ this._chestBack=isFree==='gift'?'achievements':isFree==='login'?'hub':'daily'; } else if(isFree){ d.chestFreeDay=localDayKey(); } else { const cs=chestSugarCost(c); if((d.sugar||0)<cs)return; d.sugar=(d.sugar||0)-cs; } (typeof DailyQ!=='undefined')&&DailyQ.tick('chest'); if(isFree!=='gift'&&isFree!=='weekly'&&isFree!=='login')d.chestsOpened=(d.chestsOpened||0)+1;
    let tier=pickWeighted(c.odds); if(!d.firstChestDone){ d.firstChestDone=1; tier='common'; }   /* v8.3.13 เจ้าของ: กล่องแรกของผู้เล่นใหม่ (ช่วงสอน) = ของ Common 1 ชิ้นเสมอ */
    else if(c.id==='silver'&&tier==='legend')(d.secrets||(d.secrets={})).silverLegend=1; if(c.id==='gold'){ d.chestPity=(d.chestPity||0)+1; if(tier==='legend'||d.chestPity>=CHEST_PITY){ tier='legend'; d.chestPity=0; } } Save.save();
    const lv=GACHA_LEVELS[Math.max(0,gachaMaxBand())],ilv=lv.lo+Math.floor(Math.random()*(lv.hi-lv.lo+1));
    this._gachaBusy=true; this.setMenuScroll(0); this.stopHubMotion?.(); this.menu.removeAll(true); this.tapZones=[]; this._chestOpen=true;
    const w=this.W,h=this.H,bg=this.add.rectangle(0,0,w,h,0x090510,.97).setOrigin(0),title=this.add.text(w/2,h*.14,c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:c.title}).setOrigin(.5);
    const ok='chest_'+c.id+'_open',anim=this.realTex(ok); if(anim)this.tuFrames(ok);
    const glow=this.add.image(w/2,h*.47,'vfx_glow').setScale(.4).setAlpha(.3).setTint(c.tint),chest=anim?this.add.image(w/2,h*.47,ok,'cell0').setDisplaySize(230,230):this.chestVisual(c,w/2,h*.47,170),cs=chest.scale;
    if(anim){ let t=620; [100,90,90,110,140].forEach((ms,i)=>{ t+=ms; this.time.delayedCall(t,()=>{ if(chest.active)chest.setFrame('cell'+(i+1)); }); }); }   // ใบ 40: สั่น → ฝาเด้ง → แสง → ค้างเปิด
    const status=this.add.text(w/2,h*.66,'Tap… the lid is shaking!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#c7bdd6'}).setOrigin(.5);
    glow.setVisible(false);this.menu.add(bg);this.revealBackdrop?.(this.menu,w,h);this.menu.add([title,glow,chest,status]); this.menu.setVisible(true); this.chestSfxLoad?.(); if(!(Sfx.orderCue?.('chest_shake_build',.5,.1)))Sfx.chest?.(); { const tt=this.add.text(w/2,Math.max(26,h*.065),'🧶 Thread '+Save.threads(),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#cfe9ff',stroke:'#1a0f1e',strokeThickness:4,backgroundColor:'#2a1d3acc',padding:{x:12,y:5}}).setOrigin(.5); this.menu.add(tt); this._chestThrTxt=tt; }   // v8.0.70 เจ้าของ: หน้าเปิดหีบบอก Thread ที่เหลือ
    this.tweens.add({targets:chest,angle:{from:-6,to:6},duration:80,yoyo:true,repeat:anim?3:10});
    if(!anim){ this.tweens.add({targets:chest,scale:{from:chest.scale,to:chest.scale*1.12},duration:1100,ease:'Quad.in'}); this.time.delayedCall(500,()=>this.screenShake?.(250,.004)); this.time.delayedCall(850,()=>this.screenShake?.(300,.008)); }   /* v8.1.142 owner 🐞: chest opening felt flat → tension builds before the pop */
    this.tweens.add({targets:glow,rotation:Math.PI*2,scale:2.4,alpha:{from:.2,to:.85},duration:1100,ease:'Cubic.in'});
    this.time.delayedCall(1150,()=>this.chestCine(tier,chest,glow,status,()=>{ let it=null; for(const t of [tier,'epic','rare','common']){ it=this.grantGear(t,{gacha:true,itemLevel:ilv}); if(it)break; } if(!it){ Save.addSugar(Math.round(chestSugarCost(c)*.5)); } if(this._chestThrTxt?.active)this._chestThrTxt.setText('🧶 Thread '+Save.threads());
      if(!status.active||this.state!=='menu'){ this._gachaBusy=false; this._chestOpen=false; return; }
      const t2=it?it.tier:'common',color=t2==='legend'?0xff8f3a:t2==='epic'?0xc9a3ff:t2==='rare'?0xffcf5a:0x8bd3a0,hex='#'+color.toString(16).padStart(6,'0');
      if(anim){ chest.setAngle(0); this.tweens.add({targets:chest,y:h*.57,scale:cs*.62,alpha:.85,duration:260}); status.setY(h*.71); } else this.tweens.add({targets:chest,scale:cs*1.25,alpha:0,angle:0,duration:220});
      { /* v8.1.143 code-drawn rays instead of vfx_chest_rays (-1.5 MB GPU) */ const ry=this.add.graphics({x:w/2,y:h*.47}); for(let i=0;i<12;i++){ const a=i*Math.PI/6,sp=.12; ry.fillStyle(color,i%2?.22:.38).beginPath().moveTo(0,0).lineTo(Math.cos(a-sp)*200,Math.sin(a-sp)*200).lineTo(Math.cos(a+sp)*200,Math.sin(a+sp)*200).closePath().fillPath(); } ry.setBlendMode(Phaser.BlendModes.ADD); this.menu.addAt(ry,2); this.tweens.add({targets:ry,rotation:Math.PI*2,duration:9000,repeat:-1}); this.tweens.add({targets:ry,scale:{from:.6,to:1},duration:420,ease:'Back.out'}); glow.setVisible(false); }
      const gArt=it?('gear_'+it.id):null; if(gArt&&this.textures.exists(gArt)){ const gi=this.add.image(w/2,h*.47,gArt).setDisplaySize(130,130),ts=gi.scaleX; gi.setScale(ts*.2); this.menu.add(gi); this.tweens.add({targets:gi,scaleX:ts,scaleY:ts,duration:360,ease:'Back.out'}); }
      glow.setTint(color).setScale(2.9).setAlpha(.9); this.screenFlash(color,t2==='legend'?.85:t2==='epic'?.65:.4,520); this.screenShake(t2==='legend'?620:300,t2==='legend'?.02:.008); this.chestBurst?.(w/2,h*.47,color,t2);
      /* v8.1.142 owner 🐞: chest sound did not fit → the rarity reveal stingers (box_reveal_*) instead of the generic clear/legend cue */ const tn=t2==='legend'?'legend':t2==='epic'?'epic':t2==='rare'?'rare':'common'; if(t2==='legend'||t2==='epic')this.time.delayedCall(120,()=>Sfx.orderCue?.('chest_confetti',.4,.1)); this.time.delayedCall(380,()=>Sfx.orderCue?.(it?'chest_item_land':'chest_duplicate',.45,.1));   /* v8.1.147 A14 */
      if(!(Sfx.orderCue?.('chest_burst_'+tn,t2==='legend'?.6:.5,.1))&&!(Sfx.orderCue?.('box_reveal_'+tn,t2==='legend'?.55:.45,.1))){ if(t2==='legend')Sfx.legend?.(); else Sfx.clear?.(); }
      title.setText(it?(t2==='legend'?'🌟 LEGEND 🌟':t2==='epic'?'✦ EPIC ✦':t2==='rare'?'★ RARE ★':'COMMON'):'All owned').setColor(hex);
      status.setText(it?(it.name+'\n'+TIER_LABEL[t2].name+gearDeliverySuffix(it)):'Refund 🍬'+Math.round(chestSugarCost(c)*.5)).setColor('#ffffff').setAlign('center').setFontSize('18px');
      const bw=Math.min(w-60,260),by=h*.82,btn=this.add.graphics(); btn.fillStyle(color,1).fillRoundedRect(w/2-bw/2,by-24,bw,48,16); const bt=this.add.text(w/2,by,'Collect',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#17101d'}).setOrigin(.5); this.menu.add([btn,bt]);
      this._gachaBusy=false; this._zone(w/2-bw/2,by-24,bw,48,()=>{ this._chestOpen=false; const bk=this._chestBack; this._chestBack=null; if(bk){ this.menuScreen=bk; } else { this._bazTab='chests'; this.menuScreen='bazaar'; } this.buildMenuScreen(); }); })); }
  /* v8.2.2+ เจ้าของ C3: ฉากเปิดหีบเท่ ๆ — ได้ Epic/Legend มีฉาก 1.4 วิ (Legend 1.8) ก่อนเปิด: จอมืด · หีบซูมเข้า · แสงสีระดับรั่วจากรอยแยกทีละเส้น · หัวใจเต้น 3 จังหวะ (สั่น+เสียงแหลมขึ้น) · แฟลชขาวแล้วค่อยเปิด · ระดับอื่นเปิดทันทีเหมือนเดิม · โค้ดล้วน ไม่มีอาร์ตใหม่ */
  chestCine(tier,chest,glow,status,done){ const big=tier==='legend'||tier==='epic'; if(!big||!this.add||!chest?.active)return done();
    const w=this.W,h=this.H,L=tier==='legend',col=L?0xff8f3a:0xc9a3ff,T=L?1800:1400,cx=chest.x,cy=chest.y,objs=[];
    const dim=this.add.rectangle(0,0,w,h,0x000000,0).setOrigin(0); this.menu.add(dim); objs.push(dim); this.tweens.add({targets:dim,fillAlpha:.72,duration:300});
    this.menu.bringToTop(glow); this.menu.bringToTop(chest); this.tweens.killTweensOf(chest); chest.setAngle(0);
    const sc=chest.scaleX; this.tweens.add({targets:chest,scaleX:sc*1.35,scaleY:sc*1.35,duration:T*.8,ease:'Sine.in'});
    glow.setVisible(true).setTint(col).setAlpha(.25).setScale(1.2); this.tweens.add({targets:glow,scale:3.2,alpha:.75,duration:T,ease:'Cubic.in'});
    const rays=this.add.graphics({x:cx,y:cy}); rays.setBlendMode(Phaser.BlendModes.ADD); this.menu.add(rays); objs.push(rays); this.menu.bringToTop(chest);
    const st={k:0},n=L?9:7,ang=Array.from({length:n},(_,i)=>i*Math.PI*2/n+Math.random()*.4);
    this.tweens.add({targets:st,k:1,duration:T,ease:'Quad.in',onUpdate:()=>{ if(!rays.active)return; rays.clear(); const lit=Math.ceil(st.k*n); for(let i=0;i<lit;i++){ const a=ang[i],len=60+st.k*260,sp=.03+.05*st.k; rays.fillStyle(i%2?0xffffff:col,.35+.4*st.k).beginPath().moveTo(0,0).lineTo(Math.cos(a-sp)*len,Math.sin(a-sp)*len).lineTo(Math.cos(a+sp)*len,Math.sin(a+sp)*len).closePath().fillPath(); } }});
    status.setText(L?'✦  Something legendary stirs…  ✦':'✦  Something rare stirs…  ✦').setColor(L?'#ffd08a':'#e3cfff'); this.menu.bringToTop(status);
    for(let i=0;i<3;i++)this.time.delayedCall(T*(.2+i*.25),()=>{ if(!chest.active)return; this.tweens.add({targets:chest,scaleX:'*=1.08',scaleY:'*=1.08',duration:90,yoyo:true}); this.screenShake?.(140+i*80,.004+i*.004); Sfx.orderCue?.('chest_shake_build',.35+i*.08,.05,1+i*.15)||Sfx.chest?.(); });
    this.time.delayedCall(T,()=>{ this.screenFlash?.(0xffffff,.9,380); for(const o of objs)if(o.active)this.tweens.add({targets:o,alpha:0,duration:260,onComplete:()=>o.destroy()}); if(chest.active)chest.setScale(sc); done(); }); }
  buildBazaar(){ this.chestSfxLoad?.();   /* v8.1.147 preload A14 chest sounds while browsing */
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Mochi Bazaar','screen_bazaar','gLoadout');
    /* v8.0.25 เจ้าของ: เหลือ 3 แท็บ — หีบ (เงิน/ทอง/Sugar) · ร้าน (ของ 4 + วัสดุ 2 รีเฟรชฟรีวันละครั้ง) · แลก (Trade-in + ขายวัสดุ) */
    const TAB={buy:'shop',orders:'shop',gamble:'chests',sell:'trade'},w=this.W,h=this.H,hs=this._hdrShift(),tab=this._bazTab=(typeof IAP_ENABLED!=='undefined'&&!IAP_ENABLED&&this._bazTab==='thread')?'chests':(TAB[this._bazTab]||this._bazTab||'chests'),top=(tab==='shop'?153:121)+hs;
    const noIap=typeof IAP_ENABLED!=='undefined'&&!IAP_ENABLED,bTabs=[['chests','Chests'],['shop','Shop'],['trade','Trade'],noIap?['wardrobe','Wardrobe']:['thread','🍭 Shop']];bTabs.forEach(([id,label],i)=>{const tw=(w-28)/bTabs.length;this.paintedNavButton(this.menu,14+tw*(i+.5),89+hs,tw-6,38,label,id===tab,()=>{ if(id==='wardrobe'){ this.menuScreen='wardrobe'; this.buildMenuScreen(); return; } this._bazTab=id;this.buildBazaar();},'tab_'+id);});   /* v8.1.149 เจ้าของ 🐞: ปิด IAP แล้วแท็บ Thread หาย → ทางเข้า Wardrobe (ร้านแฟชั่น) หายตาม · แทนด้วยแท็บ Wardrobe */
    if(tab==='chests'){ this.buildChestShop(top); this.menu.setVisible(true); return; }
    if(tab==='thread'){ this.buildThreadShop(top); this.menu.setVisible(true); return; }
    let y=top;
    const heading=(title)=>{this.menu.add(this.add.text(14,y,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe3ac'}));y+=23;};
    const grid=(products,cardH,cols)=>{cols=cols||(w>h?3:2);const gap=8,cw=(w-28-gap*(cols-1))/cols;products.forEach((p,i)=>this.bazaarProductCard(14+(i%cols)*(cw+gap),y+Math.floor(i/cols)*(cardH+gap),cw,cardH,p));y+=Math.ceil(products.length/cols)*(cardH+gap);};
    if(tab==='shop'){
      const st=this.bazaarStock(),bought=Save.data.bazaarBought||[],cols=w>h?4:2,rows=Math.ceil(st.gear.length/cols)+Math.ceil(st.cur.length/cols),cardH=Math.min(138,Math.max(70,(h-top-92)/rows-8));
      const fr=Save.bazaarFreeRefresh?.(),rc=Save.bazaarRefreshCost();this.paintedNavButton(this.menu,w-90,130+hs,152,28,fr?'🔄 Refresh · FREE':rc?'Refresh · 🍬 '+rc:'Restock tomorrow',false,()=>{const r=(fr||rc)&&Save.refreshBazaar();if(r){Sfx.clear();this.buildBazaar();}else this.menuToast(rc?'🍬 Need '+rc+' Sugar':'Restocks after a stage clear','#c5b5d1');});
      if(fr)this.drawBadgeDot(this.menu,w-18,118+hs);
      const SL=Object.fromEntries(GEAR_SLOTS.map(g=>[g.slot,g.label]));
      heading('Equipment · Chapter '+st.chapter);
      grid(st.gear.map((it,i)=>{const cost=GEAR_BUY[it.tier]||200,rec=i===st.rec;return{art:'gear_'+it.id,name:(rec?'⭐ ':'')+it.name,desc:rec?'Recommended · your weakest slot ('+(SL[it.slot]||it.slot)+')':TIER_LABEL[it.tier].name+' · '+(SL[it.slot]||'equipment'),color:rec?0xffd166:undefined,price:'🍬 '+cost,sold:bought.includes('g'+i),afford:(Save.data.sugar||0)>=cost,fn:()=>this.bazaarBuyGear(it.id,'g'+i,cost)};}),cardH,cols);
      heading('Crafting supplies');
      grid(st.cur.map((c,i)=>{const d=currencyDef(c.key),cost=(CURRENCY_BUY[c.key]||60)*c.qty;return{art:d.asset,name:d.name+' ×'+c.qty,desc:'Crafting material',price:'🍬 '+cost,sold:bought.includes('c'+i),afford:(Save.data.sugar||0)>=cost,fn:()=>this.bazaarBuyCurrency(c.key,c.qty,cost,'c'+i)};}),cardH,cols);
    }else{
      const ch=Math.min(96,Math.max(70,h*.12));
      grid([{art:'prize_chest',name:'Gear Trade-in',desc:'Give 3 gear · get 1 new piece at their item level',price:'Trade 3 → 1',afford:true,color:0xffd166,fn:()=>{this._tradeSel=[];this._tradePage=0;this.menuScreen='tradein';this.buildTradeIn();}}],ch,1);
      y+=4;heading('Sell surplus materials');
      const owned=CURRENCY.filter(c=>Save.currency(c.key)>0),perPage=Math.max(1,Math.floor((h-y-48)/51)),pages=Math.max(1,Math.ceil(owned.length/perPage));this._bazSellPage=Math.max(0,Math.min(pages-1,this._bazSellPage||0));
      if(!owned.length)this.menu.add(this.add.text(w/2,y+10,'No materials to sell yet',{fontFamily:'sans-serif',fontSize:'11px',color:'#c5b5d1'}).setOrigin(.5,0));
      owned.slice(this._bazSellPage*perPage,(this._bazSellPage+1)*perPage).forEach(c=>{const val=Math.round((CURRENCY_BUY[c.key]||60)*.9);this._rowBtn(y,44,c.asset,c.name+' ×'+Save.currency(c.key),'Sell one material','🍬 '+val,'#a8edc6',()=>this.bazaarSellCurrency(c.key,val));y+=51;});
      if(pages>1)this.uiPillBtn(this.menu,w/2,h-25,w-28,32,COLORS.grape,'','Page '+(this._bazSellPage+1)+' / '+pages+' · Next',()=>{this._bazSellPage=(this._bazSellPage+1)%pages;this.buildBazaar();});
    }
    this.menu.setVisible(true);
  }
  buildThreadShop(top){ const w=this.W,h=this.H,d=Save.data,live=Iap.available(); let y=top;
    this.menu.add(this.add.text(14,y,'🍭 '+(Save.lollipops?.()||0)+' Lollipops',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffc6df'}));   /* v8.2.55 ร้านเงินจริงขาย 🍭 (ใช้กับของแต่งตัวเท่านั้น) */
    this.paintedNavButton(this.menu,w-70,y+9,112,28,'Wardrobe',false,()=>{this.menuScreen='wardrobe';this.buildMenuScreen();},'wardrobe'); y+=26;
    this.menu.add(this.add.text(14,y-6,live?'Lollipops buy looks only · never power':'Purchases open with the Play Store release · Lollipops buy looks only',{fontFamily:'sans-serif',fontSize:'9px',color:'#c5b5d1'})); y+=12;
    const days=Iap.passDaysLeft(),pc=Iap.passClaimable(),ph=58,pg=this.add.graphics(); pg.fillStyle(0x3a2a14,1).fillRoundedRect(14,y,w-28,ph,12).lineStyle(2,0xffd166,.95).strokeRoundedRect(14,y,w-28,ph,12); this.menu.add(pg);
    this.menu.add(this.add.text(26,y+9,'Mochi Pass · 30 days',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe08a'}));
    this.menu.add(this.add.text(26,y+29,days?days+' days left · +'+MOCHI_PASS.daily+' 🍭 every day':'+'+MOCHI_PASS.instant+' 🍭 now · +'+MOCHI_PASS.daily+' 🍭 every day',{fontFamily:'sans-serif',fontSize:'10px',color:'#fff0dc',wordWrap:{width:w-150}}));
    this.menu.add(this.add.text(w-26,y+ph/2,days?(pc?'Claim +'+MOCHI_PASS.daily:'Claimed today'):MOCHI_PASS.price,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:pc?'#a8edc6':days?'#75697e':'#ffd166'}).setOrigin(1,.5));
    this._zone(14,y,w-28,ph,()=>{ if(days){ const n=Iap.claimPass(); if(n){Sfx.menuCue?.('ui_pass_claim',.45)||Sfx.clear?.();this.showBanner?.('🍭 Mochi Pass','+'+n+' Lollipops',1300);this.buildBazaar();} return; } this.threadBuy(MOCHI_PASS.id); }); if(pc)this.drawBadgeDot?.(this.menu,w-18,y+4); y+=ph+10;
    const cols=w>h?3:2,gap=8,cw=(w-28-gap*(cols-1))/cols,rows=Math.ceil(IAP_PACKS.length/cols),ch=Math.min(130,Math.max(84,(h-y-20)/rows-gap));
    IAP_PACKS.forEach((p,i)=>{ const first=Iap.firstBonus(p.id),n=(first?p.lolli*2:p.lolli)+p.bonus;
      this.bazaarProductCard(14+(i%cols)*(cw+gap),y+Math.floor(i/cols)*(ch+gap),cw,ch,{art:'ic_lollipop',name:n+' 🍭',desc:first?'First purchase: double Lollipops':p.bonus?'+'+p.bonus+' bonus':'',price:p.price,color:first?0xffd166:0xffc6df,afford:live,fn:()=>this.threadBuy(p.id)}); }); }
  threadHowTo(){ Sfx.select?.(); this.showBanner?.('🧶 Earn Thread','Salvage gear, clear stages and claim Login & Daily rewards',2200); }
  threadBuy(id){ if(typeof IAP_ENABLED!=='undefined'&&!IAP_ENABLED){ this.threadHowTo(); return; } if(!Iap.available()){ Sfx.menuCue?.('ui_shop_soon',.35)||Sfx.error?.(); this.showBanner?.('🍭 Coming soon','Lollipop purchases open with the Play Store release',1600); return; }
    const first=Iap.firstBonus(id); Iap.buy(id,(ok,n)=>{ if(ok){Sfx.menuCue?.(first&&id!==MOCHI_PASS.id?'ui_thread_first_bonus':'ui_thread_buy',.5)||Sfx.clear?.();this.showBanner?.('🍭 Thank you!','+'+n+' Lollipops',1600);} if(this.state==='menu'&&this.menuScreen==='bazaar')this.buildBazaar(); }); }
  gmApply(){ if(typeof GM==='undefined'||!GM.on()||!this.player)return; if(GM.opt('dmg')){ this.player.dmgMul=(this.player.dmgMul||1)*10; this.floatText?.(this.player.x,this.player.y-70,'GM ×10 damage',0xffd166); } if(GM.opt('god'))this.floatText?.(this.player.x,this.player.y-90,'GM god mode',0x8fe8ff); }
  buildGm(){ if(typeof GM==='undefined'||!GM.on()){ this.menuScreen='settings'; this.buildMenuScreen(); return; } this.menu.removeAll(true);this.tapZones=[];this._screenBg('GM Tools','screen_settings','settings');
    const w=this.W,h=this.H,d=Save.data,done=(t,sub)=>{ GM.mark(); Save.save(); Sfx.clear?.(); this.showBanner?.('🛠 '+t,sub||'',1100); this.buildGm(); };
    const A=[
      ['🍬','+10,000 Sugar',()=>{Save.addSugar(10000);done('Sugar added');}],
      ['🧶','+1,000 Thread',()=>{Save.addThreads(1000);done('Thread added');}],
      ['🍭','+1,000 Lollipops',()=>{Save.addLollipops(1000);done('Lollipops added');}],   /* v8.2.55 ทดสอบสกุลเงินจริง */
      ['🧪','+50 every material',()=>{for(const c of (typeof CURRENCY!=='undefined'?CURRENCY:[]))Save.addCurrency(c.key,50);done('Materials added');}],
      ['🗺️','Unlock all stages',()=>{d.unlockedStage=Math.max(d.unlockedStage||0,STAGES.length-1);d.stageMastery=d.stageMastery||{};for(let i=0;i<STAGES.length;i++)d.stageMastery[i]=d.stageMastery[i]||1;d.tutorialDone=true;Save.unlockCoreCharacters?.(false);done('All stages open');}],
      ['🦸','Unlock all heroes',()=>{d.chars=Array.isArray(d.chars)?d.chars:['momo'];for(const c of ['momo',...Object.keys(CORE_UNLOCK_STAGE)])if(!d.chars.includes(c))d.chars.push(c);done('All heroes unlocked');}],
      ['⭐','All heroes +10 levels',()=>{for(const c of (d.chars||[])){const cp=Save.cp(c);if(cp){cp.lvl=(cp.lvl||1)+10;cp.tp=(cp.tp||0)+10;}}done('Hero levels +10');}],
      ['🏅','Rank +5',()=>{d.rank=(d.rank||0)+5;done('Rank +5');}],
      ['📅','Reset Daily Login (claim again)',()=>{const c=LoginCal.data();c.last='';done('Daily Login ready');}],
      ['📋','Reset Daily Quests',()=>{d.dailyQ=null;done('Daily Quests reset');}],
      ['🎟️','Start Mochi Pass (test)',()=>{Iap.grant(MOCHI_PASS.id);done('Mochi Pass active');}],
      ['👗','Unlock all cosmetics',()=>{const cd=Cos.data();for(const c of COSMETICS)cd.own[c.id]=1;done('All cosmetics owned');}],
      ['🛡️','God mode in stages: '+(GM.opt('god')?'ON':'off'),()=>{GM.toggle('god');this.buildGm();}],
      ['💥','×10 damage in stages: '+(GM.opt('dmg')?'ON':'off'),()=>{GM.toggle('dmg');this.buildGm();}],
      ['💾','Back up this save',()=>{GM.backup();done('Save backed up');}],
      ['↩️','Restore backup'+(GM.hasBackup()?'':' (none)'),()=>{if(GM.restore())location.reload();else Sfx.error?.();}],
      [GM.testing()?'🔙':'🧪',GM.testing()?'Leave test profile (back to real save)':'Test profile (fresh save, real save kept)',()=>{if(GM.testing()?GM.endTest():GM.startTest())location.reload();}],
      ['🚪','Turn GM Tools off',()=>{GM.off();this.menuScreen='settings';this.buildMenuScreen();}]];
    const top=this._hdrShift?.()+84||84,cols=2,gap=6,bw=(w-28-gap)/cols,rows=Math.ceil(A.length/cols),bh=Math.max(30,Math.min(48,(h-top-30)/rows-gap));
    A.forEach(([e,lab,fn],i)=>{ const x=14+(i%cols)*(bw+gap),y=top+Math.floor(i/cols)*(bh+gap),g=this.add.graphics(); g.fillStyle(0x261e30,.95).fillRoundedRect(x,y,bw,bh,10).lineStyle(1.5,0x6d536d,1).strokeRoundedRect(x,y,bw,bh,10); this.menu.add(g);
      const t=this.add.text(x+10,y+bh/2,e+' '+lab,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff1e7',wordWrap:{width:bw-16}}).setOrigin(0,.5); this.menu.add(t); this._zone(x,y,bw,bh,fn); });
    this.menu.add(this.add.text(w/2,h-14,'GM saves are marked and never sent to Rankings'+(GM.testing()?' · TEST PROFILE (cloud sync off)':''),{fontFamily:'sans-serif',fontSize:'9px',color:'#a89cb6'}).setOrigin(.5)); }
  buildRanking(){ this.menu.removeAll(true);this.tapZones=[];this._screenBg('Rankings','screen_bazaar','hub'); this.rewardsTabs?.('ranking');
    const w=this.W,h=this.H,hs=this._hdrShift(),cat=this._boardCat=BOARD_CATS.some(c=>c.id===this._boardCat)?this._boardCat:'sugar',C=BOARD_CATS.find(c=>c.id===cat); let y=124+hs;
    const tw=(w-28)/4; BOARD_CATS.forEach((c,i)=>this.paintedNavButton(this.menu,14+tw*((i%4)+.5),y+14+Math.floor(i/4)*34,tw-6,28,c.emoji+' '+c.name,c.id===cat,()=>{this._boardCat=c.id;this.buildRanking();},'board_'+c.id)); y+=76;
    const T=(x,yy,t,sz,col,ox=0,st='bold')=>{ const q=this.add.text(x,yy,t,{fontFamily:'sans-serif',fontStyle:st,fontSize:sz+'px',color:col}).setOrigin(ox,.5); this.menu.add(q); return q; };
    T(14,y,'You: '+Board.name(),12,'#ffe08a'); this.paintedNavButton(this.menu,w-60,y,92,26,'✏️ Name',false,()=>this.boardRename(),'board_name'); y+=24;
    T(14,y,C.name+' · '+(Board.scores(Save.data)[C.col]).toLocaleString()+' '+C.unit,11,'#cfc2d5',0,'normal'); y+=20;
    if(!Board.online()){ T(w/2,y+40,'Rankings are offline right now.',13,'#ffc6df',.5); T(w/2,y+62,'Your scores will be sent once the cloud is back.',10,'#a89cb6',.5,'normal'); return; }
    const box=T(w/2,y+30,'Loading…',12,'#a89cb6',.5,'normal'),zs=this.tapZones,y0=y;
    Board.submit(false).finally(()=>Board.top(cat).then(r=>{ if(this.state!=='menu'||this.menuScreen!=='ranking'||this.tapZones!==zs||this._boardCat!==cat)return; box.destroy();
      if(!r){ T(w/2,y0+30,'Could not load rankings'+(Board._err?' · '+String(Board._err).slice(0,40):''),11,'#f295a8',.5,'normal'); return; }
      if(r.myRank)T(w-14,y0-20,'Your place: #'+r.myRank,12,'#a8edc6',1); if(r.myRank&&r.myRank<=3&&this._top3Cue!==cat){this._top3Cue=cat;Sfx.menuCue?.('ui_rank_top3',.5);}
      const rowH=26,max=Math.max(3,Math.floor((h-y0-14)/rowH)); r.rows.slice(0,max).forEach((q,i)=>{ const yy=y0+i*rowH+10,g=this.add.graphics(); g.fillStyle(q.me?0x5a3d1a:i%2?0x251b31:0x2c2138,.92).fillRoundedRect(12,yy-11,w-24,22,8); this.menu.add(g);
        T(22,yy,(i<3?['🥇','🥈','🥉'][i]:'#'+(i+1)),12,i<3?'#ffe08a':'#cfc2d5'); T(62,yy,q.name,12,q.me?'#ffe08a':'#fff0dc'); T(w-22,yy,Number(q.v).toLocaleString(),12,'#a8edc6',1); });
      if(!r.rows.length)T(w/2,y0+30,'Be the first on the board!',12,'#ffe08a',.5); })); }
  boardRename(){ let n=null; try{ n=window.prompt('Your ranking name (3–14 letters, numbers, space, _ . -)',Board.name()); }catch(e){} if(n==null)return; if(Board.setName(n)){ Sfx.menuCue?.('ui_name_saved',.45)||Sfx.clear?.(); this.showBanner?.('✏️ Name saved',Board.name(),1200); } else { Sfx.error?.(); this.showBanner?.('Name not allowed','Use 3–14 letters or numbers',1500); } this.buildRanking(); }
  /* v8.1.68 เจ้าของ: Wardrobe ใหม่ — หุ่นลองชุด (แตะการ์ด = ลองใส่ก่อนซื้อ) · แท็บแถวเดียว · การ์ดมีป้าย Wearing/Owned · แถบซื้อด้านล่าง (ด้ายไม่พอ = ปุ่มไปร้านด้าย) */
  buildWardrobe(){ this.menu.removeAll(true);this.tapZones=[];this._screenBg('Wardrobe','screen_bazaar','bazaar'); this.loadCosArt?.();
    const w=this.W,h=this.H,hs=this._hdrShift(),tab=this._cosTab=COS_SLOTS.some(t=>t[0]===this._cosTab)?this._cosTab:'skin',T=(x,y,str,fs,col,ox=.5,oy=.5,bold=true)=>{ const o=this.add.text(x,y,str,{fontFamily:'sans-serif',fontStyle:bold?'bold':'normal',fontSize:fs+'px',color:col,stroke:'#1a0f1e',strokeThickness:3}).setOrigin(ox,oy); this.menu.add(o); return o; };
    let prev=Cos.item(this._cosPrev); if(prev&&prev.slot!==tab)prev=null; this._cosPrev=prev?prev.id:null;
    const isSkin=tab==='skin',pSkin=isSkin?Cos.skinItem(this._skinPrev):null; if(!isSkin)this._skinPrev=null; this._wardHeroC=pSkin?pSkin.hero:null; const wHero=this._wardHeroC||Save.data.character||'momo';
    const top=84+hs,barH=58,barY=h-barH-10,sh=Math.round(Math.max(170,Math.min(270,h*.31))),px=14,pw=w-28;
    // ── หุ่นลองชุด
    { const g=this.add.graphics(),cx=w/2; g.fillStyle(0x000000,.35).fillRoundedRect(px+3,top+5,pw,sh,20).fillStyle(0x221630,.94).fillRoundedRect(px,top,pw,sh,20);
      for(let i=18;i>=1;i--)g.fillStyle(i>12?0xc9a0ff:0xffe6f4,.022).fillCircle(cx,top+sh*.48,sh*.55*i/18);
      for(let i=8;i>=1;i--)g.fillStyle(0xffd88a,.07).fillEllipse(cx,top+sh-24,sh*.7*i/8,sh*.12*i/8);
      g.lineStyle(2,0xffd166,.85).strokeRoundedRect(px,top,pw,sh,20).lineStyle(1,0xffffff,.18).strokeRoundedRect(px+5,top+5,pw-10,sh-10,16); this.menu.add(g);
      const ban=isSkin&&!pSkin&&this.realTex?.('skin_banner69'); if(ban){ const bi=this.add.image(cx,top+sh/2,'skin_banner69'),sc=Math.max((pw-8)/bi.width,(sh-8)/bi.height); bi.setScale(sc).setCrop((bi.width-(pw-8)/sc)/2,(bi.height-(sh-8)/sc)/2,(pw-8)/sc,(sh-8)/sc); this.menu.add(bi); }   /* v8.1.73 ใบ 69 F */
      const ov={}; if(prev)ov[prev.slot]=prev; if(!ban)this.cosEnsurePrev?.(prev); if(!ban)this.lobbyCos?.(cx,top+sh-24,sh*.74,ov,'wardrobe'); if(!ban)this.wardHero?.(cx,top+sh-24,sh*.74,isSkin?(pSkin||Cos.skin(wHero)||null):undefined);
      if(prev&&['dash','pop','trail'].includes(prev.slot)){ const pi=this.cosIcon(prev),ik=pi[0]; if(this.realTex?.(ik)){ const o=this.add.image(cx+sh*.42,top+sh*.42,ik,pi[1]).setDisplaySize(64,64); const t=Cos.tint(prev); if(t!=null&&Cos.owns(prev.id))o.setTint(t); this.menu.add(o); this.tweens?.add({targets:o,y:o.y-6,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'}); } T(cx+sh*.42,top+sh*.42+42,prev.slot==='pop'?'On every kill':prev.slot==='dash'?'When you dash':'While you walk',9,'#e8d8ff'); }
      // ด้าย + ปุ่มเติม
      const tw=118,tx=px+10,ty=top+10,tg=this.add.graphics(); tg.fillStyle(0x140c1c,.85).fillRoundedRect(tx,ty,tw,26,13).lineStyle(1.5,0xffb0d8,.9).strokeRoundedRect(tx,ty,tw,26,13).fillStyle(0xff7ab8,1).fillCircle(tx+tw-13,ty+13,10); this.menu.add(tg);
      T(tx+10,ty+13,'🧶 '+Save.threads(),12,'#ffe0f0',0); T(tx+tw-13,ty+12,'+',16,'#ffffff');
      this._zone(tx,ty-4,tw,34,()=>{ if(typeof IAP_ENABLED!=='undefined'&&!IAP_ENABLED){ this.threadHowTo(); return; } this._bazTab='thread'; this.menuScreen='bazaar'; this.buildMenuScreen(); }); this.tapZones[this.tapZones.length-1].tag='ward_thread';
      const shopAll=COSMETICS.filter(c=>!Cos.retired(c)),own=shopAll.filter(c=>Cos.owns(c.id)).length+SKINS.filter(k=>Cos.skinOwns(k.id)).length; T(px+pw-12,top+23,'Collection '+own+'/'+(shopAll.length+SKINS.length),10,'#d9c8ee',1);
      const pn=pSkin||prev,po=pSkin?Cos.skinOwns(pSkin.id):prev&&Cos.owns(prev.id); T(cx,top+sh-10,pn?(po?'':'✨ Trying on · ')+pn.name:isSkin?'Tap a skin to try it on':'Tap an item to try it on',11,pn?'#fff0b8':'#cbb8e0'); }
    // ── แท็บแถวเดียว
    let y=top+sh+10; const n=COS_SLOTS.length,tbw=(w-28)/n;
    COS_SLOTS.forEach(([id,label],i)=>{ const on=id==='skin'?!!Cos.skin(Save.data.character||'momo'):!!Cos.equipped(id); this.paintedNavButton(this.menu,14+tbw*(i+.5),y+15,tbw-3,30,label,id===tab,()=>{ this._cosTab=id; this._cosPrev=null; this._skinPrev=null; Sfx.select?.(); this.buildWardrobe(); },'cos_'+id); if(on){ const d=this.add.circle(14+tbw*(i+1)-6,y+3,3.5,0x7fe3a8,1).setStrokeStyle(1,0xffffff,.8); this.menu.add(d); } });
    y+=40;
    if(isSkin){ this.wardSkins(y,barY,pSkin); this.wardSkinBar(pSkin,barY,barH); return; }
    // ── การ์ด
    const list=Cos.shop(tab),cols=3,gap=8,cw=(w-28-gap*(cols-1))/cols,rows=Math.ceil(list.length/cols),ch=Math.max(92,Math.min(138,(barY-8-y)/rows-gap));
    list.forEach((c,i)=>{ const own=Cos.owns(c.id),on=Cos.equipped(c.slot)?.id===c.id,sel=prev&&prev.id===c.id,x=14+(i%cols)*(cw+gap),yy=y+Math.floor(i/cols)*(ch+gap),col=Cos.col(c),g=this.add.graphics();
      g.fillStyle(0x000000,.3).fillRoundedRect(x+2,yy+4,cw,ch,14).fillStyle(0x251b31,.97).fillRoundedRect(x,yy,cw,ch,14).fillStyle(col,.16).fillRoundedRect(x,yy,cw,ch-46,{tl:14,tr:14,bl:0,br:0});
      for(let k=6;k>=1;k--)g.fillStyle(col,.05).fillCircle(x+cw/2,yy+(ch-38)/2+2,cw*.36*k/6);
      g.lineStyle(sel?3:1.5,sel?0xffd166:on?0x7fe3a8:col,sel?1:.8).strokeRoundedRect(x,yy,cw,ch,14); this.menu.add(g);
      const iy=yy+(ch-38)/2+2,isz=Math.min(cw*.62,ch-52),ci=this.cosIcon(c); if(this.realTex?.(ci[0])){ const o=this.add.image(x+cw/2,iy,ci[0],ci[1]).setDisplaySize(isz,isz); const t=own?Cos.tint(c):null; if(t!=null)o.setTint(t); this.menu.add(o); if(sel)this.tweens?.add({targets:o,y:o.y-4,duration:700,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
      else { this.menu.add(this.add.circle(x+cw/2,iy,isz*.36,col,1).setStrokeStyle(2,0xffffff,.8)); if(c.emoji)T(x+cw/2,iy,c.emoji,Math.round(isz*.4),'#fff'); }
      const nm=T(x+cw/2,yy+ch-36,c.name.replace(/ (Wings|Ring|Halo|Trail)$/,''),10,'#fff0dc'); nm.setWordWrapWidth?.(cw-8); if(nm.width>cw-8)nm.setScale((cw-8)/nm.width);
      if(on||own){ const lb=on?'WEARING':'OWNED',bc=on?0x3fbf7f:0x6a5a86,bw=on?60:50,bg=this.add.graphics(); bg.fillStyle(bc,1).fillRoundedRect(x+cw-bw-4,yy+5,bw,16,8); this.menu.add(bg); T(x+cw-bw/2-4,yy+13,lb,8,'#ffffff'); T(x+cw/2,yy+ch-14,'🎨 '+COS_DYES[Cos.dye(c.id)][0],10,'#ffd9a8'); }
      else { const pg=this.add.graphics(),aff=Save.threads()>=c.price,pw2=Math.min(cw-14,74); pg.fillStyle(aff?0x5a2a48:0x3a2a36,1).fillRoundedRect(x+(cw-pw2)/2,yy+ch-25,pw2,20,10).lineStyle(1,aff?0xff9ad0:0x8a7090,1).strokeRoundedRect(x+(cw-pw2)/2,yy+ch-25,pw2,20,10); this.menu.add(pg); T(x+cw/2,yy+ch-15,'🧶 '+c.price,11,aff?'#ffe0f0':'#b9a0b8'); }
      this._zone(x,yy,cw,ch,()=>{ this._cosPrev=sel?null:c.id; Sfx.menuCue?.('ui_cos_equip',.3)||Sfx.select?.(); this.buildWardrobe(); }); this.tapZones[this.tapZones.length-1].tag='cos_card_'+c.id; });
    this.wardBar(prev,barY,barH); }
  // แถบล่าง: ซื้อ / ใส่-ถอด / ย้อมสี / ไปร้านด้าย
  wardBar(c,y,bh){ const w=this.W,x=14,bw=w-28,g=this.add.graphics(); g.fillStyle(0x000000,.4).fillRoundedRect(x+2,y+4,bw,bh,18).fillStyle(0x1c1226,.96).fillRoundedRect(x,y,bw,bh,18).lineStyle(1.5,0xffd166,.6).strokeRoundedRect(x,y,bw,bh,18); this.menu.add(g);
    const T=(tx,ty,s,fs,col)=>{ const o=this.add.text(tx,ty,s,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:fs+'px',color:col,stroke:'#1a0f1e',strokeThickness:3}).setOrigin(.5); this.menu.add(o); return o; };
    const btn=(bx,by,ww,hh,fill,edge,label,fn,tag)=>{ const b=this.add.graphics(); b.fillStyle(fill,1).fillRoundedRect(bx,by,ww,hh,14).fillStyle(0xffffff,.16).fillRoundedRect(bx+3,by+3,ww-6,hh*.42,10).lineStyle(2,edge,1).strokeRoundedRect(bx,by,ww,hh,14); this.menu.add(b); T(bx+ww/2,by+hh/2,label,14,'#ffffff'); this._zone(bx,by,ww,hh,fn); this.tapZones[this.tapZones.length-1].tag=tag; return b; };
    if(!c){ const eq=COS_SLOTS.filter(([s])=>Cos.equipped(s)).length; T(w/2,y+bh/2-8,'Looks only · shown on every hero',11,'#e8d8ff'); T(w/2,y+bh/2+9,eq+' of '+COS_SLOTS.length+' slots dressed up',10,'#b9a6cf'); return; }
    const by=y+9,hh=bh-18;
    if(!Cos.owns(c.id)){ if(this.wardPayRow?.(x,by,bw,hh,c.price,cur=>this.cosTap(c,cur),btn,'ward_buy'))return; const aff=Save.threads()>=c.price;
      if(aff){ const b=btn(x+10,by,bw-20,hh,0xe0558f,0xffd166,'Buy & Wear  ·  🧶 '+c.price,()=>this.cosTap(c),'ward_buy'); this.tweens?.add({targets:b,alpha:.85,duration:700,yoyo:true,repeat:-1}); }
      else { T(x+bw*.28,by+hh/2-7,'Need 🧶 '+(c.price-Save.threads())+' more',11,'#ffb0c8'); T(x+bw*.28,by+hh/2+9,'Price 🧶 '+c.price,10,'#cbb8e0'); btn(x+bw*.52,by,bw*.48-10,hh,0x6a4bd0,0xbfa8ff,(typeof IAP_ENABLED!=='undefined'&&IAP_ENABLED)?'Get 🍭 ›':'Get Thread ›',()=>{ if(typeof IAP_ENABLED!=='undefined'&&!IAP_ENABLED){ this.threadHowTo(); return; } this._bazTab='thread'; this.menuScreen='bazaar'; this.buildMenuScreen(); },'ward_get'); }
      return; }
    const on=Cos.equipped(c.slot)?.id===c.id,hw=(bw-30)/2;
    btn(x+10,by,hw,hh,on?0x6a5a86:0x2f9a66,on?0xd8c8f0:0xa8ffcf,on?'Take off':'Wear',()=>this.cosTap(c),'ward_wear');
    btn(x+20+hw,by,hw,hh,0x8a5a20,0xffd166,'🎨 '+COS_DYES[Cos.dye(c.id)][0],()=>{ Cos.nextDye(c.id); Sfx.menuCue?.('ui_cos_dye',.4)||Sfx.select?.(); this.buildWardrobe(); },'ward_dye'); }
  // แท็บ Skins: การ์ดสกินทุกฮีโร่ (ฮีโร่ที่เล่นอยู่ขึ้นก่อน) · แตะ = ลองบนหุ่น (หุ่นเปลี่ยนเป็นฮีโร่ของสกินนั้น)
  wardSkins(y,barY,sel){ const w=this.W,cur=Save.data.character||'momo',owned=Save.data.chars||[],list=SKINS.slice().sort((a,b)=>(b.hero===cur)-(a.hero===cur)),cols=3,gap=8,cw=(w-28-gap*(cols-1))/cols,rows=Math.ceil(list.length/cols),ch=Math.max(92,Math.min(138,(barY-8-y)/rows-gap));
    const T=(x,yy,str,fs,col)=>{ const o=this.add.text(x,yy,str,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:fs+'px',color:col,stroke:'#1a0f1e',strokeThickness:3}).setOrigin(.5); this.menu.add(o); return o; };
    list.forEach((k,i)=>{ const x=14+(i%cols)*(cw+gap),yy=y+Math.floor(i/cols)*(ch+gap),own=Cos.skinOwns(k.id),on=Cos.data().skin[k.hero]===k.id&&own,ready=Cos.skinReady(k),isSel=sel&&sel.id===k.id,g=this.add.graphics();
      g.fillStyle(0x000000,.3).fillRoundedRect(x+2,yy+4,cw,ch,14).fillStyle(0x251b31,.97).fillRoundedRect(x,yy,cw,ch,14).fillStyle(k.col,.18).fillRoundedRect(x,yy,cw,ch-46,{tl:14,tr:14,bl:0,br:0});
      g.lineStyle(isSel?3:1.5,isSel?0xffd166:on?0x7fe3a8:k.col,isSel?1:.8).strokeRoundedRect(x,yy,cw,ch,14); this.menu.add(g);
      const iy=yy+(ch-38)/2+2,isz=Math.min(cw*.7,ch-50),ik=k.icon[0];
      if(this.realTex?.(ik)){ this.menu.add(this.add.image(x+cw/2,iy,ik,k.icon[1]).setDisplaySize(isz,isz)); }
      else { const rk='roster_'+k.hero; if(this.textures.exists(rk)){ const av=this.add.image(x+cw/2,iy,rk),q=Math.min(av.width,av.height); av.setCrop((av.width-q)/2,(av.height-q)/2,q,q).setScale(isz/q); this.menu.add(av); } else T(x+cw/2,iy,'👘',Math.round(isz*.4),'#fff'); }
      T(x+cw/2,yy+ch-36,(CHARACTERS?.[k.hero]?.name||k.hero),9,'#cbb8e0'); const nm=T(x+cw/2,yy+ch-24,k.name,10,'#fff0dc'); if(nm.width>cw-8)nm.setScale((cw-8)/nm.width);
      if(on||own){ const bc=on?0x3fbf7f:0x6a5a86,bw=on?60:50,bg=this.add.graphics(); bg.fillStyle(bc,1).fillRoundedRect(x+cw-bw-4,yy+5,bw,16,8); this.menu.add(bg); T(x+cw-bw/2-4,yy+13,on?'WEARING':'OWNED',8,'#ffffff'); }
      else T(x+cw/2,yy+ch-9,ready?'🧶 '+SKIN_PRICE:'Coming soon',10,ready?(Save.threads()>=SKIN_PRICE?'#ffe0f0':'#b9a0b8'):'#9d8fb2');
      if(!owned.includes(k.hero)){ const lk=this.add.graphics(); lk.fillStyle(0x140c1c,.45).fillRoundedRect(x,yy,cw,ch,14); this.menu.add(lk); T(x+14,yy+14,'🔒',11,'#fff'); }
      this._zone(x,yy,cw,ch,()=>{ this._skinPrev=isSel?null:k.id; Sfx.menuCue?.('ui_cos_equip',.3)||Sfx.select?.(); this.buildWardrobe(); }); this.tapZones[this.tapZones.length-1].tag='skin_card_'+k.id; }); }
  wardSkinBar(k,y,bh){ const w=this.W,x=14,bw=w-28,g=this.add.graphics(); g.fillStyle(0x000000,.4).fillRoundedRect(x+2,y+4,bw,bh,18).fillStyle(0x1c1226,.96).fillRoundedRect(x,y,bw,bh,18).lineStyle(1.5,0xffd166,.6).strokeRoundedRect(x,y,bw,bh,18); this.menu.add(g);
    const T=(tx,ty,s2,fs,col)=>{ const o=this.add.text(tx,ty,s2,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:fs+'px',color:col,stroke:'#1a0f1e',strokeThickness:3}).setOrigin(.5); this.menu.add(o); return o; };
    const btn=(bx,by,ww,hh,fill,edge,label,fn,tag)=>{ const b=this.add.graphics(); b.fillStyle(fill,1).fillRoundedRect(bx,by,ww,hh,14).fillStyle(0xffffff,.16).fillRoundedRect(bx+3,by+3,ww-6,hh*.42,10).lineStyle(2,edge,1).strokeRoundedRect(bx,by,ww,hh,14); this.menu.add(b); T(bx+ww/2,by+hh/2,label,14,'#ffffff'); this._zone(bx,by,ww,hh,fn); this.tapZones[this.tapZones.length-1].tag=tag; return b; };
    const by=y+9,hh=bh-18,refund=Cos.data().refund69;
    if(!k){ if(refund){ T(w/2,y+bh/2-8,'Wings, halos and rings became full skins',11,'#e8d8ff'); T(w/2,y+bh/2+9,'🧶 '+refund+' Thread was returned to you',10,'#a8edc6'); return; }
      T(w/2,y+bh/2-8,'Full outfits · art for every screen and stage',11,'#e8d8ff'); T(w/2,y+bh/2+9,'Each skin belongs to one hero',10,'#b9a6cf'); return; }
    if(!Cos.skinReady(k)){ T(w/2,y+bh/2-8,'Coming soon',13,'#ffd9a8'); T(w/2,y+bh/2+10,'This skin is still being tailored',10,'#b9a6cf'); return; }
    if(!(Save.data.chars||[]).includes(k.hero)){ T(w/2,y+bh/2,'🔒 Unlock '+(CHARACTERS?.[k.hero]?.name||k.hero)+' first',12,'#ffb0c8'); return; }
    if(!Cos.skinOwns(k.id)){ if(this.wardPayRow?.(x,by,bw,hh,SKIN_PRICE,cur=>{ if(Cos.buySkin(k.id,cur)){ Sfx.menuCue?.('ui_cos_buy',.5)||Sfx.clear?.(); this.showBanner?.('✨ '+k.name,'Worn by '+(CHARACTERS?.[k.hero]?.name||k.hero)+' everywhere',1500); } else Sfx.error?.(); this.buildWardrobe(); },btn,'ward_skin_buy'))return; const aff=Save.threads()>=SKIN_PRICE;
      if(aff){ const b=btn(x+10,by,bw-20,hh,0xe0558f,0xffd166,'Buy & Wear  ·  🧶 '+SKIN_PRICE,()=>{ if(Cos.buySkin(k.id)){ Sfx.menuCue?.('ui_cos_buy',.5)||Sfx.clear?.(); this.showBanner?.('✨ '+k.name,'Worn by '+(CHARACTERS?.[k.hero]?.name||k.hero)+' everywhere',1500); } else Sfx.error?.(); this.buildWardrobe(); },'ward_skin_buy'); this.tweens?.add({targets:b,alpha:.85,duration:700,yoyo:true,repeat:-1}); }
      else { T(x+bw*.28,by+hh/2-7,'Need 🧶 '+(SKIN_PRICE-Save.threads())+' more',11,'#ffb0c8'); T(x+bw*.28,by+hh/2+9,'Price 🧶 '+SKIN_PRICE,10,'#cbb8e0'); btn(x+bw*.52,by,bw*.48-10,hh,0x6a4bd0,0xbfa8ff,(typeof IAP_ENABLED!=='undefined'&&IAP_ENABLED)?'Get 🍭 ›':'Get Thread ›',()=>{ if(typeof IAP_ENABLED!=='undefined'&&!IAP_ENABLED){ this.threadHowTo(); return; } this._bazTab='thread'; this.menuScreen='bazaar'; this.buildMenuScreen(); },'ward_get'); }
      return; }
    const on=Cos.data().skin[k.hero]===k.id; btn(x+10,by,bw-20,hh,on?0x6a5a86:0x2f9a66,on?0xd8c8f0:0xa8ffcf,on?'Back to original outfit':'Wear',()=>{ Cos.setSkin(k.hero,on?null:k.id); Sfx.menuCue?.(on?'ui_cos_unequip':'ui_cos_equip',.4)||Sfx.select?.(); this.buildWardrobe(); },'ward_skin_wear'); }
  // หุ่นลองชุด: ใช้ท่า idle ของ Lobby ถ้าโหลดแล้ว ไม่งั้นภาพการ์ดฮีโร่
  wardHero(x,footY,hh,skin){ const c=this._wardHeroC||Save.data.character||'momo',hk=skin!==undefined?(skin&&this.realTex?.('card_'+c+'__'+skin.tag)?'card_'+c+'__'+skin.tag:(skin&&this.skinLoad?.('card_'+c+'__'+skin.tag),'card_'+c)):(this.skinKey?.('card_'+c,c)||'card_'+c); let o=null;
    if(this.textures.exists(hk)&&this.lobbyHeroWarp?.(hk,x,footY,hh)){}
    else if(this.textures.exists(hk)){ o=this.add.image(x,footY,hk).setOrigin(.5,1); o.setScale(hh/o.height); }
    else { this.skinLoad?.(hk); o=this.add.text(x,footY-hh/2,'🍡',{fontSize:Math.round(hh*.4)+'px'}).setOrigin(.5); }
    if(o)this.menu.add(o); if(this._cosLobbyHalo&&this.menuScreen==='wardrobe')this.lobbyCosHalo(); }
  // ลองของที่ยังไม่ซื้อ: โหลดภาพของชิ้นนั้นก่อน
  cosEnsurePrev(c){ if(!c||!this.ensureGroup||typeof ASSET_FX==='undefined')return; const k=this.cosArtKey(c); if(!ASSET_FX[k]||this.realTex?.(k)||(this._cosTried&&this._cosTried.has(k))||this._cosPrevLoad===k)return; this._cosPrevLoad=k;
    try{ this.ensureGroup(q=>q===k,()=>{ this._cosPrevLoad=null; if(!this.realTex?.(k))(this._cosTried||(this._cosTried=new Set())).add(k); if(this.state==='menu'&&this.menuScreen==='wardrobe')this.buildWardrobe(); },{all:true,quiet:true,fx:true}); }catch(e){ this._cosPrevLoad=null; } }
  /* v8.1.70 Sweep: ปุ่มบนการ์ดด่าน 3 ดาว · รับ 50% ของ Sugar ที่เคยได้จริง + EXP ฮีโร่ที่เลือก · วันละ 5 ครั้ง */
  sweepBtn(rx,by,si){ const left=sweepLeft(),bw=78,bh=24,x=rx-bw,y=by-bh,g=this.add.graphics(); g.fillStyle(left?0x2f9a66:0x4a4059,1).fillRoundedRect(x,y,bw,bh,12).lineStyle(1.5,left?0xa8ffcf:0x7a6d8a,1).strokeRoundedRect(x,y,bw,bh,12); this.menu.add(g);
    this.menu.add(this.add.text(x+bw/2,y+bh/2,'⚡ Sweep '+left+'/'+SWEEP_DAY,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(.5));
    this._zone(x-4,y-4,bw+8,bh+8,()=>this.sweepRun(si)); this.tapZones[this.tapZones.length-1].tag='sweep_'+si; }
  sweepRun(si){ if(!sweepOk(si)){ Sfx.error?.(); this.menuToast?.('⭐ Get all 3 stars to unlock Sweep'); return false; } if(sweepLeft()<=0){ Sfx.error?.(); this.menuToast?.('⚡ No sweeps left today · back tomorrow'); return false; }
    const d=Save.data,k=localDayKey(); if(!d.sweep||d.sweep.day!==k)d.sweep={day:k,n:0}; d.sweep.n++; const r=sweepReward(si); Save.addSugar(r.sugar); this.menuGiveExp(r.exp); Save.save();
    Sfx.menuCue?.('miners_collect',.35)||Sfx.clear?.(); this.showBanner?.('⚡ Swept C'+(Math.floor(si/5)+1)+'-'+(si%5+1),'🍬 +'+r.sugar+'  ·  EXP +'+r.exp,1600); this.buildMenuScreen(); return r; }
  menuGiveExp(n){ const c0=this.character; this.character=Save.data.character||'momo'; try{ this.gainCharExp(n); }finally{ this.character=c0; } }
  /* v8.1.70 Mochi Patrol: เปิดทิ้งไว้ ฮีโร่เดินตรวจตราและปราบโมจิเอง · รางวัลไหลตามเวลาที่จอเปิดอยู่ · ลด FPS + โหมดหรี่จอประหยัดแบต */
  patrolData(){ const d=Save.data,k=localDayKey(); if(!d.afk||d.afk.day!==k)d.afk={day:k,min:0,pend:(d.afk&&d.afk.pend)||{sugar:0,exp:0}}; if(!d.afk.pend)d.afk.pend={sugar:0,exp:0}; return d.afk; }
  patrolCollect(quiet){ const a=this.patrolData(),su=Math.floor(a.pend.sugar),ex=Math.floor(a.pend.exp); if(su<1&&ex<1)return 0; a.pend.sugar-=su; a.pend.exp-=ex; if(su>0)Save.addSugar(su); if(ex>0)this.menuGiveExp(ex); Save.save(); if(!quiet){ Sfx.menuCue?.('miners_collect',.35)||Sfx.clear?.(); this.menuToast?.('🌙 Patrol loot  🍬 +'+su+'  ·  EXP +'+ex,'#a8ffb0'); } return su; }
  /* v8.1.108 A12: เสียงภารกิจ League/Trial/Forge/Patrol · ui_* เล่นแบบเมนู (จำกัดซ้อน) · ไม่มีไฟล์ = เงียบ (คืน false ให้เสียงเดิมเล่นแทนได้) */
  a22Voice(key,valid,owner,once){ if(typeof VoiceActing==='undefined'||(typeof Save!=='undefined'&&Save.data?.settings?.noRuby)||once&&this._a22Said?.[once])return false; const epoch=this._rubyEpoch,ok=VoiceActing.play(this,key,()=>this.state==='play'&&this._rubyEpoch===epoch&&!(typeof Save!=='undefined'&&Save.data?.settings?.noRuby)&&(!valid||valid()),owner); if(ok&&once)(this._a22Said||(this._a22Said={}))[once]=true; return ok; }
  a22RootLoop(){ if(typeof Sfx==='undefined')return; const L=this._lure,on=this.state==='play'&&L&&!L.fin&&(L.heads||[L]).some(h=>h.st==='burrow'&&h.t>=0); if(!on){Sfx.eventLoopStop?.('a22_root_burrow');return;} if(!this._a22Shutdown&&this.events?.once){this._a22Shutdown=true;this.events.once('shutdown',()=>{Sfx.eventLoopStop?.('a22_root_burrow');this._a22Shutdown=false;});} Sfx.eventLoopStart?.('a22_root_burrow',.2); }
  a23Cue(family,vol=.25,gap=.4){return typeof Sfx!=='undefined'&&Sfx.a23?.(family,vol,gap);}
  a12(k,vol=.4,gap=.15){ if(typeof Sfx==='undefined')return false; return k.startsWith('ui_')?Sfx.menuCue?.(k,vol,gap):Sfx.orderCue?.(k,vol,gap); }
  patrolStop(){ this._patrolOn=false; this.patrolCollect(true); }   /* v8.2.36 E1: หน้า Patrol ลบแล้ว (รวมเป็น Expedition) · เก็บไว้รับของค้างในเซฟเก่า */
  /* v8.1.93 ใบ 70 Mochi Patrol: ฉาก sky (ครอปเต็มกรอบ) + mid/ground เลื่อนแบบ parallax (tileable) · มอน pt_foes 2 แถวต่อบท · แตก pt_pop */
  patrolScene(ch,fx,top,fw,fh,gy){ const k='pt_c'+(ch+1)+'_',sky=k+'sky',mid=k+'mid',gr=k+'ground',T=this.textures; if(!T.exists(sky)||!T.exists(mid)||!T.exists(gr))return false;
    const im=this.add.image(fx+fw/2,top+fh/2,sky),sw=im.width,sh=im.height,sc=Math.max(fw/sw,fh/sh),cw=fw/sc,chh=fh/sh*sh/sc; im.setScale(sc).setCrop((sw-cw)/2,(sh-fh/sc)/2,cw,fh/sc); this.menu.add(im);
    const ms=(fh*.55)/T.get(mid).getSourceImage().height,mt=this.add.tileSprite(fx,top+fh*.62,fw,fh*.55,mid).setOrigin(0,1); mt.tileScaleX=mt.tileScaleY=ms; this.menu.add(mt);
    const gs=(fh*.5)/T.get(gr).getSourceImage().height,gt0=gy-40*gs,gt=this.add.tileSprite(fx,gt0,fw,Math.max(10,top+fh-gt0),gr).setOrigin(0,0); gt.tileScaleX=gt.tileScaleY=gs; this.menu.add(gt);
    const fr=this.add.graphics(); fr.lineStyle(3,0xffd166,.85).strokeRoundedRect(fx,top,fw,fh,20); this.menu.add(fr);
    this.hubEvery?.(66,0,()=>{ if(!mt.active||this._patrolDim)return; mt.tilePositionX+=12*.066/ms; gt.tilePositionX+=40*.066/gs; }); return true; }
  patrolFoe(ch,x,gy){ if(!this.textures.exists('pt_foes'))return null; const row=ch*2+(Math.random()<.5?0:1),key='pt_foe_r'+row; if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers('pt_foes',{start:row*6,end:row*6+5}),frameRate:8,repeat:-1});
    const s=this.add.sprite(x,gy+4,'pt_foes',row*6).setOrigin(.5,118/128).setScale(46/128); s.play(key); return s; }
  patrolPop(x,y,col){ this.a12?.('pt_pop',.2,.4); if(!this.textures.exists('pt_pop'))return false; if(!this.anims.exists('pt_pop_a'))this.anims.create({key:'pt_pop_a',frames:this.anims.generateFrameNumbers('pt_pop',{start:0,end:5}),frameRate:16,repeat:0});
    const s=this.add.sprite(x,y,'pt_pop',0).setScale(70/128).setTint(col); this.menu.add(s); s.play('pt_pop_a'); s.once?.('animationcomplete',()=>s.destroy()); this.time?.delayedCall?.(700,()=>{ if(s.active)s.destroy(); }); return true; }
  /* v8.1.70 สกินเต็มตัว: key ภาพเดิม → key สกิน (ถ้าใส่สกินและภาพโหลดแล้ว) · ยังไม่โหลด = สั่งโหลดแล้ววาดหน้าใหม่ · ไม่มีอาร์ต = ภาพเดิม */
  skinKey(k,hero){ if(typeof Cos==='undefined'||!Save.data)return k; const sk=Cos.skin(hero||Save.data.character||'momo'); if(!sk)return k; const q=k+'__'+sk.tag; if(this.realTex?.(q))return q; this.skinLoad(q); return k; }
  skinLoad(q){ const fx=typeof ASSET_FX!=='undefined'&&!!ASSET_FX[q],has=fx||typeof ASSET_IMAGES!=='undefined'&&ASSET_IMAGES[q]||typeof ASSET_SHEETS!=='undefined'&&ASSET_SHEETS[q]; if(!has||!this.ensureGroup||(this._skinLoading||(this._skinLoading=new Set())).has(q))return false; this._skinLoading.add(q);
    try{ this.ensureGroup(k=>k===q,()=>{ this._skinLoading.delete(q); if(this.state==='menu'&&this.realTex?.(q))this.buildMenuScreen(); },{all:true,quiet:true,fx}); }catch(e){ this._skinLoading.delete(q); } return true; }
  // ในด่าน: สลับ texture ใต้ชื่อเดิม (char_<hero>* ↔ char_<hero>*__tag) เพื่อให้ทุกจุดที่ setTexture/setFrame/anim ใช้ภาพสกินโดยไม่ต้องแก้โค้ดต่อสู้
  skinSwap(on){ const T=this.textures; if(!T?.renameTexture)return 0; const done=this._skinSwapped||[]; this._skinSwapped=[]; let n=0;
    for(const [k,q] of done){ if(!T.exists(k+'__orig'))continue; if(T.exists(k)){ if(!T.exists(q))T.renameTexture(k,q); else T.remove(k); } T.renameTexture(k+'__orig',k); n++; }
    if(n)this.skinFixAnims(done.map(d=>d[0]));
    if(!on)return n; const sk=typeof Cos!=='undefined'&&Save.data&&Cos.skin(this.character||Save.data.character); if(!sk)return 0; const base='char_'+sk.hero,list=[];
    for(const k of T.getTextureKeys())if((k===base||k.startsWith(base+'_'))&&!k.includes('__')){ const q=k+'__'+sk.tag; if(T.exists(q)&&!T.exists(k+'__orig')){ T.renameTexture(k,k+'__orig'); T.renameTexture(q,k); list.push([k,q]); } }
    this._skinSwapped=list; if(!list.length)return 0; const keys=list.map(d=>d[0]); this.skinFixAnims(keys);
    const p=this.player,pk=p?.texture?.key; if(pk&&pk.endsWith('__orig')&&keys.includes(pk.slice(0,-6)))try{ p.setTexture(pk.slice(0,-6),p.frame?.name); }catch(e){}
    return list.length; }
  skinFixAnims(keys){ const A=this.anims; if(!A?.anims?.each)return; A.anims.each((key,an)=>{ for(const f of an.frames||[])if(keys.includes(f.textureKey)){ const t=this.textures.get(f.textureKey),fr=t&&t.get(f.textureFrame); if(fr)f.frame=fr; } }); }
  /* v8.1.69 เจ้าของ: ของแต่งดูลอย → จุดยึดต่อฮีโร่ (จาก LOBBY_FACE: หัว/หลัง/เท้า) + ขยับตามท่าหายใจ/โยก/กระโดดของฮีโร่ (lobbyHeroWarp) */
  cosAnchor(x,footY,hh){ const c=(this.menuScreen==='wardrobe'&&this._wardHeroC)||Save.data?.character||'momo',f=LOBBY_FACE[c]||[.5,.28,.27,1],hx=x+(f[0]-.5)*hh*.55,hy=footY-hh*(1-f[1]),feet=footY-hh*(1-f[3]),top=hy-f[2]*hh*.55;
    return {hx,hy,top,feet,back:{x:hx,y:hy+(feet-hy)*.3}}; }
  cosAttach(o,footY,hh,bob){ if(!o)return o; (this._cosAttach||(this._cosAttach=[])).push({o,bx:o.x,by:o.y,h:Math.max(0,Math.min(1,(footY-o.y)/hh)),bob:bob||0,ph:Math.random()*6}); return o; }
  cosFollow(st,x0,y0,sx,sy){ const L=this._cosAttach; if(!L||!L.length)return; const t=st.t; this._cosAttach=L.filter(q=>q.o&&q.o.active);
    for(const q of this._cosAttach){ const h=q.h,dx=st.amp*(h*h*4.2*Math.sin(t*1.15)+h*h*h*1.6*Math.sin(t*3.3+h*5))+(st.lean||0)*h; q.o.x=x0+(q.bx-x0)*sx+dx; q.o.y=y0-st.hop-(y0-q.by)*sy+(q.bob?Math.sin(t*1.6+q.ph)*q.bob:0); if(st.spin)q.o.rotation=st.spin*(q.h>.2?1:0); } }
  lobbyCos(x,footY,hh,ov,scr){ if(typeof Cos==='undefined'||!Save.data)return; scr=scr||'hub'; this._cosAttach=[]; if(this.cosEnsure(()=>{ if(this.state==='menu'&&this.menuScreen===scr)this.buildMenuScreen(); }))return; const E=sl=>ov&&(sl in ov)?ov[sl]:Cos.equipped(sl),wg=E('wings'),pt=E('pet'),tr=E('trail'),hl=E('halo'),au=E('aura'),A=this.cosAnchor(x,footY,hh);
    const sp=(c,px,py,sz,fs)=>{ const pk=this.cosPick(c); if(pk&&pk.motion){ const o=this.add.sprite(px,py,pk.k).setOrigin(pk.fx.ox??.5,pk.fx.oy??.5).setScale(Math.min(sz/pk.fx.fh,1)); if(this.bpAnim?.(pk.k))o.play(pk.k); const t=Cos.tint(c); if(t!=null)o.setTint(t); return o; } if(!pk)this.cosEnsurePrev?.(c);   /* v8.3.21 motion art */
      let k='cos_'+c.id; const hd=k+'_hd'; if(typeof ASSET_FX!=='undefined'&&ASSET_FX[hd]){ if(this.realTex?.(hd)){ k=hd; fs=ASSET_FX[hd].fw||fs; } else this.skinLoad?.(hd); }   /* v8.1.70 สัตว์เลี้ยง HD (ใบ 69 G) ใน Lobby ไม่ต้องขยาย */
      if(!this.realTex?.(k))return null; const o=this.add.sprite(px,py,k).setScale(Math.min(sz/fs,k===hd?1:COS_LOBBY_MAX)); if(this.bpAnim?.(k))o.play(k); const t=Cos.tint(c); if(t!=null)o.setTint(t); return o; };
    if(au){ let o=sp(au,x,A.feet-2,hh*.9,160); if(!o){ o=this.add.graphics(); const r=hh*.45; o.lineStyle(3,Cos.col(au),.6).strokeEllipse(0,0,r*2,r*.6).fillStyle(Cos.col(au),.14).fillEllipse(0,0,r*2,r*.6); o.setPosition(x,A.feet-2); } this.menu.add(o); this.tweens?.add({targets:o,alpha:.55,duration:1200,yoyo:true,repeat:-1}); }
    if(wg){ let o=sp(wg,A.back.x,A.back.y,hh*.95,128); if(!o){ o=this.add.graphics(); const r=hh*.2,col=Cos.col(wg); o.fillStyle(col,.85).fillEllipse(-r*.75,0,r*1.1,r*1.6).fillEllipse(r*.75,0,r*1.1,r*1.6).lineStyle(2,0xffffff,.6).strokeEllipse(-r*.75,0,r*1.1,r*1.6).strokeEllipse(r*.75,0,r*1.1,r*1.6); o.setPosition(A.back.x,A.back.y); }
      this.menu.add(o); this.cosAttach(o,footY,hh); this.tweens?.add({targets:o,scaleX:(o.scaleX||1)*1.06,duration:600,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
    if(pt){ const px=A.hx+hh*.4,py=A.hy+hh*.06; let o=sp(pt,px,py,hh*.3,96); if(o)o.setFlipX?.(true); else o=this.add.text(px,py,pt.emoji,{fontSize:Math.round(hh*.16)+'px'}).setOrigin(.5);
      this.menu.add(o); this.cosAttach(o,footY,hh,7); }
    if(hl){ this._cosLobbyHalo={x:A.hx,y:A.top-hh*.025,hh,c:hl,footY}; if(scr==='hub'){ const zs=this.tapZones; this.time?.delayedCall?.(0,()=>{ if(this.state==='menu'&&this.menuScreen==='hub'&&this.tapZones===zs)this.lobbyCosHalo(); else this._cosLobbyHalo=null; }); } }
    if(tr)this.hubEvery?.(450,300,()=>{ const sx=x+(Math.random()-.5)*hh*.5,sy=A.feet-2,tm='cos_'+tr.id+'_motion',o=this.realTex?.(tm)?this.add.sprite(sx,sy,tm).setScale(.4*48/ASSET_FX[tm].fw):this.realTex?.(tr.tk)?this.add.image(sx,sy,tr.tk,tr.tf).setScale(.4):this.add.circle(sx,sy,4,Cos.col(tr),.9); if(o.anims&&this.realTex?.(tm)&&this.bpAnim?.(tm))o.play(tm); const t=Cos.tint(tr); if(t!=null&&o.setTint)o.setTint(t);
      this.menu.add(o); this.tweens?.add({targets:o,y:sy-hh*.25,alpha:0,duration:1200,onComplete:()=>o.destroy()}); }); }
  lobbyCosHalo(){ const h=this._cosLobbyHalo; this._cosLobbyHalo=null; if(!h)return; let o; const k='cos_'+h.c.id; if(this.realTex?.(k)){ o=this.add.sprite(h.x,h.y,k).setScale(Math.min(h.hh*.42/96,COS_LOBBY_MAX)); if(this.bpAnim?.(k))o.play(k); const t=Cos.tint(h.c); if(t!=null)o.setTint(t); } else { o=this.add.graphics(); const r=h.hh*.17; o.lineStyle(5,Cos.col(h.c),.95).strokeEllipse(0,0,r*2,r*.6).lineStyle(2,0xffffff,.8).strokeEllipse(0,-1,r*1.6,r*.45); o.setPosition(h.x,h.y); }
    this.menu.add(o); this.cosAttach(o,h.footY,h.hh,3); }
  cosTap(c,cur){ if(Cos.owns(c.id)){ Cos.toggle(c.id); Sfx.menuCue?.(Cos.equipped(c.slot)?.id===c.id?'ui_cos_equip':'ui_cos_unequip',.4)||Sfx.select?.(); this.buildWardrobe(); return; }
    if(this._cosPrev!==c.id){ this._cosPrev=c.id; Sfx.ui?.(); this.buildWardrobe(); return; }   /* v8.1.68 แตะครั้งแรก = ลองใส่ · ซื้อจากแถบล่าง */
    if(Cos.buy(c.id,cur)){ Sfx.menuCue?.('ui_cos_buy',.5)||Sfx.clear?.(); this.showBanner?.('✨ '+c.name,'Equipped on every hero',1500); } else { Sfx.error?.(); this.showBanner?.(cur==='lolli'?'🍭 Not enough Lollipops':'🧶 Not enough Thread','Requires '+c.price+(cur==='lolli'?' Lollipops':' Thread'),1400); } this.buildWardrobe(); }
  /* v8.2.55 มี 🍭 Lollipops = ปุ่มจ่าย 2 ทางคู่กัน (🧶 Thread | 🍭 Lollipops ราคาเท่ากัน) · ไม่มี 🍭 = ปุ่มเดิม (คืน false) */
  wardPayRow(x,by,bw,hh,price,buy,btn,tag){ const L=Save.lollipops?.()||0; if(L<=0)return false; const hw=(bw-30)/2,ct=Save.threads()>=price,cl=L>=price;
    btn(x+10,by,hw,hh,ct?0xe0558f:0x4a3a55,ct?0xffd166:0x7a6a88,'🧶 '+price,()=>{ if(!ct){ Sfx.error?.(); this.menuToast?.('🧶 Need '+(price-Save.threads())+' more Thread','#ffb3c8'); return; } buy('thread'); },tag);
    btn(x+20+hw,by,hw,hh,cl?0xd0569e:0x4a3a55,cl?0xffb8e8:0x7a6a88,'🍭 '+price,()=>{ if(!cl){ Sfx.error?.(); this.menuToast?.('🍭 Need '+(price-L)+' more Lollipops','#ffb3c8'); return; } buy('lolli'); },tag+'_lolli');
    return true; }
  loadCosArt(){ if(!this._cosPaint&&this.ensureGroup&&typeof ASSET_FX!=='undefined'&&ASSET_FX.cos_accessories_paint&&!this.realTex?.('cos_accessories_paint')){ this._cosPaint=true; try{ this.ensureGroup(k=>/^(cos_wing_\w+_paint|cos_accessories_paint)$/.test(k),()=>{ if(this.state==='menu'&&this.menuScreen==='wardrobe')this.buildWardrobe(); },{all:true,quiet:true,fx:true}); }catch(e){} }   /* v8.3.21 ไอคอนร้านแบบใหม่ */
    if(!this._skinBan&&this.ensureGroup&&typeof ASSET_IMAGES!=='undefined'&&ASSET_IMAGES.skin_banner69&&!this.realTex?.('skin_banner69')){ this._skinBan=true; try{ this.ensureGroup(k=>k==='skin_banner69',()=>{ if(this.state==='menu'&&this.menuScreen==='wardrobe')this.buildWardrobe(); },{all:true,quiet:true}); }catch(e){} }
    if(this._cosArt||!this.ensureGroup||typeof ASSET_FX==='undefined'||!(ASSET_FX.cos_icons||ASSET_FX.cos_icons2))return; if(this.realTex?.('cos_icons')&&(!ASSET_FX.cos_icons2||this.realTex?.('cos_icons2'))&&(!ASSET_FX.skin_icons69||this.realTex?.('skin_icons69')))return; this._cosArt=true; try{ this.ensureGroup(k=>/^(cos_icons|skin_icons69)/.test(k),()=>{ if(this.state==='menu'&&this.menuScreen==='wardrobe')this.buildWardrobe(); },{all:true,quiet:true,fx:true}); }catch(e){} }
  /* ในด่าน: ปีกหลังตัว · สัตว์เลี้ยงลอยตาม · หางประกายตอนเดิน (ไม่มีภาพ = วาดด้วยโค้ด) */
  /* v8.3.21 Wardrobe motion art (8 เฟรม) มาก่อน → ภาพเดิม → วาดด้วยโค้ด · cosArtKey = คีย์ที่ควรโหลด · cosPick = คีย์ที่โหลดแล้ว */
  cosArtKey(c){ if(!c)return null; const m='cos_'+c.id+'_motion',old=c.tk||('cos_'+c.id); return typeof ASSET_FX!=='undefined'&&ASSET_FX[m]&&!(this._cosTried&&this._cosTried.has(m))?m:old; }
  cosPick(c){ if(!c)return null; const m='cos_'+c.id+'_motion',old=c.tk||('cos_'+c.id); if(this.realTex?.(m))return {k:m,fx:ASSET_FX[m],motion:true}; if(this.realTex?.(old))return {k:old,fx:typeof ASSET_FX!=='undefined'?ASSET_FX[old]:null,motion:false}; return null; }
  cosIcon(c){ if(!c)return null; if(c.slot==='wings'){ const k='cos_'+c.id+'_paint'; if(this.realTex?.(k))return [k,undefined]; } else { const i=COS_ACC_ICONS.indexOf(c.id); if(i>=0&&this.realTex?.('cos_accessories_paint'))return ['cos_accessories_paint',i]; } return c.icon; }
  cosWornKeys(){ if(typeof Cos==='undefined'||!Save.data)return []; const out=[]; for(const [sl] of COS_SLOTS){ const c=Cos.equipped(sl); if(c)out.push(this.cosArtKey(c)); } return out; }
  cosNeedKeys(){ if(typeof Cos==='undefined'||!Save.data)return []; const out=[]; for(const [sl] of COS_SLOTS){ const c=Cos.equipped(sl); if(!c)continue; const k=this.cosArtKey(c); if(ASSET_FX[k]&&!this.realTex?.(k)&&!(this._cosTried&&this._cosTried.has(k)))out.push(k); } return out; }
  cosEnsure(after){ const need=this.cosNeedKeys(); if(!need.length||!this.ensureGroup)return false; if(this._cosLoading){ (this._cosWait||(this._cosWait=[])).push(after); return true; }   /* v8.1.67 กำลังโหลดอยู่ = เข้าคิวรอ (เดิมเข้าด่านเร็วได้ภาพแทน) */ this._cosLoading=true; (this._cosTried||(this._cosTried=new Set())); try{ this.ensureGroup(k=>need.includes(k),()=>{ this._cosLoading=false; need.forEach(k=>{ if(!this.realTex?.(k))this._cosTried.add(k); }); after&&after(); const q=this._cosWait||[]; this._cosWait=[]; q.forEach(f=>{ try{ f&&f(); }catch(e){} }); },{all:true,quiet:true,fx:true}); }catch(e){ this._cosLoading=false; return false; } return true; }
  cosSetup(){ if(this.state==='play'&&this.cosEnsure(()=>{ if(this.state==='play')this.cosSetup(); }))return; (this._cosObjs||[]).forEach(o=>o?.destroy?.()); this._cosObjs=[]; this._cosW=this._cosP=this._cosH=this._cosA=null; this._cosDashSeen=undefined; const p=this.player; if(!p||typeof Cos==='undefined'||!Save.data)return;
    const wg=Cos.equipped('wings'),pt=Cos.equipped('pet'),hl=Cos.equipped('halo'),au=Cos.equipped('aura'); this._cosTrail=Cos.equipped('trail'); this._cosDash=Cos.equipped('dash'); this._cosPop=Cos.equipped('pop');
    const add=o=>{ this.camWorld(o); this._cosObjs.push(o); return o; },sp=(c,sc,base)=>{ const pk=this.cosPick(c); if(!pk)return null; const k=pk.k; if(pk.motion){ sc=sc*(base||pk.fx.fh)/pk.fx.fh; } const o=this.add.sprite(p.x,p.y,k).setScale(sc); o._cosB=sc; if(pk.motion)o.setOrigin(pk.fx.ox??.5,pk.fx.oy??.5); if(this.bpAnim?.(k))o.play(k); const t=Cos.tint(c); if(t!=null)o.setTint(t); return o; };
    if(wg){ let o=sp(wg,.45,128); if(!o){ const col=Cos.col(wg); o=this.add.graphics(); o.fillStyle(col,.85).fillEllipse(-14,-4,24,34).fillEllipse(14,-4,24,34).lineStyle(2,0xffffff,.6).strokeEllipse(-14,-4,24,34).strokeEllipse(14,-4,24,34); } this._cosW=add(o); }
    if(pt){ let o=sp(pt,.4,96); if(!o)o=this.add.text(p.x,p.y,pt.emoji,{fontSize:'22px'}).setOrigin(.5); this._cosP=add(o); }
    if(hl){ let o=sp(hl,.42); if(!o){ o=this.add.graphics(); o.lineStyle(4,Cos.col(hl),.95).strokeEllipse(0,0,30,10).lineStyle(1.5,0xffffff,.8).strokeEllipse(0,-1,24,7); } this._cosH=add(o); }
    if(au){ let o=sp(au,.44); if(!o){ o=this.add.graphics(); o.lineStyle(3,Cos.col(au),.6).strokeEllipse(0,0,64,24).fillStyle(Cos.col(au),.14).fillEllipse(0,0,64,24); } this._cosA=add(o); } this._cosT=0; }
  tickCos(dt){ const p=this.player; if(!p?.active)return; this._cosT=(this._cosT||0)+dt; const hh=p.displayHeight||48;
    const W=this._cosW; if(W?.active){ W.setPosition(p.x,p.y-hh*.12); W.setDepth((p.depth||5)-2); const b=W.setFrame?(W._cosB||.45):1; W.setScale?.(b*(1+Math.sin(this._cosT*8)*.06),b); if(W.setFlipX)W.setFlipX(!!p.flipX); }
    const H=this._cosH; if(H?.active){ H.setPosition(p.x,p.y-hh*.95+Math.sin(this._cosT*3)*2); H.setDepth((p.depth||5)+.02); }
    const A=this._cosA; if(A?.active){ A.setPosition(p.x,p.y+hh*.42); A.setDepth((p.depth||5)-3); if(!A.setFrame)A.rotation=0; A.setAlpha(.75+Math.sin(this._cosT*2)*.15); }
    if(this._lastDashAt!==this._cosDashSeen){ if(this._cosDashSeen!==undefined&&this._lastDashAt!=null)this.cosDashFx(); this._cosDashSeen=this._lastDashAt; }   // doDash ล็อกด้วยเทส → ตรวจจากเวลาพุ่งล่าสุด
    const P=this._cosP; if(P?.active){ const tx=p.x+(p.flipX?28:-28),ty=p.y-34+Math.sin(this._cosT*3)*5,k=Math.min(1,dt*5); P.x+=(tx-P.x)*k; P.y+=(ty-P.y)*k; P.setDepth((p.depth||5)+.01); P.setFlipX?.(P.x>p.x); }
    const T=this._cosTrail; if(T&&(this.moveDir?.lengthSq?.()||0)>.04){ this._cosTA=(this._cosTA||0)+dt; if(this._cosTA>=.12){ this._cosTA=0; if((typeof PERF!=='undefined'&&PERF.lvl>=2))return; const tm='cos_'+T.id+'_motion',o=this.realTex?.(tm)?this.add.sprite(p.x,p.y+14,tm).setScale(.35*48/ASSET_FX[tm].fw):this.realTex?.(T.tk)?this.add.image(p.x,p.y+14,T.tk,T.tf).setScale(.35):this.add.circle(p.x,p.y+14,4,Cos.col(T),.85); if(o.anims&&this.realTex?.(tm)&&this.bpAnim?.(tm))o.play(tm);   /* v8.3.21 motion trail */ const t=Cos.tint(T); if(t!=null&&o.setTint)o.setTint(t); o.setDepth((p.depth||5)-.02); this.camWorld(o); this.tweens.add({targets:o,alpha:0,scale:(o.scale||1)*.4,y:o.y-10,duration:520,onComplete:()=>o.destroy()}); } } }
  cosDashFx(){ const c=this._cosDash,p=this.player; if(!c||!p?.active)return; Sfx.orderCue?.(c.id.replace('dash_','cos_dash_'),.3,.2); if(typeof PERF!=='undefined'&&PERF.lvl>=2)return; const m='cos_'+c.id+'_motion'; if(this.realTex?.(m)&&this.heroFx?.(m,p.x,p.y,72,{tint:Cos.tint(c)}))return; const k='cos_'+c.id; if(this.realTex?.(k)&&this.heroFx?.(k,p.x,p.y,64,{tint:Cos.tint(c)}))return; this.burst?.(p.x,p.y,Cos.col(c)); }
  bazaarBuyGear(id,key,cost){ const it=GEAR_ALL.find(g=>g.id===id);if(!it)return; cost=cost||GEAR_BUY[it.tier]||200;
    if(key&&(Save.data.bazaarBought||[]).includes(key))return;
    if(!Save.spend(cost)){Sfx.error();this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar',1300);return;}
    const zone=Math.max(1,Math.min(18,Save.data.bazaarZone||1)),si=Math.floor((zone-1)/3),diff=((zone-1)%3)+1,ilvl=rollItemLevel(si,diff);   // iLv อ้างอิง Zone ของด่านล่าสุด
    const delivery=Save.receiveGearInstance(id,{isNew:true,itemLevel:ilvl,chapter:itemChapterFromLevel(ilvl)});
    if(key){Save.data.bazaarBought=(Save.data.bazaarBought||[]).concat(key);Save.save();}
    Sfx.clear();this.showBanner('🛒 Purchased',it.emoji+' '+it.name+' · iLv '+ilvl+gearDeliverySuffix(delivery),1600);this.buildBazaar(); }
  bazaarBuyCurrency(key,qty,cost,slotKey){ if(slotKey&&(Save.data.bazaarBought||[]).includes(slotKey))return; if(!Save.spend(cost)){ Sfx.error(); this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar',1300); return; }
    Save.addCurrency(key,qty); if(slotKey){Save.data.bazaarBought=(Save.data.bazaarBought||[]).concat(slotKey);Save.save();} Sfx.clear(); const d=currencyDef(key); this.showBanner('🛒 Purchased',d.emoji+' '+d.name+' ×'+qty,1400); this.buildBazaar(); }
  // ตู้สล็อต: หมุนไอคอนช้าลงเรื่อย ๆ แล้วหยุดที่รางวัล (ลุ้นสนุก)
  bazaarSlotReveal(pool,land){ if(this.loadRevealTheater?.(()=>this.bazaarSlotReveal(pool,land)))return;this.setMenuScroll(0); if(this._bazBusy)return; this._bazBusy=true; this.tapZones=[]; const w=this.W,h=this.H;
    const veil=this.add.rectangle(0,0,w,h,0x0a0611,0.92).setOrigin(0),title=this.add.text(w/2,h*0.30,'🎰 Rolling…',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffe08a'}).setOrigin(0.5),glow=this.add.image(w/2,h*0.34,'vfx_glow').setTint(0xffd166).setScale(0.5).setAlpha(0.25),icon=this.add.image(w/2,h*0.34,'prize_chest').setDisplaySize(96,96);
    glow.setVisible(false);this.menu.add(veil);this.revealBackdrop?.(this.menu,w,h);this.menu.add([title,glow,icon]); this.menu.setVisible(true);
    let ticks=0,delay=55; const spin=()=>{ if(!icon.scene){this._bazBusy=false;return;} const key=Phaser.Utils.Array.GetRandom(pool);icon.setTexture(this.textures.exists(key)?key:'prize_chest').setDisplaySize(96,96); Sfx.select&&Sfx.select(); ticks++;
      if(ticks<26){ delay+=ticks>17?(ticks-17)*10:2; this.time.delayedCall(delay,spin); }
      else { const resultKey=land.artKey&&this.textures.exists(land.artKey)?land.artKey:'prize_currency';icon.setTexture(resultKey).setDisplaySize(96,96);this.tweens.add({targets:icon,scaleX:icon.scaleX*1.18,scaleY:icon.scaleY*1.18,duration:300,ease:'Back.out'});
        title.setText(land.title||'✨ Prize!'); glow.setScale(.48).setAlpha(.18); this.screenFlash(0xffd166,0.5,420); Sfx.clear();
        const sub=this.add.text(w/2,h*0.63,land.sub||'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff',align:'center',wordWrap:{width:w-50}}).setOrigin(0.5);
        const bt=this.add.text(w/2,h*0.74,land.auto?'Tap to stop AUTO':'Tap to continue',{fontFamily:'sans-serif',fontSize:'12px',color:'#c7bdd6'}).setOrigin(0.5); this.menu.add([sub,bt]);
        this._bazBusy=false; const tok=(this._bazAutoTok=(this._bazAutoTok||0)+1);
        this._zone(0,0,w,h,()=>{this._bazAutoTok++;this._bazAutoN=0;if(land.back==='tradein')this.buildTradeIn();else this.buildBazaar();});
        if(land.auto)this.time.delayedCall(650,()=>{ if(tok!==this._bazAutoTok||this.menuScreen!=='bazaar')return; this.menu.removeAll(true); land.auto(); }); }
    }; if(land.auto)ticks=14; spin(); }
  // v6.0.71 Trade-in: 3 ชิ้น → 1 ชิ้น · iLv = ค่าเฉลี่ย +2..+5 · เกรดสุ่มจากเกรดของที่ใส่
  // v6.55.58: ของที่ใส่อยู่ไม่โชว์ใน Trade-in · กันเซฟที่ equippedGear หาย (ใช้ gear[slot] เดิม)
  tradeWorn(x){ if(Save.isGearEquipped(x.uid))return true; const eq=(Save.data.equippedGear||{})[x.slot]; return !Save.gearItem(eq)&&(Save.data.gear||{})[x.slot]===x.baseId; }
  tradeInCandidates(){ return (Save.data.gearItems||[]).filter(x=>x&&!x.locked&&!x.favorite&&x.grade!=='start'&&!this.tradeWorn(x)).sort((a,b)=>(b.itemLevel||1)-(a.itemLevel||1)); }
  tradeInPreview(sel){ if(sel.length<3)return null; const avg=sel.reduce((t,x)=>t+(x.itemLevel||1),0)/sel.length; return {lo:Math.min(100,Math.round(avg)+2),hi:Math.min(100,Math.round(avg)+5)}; }
  buildTradeIn(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Gear Trade-in','screen_bazaar','bazaar');
    const w=this.W,h=this.H,hs=this._hdrShift(),items=this.tradeInCandidates();this._tradeSel=(this._tradeSel||[]).filter(u=>items.some(x=>x.uid===u));
    const sel=items.filter(x=>this._tradeSel.includes(x.uid)),pv=this.tradeInPreview(sel);
    const T=(x,y,t,sz,c,o)=>{const tx=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:sz+'px',color:c,align:'center',wordWrap:{width:w-30}}).setOrigin(o??.5,.5);this.menu.add(tx);return tx;};
    T(w/2,92+hs,'Pick 3 gear you don’t need ('+sel.length+'/3)',13,'#ffe08a');
    T(w/2,112+hs,pv?('New item: iLv '+pv.lo+'–'+pv.hi+' · grade from your picks'):'Result item level is based on the average iLv',11,pv?'#a8edc6':'#c5b5d1');
    const cols=4,gap=8,cw=(w-28-gap*(cols-1))/cols,ch=cw+18,top=130+hs,PH=128,rows=Math.max(1,Math.floor((h-top-80-PH)/(ch+gap))),per=cols*rows,pages=Math.max(1,Math.ceil(items.length/per));
    this._tradePage=Math.min(this._tradePage||0,pages-1);
    if(!items.length)T(w/2,top+60,'No tradeable gear (locked, favorite and equipped items are protected)',12,'#c5b5d1');
    items.slice(this._tradePage*per,(this._tradePage+1)*per).forEach((it,i)=>{const cx=14+(i%cols)*(cw+gap),cy=top+Math.floor(i/cols)*(ch+gap),on=this._tradeSel.includes(it.uid),col=Phaser.Display.Color.HexStringToColor((TIER_LABEL[it.grade]||TIER_LABEL.common).color).color;
      const g=this.add.graphics();g.fillStyle(on?0x4a3a14:0x231a2e,.95);g.fillRoundedRect(cx,cy,cw,ch,9);g.lineStyle(on?3:1.5,on?0xffd166:col,1);g.strokeRoundedRect(cx,cy,cw,ch,9);this.menu.add(g);
      const key='gear_'+it.baseId;if(this.textures.exists(key))this.menu.add(this.add.image(cx+cw/2,cy+cw/2,key).setDisplaySize(cw*.66,cw*.66).setAlpha(on?1:.85));else this.menu.add(this.add.text(cx+cw/2,cy+cw/2,(GEAR_ALL.find(x=>x.id===it.baseId)||{}).emoji||'🎁',{fontSize:Math.round(cw*.4)+'px'}).setOrigin(.5));
      const t=this.add.text(cx+cw/2,cy+ch-11,'iLv '+(it.itemLevel||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:on?'#ffe08a':'#ffffff'}).setOrigin(.5);this.menu.add(t);
      if(on)this.menu.add(this.add.text(cx+cw-8,cy+10,'✓',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffd166'}).setOrigin(.5));
      this._zone(cx,cy,cw,ch,()=>{this._tradeView=it.uid;const a=this._tradeSel,k=a.indexOf(it.uid);if(k>=0)a.splice(k,1);else if(a.length<3)a.push(it.uid);else{Sfx.error();return;}Sfx.select&&Sfx.select();this.buildTradeIn();});});
    const by=h-34;
    // v6.55.59: แตะชิ้นไหน = โชว์รายละเอียดชิ้นนั้น
    { const it=items.find(x=>x.uid===this._tradeView)||sel[sel.length-1]||null, py=by-26-PH, g=this.add.graphics(); g.fillStyle(0x1a1424,.95);g.fillRoundedRect(14,py,w-28,PH,10);g.lineStyle(1.5,0x6a5a80,1);g.strokeRoundedRect(14,py,w-28,PH,10);this.menu.add(g);
      if(!it)T(w/2,py+PH/2,'Tap an item to see its details',11,'#9a90ab');
      else{ const base=GEAR_ALL.find(x=>x.id===it.baseId)||{name:it.baseId},tl=TIER_LABEL[it.grade]||TIER_LABEL.common,affs=sortAffixesByKind(it.affixes||[]);
        const key='gear_'+it.baseId; if(this.textures.exists(key))this.menu.add(this.add.image(42,py+30,key).setDisplaySize(40,40));else this.menu.add(this.add.text(42,py+30,base.emoji||'🎁',{fontSize:'26px'}).setOrigin(.5));
        const L=(x,y,t,c,sz,b)=>{const o=this.add.text(x,y,t,{fontFamily:'sans-serif',fontStyle:b?'bold':'normal',fontSize:sz+'px',color:c,wordWrap:{width:w-x-22}}).setOrigin(0,0);this.menu.add(o);return o;};
        L(70,py+8,gearAffixName(base.name,affs),tl.color,12,1);
        L(70,py+26,tl.name+' · iLv '+(it.itemLevel||1)+' · '+gearBaseStatText(it)+(it.enh?' · +'+it.enh:'')+(Save.isGearEquipped(it.uid)?' · Equipped':''),'#cfc3dd',10);
        let ly=py+52; const im=implicitText(it); if(im){L(24,ly,'Implicit  '+im,'#a8d8ff',10);ly+=14;}
        if(!affs.length)L(24,ly,'No mods','#9a90ab',10);
        affs.forEach(a=>{const d=affixDef(a.id);if(!d||ly>py+PH-14)return;L(24,ly,'• '+(d.emoji||'')+' '+d.label+' '+(d.fmt?d.fmt(a.v):a.v)+'  '+tierStarText(d,a.t),affixCategory(d).hex,10);ly+=14;}); } }
    if(pages>1)this.uiPillBtn(this.menu,w*.25,by,w*.42,38,COLORS.grape,'','Page '+(this._tradePage+1)+'/'+pages,()=>{this._tradePage=(this._tradePage+1)%pages;this.buildTradeIn();});
    this.uiPillBtn(this.menu,pages>1?w*.72:w/2,by,pages>1?w*.46:w-40,38,pv?COLORS.pink:0x3a3550,'',pv?'Trade 3 → 1':'Select 3',pv?()=>this.doTradeIn():null);
    this.menu.setVisible(true); }
  doTradeIn(){ const items=this.tradeInCandidates(),sel=items.filter(x=>(this._tradeSel||[]).includes(x.uid)),pv=this.tradeInPreview(sel); if(!pv||sel.length!==3)return;
    const ilv=pv.lo+Math.floor(Math.random()*(pv.hi-pv.lo+1)),grade=Phaser.Utils.Array.GetRandom(sel).grade||'common';
    if(!sel.every(x=>Save.removeGearInstance(x.uid))){Sfx.error();this.buildTradeIn();return;}
    let got=null; for(const t of [grade,'rare','common','epic']){got=this.grantGear(t==='legend'?'epic':t,{tradeLv:ilv});if(got)break;}
    this._tradeSel=[]; if(!got){Save.addThreads(15);this.menuToast('No eligible base · +15 Thread','#f295a8');this.buildTradeIn();return;}
    Sfx.equipment&&Sfx.equipment('equip');
    this.bazaarSlotReveal(GEAR_ALL.map(x=>'gear_'+x.id).filter(k=>this.textures.exists(k)),{artKey:'gear_'+got.id,title:'✨ '+got.name+'!',sub:(TIER_LABEL[got.tier]||TIER_LABEL.common).name+' · iLv '+got.instance.itemLevel+gearDeliverySuffix(got),back:'tradein'}); }
  bazaarGambleCurrency(auto){ if(this._bazBusy)return; const cost=bazaarCurrencyBoxCost(); if(!Save.spend(cost)){ Sfx.error(); this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar',1300); if(auto)this.buildBazaar(); return; }
    const k=rollWeightedCurrency('common')||'alt', d=currencyDef(k); Save.addCurrency(k,1);
    this._bazAutoN=auto?(this._bazAutoN||0)+1:0;
    this.bazaarSlotReveal(CURRENCY.map(c=>c.asset),{artKey:d.asset,title:d.emoji+' '+d.name+'!',sub:auto?('AUTO #'+this._bazAutoN+' · Sugar '+(Save.data.sugar||0)+' · tap to stop'):'',auto:auto?()=>this.bazaarGambleCurrency(true):null}); }
  bazaarSellCurrency(key,val){ if(Save.currency(key)<=0)return; Save.spendCurrency(key,1); Save.addSugar(val); Sfx.select(); this.buildBazaar(); }
  openGachaReveal(){ if(this.loadRevealTheater?.(()=>this.openGachaReveal()))return;this.setMenuScroll(0);
    const lvObj=GACHA_LEVELS[Math.max(0,Math.min(gachaMaxBand(),this._gachaLevel||0))],cost=lvObj.cost,ilv=lvObj.lo+Math.floor(Math.random()*(lvObj.hi-lvObj.lo+1));
    if(this._gachaBusy)return;if((Save.data.sugar||0)<cost){Sfx.error();this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar (iLv '+lvObj.lo+'-'+lvObj.hi+')',1300);return;}
    if(!Save.spend(cost))return;Save.data.chestsOpened=(Save.data.chestsOpened||0)+1;(typeof DailyQ!=='undefined')&&DailyQ.tick('chest');this._gachaBusy=true;this.menu.removeAll(true);this.tapZones=[];
    const w=this.W,h=this.H,bg=this.add.rectangle(0,0,w,h,0x090510,0.97).setOrigin(0,0),title=this.add.text(w/2,h*0.14,'🎁 Flavor box',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffe08a'}).setOrigin(0.5);
    const glow=this.add.image(w/2,h*0.34,'vfx_glow').setScale(0.4).setAlpha(0.3).setTint(0xffd166),chest=this.add.text(w/2,h*0.34,'🎁',{fontSize:'92px'}).setOrigin(0.5).setScale(0.72);
    const status=this.add.text(w/2,h*0.66,'Searching for hidden flavors…',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0.5);
    glow.setVisible(false);this.menu.add(bg);this.revealBackdrop?.(this.menu,w,h);this.menu.add([title,glow,chest,status]);this.menu.setVisible(true);Sfx.chest();
    this.tweens.add({targets:chest,rotation:{from:-0.06,to:0.06},scale:{from:0.72,to:0.88},duration:90,yoyo:true,repeat:8});
    this.tweens.add({targets:glow,rotation:0,scale:.5,alpha:{from:0.08,to:0.18},duration:900,ease:'Cubic.in'});
    this.time.delayedCall(420,()=>{ if(status.active)status.setText('COMMON  ·  RARE  ·  EPIC').setColor('#fff0b8'); });
    this.time.delayedCall(920,()=>{
      const first=!Save.data.firstChestDone;if(first)Save.data.firstChestDone=1;const it=this.gachaRoll(ilv,first?'common':null);let tier=it?it.tier:'common';if(!it){Save.addSugar(120);Save.addThreads(6);}
      if(!status.active||this.state!=='menu')return;   // v7.9.35 ออกจากหน้าก่อนเปิดกล่อง → ของยังได้ แต่ไม่วาดต่อ (เดิม setText บนข้อความที่ถูกลบ = error)
      const color=tier==='legend'?0xff8f3a:tier==='epic'?0xc9a3ff:tier==='rare'?0xffcf5a:0x8bd3a0,hex='#'+color.toString(16).padStart(6,'0');
      const gArt=it?('gear_'+it.id):null;
      if(gArt&&this.textures.exists(gArt)){ chest.setText(''); const gi=this.add.image(w/2,h*0.34,gArt).setDisplaySize(120,120); const ts=gi.scaleX; gi.setScale(ts*0.2); this.menu.add(gi); this.tweens.add({targets:gi,scaleX:ts,scaleY:ts,duration:340,ease:'Back.out'}); }
      else chest.setRotation(0).setScale(1.05).setText(it?it.emoji:'🧶');
      glow.setTint(color).setScale(.5).setAlpha(.18);
      this.screenFlash(color,tier==='legend'?0.85:tier==='epic'?0.68:tier==='rare'?0.48:0.30,520);this.screenShake(tier==='legend'?620:tier==='epic'?480:260,tier==='legend'?0.02:tier==='epic'?0.014:0.007);Sfx.clear();
      title.setText(it?(tier==='legend'?'🌟 LEGEND DROP 🌟':tier==='epic'?'✦ EPIC DROP ✦':tier==='rare'?'★ RARE DROP ★':'COMMON DROP'):'All owned');
      title.setColor(hex);status.setText(it?(it.name+'\n'+TIER_LABEL[tier].name+gearDeliverySuffix(it)):'Refund 🍬120 · 🧶6').setColor('#ffffff').setAlign('center').setFontSize('18px');
      for(let i=0;i<(tier==='epic'?14:8);i++){const a=i*TAU/(tier==='epic'?14:8),p=this.add.circle(w/2,h*0.34,2,color,1).setScale(0.8).setAlpha(0.9);this.menu.add(p);this.tweens.add({targets:p,x:w/2+Math.cos(a)*Math.min(w*0.38,180),y:h*0.34+Math.sin(a)*Math.min(h*0.25,150),alpha:0,duration:700+i*18,onComplete:()=>p.destroy()});}
      const bw=Math.min(w-60,260),by=h*0.80,btn=this.add.graphics();btn.fillStyle(color,1);btn.fillRoundedRect(w/2-bw/2,by-24,bw,48,16);btn.lineStyle(2,0xffffff,0.42);btn.strokeRoundedRect(w/2-bw/2,by-24,bw,48,16);
      const bt=this.add.text(w/2,by,'Claim and return',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#17101d'}).setOrigin(0.5);this.menu.add([btn,bt]);
      this._gachaBusy=false;this._zone(w/2-bw/2,by-24,bw,48,()=>{this._bazTab='chests';this.menuScreen='bazaar';this.buildMenuScreen();});
    });
  }
  applyMeta(){ if(this.player){this.player._tagIgnite=0;this.player._tagChill=0;this.player._tdBerserk=false;this.player._cond={};}
    const p=this.player;
    p.forgeMods={};p._forgeHp=0;p.cdMul=1;p.powerMul=1;p.armor=0;p.gearAttackMin=0;p.gearAttackMax=0; p.dmgTakenMul=1; p.flatDmg=0;   // ตัวคูณ/ดาเมจตรง (รีเซ็ตก่อน)
    p.sugarFindMul=1; p.boxFindMul=1; p.currencyFindMul=1; p.uniqueCdMul=1; p.gearDashNova=0; p.gearCritArc=0; p.gearKillShell=0; p.gearStillDmg=0; p.gearOpener=0; p.gearThorns=0; p.gearCount=0; p.gearBounce=0; p.gearArea=0; p.critChance=0; p.critMul=1.55; p.regen=0; p.regenFlat=0; p.regenPct=0; p.lifeOnKill=0; p.healEffect=1; p.lifesteal=0; p.memoryAmp=0; p.lowHpDmg=0; p._uqGlass=0; p._uqNoRegen=false; p._uqCritBurst=0;
    p.bossDmg=0; p.lowHpGuard=0; p.xpMul=1; p.dashCdMul=1; if(this._runTrait?.player)this._runTrait.player(p);   // v7.8.100 ลักษณะพิเศษของรอบ
    p.twinSprinkle=false; p.deepFreeze=false; p.donutImpact=false; p.echoPath=false; p.mirrorWard=false; p.pressurizedJam=false; p._gearRevive=0;
    p.weaponDmgMul=1;p.weaponCdMul=1;p.weaponShots=0;p.weaponAreaMul=1;p.weaponControlMul=1;p.weaponChains=0;p.weaponReflect=0;
    // เลือกตัวละคร
    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
    const ch=CHARACTERS[this.character];
    const baseCharKey='char_'+this.character;
    if(this.textures.exists(baseCharKey))this.player.setTexture(baseCharKey);
    this.setCharScale(baseCharKey);   // รูปจริงตัวใหญ่ → ปรับสเกล/ขอบชนให้สมดุลกับตัวละคWaitื่น
    if(this.aura)this.aura.setFillStyle(ch.color||COLORS.mochiEdge,0.14);
    // Combat Profile ใหม่
    const st=ch.stats||{};if(st.hp)p.maxhp+=st.hp;if(st.dmg)p.dmgMul*=st.dmg;if(st.spd)p.baseSpeed*=st.spd;
    if(st.def)p.dmgTakenMul*=st.def;if(st.crit)p.critChance+=st.crit;if(st.cdr)p.cdMul*=st.cdr;if(st.regenFlat)p.regenFlat+=st.regenFlat;
    // Weapon Mastery มีผลเฉพาะอาวุธประจำตัว
    const sw=SIGNATURE_WEAPONS[ch.weapon]||SIGNATURE_WEAPONS.berryBlaster;this.signatureWeapon=sw;
    p.weaponDmgMul=sw.dmgMul||1;p.weaponCdMul=sw.cdMul||1;p.weaponShots=sw.shots||0;p.weaponAreaMul=sw.areaMul||1;
    p.weaponControlMul=sw.controlMul||1;p.weaponChains=sw.chains||0;p.weaponReflect=sw.reflect||0;
    // Talents (Signature talents)
    const ctals=Save.cp(this.character).tal||{};
    const myTalDefs=charTalents(this.character);
    for(const def of myTalDefs){ const r=ctals[def.id]||0; if(r>0&&def.apply) def.apply(p,r); }
    { const cpl=Save.cp(this.character).lvl||1,ps=charPassiveScale(cpl); this._cpas={id:this.character,s:ps,cd:0}; if(this.character==='cocoa'){ p.lowHpGuard=(p.lowHpGuard||0)+0.15*ps; p.lowHpDmg=(p.lowHpDmg||0)+0.20*ps; } }   // v4.88 passive ประจำตัว
    // passivesสวรรค์ถาวร (HP/ATK/DEF) — ใช้ผลรวม ยศ×TAL_MAX + เลเวลWaitบนี้
    for(const k in UPGRADES){ const tot=Save.talTotal(k); if(tot>0)UPGRADES[k].apply(p,tot); }
    applySpecialCores(p);
    for(const slot in GEAR){const inst=Save.equippedGearItem(slot),it=inst&&GEAR_ALL.find(g=>g.id===inst.baseId);if(it&&it.apply){if(it.tier==='start')it.apply(p,Save.gearLv(inst.uid));else applyScaledGear(p,it,Save.gearLv(inst.uid),inst.itemLevel,inst);applyItemLevelBonus(p,inst); if(slot==='weapon'&&it.tier!=='start')p.powerMul=itemPowerMul(inst.itemLevel);
      if(it.tier!=='start'){const affs=Save.ensureAffix(inst.uid,it.tier);for(const a of affs){const ad=affixDef(a.id);if(ad&&!weaponLocalMod(inst,a.id))ad.apply(p,a.v);}}}}
    // ชุดอุปกรณ์ (Set Bonus): สวมของชุดเดียวกันครบ 2/3 ชิ้น = โบนัสสะสม
    const setCounts=gearSetCounts();
    for(const sid in setCounts){ const def=GEAR_SETS[sid]; if(!def)continue; for(const need in def.bonuses){ if(setCounts[sid]>=+need&&def.bonuses[need].apply)def.bonuses[need].apply(p); } }
    // Rank Perks (ถาวร เลือกเอง) — vigor/might บวกสแตต · greed/boxLuck ตั้งตัวคูณรันนี้
    const rp=Save.data.rankPerks||{};
    if(Save.ancientHas('deepRoots')){ p.regen=(p.regen||0)+1; }   // v5.30 Ancient
    { const rb=rankAutoBonus(Save.data.rank||0); this.rankSugarMul=1+rb.sugar; this._boxLuckMul=1; this._currencyLuckMul=1+rb.cur; }   // v8.0.22 โบนัสอัตโนมัติตามยศ (แทน Sweet Greed / Fortune · ตัด Box Luck)
    //  เหลือ 3 เสาพลังที่ผู้เล่นเลือกเอง: Rank (พรถาวร) · Talent เฉพาะตัว · Gear
    applyFrUpkeep(p);
    clampPlayerStats(p);   // เพดานรวม (STAT_CAPS) — ความเร็ว/คูลดาวน์/คริ/ดาเมจ/เกราะ
    p.hp=p.maxhp;
  }
  // ให้ Character EXPปัจจุบัน + คำนวณเลเวล/แต้ม (คืน obj สรุปเพื่อโชว์)
  gainCharExp(n){
    if(!Number.isFinite(n)||n<=0)return; const cp=Save.cp(this.character),before={lvl:cp.lvl,exp:cp.exp||0}; cp.exp=(cp.exp||0)+Math.round(n);
    let ups=0; while(cp.exp>=charExpNeed(cp.lvl)){ cp.exp-=charExpNeed(cp.lvl); cp.lvl++; cp.tp=(cp.tp||0)+1; ups++; }
    Save.save(); this._lastExpGain=Math.round(n);const pg=this._charExpGain&&this._charExpGain.character===this.character?this._charExpGain:null;this._charExpGain={character:this.character,before:pg?pg.before:before,after:{lvl:cp.lvl,exp:cp.exp},gain:(pg?pg.gain:0)+this._lastExpGain}; this._lastLvlUps=ups; return ups;
  }
  showMenu(){ try{ Tele.flush(); }catch(e){} this.lvlUp?.setVisible(false); this.cancelSnipe();this.clearArtVfx(); this.state='menu'; this.clearYuzuCrew(); this.clearCharSignature(); Sfx.bgmIntense(false); Sfx.playMainBgm(); const _title=!window.__titleShown&&!window.__pendingMenu&&window.__pendingRun==null; window.__titleShown=true;   // v7.9.64 หน้าเปิดเกมครั้งแรกที่เข้าเมนูหลังเปิดแอป
    this.menuScreen=_title?'title':(window.__pendingMenu||'hub'); window.__pendingMenu=null; if(this.pauseUI)this.pauseUI.setVisible(false); this.buildMenuScreen(); this.hudVisible(false);
    const rp=window.__pendingRun; window.__pendingRun=null; if(rp!=null){ this.time.delayedCall(60,()=>{ if(this.state==='menu')this.startRun(rp); }); return; }   // v7.9.45 Replay ตอนแพ้ = รีสตาร์ทฉากแล้วเริ่มด่านเดิมใหม่ (เดิมเรียก startRun ตรง ๆ ศัตรู/บอสเดิมค้างในสนาม)
    if(this._isStoreApp)this.time?.delayedCall?.(800,()=>this.storeUpdateTick?.());   /* v8.3.14 กลับ Hub = เช็กอัปเดตแอป Store อีกครั้ง */
    if(_title)return;
    /* v7.9.80 เจ้าของ: เปิดหนังสือแค่ตอนเปิดเกม (หน้า TAP TO START) · กลับจากด่านไม่ต้องเปิดปก */ }   // v7.9.10 ใบ 28 เปิดปกหนังสือทุกครั้งที่เข้าเมนู (เปิดเกม/กลับจากด่าน)
  // หยุดชั่วคราว / เล่นต่อ
  // เร่ง/ลดความเร็วเกมทั้งระบบ (physics + timers + tweens + dt) แบบ Godot time_scale
  setGameSpeed(s){ s=Number.isFinite(s)?Math.max(1,Math.min(4,Math.round(s))):1;this.gameSpeed=s;
    // Arcade physics.world.timeScale is INVERTED (bigger = slower step), so use 1/s
    // to actually move bodies (player/enemies/bullets) faster along with timers/tweens/dt.
    if(this.physics&&this.physics.world&&!this._isHitStop) this.physics.world.timeScale=1/s;
    if(this.tweens) this.tweens.timeScale=s;
    if(this.time) this.time.timeScale=s;
    if(this.speedTxt) this.speedTxt.setText('x'+s); }
  togglePause(){ Sfx.bpLoopStop?.();Sfx.eventLoopStop?.();Sfx.stopSlotSpin?.();
    if(this.state==='play'){ this.state='paused'; this.physics.pause(); this.time.paused=true;   // หยุดนาฬิกาด้วย ไม่งั้น delayedCall (เช่นนับถอยหลังเวฟถัดไป) เดินต่อตอนพัก → เวฟถัดไปหาย
      if(this.joy){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0; this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
      this.buildPause(); this.pauseTxt.setText('▶'); this.hudBtnArtSync?.(); Sfx.select();
    } else if(this.state==='paused'){ this.state='play'; this.physics.resume(); this.time.paused=false;
      if(this.pauseUI)this.pauseUI.setVisible(false); this.pauseTxt.setText('⏸'); this.hudBtnArtSync?.(); Sfx.select(); }
  }
  buildPause(){
    const w=this.W,h=this.H;
    if(!this.pauseUI){ this.pauseUI=this.add.container(0,0).setScrollFactor(1).setDepth(90); this.camUI(this.pauseUI); }
    this.pauseUI.removeAll(true); this._pauseBtns=[];
    if(this.isSesRune?.()){this.buildSesRunePause();this.pauseUI.setVisible(true);return;}
    if(w<=h&&this.tuHas('pause_panel')&&this.buildPauseArt?.()){this.pauseUI.setVisible(true);return;}   // v7.8.59 ใบ 24: หน้าหยุดตามภาพอ้างอิง
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.85).setOrigin(0,0);
    const t=this.add.text(w/2,38,'⏸ Paused',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ff8fb5'}).setOrigin(0.5);
    const stTxt=(this.stageTxt&&this.stageTxt.text)||('Stage '+((this.stageIndex||0)+1));
    const sub=this.add.text(w/2,62,stTxt+'  ·  ☠ '+this.kills,{fontFamily:'sans-serif',fontSize:'11px',color:'#c7bdd6',align:'center',wordWrap:{width:w-30}}).setOrigin(0.5);
    // v4.64: สแตตรบย้ายจาก HUD มาไว้ที่นี่
    const p=this.player,regen=Math.min(p.maxhp*0.03,(p.regen||0)+(p.regenFlat||0)+p.maxhp*(p.regenPct||0));
    const cs=this.add.text(w/2,80,'❤ '+Math.max(0,Math.round(p.hp))+'/'+Math.round(p.maxhp)+'   ♻ '+regen.toFixed(1)+'/s   ⚔ '+Math.round((p.dmgMul||1)*100)+'%   🛡 '+Math.round((1-(p.dmgTakenMul||1))*100)+'%   🎯 '+Math.round((p.critChance||0)*100)+'%',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#bfe8d6'}).setOrigin(0.5);
    this.pauseUI.add([bg,t,sub,cs]);
    const portrait=w<=h,loot=this._runCurrency||{},lootKeys=Object.keys(loot).filter(k=>loot[k]>0),currencyCount=lootKeys.reduce((sum,k)=>sum+loot[k],0),boxCount=(this._runBoxes||[]).length;
    const lootTotals='🍬 '+(this.sugarRun||0)+' Sugar    🎁 '+boxCount+' Boxes    🧪 '+currencyCount+' Currency';
    if(portrait){const lx=20,ly=95,lw=w-40,lg=this.add.graphics();lg.fillStyle(0x31243d,0.94);lg.fillRoundedRect(lx,ly,lw,62,12);lg.lineStyle(1,0xffd18c,0.58);lg.strokeRoundedRect(lx,ly,lw,62,12);
      const label=this.add.text(lx+12,ly+7,'COLLECTED THIS RUN',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffe0a3'}).setOrigin(0,0);
      const totals=this.add.text(lx+12,ly+24,lootTotals,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#fff7e8',wordWrap:{width:lw-24},maxLines:1}).setOrigin(0,0);
      const details=lootKeys.length?lootKeys.slice(0,3).map(k=>currencyDef(k).name+' ×'+loot[k]).join('  ·  ')+(lootKeys.length>3?'  +'+(lootKeys.length-3)+' types':''):(boxCount?'Boxes open at stage end':'No crafting currency yet');
      const line=this.add.text(lx+12,ly+43,details,{fontFamily:'sans-serif',fontSize:'9px',color:'#cfc3df',wordWrap:{width:lw-24},maxLines:1}).setOrigin(0,0);
      this.pauseUI.add([lg,label,totals,line]);
    }
    // แผงสกิล/พรที่Owned
    const panelY=portrait?165:94,panelH=72,px=20,pw=w-40;
    const pnl=this.add.graphics();
    const ph=this.add.text(px+14,panelY+8,portrait?'Held':'Held  ·  '+lootTotals,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#cbbfda'}).setOrigin(0,0);
    this.pauseUI.add([pnl,ph]);
    const heldBot=this.drawHeldBar(this.pauseUI,panelY+27);
    const pH=Math.max(panelH,heldBot-panelY+6);   // v4.63: กรอบสูงตามเนื้อหาจริง (แถว Relic เคยล้นออกนอกกรอบ)
    pnl.fillStyle(0x241a33,0.7); pnl.fillRoundedRect(px,panelY,pw,pH,14); pnl.lineStyle(1.5,0x4a4059,0.8); pnl.strokeRoundedRect(px,panelY,pw,pH,14);
    // v6.7.1 (B2): ตารางแท็กบิ้ว — จำนวน · ขั้นที่ได้ · อีกกี่ชิ้นถึงโบนัสถัดไป
    let tagBot=panelY+pH;

    // v4.65: แนวตั้งตรงกลางว่าง → อธิบาย Relic ที่ถืออยู่ (ผู้เล่นมักลืมว่าแต่ละชิ้นทำอะไร)
    if(portrait&&this.relics&&this.relics.length){ let ry=tagBot+8; const lt=this.add.text(px+4,ry,'🔮 Your Relics',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#d9b8ff'}).setOrigin(0,0);this.pauseUI.add(lt);ry+=22;
      const room=Math.max(0,h-138-54-12-27-ry),maxShown=Math.max(0,Math.floor((room-18)/52));
      for(const k of this.relics.slice(0,maxShown)){ const r=RELICS[k],rg=this.add.graphics();rg.fillStyle(0x241a33,0.85);rg.fillRoundedRect(px,ry,pw,46,10);rg.lineStyle(1.2,0xc07bff,0.7);rg.strokeRoundedRect(px,ry,pw,46,10);
        const relicKey='relic_'+k,re=this.textures.exists(relicKey)?this.add.image(px+22,ry+23,relicKey).setDisplaySize(28,28):this.add.text(px+22,ry+23,r.emoji,{fontSize:'20px'}).setOrigin(.5),rn=this.add.text(px+42,ry+7,r.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff7ed'}).setOrigin(0,0),rd=this.add.text(px+42,ry+22,r.desc,{fontFamily:'sans-serif',fontSize:'9px',color:'#c9bdd2',wordWrap:{width:pw-52},maxLines:2}).setOrigin(0,0);
        this.pauseUI.add([rg,re,rn,rd]); ry+=52; }
      const remaining=this.relics.length-maxShown;if(remaining>0){const more=this.add.text(px+4,ry,'+'+remaining+' more Relic'+(remaining>1?'s':''),{fontFamily:'sans-serif',fontSize:'10px',color:'#cbbfda'});this.pauseUI.add(more);ry+=16;}
      const syn=RELIC_SYNERGIES.filter(q=>this._rel&&this._rel[q.a]&&this._rel[q.b]);for(const q of syn){if(ry>h-138-54-12-55)break;const t3=this.add.text(px+4,ry,'🔗 '+q.name+' — '+q.desc,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffb3e6',wordWrap:{width:pw-8}}).setOrigin(0,0);this.pauseUI.add(t3);ry+=t3.height+6;} }
    const gap=portrait?12:16,bw=portrait?Math.min(w-48,330):Math.min(270,(w-56-gap)/2),bh=54;
    const by=portrait?h-138:Math.max(196,h-68),left=portrait?w/2:w/2-gap/2-bw/2,right=portrait?w/2:w/2+gap/2+bw/2;
    this.uiPillBtn(this.pauseUI,left,by,bw,bh,COLORS.mint,'▶','Resume',null);
    this._pauseBtns.push({x:left-bw/2,y:by-bh/2,w:bw,h:bh,fn:()=>this.togglePause()});
    const exitY=portrait?by+bh+gap:by;
    this.uiPillBtn(this.pauseUI,right,exitY,bw,bh,COLORS.grape,'🏠','Quit stage',null);
    this._pauseBtns.push({x:right-bw/2,y:exitY-bh/2,w:bw,h:bh,fn:()=>this.quitStage()});
    // v5.50: ปุ่ม ⚙ Settings ในหน้าหยุด
    const sbw=bw,sbh=bh,sbx=portrait?w/2:left,sby=by-bh-gap;   // v5.52: ขนาดเท่าปุ่ม Resume/Quit
    this.uiPillBtn(this.pauseUI,sbx,sby,sbw,sbh,COLORS.toast||0xf2b366,'⚙','Settings',null);
    this._pauseBtns.push({x:sbx-sbw/2,y:sby-sbh/2,w:sbw,h:sbh,fn:()=>{Sfx.select();this.buildPauseSettings();}});
    this.pauseUI.setVisible(true);
  }
  // v7.8.59 ใบ 24: หน้าหยุดเกมแนวตั้ง ประกอบจากชิ้นอาร์ต (เนื้อหาเดิม: สแตต · ของที่เก็บ · สกิล · Relic · Resume/Settings/Quit)
  buildPauseArt(){
    const w=this.W,h=this.H,U=this.pauseUI,p=this.player,T=(x,y,s,fs,col,ox=.5,oy=.5,bold=true)=>{const t=this.add.text(x,y,s,{fontFamily:'sans-serif',fontStyle:bold?'bold':'normal',fontSize:fs+'px',color:col}).setOrigin(ox,oy);U.add(t);return t;},
      ic=(cell,x,y,s)=>{if(!this.tuHas('pause_icon_sheet'))return null;this.tuFrames('pause_icon_sheet');const im=this.add.image(x,y,'pause_icon_sheet','cell'+cell).setDisplaySize(s,s);U.add(im);return im;},
      panel=(key,cell,x,y,pw,ph)=>{const c=this.tuPanel(key,cell,x,y,pw,ph);if(c)U.add(c);return c;},side=Math.max(10,w*.035),cw=w-side*2;
    U.add(this.add.rectangle(0,0,w,h,0x1f1529,.9).setOrigin(0));   /* v8.1.143 code instead of pause_veil (flat dark veil, -2 MB GPU) */
    // หัวเรื่อง
    const crW=Math.min(w*.62,300),crH=crW*.36;let y=Math.max(6,h*.008);if(this.textures.exists('pause_crest'))U.add(this.add.image(w/2,y+crH/2,'pause_crest').setDisplaySize(crW,crH));ic(0,w/2,y+crH*.333,crH*.34);   /* v7.9.60 กลางวงอัญมณี (ภาพ: cx .5, cy 120/360, ⌀170) */
    const ttl=T(w/2,y+crH*.68,'Paused',Math.round(crH*.32),'#ff8fb5');ttl.setStroke('#4a1631',5);y+=crH+2;
    const stTxt=(this.stageTxt&&this.stageTxt.text)||('Stage '+((this.stageIndex||0)+1));const sub=T(w/2,y+8,stTxt,13,'#fff2e2');let sf=13;while(sub.width>cw&&sf>9)sub.setFontSize(--sf+'px');y+=20;
    if(this.textures.exists('pause_title_divider'))U.add(this.add.image(w/2,y,'pause_title_divider').setDisplaySize(Math.min(220,cw*.6),11));y+=10;
    // ชิป ความยาก / เลเวล / เวฟ
    const st=STAGES[this.stageIndex],d=DIFFS[Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1))],chips=[[9,d.name,'#fff2e2',d.color],[10,'Lv '+(this.level||1),'#fff2e2'],[11,st&&st.waves?'Wave '+Math.min(st.waves,(this.waveIndex||0)+1)+'/'+st.waves:'☠ '+(this.kills||0),'#ffd27a']],chW=(cw-16)/3,chH=Math.max(26,Math.min(32,h*.036));
    chips.forEach(([cell,txt,col,tint],i)=>{const x=side+i*(chW+8);panel('pause_chip',0,x,y,chW,chH);const im=ic(cell,x+chH*.55,y+chH/2,chH*.62);if(im&&tint!=null)im.setTint(tint);const t=T(x+chW/2+chH*.25,y+chH/2,txt,12,col);let fs=12;while(t.width>chW-chH*1.2&&fs>8)t.setFontSize(--fs+'px');});y+=chH+8;
    // แถบสแตต 5 ช่อง
    const regen=Math.min(p.maxhp*0.03,(p.regen||0)+(p.regenFlat||0)+p.maxhp*(p.regenPct||0)),stats=[[4,Math.max(0,Math.round(p.hp))+'/'+Math.round(p.maxhp),'#9dffcf'],[5,regen.toFixed(1)+'/s','#ffffff'],[6,Math.round((p.dmgMul||1)*100)+'%','#ffffff'],[7,Math.round((1-(p.dmgTakenMul||1))*100)+'%','#ffffff'],[8,Math.round((p.critChance||0)*100)+'%','#ffffff']],sbH=Math.max(34,Math.min(44,h*.05));
    panel('pause_stat_bar',0,side-4,y,cw+8,sbH);const inner=cw-24,seg=inner/5;stats.forEach(([cell,txt,col],i)=>{const cx=side+12+seg*i;ic(cell,cx+11,y+sbH/2,18);const t=T(cx+23,y+sbH/2,txt,11,col,0);let fs=11;while(t.width>seg-27&&fs>7)t.setFontSize(--fs+'px');if(i&&this.textures.exists('pause_stat_sep'))U.add(this.add.image(cx-1,y+sbH/2,'pause_stat_sep').setDisplaySize(2,sbH*.5));});y+=sbH+8;
    const header=(x,yy,pw,cell,label,count)=>{ic(cell,x+20,yy+17,22);const t=T(x+36,yy+17,label,14,'#ffe9c4',0);let lx=x+40+t.width;if(count!=null){const bw=26;panel('pause_count_badge',0,lx,yy+7,bw,20);T(lx+bw/2,yy+17,String(count),12,'#ffffff');lx+=bw+6;}panel('pause_panel_header_line',0,lx+4,yy+12,Math.max(20,x+pw-lx-18),10);};
    // ปุ่มด้านล่าง (คำนวณก่อนเพื่อรู้พื้นที่เหลือ)
    const rbH=Math.max(52,Math.min(64,h*.072)),sbH2=Math.max(44,Math.min(52,h*.06)),gap=8,botY=h-Math.max(10,h*.015)-sbH2,resY=botY-gap-rbH;
    // Collected this run
    const loot=this._runCurrency||{},lk=Object.keys(loot).filter(k=>loot[k]>0),cur=lk.reduce((s,k)=>s+loot[k],0),boxes=(this._runBoxes||[]).length,tiles=[[0,String(this.sugarRun||0),'Sugar'],[1,String(boxes),'Boxes'],[2,String(cur),'Currency']];
    const tH=Math.max(50,Math.min(64,h*.072)),dH=24,pH1=36+tH+8+dH+10;panel('pause_panel',0,side,y,cw,pH1);header(side,y,cw,12,'Collected this run');
    const tw=(cw-24-12)/3;tiles.forEach(([cell,num,lab],i)=>{const x=side+12+i*(tw+6),ty=y+36;panel('pause_tile',0,x,ty,tw,tH);if(this.tuHas('pause_loot_icon_sheet')){this.tuFrames('pause_loot_icon_sheet');U.add(this.add.image(x+tH*.45,ty+tH/2,'pause_loot_icon_sheet','cell'+cell).setDisplaySize(tH*.62,tH*.62));}const n=T(x+tH*.82,ty+tH*.36,num,18,'#ffffff',0);let fs=18;while(n.width>tw-tH*.9&&fs>10)n.setFontSize(--fs+'px');T(x+tH*.82,ty+tH*.72,lab,11,'#e8dcef',0,.5,false);});
    const dy=y+36+tH+8;panel('pause_detail_strip',0,side+12,dy,cw-24,dH);const det=lk.length?lk.slice(0,3).map(k=>currencyDef(k).name+' ×'+loot[k]).join('  •  ')+(lk.length>3?'  •  +'+(lk.length-3):''):(boxes?'Boxes open at stage end':'No crafting currency yet');const dt=T(w/2,dy+dH/2,det,10,'#efe4f6',.5,.5,false);let dfs=10;while(dt.width>cw-36&&dfs>7)dt.setFontSize(--dfs+'px');y+=pH1+8;
    // สกิลที่ถือ
    const atk=Object.keys(this.skills||{}),pas=this.usesBasicAttackBuild?.()?[]:Object.keys(this.passives||{}),slots=[...atk.map(k=>[k,0]),...pas.map(k=>[k,2])],slS=Math.max(40,Math.min(52,h*.058)),perRow=Math.max(1,Math.floor((cw-24+8)/(slS+8))),rows=Math.max(1,Math.ceil(slots.length/perRow)),pH2=36+rows*(slS+8)+6;
    panel('pause_panel',0,side,y,cw,pH2);header(side,y,cw,13,pas.length?'Skills & passives':'Active skill');
    slots.forEach(([k,kind],i)=>{const awk=kind===0&&this.skills[k]>=SKILL_AWAKEN_LV,x=side+12+(i%perRow)*(slS+8),sy=y+36+Math.floor(i/perRow)*(slS+8);if(this.tuHas('pause_skill_slot')){this.tuFrames('pause_skill_slot');U.add(this.add.image(x,sy,'pause_skill_slot','cell'+(awk?1:kind)).setOrigin(0).setDisplaySize(slS,slS));}
      const ik=this.iconKey(k,kind===2);if(ik&&this.textures.exists(ik))U.add(this.add.image(x+slS/2,sy+slS/2,ik).setDisplaySize(slS*.72,slS*.72));else T(x+slS/2,sy+slS/2,(kind===2?PASSIVES[k]?.emoji:SKILLDEFS[k]?.emoji)||'✦',20,'#ffffff');
      const lv=kind===2?this.passives[k]:this.skills[k];if(this.textures.exists('pause_level_badge'))U.add(this.add.image(x+slS-4,sy+slS-4,'pause_level_badge').setDisplaySize(20,20));T(x+slS-4,sy+slS-4,awk?'⚡':String(lv||1),10,'#ffe08a');});
    if(!slots.length)T(side+20,y+36+slS/2,'— none yet',11,'#8d82a0',0,.5,false);y+=pH2+8;
    // Relics (ใส่เท่าที่พื้นที่เหลือ)
    const rel=(this.relics||[]).slice(),rowH=Math.max(46,Math.min(56,h*.064)),room=resY-gap-y-36-8;if(rel.length&&room>rowH){const fit=Math.max(1,Math.min(rel.length,Math.floor((room+6)/(rowH+6)))),more=rel.length-fit,pH3=36+fit*(rowH+6)+(more>0?16:4);
      panel('pause_panel',0,side,y,cw,pH3);header(side,y,cw,14,'Your relics',rel.length);
      rel.slice(0,fit).forEach((k,i)=>{const r=RELICS[k]||{},ry=y+36+i*(rowH+6),rx=side+12,rw=cw-24;panel('pause_relic_row',0,rx,ry,rw,rowH);const key='relic_'+k;if(this.textures.exists(key))U.add(this.add.image(rx+rowH*.55,ry+rowH/2,key).setDisplaySize(rowH*.7,rowH*.7));else T(rx+rowH*.55,ry+rowH/2,r.emoji||'🔮',20,'#ffffff');
        const tx=rx+rowH*1.2,tw2=rw-rowH*1.2-28;const nm=T(tx,ry+rowH*.3,r.name||k,13,'#fff7ed',0);let nfs=13;while(nm.width>tw2&&nfs>9)nm.setFontSize(--nfs+'px');const ds=this.add.text(tx,ry+rowH*.52,r.desc||'',{fontFamily:'sans-serif',fontSize:'10px',color:'#d9cde6',wordWrap:{width:tw2},maxLines:2}).setOrigin(0,0);U.add(ds);});
      if(more>0)T(w/2,y+pH3-10,'+'+more+' more Relic'+(more>1?'s':''),10,'#cbbfda');}
    // ปุ่ม
    const btn=(key,x,yy,bw,bh,cell,label,col,fn,big)=>{const c=panel(key,0,x,yy,bw,bh);if(!c)return;const icx=big?x+bh*280/260:x+bh*.7;ic(cell,icx,yy+bh/2,bh*(big?.42:.48));   /* v7.9.60 Resume: กลางวงกลมเขียวในภาพ (x 280/260·สูง) */const t=T(big?x+bw/2+bh*.3:x+bw/2+bh*.25,yy+bh/2,label,big?Math.round(bh*.46):Math.round(bh*.38),col);t.setStroke(big?'#1d6b55':'#2a1530',big?5:3);this._pauseBtns.push({x,y:yy,w:bw,h:bh,fn,art:c,key});};
    btn('pause_btn_resume',side-2,resY,cw+4,rbH,1,'Resume','#ffffff',()=>this.togglePause(),true);
    const hb=(cw-10)/2;btn('pause_btn_settings',side,botY,hb,sbH2,2,'Settings','#ffffff',()=>{Sfx.select();this.buildPauseSettings();});btn('pause_btn_quit',side+hb+10,botY,hb,sbH2,3,'Quit stage','#ff8fb5',()=>this.quitStage());
    return true; }
  // v5.50: ตั้งค่าระหว่างเล่น (ใช้แถวเดียวกับหน้า Settings แบบย่อ)
  buildPauseSettings(){
    const w=this.W,h=this.H; this.pauseUI.removeAll(true); this._pauseBtns=[];
    const st=Save.data.settings||(Save.data.settings=Object.assign({},DEFAULT_SETTINGS));
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.9).setOrigin(0,0);
    const t=this.add.text(w/2,38,'⚙ Settings',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffe08a'}).setOrigin(0.5);
    this.pauseUI.add([bg,t]);
    const cyc=(k,n)=>{const c=st[k]==null?1:st[k],i=VOL_STEPS.indexOf(c);st[k]=VOL_STEPS[(i+1)%VOL_STEPS.length];applyVolSettings(st);};
    const rows=[
      ['🔊','Sound',()=>st.sound?'On':'Off',()=>{st.sound=!st.sound;Sfx.muted=!st.sound;if(Sfx.master)Sfx.master.gain.value=Sfx.muted?0:0.24;if(this.sound)this.sound.mute=Sfx.muted;}],
      ['🎵','Music Volume',()=>Math.round((st.musicVol==null?1:st.musicVol)*100)+'%',()=>cyc('musicVol')],
      ['🔔','Effects Volume',()=>Math.round((st.sfxVol==null?1:st.sfxVol)*100)+'%',()=>cyc('sfxVol')],
      ['⚡','Performance',()=>(_lowMemFlag?'Low-memory · ':'')+['Auto','Low','High'][st.quality||0],()=>{st.quality=((st.quality||0)+1)%3;clearLowMem();}],
      ['🎆','VFX Quality',()=>['Low','Mid','High'][st.vfx||0],()=>{st.vfx=((st.vfx||0)+1)%3;}],
      ['💥','Damage Numbers',()=>st.damageNumbers?'On':'Off',()=>{st.damageNumbers=!st.damageNumbers;}],
      ['📳','Screen Shake',()=>['Off','Light','Normal'][st.shake||0],()=>{st.shake=((st.shake||0)+1)%3;}],
      ['✨','Screen Flash',()=>st.flash?'On':'Off',()=>{st.flash=!st.flash;}],
      ['🎮','Button Size',()=>['Normal','Large','Extra Large'][st.ctrlSize||0],()=>{st.ctrlSize=((st.ctrlSize||0)+1)%3;}],
      ['✋','Button Side',()=>st.ctrlLeft?'Left':'Right',()=>{st.ctrlLeft=!st.ctrlLeft;}],
      ['📈','Combat Meter',()=>st.mx?'On':'Off',()=>{st.mx=!st.mx;}],
    ];
    const rw=Math.min(w-32,440),rx=(w-rw)/2,top=66,gap=6,rh=Math.max(34,Math.min(50,(h-top-90-gap*rows.length)/rows.length));
    rows.forEach(([e,n,val,fn],i)=>{const y=top+i*(rh+gap),g=this.add.graphics();g.fillStyle(0x241a33,0.95);g.fillRoundedRect(rx,y,rw,rh,10);g.lineStyle(1.5,0x5a4b72,0.9);g.strokeRoundedRect(rx,y,rw,rh,10);
      const a=this.add.text(rx+14,y+rh/2,e+'  '+n,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#fff7ed'}).setOrigin(0,0.5);
      const v=this.add.text(rx+rw-14,y+rh/2,val(),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffe08a'}).setOrigin(1,0.5);
      this.pauseUI.add([g,a,v]);
      this._pauseBtns.push({x:rx,y,w:rw,h:rh,fn:()=>{fn();Save.data.settings=st;Save.save();Sfx.select();this.layoutControls&&this.layoutControls();this.buildPauseSettings();}});});
    const bw=Math.min(w-48,300),bh=48,by=h-50;
    this.uiPillBtn(this.pauseUI,w/2,by,bw,bh,COLORS.mint,'‹','Back',null);
    this._pauseBtns.push({x:w/2-bw/2,y:by-bh/2,w:bw,h:bh,fn:()=>{Sfx.select();this.buildPause();}});
    this.pauseUI.setVisible(true);
  }
  // กด Quit = สรุปด่านทันที (เปิดกล่อง + โชว์ currency) แล้วรีเซ็ตด่านให้สะอาด (แก้บั๊กด่านไม่ reset ตอนออกกลางคัน)
  quitStage(){
    Stats.end(this,this.bossRush?'dead':'quit');
    this.physics.resume(); this.time.paused=false;
    if(this.pauseUI)this.pauseUI.setVisible(false); if(this.pauseTxt)this.pauseTxt.setText('⏸');
    this._bossZoom=1; this.applyMainZoom();
    this.boss=null; this.mode='clear'; if(this.bossUI)this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e&&e.active){ if(e._aura){e._aura.destroy();e._aura=null;} this.stopEnemyPresentation(e);e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
    this.clearFoes(); this.clearBossObjects(); this.clearWaveObjective(); this.clearPickups(true); this.bossTwistEnd?.(false); this.seedRiftEventEnd?.(false);   /* v8.2.86 */ this.waveAlive=0; if(this.pipG)this.pipG.clear();
    this._openedBoxes=this.openRunBoxes();   // เปิดกล่องที่สะสมมา (แจกจริง)
    this._powerBefore=Save.power(this.character);Save.addSugar(this.sugarStage); this.gainCharExp(Math.floor((this.kills||0)*0.4));this._powerAfter=Save.power(this.character);this._firstMastery=false;this._dailyBonus=0;this._starRes=null;
    if(this.bossRush){ _closeStory(); this.state='dead';if(this._arenaFogCast)this.endArenaFog(this._arenaFogCast); if(this.lowHpVig){this._lowHpOn=false;this.lowHpVig.setAlpha(0).setVisible(false);} Sfx.bgmIntense(false);Sfx.dead(); this.finishBossRush(false); return; }
    this._quitSummary=true;this._clearShovels=0; this._summaryDoubled=false;this._summaryPresentationShown=false; this._stageReward=null;
    this.showStageSummary(false);
  }
  exitStage(){this._lootTok=(this._lootTok||0)+1;this.stageMood?.(null);this.clearBossStory?.(); this._rubyEntry?.destroy();this._heroScreen?.kill();if(this._uniqueNotice?.active)this._uniqueNotice.destroy(); Sfx.bpLoopStop?.();Sfx.eventLoopStop?.();Sfx.stopSlotSpin?.(); this.clearDelveMods&&this.clearDelveMods(); this.clearMysteryCards();this._bossLootOpen=false;this._bossRerolled=false;  this.cancelBeat(); this.clearBiome&&this.clearBiome(); this.clearDelveBoss&&this.clearDelveBoss(); this.cancelSnipe&&this.cancelSnipe(); this.clearCrossroads(); this._xrNext=null; this._xrDuel=false; this.clearSugarCoins(); if(this._speech){this._speech.ev.remove();this._speech.box.destroy();this._speech=null;}
    this.physics.resume(); this.time.paused=false; this.clearCharSignature(); this.clearBossObjects();   // ปลดหยุดฟิสิกส์+นาฬิกา + ล้าง boss objects ก่อนออก (ไม่งั้นด่านหน้าค้าง)
    if(this._coachUI){this._coachUI.destroy();this._coachUI=null;} if(this._coachSpot){this._coachSpot.destroy();this._coachSpot=null;} this._coach=null; this._inTutorial=false;
    this._bossZoom=1;this.applyMainZoom();
    if(this.pauseUI)this.pauseUI.setVisible(false); this.pauseTxt.setText('⏸');
    Save.addSugar(this.sugarStage); this.gainCharExp(Math.floor(this.kills*0.5)); this.sugarStage=0;
    this.boss=null; if(this.bossUI)this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e){ if(e._aura){e._aura.destroy();e._aura=null;} e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
    this.clearChapterCombatWave(true);
    this.clearFoes(); this.clearPickups(true); this.clearExitPortal();this.clearWaveObjective(); this.bossTwistEnd?.(false); this.seedRiftEventEnd?.(false);   /* v8.2.86 */this.clearStageProps(); if(this.pipG)this.pipG.clear();
    this.bullets.children.iterate(b=>{if(b&&b.active)this.killBullet(b);});
    this.showMenu();
  }
  // v5.40 เพลงประจำหน้าวิหาร/ขุด/ครัว (โหลดตอนเข้าหน้าครั้งแรก)
  voiceStop(owner){VoiceActing.stop(owner);DuoVoice.stop();}
  voiceLookup(role,text){return VoiceActing.lookup(role,text);}
  voiceDuration(role,text){const key=VoiceActing.lookup(role,text);return VoiceActing.enabled()&&key?A07_CATALOG[key].duration:0;}
  voiceCaption(role,text){return VoiceActing.caption(role,text);}
  voiceLine(role,text,valid,owner){return VoiceActing.text(this,role,text,valid,owner);}
  voicePlay(key,valid,owner){return VoiceActing.play(this,key,valid,owner);}
  voiceBark(event){return VoiceActing.bark(this,event);}
  voiceBossSlip(b,st){if(this._voiceSlipSeen||!this.storyVoice?.()||!b?.isBoss||!(b.maxhp>0)||b.hp/b.maxhp>.5||this._bossSayObj?.active||VoiceActing.busy())return false;const key='vo_b'+String((this.stageIndex||0)+1).padStart(2,'0')+'_slip_'+(Math.floor(performance.now()/1000)%2+1),row=A07_CATALOG[key];if(!row)return false;this._voiceSlipSeen=true;this.bossSay(row.text,st?.boss,Math.max(3300,row.duration+250),b);return true;}
  storyMusicPlay(key,valid,volume){return StoryMusic.play(this,key,valid,volume);}
  storyMusicStop(){StoryMusic.stop();}
  menuMusic(s){ if(this.state!=='menu')return; if(typeof window!=='undefined')window.__mochiTitleMusic=s==='title';const BZ=['bazaar','wardrobe','tradein'],bz=BZ.includes(s),a04=s==='title'?'bgm_a04_bgm_title':bz?'bgm_a04_bgm_bazaar':null;if(a04){this.storyMusicPlay?.(a04,()=>this.state==='menu'&&(bz?BZ.includes(this.menuScreen):this.menuScreen===s));return;}   /* v8.2.2 เจ้าของ: ทุกหน้าใน Bazaar (Wardrobe / Trade-in) ใช้เพลง Bazaar เพลงเดียวต่อเนื่อง */this.storyMusicStop?.();if((Sfx._currentBgmKey||'').startsWith('bgm_a04_')||window.LoaderMusic?.playing?.())Sfx.playMainBgm(); const key={patrol:null,kitchen:'bgm_menu_kitchen',dig:(typeof EXP_ON!=='undefined'&&EXP_ON)?(this._ex?.boss?'bgm_ex_boss':'bgm_ex_expedition'):null}[s]||null;   /* v8.2.34 A19 */   // v8.1.109 เจ้าของ: Mochi Patrol ใช้เพลงวิหาร (เดิมของ Flavor Weave) · Weave/Rank Perks กลับไปใช้เพลงหน้าหลักเหมือนหน้าอื่น
    if(!key||this.cache.audio.exists(key)){ Sfx.playMenuBgm(key); return; } if(!ASSET_AUDIO[key])return;
    this.load.audio(key,verUrl(ASSET_AUDIO[key])); this.load.once('filecomplete-audio-'+key,()=>{ if(this.state==='menu'&&({patrol:1,kitchen:1,dig:1})[this.menuScreen])this.menuMusic(this.menuScreen); }); this.load.start(); }
  // v6.92 เพลงที่ถอดรหัสแล้วกินแรม ~20MB/เพลง → ลบเพลงด่าน/บอสของด่านอื่นออกจาก cache (ไฟล์ยังอยู่ในเครื่อง โหลดกลับเร็ว)
  evictOtherBgm(keep){ try{ const ks=new Set((keep||[]).filter(Boolean)),cur=Sfx._currentBgmKey,ca=this.cache.audio; const all=ca.entries&&ca.entries.keys?ca.entries.keys():[];
      for(const k of all){ if(!/^bgm_(?:[smb]\d|stage|boss|ch\d)/.test(k)||ks.has(k)||k===cur)continue; try{ this.sound.removeByKey?.(k); }catch(e){} ca.remove(k); } }catch(e){} }
  ensureStageAudio(idx,done){
    const stage=(idx||0)+1,keys=[bgmKeyFor('stage',stage)].filter(Boolean);
    this.evictOtherBgm?.([...keys,bgmKeyFor('mini',stage),bgmKeyFor('boss',stage)]);
    if((this.character||Save.data.character)==='yuzu')keys.push(...Object.keys(ASSET_AUDIO).filter(k=>k.startsWith('sfx_yz_')));
    keys.push(...Object.keys(ASSET_AUDIO).filter(k=>k.startsWith('sfx_a20_')));
    if(idx>=5)keys.push(...Object.keys(ASSET_AUDIO).filter(k=>k.startsWith('sfx_a22_')));
    { const hc=this.character||Save.data.character||'momo',fs=[...((typeof A21_HERO!=='undefined'&&A21_HERO[hc])||[]),'hit_mochi','hit_armor','hit_ice','hit_plant','hit_crystal','critical']; keys.push(...Object.keys(ASSET_AUDIO).filter(k=>fs.some(f=>k.startsWith('sfx_a21_'+f+'_')))); if(typeof Sfx!=='undefined')Sfx.hero=hc; }   /* v8.2.85 A21 เฉพาะฮีโร่ที่เล่น + เสียงตีโดน (~150 KB) */   /* v8.2.84 A20 ม่านเข้าด่าน (~70 KB) */   // v6.92 คืนแรมเพลงด่านอื่น   // เข้าเกมทันทีเมื่อเพลงด่านพร้อม
    if(typeof a23StageKeys==='function'){
      const selected=a23StageKeys(idx),keep=new Set(selected);Sfx.eventLoopStop?.();
      for(const k of Object.keys(ASSET_AUDIO))if(k.startsWith('sfx_a23_')&&!keep.has(k))this.cache.audio.remove(k);
      keys.push(...selected);
    }
    const pending=keys.filter(k=>ASSET_AUDIO[k]&&!this.cache.audio.exists(k));if(!pending.length){done();return;}
    // v6.45: รอเฉพาะไฟล์เพลงของด่าน (เดิมรอ loader 'complete' = รอของเบื้องหลังทั้งหมด) · ช้าเกิน 8 วิ = เข้าด่านก่อน เพลงตามมาทีหลัง
    const loader=window.GameLoader,t0=Date.now();let finished=false;const finish=()=>{if(finished)return;finished=true;done();};
    const onErr=file=>{if(file&&pending.includes(file.key)){delete ASSET_AUDIO[file.key];if(loader)loader.set(0.30,'Some music failed to load — using fallback');}};
    this.load.on('loaderror',onErr);pending.forEach(k=>this.load.audio(k,verUrl(ASSET_AUDIO[k])));this.prioritizeLoad(pending);if(!this.load.isLoading())this.load.start();
    const chk=()=>{const left=pending.filter(k=>ASSET_AUDIO[k]&&!this.cache.audio.exists(k)).length;if(loader&&this.state==='loading')loader.set(0.08+0.24*(1-left/pending.length),'Loading stage music...');
      if(!left||Date.now()-t0>8000){this.load.off('loaderror',onErr);finish();return;}setTimeout(chk,80);};setTimeout(chk,60);
  }
  warmBossAudio(idx){
    const stage=(idx||0)+1,keys=[bgmKeyFor('mini',stage),bgmKeyFor('boss',stage)].filter(Boolean);
    const pending=[...new Set(keys)].filter(k=>ASSET_AUDIO[k]&&!this.cache.audio.exists(k));if(!pending.length)return;
    this.load.on('loaderror',file=>{if(file&&pending.includes(file.key))delete ASSET_AUDIO[file.key];});
    pending.forEach(k=>this.load.audio(k,verUrl(ASSET_AUDIO[k])));this.load.start();
  }

  isEndgameRun(){return !!(this.recipeMode||this.riftMode||this.bossRush);}
  focusGearPool(pool){
    if(this._farmFocus!=='weapon'&&this._farmFocus!=='armor')return pool;
    return pool.filter(it=>this._farmFocus==='weapon'?it.slot==='weapon':['armor','gloves','boots'].includes(it.slot));
  }
  openEndgamePreparation(idx){ Sfx.menuCue?.('ui_curse_open',.4);
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Endgame · Farming target');
    const w=this.W,h=this.H,bw=Math.min(w-40,360),x=w/2,top=Math.max(110,h*0.22);
    const choices=[['all','All loot','Standard drop pool'],['weapon','Weapons','Equipment drops are weapons'],['armor','Armor','Armor, gloves and boots'],['materials','Crafting materials','Equipment rewards become crafting currency']];
    choices.forEach(([id,name,desc],i)=>{this.menu.add(this.add.text(x,top+i*66+27,desc,{fontFamily:'sans-serif',fontSize:'11px',color:'#cfc2df'}).setOrigin(0.5));this.uiPillBtn(this.menu,x,top+i*66,bw,52,COLORS.grape,'',name,()=>{this._farmFocusRequested=id;this.startRun(idx);});});
    this.uiPillBtn(this.menu,x,top+choices.length*66,bw,42,COLORS.pink,'','Back',()=>{ /* v8.1.142 bot QA: Back from Pinnacle prep refunds the free entry / keys (were lost) */ if(this._pinnacleRequested&&this._pinnaclePaid){ const pp=this._pinnaclePaid; if(pp.free)Save.data.pinnacleFreeUsed=false; if(pp.keys)Save.data.riftKeys=(Save.data.riftKeys||0)+pp.keys; Save.save(); } this._pinnaclePaid=null; this._recipeRequested=null;this._riftRequested=null;this._bossRushRequested=false;this._pinnacleRequested=false;this._farmFocusRequested=null;this.menuScreen='endgame';this.buildMenuScreen();});
  }
  checkEndgameCurse(progress,onResume){
    if(!this.isEndgameRun()||this.state!=='play'||this._inTutorial||!['wave','breather'].includes(this.mode))return false;
    const n=this._curseCheckpoint||0;if(n>=2||progress<[0.25,0.75][n])return false;
    this._curseCheckpoint=n+1;this.openEndgameCurse(onResume);return true;
  }
  openEndgameCurse(onResume){ return this.autoEndgameCurse(onResume); }
  // v6.2.4: คำสาปกลางรันสุ่มให้เลย ไม่หยุดเกม (โค้ดหน้าเลือกเดิมอยู่ใน openEndgameCurseChoice)
  autoEndgameCurse(onResume){ if(!Save.zoneModsUnlocked()){ if(onResume)onResume(); return; }   // v6.80 E2 no curses
    const pool=ZONE_MODIFIERS.filter(d=>!(this._activeZoneMods||[]).includes(d.id)); const d=pool.length&&Math.random()>=1/(pool.length+1)?Phaser.Utils.Array.GetRandom(pool):null;   // v6.2.5: 'ไม่มีคำสาป' เป็นอีก 1 ช่องในการสุ่ม
    if(!d)this.showBanner('✨ No curse this time','Difficulty and rewards unchanged',1800);
    if(d){ this._activeZoneMods.push(d.id); this._zoneMul=this.zoneModMul(); this.enemies.children.iterate(e=>{if(e&&e.active){e.hp*=d.hp;e.maxhp*=d.hp;e.dmg*=d.dmg;}});
      this.showBanner('☠ Curse: '+d.name,d.desc+' · rewards ×'+d.reward.toFixed(2),2200); Sfx.bossWarn&&Sfx.bossWarn(); this.screenFlash&&this.screenFlash(0x6b2bd9,0.25); }
    if(onResume)onResume(); }
  /* Stage preparation watchdog offers recovery without starting with placeholder art. */
  runWatch(idx){
    const ticket=this._runWatchN=(this._runWatchN||0)+1;this._stageArtProgressAt=Date.now();const MAX=typeof RUN_WAIT_MAX!=='undefined'?RUN_WAIT_MAX:45000;
    const show=()=>{try{const L=window.GameLoader,r=document.getElementById('game-loader');if(L&&r&&(r.style.display!=='flex'||r.style.opacity==='0'))L.show('Getting the stage ready…',.1);}catch(e){}};
    const tick=()=>{if(ticket!==this._runWatchN||!this._enteringStageArt||this.state!=='menu')return;if(Date.now()-this._stageArtProgressAt>=MAX){this.stageLoadFailure?.(idx,[],'preparation_stalled');return;}show();setTimeout(tick,1000);};show();setTimeout(tick,1000);
  }

  startRun(idx){ try{ window.__mochiTitleMusic=false;window.LoaderMusic&&window.LoaderMusic.stop(); }catch(e){} if(this.state==='menu'){this._cocoaFlickerOn=false;this.finishCocoaFlicker(true);this.refreshFlickerUI();}  this._dmgBy={}; this._lastHitSrc=null; this._charExpGain=null;
    if(this.state!=='menu')return;
    this.clearMysteryCards();this._bossLootOpen=false;this._bossRerolled=false;
    const endgameRequested=!!(this._recipeRequested||this._riftRequested||this._bossRushRequested||this._pinnacleRequested);
    if(endgameRequested&&!this._farmFocusRequested){this.openEndgamePreparation(idx);return;}
    this.clearYuzuCrew();
    idx=Math.max(0,Math.floor(Number(idx)||0));
    if(!isStageReady(idx)){ this.showBanner('🛠️ Stage in production','This stage unlocks only after its monsters, miniboss and boss pass QA',1500); return; }
    if(!this._allLoaded){if(this._enteringStageArt)return;this._enteringStageArt=true;this.runWatch(idx);const token=this._runWatchN;this.preloadAll(()=>{if(token!==this._runWatchN||this.state!=='menu')return;this._enteringStageArt=false;this.startRun(idx);});return;}
    if(!this.battleArtReady(idx)){
      if(this._enteringStageArt)return;this._enteringStageArt=true;this.runWatch(idx);const token=this._runWatchN;
      this.stageLoadCover?.(idx);window.GameLoader?.show?.('Preparing stage artwork…',0);
      this.ensureStageArt(idx,()=>{if(token!==this._runWatchN||this.state!=='menu')return;this._enteringStageArt=false;this.startRun(idx);});return;
    }
    this._stagePinned=new Set(this.stageRequiredKeys(idx));
    if(!this._warmed)this._warmed={};const wk=idx+'|'+(this.character||Save.data.character)+'|'+(typeof Cos!=='undefined'?Cos.skin?.(this.character||Save.data.character)?.tag||'':'');
    if(!this._warmed[wk]){if(this._enteringStageArt)return;this._enteringStageArt=true;this.runWatch(idx);const token=this._runWatchN;this.warmStageTextures(idx,()=>{if(token!==this._runWatchN||this.state!=='menu')return;this._warmed[wk]=true;this._enteringStageArt=false;this.startRun(idx);});return;}
    this.freeOtherStageArt?.(idx);   // v6.91 ปล่อยภาพด่านอื่นออกจาก GPU
    const challenge=null;this._challengeRequested=null; // Story never inherits old curse tickets.
    const ticket=challenge?challenge.length*150:0;
    if(ticket&&(Save.data.sugar||0)<ticket){this.menuToast('Need 🍬'+ticket+' Sugar for the challenge ticket','#ff9bb5');return;}
    if(ticket){Save.data.sugar-=ticket;Save.save();}
    this._challengeRun=challenge?challenge.slice():[];
    this._activeZoneMods=[];this._curseCheckpoint=0;this._jackpotEventTime=0;this._jackpotEventRolled=false;this._farmFocus=endgameRequested?(this._farmFocusRequested||'all'):'all';this._farmFocusRequested=null;this._zoneMul=this.zoneModMul();
    if(this._recipeRequested){Save.data.recipes=this.recipeBag().filter(r=>r.uid!==this._recipeRequested.uid);Save.save();this._recipeSel=null;}
    this.killStreak=0; this._lastKillAt=-9;   // Juice: รีเซ็ตคอมโบฆ่าต่อเนื่องทุกWaitบ
    this.state='loading';
    BGM_MODE=(this._recipeRequested||this._pinnacleRequested)?'endgame':null;
    this.menu.setVisible(false);
    try{ this.menu.removeAll(true); this.texFreeForRun(idx); }catch(e){}   // v7.4 คืนภาพหน้าเมนูย่อย/ฮีโร่ตัวอื่นออกจาก GPU ระหว่างเล่น
    if(window.GameLoader){ this.stageLoadCover?.(idx); window.GameLoader.show('Preparing the stage...',0.08); }

    // เพลงหลายด่านเป็นไฟล์ใหญ่ จึงโหลดเฉพาะด่านที่เลือกภายในหน้านี้
    this.ensureStageAudio(idx,()=>{
      // แบ่งงานสร้างด่านเป็นช่วงสั้น ๆ เพื่อให้มือถือวาดหน้าโหลดได้และไม่ดูเหมือนเกมค้าง
      this.time.delayedCall(45,()=>{
        try{
        if(window.GameLoader)window.GameLoader.set(0.38,'Preparing character and skills...');
        this.hudVisible(true);
        this.elapsed=0; this.kills=0; this.stageKills=0; this.sugarStage=0; this.sugarRun=0; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 0');
        if(this.killTxt)this.killTxt.setText('KOs 0');
        this.stageIndex=idx; this._skinTagFor=null; this._missionDeal=null; this._finishDeal=null; this.boss=null; this.mode='wave'; this.waveIndex=0; this.waveAlive=0;this._finalStoryShown=false;this.bossRush=!!this._bossRushRequested;this._bossRushRequested=false;this._pinnacleRun=!!this._pinnacleRequested;this._pinnacleRequested=false;if(this._pinnacleRun){this.bossRush=true;}this.riftMode=!!this._riftRequested;this._riftTier=this.riftMode?this._riftRequested.tier:0;this._riftMods=this.riftMode?this._riftRequested.mods:[];this._riftRequested=null;this.recipeMode=!!this._recipeRequested;this._recipe=this._recipeRequested||null;if(this.recipeMode){this.riftMode=true;this._riftTier=this._recipe.tier;this._riftMods=(this._recipe.mods||[]).slice();}this._pact={};this._pactHeat=0;if(this.recipeMode){(this._recipe.mods||[]).forEach(id=>{const d=recipeModDef(id);if(d&&d.pact)Object.keys(d.pact).forEach(k=>{this._pact[k]=(this._pact[k]||0)+d.pact[k];});});}this._recipeRequested=null;if(this.bossRush){this._rushList=this._pinnacleRun?[idx]:this.bossRushList();this._rushPos=0;this._rushDown=0;this._rushT0=0;}
        Stats.start(this); try{ Tele.ev('stage_start',{mode:this.mode||null,diff:this.difficulty|0,tutorial:!!this._inTutorial},Stats.stageLab?Stats.stageLab(this.stageIndex):String(this.stageIndex)); }catch(e){}   /* v6.99.1 direct (delayedCall could stall while time paused) */
        this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
        this._sesRuneMode=this.character==='sesame'&&!this._forceCoachTutorial&&!!Save.data.tutorialDone;
        this.skills={}; this.basicAttack=null; this.passives={}; this.resetRelics(); this._clearT=0; this._clearFled=false; this.uniqueCd=0; this.uniqueLevel=typeof uniqueTalentLevel==='function'?uniqueTalentLevel(this.character||Save.data.character):1;this._cocoaRegenT=0; this.wardGuardT=0; this.pathHasteT=0; this.windRushT=0; this.swarmAcc=null;this._triSeals=[];this._echoTrail=[];this._echoTrailAcc=0;
        this.skillCd={};for(const k in SKILLDEFS)this.skillCd[k]=0;this.level=1;this.xp=0;this.xpNext=12;this.pendingLvl=0;this._queuedBossIntro=null;
        this.banishedKeys={};this._boxAcc=null;this._reviveLeft=(Save.rankHas?.("revive")?1:0)+Save.gearReviveCount();this._adRevived=false;   // โควตาสุ่มใหม่/ลบสกิล + สิทธิ์ฟื้นด้วยโฆษณา ต่อWaitบ
        this.clearStarGuardFx();
        this.refreshUniqueSkillUI();
        this.clearAuraFx(); this._auraTick=0;
        this.setGameSpeed(1);
        this.player.maxhp=90; this.player.baseSpeed=BALANCE.moveSpeed; this.player.pickup=105; this.player.dmgMul=1;

        this.time.delayedCall(35,()=>{
          if(window.GameLoader)window.GameLoader.set(0.72,'Setting up the scene and enemies...');
          this.applyMeta();
          this.equipSignatureWeapon();
          this.buildSkillBar();

          this.time.delayedCall(35,()=>{
            if(window.GameLoader){
              window.GameLoader.set(1,this.usesBasicAttackBuild()?'Basic Attack ready!':'Pick a starting skill!');
              this.time.delayedCall(140,()=>window.GameLoader.hide());
            }
            this.openStartingSkillChoice();
            this.time.delayedCall(1200,()=>{if(this.state==='play'||this.state==='levelup')this.warmBossAudio(idx);});
          });
        });
        }catch(err){
          this.state='menu';
          if(window.GameLoader)window.GameLoader.hide();
          this.menu.setVisible(true);
          throw err;
        }
      });
    });
  }
