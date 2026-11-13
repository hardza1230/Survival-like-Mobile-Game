// v8.1.139: shipped assets are recompressed in place (scripts/compress-assets.py). assets/RECOMPRESSED.json keeps each file's original
// delivery sha256/bytes + the exact packed sha256. Delivery tests compare against the ORIGINAL values: a file passes only if it is the
// original, or byte-exactly the recorded recompression of it.
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const L=JSON.parse(fs.readFileSync(path.join(__dirname,'..','assets','RECOMPRESSED.json'),'utf8')).files;
const norm=p=>String(p).replace(/\\/g,'/').replace(/^.*?(assets\/)/,'assets/');
function info(p,bytes){ const b=bytes||fs.readFileSync(p),h=crypto.createHash('sha256').update(b).digest('hex'),e=L[norm(p)];
  if(e&&h===e.packed_sha256)return {sha256:e.sha256,bytes:e.bytes,packed:true}; return {sha256:h,bytes:b.length,packed:false}; }
// same(runtimePath, sourceBytes): the shipped file is the delivered source, or its recorded recompression
function same(p,src){ const b=fs.readFileSync(p); if(b.equals(src))return true; const i=info(p,b); return i.packed&&i.sha256===crypto.createHash('sha256').update(src).digest('hex'); }
module.exports={sha:(p,b)=>info(p,b).sha256,bytes:(p,b)=>info(p,b).bytes,info,same};
// Hash-indexed lookups (no path needed): h(buf) = original delivery sha256 if buf is a recorded recompression, else its own sha256.
const BY=new Map(Object.values(L).map(e=>[e.packed_sha256,e]));
const own=b=>crypto.createHash('sha256').update(b).digest('hex');
module.exports.h=b=>{ const x=own(b),e=BY.get(x); return e?e.sha256:x; };
module.exports.n=b=>{ const e=BY.get(own(b)); return e?e.bytes:b.length; };
module.exports.eq=(a,b)=>{ if(Buffer.compare(a,b)===0)return true; const ea=BY.get(own(a)),eb=BY.get(own(b)); return (ea?ea.sha256:own(a))===(eb?eb.sha256:own(b)); };
// webp(buf) → {w,h} for any WebP kind (VP8 lossy, VP8L lossless, VP8X extended)
module.exports.webp=b=>{ const t=b.toString('ascii',12,16);
  if(t==='VP8L'){ const v=b.readUInt32LE(21); return {w:(v&0x3fff)+1,h:((v>>>14)&0x3fff)+1,kind:t}; }
  if(t==='VP8X')return {w:1+b.readUIntLE(24,3),h:1+b.readUIntLE(27,3),kind:t};
  if(t==='VP8 ')return {w:b.readUInt16LE(26)&0x3fff,h:b.readUInt16LE(28)&0x3fff,kind:t};
  throw new Error('not webp'); };
// vp8l(buf): the VP8L header word (w-1 | (h-1)<<14 | alpha<<28) rebuilt for any WebP kind, so lossless-era header checks keep testing size+alpha.
module.exports.vp8l=b=>{ const d=module.exports.webp(b),t=d.kind,alpha=t==='VP8L'?((b.readUInt32LE(21)>>>28)&1):t==='VP8X'?((b[20]&0x10)?1:0):0;
  return (((d.w-1)&0x3fff)|(((d.h-1)&0x3fff)<<14)|(alpha<<28))>>>0; };
