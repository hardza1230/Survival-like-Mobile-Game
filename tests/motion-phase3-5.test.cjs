// v8.2.74: animation phases 3 (heroes 40) + 5A/5B (boss VFX 22+35) — whole-sheet 8/12-frame upgrades, same play time.
const fs=require('fs'),assert=require('assert'),crypto=require('crypto');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const M=JSON.parse(fs.readFileSync(__dirname+'/../scripts/motion-phase3-5.json','utf8'));let rows=0;
for(const [old,v] of Object.entries(M)){
  const b=fs.readFileSync(__dirname+'/../'+v.url);assert.equal(b.toString('latin1',0,4),'RIFF',v.url);assert.equal(b.toString('latin1',8,12),'WEBP',v.url);
  assert(!src.includes("url:'"+old+"'"),'old sheet still registered: '+old);
  const re=new RegExp("\\n\\s*([A-Za-z0-9_]+):\\{url:'"+v.url.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&')+"'([^}]*)\\}",'g');let m,n=0;
  while((m=re.exec(src))){n++;rows++;const body=m[2];if(/frames:/.test(body)){assert(body.includes('frames:'+v.frames),m[1]+' frames');assert(body.includes('fw:')?(body.includes('fw:'+v.fw)&&body.includes('fh:'+v.fh)):body.includes('frame:'+v.fw),m[1]+' size');}else assert(body.includes('frame:'+v.fw),m[1]);}
  assert(n>=1,'registered '+v.url);
}
assert.equal(Object.keys(M).length,97);assert.equal(rows,100,'100 registry rows (3 sheets shared by two keys)');
// manifests intact
for(const d of ['hero-motion-phase3','boss-motion-phase5a','boss-motion-phase5b'])for(const r of JSON.parse(fs.readFileSync(__dirname+'/../assets/incoming/'+d+'/MANIFEST.json','utf8'))){const f=__dirname+'/../assets/incoming/'+d+'/'+r.file;if(/preview/.test(r.file)&&!fs.existsSync(f))continue;/* CI sparse checkout skips *preview* */const b=fs.readFileSync(f);assert.equal(b.length,r.bytes,r.file);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.file);}
// hero art stays lazy · seedling shot loop fixed for 8 frames
assert(src.includes('taro-motion3c|hero-motion-phase3|'),'hero-motion-phase3 lazy');assert(src.includes('setFrame(Math.floor(q.seedArtTime*24)%8)'));
console.log('Motion phases 3/5A/5B: 97 sheets, 100 registry rows upgraded to 8/12 frames, manifests intact, lazy hero art passed');
