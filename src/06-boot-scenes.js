class Boot extends Phaser.Scene {
  constructor(){ super('Boot'); }
  preload(){
    this._loadFailures=0;
    const loader=window.GameLoader;
    if(loader)loader.show('Loading images, audio and characters...',0);
    LoadMeter.plan(); LoadMeter.show(); // v6.48.2 หลอดเดียวต่อเนื่องกับ preloadAll (ไม่วิ่งถึง 100% แล้วเริ่มใหม่)
    const mk=f=>{ LoadMeter.mark(f&&f.url,fileFromDevice(f)); if(!window.__quietPreload)LoadMeter.show(); }; this.load.on('load',mk); this.load.on('loaderror',mk);
    for(const k in ASSET_IMAGES){ if(!bootKeep(k))continue;this.load.image(k, verUrl(ASSET_IMAGES[k])); }
    for(const k in ASSET_SHEETS){if(!bootKeep(k))continue;this.load.spritesheet(k, verUrl(ASSET_SHEETS[k].url), { frameWidth:ASSET_SHEETS[k].frame, frameHeight:ASSET_SHEETS[k].frame });}
    // เปิดเกมให้ไว: โหลด SFX + เพลงเมนูก่อน ส่วนเพลงประจำด่านค่อยโหลดเมื่อเลือกด่าน
    for(const k in ASSET_AUDIO){
      if(!bootKeepAudio(k))continue; if(k.startsWith('bgm_stage')||k.startsWith('bgm_boss')||k.startsWith('bgm_ch')||k.startsWith('bgm_endgame')||/^bgm_[smb]\d/.test(k)||k.startsWith('bgm_menu_'))continue;
      this.load.audio(k, verUrl(ASSET_AUDIO[k]));
    }
    // ไฟล์ใดเสียให้ใช้กราฟิก/เสียงสำWaitง เกมจึงไม่ติดค้างอยู่ที่หน้าโหลด
    this.load.on('loaderror',(f)=>{
      this._loadFailures++;
      delete ASSET_IMAGES[f.key]; delete ASSET_SHEETS[f.key]; delete ASSET_FX[f.key]; delete ASSET_AUDIO[f.key];
    });
    this.load.once('complete',()=>{
      // v6.48.2: ไม่ตั้ง 100% ตรงนี้ — หลอดเดียวเดินต่อใน preloadAll
    });
  }
  // 🧩 Chapter 3 placeholder art (วาดด้วยโค้ด) — ถ้ามีไฟล์จริงใน ASSET_IMAGES ที่ key เดียวกัน จะข้ามการวาดเอง
  //   ศัตรู c3_e_{basic,fast,shooter,bomber,tank} ขนาดเท่า e_* เดิม (hitbox เดิมใช้ได้) · มินิ c3_mini1-5 / บอส c3_boss1-5 = 140px · พื้น bg11-15 = 256px ปูซ้ำได้
  buildChapter3Placeholders(){
    const pal=[[0xe0a86a,'🌾'],[0xff7a8f,'🍎'],[0x7fe6ff,'🔮'],[0xffcf5c,'🗝️'],[0xb98cff,'👑']];
    const hex=c=>'#'+c.toString(16).padStart(6,'0');
    const blob=(key,w,h,color,emoji,ring)=>{ if(this.textures.exists(key))return; const t=this.textures.createCanvas(key,w,h);if(!t)return;const c=t.getContext(),r=Math.min(w,h)/2-2;
      const g=c.createRadialGradient(w/2-r*0.3,h/2-r*0.35,r*0.1,w/2,h/2,r);g.addColorStop(0,'#ffffff');g.addColorStop(0.25,hex(color));g.addColorStop(1,'#2a1633');
      c.fillStyle=g;c.beginPath();c.arc(w/2,h/2,r,0,Math.PI*2);c.fill();c.lineWidth=Math.max(2,r*0.08);c.strokeStyle=ring||'#1a0f22';c.stroke();
      c.font=Math.round(r*1.05)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(emoji,w/2,h/2+r*0.05);t.refresh(); };
    const roles={basic:['e_basic','🫘'],fast:['e_fast','💨'],shooter:['e_shooter','🎯'],bomber:['e_bomber','💣'],tank:['e_tank','🛡️']};
    for(const r in roles){ const src=this.textures.exists(roles[r][0])?this.textures.get(roles[r][0]).getSourceImage():null; blob('c3_e_'+r,(src&&src.width)||48,(src&&src.height)||48,0xb98cff,roles[r][1]); }
    pal.forEach(([col,em],i)=>{ const mini='c3_mini'+(i+1),boss='c3_boss'+(i+1);if(!ASSET_SHEETS[mini])blob(mini,140,140,col,em,'#ffffff');if(!ASSET_SHEETS[boss])blob(boss,140,140,col,'👑','#ffd166');
      const k='bg'+(11+i); if(!this.textures.exists(k)&&!ASSET_IMAGES[k]){ const t=this.textures.createCanvas(k,256,256);if(t){const c=t.getContext();c.fillStyle=hex(Phaser.Display.Color.ValueToColor(col).darken(72).color);c.fillRect(0,0,256,256);
        c.globalAlpha=0.16;c.fillStyle=hex(col);for(let y=0;y<4;y++)for(let x=0;x<4;x++){c.beginPath();c.arc(32+x*64+(y%2)*32,32+y*64,10,0,Math.PI*2);c.fill();}c.globalAlpha=1;t.refresh();} } });
  }
  create(){
    // มดStage 1 ใช้ขอบเรืองแสงบาง ๆ จาก texture จริง ช่วยแยกตัวจากพื้นรังโดยไม่เพิ่ม Graphics ต่อศัตรูทุกเฟรม
    const buildReadableAnt=(key)=>{
      const source=this.textures.get(key); if(!source||source.key==='__MISSING'||this.textures.exists(key+'_readable'))return;
      const img=source.getSourceImage(),w=img&&img.width,h=img&&img.height;if(!w||!h)return;
      const tex=this.textures.createCanvas(key+'_readable',w,h);if(!tex)return;const c=tex.getContext();c.clearRect(0,0,w,h);
      c.save();c.shadowColor='rgba(218,255,145,0.95)';c.shadowBlur=3.5;c.drawImage(img,0,0);c.restore();c.drawImage(img,0,0);tex.refresh();
    };
    ['e_ant_worker','e_ant_scout','e_ant_spitter','e_ant_soldier','e_ant_drone'].forEach(buildReadableAnt);
    this.buildChapter3Placeholders();

    const mk=(key,size,draw)=>{ if(isArtKey(key)&&this.textures.exists(key))return;  // มีรูปจริงแล้ว ไม่ต้องวาดทับ
      if(this.textures.exists(key))this.textures.remove(key);
      const t=this.textures.createCanvas(key,size,size); if(!t)return; draw(t.getContext(),size); t.refresh(); };
    const rr=(c,x,y,w,h,r)=>{ c.beginPath();
      if(c.roundRect){ c.roundRect(x,y,w,h,r); }
      else { c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); } };

    // ---- ตัวละครน่ารัก (บอดี้กลม เงา แก้ม ตาวาว + ท็อปปิ้ง) ----
    const drawChar=(c,s,o)=>{ const cx=s/2, cy=s*0.54, R=s*0.40;
      c.clearRect(0,0,s,s);
      c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.92,R*0.72,R*0.2,0,0,TAU); c.fill();
      const g=c.createRadialGradient(cx-R*0.4,cy-R*0.5,R*0.15,cx,cy,R*1.25);
      g.addColorStop(0,o.c1); g.addColorStop(1,o.c2);
      c.fillStyle=g; rr(c,cx-R,cy-R,2*R,2*R*0.92,R*0.72); c.fill();
      c.lineWidth=s*0.028; c.strokeStyle=o.edge; c.stroke();
      c.fillStyle='rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(cx-R*0.32,cy-R*0.48,R*0.36,R*0.2,-0.4,0,TAU); c.fill();
      c.fillStyle=o.cheek; c.beginPath(); c.arc(cx-R*0.52,cy+R*0.2,R*0.15,0,TAU); c.arc(cx+R*0.52,cy+R*0.2,R*0.15,0,TAU); c.fill();
      c.fillStyle='#3b2b3a'; c.beginPath(); c.ellipse(cx-R*0.34,cy-R*0.02,R*0.12,R*0.17,0,0,TAU); c.ellipse(cx+R*0.34,cy-R*0.02,R*0.12,R*0.17,0,0,TAU); c.fill();
      c.fillStyle='#fff'; c.beginPath(); c.arc(cx-R*0.29,cy-R*0.1,R*0.05,0,TAU); c.arc(cx+R*0.39,cy-R*0.1,R*0.05,0,TAU); c.fill();
      c.strokeStyle='#3b2b3a'; c.lineWidth=s*0.022; c.lineCap='round'; c.beginPath(); c.arc(cx,cy+R*0.1,R*0.14,0.16*Math.PI,0.84*Math.PI); c.stroke();
      if(o.top)o.top(c,cx,cy-R,R,s);
    };
    const strawberry=(c,cx,ty,R,s)=>{ c.fillStyle='#5ec26a'; c.beginPath(); c.ellipse(cx,ty-R*0.02,R*0.16,R*0.08,0,0,TAU); c.fill();
      c.fillStyle='#ff5a6e'; c.beginPath(); c.moveTo(cx-R*0.16,ty); c.quadraticCurveTo(cx,ty+R*0.02,cx+R*0.16,ty); c.quadraticCurveTo(cx,ty+R*0.34,cx-R*0.16,ty); c.fill();
      c.fillStyle='#ffe08a'; c.beginPath(); c.arc(cx,ty+R*0.12,R*0.02,0,TAU); c.arc(cx-R*0.06,ty+R*0.06,R*0.02,0,TAU); c.arc(cx+R*0.06,ty+R*0.06,R*0.02,0,TAU); c.fill(); };
    const mintleaf=(c,cx,ty,R,s)=>{ c.fillStyle='#4fbf85'; c.beginPath(); c.ellipse(cx-R*0.08,ty,R*0.15,R*0.08,-0.5,0,TAU); c.ellipse(cx+R*0.08,ty,R*0.15,R*0.08,0.5,0,TAU); c.fill(); };
    const cocoaswirl=(c,cx,ty,R,s)=>{ c.strokeStyle='#4a2c1a'; c.lineWidth=s*0.05; c.lineCap='round'; c.beginPath(); c.arc(cx,ty+R*0.06,R*0.13,-0.3,Math.PI*1.5); c.stroke(); };

    mk('char_momo',60,(c,s)=>drawChar(c,s,{c1:'#fff2f7',c2:'#ffcfe2',edge:'#ff9ec4',cheek:'rgba(255,140,185,0.55)',top:strawberry}));
    mk('char_mint',60,(c,s)=>drawChar(c,s,{c1:'#eafff5',c2:'#b6f0d6',edge:'#57c99a',cheek:'rgba(110,215,165,0.5)',top:mintleaf}));
    mk('char_cocoa',60,(c,s)=>drawChar(c,s,{c1:'#e6c39c',c2:'#a9744a',edge:'#6b4632',cheek:'rgba(255,170,140,0.5)',top:cocoaswirl}));
    mk('mochi',60,(c,s)=>drawChar(c,s,{c1:'#fff2f7',c2:'#ffcfe2',edge:'#ff9ec4',cheek:'rgba(255,140,185,0.55)',top:strawberry}));

    // ---- ศัตรู "sour-side" หน้าโกรธ ----
    const drawEnemy=(c,s,o)=>{ const cx=s/2, cy=s*0.54, R=s*0.40;
      c.clearRect(0,0,s,s);
      c.fillStyle='rgba(20,10,25,0.22)'; c.beginPath(); c.ellipse(cx,s*0.92,R*0.68,R*0.18,0,0,TAU); c.fill();
      const g=c.createRadialGradient(cx-R*0.4,cy-R*0.5,R*0.15,cx,cy,R*1.25);
      g.addColorStop(0,o.c1); g.addColorStop(1,o.c2);
      c.fillStyle=g; rr(c,cx-R,cy-R,2*R,2*R*0.92,o.spiky?R*0.34:R*0.62); c.fill();
      c.lineWidth=s*0.03; c.strokeStyle=o.edge; c.stroke();
      c.fillStyle='#fff'; c.beginPath(); c.arc(cx-R*0.32,cy,R*0.17,0,TAU); c.arc(cx+R*0.32,cy,R*0.17,0,TAU); c.fill();
      c.fillStyle='#2b2233'; c.beginPath(); c.arc(cx-R*0.28,cy+R*0.04,R*0.08,0,TAU); c.arc(cx+R*0.36,cy+R*0.04,R*0.08,0,TAU); c.fill();
      c.strokeStyle='#2b2233'; c.lineCap='round'; c.lineWidth=s*0.055;
      c.beginPath(); c.moveTo(cx-R*0.52,cy-R*0.34); c.lineTo(cx-R*0.14,cy-R*0.12); c.stroke();
      c.beginPath(); c.moveTo(cx+R*0.52,cy-R*0.34); c.lineTo(cx+R*0.14,cy-R*0.12); c.stroke();
      c.lineWidth=s*0.03; c.beginPath(); c.arc(cx,cy+R*0.6,R*0.15,1.15*Math.PI,1.85*Math.PI); c.stroke();
    };
    mk('e_basic',44,(c,s)=>drawEnemy(c,s,{c1:'#b6ec9e',c2:'#6cbf6a',edge:'#4f9a55'}));
    mk('e_fast',38,(c,s)=>drawEnemy(c,s,{c1:'#bfe2ff',c2:'#6fb3f0',edge:'#4f8fd6'}));
    mk('e_tank',62,(c,s)=>drawEnemy(c,s,{c1:'#e0c8ff',c2:'#a97fe0',edge:'#7a4fd0',spiky:true}));
    // e_brute = ตัวถึกโปรซีเจอรัล (ย้อมสีได้) ใช้กับ elite/มินิ/บอส — แยกจากรูปจริง e_tank กันสีเพี้ยนตอน setTint
    mk('e_brute',62,(c,s)=>drawEnemy(c,s,{c1:'#e6d8ff',c2:'#b79ae8',edge:'#7a4fd0',spiky:true}));

    // ---- Stage 5: กองทัพเตาอบราชันขม (procedural alpha art; silhouette แยกชัดบนมือถือ) ----
    const drawOvenFoe=(c,s,o)=>{const cx=s/2,cy=s*0.56,R=s*0.31;
      c.clearRect(0,0,s,s);c.fillStyle='rgba(15,4,24,0.28)';c.beginPath();c.ellipse(cx,s*0.91,R*0.95,R*0.20,0,0,TAU);c.fill();
      const aura=c.createRadialGradient(cx,cy,2,cx,cy,R*1.55);aura.addColorStop(0,o.glow);aura.addColorStop(1,'rgba(80,10,110,0)');
      c.fillStyle=aura;c.beginPath();c.arc(cx,cy,R*1.55,0,TAU);c.fill();
      const body=c.createLinearGradient(cx-R,cy-R,cx+R,cy+R);body.addColorStop(0,o.c1);body.addColorStop(1,o.c2);
      c.fillStyle=body;rr(c,cx-R,cy-R,R*2,R*1.92,o.kind==='guard'?R*0.25:R*0.58);c.fill();c.strokeStyle=o.edge;c.lineWidth=s*0.035;c.stroke();
      if(o.kind==='spark'){for(let i=0;i<3;i++){c.fillStyle=i===0?'#ffe272':i===1?'#ff6b48':'#ca45ff';c.beginPath();c.moveTo(cx+(i-1)*14,cy-R*0.72);c.quadraticCurveTo(cx+(i-1)*12-8,cy-R*1.45,cx+(i-1)*2,cy-R*1.25);c.quadraticCurveTo(cx+(i-1)*18,cy-R*1.55,cx+(i-1)*14,cy-R*0.72);c.fill();}}
      if(o.kind==='blade'){c.fillStyle='#f7e9ff';c.strokeStyle='#8b5ca8';c.lineWidth=3;for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*R*0.65,cy-R*0.2);c.lineTo(cx+d*R*1.55,cy-R*0.55);c.lineTo(cx+d*R*0.86,cy+R*0.22);c.closePath();c.fill();c.stroke();}}
      if(o.kind==='eye'){c.fillStyle='#1b071f';c.beginPath();c.ellipse(cx,cy,R*0.72,R*0.46,0,0,TAU);c.fill();c.fillStyle='#fff07a';c.beginPath();c.ellipse(cx,cy,R*0.24,R*0.42,0,0,TAU);c.fill();c.fillStyle='#4b0b5c';c.beginPath();c.ellipse(cx,cy,R*0.08,R*0.35,0,0,TAU);c.fill();}
      else{c.fillStyle='#fff';c.beginPath();c.arc(cx-R*0.32,cy-R*0.08,R*0.16,0,TAU);c.arc(cx+R*0.32,cy-R*0.08,R*0.16,0,TAU);c.fill();c.fillStyle='#35113f';c.beginPath();c.arc(cx-R*0.28,cy-R*0.04,R*0.08,0,TAU);c.arc(cx+R*0.36,cy-R*0.04,R*0.08,0,TAU);c.fill();}
      if(o.kind==='bomb'){c.strokeStyle='#ffd166';c.lineWidth=5;c.beginPath();c.arc(cx+R*0.45,cy-R*0.92,R*0.42,Math.PI,Math.PI*1.75);c.stroke();c.fillStyle='#ffec6e';c.beginPath();c.arc(cx+R*0.73,cy-R*1.19,5,0,TAU);c.fill();}
      if(o.kind==='guard'){c.fillStyle='#ffd166';c.beginPath();c.moveTo(cx-R*0.78,cy-R);c.lineTo(cx-R*0.42,cy-R*1.52);c.lineTo(cx,cy-R*1.12);c.lineTo(cx+R*0.42,cy-R*1.52);c.lineTo(cx+R*0.78,cy-R);c.closePath();c.fill();c.strokeStyle='#8f5418';c.stroke();}
    };
    mk('e_oven_spark',128,(c,s)=>drawOvenFoe(c,s,{kind:'spark',c1:'#ff8654',c2:'#8e214f',edge:'#5b173d',glow:'rgba(255,90,80,0.48)'}));
    mk('e_oven_blade',128,(c,s)=>drawOvenFoe(c,s,{kind:'blade',c1:'#d9c7e8',c2:'#6f477f',edge:'#43254f',glow:'rgba(210,90,255,0.42)'}));
    mk('e_oven_eye',128,(c,s)=>drawOvenFoe(c,s,{kind:'eye',c1:'#8d3aac',c2:'#2a102f',edge:'#17091d',glow:'rgba(222,70,255,0.52)'}));
    mk('e_oven_bomb',128,(c,s)=>drawOvenFoe(c,s,{kind:'bomb',c1:'#ff8a5a',c2:'#61233b',edge:'#3c142c',glow:'rgba(255,100,55,0.46)'}));
    mk('e_oven_guard',128,(c,s)=>drawOvenFoe(c,s,{kind:'guard',c1:'#612b72',c2:'#201126',edge:'#f0b84b',glow:'rgba(255,209,92,0.44)'}));

    // The Great Hunger Reborn: Cosmic Devourer — เงากว้าง มงกุฎแตก ดวงตาหกดวง ปากกลางอก และกรงเล็บ
    mk('boss5_ascended',256,(c,s)=>{const cx=s/2,cy=s*0.56;
      c.clearRect(0,0,s,s);
      const aura=c.createRadialGradient(cx,cy,5,cx,cy,s*0.52);aura.addColorStop(0,'rgba(255,58,120,0.50)');aura.addColorStop(0.35,'rgba(174,42,224,0.34)');aura.addColorStop(0.72,'rgba(60,5,82,0.26)');aura.addColorStop(1,'rgba(5,0,12,0)');c.fillStyle=aura;c.fillRect(0,0,s,s);
      c.fillStyle='rgba(2,0,8,0.48)';c.beginPath();c.ellipse(cx,s*0.92,s*0.43,s*0.07,0,0,TAU);c.fill();
      // ปีกเงา/ผ้าคลุมแตก ทำ silhouette กว้างกว่าบอสทั่วไป
      const wing=c.createLinearGradient(cx,42,cx,s*0.88);wing.addColorStop(0,'#52106c');wing.addColorStop(0.42,'#210529');wing.addColorStop(1,'#07020b');c.fillStyle=wing;c.strokeStyle='#9d35bd';c.lineWidth=5;
      for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*18,62);c.bezierCurveTo(cx+d*67,46,cx+d*103,71,cx+d*116,116);c.lineTo(cx+d*82,107);c.lineTo(cx+d*109,157);c.lineTo(cx+d*69,143);c.lineTo(cx+d*91,211);c.quadraticCurveTo(cx+d*45,198,cx+d*20,178);c.closePath();c.fill();c.stroke();}
      // แกนลำตัวเป็นหลุมดำ ไม่ใช่เชฟมนุษย์
      const body=c.createLinearGradient(cx,34,cx,s*0.91);body.addColorStop(0,'#6a1a80');body.addColorStop(0.3,'#27052f');body.addColorStop(0.78,'#0b020f');body.addColorStop(1,'#020104');c.fillStyle=body;c.beginPath();c.moveTo(cx,32);c.bezierCurveTo(cx-63,41,cx-72,107,cx-67,176);c.lineTo(cx-88,226);c.quadraticCurveTo(cx,247,cx+88,226);c.lineTo(cx+67,176);c.bezierCurveTo(cx+72,107,cx+63,41,cx,32);c.fill();c.strokeStyle='#d94ff0';c.lineWidth=7;c.stroke();
      // มงกุฎโบราณแตกและเขาคู่
      c.fillStyle='#09010d';c.strokeStyle='#ffbf3f';c.lineWidth=6;c.beginPath();c.moveTo(cx-72,61);c.lineTo(cx-58,11);c.lineTo(cx-29,47);c.lineTo(cx,-2);c.lineTo(cx+28,47);c.lineTo(cx+61,9);c.lineTo(cx+74,62);c.lineTo(cx+38,51);c.lineTo(cx+18,68);c.lineTo(cx-20,68);c.lineTo(cx-40,51);c.closePath();c.fill();c.stroke();
      c.fillStyle='#ff3f78';for(const x of [cx-57,cx,cx+59]){c.beginPath();c.arc(x,x===cx?13:28,x===cx?8:6,0,TAU);c.fill();}
      // ใบหน้าไร้จมูก มีดวงตา 3 คู่
      for(let row=0;row<3;row++){const yy=76+row*18,spread=22+row*8;for(const d of [-1,1]){c.save();c.translate(cx+d*spread,yy);c.rotate(d*(row-1)*0.12);c.fillStyle='#fff47a';c.beginPath();c.ellipse(0,0,11-row,5.5,0,0,TAU);c.fill();c.fillStyle='#ff245f';c.beginPath();c.ellipse(d*2,0,3,4.5,0,0,TAU);c.fill();c.restore();}}
      // ปากสุญญะกลางอกหลายชั้น
      const maw=c.createRadialGradient(cx,151,1,cx,151,58);maw.addColorStop(0,'#000');maw.addColorStop(0.48,'#030006');maw.addColorStop(0.7,'#5b082f');maw.addColorStop(0.86,'#ff265f');maw.addColorStop(1,'rgba(210,45,255,0)');c.fillStyle=maw;c.beginPath();c.ellipse(cx,154,61,48,0,0,TAU);c.fill();
      c.strokeStyle='#ffcb55';c.lineWidth=4;c.beginPath();c.ellipse(cx,154,48,36,0,0,TAU);c.stroke();
      c.fillStyle='#fff1bf';for(let i=0;i<10;i++){const a=i*TAU/10,x=cx+Math.cos(a)*43,y=154+Math.sin(a)*31;c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.beginPath();c.moveTo(-5,0);c.lineTo(0,15);c.lineTo(5,0);c.closePath();c.fill();c.restore();}
      c.fillStyle='#ff367d';c.beginPath();c.arc(cx,154,10,0,TAU);c.fill();c.fillStyle='#140018';c.beginPath();c.arc(cx,154,5,0,TAU);c.fill();
      // แขนกรงเล็บยาวโอบผู้เล่น
      c.strokeStyle='#b936d4';c.lineWidth=13;c.lineCap='round';for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*54,111);c.quadraticCurveTo(cx+d*112,139,cx+d*100,203);c.stroke();c.fillStyle='#120218';for(let k=0;k<3;k++){c.beginPath();c.moveTo(cx+d*(91+k*7),194+k*3);c.lineTo(cx+d*(122+k*5),216+k*4);c.lineTo(cx+d*(99+k*5),205+k*2);c.closePath();c.fill();c.strokeStyle='#ffbf3f';c.lineWidth=2;c.stroke();}}
      // Waitยแตกพลังบนลำตัว
      c.strokeStyle='rgba(255,196,63,0.82)';c.lineWidth=3;for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*17,112);c.lineTo(cx+d*31,126);c.lineTo(cx+d*22,139);c.lineTo(cx+d*39,151);c.stroke();}
      c.fillStyle='rgba(255,255,255,0.70)';c.beginPath();c.ellipse(cx-48,42,9,19,-0.55,0,TAU);c.fill();
    });
    mk('hunger_seal',160,(c,s)=>{const cx=s/2;c.clearRect(0,0,s,s);const g=c.createRadialGradient(cx,cx,4,cx,cx,cx);g.addColorStop(0,'rgba(255,236,110,0.58)');g.addColorStop(0.38,'rgba(217,92,255,0.24)');g.addColorStop(1,'rgba(40,5,60,0)');c.fillStyle=g;c.fillRect(0,0,s,s);c.strokeStyle='#d95cff';c.lineWidth=7;c.beginPath();c.arc(cx,cx,45,0,TAU);c.stroke();c.strokeStyle='#ffd166';c.lineWidth=4;for(let i=0;i<6;i++){const a=i*TAU/6;c.beginPath();c.moveTo(cx+Math.cos(a)*18,cx+Math.sin(a)*18);c.lineTo(cx+Math.cos(a)*62,cx+Math.sin(a)*62);c.stroke();}});
    mk('crown_oven',196,(c,s)=>{const cx=s/2;c.clearRect(0,0,s,s);c.fillStyle='rgba(12,3,20,0.30)';c.beginPath();c.ellipse(cx,s*0.9,s*0.4,s*0.08,0,0,TAU);c.fill();const g=c.createLinearGradient(0,20,0,s);g.addColorStop(0,'#7b3d87');g.addColorStop(1,'#24102d');c.fillStyle=g;rr(c,27,48,s-54,s-70,22);c.fill();c.strokeStyle='#d95cff';c.lineWidth=6;c.stroke();c.fillStyle='#09040d';rr(c,48,82,s-96,70,15);c.fill();c.fillStyle='#ff6a46';c.beginPath();c.ellipse(cx,116,42,25,0,0,TAU);c.fill();c.fillStyle='#ffd166';c.beginPath();c.moveTo(47,55);c.lineTo(66,18);c.lineTo(cx,50);c.lineTo(130,18);c.lineTo(149,55);c.closePath();c.fill();});


    // ---- ลูกกวาด (glossy) / กระสุน / อนุภาค / vignette ----
    mk('candy',20,(c,s)=>{ const cx=s/2,r=s*0.42; const g=c.createRadialGradient(cx-2,cx-2,1,cx,cx,r);
      g.addColorStop(0,'#fff3b0'); g.addColorStop(1,'#f0a92e'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,r,0,TAU); c.fill();
      c.strokeStyle='#c9832a'; c.lineWidth=1.3; c.stroke();
      c.fillStyle='rgba(255,255,255,0.85)'; c.beginPath(); c.arc(cx-r*0.35,cx-r*0.35,r*0.22,0,TAU); c.fill(); });
    // v8.0.72 กระสุนบอสเฉพาะตัว: รูปขาว + ขอบเข้ม (ย้อมสีตามบอส ขอบยังเข้ม อ่านง่าย) ขนาด 128 = เท่า cr_foe_bolt → hitbox เดิม
    mk('boss_orb',128,(c,s)=>{ const cx=s/2; c.fillStyle='#2a1430'; c.beginPath(); c.arc(cx,cx,s*.3,0,TAU); c.fill(); const g=c.createRadialGradient(cx-8,cx-8,2,cx,cx,s*.25); g.addColorStop(0,'#ffffff'); g.addColorStop(1,'#e8e8e8'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,s*.24,0,TAU); c.fill(); c.fillStyle='rgba(255,255,255,.9)'; c.beginPath(); c.arc(cx-10,cx-10,s*.06,0,TAU); c.fill(); });
    mk('boss_shard',128,(c,s)=>{ const cx=s/2,P=(r,w)=>{ c.beginPath(); c.moveTo(cx+r,cx); c.lineTo(cx,cx-w); c.lineTo(cx-r*.75,cx); c.lineTo(cx,cx+w); c.closePath(); c.fill(); }; c.fillStyle='#2a1430'; P(s*.4,s*.2); c.fillStyle='#f4f4f4'; P(s*.32,s*.13); });
    mk('boss_star',128,(c,s)=>{ const cx=s/2,P=(ro,ri)=>{ c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5,r=i%2?ri:ro; c.lineTo(cx+Math.cos(a)*r,cx+Math.sin(a)*r); } c.closePath(); c.fill(); }; c.fillStyle='#2a1430'; P(s*.36,s*.17); c.fillStyle='#f4f4f4'; P(s*.28,s*.12); });
    mk('spark',16,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'#ffffff'); g.addColorStop(0.55,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('dot',12,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'#ffffff'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('vignette',256,(c,s)=>{ const g=c.createRadialGradient(s/2,s/2,s*0.28,s/2,s/2,s*0.62);
      g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(8,4,12,0.5)'); c.fillStyle=g; c.fillRect(0,0,s,s); });
    // ไอเทมฟื้นฟู = หัวใจโมจิ
    mk('heal',24,(c,s)=>{ const cx=s/2,cy=s*0.46,r=s*0.3; c.fillStyle='rgba(20,10,25,0.15)'; c.beginPath(); c.ellipse(cx,s*0.9,r*0.7,r*0.18,0,0,TAU); c.fill();
      c.fillStyle='#ff6a97'; c.beginPath(); c.moveTo(cx,cy+r*0.9); c.bezierCurveTo(cx-r*1.4,cy-r*0.2,cx-r*0.5,cy-r*1.1,cx,cy-r*0.25); c.bezierCurveTo(cx+r*0.5,cy-r*1.1,cx+r*1.4,cy-r*0.2,cx,cy+r*0.9); c.fill();
      c.strokeStyle='#e0447a'; c.lineWidth=s*0.05; c.stroke();
      c.fillStyle='rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(cx-r*0.4,cy-r*0.3,r*0.22,r*0.14,-0.5,0,TAU); c.fill(); });
    // กล่อง/โหลทุบได้ (ธีมครัว) — โหลแยมกลม ๆ
    mk('crate',44,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.9,s*0.32,s*0.09,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.2,0,s*0.9); g.addColorStop(0,'#ffd59e'); g.addColorStop(1,'#e59a4d');
      c.fillStyle=g; rr(c,s*0.18,s*0.28,s*0.64,s*0.6,s*0.14); c.fill(); c.lineWidth=s*0.045; c.strokeStyle='#b9702e'; c.stroke();
      c.fillStyle='#c8e6a0'; rr(c,s*0.24,s*0.14,s*0.52,s*0.18,s*0.08); c.fill(); c.strokeStyle='#8fb85f'; c.lineWidth=s*0.04; c.stroke();
      c.fillStyle='rgba(255,255,255,0.4)'; rr(c,s*0.26,s*0.36,s*0.14,s*0.4,s*0.06); c.fill(); });
    // หีบสกิลระหว่างเล่น (แยกจากกล่องรางวัลจบด่าน)
    mk('chest',40,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.2)'; c.beginPath(); c.ellipse(cx,s*0.9,s*0.34,s*0.09,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.3,0,s*0.85); g.addColorStop(0,'#a9744a'); g.addColorStop(1,'#6b4632');
      c.fillStyle=g; rr(c,s*0.16,s*0.42,s*0.68,s*0.42,s*0.06); c.fill();
      const lid=c.createLinearGradient(0,s*0.24,0,s*0.5); lid.addColorStop(0,'#c89a5e'); lid.addColorStop(1,'#8a5e3a');
      c.fillStyle=lid; rr(c,s*0.16,s*0.26,s*0.68,s*0.2,s*0.09); c.fill();
      c.strokeStyle='#ffd166'; c.lineWidth=s*0.05; c.strokeRect(s*0.17,s*0.44,s*0.66,s*0.02);   // แถบทอง
      c.fillStyle='#ffe08a'; rr(c,s*0.44,s*0.4,s*0.12,s*0.18,s*0.03); c.fill();   // ตัวLocked
      c.fillStyle='#b9862e'; c.beginPath(); c.arc(cx,s*0.52,s*0.045,0,TAU); c.fill(); });
    // ของสวมใส่ดWaitป (loot) — กล่องของขวัญ
    mk('gift',28,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.88,s*0.3,s*0.08,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.35,0,s*0.85); g.addColorStop(0,'#7fd0ff'); g.addColorStop(1,'#4f9fe0');
      c.fillStyle=g; rr(c,s*0.22,s*0.42,s*0.56,s*0.42,s*0.05); c.fill();
      c.fillStyle='#ffd166'; rr(c,s*0.22,s*0.34,s*0.56,s*0.12,s*0.04); c.fill();   // ฝา
      c.fillStyle='#ff8fb5'; c.fillRect(s*0.46,s*0.34,s*0.08,s*0.5);               // ริบบิ้นแนวตั้ง
      c.beginPath(); c.moveTo(cx,s*0.32); c.lineTo(s*0.36,s*0.2); c.lineTo(s*0.46,s*0.32); c.closePath(); c.fill();  // โบว์
      c.beginPath(); c.moveTo(cx,s*0.32); c.lineTo(s*0.64,s*0.2); c.lineTo(s*0.54,s*0.32); c.closePath(); c.fill(); });
    // ไอเทมMagnet (vacuum) — ดูดออร์บ EXP ทั้งจอ
    mk('vac',26,(c,s)=>{ c.fillStyle='rgba(20,10,25,0.16)'; c.beginPath(); c.ellipse(s/2,s*0.9,s*0.3,s*0.08,0,0,TAU); c.fill();
      c.lineCap='round'; c.strokeStyle='#ff5a6e'; c.lineWidth=s*0.17;   // เกือกม้าMagnetสีแดง (U คว่ำ)
      c.beginPath(); c.moveTo(s*0.30,s*0.34); c.lineTo(s*0.30,s*0.56); c.stroke();
      c.beginPath(); c.moveTo(s*0.70,s*0.34); c.lineTo(s*0.70,s*0.56); c.stroke();
      c.beginPath(); c.arc(s*0.5,s*0.56,s*0.20,0,Math.PI,false); c.stroke();
      c.fillStyle='#dcdce8'; c.fillRect(s*0.215,s*0.28,s*0.17,s*0.09); c.fillRect(s*0.615,s*0.28,s*0.17,s*0.09); })   // ปลายสีเงิน;
    // ---- VFX textures ----
    mk('vfx_ring',64,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,s*0.28,cx,cx,s*0.5);
      g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.5,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,s*0.5,0,TAU); c.fill(); });
    mk('vfx_poof',48,(c,s)=>{ const cx=s/2; for(let i=0;i<6;i++){
      const a=i/6*TAU, r=s*0.18, px=cx+Math.cos(a)*r, py=cx+Math.sin(a)*r;
      const g=c.createRadialGradient(px,py,0,px,py,s*0.22);
      g.addColorStop(0,'rgba(255,255,255,0.7)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(px,py,s*0.22,0,TAU); c.fill(); }
      const g2=c.createRadialGradient(cx,cx,0,cx,cx,s*0.2);
      g2.addColorStop(0,'rgba(255,255,255,0.85)'); g2.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g2; c.beginPath(); c.arc(cx,cx,s*0.2,0,TAU); c.fill(); });
    mk('vfx_glow',32,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'rgba(255,255,255,0.95)'); g.addColorStop(0.4,'rgba(255,255,255,0.5)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('bubble',30,(c,s)=>{ const cx=s/2;   // ฟองสบู่โปร่งแสง (กระสุนสกิล bubble)
      const g=c.createRadialGradient(cx,cx,s*0.1,cx,cx,cx); g.addColorStop(0,'rgba(215,242,255,0.10)'); g.addColorStop(0.72,'rgba(190,232,255,0.26)'); g.addColorStop(0.9,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(190,232,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx*0.95,0,TAU); c.fill();
      c.fillStyle='rgba(255,255,255,0.9)'; c.beginPath(); c.arc(cx*0.66,cx*0.6,s*0.08,0,TAU); c.fill(); });
    mk('vfx_line',32,(c,s)=>{ const g=c.createLinearGradient(0,s/2,s,s/2);
      g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.3,'rgba(255,255,255,0.8)'); g.addColorStop(0.7,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.fillRect(0,s*0.38,s,s*0.24); });

    // ---- สร้างอนิเมชัน flipbook ของ VFX (เล่นครั้งเดียวจบ) ----
    for(const k in ASSET_FX){ if(!this.textures.exists(k))continue; const fx=ASSET_FX[k];
      if(this.anims.exists(k))continue;
      this.anims.create({ key:k, frames:this.anims.generateFrameNumbers(k,{start:0,end:fx.frames-1}), frameRate:fx.rate, repeat:fx.loop?-1:0 }); }

    if(this.textures.exists('fx_bossportal')&&!this.anims.exists('portal_idle'))
      this.anims.create({key:'portal_idle',frames:this.anims.generateFrameNumbers('fx_bossportal',{start:0,end:ASSET_FX.fx_bossportal.frames-1}),frameRate:12,repeat:-1});
    if(this.textures.exists('boss1')&&!this.anims.exists('boss1_idle'))
      this.anims.create({key:'boss1_idle',frames:[{key:'boss1',frame:0},{key:'boss1',frame:1}],frameRate:3,repeat:-1,yoyo:true});
    if(this.textures.exists('boss2')&&!this.anims.exists('boss2_reveal'))
      this.anims.create({key:'boss2_reveal',frames:[{key:'boss2',frame:2},{key:'boss2',frame:3}],frameRate:4,repeat:0});
    for(const k of ['boss3','boss4'])if(this.textures.exists(k)&&!this.anims.exists(k+'_idle'))
      this.anims.create({key:k+'_idle',frames:[{key:k,frame:0},{key:k,frame:1}],frameRate:3,repeat:-1,yoyo:true});
    if(this.textures.exists('boss5_sovereign')&&!this.anims.exists('boss5_sovereign_idle'))
      this.anims.create({key:'boss5_sovereign_idle',frames:[{key:'boss5_sovereign',frame:0},{key:'boss5_sovereign',frame:1}],frameRate:2.5,repeat:-1,yoyo:true});
    if(this.textures.exists('boss6_rootmother')&&!this.anims.exists('boss6_rootmother_idle'))
      this.anims.create({key:'boss6_rootmother_idle',frames:[{key:'boss6_rootmother',frame:0},{key:'boss6_rootmother',frame:1}],frameRate:2.2,repeat:-1,yoyo:true});
    // ---- อนิเมชันศัตรู (walk/attack loop จาก ASSET_SHEETS ที่มี .anim) ----
    for(const k in ASSET_SHEETS){ const sh=ASSET_SHEETS[k]; if(!sh.anim)continue;
      if(!this.textures.exists(k)||this.anims.exists(k+'_walk'))continue;
      this.anims.create({ key:k+'_walk', frames:this.anims.generateFrameNumbers(k,{start:sh.anim.start||0,end:(sh.anim.start||0)+sh.anim.frames-1}), frameRate:sh.anim.rate, repeat:-1, yoyo:!!sh.anim.yoyo }); }

    registerEnemyActionAnimations(this);
    registerRootKnightAnimations(this);
    for(const k of Object.keys(ASSET_SHEETS).filter(k=>k.startsWith('c3_mini')||k.startsWith('c3_boss'))){
      if(this.textures.exists(k)&&!this.anims.exists(k+'_idle'))this.anims.create({key:k+'_idle',frames:[{key:k,frame:0},{key:k,frame:1}],frameRate:2.5,repeat:-1,yoyo:true});
    }

    // ---- Props ประดับฉาก (placeholder กล่อง ๆ — สลับอาร์ต AI ทีหลัง) ----
    const mkRect=(key,w,h,draw)=>{ if(isArtKey(key)&&this.textures.exists(key))return;   // มีรูป AI แล้ว ไม่วาดทับ (procedural = fallback)
      if(this.textures.exists(key))this.textures.remove(key);
      const t=this.textures.createCanvas(key,w,h); if(!t)return; draw(t.getContext(),w,h); t.refresh(); };
    const lg=(c,x0,y0,x1,y1,a,b)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
    const gShadow=(c,w,h)=>{ c.fillStyle='rgba(20,10,25,0.22)'; c.beginPath(); c.ellipse(w/2,h-7,w*0.40,h*0.09,0,0,TAU); c.fill(); };
    // ชั้นวางไม้ 2 ชั้น + โหลข้างบน
    mkRect('p_shelf',200,132,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle='#7a4d2b'; c.fillRect(w*0.13,h*0.30,11,h*0.60); c.fillRect(w*0.83,h*0.30,11,h*0.60);
      for(const yy of [h*0.30,h*0.60]){ c.fillStyle=lg(c,0,yy,0,yy+20,'#c98a4e','#95602f'); rr(c,w*0.05,yy,w*0.90,20,5); c.fill(); c.strokeStyle='rgba(70,40,20,0.55)'; c.lineWidth=2; c.stroke(); }
      const jar=(jx,jy,col)=>{ c.fillStyle=col; rr(c,jx,jy,26,30,7); c.fill(); c.fillStyle='#f4e6c8'; rr(c,jx+3,jy-6,20,8,3); c.fill(); c.fillStyle='rgba(255,255,255,0.4)'; rr(c,jx+4,jy+4,6,16,3); c.fill(); };
      jar(w*0.20,h*0.30-30,'#e8637a'); jar(w*0.44,h*0.30-30,'#f0a92e'); jar(w*0.68,h*0.30-30,'#a06be0'); });
    // ลังไม้ (กากบาท)
    mkRect('p_crate',112,120,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,0,h,'#c07f42','#8a562d'); rr(c,w*0.10,h*0.12,w*0.80,h*0.78,8); c.fill();
      c.strokeStyle='#6d4423'; c.lineWidth=6; c.stroke();
      c.lineWidth=7; c.strokeStyle='rgba(120,75,38,0.85)'; c.beginPath(); c.moveTo(w*0.14,h*0.16); c.lineTo(w*0.86,h*0.86); c.moveTo(w*0.86,h*0.16); c.lineTo(w*0.14,h*0.86); c.stroke();
      c.fillStyle='rgba(255,240,210,0.18)'; rr(c,w*0.14,h*0.16,w*0.72,10,4); c.fill(); });
    // กระป๋องยักษ์ (แลนด์มาร์ก) โลหะ + แถบฉลาก
    mkRect('p_cans',126,168,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,w*0.15,0,w*0.85,0,'#aeb7c4','#e6ecf3'); rr(c,w*0.16,h*0.14,w*0.68,h*0.78,10); c.fill();
      c.fillStyle='rgba(255,255,255,0.5)'; rr(c,w*0.24,h*0.16,10,h*0.72,5); c.fill();
      c.fillStyle=lg(c,0,h*0.36,0,h*0.72,'#ff6d7e','#e23b57'); c.fillRect(w*0.16,h*0.40,w*0.68,h*0.34);
      c.fillStyle='#fff3d6'; c.beginPath(); c.arc(w*0.5,h*0.57,15,0,TAU); c.fill();
      c.fillStyle='#8fbf5a'; c.beginPath(); c.arc(w*0.5,h*0.57,9,0,TAU); c.fill();
      c.fillStyle='#c9d2dc'; rr(c,w*0.14,h*0.10,w*0.72,10,5); c.fill(); });
    // โหลแยม 3 ใบ
    mkRect('p_jars',124,92,(c,w,h)=>{ gShadow(c,w,h);
      const jar=(jx,s,col)=>{ c.fillStyle=col; rr(c,jx,h*0.30,34*s,44*s,9); c.fill(); c.strokeStyle='rgba(90,50,60,0.35)'; c.lineWidth=2; c.stroke();
        c.fillStyle='#f4e6c8'; rr(c,jx+3,h*0.30-9,28*s,11,4); c.fill(); c.fillStyle='rgba(255,255,255,0.42)'; rr(c,jx+5,h*0.36,8,20*s,4); c.fill(); };
      jar(w*0.06,1.05,'#e8637a'); jar(w*0.66,0.95,'#f0a92e'); jar(w*0.37,1.15,'#c0507a'); });
    // ถุงแป้ง + แป้งหก
    mkRect('p_flour',132,94,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle='rgba(245,240,228,0.85)'; c.beginPath(); c.ellipse(w*0.62,h*0.86,w*0.36,h*0.13,0,0,TAU); c.fill();
      c.fillStyle=lg(c,0,h*0.2,0,h*0.9,'#f0e6cf','#d8cbac'); rr(c,w*0.16,h*0.24,w*0.56,h*0.62,10); c.fill();
      c.strokeStyle='rgba(150,130,95,0.5)'; c.lineWidth=2; c.stroke();
      c.fillStyle='#b98a4a'; c.font='bold 15px sans-serif'; c.fillText('🌾',w*0.30,h*0.62);
      c.fillStyle='rgba(255,255,255,0.9)'; c.beginPath(); c.arc(w*0.80,h*0.5,4,0,TAU); c.arc(w*0.86,h*0.62,3,0,TAU); c.arc(w*0.74,h*0.72,3,0,TAU); c.fill(); });
    // กล่องกระดาษเปิดฝา
    mkRect('p_box',100,92,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,0,h,'#d2a76d','#b07f45'); rr(c,w*0.16,h*0.34,w*0.68,h*0.54,6); c.fill();
      c.strokeStyle='#8a6335'; c.lineWidth=4; c.stroke();
      c.fillStyle='#c49a5f'; c.beginPath(); c.moveTo(w*0.16,h*0.36); c.lineTo(w*0.30,h*0.16); c.lineTo(w*0.44,h*0.36); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(w*0.84,h*0.36); c.lineTo(w*0.70,h*0.16); c.lineTo(w*0.56,h*0.36); c.closePath(); c.fill();
      c.fillStyle='rgba(90,60,30,0.35)'; c.fillRect(w*0.16,h*0.55,w*0.68,3); });

    // ---- Stage 2: อุปกรณ์ท่อระบาย + กลีบ Sakura (โปร่งใส Noneพื้นหลังดำ) ----
    mkRect('drain_grate',150,112,(c,w,h)=>{ gShadow(c,w,h);
      const g=lg(c,0,0,w,h,'#8597a5','#334754');c.fillStyle=g;rr(c,8,12,w-16,h-24,24);c.fill();
      c.lineWidth=6;c.strokeStyle='#b9d7df';c.stroke();c.strokeStyle='rgba(18,35,46,.8)';c.lineWidth=8;
      for(let x=34;x<w-20;x+=27){c.beginPath();c.moveTo(x,25);c.lineTo(x,h-26);c.stroke();}
      c.lineWidth=3;c.strokeStyle='rgba(204,255,247,.45)';c.beginPath();c.arc(w/2,h/2,38,0,TAU);c.stroke();});
    mkRect('drain_pipe',142,150,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,w,0,'#b8d0d9','#425866');rr(c,15,18,w-30,h-36,28);c.fill();
      c.lineWidth=8;c.strokeStyle='#29404e';c.stroke();c.fillStyle='#20323d';c.beginPath();c.ellipse(w/2,h*.36,w*.28,h*.17,0,0,TAU);c.fill();
      c.strokeStyle='#8fe3d0';c.lineWidth=4;c.stroke();c.fillStyle='rgba(98,238,191,.45)';c.beginPath();c.ellipse(w/2,h*.7,w*.22,h*.10,0,0,TAU);c.fill();});
    mkRect('drain_sludge',132,86,(c,w,h)=>{ const g=c.createRadialGradient(w/2,h/2,4,w/2,h/2,w*.5);
      g.addColorStop(0,'rgba(119,232,164,.72)');g.addColorStop(.65,'rgba(52,153,128,.48)');g.addColorStop(1,'rgba(24,74,82,0)');c.fillStyle=g;c.beginPath();c.ellipse(w/2,h/2,w*.48,h*.38,0,0,TAU);c.fill();});
    mkRect('drain_bubbles',96,120,(c,w,h)=>{ for(let i=0;i<7;i++){const x=14+(i*29)%70,y=14+(i*37)%94,r=6+(i%3)*4;
      c.fillStyle='rgba(196,247,255,.14)';c.strokeStyle='rgba(218,255,248,.75)';c.lineWidth=2;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();}});
    mkRect('sakura_petal',28,18,(c,w,h)=>{ const g=lg(c,0,0,w,h,'#fff3f8','#ff75b4');c.fillStyle=g;
      c.beginPath();c.moveTo(2,h/2);c.bezierCurveTo(w*.28,-2,w*.72,-2,w-2,h/2);c.bezierCurveTo(w*.72,h+2,w*.28,h+2,2,h/2);c.fill();
      c.strokeStyle='rgba(146,39,93,.65)';c.lineWidth=1.5;c.stroke();});

    // ---- Stage 3: Roomเครื่องพริกเพลิง ----
    mkRect('stove_furnace',176,154,(c,w,h)=>{gShadow(c,w,h);c.fillStyle=lg(c,0,0,0,h,'#7b6a70','#29242d');rr(c,12,12,w-24,h-24,18);c.fill();c.strokeStyle='#b7a5a8';c.lineWidth=5;c.stroke();c.fillStyle='#180b10';rr(c,38,55,w-76,62,12);c.fill();const f=c.createRadialGradient(w/2,87,4,w/2,87,52);f.addColorStop(0,'#fff18a');f.addColorStop(.35,'#ff8a35');f.addColorStop(1,'rgba(190,20,28,0)');c.fillStyle=f;c.fillRect(32,42,w-64,86);c.fillStyle='#ffcf59';for(const x of [48,88,128]){c.beginPath();c.arc(x,34,8,0,TAU);c.fill();}});
    mkRect('stove_pipe',166,92,(c,w,h)=>{gShadow(c,w,h);c.strokeStyle='#5d4f57';c.lineWidth=28;c.lineCap='round';c.beginPath();c.moveTo(18,66);c.lineTo(66,66);c.quadraticCurveTo(88,66,88,44);c.lineTo(88,20);c.lineTo(148,20);c.stroke();c.strokeStyle='#d0b7a4';c.lineWidth=5;c.stroke();c.fillStyle='#ff7440';for(const x of [42,116]){c.beginPath();c.arc(x,66-(x>80?46:0),7,0,TAU);c.fill();}});
    mkRect('stove_gear',104,104,(c,w,h)=>{gShadow(c,w,h);c.save();c.translate(w/2,h/2);c.fillStyle='#80626a';for(let i=0;i<12;i++){c.rotate(TAU/12);c.fillRect(-7,-49,14,20);}c.beginPath();c.arc(0,0,38,0,TAU);c.fill();c.fillStyle='#2a2029';c.beginPath();c.arc(0,0,17,0,TAU);c.fill();c.strokeStyle='#ff9a4e';c.lineWidth=4;c.stroke();c.restore();});
    mkRect('stove_belt',190,78,(c,w,h)=>{gShadow(c,w,h);c.fillStyle='#332a31';rr(c,5,18,w-10,44,15);c.fill();c.strokeStyle='#a88e83';c.lineWidth=5;c.stroke();for(let x=22;x<w-14;x+=28){c.fillStyle='#73636b';c.beginPath();c.arc(x,40,10,0,TAU);c.fill();c.strokeStyle='#ff7440';c.lineWidth=2;c.stroke();}});

    // ---- Stage 4: คุกเย็นน้ำตาล ----
    mkRect('ice_cage',150,168,(c,w,h)=>{gShadow(c,w,h);c.strokeStyle='#9fe8ff';c.lineWidth=9;c.lineCap='round';for(let x=24;x<w;x+=34){c.beginPath();c.moveTo(x,22);c.lineTo(x,h-20);c.stroke();}c.strokeStyle='#3e7ea1';c.lineWidth=7;for(const y of [32,h-31]){c.beginPath();c.moveTo(15,y);c.lineTo(w-15,y);c.stroke();}c.fillStyle='rgba(120,220,255,.18)';rr(c,14,18,w-28,h-35,16);c.fill();});
    mkRect('ice_crystal',112,148,(c,w,h)=>{gShadow(c,w,h);const q=lg(c,0,8,w,h,'#efffff','#54b9ee');c.fillStyle=q;c.strokeStyle='#bdf3ff';c.lineWidth=4;c.beginPath();c.moveTo(w/2,3);c.lineTo(w-16,h*.55);c.lineTo(w*.68,h-15);c.lineTo(w*.42,h-4);c.lineTo(12,h*.55);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.48)';c.beginPath();c.moveTo(w/2,12);c.lineTo(w*.56,h*.72);c.lineTo(w*.31,h*.55);c.closePath();c.fill();});
    mkRect('ice_chain',182,72,(c,w,h)=>{gShadow(c,w,h);c.strokeStyle='#8ddcf8';c.lineWidth=8;for(let i=0;i<6;i++){c.beginPath();c.ellipse(18+i*29,h/2,18,10,i%2?-.45:.45,0,TAU);c.stroke();}c.strokeStyle='rgba(255,255,255,.58)';c.lineWidth=2;for(let i=0;i<6;i++){c.beginPath();c.ellipse(18+i*29,h/2-2,17,9,i%2?-.45:.45,0,TAU);c.stroke();}});
    mkRect('ice_pool',158,82,(c,w,h)=>{const q=c.createRadialGradient(w/2,h/2,3,w/2,h/2,w*.48);q.addColorStop(0,'rgba(230,255,255,.78)');q.addColorStop(.55,'rgba(92,199,241,.50)');q.addColorStop(1,'rgba(49,117,180,0)');c.fillStyle=q;c.beginPath();c.ellipse(w/2,h/2,w*.48,h*.38,0,0,TAU);c.fill();});

    this.scene.start('Opening');
  }
}

/* v8.1.3: whole-game sweeps replaced by on-demand persistent asset caching. */
function allAssetUrls(){ const set=new Set(),add=u=>{ if(typeof u==='string'&&u.startsWith('assets/'))set.add(verUrl(u)); };
  for(const k in ASSET_IMAGES)add(ASSET_IMAGES[k]); for(const k in ASSET_SHEETS)add(ASSET_SHEETS[k]&&ASSET_SHEETS[k].url); for(const k in ASSET_FX)add(ASSET_FX[k]&&ASSET_FX[k].url); for(const k in ASSET_AUDIO)add(ASSET_AUDIO[k]);
  return [...set]; }
// Assets are fetched on demand and persisted by the service worker, never swept at startup.
function downloadAllAssets(done){ done(); }

/* ---- OPENING: hand off to the game beneath the kitchen loading animation ---- */
class Opening extends Phaser.Scene {
  constructor(){ super('Opening'); }
  create(){ downloadAllAssets(()=>this.scene.start('Game')); }
  _old(){
    this.scene.start('Game');   // v6.48: หน้าโหลดแรกค้างไว้ → Game.preloadAll โหลดทั้งเกมต่อในหลอดเดียว แล้วค่อยเล่นฉากเปิด
  }
}

