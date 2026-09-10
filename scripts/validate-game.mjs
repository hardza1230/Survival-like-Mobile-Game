import fs from 'node:fs';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

function block(pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`Cannot find ${label} block in game.js`);
  return match[1];
}

const skillBlock = block(/const SKILLDEFS = \{([\s\S]*?)\n\};\nconst SKILL_AWAKEN_LV/, 'SKILLDEFS');
const skills = [...skillBlock.matchAll(/^  ([A-Za-z][A-Za-z0-9]*):/gm)].map(match => match[1]);
if (skills.length !== 15) {
  throw new Error(`Expected exactly 15 attack skills, found ${skills.length}: ${skills.join(', ')}`);
}

const comboBlock = block(/const COMBOS = \[([\s\S]*?)\n\];/, 'COMBOS');
const comboSkills = [...comboBlock.matchAll(/a:'([^']+)'/g)].map(match => match[1]);
const missingCombos = skills.filter(skill => !comboSkills.includes(skill));
const orphanCombos = comboSkills.filter(skill => !skills.includes(skill));
if (missingCombos.length || orphanCombos.length) {
  throw new Error(`Skill/combo mismatch. Missing: ${missingCombos.join(', ') || '-'}; orphaned: ${orphanCombos.join(', ') || '-'}`);
}

if (!source.includes('rollUpgrades(4)') || !source.includes("slice(0,3)")) {
  throw new Error('Readable-card choice counts changed unexpectedly');
}

if (!source.includes('Math.floor(this._momoRunT*25)%25')) {
  throw new Error('Momo must play all 25 run frames at 25 FPS');
}

const momoRun = fs.readFileSync(new URL('../assets/char_momo_run_sheet.png', import.meta.url));
const momoRunWidth = momoRun.readUInt32BE(16);
const momoRunHeight = momoRun.readUInt32BE(20);
if (momoRunWidth !== 640 || momoRunHeight !== 640) {
  throw new Error(`Expected Momo 5x5 atlas at 640x640, found ${momoRunWidth}x${momoRunHeight}`);
}

console.log(`validated ${skills.length} attack skills, ${comboSkills.length} awaken combos, 4 level-up cards, and Momo's 25-frame run atlas`);
