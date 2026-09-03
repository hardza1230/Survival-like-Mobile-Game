#!/usr/bin/env node
/* Cut an AI-generated VFX grid sheet into individual transparent PNGs.
 * Handles Gemini "fake transparent" checkerboard: removes neutral-gray
 * background (checker + baked glow) via per-cell flood-fill from borders,
 * then trims + centers each effect into its own square PNG.
 *
 * Usage: NODE_PATH=./node_modules node scripts/cutout_vfx_grid.cjs \
 *          <src.png> <cols> <rows> <outdir> [threshold=40] [name1,name2,...]
 *
 * threshold = max chroma (max-min RGB) treated as background gray. Raise it
 * to eat colored-tinted glow halos (good for solid effects); lower it to
 * preserve pale/pastel effects (sparkles) that have low chroma.
 * Tip: for best results, ask the model for a SOLID BLACK background instead
 * of "transparent" — glowing VFX on black need no keying and blend with ADD.
 */
const {loadImage,createCanvas}=require('canvas'); const fs=require('fs');
const chroma=(r,g,b)=>Math.max(r,g,b)-Math.min(r,g,b);
(async()=>{
  const [src,COLS,ROWS,outdir]=process.argv.slice(2);
  const TH=+(process.argv[6]||40);
  const names=(process.argv[7]||'').split(',').filter(Boolean);
  const cols=+COLS,rows=+ROWS;
  const img=await loadImage(src); const W=img.width,H=img.height;
  const cv=createCanvas(W,H),x=cv.getContext('2d'); x.drawImage(img,0,0);
  fs.mkdirSync(outdir,{recursive:true}); const out=[];
  for(let ry=0;ry<rows;ry++)for(let cxi=0;cxi<cols;cxi++){
    const x0=Math.round(cxi*W/cols),x1=Math.round((cxi+1)*W/cols),y0=Math.round(ry*H/rows),y1=Math.round((ry+1)*H/rows);
    const cw=x1-x0,ch=y1-y0; const cell=x.getImageData(x0,y0,cw,ch); const d=cell.data;
    const bg=new Uint8Array(cw*ch),st=[];
    const neu=p=>chroma(d[p*4],d[p*4+1],d[p*4+2])<=TH;
    const push=(px,py)=>{if(px<0||py<0||px>=cw||py>=ch)return;const p=py*cw+px;if(bg[p])return;if(neu(p)){bg[p]=1;st.push(p);}};
    for(let px=0;px<cw;px++){push(px,0);push(px,ch-1);} for(let py=0;py<ch;py++){push(0,py);push(cw-1,py);}
    while(st.length){const p=st.pop();const px=p%cw,py=(p-px)/cw;push(px-1,py);push(px+1,py);push(px,py-1);push(px,py+1);}
    for(let p=0;p<cw*ch;p++) if(bg[p]) d[p*4+3]=0;
    for(let py=0;py<ch;py++)for(let px=0;px<cw;px++){const p=py*cw+px,i=p*4;if(bg[p]||d[i+3]===0)continue;
      if(chroma(d[i],d[i+1],d[i+2])<=TH+15){let tn=0;for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]]){const nx=px+dx,ny=py+dy;if(nx<0||ny<0||nx>=cw||ny>=ch)continue;if(bg[ny*cw+nx])tn++;}if(tn)d[i+3]=Math.min(d[i+3],130);}}
    let mnx=cw,mny=ch,mxx=0,mxy=0,any=false;
    for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++){if(d[(yy*cw+xx)*4+3]>40){any=true;if(xx<mnx)mnx=xx;if(xx>mxx)mxx=xx;if(yy<mny)mny=yy;if(yy>mxy)mxy=yy;}}
    const nm=names[ry*cols+cxi]||`cell_${ry}_${cxi}`;
    if(!any){out.push(nm+':empty');continue;}
    const pad=8;mnx=Math.max(0,mnx-pad);mny=Math.max(0,mny-pad);mxx=Math.min(cw-1,mxx+pad);mxy=Math.min(ch-1,mxy+pad);
    const bw=mxx-mnx+1,bh=mxy-mny+1,side=Math.max(bw,bh);
    const tc=createCanvas(cw,ch),tx=tc.getContext('2d');tx.putImageData(cell,0,0);
    const oc=createCanvas(side,side),ox=oc.getContext('2d');
    ox.drawImage(tc,mnx,mny,bw,bh,Math.round((side-bw)/2),Math.round((side-bh)/2),bw,bh);
    fs.writeFileSync(`${outdir}/${nm}.png`,oc.toBuffer('image/png')); out.push(nm+':'+side);
  }
  console.log(out.join('  '));
})();
