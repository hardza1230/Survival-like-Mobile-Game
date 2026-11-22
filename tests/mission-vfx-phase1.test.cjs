const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const rows = JSON.parse(fs.readFileSync(path.join(root, 'assets/incoming/mission-vfx-next/MANIFEST.json'), 'utf8'));
const a = game.indexOf('const STAGE_DECOR={');
const b = game.indexOf('\n};', a) + 3;
const ctx = {navigator: {}, localStorage: {getItem: () => null}, location: {search: '', href: 'http://x/'}, document: {}};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(game.slice(a, b) + '\n' +
  game.slice(game.indexOf('const ASSET_IMAGES ='), game.indexOf('class Boot extends')) +
  ';this.assets={ASSET_FX,artClass,lazyArt,bootKeep};', ctx);
const {ASSET_FX, artClass, lazyArt, bootKeep} = ctx.assets;
const start = game.indexOf('\n  missionArtKeys(');
const end = game.indexOf('\n  artSpr(', start);
const missionArtKeys = vm.runInContext('({' + game.slice(start, end) + '}).missionArtKeys', ctx);
for (const [key, frames, home] of [['vfx_seed_rift_feed', 12, 10], ['vfx_mirror_path_lock', 8, 12]]) {
  const row = rows.find(r => r.key === key);
  const {url, fw, fh, frames: runtimeCount, rate, loop} = ASSET_FX[key];
  assert.deepEqual([row.frameCount, fw, fh, runtimeCount, rate, !!loop], [frames, 192, 192, frames, 24, false]);
  assert.equal(artClass(key), 'stage');
  assert.ok(lazyArt(key, url, 'momo') && !bootKeep(key));
  assert.equal(fs.readFileSync(path.join(root, url)).toString('ascii', 8, 12), 'WEBP');
  for (let idx = 0; idx < 15; idx++) assert.equal(missionArtKeys.call({}, idx).includes(key), idx === home, key);
}
assert.match(game, /if\(!feedCue&&this.realTex\?\.\('vfx_seed_rift_feed'\)\)feedCue=!!this.artFx\?\./);
assert.match(game, /if\(!feedCue\)this.vfxSpawnPoof\?\.\(e.x,e.y\);\n\s*S.seeds\+\+/);
assert.match(game, /if\(!this.realTex\?\.\('vfx_mirror_path_lock'\)\|\|!this.artFx\?\.\('vfx_mirror_path_lock',m.x,m.y-38,128\)\)this.vfxHitRing\?\./);
console.log('Mission VFX phase 1: 12/8 one-shots, correct stage groups, fallback cues and host events passed');
