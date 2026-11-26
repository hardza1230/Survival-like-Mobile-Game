/* ---- SKILLS: auto-cast, flashy, stackable ---- */
const SKILLDEFS = {
  yuzling:{name:'Citrus Crew',emoji:'🍋',role:'Citrus companion',max:5,desc:'One always-ready citrus companion fights beside Yuzu; choose a boxer, archer or mage',orbit:true,awaken:{name:'The Citrus Court',emoji:'👑',desc:'The crew evolves with its Build Path'}},
  sprinkle:{ name:'Sprinkle Spray', emoji:'🍬', role:'Machine gun · fast, light', max:5, desc:'Sprays rainbow seeds at the nearest enemies — fast but light · single hit',
    awaken:{ name:'Rainbow Storm', emoji:'🌈', desc:'16 homing rainbow seeds, blazing fast!' } },
  star:    { name:'Star Guard',     emoji:'🌟', role:'Defense · close range', max:5, desc:'Orbiting stars deal damage and block incoming bullets', orbit:true,
    awaken:{ name:'Galaxy Ring', emoji:'💫', desc:'3 rings of stars, spinning fast — massive damage!' } },
  thunder: { name:'Thunder Crown',  emoji:'⚡', role:'Elite hunter · chain', max:5, desc:'Strikes the highest-HP target, then chains to nearby enemies',
    awaken:{ name:'Eternal Storm', emoji:'🌩️', desc:'8 strikes that fork across the whole field!' } },
  whirl:   { name:'Cream Whirl',    emoji:'🍥', role:'Crowd sweep · all directions', max:5, desc:'Spins cream blades in all directions to sweep crowds',
    awaken:{ name:'Cream Tornado', emoji:'🌪️', desc:'16 directions, giant blades that pierce everything!' } },
  boomer:  { name:'Boomerang Cookie',emoji:'🍪', role:'Out & back · line up', max:5, desc:'Cookie pierces out and back; catching it cuts the next cooldown',
    awaken:{ name:'Cookie Hurricane', emoji:'🍪', desc:'6 giant cookies, bounce twice, rapid hits!' } },
  frost:   { name:'Frost Pulse',    emoji:'❄️', role:'Freeze crowd · area control', max:5, desc:'Freezes nearby enemies; frozen targets shatter for bonus damage',
    awaken:{ name:'Absolute Zero', emoji:'🧊', desc:'Freezes the whole screen + high-damage ice blast!' } },
  popcorn: { name:'Popcorn Burst',  emoji:'🍿', role:'Close range · knockback', max:5, desc:'Short-range popcorn burst — high damage, knocks crowds away',
    awaken:{ name:'Popcorn Apocalypse', emoji:'🍿', desc:'20 kernels blanket the screen, piercing and long-range!' } },
  bubble:  { name:'Bubble Prison',  emoji:'🫧', role:'Trap threats · burst', max:5, desc:'Traps the highest-HP enemy in a bubble, then bursts based on its HP',
    awaken:{ name:'Bursting Prison', emoji:'🫧', desc:'Fires many bubbles, holds longer, chain-bursts wide!' } },
  mine:    { name:'Cupcake Sentry', emoji:'🧁', role:'Turret · DPS', max:5, desc:'Deploys an auto-firing turret that holds ground, then explodes',
    awaken:{ name:'Bakery Army', emoji:'🧁', desc:'Deploys 3 turrets, double-shots, lasts longer!' } },
  beam:    { name:'Caramel Beam',   emoji:'🔆', role:'Straight line · heavy burst', max:5, desc:'Fires a heavy beam that pierces the whole line — positioning matters',
    awaken:{ name:'Death Ray', emoji:'🔆', desc:'3 wide beams that burn through everything!' } },
  meteor:  { name:'Bear-Sigil Donut', emoji:'🍩', role:'Repeat slam · glazed area', max:5, desc:'Bear sigil slams the target repeatedly, leaving slowing Glaze',
    awaken:{ name:'Bear-Sigil King', emoji:'🐻', desc:'Slams faster, glazes a wide area, ends with a bear shockwave!' } },
  cloud:   { name:'Mocha Mist',     emoji:'☕', role:'DoT · dense crowds', max:5, desc:'Drops toxic mist on the densest cluster for continuous damage',
    awaken:{ name:'Deadly Mist', emoji:'☕', desc:'Bigger cloud, high damage, long duration!' } },
  rocket:  { name:'Candy Hunter',   emoji:'🚀', role:'Elite hunter · AoE', max:5, desc:'Rocket locks the highest-HP enemy and blasts the crowd around it',
    awaken:{ name:'Rocket Swarm', emoji:'🚀', desc:'6 homing rockets, big blasts!' } },
  mirror:  { name:'Mirror Glaze', emoji:'🪞', role:'Reflect · enemy bullets', max:5, desc:'Raises a mirror that turns enemy bullets into homing flavor shots',
    awaken:{ name:'Thousand-Flavor Mirror', emoji:'🪞', desc:'Bigger reflect ring plus homing glass shards!' } },
  decoy:   { name:'Core Decoy', emoji:'💠', role:'Lure crowd · survive', max:5, desc:'Lures enemies away, then explodes and heals when Awakened',
    awaken:{ name:'Perfect Decoy', emoji:'💠', desc:'Lures longer, double explosion, drops healing!' } },
};
const SKILL_AWAKEN_LV = 6;   // เลเวลตื่นรู้ (Awaken) — หลังจาก max (5 ดาว)
// Juice: หมุดหมายคอมโบฆ่าต่อเนื่อง {จำนวน: [สเต็ปเสียง, คำชม]}
// ระดับความยากต่อStage (เลือกก่อนเล่น) — กฎเหล็ก: ยิ่งยาก ศัตรูยิ่งถึก/แรง แต่ "better rewards"
/* ระดับความยาก 3 ระดับ (ลดจาก 5 เพื่อลดความซับซ้อน/ภาระบาลานซ์ · v2.53) · กฎเหล็ก: ยิ่งยากbetter rewards */
const DIFFS = [
  {lv:1,name:'Normal', emoji:'🟢',color:0x66d3b3,hp:1.0, dmg:1.0,  reward:1.0},
  {lv:2,name:'Hard',   emoji:'🟡',color:0xffd24d,hp:1.75,dmg:1.18, reward:1.85},
  {lv:3,name:'Hell',   emoji:'🔴',color:0xff5a6e,hp:2.8, dmg:1.38, reward:3.0},
];
// Zone Level — ตัวแปรความยากรวมของด่าน (ความคืบหน้าด่าน × ระดับความยาก) = สเกลเดียวที่ระบบอื่นอ้างอิงได้ (Bazaar stock, reward tier ฯลฯ)
// stageIndex 0..5 · diff 1..3 → Zone 1..18 (ยิ่งสูง = ยิ่งยาก/รางวัลดีขึ้น)
function stageZoneLevel(stageIndex,diff){ const maxStage=Math.max(0,STAGES.length-1),si=Math.max(0,Math.min(maxStage,Math.floor(Number(stageIndex)||0))); const d=Math.max(1,Math.min(3,Math.floor(Number(diff)||1))); return si*3+d; }
function stageCurveValue(stageIndex,curve,tail=1.18){ const i=Math.max(0,Math.floor(Number(stageIndex)||0)); if(i<curve.length)return curve[i]; return curve[curve.length-1]*Math.pow(tail,i-curve.length+1); }
function isStageReady(stageIndex){ const st=STAGES[Math.floor(Number(stageIndex))]; return !!st&&st.ready!==false; }
// Zone Modifiers — affix เสริมความยาก (สแตกได้) ปลดหลังผ่านบอสจบ Chapter 1 · ยิ่งเปิดเยอะยิ่งยาก+รางวัลดี (กฎเหล็ก)
const ZONE_MODIFIERS = [
  { id:'toughened', emoji:'🛡️', name:'Toughened',  desc:'+50% enemy HP',            hp:1.5, dmg:1.0,  reward:1.35 },
  { id:'ferocious', emoji:'😾', name:'Ferocious',  desc:'+35% enemy damage',        hp:1.0, dmg:1.35, reward:1.35 },
  { id:'swarmlord', emoji:'🐜', name:'Swarm Lord', desc:'+40% enemy HP & damage',   hp:1.4, dmg:1.4,  reward:1.60 },
  { id:'nightmare', emoji:'💀', name:'Nightmare',  desc:'+90% HP · +45% damage',    hp:1.9, dmg:1.45, reward:2.20 },
];
/* ---- Card Rarity (แบบ Death Must Die): การ์ดอัพเกรดสุ่มความหายาก → ยิ่งหายากยิ่งได้หลายเลเวลรวด ----
   สีความหายาก = สัญญาณอ่านเร็ว (เห็นทอง=เอาเลย) · ranks = จำนวนเลเวลที่ได้จากการ์ดใบเดียว */
const RARITIES = [
  // v4.25: rarity มีผลจริง — potency = ตัวคูณความแรงของค่า scalar ต่อเลเวล (ยิ่งหายาก ตัวเลขยิ่งแรงต่อใบ) · epic/legend ออกยากขึ้น
  { id:'common', name:'Common',    ranks:1, potency:1.00, color:0x9aa6b8, weight:73 },
  { id:'rare',   name:'Rare',     ranks:1, potency:1.15, color:0x5ad1ff, weight:20 },
  { id:'epic',   name:'Epic',     ranks:1, potency:1.30, color:0xc07bff, weight:5.5 },
  { id:'legend', name:'Legendary', ranks:1, potency:1.55, color:0xffcf40, weight:1.5 },
];
function rollRarity(){ return RARITIES[0]; }   // v6.55.30: การ์ดเลเวลอัพเป็นธรรมดาเสมอ (เจ้าของ: ไม่เอา rare/epic/legend)
/* ตัวคูณสเกลตอนโชว์ชีต action (idle/พุ่ง/โดนตี ฯลฯ) เฉพาะตัวที่อาร์ต action เล็กกว่าอาร์ต run — กันตัวหดตอนหยุดเดิน */
const CHAR_ACTION_SCALE = {};   // ชีตท่า/วิ่งของมิ้นต์ใหม่สัดส่วนตรงกันแล้ว ไม่ต้องคูณชดเชย
const PASSIVE_CAP = 4;       // จำกัดพรติดตัว ลด power stacking และทำให้คู่ Evolution มีความหมาย
/* ---- PASSIVES: Passiveแบบเลเวลได้ (คนละหมวดกับAttack Skill) · apply(p)=ผล 1 rank ---- */
const PASSIVES = {
  heart: { name:'Mochi Vitality', emoji:'❤️', color:0xff5f7a, max:5, desc:'+10% max HP and heals by the amount gained',
    apply(p){ const before=p.maxhp;p.maxhp*=1.10;p.hp=Math.min(p.maxhp,p.hp+(p.maxhp-before)); } },
  power: { name:'Sweet Power',   emoji:'💥', color:COLORS.grape, max:5, desc:'+7% to all damage',
    apply(p){ p.dmgMul+=(1.07)-1; } },
  swift: { name:'Slick Feet',   emoji:'👟', color:COLORS.mint, max:5, desc:'+5% move speed (capped)',
    apply(p){ p.baseSpeed=Math.min(BALANCE.moveSpeed*1.28,p.baseSpeed*1.05); } },
  magnet:{ name:'Keen Nose',     emoji:'🧲', color:COLORS.toast, max:5, desc:'+30% pickup range',
    apply(p){ p.pickup*=1.3; } },
  haste: { name:'Quick Hands',      emoji:'⏩', color:0x8fd0ff, max:5, desc:'Cast 5% more often',
    apply(p){ p.cdMul=Math.max(0.76,(p.cdMul||1)*0.95); } },
  crit:  { name:'Sharp Eye',     emoji:'🎯', color:0xffd166, max:5, desc:'+4% crit chance',
    apply(p){ p.critChance=Math.min(0.35,(p.critChance||0)+0.04); } },
  guard: { name:'Soft Armor',  emoji:'🛡️', color:0xa0e0c0, max:5, desc:'Take 8% less damage',
    apply(p){ p.dmgTakenMul=(p.dmgTakenMul||1)*0.92; } },
  regen: { name:'Flavor Regeneration', emoji:'💗', color:0xff9ec4, max:5, desc:'Regenerate 0.20% max HP per second',
    apply(p){ p.regenPct=(p.regenPct||0)+0.002; } },
  sugarOnKill:{ name:'Sugar on Kill', emoji:'🍬', color:0xffd166, max:5, desc:'Heal 1 HP on kill (0.45s cooldown)',
    apply(p){ p.lifeOnKill=(p.lifeOnKill||0)+1; } },
  bitterResolve:{ name:'Bitter Resolve', emoji:'🖤', color:0x9fa7c8, max:5, desc:'+8% damage while below 40% HP',
    apply(p){ p.lowHpDmg=(p.lowHpDmg||0)+0.08; } },
  // v4.16: ยุบการ์ดซ้ำ — flavorCore (ซ้ำ power+heart) และ returningTaste (ซ้ำ regen+haste) ถูกเอาออก
};
/* ---- 🔮 RELICS (v4.57): ของวิเศษในรัน — เปลี่ยน "กลไก" ไม่ใช่แค่ +ตัวเลข · ถือได้ RELIC_CAP ชิ้น/ด่าน (รีเซ็ตพร้อม loadout)
   ได้จาก: เลเวล 6 (การันตี) · กล่องมินิบอส · กล่องลับในแมพ 30% · hook อยู่ที่ damage/killEnemy/hurtPlayer/die/doDash (ดู relicOn*) */
const RELIC_CAP = 5;   // v6.72: Relic + Modifier + Trade-off รวมช่องเดียว (เดิม Relic 3 + Mod 3 + Trade 2)
const RELICS = {
  splinter:  { emoji:'💥', name:'Crit Splinter',  headline:'Crits shoot 2 shards', desc:'Crits splinter into 2 shards that hit nearby enemies for 40% damage' },
  leech:     { emoji:'🩸', name:'Berry Leech',    headline:'Crits heal you', desc:'Crits heal 1% max HP (0.25s cooldown)' },
  burst:     { emoji:'🎆', name:'Sugar Burst',    headline:'Kills can explode', desc:'Slain enemies have an 18% chance to explode, hurting everything nearby' },
  shell:     { emoji:'🫧', name:'Candy Shell',    headline:'Every 15 kills: a shield', desc:'Every 15 kills, or any elite/miniboss/boss kill, gain a shield that blocks the next hit' },
  jam:       { emoji:'🍓', name:'Sticky Jam',     headline:'Dash leaves sticky jam', desc:'Dashing leaves a jam puddle for 3s. Enemies inside get stuck for a moment and take 25% more damage.' },
  crown:     { emoji:'👑', name:'Crown Breaker',  headline:'Hit a boss 40 times: stun', desc:'Every 40 hits on a boss or miniboss (at most every 6s) stuns it for 0.8s and crushes it for a big hit.' },
  glass:     { emoji:'💔', name:'Cracked Crystal',    headline:'+40% damage · tougher foes', desc:'+40% damage', stage:'Monsters have 20% more HP', reward:'Gear drops roll higher rarity more often' },   /* v8.2.29 Pact */
  lastbreath:{ emoji:'🕯️', name:'Last Breath',    headline:'Survive 1 deadly hit', desc:'Once per stage, a lethal hit leaves you at 1 HP with 2s invulnerability' },
  chill:     { emoji:'❄️', name:'Cold Snap',      headline:'Every 6s: a freezing hit', desc:'Every 6s your next hit freezes the target and enemies near it for 1s (bosses and minibosses are not frozen).' },
  firstbite: { emoji:'🎯', name:'First Bite',     headline:'First hit +35%', desc:'Your first hit against each enemy deals 35% more damage.' },
  dashcharge:{ emoji:'⚡', name:'Spark Step',     headline:'After a dash: 3 strong hits', desc:'After dashing, your next 3 hits within 3s deal 25% more damage.' },
  streak:    { emoji:'🔥', name:'Kill Streak',    headline:'Kills stack damage', desc:'+3% damage per kill in your streak (max +40%).' },   // v7.9.23 จาก Instinct
  laststand: { emoji:'🛡️', name:'Last Stand',     headline:'Low HP: take less damage', desc:'Take 30% less damage while HP is below 35%.' },
  harvest:   { emoji:'🍵', name:'Mochi Harvest',  headline:'Every 20 kills: heal 5%', desc:'Every 20 enemy kills restore 5% max HP.' },
  // v8.0.89 เจ้าของ: Relic หลากหลายขึ้น · แต่ละอันเข้ากับบางสาย (for = บิลด์ที่ได้ประโยชน์ โชว์บนการ์ด)
  heavydough:{ emoji:'🥖', name:'Heavy Dough',    headline:'+30% damage, slower attacks', desc:'+30% damage, but you attack 20% slower. Great for big single hits.', for:'Sniper · Titan · Crystal Impaler', paths:['sniper','titan','pierce'] },
  sugarrush: { emoji:'🍭', name:'Sugar Rush',     headline:'Faster attacks, −15% damage', desc:'Attack 25% faster, but each hit deals 15% less. Great for many small hits.', for:'Shotgun · Barrage · Spark', paths:['shotgun','barrage','smite','brawler'] },
  frostcandy:{ emoji:'🧊', name:'Frost Candy',    headline:'+30% vs frozen', desc:'+30% damage to frozen, chilled or Brittle enemies.', for:'Mint · Cold Snap', paths:['glacier','barrage','pierce'] },
  copperwhisk:{emoji:'🔌', name:'Copper Whisk',   headline:'+30% vs shocked', desc:'+30% damage to shocked enemies (Taro shock or Static Shock).', for:'Taro Sentry · Arc · Spark', paths:['tempest','storm','smite'] },
  longspoon: { emoji:'🥄', name:'Long Spoon',     headline:'+25% to far enemies', desc:'+25% damage to enemies more than 350px away.', for:'Sniper · Arc · Sentry', paths:['sniper','storm','tempest','pierce'] },
  crowdcrush:{ emoji:'🍩', name:'Crowd Crusher',  headline:'+25% to close enemies', desc:'+25% damage to enemies within 160px.', for:'Shotgun · Brawler · Dash Boxer', paths:['shotgun','brawler','dashboxer'] },
  twinbake:  { emoji:'🧁', name:'Twin Bake',      headline:'Unique +40% and faster', desc:'Your Unique skill deals 40% more damage and recharges 15% faster.', for:'Unique-heavy builds', paths:['dashboxer','titan','glacier'] },
  /* v8.2.29 เจ้าของ (SCAMPER รอบ 3A): Pact Relics · ข้อเสียไปที่ด่าน แลกรางวัลดีขึ้น · ออกตั้งแต่ Chapter 2 (ch2) · ผลรวมใน RP_FX/rpMul */
  stormlantern:{emoji:'🏮', name:'Storm Lantern', ch2:true, headline:'+30% vs shocked · shadows', desc:'+30% damage to shocked enemies', stage:'Mirror Path and Last Light get twice the shadows and moths', reward:'Those missions give +1 currency', paths:['tempest','storm','smite'] },
  goldenappetite:{emoji:'🍯', name:'Golden Appetite', ch2:true, headline:'+30% Sugar · faster foes', desc:'+30% Sugar from monsters', stage:'Monsters move 10% faster', reward:'Golden Waves 12% instead of 5%' },
  elitebait: { emoji:'🪝', name:'Elite Bait', ch2:true, headline:'+20% vs elites · 2× elites', desc:'+20% damage to elites, minibosses and bosses', stage:'Twice as many Elites', reward:'Elites drop gear 50% more' },
  cursedcrown:{emoji:'👑', name:'Cursed Crown', ch2:true, headline:'Wave curses · missions +50%', desc:'Mission rewards +50%', stage:'Every wave starts with a random curse (swarm, elites or fast monsters)', reward:'Mission Sugar and currency +50%' },
  frostdebt: { emoji:'🧊', name:'Frost Debt', ch2:true, headline:'+20% vs frozen · big Pantry', desc:'+20% damage to frozen or chilled enemies', stage:'Frozen Pantry armies are 30% bigger', reward:'Frozen Pantry rewards ×1.5' },
  rootpact:  { emoji:'🌱', name:'Root Pact', ch2:true, headline:'+20% in roots · fast roots', desc:'+20% damage during Creeping Roots and Crown Root missions', stage:'Creeping roots grow 25% faster', reward:'Root missions give +1 currency' },
  hastyclock:{ emoji:'⏳', name:'Hasty Clock', ch2:true, headline:'−10% cooldowns · less time', desc:'Cooldowns 10% shorter', stage:'Mission waves are 15% shorter', reward:'Mission rewards +40%' },
  glassgarden:{emoji:'🪟', name:'Glass Garden', ch2:true, headline:'+25% damage · fast bullets', desc:'+25% damage', stage:'Monster bullets fly 20% faster', reward:'+1 Star Sugar when you clear the stage' },
  giantslayer:{emoji:'🗡️', name:'Giant Slayer',   headline:'+25% vs bosses and elites', desc:'+25% damage to elites, minibosses and bosses, but 10% less to normal enemies.', for:'Titan · Sniper · Impaler', paths:['titan','sniper','pierce'] },
};
// คู่ synergy — ถือครบทั้งคู่ = ผลพิเศษเพิ่ม (โชว์ในการ์ดเมื่อถืออีกครึ่งอยู่แล้ว)
/* v8.2.29 Pact Relics: ผลกับด่าน (ตัวคูณ) · id = key ของ RELICS หรือ TRADEOFFS */
const RP_FX={t_armor:{eliteRate:1.5,eliteDrop:1.5},t_rush:{foeSpd:1.15},glass:{foeHp:1.2,lootUp:.25},stormlantern:{shade:2,cur:['mirrorPath','lastLight']},goldenappetite:{foeSpd:1.1,gold:.12},elitebait:{eliteRate:2,eliteDrop:1.5},
  cursedcrown:{curse:1,msnRw:1.5},frostdebt:{pantry:1.3,rwType:{frozenPantry:1.5}},rootpact:{rootFast:1.25,cur:['creepingRoots','breakRoots']},hastyclock:{msnTime:.85,msnRw:1.4},glassgarden:{foeShot:1.2,starsugar:1}},
  RP_CURSES=[{id:'swarm',em:'🐜',name:'Swarm',fx:{spawn:1.35}},{id:'elite',em:'💀',name:'Elite Pack',fx:{eliteRate:1.6}},{id:'fast',em:'💨',name:'Fast Monsters',fx:{foeSpd:1.15}}];
const RELIC_SYNERGIES = [
  { a:'splinter', b:'burst',     name:'Chain Reaction', desc:'Splinter kills always explode' },
  { a:'shell',    b:'lastbreath',name:'Second Wind',    desc:'Last Breath restores 40% HP + a shield · hold 2 shields' },
  { a:'jam',      b:'dashcharge',name:'Sticky Rush',    desc:'Dash recharges 35% faster' },
  { a:'leech',    b:'crown',     name:'Royal Feast',    desc:'Crits on bosses heal 3× more' },
  { a:'harvest',  b:'shell',     name:'Full Belly',     desc:'Mochi Harvest heals also grant a shield' },   // v7.9.19 RR2
  { a:'chill',    b:'jam',       name:'Frozen Jam',     desc:'Enemies stuck in Sticky Jam freeze for 1s' },
  { a:'firstbite',b:'glass',     name:'Sharp Edge',     desc:'First Bite bonus doubles to +70%' },
  { a:'heavydough',b:'longspoon', name:'Deadeye',        desc:'Long Spoon bonus doubles to +50%' },   // v8.0.89
  { a:'sugarrush', b:'crowdcrush',name:'Frenzy',         desc:'Crowd Crusher bonus doubles to +50%' },
  { a:'frostcandy',b:'chill',     name:'Deep Freeze',    desc:'Frost Candy bonus doubles to +60%' },
];
/* ---- CHARACTER COMBAT PROFILES: บทบาท + Stats + อาวุธประจำตัว ---- */
// v7.9.62 จุดกลางหน้า [x/กว้าง, y/สูง, ขนาด/สูง] ใน card_<hero> สำหรับรูปโปรไฟล์ Lobby
const LOBBY_FACE={momo:[.492,.278,.273,.985],mint:[.521,.293,.273,.984],cocoa:[.521,.361,.234,.902],taro:[.449,.259,.264,.966],sesame:[.475,.278,.264,.975],yuzu:[.540,.278,.273,.98]};   // [3] = เท้า (ขอบล่างของภาพทึบ)
// Alternating spoken lines / thoughts, following the personalities in art order34.
const LOBBY_LINES={   // v7.9.94 เจ้าของ: สั้น กวน ๆ น่ารัก (ลอยเหนือหัว)
  momo:[['says','Poke me again. I dare you!'],['thinks','Cake first. Saving the world second.'],['says','Pew pew! Did you see that?'],['thinks','I tripped. It was a dance move.'],['says','Let’s go! My feet are bouncy!'],['thinks','Is it snack time yet?']],
  mint:[['says','Chill. I’ve got your back.'],['thinks','Iced tea… then heroics.'],['says','Too hot? I can fix that.'],['thinks','Don’t blush. Don’t blush.'],['says','Brr! …That was me. Sorry.'],['thinks','Five more minutes of quiet.']],
  cocoa:[['says','Cookie? I always carry two.'],['thinks','Nap first. Punch later.'],['says','Hide behind me, little one.'],['thinks','Did someone say hot cocoa?'],['says','Big hug or big punch? Pick!'],['thinks','Zzz… huh? I’m awake!']],
  taro:[['says','Zap! …Mostly on purpose.'],['thinks','Left at the rock. Or right?'],['says','My compass says: adventure!'],['thinks','Lost? No. Exploring hard.'],['says','Ooh, sparkly! Can I touch it?'],['thinks','Note: don’t zap the snacks.']],
  yuzu:[['says','Yuzlings! Look busy!'],['thinks','Command face on. No pouting.'],['says','Tiny crew, big trouble!'],['thinks','Did I count everyone? 1, 2…'],['says','Citrus squad, roll out!'],['thinks','One more orange slice. Shh.']],
  sesame:[['says','Oh! You saw me. Hi.'],['thinks','Was that my reflection again?'],['says','Shh… the mirrors are napping.'],['thinks','Hide behind the mirror. Smooth.'],['says','I polished you a safe spot.'],['thinks','One more page. Just one.']]
};
const CHARACTERS = {
  momo:{name:'Strawberry',emoji:'🍓',unique:'berryRebound',weapon:'berryBlaster',cost:0,color:0xff9ec4,role:'Nimble gunner',desc:'Sweet but Strong — rapid fire, fast movement, steady crits',stats:{hp:0,dmg:1.00,spd:1.06,def:1.00,crit:0.05,cdr:0.96,regenFlat:0.25},rating:{hp:3,atk:3,spd:4,def:3}},
  mint:{name:'Mint',emoji:'🌿',unique:'mintSanctuary',weapon:'mintNova',cost:150,color:0x8fd0ff,role:'Crowd controller',desc:'Cool and Agile — lances stack Chill (slow); 4 stacks freeze the enemy solid. Chilled bosses take more damage',stats:{hp:18,dmg:1.00,spd:1.12,def:0.90,crit:0.05,cdr:0.94,regenFlat:0.45},rating:{hp:4,atk:2,spd:5,def:4}},
  cocoa:{name:'Cocoa',emoji:'🍫',unique:'flickerStrike',weapon:'bearGauntlet',cost:400,color:0x8b5cf0,role:'Frontline bruiser',desc:'A sturdy boxer: Brawler sweeps crowds, Titan crushes marked targets, Dash Boxer strikes through movement. Toggle Flicker to warp into short punch chains and return; Dash cancels. Each path has a one-tap Unique',stats:{hp:46,dmg:1.03,spd:0.94,def:0.84,crit:0.03,cdr:1.02,regenFlat:1.2},rating:{hp:5,atk:3,spd:2,def:5}},
  taro:{name:'Taro',emoji:'🍠',unique:'pathRecall',weapon:'riftCompass',cost:250,color:0xb388ff,role:'Storm explorer',desc:'Reads paths, dodges fast, and chains lightning across targets',stats:{hp:-5,dmg:1.02,spd:1.14,def:1.04,crit:0.06,cdr:0.90,regenFlat:0.15},rating:{hp:2,atk:4,spd:5,def:2}},
  sesame:{name:'Sesame',emoji:'⚫',unique:'oathMirror',weapon:'oathMirror',cost:550,color:0x8a8f9c,role:'Rune Invoker',desc:'Mix three orbs into ten spells with separate cooldowns. Red adds damage and splash, green adds movement and attack speed, blue adds regen and echo shots. PMM empowers basic attacks; BBB grants water armor. PMB blasts in every direction. No Build paths; old talent investments remain preserved',stats:{hp:15,dmg:0.96,spd:0.96,def:0.94,crit:0.01,cdr:0.98,regenFlat:0.5},rating:{hp:4,atk:4,spd:3,def:4}},
  yuzu:{name:'Yuzu',emoji:'🍋',unique:'citrusParade',weapon:'yuzuCrew',cost:0,color:0xffd85e,role:'Companion commander',desc:'Fights beside one citrus companion. Your seeds mark a target: walk toward an enemy to aim, and your partner focuses the mark. Unique empowers your partner. Choose Pomelo, Lime or Blood Orange.',stats:{hp:12,dmg:0.98,spd:1.04,def:0.96,crit:0.03,cdr:0.98,regenFlat:0.4},rating:{hp:3,atk:4,spd:3,def:3}},
  berry:{name:'Berry Core',emoji:'💗',unique:'jamOverdrive',weapon:'jamCannon',cost:700,color:0xff5f88,role:'Mobile turret',desc:'Round but Relentless — heavy blasts and lock-on barrages that sweep crowds',stats:{hp:10,dmg:1.07,spd:0.98,def:0.96,crit:0.04,cdr:0.97,regenFlat:0.30},rating:{hp:3,atk:5,spd:3,def:3}},
};
const CHAR_ORDER=['momo','mint','cocoa','taro','yuzu','sesame'];   // Berryคอร์ถูกพักไว้ก่อน (v2.46.0) — ยังคงนิยามใน CHARACTERS กันเซฟเก่าพัง
// v7.9.22 เจ้าของ: การ์ด ⭐ Unique ระหว่างเล่น — โผล่หลังใช้ Unique ครบ 3 ครั้งในด่าน (แบบ ก) · ชั้น 1 การ์ดกลาง · ชั้น 2 Unique Mutation เลือก 1 จาก 2 ต่อสาย
const UNIQUE_CARDS=[
  {id:'uq_power',emoji:'⭐',name:'Unique Power',max:3,headline:'+20% Unique damage',desc:'Your Unique deals 20% more damage per rank.'},
  {id:'uq_cd',emoji:'⏳',name:'Quick Recharge',max:3,headline:'−10% Unique cooldown',desc:'Your Unique recharges 10% faster per rank.'},
  {id:'uq_kill',emoji:'🔋',name:'Kill Charge',max:3,headline:'Kills recharge Unique',desc:'Each kill cuts 0.1s off the Unique cooldown per rank.'},
  {id:'uq_echo',emoji:'💥',name:'Unique Echo',max:1,headline:'Unique blasts around you',desc:'Using your Unique also releases a blast around you.'},
  {id:'uq_ready',emoji:'🏃',name:'Ready Rush',max:1,headline:'Ready = faster',desc:'While your Unique is ready: +15% move and attack speed.'}];
const UNIQUE_MUTS={
  sniper:[{id:'snipe_refund',emoji:'🎯',name:'Hunter’s Rhythm',desc:'A charged shot that hits 3+ enemies refunds 35% of the Unique cooldown.'},{id:'snipe_guard',emoji:'🫧',name:'Steady Breath',desc:'A full-charge shot heals 5% max HP and gives a shield.'}],
  shotgun:[{id:'blast_stun',emoji:'💫',name:'Shell Shock',desc:'Berry Blast stuns enemies near you for 1s.'},{id:'blast_rain',emoji:'🌧️',name:'Seed Rain',desc:'0.6s after Berry Blast, 8 seeds burst out around you.'}],
  ricochet:[{id:'reb_shield',emoji:'🫧',name:'Sugar Shell',desc:'Rebound also gives you a shield (max 2).'},{id:'reb_double',emoji:'🍓',name:'Double Rebound',desc:'1s later a second Rebound fires at 50% damage.'}],
  glacier:[{id:'bloom_field',emoji:'🧊',name:'Permafrost',desc:'Glacier Bloom snow pulses build extra Chill, making repeated freezes more reliable.'},{id:'bloom_heal',emoji:'💙',name:'Cold Heart',desc:'Glacier Bloom heals 2% max HP per frozen enemy (max 16%).'}],
  pierce:[{id:'lance_mines',emoji:'❄️',name:'Glacial Wake',desc:'The lance dash leaves 3 freezing ice mines along its path.'},{id:'lance_guard',emoji:'🛡️',name:'Frost Armor',desc:'After the lance dash, take 40% less damage for 3s.'}],
  barrage:[{id:'gale_blades',emoji:'🍃',name:'Gale Blades',desc:'During Mint Gale, wind blades hit enemies around you every 0.5s.'},{id:'gale_tail',emoji:'🌬️',name:'Tailwind',desc:'Mint Gale also gives +30% attack speed.'}],
  brawler:[{id:'rocket_ring',emoji:'🚀',name:'Rocket Ring',desc:'0.8s after the Unique, 8 fire fists fly out in a ring.'},{id:'rocket_heat',emoji:'🔥',name:'Heat Up',desc:'For 4s after the Unique, every fist explodes.'}],
  titan:[{id:'rage_after',emoji:'🌋',name:'Aftershocks',desc:'Two more shockwaves follow the Colossus Fist.'},{id:'rage_guard',emoji:'🪨',name:'Unshaken',desc:'After the Colossus Fist, take 50% less damage for 3s.'}],
  dashboxer:[{id:'phantom_refund',emoji:'👻',name:'Ghost Refund',desc:'Kills during Phantom Rush cut 0.5s off the next cooldown.'},{id:'phantom_slam',emoji:'💢',name:'Final Slam',desc:'When Phantom Rush ends, a big slam hits around you.'}],
  storm:[{id:'plasma_wide',emoji:'🔵',name:'Wide Field',desc:'Plasma Field reaches 35% farther.'},{id:'plasma_twin',emoji:'🔁',name:'Twin Field',desc:'A second Plasma Field follows at 60% damage.'}],
  smite:[{id:'mark_jump',emoji:'🎯',name:'Leaping Mark',desc:'If the marked enemy dies, the mark jumps to a new target once.'},{id:'mark_nova',emoji:'💥',name:'Mark Nova',desc:'When the mark ends, it explodes in a much bigger ring.'}],
  citrusGuardian:[{id:'ripe_fest',emoji:'🎉',name:'Harvest Festival',desc:'In Sync after Meteor Peel gains 15% power. Companion forms are chosen from cards.'},{id:'ripe_shield',emoji:'🛡️',name:'Ripe Shield',desc:'Meteor Peel grants an extra 15% max-HP shield.'}],
  zestSwarm:[{id:'toss_rain',emoji:'🌧️',name:'Extended Focus',desc:'In Sync after Piercing Shot lasts 1.5s longer.'},{id:'toss_home',emoji:'🎯',name:'Seeking Arrow',desc:'The Piercing Shot arrow bends toward priority enemies.'}],
  juiceWorkshop:[{id:'grow_burst',emoji:'💥',name:'Bloom Burst',desc:'Flavor Storm bursts a 4th time.'},{id:'grow_grove',emoji:'🌳',name:'Sacred Grove',desc:'Flavor Storm also grants a 20% max-HP shield.'}],
  tempest:[{id:'over_long',emoji:'⏱️',name:'Long Overdrive',desc:'Overdrive lasts 1.5s longer.'},{id:'over_finale',emoji:'🎆',name:'Finale Burst',desc:'When Overdrive ends, every sentry fires a double-damage ring.'}]};
// v7.9.40 Sesame Mirror Network (docs/SESAME_MIRROR_NETWORK.md)
// Sesame Rune Invoker helpers: pure recipes, orb bonuses and progression.
const SES_RUNE_VFX817={ppb:['water',0],pbb:['water',1],bbb:['water',2],mbb:['water',3],ppp:['offense',0],ppm:['offense',1],mmm:['offense',2],mmb:['offense',3],pmb:['prism',0],pmm:['prism',1],flare:['prism',2],impact:['prism',3]};
const SES_RUNE_TYPES=[['p','P',0xff5547],['m','M',0x60e68b],['b','B',0x51baff]];
const SES_RUNE_RECIPES={
 ppp:{name:'Solar Cataclysm',emoji:'☄',color:0xff5547,cd:14,frame:4,life:1.45,role:'Boss'},
 mmm:{name:'Tempest Chakram',emoji:'✥',color:0x60e68b,cd:10,frame:5,life:2.5,role:'Clear'},
 bbb:{name:'Tidal Armor',emoji:'❋',color:0x51baff,cd:18,frame:11,life:6,role:'Buff'},
 ppm:{name:'Sunlance',emoji:'➶',color:0xffad4d,cd:12,frame:8,life:1.05,role:'Boss'},
 ppb:{name:'Steam Cannon',emoji:'♨',color:0xffd6a0,cd:14,frame:9,life:1.15,role:'Clear'},
 pmm:{name:'Prismatic Armament',emoji:'✧',color:0x75e9c3,cd:12,frame:10,life:6,role:'Buff'},
 mmb:{name:'Cyclone Confluence',emoji:'◎',color:0x60e68b,cd:12,frame:7,life:3.2,role:'Clear'},
 pbb:{name:'Tidal Serpent',emoji:'🐉',color:0x9bdfff,cd:12,frame:12,life:3.1,role:'Boss'},
 mbb:{name:'Mistwalk Aegis',emoji:'◈',color:0x51baff,cd:18,frame:11,life:2.6,role:'Survival'},
 pmb:{name:'Prismatic Blast',emoji:'✺',color:0xffe5b0,cd:16,frame:14,life:.85,role:'Clear'}
};
const SES_RUNE_CARDS=[
 {id:'ember',name:'Ember Crown',emoji:'🔴',max:4,desc:'Each red orb adds +2% damage per rank, on top of its base 10%. Red orbs also widen Rainbow Flare splashes. Red spells grow in number (more meteors, lances, serpents). Rank 4: Solar leaves burning ground.'},
 {id:'gale',name:'Gale Wings',emoji:'🟢',max:4,desc:'Each green orb adds +1.5% movement and +1% basic attack speed per rank, on top of its base 6% movement and 8% attack speed. Green spells grow in number (more chakrams). Rank 4: chakrams home in and loop twice.'},
 {id:'tide',name:'Living Tide',emoji:'🔵',max:4,desc:'Each blue orb adds +0.075% HP/s regen and +1% echo chance per rank, on top of base 0.25% HP/s and 12% echo chance. Echoes deal 60% damage and cannot repeat. Blue spells grow (bigger shield, longer mist). Rank 4: Tidal Armor reflects bullets.'},
 {id:'reach',name:'Orb Radiance',emoji:'◎',max:3,desc:'Your orbiting orbs widen spell areas and Rainbow Flare splashes by 10% per rank.'},
 {id:'resonance',name:'Threefold Resonance',emoji:'✦',max:3,desc:'Each distinct orb color grants 4% rune spell damage per rank.'},
 {id:'pulse',name:'Orb Reprise',emoji:'✺',max:3,desc:'Casting a spell makes the three orbs pulse around you for 18 spell power per rank in a 105px area.'},
 {id:'flow',name:'Wind Memory',emoji:'✥',max:3,desc:'Each green orb reduces the cooldown of newly cast spells by 2% per rank, up to 18%.'},
 {id:'ward',name:'Blue Mantle',emoji:'◈',max:3,desc:'Casting with blue orbs grants 5% damage reduction per blue orb per rank for 2s, up to 25%.'}
].map(c=>({...c,iconKey:'ic_ses811_'+c.id}));
/* v8.2.64 เจ้าของ: Spell Mastery · คาถาเดียวกันร่ายครบ 3/7/12/18 ครั้งในรอบ = Lv2–5 · โตที่จำนวน (multitude) ไม่ใช่ดาเมจต่อลูก */
const SES_MASTERY_AT=[3,7,12,18];
function sesMasteryLv(n){let lv=1;for(const t of SES_MASTERY_AT)if((n|0)>=t)lv++;return lv;}
/* v8.2.65 เจ้าของ: เลเวลคาถามาจากการ์ดลูกแก้ว (Ember/Gale/Tide) แทนจำนวนครั้งที่ร่าย · ผลรวมขั้นของสีในสูตร ÷ จำนวนสี · Lv4+ = ลูกเล่นใหม่ */
const SES_COLOR_CARD={p:'ember',m:'gale',b:'tide'};
function sesSpellLv(key,ranks){const cols=[...new Set(String(key||'').split(''))].filter(c=>SES_COLOR_CARD[c]);if(!cols.length)return 1;const sum=cols.reduce((a,c)=>a+((ranks||{})[SES_COLOR_CARD[c]]|0),0);return Math.min(5,1+Math.floor(sum/cols.length));}
function sesRunePush(orbs,key){return ['p','m','b'].includes(key)?[...orbs.slice(-2),key]:orbs.slice();}
function sesRuneRecipe(orbs){const key=['p','m','b'].map(k=>orbs.filter(x=>x===k).join('')).join(''),r=orbs.length===3?SES_RUNE_RECIPES[key]:null;return {key,tiers:{2:'Stronger invocations',3:'Faster spell recovery',4:'Greater elemental force'},...(r||{name:'Compose 3 runes',emoji:'?',color:0x999099,cd:8}),ready:!!r};}
function sesRuneBonuses(orbs,r={}){const n=k=>orbs.filter(x=>x===k).length,p=n('p'),m=n('m'),b=n('b'),colors=new Set(orbs).size;return {p,m,b,damage:1+p*(.10+.02*(r.ember||0)),speed:1+Math.min(.3,m*(.06+.015*(r.gale||0))),attackRate:1+Math.min(.6,m*(.08+.01*(r.gale||0))),echo:Math.min(.5,b*(.12+.01*(r.tide||0))),regen:b*(.0025+.00075*(r.tide||0)),area:1+.1*(r.reach||0),spell:1+.04*colors*(r.resonance||0),cooldown:1-Math.min(.18,m*.02*(r.flow||0)),guard:Math.min(.25,b*.05*(r.ward||0))};}
function sesRuneEnemyValid(e){return !!(e?.active&&e.hp>0&&!e.isDummy&&!e._phaseGateLocked&&!(e._phaseInvuln>0)&&Number.isFinite(e.x)&&Number.isFinite(e.y));}
function sesRuneSegmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-dx*t,y-ay-dy*t);}
/* v8.1.39 เจ้าของ: รูน 3 ปุ่มเป็นโค้งรอบ Unique ด้านในจอ (บน → เฉียง → ข้าง) ให้นิ้วโป้งเดียวกดถึง · Dash อยู่ใต้ Unique จึงไม่ชน */
function sesRuneControlLayout(w,h,k,left,u,d){const r=22*Math.min(1.4,Math.max(1,k)),D=u.radius+r+10,side=left?1:-1,angs=[-90,-135,180].map(a=>left?(a===180?0:a===-135?-45:a):a);
  let boxes=angs.map(a=>{const t=a*Math.PI/180;return {x:u.x+Math.cos(t)*D,y:u.y+Math.sin(t)*D,r};});
  boxes=boxes.map(b=>({x:Math.max(r+2,Math.min(w-r-2,b.x)),y:Math.max(r+2,Math.min(h-r-2,b.y)),r}));
  if(d)for(const b of boxes){const dx=b.x-d.x,dy=b.y-d.y,m=Math.hypot(dx,dy),need=b.r+d.radius+10;if(m<need){b.y=d.y-need;}}
  const top=Math.min(...boxes.map(b=>b.y));boxes.label={x:Math.max(100,Math.min(w-100,u.x+side*(D*.55))),y:top-r-9};return boxes;}
// End Sesame Rune Invoker helpers.


const SES_MIRROR_MAX=3, SES_MIRROR_LIFE=20, SES_MIRROR_REACH=700, SES_BOUNCE=0.15, SES_PRISM=0xc86bff;
const NAV_H=62;   // v7.9.47 ความสูงแถบเมนูล่าง
// Citrus Companions replaces Orchard Swarm; saved path/card/talent ids stay stable.
const HEROES_WIP=[];   // v8.2.53 เจ้าของ 22 พ.ย.: Sesame เสร็จแล้ว → นับใน Daily Quests / Awards / Unique mutation / Recipe notes   // v7.9.39 Yuzu เสร็จแล้ว (Orchard Swarm)   // v7.9.18 เจ้าของ: ตัวละครยังพัฒนาไม่เสร็จ → ป้าย In development · ห้ามแก้การ์ด/บาลานซ์ของตัวนี้จนกว่าเจ้าของจะเริ่มงานตัวละครนั้น
const FIGHTER_PLAYTEST_ALL=false; // ก่อนขึ้น Store เปิด roster เพื่อ QA; เซฟ chars/stageMastery ยังเก็บไว้สำหรับเงื่อนไขจริง
const CORE_UNLOCK_STAGE={mint:0,cocoa:1,taro:2,yuzu:3,sesame:4};   /* v8.1.0 Sesame: จบ C1-5 -> เล่นตั้งแต่ C2-1; Rune Invoker prototype ยัง WIP */   /* v8.0.66 เจ้าของ: ฮีโร่ทุกตัวปลดใน Chapter 1 ทีละด่าน — Mint C1-2 · Cocoa C1-3 · Taro C1-4 · Yuzu C1-5 */   /* v7.9.78 เจ้าของ: Taro C2-3 · Yuzu C3-1 · Sesame เดิมวางแผน C3-3; ถูกแทนด้วยเกณฑ์ C1-5 ใน v8.1.0 */   // v7.9.75 เจ้าของ: Mint เล่นได้ตั้งแต่ C1-3 (ผ่าน C1-2) · Cocoa ตั้งแต่ C2-1 (ผ่าน C1-5)
// v7.6.3 แนะนำฮีโร่ก่อนเข้าด่านครั้งแรก (ไม่บังคับ) · v8.0.66 idx = ด่านที่เล่นได้ครั้งแรก (C1-2…C1-5)
/* v8.1.105 เจ้าของ: จบ C1-2 แล้วเปิด Heroes เห็น Cocoa ก่อนดูฉากช่วยเพื่อน → ฮีโร่ที่มีฉากแนะนำ (HERO_INTROS) โชว์ในรายชื่อหลังเห็นฉาก/ข้อความแนะนำแล้วเท่านั้น */
function heroRevealed(id){ if(id==='momo'||(typeof FIGHTER_PLAYTEST_ALL!=='undefined'&&FIGHTER_PLAYTEST_ALL))return true; const d=(typeof Save!=='undefined'&&Save.data)||{}; if(!(d.chars||[]).includes(id))return false;
  const hi=HERO_INTROS.find(x=>x.id===id); if(!hi)return true; return !!(d[hi.flag]||(d.stageMastery||{})[hi.idx]||(typeof MC_HERO_SCENE!=='undefined'&&(d.mcSeen||{})[MC_HERO_SCENE[id]])||d.character===id); }
const HERO_INTROS=[
  {idx:1,id:'mint',flag:'mintIntro',card:'card_mint',emoji:'🌿',name:'Mint',color:'#2f7fb0',edge:0x8fd0ff,btn:0x4fb6e8,btnEdge:0xe6f7ff,stroke:'#1d4f6e',label:'❄️ Choose Mint',
    text:'I’m Mint! My frost freezes the sludge. Try me!'},
  {idx:2,id:'cocoa',flag:'cocoaIntro',card:'card_cocoa',emoji:'🐻',name:'Cocoa',color:'#8a4b22',edge:0xd9a066,btn:0xa0612f,btnEdge:0xffe2bf,stroke:'#4a2410',label:'🐻 Choose Cocoa',
    text:'I’m Cocoa! My punches smash the machines. Try me!'},
  {idx:3,id:'taro',flag:'taroIntro',card:'card_taro',emoji:'⚡',name:'Taro',color:'#6a4fc8',edge:0xb9a3ff,btn:0x7c5ce0,btnEdge:0xeee6ff,stroke:'#2e1f66',label:'⚡ Choose Taro',
    text:'I’m Taro! My lightning hits whole crowds. Try me!'},
  {idx:4,id:'yuzu',flag:'yuzuIntro',card:'card_yuzu',emoji:'🍋',name:'Yuzu',color:'#c99a12',edge:0xffe07a,btn:0xe0b52a,btnEdge:0xfff4c4,stroke:'#5c4306',label:'🍋 Choose Yuzu',
    text:'I’m Yuzu! My little Yuzling fights with me. Try me!'},
  {idx:5,id:'sesame',flag:'sesameIntro',card:'card_sesame',emoji:'🪞',name:'Sesame',color:'#58478d',edge:0xbcaaf4,btn:0x7661b5,btnEdge:0xece3ff,stroke:'#38275b',label:'🪞 Choose Sesame',text:'I’m Sesame! I mix runes into big spells. Try me!'}
];
const SIGNATURE_WEAPONS = {
  berryBlaster:{name:'Heart Seed Gun',emoji:'🍓',skill:'sprinkle',dmgMul:1.02,cdMul:1.0,shots:0,trait:'+2% damage · steady fire'},
  mintNova:{name:'Mint Frost Core',emoji:'❄️',skill:'frost',dmgMul:1.02,cdMul:0.72,areaMul:1.18,controlMul:1.18,trait:'Rapid frost lances · -28% cooldown'},
  bearGauntlet:{name:'Cocoa Bear Gauntlet',emoji:'🐻',skill:'meteor',dmgMul:1.06,cdMul:1.05,areaMul:1.15,trait:'Five landed punches build a finisher · choose speed, heavy impact or Dash combos'},
  riftCompass:{name:'Rift Lightning Compass',emoji:'🧭',skill:'thunder',dmgMul:1.02,cdMul:0.86,chains:2,trait:'+2 chain targets · -14% cooldown'},
  oathMirror:{name:'Rune Invoker Focus',emoji:'🪞',skill:'mirror',dmgMul:0.96,cdMul:0.88,areaMul:1.12,reflect:2,trait:'Orb-powered elemental attacks · +12% area'},
  yuzuCrew:{name:'Citrus Crew',emoji:'🍋',skill:'yuzling',dmgMul:1,cdMul:1,trait:'One citrus companion'},
  jamCannon:{name:'Jam Core Cannon',emoji:'💗',skill:'rocket',dmgMul:1.10,cdMul:0.92,trait:'+10% blast · -8% cooldown'},
};
// v4.62: คำอธิบาย Evolution ต่อสกิล (ใช้ทั้งการ์ดเลเวลอัพและ Codex)
const YUZU_CARD_ICONS={"starter":"yc59_starter","power":"yc59_power","rate":"yc59_rate","family":"yc59_family","seedling":"ic_yz_seedling","splash":"yc59_splash","loyal":"yc59_loyal","p_heavyPeel":"yc59_p_heavyPeel","p_bodyguard":"yc59_p_bodyguard","y_fastripe":"yc59_y_fastripe","y_keepripe":"yc59_y_keepripe","y_giantslam":"yc59_y_giantslam","p_pulp":"yc59_p_pulp","p_feast":"yc59_p_feast","y_strongarm":"yc59_y_strongarm","y_bigsplat":"yc59_y_bigsplat","y_double":"yc59_y_double","p_sourMixer":"yc59_p_sourMixer","p_sweetHelper":"yc59_p_sweetHelper","y_seedluck":"yc59_y_seedluck","y_longroot":"yc59_y_longroot","y_elder":"yc59_y_elder","ripe_fest":"yc59_ripe_fest","ripe_shield":"yc59_ripe_shield","toss_rain":"yc59_toss_rain","toss_home":"yc59_toss_home","grow_burst":"yc59_grow_burst","grow_grove":"yc59_grow_grove","m_zest":"yc59_m_zest","m_crew":"yc59_m_crew","m_rally":"yc59_m_rally","m_sour":"yc59_m_sour","m_splash":"yc59_m_splash","m_bite":"yc59_m_bite","f_harvest":"yc59_f_harvest","f_parade":"yc59_f_parade","parting":"yc59_mut_parting","pack":"yc59_mut_pack","second":"yc59_mut_second","hardy":"yc59_mut_hardy","citrusGuardian":"ic_path_citrusGuardian","zestSwarm":"ic_path_zestSwarm","juiceWorkshop":"ic_path_juiceWorkshop"};
function yuzuCardArt(path,key){const kind=({citrusGuardian:'pomelo',zestSwarm:'lime',juiceWorkshop:'bloodorange'})[path];return (key==='evolution'||key==='companion_form')&&kind?'yc59_evo_'+kind:key==='uq_power'&&kind?'yc59_unique_'+kind:YUZU_CARD_ICONS[key]||null;}
const YUZU_EVOLUTIONS={
  citrusGuardian:{name:'Pomelo Colossus',desc:'Pulp Slam gains 25% power and a wider aftershock. Recruits 1 Minion and unlocks every Pomelo skill.'},
  zestSwarm:{name:'Lime Windranger',desc:'Lime gains twin arrows in Form 1; evolved forms gain 20% arrow power and more piercing. Recruits 1 Minion and unlocks every Lime skill.'},
  juiceWorkshop:{name:'Blood Orange Archwitch',desc:'Flavor spells recharge 20% sooner and ground Sigils hit harder. Recruits 1 Minion and unlocks every Blood Orange spell.'}};
// v8.0.97: Companion forms are chosen from level-up cards; existing order63 art is retained.
const YUZU_FORMS={pomelo:['Pomelo Pip','Pomelo Knight','Pomelo Titan'],lime:['Lime Sprout','Lime Archer','Lime Skyhunter'],bloodorange:['Blood Orange Seedling','Blood Orange Mage','Blood Orange Archmage'],yuzling:['Yuzling','Yuzling','Yuzling']},YUZU_FORM_KILLS=[14,32];
const YUZU_UNIQUES={
  citrusGuardian:{name:'Meteor Peel',emoji:'🛡️',cd:13,color:0xffd77b,desc:'Hold to aim, release: Yuzu fires a marking seed (80% power) as Pomelo leaps to the spot and slams it (600% power, stuns small enemies), then 2 aftershock waves shake the ground. Then 4s In Sync: shield, wider sweeps, 🎯 bonus +50%.',tiers:{2:'Stronger slam and shield',3:'Stronger slam and shield',4:'Strongest slam and shield'}},
  zestSwarm:{name:'Piercing Shot',emoji:'🏹',cd:13,color:0xafe57a,desc:'Hold to aim, release: Yuzu fires a marking seed (80% power) as Lime fires a fan of 3 light arrows through every enemy in the line (500% center, 300% sides) and 🎯 marks the first big enemy for 6s. Then 4s In Sync: piercing bursts, 🎯 bonus +50%.',tiers:{2:'Stronger arrow and bursts',3:'Stronger arrow and bursts',4:'Strongest arrow and bursts'}},
  juiceWorkshop:{name:'Flavor Storm',emoji:'🔮',cd:13,color:0xdf87a7,desc:'Hold to aim, release: Yuzu fires a marking seed (80% power) as a big Sigil pulls small enemies in and bursts 3 times (220% power), the last burst is huge (530%). Then 4s In Sync: shield, stronger spells, 🎯 bonus +50%.',tiers:{2:'Stronger storm and shield',3:'Stronger storm and shield',4:'Strongest storm and shield'}}};
const BASIC_EVO_DESC={yuzling:'Enhance the whole Build and recruit 1 Minion. Companion forms are selected from separate evolution cards.',sprinkle:'Seeds fly straight and fast, piercing everything (no homing)',thunder:'Evolves the chosen Taro path: longer chains, stronger priority strikes or wider movement nova',frost:'Evolves your selected path: Hailstorm Arsenal, Absolute Zero or Heaven Piercer; earlier upgrades remain active',meteor:'Evolves the chosen Chocolate path: Overdrive flurry, Colossus aftershock or a Phantom follow-up',mirror:'An extra mirror beam + longer, wider, harder-hitting shots',rocket:'Bigger blasts and a denser lock-on barrage'};
const MINT_EVOLUTIONS={
  barrage:{name:'Hailstorm Arsenal',desc:'Every 4s, queue 6 compact lances at 70% power, 90ms apart. Normal volley stays capped at 2; excess lances still strengthen shards.'},
  glacier:{name:'Absolute Zero',desc:'Opening Shatter radius +65%; chain gains 1 step (max 3). Still at most 6 bursts per reaction; shard investment strengthens the frost bloom.'},
  pierce:{name:'Heaven Piercer',desc:'Every third full throw gains +35% lance power, 8 normal targets pierced and +35% Rupture power. Partial shots do not advance the cycle.'}
};
const BERRY_EVOLUTIONS={
  sniper:{name:'Heart Railgun',desc:'Full Basic charges gain +30% power and pierce 10 targets. Full-charge manual Unique beam gains +40% damage. Extra seeds still convert to power.'},
  shotgun:{name:'Petal Breacher',desc:'Basic pellets gain +35% power, +20% damage within 120px, and a heavy center pellet. +2 pellets; overflow above 12 converts to power. No automatic piercing.'},
  ricochet:{name:'Heart Pinball',desc:'Basic seeds gain +2 bounces, up to 8; last impact splashes ordinary enemies at 25% power. Each seed splashes a target once; bosses take direct hits, with a bounded return only when hit first and isolated.'}
};
function berryUpgradeGroup(path,id){
  if(!path)return 'shared';
  if(id==='rate')return path==='ricochet'?'path':null;
  if(id==='volley')return 'path';
  if(id==='size')return path==='shotgun'?'path':'shared';
  if(['power','inf_deep'].includes(id))return 'shared';
  return BASIC_PATHS.momo.find(p=>p.id===path)?.upgrades.some(u=>u.id===id)?'path':null;
}
function berryShotProfile(lvl,aw,b,p={}){
  let raw=(aw?6:lvl>=5?3:lvl>=3?2:1)+(b.ranks.volley||0)+(b.mutation==='fan'?2:0)+(b.evolved?2:0)+(p.twinSprinkle?3:0)+(p.gearCount||0)+(p.weaponShots||0);
  if(b.path==='sniper')return {count:1,power:1+.12*Math.max(0,raw-1)};
  if(b.path==='shotgun')raw+=5+(b.lv.buckshot||0)+(p._pt?.shell||0);
  const cap=b.path==='shotgun'?12:8;
  return {count:Math.min(cap,raw),power:1+.08*Math.max(0,raw-cap)};
}
function berryCardHeadline(b,id,lvl,player){
  const r=b.ranks||{},v=b.lv||{},pct=n=>Math.round(n*100)+'%';
  if(id==='power')return 'Basic power '+pct(1+.12*(r.power||0))+' → '+pct(1+.12*((r.power||0)+1));
  if(id==='rate')return 'Basic interval '+pct(.92**(r.rate||0))+' → '+pct(.92**((r.rate||0)+1));
  if(id==='size')return b.path==='sniper'?'Heavy Seed pierce +'+(v.size||0)+' → +'+((v.size||0)+1):'Extra seed chance '+15*(v.size||0)+'% → '+15*((v.size||0)+1)+'%';
  if(id==='s_draw')return 'Basic charge '+(340+60*(v.s_draw||0))+' → '+(400+60*(v.s_draw||0))+'ms';
  if(id==='volley'||id==='buckshot'){
    const before=berryShotProfile(lvl,false,b,player),next={...b,ranks:{...r,[id]:(r[id]||0)+1},lv:{...v,[id]:(v[id]||0)+1}},after=berryShotProfile(lvl,false,next,player);
    return before.count===after.count?'Base volley power '+pct(before.power)+' → '+pct(after.power):'Basic seeds '+before.count+' → '+after.count;
  }
  return null;
}
function berryAttackInfo(d,b){
  const path=b?.path,e=BERRY_EVOLUTIONS[path];if(!e)return d;
  return {...d,evolution:e.name,evolutionDesc:e.desc,upgrades:d.upgrades.map(u=>{
    if(u.id==='rate')return {...u,headline:'Basic interval −8%',desc:'Basic Attack fires 8% sooner per rank on every build (offered again only on Ricochet). Does not shorten manual Unique charge.'};
    if(u.id==='volley')return {...u,name:path==='sniper'?'Dense Chamber':u.name,headline:path==='sniper'?'+12% Heavy Seed power':'+1 Basic seed / overflow power',desc:path==='sniper'?'+12% base Heavy Seed power per rank; remains one shot, including after Evolution.':'+1 Basic seed per rank. Cap '+(path==='shotgun'?12:8)+'; each excess seed adds +8% base volley power.'};
    if(u.id==='size')return path==='sniper'?{...u,headline:'+1 Heavy Seed pierce',desc:'Sniper fires one seed, so Twin Seed lets the Heavy Seed pierce 1 more enemy per rank instead.'}:{...u,headline:'15% chance per rank: +1 seed',desc:'Each volley has a 15% chance per rank to fire 1 extra seed (also above the seed cap).'};
    return u;
  }),mutations:d.mutations.map(m=>path==='shotgun'&&m.id==='fan'?{...m,desc:'+2 pellets per blast (the Shotgun spread stays the same); past 12 pellets each extra adds +8% power.'}:path==='sniper'?{...m,name:m.id==='fan'?'Focused Chamber':'Fracture Seed',desc:m.id==='fan'?'+2 planned seeds convert to +24% base Heavy Seed power; no spread.':'+2 Heavy Seed penetrations; preserves Sniper precision instead of bouncing.'}:m)};
}
/* ---- BASIC ATTACK PROTOTYPE: ตัวละครเป็นแกน build แทนการสะสม auto-skill หลายชนิด ---- */
const BASIC_ATTACKS = {
  yuzu:{name:'Citrus Companions',emoji:'🍋',skill:'yuzling',color:0xffd85e,evolution:'Best Friends Forever',upgrades:[
    {id:'power',iconKey:'yc59_power',name:'Juicy Bite',emoji:'🍋',max:5,headline:"+12% seeds and companion power",desc:'Companion, Minion and Yuzu seed hits gain 12% base power per rank.'},
    {id:'rate',iconKey:'yc59_rate',name:'Quick Feet',emoji:'👟',max:5,headline:"Attacks and skills recharge sooner",desc:'Companion attacks, skills, Minions and Yuzu seeds recharge 8% sooner per rank.'},
    {id:'family',iconKey:'yc59_family',name:'Best Friends',emoji:'💛',max:3,headline:"+8% companion hits, +15% shields",desc:'Companion and Minion hits deal 8% more and Yuzu shields are 15% stronger per rank.'},
    {id:'splash',iconKey:'yc59_splash',name:'Zest Splash',emoji:'💦',max:3,headline:"Wider companion attacks",desc:"Pomelo sweeps reach farther, Lime arrows splash nearby foes, and Blood Orange ground Sigils cover a wider area."},
    {id:'loyal',iconKey:'yc59_loyal',name:'Loyal Guard',emoji:'🛡️',max:3,headline:"Damage reduction near your partner",desc:'Take 6% less damage per rank while within 170px of your active companion.'},
    {id:'seedling',iconKey:'ic_yz_seedling',name:'Minion Squad',emoji:'🌱',max:5,headline:"Recruit +1 immortal Minion",desc:'Recruit 1 immortal Minion per rank. Fighters, archers or elemental mages follow your Companion. Companion forms and Build Evolution add more. Cap 10.'}],
    mutations:[{id:'parting',iconKey:'yc59_mut_parting',name:'Citrus Footprints',emoji:'💥',desc:'Dashing leaves a short-lived sour patch behind your companion.'},
      {id:'pack',iconKey:'yc59_mut_pack',name:'Side by Side',emoji:'💛',desc:'Your companion hits 20% harder while within 200px of Yuzu.'},
      {id:'second',iconKey:'yc59_mut_second',name:'Second Serving',emoji:'♻️',desc:'Every fourth companion hit deals 50% more damage.'},
      {id:'hardy',iconKey:'yc59_mut_hardy',name:'Hardy Peel',emoji:'🥝',desc:'Using Unique grants an extra shield equal to 12% of Yuzu max HP.'}]},
  momo:{name:'Heart Seed Blaster',emoji:'🍓',skill:'sprinkle',color:0xff76a8,evolution:'Heartstorm Blaster',
    upgrades:[
      {id:'power',name:'Dense Seeds',emoji:'💥',iconKey:'ic_momo_power',max:5,headline:'+12% Basic hit (multiplies)',desc:'+12% Basic Attack damage per rank. Multiplies with your “+% damage” total.'},
      {id:'rate',name:'Mochi Trigger',emoji:'⏩',iconKey:'ic_momo_rate',max:5,headline:'+8% attack speed',desc:'Basic Attack fires 8% sooner per rank (the manual Unique charge is not affected).'},
      {id:'size',name:'Twin Seed',emoji:'🍓',iconKey:'ic_momo_size',max:3,headline:'15% chance per rank: +1 seed',desc:'Each volley has a 15% chance per rank to fire 1 extra seed.'},
      {id:'volley',name:'Sweet Branching',emoji:'🌱',iconKey:'ic_momo_volley',max:3,headline:'+1 seed',desc:'+1 seed per shot per rank. Sniper: the heavy seed gets 12% stronger instead. Once you have the most seeds, extra ranks add +8% damage.'}],
    mutations:[
      {id:'ricochet',name:'Heart Ricochet',emoji:'💞',headline:'Seeds bounce twice',desc:'Seeds bounce to 2 new targets'},
      {id:'fan',name:'Petal Spread',emoji:'🌸',headline:'Wider fan, +2 shots',desc:'Wider fan and +2 shots'}]},
  cocoa:{name:'Bear Core Combo',emoji:'🐻',skill:'meteor',color:0x8b5cf0,evolution:'Chocolate Path Evolution',
    upgrades:[
      {id:'power',name:'Heavy Cocoa Punch',emoji:'💥',iconKey:'ic_cocoa_power',max:5,headline:'+12% Basic hit (multiplies)',desc:'+12% Basic Attack damage per rank. Multiplies with your “+% damage” total.'},
      {id:'rate',name:'Fighter Rhythm',emoji:'⏩',iconKey:'ic_cocoa_rate',max:5,headline:'+8% attack speed',desc:'+8% attack speed per rank'},
      {id:'size',name:'Mochi Reach',emoji:'🥊',iconKey:'ic_cocoa_size',max:3,headline:'+12% punch reach',desc:'Punches reach 12% farther and hit a wider area per rank.'},
      {id:'combo',name:'Knockout Force',emoji:'🐻',iconKey:'ic_cocoa_combo',max:3,headline:'+18% finisher',desc:'Your 5th combo punch (the finisher) hits 18% harder per rank.'},
      {id:'dashp',name:'Dash Stack',emoji:'🐾',max:3,headline:'+1 Dash charge',desc:'+1 stored Dash charge per rank.'},
      {id:'drum',name:'Drum Heart',emoji:'🥁',max:3,headline:'Hits refund Unique',desc:'Landing punches and getting hit recharge your Unique 15% more per rank.'}],
    mutations:[
      {id:'rush',name:'Rushdown',emoji:'💨',headline:'Extra finisher punches',desc:'Finishers add 2 quick extra punches and your next combo starts 18% sooner. Titan: every pound makes a small tremor wave.'},
      {id:'breaker',name:'Earthbreaker',emoji:'💢',headline:'Finisher aftershock',desc:'Finishers hit 25% harder and cause an aftershock. Fire Fist: bigger fireball blast. Titan: pounds 12% stronger with an aftershock.'},
      {id:'counter',name:'Counter Bear',emoji:'🔁',headline:'Dash guard',desc:'Dash recharges 40% faster, and you take 30% less damage right after dashing.'}]},
  berry:{name:'Jam Cannon',emoji:'💗',skill:'rocket',color:0xff5f88,evolution:'Jam Supernova',
    upgrades:[
      {id:'power',name:'Jam Pressure',emoji:'💥',iconKey:'ic_berry_power',max:5,headline:'+12% Basic hit (multiplies)',desc:'+12% Basic Attack damage per rank. Multiplies with your “+% damage” total.'},
      {id:'rate',name:'Sweet Slide',emoji:'⏩',iconKey:'ic_berry_rate',max:5,desc:'+8% fire rate per rank'},
      {id:'size',name:'Plump Warhead',emoji:'🔴',iconKey:'ic_berry_size',max:3,desc:'+14% rocket & blast size per rank'},
      {id:'cluster',name:'Twin Jam Chamber',emoji:'💗',iconKey:'ic_berry_cluster',max:3,desc:'+1 rocket per volley per rank'}],
    mutations:[
      {id:'seeker',name:'Core Seeker',emoji:'🎯',desc:'Faster lock-on and +20% blast'},
      {id:'sticky',name:'Sticky Jam',emoji:'🫙',desc:'+35% blast radius and briefly pins enemies'}]},
  mint:{name:'Frost Lance',emoji:'🧊',skill:'frost',color:0x8fd0ff,evolution:'Glacier Sovereign',
    upgrades:[
      {id:'power',name:'Frost Lance Edge',emoji:'🗡️',iconKey:'ic_mint_power',max:5,headline:'+12% Lance hit (multiplies)',desc:'Frost Lance and its shatter deal 12% more damage per rank. Multiplies with your “+% damage” total.'},
      {id:'rate',name:'Swift Ice Draw',emoji:'⏩',iconKey:'ic_mint_rate',max:5,headline:'+7% attack speed',desc:'Fire Frost Lance 7% sooner per rank.'},
      {id:'rime',name:'Rime Mark',emoji:'🎯',iconKey:'ic_mint_chill',max:3,headline:'+10% DMG to Chilled',desc:'Your hits deal 10% more damage to Chilled enemies per rank, including bosses.'},
      {id:'chill',name:'Frost Reach',emoji:'❄️',iconKey:'ic_mint_chill',max:3,headline:'+10% Lance range',desc:'Frost Lance flies 10% farther per rank.'},
      {id:'linger',name:'Shard Bloom',emoji:'💠',iconKey:'ic_mint_linger',max:3,headline:'+1 Shard',desc:'Barrage: +1 ice shard per burst per rank (max 6); past the max it adds damage. Glacier: the frost splash gets stronger instead.'}],
    mutations:[
      {id:'blizzard',name:'Shatter Lance',emoji:'🌨️',headline:'Impact bursts nearby foes',desc:'Lances burst on impact and hit enemies nearby (Impaler 25%, other builds 50% damage). Barrage and Glacier also deal 25% more to frozen enemies.'},
      {id:'permafrost',name:'Eternal Frost',emoji:'🥶',headline:'Freeze at 3 Chill stacks',desc:'Normal enemies freeze after 3 Chill stacks instead of 4, freezes last longer and lances deal 15% more. Glacier: bosses turn Brittle instead.'}]},
  taro:{name:'Rift Bolt Compass',emoji:'⚡',skill:'thunder',color:0xb388ff,evolution:'Stormstep Sovereign',
    upgrades:[
      {id:'power',name:'Dense Charge',emoji:'💥',iconKey:'ic_taro_power',max:5,headline:'+12% Basic hit (multiplies)',desc:'+12% Basic Attack damage per rank. Multiplies with your “+% damage” total.'},
      {id:'rate',name:'Lightning Rhythm',emoji:'⏩',iconKey:'ic_taro_rate',max:5,headline:'+8% attack speed',desc:'+8% attack speed per rank'},
      {id:'arc',name:'Chain Bolt',emoji:'🔗',iconKey:'ic_taro_arc',max:3,headline:'+1 chain target',desc:'+1 chain target per rank'},
      {id:'surge',name:'Twin Bolt',emoji:'⚡',iconKey:'ic_taro_surge',max:3,headline:'+1 strike',desc:'+1 simultaneous strike per rank'}],
    mutations:[
      {id:'chainlord',name:'Chainlord',emoji:'⛓️',headline:'+2 chains, longer reach',desc:'+2 chains and +40% chain range'},
      {id:'stormcaller',name:'Stormcaller',emoji:'🌩️',headline:'+2 strikes, +20% damage',desc:'+2 simultaneous strikes and +20% damage'}]},
  sesame:{name:'Mirror Beam',emoji:'🪞',skill:'mirror',color:0x8a8f9c,evolution:'Absolute Oath Mirror',
    upgrades:[
      {id:'power',name:'Strong Oath',emoji:'💥',iconKey:'ic_sesame_power',max:5,headline:'+12% Beam hit (multiplies)',desc:'+12% beam damage per rank. Multiplies with your “+% damage” total.'},
      {id:'rate',name:'Fast Mirror Pulse',emoji:'⏩',iconKey:'ic_sesame_rate',max:5,desc:'+8% fire rate per rank'},
      {id:'pane',name:'Extra Pane',emoji:'🪟',iconKey:'ic_sesame_pane',max:3,desc:'+1 beam & wider per rank'},
      {id:'radius',name:'Long Beam',emoji:'🛡️',iconKey:'ic_sesame_radius',max:3,desc:'+12% beam length per rank'}],
    mutations:[
      {id:'fortress',name:'Mirror Fortress',emoji:'🏰',desc:'+25% beam width'},
      {id:'retaliate',name:'Retaliation',emoji:'💢',desc:'+25% beam damage'}]},
};
// Taro T5: presentation reads the selected path; saved upgrade identities stay unchanged.
const TARO_PROGRESSION={
  storm:{arc:['Arc Links','+1 Arc jump','+1 jump per rank (max 10). Past the max, Arcs deal +3% damage per rank.'],surge:['Arc Streams','+1 Arc at once','+1 Arc that fires at the same time (max 3). Past the max, Arcs deal +5% damage per rank.'],
    chainlord:'+2 jumps, and jumps reach 40% farther.',stormcaller:'+2 Arcs at once and +20% damage.',
    evolution:'+20% damage, +3 jumps, +2 Arcs at once, and jumps reach 50% farther.'},
  smite:{arc:['High Voltage','Sparks reach 15% farther','Sparks find enemies 15% farther and fly 15% longer per rank.'],surge:['Extra Sparks','+1 Spark','+1 Spark per cast (max 10). Past the max, Sparks deal +4% damage per rank.'],chainlord:'+20% Spark damage, and Sparks find enemies from 40% farther.',stormcaller:'+2 Sparks and +20% Spark damage.',evolution:'+50% Spark damage, +2 Sparks, and Sparks find enemies from 50% farther.'},
  tempest:{arc:['Reserve Cell','Sentries fire 10% faster','Sentries fire Ball Lightning 10% faster per rank (max +60%).'],surge:['Extra Sentry','+1 sentry','+1 sentry on the field per rank (max 3). Ball Lightning also zaps a bit wider.'],chainlord:'Sentries fire 20% faster.',stormcaller:'+1 sentry, +20% sentry damage and bigger Ball Lightning.',evolution:'+1 sentry, +20% sentry damage, sentries fire 30% faster, and bigger Ball Lightning.'}
};
function taroAttackInfo(d,b){if(!d)return d;
  if(!b?.path)return {...d,name:'Static Arc',upgrades:d.upgrades.map(u=>{
    const info={power:['Arc Power','+12% Arc hit (multiplies)','Static Arc gains +12% damage per rank. Multiplies with your “+% damage” total.'],rate:['Quick Arc','+8% attack speed','Cast Static Arc 8% sooner per rank.'],arc:['Arc Reach','+1 Arc jump','+1 jump per rank (max +3) and 10% more reach. After you pick a build, it powers up that build instead.'],surge:['Extra Arcs','+1 Arc at once','+1 Arc that fires at the same time (max 3); past the max, +5% damage. After you pick a build, it powers up that build instead.']}[u.id];return info?{...u,name:info[0],headline:info[1],desc:info[2],...(u.id==='arc'?{iconKey:'ic_path_p_farstrike'}:{})}:u;
  }),mutations:d.mutations.map(m=>({...m,headline:undefined,desc:m.id==='chainlord'?'+2 Arc jumps and 40% more reach.':'+2 Arcs at once and +20% damage.'})),evolutionDesc:'+20% Arc damage, +3 jumps, +2 Arcs at once and 50% more reach.'};
  const path=TARO_PROGRESSION[b.path];if(!path)return d;
  return {...d,name:({storm:'Arc Compass',smite:'Spark Compass',tempest:'Storm Sentry'})[b.path],evolutionDesc:path.evolution,upgrades:d.upgrades.map(u=>{
    if(path[u.id]){const [name,headline,desc]=path[u.id],ik=b.path==='tempest'?{arc:'ic_taro_reserve_cell',surge:'ic_taro_wide_conductor'}[u.id]:b.path==='smite'?{arc:'ic_taro_piercing_current'}[u.id]:null;return {...u,name,headline,desc,...(ik?{iconKey:ik}:{})};}
    if(u.id==='power')return {...u,headline:'+12% Basic hit (multiplies)',desc:'+12% Basic hit damage per rank; multiplies with your “+% damage” total; strengthens this path’s basic and secondary effects, not Unique.'};
    if(u.id==='rate')return {...u,headline:b.path==='tempest'?'+8% sentry fire rate':'+8% attack speed',desc:b.path==='tempest'?'Sentries fire their orbs 8% sooner per rank. Does not shorten Dash or Beacon timers.':'Basic attacks fire 8% sooner per rank. Does not shorten Dash or Beacon timers.'};return u;
  }),mutations:d.mutations.map(m=>({...m,headline:undefined,desc:path[m.id]||m.desc}))};}
function taroGaleCooldown(b){return Math.pow(.94,Math.max(0,Math.min(3*1.55,b?.ranks?.p_gale??b?.lv?.p_gale??0)));}

// v8.0.97: Yuzu -> Companion -> immortal role Minions; card-selected forms and capped recruitment.
const YZ_SEED_COUNT=[0,1,2,3,4,5],YZ_SEED_EVO=1,YZ_SEED_REGROW=0,YZ_SEED_SIZE=30,YZ_MINION_CAP=10;
const YZ_SEED_KIND={none:{t:'bite',role:'fighter',hp:1,mul:.12,cd:1,color:0xfff2b0},citrusGuardian:{t:'tank',role:'fighter',hp:1,mul:.13,cd:.95,color:0xffd173},zestSwarm:{t:'throw',role:'archer',hp:1,mul:.12,cd:1,color:0x9bd65e},juiceWorkshop:{t:'pop',role:'mage',hp:1,mul:.12,cd:1.05,color:0xef895d}};
const YZ_SEED_DESC={none:'One immortal Minion follows Yuzu before a Build.',citrusGuardian:'Pomelo leads punching fighter Minions.',zestSwarm:'Lime leads bow-wielding archer Minions.',juiceWorkshop:'Blood Orange leads fire, frost and lightning mage Minions.'};
// 🛤 Build Path (v4.94) — เลเวล 5 เลือก 1 ใน 3 สาย · ปิดอีก 2 สาย · สายเปลี่ยน "รูปแบบ" ดาเมจ ไม่ได้บวกเพิ่มรวม
const BASIC_PATHS={
  yuzu:[{"id":"zestSwarm","iconKey":"ic_path_zestSwarm","name":"Lime","emoji":"🏹","base":{"dmg":1},"desc":"Lime starts with seed arrows and piercing Zest Volley. Path cards unlock Sour Trap, Vaulting Shot and Pin & Pierce.","upgrades":[{"id":"p_pulp","name":"Swift Ranger","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Vaulting Shot","desc":"First rank unlocks Vaulting Shot: an arcing arrow over the front line. Per rank: Lime moves 10% faster; Volley gains +0.10, Vaulting Shot +0.12 and Pin & Pierce +0.15 companion power.","iconKey":"yc59_p_pulp"},{"id":"p_feast","name":"Quick Draw","emoji":"✦","max":3,"fx":{},"headline":"Kills speed up the next arrow","desc":"Lime kills cut its basic attack cooldown by 0.3s per rank.","iconKey":"yc59_p_feast"},{"id":"y_strongarm","name":"Ready Quiver","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Pin & Pierce","desc":"First rank unlocks Pin & Pierce: mark a priority enemy, then a long piercing line shot. Lime skills recharge 10% sooner per rank.","iconKey":"yc59_y_strongarm"},{"id":"y_bigsplat","name":"Sour Snare","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Sour Trap","desc":"First rank unlocks Sour Trap: Lime drops a rooting trap where it stands. Per rank: the trap gains 15px radius, 0.25s root and +0.30 companion power.","iconKey":"yc59_y_bigsplat"},{"id":"y_double","name":"Wide Volley","emoji":"✦","max":2,"fx":{},"headline":"+2 Zest Volley arrows","desc":"Zest Volley fires 2 more arrows per rank.","iconKey":"yc59_y_double"}],"headline":"Piercing arrows, vaults and priority shots"},{"id":"citrusGuardian","iconKey":"ic_path_citrusGuardian","name":"Pomelo","emoji":"🍊","base":{"dmg":1.2},"desc":"Pomelo starts with a three-hit Peel Combo and Pulp Slam. Wide Slam unlocks Rind Breaker; the Titan Companion form unlocks Rolling Pomelo.","upgrades":[{"id":"p_heavyPeel","name":"Pulp Power","emoji":"✦","max":3,"fx":{},"headline":"+15% Slam / +10% sweeps","desc":"Pulp Slam gains 15% power and sweeps gain 10% power per rank.","iconKey":"yc59_p_heavyPeel"},{"id":"p_bodyguard","name":"Close Guard","emoji":"✦","max":3,"fx":{},"headline":"Pulp Slam shields Yuzu","desc":"Each Pulp Slam gives Yuzu a shield worth 4% max HP per rank for 3s.","iconKey":"yc59_p_bodyguard"},{"id":"y_fastripe","name":"Sun Kissed","emoji":"✦","max":3,"fx":{},"headline":"Faster Companion attacks and skills","desc":"Pomelo attacks and skills recharge 6% sooner per rank. Companion evolution is chosen from level-up cards.","iconKey":"yc59_y_fastripe"},{"id":"y_keepripe","name":"Golden Finish","emoji":"✦","max":3,"fx":{},"headline":"+20% third sweep","desc":"The third sweep of each Pomelo combo hits 20% harder per rank.","iconKey":"yc59_y_keepripe"},{"id":"y_giantslam","name":"Wide Slam","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Rind Breaker","desc":"First rank unlocks Rind Breaker: a forward ground wave. Pulp Slam radius grows 20% per rank.","iconKey":"yc59_y_giantslam"}],"headline":"Peel Combo, ground breaks and rolling slams"},{"id":"juiceWorkshop","iconKey":"ic_path_juiceWorkshop","name":"Blood Orange","emoji":"🔮","base":{"dmg":1},"desc":"Blood Orange starts with ground Flavor Sigils and Crimson Comet. Path cards unlock Sour Garden, Spicy Bloom and Honey Rescue.","upgrades":[{"id":"p_sourMixer","name":"Acid Notes","emoji":"✦","max":3,"fx":{},"headline":"Stronger Comet and Sour","desc":"Per rank: +0.25 Comet power, +0.02 Sour tick power, +2 points mark vulnerability and +4 points patch vulnerability.","iconKey":"yc59_p_sourMixer"},{"id":"p_sweetHelper","name":"Spell Rhythm","emoji":"✦","max":3,"fx":{},"headline":"All flavor spells recharge sooner","desc":"Flavor spells recharge 10% sooner per rank.","iconKey":"yc59_p_sweetHelper"},{"id":"y_seedluck","name":"Honey Alchemy","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Honey Rescue","desc":"First rank unlocks Honey Rescue: heal and shield Yuzu below 70% HP. Per rank: heals 1% more max HP and shields 2% more.","iconKey":"yc59_y_seedluck"},{"id":"y_longroot","name":"Steeped Flavor","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Sour Garden","desc":"First rank unlocks Sour Garden: three Sour patches that make enemies take more damage. Patches last 1s longer per rank.","iconKey":"yc59_y_longroot"},{"id":"y_elder","name":"Bloom Reach","emoji":"✦","max":3,"fx":{},"headline":"Unlocks Spicy Bloom","desc":"First rank unlocks Spicy Bloom: three burning petal rings. Per rank: Aroma grows 30px, Sigils 5px, Comet 10px and Garden 8px.","iconKey":"yc59_y_elder"}],"headline":"Ground Sigils and grand flavor spells"}],
  momo:[
    {id:'sniper',iconKey:'ic_path_sniper',name:'Sniper Build',emoji:'🎯',desc:'Fire one big charged seed instead of many small ones. It charges by itself and hits ×3.84 as hard. A full charge goes through enemies. Dashing or getting hit fires it early, weaker.',
      upgrades:[{id:'headshot',iconKey:'ic_path_headshot',name:'Headshot',emoji:'🎯',max:3,headline:'Chance for ×2.5 hit',desc:'+7% chance per rank for a seed to deal ×2.5 damage'},
                {id:'deadeye',iconKey:'ic_path_deadeye',name:'Deadeye',emoji:'👁️',max:3,headline:'+15% vs Bosses & elites',desc:'+15% damage to elites, minibosses and bosses per rank'},
                 {id:'s_draw',iconKey:'ic_path_sniper',name:'Steady Draw',emoji:'🎯',max:3,headline:'Stronger full charge',desc:'A fully charged seed hits 15% harder per rank, but charging takes a little longer.'},
                 {id:'s_heavy',iconKey:'ic_card_s_heavy',name:'Heavy Round',emoji:'💣',max:3,headline:'Unique: +45% damage',desc:'Your Unique beam deals 45% more damage per rank, but takes 0.35s longer to charge.'},
                 {id:'s_quick',iconKey:'ic_card_s_quick',name:'Quick Scope',emoji:'⏱️',max:3,headline:'Unique: charges faster',desc:'Your Unique beam charges 22% faster per rank, but deals 12% less.'},
                 {id:'s_bore',iconKey:'ic_card_s_bore',name:'Wide Bore',emoji:'🌪️',max:3,headline:'Unique: wider beam',desc:'Your Unique beam is 40% wider per rank, but the Unique recharges 15% slower.'},
                 {id:'s_split',iconKey:'ic_card_s_split',name:'Split Shot',emoji:'🔱',max:2,headline:'Unique: side beams',desc:'Your Unique beam also fires 2 side beams per rank (55% damage each); the main beam is 10% weaker.'}]},
    {id:'shotgun',iconKey:'ic_path_shotgun',name:'Shotgun Build',emoji:'💥',desc:'Fire a spread of small pellets (+5, max 12). Each pellet is weak, but within 120px pellets hit twice as hard and +40% more. Best when enemies are close.',
      upgrades:[{id:'pointblank',iconKey:'ic_card_pointblank',name:'Point Blank',emoji:'🔥',max:3,headline:'Stronger up close',desc:'The up-close bonus is 15% stronger per rank.'},
                {id:'s_slug',iconKey:'ic_path_pointblank',name:'Heart Slug',emoji:'💥',max:1,headline:'Strong middle pellet',desc:'The middle pellet hits 60% harder.'},
                {id:'b_wide',iconKey:'ic_card_b_wide',name:'Wide Blast',emoji:'🌸',max:3,headline:'Unique: wider cone',desc:'Your Unique Berry Blast: cone 20° wider and +2 pellets per rank.'},
                {id:'b_recoil',iconKey:'ic_card_b_recoil',name:'Recoil Hop',emoji:'🐇',max:2,headline:'Unique: longer hop back',desc:'After your Unique Berry Blast you hop back 40px farther and stay safe 0.3s longer per rank.'},
                {id:'b_double',iconKey:'ic_card_b_double',name:'Double Tap',emoji:'✌️',max:1,headline:'Unique: fires twice',desc:'Your Unique Berry Blast fires a second blast 0.35s later at 60% damage.'}]},
    {id:'ricochet',iconKey:'ic_path_ricochet',name:'Ricochet Build',emoji:'💞',desc:'Seeds bounce to 2 new enemies and you fire 25% faster, but seeds start 20% weaker. Each bounce makes the seed stronger (max 8 bounces). A boss alone still takes an extra hit.',
      upgrades:[{id:'carom',iconKey:'ic_path_carom',name:'Carom',emoji:'🔁',max:3,headline:'+1 bounce',desc:'+1 bounce per rank (max 8). Past the max, extra ranks add +8% seed damage.'},
                {id:'s_seek',iconKey:'ic_path_carom',name:'Seeking Hearts',emoji:'💞',max:2,headline:'Longer bounce reach',desc:'Seeds find their next bounce target from 20% farther per rank.'},
                {id:'s_return',iconKey:'ic_path_deadeye',name:'Lone Heart',emoji:'🎯',max:2,headline:'Extra hit on lonely bosses',desc:'If a seed has no new enemy to bounce to, the boss or miniboss takes an extra hit: +10% per rank (max +80%).'},
                {id:'gather',iconKey:'ic_path_gather',name:'Gathering Juice',emoji:'🧃',max:3,headline:'Bounces build power',desc:'Each bounce makes the seed 8% stronger per rank (up to ×2.2).'},
                {id:'r_spark',iconKey:'ic_path_r_spark',name:'Heart Spark',emoji:'💗',max:3,fx:{},headline:'Bounces zap',desc:'Each bounce has a 15% chance per rank to zap another enemy nearby for 40% damage.'}]}],
  // สายของตัวอื่นใช้ระบบกลาง: base = ผลตอนเลือก · upgrades[].fx = ผลต่อ rank (dmg/cd คูณ · อื่น ๆ บวก)
  // คีย์: dmg cd count range big(vs elite/มินิ/บอส) frozen(vs ศัตรูแช่) far(>300px) low(HP เรา<50%) taken(ลดดาเมจที่รับ)
  mint:[
    {id:'glacier',iconKey:'ic_path_glacier',name:'Glacier Bloom Build',emoji:'🧊',base:{dmg:0.9,frozen:0.35},headline:'Freeze → Frost → Shatter',desc:'Freeze enemies, then shatter them. Throws 1 lance; extra lances power up Glacier Bloom instead. Lances deal 10% less, but frozen or Brittle enemies take 35% more. Hit a frozen enemy to build 3 Frost, then once more to Shatter it. Bosses turn Brittle instead of freezing.',
      upgrades:[{id:'p_deepchill',iconKey:'ic_path_p_deepchill',name:'Deep Chill',emoji:'🥶',max:3,fx:{frozen:0.12},headline:'+12% DMG to Frozen/Brittle',desc:'Frozen and Brittle enemies take 12% more damage per rank, including bosses.'},
                {id:'p_froststack',iconKey:'ic_card_m_shard',name:'Frost Stack',emoji:'🥶',max:2,headline:'+1 Frost stack per hit',desc:'Hits on frozen or Brittle enemies add 1 more Frost stack per rank, so they Shatter sooner.'},
                {id:'p_chainshatter',iconKey:'ic_card_m_shard',name:'Chain Shatter',emoji:'💎',max:2,headline:'Shatters spread',desc:'When an enemy Shatters, enemies nearby get Chill and 1 Frost stack. Each rank lets the Shatter spread 1 more step (max 2).'},
                {id:'p_coldsnap',iconKey:'ic_path_p_coldsnap',name:'Icebound Echo',emoji:'❄️',max:3,headline:'Freeze sends a Chill wave',desc:'Freezing an enemy sends a small Chill wave around it; the wave is 20% bigger per rank.'},
                {id:'m_grow',iconKey:'ic_card_m_grow',name:'Wider Bloom',emoji:'🌸',max:3,headline:'Glacier Bloom +25% size',desc:'Glacier Bloom Unique: snowstorm area 25% larger per rank.'},
                {id:'m_hold',iconKey:'ic_card_m_hold',name:'Long Winter',emoji:'⏳',max:2,headline:'Bloom freezes +0.6s',desc:'Glacier Bloom Unique: freeze lasts 0.6s longer per rank.'},
                {id:'m_shard',iconKey:'ic_card_m_shard',name:'Shard Spray',emoji:'💎',max:2,headline:'+20% snowstorm damage',desc:'Glacier Bloom Unique: every snow pulse deals 20% more damage per rank.'}]},
    {id:'barrage',iconKey:'ic_path_barrage',name:'Barrage Build',emoji:'🌨️',base:{dmg:0.55,cd:0.78,count:1},headline:'+1 Lance · 22% faster',desc:'Fire 2 lances 22% faster, each at 55% damage. Lances burst into ice shards. Each lance past 2 makes every lance and shard 15% weaker.',
      upgrades:[{id:'p_quickdraw',iconKey:'ic_path_p_quickdraw',name:'Wide Volley',emoji:'🌬️',max:3,headline:'Wider lance spread',desc:'Spread each lance 20% wider per rank to cover more enemies.'},
                {id:'p_splinter',iconKey:'ic_path_p_splinter',name:'Crystal Payload',emoji:'💠',max:3,headline:'+12% Shard DMG',desc:'Shards deal 12% more damage per rank; direct lance damage stays the same.'},
                {id:'p_bar_wide',iconKey:'ic_path_p_bar_wide',name:'Far Shards',emoji:'❄️',max:3,fx:{},headline:'Shards fly farther',desc:'Ice shards fly 20% farther per rank.'},
                {id:'p_bar_chain',iconKey:'ic_path_p_bar_chain',name:'Shard Chain',emoji:'🔗',max:3,fx:{},headline:'Bursts chain on',desc:'Each shard burst has a 25% chance per rank to burst again on a nearby enemy at 60% power.'},
                {id:'p_bar_echo',iconKey:'ic_path_p_bar_echo',name:'Lance Echo',emoji:'🔁',max:2,fx:{},headline:'Every few volleys fire twice',desc:'Every 4th volley (every 3rd at rank 2) fires again 0.25s later.'}]},
    {id:'pierce',iconKey:'ic_path_pierce',name:'Crystal Impaler Build',emoji:'🏹',base:{dmg:1.75,cd:1.4,range:0.3},headline:'Charge → Impale → Rupture',desc:'Charge one powerful lance automatically: +30% range, but 40% slower. It goes through enemies. Full hits build Impale; the next full hit against 3 stacks triggers Crystal Rupture. Dashing or getting hit fires it early, weaker.',
      upgrades:[{id:'p_shatterpt',iconKey:'ic_path_p_shatterpt',name:'Shatterpoint',emoji:'🎯',max:3,fx:{big:0.15},headline:'+15% Boss / +10% Rupture',desc:'+15% damage to elites/minibosses/bosses and +10% Crystal Rupture damage per rank.'},
                {id:'p_coldblood',iconKey:'ic_path_p_coldblood',name:'Overpenetration',emoji:'💎',max:3,headline:'+1 pierce',desc:'Lances go through 1 more enemy per rank, and hit 6% harder for each enemy they already went through (max 3).'},
                {id:'p_heavydraw',iconKey:'ic_card_l_far',name:'Heavy Draw',emoji:'🏹',max:3,headline:'Stronger full charge',desc:'A fully charged lance hits 18% harder per rank, but charging takes a little longer.'},
                {id:'p_impaler',iconKey:'ic_path_p_coldblood',name:'Deep Impale',emoji:'🎯',max:1,headline:'Faster boss Rupture',desc:'Full lance hits on elites and bosses count twice toward Rupture.'},
                {id:'l_far',iconKey:'ic_card_l_far',name:'Long Lance',emoji:'📏',max:3,headline:'Lance dash +30% distance',desc:'Your Unique lance dash goes 30% farther per rank, releasing more homing shards along the way.'},
                {id:'l_twin',iconKey:'ic_card_l_twin',name:'Lance Charges',emoji:'✌️',max:2,headline:'+1 Unique charge',desc:'Your Unique lance dash stores 1 more charge per rank (up to 3). Used charges refill one at a time.'},
                {id:'l_burst',iconKey:'ic_card_l_burst',name:'Lance Burst',emoji:'💥',max:2,headline:'Ice blast at the end',desc:'Your Unique lance dash ends with an ice blast (+50% damage per rank).'}]}],
  cocoa:[
    {id:'brawler',iconKey:'ic_path_brawler',name:'Fire Fist Build',emoji:'🔥',base:{dmg:0.72,cd:0.7,wave:1},desc:'Throw blazing fist projectiles at range. The 5th punch is a big piercing fireball that explodes. Tap Unique: Rocket Gauntlet',
      upgrades:[{id:'p_shock',iconKey:'ic_path_p_shock',name:'Blast Radius',emoji:'💥',max:3,fx:{},headline:'+25% fireball blast',desc:'The 5th-punch fireball explosion is 25% bigger per rank'},
                {id:'p_footwork',iconKey:'ic_path_p_footwork',name:'Hot Hands',emoji:'💨',max:3,fx:{},headline:'Every few fists explode',desc:'Every 8th fist explodes on hit (every 6th at rank 2, every 4th at rank 3) for a small fire blast.'},
                {id:'p_twin',iconKey:'ic_path_brawler',name:'Twin Fists',emoji:'✌️',max:2,fx:{},headline:'Double fist volleys',desc:'Every 3rd fist fires 2 fists; rank 2 makes it every 2nd fist'},
                {id:'p_ember',iconKey:'ic_inf_spicy',name:'Ember Trail',emoji:'🔥',max:3,fx:{},headline:'Fists leave fire',desc:'Fists that hit leave a small fire patch for 1.2s; +30% burn damage per rank'},
                {id:'p_streak',iconKey:'ic_path_p_streak',name:'Hot Streak',emoji:'🔥',max:3,fx:{},headline:'Fist hits build heat',desc:'Each fist hit adds +2% fist damage per rank for 3s, stacking up to 10 times.'}]},
    {id:'titan',iconKey:'ic_path_titan',name:'Titan Build',emoji:'🗿',base:{dmg:1.7,cd:1.45,range:0.25},desc:'Every punch is a slow, heavy Ground Pound (×1.7 damage, +25% reach, 45% slower). Pounds add Tremor: enemies take +6% damage per stack (max 5). Better healing. Hold your Unique to charge Blood Rage (costs HP), then release a huge Colossus Fist.',
      upgrades:[{id:'p_titanfist',iconKey:'ic_path_p_titanfist',name:'Titan Fist',emoji:'🎯',max:3,fx:{big:0.15},headline:'+15% vs Bosses & elites',desc:'+15% damage to elites and bosses per rank'},
                {id:'p_quake',iconKey:'ic_path_p_quake',name:'Wide Pound',emoji:'🌋',max:3,fx:{range:0.1},headline:'+10% impact size',desc:'+10% impact size per rank'},
                {id:'p_ironblood',iconKey:'ic_path_titan',name:'Iron Blood',emoji:'🩸',max:3,fx:{},headline:'-20% charge HP cost',desc:'Blood Rage costs 20% less HP per rank, and you heal 0.4% max HP per second more.'},
                {id:'p_secondwind',iconKey:'ic_path_titan',name:'Blood Mend',emoji:'💗',max:2,fx:{},headline:'Heal on big release',desc:'Releasing Blood Rage at level 2 or higher heals 4% max HP per level per rank.'},
                {id:'p_fastrage',iconKey:'ic_path_titan',name:'Quick Fury',emoji:'⏩',max:3,fx:{},headline:'+20% charge speed',desc:'Blood Rage charges 20% faster per rank'},
                {id:'p_crater',iconKey:'ic_mod_quake',name:'Lava Crater',emoji:'🌋',max:2,fx:{},headline:'Release leaves lava',desc:'Releasing Blood Rage at level 2 or higher leaves a lava pool for 3s (+50% lava damage per rank).'}]},
    {id:'dashboxer',iconKey:'ic_path_dashboxer',name:'Dash Boxer Build',emoji:'🐾',base:{dmg:0.9,dashc:1,dashm:0.5},desc:'+1 Dash charge and Dash recharges 25% faster; punches 10% weaker. Dashing keeps your combo going and powers up your next punch. Your Unique is Phantom Rush.',
      upgrades:[{id:'p_phantom',iconKey:'ic_path_p_phantom',name:'Phantom Jab',emoji:'👻',max:3,fx:{dashm:0.2},headline:'Stronger Dash combos',desc:'After a Dash, your combo deals 20% more and lasts 0.4s longer per rank. Phantom Rush punches are 10% stronger per rank.'},
                {id:'p_longleap',iconKey:'ic_path_dashboxer',name:'Long Leap',emoji:'🦘',max:3,fx:{},headline:'+25% leap range',desc:'Dash Leap reaches enemies 25% farther per rank'},
                {id:'p_slamwave',iconKey:'ic_mod_stomp',name:'Slam Wave',emoji:'💢',max:3,fx:{},headline:'+20% landing slam',desc:'The Dash Leap landing slam is 20% wider and 10% stronger per rank.'},
                {id:'p_recharge',iconKey:'ic_path_p_recharge',name:'Leap Mend',emoji:'💗',max:2,fx:{},headline:'Leaps heal',desc:'Each Dash Leap onto an enemy heals 1.5% max HP per rank.'},
                {id:'p_leapstun',iconKey:'ic_path_p_leapstun',name:'Leap Stun',emoji:'💫',max:3,fx:{},headline:'Leaps stun',desc:'Dash Leap stuns its target for 0.4s per rank (not bosses or minibosses).'}]}],
  taro:[
    {id:'storm',iconKey:'ic_path_storm',name:'Arc Build',emoji:'🌩️',base:{dmg:0.75,count:1},headline:'Launch Arc from Taro',desc:'Lightning jumps from Taro through nearby enemies, getting stronger with each jump. With no new enemy, the jumps keep hitting the last one, so bosses take them all. Kills throw lightning shards.',
      upgrades:[{id:'p_static',iconKey:'ic_path_p_static',name:'Static Shards',emoji:'✨',max:3,fx:{},headline:'Bigger kill shards',desc:'Arc kills throw shards at 1 more enemy, and shards deal 33% more per rank.'},
                {id:'p_arc_overload',iconKey:'ic_taro_arc_overload',name:'Loopback',emoji:'🔁',max:3,fx:{},headline:'+15% loop power',desc:'When an Arc runs out of new enemies, the leftover jumps hit the last enemy again at 60% (+15% per rank).'},
                {id:'p_arc_shock',iconKey:'ic_path_p_arc_shock',name:'Static Shock',emoji:'⚡',max:3,fx:{},headline:'Arc hits shock',desc:'Enemies hit by Arc take 4% more damage per rank from everything for 2s.'},
                {id:'p_arc_twin',iconKey:'ic_path_p_arc_twin',name:'Double Arc',emoji:'🔁',max:2,fx:{},headline:'Every few casts fire twice',desc:'Every 4th Arc cast (every 3rd at rank 2) fires a second Arc.'},
                {id:'p_arc_ground',iconKey:'ic_path_p_arc_ground',name:'Grounding',emoji:'💚',max:3,fx:{},headline:'Arc kills heal',desc:'Arc kills heal 0.4% max HP per rank.'}]},
    {id:'smite',iconKey:'ic_path_smite_spark',name:'Spark Build',emoji:'✨',base:{dmg:1.8,cd:1.35},headline:'Release splitting sparks',desc:'Sparks burst out all around Taro, bounce off the screen edges, pass through enemies and split into smaller sparks. They keep zapping until their timer runs out.',
      upgrades:[{id:'p_judge',iconKey:'ic_path_p_judge',name:'Giant Hunter',emoji:'🎯',max:3,fx:{big:0.15},headline:'+15% vs Bosses & elites',desc:'+15% Spark damage to elites and bosses per rank'},
                
                {id:'p_spark_life',iconKey:'ic_taro_live_current',name:'Live Current',emoji:'⏳',max:3,fx:{},headline:'Sparks last longer',desc:'+15% Spark lifetime per rank; max 5 seconds'},
                {id:'p_spark_speed',iconKey:'ic_taro_fast_sparks',name:'Fast Sparks',emoji:'💨',max:3,fx:{},headline:'Sparks fly faster',desc:'+12% Spark movement speed per rank; max 640'},
                {id:'p_spark_split',iconKey:'ic_taro_split_spark',name:'Split Spark',emoji:'🔱',max:1,fx:{},headline:'Stronger split sparks',desc:'Split sparks keep 65% power instead of 45% (second split 42% instead of 20%)'},
                {id:'p_spark_shock',iconKey:'ic_path_p_spark_shock',name:'Static Sparks',emoji:'✨',max:3,fx:{},headline:'Spark hits shock',desc:'Enemies hit by Sparks take 3% more damage per rank from everything for 2s.'}]},
    {id:'tempest',iconKey:'ic_path_tempest_sentry',name:'Sentry Build',emoji:'🗼',base:{dmg:0.65,cd:0.85},headline:'Set Ball Lightning sentries',desc:'Place 2 sentries (Extra Sentry cards add more, up to 3). Sentries stay until they expire or you walk far away. They fire slow Ball Lightning that zaps every enemy around it many times per second.',
      upgrades:[{id:'p_sentry_overload',iconKey:'ic_path_tempest',name:'Fade Burst',emoji:'💥',max:2,fx:{},headline:'Orbs burst on fade',desc:'When a Ball Lightning disappears, it explodes for 150% damage per rank.'},
                {id:'p_sentry_link',iconKey:'ic_path_smite',name:'Tesla Link',emoji:'🔗',max:2,fx:{},headline:'Sentries link up',desc:'Two sentries close together (420px) are linked by lightning; enemies touching the line take 80% orb damage per rank every 0.5s.'},
                {id:'p_farstrike',iconKey:'ic_taro_long_current',name:'Long-Range Current',emoji:'🔭',max:3,fx:{far:0.12},headline:'+12% beyond 300px',desc:'Hits 300px or more away from Taro deal 12% more per rank.'},
                {id:'p_sentry_pulse',iconKey:'ic_path_p_sentry_pulse',name:'Close Charge',emoji:'⏱️',max:3,fx:{},headline:'Stay near to charge sentries',desc:'Sentries within 260px of Taro fire 12% faster per rank.'},
                {id:'p_sentry_ward',iconKey:'ic_path_p_sentry_ward',name:'Sentry Ward',emoji:'🛡️',max:3,fx:{},headline:'Safe near sentries',desc:'Take 5% less damage per rank while within 160px of a sentry.'}]}],
  sesame:[
    {id:'prism',iconKey:'ic_path_prism',name:'Prism Build',emoji:'🌈',base:{dmg:0.6,count:2},desc:'+2 beams, ×0.6 damage each · swarm build',
      upgrades:[{id:'p_facet',iconKey:'ic_path_p_facet',name:'Prism Echo',emoji:'💠',max:2,fx:{},headline:'Every few casts fire twice',desc:'Every 4th beam cast (every 3rd at rank 2) fires again 0.3s later at 50% damage.'},
                {id:'p_refract',iconKey:'ic_path_p_refract',name:'Refraction',emoji:'✨',max:3,fx:{dmg:1.08},headline:'+8% Beam hit (multiplies)',desc:'+8% beam damage per rank. Multiplies with your “+% damage” total.'}]},
    {id:'lens',iconKey:'ic_path_lens',name:'Focus Build',emoji:'🔍',base:{dmg:1.6,cd:1.3,big:0.2},desc:'×1.6 damage and +20% vs elites/bosses, but 30% slower · boss build',
      upgrades:[{id:'p_lensbig',iconKey:'ic_path_p_lensbig',name:'Burning Lens',emoji:'🎯',max:3,fx:{big:0.15},desc:'+15% damage to elites and bosses per rank'},
                {id:'p_steady',iconKey:'ic_path_p_steady',name:'Steady Hand',emoji:'🧘',max:3,fx:{dmg:1.1},headline:'+10% Beam hit (multiplies)',desc:'+10% beam damage per rank. Multiplies with your “+% damage” total.'}]},
    {id:'sentinel',iconKey:'ic_path_sentinel',name:'Sentinel Build',emoji:'🔭',base:{range:0.4,far:0.25},desc:'+40% beam length, +25% damage to far enemies · kite build',
      upgrades:[{id:'p_longsight',iconKey:'ic_path_p_longsight',name:'Longsight',emoji:'👁️',max:3,fx:{far:0.10},desc:'+10% damage to far enemies per rank'},
                {id:'p_swift',iconKey:'ic_path_p_swift',name:'Retreat Shot',emoji:'⏩',max:3,fx:{},headline:'Dash, then hit harder',desc:'After a Dash, your next beam within 2s deals 30% more damage per rank.'}]}]
};
// 🍯 Flavor Infusion (v4.96) — เลเวล 10 เลือกธาตุรสชาติ 1 ใน 3 (สุ่มจาก 4) · แลกดาเมจตรงเล็กน้อยกับเอฟเฟกต์ติดเป้า
// v5.12 ระดับกล่องมินิบอส (สีเสาแสง) · v5.13 ผูกกับผลงานตอนสู้
const MINI_CHEST_TIERS={
  bronze:{id:'bronze',name:'Bronze',artKey:'chest_badge_bronze',color:0xc88860,rank:0},
  silver:{id:'silver',name:'Silver',artKey:'chest_badge_silver',color:0xc98bff,rank:1},
  gold:{id:'gold',name:'Gold',artKey:'chest_badge_gold',color:0xffd166,rank:2},
};
const FLAVOR_INFUSIONS=[
  {id:'spicy',name:'Spicy Infusion',emoji:'🌶️',color:0xff5a3d,direct:0.85,desc:'×0.85 hit damage · hits Burn for 30% of the hit over 2s'},
  {id:'sour',name:'Sour Infusion',emoji:'🍋',color:0xe8e04a,direct:0.9,desc:'×0.9 hit damage · hits make enemies take +12% damage for 3s'},
  {id:'sweet',name:'Sweet Infusion',emoji:'🍯',color:0xffb347,direct:0.9,desc:'×0.9 hit damage · hits heal 0.5% max HP (every 0.3s)'},
  {id:'minty',name:'Minty Infusion',emoji:'🌿',color:0x7fe0c0,direct:0.9,desc:'×0.9 hit damage · 30% chance to freeze non-boss enemies briefly'}];
const INFUSION_UP={id:'inf_deep',name:'Deep Flavor',emoji:'✨',max:3,headline:'+35% Infusion effect',desc:'Strengthen your chosen flavor effect by 35% per rank; direct-hit damage penalty stays the same.'};
// 🏷️ Tag Sets (v6.7.0 · B1) — 8 แท็ก · ทุกการ์ด/สาย/รสชาติ/Relic/mod ไอเทม มีแท็ก · สะสม 2/4/6 = โบนัสเซ็ต
// แหล่งนับ: อาวุธประจำตัว (ฐาน) · การ์ดอัปเกรดที่มี (1 ต่อใบ) · Path · Infusion · Mutation · Evolution · Relic · ไอเทมที่สวม (แท็กละ 1 ต่อชิ้น)
const WEAPON_TAGS={momo:['ranged'],mint:['frost','ranged'],cocoa:['melee'],taro:['spark'],sesame:['ranged'],yuzu:['swarm'],berry:['ranged','fire']};
// การ์ดอัปเกรด/สาย/mutation ที่ไม่อยู่ในตาราง = แท็กแรกของอาวุธประจำตัว
// 🧩 Modifiers (v6.8.0 · B3) — การ์ดเปลี่ยนกลไก ตัวละครละ 6 ใบ · ได้สูงสุด MOD_MAX ใบ/ด่าน · ออกตั้งแต่เลเวล 4
// kind: hitBoom/hitChain/nthHit/killBurst/killTrap/dashNova/dashTrail/pulse/stillPower/movePower/closeBonus/farBonus/execute/bossBonus/frozenMul
const MOD_MAX=3;
const MODIFIERS={
  momo:[
    {id:'m_bloom',emoji:'🌸',name:'Seed Bloom',kind:'hitBoom',p:0.12,r:60,mul:0.8,tags:['fire'],desc:'12% of hits burst into a small blast'},
    {id:'m_love',emoji:'💘',name:'Love Chain',kind:'hitChain',p:0.15,n:2,mul:0.6,tags:['spark'],desc:'15% of hits arc to 2 nearby enemies'},
    {id:'m_heart',emoji:'💗',name:'Big Heart',kind:'nthHit',n:7,mul:3,tags:['crit'],desc:'Every 7th hit deals ×3 damage'},
    {id:'m_aim',emoji:'🎯',name:'Steady Aim',kind:'stillPower',mul:1.25,tags:['ranged'],desc:'+25% damage while standing still'},
    {id:'m_jam',emoji:'🍓',name:'Jam Mine',kind:'killTrap',mul:1.2,tags:['fire','swarm'],desc:'Slain enemies leave a jam mine that pops'},
    {id:'m_spray',emoji:'💨',name:'Petal Kick',kind:'dashSeeds',n:6,tags:['ranged'],desc:'Dashing fires 6 seeds in a ring that bounce once'}],
  mint:[
    {id:'m_icemine',emoji:'❄️',name:'Ice Mine',kind:'killTrap',mul:1.1,freeze:true,tags:['frost'],desc:'Slain enemies leave an ice mine that freezes'},
    {id:'m_shatter',emoji:'💎',name:'Ice Breaker',kind:'frozenKill',r:90,mul:1.2,tags:['frost','crit'],desc:'Frozen enemies you kill shatter, hitting and freezing enemies nearby'},
    {id:'m_flurry',emoji:'🌨️',name:'Flurry Pulse',kind:'pulse',every:4,r:140,mul:1.2,freeze:true,tags:['frost'],desc:'Every 4s a frost pulse hits and freezes around you'},
    {id:'m_throw',emoji:'🏹',name:'Long Throw',kind:'farBonus',r:260,mul:1.3,tags:['ranged'],desc:'+30% damage to enemies far away'},
    {id:'m_glide',emoji:'🌬️',name:'Glide Nova',kind:'dashNova',r:120,mul:1.6,tags:['spark'],desc:'Dashing releases a cold blast'},
    {id:'m_coldarc',emoji:'🧊',name:'Cold Arc',kind:'hitChain',p:0.12,n:2,mul:0.5,freeze:true,tags:['frost','spark'],desc:'12% of hits arc and freeze 2 enemies'}],
  cocoa:[
    {id:'m_quake',emoji:'🌋',name:'Sixth Slam',kind:'nthHit',n:6,mul:2.5,boom:90,tags:['melee'],desc:'Every 6th hit ×2.5 and shakes the ground'},
    {id:'m_stomp',emoji:'🐾',name:'Bear Stomp',kind:'dashNova',r:140,mul:2,tags:['melee'],desc:'Dashing ends in a heavy stomp'},
    {id:'m_rage',emoji:'🔥',name:'Rolling Rage',kind:'dashRage',tags:['melee','fire'],desc:'Each Dash adds a Rage stack: +6% damage each (max 5). Getting hit clears them'},
    {id:'m_crush',emoji:'👊',name:'Close Crush',kind:'closeBonus',r:110,mul:1.3,tags:['melee'],desc:'+30% damage to enemies right next to you'},
    {id:'m_ko',emoji:'💀',name:'Finishing Blow',kind:'execute',hp:0.25,mul:1.6,tags:['crit'],desc:'+60% damage to enemies under 25% HP'},
    {id:'m_after',emoji:'💥',name:'Aftershock',kind:'killBurst',p:0.25,r:80,mul:1,tags:['fire','swarm'],desc:'25% of kills explode'}],
  taro:[
    {id:'m_over',emoji:'⚡',name:'Overcharge',kind:'hitChain',p:0.2,n:3,mul:0.5,tags:['spark'],desc:'20% of hits arc to 3 enemies'},
    {id:'m_field',emoji:'🌀',name:'Static Field',kind:'pulse',every:3,r:120,mul:1,tags:['spark','swarm'],desc:'Every 3s a static pulse hits around you'},
    {id:'m_step',emoji:'👣',name:'Thunder Step',kind:'dashNova',r:120,mul:1.6,tags:['spark'],desc:'Dashing leaves a thunderclap'},
    {id:'m_judge',emoji:'⚖️',name:'Static Buildup',kind:'stackShock',n:6,mul:1.5,tags:['spark'],desc:'Every 6th hit on the same enemy shocks it: bonus damage, normal enemies are stunned'},
    {id:'m_ion',emoji:'💥',name:'Ion Burst',kind:'killBurst',p:0.2,r:80,mul:1,tags:['spark','swarm'],desc:'20% of kills burst with lightning'},
    {id:'m_focus',emoji:'🔋',name:'Storm Battery',kind:'killCharge',n:15,mul:5,tags:['spark'],desc:'Every 15 kills, your next hit deals ×5 damage'}],
  sesame:[
    {id:'m_prism',emoji:'🔮',name:'Prism Burst',kind:'hitBoom',p:0.1,r:70,mul:0.9,tags:['swarm'],desc:'10% of hits burst into light'},
    {id:'m_lens',emoji:'🧘',name:'Calm Mirror',kind:'stillPower',mul:1.3,tags:['ranged'],desc:'+30% damage while standing still'},
    {id:'m_scope',emoji:'🔭',name:'Far Sight',kind:'farBonus',r:260,mul:1.3,tags:['ranged'],desc:'+30% damage to enemies far away'},
    {id:'m_refract',emoji:'✨',name:'Split Light',kind:'hitChain',p:0.15,n:2,mul:0.5,tags:['spark'],desc:'15% of hits split to 2 enemies'},
    {id:'m_mirror',emoji:'🪞',name:'Mirror Mine',kind:'killTrap',mul:1.2,tags:['swarm'],desc:'Slain enemies leave a mirror shard that explodes'},
    {id:'m_exec',emoji:'💀',name:'Execution Beam',kind:'execute',hp:0.3,mul:1.5,tags:['crit'],desc:'+50% damage to enemies under 30% HP'}],
  yuzu:[
    {id:'m_zest',emoji:'🍋',name:'Peel Pop',kind:'killBurst',p:0.25,r:80,mul:1,tags:['fire','swarm'],desc:'25% of kills burst in citrus'},
    {id:'m_crew',emoji:'⚡',name:'Crew Chain',kind:'hitChain',p:0.1,n:2,mul:0.5,tags:['spark','swarm'],desc:'10% of hits arc to 2 enemies'},
    {id:'m_rally',emoji:'📣',name:'Rally Pulse',kind:'pulse',every:4,r:130,mul:1,tags:['swarm'],desc:'Every 4s a rally pulse hits around you'},
    {id:'m_sour',emoji:'💀',name:'Last Squeeze',kind:'execute',hp:0.25,mul:1.5,tags:['crit'],desc:'+50% damage to enemies under 25% HP'},
    {id:'m_splash',emoji:'💦',name:'Dash Splash',kind:'dashTrail',mul:1,tags:['swarm'],desc:'Dashing drops 3 juice bombs'},
    {id:'m_bite',emoji:'🦷',name:'Big Bite',kind:'nthHit',n:10,mul:3,tags:['crit'],desc:'Every 10th hit deals ×3 damage'}]};
// ⚖️ Trade-offs (v6.9.0 · B4) — ได้อย่าง เสียอย่าง · ออกตั้งแต่บท 2 (stageIndex≥5) และ Endgame · สูงสุด TRADE_MAX/ด่าน
const TRADE_MAX=2;
const TRADEOFFS=[
  {id:'t_armor',emoji:'🛡️',name:'Heavy Armor',tags:['guard'],gain:'Take 35% less damage',cost:'Stage: Elites come 50% more often',reward:'Elites drop gear 50% more',apply:p=>{p.dmgTakenMul*=0.65;}},   /* v8.2.29 Pact: ข้อเสียย้ายไปที่ด่าน */
  {id:'t_rush',emoji:'🍬',name:'Sugar Rush',tags:['spark'],gain:'+25% speed, -15% cooldowns',cost:'Stage: monsters move 15% faster',reward:'+20% Sugar',apply:p=>{p.baseSpeed*=1.25;p.cdMul*=0.85;p.sugarFindMul=(p.sugarFindMul||1)*1.2;}},
  {id:'t_berserk',emoji:'😤',name:'Berserker',tags:['melee'],gain:'Up to ×2 damage as HP drops',cost:'No HP regeneration',apply:p=>{p._tdBerserk=true;p.regen=0;p.regenFlat=0;p.regenPct=0;p._uqNoRegen=true;}},
  {id:'t_feast',emoji:'🌀',name:'Hungry Pact',tags:['swarm'],gain:'+20% damage, +30% EXP',cost:'Healing items do nothing',apply:p=>{p.dmgMul+=(1.2)-1;p.xpMul=(p.xpMul||1)*1.3;p.healEffect=0;}},
  {id:'t_oath',emoji:'🎯',name:'Marksman’s Oath',tags:['ranged','crit'],gain:'+20% crit chance',cost:'Attacks 20% slower',apply:p=>{p.critChance=(p.critChance||0)+0.20;p.cdMul*=1.2;}}];
// 🧬 Fusions (v6.10.0 · B6) — Evolution + Relic เฉพาะ = ร่างพิเศษ · ตัวละ 2 สูตร · เก็บใน b.mods (id ขึ้นต้น f_ ไม่นับ MOD_MAX)
const FUSIONS={
  momo:[{id:'f_heartburst',relic:'burst',emoji:'💥',name:'Heartburst Blaster',kind:'hitBoom',p:0.25,r:90,mul:1.6,tags:['fire','swarm'],desc:'25% of hits explode in a big heart blast'},
        {id:'f_crownseed',relic:'crown',emoji:'👑',name:'Crown Seed',kind:'nthHit',n:4,mul:3.5,boom:80,tags:['crit'],desc:'Every 4th hit ×3.5 and bursts'}],
  mint:[{id:'f_glacier',relic:'chill',emoji:'🏔️',name:'Living Glacier',kind:'pulse',every:2.5,r:200,mul:2,freeze:true,tags:['frost'],desc:'Every 2.5s a huge freezing wave'},
        {id:'f_shardstorm',relic:'splinter',emoji:'💠',name:'Shardstorm',kind:'hitChain',p:0.3,n:3,mul:0.8,freeze:true,tags:['frost','crit'],desc:'30% of hits arc and freeze 3 enemies'}],
  cocoa:[{id:'f_quakeking',relic:'dashcharge',emoji:'🌋',name:'Quake King',kind:'dashNova',r:200,mul:3.5,tags:['melee'],desc:'Every dash ends in a massive quake'},
         {id:'f_lastbear',relic:'lastbreath',emoji:'🐻',name:'Last Bear Standing',kind:'execute',hp:0.4,mul:2,tags:['melee','crit'],desc:'×2 damage to enemies under 40% HP'}],
  taro:[{id:'f_tempest',relic:'dashcharge',emoji:'🌩️',name:'Living Tempest',kind:'hitChain',p:0.35,n:4,mul:0.7,tags:['spark'],desc:'35% of hits arc to 4 enemies'},
        {id:'f_skyjudge',relic:'crown',emoji:'⚖️',name:'Sky Judge',kind:'skyStrike',every:4,r:80,mul:5,tags:['crit','spark'],desc:'Every 4s lightning strikes the toughest enemy on screen'}],
  sesame:[{id:'f_prismnova',relic:'glass',emoji:'🔮',name:'Prism Nova',kind:'hitBoom',p:0.2,r:100,mul:1.8,tags:['swarm','crit'],desc:'20% of hits burst into a prism nova'},
          {id:'f_horizon',relic:'firstbite',emoji:'🌅',name:'Event Horizon',kind:'farBonus',r:220,mul:1.7,tags:['ranged'],desc:'+70% damage to distant enemies'}],
  yuzu:[{id:'f_harvest',relic:'harvest',emoji:'🍋',name:'Harvest King',kind:'killBurst',p:0.45,r:100,mul:1.5,tags:['swarm','fire'],desc:'45% of kills burst in citrus'},
        {id:'f_parade',relic:'jam',emoji:'🎉',name:'Jam Parade',kind:'pulse',every:3,r:170,mul:1.6,tags:['swarm'],desc:'Every 3s the crew blasts around you'}]};
function modDef(id){ for(const c in FUSIONS){ const f=FUSIONS[c].find(x=>x.id===id); if(f)return f; } for(const c in MODIFIERS){ const m=MODIFIERS[c].find(x=>x.id===id); if(m)return m; } return null; }
// รวมผลสาย (base + rank ของ upgrade สาย) → {dmg,cd,count,range,big,frozen,far,low,taken}
const BUILD_PATH_STYLES={zestSwarm:'Lime · ranged arrows and traps',citrusGuardian:'Pomelo · frontline protector',juiceWorkshop:'Blood Orange · three-flavor magic',
  sniper:'Charged precision · bosses',shotgun:'Close range · burst damage',ricochet:'Rapid shots · clearing crowds',
  glacier:'Freeze and bloom · crowd control',barrage:'Rapid volleys · sustained damage',pierce:'Heavy lance · elite and boss damage',
  brawler:'Ranged fire fists · Rocket Gauntlet',titan:'Heavy wind-up · hold for Colossus Fist',dashboxer:'Dash and punch · Phantom Rush',
  storm:'Outgoing Arc · growing jumps and shards',smite:'Wandering Sparks · pierce and split',tempest:'Stationary sentries · Ball Lightning',
  prism:'More beams · clearing crowds',lens:'Focused beam · bosses',sentinel:'Long range · kiting'
};
const TITAN_RAGE_MUL=[1,1.8,2.8,4.2,5.5],TITAN_RAGE_SEC=1.8,TITAN_RAGE_CD=[0,1.2,2.6,4.5];
function pathMods(b){ const m={dmg:1,cd:1,count:0,range:0,big:0,frozen:0,far:0,low:0,taken:0,dashc:0,dashm:0,wave:0}; if(!b||!b.path)return m;
  const pt=(BASIC_PATHS[b.character]||[]).find(x=>x.id===b.path); if(!pt||!pt.base)return m;
  const add=(fx,n)=>{ for(const k in fx){ if(k==='dmg'||k==='cd')m[k]*=Math.pow(fx[k],n); else m[k]+=fx[k]*n; } };
  add(pt.base,1); for(const u of pt.upgrades){const count=Number.isFinite(u.fx?.count),rank=b.character==='taro'?Math.max(0,Math.min(u.max*(count?1:1.55),count?(b.lv?.[u.id]??b.ranks?.[u.id]??0):(b.ranks?.[u.id]??b.lv?.[u.id]??0))):b.lv[u.id]||0;add(u.fx||{},rank);} return m; }

// Mint M1: classify existing mechanics; charge/Brittle/Impale arrive in M2/M3.
const MINT_CARD_WEIGHTS={path:65,shared:20,universal:15};
function mintUpgradeGroup(path,id){
  if(!path)return 'shared';
  if(id==='rate')return path==='barrage'?'path':null;
  if(id==='linger')return path==='barrage'||path==='glacier'?'path':null;
  if(['power','rime','chill','inf_deep'].includes(id))return 'shared';
  const pt=BASIC_PATHS.mint.find(p=>p.id===path);
  return pt&&pt.upgrades.some(u=>u.id===id)?'path':null;
}
function mintVolleyProfile(lvl,evolved,count,path){
  const cap=path==='barrage'?2:path==='glacier'?1:4,raw=(evolved?3:(lvl>=3?2:1))+(count||0);   // v6.70 หอกที่ 2 ตั้งแต่ Lv3 · v8.0.86 เจ้าของ: Glacier หอกเดียว (ส่วนเกินไปเพิ่มพลัง Bloom)
  const overflow=path==='barrage'?Math.max(0,raw-cap):0;
  // v8.0.86 เจ้าของ: Barrage ยิ่งปาหลายอัน ยิ่งเบาลงต่ออัน — เกิน 2 อัน −15% ต่ออัน (ต่ำสุด 40%) ทั้งหอกและสะเก็ด
  return {count:Math.min(cap,raw),overflow,shardMul:1+0.18*overflow,bloomMul:path==='glacier'?1+.12*Math.max(0,raw-cap):1,hitMul:path==='barrage'?Math.max(.4,1-.15*Math.max(0,raw-2)):1};
}
function pickMintCards(entries,n,buildDraft=false){
  const pools={path:[],shared:[],universal:[]},out=[];
  for(const e of entries)if(pools[e.group])pools[e.group].push(e);
  while(out.length<n){
    const groups=Object.keys(pools).filter(k=>pools[k].length);if(!groups.length)break;
    const hasCore=pools.shared.some(e=>e.card.type==='basic'&&!e.card.special);
    const required=buildDraft&&out.length===0?(pools.path.length?'path':hasCore?'shared':null):buildDraft&&out.length===1&&hasCore?'shared':null;
    let r=Math.random()*groups.reduce((sum,k)=>sum+MINT_CARD_WEIGHTS[k],0),group=required||groups[groups.length-1];
    if(!required)for(const k of groups){r-=MINT_CARD_WEIGHTS[k];if(r<0){group=k;break;}}
    const pool=required==='shared'?pools.shared.filter(e=>e.card.type==='basic'&&!e.card.special):pools[group];r=Math.random()*pool.reduce((sum,e)=>sum+e.w,0);let index=pool.length-1;
    for(let i=0;i<pool.length;i++){r-=pool[i].w;if(r<0){index=i;break;}}
    const entry=pool[index];pools[group].splice(pools[group].indexOf(entry),1);const card=entry.card;card.poolGroup=group;out.push(card);
  }
  return out;
}

// Chocolate keeps saved path, upgrade and Talent IDs; runtime moves are selected by path.
const COCOA_EVOLUTIONS={
  brawler:{name:'Inferno Overdrive',desc:'Every 5th-punch fireball also calls down 3 fire meteors where it lands.'},
  titan:{name:'Cocoa Colossus',desc:'Every Ground Pound makes a 35%-power aftershock. A level 3 Blood Rage release also strikes every enemy on screen and heals 10% max HP.'},
  dashboxer:{name:'Phantom Chocolatier',desc:'Every Dash also fires 2 homing shadow fists, and the first punch after Dash gets a shadow follow-up.'}
};
const COCOA_UNIQUES={
  brawler:{name:'Rocket Gauntlet',emoji:'🚀',cd:18,color:0xff7a2a,desc:'Tap once: launch 3 homing fire gauntlets at the strongest enemies nearby (one per target). Every gauntlet aimed at a Boss or Mini also blasts it 3 more times',tiers:{2:'4 gauntlets',3:'Bigger explosions',4:'5 gauntlets and a 4th extra blast'}},
  titan:{name:'Colossus Fist',emoji:'👊',cd:9,color:0xd59b65,desc:'Hold to charge Blood Rage while walking (drains HP, up to 3 levels); release to slam a giant fist on the strongest nearby enemy for up to ×4.2 damage, then two more fists hit it. Ground Pounds also crack the ground toward a boss just out of reach. Cooldown starts on release',tiers:{2:'Stronger central impact',3:'Wider central impact and aftershock',4:'Maximum central power and impact size'}},
  dashboxer:{name:'Phantom Rush',emoji:'👻',cd:20,color:0xc9a3ff,desc:'Tap once: auto-leap 4 times onto the strongest enemy (boss first), slamming on each landing. Uses all your Dash charges: +1 leap each, and the leaps get faster. Then for 5.5–7s every Dash is free (2–3 shadow charges) and hits harder',tiers:{2:'6s shadow mode and stronger slams',3:'4 auto leaps, 3 shadow charges, 6.5s',4:'7s shadow mode and maximum slam power'}}
};
const COCOA_PATH_MUTS={
  brawler:[{id:'rush',name:'Fireball Barrage',emoji:'☄️',desc:'The 5th punch launches 3 fireballs instead of 1, and combos run 18% faster'},
    {id:'napalm',name:'Napalm',emoji:'🔥',desc:'Fireball explosions leave a big fire pool for 2s'},
    {id:'ricochet',name:'Ricochet Fists',emoji:'↪️',desc:'Normal fists bounce to 2 more enemies'}],
  titan:[{id:'breaker',name:'Earthbreaker',emoji:'💢',desc:'Ground Pounds deal +12% damage and make a 25%-power aftershock'},
    {id:'bloodpact',name:'Blood Pact',emoji:'🩸',desc:'Blood Rage costs 50% more HP but the Colossus Fist deals +30% damage'},
    {id:'quakestun',name:'Stunning Quake',emoji:'💫',desc:'Colossus Fist freezes non-boss enemies in the impact for 1.5s'}],
  dashboxer:[{id:'counter',name:'Counter Bear',emoji:'🔁',desc:'Dash recharges 40% faster and you take 30% less damage while the Dash buff is active'},
    {id:'afterimage',name:'Afterimage',emoji:'👥',desc:'Dash Leap leaves a shadow that punches the landing spot 3 times over 2s'},
    {id:'chainleap',name:'Chain Leap',emoji:'⛓️',desc:'After a Dash Leap lands, bounce once more onto another enemy and slam again'}]};
function cocoaAttackInfo(d,b){if(!d)return d;const e=COCOA_EVOLUTIONS[b?.path],m=COCOA_PATH_MUTS[b?.path];return {...d,...(m?{mutations:m}:{}),...(e?{evolution:e.name,evolutionDesc:e.desc}:{}),upgrades:d.upgrades.map(u=>u.id==='size'&&b?.path==='brawler'?{...u,headline:'+12% fist range & blast',desc:'+12% Fire Fist targeting range and fireball/meteor blast radius per rank.'}:u.id==='combo'&&b?.path==='titan'?{...u,desc:'+8% Ground Pound power and +1 max Tremor stack per rank'}:u.id==='combo'?{...u,desc:'+18% finisher power per rank; applies to all five-hit path combos'}:u)};}

// v7.8.25 Taro Unique per build: pre-path Plasma Field (Razor-style), Sentry Overcharge Detonation, Arc/Spark keep Storm Beacon
const TARO_UNIQUES={
  plasma:{name:'Plasma Field',emoji:'🌀',cd:9,color:0x9ad8ff,desc:'A ring of plasma expands from Taro and then returns, zapping every enemy it crosses on the way out and on the way back. Enemies farther away take more damage. When it returns it leaves a Magnetic Field for 10 seconds: enemies inside take +25% damage. On the Arc Build, every enemy it touches also fires an Arc jump.',tiers:{2:'Wider ring that hits harder',3:'Even wider, stronger ring',4:'Widest, strongest Plasma Field'}},
  stormmark:{name:'Storm Mark',emoji:'🎯',cd:9,color:0xffe066,desc:'Lightning strikes the toughest enemy on screen and marks it for 1 second while Taro fires a fan of Sparks straight at it. Every Spark homes in on the mark and deals +50% damage to it. When the mark ends, it explodes with a second strike. No target on screen: just the Spark storm.',tiers:{2:'Stronger strike and blast',3:'Even stronger strike and blast',4:'Strongest Storm Mark'}},
  sparkstorm:{name:'Spark Storm',emoji:'⚡',cd:9,color:0xffe066,desc:'Taro spins and sprays 36 Sparks in two full clockwise circles. Each Spark pierces, homes on bosses and explodes after about a second, blasting nearby enemies.',tiers:{2:'Stronger sparks and blasts',3:'Even stronger sparks and blasts',4:'Strongest sparks and blasts'}},
  overcharge:{name:'Sentry Overdrive',emoji:'💥',cd:9,color:0xb388ff,desc:'Up to 3 sentries switch to Overdrive for 3 seconds: every pulse fires Ball Lightning in all directions and they attack 50% faster, then return to normal.',tiers:{2:'+1 orb per ring, stronger orbs',3:'+2 orbs per ring, stronger orbs',4:'+3 orbs per ring, strongest orbs'}}
};
const CHARACTER_UNIQUES = {
  citrusParade:{name:'Citrus Command',emoji:'🍋',cd:13,color:0xffd85e,desc:'Hold to aim, release: your companion does its big move at the spot, then fights In Sync for 4s (🎯 bonus +50%).'},
  berryRebound:{name:'Strawberry Rebound',emoji:'🍓',cd:8,color:0xff76a8,desc:'Ricochet: bouncing seeds and healing. Sniper: hold/aim/release a piercing beam. Shotgun: hold/aim/release Berry Blast'},
  mintSanctuary:{name:'Mint Gale',emoji:'🌬️',cd:10,color:0x8fd0ff,desc:'A cool gust wraps around you — run much faster for a few seconds, ignore slows and push nearby enemies away'},
  voidPull:{name:'Dark Chocolate Void',emoji:'🕳️',cd:13,color:0x8b5cf0,desc:'Opens a black hole that pulls enemies in for continuous damage, then implodes'},
  flickerStrike:{name:'Bear Slam',emoji:'🐻',cd:20,color:0x9f6bff,desc:'Tap once to slam nearby enemies. Brawler: moving Chocolate Cyclone. Titan: targeted Colossus Fist. Dash Boxer: Phantom Rush with temporary Dash charges'},
  pathRecall:{name:'Storm Beacon',emoji:'🗼',cd:8.5,color:0xb388ff,desc:'Lightning strikes the ground around Taro, then a special sentry stands there firing Ball Lightning. While it stands, your sentries fire 50% faster. Works before choosing a build; recasting replaces it.'},
  oathMirror:{name:'Prism Barrage',emoji:'🔮',cd:12,color:0xc86bff,desc:'Channels the mirror, then unleashes sweeping prism beams with a heavy central beam that shreds bosses'},
  jamOverdrive:{name:'Jam Overdrive',emoji:'💗',cd:10.5,color:0xff5f88,desc:'Overdrives the heart-seed gun, firing lock-on barrages and adding barrels as it levels'},
};
const UNIQUE_MAX_LV=4;
const uniqueAt={2:3,3:7,4:11};   // run level milestones shared by UI, progression, and validation
const UNIQUE_TIERS={
  citrusParade:{2:'Stronger companion special',3:'Stronger companion special',4:'Strongest companion special'},
  berryRebound:{2:'More seeds and more HP recovery',3:'Stronger seeds with a wider spread',4:'Berry Crown fires 20+ seeds with max healing'},
  mintSanctuary:{2:'Faster and longer gale',3:'Stronger push when it starts',4:'Tailwind — the longest, fastest gale'},
  voidPull:{2:'Wider hole that pulls harder',3:'Lasts longer + stronger DoT',4:'Singularity — a giant hole pulls the whole screen and ends in a violent blast'},
  flickerStrike:{2:'More power and wider Bear Slam',3:'Stronger impact',4:'Largest Bear Slam'},
  pathRecall:{2:'Stronger Beacon, lasts 6 seconds',3:'Stronger Beacon, lasts 7 seconds',4:'Strongest Beacon, lasts 8 seconds'},
  oathMirror:{2:'More beams and volleys',3:'Longer, harder-hitting beams',4:'Perfect Oath — heals HP after the barrage'},
  jamOverdrive:{2:'More barrels and salvos',3:'Fires faster and pierces one enemy',4:'Berry Barrage — three barrels pierce the crowd at full power'},
};

/* ---- TALENTS: ผังพรสวรรค์ (แยกแต้มต่อตัวละคร) · ลง 1 แต้ม/rank · ผลใส่ตอน applyMeta ---- */
/* ---- CHAR_TALENTS: "Talents" — ยกระดับ Unique Skill และสไตล์เล่นของตัวละคร ---- */
const TALENT_ICON_FRAMES = {
  "momo": {
    "hp": 0,
    "dmg": 1,
    "crit": 2,
    "cdr": 3,
    "regen": 4,
    "twinSprinkle": 5,
    "pt_sniper_root": 6,
    "pt_sniper_a1": 7,
    "pt_sniper_a2": 8,
    "pt_sniper_b1": 9,
    "pt_sniper_b2": 10,
    "pt_sniper_c1": 11,
    "pt_sniper_c2": 12,
    "pt_sniper_capA": 13,
    "pt_sniper_capB": 14,
    "pt_sniper_capC": 15,
    "pt_shotgun_root": 16,
    "pt_shotgun_a1": 17,
    "pt_shotgun_a2": 18,
    "pt_shotgun_b1": 19,
    "pt_shotgun_b2": 20,
    "pt_shotgun_c1": 21,
    "pt_shotgun_c2": 22,
    "pt_shotgun_capA": 23,
    "pt_shotgun_capB": 24,
    "pt_shotgun_capC": 25,
    "pt_ricochet_root": 26,
    "pt_ricochet_a1": 27,
    "pt_ricochet_a2": 28,
    "pt_ricochet_b1": 29,
    "pt_ricochet_b2": 30,
    "pt_ricochet_c1": 31,
    "pt_ricochet_c2": 32,
    "pt_ricochet_capA": 33,
    "pt_ricochet_capB": 34,
    "pt_ricochet_capC": 35
  },
  "mint": {
    "dmg": 0,
    "hp": 1,
    "armor": 2,
    "regen": 3,
    "lifesteal": 4,
    "magnet": 5,
    "deepFreeze": 6,
    "pt_glacier_root": 7,
    "pt_glacier_a1": 8,
    "pt_glacier_a2": 9,
    "pt_glacier_b1": 10,
    "pt_glacier_b2": 11,
    "pt_glacier_c1": 12,
    "pt_glacier_c2": 13,
    "pt_glacier_capA": 14,
    "pt_glacier_capB": 15,
    "pt_glacier_capC": 16,
    "pt_barrage_root": 17,
    "pt_barrage_a1": 18,
    "pt_barrage_a2": 19,
    "pt_barrage_b1": 20,
    "pt_barrage_b2": 21,
    "pt_barrage_c1": 22,
    "pt_barrage_c2": 23,
    "pt_barrage_capA": 24,
    "pt_barrage_capB": 25,
    "pt_barrage_capC": 26,
    "pt_pierce_root": 27,
    "pt_pierce_a1": 28,
    "pt_pierce_a2": 29,
    "pt_pierce_b1": 30,
    "pt_pierce_b2": 31,
    "pt_pierce_c1": 32,
    "pt_pierce_c2": 33,
    "pt_pierce_capA": 34,
    "pt_pierce_capB": 35,
    "pt_pierce_capC": 36
  },
  "cocoa": {
    "dmg": 0,
    "crit": 1,
    "spd": 2,
    "lifesteal": 3,
    "donutImpact": 4,
    "pt_brawler_root": 5,
    "pt_brawler_a1": 6,
    "pt_brawler_a2": 7,
    "pt_brawler_b1": 8,
    "pt_brawler_b2": 9,
    "pt_brawler_c1": 10,
    "pt_brawler_c2": 11,
    "pt_brawler_capA": 12,
    "pt_brawler_capB": 13,
    "pt_brawler_capC": 14,
    "pt_titan_root": 15,
    "pt_titan_a1": 16,
    "pt_titan_a2": 17,
    "pt_titan_b1": 18,
    "pt_titan_b2": 19,
    "pt_titan_c1": 20,
    "pt_titan_c2": 21,
    "pt_titan_capA": 22,
    "pt_titan_capB": 23,
    "pt_titan_capC": 24,
    "pt_dashboxer_root": 25,
    "pt_dashboxer_a1": 26,
    "pt_dashboxer_a2": 27,
    "pt_dashboxer_b1": 28,
    "pt_dashboxer_b2": 29,
    "pt_dashboxer_c1": 30,
    "pt_dashboxer_c2": 31,
    "pt_dashboxer_capA": 32,
    "pt_dashboxer_capB": 33,
    "pt_dashboxer_capC": 34
  },
  "taro": {
    "hp": 0,
    "spd": 1,
    "cdr": 2,
    "crit": 3,
    "echoPath": 4,
    "pt_storm_root": 5,
    "pt_storm_a1": 6,
    "pt_storm_a2": 7,
    "pt_storm_b1": 8,
    "pt_storm_b2": 9,
    "pt_storm_c1": 10,
    "pt_storm_c2": 11,
    "pt_storm_capA": 12,
    "pt_storm_capB": 13,
    "pt_storm_capC": 14,
    "pt_smite_root": 15,
    "pt_smite_a1": 16,
    "pt_smite_a2": 17,
    "pt_smite_b1": 18,
    "pt_smite_b2": 19,
    "pt_smite_c1": 20,
    "pt_smite_c2": 21,
    "pt_smite_capA": 22,
    "pt_smite_capB": 23,
    "pt_smite_capC": 24,
    "pt_tempest_root": 25,
    "pt_tempest_a1": 26,
    "pt_tempest_a2": 27,
    "pt_tempest_b1": 28,
    "pt_tempest_b2": 29,
    "pt_tempest_c1": 30,
    "pt_tempest_c2": 31,
    "pt_tempest_capA": 32,
    "pt_tempest_capB": 33,
    "pt_tempest_capC": 34
  },
  "yuzu": {
    "hp": 0,
    "dmg": 1,
    "spd": 2,
    "regen": 3,
    "parade": 4,
    "pt_zestSwarm_root": 5,
    "pt_zestSwarm_a1": 6,
    "pt_zestSwarm_a2": 7,
    "pt_zestSwarm_b1": 8,
    "pt_zestSwarm_b2": 9,
    "pt_zestSwarm_c1": 10,
    "pt_zestSwarm_c2": 11,
    "pt_zestSwarm_capA": 12,
    "pt_zestSwarm_capB": 13,
    "pt_zestSwarm_capC": 14,
    "pt_citrusGuardian_root": 15,
    "pt_citrusGuardian_a1": 16,
    "pt_citrusGuardian_a2": 17,
    "pt_citrusGuardian_b1": 18,
    "pt_citrusGuardian_b2": 19,
    "pt_citrusGuardian_c1": 20,
    "pt_citrusGuardian_c2": 21,
    "pt_citrusGuardian_capA": 22,
    "pt_citrusGuardian_capB": 23,
    "pt_citrusGuardian_capC": 24,
    "pt_juiceWorkshop_root": 25,
    "pt_juiceWorkshop_a1": 26,
    "pt_juiceWorkshop_a2": 27,
    "pt_juiceWorkshop_b1": 28,
    "pt_juiceWorkshop_b2": 29,
    "pt_juiceWorkshop_c1": 30,
    "pt_juiceWorkshop_c2": 31,
    "pt_juiceWorkshop_capA": 32,
    "pt_juiceWorkshop_capB": 33,
    "pt_juiceWorkshop_capC": 34
  },
  "sesame": {
    "hp": 0,
    "armor": 1,
    "regen": 2,
    "dmg": 3,
    "mirrorWard": 4,
    "pt_prism_root": 5,
    "pt_prism_a1": 6,
    "pt_prism_a2": 7,
    "pt_prism_b1": 8,
    "pt_prism_b2": 9,
    "pt_prism_c1": 10,
    "pt_prism_c2": 11,
    "pt_prism_capA": 12,
    "pt_prism_capB": 13,
    "pt_prism_capC": 14,
    "pt_lens_root": 15,
    "pt_lens_a1": 16,
    "pt_lens_a2": 17,
    "pt_lens_b1": 18,
    "pt_lens_b2": 19,
    "pt_lens_c1": 20,
    "pt_lens_c2": 21,
    "pt_lens_capA": 22,
    "pt_lens_capB": 23,
    "pt_lens_capC": 24,
    "pt_sentinel_root": 25,
    "pt_sentinel_a1": 26,
    "pt_sentinel_a2": 27,
    "pt_sentinel_b1": 28,
    "pt_sentinel_b2": 29,
    "pt_sentinel_c1": 30,
    "pt_sentinel_c2": 31,
    "pt_sentinel_capA": 32,
    "pt_sentinel_capB": 33,
    "pt_sentinel_capC": 34
  },
  "berry": {
    "dmg": 0,
    "cdr": 1,
    "hp": 2,
    "crit": 3,
    "pressurizedJam": 4
  }
};
const CHAR_TALENTS = {
  momo: [   // สายสมดุล — เก่งWaitบด้าน + คริติคอล
    { id:'hp',      emoji:'❤️', name:'Vitality',  max:5, per:'+8% max HP',   apply:(p,r)=>{ p.maxhp*=(1+0.08*r); } },
    { id:'dmg',     emoji:'💥', name:'Attack Power',  max:5, per:'+6% all damage (adds up)',       apply:(p,r)=>{ p.dmgMul+=((1+0.06*r))-1; } },
    { id:'crit',    emoji:'🎯', name:'Critical',     max:4, per:'+5% crit chance (×1.8)', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'cdr',     emoji:'⏱️', name:'Fast Cast',     max:4, per:'-5% skill cooldown', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'regen',   emoji:'💗', name:'Regen',    max:3, per:'+0.5 HP/s',  apply:(p,r)=>{ p.regen+=0.5*r; } },
    { id:'twinSprinkle',emoji:'🍓', name:'Radiant Heart Seeds', max:1, per:'✦ Unique: Strawberry Rebound bursts seeds in 16 directions!', apply:(p,r)=>{ p.twinSprinkle=true; } },
  ],
  mint: [   // สายแทงค์ — อึดโหด ดูดเลือด ฟื้นตัว
    { id:'dmg',      emoji:'🧊', name:'Frost Lance Mastery', max:5, per:'+8% all damage (adds up)', apply:(p,r)=>{p.dmgMul+=((1+0.08*r))-1;} },
    { id:'hp',       emoji:'❤️', name:'Tough Body',    max:6, per:'+12% max HP',  apply:(p,r)=>{ p.maxhp*=(1+0.12*r); } },
    { id:'armor',    emoji:'🛡️', name:'Ice Armor', max:5, per:'-6% damage taken', apply:(p,r)=>{ p.dmgTakenMul*=(1-0.06*r); } },
    { id:'regen',    emoji:'💗', name:'Cool Recovery',  max:4, per:'+0.7 HP/s',  apply:(p,r)=>{ p.regen+=0.7*r; } },
    { id:'lifesteal',emoji:'🍓', name:'Sweet Leech',    max:3, per:'+0.7 HP on kill', apply:(p,r)=>{ p.lifesteal+=0.7*r; } },
    { id:'magnet',   emoji:'🧲', name:'Keen Nose',     max:3, per:'+15% pickup range',     apply:(p,r)=>{ p.pickup*=(1+0.15*r); } },
    { id:'deepFreeze',emoji:'🌿', name:'Breath Over the Rift', max:1, per:'✦ Unique: Mint\'s breath zone expands its radius!', apply:(p,r)=>{ p.deepFreeze=true; } },
  ],
  cocoa: [   // สายจอมพลัง — ดาเมจ/คริติคอลจัดFull
    { id:'dmg',     emoji:'💥', name:'Destruction',  max:6, per:'+10% all damage (adds up)',      apply:(p,r)=>{ p.dmgMul+=((1+0.10*r))-1; } },
    { id:'crit',    emoji:'🎯', name:'Slayer',     max:5, per:'+6% crit chance (×1.8)', apply:(p,r)=>{ p.critChance+=0.06*r; } },
    { id:'spd',     emoji:'👟', name:'Footwork',     max:3, per:'+5% move speed',    apply:(p,r)=>{ p.baseSpeed*=(1+0.05*r); } },
    { id:'lifesteal',emoji:'🩸', name:'Bloodthirst',    max:3, per:'+0.6 HP on kill', apply:(p,r)=>{ p.lifesteal+=0.6*r; } },
    { id:'donutImpact', emoji:'🐻', name:'Bear-Sigil King', max:1, per:'✦ Unique: Cocoa\'s bear sigil shakes a wider area!', apply:(p,r)=>{ p.donutImpact=true; } },
  ],
  taro: [
    { id:'hp', emoji:'❤️', name:'Explorer Rations', max:4, per:'+8% max HP', apply:(p,r)=>{ p.maxhp*=(1+0.08*r); } },
    { id:'spd', emoji:'👟', name:'Read the Rift', max:6, per:'+5% move speed', apply:(p,r)=>{ p.baseSpeed*=(1+0.05*r); } },
    { id:'cdr', emoji:'⏱️', name:'Recall Rhythm', max:4, per:'-5% skill cooldown', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'crit', emoji:'🎯', name:'Flavor Compass', max:4, per:'+5% crit chance', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'echoPath', emoji:'🧭', name:'Echo Map', max:1, per:'✦ Unique: Plasma Field reaches +40 further · Overcharge and Storm Mark last +1.5s longer!', apply:(p,r)=>{ p.echoPath=true; } },
  ],
  yuzu:[
    {id:'hp',emoji:'❤️',name:'Citrus Skin',max:5,per:'+8% max HP',apply:(p,r)=>{p.maxhp*=1+0.08*r;}},
    {id:'dmg',emoji:'🍋',name:'Crew Spirit',max:5,per:'+6% all damage (adds up)',apply:(p,r)=>{p.dmgMul+=(1+0.06*r)-1;}},
    {id:'spd',emoji:'👟',name:'Leader Pace',max:4,per:'+5% move speed',apply:(p,r)=>{p.baseSpeed*=1+0.05*r;}},
    {id:'regen',emoji:'💚',name:'Fresh Juice',max:4,per:'+0.5 HP/s',apply:(p,r)=>{p.regen+=0.5*r;}},
    {id:'parade',emoji:'👑',name:'Royal Parade',max:1,per:'✦ Unique: In Sync lasts 2s longer',apply:(p,r)=>{p.yuzuParade=true;}}],
  sesame: [
    { id:'hp', emoji:'❤️', name:'Steady Sesame Core', max:6, per:'+11% max HP', apply:(p,r)=>{ p.maxhp*=(1+0.11*r); } },
    { id:'armor', emoji:'🛡️', name:'Oath Architecture', max:5, per:'-6% damage taken', apply:(p,r)=>{ p.dmgTakenMul*=(1-0.06*r); } },
    { id:'regen', emoji:'💗', name:'Flavor Lantern', max:4, per:'+0.6 HP/s', apply:(p,r)=>{ p.regen+=0.6*r; } },
    { id:'dmg', emoji:'💥', name:'Counter Seal', max:4, per:'+6% all damage (adds up)', apply:(p,r)=>{ p.dmgMul+=((1+0.06*r))-1; } },
    { id:'mirrorWard', emoji:'🪞', name:'Perfect Mirror Architecture', max:1, per:'✦ Unique: more mirrors, duration, and reflected shots!', apply:(p,r)=>{ p.mirrorWard=true; } },
  ],
  berry: [
    { id:'dmg', emoji:'💥', name:'Jam Core Pressure', max:5, per:'+7% all damage (adds up)', apply:(p,r)=>{ p.dmgMul+=((1+0.07*r))-1; } },
    { id:'cdr', emoji:'⏱️', name:'Fast Heart Trigger', max:4, per:'-5% skill cooldown', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'hp', emoji:'❤️', name:'Packed Mochi', max:4, per:'+9% max HP', apply:(p,r)=>{ p.maxhp*=(1+0.09*r); } },
    { id:'crit', emoji:'🎯', name:'Seed Sights', max:4, per:'+5% crit chance', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'pressurizedJam', emoji:'💗', name:'Twin Pressure Chamber', max:1, per:'✦ Unique: Jam Overdrive adds 2 salvos and rounds per barrel!', apply:(p,r)=>{ p.pressurizedJam=true; } },
  ],
};
// v7.6 เจ้าของ: Unique ไม่อัปในด่านแล้ว · อัปได้ที่ Talent เท่านั้น (โหนด Core ทุกตัวละคร ไม่ต้องปลดก่อน · TP 3/5/8)
const UNIQUE_TALENT={id:'unique',emoji:'✨',name:'Unique Mastery',max:3,costs:[3,5,8],free:true,per:'+1 Unique level · stronger, faster Unique',apply:(p,r)=>{p.uniqueTalLv=1+r;}};
function charTalents(c){ return (CHAR_TALENTS[c]||CHAR_TALENTS.momo).concat([UNIQUE_TALENT]); }
function uniqueTalentLevel(c){ try{ const r=((Save.cp(c).tal)||{}).unique||0; return Math.max(1,Math.min(UNIQUE_MAX_LV,1+r)); }catch(e){ return 1; } }
// v6.52.1: Talent tree แบบสายตระกูล — 1 สายต่อ Build Path (ทำงานเฉพาะรันที่เลือกสายนั้น)
// v6.55.39 Talent เฉพาะสาย (docs/TALENT_PATH_DESIGN.md): Root + กิ่ง A Power / B Mechanic / C Survival (2 node) + Capstone 3 ตัว เลือกได้ 1 (5 TP)
// PATH_TALENTS[path] ใส่ node เฉพาะสายทับค่าเริ่มต้น (commit ถัดไปทีละตัวละคร) · capstone ที่ยังไม่มี = Coming soon
const _K=(k,v)=>(p,r)=>{p._pt=p._pt||{};p._pt[k]=(p._pt[k]||0)+v*r;};
// fx แบบ pathMods (dmg/cd คูณ ต่อ rank · อื่นบวก) → รวมเข้า b._pm ใน syncBasicAttack
const _P=(fx)=>(p,r)=>{p._pt=p._pt||{};(p._pt.fx=p._pt.fx||[]).push([fx,r]);};
function ptMergeFx(m,P){ for(const [fx,n] of ((P&&P.fx)||[]))for(const k in fx){ if(k==='dmg'||k==='cd')m[k]*=Math.pow(fx[k],n); else m[k]=(m[k]||0)+fx[k]*n; } return m; }
const PATH_TALENTS={
  citrusGuardian:{root:{soon:false,emoji:'✦',name:"Pomelo Strength",max:3,per:"+6% Companion and Minion hits",apply:_K('yzDmg',0.06)},a1:{soon:false,emoji:'✦',name:"Thick Heart",max:3,per:"+15% Yuzu shield strength",apply:_K('yzHp',0.15)},a2:{soon:false,emoji:'✦',name:"Wide Landing",max:3,per:"+12px Pulp Slam and Meteor Peel radius",apply:_K('yzSlam',12)},b1:{soon:false,emoji:'✦',name:"Slam Rhythm",max:3,per:"Pomelo skills recharge 5% sooner",apply:_K('yzSkill',0.05)},b2:{soon:false,emoji:'✦',name:"Orchard Lessons",max:3,per:"Companion attacks and skills recharge 8% sooner",apply:_K('yzRipen',0.08)},c1:{soon:false,emoji:'✦',name:"Sheltering Peel",max:3,per:"4% less damage near Pomelo",apply:_K('yzGuard',0.04)},c2:{soon:false,emoji:'✦',name:"Quick Reunion",max:2,per:"Companion skills recharge 4% sooner",apply:_K('yzRecover',0.04)},capA:{soon:false,emoji:'✦',name:"Rolling Champion",max:1,per:"Rolling Pomelo recharges 30% sooner",apply:_K('yzRoll',0.3)},capB:{soon:false,emoji:'✦',name:"Fortress Captain",max:1,per:"In Sync after Meteor Peel lasts 2s longer",apply:_K('yzUniqueTime',2)},capC:{soon:false,emoji:'✦',name:"Peel Promise",max:1,per:"Unique grants an extra 12% max-HP shield",apply:_K('yzReviveShield',1)}},
  zestSwarm:{root:{soon:false,emoji:'✦',name:"Lime Strength",max:3,per:"+6% Companion and Minion hits",apply:_K('yzDmg',0.06)},a1:{soon:false,emoji:'✦',name:"Longbow",max:3,per:"+8% damage beyond 250px",apply:_K('yzFar',0.08)},a2:{soon:false,emoji:'✦',name:"Full Quiver",max:3,per:"+1 Zest Volley arrow",apply:_K('yzArrows',1)},b1:{soon:false,emoji:'✦',name:"Volley Rhythm",max:3,per:"Lime skills recharge 5% sooner",apply:_K('yzSkill',0.05)},b2:{soon:false,emoji:'✦',name:"Trap Setter",max:3,per:"Sour Trap recharges 6% sooner · needs the Sour Snare card in a run",apply:_K('yzTrap',0.06)},c1:{soon:false,emoji:'✦',name:"Green Heart",max:3,per:"+15% Yuzu shield strength",apply:_K('yzHp',0.15)},c2:{soon:false,emoji:'✦',name:"Quick Reunion",max:2,per:"Companion skills recharge 4% sooner",apply:_K('yzRecover',0.04)},capA:{soon:false,emoji:'✦',name:"Raincaller",max:1,per:"+35px Piercing Shot burst radius",apply:_K('yzRain',35)},capB:{soon:false,emoji:'✦',name:"First Impression",max:1,per:"First-hit critical arrows deal 25% more damage",apply:_K('yzOpener',0.25)},capC:{soon:false,emoji:'✦',name:"Leaf Shelter",max:1,per:"Dash grants an 8% max-HP shield for 2s",apply:_K('yzDashShield',1)}},
  juiceWorkshop:{root:{soon:false,emoji:'✦',name:"Blood Orange Strength",max:3,per:"+6% Companion and Minion hits",apply:_K('yzDmg',0.06)},a1:{soon:false,emoji:'✦',name:"Acid Notes",max:3,per:"Sour-marked enemies take 4% more damage",apply:_K('yzSour',0.04)},a2:{soon:false,emoji:'✦',name:"Honey Notes",max:3,per:"Honey Rescue heals 1% more max HP · needs the Honey Alchemy card in a run",apply:_K('yzHeal',0.01)},b1:{soon:false,emoji:'✦',name:"Spell Rhythm",max:3,per:"Flavor spells recharge 5% sooner",apply:_K('yzSkill',0.05)},b2:{soon:false,emoji:'✦',name:"Slow Steep",max:3,per:"Sour Garden patches last 0.5s longer · needs the Steeped Flavor card in a run",apply:_K('yzDuration',0.5)},c1:{soon:false,emoji:'✦',name:"Crimson Heart",max:3,per:"+15% Yuzu shield strength",apply:_K('yzHp',0.15)},c2:{soon:false,emoji:'✦',name:"Quick Reunion",max:2,per:"Companion skills recharge 4% sooner",apply:_K('yzRecover',0.04)},capA:{soon:false,emoji:'✦',name:"Fragrant Garden",max:1,per:"Aroma slows enemies 10% more",apply:_K('yzAroma',0.1)},capB:{soon:false,emoji:'✦',name:"Grand Alchemist",max:1,per:"In Sync after Flavor Storm lasts 2s longer",apply:_K('yzUniqueTime',2)},capC:{soon:false,emoji:'✦',name:"Lasting Sweetness",max:1,per:"Citrus shields last 2s longer",apply:_K('yzShieldTime',2)}},
  sniper:{root:{emoji:'🎯',name:'Steady Aim',max:3,per:'+10% Sniper seed damage',apply:_K('sDmg',0.10)},
    a1:{emoji:'💀',name:'Headhunter',max:3,per:'+5% headshot chance',apply:_K('hs',0.05)},
    a2:{emoji:'🔩',name:'Overpenetration',max:3,per:'+10% damage per enemy already pierced',apply:_K('pen',0.10)},
    b1:{emoji:'⏱️',name:'Fast Chamber',max:3,per:'Charged Unique charges 10% faster',apply:_K('chg',0.10)},
    b2:{emoji:'💨',name:'Dash Reload',max:2,per:'After a dash, next seed is a guaranteed headshot',apply:_K('hsDash',1)},
    c1:{emoji:'🌿',name:'Camouflage',max:3,per:'Standing still 0.6s: −6% damage taken',apply:_K('still',0.06)},
    c2:{emoji:'👑',name:'Big Game',max:3,per:'+12% damage to bosses/elites',apply:_K('big',0.12)},
    capA:{emoji:'☠️',name:'One Shot',max:1,per:'Headshots execute normal enemies · ×4 on bosses',apply:_K('oneShot',1)},
    capB:{emoji:'⚡',name:'Railgun',max:1,per:'Full charged Unique fires a second beam 0.4s later',apply:_K('railgun',1)},
    capC:{emoji:'🍃',name:'Ghillie',max:1,per:'Still 1.5s: −60% damage taken and next seed ×2',apply:_K('ghillie',1)}},
  shotgun:{root:{emoji:'💥',name:'Point Blank+',max:3,per:'+6% close-range bonus',apply:_K('close',0.06)},
    a1:{emoji:'🎯',name:'Slug Core',max:3,per:'Centre pellet +20% damage',apply:_K('slug',0.20)},
    a2:{emoji:'🥊',name:'Close Quarters',max:3,per:'Within 120px: +10% damage',apply:_K('cq',0.10)},
    b1:{emoji:'➕',name:'Extra Shell',max:2,per:'+1 pellet',apply:_K('shell',1)},
    b2:{emoji:'🌬️',name:'Stopping Power',max:3,per:'Pellets knock enemies back harder',apply:_K('kb',1)},
    c1:{emoji:'💪',name:'Bulk Up',max:3,per:'+8% max HP',apply:(p,r)=>{const f=1+0.08*r;p.maxhp*=f;p.hp=Math.min(p.maxhp,(p.hp||p.maxhp)*f);}},
    c2:{emoji:'🐚',name:'Shell Shield',max:3,per:'5+ enemies nearby: −8% damage taken',apply:_K('surround',0.08)},
    capA:{emoji:'🔥',name:'Dragon Breath',max:1,per:'Pellets set enemies on fire',apply:_K('dragon',1)},
    capB:{emoji:'🔫',name:'Double Barrel',max:1,per:'Every 4th volley fires twice',apply:_K('dbarrel',1)},
    capC:{emoji:'↩️',name:'Recoil Dash',max:1,per:'Each volley hops you back · brief invulnerability (1.2s cd)',apply:_K('recoil',1)}},
  ricochet:{root:{emoji:'💞',name:'Rubber Seeds',max:3,per:'+4% damage · rank 3: +1 bounce',apply:_K('rDmg',0.04)},
    a1:{emoji:'📈',name:'Momentum',max:3,per:'+6% damage gained per bounce',apply:_K('mom',0.06)},
    a2:{emoji:'🎯',name:'Last Bounce',max:2,per:'Final bounce +25% damage',apply:_K('last',0.25)},
    b1:{emoji:'🧭',name:'Seeker',max:3,per:'Bounce search range +20%',apply:_K('seek',0.20)},
    b2:{emoji:'🔀',name:'Split Bounce',max:3,per:'15% chance a bounce splits into an extra seed',apply:_K('split',0.15)},
    c1:{emoji:'🧃',name:'Juice Sip',max:2,per:'Every 20 bounces heal 1% max HP',apply:_K('sip',1)},
    c2:{emoji:'🧱',name:'Bouncy Skin',max:2,per:'When hit, release 3 bouncing seeds',apply:_K('skin',1)},
    capA:{emoji:'🎰',name:'Pinball',max:1,per:'Seeds bounce up to 12 times',apply:_K('pinball',1)},
    capB:{emoji:'🪃',name:'Boomerang',max:1,per:'After the last bounce, seeds fly back through enemies',apply:_K('boomer',1)},
    capC:{emoji:'🍬',name:'Sugar Loop',max:1,per:'Bounce near you grants a shield (max 2, 6s cd)',apply:_K('loop',1)}},
  glacier:{root:{emoji:'🧊',name:'Cold Core',max:3,per:'+8% damage to Frozen/Brittle enemies',apply:_P({frozen:0.08})},
    a1:{emoji:'🥶',name:'Brittle',max:3,per:'+10% damage to Frozen/Brittle enemies',apply:_P({frozen:0.10})},
    a2:{emoji:'🏔️',name:'Glacier Weight',max:3,per:'+10% damage to bosses/elites',apply:_P({big:0.10})},
    b1:{emoji:'⏱️',name:'Cold Rhythm',max:3,per:'−4% lance cooldown',apply:_P({cd:0.96})},
    b2:{emoji:'🌬️',name:'Frost Reach',max:3,per:'+8% lance range',apply:_P({range:0.08})},
    capA:{emoji:'❄️',name:'Absolute Zero',max:1,per:'Freezing needs 1 less Chill stack',apply:_K('azero',1)},
    capB:{emoji:'💥',name:'Shatter Nova',max:1,per:'Each freeze blasts nearby enemies',apply:_K('fnova',1)},
    capC:{emoji:'🛡️',name:'Frost Armor',max:1,per:'Each freeze: −30% damage taken for 3s',apply:_K('farmor',1)}},
  barrage:{root:{emoji:'🌨️',name:'Sharp Volley',max:3,per:'+5% lance hit (multiplies)',apply:_P({dmg:1.05})},
    a1:{emoji:'🔪',name:'Honed Tips',max:3,per:'+6% lance hit (multiplies)',apply:_P({dmg:1.06})},
    a2:{emoji:'🎯',name:'Long Volley',max:3,per:'+10% damage beyond 300px',apply:_P({far:0.10})},
    b1:{emoji:'⏱️',name:'Quick Hands',max:3,per:'−5% lance cooldown',apply:_P({cd:0.95})},
    b2:{emoji:'📏',name:'Reach',max:3,per:'+6% lance range',apply:_P({range:0.06})},
    capA:{emoji:'🌪️',name:'Lance Storm',max:1,per:'+1 lance (max 3); at cap: +18% shard damage',apply:_P({count:1})},
    capB:{emoji:'⚡',name:'Rapid Frost',max:1,per:'−25% lance cooldown',apply:_P({cd:0.75})},
    capC:{emoji:'💨',name:'Cold Stride',max:1,per:'While moving: −15% damage taken',apply:_K('moveGuard',0.15)}},
  pierce:{root:{emoji:'🏹',name:'Heavy Shaft',max:3,per:'+6% lance hit (multiplies)',apply:_P({dmg:1.06})},
    a1:{emoji:'👑',name:'Giant Piercer',max:3,per:'+10% damage to bosses/elites',apply:_P({big:0.10})},
    a2:{emoji:'🔭',name:'Sniper’s Lance',max:3,per:'+12% damage beyond 300px',apply:_P({far:0.12})},
    b1:{emoji:'📏',name:'Long Reach',max:3,per:'+8% lance range',apply:_P({range:0.08})},
    b2:{emoji:'⏱️',name:'Steady Draw',max:3,per:'−4% lance cooldown',apply:_P({cd:0.96})},
    capA:{emoji:'🗡️',name:'Glacial Spear',max:1,per:'+40% damage to bosses/elites',apply:_P({big:0.40})},
    capB:{emoji:'🌠',name:'Long Shot',max:1,per:'+35% damage beyond 300px · +30% range',apply:_P({far:0.35,range:0.30})},
    capC:{emoji:'🧱',name:'Ice Wall',max:1,per:'Still 0.6s: −40% damage taken',apply:_K('stillWall',1)}},
  brawler:{root:{emoji:'🔥',name:'Ember Fists',max:3,per:'+5% fist hit (multiplies)',apply:_P({dmg:1.05})},
    a1:{emoji:'🎯',name:'Long Shot',max:3,per:'+12% fist range',apply:_K('ffRange',0.12)},
    a2:{emoji:'💥',name:'Blast Core',max:3,per:'+10% fireball blast size',apply:_K('ffBlast',0.10)},
    b1:{emoji:'🌶️',name:'Burning Knuckles',max:3,per:'Fists leave fire patches · +20% fire damage',apply:_K('ffBurn',0.20)},
    b2:{emoji:'✌️',name:'Twin Spark',max:3,per:'+10% chance to fire a second fist',apply:_K('ffTwin',0.10)},
    capA:{emoji:'☄️',name:'Meteor Finisher',max:1,per:'5th-punch fireball calls 2 fire meteors',apply:_K('ffMeteor',1)},
    capB:{emoji:'🌀',name:'Barrage',max:1,per:'−20% fist cooldown',apply:_P({cd:0.80})},
    capC:{emoji:'🛡️',name:'Fire Shield',max:1,per:'−20% damage taken',apply:_K('chin',0.20)}},
  titan:{root:{emoji:'🗿',name:'Stone Fist',max:3,per:'+6% Basic hit (multiplies)',apply:_P({dmg:1.06})},
    a1:{emoji:'⏩',name:'Quick Rage',max:3,per:'Blood Rage charges 10% faster',apply:_K('trSpeed',0.10)},
    a2:{emoji:'👊',name:'Crushing Release',max:3,per:'+10% Colossus Fist damage',apply:_K('trRel',0.10)},
    b1:{emoji:'🩸',name:'Iron Veins',max:3,per:'Blood Rage costs 8% less HP',apply:_K('trCost',0.08)},
    b2:{emoji:'💗',name:'Stone Regen',max:3,per:'+0.3% max HP/s Titan regen',apply:_K('trRegen',0.003)},
    capA:{emoji:'🔥',name:'Rage Overflow',max:1,per:'Max-Rage release deals ×1.3 damage and doubles the regen after release',apply:_K('rage4',1)},
    capB:{emoji:'🪨',name:'Iron Body',max:1,per:'−30% damage taken while charging',apply:_K('trGuard',0.30)},
    capC:{emoji:'🧛',name:'Bloodlust',max:1,per:'Kills while charging heal 1% max HP',apply:_K('trLust',1)}},
  dashboxer:{root:{emoji:'🐾',name:'Bear Rush',max:3,per:'+5% combo hit (multiplies)',apply:_P({dmg:1.05})},
    a1:{emoji:'🦘',name:'Far Leap',max:3,per:'+10% Dash Leap range',apply:_K('dbLeap',0.10)},
    a2:{emoji:'👑',name:'Hit and Run',max:3,per:'+10% damage to bosses/elites',apply:_P({big:0.10})},
    b1:{emoji:'💢',name:'Heavy Landing',max:3,per:'+12% landing slam damage',apply:_K('dbSlam',0.12)},
    b2:{emoji:'🔋',name:'Quick Refund',max:3,per:'Phantom Rush cooldown −5% per rank',apply:_K('dbRefund',0.25)},   /* v8.2.78 Dash ไม่ลดคูลดาวน์แล้ว → −5%/ขั้น */
    capA:{emoji:'🌪️',name:'Afterimage',max:1,per:'Dash buff +80% combo damage',apply:_P({dashm:0.80})},
    capB:{emoji:'♾️',name:'Endless Dash',max:1,per:'+3 Dash charges',apply:_P({dashc:3})},
    capC:{emoji:'🍃',name:'Slip',max:1,per:'While Dash buff is active: −30% damage taken',apply:_K('dashGuard',1)}},
  storm:{root:{emoji:'🌩️',name:'Charged Air',max:3,per:'+5% lightning hit (multiplies)',apply:_P({dmg:1.05})},
    a1:{emoji:'✨',name:'Static Build',max:3,per:'+6% lightning hit (multiplies)',apply:_P({dmg:1.06})},
    a2:{emoji:'👑',name:'Conductor',max:3,per:'+10% damage to bosses/elites',apply:_P({big:0.10})},
    b1:{emoji:'⏱️',name:'Quick Spark',max:3,per:'−4% basic attack interval',apply:_P({cd:0.96})},
    b2:{emoji:'📡',name:'Wide Arc',max:3,per:'+8% basic root and jump range',apply:_P({range:0.08})},
    capA:{emoji:'⛈️',name:'Thunderhead',max:1,per:'+2 basic roots; excess adds bolt damage',apply:_P({count:2})},
    capB:{emoji:'⚡',name:'Overcharge',max:1,per:'+20% lightning hit (multiplies)',apply:_P({dmg:1.20})},
    capC:{emoji:'🧲',name:'Grounded',max:1,per:'While moving: −20% damage taken',apply:_K('moveGuard',0.20)}},
  smite:{root:{emoji:'🔨',name:'Heavy Bolt',max:3,per:'+6% lightning hit (multiplies)',apply:_P({dmg:1.06})},
    a1:{emoji:'🎯',name:'Judgment+',max:3,per:'+10% damage to bosses/elites',apply:_P({big:0.10})},
    a2:{emoji:'🩸',name:'Wrath',max:3,per:'+10% damage below 50% HP',apply:_P({low:0.10})},
    b1:{emoji:'⏱️',name:'Steady Prayer',max:3,per:'−4% basic attack interval',apply:_P({cd:0.96})},
    b2:{emoji:'📡',name:'Long Reach',max:3,per:'+8% priority target range',apply:_P({range:0.08})},
    capA:{emoji:'🌟',name:'Divine Hammer',max:1,per:'+40% damage to bosses/elites',apply:_P({big:0.40})},
    capB:{emoji:'☁️',name:'Heavy Sky',max:1,per:'+30% Basic hit (multiplies) · basic 10% slower',apply:_P({dmg:1.30,cd:1.10})},
    capC:{emoji:'⛪',name:'Sanctuary',max:1,per:'Still 0.6s: −40% damage taken',apply:_K('stillWall',1)}},
  tempest:{root:{emoji:'🌪️',name:'Swift Storm',max:3,per:'−4% basic attack interval',apply:_P({cd:0.96})},
    a1:{emoji:'✨',name:'Sharp Wind',max:3,per:'+6% lightning hit (multiplies)',apply:_P({dmg:1.06})},
    a2:{emoji:'🔭',name:'Far Strike+',max:3,per:'+10% hit damage beyond 300px',apply:_P({far:0.10})},
    b1:{emoji:'⏩',name:'Gale+',max:3,per:'−4% basic attack interval',apply:_P({cd:0.96})},
    b2:{emoji:'📡',name:'Wide Gust',max:3,per:'+8% weak basic target range',apply:_P({range:0.08})},
    capA:{emoji:'🌀',name:'Hurricane',max:1,per:'−25% weak basic interval',apply:_P({cd:0.75})},
    capB:{emoji:'👁️',name:'Eye of the Storm',max:1,per:'+35% hit damage beyond 300px',apply:_P({far:0.35})},
    capC:{emoji:'💨',name:'Wind Step',max:1,per:'While moving: −20% damage taken',apply:_K('moveGuard',0.20)}}};
const TAL_CAP_COST=5, TAL_SLOTS=['root','a1','a2','b1','b2','c1','c2','capA','capB','capC'];
function _ptGeneric(pt){ return {
  root:{emoji:pt.emoji||'✦',name:'Path Focus',max:3,per:'+5% all damage (adds up)',apply:(p,r)=>{p.dmgMul+=0.05*r;}},
  a1:{emoji:'🎯',name:'Sharpness',max:3,per:'+3% crit chance',apply:(p,r)=>{p.critChance+=0.03*r;}},
  a2:{emoji:'👑',name:'Giant Hunter',max:3,per:'+8% boss damage',apply:(p,r)=>{p.bossDmg=(p.bossDmg||0)+0.08*r;}},
  b1:{emoji:'⏱️',name:'Tempo',max:3,per:'−4% cooldown',apply:(p,r)=>{p.cdMul*=(1-0.04*r);}},
  b2:{emoji:'💨',name:'Quick Step',max:3,per:'−6% dash cooldown',apply:(p,r)=>{p.dashCdMul=(p.dashCdMul||1)*(1-0.06*r);}},
  c1:{emoji:'🛡️',name:'Resolve',max:3,per:'+6% max HP',apply:(p,r)=>{const f=1+0.06*r;p.maxhp*=f;p.hp=Math.min(p.maxhp,(p.hp||p.maxhp)*f);}},
  c2:{emoji:'🧱',name:'Guard',max:2,per:'−5% damage taken',apply:(p,r)=>{p.dmgTakenMul*=(1-0.05*r);}},
  capA:{emoji:'💥',name:'Power Capstone',max:1,soon:true,per:'Coming soon'},
  capB:{emoji:'⚙️',name:'Mechanic Capstone',max:1,soon:true,per:'Coming soon'},
  capC:{emoji:'🛡️',name:'Survival Capstone',max:1,soon:true,per:'Coming soon'} }; }
function talentBranch(pt){ const g=_ptGeneric(pt),o=PATH_TALENTS[pt.id]||{},b='pt_'+pt.id+'_';
  return TAL_SLOTS.map(sl=>{const node=Object.assign({},g[sl],o[sl]||{},{id:b+sl,slot:sl,cap:sl.startsWith('cap')});const overlay=pt.name==='Spark Build'?{root:['Charged Sparks','+6% Spark power'],b1:['Quick Sparks','−4% Spark cast interval'],b2:['Long Current','+8% Spark targeting/travel range'],capB:['Heavy Current','+30% Spark power · casts 10% slower']}:pt.name==='Sentry Build'?{root:['Quick Setup','−4% sentry pulse interval'],b1:['Rapid Circuit','−4% sentry pulse interval'],b2:['Long Conductor','+8% sentry targeting range'],capA:['Rapid Grid','−25% sentry pulse interval']}:{};if(overlay[sl]){node.name=overlay[sl][0];node.per=overlay[sl][1];}return node;}); }
function talNodeCost(n,r){ return n&&n.cap?TAL_CAP_COST:r+1; }
// กติกาปลด: root เสมอ · x1 ต้อง root ≥1 · x2 ต้อง x1 ≥2 · cap ต้อง x2 ≥1 และยังไม่มี cap อื่น
function talNodeOpen(nodes,tal,n){ const by={};for(const x of nodes)by[x.slot]=x;const r=s=>tal[by[s].id]||0;
  if(n.slot==='root')return true; const br=n.slot[n.slot.length-1]==='1'||n.slot[n.slot.length-1]==='2'?n.slot[0]:n.slot.slice(3).toLowerCase();
  if(n.slot.endsWith('1'))return r('root')>=1; if(n.slot.endsWith('2'))return r(br+'1')>=2;
  if(n.cap){ if(n.soon)return false; if(['capA','capB','capC'].some(c=>c!==n.slot&&r(c)>0))return false; return r(br+'2')>=1; } return false; }
function talCost(r){ return r+1; }          // แต้มที่ต้องใช้อัปจาก rank r → r+1 (แพงขึ้นเรื่อย ๆ = ต้องเลือก)
function talSpent(tal){ let n=0; for(const k in tal||{}){ const r=tal[k]||0; n+=k==='unique'?UNIQUE_TALENT.costs.slice(0,r).reduce((a,b)=>a+b,0):/_cap[ABC]$/.test(k)?r*TAL_CAP_COST:r*(r+1)/2; } return n; }
function applyPathTalents(p,ch,path,tal){ const pt=(BASIC_PATHS[ch]||[]).find(x=>x.id===path); if(!pt||!tal)return; p._pt={}; for(const d of talentBranch(pt)){const r=tal[d.id]||0;if(r>0&&d.apply)d.apply(p,r);} }
// v4.88: Passive ประจำตัว (ทำงานตลอด · แรงขึ้นตามเลเวลตัวละคร)
/* v8.1.42 เจ้าของ: Sesame ไม่มี Build → ต้น Talent "Runes" ต้นเดียว · กิ่ง a=Power b=Motion c=Binding · capstone เลือก 1 */
const SES_RUNE_PT={id:'sesRune',name:'Runes',emoji:'🔮'};
PATH_TALENTS.sesRune={
  root:{soon:false,emoji:'🔮',name:'Rune Attunement',max:3,per:'+5% rune spell damage',apply:_K('srDmg',0.05)},
  a1:{soon:false,emoji:'🔥',name:'Heavy Runes',max:3,per:'+5% spell damage per Power rune in the recipe',apply:_K('srP',0.05)},
  a2:{soon:false,emoji:'👑',name:'Giant Breaker',max:3,per:'+8% rune spell damage to bosses and minibosses',apply:_K('srBoss',0.08)},
  b1:{soon:false,emoji:'🌀',name:'Swift Runes',max:3,per:'−3% spell cooldown per Motion rune in the recipe',apply:_K('srM',0.03)},
  b2:{soon:false,emoji:'⏱️',name:'Quick Weave',max:3,per:'−4% all rune spell cooldowns',apply:_K('srCd',0.04)},
  c1:{soon:false,emoji:'🛡️',name:'Warded Body',max:3,per:'+6% max HP',apply:(p,r)=>{const f=1+0.06*r;p.maxhp*=f;p.hp=Math.min(p.maxhp,(p.hp||p.maxhp)*f);}},
  c2:{soon:false,emoji:'🧱',name:'Binding Grip',max:2,per:'−5% damage taken',apply:(p,r)=>{p.dmgTakenMul*=(1-0.05*r);}},
  capA:{soon:false,emoji:'☄️',name:'Overload',max:1,per:'Power Power Power deals +35% damage',apply:_K('srPPP',0.35)},
  capB:{soon:false,emoji:'💫',name:'Perpetual Motion',max:1,per:'Motion Motion Motion recovers 30% faster',apply:_K('srMMM',0.30)},
  capC:{soon:false,emoji:'🔱',name:'Threefold Mastery',max:1,per:'Power Motion Binding deals +40% damage and recovers 20% faster',apply:_K('srTri',1)}};
function sesTalentPaths(ch){return ch==='sesame'?[SES_RUNE_PT]:(BASIC_PATHS[ch]||[]);}
function sesRuneTalentMul(pt,key,kind){pt=pt||{};const n=c=>(key||'').split('').filter(x=>x===c).length;if(kind==='dmg'){let m=1+(pt.srDmg||0)+(pt.srP||0)*n('p');if(key==='ppp')m+=pt.srPPP||0;if(key==='pmb'&&pt.srTri)m+=.4;return m;}
  let c=1-Math.min(.3,(pt.srM||0)*n('m'))-(pt.srCd||0);if(key==='mmm'&&pt.srMMM)c*=1-pt.srMMM;if(key==='pmb'&&pt.srTri)c*=.8;return Math.max(.45,c);}
const CHAR_PASSIVES={
  momo:{emoji:'🍓',name:'Lucky Seeds',desc:'Critical hits heal you'},
  mint:{emoji:'❄️',name:'Frost Skin',desc:'Getting hit freezes nearby enemies'},
  cocoa:{emoji:'🐻',name:'Bear Grit',desc:'Below 40% HP: take less damage, deal more'},
  taro:{emoji:'🧭',name:'Rift Step',desc:'Dash: lightning shockwave'},
  yuzu:{emoji:'🍋',name:'Crew Leader',desc:'Your seeds mark the enemy they hit. Your companion attacks the mark first and deals 25% more damage to it. Your companion cannot fall.'},
  sesame:{emoji:'🪞',name:'Oath Focus',desc:'+6% damage for each mirror on the ground (up to 3)'},
  berry:{emoji:'💗',name:'Jam Heart',desc:'Kills have a chance to heal you'},
};
function charPassiveScale(lvl){ return 1+Math.min(0.9,Math.max(0,(lvl||1)-1)*0.03); }
// EXP ที่ต้องใช้เพื่อขึ้นจากเลเวล l → l+1
function characterExpProgress(before,gain,progress){   // v6.55.23: วนตาม charExpNeed (ไม่ผูกสูตรเส้นตรงแล้ว)
  let lvl=Math.max(1,Math.floor(before.lvl||1)),exp=Math.max(0,(before.exp||0)+Math.max(0,gain||0)*Math.max(0,Math.min(1,progress)));
  while(exp>=charExpNeed(lvl)){exp-=charExpNeed(lvl);lvl++;}
  return {lvl,exp,need:charExpNeed(lvl)};
}
function charExpNeed(l){ return Math.round(50 + 40*Math.pow(Math.max(1,l),1.35)); }   // v6.55.23: เดิม 40+35l โตเส้นตรง ขึ้นไวเกิน · Lv1 90 / Lv5 333 / Lv10 945 / Lv20 2.3k

/* ---- SKILL_TIERS: อธิบายว่า "per level" ปลดEffectอะไร (โชว์บนการ์ด) ---- */
const SKILL_TIERS = {
  sprinkle:{ 2:'6 seeds/volley', 3:'Faster fire', 4:'8 seeds/volley', 5:'Even faster', 6:'11 rainbow seeds/volley!' },
  star:    { 2:'+1 star, tighter guard', 3:'Wider ring + faster spin', 4:'+1 bigger star', 5:'Stars spark on hit', 6:'Twin star ring, inner & outer!' },
  thunder: { 2:'2 strikes at once', 3:'Forks to nearby enemies', 4:'3 strikes', 5:'Forks to 2 more', 6:'4 strikes, forks everywhere!' },
  whirl:   { 2:'Cream blades, 8 dirs', 3:'Bigger blades, fly farther', 4:'10 directions', 5:'Huge blades', 6:'12 dirs, pierce enemies!' },
  boomer:  { 2:'Throw 2', 3:'Bigger + faster hits', 4:'Throw 3', 5:'Returns then bounces out again', 6:'Throw 4, cookie storm!' },
  frost:   { 2:'Wider radius + damage', 3:'Ice blast on frozen targets', 4:'Very large radius', 5:'High damage + longer freeze', 6:'Heavy freeze + very high damage!' },
  popcorn: { 2:'+2 kernels', 3:'Bigger kernels', 4:'Pierce + more kernels', 5:'Longer range', 6:'Popcorn blankets the screen!' },
  bubble:  { 2:'+1 bubble', 3:'Longer hold + wider burst', 4:'+1 bubble, better tracking', 5:'Stronger burst', 6:'Chain bubble prison!' },
  mine:    { 2:'Longer range', 3:'Faster + stronger fire', 4:'Deploy 2 turrets', 5:'Lasts longer, wide blast', 6:'Turret army, double-shots!' },
  beam:    { 2:'Longer beam', 3:'Wider + more damage', 4:'Burns harder', 5:'Pierces very far', 6:'Cataclysm beam!' },
  meteor:  { 2:'3 hits', 3:'Wider blast', 4:'4 hits, high damage', 5:'Huge hits', 6:'6-hit barrage!' },
  cloud:   { 2:'Wider cloud', 3:'Higher damage/tick', 4:'Very wide', 5:'Lasts longer', 6:'Toxic mist everywhere!' },
  rocket:  { 2:'2 rockets', 3:'Wider blast', 4:'3 rockets, precise', 5:'Big blast', 6:'4 rockets, barrage!' },
  mirror:  { 2:'Wider reflect ring', 3:'Reflects more', 4:'Stronger shards', 5:'Lasts longer', 6:'Thousand-Flavor auto-return fire!' },
  decoy:   { 2:'Lures longer', 3:'Wider blast radius', 4:'Stronger blast', 5:'Lures from farther', 6:'Double blast and heals HP!' },
};

/* ---- COMBOS: Attack Skill (a) + Passive (b) เข้าคู่กัน = ปลดโบนัส (ธง this.comboFlags ตอน cast) ---- */
/* ---- COMBOS = "Recipes": Attack Skill/Basic Attack (a) + Passive (b) = Cook Dish ----
   character-first: syncBasicAttack ตั้ง this.skills[สกิลพื้นฐาน] ให้ → สูตรที่ a=สกิลพื้นฐานของตัวนั้นปรุงได้เลยเมื่อเก็บ passive b
   effect(p) = ผลบัฟตอนปรุง (สแตตผู้เล่น ไหลเข้าระบบเอง) · None effect = default +5% ดาเมจใน cookDish */
/* sig:true = "Signature Recipe" (Signature Dish) ⭐ ของแต่ละอาวุธ — ผลแรงกว่าNormal + รางวัลค้นพบมากกว่า
   สูตรธรรมดา = สายเสริม build ให้เลือกทางเล่น · character-first: a = skillsพื้นฐานของตัวนั้น (เก็บ passive b ให้ครบ = ปรุง) */
const COMBOS = [
  // 🍓 โมโม่ (sprinkle) — สายยิงรัวคริติคอล
  { key:'candycore', a:'sprinkle', b:'power',  sig:true, emoji:'🍬💥', name:'Bursting Heart Praline', desc:'⭐ +13% damage · +3% crit', effect:p=>{p.dmgMul+=(1.13)-1;p.critChance+=0.03;} },
  { key:'sugarshot', a:'sprinkle', b:'crit',   emoji:'🍬🎯', name:'Sharp Splinter Seed', desc:'+5% crit', effect:p=>{p.critChance+=0.05;} },
  { key:'ricochet',  a:'sprinkle', b:'haste',  emoji:'🍬⏩', name:'Wandering Candy', desc:'-7% cooldown', effect:p=>{p.cdMul*=0.93;} },
  // 🍫 โกโก้ (meteor) — สายทุบหนักแนวหน้า
  { key:'titanjab',  a:'meteor',   b:'power',  sig:true, emoji:'🍩💥', name:'Titan Punch Sundae', desc:'⭐ +14% damage · -5% damage taken', effect:p=>{p.dmgMul+=(1.14)-1;p.dmgTakenMul*=0.95;} },
  { key:'bearhide',  a:'meteor',   b:'guard',  emoji:'🍩🛡️', name:'Bursting Bear Armor', desc:'-7% damage taken', effect:p=>{p.dmgTakenMul*=0.93;} },
  { key:'rain',      a:'meteor',   b:'magnet', emoji:'🍩🧲', name:'Homing Donut Rain', desc:'+25% pickup range', effect:p=>{p.pickup*=1.25;} },
  // 🌿 มินต์ (frost) — สายควบคุมฝูง
  { key:'coldsnap',  a:'frost',    b:'haste',  sig:true, emoji:'❄️⏩', name:'Frozen Parfait', desc:'⭐ -10% cooldown · +0.4 HP/s', effect:p=>{p.cdMul*=0.90;p.regen+=0.4;} },
  { key:'icewall',   a:'frost',    b:'guard',  emoji:'❄️🛡️', name:'Ice Wall', desc:'-7% damage taken', effect:p=>{p.dmgTakenMul*=0.93;} },
  { key:'blizzard',  a:'frost',    b:'regen',  emoji:'❄️💗', name:'Healing Storm', desc:'+0.8 HP/s', effect:p=>{p.regen+=0.8;} },
  // 🍠 ตาโร่ (thunder) — สายชิ่งไว
  { key:'storm',     a:'thunder',  b:'crit',   sig:true, emoji:'⚡🎯', name:'Thunder Sorbet', desc:'⭐ +7% crit · +4% move speed', effect:p=>{p.critChance+=0.07;p.baseSpeed*=1.04;} },
  { key:'thunderrun',a:'thunder',  b:'swift',  emoji:'⚡👟', name:'Wandering Bolt', desc:'+7% move speed', effect:p=>{p.baseSpeed*=1.07;} },
  { key:'rollingarc',a:'thunder',  b:'haste',  emoji:'⚡⏩', name:'Rolling Bolts', desc:'-7% cooldown', effect:p=>{p.cdMul*=0.93;} },
  // ⚫ งาดำ (mirror) — สายแนวรับ
  { key:'reflection',a:'mirror',   b:'guard',  sig:true, emoji:'🪞🛡️', name:'Oath Sundae', desc:'⭐ -12% damage taken · +5% damage', effect:p=>{p.dmgTakenMul*=0.88;p.dmgMul+=(1.05)-1;} },
  { key:'mirrormend',a:'mirror',   b:'regen',  emoji:'🪞💗', name:'Healing Mirror', desc:'+0.8 HP/s', effect:p=>{p.regen+=0.8;} },
  { key:'oathkeep',  a:'mirror',   b:'crit', emoji:'🪞🎯', name:'Echoing Oath', desc:'+7% damage', effect:p=>{p.dmgMul+=(1.07)-1;} },
];


/* ---- UPGRADES (ระบบ "Flavor Weave"): 3 แก่นถาวรที่ต้องประสานให้Fullแล้วเลื่อนระดับสายใย ----
   วนลูป: อัพ 3 สแตตให้Full (Lv TAL_MAX) → เลื่อนยศ (rank++) → สแตตติดตัวเพิ่มถาวร +
   การ์ด 3 ใบรีเซ็ตกลับ Lv0 + ราคาแพงขึ้น (×(1+rank·0.8)) → อัพFullใหม่ → เลื่อนยศ ... ไปเรื่อย ๆ
   ผลรวมที่ใช้จริง = rank·TAL_MAX + เลเวลWaitบนี้ (ยศยิ่งสูง สแตตยิ่งเยอะ · ดาเมจเป็น flat กันเวอร์) */
const TAL_MAX = 3;   // แต่ละแก่นอัพได้ Lv1..TAL_MAX ต่อยศ (v4.7 ลดจาก 5→3 ให้เลื่อนยศ/ได้ RP ไวขึ้น)
const WEAVE_COST_MUL=3, WEAVE_LV_GROWTH=1.8;   // v6.90 Temple Weave Sugar cost
const UPGRADES = {
  hp:  { iconKey:'temple_life_core',emoji:'❤️', tag:'CORE', name:'Life Core', unit:'+16 max HP/level', color:0xff5f7a, base:30, per:16,
         apply:(p,tot)=>{ p.maxhp+=16*tot; },                          show:tot=>'+'+(16*tot)+' HP' },
  dmg: { iconKey:'temple_flavor_spark',emoji:'✨', tag:'FLAVOR', name:'Flavor Spark', unit:'+2% damage/level',  color:0xf0a54a, base:45, per:2,
         apply:(p,tot)=>{ p.dmgMul+=(1+0.02*tot)-1; },           show:tot=>'+'+(2*tot)+'% DMG' },   // v6.55.28: 3% → 2% (เจ้าของ: Pareto Weave ถึง 50%)   // v4.55: เดิม +2 flat ต่อทุกฮิต (โกงกับตัวยิงถี่/tick) → เปลี่ยนเป็น %
  def: { iconKey:'temple_oath_shell',emoji:'🛡️', tag:'BOND', name:'Oath Shell', unit:'+1.5 armor/level', color:0x6ec6ff, base:40, per:1.5,
         apply:(p,tot)=>{ p.armor=(p.armor||0)+1.5*tot; },       show:tot=>'+'+Math.round(1.5*tot)+' Armor' },   // v6.55.20: เดิม ×0.985^tot ไม่มีเพดาน → armor (100/(100+armor)) ลดผลเองเมื่อสูง
};
const UPG_ORDER=['hp','dmg','def'];
// Special cores are permanent utility upgrades; they never gate or reset on promotion.
const SPECIAL_CORES = [
  {id:'magnet',name:'Magnet Core',rank:1,mod:'pick',per:10,base:6,icon:'temple_special_cores',frame:0,desc:'+10% pickup range / level',effect:n=>'+'+(n*10)+'% pickup range'},
  {id:'dash',name:'Blink Core',rank:2,mod:'dash',per:4,base:8,icon:'temple_special_cores',frame:1,desc:'-4% dash cooldown / level',effect:n=>'-'+(n*4)+'% dash cooldown'},
  {id:'insight',name:'Insight Core',rank:3,mod:'xp',per:5,base:10,icon:'temple_special_cores',frame:2,desc:'+5% EXP gain / level',effect:n=>'+'+(n*5)+'% EXP gain'},
  {id:'treasure',name:'Treasure Core',rank:4,mod:'orbfind',per:5,base:12,icon:'temple_special_cores',frame:3,desc:'+5% currency find / level',effect:n=>'+'+(n*5)+'% currency find'},
  {id:'signature',name:'Signature Core',rank:5,mod:'uniquecd',per:3,base:14,icon:'temple_special_cores',frame:4,desc:'-3% Unique cooldown / level',effect:n=>'-'+(n*3)+'% Unique cooldown'},
];
// v8.0.22 เจ้าของ: Special Cores + Rank Perks รวมเป็น Rank Rewards · SPECIAL_CORES เหลือไว้คืน Thread ให้เซฟเก่า
// ทุกยศ 1–5 เลือก 1 จาก 2 (เปลี่ยนได้ฟรี) · เหลือแต่ของที่เปลี่ยนวิธีเล่น · โบนัส Sugar/สกุลเงินตามยศเป็นอัตโนมัติ
const RANK_REWARDS=[
  {r:1,opts:[{id:'blink',emoji:'💨',name:'Blink',desc:'−15% Dash cooldown',apply:p=>{p.dashCdMul=(p.dashCdMul||1)*.85;}},{id:'signature',emoji:'⭐',name:'Signature',desc:'−12% Unique cooldown',apply:p=>{p.uniqueCdMul=(p.uniqueCdMul||1)*.88;}}]},
  {r:2,opts:[{id:'revive',emoji:'🕯️',name:'Revival Candle',desc:'Revive once per stage at 45% HP'},{id:'laststand',emoji:'🛡️',name:'Last Stand',desc:'−25% damage taken below 30% HP',apply:p=>{p.lowHpGuard=(p.lowHpGuard||0)+.25;}}]},
  {r:3,opts:[{id:'swift',emoji:'👟',name:'Swift Feet',desc:'+10% move speed',apply:p=>{p.baseSpeed=(p.baseSpeed||1)*1.1;}},{id:'feast',emoji:'🍖',name:'Feast',desc:'Heal 2 HP per kill',apply:p=>{p.lifeOnKill=(p.lifeOnKill||0)+2;}}]},
  {r:4,opts:[{id:'blink2',emoji:'🌀',name:'Flash Step',desc:'−20% Dash cooldown',apply:p=>{p.dashCdMul=(p.dashCdMul||1)*.8;}},{id:'signature2',emoji:'🌟',name:'Encore',desc:'−18% Unique cooldown',apply:p=>{p.uniqueCdMul=(p.uniqueCdMul||1)*.82;}}]},
  {r:5,opts:[{id:'giant',emoji:'👑',name:'Giant Slayer',desc:'+20% damage to bosses and minibosses',apply:p=>{p.bossDmg=(p.bossDmg||0)+.2;}},{id:'keen',emoji:'🎯',name:'Keen Eye',desc:'+8% crit chance',apply:p=>{p.critChance=(p.critChance||0)+.08;}}]},
];
function rankRewardOpt(id){ for(const row of RANK_REWARDS)for(const o of row.opts)if(o.id===id)return o; return null; }
function rankAutoBonus(rank){ const r=Math.max(0,rank|0); return {sugar:.05*Math.min(8,r),cur:.05*Math.min(5,r)}; }
function applySpecialCores(p){ const d=(typeof Save!=='undefined'&&Save.data)||{},pk=d.rankPick||{}; for(const row of RANK_REWARDS){ if((d.rank||0)<row.r)continue; const o=row.opts.find(x=>x.id===pk[row.r]); if(o&&o.apply)o.apply(p); } }
/* ---- ยศ (rank): ไต่ไปเรื่อย ๆ · ชื่อวนถึงตัวสุดท้ายแล้วต่อท้าย +N ---- */
const RANK_TIERS = [
  { name:'First Awakened Taste' }, { name:'Memory Listener' }, { name:'Core Binder' },
  { name:'Guardian of Mochitopia' }, { name:'Bitter Defier' }, { name:'Flavorbound' },
];
function rankName(rank){ const n=RANK_TIERS.length; if(rank<n)return RANK_TIERS[rank].name;
  return RANK_TIERS[n-1].name+' +'+(rank-n+1); }
function promoteReward(rank){ return 50+rank*40; }   // 🍬 โบนัสตอนเลื่อนยศ
/* ---- RANK PERKS: ทุก rank ได้ 1 แต้ม (RP) ลงใน perk ถาวรที่เลือกเอง (depth + การตัดสินใจ) ---- */
// ผัง Passive แบ่ง 3 ชั้น: ชั้น 2 ปลดเมื่อลงแต้มชั้น 1 ครบ 3 · ชั้น 3 ปลดเมื่อลงชั้น 1+2 ครบ 8 (ความลึกของระบบ)
const RANK_PERKS = [
  { id:'greed',   tier:1, emoji:'🍬', name:'Sweet Greed',  max:5, desc:'+8% Sugar from stage rewards per rank' },
  { id:'boxLuck', tier:2, emoji:'🎁', name:'Box Luck',     max:3, desc:'+30% secret box drop chance per rank' },
  { id:'fortune', tier:3, emoji:'💠', name:'Fortune',      max:3, desc:'+10% crafting currency from rewards per rank' },
  { id:'revive',  tier:3, emoji:'🕯️', name:'Revival Candle',max:1, desc:'Revive once per stage at 45% HP' },
];
const PERK_TIER_REQ = { 2:2, 3:5 };   // v7.8.88 Vigor/Might/Iron Will ตัด (สเตตัสถาวรเหลือ Weave + Talent ฮีโร่)   // แต้มที่ต้องลงในชั้นก่อนหน้าเพื่อปลดชั้นนี้
/* ---- v5.27 ⛏️ Temple Depths: มินิเกมขุดใต้วิหาร (ดู docs/TEMPLE_DIG_DESIGN.md) ---- */
/* v8.2.32 เจ้าของ 19 พ.ย.: Temple Expedition (แทน Temple Depths/Dig + Mochi Patrol) · แตะตีไททันแบบเกม tap-RPG · ผู้ช่วยตีเอง (idle) · ปิดแอปก็ยังได้ 🍪 Crumbs (50% · ≤8 ชม.)
   ทุก 5 ด่าน = บอสจับเวลา 30 วิ (แพ้ = ฝึก 10 ตัวแล้วลองบอสใหม่เอง · v8.2.61) · Crumbs ช่วยเกมหลักผ่าน Supplies (ของติดตัว 1 ชิ้นต่อด่าน) · บอสครั้งแรก/กล่องรายวัน = Sugar/ด้าย/Recipe Part เข้าเกมหลัก */
const MISSION_AUTO_START=true;   // v8.2.70 เจ้าของ: ภารกิจในด่านเริ่มเอง (ไม่มีปุ่ม Start mission)
const EXP_DAILY_ON=false;   // v8.2.54 ECRS2 E3: Daily chest ของ Expedition เลิก (ของรายวันมี 6 จุด → ลด)
const EXP_ON=true,EXP_HERO_APS=2,EXP_UPALL_MAX=200,EXP_KILLS=10,EXP_BOSS_EVERY=5,EXP_BOSS_T=30,EXP_OFF_MAX_H=8,EXP_OFF_RATE=.5,EXP_CRIT=.05,EXP_CRIT_MUL=3,EXP_HP_G=1.25,EXP_BOSS_HP=6,EXP_BOSS_CR=4,SHOVEL_CRUMBS=40,
  EXP_HELPERS=[{id:'ruby',em:'🎀',name:'Ruby',base:1,cost:15},{id:'momo',em:'🍑',name:'Momo',base:5,cost:80},{id:'mint',em:'🌿',name:'Mint',base:22,cost:450},{id:'cocoa',em:'🍫',name:'Cocoa',base:100,cost:2600},{id:'taro',em:'💜',name:'Taro',base:480,cost:15000},{id:'yuzu',em:'🍋',name:'Yuzu',base:2300,cost:90000},{id:'sesame',em:'🖤',name:'Sesame',base:11000,cost:540000}],
  EXP_SUPPLIES=[{id:'shield',em:'🫧',name:'Bubble Start',desc:'Start your next stage with a shield'},{id:'xp',em:'⭐',name:'Study Snack',desc:'+25% EXP in your next stage'},{id:'sugar',em:'🍬',name:'Sweet Tooth',desc:'+20% Sugar in your next stage'},{id:'hp',em:'❤️',name:'Hearty Meal',desc:'+15% max HP in your next stage'}];
function expHp(s){ return Math.max(1,Math.round(10*Math.pow(EXP_HP_G,Math.max(0,s-1)))); }
function expCrumb(s){ return Math.max(1,Math.ceil(expHp(s)*.12)); }
function expIsBoss(s){ return s%EXP_BOSS_EVERY===0; }
function expTapDmg(lv){ return Math.max(1,Math.round(lv*Math.pow(1.04,lv-1))); }
function expTapCost(lv){ return Math.round(10*Math.pow(1.074,lv)); }
function expHelpDps(h,lv){ return lv>0?h.base*lv*Math.pow(2,Math.floor(lv/25)):0; }
function expHelpCost(h,lv){ return Math.round(h.cost*Math.pow(1.075,lv)); }
function expFmt(n){ n=Math.floor(n||0); if(n<1000)return String(n); const u=['K','M','B','T','aa','ab','ac','ad','ae']; let i=-1; while(n>=1000&&i<u.length-1){ n/=1000; i++; } return (n>=100?Math.floor(n):n.toFixed(n>=10?1:2))+u[i]; }
function expSupplyCost(best){ return Math.max(60,Math.round(expHp(Math.max(1,best))*3)); }
const DIG_START_SHOVELS=0;
const DIG_SHOP_COST=120, DIG_SHOP_SHOVELS=5, DIG_SHOP_DAILY_LIMIT=1;   // v8.0.27 เจ้าของ: ลดการซื้อพลั่วด้วย Sugar (3→1/วัน) · ได้จาก Daily/Awards/บอสมากขึ้น
// v6.15 (Idle): Mochi Miners ขุดด้ายให้ตอนออฟไลน์ · [rate/ชม., เก็บได้กี่ชม., ราคาอัปไปเลเวลนี้]
const MINERS_ON=false;   // v8.2.54 ECRS2 E2: Mochi Miners เลิก (ปุ่มเก็บใน Lobby หาย · Save ย้ายเป็นโบนัส Expedition)
const MINER_LEVELS=[null,{rate:3,cap:8,cost:300},{rate:5,cap:10,cost:600},{rate:7,cap:12,cost:1000},{rate:9,cap:14,cost:1500},{rate:12,cap:16,cost:2200}];
/* v8.2.36 E1: DIG_ITEMS ลบแล้ว (กระดานขุดเดิม) */
const SCROLL_THREADS=15, ANCIENT_THREAD_COST=60;   // v7.8.88 Scroll รวมเป็น Thread: 1 ชิ้นเก่า = 15 · Ancient Perk = 60 Thread
/* ---- v5.30 Ancient Perks: Perk ลับจากใต้วิหาร (ปลดด้วยคัมภีร์ · RP ใช้ไม่ได้) ---- */
const ANCIENT_PERKS=[
  { id:'echoDash',      emoji:'🌀', name:'Echo Dash',      desc:'3 dashes within 2.5s release a shockwave' },
  { id:'treasureSense', emoji:'⛏️', name:'Treasure Sense', desc:'Kills can drop Expedition Crumbs (max 3 per stage)' },
  { id:'secondWeave',   emoji:'🃏', name:'Second Weave',   desc:'Your first level-up each stage gives an extra card pick' },
  { id:'ancientGuard',  emoji:'🗿', name:'Ancient Guard',  desc:'Survive your first lethal hit each stage at 1 HP (3s immune)' },
  { id:'sugarVein',     emoji:'🍬', name:'Sugar Vein',     desc:'+20% Sugar from kills' },
  { id:'deepRoots',     emoji:'🌳', name:'Deep Roots',     desc:'+1 HP regen per second' },
];
const STONE_THREADS=25;   // แก่นขั้นพิเศษ +1..+6 ถาวร (ไม่รีเซ็ตตอนเลื่อนยศ) · 1 ขั้น = 2 เลเวลแก่น
/* ---- v5.35 🍳 Flavor Recipes: ประกอบ perk เอง = Trigger + Effect (+ Modifier) · ชิ้นส่วนได้จากการขุด ---- */
// cost = แต้มรสชาติ · สูตรหนึ่งรวมกันต้องไม่เกิน FR_FLAVOR_CAP (trigger ที่เกิดถี่ = แพง)
const FR_FLAVOR_CAP=10, FR_SLOT_MAX=3, FR_MERGE_N=3, FR_LV_MAX=3, FR_SWAP_SUGAR=20;   // v5.38 ถอด/สลับชิ้นที่ใส่แล้ว = 🍬20
