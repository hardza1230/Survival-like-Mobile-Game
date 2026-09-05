const{createCanvas,loadImage}=require('canvas');const fs=require('fs');
(async()=>{
 const src=await loadImage('assets/raw/boss_5_bitter_chef_sheet.png');
 const W=src.width,H=src.height,cs=createCanvas(W,H),cx=cs.getContext('2d');
 cx.drawImage(src,0,0); const D=cx.getImageData(0,0,W,H).data;
 function bbox(bx,by,bw,bh,a=60){let mnx=1e9,mxx=-1,mny=1e9,mxy=-1;
   for(let y=by;y<by+bh;y++)for(let x=bx;x<bx+bw;x++){if(D[(y*W+x)*4+3]>a){if(x<mnx)mnx=x;if(x>mxx)mxx=x;if(y<mny)mny=y;if(y>mxy)mxy=y;}}
   return{x:mnx,y:mny,w:mxx-mnx+1,h:mxy-mny+1};}
 // IDLE / HOVER / ACTIVE (top row)
 const frames=[[501,34,146,181],[667,32,149,183],[831,26,156,189]].map(f=>bbox(f[0],f[1],f[2],f[3]));
 const cell=160, pad=0.96;
 const maxW=Math.max(...frames.map(b=>b.w)), maxH=Math.max(...frames.map(b=>b.h));
 const scale=Math.min(cell*pad/maxW, cell*pad/maxH);
 const oc=createCanvas(cell*frames.length,cell),o=oc.getContext('2d');
 o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';
 frames.forEach((b,i)=>{const dw=b.w*scale,dh=b.h*scale;const dx=i*cell+(cell-dw)/2;const dy=cell-dh-(cell*(1-pad)/2);
   o.drawImage(cs,b.x,b.y,b.w,b.h,dx,dy,dw,dh);});
 fs.writeFileSync('assets/boss5_sheet.png',oc.toBuffer());
 console.log('boss5_sheet.png',oc.width+'x'+oc.height,'scale',scale.toFixed(3));
})();
