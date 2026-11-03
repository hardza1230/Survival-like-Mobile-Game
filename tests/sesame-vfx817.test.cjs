// Source/packing/loading contracts; spell event adapters live in sesame-runes.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8');
for(const folder of ['assets/art/sesame_vfx817','assets/incoming/sesame_vfx817']){
 const m=JSON.parse(fs.readFileSync(folder+'/MANIFEST.json'));for(const a of m.assets||m.sources){const b=fs.readFileSync(a.path||folder+'/'+a.file);assert.equal(b.length,a.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256);if(folder.includes('/art/')){assert(src.includes("'"+a.path+"'"));assert.equal(a.frame,256);assert.equal(a.frames,24);assert.equal(a.cols,6);assert.equal(a.rows,4);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(a.decodedBytes,1536*1024*4);}}
}
const qa=JSON.parse(fs.readFileSync('assets/incoming/sesame_vfx817/QA_REPORT.json'));assert(qa.alphaPreserved&&qa.allBordersClear);assert.equal(qa.framesQA.length,72);assert.equal(qa.decodedBytes,3*1536*1024*4);
for(const clip of new Set(qa.framesQA.map(f=>f.clip))){const frames=qa.framesQA.filter(f=>f.clip===clip);assert.equal(frames.length,6);assert.equal(new Set(frames.map(f=>f.visibleHash)).size,6);for(const f of frames){assert(f.clearBorder);const [x,y,r,b]=f.runtimeAlphaBox;assert(x>=8&&y>=8&&r<=248&&b<=248);}}
{const vm=require('node:vm'),ctx={artClass:()=> 'hero',artHero:()=> 'sesame',artUrl:()=>''};vm.createContext(ctx);vm.runInContext(src.match(/^function lazyArt.*$/m)[0]+';this.defer=lazyArt;',ctx);assert(ctx.defer('fx_sesame_vfx817_water','assets/art/sesame_vfx817/fx.webp','sesame'));}
assert(!src.includes("ppb:{name:'Magma Garden'"));assert(!src.includes("pbb:{name:'Crystal Fault'"));
console.log('Sesame817: three exact alpha atlases, 72 distinct painted frames, clear cell borders, hero-lazy registration passed');
