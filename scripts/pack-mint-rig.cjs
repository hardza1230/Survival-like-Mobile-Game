// Pack generated cutout parts; isolate each connected silhouette and retain RGBA.
let canvas;try{canvas=require('canvas');}catch(e){canvas=require('@napi-rs/canvas');}
const {createCanvas,loadImage}=canvas,fs=require('node:fs');
(async()=>{
 const im=await loadImage('assets/incoming/mint_rig/mint_rig_parts_source.png'),out=createCanvas(512,512),oc=out.getContext('2d'),meta=[];
 for(let i=0;i<16;i++){
  let x=Math.round(i%4*im.width/4)+7,y=Math.round(Math.floor(i/4)*im.height/4)+7,w=Math.round(im.width/4)-14,h=Math.round(im.height/4)-14;
  // The lance crosses its source cell; use its own narrow horizontal band.
  if(i===13){x=318;y=1028;w=410;h=116;}
  const c=createCanvas(w,h),cx=c.getContext('2d');cx.drawImage(im,x,y,w,h,0,0,w,h);
  const pixels=cx.getImageData(0,0,w,h),a=pixels.data,seen=new Uint8Array(w*h);let largest=[];
  for(let k=0;k<w*h;k++){if(seen[k]||a[k*4+3]<32)continue;const q=[k];seen[k]=1;for(let p=0;p<q.length;p++){const n=q[p],xx=n%w,yy=Math.floor(n/w);for(const m of [xx>0?n-1:-1,xx<w-1?n+1:-1,yy>0?n-w:-1,yy<h-1?n+w:-1])if(m>=0&&!seen[m]&&a[m*4+3]>=32){seen[m]=1;q.push(m);}}if(q.length>largest.length)largest=q;}
  const keep=new Uint8Array(w*h);let minx=w,miny=h,maxx=0,maxy=0;
  for(const k of largest){const xx=k%w,yy=Math.floor(k/w);minx=Math.min(minx,xx);miny=Math.min(miny,yy);maxx=Math.max(maxx,xx);maxy=Math.max(maxy,yy);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx2=xx+dx,yy2=yy+dy;if(xx2>=0&&xx2<w&&yy2>=0&&yy2<h)keep[yy2*w+xx2]=1;}}
  for(let k=0;k<w*h;k++)if(!keep[k])a[k*4+3]=0;cx.putImageData(pixels,0,0);
  minx=Math.max(0,minx-2);miny=Math.max(0,miny-2);maxx=Math.min(w-1,maxx+2);maxy=Math.min(h-1,maxy+2);
  const bw=maxx-minx+1,bh=maxy-miny+1,scale=116/Math.max(bw,bh),dw=Math.round(bw*scale),dh=Math.round(bh*scale),px=i%4*128+Math.floor((128-dw)/2),py=Math.floor(i/4)*128+Math.floor((128-dh)/2);
  oc.drawImage(c,minx,miny,bw,bh,px,py,dw,dh);meta.push({x:px,y:py,w:dw,h:dh});
 }
 fs.writeFileSync('assets/characters/mint_rig_parts.png',out.toBuffer('image/png'));
 fs.writeFileSync('assets/incoming/mint_rig/frames.json',JSON.stringify(meta,null,2)+'\n');
 console.log('Mint: packed 16 transparent parts in 512px atlas');
 if(fs.existsSync('assets/incoming/mint_rig/mint_neutral_limbs_source.png'))await require('./pack-mint-rig-limbs.cjs')();
})();
