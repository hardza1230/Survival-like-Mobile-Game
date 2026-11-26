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
const GAME_VERSION = '8.3.11';
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
  pressure:['Pincer','Hunter Pack','Commander','Barrage'],
  recovery:['Loot Rush'],
  escalation:['Barrage','Fortress','Commander','Hazard Shift','Stampede'],
  swarm:['Last Stand','Pincer','Ambush']
};
// v8.3.10 เจ้าของ: เวฟ C1 สั้นลง (เดิม 30/45/–/105/60 วิ) · ช่วงพักต้นเวฟ 4 (เดิม 30 วิ)
const C1_WAVE_SEC=[24,35,0,80,45],C1_RECOVERY_SEC=20;
// v8.3.10 เจ้าของ: ภารกิจแทรกโผล่เฉพาะที่เคยเจอ · home = ด่านที่ภารกิจเต็มอยู่ (C1-2 Hunger’s Mouth · C1-3 Grandma’s Pot · C1-4 Frozen Pantry)
const C1_SIDE_EVENTS=[
  {name:'Hunger’s Mouth',home:1,key:'hm_hand',icon:'✦',color:0xbc89ff,types:['fast','fast','dasher'],reward:24},
  {name:'Frozen Pantry',home:3,key:'fp_jar',icon:'❄',color:0x9fe0ff,types:['tank','basic','basic'],reward:28},
  {name:'Grandma’s Pot',home:2,key:'gp_pot',icon:'♨',color:0xffcd88,types:['basic','fast'],hold:7,reward:26}
];
// v7.9.50 Card types unlock stage by stage in Story (owner: reveal card types gradually, as part of the tutorial) · value = stage index where the type first appears
/* v7.9.86 เจ้าของ: มอน/บอส/มินิบอสห้ามเกิดนอกแมพ · จุดที่อยู่นอกแมพ → ย้ายไปกลางแมพ (สุ่มรอบ ๆ กลางเล็กน้อย) */
function inMapPt(x,y,m=80){ const L=WORLD/2-m; return [Math.max(-L,Math.min(L,x)),Math.max(-L,Math.min(L,y))]; }   // v8.1.105 เจ้าของ: มอนโผล่กลางจอ — เดิมจุดนอกแมพถูกสุ่มไปใกล้กลางแมพ → ตอนนี้ดันเข้าขอบแมพแทน
const STORY_HP_MUL=1.2;   // v7.9.85 เจ้าของ: ตัวละครตีแรงไป → มอน/Elite/มินิ/บอสใน Story ถึกขึ้น 20%
const CARD_UNLOCK={path:0,relic:2,unique:3,mod:4,mutation:5,evolution:5,infusion:6,trade:7};
const CARD_INTRO={path:['📖','Battle Recipe','A page of Grandma’s recipes was tucked in your Heart Seed! Pick 1 of 3 fighting styles for this stage. Your next cards follow that style.'],relic:['🔮','Relic','A strong passive bonus that lasts the whole stage. You can hold a few.'],unique:['⭐','Unique Upgrade','You used your Unique 3 times — now you can power it up.'],mod:['🧩','Modifier','Adds a new trick to your attack, like an explosion or chain hit.'],mutation:['⭐','Mutation','Change how your attack works. Pick 1, the other locks.'],evolution:['✨','Evolution','Your attack is maxed — evolve it into its final form!'],infusion:['🍯','Flavor Infusion','Give your attack a flavor: burn, freeze, poison or heal.'],trade:['⚖️','Trade-off','Big bonus with a cost. Read both sides before you take it.']};
function cardTypeOf(o){ if(!o)return null; const k=o.kind; return k==='Build Path'?'path':k==='Relic'?'relic':(o.uniqueCard||k==='⭐ Unique'||k==='⭐ Unique Mutation')?'unique':k==='Modifier'?'mod':o.mutation?'mutation':o.evolution?'evolution':k==='Flavor Infusion'?'infusion':k==='Trade-off'?'trade':null; }
function storyXpNext(level){return 12+6*(Math.max(1,level)-1);}
