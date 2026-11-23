// v8.2.75: animation phase 4 (45 enemy attack/windup/flee/walk clips) + phase 5B boss body clips (6).
// New 8/12-frame clips are appended after each atlas's old frames, so idle/walk/hurt/death indices stay valid.
const fs=require('fs'),assert=require('assert'),crypto=require('crypto'),vm=require('vm');const root=__dirname+'/../',src=fs.readFileSync(root+'game.js','utf8');
const M=JSON.parse(fs.readFileSync(root+'scripts/motion-phase4.json','utf8'));let clips=0;
const webpSize=b=>{const t=b.toString('latin1',12,16);if(t==='VP8X')return [1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];if(t==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];if(t==='VP8L'){const n=b.readUInt32LE(21);return [1+(n&0x3fff),1+((n>>14)&0x3fff)];}};
for(const [old,v] of Object.entries(M)){
  assert(!src.includes("url:'"+old+"'")&&!src.includes("url: '"+old+"'"),'old atlas still registered '+old);assert(src.includes("'"+v.url+"'"),v.url);
  const b=fs.readFileSync(root+v.url);assert.equal(b.toString('latin1',8,12),'WEBP');const [w,h]=webpSize(b);assert.equal(w,v.cols*v.frame,v.url);
  const total=Object.values(v.clips).reduce((n,c)=>Math.max(n,c.start+c.count),0);assert(h/v.frame*v.cols>=total,'atlas holds all clips '+v.url);
  for(const [k,c] of Object.entries(v.clips)){clips++;assert.equal(c.start>=v.old,true,k);const list=Array.from({length:c.count},(_,i)=>c.start+i).join(',');
    if(/^(?:mb[5789]_)/.test(k))assert(src.includes('"idle8":['+list+']'),k);
    else if(/^mb10_/.test(k)){}
    else for(const a of c.actions){if(a==='walk')assert(src.includes('anim:{start:'+c.start+',frames:'+c.count),k+' walk');else assert(src.includes(a+':{frames:['+list+']'),k+' '+a);}}
}
assert.equal(Object.keys(M).length,49);assert.equal(clips,51);
for(const d of ['enemy-motion-phase4','boss-motion-phase5b'])for(const r of JSON.parse(fs.readFileSync(root+'assets/incoming/'+d+'/MANIFEST.json','utf8'))){if(!r.key.includes('__'))continue;const f=root+'assets/incoming/'+d+'/'+r.file;if(/preview/.test(r.file)&&!fs.existsSync(f))continue;const bb=fs.readFileSync(f);assert.equal(bb.length,r.bytes,r.file);assert.equal(crypto.createHash('sha256').update(bb).digest('hex'),r.sha256,r.file);}
// Root Knight clip table · boss ink idle 8 keeps a one-second cycle
assert(src.includes("idle:{frames:[16,17,18,19,20,21,22,23],rate:8,repeat:-1},cleave:{frames:[32,33,34,35,36,37,38,39,40,41,42,43],rate:12,repeat:0}")&&src.includes("charge:{frames:[24,25,26,27,28,29,30,31],rate:24,repeat:-1}"));
const i=src.indexOf('  bossInkClips(fd){'),j=src.indexOf('\n',i);const ctx={};vm.createContext(ctx);vm.runInContext('class K{'+src.slice(i,j)+'};this.K=K;',ctx);const k=new ctx.K();
assert.deepStrictEqual([...k.bossInkClips({frames:12,idle8:[12,13,14,15,16,17,18,19]}).idle],[12,13,14,15,16,17,18,19]);assert.deepStrictEqual([...k.bossInkClips({frames:12}).idle],[0,1,2,3,4,5]);
assert(src.includes("clips.idle[Math.floor(m.clock*clips.idle.length)%clips.idle.length]"));
console.log('Motion phase 4/5B clips: 49 atlases, 51 appended clips, registry/Root Knight/boss idle8 wired, manifests intact passed');
