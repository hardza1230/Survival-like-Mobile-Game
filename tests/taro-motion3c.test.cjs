const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const game=fs.readFileSync('game.js','utf8'),root='assets/incoming/taro-motion3c/';
const rows=JSON.parse(fs.readFileSync(root+'MANIFEST.json'));
assert.equal(rows.length,4);
const ctx={navigator:{},localStorage:{getItem:()=>null},location:{search:'',href:'http://x/'},document:{}};ctx.window=ctx;vm.createContext(ctx);
const a=game.indexOf('const STAGE_DECOR={'),b=game.indexOf('\n};',a)+3;
vm.runInContext(game.slice(a,b)+'\n'+game.slice(game.indexOf('const ASSET_IMAGES ='),game.indexOf('class Boot extends'))+';this.api={ASSET_FX,artHero,lazyArt};',ctx);
for(const r of rows){
 const bytes=fs.readFileSync(root+r.file);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256);
 assert.equal(bytes.length,r.bytes);
 const d=ctx.api.ASSET_FX[r.key];
 assert.deepEqual([d.fw,d.fh,d.frames,d.rate,!!d.loop],[r.frameWidth,r.frameHeight,8,r.rate,r.loop]);
 assert.equal(ctx.api.artHero(r.key),'taro');
 assert(ctx.api.lazyArt(r.key,d.url,'momo'));
 assert(ctx.api.lazyArt(r.key,d.url,'taro'));
 const previous=r.key.endsWith('fire')?16:r.key.endsWith('overcharge')?10:8;
 assert.equal(8/r.rate,4/previous);
 assert.equal(fs.readFileSync(d.url).toString('ascii',8,12),'WEBP');
}
assert(game.includes("art.chain('bpx_taro_sentry_idle')"));
assert(game.includes("n.fx._art.play('bpx_taro_sentry_fire')"));
assert(game.includes("au.play('bpx_taro_overcharge')"));
console.log('Taro phase 3C: four verified eight-frame loops/actions, unchanged period and node fire/idle/overcharge hooks');
