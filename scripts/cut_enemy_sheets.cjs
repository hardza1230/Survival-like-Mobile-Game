const{createCanvas,loadImage}=require('canvas');
const fs=require('fs');
(async()=>{
 const src=await loadImage('assets/raw/enemies_dasher_siege_sheet.png');
 const W=src.width,H=src.height,cs=createCanvas(W,H),cx=cs.getContext('2d');
 cx.drawImage(src,0,0); const D=cx.getImageData(0,0,W,H).data;
 // tight bbox of a region (alpha>threshold) within a search box
 function bbox(bx,by,bw,bh,a=60){let minx=1e9,maxx=-1,miny=1e9,maxy=-1;
   for(let y=by;y<by+bh;y++)for(let x=bx;x<bx+bw;x++){const al=D[(y*W+x)*4+3];if(al>a){if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;}}
   return{x:minx,y:miny,w:maxx-minx+1,h:maxy-miny+1};}
 function build(frames, cell, out){
   // measure tight bbox of each frame
   const bxs=frames.map(f=>bbox(f[0],f[1],f[2],f[3]));
   const maxW=Math.max(...bxs.map(b=>b.w)), maxH=Math.max(...bxs.map(b=>b.h));
   const pad=0.90; // leave a little margin
   const scale=Math.min(cell*pad/maxW, cell*pad/maxH);
   const oc=createCanvas(cell*frames.length,cell),o=oc.getContext('2d');
   o.imageSmoothingEnabled=true; o.imageSmoothingQuality='high';
   bxs.forEach((b,i)=>{
     const dw=b.w*scale, dh=b.h*scale;
     const dx=i*cell+(cell-dw)/2;         // center-x
     const dy=cell-dh-(cell*(1-pad)/2);   // bottom-align w/ small margin
     o.drawImage(cs, b.x,b.y,b.w,b.h, dx,dy,dw,dh);
   });
   fs.writeFileSync(out,oc.toBuffer());
   console.log(out, oc.width+'x'+oc.height, 'frameScale',scale.toFixed(3),'maxbbox',maxW+'x'+maxH);
 }
 // dasher walk: 4 side-view ants (row 1)
 build([[12,26,180,145],[211,26,176,144],[407,26,176,145],[605,26,178,145]], 88, 'assets/e_dasher_sheet.png');
 // siege: cupcake cannon 4 frames (row 3)
 build([[0,430,137,193],[153,431,130,192],[296,431,136,192],[447,422,165,201]], 110, 'assets/e_siege_sheet.png');
})();
