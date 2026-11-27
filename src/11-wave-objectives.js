const WAVE_OBJECTIVES = {
  survive:{emoji:'⏳',name:'Survive the Swarm',desc:'Survive until time runs out'},
  fill:{emoji:'🍬',name:'Fill the Meter',desc:'Defeat enemies to fill the meter'},
  hunt:{emoji:'🎯',name:'Hunt the Threat',desc:'Defeat the marked Elite — it blinks away when you get close and leaves a trap'},
  purge:{emoji:'🕯️',name:'Escort the Wisp',desc:'Guide the wisp to each cursed core — red raiders hunt the wisp, intercept them'},
  capture:{emoji:'🕳️',name:'Hunger Crack',desc:'Touch the glowing crack — it races to the next hole. Each hole bursts with monsters and loot; clear the last hole!'},
  defendNectar:{emoji:'🌺',name:'Defend Nectar',desc:'Protect one nectar flower. Losing it costs 1/3 max HP; a fresh flower blooms elsewhere'},
  seasonCycle:{emoji:'🌦️',name:'Seasonal Harvest',desc:'Pick up petals from defeated monsters · step on a shrine to call its season · fill all four'},
  breakRoots:{emoji:'🐛',name:'Lure the Crown Root',desc:'A crown root burrows after you — stand by an anchor stone, then dodge so its strike smashes the stone'},
  cleanAir:{emoji:'🫧',name:'Clear the Fog',desc:'Grab the fresh-air bubble, then free the friends trapped in the poison fog'},
  /* v8.1.78 เจ้าของ: ภารกิจประจำด่าน Chapter 3 (แรงบันดาลใจ Breach / Strongbox / Expedition / Ritual / Delirium) */
  seedRift:{emoji:'🌀',name:'Seal the Seed Rift',desc:'The rift pulls you in — catch the seed carriers (quick, armored or splitting) before they feed it'},
  shakeTrees:{emoji:'🌳',name:'Shake the Hollow Trees',desc:'Stand under each tree to shake it — fruit, a beehive, a golden tree or a tree mimic'},
  mirrorPath:{emoji:'🔮',name:'Light the Mirror Path',desc:'Charge every mirror, then the crystal blasts the whole field — shades try to block the beams, and the beams burn them'},
  vaultAltar:{emoji:'🗝️',name:'Vault Altar',desc:'A 2-round trial: pick a curse each round, then take the loot or risk it for more'},
  ultimatum:{emoji:'⚖️',name:'Sugar Crown Trial',desc:'4 rounds of stacking curses — take the pot, or risk it for more (losing costs half)'},
  lastLight:{emoji:'🏮',name:'Hold the Last Light',desc:'Keep at least one lantern burning — stand close to rekindle them, stop the light-stealing moths and grab ✨ wisps'},
  /* v8.1.81 เจ้าของ: League แบบ PoE ปรับเข้า lore · Legion → รูปปั้นโมจิแช่แข็ง เดินเข้าใกล้ = เติมสี → ตื่นมาสู้ */
  frozenPantry:{emoji:'🧊',name:'Frozen Pantry',desc:'Open the sugar jar, then walk near the frozen mochi to paint them back to life — beat them before they refreeze'},
  /* v8.1.82 League phase 2: Breach → Hunger’s Mouth · Blight → Creeping Roots */
  hungersMouth:{emoji:'🖐️',name:'Hunger’s Mouth',desc:'Touch the Hunger’s hand to open a breach — kills inside keep it open, splinters and chests wait inside until it closes'},
  creepingRoots:{emoji:'🌱',name:'Creeping Roots',desc:'Quick, thick and splitting roots crawl toward the nectar flower — stand on each root mother to cut its path'},
  /* v8.1.83 League phase 3: Harbinger → Hunger Herald · Ritual (แนว ก.) → Grandma’s Pot */
  hungerHerald:{emoji:'📯',name:'Hunger Herald',desc:'An untouchable herald beams power into monsters while its gates stay open — beat the empowered ones and its healers, boosters and possessors until it retreats'},
  grandmasPot:{emoji:'🍲',name:'Grandma’s Pot',desc:'Step into the pot’s ring to start a ritual — beat the hungry mochi inside the light, course after course, then spend the flavor on dishes at Grandma’s table'},
  hungerDomain:{emoji:'🪨',name:'Hunger’s Domain',desc:'A Hunger Stone tears the whole cave into the breach — survive the flood, then face the Breachlord'},
  hungerSiege:{emoji:'🏰',name:'Siege of the Hunger',desc:'Hold the circle while five gates pour monsters in — every kill inside fills the pot; stop the 💣 sappers and grab 📦 supplies'},
  grandmasGolem:{emoji:'🗿',name:'Grandma’s Golem',desc:'Guarded flavor carriers drop golem parts (rare ✨ golden ones hit harder and pay more) — bake them, then beat the golem'}
};
// Wave 2 is the miniboss. Fixed early missions give new players a reliable learning path on repeat runs.
const CH1_EARLY_WAVE_PLAN={
  0:{0:{type:'fill',tip:'Defeat enemies to fill the meter.'},1:{type:'survive',tip:'Keep moving and stay alive until the timer ends.'},3:{type:'hungerHerald',tip:'Hunt the Herald to slam its gates shut.'},4:{type:'hunt',tip:'Follow 🎯 and defeat the marked enemies.'}},
  1:{1:{type:'survive',tip:'Keep moving and watch for pressure attacks.'},3:{type:'hunt',tip:'Follow 🎯 to the marked enemies and defeat them.'},4:{type:'purge',tip:'Stay near the Wisp and keep raiders away from it.'}},
  2:{1:{type:'capture',tip:'Stand inside the glowing ring to charge the furnace seal.'},3:{type:'purge',tip:'Protect the Wisp as it reaches each cursed core.'},4:{type:'hunt',tip:'Follow 🎯 and defeat the marked guards.'}}
};
function earlyWaveMission(stage,wave){return CH1_EARLY_WAVE_PLAN[stage]?.[wave]||null;}
const ULT_CURSES=[{id:'swarm',em:'🐜',name:'Double Swarm',v:.3},{id:'elite',em:'💀',name:'Elite Pack',v:.4},{id:'noheal',em:'🚫',name:'No Hearts',v:.45},{id:'bombs',em:'💣',name:'Ground Bombs',v:.35},{id:'shots',em:'🌀',name:'Bullet Rings',v:.4},{id:'drain',em:'🩸',name:'Sugar Drain',v:.3},{id:'ghosts',em:'👻',name:'Hungry Ghosts',v:.35},{id:'quake',em:'🌋',name:'Quake Lines',v:.4}],ULT_GOALS=['survive','slay','defend','collect'];
const FP_ARMY=[30,45],FP_DOME=760,FP_ROLES=['captain','tank','shooter','shooter'],FP_ROLE_LOOK={captain:{px:96,fs:46,tint:0xe8dcaa},tank:{px:88,fs:42,tint:0x8fb6d8},shooter:{px:64,fs:32,tint:0xb0d4ec},fast:{px:60,fs:30,tint:0xa8cfe8},dasher:{px:66,fs:32,tint:0xa0c4e4},basic:{px:72,fs:36,tint:0x9fc4e0}},FP_CRATES=[['sugar','sugar','gear','honeydrop'],['sugar','sugar','gear','honeydrop','recipeink','gear']],FP_CRATE_LOOK={sugar:{em:'🍬',name:'Sugar',edge:0x9fe0ff},gear:{em:'🎁',name:'Gear',edge:0xffd166},honeydrop:{em:'🍯',name:'Honey',edge:0xffc46b},recipeink:{em:'📜',name:'Recipe Ink',edge:0xc9b8ff},starsugar:{em:'🌟',name:'Star Sugar',edge:0xfff2a8}},FP_CAPTAIN_HP=1.8,FP_LEADERLESS=.75;   // v8.2.16 Frozen Pantry แบบกองทัพ
const HUNT_THROW_R=300,HUNT_LOB_T=.85,HUNT_LOB_R=44,HUNT_WIND=.55,HUNT_FLEE=2.8,HUNT_THROW_CD=1.6,HUNT_STK_MAX=10,DEAL_SHOW_MS=1350,DEAL_BIG=2.3,MC86_ORDER=['survive','fill','hunt','purge','capture','cleanAir','defendNectar','breakRoots','seasonCycle','seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight','ultimatum','frozenPantry','hungersMouth','creepingRoots','hungerHerald','grandmasPot','grandmasGolem','hungerSiege','hungerDomain','miniboss','boss'],HH87_ART={heal:'hh87_healer',buff:'hh87_booster',possess:'hh87_possessor'},FP85_ROW={sugar:0,gear:1,honeydrop:2,recipeink:3,starsugar:4},STACK_ON=true,STACK_FROM=5,STACK_AT=18,STACK_MIN_LEFT=45,STACK_CHANCE=.7,STACK_POOL=['shakeTrees','mirrorPath','lastLight','hungerHerald','creepingRoots','grandmasGolem','grandmasPot'],STACK_CAT={capture:'zone',purge:'zone',cleanAir:'zone',defendNectar:'zone',lastLight:'zone',creepingRoots:'zone',grandmasPot:'zone',breakRoots:'zone',shakeTrees:'roam',mirrorPath:'roam',grandmasGolem:'roam',seedRift:'hunt',hungerHerald:'hunt',hunt:'hunt',fill:'hunt',frozenPantry:'global',hungersMouth:'global',vaultAltar:'global',ultimatum:'global',hungerSiege:'global',hungerDomain:'global',seasonCycle:'global'},ANT_SHOT_C11=[.8,1],WAVE_TIMED=true,WAVE_WRAP=8,MISSION_HALF_AT=.5,MISSION_WAVE_DUR={_:90,hunt:80,purge:80,capture:115,frozenPantry:100,grandmasGolem:100,grandmasPot:100,hungerHerald:60,seedRift:100,breakRoots:100,vaultAltar:120,ultimatum:150,hungerDomain:120,seasonCycle:120},MISSION_TIMED_GOAL=['lastLight','creepingRoots','hungerSiege'],MP_SHADE_CD=[6.5,5],MP_DRAIN=.3,LL_MOTH_CD=[6,4.5],LL_MOTH_STEAL=30,LL_WISP_CD=14,HS_SAPPER_CD=8,HS_SAPPER_COST=5,HS_SUPPLY=[15,30],HD_PHASE=[.66,.33],GG_GOLD=.3,GG_ESCORT=2,CR_KINDS={fast:{em:'🌱',c:0x9cff6b,type:'fast',spawn:.65,cut:2.2,name:'Quick root'},thick:{em:'🪵',c:0xc8955a,type:'tank',spawn:1.5,cut:3.2,name:'Thick root'},split:{em:'🌿',c:0xd9a6ff,type:'basic',spawn:1,cut:2.2,split:true,name:'Splitting root'}},CR_BRANCH_LIGHT=24,SR_KINDS=[['basic',.4],['fast',.25],['armored',.2],['split',.15]],SR_LOOK={basic:{c:0x9cff6b,type:'basic'},fast:{c:0xd8ff6b,type:'fast'},armored:{c:0x4f9a2a,type:'tank',worth:2},split:{c:0x6bffd0,type:'basic',split:true}},ST_TREES=[4,5],ST_KINDS=['fruit','hive','golden','mimic','fruit'],ST_HIVE=5,HM_LORD_LIGHT=22,HM_HAND_GROW=.8,HM_MIX=['basic','basic','fast','fast','shooter','tank'],HH_GATES=['swarm','brute','archer'],HH_GATE_LOOK={swarm:{em:'🐜',c:0xff9f6b,name:'Swarm'},brute:{em:'🛡️',c:0x8fb6d8,name:'Brute'},archer:{em:'🏹',c:0x9cff6b,name:'Archer'}},HH_DUR=60,HH_ORBIT=260,HH_BEAM_R=560,HH_BEAM_CD=[2.6,2],HH_POW={hp:1.6,spd:1.2,dmg:1.25},HH_MINIONS=['heal','buff','possess'],HH_MIN_LOOK={heal:{em:'💚',name:'Healer',c:0x6dffb4,type:'basic'},buff:{em:'🎺',name:'Booster',c:0xffd166,type:'basic'},possess:{em:'👻',name:'Possessor',c:0xe8e8ff,type:'fast'}},HH_MIN_MAX=4,HH_HEAL_R=170,HH_HEAL=.04,HH_BUFF_CD=6,HH_GEAR_AT=8;   // v8.2.17 ภารกิจขัดเกลารอบ 2
const SIG_MISSIONS=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight','ultimatum','frozenPantry','hungersMouth','creepingRoots','hungerHerald','grandmasPot','grandmasGolem','hungerSiege','hungerDomain'];
/* v8.1.164 เจ้าของ: ภารกิจกระจุก (เจอแต่ Hunt/Capture/Escort) → ภารกิจประจำด่านที่เคยเจอ (หรือด่านนั้นผ่านแล้ว) เข้า pool กลาง แล้วสุ่มไปแทนช่อง Capture/Escort/Survive ในด่านอื่น 60% · ไม่เอา Seasonal Harvest (ผูกกับฤดูของ C2-4) · บ้านของภารกิจ = ด่านที่โหลดอาร์ตของมัน */
const MISSION_HOME={hungerHerald:0,hungersMouth:1,grandmasPot:2,frozenPantry:3,grandmasGolem:4,defendNectar:5,cleanAir:6,creepingRoots:7,breakRoots:9,shakeTrees:11,mirrorPath:12,vaultAltar:13,lastLight:14},MISSION_ROAM_CHANCE=.6;
const C1_LATER_LEAGUE=['hungersMouth','grandmasPot','grandmasGolem'];
/* v8.2.6 เจ้าของ: สำรับภารกิจ — ด่านละ 1 ใบประจำด่าน + ที่เหลือจั่วจากสำรับกลาง (ไม่ซ้ำจนกว่าจะครบรอบ) · C1-1 รอบแรกล็อกแผนสอน · แจกไพ่ก่อนเริ่มด่าน */
const FILL_TARGET_MAX=35;
const MISSION_DECK=true,MISSION_DECK_BASE=['fill','survive','hunt','purge','capture'],MISSION_DECK_SKIP=['seasonCycle','seedRift'];
/* v8.2.5 หน้า Missions: เรียงตามด่าน · ภารกิจทั่วไป · Delve */
function missionStageTag(i){ return 'C'+(Math.floor(i/5)+1)+'-'+(i%5+1); }
function missionCodexPages(){ const lead=i=>(STAGES[i]&&STAGES[i].lead)||null,ch=c=>{const rows=[];for(let i=c*5;i<c*5+5&&i<STAGES.length;i++){const t=lead(i);if(t&&WAVE_OBJECTIVES[t])rows.push({t,where:missionStageTag(i)});}return rows;};
  return [{title:'Every stage',rows:['fill','survive','hunt','purge','capture'].map(t=>({t,hint:'Shows up in any stage — keep playing'}))},
    {title:'Chapter 1',rows:ch(0)},{title:'Chapter 2',rows:ch(1)},{title:'Chapter 3',rows:ch(2)},
    {title:'Mochi Delve',rows:[{t:'ultimatum',where:'Delve',hint:'Find a Trial room in the Delve'},{t:'hungerSiege',where:'Delve',hint:'Find a Siege room in the Delve'},{t:'hungerDomain',where:'Delve',hint:'Use a Hunger Stone in the Delve'}]}]; }
function missionSeenMap(){ const d=(typeof Save!=='undefined'&&Save.data)||{},o=Object.assign({},d.seenMissions||{},d.missionLog||{}),ss=d.stageStars||{};
  if(ss[0]>0){o.fill=1;o.survive=1;o.hunt=1;} if(ss[1]>0)o.purge=1; if(ss[2]>0)o.capture=1;   // ข้อมูลเก่าก่อน v8.2.5: แผนสอน C1-1..C1-3 รับประกันว่าเจอแล้ว
  return o; }   // v8.1.114 ไม่โผล่ใน Chapter 1 รอบแรก
/* v8.1.116 เจ้าของ (รีวิวภารกิจ ข้อ 3): รางวัลประจำภารกิจ · แสดงในการ์ดเปิดภารกิจ/แท่นเริ่มก่อนเล่น · ได้เพิ่มตอนสำเร็จ (ช่วง 6+ / 11+ ได้เพิ่ม +1) */
const MISSION_REWARDS={fill:['transmute',1],survive:['transmute',1],hunt:['gear',1],purge:['transmute',1],capture:['transmute',2],cleanAir:['transmute',1],defendNectar:['transmute',2],seasonCycle:['starsugar',1],breakRoots:['recipeink',1],seedRift:['transmute',3],shakeTrees:['transmute',2],mirrorPath:['recipeink',1],vaultAltar:['gear',1],lastLight:['transmute',2],ultimatum:['starsugar',1],frozenPantry:['transmute',3],hungersMouth:['starsugar',1],creepingRoots:['transmute',2],hungerHerald:['recipeink',1],grandmasPot:['recipeink',2],grandmasGolem:['gear',1],hungerSiege:['starsugar',1],hungerDomain:['starsugar',2]};
/* v8.2.27 ความยากของภารกิจไว้เรียงเวฟ ง่าย→ยาก (1 ทั่วไป · 2 ภารกิจประจำด่าน · 3 ภารกิจใหญ่) */
/* v8.2.28 SCAMPER รอบ 2 */
const A21_FAMS={"momo_ricochet":3,"momo_sniper":3,"momo_shotgun":3,"mint_needle":3,"mint_shard":3,"cocoa_firefist":3,"cocoa_finisher":3,"cocoa_rocket":3,"cocoa_titan":3,"taro_arc":3,"taro_spark":3,"sesame_flare":3,"lime_arrow":3,"pomelo_punch":3,"bloodorange_spell":3,"hit_mochi":4,"hit_armor":4,"hit_ice":4,"hit_plant":4,"hit_crystal":4,"critical":4};   /* v8.2.85 เสียงโจมตี/ตีโดนแบบสุ่ม (A21) */
const A21_REF={sfx_strawberry_sniper_shot:'momo_sniper',sfx_shotgun:'momo_shotgun',sfx_mint_lance_launch:'mint_needle',sfx_mint_barrage_volley:'mint_shard',sfx_cocoa_fire_fist:'cocoa_firefist',sfx_cocoa_fire_finisher:'cocoa_finisher',sfx_cocoa_rocket_launch:'cocoa_rocket',sfx_cocoa_titan_slam:'cocoa_titan',sfx_taro_chain:'taro_arc',sfx_yz_arrow:'lime_arrow',sfx_yz_bite:'pomelo_punch',sfx_yz_orb:'bloodorange_spell'};
const A21_HERO={momo:['momo_ricochet','momo_sniper','momo_shotgun'],mint:['mint_needle','mint_shard'],cocoa:['cocoa_firefist','cocoa_finisher','cocoa_rocket','cocoa_titan'],taro:['taro_arc','taro_spark'],sesame:['sesame_flare'],yuzu:['lime_arrow','pomelo_punch','bloodorange_spell']};
const SR_EVENT_WARN=1.5,SR_EVENT_ON=true,SR_EVENT_FROM=5,SR_EVENT_HOME=10,SR_EVENT_CHANCE=[.15,.35],SR_EVENT_AT=[8,20],SR_EVENT_DUR=20,SR_EVENT_PULL=35,SR_EVENT_GAP=1.6,SR_EVENT_SPILL=2;   /* v8.2.83 Seed Rift = เหตุการณ์สุ่ม */
const BOSS_TWIST_ON=true,BOSS_TWIST_AT=[.6,.3],BOSS_TWIST_DUR=15,BOSS_TWIST_RATE={roots:1.4,seeds:1.5,fruit:1.3},BOSS_SEED_HATCH=3,BOSS_DARK_SPD=1.3,BOSS_SHADOWS=3,BOSS_TWIST_SUGAR=[4,.8],BOSS_TWIST_BOX=true;   /* v8.2.83 ลูกเล่นบอส (แทนภารกิจบอส) */
const BOSS_TWIST={5:['roots','fruit'],6:['seeds','dark'],7:['fruit','roots'],8:['dark','seeds'],9:['roots','shadows'],10:['seeds','fruit'],11:['dark','roots'],12:['shadows','seeds'],13:['fruit','dark'],14:['roots','shadows']};
const BOSS_TWIST_DEF={roots:{emoji:'🌱',name:'Root Surge',desc:'Roots crawl out of the boss and spit monsters'},seeds:{emoji:'🌰',name:'Seed Rain',desc:'Step on the seeds before they hatch'},fruit:{emoji:'🍎',name:'Falling Fruit',desc:'Fruit bombs rain down — keep moving'},dark:{emoji:'🌑',name:'Frenzy Dark',desc:'The light dims and monsters go wild'},shadows:{emoji:'🪞',name:'Boss Shadows',desc:'The boss calls its shadows to fight'}};
const GOLD_WAVE_CHANCE=.05,GOLD_WAVE_MUL=2,GOLD_TINT=0xffd76a,FIRST_TIME_MUL=1.2,BOSS_MISSION_ON=false,BOSS_MISSION_AT=.6,BOSS_MISSION_DUR=45,BOSS_MISSION={5:'creepingRoots',6:'seedRift',7:'shakeTrees',8:'lastLight',9:'creepingRoots',10:'seedRift',11:'lastLight',12:'mirrorPath',13:'shakeTrees',14:'creepingRoots'};
/* v8.2.30 เจ้าของ (SCAMPER รอบ 3B): Mission Atlas · แต้ม ⭐ กองเดียว · ทุกภารกิจมีต้นไม้ 3 ขั้น × เลือก 1 ใน 2 · เพดาน (cap) บังคับให้เลือก · Focus ภารกิจโปรด ×2 · เปิดหลังจบ Chapter 2 */
const MA_COST=[1,2,3],MA_CAP0=15,MA_CAP_CH3=15,MA_CAP_DELVE=2,MA_CAP_MAX=90,MA_FOCUS_AT=[20,50,90],
  MA_TREE=[[{id:'a',em:'⏳',name:'Steady Hands',desc:'+15% mission time',fx:{time:1.15}},{id:'b',em:'💠',name:'Deep Pockets',desc:'+1 mission currency',fx:{cur:1}}],
    [{id:'a',em:'🔥',name:'Hard Mode',desc:'25% harder · rewards ×1.35',fx:{hard:1.25,rw:1.35}},{id:'b',em:'🎁',name:'Gear Hunt',desc:'35% chance of a Gear box',fx:{box:.35}}],
    [{id:'a',em:'🎰',name:'Jackpot',desc:'12% chance: rewards ×3',fx:{jackpot:.12}},{id:'b',em:'👑',name:'Champion',desc:'40% harder · rewards ×1.6 · +1 Star Sugar',fx:{hard:1.4,rw:1.6,star:1}}]];
function maTypes(){ return (typeof MC86_ORDER!=='undefined'?MC86_ORDER:[]).filter(t=>t!=='miniboss'&&t!=='boss'&&typeof WAVE_OBJECTIVES!=='undefined'&&WAVE_OBJECTIVES[t]); }
function maData(){ const d=(typeof Save!=='undefined'&&Save.data)||{}; const m=d.matlas&&typeof d.matlas==='object'?d.matlas:(d.matlas={pts:0,nodes:{},focus:[]}); if(!m.nodes)m.nodes={}; if(!Array.isArray(m.focus))m.focus=[]; m.pts=m.pts|0; return m; }
function maUnlocked(){ return typeof storyCleared==='function'&&storyCleared()>=10; }
function maCap(){ if(!maUnlocked())return 0; let c=MA_CAP0+(storyCleared()>=15?MA_CAP_CH3:0); try{ const best=(Save.data.delve&&Save.data.delve.best)|0; c+=MA_CAP_DELVE*Math.floor(best/5); }catch(e){} return Math.min(MA_CAP_MAX,c); }
function maSpent(){ const m=maData(); let n=0; for(const t in m.nodes){ const a=m.nodes[t]||[]; for(let i=0;i<3;i++)if(a[i])n+=MA_COST[i]; } return n; }
function maFree(){ const m=maData(); return Math.max(0,Math.min(m.pts,maCap())-maSpent()); }
function maFocusSlots(){ const p=maData().pts; return MA_FOCUS_AT.filter(v=>p>=v).length; }
function maFx(type){ const out={time:1,cur:0,hard:1,rw:1,box:0,jackpot:0,star:0}; if(!maUnlocked())return out; const a=(maData().nodes[type])||[];
  for(let i=0;i<3;i++){ const c=a[i]; if(!c)continue; const n=MA_TREE[i][c-1]; if(!n)continue; for(const k in n.fx){ if(k==='time'||k==='hard'||k==='rw')out[k]*=n.fx[k]; else out[k]+=n.fx[k]; } } return out; }
/* เลือกโหนด: ต้องเลือกขั้นก่อนหน้าแล้ว · แต้มพอ · เลือกซ้ำ = ถอด (ถอดขั้นที่สูงกว่าด้วย) · คืน true เมื่อเปลี่ยน */
function maPick(type,tier,choice){ const m=maData(),a=(m.nodes[type]=(m.nodes[type]||[0,0,0]).slice(0,3)); while(a.length<3)a.push(0);
  if(a[tier]===choice){ for(let i=tier;i<3;i++)a[i]=0; return true; } if(tier>0&&!a[tier-1])return false; const need=a[tier]?0:MA_COST[tier]; if(need>maFree())return false; a[tier]=choice; return true; }
function maReset(){ const m=maData(); m.nodes={}; }
function maToggleFocus(type){ const m=maData(),i=m.focus.indexOf(type); if(i>=0){ m.focus.splice(i,1); return true; } if(m.focus.length>=maFocusSlots())return false; m.focus.push(type); return true; }
const FLOAT_MAX=5,MISSION_JUICE_STOP=90,MISSION_PULL_MS=600;
const MISSION_TIER={survive:1,fill:1,hunt:1,purge:1,capture:1,cleanAir:1,defendNectar:1,breakRoots:2,seasonCycle:2,seedRift:2,shakeTrees:2,mirrorPath:2,lastLight:2,vaultAltar:3,ultimatum:3,frozenPantry:3,hungersMouth:3,creepingRoots:3,hungerHerald:3,grandmasPot:3,grandmasGolem:3,hungerSiege:3,hungerDomain:3};
const LEAGUE_MISSIONS=['frozenPantry','hungersMouth','creepingRoots','hungerHerald','grandmasPot','grandmasGolem','hungerSiege','hungerDomain'];
/* v8.1.85 League phase 6 (Metamorph → Grandma’s Golem): ชิ้นรสจาก Elite · แต่ละชิ้นให้สกิลโกเลม */
const GOLEM_PARTS=[{k:'head',em:'🍰',name:'Cake Head',skill:'spits jam shots'},{k:'arms',em:'🥨',name:'Pretzel Arms',skill:'slams the ground'},{k:'legs',em:'🥖',name:'Baguette Legs',skill:'charges faster'},{k:'tail',em:'🍭',name:'Lollipop Tail',skill:'calls helpers'},{k:'heart',em:'💗',name:'Jelly Heart',skill:'heals itself'}];
const CH1_OBJECTIVE_COLORS=[0x9dff45,0x72e8d1,0xff8a5a,0x9fe0ff,0xd59cff];

const STAGE_SWARM_BEATS = [
  {title:'The Acid Crystal Summons the Nest',sub:'Every ant caste turns to defend the hatchery at once'},
  {title:'Sewage Pressure Bursts',sub:'Swarms from nearby pipes are forced into the same room'},
  {title:'The Furnace Alarm Blares',sub:'The machine releases furnace guards from every belt'},
  {title:'The Cell Seal Breaks',sub:'Wardens and forgotten spirits pour out together'},
  {title:'The Call of Hunger',sub:'Servants from every kitchen floor answer the bitter crown'},
  {title:'The Canopy Blooms Off-Season',sub:'Roots, toxic plants and memory fragments wake across the ferment garden'},
  {title:'The Marsh Breathes as One',sub:'Every fungal body shares the same threads and closes around the pocket of clean air'},
  {title:'The Royal Hive Takes Flight',sub:'Every wing beat follows the Queen while the flowers fight to stay alive'}
];

/* ---- CHAPTERS: แต่ละบทชี้ช่วง global stage index ของตน ---- */
// 🌀 Mochi Rift (endgame v4.74) — ด่านสุ่ม + mod สุ่ม ตาม Tier · ชนะ = Rift Key (ใช้เปิด Pinnacle Boss)
const RIFT_MODS=[
  {id:'frenzy',emoji:'😡',name:'Frenzied',desc:'Enemies hit 25% harder',hp:1,dmg:1.25,reward:1.20},
  {id:'bulwark',emoji:'🛡️',name:'Bulwark',desc:'Enemies have 35% more HP',hp:1.35,dmg:1,reward:1.20},
  {id:'nightfall',emoji:'🌑',name:'Nightfall',desc:'+20% enemy HP and damage',hp:1.2,dmg:1.2,reward:1.30},
  {id:'treasure',emoji:'💰',name:'Treasure Trove',desc:'+15% enemy HP · big reward bonus',hp:1.15,dmg:1,reward:1.35},
  {id:'glass',emoji:'🔪',name:'Razor Edge',desc:'Enemies hit 40% harder but have less HP',hp:0.85,dmg:1.4,reward:1.25},
  {id:'titan',emoji:'🗿',name:'Titanic',desc:'Enemies have 55% more HP',hp:1.55,dmg:1,reward:1.30}
];
const SUGAR_RUSH_SEC=5;
const REPLAY_GOAL=240, REPLAY_QUOTA=340;   // v7.8.48 เจ้าของ: replay ไม่มีตัดเวลา ต้องฆ่าครบเท่านั้น
const PINNACLE_KEY_COST=3, RECIPE_PAR=170, RECIPE_HUNGER_CAP=180, RECIPE_TIME_CAP=300, RECIPE_FRAGS_PER_KEY=4, RECIPE_BOSS_HP=0.7;   // R10: บอส recipe เบาลง 30% ให้รันจบใน ~2-3 นาที แต่ยังสเกลตาม tier
// 📜 Recipe Maps (endgame Phase R · R1 = data model + stash) — แผนที่แบบ PoE: ธีม(ด่าน)+Tier+mods
const RECIPE_BAG_MAX=30, RECIPE_TIER_MAX=16;
const RECIPE_RARITY={normal:{label:'Normal',color:'#e6dcf0',hex:0x8d8499,mods:0},magic:{label:'Magic',color:'#7fb6ff',hex:0x4a7dff,mods:1},rare:{label:'Rare',color:'#ffd166',hex:0xe0a526,mods:2}};
// R4: mod ที่เปลี่ยนกลไก (เฉพาะ Recipe) — รางวัลสูงกว่า mod ตัวเลขล้วน (กฎเหล็ก)
const RECIPE_MECH_MODS=[
  {id:'haste',emoji:'💨',name:'Sugar Rush',desc:'Enemies move 30% faster',hp:1,dmg:1,reward:1.30,mech:true},
  {id:'volatile',emoji:'💥',name:'Volatile',desc:'Enemies burst into a hazard when they die',hp:1,dmg:1,reward:1.35,mech:true},
  {id:'noheal',emoji:'🚫',name:'Starving',desc:'No healing: heal drops and regen do nothing',hp:1,dmg:1,reward:1.45,mech:true},
  {id:'horde',emoji:'🐜',name:'Horde',desc:'Far more enemies spawn · meter fills faster',hp:0.9,dmg:1,reward:1.25,mech:true},
  // v6.63: mod ที่เปลี่ยนวิธีเล่นจริง (play:true) — ทุกถ้ำที่มี mod จะได้อย่างน้อย 1 ตัว
  {id:'splitter',emoji:'🧫',name:'Splitting Jelly',desc:'Enemies split into 2 fast minis when they die',hp:0.85,dmg:1,reward:1.35,mech:true,play:true},
  {id:'restless',emoji:'🏃',name:'Restless Floor',desc:'Standing still for over 1s burns 4% max HP/s',hp:1,dmg:1,reward:1.35,mech:true,play:true},
  {id:'shrink',emoji:'⭕',name:'Closing Pot',desc:'The safe zone shrinks over time · outside it burns',hp:1,dmg:1,reward:1.40,mech:true,play:true},
  {id:'elitepack',emoji:'💀',name:'Elite Pack',desc:'Elites arrive far more often',hp:1,dmg:1,reward:1.40,mech:true,play:true},
  {id:'twinboss',emoji:'👥',name:'Bodyguard',desc:'The boss arrives with a giant elite bodyguard',hp:1,dmg:1,reward:1.40,mech:true,play:true}
];
// v6.32: เงื่อนไข Pact เดิมย้ายมาเป็น mod ของถ้ำ (ไม่มีหน้า Pact แล้ว)
const RECIPE_PACT_MODS=[
  {id:'tyrant',emoji:'👑',name:'Gluttonous Boss',desc:'Boss +50% HP',hp:1,dmg:1,reward:1.30,mech:true,pact:{boss:2}},
  {id:'frail',emoji:'💔',name:'Brittle Shell',desc:'You start with −20% max HP',hp:1,dmg:1,reward:1.30,mech:true,pact:{frail:2}},
  {id:'ravenous',emoji:'⏳',name:'Ravenous Clock',desc:'Hunger Meter needs +40% kills',hp:1,dmg:1,reward:1.25,mech:true,pact:{hunger:2}},
  {id:'pantry',emoji:'🥣',name:'Empty Pantry',desc:'Healing −50%',hp:1,dmg:1,reward:1.20,mech:true,pact:{heal:1}}
];
const RECIPE_MODS=RIFT_MODS.concat(RECIPE_MECH_MODS,RECIPE_PACT_MODS);
function recipeModDef(id){ return RECIPE_MODS.find(q=>q.id===id); }
// ต้นทุนคราฟต์ recipe (currency เดิมของ Affix Forge)
// R6: Atlas — จำ Tier สูงสุดที่เคลียร์ต่อธีม · แต้ม = เคลียร์ครั้งแรก 1 + ทุก 4 Tier อีก 1 (T4/T8/T12/T16)
function atlasData(){ if(!Save.data.atlas||typeof Save.data.atlas!=='object')Save.data.atlas={}; return Save.data.atlas; }
// v6.19 (Atlas Map M1-M4): แผนที่การเดินทาง 3 ชั้น · Mochitopia (ล่าง) → ครัว → สวน → บัลลังก์ → Pinnacle (บน)
const ATLAS_LAYERS=[{name:'Kitchen Ring',emoji:'🍳',stages:[0,1,2,3,4],tierMax:5,color:0x66d3b3},{name:'Garden Ring',emoji:'🌿',stages:[5,6,7,8,9],tierMax:10,color:0xb98cff},{name:'Throne Ring',emoji:'👑',stages:[10,11,12,13,14],tierMax:16,color:0xffd166}];
function atlasLayerOf(si){ return ATLAS_LAYERS.findIndex(L=>L.stages.includes(si)); }
function atlasNeighbors(si){ const L=atlasLayerOf(si); if(L<0)return []; const st=ATLAS_LAYERS[L].stages,k=st.indexOf(si),out=[];
  if(k>0)out.push(st[k-1]); if(k<st.length-1)out.push(st[k+1]);
  if(L>0)out.push(ATLAS_LAYERS[L-1].stages[k]); if(L<ATLAS_LAYERS.length-1)out.push(ATLAS_LAYERS[L+1].stages[k]); return out.filter(i=>STAGES[i]&&STAGES[i].ready!==false); }
function atlasHubLinks(){ return [ATLAS_LAYERS[0].stages[2]]; }
function atlasNodeCleared(si){ return (atlasData()[si]|0)>0; }
function atlasNodeOpen(si){ if(!STAGES[si]||STAGES[si].ready===false)return false; if(atlasNodeCleared(si)||atlasHubLinks().includes(si))return true; return atlasNeighbors(si).some(atlasNodeCleared); }
const AMAP_ADJ=['Sticky','Crumbling','Frosted','Silent','Bubbling','Hollow','Gilded','Sour','Burnt','Misty','Sunken','Whispering','Candied','Bitter','Glowing','Tangled','Forgotten','Drowsy','Shattered','Velvet'];
// v6.30 Mochi Delve (แบบ Delve ของ PoE) · Mochitopia บนสุด ลงล่างไม่รู้จบ · ลึก = ยาก (ไม่มีเพดาน) · ซ้าย/ขวา = เขตรส 5 แบบ (noise)
// แถวสร้างจาก seed ต่อความลึก (กลับมาดูก็เหมือนเดิม) · ทุก 10 ชั้น = ชั้นบอส node เดียว (คอขวด) · ปลายทางตัน = 💎/⛩️ · 🏰 Candy City หายาก
const DELVE_W=12, DELVE_SEG=10, _DROWS=new Map(), _DLINKS=new Map();
const AMAP_TYPES={home:{emoji:'🏠',name:'Mochitopia'},normal:{emoji:'',name:'Cave'},vault:{emoji:'💎',name:'Treasure Pocket',desc:'Dead end · Sugar + extra gear'},shrine:{emoji:'⛩️',name:'Shrine',desc:'First clear: +1 Delve point'},elite:{emoji:'💀',name:'Elite Den',desc:'Boss +50% HP · guaranteed epic gear'},city:{emoji:'🏰',name:'Candy City',desc:'Rare landmark · big Sugar + Pinnacle key'},boss:{emoji:'👑',name:'Boss Floor',desc:'Boss HP ×2 · checkpoint · +3 Delve points'},trial:{emoji:'⚖️',name:'Sugar Crown Trial',desc:'Ultimatum · 4 rounds of stacking curses · take the pot or risk it'},siege:{emoji:'🏰',name:'Siege of the Hunger',desc:'Legion · hold the circle against 5 gates · the pot bursts at the end'}};
const DELVE_PLACES={spicy:['Ember Tunnels','Chili Vents','Pepper Mine','Cinder Hollow','Salsa Falls'],frosty:['Ice Caves','Frost Vault','Sherbet Hollow','Snowdrop Mine','Glacier Pass'],sweet:['Candy Grotto','Frosting Halls','Syrup Pools','Sprinkle Mine','Marzipan Cave'],sour:['Citrus Seep','Lemon Galleries','Tart Springs','Lime Hollows','Zest Mine'],fermented:['Spore Caverns','Mold Depths','Brew Cellar','Mushroom Hollow','Yeast Pits']};
const DELVE_HUE={spicy:10,frosty:200,sweet:330,sour:75,fermented:280};
function _dh(a,b){ let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+62300)|0; h=Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967296; }
function delveHW(d){ if(d<=0)return 0; const k=d%DELVE_SEG; return k===0?0:Math.min(DELVE_W,2*Math.min(k,DELVE_SEG-k)); }
function delveFlavorAt(x,d){ const t=x*0.17+d*0.035+7.3,i=Math.floor(t),f=t-i,s=f*f*(3-2*f),v=_dh(i,9)*(1-s)+_dh(i+1,9)*s; return AMAP_FLAVORS[Math.max(0,Math.min(4,Math.floor(v*5)))]; }
function delveRow(d){ if(_DROWS.has(d))return _DROWS.get(d); let nodes;
  if(d<=0)nodes=[{x:0,d:0,id:'0,0',jx:0,jy:0,r:1,r2:1}];
  else { const hw=delveHW(d),R=mulberry32(Math.floor(_dh(d,77)*1e9)),xs=[];
    if(hw===0)xs.push(0); else { for(let x=-hw;x<=hw;x++)if(R()<0.5)xs.push(x); while(xs.length<2){ const x=-hw+Math.floor(R()*(2*hw+1)); if(!xs.includes(x))xs.push(x); } }
    xs.sort((a,b)=>a-b); nodes=xs.map(x=>({x,d,id:x+','+d,jx:hw?(R()-0.5)*0.6:0,jy:hw?(R()-0.5)*0.5:0,r:R(),r2:R()})); }
  _DROWS.set(d,nodes); return nodes; }
// เส้นจากแถว d → d+1 (E) + เส้นแนวนอนในแถว d (H) + ทางตัน (dead)
function delveLinks(d){ if(_DLINKS.has(d))return _DLINKS.get(d); const A=delveRow(d),B=delveRow(d+1),R=mulberry32(Math.floor(_dh(d,131)*1e9)),E=[],H=[],dead=new Set();
  if(A.length===1||B.length===1)A.forEach(a=>B.forEach(b=>E.push([a.id,b.id])));
  else { const near=(n,L)=>L.slice().sort((p,q)=>Math.abs(p.x-n.x)-Math.abs(q.x-n.x));
    A.forEach(a=>{ if(A.length>2&&dead.size<A.length-2&&R()<0.14){dead.add(a.id);return;} const s=near(a,B); E.push([a.id,s[0].id]); if(s[1]&&Math.abs(s[1].x-a.x)<=2&&R()<0.35)E.push([a.id,s[1].id]); });
    const live=A.filter(a=>!dead.has(a.id)); B.forEach(b=>{ if(!E.some(e=>e[1]===b.id))E.push([near(b,live)[0].id,b.id]); }); }
  for(let i=0;i+1<A.length;i++)if(A[i].x+2>=A[i+1].x&&R()<0.15)H.push([A[i].id,A[i+1].id]);
  const o={E,H,dead}; _DLINKS.set(d,o); return o; }
function delveCityRow(s){ return _dh(s,313)<0.5?s*DELVE_SEG+5:-1; }
function amapNode(id){ if(typeof id!=='string')return null; const p=id.split(','),x=+p[0],d=+p[1]; if(!(d>=0))return null; const n=delveRow(d).find(q=>q.x===x); if(!n)return null; if(n._f)return n;
  const fl=delveFlavorAt(n.x,d),hw=delveHW(d); let type='normal';
  if(d===0)type='home'; else if(hw===0)type='boss'; else if(delveLinks(d).dead.has(id))type=n.r<0.6?'vault':'shrine';
  else { const cr=delveCityRow(Math.floor(d/DELVE_SEG)); if(cr===d){ const live=delveRow(d).filter(q=>!delveLinks(d).dead.has(q.id)); if(live[Math.floor(_dh(d,571)*live.length)]===n)type='city'; } if(type==='normal')type=n.r<0.08?'elite':n.r<0.12?'shrine':(d>=4&&n.r<0.165)?'trial':(d>=3&&n.r<0.205)?'siege':'normal'; }   /* v8.1.86 ห้อง Siege (Legion 5 Way) */   /* v8.1.80 ห้อง Ultimatum */
  const pl=DELVE_PLACES[fl.id],ty=AMAP_TYPES[type];
  Object.assign(n,{_f:1,flavor:fl,type,tier:Math.max(1,Math.min(RECIPE_TIER_MAX,1+Math.floor(d/3))),eng:(d<10?0:d<20?5:10)+AMAP_FLAVORS.indexOf(fl),hue:DELVE_HUE[fl.id],
    imp:null,
    name:type==='home'?'Mochitopia':type==='boss'?'The '+fl.name+' Maw':type==='city'?'Candy City of '+pl[Math.floor(n.r2*5)]:AMAP_ADJ[Math.floor(n.r*AMAP_ADJ.length)%AMAP_ADJ.length]+' '+pl[Math.floor(n.r2*5)%5],
    emoji:ty.emoji||fl.emoji}); n.mods=delveMods(n); n.mission=delveMission(n); return n; }
// v6.31: mod ติดมากับถ้ำ (seed) · ยิ่งลึกยิ่งหลายตัว · mod กลไกตั้งแต่ชั้น 10
const DELVE_MISSIONS=['hunt','purge','capture','cleanAir','defendNectar','breakRoots'];
function delveMission(n){ if(n.type==='trial')return 'ultimatum'; if(n.type==='siege')return 'hungerSiege'; if(n.type==='home'||n.type==='boss'||n.type==='vault'||n.type==='shrine')return null; return DELVE_MISSIONS[Math.floor(_dh(n.x*7+3,n.d+421)*DELVE_MISSIONS.length)%DELVE_MISSIONS.length]; }
function delveModCount(n){ if(n.d<=0)return 0; let k=Math.floor(n.d/6)+(n.r2<0.35?1:0); if(n.type==='elite')k++; if(n.type==='boss')k=Math.max(2,k); if(n.type==='vault'||n.type==='shrine'||n.type==='city')k--; return Math.max(0,Math.min(4,k)); }
function delveMods(n){ const k=delveModCount(n),R=mulberry32(Math.floor(_dh(n.x,n.d+911)*1e9)),pool=RECIPE_MODS.filter(m=>m.play||!m.mech||n.d>=10).map(m=>m.id),out=[];
  if(k>0){ const pp=pool.filter(id=>RECIPE_MODS.find(q=>q.id===id).play); const id=pp[Math.floor(R()*pp.length)]; out.push(id); pool.splice(pool.indexOf(id),1); }
  while(out.length<k&&pool.length)out.push(pool.splice(Math.floor(R()*pool.length),1)[0]); return out; }
function amapAdj(id){ const n=amapNode(id); if(!n)return []; const d=n.d,out=[];
  if(d>0)delveLinks(d-1).E.forEach(e=>{ if(e[1]===id)out.push(e[0]); });
  const L=delveLinks(d); L.E.forEach(e=>{ if(e[0]===id)out.push(e[1]); }); L.H.forEach(e=>{ if(e[0]===id)out.push(e[1]); else if(e[1]===id)out.push(e[0]); });
  return out; }
function delveSave(){ const s=Save.data; if(s.atlasMapVer!==3){ const old=Object.keys(s.atlasMap||{}).filter(k=>(s.atlasMap[k]|0)>0).length; s.delve={clears:{},best:0}; if(old)s.delveComp=old; delete s.atlasMap; delete s.atlasClears; s.atlasMapVer=3; }
  if(!s.delve||typeof s.delve!=='object')s.delve={clears:{},best:0}; if(!s.delve.clears)s.delve.clears={}; return s.delve; }
function amapData(){ return delveSave().clears; }
function amapCleared(id){ return id==='0,0'||(amapData()[id]|0)>0; }
function amapOpen(id){ return !!amapNode(id)&&(amapCleared(id)||amapAdj(id).some(amapCleared)); }
function delveDeepest(){ let m=0; Object.keys(amapData()).forEach(k=>{ const d=+k.split(',')[1]; if(d>m)m=d; }); return m; }
function amapOpenList(){ const out=[],D=delveDeepest()+1; for(let d=1;d<=D;d++)delveRow(d).forEach(n=>{ if(amapOpen(n.id))out.push(n.id); }); return out; }
function amapNext(){ const l=amapOpenList().filter(i=>!amapCleared(i)); l.sort((a,b)=>amapNode(b).d-amapNode(a).d||Math.abs(amapNode(a).x)-Math.abs(amapNode(b).x)); return l[0]; }
function amapNodePts(n){ return n.type==='boss'?3:n.type==='shrine'?1:0; }
function delveBossesDown(){ return Math.floor((delveSave().best||0)/DELVE_SEG); }
function atlasPinnacleOpen(){ return (delveSave().best||0)>=30; }
// ตัวคูณความลึก (ไม่มีเพดาน · ยิ่งยากรางวัลยิ่งดี)
// v6.40 จูนจากเซฟจริงเจ้าของ: หลังชั้น 20 ของตัน (iLv>60 โตแค่ 1.5%/lv) → ชะลอการโตเลือด/ดาเมจ ไม่ให้ชั้น 40+ เป็นกำแพง
const DELVE_BOSS_FLOOR=0.3;   // v6.98.1 owner: Delve boss floor = 30% of C3-5 Normal boss
const HUNGER_PER_KILL=0.19, FEAST_SHARE=0.12, FEAST_EVERY=16, FEAST_FIRST=6, FEAST_LIFE=22, MISSION_HUNGER=0.16;   // v6.42 Feast Targets
/* v7.8.86 เจ้าของ: "ความยาก" ของ endgame = ความลึก Delve — ยิ่งลึก สกุลเงิน Forge ดีขึ้น (ระดับ+จำนวน) · Story เล่นระดับเดียว */
function delveLoot(d){d=Math.max(1,d||1);return {tier:d>=10?'legend':'epic',mul:Math.min(3,1+0.05*d)};}
function delveMul(d){ const a=Math.min(d,20),b=Math.max(0,d-20); return {hp:Math.pow(1.08,a)*Math.pow(1.05,b),dmg:Math.pow(1.06,a)*Math.pow(1.04,b),reward:1+0.05*d}; }
// v6.22 Atlas Influence (3A): ทุกแมพมีรสประจำตัว · เคลียร์แล้วรสซึมไปแมพที่เชื่อม (+1 ชั้น/การเคลียร์ เพดาน 3/รส) · ชั้นละ ยาก+10% รางวัล+15% (กฎเหล็ก)
const AMAP_FLAVORS=[
  {id:'spicy',emoji:'🌶️',name:'Spicy',color:0xff6b4a,eff:'Enemies may leave fire puddles',rew:'+currency'},
  {id:'frosty',emoji:'❄️',name:'Frosty',color:0x7fd4ff,eff:'Enemies slower but tougher',rew:'+Weave Thread'},
  {id:'sweet',emoji:'🍯',name:'Sweet',color:0xffd166,eff:'Bigger swarms',rew:'+Sugar'},
  {id:'sour',emoji:'🍋',name:'Sour',color:0xc8f26b,eff:'Elites appear more often',rew:'+gear drops'},
  {id:'fermented',emoji:'🍄',name:'Fermented',color:0xc9a3ff,eff:'Enemies hit harder',rew:'+unique chance'}];
const AMAP_INF_CAP=3;
// v6.29: แต่ละ node บอกรางวัลหลักไว้ล่วงหน้า (แบบ Last Epoch) → แทน Farming target
const AMAP_REWARDS=[{id:'weapon',emoji:'⚔️',name:'Weapons',desc:'Gear drops are weapons'},{id:'armor',emoji:'🛡️',name:'Armor',desc:'Gear drops are armor, gloves or boots'},{id:'materials',emoji:'💠',name:'Materials',desc:'Gear drops become crafting currency'},{id:'sugar',emoji:'🍬',name:'Sugar',desc:'Boss Sugar ×1.5'}];
const DELVE_REWARD_BIAS={spicy:'weapon',frosty:'armor',sour:'materials',sweet:'sugar'};
function amapRewardOf(id){ const n=amapNode(id); if(!n)return AMAP_REWARDS[0]; const R=mulberry32(81300+Math.floor(_dh(n.x,n.d)*1e9)),b=DELVE_REWARD_BIAS[n.flavor.id]; if(b&&R()<0.6)return AMAP_REWARDS.find(r=>r.id===b); return AMAP_REWARDS[Math.floor(R()*AMAP_REWARDS.length)]; }
// v6.29: Pact milestone ปลดครั้งเดียวต่อตัวละคร ตาม Heat สูงสุดที่ผ่าน
const PACT_MILESTONES=[{heat:2,emoji:'🍬',name:'500 Sugar'},{heat:4,emoji:'💠',name:'5 epic currency'},{heat:6,emoji:'🗝️',name:'Pinnacle key'},{heat:8,emoji:'🌟',name:'Legendary gear'},{heat:12,emoji:'✨',name:'Unique gear'}];
function pactBestChar(ch){ const m=Save.data.pactBestChar||{}; return m[ch]||0; }
const TITAN_RAGE4_HEAT=3;   // v7.7.6 Rage IV = Cocoa เคลียร์บอส Delve ที่ Depth 15 (heat 3)
function titanRage4Unlocked(){ try{ return typeof Save!=='undefined'&&!!Save.data&&pactBestChar('cocoa')>=TITAN_RAGE4_HEAT; }catch(e){ return false; } }
function amapFlavorOf(id){ const n=amapNode(id); return n?n.flavor:AMAP_FLAVORS[2]; }
function amapClears(id){ return id==='0,0'?0:(amapData()[id]|0); }
function amapInfluence(id){ return {}; // v6.36 ตัดระบบ Influence (ผู้เล่นมองไม่เห็นผล)
   const out={}; amapAdj(id).forEach(j=>{ const c=amapClears(j); if(!c)return; const f=amapFlavorOf(j).id; out[f]=Math.min(AMAP_INF_CAP,(out[f]||0)+c); }); return out; }
function amapInfLayers(inf){ return Object.values(inf||{}).reduce((a,b)=>a+b,0); }
function amapInfText(inf){ return AMAP_FLAVORS.filter(f=>inf[f.id]).map(f=>f.emoji+inf[f.id]).join(' '); }
// R7: ผัง passive ของ Atlas — 1 แต้ม/เลเวล · respec ฟรี
// Hunger Pact (แบบ Hades Heat): ติ๊กเงื่อนไขความยากใน Recipe Maps · แต่ละ rank = heat · รางวัล +7%/heat (กฎเหล็ก)
const PACT_TERMS=[
  {id:'hp',emoji:'🛡️',name:'Thick Dough',desc:'Enemies +15% HP per rank',max:3,heat:1},
  {id:'dmg',emoji:'🗡️',name:'Sharp Teeth',desc:'Enemies +15% damage per rank',max:3,heat:1},
  {id:'speed',emoji:'💨',name:'Sugar Rush',desc:'Enemies +10% move speed per rank',max:2,heat:2},
  {id:'horde',emoji:'🐜',name:'Endless Swarm',desc:'Enemies spawn 15% faster per rank',max:2,heat:1},
  {id:'boss',emoji:'👑',name:'Gluttonous Boss',desc:'Recipe boss +25% HP per rank',max:2,heat:2},
  {id:'frail',emoji:'💔',name:'Brittle Shell',desc:'You start with −10% max HP per rank',max:2,heat:2},
  {id:'heal',emoji:'🚫',name:'Empty Pantry',desc:'Healing −50% per rank (rank 2: none)',max:2,heat:2},
  {id:'hunger',emoji:'⏳',name:'Ravenous Clock',desc:'Hunger Meter needs +20% kills per rank',max:2,heat:1}
];
const PACT_REWARD_PER_HEAT=0.07;
function egCharKey(){ return (Save.data&&Save.data.character)||'momo'; }
const ATLAS_NODES=[
  {id:'cartographer',emoji:'🧭',name:'Cartographer',max:3,desc:'+10% chance per level for dropped recipes to be one tier higher'},
  {id:'bounty',emoji:'📜',name:'Bountiful Pantry',max:3,desc:'+8% chance per level to drop a second recipe'},
  {id:'rarity',emoji:'💎',name:'Fine Ingredients',max:3,desc:'Dropped recipes are Magic/Rare more often'},
  {id:'appetite',emoji:'🍽',name:'Big Appetite',max:3,desc:'+6% Hunger per kill per level'},
  {id:'fortune',emoji:'💰',name:'Chef’s Fortune',max:3,desc:'+8% recipe run rewards per level'},
  {id:'eventful',emoji:'⛩️',name:'Eventful Kitchen',max:2,desc:'Lv1: event at 30% Hunger · Lv2: a second event at 70%'},
  {id:'speedster',emoji:'⚡',name:'Quick Service',max:2,desc:'+10s speed-bonus time per level'}
];
/* v6.80 E3: Atlas passives + Pact milestones → one Depth Track. Passives unlock by record depth (no points/respec); milestones (per hero) sit on the same track */
const DEPTH_TRACK=(()=>{ const seq=['appetite','cartographer','bounty','fortune','eventful','rarity','speedster','appetite','cartographer','bounty','fortune','rarity','eventful','speedster','appetite','cartographer','bounty','fortune','rarity'],ms={};
  for(const m of PACT_MILESTONES)ms[m.heat*5]=m; const out=[]; let d=5,i=0; while(i<seq.length||Object.keys(ms).some(k=>+k>=d)){ if(ms[d])out.push({d,kind:'milestone',m:ms[d]}); else if(i<seq.length)out.push({d,kind:'passive',id:seq[i++]}); d+=5; } return out; })();
function delveBestDepth(){ return ((Save.data&&Save.data.delve)||{}).best|0; }
function atlasLv(id){ const b=delveBestDepth(); return DEPTH_TRACK.filter(t=>t.kind==='passive'&&t.id===id&&t.d<=b).length; }
function recipePar(){ return RECIPE_PAR+atlasLv('speedster')*10; }
function recipeThemes(){ return STAGES.map((s,i)=>i).filter(i=>STAGES[i].ready!==false); }
// v6.5.0 Map Table: ไม่มีไอเทมแผนที่แล้ว · เลือกธีม + Tier (≤ เคลียร์สูงสุด+1) + mod เอง · mod จ่าย currency ตอนกด Start (ช่อง 1/2/3 = transmute/regal/exalt)
function mapTierCap(){ return Math.max(1,Math.min(RECIPE_TIER_MAX,Math.max((Save.data.recipeMaxClear||0)+1,Save.data.mapTierLegacy||1))); }
function mapTable(){ let m=Save.data.mapTable; if(!m)m=Save.data.mapTable={node:1,mods:[]};
  if(m.node==null||!amapNode(m.node)||!amapOpen(m.node)){ const n=amapNext(); m.node=n!==undefined?n:delveRow(1)[0].id; } const nd=amapNode(m.node); m.theme=nd.eng; m.tier=nd.tier; m.mods=(m.mods||[]).filter(id=>recipeModDef(id)&&id!==nd.imp).slice(0,3); return m; }
function mapTableRecipe(){ const m=mapTable(),nd=amapNode(m.node),mods=(nd.mods||[]).slice(); return {uid:'table',node:nd.id,theme:nd.eng,tier:nd.tier,rarity:mods.length>=3?'rare':mods.length?'magic':'normal',mods}; }
function recipeMul(r){ const nd=r&&r.node!=null?amapNode(r.node):null,m=nd?delveMul(nd.d):riftTierMul(r.tier); let hp=m.hp,dmg=m.dmg,rw=m.reward; (r.mods||[]).forEach(id=>{const d=recipeModDef(id); if(d){hp*=d.hp;dmg*=d.dmg;rw*=d.reward;}}); return {hp,dmg,reward:rw}; }
function riftTierMul(t){ t=Math.max(1,t|0); return {hp:1+0.18*(t-1),dmg:1+0.12*(t-1),reward:1+0.15*(t-1)}; }
const CHAPTERS = [
  { name:'Chapter 1 · Rise from Below', emoji:'🐜', desc:'Sour Ant Nest → Bitter Crown Oven', ready:true, stages:[0,4] },
  { name:'Chapter 2 · The Ferment Garden', emoji:'🌿', desc:'The crown seed carries memory up to a canopy blooming out of season', ready:true, stages:[5,9] },
  // v4.70: เจ้าของเปลี่ยนแผนเป็น 3 Chapter แล้วเข้า Endgame (ตัด Ch4/Ch5 เดิมออก) · Ch3 = บทสุดท้าย รวมต้นตอวงจรความหิว
  { name:'Chapter 3 · Throne of the First Seed', emoji:'🌑', desc:'The final chapter — face the crown planter and end the hunger cycle', ready:true, stages:[10,14] },
];

// v8.0.23 เจ้าของ: Awards ใหม่ — 4 หมวด · แต่ละรายการมีขั้น ★ (ส่วนใหญ่ 5) · รางวัล Sugar → Thread → หีบทอง → ฉายา · ★ สุดท้ายของหมวดปลดกรอบโปรไฟล์สีหมวด
const AW_CATS=[{id:'story',emoji:'📖',name:'Story',col:0xffd166},{id:'heroes',emoji:'🍡',name:'Heroes',col:0xff8fb8},{id:'combat',emoji:'⚔️',name:'Combat',col:0xff7a6a},{id:'collect',emoji:'💎',name:'Collection',col:0x7fe3d0}];
const AW_REWARD=[{sugar:80},{thread:20},{sugar:200,thread:25},   /* v8.3.20 ไม่มี Shovels */{chest:'gold'},{thread:60,title:true}];
function awSum(o,re){ let n=0; for(const k in o||{})if(!re||re.test(k))n+=Number(o[k])||0; return n; }
function awCleared(d,a,b){ const m=d.stageMastery||{}; let n=0; for(let i=a;i<=b;i++)if(m[i])n++; return n; }
function awStars(d,a,b){ const S=d.stageStars||{}; let n=0; for(let i=a;i<=b;i++){ const m=S[i]|0; n+=(m&1?1:0)+(m&2?1:0)+(m&4?1:0); } return n; }
function awHeroList(){ const c=(typeof Save!=='undefined'&&Save.data&&Save.data.chars)||[],hs=['momo',...c]; return hs.filter((x,i)=>hs.indexOf(x)===i&&!(typeof HEROES_WIP!=='undefined'&&HEROES_WIP.includes(x))); }
function awardList(){ const L=[],H=(typeof CHARACTERS!=='undefined'?CHARACTERS:{}),A=(cat,id,emoji,name,desc,tiers,val,title)=>L.push({cat,id,emoji,name,desc,tiers,val,title});
  ['🐜','🌿','🌑'].forEach((e,c)=>{ A('story','ch'+(c+1),e,'Chapter '+(c+1)+' Hero','Clear stages in Chapter '+(c+1),[1,2,3,4,5],d=>awCleared(d,c*5,c*5+4),['Nest Breaker','Garden Keeper','Seed Savior'][c]);
    A('story','stars'+(c+1),'⭐','Chapter '+(c+1)+' Stars','Earn stage stars in Chapter '+(c+1),[3,6,9,12,15],d=>awStars(d,c*5,c*5+4),['Star of the Nest','Star of the Garden','Star of the Throne'][c]); });
  A('story','rank','🎖','Weaver','Reach a higher Weave Rank',[1,2,3,4,5],d=>d.rank||0,'Master Weaver');
  A('story','pinnacle','🦷','Pinnacle Breaker','Defeat the Pinnacle boss',[1,3,5,10,20],d=>d.pinnacleKills||0,'Hunger Tamer');
  for(const h of awHeroList()){ const n=(H[h]&&H[h].name)||h,e=(H[h]&&H[h].emoji)||'🍡';
    A('heroes','hw_'+h,e,n+' Champion','Clear stages with '+n,[1,5,15,30,60],d=>((d.heroWins||{})[h]||{}).wins||0,n+' Champion');
    A('heroes','hb_'+h,e,n+' Builds','Clear a stage with each of '+n+'’s 3 Builds',[1,2,3],d=>Object.keys(((d.heroWins||{})[h]||{}).builds||{}).length,n+' Master'); }
  A('heroes','roster','👪','The Freed Family','Free more heroes',[2,3,4,5],d=>awHeroList().length,'Family Hero');
  A('combat','kills','☠️','Flavor Hunter','Defeat enemies',[100,1000,5000,20000,100000],d=>awSum(d.bestiary),'Thousand-Flavor Hunter');
  A('combat','bosses','👑','Boss Breaker','Defeat stage bosses',[1,5,15,40,100],d=>awSum(d.bestiary,/^boss\d+$/),'Crown Breaker');
  A('combat','minis','💀','Mini Menace','Defeat minibosses',[1,10,30,80,200],d=>awSum(d.bestiary,/^mini\d+$/),'Mini Menace');
  A('combat','kicks','🦶','Counter Kicker','Kick objects into bosses',[1,10,30,80,200],d=>d.kicks||0,'Golden Boot');
  A('combat','uniques','⭐','Signature Move','Use your Unique',[10,100,500,2000,5000],d=>d.uniqueCasts||0,'Showstopper');
  A('collect','gear','🎒','Collector','Own different gear items',[3,12,30,60,100],d=>(d.ownedGear||[]).length,'Collector');
  A('collect','legend','🌟','Legend Hunter','Find Legendary items',[1,3,6,10,15],d=>(d.ownedGear||[]).filter(id=>String(id).startsWith('lg_')).length,'Legend Hunter');
  A('collect','chests','🧰','Treasure Seeker','Open chests in the Bazaar',[1,10,30,80,200],d=>d.chestsOpened||0,'Treasure Seeker');
  A('collect','bestiary','📖','Bestiary','Discover different monsters',[5,15,30,50,80],d=>Object.keys(d.bestiary||{}).filter(k=>(d.bestiary[k]||0)>0).length,'Monster Scholar');
  // v8.0.28 เจ้าของ: รางวัลลับ ซ่อนชื่อจนกว่าจะทำได้ (ขั้นเดียว = ฉายาเลย)
  const S=(cat,id,emoji,name,desc,val,title)=>L.push({cat,id,emoji,name,desc,tiers:[1],val,title,secret:true}),X=d=>d.secrets||{};
  S('story','sec_week','📅','Creature of Habit','Claim all 7 days of the login calendar',d=>((d.loginCal||{}).n||0)>=7?1:0,'Regular');
  S('story','sec_deep','🕳️','Into the Abyss','Reach floor 20 of the Temple Depths',d=>((d.dig||{}).best||0)>=20?1:0,'Deep Digger');
  S('combat','sec_close','💓','By a Hair','Win a stage with 5% HP or less',d=>X(d).close?1:0,'Lucky Survivor');
  S('combat','sec_x4','⏩','Fast Forward','Win a stage at x4 speed',d=>X(d).x4?1:0,'Speedrunner');
  S('collect','sec_sugar','🍬','Sugar Hoard','Hold 100,000 Sugar at once',d=>(d.sugar||0)>=100000?1:0,'Sugar Baron');
  S('collect','sec_silver','🍀','Silver Lining','Get a Legend from a Silver Chest',d=>X(d).silverLegend?1:0,'Lucky Star');
  S('collect','sec_titles','🎖','Name Dropper','Collect 3 titles',d=>((d.titles||[]).length)>=3?1:0,'Many Names');
  return L; }
function awHidden(a,d){ return !!a.secret&&awReached(a,d)<1&&awClaimed(a,d)<1; }
function awReached(a,d){ const v=a.val(d); let t=0; while(t<a.tiers.length&&v>=a.tiers[t])t++; return t; }
function awClaimed(a,d){ return Math.min(a.tiers.length,((d.awards||{})[a.id])|0); }
function awReward(a,t){ const r=Object.assign({},AW_REWARD[Math.min(t,AW_REWARD.length-1)]); if(t===a.tiers.length-1){ r.title=true; if(!r.thread)r.thread=60; } else if(r.title)delete r.title; return r; }
function awReady(d){ return awardList().some(a=>awReached(a,d)>awClaimed(a,d)); }
function awFrames(d){ return AW_CATS.filter(c=>awardList().some(a=>a.cat===c.id&&!a.secret&&awClaimed(a,d)>=a.tiers.length)).map(c=>c.id); }

const ACHIEVEMENTS=[
  {id:'first',emoji:'⚔️',name:'First Taste of Victory',desc:'Defeat your first enemy',reward:30,test:d=>Object.values(d.bestiary||{}).reduce((a,b)=>a+b,0)>=1},
  {id:'hunter',emoji:'☠️',name:'Thousand-Flavor Hunter',desc:'Defeat 1,000 enemies total',reward:180,test:d=>Object.values(d.bestiary||{}).reduce((a,b)=>a+b,0)>=1000},
  {id:'stage1',emoji:'🐜',name:'Sour Nest Conqueror',desc:'Clear Stage 1 for the first time',reward:60,test:d=>!!(d.stageMastery||{})[0]},
  {id:'stage2',emoji:'🚰',name:'Drain Diver',desc:'Clear Stage 2 — The Rotting Drain',reward:90,test:d=>!!(d.stageMastery||{})[1]},
  {id:'stage3',emoji:'🌶️',name:'Engine Room Escape',desc:'Clear Stage 3 — Chili Engine Room',reward:110,test:d=>!!(d.stageMastery||{})[2]},
  {id:'stage4',emoji:'🧊',name:'Prison Break',desc:'Clear Stage 4 — Sugar Frost Prison',reward:140,test:d=>!!(d.stageMastery||{})[3]},
  {id:'hunger',emoji:'🌑',name:'Hunger Ender',desc:'Defeat The Great Hunger',reward:300,test:d=>!!(d.stageMastery||{})[4]},
  {id:'master',emoji:'🏆',name:'Lord of the Under-Kitchen',desc:'Mastery on all 5 stages',reward:250,test:d=>[0,1,2,3,4].every(i=>(d.stageMastery||{})[i])},
  {id:'hell',emoji:'🔥',name:'Pinnacle Breaker',desc:'Defeat the Pinnacle boss',reward:220,test:d=>(d.pinnacleKills||0)>=1||(d.diffBest||[]).some(v=>v>=3)},   // v7.8.93 Story ระดับเดียว → เป้าใหม่ (diffBest เก่าเก็บไว้นับให้เซฟเดิม)
  {id:'gear3',emoji:'🎒',name:'Kitted Out',desc:'Collect 3 pieces of equipment',reward:70,test:d=>(d.ownedGear||[]).length>=3},
  {id:'legend',emoji:'👑',name:'Legend Hunter',desc:'Find a Legendary item',reward:150,test:d=>(d.ownedGear||[]).some(id=>String(id).startsWith('lg_'))},
  {id:'collector',emoji:'💎',name:'Charm Collector',desc:'Collect at least 12 items',reward:160,test:d=>(d.ownedGear||[]).length>=12},
  {id:'family',emoji:'🍡',name:'The Freed Family',desc:'Unlock the five story fighters',reward:220,test:d=>['momo','mint','cocoa','taro','yuzu'].every(id=>(d.chars||[]).includes(id))},
  {id:'bond',emoji:'⭐',name:'Eternal Weave',desc:'Weave up to Rank 1',reward:200,test:d=>(d.rank||0)>=1},
];

// Taro pre-build needles: no chain/mark/charge loop, saved ranks keep their IDs.
function taroNeedleProfile(b,p,level,dm){const r=b?.ranks||{},evo=!!b?.evolved,cl=b?.mutation==='chainlord',sc=b?.mutation==='stormcaller';
  const reach=Math.max(0,r.arc||0)+Math.max(0,p.weaponChains||0)+(cl?2:0)+(evo?3:0),raw=(level>=6?3:level>=4?2:1)+Math.max(0,r.surge||0)+(sc?2:0)+(evo?2:0)+Math.max(0,p.gearCount||0);
  return {shots:Math.min(3,raw),range:Math.min(900,(level>=6?760:520)*(1+reach*.1+Math.max(0,p.gearArea||0))*(cl?1.4:1)*(evo?1.5:1)),damage:(14+level*4.2)*dm*(level>=6?1.15:1)*(sc?1.2:1)*(evo?1.2:1)*(1+Math.min(.25,Math.max(0,raw-3)*.05))};
}
// Taro T1: pure foundation. T2/T3/T4 enable the three path resolvers.
const TARO_SOURCE_POLICY=Object.freeze({spark:false,sparkChild:true,sentry:true,beacon:true,chain:false,unique:false,smite:false,tempestBasic:false,sweep:false,repeat:true,splash:true,shrapnel:true,nova:true,bomb:true});
function taroSecondary(scene){return scene.character==='taro'&&scene._taroDamageContext?.terminal===true;}
function taroEnemyToken(e){return e&&Number.isSafeInteger(e._taroSpawnId)?{enemy:e,id:e._taroSpawnId}:null;}
function taroTargetValid(token,origin,range=Infinity){const e=token?.enemy;
  return !!(e&&e._taroSpawnId===token.id&&e.active&&e.hp>0&&!e.isDummy&&!e._phaseGateLocked&&!(e._phaseInvuln>0)&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Math.hypot(e.x-origin.x,e.y-origin.y)<=range);
}
function taroTargetTier(e){return e.isBoss?2:(e.isMini||e.isElite?1:0);}
function taroPriorityTarget(enemies,origin,range,mark=null){
  const candidates=enemies.map(taroEnemyToken).filter(t=>taroTargetValid(t,origin,range));
  candidates.sort((a,b)=>taroTargetTier(b.enemy)-taroTargetTier(a.enemy)||b.enemy.hp-a.enemy.hp||Math.hypot(a.enemy.x-origin.x,a.enemy.y-origin.y)-Math.hypot(b.enemy.x-origin.x,b.enemy.y-origin.y)||a.id-b.id);
  const best=candidates[0]||null;
  return taroTargetValid(mark,origin,range)&&(!best||taroTargetTier(mark.enemy)>=taroTargetTier(best.enemy))?mark:best;
}
function taroInvestments(b,p,paths){const out={dmg:1,cd:1,count:0,range:0};
  const add=(fx,n)=>{for(const k of ['dmg','cd','count','range'])if(Number.isFinite(fx?.[k])){if(k==='dmg'||k==='cd')out[k]*=Math.pow(fx[k],n);else out[k]+=fx[k]*n;}};
  const path=paths.find(x=>x.id===b.path);
  for(const u of path?.upgrades||[]){const count=Number.isFinite(u.fx?.count),n=Math.max(0,Math.min(u.max*(count?1:1.55),count?(b.lv?.[u.id]??b.ranks?.[u.id]??0):(b.ranks?.[u.id]??b.lv?.[u.id]??0)));if(b.path==='tempest'&&u.id==='p_gale')continue;add(u.fx,n);}
  for(const [fx,n] of p._pt?.fx||[])add(fx,Math.max(0,n));
  out.count+=Math.max(0,p.gearCount||0);out.range+=Math.max(0,p.gearArea||0);return out;
}
function taroCombatProfile(b,p,level,paths,options={}){
  const inv=taroInvestments(b,p,paths),r=b.ranks||{},aw=level>=6,evo=!!b.evolved,chainlord=b.mutation==='chainlord',stormcaller=b.mutation==='stormcaller';
  const arc=Math.max(0,r.arc||0)+Math.max(0,p.weaponChains||0)+(chainlord?2:0)+(evo?3:0);
  const rawRoots=(aw?3:level>=4?2:1)+Math.max(0,r.surge||0)+(stormcaller?2:0)+(evo?2:0)+Math.max(0,inv.count);   /* v8.0.79 เจ้าของ: Arc เริ่มบิลด์ยิงหลายทางเกิน → เอาสายแถม +1 ของ storm ออก (สายเพิ่มตามเลเวล 4/6 และการ์ดเหมือนเดิม) */
  const unitD=(14+level*4.2)*(p.dmgMul||1)*(options.skillPower??1)*(options.weaponDamage??1)*(1+Math.max(0,r.power||0)*.12)*(options.infusionDirect??1)*(stormcaller?1.2:1)*(evo?1.2:1)*inv.dmg;
  const unitC=Math.max(1.4,2.2-(aw?6:level)*.08)*(aw?.85:1)*Math.pow(.92,Math.max(0,r.rate||0))*Math.pow(.97,Math.max(0,r.tempo||0))*(p.cdMul||1)*(options.weaponCooldown??1)*(options.forgeCadence??1)*inv.cd;
  const base={storm:{dmg:.6,cd:1.25},smite:{dmg:1.8,cd:1.35},tempest:{dmg:.65,cd:.85}}[b.path];   // v8.0.37 เจ้าของ: Arc แรง+รัวเกิน → dmg .75→.6, cd 1→1.25
  if(!base)return null;
  const victims=Math.min(10,4+arc),chainExcess=Math.min(.15,Math.max(0,4+arc-10)*.03),rootExcess=Math.min(.25,Math.max(0,rawRoots-3)*.05);
  return {path:b.path,unitD,unitC,primaryDamage:unitD*base.dmg,interval:Math.max(.35,unitC*base.cd),rawRoots,arc,
    roots:b.path==='storm'?Math.min(3,rawRoots):1,victims,chainBonus:1+chainExcess,rootBonus:1+rootExcess,
    jumpRange:Math.min(360,180*(chainlord?1.4:1)*(evo?1.5:1)*(1+inv.range)),rootRange:Math.min(900,(aw?760:520)*(1+inv.range)),
    extraStrikeBonus:1+Math.min(.4,Math.max(0,rawRoots-1)*.08),splashTargets:Math.min(3,arc),splashBonus:1+Math.min(.25,Math.max(0,arc-3)*.05),
    novaRadius:Math.min(280,(180+Math.min(60,arc*8))*(chainlord?1.15:1)*(evo?1.15:1)),
    dashCooldownMul:taroGaleCooldown(b)};
}
function taroMovementSample(previous,point,options={}){
  const sample={x:point.x,y:point.y,playing:!!options.playing};let distance=0;
  if(previous?.playing&&sample.playing&&options.intentional&&!options.dashing&&!options.forced&&options.dt>0&&options.dt<=.1&&Number.isFinite(options.maxSpeed)){
    const dx=point.x-previous.x,dy=point.y-previous.y,len=Math.hypot(dx,dy),ix=options.intentX||0,iy=options.intentY||0,il=Math.hypot(ix,iy),envelope=Math.max(0,options.maxSpeed)*options.dt;
    const along=il?((dx*ix+dy*iy)/il):0;
    if(Number.isFinite(len)&&len<=envelope*1.25+2&&along>0&&along>=len*.5)distance=Math.min(len,along,envelope);
  }
  return {sample,distance,chargeGain:distance*100/720};
}
function taroNewState(run,pathEpoch,path,player){return {run,pathEpoch,path,player,enabled:false,time:0,charge:0,novaAt:0,mark:null,sample:null,sweep:null,jobs:[],fx:new Set(),attackSeq:0,shrapnelBucket:-1,shrapnelCount:0};}
function taroQueueEvent(t,kind,delay,callback,options={}){
  if(!t.enabled||!Object.hasOwn(TARO_SOURCE_POLICY,kind)||!Number.isFinite(delay)||delay<0||typeof callback!=='function'||t.jobs.length>=64)return null;
  if(kind==='bomb'&&t.jobs.filter(j=>j.kind==='bomb').length>=3)return null;
  if(kind==='shrapnel'){const bucket=Math.floor(t.time/.25);if(bucket!==t.shrapnelBucket){t.shrapnelBucket=bucket;t.shrapnelCount=0;}if(t.shrapnelCount>=8)return null;t.shrapnelCount++;}
  const job={kind,remaining:delay,callback,run:t.run,pathEpoch:t.pathEpoch,token:options.token||null,range:options.range??Infinity,attackId:options.attackId??++t.attackSeq};t.jobs.push(job);return job;
}
function taroAdvanceQueue(t,dt,isValid){
  const batch=t.jobs;t.jobs=[];const due=[];
  for(const job of batch){if(job.run!==t.run||job.pathEpoch!==t.pathEpoch)continue;job.remaining-=dt;if(job.remaining<=0)due.push(job);else t.jobs.push(job);}
  for(const job of due){if(job.run!==t.run||job.pathEpoch!==t.pathEpoch)continue;const valid=isValid(job);if(valid==='hold'){t.jobs.push(job);continue;}if(valid)job.callback(job);}
}
function taroSegmentDistance(point,from,to){const dx=to.x-from.x,dy=to.y-from.y,d2=dx*dx+dy*dy,k=d2?Math.max(0,Math.min(1,((point.x-from.x)*dx+(point.y-from.y)*dy)/d2)):0;return Math.hypot(point.x-from.x-k*dx,point.y-from.y-k*dy);}
function taroSwarmProfile(b,p,base){const r=b?.ranks||{},rank=id=>Math.max(0,r[id]??b?.lv?.[id]??0),count=base.rawRoots;
  if(b.path==='smite'){const excess=Math.max(0,Math.floor(count+1)-10),pierce=base.arc,range=Math.min(900,base.rootRange*(b.mutation==='chainlord'?1.4:1)*(b.evolved?1.5:1)*(1+.15*Math.min(6,Math.max(0,pierce))));
    /* v7.8.77 เจ้าของ: โจมตีปกติเริ่มต้นลดจำนวน (+3→+1 ลูก: Lv1 2 ลูก, Lv4+ 3 ลูก, เดิม 4/5) และยิงห่างขึ้น ×1.3 */ /* v7.8.21 เจ้าของ: อยู่นานขึ้น เร็วขึ้น ทะลุศัตรู (pierce พื้น 2) · แตกตัว 2 รุ่น: บิน 0.42 วิ แตก 2 ลูก ลูกลูกแตกอีก 2 ลูกเล็ก */
    return {interval:Math.max(.45,base.unitC*1.3),damage:base.unitD*.75*(1+Math.min(.25,excess*.04)),   /* v7.8.69 เจ้าของ: Spark ไม่หายตอนโดนแล้ว pierce ไร้ความหมาย → ทุกขั้นของ arc = +10% ดาเมจ */count:Math.min(10,Math.floor(count+1)),pierce:Math.min(5,2+Math.floor(pierce)),speed:Math.min(640,460*(1+.12*rank('p_spark_speed'))),life:Math.min(5,3.5*(1+.15*rank('p_spark_life'))*range/520),range,split:rank('p_spark_split')>0?.65:.45};}
  const radius=Math.min(140,105*(1+Math.min(.4,Math.max(0,count-1)*.08))),range=base.rootRange;   /* v7.8.63 เจ้าของ: วงช็อตเริ่มใหญ่ขึ้น 85→105 · ลูกบอลเร็วขึ้น 110→145 */   // v7.8.24 Ball Lightning แบบ PoE: ลูกเล็กลอยช้า ช็อตทุกตัวในรัศมีนี้ทุก 0.15 วิ
  // v8.0.88 เจ้าของ: Sentry เริ่ม 2 ต้น · การ์ด +1 (surge) เพิ่มต้น (สูงสุด 3) · Reserve Cell (arc) = ยิงถี่ขึ้น 10%/ขั้น (สูงสุด +60%) แทนอายุยาวขึ้น
  const sentries=Math.min(TARO_SENTRY_MAX,2+rank('surge')+(b.mutation==='stormcaller'?1:0)+(b.evolved?1:0)),fire=1+.10*Math.min(6,Math.max(0,base.arc||0));
  return {interval:Math.max(.55,base.unitC),damage:base.unitD*.30,pulse:Math.max(.65,base.unitC*1.15/fire),   /* v8.1.53 เจ้าของ: ป้อมยิงถี่เกิน ยืนนิ่งก็ผ่าน → ช้าลง ~35% (.84→1.15, พื้น .4→.65) */nodeLife:5,sentries,fire,radius,range,orbLife:Math.min(6,(range+radius)/TARO_BL_SPEED),overload:1.5*Math.min(2,rank('p_sentry_overload')),link:.8*Math.min(2,rank('p_sentry_link'))};
}
const TARO_ARC_BOSS_HITS=4;   // v8.1.163 เจ้าของ A: Arc ตีบอส/มินิ ต่อสาย = เต็ม 1 + เด้งกลับ 3 (เดิม 1+2 v8.0.82) · Spark ตีบอสซ้ำทุก 0.2 วิ (เดิม .3)
const TARO_ARC_JUMP=180,TARO_ARC_STARTER=.75,TARO_ARC_LOOP=.6,TARO_ARC_LOOP_MAX=2,TARO_SHOCK_MAX=5,TARO_SHOCK_PER=.05,TARO_SHOCK_LIFE=3,TARO_OVER_R=150,TARO_OVER_TIME=3,TARO_NEEDLE_SPEED=950,TARO_NEEDLE_POWER=1.35,TARO_BL_TICK=.15,TARO_BL_SPEED=145,TARO_BL_MAX_ZAPS=6,TARO_ORB_HIT_GAP=.13,TARO_SENTRY_LEASH=350,TARO_ORB_CAP=36,TARO_SENTRY_MAX=3,TARO_OVERCHARGE=1.5,TARO_LINK_RANGE=420,TARO_BEACON_STRIKE_R=200;   // v7.8.19 Sentry fixes
// v7.8.60 เจ้าของ: ดาวรายด่าน 3 ดวง (ภารกิจ) · บันทึก Save.data.stageStars[idx] = bitmask สูงสุดที่เคยได้ · ดาวใหม่ = Sugar โบนัส × รางวัลความยาก (กฎเหล็ก)
const STAGE_STARS=[{name:'Clear the stage'},{name:'Finish with 70%+ HP'},{name:'Never drop below 30% HP'}],STAGE_STAR_SUGAR=30;
const LEVELUP_DELAY_MS=650;   // v7.8.58 หน่วงก่อนเปิดการ์ดเลเวลอัพ
const TARO_ARC_HOP_MS=200,TARO_MAG_TIME=10,TARO_MAG_MUL=1.25;   // v7.8.71 เจ้าของ: กลับเป็น 200 (v7.8.69 ลอง 350)   // v7.8.61 เจ้าของ: 85→200 ms ต่อ 1 กระโดด
const TARO_MARK_RANGE=700,TARO_MARK_TIME=2,TARO_MARK_FAST=1,TARO_BURST_SPREAD=1.1,TARO_BURST_SPEED=1.35,TARO_MARK_BONUS=1.5,TARO_MARK_TURN=8,TARO_MARK_BLAST_R=130,TARO_ORB_SEEK=360,TARO_ORB_TURN=2.6,TARO_ORB_LINGER=.3,TARO_ORB_BIG_GAP=.18,TARO_UQ_GROW=.12,TARO_STATIC_HITS=40,TARO_STATIC_MUL=13,TARO_PLASMA_BOSS=1.75,TARO_STORM_COUNT=36,TARO_STORM_GAP=.05,TARO_STORM_FUSE=1.1,TARO_STORM_R=72;   // v7.8.33 Spark Storm   // v7.8.31 Plasma Field ×1.75 ต่อบอส/มินิ
const SEASON_PETALS=12;   // v7.8.55 เจ้าของเลือก A: C2-4 Seasonal Harvest — ฆ่ามอน = กลีบของฤดูปัจจุบัน · 4 ฤดู × 12 · ไม่มีพลาด
const TARO_SHOCK_MAX_BIG=15,TARO_DISCHARGE_HITS=25,TARO_DISCHARGE_MUL=10;   // v7.8.52 เจ้าของ A+B+C Sentry: Shock บนบอส/มินิ 15 ชั้น · ช็อตโดนตัวเดิมครบ 25 = ฟ้าผ่า ×10 · ลูกบอลระเบิดตอนหมดอายุเป็นพื้นฐาน
const TARO_SPARK_HIT_R=10,TARO_SPARK_HOME_R=180,TARO_SPARK_HOME_TURN=2.4;   // v7.8.51 เจ้าของ A+B: ระยะโดน = ตัวมอนจริง + ประกาย · เลี้ยวหามอนธรรมดาที่ยังไม่โดนเบา ๆ
const TARO_SPARK_TURN=5,TARO_SPARK_BOSS_GAP=.2,TARO_SPARK_GENS=2,TARO_SPARK_SPLIT_AT=.42,TARO_SPARK_SCALE=[1.25,.9,.65];   // v7.8.21 Spark fission
function taroBeaconProfile(dm,level,echo){const n=Math.max(1,Math.min(4,level||1));return {strike:(8+4*n)*dm*(1+(n-1)*.22),life:4+n+(echo?2:0),interval:1.02-n*.07,range:520+(echo?40:0),damage:(9+n*7)*dm*(1+(n-1)*.22)*.35,orbRadius:95,orbLife:4.2,speed:TARO_BL_SPEED};}
// v7.8.24 Lightning damage swings wide (owner): uniform 0.2–1.8, mean 1.0, for Spark/Sentry/Beacon hits.
function taroLightningRoll(){return .2+Math.random()*1.6;}
// v7.8.23 Spark bounces off the visible screen edge (camera follows Taro, so sparks keep flying around the player).
function taroBounceView(p,v){if(p.x<v.left){p.x=v.left;p.angle=Math.PI-p.angle;}else if(p.x>v.right){p.x=v.right;p.angle=Math.PI-p.angle;}if(p.y<v.top){p.y=v.top;p.angle=-p.angle;}else if(p.y>v.bottom){p.y=v.bottom;p.angle=-p.angle;}return p;}
// Swept first-contact reflection: thin solid props cannot be tunnelled through.
function taroProjectileStep(p,dt,limit,boxes=[]){let x=p.x+Math.cos(p.angle)*p.speed*dt,y=p.y+Math.sin(p.angle)*p.speed*dt,angle=p.angle;const dx=x-p.x,dy=y-p.y;let first=null;
  for(const box of boxes){let near=0,far=1,axis=null;for(const [v,d,lo,hi,key] of [[p.x,dx,box.left-3,box.right+3,'x'],[p.y,dy,box.top-3,box.bottom+3,'y']]){if(Math.abs(d)<1e-8){if(v<lo||v>hi){far=-1;break;}}else{let a=(lo-v)/d,b=(hi-v)/d;if(a>b)[a,b]=[b,a];if(a>near){near=a;axis=key;}far=Math.min(far,b);}}if(axis&&near>=0&&near<=far&&near<=1&&(!first||near<first.at))first={at:near,axis};}
  if(first){x=p.x+dx*Math.max(0,first.at-.002);y=p.y+dy*Math.max(0,first.at-.002);angle=first.axis==='x'?Math.PI-angle:-angle;}
  if(x>limit||x<-limit){x=Math.max(-limit,Math.min(limit,x));angle=Math.PI-angle;}if(y>limit||y<-limit){y=Math.max(-limit,Math.min(limit,y));angle=-angle;}return {x,y,angle};
}

// End Taro T1 helpers.

// v7.9.55 จุดแดง Talent: ฮีโร่มีแต้ม TP พอซื้อโหนดที่เปิดอยู่และยังไม่เต็ม (กติกาเดียวกับหน้า Talent: Core ตามสาย 3 สาย, Build Path ใช้ talNodeOpen/talNodeCost)
function heroTalentSpendable(id){ try{ const cp=Save.cp(id)||{},tp=cp.tp||0; if(tp<=0)return false; const tal=cp.tal||{};
  const core=charTalents(id)||[]; if(core.length){ const root=core[0],par={},ch=[[],[],[]]; core.slice(1).forEach((n,i)=>ch[i%3].push(n)); ch.forEach(c=>c.forEach((n,i)=>par[n.id]=i===0?root.id:c[i-1].id));
    if(core.some(n=>{ const r=tal[n.id]||0,ok=n===root||n.free||(tal[par[n.id]]||0)>0,c=n.costs?n.costs[r]:talCost(r); return ok&&r<n.max&&c!=null&&tp>=c; }))return true; }
  for(const pt of (BASIC_PATHS[id]||[])){ const N=talentBranch(pt); if(N.some(n=>{ const r=tal[n.id]||0; return talNodeOpen(N,tal,n)&&r<n.max&&tp>=talNodeCost(n,r); }))return true; }
  return false; }catch(e){ return false; } }
// v7.9.53 ปุ่มเด้งตอนกด: จำกรอบของรูปที่วาดด้วย Graphics (Phaser ไม่มี getBounds ให้ Graphics) · ใช้หาชิ้นส่วนของปุ่มที่ถูกแตะ
(function(){ const G=typeof Phaser!=='undefined'&&Phaser.GameObjects&&Phaser.GameObjects.Graphics; if(!G||G.prototype._bbPatched)return; const P=G.prototype; P._bbPatched=true;
  const grow=(g,x,y,w,h)=>{ const b=g._bb||(g._bb={x0:1e9,y0:1e9,x1:-1e9,y1:-1e9}); if(x<b.x0)b.x0=x; if(y<b.y0)b.y0=y; if(x+w>b.x1)b.x1=x+w; if(y+h>b.y1)b.y1=y+h; };
  for(const m of ['fillRoundedRect','strokeRoundedRect','fillRect','strokeRect']){ const f=P[m]; if(f)P[m]=function(x,y,w,h,...r){ grow(this,x,y,w,h); return f.call(this,x,y,w,h,...r); }; }
  for(const m of ['fillCircle','strokeCircle']){ const f=P[m]; if(f)P[m]=function(x,y,rad,...r){ grow(this,x-rad,y-rad,rad*2,rad*2); return f.call(this,x,y,rad,...r); }; }
  const c=P.clear; if(c)P.clear=function(...a){ this._bb=null; return c.apply(this,a); };
})();
