import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = process.argv[2];
const OUT = process.argv[3];
const OUTSIZE = parseInt(process.argv[4]||'120',10);

const jpg = readFileSync(SRC);
const dataUrl = 'data:image/jpeg;base64,'+jpg.toString('base64');

const b = await chromium.launch();
const p = await b.newPage();
const pngB64 = await p.evaluate(async ({dataUrl, OUTSIZE})=>{
  const img = new Image();
  await new Promise((res,rej)=>{ img.onload=res; img.onerror=rej; img.src=dataUrl; });
  const W=img.naturalWidth, H=img.naturalHeight;
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const ctx=cv.getContext('2d'); ctx.drawImage(img,0,0);
  const id=ctx.getImageData(0,0,W,H); const d=id.data;
  const idx=(x,y)=>(y*W+x)*4;
  // "พื้นหลัง" = สว่าง + เกือบไม่มีสี (ขาว/เทาอ่อน=เงา) แต่ไม่กินขอบตัวที่มีสี
  const isBg=(i)=>{ const r=d[i],g=d[i+1],b=d[i+2];
    const mn=Math.min(r,g,b), mx=Math.max(r,g,b); return mn>=198 && (mx-mn)<=26; };
  // BFS flood-fill from all border pixels through background → mark background
  const bg=new Uint8Array(W*H);
  const stack=[];
  for(let x=0;x<W;x++){ stack.push([x,0]); stack.push([x,H-1]); }
  for(let y=0;y<H;y++){ stack.push([0,y]); stack.push([W-1,y]); }
  while(stack.length){ const [x,y]=stack.pop();
    if(x<0||y<0||x>=W||y>=H) continue;
    const pi=y*W+x; if(bg[pi]) continue;
    if(!isBg(idx(x,y))) continue;
    bg[pi]=1;
    stack.push([x+1,y]); stack.push([x-1,y]); stack.push([x,y+1]); stack.push([x,y-1]);
  }
  // set background alpha 0
  for(let i=0;i<W*H;i++){ if(bg[i]) d[i*4+3]=0; }
  // halo cleanup: light-ish pixels adjacent to transparent, 2 passes (erode white fringe)
  for(let pass=0;pass<2;pass++){
    const rm=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const pi=y*W+x; if(d[pi*4+3]===0) continue;
      const i=pi*4; if(d[i]<232||d[i+1]<232||d[i+2]<232) continue; // only very light fringe
      let near=false;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy;
        if(nx<0||ny<0||nx>=W||ny>=H) continue; if(d[(ny*W+nx)*4+3]===0){near=true;break;} }
      if(near) rm.push(pi);
    }
    for(const pi of rm) d[pi*4+3]=0;
  }
  ctx.putImageData(id,0,0);
  // downscale to OUTSIZE with smoothing
  const o=document.createElement('canvas'); o.width=OUTSIZE; o.height=OUTSIZE;
  const octx=o.getContext('2d'); octx.imageSmoothingEnabled=true; octx.imageSmoothingQuality='high';
  octx.drawImage(cv,0,0,OUTSIZE,OUTSIZE);
  return o.toDataURL('image/png').split(',')[1];
}, {dataUrl, OUTSIZE});
await b.close();
writeFileSync(OUT, Buffer.from(pngB64,'base64'));
console.log('wrote', OUT, 'size', OUTSIZE);
