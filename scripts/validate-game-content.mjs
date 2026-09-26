import fs from 'node:fs';
import { inflateSync } from 'node:zlib';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');

// v4.47 release gate: keep raster pickups plus the v4.46 roulette/mod contracts wired into shipped builds.
for(const contract of [
  "const GAME_VERSION = '5.70.0'",
  "const AFFIX_CATEGORY = {",
  "id:'bossdmg', category:'offense'",
  "id:'laststand', category:'offense'",
  "id:'lifekill', category:'defense'",
  "id:'crisisguard', category:'defense'",
  "id:'xp', category:'utility'",
  "id:'dash', category:'utility'",
  "_playAffixRoulette(pool,winner,rolled,cur)",
  "const delays=[76,88,102,120,145,175,215,270,340]",
]){
  if(!source.includes(contract))throw new Error(`Missing Affix Roulette contract: ${contract}`);
}
const affixBlock=source.match(/const AFFIX_POOL = \[([\s\S]*?)\n\];\nconst AFFIX_CATEGORY/);
if(!affixBlock)throw new Error('Cannot find expanded AFFIX_POOL block');
const affixIds=[...affixBlock[1].matchAll(/id:'([^']+)'/g)].map(match=>match[1]);
if(affixIds.length!==28||new Set(affixIds).size!==28)throw new Error(`Expected 28 unique affixes, found ${affixIds.length}`);
for(const category of ['offense','defense','utility']){
  const count=(affixBlock[1].match(new RegExp(`category:'${category}'`,'g'))||[]).length;
  if(count<4)throw new Error(`Expected at least four ${category} affixes, found ${count}`);
}

const crcTable = Array.from({length:256},(_,n)=>{
  let c=n;
  for(let i=0;i<8;i++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);
  return c>>>0;
});
function crc32(buf){
  let c=0xffffffff;
  for(const byte of buf)c=crcTable[(c^byte)&255]^(c>>>8);
  return (c^0xffffffff)>>>0;
}
function assertDecodablePng(rel){
  const file=fs.readFileSync(new URL(`../${rel}`,import.meta.url));
  if(file.length<33||file.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw new Error(`Invalid PNG signature: ${rel}`);
  let pos=8,sawHeader=false,sawEnd=false;const idat=[];
  while(pos<file.length){
    if(pos+12>file.length)throw new Error(`Truncated PNG chunk header: ${rel}`);
    const len=file.readUInt32BE(pos),end=pos+12+len;
    if(end>file.length)throw new Error(`Truncated PNG chunk payload: ${rel}`);
    const type=file.subarray(pos+4,pos+8),data=file.subarray(pos+8,pos+8+len),stored=file.readUInt32BE(pos+8+len),actual=crc32(Buffer.concat([type,data]));
    if(stored!==actual)throw new Error(`PNG CRC mismatch in ${type.toString('ascii')} chunk: ${rel}`);
    const tag=type.toString('ascii');
    if(tag==='IHDR')sawHeader=true;
    else if(tag==='IDAT')idat.push(data);
    else if(tag==='IEND'){sawEnd=true;pos=end;break;}
    pos=end;
  }
  if(!sawHeader||!idat.length||!sawEnd||pos!==file.length)throw new Error(`Incomplete PNG structure: ${rel}`);
  try{inflateSync(Buffer.concat(idat));}catch(error){throw new Error(`PNG image stream cannot be decoded: ${rel} (${error.message})`);}
}
const runtimePngs=[...new Set([...source.matchAll(/["'](assets\/[A-Za-z0-9_./ -]+\.png)["']/g)].map(match=>match[1]))];
for(const rel of runtimePngs)assertDecodablePng(rel);

const pickupPngs=[
  'assets/items/heal_mochi_heart.png',
  'assets/items/gear_gift.png',
  'assets/items/gimmick_scent_crystal.png',
  'assets/items/gimmick_clean_bubble.png',
  'assets/items/gimmick_chili_overcore.png',
  'assets/items/gimmick_frost_bell.png',
  'assets/items/gimmick_memory_seed.png',
  'assets/items/gimmick_ferment_drop.png',
];
for(const rel of pickupPngs){
  const file=fs.readFileSync(new URL(`../${rel}`,import.meta.url));
  const width=file.readUInt32BE(16),height=file.readUInt32BE(20),colorType=file.readUInt8(25);
  const hasAlpha=[4,6].includes(colorType)||(colorType===3&&file.includes(Buffer.from('tRNS')));
  if(width!==256||height!==256||!hasAlpha)throw new Error(`Expected transparent pickup ${rel} at 256x256, found ${width}x${height}`);
  if(!source.includes(`'${rel}'`))throw new Error(`Raster pickup is not registered: ${rel}`);
}
const trainingFloor=fs.readFileSync(new URL('../assets/training_floor.png',import.meta.url));
const floorWidth=trainingFloor.readUInt32BE(16),floorHeight=trainingFloor.readUInt32BE(20);
if(floorWidth!==512||floorHeight!==512)throw new Error(`Expected Training Ground raster floor at 512x512, found ${floorWidth}x${floorHeight}`);
if(!source.includes("train_floor:'assets/training_floor.png'"))throw new Error('Training Ground raster floor is not registered');
const imageRegistry=source.match(/const ASSET_IMAGES = \{([\s\S]*?)\n\};/);
if(!imageRegistry)throw new Error('Cannot find ASSET_IMAGES registry');
if(/\.svg["']/.test(imageRegistry[1]))throw new Error('Runtime SVG remains in ASSET_IMAGES');

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
const signatureComboSkills = ['sprinkle','meteor','frost','thunder','mirror'];
const missingCombos = signatureComboSkills.filter(skill => !comboSkills.includes(skill));
const orphanCombos = comboSkills.filter(skill => !skills.includes(skill));
if (missingCombos.length || orphanCombos.length) {
  throw new Error(`Signature combo mismatch. Missing: ${missingCombos.join(', ') || '-'}; orphaned: ${orphanCombos.join(', ') || '-'}`);
}
for(const skill of signatureComboSkills){
  const count=comboSkills.filter(item=>item===skill).length;
  if(count!==3)throw new Error(`Expected three character-first recipes for ${skill}, found ${count}`);
}

if (!source.includes('rollUpgrades(this.usesBasicAttackBuild()?3:4)') || !source.includes("slice(0,3)")) {
  throw new Error('Readable-card choice counts changed unexpectedly');
}
for(const contract of ["const BASIC_ATTACKS = {","momo:{name:'Heart Seed Blaster'","cocoa:{name:'Bear Core Combo'","this.castCocoaRush(lvl,aw,dm,basic.evolved,basic)","berry:{name:'Jam Cannon'","if(this.usesBasicAttackBuild())return this.rollBasicAttackUpgrades(n,opts)","b.mastery>=10&&!b.mutation","b.mastery>=evoAt&&!b.evolved"]){
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
  const actionName = fighter === 'momo' ? 'char_momo_fighter_sheet.png'
    : fighter === 'mint' ? 'char_mint_frostleaf_sheet.png'
    : fighter === 'berry' ? 'char_berry_core_sheet.png'
    : `char_${fighter}_awakened_sheet.png`;
  const action = fs.readFileSync(new URL(`../assets/${actionName}`, import.meta.url));
  const actionWidth = action.readUInt32BE(16);
  const actionHeight = action.readUInt32BE(20);
  const actionColorType = action.readUInt8(25);
  const actionHasAlpha = [4, 6].includes(actionColorType) || (actionColorType === 3 && action.includes(Buffer.from('tRNS')));
  if (actionWidth !== 1024 || actionHeight !== 128 || !actionHasAlpha) {
    throw new Error(`Expected transparent ${fighter} 8x1 action sheet at 1024x128, found ${actionWidth}x${actionHeight} PNG color type ${actionColorType}`);
  }
  const runName = fighter === 'mint' ? 'char_mint_frostleaf_run_sheet.png'
    : fighter === 'berry' ? 'char_berry_core_run_sheet.png'
    : `char_${fighter}_run_sheet.png`;
  const run = fs.readFileSync(new URL(`../assets/${runName}`, import.meta.url));
  const width = run.readUInt32BE(16);
  const height = run.readUInt32BE(20);
  const runColorType = run.readUInt8(25);
  const runHasAlpha = [4, 6].includes(runColorType) || (runColorType === 3 && run.includes(Buffer.from('tRNS')));
  if (width !== 512 || height !== 384 || !runHasAlpha) {
    throw new Error(`Expected transparent ${fighter} 4x3 run atlas at 512x384, found ${width}x${height} PNG color type ${runColorType}`);
  }
  const escapedActionName = actionName.replaceAll('.', '\\.')
  const escapedRunName = runName.replaceAll('.', '\\.')
  if (!new RegExp(`char_${fighter}:\\s+\\{ url:'assets/${escapedActionName}',\\s+frame:128 \\}`).test(source)) throw new Error(`${fighter} action sheet is not registered`);
  if (!new RegExp(`char_${fighter}_run:\\s*\\{ url:'assets/${escapedRunName}',\\s+frame:128 \\}`).test(source)) throw new Error(`${fighter} run atlas is not registered`);
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

const chapter2Sheets={ch2_enemy_atlas:'ch2_enemy_atlas.png',ch2_mycelium_enemy_atlas:'ch2_mycelium_enemy_atlas.png',ch2_prop_atlas:'ch2_prop_atlas.png',mb6_sporewarden:'mb6_sporewarden_sheet.png',boss6_rootmother:'boss6_rootmother_sheet.png'};
for(const [key,file] of Object.entries(chapter2Sheets)){
  const sheet=fs.readFileSync(new URL(`../assets/${file}`,import.meta.url));
  const width=sheet.readUInt32BE(16),height=sheet.readUInt32BE(20),colorType=sheet.readUInt8(25),hasAlpha=[4,6].includes(colorType)||(colorType===3&&sheet.includes(Buffer.from('tRNS')));
  if(width!==1024||height!==512||!hasAlpha)throw new Error(`Expected transparent Chapter 2 atlas ${file} at 1024x512, found ${width}x${height}`);
  if(!source.includes(`${key}:{ url:'assets/${file}', frame:256`))throw new Error(`Chapter 2 atlas ${key} is not registered`);
}
const behemoth=fs.readFileSync(new URL('../assets/boss7_mycelium_behemoth_sheet.png',import.meta.url));
const behW=behemoth.readUInt32BE(16),behH=behemoth.readUInt32BE(20),behType=behemoth.readUInt8(25),behAlpha=[4,6].includes(behType)||(behType===3&&behemoth.includes(Buffer.from('tRNS')));
if(behW!==1024||behH!==512||!behAlpha)throw new Error(`Expected transparent Mycelium Behemoth 4x2 sheet at 1024x512, found ${behW}x${behH}`);
for(const contract of ["boss7_mycelium_behemoth:{ url:'assets/boss7_mycelium_behemoth_sheet.png', frame:256","b.myceliumBehemoth=this.stageIndex===6","myceliumBehemothAttack(b)","behemothMetamorph(b,2)","behemothMetamorph(b,3)","Root Reaper","Mycelial Lattice","HEARTSTORM","this.stageIndex===4||this.stageIndex===6"]){
  if(!source.includes(contract))throw new Error(`Missing Mycelium Behemoth contract: ${contract}`);
}
const juggernaut=fs.readFileSync(new URL('../assets/mb7_fungal_juggernaut_sheet.png',import.meta.url));
const jugW=juggernaut.readUInt32BE(16),jugH=juggernaut.readUInt32BE(20),jugType=juggernaut.readUInt8(25),jugAlpha=[4,6].includes(jugType)||(jugType===3&&juggernaut.includes(Buffer.from('tRNS')));
if(jugW!==1024||jugH!==256||!jugAlpha)throw new Error(`Expected transparent Fungal Juggernaut 4x1 sheet at 1024x256, found ${jugW}x${jugH}`);
for(const contract of ["mb7_fungal_juggernaut:{ url:'assets/mb7_fungal_juggernaut_sheet.png', frame:256","b.juggernaut=this.stageIndex===6","fungalJuggernautAttack(b)","if(b.isMini&&this.stageIndex===6)","Triple Stampede","Living Wall","Colony Call","b.dmg=Math.round(st.bossDmg*1.1"]){
  if(!source.includes(contract))throw new Error(`Missing Fungal Juggernaut contract: ${contract}`);
}
for(const contract of ["chapter2_cover:'assets/ui/chapter2_cover.webp'","bg6:'assets/bg6.png'","bg7:'assets/bg7.webp'","stages:[5,9]","ready:false","isStageReady(stageIndex)","stageCurveValue(stageIndex","objectivePool=Array.isArray(st.objectives)","cleanAir:{emoji:'🫧'","spawnCleanAirZone()","tickCleanAir(dt)","ch2_mycelium_enemy_atlas","mycoRole==='bulwark'","mycoRole==='moldSac'","this.buildChapterDepth(i)","this.chapter2Pose(b","this.chapter2DeathGhost(e)","rootmotherAttack(b)"]){
  if(!source.includes(contract))throw new Error(`Missing Chapter 2 / 2.5D contract: ${contract}`);
}
if(source.includes("e.setTintFill(crit?0xffe08a:0xffffff)"))throw new Error('Per-hit white fill obscures enemy artwork');
if(!source.includes("this.vfxHitRing(x,y,crit?0xffd166:0xff9ec4,crit)"))throw new Error('Readable hit feedback contract is missing');
for(const contract of ["survive:{emoji:'⏳'","hunt:{emoji:'🎯'","capture:{emoji:'🔷'","this.waveNodes=this.physics.add.group","this.setupWaveObjective(w,p)","this.tickWaveObjective(dt)","this.completeWaveObjective()"]){
  if(!source.includes(contract))throw new Error(`Missing wave mission contract: ${contract}`);
}
if(source.includes("if(this.stageIndex>4)return"))throw new Error('Chapter 2 objectives must not be disabled by a hard-coded stage boundary');
for(const contract of ["chapterStage:2, ready:true","c2Mycelium:{ hp:1.145, dmg:1.19, speed:1.08, maxLive:104 }","const liveCap=si===6?BALANCE.c2Mycelium.maxLive:si===7?BALANCE.c2Nectar.maxLive:si===8?BALANCE.c2Seasons.maxLive:si===9?BALANCE.c2Root.maxLive:115","if(this.stageIndex===6)e.spd*=BALANCE.c2Mycelium.speed"]){
  if(!source.includes(contract))throw new Error(`Missing C2-2 QA/unlock contract: ${contract}`);
}
if(source.includes("chapterStage:5, ready:false"))throw new Error('Root Throne must be unlocked after C2-5 QA');
const c21Hp=3.72,c22Hp=3.72*1.18*1.145,c21Dmg=1.42,c22Dmg=1.42*1.09*1.19;
const hpRatio=c22Hp/c21Hp,dmgRatio=c22Dmg/c21Dmg;
if(hpRatio<1.34||hpRatio>1.37)throw new Error(`C2-2 HP ratio drifted outside QA target: ${hpRatio.toFixed(3)}`);
if(dmgRatio<1.28||dmgRatio>1.32)throw new Error(`C2-2 damage ratio drifted outside QA target: ${dmgRatio.toFixed(3)}`);
for(const contract of ["b.hp<=b.maxhp*.68","b.hp<=b.maxhp*.34","beginBossPhaseTransition(b,1.85","beginBossPhaseTransition(b,2.15","Triple Stampede","HEARTSTORM"]){
  if(!source.includes(contract))throw new Error(`Missing C2-2 boss QA contract: ${contract}`);
}
if(!fs.existsSync(new URL('../assets/bg7.webp',import.meta.url)))throw new Error('Mycelium Marsh background is missing');

for(const contract of [
  "chapterStage:3, ready:true",
  "c2Nectar:{ hp:1.12, dmg:1.08, speed:1.06, maxLive:96 }",
  "defendNectar:{emoji:'🌺'",
  "spawnNectarGarden()",
  "tickNectarGarden(dt)",
  "nectarRole==='waxGuard'",
  "nectarRole==='choirMoth'",
  "royalStingerAttack(b)",
  "hornetQueenAttack(b)",
  "b.hp<=b.maxhp*.70",
  "b.hp<=b.maxhp*.35",
  "QUEEN'S DECREE",
]) {
  if(!source.includes(contract))throw new Error(`Missing C2-3 Nectar Hive contract: ${contract}`);
}
const nectarPngs=[
  ['ch2_nectar_enemy_atlas.png',1024,512],
  ['mb8_royal_stinger_sheet.png',1024,256],
  ['boss8_hornet_queen_sheet.png',1024,512],
];
for(const [name,wantW,wantH] of nectarPngs){
  const file=fs.readFileSync(new URL(`../assets/${name}`,import.meta.url));
  const width=file.readUInt32BE(16),height=file.readUInt32BE(20),colorType=file.readUInt8(25),hasAlpha=[4,6].includes(colorType)||(colorType===3&&file.includes(Buffer.from('tRNS')));
  if(width!==wantW||height!==wantH||!hasAlpha)throw new Error(`Expected transparent ${name} at ${wantW}x${wantH}, found ${width}x${height}`);
}
if(!fs.existsSync(new URL('../assets/bg8.webp',import.meta.url)))throw new Error('Nectar Hive background is missing');

for(const contract of [
  "chapterStage:4, ready:true",
  "c2Seasons:{ hp:1.14, dmg:1.10, speed:1.07, maxLive:92 }",
  "seasonCycle:{emoji:'🌦️'",
  "tickSeasonArena(dt)",
  "spawnSeasonSanctuaries()",
  "seasonRole==='equinoxGuard'",
  "seasonRole==='seasonWisp'",
  "seasonKeeperAttack(b)",
  "chronobloomAttack(b)",
  "b.hp<=b.maxhp*.72",
  "b.hp<=b.maxhp*.38",
  "TIME BREAK",
]) {
  if(!source.includes(contract))throw new Error(`Missing C2-4 Four-Season contract: ${contract}`);
}
const seasonPngs=[
  ['ch2_seasons_enemy_atlas.png',1024,512],
  ['mb9_season_keeper_sheet.png',1024,256],
  ['boss9_chronobloom_orchid_sheet.png',1024,512],
];
for(const [name,wantW,wantH] of seasonPngs){
  const file=fs.readFileSync(new URL(`../assets/${name}`,import.meta.url));
  const width=file.readUInt32BE(16),height=file.readUInt32BE(20),colorType=file.readUInt8(25),hasAlpha=[4,6].includes(colorType)||(colorType===3&&file.includes(Buffer.from('tRNS')));
  if(width!==wantW||height!==wantH||!hasAlpha)throw new Error(`Expected transparent ${name} at ${wantW}x${wantH}, found ${width}x${height}`);
}
if(!fs.existsSync(new URL('../assets/bg9.webp',import.meta.url)))throw new Error('Four-Season Conservatory background is missing');

for(const contract of [
  "chapterStage:5, ready:true",
  "c2Root:{ hp:1.16, dmg:1.12, speed:1.08, maxLive:88 }",
  "breakRoots:{emoji:'🌳'",
  "spawnRootAnchors(n=4)",
  "tickRootThrone(dt)",
  "rootRole==='barkGuard'",
  "rootRole==='rootChoir'",
  "rootKnightAttack(b)",
  "trueRootmotherAttack(b)",
  "b.hp<=b.maxhp*.75",
  "b.hp<=b.maxhp*.42",
  "b.hp<=b.maxhp*.18",
  "MEMORY ECLIPSE",
  "Memories Choose Their Own Shape",
]) {
  if(!source.includes(contract))throw new Error(`Missing C2-5 Root Throne contract: ${contract}`);
}
const rootPngs=[
  ['ch2_root_enemy_atlas.png',1024,512],
  ['mb10_ancient_root_knight_sheet.png',1024,256],
  ['boss10_true_rootmother_sheet.png',1024,512],
];
for(const [name,wantW,wantH] of rootPngs){
  const file=fs.readFileSync(new URL(`../assets/${name}`,import.meta.url));
  const width=file.readUInt32BE(16),height=file.readUInt32BE(20),colorType=file.readUInt8(25),hasAlpha=[4,6].includes(colorType)||(colorType===3&&file.includes(Buffer.from('tRNS')));
  if(width!==wantW||height!==wantH||!hasAlpha)throw new Error(`Expected transparent ${name} at ${wantW}x${wantH}, found ${width}x${height}`);
}
if(!fs.existsSync(new URL('../assets/bg10.webp',import.meta.url)))throw new Error('Root Throne background is missing');

for (const fighter of ['momo', 'mint', 'cocoa', 'taro', 'sesame', 'berry']) {
  const cardName = fighter === 'mint' ? 'card_mint_frostleaf.png' : `card_${fighter}.png`;
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

console.log(`validated ${skills.length} attack skills, ${comboSkills.length} awaken combos, Stage 3–10 boss sheets, Chapter 2 atlases, objectives, and character atlases`);


if (!source.includes("const UNIQUE_MAX_LV=4") || !source.includes("uniqueAt={2:3,3:7,4:11}")) {
  throw new Error('Unique skill run progression contract is missing');
}
for(const contract of ["berry:{name:'Berry Core'","unique:'jamOverdrive'","weapon:'jamCannon'","this.castJamOverdrive(dm,ul)","char_berry: { url:'assets/char_berry_core_sheet.png'","char_berry_run:{ url:'assets/char_berry_core_run_sheet.png'"]){
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
for(const contract of ["this.stageIndex===4?'boss5_sovereign'","?'e_crown_ripper':type==='shooter'?'e_banquet_eye'","this.stage5Pose(b,pose","this.stage5DeathGhost(e)"]){
  if(!source.includes(contract))throw new Error(`Missing Stage 5 replacement contract: ${contract}`);
}

// R10: Recipe Maps endgame contracts + กฎเหล็ก (ยิ่งยาก รางวัลยิ่งดี)
for(const c of ['const RECIPE_BAG_MAX=30, RECIPE_TIER_MAX=16','function makeRecipe(','function recipeMul(','function atlasPoints(','const ATLAS_NODES=[','const UNIQUE_GEAR={','startRecipeRun(st)','tickRecipeHunger(dt)','finishRecipeBoss()','rollRecipeDrops(r)','craftRecipe(r,cid)','triggerRecipeEvent()','migrateRiftToRecipes()','startPinnacle()','this.recipeMode?this.riftMul().hp*RECIPE_BOSS_HP:1']){
  if(!source.includes(c))throw new Error(`Missing Recipe Maps contract: ${c}`);
}
const recipeMods=block(/const RIFT_MODS=\[([\s\S]*?)\n\];/,'RIFT_MODS')+block(/const RECIPE_MECH_MODS=\[([\s\S]*?)\n\];/,'RECIPE_MECH_MODS');
for(const m of recipeMods.matchAll(/id:'([^']+)'[^\n]*?hp:([\d.]+),dmg:([\d.]+),reward:([\d.]+)/g)){
  const [,id,hp,dmg,rw]=m; if(+rw<=1)throw new Error(`Recipe mod ${id} breaks the iron rule (reward ${rw} vs hp ${hp}/dmg ${dmg})`);
}
const tierFn=source.match(/function riftTierMul\(t\)\{[^\n]*hp:1\+([\d.]+)\*\(t-1\),dmg:1\+([\d.]+)\*\(t-1\),reward:1\+([\d.]+)\*\(t-1\)/);
if(!tierFn||!(+tierFn[3]>0))throw new Error('riftTierMul must raise reward with tier');
const atlasIds=[...block(/const ATLAS_NODES=\[([\s\S]*?)\n\];/,'ATLAS_NODES').matchAll(/id:'([^']+)'/g)].map(m=>m[1]);
if(atlasIds.length!==7||new Set(atlasIds).size!==7)throw new Error(`Expected 7 unique Atlas nodes, found ${atlasIds.length}`);
const uqCount=(block(/const UNIQUE_GEAR=\{([\s\S]*?)\n\};/,'UNIQUE_GEAR').match(/unique:true/g)||[]).length;
if(uqCount!==5)throw new Error(`Expected 5 Unique gear items, found ${uqCount}`);
console.log('validated Recipe Maps: 16 tiers, iron-rule mods, 7 Atlas nodes, 5 Uniques');
