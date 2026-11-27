const FR_TRIGGERS=[
  {id:'dash',     emoji:'💨',name:'On Dash',            cost:3, icd:1.5},
  {id:'crit',     emoji:'🎯',name:'On Critical Hit',    cost:4, icd:0.6},
  {id:'kill10',   emoji:'☠️',name:'Every 10 Kills',      cost:3},
  {id:'hurt',     emoji:'💢',name:'When Hit',            cost:2, icd:1.5},
  {id:'lowHp',    emoji:'🩸',name:'Below 30% HP',        cost:1, icd:8},
  {id:'unique',   emoji:'🌟',name:'On Unique Skill',     cost:2},
  {id:'xp20',     emoji:'⭐',name:'Every 20 EXP Orbs',   cost:2},
  {id:'timer5',   emoji:'⏱️',name:'Every 5 Seconds',     cost:4},
  {id:'still',    emoji:'🧘',name:'Stand Still 1.5s',    cost:2},
  {id:'eliteKill',emoji:'👑',name:'On Elite Kill',       cost:1},
  {id:'levelup',  emoji:'🆙',name:'On Level Up',         cost:1},
  {id:'newWave',  emoji:'🌊',name:'Wave Start',          cost:1},
  {id:'shield',   emoji:'🫧',name:'When a Shield Breaks',cost:2, chain:true},
  {id:'heal',     emoji:'💚',name:'When Healed',         cost:3, chain:true, icd:1},
  // v5.47 เพิ่มความหลากหลาย
  {id:'bossHit',  emoji:'👊',name:'Hitting a Boss',      cost:3, icd:1.5},
  {id:'multikill',emoji:'💀',name:'5 Kills in 1s',       cost:2, icd:1},
  {id:'surround', emoji:'🌀',name:'8+ Enemies Near',     cost:2, icd:4},
  {id:'moving',   emoji:'🏃',name:'Every 3s Moving',     cost:3},
  {id:'fullHp',   emoji:'💯',name:'Every 3s at Full HP', cost:2},
  {id:'bossAppear',emoji:'😈',name:'Boss Appears',       cost:1},
  {id:'kill25',emoji:'🍬',name:'Every 25 Kills',cost:2},
  {id:'timer10',emoji:'⌛',name:'Every 10 Seconds',cost:2},
];
const FR_EFFECTS=[
  {id:'shock',  emoji:'💥',name:'Shockwave',          cost:3},
  {id:'shots',  emoji:'✳️',name:'8-Way Shots',        cost:3},
  {id:'heal',cut:true,   emoji:'💚',name:'Heal 2% HP',         cost:3},
  {id:'shield',cut:true, emoji:'🫧',name:'Gain a Shield',      cost:4},
  {id:'freeze', emoji:'❄️',name:'Freeze Nearby',      cost:3},
  {id:'rage',   emoji:'🔥',name:'Rage +30% DMG 4s',   cost:4},
  {id:'bolt',   emoji:'⚡',name:'Lightning ×3',        cost:3},
  {id:'cdr',cut:true,    emoji:'⏳',name:'Unique Cooldown −2s', cost:3},
  {id:'vacuum', emoji:'🧲',name:'Pull All EXP',       cost:2},
  {id:'burn',   emoji:'🌶️',name:'Burning Ground',     cost:3},
  {id:'buddy',  emoji:'🍡',name:'Mochi Buddy 5s',     cost:4},
  {id:'immune',cut:true, emoji:'🛡️',name:'Immune 1s',          cost:4},
  // v5.47 เพิ่มความหลากหลาย
  {id:'meteor', emoji:'☄️',name:'Candy Meteors ×3',   cost:4},
  {id:'orbit',  emoji:'🍭',name:'Lollipop Orbit 4s',  cost:4},
  {id:'haste',  emoji:'👟',name:'Haste +35% 4s',      cost:2},
  {id:'sour',   emoji:'🍋',name:'Sour Splash',        cost:2},
  {id:'cleanse',emoji:'🧽',name:'Wipe Enemy Shots',   cost:3},
  {id:'hole',   emoji:'🕳️',name:'Syrup Vortex',       cost:4},
  {id:'recover',cut:true,emoji:'💗',name:'Heal 12% HP',cost:4},
  {id:'burst',emoji:'🌈',name:'Rainbow Burst',cost:4},
];
const FR_MODS=[
  {id:'big',    emoji:'⬆️',name:'Bigger',   desc:'+50% area',              cost:2},
  {id:'strong', emoji:'💪',name:'Stronger', desc:'+50% power',             cost:2},
  {id:'repeat', emoji:'🔁',name:'Echo',     desc:'Fires again after 0.5s', cost:3},
  {id:'faster', emoji:'⚡',name:'Quicker',  desc:'Trigger needs less',     cost:2},
  {id:'fire',   emoji:'🔥',name:'Spicy',    desc:'Also burns enemies hit', cost:1},
  {id:'ice',    emoji:'🧊',name:'Minty',    desc:'Also chills enemies hit',cost:1},
  {id:'chain',  emoji:'🔗',name:'Linked',   desc:'Can trigger other recipes',cost:1},
  {id:'gamble', emoji:'🎲',name:'Gamble',   desc:'50%: ×2.5 power or nothing',cost:0},
  // v5.47 เพิ่มความหลากหลาย
  {id:'focus',  emoji:'🔎',name:'Focused',  desc:'−40% area, +80% power',  cost:1},
  {id:'slow',   emoji:'🍲',name:'Slow Cook',desc:'1.5s later, ×1.8 power', cost:0},
  {id:'sweet',  emoji:'🍯',name:'Sweet',    desc:'Heal 1% per enemy hit',  cost:2},
  {id:'sour',   emoji:'🍋',name:'Sour',     desc:'Hit enemies take +12% 3s',cost:1},
  {id:'twin',   emoji:'👯',name:'Twin',     desc:'Fires twice, ×0.65 each',cost:2},
];
// v5.47 ⭐ Signature Dishes: คู่ WHEN+DO ที่เข้ากัน = ชื่อพิเศษ + พลัง +25%
/* v7.8.85 สูตร 4 ตัวที่ผูกกับ effect ที่ถูกตัด (shield/immune/cdr/recover) เปลี่ยนเป็น effect ที่ใช้ได้จริง */
const FR_SIGNATURES=[
  {t:'dash',e:'shock',name:'Sugar Rush Slam'},{t:'crit',e:'bolt',name:'Thunder Crème'},{t:'hurt',e:'cleanse',name:'Candy Armor'},
  {t:'lowHp',e:'freeze',name:'Brain Freeze'},{t:'kill10',e:'shots',name:'Sprinkle Fountain'},{t:'still',e:'meteor',name:'Chef’s Patience'},
  {t:'bossHit',e:'sour',name:'Tart Takedown'},{t:'surround',e:'hole',name:'Whirlpool Parfait'},{t:'moving',e:'burn',name:'Hot Trail'},
  {t:'multikill',e:'haste',name:'Frenzy Feast'},{t:'fullHp',e:'orbit',name:'Lollipop Guard'},{t:'bossAppear',e:'rage',name:'Battle Banquet'},
  {t:'newWave',e:'buddy',name:'Welcome Mochi'},{t:'unique',e:'shots',name:'Double Helping'},{t:'shield',e:'freeze',name:'Frozen Custard'},
  {t:'kill25',e:'burst',name:'Rainbow Feast'},{t:'timer10',e:'vacuum',name:'Slow Simmer'},
];
/* v8.2.37 เจ้าของ (แผน C): Kitchen แบบย่อช่วง Closed test — สูตรสำเร็จ 4 สูตร เลือกได้ 1 · ไม่หักพลัง · ไม่ใช้ชิ้นส่วน · เปลี่ยนฟรี
   ระบบผสมสูตรเดิม (ชิ้นส่วน/ช่อง/ค่าหัก) เก็บไว้ครบ · FR_SIMPLE=false = กลับไปแบบเดิม · ดูผลทดสอบก่อนค่อยทำ Cookbook */
const FR_SIMPLE=true;
const FR_PRESETS=[
  {t:'t:dash',  e:'e:shock',  name:'Sugar Rush Slam',desc:'Every dash releases a shockwave'},
  {t:'t:unique',e:'e:shots',  name:'Double Helping', desc:'Your Unique Skill also fires 8-way shots'},
  {t:'t:lowHp', e:'e:freeze', name:'Brain Freeze',   desc:'Below 30% HP, freeze nearby foes'},
  {t:'t:hurt',  e:'e:cleanse',name:'Candy Armor',    desc:'When hit, wipe nearby enemy shots'},
];
function frPick(){ const i=(typeof Save!=='undefined'&&Save.data)?Save.data.frPick:null; return (i!=null&&FR_PRESETS[i])?i:-1; }
function frSignature(r){ const t=r&&(r.t||'').replace(/^t:/,''),e=r&&(r.e||'').replace(/^e:/,''); return FR_SIGNATURES.find(x=>x.t===t&&x.e===e)||null; }
const FR_KIND={t:FR_TRIGGERS,e:FR_EFFECTS,m:FR_MODS};
function frIconKey(key){ const icon=key&&'fr_'+key[0]+'_'+key.slice(2); return icon&&ASSET_IMAGES[icon]?icon:null; }
function frPart(key){ if(!key)return null; const k=key[0],id=key.slice(2); return (FR_KIND[k]||[]).find(x=>x.id===id)||null; }   // key = 't:dash' / 'e:shock' / 'm:big'
// v6.69 Kitchen upkeep: ทุกสูตรที่ใช้งานต้องแลก −6% Max HP / −4% AP (+2% ต่อ ★ ของ DO, +2% signature)
/* v6.77 C4: Kitchen locked until Chapter 2 (stage 10) cleared */
// v7.9.76 เจ้าของ: ระบบที่ยังไม่ปลดจะไม่แสดง แล้วค่อย ๆ โผล่ตามด่านที่ผ่าน (ค่า = จำนวนด่าน Story ที่ผ่านแล้ว)
// v8.0.72 เจ้าของ: กระสุนบอสทุกตัวเหมือนกัน → แต่ละด่านมีสี/รูป/ขนาด + พฤติกรรมของตัวเอง (ดาเมจ/จำนวนลูก/จังหวะเดิม)
// k รูป · c สี · s ขนาด · b พฤติกรรม: wave ส่าย · bounce เด้งขอบจอ · split แตก 3 · home เลี้ยวตาม · boomer ย้อนกลับ · delay หยุดแล้วระเบิดเป็นวง
const BOSS_SHOT=[{k:'boss_orb',c:0x9dff5a,s:1,b:'wave'},{k:'boss_orb',c:0x5fd8c8,s:1.1,b:'bounce'},{k:'boss_star',c:0xff9a3c,s:1.05,b:'split'},{k:'boss_shard',c:0x9fe4ff,s:1,b:'delay'},{k:'boss_orb',c:0xc28bff,s:1.1,b:'home'},
  {k:'boss_star',c:0xff8fc8,s:1,b:'boomer'},{k:'boss_orb',c:0xd8f05a,s:1.05,b:'split'},{k:'boss_shard',c:0xffc23d,s:1,b:'home'},{k:'boss_star',c:0xd6b4ff,s:1,b:'boomer'},{k:'boss_shard',c:0xe07a5a,s:1.05,b:'wave'},
  {k:'boss_orb',c:0xffe08a,s:1.1,b:'bounce'},{k:'boss_star',c:0xffb59a,s:1,b:'delay'},{k:'boss_shard',c:0x7ff0ff,s:1,b:'bounce'},{k:'boss_orb',c:0x7fe38f,s:1.05,b:'split'},{k:'boss_star',c:0xff5a6e,s:1.1,b:'home'}];
const BOSS_SHOT_PIN={k:'boss_star',c:0xe05aff,s:1.15,b:'delay',p:'bshot_pin'};BOSS_SHOT.forEach((x,i)=>x.p='bshot_'+String(i+1).padStart(2,'0'));   // ใบ 60 ภาพวาด (มี = ใช้แทนรูปโค้ด)
// v8.0.74 เจ้าของ: บอสสายร่างกายไม่ยิงกระสุน → ท่ายิงทุกท่ากลายเป็นท่ากาย (คลื่นพื้น · พุ่งชน · ของตกจากฟ้า · ปัดกวาด) สลับกัน ≤1 ท่า/1.1s
const PW57=['core_life','core_flavor','core_bond','weave_crest','thread_knot','weave_up','slot_weapon','slot_armor','slot_gloves','slot_amulet','slot_ring','slot_boots','equip_best','salvage','gear_sets','gear_lock','merge_keep','rarity_up','fp_hammer','mod_add','mod_swap','star_up','mod_remove','lucky'];   // ใบ 57 ลำดับเซลล์
const MENU59=['tab_login','tab_daily','tab_awards','row_rewards','row_kitchen','row_recipe_maps','tab_chests','tab_shop','tab_trade','tab_heroes','tab_talents','tab_stats','set_sound','set_music','set_voice','set_shake','set_flash','set_vfx','set_cloud','set_tutorial','mail','news','codex_recipe','codex_bestiary'];   // ใบ 59 ลำดับเซลล์
const M59_ROW={rewards:'row_rewards',kitchen:'row_kitchen',recipes:'row_recipe_maps',__tutorial:'set_tutorial',skills:'codex_recipe',bestiary:'codex_bestiary',news:'news',gearInbox:'mail',daily:'tab_daily',achievements:'tab_awards'},M59_EMOJI={'🔊':'set_sound','🎵':'set_music','🔔':'set_sound','💬':'set_voice','📳':'set_shake','✨':'set_flash','🎆':'set_vfx','☁️':'set_cloud','✅':'set_cloud'};
const BOSS_NO_SHOT=new Set([0,3,6,10,14]);   // C1-1 Ant Empress · C1-4 Frost Golem · C2-2 Behemoth · C3-1 Colossus · C3-5 First Planter (บอส + มินิด่านนั้น; Pinnacle/Delve ยิงเหมือนเดิม)
const FEATURE_OPEN={patrol:3,dig:5,bazaar:1,gActivity:1,daily:1,achievements:1,rewards:1,news:1,gear:1,gearInbox:1,craft:2,merge:2,char:1,gCodex:2,skills:2,bestiary:2};
const FEAT_TAG={dig:'gActivity',bazaar:'bazaar',gActivity:'gActivity',char:'char',daily:'side_rewards',achievements:'side_rewards',rewards:'side_rewards',news:'side_news',gearInbox:'side_gearInbox',gCodex:'side_gCodex',gear:'gLoadout',craft:'gLoadout'};
const FEAT_ICON={dig:'tile_dig',rewards:'ic_side_daily',bazaar:'ic_nav_bazaar',gActivity:'ic_nav_activities',char:'ic_nav_heroes',daily:'ic_side_daily',achievements:'ic_side_awards',news:'ic_side_news',gearInbox:'ic_side_mail',gCodex:'ic_side_codex',gear:'ic_nav_upgrade',craft:'ic_nav_upgrade'};
const FEAT_LINE={dig:'Mochi Garden is open! Send heroes on garden trips — they keep collecting Sugar and Twist Cream while you’re away. Find it in Activities.',rewards:'Rewards is open! Your daily login gift, Daily Quests and Awards are all here.',bazaar:'The Bazaar is open! Open treasure chests and shop for gear with your Sugar and Thread.',gActivity:'Activities: daily goals and side fun that pay out rewards.',daily:'Daily Quests reset every day — finish them for reward boxes!',achievements:'Awards count your big moments and pay Sugar for each one.',news:'News shows what changed in each update.',gearInbox:'Mail keeps loot that did not fit your bag. Check it often!',gear:'Equipment! Put on the gear you find — it lives in the Upgrade tab.',craft:'Gear Merge is open! Merge 3 items of the same slot and rarity for a higher rarity and a new mod. Upgrade gear with Sugar and Twist Cream.',char:'Heroes! A new friend has joined — switch heroes and spend Talent points here.',gCodex:'The Recipe Book remembers every Build card, relic and monster you meet.'};
const FEATURE_NAME={patrol:'🌙 Mochi Patrol',dig:'🌸 Mochi Garden',rewards:'🎁 Rewards',bazaar:'🛒 Bazaar',gActivity:'🎯 Activities',daily:'📋 Daily Quests',achievements:'🏆 Awards',news:'📰 News',gear:'🎒 Equipment',gearInbox:'📦 Mail',craft:'🔗 Gear Merge',char:'🧸 Heroes',gCodex:'📖 Recipe Book'};
// v8.0.29 เจ้าของ: Recipe Book — การ์ดทุกใบของแต่ละ Build (การ์ดสาย + Unique Mutation) · เคยเลือก = ✓ · ครบสายได้ Thread
const RECIPE_PATH_THREAD=30;
function recipeCards(hero,pid){ const pt=(BASIC_PATHS[hero]||[]).find(x=>x.id===pid); if(!pt)return []; const L=(pt.upgrades||[]).map(u=>({id:u.id,name:u.name,emoji:u.emoji,iconKey:u.iconKey,desc:hero==='yuzu'?u.desc:u.headline||u.desc}));
  for(const m of ((typeof UNIQUE_MUTS!=='undefined'&&UNIQUE_MUTS[pid])||[]))L.push({id:'uq:'+m.id,name:m.name,emoji:m.emoji,iconKey:hero==='yuzu'?yuzuCardArt(pid,m.id):'ic_uqm_'+m.id,desc:'⭐ Unique Mutation · '+m.desc,uq:true}); return L; }
function recipeSeen(hero,pid){ const R=(Save.data&&Save.data.recipeBook)||{}; return ((R[hero]||{})[pid])||{}; }
function storyCleared(){ const d=Save.data||{},sm=d.stageMastery||{}; return Math.max(d.unlockedStage||0,Object.keys(sm).filter(k=>sm[k]).length); }
/* v8.1.70 เจ้าของ: คนทำงานเวลาน้อย → Sweep (ด่าน 3 ดาว รับรางวัลทันที) + Mochi Patrol (เปิดเกมทิ้งไว้ ฮีโร่สู้เอง)
   กฎเหล็ก: ได้น้อยกว่าเล่นเองเสมอ · Sweep = 50% ของ Sugar ที่เคยได้จริงในด่านนั้น + EXP 50% · วันละ 5 ครั้ง
   Patrol = ~40% ต่อนาทีของการเล่นด่านดีที่สุด · นับเฉพาะตอนจอเปิดอยู่ · สูงสุด 240 นาที/วัน */
const SWEEP_DAY=5,SWEEP_CUT=0.5,PATROL_CUT=0.4,PATROL_RUN_MIN=8,PATROL_DAY_MIN=240;
function sweepRecord(si,sugar){ const d=Save.data; if(!d||!Number.isFinite(si)||!(sugar>0))return; const r=d.sweepRef||(d.sweepRef={}); r[si]=Math.max(r[si]|0,Math.round(sugar)); }
function sweepOk(si){ const d=Save.data||{}; return ((d.stageStars||{})[si]|0)===7&&((d.sweepRef||{})[si]|0)>0; }
function sweepLeft(){ const d=Save.data||{},k=localDayKey(); if(!d.sweep||d.sweep.day!==k)return SWEEP_DAY; return Math.max(0,SWEEP_DAY-(d.sweep.n|0)); }
function sweepReward(si){ const d=Save.data||{}; return {sugar:Math.max(1,Math.round(((d.sweepRef||{})[si]|0)*SWEEP_CUT)),exp:Math.round((75+si*35)*SWEEP_CUT)}; }
function patrolStage(){ const r=(Save.data||{}).sweepRef||{}; let best=-1; for(const k in r)if((r[k]|0)>0&&+k>best)best=+k; return best; }
function patrolRate(){ const si=patrolStage(); if(si<0)return null; const ref=Save.data.sweepRef[si]|0; return {si,sugar:ref*PATROL_CUT/PATROL_RUN_MIN,exp:(75+si*35+200)*PATROL_CUT/PATROL_RUN_MIN}; }   /* ต่อนาที */
function patrolUsed(){ const a=(Save.data||{}).afk; return a&&a.day===localDayKey()?a.min||0:0; }
function featureOpen(t){ if(t==='kitchen')return kitchenOpen(); if(t==='recipes')return !!Save.endgameUnlocked?.();   /* v8.0.19 เจ้าของ: Delve เปิดหลังจบเนื้อเรื่อง */ if(t==='gearInbox'&&typeof GEAR_INBOX_ON!=='undefined'&&!GEAR_INBOX_ON)return false; if(t==='gearInbox'&&(Save.data?.gearInbox||[]).length)return true; const n=FEATURE_OPEN[t]; return n==null||storyCleared()>=n; }
const CHEST_PITY=10;
const CHESTS=[{id:'silver',name:'Silver Chest',cost:30,odds:[['common',.5],['rare',.42],['epic',.075],['legend',.005]],tint:0xdfe6f0,bg:0x2a3346,edge:0xc9d6ea,title:'#e6eefb'},
  {id:'gold',name:'Gold Chest',cost:120,odds:[['rare',.3],['epic',.6],['legend',.1]],tint:0xffc43d,bg:0x3a2a12,edge:0xffc43d,title:'#ffe08a'}];
/* v8.2.54 ECRS2 S1 (เจ้าของเลือก 22 พ.ย.): กล่อง Gear จ่ายด้วย 🍬 Sugar (ได้จากการเล่นเท่านั้น) ไม่ใช่ 🧶 Thread · ราคาตามระดับไอเทมเดียวกับ Sugar Chest (Silver ×1.4 · Gold ×4) */
function chestSugarCost(c){ const b=(typeof GACHA_LEVELS!=='undefined'&&typeof gachaMaxBand==='function')?GACHA_LEVELS[Math.max(0,gachaMaxBand())].cost:150; return Math.round(b*(c&&c.id==='gold'?4:1.4)/10)*10; }
/* v8.1.45 เจ้าของ: ร้านขายของสวย/ความสะดวก · ยังไม่ผูก Google Play Billing (Iap.available()=false)
   v8.2.55 เจ้าของ 22 พ.ย.: เงินจริง → 🍭 Lollipops (สกุลใหม่) ใช้ได้แค่ของแต่งตัว/Pass · 🧶 Thread = ได้จากการเล่นเท่านั้น (Thread ซื้อพลังได้ → ห้ามขาย) */
const IAP_PACKS=[{id:'lolli_60',lolli:60,bonus:0,price:'THB 35'},{id:'lolli_200',lolli:180,bonus:20,price:'THB 99'},{id:'lolli_400',lolli:330,bonus:70,price:'THB 179'},{id:'lolli_850',lolli:650,bonus:200,price:'THB 349'},{id:'lolli_1800',lolli:1300,bonus:500,price:'THB 699'},{id:'lolli_4000',lolli:2600,bonus:1400,price:'THB 1,450'}];
const MOCHI_PASS={id:'mochi_pass',price:'THB 129',instant:300,daily:60,days:30};
const Iap={
  available(){ return !!(typeof window!=='undefined'&&window.MochiBilling&&window.MochiBilling.ready); },
  pack(id){ return IAP_PACKS.find(p=>p.id===id)||null; },
  firstBonus(id){ const d=(typeof Save!=='undefined'&&Save.data)||{}; return !(d.iapFirst&&d.iapFirst[id]); },
  passDaysLeft(now){ const d=Save.data||{},ps=d.mochiPass; if(!ps||!ps.until)return 0; const left=Math.ceil((ps.until-(now||Date.now()))/864e5); return Math.max(0,left); },
  passClaimable(now){ const d=Save.data||{}; return this.passDaysLeft(now)>0&&d.mochiPass.day!==localDayKey()&&(d.mochiPass.left==null||d.mochiPass.left>0); },
  /* เรียกหลัง Play ยืนยันการซื้อแล้วเท่านั้น · คืนจำนวน 🍭 ที่ได้ (v8.2.55: ไม่ให้ 🧶 Thread จากเงินจริงอีก) */
  grant(id,now){ const d=Save.data; if(!d)return 0; now=now||Date.now();
    if(id===MOCHI_PASS.id){ const ps=d.mochiPass||{}; ps.until=Math.max(ps.until||0,now)+MOCHI_PASS.days*864e5; ps.left=(ps.left>0?ps.left:0)+MOCHI_PASS.days; d.mochiPass=ps;   /* v8.1.67 รับได้ไม่เกิน 30 ครั้งต่อ Pass */ Save.addLollipops(MOCHI_PASS.instant); return MOCHI_PASS.instant; }
    const p=this.pack(id); if(!p)return 0; const first=this.firstBonus(id),n=(first?p.lolli*2:p.lolli)+p.bonus; d.iapFirst=Object.assign({},d.iapFirst,{[id]:1}); Save.addLollipops(n); return n; },
  claimPass(now){ if(!this.passClaimable(now))return 0; Save.data.mochiPass.day=localDayKey(); if(Save.data.mochiPass.left!=null)Save.data.mochiPass.left--; Save.addLollipops(MOCHI_PASS.daily); return MOCHI_PASS.daily; },
  buy(id,done){ if(!this.available()){ done&&done(false,'unavailable'); return; } try{ window.MochiBilling.buy(id,ok=>{ const n=ok?this.grant(id):0; done&&done(!!ok,n); }); }catch(e){ done&&done(false,'error'); } }
};
/* v8.1.46 เจ้าของ: Wardrobe ของแต่ง 2D (ปีก/สัตว์เลี้ยง/หางประกาย) ซื้อด้วยด้าย · ใช้ได้ทุกฮีโร่ · ไม่มีพลัง · อาร์ตใบ 66 (ยังไม่มา = วาดแทนด้วยโค้ด) */
const COSMETICS=[
  {id:'wing_cream',slot:'wings',name:'Whipped Cream Wings',price:450,col:0xfff4e0,icon:['cos_icons',0]},
  {id:'wing_sugar',slot:'wings',name:'Spun Sugar Wings',price:450,col:0xbfe8ff,icon:['cos_icons',1]},
  {id:'wing_ruby',slot:'wings',name:'Ruby Jam Wings',price:450,col:0xff7a9a,icon:['cos_icons',2]},
  {id:'wing_rainbow',slot:'wings',name:'Rainbow Jelly Wings',price:450,col:0xc8b6ff,icon:['cos_icons2',12]},
  {id:'wing_butterfly',slot:'wings',name:'Macaron Butterfly Wings',price:450,col:0xffd0e8,icon:['cos_icons2',13]},
  {id:'wing_honeycomb',slot:'wings',name:'Honeycomb Wings',price:450,col:0xffc94a,emoji:'🍯',icon:['cos_wing_honeycomb_paint']},   // v8.3.21 เจ้าของ: ของใหม่ 7 ชิ้น ราคาเท่าประเภทเดียวกัน
  {id:'wing_matcha',slot:'wings',name:'Matcha Wings',price:450,col:0x9fd68a,emoji:'🍵',icon:['cos_wing_matcha_paint']},
  {id:'wing_midnight',slot:'wings',name:'Midnight Wings',price:450,col:0x7a6ad8,emoji:'🌙',icon:['cos_wing_midnight_paint']},
  {id:'pet_mochi',slot:'pet',name:'Flying Mochi',price:300,col:0xffd6e8,emoji:'🍡',icon:['cos_icons',3]},
  {id:'pet_turtle',slot:'pet',name:'Macaron Turtle',price:300,col:0x9fe0b8,emoji:'🐢',icon:['cos_icons',4]},
  {id:'pet_bird',slot:'pet',name:'Cookie Bird',price:300,col:0xe0a860,emoji:'🐤',icon:['cos_icons',5]},
  {id:'pet_bunny',slot:'pet',name:'Balloon Bunny',price:300,col:0xfff0f6,emoji:'🐰',icon:['cos_icons2',14]},
  {id:'pet_jelly',slot:'pet',name:'Smiling Jelly',price:300,col:0x9fd8ff,emoji:'🫧',icon:['cos_icons2',15]},
  {id:'pet_fox',slot:'pet',name:'Pudding Fox',price:300,col:0xffb36b,emoji:'🦊',icon:['cos_accessories_paint',15]},
  {id:'trail_heart',slot:'trail',name:'Heart Trail',price:150,col:0xff8fb5,tk:'cos_trail',tf:0,icon:['cos_icons',6]},
  {id:'trail_star',slot:'trail',name:'Star Trail',price:150,col:0xffe08a,tk:'cos_trail',tf:1,icon:['cos_icons',7]},
  {id:'trail_sugar',slot:'trail',name:'Sugar Sparkle Trail',price:150,col:0xffffff,tk:'cos_trail',tf:2,icon:['cos_icons',8]},
  {id:'trail_note',slot:'trail',name:'Music Note Trail',price:150,col:0xff9ed8,tk:'cos_trail2',tf:0,icon:['cos_icons2',16]},
  {id:'trail_bubble',slot:'trail',name:'Bubble Trail',price:150,col:0xbfe8ff,tk:'cos_trail2',tf:1,icon:['cos_icons2',17]},
  {id:'trail_flower',slot:'trail',name:'Little Flower Trail',price:150,col:0xfff08a,tk:'cos_trail2',tf:2,icon:['cos_icons2',18]},
  {id:'trail_mint',slot:'trail',name:'Mint Leaf Trail',price:150,col:0x9ff0d0,emoji:'🌿',icon:['cos_accessories_paint',6]},
  {id:'halo_donut',slot:'halo',name:'Sprinkle Donut Halo',price:400,col:0xff9ec4,icon:['cos_icons2',0]},
  {id:'halo_crown',slot:'halo',name:'Sugar Glass Crown',price:400,col:0xffe08a,icon:['cos_icons2',1]},
  {id:'halo_cloud',slot:'halo',name:'Cotton Cloud Rainbow',price:400,col:0xdff4ff,icon:['cos_icons2',2]},
  {id:'aura_candy',slot:'aura',name:'Candy Swirl Ring',price:350,col:0xff9ec4,icon:['cos_icons2',3]},
  {id:'aura_flower',slot:'aura',name:'Blossom Ring',price:350,col:0xffc6df,icon:['cos_icons2',4]},
  {id:'aura_star',slot:'aura',name:'Twinkle Star Ring',price:350,col:0xffe08a,icon:['cos_icons2',5]},
  {id:'dash_bubble',slot:'dash',name:'Bubble Dash',price:250,col:0xbfe8ff,icon:['cos_icons2',6]},
  {id:'dash_confetti',slot:'dash',name:'Confetti Dash',price:250,col:0xffd166,icon:['cos_icons2',7]},
  {id:'dash_cream',slot:'dash',name:'Whipped Cream Dash',price:250,col:0xfff4e0,icon:['cos_icons2',8]},
  {id:'dash_caramel',slot:'dash',name:'Caramel Dash',price:250,col:0xd89a4a,emoji:'🍮',icon:['cos_accessories_paint',10]},
  {id:'pop_heart',slot:'pop',name:'Heart Pop',price:300,col:0xff8fb5,icon:['cos_icons2',9]},
  {id:'pop_sprinkle',slot:'pop',name:'Sprinkle Pop',price:300,col:0xa8f0d0,icon:['cos_icons2',10]},
  {id:'pop_star',slot:'pop',name:'Star Pop',price:300,col:0xffe08a,icon:['cos_icons2',11]},
  {id:'pop_berry',slot:'pop',name:'Berry Pop',price:300,col:0xff5c8a,emoji:'🍓',icon:['cos_accessories_paint',14]}];
const COS_ACC_ICONS=['trail_heart','trail_star','trail_sugar','trail_note','trail_bubble','trail_flower','trail_mint','dash_bubble','dash_confetti','dash_cream','dash_caramel','pop_heart','pop_sprinkle','pop_star','pop_berry','pet_fox'];   // v8.3.21 cos_accessories_paint cell order
const COS_LOBBY_MAX=1.6;   // v8.1.58 เจ้าของ: Lobby ขยายภาพเล็กเกิน ~3 เท่า → แตก · จำกัดไม่เกิน 1.6 เท่าของต้นฉบับ
/* v8.1.70 เจ้าของ: ปีก/ฮาโล/วงใต้เท้า แปะตัวแล้วดูลอย → เลิกขายแยก (คืนด้ายเต็มราคา) · ขายเป็นสกินเต็มตัวแทน (ใบ 69) */
const COS_RETIRED=['halo','aura'];   // v8.2.2 เจ้าของ: ปีกกลับมาขายแยกใน Wardrobe (halo/aura ยังเลิกขาย)
const COS_SLOTS=[['skin','Skins'],['wings','Wings'],['pet','Pets'],['trail','Trails'],['dash','Dash'],['pop','Pops']];
/* สกินเต็มตัว (ใบ 69): tag = ต่อท้าย key ภาพเดิม เช่น card_momo__sakura / char_momo_run__sakura · ยังไม่มีอาร์ต = ยังไม่ขาย (Soon) */
const SKIN_PRICE=1200;
const SKINS=[
  {id:'momo_sakura',hero:'momo',tag:'sakura',name:'Sakura Festival',col:0xffb6d9,icon:['skin_icons69',0]},
  {id:'mint_snow',hero:'mint',tag:'snow',name:'Snowflake Princess',col:0xbfe8ff,icon:['skin_icons69',1]},
  {id:'cocoa_chef',hero:'cocoa',tag:'chef',name:'Pastry Chef',col:0xe0a860,icon:['skin_icons69',2]},
  {id:'taro_star',hero:'taro',tag:'star',name:'Starlight Astronomer',col:0xc8b6ff,icon:['skin_icons69',3]},
  {id:'yuzu_summer',hero:'yuzu',tag:'summer',name:'Summer Splash',col:0xffd06a,icon:['skin_icons69',4]},
  {id:'sesame_moon',hero:'sesame',tag:'moon',name:'Moon Rabbit',col:0xfff4d8,icon:['skin_icons69',5]}];
/* v8.1.54 เจ้าของ: เพิ่มความหลากหลาย → ย้อมสีฟรี 5 แบบต่อชิ้นที่มีแล้ว (ไม่ต้องสั่งอาร์ตเพิ่ม) */
const COS_DYES=[['Original',null],['Pink',0xffb6d9],['Mint',0xa8f0d0],['Gold',0xffe08a],['Sky',0xbfd8ff]];
const Cos={
  data(){ const d=Save.data; if(!d.cos)d.cos={own:{},eq:{}}; if(!d.cos.dye)d.cos.dye={}; if(!d.cos.skin)d.cos.skin={}; if(!d.cos.sown)d.cos.sown={};
    if(!d.cos.r69){ d.cos.r69=1; let n=0; for(const c of COSMETICS)if(COS_RETIRED.includes(c.slot)&&d.cos.own[c.id]){ n+=c.price; delete d.cos.own[c.id]; delete d.cos.dye[c.id]; } COS_RETIRED.forEach(sl=>{ delete d.cos.eq[sl]; }); if(n>0){ d.threads=(d.threads|0)+n; d.cos.refund69=n; } }   // v8.1.70 คืนด้ายของที่เลิกขาย ครั้งเดียว
    return d.cos; },
  retired(c){ return !!c&&COS_RETIRED.includes(c.slot); },
  shop(slot){ return COSMETICS.filter(c=>c.slot===slot&&!this.retired(c)); },
  skinItem(id){ return SKINS.find(k=>k.id===id)||null; },
  skinsFor(hero){ return SKINS.filter(k=>k.hero===hero); },
  skinReady(k){ return !!k&&typeof ASSET_IMAGES!=='undefined'&&!!ASSET_IMAGES['card_'+k.hero+'__'+k.tag]; },
  skinOwns(id){ return !!this.data().sown[id]; },
  skin(hero){ const id=this.data().skin[hero],k=this.skinItem(id); return k&&this.skinOwns(id)&&this.skinReady(k)?k:null; },
  setSkin(hero,id){ if(id&&(!this.skinOwns(id)||this.skinItem(id)?.hero!==hero))return false; this.data().skin[hero]=id||null; Save.save(); return true; },
  /* v8.2.55 จ่ายได้ 2 ทาง: cur='thread' (🧶 ได้จากการเล่น · ค่าเริ่ม) หรือ 'lolli' (🍭 เงินจริง) · ราคาเท่ากัน */
  pay(n,cur){ return cur==='lolli'?Save.spendLollipops(n):Save.spendThreads(n); },
  canPay(n,cur){ return (cur==='lolli'?Save.lollipops():Save.threads())>=n; },
  buySkin(id,cur){ const k=this.skinItem(id); if(!k||this.skinOwns(id)||!this.skinReady(k))return false; if(!this.pay(SKIN_PRICE,cur))return false; this.data().sown[id]=1; this.data().skin[k.hero]=id; Save.save(); return true; },
  item(id){ return COSMETICS.find(c=>c.id===id)||null; },
  owns(id){ return !!this.data().own[id]; },
  equipped(slot){ if(COS_RETIRED.includes(slot))return null; const id=this.data().eq[slot]; return id&&this.owns(id)?this.item(id):null; },
  dye(id){ return Math.max(0,Math.min(COS_DYES.length-1,this.data().dye[id]||0)); },
  tint(c){ return c?COS_DYES[this.dye(c.id)][1]:null; },
  col(c){ return this.tint(c)??c.col; },
  nextDye(id){ if(!this.owns(id))return false; this.data().dye[id]=(this.dye(id)+1)%COS_DYES.length; Save.save(); return true; },
  buy(id,cur){ const c=this.item(id); if(!c||this.owns(id)||this.retired(c))return false; if(!this.pay(c.price,cur))return false; this.data().own[id]=1; this.data().eq[c.slot]=id; Save.save(); return true; },
  toggle(id){ const c=this.item(id); if(!c||!this.owns(id))return false; const eq=this.data().eq; eq[c.slot]=eq[c.slot]===id?null:id; Save.save(); return true; }
};
function pickWeighted(list){ let r=Math.random(),acc=0; for(const [k,p] of list){ acc+=p; if(r<acc)return k; } return list[list.length-1][0]; }
function talentsOpen(){ const d=(typeof Save!=='undefined'&&Save.data)||{},sm=d.stageMastery||{}; return !!sm[2]||(d.unlockedStage||0)>=3; }   // v8.0.86 เจ้าของ: Talent เปิดพร้อมบทสอน (จบด่าน 3)
const RANKING_ON=false, DEV_STATS_ON=false;   // v8.2.54 ECRS2 E5 ซ่อน Ranking · E4 Play Stats/Combat Meter เห็นเฉพาะ GM
const GEAR_INBOX_ON=false;   // v8.2.54 ECRS2 E1: ไม่มีผู้เล่นเปิด Reward Inbox เลย → ของดีที่ล้นเข้ากระเป๋าตรง ๆ (เกินช่องได้) · ของธรรมดาแยกชิ้นเหมือนเดิม
const KITCHEN_ON=false;   // v8.2.52 เจ้าของ (ECRS · E): ซ่อน Kitchen ก่อน Closed test · เปิดกลับ = true
function kitchenOpen(){ return (typeof KITCHEN_ON==='undefined'||KITCHEN_ON)&&!!((Save.data&&Save.data.stageMastery)||{})[9]; }
function frActive(){ if(!kitchenOpen())return []; if(FR_SIMPLE){ const p=FR_PRESETS[frPick()]; return p?[{t:p.t,e:p.e,m:null}]:[]; } return Save.frRecipes().slice(0,Save.frSlots()).filter(r=>r&&r.t&&r.e&&!(frPart(r.e)||{}).cut); }
function frUpkeep(){ if(FR_SIMPLE)return {hp:0,dmg:0}; let hp=0,dmg=0; for(const r of frActive()){ const x=0.02*(Save.frLv(r.e)-1)+(frSignature(r)?0.02:0); hp+=0.06+x; dmg+=0.04+x; } return {hp,dmg}; }
function applyFrUpkeep(p){ const u=frUpkeep(); if(!u.hp)return false; p.maxhp=Math.max(1,Math.round(p.maxhp*(1-u.hp))); p.dmgMul-=u.dmg; return true; }
function frCost(r){ return r?['t','e','m'].reduce((a,k)=>a+((frPart(r[k])||{}).cost||0),0):0; }
function frSentence(r){ const t=frPart(r&&r.t),e=frPart(r&&r.e),m=frPart(r&&r.m); if(!t||!e)return 'Empty recipe'; const sg=frSignature(r);
  return (sg?'⭐ '+sg.name+' · ':'')+t.name+' → '+e.name+(m?' ('+m.name+')':''); }
// ชิ้นส่วนที่ขุดได้: trigger 40 / effect 40 / modifier 20 · ชิ้นที่ต้อง chain หายากกว่า
function frRollPart(){ const r=Math.random(), k=r<0.4?'t':r<0.8?'e':'m'; let pool=FR_KIND[k];
  if(k==='t'&&Math.random()<0.75)pool=pool.filter(x=>!x.chain); return k+':'+Phaser.Utils.Array.GetRandom(pool).id; }
// ตารางน้ำหนักของในกระดาน (commit ถัดไปเติมหินแก่น/คัมภีร์/กับดัก/ทางลับ)
/* v8.2.36 E1: digTable/digMakeBoard/... ลบแล้ว */
/* ---- HUB_GROUPS: รวมปุ่มเมนูย่อยเป็นกลุ่ม ให้หน้า Hub สะอาดขึ้น (rows: [targetScreen,emoji,label,sub]) ---- */
const HUB_GROUPS = {
  gLoadout:{ title:'🎒 Gear & Power', rows:[
    ['upgrade','✦','Flavor Weave & Rank','Cores, Rank up & 🏅 Passive tree'],
    ['gear','◆','Equipment','Equip, compare and dismantle'],
    ['craft','🧪','Affix Forge','Choose gear and a line, then roll one compatible stat'],
    ['bazaar','🏪','Mochi Bazaar','Buy · Gamble · Sell for 🍬'],
    ...(GEAR_INBOX_ON?[['gearInbox','📦','Reward Inbox','Overflow loot waiting to be claimed']]:[]) ],
    // v5.48: หน้าเป็นหมวด + ไทล์ 2 คอลัมน์ (tiles: [target,emoji,ชื่อสั้น])
    sections:[ ['POWER',0xffd36e,[['upgrade','✦','Weave & Rank']]],
      ['GEAR',0x8fe3c4,[['gear','◆','Equipment'],['craft','🧪','Affix Forge'],['bazaar','🏪','Bazaar'],...(GEAR_INBOX_ON?[['gearInbox','📦','Inbox']]:[])]] ] },
  gCodex:{ title:'📖 Codex', rows:[
    ['skills','✧','Recipe Book','Heroes & Builds, Relics, Items and Sets'],
    ['bestiary','☷','Bestiary','Discoveries and Sugar'] ] },
  gActivity:{ title:'🎉 Activities', rows:[
    ['rewards','🎁','Rewards','Login gift, Daily Quests and Awards'],
    ['dig','🌸','Mochi Garden','Send heroes on trips · collect while away'],   /* v8.2.62 เจ้าของ: อยู่ลึกเกิน (Upgrade → Weave) → เพิ่มใน Activities · ปุ่มเดิมใน Weave ยังอยู่ */   // v8.0.75 เจ้าของ: แทน Daily + Achievements (ซ้ำกับปุ่ม Rewards)
    ...(KITCHEN_ON?[['kitchen','🍳','Kitchen',FR_SIMPLE?'Pick a signature move for every run':'Recipes that power every run']]:[]),   /* v8.2.52 ECRS: ซ่อน */
    /* v8.2.32 Mochi Patrol → รวมเข้า Temple Expedition (Weave → Expedition) */
    /* v6.80 E2: Endgame (Endless/Ascension) entry removed */
    /* v7.8.89 เจ้าของ: Boss Rush เอาออกไปก่อน (โค้ดยังอยู่ · ใส่แถวนี้กลับเพื่อเปิด) */
    ['recipes','📜','Recipe Maps','Endgame maps · Atlas · Uniques · Pinnacle Boss'] ] },
  gMore:{ title:'⚙ More', rows:[
    ['settings','⚙','Settings','Sound, shake, flash and VFX'],
    ['__tutorial','🎓','How to Play','Replay the controls & combat tutorial'] ] },
};

// v7.8.87+: QUESTS (Player Journey ซ่อน) รวมเข้า ACHIEVEMENTS แล้ว · questClaimed เก่า → achievements (กันจ่ายซ้ำ)
const QUEST_TO_ACH={s1:'stage1',rank1:'bond',gear3:'gear3',s2:'stage2',s3:'stage3',legend:'legend',s4:'stage4',hell1:'hell',s5:'hunger'};

/* ---- GEAR: ของสวมใส่ 2 ช่อง (weapon/charm) ซื้อด้วย Sugar แล้วสวมใส่ ---- */
// ของสวมใส่ · ตีบวกได้ (lv=ระดับตีบวก 0..enhMax) เพิ่มพลังต่อระดับ
const GEAR_ENH_MAX = 10;
// โอกาสตีบวก lv->lv+1 · +0..+3 ปลอดภัย · +4 ขึ้นไปเสี่ยง: "แตก" (ขั้นลดลง 1, ไม่ต่ำกว่า +3) หรือ "ของหาย" (ไอเทมทำลายทิ้ง) · เพดาน +10
// v4.35: destroy เริ่มมีตั้งแต่ +4 (น้อย ๆ) แล้วไต่ขึ้นเรื่อย ๆ — ยิ่ง +สูงยิ่งเสี่ยงของแตกหาย
function enhanceOdds(lv){ if(lv<4||(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE))return{success:1,brk:0,destroy:0};
  const t={4:[0.76,0.24,0],5:[0.68,0.32,0],6:[0.58,0.42,0],7:[0.50,0.50,0],8:[0.42,0.58,0],9:[0.34,0.66,0]}[lv]||[0.34,0.66,0];   // v7.8.81 เจ้าของ: ตีบวกไม่ทำให้ของหายแล้ว (ล้ม = ลด 1 ขั้น ไม่ต่ำกว่า +3)
  return {success:t[0],brk:t[1],destroy:t[2]}; }
function gearSellSugar(item){if(!item)return 0;return (GEAR_DISMANTLE_BASE[item.grade]||0)*6+Math.max(1,item.itemLevel||1)*2+Math.max(0,item.enhanceLv||0)*10;}
const GEAR_INBOX_CAP = 5;
const GEAR_DISMANTLE_BASE = {start:0,common:1,rare:3,epic:7,legend:15,mythic:30,ancient:60,divine:120};
function gearDismantleValue(item){if(!item)return 0;return (GEAR_DISMANTLE_BASE[item.grade]||0)+Math.floor(Math.max(1,item.itemLevel||1)/20)+Math.max(0,item.enhanceLv||0)*2;}
function gearDeliverySuffix(got){if(!got)return '';const d=got.delivery||got.destination;if(d==='inbox')return ' · Sent to Reward Inbox';if(d==='salvaged')return got.sugar?' · Auto-sold +🍬'+got.sugar:' · Auto-dismantled +🧶'+(got.shards||0);return '';}
// v6.55.35 Item Power: เปลี่ยน Power ของตัวละครปัจจุบันถ้าสวมชิ้นนี้แทนชิ้นในช่องเดียวกัน (สลับชั่วคราวแล้วคืน)
function gearPowerDelta(item,basePow){try{const d=Save.data,cid=d.character||'momo',slot=item&&item.slot;if(!slot)return 0;const eq=d.equippedGear||(d.equippedGear={}),prev=eq[slot];if(prev===item.uid)return 0;
  const base=basePow!=null?basePow:heroPower(cid,null),list=d.gearItems||(d.gearItems=[]),added=!list.includes(item);if(added)list.push(item);eq[slot]=item.uid;let p=base;try{p=heroPower(cid,null);}finally{if(prev===undefined)delete eq[slot];else eq[slot]=prev;if(added)list.splice(list.indexOf(item),1);}return p-base;}catch(e){return 0;}}
// v4.34: ตีบวกใช้ 🔩 gear shards (ได้จาก dismantle) แทน Sugar — ยิ่ง +สูง ยิ่งกินวัสดุเยอะ
function gearEnhShardCost(lv){ return Math.round(2*Math.pow(1.5,Math.max(0,lv))); }   // v6.55.38 🔩 +1..+10 = 2/3/5/7/10/15/23/34/51/77 (ขั้นต่ำถูก ขั้นสูงแพงชัน)
// 6 ช่องสวมใส่ (แบบ isekai drifter) · แต่ละช่องมีของ "None" ฟรี + ของซื้อ 2 ชิ้น · ตีบวกได้
const GEAR_SLOTS = [
  { slot:'weapon', label:'Weapon',   emoji:'⚔️' },
  { slot:'gloves', label:'Gloves',  emoji:'🧤' },
  { slot:'armor',  label:'Armor',   emoji:'🛡️' },
  { slot:'boots',  label:'Boots', emoji:'👢' },
  { slot:'amulet', label:'Amulet',   emoji:'📿' },
  { slot:'ring',   label:'Ring',    emoji:'💍' },
];
const GEAR = {
  weapon: [
    // Chapter 1 · Pantry — readable starter silhouettes
    { id:'w_spoon', chapter:1, tier:"start", emoji:'🥄', name:'Wooden Spoon', cost:0, enh:true, desc:'+5% damage (+2%/enh)', apply:(p,lv)=>{p.dmgMul+=(1.05+0.02*lv)-1;} },
    { id:'w_chop', chapter:1, tier:"common", emoji:'🥢', name:'Iron Chopsticks', cost:120, enh:true, desc:'+12% damage (+3%/enh)', apply:(p,lv)=>{p.dmgMul+=(1.12+0.03*lv)-1;} },
    { id:'w_whisk', set:'home', chapter:1, tier:"common", emoji:'🌀', name:'Egg Whisk', cost:150, enh:true, desc:'-5% cooldown (+1%/enh)', apply:(p,lv)=>{p.cdMul*=1-0.05-0.01*lv;} },
    { id:'w_knife', set:'brigade', chapter:1, tier:"rare", emoji:'🔪', name:'Chef Knife', cost:300, enh:true, desc:'+22% damage (+4%/enh)', apply:(p,lv)=>{p.dmgMul+=(1.22+0.04*lv)-1;} },
    { id:'w_cleaver', chapter:1, tier:"epic", set:'chef', emoji:'🪓', name:'Golden Cleaver', cost:640, enh:true, desc:'+30% damage · +5% crit', apply:(p,lv)=>{p.dmgMul+=(1.30+0.05*lv)-1;p.critChance+=0.05+0.01*lv;} },
    { id:'lg_starcleaver', chapter:1, tier:"legend", emoji:'🌟', name:'Starfall Blade', cost:0, enh:true, fx:'execute', desc:'+38% damage · execute damage', apply:(p,lv)=>{p.dmgMul+=(1.38+0.05*lv)-1;p.lowHpDmg+=0.15+0.03*lv;} },
    // Chapter 2 · Rotten Drain — tempo and utility
    { id:'w_valve_saber', chapter:2, tier:"common", emoji:'🗡️', name:'Valve Saber', cost:180, enh:true, desc:'+10% damage · -3% cooldown', apply:(p,lv)=>{p.dmgMul+=(1.10+0.025*lv)-1;p.cdMul*=1-0.03-0.008*lv;} },
    { id:'w_pressure_whisk', chapter:2, tier:"rare", emoji:'🫧', name:'Pressure Whisk', cost:420, enh:true, desc:'-9% cooldown · +5% crit', apply:(p,lv)=>{p.cdMul*=1-0.09-0.01*lv;p.critChance+=0.05+0.008*lv;} },
    { id:'w_pipe_hammer', chapter:2, tier:"epic", emoji:'🔨', name:'Pipe Hammer', cost:840, enh:true, desc:'+18% damage · +8% crit · +40 HP', apply:(p,lv)=>{p.dmgMul+=(1.18+0.035*lv)-1;p.critChance+=0.08+0.008*lv;p.maxhp+=40+10*lv;} },
    { id:'lg_tidefork', chapter:2, tier:"legend", emoji:'🔱', name:'Tidefork', cost:0, enh:true, desc:'+26% damage · -8% cooldown · +12% crit', apply:(p,lv)=>{p.dmgMul+=(1.26+0.04*lv)-1;p.cdMul*=1-0.08-0.008*lv;p.critChance+=0.12+0.008*lv;} },
    // Chapter 3 · Chili Engine — heavy offense
    { id:'w_chili_sickle', chapter:3, tier:"common", emoji:'🌶️', name:'Chili Sickle', cost:200, enh:true, desc:'+14% damage · +3% crit', apply:(p,lv)=>{p.dmgMul+=(1.14+0.025*lv)-1;p.critChance+=0.03+0.006*lv;} },
    { id:'w_griddle_maul', chapter:3, tier:"rare", emoji:'🍳', name:'Griddle Maul', cost:460, enh:true, desc:'+24% damage · +60 HP', apply:(p,lv)=>{p.dmgMul+=(1.24+0.04*lv)-1;p.maxhp+=60+12*lv;} },
    { id:'w_ember_skewer', chapter:3, tier:"epic", emoji:'🔥', name:'Ember Skewer', cost:880, enh:true, desc:'+28% damage · +10% crit', apply:(p,lv)=>{p.dmgMul+=(1.28+0.045*lv)-1;p.critChance+=0.10+0.009*lv;} },
    { id:'lg_sun_spatula', chapter:3, tier:"legend", emoji:'☀️', name:'Sunforge Spatula', cost:0, enh:true, fx:'execute', desc:'+34% damage · -6% cooldown · execute damage', apply:(p,lv)=>{p.dmgMul+=(1.34+0.045*lv)-1;p.cdMul*=1-0.06-0.008*lv;p.lowHpDmg+=0.10+0.02*lv;} },
    // Chapter 4 · Sugar Freezer — control and crit
    { id:'w_frost_spoon', chapter:4, tier:"common", emoji:'❄️', name:'Frost Spoon', cost:220, enh:true, desc:'-8% cooldown · +40 HP', apply:(p,lv)=>{p.cdMul*=1-0.08-0.008*lv;p.maxhp+=40+10*lv;} },
    { id:'w_crystal_knife', chapter:4, tier:"rare", emoji:'💎', name:'Crystal Knife', cost:500, enh:true, desc:'+20% damage · +8% crit', apply:(p,lv)=>{p.dmgMul+=(1.20+0.035*lv)-1;p.critChance+=0.08+0.009*lv;} },
    { id:'w_glacier_whisk', chapter:4, tier:"epic", emoji:'🧊', name:'Glacier Whisk', cost:920, enh:true, desc:'-12% cooldown · +14% crit', apply:(p,lv)=>{p.cdMul*=1-0.12-0.008*lv;p.critChance+=0.14+0.008*lv;} },
    { id:'lg_aurora_lance', chapter:4, tier:"legend", emoji:'🌌', name:'Aurora Sugar Lance', cost:0, enh:true, desc:'+30% damage · -10% cooldown · +12% crit', apply:(p,lv)=>{p.dmgMul+=(1.30+0.04*lv)-1;p.cdMul*=1-0.10-0.008*lv;p.critChance+=0.12+0.008*lv;} },
    // Chapter 5 · Crown Oven — endgame hybrids, still bounded by Item Level
    { id:'w_void_ladle', chapter:5, tier:"common", emoji:'🌑', name:'Void Ladle', cost:240, enh:true, desc:'+18% damage · +0.8 regen/s', apply:(p,lv)=>{p.dmgMul+=(1.18+0.03*lv)-1;p.regen+=0.8+0.12*lv;} },
    { id:'w_crown_cleaver', chapter:5, tier:"rare", emoji:'👑', name:'Crown Cleaver', cost:540, enh:true, desc:'+26% damage · +10% crit', apply:(p,lv)=>{p.dmgMul+=(1.26+0.04*lv)-1;p.critChance+=0.10+0.009*lv;} },
    { id:'w_hunger_blade', chapter:5, tier:"epic", emoji:'🕳️', name:'Hunger Blade', cost:960, enh:true, fx:'execute', desc:'+32% damage · execute damage', apply:(p,lv)=>{p.dmgMul+=(1.32+0.045*lv)-1;p.lowHpDmg+=0.12+0.02*lv;} },
    { id:'lg_flavorbound', chapter:5, tier:"legend", emoji:'✨', name:'Flavorbound', cost:0, enh:true, desc:'+36% damage · +10% crit · -8% cooldown', apply:(p,lv)=>{p.dmgMul+=(1.36+0.045*lv)-1;p.critChance+=0.10+0.008*lv;p.cdMul*=1-0.08-0.008*lv;} },
  ],
  gloves: [
    { id:'gl_none', tier:"start", emoji:'🧤', name:'None',       cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'gl_mitt', set:'home', tier:"common", emoji:'🧤', name:'Oven Mitt',  cost:140, enh:true, desc:'+5% crit (+1%/enh)',        apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.05+0.01*lv; } },
    { id:'gl_silk', tier:"common", emoji:'🧵', name:'Silk Gloves', cost:150, enh:true, desc:'+8% damage (+2%/enh)',      apply:(p,lv)=>{ p.dmgMul+=((1+0.08+0.02*lv))-1; } },
    { id:'gl_iron', set:'brigade', tier:"rare", emoji:'🥊', name:'Iron Fists',      cost:320, enh:true, desc:'+9% crit · +4% damage (+1%·+1%/enh)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.09+0.01*lv; p.dmgMul+=((1+0.04+0.01*lv))-1; } },
    { id:'gl_dragon', tier:"epic", set:'chef', emoji:'🐲', name:'Fire Dragon Gloves', cost:660, enh:true, desc:'+13% crit · stronger crit DMG (+1%/enh)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.13+0.01*lv; p.critMul=(p.critMul||1.55)+0.25+0.05*lv; } },
  ],
  armor: [
    { id:'ar_none', tier:"start",  emoji:'🥋', name:'None',      cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'ar_apron', set:'home', tier:"common", emoji:'🥋', name:'Apron', cost:130, enh:true, desc:'+45 HP (+12/enh)',        apply:(p,lv)=>{ p.maxhp+=45+12*lv; } },
    { id:'ar_quilt', tier:"common", emoji:'🧶', name:'Thick Quilt Coat', cost:150, enh:true, desc:'-5% damage taken (+1%/enh)',     apply:(p,lv)=>{ p.dmgTakenMul*=Math.pow(0.95,1+lv*0.4); } },
    { id:'ar_plate', set:'brigade', tier:"rare", emoji:'🛡️', name:'Pot-Lid Armor',  cost:340, enh:true, desc:'+90 HP · -6% damage taken (+18HP/enh)', apply:(p,lv)=>{ p.maxhp+=90+18*lv; p.dmgTakenMul*=Math.pow(0.94,1+lv*0.5); } },
    { id:'ar_royal', tier:"epic", set:'chef', emoji:'👑', name:'Kitchen King Armor', cost:680, enh:true, desc:'+140 HP · -10% damage taken (+24HP/enh)', apply:(p,lv)=>{ p.maxhp+=140+24*lv; p.dmgTakenMul*=Math.pow(0.90,1+lv*0.5); } },
  ],
  boots: [
    { id:'bo_none', tier:"start",  emoji:'👢', name:'None',      cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'bo_soft', tier:"common",  emoji:'👟', name:'Soft Shoes',  cost:110, enh:true, desc:'+5% move speed (+1%/enh)',   apply:(p,lv)=>{ p.baseSpeed*=1+0.05+0.01*lv; } },
    { id:'bo_magnet', tier:"common", emoji:'🧲', name:'Magnet Shoes', cost:130, enh:true, desc:'+25% pickup range (+4%/enh)', apply:(p,lv)=>{ p.pickup*=1+0.25+0.04*lv; } },
    { id:'bo_swift', set:'fortune', tier:"rare", emoji:'👢', name:'Swift Boots',    cost:300, enh:true, desc:'+9% move speed · +15% pickup (+1.5%/enh)', apply:(p,lv)=>{ p.baseSpeed*=1+0.09+0.015*lv; p.pickup*=1+0.15+0.03*lv; } },
    { id:'bo_wind', tier:"epic", set:'wind', emoji:'🌪️', name:'Gale Boots',       cost:620, enh:true, desc:'+13% move speed · -5% cooldown (+1.5%/enh)', apply:(p,lv)=>{ p.baseSpeed*=1+0.13+0.015*lv; p.cdMul*=(1-0.05-0.01*lv); } },
    { id:'lg_comet', tier:"legend", emoji:'☄️', name:'Comet Boots', cost:0, enh:true, fx:'lifekill', desc:'+16% move speed · +30% pickup · +2 HP on kill (+1.5%·+1HP/enh) ☄️', apply:(p,lv)=>{ p.baseSpeed*=1+0.16+0.015*lv; p.pickup*=1+0.30+0.04*lv; p.lifeOnKill=(p.lifeOnKill||0)+2+lv; } },
  ],
  amulet: [
    { id:'am_none', tier:"start",   emoji:'📿', name:'None',     cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'am_ribbon', set:'home', tier:"common", emoji:'🎀', name:'Lucky Ribbon',  cost:100, enh:true, desc:'+30 HP (+10/enh)',          apply:(p,lv)=>{ p.maxhp+=30+10*lv; } },
    { id:'am_clover', set:'brigade', tier:"common", emoji:'🍀', name:'Clover Leaf',  cost:120, enh:true, desc:'+4% crit · +0.5 regen/s (+1%/enh)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.04+0.01*lv; p.regen=(p.regen||0)+0.5+0.15*lv; } },
    { id:'am_star', set:'fortune', tier:"rare",   emoji:'⭐', name:'Sparkle Star',  cost:260, enh:true, desc:'+8% damage · +15 HP (+2%·+8/enh)', apply:(p,lv)=>{ p.dmgMul+=((1+0.08+0.02*lv))-1; p.maxhp+=15+8*lv; } },
    { id:'am_chef', tier:"epic", set:'chef', emoji:'🏅', name:'Head Chef Medal', cost:640, enh:true, desc:'+10% damage · +6% crit (+2%/enh)', apply:(p,lv)=>{ p.dmgMul+=0.10+0.02*lv; p.critChance=(p.critChance||0)+0.06; } },
    { id:'am_moon', tier:"epic", set:'wind',  emoji:'🌙', name:'Sweet Moon',  cost:640, enh:true, desc:'+12% damage · +40 HP · +1 regen/s (+2%/enh)', apply:(p,lv)=>{ p.dmgMul+=((1+0.12+0.02*lv))-1; p.maxhp+=40+10*lv; p.regen=(p.regen||0)+1+0.2*lv; } },
    { id:'lg_phoenix', tier:"legend", emoji:'🔥', name:'Phoenix Amulet', cost:0, enh:true, fx:'revive', desc:'+120 HP · +1.5 regen/s · revive once per stage (+20HP/enh) 🔥', apply:(p,lv)=>{ p.maxhp+=120+20*lv; p.regen=(p.regen||0)+1.5+0.3*lv; p._gearRevive=(p._gearRevive||0)+1; } },
  ],
  ring: [
    { id:'ri_none', tier:"start",   emoji:'💍', name:'None',     cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'ri_copper', set:'home', tier:"common", emoji:'💍', name:'Copper Ring', cost:120, enh:true, desc:'+5% damage (+2%/enh)',       apply:(p,lv)=>{ p.dmgMul+=((1+0.05+0.02*lv))-1; } },
    { id:'ri_silver', set:'brigade', tier:"common", emoji:'💎', name:'Silver Crit Ring', cost:140, enh:true, desc:'+6% crit (+1%/enh)',        apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.06+0.01*lv; } },
    { id:'ri_gold', set:'fortune', tier:"rare",   emoji:'💛', name:'Gold Ring',  cost:320, enh:true, desc:'+12% damage · +0.8 regen/s (+3%/enh)', apply:(p,lv)=>{ p.dmgMul+=((1+0.12+0.03*lv))-1; p.regen=(p.regen||0)+0.8+0.2*lv; } },
    { id:'ri_chef', tier:"epic", set:'chef', emoji:'🥄', name:'Golden Spoon Ring', cost:700, enh:true, desc:'+14% damage · +20% crit DMG (+3%/enh)', apply:(p,lv)=>{ p.dmgMul+=0.14+0.03*lv; p.critMul=(p.critMul||1.55)+0.2; } },
    { id:'ri_diamond', tier:"epic", set:'wind', emoji:'💠', name:'Diamond Ring',    cost:700, enh:true, desc:'+18% damage · +8% crit (+3%·+1%/enh)', apply:(p,lv)=>{ p.dmgMul+=((1+0.18+0.03*lv))-1; p.critChance=(p.critChance||0)+0.08+0.01*lv; } },
  ],
};
/* ---- GEAR SETS: สวมของชุดเดียวกันครบจำนวน = โบนัสพิเศษ (นับ id ที่สวมใน applyMeta) ---- */
const GEAR_SETS = {
  chef:{ name:'Royal Chef Set', emoji:'👑', bonuses:{
    2:{ desc:'2 pcs: +10% damage', apply:p=>{ p.dmgMul+=(1.10)-1; } },
    3:{ desc:'3 pcs: +10% crit · stronger crit DMG', apply:p=>{ p.critChance=(p.critChance||0)+0.10; p.critMul=(p.critMul||1.55)+0.3; } },
    5:{ desc:'5 pcs: +15% damage', apply:p=>{ p.dmgMul+=0.15; } } }, collect:{desc:'Collected: +3% damage',apply:p=>{p.dmgMul+=0.03;}} },
  wind:{ name:'Gale Master Set', emoji:'🌪️', bonuses:{
    2:{ desc:'2 pcs: -8% cooldown', apply:p=>{ p.cdMul=Math.max(STAT_CAPS.cdMulMin,(p.cdMul||1)*0.92); } },
    3:{ desc:'3 pcs: +10% move speed · +8% damage', apply:p=>{ p.baseSpeed*=1.10; p.dmgMul+=(1.08)-1; } } }, collect:{desc:'Collected: −3% cooldown',apply:p=>{p.cdMul*=0.97;}} },
  home:{ name:'Home Kitchen Set', emoji:'🏠', bonuses:{
    2:{ desc:'2 pcs: +8% max HP', apply:p=>{ p.maxhp*=1.08; } },
    3:{ desc:'3 pcs: +6% damage · +0.5 HP/s', apply:p=>{ p.dmgMul+=0.06; p.regen=(p.regen||0)+0.5; } },
    5:{ desc:'5 pcs: +12% max HP · +1 HP/s', apply:p=>{ p.maxhp*=1.12; p.regen=(p.regen||0)+1; } } }, collect:{desc:'Collected: +3% max HP',apply:p=>{p.maxhp*=1.03;}} },
  brigade:{ name:'Kitchen Brigade Set', emoji:'🛡️', bonuses:{
    2:{ desc:'2 pcs: +12% max HP', apply:p=>{ p.maxhp*=1.12; } },
    3:{ desc:'3 pcs: −10% damage taken · +6% damage', apply:p=>{ p.dmgTakenMul*=0.9; p.dmgMul+=0.06; } },
    5:{ desc:'5 pcs: −10% damage taken · +10% max HP', apply:p=>{ p.dmgTakenMul*=0.9; p.maxhp*=1.1; } } }, collect:{desc:'Collected: −2% damage taken',apply:p=>{p.dmgTakenMul*=0.98;}} },
  fortune:{ name:'Lucky Star Set', emoji:'⭐', bonuses:{
    2:{ desc:'2 pcs: +6% crit chance', apply:p=>{ p.critChance=(p.critChance||0)+0.06; } },
    3:{ desc:'3 pcs: +8% move speed · +0.25 crit damage', apply:p=>{ p.baseSpeed*=1.08; p.critMul=(p.critMul||1.55)+0.25; } } }, collect:{desc:'Collected: +2% crit chance',apply:p=>{p.critChance=(p.critChance||0)+0.02;}} },
};
const SET_ORDER=['home','brigade','fortune','chef','wind'];
function gearSetPieces(sid){ return GEAR_ALL.filter(g=>g.set===sid); }
function gearOwnsBase(id){ return (Save.data.gearItems||[]).some(it=>it.baseId===id)||(Save.data.ownedGear||[]).includes(id); }
/* v6.79 D1: set collection deposits removed — worn set bonuses only; deposits refunded as shards */
function gearSetCounts(){ const c={}; for(const slot in GEAR){ const id=Save.data.gear[slot]; const it=GEAR[slot].find(g=>g.id===id); if(it&&it.set)c[it.set]=(c[it.set]||0)+1; } return c; }

/* ---- AFFIX (Phase 1 PoE): prefix/suffix + tier T1-T5 · ของแต่ละชิ้นสุ่มตอนได้มา · reroll ด้วย 🔩 ----
   tiers[]=[T1,T2,T3,T4,T5] แต่ละอันเป็น [lo,hi] · T1=แรงสุด (หายาก) · pre/suf=คำประกอบชื่อไอเทม */
const AFFIX_POOL = [
  // ── Prefix (สายรุก) ──
  { id:'dmg', category:'offense', slots:['weapon','gloves','amulet','ring'], kind:'prefix', emoji:'💥', label:'Damage', pre:'Keen', fmt:v=>'+'+v+'%', tiers:[[13,16],[10,12],[7,9],[5,6],[3,4]], apply:(p,v)=>{ p.dmgMul+=((1+v/100))-1; } },
  { id:'crit', category:'offense', slots:['weapon','gloves','amulet','ring'], kind:'prefix', emoji:'🎯', label:'Crit', pre:'Sharp', fmt:v=>'+'+v+'%', tiers:[[4,5],[3,4],[3,3],[2,2],[1,2]], apply:(p,v)=>{ p.critChance=(p.critChance||0)+v/100; } },
  { id:'critdmg', category:'offense', slots:['weapon','gloves','ring'], kind:'prefix', emoji:'💢', label:'Crit DMG', pre:'Fierce', fmt:v=>'+'+v+'%', tiers:[[45,60],[35,44],[25,34],[15,24],[8,14]], apply:(p,v)=>{ p.critMul=(p.critMul||1.55)+v/100; } },
  { id:'cd', category:'offense', slots:['weapon','gloves','amulet','ring'], kind:'prefix', emoji:'⏩', label:'Cooldown', pre:'Swift', fmt:v=>'-'+v+'%', tiers:[[6,8],[5,5],[4,4],[3,3],[2,2]], apply:(p,v)=>{ p.cdMul=Math.max(STAT_CAPS.cdMulMin,(p.cdMul||1)*(1-v/100)); } },
  { id:'bossdmg', category:'offense', slots:['weapon','ring'], kind:'prefix', emoji:'👑', label:'Boss DMG', pre:'Predatory', fmt:v=>'+'+v+'%', tiers:[[17,21],[13,16],[10,12],[7,9],[4,6]], apply:(p,v)=>{ p.bossDmg=(p.bossDmg||0)+v/100; } },
  { id:'laststand', category:'offense', slots:['weapon','gloves','ring'], kind:'prefix', emoji:'🔥', label:'Low-HP DMG', pre:'Defiant', fmt:v=>'+'+v+'%', tiers:[[11,14],[9,10],[7,8],[5,6],[3,4]], apply:(p,v)=>{ p.lowHpDmg=(p.lowHpDmg||0)+v/100; } },
  // ── Suffix (สายรับ) ──
  { id:'hp', category:'defense', slots:['armor','amulet'], kind:'suffix', emoji:'❤️', label:'HP', suf:'of the Lion', fmt:v=>'+'+v, tiers:[[85,120],[60,84],[40,59],[25,39],[15,24]], apply:(p,v)=>{ p.maxhp+=v; } },
  { id:'def', category:'defense', slots:['armor','gloves','amulet'], kind:'suffix', emoji:'🛡️', label:'Defense', suf:'of Stone', fmt:v=>'-'+v+'%', tiers:[[6,8],[5,5],[4,4],[3,3],[2,2]], apply:(p,v)=>{ p.dmgTakenMul*=(1-v/100); } },
  { id:'regen', category:'defense', slots:['armor','amulet','ring'], kind:'suffix', emoji:'💗', label:'Regen/s', suf:'of the Spring', fmt:v=>'+'+(v/10), tiers:[[10,14],[7,9],[5,6],[3,4],[2,2]], apply:(p,v)=>{ p.regen=(p.regen||0)+v/10; } },
  { id:'lifekill', category:'defense', slots:['armor','gloves','amulet'], kind:'suffix', emoji:'🍓', label:'HP on Kill', suf:'of Harvest', fmt:v=>'+'+v, tiers:[[5,6],[4,4],[3,3],[2,2],[1,1]], apply:(p,v)=>{ p.lifeOnKill=(p.lifeOnKill||0)+v; } },
  { id:'crisisguard', category:'defense', slots:['armor','amulet'], kind:'suffix', emoji:'🫧', label:'Emergency Guard', suf:'of Last Shelter', fmt:v=>'-'+v+'%', tiers:[[11,14],[9,10],[7,8],[5,6],[3,4]], apply:(p,v)=>{ p.lowHpGuard=(p.lowHpGuard||0)+v/100; } },
  // ── Suffix (utility) ──
  { id:'spd', category:'utility', slots:['boots'], kind:'suffix', emoji:'👟', label:'Speed', suf:'of the Wind', fmt:v=>'+'+v+'%', tiers:[[6,8],[5,5],[4,4],[3,3],[2,2]], apply:(p,v)=>{ p.baseSpeed*=(1+v/100); } },
  { id:'pick', category:'utility', slots:['boots','amulet','ring'], kind:'suffix', emoji:'🧲', label:'Pickup', suf:'of Magnetism', fmt:v=>'+'+v+'%', tiers:[[35,50],[25,34],[18,24],[12,17],[8,11]], apply:(p,v)=>{ p.pickup*=(1+v/100); } },
  { id:'xp', category:'utility', slots:['boots','amulet','ring'], kind:'suffix', emoji:'✨', label:'EXP Gain', suf:'of Insight', fmt:v=>'+'+v+'%', tiers:[[17,22],[13,16],[10,12],[7,9],[4,6]], apply:(p,v)=>{ p.xpMul=(p.xpMul||1)*(1+v/100); } },
  { id:'dash', category:'utility', slots:['boots','ring'], kind:'suffix', emoji:'💨', label:'Dash Recovery', suf:'of Momentum', fmt:v=>'-'+v+'%', tiers:[[11,14],[9,10],[7,8],[5,6],[3,4]], apply:(p,v)=>{ p.dashCdMul=(p.dashCdMul||1)*(1-v/100); } },
  // ── v4.91: mod เพิ่ม (ใช้ field เดิมทั้งหมด) ──
  { id:'edge', category:'offense', slots:['weapon','gloves'], kind:'prefix', emoji:'🗡️', label:'Flat DMG', pre:'Honed', fmt:v=>'+'+v+' per hit', tiers:[[6,8],[5,5],[3,4],[2,3],[1,2]], apply:(p,v)=>{ p.flatDmg=(p.flatDmg||0)+v; } },
  { id:'precision', category:'offense', slots:['gloves','amulet'], kind:'prefix', emoji:'🏹', label:'Crit & Haste', pre:'Precise', fmt:v=>'+'+v+'% / -'+v+'%', tiers:[[4,4],[3,3],[2,2],[1,2],[1,1]], apply:(p,v)=>{ p.critChance=(p.critChance||0)+v/100; p.cdMul=Math.max(STAT_CAPS.cdMulMin,(p.cdMul||1)*(1-v/100)); } },
  { id:'hppct', category:'defense', slots:['armor','amulet','boots'], kind:'suffix', emoji:'💪', label:'Max HP %', suf:'of Vigor', fmt:v=>'+'+v+'%', tiers:[[13,16],[10,12],[7,9],[5,6],[3,4]], apply:(p,v)=>{ p.maxhp=Math.round(p.maxhp*(1+v/100)); } },
  { id:'regenpct', category:'defense', slots:['armor','ring'], kind:'suffix', emoji:'🌱', label:'Regen % HP/s', suf:'of Renewal', fmt:v=>'+'+(v/10)+'%', tiers:[[7,8],[5,6],[4,4],[2,3],[1,1]], apply:(p,v)=>{ p.regenPct=(p.regenPct||0)+v/1000; } },
  { id:'bulwark', category:'defense', slots:['armor','gloves'], kind:'suffix', emoji:'🏰', label:'HP & Guard', suf:'of the Bulwark', fmt:v=>'+'+(v*3)+' HP / -'+Math.ceil(v/2)+'%', tiers:[[9,10],[7,8],[5,6],[3,4],[2,2]], apply:(p,v)=>{ p.maxhp+=v*3; p.dmgTakenMul*=(1-Math.ceil(v/2)/100); } },
  { id:'mend', category:'defense', slots:['amulet','ring'], kind:'suffix', emoji:'🩹', label:'Healing Taken', suf:'of Mending', fmt:v=>'+'+v+'%', tiers:[[25,32],[18,24],[12,17],[8,11],[4,7]], apply:(p,v)=>{ p.healEffect=(p.healEffect||1)+v/100; } },
  { id:'sprint', category:'utility', slots:['boots'], kind:'suffix', emoji:'🏃', label:'Speed & Dash', suf:'of the Sprinter', fmt:v=>'+'+v+'% / -'+v+'%', tiers:[[5,6],[4,4],[3,3],[2,2],[1,1]], apply:(p,v)=>{ p.baseSpeed*=(1+v/100); p.dashCdMul=(p.dashCdMul||1)*(1-v/100); } },
  { id:'forager', category:'utility', slots:['boots','amulet','ring'], kind:'suffix', emoji:'🧺', label:'EXP & Pickup', suf:'of the Forager', fmt:v=>'+'+v+'%', tiers:[[12,15],[9,11],[7,8],[5,6],[3,4]], apply:(p,v)=>{ p.xpMul=(p.xpMul||1)*(1+v/100); p.pickup*=(1+v/100); } },
  // ── v4.93: utility เพิ่ม ──
  { id:'sugarfind', category:'utility', slots:['boots','amulet','ring'], kind:'suffix', emoji:'🍬', label:'Sugar Find', suf:'of Plenty', fmt:v=>'+'+v+'%', tiers:[[17,22],[13,16],[10,12],[7,9],[4,6]], apply:(p,v)=>{ p.sugarFindMul=(p.sugarFindMul||1)*(1+v/100); } },
  { id:'boxfind', category:'utility', slots:['amulet','ring'], kind:'suffix', emoji:'🎁', label:'Box Find', suf:'of Treasure', fmt:v=>'+'+v+'%', tiers:[[35,45],[26,34],[18,25],[12,17],[6,11]], apply:(p,v)=>{ p.boxFindMul=(p.boxFindMul||1)*(1+v/100); } },
  { id:'orbfind', category:'utility', slots:['boots','ring'], kind:'suffix', emoji:'💎', label:'Currency Find', suf:'of Riches', fmt:v=>'+'+v+'%', tiers:[[22,28],[16,21],[11,15],[7,10],[4,6]], apply:(p,v)=>{ p.currencyFindMul=(p.currencyFindMul||1)*(1+v/100); } },
  { id:'uniquecd', category:'utility', slots:['gloves','amulet'], kind:'prefix', emoji:'🌀', label:'Unique Cooldown', pre:'Signature', fmt:v=>'-'+v+'%', tiers:[[13,16],[10,12],[7,9],[5,6],[3,4]], apply:(p,v)=>{ p.uniqueCdMul=(p.uniqueCdMul||1)*(1-v/100); } },
  { id:'wayfarer', category:'utility', slots:['boots','amulet'], kind:'suffix', emoji:'🧭', label:'Speed & Pickup', suf:'of the Wayfarer', fmt:v=>'+'+v+'% / +'+(v*3)+'%', tiers:[[5,6],[4,4],[3,3],[2,2],[1,1]], apply:(p,v)=>{ p.baseSpeed*=(1+v/100); p.pickup*=(1+v*3/100); } },
  // v6.55.33: base stats moved out of implicits → wider prefix/suffix pool
  { id:'stride', category:'offense', slots:['boots','armor'], kind:'prefix', emoji:'🥾', label:'Damage', pre:'Striding', fmt:v=>'+'+v+'%', tiers:[[8,10],[6,7],[5,5],[3,4],[2,2]], apply:(p,v)=>{ p.dmgMul+=v/100; } },
  { id:'reach', category:'offense', slots:['weapon','gloves','amulet'], kind:'prefix', emoji:'🌀', label:'Attack Area', pre:'Sweeping', fmt:v=>'+'+v+'%', tiers:[[10,12],[8,9],[6,7],[4,5],[2,3]], apply:(p,v)=>{ p.gearArea=(p.gearArea||0)+v/100; } },
  { id:'fleet', category:'utility', slots:['armor','gloves','amulet'], kind:'suffix', emoji:'💨', label:'Move Speed', suf:'of the Breeze', fmt:v=>'+'+v+'%', tiers:[[5,6],[4,4],[3,3],[2,2],[1,1]], apply:(p,v)=>{ p.baseSpeed*=(1+v/100); } },
  { id:'armorflat', category:'defense', slots:['armor','boots','gloves'], kind:'suffix', emoji:'🧱', label:'Armor', suf:'of the Wall', fmt:v=>'+'+v, tiers:[[14,18],[10,13],[7,9],[4,6],[2,3]], apply:(p,v)=>{ p.armor=(p.armor||0)+v; } },
  { id:'reaver', category:'defense', slots:['weapon'], kind:'suffix', emoji:'🍓', label:'HP on Kill', suf:'of the Reaver', fmt:v=>'+'+v, tiers:[[4,5],[3,3],[2,2],[1,1],[1,1]], apply:(p,v)=>{ p.lifeOnKill=(p.lifeOnKill||0)+v; } },
  { id:'nimble', category:'utility', slots:['weapon','ring'], kind:'suffix', emoji:'🍃', label:'Move Speed', suf:'of Nimbleness', fmt:v=>'+'+v+'%', tiers:[[5,6],[4,4],[3,3],[2,2],[1,1]], apply:(p,v)=>{ p.baseSpeed*=(1+v/100); } },
  { id:'ringhp', category:'defense', slots:['ring','boots','gloves','weapon'], kind:'suffix', emoji:'💖', label:'HP', suf:'of Vigor', fmt:v=>'+'+v, tiers:[[45,60],[32,44],[22,31],[14,21],[8,13]], apply:(p,v)=>{ p.maxhp+=v; } },
  // v6.67: Play mods — change how you fight, not just numbers
  { id:'m_dashnova', category:'play', slots:['boots','gloves'], kind:'mod', emoji:'💫', label:'Dash Nova', pre:'Bursting', fmt:v=>'Nova '+v*10+'%', tiers:[[13,16],[10,12],[7,9],[5,6],[3,4]], apply:(p,v)=>{ p.gearDashNova=(p.gearDashNova||0)+v/10; } },
  { id:'m_critarc', category:'play', slots:['weapon','gloves','ring'], kind:'mod', emoji:'⚡', label:'Crit Arc (2 foes)', pre:'Arcing', fmt:v=>'Arc '+v*5+'%', tiers:[[13,16],[10,12],[7,9],[5,6],[3,4]], apply:(p,v)=>{ p.gearCritArc=(p.gearCritArc||0)+v/20; } },
  { id:'m_killshell', category:'play', slots:['armor','amulet'], kind:'mod', emoji:'🫧', label:'Kill Shell', suf:'of the Shell', fmt:v=>'1 per '+Math.ceil(100/v)+' kills', tiers:[[8,10],[6,7],[5,5],[3,4],[2,2]], apply:(p,v)=>{ p.gearKillShell=(p.gearKillShell||0)+v; } },
  { id:'m_stillfocus', category:'play', slots:['weapon','amulet','ring'], kind:'mod', emoji:'🧍', label:'Standing DMG', pre:'Rooted', fmt:v=>'+'+v+'%', tiers:[[25,32],[19,24],[14,18],[9,13],[5,8]], apply:(p,v)=>{ p.gearStillDmg=(p.gearStillDmg||0)+v/100; } },
  { id:'m_opener', category:'play', slots:['weapon','gloves','boots'], kind:'mod', emoji:'🗡️', label:'Full-HP Foe DMG', pre:'Ambushing', fmt:v=>'+'+v+'%', tiers:[[50,65],[38,49],[27,37],[17,26],[9,16]], apply:(p,v)=>{ p.gearOpener=(p.gearOpener||0)+v/100; } },
  { id:'m_thorns', category:'play', slots:['armor','gloves','amulet'], kind:'mod', emoji:'🌵', label:'Retaliate on Hit', suf:'of Thorns', fmt:v=>'Blast '+v*10+'%', tiers:[[17,22],[13,16],[10,12],[7,9],[4,6]], apply:(p,v)=>{ p.gearThorns=(p.gearThorns||0)+v/10; } },
];
const AFFIX_CATEGORY = {
  offense:{label:'Offense',color:0xff9a5a,hex:'#ffb07a'},
  defense:{label:'Defense',color:0x7fb0ff,hex:'#a9c8ff'},
  utility:{label:'Utility',color:0x5ad1c4,hex:'#91eadf'},
  play:{label:'Play',color:0xc98cff,hex:'#dab4ff'},
};
function affixCategory(mod){return AFFIX_CATEGORY[(mod&&mod.category)||'utility']||AFFIX_CATEGORY.utility;}
const AFFIX_COUNT = { start:0, common:1, rare:2, epic:3, legend:3 };   // v6.67: max 3 mods per item (implicit not counted)   // v6.55.32: max 3 prefix + 3 suffix (RARITY_SLOTS)
// item level → tier ดีสุดที่สุ่มได้ (ฐานดี = โรลได้ดีกว่า): legend→T1, epic→T2, rare→T3, common→T4
// v4.48: mod พิเศษเฉพาะไอเทม iLv สูง (endgame chase) — hook เข้า field ที่ applyMeta reset/consume อยู่แล้วทั้งหมด (bossDmg/lowHpGuard/xpMul/dashCdMul เดิม + lifesteal/healEffect ที่ยังว่างจากคราวก่อน) ไม่มีกลไกใหม่ กัน regression
const SPECIAL_AFFIX_POOL = [
  { id:'vampiric', kind:'suffix', category:'defense', label:'Vampiric', emoji:'🩸', suf:'of the Leech', slots:['weapon','gloves','ring'], minItemLevel:30, bestTier:3,
    fmt:v=>'+'+(v/10)+' HP', tiers:[[16,22],[11,15],[7,10],[4,6],[2,3]],
    apply:(p,v)=>{ p.lifesteal=(p.lifesteal||0)+v/10; } }, // ฟื้น HP flat ต่อการฆ่า ไม่มี cooldown (ต่างจาก lifekill ที่มี cd 0.45s) — เก่งตอนฆ่าถี่
  { id:'berserk', kind:'prefix', category:'offense', label:'Berserker', emoji:'💀', pre:'Berserk', slots:['weapon','gloves'], minItemLevel:45, bestTier:2,
    fmt:v=>'+'+v+'%', tiers:[[22,28],[16,21],[11,15],[7,10],[4,6]],
    apply:(p,v)=>{ p.dmgMul+=((1+v/100))-1; p.dmgTakenMul*=(1+v*0.6/100); } }, // glass cannon: ดาเมจแรงขึ้นเยอะ แต่รับดาเมจเพิ่มด้วย
  { id:'focus', kind:'prefix', category:'offense', label:'Sage Focus', emoji:'🧘', pre:'Focused', slots:['amulet','ring'], minItemLevel:45, bestTier:2,
    fmt:v=>'-'+v+'%', tiers:[[11,14],[8,10],[6,7],[4,5],[2,3]],
    apply:(p,v)=>{ p.cdMul=Math.max(STAT_CAPS.cdMulMin,(p.cdMul||1)*(1-v/100)); p.critChance=Math.max(0,(p.critChance||0)-v*0.35/100); } }, // คูลดาวน์ไวมาก แลกคริติคอลลดลง
  { id:'gambler', kind:'suffix', category:'offense', label:'Gambler', emoji:'🎲', suf:'of Fortune', slots:['ring'], minItemLevel:25, bestTier:3,
    fmt:v=>'+'+v+'%', tiers:[[70,90],[50,69],[34,49],[22,33],[13,21]],
    apply:(p,v)=>{ p.critMul=(p.critMul||1.55)+v/100; } }, // เดิมพันคริติคอลก้อนใหญ่ เฉพาะแหวนหายาก ไม่มีข้อเสีย
  { id:'nourish', kind:'suffix', category:'defense', label:'Nourished', emoji:'💊', suf:'of Nourishment', slots:['armor','amulet'], minItemLevel:20, bestTier:3,
    fmt:v=>'+'+v+'%', tiers:[[35,50],[25,34],[17,24],[10,16],[5,9]],
    apply:(p,v)=>{ p.healEffect=(p.healEffect||1)+v/100; } }, // บูมค่าฟื้นจากไอเทม heal ในด่าน
]; // Future schema: {id,kind,label,tiers,apply,baseIds?,baseTags?,slots?,minItemLevel?,exclusive:true}
// v4.90: น้ำหนักสุ่ม mod — mod แรง/หายาก = weight ต่ำ (ออกยาก) · ค่าเริ่มต้น 100
const AFFIX_WEIGHT = { dmg:70, crit:50, critdmg:55, cd:50, bossdmg:45, laststand:80, hp:110, def:60, regen:100, lifekill:90, crisisguard:85, spd:110, pick:130, xp:120, dash:100,
  edge:40, precision:35, hppct:65, regenpct:55, bulwark:60, mend:90, sprint:70, forager:95, sugarfind:85, boxfind:60, orbfind:50, uniquecd:55, wayfarer:95,
  vampiric:30, berserk:18, focus:18, gambler:24, nourish:40,
  m_dashnova:30, m_critarc:28, m_killshell:30, m_stillfocus:32, m_opener:32, m_thorns:30 };
function affixWeight(mod){ return (mod&&AFFIX_WEIGHT[mod.id])||(mod&&FORGE_CATALOG.find(c=>c.id===mod.id)?.weight)||100; }
function pickWeightedMod(arr){ if(!arr||!arr.length)return null; let tot=0; for(const m of arr)tot+=affixWeight(m); let r=Math.random()*tot; for(const m of arr){ r-=affixWeight(m); if(r<=0)return m; } return arr[arr.length-1]; }
function affixChancePct(mod,arr){ let tot=0; for(const m of arr)tot+=affixWeight(m); const v=tot?affixWeight(mod)/tot*100:0; return v>=10?Math.round(v):v.toFixed(1); }
// v4.91: ขยาย tier เป็น T0 (ดีสุด) … T10 (แย่สุด) · สร้างจาก 5 band เดิม: ช่วงค่า = T5lo×0.5 … T1hi×1.2 แบ่ง 11 ขั้นแบบ geometric
const AFFIX_TIER_MAX=10;
function expandAffixTiers(mod){
  if(!mod||!mod.tiers||mod.tiers.length>5)return;const old=mod.tiers;mod.tiers5=old;
  const hi0=Math.round(old[0][1]*1.2),lo=Math.max(1,Math.round(hi0*0.2)),hi=Math.max(lo,hi0);   // v6.55.76: T10 ≈ 20% ของ T0 (v6.55.75 40%, เดิม ~6%) — mod ขั้นต่ำมีความหมายเทียบ ATK อาวุธ
  const n=Math.min(11,hi-lo+1),out=[];
  for(let t=0;t<n;t++){if(n<11){const value=hi-t;out.push([value,value]);}else{const f0=(10-t)/11,f1=(11-t)/11,a=Math.max(lo,Math.round(lo*Math.pow(hi/lo,f0))),b=Math.max(a,Math.round(lo*Math.pow(hi/lo,f1))-(t===0?0:1));out.push([a,Math.max(a,b)]);}}
  mod.tiers=out;if(mod.bestTier)mod.bestTier=Math.min(n-1,Math.round((mod.bestTier*2-1)*(n-1)/10));
  if(mod.id==='vampiric'){mod.tiers=[[20,30],[10,19],[1,9]];mod.bestTier=0;}
}
const FORGE_CATALOG = [{"number":1,"id":"f_might","label":"Might","description":"Damage for every attack","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":16,"weight":100},{"number":2,"id":"f_rapid_rhythm","label":"Rapid Rhythm","description":"Faster basic attack cycles","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":12,"weight":70},{"number":3,"id":"f_precision","label":"Precision","description":"Critical hit chance","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":5,"weight":70},{"number":4,"id":"f_deadly_sweet","label":"Deadly Sweet","description":"Critical hit damage","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":60,"weight":70},{"number":5,"id":"f_heavy_batter","label":"Heavy Batter","description":"Stronger direct hits, slower basic attacks","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":25,"weight":70},{"number":6,"id":"f_wide_recipe","label":"Wide Recipe","description":"Larger supported attack areas","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":12,"weight":70},{"number":7,"id":"f_lingering_flavor","label":"Lingering Flavor","description":"Damage over time","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":8,"id":"f_lingering_touch","label":"Lingering Touch","description":"Longer supported enemy statuses","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":9,"id":"f_pack_leader","label":"Pack Leader","description":"Minion damage","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":10,"id":"f_executioner","label":"Executioner","description":"Damage against enemies below 30% HP","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":11,"id":"f_opening_bite","label":"Opening Bite","description":"Damage against enemies above 90% HP","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":24,"weight":70},{"number":12,"id":"f_giant_slayer","label":"Giant Slayer","description":"Damage against elites, minibosses and bosses","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":21,"weight":70},{"number":13,"id":"f_vital_dough","label":"Vital Dough","description":"Maximum HP","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":100,"weight":100},{"number":14,"id":"f_hard_shell","label":"Hard Shell","description":"Armor rating","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":18,"weight":100},{"number":15,"id":"f_slow_recovery","label":"Slow Recovery","description":"HP regeneration per second","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":14,"weight":100},{"number":16,"id":"f_fresh_meal","label":"Fresh Meal","description":"HP recovered on kill, rate limited","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":5,"weight":70},{"number":17,"id":"f_vampiric_bite","label":"Vampiric Bite","description":"Direct-hit recovery, rate limited","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":10,"weight":70},{"number":18,"id":"f_critical_barrier","label":"Critical Barrier","description":"Critical hits grant a timed HP barrier","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":12,"weight":70},{"number":19,"id":"f_quiet_recovery","label":"Quiet Recovery","description":"Extra regeneration after avoiding HP damage","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":12,"weight":70},{"number":20,"id":"f_emergency_coating","label":"Emergency Coating","description":"Damage reduction below 40% HP","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":14,"weight":70},{"number":21,"id":"f_dash_guard","label":"Dash Guard","description":"Damage reduction after a dash","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":12,"weight":70},{"number":22,"id":"f_crowd_padding","label":"Crowd Padding","description":"Armor while surrounded","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":23,"id":"f_elite_rations","label":"Elite Rations","description":"Recover HP after repeated hits on elites and bosses","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":8,"weight":70},{"number":24,"id":"f_overflow_cream","label":"Overflow Cream","description":"Excess recovery becomes a capped timed barrier","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":20,"weight":70},{"number":25,"id":"f_third_beat","label":"Third Beat","description":"Every third direct hit gains damage","row":"play","group":"rhythm","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":26,"id":"f_patient_bite","label":"Patient Bite","description":"A direct hit after an attack gap gains damage","row":"play","group":"rhythm","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":27,"id":"f_single_serving","label":"Single Serving","description":"Repeated direct hits on one enemy gain damage","row":"play","group":"rhythm","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":28,"id":"f_critical_tempo","label":"Critical Tempo","description":"Critical hits grant temporary attack speed","row":"play","group":"rhythm","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":29,"id":"f_dash_primer","label":"Dash Primer","description":"First direct hit after a dash gains damage","row":"play","group":"movement","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":30,"id":"f_running_recipe","label":"Running Recipe","description":"Travel distance prepares the next attack","row":"play","group":"movement","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":31,"id":"f_steady_hands","label":"Steady Hands","description":"Damage while standing still","row":"play","group":"movement","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":32,"id":"f_close_quarters","label":"Close Quarters","description":"Damage to nearby enemies","row":"play","group":"movement","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":33,"id":"f_brittle_shell","label":"Brittle Shell","description":"Damage to chilled or frozen enemies","row":"play","group":"status","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":34,"id":"f_deep_flavor","label":"Deep Flavor","description":"Hits extend a damage-over-time status, capped","row":"play","group":"status","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":35,"id":"f_mixed_recipe","label":"Mixed Recipe","description":"Damage per distinct enemy status, up to three","row":"play","group":"status","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":36,"id":"f_aftertaste","label":"Aftertaste","description":"Damage window after an applied status expires","row":"play","group":"status","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":37,"id":"f_marked_prey","label":"Marked Prey","description":"Mark a target to improve companion damage","row":"play","group":"companions","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":38,"id":"f_pack_rhythm","label":"Pack Rhythm","description":"Companion hits prepare the owner attack","row":"play","group":"companions","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":39,"id":"f_shared_feast","label":"Shared Feast","description":"Companion kills or repeated boss hits heal the owner","row":"play","group":"companions","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":40,"id":"f_lone_companion","label":"Lone Companion","description":"Stronger companion while exactly one is active","row":"play","group":"companions","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":41,"id":"f_last_bite","label":"Last Bite","description":"Damage below 40% HP","row":"play","group":"survival","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":42,"id":"f_perfect_glaze","label":"Perfect Glaze","description":"Damage above 90% HP","row":"play","group":"survival","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":43,"id":"f_shielded_strike","label":"Shielded Strike","description":"Direct-hit damage while a barrier is present","row":"play","group":"survival","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":44,"id":"f_measured_revenge","label":"Measured Revenge","description":"HP damage prepares the next direct hit","row":"play","group":"survival","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":45,"id":"f_gathering_pace","label":"Gathering Pace","description":"Collecting combat EXP grants temporary move speed","row":"play","group":"harvest","slots":["boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":46,"id":"f_stored_sweetness","label":"Stored Sweetness","description":"Collected EXP prepares a stronger direct hit","row":"play","group":"harvest","slots":["boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":47,"id":"f_fresh_delivery","label":"Fresh Delivery","description":"Healing pickups grant temporary healing effectiveness","row":"play","group":"harvest","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":48,"id":"f_growing_appetite","label":"Growing Appetite","description":"Level-ups grant a temporary damage bonus","row":"play","group":"harvest","slots":["boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":49,"id":"f_distant_bite","label":"Distant Bite","description":"Damage against distant enemies","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":50,"id":"f_point_blank","label":"Point Blank","description":"Direct-hit damage to close enemies","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":51,"id":"f_armor_breaker","label":"Armor Breaker","description":"Partial enemy armor bypass","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":52,"id":"f_focused_recipe","label":"Focused Recipe","description":"Damage with few nearby enemies","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":53,"id":"f_crowd_appetite","label":"Crowd Appetite","description":"Damage while surrounded, capped","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":54,"id":"f_charged_sugar","label":"Charged Sugar","description":"Charged attack damage","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":55,"id":"f_combo_flour","label":"Combo Flour","description":"Combo finisher damage","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":56,"id":"f_active_essence","label":"Active Essence","description":"Active skill damage","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":57,"id":"f_quick_preparation","label":"Quick Preparation","description":"Active skill cooldown reduction","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":58,"id":"f_persistent_zone","label":"Persistent Zone","description":"Longer damaging zones, same DPS","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":59,"id":"f_companion_tempo","label":"Companion Tempo","description":"Companion attack speed","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":60,"id":"f_patient_ferment","label":"Patient Ferment","description":"Damage over time ramps with status age","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":61,"id":"f_barrier_capacity","label":"Barrier Capacity","description":"Higher maximum forge barrier","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":15,"weight":70},{"number":62,"id":"f_lasting_coating","label":"Lasting Coating","description":"Longer forge barrier duration","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":25,"weight":70},{"number":63,"id":"f_efficient_recovery","label":"Efficient Recovery","description":"Healing effectiveness","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":25,"weight":70},{"number":64,"id":"f_boss_padding","label":"Boss Padding","description":"Damage reduction during boss and miniboss encounters","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":65,"id":"f_crowd_filter","label":"Crowd Filter","description":"Damage reduction outside boss and miniboss encounters","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":66,"id":"f_impact_cushion","label":"Impact Cushion","description":"Mitigate a large hit, with cooldown","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":20,"weight":70},{"number":67,"id":"f_steady_shell","label":"Steady Shell","description":"Extra armor while stationary","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":20,"weight":70},{"number":68,"id":"f_moving_cover","label":"Moving Cover","description":"Movement grants a small barrier, with cooldown","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":20,"weight":70},{"number":69,"id":"f_control_resistance","label":"Control Resistance","description":"Shorter incoming control statuses","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":70,"id":"f_clean_glaze","label":"Clean Glaze","description":"Dash cleanses one eligible harmful status","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":71,"id":"f_broken_shell","label":"Broken Shell","description":"Barrier destruction grants temporary protection","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":20,"weight":70},{"number":72,"id":"f_companion_shelter","label":"Companion Shelter","description":"Nearby companions grant capped armor","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":73,"id":"f_long_flight","label":"Long Flight","description":"Projectile damage scales with distance travelled","row":"play","group":"projectile","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":74,"id":"f_piercing_momentum","label":"Piercing Momentum","description":"Piercing distinct targets empowers a projectile","row":"play","group":"projectile","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":75,"id":"f_ricochet_focus","label":"Ricochet Focus","description":"Bouncing to a new target grants damage","row":"play","group":"projectile","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":76,"id":"f_clean_finish","label":"Clean Finish","description":"Projectile kills prepare the next basic attack","row":"play","group":"projectile","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":77,"id":"f_combo_guard","label":"Combo Guard","description":"Combo finishers grant a barrier","row":"play","group":"melee","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":78,"id":"f_closing_step","label":"Closing Step","description":"Entering melee range empowers the first melee attack","row":"play","group":"melee","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":79,"id":"f_packed_punch","label":"Packed Punch","description":"A multi-target melee hit empowers the next attack","row":"play","group":"melee","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":80,"id":"f_duel_rhythm","label":"Duel Rhythm","description":"Repeated melee hits grant temporary move speed","row":"play","group":"melee","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":81,"id":"f_prepared_release","label":"Prepared Release","description":"Basic hits charge the next active skill","row":"play","group":"active","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":82,"id":"f_follow_through","label":"Follow Through","description":"An active skill empowers the next three basic attacks","row":"play","group":"active","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":83,"id":"f_emergency_cast","label":"Emergency Cast","description":"Casting at low HP grants a barrier","row":"play","group":"active","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":84,"id":"f_patient_reserve","label":"Patient Reserve","description":"Holding a ready active skill builds a capped bonus","row":"play","group":"active","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":85,"id":"f_settled_ground","label":"Settled Ground","description":"Zone damage ramps while an enemy stays inside","row":"play","group":"zones","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":86,"id":"f_home_recipe","label":"Home Recipe","description":"Standing in an owner-created zone grants armor","row":"play","group":"zones","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":87,"id":"f_crossing_flavors","label":"Crossing Flavors","description":"Two different overlapping zones gain damage","row":"play","group":"zones","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":88,"id":"f_last_serving","label":"Last Serving","description":"An expired zone deals one final hit, with cooldown","row":"play","group":"zones","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":89,"id":"f_hunter_s_mark","label":"Hunter’s Mark","description":"Direct hits mark one target for increased owner damage","row":"play","group":"marks","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":90,"id":"f_cash_out","label":"Cash Out","description":"Repeated hits consume a mark for bonus damage","row":"play","group":"marks","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":91,"id":"f_claimed_reward","label":"Claimed Reward","description":"Marked kills or repeated boss hits grant a barrier","row":"play","group":"marks","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":92,"id":"f_passing_target","label":"Passing Target","description":"Marked kills transfer the remaining mark duration","row":"play","group":"marks","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":93,"id":"f_heavy_recipe","label":"Heavy Recipe","description":"Armor grants capped direct-hit damage","row":"play","group":"barrier","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":94,"id":"f_stored_barrier","label":"Stored Barrier","description":"Spend part of a barrier to empower a direct hit","row":"play","group":"barrier","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":95,"id":"f_breaking_point","label":"Breaking Point","description":"Barrier destruction grants attack speed","row":"play","group":"barrier","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":96,"id":"f_guarded_focus","label":"Guarded Focus","description":"A maintained barrier grants critical chance","row":"play","group":"barrier","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":97,"id":"f_earned_edge","label":"Earned Edge","description":"Kills build a temporary damage bonus","row":"play","group":"growth","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":98,"id":"f_elite_lesson","label":"Elite Lesson","description":"Elite kills build a capped run-long damage bonus","row":"play","group":"growth","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":99,"id":"f_adaptive_recipe","label":"Adaptive Recipe","description":"Collected EXP strengthens the most used attack tag","row":"play","group":"growth","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":100,"id":"f_second_course","label":"Second Course","description":"Level-ups refund part of the active cooldown","row":"play","group":"growth","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":101,"id":"f_reliable_batter","label":"Reliable Batter","description":"Raise the minimum of the gear attack damage range","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"active","maxValue":40,"weight":70},{"number":102,"id":"f_swift_delivery","label":"Swift Delivery","description":"Projectile travel speed","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":103,"id":"f_firm_push","label":"Firm Push","description":"Strength of existing knockback","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":104,"id":"f_sticky_flavor","label":"Sticky Flavor","description":"Chance to apply an existing supported status","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":105,"id":"f_shield_cracker","label":"Shield Cracker","description":"Damage to enemy shields","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":106,"id":"f_stagger_baker","label":"Stagger Baker","description":"Stagger accumulation","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":107,"id":"f_thorn_glaze","label":"Thorn Glaze","description":"Rate-limited contact damage reflection","row":"power","group":"power","slots":["weapon","gloves","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":108,"id":"f_clean_recipe","label":"Clean Recipe","description":"Damage to enemies without owner-applied statuses","row":"power","group":"power","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":109,"id":"f_slow_burn_resistance","label":"Slow-Burn Resistance","description":"Incoming damage-over-time reduction","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":110,"id":"f_projectile_padding","label":"Projectile Padding","description":"Incoming enemy projectile damage reduction","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":111,"id":"f_safe_soles","label":"Safe Soles","description":"Incoming trap and ground hazard reduction","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":112,"id":"f_firm_footing","label":"Firm Footing","description":"Incoming knockback distance reduction","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":113,"id":"f_buffered_bite","label":"Buffered Bite","description":"Delay part of incoming HP damage without deleting it","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":114,"id":"f_first_hit_guard","label":"First-Hit Guard","description":"Mitigate the first hit after a damage-free interval","row":"sustain","group":"sustain","slots":["weapon","gloves","armor","boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":115,"id":"f_last_crumb","label":"Last Crumb","description":"Survive one lethal hit at 1 HP per run","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"active","maxValue":1,"weight":70},{"number":116,"id":"f_sweet_decoy","label":"Sweet Decoy","description":"Low HP creates a temporary enemy decoy","row":"sustain","group":"sustain","slots":["armor","gloves","amulet","boots","ring"],"status":"planned","maxValue":20,"weight":70},{"number":117,"id":"f_treasure_aroma","label":"Treasure Aroma","description":"Additional chance for an eligible equipment drop","row":"play","group":"quantity","slots":["boots","amulet","ring"],"status":"active","maxValue":15,"weight":100},{"number":118,"id":"f_currency_sprinkles","label":"Currency Sprinkles","description":"Additional chance for an eligible currency drop","row":"play","group":"quantity","slots":["boots","amulet","ring"],"status":"active","maxValue":15,"weight":100},{"number":119,"id":"f_twin_parcel","label":"Twin Parcel","description":"An equipment drop can add an independently rolled box","row":"play","group":"quantity","slots":["boots","amulet","ring"],"status":"active","maxValue":12,"weight":70},{"number":120,"id":"f_extra_pinch","label":"Extra Pinch","description":"A currency pickup can contain one extra unit","row":"play","group":"quantity","slots":["boots","amulet","ring"],"status":"active","maxValue":15,"weight":70},{"number":121,"id":"f_elite_pockets","label":"Elite Pockets","description":"Elites and minibosses can grant an extra currency","row":"play","group":"quantity","slots":["boots","amulet","ring"],"status":"active","maxValue":15,"weight":70},{"number":122,"id":"f_boss_pantry","label":"Boss Pantry","description":"Bosses can grant an extra currency parcel","row":"play","group":"quantity","slots":["boots","amulet","ring"],"status":"active","maxValue":25,"weight":70},{"number":123,"id":"f_fine_ingredients","label":"Fine Ingredients","description":"Better base quality weights within the eligible table","row":"play","group":"quality","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":124,"id":"f_polished_parcel","label":"Polished Parcel","description":"Better mod tiers on dropped equipment","row":"play","group":"quality","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":125,"id":"f_careful_selection","label":"Careful Selection","description":"Avoid the lowest value rolls on dropped equipment","row":"play","group":"quality","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":126,"id":"f_signature_scent","label":"Signature Scent","description":"More eligible special equipment bases","row":"play","group":"quality","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":127,"id":"f_weapon_seeker","label":"Weapon Seeker","description":"Bias equipment toward weapons and gloves","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":128,"id":"f_armor_seeker","label":"Armor Seeker","description":"Bias equipment toward armor and boots","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":129,"id":"f_trinket_seeker","label":"Trinket Seeker","description":"Bias equipment toward amulets and rings","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":130,"id":"f_spark_collector","label":"Spark Collector","description":"Bias currency toward Spark Sugar","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"active","maxValue":50,"weight":70},{"number":131,"id":"f_cream_collector","label":"Cream Collector","description":"Bias currency toward Twist Cream","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"active","maxValue":50,"weight":70},{"number":132,"id":"f_jam_collector","label":"Jam Collector","description":"Bias currency toward Wild Jam","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"active","maxValue":50,"weight":70},{"number":133,"id":"f_tier_collector","label":"Tier Collector","description":"Bias currency toward Crystal Glaze","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"active","maxValue":50,"weight":70},{"number":134,"id":"f_base_tracker","label":"Base Tracker","description":"Bias equipment toward one selected eligible base","row":"play","group":"target_farming","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":135,"id":"f_clean_salvage","label":"Clean Salvage","description":"Drop-stamped bonus salvage materials","row":"play","group":"economy","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":136,"id":"f_scrap_surprise","label":"Scrap Surprise","description":"Drop-stamped chance for currency when salvaged","row":"play","group":"economy","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":137,"id":"f_trade_stamp","label":"Trade Stamp","description":"Drop-stamped bonus sale Sugar","row":"play","group":"economy","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":138,"id":"f_patient_shopper","label":"Patient Shopper","description":"A stage clear grants one non-stacking supply discount","row":"play","group":"economy","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":139,"id":"f_quick_pull","label":"Quick Pull","description":"Faster movement of already attracted loot","row":"play","group":"collection","slots":["boots","amulet","ring"],"status":"active","maxValue":40,"weight":100},{"number":140,"id":"f_dash_retrieval","label":"Dash Retrieval","description":"Collect nearby drops along a dash path","row":"play","group":"collection","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":141,"id":"f_magnet_reserve","label":"Magnet Reserve","description":"A redundant magnet grants a capped reserve charge","row":"play","group":"collection","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":142,"id":"f_medic_s_choice","label":"Medic’s Choice","description":"Low HP grants a rate-limited extra healing-drop chance","row":"play","group":"collection","slots":["boots","amulet","ring"],"status":"active","maxValue":10,"weight":70},{"number":143,"id":"f_fresh_storage","label":"Fresh Storage","description":"A full-HP healing pickup stores capped recovery","row":"play","group":"collection","slots":["boots","amulet","ring"],"status":"active","maxValue":20,"weight":70},{"number":144,"id":"f_field_organizer","label":"Field Organizer","description":"Merge nearby same-currency piles without changing totals","row":"play","group":"collection","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":145,"id":"f_treasure_compass","label":"Treasure Compass","description":"Direction to an existing nearby treasure","row":"play","group":"exploration","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":146,"id":"f_elite_radar","label":"Elite Radar","description":"Direction to an existing nearby elite","row":"play","group":"exploration","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":147,"id":"f_hazard_survey","label":"Hazard Survey","description":"Reveal eligible hidden traps early","row":"play","group":"exploration","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":148,"id":"f_secret_aroma","label":"Secret Aroma","description":"Chance for one additional eligible treasure location","row":"play","group":"exploration","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":149,"id":"f_choice_parcel","label":"Choice Parcel","description":"Eligible gear chests can offer one of two items","row":"play","group":"exploration","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70},{"number":150,"id":"f_deep_preparation","label":"Deep Preparation","description":"One extra service choice at a Delve rest point","row":"play","group":"exploration","slots":["boots","amulet","ring"],"status":"planned","maxValue":20,"weight":70}];
const FORGE_ROWS=['Power','Sustain','Utility'];
function forgeValue(p,n){return Math.max(0,Number(p&&p.forgeMods&&p.forgeMods[n])||0);}
/* v8.1.42 เจ้าของ: เพดาน mod ที่ซ้อนแล้วหลุด — HP จาก Vital Dough รวมไม่เกิน +150 · ลดดาเมจรวมไม่เกิน 40% · Clean Recipe รวมไม่เกิน 20% · โบนัสดาเมจรวมไม่เกิน +150% */
const FORGE_HP_CAP=150,FORGE_DR_CAP=.3,FORGE_DMG_CAP=1.5,FORGE_CLEAN_CAP=.2;
function forgeApply(p,n,v){p.forgeMods=p.forgeMods||{};p.forgeMods[n]=(p.forgeMods[n]||0)+v;
  if(n===1)p.dmgMul+=v/100;if(n===3)p.critChance=(p.critChance||0)+v/100;if(n===4)p.critMul=(p.critMul||1.55)+v/100;
  if(n===6)p.gearArea=(p.gearArea||0)+v/100;if(n===13){if(v<0)p.maxhp+=v;else{const have=p._forgeHp||0,add=Math.max(0,Math.min(v,FORGE_HP_CAP-have));p._forgeHp=have+add;p.maxhp+=add;}}if(n===14)p.armor=(p.armor||0)+v;
  if(n===15)p.regen=(p.regen||0)+v/10;if(n===16)p.lifeOnKill=(p.lifeOnKill||0)+v;
  if(n===20)p.lowHpGuard=(p.lowHpGuard||0)+v/100;if(n===57)p.uniqueCdMul=(p.uniqueCdMul||1)*(1-v/100);
  if(n===63)p.healEffect=(p.healEffect||1)+v/100;}
// v7.8.82 เจ้าของ (Equipment เฟส 1): สุ่มได้เฉพาะ 36 ม็อดที่อ่านเข้าใจทันที · ม็อดอื่นที่ติดของอยู่แล้วยังทำงานเหมือนเดิม แค่สุ่มใหม่ไม่ได้
const FORGE_ROLLABLE=new Set([1,2,3,4,6,7,10,11,12,49,57,13,14,15,16,17,18,20,21,63,64,115,29,31,32,33,41,42,45,48,97,100,117,118,122,139]);
// แท็ก build ของม็อด → ป้าย ✓ Fits your hero เมื่อตรงกับ WEAPON_TAGS ของฮีโร่
const FORGE_MOD_TAGS={3:['crit'],4:['crit'],18:['crit'],33:['frost'],32:['melee'],21:['melee'],29:['melee','spark'],49:['ranged'],2:['spark','ranged'],57:['spark'],100:['spark'],6:['swarm'],97:['swarm'],7:['fire']};
function forgeModFits(mod,cid){const tg=mod&&FORGE_MOD_TAGS[mod.number];if(!tg)return false;const own=(typeof WEAPON_TAGS!=='undefined'?WEAPON_TAGS:{})[cid||(typeof Save!=='undefined'&&Save.data&&Save.data.character)||'momo']||[];return tg.some(t=>own.includes(t));}
function tierStars(mod,t){const n=(mod&&mod.tiers&&mod.tiers.length)||11;t=Math.max(0,Math.min(n-1,t??n-1));return Math.max(1,5-Math.floor(t*5/n));}
function tierStarText(mod,t){return mod&&mod.bad?'Bad':'Lv '+tierStars(mod,t);}   // v8.0.87 เจ้าของ: เลิกใช้คำว่า Star → Lv
const MOD_TIER_COLOR={1:'#e9e2f2',2:'#7ee08f',3:'#6fb8ff',4:'#c891ff',5:'#ffae3d'};   // v7.8.95 ★1 ขาว · ★2 เขียว · ★3 ฟ้า · ★4 ม่วง · ★5 ส้ม Legendary
const FORGE_DEFS=FORGE_CATALOG.map(c=>({id:c.id,label:c.label,description:c.description,row:c.row,group:c.group,slots:c.slots,number:c.number,enabled:c.status==='active'&&FORGE_ROLLABLE.has(c.number),kind:'mod',category:c.row==='power'?'offense':c.row==='sustain'?'defense':['quantity','quality','target_farming','economy','collection','exploration'].includes(c.group)?'utility':'play',emoji:c.row==='power'?'⚔️':c.row==='sustain'?'🛡️':'✦',pre:c.label,
  fmt:v=>c.number===115?'Once per run':c.number===13||c.number===14?'+'+v:c.number===15?'+'+(v/10)+' HP/s':'+'+v+'%',
  tiers:(()=>{const lo=Math.max(1,Math.round(c.maxValue*.2)),n=Math.min(11,c.maxValue-lo+1);return Array.from({length:n},(_,t)=>{const v=c.maxValue-Math.round((c.maxValue-lo)*t/Math.max(1,n-1));return[v,v];});})(),apply:(p,v)=>forgeApply(p,c.number,v)}));

// Canvas icons are cached per mod; the pictogram describes the effect, the small seal identifies the mod.
function forgeModVisual(mod){
 const c=FORGE_CATALOG.find(c=>c.id===mod?.id),d=(mod?.description||mod?.label||'').toLowerCase();
 const glyph=/critical.*chance/.test(d)?'◎':/critical.*damage/.test(d)?'✦':/barrier/.test(d)?'⬡':/armor|reduction|guard/.test(d)?'◇':/hp|heal|recovery|regeneration/.test(d)?'♥':/speed|faster|dash|cooldown/.test(d)?'➜':/area|range|radius/.test(d)?'⊕':/currency|sugar|cost|price/.test(d)?'$':/exp|level/.test(d)?'↑':/treasure|chest|gear|loot/.test(d)?'▣':/pickup|collect/.test(d)?'∩':/time|duration|second/.test(d)?'◷':/damage|hit|attack/.test(d)?'⚔':'✧';
 return {key:'forge_mod_'+mod.id,glyph,seal:c?String(c.number):mod.label.slice(0,2).toUpperCase(),color:forgeRowForMod(mod)==='power'?'#ffc078':forgeRowForMod(mod)==='sustain'?'#91e5bd':'#b4c8ff'};
}
function drawForgeModIcon(scene,mod,x,y,size=26){
 if(!mod)return;const v=forgeModVisual(mod),tm=scene.textures;
 if(tm.createCanvas&&!tm.exists(v.key)){
  const tex=tm.createCanvas(v.key,96,96),c=tex.getContext();
  c.fillStyle='#24182f';c.beginPath();c.arc(48,48,44,0,Math.PI*2);c.fill();
  c.strokeStyle=v.color;c.lineWidth=4;c.stroke();c.fillStyle=v.color;c.textAlign='center';c.textBaseline='middle';c.font='bold 53px sans-serif';c.fillText(v.glyph,47,42);
  c.fillStyle='#422b51';c.fillRect(49,64,42,23);c.fillStyle='#fff0df';c.font='bold 19px sans-serif';c.fillText(v.seal,70,76);tex.refresh();
 }
 return scene.forgeIcon(tm.createCanvas?v.key:'',x,y,size,v.glyph);
}

function forgeRowForMod(m){return m&&m.row||((m&&m.category)==='offense'?'power':(m&&m.category)==='defense'?'sustain':'play');}
function forgeLines(item){const N=forgeLineCount(item),out=Array(N).fill(null),rest=[];for(const a of (item&&item.affixes)||[]){if(Number.isInteger(a.line)&&a.line>=0&&a.line<N&&!out[a.line])out[a.line]=a;else rest.push(a);}for(const a of rest){const row=['power','sustain','play'].indexOf(forgeRowForMod(affixDef(a.id))),i=row>=0&&!out[row]?row:out.indexOf(null);if(i>=0)out[i]=a;}return out;} function forgeLineCount(item){const g=item&&item.grade,n=typeof RAR_LINES!=='undefined'&&g&&RAR_LINES[g]!=null?RAR_LINES[g]:3;let hi=0;for(const a of (item&&item.affixes)||[])if(Number.isInteger(a.line))hi=Math.max(hi,a.line+1);return Math.min(6,Math.max(3,n,hi));}   // v8.0.87 แถวตามขั้น (สูงสุด 6)
function forgeSetLines(item,lines){item.affixes=lines.map((a,i)=>a?Object.assign({},a,{line:i}):null).filter(Boolean);item.forgeSchema=1;}
// v8.0.32 เจ้าของ: รวมของ (หลัก + 2 ชิ้นช่อง/ระดับเดียวกัน → ระดับถัดไป) · ระดับต่อชิ้น = item.grade · ช่อง mod ตามระดับ (เพดาน iLv ยังอยู่)
const RAR_LINES={start:0,common:1,rare:2,epic:3,legend:3,mythic:4,ancient:5,divine:6},GRADE_NEXT={common:'rare',rare:'epic',epic:'legend',legend:'mythic',mythic:'ancient',ancient:'divine'};
/* v8.3.33 เจ้าของ 27 พ.ย.: Gear แบบ Archero 2 · Mod ติดมากับของ (ตามระดับ) · อัปเลเวล Sugar + Twist Cream ไม่มีล้ม · เลเวลละ +4% ค่าหลักและ Mod · รวม 3 ชิ้น = ระดับถัดไป + Mod แถวใหม่สุ่มให้ · ปิดหน้า Forge · Star Sugar 1→5 / Recipe Ink 1→3 Twist Cream */
const GEAR_SIMPLE=true,GEAR_LV_CAP={start:10,common:10,rare:15,epic:20,legend:25,mythic:30,ancient:30,divine:30},GEAR_LV_PCT=.04,GEAR_CUR_TO_CREAM={starsugar:5,recipeink:3};
if(GEAR_SIMPLE&&typeof HUB_GROUPS!=='undefined'){ const G=HUB_GROUPS.gLoadout; G.rows=G.rows.filter(r=>r[0]!=='craft'); for(const sc of G.sections||[])sc[2]=sc[2].filter(t=>t[0]!=='craft'); }   /* v8.3.33 Forge ปิด */
function gearUpCost(lv){lv=Math.max(0,lv|0);return {sugar:40*(lv+1),cream:1+Math.floor(lv/3)};}
function gearFillLines(item){if(!item)return 0;let n=0;for(let i=0;i<FORGE_MAX_LINES;i++){if(!forgeLineOpen(item,i)||forgeLines(item)[i])continue;let mod=null;try{mod=pickWeightedMod(forgePool(item,i));}catch(e){mod=null;}if(!mod)continue;const ls=forgeLines(item);ls[i]=Object.assign(rollOneAffix(mod,affixBestTierForItem(item,mod),item.itemLevel||1),{line:i});forgeSetLines(item,ls);n++;}return n;}
const GRADE_ORDER=['start','common','rare','epic','legend','mythic','ancient','divine'],FORGE_MAX_LINES=6;function gradeRank(g){return Math.max(0,GRADE_ORDER.indexOf(g));}   // v8.0.87 เจ้าของ: เหนือ Legend อีก 3 ขั้น (Merge อย่างเดียว) +1 แถวต่อขั้น
function gearGrade(item){const g=item&&item.grade;if(g&&RAR_LINES[g]!=null)return g;const b=item&&GEAR_ALL.find(x=>x.id===item.baseId);return (b&&b.tier)||'common';}
// v8.0.83 แถวเปิดตามความหายากอย่างเดียว (iLv คุมแค่ดาว)
function forgeLineOpen(item,line){if(!item||!Number.isInteger(line)||line<0||line>=6)return false;const n=(item.grade||GEAR_ALL.some(b=>b.id===item.baseId))?RAR_LINES[gearGrade(item)]:3;return line<(n==null?3:n)||!!forgeLines(item)[line];}
function gearEnhanceCap(item){if(GEAR_SIMPLE)return GEAR_LV_CAP[gearGrade(item)]||10;const l=Math.max(1,Number(item&&item.itemLevel)||1);return l<12?1:l<25?3:l<45?6:10;}   // v7.9.94 เจ้าของ: ของเลเวลต่ำตีบวกได้น้อยลง (เดิม 3/5/7/10)
function gearEffectiveEnhance(item){return Math.min(gearEnhanceCap(item),Math.max(0,Math.floor(Number(item&&item.enhanceLv)||0)));}
// Retain old rolls in saves; locked rows stay dormant until the item meets their level requirement.
function gearActiveAffixes(item){const L=forgeLines(item).filter((a,i)=>a&&forgeLineOpen(item,i));if(!GEAR_SIMPLE)return L;const m=1+GEAR_LV_PCT*gearEffectiveEnhance(item);return m===1?L:L.map(a=>Object.assign({},a,{v:Math.round((a.v||0)*m*10)/10}));}   /* v8.3.33 เลเวลอัป +4%/ขั้นกับ Mod ทุกแถว */
const FORGE_SLOT_ROWS={weapon:['power'],gloves:['power'],armor:['sustain'],boots:['play'],amulet:['sustain','play'],ring:['power','play']};   // v8.0.93 เจ้าของ: ชนิดไอเทมกำหนดกลุ่ม mod (อาวุธ/ถุงมือ=โจมตี · เกราะ=ป้องกัน · รองเท้า=เล่น/เคลื่อนที่ · สร้อย=ป้องกัน+เล่น · แหวน=โจมตี+เล่น)
// v8.0.94 เจ้าของ: อาวุธ/ถุงมือ/เกราะ/รองเท้า สุ่มได้ 25 mod ต่อชนิด (เปิด mod ที่มีโค้ดอยู่แล้วแต่เดิมสุ่มไม่ได้)
const FORGE_SLOT_POOL=(()=>{const W=[1,2,3,4,6,7,10,11,12,49,57,5,50,52,53,101,108,25,26,27,35,43,44,89,90];return{weapon:W,gloves:W,armor:[13,14,15,16,17,18,20,21,63,64,115,19,23,24,61,62,65,66,67,68,71,114,91,93,95],boots:[29,31,32,33,41,42,45,48,97,100,117,118,122,139,46,119,120,121,25,26,27,142,143,98,89],
  /* v8.1.41 เจ้าของ: สร้อย = ฟื้นฟู/โล่/ของตก · แหวน = คริ/จังหวะ/เงื่อนไขโจมตี — แยกเอกลักษณ์ ไม่ซ้ำ pool ฝั่งรองเท้าทั้งก้อน */
  amulet:[13,15,16,17,18,19,23,24,61,62,63,66,68,71,114,115,91,93,95,117,118,119,120,142,143],
  ring:[3,4,10,11,12,25,26,27,35,41,42,43,44,49,52,53,57,89,90,97,98,100,108,48,46]};})();
function forgePool(item,line,group){if(!forgeLineOpen(item,line))return [];const list=FORGE_SLOT_POOL[item.slot];if(list)return FORGE_DEFS.filter(m=>list.includes(m.number));const rows=FORGE_SLOT_ROWS[item.slot];return FORGE_DEFS.filter(m=>m.enabled&&m.slots.includes(item.slot)&&(!rows||rows.includes(m.row)));}   // v8.0.87 เจ้าของ: ไม่แบ่งหมวด — ทุกแถวสุ่มได้ทุก mod (ซ้ำได้)
function forgeRollMod(item,line,rnd=Math.random){const pool=forgePool(item,line).filter(m=>m.number!==115||!(item.affixes||[]).some(a=>a.id==='f_last_crumb'&&a.line!==line));if(!pool.length)return null;if(typeof FORGE_BAD_DEFS!=='undefined'&&rnd()<FORGE_BAD_CHANCE){const bad=FORGE_BAD_DEFS.filter(m=>m.slots.includes(item.slot));if(bad.length)return bad[Math.floor(rnd()*bad.length)%bad.length];}return pickWeightedMod(pool);}   /* v8.1.42 Last Crumb ไม่สุ่มซ้ำในไอเทมเดียว */
function forgeRollOptions(item,line,pool,n,forceId){const left=pool.slice(),out=[];if(forceId){const f=left.find(m=>m.id===forceId);if(f){out.push(forgeRoll(item,line,f));left.splice(left.indexOf(f),1);}}while(out.length<n&&left.length){const m=pickWeightedMod(left);if(!m)break;out.push(forgeRoll(item,line,m));left.splice(left.indexOf(m),1);}return out;}
const FORGE_PITY=20;   // v7.8.84 Auto-roll: ครบ 20 ครั้งไม่ได้ → ครั้งที่ 20 ได้เป้าแน่นอน
function forgeRoll(item,line,mod){const old=forgeLines(item)[line],best=affixBestTierForItem(item,mod);if(!old)return rollOneAffix(mod,best,item.itemLevel||1);const od=affixDef(old.id),ratio=(old.t??10)/Math.max(1,(od&&od.tiers.length||11)-1),t=Math.min(mod.tiers.length-1,Math.round(ratio*(mod.tiers.length-1))),b=mod.tiers[t];return{id:mod.id,t,v:b[0]+Math.floor(Math.random()*(b[1]-b[0]+1)),t11:1,tierSchema:2,line};}
function forgeMigrate(data){if(data.forgeEconomyVersion===1){const w=data.currency||{};const n=Math.max(0,Math.floor(Number(w.alt)||0))+Math.max(0,Math.floor(Number(w.chaos)||0));if(n||w.alt!=null||w.chaos!=null){w.transmute=Math.max(0,Math.floor(Number(w.transmute)||0))+n;delete w.alt;delete w.chaos;data.currency=w;return true;}return false;}const w=data.currency||(data.currency={}),safe=k=>Math.max(0,Math.floor(Number(w[k])||0)),refund=(key,to,oldPrice,newPrice)=>{const value=safe(key)*oldPrice,n=Math.floor(value/newPrice);w[to]=safe(to)+n;data.sugar=(data.sugar||0)+value-n*newPrice;delete w[key];};
  for(const k of ['regal','exalt']){w.transmute=safe('transmute')+safe(k);delete w[k];}const jam=Math.floor(safe('alt')/2);w.alt=safe('alt')-jam;w.chaos=safe('chaos')+jam;
  refund('annul','alt',90,110);refund('scour','transmute',30,120);for(const it of (data.gearItems||[]).concat(data.gearInbox||[]))if(it&&it.affixes)forgeSetLines(it,forgeLines(it));data.forgeEconomyVersion=1;forgeMigrate(data);return true;}
function forgeState(s){return s._forgeState||(s._forgeState={barrier:0,barrierUntil:0,lastHurt:s.elapsed||0,lastHit:-Infinity,kills:0,hitCount:0,xp:0,eliteBonus:0});}
/* v8.2.77 เจ้าของ: โล่ Forge โกง (เติมเร็วกว่ามอนตี) → เพดาน 15% (สูงสุด 30% กับ Barrier Capacity) · เติมรวมได้ ≤4% HP/วิ · แตกแล้วรอ 3 วิ */
const FORGE_BARRIER_BASE=.15,FORGE_BARRIER_MAX=.30,FORGE_BARRIER_RATE=.02,FORGE_BARRIER_LOCK=3,FORGE_BARRIER_PAUSE=2;   /* v8.2.78 เจ้าของ: ยังไม่แตก → 2%/วิ · โดนตีแล้วหยุดเติม 2 วิ (แบบ Energy Shield) */
function forgeBarrier(s,amount){const p=s.player,r=forgeState(s),now=s.elapsed||0;if(now<(r.barLockUntil||0)||now-(r.barHitAt??-Infinity)<FORGE_BARRIER_PAUSE)return;const cap=p.maxhp*Math.min(FORGE_BARRIER_MAX,FORGE_BARRIER_BASE+.6*forgeValue(p,61)/100);if(now-(r.barWinAt??-Infinity)>=1){r.barWinAt=now;r.barWin=0;}const room=Math.max(0,p.maxhp*FORGE_BARRIER_RATE-(r.barWin||0)),add=Math.min(Math.max(0,amount),room);if(add<=0)return;r.barWin=(r.barWin||0)+add;r.barrier=Math.min(cap,r.barrier+add);r.barrierUntil=(s.elapsed||0)+4*(1+forgeValue(p,62)/100);}
function forgeHeal(s,amount,overflow=true){const p=s.player;if(s.recipeHas?.('noheal')||p._uqNoRegen)return;amount=Math.max(0,amount)*(s.pactHealMul?.()??1);if(s.usesStoryBudget?.()){const r=forgeState(s),now=s.elapsed||0;if(now-(r.healWindowAt??-Infinity)>=1){r.healWindowAt=now;r.healSum=0;}amount=Math.min(amount,Math.max(0,p.maxhp*.03-(r.healSum||0)));r.healSum=(r.healSum||0)+amount;}const healed=Math.min(p.maxhp-p.hp,amount);p.hp+=Math.max(0,healed);if(overflow&&forgeValue(p,24))forgeBarrier(s,(amount-healed)*forgeValue(p,24)/100);}
function forgeStatuses(e){return[(e.frozen||0)>0||(e._chill||0)>0,(e._burnT||0)>0,(e._sourT||0)>0].filter(Boolean).length;}
function forgeDamage(s,e,amount){const p=s.player,r=forgeState(s),v=n=>forgeValue(p,n)/100,now=s.elapsed||0,direct=!s._infTick&&!s._frDmg&&!s._gmTick&&!s._uqBursting,terminal=s.character==='taro'&&s._taroDamageContext?.terminal===true,dist=Math.hypot(e.x-p.x,e.y-p.y);let bonus=0;
  if(s._infTick)bonus+=v(7);if(e.hp/e.maxhp<.3)bonus+=v(10);if(e.hp/e.maxhp>.9)bonus+=v(11);if(e.isBoss||e.isMini||e.isElite)bonus+=v(12);
  if(dist>280)bonus+=v(49);if(dist<140)bonus+=v(32);if(p.hp/p.maxhp<.4)bonus+=v(41);if(p.hp/p.maxhp>.9)bonus+=v(42);
  if((e.frozen||0)>0||(e._chill||0)>0)bonus+=v(33);const states=forgeStatuses(e);bonus+=v(35)*Math.min(3,states);if(!states)bonus+=Math.min(FORGE_CLEAN_CAP,v(108));
  const moving=p.body&&p.body.velocity&&Math.hypot(p.body.velocity.x,p.body.velocity.y)>25;if(!moving)bonus+=v(31);
  if(forgeValue(p,52)||forgeValue(p,53)){if(now>=(r.crowdAt||0)){r.crowdAt=now+.25;r.crowd=0;s.enemies?.children?.iterate(o=>{if(o?.active&&Math.hypot(o.x-p.x,o.y-p.y)<220)r.crowd++;});}if(r.crowd<=2)bonus+=v(52);bonus+=v(53)*Math.min(1,Math.max(0,(r.crowd-2)/6));}
  bonus+=r.eliteBonus||0;if(now<(r.earnedUntil||0))bonus+=v(97);if(now<(r.levelUntil||0))bonus+=v(48);
  if(direct||terminal){bonus+=v(5)+v(93)*Math.min(1,(p.armor||0)/120);if(dist<120)bonus+=v(50);if(r.barrier>0)bonus+=v(43);if(v(17)&&now>=(r.leechAt||0)){r.leechAt=now+.5;forgeHeal(s,p.maxhp*v(17)*.05*(p.healEffect||1));}}   /* v7.8.79 HP on Hit ติดจากลูกแตก Spark/ลูกบอล Taro ด้วย (คูลดาวน์ 0.5 วิเดิม) */
  if(direct&&!terminal){
    if(now-r.lastHit>=1.8)bonus+=v(26);r.lastHit=now;r.hitCount++;if(r.hitCount%3===0)bonus+=v(25);
    if(r.target!==e){r.target=e;r.sameHits=0;}r.sameHits++;bonus+=v(27)*Math.min(1,r.sameHits/8);
    if(now<(r.dashUntil||0)&&r.dashPrimed){bonus+=v(29);r.dashPrimed=false;}if(r.revenge){bonus+=Math.min(.5,r.revenge);r.revenge=0;}if(r.xpCharge){bonus+=v(46);r.xpCharge=false;}
    if(v(89)||v(90)||v(91)||v(92)){if(r.mark!==e||now>r.markUntil){r.mark=e;r.markUntil=now+6;r.markHits=0;}bonus+=v(89);if(++r.markHits>=8){bonus+=v(90);if(e.isBoss||e.isMini)forgeBarrier(s,p.maxhp*v(91));r.markHits=0;}}
    if(v(94)&&r.barrier>0&&now>=(r.spendBarrierAt||0)){r.spendBarrierAt=now+1;const spent=Math.min(r.barrier,p.maxhp*.04);r.barrier-=spent;bonus+=v(94)*spent/(p.maxhp*.04);}
    if(v(23)&&(e.isBoss||e.isMini||e.isElite)&&r.sameHits%8===0)forgeHeal(s,p.maxhp*v(23)*(p.healEffect||1));}
  return amount*(1+Math.min(FORGE_DMG_CAP,bonus));}
function forgeHurt(s,amount){const p=s.player,r=forgeState(s),v=n=>forgeValue(p,n)/100,now=s.elapsed||0;let reduction=0;if(amount>0)r.barHitAt=now;   /* v8.2.78 โดนตี (แม้โล่รับไว้) = หยุดเติมโล่ */
  reduction+=s.mode==='boss'||s.mode==='mini'?v(64):v(65);if(now<(r.dashUntil||0))reduction+=v(21);if(now<(r.brokenUntil||0))reduction+=v(71);
  if(v(66)&&amount>p.maxhp*.2&&now>=(r.cushionAt||0)){reduction+=v(66);r.cushionAt=now+6;}if(now-r.lastHurt>=5)reduction+=v(114);amount*=1-Math.min(FORGE_DR_CAP,reduction);
  if(r.barrierUntil<now)r.barrier=0;if(r.barrier>0){const absorbed=Math.min(amount,r.barrier);amount-=absorbed;r.barrier-=absorbed;if(r.barrier<=0){r.brokenUntil=now+2;r.breakHasteUntil=now+3;r.barLockUntil=now+FORGE_BARRIER_LOCK;}}
  if(amount>0){r.lastHurt=now;r.revenge=Math.min(.5,(r.revenge||0)+v(44)*amount/(p.maxhp*.1));if(amount>=p.hp&&v(115)&&!r.lastCrumbUsed){r.lastCrumbUsed=true;amount=Math.max(0,p.hp-1);}}return amount;}
function forgeCrit(s){const p=s.player,r=forgeState(s),now=s.elapsed||0;if(forgeValue(p,18)&&now>=(r.critBarrierAt||0)){r.critBarrierAt=now+.8;forgeBarrier(s,p.maxhp*forgeValue(p,18)/100);}}
function forgeKill(s,e){const p=s.player,r=forgeState(s),now=s.elapsed||0;r.kills++;if(r.kills%12===0)r.earnedUntil=now+4;if(e.isElite||e.isMini)r.eliteBonus=Math.min(.3,(r.eliteBonus||0)+forgeValue(p,98)/100/10);
  if(r.mark===e){forgeBarrier(s,p.maxhp*forgeValue(p,91)/100);r.mark=null;if(forgeValue(p,92)){let target=null,best=240;s.enemies?.children?.iterate(o=>{if(o?.active&&o!==e){const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<best){best=d;target=o;}}});if(target){r.mark=target;r.markHits=0;}}}if(r.target===e){r.target=null;r.sameHits=0;}}
function forgeXp(s,n){const r=forgeState(s);r.xp+=Math.max(0,n);if(r.xp>=20){r.xp%=20;r.xpCharge=true;}r.pickupUntil=(s.elapsed||0)+2;}
function forgeTick(s,dt){const p=s.player;if(!p||!p.forgeMods)return;const r=forgeState(s),now=s.elapsed||0;if(r.barrierUntil<now)r.barrier=0;
  const moving=p.body&&p.body.velocity&&Math.hypot(p.body.velocity.x,p.body.velocity.y)>25;if(moving&&forgeValue(p,68)&&now>=(r.moveBarrierAt||0)){r.moveBarrierAt=now+4;forgeBarrier(s,p.maxhp*forgeValue(p,68)/100);}
  if(now-r.lastHurt>=4&&forgeValue(p,19))forgeHeal(s,forgeValue(p,19)/10*dt*(p.healEffect||1));if(r.storedHeal>0&&p.hp<p.maxhp){const n=Math.min(r.storedHeal,p.maxhp*.05*dt);r.storedHeal-=n;forgeHeal(s,n,false);}}
function forgeCurrency(tier,mods){const pool=CURRENCY_DROP_POOLS[tier]||CURRENCY_DROP_POOLS.common,boost={transmute:130,alt:131,chaos:132};let total=0;const weighted=Object.entries(pool).map(([k,w])=>{const n=w*(1+Math.min(1,(mods&&mods[boost[k]]||0)/100));total+=n;return[k,n];});let r=Math.random()*total;for(const[k,w]of weighted){r-=w;if(r<0)return k;}return weighted[0][0];}
function forgeLootValue(s,n){return Math.min(.3,Math.max(0,(s._forgeLoot&&s._forgeLoot[n]||0)/100));}

AFFIX_POOL.forEach(expandAffixTiers); SPECIAL_AFFIX_POOL.forEach(expandAffixTiers);
// v6.67: prefix/suffix removed — every line is just a mod (pre/suf words kept for item names)
AFFIX_POOL.concat(SPECIAL_AFFIX_POOL).forEach(m=>{m.kind='mod';});
function affixTierForValue(mod,v){ if(!mod||!mod.tiers)return 5; for(let t=0;t<mod.tiers.length;t++){ if(v>=mod.tiers[t][0])return t; } return mod.tiers.length-1; }
// v8.0.87 เจ้าของ: mod ไม่ดีปนใน pool ตอน Add (~20%) · ค่าติดลบ ใช้ผลเดียวกับ mod ดีเลขเดียวกัน · อัปไม่ได้ · ลบต้องจ่าย Twist Cream
const FORGE_BAD_CHANCE=.2,FORGE_BAD_DEFS=[['b_dull','Dull',1,[-6,-4],'{v} all damage'],['b_frail','Frail',13,[-40,-25],'{v} Max HP'],['b_soft','Soft Shell',14,[-8,-5],'{v} armor'],['b_shaky','Shaky Aim',3,[-3,-2],'{v} crit chance'],['b_slow_prep','Slow Prep',57,[-10,-6],'{v} Unique cooldown speed'],['b_sour_cure','Sour Cure',63,[-15,-10],'{v} healing']].map(([id,label,number,band,eff])=>({id,label,number,bad:true,kind:'mod',row:'curse',group:'curse',category:'curse',emoji:'💀',pre:label,slots:['weapon','gloves','armor','boots','amulet','ring'],enabled:true,description:'A bad mod. Remove it in the Forge.',effect:eff,fmt:v=>(number===13||number===14?'−'+Math.abs(v):'−'+Math.abs(v)+'%'),tiers:[band.slice().sort((a,b)=>a-b)],apply:(p,v)=>forgeApply(p,number,v)}));
function allAffixDefs(){return AFFIX_POOL.concat(SPECIAL_AFFIX_POOL,FORGE_DEFS,FORGE_BAD_DEFS);}
function affixDef(id){return allAffixDefs().find(a=>a.id===id);}
// v7.8.67 เจ้าของ: หน้า Equipment บอกว่าแต่ละ mod ทำอะไร (Forge mod มี description ในแคตตาล็อกอยู่แล้ว)
const MOD_DESC={dmg:'More damage from every attack',crit:'Higher chance to land critical hits',critdmg:'Critical hits deal more damage',cd:'Skills recharge faster',bossdmg:'More damage to bosses and minibosses',laststand:'More damage while your HP is low',
  hp:'More maximum HP',def:'Take less damage from every hit',regen:'Recover HP every second',lifekill:'Heal a little on each kill',crisisguard:'Take less damage while your HP is low',spd:'Move faster',pick:'Pick up EXP and items from farther away',xp:'Gain more EXP',dash:'Dash recharges faster',
  edge:'Adds flat damage to every hit',precision:'More crit chance and faster skills',hppct:'More maximum HP (percent)',regenpct:'Recover a share of max HP every second',bulwark:'More HP and less damage taken',mend:'Healing restores more HP',sprint:'Move faster and dash more often',forager:'More EXP and a wider pickup range',
  sugarfind:'More Sugar from runs',boxfind:'More gear boxes drop',orbfind:'More crafting currency drops',uniquecd:'Your Unique skill recharges faster',wayfarer:'Move faster with a wider pickup range',stride:'More damage from every attack',reach:'Bigger attack areas',fleet:'Move faster',armorflat:'Flat armor that blocks damage',reaver:'Heal a little on each kill',nimble:'Move faster',ringhp:'More maximum HP',
  m_dashnova:'Dashing releases a damaging nova',m_critarc:'Critical hits arc to 2 nearby foes',m_killshell:'Kills build a shield that blocks one hit',m_stillfocus:'More damage while standing still',m_opener:'More damage to foes at full HP',m_thorns:'Getting hit blasts nearby foes (once per second)',
  vampiric:'Heal on every kill with no cooldown',berserk:'Much more damage, but you take more damage too',focus:'Skills recharge much faster, but less crit chance',gambler:'Critical hits deal much more damage',nourish:'Healing pickups restore more HP',
  area:'Bigger attack areas',bounce:'Projectiles bounce to one more foe',exec:'More damage while your HP is low',proj:'Fire one more projectile',uniq:'Your Unique skill recharges faster',revive:'Revive once when you would fall',boss:'More damage to bosses and minibosses'};
/* v7.9.5 เจ้าของเลือก A: mod แสดงบรรทัดเดียวเป็นภาษาบอกผล ({v} = ค่า fmt) · ไม่มีในตาราง = ชื่อ + ค่าแบบเดิม */
const MOD_EFFECT={'f_might': '{v} all damage (adds up)', 'f_rapid_rhythm': '{v} attack speed', 'f_precision': '{v} crit chance', 'f_deadly_sweet': '{v} crit damage', 'f_wide_recipe': '{v} attack area', 'f_lingering_flavor': '{v} damage over time', 'f_executioner': '{v} damage to enemies below 30% HP', 'f_opening_bite': '{v} damage to enemies above 90% HP', 'f_giant_slayer': '{v} damage to elites & bosses', 'f_vital_dough': '{v} max HP (all gear: up to +150)', 'f_hard_shell': '{v} armor', 'f_slow_recovery': '{v} regen', 'f_fresh_meal': '{v} max HP healed on kill', 'f_vampiric_bite': '{v} HP on hit', 'f_critical_barrier': 'Crits give a {v} shield', 'f_emergency_coating': '{v} damage reduction below 40% HP', 'f_dash_guard': '{v} damage reduction after a dash', 'f_dash_primer': '{v} damage on the first hit after a dash', 'f_steady_hands': '{v} damage while standing still', 'f_close_quarters': '{v} damage to nearby enemies', 'f_brittle_shell': '{v} damage to chilled or frozen enemies', 'f_last_bite': '{v} damage while you are below 40% HP', 'f_perfect_glaze': '{v} damage while you are above 90% HP', 'f_gathering_pace': 'Picking up EXP gives {v} move speed', 'f_growing_appetite': 'Level-ups give {v} damage for a while', 'f_distant_bite': '{v} damage to far enemies', 'f_quick_preparation': '{v} faster skill cooldown', 'f_efficient_recovery': '{v} healing received', 'f_boss_padding': '{v} damage reduction in boss fights (total cap 40%)', 'f_earned_edge': 'Kills stack up to {v} damage', 'f_second_course': 'Level-ups refund {v} of skill cooldown', 'f_last_crumb': 'Survive one lethal hit (once per run)', 'f_treasure_aroma': '{v} chance for extra gear drops', 'f_currency_sprinkles': '{v} chance for extra currency drops', 'f_boss_pantry': '{v} chance for a bonus currency parcel from bosses', 'f_quick_pull': '{v} loot pull speed', 'i_hp': '{v} max HP', 'i_dmg': '{v} damage', 'i_pick': '{v} pickup range', 'i_regen': '{v} HP regen per second', 'i_spd': '{v} move speed', 'i_def': '{v} damage taken', 'i_cd': '{v} skill cooldown', 'i_xp': '{v} EXP', 'i_crit': '{v} crit chance', 'i_critdmg': '{v} crit damage', 'i_boss': '{v} boss damage', 'i_lifekill': '{v} HP on kill', 'i_area': '{v} attack area', 'i_bounce': '{v} projectile bounce', 'i_exec': '{v} damage to low-HP enemies', 'i_proj': '{v} projectile', 'i_uniq': '{v} Unique cooldown', 'i_revive': '{v} revive per run'};
Object.assign(MOD_EFFECT,{'f_heavy_batter': '{v} hit damage, slower attacks', 'f_quiet_recovery': 'Heal over time after 4s unhurt ({v})', 'f_elite_rations': 'Every 8 hits on elites/bosses: heal {v} max HP', 'f_overflow_cream': 'Extra healing becomes a shield ({v})', 'f_third_beat': '{v} damage on every 3rd hit', 'f_patient_bite': '{v} damage after a 2s pause', 'f_single_serving': 'Up to {v} damage on the same enemy', 'f_mixed_recipe': '{v} damage per enemy status (max 3)', 'f_shielded_strike': '{v} damage while shielded', 'f_measured_revenge': 'Getting hit powers up your next hit', 'f_stored_sweetness': 'After EXP pickup: next hit {v} damage', 'f_point_blank': '{v} hit damage to very close enemies', 'f_focused_recipe': '{v} damage with 2 or fewer enemies near', 'f_crowd_appetite': 'Up to {v} damage when surrounded', 'f_barrier_capacity': '{v} bigger max shield', 'f_lasting_coating': '{v} longer shields', 'f_crowd_filter': '{v} less damage outside boss fights (total cap 40%)', 'f_impact_cushion': '{v} less damage from big hits (6s cooldown)', 'f_steady_shell': '{v} armor while standing still', 'f_moving_cover': 'Moving: shield of {v} max HP (every 4s)', 'f_broken_shell': '{v} less damage after your shield breaks', 'f_hunter_s_mark': '{v} damage to the enemy you keep hitting', 'f_cash_out': '{v} damage every 8th hit on one enemy', 'f_claimed_reward': 'Every 8 boss hits: shield of {v} max HP', 'f_heavy_recipe': 'Up to {v} hit damage from your armor', 'f_breaking_point': '{v} attack speed after your shield breaks', 'f_elite_lesson': 'Elite kills stack damage for the run ({v})', 'f_reliable_batter': 'Weapon damage rolls higher ({v})', 'f_clean_recipe': '{v} damage to enemies with no status (all gear: up to 20%)', 'f_first_hit_guard': '{v} less damage after 5s unhurt', 'f_twin_parcel': '{v} chance for a bonus gear drop', 'f_extra_pinch': '{v} chance for double currency pickups', 'f_elite_pockets': '{v} chance of extra currency from elites', 'f_medic_s_choice': 'Low HP: {v} chance elites drop a heal', 'f_fresh_storage': 'Healing at full HP is saved for later ({v})'});   // v8.1.29 เจ้าของ: mod อ่านเข้าใจยาก → ข้อความสั้นมีตัวเลขสำหรับ mod ที่เปิดใน v8.0.94
function modLine(d,v){if(!d)return '';const t=d.effect||MOD_EFFECT[d.id],f=typeof d.fmt==='function'?d.fmt(v):String(v??'');return t?t.replace('{v}',f):(d.label||'')+' '+f;}
function modDesc(d){if(!d)return '';{const t=d.effect||MOD_EFFECT[d.id];if(t){const x=t.replace(/\{v\}\s*/,'').replace(/\s+/g,' ').trim();return x.charAt(0).toUpperCase()+x.slice(1);}}if(d.description)return d.description;const k=String(d.id||'');return MOD_DESC[k]||MOD_DESC[k.replace(/^i_/,'')]||'';}

// v4.91: tier ดีสุดที่สุ่มได้ = iLv (1→T10, 100→T0) + ออฟเซ็ตตามเกรดฐาน · สุ่มในหน้าต่าง best…best+4 (ไม่ล็อกที่ tier เดียว)
const BASE_TIER_OFFSET={ start:6, common:2, rare:1, epic:1, legend:0, mythic:0, ancient:-1, divine:-1 };
function affixBestTierForItem(item,mod){const base=item&&GEAR_ALL.find(g=>g.id===item.baseId),grade=(item&&RAR_LINES[item.grade]!=null&&item.grade)||(base&&base.tier)||'common',lvl=Math.max(1,Math.min(100,(item&&item.itemLevel)||1));
  const levelBest=Math.max(0,Math.round(AFFIX_TIER_MAX-lvl/9));const count=(mod&&mod.tiers&&mod.tiers.length)||11;return Math.min(count-1,Math.max(Math.round((levelBest+(BASE_TIER_OFFSET[grade]??3))*(count-1)/10),(mod&&mod.bestTier)||0));}
// v4.29: เติมช่องว่าง — common/magic ใช้ Spark Sugar (transmute, ได้บ่อย) · rare ใช้ Wish Candy (exalt) · reroll ช่องเดิม: rare=Wild Jam, magic=Twist Cream
function craftCurrencyForLine(line){return 'transmute';}
// สุ่ม tier ระหว่าง best..5 · ถ่วงให้ tier แย่เจอบ่อย (T1 หายาก = loot chase)
// iLv มีผลกับ Tier ที่ออก: แบ่งช่วงละ 10 เลเวล (step 0..9) → ยิ่ง iLv สูง bias ยิ่งลด = tier แย่ (t สูง) ถูกถ่วงน้อยลง = tier ดีออกบ่อยขึ้น
// v4.92: สุ่มได้ทุก tier ตั้งแต่ best ถึง T10 เสมอ · 5 ขั้นแรกจาก best ถ่วง (d+1)^1.3 · ต่ำกว่านั้นหางลดลง ×0.7/ขั้น (T10 ออกได้ทุก iLv)
function tierWeights(best,max=AFFIX_TIER_MAX){ const out=[]; const peak=Math.pow(5,1.3); for(let t=best;t<=max;t++){ const d=t-best; out.push([t,d<=4?Math.pow(d+1,1.3):peak*Math.pow(0.7,d-4)]); } return out; }
function tierChances(best,max=AFFIX_TIER_MAX){ const w=tierWeights(best,max),tot=w.reduce((s,x)=>s+x[1],0),o={}; w.forEach(([t,v])=>o[t]=v/tot); return o; }
function rollTier(best,ilvl,max=AFFIX_TIER_MAX){ const list=tierWeights(best,max); let tot=0; for(const x of list)tot+=x[1]; let r=Math.random()*tot; for(const [t,w] of list){ r-=w; if(r<=0)return t; } return max; }
// v5.42 🔒 Tier lock: ถ้าล็อคไว้กับ mod นี้ → tier ที่ออกต้องดีเท่ากับหรือดีกว่า lock (ตัวเลขน้อย = ดี)
function rollOneAffixLocked(mod,best,ilvl,lock){ if(!lock||lock.id!==mod.id)return rollOneAffix(mod,best,ilvl);
  const list=tierWeights(best,mod.tiers.length-1).filter(([t])=>t<=Math.max(best,lock.t)); let tot=0; for(const x of list)tot+=x[1]; let r=Math.random()*tot,t=list.length?list[list.length-1][0]:best; for(const [tt,w] of list){ r-=w; if(r<=0){t=tt;break;} }
  const band=mod.tiers[t]||mod.tiers[mod.tiers.length-1]; return {id:mod.id,t,v:band[0]+Math.floor(Math.random()*(band[1]-band[0]+1)),t11:1,tierSchema:2}; }
function rollOneAffix(mod,best,ilvl){ const t=rollTier(best,ilvl,mod.tiers.length-1), band=mod.tiers[t]||mod.tiers[mod.tiers.length-1]; const v=band[0]+Math.floor(Math.random()*(band[1]-band[0]+1)); return {id:mod.id,t,v,t11:1,tierSchema:2}; }
function affixCountCap(itemLevel){const l=Math.max(1,Number(itemLevel)||1);return l<12?1:l<25?2:3;}   // iLv12 unlocks Sustain; iLv25 unlocks Play.
function rollAffixes(baseTier,itemLevel=1,base=null){const L0=Math.max(1,Number(itemLevel)||1),n=GEAR_SIMPLE?Math.min(AFFIX_COUNT[baseTier]||0,3):Math.min(AFFIX_COUNT[baseTier]||0,affixCountCap(itemLevel),L0<12?0:L0<25?1:L0<45?2:3,3),item={baseId:base&&base.id,slot:base&&base.slot||'weapon',grade:baseTier,itemLevel,affixes:[]};for(let line=0;line<n;line++){const mod=pickWeightedMod(forgePool(item,line));if(mod)item.affixes.push(Object.assign(rollOneAffix(mod,affixBestTierForItem(item,mod),itemLevel),{line}));}return item.affixes;}
// ชื่อไอเทมแบบ PoE: [prefix ดีสุด] ฐาน [suffix ดีสุด]
function gearAffixName(baseName,affs){ return baseName;   // v7.8.94 เจ้าของ: ชื่อของ = ชื่อฐาน (mod อยู่ในรายการด้านล่างแล้ว)
  if(!affs||!affs.length)return baseName;
  const best=(k)=>{ let b=null; for(const a of affs){ if(!a)continue; const d=affixDef(a.id); if(d&&d[k]&&(!b||a.t<b.t))b=a; } return b?affixDef(b.id):null; };
  const pre=best('pre'), suf=best('suf');
  return (pre&&pre.pre?pre.pre+' ':'')+baseName+(suf&&suf.suf?' '+suf.suf:''); }


// Single-screen Forge geometry in logical CSS pixels.
function forgeLayout(w,h){   // v8.0.83 Simple Forge: หัว · แถวช่องสวมใส่ · การ์ดสรุป · การ์ดแถว mod 3 แถว
 const land=w>h,small=h<680,p=w<350?12:14,box=(x,y,w,h)=>({x,y,w,h});
 if(land){const header=box(p,8,w-2*p,40),y=54,bot=h-10,lw=Math.floor((w-3*p)*.40),rx=2*p+lw,mods=box(rx,y,w-p-rx,bot-y);return{w,h,pad:p,small:true,landscape:true,header,slots:null,summary:box(p,y,lw,Math.min(120,bot-y)),mods,rowH:Math.max(44,Math.min(72,Math.floor((mods.h-30-22-12)/3)))};}
 const bw=Math.min(w-2*p,460),x=Math.round((w-bw)/2);let y=8;const header=box(p,y,w-2*p,small?44:48);y+=header.h+(small?4:8);
 const slots=box(x,y,bw,small?36:44);y+=slots.h+(small?6:10);const summary=box(x,y,bw,small?74:86);y+=summary.h+(small?8:12);
 const mods=box(x,y,bw,h-y-(small?8:14));return{w,h,pad:p,small,landscape:false,header,slots,summary,mods,rowH:Math.max(52,Math.min(84,Math.floor((mods.h-30-26-16)/3)))};
}
function forgeTierRange(mod,a){
 if(!mod||!a||!mod.tiers)return'—';const t=Math.max(0,Math.min(mod.tiers.length-1,a.t??10)),b=mod.tiers[t];if(!b)return'—';
 const f=v=>String(mod.fmt?mod.fmt(v):v).replace(/^\+/,''),lo=f(b[0]),hi=f(b[1]);return tierStarText(mod,t)+' ('+(lo===hi?lo:lo+'–'+hi)+')';
}
function forgeTierLabel(mod,a){return forgeTierRange(mod,a).split(' ')[0];}
function forgePreviewTier(item,line,mod){
 const old=forgeLines(item)[line],od=old&&affixDef(old.id);return old?Math.round((old.t??10)/Math.max(1,(od?.tiers.length||11)-1)*(mod.tiers.length-1)):affixBestTierForItem(item,mod);
}
const FORGE_SHORT_EFFECTS={1: "Damage", 2: "Attack speed", 3: "Crit chance", 4: "Crit damage", 5: "Heavy hits / slow", 6: "Attack area", 7: "Damage over time", 10: "Low-HP foes", 11: "Full-HP foes", 12: "Boss / elite damage", 13: "Max HP", 14: "Armor", 15: "HP regen / sec", 16: "HP on kill", 17: "HP on hit", 18: "Barrier on crit", 19: "Safe HP regen", 20: "Low-HP guard", 21: "Guard after dash", 23: "Boss-hit healing", 24: "Overheal barrier", 25: "Every 3rd hit", 26: "Hit after pause", 27: "Same-target hits", 29: "Hit after dash", 31: "Still damage", 32: "Nearby damage", 33: "Frozen-foe damage", 35: "Damage per status", 41: "Low-HP damage", 42: "Full-HP damage", 43: "Barrier damage", 44: "Revenge hit", 45: "EXP move speed", 46: "EXP charged hit", 48: "Level-up damage", 49: "Far-foe damage", 50: "Close-hit damage", 52: "Few-foe damage", 53: "Crowd damage", 57: "Active cooldown", 61: "Barrier cap", 62: "Barrier duration", 63: "Healing boost", 64: "Boss guard", 65: "Normal-foe guard", 66: "Heavy-hit guard", 67: "Still armor", 68: "Moving barrier", 71: "Barrier-break guard", 89: "Mark damage", 90: "Mark burst", 91: "Marked-kill barrier", 92: "Mark transfer", 93: "Armor → damage", 94: "Barrier → damage", 95: "Barrier-break speed", 96: "Barrier crit chance", 97: "Kill damage stacks", 98: "Elite damage stacks", 100: "Level-up cooldown", 101: "Min attack damage", 108: "No-status damage", 114: "First-hit guard", 115: "Survive once", 117: "Extra gear chance", 118: "Extra currency chance", 119: "Double gear chance", 120: "Extra currency unit", 121: "Elite currency", 122: "Boss currency", 130: "More Spark", 131: "More Cream", 132: "More Jam", 133: "More Glaze", 139: "Faster loot pickup", 142: "Low-HP heal drops", 143: "Store spare heals"};
function forgeShortEffect(mod){return FORGE_SHORT_EFFECTS[mod.number]||mod.label;}
function forgeFamilyLabel(g){const labels={target_farming:'Target farm',quantity:'Drops',quality:'Quality',economy:'Economy',collection:'Pickup',exploration:'Explore'};return labels[g]||String(g||'').replace(/_/g,' ').replace(/^./,c=>c.toUpperCase());}
const FORGE_UI_FRAMES={primary:[39,145,326,156],secondary:[387,145,327,155],choice:[734,145,332,156],equipped:[1101,174,309,103],chip:[38,478,328,113],chip_on:[385,478,329,113],panel:[737,395,334,274],panel_on:[1090,395,330,274],odds:[97,789,227,213],target:[417,759,267,271],auto:[791,786,221,212],info:[1141,782,227,228]};

/* ---- CURRENCY (Phase 2): คราฟต์ affix ของไอเทม แบบ Path of Exile ---- */
const CRAFT_AFFIX_CAP = {common:3,magic:3,rare:3};   // v6.67: 3 mod lines (was 3 prefix + 3 suffix)   // v6.55.33: every item can craft 3 prefix + 3 suffix · power limited by tier (iLv)
const AFFIX_KIND_MAX=3;
function sortAffixesByKind(affs){return affs.slice().sort((a,b)=>(a.line??0)-(b.line??0));}
const RARITY_LABEL = { common:{name:'Common',color:'#c7bdd6'}, magic:{name:'Magic',color:'#7fb0ff'}, rare:{name:'Rare',color:'#ffd166'} };
function baseDefaultRarity(baseTier){ if(baseTier==='start')return 'common'; if(baseTier==='common')return 'magic'; return 'rare'; }
const CURRENCY = [
  {key:'transmute',emoji:'🟢',asset:'currency_twist_cream',name:'Twist Cream',desc:'Forge: add or remove a mod · upgrade the mods in rows 1–3'},
  /* v8.1.84 เจ้าของ (League phase 5 · Reforge): อัปเกรดใช้สกุลเงินตามแถว · เพิ่ม/ลบ ใช้ Twist Cream ทุกแถว · Recipe Ink ย้าย mod ไปอีกชิ้น · ยังไม่มีอาร์ตไอคอน → ใช้ภาพกลาง + ย้อมสี */
  /* v8.2.52 เจ้าของ (ECRS · S): Berry Jam + Honey Drop รวมเข้า Twist Cream (CUR_ALIAS) · เซฟเก่าแลก 1 → 2 */
  {key:'starsugar',emoji:'⭐',asset:'currency_wish_candy',tint:0xc3a6ff,name:'Star Sugar',desc:'Forge: upgrade the mods in rows 4–6'},
  {key:'recipeink',emoji:'🖋️',asset:'currency_recipe_ink',tint:0x7fd8ff,name:'Recipe Ink',desc:'Forge: move one mod to an empty row on another item'},   // v7.8.88 Spark Sugar/Twist Cream/Wild Jam รวมเป็นตัวเดียว
];   // v8.0.83 Crystal Glaze (divine) เลิกใช้ → เซฟเก่าแลก 1 → 3 Twist Cream (_glazeMig) · ของที่ยังให้ divine = Twist Cream
const CUR_ALIAS={berryjam:'transmute',honeydrop:'transmute',divine:'transmute',exalt:'transmute',regal:'transmute',annul:'transmute',scour:'transmute',alt:'transmute',chaos:'transmute'};
function curKey(k){ return CUR_ALIAS[k]||k; }
function currencyDef(k){ k=curKey(k); return CURRENCY.find(c=>c.key===k); }
// v4.30: flame-sand แบบ Torchlight — reroll ค่าของ mod ที่เลือก ใช้ได้ทุก rarity แต่ "ผลาญเยอะ" (เผา 3 ต่อครั้ง)
const FLAME_REROLL_COST = 1;
// v7.8.84 ราคา Glaze ต่อการอัป 1 ขั้น: ขั้นยิ่งดียิ่งแพง (T10→9 = 1 … T1→0 = 10)
function forgeAdvOpen(){ const d=(typeof Save!=='undefined'&&Save.data)||{}; return d.stageMastery==null||!!d.stageMastery[4]||(d.unlockedStage||0)>=5; }   // v7.8.96 Tier +1 / Auto-roll เปิดหลังจบ Chapter 1 (ไม่มีเซฟ = เปิด สำหรับเทส)
function forgeGlazeCost(a){return Math.max(1,11-Math.max(1,a&&a.t!=null?a.t:10));}
// v8.0.83 Simple Forge (เจ้าของ 1 พ.ย. · docs/FORGE_SIMPLE.md): 2 ท่า — Add (เลือก 1 ใน 3) / Upgrade ★ · ไม่มี Forge Points · สกุลเงินเดียว Twist Cream
// ราคาต่อครั้งบนชิ้นนั้น = 1 + floor(crafts/2) · Merge รีเซ็ต crafts · item.fp ในเซฟเก่าไม่ใช้แล้ว
const FORGE_DROP_MUL=.5;
function forgePrice(item){return 1+Math.floor(Math.max(0,Number(item&&item.crafts)||0)/4);}
function forgeRowCur(line){return line<=2?'transmute':'starsugar';}   // v8.1.84 เจ้าของ: อัปเกรดแต่ละแถวใช้สกุลต่างกัน
function forgeUpPrice(item,line){return line<=0?forgePrice(item):1+Math.floor(Math.max(0,Number(item&&item.crafts)||0)/6);}
const FORGE_MOVE_COST=1;   // v8.1.29 เจ้าของ: Twist Cream ไม่พอ · ราคาขึ้นช้าลง (เดิม /2)
function forgeNextStarLevel(item,mod){const cap=forgeStarCap(item,mod);for(let l=Math.max(1,Number(item&&item.itemLevel)||1)+1;l<=100;l++)if(forgeStarCap(Object.assign({},item,{itemLevel:l}),mod)>cap)return l;return 0;}
function forgeStarCapText(item,mod){const n=forgeNextStarLevel(item,mod);return 'Max Lv '+forgeStarCap(item,mod)+' at iLv '+(Number(item&&item.itemLevel)||1)+(n?' · next at iLv '+n:'');}
function tierForStar(mod,s){const n=(mod&&mod.tiers&&mod.tiers.length)||11;for(let t=0;t<n;t++)if(tierStars(mod,t)===s)return t;return n-1;}
function forgeStarCap(item,mod){return tierStars(mod,affixBestTierForItem(item,mod));}
function makeAffixAtStar(item,mod,s){const t=Math.max(affixBestTierForItem(item,mod),tierForStar(mod,Math.min(s,forgeStarCap(item,mod)))),b=mod.tiers[t]||mod.tiers[mod.tiers.length-1];return {id:mod.id,t,v:b[0]+Math.floor(Math.random()*(b[1]-b[0]+1)),t11:1,tierSchema:2};}
// ราคา currency เป็น Sugar (ซื้อ = Fullราคา · ขาย = 60%)
const CURRENCY_BUY = { transmute:110, alt:110, regal:120, chaos:110, exalt:120, scour:30, annul:90, berryjam:180, honeydrop:260, starsugar:420, recipeink:320 };   // v8.1.84 ราคาใหม่ใช้แค่ตอนขาย (ร้านไม่ขายสกุลใหม่)   // v6.79 merged keys share a price
// ราคากล่องสุ่ม currency = ค่าเฉลี่ยราคาขายใหม่ (90%) ตามน้ำหนักสุ่มจริง
let _bazBoxCost=0; function bazaarCurrencyBoxCost(){ if(_bazBoxCost)return _bazBoxCost; let t=0; const N=6000; for(let i=0;i<N;i++){const k=rollWeightedCurrency('common')||'alt';t+=(CURRENCY_BUY[k]||60)*0.9;} _bazBoxCost=Math.max(10,Math.round(t/N/5)*5); return _bazBoxCost; }
// One active Sugar Order: the reward is earned by clearing a regular stage, scaled by DIFFS[].reward.
// Weighted reward pools. Values are percentages within a successful currency drop.
const CURRENCY_DROP_POOLS = {
  common:{transmute:100},rare:{transmute:98,recipeink:2},epic:{transmute:97,recipeink:3},legend:{transmute:89,starsugar:7,recipeink:4},   // v8.2.52 ECRS: Jam/Honey รวมเข้า Twist Cream
};
function rollWeightedCurrency(tier){
  const pool=CURRENCY_DROP_POOLS[tier]||CURRENCY_DROP_POOLS.common;
  let roll=Math.random()*100;
  for(const key of Object.keys(pool)){roll-=pool[key];if(roll<0)return key;}
  return Object.keys(pool)[0];
}
// ราคาซื้อของฐานตาม tier
const GEAR_BUY = { start:0, common:160, rare:420, epic:820, legend:0 };
// เมล็ดสุ่มรายวัน (ร้านหมุนเวียน) — mulberry32
// v5.51: ของตกแต่งพื้นแบบ chunk (ภาพล้วน ไม่มีการชน · วาดเฉพาะรอบจอ · seed เดิม = ของเดิมที่เดิม)
// อาร์ตจริง: ใส่ไฟล์ใน ASSET_IMAGES ด้วย key เดียวกัน (โปร่งใส ~128px) → placeholder ถูกข้ามเอง · ดู docs/ART_ORDER_C2_1_MAP.md
// v5.55 Bear Beat Rush (Cocoa Unique) — หมัด 4 แบบ · สี=จับคู่เร็ว · dx/dy = ตำแหน่งปุ่มแบบกากบาท
const DECOR_CHUNK=560;
const FLOOR_KEYS={5:'floor_c21',6:'floor_c22',7:'floor_c23',8:'floor_c24',9:'floor_c25',10:'floor_c31',11:'floor_c32',12:'floor_c33',13:'floor_c34',14:'floor_c35'};
const STAGE_DECOR={
  5:{seed:501,per:[4,7],clearR:170,items:[
    {key:'dec_c21_mushroom',emoji:'🍄',size:70,w:6,base:0x2a6b4f},
    {key:'dec_c21_moss',emoji:'🌿',size:62,w:7,base:0x1f5a44},
    {key:'dec_c21_leaf',emoji:'🍂',size:46,w:7,rot:true},
    {key:'dec_c21_puddle',draw:'puddle',size:120,w:4,col:0x5ee8c0},
    {key:'dec_c21_jar',emoji:'🫙',size:54,w:2,base:0x3a2f24},
    {key:'dec_c21_spore',emoji:'✨',size:36,w:3,glow:true},
    {key:'dec_c21_root',draw:'root',size:130,w:3,col:0x5a3d2b},
    {key:'dec_c21_flower',emoji:'🌼',size:40,w:4} ]},
  6:{seed:602,per:[4,7],clearR:170,items:[
    {key:'dec_c22_mushroom_cluster',emoji:'🍄',size:80,w:5},
    {key:'dec_c22_mycel_web',emoji:'🕸️',size:112,w:5,rot:true},
    {key:'dec_c22_bog_puddle',draw:'puddle',size:120,w:4,col:0x278c83},
    {key:'dec_c22_spore_puff',emoji:'✨',size:50,w:3},
    {key:'dec_c22_reed',emoji:'🌾',size:72,w:6},
    {key:'dec_c22_lilypad',emoji:'🪷',size:88,w:5,rot:true},
    {key:'dec_c22_bone_twig',emoji:'🦴',size:90,w:3,rot:true},
    {key:'dec_c22_glow_cap',emoji:'🍄',size:54,w:4} ]},
  7:{seed:707,per:[4,7],clearR:170,items:[
    {key:'dec_c23_comb_chunk',size:72,w:5},
    {key:'dec_c23_honey_drip',size:76,w:4},
    {key:'dec_c23_wax_puddle',size:100,w:4},
    {key:'dec_c23_pollen',size:46,w:3},
    {key:'dec_c23_petal',size:65,w:5,rot:true},
    {key:'dec_c23_dead_bee_shell',size:75,w:3},
    {key:'dec_c23_flower_bud',size:78,w:4},
    {key:'dec_c23_jelly_blob',size:56,w:3} ]},
  8:{seed:808,per:[4,7],clearR:170,items:[
    {key:'dec_c24_spring_petals',size:72,w:5},
    {key:'dec_c24_summer_grass',size:76,w:4},
    {key:'dec_c24_autumn_leaves',size:100,w:4,rot:true},
    {key:'dec_c24_winter_frost',size:46,w:3},
    {key:'dec_c24_broken_pot',size:65,w:5},
    {key:'dec_c24_glass_shard',size:75,w:3,rot:true},
    {key:'dec_c24_vine',size:78,w:4},
    {key:'dec_c24_lamp',size:56,w:3} ]},
  9:{seed:909,per:[4,7],clearR:170,items:[
    {key:'dec_c25_root_knot',size:72,w:5},
    {key:'dec_c25_crown_thorn',size:76,w:4},
    {key:'dec_c25_purple_crystal',size:100,w:4},
    {key:'dec_c25_root_puddle',size:46,w:3},
    {key:'dec_c25_skull_nut',size:65,w:5},
    {key:'dec_c25_rune_stone',size:75,w:3},
    {key:'dec_c25_vine_curl',size:78,w:4},
    {key:'dec_c25_glow_bulb',size:56,w:3} ]},
  10:{seed:1010,per:[4,7],clearR:170,items:[
    {key:'dec_c31_ash_pile',size:72,w:5},
    {key:'dec_c31_burnt_stalk',size:76,w:4},
    {key:'dec_c31_ember_seed',size:100,w:4},
    {key:'dec_c31_cracked_soil',size:46,w:3},
    {key:'dec_c31_scorch_mark',size:65,w:5},
    {key:'dec_c31_scarecrow_scrap',size:75,w:3},
    {key:'dec_c31_stone',size:78,w:4},
    {key:'dec_c31_smoke_wisp',size:56,w:3} ]},
  11:{seed:1111,per:[4,7],clearR:170,items:[
    {key:'dec_c32_hollow_apple',size:72,w:5},
    {key:'dec_c32_fallen_leaves',size:76,w:4},
    {key:'dec_c32_dead_branch',size:100,w:4,rot:true},
    {key:'dec_c32_core_seed',size:46,w:3},
    {key:'dec_c32_worm_hole',size:65,w:5},
    {key:'dec_c32_basket',size:75,w:3},
    {key:'dec_c32_fruit_rot',size:78,w:4},
    {key:'dec_c32_twig_bundle',size:56,w:3,rot:true} ]},
  12:{seed:1212,per:[4,7],clearR:170,items:[
    {key:'dec_c33_glass_shard',size:72,w:5,rot:true},
    {key:'dec_c33_frame_piece',size:76,w:4},
    {key:'dec_c33_sprout',size:100,w:4},
    {key:'dec_c33_pot_shard',size:46,w:3},
    {key:'dec_c33_crystal_moss',size:65,w:5},
    {key:'dec_c33_puddle_reflect',size:75,w:3},
    {key:'dec_c33_pipe',size:78,w:4},
    {key:'dec_c33_gear',size:56,w:3} ]},
  13:{seed:1313,per:[4,7],clearR:170,items:[
    {key:'dec_c34_vault_tile',size:72,w:5},
    {key:'dec_c34_seed_pod',size:76,w:4},
    {key:'dec_c34_gold_rune',size:100,w:4},
    {key:'dec_c34_chain',size:46,w:3,rot:true},
    {key:'dec_c34_lock',size:65,w:5},
    {key:'dec_c34_dust_pile',size:75,w:3},
    {key:'dec_c34_pillar_stub',size:78,w:4},
    {key:'dec_c34_sealed_jar',size:56,w:3} ]},
  14:{seed:1414,per:[4,7],clearR:170,items:[
    {key:'dec_c35_gold_root',size:72,w:5},
    {key:'dec_c35_crown_shard',size:76,w:4},
    {key:'dec_c35_violet_crystal',size:100,w:4},
    {key:'dec_c35_seed_glow',size:46,w:3},
    {key:'dec_c35_throne_step',size:65,w:5},
    {key:'dec_c35_banner_scrap',size:75,w:3,rot:true},
    {key:'dec_c35_candle',size:78,w:4},
    {key:'dec_c35_halo_ring',size:56,w:3,rot:true} ]}
};
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function bazaarDaySeed(){ const d=new Date(); return d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate(); }

/* ---- ระบบได้รับอุปกรณ์: ดWaitปในStage (common) + เปิดกล่องสุ่ม/gacha (find rare) · ยกเลิกการซื้อ ---- */
// R8: Unique — ของเปลี่ยน build (แลกข้อเสีย) · ดรอปเฉพาะบอสรัน Recipe ของธีมที่กำหนด · tier legend + unique:true (ไม่อยู่ใน pool สุ่มปกติ)
const UNIQUE_GEAR={
  weapon:{ id:'uq_glass_pin', chapter:5, tier:'legend', unique:true, themes:[0,5,10], emoji:'🥖', name:'Glass Rolling Pin', cost:0, enh:true, desc:'UNIQUE · +80% damage · but -45% max HP', apply:(p,lv)=>{p.dmgMul+=(1.80+0.04*lv)-1;p._uqGlass=0.55;} },
  ring:{ id:'uq_hunger_ring', chapter:5, tier:'legend', unique:true, themes:[1,6,11], emoji:'💍', name:'Ring of Endless Hunger', cost:0, enh:true, desc:'UNIQUE · heal 3 HP per kill · Story on-kill recovery cap 3% HP/s · no regeneration', apply:(p,lv)=>{p.lifesteal=(p.lifesteal||0)+3+lv*0.5;p._uqNoRegen=true;} },
  boots:{ id:'uq_rush_boots', chapter:5, tier:'legend', unique:true, themes:[2,7,12], emoji:'👟', name:'Sugar Rush Boots', cost:0, enh:true, desc:'UNIQUE · +30% move speed · +15% damage · but take 20% more damage', apply:(p,lv)=>{p.baseSpeed*=1.30;p.dmgMul+=(1.15+0.02*lv)-1;p.dmgTakenMul*=1.20;} },
  amulet:{ id:'uq_echo_locket', chapter:5, tier:'legend', unique:true, themes:[3,8,13], emoji:'📿', name:'Echo Locket', cost:0, enh:true, desc:'UNIQUE · critical hits explode for 45% damage nearby · +8% crit', apply:(p,lv)=>{p.critChance+=0.08;p._uqCritBurst=0.45+0.03*lv;} },
  armor:{ id:'uq_candy_shell', chapter:5, tier:'legend', unique:true, themes:[4,9,14], emoji:'🛡️', name:'Candy Shell Plate', cost:0, enh:true, desc:'UNIQUE · take 35% less damage · but deal 20% less damage', apply:(p,lv)=>{p.dmgTakenMul*=0.65-0.01*lv;p.dmgMul+=(0.80)-1;} },
  // v6.13 (B8): Unique ที่เปลี่ยน build เพิ่ม 7 ชิ้น
  weapon2:{ slot:'weapon', id:'uq_twin_whisk', chapter:5, tier:'legend', unique:true, themes:[1,7,13], emoji:'🥄', name:'Twin Whisk', cost:0, enh:true, desc:'UNIQUE · attack 25% faster · but deal 15% less damage', apply:(p,lv)=>{p.cdMul*=0.75-0.01*lv;p.dmgMul+=(0.85)-1;} },
  gloves:{ slot:'gloves', id:'uq_spice_mitts', chapter:5, tier:'legend', unique:true, themes:[2,5,14], emoji:'🧤', name:'Ember Spice Mitts', cost:0, enh:true, desc:'UNIQUE · 25% of hits ignite · counts as 🔥 fire', apply:(p,lv)=>{p._tagIgnite=Math.max(p._tagIgnite||0,0.25+0.01*lv);} },
  boots2:{ slot:'boots', id:'uq_frost_treads', chapter:5, tier:'legend', unique:true, themes:[3,9,11], emoji:'🥾', name:'Frostbite Treads', cost:0, enh:true, desc:'UNIQUE · 20% of hits freeze · but -10% move speed', apply:(p,lv)=>{p._tagChill=Math.max(p._tagChill||0,0.20+0.01*lv);p.baseSpeed*=0.90;} },
  ring2:{ slot:'ring', id:'uq_lucky_charm', chapter:5, tier:'legend', unique:true, themes:[0,6,12], emoji:'🍀', name:'Four-Leaf Gummy', cost:0, enh:true, desc:'UNIQUE · +12% crit chance · but -25% crit damage', apply:(p,lv)=>{p.critChance+=0.12+0.005*lv;p.critMul=(p.critMul||1.55)-0.25;} },
  amulet2:{ slot:'amulet', id:'uq_dash_heart', chapter:5, tier:'legend', unique:true, themes:[4,8,10], emoji:'💨', name:'Whirlwind Heart', cost:0, enh:true, desc:'UNIQUE · +50% damage for 2s after a Dash', apply:(p,lv)=>{p._cond=p._cond||{};p._cond.c_dash=(p._cond.c_dash||0)+2;} },
  armor2:{ slot:'armor', id:'uq_rage_apron', chapter:5, tier:'legend', unique:true, themes:[0,7,14], emoji:'😤', name:'Rage Apron', cost:0, enh:true, desc:'UNIQUE · up to ×2 damage as HP drops · but -15% max HP', apply:(p,lv)=>{p._tdBerserk=true;p._uqGlass=0.85;} },
  gloves2:{ slot:'gloves', id:'uq_giant_gloves', chapter:5, tier:'legend', unique:true, themes:[3,6,12], emoji:'🥊', name:'Bossbreaker Gloves', cost:0, enh:true, desc:'UNIQUE · +45% damage vs elites & bosses · but -10% move speed', apply:(p,lv)=>{p._cond=p._cond||{};p._cond.c_boss=(p._cond.c_boss||0)+3;p.baseSpeed*=0.90;} }
};
for(const _s in UNIQUE_GEAR){const _u=UNIQUE_GEAR[_s],_k=_u.slot||_s;if(GEAR[_k])GEAR[_k].push(_u);}
function uniqueForTheme(t){ return Object.values(UNIQUE_GEAR).filter(u=>u.themes.includes(t)); }
const GEAR_ALL=[];for(const _s in GEAR)for(const _it of GEAR[_s])GEAR_ALL.push(Object.assign({slot:_s,craftTags:[_s,'chapter_'+(_it.chapter||1),_it.tier]},_it));
const ITEM_LEVEL_BANDS=[
  {chapter:1,min:1,max:20,bestAffixTier:4,label:'Pantry'},
  {chapter:2,min:21,max:40,bestAffixTier:4,label:'Rotten Drain'},
  {chapter:3,min:41,max:60,bestAffixTier:3,label:'Chili Engine'},
  {chapter:4,min:61,max:80,bestAffixTier:2,label:'Sugar Freezer'},
  {chapter:5,min:81,max:100,bestAffixTier:1,label:'Crown Oven'},
];
function clampItemChapter(ch){return Math.max(1,Math.min(5,Math.floor(Number(ch)||1)));}
// v4.71: 3 Chapter story → iLv 1-60 (band 1-3) · band 4-5 (iLv 61-100) = Endgame เท่านั้น
//   ด่าน s (0..14) เริ่ม iLv 1+4s → Ch1 ≈1-26 · Ch2 ≈21-46 · Ch3 ≈41-60 (เดิม stage+1 = ด่าน 5 ก็ได้ iLv 81-100 แล้ว)
const STORY_ILVL_MAX=60, ENDGAME_ILVL_MIN=61;
function storyItemLevelBase(stageIndex){return Math.min(STORY_ILVL_MAX,1+Math.max(0,Number(stageIndex)||0)*4);}
function itemChapterForStage(stageIndex){return itemChapterFromLevel(storyItemLevelBase(stageIndex));}
function currentItemChapter(){return itemChapterForStage((Save.data&&Save.data.unlockedStage)||0);}
function itemChapterFromLevel(ilvl){return Math.max(1,Math.min(5,Math.ceil(Math.max(1,Number(ilvl)||1)/20)));}
function rollItemLevel(stageIndex,difficulty=1,rng=Math.random){const d=Math.max(1,Math.min(3,Number(difficulty)||1));return Math.min(STORY_ILVL_MAX,storyItemLevelBase(stageIndex)+(d-1)*3+Math.floor(rng()*6));}   // กฎเหล็ก: ยาก/นรก +3/+6 iLv
// Endgame (Boss Rush / Endless / Zone Modifiers หลังจบเนื้อเรื่อง) = iLv 61-100 · ยิ่งยาก/ยิ่งลึก ยิ่งสูง
function rollEndgameItemLevel(difficulty=1,depth=0,rng=Math.random){const d=Math.max(1,Math.min(3,Number(difficulty)||1));return Math.min(100,ENDGAME_ILVL_MIN+(d-1)*8+Math.min(24,Math.max(0,depth))+Math.floor(rng()*6));}
function storyComplete(){const m=(Save.data&&Save.data.stageMastery)||{};let last=-1;for(let i=0;i<STAGES.length;i++)if(isStageReady(i))last=i;return last>=0&&!!m[last];}
// รางวัลนอกด่าน (gacha/forge/menu drop) = ตามหลังความคืบหน้า 1 ด่าน + ยาก normal → ผ่านด่าน 1 จะไม่กระโดดไป Chapter 2 ทันที
function rewardSourceStage(){return Math.max(0,((Save.data&&Save.data.unlockedStage)||0)-1);}
function currentRewardItemLevel(rng=Math.random){return rollItemLevel(rewardSourceStage(),1,rng);}
function gearBaseStats(item){
  const base=item&&GEAR_ALL.find(g=>g.id===item.baseId);if(!base||base.tier==='start')return{attackMin:0,attackMax:0,armor:0,hp:0,crit:0,critDmg:0,speed:0,dashCd:0,skillCd:0};
  const level=Math.max(1,Math.min(100,Number(item.itemLevel)||1)),quality=({common:1,rare:1.12,epic:1.24,legend:1.4,mythic:1.6,ancient:1.8,divine:2})[gearGrade(item)]||1;
  let seed=0;for(const c of base.id)seed=(seed*31+c.charCodeAt(0))>>>0;const variation=1+(seed%9)/40,el=gearEffectiveEnhance(item),enhance=1+(GEAR_SIMPLE?GEAR_LV_PCT:.12)*el;   // +12% per effective enhancement; early gear obeys its iLv cap.
  const attack=['weapon','ring'].includes(item.slot)?(()=>{const b0=(1+level*.10)*quality*variation*(item.slot==='weapon'?1:.35);return Math.max(1,Math.round(b0*enhance));})():0;
  const armor=item.slot==='armor'?Math.max(1,Math.round((2+level*.15)*quality*variation*enhance)):0;
  // v7.8.83 เฟส 2 (เจ้าของ): แต่ละช่องมีบทบาท · ถุงมือ=คริ · เกราะ=+HP · รองเท้า=วิ่ง+Dash · สร้อย=คูลดาวน์ · iLv1→100 · คูณคุณภาพ และตีบวก +5%/ขั้น
  const f=(level-1)/99,uq=quality*(1+(GEAR_SIMPLE?GEAR_LV_PCT:.05)*el),r1=v=>Math.round(v*10)/10,role={hp:0,crit:0,critDmg:0,speed:0,dashCd:0,skillCd:0};
  if(item.slot==='gloves'){role.crit=r1((1+4*f)*uq);role.critDmg=r1((5+25*f)*uq);}
  if(item.slot==='armor')role.hp=Math.round((5+55*f)*quality*enhance);   /* 10→160 ตามตารางทำ Power +37% · 5→60 ใช้แทน Armor ที่รองเท้า/สร้อยเสียไป ≈ Power เท่าเดิม ±5% */
  if(item.slot==='boots'){role.speed=r1((3+5*f)*uq);role.dashCd=r1((2+6*f)*uq);}
  if(item.slot==='amulet')role.skillCd=r1((2+6*f)*uq);
  const lp=attack?1+weaponLocalPct(item)/100:1,amin=attack?Math.max(1,Math.round(attack*lp)):0;
  return{attackMin:amin,attackMax:amin?Math.max(amin+1,Math.round(attack*1.4*lp)):0,armor,...role};
}
// v6.55.78: mod Damage % บนอาวุธเป็น local แบบ PoE — คูณ ATK ของอาวุธชิ้นนั้น ×3 แทน +dmg ทั้งตัว
const WEAPON_LOCAL_MUL=3;
function weaponLocalMod(item,id){return !!item&&item.slot==='weapon'&&(id==='dmg'||id==='i_dmg');}
function weaponLocalPct(item){if(!item||item.slot!=='weapon')return 0;let v=0;for(const a of gearActiveAffixes(item))if(a&&a.id==='dmg')v+=a.v||0;const im=ensureImplicit(item);if(im&&im.id==='i_dmg')v+=im.v||0;return v*WEAPON_LOCAL_MUL;}
function gearBaseStatText(item){const b=gearBaseStats(item);if(b.attackMax)return 'ATK '+b.attackMin+'-'+b.attackMax;if(b.armor)return 'Armor '+b.armor+(b.hp?' · HP +'+b.hp:'');if(b.crit)return 'Crit +'+b.crit+'% · Crit DMG +'+b.critDmg+'%';if(b.speed)return 'Speed +'+b.speed+'% · Dash CD −'+b.dashCd+'%';if(b.skillCd)return 'Cooldown −'+b.skillCd+'%';return 'Starter';}
function applyGearBaseStats(p,item){const b=gearBaseStats(item);p.gearAttackMin=(p.gearAttackMin||0)+b.attackMin;p.gearAttackMax=(p.gearAttackMax||0)+b.attackMax;p.armor=(p.armor||0)+b.armor;
  if(b.hp)p.maxhp=(p.maxhp||0)+b.hp;if(b.crit)p.critChance=(p.critChance||0)+b.crit/100;if(b.critDmg)p.critMul=(p.critMul||1.55)+b.critDmg/100;
  if(b.speed)p.baseSpeed=(p.baseSpeed||1)*(1+b.speed/100);if(b.dashCd)p.dashCdMul=(p.dashCdMul||1)*(1-b.dashCd/100);if(b.skillCd)p.cdMul=(p.cdMul||1)*(1-b.skillCd/100);}
function gearAttackRoll(p,rng=Math.random){const hi=p.gearAttackMax||0,lo=(p.gearAttackMin||0)+Math.floor((hi-(p.gearAttackMin||0))*Math.min(.5,p.forgeMods?forgeValue(p,101)/100:0));return lo+Math.floor(rng()*Math.max(1,hi-lo+1));}
function armorDamageMultiplier(p){return 100/(100+Math.max(0,p.armor||0));}
// v6.16: Item Power — อาวุธ iLv สูง = ดาเมจผู้เล่นโตตาม progress (อยู่นอกเพดาน STAT_CAPS.dmgMul)
// v6.18: Damage Effectiveness ของ flat แบบ PoE — อาวุธยิงถี่ได้ flat น้อย, ยิงหนักได้มาก
// v6.55.77: ATK แบบ PoE — ATK ของไอเทม (+flat DMG mod) = +5% ดาเมจต่อแต้ม คูณทุกฮิต (เดิมบวกตรง → ดาเมจฐานต่ำ ATK +1 ≈ +16%)
const ATK_PCT=0.05;
/* v8.2.38 เจ้าของ (feedback: Shotgun สู้บอสยาก): เม็ด Shotgun แรงขึ้น 25% (เดิม ×0.45 ต่อเม็ด) */
const SG_PELLET_MUL=0.45*1.25;
const SG_BOSS_FULL_PELLETS=6;   // v8.2.76 เม็ดที่เกินนี้ในนัดเดียวโดนบอสตัวเดิม = ครึ่งแรง
/* v8.2.40 คำอธิบายป้ายระหว่างเล่น: มี — ใช้ท่อนหลัง (สิ่งที่ต้องทำ) · ไม่งั้นเก็บทีละท่อน (แยกด้วย — · ;) จนยาวไม่เกิน BANNER_LINE_MAX ตัวอักษร · ท่อนแรกยาวเกินตัดด้วย … */
const BANNER_LINE_MAX=58;
function bannerLine(sub){ const t=String(sub||'').replace(/\s*\([^)]*\)/g,'').replace(/\s+/g,' ').trim(); if(t.length<=BANNER_LINE_MAX)return t;
  { const i=t.lastIndexOf(' — '); if(i>0){ const act=t.slice(i+3).trim(); const a2=act.replace(/^and\s+/i,''); if(a2.length>=8&&a2.length<=BANNER_LINE_MAX)return a2.charAt(0).toUpperCase()+a2.slice(1); } }   /* ท่อนหลัง — มักเป็นสิ่งที่ต้องทำ */
  const parts=t.split(/\s*[;:]\s+|\s+(?:—|·)\s+/); let out=parts[0];
  for(let i=1;i<parts.length&&(out+' · '+parts[i]).length<=BANNER_LINE_MAX;i++)out+=' · '+parts[i]; if(out.length>BANNER_LINE_MAX){ const cm=out.slice(0,BANNER_LINE_MAX).lastIndexOf(', '); if(cm>=18)return out.slice(0,cm); const sp=out.slice(0,BANNER_LINE_MAX-1).lastIndexOf(' '); out=out.slice(0,sp>30?sp:BANNER_LINE_MAX-1)+'…'; } return out; }
/* v8.2.43 เจ้าของ: มอนที่ Herald บัฟธรรมดาไป → สุ่ม Hunger Mutation 1 อย่าง (ไอคอนเหนือหัว) · Ch1 = 3 แบบอ่านง่าย · Ch2+ ครบ 6 · ฆ่าตัวที่มี mutation = Sugar เพิ่ม */
const HH_MUT={shell:{em:'🛡️',name:'Candy Shell',c:0x9fe4ff},frenzy:{em:'💨',name:'Frenzy',c:0xff8a5c},bloat:{em:'💥',name:'Bloat',c:0xff5a5a},split:{em:'👯',name:'Split',c:0xffd166},orbs:{em:'🔮',name:'Hex Orbs',c:0xc28bff},leech:{em:'🔗',name:'Leech',c:0x6dffb4}};
const HH_MUT_CH1=['shell','bloat','split'],HH_MUT_ALL=['shell','frenzy','bloat','split','orbs','leech'],HH_SHELL=3,HH_FRENZY_CD=3,HH_ORB_CD=3.5,HH_BLOAT_R=95,HH_BLOAT_T=800,HH_LEECH_R=170,HH_LEECH_HEAL=.08,HH_MUT_ICONS=12;
const RUN_WAIT_MAX=45000;   // v8.2.39 เข้าด่าน: ค้างโดยไม่มีความคืบหน้า 45 วิ → ลองใหม่/กลับเมนู (ไม่บังคับเริ่มด้วยภาพสำรอง)
const FLAT_EFF={momo:1.0,mint:0.4,cocoa:0.6,taro:1.0,sesame:1.5,yuzu:0.5,berry:1.0}, FLAT_EFF_PATH={sniper:2.5,shotgun:0.6,ricochet:0.8};
// v6.41 (เจ้าของ: อาวุธแรงจนการต่อสู้ไม่มีความหมาย) เดิม 1.03/lv ถึง 60 แล้ว 1.015 → iLv89 = ×8.8 · ใหม่ iLv60 ×4.3 · iLv89 ×5.0 · iLv100 ×5.2
function itemPowerMul(ilvl){ const l=Math.max(1,Math.min(100,Number(ilvl)||1)); return l<=60?Math.pow(1.025,l-1):Math.pow(1.025,59)*Math.pow(1.005,l-60); }
// v6.55.19: สแตตฐานของไอเทม (desc ของ GEAR) สเกลตาม iLv — iLv1 = 35%, iLv60 = 100%, endgame สูงกว่า 100% เล็กน้อย · กันของ common ด่านแรกให้ +crit/+dmg เต็มค่า
function gearBaseScale(ilvl){const l=Math.max(1,Math.min(100,Number(ilvl)||1));return l<=60?0.35+0.65*(l-1)/59:1+0.15*(l-60)/40;}
// v6.55.33 (owner): Implicit = 1 random line per item instance, rolled from a ladder Common→Mythic · high-impact lines (Projectile/Bounce/Area/Revive) need high iLv · base stats now live only in prefix/suffix
const IMPLICIT_TIER=['Common','Uncommon','Rare','Very Rare','Mythic'],IMPLICIT_COLOR=['#c9c2d4','#8bd3a0','#8bd3ff','#ffcf5a','#ff8f3a'],IMPLICIT_RANK_W=[60,30,15,7,3];
// v7.8.84 implicit ไม่ซ้ำบทบาทช่อง (ถุงมือ≠คริ · เกราะ≠HP · รองเท้า≠วิ่ง · สร้อย≠คูลดาวน์) · ของเก่าที่สุ่มไว้แล้วคงเดิม
const IMPLICIT_POOL=[
  {id:'i_hp',rank:0,min:1,label:'HP',emoji:'❤️',slots:['amulet','boots','gloves'],r:[20,60],fmt:v=>'+'+Math.round(v),apply:(p,v)=>{p.maxhp+=Math.round(v);}},
  {id:'i_dmg',rank:0,min:1,label:'Damage',emoji:'💥',slots:['weapon','gloves','ring','amulet'],r:[4,10],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.dmgMul+=v/100;}},
  {id:'i_pick',rank:0,min:1,label:'Pickup',emoji:'🧲',slots:['boots','ring','amulet'],r:[10,25],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.pickup=(p.pickup||1)*(1+v/100);}},
  {id:'i_regen',rank:0,min:1,label:'Regen/s',emoji:'💗',slots:['armor','amulet','ring'],r:[0.3,1],fmt:v=>'+'+v.toFixed(1),apply:(p,v)=>{p.regen=(p.regen||0)+v;}},
  {id:'i_spd',rank:1,min:10,label:'Move Speed',emoji:'👟',slots:['armor'],r:[3,7],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.baseSpeed=(p.baseSpeed||1)*(1+v/100);}},
  {id:'i_def',rank:1,min:10,label:'Defense',emoji:'🛡️',slots:['armor','gloves','boots'],r:[3,6],fmt:v=>'-'+Math.round(v)+'%',apply:(p,v)=>{p.dmgTakenMul*=1-v/100;}},
  {id:'i_cd',rank:1,min:10,label:'Cooldown',emoji:'⏩',slots:['weapon','gloves'],r:[3,6],fmt:v=>'-'+Math.round(v)+'%',apply:(p,v)=>{p.cdMul=(p.cdMul||1)*(1-v/100);}},
  {id:'i_xp',rank:1,min:10,label:'EXP Gain',emoji:'📘',slots:['ring','amulet','boots'],r:[5,12],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.xpMul=(p.xpMul||1)*(1+v/100);}},
  {id:'i_crit',rank:2,min:20,label:'Crit',emoji:'🎯',slots:['weapon','ring'],r:[2,5],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.critChance=(p.critChance||0)+v/100;}},
  {id:'i_critdmg',rank:2,min:20,label:'Crit DMG',emoji:'💢',slots:['weapon','ring'],r:[10,25],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.critMul=(p.critMul||1.55)+v/100;}},
  {id:'i_boss',rank:2,min:20,label:'Boss DMG',emoji:'👑',slots:['weapon','ring','amulet'],r:[6,15],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.bossDmg=(p.bossDmg||0)+v/100;}},
  {id:'i_lifekill',rank:2,min:20,label:'HP / Kill',emoji:'🍓',slots:['armor','gloves','amulet'],r:[1,2.99],fmt:v=>'+'+Math.floor(v),apply:(p,v)=>{p.lifeOnKill=(p.lifeOnKill||0)+Math.floor(v);}},
  {id:'i_area',rank:3,min:35,label:'Attack Area',emoji:'🌀',slots:['weapon','gloves','amulet'],r:[10,20],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.gearArea=(p.gearArea||0)+v/100;}},
  {id:'i_bounce',rank:3,min:35,label:'Bounce',emoji:'🔁',slots:['weapon','ring'],r:[1,1],fmt:()=>'+1',apply:p=>{p.gearBounce=(p.gearBounce||0)+1;}},
  {id:'i_exec',rank:3,min:35,label:'Low-HP DMG',emoji:'🔥',slots:['weapon','gloves','ring'],r:[8,15],fmt:v=>'+'+Math.round(v)+'%',apply:(p,v)=>{p.lowHpDmg=(p.lowHpDmg||0)+v/100;}},
  {id:'i_proj',rank:4,min:50,label:'Projectile',emoji:'🏹',slots:['weapon','gloves'],r:[1,1],fmt:()=>'+1',apply:p=>{p.gearCount=(p.gearCount||0)+1;}},
  {id:'i_uniq',rank:4,min:50,label:'Unique Cooldown',emoji:'✨',slots:['amulet','ring','gloves'],r:[15,22],fmt:v=>'-'+Math.round(v)+'%',apply:(p,v)=>{p.uniqueCdMul=(p.uniqueCdMul||1)*(1-v/100);}},
  {id:'i_revive',rank:4,min:70,label:'Revive',emoji:'🔥',slots:['amulet','armor'],r:[1,1],fmt:()=>'+1',apply:p=>{p._gearRevive=(p._gearRevive||0)+1;}},
];
function implicitDef(id){return IMPLICIT_POOL.find(x=>x.id===id);}
function _uidSeed(s){let h=2166136261;s=String(s||'x');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rollImplicit(slot,ilvl,grade,rnd){rnd=rnd||Math.random;const l=Math.max(1,ilvl||1),pool=IMPLICIT_POOL.filter(x=>x.min<=l&&(!x.slots||x.slots.includes(slot)));if(!pool.length)return null;
  const boost=grade==='legend'?2:grade==='epic'?1.4:1,wt=x=>IMPLICIT_RANK_W[x.rank]*(x.rank>=3?boost:1);let tot=0;for(const x of pool)tot+=wt(x);let r=rnd()*tot,pick=pool[pool.length-1];for(const x of pool){r-=wt(x);if(r<=0){pick=x;break;}}
  const v=pick.r[0]+(pick.r[1]-pick.r[0])*rnd();return {id:pick.id,v:Math.round(v*10)/10};}
// ไอเทมเก่า/ไอเทมใหม่ที่ยังไม่มี implicit → สุ่มแบบ seed จาก uid (ผลคงที่ทุกครั้ง)
function ensureImplicit(item){if(!item)return null;const base=GEAR_ALL.find(g=>g.id===item.baseId);if(!base||base.tier==='start'||base.unique)return null;
  if(item.implicit&&implicitDef(item.implicit.id))return item.implicit;let s=_uidSeed(item.uid);const rnd=()=>{s=(Math.imul(s^(s>>>15),2246822507)+0x9e3779b9)>>>0;return (s%100000)/100000;};
  item.implicit=rollImplicit(item.slot||base.slot,item.itemLevel,base.tier,rnd);return item.implicit;}
function implicitText(item){const im=ensureImplicit(item),d=im&&implicitDef(im.id);return d?d.emoji+' '+d.label+' '+d.fmt(im.v):'';}
function applyScaledGear(p,it,lv,ilvl,inst){if(it&&!it.unique&&inst){const im=ensureImplicit(inst),d=im&&implicitDef(im.id);if(d&&!weaponLocalMod(inst,im.id))d.apply(p,im.v);return;}
  const f=gearBaseScale(ilvl),add=['dmgMul','critChance','critMul','maxhp','regen','regenFlat','pickup','lifeOnKill','lowHpDmg','bossDmg','lowHpGuard','flatDmg','lifesteal'],mul=['cdMul','dmgTakenMul','baseSpeed','xpMul','dashCdMul'],b={};
  for(const k of add)b[k]=p[k]||0;for(const k of mul)b[k]=p[k]==null?1:p[k];it.apply(p,lv);
  for(const k of add)if(typeof p[k]==='number')p[k]=b[k]+(p[k]-b[k])*f;for(const k of mul)if(typeof p[k]==='number'&&b[k]>0&&p[k]>0)p[k]=b[k]*Math.pow(p[k]/b[k],f);}
function applyItemLevelBonus(p,item){const bse=item&&GEAR_ALL.find(g=>g.id===item.baseId);if(bse&&bse.tier==='start')return;   // v6.55.24: ช่องว่าง ('None') ไม่ได้โบนัส iLv
  applyGearBaseStats(p,item);const q=Math.max(0,Math.min(1,((Number(item&&item.itemLevel)||1)-1)/99)),slot=item&&item.slot;
  void q;void slot;   // v6.55.32: per-slot iLv bonus removed (implicit scales with iLv instead)
}
function gearPool(tier,chapter=currentItemChapter()){const ch=clampItemChapter(chapter),currentWeapons=GEAR_ALL.filter(it=>!it.unique&&it.tier===tier&&it.slot==='weapon'&&((it.chapter||1)===ch||(it.set&&(it.chapter||1)<=ch))),support=GEAR_ALL.filter(it=>!it.unique&&it.tier===tier&&it.slot!=='weapon'&&(it.chapter||1)<=ch);return currentWeapons.concat(support).length?currentWeapons.concat(support):GEAR_ALL.filter(it=>!it.unique&&it.tier===tier&&(it.chapter||1)<=ch);}
// v4.33: gacha เลือก "ช่วง" base item level เป็นชั้นละ 10 (สุ่ม iLv ในช่วง) · ยิ่งช่วงสูง = ของแรงกว่า = แพงขึ้น · เพดาน 60 (iLv 61-100 หาได้จาก drop เท่านั้น) · mod ยังสุ่ม 0-1 เสมอ
// v6.55.19: เปิดได้ถึงช่วง iLv ที่ความคืบหน้าเนื้อเรื่องถึง (+4) · กัน account ใหม่ซื้ออาวุธ iLv60 (Item Power ×4) ตั้งแต่ต้น
function gachaMaxBand(){const cap=storyItemLevelBase((Save.data&&Save.data.unlockedStage)||0)+4;let i=0;for(let k=0;k<GACHA_LEVELS.length;k++)if(GACHA_LEVELS[k].lo<=cap)i=k;return i;}
const GACHA_LEVELS = [ {lo:1,hi:10,cost:150}, {lo:11,hi:20,cost:320}, {lo:21,hi:30,cost:560}, {lo:31,hi:40,cost:900}, {lo:41,hi:50,cost:1400}, {lo:51,hi:60,cost:2100} ];
const DEFAULT_SETTINGS={share:false,mx:false,sound:true,voices:true,shake:2,flash:true,damageNumbers:true,vfx:2,quality:0,musicVol:1,sfxVol:1};   // v7.2 owner: VFX High · Shake Normal · v7.4 Performance Auto (GPU memory)
const VOL_STEPS=[1,0.75,0.5,0.25,0];
function applyVolSettings(st){ st=st||{}; Sfx.setVolumes(st.musicVol==null?1:st.musicVol, st.sfxVol==null?1:st.sfxVol); }
// ---- Monetization: rewarded ads only (LAUNCH_RULES rule 4 · v8.1.140) ----
// Native app: @capacitor-community/admob (manifest app id is set by scripts/set-android-landscape.mjs).
// Web / old APK without the plugin: the 3-second demo ad below.
const ADMOB_APP_ID = 'ca-app-pub-6736744441157705~4936664616';
const ADMOB_REWARD_ID = 'ca-app-pub-6736744441157705/4748962358';
const ADMOB_TEST_REWARD_ID = 'ca-app-pub-3940256099942544/5224354917';   // Google sample rewarded unit
const ADS_TEST = true;    // closed test: Google test ads only (never click real ads of our own game) · set false at launch
const IAP_ENABLED = false; // owner 13 Nov: no real-money purchases for now · Thread shop hidden, Thread comes from play
const AdManager = {
  _init:null, privacyRequired:false, lastResult:'',
  plugin(){ try{ const C=window.Capacitor; const p=(C&&C.Plugins&&C.Plugins.AdMob)||window.AdMob||null; return (p&&C&&C.isNativePlatform&&!C.isNativePlatform())?null:p; }catch(e){ return null; } },
  hasRealAds(){ const p=this.plugin(); return !!(p && p.showRewardVideoAd && p.prepareRewardVideoAd); },
  unitId(){ return ADS_TEST ? ADMOB_TEST_REWARD_ID : ADMOB_REWARD_ID; },
  // UMP consent first (GDPR form shows only where required), then the SDK
  init(){ if(this._init)return this._init; const p=this.plugin(); if(!p||!p.initialize)return (this._init=Promise.resolve(false));
    this._init=(async()=>{ try{ let info=p.requestConsentInfo?await p.requestConsentInfo():null;
        if(info&&info.isConsentFormAvailable&&info.status==='REQUIRED'&&p.showConsentForm)info=await p.showConsentForm();
        this.privacyRequired=!!(info&&info.privacyOptionsRequirementStatus==='REQUIRED'); }catch(e){}
      try{ await p.initialize({initializeForTesting:ADS_TEST}); this.preload(); return true; }catch(e){ return false; } })();
    return this._init; },
  /* v8.1.142 owner 🐞 "ad button not instant": keep one rewarded ad loaded in the background (was loaded only on tap → slow / failed) */
  preload(){ const p=this.plugin(); if(!p||!p.prepareRewardVideoAd||this._loading||this._loaded)return; this._loading=true;
    Promise.resolve(p.prepareRewardVideoAd({adId:this.unitId(),isTesting:ADS_TEST})).then(()=>{ this._loaded=true; },e=>{ this._loaded=false; this.lastError=this.errText(e); setTimeout(()=>this.preload(),30000); }).finally(()=>{ this._loading=false; }); },
  errText(e){ try{ return e?(e.message||e.code||JSON.stringify(e)).toString().slice(0,200):''; }catch(_){ return String(e); } },
  privacyForm(){ const p=this.plugin(); try{ return p&&p.showPrivacyOptionsForm?Promise.resolve(p.showPrivacyOptionsForm()).catch(()=>{}):Promise.resolve(); }catch(e){ return Promise.resolve(); } },
  // resolves 'rewarded' | 'skipped' (closed early) | 'failed' (no ad / error)
  show(){ const p=this.plugin(); if(!this.hasRealAds())return Promise.resolve('failed');
    return this.init().then(()=>new Promise(res=>{ let got=false,done=false,shown=false; const hs=[];
      const fin=r=>{ if(done)return; done=true; clearTimeout(loadT); hs.forEach(h=>{ try{h&&h.remove&&h.remove();}catch(e){} }); this.lastResult=r; res(r); };
      const on=(ev,f)=>{ try{ Promise.resolve(p.addListener(ev,f)).then(h=>{ if(done){ try{h&&h.remove&&h.remove();}catch(e){} } else hs.push(h); }).catch(()=>{}); }catch(e){} };
      const loadT=setTimeout(()=>{ if(!shown)fin('failed'); },20000);
      on('onRewardedVideoAdShowed',()=>{ shown=true; clearTimeout(loadT); });
      on('onRewardedVideoAdReward',()=>{ got=true; });
      on('onRewardedVideoAdDismissed',()=>setTimeout(()=>fin(got?'rewarded':'skipped'),60));
      on('onRewardedVideoAdFailedToShow',()=>fin('failed'));
      const ready=this._loaded?Promise.resolve():Promise.resolve(p.prepareRewardVideoAd({adId:this.unitId(),isTesting:ADS_TEST})); this._loaded=false;
      ready.then(()=>p.showRewardVideoAd()).then(r=>{ shown=true; clearTimeout(loadT); if(r&&(r.amount!=null||r.type!=null))got=true; setTimeout(()=>fin(got?'rewarded':'skipped'),60000); })
        .catch(e=>{ this.lastError=this.errText(e); fin(got?'rewarded':'failed'); }); })).finally(()=>setTimeout(()=>this.preload(),500)); },
};
const Store = {
  products:[ {id:'noads',emoji:'🚫',name:'Remove interstitial ads',desc:'Permanently disable interstitial ads (rewarded ads still optional)'} ],
  owns(id){ return id==='noads' ? !!Save.data.noAds : false; },
  // TODO: ต่อ in-app billing จริง (Google Play) — ตอนนี้ยังไม่เปิดขาย
  canBuy(){ try{ const C=window.Capacitor; return !!(C&&C.Plugins&&(C.Plugins.Purchases||C.Plugins.InAppPurchase||C.Plugins.CapacitorPurchases)); }catch(e){ return false; } },
};
function localDayKey(offset=0){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dailySpec(){const key=localDayKey(),seed=Number(key.replace(/-/g,'')),max=Math.max(0,Math.min(STAGES.length-1,Save.data.unlockedStage||0));
  const ready=STAGES.map((_,i)=>i).filter(i=>i<=max&&isStageReady(i)),stage=ready[seed%ready.length]||0;
  const kind=['clear','kills',featureOpen('dig')?'dig':'kills'][seed%3],diff=max<3?1:2+(seed%2),target=kind==='kills'?60:kind==='dig'?30:1;
  return{key,kind,stage,diff,target}; }
// v7.5 Daily Quests (เจ้าของ: แบบเกมทั่วไป) — ภารกิจ 5 ข้อ/วัน ข้อละ 20 แต้ม · แต้มสะสมเปิดกล่อง 40 / 70 / 100 (ครบทุกข้อ = กล่องใหญ่)
// v8.0.20 เจ้าของ: Daily ใหม่ — 10 ข้อ/วัน (ง่าย 4 · กลาง 4 · ท้าทาย 2) · กล่อง 3/6/8 ข้อ · เปลี่ยนภารกิจฟรีวันละ 1 · Weekly 7 ช่อง (วันที่ทำครบ 8) → หีบทอง
// k = ชนิดที่ DailyQ.tick(k) นับ · b = ระดับ 0 ง่าย 1 กลาง 2 ท้าทาย · req = ต้องผ่านด่านนั้นก่อน
const DQ_POOL=[   /* v8.3.15 เจ้าของ: Daily ง่ายไป → เป้าทุกข้อ ×1.5 (ข้อที่นับ 1 ครั้งคงเดิม) */
  {id:'e_kills',k:'kills',b:0,emoji:'⚔️',name:'Defeat 180 enemies',target:180,go:'stage'},
  {id:'e_cards',k:'cards',b:0,emoji:'🃏',name:'Pick 15 level-up cards',target:15,go:'stage'},
  {id:'e_unique',k:'unique',b:0,emoji:'⭐',name:'Use your Unique 12 times',target:12,go:'stage'},
  {id:'e_dash',k:'dash',b:0,emoji:'💨',name:'Dash 38 times',target:38,go:'stage'},
  {id:'e_obj',k:'objective',b:0,emoji:'🎯',name:'Finish 3 wave missions',target:3,go:'stage'},
  {id:'e_sugar',k:'sugar',b:0,emoji:'🍬',name:'Earn 600 Sugar',target:600,go:'stage'},
  {id:'e_clear',k:'clear',b:0,emoji:'🏁',name:'Clear a stage',target:1,go:'stage'},
  {id:'e_chest',k:'chest',b:0,emoji:'🧰',name:'Open a chest in the Bazaar',target:1,go:'bazaar',req:0},
  {id:'m_kills',k:'kills',b:1,emoji:'⚔️',name:'Defeat 525 enemies',target:525,go:'stage'},
  {id:'m_elite',k:'elite',b:1,emoji:'💀',name:'Defeat 5 elites or minibosses',target:5,go:'stage'},
  {id:'m_kick',k:'kick',b:1,emoji:'🦶',name:'Kick 5 objects into a boss',target:5,go:'stage'},
  {id:'m_boss',k:'boss',b:1,emoji:'👑',name:'Defeat a stage boss',target:1,go:'stage'},
  {id:'m_clear',k:'clear',b:1,emoji:'🏁',name:'Clear 3 stages',target:3,go:'stage'},
  {id:'m_obj',k:'objective',b:1,emoji:'🎯',name:'Finish 8 wave missions',target:8,go:'stage'},
  {id:'m_salv',k:'shards',b:1,emoji:'♻️',name:'Salvage gear for 30 Thread',target:30,go:'gear',req:0},
  {id:'m_dig',k:'dig',b:1,emoji:'⚔️',name:'Defeat 45 Expedition foes',target:45,go:'dig',req:4},   // v8.0.86 Depths เปิดหลังจบบท 1
  {id:'h_star',k:'star3',b:2,emoji:'🌟',name:'Get all 3 stars in a stage',target:1,go:'stage'},
  {id:'h_boss',k:'boss',b:2,emoji:'👑',name:'Defeat 5 stage bosses',target:5,go:'stage'},
  {id:'h_kills',k:'kills',b:2,emoji:'⚔️',name:'Defeat 1350 enemies',target:1350,go:'stage'},
  {id:'h_kick',k:'kick',b:2,emoji:'🦶',name:'Kick 12 objects into bosses',target:12,go:'stage'},
  {id:'h_clear',k:'clear',b:2,emoji:'🏁',name:'Clear 6 stages',target:6,go:'stage'},
];
const DQ_BAND=[{n:4,name:'Easy',col:0x7fe3a8},{n:4,name:'Medium',col:0xffcf5a},{n:2,name:'Hard',col:0xff7a8a}];
const DQ_BOXES=[{n:3,art:'chest_badge_bronze',name:'Small Box'},{n:6,art:'chest_badge_silver',name:'Big Box'},{n:8,art:'chest_badge_gold',name:'Grand Box'}];
const DQ_WEEK=7, DQ_WEEK_NEED=8;   // วันที่ทำครบ 8 ข้อ = 1 ช่อง · ครบ 7 ช่อง = หีบทอง
function dqHeroes(){ const c=(Save.data&&Save.data.chars)||[],hs=['momo',...c.filter(x=>x!=='momo')]; return hs.filter((x,i)=>hs.indexOf(x)===i&&!(typeof HEROES_WIP!=='undefined'&&HEROES_WIP.includes(x))); }
// ฮีโร่ = ภารกิจกลาง 'win_<hero>' (ชนะด่านด้วยฮีโร่ตัวนั้น) · มีเมื่อปลดฮีโร่ ≥2 ตัว
function dqDef(id){ const d=DQ_POOL.find(x=>x.id===id); if(d)return d; if(String(id).startsWith('win_')){ const h=String(id).slice(4),C=typeof CHARACTERS!=='undefined'?CHARACTERS[h]:null; return {id,k:id,b:1,emoji:(C&&C.emoji)||'🏆',name:'Clear a stage with '+((C&&C.name)||h),target:1,go:'char'}; } return DQ_POOL[0]; }
function dqOk(d){ const m=(Save.data&&Save.data.stageMastery)||{}; return d.req==null||!!m[d.req]; }
function dqCands(band){ const L=DQ_POOL.filter(d=>d.b===band&&dqOk(d)).map(d=>d.id); if(band===1){ const hs=dqHeroes(); if(hs.length>1)L.push(...hs.map(h=>'win_'+h)); } return L; }
// เลือกภารกิจประจำวันแบบ seed ตามวัน · ชนิด (k) ไม่ซ้ำในระดับเดียวกัน (ต่างระดับซ้ำได้ เช่น ฆ่า 120 กับ ฆ่า 900)
function dqPick(day){ let seed=Number(String(day).replace(/-/g,''))||1; const rnd=()=>{ seed=(seed*1103515245+12345)%2147483648; return seed/2147483648; }, out=[];
  DQ_BAND.forEach((bd,band)=>{ const L=dqCands(band),kinds=new Set(); for(let i=L.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [L[i],L[j]]=[L[j],L[i]]; }
    let n=0; for(const id of L){ if(n>=bd.n)break; const k=dqDef(id).k; if(kinds.has(k)||(k.startsWith('win_')&&[...kinds].some(x=>x.startsWith('win_'))))continue; kinds.add(k); out.push(id); n++; } });
  return out; }
function dqWeekKey(){ const d=new Date(),off=-((d.getDay()+6)%7); return localDayKey(off); }
const DailyQ={
  data(){ const day=localDayKey(); let q=Save.data.dailyQ; if(!q||q.day!==day||!Array.isArray(q.quests)||q.v!==2){ q=Save.data.dailyQ={v:2,day,quests:dqPick(day).map(id=>({id,p:0})),boxes:[0,0,0],rr:0}; Save.save(); } return q; },
  done(it){ return it.p>=dqDef(it.id).target; },
  count(){ return this.data().quests.filter(x=>this.done(x)).length; },
  pts(){ return this.count(); },
  week(){ const wk=dqWeekKey(); let w=Save.data.dqWeek; if(!w||w.wk!==wk){ w=Save.data.dqWeek={wk,days:[],got:0}; } return w; },
  weekReady(){ const w=this.week(); return w.days.length>=DQ_WEEK&&!w.got; },
  claimable(){ try{ const q=this.data(),c=this.count(); return DQ_BOXES.some((b,i)=>c>=b.n&&!q.boxes[i])||this.weekReady(); }catch(e){ return false; } },
  // เปลี่ยนภารกิจที่ยังไม่เสร็จ 1 ข้อ/วัน (ระดับเดิม ชนิดไม่ซ้ำข้ออื่น)
  reroll(i){ const q=this.data(),it=q.quests[i]; if(q.rr||!it||this.done(it))return false; const band=dqDef(it.id).b,ids=new Set(q.quests.map(x=>x.id)),have=new Set(q.quests.filter(x=>dqDef(x.id).b===band).map(x=>dqDef(x.id).k));
    const L=dqCands(band).filter(id=>!ids.has(id)&&!have.has(dqDef(id).k)); if(!L.length)return false; q.quests[i]={id:L[Math.floor(Math.random()*L.length)],p:0}; q.rr=1; Save.save(); return true; },
  tick(kind,n=1){ if(this._mute||!(n>0)||!Save.data)return; let q; try{ q=this.data(); }catch(e){ return; } let hit=false,fin=null;
    for(const it of q.quests){ const d=dqDef(it.id); if(d.k!==kind||this.done(it))continue; it.p=Math.min(d.target,(it.p||0)+n); hit=true; if(this.done(it))fin=d; }
    if(!hit)return;
    if(fin){ const c=this.count(); if(c>=DQ_WEEK_NEED){ const w=this.week(); if(!w.days.includes(q.day)&&w.days.length<DQ_WEEK){w.days.push(q.day);if(typeof Sfx!=='undefined')Sfx.orderCue?.('dq_week',.3,1);} } Save.save(); try{ const g=window.__g&&window.__g.scene.getScene('Game'); if(g&&g.showBanner)g.showBanner('📅 Daily Quest Complete',fin.name+' · '+c+' / '+q.quests.length,1600); }catch(e){} }
    else if(!this._t||Date.now()-this._t>4000){ this._t=Date.now(); Save.save(); } },
};
// v8.0.24 เจ้าของ: ปฏิทินเข้าเกม · ขาดวันไม่รีเซ็ต (แค่รอ) · รับผ่านป๊อปอัปตอนเปิด Lobby ครั้งแรกของวัน · v8.0.86 เจ้าของ: 30 วัน (สัปดาห์ละชุดเดิม ×4 + วัน 29–30) แล้ววนกลับวันที่ 1
const LOGIN_CAL=(()=>{const W=[{k:'sugar',n:150,emoji:'🍬',name:'Sugar'},{k:'thread',n:20,emoji:'🧶',name:'Thread'},{k:'cur',n:3,emoji:'✨',name:'Crafting'},{k:'silver',emoji:'🧰',name:'Silver Chest'},{k:'thread',n:30,emoji:'🧶',name:'Thread'},{k:'sugar',n:600,emoji:'🍬',name:'Big Sugar'},{k:'gold',emoji:'👑',name:'Gold Chest'}];return [...W,...W,...W,...W,{k:'cur',n:6,emoji:'✨',name:'Crafting'},{k:'gold',emoji:'👑',name:'Gold Chest',big:true}];})(),LOGIN_DAYS=LOGIN_CAL.length;
const LoginCal={
  data(){ let c=Save.data.loginCal; if(!c||typeof c.i!=='number'){ c=Save.data.loginCal={i:0,last:''}; } return c; },
  ready(){ try{ return this.data().last!==localDayKey(); }catch(e){ return false; } },
  amount(r){ const ch=Math.min(2,Math.floor(((Save.data&&Save.data.unlockedStage)||0)/5)); return r.k==='sugar'?Math.round(r.n*(1+ch*.5)):r.n; },
  label(r){ return r.k==='silver'||r.k==='gold'?r.name:r.emoji+' '+this.amount(r); },
  // รับรางวัลวันนี้ → {r, lines, chest} · chest = id หีบที่ต้องเปิด (ฉากเปิดหีบทำที่ Game)
  claim(){ const c=this.data(),day=localDayKey(); if(c.last===day)return null; const i=((c.i%LOGIN_DAYS)+LOGIN_DAYS)%LOGIN_DAYS,r=LOGIN_CAL[i],n=this.amount(r),lines=[]; let chest=null;
    const dq=typeof DailyQ!=='undefined'?DailyQ:{}; dq._mute=true;
    try{ if(r.k==='sugar'){ Save.addSugar(n); lines.push('🍬 +'+n+' Sugar'); }
      else if(r.k==='thread'){ Save.addThreads(n); lines.push('🧶 +'+n+' Thread'); }
      else if(r.k==='cur'){ const got={}; for(let k=0;k<n;k++){ const rk=typeof rollWeightedCurrency==='function'?rollWeightedCurrency('rare'):'transmute',cu=CURRENCY.find(x=>x.key===rk)||CURRENCY[0]; Save.addCurrency(cu.key,1); got[cu.key]=(got[cu.key]||0)+1; } for(const k in got){ const cu=CURRENCY.find(x=>x.key===k); lines.push((cu.emoji||'✦')+' +'+got[k]+' '+cu.name); } }
      else chest=r.k;
    } finally { dq._mute=false; }
    c.last=day; c.i=(i+1)%LOGIN_DAYS; c.n=(c.n||0)+1; Save.save(); return {r,i,lines,chest}; },
};
const POWER_TUNING={recommended:[100,280,560,940,1450],mastery:[60,90,130,180,240]};
const TIER_LABEL = { mythic:{name:'Mythic',color:'#ff5d8f'}, ancient:{name:'Ancient',color:'#4fe0c8'}, divine:{name:'Divine',color:'#fff3a8'}, start:{name:'Starter',color:'#9a90ab'}, common:{name:'Common',color:'#8bd3a0'}, rare:{name:'Rare',color:'#ffcf5a'}, epic:{name:'Epic',color:'#c9a3ff'}, legend:{name:'Legend',color:'#ff8f3a'} };
const FIELD_DROP_TABLE={
  common:{emoji:'●',name:'COMMON',color:0x8bd3a0},rare:{emoji:'◆',name:'RARE',color:0xffcf5a},epic:{emoji:'✦',name:'EPIC',color:0xc9a3ff},legend:{emoji:'🌟',name:'LEGEND',color:0xff8f3a}
};
// 🏆 กฎเหล็ก: ยิ่งยาก tier ยิ่งดี — legend ดWaitปเฉพาะความยากสูง (นรก)
function rollFieldGearTier(stageIndex,difficulty,boost=0){
  const legend=Phaser.Math.Clamp((difficulty-2)*0.04+(stageIndex-2)*0.006+boost*0.02,0,0.14);
  const rare=Phaser.Math.Clamp(0.05+stageIndex*0.035+(difficulty-1)*0.025+boost*0.08,0.05,0.48),epic=Phaser.Math.Clamp((stageIndex-1)*0.012+(difficulty-1)*0.012+boost*0.035,0,0.20),r=Math.random();
  return r<legend?'legend':r<legend+epic?'epic':r<legend+epic+rare?'rare':'common';
}

/* ---- Equipment compare: normalize every item effect so all deltas use "higher is better" ---- */
const GEAR_COMPARE_STATS = [
  {key:'attack',label:'ATK',range:true},{key:'armor',label:'Armor'},{key:'dmg',label:'DMG',pct:true},{key:'hp',label:'HP'},{key:'crit',label:'Crit',pct:true},
  {key:'critDmg',label:'Crit DMG',pct:true},{key:'cdr',label:'Cooldown',pct:true},{key:'def',label:'Defense',pct:true},
  {key:'speed',label:'Move Speed',pct:true},{key:'pickup',label:'Pickup',pct:true},{key:'regen',label:'Regen/s'},
  {key:'lifeKill',label:'HP / Kill'},{key:'execute',label:'Low-HP DMG',pct:true},{key:'bossDmg',label:'Boss DMG',pct:true},
  {key:'crisisGuard',label:'Emergency Guard',pct:true},{key:'xpGain',label:'EXP Gain',pct:true},{key:'dashRecovery',label:'Dash Recovery',pct:true},{key:'revive',label:'Revive'},
  {key:'flatDmg',label:'Flat DMG/hit'},{key:'lifesteal',label:'Lifesteal HP'},{key:'regenPct',label:'Regen % HP/s',pct:true},{key:'heal',label:'Healing Taken',pct:true},
  {key:'sugarFind',label:'Sugar Find',pct:true},{key:'boxFind',label:'Box Find',pct:true},{key:'orbFind',label:'Currency Find',pct:true},{key:'uniqueCd',label:'Unique Cooldown',pct:true}
];
function gearInstanceStats(item){
  const p={dmgMul:1,maxhp:0,critChance:0,critMul:1.55,cdMul:1,dmgTakenMul:1,baseSpeed:1,pickup:1,regen:0,lifeOnKill:0,lowHpDmg:0,bossDmg:0,lowHpGuard:0,xpMul:1,dashCdMul:1,_gearRevive:0,flatDmg:0,lifesteal:0,regenPct:0,healEffect:1,sugarFindMul:1,boxFindMul:1,currencyFindMul:1,uniqueCdMul:1};
  if(!item)return {dmg:0,hp:0,crit:0,critDmg:0,cdr:0,def:0,speed:0,pickup:0,regen:0,lifeKill:0,execute:0,bossDmg:0,crisisGuard:0,xpGain:0,dashRecovery:0,revive:0};
  const base=GEAR_ALL.find(g=>g.id===item.baseId); if(base&&base.apply){if(base.tier==='start')base.apply(p,gearEffectiveEnhance(item));else applyScaledGear(p,base,gearEffectiveEnhance(item),item.itemLevel,item);}
  applyItemLevelBonus(p,item);
  for(const a of gearActiveAffixes(item)){const d=affixDef(a.id);if(d&&d.apply&&!weaponLocalMod(item,a.id))d.apply(p,a.v);}
  return {attackMin:p.gearAttackMin||0,attackMax:p.gearAttackMax||0,armor:p.armor||0,dmg:(p.dmgMul-1)*100,hp:p.maxhp||0,crit:(p.critChance||0)*100,critDmg:((p.critMul||1.55)-1.55)*100,
    cdr:(1-(p.cdMul||1))*100,def:(1-(p.dmgTakenMul||1))*100,speed:((p.baseSpeed||1)-1)*100,
    pickup:((p.pickup||1)-1)*100,regen:p.regen||0,lifeKill:p.lifeOnKill||0,execute:(p.lowHpDmg||0)*100,bossDmg:(p.bossDmg||0)*100,
    crisisGuard:(p.lowHpGuard||0)*100,xpGain:((p.xpMul||1)-1)*100,dashRecovery:(1-(p.dashCdMul||1))*100,revive:p._gearRevive||0,
    flatDmg:p.flatDmg||0,lifesteal:p.lifesteal||0,regenPct:(p.regenPct||0)*100,heal:((p.healEffect||1)-1)*100,sugarFind:((p.sugarFindMul||1)-1)*100,boxFind:((p.boxFindMul||1)-1)*100,orbFind:((p.currencyFindMul||1)-1)*100,uniqueCd:(1-(p.uniqueCdMul||1))*100};
}
function gearCompareRows(equipped,selected){
  const a=gearInstanceStats(equipped),b=gearInstanceStats(selected);
  return GEAR_COMPARE_STATS.map(d=>d.range?Object.assign({},d,{from:[a.attackMin||0,a.attackMax||0],to:[b.attackMin||0,b.attackMax||0],delta:((b.attackMin||0)+(b.attackMax||0)-(a.attackMin||0)-(a.attackMax||0))/2}):Object.assign({},d,{from:a[d.key]||0,to:b[d.key]||0,delta:(b[d.key]||0)-(a[d.key]||0)}))
    .filter(r=>r.range?(r.from[1]>0||r.to[1]>0):(Math.abs(r.from)>0.001||Math.abs(r.to)>0.001)).sort((x,y)=>{const primary=k=>['attack','armor'].includes(k)?1:0;return primary(y.key)-primary(x.key)||Math.abs(y.delta)-Math.abs(x.delta);});
}
function gearStatText(row,value){if(row.range)return value.join('-');const n=Math.abs(value-Math.round(value))<0.05?Math.round(value):Math.round(value*10)/10;return (n>0?'+':'')+n+(row.pct?'%':'');}
function gearSetCompareText(slot,selected){ if(!selected)return ''; const current=gearSetCounts(),next=Object.assign({},current),old=Save.equippedGearItem(slot),oldBase=old&&GEAR_ALL.find(g=>g.id===old.baseId),newBase=GEAR_ALL.find(g=>g.id===selected.baseId);
  if(oldBase&&oldBase.set)next[oldBase.set]=Math.max(0,(next[oldBase.set]||0)-1); if(newBase&&newBase.set)next[newBase.set]=(next[newBase.set]||0)+1;
  const ids=Array.from(new Set([oldBase&&oldBase.set,newBase&&newBase.set].filter(Boolean))),parts=[];
  for(const id of ids){const def=GEAR_SETS[id];if(def&&(current[id]||0)!==(next[id]||0)){const n=gearSetPieces(id).length;parts.push(def.emoji+' '+def.name+' '+(current[id]||0)+'/'+n+' → '+(next[id]||0)+'/'+n);}} return parts.join('   '); }

/* ---- Save: เก็บ Sugar + ความคืบหน้า + upgrades + gear ลง localStorage ---- */
const DIG_FREE_PER_DAY=1, DIG_FREE_SHOVELS=10;
const SUGAR_CAP=9999999;
function clampSugar(value){const n=Number(value);return Math.min(SUGAR_CAP,Math.max(0,Math.floor(Number.isNaN(n)?0:n)));}
