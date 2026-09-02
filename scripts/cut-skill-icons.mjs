#!/usr/bin/env node
// หั่นแผ่นไอคอน (JPEG พื้น checkerboard/แถบขาว) → ic_*.png พื้นโปร่งใส
// ใช้: node scripts/cut-skill-icons.mjs <SRC> <COLS> <ROWS> <key0,key1,...> [MARGIN]
//   keys เรียง row-major · "_" = ข้ามช่องนั้น · ออกเป็น assets/ic_<key>.png
// วิธี: flood-fill จากขอบเซลล์ ลบพื้นเทา+ขาว (ไอคอนมีเส้นขอบ/สีเข้มปิดล้อม กันลาม)
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const SRC  = process.argv[2];
const COLS = parseInt(process.argv[3],10);
const ROWS = parseInt(process.argv[4],10);
const KEYS = (process.argv[5]||'').split(',');
const MARGIN = process.argv[6]?parseFloat(process.argv[6]):0.86;
const OUT = 128;
if(!SRC||!COLS||!ROWS||!KEYS.length){ console.error('usage: SRC COLS ROWS key0,key1,... [MARGIN]'); process.exit(1); }

// พื้น = เทา/ขาว (r≈g≈b) สว่างช่วงกลาง-ขาว (แถบคั่นขาวก็ลบด้วย · ไอคอนสีจัด/มีขอบเข้มรอด)
function isBg(r,g,b){
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
  const sat=mx-mn, bri=(r+g+b)/3;
  return sat<44 && bri>=105 && bri<=250;
}

async function main(){
  const img = await loadImage(SRC);
  const W=img.width, H=img.height, cw=Math.floor(W/COLS), ch=Math.floor(H/ROWS);
  console.log(`src ${W}x${H} · cell ${cw}x${ch} · margin ${MARGIN}`);
  const prev=createCanvas(OUT*COLS,OUT*ROWS); const pc=prev.getContext('2d');

  KEYS.forEach((key,idx)=>{
    if(!key||key==='_') return;
    const cx=(idx%COLS)*cw, cy=Math.floor(idx/COLS)*ch;
    const cell=createCanvas(cw,ch); const cc=cell.getContext('2d');
    cc.drawImage(img,cx,cy,cw,ch,0,0,cw,ch);
    const d=cc.getImageData(0,0,cw,ch); const px=d.data;
    const N=cw*ch; const bg=new Uint8Array(N); const st=[];
    const push=(x,y)=>{ if(x<0||y<0||x>=cw||y>=ch)return; const i=y*cw+x; if(bg[i])return;
      const p=i*4; if(!isBg(px[p],px[p+1],px[p+2]))return; bg[i]=1; st.push(i); };
    for(let x=0;x<cw;x++){ push(x,0); push(x,ch-1); }
    for(let y=0;y<ch;y++){ push(0,y); push(cw-1,y); }
    while(st.length){ const i=st.pop(); const x=i%cw,y=(i/cw)|0; push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1); }
    let minX=cw,minY=ch,maxX=0,maxY=0,found=false;
    for(let i=0;i<N;i++){
      if(bg[i]) px[i*4+3]=0;
      else { const x=i%cw,y=(i/cw)|0; if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;found=true; }
    }
    cc.putImageData(d,0,0);
    if(!found){ console.log('⚠️  '+key+': ไม่พบไอคอน'); return; }
    const bw=maxX-minX+1, bh=maxY-minY+1;
    const out=createCanvas(OUT,OUT); const oc=out.getContext('2d');
    oc.imageSmoothingEnabled=true; oc.imageSmoothingQuality='high';
    const scale=(OUT*MARGIN)/Math.max(bw,bh), dw=bw*scale, dh=bh*scale;
    oc.drawImage(cell, minX,minY,bw,bh, (OUT-dw)/2,(OUT-dh)/2, dw,dh);
    fs.writeFileSync(`assets/ic_${key}.png`, out.toBuffer('image/png'));
    console.log(`✓ ic_${key}.png  bbox ${bw}x${bh}`);
    pc.drawImage(out,(idx%COLS)*OUT,Math.floor(idx/COLS)*OUT);
  });
  fs.writeFileSync('scripts/_icons_preview.png', prev.toBuffer('image/png'));
  console.log('📋 preview → scripts/_icons_preview.png');
}
main().catch(e=>{console.error(e);process.exit(1);});
