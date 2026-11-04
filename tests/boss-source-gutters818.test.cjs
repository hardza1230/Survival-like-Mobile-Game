// Decode actual original RGBA sources independently: output padding cannot hide a bad source cut.
const fs=require('node:fs'),assert=require('node:assert/strict'),zlib=require('node:zlib'),crypto=require('node:crypto');
const manifest=JSON.parse(fs.readFileSync('assets/incoming/boss_body818/MANIFEST.json')),
 qa=JSON.parse(fs.readFileSync('assets/incoming/boss_body818/QA_REPORT.json'));
function decode(path){const png=fs.readFileSync(path),parts=[];assert.equal(png[24],8);assert.equal(png[25],6);assert.equal(png[28],0);let p=8;while(p<png.length){const n=png.readUInt32BE(p),tag=png.toString('ascii',p+4,p+8);if(tag==='IDAT')parts.push(png.subarray(p+8,p+8+n));p+=n+12;}const w=png.readUInt32BE(16),h=png.readUInt32BE(20),stride=w*4,raw=zlib.inflateSync(Buffer.concat(parts)),out=Buffer.alloc(stride*h);let at=0;const paeth=(a,b,c)=>{const q=a+b-c,x=Math.abs(q-a),y=Math.abs(q-b),z=Math.abs(q-c);return x<=y&&x<=z?a:y<=z?b:c;};for(let y=0;y<h;y++){const f=raw[at++];assert(f<=4);for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=4?out[i-4]:0,b=y?out[i-stride]:0,c=y&&x>=4?out[i-stride-4]:0;out[i]=(raw[at++]+(f===1?a:f===2?b:f===3?Math.floor((a+b)/2):f===4?paeth(a,b,c):0))&255;}}assert.equal(at,raw.length);return{w,h,alpha:(x,y)=>out[(y*w+x)*4+3]};}
let recovered=0,excluded=0,badOldCuts=0,checked=0;
assert.equal(qa.sourcePartitions.length,16);assert.equal(qa.authoredFrames,372);assert.equal(manifest.assets.length,30);
for(const group of qa.sourcePartitions){const im=decode(group.path);assert.equal(im.w,1536);assert.equal(im.h,1024);assert.equal(group.cells.length,24);const rects=group.cells,selectedRows=new Set(manifest.assets.filter(a=>a.source===group.group).flatMap(a=>a.sourceRows));
 for(const c of rects){const[x0,y0,x1,y1]=c.rect;let n=0,overlap=0,old=0;assert(x0<x1&&y0<y1);assert.equal(c.row*6+c.col,checked%24);
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const a=im.alpha(x,y);if(x<x0+2||x>=x1-2||y<y0+2||y>=y1-2)assert(a<16,group.group+' source cut crosses painted body '+c.row+','+c.col);if(a>=16){n++;if(x>=c.col*256&&x<(c.col+1)*256&&y>=c.row*256&&y<(c.row+1)*256)overlap++;}}
  for(let y=c.row*256;y<(c.row+1)*256;y++)for(let x=c.col*256;x<(c.col+1)*256;x++){if(im.alpha(x,y)>=16){old++;if(x%256===0||x%256===255||y%256===0||y%256===255)badOldCuts++;}}
  assert.equal(n,c.sourcePixels);assert.equal(n-overlap,c.recoveredPixels);assert.equal(old-overlap,c.excludedNeighborPixels);if(selectedRows.has(c.row)){recovered+=n-overlap;excluded+=old-overlap;}checked++;
 }
 // Verify the partition is complete and exclusive, independently of the packer's counts.
 for(let row=0;row<4;row++){const cs=rects.slice(row*6,row*6+6);assert.equal(cs[0].rect[0],0);assert.equal(cs[5].rect[2],1536);for(let col=1;col<6;col++)assert.equal(cs[col-1].rect[2],cs[col].rect[0]);if(row)assert.equal(rects[(row-1)*6].rect[3],cs[0].rect[1]);}
 assert.equal(rects[0].rect[1],0);assert.equal(rects[18].rect[3],1024);
}
assert(recovered>=717,'recover parts lost at old rigid cuts');assert(excluded>=717,'remove neighboring parts assigned to old cells');assert(badOldCuts>0,'fixture genuinely includes source-grid errors');assert.equal(recovered,qa.recoveredPixels);assert.equal(excluded,qa.excludedNeighborPixels);assert.equal(checked,384);
for(const key of ['mb1','mb2','mb3','mb4']){const a=manifest.assets.find(a=>a.base===key);assert(a);assert.equal(a.frames,12);assert(a.oldFrame<256);}
assert(!manifest.assets.some(a=>a.base==='mb10_ancient_root_knight'),'completed sixteen-frame Root Knight stays intact');
for(const a of manifest.assets){assert.equal(qa.frames.filter(f=>f.key===a.key).length,a.frames);const b=fs.readFileSync(a.path);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256);}
console.log('Boss818:384 source cells decoded; transparent SOURCE seams precede packing; actual old-cut losses/neighbor scraps recovered, complete exclusive source coverage, four static minis replaced, full16-frame Root Knight preserved');
