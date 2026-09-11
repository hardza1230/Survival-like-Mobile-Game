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

if (!source.includes('Math.floor(this._charRunT*16)%12')) {
  throw new Error('Fighter run cycles must play all 12 frames at 16 FPS');
}

for (const fighter of ['momo', 'mint', 'cocoa']) {
  const actionName = fighter === 'momo' ? 'char_momo_fighter_sheet.png' : `char_${fighter}_awakened_sheet.png`;
  const action = fs.readFileSync(new URL(`../assets/${actionName}`, import.meta.url));
  const actionWidth = action.readUInt32BE(16);
  const actionHeight = action.readUInt32BE(20);
  if (actionWidth !== 1024 || actionHeight !== 128) {
    throw new Error(`Expected ${fighter} 8x1 action sheet at 1024x128, found ${actionWidth}x${actionHeight}`);
  }
  const run = fs.readFileSync(new URL(`../assets/char_${fighter}_run_sheet.png`, import.meta.url));
  const width = run.readUInt32BE(16);
  const height = run.readUInt32BE(20);
  if (width !== 512 || height !== 384) {
    throw new Error(`Expected ${fighter} 4x3 run atlas at 512x384, found ${width}x${height}`);
  }
}

for (const fighter of ['momo', 'mint', 'cocoa', 'taro', 'sesame']) {
  const cardName = `card_${fighter}.png`;
  const card = fs.readFileSync(new URL(`../assets/character_cards/${cardName}`, import.meta.url));
  const width = card.readUInt32BE(16);
  const height = card.readUInt32BE(20);
  const colorType = card.readUInt8(25);
  const hasAlpha = [4, 6].includes(colorType) || (colorType === 3 && card.includes(Buffer.from('tRNS')));
  if (width !== 768 || height !== 1024 || !hasAlpha) {
    throw new Error(`Expected transparent ${fighter} Character Card at 768x1024, found ${width}x${height} PNG color type ${colorType}`);
  }
  if (!source.includes(`card_${fighter}:'assets/character_cards/${cardName}'`)) {
    throw new Error(`Character Card ${fighter} is not registered in ASSET_IMAGES`);
  }
}

console.log(`validated ${skills.length} attack skills, ${comboSkills.length} awaken combos, 4 level-up cards, five transparent Character Cards, three 8-frame action sheets, and three 12-frame run atlases`);


if (!source.includes("const UNIQUE_MAX_LV=4") || !source.includes("uniqueAt={2:3,3:7,4:11}")) {
  throw new Error('Unique skill run progression contract is missing');
}
if (!source.includes('updatePickupReadability()') || !source.includes('this.player.pickup=105')) {
  throw new Error('Readable pickup cues and attraction contract is missing');
}
if (!source.includes('castPathRecall(dm,ul)') || !source.includes('castOathWard(dm,ul)')) {
  throw new Error('Premium Taro/Sesame unique reworks are missing');
}
