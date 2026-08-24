import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = process.argv[2];
const OUT = process.argv[3];
const CELL = parseInt(process.argv[4]||'128',10);   // ขนาดเฟรมปลายทาง
const COLS = parseInt(process.argv[5]||'2',10);
const ROWS = parseInt(process.argv[6]||'2',10);

const jpg = readFileSync(SRC);
const dataUrl = 'data:image/jpeg;base64,'+jpg.toString('base64');

const b = await chromium.launch();
const p = await b.newPage();
const pngB64 = await p.evaluate(async ({dataUrl, CELL, COLS, ROWS})=>{
  const img = new Image();
  await new Promise((res,rej)=>{ img.onload=res; img.onerror=rej; img.src=dataUrl; });
  const W=img.naturalWidth, H=img.naturalHeight;
  const qw=Math.floor(W/COLS), qh=Math.floor(H/ROWS);
  const TH=238;

  function processQuad(qx,qy){
    const cv=document.createElement('canvas'); cv.width=qw; cv.height=qh;
    const ctx=cv.getContext('2d'); ctx.drawImage(img, qx,qy,qw,qh, 0,0,qw,qh);
    const id=ctx.getImageData(0,0,qw,qh), d=id.data;
    const isWhite=(i)=>d[i]>=TH&&d[i+1]>=TH&&d[i+2]>=TH;
    const bg=new Uint8Array(qw*qh), st=[];
    for(let x=0;x<qw;x++){ st.push([x,0]); st.push([x,qh-1]); }
    for(let y=0;y<qh;y++){ st.push([0,y]); st.push([qw-1,y]); }
    while(st.length){ const [x,y]=st.pop(); if(x<0||y<0||x>=qw||y>=qh)continue;
      const pi=y*qw+x; if(bg[pi])continue; if(!isWhite(pi*4))continue;
      bg[pi]=1; st.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]); }
    for(let i=0;i<qw*qh;i++) if(bg[i]) d[i*4+3]=0;
    // halo erode 2 passes
    for(let pass=0;pass<2;pass++){ const rm=[];
      for(let y=0;y<qh;y++)for(let x=0;x<qw;x++){ const pi=y*qw+x; if(d[pi*4+3]===0)continue;
        const i=pi*4; if(d[i]<232||d[i+1]<232||d[i+2]<232)continue; let near=false;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=qw||ny>=qh)continue; if(d[(ny*qw+nx)*4+3]===0){near=true;break;} }
        if(near)rm.push(pi); }
      for(const pi of rm) d[pi*4+3]=0; }
    ctx.putImageData(id,0,0);
    // bbox
    let minx=qw,miny=qh,maxx=0,maxy=0,any=false;
    for(let y=0;y<qh;y++)for(let x=0;x<qw;x++){ if(d[(y*qw+x)*4+3]>16){ any=true;
      if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y; } }
    if(!any){ minx=miny=0; maxx=qw-1; maxy=qh-1; }
    return { canvas:cv, bbox:{minx,miny,maxx,maxy,w:maxx-minx+1,h:maxy-miny+1,cx:(minx+maxx)/2,cy:(miny+maxy)/2} };
  }

  const quads=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) quads.push(processQuad(c*qw, r*qh));

  // สเกลร่วม: ให้เฟรมสูงสุด/กว้างสุดพอดีเซลล์ (คงสัดส่วนต่างของแต่ละท่า)
  let maxH=0,maxW=0; for(const q of quads){ maxH=Math.max(maxH,q.bbox.h); maxW=Math.max(maxW,q.bbox.w); }
  const scale=Math.min((CELL-10)/maxH, (CELL-6)/maxW);

  const strip=document.createElement('canvas'); strip.width=CELL*quads.length; strip.height=CELL;
  const sc=strip.getContext('2d'); sc.imageSmoothingEnabled=true; sc.imageSmoothingQuality='high';
  quads.forEach((q,i)=>{ const bb=q.bbox;
    const dw=bb.w*scale, dh=bb.h*scale;
    const dx=i*CELL + CELL/2 - dw/2, dy=CELL/2 - dh/2;   // จัดกึ่งกลางตาม bbox center
    sc.drawImage(q.canvas, bb.minx,bb.miny,bb.w,bb.h, dx,dy,dw,dh);
  });
  return strip.toDataURL('image/png').split(',')[1];
}, {dataUrl, CELL, COLS, ROWS});
await b.close();
writeFileSync(OUT, Buffer.from(pngB64,'base64'));
console.log('wrote strip', OUT, CELL+'x'+CELL, 'x', COLS*ROWS, 'frames');
