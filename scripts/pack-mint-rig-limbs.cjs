// Replace only eight articulated limb skins; preserve Mint's head/body/hair/lance.
let canvas;try{canvas=require('canvas');}catch(e){canvas=require('@napi-rs/canvas');}
const {createCanvas,loadImage}=canvas,fs=require('node:fs');
async function pack(){
 const source='assets/incoming/mint_rig/mint_neutral_limbs_source.png',im=await loadImage(source),base=await loadImage('assets/characters/mint_rig_parts.png'),out=createCanvas(512,512),oc=out.getContext('2d');oc.drawImage(base,0,0);
 const meta=JSON.parse(fs.readFileSync('assets/incoming/mint_rig/frames.json','utf8')),slots=[5,6,7,8,9,10,11,12];
 for(let i=0;i<8;i++){
  const x=Math.round(i%4*im.width/4)+6,y=Math.round(Math.floor(i/4)*im.height/2)+6,w=Math.round(im.width/4)-12,h=Math.round(im.height/2)-12,c=createCanvas(w,h),cx=c.getContext('2d');cx.drawImage(im,x,y,w,h,0,0,w,h);
  const pixels=cx.getImageData(0,0,w,h),data=pixels.data,seen=new Uint8Array(w*h);let main=[];
  for(let k=0;k<w*h;k++){if(seen[k]||data[k*4+3]<32)continue;const q=[k];seen[k]=1;for(let n=0;n<q.length;n++){const v=q[n],xx=v%w,yy=Math.floor(v/w);for(const m of [xx>0?v-1:-1,xx<w-1?v+1:-1,yy>0?v-w:-1,yy<h-1?v+w:-1])if(m>=0&&!seen[m]&&data[m*4+3]>=32){seen[m]=1;q.push(m);}}if(q.length>main.length)main=q;}
  if(main.length<200)throw Error('Missing limb '+i);
  const keep=new Uint8Array(w*h);let minx=w,miny=h,maxx=0,maxy=0;
  for(const k of main){const xx=k%w,yy=Math.floor(k/w);minx=Math.min(minx,xx);miny=Math.min(miny,yy);maxx=Math.max(maxx,xx);maxy=Math.max(maxy,yy);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const a=xx+dx,b=yy+dy;if(a>=0&&a<w&&b>=0&&b<h)keep[b*w+a]=1;}}
  for(let k=0;k<w*h;k++)if(!keep[k])data[k*4+3]=0;cx.putImageData(pixels,0,0);
  minx=Math.max(0,minx-2);miny=Math.max(0,miny-2);maxx=Math.min(w-1,maxx+2);maxy=Math.min(h-1,maxy+2);
  const bw=maxx-minx+1,bh=maxy-miny+1,scale=116/Math.max(bw,bh),dw=Math.round(bw*scale),dh=Math.round(bh*scale),slot=slots[i],sx=slot%4*128,sy=Math.floor(slot/4)*128,px=sx+Math.floor((128-dw)/2),py=sy+Math.floor((128-dh)/2);
  oc.clearRect(sx,sy,128,128);oc.drawImage(c,minx,miny,bw,bh,px,py,dw,dh);meta[slot]={x:px,y:py,w:dw,h:dh};
 }
 fs.writeFileSync('assets/characters/mint_rig_parts.png',out.toBuffer('image/png'));fs.writeFileSync('assets/incoming/mint_rig/frames.json',JSON.stringify(meta,null,2)+'\n');
 let game=fs.readFileSync('game.js','utf8');game=game.replace(/const MINT_RIG_FRAMES = [^\n]+;/,'const MINT_RIG_FRAMES = '+JSON.stringify(meta)+';');fs.writeFileSync('game.js',game);
 console.log('Replaced eight neutral limb skins and refreshed runtime frame bounds');
}
module.exports=pack;if(require.main===module)pack().catch(e=>{console.error(e);process.exitCode=1;});
