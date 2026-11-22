const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const art = path.join(root, 'assets/incoming/mission-motion2b');
const rows = JSON.parse(fs.readFileSync(path.join(art, 'MANIFEST.json'), 'utf8'));
const oldRates = {hh87_healer:10,hh87_booster:10,hh87_possessor:10,sr87_carrier_fast:12,
  sr87_carrier_armored:10,sr87_carrier_split:12,st87_bee:14,ll85_moth:12,hs85_sapper:12};

const ctx = {navigator:{},localStorage:{getItem:()=>null},location:{search:'',href:'http://x/'},document:{}};
ctx.window = ctx;
vm.createContext(ctx);
const start = game.indexOf('const STAGE_DECOR={');
const stop = game.indexOf('\n};', start) + 3;
vm.runInContext(game.slice(start, stop) + '\n' + game.slice(game.indexOf('const ASSET_IMAGES ='),
  game.indexOf('class Boot extends')) + ';this.assets={ASSET_FX,artClass,lazyArt,bootKeep};', ctx);
const {ASSET_FX,artClass,lazyArt,bootKeep} = ctx.assets;
assert.deepEqual(rows.map(row=>row.key),Object.keys(oldRates));

for (const row of rows) {
  const {key,frameWidth:size} = row;
  const png = fs.readFileSync(path.join(art,row.file));
  assert.equal(png.length,row.bytes);
  assert.equal(createHash('sha256').update(png).digest('hex'),row.sha256);
  assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20),png[25]],[size*8,size,6]);
  const def = ASSET_FX[key];
  assert.deepEqual([def.fw,def.fh,def.frames,def.anchor,def.loop,def.rate],[size,size,8,row.anchor,true,row.rate]);
  assert.equal(row.rate,oldRates[key]*2);
  assert.equal(8/def.rate,4/oldRates[key]);
  assert.equal(def.url,'assets/art/mission-motion2b/'+key+'.webp');
  assert.equal(artClass(key),'stage');
  assert(lazyArt(key,def.url,'momo')&&!bootKeep(key));
  assert.equal(fs.readFileSync(path.join(root,def.url)).toString('ascii',8,12),'WEBP');
}
const load = game.slice(game.indexOf('\n  missionArtKeys('),game.indexOf('\n  artSpr('));
const missionArtKeys = vm.runInContext('({' + load + '}).missionArtKeys',ctx);
for (const [home,keys] of [[0,['hh87_healer','hh87_booster','hh87_possessor']],
    [10,['sr87_carrier_fast','sr87_carrier_armored','sr87_carrier_split']], [11,['st87_bee']],[14,['ll85_moth']]]) {
  const loaded = missionArtKeys.call({},home);
  for (const key of keys) assert(loaded.includes(key),key);
}
assert(missionArtKeys.call({recipeMode:true},8).includes('hs85_sapper'));
console.log('Mission motion 2B: nine verified eight-frame loops, stable cadence and the same mission lazy-load paths');
