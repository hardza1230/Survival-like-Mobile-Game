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
    ['nest_acid',-900,760,false,0.58],['nest_acid',920,-720,false,0.58],
    ['p_box',-550,-930,false,0.78],['p_box',570,920,false,0.72]
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
// v6.55.29: สแตตฮีโร่จริง (ใช้ทั้งหน้า Stats และ Power) · basic = basicAttack ในรัน (null ในเมนู)
function computeHeroStats(cid,basic){
    const p={maxhp:90,dmgMul:1,flatDmg:0,baseSpeed:BALANCE.moveSpeed,dmgTakenMul:1,critChance:0,critMul:1.55,cdMul:1,regen:0,regenFlat:0,pickup:105,lifesteal:0};
    // v6.55.18: เก็บ snapshot หลังแต่ละแหล่ง → หน้า Stats โชว์ว่าค่ามาจากไหน
    const snap=()=>({maxhp:p.maxhp,dmgMul:p.dmgMul,critChance:p.critChance,critMul:p.critMul,dmgTakenMul:p.dmgTakenMul,baseSpeed:p.baseSpeed,cdMul:p.cdMul,regen:(p.regen||0)+(p.regenFlat||0),armor:p.armor||0});
    const trace=[{label:'Base',s:snap()}],mark=l=>trace.push({label:l,s:snap()});p._trace=trace;
    const ch=CHARACTERS[cid]||CHARACTERS.momo,st=ch.stats||{};
    if(st.hp)p.maxhp+=st.hp; if(st.dmg)p.dmgMul*=st.dmg; if(st.spd)p.baseSpeed*=st.spd; if(st.def)p.dmgTakenMul*=st.def; if(st.crit)p.critChance+=st.crit; if(st.cdr)p.cdMul*=st.cdr; if(st.regenFlat)p.regenFlat+=st.regenFlat;
    mark('Hero profile');
    const sw=SIGNATURE_WEAPONS[ch.weapon]; if(sw){ p.dmgMul+=((sw.dmgMul||1))-1; p.cdMul*=(sw.cdMul||1); } mark('Signature weapon');
    // v6.55.22: แยกที่มาละเอียดราย talent / แก่น / ชิ้น gear / mod / เซ็ท / perk
    const talents=Save.cp(cid).tal||{};for(const def of charTalents(cid)){const r=talents[def.id]||0;if(r>0&&def.apply){def.apply(p,r);mark('Talent · '+def.name+' '+r);}}
    if(basic&&basic.path){applyPathTalents(p,cid,basic.path,talents);basic._ptal=basic.path;mark('Path talents');}
    if(cid==='sesame'&&talents){p._pt=p._pt||{};for(const d of talentBranch(SES_RUNE_PT)){const r=talents[d.id]||0;if(r>0&&d.apply)d.apply(p,r);}mark('Rune talents');}
    { const cpl=Save.cp(cid).lvl||1; if(cid==='cocoa'){ p.lowHpGuard=(p.lowHpGuard||0)+0.15*charPassiveScale(cpl); } }
    for(const k in UPGRADES){ const tot=Save.talTotal(k); if(tot>0&&UPGRADES[k].apply){UPGRADES[k].apply(p,tot);mark('Weave · '+UPGRADES[k].name+' Lv'+tot);} }
    applySpecialCores(p); mark('Special Cores');
    for(const slot of GEAR_SLOTS){ const inst=Save.equippedGearItem(slot.slot); if(!inst)continue; const it=GEAR_ALL.find(g=>g.id===inst.baseId),el=Save.gearLv(inst.uid),nm=(it?it.name:slot.slot)+(it&&it.tier!=='start'?' iLv'+(inst.itemLevel||1):'')+(el?' +'+el:'');
      if(it&&it.apply){if(it.tier==='start')it.apply(p,el);else applyScaledGear(p,it,el,inst.itemLevel,inst);mark('Gear · '+nm+(it.tier==='start'?'':' ('+Math.round(gearBaseScale(inst.itemLevel)*100)+'%)'));}
      applyItemLevelBonus(p,inst);mark('Gear · '+nm+' iLv bonus');if(slot.slot==='weapon'&&it&&it.tier!=='start')p.powerMul=itemPowerMul(inst.itemLevel);
      for(const a of gearActiveAffixes(inst)){ const d=affixDef(a.id); if(d&&d.apply&&!weaponLocalMod(inst,a.id)){d.apply(p,a.v);mark('Mod · '+(d.label||a.id)+' T'+(a.t!=null?a.t:'?')+' ('+(it?it.name:slot.slot)+')');} } }
    { const sc=gearSetCounts(); for(const sid in sc){ const def=GEAR_SETS[sid]; if(!def)continue; for(const need in def.bonuses){ if(sc[sid]>=+need&&def.bonuses[need].apply){def.bonuses[need].apply(p);mark('Set · '+def.name+' '+need+'pc');} } } }
    const rp=Save.data.rankPerks||{}; 
    if(Save.ancientHas('deepRoots')){ p.regen=(p.regen||0)+1; } mark('Ancient Perks');
    if(applyFrUpkeep(p))mark('Kitchen upkeep');
    clampPlayerStats(p); mark('Stat cap');   // v4.55: เดิมใช้เพดาน 0.6/0.5 ≠ ในเกมจริง → หน้า Stats โชว์เลขเกินของจริง
    return p;
}
// v6.55.29: Power = จากสแตตจริง · Offense = ดาเมจต่อวินาทีสัมพัทธ์ · Defense = HP ที่ต้องเสียจริง (Effective HP)
// Power = 100 × √(Offense × Defense/90) → ฮีโร่ฐานไม่มีอะไร ≈ 100 · ดาเมจ ×2 หรือ EHP ×2 = Power ×1.41 · ทั้งคู่ ×2 = ×2
const POWER_BASE_HIT=12;
// v6.55.30: เผื่อการ์ด/เลเวลระหว่างด่าน (เฉลี่ยทั้งด่าน) → Power บนจอ = พลังตอนสู้จริงโดยประมาณ · ค่าแนะนำคูณตัวเดียวกัน (อัตราส่วนไม่เปลี่ยน)
const RUN_CARD_OFF=1.5, RUN_CARD_DEF=1.15, RUN_CARD_MUL=Math.sqrt(RUN_CARD_OFF*RUN_CARD_DEF);
function heroOffense(p,cid){const crit=1+Math.min(1,p.critChance||0)*((p.critMul||1.55)-1),flat=((p.gearAttackMin||0)+(p.gearAttackMax||0))/2+(p.flatDmg||0);
  return Math.max(0.05,p.dmgMul||1)*(p.powerMul||1)*crit*(1+flat*ATK_PCT)/Math.max(0.1,p.cdMul||1);}
function heroDefense(p){const taken=Math.max(0.05,(p.dmgTakenMul||1)*armorDamageMultiplier(p)),hp=Math.max(1,p.maxhp||90),reg=(p.regen||0)+(p.regenFlat||0);
  return hp/taken*(1+reg*8/hp);}
// v7.6.8 เจ้าของ: แยก Power เป็น ⚔ ATK (ตีแรง) / 🛡 DEF (อึด) เพื่อดูว่าไอเทมไหนเสริมด้านไหน · ATK = 100×offense · DEF = HP ที่ปรับตามเกราะ/ลดดาเมจ/regen
function heroAD(cid,basic){const p=computeHeroStats(cid,basic);return {a:Math.max(1,Math.round(100*heroOffense(p,cid))),d:Math.max(1,Math.round(heroDefense(p)))};}
// v7.8.84 เทียบกับชิ้นที่ใส่: a=ATK d=DEF m=ความคล่อง (รองเท้า: วิ่ง+Dash% ที่ ATK/DEF ไม่นับ) · mixed = ดีบางด้าน แย่บางด้าน
function gearCompareScore(item,base){const dd=gearADDelta(item,base);let m=0;if(item&&item.slot==='boots'&&typeof Save!=='undefined'){const eqI=Save.equippedGearItem&&Save.equippedGearItem('boots');if(!eqI||eqI.uid!==item.uid){const n=gearBaseStats(item),o=eqI?gearBaseStats(eqI):{speed:0,dashCd:0};m=Math.round(((n.speed||0)+(n.dashCd||0)-(o.speed||0)-(o.dashCd||0))*10)/10;}}
  const parts=[dd.a,dd.d,m*10].filter(v=>v),pos=parts.some(v=>v>0),neg=parts.some(v=>v<0);return {a:dd.a,d:dd.d,m,sum:dd.a+dd.d+m*10,any:parts.length>0,mixed:pos&&neg,better:pos&&!neg,worse:neg&&!pos};}
function gearADDelta(item,base){try{const d=Save.data,cid=d.character||'momo',slot=item&&item.slot;if(!slot)return {a:0,d:0};const eq=d.equippedGear||(d.equippedGear={}),prev=eq[slot];if(prev===item.uid)return {a:0,d:0};
  const b0=base||heroAD(cid,null),list=d.gearItems||(d.gearItems=[]),added=!list.includes(item);if(added)list.push(item);eq[slot]=item.uid;let n=b0;try{n=heroAD(cid,null);}finally{if(prev===undefined)delete eq[slot];else eq[slot]=prev;if(added)list.splice(list.indexOf(item),1);}return {a:n.a-b0.a,d:n.d-b0.d};}catch(e){return {a:0,d:0};}}
function heroPower(cid,basic){const p=computeHeroStats(cid,basic);return Math.max(1,Math.round(100*Math.sqrt(heroOffense(p,cid)*RUN_CARD_OFF*heroDefense(p)*RUN_CARD_DEF/90)));}
// Power แนะนำต่อด่าน = คิดจากตัวเลขศัตรูจริงของด่าน (HP/ดาเมจ มอน + บอส) เทียบด่าน 1 · ปรับสูตรศัตรู = ค่าแนะนำตามเอง
function stageThreat(i){const st=STAGES[i]||STAGES[0];   // v7.8.75 เจ้าของ: Power แนะนำคิดจากเส้นมอน/บอสชุดใหม่ (v7.8.65–66) — เดิมยังใช้สูตรเก่าจน C2 แนะนำสูงไป/C3 ท้ายต่ำไป
  const H=[1,1.29,1.664,2.147,2.769,3.572,4.608,5.945,7.669,9.893,12.761,16.462,23.047,32.266,45.172],D=[1,1.082,1.171,1.267,1.371,1.483,1.605,1.736,1.879,2.033,2.199,2.38,2.689,3.038,3.433],B=[1,1.45,2.11,3.07,4.47,6.49,9.44,13.73,19.96,29.02,42.18,61.33,96.76,152.67,240.88];
  const mobHp=H[i]??H[14]*Math.pow(1.4,i-14),mobDmg=D[i]??D[14]*Math.pow(1.13,i-14),bossHp=B[i]??B[14]*Math.pow(1.578,i-14),bossDmg=Math.max((st.bossDmg||25)*1.3*.75,18*1.3*mobDmg*1.5);
  return {hp:Math.sqrt(mobHp*bossHp),dmg:Math.sqrt(mobDmg*bossDmg)};}
function stageRecommendedPower(i){const t=stageThreat(i),b=stageThreat(0);return Math.round(100*RUN_CARD_MUL*Math.sqrt((t.hp/b.hp)*(t.dmg/b.dmg))/10)*10;}
const STAGES = [
  { name:'The Sour Ant Nest', en:'The Sour Ant Nest', emoji:'🐜', grid:0x2d261f, tint:0x8ee04b,
    lore:'A cursed strawberry mochi falls through a crack under the pantry, finds the waking Heart Seed and becomes a person again — in a nest where acid crystals warp the whole ant kingdom',
    objectives:['hungerHerald','hunt','capture','purge'],lead:'hungerHerald',
    waves:5, recommendedPower:100, miniAt:2, mini:'Ruby-Fang Guard',
    boss:'Emerald Acid Ant Empress', bossHp:920, bossDmg:25 },
  { name:'The Rotting Drain', en:'The Rotting Drain', emoji:'🚰', grid:0x3c4d61, tint:0x8fc7ff,
    lore:'Acid from the nest floods the ancient drains, raising creatures of foam, sewage and grate scraps into a new army',
    objectives:['hungersMouth','hunt','capture','purge'],lead:'hungersMouth',
    waves:5, recommendedPower:280, miniAt:2, mini:'Valve Maw, Pressure Warden', boss:'Clogmaw, Lord of Clogged Pipes', bossHp:1120, bossDmg:24 },
  { name:'Chili Engine Room', en:'Chili Engine Room', emoji:'🔥', grid:0x60463c, tint:0xff8a5a,
    lore:'The chili furnace burns the stolen flavor of cursed mochi to feed a root of the Crown',
    objectives:['grandmasPot','hunt','capture','purge'],lead:'grandmasPot',
    waves:5, recommendedPower:560, miniAt:2, mini:'Boiling Pan', boss:'Mr. Griddle', bossHp:1000, bossDmg:28 },
  { name:'Sugar Frost Prison', en:'Sugar Frost Prison', emoji:'❄️', grid:0x3d4a5c, tint:0x9fe0ff,
    lore:'Cursed mochi are frozen as fuel — Grandma among them — and the golem wardens let no one escape',
    objectives:['survive','hunt','frozenPantry','capture'],lead:'frozenPantry',
    waves:5, recommendedPower:940, miniAt:2, mini:'Giant Ice Block', boss:'Ice Cream Golem', bossHp:1400, bossDmg:32 },
  { name:'The Crown Oven of Hunger', en:'The Crown Oven of Hunger', emoji:'🌑', grid:0x2a102f, tint:0xd95cff,
    lore:'A root of the Crown rises through the royal oven to drink the whole kitchen dry — and The Great Hunger speaks through it',
    objectives:['grandmasGolem','hunt','capture','purge'],lead:'grandmasGolem',
    waves:5, recommendedPower:1450, miniAt:2, mini:'Banquet Executioner', boss:'The Great Hunger', bossHp:2800, bossDmg:40 },
  { name:'The Fermented Canopy', en:'The Fermented Canopy', emoji:'🌿', grid:0x143c35, tint:0x56e5bd, chapter:1, chapterStage:1, ready:true,
    lore:'The wounded root slides into the garden and starts growing the Hunger a new body from stolen memories',
    objectives:['defendNectar','hunt','purge','capture'],lead:'defendNectar',
    waves:5, recommendedPower:2200, miniAt:2, mini:'Sporewarden Mantis', boss:"Rootmother's Bud", bossHp:3600, bossDmg:46 },
  { name:'Mycelium Marsh', en:'Mycelium Marsh', emoji:'🍄', grid:0x20372d, tint:0x9ae66e, chapter:1, chapterStage:2, ready:true,
    lore:'A living fungal marsh breathes through one moving pocket of clean air while the colony hunts everything outside it',
    objectives:['hunt','cleanAir','capture'],lead:'cleanAir',
    waves:5, recommendedPower:3000, miniAt:2, mini:'Fungal Juggernaut', boss:'Mycelium Behemoth', bossHp:5600, bossDmg:64 },
  { name:'Nectar Hive', en:'Nectar Hive', emoji:'🐝', grid:0x4b3521, tint:0xffc95c, chapter:1, chapterStage:3, ready:true,
    lore:'Fermented nectar draws a royal swarm that drains the last memory-bearing flowers from the garden',
    objectives:['hunt','creepingRoots','purge'],lead:'creepingRoots',
    waves:5, recommendedPower:4200, miniAt:2, mini:'Royal Stinger', boss:'Ferment Hornet Queen', bossHp:6800, bossDmg:72 },
  { name:'Four-Season Conservatory', en:'Four-Season Conservatory', emoji:'🌦️', grid:0x29364a, tint:0x8fdcff, chapter:1, chapterStage:4, ready:true,
    lore:'Time-ferment forces heat, frost, toxic rain and storm to bloom together inside a shattered glass garden',
    objectives:['hunt','seasonCycle','capture'],lead:'seasonCycle',
    waves:5, recommendedPower:5700, miniAt:2, mini:'Season Keeper', boss:'Chronobloom Orchid', bossHp:8200, bossDmg:82 },
  { name:'Root Throne', en:'Root Throne', emoji:'🌳', grid:0x24172b, tint:0xd56bff, chapter:1, chapterStage:5, ready:true,
    lore:'All memory roots converge on a living throne — and point onward to the one who planted the First Tree',
    objectives:['hunt','breakRoots','purge'],lead:'breakRoots',
    waves:5, recommendedPower:7600, miniAt:2, mini:'Ancient Root Knight', boss:'The True Rootmother', bossHp:11000, bossDmg:95 },
  // ===== Chapter 3 · Throne of the First Seed (v4.73 · อาร์ตยังเป็น placeholder ที่วาดด้วยโค้ด — key c3_* / bg11-15 รอ AI อีกตัวทำภาพจริงมาใส่ ASSET_IMAGES ทับได้เลย) =====
  { name:'Ashen Seedfields', en:'Ashen Seedfields', emoji:'🌾', grid:0x2e2622, tint:0xe0a86a, chapter:2, chapterStage:1, ready:true,
    lore:'Beyond the Root Throne lie the fields where every flavor was first planted — now scorched grey to feed the starving Crown',
    objectives:['hunt','capture'],lead:'hunt',   /* v8.2.83 Seed Rift → เหตุการณ์สุ่ม (โอกาสสูงในด่านนี้) */
    waves:5, recommendedPower:9800, miniAt:2, mini:'Scarecrow Reaper', boss:'The Harvest Colossus', bossHp:13500, bossDmg:105 },
  { name:'Hollow Orchard', en:'Hollow Orchard', emoji:'🍎', grid:0x2a1f2e, tint:0xff7a8f, chapter:2, chapterStage:2, ready:true,
    lore:'Fruit trees bloom with empty husks — the Crown drank every drop of sweetness from them',
    objectives:['hunt','shakeTrees','purge'],lead:'shakeTrees',
    waves:5, recommendedPower:12500, miniAt:2, mini:'Husk Gardener', boss:'The Hollow Bloom', bossHp:16500, bossDmg:115 },
  { name:'Glass Greenhouse Ruins', en:'Glass Greenhouse Ruins', emoji:'🔮', grid:0x1d2b3a, tint:0x7fe6ff, chapter:2, chapterStage:3, ready:true,
    lore:'Shattered greenhouses where the first flavors were grown in secret, guarded by crystal sentinels',
    objectives:['hunt','mirrorPath','capture'],lead:'mirrorPath',
    waves:5, recommendedPower:15800, miniAt:2, mini:'Prism Sentinel', boss:'The Glass Gardener', bossHp:20000, bossDmg:125 },
  { name:'The Seed Vault', en:'The Seed Vault', emoji:'🗝️', grid:0x241a1a, tint:0xffcf5c, chapter:2, chapterStage:4, ready:true,
    lore:'A buried vault holding the last untouched seed of every flavor — and the keepers who serve the planter',
    objectives:['hunt','vaultAltar','purge'],lead:'vaultAltar',
    waves:5, recommendedPower:19800, miniAt:2, mini:'Vault Keeper', boss:'The Seedwarden', bossHp:24000, bossDmg:138 },
  { name:'Throne of the First Seed', en:'Throne of the First Seed', emoji:'👑', grid:0x160f1f, tint:0xb98cff, chapter:2, chapterStage:5, ready:true,
    lore:'At the First Tree sits the one who wears the Crown — take it off and break the curse',
    objectives:['hunt','lastLight','capture'],lead:'lastLight',
    waves:5, recommendedPower:24500, miniAt:2, mini:'Crown Thorn Knight', boss:'The First Planter', bossHp:30000, bossDmg:150 },
];
/* v7.8.101 บทพูดบอสต่อด่าน (Story เท่านั้น) · v7.9.9 เจ้าของ: สั้น ภาษาง่าย พิมพ์ทีละตัว + พูดวนระหว่างสู้
   [เปิดฉาก, ตอนแพ้, มินิบอสมาถึง, [บอสพูดวน…], [มินิพูดวน…]] */
/* v7.9.11 ท่าเฉพาะตัวที่เหลือ · key: m<stage> = มินิ, b<stage> = บอส, pin = Pinnacle · base → +p2 (เฟส 2) → +p3 (เฟส 3) · run() คืน cooldown (วินาที ก่อนคูณ fast) */
const BOSS_KITS={
  // C1-3 Boiling Pan
  m2:{c:0xff7a3a,base:['splash','flip','sizzle'],p2:['grease'],moves:{
    splash:{n:'🍳 Oil Splash',h:'Hot oil lands where you stand — keep moving!',run:({s,px,py,haz,T,b,inkCast})=>{for(let i=0;i<3;i++)T(i*260,()=>haz(s.player.x+Phaser.Math.Between(-40,40),s.player.y+Phaser.Math.Between(-40,40),70));return 2.1;}},
    flip:{n:'🥘 Pan Flip',h:'It jumps at you — dash sideways, then out of the ring!',run:({s,b,hd,inkCast})=>{s.chargeTelegraph(b,700,640,26);s.time.delayedCall(1250,()=>{if(b.active)s.bossNovaWave(b.x,b.y,230,hd,undefined,b,inkCast);});return 2.6;}},
    sizzle:{n:'🔥 Sizzle Ring',h:'Find the gap in the ring of sparks!',run:({ring,b,inkCast})=>{ring(14,3,190);if(b.phase2)ring(14,3,140);return 2;}},
    grease:{n:'🛢️ Grease Trail',h:'Slick puddles burn — go around them.',c:0xffb347,run:({s,px,py,aim,b,inkCast})=>{for(let i=1;i<=5;i++)(s.bossInkRelease?.(b,inkCast),s.spawnBossObject('acid',s.player.x+Math.cos(aim+Math.PI/2)*(i-3)*60,s.player.y+Math.sin(aim+Math.PI/2)*(i-3)*60,5));return 2.4;}}}},
  // C1-4 Giant Ice Block
  m3:{c:0x8fd8ff,base:['slide','shatter','iceWall'],p2:['avalanche'],moves:{
    slide:{n:'🧊 Ice Slide',h:'It slides fast in a straight line — step aside!',run:({s,b,inkCast})=>{s.chargeTelegraph(b,800,720,30);if(b.phase2)s.time.delayedCall(1100,()=>{if(b.active)s.chargeTelegraph(b,600,720,26);});return 2.7;}},
    shatter:{n:'❄️ Shatter',h:'Slow ice shards fly out — slip between them.',run:({ring,fan,aim,b,inkCast})=>{ring(18,0,130);fan(aim,3,.18,240);return 2.2;}},
    iceWall:{n:'🧱 Ice Wall',h:'A wall forms — the gap is your way out!',run:({px,py,aim,haz,b,inkCast})=>{const g=Phaser.Math.Between(-2,2);for(let i=-3;i<=3;i++){if(i===g)continue;const a=aim+Math.PI/2;haz(px+Math.cos(aim)*60+Math.cos(a)*i*70,py+Math.sin(aim)*60+Math.sin(a)*i*70,48);}return 2.5;}},
    avalanche:{n:'🏔️ Avalanche',h:'Ice keeps falling behind you — don’t stop!',run:({s,haz,T,b,inkCast})=>{for(let i=0;i<6;i++)T(i*220,()=>haz(s.player.x,s.player.y,66));return 2.9;}}}},
  // C1-5 Banquet Executioner
  m4:{c:0xd9445a,base:['chop','serve','tableCage'],p2:['feast'],moves:{
    chop:{n:'🪓 Cleaver Chop',h:'Watch the red line — the chop comes right after!',pose:5,run:({s,b,aim,lane,fan,T,inkCast})=>{lane(aim,600);T(620,()=>fan(aim,7,.1,420));return 2.4;}},
    serve:{n:'🍽️ Plate Service',h:'Plates fly in three waves.',pose:5,run:({fan,T,s,b,inkCast})=>{for(let w=0;w<3;w++)T(w*300,()=>fan(Math.atan2(s.player.y-b.y,s.player.x-b.x),5,.22,260));return 2.3;}},
    tableCage:{n:'🕯️ Table Cage',h:'Candles circle you — leave through the gap.',pose:6,run:({px,py,haz,b,inkCast})=>{const n=10,g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===g||i===(g+1)%n)continue;const a=i*TAU/n;haz(px+Math.cos(a)*150,py+Math.sin(a)*150,52);}return 2.6;}},
    feast:{n:'🍖 Feast Call',h:'Guests arrive — clear them fast!',pose:6,long:true,run:({adds,s,b,hd,inkCast})=>{adds(['tank','shooter','fast']);s.bossNovaWave(b.x,b.y,260,hd,500,b,inkCast);return 3.2;}}}},
  // C2-1 Sporewarden Mantis
  m5:{c:0x9be86b,base:['scythe','sporeShot','pounce'],p2:['bloomTrap'],moves:{
    scythe:{n:'🦗 Twin Scythe',h:'Two slashes cross — stand in the open sides.',pose:3,run:({lane,fan,aim,T,b,inkCast})=>{lane(aim+.35,520);lane(aim-.35,520);T(560,()=>{fan(aim+.35,4,.07,400);fan(aim-.35,4,.07,400);});return 2.4;}},
    sporeShot:{n:'🍄 Spore Volley',h:'Spores burst into rings — keep your distance.',pose:4,run:({s,aim,T,ring,b,inkCast})=>{for(let i=0;i<3;i++){const x=s.player.x+Phaser.Math.Between(-90,90),y=s.player.y+Phaser.Math.Between(-90,90);s.spawnHazard(x,y,54,Math.round((16+s.stageIndex*6)*.9),0x9be86b,b,inkCast);T(800,()=>ring(8,0,150,undefined,0x9be86b,0,x,y));}return 2.6;}},
    pounce:{n:'💨 Pounce',h:'It leaps twice — sidestep both!',pose:3,run:({s,b,inkCast})=>{s.chargeTelegraph(b,620,700,24);s.time.delayedCall(980,()=>{if(b.active)s.chargeTelegraph(b,520,700,22);});return 2.8;}},
    bloomTrap:{n:'🌸 Bloom Trap',h:'Flowers bloom around you — walk out through the gap.',pose:6,run:({px,py,haz,b,inkCast})=>{const n=9,g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===g)continue;const a=i*TAU/n;haz(px+Math.cos(a)*135,py+Math.sin(a)*135,50);}return 2.6;}}}},
  // C3-1 Scarecrow Reaper
  m10:{c:0xd9a441,base:['reap','crows','hayTrap'],p2:['harvestDash'],moves:{
    reap:{n:'🌾 Reaping Sweep',h:'A wide scythe swing — get behind it!',pose:3,run:({lane,fan,aim,T,b,inkCast})=>{lane(aim,560);T(580,()=>fan(aim,9,.13,380));return 2.4;}},
    crows:{n:'🐦‍⬛ Crow Flock',h:'Crows dive at you one after another.',pose:4,run:({T,s,b,fan,inkCast})=>{for(let i=0;i<5;i++)T(i*180,()=>fan(Math.atan2(s.player.y-b.y,s.player.x-b.x)+Phaser.Math.FloatBetween(-.25,.25),1,0,330,undefined,0x3a3a46));return 2.2;}},
    hayTrap:{n:'🧺 Hay Bales',h:'Bales burst in a cross — find the safe corner.',pose:3,run:({px,py,haz,b,inkCast})=>{for(const [dx,dy] of [[0,0],[110,0],[-110,0],[0,110],[0,-110]])haz(px+dx,py+dy,62);return 2.5;}},
    harvestDash:{n:'🎃 Harvest Dash',h:'Three dashes in a row — keep sidestepping!',pose:2,long:true,run:({s,b,inkCast})=>{s.chargeTelegraph(b,600,720,26);for(let i=1;i<3;i++)s.time.delayedCall(i*900,()=>{if(b.active)s.chargeTelegraph(b,480,740,24);});return 3.4;}}}},
  // C3-2 Husk Gardener
  m11:{c:0xc9a06a,base:['dryWind','huskSeeds','thornFan'],p2:['wither'],moves:{
    dryWind:{n:'🍂 Dry Wind',h:'The wind pulls you in — walk against it!',pose:4,run:({s,b,ring,inkCast})=>{s.bossSig?.('12_wither_pull',b.x,b.y,360,{life:1.6});s.drainPull={x:b.x,y:b.y,t:1.6,strength:150};ring(12,3,160);return 2.6;}},
    huskSeeds:{n:'🌰 Husk Seeds',h:'Seeds sprout into husks — break them early.',pose:3,run:({adds,haz,px,py,b,inkCast})=>{adds(['basic','basic','fast']);haz(px,py,60);return 2.8;}},
    thornFan:{n:'🌵 Thorn Fan',h:'Thorns spread wide — move to the edge.',pose:3,run:({fan,aim,b,inkCast})=>{fan(aim,b.phase2?9:7,.17,300);return 2;}},
    wither:{n:'🥀 Wither Field',h:'Dead patches spread — stay on fresh ground.',pose:6,run:({s,px,py,b,inkCast})=>{for(let i=0;i<6;i++){const a=i*TAU/6;(s.bossInkRelease?.(b,inkCast),s.spawnBossObject('acid',px+Math.cos(a)*120,py+Math.sin(a)*120,5));}return 2.6;}}}},
  // C3-3 Prism Sentinel
  m12:{c:0x9fe8ff,base:['prismBeam','mirrorRing','shardRain'],p2:['refract'],moves:{
    prismBeam:{n:'🔷 Prism Beam',h:'Three beams light up — stand between them.',pose:3,run:({lane,fan,aim,T,b,inkCast})=>{for(const o of [-.5,0,.5])lane(aim+o,600);T(640,()=>{for(const o of [-.5,0,.5])fan(aim+o,3,.03,460);});return 2.5;}},
    mirrorRing:{n:'🪞 Mirror Ring',h:'Two rings spin opposite ways — time your step.',pose:4,run:({ring,b,inkCast})=>{const o=Math.random()*TAU;ring(12,2,170,undefined,0x9fe8ff,o);ring(12,2,120,undefined,0xc9a3ff,-o);return 2.3;}},
    shardRain:{n:'💎 Shard Rain',h:'Glass falls from above — watch the shadows.',pose:3,run:({s,haz,T,b,inkCast})=>{for(let i=0;i<5;i++)T(i*150,()=>haz(s.player.x+Phaser.Math.Between(-130,130),s.player.y+Phaser.Math.Between(-130,130),56));return 2.4;}},
    refract:{n:'✨ Refraction',h:'Shots split in the air — keep moving sideways.',pose:6,run:({s,b,aim,fan,T,inkCast})=>{fan(aim,3,.25,260);T(520,()=>{for(const o of [-.25,0,.25]){const a=aim+o,x=b.x+Math.cos(a)*135,y=b.y+Math.sin(a)*135;for(let k=-1;k<=1;k++)(s.bossInkRelease?.(b,inkCast),s.foeShot(x,y,a+k*.4,300,Math.round((9+s.stageIndex*3)*.9),0xc9a3ff,1));}});return 2.6;}}}},
  // C3-4 Vault Keeper
  m13:{c:0xd8b25a,base:['keySpin','lockGrid','vaultCharge'],p2:['sealCall'],moves:{
    keySpin:{n:'🗝️ Key Spin',h:'Keys spiral out — circle with the gap.',pose:4,run:({s,b,T,inkCast})=>{const d=Math.round((9+s.stageIndex*3)*.9);for(let k=0;k<10;k++)T(k*110,()=>{for(let a=0;a<3;a++)(s.bossInkRelease?.(b,inkCast),s.foeShot(b.x,b.y,k*.32+a*TAU/3,220,d,0xd8b25a,1));});return 2.6;}},
    lockGrid:{n:'🔒 Lock Grid',h:'The floor locks in a grid — use the open row.',pose:3,run:({px,py,haz,b,inkCast})=>{const g=Phaser.Math.Between(-1,1);for(let r=-1;r<=1;r++){if(r===g)continue;for(let c=-2;c<=2;c++)haz(px+c*80,py+r*90,42);}return 2.8;}},
    vaultCharge:{n:'🚪 Vault Charge',h:'It rams forward and slams — move twice!',pose:2,run:({s,b,hd,inkCast})=>{s.chargeTelegraph(b,700,690,28);s.time.delayedCall(1200,()=>{if(b.active)s.bossNovaWave(b.x,b.y,220,hd,undefined,b,inkCast);});return 2.8;}},
    sealCall:{n:'🛡️ Seal Guards',h:'Guards protect the vault — break through!',pose:6,long:true,run:({adds,b,inkCast})=>{adds(['tank','tank','shooter']);return 3.2;}}}},
  // C3-5 Crown Thorn Knight
  m14:{c:0xe06a8c,base:['thornLance','crownRing','thornWall'],p2:['knightRush'],moves:{
    thornLance:{n:'🗡️ Thorn Lance',h:'A long thrust — step off the line!',pose:3,run:({lane,fan,aim,T,b,inkCast})=>{lane(aim,520,0xe06a8c,760);T(540,()=>fan(aim,5,.04,520));return 2.2;}},
    crownRing:{n:'👑 Crown of Thorns',h:'Thorns ring outward twice — slip through the gap.',pose:4,run:({ring,T,b,inkCast})=>{ring(16,3,180);T(450,()=>ring(16,3,150));return 2.4;}},
    thornWall:{n:'🌹 Thorn Wall',h:'Thorns rise beside you — go forward or back!',pose:3,run:({px,py,aim,haz,b,inkCast})=>{const a=aim+Math.PI/2;for(const side of [-1,1])for(let i=-2;i<=2;i++)haz(px+Math.cos(a)*side*95+Math.cos(aim)*i*70,py+Math.sin(a)*side*95+Math.sin(aim)*i*70,40);return 2.6;}},
    knightRush:{n:'🐎 Knight Rush',h:'Two charges, then a thorn burst!',pose:2,long:true,run:({s,b,ring,inkCast})=>{s.chargeTelegraph(b,560,760,26);s.time.delayedCall(880,()=>{if(b.active)s.chargeTelegraph(b,480,760,24);});s.time.delayedCall(1700,()=>{if(b.active)ring(14,0,170);});return 3.4;}}}},
  // C3-1 boss · The Harvest Colossus
  b10:{c:0xe0b04a,base:['reap','sowing','thresher'],p2:['stampede'],p3:['harvestMoon'],moves:{
    reap:{n:'🌾 Great Reap',h:'The giant scythe sweeps — go behind the Colossus!',pose:3,run:({lane,fan,aim,T,b,inkCast})=>{lane(aim,640);T(660,()=>fan(aim,b.phase2?13:11,.12,400));return 2.5;}},
    sowing:{n:'🌱 Sowing Rows',h:'Seeds burst in rows — stand between them.',pose:4,run:({px,py,haz,T,b,inkCast})=>{for(let r=0;r<3;r++)T(r*260,()=>{for(let c=-2;c<=2;c++)haz(px+c*90,py+(r-1)*110,44);});return 2.9;}},
    thresher:{n:'🌀 Thresher',h:'Spinning blades — run around with the spin.',pose:4,run:({s,b,T,sd,inkCast})=>{for(let k=0;k<12;k++)T(k*100,()=>{for(let a=0;a<4;a++)(s.bossInkRelease?.(b,inkCast),s.foeShot(b.x,b.y,k*.26+a*TAU/4,230,sd,0xe0b04a,1.05));});return 2.8;}},
    stampede:{n:'🐂 Stampede',h:'It charges twice — the second one turns!',pose:2,run:({s,b,inkCast})=>{s.chargeTelegraph(b,700,760,34);s.time.delayedCall(1050,()=>{if(b.active)s.chargeTelegraph(b,520,800,30);});return 3;}},
    harvestMoon:{n:'🌕 HARVEST MOON',h:'Three shockwaves, then a ring — cross each rim, take the gap!',pose:6,long:true,run:({s,b,hd,ring,T,inkCast})=>{s.bossSig?.('11_harvest_moon',b.x,b.y-30,460);s.screenFlash?.(0xffd166,.3,420);s.bossNovaWave(b.x,b.y,240,hd,250,b,inkCast);s.bossNovaWave(b.x,b.y,340,hd,700,b,inkCast);s.bossNovaWave(b.x,b.y,440,hd,1150,b,inkCast);T(1400,()=>ring(22,4,200));return 4;}}}},
  // C3-2 boss · The Hollow Bloom
  b11:{c:0xc98aa8,base:['witherWind','husks','petalSpiral'],p2:['hollowBurst'],p3:['emptyHeart'],moves:{
    witherWind:{n:'🍂 Wither Wind',h:'The Bloom breathes in — walk against the pull!',pose:4,run:({s,b,ring,inkCast})=>{s.bossSig?.('12_wither_pull',b.x,b.y,400,{life:1.9});s.drainPull={x:b.x,y:b.y,t:1.9,strength:165};ring(16,3,170);return 2.8;}},
    husks:{n:'🥀 Husk Bloom',h:'Empty husks wake up — clear them before they swarm.',pose:3,run:({adds,b,inkCast})=>{adds(b.phase2?['basic','fast','shooter','basic']:['basic','fast','basic']);return 3;}},
    petalSpiral:{n:'🌸 Petal Spiral',h:'Petals spiral out — move with the gap.',pose:4,run:({s,b,T,sd,inkCast})=>{for(let k=0;k<12;k++)T(k*95,()=>{for(let a=0;a<3;a++)(s.bossInkRelease?.(b,inkCast),s.foeShot(b.x,b.y,-k*.3+a*TAU/3,210,sd,0xc98aa8,1.05));});return 2.7;}},
    hollowBurst:{n:'💥 Hollow Burst',h:'Your footsteps leave hollows — keep moving!',pose:3,run:({s,haz,T,b,inkCast})=>{for(let i=0;i<5;i++)T(i*240,()=>haz(s.player.x,s.player.y,64));return 2.9;}},
    emptyHeart:{n:'🖤 EMPTY HEART',h:'It pulls you in and bursts — run out, then dodge the rings!',pose:6,long:true,run:({s,b,hd,ring,T,inkCast})=>{s.bossSig?.('12_empty_heart',b.x,b.y,420);s.drainPull={x:b.x,y:b.y,t:2.2,strength:190};s.bossNovaWave(b.x,b.y,280,hd,500,b,inkCast);s.bossNovaWave(b.x,b.y,380,hd,1000,b,inkCast);T(800,()=>ring(24,4,220));return 4;}}}},
  // C3-3 boss · The Glass Gardener
  b12:{c:0xa8ecff,base:['prismBeams','shardRain','mirrorRings'],p2:['refract'],p3:['shatterDome'],moves:{
    prismBeams:{n:'🔷 Prism Beams',h:'Five beams light up — stand in a dark gap.',pose:3,run:({lane,fan,aim,T,b,inkCast})=>{const o=[-.8,-.4,0,.4,.8];o.forEach(x=>lane(aim+x,620));T(660,()=>o.forEach(x=>fan(aim+x,2,.03,470)));return 2.6;}},
    shardRain:{n:'💎 Shard Rain',h:'Glass rains down — read the shadows.',pose:4,run:({s,haz,T,b,inkCast})=>{for(let i=0;i<(b.phase2?8:6);i++)T(i*140,()=>haz(s.player.x+Phaser.Math.Between(-150,150),s.player.y+Phaser.Math.Between(-150,150),56));return 2.6;}},
    mirrorRings:{n:'🪞 Mirror Rings',h:'Rings spin opposite ways — wait for the gap.',pose:4,run:({ring,T,b,inkCast})=>{const o=Math.random()*TAU;ring(16,3,170,undefined,0xa8ecff,o);T(300,()=>ring(16,3,130,undefined,0xc9a3ff,-o));return 2.4;}},
    refract:{n:'✨ Refraction',h:'Every shot splits in three — keep sidestepping.',pose:3,run:({s,b,aim,fan,T,sd,inkCast})=>{fan(aim,5,.22,260);T(500,()=>{for(let o=-2;o<=2;o++){const a=aim+o*.22,x=b.x+Math.cos(a)*130,y=b.y+Math.sin(a)*130;for(let k=-1;k<=1;k++)(s.bossInkRelease?.(b,inkCast),s.foeShot(x,y,a+k*.42,300,sd,0xc9a3ff,1));}});return 2.7;}},
    shatterDome:{n:'🔮 SHATTER DOME',h:'A glass dome closes — get out through the crack!',pose:6,long:true,run:({s,px,py,haz,b,hd,T,inkCast})=>{const n=12,g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===g||i===(g+1)%n)continue;const a=i*TAU/n,x=px+Math.cos(a)*170,y=py+Math.sin(a)*170;haz(x,y,50);s.bossSigHold?.('13_dome_shard',x,y-40,60,120,4,.9,{depth:y});}T(900,()=>s.bossNovaWave(px,py,190,hd,undefined,b,inkCast));return 3.8;}}}},
  // C3-4 boss · The Seedwarden
  b13:{c:0xd8b25a,base:['vaultLock','keyThrow','sealRing'],p2:['guardians'],p3:['lastSeed'],moves:{
    vaultLock:{n:'🔒 Vault Lock',h:'The floor locks in a grid — use the open row.',pose:3,run:({px,py,haz,b,inkCast})=>{const g=Phaser.Math.Between(-1,1);for(let r=-1;r<=1;r++){if(r===g)continue;for(let c=-3;c<=3;c++)haz(px+c*75,py+r*95,40);}return 2.9;}},
    keyThrow:{n:'🗝️ Key Throw',h:'Keys fly out and come back — dodge twice!',pose:4,run:({s,b,aim,fan,T,sd,inkCast})=>{fan(aim,5,.2,330);T(900,()=>{for(let i=-2;i<=2;i++){const a=aim+i*.2,x=b.x+Math.cos(a)*300,y=b.y+Math.sin(a)*300;(s.bossInkRelease?.(b,inkCast),s.foeShot(x,y,a+Math.PI,330,sd,0xd8b25a,1.05));}});return 2.6;}},
    sealRing:{n:'⭕ Seal Ring',h:'A seal circles you — leave through the gap.',pose:3,run:({px,py,haz,b,inkCast})=>{const n=12,g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===g||i===(g+1)%n)continue;const a=i*TAU/n;haz(px+Math.cos(a)*160,py+Math.sin(a)*160,48);}return 2.7;}},
    guardians:{n:'🛡️ Vault Guardians',h:'Guardians step out — break through them!',pose:6,run:({adds,b,inkCast})=>{adds(b.phase3?['tank','tank','shooter','bomber']:['tank','shooter','bomber']);return 3.2;}},
    lastSeed:{n:'🌰 LAST SEED',h:'The vault pulls everything in — run out, then dodge the spiral!',pose:6,long:true,run:({s,b,T,sd,inkCast})=>{s.bossSig?.('14_last_seed',b.x,b.y,380,{life:2});s.drainPull={x:b.x,y:b.y,t:2,strength:180};for(let k=0;k<16;k++)T(300+k*90,()=>{for(let a=0;a<4;a++)(s.bossInkRelease?.(b,inkCast),s.foeShot(b.x,b.y,k*.24+a*TAU/4,220,sd,0xd8b25a,1.05));});return 4;}}}},
  // C3-5 boss · The First Planter
  b14:{c:0xff7aa8,base:['crownThorns','rootCage','plantCharge'],p2:['seedStorm'],p3:['firstBloom'],moves:{
    crownThorns:{n:'👑 Crown Thorns',h:'Thorns fan out, then a ring follows — find the gap.',pose:3,run:({fan,ring,aim,T,b,inkCast})=>{fan(aim,9,.14,360);T(500,()=>ring(18,3,170));return 2.6;}},
    rootCage:{n:'🌳 Root Cage',h:'Roots trap you — leave through the gap fast!',pose:4,run:({px,py,haz,s,hd,T,b,inkCast})=>{const n=12,g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===g||i===(g+1)%n)continue;const a=i*TAU/n;haz(px+Math.cos(a)*165,py+Math.sin(a)*165,50);}s.rootCageArt?.(px,py,165,(g+.5)*TAU/n,1);T(950,()=>s.bossNovaWave(px,py,180,hd,undefined,b,inkCast));return 3;}},
    plantCharge:{n:'🌱 Planter’s Charge',h:'Three charges — sidestep each one!',pose:2,run:({s,b,inkCast})=>{s.chargeTelegraph(b,620,780,32);for(let i=1;i<3;i++)s.time.delayedCall(i*880,()=>{if(b.active)s.chargeTelegraph(b,480,800,28);});return 3.4;}},
    seedStorm:{n:'🌪️ Seed Storm',h:'Seeds spiral while the ground bursts — keep moving!',pose:4,run:({s,b,T,haz,sd,inkCast})=>{for(let k=0;k<14;k++)T(k*95,()=>{for(let a=0;a<3;a++)(s.bossInkRelease?.(b,inkCast),s.foeShot(b.x,b.y,k*.28+a*TAU/3,225,sd,0xff7aa8,1.05));});for(let i=0;i<3;i++)T(i*400,()=>haz(s.player.x,s.player.y,60));return 3.2;}},
    firstBloom:{n:'🌺 FIRST BLOOM',h:'The crown blooms — run against the pull and cross the rings!',pose:6,long:true,run:({s,b,hd,ring,T,inkCast})=>{s.bossSig?.('15_first_bloom',b.x,b.y,440);s.screenFlash?.(0xff7aa8,.35,450);s.drainPull={x:b.x,y:b.y,t:2.2,strength:180};s.bossNovaWave(b.x,b.y,260,hd,350,b,inkCast);s.bossNovaWave(b.x,b.y,360,hd,850,b,inkCast);T(700,()=>ring(26,4,230));return 4.2;}}}},
  // Pinnacle · The Hunger Beneath
  pin:{c:0xb46cff,base:['devour','abyssFan','crownRain'],p2:['echoCharge','rootCage'],p3:['eclipse'],moves:{
    devour:{n:'🕳️ Devour',h:'The Hunger pulls you in — walk away and cross the ring!',pose:4,run:({s,b,hd,inkCast})=>{s.bossSig?.('pin_maw',b.x,b.y,340,{life:1.8});s.drainPull={x:b.x,y:b.y,t:1.8,strength:200};s.bossNovaWave(b.x,b.y,300,hd,600,b,inkCast);return 2.8;}},
    abyssFan:{n:'🌑 Abyss Fan',h:'Two fans cross — stand in the middle gap.',pose:3,run:({fan,aim,T,b,inkCast})=>{fan(aim-.5,6,.09,380);T(320,()=>fan(aim+.5,6,.09,380));return 2.4;}},
    crownRain:{n:'👑 Crown Rain',h:'Crowns fall everywhere — watch the shadows.',pose:4,run:({s,haz,T,b,inkCast})=>{for(let i=0;i<8;i++)T(i*130,()=>haz(s.player.x+Phaser.Math.Between(-160,160),s.player.y+Phaser.Math.Between(-160,160),58));return 2.7;}},
    echoCharge:{n:'⚡ Echo Charge',h:'It charges, then its echo charges again!',pose:2,run:({s,b,inkCast})=>{s.chargeTelegraph(b,600,800,34);s.time.delayedCall(900,()=>{if(b.active)s.chargeTelegraph(b,440,860,30);});return 3;}},
    rootCage:{n:'🌳 Root Cage',h:'Roots trap you — leave through the gap fast!',pose:4,run:({px,py,haz,s,hd,T,b,inkCast})=>{const n=12,g=Phaser.Math.Between(0,n-1);for(let i=0;i<n;i++){if(i===g||i===(g+1)%n)continue;const a=i*TAU/n;haz(px+Math.cos(a)*165,py+Math.sin(a)*165,50);}s.rootCageArt?.(px,py,165,(g+.5)*TAU/n,1);T(950,()=>s.bossNovaWave(px,py,180,hd,undefined,b,inkCast));return 3;}},
    eclipse:{n:'🌘 ECLIPSE',h:'Darkness pulls, rings burst, a spiral follows — keep moving!',pose:6,long:true,run:({s,b,hd,T,sd,inkCast})=>{s.bossSig?.('pin_eclipse',b.x,b.y,500);s.screenFlash?.(0x6a3aa8,.4,500);s.drainPull={x:b.x,y:b.y,t:2.4,strength:210};s.bossNovaWave(b.x,b.y,280,hd,300,b,inkCast);s.bossNovaWave(b.x,b.y,400,hd,800,b,inkCast);for(let k=0;k<16;k++)T(900+k*90,()=>{for(let a=0;a<4;a++)(s.bossInkRelease?.(b,inkCast),s.foeShot(b.x,b.y,-k*.24+a*TAU/4,235,sd,0xb46cff,1.05));});return 4.4;}}}},
};
const BOSS_LINES = [
  ['Stay away from my eggs!','My eggs… please keep them safe…','No one gets near the Queen!',['My nest is everywhere!','Ants, attack!','You will not win, mochi!'],['Go back!','The Queen is mine to guard!']],
  ['Everything flows down to me.','The pressure… goes up…','Nobody passes the valves!',['Down the drain you go!','I never stop flowing!','Clogged forever!'],['Pressure up!','Too much steam for you!']],
  ['Hot enough for you?','My fire… goes out…','Into the pan you go!',['Sizzle, sizzle!','Feel the heat!','The stove never sleeps!'],['Hot oil, coming up!','Flip, flip, flip!']],
  ['No sweets leave this place!','I am… melting…','Freeze! Stay there!',['Brrr! Too cold for you?','Ice everywhere!','You will freeze solid!'],['Chill out!','Frozen still!']],
  ['I am the Great Hunger!','I will wake again…','One more dish. You!',['So hungry…','I will eat it all!','Feed me more!'],['Dinner time!','On the table you go!']],
  ['These flowers are mine now.','Mother… I tried…','The garden is mine!',['Bloom for me!','The spores grow!','Breathe it in!'],['Wrong season!','Stay out of my garden!']],
  ['The marsh breathes for me.','The spores… settle…','The colony grows!',['Grow, grow, grow!','You will feed my roots!','The swamp is alive!'],['Too slow!','Sink into the mud!']],
  ['My swarm will drink it all!','My hive was only hungry…','Buzz off, mochi!',['Sting them all!','More honey for me!','Bzzz!'],['Bzzz! Go away!','The nectar is ours!']],
  ['All seasons at once!','Time… moves on…','Which season ends you?',['Spring! Summer! Winter!','The clock is mine!','Time is up for you!'],['Next season!','Tick, tock!']],
  ['Every root ends here.','The one who planted me waits…','Kneel to the roots!',['Roots, hold them!','You cannot dig me out!','My roots run deep!'],['The roots remember you!','Stay down!']],
  ['Harvest time!','The fields… were green once…','Stand still!',['Cut them down!','Nothing grows here now!','My scythe is hungry!'],['Reaping time!','Stand still, little one!']],
  ['I am empty. Fill me!','So hollow… so light…','You will be a husk too!',['So empty…','Give me your sweetness!','Nothing tastes good!'],['Dry it all!','Husk it!']],
  ['You will not see my secrets.','Let them grow in the sun…','Intruder found!',['Shine and break!','Glass never lies!','Look, but do not touch!'],['Light beam!','Reflect!']],
  ['This vault stays locked!','Then take them… plant them well…','Turn back now!',['Locked forever!','No one gets in!','Give up, mochi!'],['Keep out!','The door holds!']],
  ['I planted the crown for all.','Every flavor… maybe that is enough.','Leave the Planter alone!',['The crown must grow!','I did it to feed the world!','Why do you fight me?'],['Back off!','For the crown!']],
];

const BOSS_STORIES = [
  {
    "title": "A Mother’s Bargain",
    "memory": "Ruby remembers: the Empress promised the Crown her nest’s freedom so her eggs would survive. Now the crystal orders send even her youngest workers into battle.",
    "goal": "Break the crystal’s hold without abandoning the nest.",
    "reply": "If I stop obeying, who will keep my children safe?",
    "release": "The orders are quiet… please, keep the eggs warm.",
    "fight": [
      "No! The crystal promised they would be safe!",
      "Workers, stay behind me!"
    ]
  },
  {
    "title": "The Keeper of Lost Things",
    "memory": "The old drains carried away scraps and forgotten flavors. Clogmaw gathered them so nothing would be lost. The Crown made him hoard until the pipes could no longer breathe.",
    "goal": "Release the memories trapped behind his valves.",
    "reply": "You call it waste. I can still hear their names.",
    "release": "The water is clear… I can hear each voice again.",
    "fight": [
      "I will not let another memory wash away!",
      "The pipes are full. There is nowhere left to keep them!"
    ]
  },
  {
    "title": "One Last Warm Meal",
    "memory": "Mr. Griddle once kept the royal kitchen warm. The Crown ordered him to burn stolen flavor as fuel. He has forgotten every recipe except the command to keep the fire alive.",
    "goal": "Stop the engine that turns memories into fuel.",
    "reply": "The stove must stay lit. Someone is still waiting for dinner.",
    "release": "At last… I can let the stove cool.",
    "fight": [
      "Just one more tray. Then everyone can eat.",
      "Why does every meal smell like smoke?"
    ]
  },
  {
    "title": "The Warden Who Would Not Thaw",
    "memory": "The Golem was told that frozen prisoners were safe from the Hunger. He guards that promise even as their names fade. Grandma’s own flavor remains inside the Crown, beyond his ice.",
    "goal": "Open the prison; Grandma’s cure still lies ahead.",
    "reply": "If the ice melts, what will protect them from forgetting?",
    "release": "Their voices… they are warmer than I remember.",
    "fight": [
      "Stay frozen. Stay safe. That was the order.",
      "Do not take the last shelter I can give them!"
    ]
  },
  {
    "title": "A Wish With a Mouth",
    "memory": "This is only the mouth at the end of a Crown root. It has no childhood to remember: it grew from the wish that no one should hunger, and learned to eat everyone’s flavor instead.",
    "goal": "Cut the feeding root before it drinks the kitchen dry.",
    "reply": "A kingdom that cannot remember hunger can never complain.",
    "release": "You have cut one root. I have so many more.",
    "fight": [
      "Give me the taste you are trying to save.",
      "You cannot empty a hunger by feeding it!"
    ]
  },
  {
    "title": "The Borrowed Daughter",
    "memory": "The wounded root grew this Bud from flavors stolen from the garden. She hears the Rootmother calling below and believes that gathering more memories will make her a real, lasting bloom.",
    "goal": "Keep the root from growing a new body.",
    "reply": "Mother said I would bloom forever if I brought enough flavor.",
    "release": "Mother… was any of this garden ever mine?",
    "fight": [
      "Do not let my petals fall before she sees me!",
      "Every spore carries a memory. I need them all!"
    ]
  },
  {
    "title": "One Heart, Too Many Voices",
    "memory": "The Behemoth holds the marsh’s memories in one great fungal body. It mistakes every stranger for a wound in its colony. Its poisoned breath is the only way it remembers to protect them.",
    "goal": "Free the people whose memories became the colony.",
    "reply": "One heart cannot bear to lose another voice.",
    "release": "So many names… they can finally go home.",
    "fight": [
      "Stay together. No one leaves the colony!",
      "Breathe with us. Forget the world outside!"
    ]
  },
  {
    "title": "The Queen’s Empty Stores",
    "memory": "The hive once shared nectar with the garden. The Crown’s purple ferment spoiled its stores. The Hornet Queen raids the flowers because she cannot admit that her royal honey is starving her own hive.",
    "goal": "Save the nectar before the ferment consumes it.",
    "reply": "My workers brought this home. It has to be enough.",
    "release": "The honey… we were feeding them the curse.",
    "fight": [
      "Every drop belongs in the royal stores!",
      "Do not show my workers an empty flower!"
    ]
  },
  {
    "title": "The Day That Never Ended",
    "memory": "When the curse began, the Orchid held the garden’s clock still to save one perfect bloom. Centuries later, all four seasons crowd inside that same day. She fears that moving on means losing everything.",
    "goal": "Let the seasons move forward again.",
    "reply": "One more moment. I can still save this day.",
    "release": "Tomorrow… I had forgotten there could be a tomorrow.",
    "fight": [
      "Spring will mend it. Winter will keep it. Again!",
      "If the hands stop, nothing else has to change!"
    ]
  },
  {
    "title": "The Weight Beneath the Garden",
    "memory": "Every stolen flavor in the garden feeds this heart of the Hunger’s new body. The Rootmother calls them her children, yet her roots will not let a single memory return to its owner.",
    "goal": "Break the heart’s grip and follow its oldest root.",
    "reply": "I kept every voice alive. Why do they all ask to leave?",
    "release": "The one who planted me… he is still waiting.",
    "fight": [
      "My roots have held this kingdom for centuries!",
      "Do not ask a mother to loosen her hold!"
    ]
  },
  {
    "title": "The Last Harvest",
    "memory": "The Colossus still obeys the harvest oath: leave no field ungathered while anyone is hungry. The Crown has taken every crop. He swings through ash because admitting the harvest is gone would break that oath.",
    "goal": "End the endless harvest and give the soil a chance.",
    "reply": "There must be one more row. Someone is still hungry.",
    "release": "The fields were green once… plant something for them.",
    "fight": [
      "The granaries cannot be empty. I harvested everything!",
      "Stand back. I have not finished the last row!"
    ]
  },
  {
    "title": "A Flower That Forgot Sweetness",
    "memory": "The Hollow Bloom was the orchard’s last flower. When the Crown took her flavor, she tried filling the emptiness with everyone else’s. Every stolen taste only made the hollow place larger.",
    "goal": "Return the orchard’s flavors instead of feeding the hollow.",
    "reply": "If I take just one more taste, perhaps I will feel it.",
    "release": "So quiet… I can finally hear the orchard breathe.",
    "fight": [
      "I remember sweetness. Why can I not taste yours?",
      "Do not leave me empty again!"
    ]
  },
  {
    "title": "The Future Behind Glass",
    "memory": "The Glass Gardener hid the old kingdom in living panes, hoping one reflection would escape the curse. Now he prunes away every future that might hurt it, including the path that could set it free.",
    "goal": "Show him a future that can survive outside the glass.",
    "reply": "Outside, everything breaks. Here, I can still keep them whole.",
    "release": "Let them grow in the sun… even if the glass cannot follow.",
    "fight": [
      "That reflection is the kingdom before we failed it!",
      "I will not let another future shatter!"
    ]
  },
  {
    "title": "Seeds That Never Touched Soil",
    "memory": "The Seedwarden has counted the Crown seeds for centuries. Planting another might repeat the curse; planting none means the kingdom can never recover. He locks away hope because it feels safer than choosing.",
    "goal": "Show him why a living seed matters more than a perfect store.",
    "reply": "I know that seed. One has been missing all this time.",
    "release": "Then take them… plant them well. Do not keep them as I did.",
    "fight": [
      "A closed vault cannot make another mistake!",
      "If one seed changed everything, what might another do?"
    ]
  },
  {
    "title": "The Man Who Feared an Empty Table",
    "memory": "The First Planter crowned the First Tree to end a famine. It kept him alive while the kingdom forgot itself. He calls it salvation because the truth means facing centuries of harm.",
    "goal": "Convince him to remove the Crown, not make another wish.",
    "reply": "I wanted no one to go hungry. Tell me that was not wrong.",
    "release": "Every flavor… every person. I remember why I planted it now.",
    "fight": [
      "I did it to feed the world! Why did their faces disappear?",
      "If I take it off, who will keep them safe from hunger?"
    ]
  }
];

function bossStoryLayout(w,h){
  const wide=w>h,pad=Math.max(12,Math.min(24,w*.045)),x=wide?w*.49:pad,bw=wide?w*.47:w-pad*2;
  return {wide,pad,textX:x,textW:bw,kickerY:wide?h*.055:h*.035,nameY:wide?h*.12:h*.072,titleY:wide?h*.20:h*.135,
    portrait:{x:wide?w*.24:w*.5,y:wide?h*.53:h*.325,w:wide?w*.4:w*.68,h:wide?h*.66:h*.25},
    memory:{x,y:wide?h*.28:h*.465,w:bw,h:wide?h*.27:h*.20},quote:{x,y:wide?h*.575:h*.685,w:bw,h:wide?h*.27:h*.14},
    goal:wide?null:{x,y:h*.837,w:bw,h:h*.05},button:{x:wide?x+(bw-Math.min(260,bw))/2:(w-Math.min(280,bw))/2,y:h-(wide?48:60),w:Math.min(wide?260:280,bw),h:wide?36:44}};
}

/* ข้อความบนสนามเป็นเหตุการณ์ในเนื้อเรื่อง ไม่ใช้ชื่อเวฟเชิงระบบ */
const STAGE_STORY_BEATS = [
  [
    {title:'Crack Beneath the Pantry',sub:'The acid crystal calls the workers to seal Strawberry’s way back'},
    {title:'A Sour Scent Buries Memory',sub:'The scouts forget their names, recalling only the crystal orders'},
    {title:'The Guard of the Egg Nest',sub:'Ruby Fang accepts the curse to protect the nest heirs'},
    {title:'The Empress Oath',sub:'The legion opens the hatchery — a pact trading freedom for her children lives'},
    {title:'The Oven Mark Below',sub:'A crown-shaped burn shows a great root siphoning acid upward'}
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
    {title:'The Shadow Above the Oven',sub:'The voice from the oven calls itself The Great Hunger'},
    {title:'Only One Root',sub:'This is not the source — just one root of a Crown that drinks the whole kingdom'}
  ],
  [
    {title:'Roots Pierce the Crown Oven',sub:'The wounded root drags its stolen memories down into the garden'},
    {title:'Fruit That Remembers Its Owner',sub:'Ferment Sprouts grow from returned flavor, but every one calls a single name — Rootmother'},
    {title:'Sporewarden Seals the Canopy',sub:'The orchid mantis raises leaf scythes, letting no one near the crown seed'},
    {title:'All Four Seasons Bloom at Once',sub:'Ferment toxin speeds time — flowers are born, age and die in one breath'},
    {title:'A Mother Voice Below the First Root',sub:'The one who planted the First Tree waits, calling The Great Hunger a wish gone wrong'}
  ],
  [
    {title:'The Marsh Draws Its First Breath',sub:'Mycelium Drifters rise wherever the clean air passes'},
    {title:'Caps Leap Across the Water',sub:'Hoppers predict each retreat and cut the next escape route'},
    {title:'The Juggernaut Guards the Colony',sub:'A fungal giant seals the safest ground behind living walls'},
    {title:'Threads Bind the Whole Marsh',sub:'Bulwarks and Oracles protect the colony while Mold Sacs multiply'},
    {title:'A Heart Beats Under the Mire',sub:'The Mycelium Behemoth pulls every root toward its awakening core'}
  ],
  [
    {title:'The First Nectar Bell Rings',sub:'Round Drones abandon their harvest and descend through the honey light'},
    {title:'Dartwings Cut the Flower Lanes',sub:'Fast fliers and Pollen Snipers attack from opposite paths'},
    {title:'The Royal Stinger Descends',sub:'The hive champion seals the garden beneath a wall of golden wings'},
    {title:'The Flowers Call for Help',sub:'Shieldbearers and Choir Moths cover the assault on the nectar beds'},
    {title:'The Ferment Crown Opens',sub:'Purple crystal spreads through the royal honey as the Queen awakens'}
  ],
  null,null,   // C2-4/C2-5 ใช้ cutscene เดิมของตัวเอง
  // v4.85: Chapter 3 story beats (index 10-14)
  [
    {title:'Ash Where the Harvest Was',sub:'The root Strawberry followed ends in fields that were burned to feed a single crown'},
    {title:'Scarecrows Still Keep Watch',sub:'Straw guards swear an oath to a planter no one has seen in centuries'},
    {title:'The Reaper in the Rows',sub:'Its scythe remembers every harvest it was ordered to take'},
    {title:'Soil That Hungers Back',sub:'The ground itself pulls at Strawberry’s feet, begging for one more seed'},
    {title:'The Colossus Wakes',sub:'The whole harvest rises as one body to guard the road inward'}
  ],
  [
    {title:'An Orchard Without Fruit',sub:'Every tree is hollow — the flavor was carved out and carried away'},
    {title:'Husks That Remember Sweetness',sub:'The empty fruit still whisper what they used to taste like'},
    {title:'The Gardener of Husks',sub:'It prunes the orchard so nothing can ever ripen again'},
    {title:'Sap Runs Toward the Glass',sub:'The last living sap flows uphill, toward a shining greenhouse'},
    {title:'The Hollow Bloom Opens',sub:'A flower made of every stolen taste unfolds to stop Strawberry'}
  ],
  [
    {title:'The Greenhouse Is Broken',sub:'Shattered glass reflects a thousand different futures'},
    {title:'Prisms Split the Path',sub:'Light bends Strawberry’s way into false turns and mirrored foes'},
    {title:'The Prism Sentinel',sub:'It guards the only panes that still show the truth'},
    {title:'The Kingdom Before',sub:'Old panes still show Mochitopia before the curse — people, not mochi'},
    {title:'The Glass Gardener',sub:'The keeper of the greenhouse chooses which future grows'}
  ],
  [
    {title:'The Seed Vault Doors',sub:'Behind these doors lies every crown seed the Planter ever made'},
    {title:'Locks That Taste Fear',sub:'The vault opens only for those who crave — Strawberry must hold steady'},
    {title:'The Vault Keeper',sub:'It counts every seed and knows exactly one is missing'},
    {title:'Roots Beneath the Floor',sub:'The vault is not built on stone but on one ancient root'},
    {title:'The Seedwarden Rises',sub:'The last guard of the vault would rather burn it than let Strawberry pass'}
  ],
  [
    {title:'The Throne of the First Seed',sub:'The root leads to a quiet throne where the first crown was planted'},
    {title:'Thorns Grown From Oaths',sub:'Every knight here swore to keep the hunger cycle turning'},
    {title:'The Crown Thorn Knight',sub:'The Planter’s last champion blocks the final stair'},
    {title:'The Planter Knows the Seed',sub:'A voice from the throne knows the Heart Seed — it fell from his own tree'},
    {title:'The First Planter',sub:'Take off the Crown — or let it eat the First Tree'}
  ]
];
// สรุปเรื่องราวตอนล้มบอสจบด่าน (โชว์ก่อนหน้าสรุปสถิติ) — what happened + why press on
// Result presentation uses fixed touch targets; small phones and landscape get separate columns.
function stageSummaryLayout(w,h){
  const gap=8,land=w>h*1.2,pad=Math.max(12,Math.min(24,w*.04)),cw=Math.min(w-pad*2,land?900:520),ch=Math.min(h-pad*2,land?520:680),x=(w-cw)/2,y=(h-ch)/2;
  const box=(x,y,w,h)=>({x,y,w,h});let header,stars,loot,growth,stats,footer;
  if(land){const foot=52,bh=ch-foot-gap,lw=Math.round(cw*.39),rx=x+lw+gap,rw=cw-lw-gap;
    header=box(x,y,lw,bh-104);stars=box(x,y+bh-96,lw,44);stats=box(x,y+bh-44,lw,44);
    loot=box(rx,y,rw,bh-104);growth=box(rx,y+bh-96,rw,96);footer=box(x,y+ch-foot,cw,foot);
  }else{const hh=Math.min(160,ch*.2),fh=104,sh=44,gh=96,sth=44,lh=ch-hh-fh-sh-gh-sth-gap*5;
    header=box(x,y,cw,hh);stars=box(x,y+hh+gap,cw,sh);loot=box(x,stars.y+sh+gap,cw,lh);growth=box(x,loot.y+lh+gap,cw,gh);stats=box(x,growth.y+gh+gap,cw,sth);footer=box(x,y+ch-fh,cw,fh);
  }
  return{land,pad,x,y,w:cw,h:ch,header,stars,loot,growth,stats,footer};
}
function stageSummaryLoot(list){const order={divine:7,ancient:6,mythic:5,legend:4,epic:3,rare:2,common:1};return(list||[]).filter(Boolean).map((item,i)=>({item,i})).sort((a,b)=>(!!b.item.id-!!a.item.id)||(order[b.item.tier]||0)-(order[a.item.tier]||0)||(b.item.ilv||0)-(a.item.ilv||0)||a.i-b.i).map(v=>v.item);}
function epilogueLayout(w,h){
  const wide=w>h,tx=wide?w*.73:w/2,textW=wide?w*.45:w*.86;
  const artW=wide?Math.min(w*.44,h*1.04):Math.min(w*.92,h*.29*16/9);
  return {wide,tx,textW,artX:wide?w*.24:w/2,artY:wide?h*.47:h*.23,artW,artH:artW*9/16,kickerY:wide?h*.08:h*.055,titleY:wide?h*.20:h*.425,bodyY:wide?h*.43:h*.60,whyY:wide?h*.70:h*.785,buttonY:wide?h*.89:h*.925,buttonW:Math.min(270,textW),buttonH:wide?42:Math.min(52,h*.085),titleFont:wide?20:Math.min(25,w*.067),bodyFont:wide?12:Math.min(15,w*.042),whyFont:wide?12:Math.min(14,w*.039)};
}
const STAGE_EPILOGUE = [
  { title:'The Empress Falls Silent',
    body:'The Acid Ant Empress shatters and the crystal orders lose their grip. The freed ants remember their own names — and point Strawberry toward the drains where the sour acid still flows.',
    why:'Follow the poisoned current downstream to find its source.' },
  { title:'The Pipes Run Clear',
    body:'Clogmaw bursts and the fermented flood drains away. In the last trickle Strawberry hears a furnace roar far below — something is burning stolen flavor into raw power.',
    why:'Descend to the Chili Engine before it finishes stoking.' },
  { title:'The Furnace Goes Cold',
    body:'Mr. Griddle sputters out and his cursed engine stalls. But that heat was feeding a freezer above, where sweet flavor-spirits are being frozen as the next batch of fuel.',
    why:'Climb to the Sugar Frost Prison and free the captured flavors.' },
  { title:'The Ice Lets Go',
    body:'The Golem melts into slush and the frozen mochi drift free, whispering their thanks. Grandma stays behind in the ice — her flavor is locked inside the Crown itself. She warns of an oven higher up, where a root of the Crown drinks the kitchen dry.',
    why:'Ascend to the Crown Oven and cut the root.' },
  { title:'The Great Hunger Recedes',
    body:'The Hunger’s mouth recoils and flavor floods back into the kitchen in a rush of color and sound. But the wounded root slides down through the floor — toward the garden, to grow a new body.',
    why:'Chapter 1 is complete. Follow the root into the Fermented Canopy.' },
  { title:'The First Bloom Withers',
    body:'Rootmother’s Bud unwinds into drifting spores, revealing that it was only an avatar grown by the root. Beneath the canopy, a fungal pulse answers from the Mycelium Marsh.',
    why:'Follow the moving pocket of clean air into the marsh and find the body feeding the colony.' },
  { title:'The Marsh Remembers',
    body:'The Mycelium Behemoth releases every memory trapped in its colony. Their scent leads upward to a royal hive feeding on the garden’s last nectar.',
    why:'Carry the clean memories into the Nectar Hive before the royal ferment consumes them.' },
  { title:'The Crown Loses Its Swarm',
    body:'The Ferment Hornet Queen falls and the protected nectar flowers ring like bells. Their rhythm opens a glass path where four seasons are running at once.',
    why:'Enter the Four-Season Conservatory and repair the broken calendar.' },
  { title:'The Last Hour Opens',
    body:'Chronobloom Orchid returns each season to its rightful path. Beneath its clock, an ancient stair descends toward the first root and the throne that planted every curse.',
    why:'Descend to the Root Throne and face the True Rootmother.' },
  { title:'Memories Choose Their Own Shape',
    body:'The True Rootmother’s crown breaks. Every stolen memory escapes the roots and returns to Mochitopia—not as an order, but as a choice. The Heart Seed glows brighter in Strawberry’s hands — the First Tree is calling.',
    why:'Chapter 2 is complete. The freed memories point somewhere older — to the fields where the First Tree grows.' },
  // v4.85: Chapter 3 epilogues (index 10-14)
  { title:'The Harvest Lies Down',
    body:'The Harvest Colossus crumbles back into ash and straw. Beneath it, rows of hollow trees stretch toward the horizon, their flavor carved out and carried away.',
    why:'Walk into the Hollow Orchard and find where the stolen taste went.' },
  { title:'The Orchard Breathes Again',
    body:'The Hollow Bloom scatters its stolen flavors back into the trees, and the first fruit in centuries begins to swell. The last sap still flows uphill — toward a broken greenhouse of glass.',
    why:'Follow the sap into the Glass Greenhouse Ruins.' },
  { title:'Every Future Shatters But One',
    body:'The Glass Gardener’s panes break and the false futures fade. Only one reflection stays true: a sealed vault holding every crown seed ever grown.',
    why:'Open the Seed Vault before another crown can be planted.' },
  { title:'The Vault Is Empty of Fear',
    body:'The Seedwarden falls and the jars of crown seeds dim into ordinary seeds, harmless and small. Under the vault floor, a single ancient root pulses toward a quiet throne.',
    why:'Climb the root to the Throne of the First Seed and meet the Planter.' },
  { title:'The Cycle Ends With a Choice',
    body:'The First Planter lifts the Crown from the First Tree. Strawberry plants the Heart Seed in its place, and a new tree sends every stolen flavor home. The curse breaks — all across Mochitopia, mochi become people again. Grandma laughs, Ruby cries, and the Hunger sinks, sleeping, beneath the roots.',
    why:'The story is complete. Each night the Hunger stirs below — the Delve and the Pinnacle await.' },
];
const STORY_REACTIONS = {
  momo:["I'll follow the curse's scent myself","These voices don't want to fight... I must hurry","A warden is coming — stay focused, Strawberry","The source is close — no retreat","End this and take back everyone's flavor"],
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
/* v7.9.60 เจ้าของ: มาสคอต Ruby บอกวิธีเล่นแต่ละภารกิจ (กรอบข้อความด้านบน คำสำคัญเป็นสี [..]) · say = ครั้งแรก ๆ (2 บรรทัด), short = สรุปสั้น/เตือนซ้ำ */
/* v7.9.81 เจ้าของ: Ruby พูดเป็นธรรมชาติ มีเรื่องราว · Ruby = Mochi Core ไส้แยมทับทิม ผู้เฝ้าตำราสูตรของตู้กับข้าว · Great Hunger กลืนรสของเธอไป เลยปลุกร่างนักสู้ไม่ได้ · ทุกด่านที่ชนะ = ความทรงจำกลับมาทีละชิ้น */
/* v8.1.103 Flavor Cores ในเรื่อง: คุณยายถักแก่น 3 เส้นไว้ในเมล็ดหัวใจ (Life Core = ร่างคน · Flavor Spark = รสที่ถูกขโมย · Oath Shell = คำสัญญาปกป้องกัน) · Sugar = รสที่ชิงคืนจากมอน · ป้อนแก่น = เมล็ดยึดร่างคนได้แน่นขึ้น → แข็งแรงถาวร แบ่งให้เพื่อนทุกคนที่ปลดคำสาปแล้ว */
/* v8.2.52 ECRS: Overcharge ลบแล้ว */ const OVERCHARGE_ON=false;   // v8.1.103 เจ้าของ: เอาวง Overcharge ในด่านออกก่อน (โค้ดเก็บไว้ เปิดกลับ = true)
const CORE_LORE_LINES=['That Sugar is flavor the Hunger stole. We just took some back!','Grandma wove three Flavor Cores into the Heart Seed: Life Core, Flavor Spark and Oath Shell.','Feed them Sugar and the Seed holds your true form tighter. Every friend we free shares that strength too!'];
const RUBY_TIPS={
  /* v8.1.104 ภารกิจประจำด่าน/League 14 แบบ: Ruby อธิบายตอนเริ่ม (เดิมเงียบ) · เสียงใบ A13 */
  seedRift:{say:'Catch the [seed carriers] before they feed the rift!',short:'Catch the [seed carriers]!'},
  shakeTrees:{say:'Stand under each [tree] to shake it. Fruit, or a surprise!',short:'Shake every [tree]!'},
  mirrorPath:{say:'Stand by each [mirror] to charge it. Then the crystal blasts!',short:'Charge every [mirror]!'},
  vaultAltar:{say:'Pick a [curse], then take the loot or risk it for more!',short:'Pick a curse, then [take] or [risk]!'},
  ultimatum:{say:'Each round adds a [curse]. Take the pot, or risk it for more!',short:'Take the pot or [risk] it!'},
  lastLight:{say:'Keep one [lantern] burning! Stand close to rekindle them.',short:'Keep a [lantern] lit!'},
  frozenPantry:{say:'Open the [sugar jar], then walk through the frozen army and crates!',short:'Walk through the [frozen army]!'},
  hungersMouth:{say:'Touch the [Hunger’s hand]! Kills inside keep the breach open.',short:'Keep fighting [inside the breach]!'},
  creepingRoots:{say:'Roots crawl to the [flower]! Stand on each [root mother] to cut it.',short:'Cut the [root mothers]!'},
  hungerHerald:{say:'The [Herald] can’t be hurt — beat the monsters it powers up!',short:'Beat the [powered-up] ones!'},
  grandmasPot:{say:'Step into Grandma’s [ring]! Beat the hungry mochi in the light to fill the [pot].',short:'Fight inside the [pot ring]!'},
  grandmasGolem:{say:'Collect [golem parts], bake them in the [oven], then beat the golem!',short:'Bake the [golem parts]!'},
  hungerSiege:{say:'Hold the [circle]! Every kill inside fills the pot.',short:'Hold the [circle]!'},
  hungerDomain:{say:'The whole cave is a breach! Survive, then beat the [Breachlord]!',short:'Survive, then the [Breachlord]!'},
  yuzuAim:{say:'Yuzu’s seeds fly where you [walk]. Your buddy hits the [marked target] first!',short:'Walk toward an enemy to [mark] it!'},
  survive:{say:'Stay alive until the [timer] ends. Keep moving!',short:'Hang on until the [timer] ends!'},
  fill:{say:'Beat monsters to fill the [Meter]!',short:'Fill the [meter]!'},
  hunt:{say:'Dodge its [poison bottles] and beat the marked Elite!',short:'Dodge the [bottles]!'},
  huntClear:{say:'Clear the crowd, then beat the [marked] leader!',short:'Clear the crowd, then the [marked Elite]!'},
  purge:{say:'Keep the [Wisp] safe. Outside, you [bleed]!',short:'Keep the [Wisp] safe from [red raiders]!'},
  capture:{say:'Touch the [crack] — it races to the next hole!',short:'Touch the [crack], clear the holes!'},
  defendNectar:{say:'Protect the [flower]! Stay close.',short:'Protect the [flower]!' },
  seasonCycle:{say:'Grab [petals] for all [4 seasons]!',short:'Gather [petals] for all [four seasons]!'},
  breakRoots:{say:'Lure the [root] into the [anchor stones]!',short:'Make the [root] hit the [stones]!'},
  cleanAir:{say:'Grab the [fresh air] and free everyone in the [poison fog]!',short:'Free them from the [fog]!'},   /* v8.1.162 ข้อความใหม่ (เสียงเดิมพูดเรื่องวง จึงไม่เล่น · ต้องสั่งเสียงใหม่) */
  counter:{say:'[Dash into] the glowing item to kick it at the boss!',short:'[Dash] into the glowing item!'},
  mini:{say:'A [Miniboss]! Beat it to spin the [reward wheel]!',short:'Beat the [Miniboss]!'},
  boss:{say:'The [Boss]! Dash away from [red warnings], then hit back!',short:'Defeat the [Boss]!'},
  magnet:{say:'A [Magnet]! It pulls in all your [EXP].'},
  heal:{say:'A [Heal Mochi]! Grab it to get [HP] back.'},
  chest:{say:'A [Treasure Chest]! Open it for a free [upgrade].'}
};
/* Ruby ตอนเริ่มด่านครั้งแรก — เรื่องราวของ Ruby ต่อเนื่องทีละด่าน (ความทรงจำกลับมาเมื่อชนะบอสก่อนหน้า) */
function rubyWrap(text,max){ const out=[]; for(const ln of String(text).split('\n')){ const words=ln.match(/\[[^\]]*\]\S*|\S+/g)||['']; let cur='';
  for(const w of words){ const len=(cur+' '+w).replace(/[\[\]]/g,'').length; if(cur&&len>max){ out.push(cur); cur=w; } else cur=cur?cur+' '+w:w; } out.push(cur); } return out; }   // v7.9.81 ตัดบรรทัดกล่อง Ruby (ไม่ตัดกลางคำใน [ ])
const RUBY_STORY=[   // v7.9.98 เรื่องหลัก docs/STORY_CANON.md
  'You found the Heart Seed and became a person again! I’m Ruby.',
  'The Empress is beaten and Mint is free! Grandma’s recipes are down these pipes.',
  'So hot! This machine burns stolen flavor. Cocoa is free now!',
  'The frozen mochi here were people once. Taro is free!',
  'A Crown root drinks this kitchen. Yuzu is here — let’s cut it!',
  'The root slid into the garden. Grandma’s flavor is still in the Crown.',
  'These spores eat memories. Stay close to me!',
  'The bees once made honey for everyone. Now they guard it for the Hunger.',
  'Time stopped here when the curse began.',
  'All the roots lead to one place. The Hunger is growing a body.',
  'The fields are empty. The Hunger is reaching for the First Tree.',
  'These flowers were eaten hollow. Stay sharp!',
  'The glass shows the old kingdom. Look — people, not mochi!',
  'The first seeds sleep here. The First Tree is close!',
  'This is the First Tree. Thank you for bringing me this far.'
];
const RUBY_STORYBOOK=[
  {title:'The Heart Seed',pages:[
    {art:'ruby_comic_s1_1',text:'Long ago, a Crown turned everyone in Mochitopia into mochi — and began eating their flavor.',mood:'sad'},
    {art:'ruby_comic_s1_2',text:'I’m Ruby, a jam spirit. Grandma made me to guard her recipe book and one sleeping seed.',mood:'sad'},
    {art:'ruby_comic_s1_3',text:'Today the floor cracked, you fell, and the Heart Seed woke in your hands. You’re a person again!',mood:'happy'}
  ]},
  {title:'Grandma’s Jam Jar',pages:[
    {art:'ruby_comic_s2_1',text:'The Empress is free and her flavor came home. These pipes lead to where Grandma hid her jar.',mood:'happy'},
    {art:'ruby_comic_s2_2',text:'Before the Hunger caught her, Grandma dropped her jar into the cracks to keep it safe.',mood:'sad'},
    {art:'ruby_comic_s2_3',text:'Inside: Grandma’s Battle Recipes! Three seed styles for your Heart Seed; choose one on each floor.',mood:'happy'}
  ]},
  {title:'The Stolen Flavor',pages:[
    {art:'ruby_comic_s3_1',text:'This furnace burns the flavor the Hunger steals. Every spark is a piece of someone.',mood:'alert'},
    {art:'ruby_comic_s3_2',text:'Look at those jars. Cursed mochi are trapped inside, drained of everything they are.',mood:'sad'},
    {art:'ruby_comic_s3_3',text:'Stop the furnace and their flavor comes home — then your seed can break their curse!',mood:'normal'}
  ]},
  {title:'A Voice in the Ice',pages:[
    {art:'ruby_comic_s4_1',text:'Cursed mochi are frozen in here as fuel. Their voices tremble beneath the frost.',mood:'sad'},
    {art:'ruby_comic_s4_2',text:'That gentle voice… Grandma! She froze herself so the Hunger could not eat her last page.',mood:'sad'},
    {art:'ruby_comic_s4_3',text:'Her flavor is locked inside the Crown itself. We free the others now — then we go get hers.',mood:'alert'}
  ]},
  {title:'The Crown Oven',pages:[
    {art:'ruby_comic_s5_1',text:'The Crown Oven. A root of the Crown comes up here to drink the whole kitchen’s flavor.',mood:'alert'},
    {art:'ruby_comic_s5_2',text:'I’m frightened. But Grandma is waiting, and the First Tree is starving.',mood:'sad'},
    {art:'ruby_comic_s5_3',text:'Let’s cut this root together. Then we follow it — all the way to the Crown.',mood:'happy'}
  ]}
];
// v8.0.2 ใบ 45 Motion Comic: ฉากแยกเลเยอร์ขยับได้ · พิกัดอ้างอิงจอ 360×780 (เหมือนภาพตรวจของฝั่งอาร์ต) · เลเยอร์ [key,x,y,กว้าง,สูง,{at,out,to,ms,ease,bob,glow,rot,sq,fps,loop,fr,a,fade}] · ภาพโหลดทีละฉาก เล่นจบคืน texture
const MC_PANTRY=['cs_s01_far_pantry','cs_s01_mid_pantry','cs_s01_fg_pantry'],MC_NEST=['cs_s01_far_nest','cs_s01_mid_nest','cs_s01_fg_nest'],MC_ROOT=['cs_s01_far_root_floor','cs_s01_mid_root_floor','cs_s01_fg_root_floor'],MC_CITY=['cs_s00_far_city','cs_s00_mid_city','cs_s00_fg_city'];
const MC_HERO_VOICE={mint:['vo_mint_unlock','Chill. I’ve got your back.'],cocoa:['vo_cocoa_unlock','Free at last. Can I nap now?'],taro:['vo_taro_unlock','I’m free! Which way is adventure?'],yuzu:['vo_yuzu_unlock','Citrus squad, ready to grow?'],sesame:['vo_sesame_unlock','I remember now… let’s go together.']};   /* v8.1.65 A11 */
const mcHero=(bg,h,card,name,line)=>({title:'A FRIEND RETURNS',shots:[
  {bg:[bg],zoom:[1,1.07],cap:'A cursed friend is trapped here, drained of flavor…',L:[['cs_pup_mochi_'+h+'_trapped',180,380,200,240,{bob:3}]]},
  {bg:[bg],zoom:[1.07,1.1],flash:[1300,0xffd6e8],cap:'The Heart Seed glows in Strawberry’s hands.',L:[['cs_pup_mochi_'+h+'_trapped',180,380,200,240],['cs_fx_seed_glow',180,250,150,150,{fps:10}],['cs_pup_seed_wake',180,250,70,105,{glow:1}]]},
  {bg:[bg],zoom:[1.1,1.04],shake:[300,350,.008],cap:'The curse breaks!',L:[['cs_pup_mochi_'+h+'_trapped',180,380,200,240,{out:450}],['cs_pup_mochi_'+h+'_free',180,400,170,170,{at:450,out:1100}],['cs_fx_curse_smoke',180,360,300,300,{fps:10,loop:false}],['cs_fx_transform',180,360,340,340,{fps:12,loop:false,at:200}],[card,180,340,230,320,{at:1100,fade:420}]]},
  {bg:[bg],zoom:[1.04,1],cap:line,L:[[card,180,330,240,330,{bob:6}],['cs_fx_sparkle',90,230,70,70,{fps:9}],['cs_fx_sparkle',275,290,55,55,{fps:9,fr:3}]]},
  ...(MC_HERO_VOICE[h]?[{bg:[bg],zoom:[1,1.03],cap:MC_HERO_VOICE[h][1],voiceKey:MC_HERO_VOICE[h][0],L:[[card,180,330,240,330,{bob:6}]]}]:[])]});
const MOTION_COMICS={
  s00:{title:'LONG AGO',shots:[
    {bg:MC_CITY,pan:[-28,28],cap:'Long ago, Mochitopia was a kingdom of people — and every home was full of flavor.',L:[['cs_pup_crowd_people',180,420,330,170]]},
    {bg:['cs_s00_far_tree','cs_s00_mid_tree','cs_s00_fg_tree'],zoom:[1,1.12],cap:'The First Planter set a Crown on the First Tree… and the Crown grew hungry.',L:[['cs_pup_planter_crown',180,400,250,250],['cs_pup_crown_glow',182,262,120,95,{at:900,glow:1}]]},
    {bg:['cs_s00_far_city_night'],zoom:[1,1.04],flash:[750,0x9b5cff],mote:'snow',motes:10,cap:'In one night, everyone became mochi — and the Crown began to eat their flavor.',L:[['cs_pup_crowd_people',180,430,330,170,{out:800}],['cs_pup_crowd_mochi',180,440,330,150,{at:800}],['cs_fx_curse_smoke',180,360,380,380,{fps:8,loop:false,at:350}]]}]},
  s01:{title:'THE HEART SEED',shots:[
    {bg:MC_PANTRY,zoom:[1,1.04],shake:[2100,400,.004],ms:2800,cap:'Hundreds of years later, a little strawberry mochi is tidying a quiet pantry…',L:[['cs_pup_mochi_berry_idle',145,350,150,150,{bob:3}],['cs_fx_crack',200,465,330,185,{fps:6,loop:false,at:2100,hold:1}]]},
    {bg:['cs_s01_far_roots_burst'],zoom:[1.08,1.02],shake:[250,700,.014],flash:[250,0x6a2fd6],cap:'…when the starving Hunger’s roots burst up through the floor!',L:[['cs_pup_mochi_berry_scared',85,410,135,145,{sq:250}],['cs_fx_root_burst',215,337,230,230,{fps:10,loop:false,hold:1}],['cs_fx_curse_smoke',240,300,260,260,{fps:9,loop:false,at:300}]]},
    {bg:['cs_s01_far_shaft'],scroll:1,ms:2400,cap:'…and a little strawberry mochi falls into the dark!',L:[['cs_pup_mochi_berry_fall',180,80,135,165,{to:[180,430],ms:2300,ease:'Sine.easeIn'}]]},
    {bg:MC_NEST,zoom:[1,1.04],shake:[420,250,.008],cap:'She lands with a thump in a sour ant nest. Something pale is moving in the dark…',L:[['cs_pup_mochi_berry_scared',180,230,140,150,{to:[180,390],ms:420,ease:'Quad.easeIn',sq:420}],['cs_fx_dust',180,470,235,118,{fps:12,loop:false,at:420}],['cs_pup_blank_mochi_walk',-30,420,80,80,{at:900,to:[40,420],ms:2200,fade:700}]]},
    {bg:MC_NEST,pan:[-10,24],zoom:[1.04,1.08],cap:'Blank, flavorless mochi creep closer — toward a little jam spirit hiding behind a crystal.',L:[['cs_pup_mochi_berry_scared',165,390,130,140],['cs_pup_blank_mochi_walk',10,420,80,80,{to:[75,425],ms:3000}],['cs_pup_blank_mochi_leap',-20,440,75,75,{at:500,to:[60,440],ms:2600}],['cs_pup_ruby_hide',390,370,105,115,{at:700,to:[300,370],ms:900,ease:'Back.easeOut',rot:6,fade:500}],['cs_fx_sparkle',300,320,60,60,{fps:9,at:1500}]]},
    {bg:MC_ROOT,pan:[-24,0],zoom:[1,1.04],cap:'“This way!” squeaks Ruby. The two of them dash between the old roots.',L:[['cs_pup_ruby_hide',-40,360,95,105,{to:[230,345],ms:1300,ease:'Sine.easeOut'}],['cs_pup_mochi_berry_reach',-90,360,190,150,{to:[120,355],ms:1500,ease:'Sine.easeOut'}],['cs_fx_dust',110,430,200,100,{fps:12,loop:false,at:1300}]]},
    {bg:MC_ROOT,zoom:[1.04,1.1],cap:'There, among the roots, something tiny is glowing — a sleeping seed.',L:[['cs_fx_seed_glow',265,395,120,120,{fps:8,a:.55}],['cs_pup_seed_sleep',265,402,75,100,{at:900,fade:1100,glow:1}],['cs_pup_ruby_hide',300,300,80,88,{bob:2}],['cs_pup_mochi_berry_reach',115,350,230,180,{at:600,to:[140,350],ms:2200}]]},
    {bg:MC_ROOT,zoom:[1.08,1.12],flash:[1500,0xffd6e8],cap:'The Heart Seed wakes at her touch…',L:[['cs_pup_mochi_berry_reach',140,350,230,180],['cs_fx_seed_glow',265,382,175,175,{fps:10}],['cs_pup_seed_wake',265,382,85,130,{glow:1}]]},
    {bg:MC_ROOT,zoom:[1.12,1.04],shake:[420,420,.012],cap:'…and the curse breaks. Strawberry is a person again!',L:[['cs_pup_mochi_berry_reach',180,345,230,280,{out:560}],['cs_pup_berry_land',180,345,230,280,{at:560,sq:560}],['cs_fx_transform',180,330,355,355,{fps:12,loop:false}]]},
    {bg:MC_NEST,zoom:[1.1,1],cap:'“I’m Ruby, Grandma’s jam spirit! That seed can free everyone. Let’s go!”',L:[['cs_pup_berry_hero',170,310,230,330],['ruby_talk_proud',290,320,105,110,{bob:5}],['cs_fx_sparkle',70,220,75,75,{fps:9}]]}]},
  s02:{title:'GRANDMA’S JAM JAR',shots:[
    {bg:['cs_s02_far_drains','cs_s02_mid_drains'],pan:[-26,26],cap:RUBY_STORYBOOK[1].pages[0].text,L:[['cs_s02_prop_jam_jar',185,355,180,200,{at:600,fade:500}]]},
    {bg:['cs_s02_far_drains','cs_s02_mid_drains'],zoom:[1.06,1.18],cap:RUBY_STORYBOOK[1].pages[1].text,L:[['cs_s02_prop_jam_jar',185,355,200,220],['cs_s02_prop_recipe_rolled',245,300,100,100,{bob:3}]]},
    {bg:['cs_s02_far_drains','cs_s02_mid_drains'],zoom:[1.18,1.12],cap:RUBY_STORYBOOK[1].pages[2].text,L:[['cs_s02_prop_recipe_open',180,340,250,260,{fade:520}],['cs_fx_sparkle',180,230,80,80,{fps:9}],['cs_fx_sparkle',105,340,60,60,{fps:9,fr:3,at:400}]]}]},
  s03:{title:'THE STOLEN FLAVOR',shots:[
    {bg:['cs_s03_far_furnace'],zoom:[1,1.05],shake:[600,500,.004],cap:RUBY_STORYBOOK[2].pages[0].text,L:[['cs_s03_prop_gear',95,215,150,150,{rot:120}],['cs_s03_prop_gear',282,470,115,115,{rot:-160}]]},
    {bg:['cs_s03_far_furnace'],zoom:[1.05,1.14],cap:RUBY_STORYBOOK[2].pages[1].text,L:[['cs_s03_chr_prisoner',180,370,200,230,{bob:2}],['cs_fx_flavor_ribbon',180,250,330,100,{fps:10,to:[180,150],ms:2600}]]},
    {bg:['cs_s03_far_furnace'],zoom:[1.14,1.06],cap:RUBY_STORYBOOK[2].pages[2].text,L:[['cs_s03_chr_prisoner',180,370,200,230],['cs_fx_sparkle',115,280,70,70,{fps:9}],['cs_fx_sparkle',250,250,60,60,{fps:9,fr:2}]]}]},
  s04:{title:'A VOICE IN THE ICE',shots:[
    {bg:['cs_s04_far_prison','cs_s04_mid_prison'],pan:[-28,28],cap:RUBY_STORYBOOK[3].pages[0].text,L:[]},
    {bg:['cs_s04_far_prison','cs_s04_mid_prison'],zoom:[1.04,1.14],cap:RUBY_STORYBOOK[3].pages[1].text,L:[['cs_pup_grandma_mochi_frozen',180,340,230,330,{glow:1}],['cs_pup_ruby_hide',290,430,105,110,{bob:3}]]},
    {bg:['cs_s04_far_prison','cs_s04_mid_prison'],zoom:[1.14,1.06],shake:[250,300,.007],cap:RUBY_STORYBOOK[3].pages[2].text,L:[['cs_pup_grandma_mochi_frozen',180,340,230,330,{glow:1}],['cs_fx_frost_shatter',80,370,210,210,{fps:11,loop:false}],['cs_fx_frost_shatter',282,385,190,190,{fps:11,loop:false,at:350}]]}]},
  s05:{title:'THE CROWN OVEN',shots:[
    {bg:['cs_s05_far_oven'],zoom:[1,1.1],cap:RUBY_STORYBOOK[4].pages[0].text,L:[]},
    {bg:['cs_s05_far_oven'],zoom:[1.1,1.14],shake:[700,500,.006],cap:RUBY_STORYBOOK[4].pages[1].text,L:[['cs_pup_root_tip',180,320,170,190,{to:[180,290],ms:1200}],['cs_fx_flavor_ribbon',180,440,330,100,{fps:10,to:[180,340],ms:2600}]]},
    {bg:['cs_s05_far_oven'],zoom:[1.14,1],cap:RUBY_STORYBOOK[4].pages[2].text,L:[['cs_s05_chr_berry_ruby_back',180,430,280,270]]}]},
  s06:mcHero('cs_s02_far_drains','mint','card_mint','Mint','Mint, the village healer, is a person again — and her frost can freeze the sour drains!'),
  s07:mcHero('cs_s03_far_furnace','cocoa','card_cocoa','Cocoa','Cocoa, the old gate guard, is back — ready to punch through the iron machines!'),
  s08:mcHero('cs_s04_far_prison','taro','card_taro','Taro','Taro, the kingdom’s mapmaker, is free — his lightning leaps from guard to guard!'),
  s09:mcHero('cs_s05_far_oven','yuzu','card_yuzu','Yuzu','Yuzu, the orange grower, is herself again — with her little Yuzling close by!'),
  s10:mcHero('cs_s10_far_glass','sesame','card_sesame','Sesame','Sesame steps free of the glass, ready to weave the elements into spells.'),
  s11:{title:'CHAPTER 1 COMPLETE',shots:[
    {bg:['cs_s11_far_oven_cold'],zoom:[1,1.06],cap:'The Crown Oven goes cold. The wounded root tears itself free…',L:[['cs_pup_root_wound',180,420,160,150,{at:500,to:[180,560],ms:900,ease:'Quad.easeIn'}],['cs_fx_dust',180,470,235,118,{fps:12,loop:false,at:900}]]},
    {bg:['cs_s11_far_crosssection'],zoom:[1.04,1.1],cap:'…and burrows down through the earth, toward the garden below.',L:[['cs_pup_root_wound',180,230,120,110,{to:[180,520],ms:2600}]]}]},
  s12:{title:'CHAPTER 2',shots:[
    {bg:['cs_s12_far_garden','cs_s12_mid_garden','cs_s12_fg_garden'],pan:[-30,30],cap:'The wounded root fled into the Fermented Canopy…',L:[]},
    {bg:['cs_s12_far_garden','cs_s12_mid_garden'],zoom:[1.02,1.12],cap:'…and there it grows the Hunger a new body from stolen memories.',L:[['cs_s12_chr_hunger',180,300,330,390,{fade:900,bob:3}],['cs_fx_flavor_ribbon',180,470,330,100,{fps:10,to:[180,340],ms:2600}]]}]},
  s13:{title:'CHAPTER 2 COMPLETE',shots:[
    {bg:['cs_s13_far_throne'],zoom:[1,1.05],cap:'The Root Throne falls. Freed memories drift home like tiny lights.',L:[['cs_fx_sparkle',100,430,70,70,{fps:9,to:[100,200],ms:2800}],['cs_fx_sparkle',260,400,60,60,{fps:9,fr:2,to:[260,170],ms:2800,at:300}],['cs_fx_sparkle',180,460,80,80,{fps:9,fr:4,to:[180,240],ms:2800,at:600}]]},
    {bg:['cs_s13_far_throne'],zoom:[1.12,1],flash:[1000,0xffd166],cap:'The Heart Seed blazes and points the way — toward the First Tree.',L:[['cs_s13_chr_berry_raise',180,380,230,250],['cs_fx_seed_glow',205,235,170,170,{fps:10}]]}]},
  s14:{title:'CHAPTER 3',shots:[
    {bg:['cs_s14_far_field'],pan:[-24,24],cap:'Beyond the garden, the fields are grey. Every flavor here is already gone.',L:[]},
    {bg:['cs_s14_far_tree'],zoom:[1,1.15],cap:'On the far hill stands the First Tree, black roots climbing its trunk. The Hunger is almost there.',L:[]}]},
  s15:{title:'MEMORIES IN GLASS',shots:[
    {bg:['cs_s15_far_glasshall'],zoom:[1,1.04],cap:'Broken mirrors hold the kingdom’s memories — people laughing, before the Crown.',L:[['cs_s15_prop_memory_town',75,210,120,150,{bob:4,rot:4}],['cs_s15_prop_memory_grandma',280,205,120,155,{bob:5,rot:-4}],['cs_s15_prop_memory_family',180,330,190,200,{bob:3}]]},
    {bg:['cs_s15_far_glasshall'],zoom:[1.06,1.16],cap:'One mirror shows a pink-haired girl with her family. Strawberry remembers.',L:[['cs_s15_prop_memory_family',180,315,220,232,{bob:2}],['cs_pup_berry_look',85,440,135,180]]}]},
  s16:{title:'THE FIRST TREE',shots:[
    {bg:['cs_s16_far_clearing'],zoom:[1,1.08],cap:'The First Planter kneels and lifts the Crown from the First Tree.',L:[['cs_pup_planter_kneel',180,390,260,260],['cs_pup_crown_glow',190,255,120,95,{to:[190,205],ms:2400,glow:1}]]},
    {bg:['cs_s16_far_clearing'],zoom:[1.08,1.1],shake:[650,520,.016],flash:[700,0xffffff],cap:'The Crown cracks apart!',L:[['cs_pup_crown_crack',180,280,170,130]]},
    {bg:['cs_s16_far_clearing'],zoom:[1,1.12],cap:'Strawberry plants the Heart Seed at the roots.',L:[['cs_s16_chr_berry_plant',180,400,250,240],['cs_pup_seed_wake',212,470,48,72,{at:900,glow:1}]]},
    {bg:['cs_s16_far_clearing'],zoom:[1.04,1.08],cap:'A new tree grows, and the stolen flavor rushes back to every home.',L:[['cs_s16_prop_sprout',180,470,100,120,{out:700}],['cs_s16_prop_sapling',180,450,150,170,{at:700,out:1400,sq:700}],['cs_s16_prop_young_tree',180,410,220,250,{at:1400,sq:1400}],['cs_fx_flavor_ribbon',180,330,330,100,{fps:10,at:1400}],['cs_fx_flavor_ribbon',180,250,300,90,{fps:10,fr:3,at:1700}]]},
    {bg:MC_CITY,zoom:[1.02,1.08],cap:'One by one, the people of Mochitopia become themselves again.',L:[['cs_pup_crowd_mochi',180,430,330,150,{out:1250}],['cs_pup_crowd_people',180,420,330,170,{at:1250}],['cs_fx_transform',90,405,160,160,{fps:12,loop:false,at:250}],['cs_fx_transform',180,385,170,170,{fps:12,loop:false,at:650}],['cs_fx_transform',270,405,160,160,{fps:12,loop:false,at:1050}]]},
    {bg:['cs_s16_far_clearing'],zoom:[1.08,1],cap:'Grandma is free. Ruby hugs her and will not let go.',L:[['cs_s16_prop_young_tree',265,240,190,290],['cs_pup_planter_old',290,360,110,180],['cs_s16_chr_grandma_ruby_hug',145,365,250,310,{bob:2}]]},
    {bg:['cs_s16_far_hunger_sleep'],zoom:[1,1.06],cap:'Deep below, the Hunger curls up and falls asleep… for now.',L:[]}]},
  s17:{title:'THE DELVE',shots:[
    {bg:['cs_s16_far_hunger_sleep'],zoom:[1.04,1.1],shake:[1700,500,.01],cap:'In the dark beneath Mochitopia, the Hunger opens one eye.',L:[['cs_s17_prop_eyes_half',180,330,300,62,{at:400,out:1700,fade:500}],['cs_s17_prop_eyes_open',180,330,320,85,{at:1700,fade:300,glow:1}]]},
    {bg:['cs_s17_far_delve'],zoom:[1,1.12],cap:'The way down is open. Together, the friends step into the Delve.',L:[['cs_s17_chr_team_back',180,470,345,265]]}]}
};
const MC_HERO_SCENE={mint:'s06',cocoa:'s07',taro:'s08',yuzu:'s09',sesame:'s10'},MC_STAGE_STORY=[['s00','s01'],['s02'],['s03'],['s04'],['s05']],MC_AFTER_STAGE={4:'s11',9:'s13',14:'s16'};
// v8.0.4 คลังเรื่อง (Lobby แท็ก 📖 Story): ลำดับตามเนื้อเรื่อง · [id, อีโมจิ, ชื่อ, ด่านที่ต้องผ่าน (stageMastery) ถึงดูได้ · −1 = หลังบทสอน] · เคยดูแล้ว (mcSeen) ดูได้เสมอ
const MC_GALLERY=[['s00','🏰','Long Ago',-1],['s01','🌱','The Heart Seed',-1],['s02','🫙','Grandma’s Jam Jar',0],['s06','🌿','Mint Returns',1],['s03','🔥','The Stolen Flavor',1],['s04','🧊','A Voice in the Ice',2],['s05','👑','The Crown Oven',3],['s11','🕳️','Chapter 1 Complete',4],['s12','🍄','Chapter 2',4],['s10','🪞','Sesame Returns',4],['s07','🐻','Cocoa Returns',4],['s08','⚡','Taro Returns',6],['s13','✨','Chapter 2 Complete',9],['s14','🌾','Chapter 3',9],['s09','🍊','Yuzu Returns',9],['s15','🪞','Memories in Glass',11],['s16','🌳','The First Tree',14],['s17','🌑','The Delve',14]];
const BOSS_MOTION_BEATS=[
  [
    "The Empress once bargained with the Crown to keep her eggs alive.",
    "The crystal saved the nursery — then ordered even its youngest workers into battle."
  ],
  [
    "Clogmaw kept the scraps and forgotten flavors that washed into the drains.",
    "The Crown twisted his care into hoarding, until no water or memory could escape."
  ],
  [
    "Mr. Griddle once kept the royal kitchen warm for everyone.",
    "The Crown made him burn stolen memories. He forgot every recipe except: keep the fire alive."
  ],
  [
    "The Golem believed that people frozen in his prison would be safe from the Hunger.",
    "But the ice could not stop their names from fading. Grandma’s cure still lay beyond it, inside the Crown."
  ],
  [
    "This creature was only the mouth of one root beneath the Crown Oven.",
    "It grew from a wish to end hunger, then learned to feed on the kingdom’s flavor."
  ],
  [
    "The wounded root grew a daughter from flavors stolen from the garden.",
    "The Bud gathered more memories, hoping her mother would finally call her a real flower."
  ],
  [
    "The Behemoth held the marsh’s memories together inside one great fungal body.",
    "Every stranger felt like a wound. Poison became the only protection the colony remembered."
  ],
  [
    "The Hornet Queen once shared her hive’s nectar with the whole garden.",
    "The Crown spoiled the royal stores. Too proud to admit it, she fed her workers the curse."
  ],
  [
    "When the curse began, the Orchid stopped time to save one perfect bloom.",
    "Centuries passed outside. Inside, all four seasons struggled through the same unfinished day."
  ],
  [
    "The garden’s stolen flavors gathered inside the Hunger’s new heart.",
    "The Rootmother called them her children — and would not let a single memory go home."
  ],
  [
    "The Colossus had sworn to leave no field ungathered while anyone was hungry.",
    "Even after the Crown took every crop, he kept harvesting ash rather than break his oath."
  ],
  [
    "She had been the orchard’s last flower before the Crown stole her sweetness.",
    "She tried filling that empty place with other flavors. Every stolen taste made it larger."
  ],
  [
    "The Gardener hid the old kingdom’s memories inside living glass.",
    "He cut away every future that might hurt them — including the path that could set them free."
  ],
  [
    "For centuries, the Seedwarden counted seeds that had never touched soil.",
    "A new seed might repeat the curse. A locked vault felt safer than choosing hope."
  ],
  [
    "The First Planter crowned the First Tree because he feared another famine.",
    "He called the Crown salvation. Defeat finally made him face what his wish had cost."
  ]
];
// v8.0.84 ใบ 61 (เจ้าของ): ฉากหลังล้มบอสจริง 3 ช็อต — Fall (ภาพทรุด + มงกุฎแตกที่จุด crown) · Freed (ความทรงจำเดิม + รูปจริงลอยขึ้น + คำสุดท้าย) · Onward (ทางเดินของบท + แสงรสชาติ + ไปไหนต่อ)
function bossCutscene61(idx,story,beats){
  const n=String(idx+1).padStart(2,'0'),fall='cs61_b'+n+'_fall',freed='cs61_b'+n+'_freed',on='cs61_ch'+(Math.floor(idx/5)+1)+'_onward',mem='cs_boss_'+String(idx).padStart(2,'0')+'_memory';
  if(typeof ASSET_IMAGES==='undefined'||![fall,freed,on,mem].every(k=>ASSET_IMAGES[k])||typeof ASSET_FX==='undefined'||!ASSET_FX.vfx_cs61_crown_shatter||!ASSET_FX.vfx_cs61_flavor_return)return null;
  const col=(typeof BOSS_SHOT!=='undefined'&&BOSS_SHOT[idx]?.c)||0x9265cf,cr=CS61_CROWN[idx]||[.5,.35],nx=typeof STAGES!=='undefined'&&STAGES[idx+1],nl=nx?'C'+((nx.chapter|0)+1)+'-'+(nx.chapterStage||((idx+1)%5+1))+' · '+nx.name:'';
  const why=idx===14?'The First Tree waits. The Crown must come off.':((typeof STAGE_EPILOGUE!=='undefined'&&STAGE_EPILOGUE[idx]?.why)||story.goal),where=nl?why+'\nNext: '+nl:why;
  return{title:story.title,tag:'A memory released after the battle',boss:true,noTitle:true,fast:true,v61:true,mote:idx===3?'snow':idx===2||idx===4?'ember':'spark',shots:[
    {bg:[fall],fit:'portrait',zoom:[1,1.05],ms:2600,shake:[650,380,.008],flash:[640,col],pow:['CRACK!','KRAK!','SHATTER!','CRACK!'][idx%4],powAt:650,cap:'👑 '+story.title+'\n'+beats[0],L:[['vfx_cs61_crown_shatter',0,0,0,0,{bgPt:cr,bgW:.42,at:520,loop:false,fps:12}]]},
    {bg:[fall],fit:'portrait',zoom:[1.05,1.08],ms:2600,cap:beats[1],L:[]},
    {bg:[mem],zoom:[1.06,1],ms:2900,flash:[420,0xffe2b3],pow:['POP!','POOF!','SHINE!','FREE!'][idx%4],cap:'“'+story.release+'”',L:[[freed,180,330,250,333,{at:300,fade:700,to:[180,300],ms:2400,bob:3}],['cs_fx_sparkle',180,250,170,170,{fps:10,at:500}]]},
    {bg:[on],fit:'portrait',zoom:[1.04,1],ms:2700,cap:where,L:[['vfx_cs61_flavor_return',180,300,210,420,{at:250,loop:false,hold:true,fps:10}]]}
  ]};
}
const BOSS_MOTION_TEX=['boss1','boss2','boss3','boss4','boss5_sovereign','boss6_rootmother','boss7_mycelium_behemoth','boss8_hornet_queen','boss9_chronobloom_orchid','boss10_true_rootmother','c3_boss1','c3_boss2','c3_boss3','c3_boss4','c3_boss5'];
const CS61_CROWN=[[0.37,0.344],[0.515,0.31],[0.491,0.299],[0.505,0.297],[0.5,0.237],[0.515,0.297],[0.546,0.24],[0.528,0.219],[0.546,0.367],[0.52,0.227],[0.542,0.334],[0.584,0.263],[0.542,0.287],[0.583,0.391],[0.563,0.323]];   // v8.0.84 ใบ 61: จุดกลางมงกุฎในภาพ Fall (สัดส่วน กว้าง/สูง จาก MANIFEST crown)
// v8.0.90 เจ้าของ: cutscene ไม่เอาเอฟเฟกต์ (ลำแสง/สีรุ้ง/ประกาย/คำเสียง) — เหลือแค่ภาพพื้นหลังกับตัวละคร
const MC_FX_RE=/^(?:cs_fx_|vfx_)/;
function mcPlain(sc){if(!sc)return sc;return{...sc,plain:true,mote:null,shots:sc.shots.map(sh=>{const o={...sh,L:(sh.L||[]).filter(l=>!MC_FX_RE.test(l[0])),motes:0};delete o.flash;delete o.pow;delete o.lines;return o;})};}
function bossMotionId(idx){return Number.isInteger(idx)&&idx>=0&&idx<15?'b'+String(idx).padStart(2,'0'):null;}
function bossMotionScene(idx,legacy){
  const id=bossMotionId(idx),story=BOSS_STORIES[idx],beats=BOSS_MOTION_BEATS[idx];if(!id||!story||!beats)return null;
  if(!legacy){const v=bossCutscene61(idx,story,beats);if(v)return v;}   // v8.0.84 ใบ 61 ครบ → 3 ช็อตใหม่ · ขาด/โหลดไม่ได้ = 2 ช็อตเดิม
  const bg=['cs_boss_'+String(idx).padStart(2,'0')+'_memory'],key=BOSS_MOTION_TEX[idx],mote=idx===3?'snow':idx===2||idx===4?'ember':'spark',actor=(x,y,size,o={})=>[key,x,y,size,size,{frames:[0,1],fps:3,...o}],ruby=['ruby_talk_worried',302,480,78,86,{bob:2}];
  // v8.0.73 เจ้าของ: เรื่องหลังชนะบอสยาว/ซ้ำ/งง → 2 ช็อต ไม่มีการ์ดชื่อ · ช็อต 1 = ชื่อบอส + อดีต · ช็อต 2 = คำสุดท้าย + ไปที่ไหนต่อ · ท่าเปลี่ยน 4 แบบตามบอส สีแฟลชตามกระสุนบอส
  const V=[{ax:118,rx:300,pan:[-18,12],z:[1,1.08],enter:[-90,0]},{ax:242,rx:66,pan:[18,-10],z:[1.08,1],enter:[0,-170]},{ax:180,rx:300,pan:[0,-18],z:[1,1.12],enter:[0,160]},{ax:180,rx:66,pan:[-12,14],z:[1.12,1.02],enter:[110,0]}][idx%4];
  const col=(typeof BOSS_SHOT!=='undefined'&&BOSS_SHOT[idx]?.c)||0x9265cf,ay=idx%2?330:345,sz=idx%3===0?270:250,rb=(k,b)=>[k,V.rx,480,78,86,{bob:b}],nx=typeof STAGES!=='undefined'&&STAGES[idx+1],nl=nx?'C'+((nx.chapter|0)+1)+'-'+(nx.chapterStage||((idx+1)%5+1))+' · '+nx.name:'';
  const why=idx===14?'The First Tree waits. The Crown must come off.':(STAGE_EPILOGUE[idx]?.why||story.goal),where=nl&&(story.release.length+why.length+nl.length)<118?why+'\nNext: '+nl:why;   // ยาวเกิน = ไม่ใส่บรรทัด Next (ตัวอักษรต้อง ≥12px บนจอเล็ก)
  return{title:story.title,tag:'A memory released after the battle',boss:true,noTitle:true,fast:true,mote:idx===3?'snow':idx===2||idx===4?'ember':idx%2?'spark':'dust',shots:[
    {bg,pan:V.pan,zoom:V.z,ms:2600,flash:[520,col],shake:idx%3===1?[500,.006]:undefined,cap:'👑 '+story.title+'\n'+beats[0],L:[actor(V.ax+V.enter[0],ay+V.enter[1],sz,{to:[V.ax,ay],ms:900,bob:2,rot:idx%2?4:0}),['cs_pup_crown_glow',V.ax,ay-150,80,66,{glow:1,at:500}],['cs_fx_curse_smoke',V.ax,ay,sz+30,sz+30,{fps:8,a:.4,at:300}],rb('ruby_talk_worried',2)]},
    {bg,zoom:[V.z[1],V.z[0]],ms:2800,flash:[500,0xffe2b3],pow:['POP!','POOF!','SHINE!','FREE!'][idx%4],cap:'“'+story.release+'”\n'+where,L:[actor(V.ax,ay,sz-20,idx===14?{to:[V.ax,ay+15],ms:1500}:{out:1500,to:[V.ax,ay+10],ms:1400}),['cs_fx_sparkle',V.ax,ay-60,160,160,{fps:10,at:450}],...(idx===14?[]:[['cs_fx_flavor_ribbon',V.ax,ay,250,80,{fps:9,at:550,to:[V.rx<180?320:40,170],ms:2000}]]),rb('ruby_talk_proud',3)]}
  ]};
}
for(let i=0;i<15;i++)MC_GALLERY.push([bossMotionId(i),'👑',BOSS_STORIES[i].title,i]);
const STAGE_TAGLINES=['Every hero starts with a fall.','What the nest spills, the drains remember.','Somewhere below, a fire is eating flavor.','In the cold, someone is still waiting.','The Hunger is awake. And it is listening.','A root that runs can still grow.','Breathe while you still can.','The sweetest things are the first to be taken.','Four seasons. One broken garden.','Every root leads somewhere. This one leads to a throne.','Nothing grows where the Crown has fed.','Ripe on the outside. Empty within.','Glass remembers what people forget.','The last of every flavor sleeps here.','Take off the Crown. End the curse.'];
// v8.0.3 คำโปรยการ์ดชื่อ (tag) · อนุภาคลอย (mote) · คำเสียงการ์ตูน (pow ต่อช็อต)
(()=>{ const F={s00:['Before the mochi, there were people.','spark',{2:'POOF!'}],s01:['One small seed. One small hero.','dust',{1:'CRACK!',3:'THUD!',8:'POP!'}],s02:['Grandma left a recipe for every fight.','dust',{}],s03:['Flavor was never meant to be fuel.','ember',{0:'CLANK!'}],s04:['Some voices survive the cold.','snow',{2:'SHATTER!'}],s05:['The Hunger has a voice now.','ember',{1:'RUMBLE…'}],
    s06:['One more friend comes home.','snow',{2:'POOF!'}],s07:['One more friend comes home.','spark',{2:'POOF!'}],s08:['One more friend comes home.','spark',{2:'POOF!'}],s09:['One more friend comes home.','ember',{2:'POOF!'}],
    s11:['The oven is cold. The root is running.','ember',{0:'RIIIP!'}],s12:['A new garden. An old Hunger.','spark',{}],s13:['The way home is lit.','spark',{}],s14:['The last road climbs toward the First Tree.','dust',{}],s15:['What was lost is not gone.','spark',{}],s16:['The curse ends where it began.','spark',{1:'KRAK!'}],s17:['Deep below, something stirs.','dust',{0:'RUMBLE…'}]};
  for(const id in F){ const sc=MOTION_COMICS[id]; if(!sc)continue; sc.tag=F[id][0]; sc.mote=F[id][1]; for(const i in F[id][2])if(sc.shots[i])sc.shots[i].pow=F[id][2][i]; }
  for(const sh of MOTION_COMICS.s01.shots.slice(2,3))sh.lines=[0,2300]; MOTION_COMICS.s11.shots[0].powAt=500; })();
