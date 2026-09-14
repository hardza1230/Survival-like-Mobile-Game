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

if (!source.includes('rollUpgrades(this.usesBasicAttackBuild()?3:4)') || !source.includes("slice(0,3)")) {
  throw new Error('Readable-card choice counts changed unexpectedly');
}
for(const contract of ["const BASIC_ATTACKS = {","momo:{name:'Heart Seed Blaster'","cocoa:{name:'Bear Core Combo'","this.castCocoaCombo(lvl,dm,basic)","berry:{name:'Jam Cannon'","if(this.usesBasicAttackBuild())return this.rollBasicAttackUpgrades(n)","b.mastery>=4&&!b.mutation","b.mastery>=12&&!b.evolved"]){
  if(!source.includes(contract))throw new Error(`Missing character-first Basic Attack contract: ${contract}`);
}
const levelUpIcons=['momo_power','momo_rate','momo_size','momo_volley','cocoa_power','cocoa_rate','cocoa_size','cocoa_combo','berry_power','berry_rate','berry_size','berry_cluster','sweet_recovery','mochi_vitality','flavor_regeneration','sugar_on_kill'];
for(const icon of levelUpIcons){
  const file=fs.readFileSync(new URL(`../assets/icons/levelup/${icon}.png`,import.meta.url));
  const width=file.readUInt32BE(16),height=file.readUInt32BE(20),colorType=file.readUInt8(25),hasAlpha=[4,6].includes(colorType)||(colorType===3&&file.includes(Buffer.from('tRNS')));
  if(width!==128||height!==128||!hasAlpha)throw new Error(`Expected transparent level-up icon ${icon}.png at 128x128, found ${width}x${height}`);
  if(!source.includes(`assets/icons/levelup/${icon}.png`))throw new Error(`Level-up icon ${icon} is not registered`);
}
for(const contract of ["iconKey:'ic_momo_power'","iconKey:'ic_cocoa_combo'","iconKey:'ic_berry_cluster'","iconKey:'ic_sweet_recovery'","heart:'ic_mochi_vitality'","regen:'ic_flavor_regen'","sugarOnKill:'ic_sugar_on_kill'"]){
  if(!source.includes(contract))throw new Error(`Missing readable level-up icon mapping: ${contract}`);
}
if(source.includes("(!big&&Math.random()<0.015)"))throw new Error('Normal monsters must not drop healing hearts');
if(!source.includes("isElite&&Math.random()<0.18"))throw new Error('Elite healing-heart reward contract is missing');

if (!source.includes('Math.floor(this._charRunT*16)%12')) {
  throw new Error('Fighter run cycles must play all 12 frames at 16 FPS');
}

for (const fighter of ['momo', 'mint', 'cocoa', 'berry']) {
  const actionName = fighter === 'momo' ? 'char_momo_fighter_sheet.png' : fighter === 'berry' ? 'char_berry_core_sheet.png' : `char_${fighter}_awakened_sheet.png`;
  const action = fs.readFileSync(new URL(`../assets/${actionName}`, import.meta.url));
  const actionWidth = action.readUInt32BE(16);
  const actionHeight = action.readUInt32BE(20);
  if (actionWidth !== 1024 || actionHeight !== 128) {
    throw new Error(`Expected ${fighter} 8x1 action sheet at 1024x128, found ${actionWidth}x${actionHeight}`);
  }
  const runName = fighter === 'berry' ? 'char_berry_core_run_sheet.png' : `char_${fighter}_run_sheet.png`;
  const run = fs.readFileSync(new URL(`../assets/${runName}`, import.meta.url));
  const width = run.readUInt32BE(16);
  const height = run.readUInt32BE(20);
  if (width !== 512 || height !== 384) {
    throw new Error(`Expected ${fighter} 4x3 run atlas at 512x384, found ${width}x${height}`);
  }
}

for (const boss of ['boss3', 'boss4']) {
  const sheet = fs.readFileSync(new URL(`../assets/${boss}_sheet.png`, import.meta.url));
  const width = sheet.readUInt32BE(16), height = sheet.readUInt32BE(20), colorType = sheet.readUInt8(25);
  const hasAlpha = [4, 6].includes(colorType) || (colorType === 3 && sheet.includes(Buffer.from('tRNS')));
  if (width !== 1024 || height !== 512 || !hasAlpha) {
    throw new Error(`Expected transparent ${boss} 4x2 action sheet at 1024x512, found ${width}x${height} PNG color type ${colorType}`);
  }
  if (!new RegExp(`${boss}:\\s+\\{ url:'assets/${boss}_sheet\\.png', frame:256 \\}`).test(source)) throw new Error(`${boss} action sheet is not registered`);
}

const stage5Sheets = {
  boss5_sovereign:'boss5_sovereign_sheet.png',
  mb5_banquet_executioner:'mb5_banquet_executioner_sheet.png',
  e_void_crumb:'e_void_crumb_sheet.png',
  e_crown_ripper:'e_crown_ripper_sheet.png',
  e_banquet_eye:'e_banquet_eye_sheet.png',
  e_maw_truffle:'e_maw_truffle_sheet.png',
  e_royal_oven_sentinel:'e_royal_oven_sentinel_sheet.png',
};
for (const [key,file] of Object.entries(stage5Sheets)) {
  const sheet=fs.readFileSync(new URL(`../assets/${file}`,import.meta.url));
  const width=sheet.readUInt32BE(16),height=sheet.readUInt32BE(20),colorType=sheet.readUInt8(25);
  const hasAlpha=[4,6].includes(colorType)||(colorType===3&&sheet.includes(Buffer.from('tRNS')));
  if(width!==1024||height!==512||!hasAlpha)throw new Error(`Expected transparent Stage 5 sheet ${file} at 1024x512, found ${width}x${height}`);
  if(!source.includes(`${key}:{ url:'assets/${file}', frame:256`))throw new Error(`Stage 5 sheet ${key} is not registered`);
}

const chapter2Sheets={ch2_enemy_atlas:'ch2_enemy_atlas.png',ch2_prop_atlas:'ch2_prop_atlas.png',mb6_sporewarden:'mb6_sporewarden_sheet.png',boss6_rootmother:'boss6_rootmother_sheet.png'};
for(const [key,file] of Object.entries(chapter2Sheets)){
  const sheet=fs.readFileSync(new URL(`../assets/${file}`,import.meta.url));
  const width=sheet.readUInt32BE(16),height=sheet.readUInt32BE(20),colorType=sheet.readUInt8(25),hasAlpha=[4,6].includes(colorType)||(colorType===3&&sheet.includes(Buffer.from('tRNS')));
  if(width!==1024||height!==512||!hasAlpha)throw new Error(`Expected transparent Chapter 2 atlas ${file} at 1024x512, found ${width}x${height}`);
  if(!source.includes(`${key}:{ url:'assets/${file}', frame:256`))throw new Error(`Chapter 2 atlas ${key} is not registered`);
}
for(const contract of ["chapter2_cover:'assets/ui/chapter2_cover.webp'","bg6:'assets/bg6.png'","stages:[5,5]","this.buildChapterDepth(i)","this.chapter2Pose(b","this.chapter2DeathGhost(e)","rootmotherAttack(b)"]){
  if(!source.includes(contract))throw new Error(`Missing Chapter 2 / 2.5D contract: ${contract}`);
}
if(source.includes("e.setTintFill(crit?0xffe08a:0xffffff)"))throw new Error('Per-hit white fill obscures enemy artwork');
if(!source.includes("this.vfxHitRing(x,y,crit?0xffd166:0xff9ec4,crit)"))throw new Error('Readable hit feedback contract is missing');
for(const contract of ["survive:{emoji:'⏳'","hunt:{emoji:'🎯'","purge:{emoji:'💥'","capture:{emoji:'🔷'","this.waveNodes=this.physics.add.group","this.setupWaveObjective(w,p)","this.tickWaveObjective(dt)","this.completeWaveObjective()","if(this.stageIndex>4)return"]){
  if(!source.includes(contract))throw new Error(`Missing Chapter 1 wave mission contract: ${contract}`);
}

for (const fighter of ['momo', 'mint', 'cocoa', 'taro', 'sesame', 'berry']) {
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

console.log(`validated ${skills.length} attack skills, ${comboSkills.length} awaken combos, Stage 3–6 boss sheets, Chapter 2 atlases, and character atlases`);


if (!source.includes("const UNIQUE_MAX_LV=4") || !source.includes("uniqueAt={2:3,3:7,4:11}")) {
  throw new Error('Unique skill run progression contract is missing');
}
for(const contract of ["berry:{name:'เบอร์รี่คอร์'","unique:'jamOverdrive'","weapon:'jamCannon'","this.castJamOverdrive(dm,ul)","char_berry: { url:'assets/char_berry_core_sheet.png'","char_berry_run:{ url:'assets/char_berry_core_run_sheet.png'"]){
  if(!source.includes(contract))throw new Error(`Missing Berry Core character contract: ${contract}`);
}
if (!source.includes('updatePickupReadability()') || !source.includes('this.player.pickup=105')) {
  throw new Error('Readable pickup cues and attraction contract is missing');
}
if (!source.includes('castPathRecall(dm,ul)') || !source.includes('castOathWard(dm,ul)')) {
  throw new Error('Premium Taro/Sesame unique reworks are missing');
}
for (const contract of ['chiliBossAttack(b)','frostBossAttack(b)','buildEndgame()','recordEndless(cycle,kills,seconds,character)','The Echo of Hunger']) {
  if (!source.includes(contract)) throw new Error(`Missing Stage 3/4 or endgame contract: ${contract}`);
}
for(const contract of ["const bkey=this.stageIndex===4?'boss5_sovereign'","?'e_crown_ripper':type==='shooter'?'e_banquet_eye'","this.stage5Pose(b,pose","this.stage5DeathGhost(e)"]){
  if(!source.includes(contract))throw new Error(`Missing Stage 5 replacement contract: ${contract}`);
}
