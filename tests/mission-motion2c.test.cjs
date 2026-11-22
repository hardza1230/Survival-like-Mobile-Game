const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const incoming = path.join(root, 'assets/incoming/mission-motion2c');
const rows = JSON.parse(fs.readFileSync(path.join(incoming, 'MANIFEST.json'), 'utf8'));
const originalRates = {ws92_tether:12,hn87_poison_bottle:12,hh85_beam:14,hm_splinter:8,gp_pot:8,
  msn71_crystal:8,msn71_lantern:8,ult_altar:8,ult_seed:8,gg_oven:8};
assert.deepEqual(rows.map(r=>r.key),Object.keys(originalRates));

const ctx = {navigator:{},localStorage:{getItem:()=>null},location:{search:'',href:'http://x/'},document:{}};
ctx.window = ctx;
vm.createContext(ctx);
const start = game.indexOf('const STAGE_DECOR={');
const end = game.indexOf('\n};',start)+3;
vm.runInContext(game.slice(start,end)+'\n'+game.slice(game.indexOf('const ASSET_IMAGES ='),
  game.indexOf('class Boot extends'))+';this.assets={ASSET_FX,artClass,lazyArt,bootKeep};',ctx);
const {ASSET_FX,artClass,lazyArt,bootKeep}=ctx.assets;
for (const row of rows) {
  const {key,file,frameWidth:w,frameHeight:h,columns:cols} = row;
  const data = fs.readFileSync(path.join(incoming,file));
  assert.equal(data.length,row.bytes);
  assert.equal(createHash('sha256').update(data).digest('hex'),row.sha256);
  assert.deepEqual([data.readUInt32BE(16),data.readUInt32BE(20),data[25]],[w*cols,h*(8/cols),6]);
  const d = ASSET_FX[key];
  assert.deepEqual([d.fw,d.fh,d.frames,d.rate,d.anchor,d.loop],[w,h,8,originalRates[key]*2,row.anchor,true]);
  assert.equal(8/d.rate,4/originalRates[key]);
  assert.equal(d.url,'assets/art/mission-motion2c/'+key+'.webp');
  assert.equal(artClass(key),'stage');
  assert(lazyArt(key,d.url,'momo')&&!bootKeep(key));
  assert.equal(fs.readFileSync(path.join(root,d.url)).toString('ascii',8,12),'WEBP');
}
const hunt=game.slice(game.indexOf('\n  huntLob('),game.indexOf('\n  huntLobLand('));
assert.match(hunt,/this\.bpAnim\?\.\('hn87_poison_bottle'\)/);
assert.match(hunt,/setRotation\(k\*Math\.PI\*3\)/);
const load=game.slice(game.indexOf('\n  missionArtKeys('),game.indexOf('\n  artSpr('));
const missionArtKeys=vm.runInContext('({'+load+'}).missionArtKeys',ctx);
for (const [home,keys] of [[0,['hh85_beam']],[1,['hm_splinter']],[2,['gp_pot']],[4,['gg_oven']],
  [12,['msn71_crystal']],[13,['ult_altar','ult_seed']],[14,['msn71_lantern']]]) {
  for (const key of keys) assert(missionArtKeys.call({},home).includes(key),key);
}
console.log('Mission motion 2C: ten eight-frame atlases, original period, confirmed lazy hooks, dynamic Hunt bottle loop');
