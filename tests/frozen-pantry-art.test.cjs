const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const source = path.join(root, 'assets/incoming/frozen-pantry');
const rows = JSON.parse(fs.readFileSync(path.join(source, 'MANIFEST.json'), 'utf8'));
const roles = ['basic', 'fast', 'dasher', 'shooter', 'tank', 'captain', 'general'];
const keys = roles.map(role => 'fp_new_' + role);
assert.deepEqual(rows.map(row => row.key), keys);

const definitions = {};
for (const row of rows) {
  const {key} = row;
  const data = fs.readFileSync(path.join(source, row.file));
  assert.equal(data.length, row.bytes);
  assert.equal(createHash('sha256').update(data).digest('hex'), row.sha256);
  const url = 'assets/art/frozen-pantry/' + key + '.webp';
  const line = src.split('\n').find(item => item.includes(key + ":{url:'" + url + "'"));
  assert.ok(line && /fw:128,fh:128,frames:4,rate:\d+,anchor:'feet',loop:true/.test(line), key);
  assert.equal(fs.readFileSync(path.join(root, url)).toString('ascii', 8, 12), 'WEBP');
  definitions[key] = {url};
}

function method(name) {
  const start = src.indexOf('\n  ' + name + '(');
  assert.ok(start >= 0, name);
  const rest = src.slice(start + 1);
  const end = rest.slice(2).search(/\n  [\w$]+\(/);
  return rest.slice(0, end + 2);
}

const home = src.match(/^const MISSION_HOME=.*?;/m)[0];
const context = {ASSET_FX: definitions, FP_CAPTAIN_HP: 1.8};
const hooks = ['missionArtKeys', 'missionRoamArt', 'fpStatueArt', 'fpWake', 'fpVanish', 'fpResolve', 'artFollowTick'];
const Scene = vm.runInNewContext(home + '\n(class Scene {' + hooks.map(method).join('\n') + '})', context);
const scene = new Scene();
assert.deepEqual(Array.from(scene.missionArtKeys(3)), keys);
assert.deepEqual(Array.from(scene.missionArtKeys(0)), []);
assert.match(method('missionRoamArt'), /missionArtKeys\?\.\(MISSION_HOME\[t\]\)/);
assert.match(method('fpOpen'), /j===5\?'fast'/);
assert.match(method('fpOpen'), /si>=2\?'dasher':'fast'/);

const sprite = {setTint(color) { this.tint = color; }};
let artCall;
scene.artSpr = (...args) => { artCall = args; return sprite; };
scene.realTex = () => false;
assert.equal(scene.fpStatueArt('captain', 10, 20, 96), null);
scene.realTex = key => keys.includes(key);
assert.equal(scene.fpStatueArt('captain', 10, 20, 96), sprite);
assert.equal(artCall[0], 'fp_new_captain');
assert.equal(artCall[4], 0);
assert.equal(artCall[5].anim, false);
assert.ok(sprite.tint);

let spawned;
let attached;
let poolFull = true;
scene.sigSpawnAt = (x, y, elite, role) => {
  spawned = [x, y, elite, role];
  if (!poolFull) return {active: true, hp: 10};
};
scene.artFollow = (enemy, key, px) => { attached = [enemy, key, px]; };
const statue = {setVisible(value) { this.visible = value; }};
const captain = {x: 10, y: 20, role: 'captain', cap: true, gen: false, px: 96, t: statue};
scene.fpWake({}, {}, captain);
assert.equal(captain.state, 'pending');
assert.equal(attached, undefined);
poolFull = false;
scene.fpWake({}, {}, captain);
assert.deepEqual(spawned, [10, 20, false, 'tank']);
assert.deepEqual(attached, [captain.e, 'fp_new_captain', 96]);
assert.equal(captain.e.hp, 18);
assert.equal(statue.visible, false);

const general = {x: 10, y: 20, role: 'general', cap: false, gen: true, px: 118, t: statue};
scene.realTex = () => false;
attached = null;
scene.fpWake({}, {}, general);
assert.deepEqual(spawned, [10, 20, true, 'basic']);
assert.equal(attached, null);
assert.equal(general.state, 'awake');
console.log('Frozen Pantry: seven verified sheets, stage-only keys, fixed statues, awakening and fallback passed');
