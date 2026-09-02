#!/usr/bin/env node
// หั่นแผ่นไอคอนสกิล 4x3 (JPEG พื้น checkerboard) → ic_*.png พื้นโปร่งใส
// วิธี: flood-fill จากขอบเซลล์ ลบเฉพาะพื้นหมากรุก (ไอคอนมีเส้นขอบเข้มปิดล้อม กันลาม)
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const SRC = process.argv[2] || '/root/.claude/uploads/c7ce3795-efce-54f7-bfe1-b4f7ff3969c9/ae385ceb-image.jpg';
const OUT = 128;            // ขนาดไฟล์ออก (2x retina ของไอคอน 64px)
const MARGIN = 0.90;        // ไอคอนกินพื้นที่ ~90% เว้นขอบนุ่ม
const COLS = 4, ROWS = 3;
// ลำดับตรงกับกริด (row-major) ที่สั่ง gen
const KEYS = [
  'thunder','whirl','boomer','popcorn',
  'aura','fork','mine','beam',
  'meteor','cloud','rocket','wave',
];

// พื้นหมากรุก = เทา (r≈g≈b) ความสว่างช่วงกลาง
function isBg(r,g,b){
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
  const sat=mx-mn, bri=(r+g+b)/3;
  return sat<42 && bri>=105 && bri<=242;
}

async function main(){
  const img = await loadImage(SRC);
  const W=img.width, H=img.height;
  const cw=Math.floor(W/COLS), ch=Math.floor(H/ROWS);
  const full=createCanvas(W,H); const fc=full.getContext('2d');
  fc.drawImage(img,0,0);
  const src=fc.getImageData(0,0,W,H);

  // preview contact sheet
  const prev=createCanvas(OUT*COLS,OUT*ROWS); const pc=prev.getContext('2d');

  KEYS.forEach((key,idx)=>{
    const cx=(idx%COLS)*cw, cy=Math.floor(idx/COLS)*ch;
    // ---- คัดเซลล์ออกมา + สร้าง alpha ----
    const cell=createCanvas(cw,ch); const cc=cell.getContext('2d');
    cc.drawImage(img,cx,cy,cw,ch,0,0,cw,ch);
    const d=cc.getImageData(0,0,cw,ch); const px=d.data;
    const N=cw*ch; const bg=new Uint8Array(N); // 1=พื้น
    // flood-fill จากทุกพิกเซลขอบ
    const st=[];
    const push=(x,y)=>{ if(x<0||y<0||x>=cw||y>=ch)return; const i=y*cw+x; if(bg[i])return;
      const p=i*4; if(!isBg(px[p],px[p+1],px[p+2]))return; bg[i]=1; st.push(i); };
    for(let x=0;x<cw;x++){ push(x,0); push(x,ch-1); }
    for(let y=0;y<ch;y++){ push(0,y); push(cw-1,y); }
    while(st.length){ const i=st.pop(); const x=i%cw, y=(i/cw)|0; push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1); }
    // ทำพื้นโปร่งใส + หา bounding box ของไอคอน
    let minX=cw,minY=ch,maxX=0,maxY=0,found=false;
    for(let i=0;i<N;i++){
      if(bg[i]){ px[i*4+3]=0; }
      else {
        const x=i%cw, y=(i/cw)|0;
        if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; found=true;
      }
    }
    // ลด fringe หมากรุก: พิกเซลเทาจาง ๆ ที่ติดขอบโปร่งใส → หรี่ alpha
    cc.putImageData(d,0,0);
    if(!found){ console.log('⚠️  '+key+': ไม่พบไอคอน'); return; }
    const bw=maxX-minX+1, bh=maxY-minY+1;

    // ---- วางกึ่งกลางบนผืนสี่เหลี่ยมจัตุรัสโปร่งใส ----
    const out=createCanvas(OUT,OUT); const oc=out.getContext('2d');
    oc.imageSmoothingEnabled=true; oc.imageSmoothingQuality='high';
    const scale=(OUT*MARGIN)/Math.max(bw,bh);
    const dw=bw*scale, dh=bh*scale;
    oc.drawImage(cell, minX,minY,bw,bh, (OUT-dw)/2,(OUT-dh)/2, dw,dh);

    const buf=out.toBuffer('image/png');
    fs.writeFileSync(`assets/ic_${key}.png`, buf);
    console.log(`✓ ic_${key}.png  (${(buf.length/1024).toFixed(1)}KB)  bbox ${bw}x${bh}`);
    pc.drawImage(out,(idx%COLS)*OUT,Math.floor(idx/COLS)*OUT);
  });

  fs.writeFileSync('scripts/_icons_preview.png', prev.toBuffer('image/png'));
  console.log('\n📋 preview → scripts/_icons_preview.png');
}
main().catch(e=>{console.error(e);process.exit(1);});
