/* ============================================================
   MOCHI MAYHEM — Prototype (Phaser 3)  v3
   - Floating joystick (left) + basic Dash button (right)
   - Active Skill button (player-triggered, cooldown)
   - Auto coatings (Sprinkle / Sugar Ring / Chili)
   - Pickups + level-up (manual tap hit-test)
   - No Toast meter (kept basic). One-thumb, mobile-first.
   ============================================================ */

const WORLD = 4000;
const COLORS = {
  bg1: 0x3b3357, mochi: 0xfff2f7, mochiEdge: 0xff9ec4, candy: 0xffd166,
  pink: 0xff85b3, grape: 0xa98cf0, toast: 0xf0b35a, mint: 0x66d3b3, ice: 0xa9dcff,
  grid: 0x4f456e,
};

/* ---- BALANCE 2.2: ค่ากลางเดียว ปรับง่ายและกัน power creep ---- */
const BALANCE = {
  moveSpeed: 166,
  // ปรับสมดุลใหม่ให้มี trade-off ชัด: ยิงไว = ดาเมจเบา · ออกช้า = ดาเมจหนัก
  skillPower: {
    sprinkle:0.82, star:0.95, thunder:0.80, whirl:0.88,   // sprinkle/whirl = สายสแปมเบา
    boomer:1.00, frost:0.72, popcorn:0.78, bubble:1.05,
    mine:1.00, beam:1.15, meteor:1.18, cloud:0.85,   // beam/meteor = นุ๊กหนักออกช้า
    rocket:1.12, mirror:0.88, decoy:0.82,
  },
};

const TAU = Math.PI * 2;   // global — Game scene (บอส/VFX) อ้างถึง TAU ด้วย เดิมประกาศเฉพาะใน Boot.create → "TAU is not defined"

/* ---- เวอร์ชัน + บันทึกUpdates (build-www ดึงไปทำ version.json ให้หน้า download) ---- */
const GAME_VERSION = '4.14.0';
const RELEASES_URL = 'https://github.com/hardza1230/Survival-like-Mobile-Game/releases/download/latest/mochi-mayhem-debug.apk';
const CHANGELOG = [
  { v:'4.14.0', date:'2026-09-20', title:'Sesame reworked into a Mirror Beam sniper', items:[
    'Sesame now attacks with a Mirror Beam that auto-targets bosses/minibosses and hits them at FULL damage — fixing how helpless it was against bosses',
    'Standing still charges Focus, making the beam stronger and wider; the bullet Guard still drains and recharges while moving, so in-and-out play is rewarded',
    'Upgrades reinterpreted for the beam (damage / fire rate / extra beams / length); evolved adds an extra beam',
  ]},
  { v:'4.13.0', date:'2026-09-20', title:'Field readability fixes & Mint spear rework', items:[
    'Fixed the Stage 1 boss acid pools rendering full-size and blocking the whole screen — they are now small, semi-transparent floor puddles under the character',
    'Field items no longer appear giant: pickups now use a fixed on-field size regardless of art resolution (the gift-box icon was rendering at 256px)',
    'Mint now fires straight ice spears again (no homing) — a single spear at Lv1, two at Lv4+, three when evolved — and the spear is smaller',
  ]},
  { v:'4.12.0', date:'2026-09-20', title:'Complete Bestiary — every monster tracked', items:[
    'Bestiary now tracks each boss and miniboss per stage as its own entry (Ant Empress, Clogmaw, Mr. Griddle, Ice Cream Golem, The Great Hunger, The Rootmother and their minibosses)',
    'Per-monster permanent stat bonuses were kept small so the fuller Bestiary does not inflate power',
    'Old boss/miniboss kill counts migrate into the Stage 1 entries automatically',
  ]},
  { v:'4.11.0', date:'2026-09-20', title:'Sesame trade-off rework', items:[
    'Sesame no longer wins by standing still: the mirror field now runs on a Guard meter that drains as it blocks bullets and recharges faster while moving',
    'Standing still builds Focus (bigger, stronger field) but burns Guard — reposition to recharge, rewarding in-and-out play',
    'Field colour signals state: gold when Focus is high, red when Guard is nearly out',
  ]},
  { v:'4.10.0', date:'2026-09-20', title:'Character tuning & Zone Modifier rerolls', items:[
    'Zone Modifiers are now rolled with a Chaos currency Reroll (or cleared for a safe run) instead of freely stacked, to keep rewards in check',
    'Cocoa reworked into a sturdy bruiser: lighter hits, only 2 slams (shockwave needs the Breaker mutation), higher HP and regen',
    'Taro lightning now strikes the nearest enemy first instead of scattering to far high-HP targets',
  ]},
  { v:'4.9.0', date:'2026-09-20', title:'Zone Modifiers (endgame challenge)', items:[
    'Unlock after clearing the Chapter 1 final boss: stackable Zone Modifiers make a stage harder for bigger rewards',
    'Toggle Toughened / Ferocious / Swarm Lord / Nightmare from the difficulty screen; effects and reward multipliers stack',
    'Kept gated so new players learn the core game first before challenge layers appear',
  ]},
  { v:'4.8.0', date:'2026-09-20', title:'Stats panel, Bestiary stats & character tuning', items:[
    'New Character Stats screen (Gear & Power) shows real numbers — Attack Power, HP, Crit, Defense, Speed, Cooldown, Regen',
    'Bestiary now grants permanent stats again, expanded to 8 kill tiers with much bigger bonuses at high tiers',
    'Strawberry fires a little slower; Mint attacks faster and its frost lances home + shatter in a guaranteed AoE so they actually connect',
  ]},
  { v:'4.7.0', date:'2026-09-20', title:'Flavor Passive tree & faster ranks', items:[
    'Rank Perks are now a 3-tier passive tree: Tier 2 unlocks after 3 points in Tier 1, Tier 3 after 8 points, with two new Mastery nodes (Iron Will, Fortune)',
    'Cores now cap at Lv3 instead of Lv5, so you rank up and earn RP faster',
  ]},
  { v:'4.6.0', date:'2026-09-20', title:'Mochi Bazaar rework', items:[
    'Buy tab is now one-time stock that restocks every time you clear a stage; goods scale with the cleared Zone Level',
    'Gamble now spins like a slot machine and reveals your prize with the real artwork',
    'Bazaar purchases roll Item Level from the last cleared Zone',
  ]},
  { v:'4.5.0', date:'2026-09-20', title:'Enhancement risk & inline gear actions', items:[
    'Enhancement now goes to +10: +4 and up can break (drop a level, never below +3), and +8–+10 can destroy the item',
    'Equipment screen adds a Craft-this shortcut (jump straight to the Craft Bench) and a Sell-for-Sugar action',
    'Enhance shows success / break / destroy with clear feedback',
  ]},
  { v:'4.4.0', date:'2026-09-20', title:'Item level scaling, Zone Level & navigation', items:[
    'Item Level now shifts the affix Tier roll in 10-level bands — higher iLv rolls better Tiers more often',
    'Added Zone Level (stage progression × difficulty, 1–18) as a single difficulty scalar for future systems; shown on the stage HUD',
    'Back button now returns to the previous screen instead of jumping straight to the main menu',
    'Reward Inbox moved to the bottom of the Gear & Power menu',
  ]},
  { v:'4.3.1', date:'2026-09-20', title:'Craft Bench readability pass', items:[
    'Gear tiles and the item card are now tinted by rarity (Magic/Rare/Epic/Legend) with a corner rarity dot',
    'Affix and possible-stat rows show a left colour stripe — orange for Offense (prefix), teal for Utility (suffix) — with an on-screen legend',
    'Stat names are emphasised and value ranges dimmed so the eye lands on what matters',
  ]},
  { v:'4.3.0', date:'2026-09-20', title:'Bug fixes: black boxes, gacha art, random crafting', items:[
    'Fixed field items (Scent Crystal, Heal, gimmicks) rendering as black boxes on some devices — gave every item SVG an explicit size and removed the shadow filter that broke in Android WebView',
    'Gacha reveal now shows the real gear artwork instead of a fallback emoji',
    'Reworked crafting: you now see the possible stats, and spending currency rolls one at random and highlights the result (no more hand-picking the exact mod)',
  ]},
  { v:'4.2.8', date:'2026-09-20', title:'Image-generated weapon art', items:[
    'Replaced all 22 weapon SVG icons with individually generated transparent raster artwork',
    'Completed a unified 44-item PNG equipment collection across every playable slot',
    'Normalized all weapon icons to centered 256×256 RGBA assets for mobile inventory rendering',
  ]},
  { v:'4.2.7', date:'2026-09-20', title:'Image-generated wearable equipment art', items:[
    'Replaced all 22 wearable SVG icons with individually generated transparent raster artwork',
    'Standardized every production icon to a centered 256×256 RGBA PNG for fast mobile rendering',
    'Preserved item-specific silhouettes and stronger visual progression from Common to Legendary',
  ]},
  { v:'4.2.6', date:'2026-09-20', title:'Equipment art visible in every slot', items:[
    'Replaced emoji-only equipped-slot rendering with the production gear artwork',
    'Added real gear thumbnails to Equipped and Selected comparison cards',
    'Kept slot symbols only for empty starter items and as a safe texture fallback',
  ]},
  { v:'4.2.5', date:'2026-09-20', title:'Complete field item art', items:[
    'Added production vector art for Heal Mochi, Gear Gift and all six chapter gimmick pickups',
    'Gave every gimmick a unique mobile-readable silhouette instead of reusing skill icons',
    'Connected field drops to real textures while preserving existing lightweight fallbacks',
  ]},
  { v:'4.2.4', date:'2026-09-20', title:'Complete wearable equipment art', items:[
    'Added 22 transparent vector icons for every non-starter Gloves, Armor, Boots, Amulet and Ring base',
    'Matched the existing weapon icon system with rarity-scaled silhouettes, materials and glow',
    'Connected the new art to Equipment, Compare and Craft screens through gear base texture keys',
  ]},
  { v:'4.2.3', date:'2026-09-20', title:'Currency art and mobile UI spacing', items:[
    'Connected all eight transparent currency icons to Crafting and Bazaar UI',
    'Reflowed Craft Bench actions into a readable 2×2 grid and added a live Currency Pouch',
    'Expanded Main Menu cards, shortened subtitles and constrained text to prevent overflow',
  ]},
  { v:'4.2.2', date:'2026-09-20', title:'Crafting currency drop balance', items:[
    'Made Spark Sugar, Twist Cream and Plain Dough the common experimentation resources',
    'Moved Fading Gumdrop out of common rewards and capped it at a low targeted-removal weight',
    'Reserved Wish Candy and Crystal Glaze primarily for Epic and Legendary reward pools',
  ]},
  { v:'4.2.1', date:'2026-09-20', title:'Confectionery crafting currencies', items:[
    'Renamed all eight crafting currencies with original Mochi Mayhem confectionery identities',
    'Kept internal currency keys and save data unchanged for full backward compatibility',
    'Rewrote descriptions around focused line crafting so each resource has one clear purpose',
  ]},
  { v:'4.2.0', date:'2026-09-20', title:'Mobile focused crafting', items:[
    'Replaced the PoE-style orb grid with a tap-first line crafting flow',
    'Select an affix line, choose the exact stat to search for, then spend the contextual currency',
    'Each item now shows its compatible affix pool, best possible tier and value range',
    'Added an extensible base-exclusive mod registry for future special item bases',
  ]},
  { v:'4.1.0', date:'2026-09-20', title:'Equipment completion — Reward Inbox & salvage', items:[
    'Added a five-slot Reward Inbox for loot received while the 24-slot bag is full',
    'Added per-instance claim and dismantle actions with clear shard values',
    'Added safe auto-dismantle modes for Common or Common+Rare gear only',
    'Favorite, locked, equipped, Epic and Legendary items are protected from automatic salvage',
  ]},
  { v:'4.0.0', date:'2026-09-20', title:'Equipment Phase 4 — chapter loot & weapon art', items:[
    'Craft Bench now selects and crafts a specific item instance; locked items are protected',
    'Item Level 1–100 is split across five chapters with affix-tier gates and capped power growth',
    'Drops, gacha, forging and Bazaar now keep useful duplicate bases with different rolls',
    'Expanded weapons from 6 to 22 and added a complete vector icon set',
  ]},
  { v:'3.9.0', date:'2026-09-20', title:'Equipment compare — stat deltas & quick equip', items:[
    'Added side-by-side Equipped vs Selected comparison with normalized stat values',
    'Positive deltas are green, negative deltas are red, with one-tap Quick Equip',
  ]},
  { v:'3.8.0', date:'2026-09-20', title:'Equipment inventory — instance grid', items:[
    'Added a portrait inventory grid with per-slot new-item alerts, pagination and instance selection',
    'Added Favorite and Lock controls while keeping Equip and Enhance available during the transition',
  ]},
  { v:'3.7.0', date:'2026-09-20', title:'Equipment v2 foundation — item instances', items:[
    'Added unique item instances so the same gear base can hold different affixes, craft states and enhancement levels',
    'Added a safe legacy-save migration with 24-slot inventory metadata while preserving equipped gear and progress',
  ]},
  { v:'3.6.0', date:'2026-09-19', title:'Animated main menu — layered parallax', items:[
    'Added visible layered parallax motion to the main-menu artwork',
    'Added subtle sparkles and moving light effects for a livelier presentation',
  ]},
  { v:'3.5.0', date:'2026-09-19', title:'English UI (Phase 5) — 100% English', items:[
    'Translated every remaining in-game string: skill/boss banners, phase telegraphs, enemy names, wave beats, results & victory screens, gacha boxes, revive/death panels',
    'The game is now fully English for the global launch',
  ]},
  { v:'3.4.0', date:'2026-09-19', title:'English UI (Phase 4a) — story & chapters', items:[
    'Translated stage story beats, character reactions, chapters, achievements, wave objectives and gimmicks',
    'Remaining in-game skill/boss banners and enemy names translate next',
  ]},
  { v:'3.3.0', date:'2026-09-19', title:'English UI (Phase 3b) — all menu screens', items:[
    'Translated Gear, Craft, Bazaar, Cookbook, Bestiary, Daily, Achievements, Endgame and the How-to-Play screens',
    'In-game story beats, wave banners and per-stage enemy names translate next',
  ]},
  { v:'3.2.0', date:'2026-09-19', title:'English UI (Phase 3) — gear & stages', items:[
    'Translated equipment, currencies, rank perks, gear sets and stage/boss names',
    'Menu screens now show English data; remaining screen labels & story translate next',
  ]},
  { v:'3.1.0', date:'2026-09-19', title:'English UI (Phase 2) — skills & cards', items:[
    'Translated skills, passives, characters, talents, uniques, combos, affixes and tier text',
    'Level-up cards, Awaken cards and difficulty tiers now in English',
    'Story, gear/craft/bazaar menus and changelog translate next',
  ]},
  { v:'3.0.0', date:'2026-09-19', title:'English UI (Phase 1) — global launch', items:[
    'Game language switched to English for the global market',
    'Phase 1 translated: main menu, settings, difficulty, tutorial, HUD, pause',
    'Skills, story and deep menus translate in the next phases',
  ]},
  { v:'2.99.1-1.0.0', date:'2025-2026', title:'Development history (v1.0.0 -> v2.99.1)', items:[
    'Full pre-launch development: 5 kitchen stages + 5 bosses, 6 characters, 23 skills, talents, gear/crafting, a PoE-style economy, quests, cloud save and the Google Play store build',
    'Detailed patch notes for this period were kept in Thai during development and have been condensed here for the English release',
  ]},
];

/* ============================================================
   Sfx — จัดการเสียงEffect (SFX) และดนตรีประกอบ (BGM)
   เล่นไฟล์เสียงจริงจาก assets/audio/ passives้อม fallback เสียงสังเคราะห์
   ============================================================ */
const Sfx = {
  ctx:null, master:null, muted:false, _noise:null, _last:{},
  _currentBgm:null, _currentBgmKey:'',
  ensure(){
    if(this.ctx) return this.ctx;
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return null;
    this.ctx=new AC();
    this.master=this.ctx.createGain(); this.master.gain.value=0.24; this.master.connect(this.ctx.destination);
    const len=Math.floor(this.ctx.sampleRate*0.4), buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1; this._noise=buf;
    return this.ctx;
  },
  unlock(){ this.ensure(); if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); if(!this._currentBgm)this.playMainBgm(); },
  toggle(){
    this.muted=!this.muted;
    if(this.master)this.master.gain.value=this.muted?0:0.24;
    if(window.__g && window.__g.sound) window.__g.sound.mute=this.muted;
    return this.muted;
  },
  _ok(key,gap){ const t=(this.ctx?this.ctx.currentTime:0); if((this._last[key]||-9)+gap>t)return false; this._last[key]=t; return true; },
  playFile(key, vol=0.5){
    if(this.muted)return false;
    try{if(window.__g&&window.__g.cache&&window.__g.cache.audio&&window.__g.cache.audio.exists(key)){window.__g.sound.play(key,{volume:Math.min(0.42,vol*0.68)});return true;}}catch(e){}
    return false;
  },
  duckBgm(ms=520,amount=0.48){
    const bg=this._currentBgm;if(!bg||!bg.isPlaying||this.muted)return;
    const normal=this._bgmIntense?0.34:(this._currentBgmKey==='bgm_main'?0.28:0.30);bg.setVolume(normal*amount);clearTimeout(this._duckTimer);
    this._duckTimer=setTimeout(()=>{if(bg===this._currentBgm&&bg.isPlaying)bg.setVolume(this.muted?0:normal);},ms);
  },
  tone(freq,dur,type='sine',vol=0.3,slideTo=0,delay=0){
    if(!this.ctx||this.muted)return;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t0);
    if(slideTo>0)o.frequency.exponentialRampToValueAtTime(slideTo,t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+Math.min(0.02,dur*0.3));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0+dur+0.03);
  },
  noise(dur,vol=0.3,delay=0,hp=false){
    if(!this.ctx||this.muted||!this._noise)return;
    const t0=this.ctx.currentTime+delay, s=this.ctx.createBufferSource(), g=this.ctx.createGain();
    s.buffer=this._noise; g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    let node=s;
    if(hp){ const f=this.ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=900; s.connect(f); node=f; }
    node.connect(g); g.connect(this.master); s.start(t0); s.stop(t0+dur+0.02);
  },
  seq(notes,type='triangle',vol=0.26,step=0.1){ notes.forEach((f,i)=>this.tone(f,step*1.7,type,vol,0,i*step)); },

  // --- SFX mix: เสียงถี่เบา/ห่างขึ้น และเสียงสำคัญ duck เพลงชั่วคราว ---
  shoot(){if(this._ok('shoot',0.12)){if(!this.playFile('sfx_shoot',0.25))this.tone(920,0.045,'triangle',0.035,1280);}},
  pop(){if(this._ok('pop',0.11)){if(!this.playFile('sfx_hit',0.22))this.tone(430,0.055,'sine',0.045,240);}},
  streak(step){const base=540+step*150;this.tone(base,0.10,'triangle',0.075,base+300);this.tone(base*1.5,0.11,'sine',0.05,base*1.5+240,0.05);},   // เสียงคอมโบ pitch สูงขึ้นตามสเต็ป
  xp(){if(this._ok('xp',0.16)){if(!this.playFile('sfx_xp',0.16))this.tone(760,0.05,'sine',0.035,1020);}},
  hurt(){if(this._ok('hurt',0.42)){this.duckBgm(300,0.68);if(!this.playFile('sfx_hit',0.42))this.tone(270,0.14,'triangle',0.09,120);}},
  dash(){if(this._ok('dash',0.25)){if(!this.playFile('sfx_dash',0.34))this.noise(0.11,0.055,0,true);}},
  ult(type){if(!this._ok('ult',0.5))return;this.duckBgm(650,0.42);if(type==='vortex'&&this.playFile('sfx_ult_vortex',0.48))return;if(!this.playFile('sfx_ult_bomb',0.48))this.seq([660,880,1180],'triangle',0.10,0.07);},
  zap(){if(this._ok('zap',0.18)){if(!this.playFile('sfx_donut',0.28))this.tone(1250,0.07,'triangle',0.055,540);}},
  boom(){if(this._ok('boom',0.24)){if(!this.playFile('sfx_ult_bomb',0.32))this.tone(150,0.18,'sine',0.08,65);}},
  frost(){if(this._ok('frost',0.24)){if(!this.playFile('sfx_frost',0.34))this.seq([1050,1450],'sine',0.055,0.06);}},
  levelup(){if(!this._ok('levelup',0.6))return;this.duckBgm(650,0.45);if(!this.playFile('sfx_levelup',0.46))this.seq([523,659,784,1047],'triangle',0.12,0.1);},
  chest(){if(!this._ok('chest',0.7))return;this.duckBgm(700,0.42);if(!this.playFile('sfx_chest',0.48))this.seq([587,740,880,1175],'triangle',0.12,0.09);},
  select(){if(this._ok('select',0.16)&&!this.playFile('sfx_btn',0.28))this.tone(880,0.055,'sine',0.055,1200);},
  bossWarn(){if(!this._ok('bossWarn',1.1))return;this.duckBgm(900,0.34);if(!this.playFile('sfx_hazard',0.50))this.tone(105,0.48,'sawtooth',0.10,62);},
  clear(){if(!this._ok('clear',0.8))return;this.duckBgm(650,0.48);if(!this.playFile('sfx_levelup',0.42))this.seq([659,784,1047],'triangle',0.11,0.12);},
  victory(){this.duckBgm(1000,0.3);this.seq([523,659,784,1047,1319],'triangle',0.13,0.14);},
  dead(){this.duckBgm(900,0.3);this.seq([392,311,247,196],'sine',0.10,0.14);},
  heal(){if(this._ok('heal',0.28))this.seq([784,988,1319],'sine',0.07,0.06);},
  heartbeat(intensity){const v=0.05+0.05*(intensity||0);this.tone(58,0.10,'sine',v,40);this.tone(70,0.11,'sine',v*0.85,44,0.14);},   // เสียงหัวใจเต้น "thump-thump" ตอนใกล้ตาย

  // ===== เพลงพื้นหลัง (BGM จริง + สังเคราะห์ fallback) =====
  _playTrack(key,volume){
    if(this._currentBgmKey===key&&this._currentBgm&&this._currentBgm.isPlaying){this._currentBgm.setVolume(this.muted?0:volume);return true;}
    if(!(window.__g&&window.__g.cache&&window.__g.cache.audio&&window.__g.cache.audio.exists(key)))return false;
    const old=this._currentBgm;try{const next=window.__g.sound.add(key,{loop:true,volume:0});next.play();this._currentBgm=next;this._currentBgmKey=key;
      if(window.__g.tweens)window.__g.tweens.add({targets:next,volume:this.muted?0:volume,duration:650,ease:'Sine.inOut'});else next.setVolume(this.muted?0:volume);
      if(old){if(window.__g.tweens)window.__g.tweens.add({targets:old,volume:0,duration:480,onComplete:()=>{try{old.stop();old.destroy();}catch(e){}}});else{old.stop();old.destroy();}}return true;
    }catch(e){return false;}
  },
  playStageBgm(stageNum=1){const key='bgm_stage'+Math.max(1,Math.min(5,stageNum));this._bgmIntense=false;if(!this._playTrack(key,0.30)){this.stopBgm();this.startBgm();}},
  playBossBgm(stageNum=1){const key='bgm_boss'+Math.max(1,Math.min(5,stageNum));this._bgmIntense=true;if(!this._playTrack(key,0.34))this.bgmIntense(true);},
  playMainBgm(){this._bgmIntense=false;if(!this._playTrack('bgm_main',0.28)){this.stopBgm();this.startBgm();}},
  _bgmGain:null, _bgmTimer:null, _bgmStep:0, _bgmIntense:false,
  _bgmNote(freq,dur,type,vol,delay){ if(!this.ctx||!this._bgmGain)return;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+0.04); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this._bgmGain); o.start(t0); o.stop(t0+dur+0.03); },
  startBgm(){ this.ensure(); if(!this.ctx||this._bgmTimer)return;
    if(!this._bgmGain){ this._bgmGain=this.ctx.createGain(); this._bgmGain.gain.value=0.5; this._bgmGain.connect(this.master); }
    this._bgmStep=0; this._bgmLoop(); },
  stopBgm(){
    if(this._currentBgm){ try{ this._currentBgm.stop(); this._currentBgm.destroy(); }catch(e){} this._currentBgm=null; this._currentBgmKey=''; }
    if(this._bgmTimer){ clearTimeout(this._bgmTimer); this._bgmTimer=null; }
  },
  bgmIntense(on){this._bgmIntense=!!on;if(this._currentBgm&&this._currentBgm.isPlaying)this._currentBgm.setVolume(this.muted?0:(on?0.34:(this._currentBgmKey==='bgm_main'?0.28:0.30)));},
  _bgmLoop(){
    const roots=[130.81,110.00,174.61,196.00];
    const root=roots[this._bgmStep%roots.length];
    const bar=this._bgmIntense?1.35:1.9, beat=bar/4, base=root*2;
    this._bgmNote(root,beat*3.6,'sine',0.5,0);
    const arp=[base,base*1.25,base*1.5,base*2];
    arp.forEach((f,i)=>this._bgmNote(f,beat*0.9,'triangle',this._bgmIntense?0.24:0.2,i*beat));
    if(this._bgmStep%2===0) this._bgmNote(base*2,beat*0.6,'sine',0.12,beat*2);
    this._bgmStep++;
    this._bgmTimer=setTimeout(()=>this._bgmLoop(), bar*1000);
  },
};

/* ============================================================
   Boot — วาดกราฟิกน่ารักด้วย Canvas 2D (self-contained ไม่โหลดไฟล์นอก)
   ตัวละคร/ศัตรูมีเฉดสี เงานุ่ม แก้มชมพู ตาวาว หน้าตาต่างกัน
   ============================================================ */
/* ---- รูปจริง (AI/วาดมือ) ที่โหลดแทนกราฟิกโค้ด · เพิ่มไฟล์ = เติม key ที่นี่ ----
   key ต้องตรงกับ texture ที่เกมใช้ (char_momo/char_mint/char_cocoa/e_basic/...) · ไฟล์อยู่โฟลเดอร์ assets/
   · ASSET_IMAGES = รูปนิ่งเฟรมเดียว · ASSET_SHEETS = สไปรต์สตริปหลายเฟรม (frame=ขนาดเฟรม px)
     เฟรมเรียง [0 idle, 1 squash(ย่อกว้าง), 2 stretch(ยืดสูง), 3 blink(หลับตา)] */
const ASSET_IMAGES = {
  opening_world_gate_v3:'assets/opening_world_gate_v3.webp',
  menu_hub_v3:'assets/ui/menu_hub_v3.webp',
  chapter1_cover:'assets/ui/chapter1_cover.webp',
  chapter2_cover:'assets/ui/chapter2_cover.webp',
  currency_spark_sugar:'assets/ui/currency/spark-sugar.png',
  currency_twist_cream:'assets/ui/currency/twist-cream.png',
  currency_crown_icing:'assets/ui/currency/crown-icing.png',
  currency_wild_jam:'assets/ui/currency/wild-jam.png',
  currency_wish_candy:'assets/ui/currency/wish-candy.png',
  currency_crystal_glaze:'assets/ui/currency/crystal-glaze.png',
  currency_fading_gumdrop:'assets/ui/currency/fading-gumdrop.png',
  currency_plain_dough:'assets/ui/currency/plain-dough.png',
  heal:'assets/items/heal_mochi_heart.svg',
  gift:'assets/items/gear_gift.svg',
  item_scent_crystal:'assets/items/gimmick_scent_crystal.svg',
  item_clean_bubble:'assets/items/gimmick_clean_bubble.svg',
  item_chili_overcore:'assets/items/gimmick_chili_overcore.svg',
  item_frost_bell:'assets/items/gimmick_frost_bell.svg',
  item_memory_seed:'assets/items/gimmick_memory_seed.svg',
  item_ferment_drop:'assets/items/gimmick_ferment_drop.svg',
  gear_w_spoon:'assets/gear/weapons/w_spoon.png',
  gear_w_chop:'assets/gear/weapons/w_chop.png',
  gear_w_whisk:'assets/gear/weapons/w_whisk.png',
  gear_w_knife:'assets/gear/weapons/w_knife.png',
  gear_w_cleaver:'assets/gear/weapons/w_cleaver.png',
  gear_lg_starcleaver:'assets/gear/weapons/lg_starcleaver.png',
  gear_w_valve_saber:'assets/gear/weapons/w_valve_saber.png',
  gear_w_pressure_whisk:'assets/gear/weapons/w_pressure_whisk.png',
  gear_w_pipe_hammer:'assets/gear/weapons/w_pipe_hammer.png',
  gear_lg_tidefork:'assets/gear/weapons/lg_tidefork.png',
  gear_w_chili_sickle:'assets/gear/weapons/w_chili_sickle.png',
  gear_w_griddle_maul:'assets/gear/weapons/w_griddle_maul.png',
  gear_w_ember_skewer:'assets/gear/weapons/w_ember_skewer.png',
  gear_lg_sun_spatula:'assets/gear/weapons/lg_sun_spatula.png',
  gear_w_frost_spoon:'assets/gear/weapons/w_frost_spoon.png',
  gear_w_crystal_knife:'assets/gear/weapons/w_crystal_knife.png',
  gear_w_glacier_whisk:'assets/gear/weapons/w_glacier_whisk.png',
  gear_lg_aurora_lance:'assets/gear/weapons/lg_aurora_lance.png',
  gear_w_void_ladle:'assets/gear/weapons/w_void_ladle.png',
  gear_w_crown_cleaver:'assets/gear/weapons/w_crown_cleaver.png',
  gear_w_hunger_blade:'assets/gear/weapons/w_hunger_blade.png',
  gear_lg_flavorbound:'assets/gear/weapons/lg_flavorbound.png',
  gear_gl_mitt:'assets/gear/gloves/gl_mitt.png',
  gear_gl_silk:'assets/gear/gloves/gl_silk.png',
  gear_gl_iron:'assets/gear/gloves/gl_iron.png',
  gear_gl_dragon:'assets/gear/gloves/gl_dragon.png',
  gear_ar_apron:'assets/gear/armor/ar_apron.png',
  gear_ar_quilt:'assets/gear/armor/ar_quilt.png',
  gear_ar_plate:'assets/gear/armor/ar_plate.png',
  gear_ar_royal:'assets/gear/armor/ar_royal.png',
  gear_bo_soft:'assets/gear/boots/bo_soft.png',
  gear_bo_magnet:'assets/gear/boots/bo_magnet.png',
  gear_bo_swift:'assets/gear/boots/bo_swift.png',
  gear_bo_wind:'assets/gear/boots/bo_wind.png',
  gear_lg_comet:'assets/gear/boots/lg_comet.png',
  gear_am_ribbon:'assets/gear/amulets/am_ribbon.png',
  gear_am_clover:'assets/gear/amulets/am_clover.png',
  gear_am_star:'assets/gear/amulets/am_star.png',
  gear_am_moon:'assets/gear/amulets/am_moon.png',
  gear_lg_phoenix:'assets/gear/amulets/lg_phoenix.png',
  gear_ri_copper:'assets/gear/rings/ri_copper.png',
  gear_ri_silver:'assets/gear/rings/ri_silver.png',
  gear_ri_gold:'assets/gear/rings/ri_gold.png',
  gear_ri_diamond:'assets/gear/rings/ri_diamond.png',
  story_intro_fall:'assets/story/intro_fall.webp', story_final_hunger:'assets/story/final_hunger.webp',
  card_momo:'assets/character_cards/card_momo.png', card_mint:'assets/character_cards/card_mint_frostleaf.png',
  card_cocoa:'assets/character_cards/card_cocoa.png', card_taro:'assets/character_cards/card_taro.png',
  card_sesame:'assets/character_cards/card_sesame.png', card_berry:'assets/character_cards/card_berry.png',
  e_basic:   'assets/e_basic.png',
  e_fast:    'assets/e_fast.png',
  e_tank:    'assets/e_tank.png',
  e_shooter: 'assets/e_shooter.png',
  e_bomber:  'assets/e_bomber.png',
  e_ant_worker:'assets/generated/e_ant_worker.png', e_ant_scout:'assets/generated/e_ant_scout_fixed.png',
  e_ant_spitter:'assets/generated/e_ant_spitter.png', e_ant_soldier:'assets/generated/e_ant_soldier.png',
  e_ant_drone:'assets/generated/e_ant_drone.png',
  candy:     'assets/candy.png',       // ออร์บ EXP (ย้อมสีตามค่าได้ เพราะรูปขาว)
  e_drain_slime:'assets/generated/e_drain_slime.png', e_drain_dasher:'assets/generated/e_drain_dasher.png',
  e_drain_caster:'assets/generated/e_drain_caster.png', e_drain_bomber:'assets/generated/e_drain_bomber.png',
  e_drain_tank:'assets/generated/e_drain_tank.png',
  e_fire_ember:'assets/generated/e_fire_ember.png', e_fire_chili:'assets/generated/e_fire_chili.png',
  e_fire_grinder:'assets/generated/e_fire_grinder.png', e_fire_bomber:'assets/generated/e_fire_bomber.png',
  e_fire_golem:'assets/generated/e_fire_golem.png',
  e_ice_wisp:'assets/generated/e_ice_wisp.png', e_ice_shard:'assets/generated/e_ice_shard.png',
  e_ice_caster:'assets/generated/e_ice_caster.png', e_ice_bomber:'assets/generated/e_ice_bomber.png',
  e_ice_guardian:'assets/generated/e_ice_guardian.png',
  // Props อาร์ตจริงสำหรับฉากStage 2–5
  drain_grate:'assets/generated/drain_grate.png', drain_pipe:'assets/generated/drain_pipe.png',
  drain_sludge:'assets/generated/drain_sludge.png', drain_bubbles:'assets/generated/drain_bubbles.png',
  stove_furnace:'assets/generated/stove_furnace.png', stove_pipe:'assets/generated/stove_pipe.png',
  stove_gear:'assets/generated/stove_gear.png', stove_belt:'assets/generated/stove_belt.png',
  ice_cage:'assets/generated/ice_cage.png', ice_crystal:'assets/generated/ice_crystal.png',
  ice_chain:'assets/generated/ice_chain.png', ice_pool:'assets/generated/ice_pool.png',
  crown_oven:'assets/generated/crown_oven.png', hunger_seal:'assets/generated/hunger_seal.png',
  // boss3/boss4 ใช้ action sheet ใน ASSET_SHEETS เพื่อผูก pose กับ telegraph จริง
  mb1:'assets/generated/mb1_ant_guard.png', mb2:'assets/generated/mb2_valve_maw.png', mb3:'assets/mb3.png', mb4:'assets/mb4.png', mb5:'assets/mb5.png',   // Miniboss 5 ด่าน
  chest:'assets/chest.png', crate:'assets/crate.png', vac:'assets/vac.png',   // ไอเทม (รูปจริง แทนกราฟิกโค้ด)
  bg1:'assets/generated/bg1_sour_ant_nest.png', bg2:'assets/generated/bg2_rotting_drain.jpg', bg3:'assets/bg3.png', bg4:'assets/bg4.png', bg5:'assets/bg5.png', bg6:'assets/bg6.png',
  fx_frost:'assets/fx_frost.png', fx_donut:'assets/fx_donut.png',   // VFX รูปจริงที่ผ่านการตรวจ alpha แล้ว
  fx_ult_bomb:'assets/fx_ult_bomb.png', fx_ult_vortex:'assets/fx_ult_vortex.png',   // VFX อัลติ (bomb/blackhole)
  proj_rocket:'assets/proj_rocket.png', proj_fork:'assets/proj_fork.png', proj_boomer:'assets/proj_boomer.png',   // กระสุนรูปจริง (คีย์เขียว)
  // projectile sprite จริง — แทน spark/circle vector เดิม
  proj_sprinkle:'assets/generated/proj_sprinkle.png', proj_whirl:'assets/generated/proj_whirl.png',
  proj_frostlance:'assets/generated/proj_frostlance.png',   // หอกน้ำแข็งของมิ้นต์ (Frost Lance)
  proj_popcorn:'assets/generated/proj_popcorn.png', bubble:'assets/generated/proj_bubble.png',
  proj_enemy:'assets/generated/proj_enemy.png', proj_mine:'assets/generated/proj_mine.png',
  // static VFX sprite จริง — ขยาย/หมุน/เฟดด้วย tween แทนการวาด vector ทุกครั้ง
  vfx_ring:'assets/generated/vfx_hit_ring.png', vfx_poof:'assets/generated/vfx_spawn_poof.png',
  vfx_glow:'assets/generated/vfx_cast_glow.png', vfx_line:'assets/generated/vfx_speed_line.png',
  vfx_chain_bolt:'assets/generated/vfx_chain_bolt.png', vfx_telegraph:'assets/generated/vfx_telegraph.png',
  vfx_magic_circle:'assets/generated/vfx_magic_circle.png',   // วงเวทกระจกสมมาตร (โซน/สนาม)
  vfx_cloud_field:'assets/generated/vfx_cloud_field.png',
  vfx_cream_ring:'assets/generated/vfx_cream_ring.png',
  nest_hole:'assets/generated/nest_hole.png', nest_eggs:'assets/generated/nest_eggs.png',
  nest_crystal:'assets/generated/nest_crystal.png', nest_obelisk:'assets/generated/nest_obelisk.png',
  nest_mound:'assets/generated/nest_mound.png', nest_acid:'assets/generated/nest_acid.png',
  p_shelf:'assets/p_shelf.png', p_spicerack:'assets/p_spicerack.png', p_cupboard:'assets/p_cupboard.png', p_boxes:'assets/p_boxes.png', p_crate:'assets/p_crate.png', p_sugarbarrel:'assets/p_sugarbarrel.png',   // props ฉากStage 1 (คีย์เขียว)
  p_flour:'assets/p_flour.png', p_candybarrel:'assets/p_candybarrel.png', p_sack:'assets/p_sack.png', p_flourspill:'assets/p_flourspill.png', p_cans:'assets/p_cans.png', p_jars:'assets/p_jars.png',
  p_rollingpin:'assets/p_rollingpin.png', p_jamspice:'assets/p_jamspice.png', p_honey:'assets/p_honey.png', p_board:'assets/p_board.png', p_measure:'assets/p_measure.png', p_mouse:'assets/p_mouse.png',
  ui_talent_hall:'assets/ui_talent_hall.webp',
  proj_bear_donut:'assets/proj_bear_donut.png', vfx_choco_glaze:'assets/vfx_choco_glaze.png', vfx_bear_shockwave:'assets/vfx_bear_shockwave.png',
  ui_card_attack:'assets/ui/ui_card_attack.png', ui_card_power:'assets/ui/ui_card_power.png',
  ui_card_passive:'assets/ui/ui_card_passive.png', ui_card_awakened:'assets/ui/ui_card_awakened.png',
  ic_sprinkle:'assets/ic_sprinkle.png', ic_star:'assets/ic_star.png', ic_frost:'assets/ic_frost.png',
  ic_bubble:'assets/ic_bubble.png', ic_heart:'assets/ic_heart.png', ic_magnet:'assets/ic_magnet.png', ic_sugar:'assets/ic_sugar.png',
  // ไอคอนAttack Skillชุดใหม่ (12 ตัว · gen แผ่นเดียว 4×3 หั่นด้วย scripts/cut-skill-icons.mjs) → ครบ 17 Attack Skill
  ic_thunder:'assets/ic_thunder.png', ic_whirl:'assets/ic_whirl.png', ic_boomer:'assets/ic_boomer.png', ic_popcorn:'assets/ic_popcorn.png',
  ic_aura:'assets/ic_aura.png', ic_fork:'assets/ic_fork.png', ic_mine:'assets/ic_mine.png', ic_beam:'assets/ic_beam.png',
  ic_meteor:'assets/ic_meteor.png', ic_cloud:'assets/ic_cloud.png', ic_rocket:'assets/ic_rocket.png', ic_wave:'assets/ic_wave.png',
  ic_bear_donut:'assets/ic_bear_donut.png', ic_mirror:'assets/ic_mirror.png', ic_memory:'assets/ic_memory.png',
  ic_thread:'assets/ic_thread.png', ic_decoy:'assets/ic_decoy.png', ic_triseal:'assets/ic_triseal.png', ic_echo_step:'assets/ic_echo_step.png',
  // ไอคอนพรชุดใหม่ (สไตล์เดียวกับสกิล) — power/swift/haste/crit/guard/regen · heart/magnet ใช้ของเดิม (heart รีเจนใหม่แล้ว)
  ic_power:'assets/ic_power.png', ic_swift:'assets/ic_swift.png', ic_haste:'assets/ic_haste.png',
  ic_crit:'assets/ic_crit.png', ic_guard:'assets/ic_guard.png', ic_regen:'assets/ic_regen.png',
  ic_flavor_core:'assets/ic_flavor_core.png', ic_memory_thread:'assets/ic_memory_thread.png',
  ic_bitter_resolve:'assets/ic_bitter_resolve.png', ic_returning_taste:'assets/ic_returning_taste.png',
  // ไอคอนการ์ดเลเวลอัพ — ภาพเฉพาะใบเพื่อแยกดาเมจ/ความเร็ว/ระยะ/Effectได้ทันทีบนมือถือ
  ic_momo_power:'assets/icons/levelup/momo_power.png', ic_momo_rate:'assets/icons/levelup/momo_rate.png',
  ic_momo_size:'assets/icons/levelup/momo_size.png', ic_momo_volley:'assets/icons/levelup/momo_volley.png',
  ic_cocoa_power:'assets/icons/levelup/cocoa_power.png', ic_cocoa_rate:'assets/icons/levelup/cocoa_rate.png',
  ic_cocoa_size:'assets/icons/levelup/cocoa_size.png', ic_cocoa_combo:'assets/icons/levelup/cocoa_combo.png',
  ic_berry_power:'assets/icons/levelup/berry_power.png', ic_berry_rate:'assets/icons/levelup/berry_rate.png',
  ic_berry_size:'assets/icons/levelup/berry_size.png', ic_berry_cluster:'assets/icons/levelup/berry_cluster.png',
  ic_sweet_recovery:'assets/icons/levelup/sweet_recovery.png', ic_mochi_vitality:'assets/icons/levelup/mochi_vitality.png',
  ic_flavor_regen:'assets/icons/levelup/flavor_regeneration.png', ic_sugar_on_kill:'assets/icons/levelup/sugar_on_kill.png',
  // ไอคอนอัปเกรดเฉพาะตัว: Mint / Taro / Sesame
  ic_mint_power:'assets/icons/levelup/mint_power.png', ic_mint_rate:'assets/icons/levelup/mint_rate.png',
  ic_mint_chill:'assets/icons/levelup/mint_chill.png', ic_mint_linger:'assets/icons/levelup/mint_linger.png',
  ic_taro_power:'assets/icons/levelup/taro_power.png', ic_taro_rate:'assets/icons/levelup/taro_rate.png',
  ic_taro_arc:'assets/icons/levelup/taro_arc.png', ic_taro_surge:'assets/icons/levelup/taro_surge.png',
  ic_sesame_power:'assets/icons/levelup/sesame_power.png', ic_sesame_rate:'assets/icons/levelup/sesame_rate.png',
  ic_sesame_pane:'assets/icons/levelup/sesame_pane.png', ic_sesame_radius:'assets/icons/levelup/sesame_radius.png',
};
// map skills/พร → ไอคอนรูปจริง (มีเท่าที่อาร์ตทำมา · null=ใช้อีโมจิ)
const SKILL_ICON = { sprinkle:'ic_sprinkle', star:'ic_star', frost:'ic_frost', bubble:'ic_bubble',
  thunder:'ic_thunder', whirl:'ic_whirl', boomer:'ic_boomer', popcorn:'ic_popcorn',
  mine:'ic_mine', beam:'ic_beam', meteor:'ic_bear_donut', cloud:'ic_cloud', rocket:'ic_rocket',
  mirror:'ic_mirror', decoy:'ic_decoy' };
const SKILL_CARD_COLOR = {
  sprinkle:0xff76ae, star:0xffc447, thunder:0xffd84d, whirl:0x7ac7ff, boomer:0xf0a13b,
  frost:0x76d8ff, popcorn:0xffb64d, bubble:0x67dec4, mine:0xff7cae, beam:0xffd166,
  meteor:0xc58a5b, cloud:0x7ed6aa, rocket:0xff6578, mirror:0x8acbff, decoy:0x78dfca,
};
const PASS_ICON  = { heart:'ic_mochi_vitality', magnet:'ic_magnet', power:'ic_power', swift:'ic_swift', haste:'ic_haste', crit:'ic_crit', guard:'ic_guard', regen:'ic_flavor_regen', sugarOnKill:'ic_sugar_on_kill',
  flavorCore:'ic_flavor_core', bitterResolve:'ic_bitter_resolve', returningTaste:'ic_returning_taste' };
const ASSET_SHEETS = {
  // คง key char_momo เพื่อให้เซฟเก่าใช้ต่อได้ แต่เปลี่ยนภาพเป็น Strawberry Fighter
  char_momo:  { url:'assets/char_momo_fighter_sheet.png', frame:128 },
  char_momo_run:{ url:'assets/char_momo_run_sheet.png', frame:128 },
  // Frostleaf Sentinel — คง key char_mint เพื่อWaitงรับเซฟเดิม
  char_mint:  { url:'assets/char_mint_frostleaf_sheet.png',  frame:128 },
  char_mint_run:{ url:'assets/char_mint_frostleaf_run_sheet.png', frame:128 },
  char_cocoa: { url:'assets/char_cocoa_awakened_sheet.png', frame:128 },
  char_cocoa_run:{ url:'assets/char_cocoa_run_sheet.png', frame:128 },
  char_berry: { url:'assets/char_berry_core_sheet.png', frame:128 },
  char_berry_run:{ url:'assets/char_berry_core_run_sheet.png', frame:128 },
  char_taro:  { url:'assets/char_taro_awakened_sheet.png', frame:128 },
  char_sesame:{ url:'assets/char_sesame_awakened_sheet.png', frame:128 },
  fx_star_guard:{ url:'assets/fx_star_guard_sheet.png', frame:128, anim:{frames:8,rate:14} },
  // บอสหลัก: action sheet 8 เฟรม ผูก pose กับท่าจริง
  boss1:      { url:'assets/generated/boss1_green_ant_queen_sheet.png', frame:160 },
  boss2:      { url:'assets/generated/boss2_clogmaw_sheet.png', frame:256, anim:{frames:2, rate:3, yoyo:true} },
  boss3:      { url:'assets/boss3_sheet.png', frame:256 },
  boss4:      { url:'assets/boss4_sheet.png', frame:256 },
  boss5_sovereign:{ url:'assets/boss5_sovereign_sheet.png', frame:256 },
  mb5_banquet_executioner:{ url:'assets/mb5_banquet_executioner_sheet.png', frame:256, anim:{frames:4,rate:6,yoyo:true} },
  e_void_crumb:{ url:'assets/e_void_crumb_sheet.png', frame:256, anim:{frames:4,rate:8,yoyo:true} },
  e_crown_ripper:{ url:'assets/e_crown_ripper_sheet.png', frame:256, anim:{frames:4,rate:12} },
  e_banquet_eye:{ url:'assets/e_banquet_eye_sheet.png', frame:256, anim:{frames:4,rate:7,yoyo:true} },
  e_maw_truffle:{ url:'assets/e_maw_truffle_sheet.png', frame:256, anim:{frames:4,rate:8,yoyo:true} },
  e_royal_oven_sentinel:{ url:'assets/e_royal_oven_sentinel_sheet.png', frame:256, anim:{frames:4,rate:6,yoyo:true} },
  ch2_enemy_atlas:{ url:'assets/ch2_enemy_atlas.png', frame:256 },
  ch2_prop_atlas:{ url:'assets/ch2_prop_atlas.png', frame:256 },
  mb6_sporewarden:{ url:'assets/mb6_sporewarden_sheet.png', frame:256, anim:{frames:2,rate:4,yoyo:true} },
  boss6_rootmother:{ url:'assets/boss6_rootmother_sheet.png', frame:256 },
  e_acid:     { url:'assets/generated/e_acid_ant_sheet.png', frame:96, anim:{frames:3, rate:9} },
  // ศัตรูอนิเมชัน (walk/attack cycle) — frame=ขนาดเดิม (setScale/setCircle เดิมใช้ได้ ไม่ต้องแก้)
  e_dasher:   { url:'assets/e_dasher_sheet.png',   frame:88,  anim:{frames:4, rate:13} },  // มดวิ่ง 4 เฟรม
  e_siege:    { url:'assets/e_siege_sheet.png',    frame:110, anim:{frames:4, rate:7}  },  // ปืนคัพเค้ก idle/ยิง 4 เฟรม
  boss5:      { url:'assets/boss5_sheet.png',      frame:160, anim:{frames:3, rate:4, yoyo:true} },  // เชฟขม idle: IDLE/HOVER/ACTIVE (ยกที่ตีเรืองแสง)
};

/* ---- VFX flipbook sheets (อนิเมชันหลายเฟรม เล่นไล่เฟรม) ----
   เฟรมไม่จำเป็นต้องจตุรัส (fw×fh) · แต่ละไฟล์เป็น sprite strip พื้นดำ → เล่นด้วย additive blend
   frames=จำนวนเฟรม · rate=fps · anchor=จุดยึด origin ('left'=ยิงจากตัวออกไป, 'center'=ระเบิดกลาง) */
const ASSET_FX = {
  fx_flickerstrike:{ url:'assets/generated/fx_flickerstrike_sheet.png', fw:256, fh:256, frames:8, rate:34, anchor:'center' },   // Effectฟันของโกโก้ (Flicker Strike)
  fx_beam:     { url:'assets/fx_beam_sheet.png',     fw:352, fh:366, frames:8, rate:26, anchor:'left'   },
  fx_boom:     { url:'assets/fx_boom_sheet.png',     fw:352, fh:366, frames:8, rate:24, anchor:'center' },
  fx_frostnova:{ url:'assets/fx_frostnova_sheet.png',fw:352, fh:366, frames:8, rate:24, anchor:'center' },
  fx_vortex:   { url:'assets/fx_vortex_sheet.png',   fw:352, fh:366, frames:8, rate:22, anchor:'center' },
  fx_slash:    { url:'assets/fx_slash_sheet.png',    fw:352, fh:366, frames:8, rate:30, anchor:'left'   },
  fx_levelup:  { url:'assets/fx_levelup_sheet.png',  fw:61,  fh:64,  frames:8, rate:24, anchor:'center' },
  fx_thunder:  { url:'assets/fx_thunder_sheet.png',  fw:61,  fh:64,  frames:8, rate:30, anchor:'bottom' },
  fx_heal:     { url:'assets/fx_heal_sheet.png',     fw:352, fh:366, frames:8, rate:22, anchor:'center' },
  fx_wave:     { url:'assets/fx_wave_sheet.png',     fw:352, fh:366, frames:8, rate:26, anchor:'center' },
  fx_bubble:   { url:'assets/fx_bubble_sheet.png',   fw:352, fh:366, frames:8, rate:22, anchor:'center' },
  fx_popcorn:  { url:'assets/fx_popcorn_sheet.png',  fw:352, fh:366, frames:8, rate:24, anchor:'center' },
  fx_aura:     { url:'assets/fx_aura_sheet.png',     fw:352, fh:366, frames:8, rate:14, anchor:'center', loop:true },   // ออร่าถาวร วนลูป
  fx_mine:     { url:'assets/fx_mine_sheet.png',     fw:61,  fh:70,  frames:8, rate:24, anchor:'center' },
  fx_donutimpact:{ url:'assets/fx_donutimpact_sheet.png',fw:286,fh:92,frames:8,rate:24, anchor:'center' },
  fx_bossnova: { url:'assets/fx_bossnova_sheet.png', fw:286, fh:64,  frames:8, rate:22, anchor:'center' },
  fx_bosssummon:{ url:'assets/fx_bosssummon_sheet.png',fw:61, fh:68,  frames:8, rate:20, anchor:'center' },
  fx_bossportal:{ url:'assets/fx_bossportal_sheet.png',fw:127,fh:127, frames:8, rate:20, anchor:'center' },
  fx_enrage:   { url:'assets/fx_enrage_sheet.png',   fw:61,  fh:61,  frames:8, rate:16, anchor:'center', loop:true },   // ออร่าEnragedบอส วนลูป
};

/* ---- ไฟล์เสียงจริง (SFX + BGM) ---- */
const ASSET_AUDIO = {
  sfx_shoot:      'assets/audio/sfx/sfx_skill_sprinkle.wav',
  sfx_hit:        'assets/audio/sfx/sfx_hit_monster.wav',
  sfx_xp:         'assets/audio/sfx/sfx_pickup_sugar.wav',
  sfx_dash:       'assets/audio/sfx/sfx_jump_squish.wav',
  sfx_levelup:    'assets/audio/sfx/sfx_levelup_fanfare.wav',
  sfx_chest:      'assets/audio/sfx/sfx_chest_open.wav',
  sfx_btn:        'assets/audio/sfx/sfx_btn_click.wav',
  sfx_frost:      'assets/audio/sfx/sfx_skill_frost.wav',
  sfx_ult_bomb:   'assets/audio/sfx/sfx_ult_sugarbomb.wav',
  sfx_ult_vortex: 'assets/audio/sfx_vfx_ult_cocoavortex.wav',
  sfx_donut:      'assets/audio/sfx_vfx_proj_donut.wav',
  sfx_hazard:     'assets/audio/sfx_vfx_telegraph_hazard.wav',
  bgm_main:       'assets/audio/bgm/Main menu.mp3',
  bgm_stage1:     'assets/audio/bgm/clockmakers_tea_break.mp3',
  bgm_boss1:      'assets/audio/bgm/bgm_boss1.mp3',
  bgm_boss2:      'assets/audio/bgm/bgm_boss2.mp3',
  bgm_boss3:      'assets/audio/bgm/bgm_boss3.mp3',
  bgm_boss4:      'assets/audio/bgm/bgm_boss4.mp3',
  bgm_boss5:      'assets/audio/bgm/bgm_boss5.mp3',
  bgm_stage2:     'assets/audio/bgm/bgm_stage2_sink.wav',
  bgm_stage3:     'assets/audio/bgm/bgm_stage3_stove.wav',
  bgm_stage4:     'assets/audio/bgm/bgm_stage4_freezer.wav',
  bgm_stage5:     'assets/audio/bgm/bgm_stage5_oven.wav',
};

let ASSET_VER = '';   // build-www ใส่เลข build → append ?v= กันรูปค้าง cache (แก้รูปแล้วโหลดใหม่เสมอ)
function verUrl(u){ return ASSET_VER ? (u+'?v='+ASSET_VER) : u; }
// เฟรมของสไปรต์ตัวละคร (ต้องเรียงตามไฟล์สตริป)
// [0 idle,1 blink,2 squash,3 stretch(พุ่ง),4 cheer(ดีใจ),5 hurt(เจ็บ),6 ko(สลบ),7 cast(ร่ายอัลติ)]
const CF = { idle:0, blink:1, squash:2, stretch:3, cheer:4, hurt:5, ko:6, cast:7 };
function isArtKey(k){ return ASSET_IMAGES[k]||ASSET_SHEETS[k]; }

class Boot extends Phaser.Scene {
  constructor(){ super('Boot'); }
  preload(){
    this._loadFailures=0;
    const loader=window.GameLoader;
    if(loader)loader.show('Loading images, audio and characters...',0);
    this.load.on('progress',(value)=>{
      if(loader)loader.set(value,this._loadFailures?'Continuing (skipping problem files '+this._loadFailures+' files)...':'Loading game assets...');
    });
    this.load.on('fileprogress',(file)=>{
      if(!loader)return;
      const name=(file&&file.key?String(file.key):'asset').replace(/[_-]+/g,' ');
      const current=this.load.progress||0;
      loader.set(current,'Preparing '+name+'...');
    });
    for(const k in ASSET_IMAGES) this.load.image(k, verUrl(ASSET_IMAGES[k]));
    for(const k in ASSET_SHEETS) this.load.spritesheet(k, verUrl(ASSET_SHEETS[k].url), { frameWidth:ASSET_SHEETS[k].frame, frameHeight:ASSET_SHEETS[k].frame });
    for(const k in ASSET_FX) this.load.spritesheet(k, verUrl(ASSET_FX[k].url), { frameWidth:ASSET_FX[k].fw, frameHeight:ASSET_FX[k].fh });
    // เปิดเกมให้ไว: โหลด SFX + เพลงเมนูก่อน ส่วนเพลงประจำด่านค่อยโหลดเมื่อเลือกด่าน
    for(const k in ASSET_AUDIO){
      if(k.startsWith('bgm_stage')||k.startsWith('bgm_boss'))continue;
      this.load.audio(k, verUrl(ASSET_AUDIO[k]));
    }
    // ไฟล์ใดเสียให้ใช้กราฟิก/เสียงสำWaitง เกมจึงไม่ติดค้างอยู่ที่หน้าโหลด
    this.load.on('loaderror',(f)=>{
      this._loadFailures++;
      delete ASSET_IMAGES[f.key]; delete ASSET_SHEETS[f.key]; delete ASSET_FX[f.key]; delete ASSET_AUDIO[f.key];
    });
    this.load.once('complete',()=>{
      if(loader)loader.set(1,this._loadFailures?'Ready (using fallback assets '+this._loadFailures+' files)':'Ready!');
    });
  }
  create(){
    // มดStage 1 ใช้ขอบเรืองแสงบาง ๆ จาก texture จริง ช่วยแยกตัวจากพื้นรังโดยไม่เพิ่ม Graphics ต่อศัตรูทุกเฟรม
    const buildReadableAnt=(key)=>{
      const source=this.textures.get(key); if(!source||source.key==='__MISSING'||this.textures.exists(key+'_readable'))return;
      const img=source.getSourceImage(),w=img&&img.width,h=img&&img.height;if(!w||!h)return;
      const tex=this.textures.createCanvas(key+'_readable',w,h);if(!tex)return;const c=tex.getContext();c.clearRect(0,0,w,h);
      c.save();c.shadowColor='rgba(218,255,145,0.95)';c.shadowBlur=3.5;c.drawImage(img,0,0);c.restore();c.drawImage(img,0,0);tex.refresh();
    };
    ['e_ant_worker','e_ant_scout','e_ant_spitter','e_ant_soldier','e_ant_drone'].forEach(buildReadableAnt);

    const mk=(key,size,draw)=>{ if(isArtKey(key)&&this.textures.exists(key))return;  // มีรูปจริงแล้ว ไม่ต้องวาดทับ
      if(this.textures.exists(key))this.textures.remove(key);
      const t=this.textures.createCanvas(key,size,size); if(!t)return; draw(t.getContext(),size); t.refresh(); };
    const rr=(c,x,y,w,h,r)=>{ c.beginPath();
      if(c.roundRect){ c.roundRect(x,y,w,h,r); }
      else { c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); } };

    // ---- ตัวละครน่ารัก (บอดี้กลม เงา แก้ม ตาวาว + ท็อปปิ้ง) ----
    const drawChar=(c,s,o)=>{ const cx=s/2, cy=s*0.54, R=s*0.40;
      c.clearRect(0,0,s,s);
      c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.92,R*0.72,R*0.2,0,0,TAU); c.fill();
      const g=c.createRadialGradient(cx-R*0.4,cy-R*0.5,R*0.15,cx,cy,R*1.25);
      g.addColorStop(0,o.c1); g.addColorStop(1,o.c2);
      c.fillStyle=g; rr(c,cx-R,cy-R,2*R,2*R*0.92,R*0.72); c.fill();
      c.lineWidth=s*0.028; c.strokeStyle=o.edge; c.stroke();
      c.fillStyle='rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(cx-R*0.32,cy-R*0.48,R*0.36,R*0.2,-0.4,0,TAU); c.fill();
      c.fillStyle=o.cheek; c.beginPath(); c.arc(cx-R*0.52,cy+R*0.2,R*0.15,0,TAU); c.arc(cx+R*0.52,cy+R*0.2,R*0.15,0,TAU); c.fill();
      c.fillStyle='#3b2b3a'; c.beginPath(); c.ellipse(cx-R*0.34,cy-R*0.02,R*0.12,R*0.17,0,0,TAU); c.ellipse(cx+R*0.34,cy-R*0.02,R*0.12,R*0.17,0,0,TAU); c.fill();
      c.fillStyle='#fff'; c.beginPath(); c.arc(cx-R*0.29,cy-R*0.1,R*0.05,0,TAU); c.arc(cx+R*0.39,cy-R*0.1,R*0.05,0,TAU); c.fill();
      c.strokeStyle='#3b2b3a'; c.lineWidth=s*0.022; c.lineCap='round'; c.beginPath(); c.arc(cx,cy+R*0.1,R*0.14,0.16*Math.PI,0.84*Math.PI); c.stroke();
      if(o.top)o.top(c,cx,cy-R,R,s);
    };
    const strawberry=(c,cx,ty,R,s)=>{ c.fillStyle='#5ec26a'; c.beginPath(); c.ellipse(cx,ty-R*0.02,R*0.16,R*0.08,0,0,TAU); c.fill();
      c.fillStyle='#ff5a6e'; c.beginPath(); c.moveTo(cx-R*0.16,ty); c.quadraticCurveTo(cx,ty+R*0.02,cx+R*0.16,ty); c.quadraticCurveTo(cx,ty+R*0.34,cx-R*0.16,ty); c.fill();
      c.fillStyle='#ffe08a'; c.beginPath(); c.arc(cx,ty+R*0.12,R*0.02,0,TAU); c.arc(cx-R*0.06,ty+R*0.06,R*0.02,0,TAU); c.arc(cx+R*0.06,ty+R*0.06,R*0.02,0,TAU); c.fill(); };
    const mintleaf=(c,cx,ty,R,s)=>{ c.fillStyle='#4fbf85'; c.beginPath(); c.ellipse(cx-R*0.08,ty,R*0.15,R*0.08,-0.5,0,TAU); c.ellipse(cx+R*0.08,ty,R*0.15,R*0.08,0.5,0,TAU); c.fill(); };
    const cocoaswirl=(c,cx,ty,R,s)=>{ c.strokeStyle='#4a2c1a'; c.lineWidth=s*0.05; c.lineCap='round'; c.beginPath(); c.arc(cx,ty+R*0.06,R*0.13,-0.3,Math.PI*1.5); c.stroke(); };

    mk('char_momo',60,(c,s)=>drawChar(c,s,{c1:'#fff2f7',c2:'#ffcfe2',edge:'#ff9ec4',cheek:'rgba(255,140,185,0.55)',top:strawberry}));
    mk('char_mint',60,(c,s)=>drawChar(c,s,{c1:'#eafff5',c2:'#b6f0d6',edge:'#57c99a',cheek:'rgba(110,215,165,0.5)',top:mintleaf}));
    mk('char_cocoa',60,(c,s)=>drawChar(c,s,{c1:'#e6c39c',c2:'#a9744a',edge:'#6b4632',cheek:'rgba(255,170,140,0.5)',top:cocoaswirl}));
    mk('mochi',60,(c,s)=>drawChar(c,s,{c1:'#fff2f7',c2:'#ffcfe2',edge:'#ff9ec4',cheek:'rgba(255,140,185,0.55)',top:strawberry}));

    // ---- ศัตรู "sour-side" หน้าโกรธ ----
    const drawEnemy=(c,s,o)=>{ const cx=s/2, cy=s*0.54, R=s*0.40;
      c.clearRect(0,0,s,s);
      c.fillStyle='rgba(20,10,25,0.22)'; c.beginPath(); c.ellipse(cx,s*0.92,R*0.68,R*0.18,0,0,TAU); c.fill();
      const g=c.createRadialGradient(cx-R*0.4,cy-R*0.5,R*0.15,cx,cy,R*1.25);
      g.addColorStop(0,o.c1); g.addColorStop(1,o.c2);
      c.fillStyle=g; rr(c,cx-R,cy-R,2*R,2*R*0.92,o.spiky?R*0.34:R*0.62); c.fill();
      c.lineWidth=s*0.03; c.strokeStyle=o.edge; c.stroke();
      c.fillStyle='#fff'; c.beginPath(); c.arc(cx-R*0.32,cy,R*0.17,0,TAU); c.arc(cx+R*0.32,cy,R*0.17,0,TAU); c.fill();
      c.fillStyle='#2b2233'; c.beginPath(); c.arc(cx-R*0.28,cy+R*0.04,R*0.08,0,TAU); c.arc(cx+R*0.36,cy+R*0.04,R*0.08,0,TAU); c.fill();
      c.strokeStyle='#2b2233'; c.lineCap='round'; c.lineWidth=s*0.055;
      c.beginPath(); c.moveTo(cx-R*0.52,cy-R*0.34); c.lineTo(cx-R*0.14,cy-R*0.12); c.stroke();
      c.beginPath(); c.moveTo(cx+R*0.52,cy-R*0.34); c.lineTo(cx+R*0.14,cy-R*0.12); c.stroke();
      c.lineWidth=s*0.03; c.beginPath(); c.arc(cx,cy+R*0.6,R*0.15,1.15*Math.PI,1.85*Math.PI); c.stroke();
    };
    mk('e_basic',44,(c,s)=>drawEnemy(c,s,{c1:'#b6ec9e',c2:'#6cbf6a',edge:'#4f9a55'}));
    mk('e_fast',38,(c,s)=>drawEnemy(c,s,{c1:'#bfe2ff',c2:'#6fb3f0',edge:'#4f8fd6'}));
    mk('e_tank',62,(c,s)=>drawEnemy(c,s,{c1:'#e0c8ff',c2:'#a97fe0',edge:'#7a4fd0',spiky:true}));
    // e_brute = ตัวถึกโปรซีเจอรัล (ย้อมสีได้) ใช้กับ elite/มินิ/บอส — แยกจากรูปจริง e_tank กันสีเพี้ยนตอน setTint
    mk('e_brute',62,(c,s)=>drawEnemy(c,s,{c1:'#e6d8ff',c2:'#b79ae8',edge:'#7a4fd0',spiky:true}));

    // ---- Stage 5: กองทัพเตาอบราชันขม (procedural alpha art; silhouette แยกชัดบนมือถือ) ----
    const drawOvenFoe=(c,s,o)=>{const cx=s/2,cy=s*0.56,R=s*0.31;
      c.clearRect(0,0,s,s);c.fillStyle='rgba(15,4,24,0.28)';c.beginPath();c.ellipse(cx,s*0.91,R*0.95,R*0.20,0,0,TAU);c.fill();
      const aura=c.createRadialGradient(cx,cy,2,cx,cy,R*1.55);aura.addColorStop(0,o.glow);aura.addColorStop(1,'rgba(80,10,110,0)');
      c.fillStyle=aura;c.beginPath();c.arc(cx,cy,R*1.55,0,TAU);c.fill();
      const body=c.createLinearGradient(cx-R,cy-R,cx+R,cy+R);body.addColorStop(0,o.c1);body.addColorStop(1,o.c2);
      c.fillStyle=body;rr(c,cx-R,cy-R,R*2,R*1.92,o.kind==='guard'?R*0.25:R*0.58);c.fill();c.strokeStyle=o.edge;c.lineWidth=s*0.035;c.stroke();
      if(o.kind==='spark'){for(let i=0;i<3;i++){c.fillStyle=i===0?'#ffe272':i===1?'#ff6b48':'#ca45ff';c.beginPath();c.moveTo(cx+(i-1)*14,cy-R*0.72);c.quadraticCurveTo(cx+(i-1)*12-8,cy-R*1.45,cx+(i-1)*2,cy-R*1.25);c.quadraticCurveTo(cx+(i-1)*18,cy-R*1.55,cx+(i-1)*14,cy-R*0.72);c.fill();}}
      if(o.kind==='blade'){c.fillStyle='#f7e9ff';c.strokeStyle='#8b5ca8';c.lineWidth=3;for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*R*0.65,cy-R*0.2);c.lineTo(cx+d*R*1.55,cy-R*0.55);c.lineTo(cx+d*R*0.86,cy+R*0.22);c.closePath();c.fill();c.stroke();}}
      if(o.kind==='eye'){c.fillStyle='#1b071f';c.beginPath();c.ellipse(cx,cy,R*0.72,R*0.46,0,0,TAU);c.fill();c.fillStyle='#fff07a';c.beginPath();c.ellipse(cx,cy,R*0.24,R*0.42,0,0,TAU);c.fill();c.fillStyle='#4b0b5c';c.beginPath();c.ellipse(cx,cy,R*0.08,R*0.35,0,0,TAU);c.fill();}
      else{c.fillStyle='#fff';c.beginPath();c.arc(cx-R*0.32,cy-R*0.08,R*0.16,0,TAU);c.arc(cx+R*0.32,cy-R*0.08,R*0.16,0,TAU);c.fill();c.fillStyle='#35113f';c.beginPath();c.arc(cx-R*0.28,cy-R*0.04,R*0.08,0,TAU);c.arc(cx+R*0.36,cy-R*0.04,R*0.08,0,TAU);c.fill();}
      if(o.kind==='bomb'){c.strokeStyle='#ffd166';c.lineWidth=5;c.beginPath();c.arc(cx+R*0.45,cy-R*0.92,R*0.42,Math.PI,Math.PI*1.75);c.stroke();c.fillStyle='#ffec6e';c.beginPath();c.arc(cx+R*0.73,cy-R*1.19,5,0,TAU);c.fill();}
      if(o.kind==='guard'){c.fillStyle='#ffd166';c.beginPath();c.moveTo(cx-R*0.78,cy-R);c.lineTo(cx-R*0.42,cy-R*1.52);c.lineTo(cx,cy-R*1.12);c.lineTo(cx+R*0.42,cy-R*1.52);c.lineTo(cx+R*0.78,cy-R);c.closePath();c.fill();c.strokeStyle='#8f5418';c.stroke();}
    };
    mk('e_oven_spark',128,(c,s)=>drawOvenFoe(c,s,{kind:'spark',c1:'#ff8654',c2:'#8e214f',edge:'#5b173d',glow:'rgba(255,90,80,0.48)'}));
    mk('e_oven_blade',128,(c,s)=>drawOvenFoe(c,s,{kind:'blade',c1:'#d9c7e8',c2:'#6f477f',edge:'#43254f',glow:'rgba(210,90,255,0.42)'}));
    mk('e_oven_eye',128,(c,s)=>drawOvenFoe(c,s,{kind:'eye',c1:'#8d3aac',c2:'#2a102f',edge:'#17091d',glow:'rgba(222,70,255,0.52)'}));
    mk('e_oven_bomb',128,(c,s)=>drawOvenFoe(c,s,{kind:'bomb',c1:'#ff8a5a',c2:'#61233b',edge:'#3c142c',glow:'rgba(255,100,55,0.46)'}));
    mk('e_oven_guard',128,(c,s)=>drawOvenFoe(c,s,{kind:'guard',c1:'#612b72',c2:'#201126',edge:'#f0b84b',glow:'rgba(255,209,92,0.44)'}));

    // The Great Hunger Reborn: Cosmic Devourer — เงากว้าง มงกุฎแตก ดวงตาหกดวง ปากกลางอก และกรงเล็บ
    mk('boss5_ascended',256,(c,s)=>{const cx=s/2,cy=s*0.56;
      c.clearRect(0,0,s,s);
      const aura=c.createRadialGradient(cx,cy,5,cx,cy,s*0.52);aura.addColorStop(0,'rgba(255,58,120,0.50)');aura.addColorStop(0.35,'rgba(174,42,224,0.34)');aura.addColorStop(0.72,'rgba(60,5,82,0.26)');aura.addColorStop(1,'rgba(5,0,12,0)');c.fillStyle=aura;c.fillRect(0,0,s,s);
      c.fillStyle='rgba(2,0,8,0.48)';c.beginPath();c.ellipse(cx,s*0.92,s*0.43,s*0.07,0,0,TAU);c.fill();
      // ปีกเงา/ผ้าคลุมแตก ทำ silhouette กว้างกว่าบอสทั่วไป
      const wing=c.createLinearGradient(cx,42,cx,s*0.88);wing.addColorStop(0,'#52106c');wing.addColorStop(0.42,'#210529');wing.addColorStop(1,'#07020b');c.fillStyle=wing;c.strokeStyle='#9d35bd';c.lineWidth=5;
      for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*18,62);c.bezierCurveTo(cx+d*67,46,cx+d*103,71,cx+d*116,116);c.lineTo(cx+d*82,107);c.lineTo(cx+d*109,157);c.lineTo(cx+d*69,143);c.lineTo(cx+d*91,211);c.quadraticCurveTo(cx+d*45,198,cx+d*20,178);c.closePath();c.fill();c.stroke();}
      // แกนลำตัวเป็นหลุมดำ ไม่ใช่เชฟมนุษย์
      const body=c.createLinearGradient(cx,34,cx,s*0.91);body.addColorStop(0,'#6a1a80');body.addColorStop(0.3,'#27052f');body.addColorStop(0.78,'#0b020f');body.addColorStop(1,'#020104');c.fillStyle=body;c.beginPath();c.moveTo(cx,32);c.bezierCurveTo(cx-63,41,cx-72,107,cx-67,176);c.lineTo(cx-88,226);c.quadraticCurveTo(cx,247,cx+88,226);c.lineTo(cx+67,176);c.bezierCurveTo(cx+72,107,cx+63,41,cx,32);c.fill();c.strokeStyle='#d94ff0';c.lineWidth=7;c.stroke();
      // มงกุฎโบราณแตกและเขาคู่
      c.fillStyle='#09010d';c.strokeStyle='#ffbf3f';c.lineWidth=6;c.beginPath();c.moveTo(cx-72,61);c.lineTo(cx-58,11);c.lineTo(cx-29,47);c.lineTo(cx,-2);c.lineTo(cx+28,47);c.lineTo(cx+61,9);c.lineTo(cx+74,62);c.lineTo(cx+38,51);c.lineTo(cx+18,68);c.lineTo(cx-20,68);c.lineTo(cx-40,51);c.closePath();c.fill();c.stroke();
      c.fillStyle='#ff3f78';for(const x of [cx-57,cx,cx+59]){c.beginPath();c.arc(x,x===cx?13:28,x===cx?8:6,0,TAU);c.fill();}
      // ใบหน้าไร้จมูก มีดวงตา 3 คู่
      for(let row=0;row<3;row++){const yy=76+row*18,spread=22+row*8;for(const d of [-1,1]){c.save();c.translate(cx+d*spread,yy);c.rotate(d*(row-1)*0.12);c.fillStyle='#fff47a';c.beginPath();c.ellipse(0,0,11-row,5.5,0,0,TAU);c.fill();c.fillStyle='#ff245f';c.beginPath();c.ellipse(d*2,0,3,4.5,0,0,TAU);c.fill();c.restore();}}
      // ปากสุญญะกลางอกหลายชั้น
      const maw=c.createRadialGradient(cx,151,1,cx,151,58);maw.addColorStop(0,'#000');maw.addColorStop(0.48,'#030006');maw.addColorStop(0.7,'#5b082f');maw.addColorStop(0.86,'#ff265f');maw.addColorStop(1,'rgba(210,45,255,0)');c.fillStyle=maw;c.beginPath();c.ellipse(cx,154,61,48,0,0,TAU);c.fill();
      c.strokeStyle='#ffcb55';c.lineWidth=4;c.beginPath();c.ellipse(cx,154,48,36,0,0,TAU);c.stroke();
      c.fillStyle='#fff1bf';for(let i=0;i<10;i++){const a=i*TAU/10,x=cx+Math.cos(a)*43,y=154+Math.sin(a)*31;c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.beginPath();c.moveTo(-5,0);c.lineTo(0,15);c.lineTo(5,0);c.closePath();c.fill();c.restore();}
      c.fillStyle='#ff367d';c.beginPath();c.arc(cx,154,10,0,TAU);c.fill();c.fillStyle='#140018';c.beginPath();c.arc(cx,154,5,0,TAU);c.fill();
      // แขนกรงเล็บยาวโอบผู้เล่น
      c.strokeStyle='#b936d4';c.lineWidth=13;c.lineCap='round';for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*54,111);c.quadraticCurveTo(cx+d*112,139,cx+d*100,203);c.stroke();c.fillStyle='#120218';for(let k=0;k<3;k++){c.beginPath();c.moveTo(cx+d*(91+k*7),194+k*3);c.lineTo(cx+d*(122+k*5),216+k*4);c.lineTo(cx+d*(99+k*5),205+k*2);c.closePath();c.fill();c.strokeStyle='#ffbf3f';c.lineWidth=2;c.stroke();}}
      // Waitยแตกพลังบนลำตัว
      c.strokeStyle='rgba(255,196,63,0.82)';c.lineWidth=3;for(const d of [-1,1]){c.beginPath();c.moveTo(cx+d*17,112);c.lineTo(cx+d*31,126);c.lineTo(cx+d*22,139);c.lineTo(cx+d*39,151);c.stroke();}
      c.fillStyle='rgba(255,255,255,0.70)';c.beginPath();c.ellipse(cx-48,42,9,19,-0.55,0,TAU);c.fill();
    });
    mk('hunger_seal',160,(c,s)=>{const cx=s/2;c.clearRect(0,0,s,s);const g=c.createRadialGradient(cx,cx,4,cx,cx,cx);g.addColorStop(0,'rgba(255,236,110,0.58)');g.addColorStop(0.38,'rgba(217,92,255,0.24)');g.addColorStop(1,'rgba(40,5,60,0)');c.fillStyle=g;c.fillRect(0,0,s,s);c.strokeStyle='#d95cff';c.lineWidth=7;c.beginPath();c.arc(cx,cx,45,0,TAU);c.stroke();c.strokeStyle='#ffd166';c.lineWidth=4;for(let i=0;i<6;i++){const a=i*TAU/6;c.beginPath();c.moveTo(cx+Math.cos(a)*18,cx+Math.sin(a)*18);c.lineTo(cx+Math.cos(a)*62,cx+Math.sin(a)*62);c.stroke();}});
    mk('crown_oven',196,(c,s)=>{const cx=s/2;c.clearRect(0,0,s,s);c.fillStyle='rgba(12,3,20,0.30)';c.beginPath();c.ellipse(cx,s*0.9,s*0.4,s*0.08,0,0,TAU);c.fill();const g=c.createLinearGradient(0,20,0,s);g.addColorStop(0,'#7b3d87');g.addColorStop(1,'#24102d');c.fillStyle=g;rr(c,27,48,s-54,s-70,22);c.fill();c.strokeStyle='#d95cff';c.lineWidth=6;c.stroke();c.fillStyle='#09040d';rr(c,48,82,s-96,70,15);c.fill();c.fillStyle='#ff6a46';c.beginPath();c.ellipse(cx,116,42,25,0,0,TAU);c.fill();c.fillStyle='#ffd166';c.beginPath();c.moveTo(47,55);c.lineTo(66,18);c.lineTo(cx,50);c.lineTo(130,18);c.lineTo(149,55);c.closePath();c.fill();});


    // ---- ลูกกวาด (glossy) / กระสุน / อนุภาค / vignette ----
    mk('candy',20,(c,s)=>{ const cx=s/2,r=s*0.42; const g=c.createRadialGradient(cx-2,cx-2,1,cx,cx,r);
      g.addColorStop(0,'#fff3b0'); g.addColorStop(1,'#f0a92e'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,r,0,TAU); c.fill();
      c.strokeStyle='#c9832a'; c.lineWidth=1.3; c.stroke();
      c.fillStyle='rgba(255,255,255,0.85)'; c.beginPath(); c.arc(cx-r*0.35,cx-r*0.35,r*0.22,0,TAU); c.fill(); });
    mk('spark',16,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'#ffffff'); g.addColorStop(0.55,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('dot',12,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'#ffffff'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('vignette',256,(c,s)=>{ const g=c.createRadialGradient(s/2,s/2,s*0.28,s/2,s/2,s*0.62);
      g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(8,4,12,0.5)'); c.fillStyle=g; c.fillRect(0,0,s,s); });
    // ไอเทมฟื้นฟู = หัวใจโมจิ
    mk('heal',24,(c,s)=>{ const cx=s/2,cy=s*0.46,r=s*0.3; c.fillStyle='rgba(20,10,25,0.15)'; c.beginPath(); c.ellipse(cx,s*0.9,r*0.7,r*0.18,0,0,TAU); c.fill();
      c.fillStyle='#ff6a97'; c.beginPath(); c.moveTo(cx,cy+r*0.9); c.bezierCurveTo(cx-r*1.4,cy-r*0.2,cx-r*0.5,cy-r*1.1,cx,cy-r*0.25); c.bezierCurveTo(cx+r*0.5,cy-r*1.1,cx+r*1.4,cy-r*0.2,cx,cy+r*0.9); c.fill();
      c.strokeStyle='#e0447a'; c.lineWidth=s*0.05; c.stroke();
      c.fillStyle='rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(cx-r*0.4,cy-r*0.3,r*0.22,r*0.14,-0.5,0,TAU); c.fill(); });
    // กล่อง/โหลทุบได้ (ธีมครัว) — โหลแยมกลม ๆ
    mk('crate',44,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.9,s*0.32,s*0.09,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.2,0,s*0.9); g.addColorStop(0,'#ffd59e'); g.addColorStop(1,'#e59a4d');
      c.fillStyle=g; rr(c,s*0.18,s*0.28,s*0.64,s*0.6,s*0.14); c.fill(); c.lineWidth=s*0.045; c.strokeStyle='#b9702e'; c.stroke();
      c.fillStyle='#c8e6a0'; rr(c,s*0.24,s*0.14,s*0.52,s*0.18,s*0.08); c.fill(); c.strokeStyle='#8fb85f'; c.lineWidth=s*0.04; c.stroke();
      c.fillStyle='rgba(255,255,255,0.4)'; rr(c,s*0.26,s*0.36,s*0.14,s*0.4,s*0.06); c.fill(); });
    // หีบสกิลระหว่างเล่น (แยกจากกล่องรางวัลจบด่าน)
    mk('chest',40,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.2)'; c.beginPath(); c.ellipse(cx,s*0.9,s*0.34,s*0.09,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.3,0,s*0.85); g.addColorStop(0,'#a9744a'); g.addColorStop(1,'#6b4632');
      c.fillStyle=g; rr(c,s*0.16,s*0.42,s*0.68,s*0.42,s*0.06); c.fill();
      const lid=c.createLinearGradient(0,s*0.24,0,s*0.5); lid.addColorStop(0,'#c89a5e'); lid.addColorStop(1,'#8a5e3a');
      c.fillStyle=lid; rr(c,s*0.16,s*0.26,s*0.68,s*0.2,s*0.09); c.fill();
      c.strokeStyle='#ffd166'; c.lineWidth=s*0.05; c.strokeRect(s*0.17,s*0.44,s*0.66,s*0.02);   // แถบทอง
      c.fillStyle='#ffe08a'; rr(c,s*0.44,s*0.4,s*0.12,s*0.18,s*0.03); c.fill();   // ตัวLocked
      c.fillStyle='#b9862e'; c.beginPath(); c.arc(cx,s*0.52,s*0.045,0,TAU); c.fill(); });
    // ของสวมใส่ดWaitป (loot) — กล่องของขวัญ
    mk('gift',28,(c,s)=>{ const cx=s/2; c.fillStyle='rgba(20,10,25,0.18)'; c.beginPath(); c.ellipse(cx,s*0.88,s*0.3,s*0.08,0,0,TAU); c.fill();
      const g=c.createLinearGradient(0,s*0.35,0,s*0.85); g.addColorStop(0,'#7fd0ff'); g.addColorStop(1,'#4f9fe0');
      c.fillStyle=g; rr(c,s*0.22,s*0.42,s*0.56,s*0.42,s*0.05); c.fill();
      c.fillStyle='#ffd166'; rr(c,s*0.22,s*0.34,s*0.56,s*0.12,s*0.04); c.fill();   // ฝา
      c.fillStyle='#ff8fb5'; c.fillRect(s*0.46,s*0.34,s*0.08,s*0.5);               // ริบบิ้นแนวตั้ง
      c.beginPath(); c.moveTo(cx,s*0.32); c.lineTo(s*0.36,s*0.2); c.lineTo(s*0.46,s*0.32); c.closePath(); c.fill();  // โบว์
      c.beginPath(); c.moveTo(cx,s*0.32); c.lineTo(s*0.64,s*0.2); c.lineTo(s*0.54,s*0.32); c.closePath(); c.fill(); });
    // ไอเทมMagnet (vacuum) — ดูดออร์บ EXP ทั้งจอ
    mk('vac',26,(c,s)=>{ c.fillStyle='rgba(20,10,25,0.16)'; c.beginPath(); c.ellipse(s/2,s*0.9,s*0.3,s*0.08,0,0,TAU); c.fill();
      c.lineCap='round'; c.strokeStyle='#ff5a6e'; c.lineWidth=s*0.17;   // เกือกม้าMagnetสีแดง (U คว่ำ)
      c.beginPath(); c.moveTo(s*0.30,s*0.34); c.lineTo(s*0.30,s*0.56); c.stroke();
      c.beginPath(); c.moveTo(s*0.70,s*0.34); c.lineTo(s*0.70,s*0.56); c.stroke();
      c.beginPath(); c.arc(s*0.5,s*0.56,s*0.20,0,Math.PI,false); c.stroke();
      c.fillStyle='#dcdce8'; c.fillRect(s*0.215,s*0.28,s*0.17,s*0.09); c.fillRect(s*0.615,s*0.28,s*0.17,s*0.09); })   // ปลายสีเงิน;
    // ---- VFX textures ----
    mk('vfx_ring',64,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,s*0.28,cx,cx,s*0.5);
      g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.5,'rgba(255,255,255,0.9)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,s*0.5,0,TAU); c.fill(); });
    mk('vfx_poof',48,(c,s)=>{ const cx=s/2; for(let i=0;i<6;i++){
      const a=i/6*TAU, r=s*0.18, px=cx+Math.cos(a)*r, py=cx+Math.sin(a)*r;
      const g=c.createRadialGradient(px,py,0,px,py,s*0.22);
      g.addColorStop(0,'rgba(255,255,255,0.7)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(px,py,s*0.22,0,TAU); c.fill(); }
      const g2=c.createRadialGradient(cx,cx,0,cx,cx,s*0.2);
      g2.addColorStop(0,'rgba(255,255,255,0.85)'); g2.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g2; c.beginPath(); c.arc(cx,cx,s*0.2,0,TAU); c.fill(); });
    mk('vfx_glow',32,(c,s)=>{ const cx=s/2; const g=c.createRadialGradient(cx,cx,0,cx,cx,cx);
      g.addColorStop(0,'rgba(255,255,255,0.95)'); g.addColorStop(0.4,'rgba(255,255,255,0.5)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx,0,TAU); c.fill(); });
    mk('bubble',30,(c,s)=>{ const cx=s/2;   // ฟองสบู่โปร่งแสง (กระสุนสกิล bubble)
      const g=c.createRadialGradient(cx,cx,s*0.1,cx,cx,cx); g.addColorStop(0,'rgba(215,242,255,0.10)'); g.addColorStop(0.72,'rgba(190,232,255,0.26)'); g.addColorStop(0.9,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(190,232,255,0)');
      c.fillStyle=g; c.beginPath(); c.arc(cx,cx,cx*0.95,0,TAU); c.fill();
      c.fillStyle='rgba(255,255,255,0.9)'; c.beginPath(); c.arc(cx*0.66,cx*0.6,s*0.08,0,TAU); c.fill(); });
    mk('vfx_line',32,(c,s)=>{ const g=c.createLinearGradient(0,s/2,s,s/2);
      g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.3,'rgba(255,255,255,0.8)'); g.addColorStop(0.7,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g; c.fillRect(0,s*0.38,s,s*0.24); });

    // ---- สร้างอนิเมชัน flipbook ของ VFX (เล่นครั้งเดียวจบ) ----
    for(const k in ASSET_FX){ if(!this.textures.exists(k))continue; const fx=ASSET_FX[k];
      if(this.anims.exists(k))continue;
      this.anims.create({ key:k, frames:this.anims.generateFrameNumbers(k,{start:0,end:fx.frames-1}), frameRate:fx.rate, repeat:fx.loop?-1:0 }); }

    if(this.textures.exists('fx_bossportal')&&!this.anims.exists('portal_idle'))
      this.anims.create({key:'portal_idle',frames:this.anims.generateFrameNumbers('fx_bossportal',{start:0,end:ASSET_FX.fx_bossportal.frames-1}),frameRate:12,repeat:-1});
    if(this.textures.exists('boss1')&&!this.anims.exists('boss1_idle'))
      this.anims.create({key:'boss1_idle',frames:[{key:'boss1',frame:0},{key:'boss1',frame:1}],frameRate:3,repeat:-1,yoyo:true});
    if(this.textures.exists('boss2')&&!this.anims.exists('boss2_reveal'))
      this.anims.create({key:'boss2_reveal',frames:[{key:'boss2',frame:2},{key:'boss2',frame:3}],frameRate:4,repeat:0});
    for(const k of ['boss3','boss4'])if(this.textures.exists(k)&&!this.anims.exists(k+'_idle'))
      this.anims.create({key:k+'_idle',frames:[{key:k,frame:0},{key:k,frame:1}],frameRate:3,repeat:-1,yoyo:true});
    if(this.textures.exists('boss5_sovereign')&&!this.anims.exists('boss5_sovereign_idle'))
      this.anims.create({key:'boss5_sovereign_idle',frames:[{key:'boss5_sovereign',frame:0},{key:'boss5_sovereign',frame:1}],frameRate:2.5,repeat:-1,yoyo:true});
    if(this.textures.exists('boss6_rootmother')&&!this.anims.exists('boss6_rootmother_idle'))
      this.anims.create({key:'boss6_rootmother_idle',frames:[{key:'boss6_rootmother',frame:0},{key:'boss6_rootmother',frame:1}],frameRate:2.2,repeat:-1,yoyo:true});
    // ---- อนิเมชันศัตรู (walk/attack loop จาก ASSET_SHEETS ที่มี .anim) ----
    for(const k in ASSET_SHEETS){ const sh=ASSET_SHEETS[k]; if(!sh.anim)continue;
      if(!this.textures.exists(k)||this.anims.exists(k+'_walk'))continue;
      this.anims.create({ key:k+'_walk', frames:this.anims.generateFrameNumbers(k,{start:0,end:sh.anim.frames-1}), frameRate:sh.anim.rate, repeat:-1, yoyo:!!sh.anim.yoyo }); }

    // ---- Props ประดับฉาก (placeholder กล่อง ๆ — สลับอาร์ต AI ทีหลัง) ----
    const mkRect=(key,w,h,draw)=>{ if(isArtKey(key)&&this.textures.exists(key))return;   // มีรูป AI แล้ว ไม่วาดทับ (procedural = fallback)
      if(this.textures.exists(key))this.textures.remove(key);
      const t=this.textures.createCanvas(key,w,h); if(!t)return; draw(t.getContext(),w,h); t.refresh(); };
    const lg=(c,x0,y0,x1,y1,a,b)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
    const gShadow=(c,w,h)=>{ c.fillStyle='rgba(20,10,25,0.22)'; c.beginPath(); c.ellipse(w/2,h-7,w*0.40,h*0.09,0,0,TAU); c.fill(); };
    // ชั้นวางไม้ 2 ชั้น + โหลข้างบน
    mkRect('p_shelf',200,132,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle='#7a4d2b'; c.fillRect(w*0.13,h*0.30,11,h*0.60); c.fillRect(w*0.83,h*0.30,11,h*0.60);
      for(const yy of [h*0.30,h*0.60]){ c.fillStyle=lg(c,0,yy,0,yy+20,'#c98a4e','#95602f'); rr(c,w*0.05,yy,w*0.90,20,5); c.fill(); c.strokeStyle='rgba(70,40,20,0.55)'; c.lineWidth=2; c.stroke(); }
      const jar=(jx,jy,col)=>{ c.fillStyle=col; rr(c,jx,jy,26,30,7); c.fill(); c.fillStyle='#f4e6c8'; rr(c,jx+3,jy-6,20,8,3); c.fill(); c.fillStyle='rgba(255,255,255,0.4)'; rr(c,jx+4,jy+4,6,16,3); c.fill(); };
      jar(w*0.20,h*0.30-30,'#e8637a'); jar(w*0.44,h*0.30-30,'#f0a92e'); jar(w*0.68,h*0.30-30,'#a06be0'); });
    // ลังไม้ (กากบาท)
    mkRect('p_crate',112,120,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,0,h,'#c07f42','#8a562d'); rr(c,w*0.10,h*0.12,w*0.80,h*0.78,8); c.fill();
      c.strokeStyle='#6d4423'; c.lineWidth=6; c.stroke();
      c.lineWidth=7; c.strokeStyle='rgba(120,75,38,0.85)'; c.beginPath(); c.moveTo(w*0.14,h*0.16); c.lineTo(w*0.86,h*0.86); c.moveTo(w*0.86,h*0.16); c.lineTo(w*0.14,h*0.86); c.stroke();
      c.fillStyle='rgba(255,240,210,0.18)'; rr(c,w*0.14,h*0.16,w*0.72,10,4); c.fill(); });
    // กระป๋องยักษ์ (แลนด์มาร์ก) โลหะ + แถบฉลาก
    mkRect('p_cans',126,168,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,w*0.15,0,w*0.85,0,'#aeb7c4','#e6ecf3'); rr(c,w*0.16,h*0.14,w*0.68,h*0.78,10); c.fill();
      c.fillStyle='rgba(255,255,255,0.5)'; rr(c,w*0.24,h*0.16,10,h*0.72,5); c.fill();
      c.fillStyle=lg(c,0,h*0.36,0,h*0.72,'#ff6d7e','#e23b57'); c.fillRect(w*0.16,h*0.40,w*0.68,h*0.34);
      c.fillStyle='#fff3d6'; c.beginPath(); c.arc(w*0.5,h*0.57,15,0,TAU); c.fill();
      c.fillStyle='#8fbf5a'; c.beginPath(); c.arc(w*0.5,h*0.57,9,0,TAU); c.fill();
      c.fillStyle='#c9d2dc'; rr(c,w*0.14,h*0.10,w*0.72,10,5); c.fill(); });
    // โหลแยม 3 ใบ
    mkRect('p_jars',124,92,(c,w,h)=>{ gShadow(c,w,h);
      const jar=(jx,s,col)=>{ c.fillStyle=col; rr(c,jx,h*0.30,34*s,44*s,9); c.fill(); c.strokeStyle='rgba(90,50,60,0.35)'; c.lineWidth=2; c.stroke();
        c.fillStyle='#f4e6c8'; rr(c,jx+3,h*0.30-9,28*s,11,4); c.fill(); c.fillStyle='rgba(255,255,255,0.42)'; rr(c,jx+5,h*0.36,8,20*s,4); c.fill(); };
      jar(w*0.06,1.05,'#e8637a'); jar(w*0.66,0.95,'#f0a92e'); jar(w*0.37,1.15,'#c0507a'); });
    // ถุงแป้ง + แป้งหก
    mkRect('p_flour',132,94,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle='rgba(245,240,228,0.85)'; c.beginPath(); c.ellipse(w*0.62,h*0.86,w*0.36,h*0.13,0,0,TAU); c.fill();
      c.fillStyle=lg(c,0,h*0.2,0,h*0.9,'#f0e6cf','#d8cbac'); rr(c,w*0.16,h*0.24,w*0.56,h*0.62,10); c.fill();
      c.strokeStyle='rgba(150,130,95,0.5)'; c.lineWidth=2; c.stroke();
      c.fillStyle='#b98a4a'; c.font='bold 15px sans-serif'; c.fillText('🌾',w*0.30,h*0.62);
      c.fillStyle='rgba(255,255,255,0.9)'; c.beginPath(); c.arc(w*0.80,h*0.5,4,0,TAU); c.arc(w*0.86,h*0.62,3,0,TAU); c.arc(w*0.74,h*0.72,3,0,TAU); c.fill(); });
    // กล่องกระดาษเปิดฝา
    mkRect('p_box',100,92,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,0,h,'#d2a76d','#b07f45'); rr(c,w*0.16,h*0.34,w*0.68,h*0.54,6); c.fill();
      c.strokeStyle='#8a6335'; c.lineWidth=4; c.stroke();
      c.fillStyle='#c49a5f'; c.beginPath(); c.moveTo(w*0.16,h*0.36); c.lineTo(w*0.30,h*0.16); c.lineTo(w*0.44,h*0.36); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(w*0.84,h*0.36); c.lineTo(w*0.70,h*0.16); c.lineTo(w*0.56,h*0.36); c.closePath(); c.fill();
      c.fillStyle='rgba(90,60,30,0.35)'; c.fillRect(w*0.16,h*0.55,w*0.68,3); });

    // ---- Stage 2: อุปกรณ์ท่อระบาย + กลีบ Sakura (โปร่งใส Noneพื้นหลังดำ) ----
    mkRect('drain_grate',150,112,(c,w,h)=>{ gShadow(c,w,h);
      const g=lg(c,0,0,w,h,'#8597a5','#334754');c.fillStyle=g;rr(c,8,12,w-16,h-24,24);c.fill();
      c.lineWidth=6;c.strokeStyle='#b9d7df';c.stroke();c.strokeStyle='rgba(18,35,46,.8)';c.lineWidth=8;
      for(let x=34;x<w-20;x+=27){c.beginPath();c.moveTo(x,25);c.lineTo(x,h-26);c.stroke();}
      c.lineWidth=3;c.strokeStyle='rgba(204,255,247,.45)';c.beginPath();c.arc(w/2,h/2,38,0,TAU);c.stroke();});
    mkRect('drain_pipe',142,150,(c,w,h)=>{ gShadow(c,w,h);
      c.fillStyle=lg(c,0,0,w,0,'#b8d0d9','#425866');rr(c,15,18,w-30,h-36,28);c.fill();
      c.lineWidth=8;c.strokeStyle='#29404e';c.stroke();c.fillStyle='#20323d';c.beginPath();c.ellipse(w/2,h*.36,w*.28,h*.17,0,0,TAU);c.fill();
      c.strokeStyle='#8fe3d0';c.lineWidth=4;c.stroke();c.fillStyle='rgba(98,238,191,.45)';c.beginPath();c.ellipse(w/2,h*.7,w*.22,h*.10,0,0,TAU);c.fill();});
    mkRect('drain_sludge',132,86,(c,w,h)=>{ const g=c.createRadialGradient(w/2,h/2,4,w/2,h/2,w*.5);
      g.addColorStop(0,'rgba(119,232,164,.72)');g.addColorStop(.65,'rgba(52,153,128,.48)');g.addColorStop(1,'rgba(24,74,82,0)');c.fillStyle=g;c.beginPath();c.ellipse(w/2,h/2,w*.48,h*.38,0,0,TAU);c.fill();});
    mkRect('drain_bubbles',96,120,(c,w,h)=>{ for(let i=0;i<7;i++){const x=14+(i*29)%70,y=14+(i*37)%94,r=6+(i%3)*4;
      c.fillStyle='rgba(196,247,255,.14)';c.strokeStyle='rgba(218,255,248,.75)';c.lineWidth=2;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();}});
    mkRect('sakura_petal',28,18,(c,w,h)=>{ const g=lg(c,0,0,w,h,'#fff3f8','#ff75b4');c.fillStyle=g;
      c.beginPath();c.moveTo(2,h/2);c.bezierCurveTo(w*.28,-2,w*.72,-2,w-2,h/2);c.bezierCurveTo(w*.72,h+2,w*.28,h+2,2,h/2);c.fill();
      c.strokeStyle='rgba(146,39,93,.65)';c.lineWidth=1.5;c.stroke();});

    // ---- Stage 3: Roomเครื่องพริกเพลิง ----
    mkRect('stove_furnace',176,154,(c,w,h)=>{gShadow(c,w,h);c.fillStyle=lg(c,0,0,0,h,'#7b6a70','#29242d');rr(c,12,12,w-24,h-24,18);c.fill();c.strokeStyle='#b7a5a8';c.lineWidth=5;c.stroke();c.fillStyle='#180b10';rr(c,38,55,w-76,62,12);c.fill();const f=c.createRadialGradient(w/2,87,4,w/2,87,52);f.addColorStop(0,'#fff18a');f.addColorStop(.35,'#ff8a35');f.addColorStop(1,'rgba(190,20,28,0)');c.fillStyle=f;c.fillRect(32,42,w-64,86);c.fillStyle='#ffcf59';for(const x of [48,88,128]){c.beginPath();c.arc(x,34,8,0,TAU);c.fill();}});
    mkRect('stove_pipe',166,92,(c,w,h)=>{gShadow(c,w,h);c.strokeStyle='#5d4f57';c.lineWidth=28;c.lineCap='round';c.beginPath();c.moveTo(18,66);c.lineTo(66,66);c.quadraticCurveTo(88,66,88,44);c.lineTo(88,20);c.lineTo(148,20);c.stroke();c.strokeStyle='#d0b7a4';c.lineWidth=5;c.stroke();c.fillStyle='#ff7440';for(const x of [42,116]){c.beginPath();c.arc(x,66-(x>80?46:0),7,0,TAU);c.fill();}});
    mkRect('stove_gear',104,104,(c,w,h)=>{gShadow(c,w,h);c.save();c.translate(w/2,h/2);c.fillStyle='#80626a';for(let i=0;i<12;i++){c.rotate(TAU/12);c.fillRect(-7,-49,14,20);}c.beginPath();c.arc(0,0,38,0,TAU);c.fill();c.fillStyle='#2a2029';c.beginPath();c.arc(0,0,17,0,TAU);c.fill();c.strokeStyle='#ff9a4e';c.lineWidth=4;c.stroke();c.restore();});
    mkRect('stove_belt',190,78,(c,w,h)=>{gShadow(c,w,h);c.fillStyle='#332a31';rr(c,5,18,w-10,44,15);c.fill();c.strokeStyle='#a88e83';c.lineWidth=5;c.stroke();for(let x=22;x<w-14;x+=28){c.fillStyle='#73636b';c.beginPath();c.arc(x,40,10,0,TAU);c.fill();c.strokeStyle='#ff7440';c.lineWidth=2;c.stroke();}});

    // ---- Stage 4: คุกเย็นน้ำตาล ----
    mkRect('ice_cage',150,168,(c,w,h)=>{gShadow(c,w,h);c.strokeStyle='#9fe8ff';c.lineWidth=9;c.lineCap='round';for(let x=24;x<w;x+=34){c.beginPath();c.moveTo(x,22);c.lineTo(x,h-20);c.stroke();}c.strokeStyle='#3e7ea1';c.lineWidth=7;for(const y of [32,h-31]){c.beginPath();c.moveTo(15,y);c.lineTo(w-15,y);c.stroke();}c.fillStyle='rgba(120,220,255,.18)';rr(c,14,18,w-28,h-35,16);c.fill();});
    mkRect('ice_crystal',112,148,(c,w,h)=>{gShadow(c,w,h);const q=lg(c,0,8,w,h,'#efffff','#54b9ee');c.fillStyle=q;c.strokeStyle='#bdf3ff';c.lineWidth=4;c.beginPath();c.moveTo(w/2,3);c.lineTo(w-16,h*.55);c.lineTo(w*.68,h-15);c.lineTo(w*.42,h-4);c.lineTo(12,h*.55);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.48)';c.beginPath();c.moveTo(w/2,12);c.lineTo(w*.56,h*.72);c.lineTo(w*.31,h*.55);c.closePath();c.fill();});
    mkRect('ice_chain',182,72,(c,w,h)=>{gShadow(c,w,h);c.strokeStyle='#8ddcf8';c.lineWidth=8;for(let i=0;i<6;i++){c.beginPath();c.ellipse(18+i*29,h/2,18,10,i%2?-.45:.45,0,TAU);c.stroke();}c.strokeStyle='rgba(255,255,255,.58)';c.lineWidth=2;for(let i=0;i<6;i++){c.beginPath();c.ellipse(18+i*29,h/2-2,17,9,i%2?-.45:.45,0,TAU);c.stroke();}});
    mkRect('ice_pool',158,82,(c,w,h)=>{const q=c.createRadialGradient(w/2,h/2,3,w/2,h/2,w*.48);q.addColorStop(0,'rgba(230,255,255,.78)');q.addColorStop(.55,'rgba(92,199,241,.50)');q.addColorStop(1,'rgba(49,117,180,0)');c.fillStyle=q;c.beginPath();c.ellipse(w/2,h/2,w*.48,h*.38,0,0,TAU);c.fill();});

    this.scene.start('Opening');
  }
}

/* ---- OPENING: short hand-off after assets are ready, before the menu is built ---- */
class Opening extends Phaser.Scene {
  constructor(){ super('Opening'); }
  create(){
    const W=this.scale.width,H=this.scale.height,cx=W/2,cy=H/2;
    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gx=cx,gy=cy-H*0.07;
    this.cameras.main.setBackgroundColor('#2b142f');

    const bg=this.add.image(cx,cy,'opening_world_gate_v3').setDisplaySize(W*1.04,H*1.04).setAlpha(0);
    const shade=this.add.rectangle(cx,cy,W,H,0x210f2a,0.48);
    const gateGlow=this.add.ellipse(gx,gy,W*0.22,H*0.38,0xffe6a3,0)
      .setBlendMode(Phaser.BlendModes.ADD).setScale(0.55);

    const rays=this.add.graphics().setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);
    for(let i=0;i<16;i++){
      const a=i*TAU/16,inner=Math.min(W,H)*0.035,outer=Math.max(W,H)*0.72;
      rays.fillStyle(i%2?0xffa6ca:0xffe7a0,0.042);
      rays.beginPath();rays.moveTo(gx+Math.cos(a-0.035)*inner,gy+Math.sin(a-0.035)*inner);
      rays.lineTo(gx+Math.cos(a+0.035)*inner,gy+Math.sin(a+0.035)*inner);
      rays.lineTo(gx+Math.cos(a)*outer,gy+Math.sin(a)*outer);rays.closePath();rays.fillPath();
    }

    // ฉากเปิด = ภาพล้วน (เจ้าของขอNoneตัวหนังสือลอยขึ้น) — เอา title/sub/skip text ออก แต่ยังแตะเพื่อข้ามได้
    const flash=this.add.rectangle(cx,cy,W,H,0xfff7df,0).setBlendMode(Phaser.BlendModes.ADD);

    for(let i=0;i<26;i++){
      const a=Math.random()*TAU,start=4+Math.random()*Math.min(W,H)*0.07,end=Math.max(W,H)*(0.42+Math.random()*0.28);
      const s=this.add.circle(gx+Math.cos(a)*start,gy+Math.sin(a)*start,1+Math.random()*2.4,i%3===0?0xffd36b:0xffb0d4,0)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({targets:s,x:gx+Math.cos(a)*end,y:gy+Math.sin(a)*end,alpha:{from:0,to:0.9},scale:{from:0.25,to:2.6},duration:700+Math.random()*650,delay:400+Math.random()*1500,repeat:-1,ease:'Quad.in'});
    }

    let leaving=false;
    const finish=()=>{
      if(leaving)return; leaving=true; this.input.enabled=false;
      this.cameras.main.fadeOut(reduced?80:260,255,247,223);
      this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.start('Game'));
    };
    this.time.delayedCall(reduced?900:4200,finish);
    this.time.delayedCall(reduced?100:650,()=>{
      if(leaving)return;
      this.input.once('pointerdown',finish);
      this.input.keyboard&&this.input.keyboard.once('keydown',finish);
    });

    this.tweens.add({targets:bg,alpha:1,displayWidth:W*1.50,displayHeight:H*1.50,duration:reduced?80:4050,ease:'Sine.in'});
    this.tweens.add({targets:shade,alpha:0.04,duration:reduced?80:3300,ease:'Quad.in'});
    this.tweens.add({targets:rays,alpha:0.9,scale:1.7,duration:reduced?80:3600,ease:'Quad.in'});
    this.tweens.add({targets:gateGlow,alpha:0.68,scale:2.4,duration:reduced?80:3500,ease:'Quad.in'});
    this.tweens.add({targets:flash,alpha:0.92,duration:reduced?80:620,delay:reduced?500:3350,ease:'Quad.in'});
    this.cameras.main.fadeIn(reduced?80:350,23,16,31);
    this.time.delayedCall(50,()=>{ if(window.GameLoader)window.GameLoader.hide(); });
  }
}

/* ---- SKILLS: auto-cast, flashy, stackable ---- */
const SKILLDEFS = {
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
const STREAK_MARKS = {10:[0,'Nice!'],25:[1,'Great!'],50:[2,'Savage!'],100:[3,'Godlike!'],200:[4,'Demonic!'],350:[5,'Legend!']};
// ระดับความยากต่อStage (เลือกก่อนเล่น) — กฎเหล็ก: ยิ่งยาก ศัตรูยิ่งถึก/แรง แต่ "better rewards"
/* ระดับความยาก 3 ระดับ (ลดจาก 5 เพื่อลดความซับซ้อน/ภาระบาลานซ์ · v2.53) · กฎเหล็ก: ยิ่งยากbetter rewards */
const DIFFS = [
  {lv:1,name:'Normal', emoji:'🟢',color:0x66d3b3,hp:1.0, dmg:1.0,  reward:1.0},
  {lv:2,name:'Hard',   emoji:'🟡',color:0xffd24d,hp:1.75,dmg:1.18, reward:1.85},
  {lv:3,name:'Hell',   emoji:'🔴',color:0xff5a6e,hp:2.8, dmg:1.38, reward:3.0},
];
// Zone Level — ตัวแปรความยากรวมของด่าน (ความคืบหน้าด่าน × ระดับความยาก) = สเกลเดียวที่ระบบอื่นอ้างอิงได้ (Bazaar stock, reward tier ฯลฯ)
// stageIndex 0..5 · diff 1..3 → Zone 1..18 (ยิ่งสูง = ยิ่งยาก/รางวัลดีขึ้น)
function stageZoneLevel(stageIndex,diff){ const si=Math.max(0,Math.min(5,Math.floor(Number(stageIndex)||0))); const d=Math.max(1,Math.min(3,Math.floor(Number(diff)||1))); return si*3+d; }
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
  { id:'common', name:'Common',    ranks:1, color:0x9aa6b8, weight:68 },
  { id:'rare',   name:'Rare',     ranks:2, color:0x5ad1ff, weight:22 },
  { id:'epic',   name:'Epic',     ranks:3, color:0xc07bff, weight:8  },
  { id:'legend', name:'Legendary', ranks:4, color:0xffcf40, weight:2  },   // ของหายากเจอยากขึ้น (เดิม 56/27/13/4)
];
function rollRarity(){ const tot=RARITIES.reduce((s,r)=>s+r.weight,0); let x=Math.random()*tot; for(const r of RARITIES){ x-=r.weight; if(x<=0)return r; } return RARITIES[0]; }
/* ตัวคูณสเกลตอนโชว์ชีต action (idle/พุ่ง/โดนตี ฯลฯ) เฉพาะตัวที่อาร์ต action เล็กกว่าอาร์ต run — กันตัวหดตอนหยุดเดิน */
const CHAR_ACTION_SCALE = {};   // ชีตท่า/วิ่งของมิ้นต์ใหม่สัดส่วนตรงกันแล้ว ไม่ต้องคูณชดเชย
const AWAKEN_CAP = 2;         // ต่อหนึ่งด่านมี Awaken ได้ไม่เกิน 2 สาย เพื่อคุม power budget
const SKILL_CAP  = 4;        // จำกัดสายโจมตีให้ต้องเลือก build จริง ไม่กวาดทุกสกิลในWaitบเดียว
const PASSIVE_CAP = 4;       // จำกัดพรติดตัว ลด power stacking และทำให้คู่ Evolution มีความหมาย
const REROLL_MAX = 3;        // สุ่มการ์ดเลเวลอัพใหม่ได้ N times/ด่าน
const BANISH_MAX = 2;        // ลบสกิลออกจากกองการ์ด (ไม่โผล่อีกทั้งด่าน) ได้ N times/ด่าน
/* ---- PASSIVES: Passiveแบบเลเวลได้ (คนละหมวดกับAttack Skill) · apply(p)=ผล 1 rank ---- */
const PASSIVES = {
  heart: { name:'Mochi Vitality', emoji:'❤️', color:0xff5f7a, max:5, desc:'+10% max HP and heals by the amount gained',
    apply(p){ const before=p.maxhp;p.maxhp*=1.10;p.hp=Math.min(p.maxhp,p.hp+(p.maxhp-before)); } },
  power: { name:'Sweet Power',   emoji:'💥', color:COLORS.grape, max:5, desc:'+7% to all damage',
    apply(p){ p.dmgMul*=1.07; } },
  swift: { name:'Slick Feet',   emoji:'👟', color:COLORS.mint, max:5, desc:'+5% move speed (capped)',
    apply(p){ p.baseSpeed=Math.min(BALANCE.moveSpeed*1.28,p.baseSpeed*1.05); } },
  magnet:{ name:'Keen Nose',     emoji:'🧲', color:COLORS.toast, max:5, desc:'+30% pickup range',
    apply(p){ p.pickup*=1.3; } },
  haste: { name:'Quick Hands',      emoji:'⏩', color:0x8fd0ff, max:5, desc:'Cast 5% more often',
    apply(p){ p.cdMul=Math.max(0.76,(p.cdMul||1)*0.95); } },
  crit:  { name:'Sharp Eye',     emoji:'🎯', color:0xffd166, max:5, desc:'+4% crit chance (×1.65)',
    apply(p){ p.critChance=Math.min(0.35,(p.critChance||0)+0.04); } },
  guard: { name:'Soft Armor',  emoji:'🛡️', color:0xa0e0c0, max:5, desc:'Take 8% less damage',
    apply(p){ p.dmgTakenMul=(p.dmgTakenMul||1)*0.92; } },
  regen: { name:'Flavor Regeneration', emoji:'💗', color:0xff9ec4, max:5, desc:'Regenerate 0.20% max HP per second',
    apply(p){ p.regenPct=(p.regenPct||0)+0.002; } },
  sugarOnKill:{ name:'Sugar on Kill', emoji:'🍬', color:0xffd166, max:5, desc:'Heal 1 HP on kill (0.45s cooldown)',
    apply(p){ p.lifeOnKill=(p.lifeOnKill||0)+1; } },
  flavorCore:{ name:'Balanced Core', emoji:'💠', color:0xffd166, max:5, desc:'+4% HP and +3% damage',
    apply(p){ p.maxhp*=1.04; p.dmgMul*=1.03; } },
  bitterResolve:{ name:'Bitter Resolve', emoji:'🖤', color:0x9fa7c8, max:5, desc:'+8% damage while below 40% HP',
    apply(p){ p.lowHpDmg=(p.lowHpDmg||0)+0.08; } },
  returningTaste:{ name:'Returning Taste', emoji:'✨', color:0xffa7c8, max:5, desc:'Regen 0.08% max HP per second and -2% cooldown',
    apply(p){ p.regenPct=(p.regenPct||0)+0.0008; p.cdMul=Math.max(0.76,(p.cdMul||1)*0.98); } },
};
/* ---- CHARACTER COMBAT PROFILES: บทบาท + Stats + อาวุธประจำตัว ---- */
const CHARACTERS = {
  momo:{name:'Strawberry',emoji:'🍓',unique:'berryRebound',weapon:'berryBlaster',cost:0,color:0xff9ec4,role:'Nimble gunner',desc:'Sweet but Strong — rapid fire, fast movement, steady crits',stats:{hp:0,dmg:1.00,spd:1.06,def:1.00,crit:0.05,cdr:0.96,regenFlat:0.25},rating:{hp:3,atk:3,spd:4,def:3}},
  mint:{name:'Mint',emoji:'🌿',unique:'mintSanctuary',weapon:'mintNova',cost:150,color:0x8fd0ff,role:'Crowd controller',desc:'Cool and Agile — wide freezes, fast, casts often',stats:{hp:18,dmg:0.92,spd:1.12,def:0.90,crit:0.02,cdr:0.94,regenFlat:0.45},rating:{hp:4,atk:2,spd:5,def:4}},
  cocoa:{name:'Cocoa',emoji:'🍫',unique:'flickerStrike',weapon:'bearGauntlet',cost:400,color:0x8b5cf0,role:'Frontline bruiser',desc:'Warm and Tough — a sturdy melee brawler with high HP and strong regen (trade raw damage for durability)',stats:{hp:46,dmg:1.03,spd:0.94,def:0.88,crit:0.03,cdr:1.02,regenFlat:1.2},rating:{hp:5,atk:3,spd:2,def:5}},
  taro:{name:'Taro',emoji:'🍠',unique:'pathRecall',weapon:'riftCompass',cost:250,color:0xb388ff,role:'Storm explorer',desc:'Reads paths, dodges fast, and chains lightning across targets',stats:{hp:-5,dmg:1.02,spd:1.14,def:1.04,crit:0.06,cdr:0.90,regenFlat:0.15},rating:{hp:2,atk:4,spd:5,def:2}},
  sesame:{name:'Sesame',emoji:'⚫',unique:'oathMirror',weapon:'oathMirror',cost:550,color:0x8a8f9c,role:'Mirror sniper',desc:'Fires a Mirror Beam that hits bosses at full damage. Hold still to charge Focus — the beam grows stronger and wider — while the bullet Guard drains. Move to recharge Guard. Rewards in-and-out play',stats:{hp:34,dmg:0.96,spd:0.96,def:0.86,crit:0.01,cdr:0.98,regenFlat:0.5},rating:{hp:4,atk:4,spd:3,def:4}},
  berry:{name:'Berry Core',emoji:'💗',unique:'jamOverdrive',weapon:'jamCannon',cost:700,color:0xff5f88,role:'Mobile turret',desc:'Round but Relentless — heavy blasts and lock-on barrages that sweep crowds',stats:{hp:10,dmg:1.07,spd:0.98,def:0.96,crit:0.04,cdr:0.97,regenFlat:0.30},rating:{hp:3,atk:5,spd:3,def:3}},
};
const CHAR_ORDER=['momo','mint','cocoa','taro','sesame'];   // Berryคอร์ถูกพักไว้ก่อน (v2.46.0) — ยังคงนิยามใน CHARACTERS กันเซฟเก่าพัง
const SIGNATURE_WEAPONS = {
  berryBlaster:{name:'Heart Seed Gun',emoji:'🍓',skill:'sprinkle',dmgMul:1.16,cdMul:0.94,shots:0,trait:'+16% damage · steadier fire'},
  mintNova:{name:'Mint Frost Core',emoji:'❄️',skill:'frost',dmgMul:1.02,cdMul:0.72,areaMul:1.18,controlMul:1.18,trait:'Rapid frost lances · -28% cooldown'},
  bearGauntlet:{name:'Cocoa Bear Gauntlet',emoji:'🐻',skill:'meteor',dmgMul:1.06,cdMul:1.05,areaMul:1.15,trait:'2 heavy slams · shockwave only after Mutation'},
  riftCompass:{name:'Rift Lightning Compass',emoji:'🧭',skill:'thunder',dmgMul:1.02,cdMul:0.86,chains:2,trait:'+2 chain targets · -14% cooldown'},
  oathMirror:{name:'Sesame Oath Mirror',emoji:'🪞',skill:'mirror',dmgMul:0.96,cdMul:0.88,areaMul:1.12,reflect:2,trait:'+2 reflected shots · +12% area'},
  jamCannon:{name:'Jam Core Cannon',emoji:'💗',skill:'rocket',dmgMul:1.10,cdMul:0.92,trait:'+10% blast · -8% cooldown'},
};
/* ---- BASIC ATTACK PROTOTYPE: ตัวละครเป็นแกน build แทนการสะสม auto-skill หลายชนิด ---- */
const BASIC_ATTACKS = {
  momo:{name:'Heart Seed Blaster',emoji:'🍓',skill:'sprinkle',color:0xff76a8,evolution:'Heartstorm Blaster',
    upgrades:[
      {id:'power',name:'Dense Seeds',emoji:'💥',iconKey:'ic_momo_power',max:5,desc:'+12% Basic Attack damage per rank'},
      {id:'rate',name:'Mochi Trigger',emoji:'⏩',iconKey:'ic_momo_rate',max:5,desc:'+8% fire rate per rank'},
      {id:'size',name:'Plump Seeds',emoji:'🔴',iconKey:'ic_momo_size',max:3,desc:'+14% projectile size per rank'},
      {id:'volley',name:'Sweet Branching',emoji:'🌱',iconKey:'ic_momo_volley',max:3,desc:'+1 seed per volley per rank'}],
    mutations:[
      {id:'ricochet',name:'Heart Ricochet',emoji:'💞',desc:'Seeds bounce to 2 new targets'},
      {id:'fan',name:'Petal Spread',emoji:'🌸',desc:'Wider fan and +2 shots'}]},
  cocoa:{name:'Bear Core Combo',emoji:'🐻',skill:'meteor',color:0x8b5cf0,evolution:'Titan Bear Finale',
    upgrades:[
      {id:'power',name:'Heavy Cocoa Punch',emoji:'💥',iconKey:'ic_cocoa_power',max:5,desc:'+12% Basic Attack damage per rank'},
      {id:'rate',name:'Fighter Rhythm',emoji:'⏩',iconKey:'ic_cocoa_rate',max:5,desc:'+8% attack speed per rank'},
      {id:'size',name:'Mochi Reach',emoji:'🥊',iconKey:'ic_cocoa_size',max:3,desc:'+12% punch range & arc per rank'},
      {id:'combo',name:'Finisher Force',emoji:'🐻',iconKey:'ic_cocoa_combo',max:3,desc:'3rd punch +18% per rank'}],
    mutations:[
      {id:'rush',name:'Rushdown',emoji:'💨',desc:'Combo 18% faster and wider hooks'},
      {id:'breaker',name:'Earthbreaker',emoji:'💢',desc:'Ground slam +25% with a repeat shockwave'}]},
  berry:{name:'Jam Cannon',emoji:'💗',skill:'rocket',color:0xff5f88,evolution:'Jam Supernova',
    upgrades:[
      {id:'power',name:'Jam Pressure',emoji:'💥',iconKey:'ic_berry_power',max:5,desc:'+12% Basic Attack damage per rank'},
      {id:'rate',name:'Sweet Slide',emoji:'⏩',iconKey:'ic_berry_rate',max:5,desc:'+8% fire rate per rank'},
      {id:'size',name:'Plump Warhead',emoji:'🔴',iconKey:'ic_berry_size',max:3,desc:'+14% rocket & blast size per rank'},
      {id:'cluster',name:'Twin Jam Chamber',emoji:'💗',iconKey:'ic_berry_cluster',max:3,desc:'+1 rocket per volley per rank'}],
    mutations:[
      {id:'seeker',name:'Core Seeker',emoji:'🎯',desc:'Faster lock-on and +20% blast'},
      {id:'sticky',name:'Sticky Jam',emoji:'🫙',desc:'+35% blast radius and briefly pins enemies'}]},
  mint:{name:'Frost Lance',emoji:'🧊',skill:'frost',color:0x8fd0ff,evolution:'Glacier Sovereign',
    upgrades:[
      {id:'power',name:'Sharp Lance Tip',emoji:'💥',iconKey:'ic_mint_power',max:5,desc:'+12% ice lance damage per rank'},
      {id:'rate',name:'Fast Charge',emoji:'⏩',iconKey:'ic_mint_rate',max:5,desc:'+8% charge/release speed per rank'},
      {id:'chill',name:'Long Shaft',emoji:'🏹',iconKey:'ic_mint_chill',max:3,desc:'Lance pierces farther + more shards per rank'},
      {id:'linger',name:'Scattering Shards',emoji:'💠',iconKey:'ic_mint_linger',max:3,desc:'More ice shards + wider spread per rank'}],
    mutations:[
      {id:'blizzard',name:'Shatter Lance',emoji:'🌨️',desc:'Lance/shards re-shatter frozen targets for bonus damage'},
      {id:'permafrost',name:'Eternal Frost',emoji:'🥶',desc:'Deeper freeze and +40% lance damage'}]},
  taro:{name:'Rift Bolt Compass',emoji:'⚡',skill:'thunder',color:0xb388ff,evolution:'Stormstep Sovereign',
    upgrades:[
      {id:'power',name:'Dense Charge',emoji:'💥',iconKey:'ic_taro_power',max:5,desc:'+12% Basic Attack damage per rank'},
      {id:'rate',name:'Lightning Rhythm',emoji:'⏩',iconKey:'ic_taro_rate',max:5,desc:'+8% lightning cast speed per rank'},
      {id:'arc',name:'Chain Bolt',emoji:'🔗',iconKey:'ic_taro_arc',max:3,desc:'+1 chain target per rank'},
      {id:'surge',name:'Twin Bolt',emoji:'⚡',iconKey:'ic_taro_surge',max:3,desc:'+1 simultaneous strike per rank'}],
    mutations:[
      {id:'chainlord',name:'Chainlord',emoji:'⛓️',desc:'+2 chains and +40% chain range'},
      {id:'stormcaller',name:'Stormcaller',emoji:'🌩️',desc:'+2 simultaneous strikes and +20% damage'}]},
  sesame:{name:'Mirror Beam',emoji:'🪞',skill:'mirror',color:0x8a8f9c,evolution:'Absolute Oath Mirror',
    upgrades:[
      {id:'power',name:'Strong Oath',emoji:'💥',iconKey:'ic_sesame_power',max:5,desc:'+12% beam damage per rank'},
      {id:'rate',name:'Fast Mirror Pulse',emoji:'⏩',iconKey:'ic_sesame_rate',max:5,desc:'+8% fire rate per rank'},
      {id:'pane',name:'Extra Pane',emoji:'🪟',iconKey:'ic_sesame_pane',max:3,desc:'+1 beam & wider per rank'},
      {id:'radius',name:'Long Beam',emoji:'🛡️',iconKey:'ic_sesame_radius',max:3,desc:'+12% beam length per rank'}],
    mutations:[
      {id:'fortress',name:'Mirror Fortress',emoji:'🏰',desc:'+25% circle radius'},
      {id:'retaliate',name:'Retaliation',emoji:'💢',desc:'+30% pulse power and slows hit enemies'}]},
};
const CHARACTER_UNIQUES = {
  berryRebound:{name:'Strawberry Rebound',emoji:'🍓',cd:8,color:0xff76a8,desc:'Fires sweet seeds all around and heals HP — moderate power, low cooldown'},
  mintSanctuary:{name:'Diamond Dust',emoji:'❄️',cd:11,color:0x8fd0ff,desc:'Summons a wide snowstorm around you, raining ice shards that hit repeatedly, freezing crowds + brief guard'},
  voidPull:{name:'Dark Chocolate Void',emoji:'🕳️',cd:13,color:0x8b5cf0,desc:'Opens a black hole that pulls enemies in for continuous damage, then implodes'},
  flickerStrike:{name:'Bear Flicker',emoji:'⚡',cd:4.5,color:0x9f6bff,desc:'Warp-strikes enemies rapidly with a short cooldown, invulnerable during the combo'},
  pathRecall:{name:'Taro Chain Bolt',emoji:'⚡',cd:8.5,color:0xb388ff,desc:'Fires lightning that chains from enemy to enemy, then refunds Dash and boosts speed'},
  oathMirror:{name:'Oath Dome',emoji:'🪞',cd:12,color:0xd8d9e2,desc:'Raises a protective mirror dome, cuts damage, clears all enemy bullets inside, pulses repeatedly, then ends with a glass shatter'},
  jamOverdrive:{name:'Jam Overdrive',emoji:'💗',cd:10.5,color:0xff5f88,desc:'Overdrives the heart-seed gun, firing lock-on barrages and adding barrels as it levels'},
};
const UNIQUE_MAX_LV=4;
const uniqueAt={2:3,3:7,4:11};   // run level milestones shared by UI, progression, and validation
const UNIQUE_TIERS={
  berryRebound:{2:'More seeds and more HP recovery',3:'Stronger seeds with a wider spread',4:'Berry Crown fires 20+ seeds with max healing'},
  mintSanctuary:{2:'Wider storm that hits harder',3:'Lasts longer + deeper freeze',4:'Absolute Blizzard — a giant storm covers the screen with the longest guard'},
  voidPull:{2:'Wider hole that pulls harder',3:'Lasts longer + stronger DoT',4:'Singularity — a giant hole pulls the whole screen and ends in a violent blast'},
  flickerStrike:{2:'More warp-strikes + higher damage',3:'Wider strike arc + longer reach',4:'Blur Rampage — warp-strike the whole screen, healing each hit'},
  pathRecall:{2:'More chains and jump range',3:'Bolt splits into two, spreading wider',4:'Storm Arc — chains across the field with max damage'},
  oathMirror:{2:'Wider dome and stronger pulses',3:'Lasts longer and pulses faster',4:'Perfect Oath — heals HP after the shatter with max pulse power'},
  jamOverdrive:{2:'More barrels and salvos',3:'Fires faster and pierces one enemy',4:'Berry Barrage — three barrels pierce the crowd at full power'},
};

/* ---- TALENTS: ผังพรสวรรค์ (แยกแต้มต่อตัวละคร) · ลง 1 แต้ม/rank · ผลใส่ตอน applyMeta ---- */
/* ---- CHAR_TALENTS: "Talents" — ยกระดับ Unique Skill และสไตล์เล่นของตัวละคร ---- */
const CHAR_TALENTS = {
  momo: [   // สายสมดุล — เก่งWaitบด้าน + คริติคอล
    { id:'hp',      emoji:'❤️', name:'Vitality',  max:5, per:'+8% max HP',   apply:(p,r)=>{ p.maxhp*=(1+0.08*r); } },
    { id:'dmg',     emoji:'💥', name:'Attack Power',  max:5, per:'+6% damage',       apply:(p,r)=>{ p.dmgMul*=(1+0.06*r); } },
    { id:'crit',    emoji:'🎯', name:'Critical',     max:4, per:'+5% crit chance (×1.8)', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'cdr',     emoji:'⏱️', name:'Fast Cast',     max:4, per:'-5% skill cooldown', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'regen',   emoji:'💗', name:'Regen',    max:3, per:'+0.5 HP/s',  apply:(p,r)=>{ p.regen+=0.5*r; } },
    { id:'twinSprinkle',emoji:'🍓', name:'Radiant Heart Seeds', max:1, per:'✦ Unique: Strawberry Rebound bursts seeds in 16 directions!', apply:(p,r)=>{ p.twinSprinkle=true; } },
  ],
  mint: [   // สายแทงค์ — อึดโหด ดูดเลือด ฟื้นตัว
    { id:'hp',       emoji:'❤️', name:'Tough Body',    max:6, per:'+12% max HP',  apply:(p,r)=>{ p.maxhp*=(1+0.12*r); } },
    { id:'armor',    emoji:'🛡️', name:'Ice Armor', max:5, per:'-6% damage taken', apply:(p,r)=>{ p.dmgTakenMul*=(1-0.06*r); } },
    { id:'regen',    emoji:'💗', name:'Cool Recovery',  max:4, per:'+0.7 HP/s',  apply:(p,r)=>{ p.regen+=0.7*r; } },
    { id:'lifesteal',emoji:'🍓', name:'Sweet Leech',    max:3, per:'+0.7 HP on kill', apply:(p,r)=>{ p.lifesteal+=0.7*r; } },
    { id:'magnet',   emoji:'🧲', name:'Keen Nose',     max:3, per:'+15% pickup range',     apply:(p,r)=>{ p.pickup*=(1+0.15*r); } },
    { id:'deepFreeze',emoji:'🌿', name:'Breath Over the Rift', max:1, per:'✦ Unique: Mint\'s breath zone expands its radius!', apply:(p,r)=>{ p.deepFreeze=true; } },
  ],
  cocoa: [   // สายจอมพลัง — ดาเมจ/คริติคอลจัดFull
    { id:'dmg',     emoji:'💥', name:'Destruction',  max:6, per:'+10% damage',      apply:(p,r)=>{ p.dmgMul*=(1+0.10*r); } },
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
    { id:'echoPath', emoji:'🧭', name:'Echo Map', max:1, per:'✦ Unique: records a longer path, wider blast, and longer speed boost!', apply:(p,r)=>{ p.echoPath=true; } },
  ],
  sesame: [
    { id:'hp', emoji:'❤️', name:'Steady Sesame Core', max:6, per:'+11% max HP', apply:(p,r)=>{ p.maxhp*=(1+0.11*r); } },
    { id:'armor', emoji:'🛡️', name:'Oath Architecture', max:5, per:'-6% damage taken', apply:(p,r)=>{ p.dmgTakenMul*=(1-0.06*r); } },
    { id:'regen', emoji:'💗', name:'Flavor Lantern', max:4, per:'+0.6 HP/s', apply:(p,r)=>{ p.regen+=0.6*r; } },
    { id:'dmg', emoji:'💥', name:'Counter Seal', max:4, per:'+6% damage', apply:(p,r)=>{ p.dmgMul*=(1+0.06*r); } },
    { id:'mirrorWard', emoji:'🪞', name:'Perfect Mirror Architecture', max:1, per:'✦ Unique: more mirrors, duration, and reflected shots!', apply:(p,r)=>{ p.mirrorWard=true; } },
  ],
  berry: [
    { id:'dmg', emoji:'💥', name:'Jam Core Pressure', max:5, per:'+7% damage', apply:(p,r)=>{ p.dmgMul*=(1+0.07*r); } },
    { id:'cdr', emoji:'⏱️', name:'Fast Heart Trigger', max:4, per:'-5% skill cooldown', apply:(p,r)=>{ p.cdMul*=(1-0.05*r); } },
    { id:'hp', emoji:'❤️', name:'Packed Mochi', max:4, per:'+9% max HP', apply:(p,r)=>{ p.maxhp*=(1+0.09*r); } },
    { id:'crit', emoji:'🎯', name:'Seed Sights', max:4, per:'+5% crit chance', apply:(p,r)=>{ p.critChance+=0.05*r; } },
    { id:'pressurizedJam', emoji:'💗', name:'Twin Pressure Chamber', max:1, per:'✦ Unique: Jam Overdrive adds 2 salvos and rounds per barrel!', apply:(p,r)=>{ p.pressurizedJam=true; } },
  ],
};
function charTalents(c){ return CHAR_TALENTS[c]||CHAR_TALENTS.momo; }
// EXP ที่ต้องใช้เพื่อขึ้นจากเลเวล l → l+1
function charExpNeed(l){ return 40 + l*35; }

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
  { key:'candycore', a:'sprinkle', b:'power',  sig:true, emoji:'🍬💥', name:'Bursting Heart Praline', desc:'⭐ +13% damage · +3% crit', effect:p=>{p.dmgMul*=1.13;p.critChance+=0.03;} },
  { key:'sugarshot', a:'sprinkle', b:'crit',   emoji:'🍬🎯', name:'Sharp Splinter Seed', desc:'+5% crit', effect:p=>{p.critChance+=0.05;} },
  { key:'ricochet',  a:'sprinkle', b:'haste',  emoji:'🍬⏩', name:'Wandering Candy', desc:'-7% cooldown', effect:p=>{p.cdMul*=0.93;} },
  // 🍫 โกโก้ (meteor) — สายทุบหนักแนวหน้า
  { key:'titanjab',  a:'meteor',   b:'power',  sig:true, emoji:'🍩💥', name:'Titan Punch Sundae', desc:'⭐ +14% damage · -5% damage taken', effect:p=>{p.dmgMul*=1.14;p.dmgTakenMul*=0.95;} },
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
  { key:'reflection',a:'mirror',   b:'guard',  sig:true, emoji:'🪞🛡️', name:'Oath Sundae', desc:'⭐ -12% damage taken · +5% damage', effect:p=>{p.dmgTakenMul*=0.88;p.dmgMul*=1.05;} },
  { key:'mirrormend',a:'mirror',   b:'regen',  emoji:'🪞💗', name:'Healing Mirror', desc:'+0.8 HP/s', effect:p=>{p.regen+=0.8;} },
  { key:'oathkeep',  a:'mirror',   b:'returningTaste', emoji:'🪞🔁', name:'Echoing Oath', desc:'+7% damage', effect:p=>{p.dmgMul*=1.07;} },
];

function passivePairHint(key){
  const pairs=COMBOS.filter(c=>c.b===key).map(c=>{const a=SKILLDEFS[c.a];return a?(a.emoji+' '+a.name):c.a;});
  if(pairs.length)return 'Awaken pairs with: '+pairs.join(' / ');
  const tips={
    heart:'Good for: melee and tank builds',
    flavorCore:'Good for: any build wanting offense + defense',
    returningTaste:'Good for: Unique / long-cooldown skills',
  };
  return tips[key]||'Good for: any build';
}

/* ---- UPGRADES (ระบบ "Flavor Weave"): 3 แก่นถาวรที่ต้องประสานให้Fullแล้วเลื่อนระดับสายใย ----
   วนลูป: อัพ 3 สแตตให้Full (Lv TAL_MAX) → เลื่อนยศ (rank++) → สแตตติดตัวเพิ่มถาวร +
   การ์ด 3 ใบรีเซ็ตกลับ Lv0 + ราคาแพงขึ้น (×(1+rank·0.8)) → อัพFullใหม่ → เลื่อนยศ ... ไปเรื่อย ๆ
   ผลรวมที่ใช้จริง = rank·TAL_MAX + เลเวลWaitบนี้ (ยศยิ่งสูง สแตตยิ่งเยอะ · ดาเมจเป็น flat กันเวอร์) */
const TAL_MAX = 3;   // แต่ละแก่นอัพได้ Lv1..TAL_MAX ต่อยศ (v4.7 ลดจาก 5→3 ให้เลื่อนยศ/ได้ RP ไวขึ้น)
const UPGRADES = {
  hp:  { emoji:'❤️', tag:'CORE', name:'Life Core', unit:'+16 max HP/level', color:0xff5f7a, base:30, per:16,
         apply:(p,tot)=>{ p.maxhp+=16*tot; },                          show:tot=>'+'+(16*tot)+' HP' },
  dmg: { emoji:'✨', tag:'FLAVOR', name:'Flavor Spark', unit:'+2 flat damage/level',  color:0xf0a54a, base:45, per:2,
         apply:(p,tot)=>{ p.flatDmg=(p.flatDmg||0)+2*tot; },           show:tot=>'+'+(2*tot)+' DMG' },
  def: { emoji:'🛡️', tag:'BOND', name:'Oath Shell', unit:'~1.5% less damage taken/level', color:0x6ec6ff, base:40, per:1,
         apply:(p,tot)=>{ p.dmgTakenMul*=Math.pow(0.985,tot); },       show:tot=>'-'+Math.round((1-Math.pow(0.985,tot))*100)+'% DMG taken' },
};
const UPG_ORDER=['hp','dmg','def'];
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
  { id:'vigor',   tier:1, emoji:'❤️', name:'Vigor',        max:5, desc:'+6% max HP per rank' },
  { id:'might',   tier:1, emoji:'💥', name:'Might',        max:5, desc:'+5% damage per rank' },
  { id:'greed',   tier:1, emoji:'🍬', name:'Sweet Greed',  max:5, desc:'+8% Sugar from stage rewards per rank' },
  { id:'reroll',  tier:2, emoji:'🎲', name:'Spare Cards',  max:3, desc:'+1 card reroll per stage' },
  { id:'banish',  tier:2, emoji:'🚫', name:'Cull',         max:2, desc:'+1 card banish per stage' },
  { id:'boxLuck', tier:2, emoji:'🎁', name:'Box Luck',     max:3, desc:'+30% secret box drop chance per rank' },
  { id:'ironWill',tier:3, emoji:'🛡️', name:'Iron Will',    max:3, desc:'-4% damage taken per rank' },
  { id:'fortune', tier:3, emoji:'💠', name:'Fortune',      max:3, desc:'+10% crafting currency from rewards per rank' },
  { id:'revive',  tier:3, emoji:'🕯️', name:'Revival Candle',max:1, desc:'Revive once per stage at 45% HP' },
];
const PERK_TIER_REQ = { 2:3, 3:8 };   // แต้มที่ต้องลงในชั้นก่อนหน้าเพื่อปลดชั้นนี้
/* ---- HUB_GROUPS: รวมปุ่มเมนูย่อยเป็นกลุ่ม ให้หน้า Hub สะอาดขึ้น (rows: [targetScreen,emoji,label,sub]) ---- */
const HUB_GROUPS = {
  gLoadout:{ title:'🎒 Gear & Power', rows:[
    ['stats','📊','Character Stats','See your real numbers'],
    ['upgrade','✦','Flavor Weave & Rank','Cores, Rank up & 🏅 Passive tree'],
    ['gear','◆','Equipment','Equip, compare and dismantle'],
    ['craft','🧪','Focused Crafting','See possible stats, craft rolls one at random'],
    ['bazaar','🏪','Mochi Bazaar','Buy · Gamble · Sell for 🍬'],
    ['gearInbox','📦','Reward Inbox','Overflow loot waiting to be claimed'] ] },
  gCodex:{ title:'📖 Codex', rows:[
    ['skills','✧','Skill Codex','Skills, passives and Awaken pairs'],
    ['cookbook','🍳','Cookbook','Discovered recipes + signatures ⭐'],
    ['bestiary','☷','Bestiary','Discoveries and bonuses'] ] },
  gActivity:{ title:'🎉 Activities', rows:[
    ['daily','📅','Daily Missions','Daily reward and challenge stage'],
    ['achievements','🏆','Achievements','Milestones and Sugar rewards'],
    ['endgame','🌙','Endgame','Ascension · Endless · secret boss'] ] },
  gMore:{ title:'⚙ More', rows:[
    ['settings','⚙','Settings','Sound, shake, flash and VFX'],
    ['__tutorial','🎓','How to Play','Replay the controls & combat tutorial'] ] },
};

/* ---- QUESTS: เส้นทางเป้าหมาย (Player Journey) — ร้อยทุกระบบเข้าด้วยกัน โชว์ "Next Quest" ที่หน้าหลัก ---- */
const QUESTS = [
  { id:'s1',     t:'Clear Stage 1 — Sour Ant Nest',        r:60,  go:'chapter',  done:d=>!!(d.stageMastery||{})[0] },
  { id:'cook1',  t:'Cook your first dish',                 r:50,  go:'chapter',  done:d=>Object.keys(d.cookbook||{}).length>=1 },
  { id:'rank1',  t:'Reach your first Rank',                r:60,  go:'gLoadout', done:d=>(d.rank||0)>=1 },
  { id:'gear3',  t:'Collect 3 pieces of equipment',        r:70,  go:'gLoadout', done:d=>(d.ownedGear||[]).length>=3 },
  { id:'s2',     t:'Clear Stage 2 — Rotten Drain',         r:90,  go:'chapter',  done:d=>!!(d.stageMastery||{})[1] },
  { id:'cook3',  t:'Discover 3 recipes',                   r:80,  go:'gCodex',   done:d=>Object.keys(d.cookbook||{}).length>=3 },
  { id:'s3',     t:'Clear Stage 3 — Chili Engine Room',    r:110, go:'chapter',  done:d=>!!(d.stageMastery||{})[2] },
  { id:'legend', t:'Hunt 1 Legendary item',                r:150, go:'gLoadout', done:d=>(d.ownedGear||[]).some(id=>String(id).startsWith('lg_')) },
  { id:'s4',     t:'Clear Stage 4 — Sugar Freezer',        r:140, go:'chapter',  done:d=>!!(d.stageMastery||{})[3] },
  { id:'hell1',  t:'Clear any stage on Hell difficulty',   r:180, go:'chapter',  done:d=>(d.diffBest||[]).some(v=>v>=3) },
  { id:'s5',     t:'Defeat The Great Hunger (Stage 5)',    r:250, go:'chapter',  done:d=>!!(d.stageMastery||{})[4] },
];

/* ---- GEAR: ของสวมใส่ 2 ช่อง (weapon/charm) ซื้อด้วย Sugar แล้วสวมใส่ ---- */
// ของสวมใส่ · ตีบวกได้ (lv=ระดับตีบวก 0..enhMax) เพิ่มพลังต่อระดับ
const GEAR_ENH_MAX = 10;
// โอกาสตีบวก lv->lv+1 · +0..+3 ปลอดภัย · +4 ขึ้นไปมีโอกาส "แตก" (ขั้นลดลง 1, ไม่ต่ำกว่า +3) · +8..+10 มีโอกาส "ถูกทำลาย" (ไอเทมหาย)
function enhanceOdds(lv){ if(lv<4)return{success:1,brk:0,destroy:0};
  const t={4:[0.72,0.28,0],5:[0.64,0.36,0],6:[0.56,0.44,0],7:[0.48,0.52,0],8:[0.42,0.43,0.15],9:[0.34,0.46,0.20]}[lv]||[0.34,0.46,0.20];
  return {success:t[0],brk:t[1],destroy:t[2]}; }
function gearSellSugar(item){if(!item)return 0;return (GEAR_DISMANTLE_BASE[item.grade]||0)*6+Math.max(1,item.itemLevel||1)*2+Math.max(0,item.enhanceLv||0)*10;}
const GEAR_INBOX_CAP = 5;
const GEAR_DISMANTLE_BASE = {start:0,common:1,rare:3,epic:7,legend:15};
function gearDismantleValue(item){if(!item)return 0;return (GEAR_DISMANTLE_BASE[item.grade]||0)+Math.floor(Math.max(1,item.itemLevel||1)/20)+Math.max(0,item.enhanceLv||0)*2;}
function gearDeliverySuffix(got){if(!got)return '';const d=got.delivery||got.destination;if(d==='inbox')return ' · Sent to Reward Inbox';if(d==='salvaged')return ' · Auto-dismantled +🔩'+(got.shards||0);return '';}
function gearEnhCost(lv){ return 60+lv*55; }   // 🍬 ค่าตีบวก +1..+5 (60/115/170/225/280)
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
    { id:'w_spoon', chapter:1, tier:"start", emoji:'🥄', name:'Wooden Spoon', cost:0, enh:true, desc:'+5% damage (+2%/enh)', apply:(p,lv)=>{p.dmgMul*=1.05+0.02*lv;} },
    { id:'w_chop', chapter:1, tier:"common", emoji:'🥢', name:'Iron Chopsticks', cost:120, enh:true, desc:'+12% damage (+3%/enh)', apply:(p,lv)=>{p.dmgMul*=1.12+0.03*lv;} },
    { id:'w_whisk', chapter:1, tier:"common", emoji:'🌀', name:'Egg Whisk', cost:150, enh:true, desc:'-5% cooldown (+1%/enh)', apply:(p,lv)=>{p.cdMul*=1-0.05-0.01*lv;} },
    { id:'w_knife', chapter:1, tier:"rare", emoji:'🔪', name:'Chef Knife', cost:300, enh:true, desc:'+22% damage (+4%/enh)', apply:(p,lv)=>{p.dmgMul*=1.22+0.04*lv;} },
    { id:'w_cleaver', chapter:1, tier:"epic", set:'chef', emoji:'🪓', name:'Golden Cleaver', cost:640, enh:true, desc:'+30% damage · +5% crit', apply:(p,lv)=>{p.dmgMul*=1.30+0.05*lv;p.critChance+=0.05+0.01*lv;} },
    { id:'lg_starcleaver', chapter:1, tier:"legend", emoji:'🌟', name:'Starfall Blade', cost:0, enh:true, fx:'execute', desc:'+38% damage · execute damage', apply:(p,lv)=>{p.dmgMul*=1.38+0.05*lv;p.lowHpDmg+=0.15+0.03*lv;} },
    // Chapter 2 · Rotten Drain — tempo and utility
    { id:'w_valve_saber', chapter:2, tier:"common", emoji:'🗡️', name:'Valve Saber', cost:180, enh:true, desc:'+10% damage · -3% cooldown', apply:(p,lv)=>{p.dmgMul*=1.10+0.025*lv;p.cdMul*=1-0.03-0.008*lv;} },
    { id:'w_pressure_whisk', chapter:2, tier:"rare", emoji:'🫧', name:'Pressure Whisk', cost:420, enh:true, desc:'-9% cooldown · +5% crit', apply:(p,lv)=>{p.cdMul*=1-0.09-0.01*lv;p.critChance+=0.05+0.008*lv;} },
    { id:'w_pipe_hammer', chapter:2, tier:"epic", emoji:'🔨', name:'Pipe Hammer', cost:840, enh:true, desc:'+18% damage · +8% crit · +40 HP', apply:(p,lv)=>{p.dmgMul*=1.18+0.035*lv;p.critChance+=0.08+0.008*lv;p.maxhp+=40+10*lv;} },
    { id:'lg_tidefork', chapter:2, tier:"legend", emoji:'🔱', name:'Tidefork', cost:0, enh:true, desc:'+26% damage · -8% cooldown · +12% crit', apply:(p,lv)=>{p.dmgMul*=1.26+0.04*lv;p.cdMul*=1-0.08-0.008*lv;p.critChance+=0.12+0.008*lv;} },
    // Chapter 3 · Chili Engine — heavy offense
    { id:'w_chili_sickle', chapter:3, tier:"common", emoji:'🌶️', name:'Chili Sickle', cost:200, enh:true, desc:'+14% damage · +3% crit', apply:(p,lv)=>{p.dmgMul*=1.14+0.025*lv;p.critChance+=0.03+0.006*lv;} },
    { id:'w_griddle_maul', chapter:3, tier:"rare", emoji:'🍳', name:'Griddle Maul', cost:460, enh:true, desc:'+24% damage · +60 HP', apply:(p,lv)=>{p.dmgMul*=1.24+0.04*lv;p.maxhp+=60+12*lv;} },
    { id:'w_ember_skewer', chapter:3, tier:"epic", emoji:'🔥', name:'Ember Skewer', cost:880, enh:true, desc:'+28% damage · +10% crit', apply:(p,lv)=>{p.dmgMul*=1.28+0.045*lv;p.critChance+=0.10+0.009*lv;} },
    { id:'lg_sun_spatula', chapter:3, tier:"legend", emoji:'☀️', name:'Sunforge Spatula', cost:0, enh:true, fx:'execute', desc:'+34% damage · -6% cooldown · execute damage', apply:(p,lv)=>{p.dmgMul*=1.34+0.045*lv;p.cdMul*=1-0.06-0.008*lv;p.lowHpDmg+=0.10+0.02*lv;} },
    // Chapter 4 · Sugar Freezer — control and crit
    { id:'w_frost_spoon', chapter:4, tier:"common", emoji:'❄️', name:'Frost Spoon', cost:220, enh:true, desc:'-8% cooldown · +40 HP', apply:(p,lv)=>{p.cdMul*=1-0.08-0.008*lv;p.maxhp+=40+10*lv;} },
    { id:'w_crystal_knife', chapter:4, tier:"rare", emoji:'💎', name:'Crystal Knife', cost:500, enh:true, desc:'+20% damage · +8% crit', apply:(p,lv)=>{p.dmgMul*=1.20+0.035*lv;p.critChance+=0.08+0.009*lv;} },
    { id:'w_glacier_whisk', chapter:4, tier:"epic", emoji:'🧊', name:'Glacier Whisk', cost:920, enh:true, desc:'-12% cooldown · +14% crit', apply:(p,lv)=>{p.cdMul*=1-0.12-0.008*lv;p.critChance+=0.14+0.008*lv;} },
    { id:'lg_aurora_lance', chapter:4, tier:"legend", emoji:'🌌', name:'Aurora Sugar Lance', cost:0, enh:true, desc:'+30% damage · -10% cooldown · +12% crit', apply:(p,lv)=>{p.dmgMul*=1.30+0.04*lv;p.cdMul*=1-0.10-0.008*lv;p.critChance+=0.12+0.008*lv;} },
    // Chapter 5 · Crown Oven — endgame hybrids, still bounded by Item Level
    { id:'w_void_ladle', chapter:5, tier:"common", emoji:'🌑', name:'Void Ladle', cost:240, enh:true, desc:'+18% damage · +0.8 regen/s', apply:(p,lv)=>{p.dmgMul*=1.18+0.03*lv;p.regen+=0.8+0.12*lv;} },
    { id:'w_crown_cleaver', chapter:5, tier:"rare", emoji:'👑', name:'Crown Cleaver', cost:540, enh:true, desc:'+26% damage · +10% crit', apply:(p,lv)=>{p.dmgMul*=1.26+0.04*lv;p.critChance+=0.10+0.009*lv;} },
    { id:'w_hunger_blade', chapter:5, tier:"epic", emoji:'🕳️', name:'Hunger Blade', cost:960, enh:true, fx:'execute', desc:'+32% damage · execute damage', apply:(p,lv)=>{p.dmgMul*=1.32+0.045*lv;p.lowHpDmg+=0.12+0.02*lv;} },
    { id:'lg_flavorbound', chapter:5, tier:"legend", emoji:'✨', name:'Flavorbound', cost:0, enh:true, desc:'+36% damage · +10% crit · -8% cooldown', apply:(p,lv)=>{p.dmgMul*=1.36+0.045*lv;p.critChance+=0.10+0.008*lv;p.cdMul*=1-0.08-0.008*lv;} },
  ],
  gloves: [
    { id:'gl_none', tier:"start", emoji:'🧤', name:'None',       cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'gl_mitt', tier:"common", emoji:'🧤', name:'Oven Mitt',  cost:140, enh:true, desc:'+5% crit (+1%/enh)',        apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.05+0.01*lv; } },
    { id:'gl_silk', tier:"common", emoji:'🧵', name:'Silk Gloves', cost:150, enh:true, desc:'+8% damage (+2%/enh)',      apply:(p,lv)=>{ p.dmgMul*=(1+0.08+0.02*lv); } },
    { id:'gl_iron', tier:"rare", emoji:'🥊', name:'Iron Fists',      cost:320, enh:true, desc:'+9% crit · +4% damage (+1%·+1%/enh)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.09+0.01*lv; p.dmgMul*=(1+0.04+0.01*lv); } },
    { id:'gl_dragon', tier:"epic", set:'chef', emoji:'🐲', name:'Fire Dragon Gloves', cost:660, enh:true, desc:'+13% crit · stronger crit DMG (+1%/enh)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.13+0.01*lv; p.critMul=(p.critMul||1.8)+0.25+0.05*lv; } },
  ],
  armor: [
    { id:'ar_none', tier:"start",  emoji:'🥋', name:'None',      cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'ar_apron', tier:"common", emoji:'🥋', name:'Apron', cost:130, enh:true, desc:'+45 HP (+12/enh)',        apply:(p,lv)=>{ p.maxhp+=45+12*lv; } },
    { id:'ar_quilt', tier:"common", emoji:'🧶', name:'Thick Quilt Coat', cost:150, enh:true, desc:'-5% damage taken (+1%/enh)',     apply:(p,lv)=>{ p.dmgTakenMul*=Math.pow(0.95,1+lv*0.4); } },
    { id:'ar_plate', tier:"rare", emoji:'🛡️', name:'Pot-Lid Armor',  cost:340, enh:true, desc:'+90 HP · -6% damage taken (+18HP/enh)', apply:(p,lv)=>{ p.maxhp+=90+18*lv; p.dmgTakenMul*=Math.pow(0.94,1+lv*0.5); } },
    { id:'ar_royal', tier:"epic", set:'chef', emoji:'👑', name:'Kitchen King Armor', cost:680, enh:true, desc:'+140 HP · -10% damage taken (+24HP/enh)', apply:(p,lv)=>{ p.maxhp+=140+24*lv; p.dmgTakenMul*=Math.pow(0.90,1+lv*0.5); } },
  ],
  boots: [
    { id:'bo_none', tier:"start",  emoji:'👢', name:'None',      cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'bo_soft', tier:"common",  emoji:'👟', name:'Soft Shoes',  cost:110, enh:true, desc:'+5% move speed (+1%/enh)',   apply:(p,lv)=>{ p.baseSpeed*=1+0.05+0.01*lv; } },
    { id:'bo_magnet', tier:"common", emoji:'🧲', name:'Magnet Shoes', cost:130, enh:true, desc:'+25% pickup range (+4%/enh)', apply:(p,lv)=>{ p.pickup*=1+0.25+0.04*lv; } },
    { id:'bo_swift', tier:"rare", emoji:'👢', name:'Swift Boots',    cost:300, enh:true, desc:'+9% move speed · +15% pickup (+1.5%/enh)', apply:(p,lv)=>{ p.baseSpeed*=1+0.09+0.015*lv; p.pickup*=1+0.15+0.03*lv; } },
    { id:'bo_wind', tier:"epic", set:'wind', emoji:'🌪️', name:'Gale Boots',       cost:620, enh:true, desc:'+13% move speed · -5% cooldown (+1.5%/enh)', apply:(p,lv)=>{ p.baseSpeed*=1+0.13+0.015*lv; p.cdMul*=(1-0.05-0.01*lv); } },
    { id:'lg_comet', tier:"legend", emoji:'☄️', name:'Comet Boots', cost:0, enh:true, fx:'lifekill', desc:'+16% move speed · +30% pickup · +2 HP on kill (+1.5%·+1HP/enh) ☄️', apply:(p,lv)=>{ p.baseSpeed*=1+0.16+0.015*lv; p.pickup*=1+0.30+0.04*lv; p.lifeOnKill=(p.lifeOnKill||0)+2+lv; } },
  ],
  amulet: [
    { id:'am_none', tier:"start",   emoji:'📿', name:'None',     cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'am_ribbon', tier:"common", emoji:'🎀', name:'Lucky Ribbon',  cost:100, enh:true, desc:'+30 HP (+10/enh)',          apply:(p,lv)=>{ p.maxhp+=30+10*lv; } },
    { id:'am_clover', tier:"common", emoji:'🍀', name:'Clover Leaf',  cost:120, enh:true, desc:'+4% crit · +0.5 regen/s (+1%/enh)', apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.04+0.01*lv; p.regen=(p.regen||0)+0.5+0.15*lv; } },
    { id:'am_star', tier:"rare",   emoji:'⭐', name:'Sparkle Star',  cost:260, enh:true, desc:'+8% damage · +15 HP (+2%·+8/enh)', apply:(p,lv)=>{ p.dmgMul*=(1+0.08+0.02*lv); p.maxhp+=15+8*lv; } },
    { id:'am_moon', tier:"epic", set:'wind',  emoji:'🌙', name:'Sweet Moon',  cost:640, enh:true, desc:'+12% damage · +40 HP · +1 regen/s (+2%/enh)', apply:(p,lv)=>{ p.dmgMul*=(1+0.12+0.02*lv); p.maxhp+=40+10*lv; p.regen=(p.regen||0)+1+0.2*lv; } },
    { id:'lg_phoenix', tier:"legend", emoji:'🔥', name:'Phoenix Amulet', cost:0, enh:true, fx:'revive', desc:'+120 HP · +1.5 regen/s · revive once per stage (+20HP/enh) 🔥', apply:(p,lv)=>{ p.maxhp+=120+20*lv; p.regen=(p.regen||0)+1.5+0.3*lv; p._gearRevive=(p._gearRevive||0)+1; } },
  ],
  ring: [
    { id:'ri_none', tier:"start",   emoji:'💍', name:'None',     cost:0,   enh:false, desc:'-', apply:(p,lv)=>{} },
    { id:'ri_copper', tier:"common", emoji:'💍', name:'Copper Ring', cost:120, enh:true, desc:'+5% damage (+2%/enh)',       apply:(p,lv)=>{ p.dmgMul*=(1+0.05+0.02*lv); } },
    { id:'ri_silver', tier:"common", emoji:'💎', name:'Silver Crit Ring', cost:140, enh:true, desc:'+6% crit (+1%/enh)',        apply:(p,lv)=>{ p.critChance=(p.critChance||0)+0.06+0.01*lv; } },
    { id:'ri_gold', tier:"rare",   emoji:'💛', name:'Gold Ring',  cost:320, enh:true, desc:'+12% damage · +0.8 regen/s (+3%/enh)', apply:(p,lv)=>{ p.dmgMul*=(1+0.12+0.03*lv); p.regen=(p.regen||0)+0.8+0.2*lv; } },
    { id:'ri_diamond', tier:"epic", set:'wind', emoji:'💠', name:'Diamond Ring',    cost:700, enh:true, desc:'+18% damage · +8% crit (+3%·+1%/enh)', apply:(p,lv)=>{ p.dmgMul*=(1+0.18+0.03*lv); p.critChance=(p.critChance||0)+0.08+0.01*lv; } },
  ],
};
/* ---- GEAR SETS: สวมของชุดเดียวกันครบจำนวน = โบนัสพิเศษ (นับ id ที่สวมใน applyMeta) ---- */
const GEAR_SETS = {
  chef:{ name:'Royal Chef Set', emoji:'👑', bonuses:{
    2:{ desc:'2 pcs: +10% damage', apply:p=>{ p.dmgMul*=1.10; } },
    3:{ desc:'3 pcs: +10% crit · stronger crit DMG', apply:p=>{ p.critChance=(p.critChance||0)+0.10; p.critMul=(p.critMul||1.8)+0.3; } } } },
  wind:{ name:'Gale Master Set', emoji:'🌪️', bonuses:{
    2:{ desc:'2 pcs: -8% cooldown', apply:p=>{ p.cdMul=Math.max(0.6,(p.cdMul||1)*0.92); } },
    3:{ desc:'3 pcs: +10% move speed · +8% damage', apply:p=>{ p.baseSpeed*=1.10; p.dmgMul*=1.08; } } } },
};
function gearSetCounts(){ const c={}; for(const slot in GEAR){ const id=Save.data.gear[slot]; const it=GEAR[slot].find(g=>g.id===id); if(it&&it.set)c[it.set]=(c[it.set]||0)+1; } return c; }

/* ---- AFFIX (Phase 1 PoE): prefix/suffix + tier T1-T5 · ของแต่ละชิ้นสุ่มตอนได้มา · reroll ด้วย 🔩 ----
   tiers[]=[T1,T2,T3,T4,T5] แต่ละอันเป็น [lo,hi] · T1=แรงสุด (หายาก) · pre/suf=คำประกอบชื่อไอเทม */
const AFFIX_POOL = [
  // ── Prefix (สายรุก) ──
  { id:'dmg', slots:['weapon','gloves','amulet','ring'],   kind:'prefix', emoji:'💥', label:'Damage',   pre:'Keen',  fmt:v=>'+'+v+'%',  tiers:[[13,16],[10,12],[7,9],[5,6],[3,4]], apply:(p,v)=>{ p.dmgMul*=(1+v/100); } },
  { id:'crit', slots:['weapon','gloves','amulet','ring'],  kind:'prefix', emoji:'🎯', label:'Crit',     pre:'Sharp',   fmt:v=>'+'+v+'%',  tiers:[[6,7],[5,5],[4,4],[3,3],[2,2]],     apply:(p,v)=>{ p.critChance=(p.critChance||0)+v/100; } },
  { id:'critdmg', slots:['weapon','gloves','ring'],kind:'prefix',emoji:'💢', label:'Crit DMG', pre:'Fierce',  fmt:v=>'+'+v+'%',  tiers:[[45,60],[35,44],[25,34],[15,24],[8,14]], apply:(p,v)=>{ p.critMul=(p.critMul||1.8)+v/100; } },
  { id:'cd', slots:['weapon','gloves','amulet','ring'],    kind:'prefix', emoji:'⏩', label:'Cooldown', pre:'Swift',  fmt:v=>'-'+v+'%',  tiers:[[6,8],[5,5],[4,4],[3,3],[2,2]],     apply:(p,v)=>{ p.cdMul=Math.max(0.5,(p.cdMul||1)*(1-v/100)); } },
  // ── Suffix (สายรับ/utility) ──
  { id:'hp', slots:['armor','amulet'],    kind:'suffix', emoji:'❤️', label:'HP',       suf:'of the Lion', fmt:v=>'+'+v,      tiers:[[85,120],[60,84],[40,59],[25,39],[15,24]], apply:(p,v)=>{ p.maxhp+=v; } },
  { id:'def', slots:['armor','gloves','amulet'],   kind:'suffix', emoji:'🛡️', label:'Defense',  suf:'of Stone',    fmt:v=>'-'+v+'%',  tiers:[[6,8],[5,5],[4,4],[3,3],[2,2]],     apply:(p,v)=>{ p.dmgTakenMul*=(1-v/100); } },
  { id:'spd', slots:['boots'],   kind:'suffix', emoji:'👟', label:'Speed',    suf:'of the Wind',   fmt:v=>'+'+v+'%',  tiers:[[6,8],[5,5],[4,4],[3,3],[2,2]],     apply:(p,v)=>{ p.baseSpeed*=(1+v/100); } },
  { id:'pick', slots:['boots','amulet','ring'],  kind:'suffix', emoji:'🧲', label:'Pickup',   suf:'of Magnetism',fmt:v=>'+'+v+'%',  tiers:[[35,50],[25,34],[18,24],[12,17],[8,11]], apply:(p,v)=>{ p.pickup*=(1+v/100); } },
  { id:'regen', slots:['armor','amulet','ring'], kind:'suffix', emoji:'💗', label:'Regen/s',  suf:'of the Spring',fmt:v=>'+'+(v/10), tiers:[[10,14],[7,9],[5,6],[3,4],[2,2]],   apply:(p,v)=>{ p.regen=(p.regen||0)+v/10; } },
];
const AFFIX_COUNT = { start:0, common:1, rare:2, epic:2, legend:3 };
// item level → tier ดีสุดที่สุ่มได้ (ฐานดี = โรลได้ดีกว่า): legend→T1, epic→T2, rare→T3, common→T4
const BASE_BEST_TIER = { start:5, common:4, rare:3, epic:2, legend:1 };
const SPECIAL_AFFIX_POOL = []; // Future schema: {id,kind,label,tiers,apply,baseIds?,baseTags?,slots?,minItemLevel?,exclusive:true}
function allAffixDefs(){return AFFIX_POOL.concat(SPECIAL_AFFIX_POOL);}
function affixDef(id){return allAffixDefs().find(a=>a.id===id);}
function craftAffixPoolForItem(item){if(!item)return[];const base=GEAR_ALL.find(g=>g.id===item.baseId),tags=new Set((base&&base.craftTags)||[]);
  const normal=AFFIX_POOL.filter(a=>!a.slots||a.slots.includes(item.slot));
  const special=SPECIAL_AFFIX_POOL.filter(a=>a.enabled!==false&&(!a.slots||a.slots.includes(item.slot))&&(!a.minItemLevel||(item.itemLevel||1)>=a.minItemLevel)&&
    (!a.baseIds||a.baseIds.includes(item.baseId))&&(!a.baseTags||a.baseTags.some(t=>tags.has(t))));
  return normal.concat(special);
}
function affixBestTierForItem(item,mod){const base=GEAR_ALL.find(g=>g.id===item.baseId),baseBest=BASE_BEST_TIER[(base&&base.tier)||item.grade]||4,levelBest=bestAffixTierForItemLevel(item.itemLevel||1),modBest=mod&&mod.bestTier?mod.bestTier:1;return Math.max(baseBest,levelBest,modBest);}
function affixBestRangeText(item,mod){if(!mod||!mod.tiers)return'—';const t=affixBestTierForItem(item,mod),b=mod.tiers[t-1]||mod.tiers[mod.tiers.length-1],lo=mod.fmt?mod.fmt(b[0]):b[0],hi=mod.fmt?mod.fmt(b[1]):b[1];return lo===hi?lo:(lo+' – '+hi);}
function craftCurrencyForLine(rarity,hasLine){if(!hasLine&&rarity==='common')return'transmute';if(!hasLine)return'exalt';return rarity==='rare'?'chaos':'alt';}
// สุ่ม tier ระหว่าง best..5 · ถ่วงให้ tier แย่เจอบ่อย (T1 หายาก = loot chase)
// iLv มีผลกับ Tier ที่ออก: แบ่งช่วงละ 10 เลเวล (step 0..9) → ยิ่ง iLv สูง bias ยิ่งลด = tier แย่ (t สูง) ถูกถ่วงน้อยลง = tier ดีออกบ่อยขึ้น
function rollTier(best,ilvl){ const step=Math.max(0,Math.min(9,Math.floor(((Number(ilvl)||1)-1)/10))); const bias=1-Math.min(0.62,step*0.075); const list=[]; let tot=0; for(let t=best;t<=5;t++){ const w=t*t*Math.pow(bias,t-best); list.push([t,w]); tot+=w; } let r=Math.random()*tot; for(const [t,w] of list){ r-=w; if(r<=0)return t; } return best; }
function rollOneAffix(mod,best,ilvl){ const t=rollTier(best,ilvl), band=mod.tiers[t-1]||mod.tiers[mod.tiers.length-1]; const v=band[0]+Math.floor(Math.random()*(band[1]-band[0]+1)); return {id:mod.id,t,v}; }
function rollAffixes(baseTier,itemLevel=1,base=null){const n=AFFIX_COUNT[baseTier]||0;if(!n)return[];const stub=base?{baseId:base.id,slot:base.slot,grade:base.tier,itemLevel}:null,pool=stub?craftAffixPoolForItem(stub):AFFIX_POOL,best=Math.max(BASE_BEST_TIER[baseTier]||4,bestAffixTierForItemLevel(itemLevel));
  const pre=pool.filter(a=>a.kind==='prefix'),suf=pool.filter(a=>a.kind==='suffix');let nPre,nSuf;if(n===1){if(Math.random()<.5){nPre=1;nSuf=0;}else{nPre=0;nSuf=1;}}else if(n===2){nPre=1;nSuf=1;}else{if(Math.random()<.5){nPre=2;nSuf=1;}else{nPre=1;nSuf=2;}}
  const out=[],pick=(arr,k)=>{const p=arr.filter(m=>!out.some(a=>a.id===m.id));for(let i=0;i<k&&p.length;i++){const m=p.splice(Math.floor(Math.random()*p.length),1)[0];out.push(rollOneAffix(m,Math.max(best,m.bestTier||1),itemLevel));}};pick(pre,nPre);pick(suf,nSuf);if(out.length<n)pick(pool,n-out.length);return out;}
// ชื่อไอเทมแบบ PoE: [prefix ดีสุด] ฐาน [suffix ดีสุด]
function gearAffixName(baseName,affs){ if(!affs||!affs.length)return baseName;
  const best=(kind)=>{ let b=null; for(const a of affs){ const d=affixDef(a.id); if(d&&d.kind===kind&&(!b||a.t<b.t))b=a; } return b?affixDef(b.id):null; };
  const pre=best('prefix'), suf=best('suffix');
  return (pre&&pre.pre?pre.pre+' ':'')+baseName+(suf&&suf.suf?' '+suf.suf:''); }

/* ---- CURRENCY (Phase 2): คราฟต์ affix ของไอเทม แบบ Path of Exile ---- */
const CRAFT_AFFIX_CAP = {common:1,magic:2,rare:4};
const RARITY_LABEL = { common:{name:'Common',color:'#c7bdd6'}, magic:{name:'Magic',color:'#7fb0ff'}, rare:{name:'Rare',color:'#ffd166'} };
function baseDefaultRarity(baseTier){ if(baseTier==='start')return 'common'; if(baseTier==='common')return 'magic'; return 'rare'; }
const CURRENCY = [
  {key:'transmute',emoji:'🔵',asset:'currency_spark_sugar',name:'Spark Sugar',desc:'Imprint a chosen stat on a Common item'},
  {key:'alt',emoji:'🟢',asset:'currency_twist_cream',name:'Twist Cream',desc:'Replace the selected Magic affix'},
  {key:'regal',emoji:'🟡',asset:'currency_crown_icing',name:'Crown Icing',desc:'Promote full Magic gear to Rare and unlock 4 lines'},
  {key:'chaos',emoji:'🟠',asset:'currency_wild_jam',name:'Wild Jam',desc:'Replace the selected Rare affix'},
  {key:'exalt',emoji:'🔴',asset:'currency_wish_candy',name:'Wish Candy',desc:'Add a chosen stat to an empty line'},
  {key:'divine',emoji:'⚪',asset:'currency_crystal_glaze',name:'Crystal Glaze',desc:'Reroll the selected value without changing its tier'},
  {key:'annul',emoji:'🟣',asset:'currency_fading_gumdrop',name:'Fading Gumdrop',desc:'Remove the selected affix line'},
  {key:'scour',emoji:'⚫',asset:'currency_plain_dough',name:'Plain Dough',desc:'Reset all affixes and return the item to Common'},
];
function currencyDef(k){ return CURRENCY.find(c=>c.key===k); }
// ราคา currency เป็น Sugar (ซื้อ = Fullราคา · ขาย = 60%)
const CURRENCY_BUY = { transmute:40, alt:60, regal:120, chaos:160, exalt:320, divine:320, scour:30, annul:90 };
// Weighted reward pools. Values are percentages within a successful currency drop.
const CURRENCY_DROP_POOLS = {
  common:{ transmute:45, scour:30, alt:25 },
  rare:{ alt:35, transmute:30, regal:15, scour:15, annul:5 },
  epic:{ alt:25, regal:25, chaos:25, annul:10, exalt:8, divine:7 },
  legend:{ chaos:25, exalt:25, divine:25, regal:15, annul:10 },
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
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function bazaarDaySeed(){ const d=new Date(); return d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate(); }

/* ---- ระบบได้รับอุปกรณ์: ดWaitปในStage (common) + เปิดกล่องสุ่ม/gacha (find rare) · ยกเลิกการซื้อ ---- */
const GEAR_ALL=[];for(const _s in GEAR)for(const _it of GEAR[_s])GEAR_ALL.push(Object.assign({slot:_s,craftTags:[_s,'chapter_'+(_it.chapter||1),_it.tier]},_it));
const ITEM_LEVEL_BANDS=[
  {chapter:1,min:1,max:20,bestAffixTier:4,label:'Pantry'},
  {chapter:2,min:21,max:40,bestAffixTier:4,label:'Rotten Drain'},
  {chapter:3,min:41,max:60,bestAffixTier:3,label:'Chili Engine'},
  {chapter:4,min:61,max:80,bestAffixTier:2,label:'Sugar Freezer'},
  {chapter:5,min:81,max:100,bestAffixTier:1,label:'Crown Oven'},
];
function clampItemChapter(ch){return Math.max(1,Math.min(5,Math.floor(Number(ch)||1)));}
function itemChapterForStage(stageIndex){return clampItemChapter((Number(stageIndex)||0)+1);}
function currentItemChapter(){return itemChapterForStage((Save.data&&Save.data.unlockedStage)||0);}
function itemBand(ch){return ITEM_LEVEL_BANDS[clampItemChapter(ch)-1];}
function itemChapterFromLevel(ilvl){return Math.max(1,Math.min(5,Math.ceil(Math.max(1,Number(ilvl)||1)/20)));}
function bestAffixTierForItemLevel(ilvl){return itemBand(itemChapterFromLevel(ilvl)).bestAffixTier;}
function rollItemLevel(stageIndex,difficulty=1,rng=Math.random){const b=itemBand(itemChapterForStage(stageIndex)),d=Math.max(1,Math.min(3,Number(difficulty)||1));return Math.min(b.max,b.min+(d-1)*6+Math.floor(rng()*8));}
function currentRewardItemLevel(rng=Math.random){return rollItemLevel(Math.max(0,Math.min(4,(Save.data&&Save.data.unlockedStage)||0)),2,rng);}
function applyItemLevelBonus(p,item){const q=Math.max(0,Math.min(1,((Number(item&&item.itemLevel)||1)-1)/99)),slot=item&&item.slot;
  if(slot==='weapon'||slot==='ring')p.dmgMul*=1+0.24*q;
  else if(slot==='gloves')p.critChance=(p.critChance||0)+0.06*q;
  else if(slot==='armor'){p.maxhp+=Math.round(80*q);p.dmgTakenMul*=1-0.06*q;}
  else if(slot==='boots')p.baseSpeed*=1+0.10*q;
  else if(slot==='amulet'){p.maxhp+=Math.round(50*q);p.regen=(p.regen||0)+0.6*q;}
}
function gearPool(tier,chapter=currentItemChapter()){const ch=clampItemChapter(chapter),currentWeapons=GEAR_ALL.filter(it=>it.tier===tier&&it.slot==='weapon'&&(it.chapter||1)===ch),support=GEAR_ALL.filter(it=>it.tier===tier&&it.slot!=='weapon'&&(it.chapter||1)<=ch);return currentWeapons.concat(support).length?currentWeapons.concat(support):GEAR_ALL.filter(it=>it.tier===tier&&(it.chapter||1)<=ch);}
const GACHA_COST = 220;   // 🍬 ต่อการเปิดกล่อง 1 times
const LEGEND_FORGE_COST = 45;   // 🔩 หลอมของตำนาน 1 ชิ้น (สุ่มที่ยังNone)
const AFFIX_REROLL_COST = 15;   // 🔩 สุ่มคุณสมบัติเสริมของชิ้นที่สวมอยู่ใหม่
const DEFAULT_SETTINGS={sound:true,shake:1,flash:true,damageNumbers:true,vfx:1};
// ---- Monetization: rewarded ads + IAP (จุดต่อ Capacitor AdMob/Billing · ตอนนี้ยังNone plugin = ใช้เดโมจำลอง) ----
// ⚙️ ขึ้นสโตร์จริง: npm i @capacitor-community/admob → ใส่ ad unit id ที่ ADMOB_REWARD_ID แล้วต่อใน Game.showRewardedAd
const ADMOB_REWARD_ID = '';   // ← ใส่ Rewarded Ad Unit ID ตอน integrate จริง
const AdManager = {
  plugin(){ try{ const C=window.Capacitor; return (C&&C.Plugins&&C.Plugins.AdMob)||window.AdMob||null; }catch(e){ return null; } },
  hasRealAds(){ const p=this.plugin(); return !!(ADMOB_REWARD_ID && p && p.showRewardVideoAd); },
};
const Store = {
  products:[ {id:'noads',emoji:'🚫',name:'Remove interstitial ads',desc:'Permanently disable interstitial ads (rewarded ads still optional)'} ],
  owns(id){ return id==='noads' ? !!Save.data.noAds : false; },
  // TODO: ต่อ in-app billing จริง (Google Play) — ตอนนี้ยังไม่เปิดขาย
  canBuy(){ try{ const C=window.Capacitor; return !!(C&&C.Plugins&&(C.Plugins.Purchases||C.Plugins.InAppPurchase||C.Plugins.CapacitorPurchases)); }catch(e){ return false; } },
};
function localDayKey(offset=0){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dailySpec(){const key=localDayKey(),seed=Number(key.replace(/-/g,''));return{key,stage:seed%STAGES.length,diff:2+(seed%2)};}   // diff 2-3 (นรกสูงสุด)
const POWER_TUNING={recommended:[100,280,560,940,1450],mastery:[60,90,130,180,240]};
const TIER_LABEL = { start:{name:'Starter',color:'#9a90ab'}, common:{name:'Common',color:'#8bd3a0'}, rare:{name:'Rare',color:'#ffcf5a'}, epic:{name:'Epic',color:'#c9a3ff'}, legend:{name:'Legend',color:'#ff8f3a'} };
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
  {key:'dmg',label:'DMG',pct:true},{key:'hp',label:'HP'},{key:'crit',label:'Crit',pct:true},
  {key:'critDmg',label:'Crit DMG',pct:true},{key:'cdr',label:'Cooldown',pct:true},{key:'def',label:'Defense',pct:true},
  {key:'speed',label:'Move Speed',pct:true},{key:'pickup',label:'Pickup',pct:true},{key:'regen',label:'Regen/s'},
  {key:'lifeKill',label:'HP / Kill'},{key:'execute',label:'Execute DMG',pct:true},{key:'revive',label:'Revive'}
];
function gearInstanceStats(item){
  const p={dmgMul:1,maxhp:0,critChance:0,critMul:1.55,cdMul:1,dmgTakenMul:1,baseSpeed:1,pickup:1,regen:0,lifeOnKill:0,lowHpDmg:0,_gearRevive:0};
  if(!item)return {dmg:0,hp:0,crit:0,critDmg:0,cdr:0,def:0,speed:0,pickup:0,regen:0,lifeKill:0,execute:0,revive:0};
  const base=GEAR_ALL.find(g=>g.id===item.baseId); if(base&&base.apply)base.apply(p,item.enhanceLv||0);
  applyItemLevelBonus(p,item);
  for(const a of (item.affixes||[])){const d=affixDef(a.id);if(d&&d.apply)d.apply(p,a.v);}
  return {dmg:(p.dmgMul-1)*100,hp:p.maxhp||0,crit:(p.critChance||0)*100,critDmg:((p.critMul||1.55)-1.55)*100,
    cdr:(1-(p.cdMul||1))*100,def:(1-(p.dmgTakenMul||1))*100,speed:((p.baseSpeed||1)-1)*100,
    pickup:((p.pickup||1)-1)*100,regen:p.regen||0,lifeKill:p.lifeOnKill||0,execute:(p.lowHpDmg||0)*100,revive:p._gearRevive||0};
}
function gearCompareRows(equipped,selected){
  const a=gearInstanceStats(equipped),b=gearInstanceStats(selected);
  return GEAR_COMPARE_STATS.map(d=>Object.assign({},d,{from:a[d.key]||0,to:b[d.key]||0,delta:(b[d.key]||0)-(a[d.key]||0)}))
    .filter(r=>Math.abs(r.from)>0.001||Math.abs(r.to)>0.001).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
}
function gearStatText(row,value){const n=Math.abs(value-Math.round(value))<0.05?Math.round(value):Math.round(value*10)/10;return (n>0?'+':'')+n+(row.pct?'%':'');}
function gearSetCompareText(slot,selected){ if(!selected)return ''; const current=gearSetCounts(),next=Object.assign({},current),old=Save.equippedGearItem(slot),oldBase=old&&GEAR_ALL.find(g=>g.id===old.baseId),newBase=GEAR_ALL.find(g=>g.id===selected.baseId);
  if(oldBase&&oldBase.set)next[oldBase.set]=Math.max(0,(next[oldBase.set]||0)-1); if(newBase&&newBase.set)next[newBase.set]=(next[newBase.set]||0)+1;
  const ids=Array.from(new Set([oldBase&&oldBase.set,newBase&&newBase.set].filter(Boolean))),parts=[];
  for(const id of ids){const def=GEAR_SETS[id];if(def&&(current[id]||0)!==(next[id]||0))parts.push(def.emoji+' '+def.name+' '+(current[id]||0)+'/3 → '+(next[id]||0)+'/3');} return parts.join('   '); }

/* ---- Save: เก็บ Sugar + ความคืบหน้า + upgrades + gear ลง localStorage ---- */
const Save = {
  data:{ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], gearItems:[], equippedGear:{}, gearInventoryCap:24, gearInbox:[], gearAutoDismantle:'off', gearSchemaVersion:0, gearUidSeq:0, character:'momo', chars:[], charProg:{}, rank:0, ascension:0, endlessBest:0, endlessBoard:[], noAds:false, settings:Object.assign({},DEFAULT_SETTINGS) },
  load(){ let gearMigrated=false; try{ const s=localStorage.getItem('mochi_save'); if(s)this.data=Object.assign(this.data,JSON.parse(s)); }catch(e){}
    if(!this.data.upgrades)this.data.upgrades={};
    if(!this.data.gear)this.data.gear={};
    if(!this.data.gearLv)this.data.gearLv={};
    if(!this.data.ownedGear)this.data.ownedGear=[];
    const gearDefaults={ weapon:'w_spoon', gloves:'gl_none', armor:'ar_none', boots:'bo_none', amulet:'am_none', ring:'ri_none' };
    for(const slot in gearDefaults){ if(!this.data.gear[slot])this.data.gear[slot]=gearDefaults[slot];
      if(!this.data.ownedGear.includes(gearDefaults[slot]))this.data.ownedGear.push(gearDefaults[slot]); }
    gearMigrated=this.migrateGearInstances(gearDefaults);
    if(!this.data.chars||!this.data.chars.length)this.data.chars=['momo'];
    if(!this.data.character)this.data.character='momo';
    if(!CHAR_ORDER.includes(this.data.character))this.data.character='momo';   // ตัวที่ถูกพัก (Berry) → คืนเป็นโมโม่
    if(!this.data.charProg)this.data.charProg={};
    if(!this.data.bestiary)this.data.bestiary={};
    // v4.12: bosses/minibosses แยกรายด่าน (boss0..5 / mini0..5) — เซฟเดิมนับรวมเป็น 'boss'/'mini' → ยกไป entry ด่าน 1
    if(this.data.bestiary.boss!=null){ this.data.bestiary.boss0=(this.data.bestiary.boss0||0)+this.data.bestiary.boss; delete this.data.bestiary.boss; }
    if(this.data.bestiary.mini!=null){ this.data.bestiary.mini0=(this.data.bestiary.mini0||0)+this.data.bestiary.mini; delete this.data.bestiary.mini; }
    if(!this.data.rankPerks)this.data.rankPerks={};
    if(!this.data.stageMastery)this.data.stageMastery={};
    // เซฟเดิมที่จบ Chapter 1 แล้วต้องเห็น Chapter 2 ทันทีหลังUpdates
    if(this.data.stageMastery[4])this.data.unlockedStage=Math.max(5,this.data.unlockedStage||0);
    if(!this.data.achievements)this.data.achievements={};
    if(!this.data.cookbook)this.data.cookbook={};   // สูตรที่เคยปรุงสำเร็จ (ถาวรข้ามรัน) → สมุดสูตร + รางวัล Sugar timesแรก
    if(this.data.shards==null)this.data.shards=0;   // 🔩 เศษอุปกรณ์ (จากของซ้ำ) → หลอมของตำนาน
    if(!this.data.gearAffix)this.data.gearAffix={};   // affix ต่อชิ้น (E: loot chase)
    if(!this.data.gearRarity)this.data.gearRarity={};   // rarity ที่คราฟต์ (common/magic/rare) ต่อชิ้น
    if(!this.data.currency)this.data.currency={};   // 🧪 currency คราฟต์ (Phase 2)
    if(this.data.ascension==null)this.data.ascension=0;
    if(this.data.endlessBest==null)this.data.endlessBest=0;
    if(!Array.isArray(this.data.endlessBoard))this.data.endlessBoard=[];
    if(!this.data.daily)this.data.daily={claimDay:'',streak:0,challengeDay:'',challengeDone:false};
    if(this.data.tutorialDone==null)this.data.tutorialDone=false;
    this.data.settings=Object.assign({},DEFAULT_SETTINGS,this.data.settings||{});
    Sfx.muted=!this.data.settings.sound;
    if(gearMigrated){ this.data.rev=(this.data.rev||0)+1; try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} }
    return this.data; },
  save(){ this.data.rev=(this.data.rev||0)+1; try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} if(typeof Cloud!=='undefined')Cloud.queuePush(this.data); },
  // ---- Cloud sync (Supabase) ----
  async syncCloud(){ if(typeof Cloud==='undefined')return; const ok=await Cloud.init(); if(!ok)return;
    const remote=await Cloud.pull();
    if(remote&&typeof remote==='object'){
      if((remote.rev||0)>(this.data.rev||0)){ this.data=Object.assign(this.data,remote); try{localStorage.setItem('mochi_save',JSON.stringify(this.data));}catch(e){} this.load(); this._cloudAdopted=true; }
      else if((this.data.rev||0)>(remote.rev||0)){ Cloud.push(this.data); }
    } else { Cloud.push(this.data); }   // ยังNoneบนเมฆ = อัปเซฟปัจจุบันขึ้นไป
    this._cloudReady=true;
  },
  addSugar(n){ this.data.sugar=(this.data.sugar||0)+n; this.save(); },
  // สมุดสูตร: บันทึกสูตรที่ปรุงสำเร็จถาวร · คืนรางวัล Sugar เฉพาะครั้งแรกที่ค้นพบ (0 = เคยมีแล้ว)
  cookbookHas(key){ return !!(this.data.cookbook&&this.data.cookbook[key]); },
  cookbookCount(){ return this.data.cookbook?Object.keys(this.data.cookbook).length:0; },
  discoverDish(key,sig){ if(!this.data.cookbook)this.data.cookbook={}; if(this.data.cookbook[key])return 0;
    this.data.cookbook[key]=1; const rew=sig?30:12; this.data.sugar=(this.data.sugar||0)+rew; this.save(); return rew; },
  spend(n){ if((this.data.sugar||0)>=n){ this.data.sugar-=n; this.save(); return true; } return false; },
  // ความคืบหน้าตัวละคร (เลเวล/EXP/แต้มพรสวรรค์/ผังที่ลง)
  cp(id){ if(!this.data.charProg[id]) this.data.charProg[id]={ lvl:1, exp:0, tp:0, tal:{} }; return this.data.charProg[id]; },
  // ---- Equipment v2: unique instances. Legacy maps stay mirrored until every screen uses uid directly. ----
  nextGearUid(){ this.data.gearUidSeq=(this.data.gearUidSeq||0)+1; return 'gi_'+Date.now().toString(36)+'_'+this.data.gearUidSeq.toString(36); },
  gearItem(ref){ if(!ref||!Array.isArray(this.data.gearItems))return null; if(typeof ref==='object'&&ref.uid)return ref;
    let item=this.data.gearItems.find(x=>x&&x.uid===ref); if(item)return item;
    const equipped=this.data.equippedGear||{}; for(const slot in equipped){ item=this.data.gearItems.find(x=>x&&x.uid===equipped[slot]&&x.baseId===ref); if(item)return item; }
    return this.data.gearItems.find(x=>x&&x.baseId===ref)||null; },
  gearBase(ref){ const item=this.gearItem(ref); return item?GEAR_ALL.find(g=>g.id===item.baseId):GEAR_ALL.find(g=>g.id===ref); },
  makeGearInstance(baseId,opts={}){ const base=GEAR_ALL.find(g=>g.id===baseId); if(!base)return null;
    const clone=a=>Array.isArray(a)?a.map(x=>Object.assign({},x)):[];
    return { uid:opts.uid||this.nextGearUid(), baseId, slot:base.slot, grade:base.tier,
      craftState:opts.craftState||baseDefaultRarity(base.tier), enhanceLv:Math.max(0,Number(opts.enhanceLv)||0),
      itemLevel:Math.max(1,Math.min(100,Math.floor(Number(opts.itemLevel)||currentRewardItemLevel()))), chapter:clampItemChapter(opts.chapter||base.chapter||currentItemChapter()),
      affixes:clone(opts.affixes!=null?opts.affixes:rollAffixes(base.tier,opts.itemLevel||currentRewardItemLevel(),base)), locked:!!opts.locked, favorite:!!opts.favorite,
      isNew:opts.isNew!==false, acquiredAt:Number(opts.acquiredAt)||Date.now() }; },
  migrateGearInstances(gearDefaults){ let changed=false;
    if(!Array.isArray(this.data.gearItems)||Number(this.data.gearSchemaVersion||0)<1){
      this.data.gearItems=[]; this.data.equippedGear={}; this.data.gearUidSeq=0;
      const ids=Array.from(new Set((this.data.ownedGear||[]).concat(Object.values(gearDefaults))));
      for(const baseId of ids){ const base=GEAR_ALL.find(g=>g.id===baseId); if(!base)continue;
        const item=this.makeGearInstance(baseId,{enhanceLv:(this.data.gearLv||{})[baseId]||0,
          affixes:(this.data.gearAffix||{})[baseId]||rollAffixes(base.tier,1,base),
          craftState:(this.data.gearRarity||{})[baseId]||baseDefaultRarity(base.tier),isNew:false,acquiredAt:1});
        if(item)this.data.gearItems.push(item); }
      for(const slot in gearDefaults){ const baseId=this.data.gear[slot]||gearDefaults[slot]; let item=this.data.gearItems.find(x=>x.baseId===baseId&&x.slot===slot);
        if(!item){ item=this.makeGearInstance(baseId,{isNew:false,acquiredAt:1,itemLevel:baseId.endsWith('_none')||baseId==='w_spoon'?1:undefined}); if(item)this.data.gearItems.push(item); }
        if(item)this.data.equippedGear[slot]=item.uid; }
      this.data.gearSchemaVersion=1; changed=true;
    }
    if(!this.data.equippedGear||typeof this.data.equippedGear!=='object'){this.data.equippedGear={};changed=true;}
    if(!Number.isFinite(this.data.gearInventoryCap)||this.data.gearInventoryCap<1){this.data.gearInventoryCap=24;changed=true;}
    if(!Array.isArray(this.data.gearInbox)){this.data.gearInbox=[];changed=true;}
    if(!['off','common','rare'].includes(this.data.gearAutoDismantle)){this.data.gearAutoDismantle='off';changed=true;}
    const repairItem=item=>{if(!item)return;if(typeof item.favorite!=='boolean'){item.favorite=false;changed=true;}if(typeof item.locked!=='boolean'){item.locked=false;changed=true;}if(typeof item.isNew!=='boolean'){item.isNew=false;changed=true;}if(!Number.isFinite(item.acquiredAt)){item.acquiredAt=1;changed=true;}if(!Number.isFinite(item.itemLevel)){item.itemLevel=Math.min(100,Math.max(1,((this.data.unlockedStage||0)+1)*20-10));changed=true;}if(!Number.isFinite(item.chapter)){item.chapter=itemChapterFromLevel(item.itemLevel);changed=true;}};
    for(const item of this.data.gearInbox)repairItem(item);
    for(const item of this.data.gearItems){ if(!item)continue;
      if(typeof item.favorite!=='boolean'){item.favorite=false;changed=true;} if(typeof item.locked!=='boolean'){item.locked=false;changed=true;}
      if(typeof item.isNew!=='boolean'){item.isNew=false;changed=true;} if(!Number.isFinite(item.acquiredAt)){item.acquiredAt=1;changed=true;}
      if(!Number.isFinite(item.itemLevel)){item.itemLevel=Math.min(100,Math.max(1,((this.data.unlockedStage||0)+1)*20-10));changed=true;}
      if(!Number.isFinite(item.chapter)){item.chapter=itemChapterFromLevel(item.itemLevel);changed=true;} }
    if(Number(this.data.gearSchemaVersion||0)<3){this.data.gearSchemaVersion=3;changed=true;}
    for(const slot in gearDefaults){ let item=this.gearItem(this.data.equippedGear[slot]);
      if(!item||item.slot!==slot){ const baseId=this.data.gear[slot]||gearDefaults[slot]; item=this.data.gearItems.find(x=>x.baseId===baseId&&x.slot===slot);
        if(!item){item=this.makeGearInstance(baseId,{isNew:false,acquiredAt:1,itemLevel:baseId.endsWith('_none')||baseId==='w_spoon'?1:undefined});if(item)this.data.gearItems.push(item);}
        if(item){this.data.equippedGear[slot]=item.uid;changed=true;} }
      if(item&&this.data.gear[slot]!==item.baseId){this.data.gear[slot]=item.baseId;changed=true;} }
    return changed; },
  equippedGearItem(slot){ return this.gearItem((this.data.equippedGear||{})[slot]); },
  isGearEquipped(uid){ return Object.values(this.data.equippedGear||{}).includes(uid); },
  gearItemsForSlot(slot){ const rank={legend:4,epic:3,rare:2,common:1,start:0},equipped=this.data.equippedGear||{};
    return (this.data.gearItems||[]).filter(x=>x&&(!slot||x.slot===slot)).slice().sort((a,b)=>{
      const ae=Object.values(equipped).includes(a.uid)?1:0,be=Object.values(equipped).includes(b.uid)?1:0;
      return (Number(b.isNew)-Number(a.isNew))||(Number(b.favorite)-Number(a.favorite))||(be-ae)||((rank[b.grade]||0)-(rank[a.grade]||0))||((b.acquiredAt||0)-(a.acquiredAt||0)); }); },
  gearInventoryItems(slot){ const equipped=new Set(Object.values(this.data.equippedGear||{})); return this.gearItemsForSlot(slot).filter(x=>!equipped.has(x.uid)); },
  gearInventoryCount(){ return this.gearInventoryItems().length; },
  gearInventoryFull(){ return this.gearInventoryCount()>=(this.data.gearInventoryCap||24); },
  gearInboxItems(){return Array.isArray(this.data.gearInbox)?this.data.gearInbox:[];},
  gearInboxCount(){return this.gearInboxItems().length;},
  gearInboxItem(uid){return this.gearInboxItems().find(x=>x&&x.uid===uid)||null;},
  addGearInstance(baseId,opts={}){ if(opts.enforceCapacity&&this.gearInventoryFull())return null; const item=this.makeGearInstance(baseId,opts); if(!item)return null;
    if(!Array.isArray(this.data.gearItems))this.data.gearItems=[]; this.data.gearItems.push(item);
    if(!this.data.ownedGear.includes(baseId))this.data.ownedGear.push(baseId); if(!opts.silent)this.save(); return item; },
  receiveGearInstance(baseId,opts={}){const item=this.makeGearInstance(baseId,opts);if(!item)return null;
    if(!Array.isArray(this.data.gearItems))this.data.gearItems=[];if(!Array.isArray(this.data.gearInbox))this.data.gearInbox=[];
    if(!this.data.ownedGear.includes(baseId))this.data.ownedGear.push(baseId);
    const mode=this.data.gearAutoDismantle||'off',protectedItem=!!item.favorite||!!item.locked||item.grade==='epic'||item.grade==='legend',auto=!protectedItem&&((mode==='common'&&item.grade==='common')||(mode==='rare'&&(item.grade==='common'||item.grade==='rare')));
    if(this.gearInventoryFull()){
      if(auto){const shards=gearDismantleValue(item);this.data.shards=(this.data.shards||0)+shards;this.save();return{item,destination:'salvaged',shards};}
      if(this.data.gearInbox.length<GEAR_INBOX_CAP){this.data.gearInbox.push(item);this.save();return{item,destination:'inbox'};}
      if(protectedItem){const idx=this.data.gearInbox.findIndex(x=>x&&!x.favorite&&!x.locked&&(x.grade==='common'||x.grade==='rare'));
        let displacedShards=0;if(idx>=0){const old=this.data.gearInbox.splice(idx,1)[0];displacedShards=gearDismantleValue(old);this.data.shards=(this.data.shards||0)+displacedShards;}
        this.data.gearInbox.push(item);this.save();return{item,destination:'inbox',overflow:idx<0,displacedShards};}
      const shards=gearDismantleValue(item);this.data.shards=(this.data.shards||0)+shards;this.save();return{item,destination:'salvaged',shards};
    }
    this.data.gearItems.push(item);this.save();return{item,destination:'bag'};},
  claimGearInbox(uid){const item=this.gearInboxItem(uid);if(!item||this.gearInventoryFull())return false;this.data.gearInbox=this.data.gearInbox.filter(x=>x&&x.uid!==uid);item.isNew=true;this.data.gearItems.push(item);this.save();return true;},
  setGearAutoDismantle(mode){this.data.gearAutoDismantle=['off','common','rare'].includes(mode)?mode:'off';this.save();return this.data.gearAutoDismantle;},
  equipGearInstance(slot,uid){ const item=this.gearItem(uid); if(!item||item.slot!==slot)return false;
    this.data.equippedGear[slot]=item.uid; this.data.gear[slot]=item.baseId; item.isNew=false; this.save(); return true; },
  equipGearBase(slot,baseId){ const item=(this.data.gearItems||[]).find(x=>x&&x.baseId===baseId&&x.slot===slot); return item?this.equipGearInstance(slot,item.uid):false; },
  removeGearInstance(uid){ const item=this.gearItem(uid); if(!item||item.locked||item.favorite||this.isGearEquipped(uid))return false;
    this.data.gearItems=this.data.gearItems.filter(x=>x.uid!==uid); this.save(); return true; },
  dismantleGearInstance(uid){const item=this.gearItem(uid);if(!item||item.locked||item.favorite||item.grade==='start'||this.isGearEquipped(uid))return 0;const shards=gearDismantleValue(item);this.data.gearItems=this.data.gearItems.filter(x=>x&&x.uid!==uid);this.data.shards=(this.data.shards||0)+shards;this.save();return shards;},
  dismantleGearInbox(uid){const item=this.gearInboxItem(uid);if(!item||item.locked||item.favorite||item.grade==='epic'||item.grade==='legend'||item.grade==='start')return 0;const shards=gearDismantleValue(item);this.data.gearInbox=this.data.gearInbox.filter(x=>x&&x.uid!==uid);this.data.shards=(this.data.shards||0)+shards;this.save();return shards;},
  markGearSeen(uid){ const item=this.gearItem(uid); if(!item)return false; if(item.isNew){item.isNew=false;this.save();} return true; },
  toggleGearFavorite(uid){ const item=this.gearItem(uid); if(!item)return false; item.favorite=!item.favorite; this.save(); return item.favorite; },
  toggleGearLock(uid){ const item=this.gearItem(uid); if(!item)return false; item.locked=!item.locked; this.save(); return item.locked; },
  gearLv(ref){ const item=this.gearItem(ref); if(item)return item.enhanceLv||0; const id=(this.gearBase(ref)||{}).id||ref; return (this.data.gearLv&&this.data.gearLv[id])||0; },
  gearReviveCount(){ let n=0; for(const slot in GEAR){ const it=GEAR[slot].find(g=>g.id===this.data.gear[slot]); if(it&&it.fx==='revive')n++; } return n; },   // อุปกรณ์ตำนานคืนชีพที่สวมอยู่
  // 🔩 เศษอุปกรณ์: ได้จากของซ้ำ · ใช้หลอมของตำนาน
  addShards(n){ this.data.shards=(this.data.shards||0)+n; this.save(); },
  spendShards(n){ if((this.data.shards||0)>=n){ this.data.shards-=n; this.save(); return true; } return false; },
  // affix ต่อ instance; legacy maps are mirrored for compatibility with the current UI.
  gearAffixes(ref){ const item=this.gearItem(ref); if(item)return item.affixes||[]; const id=(this.gearBase(ref)||{}).id||ref; return (this.data.gearAffix&&this.data.gearAffix[id])||[]; },
  ensureAffix(ref,tier){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref,t=base?base.tier:tier;
    if(item){ if(!Array.isArray(item.affixes)){item.affixes=rollAffixes(t,item.itemLevel||1,base);this.save();} return item.affixes; }
    if(!this.data.gearAffix)this.data.gearAffix={}; if(!this.data.gearAffix[id]){this.data.gearAffix[id]=rollAffixes(t,1,base);this.save();} return this.data.gearAffix[id]; },
  rerollAffix(ref,tier){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref,arr=rollAffixes(base?base.tier:tier,item?item.itemLevel:1,base);
    if(item)item.affixes=arr; if(!this.data.gearAffix)this.data.gearAffix={}; this.data.gearAffix[id]=arr.map(x=>Object.assign({},x)); this.save(); return arr; },
  setAffixes(ref,arr){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref,copy=Array.isArray(arr)?arr.map(x=>Object.assign({},x)):[];
    if(item)item.affixes=copy; if(!this.data.gearAffix)this.data.gearAffix={}; this.data.gearAffix[id]=copy.map(x=>Object.assign({},x)); this.save(); },
  // craft state (common/magic/rare internally) per instance
  gearRarity(ref,baseTier){ const item=this.gearItem(ref); if(item)return item.craftState||baseDefaultRarity(item.grade||baseTier); const id=(this.gearBase(ref)||{}).id||ref; return (this.data.gearRarity&&this.data.gearRarity[id])||baseDefaultRarity(baseTier); },
  setGearRarity(ref,r){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref; if(item)item.craftState=r;
    if(!this.data.gearRarity)this.data.gearRarity={}; this.data.gearRarity[id]=r; this.save(); },
  // 🧪 currency
  currency(k){ return (this.data.currency&&this.data.currency[k])||0; },
  addCurrency(k,n){ if(!this.data.currency)this.data.currency={}; this.data.currency[k]=(this.data.currency[k]||0)+n; this.save(); },
  spendCurrency(k,n){ if((this.currency(k))>=n){ this.data.currency[k]-=n; this.save(); return true; } return false; },
  enhance(ref){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref,lv=this.gearLv(ref);
    const o=enhanceOdds(lv),r=Math.random(); let result;
    if(r<o.destroy)result='destroy'; else if(r<o.destroy+o.brk)result='break'; else result='success';
    if(result==='success'){ const n=lv+1; if(item)item.enhanceLv=n; this.data.gearLv[id]=n; this.save(); return {result,lv:n}; }
    if(result==='break'){ const n=Math.max(3,lv-1); if(item)item.enhanceLv=n; this.data.gearLv[id]=n; this.save(); return {result,lv:n}; }
    // destroy: ปลดออกจากช่องถ้าใส่อยู่ แล้วลบไอเทมทิ้ง
    if(item){ for(const s in this.data.equippedGear){ if(this.data.equippedGear[s]===item.uid){ delete this.data.equippedGear[s]; if(this.data.gear)delete this.data.gear[s]; } } this.data.gearItems=(this.data.gearItems||[]).filter(x=>x&&x.uid!==item.uid); }
    this.data.gearLv[id]=0; this.save(); return {result:'destroy',lv:0}; },
  sellGearInstance(uid){ const item=this.gearItem(uid); if(!item||item.locked||item.favorite||item.grade==='start'||this.isGearEquipped(uid))return 0;
    const sugar=gearSellSugar(item); this.data.gearItems=(this.data.gearItems||[]).filter(x=>x&&x.uid!==uid); this.data.sugar=(this.data.sugar||0)+sugar; this.save(); return sugar; },
  // ระบบยศ (prestige loop): rank ถาวร + เลเวลWaitบปัจจุบัน (0..TAL_MAX)
  talLvl(k){ return this.data.upgrades[k]||0; },
  talTotal(k){ return (this.data.rank||0)*TAL_MAX + this.talLvl(k); },   // ผลรวมที่ใช้จริง (ยศ+Waitบนี้)
  talCost(k){ const lvl=this.talLvl(k), rank=this.data.rank||0; return Math.round(UPGRADES[k].base*(lvl+1)*(1+rank*0.8)); },
  talAllMax(){ return UPG_ORDER.every(k=>this.talLvl(k)>=TAL_MAX); },
  talFilled(){ let t=0; for(const k of UPG_ORDER) t+=this.talLvl(k); return t; },   // ความคืบหน้าWaitบนี้
  buyTal(k){ if(this.talLvl(k)>=TAL_MAX)return false; const c=this.talCost(k); if(!this.spend(c))return false;
    this.data.upgrades[k]=this.talLvl(k)+1; this.save(); return true; },
  promote(){ if(!this.talAllMax())return 0; const rank=this.data.rank||0; const rew=promoteReward(rank);
    this.data.rank=rank+1; for(const k of UPG_ORDER) this.data.upgrades[k]=0;
    this.data.sugar=(this.data.sugar||0)+rew; this.save(); return rew; },
  // ---- Rank Perks (RP = rank ทั้งหมด · ใช้ไปตามที่ลง perk) ----
  perkLvl(id){ return (this.data.rankPerks||{})[id]||0; },
  rankPointsTotal(){ return this.data.rank||0; },
  rankPointsSpent(){ let s=0; const rp=this.data.rankPerks||{}; for(const k in rp)s+=rp[k]||0; return s; },
  rankPointsFree(){ return this.rankPointsTotal()-this.rankPointsSpent(); },
  perkTierSpent(tier){ let s=0; for(const pk of RANK_PERKS){ if((pk.tier||1)===tier)s+=this.perkLvl(pk.id); } return s; },
  perkTierUnlocked(tier){ if((tier||1)<=1)return true; if(tier===2)return this.perkTierSpent(1)>=PERK_TIER_REQ[2]; return (this.perkTierSpent(1)+this.perkTierSpent(2))>=PERK_TIER_REQ[3]; },
  buyPerk(id){ const def=RANK_PERKS.find(p=>p.id===id); if(!def)return false; if(this.perkLvl(id)>=def.max)return false; if(this.rankPointsFree()<=0)return false; if(!this.perkTierUnlocked(def.tier||1))return false;
    if(!this.data.rankPerks)this.data.rankPerks={}; this.data.rankPerks[id]=this.perkLvl(id)+1; this.save(); return true; },
  respecPerks(){ this.data.rankPerks={}; this.save(); },
  canAscend(){ return [0,1,2,3,4].every(i=>!!(this.data.stageMastery||{})[i]); },
  endgameUnlocked(){ return (this.data.ascension||0)>0||this.canAscend(); },
  // Zone Modifiers ปลดล็อกเมื่อผ่านบอสจบ Chapter 1 (ด่าน 5 · index 4) = ผู้เล่นเรียนรู้เกมแล้ว
  zoneModsUnlocked(){ return !!(this.data.stageMastery&&this.data.stageMastery[4]); },
  zoneMods(){ return Array.isArray(this.data.zoneMods)?this.data.zoneMods:[]; },
  toggleZoneMod(id){ if(!Array.isArray(this.data.zoneMods))this.data.zoneMods=[]; const i=this.data.zoneMods.indexOf(id); if(i>=0)this.data.zoneMods.splice(i,1); else this.data.zoneMods.push(id); this.save(); },
  ascend(){ if(!this.canAscend())return 0;this.data.ascension=(this.data.ascension||0)+1;this.data.stageMastery={};this.data.diffBest=[];this.data.unlockedStage=0;
    const reward=350+this.data.ascension*150;this.data.sugar=(this.data.sugar||0)+reward;this.save();return reward; },
  recordEndless(cycle,kills,seconds,character){const score=Math.round(cycle*100000+kills*100+seconds);this.data.endlessBest=Math.max(this.data.endlessBest||0,cycle);
    this.data.endlessBoard=(this.data.endlessBoard||[]).concat([{cycle,kills,seconds:Math.floor(seconds),character,score,date:new Date().toISOString().slice(0,10)}]).sort((a,b)=>b.score-a.score).slice(0,5);this.save();return score;},
  power(id){ id=id||this.data.character||'momo';const cp=this.cp(id);let p=100+Math.max(0,(cp.lvl||1)-1)*28+(this.data.rank||0)*170;
    for(const k in (this.data.stageMastery||{}))if(this.data.stageMastery[k])p+=POWER_TUNING.mastery[Number(k)]||0;
    for(const k of UPG_ORDER)p+=this.talTotal(k)*22;
    const tierPower={start:0,common:45,rare:105,epic:190,legend:280};
    for(const slot of GEAR_SLOTS){const inst=this.equippedGearItem(slot.slot),it=inst&&GEAR_ALL.find(g=>g.id===inst.baseId);if(it)p+=(tierPower[it.tier]||0)+this.gearLv(inst.uid)*18+(inst.itemLevel||1)*2;}
    const tal=cp.tal||{};for(const k in tal)p+=(tal[k]||0)*26;p+=(this.data.ascension||0)*250;return Math.max(100,Math.round(p/10)*10); },
  reset(){ try{ localStorage.removeItem('mochi_save'); }catch(e){}
    this.data={ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], gearItems:[], equippedGear:{}, gearInventoryCap:24, gearInbox:[], gearAutoDismantle:'off', gearSchemaVersion:0, gearUidSeq:0, character:'momo', chars:[], charProg:{}, rank:0, ascension:0, endlessBest:0, endlessBoard:[], bestiary:{}, stageMastery:{}, achievements:{}, daily:{claimDay:'',streak:0,challengeDay:'',challengeDone:false}, tutorialDone:false, settings:Object.assign({},DEFAULT_SETTINGS) }; this.load(); },
  // ---- Bestiary (Monster Card) ----
  kills(type){ return (this.data.bestiary&&this.data.bestiary[type])||0; },
  addKill(type){ if(!this.data.bestiary)this.data.bestiary={};
    const before=this.data.bestiary[type]||0, after=before+1;
    this.data.bestiary[type]=after;
    // ปลดขั้น Bestiary = รับ Sugar (แทนที่โบนัสสแตตเดิม) — คืนจำนวน Sugar ที่ได้ให้ผู้เรียกโชว์ป้าย
    let sugar=0;
    for(const t of BESTIARY_THRESHOLDS){ if(before<t&&after>=t)sugar+=40; }
    if(sugar){ this.data.sugar=(this.data.sugar||0)+sugar; this.save(); }
    return sugar; },
};
/* ---- Cloud: เซฟขึ้น Supabase (Anonymous auth ผูกกับ device) กันเซฟหาย ---- */
const CLOUD_URL='https://tohsnflngkfoutqcfrwi.supabase.co';
const CLOUD_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaHNuZmxuZ2tmb3V0cWNmcndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjE3NzYsImV4cCI6MjEwNTE5Nzc3Nn0.EX6rE5skhsJq9jpwRvloDimZoPi5Mnhz-wpTwnx6ej4';
const Cloud = {
  sb:null, user:null, ready:false, _pushT:null, _deeplinkBound:false, _onLogin:null,
  enabled(){ try{ return !!(window.supabase&&CLOUD_URL&&CLOUD_KEY); }catch(e){ return false; } },
  // แอป Android/iOS (Capacitor) หรือไม่
  native(){ try{ return !!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()); }catch(e){ return false; } },
  // สร้าง client (ไม่Lockedอิน) — ใช้ได้แม้ Anonymous ปิดอยู่ · เก็บ session ที่มีอยู่แล้ว (เช่น Google หลัง redirect) · pkce = ปลอดภัย + Waitงรับ deep link
  async ensureClient(){ if(this.sb){ this.bindDeepLink(); return true; } if(!this.enabled())return false;
    try{ this.sb=window.supabase.createClient(CLOUD_URL,CLOUD_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce',storageKey:'mochi_sb_auth'}});
      const sess=(await this.sb.auth.getSession()).data.session; if(sess)this.user=sess.user; this.bindDeepLink(); return true;
    }catch(e){ console.warn('[cloud] ensureClient',e); return false; } },
  // ในแอป: ดักการเด้งกลับจาก Custom Tab (com.mochimayhem.game://login-callback) แล้วแลก code เป็น session
  bindDeepLink(){ if(this._deeplinkBound||!this.native())return;
    try{ const App=window.Capacitor.Plugins.App; if(!App)return;
      App.addListener('appUrlOpen', async (ev)=>{ const url=ev&&ev.url; if(!url||url.indexOf('login-callback')<0)return;
        try{ const qs=(url.split('?')[1]||'').split('#')[0], p=new URLSearchParams(qs), code=p.get('code');
          if(code){ await this.sb.auth.exchangeCodeForSession(code); }
          else { const hp=new URLSearchParams(url.split('#')[1]||''), at=hp.get('access_token'), rt=hp.get('refresh_token'); if(at&&rt)await this.sb.auth.setSession({access_token:at,refresh_token:rt}); }
          const s=(await this.sb.auth.getSession()).data.session; if(s){ this.user=s.user; this.ready=true; }
        }catch(e){ console.warn('[cloud] deeplink',e); }
        try{ const B=window.Capacitor.Plugins.Browser; if(B)await B.close(); }catch(e){}
        try{ if(this._onLogin)this._onLogin(); }catch(e){}
      });
      this._deeplinkBound=true;
    }catch(e){ console.warn('[cloud] bindDeepLink',e); } },
  async init(){ if(this.ready)return true; if(!(await this.ensureClient()))return false;
    try{ let sess=(await this.sb.auth.getSession()).data.session;
      if(!sess){ const r=await this.sb.auth.signInAnonymously(); if(r.error){ console.warn('[cloud] anon sign-in disabled?',r.error.message); return false; } sess=r.data.session; }
      this.user=sess.user; this.ready=true; return true;
    }catch(e){ console.warn('[cloud] init',e); return false; } },
  async pull(){ if(!this.ready)return null; try{ const {data,error}=await this.sb.from('game_saves').select('data').eq('user_id',this.user.id).maybeSingle(); if(error){console.warn('[cloud] pull',error.message);return null;} return data?data.data:null; }catch(e){ return null; } },
  async push(data){ if(!this.ready)return; try{ await this.sb.from('game_saves').upsert({user_id:this.user.id,data,updated_at:new Date().toISOString()}); }catch(e){ console.warn('[cloud] push',e); } },
  queuePush(data){ if(!this.ready)return; clearTimeout(this._pushT); this._pushT=setTimeout(()=>this.push(data),1500); },
  // ---- Google login (บัญชีถาวร ข้ามเครื่อง) ----
  isGoogle(){ try{ return !!(this.user&&this.user.app_metadata&&this.user.app_metadata.provider==='google'); }catch(e){ return false; } },
  accountLabel(){ try{ if(this.isGoogle())return this.user.email||'Google account'; return this.user?'Temporary account (this device)':'Not connected'; }catch(e){ return 'Not connected'; } },
  async signInGoogle(){ if(!(await this.ensureClient()))return {ok:false,msg:'Cloud not ready (SDK failed to load)'};
    try{
      // ในแอป Android: เปิด Custom Tab Lockedอิน แล้วเด้งกลับผ่าน deep link (WebView Lockedอิน Google ตรง ๆ ไม่ได้)
      if(this.native()){
        this.bindDeepLink();
        const {data,error}=await this.sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:'com.mochimayhem.game://login-callback',skipBrowserRedirect:true}});
        if(error)return {ok:false,msg:error.message};
        if(data&&data.url){ const B=window.Capacitor.Plugins.Browser; if(!B)return {ok:false,msg:'Browser plugin not ready (reinstall the APK)'}; await B.open({url:data.url,presentationStyle:'popover'}); return {ok:true,native:true}; }
        return {ok:false,msg:'Failed to get login URL'};
      }
      // เว็บ: redirect ในหน้า · มี session (anon) → ผูก Google เก็บ progress เดิม · None → sign-in ตรง
      const redirectTo=(location.origin+location.pathname);
      const sess=(await this.sb.auth.getSession()).data.session;
      let r = sess ? await this.sb.auth.linkIdentity({provider:'google',options:{redirectTo}})
                   : await this.sb.auth.signInWithOAuth({provider:'google',options:{redirectTo}});
      if(r.error && sess){ r=await this.sb.auth.signInWithOAuth({provider:'google',options:{redirectTo}}); }
      if(r.error)return {ok:false,msg:r.error.message};
      return {ok:true,redirect:true};   // เบราว์เซอร์จะรีไดเรกต์ไป Google แล้วกลับมา
    }catch(e){ return {ok:false,msg:String(e&&e.message||e)}; } },
  async signOut(){ try{ if(this.sb)await this.sb.auth.signOut(); }catch(e){} this.user=null;this.ready=false; },
};

/* ---- BESTIARY: สมุดมอนสเตอร์ · ฆ่ามอนเก็บสถิติ → ปลดโบนัสถาวร 5 ระดับ ---- */
const BESTIARY_THRESHOLDS = [25, 150, 500, 1500, 5000, 15000, 40000, 100000];   // 8 ระดับ · ระดับสูง (6-8) = รางวัลของการฆ่ามอนสะสมเยอะ ๆ
const BEST_MAX_TIER = BESTIARY_THRESHOLDS.length;
const BEST_HI_SCALE = [1.7, 2.6, 3.8];   // tier 6/7/8 = สเกลจากโบนัส tier 5 (โตขึ้นเยอะที่ tier สูง)
const BESTIARY = [
  { id:'basic',   emoji:'🐜', name:'Sour Worker Ant',   tex:'e_ant_worker',  desc:'The nest basic worker',
    bonus:[{hp:1},{hp:2},{hp:3},{hp:5},{hp:9,def:0.01}] },
  { id:'fast',    emoji:'🐜', name:'Scout Ant',        tex:'e_ant_scout',   desc:'Small, fast, closes in quickly',
    bonus:[{spd:0.008},{spd:0.015},{spd:0.022},{spd:0.03},{spd:0.045}] },
  { id:'tank',    emoji:'🛡️', name:'Armored Soldier Ant',     tex:'e_ant_soldier', desc:'Thick armor, tanky, high HP',
    bonus:[{def:0.008},{def:0.012},{def:0.016},{def:0.022},{def:0.03}] },
  { id:'shooter', emoji:'💧', name:'Acid Spitter Ant',        tex:'e_ant_spitter', desc:'Spits acid from range',
    bonus:[{dmg:0.008},{dmg:0.015},{dmg:0.022},{dmg:0.03},{dmg:0.04}] },
  { id:'bomber',  emoji:'💥', name:'Acid Bomber Ant',        tex:'e_ant_drone',   desc:'Explodes acid on death — stay clear!',
    bonus:[{crit:0.008},{crit:0.012},{crit:0.016},{crit:0.02},{crit:0.028}] },
  { id:'acid',    emoji:'🟢', name:'Acid Poison Ant',     tex:'e_acid',        desc:'Spits corrosive acid pools',
    bonus:[{def:0.008},{def:0.012},{def:0.016},{def:0.02},{def:0.028,hp:6}] },
  { id:'dasher',  emoji:'⚡', name:'Dasher Ant',         tex:'e_ant_scout',   desc:'Waits, then dashes in fast!',
    bonus:[{cdr:0.008},{cdr:0.015},{cdr:0.022},{cdr:0.03},{cdr:0.04}] },
  { id:'siege',   emoji:'🧱', name:'Siege Ant',       tex:'e_ant_soldier', desc:'Tanky and slow, but hits hard',
    bonus:[{hp:2},{hp:4},{hp:6},{hp:9},{hp:13,def:0.015}] },
  // --- Minibosses (แยกรายด่าน · สแตตเล็กน้อยต่อตัว กันเฟ้อ) ---
  { id:'mini0', emoji:'👑', name:'Ruby-Fang Guard',        tex:'mb1', desc:'Stage 1 miniboss — nest royal guard',
    bonus:[{dmg:0.004},{dmg:0.008},{dmg:0.012},{dmg:0.016},{dmg:0.022}] },
  { id:'mini1', emoji:'🌀', name:'Valve Maw',              tex:'mb2', desc:'Stage 2 miniboss — pressure warden',
    bonus:[{cdr:0.004},{cdr:0.008},{cdr:0.012},{cdr:0.016},{cdr:0.022}] },
  { id:'mini2', emoji:'🍳', name:'Boiling Pan',            tex:'mb3', desc:'Stage 3 miniboss — chili engine guard',
    bonus:[{dmg:0.004},{dmg:0.008},{dmg:0.012},{dmg:0.016},{dmg:0.022}] },
  { id:'mini3', emoji:'🧊', name:'Giant Ice Block',        tex:'mb4', desc:'Stage 4 miniboss — frost prison warden',
    bonus:[{def:0.004},{def:0.008},{def:0.011},{def:0.014},{def:0.018}] },
  { id:'mini4', emoji:'🔪', name:'Banquet Executioner',    tex:'mb5_banquet_executioner', desc:'Stage 5 miniboss — the crown feast',
    bonus:[{crit:0.004},{crit:0.007},{crit:0.01},{crit:0.013},{crit:0.017}] },
  { id:'mini5', emoji:'🦗', name:'Sporewarden Mantis',     tex:'mb6_sporewarden', desc:'Chapter 2 miniboss — canopy warden',
    bonus:[{spd:0.004},{spd:0.008},{spd:0.012},{spd:0.016},{spd:0.022}] },
  // --- Bosses (แยกรายด่าน · สแตตเล็กน้อยต่อตัว กันเฟ้อ) ---
  { id:'boss0', emoji:'👑', name:'Emerald Acid Ant Empress', tex:'boss1', desc:'Stage 1 boss — ruler of the sour nest',
    bonus:[{hp:1,dmg:0.004},{hp:2,dmg:0.008},{hp:3,dmg:0.012},{hp:4,dmg:0.016},{hp:6,dmg:0.02,def:0.008}] },
  { id:'boss1', emoji:'🚰', name:'Clogmaw',                tex:'boss2', desc:'Stage 2 boss — lord of clogged pipes',
    bonus:[{hp:1,def:0.004},{hp:2,def:0.007},{hp:3,def:0.01},{hp:4,def:0.013},{hp:6,def:0.017}] },
  { id:'boss2', emoji:'🔥', name:'Mr. Griddle',            tex:'boss3', desc:'Stage 3 boss — the chili furnace',
    bonus:[{dmg:0.005},{dmg:0.009},{dmg:0.013},{dmg:0.018},{dmg:0.024,crit:0.008}] },
  { id:'boss3', emoji:'🍦', name:'Ice Cream Golem',        tex:'boss4', desc:'Stage 4 boss — the frost warden',
    bonus:[{hp:1,def:0.004},{hp:2,def:0.007},{hp:3,def:0.011},{hp:5,def:0.014},{hp:7,def:0.019}] },
  { id:'boss4', emoji:'🌑', name:'The Great Hunger',       tex:'boss5_sovereign', desc:'Stage 5 boss — the bottomless hunger',
    bonus:[{hp:2,dmg:0.006},{hp:3,dmg:0.011},{hp:5,dmg:0.016,crit:0.008},{hp:7,dmg:0.022,crit:0.011},{hp:10,dmg:0.028,crit:0.015,def:0.012}] },
  { id:'boss5', emoji:'🌿', name:'The Rootmother',         tex:'boss6_rootmother', desc:'Chapter 2 boss — the root throne',
    bonus:[{hp:2,dmg:0.006},{hp:3,dmg:0.011},{hp:5,dmg:0.016},{hp:7,dmg:0.022,def:0.01},{hp:10,dmg:0.028,def:0.015,crit:0.012}] },
];
function bestiaryLv(type){ const k=Save.kills(type); let lv=0; for(const t of BESTIARY_THRESHOLDS){ if(k>=t)lv++; else break; } return lv; }
// โบนัสสแตตของ tier ที่ระบุ (tier 0-4 = ค่าใน bonus[] · tier 5-7 = สเกลจาก tier 5)
function bestiaryBonusAt(m,tierIdx){ if(tierIdx<0||!m.bonus)return {}; if(tierIdx<m.bonus.length)return m.bonus[tierIdx]||{}; const base=m.bonus[m.bonus.length-1]||{},sc=BEST_HI_SCALE[tierIdx-m.bonus.length]||3.8,out={}; for(const k in base)out[k]=base[k]*sc; return out; }
function bestiaryBonusTotal(type){ const m=BESTIARY.find(x=>x.id===type); if(!m)return {}; const lv=bestiaryLv(type),tot={}; for(let i=0;i<lv;i++){ const b=bestiaryBonusAt(m,i); for(const k in b)tot[k]=(tot[k]||0)+b[k]; } return tot; }
function bestiaryTotals(){ const tot={hp:0,dmg:0,def:0,spd:0,crit:0,cdr:0}; for(const m of BESTIARY){ const b=bestiaryBonusTotal(m.id); for(const k in b)tot[k]=(tot[k]||0)+(b[k]||0); } return tot; }
function bestiaryBonusText(b){ const parts=[]; if(b.hp)parts.push('+'+Math.round(b.hp)+' HP'); if(b.dmg)parts.push('+'+(b.dmg*100).toFixed(1)+'% DMG'); if(b.def)parts.push('-'+(b.def*100).toFixed(1)+'% DMG taken'); if(b.spd)parts.push('+'+(b.spd*100).toFixed(1)+'% SPD'); if(b.crit)parts.push('+'+(b.crit*100).toFixed(1)+'% Crit'); if(b.cdr)parts.push('-'+(b.cdr*100).toFixed(1)+'% CD'); return parts.join(' · '); }

/* ---- STAGES: 5 โซนครัว · แต่ละStage = Wave → Miniboss (กลางด่าน) → บอสใหญ่ (จบด่าน) ---- */
/* ---- STAGE_PROPS: เลย์เอาต์ props ต่อStage [key,x,y,solid,scale] — ทำแผนที่ให้เป็น "Room" ที่ออกแบบไว้ ----
   ผู้เล่นเกิดที่ (0,0) · solid=true แลนด์มาร์กชนได้ · ที่เหลือเดินทะลุ · เว้นกลางRoomโล่งให้สู้ */
const STAGE_PROPS = {
  0: [
    ['nest_hole',-1050,-760,true,0.78],['nest_hole',1080,720,true,0.72],['nest_hole',1050,-820,true,0.66],
    ['nest_obelisk',-760,-660,true,0.64],['nest_obelisk',760,650,true,0.64],
    ['nest_crystal',-820,420,true,0.58],['nest_crystal',820,-420,true,0.58],
    ['nest_crystal',-1120,120,true,0.50],['nest_crystal',1120,-100,true,0.50],
    ['nest_mound',-650,880,true,0.68],['nest_mound',680,-900,true,0.68],
    ['nest_eggs',-1020,-360,true,0.55],['nest_eggs',1000,360,true,0.55],
    ['nest_acid',-430,-760,false,0.70],['nest_acid',460,780,false,0.70],
    ['nest_acid',-900,760,false,0.58],['nest_acid',920,-720,false,0.58]
  ],
  1: [
    ['drain_grate',-920,-720,true,0.92],['drain_grate',910,700,true,0.84],
    ['drain_pipe',-1030,160,true,0.88],['drain_pipe',1030,-180,true,0.88],
    ['drain_sludge',-540,-620,false,1.05],['drain_sludge',590,610,false,1.12],
    ['drain_sludge',-760,590,false,0.82],['drain_sludge',760,-570,false,0.86],
    ['drain_bubbles',-260,820,false,0.92],['drain_bubbles',320,-840,false,0.92]
  ],
  2: [
    ['stove_furnace',-980,-720,true,0.92],['stove_furnace',980,720,true,0.92],
    ['stove_furnace',980,-720,true,0.72],['stove_furnace',-980,720,true,0.72],
    ['stove_pipe',-1120,50,true,0.92],['stove_pipe',1120,-50,true,0.92],
    ['stove_gear',-650,-850,false,0.88],['stove_gear',690,850,false,0.88],
    ['stove_gear',-720,560,false,0.66],['stove_gear',740,-560,false,0.66],
    ['stove_belt',-250,920,true,0.82],['stove_belt',280,-920,true,0.82]
  ],
  3: [
    ['ice_cage',-980,-720,true,0.88],['ice_cage',980,720,true,0.88],
    ['ice_cage',980,-720,true,0.72],['ice_cage',-980,720,true,0.72],
    ['ice_crystal',-1120,80,true,0.94],['ice_crystal',1120,-80,true,0.94],
    ['ice_crystal',-640,-820,true,0.62],['ice_crystal',680,820,true,0.62],
    ['ice_chain',-610,570,false,0.86],['ice_chain',620,-570,false,0.86],
    ['ice_pool',-260,900,false,1.08],['ice_pool',300,-900,false,1.08]
  ],
  4: [
    ['crown_oven',-980,-720,true,0.92],['crown_oven',980,720,true,0.92],
    ['crown_oven',980,-720,true,0.78],['crown_oven',-980,720,true,0.78],
    ['hunger_seal',-520,-520,false,1.05],['hunger_seal',540,520,false,1.05],
    ['hunger_seal',-560,540,false,0.82],['hunger_seal',560,-540,false,0.82],
    ['p_shelf',-1120,40,true,0.72],['p_shelf',1120,-40,true,0.72],
    ['p_cans',-260,900,true,0.78],['p_cans',300,-900,true,0.78]
  ],
  5: [
    ['ch2_prop_atlas',-990,-720,true,0.74,0],['ch2_prop_atlas',990,720,true,0.70,0],
    ['ch2_prop_atlas',960,-700,true,0.66,2],['ch2_prop_atlas',-960,700,true,0.66,2],
    ['ch2_prop_atlas',-1120,40,true,0.64,3],['ch2_prop_atlas',1120,-40,true,0.64,3],
    ['ch2_prop_atlas',-540,-560,false,0.54,1],['ch2_prop_atlas',570,560,false,0.58,1],
    ['ch2_prop_atlas',-610,590,false,0.52,5],['ch2_prop_atlas',620,-590,false,0.52,5],
    ['ch2_prop_atlas',0,-930,true,0.64,7],['ch2_prop_atlas',0,980,false,0.72,4,220]
  ],
};
const STAGES = [
  { name:'The Sour Ant Nest', en:'The Sour Ant Nest', emoji:'🐜', grid:0x2d261f, tint:0x8ee04b,
    lore:'Momo falls through a crack under the pantry into a nest where acid crystals are warping the whole ant kingdom',
    waves:5, recommendedPower:100, miniAt:2, mini:'Ruby-Fang Guard',
    boss:'Emerald Acid Ant Empress', bossHp:920, bossDmg:25 },
  { name:'The Rotting Drain', en:'The Rotting Drain', emoji:'🚰', grid:0x3c4d61, tint:0x8fc7ff,
    lore:'Acid from the nest floods the ancient drains, raising creatures of foam, sewage and grate scraps into a new army',
    waves:5, recommendedPower:280, miniAt:2, mini:'Valve Maw, Pressure Warden', boss:'Clogmaw, Lord of Clogged Pipes', bossHp:1120, bossDmg:24 },
  { name:'Chili Engine Room', en:'Chili Engine Room', emoji:'🔥', grid:0x60463c, tint:0xff8a5a,
    lore:'The chili furnace siphons power from the ant nest to run the Bitter Chef cursed machine',
    waves:5, recommendedPower:560, miniAt:2, mini:'Boiling Pan', boss:'Mr. Griddle', bossHp:1000, bossDmg:28 },
  { name:'Sugar Frost Prison', en:'Sugar Frost Prison', emoji:'❄️', grid:0x3d4a5c, tint:0x9fe0ff,
    lore:'Sweet flavor spirits are frozen as fuel, and the golem wardens let no one escape',
    waves:5, recommendedPower:940, miniAt:2, mini:'Giant Ice Block', boss:'Ice Cream Golem', bossHp:1400, bossDmg:32 },
  { name:'The Crown Oven of Hunger', en:'The Crown Oven of Hunger', emoji:'🌑', grid:0x2a102f, tint:0xd95cff,
    lore:'The royal oven opens — the Bitter Chef dissolves into a vessel, and The Great Hunger descends to devour all flavor itself',
    waves:5, recommendedPower:1450, miniAt:2, mini:'Banquet Executioner', boss:'The Great Hunger', bossHp:2800, bossDmg:40 },
  { name:'The Fermented Canopy', en:'The Fermented Canopy', emoji:'🌿', grid:0x143c35, tint:0x56e5bd, chapter:1, chapterStage:1,
    lore:'The crown seed that survived The Great Hunger roots upward into the garden above the kitchen, forcing returned memories to bloom out of season',
    waves:5, recommendedPower:2200, miniAt:2, mini:'Sporewarden Mantis', boss:'The Rootmother', bossHp:3600, bossDmg:46 },
];

/* ข้อความบนสนามเป็นเหตุการณ์ในเนื้อเรื่อง ไม่ใช้ชื่อเวฟเชิงระบบ */
const STAGE_STORY_BEATS = [
  [
    {title:'Crack Beneath the Pantry',sub:'The acid crystal calls the workers to seal Momo\'s way back'},
    {title:'A Sour Scent Buries Memory',sub:'The scouts forget their names, recalling only the crystal orders'},
    {title:'The Guard of the Egg Nest',sub:'Ruby Fang accepts the curse to protect the nest heirs'},
    {title:'The Empress Oath',sub:'The legion opens the hatchery — a pact trading freedom for her children lives'},
    {title:'The Oven Mark Below',sub:'A crown-shaped burn shows the Bitter Chef siphoning acid upward'}
  ],
  [
    {title:'Acid Floods the Old Drains',sub:'Nest waste ferments until foam and grates gain a will'},
    {title:'Whispers in the Sewage',sub:'Washed-away memories merge into pipe wardens'},
    {title:'Valve Maw Holds the Pressure',sub:'The warden would rather shatter than let the curse flow back'},
    {title:'A Pulse Beneath the Grate',sub:'Every pipe contracts at once, as if the drains became a heart'},
    {title:'Clogmaw Wakes from the Sludge',sub:'The clog lord hoards acid to feed the chili engine'}
  ],
  [
    {title:'The Acid-Eating Machine',sub:'The furnace turns nest acid into cursed fuel'},
    {title:'Chilies Forced to Burn',sub:'Spicy sparks beg to be freed from the iron gears'},
    {title:'The Boiling Pan Blocks the Way',sub:'The stove warden hurls heat to keep the factory pressure'},
    {title:'The Belt of Bitterness',sub:'Every fuel crate bears the same crown mark as the acid crystal'},
    {title:'Mr. Griddle Revs Up',sub:'The cursed machine sends power up to the Sugar Frost Prison'}
  ],
  [
    {title:'Sweet Voices Under the Ice',sub:'Flavor spirits are frozen as the oven batteries'},
    {title:'Cold Chains Eat Old Names',sub:'The prisoners forget which flavor they once were'},
    {title:'The Ice Warden Arrives',sub:'It guards the cells by orders it never questions'},
    {title:'Warm Threads Melt the Seal',sub:'Flavorbound memories crack the prison walls'},
    {title:'The Ice Cream Golem Stands',sub:'All the fuel is gathered into the final warden'}
  ],
  [
    {title:'Stairway to the Bitter Crown',sub:'Every path from below the kitchen meets at the highest oven'},
    {title:'A Banquet Without Flavor',sub:'Every dish is just a shape — Hunger has eaten the meaning'},
    {title:'The Banquet Executioner Seals the Door',sub:'It raises all six kitchen blades, cutting off escape to the crown oven'},
    {title:'The Shadow Above the Chef',sub:'The voice from the oven calls itself The Great Hunger'},
    {title:'The Bitter Chef Confession',sub:'He is not the origin, but a servant feeding all flavor to Hunger'}
  ],
  [
    {title:'Roots Pierce the Crown Oven',sub:'The golden seed hidden in the core wakes and drags all memory up to the garden'},
    {title:'Fruit That Remembers Its Owner',sub:'Ferment Sprouts grow from returned flavor, but every one calls a single name — Rootmother'},
    {title:'Sporewarden Seals the Canopy',sub:'The orchid mantis raises leaf scythes, letting no one near the crown seed'},
    {title:'All Four Seasons Bloom at Once',sub:'Ferment toxin speeds time — flowers are born, age and die in one breath'},
    {title:'A Mother Voice Below the First Root',sub:'The one who planted the crown seed waits, calling The Great Hunger a lost child'}
  ]
];
const STORY_REACTIONS = {
  momo:["I'll follow the curse's scent myself","These voices don't want to fight... I must hurry","A warden is coming — stay focused, Momo","The source is close — no retreat","End this and take back everyone's flavor"],
  mint:["The air here is wrong — I'll calm it","Something still lives under the curse — I can feel it","The warden isn't evil — we must stop the curse","The pressure rises... make a safe space","I'll protect every memory that remains"],
  cocoa:["If it blocks the way, I'll smash it open","Something ahead is crying for help","A big one's coming — good, I'll get answers","The ground shakes harder — I can still stand","This last punch is for everyone whose flavor was stolen"],
  taro:["This trail loops back to the source — I remember the way","The echoes reveal a hidden path","The warden hides the truth behind the pressure","Every path converges right ahead","I'll trace the curse back to whoever made it"],
  sesame:["The curse mark is spreading — I'll set a ward","These memories can still be reflected back","The warden keeps some oath","The last wall is cracking — ready the seals","My oath won't let the bitterness devour anyone again"]
};
const STAGE_GIMMICKS = [
  {name:'Scent Crystal',emoji:'💚',tex:'item_scent_crystal',color:0x9dff45,desc:'Vacuums EXP within 520 units'},
  {name:'Clean Bubble',emoji:'🫧',tex:'item_clean_bubble',color:0x72e8d1,desc:'Clears slow, heals HP and brief guard'},
  {name:'Chili Overcore',emoji:'🔥',tex:'item_chili_overcore',color:0xff8a5a,desc:'Resets all skill cooldowns and boosts speed'},
  {name:'Frost Bell',emoji:'❄️',tex:'item_frost_bell',color:0x9fe0ff,desc:'Briefly freezes all enemies on the field'},
  {name:'Memory Seed',emoji:'✨',tex:'item_memory_seed',color:0xd59cff,desc:'Heals HP and turns memories into Sugar'},
  {name:'Pure Ferment Drop',emoji:'🌱',tex:'item_ferment_drop',color:0x56e5bd,desc:'Heals HP, clears slow, briefly speeds cooldowns'}
];

/* ภารกิจสุ่มประจำWave Chapter 1 — เปลี่ยนสิ่งที่ผู้เล่นต้องทำโดยไม่เพิ่มภาระระบบฟิสิกส์หนัก */
const WAVE_OBJECTIVES = {
  survive:{emoji:'⏳',name:'Survive the Swarm',desc:'Survive until time runs out'},
  hunt:{emoji:'🎯',name:'Hunt the Threat',desc:'Defeat the marked Elite'},
  purge:{emoji:'💥',name:'Purge the Cursed Cores',desc:'Attack or approach to cleanse the cursed cores'},
  capture:{emoji:'🔷',name:'Capture the Zone',desc:'Stand in the power ring until the meter fills'}
};
const CH1_OBJECTIVE_COLORS=[0x9dff45,0x72e8d1,0xff8a5a,0x9fe0ff,0xd59cff];

const STAGE_SWARM_BEATS = [
  {title:'The Acid Crystal Summons the Nest',sub:'Every ant caste turns to defend the hatchery at once'},
  {title:'Sewage Pressure Bursts',sub:'Swarms from nearby pipes are forced into the same room'},
  {title:'The Furnace Alarm Blares',sub:'The machine releases furnace guards from every belt'},
  {title:'The Cell Seal Breaks',sub:'Wardens and forgotten spirits pour out together'},
  {title:'The Call of Hunger',sub:'Servants from every kitchen floor answer the bitter crown'},
  {title:'The Canopy Blooms Off-Season',sub:'Roots, toxic plants and memory fragments wake across the ferment garden'}
];

/* ---- CHAPTERS: แต่ละบทชี้ช่วง global stage index ของตน ---- */
const CHAPTERS = [
  { name:'Chapter 1 · Rise from Below', emoji:'🐜', desc:'Sour Ant Nest → Bitter Crown Oven', ready:true, stages:[0,4] },
  { name:'Chapter 2 · The Ferment Garden', emoji:'🌿', desc:'The crown seed carries memory up to a canopy blooming out of season', ready:true, stages:[5,5] },
  { name:'Chapter 3 · The Flavorless Factory', emoji:'🏭', desc:'A machine army is erasing flavor from the world', ready:false },
  { name:'Chapter 4 · The Shattered Sugar City', emoji:'🏰', desc:'A civil war of the candy kingdom', ready:false },
  { name:'Chapter 5 · Throne of the First Seed', emoji:'🌑', desc:'Face the crown planter and the origin of the hunger cycle', ready:false },
];

const ACHIEVEMENTS=[
  {id:'first',emoji:'⚔️',name:'First Taste of Victory',desc:'Defeat your first enemy',reward:30,test:d=>Object.values(d.bestiary||{}).reduce((a,b)=>a+b,0)>=1},
  {id:'hunter',emoji:'☠️',name:'Thousand-Flavor Hunter',desc:'Defeat 1,000 enemies total',reward:180,test:d=>Object.values(d.bestiary||{}).reduce((a,b)=>a+b,0)>=1000},
  {id:'stage1',emoji:'🐜',name:'Sour Nest Conqueror',desc:'Clear Stage 1 for the first time',reward:60,test:d=>!!(d.stageMastery||{})[0]},
  {id:'hunger',emoji:'🌑',name:'Hunger Ender',desc:'Defeat The Great Hunger',reward:300,test:d=>!!(d.stageMastery||{})[4]},
  {id:'master',emoji:'🏆',name:'Lord of the Under-Kitchen',desc:'Mastery on all 5 stages',reward:250,test:d=>[0,1,2,3,4].every(i=>(d.stageMastery||{})[i])},
  {id:'hell',emoji:'🔥',name:'Hell Survivor',desc:'Clear any stage on Hell',reward:220,test:d=>(d.diffBest||[]).some(v=>v>=3)},
  {id:'collector',emoji:'💎',name:'Charm Collector',desc:'Collect at least 12 items',reward:160,test:d=>(d.ownedGear||[]).length>=12},
  {id:'family',emoji:'🍡',name:'The Mochi Core Family',desc:'Unlock all 5 fighters',reward:220,test:d=>(d.chars||[]).length>=5},
  {id:'bond',emoji:'⭐',name:'Eternal Weave',desc:'Weave up to Rank 1',reward:200,test:d=>(d.rank||0)>=1},
];

class Game extends Phaser.Scene {
  constructor(){ super('Game'); }

  create(){
    this.renderDPR=RENDER_DPR;
    this.W=this.scale.width/RENDER_DPR; this.H=this.scale.height/RENDER_DPR; // layout เป็น CSS px; canvas เป็น physical px
    this.computeViewZoom();                                // zoom ปรับตามความกว้างจอ → มือถือ/แท็บเล็ตเห็นสนามพอ ๆ กัน
    this.state='menu'; this.elapsed=0; this.kills=0; this.stageKills=0;
    this.level=1; this.xp=0; this.xpNext=10;
    Save.load(); this.comboFlags={}; this.combosOwned={}; this.sugarStage=0; this.sugarRun=0;
    if(!Save._cloudReady&&Save.syncCloud){ Save.syncCloud().then(()=>{ if(Save._cloudAdopted&&this.state==='menu'){ this.buildMenuScreen&&this.buildMenuScreen(); if(this.showBanner)this.showBanner('☁️ Cloud sync','Loaded your latest progress from the cloud',1600); } }); }   // ซิงค์เซฟกับ Supabase (กันเซฟหาย)
    // ในแอป: หลังLockedอิน Google เด้งกลับผ่าน deep link → ซิงค์ + Updatesหน้าSettings + แจ้งผล
    if(typeof Cloud!=='undefined'){ Cloud._onLogin=()=>{ Save._cloudReady=false; if(Save.syncCloud)Save.syncCloud(); this._acctChecked=false; if(this.menuToast)this.menuToast('✅ Signed in with Google','#8bd3a0'); if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); }; if(Cloud.bindDeepLink)Cloud.ensureClient&&Cloud.ensureClient(); }

    this.cameras.main.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    this.physics.world.setBounds(-WORLD/2,-WORLD/2,WORLD,WORLD);
    // พื้นหลังโซนครัว (รูปจริง) — เลเยอร์ใต้สุด + กริดเส้นจาง ๆ ทับไว้เป็นจุดอ้างอิงการเคลื่อนที่
    this.bgTile=this.camWorld(this.add.tileSprite(0,0,WORLD,WORLD,'bg1').setOrigin(0.5).setDepth(-100002).setAlpha(1));
    this.bgTile.tileScaleX=this.bgTile.tileScaleY=1.12;     // ลดการขยาย texture ที่ทำให้พื้นหลังดูเบลอ
    this.gridBg=this.add.grid(0,0,WORLD,WORLD,80,80,COLORS.bg1,0,COLORS.grid,0.10).setDepth(-100000);   // เส้นกริดจางลง (พื้นสวยแล้ว)
    // faux-2.5D: เลเยอร์เงาใต้ตัว (วาดใหม่ทุกเฟรม) + จัดลำดับความลึกตามแกน Y
    this.iso=true;   // สวิตช์เปิด/ปิดโหมด 2.5D เบา ๆ
    this.shadowG=this.add.graphics().setDepth(-99000);
    // vignette ขอบจอมืดนุ่ม เพิ่มมิติ (ติดกล้อง)
    this.vig=this.add.image(this.W/2,this.H/2,'vignette').setScrollFactor(1).setDepth(40).setDisplaySize(this.W,this.H);
    // ขอบจอสีแดงเต้นเป็นจังหวะตอนเลือดวิกฤต (near-death tension) — โชว์เฉพาะตอน HP ต่ำ
    this.lowHpVig=this.add.image(this.W/2,this.H/2,'vignette').setScrollFactor(1).setDepth(41).setDisplaySize(this.W,this.H).setTint(0xff2b3a).setAlpha(0).setVisible(false);
    this._hbAcc=0;this._lowHpOn=false;

    // soft glow aura ใต้ตัวละคร (UX polish)
    this.aura=this.add.circle(0,0,32,COLORS.mochiEdge,0.14).setDepth(-90000);
    this.tweens.add({targets:this.aura,scale:{from:0.9,to:1.15},alpha:{from:0.14,to:0.05},duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});

    this.player=this.physics.add.sprite(0,0,'mochi').setDepth(5);
    this.player.setCircle(24,6,6); this.player.setCollideWorldBounds(true);
    this.player.hp=90; this.player.maxhp=90; this.player.baseSpeed=BALANCE.moveSpeed;
    this.player.iframe=0; this.player.pickup=105; this.player.dmgMul=0.90; this.player.wardGuardT=0;
    this.cameras.main.startFollow(this.player,false,0.2,0.2);  // roundPixels=false → กล้องเลื่อนลื่น ไม่กระตุกเป็นขั้น
    this._sqX=1; this._sqY=1;   // เจลลี่โมจิ: สเกลกระแทก (squash&stretch) ค่อย ๆ คืนสู่ 1 ทุกเฟรม + วอกแวกเบา ๆ

    this.enemies=this.physics.add.group({maxSize:600});
    this.bullets=this.physics.add.group({maxSize:500});
    this.orbs   =this.physics.add.group({maxSize:800});
    this.foeBullets=this.physics.add.group({maxSize:300});   // กระสุนศัตรู/บอส
    this.heals =this.physics.add.group({maxSize:60});        // ไอเทมฟื้นฟู HP
    this.crates=this.physics.add.group({maxSize:40});        // กล่อง/โหลทุบได้ (ธีมครัว)
    this.chests=this.physics.add.group({maxSize:6});         // หีบสกิลสำWaitงสำหรับกิจกรรม/ดWaitปในด่าน
    this.vacs  =this.physics.add.group({maxSize:8});         // ไอเทมMagnet (ดูดออร์บทั้งจอ)
    this.loots =this.physics.add.group({maxSize:12});        // ของสวมใส่ดWaitปในStage (low tier)
    this.gimmicks=this.physics.add.group({maxSize:20});       // ไอเทมกิมมิคประจำStage เก็บไว้ใช้ทีหลังได้
    this.portals=this.physics.add.group({maxSize:1});
    this.bossObjects=this.physics.add.group({maxSize:28});  // ไข่/ผลึก/จอมปลวกในศึกบอส ทำลายได้           // ประตูไปด่านถัดไป — ผู้เล่นต้องเดินเข้าเอง
    this.waveNodes=this.physics.add.group({maxSize:8});     // แกนคำสาปของภารกิจWave (แยกจากวัตถุบอส)
    this.decoProps=this.add.group();                         // props ประดับ (เดินทะลุได้)
    this.solidProps=this.physics.add.staticGroup();          // props แลนด์มาร์ก (ชนได้)

    this.ringBalls=[];this.starGuardFields=[];
    this.physics.add.collider(this.player,this.solidProps);
    this.physics.add.collider(this.enemies,this.solidProps);
    this.physics.add.collider(this.player,this.bossObjects);
    this.physics.add.collider(this.enemies,this.bossObjects);
    this.physics.add.overlap(this.bullets,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.bullets,this.bossObjects,this.hitBossObject,null,this);
    this.physics.add.overlap(this.bullets,this.waveNodes,this.hitWaveNode,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.touchEnemy,null,this);
    this.physics.add.overlap(this.player,this.orbs,this.collectOrb,null,this);
    this.physics.add.overlap(this.player,this.foeBullets,this.hitByFoe,null,this);
    this.physics.add.overlap(this.player,this.heals,this.collectHeal,null,this);
    this.physics.add.overlap(this.bullets,this.crates,this.hitCrate,null,this);
    this.physics.add.overlap(this.player,this.chests,this.collectChest,null,this);
    this.physics.add.overlap(this.player,this.vacs,this.collectVac,null,this);
    this.physics.add.overlap(this.player,this.loots,this.collectLoot,null,this);
    this.physics.add.overlap(this.player,this.gimmicks,this.collectStageGimmick,null,this);
    this.physics.add.overlap(this.player,this.portals,this.enterPortal,null,this);

    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';  // ตัวละครที่เลือก (จาก Save)
    this.skills={};                        // legacy loadout (ตัวต้นแบบ Basic Attack จะมีเพียงอาวุธประจำตัว)
    this.basicAttack=null;
    this.passives={};                      // passive skills owned {key:level}   (≤ PASSIVE_CAP)
    this.skillCd={}; for(const k in SKILLDEFS) this.skillCd[k]=0;
    this.whirlAng=0;

    this.dashTime=0; this.dashReady=true; this.dashCd=0; this.uniqueCd=0; this.uniqueLevel=1;
    this.moveDir=new Phaser.Math.Vector2(0,-1);

    this.input.addPointer(2);
    this.joy={active:false,id:-1,bx:0,by:0,dx:0,dy:0};
    this.lvlCards=[]; this.dmgPool=[]; this.tapZones=[]; this.menuScreen='hub';

    this.buildHUD(); this.buildMenus(); this.showMenu();
    this.setupCameras();
    this.setupParticles();
    this.setupInput();
    this.scale.on('resize',this.onResize,this);
  }

  /* ---------- PARTICLE EMITTERS (native, reused) ----------
     สร้าง emitter ถาวรไม่กี่ตัว แล้วสั่ง burst ที่พิกัดไหนก็ได้ด้วย emitParticleAt
     → reuse ตัวเดียวทุกครั้ง (ไม่สร้าง GameObject ใหม่ต่อการตาย/ตี) + วาด batch เดียว = ลื่นบนมือถือ
     ทุกตัว emitting:false (นิ่งจนกว่าจะสั่ง) และ camWorld (ให้กล้อง UI ข้าม) */
  setupParticles(){
    const add=(tex,cfg,depth)=>{
      if(!this.textures||!this.textures.exists(tex))return null;
      const em=this.add.particles(0,0,tex,Object.assign({emitting:false},cfg));
      if(em){ em.setDepth(depth); this.camWorld(em); }
      return em;
    };
    // ประกายกระแทก (ตี/เก็บ) — เรืองแสงพุ่งออกแล้วจางหด
    this.pSpark=add('spark',{ speed:{min:40,max:170}, scale:{start:0.55,end:0}, alpha:{start:0.95,end:0},
      lifespan:{min:200,max:360}, blendMode:'ADD', rotate:{min:0,max:360} }, 9);
    // ควันตาย — ก้อนนุ่มขยายแล้วจาง ลอยขึ้นเล็กน้อย
    this.pSmoke=add('vfx_poof',{ speed:{min:12,max:60}, scale:{start:0.28,end:0.95}, alpha:{start:0.7,end:0},
      lifespan:{min:280,max:460}, gravityY:-40, rotate:{min:-40,max:40} }, 7);
    // ฝุ่นดีใจ (เลเวลอัพ/ฉลอง) — เม็ดกลมพุ่งกว้างแล้วร่วง
    this.pDust=add('dot',{ speed:{min:60,max:150}, scale:{start:0.9,end:0}, alpha:{start:1,end:0},
      lifespan:{min:340,max:560}, gravityY:120, blendMode:'ADD' }, 9);
  }
  // burst ผ่าน emitter ที่ reuse ได้ (ตั้งสีก่อนแล้วพ่น) — fallback เงียบถ้า emitter ไม่พร้อม
  _emit(em,x,y,color,n){ if(!em)return false; if(color!=null&&em.setParticleTint)em.setParticleTint(color); em.emitParticleAt(x,y,n); return true; }

  /* กล้อง 2 ตัว: viewport เป็น physical pixels แต่ Game Object/layout ยังเป็น CSS px */
  setupCameras(){
    const fw=this.scale.width, fh=this.scale.height;
    if(this._bossZoom==null)this._bossZoom=1;
    this.cameras.main.setZoom(this.viewZoom*RENDER_DPR*this._bossZoom);
    // camera zoom ชดเชย backing canvas ที่ใหญ่ขึ้นตาม DPR
    this.uiCam=this.cameras.add(0,0,fw,fh);
    this.uiCam.setZoom(RENDER_DPR);
    this.uiCam.centerOn(this.W/2,this.H/2);
    // แยกสิ่งที่แต่ละกล้องเรนเดอร์
    this._worldObjs=[this.bgTile,this.gridBg,this.shadowG,this.aura,this.player,this.enemies,this.orbs,this.bullets,this.foeBullets,this.heals,this.crates,this.chests,this.vacs,this.loots,this.gimmicks,this.portals,this.bossObjects,this.waveNodes];
    this.uiCam.ignore(this._worldObjs);
    const ui=[this.vig,this.lowHpVig,this.bannerT,this.bannerS,this.muteBtn,this.muteTxt,this.pauseBtn,this.pauseTxt,this.pauseUI,this.fpsTxt,this.menu,this.lvlUp,this.storyLayer,this.over,this.joyBase,this.joyKnob]
      .concat(this.hudList||[],this.bossUI||[]).filter(Boolean);
    this.cameras.main.ignore(ui);
    if(this.skillBar)this.camUI(this.skillBar);
  }
  camWorld(o){ if(this.uiCam)this.uiCam.ignore(o); return o; }   // FX ของโลก: ให้ ui กล้องข้าม
  camUI(o){ if(this.cameras&&this.cameras.main)this.cameras.main.ignore(o); return o; }  // UI: ให้กล้องโลกข้าม

  /* ---------- INPUT ---------- */
  setupInput(){
    this.input.on('pointerdown',(p)=>{
      Sfx.unlock();
      if(this._adBusy)return;   // กำลังเล่นโฆษณา = บLockedอินพุตอื่น
      p={x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id};
      // mute toggle (มุมขวาบน)
      if(this.muteBtn && this.dist(p.x,p.y,this.muteBtn.x,this.muteBtn.y)<28){
        const m=Sfx.toggle(); this.muteTxt.setText(m?'🔇':'🔊'); return; }
      // pause button (เฉพาะตอนเล่น/พัก)
      if(this.pauseBtn && this.pauseBtn.visible && (this.state==='play'||this.state==='paused') && this.dist(p.x,p.y,this.pauseBtn.x,this.pauseBtn.y)<28){
        this.togglePause(); return; }
      if(this.speedBtn && this.speedBtn.visible && this.state==='play' && this.dist(p.x,p.y,this.speedBtn.x,this.speedBtn.y)<28){
        this.setGameSpeed((this.gameSpeed||1)>=3?1:(this.gameSpeed||1)+1); Sfx.select(); return; }
      if(this.state==='paused'){ // แตะปุ่มในเมนูหยุด
        for(const z of (this._pauseBtns||[])){ if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){ Sfx.select(); z.fn(); return; } }
        return; }
      if(this.state==='menu'){ this.handleTap(p.x,p.y); return; }
      if(this.state==='tutorial'){this.advanceTutorial();return;}
      if(this.state==='dead'){for(const z of (this._overBtns||[])){if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){Sfx.select();z.fn();return;}}return;}
      if(this.state==='win'){ this.scene.restart(); return; }
      if(this.state==='summary'){ for(const z of (this._summaryBtns||[])){ if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){ Sfx.select(); z.fn(); return; } } Sfx.select(); this.continueFromSummary(); return; }
      if(this.state==='rewardChoice'){for(const z of (this._rewardBtns||[])){if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){Sfx.select();z.fn();return;}}return;}
      if(this.state==='cinematic'&&this._finishStoryCutscene){ this._finishStoryCutscene(); return; }
      if(this.state==='startskill'){ this.pickStartingSkillAt(p.x,p.y); return; }
      if(this.state==='levelup'){ this.pickCardAt(p.x,p.y); return; }
      if(this.state!=='play') return;

      if(this.uniqueBtn && this.uniqueBtn.visible && this.dist(p.x,p.y,this.uniqueBtn.x,this.uniqueBtn.y)<44){ this.useCharacterSkill(); return; }
      // กดปุ่ม Dash เฉพาะในขอบเขตปุ่ม (มุมขวาล่าง)
      if(this.dashBtn && this.dashBtn.visible && this.dist(p.x,p.y,this.dashBtn.x,this.dashBtn.y)<44){ this.doDash(); return; }

      // แตะจุดอื่นทั้งหมดบนหน้าจอ = จอยสติ๊กลอย ควบคุมทิศทางเดินอิสระด้วยมือเดียว
      this.joy.active=true; this.joy.id=p.id; this.joy.bx=p.x; this.joy.by=p.y; this.joy.dx=0; this.joy.dy=0;
      this.joyBase.setPosition(p.x,p.y).setVisible(true);
      this.joyKnob.setPosition(p.x,p.y).setVisible(true);
    });
    this.input.on('pointermove',(p)=>{
      if(!this.joy.active||p.id!==this.joy.id) return;
      p={x:p.x/RENDER_DPR,y:p.y/RENDER_DPR,id:p.id};
      let dx=p.x-this.joy.bx, dy=p.y-this.joy.by; const len=Math.hypot(dx,dy), max=60;
      if(len>max){ dx=dx/len*max; dy=dy/len*max; }
      this.joy.dx=dx/max; this.joy.dy=dy/max; this.joyKnob.setPosition(this.joy.bx+dx,this.joy.by+dy);
    });
    this.input.on('pointerup',(p)=>{
      if(p.id===this.joy.id){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0;
        this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
    });
  }
  dist(ax,ay,bx,by){ return Math.hypot(ax-bx,ay-by); }

  doDash(){
    if(!this.dashReady||this.state!=='play') return;
    this.dashReady=false; this.dashCd=1.1; this.dashTime=0.16; this._coachDash=(this._coachDash||0)+1;
    const d=this.moveDir.clone().normalize();
    this.dashTime=0.2;
    this.player.setVelocity(d.x*560,d.y*560);
    this.player.iframe=Math.max(this.player.iframe,0.28);
    Sfx.dash();
    this.flashBtn(this.dashBtn);
    this.player.setTint(0xfff6bd);
    this.time.delayedCall(160,()=>this.player.clearTint());
    this._sqX=1.35; this._sqY=0.7;   // ยืดตอนพุ่ง (เจลลี่)
  }

  uniqueInfo(){ const c=CHARACTERS[this.character]||CHARACTERS.momo; return CHARACTER_UNIQUES[c.unique]||CHARACTER_UNIQUES.berryRebound; }
  uniqueCooldown(u){const lv=this.uniqueLevel||1;return u.cd*Math.max(0.80,1-(lv-1)*0.055)*(this.player.cdMul||1);}
  uniquePower(){return 1+((this.uniqueLevel||1)-1)*0.24;}
  refreshUniqueSkillUI(){ const u=this.uniqueInfo(); if(!this.uniqueTxt)return; this.uniqueTxt.setText(u.emoji); this.uniqueBtn.setFillStyle(u.color,0.24).setStrokeStyle(2.5,u.color,0.9); }
  uniqueCrescendo(color,lv,radius){
    const x=this.player.x,y=this.player.y,rings=lv,base=Math.max(110,radius*0.62);
    for(let i=0;i<rings;i++)this.time.delayedCall(i*70,()=>{
      if(this.state!=='play'&&this.state!=='levelup')return;
      const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(i%2?0xfff0a6:color).setDepth(7+i).setScale(0.16).setAlpha(Math.max(0.34,0.82-i*0.11)));
      this.tweens.add({targets:ring,scale:(base*(1+i*0.18)*2)/256,rotation:(i%2?1:-1)*(0.35+lv*0.08),alpha:0,duration:360+i*90,ease:'Quad.out',onComplete:()=>ring.destroy()});
    });
    for(let i=0;i<lv*3;i++){const a=i/(lv*3)*Math.PI*2,p=this.camWorld(this.add.circle(x,y,2+lv,color,0.82).setDepth(9));this.tweens.add({targets:p,x:x+Math.cos(a)*base*(0.62+lv*0.10),y:y+Math.sin(a)*base*(0.62+lv*0.10),scale:0.2,alpha:0,duration:300+lv*75,onComplete:()=>p.destroy()});}
    if(lv>=4&&this.anims.exists('fx_bossnova'))this.spawnFxAnim('fx_bossnova',x,y,{scale:(radius*2)/ASSET_FX.fx_bossnova.fw,depth:8,alpha:0.86});
    this.screenFlash(color,0.07+lv*0.035,170+lv*55);this.screenShake(80+lv*45,0.002+lv*0.0015);
  }
  useCharacterSkill(){
    if(this.state!=='play'||this.uniqueCd>0)return;
    const c=CHARACTERS[this.character]||CHARACTERS.momo,u=this.uniqueInfo(),ul=this.uniqueLevel||1,up=this.uniquePower(),dm=this.player.dmgMul||1;
    this.uniqueCd=this.uniqueCooldown(u);this.flashBtn(this.uniqueBtn);this.poseFlash(CF.cast,520);this._coachUnique=(this._coachUnique||0)+1;
    const spectacleRadius=c.unique==='mintSanctuary'?120+(ul-1)*28:c.unique==='voidPull'?200+(ul-1)*22:c.unique==='flickerStrike'?100+(ul-1)*10:c.unique==='oathMirror'?180+(ul-1)*18:c.unique==='jamOverdrive'?170+(ul-1)*20:155+(ul-1)*18;
    this.uniqueCrescendo(u.color,ul,spectacleRadius);
    if(c.unique==='berryRebound'){
      // Momo: เมล็ดสตWaitว์เบอร์รี "Dash-bounce" ไปหาศัตรูตัวใกล้ ๆ อย่างรวดเร็ว (ไม่ใช่สายฟ้าแบบทาโร่)
      // ใช้ homing (โค้งเข้าหาเป้า) + bounce (โดนแล้วเด้งไปตัวถัดที่ใกล้สุด) แทน chain lightning
      const shots=12+(ul-1)*2+(this.player.twinSprinkle?4:0), bounce=ul>=4?3:ul>=3?2:1;
      for(let i=0;i<shots;i++){const a=i/shots*Math.PI*2,b=this.getBullet(this.player.x,this.player.y,0xffffff,0.28+ul*0.012);if(!b)continue;b.setTexture('proj_sprinkle').setTint(i%2?0xffd166:0xff76a8);b.dmg=(14+ul*2)*dm*up;b.life=1.65+ul*0.08;b.bounce=bounce;b.homing=0;b.faceVel=true;this.physics.velocityFromRotation(a,430+ul*12,b.body.velocity);}
      this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*(0.055+ul*0.018));this.showBanner('🍓 Strawberry Rebound Lv'+ul,shots+' seeds · bounce toward enemies '+bounce+' · heal HP '+Math.round((0.055+ul*0.018)*100)+'%',800);Sfx.shoot();
    }else if(c.unique==='mintSanctuary'){
      this.castDiamondDust(dm,ul);
    }else if(c.unique==='voidPull'){
      this.castVoidPull(dm,ul);
    }else if(c.unique==='flickerStrike'){
      this.castFlickerStrike(dm,ul);
    }else if(c.unique==='pathRecall'){
      this.castPathRecall(dm,ul);
    }else if(c.unique==='jamOverdrive'){
      this.castJamOverdrive(dm,ul);
    }else{
      this.castOathWard(dm,ul);
    }
  }

  // ❄️ Mint Unique — Diamond Dust: พายุหิมะถล่มพื้นที่ ตามตัวผู้เล่น ฟาดซ้ำ ๆ + แช่ฝูง + คุ้มกันช่วงสั้น
  castDiamondDust(dm,ul){
    ul=ul||1;const up=this.uniquePower();
    const r=150+(ul-1)*26+(this.player.deepFreeze?30:0),dur=2.2+ul*0.35;
    this.player.iframe=Math.max(this.player.iframe,0.6+ul*0.18);
    const field=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_magic_circle').setTint(0x9fd8ff).setDepth(3).setDisplaySize(r*2,r*2).setAlpha(0.28));
    this.tweens.add({targets:field,rotation:Math.PI,alpha:{from:0.14,to:0.30},yoyo:true,repeat:-1,duration:600,ease:'Sine.inOut'});
    const storm=this.time.addEvent({delay:300,loop:true,callback:()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const cx=this.player.x,cy=this.player.y;field.setPosition(cx,cy);
      for(let i=0;i<4+ul;i++){const a=Math.random()*TAU,rr=Math.random()*r,ix=cx+Math.cos(a)*rr,iy=cy+Math.sin(a)*rr;
        const ic=this.camWorld(this.add.image(ix,iy-42,'proj_sprinkle').setTint(0x9fe8ff).setDepth(9).setScale(0.42,0.95).setAlpha(0.9));
        this.tweens.add({targets:ic,y:iy,alpha:0,duration:220,onComplete:()=>ic.destroy()});}
      const dmg=(10+ul*3.2)*dm*up;
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r){this.damage(e,(e.isBoss||e.isMini)?dmg*0.6:dmg,e.x,e.y);if(!e.isBoss&&!e.isMini){e.frozen=Math.max(e.frozen||0,0.7+ul*0.12);e.setVelocity(e.body.velocity.x*0.3,e.body.velocity.y*0.3);e.setTint(COLORS.ice);}}});
      this.hitCratesInRadius(cx,cy,r,dmg);Sfx.frost();
    }});
    this.time.delayedCall(dur*1000,()=>{storm.remove(false);this.tweens.killTweensOf(field);if(field.active)this.tweens.add({targets:field,alpha:0,duration:200,onComplete:()=>field.destroy()});});
    this.showBanner('❄️ Diamond Dust Lv'+ul,'Ice shard rain '+dur.toFixed(1)+'s · radius '+r+' · freeze crowd + guard',950);Sfx.frost();
  }
  // ⚡ โกโก้ Unique — Flicker Strike: วาร์ปไปฟันศัตรูรัว ๆ ต่อเนื่อง (สายคอมโบประชิด) Invincibleช่วงคอมโบ · คูลดาวน์เร็ว
  blinkTo(x,y){ const lim=WORLD/2-40; x=Phaser.Math.Clamp(x,-lim,lim); y=Phaser.Math.Clamp(y,-lim,lim);
    if(this.textures.exists(this.player.texture.key)){ const g=this.camWorld(this.add.image(this.player.x,this.player.y,this.player.texture.key,this.player.frame&&this.player.frame.name).setDepth((this.player.y||0)-1).setAlpha(0.55).setTintFill(0x9f6bff).setScale(this.player.scaleX,this.player.scaleY).setFlipX(this.player.flipX)); this.tweens.add({targets:g,alpha:0,duration:220,onComplete:()=>g.destroy()}); }
    this.player.setPosition(x,y); if(this.player.body)this.player.setVelocity(0,0); }
  castFlickerStrike(dm,ul){
    ul=ul||1; const up=this.uniquePower();
    const hits=5+ul*2, dmg=(14+ul*5)*dm*up, radius=(70+ul*7)*(this.player.donutImpact?1.15:1), gap=82;
    this.player.iframe=Math.max(this.player.iframe||0,0.25+hits*gap/1000+0.2);   // Invincibleตลอดคอมโบ (แบบ Flicker Strike)
    const hitSet=new Set();
    const strike=(k)=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      let t=null,bd=1e18; this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2, pen=hitSet.has(e)?360*360:0; if(d+pen<bd){bd=d+pen;t=e;} });
      if(!t){ const a=(this.moveDir&&this.moveDir.lengthSq()>0.04)?this.moveDir.angle():Math.random()*TAU; this.blinkTo(this.player.x+Math.cos(a)*130,this.player.y+Math.sin(a)*130); Sfx.dash&&Sfx.dash(); return; }
      const a=Math.atan2(this.player.y-t.y,this.player.x-t.x); this.blinkTo(t.x+Math.cos(a)*34,t.y+Math.sin(a)*34);
      this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,t.x,t.y)<radius){ this.damage(e,dmg,e.x,e.y); if(!e.isBoss&&!e.isMini){ const ka=Math.atan2(e.y-t.y,e.x-t.x); e.setVelocity(Math.cos(ka)*(150+ul*20),Math.sin(ka)*(150+ul*20)); e.knock=0.1; } } });
      this.hitCratesInRadius(t.x,t.y,radius,dmg); hitSet.add(t);
      if(this.textures.exists('fx_flickerstrike')&&this.anims.exists('fx_flickerstrike')){ this.spawnFxAnim('fx_flickerstrike',t.x,t.y,{scale:(radius*2.1)/256,rotation:a+Math.PI/4+Phaser.Math.FloatBetween(-0.3,0.3),depth:9,alpha:0.95}); }
      else this.vfxHitRing(t.x,t.y,0x9f6bff,false);
      this.burst(t.x,t.y,0xb98bff); this.poseFlash(CF.cast,140); this.hitStop(20);
      if(ul>=4)this.player.hp=Math.min(this.player.maxhp,this.player.hp+Math.max(1,this.player.maxhp*0.01));   // Lv4: ฟื้น HP ต่อครั้ง
      Sfx.dash&&Sfx.dash(); };
    for(let k=0;k<hits;k++)this.time.delayedCall(k*gap,()=>strike(k));
    this.time.delayedCall(hits*gap+120,()=>{ if(this.state==='play'||this.state==='levelup')this.screenShake(200,0.007); });
    this.showBanner('⚡ Flicker Strike Lv'+ul,'Warp-strike '+hits+' hits · invulnerable during combo',900);Sfx.clear&&Sfx.clear();
  }
  // Berry Core: ป้อมยิงเคลื่อนที่ — Lockedเป้าใกล้สุดแล้วยิงเป็นชุด ไม่ซ้ำกับเมล็ดWaitบทิศแบบ Momo
  castJamOverdrive(dm,ul){
    ul=ul||1;const boosted=!!this.player.pressurizedJam,up=this.uniquePower();
    const salvos=4+ul+(boosted?2:0),barrels=1+(ul>=2?1:0)+(ul>=4?1:0)+(boosted?1:0),gap=Math.max(145,285-ul*25);
    const petals=[];for(let i=0;i<Math.min(5,barrels+1);i++){const a=i*TAU/Math.min(5,barrels+1),p=this.camWorld(this.add.circle(this.player.x+Math.cos(a)*48,this.player.y+Math.sin(a)*34,7,i%2?0xffd166:0xff5f88,0.92).setStrokeStyle(2,0xffffff,0.75).setDepth(8));p._a=a;petals.push(p);}
    let fired=0;const fire=()=>{
      if(this.state!=='play'&&this.state!=='levelup')return;fired++;
      const targets=[];this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<820)targets.push(e);});targets.sort((a,b)=>this.dist(a.x,a.y,this.player.x,this.player.y)-this.dist(b.x,b.y,this.player.x,this.player.y));
      for(let s=0;s<barrels;s++){const t=targets[s%Math.max(1,targets.length)];if(!t)continue;const ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+(s-(barrels-1)/2)*0.10,b=this.getBullet(this.player.x,this.player.y-4,0xffffff,0.19+ul*0.012);if(!b)continue;b.setTexture('proj_sprinkle').setTint(s%2?0xffd166:0xff5f88);b.faceVel=true;b.dmg=(9+ul*3.2)*dm*up;b.life=1.7;b.homing=380+ul*45;b.pierce=ul>=3;b.hitGapV=0.13;this.physics.velocityFromRotation(ang,650+ul*30,b.body.velocity);}
      petals.forEach((p,i)=>{if(!p.active)return;const a=p._a+fired*0.55;p.setPosition(this.player.x+Math.cos(a)*48,this.player.y+Math.sin(a)*34);});this.vfxHitRing(this.player.x,this.player.y,0xff5f88,false);Sfx.shoot();
    };
    fire();this.time.addEvent({delay:gap,repeat:salvos-2,callback:fire});
    this.time.delayedCall((salvos-1)*gap+420,()=>petals.forEach(p=>{if(!p.active)return;this.tweens.add({targets:p,scale:0.1,alpha:0,duration:180,onComplete:()=>p.destroy()});}));
    this.showBanner('💗 Jam Overdrive Lv'+ul,barrels+' barrels · '+salvos+' salvos · auto lock-on',950);Sfx.clear();
  }

  // Taro: สายฟ้า Arc — ยิงจากตัวไปเป้าใกล้สุด แล้วชิ่งลามไปศัตรูตัวถัด ๆ ไป (คล้าย Arc ใน PoE)
  castPathRecall(dm,ul){
    ul=ul||1;const upgraded=!!this.player.echoPath;
    const jumps=4+ul+(upgraded?2:0), jumpRange=250+ul*16+(upgraded?40:0), forks=ul>=3?2:1;
    // ลดพลังช่วงต้น (Lv1 เคยขี้โกง) แต่โตชันขึ้นให้ปลายเกมยังสะใจ
    const dmg=(9+ul*7)*dm*(1+(ul-1)*0.22), color=0xd7b8ff;
    // หาเป้าเริ่มต้นที่ใกล้ตัวผู้เล่นสุด
    const first=this.nearestEnemy(760);
    if(!first){ // Noneเป้า → ปล่อยประจุWaitบตัวสั้น ๆ กันเสียเทิร์นฟรี
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<220)this.damage(e,dmg,e.x,e.y);});
      this.vfxHitRing(this.player.x,this.player.y,color,true);
    }else{
      const hit=new Set();
      // แต่ละ "fork" = สายฟ้าหนึ่งสายที่ชิ่งต่อกันเป็นลูกโซ่
      for(let f=0;f<forks;f++){
        this.time.delayedCall(f*90,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
          let from={x:this.player.x,y:this.player.y}, cur=(f===0?first:null);
          if(!cur){ // สายเสริม: เริ่มจากเป้าอื่นที่ยังไม่โดน
            let best=null,bd=1e9;this.enemies.children.iterate(e=>{if(e&&e.active&&!hit.has(e)){const d=this.dist(e.x,e.y,this.player.x,this.player.y);if(d<760&&d<bd){bd=d;best=e;}}});cur=best;
          }
          for(let j=0;j<jumps&&cur;j++){
            this.chainBolt(from.x,from.y,cur.x,cur.y);
            this.damage(cur,dmg*(1-j*0.045),cur.x,cur.y);
            this.vfxHitRing(cur.x,cur.y,color,false);
            hit.add(cur);from={x:cur.x,y:cur.y};
            // หาเป้าถัดไปที่ยังไม่โดน อยู่ในระยะกระโดด
            let nb=null,nd=jumpRange*jumpRange;
            this.enemies.children.iterate(o=>{if(o&&o.active&&!hit.has(o)){const d=(o.x-from.x)**2+(o.y-from.y)**2;if(d<nd){nd=d;nb=o;}}});
            cur=nb;
          }
          Sfx.zap();
        });
      }
    }
    this.dashReady=true;this.dashCd=0;this.pathHasteT=1.0+ul*0.38+(upgraded?0.55:0);this.player.iframe=Math.max(this.player.iframe,0.32+ul*0.06);
    this.showBanner('⚡ Chain Bolt Lv'+ul,'Chains up to '+(jumps*forks)+' · power '+Math.round(dmg)+' · Dash ready',950);Sfx.zap();
  }

  // Cocoa: หลุมดำช็อกโกแลต — ดูดฝูงศัตรูเข้าหาตัวผู้เล่น ทำดาเมจต่อเนื่อง แล้วยุบระเบิดปิดท้าย
  castVoidPull(dm,ul){
    ul=ul||1;const up=this.uniquePower();
    // อ่อนช่วงแรก โตชันตามเลเวล (Lv1 เคยเก่งเกิน)
    const r=150+ul*30, duration=1.2+ul*0.55, pullLerp=0.09+ul*0.045, tickDmg=(3+ul*4)*dm*up;
    // ออร่าม่วงล้วน (เอารูปอึออก) — วงแกนดำม่วง + วงรัศมีเรือง + อนุภาคหมุนวน
    const core=this.camWorld(this.add.circle(this.player.x,this.player.y,44,0x2a0f3a,0.8).setDepth(6).setStrokeStyle(3,0x8b5cf0,0.9));
    const ring=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_ring').setTint(0x8b5cf0).setDepth(5).setDisplaySize(r*2,r*2).setAlpha(0.34));
    this.tweens.add({targets:ring,alpha:{from:0.20,to:0.42},yoyo:true,repeat:-1,duration:400,ease:'Sine.inOut'});
    this.tweens.add({targets:core,scale:{from:0.9,to:1.15},yoyo:true,repeat:-1,duration:360,ease:'Sine.inOut'});
    let tick=0;
    const pull=this.time.addEvent({delay:70,loop:true,callback:()=>{
      const cx=this.player.x,cy=this.player.y; if(core.active)core.setPosition(cx,cy); if(ring.active)ring.setPosition(cx,cy);
      tick++;
      this.enemies.children.iterate(e=>{if(!e||!e.active)return;const d=this.dist(e.x,e.y,cx,cy);if(d>r)return;
        if(!e.isBoss&&!e.isMini&&d>26){ // ดูดจริง: ลาก "Position" เข้าหาศูนย์กลาง (ทับ AI เดินตาม เห็นชัดว่าถูกดูด)
          e.setPosition(e.x+(cx-e.x)*pullLerp, e.y+(cy-e.y)*pullLerp); if(e.body)e.setVelocity(0,0);
          if(tick%3===0){const p=this.camWorld(this.add.circle(e.x,e.y,3,0xb98cff,0.8).setDepth(9));this.tweens.add({targets:p,x:cx,y:cy,scale:0.2,alpha:0,duration:220,onComplete:()=>p.destroy()});}
        }
        if(tick%3===0)this.damage(e,tickDmg*((e.isBoss||e.isMini)?0.5:1),e.x,e.y);
      });
    }});
    this.showBanner('🕳️ Dark Chocolate Void Lv'+ul,'Pulls the crowd in '+duration.toFixed(1)+'s · radius '+r,1000);Sfx.ult&&Sfx.ult('vortex');
    this.time.delayedCall(duration*1000,()=>{
      pull.remove(false);this.tweens.killTweensOf(core);this.tweens.killTweensOf(ring);
      if(core.active)this.tweens.add({targets:core,scale:0.1,alpha:0,duration:180,onComplete:()=>core.destroy()});else core.destroy&&core.destroy();
      if(ring.active)ring.destroy();
      if(this.state!=='play'&&this.state!=='levelup')return;
      const cx=this.player.x,cy=this.player.y,finR=r*0.9,finDmg=(16+ul*16)*dm*up;   // ยุบระเบิดปิดท้าย (อ่อนช่วงแรก โตตามเลเวล)
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<finR){this.damage(e,finDmg*((e.isBoss||e.isMini)?0.35:1),e.x,e.y);if(!e.isBoss&&!e.isMini){const a=Math.atan2(e.y-cy,e.x-cx);e.setVelocity(Math.cos(a)*260,Math.sin(a)*260);e.knock=0.2;}}});
      this.vfxHitRing(cx,cy,0x8b5cf0,true);this.burst(cx,cy,0x8b5cf0);this.screenShake(160,0.006);Sfx.boom();
    });
  }
  // 🪞 Sesame Unique — Oath Dome: กางโดมกระจกคำสัตย์ ลดดาเมจหนัก + ลบกระสุนศัตรูทั้งหมดในเขต + พัลส์กระแทกซ้ำ ๆ แล้วปิดท้ายด้วยกระจกแตก (None projectile)
  castOathWard(dm,ul){
    ul=ul||1;const upgraded=!!this.player.mirrorWard;let cx=this.player.x,cy=this.player.y;
    const r=155+ul*15+(upgraded?24:0),duration=3.6+ul*0.55+(upgraded?0.8:0),mirrorCount=4+(ul>=3?1:0)+(upgraded?1:0),up=1+(ul-1)*0.22;
    const ring=this.camWorld(this.add.image(cx,cy,'vfx_magic_circle').setTint(0xf4e7bd).setDepth(4).setDisplaySize(r*2,r*2).setAlpha(0.5));
    this.tweens.add({targets:ring,rotation:Math.PI*0.45,alpha:{from:0.26,to:0.46},yoyo:true,repeat:-1,duration:620,ease:'Sine.inOut'});
    const dome=this.camWorld(this.add.circle(cx,cy,r,0xf4e7bd,0.06).setDepth(3).setStrokeStyle(2.5,0xffe9b0,0.5));
    const mirrors=[];for(let i=0;i<mirrorCount;i++){const a=-Math.PI/2+i*Math.PI*2/mirrorCount,m=this.camWorld(this.add.image(cx+Math.cos(a)*r*0.82,cy+Math.sin(a)*r*0.82,'ic_mirror').setDepth(6).setScale(0.24).setAlpha(0.94));m._a=a;mirrors.push(m);}
    let blocked=0,pulseHits=0,pulseN=0;this.player.wardGuardT=Math.max(this.player.wardGuardT||0,duration);this.player.iframe=Math.max(this.player.iframe,0.5+ul*0.12);
    const pulse=this.time.addEvent({delay:120,loop:true,callback:()=>{if(!ring.active)return;cx=this.player.x;cy=this.player.y;ring.setPosition(cx,cy);dome.setPosition(cx,cy);mirrors.forEach((m,i)=>{const a=m._a+this.elapsed*(0.75+ul*0.08);m.setPosition(cx+Math.cos(a)*r*0.82,cy+Math.sin(a)*r*0.82).setRotation(a+Math.PI/2);});
      // ลบกระสุนศัตรูทุกนัดที่เข้าโดม (ไม่สร้าง projectile สวนกลับ)
      this.foeBullets.children.iterate(f=>{if(!f||!f.active||this.dist(f.x,f.y,cx,cy)>r)return;this.vfxHitRing(f.x,f.y,0xf4e7bd,false);this.killFoe(f);blocked++;});
      pulseN++;if(pulseN%5===0){let hit=0;this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r){this.damage(e,(10+ul*4.5)*dm*up*((e.isBoss||e.isMini)?0.40:1),e.x,e.y);e.knock=Math.max(e.knock||0,0.10);hit++;}});pulseHits+=hit;this.vfxHitRing(cx,cy,0xf4e7bd,false);if(hit)this.burst(cx,cy,0xf4e7bd);}
    }});
    this.showBanner('🪞 Oath Dome Lv'+ul,'Dome up '+duration.toFixed(1)+'s · big damage cut · clears enemy bullets inside',1000);Sfx.zap();
    this.time.delayedCall(duration*1000,()=>{pulse.remove(false);this.tweens.killTweensOf(ring);if(ring.active)ring.destroy();if(dome.active)dome.destroy();mirrors.forEach(m=>{this.tweens.killTweensOf(m);if(m.active)m.destroy();});this.player.wardGuardT=0;
      if(this.state!=='play'&&this.state!=='levelup')return;const finR=r*(1.05+Math.min(pulseHits,30)*0.006),finDmg=(34+blocked*1.4+Math.min(pulseHits,30)*1.0)*dm*up;
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<finR){this.damage(e,finDmg*((e.isBoss||e.isMini)?0.35:1),e.x,e.y);if(!e.isBoss&&!e.isMini){const a=Math.atan2(e.y-cy,e.x-cx);e.setVelocity(Math.cos(a)*240,Math.sin(a)*240);e.knock=0.18;}}});if(ul>=4)this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.10);
      this.vfxHitRing(cx,cy,0xf4e7bd,true);this.screenShake(150,0.005);this.showBanner('🪞 Mirror Shatter','Blocked '+blocked+' · pulse hit '+pulseHits+' · blast '+Math.round(finDmg),900);Sfx.boom();
    });
  }

  flashBtn(b){ if(b)this.tweens.add({targets:b,scale:{from:1.25,to:1},duration:220,ease:'Back.out'}); }

  /* ---------- HUD ---------- */
  buildHUD(){
    const pad=14, w=this.W; this._pad=pad; this._barW=w-2*pad;
    this.joyBase=this.add.circle(0,0,62,0xffffff,0.10).setScrollFactor(1).setDepth(50).setVisible(false).setStrokeStyle(2,0xffffff,0.25);
    this.joyKnob=this.add.circle(0,0,26,0xffffff,0.22).setScrollFactor(1).setDepth(51).setVisible(false);

    // dash button (มุมขวาล่าง) — ปุ่มพุ่งหลบสำหรับเล่นมือเดียว
    const dbX = w - 58, dbY = this.H - 78, dbR = 36;
    this.dashBtn=this.add.circle(dbX,dbY,dbR,COLORS.mint,0.22).setScrollFactor(1).setDepth(50).setStrokeStyle(2.5,COLORS.mint,0.85);
    this.dashTxt=this.add.text(dbX,dbY,'💨\nDash',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#bff3e8',align:'center'}).setOrigin(0.5).setScrollFactor(1).setDepth(51);
    this.dashRing=this.add.graphics().setScrollFactor(1).setDepth(52);
    const ubX=w-58,ubY=this.H-78-80;   // ย้ายปุ่มเฉพาะตัวมาไว้ "North" ปุ่มพุ่ง (เดิมอยู่ซ้ายของพุ่ง)
    this.uniqueBtn=this.add.circle(ubX,ubY,36,0xff76a8,0.22).setScrollFactor(1).setDepth(50).setStrokeStyle(2.5,0xff76a8,0.85);
    this.uniqueTxt=this.add.text(ubX,ubY,'🍓',{fontSize:'26px',align:'center'}).setOrigin(0.5).setScrollFactor(1).setDepth(51);   // ปุ่มเฉพาะตัว = ไอคอนล้วน Noneตัวหนังสือ
    this.uniqueRing=this.add.graphics().setScrollFactor(1).setDepth(52);this.refreshUniqueSkillUI();

    // top bars: HP + XP (โค้งมน วาดด้วย graphics)
    this.barG=this.add.graphics().setScrollFactor(1).setDepth(50);
    this.hpIcon=this.add.text(pad+4,pad+7,'❤️',{fontSize:'12px'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);
    this.xpIcon=this.add.text(pad+4,pad+24,'⭐',{fontSize:'10px'}).setOrigin(0.5).setScrollFactor(1).setDepth(52);

    // แถวข้อมูล 2 บรรทัดใต้หลอด — ซ้าย: Lv/ฆ่า · กลาง: สถานะเวฟ/Stage · ขวาบน: ปุ่มควบคุม
    this.lvlTxt=this.add.text(pad,pad+34,'Lv 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff'}).setOrigin(0,0).setScrollFactor(1).setDepth(51);
    this.killTxt=this.add.text(pad,pad+56,'☠ 0',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#d9cff0'}).setOrigin(0,0).setScrollFactor(1).setDepth(51);
    // สรุปสเตตย่อ ๆ ขณะเล่น (เลือด/ฟื้น/โจมตี/ป้องกัน)
    this.statTxt=this.add.text(pad,pad+75,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#bfe8d6'}).setOrigin(0,0).setScrollFactor(1).setDepth(51);
    this.runSugarTxt=this.add.text(w-pad,pad+56,'🍬 0',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe08a'}).setOrigin(1,0).setScrollFactor(1).setDepth(51);   // เงินที่ได้Waitบนี้ (realtime)
    this.timeTxt=this.add.text(w/2,pad+34,'0:00',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffe08a',align:'center',wordWrap:{width:w-150}}).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    this.stageTxt=this.add.text(w/2,pad+56,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd9a8',align:'center',wordWrap:{width:w-40}}).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    // wave progress pips (บอกว่าใกล้จบเวฟ/ถึงบอสหรือยัง)
    this.pipG=this.add.graphics().setScrollFactor(1).setDepth(51);
    this.waveObjTxt=this.add.text(w/2,pad+91,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#fff4b0',align:'center',stroke:'#24172c',strokeThickness:3}).setOrigin(0.5,0).setScrollFactor(1).setDepth(53).setVisible(false);
    this.waveObjBg=this.add.rectangle(w/2,pad+114,Math.min(230,w-84),7,0x100b16,0.72).setOrigin(0.5,0).setScrollFactor(1).setDepth(52).setVisible(false);
    this.waveObjBar=this.add.rectangle(w/2-Math.min(230,w-84)/2,pad+115,Math.min(230,w-84),5,0xffd166,1).setOrigin(0,0).setScrollFactor(1).setDepth(53).setVisible(false);

    // boss HP bar (hidden until boss)
    this.bossName=this.add.text(w/2,pad+136,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ff9ec4'}).setOrigin(0.5,0).setScrollFactor(1).setDepth(52);
    this.bossBgW=this.add.rectangle(w/2,pad+154,this._barW*0.8,12,0x000000,0.4).setOrigin(0.5,0).setScrollFactor(1).setDepth(51);
    this.bossBar=this.add.rectangle(w/2-(this._barW*0.8)/2+2,pad+156,this._barW*0.8-4,8,0xff5f97,1).setOrigin(0,0).setScrollFactor(1).setDepth(52);
    this.bossHpTxt=this.add.text(w/2,pad+161,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffffff',stroke:'#5a0d28',strokeThickness:2}).setOrigin(0.5,0).setScrollFactor(1).setDepth(53);

    // center banner
    this.bannerT=this.add.text(w/2,this.H*0.32,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'30px',color:'#ffffff',align:'center'}).setOrigin(0.5).setScrollFactor(1).setDepth(60).setVisible(false);
    this.bannerS=this.add.text(w/2,this.H*0.4,'',{fontFamily:'sans-serif',fontSize:'15px',color:'#e6dcf0',align:'center',wordWrap:{width:w*0.82}}).setOrigin(0.5).setScrollFactor(1).setDepth(60).setVisible(false);

    // ปุ่มควบคุม (speed/pause/mute) — จัดเป็นกลุ่มเดียวมุมขวาบน อยู่แนวเดียวกับหลอด HP
    const cbY=pad+14;
    this.muteBtn=this.add.circle(w-26,cbY,16,0x000000,0.48).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.4);
    this.muteTxt=this.add.text(w-26,cbY,Sfx.muted?'🔇':'🔊',{fontSize:'15px'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    this.pauseBtn=this.add.circle(w-62,cbY,16,0x000000,0.48).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.4);
    this.pauseTxt=this.add.text(w-62,cbY,'⏸',{fontSize:'14px'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    this.speedBtn=this.add.circle(w-98,cbY,16,0x000000,0.48).setScrollFactor(1).setDepth(58).setStrokeStyle(1.5,0xffffff,0.4);
    this.speedTxt=this.add.text(w-98,cbY,'x'+(this.gameSpeed||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#bff5d8'}).setOrigin(0.5).setScrollFactor(1).setDepth(59);
    // ตัววัด FPS + ความละเอียด (ไว้ดีบั๊ก — เอาออกทีหลังได้)
    this.fpsTxt=this.add.text(w-30,pad+88,'',{fontFamily:'monospace',fontSize:'10px',color:'#8fd0ff'}).setOrigin(1,0).setScrollFactor(1).setDepth(59);
    this.fpsTxt.setVisible(/[?&]debug=1\b/.test(location.search));
    this.time.addEvent({delay:400,loop:true,callback:()=>{ if(!this.fpsTxt)return;
      const fps=Math.round(this.game.loop.actualFps), logicalW=Math.round(this.scale.width/RENDER_DPR), backingW=this.game.canvas.width;
      this.fpsTxt.setText(fps+'fps · '+logicalW+'→'+backingW+'p · x'+this.renderDPR); }});

    // Archero-style overhead: หลอดเลือด + เลเวล + ตัวเลข Northหัวผู้เล่น (screen-space บน uiCam = ติดตัวเป๊ะ)
    this.pOverG=this.add.graphics().setScrollFactor(1).setDepth(80); this.camUI(this.pOverG);
    this.pOverLv=this.add.text(0,0,'Lv 1',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffe27a',stroke:'#2a1830',strokeThickness:4}).setOrigin(0.5,1).setScrollFactor(1).setDepth(82); this.camUI(this.pOverLv);
    this.pOverHp=this.add.text(0,0,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffffff',stroke:'#2a1830',strokeThickness:3}).setOrigin(0.5,0.5).setScrollFactor(1).setDepth(83); this.camUI(this.pOverHp);
    this.hudList=[this.dashBtn,this.dashTxt,this.dashRing,this.uniqueBtn,this.uniqueTxt,this.uniqueRing,this.barG,this.hpIcon,this.xpIcon,this.timeTxt,this.killTxt,this.statTxt,this.runSugarTxt,this.lvlTxt,this.stageTxt,this.pipG,this.waveObjTxt,this.waveObjBg,this.waveObjBar,this.pauseBtn,this.pauseTxt,this.speedBtn,this.speedTxt,this.pOverG,this.pOverLv,this.pOverHp];
    this.objectiveArrow=this.add.text(w/2,pad+184,'➤',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'32px',color:'#ffef7a',stroke:'#3b2148',strokeThickness:5}).setOrigin(0.5).setScrollFactor(1).setDepth(69);
    this.objectiveDist=this.add.text(w/2,pad+210,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#fff4b0',stroke:'#27172f',strokeThickness:3}).setOrigin(0.5).setScrollFactor(1).setDepth(69);
    this.bossUI=[this.bossName,this.bossBgW,this.bossBar,this.bossHpTxt,this.objectiveArrow,this.objectiveDist];
    this.hudList.forEach(o=>o.setVisible(false));
    this.bossUI.forEach(o=>o.setVisible(false));
  }
  hudVisible(v){ this.hudList.forEach(o=>o.setVisible(v)); if(v)this.renderWaveObjectiveHUD(); if(this.skillBar)this.skillBar.setVisible(v); if(!v&&this.lowHpVig){this._lowHpOn=false;this.lowHpVig.setAlpha(0).setVisible(false);} }
  drawBars(){
    const pad=this._pad, g=this.barG; if(!g)return; g.clear();
    const bx=pad+16, bw=(this.W-112)-bx;   // เว้นมุมขวาบน ~112px ให้ปุ่ม speed/pause/mute เป็นกลุ่มเดียว
    const hpf=Phaser.Math.Clamp(this.player.hp/this.player.maxhp,0,1);
    const xpf=Phaser.Math.Clamp(this.xp/this.xpNext,0,1);
    // เอาหลอด HP ด้านบนออก (ย้ายไปNorthหัวผู้เล่นแทน) · เหลือแถบ XP บาง ๆ ไว้ดูความคืบหน้าเลเวล
    if(this.hpIcon)this.hpIcon.setVisible(false); if(this.xpIcon)this.xpIcon.setPosition(pad+4,pad+6);
    g.fillStyle(0x000000,0.35); g.fillRoundedRect(bx,pad+2,bw,8,4);
    if(xpf>0){ g.fillStyle(0x8bd3a0,1); g.fillRoundedRect(bx+2,pad+4,Math.max(4,(bw-4)*xpf),4,2); }
    this.drawOverheadStatus(hpf);
    if(this.statTxt){ const p=this.player;
      const regen=Math.min(p.maxhp*0.03,(p.regen||0)+(p.regenFlat||0)+p.maxhp*(p.regenPct||0));
      const atkPct=Math.round((p.dmgMul||1)*100), defPct=Math.round((1-(p.dmgTakenMul||1))*100), critPct=Math.round((p.critChance||0)*100);
      this.statTxt.setText(`❤ ${Math.max(0,Math.round(p.hp))}/${Math.round(p.maxhp)}   ♻ ${regen.toFixed(1)}/s   ⚔ ${atkPct}%   🛡 ${defPct}%`+(critPct>0?`   🎯 ${critPct}%`:''));
    }
  }
  // หลอดเลือด+เลเวลNorthหัวผู้เล่น (แบบ Archero) — screen-space คำนวณจากกล้อง ให้ติดตัวเสมอ
  drawOverheadStatus(hpf){
    const og=this.pOverG; if(!og||!this.player)return; og.clear();
    const cam=this.cameras.main, wv=cam.worldView; if(!wv||!wv.width||!wv.height)return;
    // แปลงPositionผู้เล่น (world) → พิกัดจอ logical (0..this.W/H) ที่ uiCam ใช้ · หาร width/height กัน DPR/zoom
    const ox=(this.player.x-wv.x)/wv.width*this.W;
    let oy=(this.player.y-wv.y)/wv.height*this.H - 42;
    oy=Phaser.Math.Clamp(oy, this._pad+66, this.H-150);   // กันหลุดขอบบน/ล่าง
    const w=72,h=9,bx=ox-w/2;
    og.fillStyle(0x000000,0.55); og.fillRoundedRect(bx-2,oy-2,w+4,h+4,5);
    og.fillStyle(0x3a1a24,1); og.fillRoundedRect(bx,oy,w,h,4);
    const col=hpf>0.5?0x5ef07a:(hpf>0.25?0xffd166:0xff5f5f);
    if(hpf>0){ og.fillStyle(col,1); og.fillRoundedRect(bx,oy,Math.max(3,w*hpf),h,4); }
    og.lineStyle(1.5,0xffffff,0.25); og.strokeRoundedRect(bx,oy,w,h,4);
    if(this.pOverHp)this.pOverHp.setPosition(ox,oy+h/2+0.5).setText(Math.max(0,Math.ceil(this.player.hp))+' / '+Math.round(this.player.maxhp));
    if(this.pOverLv)this.pOverLv.setPosition(ox,oy-3).setText('Lv '+(this.level||1));
  }
  drawDashRing(){
    const g=this.dashRing; if(!g)return; g.clear(); const b=this.dashBtn; if(!b||!b.visible)return;
    if(!this.dashReady && this.dashCd>0){
      const frac=Phaser.Math.Clamp(1-this.dashCd/1.1,0,1);
      g.lineStyle(3.5,0x66d3b3,0.9); g.beginPath();
      g.arc(b.x,b.y,40,-Math.PI/2,-Math.PI/2+Math.PI*2*frac,false); g.strokePath();
    } else { g.lineStyle(2,0xbff3e8,0.35); g.strokeCircle(b.x,b.y,40); }
  }
  drawUniqueRing(){
    const g=this.uniqueRing,b=this.uniqueBtn;if(!g||!b)return;g.clear();if(!b.visible)return;const u=this.uniqueInfo();
    if(this.uniqueCd>0){const frac=Phaser.Math.Clamp(1-this.uniqueCd/this.uniqueCooldown(u),0,1);g.lineStyle(3.5,u.color,0.95);g.beginPath();g.arc(b.x,b.y,40,-Math.PI/2,-Math.PI/2+Math.PI*2*frac,false);g.strokePath();this.uniqueTxt.setAlpha(0.48);}else{g.lineStyle(2,u.color,0.42);g.strokeCircle(b.x,b.y,40);this.uniqueTxt.setAlpha(1);}
  }
  /* แถบ "Owned" — โชว์Attack Skill + Passiveที่มีตอนนี้ (ใช้ในเลเวลอัพ/หยุดเกม) · คืน y ล่างสุด */
  drawHeldBar(cont, topY){
    const landscape=this.W>this.H, chip=landscape?26:30, gap=landscape?4:5;
    const rowFn=(y,label,labelColor,keys,emojiOf,lvlOf,chipColor,awkOf,isPass,labelX,chipX0)=>{
      const lab=this.add.text(labelX,y+chip/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:labelColor}).setOrigin(0,0.5);
      cont.add(lab);
      if(!keys.length){ const none=this.add.text(chipX0,y+chip/2,'— none yet',{fontFamily:'sans-serif',fontSize:'11px',color:'#6a6078'}).setOrigin(0,0.5); cont.add(none); return; }
      let x=chipX0;
      keys.forEach(k=>{ const awk=awkOf&&awkOf(k), lvl=lvlOf(k), ik=awk?null:this.iconKey(k,isPass);
        const g=this.add.graphics(); g.fillStyle(0x2c2338,0.95); g.fillRoundedRect(x,y,chip,chip,7);
        g.lineStyle(1.5,awk?0xffcf5a:chipColor,awk?1:0.9); g.strokeRoundedRect(x,y,chip,chip,7);
        const em = ik ? this.add.image(x+chip/2,y+chip/2-1,ik).setDisplaySize(chip*0.82,chip*0.82)
                      : this.add.text(x+chip/2,y+chip/2-1,emojiOf(k),{fontSize:'15px'}).setOrigin(0.5);
        const lt=this.add.text(x+chip-3,y+chip-2,awk?'⚡':String(lvl),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffe08a'}).setOrigin(1,1);
        cont.add([g,em,lt]); x+=chip+gap; });
    };
    const atk=Object.keys(this.skills||{}), pas=Object.keys(this.passives||{});
    if(landscape){
      const half=this.W/2;
      rowFn(topY,'⚔️ Skills','#f0a54a',atk,k=>SKILLDEFS[k]?SKILLDEFS[k].emoji:'❓',k=>this.skills[k],0xf0a54a,k=>this.skills[k]>=SKILL_AWAKEN_LV,false,12,58);
      rowFn(topY,'✨ Passives','#66d3b3',pas,k=>PASSIVES[k]?PASSIVES[k].emoji:'❓',k=>this.passives[k],0x66d3b3,null,true,half+4,half+48);
      return topY+chip+6;
    }
    rowFn(topY,       '⚔️ Skills','#f0a54a', atk, k=>SKILLDEFS[k]?SKILLDEFS[k].emoji:'❓', k=>this.skills[k], 0xf0a54a, k=>this.skills[k]>=SKILL_AWAKEN_LV, false,20,58);
    rowFn(topY+chip+8,'✨ Passives',  '#66d3b3', pas, k=>PASSIVES[k]?PASSIVES[k].emoji:'❓', k=>this.passives[k], 0x66d3b3, null, true,20,58);
    return topY+chip*2+8+6;
  }
  /* พาเนล "Cookable Recipes" — โชว์เป้าหมาย recipe/evolution แบบ Survivor.io: อาวุธ + passive ที่ต้องเก็บ = เมนู
     คืนค่า y ล่างสุด · ใช้ทั้งหน้าเลเวลอัพและหน้าหยุดเกม */
  drawRecipePanel(cont,y){
    const basic=this.basicAttackInfo(); if(!basic)return y;
    const combos=COMBOS.filter(c=>c.a===basic.skill); if(!combos.length)return y;
    const w=this.W, sx=10, avail=w-sx*2;
    const hd=this.add.text(sx,y,'🍳 Recipes you can cook (collect the matching passives):',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd166'}).setOrigin(0,0);
    cont.add(hd);
    const rowY=y+15, n=combos.length, gap=6, cw=(avail-gap*(n-1))/n, ch=34;
    combos.forEach((c,i)=>{
      const cooked=!!(this.combosOwned&&this.combosOwned[c.key]);
      const owned=(this.passives&&this.passives[c.b]>0);
      const known=Save.cookbookHas(c.key);   // เคยค้นพบสูตรนี้ในรันก่อน ๆ
      const pas=PASSIVES[c.b], x=sx+i*(cw+gap);
      const col=cooked?(c.sig?0xffb020:0xffd166):(owned?0x66d3b3:0x4a4059);
      const g=this.add.graphics(); g.fillStyle(cooked?(c.sig?0x40320f:0x3a2f1a):0x241a33,0.95); g.fillRoundedRect(x,rowY,cw,ch,8); g.lineStyle(c.sig?2:1.5,col,cooked?1:0.75); g.strokeRoundedRect(x,rowY,cw,ch,8);
      cont.add(g);
      // บรรทัด 1: ชื่อเมนู (⭐ Signature Recipe · ✓ ปรุงแล้ว · 📖 เคยค้นพบ)
      const tag=(c.sig?'⭐':'')+(cooked?'✓':(known?'📖':''));
      const nm=this.add.text(x+6,rowY+5,(tag?tag+' ':'')+c.emoji+' '+c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9.5px',color:cooked?'#ffe08a':(c.sig?'#ffd6a0':'#ffffff'),wordWrap:{width:cw-12}}).setOrigin(0,0);
      // บรรทัด 2: สถานะ — ต้องเก็บ passive ตัวไหน
      const sub=cooked?'Cooked!':('Collect '+(pas?pas.emoji+' '+pas.name:c.b));
      const st=this.add.text(x+6,rowY+ch-11,sub,{fontFamily:'sans-serif',fontSize:'8px',color:cooked?'#ffd166':(owned?'#66d3b3':'#b7abc9')}).setOrigin(0,0.5);
      cont.add([nm,st]);
    });
    return rowY+ch+4;
  }
  /* แถบไอคอนสกิลด้านล่าง — บอกว่ามีสกิลอะไร เลเวลเท่าไหร่ */
  buildSkillBar(){
    if(this.skillBar)this.skillBar.destroy();
    this.skillBar=this.add.container(0,0).setScrollFactor(1).setDepth(53);
    this.camUI(this.skillBar);
    this.skillChips={};
    const keys=Object.keys(this.skills); if(!keys.length){ this.checkCombos(); return; }
    const cw=Math.min(38,Math.floor((this.W-16)/keys.length)), rad=Math.min(16,cw/2-3), fs=Math.round(rad)+'px';
    const total=keys.length*cw; let x=this.W/2-total/2+cw/2; const y=this.H-32;
    keys.forEach(k=>{
      const d=SKILLDEFS[k], lvl=this.skills[k], awk=lvl>=SKILL_AWAKEN_LV, maxed=lvl>=d.max;
      const bg=this.add.circle(x,y,rad,0x2c2338,0.72).setStrokeStyle(2,awk?0xffb020:(maxed?0xffd166:0xff8fb5),awk?1:0.9);
      const ik=awk?null:this.iconKey(k,false);
      let em; if(ik){ em=this.add.image(x,y-1,ik).setDisplaySize(rad*1.85,rad*1.85); em._baseScale=em.scaleX; }
      else { em=this.add.text(x,y-1,awk&&d.awaken?d.awaken.emoji:d.emoji,{fontSize:fs}).setOrigin(0.5); em._baseScale=1; }
      // ป้ายเลเวลอ่านชัด: จานพื้นเข้ม + ตัวอักษรใหญ่ขึ้น + เส้นขอบ (เดิมเลขจมทับไอคอนอ่านไม่ออก)
      const bx=x+rad*0.62,by=y+rad*0.62,lbl=awk?'⚡':(maxed?'MAX':String(lvl));
      const badge=this.add.circle(bx,by,maxed&&!awk?9.5:7.5,0x1c1526,0.96).setStrokeStyle(1.5,awk?0xffcf40:(maxed?0xffd166:0xff8fb5),1);
      const lv=this.add.text(bx,by,lbl,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:maxed&&!awk?'8px':'11px',color:awk?'#ffe08a':(maxed?'#ffe08a':'#ffffff'),stroke:'#000000',strokeThickness:2}).setOrigin(0.5);
      this.skillBar.add([bg,em,badge,lv]); this.skillChips[k]={bg,em};
      x+=cw;
    });
    this.skillBar.setVisible(this.state==='play'||this.state==='levelup');
    this.checkCombos();
  }
  // ไอคอนรูปจริงของสกิล/พร (ถ้าอาร์ตทำมา) — None=คืน null (ใช้อีโมจิแทน)
  iconKey(key,isPass){ const ik=(isPass?PASS_ICON:SKILL_ICON)[key]; return (ik&&this.textures.exists(ik))?ik:null; }
  pulseSkill(k){ const c=this.skillChips&&this.skillChips[k]; if(!c)return; const bs=c.em._baseScale||1;
    this.tweens.add({targets:[c.em],scale:{from:bs*1.4,to:bs},duration:240,ease:'Back.out'});
    this.tweens.add({targets:[c.bg],scale:{from:1.25,to:1},duration:240,ease:'Back.out'}); }
  /* ---- ระบบทำอาหาร (Recipe) — วัตถุดิบ(Attack Skill a) + เครื่องปรุง(Passive b) = Cook Dish ----
     ปลุก COMBOS เดิมที่เคยตายให้กลับมามีความหมาย: มีคู่ครบ = "Cook Dish" timesเดียว → บัฟเล็ก + โมเมนต์ทำอาหาร */
  checkCombos(){
    this.comboFlags={};
    if(!this.combosOwned)this.combosOwned={};
    for(const c of COMBOS){
      const hasA=(this.skills&&this.skills[c.a]>0);
      const hasB=(this.passives&&this.passives[c.b]>0);
      if(hasA&&hasB){
        this.comboFlags[c.key]=true;
        if(!this.combosOwned[c.key]){ this.combosOwned[c.key]=true; this.cookDish(c); }
      }
    }
  }
  // Cook Dishใหม่: บัฟดาเมจเล็ก (prototype) + แบนเนอร์ "Dish Cooked!" + เสียง
  cookDish(c){
    if(this.player){
      if(c.effect)c.effect(this.player); else this.player.dmgMul=Math.min(3.25,(this.player.dmgMul||1)*1.05);
      this.player.dmgMul=Math.min(3.25,this.player.dmgMul);this.player.dmgTakenMul=Math.max(0.35,this.player.dmgTakenMul);this.player.critChance=Math.min(0.40,this.player.critChance);this.player.cdMul=Math.max(0.72,this.player.cdMul);this.player.baseSpeed=Math.min(BALANCE.moveSpeed*1.35,this.player.baseSpeed);
    }
    const ai=SKILLDEFS[c.a], bi=PASSIVES[c.b];
    const recipe=((ai&&ai.emoji)||'🍬')+' + '+((bi&&bi.emoji)||'✨');
    this.dishCount=(this.dishCount||0)+1;
    // สมุดสูตร: ค้นพบครั้งแรก = รางวัล Sugar ถาวร + ป้ายพิเศษ
    const rew=Save.discoverDish(c.key,c.sig);
    const head=(c.sig?'⭐ Signature dish! ':'🍳 Dish cooked! ')+c.emoji+' '+c.name;
    let sub=recipe+' → '+c.desc; if(rew>0)sub='🆕 New recipe! +🍬'+rew+' · '+c.desc;
    this.showBanner(head, sub, c.sig?2100:1700);   // รางวัลค้นพบเข้าคลัง Sugar ถาวรทันที (Save.discoverDish บันทึกแล้ว)
    Sfx.clear(); if(Sfx.pop)Sfx.pop();
  }

  // zoom กล้องให้ "visible field width" คงที่ทุกเครื่อง (อ้างอิงมือถือ ~430px) — แท็บเล็ตจอกว้าง = zoom เข้ามากขึ้น ตัวละครไม่เล็กจิ๋ว
  computeViewZoom(){ const REF_W=430, BASE=0.76; this.viewZoom=BASE*Phaser.Math.Clamp((this.W||REF_W)/REF_W,1,2.4); }
  // ซูมออกระหว่างบอสด้วย lerp ต่อเฟรม เพื่อให้เห็นสนามกว้างและทำงานสม่ำเสมอทุกอุปกรณ์
  applyMainZoom(){ if(this.cameras&&this.cameras.main)this.cameras.main.setZoom((this.viewZoom||1)*RENDER_DPR*(this._bossZoom||1)); }
  tickBossZoom(){
    const want=this.mode==='boss'?0.58:(this.mode==='mini'?0.68:1);
    if(this._bossZoom==null)this._bossZoom=1;
    if(Math.abs(this._bossZoom-want)>0.003){this._bossZoom+=(want-this._bossZoom)*0.10;this.applyMainZoom();}
    else if(this._bossZoom!==want){this._bossZoom=want;this.applyMainZoom();}
  }
  miniIntro(b){
    if(!b||!b.active||!this.cameras||!this.cameras.main)return;const cam=this.cameras.main,st=STAGES[this.stageIndex];
    b.atkCd=Math.max(b.atkCd||0,1.9);this.screenFlash(st&&st.tint?st.tint:0xff4d8f,0.18,420);this.screenShake(300,0.011);
    cam.stopFollow();cam.pan(b.x,b.y,620,'Sine.easeInOut');
    this.time.delayedCall(1250,()=>{if(this.cameras&&this.cameras.main)this.cameras.main.startFollow(this.player,false,0.2,0.2);});
  }
  onResize(gs){
    if(!gs)return; this.W=gs.width/RENDER_DPR; this.H=gs.height/RENDER_DPR; this.computeViewZoom(); const pad=this._pad; this._barW=this.W-2*pad;
    if(this.cameras&&this.cameras.main){ this.cameras.main.setSize(gs.width,gs.height); this.applyMainZoom(); }
    if(this.uiCam){ this.uiCam.setSize(gs.width,gs.height); this.uiCam.setZoom(RENDER_DPR); this.uiCam.centerOn(this.W/2,this.H/2); }
    if(this.vig)this.vig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H);
    if(this.lowHpVig)this.lowHpVig.setPosition(this.W/2,this.H/2).setDisplaySize(this.W,this.H);
    if(this.dashBtn){ this.dashBtn.setPosition(this.W-58,this.H-78); this.dashTxt.setPosition(this.W-58,this.H-78);
      if(this.uniqueBtn){this.uniqueBtn.setPosition(this.W-58,this.H-78-80);this.uniqueTxt.setPosition(this.W-58,this.H-78-80);}
      this.lvlTxt.setPosition(pad,pad+34); this.killTxt.setPosition(pad,pad+56);
      if(this.statTxt)this.statTxt.setPosition(pad,pad+75);
      if(this.runSugarTxt)this.runSugarTxt.setPosition(this.W-pad,pad+56);
      this.timeTxt.setPosition(this.W/2,pad+34).setWordWrapWidth(this.W-150);
      this.stageTxt.setPosition(this.W/2,pad+56).setWordWrapWidth(this.W-40);
      if(this.skills&&(this.state==='play'||this.state==='levelup')){ this.buildSkillBar(); this.drawWavePips(); }
      const cbY=pad+14;
      if(this.muteBtn){ this.muteBtn.setPosition(this.W-26,cbY); this.muteTxt.setPosition(this.W-26,cbY); }
      if(this.pauseBtn){ this.pauseBtn.setPosition(this.W-62,cbY); this.pauseTxt.setPosition(this.W-62,cbY); }
      if(this.speedBtn){ this.speedBtn.setPosition(this.W-98,cbY); this.speedTxt.setPosition(this.W-98,cbY); }
      if(this.state==='paused') this.buildPause();
      this.bossName.setPosition(this.W/2,pad+136); this.bossBgW.setPosition(this.W/2,pad+154); this.bossBgW.width=this._barW*0.8;
      this.bossBar.setPosition(this.W/2-(this._barW*0.8)/2+2,pad+156);
      if(this.bossHpTxt)this.bossHpTxt.setPosition(this.W/2,pad+161);
      this.bannerT.setPosition(this.W/2,this.H*0.32); this.bannerS.setPosition(this.W/2,this.H*0.4); }
    if(this.state==='menu') this.buildStartMenu();
    if(this.state==='startskill')this.openStartingSkillChoice();
    if(this.state==='dead') this.buildOver();
  }

  /* ---------- MENUS ---------- */
  buildMenus(){
    this.menu=this.add.container(0,0).setScrollFactor(1).setDepth(100);
    this.lvlUp=this.add.container(0,0).setScrollFactor(1).setDepth(100).setVisible(false);
    this.storyLayer=this.add.container(0,0).setScrollFactor(1).setDepth(118).setVisible(false);
    this.over=this.add.container(0,0).setScrollFactor(1).setDepth(100).setVisible(false);
    this.buildStartMenu();
  }
  /* ===== HUB MENU + SUB-SCREENS (tap-zone hit-test) ===== */
  _zone(x,y,w,h,fn){ this.tapZones.push({x,y,w,h,fn}); }
  // ปุ่มลูกกวาด (รูปจริง) — สตWaitว์เบอร์รีอยู่ซ้าย ข้อความเลื่อนไปขวา · มี fallback graphics ถ้ารูปโหลดไม่ได้
  _lighten(c,amt){ const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
    return ((Math.round(r+(255-r)*amt))<<16)|((Math.round(g+(255-g)*amt))<<8)|Math.round(b+(255-b)*amt); }
  _darken(c,amt){ const r=(c>>16)&255,g=(c>>8)&255,b=c&255;
    return ((Math.round(r*(1-amt)))<<16)|((Math.round(g*(1-amt)))<<8)|Math.round(b*(1-amt)); }
  // ปุ่มแบนโมเดิร์น: โค้งมน + ไล่เฉด + กลอสบน + ไอคอนcircleซ้าย + เงานุ่ม
  uiPillBtn(cont, cx, cy, w, h, color, emoji, label, fn){
    const r=Math.min(h*0.36,24), x=cx-w/2, y=cy-h/2, g=this.add.graphics();
    g.fillStyle(0x000000,0.26); g.fillRoundedRect(x,y+5,w,h,r);                                  // เงาใต้ปุ่ม
    g.fillGradientStyle(this._lighten(color,0.22),this._lighten(color,0.22),color,color,1); g.fillRoundedRect(x,y,w,h,r);  // ตัวปุ่มไล่เฉด
    g.fillStyle(0xffffff,0.20); g.fillRoundedRect(x+4,y+4,w-8,h*0.40,{tl:r,tr:r,bl:5,br:5});     // กลอสบน
    g.lineStyle(2,this._lighten(color,0.45),0.7); g.strokeRoundedRect(x,y,w,h,r);                 // ขอบสว่าง
    cont.add(g);
    const icx=x+h*0.56, ig=this.add.graphics(); ig.fillStyle(this._darken(color,0.14),0.55); ig.fillCircle(icx,cy,h*0.32); cont.add(ig);
    const em=this.add.text(icx,cy-1,emoji,{fontSize:Math.round(h*0.4)+'px'}).setOrigin(0.5); cont.add(em);
    const t=this.add.text(x+h*1.06,cy,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.round(h*0.34)+'px',color:'#ffffff'}).setOrigin(0,0.5);
    t.setShadow(0,2,'rgba(0,0,0,0.32)',3); cont.add(t);
    if(fn)this._zone(x,y,w,h,fn); }
  // ป้ายเมนูแฟนตาซี: กWaitบโลหะสองชั้น + ตราอัญมณี + แสงเฉพาะหมวด
  uiMenuCard(cont,cx,cy,w,h,color,emoji,label,sub,fn,primary){
    const x=cx-w/2,y=cy-h/2,r=Math.min(17,h*0.28),g=this.add.graphics();
    const gold=primary?0xffd68a:this._lighten(color,0.44),face=primary?0x44142d:0x171020;
    g.fillStyle(0x000000,0.48);g.fillRoundedRect(x+2,y+6,w,h,r);
    g.fillStyle(gold,0.24);g.fillRoundedRect(x-2,y-2,w+4,h+4,r+2);
    g.fillStyle(0x090611,0.96);g.fillRoundedRect(x,y,w,h,r);
    g.lineStyle(primary?2.4:1.8,gold,primary?0.96:0.72);g.strokeRoundedRect(x,y,w,h,r);
    g.fillGradientStyle(this._lighten(face,0.16),face,face,this._darken(face,0.28),1);g.fillRoundedRect(x+3,y+3,w-6,h-6,Math.max(8,r-3));
    g.fillGradientStyle(this._lighten(color,0.25),color,this._darken(color,0.12),this._darken(color,0.38),primary?0.38:0.19);g.fillRoundedRect(x+5,y+5,w-10,h-10,Math.max(7,r-5));
    g.lineStyle(1,0xffffff,primary?0.30:0.16);g.strokeRoundedRect(x+5,y+5,w-10,h-10,Math.max(7,r-5));
    g.lineStyle(1.2,gold,0.65);g.lineBetween(x+18,y+5,x+w-18,y+5);
    const icx=x+29,ir=Math.min(20,h*0.28);
    g.fillStyle(0x08050d,0.88);g.fillCircle(icx,cy,ir+4);
    g.lineStyle(2,gold,0.95);g.strokeCircle(icx,cy,ir+3);
    g.fillGradientStyle(this._lighten(color,0.34),color,color,this._darken(color,0.35),1);g.fillCircle(icx,cy,ir);
    g.lineStyle(1,0xffffff,0.42);g.strokeCircle(icx,cy,ir-2);cont.add(g);
    const em=this.add.text(icx,cy-1,emoji,{fontSize:Math.round(ir*1.15)+'px'}).setOrigin(0.5);
    const gemX=x+w-13,gem=this.add.graphics();gem.fillStyle(gold,0.95);gem.fillPoints([{x:gemX,y:cy-5},{x:gemX+5,y:cy},{x:gemX,y:cy+5},{x:gemX-5,y:cy}],true);gem.lineStyle(1,0xffffff,0.5);gem.strokePoints([{x:gemX,y:cy-5},{x:gemX+5,y:cy},{x:gemX,y:cy+5},{x:gemX-5,y:cy}],true);cont.add(gem);
    const tx=x+55,textW=Math.max(62,gemX-tx-10),labelSize=label.length>11?12.5:(primary?15:14);
    const nm=this.add.text(tx,sub?cy-9:cy,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:labelSize+'px',color:'#fffaf3',wordWrap:{width:textW,useAdvancedWrap:true}}).setOrigin(0,0.5);
    nm.setShadow(0,2,'#000000',2);cont.add([em,nm]);
    if(sub){const st=this.add.text(tx,cy+12,sub,{fontFamily:'sans-serif',fontSize:'8.5px',color:primary?'#ffd9df':'#c4b8cb',wordWrap:{width:textW,useAdvancedWrap:true}}).setOrigin(0,0.5);cont.add(st);}
    if(fn)this._zone(x,y,w,h,fn);
  }
  _coverImage(x,y,w,h,key){
    const img=this.add.image(x+w/2,y+h/2,key).setOrigin(0.5),fw=img.frame.realWidth||img.frame.width,fh=img.frame.realHeight||img.frame.height;
    // cover-crop: สเกลเท่ากันทั้งสองแกนให้ภาพคลุมFullกล่อง แล้วคWaitบ texture ตรงกลางให้พอดี w×h
    // (เดิมใช้ setDisplaySize(w,h) หลัง crop ทำให้สเกลเพี้ยน ภาพคลุมไม่Full เห็นพื้นด้านหลังโผล่ขอบบน)
    const scale=Math.max(w/fw,h/fh),cw=w/scale,ch=h/scale;
    img.setScale(scale).setCrop((fw-cw)/2,(fh-ch)/2,cw,ch);return img;
  }
  // การ์ดบทแบบภาพประกอบ — ภาพฉากจริง + overlay อ่านง่าย + status ที่เป็นส่วนหนึ่งของกWaitบ
  uiStageCard(cont,x,y,w,h,st,index,open,fn){
    const currentPower=Save.power(Save.data.character),recommended=st.recommendedPower||100;
    const colors=[0xb9e85d,0x6ed7df,0xff9a62,0x9bdfff,0xff78a9],color=colors[index%colors.length],r=17;
    const shadow=this.add.graphics();shadow.fillStyle(0x000000,0.55);shadow.fillRoundedRect(x+3,y+6,w,h,r);shadow.fillStyle(color,0.18);shadow.fillRoundedRect(x-2,y-2,w+4,h+4,r+2);cont.add(shadow);
    const artKey='bg'+(index+1),art=this.textures.exists(artKey)?this._coverImage(x+2,y+2,w-4,h-4,artKey):null;if(art)cont.add(art);
    const shade=this.add.graphics();
    shade.fillGradientStyle(0x090711,0x090711,0x090711,0x090711,0.18,0.72,0.92,0.92);shade.fillRoundedRect(x+2,y+2,w-4,h-4,r-2);
    if(!open){shade.fillStyle(0x100d18,0.64);shade.fillRoundedRect(x+2,y+2,w-4,h-4,r-2);}
    shade.lineStyle(2.2,open?color:0x625872,open?0.95:0.62);shade.strokeRoundedRect(x,y,w,h,r);
    shade.lineStyle(1,0xffffff,0.25);shade.strokeRoundedRect(x+4,y+4,w-8,h-8,r-4);
    shade.fillStyle(open?color:0x625872,0.96);shade.fillRoundedRect(x+10,y+10,54,20,7);
    const actionW=open?68:64,actionX=x+w-actionW-10;shade.fillStyle(open?0x11261f:0x211c29,0.93);shade.fillRoundedRect(actionX,y+h-35,actionW,25,9);shade.lineStyle(1.3,open?color:0x625872,0.8);shade.strokeRoundedRect(actionX,y+h-35,actionW,25,9);cont.add(shade);
    const stageLabel=st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):String(index+1).padStart(2,'0');
    const chapter=this.add.text(x+37,y+20,'Stage '+stageLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#172014':'#ddd5e5'}).setOrigin(0.5);
    const icon=this.add.text(x+19,y+h-25,open?st.emoji:'🔒',{fontSize:'22px'}).setOrigin(0.5);
    const name=this.add.text(x+39,y+43,st.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:h<92?'13px':'15px',color:open?'#fffaf2':'#c4bdca',stroke:'#120a16',strokeThickness:2}).setOrigin(0,0.5);
    const en=this.add.text(x+39,y+61,st.en.toUpperCase(),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:open?Phaser.Display.Color.IntegerToColor(color).rgba:'#82798d'}).setOrigin(0,0.5);
    const power=this.add.text(x+w-12,y+20,'⚡ '+currentPower+' / suggested '+recommended,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:currentPower>=recommended?'#a8f0c0':'#ffb1bd'}).setOrigin(1,0.5);
    const desc=open?st.lore:('Clear Chapter '+index+' to unlock this path');
    const lore=this.add.text(x+39,y+h-25,desc,{fontFamily:'sans-serif',fontSize:h<92?'8px':'9px',color:open?'#ddd4df':'#8f8798',wordWrap:{width:w-39-actionW-28},maxLines:2}).setOrigin(0,0.5);
    const action=this.add.text(actionX+actionW/2,y+h-22.5,open?'Play  ▶':'Locked',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#d8ffe5':'#9b91a5'}).setOrigin(0.5);
    cont.add([chapter,icon,name,en,power,lore,action]);this._zone(x,y,w,h,open?fn:()=>Sfx.select());
  }
  handleTap(px,py){ for(let i=this.tapZones.length-1;i>=0;i--){ const z=this.tapZones[i];
    if(px>=z.x&&px<=z.x+z.w&&py>=z.y&&py<=z.y+z.h){ Sfx.select(); z.fn(); return; } } }
  _currencyIcon(key,x,y,size,alpha=1,cont){
    const d=currencyDef(key),target=cont||this.menu;let icon;
    if(d&&d.asset&&this.textures.exists(d.asset))icon=this.add.image(x,y,d.asset).setDisplaySize(size,size).setAlpha(alpha);
    else icon=this.add.text(x,y,d?d.emoji:'?',{fontSize:Math.round(size*.72)+'px'}).setOrigin(.5).setAlpha(alpha);
    target.add(icon);return icon;
  }
  _rowBtn(y,h,iconRef,name,sub,rightLabel,rightColor,fn,xOverride,wOverride){
    const w=wOverride||Math.min(this.W-32,400), x=xOverride==null?this.W/2-w/2:xOverride;
    const compact=h<74, rightW=Math.min(96,w*0.27), textW=Math.max(80,w-62-rightW);
    const g=this.add.graphics(); g.fillStyle(0x2c2338,fn?1:0.6); g.fillRoundedRect(x,y,w,h,15);
    g.lineStyle(2,fn?0x4a4059:0x39304a,1); g.strokeRoundedRect(x,y,w,h,15);
    const em=this.textures.exists(iconRef)?this.add.image(x+27,y+h/2,iconRef).setDisplaySize(compact?29:34,compact?29:34):this.add.text(x+27,y+h/2,iconRef,{fontSize:(compact?'21px':'24px')}).setOrigin(0.5);
    const safeName=compact&&name.length>31?name.slice(0,30)+'…':name;
    const safeSub=compact&&sub.length>46?sub.slice(0,45)+'…':sub;
    const nm=this.add.text(x+52,y+h*(compact?0.34:0.32),safeName,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:compact?'12px':'14px',color:fn?'#ffffff':'#9a90ab'}).setOrigin(0,0.5);
    const ds=this.add.text(x+52,y+h*(compact?0.70:0.69),safeSub,{fontFamily:'sans-serif',fontSize:compact?'9px':'10.5px',color:'#b7abc9',wordWrap:{width:textW}}).setOrigin(0,0.5);
    const rt=this.add.text(x+w-12,y+h/2,rightLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:compact?'11px':'12px',color:rightColor,align:'right',wordWrap:{width:rightW}}).setOrigin(1,0.5);
    this.menu.add([g,em,nm,ds,rt]); if(fn)this._zone(x,y,w,h,fn);
  }
  _screenBg(title,artKey,backScreen){ const w=this.W,h=this.H;
    const compact=w>h;
    const bg=artKey&&this.textures.exists(artKey)?this._coverImage(0,0,w,h,artKey):this.add.rectangle(0,0,w,h,0x1a1420,0.97).setOrigin(0,0);
    const veil=artKey?this.add.rectangle(0,0,w,h,0x110c19,0.54).setOrigin(0,0):null;
    const headY=compact?27:52;
    const t=this.add.text(w/2,headY,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:compact?'20px':'22px',color:'#ff8fb5'}).setOrigin(0.5);
    const sugar=this.add.text(w-14,headY,'🍬 '+(Save.data.sugar||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:compact?'14px':'16px',color:'#ffe08a'}).setOrigin(1,0.5);
    this.menu.add(veil?[bg,veil,t,sugar]:[bg,t,sugar]);
    const by=compact?10:38, bh=compact?32:34;
    const bg2=this.add.graphics(); bg2.fillStyle(0x2c2338,1); bg2.fillRoundedRect(12,by,82,bh,11); bg2.lineStyle(2,0x4a4059,1); bg2.strokeRoundedRect(12,by,82,bh,11);
    const bt=this.add.text(53,by+bh/2,'‹ Back',{fontFamily:'sans-serif',fontSize:'13px',color:'#cbbfda'}).setOrigin(0.5);
    this.menu.add([bg2,bt]); this._zone(12,by,82,bh,()=>{ const prev=backScreen||(this._navStack&&this._navStack.length?this._navStack.pop():null)||'hub'; this._curMenu=prev; this.menuScreen=prev; this.buildMenuScreen(); });
  }
  buildMenuScreen(){ const s=this.menuScreen||'hub';
    if(!this._navStack)this._navStack=[];   // นำทางย้อนกลับหน้าก่อนหน้า (แทนที่จะเด้งไป hub เสมอ)
    if(s==='hub')this._navStack=[]; else if(this._curMenu&&this._curMenu!==s){ this._navStack.push(this._curMenu); if(this._navStack.length>12)this._navStack.shift(); }
    this._curMenu=s;
    if(s==='stage')this.buildStageSelect(); else if(s==='chapter')this.buildChapterSelect(); else if(s==='upgrade')this.buildUpgrade(); else if(s==='perks')this.buildRankPerks(); else if(s==='gear')this.buildGear(); else if(s==='gearInbox')this.buildGearInbox(); else if(s==='craft')this.buildCraftBench(); else if(s==='bazaar')this.buildBazaar(); else if(s==='stats')this.buildStats(); else if(s==='char')this.buildChars(); else if(s==='news')this.buildNews(); else if(s==='bestiary')this.buildBestiary(); else if(s==='cookbook')this.buildCookbook(); else if(s==='skills')this.buildSkillArchive(); else if(s==='settings')this.buildSettings(); else if(s==='achievements')this.buildAchievements(); else if(s==='daily')this.buildDaily(); else if(s==='endgame')this.buildEndgame(); else if(HUB_GROUPS[s])this.buildHubGroup(s); else this.buildHub(); }
  // หน้ากลุ่มเมนู (รวมปุ่มย่อยให้ Hub สะอาดขึ้น) — รายการจาก HUB_GROUPS
  buildHubGroup(key){
    this.menu.removeAll(true); this.tapZones=[]; const grp=HUB_GROUPS[key]; this._screenBg(grp.title);
    const w=this.W,h=this.H,portrait=w<=h,rows=grp.rows;
    const bw=Math.min(w-28,440),x=(w-bw)/2,y0=portrait?116:92,gap=10,rh=Math.min(portrait?80:64,(h-y0-56-gap*(rows.length-1))/rows.length);
    rows.forEach(([target,emoji,label,sub],i)=>{ const y=y0+i*(rh+gap);
      const g=this.add.graphics(); g.fillStyle(0x241a30,0.96); g.fillRoundedRect(x,y,bw,rh,14); g.lineStyle(2,0x6a5b86,0.85); g.strokeRoundedRect(x,y,bw,rh,14); g.fillStyle(0x8f7de8,1); g.fillRoundedRect(x,y,7,rh,4);
      const ic=this.add.circle(x+40,y+rh/2,21,0x3a2f50,1); const em=this.add.text(x+40,y+rh/2,emoji,{fontSize:'22px'}).setOrigin(0.5);
      const nm=this.add.text(x+72,y+rh*0.34,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0,0.5);
      const ds=this.add.text(x+72,y+rh*0.68,sub,{fontFamily:'sans-serif',fontSize:'10px',color:'#bfb5ca',wordWrap:{width:bw-160}}).setOrigin(0,0.5);
      const ar=this.add.text(x+bw-16,y+rh/2,'›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#cbb8e0'}).setOrigin(1,0.5);
      this.menu.add([g,ic,em,nm,ds,ar]);
      this._zone(x,y,bw,rh,()=>{ if(target==='__tutorial'){ this.startTutorial(()=>{this.state='menu';this.menu.setVisible(true);this.menuScreen='hub';this.buildMenuScreen();},true); }
        else { if(target==='skills'){this._skillArchiveTab='attack';this._skillArchivePage=0;this._skillArchiveSelected=null;} this.menuScreen=target; this.buildMenuScreen(); } });
    });
    this.menu.setVisible(true);
  }
  // หน้าUpdates/ดาวน์โหลด — โชว์เวอร์ชันปัจจุบัน + บันทึกUpdates + ลิงก์ดาวน์โหลดแอป
  buildNews(){
    if(Save.data.seenVersion!==GAME_VERSION){ Save.data.seenVersion=GAME_VERSION; Save.save(); }   // เปิดดูข่าว = Cleared badge Updates
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Updates');
    const w=this.W,h=this.H;
    const cur=this.add.text(w/2,53,'Current version v'+GAME_VERSION,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe08a'}).setOrigin(0.5);
    this.menu.add(cur);
    // ปุ่มดาวน์โหลด APK (เปิดหน้า releases ในเบราว์เซอร์)
    const dlW=Math.min(w-40,250),dx=w/2-dlW/2,dy=65,dlH=34;
    const dg=this.add.graphics(); dg.fillStyle(COLORS.mint,1); dg.fillRoundedRect(dx,dy,dlW,dlH,11); dg.lineStyle(2,0xffffff,0.3); dg.strokeRoundedRect(dx,dy,dlW,dlH,11);
    const dt=this.add.text(w/2,dy+dlH/2,'📥 Download latest APK',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#12331f'}).setOrigin(0.5);
    this.menu.add([dg,dt]); this._zone(dx,dy,dlW,dlH,()=>{ try{ window.open(RELEASES_URL,'_blank'); }catch(e){} });
    const portrait=w<=h, cols=portrait?1:3, gap=portrait?8:9, y=portrait?116:110;
    const cw=portrait?w-28:(w-28-gap*2)/3;
    const cardH=portrait?Math.max(112,Math.min(170,(h-y-18-gap*2)/3)):h-y-12;
    CHANGELOG.slice(0,3).forEach((c,i)=>{
      const cx=14+(i%cols)*(cw+gap), cy=y+Math.floor(i/cols)*(cardH+gap),g=this.add.graphics();g.fillStyle(0x2c2338,0.94);g.fillRoundedRect(cx,cy,cw,cardH,12);g.lineStyle(1.5,0x4a4059,0.9);g.strokeRoundedRect(cx,cy,cw,cardH,12);this.menu.add(g);
      const head=this.add.text(cx+12,cy+10,'v'+c.v+' · '+c.title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:portrait?'12px':'11px',color:'#ff9ec4',wordWrap:{width:cw-24}}).setOrigin(0,0);
      const dd=this.add.text(cx+cw-12,cy+12,c.date,{fontFamily:'sans-serif',fontSize:'9px',color:'#7a7088'}).setOrigin(1,0);this.menu.add([head,dd]);
      let iy=cy+36;c.items.slice(0,portrait?3:4).forEach(it=>{const short=it.length>80?it.slice(0,79)+'…':it;const li=this.add.text(cx+12,iy,'• '+short,{fontFamily:'sans-serif',fontSize:portrait?'10px':'8.5px',color:'#c7bdd6',wordWrap:{width:cw-24}}).setOrigin(0,0);this.menu.add(li);iy+=li.height+5;});
    });
    this.menu.setVisible(true);
  }
  // 🍳 สมุดสูตร — โชว์สูตร (COMBOS) แยกตามตัวละคร · ค้นพบแล้ว (Save.cookbook) / ยังไม่พบ / Signature Recipe ⭐
  buildCookbook(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('🍳 Cookbook','',this.menuScreenBack||'gCodex');
    const w=this.W,h=this.H, portrait=w<=h;
    const total=COMBOS.length, found=COMBOS.filter(c=>Save.cookbookHas(c.key)).length;
    const sumTxt=this.add.text(w/2,53,'Cook recipes (weapon + matching passive) in a stage = permanent unlock · discovered '+found+' / '+total+' recipes',
      {fontFamily:'sans-serif',fontSize:'10px',color:'#ffe08a',wordWrap:{width:w-170}}).setOrigin(0.5);
    this.menu.add(sumTxt);
    // จัดกลุ่มตามสกิลพื้นฐาน (อาวุธ) เรียงตามลำดับตัวละคร
    const byChar=CHAR_ORDER.map(id=>({id,ba:BASIC_ATTACKS[id]})).filter(o=>o.ba);
    let y=portrait?76:70; const sx=14, aw=w-28;
    byChar.forEach(o=>{
      const ba=o.ba, ch=CHARACTERS[o.id], recs=COMBOS.filter(c=>c.a===ba.skill);
      if(!recs.length)return;
      const hd=this.add.text(sx,y,ba.emoji+' '+ba.name+'  ('+(ch?ch.name:o.id)+')',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ff9ec4'}).setOrigin(0,0);
      this.menu.add(hd); y+=18;
      const cols=portrait?1:3, gap=6, cw=(aw-gap*(cols-1))/cols, rh=34;
      recs.forEach((c,i)=>{
        const known=Save.cookbookHas(c.key), pas=PASSIVES[c.b];
        const col=i%cols, row=Math.floor(i/cols), x=sx+col*(cw+gap), ry=y+row*(rh+gap);
        const bc=known?(c.sig?0xffb020:0xffd166):0x4a4059;
        const g=this.add.graphics(); g.fillStyle(known?(c.sig?0x40320f:0x2f2718):0x241a33,0.95); g.fillRoundedRect(x,ry,cw,rh,8); g.lineStyle(c.sig?2:1.4,bc,known?1:0.6); g.strokeRoundedRect(x,ry,cw,rh,8); this.menu.add(g);
        const tag=(c.sig?'⭐ ':'')+(known?'✓ ':'🔒 ');
        const nm=this.add.text(x+7,ry+5,tag+c.emoji+' '+(known?c.name:'Secret recipe'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9.5px',color:known?'#ffe08a':'#8a7fa0',wordWrap:{width:cw-14}}).setOrigin(0,0);
        const sub=known?c.desc:('Collect '+(pas?pas.emoji+' '+pas.name:c.b)+' with weapon');
        const st=this.add.text(x+7,ry+rh-11,sub,{fontFamily:'sans-serif',fontSize:'8px',color:known?'#c7bdd6':'#8a7fa0',wordWrap:{width:cw-14}}).setOrigin(0,0.5);
        this.menu.add([nm,st]);
      });
      y+=Math.ceil(recs.length/cols)*(rh+gap)+8;
    });
    this.menu.setVisible(true);
  }
  buildBestiary(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('📖 Bestiary');
    const w=this.W,h=this.H;
    // สรุปโบนัสรวม (สแตตถาวร + Sugar)
    const totLv=BESTIARY.reduce((a,m)=>a+bestiaryLv(m.id),0);
    const bt=bestiaryTotals(),bText=bestiaryBonusText(bt)||'no bonus yet';
    const sumTxt=this.add.text(w/2,50,'Kill tiers ('+totLv+'/'+(BESTIARY.length*BEST_MAX_TIER)+') = permanent stats + 🍬',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffe08a'}).setOrigin(0.5);
    const sumBonus=this.add.text(w/2,64,'Total: '+bText,{fontFamily:'sans-serif',fontSize:'8.5px',color:'#8bd3ff',wordWrap:{width:w-28},align:'center'}).setOrigin(0.5,0);
    this.menu.add([sumTxt,sumBonus]);
    const portrait=w<=h, cols=portrait?2:3, gap=7,cardW=(w-28-gap*(cols-1))/cols,marginX=14;
    const rows=Math.ceil(BESTIARY.length/cols), y0=portrait?92:72,cardH=Math.min(portrait?108:88,(h-y0-14-gap*(rows-1))/rows);
    const starColors=['#4a4059','#8bd3a0','#7fc9ff','#b98cff','#ffd166','#ff8fb5','#ff9a5a','#ff5a6e','#ff3d8f'];
    BESTIARY.forEach((m,idx)=>{
      const col=idx%cols, row=Math.floor(idx/cols);
      const cx=marginX+col*(cardW+gap), cy=y0+row*(cardH+gap);
      const lv=bestiaryLv(m.id), kills=Save.kills(m.id);
      const next=lv<BEST_MAX_TIER?BESTIARY_THRESHOLDS[lv]:null;
      const g=this.add.graphics();
      g.fillStyle(lv>0?0x2c2338:0x201a2a,1); g.fillRoundedRect(cx,cy,cardW,cardH,12);
      g.lineStyle(2,lv>=BEST_MAX_TIER?0xffd166:(lv>0?0x4a4059:0x39304a),1); g.strokeRoundedRect(cx,cy,cardW,cardH,12);
      if(lv>=BEST_MAX_TIER){ g.fillStyle(0xffd166,0.08); g.fillRoundedRect(cx,cy,cardW,cardH,12); }
      // icon
      const hasTex=this.textures.exists(m.tex);
      const icon=hasTex?this.add.image(cx+25,cy+25,m.tex).setDisplaySize(portrait?36:31,portrait?36:31):
        this.add.text(cx+25,cy+25,m.emoji,{fontSize:portrait?'27px':'24px'}).setOrigin(0.5);
      if(!hasTex)icon.setOrigin(0.5);
      // ชื่อ
      const nm=this.add.text(cx+47,cy+9,m.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:lv>0?'#ffffff':'#7a7088'}).setOrigin(0,0);
      // ดาว ★
      const stars=this.add.text(cx+47,cy+25,'★ Tier '+lv+'/'+BEST_MAX_TIER,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:starColors[lv]||'#4a4059'}).setOrigin(0,0);
      // จำนวนฆ่า + progress
      const killStr='Defeat: '+kills+(next?' / '+next:'');
      const kt=this.add.text(cx+8,cy+44,killStr,{fontFamily:'sans-serif',fontSize:'9px',color:'#b7abc9'}).setOrigin(0,0);
      // progress bar
      const barW=cardW-16, barH=5, bx=cx+8, by=cy+57;
      g.fillStyle(0x1a1420,1); g.fillRoundedRect(bx,by,barW,barH,3);
      const pct=next?Math.min(1,kills/next):1;
      const barColor=lv>=5?0xffd166:(lv>=3?0xb98cff:0x8bd3a0);
      if(pct>0){ g.fillStyle(barColor,1); g.fillRoundedRect(bx,by,Math.max(6,barW*pct),barH,3); }
      // bonus text — สแตตถาวรสะสม + Sugar
      const curB=bestiaryBonusTotal(m.id),bStat=bestiaryBonusText(curB);
      const bLabel=lv>0?((bStat||'—')+'  · 🍬+'+(lv*40)):'Tier 1 → permanent stat + 🍬+40';
      const blT=this.add.text(cx+8,cy+66,bLabel,{fontFamily:'sans-serif',fontStyle:lv>0?'bold':'normal',fontSize:'8px',color:lv>0?'#8bd3ff':'#5a5268',wordWrap:{width:cardW-16}}).setOrigin(0,0);
      const desc=this.add.text(cx+8,cy+cardH-13,m.desc.length>34?m.desc.slice(0,33)+'…':m.desc,{fontFamily:'sans-serif',fontSize:portrait?'8px':'7.5px',color:'#8f849f',wordWrap:{width:cardW-16}}).setOrigin(0,0);
      this.menu.add([g,icon,nm,stars,kt,blT,desc]);
    });
    this.menu.setVisible(true);
  }
  // คำนวณสแตตจริงของ loadout (base + char + weapon + Flavor Weave + gear + bestiary + perks) โดยไม่แตะ player จริง
  previewStats(){
    const p={maxhp:90,dmgMul:0.90,flatDmg:0,baseSpeed:BALANCE.moveSpeed,dmgTakenMul:1,critChance:0,critMul:1.55,cdMul:1,regen:0,regenFlat:0,pickup:105,lifesteal:0};
    const ch=CHARACTERS[Save.data.character]||CHARACTERS.momo,st=ch.stats||{};
    if(st.hp)p.maxhp+=st.hp; if(st.dmg)p.dmgMul*=st.dmg; if(st.spd)p.baseSpeed*=st.spd; if(st.def)p.dmgTakenMul*=st.def; if(st.crit)p.critChance+=st.crit; if(st.cdr)p.cdMul*=st.cdr; if(st.regenFlat)p.regenFlat+=st.regenFlat;
    const sw=SIGNATURE_WEAPONS[ch.weapon]; if(sw){ p.dmgMul*=(sw.dmgMul||1); p.cdMul*=(sw.cdMul||1); }
    for(const k in UPGRADES){ const tot=Save.talTotal(k); if(tot>0&&UPGRADES[k].apply)UPGRADES[k].apply(p,tot); }
    for(const slot of GEAR_SLOTS){ const inst=Save.equippedGearItem(slot.slot); if(!inst)continue; const it=GEAR_ALL.find(g=>g.id===inst.baseId); if(it&&it.apply)it.apply(p,Save.gearLv(inst.uid)); if(inst.affixes)for(const a of inst.affixes){ const d=affixDef(a.id); if(d&&d.apply)d.apply(p,a.v); } }
    const bst=bestiaryTotals(); if(bst.hp)p.maxhp+=bst.hp; if(bst.dmg)p.dmgMul*=(1+bst.dmg); if(bst.def)p.dmgTakenMul*=(1-Math.min(0.55,bst.def)); if(bst.spd)p.baseSpeed*=(1+Math.min(0.4,bst.spd)); if(bst.crit)p.critChance+=bst.crit; if(bst.cdr)p.cdMul*=(1-Math.min(0.5,bst.cdr));
    const rp=Save.data.rankPerks||{}; if(rp.vigor)p.maxhp*=1+0.06*rp.vigor; if(rp.might)p.dmgMul*=1+0.05*rp.might; if(rp.ironWill)p.dmgTakenMul*=(1-0.04*rp.ironWill);
    p.dmgTakenMul=Math.max(0.35,p.dmgTakenMul); p.critChance=Math.min(0.6,p.critChance); p.cdMul=Math.max(0.5,p.cdMul);
    return p;
  }
  buildStats(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('📊 Character Stats');
    const w=this.W,p=this.previewStats(),ch=CHARACTERS[Save.data.character]||CHARACTERS.momo,pow=Save.power(Save.data.character);
    let y=58;
    const hd=this.add.text(w/2,y,ch.emoji+' '+ch.name+'  ·  ⚡ Power '+pow,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffd9a8'}).setOrigin(0.5); y+=16;
    const note=this.add.text(w/2,y,'Real loadout numbers (weapon + weave + gear + bestiary + perks)',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#9a90ab'}).setOrigin(0.5); this.menu.add([hd,note]); y+=22;
    const rows=[
      ['💥','Attack Power',Math.round(p.dmgMul*100)+'',p.flatDmg?('+'+p.flatDmg+' flat per hit'):'base 90 = starting',0xff8f5a],
      ['❤️','Max HP',Math.round(p.maxhp)+'','',0xff5f7a],
      ['🎯','Crit Chance',Math.round(p.critChance*100)+'%','×'+p.critMul.toFixed(2)+' crit damage',0xffd166],
      ['🛡️','Defense',Math.round((1-p.dmgTakenMul)*100)+'% less','damage taken ×'+p.dmgTakenMul.toFixed(2),0x6ec6ff],
      ['👟','Move Speed',Math.round(p.baseSpeed)+'','',0x8bd3a0],
      ['⏱️','Cooldown',Math.round((1-p.cdMul)*100)+'% faster','skill cooldown ×'+p.cdMul.toFixed(2),0xb388ff],
      ['💗','Regen',((p.regen||0)+(p.regenFlat||0)).toFixed(1)+' /s','',0x66d3b3],
    ];
    const rh=40,gap=6,cardW=w-28;
    rows.forEach((r,i)=>{ const ry=y+i*(rh+gap),g=this.add.graphics(); g.fillStyle(0x2c2338,1); g.fillRoundedRect(14,ry,cardW,rh,10); g.lineStyle(1.4,0x4a4059,1); g.strokeRoundedRect(14,ry,cardW,rh,10); g.fillStyle(r[4],0.16); g.fillRoundedRect(14,ry,5,rh,{tl:10,bl:10,tr:0,br:0});
      const em=this.add.text(32,ry+rh/2,r[0],{fontSize:'19px'}).setOrigin(0.5);
      const nm=this.add.text(54,ry+8,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#e8dcf0'}).setOrigin(0,0);
      const sub=this.add.text(54,ry+23,r[3],{fontFamily:'sans-serif',fontSize:'8px',color:'#9a90ab'}).setOrigin(0,0);
      const val=this.add.text(w-24,ry+rh/2,r[2],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(1,0.5);
      this.menu.add([g,em,nm,sub,val]); });
    this.menu.setVisible(true);
  }
  buildSkillArchive(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Skill Codex');
    const w=this.W,h=this.H,portrait=w<=h,tab=this._skillArchiveTab||'attack';
    const tabY=portrait?82:50,tabH=32,tabGap=7,tabW=Math.min(132,(w-36-tabGap*2)/3),tabX=w/2-(tabW*3+tabGap*2)/2;
    const drawTab=(x,label,on,fn,color)=>{const g=this.add.graphics();g.fillStyle(on?this._darken(color,.55):0x292032,0.96);g.fillRoundedRect(x,tabY,tabW,tabH,10);g.lineStyle(1.8,on?color:0x51445f,1);g.strokeRoundedRect(x,tabY,tabW,tabH,10);const t=this.add.text(x+tabW/2,tabY+tabH/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:tabW<110?'9px':'10px',color:on?'#ffffff':'#998da7'}).setOrigin(0.5);this.menu.add([g,t]);this._zone(x,tabY,tabW,tabH,fn);};
    drawTab(tabX,'⚔️ Attack '+Object.keys(SKILLDEFS).length,tab==='attack',()=>{this._skillArchiveTab='attack';this._skillArchivePage=0;this._skillArchiveSelected=null;this.buildSkillArchive();},0xf0a54a);
    drawTab(tabX+tabW+tabGap,'✨ Passive '+Object.keys(PASSIVES).length,tab==='passive',()=>{this._skillArchiveTab='passive';this._skillArchivePage=0;this._skillArchiveSelected=null;this.buildSkillArchive();},0x66d3b3);
    drawTab(tabX+(tabW+tabGap)*2,'🎁 Items',tab==='items',()=>{this._skillArchiveTab='items';this._skillArchiveSelected=null;this.buildSkillArchive();},0xc9a3ff);
    if(tab==='items'){this.buildItemCodex(tabY+tabH+12);this.menu.setVisible(true);return;}
    if(this._skillArchiveSelected){this.buildSkillArchiveDetail(this._skillArchiveSelected,portrait,tabY+tabH+10);this.menu.setVisible(true);return;}
    const isPass=tab==='passive',defs=isPass?PASSIVES:SKILLDEFS,keys=Object.keys(defs),cols=portrait?2:4,rows=portrait?3:2,perPage=cols*rows;
    const pages=Math.max(1,Math.ceil(keys.length/perPage));this._skillArchivePage=Phaser.Math.Clamp(this._skillArchivePage||0,0,pages-1);const page=this._skillArchivePage;
    const gap=portrait?8:7,side=14,top=tabY+tabH+12,bottom=h-(portrait?54:42),cardW=(w-side*2-gap*(cols-1))/cols,cardH=(bottom-top-gap*(rows-1))/rows;
    keys.slice(page*perPage,page*perPage+perPage).forEach((key,i)=>{const d=defs[key],col=i%cols,row=Math.floor(i/cols),x=side+col*(cardW+gap),y=top+row*(cardH+gap),color=isPass?(d.color||COLORS.mint):0xf0a54a;
      const g=this.add.graphics();g.fillStyle(0x211929,0.97);g.fillRoundedRect(x,y,cardW,cardH,12);g.fillStyle(color,0.13);g.fillRoundedRect(x+3,y+3,cardW-6,cardH-6,9);g.lineStyle(1.7,color,0.82);g.strokeRoundedRect(x,y,cardW,cardH,12);
      const ik=this.iconKey(key,isPass),iconSize=Math.min(portrait?44:38,cardH*0.36),ic=ik?this.add.image(x+cardW/2,y+iconSize*0.62+5,ik).setDisplaySize(iconSize,iconSize):this.add.text(x+cardW/2,y+iconSize*0.62+5,d.emoji,{fontSize:Math.round(iconSize*0.78)+'px'}).setOrigin(0.5);
      const nm=this.add.text(x+cardW/2,y+iconSize+10,d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:cardW<150?'9px':'10.5px',color:'#fff7ed',align:'center',wordWrap:{width:cardW-12},maxLines:1}).setOrigin(0.5,0);
      const role=this.add.text(x+cardW/2,y+iconSize+25,!isPass&&d.role?d.role:'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:'#ffc978',align:'center',wordWrap:{width:cardW-12},maxLines:1}).setOrigin(0.5,0);
      const pair=isPass?COMBOS.filter(c=>c.b===key).map(c=>SKILLDEFS[c.a]&&SKILLDEFS[c.a].name).filter(Boolean).join(', '):((COMBOS.find(c=>c.a===key)||{}).name||'No Awaken pair');
      const desc=this.add.text(x+8,y+cardH-34,d.desc,{fontFamily:'sans-serif',fontSize:cardW<150?'7.5px':'8px',color:'#c9bdd2',align:'center',wordWrap:{width:cardW-16},maxLines:2}).setOrigin(0,1);
      const ft=this.add.text(x+cardW/2,y+cardH-8,(isPass?'Pairs with: ':'Awaken pair: ')+(pair||'—'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:isPass?'#8fe6c5':'#ffd08a',align:'center',wordWrap:{width:cardW-12},maxLines:1}).setOrigin(0.5,1);
      this.menu.add([g,ic,nm,role,desc,ft]);this._zone(x,y,cardW,cardH,()=>{this._skillArchiveSelected={key,isPass};this.buildSkillArchive();});
    });
    const navY=h-(portrait?31:20),navW=92,navH=28;
    const pageTxt=this.add.text(w/2,navY,'Page '+(page+1)+' / '+pages,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#d8cce0'}).setOrigin(0.5);this.menu.add(pageTxt);
    const nav=(cx,label,enabled,fn)=>{const g=this.add.graphics();g.fillStyle(enabled?0x463653:0x28212e,1);g.fillRoundedRect(cx-navW/2,navY-navH/2,navW,navH,9);g.lineStyle(1,enabled?0xa98cf0:0x44394d,1);g.strokeRoundedRect(cx-navW/2,navY-navH/2,navW,navH,9);const t=this.add.text(cx,navY,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:enabled?'#f5eaff':'#665d70'}).setOrigin(0.5);this.menu.add([g,t]);if(enabled)this._zone(cx-navW/2,navY-navH/2,navW,navH,fn);};
    nav(w/2-120,'‹ Prev',page>0,()=>{this._skillArchivePage--;this.buildSkillArchive();});nav(w/2+120,'Next ›',page<pages-1,()=>{this._skillArchivePage++;this.buildSkillArchive();});
    this.menu.setVisible(true);
  }
  buildItemCodex(top){
    const w=this.W,h=this.H,portrait=w<=h,rows=[
      ['❤️','Heart','Heals 18% HP + 6 · always drops from bosses/minibosses, rarely from normal enemies',0xff6f9f],
      ['🧲','Magnet','Vacuums all EXP orbs on the field · save it for after a big clear',0x7fd0ff],
      ['🎁','Gear box','Halo color = rarity: green Common · gold Rare · purple Epic',0xc9a3ff],
      ['✦','Stage gimmick','After a wave: vacuum EXP / clear slows / reset cooldowns / freeze field / heal and gain Sugar',0xffcf5a],
      ['📦','Crate break','Gives EXP with a chance of hearts, magnets, Gear or Sugar · higher stage/difficulty raises rarity',0xe59a4d]
    ],gap=portrait?9:8,x=14,cw=w-28,rh=Math.min(portrait?78:58,(h-top-18-gap*(rows.length-1))/rows.length);
    rows.forEach((r,i)=>{const y=top+i*(rh+gap),g=this.add.graphics();g.fillStyle(0x211929,.97);g.fillRoundedRect(x,y,cw,rh,12);g.lineStyle(1.6,r[3],.82);g.strokeRoundedRect(x,y,cw,rh,12);g.fillStyle(r[3],.11);g.fillRoundedRect(x+3,y+3,cw-6,rh-6,9);const em=this.add.text(x+28,y+rh/2,r[0],{fontSize:(portrait?28:23)+'px'}).setOrigin(.5),nm=this.add.text(x+54,y+rh*.32,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:(portrait?13:11)+'px',color:'#fff7ed'}).setOrigin(0,.5),ds=this.add.text(x+54,y+rh*.68,r[2],{fontFamily:'sans-serif',fontSize:(portrait?9.5:8.5)+'px',color:'#c9bdd2',wordWrap:{width:cw-68},maxLines:2}).setOrigin(0,.5);this.menu.add([g,em,nm,ds]);});
  }
  buildSkillArchiveDetail(sel,portrait,top){
    const w=this.W,h=this.H,d=sel.isPass?PASSIVES[sel.key]:SKILLDEFS[sel.key];if(!d){this._skillArchiveSelected=null;this.buildSkillArchive();return;}
    const panelX=16,panelW=w-32,panelY=top,panelH=h-top-16,g=this.add.graphics(),color=sel.isPass?(d.color||COLORS.mint):0xf0a54a;
    g.fillStyle(0x1f1728,0.98);g.fillRoundedRect(panelX,panelY,panelW,panelH,16);g.lineStyle(2,color,0.9);g.strokeRoundedRect(panelX,panelY,panelW,panelH,16);g.fillStyle(color,0.11);g.fillRoundedRect(panelX+4,panelY+4,panelW-8,Math.min(panelH-8,portrait?118:72),12);this.menu.add(g);
    const ik=this.iconKey(sel.key,sel.isPass),size=portrait?72:58,ix=panelX+18+size/2,iy=panelY+16+size/2,ic=ik?this.add.image(ix,iy,ik).setDisplaySize(size,size):this.add.text(ix,iy,d.emoji,{fontSize:Math.round(size*0.75)+'px'}).setOrigin(0.5);
    const tx=ix+size/2+14,title=this.add.text(tx,panelY+17,d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:portrait?'18px':'16px',color:'#fff7ed'}).setOrigin(0,0);
    const type=this.add.text(tx,panelY+43,sel.isPass?'PASSIVE · up to 5 stars':'ATTACK · '+d.role+' · up to 5 stars',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:sel.isPass?'#8fe6c5':'#ffd08a',wordWrap:{width:panelX+panelW-tx-14}}).setOrigin(0,0);
    const desc=this.add.text(tx,panelY+59,d.desc,{fontFamily:'sans-serif',fontSize:portrait?'11px':'9px',color:'#d8cce0',wordWrap:{width:panelX+panelW-tx-14},maxLines:portrait?3:2}).setOrigin(0,0);this.menu.add([ic,title,type,desc]);
    let body='';if(sel.isPass){const pairs=COMBOS.filter(c=>c.b===sel.key);body='Per level\n'+d.desc+'\n\nPairs to unlock Awaken\n'+(pairs.length?pairs.map(c=>'• '+SKILLDEFS[c.a].name+' → '+SKILLDEFS[c.a].awaken.name).join('\n'):'• No skill pairs with this passive yet');}
    else{const tiers=SKILL_TIERS[sel.key]||{},combo=COMBOS.find(c=>c.a===sel.key);body='Skill progression\n• Lv1 — '+d.desc+'\n'+[2,3,4,5].map(l=>'• Lv'+l+' — '+(tiers[l]||'Upgrade')).join('\n')+'\n\n⚡ Awaken: '+d.awaken.name+'\n'+d.awaken.desc+'\nRequired pair: '+(combo&&PASSIVES[combo.b]?PASSIVES[combo.b].name:'None');}
    const bodyY=panelY+(portrait?112:84),bodyTxt=this.add.text(panelX+18,bodyY,body,{fontFamily:'sans-serif',fontSize:portrait?'11px':'9px',color:'#ddd1e5',lineSpacing:portrait?5:2,wordWrap:{width:panelW-36},maxLines:portrait?14:9}).setOrigin(0,0);this.menu.add(bodyTxt);
    const bw=Math.min(180,panelW-36),bh=30,bx=panelX+panelW/2-bw/2,by=panelY+panelH-bh-12,bg=this.add.graphics();bg.fillStyle(0x3c3048,1);bg.fillRoundedRect(bx,by,bw,bh,10);bg.lineStyle(1.4,0xa98cf0,1);bg.strokeRoundedRect(bx,by,bw,bh,10);const bt=this.add.text(bx+bw/2,by+bh/2,'‹ Back to skills',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(0.5);this.menu.add([bg,bt]);this._zone(bx,by,bw,bh,()=>{this._skillArchiveSelected=null;this.buildSkillArchive();});
  }
  buildStartMenu(){ this.buildMenuScreen(); }   // เผื่อโค้ดเก่าเรียก
  ensureDaily(){
    const d=Save.data.daily||(Save.data.daily={claimDay:'',streak:0,challengeDay:'',challengeDone:false}),spec=dailySpec();
    if(d.challengeDay!==spec.key){d.challengeDay=spec.key;d.challengeDone=false;Save.save();}return{data:d,spec};
  }
  buildDaily(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('📅 Daily Missions');
    const w=this.W,h=this.H,o=this.ensureDaily(),d=o.data,spec=o.spec,claimed=d.claimDay===spec.key,st=STAGES[spec.stage],unlocked=spec.stage<=(Save.data.unlockedStage||0);
    const panel=(y,height,color)=>{const g=this.add.graphics();g.fillStyle(0x241d2d,0.98);g.fillRoundedRect(16,y,w-32,height,16);g.lineStyle(2,color,0.9);g.strokeRoundedRect(16,y,w-32,height,16);this.menu.add(g);return g;};
    const y1=88,h1=Math.min(180,h*0.30);panel(y1,h1,0xffd166);
    const streak=Math.max(0,d.streak||0),reward=50+Math.min(7,Math.max(1,streak+(claimed?0:1)))*15;
    const t1=this.add.text(w/2,y1+25,'🎁 DAILY REWARD',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffe08a'}).setOrigin(0.5);
    const days=this.add.text(w/2,y1+58,Array.from({length:7},(_,i)=>i<streak?'●':'○').join('  '),{fontFamily:'sans-serif',fontSize:'18px',color:'#ffcf5a'}).setOrigin(0.5);
    const info=this.add.text(w/2,y1+88,claimed?'Claimed today · Streak '+streak+' days':'Today reward 🍬 '+reward+' · keep your Streak',{fontFamily:'sans-serif',fontSize:'11px',color:'#cfc2d5'}).setOrigin(0.5);
    const bw=Math.min(w-70,260),by=y1+h1-38,bg=this.add.graphics();bg.fillStyle(claimed?0x3b3541:0xffb020,1);bg.fillRoundedRect(w/2-bw/2,by-20,bw,40,13);const bt=this.add.text(w/2,by,claimed?'Claimed ✓':'Claim',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:claimed?'#8f849f':'#21131a'}).setOrigin(0.5);this.menu.add([t1,days,info,bg,bt]);
    if(!claimed)this._zone(w/2-bw/2,by-20,bw,40,()=>{const yesterday=localDayKey(-1);d.streak=d.claimDay===yesterday?Math.min(7,(d.streak||0)+1):1;d.claimDay=spec.key;Save.addSugar(50+d.streak*15);Sfx.clear();this.showBanner('🎁 Daily Reward','Streak '+d.streak+' days · get 🍬 '+(50+d.streak*15),1700);this.buildDaily();});
    const y2=y1+h1+14,h2=Math.max(150,h-y2-18);panel(y2,h2,0xd95cff);
    const diff=DIFFS[spec.diff-1],t2=this.add.text(w/2,y2+24,'⚔️ DAILY CHALLENGE',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#e7b7ff'}).setOrigin(0.5);
    const name=this.add.text(w/2,y2+54,st.emoji+' '+st.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',wordWrap:{width:w-55},align:'center'}).setOrigin(0.5);
    const detail=this.add.text(w/2,y2+82,diff.emoji+' '+diff.name+' · bonus 🍬 '+(120+spec.diff*30),{fontFamily:'sans-serif',fontSize:'11px',color:'#ffd6a0'}).setOrigin(0.5);
    const state=d.challengeDone?'Completed ✓':unlocked?'Start Challenge':'🔒 Unlock Stage '+(spec.stage+1),cbg=this.add.graphics(),cby=y2+h2-40;cbg.fillStyle(d.challengeDone?0x315142:unlocked?0x8e4fc0:0x3a3341,1);cbg.fillRoundedRect(w/2-bw/2,cby-20,bw,40,13);const cbt=this.add.text(w/2,cby,state,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:d.challengeDone?'#a8f0c0':'#ffffff'}).setOrigin(0.5);this.menu.add([t2,name,detail,cbg,cbt]);
    if(!d.challengeDone&&unlocked)this._zone(w/2-bw/2,cby-20,bw,40,()=>{this._dailyRun=true;this.stageDiff=spec.diff;this.startRun(spec.stage);});
    this.menu.setVisible(true);
  }
  buildEndgame(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Beyond Hunger');const w=this.W,h=this.H,unlocked=Save.endgameUnlocked(),canAscend=Save.canAscend(),asc=Save.data.ascension||0,best=Save.data.endlessBest||0;
    const status=this.add.text(w/2,74,unlocked?'✦ ENDGAME UNLOCKED ✦':'🔒 Complete Mastery on all 5 stages',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:unlocked?'#ffe08a':'#9f91aa'}).setOrigin(0.5);this.menu.add(status);
    const card=(y,color,title,desc,label,fn)=>{const cw=Math.min(w-32,520),x=(w-cw)/2,ch=Math.min(132,h*0.22),g=this.add.graphics();g.fillStyle(0x251a32,0.97);g.fillRoundedRect(x,y,cw,ch,17);g.lineStyle(2,color,0.9);g.strokeRoundedRect(x,y,cw,ch,17);const t=this.add.text(x+18,y+17,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'17px',color:'#ffffff'}),d=this.add.text(x+18,y+47,desc,{fontFamily:'sans-serif',fontSize:'10px',color:'#cfc3dc',wordWrap:{width:cw-36},lineSpacing:4}),b=this.add.text(x+cw-18,y+ch-18,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe08a'}).setOrigin(1,0.5);this.menu.add([g,t,d,b]);if(fn)this._zone(x,y,cw,ch,fn);};
    const y1=100,y2=y1+Math.min(145,h*0.24);card(y1,0xd58cff,'🌙 Midnight Kitchen · Endless','5 waves then a boss, enemies grow stronger each cycle · every 3 cycles The Echo of Hunger appears\nBest '+best+' cycles',unlocked?'Tap to start':'Not unlocked',unlocked?()=>{this._endlessRequested=true;this.stageDiff=Math.max(2,Math.min(3,(Save.data.diffBest?.[4]||2)));this.startRun(4);}:null);
    const confirm=this._ascendConfirm;card(y2,0xffa952,'☀ Ascension '+asc,'Start a new stage journey — resets Mastery/unlocked stages but keeps characters, Gear and Rank, plus a big Sugar bonus per Ascension',canAscend?(confirm?'⚠ Tap again to confirm':'Ascend · gain Sugar '+(350+(asc+1)*150)):'Complete this Mastery run first',canAscend?()=>{if(this._ascendConfirm){const r=Save.ascend();this._ascendConfirm=false;Sfx.clear();this.showBanner('☀ ASCENSION '+Save.data.ascension,'Permanent power up · Sugar +'+r,2200);}else{this._ascendConfirm=true;Sfx.select();}this.buildEndgame();}:null);
    const board=(Save.data.endlessBoard||[]),top=y2+Math.min(150,h*0.25),head=this.add.text(w/2,top,'🏆 Local Endless ranking',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#bfe8ff'}).setOrigin(0.5);this.menu.add(head);
    const lines=board.length?board.map((r,i)=>(i+1)+'. Cycle '+r.cycle+' · ☠'+r.kills+' · '+Math.floor(r.seconds/60)+':'+String(r.seconds%60).padStart(2,'0')+' · '+(CHARACTERS[r.character]?.name||r.character)).join('\n'):'No records yet';const list=this.add.text(w/2,top+24,lines,{fontFamily:'sans-serif',fontSize:'10px',color:'#d8c4e3',align:'center',lineSpacing:5}).setOrigin(0.5,0);this.menu.add(list);this.menu.setVisible(true);
  }
  startTutorial(done,manual=false){
    this._tutorialDone=done;this._tutorialStep=0;this._tutorialManual=manual;this.state='tutorial';this.menu.setVisible(false);this.physics.pause();this.drawTutorial();
  }
  // 🍓 โมโม่เป็นครูสอนเล่น — พูดทีละสเต็ป มีรูปโมโม่ + บับเบิลคำพูด
  tutorialPages(){
    return [
      {e:'👋',t:'Hi! My name is Berry',d:'Welcome to Mochi Mayhem! I will teach you how to play — tap the screen to continue~'},
      {e:'🕹️',t:'Move with the joystick',d:'Hold and drag on the left half of the screen — you move where you drag · keep running from enemies!'},
      {e:'⚔️',t:'Weapon auto-fires!',d:'No need to shoot — your weapon auto-attacks the nearest enemy · your job is to dodge and aim well'},
      {e:'💨',t:'Dash to dodge',d:'Tap the Dash button (bottom-right) to dodge · when you see red ground or boss bullets, Dash out before they hit!'},
      {e:'⭐',t:'Level up = pick a card',d:'Collect EXP orbs to fill the bar and pick a power-up card · max the same card to "Awaken" it for even more power!'},
      {e:'🍳',t:'Cook secret recipes',d:'Your weapon + the matching passive = a special dish! Check the "Recipes" panel on level-up and collect them all'},
      {e:'✨',t:'Unique power',d:'The button above Dash is your ultimate · save it for when you are swarmed or fighting a boss'},
      {e:'🎒',t:'Collect Sugar to upgrade',d:'Kill enemies / clear stages to earn 🍬 Sugar for permanent upgrades and gear · you grow stronger the more you play!'},
      {e:'🔥',t:'Ready to go!',d:'Harder stages give better rewards! Climb up step by step · go have fun in the chaotic kitchen~ 🍡'},
    ];
  }
  drawTutorial(){
    const pages=this._tutPages||(this._tutPages=this.tutorialPages());
    const p=pages[this._tutorialStep]||pages[0],w=this.W,h=this.H,last=this._tutorialStep===pages.length-1;this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x08050e,0.93).setOrigin(0,0);this.over.add(bg);
    // ---- รูปโมโม่ (ครู) มุมล่างซ้าย ----
    const teachH=Math.min(h*0.42,300), teachW=teachH*0.75, tx=w*0.06+teachW/2, ty=h-teachH*0.5-6;
    if(this.textures.exists('card_berry')){ const im=this.add.image(tx,ty,'card_berry'); const s=Math.min(teachW/im.width,teachH/im.height); im.setScale(s); this.over.add(im); }
    else { const em=this.add.text(tx,ty,'🍓',{fontSize:Math.round(teachH*0.5)+'px'}).setOrigin(0.5); this.over.add(em); }
    // ตัวเด้งเบา ๆ ให้Alive
    if(this.over.list.length){ const teacher=this.over.list[this.over.list.length-1]; this.tweens.add({targets:teacher,y:teacher.y-8,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
    // ---- บับเบิลคำพูด ด้านบน ----
    const bx=24,bw=w-48,byy=h*0.10,bh=h*0.40, card=this.add.graphics();
    card.fillStyle(0xfff6fb,0.98);card.fillRoundedRect(bx,byy,bw,bh,22);card.lineStyle(3,0xff9ec4,1);card.strokeRoundedRect(bx,byy,bw,bh,22);
    // หางบับเบิลชี้ไปหาโมโม่
    card.fillStyle(0xfff6fb,0.98);card.fillTriangle(bx+34,byy+bh-2, bx+64,byy+bh-2, bx+20,byy+bh+26);
    this.over.add(card);
    const step=this.add.text(bx+bw-14,byy+12,'Part '+(this._tutorialStep+1)+'/'+pages.length,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#d98cae'}).setOrigin(1,0);
    const em=this.add.text(bx+26,byy+18,p.e,{fontSize:'40px'}).setOrigin(0,0);
    const name=this.add.text(bx+80,byy+22,'Berry',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ff6f9c'}).setOrigin(0,0);
    const title=this.add.text(bx+26,byy+70,p.t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'19px',color:'#3a2740',wordWrap:{width:bw-52}}).setOrigin(0,0);
    const desc=this.add.text(bx+26,byy+70+title.height+10,p.d,{fontFamily:'sans-serif',fontSize:'13.5px',color:'#5a4a63',wordWrap:{width:bw-52},lineSpacing:6}).setOrigin(0,0);
    const hint=this.add.text(w/2,h-24,last?'👆 Tap to start!':'Tap to continue  ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe08a'}).setOrigin(0.5);
    this.over.add([step,em,name,title,desc,hint]);this.over.setVisible(true);Sfx.select();
    // ปุ่มข้าม (ยกเว้นหน้าสุดท้าย)
    if(!last){ const sk=this.add.text(w-16,byy-4,'Skip ✕',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#c7bdd6'}).setOrigin(1,1); this.over.add(sk); this._tutSkip={x:w-70,y:byy-18,w:70,h:24}; }
    else this._tutSkip=null;
  }
  advanceTutorial(){
    const pages=this._tutPages||this.tutorialPages();
    // แตะปุ่มข้าม = จบเลย
    const pt=this.input.activePointer, sk=this._tutSkip;
    if(sk&&pt&&pt.x>=sk.x&&pt.x<=sk.x+sk.w&&pt.y>=sk.y&&pt.y<=sk.y+sk.h){ this._tutorialStep=pages.length-1; }
    if(this._tutorialStep<pages.length-1){this._tutorialStep++;this.drawTutorial();return;}
    Save.data.tutorialDone=true;Save.save();this.over.setVisible(false);this._tutPages=null;this._tutSkip=null;const done=this._tutorialDone;this._tutorialDone=null;if(done)done();
  }
  buildAchievements(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('🏆 Achievement');
    const w=this.W,h=this.H,portrait=w<=h,cols=portrait?1:2,gap=8,side=14,top=portrait?86:60,cw=(w-side*2-gap*(cols-1))/cols,rows=Math.ceil(ACHIEVEMENTS.length/cols),rh=Math.min(portrait?61:58,(h-top-14-gap*(rows-1))/rows);
    let done=0;ACHIEVEMENTS.forEach(a=>{if(a.test(Save.data))done++;});
    const sum=this.add.text(w/2,portrait?69:45,'Completed '+done+' / '+ACHIEVEMENTS.length,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffe08a'}).setOrigin(0.5);this.menu.add(sum);
    ACHIEVEMENTS.forEach((a,i)=>{const col=i%cols,row=Math.floor(i/cols),x=side+col*(cw+gap),y=top+row*(rh+gap),ok=a.test(Save.data),claimed=!!Save.data.achievements[a.id],g=this.add.graphics();
      g.fillStyle(claimed?0x20252b:ok?0x342d25:0x241e2c,0.98);g.fillRoundedRect(x,y,cw,rh,12);g.lineStyle(1.8,claimed?0x537663:ok?0xffd166:0x493e52,1);g.strokeRoundedRect(x,y,cw,rh,12);
      const em=this.add.text(x+24,y+rh/2,a.emoji,{fontSize:'22px'}).setOrigin(0.5).setAlpha(ok?1:0.38),nm=this.add.text(x+47,y+12,a.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:ok?'#ffffff':'#82798d'}).setOrigin(0,0);
      const ds=this.add.text(x+47,y+30,a.desc,{fontFamily:'sans-serif',fontSize:'8.5px',color:'#a99db2'}).setOrigin(0,0),state=this.add.text(x+cw-10,y+rh/2,claimed?'Claimed ✓':ok?'Get 🍬'+a.reward:'Not yet',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:claimed?'#8bd3a0':ok?'#ffe08a':'#6e6576'}).setOrigin(1,0.5);
      this.menu.add([g,em,nm,ds,state]);if(ok&&!claimed)this._zone(x,y,cw,rh,()=>{Save.data.achievements[a.id]=true;Save.addSugar(a.reward);Sfx.clear();this.showBanner(a.emoji+' Achievement unlocked!',a.name+' · get 🍬 '+a.reward,1600);this.buildAchievements();});
    });this.menu.setVisible(true);
  }
  buildSettings(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('⚙️ Settings');
    const w=this.W,h=this.H,st=Save.data.settings||Object.assign({},DEFAULT_SETTINGS),portrait=w<=h;
    const rows=[
      {k:'sound',e:'🔊',n:'Sound & Music',sub:'Turn all audio on or off',value:()=>st.sound?'On':'Off',toggle:()=>{st.sound=!st.sound;Sfx.muted=!st.sound;if(Sfx.master)Sfx.master.gain.value=Sfx.muted?0:0.24;if(this.sound)this.sound.mute=Sfx.muted;}},
      {k:'shake',e:'📳',n:'Screen Shake',sub:'Camera shake strength',value:()=>['Off','Light','Normal'][st.shake||0],toggle:()=>{st.shake=((st.shake||0)+1)%3;}},
      {k:'flash',e:'✨',n:'Screen Flash',sub:'Flashes on big moves & phase changes',value:()=>st.flash?'On':'Off',toggle:()=>{st.flash=!st.flash;}},
      {k:'damageNumbers',e:'💥',n:'Damage Numbers',sub:'Show damage and criticals',value:()=>st.damageNumbers?'On':'Off',toggle:()=>{st.damageNumbers=!st.damageNumbers;}},
      {k:'vfx',e:'🎆',n:'VFX Quality',sub:'Particle count and boss effects',value:()=>['Low','Mid','High'][st.vfx||0],toggle:()=>{st.vfx=((st.vfx||0)+1)%3;}},
    ];
    const nRows=rows.length+1;   // +1 = แถวบัญชี Cloud
    const top=portrait?92:66,gap=portrait?10:8,rowH=Math.min(portrait?68:54,(h-top-28-gap*(nRows-1))/nRows),rw=Math.min(w-30,520),rx=(w-rw)/2;
    rows.forEach((r,i)=>{const y=top+i*(rowH+gap);this._rowBtn(y,rowH,r.e,r.n,r.sub,r.value(),'#ffe08a',()=>{r.toggle();Save.save();Sfx.select();this.buildSettings();},rx,rw);});
    // ☁️ บัญชี Cloud Save + เข้าสู่ระบบด้วย Google
    const accY=top+rows.length*(rowH+gap);
    const isG=(typeof Cloud!=='undefined'&&Cloud.isGoogle&&Cloud.isGoogle());
    const label=(typeof Cloud!=='undefined'&&Cloud.accountLabel)?Cloud.accountLabel():'Not connected';
    this._rowBtn(accY,rowH,isG?'✅':'☁️','Cloud Save Account',isG?('Google: '+label):'Link Google to protect your save + play across devices',isG?'Sign out':'Sign in with Google',isG?'#e0788a':'#8bd3a0',()=>this.doGoogleAuth(isG),rx,rw);
    // โหลดสถานะบัญชีจากคลาวด์ (async) แล้ว rebuild ให้แถวUpdates (เช่น หลังกลับจาก Google redirect โชว์อีเมล)
    if(typeof Cloud!=='undefined'&&Cloud.ensureClient&&!this._acctChecked){ this._acctChecked=true; Cloud.ensureClient().then(()=>{ if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); }); }
    // 🗑️ รีเซ็ตความคืบหน้า — ซ่อนลึกในหน้าSettings + ต้องยืนยัน 3 timesกันกดพลาด (เดิมอยู่หน้า Hub แรกเข้าถึงง่ายไป)
    const rc=this._resetTaps||0;
    const labels=['🗑️ Reset progress (tap to wipe)','⚠️ Tap 2 more times to confirm','⚠️ Tap 1 more time to confirm'];
    const rt=this.add.text(w/2,h-30,labels[Math.min(rc,2)],{fontFamily:'sans-serif',fontSize:'11px',color:rc>0?'#ff8fb5':'#6f6578'}).setOrigin(0.5);this.menu.add(rt);
    this._zone(w/2-140,h-44,280,30,()=>{
      this._resetTaps=(this._resetTaps||0)+1;
      if(this._resetTaps>=3){ Save.reset(); this._resetTaps=0; this.character='momo'; Sfx.clear(); this.menuScreen='hub'; this.buildMenuScreen(); return; }
      Sfx.select(); this.buildSettings();
      clearTimeout(this._resetTapTimer); this._resetTapTimer=setTimeout(()=>{ if(this._resetTaps){ this._resetTaps=0; if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); } },2600);
    });
    const hint=this.add.text(w/2,h-14,'Tap a row to change it · saved automatically',{fontFamily:'sans-serif',fontSize:'10px',color:'#8f849f'}).setOrigin(0.5);this.menu.add(hint);this.menu.setVisible(true);
  }
  // toast ที่เห็นได้ในหน้าเมนู (showBanner ผูกกล้องโลก ไม่โชว์ตอนอยู่เมนู)
  menuToast(msg,color){ if(this._toast){this._toast.destroy();this._toast=null;} if(this._toastBg){this._toastBg.destroy();this._toastBg=null;}
    const w=this.W,y=this.H-88; const g=this.add.graphics(); g.fillStyle(0x1c1626,0.94); g.fillRoundedRect(w/2-170,y-20,340,40,12); g.lineStyle(1.6,0x4a4059,1); g.strokeRoundedRect(w/2-170,y-20,340,40,12);
    const t=this.add.text(w/2,y,msg,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:color||'#ffe08a',align:'center',wordWrap:{width:320}}).setOrigin(0.5);
    if(this.menu){this.menu.add([g,t]);} this._toast=t; this._toastBg=g;
    this.time.delayedCall(2600,()=>{ if(this._toast===t){t.destroy();g.destroy();this._toast=null;this._toastBg=null;} }); }
  // เข้าสู่ระบบ / ออกจากระบบ Google สำหรับ Cloud Save
  doGoogleAuth(signedIn){
    Sfx.select();
    if(typeof Cloud==='undefined'||!Cloud.enabled||!Cloud.enabled()){ this.menuToast('☁️ Cannot reach the cloud (SDK failed) — check your connection and refresh','#ff9bb5'); return; }
    if(signedIn){
      Cloud.signOut().then(()=>{ Save._cloudReady=false; if(Save.syncCloud)Save.syncCloud(); this.menuToast('👋 Signed out — your save stays on this device','#8bd3a0'); if(this.state==='menu'&&this.menuScreen==='settings')this.buildSettings(); });
      return;
    }
    this.menuToast('☁️ Opening Google…','#8bd3a0');
    Cloud.signInGoogle().then(r=>{
      if(!(r&&r.ok)){ this.menuToast('⚠️ '+((r&&r.msg)||'Connection failed — try again'),'#ff9bb5'); }
      // r.ok=true → เบราว์เซอร์รีไดเรกต์ไป Google เอง (ไม่ต้องทำอะไรต่อ)
    }).catch(e=>{ this.menuToast('⚠️ '+String(e&&e.message||e),'#ff9bb5'); });
  }
  // ---- Quest chain + badge helpers ----
  claimReadyQuests(){ const d=Save.data; if(!d.questClaimed)d.questClaimed={}; let claimed=null,total=0;
    for(const q of QUESTS){ if(q.done(d)&&!d.questClaimed[q.id]){ d.questClaimed[q.id]=1; d.sugar=(d.sugar||0)+q.r; total+=q.r; claimed=q; } }
    if(claimed){ Save.save(); if(this.menuToast)this.menuToast('🎯 Quest complete! +🍬'+total+' · '+claimed.t,'#ffe08a'); Sfx.clear&&Sfx.clear(); }   // menuToast is safe in the hub (bannerT not built there)
  }
  nextQuest(){ const d=Save.data; for(const q of QUESTS){ if(!q.done(d))return q; } return null; }
  hasActivityBadge(){ try{ const d=Save.data; const daily=(d.daily&&d.daily.claimDay)!==localDayKey();
    const ach=ACHIEVEMENTS.some(a=>a.test(d)&&!(d.achievements||{})[a.id]); return daily||ach; }catch(e){ return false; } }
  hasNewsBadge(){ return Save.data.seenVersion!==GAME_VERSION; }
  drawBadgeDot(cont,x,y){ const g=this.add.graphics(); g.fillStyle(0x000000,0.4); g.fillCircle(x+1,y+1,7); g.fillStyle(0xff3b5c,1); g.fillCircle(x,y,6.5); g.lineStyle(1.5,0xffffff,0.95); g.strokeCircle(x,y,6.5); cont.add(g);
    this.tweens.add({targets:g,alpha:{from:1,to:0.45},duration:640,yoyo:true,repeat:-1}); return g; }
  buildHub(){
    this.claimReadyQuests();
    const w=this.W,h=this.H; this.menu.removeAll(true); this.tapZones=[];
    const portrait=w<=h;
    const center=w/2;
    const bg=this.textures.exists('menu_hub_v3')?this._coverImage(0,0,w,h,'menu_hub_v3'):this.add.rectangle(0,0,w,h,0x1a1420,1).setOrigin(0,0);
    // Main Menu motion: subtle camera drift on the existing background (mobile-safe)
    if(bg && bg.type==='Image'){
      const baseX=bg.x, baseY=bg.y, baseSX=bg.scaleX, baseSY=bg.scaleY;
      this.tweens.add({targets:bg, x:baseX+4, y:baseY-3, scaleX:baseSX*1.045, scaleY:baseSY*1.045,
        duration:10000, yoyo:true, repeat:-1, ease:'Sine.inOut'});
    }
    // Main Menu parallax layers: visible separation between background, midground and foreground
    const midground=this.add.container(0,0).setDepth(2);
    const foreground=this.add.container(0,0).setDepth(3);

    // Midground: large soft candy lights drift at a different speed than the background
    const midLights=[
      [w*0.16,h*0.30,Math.min(w,h)*0.28,0xff85b3,0.10],
      [w*0.88,h*0.55,Math.min(w,h)*0.34,0x66d3b3,0.08],
      [w*0.52,h*0.78,Math.min(w,h)*0.24,0xa98cf0,0.08],
    ];
    midLights.forEach(([x,y,size,color,alpha],i)=>{
      const orb=this.add.ellipse(x,y,size,size,color,alpha); midground.add(orb);
      this.tweens.add({targets:orb,x:x+(i%2?18:-14),y:y-(i+1)*8,scaleX:1.12,scaleY:0.88,
        duration:6500+i*900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    });

    // Foreground: clearly readable floating motes and a slow light sweep
    const sparkleColors=[0xffd166,0xff9ec4,0xa8e6cf,0xbfe8ff,0xfff3d6];
    for(let i=0;i<12;i++){
      const sx=16+((i*67)%Math.max(28,w-32)), sy=h*(0.14+((i*41)%70)/100), sz=2+(i%3)*1.4;
      const sp=this.add.ellipse(sx,sy,sz*2.2,sz*2.2,sparkleColors[i%sparkleColors.length],0.78);
      foreground.add(sp);
      this.tweens.add({targets:sp,x:sx+(i%2?10:-8),y:sy-18-(i%4)*7,alpha:{from:0.18,to:0.95},
        duration:1300+(i%5)*260,delay:i*120,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    }
    const sweep=this.add.rectangle(-w*0.25,h*0.40,w*0.62,7,0xfff3d6,0.18).setAngle(-18);
    foreground.add(sweep);
    this.tweens.add({targets:sweep,x:w*1.25,duration:7200,repeat:-1,repeatDelay:2200,ease:'Sine.inOut'});

    const shade=this.add.graphics();shade.fillGradientStyle(0x100817,0x100817,0x090611,0x090611,0.05,0.05,0.50,0.88);shade.fillRect(0,0,w,h);
    const topG=this.add.graphics();topG.fillStyle(0x090713,0.72);topG.fillRoundedRect(12,13,96,32,12);topG.lineStyle(1.2,0xffffff,0.18);topG.strokeRoundedRect(12,13,96,32,12);
    const sugar=this.add.text(24,29,'🍬 '+(Save.data.sugar||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffe5a6'}).setOrigin(0,0.5);
    const logoY=portrait?h*0.505:h*0.47;
    const title=this.add.text(center,logoY,'MOCHI MAYHEM',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(31,w*0.082)+'px',color:'#fff4ef',stroke:'#4b102b',strokeThickness:5,align:'center'}).setOrigin(0.5);
    title.setShadow(0,3,'#000000',4);
    const subtitle=this.add.text(center,logoY+27,'F L A V O R B O U N D',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffd27d'}).setOrigin(0.5);
    const ch=CHARACTERS[this.character||'momo'];
    const charTxt=this.add.text(center,logoY+47,`${ch.emoji} ${ch.name}  ·  ${CHARACTER_UNIQUES[ch.unique].name}`,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#f4d8c4',align:'center'}).setOrigin(0.5);
    this.menu.add([bg,midground,foreground,shade,topG,sugar,title,subtitle,charTxt]);
    // ป้ายเวอร์ชัน (มุมขวาบน) — แตะดูUpdates/ดาวน์โหลด
    const vg=this.add.graphics(); vg.fillStyle(0x090713,0.72); vg.fillRoundedRect(w-106,13,94,32,12); vg.lineStyle(1.2,0xffffff,0.18); vg.strokeRoundedRect(w-106,13,94,32,12);
    const vt=this.add.text(w-59,29,'v'+GAME_VERSION+'  📢',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#eadff2'}).setOrigin(0.5);
    this.menu.add([vg,vt]); this._zone(w-106,13,94,32,()=>{ this.menuScreen='news'; this.buildMenuScreen(); });
    if(this.hasNewsBadge())this.drawBadgeDot(this.menu,w-16,15);   // 🔴 มีUpdatesใหม่
    // 🎯 Next Quest (Quest chain) — บอกเป้าหมายให้ผู้เล่นรู้ว่าจะเล่นเพื่ออะไร
    const nq=this.nextQuest();
    if(nq){ const qx=12,qy=50,qw=w-24,qh=32, qg=this.add.graphics();
      qg.fillStyle(0x2a1c3a,0.9); qg.fillRoundedRect(qx,qy,qw,qh,10); qg.lineStyle(1.6,0xffd166,0.8); qg.strokeRoundedRect(qx,qy,qw,qh,10);
      const qt=this.add.text(qx+10,qy+9,'🎯 Next: '+nq.t,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffe6a3',wordWrap:{width:qw-92}}).setOrigin(0,0);
      const qr=this.add.text(qx+qw-10,qy+qh/2,'🍬'+nq.r+' ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#a8f0c0'}).setOrigin(1,0.5);
      this.menu.add([qg,qt,qr]); this._zone(qx,qy,qw,qh,()=>{ Sfx.select&&Sfx.select(); this.menuScreen=nq.go; this.buildMenuScreen(); });
    }
    const items=[
      [COLORS.pink, '▶','Play','Choose a stage',()=>{ this.menuScreen='chapter'; this.buildMenuScreen(); }],
      [COLORS.toast,'🍓','Heroes','Choose & awaken',()=>{ this.menuScreen='char'; this.buildMenuScreen(); }],
      [COLORS.grape,'🎒','Gear & Power','Equipment · Craft',()=>{ this.menuScreen='gLoadout'; this.buildMenuScreen(); }],
      [0xe06f75,    '🎉','Activities','Daily · Achievements',()=>{ this.menuScreen='gActivity'; this.buildMenuScreen(); }],
      [0x8f7de8,    '📖','Codex','Skills · Bestiary',()=>{ this.menuScreen='gCodex'; this.buildMenuScreen(); }],
      [0x5f7896,    '⚙','More','Settings · Guide',()=>{ this.menuScreen='gMore'; this.buildMenuScreen(); }],
    ];
    const left=portrait?center:w*0.27;
    const areaL=portrait?12:Math.max(w*0.47,330), areaR=portrait?w-12:w-18;
    const cols=portrait?(items.length>4?2:1):2, gapX=portrait?(cols===2?6:0):10, gapY=portrait?9:12;
    const bw=portrait?(cols===2?(areaR-areaL-gapX)/2:Math.min(w-24,390)):Math.min(205,(areaR-areaL-gapX)/2);
    const menuTop=Math.max(logoY+72,h*0.57),menuBottom=h-24;
    const menuRows=Math.ceil(items.length/cols);
    const bh=portrait?Math.min(76,Math.max(54,(menuBottom-menuTop-gapY*(menuRows-1))/menuRows)):Math.min(58,(h-72-gapY*(menuRows-1))/menuRows);
    const totalW=bw*cols+gapX*(cols-1), x0=portrait?(w-totalW)/2+bw/2:areaL+(areaR-areaL-totalW)/2+bw/2, y0=portrait?menuTop+bh/2:74+bh/2;
    // ค่อย ๆ ปลดLockedเมนู — คนใหม่ไม่เจอทุกอย่างพร้อมกัน (ปลดตามด่านที่ผ่าน)
    const us=Save.data.unlockedStage||0, need=[0,0,1,2,1,0];   // idx: เริ่ม/นักสู้/คลัง/กิจกรรม/คัมภีร์/อื่นๆ
    items.forEach(([color,emoji,label,sub,fn],i)=>{
      const col=i%cols,row=Math.floor(i/cols),cx=x0+col*(bw+gapX),cy=y0+row*(bh+gapY);
      if(us<need[i]){
        this.uiMenuCard(this.menu,cx,cy,bw,bh,0x565266,'🔒',label,'Clear Stage '+need[i]+' to unlock',()=>{this.menuToast&&this.menuToast('🔒 Locked — clear Stage '+need[i]+' first','#ff9bb5');Sfx.select&&Sfx.select();},false); }
      else { this.uiMenuCard(this.menu,cx,cy,bw,bh,color,emoji,label,sub,fn,i===0);
        if(i===3&&this.hasActivityBadge())this.drawBadgeDot(this.menu,cx+bw/2-8,cy-bh/2+8); }   // 🔴 Daily/Achievement Waitรับ
    });
    // แจ้งเตือนเมื่อมีเมนูใหม่เพิ่งปลดLocked (ครั้งเดียว)
    const seen=Save.data.hubUnlockSeen||0;
    if(us>seen){ if(need.some(n=>n>seen&&n<=us))this.time.delayedCall(350,()=>{if(this.state==='menu'&&this.menuScreen==='hub'&&this.menuToast)this.menuToast('🔓 New menu unlocked! Go explore~','#8bd3a0');}); Save.data.hubUnlockSeen=us; Save.save(); }
    // ปุ่มรีเซ็ตเซฟย้ายไปหน้า "Settings" แล้ว (buildSettings) — กันกดพลาดตั้งแต่หน้าแรก
    this.menu.setVisible(true);
  }
  _characterCardArt(id,cx,cy,maxW,maxH,alpha=1){
    const key='card_'+id;if(!this.textures.exists(key))return null;
    const sp=this.add.image(cx,cy,key).setOrigin(0.5).setAlpha(alpha),scale=Math.min(maxW/sp.width,maxH/sp.height);
    sp.setScale(scale);this.menu.add(sp);return sp;
  }
  buildChars(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Fighters of the Mochi Core');
    const w=this.W,h=this.H,landscape=w>h,cols=landscape?6:2,gap=landscape?7:10,y0=landscape?76:Math.max(92,h*0.105);
    const rows=Math.ceil(CHAR_ORDER.length/cols),side=landscape?10:14,cardW=(w-side*2-gap*(cols-1))/cols;
    const cardH=Math.min(landscape?Math.max(185,h-y0-14):260,(h-y0-14-gap*(rows-1))/rows);
    const formNote=this.add.text(w/2,landscape?59:76,'Choose Character Card · Core Form ⇄ Awakened Form',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:landscape?'9px':'11px',color:'#bfe8ff'}).setOrigin(0.5);this.menu.add(formNote);
    CHAR_ORDER.forEach((id,i)=>{const c=CHARACTERS[id],row=Math.floor(i/cols),col=i%cols,rowCount=Math.min(cols,CHAR_ORDER.length-row*cols),rowW=rowCount*cardW+(rowCount-1)*gap,x0=(w-rowW)/2,x=x0+col*(cardW+gap),y=y0+row*(cardH+gap);
      const owned=Save.data.chars.includes(id),selected=Save.data.character===id,afford=(Save.data.sugar||0)>=c.cost,border=selected?0xffd166:(owned?0x8bd3a0:(afford?0xbfe8ff:0x665b73));
      const panel=this.add.graphics();panel.fillStyle(selected?0x35273d:0x241a33,0.94);panel.fillRoundedRect(x,y,cardW,cardH,landscape?12:16);panel.lineStyle(selected?3:1.7,border,selected?1:0.82);panel.strokeRoundedRect(x,y,cardW,cardH,landscape?12:16);this.menu.add(panel);
      const artH=cardH*(landscape?0.50:0.52),art=this._characterCardArt(id,x+cardW/2,y+8+artH/2,cardW*0.92,artH,owned||afford?1:0.42);
      if(!art){const em=this.add.text(x+cardW/2,y+artH/2,c.emoji,{fontSize:landscape?'40px':'54px'}).setOrigin(0.5);this.menu.add(em);}
      const name=this.add.text(x+cardW/2,y+artH+4,c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:landscape?'10px':'13px',color:'#ffffff',align:'center',wordWrap:{width:cardW-10},maxLines:1}).setOrigin(0.5,0);
      const sw=SIGNATURE_WEAPONS[c.weapon],weapon=this.add.text(x+cardW/2,y+artH+(landscape?19:24),sw.emoji+' '+sw.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:landscape?'8px':'10px',color:'#f4d694',align:'center',wordWrap:{width:cardW-10},maxLines:1}).setOrigin(0.5,0);
      const r=c.rating,stats=this.add.text(x+cardW/2,y+artH+(landscape?34:42),'❤️'+r.hp+'  💥'+r.atk+'  👟'+r.spd+'  🛡️'+r.def,{fontFamily:'sans-serif',fontSize:landscape?'8px':'9px',color:'#d9c9e8',align:'center'}).setOrigin(0.5,0);
      const role=this.add.text(x+cardW/2,y+artH+(landscape?48:58),c.role,{fontFamily:'sans-serif',fontSize:landscape?'7px':'9px',color:'#aee8dc',align:'center',wordWrap:{width:cardW-10},maxLines:1}).setOrigin(0.5,0);
      const label=selected?'Selected ✓':(owned?'Tap to select':'🍬 '+c.cost),status=this.add.text(x+cardW/2,y+cardH-12,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:landscape?'9px':'11px',color:selected?'#ffd166':(owned?'#8bd3a0':(afford?'#bfe8ff':'#e0788a'))}).setOrigin(0.5);this.menu.add([name,weapon,stats,role,status]);
      if(!selected)this._zone(x,y,cardW,cardH,()=>{if(owned){Save.data.character=id;Save.save();this.character=id;Sfx.select();}else if(Save.spend(c.cost)){Save.data.chars.push(id);Save.data.character=id;Save.save();this.character=id;Sfx.clear();}this.buildMenuScreen();});
    });
    this.menu.setVisible(true);
  }
  buildChapterSelect(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Choose Chapter');
    const w=this.W,h=this.H,portrait=w<=h,cols=portrait?1:2,gap=9,side=14,top=portrait?88:62;
    const cw=(w-side*2-gap*(cols-1))/cols,rows=Math.ceil(CHAPTERS.length/cols),ch=Math.min(portrait?94:82,(h-top-16-gap*(rows-1))/rows);
    CHAPTERS.forEach((c,i)=>{const col=i%cols,row=Math.floor(i/cols),x=side+col*(cw+gap),y=top+row*(ch+gap),progressOpen=i===0||!!(Save.data.stageMastery||{})[4],open=!!c.ready&&progressOpen;
      const coverKey=i===0?'chapter1_cover':i===1?'chapter2_cover':null,art=coverKey&&this.textures.exists(coverKey)?this._coverImage(x+2,y+2,cw-4,ch-4,coverKey):null;if(art)this.menu.add(art);
      const g=this.add.graphics();g.fillStyle(open?0x17101f:0x1d1924,art?0.48:0.97);g.fillRoundedRect(x,y,cw,ch,15);g.lineStyle(open?2.4:1.5,open?0xffc85a:0x4b4354,open?0.95:0.65);g.strokeRoundedRect(x,y,cw,ch,15);
      if(open){g.fillStyle(0xffc85a,0.12);g.fillRoundedRect(x+3,y+3,cw-6,ch-6,12);}
      const icon=this.add.text(x+30,y+ch/2,open?c.emoji:'🔒',{fontSize:open?'30px':'25px'}).setOrigin(0.5),name=this.add.text(x+57,y+18,c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:open?'#fff4df':'#98909f'}).setOrigin(0,0);
      const desc=this.add.text(x+57,y+40,c.desc,{fontFamily:'sans-serif',fontSize:'9px',color:open?'#cfc2d5':'#746d7a',wordWrap:{width:cw-126},maxLines:2}).setOrigin(0,0);
      const state=this.add.text(x+cw-13,y+ch/2,open?'Enter  ▶':c.ready?'Clear Chapter 1':'Coming soon',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:open?'#ffe08a':'#756d7e'}).setOrigin(1,0.5);
      this.menu.add([g,icon,name,desc,state]);this._zone(x,y,cw,ch,open?()=>{this.selectedChapter=i;this.menuScreen='stage';this.buildMenuScreen();}:()=>this.showBanner('🔒 '+c.name,c.ready?'Defeat The Great Hunger and clear Chapter 1 first':'This Chapter is in development',1200));
    });this.menu.setVisible(true);
  }
  buildStageSelect(){
    const chapterIndex=Phaser.Math.Clamp(this.selectedChapter||0,0,CHAPTERS.length-1),chapter=CHAPTERS[chapterIndex],range=chapter.stages||[0,STAGES.length-1],stageIds=[];for(let i=range[0];i<=range[1];i++)stageIds.push(i);
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Choose stage · Chapter '+(chapterIndex+1),null,'chapter');
    const unlocked=Math.max(0,Save.data.unlockedStage||0);
    const note=this.add.text(this.W/2,this.W<=this.H?83:55,'CHAPTER SELECT  ·  Power ⚡ '+Save.power(Save.data.character),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#d3bce1'}).setOrigin(0.5);
    this.menu.add(note);
    const portrait=this.W<=this.H,cols=portrait?1:2,gapX=10,gapY=portrait?10:8,cardW=portrait?Math.min(this.W-28,410):Math.min(370,(this.W-38)/2),totalW=cardW*cols+gapX*(cols-1),x0=(this.W-totalW)/2;
    const rows=Math.ceil(stageIds.length/cols),y0=portrait?100:69,rowH=Math.min(portrait?112:90,(this.H-y0-18-gapY*(rows-1))/rows);
    stageIds.forEach((i,pos)=>{const st=STAGES[i],col=pos%cols,row=Math.floor(pos/cols),x=x0+col*(cardW+gapX),y=y0+row*(rowH+gapY),open=i<=unlocked;
      this.uiStageCard(this.menu,x,y,cardW,rowH,st,i,open,()=>this.openDifficultyChoice(i));
    });
    this.menu.setVisible(true);
  }
  // เลือกระดับความยาก 1-5 ก่อนเข้าStage — กฎเหล็ก: ยิ่งยาก ศัตรูยิ่งถึก/แรง แต่better rewards
  openDifficultyChoice(idx){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Choose Difficulty');
    const st=STAGES[idx],portrait=this.W<=this.H,best=(Save.data.diffBest||[])[idx]||0;
    const t=this.add.text(this.W/2,portrait?78:52,st.emoji+' '+st.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffe07a'}).setOrigin(0.5);
    const sub=this.add.text(this.W/2,portrait?98:70,'Harder enemies — but better rewards 🏆',{fontFamily:'sans-serif',fontSize:'10px',color:'#cdbfe0'}).setOrigin(0.5);
    this.menu.add([t,sub]);
    const x=Math.max(16,(this.W-Math.min(this.W-28,420))/2),w=Math.min(this.W-28,420),gap=8;
    const maxUnlocked=Math.min(DIFFS.length,best+1);   // ปลดได้สูงสุด = ผ่านล่าสุด +1 (ต้องผ่านระดับก่อนหน้าก่อน)
    const rec=Math.min(this.recommendedDiff(idx),maxUnlocked),recD=DIFFS[rec-1];
    // ▶ ปุ่มเล่นเลย (แนะนำอัตโนมัติจาก Power) — กดเดียวจบ ไม่ต้องคิด
    const pby=portrait?116:88,pbh=46,pg=this.add.graphics();
    pg.fillStyle(0x2f4a38,1);pg.fillRoundedRect(x,pby,w,pbh,13);pg.lineStyle(2.5,0x66e0a0,1);pg.strokeRoundedRect(x,pby,w,pbh,13);
    const pl=this.add.text(x+16,pby+pbh*0.32,'▶ Play Now',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffffff'}).setOrigin(0,0.5);
    const pr=this.add.text(x+w-16,pby+pbh*0.32,'Suggested: '+recD.emoji+' '+recD.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#a8f0c0'}).setOrigin(1,0.5);
    const ps=this.add.text(x+16,pby+pbh*0.74,'Matched to your power · pick a level below',{fontFamily:'sans-serif',fontSize:'9px',color:'#bfe8cf'}).setOrigin(0,0.5);
    this.menu.add([pg,pl,pr,ps]); this._zone(x,pby,w,pbh,()=>{ this._dailyRun=false; this.stageDiff=rec; this.startRun(idx); });
    const y0=pby+pbh+12;
    const rowH=Math.min(portrait?66:50,(this.H-y0-64-gap*2)/DIFFS.length);
    DIFFS.forEach((d,i)=>{
      const y=y0+i*(rowH+gap), g=this.add.graphics(), isRec=d.lv===rec;
      const locked=d.lv>maxUnlocked;   // ยังไม่ปลด = ต้องผ่านระดับก่อนหน้าก่อน
      g.fillStyle(locked?0x1b1622:0x241a30,0.96);g.fillRoundedRect(x,y,w,rowH,12);g.lineStyle(isRec?3:2.5,locked?0x4a4055:d.color,locked?0.6:(isRec?1:0.9));g.strokeRoundedRect(x,y,w,rowH,12);g.fillStyle(locked?0x4a4055:d.color,1);g.fillRoundedRect(x,y,7,rowH,4);
      const cleared=best>=d.lv;
      const label=this.add.text(x+20,y+rowH*0.30,(locked?'🔒 ':'')+d.emoji+' '+d.name+(cleared?'  ✓':'')+(isRec?'   ⭐Suggested':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:locked?'#7d7389':'#ffffff'}).setOrigin(0,0.5);
      const info=this.add.text(x+20,y+rowH*0.72,locked?('Clear '+DIFFS[d.lv-2].name+' first to unlock'):('Enemy HP ×'+d.hp.toFixed(1)+' · DMG ×'+d.dmg.toFixed(2)),{fontFamily:'sans-serif',fontSize:'10px',color:locked?'#8a7f97':'#bfb5ca'}).setOrigin(0,0.5);
      const rw=this.add.text(x+w-16,y+rowH/2,locked?'🔒':('🏆 Reward ×'+d.reward.toFixed(1)),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:locked?'#7d7389':'#'+d.color.toString(16).padStart(6,'0')}).setOrigin(1,0.5);
      this.menu.add([g,label,info,rw]);
      if(locked){ this._zone(x,y,w,rowH,()=>{ Sfx.select&&Sfx.select(); this.menuToast&&this.menuToast('🔒 Clear '+DIFFS[d.lv-2].name+' first','#ff9bb5'); }); }
      else this._zone(x,y,w,rowH,()=>{ this._dailyRun=false; this.stageDiff=d.lv; this.startRun(idx); });
    });
    const by=this.H-52, zmOn=Save.zoneModsUnlocked();
    if(zmOn){ const half=(w-8)/2;
      const bg2=this.add.graphics();bg2.fillStyle(0x2a2036,0.96);bg2.fillRoundedRect(x,by,half,38,10);bg2.lineStyle(1.6,0x51445f,1);bg2.strokeRoundedRect(x,by,half,38,10);
      const bt=this.add.text(x+half/2,by+19,'‹ Back',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#cbb8e0'}).setOrigin(0.5);
      this.menu.add([bg2,bt]); this._zone(x,by,half,38,()=>this.buildStageSelect());
      const nMods=Save.zoneMods().length,mg=this.add.graphics();mg.fillStyle(nMods?0x4a2f2a:0x2a2036,0.96);mg.fillRoundedRect(x+half+8,by,half,38,10);mg.lineStyle(1.6,nMods?0xff8f6a:0x51445f,1);mg.strokeRoundedRect(x+half+8,by,half,38,10);
      const mt=this.add.text(x+half+8+half/2,by+19,'⚡ Modifiers'+(nMods?' ('+nMods+')':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:nMods?'#ffbfa0':'#cbb8e0'}).setOrigin(0.5);
      this.menu.add([mg,mt]); this._zone(x+half+8,by,half,38,()=>this.buildZoneModifiers(idx));
    } else {
      const bg2=this.add.graphics();bg2.fillStyle(0x2a2036,0.96);bg2.fillRoundedRect(x,by,w,38,10);bg2.lineStyle(1.6,0x51445f,1);bg2.strokeRoundedRect(x,by,w,38,10);
      const bt=this.add.text(this.W/2,by+19,'‹ Back to stages',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#cbb8e0'}).setOrigin(0.5);
      this.menu.add([bg2,bt]); this._zone(x,by,w,38,()=>this.buildStageSelect());
    }
    // แถบบอก Zone Modifiers ที่เปิดอยู่ (ถ้ามี)
    if(zmOn&&Save.zoneMods().length){ const names=Save.zoneMods().map(id=>{const m=ZONE_MODIFIERS.find(x=>x.id===id);return m?m.emoji:'';}).join(' ');
      const zt=this.add.text(this.W/2,portrait?110:82,'⚡ '+names+'  (harder · better rewards)',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffbfa0'}).setOrigin(0.5); this.menu.add(zt); }
    this.menu.setVisible(true);
  }
  // แผงเลือก Zone Modifiers (สแตกได้ · เปิดเยอะ = ยาก+รางวัลดี) — เปิดจากหน้าเลือกความยาก
  buildZoneModifiers(idx){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('⚡ Zone Modifiers');
    const w=this.W,h=this.H,portrait=w<=h,x=Math.max(16,(w-Math.min(w-28,420))/2),cw=Math.min(w-28,420);
    const active=Save.zoneMods();let rMul=1; for(const id of active){const m=ZONE_MODIFIERS.find(z=>z.id===id);if(m)rMul*=m.reward;}
    const sub=this.add.text(w/2,portrait?80:74,'Stack challenges for bigger rewards · combined ×'+rMul.toFixed(2),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffbfa0'}).setOrigin(0.5);
    const sub2=this.add.text(w/2,portrait?96:90,'Applies on top of the difficulty you pick',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#9a90ab'}).setOrigin(0.5);
    this.menu.add([sub,sub2]);
    let y=portrait?112:106; const rh=62,gap=8;
    ZONE_MODIFIERS.forEach(m=>{ const on=active.includes(m.id),g=this.add.graphics();   // อ่านอย่างเดียว (เปลี่ยนได้ด้วย Reroll เท่านั้น)
      g.fillStyle(on?0x3a2a26:0x201a28,0.97);g.fillRoundedRect(x,y,cw,rh,12);g.lineStyle(on?2.5:1.4,on?0xff8f6a:0x38304a,1);g.strokeRoundedRect(x,y,cw,rh,12);g.fillStyle(on?0xff8f6a:0x38304a,1);g.fillRoundedRect(x,y,6,rh,4);
      const em=this.add.text(x+30,y+rh/2,m.emoji,{fontSize:'26px'}).setOrigin(0.5).setAlpha(on?1:0.4);
      const nm=this.add.text(x+56,y+13,m.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:on?'#ffe08a':'#8a7f97'}).setOrigin(0,0);
      const ds=this.add.text(x+56,y+32,m.desc,{fontFamily:'sans-serif',fontSize:'9.5px',color:on?'#b7abc9':'#6a6076'}).setOrigin(0,0);
      const rw=this.add.text(x+cw-16,y+18,'🏆 ×'+m.reward.toFixed(2),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:on?'#ffd166':'#6a6076'}).setOrigin(1,0);
      const tog=this.add.text(x+cw-16,y+38,on?'✓ ROLLED':'—',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:on?'#8bd3a0':'#6a6076'}).setOrigin(1,0);
      this.menu.add([g,em,nm,ds,rw,tog]); y+=rh+gap; });
    // ปุ่ม Reroll (ใช้ currency) + Clear (ฟรี) — สุ่มชุด mod ใหม่ กันเปิดครบทุกอันฟรี (เฟ้อ)
    const rerollKey='chaos',cur=currencyDef(rerollKey),have=Save.currency(rerollKey),half=(cw-8)/2,canReroll=have>=1;
    const rg=this.add.graphics();rg.fillStyle(canReroll?0x4a2f2a:0x2a2036,0.97);rg.fillRoundedRect(x,y,half,42,11);rg.lineStyle(1.8,canReroll?0xff8f6a:0x51445f,1);rg.strokeRoundedRect(x,y,half,42,11);
    const rt=this.add.text(x+half/2,y+15,'🎲 Reroll mods',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:canReroll?'#ffbfa0':'#8d8195'}).setOrigin(0.5);
    const rc=this.add.text(x+half/2,y+30,cur.emoji+' '+cur.name+'  '+have+'/1',{fontFamily:'sans-serif',fontSize:'8px',color:canReroll?'#ffd9c0':'#8d8195'}).setOrigin(0.5);
    this.menu.add([rg,rt,rc]);this._zone(x,y,half,42,()=>this.rerollZoneMods(idx));
    const cg=this.add.graphics();cg.fillStyle(active.length?0x2a2036:0x24303a,0.97);cg.fillRoundedRect(x+half+8,y,half,42,11);cg.lineStyle(1.8,0x51445f,1);cg.strokeRoundedRect(x+half+8,y,half,42,11);
    const ct=this.add.text(x+half+8+half/2,y+21,active.length?'✖ Clear (safe run)':'No modifiers',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:active.length?'#cbb8e0':'#7a7088'}).setOrigin(0.5);
    this.menu.add([cg,ct]);if(active.length)this._zone(x+half+8,y,half,42,()=>{Save.data.zoneMods=[];Save.save();Sfx.select&&Sfx.select();this.buildZoneModifiers(idx);});
    const by=h-52,bg2=this.add.graphics();bg2.fillStyle(0x2a2036,0.96);bg2.fillRoundedRect(x,by,cw,38,10);bg2.lineStyle(1.6,0x51445f,1);bg2.strokeRoundedRect(x,by,cw,38,10);
    const bt=this.add.text(w/2,by+19,'‹ Done',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#cbb8e0'}).setOrigin(0.5);
    this.menu.add([bg2,bt]); this._zone(x,by,cw,38,()=>this.openDifficultyChoice(idx));
    this.menu.setVisible(true);
  }
  rerollZoneMods(idx){ if(Save.currency('chaos')<1){ Sfx.select&&Sfx.select(); this.menuToast&&this.menuToast('Need '+currencyDef('chaos').emoji+' '+currencyDef('chaos').name+' to reroll','#ff9bb5'); return; }
    Save.spendCurrency('chaos',1); const n=1+Math.floor(Math.random()*3),pool=ZONE_MODIFIERS.map(m=>m.id),picked=[]; while(picked.length<n&&pool.length)picked.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    Save.data.zoneMods=picked; Save.save(); Sfx.clear&&Sfx.clear(); this.buildZoneModifiers(idx); }
  buildUpgrade(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Flavor Weave Temple','ui_talent_hall');
    const w=this.W,h=this.H, rank=Save.data.rank||0, allMax=Save.talAllMax();
    const portrait=w<=h,ry=portrait?82:55;
    const rk=this.add.text(w/2,ry,'Current weave rank',{fontFamily:'sans-serif',fontSize:'10px',color:'#d9c9e8'}).setOrigin(0.5);
    const rn=this.add.text(w/2,ry+17,'⭐ '+rankName(rank),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#ffd166'}).setOrigin(0.5);
    this.menu.add([rk,rn]);
    // ปุ่มเข้าหน้า Rank Perks (โชว์ RP ที่ยังใช้ได้)
    const rpFree=Save.rankPointsFree(), rkW=124,rkH=30,rkX=w-14-rkW,rkY=portrait?70:44;
    const rkg=this.add.graphics(); rkg.fillStyle(rpFree>0?0x4a3a1a:0x2c2338,1); rkg.fillRoundedRect(rkX,rkY,rkW,rkH,9); rkg.lineStyle(1.5,rpFree>0?0xffd166:0x4a4059,1); rkg.strokeRoundedRect(rkX,rkY,rkW,rkH,9);
    const rkt=this.add.text(rkX+rkW/2,rkY+rkH/2,rpFree>0?('🏅 Perks · '+rpFree+' RP'):'🏅 Rank Perks',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:rpFree>0?'#ffe08a':'#cbbfda'}).setOrigin(0.5);
    this.menu.add([rkg,rkt]); this._zone(rkX,rkY,rkW,rkH,()=>{ this.menuScreen='perks'; this.buildMenuScreen(); });
    const barW=Math.min(w-(portrait?64:180),420), bx=w/2-barW/2, by=portrait?126:86, barH=9, need=UPG_ORDER.length*TAL_MAX;
    const frac=Phaser.Math.Clamp(Save.talFilled()/need,0,1);
    const bg=this.add.graphics(); bg.fillStyle(0x2c2338,1); bg.fillRoundedRect(bx,by,barW,barH,6);
    bg.fillStyle(allMax?0x8bd3a0:0xffc24a,1); if(frac>0)bg.fillRoundedRect(bx,by,Math.max(barH,barW*frac),barH,6);
    this.menu.add(bg);
    const prog=this.add.text(w/2,by+17,'Woven core power '+Save.talFilled()+' / '+need+(allMax?' · ready to weave':''),
      {fontFamily:'sans-serif',fontSize:'10px',color:allMax?'#8bd3a0':'#8f849f'}).setOrigin(0.5);
    this.menu.add(prog);
    const marginX=16,gapX=portrait?0:10,gapY=10,cardW=portrait?w-marginX*2:(w-marginX*2-gapX*2)/3,cardH=portrait?Math.min(106,(h-238-gapY*2)/3):Math.min(132,h-170),top=portrait?166:112;
    UPG_ORDER.forEach((k,i)=>{ const u=UPGRADES[k], lvl=Save.talLvl(k), tot=Save.talTotal(k), maxed=lvl>=TAL_MAX;
      const cost=maxed?0:Save.talCost(k), afford=(Save.data.sugar||0)>=cost;
      const x=portrait?marginX:marginX+i*(cardW+gapX), y=portrait?top+i*(cardH+gapY):top;
      const g=this.add.graphics(); g.fillStyle(0x2c2338,1); g.fillRoundedRect(x,y,cardW,cardH,16);
      g.lineStyle(2.5,maxed?0x8bd3a0:u.color,0.9); g.strokeRoundedRect(x,y,cardW,cardH,16);
      g.fillStyle(u.color,0.14); g.fillRoundedRect(x,y,64,cardH,16);
      const em=this.add.text(x+32,y+32,u.emoji,{fontSize:'29px'}).setOrigin(0.5);
      let stars=''; for(let s=0;s<TAL_MAX;s++) stars+=(s<lvl?'★':'☆');
      const st=this.add.text(x+32,y+61,stars,{fontFamily:'sans-serif',fontSize:'9px',color:maxed?'#8bd3a0':'#ffd166'}).setOrigin(0.5);
      const tag=this.add.text(x+75,y+13,u.tag+' · Lv '+lvl+'/'+TAL_MAX,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#cbbfda'}).setOrigin(0,0);
      const nm=this.add.text(x+75,y+34,u.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0,0);
      const gain=this.add.text(x+75,y+57,'Total: '+u.show(tot),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10.5px',color:'#8bd3a0'}).setOrigin(0,0);
      const pw=Math.min(100,cardW-82),ph=29,ppx=x+cardW-pw-10,ppy=y+cardH-ph-10;
      const pg=this.add.graphics(); pg.fillStyle(maxed?0x3a3550:(afford?0x2f4a38:0x4a2f38),1); pg.fillRoundedRect(ppx,ppy,pw,ph,10);
      const pt=this.add.text(ppx+pw/2,ppy+ph/2,maxed?'Full ✓':('🍬 '+cost),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:maxed?'#8bd3a0':(afford?'#a8f0c0':'#f0a0b0')}).setOrigin(0.5);
      this.menu.add([g,em,st,tag,nm,gain,pg,pt]);
      if(!maxed) this._zone(ppx,ppy,pw,ph,()=>{ if(Save.buyTal(k)){ Sfx.clear(); } else { Sfx.select(); } this.buildMenuScreen(); });
    });
    const py=portrait?Math.min(h-58,top+UPG_ORDER.length*(cardH+gapY)+4):h-48,bw=Math.min(w-40,330),pbx=w/2,ph=40;
    const pg=this.add.graphics(); pg.fillStyle(allMax?0xffb020:0x3a3550,1); pg.fillRoundedRect(pbx-bw/2,py,bw,ph,14);
    pg.lineStyle(2,allMax?0xffe08a:0x4a4059,allMax?1:0.6); pg.strokeRoundedRect(pbx-bw/2,py,bw,ph,14);
    const pl=this.add.text(pbx,py+14,allMax?('⭐ Weave up → '+rankName(rank+1)):'⭐ Weave up · max the cores first',
      {fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:allMax?'#fff':'#7a7088'}).setOrigin(0.5);
    const psub=this.add.text(pbx,py+29,allMax?('Get 🍬 '+promoteReward(rank)+' · permanent weave power'):'Max all 3: CORE / FLAVOR / BOND',
      {fontFamily:'sans-serif',fontSize:'9px',color:allMax?'#ffe9c2':'#8f849f'}).setOrigin(0.5);
    this.menu.add([pg,pl,psub]);
    if(allMax) this._zone(pbx-bw/2,py,bw,ph,()=>{ const rew=Save.promote(); if(rew>=0){ Sfx.clear();
      if(this.showBanner)this.showBanner('⭐ The weave grows stronger! '+rankName(Save.data.rank),'Memory and flavor become one · get 🍬 '+rew,2400); } this.buildMenuScreen(); });
    this.menu.setVisible(true);
  }
  buildRankPerks(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('🏅 Flavor Passives');
    const w=this.W,h=this.H;
    const free=Save.rankPointsFree(),total=Save.rankPointsTotal();
    const rpTxt=this.add.text(w/2,56,'RP  '+free+' free / '+total,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:free>0?'#ffd166':'#8f849f'}).setOrigin(0.5);
    const sub=this.add.text(w/2,73,'Earn RP by ranking up the 3 cores · deeper tiers unlock as you invest',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#b7abc9'}).setOrigin(0.5);
    this.menu.add([rpTxt,sub]);
    const tierName={1:'TIER 1 · Foundation',2:'TIER 2 · Utility',3:'TIER 3 · Mastery'};
    const cols=3,gap=7,cardW=(w-28-gap*(cols-1))/cols,cardH=90; let y=88;
    [1,2,3].forEach(tier=>{
      const unlocked=Save.perkTierUnlocked(tier),req=PERK_TIER_REQ[tier]||0,priorSpent=tier===3?(Save.perkTierSpent(1)+Save.perkTierSpent(2)):Save.perkTierSpent(1),perks=RANK_PERKS.filter(p=>(p.tier||1)===tier);
      const th=this.add.text(14,y,tierName[tier],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:unlocked?'#ffd9a8':'#7a7088'}).setOrigin(0,0);
      const lk=this.add.text(w-14,y,unlocked?'':('🔒 need '+priorSpent+'/'+req+' pts'),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:'#f0a0b0'}).setOrigin(1,0);
      this.menu.add([th,lk]);
      if(tier>1){ const cg=this.add.graphics(); cg.lineStyle(2,unlocked?0xffd166:0x4a4059,0.7); cg.lineBetween(w/2,y-9,w/2,y-2); this.menu.add(cg); }
      y+=15;
      perks.forEach((pk,i)=>{ const x=14+i*(cardW+gap),lvl=Save.perkLvl(pk.id),maxed=lvl>=pk.max,canBuy=unlocked&&!maxed&&free>0;
        const g=this.add.graphics(); g.fillStyle(unlocked?0x2c2338:0x201a28,1); g.fillRoundedRect(x,y,cardW,cardH,10); g.lineStyle(2,maxed?0x8bd3a0:(canBuy?0xffd166:(unlocked?0x4a4059:0x352b40)),0.9); g.strokeRoundedRect(x,y,cardW,cardH,10);
        const em=this.add.text(x+cardW/2,y+15,pk.emoji,{fontSize:'20px'}).setOrigin(0.5).setAlpha(unlocked?1:0.4);
        const nm=this.add.text(x+cardW/2,y+31,pk.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:unlocked?'#fff':'#7a7088'}).setOrigin(0.5);
        const ds=this.add.text(x+cardW/2,y+43,pk.desc,{fontFamily:'sans-serif',fontSize:'7px',color:unlocked?'#b0a4c2':'#5f556e',align:'center',wordWrap:{width:cardW-10}}).setOrigin(0.5,0);
        let dots=''; for(let s=0;s<pk.max;s++)dots+=(s<lvl?'●':'○'); const dt=this.add.text(x+cardW/2,y+cardH-24,dots,{fontFamily:'sans-serif',fontSize:'8px',color:maxed?'#8bd3a0':(unlocked?'#ffd166':'#5a4f68')}).setOrigin(0.5);
        const bh=17,by=y+cardH-bh-3,bx=x+6,bw=cardW-12,bg=this.add.graphics(); bg.fillStyle(maxed?0x2f4a38:(canBuy?0x4a3a1a:0x322a3a),1); bg.fillRoundedRect(bx,by,bw,bh,6);
        const bt=this.add.text(x+cardW/2,by+bh/2,maxed?'MAX':(!unlocked?'🔒 Locked':(canBuy?('Spend →+'+(lvl+1)):(free<=0?'No RP':'Lv'+lvl+'/'+pk.max))),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:maxed?'#8bd3a0':(canBuy?'#ffe08a':'#8d8195')}).setOrigin(0.5);
        this.menu.add([g,em,nm,ds,dt,bg,bt]);
        if(canBuy)this._zone(x,y,cardW,cardH,()=>{ if(Save.buyPerk(pk.id)){Sfx.clear();}else Sfx.select(); this.buildRankPerks(); });
      });
      y+=cardH+11;
    });
    // ปุ่มรีเซ็ต perk (คืนแต้มทั้งหมด)
    const ry2=Math.min(h-42,y),rw=Math.min(w-40,300);
    const rg=this.add.graphics(); rg.fillStyle(0x3a2f38,1); rg.fillRoundedRect(w/2-rw/2,ry2,rw,34,10); rg.lineStyle(1.5,0x6a4055,0.8); rg.strokeRoundedRect(w/2-rw/2,ry2,rw,34,10);
    const rt=this.add.text(w/2,ry2+17,this._perkResetConfirm?'⚠ Tap again to confirm reset':'♻️ Reset Perks (refund all points)',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#f0a0b0'}).setOrigin(0.5);
    this.menu.add([rg,rt]);
    this._zone(w/2-rw/2,ry2,rw,34,()=>{ if(this._perkResetConfirm){Save.respecPerks();this._perkResetConfirm=false;Sfx.clear();}else{this._perkResetConfirm=true;Sfx.select();} this.buildRankPerks(); });
    this.menu.setVisible(true);
  }
  buildGearLandscape(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Equipment');
    const w=this.W,h=this.H,id=this.character||Save.data.character||'momo',sel=this.gearSlot||'weapon';
    const leftW=Math.min(345,w*0.45),panelX=12,panelY=56,panelW=leftW-20,panelH=h-70,pcx=panelX+panelW/2,pcy=panelY+panelH*0.40;
    const pbg=this.add.graphics();pbg.fillStyle(0x241a33,0.72);pbg.fillRoundedRect(panelX,panelY,panelW,panelH,16);pbg.lineStyle(1.5,0x4a4059,0.8);pbg.strokeRoundedRect(panelX,panelY,panelW,panelH,16);this.menu.add(pbg);
    if(!this._characterCardArt(id,pcx,pcy,panelW*0.60,panelH*0.72)){const em=this.add.text(pcx,pcy,CHARACTERS[id].emoji,{fontSize:'54px'}).setOrigin(0.5);this.menu.add(em);}
    const ss=43,leftX=panelX+34,rightX=panelX+panelW-34,rowY=[panelY+42,panelY+104,panelY+166];
    const layout=[['weapon',leftX,0],['gloves',leftX,1],['amulet',leftX,2],['armor',rightX,0],['boots',rightX,1],['ring',rightX,2]];
    layout.forEach(([slot,sx,ri])=>{const y=rowY[ri],def=GEAR_SLOTS.find(g=>g.slot===slot),curId=Save.data.gear[slot],it=GEAR[slot].find(g=>g.id===curId)||GEAR[slot][0],lv=Save.gearLv(it.id),on=!it.id.includes('_none'),isSel=slot===sel;
      const g=this.add.graphics();g.fillStyle(isSel?0x3a3550:0x2c2338,1);g.fillRoundedRect(sx-ss/2,y-ss/2,ss,ss,11);g.lineStyle(isSel?3:2,isSel?0xffd166:(on?0x8bd3a0:0x4a4059),1);g.strokeRoundedRect(sx-ss/2,y-ss/2,ss,ss,11);
      const artKey=on?'gear_'+it.id:null,em=artKey&&this.textures.exists(artKey)?this.add.image(sx,y-1,artKey).setDisplaySize(ss*0.72,ss*0.72):this.add.text(sx,y-1,on?it.emoji:def.emoji,{fontSize:'22px'}).setOrigin(0.5).setAlpha(on?1:0.45);this.menu.add([g,em]);
      if(on&&lv>0){const bd=this.add.text(sx+ss/2-2,y-ss/2,'+'+lv,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffd166'}).setOrigin(1,0);this.menu.add(bd);}this._zone(sx-ss/2,y-ss/2,ss,ss,()=>{this.gearSlot=slot;this.buildMenuScreen();});
    });
    const gbw=Math.min(210,panelW-32),gbh=34,gby=h-55,afG=(Save.data.sugar||0)>=GACHA_COST;
    const gbg=this.add.graphics();gbg.fillStyle(afG?0xffb020:0x3a3550,1);gbg.fillRoundedRect(pcx-gbw/2,gby,gbw,gbh,11);gbg.lineStyle(1.5,afG?0xffe08a:0x4a4059,1);gbg.strokeRoundedRect(pcx-gbw/2,gby,gbw,gbh,11);
    const gbt=this.add.text(pcx,gby+gbh/2,'🎁 Open gacha box 🍬'+GACHA_COST,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:afG?'#fff':'#7a7088'}).setOrigin(0.5);this.menu.add([gbg,gbt]);
    this._zone(pcx-gbw/2,gby,gbw,gbh,()=>this.openGachaReveal());
    const rx=leftW+8,rw=w-rx-14,selDef=GEAR_SLOTS.find(g=>g.slot===sel);
    const hdr=this.add.text(rx+rw/2,58,selDef.emoji+' '+selDef.label+' · equip / enhance',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffd9a8'}).setOrigin(0.5);this.menu.add(hdr);
    const items=GEAR[sel],rowGap=8,rowH=Math.min(72,(h-88-rowGap*(items.length-1))/items.length);
    items.forEach((it,i)=>{const owned=Save.data.ownedGear.includes(it.id),equipped=Save.data.gear[sel]===it.id,lv=Save.gearLv(it.id),canEnh=it.enh&&lv<GEAR_ENH_MAX,ecost=gearEnhCost(lv),tl=TIER_LABEL[it.tier]||TIER_LABEL.common,nm=it.name+(it.tier==='rare'?' ⭐':it.tier==='epic'?' 💠':'')+(lv>0?' +'+lv:'');let label,color,fn;
      if(equipped&&canEnh){const ok=(Save.data.sugar||0)>=ecost;label='⚒️ +'+(lv+1)+' 🍬'+ecost;color=ok?'#ffd166':'#e0788a';fn=()=>{if(Save.spend(ecost)){Save.enhance(it.id);Sfx.clear();}this.buildMenuScreen();};}
      else if(equipped){label='Equipped ✓';color='#ffd166';fn=null;}else if(owned){label='Equip';color='#8bd3a0';fn=()=>{Save.equipGearBase(sel,it.id);Sfx.select();this.buildMenuScreen();};}else{label='🔒 '+tl.name;color=tl.color;fn=null;}
      this._rowBtn(80+i*(rowH+rowGap),rowH,owned?it.emoji:'❔',nm,owned?it.desc:'Not discovered yet',label,color,fn,rx,rw);
    });
    this.menu.setVisible(true);
  }
  buildGear(){
    if(this.W>this.H){this.buildGearLandscape();return;}
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('Equipment');
    const w=this.W,h=this.H, id=this.character||Save.data.character||'momo';
    const sel=this.gearSlot||'weapon';
    const cy0=78, topH=Math.min(h*0.34,250);
    // ---- ตัวละคร (portrait) ตรงกลาง ----
    const pcx=w/2, pcy=cy0+topH*0.44, pbW=Math.min(w*0.42,190), pbH=topH*0.86;
    const pbg=this.add.graphics(); pbg.fillStyle(0x241a33,0.7); pbg.fillRoundedRect(pcx-pbW/2,cy0+4,pbW,pbH,18); pbg.lineStyle(2,0x4a4059,0.8); pbg.strokeRoundedRect(pcx-pbW/2,cy0+4,pbW,pbH,18);
    this.menu.add(pbg);
    if(this.textures.exists('card_'+id)){ this._characterCardArt(id,pcx,pcy,pbW*0.90,pbH*0.92); }
    else { const em=this.add.text(pcx,pcy,CHARACTERS[id].emoji,{fontSize:Math.round(topH*0.5)+'px'}).setOrigin(0.5); this.menu.add(em); }
    // ---- 6 ช่องสวมใส่ (ซ้าย 3 / ขวา 3) ----
    const rowY=[cy0+topH*0.14, cy0+topH*0.44, cy0+topH*0.74];
    const leftX=Math.max(44,w*0.135), rightX=Math.min(w-44,w*0.865), ss=Math.min(56,topH*0.24);
    const layout=[['weapon',leftX,0],['gloves',leftX,1],['amulet',leftX,2],['armor',rightX,0],['boots',rightX,1],['ring',rightX,2]];
    layout.forEach(([slot,sx,ri])=>{ const y=rowY[ri];
      const def=GEAR_SLOTS.find(g=>g.slot===slot), curId=Save.data.gear[slot], it=GEAR[slot].find(g=>g.id===curId)||GEAR[slot][0];
      const lv=Save.gearLv(it.id), on=it.id.indexOf('_none')<0, isSel=slot===sel;
      const g=this.add.graphics(); g.fillStyle(isSel?0x3a3550:0x2c2338,1); g.fillRoundedRect(sx-ss/2,y-ss/2,ss,ss,12);
      g.lineStyle(isSel?3:2, isSel?0xffd166:(on?0x8bd3a0:0x4a4059), 1); g.strokeRoundedRect(sx-ss/2,y-ss/2,ss,ss,12);
      const artKey=on?'gear_'+it.id:null;
      const em=artKey&&this.textures.exists(artKey)?this.add.image(sx,y-2,artKey).setDisplaySize(ss*0.72,ss*0.72):this.add.text(sx,y-2,on?it.emoji:def.emoji,{fontSize:Math.round(ss*0.5)+'px'}).setOrigin(0.5).setAlpha(on?1:0.4);
      this.menu.add([g,em]);
      const newN=Save.gearItemsForSlot(slot).filter(x=>x.isNew).length;
      if(newN){ const nd=this.add.circle(sx+ss/2-2,y-ss/2+2,7,0xff5689,1); const nn=this.add.text(nd.x,nd.y,String(Math.min(9,newN)),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:'#ffffff'}).setOrigin(0.5); this.menu.add([nd,nn]); }
      if(topH>=180){ const lb=this.add.text(sx,y+ss/2+9,def.label,{fontFamily:'sans-serif',fontSize:'10px',color:isSel?'#ffd166':'#9a90ab'}).setOrigin(0.5); this.menu.add(lb); }   // ซ่อนป้ายตอนจอเตี้ย (แนวนอน) กันทับ
      if(on&&lv>0){ const bd=this.add.text(sx+ss/2-4,y-ss/2+2,'+'+lv,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffd166'}).setOrigin(1,0); this.menu.add(bd); }
      this._zone(sx-ss/2,y-ss/2,ss,ss+14,()=>{ this.gearSlot=slot; this.buildMenuScreen(); });
    });
    // ---- ปุ่มกล่องสุ่ม (gacha) + หลอมตำนาน (forge ด้วย 🔩) ----
    const gby=cy0+topH-28, gbh=28, gap2=8, half=Math.min(w*0.44,150);
    const gcx=w/2-half/2-gap2/2, fcx=w/2+half/2+gap2/2;
    const afG=(Save.data.sugar||0)>=GACHA_COST;
    const gbg=this.add.graphics(); gbg.fillStyle(afG?0xffb020:0x3a3550,1); gbg.fillRoundedRect(gcx-half/2,gby,half,gbh,10); gbg.lineStyle(1.5,afG?0xffe08a:0x4a4059,1); gbg.strokeRoundedRect(gcx-half/2,gby,half,gbh,10);
    const gbt=this.add.text(gcx,gby+gbh/2,'🎁 Gacha 🍬'+GACHA_COST,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:afG?'#fff':'#7a7088'}).setOrigin(0.5);
    this.menu.add([gbg,gbt]); this._zone(gcx-half/2,gby,half,gbh,()=>this.openGachaReveal());
    const afF=(Save.data.shards||0)>=LEGEND_FORGE_COST;
    const fbg=this.add.graphics(); fbg.fillStyle(afF?0xff8f3a:0x3a3550,1); fbg.fillRoundedRect(fcx-half/2,gby,half,gbh,10); fbg.lineStyle(1.5,afF?0xffd0a0:0x4a4059,1); fbg.strokeRoundedRect(fcx-half/2,gby,half,gbh,10);
    const fbt=this.add.text(fcx,gby+gbh/2,'🌟 Forge 🔩'+LEGEND_FORGE_COST,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:afF?'#fff':'#7a7088'}).setOrigin(0.5);
    this.menu.add([fbg,fbt]); this._zone(fcx-half/2,gby,half,gbh,()=>this.forgeLegend());
    // ---- Item-instance inventory: new first, 8 per page (portrait-first) ----
    const selDef=GEAR_SLOTS.find(g=>g.slot===sel),items=Save.gearItemsForSlot(sel);
    let selected=Save.gearItem(this.gearSelectedUid);
    if(!selected||selected.slot!==sel){ selected=items.find(x=>x.isNew)||Save.equippedGearItem(sel)||items[0]||null; this.gearSelectedUid=selected?selected.uid:null; }
    if(!this.gearPageBySlot)this.gearPageBySlot={}; const pageSize=8,pages=Math.max(1,Math.ceil(items.length/pageSize));
    let page=Math.max(0,Math.min(pages-1,this.gearPageBySlot[sel]||0)); this.gearPageBySlot[sel]=page;
    let y=cy0+topH+8;
    const newCount=items.filter(x=>x.isNew).length,cap=Save.data.gearInventoryCap||24;
    const hdr=this.add.text(14,y,selDef.emoji+' '+selDef.label+(newCount?' · '+newCount+' NEW':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffd9a8'}).setOrigin(0,0);
    const count=this.add.text(w-66,y,Save.gearInventoryCount()+' / '+cap,{fontFamily:'sans-serif',fontSize:'9px',color:Save.gearInventoryFull()?'#ff8da2':'#a99fbb'}).setOrigin(1,0);
    const inboxN=Save.gearInboxCount(),inbox=this.add.text(w-14,y,'📦 '+inboxN,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:inboxN?'#ffd166':'#7a7088'}).setOrigin(1,0);this.menu.add([hdr,count,inbox]);this._zone(w-60,y-5,48,22,()=>{this.menuScreen='gearInbox';this.buildMenuScreen();});y+=20;
    if(!items.length){ const empty=this.add.text(w/2,y+30,'No items in this slot',{fontFamily:'sans-serif',fontSize:'12px',color:'#9a90ab'}).setOrigin(0.5);this.menu.add(empty);this.menu.setVisible(true);return; }
    const gap=6,cols=4,cw=(w-28-gap*(cols-1))/cols,ch=60,visible=items.slice(page*pageSize,page*pageSize+pageSize);
    visible.forEach((item,i)=>{ const base=GEAR_ALL.find(g=>g.id===item.baseId); if(!base)return; const col=i%cols,row=Math.floor(i/cols),x=14+col*(cw+gap),iy=y+row*(ch+gap),on=selected&&selected.uid===item.uid,eq=Save.isGearEquipped(item.uid),tl=TIER_LABEL[item.grade]||TIER_LABEL.common;
      const color=Phaser.Display.Color.HexStringToColor(tl.color).color,g=this.add.graphics();g.fillStyle(on?0x3a3550:0x241a2e,1);g.fillRoundedRect(x,iy,cw,ch,10);g.lineStyle(on?3:1.5,on?0xffd166:color,1);g.strokeRoundedRect(x,iy,cw,ch,10);
      const artKey='gear_'+base.id,em=this.textures.exists(artKey)?this.add.image(x+cw/2,iy+20,artKey).setDisplaySize(35,35):this.add.text(x+cw/2,iy+20,base.emoji,{fontSize:'22px'}).setOrigin(0.5),nm=this.add.text(x+cw/2,iy+42,(base.name.length>12?base.name.slice(0,11)+'…':base.name)+' · '+(item.itemLevel||1),{fontFamily:'sans-serif',fontSize:'7px',color:'#e8dce9'}).setOrigin(0.5);
      this.menu.add([g,em,nm]);
      if(item.isNew){const nb=this.add.text(x+4,iy+3,'NEW',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7px',color:'#ff8fb0'}).setOrigin(0,0);this.menu.add(nb);}
      if(item.favorite){const fav=this.add.text(x+cw-4,iy+3,'★',{fontSize:'10px',color:'#ffd166'}).setOrigin(1,0);this.menu.add(fav);}
      if(item.locked){const lk=this.add.text(x+4,iy+ch-4,'🔒',{fontSize:'9px'}).setOrigin(0,1);this.menu.add(lk);}
      if(eq){const ck=this.add.text(x+cw-4,iy+ch-4,'✓',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#8bd3a0'}).setOrigin(1,1);this.menu.add(ck);}
      if((item.enhanceLv||0)>0){const lv=this.add.text(x+cw-4,iy+20,'+'+item.enhanceLv,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffd166'}).setOrigin(1,0);this.menu.add(lv);}
      this._zone(x,iy,cw,ch,()=>{this.gearSelectedUid=item.uid;if(item.isNew)Save.markGearSeen(item.uid);this.buildMenuScreen();});
    });
    y+=Math.ceil(visible.length/cols)*(ch+gap);
    if(pages>1){ const py=y-1,pw=68,ph=24;
      const pt=this.add.text(w/2,py+ph/2,(page+1)+' / '+pages,{fontFamily:'sans-serif',fontSize:'10px',color:'#a99fbb'}).setOrigin(0.5);this.menu.add(pt);
      for(const [dir,label,px] of [[-1,'‹',w/2-76],[1,'›',w/2+76]]){const enabled=(dir<0?page>0:page<pages-1),pg=this.add.graphics();pg.fillStyle(enabled?0x3a3550:0x241a2e,1);pg.fillRoundedRect(px-pw/2,py,pw,ph,8);const tx=this.add.text(px,py+ph/2,label,{fontSize:'18px',color:enabled?'#ffffff':'#5e5062'}).setOrigin(0.5);this.menu.add([pg,tx]);if(enabled)this._zone(px-pw/2,py,pw,ph,()=>{this.gearPageBySlot[sel]=page+dir;this.buildMenuScreen();});} y+=ph+5; }
    selected=Save.gearItem(this.gearSelectedUid)||selected; const base=selected&&GEAR_ALL.find(g=>g.id===selected.baseId),equipped=Save.equippedGearItem(sel);
    if(selected&&base){ const eqBase=equipped&&GEAR_ALL.find(g=>g.id===equipped.baseId),tl=TIER_LABEL[selected.grade]||TIER_LABEL.common,rl=RARITY_LABEL[selected.craftState]||RARITY_LABEL.magic,eq=Save.isGearEquipped(selected.uid);
      const rows=gearCompareRows(equipped,selected).slice(0,5),panelH=58+Math.max(2,rows.length)*14,cgap=6,cw=(w-28-cgap)/2,leftX=14,rightX=14+cw+cgap;
      const drawCompareCard=(x,item,itBase,title,on)=>{const itTl=item?(TIER_LABEL[item.grade]||TIER_LABEL.common):TIER_LABEL.start,g=this.add.graphics();g.fillStyle(on?0x332819:0x241a33,0.97);g.fillRoundedRect(x,y,cw,panelH,12);g.lineStyle(on?2:1.5,on?0xffd166:Phaser.Display.Color.HexStringToColor(itTl.color).color,1);g.strokeRoundedRect(x,y,cw,panelH,12);this.menu.add(g);
        const hd=this.add.text(x+8,y+7,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:on?'#ffd166':'#9a90ab'}).setOrigin(0,0);
        const artKey=item&&itBase?'gear_'+itBase.id:null,hasArt=artKey&&this.textures.exists(artKey);
        const icon=hasArt?this.add.image(x+18,y+34,artKey).setDisplaySize(24,24):null;
        const name=item&&itBase?(hasArt?'':itBase.emoji+' ')+gearAffixName(itBase.name,item.affixes||[]):'— Empty —';
        const nm=this.add.text(x+(hasArt?34:8),y+21,name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:itTl.color,wordWrap:{width:cw-(hasArt?42:16)}}).setOrigin(0,0);this.menu.add(icon?[hd,icon,nm]:[hd,nm]);};
      drawCompareCard(leftX,equipped,eqBase,'EQUIPPED',false); drawCompareCard(rightX,selected,base,eq?'EQUIPPED NOW':'SELECTED',true);
      rows.forEach((r,i)=>{const ry=y+44+i*14,from=gearStatText(r,r.from),to=gearStatText(r,r.to),dc=r.delta>0.001?'#7de0a1':r.delta<-0.001?'#ff8da2':'#bbaabd',arrow=r.delta>0.001?' ▲':r.delta<-0.001?' ▼':'';
        const lt=this.add.text(leftX+8,ry,r.label+' '+from,{fontFamily:'sans-serif',fontSize:'8.5px',color:'#d8c7da'}).setOrigin(0,0);
        const rt=this.add.text(rightX+8,ry,r.label+' '+to+arrow,{fontFamily:'sans-serif',fontStyle:Math.abs(r.delta)>0.001?'bold':'normal',fontSize:'8.5px',color:dc}).setOrigin(0,0);this.menu.add([lt,rt]);});
      if(!rows.length){const same=this.add.text(w/2,y+47,eq?'Currently equipped':'No numeric stat difference',{fontFamily:'sans-serif',fontSize:'9px',color:'#a99fbb'}).setOrigin(0.5);this.menu.add(same);}
      const state=this.add.text(rightX+cw-8,y+7,tl.name+' · '+rl.name,{fontFamily:'sans-serif',fontSize:'8px',color:rl.color}).setOrigin(1,0);this.menu.add(state); y+=panelH+6;
      const affs=selected.affixes||[],astr=affs.length?affs.map(a=>{const d=affixDef(a.id);return d?d.emoji+d.label+' '+d.fmt(a.v)+' T'+(a.t||3):'';}).filter(Boolean).join('   '):'No affixes';
      const aff=this.add.text(16,y,astr,{fontFamily:'sans-serif',fontSize:'8.5px',color:'#c9a3ff',wordWrap:{width:w-32}}).setOrigin(0,0);this.menu.add(aff);y+=Math.max(16,aff.height+4);
      const setChange=gearSetCompareText(sel,selected); if(setChange){const st=this.add.text(16,y,setChange,{fontFamily:'sans-serif',fontSize:'8.5px',color:'#8bd3ff',wordWrap:{width:w-32}}).setOrigin(0,0);this.menu.add(st);y+=Math.max(14,st.height+3);}
      const bgap=5,bw=(w-28-bgap*3)/4,bh=32,drawAction=(i,label,color,fn)=>{const bx=14+i*(bw+bgap),g=this.add.graphics();g.fillStyle(color,1);g.fillRoundedRect(bx,y,bw,bh,9);const t=this.add.text(bx+bw/2,y+bh/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:'#ffffff',align:'center'}).setOrigin(0.5);this.menu.add([g,t]);if(fn)this._zone(bx,y,bw,bh,fn);};
      drawAction(0,selected.favorite?'★ Fav':'☆ Fav',selected.favorite?0xb88925:0x4a4059,()=>{Save.toggleGearFavorite(selected.uid);this.buildMenuScreen();});
      drawAction(1,selected.locked?'🔒 Locked':'🔓 Lock',selected.locked?0x85506f:0x4a4059,()=>{Save.toggleGearLock(selected.uid);this.buildMenuScreen();});
      if(!eq)drawAction(2,'Quick Equip',0x3f9160,()=>{Save.equipGearInstance(sel,selected.uid);Sfx.select();this.buildMenuScreen();});
      else {const lv=selected.enhanceLv||0,can=base.enh&&lv<GEAR_ENH_MAX,cost=gearEnhCost(lv),afford=(Save.data.sugar||0)>=cost,od=enhanceOdds(lv),risk=od.destroy>0?' ⚠':od.brk>0?' ~':'';
        drawAction(2,can?('Enhance +'+(lv+1)+risk):'MAX +'+lv,can?(afford?0xb88925:0x73404b):0x3f6d54,can?()=>{ if(!afford){Sfx.select();this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar',1200);return;} if(Save.spend(cost)){ const res=Save.enhance(selected.uid); Sfx.clear();
            if(res.result==='success'){this.screenFlash(0xffd166,.4,260);this.showBanner('⚒️ Enhanced!','Now +'+res.lv,1100);}
            else if(res.result==='break'){this.screenFlash(0xff8a5a,.42,320);this.showBanner('💥 Enhancement broke','Dropped to +'+res.lv,1500);}
            else {this.gearSelectedUid=null;this.screenFlash(0xff4a5a,.6,440);this.showBanner('💀 Item destroyed','It shattered at high enhancement',1800);} }
          this.buildMenuScreen(); }:null);}
      const canDis=!eq&&!selected.locked&&!selected.favorite&&selected.grade!=='start',gain=gearDismantleValue(selected);
      drawAction(3,canDis?('Dismantle\n🔩+'+gain):'Protected',canDis?0x8d4b3e:0x3a3550,canDis?()=>{const n=Save.dismantleGearInstance(selected.uid);if(n){this.gearSelectedUid=null;Sfx.clear();this.buildMenuScreen();this.showBanner('🔩 Dismantled','Gear shards +'+n,1200);}}:null);
      // แถวสอง: ไปคราฟทันที + ขายเป็น Sugar (ไม่ต้องเข้าๆออกๆ)
      y+=bh+bgap; const bw2=(w-28-bgap)/2, canCraft=selected.grade!=='start'&&!selected.locked;
      {const g=this.add.graphics();g.fillStyle(canCraft?0x5a3f8c:0x3a3550,1);g.fillRoundedRect(14,y,bw2,bh,9);const t=this.add.text(14+bw2/2,y+bh/2,'🧪 Craft this',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:canCraft?'#e9dcff':'#8d8195'}).setOrigin(.5);this.menu.add([g,t]);if(canCraft)this._zone(14,y,bw2,bh,()=>{this.gearSlot=sel;this.craftSelectedUid=selected.uid;this.gearSelectedUid=selected.uid;this.craftLineIndex=0;this._craftRolledId=null;this.menuScreen='craft';this.buildMenuScreen();});}
      const canSell=!eq&&!selected.locked&&!selected.favorite&&selected.grade!=='start',sv=gearSellSugar(selected);
      {const bx=14+bw2+bgap,g=this.add.graphics();g.fillStyle(canSell?0x8d6a3e:0x3a3550,1);g.fillRoundedRect(bx,y,bw2,bh,9);const t=this.add.text(bx+bw2/2,y+bh/2,canSell?('💰 Sell 🍬+'+sv):'Protected',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:canSell?'#ffe6b0':'#8d8195'}).setOrigin(.5);this.menu.add([g,t]);if(canSell)this._zone(bx,y,bw2,bh,()=>{const n=Save.sellGearInstance(selected.uid);if(n){this.gearSelectedUid=null;Sfx.clear();this.buildMenuScreen();this.showBanner('💰 Sold for Sugar','🍬 +'+n,1200);}});}
      y+=bh;
    }
    this.menu.setVisible(true);
  }
  buildGearInbox(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('📦 Reward Inbox','','gLoadout');
    const w=this.W,cap=Save.data.gearInventoryCap||24,items=Save.gearInboxItems(),mode=Save.data.gearAutoDismantle||'off',labels={off:'OFF',common:'COMMON',rare:'COMMON + RARE'};
    let y=64;const info=this.add.text(14,y,'Bag '+Save.gearInventoryCount()+' / '+cap+'   ·   Inbox '+items.length+' / '+GEAR_INBOX_CAP,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:Save.gearInventoryFull()?'#ff8da2':'#d8cde2'}).setOrigin(0,0);
    const auto=this.add.graphics();auto.fillStyle(mode==='off'?0x3a3550:0x704a20,1);auto.fillRoundedRect(w-170,y-6,156,28,9);const at=this.add.text(w-92,y+8,'Auto: '+labels[mode],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:mode==='off'?'#a99fbb':'#ffd166'}).setOrigin(.5);this.menu.add([info,auto,at]);
    this._zone(w-170,y-6,156,28,()=>{Save.setGearAutoDismantle(mode==='off'?'common':mode==='common'?'rare':'off');this.buildGearInbox();});y+=34;
    const note=this.add.text(14,y,'Auto mode affects overflow only. Favorite, Locked, Epic and Legend are always protected.',{fontFamily:'sans-serif',fontSize:'8.5px',color:'#a99fbb',wordWrap:{width:w-28}}).setOrigin(0,0);this.menu.add(note);y+=Math.max(30,note.height+10);
    if(!items.length){const empty=this.add.text(w/2,y+80,'Inbox is empty\nLoot goes here when the 24-slot bag is full.',{fontFamily:'sans-serif',fontSize:'13px',color:'#9a90ab',align:'center',lineSpacing:7}).setOrigin(.5);this.menu.add(empty);this.menu.setVisible(true);return;}
    if(!this.inboxPage)this.inboxPage=0;const pageSize=5,pages=Math.max(1,Math.ceil(items.length/pageSize));this.inboxPage=Math.max(0,Math.min(pages-1,this.inboxPage));const visible=items.slice(this.inboxPage*pageSize,this.inboxPage*pageSize+pageSize);
    visible.forEach((item,i)=>{const base=GEAR_ALL.find(g=>g.id===item.baseId),tl=TIER_LABEL[item.grade]||TIER_LABEL.common,ry=y+i*68,g=this.add.graphics();g.fillStyle(0x241a33,.97);g.fillRoundedRect(14,ry,w-28,60,12);g.lineStyle(1.5,Phaser.Display.Color.HexStringToColor(tl.color).color,1);g.strokeRoundedRect(14,ry,w-28,60,12);this.menu.add(g);
      const key=base&&'gear_'+base.id,art=key&&this.textures.exists(key)?this.add.image(43,ry+30,key).setDisplaySize(42,42):this.add.text(43,ry+30,base?base.emoji:'🎁',{fontSize:'25px'}).setOrigin(.5);
      const nm=this.add.text(70,ry+9,(base?base.name:'Unknown')+' · iLv '+(item.itemLevel||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:tl.color}).setOrigin(0,0);
      const sub=this.add.text(70,ry+27,tl.name+' · '+(item.affixes||[]).length+' affix'+((item.affixes||[]).length===1?'':'es'),{fontFamily:'sans-serif',fontSize:'8.5px',color:'#bbaabd'}).setOrigin(0,0);this.menu.add([art,nm,sub]);
      const by=ry+8,bh=44,bw=56,cx=w-132,claim=this.add.graphics();claim.fillStyle(Save.gearInventoryFull()?0x3a3550:0x3f9160,1);claim.fillRoundedRect(cx,by,bw,bh,9);const ct=this.add.text(cx+bw/2,by+bh/2,Save.gearInventoryFull()?'Bag Full':'Claim',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8.5px',color:'#fff'}).setOrigin(.5);this.menu.add([claim,ct]);if(!Save.gearInventoryFull())this._zone(cx,by,bw,bh,()=>{if(Save.claimGearInbox(item.uid)){Sfx.clear();this.buildGearInbox();}});
      const safe=item.grade!=='epic'&&item.grade!=='legend'&&!item.locked&&!item.favorite,dg=this.add.graphics();dg.fillStyle(safe?0x8d4b3e:0x3a3550,1);dg.fillRoundedRect(w-70,by,bw,bh,9);const dt=this.add.text(w-42,by+bh/2,safe?('Dismantle\n🔩+'+gearDismantleValue(item)):'Protected',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7.5px',color:'#fff',align:'center'}).setOrigin(.5);this.menu.add([dg,dt]);if(safe)this._zone(w-70,by,bw,bh,()=>{const n=Save.dismantleGearInbox(item.uid);if(n){Sfx.clear();this.buildGearInbox();this.showBanner('🔩 Dismantled','Gear shards +'+n,1200);}});
    });
    if(pages>1){const py=y+visible.length*68+2,txt=this.add.text(w/2,py+13,'‹   '+(this.inboxPage+1)+' / '+pages+'   ›',{fontFamily:'sans-serif',fontSize:'11px',color:'#c7bdd6'}).setOrigin(.5);this.menu.add(txt);this._zone(w/2-70,py,55,26,()=>{this.inboxPage=(this.inboxPage-1+pages)%pages;this.buildGearInbox();});this._zone(w/2+15,py,55,26,()=>{this.inboxPage=(this.inboxPage+1)%pages;this.buildGearInbox();});}
    this.menu.setVisible(true);
  }
  // 🌟 หลอมของตำนาน: ใช้ 🔩 เศษ สุ่มของ legend ที่ยังNone (ถ้ามีครบแล้ว = คืนเศษ)
  forgeLegend(){
    if((Save.data.shards||0)<LEGEND_FORGE_COST){ Sfx.select(); this.showBanner('🔩 Not enough shards','Requires '+LEGEND_FORGE_COST+' shards (from duplicates)',1400); return; }
    const pool=gearPool('legend',currentItemChapter());
    if(!pool.length){ Sfx.select(); this.showBanner('🌟 No legend available','Advance a chapter to unlock its legend pool',1500); return; }
    if(!Save.spendShards(LEGEND_FORGE_COST))return;
    const it=Phaser.Utils.Array.GetRandom(pool),ilvl=currentRewardItemLevel(),delivery=Save.receiveGearInstance(it.id,{isNew:true,itemLevel:ilvl,chapter:itemChapterFromLevel(ilvl)});
    Sfx.clear();this.screenFlash(0xff8f3a,0.8,520);this.screenShake(600,0.02);
    this.showBanner('🌟 Forged!',(GEAR_SLOTS.find(s=>s.slot===it.slot).emoji)+' '+it.name+' · Legend'+gearDeliverySuffix(delivery),2000);
    this.buildMenuScreen();
  }
  // 🎲 สุ่มคุณสมบัติเสริม (affix) ของชิ้นที่สวมในช่องนี้ใหม่ (loot chase)
  rerollGearAffix(slot){
    const it=GEAR[slot].find(g=>g.id===Save.data.gear[slot]);
    if(!it||it.tier==='start'){ Sfx.select(); this.showBanner('✨ Cannot reroll','No affix-rollable item in this slot',1300); return; }
    if((Save.data.shards||0)<AFFIX_REROLL_COST){ Sfx.select(); this.showBanner('🔩 Not enough shards','Requires '+AFFIX_REROLL_COST+' shards',1300); return; }
    if(!Save.spendShards(AFFIX_REROLL_COST))return;
    Save.rerollAffix(it.id,it.tier); Sfx.clear(); this.buildMenuScreen();
  }
  /* ---- 🧪 Craft Bench (Phase 2): ใช้ currency คราฟต์ affix ของไอเทมที่สวม ---- */
  // เติม affix 1 อันตามช่องว่างของ rarity · คืน true ถ้าเติมได้
  _craftContext(){const slot=this.gearSlot||'weapon',item=Save.gearItem(this.craftSelectedUid||this.gearSelectedUid)||Save.equippedGearItem(slot),base=item&&GEAR_ALL.find(g=>g.id===item.baseId);return{slot,item,base};}
  // 🎲 คราฟต์แบบสุ่ม: ผู้เล่นเห็นแค่ว่าเป็นอะไรได้บ้าง → ใช้ currency แล้วสุ่ม stat มา 1 อัน แล้วไฮไลท์อันที่ติด
  randomCraftSelected(){const {item,base}=this._craftContext();if(!item||!base||base.tier==='start')return;if(item.locked){Sfx.select();this.showBanner('🔒 Item locked','Unlock it before crafting',1300);return;}
    let affs=Save.gearAffixes(item.uid).slice(),rar=Save.gearRarity(item.uid,base.tier),cap=Math.max(CRAFT_AFFIX_CAP[rar]||2,affs.length),line=Math.max(0,Math.min(cap-1,this.craftLineIndex||0)),old=affs[line]||null;
    const pool=craftAffixPoolForItem(item),used=new Set(affs.map((a,i)=>i===line?'':a.id)),available=pool.filter(m=>!used.has(m.id));
    if(!available.length){Sfx.select();this.showBanner('No stats left','This item has every possible stat rolled',1300);return;}
    const key=craftCurrencyForLine(rar,!!old),cur=currencyDef(key);if(Save.currency(key)<1){Sfx.select();this.showBanner(cur.emoji+' Need '+cur.name,'Available: '+Save.currency(key),1300);return;}
    const mod=Phaser.Utils.Array.GetRandom(available),rolled=rollOneAffix(mod,affixBestTierForItem(item,mod),item.itemLevel||1);
    if(line<affs.length)affs[line]=rolled;else affs.push(rolled);if(rar==='common')rar='magic';
    Save.spendCurrency(key,1);Save.setAffixes(item.uid,affs);Save.setGearRarity(item.uid,rar);this._craftRolledId=mod.id;
    Sfx.clear();this.screenFlash(0x7fb0ff,.44,320);this.showBanner('🎲 '+cur.emoji+' Rolled!',mod.emoji+' '+mod.label+' '+mod.fmt(rolled.v)+' · T'+rolled.t,1700);this.buildCraftBench();}
  promoteFocusedItem(){const {item,base}=this._craftContext();if(!item||!base||item.locked)return;const rar=Save.gearRarity(item.uid,base.tier),affs=Save.gearAffixes(item.uid);if(rar!=='magic'||affs.length<2)return;if(Save.currency('regal')<1){Sfx.select();this.showBanner('🟡 Need Crown Icing','Available: '+Save.currency('regal'),1200);return;}Save.spendCurrency('regal',1);Save.setGearRarity(item.uid,'rare');Sfx.clear();this.showBanner('🟡 Promoted to Rare','Four focused affix lines unlocked',1400);this.buildCraftBench();}
  divineFocusedLine(){const {item}=this._craftContext();if(!item||item.locked)return;const affs=Save.gearAffixes(item.uid).slice(),line=this.craftLineIndex||0,a=affs[line],mod=a&&affixDef(a.id);if(!a||!mod)return;if(Save.currency('divine')<1){Sfx.select();this.showBanner('⚪ Need Crystal Glaze','Available: '+Save.currency('divine'),1200);return;}const b=mod.tiers[(a.t||5)-1]||mod.tiers[4];a.v=b[0]+Math.floor(Math.random()*(b[1]-b[0]+1));Save.spendCurrency('divine',1);Save.setAffixes(item.uid,affs);Sfx.clear();this.showBanner('⚪ Value rerolled',mod.label+' '+mod.fmt(a.v)+' · T'+a.t,1300);this.buildCraftBench();}
  annulFocusedLine(){const {item}=this._craftContext();if(!item||item.locked)return;const affs=Save.gearAffixes(item.uid).slice(),line=this.craftLineIndex||0;if(!affs[line])return;if(Save.currency('annul')<1){Sfx.select();this.showBanner('🟣 Need Fading Gumdrop','Available: '+Save.currency('annul'),1200);return;}affs.splice(line,1);Save.spendCurrency('annul',1);Save.setAffixes(item.uid,affs);this.craftLineIndex=Math.max(0,line-1);Sfx.clear();this.showBanner('🟣 Line removed','Select an empty line to add a new stat',1300);this.buildCraftBench();}
  scourFocusedItem(){const {item}=this._craftContext();if(!item||item.locked)return;if(Save.currency('scour')<1){Sfx.select();this.showBanner('⚫ Need Plain Dough','Available: '+Save.currency('scour'),1200);return;}Save.spendCurrency('scour',1);Save.setAffixes(item.uid,[]);Save.setGearRarity(item.uid,'common');this.craftLineIndex=0;this.craftTargetId=null;Sfx.clear();this.showBanner('⚫ Item reset','Common · one focused line available',1300);this.buildCraftBench();}
  buildCraftBench(){
    this.menu.removeAll(true);this.tapZones=[];this._screenBg('Craft Bench','','gLoadout');
    const w=this.W,h=this.H,slot=this.gearSlot||'weapon';let y=w<=h?80:54;
    const slots=GEAR_SLOTS,sw=Math.min(42,(w-28)/6);
    slots.forEach((sd,i)=>{
      const x=14+sw/2+i*((w-28)/6),on=sd.slot===slot,eq=Save.equippedGearItem(sd.slot),base=eq&&GEAR_ALL.find(g=>g.id===eq.baseId),g=this.add.graphics();
      g.fillStyle(on?0x3a3550:0x2c2338,1);g.fillRoundedRect(x-sw/2,y,sw,sw,9);g.lineStyle(on?3:1.3,on?0xc9a3ff:0x4a4059,1);g.strokeRoundedRect(x-sw/2,y,sw,sw,9);
      const em=this.add.text(x,y+sw/2,base&&base.id.indexOf('_none')<0?base.emoji:sd.emoji,{fontSize:Math.round(sw*.48)+'px'}).setOrigin(.5);
      this.menu.add([g,em]);this._zone(x-sw/2,y,sw,sw,()=>{this.gearSlot=sd.slot;this.craftSelectedUid=null;this.craftLineIndex=0;this.craftTargetId=null;this._craftRolledId=null;this.buildCraftBench();});
    });
    y+=sw+7;
    const items=Save.gearItemsForSlot(slot).filter(x=>{const b=GEAR_ALL.find(g=>g.id===x.baseId);return b&&b.tier!=='start';});
    if(!items.length){this.menu.add(this.add.text(w/2,y+42,'No craftable item in this slot',{fontFamily:'sans-serif',fontSize:'12px',color:'#9a90ab'}).setOrigin(.5));this.menu.setVisible(true);return;}
    let selected=Save.gearItem(this.craftSelectedUid);
    if(!selected||selected.slot!==slot||!items.some(x=>x.uid===selected.uid)){
      selected=Save.gearItem(this.gearSelectedUid);if(!selected||selected.slot!==slot)selected=Save.equippedGearItem(slot);
      if(!selected||!items.some(x=>x.uid===selected.uid))selected=items[0];
      this.craftSelectedUid=selected.uid;this.craftLineIndex=0;this.craftTargetId=null;
    }
    if(!this.craftPageBySlot)this.craftPageBySlot={};
    const pageSize=4,pages=Math.max(1,Math.ceil(items.length/pageSize));let page=Math.max(0,Math.min(pages-1,this.craftPageBySlot[slot]||0));this.craftPageBySlot[slot]=page;
    const gap=6,cw=(w-28-gap*3)/4,ch=55;
    items.slice(page*pageSize,page*pageSize+pageSize).forEach((item,i)=>{
      const base=GEAR_ALL.find(g=>g.id===item.baseId),x=14+i*(cw+gap),on=item.uid===selected.uid,tl=TIER_LABEL[item.grade]||TIER_LABEL.common,color=Phaser.Display.Color.HexStringToColor(tl.color).color,g=this.add.graphics();
      g.fillStyle(on?0x3a3550:this._darken(color,0.58),1);g.fillRoundedRect(x,y,cw,ch,9);g.lineStyle(on?3:1.6,on?0xffd166:color,1);g.strokeRoundedRect(x,y,cw,ch,9);g.fillStyle(color,1);g.fillCircle(x+cw-8,y+8,3.4);   // จุดสีมุม = เกรด rarity (กวาดตาเห็นทันที)
      const artKey='gear_'+base.id,em=this.textures.exists(artKey)?this.add.image(x+cw/2,y+19,artKey).setDisplaySize(31,31):this.add.text(x+cw/2,y+19,base.emoji,{fontSize:'20px'}).setOrigin(.5);
      const lv=this.add.text(x+cw/2,y+45,'iLv '+(item.itemLevel||1)+(item.locked?' · 🔒':''),{fontFamily:'sans-serif',fontSize:'8px',color:'#d8cde2'}).setOrigin(.5);
      this.menu.add([g,em,lv]);this._zone(x,y,cw,ch,()=>{this.craftSelectedUid=item.uid;this.gearSelectedUid=item.uid;this.craftLineIndex=0;this.craftTargetId=null;this._craftRolledId=null;this.buildCraftBench();});
    });
    y+=ch+3;
    if(pages>1){
      const nav=this.add.text(w/2,y+9,'‹   '+(page+1)+' / '+pages+'   ›',{fontFamily:'sans-serif',fontSize:'10px',color:'#b9aec8'}).setOrigin(.5);
      this.menu.add(nav);this._zone(w/2-58,y,46,19,()=>{this.craftPageBySlot[slot]=(page-1+pages)%pages;this.buildCraftBench();});this._zone(w/2+12,y,46,19,()=>{this.craftPageBySlot[slot]=(page+1)%pages;this.buildCraftBench();});y+=21;
    }
    const base=GEAR_ALL.find(g=>g.id===selected.baseId),affs=Save.gearAffixes(selected.uid),rar=Save.gearRarity(selected.uid,base.tier),rl=RARITY_LABEL[rar]||RARITY_LABEL.magic;
    const cap=Math.max(CRAFT_AFFIX_CAP[rar]||2,affs.length),lineGap=6,lineW=(w-38-lineGap)/2,lineH=36,rows=Math.ceil(cap/2),cardH=41+rows*(lineH+7);
    this.craftLineIndex=Math.max(0,Math.min(cap-1,this.craftLineIndex||0));
    const rlC=Phaser.Display.Color.HexStringToColor(rl.color).color;
    const card=this.add.graphics();card.fillStyle(this._darken(rlC,0.82),.97);card.fillRoundedRect(14,y,w-28,cardH,13);card.fillStyle(rlC,0.14);card.fillRoundedRect(14,y,w-28,24,{tl:13,tr:13,bl:0,br:0});card.lineStyle(2,rlC,1);card.strokeRoundedRect(14,y,w-28,cardH,13);   // พื้นการ์ด tint ตาม rarity + แถบหัวเข้ม
    const fullName=gearAffixName(base.name,affs),safeName=fullName.length>35?fullName.slice(0,34)+'…':fullName;
    const nm=this.add.text(23,y+10,base.emoji+' '+safeName,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9.5px',color:rl.color}).setOrigin(0,0);
    const meta=this.add.text(w-23,y+10,rl.name+' · iLv '+(selected.itemLevel||1),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:rl.color}).setOrigin(1,0);
    this.menu.add([card,nm,meta]);
    for(let i=0;i<cap;i++){
      const col=i%2,row=Math.floor(i/2),x=19+col*(lineW+lineGap),ly=y+34+row*(lineH+7),on=i===this.craftLineIndex,a=affs[i],mod=a&&affixDef(a.id),g=this.add.graphics();
      g.fillStyle(on?0x403151:0x2b2137,1);g.fillRoundedRect(x,ly,lineW,lineH,8);g.lineStyle(on?2:1,on?0xffd166:0x574764,1);g.strokeRoundedRect(x,ly,lineW,lineH,8);
      if(mod){const kc=mod.kind==='suffix'?0x5ad1c4:0xff9a5a;g.fillStyle(kc,1);g.fillRoundedRect(x,ly,4,lineH,{tl:8,bl:8,tr:0,br:0});}   // แถบซ้าย prefix=ส้ม/suffix=มิ้นต์
      const nextEmpty=i===affs.length,label=mod?(mod.emoji+' '+mod.label+' '+mod.fmt(a.v)+' · T'+(a.t||5)):(nextEmpty?'＋ Add affix here':'🔒 Fill previous line');
      const tx=this.add.text(x+(mod?11:7),ly+lineH/2,label,{fontFamily:'sans-serif',fontStyle:on?'bold':'normal',fontSize:'8px',color:mod?'#e8dcf0':nextEmpty?'#b9aec8':'#655b6c'}).setOrigin(0,.5);
      this.menu.add([g,tx]);if(mod||nextEmpty)this._zone(x,ly,lineW,lineH,()=>{this.craftLineIndex=i;this.craftTargetId=mod?mod.id:null;this.buildCraftBench();});
    }
    y+=cardH+7;
    const pool=craftAffixPoolForItem(selected),used=new Set(affs.map((a,i)=>i===this.craftLineIndex?'':a.id)),available=pool.filter(m=>!used.has(m.id));
    const rolledId=this._craftRolledId;   // ไฮไลท์ stat ที่เพิ่งสุ่มติด
    const ph=this.add.text(15,y,'POSSIBLE STATS',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#ffd9a8'}).setOrigin(0,0);
    const tierHint=this.add.text(w-15,y,'🎲 random on craft · '+available.length+' possible',{fontFamily:'sans-serif',fontSize:'8px',color:'#9a90ab'}).setOrigin(1,0);this.menu.add([ph,tierHint]);y+=13;
    const lg=this.add.graphics();lg.fillStyle(0xff9a5a,1);lg.fillCircle(18,y+4,3);lg.fillStyle(0x5ad1c4,1);lg.fillCircle(78,y+4,3);this.menu.add(lg);   // legend หมวด stat
    this.menu.add([this.add.text(24,y,'Offense',{fontFamily:'sans-serif',fontSize:'7px',color:'#d8b79a'}).setOrigin(0,0),this.add.text(84,y,'Utility',{fontFamily:'sans-serif',fontSize:'7px',color:'#9adfd4'}).setOrigin(0,0)]);y+=15;
    const pw=(w-34-6)/2,phh=44;
    available.forEach((mod,i)=>{
      const x=14+(i%2)*(pw+6),py=y+Math.floor(i/2)*(phh+5),on=mod.id===rolledId,best=affixBestTierForItem(selected,mod),kc=mod.exclusive?0xff8f3a:(mod.kind==='suffix'?0x5ad1c4:0xff9a5a),g=this.add.graphics();
      g.fillStyle(on?0x4d3d1f:0x2b2137,1);g.fillRoundedRect(x,py,pw,phh,8);g.lineStyle(on?2.5:1.2,on?0xffd166:kc,on?1:0.85);g.strokeRoundedRect(x,py,pw,phh,8);
      g.fillStyle(kc,on?1:0.9);g.fillRoundedRect(x,py,4,phh,{tl:8,bl:8,tr:0,br:0});   // แถบซ้าย = หมวด stat
      const tx=this.add.text(x+11,py+8,(on?'✨ ':'')+mod.emoji+' '+mod.label+(mod.exclusive?' ·EX':''),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:on?'#ffe08a':'#f4ecf8'}).setOrigin(0,0);
      const rg=this.add.text(x+11,py+26,'Best T'+best+' · '+affixBestRangeText(selected,mod),{fontFamily:'sans-serif',fontSize:'7.3px',color:on?'#ffe0b0':'#948aa6'}).setOrigin(0,0);
      this.menu.add([g,tx,rg]);
    });
    y+=Math.ceil(available.length/2)*(phh+5)+5;
    const old=affs[this.craftLineIndex]||null,key=craftCurrencyForLine(rar,!!old),cur=currencyDef(key),have=Save.currency(key),can=available.length>0&&!selected.locked&&have>0,mainH=50,main=this.add.graphics();
    main.fillStyle(can?0x3f9160:0x3a3550,1);main.fillRoundedRect(14,y,w-28,mainH,11);main.lineStyle(1,can?0x8bd3a0:0x574764,1);main.strokeRoundedRect(14,y,w-28,mainH,11);this.menu.add(main);
    if(available.length>0&&!selected.locked){
      this._currencyIcon(key,39,y+mainH/2,32,can?1:.45);
      const mt=this.add.text(61,y+15,'🎲 Craft — random stat',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:can?'#fff':'#8d8195'}).setOrigin(0,.5);
      const cost=this.add.text(61,y+34,cur.name+'  '+have+' / 1',{fontFamily:'sans-serif',fontSize:'8.5px',color:can?'#d8ffe5':'#8d8195'}).setOrigin(0,.5);this.menu.add([mt,cost]);
    }else{
      const mt=this.add.text(w/2,y+mainH/2,selected.locked?'🔒 Unlock item to craft':'No stats left to roll',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#8d8195'}).setOrigin(.5);this.menu.add(mt);
    }
    if(available.length>0&&!selected.locked)this._zone(14,y,w-28,mainH,()=>this.randomCraftSelected());y+=mainH+7;
    const util=[
      ['regal','Promote to Rare',()=>this.promoteFocusedItem(),!selected.locked&&rar==='magic'&&affs.length>=2&&Save.currency('regal')>0],
      ['divine','Reroll Value',()=>this.divineFocusedLine(),!selected.locked&&!!old&&Save.currency('divine')>0],
      ['annul','Remove Line',()=>this.annulFocusedLine(),!selected.locked&&!!old&&Save.currency('annul')>0],
      ['scour','Reset Item',()=>this.scourFocusedItem(),!selected.locked&&(affs.length>0||rar!=='common')&&Save.currency('scour')>0]
    ],ug=6,uw=(w-34-ug)/2,uh=38;
    util.forEach(([currencyKey,label,fn,ok],i)=>{
      const x=14+(i%2)*(uw+ug),uy=y+Math.floor(i/2)*(uh+6),g=this.add.graphics(),n=Save.currency(currencyKey);
      g.fillStyle(ok?0x51405e:0x2b2632,1);g.fillRoundedRect(x,uy,uw,uh,9);g.lineStyle(1,ok?0x8c72a0:0x393342,1);g.strokeRoundedRect(x,uy,uw,uh,9);this.menu.add(g);
      this._currencyIcon(currencyKey,x+19,uy+uh/2,25,ok?1:.32);
      const tx=this.add.text(x+37,uy+uh/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:ok?'#eee2f2':'#665d6d'}).setOrigin(0,.5);
      const ct=this.add.text(x+uw-8,uy+uh/2,'×'+n,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:ok?'#ffe08a':'#665d6d'}).setOrigin(1,.5);
      this.menu.add([tx,ct]);if(ok)this._zone(x,uy,uw,uh,fn);
    });
    y+=2*(uh+6)+3;
    if(y+116<h-8){
      const wallet=this.add.graphics();wallet.fillStyle(0x21182c,.96);wallet.fillRoundedRect(14,y,w-28,114,11);wallet.lineStyle(1,0x4a4059,1);wallet.strokeRoundedRect(14,y,w-28,114,11);
      const wt=this.add.text(22,y+7,'CURRENCY POUCH',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:'#c9a3ff'}).setOrigin(0,0);
      const hint=this.add.text(w-22,y+7,'Live inventory',{fontFamily:'sans-serif',fontSize:'7.5px',color:'#81758e'}).setOrigin(1,0);this.menu.add([wallet,wt,hint]);
      CURRENCY.forEach((d,i)=>{
        const col=i%2,row=Math.floor(i/2),cellW=(w-44)/2,cx=23+cellW*col+11,cy=y+31+row*21;
        this._currencyIcon(d.key,cx,cy,21,Save.currency(d.key)>0?1:.3);
        const nm=this.add.text(cx+14,cy-3,d.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'7.2px',color:Save.currency(d.key)>0?'#e9deef':'#62586c'}).setOrigin(0,.5);
        const ct=this.add.text(cx+14,cy+6,'×'+Save.currency(d.key),{fontFamily:'sans-serif',fontSize:'7px',color:Save.currency(d.key)>0?'#ffe08a':'#62586c'}).setOrigin(0,.5);this.menu.add([nm,ct]);
      });
    }
    this.menu.setVisible(true);
  }
  /* ---- 🏪 NPC Bazaar (Phase 4): ซื้อ · เสี่ยงดวง · ขาย (single-player) ---- */
  // stock หมุนเวียนตาม bazaarSeed (เปลี่ยนทุกครั้งที่ผ่านด่าน) · อ้างอิง Zone Level ของด่านล่าสุด → ยิ่ง Zone สูง ของยิ่งดี
  bazaarStock(){ const seed=(Save.data.bazaarSeed||0),zone=Math.max(1,Math.min(18,Save.data.bazaarZone||1)),rng=mulberry32(((seed*2654435761)>>>0)^0x9e37);
    const chapter=Math.max(1,Math.min(5,Math.floor((zone-1)/3)+1)); const bases=GEAR_ALL.filter(it=>it.tier!=='start'&&it.tier!=='legend'&&(it.chapter||1)<=chapter);
    const tierW=t=>({common:zone<6?5:2,rare:4,epic:zone>=7?4:zone>=4?2:1})[t]||1;
    const gear=[],used=new Set(); for(let i=0;i<3&&bases.length;i++){ const avail=bases.filter(it=>!used.has(it.id)); if(!avail.length)break; let tot=0; avail.forEach(it=>tot+=tierW(it.tier)); let r=rng()*tot,pick=avail[0]; for(const it of avail){ r-=tierW(it.tier); if(r<=0){pick=it;break;} } used.add(pick.id); gear.push(pick); }
    const ckeys=CURRENCY.map(c=>c.key); const cur=[]; const cu=new Set(); for(let i=0;i<3;i++){ let k,guard=0; do{ k=ckeys[Math.floor(rng()*ckeys.length)]; }while(cu.has(k)&&guard++<20); cu.add(k); cur.push({key:k,qty:1+Math.floor(rng()*3)}); }
    return {gear,cur,zone,chapter}; }
  buildBazaar(){
    this.menu.removeAll(true); this.tapZones=[]; this._screenBg('🏪 Mochi Bazaar','','gLoadout');
    const w=this.W,h=this.H, tab=this._bazTab||'buy';
    // ทรัพยากรบนหัว
    const res=this.add.text(w/2,52,'🍬 '+(Save.data.sugar||0)+'   🔩 '+(Save.data.shards||0),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'12px',color:'#ffe08a'}).setOrigin(0.5); this.menu.add(res);
    // แท็บ
    const tabs=[['buy','🛒 Buy'],['gamble','🎲 Gamble'],['sell','💰 Sell']], tw=(w-28)/3, ty=66;
    tabs.forEach(([k,lbl],i)=>{ const x=14+i*tw, on=k===tab; const g=this.add.graphics(); g.fillStyle(on?0xff8f3a:0x2c2338,1); g.fillRoundedRect(x+2,ty,tw-4,28,8); g.lineStyle(1.4,on?0xffd0a0:0x4a4059,1); g.strokeRoundedRect(x+2,ty,tw-4,28,8);
      const t=this.add.text(x+tw/2,ty+14,lbl,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:on?'#fff':'#9a90ab'}).setOrigin(0.5); this.menu.add([g,t]); this._zone(x+2,ty,tw-4,28,()=>{ this._bazTab=k; this.buildBazaar(); }); });
    let y=ty+40;
    if(tab==='buy'){
      const st=this.bazaarStock(),bought=Save.data.bazaarBought||[];
      const hd=this.add.text(14,y,'One-time stock · restocks every stage clear · Zone '+st.zone+' (Ch.'+st.chapter+')',{fontFamily:'sans-serif',fontSize:'9.5px',color:'#a99fbb'}).setOrigin(0,0); this.menu.add(hd); y+=18;
      st.gear.forEach((it,idx)=>{ const key='g'+idx,cost=GEAR_BUY[it.tier]||200,tl=TIER_LABEL[it.tier]||TIER_LABEL.common,sold=bought.includes(key),af=(Save.data.sugar||0)>=cost;
        this._rowBtn(y,40,it.emoji,it.name+' · '+tl.name+' · Ch.'+(it.chapter||1),it.desc,sold?'SOLD':('Buy 🍬'+cost),sold?'#6a6076':(af?'#8bd3a0':'#e0788a'),sold?null:()=>this.bazaarBuyGear(it.id,key,cost));y+=46; });
      st.cur.forEach((c,idx)=>{ const key='c'+idx,d=currencyDef(c.key),cost=(CURRENCY_BUY[c.key]||60)*c.qty,sold=bought.includes(key),af=(Save.data.sugar||0)>=cost;
        this._rowBtn(y,40,d.asset,d.name+' ×'+c.qty,d.desc,sold?'SOLD':('Buy 🍬'+cost),sold?'#6a6076':(af?'#8bd3a0':'#e0788a'),sold?null:()=>this.bazaarBuyCurrency(c.key,c.qty,cost,key)); y+=46; });
    } else if(tab==='gamble'){
      const hd=this.add.text(14,y,'Mystery box — spins like a slot machine, then reveals your prize',{fontFamily:'sans-serif',fontSize:'9.5px',color:'#a99fbb'}).setOrigin(0,0); this.menu.add(hd); y+=18;
      this._rowBtn(y,48,'🎁','Mystery gear box','Gamble 1 instance · duplicate bases keep different affixes and Item Levels','Gamble 🍬180',(Save.data.sugar||0)>=180?'#ffd166':'#e0788a',()=>this.bazaarGambleGear()); y+=54;
      this._rowBtn(y,48,'🧪','currency box','Random 2-4 currency (chance of high-tier orbs)','Gamble 🍬120',(Save.data.sugar||0)>=120?'#ffd166':'#e0788a',()=>this.bazaarGambleCurrency()); y+=54;
    } else { // sell
      const hd=this.add.text(14,y,'Sell extras for 🍬 (currency sells for 60% of buy price)',{fontFamily:'sans-serif',fontSize:'10px',color:'#a99fbb'}).setOrigin(0,0); this.menu.add(hd); y+=18;
      const sh=Save.data.shards||0;
      this._rowBtn(y,40,'🔩','Gear shards ×'+sh,'Convert all shards to 🍬 (×2 each)',sh>0?'Sell +🍬'+(sh*2):'No shards',sh>0?'#8bd3a0':'#7a7088',sh>0?()=>this.bazaarSellShards():null); y+=46;
      CURRENCY.forEach(c=>{ const n=Save.currency(c.key); if(n<=0)return; const val=Math.round((CURRENCY_BUY[c.key]||60)*0.6);
        this._rowBtn(y,40,c.asset,c.name+' ×'+n,'Sell 1','Sell +🍬'+val,'#8bd3a0',()=>this.bazaarSellCurrency(c.key,val)); y+=46; });
    }
    this.menu.setVisible(true);
  }
  bazaarBuyGear(id,key,cost){ const it=GEAR_ALL.find(g=>g.id===id);if(!it)return; cost=cost||GEAR_BUY[it.tier]||200;
    if(key&&(Save.data.bazaarBought||[]).includes(key))return;
    if(!Save.spend(cost)){Sfx.select();this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar',1300);return;}
    const zone=Math.max(1,Math.min(18,Save.data.bazaarZone||1)),si=Math.floor((zone-1)/3),diff=((zone-1)%3)+1,ilvl=rollItemLevel(si,diff);   // iLv อ้างอิง Zone ของด่านล่าสุด
    const delivery=Save.receiveGearInstance(id,{isNew:true,itemLevel:ilvl,chapter:itemChapterFromLevel(ilvl)});
    if(key){Save.data.bazaarBought=(Save.data.bazaarBought||[]).concat(key);Save.save();}
    Sfx.clear();this.showBanner('🛒 Purchased',it.emoji+' '+it.name+' · iLv '+ilvl+gearDeliverySuffix(delivery),1600);this.buildBazaar(); }
  bazaarBuyCurrency(key,qty,cost,slotKey){ if(slotKey&&(Save.data.bazaarBought||[]).includes(slotKey))return; if(!Save.spend(cost)){ Sfx.select(); this.showBanner('🍬 Not enough Sugar','Requires '+cost+' Sugar',1300); return; }
    Save.addCurrency(key,qty); if(slotKey){Save.data.bazaarBought=(Save.data.bazaarBought||[]).concat(slotKey);Save.save();} Sfx.clear(); const d=currencyDef(key); this.showBanner('🛒 Purchased',d.emoji+' '+d.name+' ×'+qty,1400); this.buildBazaar(); }
  // ตู้สล็อต: หมุนไอคอนช้าลงเรื่อย ๆ แล้วหยุดที่รางวัล (ลุ้นสนุก)
  bazaarSlotReveal(pool,land){ if(this._bazBusy)return; this._bazBusy=true; const w=this.W,h=this.H;
    const veil=this.add.rectangle(0,0,w,h,0x0a0611,0.92).setOrigin(0),title=this.add.text(w/2,h*0.30,'🎰 Rolling…',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffe08a'}).setOrigin(0.5),glow=this.add.image(w/2,h*0.47,'vfx_glow').setTint(0xffd166).setScale(0.5).setAlpha(0.25),icon=this.add.text(w/2,h*0.47,'🎁',{fontSize:'72px'}).setOrigin(0.5);
    this.menu.add([veil,title,glow,icon]); this.menu.setVisible(true);
    let ticks=0,delay=55; const spin=()=>{ icon.setText(Phaser.Utils.Array.GetRandom(pool)); Sfx.select&&Sfx.select(); ticks++;
      if(ticks<26){ delay+=ticks>17?(ticks-17)*10:2; this.time.delayedCall(delay,spin); }
      else { if(land.artKey&&this.textures.exists(land.artKey)){ icon.setText(''); const gi=this.add.image(w/2,h*0.47,land.artKey).setDisplaySize(96,96); const ts=gi.scaleX; gi.setScale(ts*0.3); this.menu.add(gi); this.tweens.add({targets:gi,scaleX:ts,scaleY:ts,duration:300,ease:'Back.out'}); }
        else icon.setText(land.emoji||'🎁');
        title.setText(land.title||'✨ Prize!'); glow.setScale(2.6).setAlpha(0.85); this.screenFlash(0xffd166,0.5,420); Sfx.clear();
        const sub=this.add.text(w/2,h*0.63,land.sub||'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff',align:'center',wordWrap:{width:w-50}}).setOrigin(0.5);
        const bt=this.add.text(w/2,h*0.74,'Tap to continue',{fontFamily:'sans-serif',fontSize:'12px',color:'#c7bdd6'}).setOrigin(0.5); this.menu.add([sub,bt]);
        this._bazBusy=false; this._zone(0,0,w,h,()=>this.buildBazaar()); }
    }; spin(); }
  bazaarGambleGear(){ if(this._bazBusy)return; if(!Save.spend(180)){ Sfx.select(); this.showBanner('🍬 Not enough Sugar','Requires 180 Sugar',1300); return; }
    const r=Math.random(), tier=r<0.50?'common':r<0.80?'rare':r<0.95?'epic':'legend'; const got=this.grantGear(tier);
    if(!got){Save.addSugar(180);Sfx.select();this.showBanner('🎁 No eligible base','Sugar refunded',1500);return;}
    const artKey=got.instance?('gear_'+got.id):null;
    this.bazaarSlotReveal(['🥄','🔪','🧤','🛡️','👢','💍','🌙','⭐','💠'],{artKey,emoji:got.emoji,title:'✨ '+got.name+'!',sub:GEAR_SLOTS.find(s=>s.slot===got.slot).emoji+' '+(TIER_LABEL[got.tier]||TIER_LABEL.common).name+' · iLv '+got.instance.itemLevel+gearDeliverySuffix(got)}); }
  bazaarGambleCurrency(){ if(this._bazBusy)return; if(!Save.spend(120)){ Sfx.select(); this.showBanner('🍬 Not enough Sugar','Requires 120 Sugar',1300); return; }
    const n=2+Math.floor(Math.random()*3), got={}; for(let i=0;i<n;i++){ const k=this.rollCurrencyDrop('epic')||'alt'; got[k]=(got[k]||0)+1; Save.addCurrency(k,1); }
    const txt=Object.keys(got).map(k=>currencyDef(k).emoji+'×'+got[k]).join('  ');
    this.bazaarSlotReveal(CURRENCY.map(c=>c.emoji||'🔮'),{emoji:'🧪',title:'🧪 Currency!',sub:txt}); }
  bazaarSellShards(){ const sh=Save.data.shards||0; if(sh<=0)return; Save.data.shards=0; Save.addSugar(sh*2); Sfx.clear(); this.showBanner('💰 Sold shards','+🍬'+(sh*2),1300); this.buildBazaar(); }
  bazaarSellCurrency(key,val){ if(Save.currency(key)<=0)return; Save.spendCurrency(key,1); Save.addSugar(val); Sfx.select(); this.buildBazaar(); }
  openGachaReveal(){
    if(this._gachaBusy)return;if((Save.data.sugar||0)<GACHA_COST){Sfx.select();this.showBanner('🍬 Not enough Sugar','Requires '+GACHA_COST+' Sugar to open the box',1300);return;}
    if(!Save.spend(GACHA_COST))return;this._gachaBusy=true;this.menu.removeAll(true);this.tapZones=[];
    const w=this.W,h=this.H,bg=this.add.rectangle(0,0,w,h,0x090510,0.97).setOrigin(0,0),title=this.add.text(w/2,h*0.14,'🎁 Flavor box',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffe08a'}).setOrigin(0.5);
    const glow=this.add.image(w/2,h*0.47,'vfx_glow').setScale(0.4).setAlpha(0.3).setTint(0xffd166),chest=this.add.text(w/2,h*0.47,'🎁',{fontSize:'92px'}).setOrigin(0.5).setScale(0.72);
    const status=this.add.text(w/2,h*0.66,'Searching for hidden flavors…',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#c7bdd6'}).setOrigin(0.5);
    this.menu.add([bg,title,glow,chest,status]);this.menu.setVisible(true);Sfx.chest();
    this.tweens.add({targets:chest,rotation:{from:-0.06,to:0.06},scale:{from:0.72,to:0.88},duration:90,yoyo:true,repeat:8});
    this.tweens.add({targets:glow,rotation:Math.PI*2,scale:2.2,alpha:{from:0.2,to:0.78},duration:900,ease:'Cubic.in'});
    this.time.delayedCall(420,()=>status.setText('COMMON  ·  RARE  ·  EPIC').setColor('#fff0b8'));
    this.time.delayedCall(920,()=>{
      const it=this.gachaRoll();let tier=it?it.tier:'common';if(!it){Save.addSugar(120);Save.addShards(6);}
      const color=tier==='legend'?0xff8f3a:tier==='epic'?0xc9a3ff:tier==='rare'?0xffcf5a:0x8bd3a0,hex='#'+color.toString(16).padStart(6,'0');
      const gArt=it?('gear_'+it.id):null;
      if(gArt&&this.textures.exists(gArt)){ chest.setText(''); const gi=this.add.image(w/2,h*0.47,gArt).setDisplaySize(120,120); const ts=gi.scaleX; gi.setScale(ts*0.2); this.menu.add(gi); this.tweens.add({targets:gi,scaleX:ts,scaleY:ts,duration:340,ease:'Back.out'}); }
      else chest.setRotation(0).setScale(1.05).setText(it?it.emoji:'🔩');
      glow.setTint(color).setScale(2.8).setAlpha(0.88);
      this.screenFlash(color,tier==='legend'?0.85:tier==='epic'?0.68:tier==='rare'?0.48:0.30,520);this.screenShake(tier==='legend'?620:tier==='epic'?480:260,tier==='legend'?0.02:tier==='epic'?0.014:0.007);Sfx.clear();
      title.setText(it?(tier==='legend'?'🌟 LEGEND DROP 🌟':tier==='epic'?'✦ EPIC DROP ✦':tier==='rare'?'★ RARE DROP ★':'COMMON DROP'):'All owned');
      title.setColor(hex);status.setText(it?(it.name+'\n'+TIER_LABEL[tier].name+gearDeliverySuffix(it)):'Refund 🍬120 · 🔩6').setColor('#ffffff').setAlign('center').setFontSize('18px');
      for(let i=0;i<(tier==='epic'?14:8);i++){const a=i*TAU/(tier==='epic'?14:8),p=this.add.image(w/2,h*0.47,'dot').setTint(color).setScale(0.8).setAlpha(0.9);this.menu.add(p);this.tweens.add({targets:p,x:w/2+Math.cos(a)*Math.min(w*0.38,180),y:h*0.47+Math.sin(a)*Math.min(h*0.25,150),alpha:0,duration:700+i*18,onComplete:()=>p.destroy()});}
      const bw=Math.min(w-60,260),by=h*0.80,btn=this.add.graphics();btn.fillStyle(color,1);btn.fillRoundedRect(w/2-bw/2,by-24,bw,48,16);btn.lineStyle(2,0xffffff,0.42);btn.strokeRoundedRect(w/2-bw/2,by-24,bw,48,16);
      const bt=this.add.text(w/2,by,'Claim and return',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#17101d'}).setOrigin(0.5);this.menu.add([btn,bt]);
      this._gachaBusy=false;this._zone(w/2-bw/2,by-24,bw,48,()=>{this.menuScreen='gear';this.buildMenuScreen();});
    });
  }
  applyMeta(){
    const p=this.player;
    p.cdMul=1; p.dmgTakenMul=1; p.flatDmg=0;   // ตัวคูณ/ดาเมจตรง (รีเซ็ตก่อน)
    p.critChance=0; p.critMul=1.55; p.regen=0; p.regenFlat=0; p.regenPct=0; p.lifeOnKill=0; p.healEffect=1; p.lifesteal=0; p.memoryAmp=0; p.lowHpDmg=0;
    p.twinSprinkle=false; p.deepFreeze=false; p.donutImpact=false; p.echoPath=false; p.mirrorWard=false; p.pressurizedJam=false; p._gearRevive=0;
    p.weaponDmgMul=1;p.weaponCdMul=1;p.weaponShots=0;p.weaponAreaMul=1;p.weaponControlMul=1;p.weaponChains=0;p.weaponReflect=0;
    // เลือกตัวละคร
    this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
    const ch=CHARACTERS[this.character];
    const baseCharKey='char_'+this.character;
    if(this.textures.exists(baseCharKey))this.player.setTexture(baseCharKey);
    this.setCharScale(baseCharKey);   // รูปจริงตัวใหญ่ → ปรับสเกล/ขอบชนให้สมดุลกับตัวละคWaitื่น
    if(this.aura)this.aura.setFillStyle(ch.color||COLORS.mochiEdge,0.14);
    // Combat Profile ใหม่
    const st=ch.stats||{};if(st.hp)p.maxhp+=st.hp;if(st.dmg)p.dmgMul*=st.dmg;if(st.spd)p.baseSpeed*=st.spd;
    if(st.def)p.dmgTakenMul*=st.def;if(st.crit)p.critChance+=st.crit;if(st.cdr)p.cdMul*=st.cdr;if(st.regenFlat)p.regenFlat+=st.regenFlat;
    // Weapon Mastery มีผลเฉพาะอาวุธประจำตัว
    const sw=SIGNATURE_WEAPONS[ch.weapon]||SIGNATURE_WEAPONS.berryBlaster;this.signatureWeapon=sw;
    p.weaponDmgMul=sw.dmgMul||1;p.weaponCdMul=sw.cdMul||1;p.weaponShots=sw.shots||0;p.weaponAreaMul=sw.areaMul||1;
    p.weaponControlMul=sw.controlMul||1;p.weaponChains=sw.chains||0;p.weaponReflect=sw.reflect||0;
    // Talents (Signature talents)
    const ctals=Save.cp(this.character).tal||{};
    const myTalDefs=charTalents(this.character);
    for(const def of myTalDefs){ const r=ctals[def.id]||0; if(r>0&&def.apply) def.apply(p,r); }
    // passivesสวรรค์ถาวร (HP/ATK/DEF) — ใช้ผลรวม ยศ×TAL_MAX + เลเวลWaitบนี้
    for(const k in UPGRADES){ const tot=Save.talTotal(k); if(tot>0)UPGRADES[k].apply(p,tot); }
    for(const slot in GEAR){const inst=Save.equippedGearItem(slot),it=inst&&GEAR_ALL.find(g=>g.id===inst.baseId);if(it&&it.apply){it.apply(p,Save.gearLv(inst.uid));applyItemLevelBonus(p,inst);
      if(it.tier!=='start'){const affs=Save.ensureAffix(inst.uid,it.tier);for(const a of affs){const ad=affixDef(a.id);if(ad)ad.apply(p,a.v);}}}}
    // ชุดอุปกรณ์ (Set Bonus): สวมของชุดเดียวกันครบ 2/3 ชิ้น = โบนัสสะสม
    const setCounts=gearSetCounts();
    for(const sid in setCounts){ const def=GEAR_SETS[sid]; if(!def)continue; for(const need in def.bonuses){ if(setCounts[sid]>=+need&&def.bonuses[need].apply)def.bonuses[need].apply(p); } }
    // Rank Perks (ถาวร เลือกเอง) — vigor/might บวกสแตต · greed/boxLuck ตั้งตัวคูณรันนี้
    const rp=Save.data.rankPerks||{};
    if(rp.vigor)p.maxhp*=1+0.06*rp.vigor;
    if(rp.might)p.dmgMul*=1+0.05*rp.might;
    if(rp.ironWill)p.dmgTakenMul*=(1-0.04*rp.ironWill);
    this.rankSugarMul=1+0.08*(rp.greed||0);
    this._boxLuckMul=1+0.30*(rp.boxLuck||0);
    this._currencyLuckMul=1+0.10*(rp.fortune||0);
    // Bestiary = สแตตถาวรจากการฆ่ามอนสะสม (คืนมาแล้ว v4.8) — hp flat · dmg/def/spd/cdr เป็น % · crit เป็น chance
    const bst=bestiaryTotals();
    if(bst.hp)p.maxhp+=bst.hp;
    if(bst.dmg)p.dmgMul*=(1+bst.dmg);
    if(bst.def)p.dmgTakenMul*=(1-Math.min(0.55,bst.def));
    if(bst.spd)p.baseSpeed*=(1+Math.min(0.4,bst.spd));
    if(bst.crit)p.critChance+=bst.crit;
    if(bst.cdr)p.cdMul*=(1-Math.min(0.5,bst.cdr));
    // หมายเหตุ: Bestiary + Ascension ไม่ให้สแตตรบแล้ว (ยุบแหล่งสแตตที่ทับซ้อน v2.45.0)
    //  · Bestiary → v4.8 คืนสแตตถาวร (bestiaryTotals ด้านบน) + ยังให้ Sugar ตอนปลดขั้น  · Ascension → Sugar ก้อนใหญ่ตอน Ascend
    //  เหลือ 3 เสาพลังที่ผู้เล่นเลือกเอง: Rank (พรถาวร) · Talent เฉพาะตัว · Gear
    p.baseSpeed=Math.min(BALANCE.moveSpeed*1.35,p.baseSpeed);   // meta หลายระบบรวมกันต้องไม่ทำให้เดินเร็วเกินอ่านสนาม
    p.cdMul=Math.max(0.72,p.cdMul);p.critChance=Math.min(0.40,p.critChance);p.dmgMul=Math.min(3.25,p.dmgMul);
    p.dmgTakenMul=Math.max(0.35,p.dmgTakenMul);   // กันเกราะโกงเกิน (รับดาเมจอย่างน้อย 35%)
    p.hp=p.maxhp;
  }
  // ให้ Character EXPปัจจุบัน + คำนวณเลเวล/แต้ม (คืน obj สรุปเพื่อโชว์)
  gainCharExp(n){
    if(!n||n<=0)return; const cp=Save.cp(this.character); cp.exp=(cp.exp||0)+Math.round(n);
    let ups=0; while(cp.exp>=charExpNeed(cp.lvl)){ cp.exp-=charExpNeed(cp.lvl); cp.lvl++; cp.tp=(cp.tp||0)+1; ups++; }
    Save.save(); this._lastExpGain=Math.round(n); this._lastLvlUps=ups; return ups;
  }
  showMenu(){ this.state='menu'; this.clearCharSignature(); Sfx.bgmIntense(false); Sfx.playMainBgm(); this.menuScreen='hub'; if(this.pauseUI)this.pauseUI.setVisible(false); this.buildMenuScreen(); this.hudVisible(false); }
  // หยุดชั่วคราว / เล่นต่อ
  // เร่ง/ลดความเร็วเกมทั้งระบบ (physics + timers + tweens + dt) แบบ Godot time_scale
  setGameSpeed(s){ this.gameSpeed=s;
    // Arcade physics.world.timeScale is INVERTED (bigger = slower step), so use 1/s
    // to actually move bodies (player/enemies/bullets) faster along with timers/tweens/dt.
    if(this.physics&&this.physics.world&&!this._isHitStop) this.physics.world.timeScale=1/s;
    if(this.tweens) this.tweens.timeScale=s;
    if(this.time) this.time.timeScale=s;
    if(this.speedTxt) this.speedTxt.setText('x'+s); }
  togglePause(){
    if(this.state==='play'){ this.state='paused'; this.physics.pause(); this.time.paused=true;   // หยุดนาฬิกาด้วย ไม่งั้น delayedCall (เช่นนับถอยหลังเวฟถัดไป) เดินต่อตอนพัก → เวฟถัดไปหาย
      if(this.joy){ this.joy.active=false; this.joy.dx=0; this.joy.dy=0; this.joyBase.setVisible(false); this.joyKnob.setVisible(false); }
      this.buildPause(); this.pauseTxt.setText('▶'); Sfx.select();
    } else if(this.state==='paused'){ this.state='play'; this.physics.resume(); this.time.paused=false;
      if(this.pauseUI)this.pauseUI.setVisible(false); this.pauseTxt.setText('⏸'); Sfx.select(); }
  }
  buildPause(){
    const w=this.W,h=this.H;
    if(!this.pauseUI){ this.pauseUI=this.add.container(0,0).setScrollFactor(1).setDepth(90); this.camUI(this.pauseUI); }
    this.pauseUI.removeAll(true); this._pauseBtns=[];
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.85).setOrigin(0,0);
    const t=this.add.text(w/2,38,'⏸ Paused',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ff8fb5'}).setOrigin(0.5);
    const sub=this.add.text(w/2,65,'Stage '+((this.stageIndex||0)+1)+' · '+this.kills+' kills',{fontFamily:'sans-serif',fontSize:'12px',color:'#c7bdd6'}).setOrigin(0.5);
    this.pauseUI.add([bg,t,sub]);
    // แผงสกิล/พรที่Owned
    const panelY=82,panelH=72,px=20,pw=w-40;
    const pnl=this.add.graphics(); pnl.fillStyle(0x241a33,0.7); pnl.fillRoundedRect(px,panelY,pw,panelH,14); pnl.lineStyle(1.5,0x4a4059,0.8); pnl.strokeRoundedRect(px,panelY,pw,panelH,14);
    const ph=this.add.text(px+14,panelY+8,'Held',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#cbbfda'}).setOrigin(0,0);
    this.pauseUI.add([pnl,ph]);
    const heldBot=this.drawHeldBar(this.pauseUI,panelY+27);
    if(this.usesBasicAttackBuild())this.drawRecipePanel(this.pauseUI,heldBot+6);   // โชว์สูตร recipe ในหน้าหยุดเกมด้วย
    const portrait=w<=h,gap=portrait?12:16,bw=portrait?Math.min(w-48,330):Math.min(270,(w-56-gap)/2),bh=54;
    const by=portrait?h-138:Math.max(196,h-68),left=portrait?w/2:w/2-gap/2-bw/2,right=portrait?w/2:w/2+gap/2+bw/2;
    this.uiPillBtn(this.pauseUI,left,by,bw,bh,COLORS.mint,'▶','Resume',null);
    this._pauseBtns.push({x:left-bw/2,y:by-bh/2,w:bw,h:bh,fn:()=>this.togglePause()});
    const exitY=portrait?by+bh+gap:by;
    this.uiPillBtn(this.pauseUI,right,exitY,bw,bh,COLORS.grape,'🏠','Quit stage',null);
    this._pauseBtns.push({x:right-bw/2,y:exitY-bh/2,w:bw,h:bh,fn:()=>this.exitStage()});
    this.pauseUI.setVisible(true);
  }
  exitStage(){
    this.physics.resume(); this.time.paused=false; this.clearCharSignature();   // ปลดหยุดฟิสิกส์+นาฬิกาก่อนออก (ไม่งั้นด่านหน้าค้าง)
    if(this._coachUI){this._coachUI.destroy();this._coachUI=null;} this._coach=null; this._inTutorial=false;
    this._bossZoom=1;this.applyMainZoom();
    if(this.pauseUI)this.pauseUI.setVisible(false); this.pauseTxt.setText('⏸');
    if(this.endlessMode)Save.recordEndless(this.endlessCycle||0,this.kills||0,this.elapsed||0,this.character);Save.addSugar(this.sugarStage); this.gainCharExp(Math.floor(this.kills*0.5)); this.sugarStage=0;
    this.boss=null; if(this.bossUI)this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e){ if(e._aura){e._aura.destroy();e._aura=null;} e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
    this.clearFoes(); this.clearPickups(true); this.clearExitPortal();this.clearWaveObjective();this.clearStageProps(); if(this.pipG)this.pipG.clear();
    this.showMenu();
  }
  ensureStageAudio(idx,done){
    const stage=Math.max(1,Math.min(5,(idx||0)+1)),keys=['bgm_stage'+stage,'bgm_boss'+stage];   // โหลดเพลงStage + เพลงบอสของด่านนั้น
    const pending=keys.filter(k=>ASSET_AUDIO[k]&&!this.cache.audio.exists(k));if(!pending.length){done();return;}
    const loader=window.GameLoader;let finished=false;const finish=()=>{if(finished)return;finished=true;done();};
    this.load.on('progress',value=>{if(loader)loader.set(0.08+value*0.24,'Loading stage and boss music...');});
    this.load.on('loaderror',file=>{if(file&&pending.includes(file.key)){delete ASSET_AUDIO[file.key];if(loader)loader.set(0.30,'Some music failed to load — using fallback');}});
    this.load.once('complete',finish);pending.forEach(k=>this.load.audio(k,verUrl(ASSET_AUDIO[k])));this.load.start();
  }

  startRun(idx){
    if(this.state!=='menu')return;
    idx=idx||0;
    this._activeZoneMods=Save.zoneModsUnlocked()?Save.zoneMods().slice():[]; this._zoneMul=this.zoneModMul();   // ล็อก Zone Modifiers ของรันนี้
    this.killStreak=0; this._lastKillAt=-9;   // Juice: รีเซ็ตคอมโบฆ่าต่อเนื่องทุกWaitบ
    this.state='loading';
    this.menu.setVisible(false);
    if(window.GameLoader)window.GameLoader.show('Preparing the stage...',0.08);

    // เพลงหลายด่านเป็นไฟล์ใหญ่ จึงโหลดเฉพาะด่านที่เลือกภายในหน้านี้
    this.ensureStageAudio(idx,()=>{
      // แบ่งงานสร้างด่านเป็นช่วงสั้น ๆ เพื่อให้มือถือวาดหน้าโหลดได้และไม่ดูเหมือนเกมค้าง
      this.time.delayedCall(45,()=>{
        try{
        if(window.GameLoader)window.GameLoader.set(0.38,'Preparing character and skills...');
        this.hudVisible(true);
        this.elapsed=0; this.kills=0; this.stageKills=0; this.sugarStage=0; this.sugarRun=0; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 0');
        if(this.killTxt)this.killTxt.setText('☠ 0');
        this.stageIndex=idx; this.boss=null; this.mode='wave'; this.waveIndex=0; this.waveAlive=0;this._finalStoryShown=false;this.endlessMode=!!this._endlessRequested;this._endlessRequested=false;this.endlessCycle=0;this.secretBoss=false;
        this.character=CHARACTERS[Save.data.character]?Save.data.character:'momo';
        this.skills={}; this.basicAttack=null; this.passives={}; this.uniqueCd=0; this.uniqueLevel=1; this.wardGuardT=0; this.pathHasteT=0; this.swarmAcc=null;this._triSeals=[];this._echoTrail=[];this._echoTrailAcc=0;
        this.skillCd={};for(const k in SKILLDEFS)this.skillCd[k]=0;this.level=1;this.xp=0;this.xpNext=10;this.pendingLvl=0;this._queuedBossIntro=null;
        this.rerollLeft=REROLL_MAX+Save.perkLvl("reroll");this.banishLeft=BANISH_MAX+Save.perkLvl("banish");this.banishedKeys={};this._boxAcc=null;this._reviveLeft=Save.perkLvl("revive")+Save.gearReviveCount();this._adRevived=false;   // โควตาสุ่มใหม่/ลบสกิล + สิทธิ์ฟื้นด้วยโฆษณา ต่อWaitบ
        this.clearStarGuardFx();
        this.refreshUniqueSkillUI();
        this.clearAuraFx(); this._auraTick=0;
        this.setGameSpeed(1);
        this.player.maxhp=90; this.player.baseSpeed=BALANCE.moveSpeed; this.player.pickup=105; this.player.dmgMul=0.90;

        this.time.delayedCall(35,()=>{
          if(window.GameLoader)window.GameLoader.set(0.72,'Setting up the scene and enemies...');
          this.applyMeta();
          this.equipSignatureWeapon();
          this.buildSkillBar();

          this.time.delayedCall(35,()=>{
            if(window.GameLoader){
              window.GameLoader.set(1,this.usesBasicAttackBuild()?'Basic Attack ready!':'Pick a starting skill!');
              this.time.delayedCall(140,()=>window.GameLoader.hide());
            }
            this.openStartingSkillChoice();
          });
        });
        }catch(err){
          this.state='menu';
          if(window.GameLoader)window.GameLoader.hide();
          this.menu.setVisible(true);
          throw err;
        }
      });
    });
  }
  _busy(){ return this.state==='play'||this.state==='levelup'; }  // ยังเล่นอยู่ (levelup แค่พักชั่วคราว)

  /* ---------- STAGES / WAVES (Archero-style) ---------- */
  getPowerGuide(stageIndex){
    const st=STAGES[stageIndex]||STAGES[0],rating=Save.power(this.character),recommended=st.recommendedPower||100,ratio=rating/recommended;
    const gap=Phaser.Math.Clamp(1-ratio,0,0.60),assist=gap*0.32;
    return{rating,recommended,ratio,enemyHp:1-assist,enemyDmg:1-assist*0.78,reward:1+gap*0.50,label:ratio>=1.15?'Above recommended':ratio>=0.90?'Ready':ratio>=0.70?'Challenging':'Underpowered'};
  }
  clearChapterDepth(){
    for(const o of this._chapterDepthObjs||[]){if(!o)continue;this.tweens.killTweensOf(o);if(o.active)o.destroy();}this._chapterDepthObjs=[];
  }
  buildChapterDepth(i){
    this.clearChapterDepth();this._chapter25D=i===5;if(!this._chapter25D||!this.textures.exists('ch2_prop_atlas'))return;
    const add=(x,y,frame,scale,depth,scroll,alpha,drift)=>{const o=this.camWorld(this.add.image(x,y,'ch2_prop_atlas',frame).setScale(scale).setDepth(depth).setScrollFactor(scroll).setAlpha(alpha));this._chapterDepthObjs.push(o);if(drift)this.tweens.add({targets:o,y:y+drift,x:x+drift*.25,duration:4200+Math.abs(x)%1700,yoyo:true,repeat:-1,ease:'Sine.inOut'});return o;};
    // back terraces → mid canopy → foreground leaves: parallax ต่างกันแต่None physics จึงเบาสำหรับมือถือ
    add(-720,-520,6,.92,-100001,.46,.24,18);add(680,-610,6,.82,-100001,.52,.20,-15);
    add(-900,120,1,.62,-400,.82,.34,22);add(920,-90,2,.56,-350,.86,.30,-18);
    add(-980,760,4,.92,1900,1.08,.48,-24);add(1030,720,4,.86,1880,1.06,.44,20);
    for(let k=0;k<5;k++){const fog=this.camWorld(this.add.image(-880+k*430,-620+k%2*760,'vfx_cloud_field').setTint(0x56e5bd).setScale(1.7+k*.12,.72).setAlpha(.055).setDepth(-200).setScrollFactor(.72+k*.045));this._chapterDepthObjs.push(fog);this.tweens.add({targets:fog,x:fog.x+180,y:fog.y-35,duration:7200+k*820,yoyo:true,repeat:-1,ease:'Sine.inOut'});}
  }
  clearStageProps(){ this.clearChapterDepth();if(this.decoProps)this.decoProps.clear(true,true); if(this.solidProps)this.solidProps.clear(true,true); }
  // จัดวาง props เป็น "Room" Waitบจุดเกิด (0,0) — เดินเรื่องด้วยเลย์เอาต์ที่ตั้งใจ ไม่ใช่พื้นลอย ๆ
  buildStageProps(i){
    this.clearStageProps();
    const add=(key,x,y,solid,sc,frame=0,depthOffset=0)=>{ if(!this.textures.exists(key))return; sc=sc||1;
      const physical=i===0&&key!=='nest_acid'&&key!=='nest_hole';
      if(solid||physical){ const s=this.solidProps.create(x,y,key,frame); s.setScale(sc).setDepth(y+depthOffset).refreshBody();
        if(s.body){
          if(key==='nest_hole'){ // หลุมกลม → กล่องชนอยู่ตรงกลางคลุมเกือบทั้งปาก กันเดินทะลุทุกมุม
            const d=Math.max(24,Math.min(s.displayWidth,s.displayHeight)*0.72);
            s.body.setSize(d,d);s.body.setOffset((s.displayWidth-d)/2,(s.displayHeight-d)/2);
          }else{const bw=Math.max(24,s.displayWidth*0.72),bh=Math.max(18,s.displayHeight*0.34);s.body.setSize(bw,bh);s.body.setOffset((s.displayWidth-bw)/2,s.displayHeight-bh);}
        }
      }else{ const im=this.add.image(x,y,key,frame).setScale(sc).setDepth(y+depthOffset); this.camWorld(im); this.decoProps.add(im); }
    };
    const L=STAGE_PROPS[i]; if(!L)return;
    for(const p of L)add(p[0],p[1],p[2],p[3],p[4],p[5],p[6]);
  }
  startStage(i){
    const st=STAGES[i]; this.clearExitPortal(); this.clearBossObjects();this.clearWaveObjective(); this.stageIndex=i; this.stageElapsed=0; this.boss=null; this.mode='breather'; this.waveIndex=0; this.waveAlive=0;this.moveSlowT=0;this.drainPull=null;
    this._bossZoom=1;this.applyMainZoom();
    this._waveObjectiveBag=i<=4?Phaser.Utils.Array.Shuffle(['survive','hunt','purge','capture'].slice()):[];
    Sfx.playStageBgm(i+1);
    this.bossUI.forEach(o=>o.setVisible(false));
    this.gridBg.fillColor=st.grid;
    if(this.bgTile&&this.textures.exists('bg'+(i+1))) this.bgTile.setTexture('bg'+(i+1));   // พื้นหลังโซนตามด่าน
    this.buildStageProps(i);this.buildChapterDepth(i);   // props หลัก + parallax 2.5D เฉพาะ Chapter 2
    this._powerGuide=this.getPowerGuide(i);const pg=this._powerGuide;
    const stageNo=st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):(i+1),_d=this.diffMul();this.stageTxt.setText(`Stage ${stageNo} · ${st.name} · ${_d.emoji}${_d.name} · Zone ${this.zoneLevel()}`);
    this.showBanner(`${st.emoji} Stage ${stageNo}: ${st.name}`, st.lore+' · ⚡ '+pg.rating+'/'+pg.recommended+' '+pg.label, 3000);
    this.updateWaveText();
    this.time.delayedCall(1400,()=>{ if(this._busy()) this.startWave(0); });
  }
  updateWaveText(){
    const st=STAGES[this.stageIndex]; if(!st)return;
    if(this.mode==='boss') this.timeTxt.setText('👹 Boss');
    else if(this.mode==='bossWarning') this.timeTxt.setText('⚠️ The boss is coming!');
    else if(this.mode==='miniWarning') this.timeTxt.setText('⚠️ A miniboss is coming!');
    else if(this.mode==='portal') this.timeTxt.setText('🌀 Enter the portal to the next stage');
    else if(this.mode==='mini') this.timeTxt.setText('💢 Miniboss — take it down!');
    else if(this.mode==='breather') this.timeTxt.setText('Next wave…');
    else this.timeTxt.setText('⚔ Wave '+(this.waveIndex+1)+'/'+st.waves+' · ⏳ '+Math.max(0,Math.ceil(this.waveTimer||0))+'s');
    this.drawWavePips();
  }
  drawWavePips(){
    const g=this.pipG; if(!g)return; g.clear();
    const st=STAGES[this.stageIndex]; if(!st||this.mode==='boss')return;
    const n=st.waves, seg=Math.min(20,(this.W*0.62)/n), w=seg-3, h=6;
    const x0=this.W/2-(n*seg)/2, y=this._pad+80;
    for(let i=0;i<n;i++){ const x=x0+i*seg;
      let col=0x4a4059, a=0.7;                       // ยังไม่ถึง
      if(i<this.waveIndex){ col=0x8bd3a0; a=0.9; }    // ผ่านแล้ว
      else if(i===this.waveIndex){ col=0xffd166; a=1; }// เวฟปัจจุบัน
      g.fillStyle(col,a); g.fillRoundedRect(x,y,w,h,3);
      if(i===st.miniAt){ g.fillStyle(0xff7ac0,1); g.fillCircle(x+w/2,y-4,2.5); } // pointsชมพู=Miniboss
    }
    // ปลายแถว = บอสใหญ่
    g.fillStyle(0xff5f97,1); g.fillCircle(x0+n*seg+4,y+h/2,4);
  }
  waveProfile(w){
    const si=this.stageIndex;
    if(si===5){const canopy=[
      {name:'Ferment Sprout',desc:'Ferment Sprouts grow from memories forced through the seasons',dur:50,interval:1.42,batch:2,max:30,pressureCap:0.22,types:['basic','basic','basic','basic','fast']},
      {name:'Hunting Vines',desc:'Vine Skippers leap across roots while sprouts cut off retreat',dur:52,interval:1.04,batch:3,max:42,pressureCap:0.36,types:['fast','fast','dasher','basic','basic']},
      {name:'Spore Warden',desc:'The Sporewarden Mantis seals the canopy and calls sprouts from the fermented floor',dur:0,interval:1.34,batch:3,max:36,pressureCap:0.42,types:['basic','fast','fast','shooter']},
      {name:'Toxic Fruit Rain',desc:'Spore Lanterns fire from afar while Rotfruit Pods explode to squeeze the field',dur:55,interval:1.14,batch:3,max:46,pressureCap:0.56,types:['tank','siege','shooter','shooter','bomber','basic']},
      {name:'Season Collapse',desc:'Mutated plants of every kind bloom before the Rootmother wakes',dur:59,interval:0.82,batch:4,max:62,pressureCap:0.70,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return canopy[w]||canopy[canopy.length-1];}
    if(si===4){const crown=[
      {name:'Void Shard',desc:'Void Crumbs drift from the banquet table and start devouring scraps of flavor',dur:50,interval:1.48,batch:2,max:28,pressureCap:0.20,types:['basic','basic','basic','basic','basic','fast']},
      {name:'Crown Shredder',desc:'Crown Rippers dash through the ranks amid swarms of Void Crumbs',dur:52,interval:1.08,batch:3,max:40,pressureCap:0.34,types:['fast','fast','dasher','basic','basic']},
      {name:'Banquet Executioner',desc:'The Banquet Executioner leads the crown army to seal the oven doors',dur:0,interval:1.40,batch:2,max:32,pressureCap:0.40,types:['basic','basic','fast','fast']},
      {name:'Banquet Eye',desc:'Banquet Eyes fire from the rear while Maw Truffles squeeze the field',dur:54,interval:1.24,batch:3,max:42,pressureCap:0.52,types:['tank','siege','shooter','shooter','bomber','basic']},
      {name:'Tasteless Banquet',desc:'An army of every kind pours in before the Sovereign who devours flavor arrives',dur:58,interval:0.88,batch:4,max:58,pressureCap:0.66,types:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];return crown[w]||crown[crown.length-1];}
    if(si===1){const drain=[
      {name:'Loose Pipe Bubble',desc:'Basic rot-bubbles lead the way — learn their movement slowly',dur:46,interval:1.55,batch:2,max:24,pressureCap:0.20,types:['basic','basic','basic','basic','basic','basic','basic','basic']},
      {name:'Backflow Current',desc:'Swoopers ride the current, forcing you to change your path',dur:48,interval:1.15,batch:3,max:34,pressureCap:0.32,types:['fast','fast','dasher','basic','basic']},
      {name:'Boiling Valve',desc:'Boiling valve-keepers lead a fast reinforcement wave',dur:0,interval:1.50,batch:2,max:28,pressureCap:0.38,types:['basic','basic','basic','basic','fast','fast','fast']},
      {name:'Clogged Grate',desc:'Heavy-armored bubbles squeeze the field while spitters fire from behind',dur:50,interval:1.32,batch:2,max:34,pressureCap:0.48,types:['tank','tank','basic','basic','basic','shooter','bomber']},
      {name:'Sewer Overflow',desc:'Every kind pours in together before the sponge-demon’s chamber',dur:54,interval:0.98,batch:3,max:46,pressureCap:0.62,types:['fast','fast','dasher','shooter','bomber','tank','basic','basic']}
    ];return drain[w]||drain[drain.length-1];}
    const profiles=[
      {name:'Opening Move',desc:'A basic melee swarm eases in — read their movement first',dur:48,interval:1.60,batch:2,max:25,pressureCap:0.18,types:si===0?['basic','basic','basic','basic','basic','basic','basic','basic','basic','acid']:['basic','basic','basic','fast']},
      {name:'Lightning Swarm',desc:'Fast enemies charge in groups — don’t stand still',dur:50,interval:1.10,batch:3,max:38,pressureCap:0.30,types:['fast','fast','dasher','basic','basic']},
      {name:'Stage Warden',desc:'A miniboss with a melee support wave',dur:0,interval:1.50,batch:2,max:30,pressureCap:0.36,types:si===0?['basic','basic','basic','basic','acid']:['basic','basic','basic','basic','fast','fast']},
      {name:'Iron Wall',desc:'Tanks and ranged lines squeeze the field',dur:52,interval:1.35,batch:2,max:36,pressureCap:0.48,types:si<2?['tank','tank','basic','basic','basic','basic','acid','shooter']:['tank','siege','shooter','basic','basic']},
      {name:'Final Trial',desc:'A mixed wave before the boss confrontation',dur:56,interval:0.92,batch:4,max:52,pressureCap:0.62,types:si===0?['acid','dasher','tank','basic','basic','basic']:['fast','dasher','shooter','bomber','tank','siege','basic','basic']}
    ];
    return profiles[w]||profiles[profiles.length-1];
  }
  playWaveCutscene(w,beat,done){
    if(this._inTutorial){done();return;}   // ระหว่างสอน = ไม่เล่นบทพูดกับตัวเอง (กันซ้อนกับบับเบิลครูBerry)
    const layer=this.storyLayer;if(!layer){done();return;}layer.removeAll(true);layer.setVisible(true);this.physics.pause();this.state='cinematic';
    const c=CHARACTERS[this.character]||CHARACTERS.momo,reactions=STORY_REACTIONS[this.character]||STORY_REACTIONS.momo,quote=reactions[w%reactions.length];
    const h=this.H,wid=this.W,panelH=Math.min(172,Math.max(154,h*0.30)),y=h-panelH;
    const dim=this.add.rectangle(0,0,wid,h,0x08060d,0.34).setOrigin(0),panel=this.add.graphics();panel.fillStyle(0x17111f,0.97);panel.fillRoundedRect(10,y,wid-20,panelH-10,16);panel.lineStyle(2,c.color,0.9);panel.strokeRoundedRect(10,y,wid-20,panelH-10,16);
    const em=this.add.text(42,y+panelH/2-4,c.emoji,{fontSize:'42px'}).setOrigin(0.5),name=this.add.text(76,y+18,c.name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffd166'}).setOrigin(0,0.5);
    const title=this.add.text(76,y+40,beat?beat.title:('Wave '+(w+1)),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',wordWrap:{width:wid-96}}).setOrigin(0,0.5);
    const line=this.add.text(76,y+68,'“'+quote+'”',{fontFamily:'sans-serif',fontSize:'14px',color:'#ffe4f0',lineSpacing:3,wordWrap:{width:wid-96},maxLines:3}).setOrigin(0,0);
    const skip=this.add.text(wid-22,y+panelH-24,'Tap to continue  ▶',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#8bd3a0'}).setOrigin(1,0.5);layer.add([dim,panel,em,name,title,line,skip]);
    // ให้เวลาอ่านตามความยาวประโยค (อ่านไม่ทันในเวอร์ชันก่อน) — แตะข้ามได้เสมอ · ตัด lore ที่รายละเอียดเยอะออก
    const readMs=Phaser.Math.Clamp(2600+quote.length*70,3600,7000);
    let finished=false;const finish=()=>{if(finished)return;finished=true;this._finishStoryCutscene=null;layer.setVisible(false);layer.removeAll(true);this.state='play';this.physics.resume();done();};this._finishStoryCutscene=finish;this.time.delayedCall(readMs,finish);
  }
  playStoryPanel(key,kicker,title,body,done){
    const layer=this.storyLayer;if(!layer||!this.textures.exists(key)){done();return;}layer.removeAll(true);layer.setVisible(true);this.physics.pause();this.state='cinematic';
    const w=this.W,h=this.H,art=this._coverImage(0,0,w,h,key),dim=this.add.rectangle(0,0,w,h,0x08050d,0.28).setOrigin(0),band=this.add.graphics();
    band.fillGradientStyle(0x08050d,0x08050d,0x08050d,0x08050d,0.02,0.02,0.96,0.96);band.fillRect(0,h*0.55,w,h*0.45);band.lineStyle(2,0xffd166,0.78);band.lineBetween(18,h*0.64,w-18,h*0.64);
    const k=this.add.text(w/2,h*0.60,kicker,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffd166',letterSpacing:3}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.70,title,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:Math.min(28,w*0.07)+'px',color:'#ffffff',stroke:'#240916',strokeThickness:5,align:'center',wordWrap:{width:w-38}}).setOrigin(0.5);
    const b=this.add.text(w/2,h*0.79,body,{fontFamily:'sans-serif',fontSize:'12px',color:'#f2dfe8',align:'center',lineSpacing:4,wordWrap:{width:w-46},maxLines:3}).setOrigin(0.5,0);
    const skip=this.add.text(w-18,h-18,'Tap to continue  ▶',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffe08a'}).setOrigin(1,1);layer.add([art,dim,band,k,t,b,skip]);
    let finished=false;const finish=()=>{if(finished)return;finished=true;this._finishStoryCutscene=null;layer.setVisible(false);layer.removeAll(true);this.state='play';this.physics.resume();done();};this._finishStoryCutscene=finish;this.time.delayedCall(6500,finish);
  }
  startWave(w,seamless){
    const beat=(STAGE_STORY_BEATS[this.stageIndex]||[])[w];this.waveIndex=w;this.boss=null;this.bossUI.forEach(o=>o.setVisible(false));
    this.playWaveCutscene(w,beat,()=>this.beginWave(w,seamless,beat));
  }
  beginWave(w,seamless,beat){
    const st=STAGES[this.stageIndex],p=this.waveProfile(w);
    if(w===st.miniAt){this.mode='miniWarning';this.setupSpawnRates(w);this.updateWaveText();
      this.showBanner('⚠️ '+(beat?beat.title:st.mini),beat?beat.sub:(st.mini+' — get ready to find space to dodge'),2600);Sfx.bossWarn();this.screenFlash(0xff4d8f,0.18,500);
      this.scheduleStageEvent(2800,'miniWarning',()=>this.spawnMiniBoss());
    }else{this.mode='wave';this.startSurvivalWave(w,false);this.setupWaveObjective(w,p);const o=this.waveObjective;
      if(!this._inTutorial)this.showBanner(o?(o.emoji+' '+o.name):(beat?beat.title:('Part '+(w+1))),o?((beat?beat.title+' · ':'')+o.desc):(beat?beat.sub:p.desc),2400);}
    this.updateWaveText();
  }
  setupSpawnRates(w){
    const p=this.waveProfile(w),si=this.stageIndex;this.waveTypes=p.types.slice();
    // Stage 3 ขึ้นไป (si>=2): เพิ่มจำนวนมอน (แน่นขึ้น) + ลดสัดส่วนตัวตีไกล (shooter) ให้เน้นประชิด
    if(si>=2){ let sh=0; this.waveTypes=this.waveTypes.map(t=>{ if(t==='shooter'){ sh++; return sh>1?'basic':t; } return t; }); }   // เหลือ shooter ได้มากสุด 1 ช่องในลิสต์ = ตัวตีไกลออกน้อยลง
    this.spawnInterval=Math.max(0.5,p.interval-si*0.03-(si>=2?0.14:0));this.spawnBatch=p.batch+Math.floor(si/2)+1+(si>=2?1:0);   // มอนไหลถี่+เป็นชุดใหญ่ขึ้น (ด่านหลังแน่นกว่า)
    this.maxLive=Math.min(115,p.max+si*(si>=2?7:4)+6+(si>=2?12:0));this.eliteEvery=14+Math.max(0,3-w);this.eliteAcc=this.eliteEvery;   // เพดานฝูงบนจอมากขึ้น
    this.waveAllowsElite=w===3||w===4;this.swarmAcc=Phaser.Math.FloatBetween(24,32);
  }
  spawnWaveEnemy(){const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['basic'];this.spawnEnemy(Phaser.Utils.Array.GetRandom(types));}
  // Soft director: ผู้เล่นฆ่าเร็วได้เจอฝูงเพิ่มเล็กน้อย แต่มี cap รายเวฟและไม่เปลี่ยน type pool/ดาเมจ
  wavePressure(){
    const p=this.waveProfile(this.waveIndex),elapsed=Math.max(8,(this.waveDur||0)-Math.max(0,this.waveTimer||0)),kills=Math.max(0,(this.stageKills||0)-(this.waveKillStart||0));
    const target=0.48+this.waveIndex*0.10+this.stageIndex*0.05,pace=kills/elapsed,raw=Phaser.Math.Clamp((pace-target)/Math.max(0.25,target),0,1);
    return Math.min(p.pressureCap==null?0.45:p.pressureCap,raw);
  }
  // เกิดมอนเป็น "circle" Waitบผู้เล่นแล้วบีบวงเข้ามา (chase AI ทำให้ค่อย ๆ หุบวง)
  spawnWaveRing(n){
    if(n<=0)return; const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['basic'];
    const base=Math.random()*Math.PI*2, step=Math.PI*2/n, jitter=step*0.26;
    const rad=Math.max(this.W,this.H)/this.viewZoom*0.62+40;
    for(let i=0;i<n;i++){ const ang=base+i*step+Phaser.Math.FloatBetween(-jitter,jitter);
      this.spawnEnemy(Phaser.Utils.Array.GetRandom(types),ang,rad*Phaser.Math.FloatBetween(0.94,1.06)); }
  }
  spawnSwarm(){
    const n=Math.min(this.maxLive-this.enemies.countActive(true),10+this.stageIndex*2+this.waveIndex*2);if(n<=4)return;
    const types=this.waveTypes&&this.waveTypes.length?this.waveTypes:['fast','basic'];
    for(let i=0;i<n;i++)this.spawnEnemy(Phaser.Utils.Array.GetRandom(types));
    const beat=STAGE_SWARM_BEATS[this.stageIndex]||STAGE_SWARM_BEATS[0];
    this.showBanner(beat.title,beat.sub,1800);Sfx.bossWarn();this.screenShake(180,0.005);
  }
  spawnElite(){
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.6+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false); const eliteKey=this.stageIndex===0?(this.textures.exists('e_ant_drone_readable')?'e_ant_drone_readable':'e_ant_drone'):(this.stageIndex===1?'e_drain_tank':this.stageIndex===2?'e_fire_golem':this.stageIndex===3?'e_ice_guardian':this.stageIndex===4?'e_royal_oven_sentinel':this.stageIndex===5?'ch2_enemy_atlas':'e_tank'),eliteFrame=this.stageIndex===5?6:0;
    if(!e) e=this.enemies.create(x,y,eliteKey,eliteFrame); else { e.setTexture(eliteKey,eliteFrame); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }
    if(!e){ e=this.enemies.getFirstAlive(); if(!e)return null; e.setTexture(eliteKey,eliteFrame); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }   // pool Full → รีไซเคิล (Minibossต้องเกิดเสมอ ไม่งั้นเวฟไม่ผ่าน)
    this.clearObjectiveTargetFx(e);e._waveObjectiveTarget=false;
    const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),stageCurve=[1,1.32,1.72,2.18,2.72,3.35][this.stageIndex]||3.35,waveCurve=[1,1.06,1.13,1.21,1.30][this.waveIndex]||1.30,s=stageCurve*waveCurve*pg.enemyHp*1.15*this.killPowerMul()*this.diffMul().hp;   // elite ถึกขึ้นเล็กน้อย + สเกลตามมอนที่ตาย + ระดับความยาก
    e.hp=70*s; e.maxhp=e.hp; e.spd=48; e.dmg=Math.round(18*([1,1.05,1.12,1.20,1.30,1.42][this.stageIndex]||1.42)*pg.enemyDmg*this.diffMul().dmg); e.xp=8;
    if(this.stageIndex===0)e.setCircle(28,20,20);else if(this.stageIndex===4)e.setCircle(54,74,74);else if(this.stageIndex===5)e.setCircle(48,80,80);else e.setCircle(26,5,5); e.isBoss=false; e.isMini=false; e.isElite=true; e.frozen=0; e.knock=0;
    e.shooter=false; e.bomber=false; e.acid=false; e.dasher=false; e.siege=false; e.dashState=null; e.tintColor=this.stageIndex===1?0x72e5d0:null;e.frostbite=this.stageIndex===3;e.bloomStacks=0;e.bloomUntil=0;
    e.baseScale=this.stageIndex===0?0.95:(this.stageIndex===1?0.84:this.stageIndex===2?0.92:this.stageIndex===3?0.94:this.stageIndex===4?0.56:this.stageIndex===5?0.42:1.55);if(this.stageIndex===4)e.roleName='Crown Oven Guard';if(this.stageIndex===5)e.roleName='Crown Sapling'; e._sqX=1; e._sqY=1; e.setScale(e.baseScale).clearTint();if(e.tintColor)e.setTint(e.tintColor);if(this.anims.exists(eliteKey+'_walk'))e.play(eliteKey+'_walk',true);this.camWorld(e);return e;
  }
  // เวฟธรรมดา = "Survive the timer" (นับถอยหลัง + มอนเกิดต่อเนื่องเป็นฝูง)
  startSurvivalWave(w, seamless){
    const si=this.stageIndex;
    this.setupSpawnRates(w);
    this.waveDur=this.waveProfile(w).dur;               // เวฟละ 48–56s รวมบอส/พัก ≈ 5 นาทีต่อด่าน
    this.waveTimer=this.waveDur; this.spawnAcc=0;this.waveKillStart=this.stageKills||0;
    // ระลอกเปิดตัว — เวฟที่ไหลต่อ (seamless) ข้ามการถล่มเปิดตัว เพราะมอนสเตอร์เดิมยังFullจออยู่
    if(!seamless){
      const burst=Math.min(this.maxLive, 5 + w*2 + si);
      this.spawnWaveRing(burst);   // ระลอกเปิดตัวเป็นcircleล้อมWaitบแล้วบีบเข้า
      if(this.waveAllowsElite) for(let i=0;i<1+Math.floor(si/3);i++)this.spawnElite();
    } else {
      const live=this.enemies.countActive(true);   // เติมให้ถึงราวครึ่งเพดานถ้ามอนเดิมเหลือน้อย
      const fill=Math.max(0, Math.min(this.maxLive, Math.floor(this.maxLive*0.55))-live);
      this.spawnWaveRing(fill);
    }
    // กล่อง/โหลทุบได้ (ธีมครัว) — ทุบเอาของ (ออร์บ/ฟื้นฟู)
    const nc=2+Math.floor(si*0.6); for(let i=0;i<nc;i++) this.spawnCrate();
    this.spawnStageGimmick();
  }
  setupWaveObjective(w,p){
    this.clearWaveObjective();
    if(this.stageIndex>4)return;   // Waitบแรกเปิดใช้กับ Chapter 1 ตามลำดับงาน
    if(!this._waveObjectiveBag||!this._waveObjectiveBag.length)this._waveObjectiveBag=Phaser.Utils.Array.Shuffle(['survive','hunt','purge','capture'].slice());
    const type=this._waveObjectiveBag.pop(),def=WAVE_OBJECTIVES[type],color=CH1_OBJECTIVE_COLORS[this.stageIndex]||0xffd166;
    const o=this.waveObjective={type,emoji:def.emoji,name:def.name,desc:def.desc,color,progress:0,target:0,done:false};
    if(type==='survive')o.target=Math.max(1,p.dur||48);
    else if(type==='hunt'){
      o.target=2+(w>=4?1:0)+(this.stageIndex>=3?1:0);o.desc='Kill the marked Elite targets: '+o.target+' before time runs out';this.spawnObjectiveElite();
    }else if(type==='purge'){
      o.target=3+(w>=4?1:0);o.desc='Attack or approach to purge the cores: '+o.target+' points';for(let i=0;i<o.target;i++)this.spawnWaveObjectiveNode(i,o.target);
    }else{
      o.target=12+w*2;o.desc='Stand in the capture zone for '+o.target+' seconds';this.spawnCaptureZone();
    }
    this.renderWaveObjectiveHUD();
  }
  objectivePosition(i=0,n=1,minR=240,maxR=390){
    const lim=WORLD/2-130;let pos={x:this.player.x,y:this.player.y};
    for(let tryN=0;tryN<8;tryN++){const a=(i/n)*TAU+Phaser.Math.FloatBetween(-.38,.38)+tryN*.72,r=Phaser.Math.Between(minR,maxR);pos={x:Phaser.Math.Clamp(this.player.x+Math.cos(a)*r,-lim,lim),y:Phaser.Math.Clamp(this.player.y+Math.sin(a)*r,-lim,lim)};let blocked=false;
      if(this.solidProps)this.solidProps.children.iterate(s=>{if(s&&s.active&&this.dist(pos.x,pos.y,s.x,s.y)<135)blocked=true;});if(!blocked)break;}
    return pos;
  }
  spawnWaveObjectiveNode(i,n){
    const o=this.waveObjective;if(!o||o.type!=='purge')return;
    // เกิดห่างกันขึ้น: วงกว้างขึ้น + เว้นระยะจากแกนอื่นอย่างน้อย ~260
    let pos=this.objectivePosition(i,n,340,560);
    for(let tryN=0;tryN<6;tryN++){ let tooClose=false;
      this.waveNodes.children.iterate(nd=>{ if(nd&&nd.active&&nd._waveObjectiveNode&&this.dist(pos.x,pos.y,nd.x,nd.y)<260)tooClose=true; });
      if(!tooClose)break; pos=this.objectivePosition(i,n,340,560); }
    let node=this.waveNodes.getFirstDead(false);if(!node)node=this.waveNodes.create(pos.x,pos.y,'nest_crystal');else{node.setTexture('nest_crystal').setActive(true).setVisible(true).setPosition(pos.x,pos.y);if(node.body)node.body.enable=true;}
    if(!node)return;const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),mul=(1+this.stageIndex*.55+this.waveIndex*.14)*pg.enemyHp*this.diffMul().hp;
    node.hp=Math.round(95*mul);node.maxhp=node.hp;node._purifyCd=0;node._shootCd=Phaser.Math.FloatBetween(1.6,2.6);node._waveObjectiveNode=true;node.setScale(.66).setTint(o.color).setDepth(node.y+1);this.camWorld(node);   // ถึกขึ้น (34→95) + ยิงกลับได้
    if(node.body){node.body.setAllowGravity(false);node.body.setImmovable(true);node.body.setCircle(42,22,22);}
    node._objectiveCue=this.camWorld(this.add.image(node.x,node.y,'vfx_ring').setTint(o.color).setDepth(node.y).setDisplaySize(112,92).setAlpha(.52));
    this.tweens.add({targets:node._objectiveCue,rotation:TAU,alpha:{from:.34,to:.62},duration:1500,yoyo:true,repeat:-1,ease:'Sine.inOut'});this.vfxSpawnPoof(node.x,node.y);
  }
  hitWaveNode(b,node){
    if(!b.active||!node.active||!node._waveObjectiveNode)return;const dmg=b.dmg||8;node.hp-=dmg;this.popDmg(Math.round(dmg),node.x,node.y,false);this.vfxHitRing(node.x,node.y,this.waveObjective?.color||0xffd166,false);if(!b.pierce)this.killBullet(b);if(node.hp<=0)this.destroyWaveObjectiveNode(node);
  }
  destroyWaveObjectiveNode(node){
    if(!node||!node.active)return;const x=node.x,y=node.y;if(node._objectiveCue){this.tweens.killTweensOf(node._objectiveCue);node._objectiveCue.destroy();node._objectiveCue=null;}
    node._waveObjectiveNode=false;node.setActive(false).setVisible(false);if(node.body)node.body.enable=false;this.burst(x,y,this.waveObjective?.color||0xffd166);
    const o=this.waveObjective;if(o&&o.type==='purge'&&!o.done){o.progress++;this.renderWaveObjectiveHUD();if(o.progress>=o.target)this.completeWaveObjective();}
  }
  spawnCaptureZone(){
    const o=this.waveObjective;if(!o||o.type!=='capture')return;const pos=this.objectivePosition(0,1,250,370),r=140;
    this._captureZone=this.camWorld(this.add.circle(pos.x,pos.y,r,o.color,.12).setStrokeStyle(4,o.color,.82).setDepth(pos.y-2));this._captureZone.radiusGoal=r;   // ขยายเขต (112→140) ให้ยืนในวงแล้วนับแน่นอน
    this._captureRing=this.camWorld(this.add.image(pos.x,pos.y,'vfx_magic_circle').setTint(o.color).setDisplaySize(r*2,r*1.72).setDepth(pos.y-1).setAlpha(.7));
    this.tweens.add({targets:this._captureRing,rotation:TAU,alpha:{from:.36,to:.68},duration:1800,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  }
  spawnObjectiveElite(){
    const o=this.waveObjective;if(!o||o.type!=='hunt'||o.done)return;const e=this.spawnElite();if(!e)return;
    e.hp*=1.6;e.maxhp=e.hp;e._waveObjectiveTarget=true;   // เป้าหมายล่า = ถึกกว่าNormal (เดิม ×0.68 อ่อนไป)
    e.setScale((e.scaleX||1)*1.12);
    // ออร่าเรืองWaitบตัว (วงแหวนหมุน + เต้น) ให้เห็นชัดว่าตัวไหนเป็นเป้าหมาย
    e._objectiveAura=this.camWorld(this.add.image(e.x,e.y,'vfx_ring').setTint(0xff5a8a).setDepth(e.y-1).setScale(0.42).setAlpha(0.85).setBlendMode(Phaser.BlendModes.ADD));
    this.tweens.add({targets:e._objectiveAura,scale:{from:0.42,to:0.58},alpha:{from:0.9,to:0.45},rotation:TAU,duration:620,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    e._objectiveMark=this.camWorld(this.add.text(e.x,e.y-72,'🎯',{fontSize:'27px',stroke:'#2a102f',strokeThickness:5}).setOrigin(.5).setDepth(e.y+8));
    this.tweens.add({targets:e._objectiveMark,y:e.y-80,duration:520,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  }
  clearObjectiveTargetFx(e){ if(e._objectiveAura){this.tweens.killTweensOf(e._objectiveAura);if(e._objectiveAura.active)e._objectiveAura.destroy();e._objectiveAura=null;} if(e._objectiveMark){this.tweens.killTweensOf(e._objectiveMark);if(e._objectiveMark.active)e._objectiveMark.destroy();e._objectiveMark=null;} }
  onWaveObjectiveTargetDown(e){
    const o=this.waveObjective;if(!o||o.type!=='hunt'||o.done)return;o.progress++;this.renderWaveObjectiveHUD();
    if(o.progress>=o.target){this.completeWaveObjective();return;}
    this.time.delayedCall(700,()=>{if((this.state==='play'||this.state==='levelup')&&this.mode==='wave'&&this.waveObjective===o&&!o.done)this.spawnObjectiveElite();});
  }
  tickWaveObjective(dt){
    const o=this.waveObjective;if(!o||o.done)return;
    this.enemies.children.iterate(e=>{if(e&&e.active&&e._waveObjectiveTarget){if(e._objectiveMark)e._objectiveMark.setPosition(e.x,e.y-72).setDepth(e.y+8);if(e._objectiveAura)e._objectiveAura.setPosition(e.x,e.y).setDepth(e.y-1);}});
    if(o.type==='survive')o.progress=Phaser.Math.Clamp(o.target-Math.max(0,this.waveTimer),0,o.target);
    else if(o.type==='purge'&&this.waveNodes){
      if(!this.objNodeG){this.objNodeG=this.add.graphics().setScrollFactor(1).setDepth(90040);this.camWorld(this.objNodeG);}
      const ng=this.objNodeG;ng.clear();
      this.waveNodes.children.iterate(n=>{if(!n||!n.active||!n._waveObjectiveNode)return;
        // ชำระล้างด้วยการเข้าใกล้ (ดาเมจคงที่ ให้แกนที่ถึกใช้เวลานานขึ้นจริง)
        n._purifyCd-=dt;if(this.dist(this.player.x,this.player.y,n.x,n.y)<=130&&n._purifyCd<=0){n._purifyCd=.4;n.hp-=Math.max(8,12+this.stageIndex*4);this.vfxHitRing(n.x,n.y,o.color,false);if(n.hp<=0){this.destroyWaveObjectiveNode(n);return;}}
        // แกนคำสาปยิงสวน (ช้า อ่านทัน) — ไม่ใช่เป้านิ่ง
        n._shootCd-=dt;if(n._shootCd<=0){n._shootCd=Phaser.Math.FloatBetween(2.0,3.0);const a=Math.atan2(this.player.y-n.y,this.player.x-n.x);this.foeShot(n.x,n.y,a,150,8+this.stageIndex*2,o.color||0xc77bff,1.0);if(this.stageIndex>=2){this.foeShot(n.x,n.y,a+0.35,150,8+this.stageIndex*2,o.color||0xc77bff,1.0);this.foeShot(n.x,n.y,a-0.35,150,8+this.stageIndex*2,o.color||0xc77bff,1.0);}}
        // หลอดเลือดชัดเจนNorthแกน
        const hf=Phaser.Math.Clamp(n.hp/n.maxhp,0,1),bw=54,bx=n.x-bw/2,by=n.y-46;
        ng.fillStyle(0x000000,0.55);ng.fillRoundedRect(bx-2,by-2,bw+4,8,4);ng.fillStyle(0x24122c,1);ng.fillRoundedRect(bx,by,bw,4,2);
        if(hf>0){ng.fillStyle(o.color||0xc77bff,1);ng.fillRoundedRect(bx,by,Math.max(2,bw*hf),4,2);}
      });
    }
    else if(o.type==='capture'&&this._captureZone){const inside=this.dist(this.player.x,this.player.y,this._captureZone.x,this._captureZone.y)<=this._captureZone.radiusGoal;
      o.progress=Phaser.Math.Clamp(o.progress+(inside?dt:-dt*.28),0,o.target);this._captureZone.setFillStyle(o.color,inside?0.24:0.10);if(o.progress>=o.target){this.completeWaveObjective();return;}}
    if(o.type!=='purge'&&this.objNodeG)this.objNodeG.clear();   // เคลียร์หลอดแกน (แยกจาก else-if chain กันไปบLocked capture)
    this.renderWaveObjectiveHUD();
  }
  renderWaveObjectiveHUD(){
    const o=this.waveObjective;if(!o||o.done){for(const q of [this.waveObjTxt,this.waveObjBg,this.waveObjBar])if(q)q.setVisible(false);return;}
    const frac=Phaser.Math.Clamp(o.progress/Math.max(1,o.target),0,1),value=o.type==='survive'?Math.ceil(Math.max(0,this.waveTimer))+'s':o.type==='capture'?o.progress.toFixed(1)+' / '+o.target+'s':Math.floor(o.progress)+' / '+o.target;
    const bw=Math.min(230,this.W-84);this.waveObjTxt.setText(o.emoji+' '+o.name+' · '+value).setVisible(true).setColor('#'+o.color.toString(16).padStart(6,'0'));this.waveObjBg.setVisible(true);this.waveObjBar.setVisible(true).setFillStyle(o.color);this.waveObjBar.width=Math.max(2,bw*frac);
  }
  completeWaveObjective(){
    const o=this.waveObjective;if(!o||o.done)return;o.done=true;const bonus=6+(this.stageIndex+1)*2+this.waveIndex*2;this.sugarStage+=bonus;this.sugarRun+=bonus;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);
    const title='✅ Objective Complete · Sugar +'+bonus;this.clearWaveObjective();this.mode='waveclear';this.waveTimer=0;this.showBanner(title,'Clear the remaining enemies to advance',1500);Sfx.clear();
  }
  failWaveObjective(){
    const o=this.waveObjective;if(!o||o.done)return;o.done=true;this.clearWaveObjective();this.mode='waveclear';this.waveTimer=0;this.showBanner('⌛ Objective Timed Out','No bonus, but you can still advance — clear the rest',1700);
  }
  clearWaveObjective(){
    if(this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n)return;if(n._objectiveCue){this.tweens.killTweensOf(n._objectiveCue);if(n._objectiveCue.active)n._objectiveCue.destroy();n._objectiveCue=null;}n._waveObjectiveNode=false;n.setActive(false).setVisible(false);if(n.body)n.body.enable=false;});
    if(this.enemies)this.enemies.children.iterate(e=>{if(!e)return;this.clearObjectiveTargetFx(e);e._waveObjectiveTarget=false;});
    for(const k of ['_captureZone','_captureRing']){const q=this[k];if(q){this.tweens.killTweensOf(q);if(q.active)q.destroy();this[k]=null;}}
    if(this.objNodeG)this.objNodeG.clear();
    this.waveObjective=null;for(const q of [this.waveObjTxt,this.waveObjBg,this.waveObjBar])if(q)q.setVisible(false);
  }
  // ล้างมอนธรรมดาที่ค้าง (เก็บบอส/มินิไว้) — ใช้ตอนจบเวฟ/Waitดครบเวลา
  clearEnemies(){ this.enemies.children.iterate(e=>{ if(e&&e.active&&!e.isBoss&&!e.isMini){ if(e._aura){e._aura.destroy();e._aura=null;} e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } }); }
  // เรียกทุกเฟรม: คุมนับเวลา + เกิดมอนต่อเนื่อง
  tickStage(dt){
    if(this._inTutorial)return;   // freeze เวลาระหว่างสอน — ไม่สปอน ไม่นับเวลา ไม่ขึ้นWave (สนามควบคุมโดย coach)
    if(this.mode==='wave'){
      this.waveTimer-=dt;
      this.tickWaveObjective(dt);
      if(this.mode!=='wave')return;
      this.spawnAcc-=dt;
      if(this.spawnAcc<=0){const idleP=this._idleP||0,pressure=Math.min(1,this.wavePressure()+idleP),dynamicInterval=this.spawnInterval*(1-pressure*0.32);this.spawnAcc=dynamicInterval;
        const live=this.enemies.countActive(true);
        const dynamicMax=Math.min(74+Math.round(idleP*26),this.maxLive+Math.round(pressure*10)),dynamicBatch=this.spawnBatch+(pressure>=0.50?1:0)+(idleP>=0.45?1:0);
        if(live<dynamicMax){const n=Math.min(dynamicBatch,dynamicMax-live);this.spawnWaveRing(n);} }
      if(this.waveAllowsElite){ this.eliteAcc-=dt; if(this.eliteAcc<=0){ this.eliteAcc=this.eliteEvery; if(this.enemies.countActive(true)<this.maxLive) this.spawnElite(); } }
      if(this.swarmAcc!=null){ this.swarmAcc-=dt; if(this.swarmAcc<=0){ this.swarmAcc=Phaser.Math.FloatBetween(14,22); this.spawnSwarm(); } }
      const st=STAGES[this.stageIndex];
      if(st)this.timeTxt.setText('⚔ Wave '+(this.waveIndex+1)+'/'+st.waves+' · ⏳ '+Math.max(0,Math.ceil(this.waveTimer))+'s');
      if(this.waveTimer<=0){
        if(this.waveObjective){if(this.waveObjective.type==='survive')this.completeWaveObjective();else this.failWaveObjective();}
        else{this.mode='waveclear';this.showBanner('⏳ Time’s Up!','Clear all remaining enemies to advance',1800);}
      }   // หมดเวลา = หยุดสปอน + ต้องเคลียร์ให้หมดก่อน
    } else if(this.mode==='waveclear'){
      // หยุดเกิดมอนใหม่ · Waitผู้เล่นกำจัดที่เหลือให้หมดจึงไปเวฟถัดไป
      const st=STAGES[this.stageIndex], live=this.enemies.countActive(true);
      if(st)this.timeTxt.setText('⚔ Wave '+(this.waveIndex+1)+'/'+st.waves+' · 🧹 Clear remaining '+live+'');
      if(live<=0) this.onWaveCleared(false);
    } else if(this.mode==='mini'){
      // ระหว่างสู้มินิ = ยังมีลูกน้องไหลมาเรื่อย ๆ (กดดันต่อเนื่อง แต่เบากว่า)
      this.spawnAcc-=dt;
      if(this.spawnAcc<=0){ this.spawnAcc=this.spawnInterval*1.7;
        const live=this.enemies.countActive(true);
        if(live<this.maxLive*0.7){ const n=Math.max(1,Math.floor(this.spawnBatch*0.5)); for(let i=0;i<n;i++) this.spawnWaveEnemy(); } }
    }
  }
  // HP บอสไต่ตามเลเวลในรันและ Power Guide แบบอ่อน ๆ เท่านั้น ไม่สเกลตาม rank Fullจน progression ไร้ความหมาย
  bossHpMul(){const pg=this._powerGuide||this.getPowerGuide(this.stageIndex);return Math.min(3.0,(1+Math.max(0,(this.level||1)-1)*0.055)*pg.enemyHp); }
  // ยิ่งฆ่ามอนในด่านเยอะ ศัตรู/บอสยิ่งถึกขึ้น (ทวีคูณ) — ทำให้เกมยากขึ้นเรื่อย ๆ ระหว่างด่าน
  killPowerMul(){ return (1 + Math.min(1.8, (this.stageKills||0)*0.005))*(this.endlessMode?1+(this.endlessCycle||0)*0.18:1); }
  // ผ่อนความยากให้ผู้เล่นใหม่: Stage 1 + ช่วงต้นStage (ฆ่ายังน้อย) + ยังไม่จบ tutorial → มอนเลือดน้อยลง (แก้ feedback "~4 hits per enemy")
  newbieEase(){ let m=1; if(this.stageIndex===0)m*=0.60; if((this.stageKills||0)<25)m*=0.85; if(!Save.data.tutorialDone)m*=0.8; return m; }
  tutorialActive(){ return !!this._inTutorial; }
  zoneModMul(){ let hp=1,dmg=1,reward=1; if(Save.zoneModsUnlocked()){ for(const id of (this._activeZoneMods||[])){ const m=ZONE_MODIFIERS.find(x=>x.id===id); if(m){ hp*=m.hp; dmg*=m.dmg; reward*=m.reward; } } } return {hp,dmg,reward}; }
  diffMul(){ const d=DIFFS[Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1))],z=this._zoneMul||{hp:1,dmg:1,reward:1}; return {...d,hp:d.hp*z.hp,dmg:d.dmg*z.dmg,reward:d.reward*z.reward}; }   // ตัวคูณความยาก × Zone Modifiers
  zoneLevel(){ return stageZoneLevel(this.stageIndex||0,this.stageDiff||1); }   // Zone Level ของด่านที่กำลังเล่น
  // แนะนำระดับความยากจาก Power Rating เทียบค่าพลังแนะนำของด่าน
  recommendedDiff(idx){ const st=STAGES[idx]||STAGES[0], ratio=Save.power(Save.data.character)/(st.recommendedPower||100); return ratio>=1.8?3:ratio>=1.15?2:1; }
  bossRageInfo(kills){
    const n=kills==null?(this.stageKills||0):kills,tiers=[
      {min:0,name:'Normal',emoji:'😐',color:0xb8b0c4,hp:1,dmg:1,spd:1,cd:1,reward:1,gear:0.45,minTier:'common'},
      {min:60,name:'Getting Angry',emoji:'💢',color:0xffb35c,hp:1.22,dmg:1.10,spd:1.04,cd:0.93,reward:1.20,gear:0.52,minTier:'common'},
      {min:140,name:'Furious',emoji:'🔥',color:0xff7a4d,hp:1.5,dmg:1.22,spd:1.09,cd:0.86,reward:1.45,gear:0.62,minTier:'rare'},
      {min:240,name:'Enraged',emoji:'👹',color:0xff405c,hp:1.9,dmg:1.38,spd:1.14,cd:0.78,reward:1.80,gear:0.74,minTier:'rare'},
      {min:360,name:'Berserk',emoji:'👑',color:0xd95cff,hp:2.4,dmg:1.58,spd:1.20,cd:0.70,reward:2.30,gear:0.88,minTier:'epic'},
    ];let tier=0;for(let i=1;i<tiers.length;i++)if(n>=tiers[i].min)tier=i;return Object.assign({tier,kills:n},tiers[tier]);
  }
  applyBossRage(b,announce){
    if(!b||!b.active)return;const r=this.bossRageInfo(),old=b.rage||this.bossRageInfo(0);if(b.rage&&r.tier<=b.rage.tier)return;
    if(!b._rageBaseHp){b._rageBaseHp=b.maxhp;b._rageBaseDmg=b.dmg;b._rageBaseSpd=b.spd;}
    const hpPct=b.maxhp>0?b.hp/b.maxhp:1,spdRatio=r.spd/(old.spd||1);b.maxhp=b._rageBaseHp*r.hp;b.hp=Math.max(1,b.maxhp*hpPct);b.dmg=Math.round((b.dmg||b._rageBaseDmg)*(r.dmg/(old.dmg||1)));b.spd=(b.spd||b._rageBaseSpd)*spdRatio;b.rage=r;b.rageCdMul=r.cd;
    const st=STAGES[this.stageIndex];this.bossName.setText((b.isBoss?'👹 ':'💢 ')+(b.isBoss?st.boss:st.mini)+' · '+r.emoji+' '+r.name).setColor('#'+r.color.toString(16).padStart(6,'0'));
    if(announce&&r.tier>old.tier){this.showBanner(r.emoji+' Boss '+r.name,'Minions killed '+r.kills+' · reward x'+r.reward.toFixed(2),1500);this.screenFlash(r.color,0.14,300);Sfx.bossWarn();}
  }
  spawnMiniBoss(){
    if(this.state==='levelup'){this._queuedBossIntro='mini';return;}
    if(this.state!=='play')return;
    const st=STAGES[this.stageIndex];
    this.showBanner('💢 Miniboss!', st.mini, 2000); Sfx.bossWarn(); Sfx.bgmIntense(true); this.screenShake(200,0.008);
    const adds=2+this.stageIndex;
    for(let i=0;i<adds;i++) this.spawnEnemy(Math.random()<0.5?'fast':'basic');
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const mkey=this.stageIndex===4?'mb5_banquet_executioner':this.stageIndex===5?'mb6_sporewarden':'mb'+(this.stageIndex+1), mArt=this.textures.exists(mkey);
    const b=this.enemies.create(this.player.x+Math.cos(ang)*rad,this.player.y+Math.sin(ang)*rad, mArt?mkey:'e_brute');
    const mScale=this.stageIndex===4?0.78:(this.stageIndex===5?0.72:(this.stageIndex===1?0.88:(mArt?1.15:1.7))); b.baseScale=mScale; b._sqX=1; b._sqY=1;
    const mRadius=this.stageIndex===4?57:(this.stageIndex===5?54:(this.stageIndex===1?48:(mArt?52:26))),mOff=this.stageIndex===4?71:(this.stageIndex===5?74:(this.stageIndex===1?48:(mArt?18:5)));
    b.setScale(mScale).setCircle(mRadius,mOff,mOff); b.isMini=true; b.isBoss=false;
    b.hp=st.bossHp*1.0*this.bossHpMul()*this.diffMul().hp; b.maxhp=b.hp; b.spd=96;   // Miniboss HP ×1.3→×1.0 · เร่งความเร็ว 72→96 ให้เกาะติดผู้เล่น (กันบอสลากออกนอกจอ) b.dmg=Math.round(st.bossDmg*1.1*(this._powerGuide||this.getPowerGuide(this.stageIndex)).enemyDmg*this.diffMul().dmg); b.xp=15; b.frozen=0; b.knock=0; b.phase3=false;   // Miniboss: ฐานแฟร์ + ระดับความยาก
    if(mArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.shooter=false; b.bomber=false; b.acid=false; b.dasher=false; b.siege=false; b.dashState=null;
    b.atkCd=0.85; b.phase2=false;b._phaseInvuln=0;b._phaseGateLocked=false;b._phaseShieldFx=null;b._phaseImmunePopAt=0;b.rage=null;b._rageBaseHp=0;b.rageCdMul=1; b.royalGuard=this.stageIndex===0; b.atks=['slam','aimed','radial','nova']; if(this.stageIndex>=1)b.atks.push('charge'); if(this.stageIndex>=2)b.atks.push('spiral'); if(this.stageIndex>=3)b.atks.push('summon');   // Minibossมีลูกเล่นมากขึ้น + โจมตีถี่ขึ้น (buff จาก feedback)
    b._drainMotion=this.stageIndex===1; b._drainMotionKind='mini'; b._breathe=0; b._baseScale=mScale;
    if(this.anims.exists(mkey+'_walk'))b.play(mkey+'_walk',true);
    this.boss=b; this.camWorld(b);this.applyBossRage(b,false);this.bossUI.forEach(o=>o.setVisible(true));this.resetBossObjective();this._weakAcc=9;
    this.waveAlive=adds+1;
    this.mode='mini';this.updateWaveText();
    this.miniIntro(b);
  }
  // บอสเรียกลูกน้อง "Miniboss" ออกมาช่วยตอนปรากฏตัว (flag เป็น elite เพื่อไม่ให้ตายแล้วจบเวฟ)
  spawnBossEscorts(n){
    const st=STAGES[this.stageIndex]; if(!st)return;
    const mkey=this.stageIndex===4?'mb5_banquet_executioner':this.stageIndex===5?'mb6_sporewarden':'mb'+(this.stageIndex+1), mArt=this.textures.exists(mkey);
    const cx=this.boss?this.boss.x:this.player.x, cy=this.boss?this.boss.y:this.player.y;
    for(let i=0;i<n;i++){
      const ang=(i/n)*Math.PI*2+Phaser.Math.FloatBetween(-0.4,0.4), rad=190+Phaser.Math.Between(0,90);
      const ex=cx+Math.cos(ang)*rad, ey=cy+Math.sin(ang)*rad;
      let e=this.enemies.getFirstDead(false);
      if(!e) e=this.enemies.create(ex,ey,mArt?mkey:'e_brute');
      else { e.setTexture(mArt?mkey:'e_brute'); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(ex,ey); }
      if(!e)continue;
      const sc=this.stageIndex===4?0.5:(this.stageIndex===5?0.46:(this.stageIndex===1?0.62:(mArt?0.8:1.25))); e.baseScale=sc; e._sqX=1; e._sqY=1; e.setScale(sc);
      const rr=this.stageIndex===4?46:(this.stageIndex===5?42:(mArt?40:22)), off=this.stageIndex===4?74:(this.stageIndex===5?78:(mArt?16:5)); e.setCircle(rr,off,off);
      e.isBoss=false; e.isMini=false; e.isElite=true;   // elite = ตายแล้วไม่ทริกเกอร์จบเวฟ
      e.hp=st.bossHp*0.6*this.bossHpMul(); e.maxhp=e.hp; e.spd=68; e.dmg=Math.round(st.bossDmg); e.xp=12; e.frozen=0; e.knock=0; e.phase3=false;
      e.shooter=false; e.bomber=false; e.acid=false; e.dasher=false; e.siege=false; e.dashState=null; e.bloomStacks=0; e.bloomUntil=0;
      if(mArt){ e.tintColor=null; e.clearTint(); } else { e.tintColor=st.tint; e.setTint(st.tint); }
      if(this.anims.exists((mArt?mkey:'e_brute')+'_walk')) e.play((mArt?mkey:'e_brute')+'_walk',true); else if(e.anims){ e.anims.stop(); e.setFrame(0); }
      this.camWorld(e); this.vfxSpawnPoof(ex,ey);
    }
    this.screenShake(180,0.006);
  }
  spawnFinalBoss(){
    if(this.state==='levelup'){this._queuedBossIntro='final';return;}
    if(this.state!=='play')return;
    if(this.stageIndex===4&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('story_final_hunger','FINAL ENCOUNTER','THE GREAT HUNGER','The crown shadow swallows all light — six eyes stare down, and the bottomless hunger awakens',()=>this.spawnFinalBoss());return;}
    if(this.stageIndex===5&&!this._finalStoryShown){this._finalStoryShown=true;this.playStoryPanel('chapter2_cover','CHAPTER 2 · ROOT THRONE','THE ROOTMOTHER','The first root splits the canopy into a throne — she calls The Great Hunger her child, and the crown seed in your chest beats again',()=>this.spawnFinalBoss());return;}
    const st=STAGES[this.stageIndex]; this.mode='boss';this.secretBoss=!!(this.endlessMode&&((this.endlessCycle+1)%3===0));
    const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*0.55;
    const bx=this.player.x+Math.cos(ang)*rad, by=this.player.y+Math.sin(ang)*rad;
    const bkey=this.stageIndex===4?'boss5_sovereign':this.stageIndex===5?'boss6_rootmother':'boss'+(this.stageIndex+1);
    let b=this.enemies.create(bx,by,this.textures.exists(bkey)?bkey:'e_brute');
    if(!b){ b=this.enemies.getFirstAlive(); if(!b){ this.clearEnemies(); b=this.enemies.create(bx,by,this.textures.exists(bkey)?bkey:'e_brute'); } if(b){ b.setTexture(this.textures.exists(bkey)?bkey:'e_brute'); b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(bx,by); } }   // pool Full → รีไซเคิล/Cleared กันบอสเป็น null
    const isArt=this.textures.exists(bkey);
    const fScale=this.stageIndex===4?1.08:(this.stageIndex===5?0.96:([1,2,3].includes(this.stageIndex)?1.18:(isArt?1.55:2.5))); b.baseScale=fScale; b._sqX=1; b._sqY=1;   // บอสStage 2-4 ตัวใหญ่ขึ้น (0.88→1.18)
    const fRadius=this.stageIndex===4?61:(this.stageIndex===5?60:([1,2,3].includes(this.stageIndex)?58:(isArt?54:26))),fOff=this.stageIndex===4?67:(this.stageIndex===5?68:([1,2,3].includes(this.stageIndex)?70:(isArt?16:5)));
    b.setScale(fScale).setCircle(fRadius,fOff,fOff); b.isBoss=true; b.isMini=false;
    const _dIdx=Math.max(0,Math.min(DIFFS.length-1,(this.stageDiff||1)-1));   // 0=Normal 1=ยาก 2=นรก
    // Normal (ง่าย) = เลือด Fix ตายตัว Noneตัวคูณ (ไม่สเกลตามเลเวล/ความยาก) · ยาก = เริ่มคูณ · นรก = คูณโหดมาก
    const _bossScale=_dIdx===0?1.0:(_dIdx===1?this.bossHpMul()*this.diffMul().hp:this.bossHpMul()*this.diffMul().hp*1.6);
    b.hp=st.bossHp*(2.0+this.stageIndex*0.13)*1.75*_bossScale*(this.secretBoss?1.65:1); b.maxhp=b.hp;   // บอสใหญ่ HP: easy fix · hard/hell คูณ
    b.spd=this.secretBoss?108:94;   // เดิม 46 ช้าเกิน → บอสตามผู้เล่นไม่ทัน ลากออกนอกจอ = "Boss vanished" · เร่งให้เกาะติด
    b.dmg=Math.round(st.bossDmg*1.3*(this._powerGuide||this.getPowerGuide(this.stageIndex)).enemyDmg*this.diffMul().dmg*(this.secretBoss?1.28:1)); b.xp=30; b.frozen=0; b.knock=0; b.phase3=false; b.phase4=false;b._secretBoss=this.secretBoss;   // บอสใหญ่ + บอสลับ Endless
    if(isArt){ b.tintColor=null; b.clearTint(); } else { b.tintColor=st.tint; b.setTint(st.tint); }
    b.shooter=false; b.bomber=false; b.acid=false; b.dasher=false; b.siege=false; b.dashState=null;
    b.atkCd=0.8; b.phase2=false;b._phaseInvuln=0;b._phaseGateLocked=false;b._phaseShieldFx=null;b._phaseImmunePopAt=0;b.rage=null;b._rageBaseHp=0;b.rageCdMul=1; b.atks=this.stageIndex===0?['queen']:['slam','radial','aimed','charge','spiral','trap']; if(this.stageIndex>=1)b.atks.push('summon');
    b._drainMotion=this.stageIndex===1; b._drainMotionKind='boss'; b._breathe=0; b._baseScale=fScale;
    if(this.anims.exists(bkey+'_walk')){ b.play(bkey+'_walk',true); }else if(bkey==='boss6_rootmother'&&this.anims.exists('boss6_rootmother_idle'))b.play('boss6_rootmother_idle',true); else if(b.anims){ b.anims.stop(); b.setFrame(0); }
    this.boss=b; this.camWorld(b);this.applyBossRage(b,false);this.bossUI.forEach(o=>o.setVisible(true));this.resetBossObjective();this._weakAcc=11;
    this.waveAlive=1; this.updateWaveText();
    this.bossIntro(b, this.secretBoss?'The Echo of Hunger · Shadow of the Devourer':st.boss);
  }
  // ฉากปรากฏตัวบอส: WARNING → แพนfind → ปรากฏตัว/คำราม → แพนกลับ
  bossIntro(b,name){
    const cam=this.cameras.main,px=this.player.x,py=this.player.y,base=b.baseScale||1.55,targetY=b.y;
    this.state='cinematic';this.mode='bossIntro';this.player.setVelocity(0,0);b.setVelocity(0,0);b.setVisible(false).setScale(base*0.82).setDepth(targetY+1);if(b.body)b.body.enable=false;
    Sfx.playBossBgm(this.stageIndex+1);Sfx.bossWarn();
    const band=this.add.rectangle(this.W/2,this.H/2,this.W,128,0x17090d,0.92).setScrollFactor(1).setDepth(120);
    const warn=this.add.text(this.W/2,this.H/2-18,'⚠  W A R N I N G  ⚠',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'34px',color:'#ff355e',stroke:'#41000e',strokeThickness:7}).setOrigin(0.5).setScrollFactor(1).setDepth(121);
    const sub=this.add.text(this.W/2,this.H/2+27,name,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff1a8'}).setOrigin(0.5).setScrollFactor(1).setDepth(121);
    [band,warn,sub].forEach(o=>this.camUI(o));this.tweens.add({targets:[band,warn,sub],alpha:{from:0,to:1},duration:200,yoyo:true,hold:1050,onComplete:()=>{band.destroy();warn.destroy();sub.destroy();}});
    cam.stopFollow();this.time.delayedCall(850,()=>cam.pan(b.x,targetY,850,'Sine.easeInOut'));
    if(this.stageIndex===1){
      this.time.delayedCall(1600,()=>{if(!b.active)return;const drain=this.camWorld(this.add.image(b.x,targetY+58,'drain_grate').setDepth(targetY-3).setScale(0.9).setAlpha(0));this.decoProps.add(drain);
        this.tweens.add({targets:drain,alpha:1,rotation:0.25,duration:420});b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+58).setScale(base*0.25);if(this.anims.exists('boss2_reveal'))b.play('boss2_reveal');
        for(let i=0;i<10;i++){const bubble=this.camWorld(this.add.image(b.x+Phaser.Math.Between(-55,55),targetY+60,'bubble').setDepth(targetY+3).setScale(Phaser.Math.FloatBetween(0.5,1.2)).setAlpha(0.8));this.tweens.add({targets:bubble,y:targetY-Phaser.Math.Between(35,130),x:bubble.x+Phaser.Math.Between(-30,30),alpha:0,duration:620+i*35,delay:i*45,onComplete:()=>bubble.destroy()});}
        this.tweens.add({targets:b,y:targetY,scale:base,alpha:1,duration:920,ease:'Back.out',onComplete:()=>{this.drainBossPose(b,3,900);this.screenShake(420,0.012);this.screenFlash(0x7fe8d2,0.25,420);}});});
      this.time.delayedCall(3100,()=>cam.pan(px,py,760,'Sine.easeInOut'));
      this.time.delayedCall(3900,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss2_walk'))b.play('boss2_walk',true);this.state='play';this.mode='boss';b.atkCd=1.7;this.spawnBossEscorts(2);this.showBanner('🫧 Valve Burst','Trapping bubbles slow you — escape the pull and find gaps between waves!',2300);});
      return;
    }
    if(this.stageIndex===4){
      this.time.delayedCall(1180,()=>{if(!b.active)return;
        const eclipse=this.camWorld(this.add.circle(b.x,targetY,176,0x020006,0.94).setDepth(targetY-4).setStrokeStyle(13,0xd95cff,0.72));
        const corona=this.camWorld(this.add.image(b.x,targetY,'hunger_seal').setDepth(targetY-5).setScale(0.2).setAlpha(0.9).setTint(0xff3f78));
        this.tweens.add({targets:eclipse,scale:{from:0.08,to:1.35},alpha:{from:0,to:0.94},duration:1250,ease:'Cubic.out'});
        this.tweens.add({targets:corona,scale:3.1,rotation:Math.PI*2,alpha:{from:0.95,to:0.24},duration:1900});
        this.screenFlash(0x050008,0.90,1050);b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+92).setScale(base*0.05);
        for(let i=0;i<7;i++){const seal=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(targetY-2+i%2).setTint(i%2?0xff3f78:0xffd166).setScale(0.14+i*0.07).setAlpha(0.82).setRotation(i*Math.PI/7));this.tweens.add({targets:seal,rotation:(i%2?1:-1)*Math.PI*2.4,scale:1.45+i*0.13,alpha:0,duration:1350+i*95,onComplete:()=>seal.destroy()});}
        for(let i=0;i<12;i++){const ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(targetY-1).setRotation(i*TAU/12).setTint(i%2?0xd95cff:0xff3f78).setScale(0.15,0.42).setAlpha(0.76));this.tweens.add({targets:ray,scaleX:1.65,alpha:0,duration:900+i*45,delay:300,onComplete:()=>ray.destroy()});}
        this.tweens.add({targets:b,alpha:1,y:targetY,scale:base,duration:1700,ease:'Back.out',onComplete:()=>{if(!b.active)return;this.screenShake(980,0.030);this.screenFlash(0xff3f78,0.52,760);Sfx.bossWarn();eclipse.destroy();corona.destroy();}});
      });
      this.time.delayedCall(3300,()=>{if(!b.active)return;this.showBanner('🌑 THE GREAT HUNGER','The primordial Hunger has awakened — there is nothing left to bargain with!',2600);});
      this.time.delayedCall(4500,()=>cam.pan(px,py,900,'Sine.easeInOut'));
      this.time.delayedCall(5550,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);this.state='play';this.mode='boss';b.atkCd=1.35;
        if(this.anims.exists('boss5_sovereign_idle'))b.play('boss5_sovereign_idle',true);
        b._aura=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y-2).setAlpha(0.58).setTint(0xff3f78));b._auraIsFx=true;
        b._hungerHalo=[this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y-3).setScale(2.05).setAlpha(0.42).setTint(0xd95cff)),this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y-4).setScale(2.62).setAlpha(0.26).setTint(0xffd166))];
        b._hungerOrbs=[];for(let i=0;i<8;i++)b._hungerOrbs.push(this.camWorld(this.add.image(b.x,b.y,'vfx_glow').setTint(i%3===0?0xffd166:i%2?0xff3f78:0xd95cff).setDepth(b.y+2).setScale(0.38).setAlpha(0.88)));
        this.spawnBossEscorts(3);
      });return;
    }
    if(this.stageIndex!==0){
      this.time.delayedCall(1650,()=>{if(!b.active)return;b.setVisible(true).setAlpha(0).setScale(base*0.25);if(this.stageIndex===2||this.stageIndex===3)this.stageBossPose(b,1,1250);if(this.stageIndex===5)this.chapter2Pose(b,1,1350);const glow=this.camWorld(this.add.image(b.x,b.y,'vfx_glow').setTint(STAGES[this.stageIndex].tint).setScale(0.2).setDepth(b.y-1));this.tweens.add({targets:[b,glow],alpha:1,scale:base,duration:850,ease:'Back.out',onComplete:()=>glow.destroy()});});
      this.time.delayedCall(3000,()=>cam.pan(px,py,760,'Sine.easeInOut'));this.time.delayedCall(3800,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setScale(base);const idle=b.texture.key+'_idle';if(this.anims.exists(idle))b.play(idle,true);this.state='play';this.mode='boss';b.atkCd=1.6;this.spawnBossEscorts(2);this.showBanner(this.stageIndex===2?'🔥 Machines at Full Power':this.stageIndex===5?'🌿 The First Root Fully Awakens':'❄️ The Frost Prison Activates',this.stageIndex===2?'Read the conveyor lines and clear the furnace cross!':this.stageIndex===5?'Read the green root lines and the gaps between poison petals!':'Find gaps in the ice cage and don’t back into the blast line!',2100);});return;
    }
    // Stage 1 (ราชินีมด): ฉากปรากฏตัวยาว+อลังการ — เรืองแสง → ลอยขึ้นช้า ๆ → คำราม 2 จังหวะ
    this.time.delayedCall(1950,()=>{if(!b.active)return;
      b.setVisible(true).setAlpha(0).setPosition(b.x,targetY+46).setScale(base*0.2);this.bossPose(b,1,1000);
      const glow=this.camWorld(this.add.image(b.x,targetY,'vfx_glow').setTint(STAGES[0].tint||0x9dff45).setScale(0.15).setDepth(targetY-1));
      this.tweens.add({targets:glow,scale:1.35,alpha:{from:0.95,to:0.45},duration:1350,yoyo:true});
      this.tweens.add({targets:b,alpha:1,y:targetY,scale:base,duration:1350,ease:'Back.out',onComplete:()=>{if(!b.active)return;glow.destroy();
        this.bossPose(b,6,1500);this.screenShake(560,0.016);this.screenFlash(0x9dff45,0.30,470);   // คำรามครั้งที่ 1
        for(let i=0;i<3;i++){const r=this.camWorld(this.add.circle(b.x,b.y,25,0,0).setDepth(6).setStrokeStyle(6,0x9dff45,0.9));this.tweens.add({targets:r,radius:210+i*60,alpha:0,duration:720+i*110,delay:i*100,onComplete:()=>r.destroy()});}}});
    });
    this.time.delayedCall(4100,()=>{if(!b.active)return;this.bossPose(b,6,1000);this.screenShake(380,0.013);this.screenFlash(0xff6a8f,0.16,400);   // คำรามครั้งที่ 2 (ย้ำ)
      for(let i=0;i<2;i++){const r=this.camWorld(this.add.circle(b.x,b.y,20,0,0).setDepth(6).setStrokeStyle(5,0xff9ec4,0.8));this.tweens.add({targets:r,radius:160+i*55,alpha:0,duration:620+i*100,delay:i*90,onComplete:()=>r.destroy()});}});
    this.time.delayedCall(5600,()=>cam.pan(px,py,950,'Sine.easeInOut'));
    this.time.delayedCall(6650,()=>{if(!b.active)return;cam.startFollow(this.player,false,0.2,0.2);if(b.body)b.body.enable=true;b.setVisible(true).setAlpha(1).setScale(base);if(this.anims.exists('boss1_idle'))b.play('boss1_idle',true);this.state='play';this.mode='boss';b.atkCd=1.55;this.spawnBossEscorts(2);this.showBanner('👑 The Queen Awakens','Destroy the nests and crystals to cut her power! (2 guardians)',2400);});
  }
  // จอวาบFullหน้าจอ (บนกล้อง UI) — ใช้ตอนบอสปรากฏ/เข้าเฟส/ตาย
  screenFlash(color,alpha,dur){
    if(Save.data.settings&&Save.data.settings.flash===false)return;
    const f=this.add.rectangle(this.W/2,this.H/2,this.W,this.H,color,alpha).setScrollFactor(1).setDepth(80);
    this.camUI(f); this.tweens.add({targets:f,alpha:0,duration:dur,onComplete:()=>f.destroy()});
  }
  // ลด motion sickness บนมือถือ: ทุกจุดสั่นผ่านตัวคูณกลางเดียวกัน
  screenShake(duration,intensity){
    const level=Save.data.settings?Number(Save.data.settings.shake):1;if(level<=0)return;const mul=level===2?0.72:0.45;
    this.cameras.main.shake(Math.max(35,Math.round(duration*(level===2?0.82:0.65))),Math.max(0.0004,intensity*mul));
  }
  // ฉากบอสตาย: สโลว์โมชัน + จอวาบ + ระเบิดเป็นชุด + คลื่นกระแทก
  bossDefeat(x,y){
    const grand=this.stageIndex===4;if(grand)this.showBanner('✨ The Hunger Crumbles','All flavor is returning to the world!',2200);
    Sfx.clear(); this.hitStop(grand?140:90); this.screenFlash(0xffffff,grand?0.92:0.7,grand?680:420); this.screenShake(grand?900:600,grand?0.024:0.016);
    for(let i=0;i<(grand?11:5);i++) this.time.delayedCall(60+i*(grand?70:80),()=>{
      this.burst(x+Phaser.Math.Between(grand?-95:-50,grand?95:50),y+Phaser.Math.Between(grand?-95:-50,grand?95:50),[0xffd166,0xff5f97,0xd95cff,0xbfe8ff][i%4]); });
    for(let i=0;i<(grand?6:3);i++){ const ring=this.camWorld(this.add.circle(x,y,20,0xffe08a,0).setDepth(7).setStrokeStyle(5,0xffd166,0.9));
      this.tweens.add({targets:ring,radius:220+i*70,alpha:{from:0.9,to:0},duration:700+i*150,delay:i*110,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
  }
  clearFoes(){ this.foeBullets.children.iterate(b=>{ if(b&&b.active)this.killFoe(b); }); }
  clearPickups(alsoHeals){ if(this.crates)this.crates.children.iterate(c=>{ if(c&&c.active){ this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false; } });
    if(alsoHeals){ for(const grp of [this.heals,this.vacs,this.loots,this.chests,this.gimmicks]){ if(grp)grp.children.iterate(o=>{ if(o&&o.active){ this.tweens.killTweensOf(o); if(o._glow){this.tweens.killTweensOf(o._glow);o._glow.destroy();o._glow=null;} this.hidePickupCue(o); o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; } }); } } }
  // ตั้งเวลาเหตุการณ์ประจำStage (เริ่มเวฟ/บอส/รางวัล) แบบทนต่อ modal: ถ้าตอนถึงเวลายังติดหน้าเลเวลอัพ/กล่องสุ่ม/pause
  // จะ "Wait" แล้วยิงเมื่อกลับมาเล่นจริง (state==='play') — กันบั๊กเวฟไม่มา/เกมค้างหลังMiniboss
  scheduleStageEvent(delayMs,mode,fn){
    this.time.delayedCall(delayMs,()=>{
      if(this.state==='menu'||this.state==='dead')return;   // ออกจากด่าน/ตาย = ยกเลิก
      if(this.mode!==mode)return;                            // โหมดเปลี่ยน (ถูก override) = ยกเลิก
      if(this.state!=='play'){ this.scheduleStageEvent(350,mode,fn); return; }   // ยังติด modal (levelup/rolling/paused) → Waitแล้วลองใหม่
      fn();
    });
  }
  onWaveCleared(keep){
    this.boss=null;Sfx.bgmIntense(false);this.bossUI.forEach(o=>o.setVisible(false));this.clearWaveObjective();this.clearFoes();this.clearEnemies();
    const st=STAGES[this.stageIndex],next=this.waveIndex+1;this.mode='breather';this.clearPickups(false);this.updateWaveText();this.poseFlash(CF.cheer,600);
    if(next>=st.waves){this.mode='bossWarning';this.updateWaveText();
      this.scheduleStageEvent(300,'bossWarning',()=>{const rage=this.bossRageInfo();this.showBanner('⚠️ '+rage.emoji+' Boss '+rage.name,st.boss+' · Minions '+rage.kills+' · reward x'+rage.reward.toFixed(2),2600);Sfx.bossWarn();this.screenFlash(rage.color,0.20,650);
        this.scheduleStageEvent(3000,'bossWarning',()=>this.spawnFinalBoss());});return;}
    this.scheduleStageEvent(300,'breather',()=>{this.showBanner('Breather: 3 seconds','Wave '+(next+1)+' incoming',2400);
      this.scheduleStageEvent(3200,'breather',()=>this.startWave(next,false));});
  }
  // บอสตาย → เปิดกล่องรางวัลจบStage (Sugar/อุปกรณ์) แล้วกลับหน้าเลือกด่าน
  onBossDown(x,y){
    this._rewardRage=this.bossRageInfo();this.boss=null;this.mode='reward';this.bossUI.forEach(o=>o.setVisible(false));Sfx.playStageBgm(this.stageIndex+1);this.clearFoes();this.clearEnemies();this.clearBossObjects();
    // 🧪 ล้มบอส = การันตี currency ก้อนใหญ่ (ยิ่งด่าน/ยากสูง ยิ่งเยอะ+ดี — กฎเหล็ก)
    this.grantCurrencyReward(2+(this.stageIndex||0)+((this.stageDiff||1)-1)*2,this.currencyTierFor(),'🏆 Boss Down! Currency gained');
    if(this.endlessMode){const cleared=(this.endlessCycle||0)+1,bonus=80+cleared*35+(this.secretBoss?180:0);this.sugarStage+=bonus;Save.addSugar(this.sugarStage);this.sugarStage=0;Save.data.endlessBest=Math.max(Save.data.endlessBest||0,cleared);Save.save();this.endlessCycle=cleared;this.secretBoss=false;this.waveIndex=0;this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.45);this.mode='breather';
      this.showBanner('🌙 ENDLESS round '+cleared+' complete','Checkpoint saved · Sugar +'+bonus+(cleared%3===0?' · secret boss defeated!':''),2600);this.time.delayedCall(3200,()=>{if(this._busy()&&this.mode==='breather')this.startWave(0,false);});return;}
    const next=this.stageIndex+1,canUnlock=next<STAGES.length&&(Save.data.unlockedStage||0)<next;
    if(canUnlock){Save.data.unlockedStage=next;Save.save();}
    if(!Save.data.diffBest)Save.data.diffBest=[];if((this.stageDiff||1)>(Save.data.diffBest[this.stageIndex]||0)){Save.data.diffBest[this.stageIndex]=this.stageDiff||1;Save.save();}   // จำความยากสูงสุดที่ผ่าน
    this.screenFlash(0xffd166,0.42,420);this.burst(x,y,0xffd166);Sfx.chest();
    this.time.delayedCall(500,()=>this.showStageChestChoice(canUnlock?('Unlocked Stage '+(next+1)):'Choose your reward fate'));
  }
  showStageChestChoice(note){
    this.state='rewardChoice';this.physics.pause();this.player.setVelocity(0,0);this.lvlUp.setVisible(false);this.over.removeAll(true);this._rewardBtns=[];
    const w=this.W,h=this.H,portrait=w<=h,bg=this.add.rectangle(0,0,w,h,0x090611,0.94).setOrigin(0),title=this.add.text(w/2,h*0.13,'Pick one reward box',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffe08a'}).setOrigin(0.5),sub=this.add.text(w/2,h*0.19,note,{fontFamily:'sans-serif',fontSize:'11px',color:'#cfc3dc'}).setOrigin(0.5);this.over.add([bg,title,sub]);
    const choices=[['sugar','🍬','Sugar Box','Guaranteed currency · large amount',0xffa952],['gear','🛡️','Gear Box','High gear chance',0x6ed7df],['fortune','✨','Fortune Box','Gamble for Gear or a Sugar jackpot',0xd58cff]],gap=portrait?10:14,cols=portrait?1:3,cw=portrait?Math.min(w-40,360):Math.min(220,(w-48-gap*2)/3),ch=portrait?Math.min(118,(h*0.67-gap*2)/3):Math.min(230,h*0.55),total=cw*cols+gap*(cols-1),x0=(w-total)/2,y0=portrait?h*0.25:h*0.29;
    choices.forEach((c,i)=>{const x=portrait?x0:x0+i*(cw+gap),y=portrait?y0+i*(ch+gap):y0,g=this.add.graphics();g.fillStyle(0x251a32,0.98);g.fillRoundedRect(x,y,cw,ch,18);g.lineStyle(3,c[5],0.95);g.strokeRoundedRect(x,y,cw,ch,18);g.fillStyle(c[5],0.14);g.fillRoundedRect(x+5,y+5,cw-10,ch-10,14);const em=this.add.text(x+cw/2,y+ch*(portrait?0.35:0.34),c[1],{fontSize:portrait?'42px':'58px'}).setOrigin(0.5),nm=this.add.text(x+cw/2,y+ch*(portrait?0.62:0.64),c[2],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0.5),ds=this.add.text(x+cw/2,y+ch*(portrait?0.82:0.82),c[3],{fontFamily:'sans-serif',fontSize:'9px',color:'#d9cfe1',align:'center',wordWrap:{width:cw-20}}).setOrigin(0.5);this.over.add([g,em,nm,ds]);this._rewardBtns.push({x,y,w:cw,h:ch,fn:()=>this.chooseStageChest(c[0])});});this.over.setVisible(true);
  }
  chooseStageChest(kind){
    if(this.state!=='rewardChoice')return;this._rewardBtns=[];this._stageReward=this.rollStageReward(kind);Sfx.clear();this.over.removeAll(true);const w=this.W,h=this.H,bg=this.add.rectangle(0,0,w,h,0x090611,0.96).setOrigin(0),glow=this.add.image(w/2,h*0.43,'vfx_glow').setTint(0xffd166).setScale(1.4).setAlpha(0.45),em=this.add.text(w/2,h*0.40,this._stageReward.emoji,{fontSize:'86px'}).setOrigin(0.5),t=this.add.text(w/2,h*0.57,'Box opened!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'23px',color:'#ffe08a'}).setOrigin(0.5),d=this.add.text(w/2,h*0.64,this._stageReward.label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff',align:'center',wordWrap:{width:w-40}}).setOrigin(0.5);this.over.add([bg,glow,em,t,d]);this.screenFlash(0xffd166,0.35,350);this.time.delayedCall(1250,()=>{if(this.state==='rewardChoice'){this.over.setVisible(false);this.onStageClear();}});
  }
  rollStageReward(kind='fortune'){
    const stage=this.stageIndex+1,rage=this._rewardRage||this.bossRageInfo(),dr=this.diffMul().reward;   // กฎเหล็ก: ยิ่งยาก better rewards
    const diffHi=(this.stageDiff||1)>=4;   // ความยากสูง = ลุ้นของแรร์/เอปิกมากขึ้น
    const gearChance=kind==='sugar'?0:(kind==='gear'?Math.min(0.98,(0.72+stage*0.035)*Math.min(1.35,dr)):Math.min(0.95,rage.gear*dr));
    if(Math.random()<gearChance){
      let tier=rage.minTier;if(tier==='common')tier=(stage>=4||diffHi)&&Math.random()<0.24*dr?'epic':(stage>=2||this.stageDiff>=3)&&Math.random()<0.38*dr?'rare':'common';else if(tier==='rare'&&Math.random()<(rage.tier>=3||diffHi?0.40:0.22)*Math.min(1.8,dr))tier='epic';
      const gear=this.grantGear(tier);
      if(gear){const slot=GEAR_SLOTS.find(s=>s.slot===gear.slot);return{type:'gear',emoji:slot?slot.emoji:'🎁',label:rage.emoji+' '+rage.name+' · '+(slot?slot.emoji+' ':'')+gear.name+gearDeliverySuffix(gear),rage};}
    }
    const guide=this._powerGuide||this.getPowerGuide(this.stageIndex),jackpot=kind==='fortune'&&Math.random()<0.18?1.8:1,sugar=Math.round((30+stage*15+Phaser.Math.Between(0,15))*rage.reward*guide.reward*dr*(kind==='sugar'?1.35:1)*jackpot*(this.rankSugarMul||1));
    this.sugarStage+=sugar;this.sugarRun+=sugar;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);
    return{type:'sugar',emoji:jackpot>1?'💰':'🍬',label:rage.emoji+' '+rage.name+' · Sugar +'+sugar+(jackpot>1?' · JACKPOT!':''),amount:sugar,rage};
  }
  clearExitPortal(){if(!this.portals)return;this.portals.children.iterate(p=>{if(p&&p.active){this.tweens.killTweensOf(p);p.setActive(false).setVisible(false);if(p.body)p.body.enable=false;}});this.portalTarget=null;}
  spawnExitPortal(x,y){
    let p=this.portals.getFirstDead(false);if(!p)p=this.portals.create(x,y,'fx_bossportal',0);else{p.setTexture('fx_bossportal',0);p.setActive(true).setVisible(true);if(p.body)p.body.enable=true;p.setPosition(x,y);}
    if(!p)return;p.used=false;p.setCircle(38,25,25).setScale(1.25).setDepth(y+2);this.camWorld(p);if(this.anims.exists('portal_idle'))p.play('portal_idle',true);
    this.tweens.add({targets:p,scale:{from:1.08,to:1.34},y:y-10,yoyo:true,repeat:-1,duration:760,ease:'Sine.inOut'});this.portalTarget=p;
    this.objectiveArrow.setVisible(true);this.objectiveDist.setVisible(false);
  }
  enterPortal(player,p){
    if(!p.active||p.used||this.mode!=='portal')return;p.used=true;this.mode='transition';this.tweens.killTweensOf(p);p.setActive(false).setVisible(false);if(p.body)p.body.enable=false;this.portalTarget=null;
    const last=this.stageIndex>=STAGES.length-1;Save.addSugar(this.sugarStage);this.gainCharExp(40+this.stageIndex*25);
    if(!last&&(Save.data.unlockedStage||0)<this.stageIndex+1){Save.data.unlockedStage=this.stageIndex+1;Save.save();}
    this.screenFlash(0xb98cff,0.75,520);Sfx.clear();
    if(last){this.time.delayedCall(500,()=>this.victory());return;}
    const next=this.stageIndex+1;this.player.setVelocity(0,0);this.state='loading';
    if(window.GameLoader)window.GameLoader.show('Opening the door to the next stage...',0.18);
    this.time.delayedCall(520,()=>this.ensureStageAudio(next,()=>{this.resetStageLoadout();this.state='play';this.startStage(next);
      if(window.GameLoader){window.GameLoader.set(1,'Entering a new stage!');this.time.delayedCall(160,()=>window.GameLoader.hide());}}));
  }
  resetStageLoadout(){
    if(this._triSeals)this._triSeals.forEach(p=>{if(p.obj&&p.obj.active)p.obj.destroy();});this._triSeals=[];this._echoTrail=[];
    this.clearFoes();this.clearEnemies();this.clearPickups(true);this.clearBossObjects();this.clearStarGuardFx();this.clearCharSignature();
    this.bullets.children.iterate(b=>{if(b&&b.active)this.killBullet(b);});this.clearAuraFx();
    this.skills={};this.basicAttack=null;this.passives={};this.comboFlags={};this.combosOwned={};this.dishCount=0;this.uniqueCd=0;this.uniqueLevel=1;this.wardGuardT=0;this.pathHasteT=0;this.stageKills=0;
    this.rerollLeft=REROLL_MAX+Save.perkLvl("reroll");this.banishLeft=BANISH_MAX+Save.perkLvl("banish");this.banishedKeys={};this._boxAcc=null;this._reviveLeft=Save.perkLvl("revive")+Save.gearReviveCount();
    this.skillCd={};for(const k in SKILLDEFS)this.skillCd[k]=0;this.level=1;this.xp=0;this.xpNext=10;this.pendingLvl=0;this._queuedBossIntro=null;this.sugarStage=0;
    this.player.maxhp=90;this.player.baseSpeed=BALANCE.moveSpeed;this.player.pickup=105;this.player.dmgMul=0.90;this.applyMeta();this.equipSignatureWeapon();this.player.hp=this.player.maxhp;
    this.player.setPosition(0,0).setVelocity(0,0);this.buildSkillBar();this.lvlTxt.setText('Lv 1');
  }
  onStageClear(){
    this.boss=null; this.mode='clear'; this.bossUI.forEach(o=>o.setVisible(false));
    this.enemies.children.iterate(e=>{ if(e&&e.active){ e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; } });
    this.clearFoes(); this.clearPickups(true); this.waveAlive=0; this.pipG.clear();
    this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.35); // heal reward
    Sfx.clear();
    const last=this.stageIndex>=STAGES.length-1,guide=this._powerGuide||this.getPowerGuide(this.stageIndex);this._powerBefore=Save.power(this.character);
    this._firstMastery=!Save.data.stageMastery[this.stageIndex];if(this._firstMastery){Save.data.stageMastery[this.stageIndex]=true;this.sugarStage+=40+this.stageIndex*25;Save.save();}
    this._dailyBonus=0;if(this._dailyRun){const o=this.ensureDaily();if(!o.data.challengeDone&&o.data.challengeDay===o.spec.key){o.data.challengeDone=true;this._dailyBonus=120+o.spec.diff*30;this.sugarStage+=this._dailyBonus;Save.save();}this._dailyRun=false;}
    Save.addSugar(this.sugarStage);                                   // ฝาก Sugar + โบนัส Mastery/Daily
    this.gainCharExp(Math.round((75 + this.stageIndex*35)*guide.reward)); // catch-up EXP มากขึ้นเมื่อผ่านด่านด้วยพลังต่ำกว่าคำแนะนำ
    this._powerAfter=Save.power(this.character);
    if(!last && (Save.data.unlockedStage||0) < this.stageIndex+1){ Save.data.unlockedStage=this.stageIndex+1; Save.save(); }
    // Mochi Bazaar restock: ผ่านด่านใดก็ได้ = สุ่มร้านใหม่ · stock อ้างอิง Zone Level ของด่านที่เพิ่งผ่าน
    Save.data.bazaarSeed=(Save.data.bazaarSeed||0)+1; Save.data.bazaarZone=this.zoneLevel(); Save.data.bazaarBought=[]; Save.save();
    this._summaryDoubled=false;   // รีเซ็ตสิทธิ์ดูโฆษณา x2 ต่อการเคลียร์ด่าน
    this.showStageSummary(last);
  }
  /* หน้าสรุปStage — แตะเพื่อไปต่อ */
  showStageSummary(last){
    this.state='summary'; this.physics.pause(); this.player.setVelocity(0,0);
    this._summaryLast=last;
    const w=this.W,h=this.H, st=STAGES[this.stageIndex]; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x1a1420,0.9).setOrigin(0,0);
    const reward=this._stageReward||{emoji:'🍬',label:'Stage Rewards'};
    const em=this.add.text(w/2,h*0.2,'🎁 '+reward.emoji,{fontSize:'54px'}).setOrigin(0.5);
    const t=this.add.text(w/2,h*0.31,'Cleared '+st.emoji+' '+st.name+'!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'24px',color:'#ffd166',align:'center',wordWrap:{width:w*0.85}}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const cp=Save.cp(this.character), ch=CHARACTERS[this.character];
    const rows=[
      ['⏱ Total Time', mm+':'+ss.toString().padStart(2,'0')],
      ['☠ Minions Killed', String(this.stageKills||0)],
      ['💢 Boss Rage', (reward.rage||this._rewardRage||this.bossRageInfo()).emoji+' '+(reward.rage||this._rewardRage||this.bossRageInfo()).name+' · x'+(reward.rage||this._rewardRage||this.bossRageInfo()).reward.toFixed(2)],
      ['🍬 Sugar This Stage', '+'+this.sugarStage],
      ['🎁 Box Reward', reward.label],
      ['⚡ Power', (this._powerBefore||Save.power(this.character))+' → '+(this._powerAfter||Save.power(this.character))+(this._firstMastery?' · Mastery!':'')],
      [ch.emoji+' Character EXP', '+'+(this._lastExpGain||0)],
      ['⚔️ Build', Object.keys(this.skills||{}).length+' weapons · '+Object.keys(this.passives||{}).length+' passives'+(this._dailyBonus?' · Daily +🍬'+this._dailyBonus:'')],
      ['🌟 Character Level', 'Lv '+cp.lvl+(this._lastLvlUps>0?'  (Level up! +'+this._lastLvlUps+' pts)':'')],
    ];
    const box=[bg,em,t]; let y=h*0.39,step=Math.min(28,(h*0.70-y)/rows.length),rowFont=Math.max(9,Math.min(15,step-2));
    rows.forEach(r=>{ const l=this.add.text(w/2-120,y,r[0],{fontFamily:'sans-serif',fontSize:rowFont+'px',color:'#c7bdd6'}).setOrigin(0,0.5);
      const v=this.add.text(w/2+120,y,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:rowFont+'px',color:'#ffffff'}).setOrigin(1,0.5);
      box.push(l,v); y+=step; });
    this._summaryBtns=[]; this._summaryBonus=this.sugarStage;   // เก็บ Sugar ด่านนี้ไว้ทำ x2 ด้วยโฆษณา
    // 📺 รับ Sugar x2 (ดูโฆษณา · timesเดียว)
    if(this._summaryBonus>0&&!this._summaryDoubled){ const dw=Math.min(300,w-52),dh=44,dy=h*0.72,dg=this.add.graphics();
      dg.fillStyle(0xd8a33a,1);dg.fillRoundedRect(w/2-dw/2,dy-dh/2,dw,dh,16);dg.lineStyle(2,0xffffff,0.3);dg.strokeRoundedRect(w/2-dw/2,dy-dh/2,dw,dh,16);
      const dt2=this.add.text(w/2,dy,'📺 Get Sugar x2 (+'+this._summaryBonus+')',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#fff'}).setOrigin(0.5);
      box.push(dg,dt2); this._summaryBtns.push({x:w/2-dw/2,y:dy-dh/2,w:dw,h:dh,fn:()=>this.showRewardedAd('Get double Sugar (+'+this._summaryBonus+')',()=>this.adDoubleSugar())}); }
    const btn=this.add.graphics(); btn.fillStyle(COLORS.pink,1); btn.fillRoundedRect(w/2-120,h*0.82-30,240,60,22);
    const bt=this.add.text(w/2,h*0.82,last?'🏆 View Summary':'🗺 Back to Stage Select',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    box.push(btn,bt); this.over.add(box); this.over.setVisible(true);
    // (คง this.sugarStage ไว้เพื่อ re-render ตอนกด x2 · จะรีเซ็ตใน continueFromSummary)
  }
  adDoubleSugar(){ if(this._summaryDoubled)return; this._summaryDoubled=true; const bonus=this._summaryBonus||0; if(bonus>0)Save.addSugar(bonus);
    if(this.showBanner)this.showBanner('🍬 Sugar x2!','Get an extra +'+bonus+' from an ad',1700); Sfx.clear&&Sfx.clear();
    if(this.state==='summary')this.showStageSummary(this._summaryLast); }
  continueFromSummary(){
    if(this.state!=='summary')return;
    this.over.setVisible(false); this.physics.resume(); this.state='play';
    if(this._summaryLast){ this.victory(); return; }
    this._stageReward=null;this.sugarStage=0;this.exitStage();this.menuScreen='stage';this.buildMenuScreen();
  }
  showBanner(title,sub,ms){
    if(!this.bannerT||!this.bannerS)return;   // กันเรียกตอนยังNone HUD (เช่นจากหน้าเมนู) → ไม่ให้ crash
    this.bannerT.setText(title).setVisible(true).setAlpha(0).setScale(0.7);
    this.bannerS.setText(sub||'').setVisible(true).setAlpha(0);
    this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:1,duration:250});
    this.tweens.add({targets:this.bannerT,scale:1,duration:420,ease:'Back.out'});
    this.time.delayedCall(ms,()=>{ this.tweens.add({targets:[this.bannerT,this.bannerS],alpha:0,duration:400,
      onComplete:()=>{ this.bannerT.setVisible(false); this.bannerS.setVisible(false); }}); });
  }
  victory(){
    this.state='win'; this.physics.pause(); this.player.setVelocity(0,0);
    this.gainCharExp(this.kills+200);
    Sfx.victory();
    const w=this.W,h=this.H; this.over.removeAll(true);
    const bg=this.add.rectangle(0,0,w,h,0x14101a,0.9).setOrigin(0,0);
    const em=this.add.text(w/2,h*0.24,'🏆',{fontSize:'70px'}).setOrigin(0.5);
    const ch2=this.stageIndex===5,t=this.add.text(w/2,h*0.37,ch2?'First Canopy Conquered!':'Victory! The curse is broken',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:'#ffd166',align:'center',wordWrap:{width:w*0.85}}).setOrigin(0.5);
    const lore=this.add.text(w/2,h*0.47,ch2?'The Rootmother pulls up her roots and flees to the deeper garden, warning that four crown seeds remain — the Chapter 2 path has only just begun 🌿':'The Great Hunger collapses; flavor and memory return to the great kitchen 🍡',{fontFamily:'sans-serif',fontSize:'14px',color:'#c7bdd6',align:'center',wordWrap:{width:w*0.82}}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60), ss=Math.floor(this.elapsed%60);
    const stat=this.add.text(w/2,h*0.56,`Time ${mm}:${ss.toString().padStart(2,'0')}  ·  Kills ${this.kills}  ·  Lv ${this.level}`,{fontFamily:'sans-serif',fontSize:'15px',color:'#9a90ab'}).setOrigin(0.5);
    const btn=this.add.rectangle(w/2,h*0.68,210,58,COLORS.pink,1).setStrokeStyle(3,0xffffff,0.3);
    const bt=this.add.text(w/2,h*0.68,'↻ Play Again',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
    btn.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.restart());
    this.over.add([bg,em,t,lore,stat,btn,bt]); this.over.setVisible(true);
  }

  /* ---------- STARTING ATTACK ---------- */
  drawReadableChoiceCard(group,o,x,y,w,h,options={}){
    const type=o.type||'atk';let color=type==='basic'?(o.color||0xff8fb5):type==='heal'?0xff6f9d:type==='util'?0xffd166:type==='uni'?(o.color||0xff76a8):type==='pas'?(PASSIVES[o.key]?.color||0x66d3b3):type==='awk'?0xffc447:(SKILL_CARD_COLOR[o.key]||0xff8fb5);
    const rar=o.rarity; if(rar)color=rar.color;   // สีเฟรม = ความหายาก (สัญญาณอ่านเร็ว)
    const wide=w>=h*1.35, title=o.title||o.name||'', lvl=o.lvl||1, jump=rar&&rar.ranks>1?('→Lv'+(lvl+rar.ranks-1)):'';
    const role=o.role||(type==='basic'?'Basic Attack · Character growth':type==='heal'?'Instant heal · No passive slot':type==='util'?'Utility · Instant use':type==='atk'&&SKILLDEFS[o.key]?SKILLDEFS[o.key].role:type==='uni'?'Unique skill · Grows during the run':type==='pas'?'Passive · Boosts stats':'Ultimate · Awaken');
    const badge0=options.starting?'Starting skill · LV1':type==='basic'?(o.evolution?'BASIC · EVOLUTION':o.mutation?'BASIC · MUTATION':'BASIC · UPGRADE'):type==='heal'?'RECOVERY':type==='util'?'UTILITY':type==='uni'?'UNIQUE · EVOLVE':type==='awk'?'AWAKEN':type==='pas'?'PASSIVE':o.isNew?'ATTACK · NEW':'ATTACK · UPGRADE';
    const badge=rar?('◆ '+rar.name.toUpperCase()+(rar.ranks>1?' +'+rar.ranks:'')):badge0;   // rarity เด่นสุด อ่านปราดเดียว
    const panel=this.add.graphics();panel.fillStyle(0x21172b,0.98);panel.fillRoundedRect(x,y,w,h,16);panel.lineStyle(2,color,0.92);panel.strokeRoundedRect(x,y,w,h,16);panel.fillStyle(color,1);panel.fillRoundedRect(x,y,7,h,4);
    const iconKey=o.iconKey&&this.textures.exists(o.iconKey)?o.iconKey:type==='heal'?(this.textures.exists('ic_heart')?'ic_heart':null):type==='awk'?this.iconKey(o.key,false):this.iconKey(o.key,type==='pas');
    let icon,badgeT,nameT,roleT,descT,starsT,ctaT;
    if(wide){
      const iconX=x+Math.min(66,h*0.40),iconY=y+h/2,iconSize=Math.min(78,h*0.56),textX=x+Math.min(118,h*0.76),textW=w-(textX-x)-14;
      const halo=this.add.circle(iconX,iconY,Math.min(45,h*0.34),color,0.13).setStrokeStyle(2,color,0.30);
      icon=iconKey?this.add.image(iconX,iconY,iconKey).setDisplaySize(iconSize,iconSize):this.add.text(iconX,iconY,o.emoji||'?',{fontSize:Math.round(iconSize*0.72)+'px'}).setOrigin(0.5);
      badgeT=this.add.text(textX,y+10,badge,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#'+color.toString(16).padStart(6,'0')}).setOrigin(0,0);
      nameT=this.add.text(textX,y+29,title+(options.starting?'':'  Lv'+lvl+jump),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:w<300?'14px':'16px',color:'#ffffff',wordWrap:{width:textW},maxLines:1}).setOrigin(0,0);
      roleT=this.add.text(textX,y+55,role,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#f4d694',wordWrap:{width:textW},maxLines:1}).setOrigin(0,0);
      descT=this.add.text(textX,y+75,o.desc||'',{fontFamily:'sans-serif',fontSize:w<300?'9px':'11px',color:'#e9e3ef',lineSpacing:2,wordWrap:{width:textW},maxLines:2}).setOrigin(0,0);
      let stars='';if(!options.starting&&type!=='awk'&&type!=='heal'&&type!=='util')for(let s=0;s<(o.max||5);s++)stars+=s<lvl?'★':'☆';
      starsT=this.add.text(textX,y+h-20,stars,{fontFamily:'sans-serif',fontSize:'10px',color:'#ffe07a'}).setOrigin(0,0.5);
      ctaT=this.add.text(x+w-14,y+h-20,'Tap to choose  ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(1,0.5);
      group.add([panel,halo,icon,badgeT,nameT,roleT,descT,starsT,ctaT]);
    }else{
      const iconX=x+w/2,iconY=y+h*0.25,iconSize=Math.min(70,h*0.25),textW=w-22;
      const halo=this.add.circle(iconX,iconY,Math.min(42,w*0.22),color,0.13).setStrokeStyle(2,color,0.30);
      icon=iconKey?this.add.image(iconX,iconY,iconKey).setDisplaySize(iconSize,iconSize):this.add.text(iconX,iconY,o.emoji||'?',{fontSize:Math.round(iconSize*0.72)+'px'}).setOrigin(0.5);
      badgeT=this.add.text(x+w/2,y+9,badge,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#'+color.toString(16).padStart(6,'0')}).setOrigin(0.5,0);
      nameT=this.add.text(x+w/2,y+h*0.42,title+(options.starting?'':'  Lv'+lvl+jump),{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#ffffff',align:'center',wordWrap:{width:textW},maxLines:1}).setOrigin(0.5,0);
      roleT=this.add.text(x+w/2,y+h*0.52,role,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9px',color:'#f4d694',align:'center',wordWrap:{width:textW},maxLines:1}).setOrigin(0.5,0);
      descT=this.add.text(x+w/2,y+h*0.60,o.desc||'',{fontFamily:'sans-serif',fontSize:'9px',color:'#e9e3ef',align:'center',lineSpacing:2,wordWrap:{width:textW},maxLines:3}).setOrigin(0.5,0);
      let stars='';if(!options.starting&&type!=='awk'&&type!=='heal'&&type!=='util')for(let s=0;s<(o.max||5);s++)stars+=s<lvl?'★':'☆';
      starsT=this.add.text(x+w/2,y+h*0.87,stars,{fontFamily:'sans-serif',fontSize:'10px',color:'#ffe07a'}).setOrigin(0.5);
      ctaT=this.add.text(x+w/2,y+h-13,'Tap to choose  ›',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ffffff'}).setOrigin(0.5);
      group.add([panel,halo,icon,badgeT,nameT,roleT,descT,starsT,ctaT]);
    }
    this.drawComboHints(group,o,x,y,w,h,wide,options.index||0);
    const baseX=icon.scaleX||1,baseY=icon.scaleY||1;panel.setAlpha(0);icon.setScale(baseX*0.25,baseY*0.25);
    this.tweens.add({targets:[panel,badgeT,nameT,roleT,descT,starsT,ctaT],alpha:{from:0,to:1},duration:180,delay:(options.index||0)*65});
    this.tweens.add({targets:icon,scaleX:baseX,scaleY:baseY,duration:280,delay:(options.index||0)*65,ease:'Back.out'});
  }
  // คำใบ้คอมโบบนการ์ด: ไอคอนคู่คอมโบมุมขวาบน — จางถ้ายังNoneอีกครึ่ง / สว่าง+เรืองถ้ามีแล้ว (ชี้ว่าควWaitัพใบนี้)
  comboPartners(o){
    const key=o.key,isAtk=(o.type==='atk'||o.type==='awk'),out=[];
    for(const c of COMBOS){
      if(isAtk&&c.a===key){const owned=(this.passives?.[c.b]||0)>0;out.push({pk:c.b,isPass:true,owned,name:c.name});}
      else if(o.type==='pas'&&c.b===key){const owned=(this.skills?.[c.a]||0)>0;out.push({pk:c.a,isPass:false,owned,name:c.name});}
    }
    return out;
  }
  drawComboHints(group,o,x,y,w,h,wide,index){
    if(o.type!=='atk'&&o.type!=='pas'&&o.type!=='awk')return;
    const partners=this.comboPartners(o); if(!partners.length)return;
    const anyOwned=partners.some(p=>p.owned);
    const sz=18,gap=4,pad=10,list=partners.slice(0,3);
    let cx=x+w-pad-sz/2, cy=y+pad+sz/2;   // เริ่มมุมขวาบน ไล่ลงซ้าย
    // ป้ายเล็ก "🔗" นำหน้าเมื่อพร้อมคอมโบ ให้สังเกตง่าย
    if(anyOwned){const tag=this.add.text(x+w-pad,cy+sz/2+6,'🍳 Can cook a dish!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'8px',color:'#ffe07a'}).setOrigin(1,0);group.add(tag);}
    list.forEach((p,i)=>{
      const ix=cx-i*(sz+gap),iy=cy;
      const ring=this.add.circle(ix,iy,sz/2+2,p.owned?0xffe07a:0x6a6076,p.owned?0.9:0.35).setStrokeStyle(1.5,p.owned?0xffd23f:0x8a7f98,p.owned?1:0.5);
      const ik=this.iconKey(p.pk,p.isPass);
      let ic;
      if(ik)ic=this.add.image(ix,iy,ik).setDisplaySize(sz,sz);
      else{const em=(p.isPass?(PASSIVES[p.pk]?.emoji):(SKILLDEFS[p.pk]?.emoji))||'✦';ic=this.add.text(ix,iy,em,{fontSize:Math.round(sz*0.72)+'px'}).setOrigin(0.5);}
      if(!p.owned){ic.setAlpha(0.42);if(ic.setTintFill)ic.setTintFill(0x9a90a8);}   // ยังNoneอีกครึ่ง = จางเทา
      else{ic.clearTint&&ic.clearTint();ic.setAlpha(1);this.tweens.add({targets:[ring,ic],alpha:{from:0.55,to:1},yoyo:true,repeat:-1,duration:520,ease:'Sine.inOut'});}   // มีแล้ว = สว่าง+กระพริบ (ไม่ปรับ scale กันไอคอนพองใหญ่)
      group.add([ring,ic]);
    });
  }
  signatureWeaponInfo(){const ch=CHARACTERS[this.character]||CHARACTERS.momo;return SIGNATURE_WEAPONS[ch.weapon]||SIGNATURE_WEAPONS.berryBlaster;}
  usesBasicAttackBuild(){return !!BASIC_ATTACKS[this.character];}
  basicAttackInfo(){return BASIC_ATTACKS[this.character]||null;}
  initBasicAttack(){const d=this.basicAttackInfo();if(!d){this.basicAttack=null;return;}this.basicAttack={character:this.character,ranks:{},mutation:null,evolved:false,mastery:0,comboStep:0,lastComboAt:-9};this.syncBasicAttack();}
  syncBasicAttack(){const d=this.basicAttackInfo(),b=this.basicAttack;if(!d||!b)return;b.mastery=Object.values(b.ranks||{}).reduce((s,v)=>s+(v||0),0)+(b.mutation?1:0);this.skills[d.skill]=Math.min(5,1+Math.floor(b.mastery/3));this.skillCd[d.skill]=Math.min(this.skillCd[d.skill]||0,0.15);this.buildSkillBar();}
  equipSignatureWeapon(){const w=this.signatureWeaponInfo();this.signatureWeapon=w;this.skills[w.skill]=Math.max(1,this.skills[w.skill]||0);if(this.usesBasicAttackBuild())this.initBasicAttack();if(w.skill==='star')this.rebuildRing();}
  launchStageLoadout(extraSkillKey=null){const sw=this.signatureWeaponInfo(),basic=this.basicAttackInfo(),extra=extraSkillKey&&SKILLDEFS[extraSkillKey];
    const begin=()=>{this.physics.resume();this.state='play';this.startStage(this.stageIndex);this.showBanner(sw.emoji+' '+(basic?basic.name:sw.name)+(extra?' + '+extra.emoji+' '+extra.name:''),basic?'Signature Basic Attack · '+this.uniqueInfo().emoji+' Unique ready':'Signature + secondary weapon ready · '+this.uniqueInfo().emoji+' Unique ready',1900);};
    const launch=()=>{if(this.stageIndex===0&&!Save.data.storyIntroSeen){Save.data.storyIntroSeen=true;Save.save();this.playStoryPanel('story_intro_fall','CHAPTER 1 · PROLOGUE','Fall Below the Kitchen','The pantry floor gives way — the strawberry mochi falls into the sour ant nest, where the curse of hunger begins to stir',begin);}else if(this.stageIndex===5&&!Save.data.storyCh2Seen){Save.data.storyCh2Seen=true;Save.save();this.playStoryPanel('chapter2_cover','CHAPTER 2 · PROLOGUE','The Seed Hunger Left Behind','When The Great Hunger shattered, the crown seed rooted skyward — the memories just returned now bloom out of season in the ferment garden',begin);}else begin();};
    // ผู้เล่นใหม่: เข้าเล่นจริงเลย แล้วครูBerryสอนแบบ "Talk + try it + pass to continue"
    if(!Save.data.tutorialDone){ this._inTutorial=true; const wrapped=()=>{ begin(); this.startCoach(); }; if(this.stageIndex===0&&!Save.data.storyIntroSeen){Save.data.storyIntroSeen=true;Save.save();this.playStoryPanel('story_intro_fall','CHAPTER 1 · PROLOGUE','Fall Below the Kitchen','The pantry floor gives way — the strawberry mochi falls into the sour ant nest, where the curse of hunger begins to stir',wrapped);}else wrapped(); return; }
    launch();
  }
  /* ---- 🍓 ครูBerryสอนเล่นแบบ interactive (พูด → ลองทำ → ผ่าน → ถัดไป) ---- */
  coachSteps(){ return [
    { say:'Hi! I’m Berry~ Drag your finger to move! (the field waits until you do it)', goal:'Try moving around', check:c=>this.dist(this.player.x,this.player.y,c.px,c.py)>150 },
    { say:'Nice! Your weapon auto-fires — walk into enemies and defeat 3', goal:c=>'Defeat enemies '+Math.min(3,this.kills-c.kills)+'/3', spawn:5, check:c=>this.kills-c.kills>=3 },
    { say:'Careful! Tap the Dash button (bottom-right) to dodge', goal:'Use Dash once', check:c=>(this._coachDash||0)-c.dash>=1 },
    { say:'Power up! Pick 1 upgrade card (opened for you now)', goal:'Pick 1 card', level:true, check:c=>(this._coachCardPick||0)-c.card>=1 },
    { say:'Your ultimate! Tap the Unique button above Dash (wait a sec if it’s not ready)', goal:'Use Unique once', check:c=>(this._coachUnique||0)-c.uniq>=1, timeout:16 },
    { say:'Awesome! You’re ready — go have fun in the chaotic kitchen~ 🍓', goal:'Tap to finish', tap:true },
  ]; }
  startCoach(){ this._coach={step:-1,px:0,py:0,kills:0,dash:0,uniq:0,lvl:1,card:0,t:0}; this._coachNext(); }
  _coachNext(){ const c=this._coach; if(!c)return; c.step++; const steps=this.coachSteps();
    if(c.step>=steps.length){ this._coachFinish(); return; }
    const step=steps[c.step];
    c.px=this.player.x; c.py=this.player.y; c.kills=this.kills; c.dash=this._coachDash||0; c.uniq=this._coachUnique||0; c.lvl=this.level; c.card=this._coachCardPick||0; c.t=0; c.done=false;
    this.tutorialSetupStep(step);
    this.drawCoachBubble(step); Sfx.select&&Sfx.select(); }
  // จัดสนามให้เข้ากับบทที่สอน: เคลียร์มอนเก่าให้โล่ง (freeze/calm) · บทฆ่า = สปอนมอนอ่อน ๆ ให้ลอง · บทเลเวล = เปิดการ์ดให้เลือก
  tutorialSetupStep(step){
    if(this.clearEnemies)this.clearEnemies(); if(this.clearFoes)this.clearFoes();
    if(step.spawn){ for(let i=0;i<step.spawn;i++){ const a=Math.PI*2*i/step.spawn; this.spawnEnemy('basic', a, 175); } }
    if(step.level){ this.pendingLvl=(this.pendingLvl||0)+1; this.time.delayedCall(220,()=>{ if(this._inTutorial&&this.state==='play')this.openLevelUp(); }); }
  }
  _coachFinish(){ if(this._coachUI){this._coachUI.destroy();this._coachUI=null;} this._coach=null; this._inTutorial=false; if(this.clearEnemies)this.clearEnemies(); Save.data.tutorialDone=true; Save.save(); if(this.showBanner)this.showBanner('🎓 Tutorial complete!','Go loot and craft~',1600); }
  drawCoachBubble(step){ if(this._coachUI)this._coachUI.destroy(); const w=this.W; const cont=this.add.container(0,0).setScrollFactor(1).setDepth(60); this.camUI(cont);
    const bx=10,by=54,bw=w-20,bh=58, g=this.add.graphics(); g.fillStyle(0x2a1030,0.94); g.fillRoundedRect(bx,by,bw,bh,14); g.lineStyle(2,0xff5f88,1); g.strokeRoundedRect(bx,by,bw,bh,14); cont.add(g);
    if(this.textures.exists('card_berry')){ const im=this.add.image(bx+26,by+bh/2,'card_berry'); const s=Math.min(44/im.width,52/im.height); im.setScale(s); cont.add(im); }
    else { cont.add(this.add.text(bx+8,by+bh/2,'🍓',{fontSize:'30px'}).setOrigin(0,0.5)); }
    cont.add(this.add.text(bx+54,by+8,'Berry',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'10px',color:'#ff8fb5'}).setOrigin(0,0));
    cont.add(this.add.text(bx+54,by+22,step.say,{fontFamily:'sans-serif',fontSize:'11px',color:'#fff',wordWrap:{width:bw-64}}).setOrigin(0,0));
    const goalStr=typeof step.goal==='function'?step.goal(this._coach):step.goal;
    this._coachGoalTxt=this.add.text(bx+bw-10,by+bh-8,'🎯 '+goalStr,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'9.5px',color:'#ffe08a'}).setOrigin(1,1); cont.add(this._coachGoalTxt);
    this._coachUI=cont; }
  tickTutorialCoach(dt){ const c=this._coach; if(!c||this.state!=='play')return; const steps=this.coachSteps(),step=steps[c.step]; if(!step)return; c.t+=dt;
    if(this._coachGoalTxt&&typeof step.goal==='function')this._coachGoalTxt.setText('🎯 '+step.goal(c));
    if(step.tap){ if(this.input.activePointer&&this.input.activePointer.isDown&&c.t>0.4)this._coachNext(); return; }
    if((step.check&&step.check(c))||(step.timeout&&c.t>=step.timeout)){ if(!c.done){c.done=true; this.showBanner&&this.showBanner('✅ Done!','Great job~',900); this.time.delayedCall(700,()=>this._coachNext());} }
  }
  openStartingSkillChoice(){
    if(this.usesBasicAttackBuild()){this.state='startskill';this.physics.pause();this.lvlUp.setVisible(false);this.time.delayedCall(0,()=>this.launchStageLoadout());return;}
    this.state='startskill';this.physics.pause();const w=this.W,h=this.H;this.lvlUp.removeAll(true);this.startSkillCards=[];
    const bg=this.add.rectangle(0,0,w,h,0x160f21,0.96).setOrigin(0,0);this.lvlUp.add(bg);
    const u=this.uniqueInfo(),sw=this.signatureWeaponInfo(),title=this.add.text(w/2,18,'⚔️ Pick 1 secondary weapon',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:w>h?'18px':'20px',color:'#ffe07a'}).setOrigin(0.5,0);
    const sub=this.add.text(w/2,45,sw.emoji+' Signature: '+sw.name+' · '+sw.trait+'\n'+u.emoji+' Unique: '+u.name,{fontFamily:'sans-serif',fontSize:'10px',color:'#cfc3dc',align:'center',lineSpacing:2,wordWrap:{width:w-30}}).setOrigin(0.5,0);this.lvlUp.add([title,sub]);
    const keys=Phaser.Utils.Array.Shuffle(Object.keys(SKILLDEFS).filter(k=>k!==sw.skill)).slice(0,3),portrait=w<=h,cols=portrait?1:3,gap=10,side=portrait?14:10,startY=86,rows=Math.ceil(keys.length/cols),cw=(w-side*2-gap*(cols-1))/cols,ch=Math.min(portrait?158:310,(h-startY-14-gap*(rows-1))/rows),left=(w-(cw*cols+gap*(cols-1)))/2;
    keys.forEach((key,i)=>{const d=SKILLDEFS[key],x=left+(i%cols)*(cw+gap),y=startY+Math.floor(i/cols)*(ch+gap);this.drawReadableChoiceCard(this.lvlUp,{type:'atk',key,title:d.name,lvl:1,max:d.max,emoji:d.emoji,role:d.role,desc:d.desc},x,y,cw,ch,{starting:true,index:i});this.startSkillCards.push({left:x,right:x+cw,top:y,bottom:y+ch,key});});
    this.lvlUp.setVisible(true);
  }
  pickStartingSkillAt(px,py){
    const c=(this.startSkillCards||[]).find(z=>px>=z.left&&px<=z.right&&py>=z.top&&py<=z.bottom);if(!c)return;Sfx.select();this.skills[c.key]=1;if(c.key==='star')this.rebuildRing();this.lvlUp.setVisible(false);this.buildSkillBar();
    this.launchStageLoadout(c.key);
  }

  /* ---------- LEVEL UP ---------- */
  gainXp(n){
    this.xp+=n;
    while(this.xp>=this.xpNext){ this.xp-=this.xpNext; this.level++; this.xpNext=Math.round(this.xpNext*1.26+4); this.pendingLvl=(this.pendingLvl||0)+1; this.checkUniqueAutoUpgrade(); this.jelly(0,3.2); this.vfxLevelUp(); }
    this.lvlTxt.setText('Lv '+this.level);
    if(this.pendingLvl>0 && this.state==='play') this.openLevelUp();
  }
  checkUniqueAutoUpgrade(){
    let target=1;for(let lv=2;lv<=UNIQUE_MAX_LV;lv++)if(this.level>=uniqueAt[lv])target=lv;if(target<=(this.uniqueLevel||1))return;
    const u=this.uniqueInfo();this.uniqueLevel=target;this.uniqueCd=0;this.refreshUniqueSkillUI();this.showBanner('✨ Unique auto-upgraded to Lv'+target,u.name+' · '+UNIQUE_TIERS[(CHARACTERS[this.character]||CHARACTERS.momo).unique][target],1900);Sfx.clear();
  }
  openLevelUp(){
    this.state='levelup'; this.physics.pause();
    Sfx.levelup();
    const w=this.W,h=this.H; if(this._cardHi){this.tweens.killTweensOf(this._cardHi);} this.lvlUp.removeAll(true); this._cardHi=null; this.lvlCards=[];
    const bg=this.add.rectangle(0,0,w,h,0x160f21,0.94).setOrigin(0,0);
    this.lvlUp.add(bg);
    const heldBot0=this.drawHeldBar(this.lvlUp, 8);
    const heldBot=this.usesBasicAttackBuild()?this.drawRecipePanel(this.lvlUp,heldBot0+2):heldBot0;   // โชว์สูตร recipe เฉพาะ character-first
    const t=this.add.text(w/2,heldBot+2,this._chestReward?'🎁 Treasure — tap the same card again to confirm':'⭐ LEVEL UP — tap to choose, tap again to confirm',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffe07a'}).setOrigin(0.5,0);this.levelChoiceHint=t;this._pendingCardConfirm=null;this.levelCardReadyAt=this.time.now+300;
    this.lvlUp.add(t);
    this.banishMode=false;
    const opts=this.rollUpgrades(this.usesBasicAttackBuild()?3:4); this._lvlOpts=opts;
    const portrait=w<=h,cols=portrait?1:2,gap=portrait?12:10,side=portrait?14:10,startY=heldBot+33;
    const rows=Math.ceil(opts.length/cols),cardW=Math.min(portrait?190:178,(w-side*2-gap*(cols-1))/cols);
    const finalCardW=portrait?(w-side*2):cardW;
    const ch=Math.min(portrait?150:220,(h-startY-52-gap*(rows-1))/rows);   // เว้นล่าง 40px ให้ปุ่มสุ่มใหม่/ลบสกิล
    const total=finalCardW*cols+gap*(cols-1), lx=(w-total)/2;
    opts.forEach((o,i)=>{
      const col=i%cols,row=Math.floor(i/cols),x=lx+col*(finalCardW+gap), y=startY+row*(ch+gap);
      this.drawReadableChoiceCard(this.lvlUp,o,x,y,finalCardW,ch,{index:i});
      this.lvlCards.push({left:x,right:x+finalCardW,top:y,bottom:y+ch,apply:o.apply,title:o.title,opt:o});
    });
    this.drawLevelActionBar(h-40);
    this.lvlUp.setVisible(true);
  }
  // แถบปุ่ม "🎲 Reroll" + "🚫 Banish" (ใช้ได้จำกัดต่อด่าน)
  drawLevelActionBar(y){
    this.lvlActionBtns=[];
    const w=this.W,bw=Math.min(168,(w-42)/2),bh=34,gap=10,total=bw*2+gap,x0=(w-total)/2;
    const mk=(x,label,enabled,active,fn)=>{
      const g=this.add.graphics();
      g.fillStyle(active?0xff6a8f:(enabled?0x2e2540:0x201a2c),active?0.95:0.92);g.fillRoundedRect(x,y,bw,bh,10);
      g.lineStyle(2,active?0xffe08a:(enabled?0xffb3cd:0x4a4258),enabled?0.95:0.5);g.strokeRoundedRect(x,y,bw,bh,10);
      const t=this.add.text(x+bw/2,y+bh/2,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:enabled?'#ffffff':'#7a7088',align:'center'}).setOrigin(0.5);
      this.lvlUp.add([g,t]);
      if(enabled)this.lvlActionBtns.push({left:x,right:x+bw,top:y,bottom:y+bh,fn});
    };
    const rr=this.rerollLeft||0,bb=this.banishLeft||0;
    mk(x0,'🎲 Reroll ('+rr+')',rr>0,false,()=>this.doReroll());
    mk(x0+bw+gap,(this.banishMode?'🚫 Tap a card to remove':'🚫 Banish ('+bb+')'),bb>0,this.banishMode,()=>this.toggleBanishMode());
  }
  doReroll(){
    if((this.rerollLeft||0)<=0)return; this.rerollLeft--; Sfx.select(); this.banishMode=false;
    this._pendingCardConfirm=null; this.openLevelUp(); // เปิดใหม่ = สุ่มการ์ดชุดใหม่ (ไม่ลด pendingLvl)
  }
  toggleBanishMode(){
    if((this.banishLeft||0)<=0)return; this.banishMode=!this.banishMode; this._pendingCardConfirm=null; Sfx.select();
    if(this.levelChoiceHint)this.levelChoiceHint.setText(this.banishMode?'🚫 Banish mode — tap a card to remove it for this stage':'⭐ LEVEL UP — tap to choose, tap again to confirm');
    this.drawLevelActionBar(this.H-40);
  }
  pickCardAt(px,py){
    // ปุ่มสุ่มใหม่/ลบสกิล ก่อน (อยู่ล่างสุด)
    const ab=(this.lvlActionBtns||[]).find(b=>px>=b.left&&px<=b.right&&py>=b.top&&py<=b.bottom);
    if(ab){ ab.fn(); return; }
    const c=this.lvlCards.find(c=>px>=c.left&&px<=c.right&&py>=c.top&&py<=c.bottom);
    if(!c||this.time.now<(this.levelCardReadyAt||0)) return;
    if(this.banishMode){ this.banishCard(c); return; }
    if(this._pendingCardConfirm!==c){this._pendingCardConfirm=c;Sfx.select();this.highlightCard(c);if(this.levelChoiceHint)this.levelChoiceHint.setText('Selected \u201c'+c.title+'\u201d · tap again to confirm');return;}
    Sfx.clear(); c.apply(); this._pendingCardConfirm=null; this.closeLevelUp();
  }
  banishCard(c){
    if((this.banishLeft||0)<=0)return; const o=c.opt; if(!o)return;
    if(o.type==='heal'){if(this.showBanner)this.showBanner('💖 Recovery Card','Sweet Recovery is an emergency option and can’t be banished',1200);return;}
    const bk=(o.type==='pas'?'p:':o.type==='basic'?'b:':'a:')+o.key; if(!this.banishedKeys)this.banishedKeys={}; this.banishedKeys[bk]=true;
    this.banishLeft--; this.banishMode=false; this._pendingCardConfirm=null; Sfx.clear();
    if(this.showBanner)this.showBanner('🚫 Banish',o.title+' won’t appear again this stage',1400);
    this.openLevelUp();   // สุ่มการ์ดชุดใหม่โดยNoneสกิลที่ลบ (ไม่ลด pendingLvl)
  }
  // แตะครั้งแรก = โชว์กWaitบเรืองWaitบการ์ด ให้ผู้เล่นรู้ว่ากำลังเลือกใบนี้ (ก่อนแตะซ้ำยืนยัน)
  highlightCard(c){
    if(!this.lvlUp)return;
    if(!this._cardHi){this._cardHi=this.add.graphics().setDepth(50);this.lvlUp.add(this._cardHi);}
    const g=this._cardHi;g.clear();
    const x=c.left,y=c.top,w=c.right-c.left,h=c.bottom-c.top,r=14;
    g.fillStyle(0xffe07a,0.12);g.fillRoundedRect(x,y,w,h,r);
    g.lineStyle(4,0xffe07a,0.95);g.strokeRoundedRect(x,y,w,h,r);
    g.lineStyle(2,0xffffff,0.7);g.strokeRoundedRect(x+3,y+3,w-6,h-6,r-3);
    g.setScale(1);this.tweens.killTweensOf(g);
    this.tweens.add({targets:g,alpha:{from:0.55,to:1},duration:260,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  }
  closeLevelUp(){
    this._coachCardPick=(this._coachCardPick||0)+1;   // นับการเลือกการ์ด (ใช้ในบทสอนเลเวลอัพ)
    this.lvlUp.setVisible(false); this.pendingLvl=Math.max(0,(this.pendingLvl||1)-1);
    if(this.pendingLvl>0){ this.openLevelUp(); return; }
    this.state='play'; this.physics.resume();
    const queued=this._queuedBossIntro;this._queuedBossIntro=null;
    if(queued)this.time.delayedCall(80,()=>{if(this.state!=='play')return;if(queued==='mini'&&this.mode==='miniWarning')this.spawnMiniBoss();else if(queued==='final')this.spawnFinalBoss();});
    if(this._chestReward){ this._chestReward=false; this.time.delayedCall(180,()=>{ if(this.state==='play')this.onStageClear(); }); }
  }
  rollBasicAttackUpgrades(n,opts){
    const d=this.basicAttackInfo(),b=this.basicAttack;if(!d||!b)return [];
    const noSpecial=opts&&opts.noSpecial;   // กล่องสุ่ม: ข้ามช่วง mutation/evolution (กันสุ่มได้อันเดิมซ้ำ)
    const fallbackIcon=SKILL_ICON[d.skill],makeCard=(u,extra={})=>({type:'basic',key:u.id,lvl:extra.lvl||1,max:extra.max||u.max||1,kind:'Basic Attack',color:d.color,emoji:u.emoji,title:u.name,desc:u.desc,iconKey:u.iconKey||fallbackIcon,...extra});
    // ⭐ ช่วงพิเศษ #1 — เลือกสายกลายรูป (Mutation) timesเดียว: การ์ดทั้งจอเป็น mutation ล้วน
    if(!noSpecial&&b.mastery>=8&&!b.mutation){   // Mutation ออกช้าลง (เดิม mastery 5 → 8)
      const muts=d.mutations.filter(u=>!this.banishedKeys?.['b:'+u.id]);
      if(muts.length){ this.showBanner('⭐ Mutation Fork!','Choose one playstyle (the other locks)',1500);
        return muts.map(u=>makeCard(u,{mutation:true,special:true,apply:()=>{b.mutation=u.id;this.syncBasicAttack();this.showBanner(u.emoji+' '+u.name,'Mutation path chosen · the other is locked',1700);}})); }
    }
    // ✨ ช่วงพิเศษ #2 — Evolution timesเดียว: การ์ดเดียวเด่น ๆ ให้รู้สึกใหญ่
    if(!noSpecial&&b.mastery>=20&&!b.evolved&&!this.banishedKeys?.['b:evolution']){   // Evolution ออกช้าลง (เดิม mastery 12 → 20)
      this.showBanner('✨ Ready to Evolve!','Ultimate upgrade for your Basic Attack',1600);
      const EVO_DESC={sprinkle:'Seeds fly straight and fast, piercing everything (no homing)',thunder:'Screen-wide lightning storm — multiple strikes, far longer chains',frost:'Fires 3 piercing lances (trident), each shattering ice shards at the end',meteor:'Extra slams + every hit leaves a shockwave (not just the last)',mirror:'An extra mirror beam + longer, wider, harder-hitting shots'};
      const evo={id:'evolution',name:d.evolution,emoji:'✨',desc:'✨ '+(EVO_DESC[d.skill]||'Upgrades the whole Basic Attack!')};
      return [makeCard(evo,{evolution:true,special:true,color:0xffd54a,apply:()=>{b.evolved=true;this.syncBasicAttack();this.showBanner('✨ EVOLUTION',d.name+' → '+d.evolution,2200);Sfx.clear();}})];
    }
    // ----- WaitบNormal: ผสมสาย attack + passive + heal ให้หลากหลาย (แก้ปัญfind +ยิง ออกถี่) -----
    // สายอัพเกรด attack — ยิ่ง rank สูง โอกาสยิ่งน้อย (กันเจอใบเดิมซ้ำ)
    const atk=[];
    for(const u of d.upgrades){const cur=b.ranks[u.id]||0;if(cur>=u.max||this.banishedKeys?.['b:'+u.id])continue;
      const rr=rollRarity(); atk.push({w:Math.max(1,5-cur*1.5),card:makeCard(u,{lvl:cur+1,max:u.max,rarity:rr,color:rr.color,apply:()=>{b.ranks[u.id]=Math.min(u.max,(b.ranks[u.id]||0)+rr.ranks);this.syncBasicAttack();}})});}
    // ตัวเลือกเสริมประจำทุกตัว (Overdrive/Combat Tempo) — ขยาย pool ให้ ≥6 แบบ ลดการเจอใบเดิมซ้ำ
    const extra=[{id:'overdrive',name:'Overdrive',emoji:'🔥',max:8,desc:'Basic Attack damage +5% per rank'},{id:'tempo',name:'Combat Tempo',emoji:'💨',max:8,desc:'Basic Attack fires 3% faster per rank'}];
    for(const u of extra){const cur=b.ranks[u.id]||0;if(cur>=u.max)continue;const rr=rollRarity();atk.push({w:atk.length?1.4:2.5,card:makeCard(u,{lvl:cur+1,max:u.max,rarity:rr,color:rr.color,apply:()=>{b.ranks[u.id]=Math.min(u.max,(b.ranks[u.id]||0)+rr.ranks);this.syncBasicAttack();}})});}
    // สายติดตัว (passive) — 12 แบบ = แหล่งความหลากหลายหลัก · boost คู่ที่Cook Dishได้ (recipe)
    const cookB=new Set(COMBOS.filter(c=>this.skills[c.a]>0).map(c=>c.b));
    const pas=[];const pasOwned=Object.keys(this.passives).length;
    for(const key in PASSIVES){if(this.banishedKeys?.['p:'+key])continue;const p=PASSIVES[key],cur=this.passives[key]||0;if(cur>=p.max||(cur===0&&pasOwned>=4))continue;
      const cooks=cookB.has(key)&&cur===0;
      const rr=rollRarity(),grant=Math.min(p.max-cur,rr.ranks);
      pas.push({w:cooks?6:2.4,card:{type:'pas',key,lvl:cur+1,max:p.max,isNew:cur===0,rarity:rr,kind:cooks?'Passive 🍳':'Passive',badgeColor:'#66d3b3',color:rr.color,emoji:p.emoji,title:p.name,desc:cooks?('🍳 Can cook a dish! · '+p.desc):p.desc,apply:()=>{for(let n=0;n<grant;n++){this.passives[key]=(this.passives[key]||0)+1;p.apply(this.player);}this.buildSkillBar();}}});}
    const hpFrac=this.player.hp/Math.max(1,this.player.maxhp);
    let healCard=null;
    if(hpFrac<0.999){const rr=rollRarity(),amount=Math.max(1,Math.round(this.player.maxhp*0.25*(this.player.healEffect||1)*(1+(rr.ranks-1)*0.5)));healCard={type:'heal',key:'sweetRecovery',iconKey:'ic_sweet_recovery',lvl:1,max:1,rarity:rr,color:rr.color,kind:'Instant Heal',emoji:'💖',title:'Sweet Recovery',desc:'Restore HP instantly '+amount+' HP · No passive slot',apply:()=>{const before=this.player.hp;this.player.hp=Math.min(this.player.maxhp,this.player.hp+amount);const healed=Math.round(this.player.hp-before);if(healed>0)this.popHeal(this.player.x,this.player.y,healed);Sfx.heal();}};}
    const pick=(arr)=>{if(!arr.length)return null;let tot=arr.reduce((s,x)=>s+x.w,0),r=Math.random()*tot;for(let i=0;i<arr.length;i++){r-=arr[i].w;if(r<=0)return arr.splice(i,1)[0].card;}return arr.splice(0,1)[0].card;};
    const out=[];
    const a1=pick(atk); if(a1)out.push(a1);          // การันตี 1 สายโจมตี
    const p1=pick(pas); if(p1)out.push(p1);          // การันตี 1 สายติดตัว (เพิ่มบทบาท passive)
    const rest=[...atk,...pas]; while(out.length<n&&rest.length){const c=pick(rest);if(c)out.push(c);else break;}
    if(hpFrac<0.40&&healCard){ out.length>=n?out[n-1]=healCard:out.push(healCard); }   // เลือดวิกฤต = การันตีการ์ดฟื้น
    else if(out.length<n&&healCard)out.push(healCard);
    if(!out.length)out.push({type:'util',key:'sugarCache',lvl:1,max:1,emoji:'🍬',title:'Sugar Cache',desc:'Gain 8 Sugar instantly',apply:()=>{this.sugarStage+=8;this.sugarRun+=8;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);}});
    Phaser.Utils.Array.Shuffle(out);
    return out.slice(0,n);
  }
  rollUpgrades(n,opts){
    if(this.usesBasicAttackBuild())return this.rollBasicAttackUpgrades(n,opts);
    const skillPool=[], passPool=[], awakenPool=[], recoveryPool=[];
    const S=(key,lvl,max,emoji,title,desc,isNew,apply)=>skillPool.push({type:'atk',key,lvl,max,isNew,kind:'Attack Skill',badgeColor:'#f0a54a',color:0xf0a54a,emoji,title,desc,apply});
    const P=(key,lvl,max,emoji,title,desc,isNew,apply)=>passPool.push({type:'pas',key,lvl,max,isNew,kind:'Passive',badgeColor:'#66d3b3',color:0x66d3b3,emoji,title,desc,apply,pas:true});
    const A=(key,emoji,title,desc,apply)=>awakenPool.push({type:'awk',key,lvl:SKILL_AWAKEN_LV,max:SKILL_AWAKEN_LV,kind:'Ultimate (Awaken)',badgeColor:'#ffcf5a',color:0xffb020,emoji,title,desc,apply,awk:true});
    const hpFrac=this.player.hp/Math.max(1,this.player.maxhp);
    if(hpFrac<0.999){
      const amount=Math.max(1,Math.round(this.player.maxhp*0.25*(this.player.healEffect||1)));
      const recovery={type:'heal',key:'sweetRecovery',iconKey:'ic_sweet_recovery',lvl:1,max:1,kind:'Instant Heal',badgeColor:'#ff8fb5',color:0xff6f9d,emoji:'💖',title:'Sweet Recovery',desc:'Restore HP instantly '+amount+' HP · No passive slot',apply:()=>{const before=this.player.hp;this.player.hp=Math.min(this.player.maxhp,this.player.hp+amount);const healed=Math.round(this.player.hp-before);if(healed>0)this.popHeal(this.player.x,this.player.y,healed);Sfx.heal();}};
      recoveryPool.push(recovery);
      if(hpFrac<0.40)recoveryPool.push({...recovery});
    }
    const atkOwned=Object.keys(this.skills).length;      // Lockedโจมตี ≤ SKILL_CAP
    const pasOwned=Object.keys(this.passives).length;
    const awakenOwned=Object.values(this.skills).filter(lv=>lv>=SKILL_AWAKEN_LV).length;    // Lockedติดตัว ≤ PASSIVE_CAP
    // --- Attack Skill (auto-cast) — skillsใหม่เฉพาะเมื่อยังไม่Fullโควตา ---
    for(const key in SKILLDEFS){ if(this.banishedKeys&&this.banishedKeys['a:'+key])continue; const d=SKILLDEFS[key], cur=this.skills[key]||0;
      if(cur===0){ if(atkOwned<SKILL_CAP) S(key,1,d.max,d.emoji,d.name,d.desc,true,()=>{ this.skills[key]=1; if(key==='star')this.rebuildRing(); this.buildSkillBar(); }); }
      else if(cur<d.max){ const nx=cur+1, tier=(SKILL_TIERS[key]&&SKILL_TIERS[key][nx])||'Stronger';
        S(key,nx,d.max,d.emoji,d.name,tier,false,()=>{ this.skills[key]++; if(key==='star')this.rebuildRing(); this.buildSkillBar(); }); }
      else if(awakenOwned<AWAKEN_CAP && cur===d.max && d.awaken && COMBOS.some(c=>c.a===key&&(this.passives[c.b]||0)>0)){   // MAX + ถือ Passive คู่ที่ถูกต้องจึงตื่นรู้ได้ (แบบเดิม · แต่คอมโบไม่ให้โบนัส status แล้ว)
        const a=d.awaken,combo=COMBOS.find(c=>c.a===key),pair=combo&&PASSIVES[combo.b]?('Pair: '+d.emoji+' '+d.name+' MAX + '+PASSIVES[combo.b].emoji+' '+PASSIVES[combo.b].name):'';
        A(key,a.emoji,'Awaken: '+a.name,pair+' · '+a.desc,()=>{ this.skills[key]=SKILL_AWAKEN_LV; if(key==='star')this.rebuildRing(); this.buildSkillBar(); if(this.showBanner)this.showBanner('⚡ Skill Awakened! '+a.emoji, d.name+' → '+a.name, 2400); Sfx.clear(); }); }
    }
    // --- Passive (passive แบบเลเวลได้) — ตัวใหม่เฉพาะเมื่อยังไม่Fullโควตา ---
    for(const key in PASSIVES){ if(this.banishedKeys&&this.banishedKeys['p:'+key])continue; const d=PASSIVES[key], cur=this.passives[key]||0;
      if(cur===0){ if(pasOwned<PASSIVE_CAP) P(key,1,d.max,d.emoji,d.name,d.desc+' · '+passivePairHint(key),true,()=>{ this.passives[key]=1; d.apply(this.player); this.buildSkillBar(); }); }
      else if(cur<d.max){ P(key,cur+1,d.max,d.emoji,d.name,d.desc+' · '+passivePairHint(key),false,()=>{ this.passives[key]++; d.apply(this.player); this.buildSkillBar(); }); }
    }
    Phaser.Utils.Array.Shuffle(skillPool); Phaser.Utils.Array.Shuffle(passPool); Phaser.Utils.Array.Shuffle(awakenPool); Phaser.Utils.Array.Shuffle(recoveryPool);
    const out=[];
    // 1) การันตี Evolution เมื่ออาวุธ MAX และถือ Passive คู่กันแล้วเท่านั้น
    if(awakenPool.length) out.push(awakenPool.shift());
    // 2) เติมด้วยAttack Skillเป็นหลัก
    for(const o of skillPool){ if(out.length>=n) break; out.push(o); }
    // 3) เว้นที่ให้Passiveอย่างน้อย 1 ใบเสมอ (ถ้ามีให้เลือก)
    const survivalPool=Phaser.Utils.Array.Shuffle([...passPool,...recoveryPool]);
    if(survivalPool.length && !out.some(o=>o.pas||o.type==='heal')){
      if(out.length<n) out.push(survivalPool[0]);
      else out[out.length-1]=survivalPool[0];   // ทุกชุดมีทางเลือกเอาตัวWaitดอย่างน้อย 1 ใบ
    }
    // 4) เติมช่องที่เหลือด้วยของสำWaitงทั้งหมด กันการ์ดไม่ครบตอนตัวเลือกน้อย
    for(const o of [...skillPool, ...survivalPool, ...awakenPool]){ if(out.length>=n) break; if(!out.includes(o)) out.push(o); }
    Phaser.Utils.Array.Shuffle(out);
    return out.slice(0,n);
  }
  clearStarGuardFx(){
    (this.ringBalls||[]).forEach(b=>{if(b&&b.active)b.destroy();});this.ringBalls=[];
    (this.starGuardFields||[]).forEach(f=>{if(f&&f.active)f.destroy();});this.starGuardFields=[];
    this._starTrailTick=0;this._starTrailIndex=0;
  }
  rebuildRing(){
    this.clearStarGuardFx();
    const lvl=this.skills.star||0; if(lvl<1)return;
    const isSesame=this.character==='sesame';
    const aw=lvl>=SKILL_AWAKEN_LV;            // ตื่นรู้: วงกาแล็กซี 3 ชั้น
    const count=aw?12:(2+lvl+(isSesame?1:0));                  // Sesame เริ่มต้นด้วยดาว +1 ดวง
    const rOuter=(aw?78:48+lvl*3)*(isSesame?1.15:1);          // วงคุ้มกันกว้างขึ้น
    const rMid=rOuter*0.72, rInner=rOuter*0.5;
    const twoRing=lvl>=6&&!aw;                // L6 วงคู่
    const size=(0.27+lvl*0.012)*(aw?1.18:1)*(isSesame?1.08:1); // ดาวห้าแฉกอ่านชัดราว 34–48px บนมือถือ
    const spark=lvl>=5||isSesame;             // กระจายประกายเมื่อชน
    this.ringSpin=(aw?4.6:2.6+lvl*0.28)*(isSesame?1.3:1);      // หมุนเร็วขึ้น 30%
    // เส้นทางโคจรโปร่งบางช่วยให้ Star Guard อ่านระยะป้องกันได้ โดยไม่เพิ่มแสงทึบกลางสนาม
    const fieldRadii=aw?[rOuter,rMid,rInner]:[rOuter];
    fieldRadii.forEach((rr,i)=>{const f=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_ring').setTint(i===0?0xff9ec4:0xffd166).setDepth(3).setDisplaySize(rr*2,rr*1.64).setAlpha(i===0?0.12:0.07));f._phase=i*1.7;f._spinDir=i%2?-1:1;this.starGuardFields.push(f);});
    for(let i=0;i<count;i++){
      const tier=aw?(i%3):(twoRing?(i%2===0?0:2):0);   // aw: 3 ชั้น (0=นอก,1=กลาง,2=ใน)
      const rr=tier===0?rOuter:tier===1?rMid:rInner;
      // ใช้ silhouette จากไอคอนแทน flipbook เดิมซึ่งมีดาวจริงเล็กเกินไปจนเห็นเป็นวงเหลืองเมื่อย่อ
      const b=this.camWorld(this.physics.add.sprite(0,0,'ic_star').setScale(size).setDepth(88000));
      b.setCircle(38,26,26); b.body.setAllowGravity(false); b.dmg=(4+lvl*1.5)*(BALANCE.skillPower.star||1)*(aw?1.12:1)*(isSesame?1.10:1); b.hitCd=0;
      b.rr=rr; b.ang0=(i/count)*Math.PI*2;b._baseScale=size;b._motionPhase=(i/count)*Math.PI*2;
      this.physics.add.overlap(b,this.enemies,(ball,en)=>{ if(ball.hitCd>0)return; ball.hitCd=isSesame?0.09:0.12;
        this.damage(en,ball.dmg*this.player.dmgMul,ball.x,ball.y);
        if(spark)this.burst(ball.x,ball.y,0xffe08a); });
      this.ringBalls.push(b);
    }
  }

  /* ---------- SPAWN ---------- */
  spawnEnemy(type,angOverride,radOverride){
    const ang=angOverride!=null?angOverride:Math.random()*Math.PI*2, rad=radOverride!=null?radOverride:Math.max(this.W,this.H)/this.viewZoom*0.62+40;
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let e=this.enemies.getFirstDead(false);
    let key=type==='acid'?'e_acid':type==='dasher'?'e_dasher':type==='fast'?'e_fast':type==='shooter'?'e_shooter':type==='bomber'?'e_bomber':type==='siege'?'e_siege':type==='tank'?'e_tank':'e_basic';
    if(this.stageIndex===0&&type!=='acid') key=(type==='fast'||type==='dasher')?'e_ant_scout':(type==='shooter'||type==='bomber')?'e_ant_spitter':(type==='tank'||type==='siege')?'e_ant_soldier':'e_ant_worker';
    if(this.stageIndex===0&&this.textures.exists(key+'_readable'))key+='_readable';
    if(this.stageIndex===1) key=(type==='fast'||type==='dasher')?'e_drain_dasher':type==='shooter'?'e_drain_caster':type==='bomber'?'e_drain_bomber':(type==='tank'||type==='siege')?'e_drain_tank':'e_drain_slime';
    if(this.stageIndex===2) key=(type==='fast'||type==='dasher')?'e_fire_chili':type==='shooter'?'e_fire_grinder':type==='bomber'?'e_fire_bomber':(type==='tank'||type==='siege')?'e_fire_golem':'e_fire_ember';
    if(this.stageIndex===3) key=(type==='fast'||type==='dasher')?'e_ice_shard':type==='shooter'?'e_ice_caster':type==='bomber'?'e_ice_bomber':(type==='tank'||type==='siege')?'e_ice_guardian':'e_ice_wisp';
    if(this.stageIndex===4) key=(type==='fast'||type==='dasher')?'e_crown_ripper':type==='shooter'?'e_banquet_eye':type==='bomber'?'e_maw_truffle':(type==='tank'||type==='siege')?'e_royal_oven_sentinel':'e_void_crumb';
    const ch2Frame={basic:0,fast:1,dasher:1,shooter:2,bomber:3,tank:4,siege:5}[type]??0;if(this.stageIndex===5)key='ch2_enemy_atlas';
    if(!e) e=this.enemies.create(x,y,key,this.stageIndex===5?ch2Frame:0);
    else { e.setTexture(key,this.stageIndex===5?ch2Frame:0); e.setActive(true).setVisible(true); if(e.body)e.body.enable=true; e.setPosition(x,y); }
    if(!e)return;   // pool Full (600) → ข้ามการเกิด (เวฟคุมด้วยเวลา ไม่นับจำนวน) กัน null crash
    this.clearObjectiveTargetFx(e);e._waveObjectiveTarget=false;
    // สเกลตามด่าน+Wave (ยิ่งลึกยิ่งอึด/ดาเมจสูง)
    const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),stageCurve=[1,1.42,1.88,2.42,3.05,3.72][this.stageIndex]||3.72,waveCurve=[1,1.08,1.17,1.27,1.38][this.waveIndex]||1.38,s=stageCurve*waveCurve*pg.enemyHp*this.killPowerMul()*this.diffMul().hp*this.newbieEase();   // ฐานแฟร์ (diff 1) + สเกลตามมอนที่ตาย + ระดับความยาก + ผ่อนให้ผู้เล่นใหม่
    e.shooter=false; e.bomber=false; e.acid=false; e.shootCd=0; e.dasher=false; e.siege=false; e.dashState=null; e.tintColor=null;
    e.bloomStacks=0;e.bloomUntil=0;e.frostbite=this.stageIndex===3;
    let scale=1;
    if(type==='acid'){ e.hp=26*s; e.spd=52; e.dmg=11; e.xp=2; e.acid=true; e.shootCd=Phaser.Math.FloatBetween(0.8,1.6); e.setCircle(22,26,26); }
    else if(type==='fast'){ e.hp=10*s; e.spd=122; e.dmg=9; e.xp=1; e.setCircle(15,4,4); }
    else if(type==='tank'){ e.hp=80*s; e.spd=36; e.dmg=18; e.xp=4; e.setCircle(26,5,5); }
    else if(type==='shooter'){ e.hp=19*s; e.spd=62; e.dmg=9; e.xp=2; e.shooter=true; e.shootCd=Phaser.Math.FloatBetween(1.1,2.0); e.setCircle(17,5,5); }
    else if(type==='bomber'){ e.hp=24*s; e.spd=70; e.dmg=12; e.xp=2; e.bomber=true; e.setCircle(17,5,5); }
    else if(type==='dasher'){ e.hp=16*s; e.spd=70; e.dmg=14; e.xp=2; e.dasher=true; e.dashState='chase'; e.dashT=Phaser.Math.FloatBetween(0.6,1.6); e.setCircle(17,5,5); }  // สายพุ่งโฉบ (รูปจริง e_dasher 44px)
    else if(type==='siege'){ e.hp=260*s; e.spd=24; e.dmg=24; e.xp=10; e.siege=true; e.setCircle(34,4,4); scale=1.5; }  // ถึกโหด เดินบีบวงช้า ๆ (รูปจริง e_siege 76px)
    else { e.hp=19*s; e.spd=58; e.dmg=10; e.xp=1; e.setCircle(17,5,5); }
    const dmgCurve=[1,1.05,1.12,1.20,1.30,1.42][this.stageIndex]||1.42;e.dmg=Math.max(1,Math.round(e.dmg*dmgCurve*pg.enemyDmg*this.diffMul().dmg));
    if(this.stageIndex===0&&type!=='acid'){
      scale=(type==='tank'||type==='siege')?0.86:(type==='fast'||type==='dasher')?0.68:0.74;
      e.setCircle(type==='tank'||type==='siege'?25:20,type==='tank'||type==='siege'?23:28,type==='tank'||type==='siege'?23:28);
    }
    if(this.stageIndex===1){const role={basic:['Rotten Foam Spawn',0.64],fast:['Backflow Fiend',0.66],dasher:['Backflow Fiend',0.66],shooter:['Sewage Spitter Bubble',0.68],bomber:['Ferment Pressure Sac',0.70],tank:['Armored Grate Crab',0.76],siege:['Armored Grate Crab',0.76]}[type]||['Loose Pipe Bubble',0.64];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(type==='tank'||type==='siege'?38:30,type==='tank'||type==='siege'?26:34,type==='tank'||type==='siege'?26:34);}
    if(this.stageIndex===2){const role={basic:['Boiling Mochi Ember',0.62,24,40,46],fast:['Dashing Chili',0.58,20,44,50],dasher:['Dashing Chili',0.58,20,44,50],shooter:['Air-Gun Chili Grinder',0.66,24,40,45],bomber:['Chili Pressure Pot',0.68,26,38,42],tank:['Charcoal Furnace Golem',0.78,36,28,36],siege:['Charcoal Furnace Golem',0.90,36,28,36]}[type]||['Boiling Mochi Ember',0.62,24,40,46];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===3){const role={basic:['Frozen Sugar Spirit',0.62,24,40,46],fast:['Dashing Ice Shard',0.58,20,44,50],dasher:['Dashing Ice Shard',0.58,20,44,50],shooter:['Cold Syrup Turret',0.66,24,40,45],bomber:['Frost Pressure Bubble',0.68,27,37,41],tank:['Frozen Gate Warden',0.80,36,28,36],siege:['Frozen Gate Warden',0.92,36,28,36]}[type]||['Frozen Sugar Spirit',0.62,24,40,46];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===4){const role={basic:['Void Shard',0.36,45,83,83],fast:['Crown-Ripper Fiend',0.34,42,86,86],dasher:['Crown-Ripper Fiend',0.34,42,86,86],shooter:['Banquet Eye',0.38,45,83,83],bomber:['Bomb-Mouth Truffle',0.40,46,82,82],tank:['Crown Oven Guard',0.48,54,74,74],siege:['Crown Oven Guard',0.56,54,74,74]}[type]||['Void Shard',0.36,45,83,83];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    if(this.stageIndex===5){const role={basic:['Ferment Sprout',0.38,45,83,83],fast:['Vine Hunter',0.38,43,85,85],dasher:['Vine Hunter',0.38,43,85,85],shooter:['Spore Lantern',0.40,44,84,84],bomber:['Rotten Fruit Pod',0.42,47,81,81],tank:['Root-Back Beetle',0.48,53,75,75],siege:['Thorn Oracle',0.48,50,78,78]}[type]||['Ferment Sprout',0.38,45,83,83];
      e.roleName=role[0];e.tintColor=null;scale=role[1];e.clearTint();e.setCircle(role[2],role[3],role[4]);}
    e.isBoss=false; e.isMini=false; e.isElite=false; e.maxhp=e.hp; e.frozen=0; e.knock=0; e.baseScale=scale; e._sqX=1; e._sqY=1; e.setScale(scale);
    // เล่นอนิเมชันเดิน/ยิงถ้าเป็นชนิดที่มีชีต (ไม่งั้นหยุด anim ที่ค้างจาก pool + คืนเฟรมนิ่ง)
    if(this.anims.exists(key+'_walk')){ e.setFlipX(false); e.play(key+'_walk',true); }
    else if(e.anims){ e.anims.stop(); e.setFrame(this.stageIndex===5?ch2Frame:0); e.setFlipX(false); }
    if(e.tintColor)e.setTint(e.tintColor); else e.clearTint();
    this.camWorld(e);
    this.vfxSpawnPoof(x,y);
  }

  /* ---------- COMBAT ---------- */
  getBullet(x,y,tint,scale){
    let b=this.bullets.getFirstDead(false);
    if(!b) b=this.bullets.create(x,y,'proj_sprinkle');
    else { b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }
    if(!b){ b=this.bullets.getFirstAlive(); if(!b)return null; b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }   // pool Full → รีไซเคิลกระสุนที่เก่าสุด (กัน null.body crash ตอน x3)
    if(b.texture&&b.texture.key!=='proj_sprinkle')b.setTexture('proj_sprinkle');   // คืนรูป projectile เริ่มต้น (กันรูปสกิลก่อนหน้าค้างจาก pool)
    b.setScale(scale||1).setTint(tint||0xffffff).setRotation(0).setDepth(90000); if(b.body)b.body.setAllowGravity(false); this.camWorld(b);
    b.pierce=false; b.hitCd=0; b.hitGapV=0.16; b.boomer=false; b.returned=false;
    b.bounce=0; b.rebound=false; b.reb=0; b.spin=false; b.homing=0; b.explode=0; b.sticky=false; b.faceVel=false; b.chain=0;b.knockback=0;b.lockedTarget=null; b.bubblePrison=false; b.bubbleAwaken=false; b.iceNeedle=null; b.pierceLeft=0; b.shatterInfo=null; b.shatterState=null;
    return b;
  }
  // คูลดาวน์เกือบคงที่ — เลเวลอัพเน้น "Effect" ไม่ใช่ยิงถี่ขึ้น
  cdOf(key,lvl){
    let base=lvl>=SKILL_AWAKEN_LV?this._cdBase(key,SKILL_AWAKEN_LV)*0.85:this._cdBase(key,lvl);
    const sw=this.signatureWeaponInfo(),b=this.basicAttackInfo()?.skill===key?this.basicAttack:null;
    if(b&&this.character==='cocoa'&&key==='meteor')base=0.64;
    if(b&&this.character==='mint'&&key==='frost')base=Math.max(1.25,1.95-lvl*0.08);   // มินต์ = basic attack ยิงถี่ (แทนคูลดาวน์ frost ปกติที่ช้า)
    if(b&&this.character==='sesame'&&key==='mirror')base=Math.max(0.85,1.45-lvl*0.06);   // งาดำ = Mirror Beam ยิงเป็นจังหวะ (แทน pulse field เดิม)
    const basicRate=b?Math.pow(0.92,b.ranks.rate||0)*Math.pow(0.97,b.ranks.tempo||0)*(b.mutation==='rush'?0.82:1):1;
    return base*(sw.skill===key?(this.player.weaponCdMul||1):1)*basicRate;
  }
  _cdBase(key,lvl){
    switch(key){
      // สายยิงไว ดาเมจเบา (spam)
      case 'sprinkle': return Math.max(0.6,0.98-lvl*0.03);   // ไม่รัวเกินไป (สตรีมทีละนัด กระสุนเร็ว)
      case 'popcorn':  return Math.max(0.55,0.95-lvl*0.05);
      case 'aura':     return Math.max(0.60,1.0-lvl*0.04);
      case 'whirl':    return Math.max(1.05,1.7-lvl*0.07);
      case 'echoStep': return Math.max(1.6,2.4-lvl*0.08);
      // สายกลาง
      case 'fork':     return Math.max(1.1,1.7-lvl*0.08);
      case 'boomer':   return Math.max(1.3,2.0-lvl*0.07);
      case 'thunder':  return Math.max(1.4,2.2-lvl*0.08);
      case 'wave':     return Math.max(1.4,2.2-lvl*0.08);
      case 'mirror':   return Math.max(3.0,4.2-lvl*0.12);
      case 'thread':   return Math.max(2.5,3.6-lvl*0.10);
      // สายคุมพื้นที่/DoT (ออกช้า)
      case 'bubble':   return Math.max(1.4,2.2-lvl*0.10);
      case 'mine':     return Math.max(1.9,2.8-lvl*0.10);
      case 'cloud':    return Math.max(2.2,3.2-lvl*0.10);
      case 'frost':    return Math.max(3.0,4.2-lvl*0.14);
      case 'memory':   return Math.max(3.3,4.6-lvl*0.12);
      case 'decoy':    return Math.max(4.0,5.4-lvl*0.14);
      // สายนุ๊ก ดาเมจหนัก ออกช้า (heavy burst)
      case 'beam':     return Math.max(1.4,2.2-lvl*0.08);
      case 'rocket':   return Math.max(1.5,2.3-lvl*0.08);
      case 'meteor':   return Math.max(2.0,2.9-lvl*0.10);
      case 'triseal':  return Math.max(1.8,2.7-lvl*0.09);
      default: return 1.6;
    }
  }
  castSkill(key,lvl){
    const sw=this.signatureWeaponInfo(),weaponMul=sw.skill===key?(this.player.weaponDmgMul||1):1;
    const basic=this.basicAttackInfo()?.skill===key?this.basicAttack:null,basicDmg=basic?(1+(basic.ranks.power||0)*0.12+(basic.ranks.overdrive||0)*0.05):1;
    const dm=this.player.dmgMul*(BALANCE.skillPower[key]||1)*weaponMul*basicDmg, cf={}, aw=lvl>=SKILL_AWAKEN_LV; this.pulseSkill(key);   // cf ปิดแล้ว (เลิกระบบคอมโบ) — เหลือแต่ Awaken
    if(aw&&Math.random()<0.5)this.awakenSpark(key);
    const _castColors={sprinkle:0xffb6e1,star:0xffe08a,thunder:0xfff2a8,whirl:0x8fd0ff,boomer:0xf0a92e,frost:0x7fc9ff,popcorn:0xffed8a,bubble:0x80e8d0,aura:0xff9ec4,fork:0xcccccc,mine:0xff8fb5,beam:0xfff2a8,meteor:0xffa54d,cloud:0xb6f0d6,rocket:0xff5a6e,wave:0xbfe8ff,mirror:0x9fe8ff,memory:0xd59cff,thread:0xffc6df,decoy:0x8fe8d0,triseal:0xffd166,echoStep:0xbca7ff};
    this.vfxCastGlow(_castColors[key]||0xffffff);
    if(key==='meteor'&&basic&&this.character==='cocoa'){this.castCocoaCombo(lvl,dm,basic);return;}
    if(key==='sprinkle'){ if(!this.nearestEnemy(aw?900:640))return;
      // ปืนกล: รัวเมล็ดรุ้งเป็นชุด ยิงเร็ว/เบา · โดน 1 ตัวแล้วหายไปเลย (ไม่ทะลุ ไม่เด้ง) · เก็บทีละตัวรัว ๆ
      let shots=aw?16:lvl>=6?11:lvl>=4?7:lvl>=3?4:lvl>=2?2:1;   // เริ่มยิง 1 นัด แล้วค่อยเพิ่มตามเลเวล/อัปเกรด
      if(basic)shots=Math.min(12,shots+(basic.ranks.volley||0)+(basic.mutation==='fan'?2:0)+(basic.evolved?2:0));
      if(this.player.twinSprinkle) shots+=3;if(sw.skill===key)shots+=this.player.weaponShots||0;if(basic)shots=Math.min(12,shots);
      const RAINBOW=[0xff5a6e,0xff9e3d,0xffe14d,0x66e06a,0x5ad1ff,0x8f7bff,0xff7bd5];
      const speed=aw?1180:980, gap=aw?38:52;   // เร็ว + รัวถี่ (machine gun) ·s่งตรง ไม่โค้ง
      let idx=0;
      const fireOne=()=>{ if(this.state!=='play')return; const t=this.nearestEnemy(aw?900:640); if(!t)return;
        const shotIndex=idx++,sizeMul=basic?1+(basic.ranks.size||0)*0.14:1,b=this.getBullet(this.player.x,this.player.y,0xffffff,(0.12+lvl*0.008+(aw?0.03:0))*sizeMul); if(!b)return;   // ตัวเล็กลงอีก
        b.setTexture('proj_sprinkle').setTint(RAINBOW[shotIndex%RAINBOW.length]); b.faceVel=true;
        const evo=basic&&basic.evolved;
        b.dmg=(5+lvl*1.6)*dm*(aw?1.15:1)*(this.player.twinSprinkle?1.2:1)*(evo?1.35:1); b.life=aw?2.2:1.9; b.pierce=!!evo; b.hitGapV=evo?0.12:0.16; b.bounce=basic?(basic.mutation==='ricochet'?2:0):0; b.homing=0;   // พุ่งตรงเร็วเสมอ (ไม่ homing) · EVO = ทะลุทุกตัว (ไม่โค้งตามเป้า)
        const fan=basic&&basic.mutation==='fan'?(shotIndex-(shots-1)/2)*0.055:0,ang=Math.atan2(t.y-this.player.y,t.x-this.player.x)+fan+Phaser.Math.FloatBetween(-0.08,0.08);
        this.physics.velocityFromRotation(ang,speed,b.body.velocity); Sfx.shoot(); };
      fireOne(); for(let s=1;s<shots;s++)this.time.delayedCall(s*gap,fireOne); }
    else if(key==='thunder'){
      // Basic Attack ของตาโร่ (Rift Bolt Compass): arc=จำนวนชิ่ง · surge=จำนวนจุดฟาด · chainlord/stormcaller=สายกลายรูป
      const tEvo=basic&&basic.evolved;   // EVO: พายุสายฟ้าทั้งจอ — ฟาดหลายจุด + ชิ่งไกล/ยาวขึ้นมาก
      const bArc=(basic?.ranks.arc||0)+(basic?.mutation==='chainlord'?2:0)+(tEvo?3:0), bSurge=(basic?.ranks.surge||0)+(basic?.mutation==='stormcaller'?2:0)+(tEvo?2:0);
      const bChainRange=(basic?.mutation==='chainlord'?1.4:1)*(tEvo?1.5:1), bDmgMut=(basic?.mutation==='stormcaller'?1.2:1)*(tEvo?1.2:1);
      const strikes=(aw?3:lvl>=4?2:1)+bSurge, chain=(aw?5:lvl>=5?3:lvl>=3?2:1)+(sw.skill===key?(this.player.weaponChains||0):0)+bArc, dmg=(14+lvl*4.2)*dm*(cf.storm?1.4:1)*(aw?1.15:1)*bDmgMut;
      const cand=[]; this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<(aw?760:520)) cand.push(e); });
      cand.sort((a,b)=>this.dist(a.x,a.y,this.player.x,this.player.y)-this.dist(b.x,b.y,this.player.x,this.player.y));   // เล็งตัวใกล้สุดก่อน (เดิมเล็ง HP สูง = ผ่ามั่ว)
      this.hitCratesInRadius(this.player.x,this.player.y,aw?760:520,dmg);   // ฟ้าผ่าก็ทุบกล่องในระยะ
      for(let i=0;i<Math.min(strikes,cand.length);i++){ let e=cand[i]; this.zap(e.x,e.y); this.damage(e,dmg,e.x,e.y);
        let from=e; const hit=new Set([e]);
        for(let c=0;c<chain;c++){ let nb=null,nd=((aw?210:150)*bChainRange)**2;
          this.enemies.children.iterate(o=>{ if(o&&o.active&&!hit.has(o)){ const d=(o.x-from.x)**2+(o.y-from.y)**2; if(d<nd){nd=d;nb=o;} } });
          if(!nb)break; this.chainBolt(from.x,from.y,nb.x,nb.y); this.damage(nb,dmg*0.7,nb.x,nb.y); hit.add(nb); from=nb; } }
      Sfx.zap(); }
    else if(key==='whirl'){ const cnt=aw?16:lvl>=6?12:lvl>=4?10:lvl>=2?8:6, dmg=(4+lvl*1.8)*dm*(aw?1.15:1);
      const big=(lvl>=3?1.4:1.1)*(aw?1.2:1), speed=(lvl>=3?340:300)*(aw?1.2:1), pierce=lvl>=6||aw, tint=aw?0xffd166:0x8fd0ff; this.whirlAng+=0.5;
      for(let i=0;i<cnt;i++){ const ang=this.whirlAng+(i/cnt)*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.32+lvl*0.018+(aw?0.08:0)); b.setTexture('proj_whirl').setTint(0xffffff); b.spin=true; b.dmg=dmg; b.life=aw?1.3:0.95; b.pierce=pierce; b.hitGapV=0.14;
        this.physics.velocityFromRotation(ang,speed,b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='boomer'){ const cnt=aw?6:lvl>=6?4:lvl>=4?3:lvl>=2?2:1, dmg=(8+lvl*2.6)*dm*(aw?1.15:1);
      const big=(1.4+lvl*0.1)*(aw?1.2:1), rebound=lvl>=5||aw; let gap=lvl>=3?0.10:0.16; if(cf.ricochet)gap*=0.7; if(aw)gap*=0.7;
      for(let s=0;s<cnt;s++){ const t=this.nearestEnemy(760);
        const base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle(), ang=base+(s-(cnt-1)/2)*0.4;
        const b=this.getBullet(this.player.x,this.player.y,aw?0xffcf70:0xd9a066,big); b.dmg=dmg; b.life=2.0; b.pierce=true; b.hitGapV=gap;
        if(this.textures.exists('proj_boomer')){ b.setTexture('proj_boomer').setTint(0xffffff).setScale(0.5+lvl*0.05); }
        b.boomer=true; b.bt=0; b.bdur=0.44; b.rebound=rebound; b.spin=true; if(aw)b.reb=-1;   // reb=-1 → เด้งได้ 2 Waitบ (0,1)
        this.physics.velocityFromRotation(ang,430,b.body.velocity); } Sfx.shoot(); }
    else if(key==='frost'){
      // Basic Attack ของมินต์ = "Frost Lance" หอกน้ำแข็งทะลุแนว + สายธาร DoT/ชะลอ — frost nova เดิมยังใช้กับสกิลทั่วไปตัวอื่น
      if(basic&&this.character==='mint'){ this.castFrostLance(lvl,aw,dm,basic); return; }
      const df=this.player.deepFreeze?1.4:1,wm=sw.skill===key?(this.player.weaponAreaMul||1):1,wc=sw.skill===key?(this.player.weaponControlMul||1):1;
      // Basic Attack ของมินต์ (Frost Core Nova): chill=รัศมี · linger=ระยะเวลา · blizzard/permafrost=สายกลายรูป
      const bChill=1+(basic?.ranks.chill||0)*0.12*(basic?.mutation==='blizzard'?1:1)+(basic?.mutation==='blizzard'?0.25:0);
      const bLinger=(1+(basic?.ranks.linger||0)*0.15)*(basic?.mutation==='permafrost'?1.5:1);
      const fEvo=basic&&basic.evolved;   // EVO (Glacier Sovereign): โนวาสองระลอก + แตกน้ำแข็งเสมอ + วงใหญ่ขึ้น
      const bShatterDmg=basic?.mutation==='permafrost'?1.4:1, bAlwaysShatter=(basic?.mutation==='blizzard')||fEvo;
      const r=(150+lvl*16)*(aw?1.6:1)*df*wm*bChill*(fEvo?1.25:1), dur=(1.1+lvl*0.24)*(aw?1.3:1)*df*wc*bLinger, dmg=(6+lvl*2.4)*dm*(aw?1.2:1)*df, shatter=lvl>=3||aw||this.player.deepFreeze||bAlwaysShatter;
      if(fEvo)this.time.delayedCall(240,()=>{ if(this.state!=='play')return; const r2=r*1.15;
        if(this.textures.exists('fx_frostnova')&&this.anims.exists('fx_frostnova'))this.spawnFxAnim('fx_frostnova',this.player.x,this.player.y,{scale:(2*r2)/ASSET_FX.fx_frostnova.fw*0.82,depth:3,anchor:'center',alpha:0.7});
        this.enemies.children.iterate(e=>{ if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>=r2)return;
          if(e.frozen>0){ this.damage(e,(16+lvl*4)*dm*df*bShatterDmg,e.x,e.y); this.burst(e.x,e.y,0x8fd0ff); }
          if(!e.isBoss&&!e.isMini){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }
          this.damage(e,(e.isBoss||e.isMini)?dmg*1.7:dmg,e.x,e.y); }); this.hitCratesInRadius(this.player.x,this.player.y,r2,Math.max(dmg,10)); Sfx.frost(); });
      if(this.textures.exists('fx_frostnova')&&this.anims.exists('fx_frostnova')) this.spawnFxAnim('fx_frostnova',this.player.x,this.player.y,{scale:(2*r)/ASSET_FX.fx_frostnova.fw*0.82,depth:3,anchor:'center',alpha:Math.min(1,0.5+lvl*0.1)});
      else if(this.textures.exists('fx_frost')) this.fxBurst('fx_frost',this.player.x,this.player.y,r,aw?520:380,true);
      else { const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,12,COLORS.ice,0.4).setDepth(3));
        this.tweens.add({targets:ring,radius:r,alpha:0,duration:320,onComplete:()=>ring.destroy()}); }
      this.enemies.children.iterate(e=>{ if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>=r)return;
        if(shatter&&e.frozen>0){ this.damage(e,(16+lvl*4)*dm*df*bShatterDmg,e.x,e.y); this.burst(e.x,e.y,0x8fd0ff); }
        if(!e.isBoss&&!e.isMini){ e.frozen=dur; e.setVelocity(0,0); e.setTint(COLORS.ice); }
        this.damage(e,(e.isBoss||e.isMini)?dmg*1.7:dmg,e.x,e.y); }); this.hitCratesInRadius(this.player.x,this.player.y,r,Math.max(dmg,10)); Sfx.frost(); }   // บอส/มินิแช่ไม่ได้ → ชดเชยด้วยดาเมจเย็นเจาะเกราะ (แก้ Mint สู้มินิยาก)
    else if(key==='popcorn'){ const cnt=aw?18:lvl>=4?10:lvl>=2?7:5, dmg=(7+lvl*2.3)*dm*(aw?1.12:1);
      const speed=(lvl>=5?430:350)*(aw?1.2:1), bounce=aw?1:0;
      for(let i=0;i<cnt;i++){ const ang=Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.27+lvl*0.018+(aw?0.07:0)); b.setTexture('proj_popcorn').setTint(0xffffff); b.faceVel=true; b.dmg=dmg; b.life=aw?1.05:0.72; b.pierce=false; b.bounce=bounce;b.knockback=aw?430:300; b.spin=true; b.hitGapV=0.12;
        this.physics.velocityFromRotation(ang,speed*(0.7+Math.random()*0.5),b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='bubble'){ const cnt=aw?7:lvl>=4?3:lvl>=2?2:1, dmg=(8+lvl*2.3)*dm*(cf.fizz?1.25:1)*(aw?1.15:1);
      const big=(lvl>=3?1.35:1.12)*(cf.fizz?1.2:1)*(aw?1.25:1);
      const target=this.strongestEnemy(760);for(let s=0;s<cnt;s++){ const ang=target?Math.atan2(target.y-this.player.y,target.x-this.player.x)+(s-(cnt-1)/2)*0.13:Math.random()*Math.PI*2;
        const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.30+lvl*0.02+(aw?0.07:0));
        if(!b)continue; b.dmg=dmg; b.life=2.8; b.pierce=false; b.homing=aw?520:(lvl>=4?390:280);
        b.bubblePrison=true; b.bubbleAwaken=aw; b.bubbleLevel=lvl; b.bubbleRadius=(62+lvl*9)*(aw?1.3:1);b.lockedTarget=target;
        if(this.textures.exists('bubble'))b.setTexture('bubble').setTint(0xffffff);
        this.physics.velocityFromRotation(ang,165,b.body.velocity); }
      Sfx.shoot(); }
    else if(key==='aura'){ this.ensureAuraFx();   // ออร่าถาวร: sprite วนลูป + tick ดาเมจใน update (tickAura) ไม่ยิงเป็นครั้ง ๆ
      if(!(this.textures.exists('fx_aura')&&this.anims.exists('fx_aura'))){ const r=((60+lvl*16)*(aw?1.3:1)), dmg=(5+lvl*2)*dm*(aw?1.2:1);   // fallback ถ้าNoneอาร์ต
        const ring=this.camWorld(this.add.circle(this.player.x,this.player.y,r,0xff9ec4,0.10).setDepth(3).setStrokeStyle(2,0xffb6e1,0.55));
        this.tweens.add({targets:ring,alpha:0,scale:1.06,duration:300,onComplete:()=>ring.destroy()});
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<r){ this.damage(e,dmg,e.x,e.y);
          if(aw&&!e.isBoss){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); e.setVelocity(Math.cos(a)*140,Math.sin(a)*140); e.knock=0.15; } } }); this.hitCratesInRadius(this.player.x,this.player.y,r,dmg); } }
    else if(key==='fork'){ const cnt=aw?10:lvl>=4?5:lvl>=2?3:2, dmg=(9+lvl*3)*dm*(aw?1.15:1);
      const t=this.nearestEnemy(760), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
      for(let s=0;s<cnt;s++){ const ang=base+(s-(cnt-1)/2)*(aw?0.075:0.16);
        const b=this.getBullet(this.player.x,this.player.y,0xeaeaff,1.15+lvl*0.08); b.dmg=dmg; b.life=1.4; b.pierce=true; b.hitGapV=0.12; b.chain=aw?3:(lvl>=4?2:0);   // ส้อมทะลุ + ลูกโซ่ไฟฟ้า
        if(this.textures.exists('proj_fork')){ b.setTexture('proj_fork').setTint(0xffffff).setScale(0.85); b.faceVel=true; } else b.spin=true;
        this.physics.velocityFromRotation(ang,560,b.body.velocity); } Sfx.shoot(); }
    else if(key==='mine'){ const cnt=aw?3:lvl>=4?2:1;
      const r=(76+lvl*9)*(aw?1.25:1), dmg=(7+lvl*2.2)*dm*(aw?1.15:1);
      for(let m=0;m<cnt;m++)this.deployCupcakeSentry(
        this.player.x+Phaser.Math.Between(-48,48),this.player.y+Phaser.Math.Between(-48,48),lvl,aw,dmg,r,m*90);
    }
    else if(key==='beam'){ const t=this.nearestEnemy(900); if(!t)return;
      const beams=aw?3:1, len=(760+lvl*30)*(aw?1.25:1), wide=(12+lvl*3)*(aw?1.2:1), dmg=(11+lvl*3.6)*dm*(aw?1.15:1);
      const base=Math.atan2(t.y-this.player.y,t.x-this.player.x);
      for(let k=0;k<beams;k++) this.fireBeam(base+(k-(beams-1)/2)*0.18,len,wide,dmg); Sfx.zap(); }
    else if(key==='meteor'){ this.castBearDonut(lvl,aw,dm,basic&&basic.evolved,basic); }
    else if(key==='mirror'){
      // งาดำเป็น aura ถาวร (tickCharSignature) แล้ว → "cast" = พัลส์กระจกกระแทกในเขต (ไม่ยิง projectile)
      if(basic&&this.character==='sesame'){ this.castMirrorBeam(lvl,aw,dm,basic); return; }
      this.castMirrorGlaze(lvl,aw,dm,basic); }
    else if(key==='memory'){ this.castMemoryJam(lvl,aw,dm); }
    else if(key==='thread'){ this.castFlavorThread(lvl,aw,dm); }
    else if(key==='decoy'){ this.castCoreDecoy(lvl,aw,dm); }
    else if(key==='triseal'){ this.castTriadSeal(lvl,aw,dm); }
    else if(key==='echoStep'){ this.castEchoStep(lvl,aw,dm); }
    else if(key==='cloud'){ const t=this.densestEnemy(620)||this.player, cx=t.x, cy=t.y;
      const r=(70+lvl*12)*(aw?1.3:1), dmg=(3+lvl*1.2)*dm*(aw?1.2:1), dur=(aw?4:2+lvl*0.3);
      const cloud=this.camWorld(this.add.image(cx,cy,'vfx_cloud_field').setDepth(2).setScale((r*2)/256*0.5).setAlpha(0.78));
      this.tweens.add({targets:cloud,scale:(r*2)/256,duration:300});
      if(this.textures.exists('fx_vortex')&&this.anims.exists('fx_vortex')) this.spawnFxAnim('fx_vortex',cx,cy,{scale:(2*r)/ASSET_FX.fx_vortex.fw,depth:3,anchor:'center'});
      const ticks=Math.max(1,Math.floor(dur/0.3));
      for(let k=1;k<=ticks;k++) this.time.delayedCall(k*300,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(cx,cy,r,dmg); });
      this.tweens.add({targets:cloud,alpha:0,delay:Math.max(0,dur*1000-350),duration:400,onComplete:()=>cloud.destroy()}); Sfx.frost(); }
    else if(key==='rocket'){ const cnt=Math.min(5,(aw?5:lvl>=4?3:lvl>=2?2:1)+(basic?(basic.ranks.cluster||0)+(basic.evolved?1:0):0)), sizeMul=basic?1+(basic.ranks.size||0)*0.14:1, dmg=(14+lvl*4)*dm*(aw?1.15:1)*(basic&&basic.mutation==='seeker'?1.2:1), er=(54+lvl*7)*(aw?1.2:1)*sizeMul*(basic&&basic.mutation==='sticky'?1.35:1)*(basic&&basic.evolved?1.18:1);
      for(let s=0;s<cnt;s++){ const t=this.strongestEnemy(780), base=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):this.moveDir.angle();
        const b=this.getBullet(this.player.x,this.player.y,0xff8b6b,(1.3+lvl*0.08)*sizeMul); b.dmg=dmg; b.life=2.2; b.homing=(aw?520:360)*(basic&&basic.mutation==='seeker'?1.65:1); b.explode=er;b.lockedTarget=t;b.sticky=!!(basic&&basic.mutation==='sticky');
        if(this.textures.exists('proj_rocket')){ b.setTexture('proj_rocket').setTint(0xffffff).setScale(0.7*sizeMul); b.faceVel=true; } else b.spin=true;
        this.physics.velocityFromRotation(base+(s-(cnt-1)/2)*0.3,300,b.body.velocity); } Sfx.shoot(); }
    else if(key==='wave'){ const rings=aw?3:1, maxR=(165+lvl*22)*(aw?1.2:1), dmg=(4+lvl*1.5)*dm*(aw?1.15:1);
      for(let k=0;k<rings;k++) this.creamWave(maxR,dmg,k*180,aw?520:390); Sfx.boom(); }
  }
  castCocoaCombo(lvl,dm,basic){
    const now=this.elapsed||0;if(now-(basic.lastComboAt||-9)>1.45)basic.comboStep=0;
    const step=(basic.comboStep||0)+1;basic.comboStep=step>=3?0:step;basic.lastComboAt=now;
    const target=this.nearestEnemy(230),ang=target?Math.atan2(target.y-this.player.y,target.x-this.player.x):(this.moveDir?.angle()||0);
    const sizeMul=1+(basic.ranks.size||0)*0.12,reach=(step===3?142:step===2?118:100)*sizeMul,arc=(step===1?1.30:step===2?2.15:TAU)*(basic.mutation==='rush'&&step===2?1.18:1);
    const finisherMul=1+(basic.ranks.combo||0)*0.18,mutationMul=basic.mutation==='breaker'&&step===3?1.25:1,evoMul=basic.evolved?1.16:1;
    const amount=(8+lvl*1.7)*(step===1?0.78:step===2?1.02:1.62)*dm*(step===3?finisherMul:1)*mutationMul*evoMul;
    const strike=(radius,mul=1)=>{this.enemies.children.iterate(e=>{if(!e||!e.active)return;const dx=e.x-this.player.x,dy=e.y-this.player.y,dist=Math.hypot(dx,dy),inside=step===3?dist<=radius:(dist<=radius&&Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(dy,dx)-ang))<=arc/2);if(!inside)return;this.damage(e,amount*mul,e.x,e.y);if(step===3&&e.active&&!e.isBoss&&!e.isMini){e.setVelocity(Math.cos(Math.atan2(dy,dx))*260,Math.sin(Math.atan2(dy,dx))*260);e.knock=0.20;}});this.hitCratesInRadius(this.player.x,this.player.y,radius,amount*mul);};
    this.player.setFlipX(Math.cos(ang)<0);
    if(step<3){
      const slash=this.camWorld(this.add.graphics().setDepth(7));slash.lineStyle(step===1?7:10,step===1?0xd7b8ff:0xffc477,0.92);slash.beginPath();slash.arc(this.player.x,this.player.y,reach*0.78,ang-arc/2,ang+arc/2,false);slash.strokePath();this.tweens.add({targets:slash,alpha:0,duration:170,onComplete:()=>slash.destroy()});
      this.vfxHitRing(this.player.x+Math.cos(ang)*reach*0.72,this.player.y+Math.sin(ang)*reach*0.72,step===1?0xd7b8ff:0xffc477,false);strike(reach);Sfx.shoot();
    }else{
      const wave=()=>{if(this.textures.exists('vfx_bear_shockwave')){const fx=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_bear_shockwave').setDepth(6).setScale(0.16).setAlpha(0.88));this.tweens.add({targets:fx,scale:(reach*2.35)/256,alpha:0,duration:330,onComplete:()=>fx.destroy()});}else this.vfxHitRing(this.player.x,this.player.y,0xffa54d,true);};
      wave();strike(reach);this.burst(this.player.x,this.player.y,0xffa54d);this.screenShake(95,0.0035);Sfx.boom();
      if(basic.mutation==='breaker'||basic.evolved)this.time.delayedCall(210,()=>{if(this.state!=='play')return;wave();strike(reach*(basic.evolved?1.18:1.06),basic.evolved?0.72:0.55);});
      if(basic.evolved){const heal=Math.max(1,this.player.maxhp*0.02);this.player.hp=Math.min(this.player.maxhp,this.player.hp+heal);}
    }
  }
  castBearDonut(lvl,aw,dm,evo,basic){
    // โกโก้ = ต่อยประชิด 2 หมัด (base) · คลื่นสะท้อน (shockwave) ต้อง Mutation 'breaker' หรือ Awaken/Evo ถึงจะมี
    const breaker=basic?.mutation==='breaker', wave=breaker||!!evo||aw;
    const sig=this.player.donutImpact?1.28:1,wm=this.signatureWeaponInfo().skill==='meteor'?(this.player.weaponAreaMul||1):1,hits=2+(aw?2:0)+(evo?2:0), r=(68+lvl*8)*(aw?1.22:1)*sig*wm*(evo?1.2:1);
    const dmg=(12+lvl*3.5)*dm*(aw?1.1:1)*sig;
    for(let i=0;i<hits;i++)this.time.delayedCall(i*170,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const t=this.nearestEnemy(620),x=t?t.x+Phaser.Math.Between(-20,20):this.player.x+Phaser.Math.Between(-190,190),y=t?t.y+Phaser.Math.Between(-20,20):this.player.y+Phaser.Math.Between(-190,190);
      const donut=this.camWorld(this.add.image(x,y-190,'proj_bear_donut').setDepth(90001).setScale(0.34).setAlpha(0.95));
      this.tweens.add({targets:donut,y,scale:0.58,duration:210,ease:'Quad.in',onComplete:()=>{donut.destroy();this.bearDonutImpact(x,y,r,dmg,(i===hits-1||!!evo)&&wave,aw);}});
    }); Sfx.shoot();
  }
  bearDonutImpact(x,y,r,dmg,final,aw){
    this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.damage(e,dmg,e.x,e.y);});
    this.hitCratesInRadius(x,y,r,dmg);this.burst(x,y,0xc97932);
    const glaze=this.camWorld(this.add.image(x,y,'vfx_choco_glaze').setDepth(2).setScale((r*2)/256).setAlpha(0.76));
    const ticks=aw?8:5;for(let n=1;n<=ticks;n++)this.time.delayedCall(n*260,()=>{if(!glaze.active)return;
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r){this.damage(e,dmg*0.12,e.x,e.y);if(!e.isBoss&&!e.isMini)e.frozen=Math.max(e.frozen||0,0.10);}});
    });
    this.tweens.add({targets:glaze,alpha:0,delay:ticks*260,duration:300,onComplete:()=>glaze.destroy()});
    if(final){const wave=this.camWorld(this.add.image(x,y,'vfx_bear_shockwave').setDepth(4).setScale(0.18).setAlpha(0.92));
      this.tweens.add({targets:wave,scale:(r*3.4)/256,alpha:0,duration:430,onComplete:()=>wave.destroy()});
      this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r*1.7)this.damage(e,dmg*(aw?1.05:0.8),e.x,e.y);});Sfx.boom();}
  }
  // 🪞 งาดำ Basic Attack: พัลส์กระจกกระแทกในเขตวงเวทถาวร (ไม่ยิง projectile) — ทำงานคู่กับ aura ใน tickCharSignature
  // 🪞 Mirror Beam — งาดำยิง "ลำแสงกระจก" ใส่เป้า (ดาเมจเต็มกับบอส · แรงขึ้นตาม Focus ที่ชาร์จจากการยืนนิ่ง)
  // แก้ปัญหางาดำเอาบอสไม่อยู่: field เดิม tick เบา → beam ลงดาเมจก้อนใหญ่ single-line เจาะทะลุ โดนบอสเต็ม
  castMirrorBeam(lvl,aw,dm,basic){
    const evo=basic&&basic.evolved;
    // เล็งบอส/มินิก่อน (นี่คือจุดขายใหม่) ไม่งั้นเล็งตัวใกล้สุด
    let t=null,td=1e9; this.enemies.children.iterate(e=>{ if(!e||!e.active||!(e.isBoss||e.isMini))return; const d=this.dist(e.x,e.y,this.player.x,this.player.y); if(d<td){td=d;t=e;} });
    if(!t)t=this.nearestEnemy(1300);
    const ang=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):((this.moveDir&&(this.moveDir.x||this.moveDir.y))?this.moveDir.angle():(this._sesBeamAng||0));
    this._sesBeamAng=ang;
    const focus=this._sesFocus||0, focusMul=1+focus*0.9;   // ยืนนิ่งชาร์จ Focus → ลำแสงแรงขึ้นถึง +90%
    const bRad=1+(basic?.ranks.radius||0)*0.12, bPane=basic?.ranks.pane||0, bPow=basic?.ranks.power||0;
    const len=(360+lvl*26)*bRad*(aw?1.2:1)*(evo?1.15:1);
    const wide=(18+lvl*1.6+bPane*3+focus*10)*(basic?.mutation==='fortress'?1.3:1);
    const dmg=(20+lvl*6)*dm*(1+bPow*0.12)*focusMul*(evo?1.3:1)*(aw?1.25:1)*(basic?.mutation==='retaliate'?1.25:1);
    const beams=1+(evo?1:0)+(aw?1:0)+Math.min(2,bPane)+(this.player.mirrorWard?1:0), spread=0.13;   // Lv1 ลำเดียว · pane/awaken/evo/unique = เพิ่มลำ (พัดเล็กน้อย)
    for(let k=0;k<beams;k++){ const a=ang+(k-(beams-1)/2)*spread; this.fireBeam(a,len,wide,k===0?dmg:dmg*0.7); }   // ลำหลัก (k0) เล็งตรงเป้า ดาเมจเต็ม
    // คงบทบาทป้องกัน: ลบกระสุนศัตรูรอบตัวเล็กน้อย (ward)
    this.foeBullets.children.iterate(f=>{ if(f&&f.active&&this.dist(f.x,f.y,this.player.x,this.player.y)<70){ this.vfxHitRing(f.x,f.y,0xf4e7bd,false); this.killFoe(f); } });
    this.vfxHitRing(this.player.x,this.player.y,focus>0.6?0xffe08a:0xf4e7bd,true); Sfx.zap();
  }
  // ❄️ Mint active cast: สะบัดเกล็ดน้ำแข็งกระเด็นออกWaitบทิศ (เจาะ+แช่) · คู่กับเกล็ดโคจรใน tickCharSignature
  // ❄️ Frost Lance (Shatter Lance) — ชาร์จสั้น ๆ พุ่งหอกเจาะทะลุ แล้ว "shatters into ice shards" กระจายที่ปลายทาง (แบบลูกซอง)
  castFrostLance(lvl,aw,dm,basic){
    const evo=basic&&basic.evolved, permafrost=basic?.mutation==='permafrost', blizzard=basic?.mutation==='blizzard';
    const t=this.nearestEnemy(1000);
    const ang=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):((this.moveDir&&(this.moveDir.x||this.moveDir.y))?this.moveDir.angle():(this._lanceAng||0));
    this._lanceAng=ang;
    const dmg=(16+lvl*4)*dm*(aw?1.2:1)*(permafrost?1.15:1);
    const range=(340+lvl*22)*(aw?1.28:1)*(1+(basic?.ranks.chill||0)*0.1);
    const lances=evo?3:(lvl>=4?2:1), spread=0.16, centerL=(lances-1)/2, flightT=range/900;   // Lv1 หอกเดียว · Lv4+ 2 หอก · evo 3 หอก (ยิงตรง ไม่โฮมมิ่ง)
    // จำนวน/สเปกสะเก็ด — chill=+จำนวน · linger=+จำนวน+กระจายกว้าง · evo แบ่งต่อแฉกให้ไม่ล้น
    const shardBase=6+Math.min(4,(basic?.ranks.chill||0))+Math.min(4,(basic?.ranks.linger||0))+(aw?3:0);
    const shardPer=evo?Math.max(3,Math.round(shardBase*0.55)):shardBase;
    const shardDmg=dmg*0.55, shardFreeze=(0.45+lvl*0.05)*(permafrost?1.7:1), shardFB=permafrost?1.4:1.2;
    // ท่าชาร์จ (ทางภาพ): เรืองแสงหุบเข้าที่ปลายหอกก่อนพุ่ง
    const chg=this.camWorld(this.add.image(this.player.x+Math.cos(ang)*26,this.player.y+Math.sin(ang)*26,'vfx_glow').setTint(0x9fe8ff).setDepth(this.player.y+2).setScale(0.55).setAlpha(0.9));
    this.tweens.add({targets:chg,scale:0.12,alpha:0,duration:150,onComplete:()=>chg.destroy()});
    const lanceKey=this.textures.exists('proj_frostlance')?'proj_frostlance':'proj_boomer';
    for(let L=0;L<lances;L++){ const a=ang+(L-centerL)*spread;
      const st={done:false};   // แต่ละหอกแตกได้ครั้งเดียว (กระทบเป้า หรือสุดระยะ)
      // หอกวิ่ง — แตกทันทีที่กระทบเป้าตัวแรก (burst monster)
      const b=this.getBullet(this.player.x,this.player.y,0xffffff,0.5); if(b){
        b.setTexture(lanceKey).setTint(0xcaf3ff).setScale(0.4+lvl*0.028); b.faceVel=true; b.dmg=dmg; b.life=flightT+0.2; b.hitGapV=0.1; b.homing=0;   // ยิงตรง ไม่ตามเป้า + หอกเล็กลง
        b.iceNeedle={freeze:0.6*(permafrost?1.6:1),frozenBonus:permafrost?1.4:1.2,shatter:blizzard||evo,dmg,lvl};
        b.shatterState=st; b.shatterInfo={count:shardPer,dmg:shardDmg,freeze:shardFreeze,fb:shardFB,blizzard,lvl,ang:a};
        this.physics.velocityFromRotation(a,900,b.body.velocity); }
      // ถ้าพลาดทุกตัว → แตกที่สุดระยะ (fallback)
      const ex=this.player.x+Math.cos(a)*range, ey=this.player.y+Math.sin(a)*range;
      this.time.delayedCall(flightT*1000,()=>{ if(!st.done){ st.done=true; this.frostShatterBurst(ex,ey,a,shardPer,shardDmg,shardFreeze,shardFB,blizzard,lvl); } });
    }
    this.hitCratesInRadius(this.player.x,this.player.y,range,dmg); Sfx.frost();
  }
  // แตกสะเก็ดน้ำแข็งที่ปลายหอก: โนวาวาบ + ยิงสะเก็ดกระจาย(เจาะ+แช่)
  frostShatterBurst(x,y,baseAng,count,sdmg,freeze,fb,blizzard,lvl){
    if(this.state!=='play'&&this.state!=='levelup')return;
    this.burst(x,y,0x8fd0ff);
    const bloomR=118+lvl*8+(blizzard?40:0);
    const ring=this.camWorld(this.add.image(x,y,'vfx_glow').setTint(0xbdf0ff).setDepth(6).setScale(0.2).setAlpha(0.9));
    this.tweens.add({targets:ring,scale:bloomR/60,alpha:0,duration:300,onComplete:()=>ring.destroy()});
    // การันตีโดน: ระเบิดน้ำแข็ง AoE ในรัศมี (ดาเมจ + แช่) — แก้ปัญหา "ไม่ค่อยโดน"
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; if(this.dist(e.x,e.y,x,y)>bloomR)return;
      this.damage(e,sdmg*1.6*((e.isBoss||e.isMini)?0.6:1),e.x,e.y);
      if(!e.isBoss&&!e.isMini){ e.frozen=Math.max(e.frozen||0,freeze*1.2); e.setVelocity(e.body.velocity.x*0.25,e.body.velocity.y*0.25); e.setTint(COLORS.ice); }
    });
    const arc=Math.PI*1.15;   // สะเก็ดกระจายพัดกว้าง + โฮมมิ่ง = ตามเก็บตัวรอบนอก
    for(let i=0;i<count;i++){ const a=baseAng+(i/(count-1||1)-0.5)*arc+Phaser.Math.FloatBetween(-0.08,0.08);
      const b=this.getBullet(x,y,0xffffff,0.28); if(!b)break;
      b.setTexture('proj_sprinkle').setTint(0xcaf3ff); b.faceVel=true; b.dmg=sdmg; b.life=0.55; b.pierce=true; b.hitGapV=0.1; b.homing=260;
      b.iceNeedle={freeze,frozenBonus:fb,shatter:blizzard,dmg:sdmg,lvl};
      this.physics.velocityFromRotation(a,520+Math.random()*120,b.body.velocity); }
    this.hitCratesInRadius(x,y,bloomR,sdmg);
  }
  // ประมวลผลIce Torrent: ทุก 0.4s ทำ DoT + ชะลอ (frozen สั้น ๆ เป็นจังหวะ = สโลว์) ให้ศัตรูในปล้อง แล้วค่อย ๆ จาง
  tickFrostStreams(dt){
    if(!this._frostStreams||!this._frostStreams.length)return;
    for(let i=this._frostStreams.length-1;i>=0;i--){ const st=this._frostStreams[i];
      st.life-=dt; st.tick-=dt;
      if(st.img&&st.img.active)st.img.setAlpha(0.30*Math.max(0,st.life/st.max)+0.05);
      if(st.tick<=0){ st.tick=0.4; const r2=st.r*st.r;
        this.enemies.children.iterate(e=>{ if(!e||!e.active)return; if((e.x-st.x)**2+(e.y-st.y)**2>r2)return;
          this.damage(e,st.dmg*((e.isBoss||e.isMini)?1.25:1),e.x,e.y);
          if(!e.isBoss&&!e.isMini){ e.frozen=Math.max(e.frozen||0,st.slow); e.setTint(COLORS.ice);
            if(st.shatter&&(e.frozen||0)>0&&Math.random()<0.2){ this.burst(e.x,e.y,0x8fd0ff); this.damage(e,st.dmg*0.7,e.x,e.y); } } }); }
      if(st.life<=0){ if(st.img&&st.img.active)st.img.destroy(); this._frostStreams.splice(i,1); }
    }
  }
  castMirrorGlaze(lvl,aw,dm,basic){
    const wm=this.signatureWeaponInfo().skill==='mirror'?(this.player.weaponAreaMul||1):1,wr=this.signatureWeaponInfo().skill==='mirror'?(this.player.weaponReflect||0):0;
    // Basic Attack ของงาดำ (Oath Mirror Field): radius=รัศมี · pane=จำนวนสะท้อน · fortress/retaliate=สายกลายรูป
    const bRad=(1+(basic?.ranks.radius||0)*0.12)*(basic?.mutation==='fortress'?1.25:1);
    const bPane=(basic?.ranks.pane||0)*2, bDur=basic?.mutation==='fortress'?1.3:1, bPierce=basic?.mutation==='retaliate', bDmgMut=basic?.mutation==='retaliate'?1.3:1;
    const mEvo=basic&&basic.evolved;   // EVO (Absolute Oath Mirror): กระจกยิงลำแสงสวนเองทุกจังหวะ (ไม่ต้องWaitโดนกระสุน) + วง/สะท้อนมากขึ้น
    const r=(125+lvl*15)*(this.player.mirrorWard?1.22:1)*(aw?1.2:1)*wm*bRad*(mEvo?1.2:1),duration=(1.15+lvl*0.14+(aw?0.8:0))*1000*bDur*(mEvo?1.35:1),max=3+lvl+(aw?5:0)+(this.player.mirrorWard?3:0)+wr+bPane+(mEvo?6:0);
    // Mirror Glaze ต้องอ่านเป็นเกราะสะท้อน ไม่ใช่อัลติ: วงบาง ค่อย ๆ หายใจ และNoneสายฟ้าซ้อนสนาม
    const ring=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_magic_circle').setTint(0x9fe8ff).setDepth(5).setDisplaySize(r*2,r*2).setAlpha(0.42));
    this.tweens.add({targets:ring,rotation:Math.PI*0.55,scaleX:ring.scaleX*1.035,scaleY:ring.scaleY*1.035,alpha:{from:0.20,to:0.32},yoyo:true,duration:Math.max(360,duration*0.48),repeat:1});let reflected=0;
    let evoTick=0;
    const pulse=this.time.addEvent({delay:120,loop:true,callback:()=>{if(!ring.active)return;ring.setPosition(this.player.x,this.player.y);
      if(mEvo&&(evoTick++%3===0)){const t=this.nearestEnemy(760),b=this.getBullet(this.player.x,this.player.y,0xffffff,0.2);if(b){b.setTexture('proj_sprinkle').setTint(0x9fe8ff);b.dmg=(9+lvl*2.6)*dm;b.life=2;b.homing=520;b.pierce=true;b.faceVel=true;const a=t?Math.atan2(t.y-this.player.y,t.x-this.player.x):Math.random()*Math.PI*2;this.physics.velocityFromRotation(a,440,b.body.velocity);}}
      this.foeBullets.children.iterate(f=>{if(!f||!f.active||reflected>=max||this.dist(f.x,f.y,this.player.x,this.player.y)>r)return;
        const x=f.x,y=f.y;this.killFoe(f);const b=this.getBullet(x,y,0xffffff,0.18);if(!b)return;b.setTexture('proj_sprinkle').setTint(0x9fe8ff);b.dmg=(8+lvl*2.4)*dm*bDmgMut;b.life=2;b.homing=aw?520:360;b.pierce=aw||bPierce;b.faceVel=true;
        const t=this.nearestEnemy(800),a=t?Math.atan2(t.y-y,t.x-x):Math.random()*Math.PI*2;this.physics.velocityFromRotation(a,420,b.body.velocity);this.vfxHitRing(x,y,0x9fe8ff,false);reflected++;});
    }});
    if(aw)for(let i=0;i<3;i++){const a=i*Math.PI*2/3,b=this.getBullet(this.player.x,this.player.y,0xffffff,0.17);if(!b)continue;b.setTexture('proj_sprinkle').setTint(0x9fe8ff);b.dmg=(8+lvl*2.4)*dm;b.life=2;b.homing=480;b.pierce=true;b.faceVel=true;this.physics.velocityFromRotation(a,390,b.body.velocity);}
    this.time.delayedCall(duration,()=>{pulse.remove(false);if(ring.active)this.tweens.add({targets:ring,alpha:0,duration:180,onComplete:()=>ring.destroy()});});Sfx.zap();
  }
  castMemoryJam(lvl,aw,dm){
    const count=aw?3:(lvl>=4?2:1),cand=[];this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<700)cand.push(e);});
    cand.sort((a,b)=>b.hp-a.hp);for(let i=0;i<Math.min(count,cand.length);i++){const e=cand[i],token=Symbol('memory');e._memoryToken=token;e._memoryStored=0;e._memoryRatio=(0.35+lvl*0.06)*(1+(this.player.memoryAmp||0))*(aw?1.3:1);e._memoryRadius=(75+lvl*9)*(aw?1.25:1);
      const mark=this.camWorld(this.add.image(e.x,e.y,'ic_memory').setDepth(90002).setScale(0.20).setAlpha(0.84));e._memoryMarkObj=mark;mark._follow=e;
      this.tweens.add({targets:mark,rotation:Math.PI*2,scale:{from:0.17,to:0.25},alpha:{from:0.62,to:0.94},yoyo:true,duration:520,repeat:-1,ease:'Sine.inOut'});
      this.time.delayedCall((1.8+lvl*0.18)*1000,()=>{if(mark.active){this.tweens.killTweensOf(mark);mark.destroy();}if(e._memoryToken===token)this.resolveMemoryMark(e);});
    } Sfx.clear();
  }
  resolveMemoryMark(marked){
    if(!marked||!marked._memoryToken)return;const stored=marked._memoryStored||0,ratio=marked._memoryRatio||0,r=marked._memoryRadius||80,x=marked.x,y=marked.y;
    marked._memoryToken=null;marked._memoryStored=0;if(marked._memoryMarkObj&&marked._memoryMarkObj.active){this.tweens.killTweensOf(marked._memoryMarkObj);marked._memoryMarkObj.destroy();}marked._memoryMarkObj=null;if(stored<=0)return;this.burst(x,y,0xd59cff);
    this.enemies.children.iterate(e=>{if(e&&e.active&&(e!==marked||marked.hp>0)&&this.dist(e.x,e.y,x,y)<r)this.damage(e,stored*ratio,e.x,e.y);});
  }
  castFlavorThread(lvl,aw,dm){
    const count=aw?7:(3+Math.floor(lvl/2)),cand=[];this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,this.player.x,this.player.y)<620)cand.push(e);});
    cand.sort((a,b)=>this.dist(a.x,a.y,this.player.x,this.player.y)-this.dist(b.x,b.y,this.player.x,this.player.y));const linked=cand.slice(0,count);if(linked.length<2)return;
    const cx=linked.reduce((s,e)=>s+e.x,0)/linked.length,cy=linked.reduce((s,e)=>s+e.y,0)/linked.length,ticks=aw?6:4,dmg=(4+lvl*1.8)*dm;
    const knot=this.camWorld(this.add.image(cx,cy,'ic_thread').setDepth(90001).setScale(0.13).setAlpha(0.78));
    this.tweens.add({targets:knot,rotation:Math.PI*2,scale:{from:0.10,to:0.18},alpha:{from:0.48,to:0.86},duration:ticks*90,yoyo:true,repeat:1,ease:'Sine.inOut',onComplete:()=>knot.destroy()});
    for(let n=0;n<ticks;n++)this.time.delayedCall(n*180,()=>{for(let i=0;i<linked.length;i++){const a=linked[i],b=linked[(i+1)%linked.length];if(a.active&&b.active)this.chainBolt(a.x,a.y,b.x,b.y);}linked.forEach(e=>{if(!e.active)return;this.damage(e,dmg,e.x,e.y);if(!e.isBoss&&!e.isMini){const a=Math.atan2(cy-e.y,cx-e.x);e.setVelocity(Math.cos(a)*150,Math.sin(a)*150);e.knock=0.10;}});});Sfx.zap();
  }
  castCoreDecoy(lvl,aw,dm){
    const dir=this.moveDir&&this.moveDir.lengthSq()>0.04?this.moveDir:new Phaser.Math.Vector2(1,0),x=this.player.x+dir.x*105,y=this.player.y+dir.y*105,dur=2.2+lvl*0.25+(aw?1.2:0),r=(95+lvl*11)*(aw?1.25:1),dmg=(12+lvl*3.2)*dm*(aw?1.3:1);
    const core=this.camWorld(this.add.image(x,y,'ic_decoy').setDepth(90000).setScale(0.42).setAlpha(0.95));this.tweens.add({targets:core,scale:{from:0.34,to:0.48},rotation:{from:-0.08,to:0.08},yoyo:true,repeat:-1,duration:300});
    const lure=this.time.addEvent({delay:460,loop:true,callback:()=>{if(!core.active)return;const wave=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0x8fe8d0).setDepth(4).setScale(0.10).setAlpha(0.34));this.tweens.add({targets:wave,scale:(r*1.55)/256,alpha:0,duration:420,ease:'Quad.out',onComplete:()=>wave.destroy()});}});
    this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r*3){e._decoyT=dur;e._decoyX=x;e._decoyY=y;}});
    this.time.delayedCall(dur*1000,()=>{lure.remove(false);this.tweens.killTweensOf(core);core.destroy();this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.damage(e,dmg,e.x,e.y);});this.burst(x,y,0x8fe8d0);if(aw)this.time.delayedCall(220,()=>{this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r*1.25)this.damage(e,dmg*0.7,e.x,e.y);});});if(aw)this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.maxhp*0.04);Sfx.boom();});
  }
  castTriadSeal(lvl,aw,dm){
    if(!this._triSeals)this._triSeals=[];const t=this.nearestEnemy(640),x=t?t.x:this.player.x+Phaser.Math.Between(-170,170),y=t?t.y:this.player.y+Phaser.Math.Between(-170,170);
    const seal=this.camWorld(this.add.image(x,y,'ic_triseal').setDepth(3).setScale(0.30).setAlpha(0.82));this.tweens.add({targets:seal,rotation:Math.PI*2,scale:{from:0.25,to:0.34},alpha:{from:0.58,to:0.90},duration:760,yoyo:true,repeat:-1,ease:'Sine.inOut'});this._triSeals.push({x,y,obj:seal});if(this._triSeals.length<3)return;
    const pts=this._triSeals.splice(0,3),cx=pts.reduce((s,p)=>s+p.x,0)/3,cy=pts.reduce((s,p)=>s+p.y,0)/3,r=(125+lvl*14)*(aw?1.25:1),dmg=(18+lvl*4)*dm*(aw?1.32:1);
    for(let i=0;i<3;i++)this.chainBolt(pts[i].x,pts[i].y,pts[(i+1)%3].x,pts[(i+1)%3].y);const core=this.camWorld(this.add.image(cx,cy,'ic_triseal').setDepth(5).setScale(0.10).setAlpha(0.84));this.tweens.add({targets:core,rotation:-Math.PI,scale:(r*1.15)/128,alpha:0,duration:360,ease:'Quad.out',onComplete:()=>core.destroy()});pts.forEach(p=>{if(p.obj.active){this.tweens.killTweensOf(p.obj);this.tweens.add({targets:p.obj,scale:0.05,alpha:0,duration:240,onComplete:()=>p.obj.destroy()});}});
    if(lvl>=3||aw){const lineHit=new Set();this.enemies.children.iterate(e=>{if(!e||!e.active)return;for(let i=0;i<3;i++){const a=pts[i],b=pts[(i+1)%3],vx=b.x-a.x,vy=b.y-a.y,l2=vx*vx+vy*vy,q=Phaser.Math.Clamp(((e.x-a.x)*vx+(e.y-a.y)*vy)/(l2||1),0,1),d=this.dist(e.x,e.y,a.x+q*vx,a.y+q*vy);if(d<28+(aw?18:0)){lineHit.add(e);break;}}});lineHit.forEach(e=>this.damage(e,dmg*0.55,e.x,e.y));}
    const blast=()=>{this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,cx,cy)<r)this.damage(e,dmg,e.x,e.y);});this.burst(cx,cy,0xffd166);Sfx.boom();};blast();if(aw)this.time.delayedCall(300,blast);
  }
  castEchoStep(lvl,aw,dm){
    const count=(aw?7:3+Math.floor(lvl/2))+(this.player.echoPath?2:0),trail=(this._echoTrail||[]).slice(-count*3),dmg=(7+lvl*2.1)*dm*(aw?1.28:1),r=(48+lvl*5)*(this.player.echoPath?1.22:1);
    const pts=[];for(let i=0;i<count;i++){const p=trail[Math.max(0,trail.length-1-i*3)]||{x:this.player.x-this.moveDir.x*i*28,y:this.player.y-this.moveDir.y*i*28};pts.push(p);}
    pts.reverse().forEach((p,i)=>this.time.delayedCall(i*90,()=>{const burst=mult=>{const foot=this.camWorld(this.add.image(p.x,p.y,'sakura_petal').setTint(0xbca7ff).setDepth(4).setScale(0.7).setAlpha(0.8));this.tweens.add({targets:foot,scale:1.8,alpha:0,duration:300,onComplete:()=>foot.destroy()});this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,p.x,p.y)<r)this.damage(e,dmg*mult,e.x,e.y);});};burst(1);if(aw)this.time.delayedCall(180,()=>burst(0.65));}));
    if(aw){this.player.baseSpeed*=1.10;this.time.delayedCall(900,()=>{this.player.baseSpeed/=1.10;});}Sfx.shoot();
  }
  // Cupcake Sentry: ป้อมชั่วคราว ยิงหาเป้าหมายจากPositionป้อม และระเบิดเมื่อหมดเวลา
  deployCupcakeSentry(x,y,lvl,aw,dmg,r,delay=0){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const s=this.camWorld(this.add.image(x,y,'proj_mine').setDepth(3).setScale(0.40)); s._dead=false;
      this.tweens.add({targets:s,scale:{from:0.36,to:0.45},yoyo:true,repeat:-1,duration:320});
      const duration=(3.8+lvl*0.42+(aw?1.8:0))*1000, rate=Math.max(300,720-lvl*65-(aw?110:0));
      const gun=this.time.addEvent({delay:rate,loop:true,callback:()=>{ if(s._dead||(this.state!=='play'&&this.state!=='levelup'))return;
        let t=null,bd=(420+lvl*35)**2; this.enemies.children.iterate(e=>{ if(e&&e.active){const d=(e.x-x)**2+(e.y-y)**2;if(d<bd){bd=d;t=e;}}});
        if(!t)return; const shots=aw?2:1,base=Math.atan2(t.y-y,t.x-x);
        for(let i=0;i<shots;i++){const b=this.getBullet(x,y-8,0xffffff,0.22);if(!b)continue;
          b.setTexture('proj_sprinkle').setTint(i?0xffd166:0xff8fb5);b.dmg=dmg;b.life=1.8;b.pierce=lvl>=5;b.faceVel=true;
          this.physics.velocityFromRotation(base+(i-(shots-1)/2)*0.13,460,b.body.velocity);}
        s.setRotation(-0.08);this.tweens.add({targets:s,rotation:0,duration:120,ease:'Back.out'});Sfx.shoot();
      }});
      this.time.delayedCall(duration,()=>{ if(s._dead)return;s._dead=true;gun.remove(false);this.tweens.killTweensOf(s);s.destroy();
        if(this.state!=='play'&&this.state!=='levelup')return;
        if(this.anims.exists('fx_mine'))this.spawnFxAnim('fx_mine',x,y,{scale:(2*r)/ASSET_FX.fx_mine.fw,depth:5,anchor:'center'});
        this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r)this.damage(e,dmg*2.2,e.x,e.y);});
        this.hitCratesInRadius(x,y,r,dmg*2.2);Sfx.boom();
      });
    });
  }
  // เล่น VFX flipbook (sprite animation) timesเดียวแล้วทำลาย · additive blend (พื้นดำหาย + เรืองแสง)
  spawnFxAnim(key,x,y,o={}){
    if(!this.textures.exists(key)||!this.anims.exists(key))return null;
    const fx=ASSET_FX[key]||{}; const s=this.camWorld(this.add.sprite(x,y,key,0));
    s.setDepth(o.depth!=null?o.depth:7); s.setBlendMode(o.normal?Phaser.BlendModes.NORMAL:Phaser.BlendModes.ADD);   // ชีต VFX ใช้พื้นดำ: ADD เป็นค่าเริ่มต้นเพื่อไม่ให้เกิดกล่องดำบน WebGL/Android
    const ax=o.anchor||fx.anchor||'center'; s.setOrigin(ax==='left'?0:0.5, ax==='bottom'?1:0.5);
    if(o.rotation!=null)s.setRotation(o.rotation);
    s.setScale(o.scaleX!=null?o.scaleX:(o.scale!=null?o.scale:1), o.scaleY!=null?o.scaleY:(o.scale!=null?o.scale:1));
    if(o.alpha!=null)s.setAlpha(o.alpha);
    s.play(key); s.once('animationcomplete',()=>s.destroy()); return s;
  }
  // ออร่าถาวร: สร้าง sprite วนลูปติดตัว (ครั้งเดียว)
  ensureAuraFx(){
    const lvl=this.skills&&this.skills.aura||1,aw=lvl>=SKILL_AWAKEN_LV,want=aw?12:7;
    if(!this._auraFx&&this.textures.exists('fx_aura')&&this.anims.exists('fx_aura')){
      const s=this.camWorld(this.add.sprite(this.player.x,this.player.y,'fx_aura',0));
      s.setDepth(2).setBlendMode(Phaser.BlendModes.ADD).setOrigin(0.5);s.play('fx_aura');this._auraFx=s;
    }
    if(!this._auraPetals)this._auraPetals=[];
    if(this._auraPetals.length!==want){this._auraPetals.forEach(p=>p.destroy());this._auraPetals=[];
      for(let i=0;i<want;i++){const p=this.camWorld(this.add.image(this.player.x,this.player.y,'sakura_petal').setDepth(4).setScale(0.52).setAlpha(0.9));p._petalIndex=i;this._auraPetals.push(p);}}
  }
  clearAuraFx(){if(this._auraFx){this._auraFx.destroy();this._auraFx=null;}if(this._auraPetals){this._auraPetals.forEach(p=>p.destroy());this._auraPetals=[];}}
  sakuraBloom(target,lvl,aw){
    if(!target||!target.active)return;const x=target.x,y=target.y,r=(54+lvl*5)*(aw?1.3:1),dmg=(7+lvl*2.1)*this.player.dmgMul*(BALANCE.skillPower.aura||1);
    const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xff79b8).setDepth(5).setScale(0.12).setAlpha(0.9));
    this.tweens.add({targets:ring,scale:(r*2)/256,alpha:0,duration:360,ease:'Quad.out',onComplete:()=>ring.destroy()});
    for(let i=0;i<6;i++){const a=i*Math.PI/3,p=this.camWorld(this.add.image(x,y,'sakura_petal').setDepth(6).setRotation(a).setScale(0.5));this.tweens.add({targets:p,x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,rotation:a+2,alpha:0,duration:330,onComplete:()=>p.destroy()});}
    this.enemies.children.iterate(e=>{if(e&&e.active&&this.dist(e.x,e.y,x,y)<r){this.damage(e,dmg,e.x,e.y);if(lvl>=4&&!e.isBoss&&!e.isMini)e.frozen=Math.max(e.frozen||0,0.16);}});
    if(aw&&this.player.hp<this.player.maxhp&&(this._sakuraHealCd||0)<=0){this.player.hp=Math.min(this.player.maxhp,this.player.hp+1.5);this._sakuraHealCd=1.8;this.popHeal(this.player.x,this.player.y,2);}
  }
  // Sakura Aura: กลีบอ่านระยะได้ + สะสม Bloom แทนการเผาดาเมจฟรีทุกเฟรม
  // ---- Signature aura ประจำตัว (rework Mint + งาดำ ให้แข็งแรงขึ้น มี DPS always-on) ----
  clearCharSignature(){ if(this._frostStreams){this._frostStreams.forEach(s=>s&&s.img&&s.img.destroy());this._frostStreams=null;} if(this._mintOrbs){this._mintOrbs.forEach(o=>o&&o.destroy());this._mintOrbs=null;} if(this._mintField){this._mintField.destroy();this._mintField=null;} if(this._sesField){this._sesField.destroy();this._sesField=null;} if(this._sesShards){this._sesShards.forEach(s=>s&&s.destroy());this._sesShards=null;} }
  tickCharSignature(dt){
    const ch=this.character;
    // ❄️ Mint — Frost Lance เป็น Basic Attack แล้ว (ยิงเป็นจังหวะใน castSkill) · signature นี้แค่ดูแล "Ice Torrent" ที่หอกทิ้งไว้
    this.tickFrostStreams(dt);
    if(ch!=='mint'&&this._frostStreams&&this._frostStreams.length){ this._frostStreams.forEach(s=>s.img&&s.img.active&&s.img.destroy()); this._frostStreams=null; }
    // 🪞 งาดำ — วงเวทกระจกถาวรWaitบตัว (aura ไม่หาย): ทำดาเมจศัตรูในเขต + ลบกระสุนศัตรูที่เข้าเขต (ward) · Noneจรวด/ไม่ยิง projectile
    if(ch==='sesame'){
      const lvl=this.skills.mirror||1;
      // Trade-off: ยืนนิ่ง = สะสม Focus (แรง+วงกว้าง) แต่ Guard (บล็อกกระสุน) หมดเร็ว · ต้องขยับเพื่อ recharge Guard = เข้า-ออกเป็นจังหวะ
      const pv=this.player.body?Math.hypot(this.player.body.velocity.x,this.player.body.velocity.y):0, moving=pv>45;
      const GMAX=100; if(this._sesGuard==null)this._sesGuard=GMAX;
      this._sesGuard=Math.min(GMAX,this._sesGuard+dt*(moving?42:9));   // ขยับ = ฟื้น Guard เร็ว · นิ่ง = ฟื้นช้า (บล็อกจนหมดได้)
      if(this._sesFocus==null)this._sesFocus=0;
      this._sesFocus=moving?Math.max(0,this._sesFocus-dt*1.7):Math.min(1,this._sesFocus+dt*0.5);   // นิ่ง = Focus โต · ขยับ = สลาย
      const focusMul=1+this._sesFocus*0.85, gLow=this._sesGuard<24;
      const R=88+lvl*13+(this.player.mirrorWard?18:0)+this._sesFocus*24;
      if(!this._sesField)this._sesField=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_magic_circle').setDepth(2).setAlpha(0.22));
      this._sesA=(this._sesA||0)+dt*0.5;
      this._sesField.setPosition(this.player.x,this.player.y).setDisplaySize(R*2,R*2).setRotation(this._sesA).setTint(gLow?0xff7a7a:(this._sesFocus>0.6?0xffe08a:0xf4e7bd)).setAlpha(0.14+0.08*(this._sesGuard/GMAX)+0.04*Math.sin(this.elapsed*2.2));
      this._sesFieldT=(this._sesFieldT||0)-dt;
      if(this._sesFieldT<=0){ this._sesFieldT=0.4; const dmg=(5+lvl*2)*(this.player.dmgMul||1)*focusMul;
        this.enemies.children.iterate(e=>{ if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>R)return;
          this.damage(e,(e.isBoss||e.isMini)?dmg*1.35:dmg,e.x,e.y); });
        this.hitCratesInRadius(this.player.x,this.player.y,R,dmg); }
      // ward: บล็อกกระสุนได้เฉพาะตอน Guard ยังเหลือ (หมดแล้วกระสุนทะลุ = ต้องขยับหนี)
      this.foeBullets.children.iterate(f=>{ if(f&&f.active&&this.dist(f.x,f.y,this.player.x,this.player.y)<R&&this._sesGuard>=16){ this._sesGuard-=16; this.vfxHitRing(f.x,f.y,gLow?0xff7a7a:0xf4e7bd,false); this.killFoe(f); } });
    } else if(this._sesField){ this._sesField.destroy(); this._sesField=null; }
  }
  tickAura(dt){
    const lvl=this.skills&&this.skills.aura;if(!lvl){this.clearAuraFx();return;}
    const aw=lvl>=SKILL_AWAKEN_LV,r=(72+lvl*13)*(aw?1.35:1);this.ensureAuraFx();this._auraAngle=(this._auraAngle||0)+dt*(aw?1.45:1.05);this._sakuraHealCd=Math.max(0,(this._sakuraHealCd||0)-dt);
    if(this._auraFx&&this._auraFx.active){ this._auraFx.x=this.player.x; this._auraFx.y=this.player.y;
      this._auraFx.setScale((2*r)/ASSET_FX.fx_aura.fw).setAlpha(Math.min(0.48,0.22+lvl*0.035)); }
    (this._auraPetals||[]).forEach((p,i)=>{const inner=aw&&i%2===1,rr=r*(inner?0.62:0.9),a=this._auraAngle+(i/this._auraPetals.length)*Math.PI*2*(inner?-1:1);p.setPosition(this.player.x+Math.cos(a)*rr,this.player.y+Math.sin(a)*rr).setRotation(a+Math.PI/2).setScale(inner?0.42:0.54);});
    this._auraTick=(this._auraTick||0)-dt;
    if(this._auraTick<=0){this._auraTick=lvl>=5?0.38:0.48;const touch=(1.2+lvl*0.5)*this.player.dmgMul*(BALANCE.skillPower.aura||1);
      this.enemies.children.iterate(e=>{if(!e||!e.active||this.dist(e.x,e.y,this.player.x,this.player.y)>=r)return;this.damage(e,touch,e.x,e.y);if(!e.active)return;
        e.bloomStacks=(e.bloomStacks||0)+1;e.bloomUntil=2.2;const need=e.isBoss||e.isMini?5:3;if(e.bloomStacks>=need){e.bloomStacks=0;this.sakuraBloom(e,lvl,aw);}});
      this.hitCratesInRadius(this.player.x,this.player.y,r,touch);}
  }
  fireBeam(ang,len,wide,dmg){
    const px=this.player.x, py=this.player.y;
    if(this.textures.exists('fx_beam')&&this.anims.exists('fx_beam')){
      const sx=len/ASSET_FX.fx_beam.fw, sy=0.42*(wide/15);
      this.spawnFxAnim('fx_beam',px,py,{rotation:ang,scaleX:sx,scaleY:sy,depth:6,anchor:'left'});
    } else {
      const g=this.camWorld(this.add.rectangle(px,py,len,wide,0xffe08a,0.75).setOrigin(0,0.5).setDepth(6)); g.setRotation(ang);
      this.tweens.add({targets:g,alpha:0,scaleY:0.3,duration:260,onComplete:()=>g.destroy()});
    }
    const dx=Math.cos(ang),dy=Math.sin(ang);
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const rx=e.x-px, ry=e.y-py;
      const proj=rx*dx+ry*dy; if(proj<0||proj>len)return; if(Math.abs(-rx*dy+ry*dx)<wide/2+16) this.damage(e,dmg,e.x,e.y); });
  }
  meteorStrike(x,y,r,dmg,delay){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const warn=this.camWorld(this.add.image(x,y,'vfx_telegraph').setDepth(2).setScale((r*2)/256).setAlpha(0.72));
      const donArt=this.textures.exists('fx_donut');
      const don = donArt
        ? this.camWorld(this.add.image(x,y-260,'fx_donut').setDepth(7).setScale((r*1.5)/96))
        : this.camWorld(this.add.circle(x,y-260,9,0xd9a066,1).setDepth(7).setStrokeStyle(3,0xa6702e,1));
      this.tweens.add({targets:don,y:y,duration:300,ease:'Quad.in',onComplete:()=>{ don.destroy(); warn.destroy();
        if(this.anims.exists('fx_donutimpact')) this.spawnFxAnim('fx_donutimpact',x,y,{scale:(2*r)/ASSET_FX.fx_donutimpact.fw,depth:4,anchor:'center'});
        else { const boom=this.camWorld(this.add.circle(x,y,10,0xffcf70,0.5).setDepth(3));
          this.tweens.add({targets:boom,radius:r,alpha:0,duration:260,onComplete:()=>boom.destroy()}); }
        this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(x,y,r,dmg);
        this.screenShake(80,0.004); Sfx.boom(); }}); });
  }
  creamWave(maxR,dmg,delay,force=260){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      const px=this.player.x, py=this.player.y, hit=new Set();
      this.hitCratesInRadius(px,py,maxR,dmg);
      if(this.textures.exists('fx_wave')&&this.anims.exists('fx_wave')){ const wl=this.skills.wave||1; this.spawnFxAnim('fx_wave',px,py,{scale:(2*maxR)/ASSET_FX.fx_wave.fw,depth:3,anchor:'center',alpha:Math.min(1,0.5+wl*0.1)}); }
      const ring=this.camWorld(this.add.image(px,py,'vfx_cream_ring').setDepth(3).setScale(20/256).setAlpha(0.9));
      const waveTrack={radius:10};
      this.tweens.add({targets:waveTrack,radius:maxR,duration:420,ease:'Quad.out',
        onUpdate:(tw)=>{ const rr=waveTrack.radius; ring.setScale((rr*2)/256).setAlpha(0.9*(1-tw.progress));
          this.enemies.children.iterate(e=>{ if(e&&e.active&&!hit.has(e)){ const d=this.dist(e.x,e.y,px,py);
          if(d<rr&&d>rr-46){ hit.add(e); this.damage(e,dmg,e.x,e.y); if(!e.isBoss){ const a=Math.atan2(e.y-py,e.x-px); e.setVelocity(Math.cos(a)*force,Math.sin(a)*force); e.knock=0.2; } } } }); },
        onComplete:()=>ring.destroy() }); });
  }
  explodeAt(x,y,r,dmg){
    if(this.textures.exists('fx_boom')&&this.anims.exists('fx_boom')){
      this.spawnFxAnim('fx_boom',x,y,{scale:(2*r)/ASSET_FX.fx_boom.fw*1.15,depth:5,anchor:'center'});
    } else { const ring=this.camWorld(this.add.circle(x,y,10,0xffb08a,0.5).setDepth(3));
      this.tweens.add({targets:ring,radius:r,alpha:0,duration:240,onComplete:()=>ring.destroy()}); }
    this.burst(x,y,0xff8b6b);
    this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,x,y)<r) this.damage(e,dmg,e.x,e.y); }); this.hitCratesInRadius(x,y,r,dmg); Sfx.boom(); }
  // ประกายวาววับตอนสกิลตื่นรู้ (Awaken) ทำงาน
  awakenSpark(key){ const c=this.camWorld(this.add.image(this.player.x,this.player.y,'vfx_glow').setTint(0xfff2a8).setScale(0.08).setAlpha(0.8).setDepth(6));
    this.tweens.add({targets:c,scale:0.32,alpha:0,duration:280,onComplete:()=>c.destroy()}); }
  chainBolt(x1,y1,x2,y2){
    const len=this.dist(x1,y1,x2,y2), ang=Math.atan2(y2-y1,x2-x1);
    const bolt=this.camWorld(this.add.image(x1,y1,'vfx_chain_bolt').setOrigin(0,0.5).setDepth(7).setRotation(ang).setScale(len/256,0.42).setAlpha(0.95));
    this.tweens.add({targets:bolt,alpha:0,scaleY:0.18,duration:180,onComplete:()=>bolt.destroy()});
  }
  zap(x,y){
    if(this.textures.exists('fx_thunder')&&this.anims.exists('fx_thunder')){
      this.spawnFxAnim('fx_thunder',x,y,{scaleY:280/ASSET_FX.fx_thunder.fh,scaleX:2.4,depth:7,anchor:'bottom'});
      const fl=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xbfe3ff).setDepth(7).setScale(0.10).setAlpha(0.7));
      this.tweens.add({targets:fl,alpha:0,scale:0.32,duration:220,onComplete:()=>fl.destroy()}); return;
    }
    const g=this.camWorld(this.add.graphics().setDepth(7)); g.lineStyle(3,0xfff2a8,1);
    g.beginPath(); g.moveTo(x,y-260); g.lineTo(x+Phaser.Math.Between(-14,14),y-130); g.lineTo(x,y); g.strokePath();
    const fl=this.camWorld(this.add.circle(x,y,22,0xfff2a8,0.6).setDepth(7));
    this.tweens.add({targets:[g,fl],alpha:0,duration:200,onComplete:()=>{ g.destroy(); fl.destroy(); }});
  }
  nearestEnemy(maxD){ let best=null,bd=maxD*maxD;
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2; if(d<bd){bd=d;best=e;} });
    return best; }
  strongestEnemy(maxD){let best=null,hp=-1,bd=maxD*maxD;this.enemies.children.iterate(e=>{if(!e||!e.active)return;const d=(e.x-this.player.x)**2+(e.y-this.player.y)**2;if(d<=bd&&(e.hp||0)>hp){hp=e.hp||0;best=e;}});return best;}
  densestEnemy(maxD){let best=null,score=-1,bd=maxD*maxD,cand=[];this.enemies.children.iterate(e=>{if(e&&e.active&&(e.x-this.player.x)**2+(e.y-this.player.y)**2<=bd)cand.push(e);});for(const e of cand){let n=0;for(const o of cand)if((o.x-e.x)**2+(o.y-e.y)**2<145*145)n++;if(n>score){score=n;best=e;}}return best;}
  // chain: กระสุนเด้งไฟฟ้าไปศัตรูใกล้ ๆ ต่อกันเป็นทอด (สายฟ้าลูกโซ่)
  chainFrom(bullet,enemy){ if(!(bullet.chain>0))return; const hit=new Set([enemy]); let src=enemy;
    for(let j=0;j<bullet.chain;j++){ let nb=null,nd=300*300;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&!hit.has(o)){ const d=(o.x-src.x)**2+(o.y-src.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(!nb)break; hit.add(nb); this.chainBolt(src.x,src.y,nb.x,nb.y); this.damage(nb,bullet.dmg*0.55,nb.x,nb.y); src=nb; } }
  hitEnemy(bullet,enemy){ if(!bullet.active||!enemy.active)return;
    if(bullet.bubblePrison){
      const x=enemy.x,y=enemy.y,lvl=bullet.bubbleLevel||1,r=bullet.bubbleRadius||70,aw=!!bullet.bubbleAwaken,dmg=bullet.dmg||8,prisonHp=enemy.maxhp||0;
      this.killBullet(bullet);
      this.damage(enemy,dmg*0.45,x,y);
      if(enemy.active){ enemy.frozen=Math.max(enemy.frozen||0,enemy.isBoss?0.28:(0.62+lvl*0.10));
        const sc=Math.max(0.22,Math.min(0.62,((enemy.displayWidth||48)*1.55)/256));
        const cage=this.camWorld(this.add.image(enemy.x,enemy.y,'bubble').setDepth((enemy.depth||4)+1).setScale(sc).setAlpha(0.88));
        this.tweens.add({targets:cage,scaleX:sc*1.14,scaleY:sc*1.14,duration:180,yoyo:true,repeat:1});
        this.time.delayedCall(430+lvl*35,()=>{ const bx=enemy.active?enemy.x:x,by=enemy.active?enemy.y:y; cage.destroy();
          if(this.state!=='play'&&this.state!=='levelup')return;
          if(this.anims.exists('fx_bubble'))this.spawnFxAnim('fx_bubble',bx,by,{scale:(2*r)/ASSET_FX.fx_bubble.fw,depth:6,anchor:'center'});
          const prisonBonus=Math.min(55,prisonHp*0.035);this.enemies.children.iterate(e=>{ if(e&&e.active&&this.dist(e.x,e.y,bx,by)<r)this.damage(e,dmg*(aw?1.25:0.90)+prisonBonus,e.x,e.y); });
          this.hitCratesInRadius(bx,by,r,dmg); this.vfxHitRing(bx,by,0x80e8d0,true); Sfx.boom();
        }); }
      return;
    }
    if(bullet.iceNeedle){ if(bullet.hitCd>0)return; bullet.hitCd=bullet.hitGapV||0.10; const nd=bullet.iceNeedle;
      const frozenNow=enemy.frozen>0;
      this.damage(enemy,bullet.dmg*(frozenNow?nd.frozenBonus:1),bullet.x,bullet.y);
      if(enemy.active&&!enemy.isBoss&&!enemy.isMini){ enemy.frozen=Math.max(enemy.frozen||0,nd.freeze); enemy.setVelocity(enemy.body.velocity.x*0.4,enemy.body.velocity.y*0.4); enemy.setTint(COLORS.ice); }
      if(nd.shatter){ const r=52+nd.lvl*5; this.burst(bullet.x,bullet.y,0x8fd0ff); this.enemies.children.iterate(e=>{ if(e&&e.active&&e!==enemy&&this.dist(e.x,e.y,bullet.x,bullet.y)<r)this.damage(e,nd.dmg*0.5,e.x,e.y); }); }
      // Frost Lance: กระทบเป้า = แตกเป็นสะเก็ดทันที (แล้วหอกหัก)
      if(bullet.shatterInfo&&bullet.shatterState&&!bullet.shatterState.done){ const si=bullet.shatterInfo; bullet.shatterState.done=true;
        this.frostShatterBurst(bullet.x,bullet.y,si.ang,si.count,si.dmg,si.freeze,si.fb,si.blizzard,si.lvl); this.killBullet(bullet); return; }
      bullet.pierceLeft=(bullet.pierceLeft||1)-1; if(bullet.pierceLeft<=0)this.killBullet(bullet); return; }
    if(bullet.pierce){ if(bullet.hitCd>0)return; bullet.hitCd=bullet.hitGapV||0.16; this.damage(enemy,bullet.dmg,bullet.x,bullet.y); this.chainFrom(bullet,enemy); return; }
    this.damage(enemy,bullet.dmg,bullet.x,bullet.y);if(enemy.active&&bullet.knockback&&!enemy.isBoss&&!enemy.isMini){const a=Math.atan2(enemy.y-this.player.y,enemy.x-this.player.x);enemy.setVelocity(Math.cos(a)*bullet.knockback,Math.sin(a)*bullet.knockback);enemy.knock=0.22;} this.chainFrom(bullet,enemy);
    if(bullet.explode){ this.explodeAt(bullet.x,bullet.y,bullet.explode,bullet.dmg*0.8);if(bullet.sticky)this.enemies.children.iterate(e=>{if(e&&e.active&&!e.isBoss&&!e.isMini&&this.dist(e.x,e.y,bullet.x,bullet.y)<bullet.explode)e.frozen=Math.max(e.frozen||0,0.45);});this.killBullet(bullet); return; }   // จรวดระเบิด AoE
    if(bullet.bounce>0){ bullet.bounce--;
      let nb=null,nd=360*360;
      this.enemies.children.iterate(o=>{ if(o&&o.active&&o!==enemy){ const d=(o.x-bullet.x)**2+(o.y-bullet.y)**2; if(d<nd){nd=d;nb=o;} } });
      if(nb&&bullet.body){ const sp=bullet.body.velocity.length()||460, ang=Math.atan2(nb.y-bullet.y,nb.x-bullet.x);
        this.physics.velocityFromRotation(ang,sp,bullet.body.velocity); return; } }
    this.killBullet(bullet); }
  damage(e,amount,x,y){ if(!e.active)return;
    // Phase Gate: Lockedดาเมจทันทีที่ชนเส้นเลือด และInvincibleจนแอนิเมชันเปลี่ยนเฟสจบ
    if((e.isBoss||e.isMini)&&(e._phaseGateLocked||(e._phaseInvuln||0)>0)){
      const now=this.elapsed||0;if(now>=(e._phaseImmunePopAt||0)){e._phaseImmunePopAt=now+0.38;this.popDmg('Invincible',x,y,false);}return;
    }
    if((e.isBoss||e.isMini)&&this._bossShield)amount*=0.45;   // Objective: บอสกางเกราะ = ลดดาเมจ 55% (เดิม 88% ทำให้บอสแทบInvincible = เหมือนBoss vanished) ยังตีเข้าได้
    amount+=(this.player.flatDmg||0);   // ดาเมจตรง (พรสวรรค์ ATK) บวกทุกครั้งที่โดน
    if(this.player.lowHpDmg&&this.player.hp/this.player.maxhp<0.40)amount*=1+this.player.lowHpDmg;
    let crit=false; if(this.player.critChance && Math.random()<this.player.critChance){ amount*=(this.player.critMul||1.8); crit=true; }
    let gate=null;
    if(e.isBoss){
      const p2=this.stageIndex===4?0.72:(this.stageIndex===0?0.68:(this.stageIndex===1?0.65:0.50));
      const p3=this.stageIndex===4?0.40:(this.stageIndex===0?0.35:(this.stageIndex===1?0.32:0.25));
      if(!e.phase2)gate=p2;else if(!e.phase3)gate=p3;else if(this.stageIndex===4&&!e.phase4)gate=0.14;
    }else if(e.isMini&&!e.phase2)gate=0.50;
    if(gate!=null){const floor=e.maxhp*gate;if(e.hp>floor&&e.hp-amount<=floor){amount=e.hp-floor;e._phaseGateLocked=true;}}
    if(e._memoryToken)e._memoryStored=(e._memoryStored||0)+amount;
    e.hp-=amount;
    e._sqX = 1.35; e._sqY = 0.70;   // Effectยุบตัวเมื่อโดนตี (Hit squash)
    if(crit){ this.hitStop(35); this.screenShake(90, 0.005); }
    // อย่าฟอก sprite ด้วย setTintFill ตอนโดนตี: skillsหลาย hit ทำให้ art กระพริบขาวจนอ่าน silhouette ไม่ออก
    // ใช้ ring + spark + damage number + squash เป็น hit feedback แทน จึงเห็นสีและ animation เดิมตลอดเวลา
    this.vfxHitRing(x,y,crit?0xffd166:0xff9ec4,crit);
    this.popDmg(Math.round(amount),x,y,crit); if(e.hp<=0) this.killEnemy(e); }
  killEnemy(e){ if(e._dashTel){this.tweens.killTweensOf(e._dashTel);e._dashTel.destroy();e._dashTel=null;} if(e._memoryToken)this.resolveMemoryMark(e);const isBoss=e.isBoss,isMini=e.isMini,isElite=e.isElite,big=isBoss||isMini,wasWaveTarget=!!e._waveObjectiveTarget;this.kills++;
    if(!big){this.stageKills=(this.stageKills||0)+1;if(this.killTxt)this.killTxt.setText('☠ '+this.stageKills);if(this.boss&&this.boss.active)this.applyBossRage(this.boss,true);
      // Juice: kill-streak — ฆ่าต่อเนื่องเร็ว = คอมโบไต่ขึ้น เด้งป็อป + เสียง pitch สูงขึ้นที่หมุดหมาย
      if(this.elapsed-(this._lastKillAt??-9)>1.6)this.killStreak=0;
      this.killStreak=(this.killStreak||0)+1; this._lastKillAt=this.elapsed;
      if(STREAK_MARKS[this.killStreak])this.showKillStreak(this.killStreak);
    }
    if(isElite||isMini)this.hitStop(45);   // Juice: ฆ่าตัวใหญ่/elite = กระแทกหยุดเสี้ยววิ (บอสมีฉากตายของตัวเอง)
    // 🧪 currency ให้คนขยัน: elite = ลุ้นดWaitป · Miniboss = การันตี (เกรดตามความยาก)
    if(isMini) this.grantCurrencyReward(1+Math.floor(Math.random()*2),this.currencyTierFor(),'🧪 Miniboss Down!');
    else if(isElite && Math.random()<0.5) this.grantCurrencyReward(1,this.currencyTierFor(),null);
    if(this.player.lifesteal) this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.lifesteal);   // ดูดเลือด (พรสวรรค์)
    if(this.player.lifeOnKill&&(!this._lifeOnKillCd||this._lifeOnKillCd<=0)){this.player.hp=Math.min(this.player.maxhp,this.player.hp+this.player.lifeOnKill*(this.player.healEffect||1));this._lifeOnKillCd=0.45;}
    if(!big) Sfx.pop();
    // Bestiary: นับจำนวนที่ฆ่าตามชนิด
    const si=Math.min(5,Math.max(0,this.stageIndex||0));
    const btype=isBoss?('boss'+si):isMini?('mini'+si):e.acid?'acid':e.dasher?'dasher':e.siege?'siege':e.shooter?'shooter':e.bomber?'bomber':(e.texture.key==='e_fast'?'fast':e.texture.key==='e_tank'||isElite?'tank':'basic');
    const bSugar=Save.addKill(btype);
    if(bSugar){ this.showBanner('📖 Codex Rank Unlocked','+🍬 '+bSugar,1100); Sfx.chest&&Sfx.chest(); }
    const deathColor=big?0xffd166:(isElite?0xffb15a:(e.texture.key==='e_tank'?0x8b5cf0:0xffd166));
    this.burst(e.x,e.y,deathColor);
    this.vfxDeathPoof(e.x,e.y,deathColor,big||isElite);
    if(big){ this.screenShake(isBoss?400:220,isBoss?0.012:0.008); this.burst(e.x,e.y,0xff9ec4); if(isMini)Sfx.clear(); }
    if(e._aura){ e._aura.destroy(); e._aura=null; }   // เก็บออร่าEnraged
    if(e._phaseShieldFx){this.tweens.killTweensOf(e._phaseShieldFx);if(e._phaseShieldFx.active)e._phaseShieldFx.destroy();e._phaseShieldFx=null;}
    e._phaseInvuln=0;e._phaseGateLocked=false;
    if(e._hungerOrbs){e._hungerOrbs.forEach(o=>{if(o&&o.active)o.destroy();});e._hungerOrbs=null;}
    if(e._hungerHalo){e._hungerHalo.forEach(o=>{if(o&&o.active)o.destroy();});e._hungerHalo=null;}
    this.stage5DeathGhost(e);
    this.chapter2DeathGhost(e);
    if(isBoss) this.bossDefeat(e.x,e.y);   // ฉากบอสตายอลังการ
    this.dropOrb(e.x,e.y,e.xp||1);   // ออร์บเดียวต่อศัตรู · สีบอกค่า EXP (ไม่สแปมหลายเม็ด)
    if(isBoss||isMini||(isElite&&Math.random()<0.18)) this.dropHeal(e.x+Phaser.Math.Between(-10,10),e.y+Phaser.Math.Between(-10,10));  // หัวใจเป็นรางวัลตัวอันตรายเท่านั้น · มอนสเตอร์ธรรมดาไม่ดWaitป
    // กล่องสูตรลับ (เลือกเอง 1 ใบ) — RNG จากการฆ่ามอนสเตอร์: elite 5% · ธรรมดา 0.6% (บอส/มินิมีกล่องของตัวเองแล้ว)
    if(!isBoss&&!isMini&&this.chests&&this.chests.countActive(true)<3){ const rate=(isElite?0.05:0.006)*(this._boxLuckMul||1); if(Math.random()<rate)this.spawnChest(e.x,e.y,'pick'); }
    if(isMini||(isElite&&Math.random()<0.12)||(!big&&Math.random()<0.008)) this.spawnVac(e.x,e.y);   // ไอเทมMagnet (สุ่มน้อย · มินิแน่นอน)
    if((isMini&&Math.random()<0.25)||(isElite&&Math.random()<0.06)) this.spawnLoot(e.x,e.y,isMini?2:1); // ตัวใหญ่เพิ่มโอกาส Rare/Epic
    // bomber: ระเบิดตอนตาย (เตือนสั้น ๆ ด้วยวง แล้วโดนถ้าอยู่ใกล้)
    if(e.bomber){ const bx=e.x,by=e.y, r=70;
      const ring=this.camWorld(this.add.image(bx,by,'vfx_ring').setTint(0xff7a4d).setDepth(3).setScale(0.08).setAlpha(0.85));
      this.tweens.add({targets:ring,scale:(r*2)/256,alpha:0,duration:260,onComplete:()=>ring.destroy()});
      this.burst(bx,by,0xff8b6b); Sfx.boom();
      if(this.dist(this.player.x,this.player.y,bx,by)<r) this.hurtPlayer(Math.round(12+this.stageIndex*4),0.5); }
    // เก็บ Sugar (สกุลเงินเมต้า ใช้Waitบหน้า)
    const sug=Math.max(1,Math.round((isBoss?40:isMini?18:isElite?4:1)*this.diffMul().reward)); this.sugarStage+=sug; this.sugarRun+=sug;   // ยิ่งยาก Sugar ยิ่งเยอะ
    if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);   // UpdatesเงินWaitบนี้แบบ realtime
    this.clearObjectiveTargetFx(e);if(wasWaveTarget)this.onWaveObjectiveTargetDown(e);
    if(e._dashTel){this.tweens.killTweensOf(e._dashTel);e._dashTel.destroy();e._dashTel=null;}
    e.setActive(false).setVisible(false); if(e.body)e.body.enable=false; e.isBoss=false; e.isMini=false; e.isElite=false; e.shooter=false; e.bomber=false; e.acid=false; e.dasher=false; e.siege=false; e.dashState=null;e._waveObjectiveTarget=false;e.bloomStacks=0;e.bloomUntil=0;e._memoryToken=null;e._memoryStored=0;e._decoyT=0;e.clearTint();e.setScale(1);
    if(isBoss){ // หน่วงเปิดกล่องรางวัลให้เห็นฉากบอสตาย (bossDefeat) ก่อน — ไม่งั้นหน้าสรุปเด้งทับทันที
      const bx=e.x,by=e.y; this.mode='reward'; this.boss=null; this.clearFoes(); this.bossUI.forEach(o=>o.setVisible(false));
      this.scheduleStageEvent(1600,'reward',()=>this.onBossDown(bx,by)); return; }   // Waitจนพ้นหน้าเลเวลอัพ/กล่องสุ่มก่อนเปิดหน้ารางวัล (กันทับหน้าการ์ด)
    if(isMini){ this.spawnChest(e.x,e.y,'mini');this.onWaveCleared(); return; }   // Minibossตาย = ดWaitปกล่องสกิล 1 ใบแน่นอน แล้วผ่านเวฟ
  }
  killBullet(b){ b.setActive(false).setVisible(false); if(b.body){b.body.enable=false; b.body.stop();} }
  // ของสำคัญมีฮาโล+วงชีพจรให้อ่านชัด โดยไม่ดึงเข้าหาผู้เล่น เพื่อเก็บไว้ใช้ภายหลังได้
  showPickupCue(o,color,baseScale){
    if(!o)return;this.hidePickupCue(o);o._pickupColor=color;o._pickupBaseScale=baseScale||1;
    // ปรับให้ไอเทมมี "ขนาดบนสนาม" คงที่ตาม native width (กันอาร์ต SVG/PNG ความละเอียดสูงเช่น gear_gift.svg 256px โผล่ใหญ่เกินจอ)
    const nativeW=(o.width||36),target=o._pickupBaseScale*36; o.setScale(nativeW>0?target/nativeW:o._pickupBaseScale).setDepth(80000);
    o._pickupGlow=this.camWorld(this.add.image(o.x,o.y,'vfx_glow').setTint(color).setDepth(79980).setAlpha(0.32).setScale(0.30));
    o._pickupRing=this.camWorld(this.add.image(o.x,o.y,'vfx_ring').setTint(color).setDepth(79981).setAlpha(0.66).setScale(0.20));
  }
  hidePickupCue(o){if(!o)return;for(const k of ['_pickupGlow','_pickupRing']){const q=o[k];if(q){this.tweens.killTweensOf(q);if(q.active)q.destroy();o[k]=null;}}}
  updatePickupReadability(){
    const groups=[this.heals,this.vacs,this.loots,this.chests,this.gimmicks];
    for(const grp of groups){if(!grp)continue;grp.children.iterate(o=>{if(!o||!o.active)return;const pulse=1+Math.sin(this.elapsed*5+(o.x||0)*0.03)*0.12;
      if(o._pickupGlow)o._pickupGlow.setPosition(o.x,o.y+3).setScale(0.30*pulse).setAlpha(0.25+0.10*pulse);
      if(o._pickupRing)o._pickupRing.setPosition(o.x,o.y+5).setScale(0.20+0.035*pulse).setAlpha(0.48+0.16*pulse).setRotation(this.elapsed*0.7);
      // ฮาโลและการลอยช่วยให้อ่านออก แต่ไม่ดึงไอเทมเข้าหาตัว ผู้เล่นจึงเก็บหัวใจ/Magnetไว้ใช้ภายหลังได้
      if(o.body)o.setVelocity(0,0);
    });}
  }
  // สีออร์บตามค่า EXP: ยิ่งค่ามาก สียิ่งพรีเมียม (เขียว→ฟ้า→ม่วง→ทอง) + เม็ดใหญ่ขึ้น
  orbStyle(v){
    if(v>=20) return {tint:0xffd75e, sc:2.05};   // ทอง = ค่าสูงสุด (บอส)
    if(v>=10) return {tint:0xb98cff, sc:1.75};  // ม่วง
    if(v>=5)  return {tint:0x7fc9ff, sc:1.55};  // ฟ้า
    if(v>=2)  return {tint:0x8be6a4, sc:1.38};   // เขียว
    return {tint:0xffffff, sc:1.22};              // ขาว/ชมพู = 1 (Normal)
  }
  dropOrb(x,y,value){ value=value||1; let o=this.orbs.getFirstDead(false);
    if(!o) o=this.orbs.create(x,y,'candy'); else { o.setActive(true).setVisible(true); o.body.enable=true; o.setPosition(x,y); }
    if(!o)return;   // pool Full (maxSize) → ข้าม กันอ่าน .body ของ null (crash ตอน x3 มอนตายเยอะ)
    const st=this.orbStyle(value); o.value=value; o._vac=false; o.setTint(st.tint); o._sc=st.sc; o.setRotation(0).setDepth(80000);
    o.body.setAllowGravity(false); o.setScale(st.sc); this.camWorld(o); }
  collectOrb(player,o){ if(!o.active)return; const ox=o.x,oy=o.y,ov=o.value||1; o.setActive(false).setVisible(false); if(o.body)o.body.enable=false; o.clearTint(); Sfx.xp(); this.jelly(0.9,-0.9);
    this.vfxCollectSparkle(ox,oy,this.orbStyle(ov).tint); this.gainXp(ov); }
  // ---- ไอเทมฟื้นฟู HP ----
  dropHeal(x,y){ let h=this.heals.getFirstDead(false);
    if(!h) h=this.heals.create(x,y,'heal'); else { h.setActive(true).setVisible(true); h.body.enable=true; h.setPosition(x,y); }
    if(!h)return;
    h.body.setAllowGravity(false); this.camWorld(h); this.showPickupCue(h,0xff5f97,1.35); if(this.iso)h.setDepth(Math.max(80000,h.y));
    this.tweens.add({targets:h,y:y-10,duration:560,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectHeal(player,h){ if(!h.active)return; this.tweens.killTweensOf(h); this.hidePickupCue(h); h.setActive(false).setVisible(false); if(h.body)h.body.enable=false;
    const amt=Math.round((this.player.maxhp*0.18+6)*(this.player.healEffect||1)); this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);
    Sfx.heal(); this.jelly(0,2.2); this.popHeal(this.player.x,this.player.y,amt); this.burst(h.x,h.y,0xff8fb5); this.vfxCollectSparkle(h.x,h.y,0xff8fb5);
    if(this.textures.exists('fx_heal')&&this.anims.exists('fx_heal')) this.spawnFxAnim('fx_heal',this.player.x,this.player.y,{scale:150/ASSET_FX.fx_heal.fw,depth:8,anchor:'center'}); }
  popHeal(x,y,n){ const t=this.camWorld(this.add.text(x,y-20,'+'+n+' HP',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#8bffb0'}).setDepth(20).setOrigin(0.5));
    this.tweens.add({targets:t,y:y-56,alpha:0,duration:700,onComplete:()=>t.destroy()}); }
  // ---- กล่อง/โหลทุบได้ (ธีมครัว) ----
  spawnCrate(){ const ang=Math.random()*Math.PI*2, rad=Math.max(this.W,this.H)/this.viewZoom*(0.25+Math.random()*0.3);
    const x=this.player.x+Math.cos(ang)*rad, y=this.player.y+Math.sin(ang)*rad;
    let c=this.crates.getFirstDead(false);
    if(!c) c=this.crates.create(x,y,'crate'); else { c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    if(!c)return;
    c.body.setAllowGravity(false); c.body.setImmovable(true); c.setCircle(18,4,4); c.hp=14+this.stageIndex*6; c.maxhp=c.hp; c.setScale(1.12).clearTint(); this.camWorld(c); if(this.iso)c.setDepth(c.y);
    this.tweens.add({targets:c,scale:{from:0.2,to:1},duration:220,ease:'Back.out'}); }
  // ดาเมจใส่กล่อง (รวม flat damage) + Effect + แตก — ใช้ร่วมทั้งกระสุนและ AoE
  crateHit(c,amount){ if(!c||!c.active)return; c.hp-=amount+(this.player.flatDmg||0);
    c.setTintFill(0xffffff); this.time.delayedCall(50,()=>{ if(c.active)c.clearTint(); });
    if(c.hp<=0) this.breakCrate(c); }
  hitCrate(bullet,c){ if(!c.active||!bullet.active)return;
    this.crateHit(c,(bullet.dmg||5)*this.player.dmgMul);
    if(!bullet.pierce) this.killBullet(bullet); }
  // skills AoE (ระเบิด/ฟ้าผ่า/ออร่า ฯลฯ) ก็ต้องตีกล่องแตกได้ด้วย (แก้บั๊กบางสกิลตีกล่องไม่โดน)
  hitCratesInRadius(x,y,r,amount){ if(this.crates)this.crates.children.iterate(c=>{ if(c&&c.active&&this.dist(c.x,c.y,x,y)<r+18) this.crateHit(c,amount); });
    // แกนคำสาป (purge) โดนสกิล AoE ด้วย — ไม่งั้นตัวที่ไม่ยิงกระสุน (ทาโร่ฟ้าผ่า/มินต์แช่/โกโก้/งาดำ) ทำลายไม่ได้
    if(this.waveNodes)this.waveNodes.children.iterate(n=>{ if(n&&n.active&&n._waveObjectiveNode&&this.dist(n.x,n.y,x,y)<r+18){ n.hp-=amount; this.popDmg(Math.round(amount),n.x,n.y,false); this.vfxHitRing(n.x,n.y,this.waveObjective?.color||0xffd166,false); if(n.hp<=0)this.destroyWaveObjectiveNode(n); } }); }
  breakCrate(c){ const x=c.x,y=c.y; this.tweens.killTweensOf(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false;
    this.burst(x,y,0xe59a4d); Sfx.boom(); this.screenShake(90,0.004);
    this.dropOrb(x,y, 3+Phaser.Math.Between(0,this.stageIndex*2));   // ดWaitปออร์บ
    if(Math.random()<0.28) this.dropHeal(x+Phaser.Math.Between(-12,12),y+Phaser.Math.Between(-12,12));   // โอกาสดWaitปฟื้นฟู (ลดจากครึ่งนึง ให้หัวใจหายากขึ้น)
    if(Math.random()<0.10) this.spawnLoot(x,y);   // โอกาสเล็ก ๆ ได้ของสวมใส่ (low tier)
    if(Math.random()<0.07) this.spawnVac(x,y);    // โอกาสเล็ก ๆ ได้Magnet
    if(Math.random()<0.25){ this.sugarStage+=3; this.sugarRun+=3; if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun); }
  }
  // ---- ไอเทมกิมมิคประจำด่าน: ไม่ถูกดูดอัตโนมัติและค้างไว้ให้วางแผนเก็บ ----
  spawnStageGimmick(){
    const def=STAGE_GIMMICKS[this.stageIndex]||STAGE_GIMMICKS[0],a=Math.random()*Math.PI*2,r=Phaser.Math.Between(150,240),x=this.player.x+Math.cos(a)*r,y=this.player.y+Math.sin(a)*r;
    let g=this.gimmicks.getFirstDead(false);if(!g)g=this.gimmicks.create(x,y,this.textures.exists(def.tex)?def.tex:'gift');else{g.setTexture(this.textures.exists(def.tex)?def.tex:'gift');g.setActive(true).setVisible(true);if(g.body)g.body.enable=true;g.setPosition(x,y);}
    if(!g)return;g.gimmickStage=this.stageIndex;g.body.setAllowGravity(false);this.camWorld(g);this.showPickupCue(g,def.color,def.tex==='bubble'?1.15:0.72);if(this.iso)g.setDepth(Math.max(80000,g.y));this.tweens.add({targets:g,y:y-12,duration:620,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    this.showBanner(def.emoji+' found '+def.name,def.desc+' · save it for key moments',1300);
  }
  collectStageGimmick(player,g){
    if(!g.active)return;const stage=g.gimmickStage==null?this.stageIndex:g.gimmickStage,def=STAGE_GIMMICKS[stage]||STAGE_GIMMICKS[0],x=g.x,y=g.y;this.tweens.killTweensOf(g);this.hidePickupCue(g);g.setActive(false).setVisible(false);if(g.body)g.body.enable=false;
    if(stage===0){this.orbs.children.iterate(o=>{if(o&&o.active&&this.dist(o.x,o.y,this.player.x,this.player.y)<520){const a=Math.atan2(this.player.y-o.y,this.player.x-o.x);o.setVelocity(Math.cos(a)*480,Math.sin(a)*480);o._vac=true;}});}
    else if(stage===1){this.moveSlowT=0;this.player.iframe=Math.max(this.player.iframe,2.2);const amt=Math.round(this.player.maxhp*0.12);this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);this.popHeal(this.player.x,this.player.y,amt);}
    else if(stage===2){for(const k in this.skillCd)this.skillCd[k]=0;this.uniqueCd=0;this.pathHasteT=Math.max(this.pathHasteT||0,5);}
    else if(stage===3){this.enemies.children.iterate(e=>{if(e&&e.active)e.frozen=Math.max(e.frozen||0,e.isBoss?0.8:2.8);});}
    else if(stage===5){this.moveSlowT=0;for(const k in this.skillCd)this.skillCd[k]=Math.min(this.skillCd[k],0.25);this.uniqueCd=Math.min(this.uniqueCd||0,1);this.pathHasteT=Math.max(this.pathHasteT||0,4);const amt=Math.round(this.player.maxhp*0.16);this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);this.popHeal(this.player.x,this.player.y,amt);}
    else{const amt=Math.round(this.player.maxhp*0.2);this.player.hp=Math.min(this.player.maxhp,this.player.hp+amt);this.sugarStage+=12;this.sugarRun+=12;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);this.popHeal(this.player.x,this.player.y,amt);}
    this.burst(x,y,def.color);this.vfxCollectSparkle(x,y,def.color);this.showBanner(def.emoji+' '+def.name,def.desc,1250);Sfx.clear();
  }

  // ---- ไอเทมMagnet (vacuum): เก็บแล้วดูดออร์บ EXP ทั้งจอเข้าตัวทันที ----
  spawnVac(x,y){ let v=this.vacs.getFirstDead(false);
    if(!v) v=this.vacs.create(x,y,'vac'); else { v.setActive(true).setVisible(true); v.body.enable=true; v.setPosition(x,y); }
    if(!v)return;
    v.body.setAllowGravity(false); this.camWorld(v); this.showPickupCue(v,0xff5a6e,1.40); if(this.iso)v.setDepth(Math.max(80000,v.y));
    this.tweens.add({targets:v,y:y-10,duration:540,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectVac(player,v){ if(!v.active)return; this.tweens.killTweensOf(v); this.hidePickupCue(v); v.setActive(false).setVisible(false); if(v.body)v.body.enable=false;
    Sfx.heal(); this.burst(v.x,v.y,0xff5a6e); this.showBanner('🧲 Magnet!','Vacuum all EXP orbs on screen',1200);
    this.orbs.children.iterate(o=>{ if(o&&o.active){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x); o.setVelocity(Math.cos(ang)*520,Math.sin(ang)*520); o._vac=true; } });
  }
  // ---- ของสวมใส่ดWaitป: rarity ตามStage ความยาก และชนิดศัตรู ----
  spawnLoot(x,y,boost=0){ let g=this.loots.getFirstDead(false);
    if(!g) g=this.loots.create(x,y,'gift'); else { g.setActive(true).setVisible(true); g.body.enable=true; g.setPosition(x,y); }
    if(!g)return;g.lootTier=rollFieldGearTier(this.stageIndex,this.stageDiff||1,boost);const rarity=FIELD_DROP_TABLE[g.lootTier]||FIELD_DROP_TABLE.common;
    g.body.setAllowGravity(false);g.setTint(rarity.color);this.camWorld(g);this.showPickupCue(g,rarity.color,1.32); if(this.iso)g.setDepth(Math.max(80000,g.y));
    this.tweens.add({targets:g,y:y-11,duration:520,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectLoot(player,g){ if(!g.active)return; this.tweens.killTweensOf(g); this.hidePickupCue(g); g.setActive(false).setVisible(false); if(g.body)g.body.enable=false;
    const tier=g.lootTier||'common',rarity=FIELD_DROP_TABLE[tier]||FIELD_DROP_TABLE.common;g.clearTint();Sfx.select();this.burst(g.x,g.y,rarity.color);
    const got=this.grantGear(tier);
    // 🧪 currency ดWaitปพร้อมของ (ยิ่ง tier สูงยิ่งดี — เคารพกฎเหล็ก)
    const ck=this.rollCurrencyDrop(tier); if(ck)Save.addCurrency(ck,1);
    const cn=ck?(' · '+(currencyDef(ck).emoji)+currencyDef(ck).name):'';
    if(got)this.showBanner(rarity.emoji+' '+rarity.name+' DROP!',GEAR_SLOTS.find(s=>s.slot===got.slot).emoji+' '+got.name+' · '+TIER_LABEL[tier].name+gearDeliverySuffix(got)+cn,2000);
    else {const refund=tier==='legend'?90:tier==='epic'?60:tier==='rare'?25:8;const sh=tier==='legend'?12:tier==='epic'?6:tier==='rare'?3:1;this.sugarStage+=refund;this.sugarRun+=refund;Save.addShards(sh);if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);this.showBanner('🎁 Duplicate','Converted to 🍬 +'+refund+' · 🔩 +'+sh+cn,1300);}
  }
  // สุ่ม currency ดWaitปตาม tier ของ loot (นรก/ของสูง = ได้ orb ระดับสูง)
  rollCurrencyDrop(tier){
    if(Math.random()>0.72)return null;
    return rollWeightedCurrency(tier);
  }
  // เกรด orb pool ตามความยาก+Stage (คนขยัน/เล่นยาก ได้ของดี — กฎเหล็ก)
  currencyTierFor(){ const diff=this.stageDiff||1, st=this.stageIndex||0; if(diff>=3)return 'legend'; if(diff>=2)return st>=3?'legend':'epic'; return st>=3?'epic':'rare'; }
  // แจก currency แน่นอน N ชิ้น (ข้าม 28% miss ของ rollCurrencyDrop) + แบนเนอร์
  grantCurrencyReward(n,tier,head){
    if(n>0)n=Math.max(1,Math.round(n*(this._currencyLuckMul||1)));   // Fortune perk
    const got={}; for(let i=0;i<n;i++){ const k=rollWeightedCurrency(tier); got[k]=(got[k]||0)+1; Save.addCurrency(k,1); }
    if(head&&this.showBanner){ const txt=Object.keys(got).map(k=>currencyDef(k).emoji+'×'+got[k]).join(' '); this.showBanner(head,txt,1800); } return got; }
  // ---- หีบสมบัติ (ดWaitปจากบอส) → เดินไปเก็บ = เปิดหน้าสุ่มสกิล ----
  spawnChest(x,y,kind){ let c=this.chests.getFirstDead(false);
    if(!c) c=this.chests.create(x,y,'chest'); else { c.setActive(true).setVisible(true); c.body.enable=true; c.setPosition(x,y); }
    if(!c)return;
    c.rewardKind=kind||'level';c.body.setAllowGravity(false); this.camWorld(c); this.showPickupCue(c,kind==='mini'?0xd58cff:kind==='pick'?0x66e0ff:0xffd166,1.42); if(this.iso)c.setDepth(Math.max(80000,c.y));
    this.tweens.add({targets:c,y:y-12,duration:500,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
  collectChest(player,c){ if(!c.active)return; this.tweens.killTweensOf(c); this.hidePickupCue(c); c.setActive(false).setVisible(false); if(c.body)c.body.enable=false;
    if(c._glow){ this.tweens.killTweensOf(c._glow); c._glow.destroy(); c._glow=null; }
    Sfx.clear(); this.burst(c.x,c.y,0xffd166); this.screenFlash(0xffe08a,0.4,300);
    const kind=c.rewardKind;c.rewardKind=null;
    if(kind==='mini'){this.openRollBox('🎁 Miniboss Box');return;}   // Miniboss = สุ่มให้ + อนิเมชันหมุน
    if(kind==='pick'){this._chestReward=false; this.pendingLvl=(this.pendingLvl||0)+1; this.openLevelUp(); return;}   // กล่องในแมพ = เลือกเอง 1 ใบ
    this._chestReward=true; this.pendingLvl=(this.pendingLvl||0)+1; this.openLevelUp(); }
  // กล่องสุ่ม (Miniboss): หมุนสล็อตแล้วลงที่รางวัลเดียว — ตื่นเต้นกว่าเลือกเอง
  openRollBox(titleText){
    const winner=(this.rollUpgrades(1,{noSpecial:true})||[])[0];
    if(!winner){ const sugar=40;this.sugarStage+=sugar;this.sugarRun+=sugar;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);this.showBanner('🎁 Random Box','Upgrades maxed · Sugar +'+sugar,1800);return; }
    const reel=[winner]; for(let i=0;i<7;i++){ const r=(this.rollUpgrades(1,{noSpecial:true})||[])[0]; if(r)reel.push(r); }
    this.playRollAnimation(reel,winner,titleText||'🎁 Random Box',()=>{ winner.apply(); });
  }
  playRollAnimation(reel,winner,titleText,onDone){
    if(this.state==='rolling')return;
    this._prevRollState=this.state; this.state='rolling'; this.physics.pause();
    const w=this.W,h=this.H;
    const cont=this.add.container(0,0).setScrollFactor(1).setDepth(95); this.camUI(cont);
    const bg=this.add.rectangle(0,0,w,h,0x120c1a,0.82).setOrigin(0,0);
    const ttl=this.add.text(w/2,h*0.26,titleText,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'22px',color:'#ffd166'}).setOrigin(0.5);
    const cardW=Math.min(w-70,300),cardH=132,cx=w/2,cy=h*0.5;
    const g=this.add.graphics(); const drawCard=(color)=>{g.clear();g.fillStyle(0x241a33,0.98);g.fillRoundedRect(cx-cardW/2,cy-cardH/2,cardW,cardH,18);g.lineStyle(3,color||0xffd166,0.95);g.strokeRoundedRect(cx-cardW/2,cy-cardH/2,cardW,cardH,18);};
    drawCard(0xffd166);
    const em=this.add.text(cx,cy-24,'🎁',{fontSize:'46px'}).setOrigin(0.5);
    const nm=this.add.text(cx,cy+34,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'16px',color:'#ffffff',align:'center',wordWrap:{width:cardW-24}}).setOrigin(0.5);
    const sub=this.add.text(w/2,cy+cardH/2+22,'Rolling...',{fontFamily:'sans-serif',fontSize:'12px',color:'#c7bdd6'}).setOrigin(0.5);
    cont.add([bg,ttl,g,em,nm,sub]);
    const delays=[45,45,50,55,65,80,100,125,155,195,245,310]; let step=0;
    const show=(card)=>{ drawCard(card.color||0xffd166); em.setText(card.emoji||'🎁'); nm.setText(card.title||''); em.setScale(1); this.tweens.add({targets:em,scale:{from:0.8,to:1},duration:90}); if(Sfx.select)Sfx.select(); };
    const tick=()=>{
      const last=step>=delays.length-1;
      show(last?winner:Phaser.Utils.Array.GetRandom(reel));
      if(last){ this.time.delayedCall(240,()=>this.landRollBox(cont,g,em,nm,sub,cx,cy,cardW,cardH,winner,onDone)); return; }
      this.time.delayedCall(delays[step++],tick);
    };
    tick();
  }
  landRollBox(cont,g,em,nm,sub,cx,cy,cardW,cardH,winner,onDone){
    g.clear();g.fillStyle(0x2c2038,1);g.fillRoundedRect(cx-cardW/2,cy-cardH/2,cardW,cardH,18);g.lineStyle(4,winner.color||0xffd166,1);g.strokeRoundedRect(cx-cardW/2,cy-cardH/2,cardW,cardH,18);
    sub.setText('✨ '+(winner.desc||'Reward received!')).setColor('#ffe08a');
    this.tweens.add({targets:[em,nm],scale:{from:1.25,to:1},duration:320,ease:'Back.out'});
    this.screenFlash(winner.color||0xffe08a,0.35,300); if(Sfx.clear)Sfx.clear(); this.burst(this.player.x,this.player.y,winner.color||0xffd166); this.vfxLevelUp&&this.vfxLevelUp();
    this.time.delayedCall(950,()=>{
      this.tweens.add({targets:cont,alpha:0,duration:220,onComplete:()=>{cont.destroy(true);
        this.state=this._prevRollState==='rolling'?'play':(this._prevRollState||'play'); if(this.state!=='paused')this.physics.resume();
        if(onDone)onDone();
      }});
    });
  }
  openMiniSkillChest(){
    const r=Math.random(),wanted=r<0.46?2:r<0.78?3:r<0.94?4:5,pool=Phaser.Utils.Array.Shuffle(Object.keys(this.skills).filter(k=>SKILLDEFS[k]&&this.skills[k]<SKILLDEFS[k].max)),chosen=pool.slice(0,wanted);
    if(!chosen.length){const sugar=35;this.sugarStage+=sugar;this.sugarRun+=sugar;if(this.runSugarTxt)this.runSugarTxt.setText('🍬 '+this.sugarRun);this.showBanner('🎁 Miniboss Box','Skills maxed · converted to Sugar +'+sugar,2200);return;}
    chosen.forEach(k=>{this.skills[k]++;if(k==='star')this.rebuildRing();});this.buildSkillBar();const names=chosen.map(k=>SKILLDEFS[k].emoji+' '+SKILLDEFS[k].name+' Lv'+this.skills[k]).join(' · ');
    this.showBanner('🎁 Miniboss Box · upgrade '+chosen.length+' skills',names,3000);this.vfxLevelUp();
  }
  // มอบของสวมใส่ตาม tier (สุ่มชิ้นที่ยังNone) — คืน item หรือ null ถ้ามีครบแล้ว
  grantGear(tier){ const sourceStage=this.state==='play'?this.stageIndex:(Save.data.unlockedStage||0),chapter=itemChapterForStage(sourceStage);
    let pool=gearPool(tier,chapter); if(!pool.length&&tier==='common')pool=gearPool('rare',chapter); if(!pool.length)return null;
    const it=Phaser.Utils.Array.GetRandom(pool),itemLevel=rollItemLevel(sourceStage,this.state==='play'?(this.difficulty||1):2),delivery=Save.receiveGearInstance(it.id,{isNew:true,itemLevel,chapter});
    return delivery?Object.assign({},it,{instance:delivery.item,delivery:delivery.destination,shards:delivery.shards||0}):null; }
  gachaRoll(){ const r=Math.random(), roll=r<0.50?'common':r<0.80?'rare':r<0.95?'epic':'legend';   // 50% common · 30% rare · 15% epic · 5% legend
    for(const t of [roll,'epic','rare','common','legend']){ const it=this.grantGear(t); if(it)return it; } return null; }
  touchEnemy(player,e){ if(!e.active||this.player.iframe>0)return;
    if(this._inTutorial){ this.player.iframe=0.3; const a=Math.atan2(this.player.y-e.y,this.player.x-e.x); this.player.setVelocity(Math.cos(a)*180,Math.sin(a)*180); return; }   // ระหว่างสอน = ไม่เสียเลือด แค่กระเด้งเบา ๆ
    if(e.frostbite)this.moveSlowT=Math.max(this.moveSlowT||0,0.75);
    this.player.iframe=0.6; const wardMul=this.player.wardGuardT>0?0.70:1; const edmg=Number.isFinite(e.dmg)?e.dmg:10; this.player.hp-=edmg*(this.player.dmgTakenMul||1)*wardMul; Sfx.hurt(); this.screenShake(120,0.008);   // guard e.dmg NaN (กัน HP กลายเป็น NaN)
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>this.player.clearTint());
    this._sqX=0.7; this._sqY=1.3; this.poseFlash(CF.hurt,260);   // โดนตี = หน้าเจ็บ (เจลลี่แบน)
    const ang=Math.atan2(this.player.y-e.y,this.player.x-e.x); this.player.setVelocity(Math.cos(ang)*260,Math.sin(ang)*260); this.dashTime=0.12;
    if(this.player.hp<=0) this.die(); }
  // โดนกระสุน/สแลม/hazard ของศัตรู (iframe สั้นกว่า → หลบยาก)
  hurtPlayer(dmg,ix){ if(this.state!=='play'||this.player.iframe>0)return;
    if(this._inTutorial)return;   // ระหว่างสอน = Invincible (freeze safe zone) ผู้เล่นใหม่จะได้ไม่ตายตอนเรียน
    if(!Number.isFinite(dmg))dmg=10;   // guard NaN
    dmg*=(this.player.dmgTakenMul||1)*(this.player.wardGuardT>0?0.70:1);   // เกราะ + เขตคำสัตย์
    this.player.iframe=ix||0.5; this.player.hp-=dmg; Sfx.hurt(); this.screenShake(150,0.009);
    this._sqX=0.72; this._sqY=1.28; this.poseFlash(CF.hurt,260);
    this.vfxHurtFlash();
    this.vfxHitRing(this.player.x,this.player.y,0xff5a6e,false);
    this.player.setTintFill(0xff8080); this.time.delayedCall(90,()=>{ if(this.player.active)this.player.clearTint(); });
    if(this.player.hp<=0) this.die(); }
  hitByFoe(player,b){ if(!b.active)return; if(b.frost)this.moveSlowT=Math.max(this.moveSlowT||0,0.9); this.killFoe(b); this.hurtPlayer(b.dmg||10,0.5); }
  killFoe(b){ b.setActive(false).setVisible(false); if(b.body){ b.body.enable=false; b.body.stop(); } }
  // ยิงกระสุนศัตรู 1 นัด
  foeShot(x,y,ang,speed,dmg,tint,scale){
    let b=this.foeBullets.getFirstDead(false);
    if(!b) b=this.foeBullets.create(x,y,'proj_enemy'); else { b.setActive(true).setVisible(true); if(b.body)b.body.enable=true; b.setPosition(x,y); }
    if(!b)return null;   // pool Full → ข้ามการยิง กัน null crash
    b.setTexture('proj_enemy').setScale((scale||1.4)*0.34).setRotation(ang).setDepth(90000);
    if(this.stageIndex===0)b.clearTint(); else b.setTint(tint||0xff6b8a);
    if(b.body){b.body.setAllowGravity(false);} b.dmg=dmg; b.frost=this.stageIndex===3; b.life=3.0; this.camWorld(b);
    if(b.body)this.physics.velocityFromRotation(ang,speed,b.body.velocity); return b; }
  // hazard บอส: วงเตือน vector โปร่งใสจริง → ระเบิดหลัง 760ms
  spawnHazard(x,y,r,dmg,tint){
    const color=tint||0xff5a4d;
    const warn=this.camWorld(this.add.image(x,y,'vfx_telegraph').setDepth(2).setScale((r*2)/256*0.94).setTint(color).setAlpha(0.65));
    const inner=this.camWorld(this.add.image(x,y,'vfx_glow').setDepth(2).setScale((r*0.65)/256).setTint(color).setAlpha(0.18));
    this.tweens.add({targets:warn,alpha:{from:0.4,to:0.92},scale:{from:(r*2)/256*0.92,to:(r*2)/256*1.03},duration:190,yoyo:true,repeat:1});
    this.tweens.add({targets:inner,scale:(r*1.75)/256,alpha:{from:0.12,to:0.48},duration:700,ease:'Linear'});
    this.time.delayedCall(760,()=>{ if(this.state!=='play'&&this.state!=='levelup'){ warn.destroy();inner.destroy();return; }
      if(this.anims.exists('fx_bossnova'))this.spawnFxAnim('fx_bossnova',x,y,{scale:(r*2)/ASSET_FX.fx_bossnova.fw,depth:4,anchor:'center'});
      else { const boom=this.camWorld(this.add.image(x,y,'vfx_ring').setDepth(4).setTint(color).setScale((r*2)/256).setAlpha(0.9));
        this.tweens.add({targets:boom,alpha:0,scaleX:boom.scaleX*1.18,scaleY:boom.scaleY*1.18,duration:280,onComplete:()=>boom.destroy()}); }
      this.tweens.add({targets:[warn,inner],alpha:0,duration:180,onComplete:()=>{warn.destroy();inner.destroy();}});
      if(this.dist(this.player.x,this.player.y,x,y)<r+8)this.hurtPlayer(dmg,0.5);
      Sfx.boom();
    });
  }
  bossNovaWave(x,y,maxR,dmg,delay=0){
    this.time.delayedCall(delay,()=>{ if(this.state!=='play'&&this.state!=='levelup')return;
      let hitOnce=false;
      const wave=this.camWorld(this.add.image(x,y,'vfx_cream_ring').setTint(0xff8fb5).setDepth(4).setScale(20/256).setAlpha(0.95));
      const track={radius:10};
      this.tweens.add({targets:track,radius:maxR,duration:720,ease:'Quad.out',
        onUpdate:(tw)=>{ const rr=track.radius; wave.setScale((rr*2)/256).setAlpha(0.95*(1-tw.progress));
          const d=this.dist(this.player.x,this.player.y,x,y);
          if(!hitOnce&&Math.abs(d-rr)<28){hitOnce=true;this.hurtPlayer(dmg,0.6);} },
        onComplete:()=>wave.destroy()});
    });
  }

  spawnBossObject(kind,x,y,life=10){
    if(kind==='crystal'||kind==='obelisk')return null;   // เอา "pillar-summon skill" (ผลึก/โอเบลิสก์) ออกจากบอส/มอนทุกตัว — ยิงไกลโกง + น่ารำคาญ
    const map={hole:'nest_hole',egg:'nest_eggs',crystal:'nest_crystal',obelisk:'nest_obelisk',mound:'nest_mound',acid:'nest_acid'},key=map[kind];if(!key||!this.textures.exists(key))return null;
    let o=this.bossObjects.getFirstDead(false);if(!o)o=this.bossObjects.create(x,y,key);else{o.setTexture(key);o.setActive(true).setVisible(true);if(o.body)o.body.enable=true;o.setPosition(x,y);}
    if(!o)return null;o.kind=kind;o.life=life;o.tick=Phaser.Math.FloatBetween(1.0,1.9);o.hp=kind==='egg'?70:kind==='crystal'?68:kind==='obelisk'?95:kind==='mound'?150:999;o.maxhp=o.hp;   // ลด HP ให้ทำลายได้จริง (โดยเฉพาะสายดาเมจต่ำอย่าง Mint)
    o.setScale(kind==='acid'?0.34:kind==='egg'?0.54:0.66).setDepth(kind==='acid'?(y-100000):(y-1)).clearTint().setAlpha(kind==='acid'?0.5:1);this.camWorld(o);   // acid = บ่อพื้น ย่อเล็ก โปร่ง วางใต้ตัวละคร กันบังจอ
    const ghost=kind==='acid'||kind==='hole';if(o.body){o.body.setAllowGravity(false);o.body.setImmovable(!ghost);o.body.setSize(ghost?1:80,ghost?1:58,true);if(ghost)o.body.checkCollision.none=true;else o.body.checkCollision.none=false;}
    this.vfxSpawnPoof(x,y);return o;
  }
  hitBossObject(b,o){if(!b.active||!o.active||o.kind==='acid'||o.kind==='hole')return;const dmg=b.dmg||8;o.hp-=dmg;this.popDmg(Math.round(dmg),o.x,o.y,false);this.vfxHitRing(o.x,o.y,0x9dff45,false);if(!b.pierce)this.killBullet(b);if(o.hp<=0)this.killBossObject(o,false);}
  killBossObject(o,hatch){if(!o||!o.active)return;const k=o.kind,x=o.x,y=o.y,wasWeak=o._weak;this.burst(x,y,k==='egg'?0xffd0df:0x9dff45);o.setActive(false).setVisible(false);if(o.body){o.body.enable=false;o.body.checkCollision.none=false;}o.kind=null;o._weak=false;if(hatch){const n=k==='mound'?3:2;for(let i=0;i<n;i++)this.spawnEnemy(i%2?'acid':'fast');}
    if(wasWeak){this._weakCount=Math.max(0,(this._weakCount||1)-1);this.vfxHitRing(x,y,0xffe07a,true);if(this._weakCount<=0&&this._weakActive)this.time.delayedCall(50,()=>this.endWeakPoint(this.boss,true));}}
  // Objective ระหว่างสู้บอส/มินิ: บอสกางเกราะเป็นระยะ ต้องทำลาย "weak point" 3 pointsเพื่อทลายเกราะ (แก้เบื่อ)
  tickBossObjectiveGate(b){ return false; }   // ปิดระบบเกราะweak point (อิงเสาผลึกที่เอาออกแล้ว) — บอสซัดตรง ๆ ได้ตลอด
  tickBossObjective(dt){
    const b=this.boss; if(!b||!b.active)return;
    if(this._bossShieldFx&&this._bossShieldFx.active)this._bossShieldFx.setPosition(b.x,b.y);
    if(this._weakActive){ this._weakTimer-=dt; if(this._weakTimer<=0)this.endWeakPoint(b,false); return; }
    if(!this.tickBossObjectiveGate(b))return;   // เฉพาะเฟส 2+
    const frac=b.hp/b.maxhp; if(frac<0.15||frac>0.92)return;
    this._weakAcc=(this._weakAcc==null?16:this._weakAcc)-dt;
    if(this._weakAcc<=0)this.startWeakPoint(b);
  }
  startWeakPoint(b){
    this._weakActive=true;this._weakTimer=7;this._bossShield=true;this._weakCount=0;
    const n=2,rad=175;   // 3→2 points · โผล่นานสุด 7s (เดิม 9)
    for(let i=0;i<n;i++){const a=-Math.PI/2+i*Math.PI*2/n,o=this.spawnBossObject('crystal',b.x+Math.cos(a)*rad,b.y+Math.sin(a)*rad,12);if(o){o._weak=true;o.setTint(0xffe07a);this._weakCount++;}}
    if(this._weakCount===0){this._bossShield=false;this._weakActive=false;this._weakAcc=11;return;}   // ด่านNoneอาร์ต crystal → ข้าม
    this._bossShieldFx=this.camWorld(this.add.image(b.x,b.y,'vfx_ring').setTint(0xffe07a).setDepth(6).setDisplaySize(120,120).setAlpha(0.5));
    this.tweens.add({targets:this._bossShieldFx,alpha:{from:0.3,to:0.6},scale:{from:0.9,to:1.05},yoyo:true,repeat:-1,duration:520,ease:'Sine.inOut'});
    this.showBanner('🛡️ Boss Shielded!','Destroy the weak points: '+this._weakCount+' (gold) to break the shield!',2000);Sfx.bossWarn();
  }
  endWeakPoint(b,broken){
    this._weakActive=false;this._bossShield=false;this._weakAcc=broken?20:15;   // เว้นช่วงนานขึ้น (เกราะไม่ถี่)
    if(this._bossShieldFx){this.tweens.killTweensOf(this._bossShieldFx);if(this._bossShieldFx.active)this._bossShieldFx.destroy();this._bossShieldFx=null;}
    if(this.bossObjects)this.bossObjects.children.iterate(o=>{if(o&&o.active&&o._weak){o._weak=false;this.killBossObject(o,false);}});
    if(broken&&b&&b.active){const dmg=b.maxhp*0.08;b.hp-=dmg;this.popDmg(Math.round(dmg),b.x,b.y,true);b.atkCd=Math.max(b.atkCd||1,2.2);b.frozen=Math.max(b.frozen||0,0.6);this.screenFlash(0xffe07a,0.3,360);this.screenShake(220,0.01);this.hitStop(60);this.showBanner('🛡️ Shield Broken!','The boss is stunned — hit it hard!',1600);Sfx.clear();if(b.hp<=0)this.killEnemy(b);}
  }
  resetBossObjective(){this._weakActive=false;this._bossShield=false;this._weakAcc=11;this._weakCount=0;if(this._bossShieldFx){this.tweens.killTweensOf(this._bossShieldFx);if(this._bossShieldFx.active)this._bossShieldFx.destroy();this._bossShieldFx=null;}}
  clearBossObjects(){this._weakActive=false;if(this.bossObjects)this.bossObjects.children.iterate(o=>{if(o&&o.active){o._weak=false;this.killBossObject(o,false);}});this.resetBossObjective();}
  tickBossObjects(dt){
    if(!this.bossObjects)return;this.bossObjects.children.iterate(o=>{if(!o||!o.active)return;o.life-=dt;o.tick-=dt;if(o.kind==='acid'){if(this.dist(o.x,o.y,this.player.x,this.player.y)<68&&o.tick<=0){o.tick=0.55;this.hurtPlayer(11,0.28);}if(o.life<=0)this.killBossObject(o,false);return;}
      if(o.kind==='hole'){if(o.life<=0)this.killBossObject(o,false);return;}
      if(o.kind==='egg'&&o.life<=0){this.killBossObject(o,true);return;}
      if(o.tick<=0){
        if(o._weak){o.tick=1.5;}   // weak point (สีทอง) = แค่ทำลาย ไม่ยิงใส่ผู้เล่น (เดิมยิงด้วย = โหดซ้อน)
        else if(o.kind==='crystal'){o.tick=3.4;const a=Math.atan2(this.player.y-o.y,this.player.x-o.x);this.foeShot(o.x,o.y,a,145,10,0x86ff48,1.05);}   // ยิงช้าลง+ช้าลง หลบทันขึ้น
        else if(o.kind==='obelisk'){o.tick=4.4;for(let i=0;i<4;i++)this.foeShot(o.x,o.y,i*Math.PI/2,120,8,0xc7ff66,0.9);}   // 6→4 นัด ช้าลงอีก
        else if(o.kind==='mound'){o.tick=3.4;this.spawnEnemy(Math.random()<0.55?'fast':'acid');}
      }
      if(o.life<=0)this.killBossObject(o,o.kind==='mound');
    });
  }
  royalGuardAttack(b){
    const pick=Phaser.Utils.Array.GetRandom(b.phase2?['charge','summon','slam']:['charge','slam']),px=this.player.x,py=this.player.y;   // เอา 'prison' (กรงเสาผลึก) ออก
    if(pick==='charge'){const a=Math.atan2(py-b.y,px-b.x),len=this.dist(b.x,b.y,px,py),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setRotation(a).setScale(len/256,0.42).setTint(0xff4f45).setDepth(4));this.tweens.add({targets:line,alpha:{from:0.2,to:1},duration:120,yoyo:true,repeat:2,onComplete:()=>line.destroy()});this.time.delayedCall(420,()=>{if(b.active){b.setVelocity(Math.cos(a)*680,Math.sin(a)*680);b.knock=0.5;}});b.atkCd=2.0;}
    else if(pick==='prison'){this.showBanner('💎 Acid Crystal Cage','Destroy the crystals to open a path!',850);for(let i=0;i<3;i++){const a=Math.PI/2+i*Math.PI*2/3;this.spawnBossObject('crystal',px+Math.cos(a)*135,py+Math.sin(a)*135,7);}b.atkCd=3.0;}   // 4→3 ผลึก เว้นช่องหนีมากขึ้น
    else if(pick==='summon'){this.showBanner('🐜 Scouts Summoned','The guardians are surrounding you!',850);for(let i=0;i<4;i++)this.spawnEnemy(i%2?'fast':'basic');b.atkCd=2.7;}
    else{this.spawnHazard(px,py,105,20,0xff6d4a);b.atkCd=2.2;}
  }
  bossPose(b,frame,ms=520){
    if(!b||!b.active||b.texture.key!=='boss1')return;
    b._poseToken=(b._poseToken||0)+1;const token=b._poseToken;
    if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(b.active&&b.texture.key==='boss1'&&b._poseToken===token){if(this.anims.exists('boss1_idle'))b.play('boss1_idle',true);else b.setFrame(0);}});
  }
  antQueenAttack(b){
    const fast=b.phase3?0.72:b.phase2?0.84:1,pool=b.phase3?['slam','acid','brood','rush','nova','collapse','nova']:b.phase2?['slam','acid','brood','rush','nova']:['slam','acid','brood','rush'];   // เอา 'crystal' (เสาผลึก) ออก
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y;
    if(pick==='slam'){this.bossPose(b,2,900);const n=b.phase3?3:b.phase2?2:1;for(let i=0;i<n;i++)this.time.delayedCall(280+i*130,()=>{if(b.active){this.bossPose(b,3,420);this.spawnHazard(px+Phaser.Math.Between(-70,70),py+Phaser.Math.Between(-70,70),100,22,0x75ff4b);}});b.atkCd=2.2*fast;}
    else if(pick==='acid'){this.bossPose(b,4,900);this.time.delayedCall(320,()=>{if(!b.active)return;const n=b.phase3?16:b.phase2?12:9,a0=Math.random()*Math.PI*2;for(let i=0;i<n;i++)this.foeShot(b.x,b.y,a0+i/n*Math.PI*2,180+(i%2)*55,12,0x74ff38,1.2);for(let i=0;i<(b.phase3?5:3);i++)this.spawnBossObject('acid',px+Phaser.Math.Between(-190,190),py+Phaser.Math.Between(-190,190),8);Sfx.zap();});b.atkCd=2.1*fast;}
    else if(pick==='brood'){this.bossPose(b,5,1100);this.showBanner('🥚 BROOD COMMAND','Destroy the eggs before the ants hatch!',900);for(let i=0;i<(b.phase3?4:3);i++){const a=i*Math.PI*2/(b.phase3?4:3);this.spawnBossObject('egg',b.x+Math.cos(a)*175,b.y+Math.sin(a)*175,6.5);}b.atkCd=2.9*fast;}
    else if(pick==='rush'){this.bossPose(b,2,780);const a=Math.atan2(py-b.y,px-b.x),len=this.dist(b.x,b.y,px,py),aim=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(3).setRotation(a).setScale(len/256,0.46).setTint(0x75ff4b));this.tweens.add({targets:aim,alpha:{from:0.2,to:1},duration:110,yoyo:true,repeat:3,onComplete:()=>aim.destroy()});this.time.delayedCall(500,()=>{if(b.active){this.bossPose(b,3,500);b.setVelocity(Math.cos(a)*650,Math.sin(a)*650);b.knock=0.5;}});b.atkCd=2.1*fast;}
    else if(pick==='crystal'){this.bossPose(b,4,1000);this.showBanner('💎 Acid Crystal','Destroy the crystal — it fires slowly, you can dodge!',900);for(let i=0;i<2;i++){const a=Math.PI/4+i*Math.PI;this.spawnBossObject('crystal',px+Math.cos(a)*230,py+Math.sin(a)*230,9);}b.atkCd=3.4*fast;}   // 3→2 ผลึก · เลิกใช้ obelisk (ยิงWaitบทิศโหด)
    else if(pick==='collapse'){this.bossPose(b,6,1250);this.showBanner('⛰️ Nest Collapse!','Destroy the breeding mound — don’t stop moving!',1000);for(let i=0;i<2;i++)this.spawnBossObject('mound',b.x+(i?1:-1)*220,b.y+Phaser.Math.Between(-120,120),13);for(let i=0;i<4;i++)this.spawnBossObject('acid',px+Phaser.Math.Between(-240,240),py+Phaser.Math.Between(-240,240),9);b.atkCd=3.4*fast;}
    else{this.bossPose(b,6,1200);this.showBanner('☣️ ACID CROWN NOVA','Find the gaps between the waves!',900);this.time.delayedCall(360,()=>{if(!b.active)return;this.bossNovaWave(b.x,b.y,285,20,0);if(b.phase3)this.bossNovaWave(b.x,b.y,285,20,380);for(let i=0;i<16;i++)this.foeShot(b.x,b.y,i*Math.PI/8,155+(i%2)*75,12,0xa7ff54,1.3);this.screenShake(340,0.014);Sfx.bossWarn();});b.atkCd=2.7*fast;}
  }
  drainBossPose(b,frame,ms=620){
    if(!b||!b.active||b.texture.key!=='boss2')return;
    // ชีต 4×2 ผ่านการซ่อม PNG/alpha และมีภาพครบ 8 เฟรมแล้ว ใช้ท่า 0–7 ได้โดยตรง
    frame=Phaser.Math.Clamp(frame|0,0,7);
    if(b.anims)b.anims.stop();b.setFrame(frame);b._poseToken=(b._poseToken||0)+1;const token=b._poseToken;
    this.time.delayedCall(ms,()=>{if(b.active&&b.texture.key==='boss2'&&b._poseToken===token&&this.anims.exists('boss2_walk'))b.play('boss2_walk',true);});
  }
  drainBossAttack(b){
    const fast=b.phase3?0.78:b.phase2?0.88:1,pool=b.phase3?['prison','suction','overflow','sludge','split','overflow']:b.phase2?['prison','suction','overflow','sludge','split']:['prison','overflow','sludge'];
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y;
    b._drainKick=0.48; b._drainLean=pick==='suction'?-1:pick==='overflow'?1:0;
    if(b.isBoss)this.drainBossPose(b,pick==='prison'||pick==='split'?4:pick==='suction'?5:6,pick==='overflow'?900:680);
    if(pick==='prison'){const r=b.isMini?66:82,mark=this.camWorld(this.add.image(px,py,'vfx_telegraph').setTint(0x78e8ff).setDepth(3).setScale((r*2)/256).setAlpha(0.7));this.showBanner('🫧 Trapping Bubble','Leave the ring before the bubble closes!',760);
      this.tweens.add({targets:mark,alpha:{from:0.35,to:0.95},duration:180,yoyo:true,repeat:2});this.time.delayedCall(720,()=>{mark.destroy();if(this.state!=='play'||!b.active)return;if(this.dist(this.player.x,this.player.y,px,py)<r){this.moveSlowT=1.45;const cage=this.camWorld(this.add.image(this.player.x,this.player.y,'bubble').setDepth(90002).setScale(2.2).setAlpha(0.9));this.tweens.add({targets:cage,scale:2.7,alpha:0,duration:850,onComplete:()=>cage.destroy()});this.hurtPlayer(Math.round(b.dmg*0.35),0.35);}});b.atkCd=2.5*fast;}
    else if(pick==='suction'){this.showBanner('🌀 Suction Valve Open','Run against the pull — don’t get near the center!',900);this.drainPull={x:b.x,y:b.y,t:b.phase3?1.8:1.35,strength:b.phase3?155:120};
      for(let i=0;i<3;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'vfx_cream_ring').setTint(0x74e3cf).setDepth(2).setScale(1.3+i*0.55).setAlpha(0.55));this.tweens.add({targets:ring,scale:0.12,alpha:0,duration:900+i*150,onComplete:()=>ring.destroy()});}b.atkCd=2.8*fast;}
    else if(pick==='overflow'){this.showBanner('🌊 Sewer Overflow','Slip through the gaps between bubble waves!',780);const max=b.isMini?210:270;this.bossNovaWave(b.x,b.y,max,Math.round(b.dmg*0.62),0);if(b.phase2)this.bossNovaWave(b.x,b.y,max,Math.round(b.dmg*0.62),420);b.atkCd=2.5*fast;}
    else if(pick==='split'){for(let i=0;i<(b.phase3?5:3);i++)this.time.delayedCall(i*130,()=>{if(b.active)this.spawnEnemy(i%2?'shooter':'fast');});this.showBanner('🫧 Bubble Split','Kill the bubble spawns before you’re surrounded!',780);b.atkCd=2.9*fast;}
    else{const n=b.phase3?5:b.phase2?4:3;for(let i=0;i<n;i++)this.spawnHazard(px+Phaser.Math.Between(-180,180),py+Phaser.Math.Between(-180,180),64,Math.round(b.dmg*0.55),0x53caa4);b.atkCd=2.35*fast;}
  }
  stageBossPose(b,frame,ms=650){
    if(!b||!b.active||!['boss3','boss4'].includes(b.texture.key))return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._poseToken=(b._poseToken||0)+1;const token=b._poseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(b.active&&['boss3','boss4'].includes(b.texture.key)&&b._poseToken===token){const idle=b.texture.key+'_idle';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);}});
  }
  chiliBossAttack(b){
    const fast=b.phase3?0.72:b.phase2?0.84:1,pool=b.phase3?['belt','pepper','furnace','gears','furnace']:b.phase2?['belt','pepper','furnace','gears']:['belt','pepper','gears'],px=this.player.x,py=this.player.y,pick=Phaser.Utils.Array.GetRandom(pool),d=Math.max(12,Math.round(b.dmg*0.48));
    if(pick==='belt'){this.stageBossPose(b,4,900);const a=Math.atan2(py-b.y,px-b.x),len=Math.max(430,this.dist(b.x,b.y,px,py)+120),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setRotation(a).setScale(len/256,0.62).setTint(0xffb14a).setDepth(4));this.showBanner('🔥 Conveyor Charge','Dodge off the orange line before the grill charges!',780);this.tweens.add({targets:line,alpha:{from:.25,to:1},duration:120,yoyo:true,repeat:3,onComplete:()=>line.destroy()});this.time.delayedCall(560,()=>{if(b.active){b.setVelocity(Math.cos(a)*690,Math.sin(a)*690);b.knock=.52;this.screenShake(240,.009);}});b.atkCd=2.35*fast;}
    else if(pick==='pepper'){this.stageBossPose(b,3,900);this.showBanner('🌶️ Chili Rain','Don’t run in a straight line — the hot rings track your position!',820);for(let i=0;i<(b.phase3?9:b.phase2?7:5);i++)this.time.delayedCall(i*125,()=>{if(b.active&&this.state==='play')this.spawnHazard(this.player.x+Phaser.Math.Between(-105,105),this.player.y+Phaser.Math.Between(-105,105),56,d,0xff5a38);});b.atkCd=2.75*fast;}
    else if(pick==='gears'){this.stageBossPose(b,5,950);this.showBanner('⚙️ Flavor Grinder','Slip through the gaps between the spinning blades!',820);const n=b.phase3?18:b.phase2?14:11,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;this.foeShot(b.x,b.y,i*TAU/n,190+(i%2)*48,d,0xffb04f,1.05);}b.atkCd=2.45*fast;}
    else{this.stageBossPose(b,2,1100);this.showBanner('♨️ Furnace Overheat','Leave the cross, then cross the fire waves!',930);for(const rot of [0,Math.PI/2]){const mark=this.camWorld(this.add.image(px,py,'vfx_line').setRotation(rot).setScale(4.2,.72).setTint(0xff4938).setAlpha(.72).setDepth(3));this.tweens.add({targets:mark,alpha:{from:.22,to:1},duration:130,yoyo:true,repeat:4,onComplete:()=>mark.destroy()});}this.time.delayedCall(720,()=>{if(!b.active)return;for(let i=-3;i<=3;i++){if(i===0)continue;this.spawnHazard(px+i*88,py,49,d,0xff4938);this.spawnHazard(px,py+i*88,49,d,0xff4938);}this.bossNovaWave(b.x,b.y,285,d+4,320);});b.atkCd=3.15*fast;}
  }
  frostBossAttack(b){
    const fast=b.phase3?0.74:b.phase2?0.86:1,pool=b.phase3?['bars','shards','blizzard','quake','bars']:b.phase2?['bars','shards','blizzard','quake']:['shards','quake','bars'],px=this.player.x,py=this.player.y,pick=Phaser.Utils.Array.GetRandom(pool),d=Math.max(12,Math.round(b.dmg*0.46));
    if(pick==='bars'){this.stageBossPose(b,5,1050);this.showBanner('🔒 Ice Cage Sealing','Find the one gap before the seal slams shut!',900);const gap=Phaser.Math.Between(-2,2);for(let i=-3;i<=3;i++){if(i===gap)continue;const x=px+i*78,mark=this.camWorld(this.add.image(x,py,'vfx_line').setRotation(Math.PI/2).setScale(3.8,.52).setTint(0x8fe7ff).setAlpha(.70).setDepth(3));this.tweens.add({targets:mark,alpha:{from:.22,to:1},duration:140,yoyo:true,repeat:4,onComplete:()=>mark.destroy()});this.time.delayedCall(760,()=>{if(b.active)this.spawnHazard(x,py,45,d,0x83ddff);});}b.atkCd=3.0*fast;}
    else if(pick==='shards'){this.stageBossPose(b,3,850);const base=Math.atan2(py-b.y,px-b.x),shots=b.phase3?11:b.phase2?9:7;this.showBanner('❄️ Ice Shard Blast','Cut across the blast angle — don’t back up straight!',760);this.time.delayedCall(360,()=>{if(!b.active)return;for(let i=0;i<shots;i++)this.foeShot(b.x,b.y,base+(i-(shots-1)/2)*.14,245,d,0x9fe8ff,1.0);});b.atkCd=2.15*fast;}
    else if(pick==='blizzard'){this.stageBossPose(b,6,1100);this.showBanner('🌨️ Frost Prison Storm','The wind pulls to the center — run out sideways!',900);this.drainPull={x:b.x,y:b.y,t:b.phase3?2.1:1.55,strength:b.phase3?170:135};this.moveSlowT=Math.max(this.moveSlowT||0,1.1);for(let i=0;i<3;i++)this.bossNovaWave(b.x,b.y,210+i*58,d,250+i*360);b.atkCd=3.25*fast;}
    else{this.stageBossPose(b,2,980);this.showBanner('🧊 Glacier Hammer','A three-beat shockwave — weave in and out!',850);for(let i=0;i<(b.phase3?3:2);i++)this.time.delayedCall(300+i*430,()=>{if(b.active)this.bossNovaWave(b.x,b.y,230+i*55,d+3,0);});b.atkCd=2.85*fast;}
  }
  beginBossPhaseTransition(b,duration,color){
    if(!b||!b.active)return;b._phaseGateLocked=false;b._phaseInvuln=Math.max(0.2,duration||1.4);b._phaseInvulnColor=color||0xffd166;b.setVelocity(0,0);
    if(b._phaseShieldFx){this.tweens.killTweensOf(b._phaseShieldFx);if(b._phaseShieldFx.active)b._phaseShieldFx.destroy();}
    const isFinal=b.isBoss&&b.phase4,sc=b.isBoss?2.15:1.55,phaseLabel=isFinal?'FINAL PHASE':b.phase3?'PHASE 3':b.phase2?'PHASE 2':'PHASE SHIFT';
    b._phaseShieldFx=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setTint(b._phaseInvulnColor).setDepth(b.y+4).setScale(sc).setAlpha(0.72));
    this.tweens.add({targets:b._phaseShieldFx,rotation:Math.PI*2,scale:{from:sc*0.88,to:sc*1.08},alpha:{from:0.42,to:0.82},duration:420,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    // มาตรฐาน Phase VFX สำหรับบอสทุกตัว — สั้น อ่านง่าย และไม่บัง telegraph
    this.hitStop(b.isBoss?85:55);this.screenFlash(b._phaseInvulnColor,b.isBoss?0.22:0.14,b.isBoss?420:300);this.screenShake(b.isBoss?360:220,b.isBoss?0.010:0.006);
    const q=Save.data.settings?Number(Save.data.settings.vfx):1,rays=(b.isBoss?8:5)+(q===2?3:q===0?-3:0);for(let i=0;i<rays;i++){const a=i*TAU/rays,ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(b.y+2).setRotation(a).setTint(b._phaseInvulnColor).setScale(0.06,0.24).setAlpha(0.72));this.tweens.add({targets:ray,scaleX:b.isBoss?0.92:0.62,alpha:0,duration:520+i*25,onComplete:()=>ray.destroy()});}
    for(let i=0;i<(b.isBoss?3:2);i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y+3).setTint(i%2?0xffffff:b._phaseInvulnColor).setScale(sc*(0.25+i*0.13)).setAlpha(0.76));this.tweens.add({targets:ring,scale:sc*(1.05+i*0.20),rotation:(i%2?1:-1)*Math.PI,alpha:0,duration:620+i*130,onComplete:()=>ring.destroy()});}
    const tag=this.camWorld(this.add.text(b.x,b.y-(b.isBoss?118:82),phaseLabel,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:b.isBoss?'24px':'17px',color:'#ffffff',stroke:'#210026',strokeThickness:6}).setOrigin(0.5).setDepth(b.y+8).setAlpha(0));
    this.tweens.add({targets:tag,y:tag.y-18,alpha:{from:0,to:1},duration:220,yoyo:true,hold:Math.max(240,(duration||1.4)*1000-520),onComplete:()=>tag.destroy()});
  }
  tickBossPhaseTransition(b,dt){
    if(!b||!b.active||(b._phaseInvuln||0)<=0)return false;b._phaseInvuln=Math.max(0,b._phaseInvuln-dt);b.setVelocity(0,0);
    if(b._phaseShieldFx&&b._phaseShieldFx.active)b._phaseShieldFx.setPosition(b.x,b.y).setDepth(b.y+4);
    if(b._phaseInvuln<=0){if(b._phaseShieldFx){this.tweens.killTweensOf(b._phaseShieldFx);if(b._phaseShieldFx.active)b._phaseShieldFx.destroy();b._phaseShieldFx=null;}
      const c=b._phaseInvulnColor||0xffd166;this.screenFlash(c,0.12,240);const burst=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y+4).setTint(c).setScale(0.65).setAlpha(0.86));this.tweens.add({targets:burst,scale:b.isBoss?2.6:1.8,alpha:0,duration:520,onComplete:()=>burst.destroy()});this.showBanner('⚔️ New Phase Begins','The boss can take damage again!',850);}
    return b._phaseInvuln>0;
  }

  stage5Pose(b,frame,ms=850){
    if(!b||!b.active||!['boss5_sovereign','mb5_banquet_executioner'].includes(b.texture.key))return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._stage5PoseToken=(b._stage5PoseToken||0)+1;const token=b._stage5PoseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._stage5PoseToken!==token)return;const idle=b.texture.key==='boss5_sovereign'?'boss5_sovereign_idle':b.texture.key+'_walk';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);});
  }
  stage5EnemyPose(e,frame,ms=360){
    const keys=['e_void_crumb','e_crown_ripper','e_banquet_eye','e_maw_truffle','e_royal_oven_sentinel'];if(!e||!e.active||!keys.includes(e.texture.key))return;
    e._stage5PoseToken=(e._stage5PoseToken||0)+1;const token=e._stage5PoseToken;if(e.anims)e.anims.stop();e.setFrame(Phaser.Math.Clamp(frame|0,0,7));
    this.time.delayedCall(ms,()=>{if(!e.active||e._stage5PoseToken!==token)return;const walk=e.texture.key+'_walk';if(this.anims.exists(walk))e.play(walk,true);else e.setFrame(0);});
  }
  stage5DeathGhost(e){
    const keys=['boss5_sovereign','mb5_banquet_executioner','e_void_crumb','e_crown_ripper','e_banquet_eye','e_maw_truffle','e_royal_oven_sentinel'];if(!e||!keys.includes(e.texture.key))return;
    const ghost=this.camWorld(this.add.image(e.x,e.y,e.texture.key,7).setScale(e.baseScale||e.scaleX||1).setFlipX(e.flipX).setDepth(e.y+8).setAlpha(1));
    const boss=e.isBoss,mini=e.isMini;this.tweens.add({targets:ghost,y:ghost.y+(boss?28:14),scaleX:ghost.scaleX*(boss?1.12:.82),scaleY:ghost.scaleY*(boss?.76:.82),alpha:0,duration:boss?1450:mini?900:520,ease:'Cubic.in',onComplete:()=>ghost.destroy()});
  }

  chapter2Pose(b,frame,ms=850){
    if(!b||!b.active||!['boss6_rootmother','mb6_sporewarden'].includes(b.texture.key))return;frame=Phaser.Math.Clamp(frame|0,0,7);
    b._ch2PoseToken=(b._ch2PoseToken||0)+1;const token=b._ch2PoseToken;if(b.anims)b.anims.stop();b.setFrame(frame);
    this.time.delayedCall(ms,()=>{if(!b.active||b._ch2PoseToken!==token)return;const idle=b.texture.key==='boss6_rootmother'?'boss6_rootmother_idle':'mb6_sporewarden_walk';if(this.anims.exists(idle))b.play(idle,true);else b.setFrame(0);});
  }
  chapter2DeathGhost(e){
    if(!e||!['boss6_rootmother','mb6_sporewarden'].includes(e.texture.key))return;const boss=e.isBoss;
    const ghost=this.camWorld(this.add.image(e.x,e.y,e.texture.key,7).setScale(e.baseScale||e.scaleX||1).setFlipX(e.flipX).setDepth(e.y+9).setAlpha(1));
    for(let i=0;i<(boss?10:6);i++){const seed=this.camWorld(this.add.image(e.x,e.y,'vfx_glow').setTint(i%3?0x56e5bd:0xffd166).setScale(.08).setDepth(e.y+10).setAlpha(.8));this.tweens.add({targets:seed,x:e.x+Phaser.Math.Between(-150,150),y:e.y-Phaser.Math.Between(50,190),scale:.32,alpha:0,duration:700+i*70,onComplete:()=>seed.destroy()});}
    this.tweens.add({targets:ghost,y:ghost.y+24,scaleX:ghost.scaleX*1.08,scaleY:ghost.scaleY*.78,alpha:0,duration:boss?1500:880,ease:'Cubic.in',onComplete:()=>ghost.destroy()});
  }

  greatHungerMetamorph(b,phase,color){
    if(!b||!b.active)return;this.stage5Pose(b,6,phase===4?2100:1650);const count=phase===4?14:phase===3?11:8,reach=phase===4?330:phase===3?270:220;
    for(let i=0;i<count;i++){const a=i*TAU/count,ray=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(b.y+5).setRotation(a).setTint(i%3===0?0xffd166:color).setScale(0.08,0.38).setAlpha(0.92));this.tweens.add({targets:ray,scaleX:reach/256,scaleY:phase===4?0.9:0.62,alpha:0,duration:720+i*22,onComplete:()=>ray.destroy()});}
    for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(b.y+3).setTint(i%2?color:0xffd166).setScale(0.35+i*0.18).setAlpha(0.88));this.tweens.add({targets:ring,scale:phase===4?3.4+i*0.35:2.45+i*0.28,rotation:(i%2?1:-1)*Math.PI*1.4,alpha:0,duration:850+i*130,onComplete:()=>ring.destroy()});}
    const shadow=this.camWorld(this.add.circle(b.x,b.y,32,0x030006,0.86).setDepth(b.y-2).setStrokeStyle(8,color,0.8));this.tweens.add({targets:shadow,radius:phase===4?240:175,alpha:0,duration:1100,onComplete:()=>shadow.destroy()});
    this.screenFlash(phase===4?0x030005:color,phase===4?0.82:0.46,phase===4?950:650);this.screenShake(phase===4?980:700,phase===4?0.032:0.022);Sfx.bossWarn();
  }

  greatHungerAttack(b){
    const fast=b.phase4?0.60:b.phase3?0.70:b.phase2?0.82:1;
    const pool=b.phase4?['eclipse','voidMaw','crownRain','ovenCross','eclipse']:b.phase3?['voidMaw','spiral','lastSupper','ovenCross','crownRain']:b.phase2?['ovenCross','spiral','cleave','crownRain','lastSupper']:['crownRain','cleave','spiral'];
    const pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(12,Math.round(b.dmg*0.45)),pose={crownRain:4,cleave:2,ovenCross:2,spiral:4,voidMaw:3,lastSupper:5,eclipse:6}[pick]??1;
    this.stage5Pose(b,pose,pick==='eclipse'?1550:pick==='lastSupper'?1150:900);
    if(pick==='crownRain'){
      this.showBanner('👑 Bitter Crown Rain','Warning rings chase your path — keep changing direction!',850);const n=b.phase4?9:b.phase3?7:b.phase2?6:5;
      for(let i=0;i<n;i++)this.time.delayedCall(i*135,()=>{if(b.active&&this.state==='play')this.spawnHazard(this.player.x+Phaser.Math.Between(-95,95),this.player.y+Phaser.Math.Between(-95,95),58,bd,0xd95cff);});
      b.atkCd=2.7*fast;
    }else if(pick==='cleave'){
      const a=Math.atan2(py-b.y,px-b.x),len=Math.max(420,this.dist(b.x,b.y,px,py)+120),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(4).setRotation(a).setScale(len/256,0.70).setTint(0xffd166).setAlpha(0.78));
      this.showBanner('🔪 Sovereign’s Blade','Dodge off the gold line before the blade strikes!',760);this.tweens.add({targets:line,alpha:{from:0.30,to:1},duration:120,yoyo:true,repeat:3,onComplete:()=>line.destroy()});
      this.time.delayedCall(560,()=>{if(!b.active)return;for(let s=-3;s<=3;s++)this.foeShot(b.x,b.y,a+s*0.115,390,bd,0xffd166,1.15);this.spawnHazard(px,py,86,bd+5,0xff8a4d);this.screenShake(260,0.010);Sfx.zap();});b.atkCd=2.45*fast;
    }else if(pick==='ovenCross'){
      this.showBanner('🔥 Oven Cross','Get off the red cross lines!',820);const marks=[];
      for(const rot of [0,Math.PI/2])marks.push(this.camWorld(this.add.image(px,py,'vfx_line').setDepth(3).setRotation(rot).setScale(3.8,0.58).setTint(0xff514f).setAlpha(0.75)));
      this.tweens.add({targets:marks,alpha:{from:0.25,to:0.95},duration:130,yoyo:true,repeat:4,onComplete:()=>marks.forEach(o=>o.destroy())});
      this.time.delayedCall(720,()=>{if(!b.active)return;for(let i=-3;i<=3;i++){if(Math.abs(i)<1)continue;this.spawnHazard(px+i*92,py,50,bd,0xff514f);this.spawnHazard(px,py+i*92,50,bd,0xff514f);}this.screenFlash(0xff514f,0.15,300);});b.atkCd=3.05*fast;
    }else if(pick==='spiral'){
      this.showBanner('🌀 Spiral of Hunger','Circle against the bullet flow!',780);const arms=b.phase4?5:b.phase3?4:3,a0=Math.random()*TAU;
      for(let k=0;k<9;k++)this.time.delayedCall(k*85,()=>{if(!b.active||this.state!=='play')return;for(let j=0;j<arms;j++)this.foeShot(b.x,b.y,a0+k*0.42+j*TAU/arms,205+k*4,Math.max(8,bd-4),j%2?0xffd166:0xd95cff,0.92);});
      b.atkCd=2.55*fast;
    }else if(pick==='voidMaw'){
      this.showBanner('🌑 Maw of the Void','Run against the pull, then slip through the bullet gaps!',950);this.drainPull={x:b.x,y:b.y,t:b.phase4?2.2:1.75,strength:b.phase4?190:155};
      for(let i=0;i<4;i++){const ring=this.camWorld(this.add.image(b.x,b.y,'hunger_seal').setDepth(2).setScale(1.4+i*0.35).setAlpha(0.55));this.tweens.add({targets:ring,scale:0.10,rotation:(i%2?1:-1)*Math.PI,alpha:0,duration:1050+i*120,onComplete:()=>ring.destroy()});}
      this.time.delayedCall(720,()=>{if(!b.active)return;const n=b.phase4?22:18,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;this.foeShot(b.x,b.y,i*TAU/n,185+(i%2)*45,bd,0xd95cff,1.0);}Sfx.zap();});b.atkCd=3.15*fast;
    }else if(pick==='lastSupper'){
      this.showBanner('🍽️ The Last Banquet','Destroy the minions — don’t let the table surround you!',900);const n=b.phase3?5:3;
      for(let i=0;i<n;i++)this.time.delayedCall(i*160,()=>{if(b.active)this.spawnEnemy(i%3===0?'tank':i%2?'fast':'shooter');});
      for(let i=0;i<3;i++)this.spawnHazard(px+Math.cos(i*TAU/3)*155,py+Math.sin(i*TAU/3)*155,65,bd,0xff8a4d);b.atkCd=3.25*fast;
    }else{
      this.showBanner('🌘 Eclipse of Flavor','A three-layered wave is swallowing the whole field!',1050);this.screenFlash(0x26002f,0.55,480);
      this.bossNovaWave(b.x,b.y,270,bd+4,250);this.bossNovaWave(b.x,b.y,340,bd+4,700);this.bossNovaWave(b.x,b.y,420,bd+7,1180);
      this.time.delayedCall(520,()=>{if(!b.active)return;for(let i=0;i<18;i++){if(i%6===0)continue;this.foeShot(b.x,b.y,i*TAU/18,245,bd,0xffd166,1.12);}this.screenShake(520,0.017);Sfx.bossWarn();});b.atkCd=3.6*fast;
    }
  }

  rootmotherAttack(b){
    const fast=b.phase3?0.72:b.phase2?0.86:1,pool=b.phase3?['fullBloom','rootLattice','blossomRain','seedArmy']:b.phase2?['rootLattice','blossomRain','thornFan','seedArmy']:['thornFan','rootLattice','blossomRain'],pick=Phaser.Utils.Array.GetRandom(pool),px=this.player.x,py=this.player.y,bd=Math.max(13,Math.round(b.dmg*.44));
    if(pick==='thornFan'){
      this.chapter2Pose(b,2,900);const a=Math.atan2(py-b.y,px-b.x),line=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,.5).setRotation(a).setScale(Math.max(430,this.dist(b.x,b.y,px,py)+100)/256,.58).setTint(0x56e5bd).setDepth(4).setAlpha(.78));this.showBanner('🌿 Vine Scythe','Dodge the green line before the thorns fan out!',760);this.tweens.add({targets:line,alpha:{from:.2,to:1},duration:120,yoyo:true,repeat:3,onComplete:()=>line.destroy()});this.time.delayedCall(540,()=>{if(!b.active)return;for(let i=-3;i<=3;i++)this.foeShot(b.x,b.y,a+i*.14,390,bd,i%2?0xd95cff:0x56e5bd,1.08);this.screenShake(220,.008);});b.atkCd=2.35*fast;
    }else if(pick==='rootLattice'){
      this.chapter2Pose(b,3,1100);this.showBanner('🌱 Root Breach','Leave the intersection before the roots erupt!',840);for(const off of [-150,0,150]){this.spawnHazard(px+off,py,52,bd,0x56e5bd);this.spawnHazard(px,py+off,52,bd,0x56e5bd);}b.atkCd=2.75*fast;
    }else if(pick==='blossomRain'){
      this.chapter2Pose(b,4,1150);this.showBanner('🌺 Poison Bloom Rain','Purple rings chase your path — keep changing direction!',880);const n=b.phase3?9:b.phase2?7:5;for(let i=0;i<n;i++)this.time.delayedCall(i*145,()=>{if(b.active&&this.state==='play')this.spawnHazard(this.player.x+Phaser.Math.Between(-110,110),this.player.y+Phaser.Math.Between(-110,110),58,bd,0xd95cff);});b.atkCd=2.95*fast;
    }else if(pick==='seedArmy'){
      this.chapter2Pose(b,5,1250);this.showBanner('🌰 Swarm Seed','Kill the sprouts before the field is sealed off!',900);const n=b.phase3?6:4;for(let i=0;i<n;i++)this.time.delayedCall(i*130,()=>{if(b.active)this.spawnEnemy(i%3===0?'shooter':i%2?'fast':'basic');});b.atkCd=3.1*fast;
    }else{
      this.chapter2Pose(b,6,1650);this.showBanner('🌸 FULL BLOOM','A two-layer petal wave — slip through the bullet gaps!',1000);this.screenFlash(0xd95cff,.34,420);this.bossNovaWave(b.x,b.y,280,bd+3,260);this.bossNovaWave(b.x,b.y,390,bd+6,820);this.time.delayedCall(520,()=>{if(!b.active)return;const n=22,gap=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;this.foeShot(b.x,b.y,i*TAU/n,235,bd,i%2?0x56e5bd:0xd95cff,1.06);}this.screenShake(420,.014);});b.atkCd=3.45*fast;
    }
  }

  bossThink(b,dt){
    if(!b.visible)b.setVisible(true); if(b.alpha<1)b.setAlpha(1);   // safety: บอสต้องมองเห็นเสมอตอนสู้ (กันค้างล่องหนจาก tween คัตซีน)
    if(!Number.isFinite(b.spd))b.spd=94;   // safety: กัน spd หลุด (undefined→NaN velocity→Position NaN→บอสล่องหน)
    if(!Number.isFinite(b.x)||!Number.isFinite(b.y)){ b.setPosition(this.player.x+140,this.player.y); if(b.body)b.body.reset(b.x,b.y); }   // Positionเสีย → รีเซ็ตข้างผู้เล่น
    // หายใจ "Alive" (สเกลเต้นเบา ๆ) —sชวลล้วน ไม่กระทบ body
    if(b._baseScale===undefined)b._baseScale=b.scaleX;
    b._breathe=(b._breathe||0)+dt*(b.phase2?5:3.2);
    if(b._drainMotion){
      b._drainKick=Math.max(0,(b._drainKick||0)-dt);const kick=b._drainKick>0?Math.sin((0.48-b._drainKick)*Math.PI/0.24)*0.13:0;
      const pulse=Math.sin(b._breathe),s=b._baseScale*(1+kick);
      b.setScale(s*(1+pulse*0.055),s*(1-pulse*0.045));
      b.setRotation(Math.sin(b._breathe*0.55)*(b._drainMotionKind==='boss'?0.045:0.065)+(b._drainLean||0)*kick*0.12);
    }else b.setScale(b._baseScale*(1+Math.sin(b._breathe)*(b.phase2?0.06:0.035)));
    if(b._aura){ b._aura.setPosition(b.x,b.y);   // ออร่าEnraged
      if(b._auraIsFx) b._aura.setScale((b._baseScale||1)*2.4*(1+Math.sin(b._breathe*1.5)*0.06));
      else b._aura.setScale(1+Math.sin(b._breathe*1.5)*0.12).setAlpha(0.12+Math.abs(Math.sin(b._breathe))*0.1); }
    if(b._hungerHalo){b._hungerHalo.forEach((h,i)=>{if(!h||!h.active)return;h.setPosition(b.x,b.y).setDepth(b.y-3-i).setRotation((b._hungerSpin||0)*(i?-.34:.48)).setScale((i?2.62:2.05)*(b.phase4?1.24:b.phase3?1.13:b.phase2?1.06:1)).setAlpha((i?0.26:0.42)+(b.phase4?0.12:0));});}
    if(b._hungerOrbs){b._hungerSpin=(b._hungerSpin||0)+dt*(b.phase4?2.35:b.phase3?1.82:1.18);b._hungerOrbs.forEach((o,i)=>{if(!o||!o.active)return;const a=b._hungerSpin+i*TAU/b._hungerOrbs.length,r=(b.phase4?174:b.phase3?151:b.phase2?132:119);o.setPosition(b.x+Math.cos(a)*r,b.y+Math.sin(a)*r*0.55).setDepth(b.y+(Math.sin(a)>0?5:-4)).setScale((b.phase4?0.50:0.36)+(Math.sin(a)+1)*0.09).setAlpha(0.62+Math.abs(Math.sin(a))*0.34);});}
    if(this.tickBossPhaseTransition(b,dt))return;
    if(b.frozen>0)return;
    if(b.atkCd===undefined)b.atkCd=1.6; b.atkCd-=dt/(b.rageCdMul||1);
    if(b.isBoss&&this.stageIndex===4){const f=b.hp/b.maxhp;
      if(!b.phase2&&f<=0.72){b.phase2=true;this.beginBossPhaseTransition(b,1.8,0xff3f58);this.greatHungerMetamorph(b,2,0xff3f58);b.spd*=1.16;b.atkCd=0.55;this.showBanner('👑 Phase 2 · Crown Shatters','The first seal breaks — the Sovereign’s claws and blood-furnace awaken!',1900);}
      else if(!b.phase3&&f<=0.40){b.phase3=true;this.beginBossPhaseTransition(b,2.0,0xd95cff);this.greatHungerMetamorph(b,3,0xd95cff);b.spd*=1.14;b.atkCd=0.42;this.showBanner('🌑 Phase 3 · True Form of Hunger','All six eyes open — the void’s pull is swallowing the field!',2050);}
      else if(!b.phase4&&f<=0.14){b.phase4=true;this.beginBossPhaseTransition(b,2.35,0xffd166);this.greatHungerMetamorph(b,4,0xffd166);b.spd*=1.12;b.atkCd=0.24;this.showBanner('🌘 Final Phase · World Devourer','The sky goes dark — slay it before every memory is eaten!',2400);}
      if((b._phaseInvuln||0)>0)return;if(b.atkCd<=0)this.greatHungerAttack(b);return;}
    // เฟส 2 ตอนเลือดครึ่ง (เร็ว/ดุขึ้น) — Effectโกรธ
    const phase2At=(b.isBoss&&this.stageIndex===0)?0.68:(b.isBoss&&this.stageIndex===1?0.65:0.5),phase3At=(b.isBoss&&this.stageIndex===0)?0.35:(b.isBoss&&this.stageIndex===1?0.32:0.25);
    if(!b.phase2 && b.hp<=b.maxhp*phase2At){ b.phase2=true; this.beginBossPhaseTransition(b,b.isBoss?1.55:1.25,this.stageIndex===1?0x62e5cf:0xff6a4d); b.spd*=1.28; b.atkCd=0.6;
      if(this.stageIndex===1&&b.isBoss)this.drainBossPose(b,7,1100);
      if(b.isBoss&&(this.stageIndex===2||this.stageIndex===3))this.stageBossPose(b,6,1250);if(b.isMini&&this.stageIndex===4)this.stage5Pose(b,6,1250);
      if(this.stageIndex===5)this.chapter2Pose(b,6,1450);
      this.showBanner(this.stageIndex===1?'🫧 Phase 2 · Pressure Surge':this.stageIndex===2?'🔥 Phase 2 · Overheat':this.stageIndex===3?'❄️ Phase 2 · Seal Broken':this.stageIndex===5?'🌱 Phase 2 · Root Breach':'🔥 Boss Enraged!',this.stageIndex===1?'The valve opens — suction and trapping bubbles activate!':this.stageIndex===2?'The conveyors speed up and the furnace unleashes fire waves!':this.stageIndex===3?'The ice cage starts closing in faster!':this.stageIndex===5?'The Rootmother opens toxic sap channels and forces the whole garden’s seasons!':'Phase 2 — attacks grow fiercer!',1500); if(b.isBoss&&this.stageIndex===0)this.bossPose(b,6,1000); this.screenShake(420,0.014); this.screenFlash(this.stageIndex===1?0x62e5cf:this.stageIndex===3?0x9fe0ff:this.stageIndex===5?0x56e5bd:0xff4d5a,0.3,420);
      if(!b.atks.includes('nova'))b.atks.push('nova');
      if(b.isBoss&&this.stageIndex===0){this.showBanner('💚 Phase 2 · Nest Breach','The Queen summons a swarm of acid ants!',1700);for(let i=0;i<3;i++)this.spawnEnemy(i%2?'acid':'fast');}   // เลิกเรียกเสาผลึก → เรียกลูกน้องแทน
      if(!b._aura&&this.anims.exists('fx_enrage')){ b._aura=this.camWorld(this.add.sprite(b.x,b.y,'fx_enrage',0).setDepth(3).setAlpha(0.72).setBlendMode(Phaser.BlendModes.ADD)); b._aura.play('fx_enrage'); b._auraIsFx=true; }
      for(let i=0;i<2;i++){ const r=this.camWorld(this.add.circle(b.x,b.y,20,0xff5a4d,0).setDepth(6).setStrokeStyle(4,0xff7a5a,0.9));
        this.tweens.add({targets:r,radius:150,alpha:{from:0.9,to:0},duration:500,delay:i*100,onComplete:()=>r.destroy()}); } }
    // เฟส 3 (บอสใหญ่) ตอนเลือด 25% — Enraged
    if(b.isBoss && !b.phase3 && b.hp<=b.maxhp*phase3At){ b.phase3=true; this.beginBossPhaseTransition(b,1.8,this.stageIndex===1?0x66d8ff:0xd95cff); b.spd*=1.2; b.atkCd=0.4;
      if(this.stageIndex===1)this.drainBossPose(b,7,1350);
      if(this.stageIndex===2||this.stageIndex===3)this.stageBossPose(b,6,1450);
      if(this.stageIndex===5)this.chapter2Pose(b,6,1650);
      this.showBanner(this.stageIndex===0?'👑 Phase 3 · Queen Enraged':this.stageIndex===1?'🌊 Phase 3 · Pipe Overflow':this.stageIndex===2?'🌋 Phase 3 · Furnace Rupture':this.stageIndex===3?'🌨️ Phase 3 · Frost Storm':this.stageIndex===5?'🌺 Phase 3 · Full Bloom':'💢 Total Frenzy!',this.stageIndex===0?'The breeding mounds open — the ant swarm won’t stop!':this.stageIndex===1?'Double-layered bubble waves — don’t stop moving!':this.stageIndex===2?'The fire cross and grinders activate together!':this.stageIndex===3?'The cage, ice blast, and storm will stack their timings!':this.stageIndex===5?'Poison petals fill the sky — destroy the crown seed before the roots devour the kitchen!':'Final phase — stay sharp!',1800); this.screenShake(520,0.016); this.screenFlash(this.stageIndex===1||this.stageIndex===3?0x66d8ff:this.stageIndex===5?0xd95cff:0xff2d4a,0.4,500);
      if(this.stageIndex===0){this.bossPose(b,6,1300);this.spawnBossObject('mound',b.x-230,b.y,16);this.spawnBossObject('mound',b.x+230,b.y,16);} }
    if((b._phaseInvuln||0)>0)return;
    if(b.atkCd>0)return;
    if(b.isMini&&b.royalGuard){this.royalGuardAttack(b);return;}
    if(b.isBoss&&this.stageIndex===0){this.antQueenAttack(b);return;}
    if(this.stageIndex===1&&(b.isBoss||b.isMini)){this.drainBossAttack(b);return;}
    if(b.isBoss&&this.stageIndex===2){this.chiliBossAttack(b);return;}
    if(b.isBoss&&this.stageIndex===3){this.frostBossAttack(b);return;}
    if(b.isBoss&&this.stageIndex===5){this.rootmotherAttack(b);return;}
    const atks=b.atks||['slam']; const pick=atks[Math.floor(Math.random()*atks.length)];if(b.isMini&&this.stageIndex===4)this.stage5Pose(b,{slam:5,aimed:5,radial:5,nova:6,charge:3,spiral:5,summon:5}[pick]??1,900);if(this.stageIndex===5)this.chapter2Pose(b,{slam:3,aimed:4,radial:4,nova:6,charge:3,spiral:4,summon:5,trap:3}[pick]??2,pick==='summon'?1150:900);
    const dm=1+this.stageIndex*0.12, pw=b.isBoss?1:0.9, fast=b.phase3?0.72:b.phase2?0.85:1;   // เว้นจังหวะให้ telegraph จบก่อนเริ่มท่าถัดไป
    if(pick==='slam'){ // สแลม AoE ตรงPositionผู้เล่น (เตือนก่อน หลบได้) · เฟส 3 = 3 points
      const hits=b.phase3?3:1;
      for(let i=0;i<hits;i++){ const tx=this.player.x+Phaser.Math.Between(-i*70,i*70), ty=this.player.y+Phaser.Math.Between(-i*70,i*70);
        this.spawnHazard(tx,ty,80+this.stageIndex*8, Math.round((16+this.stageIndex*6)*pw), 0xff5a4d); }
      b.atkCd=1.5*fast;
    } else if(pick==='radial'){ // ยิงWaitบทิศ (เฟส 3 = 2 วงหมุนต่าง)
      const n=(b.isBoss?10:7)+this.stageIndex+(b.phase3?6:0); const spd=150+this.stageIndex*12, dmg=Math.round((8+this.stageIndex*3)*pw);
      const off=Math.random()*Math.PI;
      for(let i=0;i<n;i++) this.foeShot(b.x,b.y,off+(i/n)*Math.PI*2,spd,dmg,0xffa54d);
      if(b.phase3) for(let i=0;i<n;i++) this.foeShot(b.x,b.y,-off+(i/n)*Math.PI*2,spd*0.7,dmg,0xff8fb5);
      Sfx.zap(); b.atkCd=1.6*fast;
    } else if(pick==='aimed'){ // ยิงกระจายเล็งผู้เล่น
      const base=Math.atan2(this.player.y-b.y,this.player.x-b.x), shots=b.phase3?7:b.phase2?5:3, spd=210+this.stageIndex*12, dmg=Math.round((10+this.stageIndex*3)*pw);
      for(let s=0;s<shots;s++) this.foeShot(b.x,b.y,base+(s-(shots-1)/2)*0.20,spd,dmg,0xff6b8a);
      Sfx.zap(); b.atkCd=1.3*fast;
    } else if(pick==='charge'){ // เส้นแดงบอกทิศ 420ms ก่อนพุ่ง — ผู้เล่นอ่านและหลบได้
      const tx=this.player.x,ty=this.player.y,ang=Math.atan2(ty-b.y,tx-b.x);
      const chargeLen=this.dist(b.x,b.y,tx,ty);
      const aim=this.camWorld(this.add.image(b.x,b.y,'vfx_line').setOrigin(0,0.5).setDepth(3).setRotation(ang).setScale(chargeLen/256,b.isBoss?0.42:0.32).setTint(0xff5a6e));
      this.tweens.add({targets:aim,alpha:{from:0.25,to:1},duration:110,yoyo:true,repeat:2,onComplete:()=>aim.destroy()});
      this.time.delayedCall(420,()=>{ if(!b.active)return; if(b.tintColor)b.setTint(b.tintColor); else b.clearTint();
        b.setVelocity(Math.cos(ang)*(520+this.stageIndex*18),Math.sin(ang)*(520+this.stageIndex*18)); b.knock=0.45; });
      b.atkCd=2.0*fast;
    } else if(pick==='summon'){ // วงเรียกลูกน้องแบบสะอาด Noneแถบขาวจาก sprite
      for(let i=0;i<3;i++){ const portal=this.anims.exists('fx_bossportal')
          ? this.spawnFxAnim('fx_bossportal',b.x,b.y+24,{scale:(90+i*20)/ASSET_FX.fx_bossportal.fw,depth:2,anchor:'center',alpha:0.8})
          : this.camWorld(this.add.image(b.x,b.y+24,'vfx_glow').setDepth(2).setTint(0xc58cff).setScale(0.25+i*0.06));
        if(portal)this.tweens.add({targets:portal,alpha:0,rotation:Math.PI,duration:620,delay:i*90,onComplete:()=>{if(portal.active)portal.destroy();}}); }
      const n=2+this.stageIndex+(b.phase3?2:0); this.time.delayedCall(360,()=>{ if(!b.active)return; for(let i=0;i<n;i++)this.spawnEnemy(Math.random()<0.5?'fast':'basic'); });
      Sfx.bossWarn(); b.atkCd=2.4*fast;
    } else if(pick==='nova'){ // คลื่นสังหารขยายจากบอส — ต้องหลบให้อยู่ในวง/นอกวง
      const px=b.x,py=b.y, maxR=220+this.stageIndex*22, novaDmg=Math.round((14+this.stageIndex*5)*pw);
      this.bossNovaWave(px,py,maxR,novaDmg,0);
      if(b.phase3)this.bossNovaWave(px,py,maxR,novaDmg,320);
      Sfx.zap(); this.screenShake(160,0.006); b.atkCd=1.8*fast;
    } else if(pick==='spiral'){ // ยิงเป็นเกลียวหมุน — ต้องวิ่งหนีเป็นวง
      const arms=b.isBoss?3:2, spd=165+this.stageIndex*10, dmg=Math.round((7+this.stageIndex*2.4)*pw), a0=Math.random()*Math.PI*2;
      for(let k=0;k<10;k++) this.time.delayedCall(k*60,()=>{ if(!b.active||this.state!=='play')return;
        for(let arm=0;arm<arms;arm++) this.foeShot(b.x,b.y,a0+k*0.5+arm*(Math.PI*2/arms),spd,dmg,0xffd0e8); });
      Sfx.zap(); b.atkCd=2.1*fast;
    } else if(pick==='trap'){ // วงกับดักล้อมผู้เล่น เว้นช่องเดียว — บังคับให้วิ่งหนีออกช่อง
      const n=10, R=150, gap=Math.floor(Math.random()*n), dmg=Math.round((12+this.stageIndex*4)*pw);
      for(let i=0;i<n;i++){ if(i===gap||i===(gap+1)%n)continue; const a=(i/n)*Math.PI*2;
        this.spawnHazard(this.player.x+Math.cos(a)*R,this.player.y+Math.sin(a)*R,58,dmg,0xff7a4d); }
      this.showBanner('⚠️ Encirclement!','Run out through the gap!',900); b.atkCd=2.1*fast;
    }
  }

  /* ---------- FX & ANIMATIONS ---------- */
  hitStop(ms){
    if(this._isHitStop) return;
    this._isHitStop = true;
    const oldSpd = this.physics.world.timeScale;
    this.physics.world.timeScale = 12;   // inverted: big = near-freeze (impact punch)
    this.time.delayedCall(ms, () => {
      this.physics.world.timeScale = oldSpd;
      this._isHitStop = false;
    });
  }
  // Juice: ป็อปคอมโบกลางจอตอนถึงหมุดหมาย (10/25/50/...) — เด้ง + เสียง + เขย่าเบา
  showKillStreak(n){
    const mark=STREAK_MARKS[n]; if(!mark)return;
    const t=this.add.text(this.W/2,this.H*0.30,'🔥 COMBO x'+n+'\n'+mark[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'26px',color:'#ffd23f',align:'center',stroke:'#7a2d00',strokeThickness:5}).setOrigin(0.5).setDepth(99998).setScale(0.4).setAlpha(1);
    this.camUI(t);
    this.tweens.add({targets:t,scale:1.12,duration:200,ease:'Back.out',onComplete:()=>{
      this.tweens.add({targets:t,alpha:0,y:t.y-30,scale:1.0,duration:520,delay:340,onComplete:()=>t.destroy()});
    }});
    this.screenShake(130,0.004); Sfx.streak(mark[0]);
  }
  popDmg(n,x,y,crit){
    if(Save.data.settings&&Save.data.settings.damageNumbers===false)return;
    let t=this.dmgPool.pop();
    if(!t){ t=this.add.text(x,y,'',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px'}).setDepth(99999).setOrigin(0.5); this.camWorld(t); }
    else t.setActive(true).setVisible(true);
    const str = crit ? ('💥 '+n) : n;
    t.setText(str).setColor(crit?'#ffd23f':'#ffffff').setFontSize(crit?'22px':'15px').setPosition(x+Phaser.Math.Between(-8,8),y-12).setAlpha(1).setScale(crit?1.5:1.0);
    this.tweens.add({
      targets:t,
      y:y-(crit?60:42),
      scale:crit?1.0:0.9,
      alpha:0,
      duration:crit?640:500,
      ease:crit?'Back.out':'Linear',
      onComplete:()=>{ t.setVisible(false); this.dmgPool.push(t); }
    });
  }
  spawnGhostTrail(){
    const p=this.player; if(!p)return;
    const g=this.camWorld(this.add.image(p.x,p.y,p.texture.key,p.frame?p.frame.name:0)
      .setDepth(p.depth-1)
      .setScale(p.scaleX,p.scaleY)
      .setRotation(p.rotation)
      .setFlipX(p.flipX)
      .setAlpha(0.65)
      .setTint(0x8fd0ff));
    this.tweens.add({targets:g,alpha:0,scaleX:g.scaleX*0.85,scaleY:g.scaleY*0.85,duration:240,onComplete:()=>g.destroy()});
  }
  spawnDust(x,y){
    const d=this.camWorld(this.add.circle(x+Phaser.Math.Between(-6,6),y,Phaser.Math.Between(4,7),0xffffff,0.35).setDepth(2));
    this.tweens.add({targets:d,y:y-8,alpha:0,scale:1.6,duration:260,onComplete:()=>d.destroy()});
  }
  burst(x,y,color){ for(let i=0;i<7;i++){ const p=this.camWorld(this.add.image(x,y,'dot').setTint(color).setDepth(6).setScale(Phaser.Math.FloatBetween(0.5,1.1)));
    const a=Math.random()*Math.PI*2, s=Phaser.Math.Between(40,150);
    this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:420,onComplete:()=>p.destroy()}); } }
  squash(o,sx,sy){ o.setScale(sx,sy); this.tweens.add({targets:o,scaleX:1,scaleY:1,duration:220,ease:'Back.out'}); }
  // VFX ระเบิดวง (รูปจริง) — ขยายจากเล็ก→Fullรัศมี แล้วจางหาย · โอเวอร์เลย์แบนราบ (oval) เข้ากับมุมกล้อง
  fxBurst(key,x,y,radius,dur,spin){
    if(!this.textures.exists(key))return null;
    const base=this.textures.get(key).getSourceImage().width||256, full=(radius*2*1.15)/base;
    const im=this.camWorld(this.add.image(x,y,key).setDepth(6).setScale(full*0.35, full*0.35*0.82));
    const t={scaleX:full, scaleY:full*0.82, alpha:{from:0.95,to:0}, duration:dur, ease:'Quad.out', onComplete:()=>im.destroy()};
    if(spin)im.setRotation(Math.random()*Math.PI*2);
    this.tweens.add({targets:im, ...t}); return im; }
  // --- VFX: hit impact ring (expanding ring + sparks) --- throttled for performance
  vfxHitRing(x,y,color,big){
    if(!big){ this._hitVfxT=this._hitVfxT||0; const now=this.time.now; if(now-this._hitVfxT<60)return; this._hitVfxT=now; }
    const r=big?1.6:0.85;
    const ring=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(color).setDepth(7).setScale(0.045*r,0.038*r).setAlpha(big?0.6:0.3));  // เบาลง ไม่สาดขาวFullจอ
    this.tweens.add({targets:ring,scaleX:0.36*r,scaleY:0.30*r,alpha:0,duration:big?300:200,ease:'Quad.out',onComplete:()=>ring.destroy()});
    this._emit(this.pSpark,x,y,color,big?7:3);
  }
  // --- VFX: death poof (smoke cloud) ---
  vfxDeathPoof(x,y,color,big){
    const sc=big?2.2:1.0;
    const halo=this.camWorld(this.add.image(x,y,'vfx_ring').setTint(0xffffff).setDepth(6).setScale(0.035*sc,0.03*sc).setAlpha(0.6));
    this.tweens.add({targets:halo,scaleX:0.30*sc,scaleY:0.25*sc,alpha:0,duration:big?360:240,ease:'Quad.out',onComplete:()=>halo.destroy()});
    this._emit(this.pSmoke,x,y,color,big?14:6);
    this._emit(this.pSpark,x,y,color,big?7:3);
  }
  // --- VFX: skill cast glow (radial flash at caster) ---
  vfxCastGlow(color){
    const p=this.player; if(!p)return;
    const glow=this.camWorld(this.add.image(p.x,p.y,'vfx_glow').setTint(color).setDepth(5).setScale(0.13).setAlpha(0.75));
    this.tweens.add({targets:glow,scale:0.70,alpha:0,duration:300,ease:'Quad.out',onComplete:()=>glow.destroy()});
  }
  // --- VFX: speed lines during dash ---
  vfxSpeedLine(x,y,ang){
    const ln=this.camWorld(this.add.image(x,y,'vfx_line').setTint(0xbfe8ff).setDepth(4).setRotation(ang+Math.PI).setScale(0.55,0.25).setAlpha(0.65));
    this.tweens.add({targets:ln,scaleX:0.85,alpha:0,duration:200,onComplete:()=>ln.destroy()});
  }
  // --- VFX: enemy spawn poof --- throttled
  vfxSpawnPoof(x,y){
    this._spawnVfxT=this._spawnVfxT||0; const now=this.time.now; if(now-this._spawnVfxT<120)return; this._spawnVfxT=now;
    const p=this.camWorld(this.add.image(x,y,'vfx_poof').setTint(0xb98cff).setDepth(3).setScale(0.035).setAlpha(0.55));
    this.tweens.add({targets:p,scale:0.28,alpha:0,duration:260,ease:'Quad.out',onComplete:()=>p.destroy()});
  }
  // --- VFX: hurt vignette flash ---
  vfxHurtFlash(){
    const f=this.add.rectangle(this.W/2,this.H/2,this.W,this.H,0xff3344,0.18).setScrollFactor(1).setDepth(79);
    this.camUI(f); this.tweens.add({targets:f,alpha:0,duration:280,onComplete:()=>f.destroy()});
  }
  // --- VFX: level up celebration burst ---
  vfxLevelUp(){
    const p=this.player; if(!p)return;
    if(this.textures.exists('fx_levelup')&&this.anims.exists('fx_levelup')) this.spawnFxAnim('fx_levelup',p.x,p.y,{scale:220/ASSET_FX.fx_levelup.fw,depth:8,anchor:'center'});
    else { const ring=this.camWorld(this.add.image(p.x,p.y,'vfx_ring').setTint(0xffe08a).setDepth(8).setScale(0.2,0.16).setAlpha(0.9));
      this.tweens.add({targets:ring,scaleX:3.2,scaleY:2.6,alpha:0,duration:450,ease:'Quad.out',onComplete:()=>ring.destroy()}); }
    const cols=[0xffe08a,0xff8fb5,0xbfe8ff,0xb6f0d6];
    cols.forEach(c=>this._emit(this.pDust,p.x,p.y,c,4));   // ฝุ่นหลากสีพุ่งฉลอง
  }
  // --- VFX: collect sparkle (orb pickup) ---
  vfxCollectSparkle(x,y,color){ this._emit(this.pSpark,x,y-6,color,4); }
  // faux-2.5D: วาดเงาวงรีใต้ทุกตัวในเลเยอร์เดียว (เรียกทุกเฟรม)
  drawShadows(){
    const g=this.shadowG; if(!g)return; g.clear(); g.fillStyle(this._chapter25D?0x041711:0x0a0510,this._chapter25D?0.40:0.28);
    const p=this.player; g.fillEllipse(p.x,p.y+31,this._chapter25D?52:46,this._chapter25D?18:15);
    // Android WebView บางรุ่น render ellipse จำนวนมากเป็นแท่งดำ จึงไม่วาดเงาศัตรูรวมใน Graphics นี้
    this.crates.children.iterate(c=>{ if(c&&c.active) g.fillEllipse(c.x, c.y+16, 30, 11); });
    this.heals.children.iterate(h=>{ if(h&&h.active) g.fillEllipse(h.x, h.y+11, 20, 8); });
  }
  // ปรับสเกล+ขอบชนของตัวละครให้เท่ากราฟิกเดิม (60px) ไม่ว่ารูปจริงจะกี่พิกเซล
  setCharScale(key){
    const src = (ASSET_SHEETS[key]&&ASSET_SHEETS[key].frame)
      || (this.player&&this.player.frame&&this.player.frame.width)
      || 60;
    // ปรับสเกลตาม "real footprints" ของอาร์ต (bbox เฉลี่ย กว้าง+สูง /2 วัดจากชีต) ให้ทุกตัวดูขนาดพอ ๆ กัน
    // Momo/Mint/Chocolate ใช้สัดส่วนอาร์ตมาตรฐานเดียวกันและแสดงผลขนาดเดียวกัน
    const baseKey=key.replace('_run','');
    const FP={ char_momo:110, char_mint:110, char_cocoa:110, char_taro:107, char_sesame:117, char_berry:116 }[baseKey];
    const TARGET=['char_momo','char_mint','char_cocoa','char_berry'].includes(baseKey)?56:66;
    this._pBase = FP ? (TARGET/FP) : (90/src);
    this._charKey=key;
    this._hasFrames = this.textures.exists(key) && this.textures.get(key).frameTotal>1;
    if(this._hasFrames){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2,4); this._poseHold=0; }
    const r=24, off=Math.max(0,(src-2*r)/2);
    if(this.player&&this.player.body)this.player.body.setCircle(r,off,off);
  }
  // เลือกเฟรมท่าทาง: พุ่ง=ยืด ·s่ง=สลับก้าว · โดนตี=ย่อ · Normal=ยืน+กะพริบตา
  updatePose(dt){
    if(!this._hasFrames)return;
    if(this._poseHold>0){ this._poseHold-=dt; return; }
    const baseCharKey='char_'+this.character;
    const runCharKey=baseCharKey+'_run';
    const hasRun=this.textures.exists(runCharKey);
    if(this.dashTime>0){
      if(hasRun&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);
      this.player.setFrame(CF.stretch); return;
    }
    const moving = this.player.body && this.player.body.velocity.length() > 24;
    if(moving){
      if(hasRun){
        if(this.player.texture.key!==runCharKey)this.player.setTexture(runCharKey);
        this._charRunT=(this._charRunT||0)+dt;
        this.player.setFrame(Math.floor(this._charRunT*16)%12);
      }else{
        const stepIdx = Math.floor((this._wob / (Math.PI * 0.5)) % 4);
        const frames = [CF.idle, CF.squash, CF.stretch, CF.blink];
        this.player.setFrame(frames[stepIdx] || CF.idle);
      }
      return;
    }
    if(hasRun&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);
    this._charRunT=0;
    this._blinkT-=dt;
    if(this._blinkT<=0){ this.player.setFrame(CF.blink);
      if(this._blinkT<-0.13){ this.player.setFrame(CF.idle); this._blinkT=Phaser.Math.FloatBetween(2.2,4.5); } }
    else this.player.setFrame(CF.idle);
  }
  poseFlash(frame,ms){ if(!this._hasFrames)return; const baseCharKey='char_'+this.character; if(this.textures.exists(baseCharKey)&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey); this.player.setFrame(frame); this._poseHold=(ms||160)/1000; }
  // อนิเมชันตัวละคร: สปริงเจลลี่ + หายใจ + หันหน้าตามทิศ + ควันฝุ่น + เงา Dash
  animatePlayer(dt){
    const p=this.player; if(!p||!p.body)return;
    if(this._sqVX===undefined){ this._sqVX=0; this._sqVY=0; this._wob=0; this._lean=0; }
    const stiff=210, damp=12;
    this._sqVX += (-(this._sqX-1)*stiff - this._sqVX*damp)*dt;
    this._sqVY += (-(this._sqY-1)*stiff - this._sqVY*damp)*dt;
    this._sqX += this._sqVX*dt; this._sqY += this._sqVY*dt;
    this._sqX=Phaser.Math.Clamp(this._sqX,0.55,1.6); this._sqY=Phaser.Math.Clamp(this._sqY,0.55,1.6);
    const sp=p.body.velocity.length(), moving=sp>24;
    // หันหน้าซ้าย-ขวาตามทิศทางการวิ่ง
    if(Math.abs(p.body.velocity.x)>15) p.setFlipX(p.body.velocity.x < 0);
    this._wob += dt*(moving?14:3.4);
    const breathe=Math.sin(this._wob)*(moving?0.11:0.05);
    const waddle=moving?Math.sin(this._wob*0.5)*0.10:0;
    const leanT=moving?Phaser.Math.Clamp(p.body.velocity.x/1100,-0.16,0.16):0;
    this._lean += (leanT-this._lean)*Math.min(1,dt*7);
    p.rotation = waddle + this._lean;
    // ชดเชยชีตตัวละครที่ "idle art smaller than run art" (เช่น Mint Frostleaf) → กันตัวหด/บีบตอนหยุดเดิน
    const runKey='char_'+this.character+'_run';
    const actMul=(this.player.texture.key!==runKey && CHAR_ACTION_SCALE[this.character])||1;
    const base=(this._pBase||1)*actMul;
    p.setScale(base*this._sqX*(1-breathe), base*this._sqY*(1+breathe));
    // ปล่อยฝุ่นละอองน้ำตาลใต้เท้าขณะวิ่ง
    if(moving){
      this._dustT = (this._dustT || 0) - dt;
      if(this._dustT <= 0){ this._dustT = 0.16; this.spawnDust(p.x,p.y+32); }
    }
    // ปล่อยเงาตามตัว (Ghost Trail) + เส้นความเร็ว ตอนพุ่ง Dash
    if(this.dashTime > 0){
      this._ghostT = (this._ghostT || 0) - dt;
      if(this._ghostT <= 0){ this._ghostT = 0.04; this.spawnGhostTrail(); }
      this._lineT = (this._lineT || 0) - dt;
      if(this._lineT <= 0){ this._lineT = 0.06;
        const da=Math.atan2(p.body.velocity.y,p.body.velocity.x);
        this.vfxSpeedLine(p.x+Phaser.Math.Between(-10,10),p.y+Phaser.Math.Between(-8,8),da);
      }
    }
  }
  jelly(vx,vy){ this._sqVX=(this._sqVX||0)+vx; this._sqVY=(this._sqVY||0)+vy; }

  /* ---------- DEATH ---------- */
  die(){ if(this.state==='dead')return;
    // Rank Perk 🕯️ เทียนคืนชีพ: ล้มแล้วฟื้น 1 times/Stage ที่ HP 45%
    if((this._reviveLeft||0)>0){ this._reviveLeft--; this.player.hp=Math.round(this.player.maxhp*0.45);
      if(this.player.body)this.player.body.enable=true; this.clearFoes(); this.screenFlash(0xffe08a,0.5,420); if(Sfx.clear)Sfx.clear();
      this.player.iframe=2.2; this.player.wardGuardT=1.6; if(this.popHeal)this.popHeal(this.player.x,this.player.y,Math.round(this.player.hp));
      if(this.showBanner)this.showBanner('🕯️ Revive Candle!','Revived to fight on · remaining '+this._reviveLeft+' times',1800); return; }
    if(this.endlessMode)Save.recordEndless(this.endlessCycle||0,this.kills||0,this.elapsed||0,this.character); this.state='dead'; if(this.lowHpVig){this._lowHpOn=false;this.lowHpVig.setAlpha(0).setVisible(false);} Sfx.bgmIntense(false);Sfx.dead();
    this._deathSugar=this.sugarStage||0;this._deathPowerBefore=Save.power(this.character);Save.addSugar(this._deathSugar);const pg=this._powerGuide||this.getPowerGuide(this.stageIndex),exp=Math.round((this.kills+this.stageIndex*15)*pg.reward);this.gainCharExp(exp);this._deathExp=exp;this._deathPowerAfter=Save.power(this.character);this.sugarStage=0;this.physics.pause();this.player.setVelocity(0,0);
    if(this._hasFrames){const baseCharKey='char_'+this.character;if(this.textures.exists(baseCharKey)&&this.player.texture.key!==baseCharKey)this.player.setTexture(baseCharKey);this.player.setFrame(CF.ko);this.player.setScale(this._pBase||1);this.player.setRotation(0);}
    this.buildOver(); }
  buildOver(){const w=this.W,h=this.H;this.over.removeAll(true);this._overBtns=[];
    const bg=this.add.rectangle(0,0,w,h,0x100b17,0.95).setOrigin(0,0),em=this.add.text(w/2,h*0.12,'🫠',{fontSize:'54px'}).setOrigin(0.5),t=this.add.text(w/2,h*0.22,'Your mochi melted!',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'27px',color:'#ff8fb5'}).setOrigin(0.5);
    const mm=Math.floor(this.elapsed/60),ss=Math.floor(this.elapsed%60),st=STAGES[this.stageIndex]||STAGES[0],diff=DIFFS[(this.stageDiff||1)-1]||DIFFS[0],skills=Object.keys(this.skills||{}).map(k=>SKILLDEFS[k]?.name).filter(Boolean),passes=Object.keys(this.passives||{}).map(k=>PASSIVES[k]?.name).filter(Boolean);
    const panel=this.add.graphics();panel.fillStyle(0x241c2d,0.96);panel.fillRoundedRect(20,h*0.28,w-40,h*0.40,17);panel.lineStyle(2,0x664c72,0.9);panel.strokeRoundedRect(20,h*0.28,w-40,h*0.40,17);
    const rows=[['🗺 Stage',st.emoji+' '+st.name],['🔥 Difficulty',diff.emoji+' '+diff.name],['⏱ Survived',mm+':'+ss.toString().padStart(2,'0')],['☠ Kills',String(this.kills)],['🌟 Run Level','Lv '+this.level],['🍬 Sugar','+'+(this._deathSugar||0)],['✨ Character EXP','+'+(this._deathExp||0)],['⚡ Power',(this._deathPowerBefore||0)+' → '+(this._deathPowerAfter||0)]];
    const box=[bg,em,t,panel];let y=h*0.315,step=(h*0.325)/rows.length;rows.forEach(r=>{const l=this.add.text(34,y,r[0],{fontFamily:'sans-serif',fontSize:'11px',color:'#bfaec8'}).setOrigin(0,0.5),v=this.add.text(w-34,y,r[1],{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'11px',color:'#ffffff',wordWrap:{width:w*0.55},align:'right'}).setOrigin(1,0.5);box.push(l,v);y+=step;});
    const build=this.add.text(w/2,h*0.655,'BUILD · '+(skills.slice(0,3).join(' / ')||'Starting weapon')+(passes.length?'\nPassives: '+passes.slice(0,3).join(' / '):''),{fontFamily:'sans-serif',fontSize:'9px',color:'#d8c4e3',align:'center',wordWrap:{width:w-60},maxLines:2}).setOrigin(0.5);box.push(build);
    // 📺 ฟื้นคืนชีพด้วยโฆษณา (ครั้งเดียวต่อWaitบ) — ไม่โผล่ในโหมด Endless (ตายแล้วจบWaitบ)
    if(!this._adRevived&&!this.endlessMode){ const rvw=Math.min(300,w-52),rvh=44,rvy=h*0.725,rg=this.add.graphics();
      rg.fillStyle(0x2fae6a,1);rg.fillRoundedRect(w/2-rvw/2,rvy-rvh/2,rvw,rvh,16);rg.lineStyle(2,0xffffff,0.3);rg.strokeRoundedRect(w/2-rvw/2,rvy-rvh/2,rvw,rvh,16);
      const rvt=this.add.text(w/2,rvy,'📺 Revive (Watch Ad)',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'15px',color:'#ffffff'}).setOrigin(0.5);
      box.push(rg,rvt); this._overBtns.push({x:w/2-rvw/2,y:rvy-rvh/2,w:rvw,h:rvh,fn:()=>this.showRewardedAd('Revive back into the field · HP 50%',()=>this.adRevive())}); }
    const bw=Math.min(180,(w-52)/2),bh=48,by=h*0.79,left=w/2-bw/2-6,right=w/2+bw/2+6,draw=(cx,color,label)=>{const g=this.add.graphics();g.fillStyle(color,1);g.fillRoundedRect(cx-bw/2,by-bh/2,bw,bh,15);g.lineStyle(2,0xffffff,0.25);g.strokeRoundedRect(cx-bw/2,by-bh/2,bw,bh,15);const tx=this.add.text(cx,by,label,{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'13px',color:'#ffffff'}).setOrigin(0.5);box.push(g,tx);};
    draw(left,COLORS.pink,'↻ Replay Stage');draw(right,COLORS.grape,'🏠 Back to Hub');
    this._overBtns.push({x:left-bw/2,y:by-bh/2,w:bw,h:bh,fn:()=>{this.over.setVisible(false);this.physics.resume();this.state='menu';if(this.endlessMode)this._endlessRequested=true;this.startRun(this.stageIndex);}});
    this._overBtns.push({x:right-bw/2,y:by-bh/2,w:bw,h:bh,fn:()=>this.scene.restart()});
    const hint=this.add.text(w/2,h*0.90,(Save.data.sugar||0)>=GACHA_COST?'You have enough Sugar to open a gear box!':'Upgrade your gear and Flavor Weave, then try again',{fontFamily:'sans-serif',fontSize:'10px',color:'#9f91aa'}).setOrigin(0.5);box.push(hint);this.over.add(box);this.over.setVisible(true); }
  // ---- Rewarded Ad: แสดงโฆษณาแล้วให้รางวัล (ตอนนี้เดโมจำลอง · ต่อ AdMob จริงได้ที่ hasRealAds/plugin) ----
  showRewardedAd(label,onReward){
    if(this._adBusy)return;
    if(AdManager.hasRealAds()){ this._adBusy=true; const p=AdManager.plugin();
      try{ Promise.resolve(p.prepareRewardVideoAd?p.prepareRewardVideoAd({adId:ADMOB_REWARD_ID}):null)
        .then(()=>p.showRewardVideoAd()).then(()=>{this._adBusy=false;onReward&&onReward();})
        .catch(()=>{this._adBusy=false;this._playSimAd(label,onReward);}); return; }catch(e){ this._adBusy=false; } }
    this._playSimAd(label,onReward);
  }
  _playSimAd(label,onReward){
    if(this._adBusy)return; this._adBusy=true; const w=this.W,h=this.H;
    const c=this.add.container(0,0).setScrollFactor(1).setDepth(99999); this.camUI(c);
    const bg=this.add.rectangle(0,0,w,h,0x05030a,0.93).setOrigin(0).setScrollFactor(1);
    const tag=this.add.text(w/2,h*0.33,'📺 Ad',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'30px',color:'#ffe08a'}).setOrigin(0.5).setScrollFactor(1);
    const sub=this.add.text(w/2,h*0.41,label||'Watch an ad for a reward',{fontFamily:'sans-serif',fontSize:'14px',color:'#e6dcf0',align:'center',wordWrap:{width:w-70}}).setOrigin(0.5).setScrollFactor(1);
    const cd=this.add.text(w/2,h*0.53,'3',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'64px',color:'#ffffff'}).setOrigin(0.5).setScrollFactor(1);
    const note=this.add.text(w/2,h*0.64,'(demo — replaced by real ads on the Play Store)',{fontFamily:'sans-serif',fontSize:'10px',color:'#8f849f'}).setOrigin(0.5).setScrollFactor(1);
    c.add([bg,tag,sub,cd,note]);
    let n=3; const tick=()=>{ n--; if(n>0){ cd.setText(String(n)); this.time.delayedCall(700,tick); }
      else { cd.setText('🎁'); Sfx.clear&&Sfx.clear(); this.time.delayedCall(520,()=>{ c.destroy(true); this._adBusy=false; onReward&&onReward(); }); } };
    this.time.delayedCall(700,tick);
  }
  // ฟื้นคืนชีพจากโฆษณา (ครั้งเดียวต่อWaitบ)
  adRevive(){
    this._adRevived=true; if(this.over)this.over.setVisible(false); this.state='play'; this.physics.resume();
    this.player.hp=Math.round(this.player.maxhp*0.5); if(this.player.body)this.player.body.enable=true;
    this.player.iframe=2.6; this.player.wardGuardT=1.8; this.clearFoes();
    if(this._hasFrames){ const bk='char_'+this.character; if(this.textures.exists(bk))this.player.setTexture(bk); this.player.setFrame(CF.idle); this.player.setScale(this._pBase||1); }
    this.screenFlash(0xffe08a,0.5,420); Sfx.clear&&Sfx.clear();
    if(this.showBanner)this.showBanner('✨ Revived!','Ad watched — back to the fight · HP 50%',1800);
  }

  _nearestEnemy(){ let best=null,bd=Infinity; this.enemies.children.iterate(e=>{ if(!e||!e.active)return; const d=this.dist(e.x,e.y,this.player.x,this.player.y); if(d<bd){bd=d;best=e;} }); return best; }
  _nearestWaveObjective(){
    const o=this.waveObjective;if(!o)return null;if(o.type==='capture'&&this._captureZone)return this.dist(this.player.x,this.player.y,this._captureZone.x,this._captureZone.y)<=this._captureZone.radiusGoal?null:this._captureZone;let best=null,bd=Infinity;
    if(o.type==='purge'&&this.waveNodes)this.waveNodes.children.iterate(n=>{if(!n||!n.active||!n._waveObjectiveNode)return;const d=this.dist(n.x,n.y,this.player.x,this.player.y);if(d<bd){bd=d;best=n;}});
    if(o.type==='hunt'&&this.enemies)this.enemies.children.iterate(e=>{if(!e||!e.active||!e._waveObjectiveTarget)return;const d=this.dist(e.x,e.y,this.player.x,this.player.y);if(d<bd){bd=d;best=e;}});return best;
  }
  updateObjectiveArrow(){
    let target=(this.boss&&this.boss.active)?this.boss:(this.portalTarget&&this.portalTarget.active?this.portalTarget:null);
    if(!target&&this.mode==='wave')target=this._nearestWaveObjective();
    if(!target && this.mode==='waveclear') target=this._nearestEnemy();   // ชี้ไปหาศัตรูที่เหลือตอนต้องเคลียร์
    if(!target){if(this.objectiveArrow)this.objectiveArrow.setVisible(false);if(this.objectiveDist)this.objectiveDist.setVisible(false);return;}
    // ลูกศรหมุนWaitบ "screen center" → ต้องวัดมุมจากจุดกึ่งกลางกล้อง (โลก) ไม่ใช่Positionผู้เล่น (กล้อง lerp/deadzone ทำให้ผู้เล่นไม่อยู่กลางจอเป๊ะ = ลูกศรเพี้ยน)
    const cam=this.cameras.main,wv=cam.worldView,ox=wv.centerX,oy=wv.centerY;
    const dx=target.x-ox,dy=target.y-oy,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
    const cx=this.W/2,cy=this.H/2,margin=64,ca=Math.cos(a),sa=Math.sin(a);
    const tx=Math.abs(ca)>0.001?(cx-margin)/Math.abs(ca):9999,ty=Math.abs(sa)>0.001?(cy-margin-65)/Math.abs(sa):9999,t=Math.min(tx,ty);
    this.objectiveArrow.setPosition(cx+ca*t,cy+sa*t).setRotation(a).setVisible(true).setColor(this.mode==='portal'?'#c99cff':'#ffef7a');
    this.objectiveDist.setVisible(false);   // บอกเฉพาะทิศ ไม่เปิดเผยระยะตามดีไซน์
  }
  /* ---------- UPDATE ---------- */
  // ระบบตื่นเต้นตอนใกล้ตาย: ขอบจอแดงเต้นเป็นจังหวะ + เสียงหัวใจ (ยิ่งเลือดน้อย ยิ่งถี่/แดงเข้ม)
  tickNearDeath(dt){
    const v=this.lowHpVig; if(!v)return;
    const hpf=this.player.hp/this.player.maxhp, TH=0.30;
    if(this.player.hp>0 && hpf<TH){
      const sev=Phaser.Math.Clamp((TH-hpf)/TH,0,1);   // 0 ที่ 30% → 1 ที่ใกล้ 0
      if(!this._lowHpOn){ this._lowHpOn=true; v.setVisible(true); this._hbAcc=0; }
      const pulse=0.5+0.5*Math.sin(this.elapsed*(6+sev*7));   // เต้นเร็วขึ้นเมื่อวิกฤต
      v.setAlpha((0.18+sev*0.34)*(0.55+0.45*pulse));
      this._hbAcc-=dt;
      if(this._hbAcc<=0){ this._hbAcc=Math.max(0.34,0.92-sev*0.55); Sfx.heartbeat(sev); this.screenShake(70,0.001+sev*0.0016); }
    } else if(this._lowHpOn){
      this._lowHpOn=false; v.setAlpha(0).setVisible(false);
    }
  }
  update(time,delta){
    let dt=delta/1000; if(this.state!=='play')return; dt*=(this.gameSpeed||1); this.elapsed+=dt;   // gameSpeed = ปุ่มเร่งเวลา
    this.moveSlowT=Math.max(0,(this.moveSlowT||0)-dt);this.pathHasteT=Math.max(0,(this.pathHasteT||0)-dt);this.player.wardGuardT=Math.max(0,(this.player.wardGuardT||0)-dt);this._lifeOnKillCd=Math.max(0,(this._lifeOnKillCd||0)-dt);
    this._echoTrailAcc=(this._echoTrailAcc||0)+dt;if(this._echoTrailAcc>=0.08){this._echoTrailAcc=0;if(!this._echoTrail)this._echoTrail=[];this._echoTrail.push({x:this.player.x,y:this.player.y});if(this._echoTrail.length>80)this._echoTrail.shift();}

    if(this.joy.active&&(this.joy.dx||this.joy.dy)){ this.moveDir.set(this.joy.dx,this.joy.dy); if(this.moveDir.lengthSq()>0.04)this.moveDir.normalize(); }

    if(this.dashTime>0){ this.dashTime-=dt; if(this.dashTime<=0){ this._sqX=0.8; this._sqY=1.22; this._sqVX=0; this._sqVY=0; this.poseFlash(CF.squash,150); } }
    else {
      const spd=this.player.baseSpeed*(this.moveSlowT>0?0.52:1)*(this.pathHasteT>0?1.18:1);
      if(this.joy.active&&(Math.abs(this.joy.dx)+Math.abs(this.joy.dy))>0.12) this.player.setVelocity(this.joy.dx*spd,this.joy.dy*spd);
      else { this.player.setVelocity(this.player.body.velocity.x*0.8,this.player.body.velocity.y*0.8); if(this.player.body.velocity.length()<8)this.player.setVelocity(0,0); }
    }
    if(this.drainPull&&this.drainPull.t>0){this.drainPull.t-=dt;const a=Math.atan2(this.drainPull.y-this.player.y,this.drainPull.x-this.player.x),v=this.player.body.velocity,s=this.drainPull.strength||120;this.player.setVelocity(v.x+Math.cos(a)*s,v.y+Math.sin(a)*s);if(this.drainPull.t<=0)this.drainPull=null;}
    // ยิ่งยืนนิ่งนาน มอนยิ่งไหลมาเยอะ (กันแคมป์ + เพิ่มความกดดัน)
    { const movingNow=this.player.body&&this.player.body.velocity.length()>40; this._idleT=movingNow?0:Math.min(14,(this._idleT||0)+dt); this._idleP=Math.min(0.7,Math.max(0,(this._idleT-1.5))*0.075); }

    if(this.player.iframe>0)this.player.iframe-=dt;
    if(!Number.isFinite(this.player.maxhp)||this.player.maxhp<=0)this.player.maxhp=90;
    if(!Number.isFinite(this.player.hp))this.player.hp=this.player.maxhp;   // safety net: กัน HP ค้าง NaN
    const regenPerSec=Math.min(this.player.maxhp*0.03,(this.player.regen||0)+(this.player.regenFlat||0)+this.player.maxhp*(this.player.regenPct||0));
    if(regenPerSec>0&&this.player.hp<this.player.maxhp)this.player.hp=Math.min(this.player.maxhp,this.player.hp+regenPerSec*dt);
    this.tickNearDeath(dt);
    if(this.aura)this.aura.setPosition(this.player.x,this.player.y);
    this.animatePlayer(dt); this.updatePose(dt);
    if(this.iso){ this.player.setDepth(this.player.y); this.drawShadows(); }
    if(!this.dashReady){ this.dashCd-=dt; if(this.dashCd<=0)this.dashReady=true; }
    if(this.dashBtn) this.dashBtn.setFillStyle(COLORS.mint,this.dashReady?0.28:0.10);
    this.drawDashRing();
    this.updatePickupReadability();
    if(this.uniqueCd>0)this.uniqueCd=Math.max(0,this.uniqueCd-dt);if(this.uniqueBtn){const u=this.uniqueInfo();this.uniqueBtn.setFillStyle(u.color,this.uniqueCd>0?0.10:0.28);}this.drawUniqueRing();
    this.tickAura(dt);
    this.tickCharSignature(dt);
    if(this._coach)this.tickTutorialCoach(dt);
    this.tickStage(dt);
    this.tickBossZoom();
    this.tickBossObjects(dt);

    // enemies
    this.enemies.children.iterate(e=>{ if(!e||!e.active)return;
      if(this.iso)e.setDepth(e.y);
      if(e.bloomUntil>0){e.bloomUntil-=dt;if(e.bloomUntil<=0)e.bloomStacks=0;}
      if(e.frozen>0){ e.frozen-=dt; e.setVelocity(0,0); if(e.frozen<=0){ if(e.tintColor)e.setTint(e.tintColor); else e.clearTint(); } return; }
      if(e.knock>0){ e.knock-=dt; return; }
      if(e._decoyT>0)e._decoyT-=dt;
      const tx=e._decoyT>0?e._decoyX:this.player.x,ty=e._decoyT>0?e._decoyY:this.player.y;
      const dx=tx-e.x, dy=ty-e.y, ang=Math.atan2(dy,dx), dd=Math.hypot(dx,dy);
      // หันหน้าเข้าหาผู้เล่นเสมอ
      e.setFlipX(dx < 0);
      // แอนิเมชันก้าวเดินส่ายดึ๋งๆ (Waddle & Bounce)
      e.stepT = (e.stepT || (Math.random()*10)) + dt * (e.spd > 80 ? 12 : 7);
      const waddle = Math.sin(e.stepT) * (e.dasher ? 0.14 : 0.08);
      const bounce = Math.abs(Math.sin(e.stepT)) * 0.08;
      e.rotation = waddle;
      // ฟื้นตัวจาก Squash ตอนโดนตี
      if(e._sqX === undefined){ e._sqX = 1; e._sqY = 1; }
      e._sqX += (1 - e._sqX) * Math.min(1, dt * 14);
      e._sqY += (1 - e._sqY) * Math.min(1, dt * 14);
      const perspective=this._chapter25D?Phaser.Math.Clamp(1+(e.y-this.player.y)*0.00010,0.94,1.07):1,bScale=(e.baseScale || 1)*perspective;
      e.setScale(bScale * e._sqX * (1 - bounce*0.4), bScale * e._sqY * (1 + bounce));

      if(e.acid){ e.shootCd-=dt;
        if(dd<430){ e.setVelocity(Math.cos(ang)*(dd<210?-e.spd*0.7:e.spd*0.18),Math.sin(ang)*(dd<210?-e.spd*0.7:e.spd*0.18));
          if(e.shootCd<=0){ e.shootCd=Phaser.Math.FloatBetween(1.45,2.15); if(e.anims)e.anims.stop();e.setFrame(3);
            this.foeShot(e.x,e.y,ang,205,e.dmg,0x72ff3d,1.05);Sfx.zap();
            this.time.delayedCall(260,()=>{if(e.active&&e.acid&&this.anims.exists('e_acid_walk'))e.play('e_acid_walk',true);});}
          return;}
      }
      if(e.shooter){ e.shootCd-=dt;
        if(dd<300){ e.setVelocity(Math.cos(ang)*e.spd*0.12,Math.sin(ang)*e.spd*0.12);
          if(e.shootCd<=0){ e.shootCd=Phaser.Math.FloatBetween(1.3,2.2);if(this.stageIndex===4)this.stage5EnemyPose(e,4,430);this.foeShot(e.x,e.y,ang,225+this.stageIndex*15,e.dmg,0xffd27f); Sfx.zap(); }
          return; } }
      if(e.dasher){   // สายพุ่งโฉบ: เข้าfind → หน่วงเล็ง(ตัวสั่น) → พุ่งเร็วตัดผ่าน → พักแล้ววนใหม่
        e.dashT-=dt;
        if(e.dashState==='chase'){ e.setVelocity(Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);
          if(e.dashT<=0 && dd<360){ e.dashState='wind'; e.dashT=0.5; e.setVelocity(0,0);if(this.stageIndex===4)this.stage5EnemyPose(e,4,400);   // wind ยาวขึ้นเล็กน้อยให้อ่านทัน
            if(!e._dashTel){ e._dashTel=this.camWorld(this.add.image(e.x,e.y,'vfx_line').setDepth(3).setTint(0xff5a3c).setAlpha(0)); this.tweens.add({targets:e._dashTel,alpha:0.8,duration:160}); } } }
        else if(e.dashState==='wind'){
          e.setVelocity(0,0);
          e.x += (Math.random() - 0.5) * 5;   // ตัวสั่นตอนชาร์จ
          // เส้นเตือนทิศพุ่ง (แบบ Archero) — เล็งไปที่ผู้เล่นตอนชาร์จ ให้หลบทัน
          if(e._dashTel){ const a=Math.atan2(this.player.y-e.y,this.player.x-e.x),len=Math.min(dd,320); e._dashTel.setPosition(e.x+Math.cos(a)*len/2,e.y+Math.sin(a)*len/2).setRotation(a).setDisplaySize(len,9); }
          if(e.dashT<=0){ e.dashState='dash'; e.dashT=0.32; e._da=ang;if(this.stageIndex===4)this.stage5EnemyPose(e,5,340); if(e.tintColor)e.setTint(e.tintColor); else e.clearTint();
            if(e._dashTel){this.tweens.killTweensOf(e._dashTel);e._dashTel.destroy();e._dashTel=null;}
            if(e.body)this.physics.velocityFromRotation(ang,e.spd*4.6,e.body.velocity); Sfx.dash&&Sfx.dash(); } }
        else if(e.dashState==='dash'){ if(e.body)this.physics.velocityFromRotation(e._da,e.spd*4.6,e.body.velocity);
          if(e.dashT<=0){ e.dashState='chase'; e.dashT=Phaser.Math.FloatBetween(0.9,1.8); } }
        return; }
      e.setVelocity(Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);
    });

    // orb vacuum + ออร์บAlive (หมุนช้า + เต้นวิบวับ)
    this.orbs.children.iterate(o=>{ if(!o||!o.active)return;
      o.rotation+=dt*2.2; const bob=1+Math.sin(this.elapsed*5+o.x*0.05)*0.12; o.setScale((o._sc||1)*bob);
      const d=this.dist(o.x,o.y,this.player.x,this.player.y);
      if(o._vac || d<this.player.pickup){ const ang=Math.atan2(this.player.y-o.y,this.player.x-o.x), sp=o._vac?560:380; o.setVelocity(Math.cos(ang)*sp,Math.sin(ang)*sp); }
      else o.setVelocity(0,0); });

    // bullets life + boomerang return/rebound + spin + pierce cd
    this.bullets.children.iterate(b=>{ if(!b||!b.active)return;
      b.life-=dt; if(b.hitCd>0)b.hitCd-=dt;
      if(b.spin)b.rotation+=dt*14;
      else if(b.faceVel&&b.body&&(b.body.velocity.x||b.body.velocity.y))b.rotation=Math.atan2(b.body.velocity.y,b.body.velocity.x);   // จรวด/ส้อมหันตามทิศพุ่ง
      if(b.homing&&b.body){ const t=b.lockedTarget&&b.lockedTarget.active?b.lockedTarget:this.nearestEnemy(520); if(t){ const desired=Math.atan2(t.y-b.y,t.x-b.x);
        const cur=Math.atan2(b.body.velocity.y,b.body.velocity.x), turn=b.homing*0.02*dt;
        const d=Phaser.Math.Angle.Wrap(desired-cur), step=Phaser.Math.Clamp(d,-turn,turn);
        this.physics.velocityFromRotation(cur+step,240,b.body.velocity); } }
      if(b.boomer){ b.bt+=dt;
        if(!b.returned && b.bt>=b.bdur){ b.returned=true; const ang=Math.atan2(this.player.y-b.y,this.player.x-b.x); this.physics.velocityFromRotation(ang,480,b.body.velocity); }
        if(b.returned && this.dist(b.x,b.y,this.player.x,this.player.y)<42){
          if(b.rebound && b.reb<1){ b.reb++; b.returned=false; b.bt=0; b.life=1.6;
            const t=this.nearestEnemy(760), ang=t?Math.atan2(t.y-b.y,t.x-b.x):this.moveDir.angle();
            this.physics.velocityFromRotation(ang,440,b.body.velocity); }
          else {if(this.skillCd&&this.skillCd.boomer!=null)this.skillCd.boomer=Math.max(0,this.skillCd.boomer-0.32);this.killBullet(b); return; } } }
      if(b.life<=0)this.killBullet(b); });

    // auto-cast skills tick
    for(const key in this.skills){ if(SKILLDEFS[key].orbit) continue;
      this.skillCd[key]-=dt; if(this.skillCd[key]<=0){ this.castSkill(key,this.skills[key]); this.skillCd[key]=this.cdOf(key,this.skills[key])*(this.player.cdMul||1); } }
    if(this.ringBalls.length){ this.ringRot=(this.ringRot||0)+dt*(this.ringSpin||2.6);
      this.ringBalls.forEach(b=>{ if(b.hitCd>0)b.hitCd-=dt; const a=this.ringRot+(b.ang0||0),pulse=1+Math.sin(this.elapsed*7+(b._motionPhase||0))*0.11;
        b.setPosition(this.player.x+Math.cos(a)*(b.rr||54),this.player.y+Math.sin(a)*(b.rr||54)).setScale((b._baseScale||0.24)*pulse).setRotation(a+this.elapsed*1.8); });
      (this.starGuardFields||[]).forEach(f=>{if(!f.active)return;f.setPosition(this.player.x,this.player.y).setRotation((f.rotation||0)+dt*0.32*f._spinDir).setAlpha((f._phase?0.055:0.10)+Math.sin(this.elapsed*3.2+(f._phase||0))*0.018);});
      this._starTrailTick=(this._starTrailTick||0)-dt;if(this._starTrailTick<=0){this._starTrailTick=0.11;this._starTrailIndex=((this._starTrailIndex||0)+1)%this.ringBalls.length;const s=this.ringBalls[this._starTrailIndex],ghost=this.camWorld(this.add.image(s.x,s.y,'ic_star').setDepth(4).setScale((s._baseScale||0.28)*0.72).setRotation(s.rotation).setAlpha(0.22));this.tweens.add({targets:ghost,scale:ghost.scaleX*0.45,alpha:0,duration:180,onComplete:()=>ghost.destroy()});} }
    this._starGuardTick=(this._starGuardTick||0)-dt;if(this.ringBalls.length&&this._starGuardTick<=0){this._starGuardTick=0.12;this.foeBullets.children.iterate(f=>{if(!f||!f.active)return;for(const star of this.ringBalls){if(this.dist(f.x,f.y,star.x,star.y)<30){const x=star.x,y=star.y;this.killFoe(f);this.vfxHitRing(x,y,0xffe08a,false);break;}}});}

    // เครื่องหมาย Memory Jam ต้องเกาะเป้าหมายขณะเป้าหมายเคลื่อนที่ ไม่ทิ้งภาพนิ่งไว้บนพื้น
    this.enemies.children.iterate(e=>{if(e&&e.active&&e._memoryMarkObj&&e._memoryMarkObj.active)e._memoryMarkObj.setPosition(e.x,e.y-8);});

    // กระสุนศัตรู (อายุ)
    this.foeBullets.children.iterate(b=>{ if(!b||!b.active)return; b.life-=dt; if(b.life<=0)this.killFoe(b); });

    // boss/mini HP bar + AI แพทเทิร์นโจมตี
    if(this.boss && this.boss.active){
      this.bossThink(this.boss,dt);
      this.tickBossObjective(dt);
      this.bossBar.width=Math.max(0,(this._barW*0.8-4)*(this.boss.hp/this.boss.maxhp));
      if(this.bossHpTxt)this.bossHpTxt.setText(Math.max(0,Math.ceil(this.boss.hp)).toLocaleString()+' / '+Math.ceil(this.boss.maxhp).toLocaleString());
    }
    this.updateObjectiveArrow();
    this.drawBars();
  }
}

// Phaser 3 None GameConfig.resolution สำหรับ canvas หลัก: สร้าง backing store เป็น physical pixels เอง
const DEVICE_DPR = window.devicePixelRatio||1;
const LOW_MEMORY_DEVICE = Number(navigator.deviceMemory||8)<=4;
const RENDER_DPR = Math.max(1, Math.min(DEVICE_DPR, LOW_MEMORY_DEVICE?2.25:3));
const RENDER_W = Math.max(1,Math.round(window.innerWidth*RENDER_DPR));
const RENDER_H = Math.max(1,Math.round(window.innerHeight*RENDER_DPR));
// Phaser Text มี CanvasTexture แยกและค่าเริ่มต้น resolution 1 จึงต้องเพิ่มตาม DPR เช่นกัน
const _textFactory=Phaser.GameObjects.GameObjectFactory.prototype.text;
Phaser.GameObjects.GameObjectFactory.prototype.text=function(x,y,value,style){
  return _textFactory.call(this,x,y,value,style).setResolution(RENDER_DPR);
};
window.__g = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#3a3355',
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: RENDER_W,
    height: RENDER_H,
  },
  physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
  render: { antialias:true, antialiasGL:true, roundPixels:false, powerPreference:'high-performance' },
  scene: [Boot, Opening, Game],
});
// ปรับขนาดตอนหมุนจอ/เปลี่ยนขนาด — debounce กันค่าเพี้ยนช่วงหมุน + อ่านค่าจริงหลังหมุนเสร็จ
let _rzT=null;
function _applyResize(){ const g=window.__g; if(!g||!g.scale)return;
  const w=window.innerWidth, h=window.innerHeight;
  g.scale.resize(Math.round(w*RENDER_DPR),Math.round(h*RENDER_DPR)); g.scale.refresh(); }
function _scheduleResize(){ clearTimeout(_rzT); _rzT=setTimeout(_applyResize,160); _applyResize(); }
window.addEventListener('resize', _scheduleResize);
window.addEventListener('orientationchange', ()=>{ setTimeout(_applyResize,60); setTimeout(_applyResize,300); setTimeout(_applyResize,600); });
if(window.visualViewport)window.visualViewport.addEventListener('resize',_scheduleResize);
