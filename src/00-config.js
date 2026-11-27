/* ============================================================
   MOCHI MAYHEM — Prototype (Phaser 3)  v3
   - Floating joystick (left) + basic Dash button (right)
   - Active Skill button (player-triggered, cooldown)
   - Auto coatings (Sprinkle / Sugar Ring / Chili)
   - Pickups + level-up (manual tap hit-test)
   - No Toast meter (kept basic). One-thumb, mobile-first.
   ============================================================ */

const HUD_ROWS={objective:69,progress:104,bossName:131,bossBg:149,bossBar:151,bossHp:156};   // v8.0.11 แถวหัวเดียว (เลื่อนขึ้น 22) · ไม่มีหลอด EXP ข้างบน
function prizeWheelLayout(w,h,imageW,imageH){
  const cx=w/2,cy=h*0.47,R=Math.min(w*0.36,150);
  // Cover the viewport while keeping the painted ring's center under the wheel.
  const bgScale=Math.max(w/imageW,cy/(imageH*0.432),(h-cy)/(imageH*0.568));
  return {cx,cy,R,bgScale,bgY:cy+imageH*(0.5-0.432)*bgScale};
}

const WORLD = 4000;
const PERF_LIVE_MUL = 0.8;   // v5.49: ลดมอนบนจอ 20% (มือถือกระตุก)
const FX_PER_FRAME = 6;      // v5.49: เอฟเฟกต์ตกแต่งสร้างได้ไม่เกินนี้ต่อเฟรม
// v5.50: ระดับประหยัด 0-2 (Auto ปรับตาม FPS · Low=2 · High=0) → ลดงบ FX และจำนวนมอน
const PERF={lvl:0,low:0,high:0,acc:0};
function perfQuality(){ const st=Save.data&&Save.data.settings; const q=st&&st.quality; return q===0||q===1||q===2?q:0; }
const COLORS = {
  bg1: 0x3b3357, mochi: 0xfff2f7, mochiEdge: 0xff9ec4, candy: 0xffd166,
  pink: 0xff85b3, grape: 0xa98cf0, toast: 0xf0b35a, mint: 0x66d3b3, ice: 0xa9dcff,
  grid: 0x4f456e,
};

/* ---- BALANCE 2.2: ค่ากลางเดียว ปรับง่ายและกัน power creep ---- */
const BALANCE = {
  moveSpeed: 166,
  // C2-2 benchmark เทียบ C2-1: HP ≈×1.35, damage ≈×1.30, speed +8%; cap ฝูงคุมมือถือ
  c2Mycelium:{ hp:1.145, dmg:1.19, speed:1.08, maxLive:104 },
  c2Nectar:{ hp:1.12, dmg:1.08, speed:1.06, maxLive:96 },
  c2Seasons:{ hp:1.14, dmg:1.10, speed:1.07, maxLive:92 },
  c2Root:{ hp:1.16, dmg:1.12, speed:1.08, maxLive:88 },
  // ปรับสมดุลใหม่ให้มี trade-off ชัด: ยิงไว = ดาเมจเบา · ออกช้า = ดาเมจหนัก
  skillPower: {
    sprinkle:0.82, star:0.95, thunder:0.80, whirl:0.88,   // sprinkle/whirl = สายสแปมเบา
    boomer:1.00, frost:0.72, popcorn:0.78, bubble:1.05,
    mine:1.00, beam:1.15, meteor:1.18, cloud:0.85,   // beam/meteor = นุ๊กหนักออกช้า
    rocket:1.12, mirror:0.88, decoy:0.82,
  },
};

// v4.55: เพดานสแตตผู้เล่นจุดเดียว — applyMeta / previewStats / cookDish / การ์ด endless ใช้ชุดเดียวกัน
const STAT_CAPS = { dmgMul:Infinity, critChance:1, cdMulMin:0, dmgTakenMin:0, speedMul:Infinity };   // v6.17: เจ้าของสั่งไม่มีเพดาน (crit 100% = ธรรมชาติ)
function clampPlayerStats(p){ if(p._uqGlass){p.maxhp=Math.max(1,Math.round(p.maxhp*p._uqGlass));p._uqGlass=0;} p.dmgMul=Math.max(0.1,Math.min(STAT_CAPS.dmgMul,p.dmgMul)); p.critChance=Math.min(STAT_CAPS.critChance,p.critChance||0); p.cdMul=Math.max(STAT_CAPS.cdMulMin,p.cdMul); p.dmgTakenMul=Math.max(STAT_CAPS.dmgTakenMin,p.dmgTakenMul); p.baseSpeed=Math.min(BALANCE.moveSpeed*STAT_CAPS.speedMul,p.baseSpeed); }
const TAU = Math.PI * 2;   // global — Game scene (บอส/VFX) อ้างถึง TAU ด้วย เดิมประกาศเฉพาะใน Boot.create → "TAU is not defined"

/* ---- เวอร์ชัน + บันทึกUpdates (build-www ดึงไปทำ version.json ให้หน้า download) ---- */
const VO_BOSS_VOL=1;   // v8.2.50 เสียงพากย์บอสในการต่อสู้ (เสียงพากย์ทั่วไป .65)
const GAME_VERSION = '8.3.34';
const COMBAT_WARN_FILL = 0.8515625;
try{ localStorage.setItem('mochi_last_ver',GAME_VERSION); }catch(e){}   // v7.8.104 index.html เทียบกับ version.json → ถ้าไม่ตรงโหลด game.js แบบ fresh
// v7.8.100 Lens of Surprise: ทุกรอบ Story ตั้งแต่ด่าน 3 สุ่มลักษณะพิเศษ 1 อย่าง (มีของแลกตามกฎเหล็ก)
const RUN_TRAITS=[
  {id:'swift',emoji:'⚡',name:'Swift Swarm',desc:'Enemies move 15% faster · +25% EXP',spd:1.15,player:p=>{p.xpMul=(p.xpMul||1)*1.25;}},
  {id:'sugar',emoji:'🍬',name:'Sugar Rush',desc:'Enemies have 15% more HP · +35% Sugar from kills',hp:1.15,player:p=>{p.sugarFindMul=(p.sugarFindMul||1)*1.35;}},
  {id:'frenzy',emoji:'🔥',name:'Frenzy',desc:'You attack 15% faster · but take 15% more damage',player:p=>{p.cdMul=(p.cdMul||1)*0.87;p.dmgTakenMul=(p.dmgTakenMul||1)*1.15;}},
  {id:'lucky',emoji:'🍀',name:'Lucky Day',desc:'Miniboss chests upgrade more often',lucky:true},
];
const WHEEL_RELIC_CHANCE=0.30;   // v7.8.97 เจ้าของเลือก 30%
const MIMIC_WHEEL_CHANCE = 0.12, CH1_CALM_UNTIL = 5;   // v8.2.54 ECRS2 S4: Chapter 1 (ด่าน 0–4) ไม่มี Run trait / วงล้อ Mimic → ลดการตัดสินใจของมือใหม่   // v6.89.1 โอกาสวงล้อหยุดที่ MIMIC
// v6.88 APK ขั้นต่ำ: bump เฉพาะตอนที่ตัวแอป (native) เปลี่ยนจนต้องลงใหม่ · APK เวอร์ชันต่ำกว่านี้จะเห็นป้ายแจ้งเตือน
const MIN_APK_VERSION = '6.88.0';
const APK_DOWNLOAD_URL = 'https://github.com/hardza1230/Survival-like-Mobile-Game/releases/download/latest/mochi-mayhem-debug.apk';
// Miniboss rewards: choose damage at an HP cost, or recovery.
const CROSSROADS=[
  {id:'blood',name:'Blood Pact',desc:'+25% damage for 90 seconds',detail:'Lose 30% of current HP',artKey:'prize_jackpot',color:0xff6f9d},
  {id:'rest',name:'Recover HP',desc:'Restore 40% of maximum HP',detail:'No cost',artKey:'heal',color:0x8ff0b0}
];
// v4.89.1: เวลาอมตะหลังโดนตี ×0.6 (เจ้าของ: อยากให้โดนตีถี่ขึ้น) · ชน 0.6→0.36s · กระสุน 0.5→0.3s
const HURT_IFRAME_MUL = 0.8;   // v6.55.68 เจ้าของ: อมตะหลังโดนตีนานขึ้น (0.6→0.8)
const STORE_APK_URL = 'https://github.com/hardza1230/Survival-like-Mobile-Game/releases/download/store-apk-latest/mochi-mayhem-store-test.apk', STORE_VERSION_URL = 'https://hardza1230.github.io/Survival-like-Mobile-Game/version.json';   // v8.3.9 Store-like test APK update check
const COUNTER_STUN_SEC = 2;   /* v8.3.15 เจ้าของ: เตะของใส่บอส = บอสสตั้น 2 วิ (เดิม 1.2) */
function verNewer(a,b){ const n=v=>String(v).split('.').map(x=>parseInt(x,10)||0),x=n(a),y=n(b); for(let k=0;k<3;k++)if((x[k]||0)!==(y[k]||0))return (x[k]||0)>(y[k]||0); return false; }
const RELEASES_URL = 'https://github.com/hardza1230/Survival-like-Mobile-Game/releases/download/latest/mochi-mayhem-debug.apk';
// v6.55.17: HP บอส/มินิ ด่าน 3-5 (Chapter 1) ของจริง
// v6.55.26: ดาเมจฐานฮีโร่ 90% → 100% (เลิกงง) · HP ศัตรูทุกตัว ×1/0.9 ให้ความยากเท่าเดิม

function realStageBossMul(i,endgame){return i===2||i===3?1.6:i===4?1.25:(i>=5&&!endgame)?2:1;}   // v6.68: C2–C3 story boss/mini HP ×2
const STORY_WAVE_PLAN=[
  {quota:50,live:18,reward:20},{quota:56,live:22,reward:30},{quota:64,live:26,reward:40},
  {quota:72,live:30,reward:50},{quota:80,live:34,reward:60}
];
// Chapter 1 first-clear director. Each phase grows its pattern pool across the chapter.
const C1_COMBAT_PATTERNS={
  warm:['Ambush','Stampede'],
  pressure:['Pincer','Hunter Pack','Commander','Barrage','Spore Bloom','Splitters','Sniper Nest'],
  recovery:['Loot Rush'],
  escalation:['Barrage','Fortress','Commander','Hazard Shift','Stampede','Shield Carrier','Elite Duo','Spore Bloom'],
  swarm:['Last Stand','Pincer','Ambush','Shrinking Arena','Splitters']
};
// v8.3.10 เจ้าของ: เวฟ C1 สั้นลง (เดิม 30/45/–/105/60 วิ) · ช่วงพักต้นเวฟ 4 (เดิม 30 วิ)
const C1_WAVE_SEC=[24,30,0,30,30],C1_RECOVERY_SEC=8;   // v8.3.13 เจ้าของ: ทุกเวฟไม่เกิน 30 วิ
// v8.3.10 เจ้าของ: ภารกิจแทรกโผล่เฉพาะที่เคยเจอ · home = ด่านที่ภารกิจเต็มอยู่ (C1-2 Hunger’s Mouth · C1-3 Grandma’s Pot · C1-4 Frozen Pantry)
const C1_SIDE_EVENTS=[
  {name:'Hunger Herald',home:0,mission:'hungerHerald',half:true,key:'hh_gate',icon:'📯',color:0xff8fb1,types:['fast','basic','basic','dasher'],reward:22},
  {name:'Hunger’s Mouth',home:1,mission:'hungersMouth',half:true,key:'hm_hand',icon:'✦',color:0xbc89ff,types:['fast','fast','dasher'],reward:24},
  {name:'Grandma’s Pot',home:2,mission:'grandmasPot',half:true,key:'gp_pot',icon:'♨',color:0xffcd88,types:['basic','fast'],hold:7,reward:26},
  {name:'Frozen Pantry',home:3,mission:'frozenPantry',half:true,key:'fp_jar',icon:'❄',color:0x9fe0ff,types:['tank','basic','basic'],reward:28},
  {name:'Grandma’s Golem',home:4,key:'gg_oven',icon:'🗿',color:0xf2b06b,types:['tank','tank','fast'],reward:30,g2:true}   // v8.3.27 = เตาโกเลมแบบใหม่ (Metamorph)
];
/* v8.3.24 เจ้าของ: ภารกิจรอง C2–C3 = ภารกิจเต็มเดิม เดินไปเหยียบวัตถุ = เริ่ม (ระบบ side mission) · home = ด่านที่เจอครั้งแรก · generic = สุ่มได้ทุกด่านหลังจากนั้น
   Escort the Wisp = ภารกิจเฉพาะด่าน C2-1 (มีวัตถุในด่านนี้เท่านั้น) */
/* v8.3.30 เจ้าของ 27 พ.ย.: ภารกิจรอง C1 = ภารกิจฉบับเต็ม หาร 2 (เวลา + เป้า/จำนวน) · Golem ยังเป็นเตาแบบใหม่ */
const C1_SIDE_HALF=.5;
/* v8.3.31 เจ้าของ 27 พ.ย.: ปิด Boss Rage ทุกโหมด (บอสไม่ถึก/แรงขึ้นตามจำนวนมอนที่ฆ่า) · รางวัลบอสใช้ระดับ Normal */
const BOSS_RAGE_ON=false;
/* v8.3.31 เจ้าของ 27 พ.ย.: เอาเสียง Ambient ด่าน/บอสออกทั้งหมด (ฟังเป็น noise) */
const STAGE_AMBIENT_ON=false;
/* v8.3.32 เจ้าของ 27 พ.ย.: บอส/มินิบอส Story ไม่เร่งคูลดาวน์ท่า (เดิม ×1.45 บอส · ×1.3 มินิ · เลือด <30% ×1.2) · Delve/Rift คงเดิม */
const STORY_BOSS_AGGRO=1;
const DELVE_AGGRO_STEP=.05,DELVE_AGGRO_MAX=1.6;
/* v8.3.34 เจ้าของ 27 พ.ย. (แผน E+B อนุมัติ): Mochi Garden แทน Expedition · ส่งฮีโร่ 1–3 ตัวเดินเก็บของ 1/4/8 ชม. (ออฟไลน์ก็เดิน) · 3 เขต (ฉาก Patrol ใบ 70)
   ฮีโร่ +15%/ตัว · ทริป 8 ชม.+ +10% · กล่อง Gear 8%/ชม. · โปสการ์ด 15%/ชม. · โมจิผู้ช่วย 15 ตัว (ผ่านด่าน Story ละตัว) ช่อง 2 ต่อเขต · แคมป์ 5 เลเวล */
const GARDEN_ON=true;
const GARDEN_ZONES=[{id:'pantry',name:'Pantry Path',em:'🍓',ch:0,open:5,sugar:60,cream:.5},{id:'ferment',name:'Ferment Garden',em:'🌺',ch:1,open:10,sugar:100,cream:1},{id:'grove',name:'Seed Grove',em:'🌟',ch:2,open:15,sugar:150,cream:1.5}];
const GARDEN_TRIP_H=[1,4,8],GARDEN_HERO_BONUS=.15,GARDEN_LONG_BONUS=.1,GARDEN_BOX_P=.08,GARDEN_CARD_P=.15,GARDEN_SLOTS=2;
const GARDEN_CAMP=[{lv:1,bonus:0},{lv:2,cost:500,bonus:.1},{lv:3,cost:1500,bonus:.2,slots:3},{lv:4,cost:4000,bonus:.3},{lv:5,cost:10000,bonus:.45,long:12}];
const GARDEN_HELPER_XP=[0,10,30,60,100],GARDEN_TRAITS=[{k:'sugar',em:'🍬',name:'Sugar',v:.05},{k:'cream',em:'🟢',name:'Twist Cream',v:.05},{k:'box',em:'🎁',name:'Gear box',v:.02},{k:'card',em:'💌',name:'Postcard',v:.05}];
const GARDEN_HELPERS=['Pip','Bun','Dango','Kiki','Puff','Momi','Tofu','Nori','Yomo','Ume','Sakura','Kuri','Hana','Kinako','Mame'].map((name,i)=>({id:'h'+i,name,stage:i,trait:GARDEN_TRAITS[i%4]}));
const GARDEN_CARDS=['Ruby naps in a teacup','Grandma’s old recipe tin','A sugar ant parade','Moonlit berry patch','The singing kettle','Frosting footprints','A lost mitten of Mint','Cocoa’s secret training spot','Taro chasing fireflies','Yuzu’s lemon boat','Sesame reading by candle','The first seed sprouts'].map((t,i)=>({id:'c'+i,t}));   // v8.3.33 เจ้าของ: ความดุบอส Delve ชั้น 1 = ×1.0 · +0.05/ชั้น · สูงสุด ×1.6 (ชั้น 13+)
/* v8.3.32 เจ้าของ: วง Glacier Bloom ของ Mint (กด Unique ค้าง) ย่อทั้งภาพและวงตี ×0.7 */
const MINT_BLOOM_SCALE=.7;
const C1_POT_R=95;   // v8.3.25 เจ้าของ: วง Grandma’s Pot ใหญ่ขึ้น (เดิม 58)
/* v8.3.27 เจ้าของ: Grandma’s Golem แบบ Metamorph · ชิ้นส่วน 5 ชนิด (จากบอส C1) × 3 ระดับ · ตกพื้น ไม่ดูดเข้าตัว · เก็บข้ามด่าน (สูงสุด 12)
   ดรอป: มอน 3% ชิ้นธรรมดา · มินิบอส ชิ้นหายาก 1 · บอส ชิ้นระดับสูง 2 (ชนิดของบอสด่านนั้น) · เตา: popup ใส่ 3 ช่อง → อบ
   ชนิดที่ใส่มากสุด = Monster ลูกน้อง (ยิง/เร็ว/พุ่ง/ถึก/ฝูง) · ทุกชนิดที่ใส่ = สกิลบอสของ Golem */
const G2_KINDS=[{k:'acid',em:'🧪',name:'Acid Gland',boss:'Sour Ant Queen',skill:'spits acid volleys',minion:'shooter',c:0x9dff45},{k:'drain',em:'🌀',name:'Drain Core',boss:'Drain King',skill:'pulls you in',minion:'fast',c:0x72e8d1},{k:'chili',em:'🌶️',name:'Chili Heart',boss:'Chili Engine',skill:'leaves fire pools',minion:'dasher',c:0xff8a5a},{k:'frost',em:'❄️',name:'Frost Shard',boss:'Frost Warden',skill:'fires ice rings',minion:'tank',c:0x9fe0ff},{k:'oven',em:'🔥',name:'Oven Brick',boss:'Crown Oven',skill:'slams the ground',minion:'basic',c:0xd59cff}];
const G2_TIERS=['','Common','Rare','Epic'],G2_DROP_MOB=.03,G2_SLOTS=3,G2_MAX_INV=12,G2_PICK_R=40,G2_PICK_LIFE=30;
const C2_SIDE_MISSIONS=[
  {g2:true,home:5,generic:true,mission:'',key:'gg_oven',icon:'🗿',color:0xf2b06b,name:'Grandma’s Golem'},
  {mission:'vaultAltar',home:13,only:true,key:'ult_altar',icon:'🗝️',color:0xff8fb0},
  {mission:'purge',home:5,only:true,key:'mo96_escort',icon:'🕯️',color:0xffe08a},
  {mission:'hunt',home:5,generic:true,key:'mo96_hunt',icon:'🎯',color:0xff8a5a},
  {mission:'capture',home:5,generic:true,key:'mo96_crack',icon:'🕳️',color:0xb48cff},
  {mission:'cleanAir',home:6,key:'mo96_fog_wisp',icon:'🫧',color:0x9fe0c0},
  {mission:'creepingRoots',home:7,key:'mo96_roots_flower',icon:'🌱',color:0x8fd06a},
  {mission:'shakeTrees',home:11,key:'msn71_tree',icon:'🌳',color:0xc9e07a}
];
/* v8.3.12 เจ้าของ: ภารกิจหลัก C1 = สถานการณ์การต่อสู้ทุกเวฟ (เวฟ 1,2,4,5 · เวฟ 3 = มินิบอส) · pattern = รูปแบบศัตรู · goal = เป้าโบนัส EXP
   goal 'leader' = ล้มหัวหน้า · 'pack' = ล้มทั้งกลุ่มภายใน C1_SIT_SEC · 'dodge' = ไม่โดนพื้นอันตรายจนจบ */
const C1_SITUATIONS=[
  [{name:'Tunnel Ambush',pattern:'Ambush',hint:'Ants burst from tunnels around you — break out of the ring',goal:'pack'},
   {name:'Soldier Line',pattern:'Fortress',hint:'Shields in front, spitters behind — go around the line',goal:'pack'},
   {name:'Spitter Barrage',pattern:'Barrage',hint:'Spitters fire from range — close in and take them out',goal:'pack'},
   {name:'Colony Swarm',pattern:'Stampede',hint:'The colony charges in a line — dash through the gap',goal:'pack'}],
  [{name:'Pipe Burst',pattern:'Pincer',hint:'They pour from pipes on both sides — don’t get caught between',goal:'pack'},
   {name:'Clog Commander',pattern:'Commander',hint:'The commander speeds up its pack — defeat it first',goal:'leader'},
   {name:'Sewage Shift',pattern:'Hazard Shift',hint:'Toxic sludge drifts across the floor — keep moving',goal:'dodge'},
   {name:'Flood Swarm',pattern:'Last Stand',hint:'A flood of monsters — stay at the edge of the crowd',goal:'pack'}],
  [{name:'Hunter Pack',pattern:'Hunter Pack',hint:'Fast hunters chase you — turn and fight, don’t run straight',goal:'pack'},
   {name:'Furnace Barrage',pattern:'Barrage',hint:'Burners fire from range — close in and take them out',goal:'pack'},
   {name:'Pan Fortress',pattern:'Fortress',hint:'Heavy pans block the way — circle behind them',goal:'pack'},
   {name:'Heat Rush',pattern:'Stampede',hint:'A rush of hot mochi charges — dash through the gap',goal:'pack'}],
  [{name:'Ice Squad Commander',pattern:'Commander',hint:'The captain speeds up its squad — defeat it first',goal:'leader'},
   {name:'Frozen Fortress',pattern:'Fortress',hint:'Frozen guards block the way — circle behind them',goal:'pack'},
   {name:'Ice Floor Shift',pattern:'Hazard Shift',hint:'Ice drifts across the floor — keep moving',goal:'dodge'},
   {name:'Frost Pincer',pattern:'Pincer',hint:'Squads close in from both sides — break out to one side',goal:'pack'}],
  [{name:'Banquet Commander',pattern:'Commander',hint:'The commander speeds up its pack — defeat it first',goal:'leader'},
   {name:'Oven Barrage',pattern:'Barrage',hint:'Oven guards fire from range — close in and take them out',goal:'pack'},
   {name:'Crumb Shift',pattern:'Hazard Shift',hint:'Burning crumbs drift across the floor — keep moving',goal:'dodge'},
   {name:'Last Stand',pattern:'Last Stand',hint:'The Hunger throws everything — stay at the edge of the crowd',goal:'pack'}],
  /* v8.3.23 เจ้าของ: Combat Situations ขยายไป C2–C3 (ด่าน 6–15) + pattern ใหม่ Spore Bloom · Splitters · Sniper Nest · Shield Carrier · Elite Duo · Shrinking Arena */
  [{name:'Canopy Ambush',pattern:'Ambush',hint:'Vines drop monsters all around you — break out of the ring',goal:'pack'},
   {name:'Splitter Brew',pattern:'Splitters',hint:'Big fermented blobs split in two when they pop — finish the small ones too',goal:'pack'},
   {name:'Sap Shift',pattern:'Hazard Shift',hint:'Sticky sap drifts across the floor — keep moving',goal:'dodge'},
   {name:'Canopy Last Stand',pattern:'Last Stand',hint:'The canopy empties out — stay at the edge of the crowd',goal:'pack'}],
  [{name:'Spore Bloom',pattern:'Spore Bloom',hint:'Fallen mushrooms burst after 2 seconds — lure the pack into the blast',goal:'pack'},
   {name:'Marsh Pincer',pattern:'Pincer',hint:'They close in from both sides — break out to one side',goal:'pack'},
   {name:'Fungus Commander',pattern:'Commander',hint:'The commander speeds up its pack — defeat it first',goal:'leader'},
   {name:'Spore Storm',pattern:'Spore Bloom',hint:'Every fallen mochi leaves a spore — keep the crowd on top of them',goal:'pack'}],
  [{name:'Hive Splitters',pattern:'Splitters',hint:'Fat drones split when they pop — sweep up the little ones',goal:'pack'},
   {name:'Drone Stampede',pattern:'Stampede',hint:'Drones charge in a line — dash through the gap',goal:'pack'},
   {name:'Royal Guards',pattern:'Elite Duo',hint:'Two elites guard each other when close — pull them apart',goal:'pack'},
   {name:'Swarm of the Hive',pattern:'Last Stand',hint:'The whole hive pours out — stay at the edge of the crowd',goal:'pack'}],
  [{name:'Season Pincer',pattern:'Pincer',hint:'Squads close in from both sides — break out to one side',goal:'pack'},
   {name:'Frost Fortress',pattern:'Fortress',hint:'Frozen guards block the way — circle behind them',goal:'pack'},
   {name:'Season Twins',pattern:'Elite Duo',hint:'Two elites share their strength when close — split them up',goal:'pack'},
   {name:'Season Shift',pattern:'Hazard Shift',hint:'The weather sweeps the floor — keep moving',goal:'dodge'}],
  [{name:'Root Ambush',pattern:'Ambush',hint:'Roots burst up around you — break out of the ring',goal:'pack'},
   {name:'Thorn Fortress',pattern:'Fortress',hint:'Thorny guards hold the line — circle behind them',goal:'pack'},
   {name:'Crown Root Lure',pattern:'Root Lure',hint:'The crown root burrows after you — stand by a stone, dodge, and let it smash the stone',goal:'lure'},
   {name:'Throne Last Stand',pattern:'Last Stand',hint:'The throne calls everyone — stay at the edge of the crowd',goal:'pack'}],
  [{name:'Ash Snipers',pattern:'Sniper Nest',hint:'Snipers hide behind a thorn wall — go around it, don’t touch it',goal:'pack'},
   {name:'Ash Root Lure',pattern:'Root Lure',hint:'The crown root burrows after you — stand by a stone, dodge, and let it smash the stone',goal:'lure'},
   {name:'Ash Shield',pattern:'Shield Carrier',hint:'The carrier shields its pack — break the carrier first',goal:'leader'},
   {name:'Closing Embers',pattern:'Shrinking Arena',hint:'The safe ground shrinks — clear the pack before the embers close in',goal:'pack'}],
  [{name:'Orchard Ambush',pattern:'Ambush',hint:'Fruit monsters drop from the trees — break out of the ring',goal:'pack'},
   {name:'Seed Splitters',pattern:'Splitters',hint:'Big seeds split in two when they pop — finish the small ones too',goal:'pack'},
   {name:'Orchard Snipers',pattern:'Sniper Nest',hint:'Snipers hide behind a thorn wall — go around it, don’t touch it',goal:'pack'},
   {name:'Harvest Stampede',pattern:'Stampede',hint:'A rush of fruit charges — dash through the gap',goal:'pack'}],
  [{name:'Glass Snipers',pattern:'Sniper Nest',hint:'Snipers hide behind glass thorns — go around, don’t touch them',goal:'pack'},
   {name:'Shard Shield',pattern:'Shield Carrier',hint:'The carrier shields its pack — break the carrier first',goal:'leader'},
   {name:'Glass Root Lure',pattern:'Root Lure',hint:'The crown root burrows after you — stand by a stone, dodge, and let it smash the stone',goal:'lure'},
   {name:'Glass Collapse',pattern:'Shrinking Arena',hint:'The floor cracks inward — clear the pack before it closes',goal:'pack'}],
  [{name:'Vault Guard',pattern:'Shield Carrier',hint:'The carrier shields its pack — break the carrier first',goal:'leader'},
   {name:'Vault Fortress',pattern:'Fortress',hint:'Heavy wardens block the way — circle behind them',goal:'pack'},
   {name:'Vault Wardens',pattern:'Elite Duo',hint:'Two elites guard each other when close — pull them apart',goal:'pack'},
   {name:'Vault Root Lure',pattern:'Root Lure',hint:'The crown root burrows after you — stand by a stone, dodge, and let it smash the stone',goal:'lure'}],
  [{name:'First Seed Commander',pattern:'Commander',hint:'The commander speeds up its pack — defeat it first',goal:'leader'},
   {name:'Last Seed Snipers',pattern:'Sniper Nest',hint:'Snipers hide behind a thorn wall — go around it, don’t touch it',goal:'pack'},
   {name:'Shrinking Throne',pattern:'Shrinking Arena',hint:'The safe ground shrinks — clear the pack before it closes',goal:'pack'},
   {name:'Final Stand',pattern:'Last Stand',hint:'Everything comes at once — stay at the edge of the crowd',goal:'pack'}]
];
const C1_SIT_SEC=20,C1_SIT_XP=.5;
const C1_SIT_EMOJI={Ambush:'🕳️',Fortress:'🛡️',Barrage:'🎯',Stampede:'💨',Pincer:'↔️',Commander:'👑','Hazard Shift':'⚠️','Last Stand':'🔥','Hunter Pack':'🐺','Spore Bloom':'🍄','Splitters':'🫧','Sniper Nest':'🏹','Shield Carrier':'🛡️','Elite Duo':'👥','Shrinking Arena':'⭕','Root Lure':'🐛'};
const SEASON_ENV_FROM=9,SEASON_ENV_CHANCE=1,SEASON_ENV_EVERY=10;   // v8.3.26 เจ้าของ: Seasonal Harvest = Environment Event · หลัง C2-4 · ด่านละ 1 ฤดู สุ่มเวฟเดียว · ผลเดิมของ C2-4 ทุก 10 วิ · จบเวฟ = จบ   // เป้าโบนัสภายใน 20 วิ · EXP burst = 50% ของ EXP ที่ต้องใช้ขึ้นเลเวลถัดไป
/* v8.3.12 เจ้าของ: Combat Director เลือก pattern ตาม เอกลักษณ์ด่าน × ช่วงเวลา × จำนวนศัตรูในสนาม (ไม่สุ่มลอย ๆ) · น้ำหนักเอกลักษณ์ด่าน (ไม่มี = 1) */
const C1_STAGE_PATTERN_WEIGHT=[
  {Ambush:2.2,Stampede:1.8,'Hunter Pack':1.3},
  {Pincer:2.2,Commander:1.8,'Hazard Shift':1.4},
  {'Hunter Pack':2,Barrage:1.8,Fortress:1.5},
  {Commander:2,Fortress:1.8,'Hazard Shift':1.6},
  {Commander:1.6,Barrage:1.5,'Hazard Shift':1.5,'Last Stand':1.8},
  {Ambush:1.8,Splitters:2,'Hazard Shift':1.4},{'Spore Bloom':2.2,Pincer:1.6,Commander:1.4},{Splitters:2,Stampede:1.8,'Elite Duo':1.5},{Pincer:1.8,Fortress:1.6,'Elite Duo':1.6},{Ambush:1.8,Fortress:1.8,Commander:1.5},
  {'Sniper Nest':2,'Hunter Pack':1.6,'Shield Carrier':1.5},{Ambush:1.6,Splitters:1.8,'Sniper Nest':1.6},{'Sniper Nest':2,'Shield Carrier':1.8,'Shrinking Arena':1.4},{'Shield Carrier':2,Fortress:1.6,'Elite Duo':1.6},{Commander:1.6,'Sniper Nest':1.6,'Shrinking Arena':1.6,'Last Stand':1.8}
];
const C1_HEAVY_PATTERNS=['Commander','Fortress','Pincer','Last Stand','Shield Carrier','Elite Duo','Shrinking Arena'],C1_PATTERN_FROM={Commander:1,Fortress:1,'Hazard Shift':2,'Spore Bloom':5,Splitters:5,'Elite Duo':5,'Sniper Nest':10,'Shield Carrier':10,'Shrinking Arena':10},C1_FIELD_FULL=.7,C1_FIELD_EMPTY=.3;
// v7.9.50 Card types unlock stage by stage in Story (owner: reveal card types gradually, as part of the tutorial) · value = stage index where the type first appears
/* v7.9.86 เจ้าของ: มอน/บอส/มินิบอสห้ามเกิดนอกแมพ · จุดที่อยู่นอกแมพ → ย้ายไปกลางแมพ (สุ่มรอบ ๆ กลางเล็กน้อย) */
function inMapPt(x,y,m=80){ const L=WORLD/2-m; return [Math.max(-L,Math.min(L,x)),Math.max(-L,Math.min(L,y))]; }   // v8.1.105 เจ้าของ: มอนโผล่กลางจอ — เดิมจุดนอกแมพถูกสุ่มไปใกล้กลางแมพ → ตอนนี้ดันเข้าขอบแมพแทน
const STORY_HP_MUL=1.2;   // v7.9.85 เจ้าของ: ตัวละครตีแรงไป → มอน/Elite/มินิ/บอสใน Story ถึกขึ้น 20%
const CARD_UNLOCK={path:0,relic:2,unique:3,mod:4,mutation:5,evolution:5,infusion:6,trade:7};
const CARD_INTRO={path:['📖','Battle Recipe','A page of Grandma’s recipes was tucked in your Heart Seed! Pick 1 of 3 fighting styles for this stage. Your next cards follow that style.'],relic:['🔮','Relic','A strong passive bonus that lasts the whole stage. You can hold a few.'],unique:['⭐','Unique Upgrade','You used your Unique 3 times — now you can power it up.'],mod:['🧩','Modifier','Adds a new trick to your attack, like an explosion or chain hit.'],mutation:['⭐','Mutation','Change how your attack works. Pick 1, the other locks.'],evolution:['✨','Evolution','Your attack is maxed — evolve it into its final form!'],infusion:['🍯','Flavor Infusion','Give your attack a flavor: burn, freeze, poison or heal.'],trade:['⚖️','Trade-off','Big bonus with a cost. Read both sides before you take it.']};
function cardTypeOf(o){ if(!o)return null; const k=o.kind; return k==='Build Path'?'path':k==='Relic'?'relic':(o.uniqueCard||k==='⭐ Unique'||k==='⭐ Unique Mutation')?'unique':k==='Modifier'?'mod':o.mutation?'mutation':o.evolution?'evolution':k==='Flavor Infusion'?'infusion':k==='Trade-off'?'trade':null; }
function storyXpNext(level){const L=Math.max(1,level);return Math.round((12+6*(L-1))*(1+XP_LATE_GROW*Math.max(0,L-10)));}   // v8.3.13 เจ้าของ: Lv 10+ ขึ้นช้าลง (+2%/เลเวล → Lv 20 ≈ +20%)
const XP_LATE_GROW=.02;
