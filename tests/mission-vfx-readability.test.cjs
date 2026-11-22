const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const src = fs.readFileSync(require('node:path').join(__dirname, '..', 'game.js'), 'utf8');
function method(name) {
  const start = src.indexOf('\n  ' + name + '(') + 1;
  assert.ok(start > 0, name);
  const rest = src.slice(start);
  return rest.slice(0, rest.search(/\n  (?:[\w$]+\(|\/[/*])/)).trimEnd();
}
const settings = {reducedMotion: false};
const methods = ['hmRiftFx', 'hhBeamGuide', 'hhEmpoweredMark', 'nectarFlowerFx'];
const hooks = vm.runInNewContext('({' + methods.map(method).join(',') + '})', {
  TAU: 2 * Math.PI, Save: {data: {settings}}
});

function graphics() {
  const trace = [];
  const g = {active: true, trace, clear() { trace.length = 0; return g; }};
  for (const name of ['fillStyle', 'lineStyle', 'lineBetween', 'fillPoints', 'strokePoints',
    'setPosition', 'setDepth', 'fillEllipse', 'strokeEllipse', 'fillCircle', 'strokeCircle']) {
    g[name] = (...args) => { trace.push([name, ...args]); return g; };
  }
  return g;
}

const rift = graphics();
const phase = {x: 300, y: 400, R: 420, life: 3, t: .4, phase: 'open', ring: {
  setVisible(visible) { this.visible = visible; }
}};
const riftScene = {add: {graphics: () => rift}, sigAdd: value => value};
hooks.hmRiftFx.call(riftScene, phase);
assert.equal(phase.ring.visible, false);
assert.equal(phase.riftPoints.length, 64);
assert.ok(rift.trace.some(row => row[0] === 'fillPoints'), 'tinted floor footprint');
assert.ok(rift.trace.some(row => row[0] === 'lineBetween'), 'broken veins');
const initial = phase.riftPoints.map(({x,y}) => Math.hypot(x,y));
assert.ok(Math.max(...initial) - Math.min(...initial) > 20, 'edge is uneven');
phase.phase = 'close';
phase.R = 160;
hooks.hmRiftFx.call(riftScene, phase);
assert.ok(phase.riftPoints.every(({x,y}) => Math.hypot(x,y) < 190));
assert.ok(rift.trace.some(row => row[0] === 'lineStyle' && row[2] === 0xd18eec));
phase.R = 0;
hooks.hmRiftFx.call(riftScene, phase);
assert.equal(rift.trace.length, 0);

const beam = graphics(), herald = {x: 0, y: 0}, foe = {x: 150, y: 40, displayWidth: 48};
hooks.hhBeamGuide(beam, herald, foe, .6, 5);
assert.equal(beam.trace.filter(row => row[0] === 'lineBetween').length, 7);
beam.clear();
settings.reducedMotion = true;
hooks.hhBeamGuide(beam, herald, foe, .6, 5);
assert.equal(beam.trace.filter(row => row[0] === 'lineBetween').length, 4, 'static target brackets remain');
beam.clear();
hooks.hhEmpoweredMark(beam, foe);
assert.ok(beam.trace.filter(row => row[0] === 'lineBetween').every(row => row[2] > foe.y && row[4] > foe.y));
assert.match(method('hhTick'), /hhBeamGuide\?\.\(g,H,e,w,S.t\)/);
assert.match(method('hhTick'), /hhEmpoweredMark\?\.\(g,e\)/);

const floor = graphics();
const flower = {x: 23, y: 41, hp: 175, maxhp: 300, healing: false, attacked: true, bloom: .85, floor};
hooks.nectarFlowerFx(flower, .1);
assert.ok(floor.trace.some(row => row[0] === 'lineStyle' && row[2] === 0xf87889));
assert.ok(flower.bloom < .85);
flower.healing = true;
flower.attacked = false;
hooks.nectarFlowerFx(flower, .8);
assert.deepEqual(floor.trace.find(row => row[0] === 'strokeCircle'), ['strokeCircle', 23, 41, 135]);
assert.equal(flower.bloom, 0);
assert.equal(floor.trace.filter(row => row[0] === 'fillCircle').length, 0, 'accessibility mode suppresses motes');
assert.match(method('clearWaveObjective'), /\[f.sprite,f.ring,f.floor\]/);
console.log('Mission VFX: layered breach and collapse, charge cues, low-motion markers, and bloom states passed');
