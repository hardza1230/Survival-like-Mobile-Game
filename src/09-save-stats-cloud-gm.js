const Save = {
  data:{ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], gearItems:[], equippedGear:{}, gearInventoryCap:100, gearInbox:[], gearAutoDismantle:'off', gearSchemaVersion:0, gearUidSeq:0, character:'momo', chars:[], charProg:{}, rank:0, ascension:0, endlessBest:0, endlessBoard:[], noAds:false, settings:Object.assign({},DEFAULT_SETTINGS) },
  load(){ let gearMigrated=false; try{ const s=localStorage.getItem('mochi_save'); if(s)this.data=Object.assign(this.data,JSON.parse(s)); }catch(e){}
    this.data.sugar=clampSugar(this.data.sugar);
    if(!this.data.upgrades)this.data.upgrades={};
    if(!this.data.gear)this.data.gear={};
    if(!this.data.gearLv)this.data.gearLv={};
    if(!this.data.ownedGear)this.data.ownedGear=[];
    const gearDefaults={ weapon:'w_spoon', gloves:'gl_none', armor:'ar_none', boots:'bo_none', amulet:'am_none', ring:'ri_none' };
    for(const slot in gearDefaults){ if(!this.data.gear[slot])this.data.gear[slot]=gearDefaults[slot];
      if(!this.data.ownedGear.includes(gearDefaults[slot]))this.data.ownedGear.push(gearDefaults[slot]); }
    gearMigrated=this.migrateGearInstances(gearDefaults);
    this.migrateAffixTiers11(); this.migrateModLines3(); this.migrateKitchen3();
    if(!this.data.chars||!this.data.chars.length)this.data.chars=['momo'];
    if(!this.data.character)this.data.character='momo';
    if(!CHAR_ORDER.includes(this.data.character))this.data.character='momo';   // ตัวที่ถูกพัก (Berry) → คืนเป็นโมโม่
    if(!this.data.charProg)this.data.charProg={};
    if(this.data.coreStones){ let n=0; for(const k in this.data.coreStones)n+=Math.max(0,this.data.coreStones[k]||0); if(n)this.data.threads=(this.data.threads||0)+n*STONE_THREADS; this.data.coreStones={}; }   // v6.78 C1 refund
    if(this.data.setDeposit){ let n=0; for(const k in this.data.setDeposit)n+=Math.max(0,this.data.setDeposit[k]||0); if(n)this.data.threads=(this.data.threads||0)+n*10; this.data.setDeposit={}; }   // v6.79 D1 refund
    if(!this.data.bestiary)this.data.bestiary={};
    for(const it of (this.data.gearItems||[]))if(it&&it.favorite){it.locked=true;it.favorite=false;}   // v7.8.94 ★ Favorite รวมเข้า 🔒 Lock
    if(this.data.questClaimed){ if(!this.data.achievements)this.data.achievements={}; for(const q in this.data.questClaimed){ const a=QUEST_TO_ACH[q]; if(a&&this.data.questClaimed[q])this.data.achievements[a]=true; } delete this.data.questClaimed; }   // v7.8.88 Quests → Achievements (ไม่จ่ายซ้ำ)
    if(this.data.sugarOrder){ const o=this.data.sugarOrder; this.data.sugar=(this.data.sugar||0)+(o.cost||0); this.data.sugarOrder=null; }   // v6.78 C5: refund removed Sugar Orders
    // v4.12: bosses/minibosses แยกรายด่าน (boss0..5 / mini0..5) — เซฟเดิมนับรวมเป็น 'boss'/'mini' → ยกไป entry ด่าน 1
    if(this.data.bestiary.boss!=null){ this.data.bestiary.boss0=(this.data.bestiary.boss0||0)+this.data.bestiary.boss; delete this.data.bestiary.boss; }
    if(this.data.bestiary.mini!=null){ this.data.bestiary.mini0=(this.data.bestiary.mini0||0)+this.data.bestiary.mini; delete this.data.bestiary.mini; }
    if(!this.data.rankPerks)this.data.rankPerks={};
    if(!this.data._memory87){ this.data._memory87=1; let m=0; const B=this.data.bestiary||{}; for(const id in B){ const k=B[id]|0; (typeof bestiaryTiers==='function'?bestiaryTiers(id):[1,100,1000]).forEach((t,i)=>{ if(k>=t)m+=[1,2,4][i]||0; }); } if(m)this.data.memories=(this.data.memories|0)+m; }   // v8.1.87 Memory Book: จ่ายย้อนหลังตามขั้นที่ปลดแล้ว
    if(!this.data._reforge84){ this.data._reforge84=1; const c=this.data.currency||(this.data.currency={}); if((this.data.unlockedStage||0)>=1||Object.keys(this.data.stageMastery||{}).length){ c.berryjam=(Number(c.berryjam)||0)+4; c.honeydrop=(Number(c.honeydrop)||0)+2; c.starsugar=(Number(c.starsugar)||0)+1; c.recipeink=(Number(c.recipeink)||0)+1; } }   // v8.1.84 ของขวัญเริ่มระบบสกุลแถว (เซฟที่เล่นแล้ว)
    if(!this.data._inbox8254&&typeof GEAR_INBOX_ON!=='undefined'&&!GEAR_INBOX_ON){ this.data._inbox8254=1; const ib=Array.isArray(this.data.gearInbox)?this.data.gearInbox:[]; if(ib.length){ if(!Array.isArray(this.data.gearItems))this.data.gearItems=[]; for(const it of ib)if(it){ it.isNew=true; this.data.gearItems.push(it); } this.data.gearInbox=[]; } }   // v8.2.54 ECRS2 E1: ของค้างใน Inbox เข้ากระเป๋าครั้งเดียว
    if(!this.data._miners8254){ this.data._miners8254=1; const m=this.data.miners; if(m&&m.lv>0&&MINER_LEVELS[m.lv]){ const L=MINER_LEVELS[m.lv],h=Math.max(0,(Date.now()-(m.at||Date.now()))/3600000),st=Math.min(L.rate*L.cap,(m.store||0)+L.rate*h),n=Math.floor(st); if(n>0)this.data.threads=(this.data.threads||0)+n; const d=this.data; if(!d.exp||typeof d.exp!=='object')d.exp={s:1,k:0,best:1,crumbs:0,tap:1,help:{},at:Date.now(),farm:false,supply:null,daily:'',boss:{}}; d.exp.mb=Math.max(d.exp.mb||0,m.lv); m.lv=0; m.store=0; } }   // v8.2.54 ECRS2 E2: Mochi Miners เลิก (อัปไม่ได้แล้ว · ซ้ำ Expedition) → จ่ายด้ายที่ค้าง + เลเวลเดิมเป็นโบนัสคุกกี้ Expedition ถาวร (+10%/เลเวล)
    if(!this.data._cur8252){ this.data._cur8252=1; const c=this.data.currency||(this.data.currency={}); const n=(Number(c.berryjam)||0)+(Number(c.honeydrop)||0); if(n>0)c.transmute=(Number(c.transmute)||0)+n*2; delete c.berryjam; delete c.honeydrop; }   // v8.2.52 ECRS: Jam/Honey → Twist Cream ×2
    if(!this.data._glazeMig){ this.data._glazeMig=1; const c=this.data.currency||(this.data.currency={}),g=Math.max(0,Math.floor(Number(c.divine)||0)); if(g)c.transmute=(Number(c.transmute)||0)+g*3; delete c.divine; }   // v8.0.83 Crystal Glaze → Twist Cream ×3 ครั้งเดียว
    if(!this.data._rrMig){ this.data._rrMig=1; let th=0; for(const c of SPECIAL_CORES){ const n=Math.max(0,Math.min(3,Math.floor(Number((this.data.specialCores||{})[c.id])||0))); th+=c.base*n*(n+1)/2; } if(th>0)this.data.threads=(this.data.threads||0)+th; this.data.specialCores={}; if((this.data.rankPerks||{}).revive){ this.data.rankPick=Object.assign({},this.data.rankPick,{2:'revive'}); } this.data.rankPerks={}; }   // v8.0.22 Rank Rewards: คืน Thread ของ Special Cores · Rank Perk เดิม (Sugar/Box/Fortune → โบนัสอัตโนมัติ) · Revival Candle เดิมเลือกให้ที่ยศ 2
    for(const k in this.data.rankPerks){ if(!RANK_PERKS.some(p=>p.id===k))delete this.data.rankPerks[k]; }   // v7.8.101 perk ที่ถูกตัด (vigor/might/ironWill/reroll/banish) → คืนแต้ม RP
    if(!this.data.stageMastery)this.data.stageMastery={};
    if(!this.data.charUnlockNew)this.data.charUnlockNew={};
    if(this.unlockCoreCharacters(false))gearMigrated=true; // เซฟเก่าที่ผ่านด่านแล้วรับตัวละครโดยไม่ต้องซื้อซ้ำ
    // เซฟเดิมที่จบ Chapter 1 แล้วต้องเห็น Chapter 2 ทันทีหลังUpdates
    if(this.data.stageMastery[4])this.data.unlockedStage=Math.max(5,this.data.unlockedStage||0);
    if(!this.data.achievements)this.data.achievements={};
    if(!this.data.cookbook)this.data.cookbook={};   // สูตรที่เคยปรุงสำเร็จ (ถาวรข้ามรัน) → สมุดสูตร + รางวัล Sugar timesแรก
    if(this.data.shards){ this.data.threads=(this.data.threads||0)+this.data.shards; } this.data.shards=0;   // v7.8.88 Shards → Thread 1:1
    if(this.data.scrolls){ this.data.threads=(this.data.threads||0)+this.data.scrolls*SCROLL_THREADS; } this.data.scrolls=0;   // v7.8.88 Scrolls → Thread
    if(!this.data.gearAffix)this.data.gearAffix={};   // affix ต่อชิ้น (E: loot chase)
    if(!this.data.gearRarity)this.data.gearRarity={};   // rarity ที่คราฟต์ (common/magic/rare) ต่อชิ้น
    if(!this.data.currency)this.data.currency={};
    if(forgeMigrate(this.data))gearMigrated=true;
    if(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE&&!this.data.gearSimple1){ const c=this.data.currency; for(const k in GEAR_CUR_TO_CREAM){ const v=c[k]||0; if(v>0){ c.transmute=(c.transmute||0)+v*GEAR_CUR_TO_CREAM[k]; c[k]=0; } } for(const it of this.data.gearItems||[]){ try{ if(it&&it.grade!=='start'&&GEAR_ALL.some(b=>b.id===it.baseId&&b.tier!=='start'))gearFillLines(it); }catch(e){} } this.data.gearSimple1=1; gearMigrated=true; }
    if(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE&&!this.data.gearSimple2){ for(const it of this.data.gearItems||[]){ try{ if(it&&it.grade!=='start'&&gradeRank(gearGrade(it))>=gradeRank('legend'))gearFillLines(it); }catch(e){} } this.data.gearSimple2=1; gearMigrated=true; }   /* v8.3.36 Legend+ ได้แถวที่เพิ่มขึ้น */   /* v8.3.33 แปลงสกุลเงิน + เติม Mod ในแถวที่ว่าง (ครั้งเดียว) */   // v6.79 D3 merge old stock   // 🧪 currency คราฟต์ (Phase 2)
    if(this.data.ascension==null)this.data.ascension=0;
    if(!this.data.daily)this.data.daily={claimDay:'',streak:0,challengeDay:'',challengeDone:false};
    if(this.data.tutorialDone==null)this.data.tutorialDone=false;
    this.data.settings=Object.assign({},DEFAULT_SETTINGS,this.data.settings||{});
    if(!this.data.settingsHigh72){ this.data.settingsHigh72=1; Object.assign(this.data.settings,{vfx:2,quality:2,shake:2}); }   // v7.2 one-time move to new defaults
    if(!this.data.settingsAuto74){ this.data.settingsAuto74=1; this.data.settings.quality=0; }   // v7.4 Performance กลับเป็น Auto (High = DPR 3 กินหน่วยความจำกราฟิก)
    Sfx.muted=!this.data.settings.sound; applyVolSettings(this.data.settings);
    if(gearMigrated){ this.data.rev=(this.data.rev||0)+1; try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} }
    return this.data; },
  save(){ this.data.sugar=clampSugar(this.data.sugar);this.data.rev=(this.data.rev||0)+1;this.data.savedAt=Date.now();try{this.data.lastDev=Tele.id();}catch(e){} try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} if(typeof Cloud!=='undefined')Cloud.queuePush(this.data); },
  unlockCoreCharacters(notify=true){let changed=false;if(!Array.isArray(this.data.chars))this.data.chars=['momo'];
    if(typeof HEROES_ALL_OPEN!=='undefined'&&HEROES_ALL_OPEN){ for(const id of Object.keys(CORE_UNLOCK_STAGE))if(!this.data.chars.includes(id)){ this.data.chars.push(id); changed=true; } return changed; }   /* v8.3.39 เจ้าของ: ปลดทุกตัวตั้งแต่เริ่ม */
    for(const [id,stage] of Object.entries(CORE_UNLOCK_STAGE)){if(((this.data.stageMastery&&this.data.stageMastery[stage])||(this.data.unlockedStage||0)>stage)&&!this.data.chars.includes(id))   /* v8.2.15 เจ้าของ: ถึง C2-1 แล้วยังไม่ได้ Yuzu — เซฟเก่า/เซฟคลาวด์มี unlockedStage แต่ไม่มี stageMastery ของด่านนั้น → ผ่านด่านไปแล้ว (unlockedStage > ด่าน) ก็ปลดฮีโร่ (เดิมมีแค่ Sesame) */{this.data.chars.push(id);changed=true;if(notify)(this.data.charUnlockNew||(this.data.charUnlockNew={}))[id]=true;}}
    return changed;},
  // ---- Cloud sync (Supabase) ----
  async syncCloud(){ if(typeof Cloud==='undefined'||(typeof GM!=='undefined'&&GM.testing()))return; const ok=await Cloud.init(); if(!ok)return;
    const remote=await Cloud.pull();
    try{ if(Array.isArray(Cloud._remoteStats))Stats.merge(Cloud._remoteStats); Cloud.queueStats(); }catch(e){}   // v7.8.103 Play Stats ขึ้นคลาวด์ (รวมสองฝั่ง)
    if(remote&&typeof remote==='object'){
      /* v7.8.103 เจ้าของ: เตือนเมื่อเซฟในเครื่องกับบนคลาวด์ไม่ตรงกัน · base = rev ที่ซิงก์กันล่าสุด (ต่อบัญชี)
         ฝั่งเดียวเปลี่ยน = ซิงก์เงียบ · เปลี่ยนทั้งสองฝั่ง / เซฟจากเครื่องอื่น = ให้ผู้เล่นเลือก (ระหว่างนั้นไม่ push ทับ) */
      const lr=this.data.rev||0, rr=remote.rev||0, base=Cloud.base();
      let act;
      if(lr===rr)act='same';
      else if(base!=null)act=rr===base?'push':lr===base?'adopt':'ask';
      else if(this.isFreshSave())act='adopt';
      else if(!remote.lastDev||remote.lastDev===Tele.id())act=rr>lr?'adopt':'push';
      else act='ask';
      if(act==='same')Cloud.setBase(rr);
      else if(act==='push')Cloud.push(this.data);
      else if(act==='adopt'){ this.adoptCloud(remote); this._cloudAdopted=true; }
      else { this._cloudConflict={remote,lr,rr}; Cloud.hold=true; }
    } else { Cloud.push(this.data); }   // ยังไม่มีบนเมฆ = อัปเซฟปัจจุบันขึ้นไป
    this._cloudReady=true;
  },
  isFreshSave(){ const d=this.data,sm=d.stageMastery||{}; return !Object.values(sm).some(Boolean)&&!(d.rank>0)&&!(d.unlockedStage>0); },
  adoptCloud(remote){ try{ localStorage.setItem('mochi_save',JSON.stringify(remote)); }catch(e){} this.data=JSON.parse(JSON.stringify(SAVE_DEFAULTS)); this.load(); Cloud.setBase(remote.rev||0); },
  resolveCloud(useCloud){ const c=this._cloudConflict; if(!c)return; this._cloudConflict=null; Cloud.hold=false;
    if(useCloud){ this.adoptCloud(c.remote); this._cloudAdopted=true; }
    else { this.data.rev=Math.max(this.data.rev||0,c.rr||0)+1; try{ localStorage.setItem('mochi_save',JSON.stringify(this.data)); }catch(e){} Cloud.push(this.data); } },
  saveSummary(d){ d=d||{}; const sm=d.stageMastery||{},n=Object.values(sm).filter(Boolean).length,t=d.savedAt?new Date(d.savedAt):null,pad=x=>String(x).padStart(2,'0');
    return { stages:n, rank:d.rank||0, sugar:Math.floor(d.sugar||0), heroes:(d.chars||[]).length||1, gear:(d.gearItems||[]).length, when:t?(t.getDate()+'/'+(t.getMonth()+1)+' '+pad(t.getHours())+':'+pad(t.getMinutes())):'—' }; },
  addSugar(n){ this.data.sugar=clampSugar(clampSugar(this.data.sugar)+Number(n||0)); this.save(); if(Number(n)>0)(typeof DailyQ!=='undefined')&&DailyQ.tick('sugar',Math.floor(Number(n))); },
  // สมุดสูตร: บันทึกสูตรที่ปรุงสำเร็จถาวร · คืนรางวัล Sugar เฉพาะครั้งแรกที่ค้นพบ (0 = เคยมีแล้ว)
  discoverDish(key,sig){ if(!this.data.cookbook)this.data.cookbook={}; if(this.data.cookbook[key])return 0;
    this.data.cookbook[key]=1; const rew=sig?30:12; this.data.sugar=(this.data.sugar||0)+rew; this.save(); return rew; },
  spend(n){ if((this.data.sugar||0)>=n){ this.data.sugar-=n; this.save(); return true; } return false; },
  bazaarFreeRefresh(){ return this.data.bazaarFreeDay!==bazaarDaySeed(); },   // v8.0.25 รีเฟรชร้านฟรีวันละครั้ง
  bazaarRefreshCost(){ const day=bazaarDaySeed(),n=this.data.bazaarPaidDay===day?(this.data.bazaarPaidN||0):0;return n>=3?0:[60,120,240][n]; },
  refreshBazaar(){ if(this.bazaarFreeRefresh()){ this.data.bazaarFreeDay=bazaarDaySeed(); this.data.bazaarSeed=(this.data.bazaarSeed||0)+1; this.data.bazaarBought=[]; this.save(); return 'free'; } const cost=this.bazaarRefreshCost();if(!cost||(this.data.sugar||0)<cost)return false;
    const day=bazaarDaySeed();if(this.data.bazaarPaidDay!==day){this.data.bazaarPaidDay=day;this.data.bazaarPaidN=0;}
    this.data.sugar-=cost;this.data.bazaarPaidN++;this.data.bazaarSeed=(this.data.bazaarSeed||0)+1;this.data.bazaarBought=[];this.save();return cost; },
  // ความคืบหน้าตัวละคร (เลเวล/EXP/แต้มพรสวรรค์/ผังที่ลง)
  cp(id){ if(!this.data.talV2){ this.data.talV2=1; let any=0; for(const k in this.data.charProg||{}){ const c=this.data.charProg[k],t=c&&c.tal; if(!t)continue; for(const key of Object.keys(t)){ if(key.startsWith('b_')){ const r=t[key]||0; c.tp=(c.tp||0)+r*(r+1)/2; delete t[key]; if(r)any=1; } } } if(any)this.data.talRefundNote=1; this.save(); }
    /* v8.1.42 เจ้าของ: Sesame เปลี่ยนเป็นต้น Rune → คืนแต้ม Talent ของ Sesame ทั้งหมด (Core + สายเก่า) ครั้งเดียว */
    if(!this.data.sesTalV3){ this.data.sesTalV3=1; const c=this.data.charProg&&this.data.charProg.sesame; if(c&&c.tal){ const spent=talSpent(c.tal); if(spent>0){ c.tp=(c.tp||0)+spent; this.data.talRefundNote=1; } c.tal={}; } this.save(); }
    if(!this.data.charProg[id]) this.data.charProg[id]={ lvl:1, exp:0, tp:0, tal:{} }; return this.data.charProg[id]; },
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
  // v6.67: prefix/suffix gone → keep at most 3 mods per item (best tiers kept)
  migrateKitchen3(){ if(this.data.kitchen3)return; this.data.kitchen3=true; const rs=Array.isArray(this.data.frRecipes)?this.data.frRecipes:[],p=this.frParts();
    rs.forEach((r,i)=>{ if(!r)return; for(const k of ['t','e','m']){ if(r[k]&&(i>=FR_SLOT_MAX||(frPart(r[k])||{}).cut)){ p[r[k]]=(p[r[k]]||0)+1; r[k]=null; } } });
    this.data.frRecipes=rs.slice(0,FR_SLOT_MAX); if((this.data.frSlots||1)>FR_SLOT_MAX){ this.data.frSlots=FR_SLOT_MAX; this.data.frSlotRP=5; } },
  migrateModLines3(){ if(this.data.modLines3)return; const trim=it=>{ if(it&&Array.isArray(it.affixes)&&it.affixes.length>3)it.affixes=it.affixes.slice().sort((a,b)=>(a.t??10)-(b.t??10)).slice(0,3); };
    (this.data.gearItems||[]).forEach(trim); (this.data.gearInbox||[]).forEach(trim); const ga=this.data.gearAffix||{}; for(const k in ga){ if(Array.isArray(ga[k])&&ga[k].length>3){const o={affixes:ga[k]};trim(o);ga[k]=o.affixes;} } this.data.modLines3=true; },
  // v4.91: tier เดิม 1-5 → T0-T10 คำนวณจากค่าที่โรลไว้ (ค่า v ไม่เปลี่ยน)
  migrateAffixTiers11(){ const fix=list=>{ for(const it of (list||[])){ for(const a of ((it&&it.affixes)||[])){ if(a&&a.tierSchema!==2){ const d=affixDef(a.id); if(d){ a.t=affixTierForValue(d,a.v); a.t11=1;a.tierSchema=2; } } } } };
    fix(this.data.gearItems); fix(this.data.gearInbox);
    const ga=this.data.gearAffix||{}; for(const k in ga)fix([{affixes:ga[k]}]);
    /* v6.55.75: ยกค่า mod เก่าเข้าช่วง tier ใหม่ */ if(!this.data.affixLo3){ this.data.affixLo3=1; const up=list=>{ for(const it of (list||[])){ for(const a of ((it&&it.affixes)||[])){ const d=a&&affixDef(a.id),tr=d&&d.tiers&&d.tiers[Math.min(d.tiers.length-1,a.t||0)]; if(tr&&((a.v||0)<tr[0]||(a.v||0)>tr[1]))a.v=Math.round((tr[0]+tr[1])/2); } } }; up(this.data.gearItems); up(this.data.gearInbox); for(const k in ga)up([{affixes:ga[k]}]); } },
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
    if(!Number.isFinite(this.data.gearInventoryCap)||this.data.gearInventoryCap<100){this.data.gearInventoryCap=100;changed=true;}
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
  gearItemsForSlot(slot){ const rank={divine:7,ancient:6,mythic:5,legend:4,epic:3,rare:2,common:1,start:0},equipped=this.data.equippedGear||{};
    return (this.data.gearItems||[]).filter(x=>x&&(!slot||x.slot===slot)).slice().sort((a,b)=>{
      const ae=Object.values(equipped).includes(a.uid)?1:0,be=Object.values(equipped).includes(b.uid)?1:0;
      return (Number(b.isNew)-Number(a.isNew))||((b.craftedAt||0)-(a.craftedAt||0))||(Number(b.favorite)-Number(a.favorite))||(be-ae)||((rank[b.grade]||0)-(rank[a.grade]||0))||((b.acquiredAt||0)-(a.acquiredAt||0)); }); },
  gearInventoryItems(slot){ const equipped=new Set(Object.values(this.data.equippedGear||{})); return this.gearItemsForSlot(slot).filter(x=>!equipped.has(x.uid)); },
  gearInventoryCount(){ return this.gearInventoryItems().length; },
  gearInventoryFull(){ return this.gearInventoryCount()>=(this.data.gearInventoryCap||100); },
  gearInboxItems(){return Array.isArray(this.data.gearInbox)?this.data.gearInbox:[];},
  gearInboxCount(){return this.gearInboxItems().length;},
  gearInboxItem(uid){return this.gearInboxItems().find(x=>x&&x.uid===uid)||null;},
  receiveGearInstance(baseId,opts={}){const item=this.makeGearInstance(baseId,opts);if(!item)return null;
    if(!Array.isArray(this.data.gearItems))this.data.gearItems=[];if(!Array.isArray(this.data.gearInbox))this.data.gearInbox=[];
    if(!this.data.ownedGear.includes(baseId))this.data.ownedGear.push(baseId);
    const mode=this.data.gearAutoDismantle||'off',protectedItem=!!item.favorite||!!item.locked||gradeRank(item.grade)>=3;let auto=!protectedItem&&((mode==='common'&&item.grade==='common')||(mode==='rare'&&(item.grade==='common'||item.grade==='rare')));
    if(auto&&this.data.gearAutoKeepUp!==false&&gearPowerDelta(item)>0)auto=false;   // v6.55.35 เก็บชิ้นที่ดีกว่าของที่สวม
    if(auto){if(this.data.gearAutoOut==='sell'){const sugar=gearSellSugar(item);this.addSugar?this.addSugar(sugar):(this.data.sugar=(this.data.sugar||0)+sugar);this.save();return{item,destination:'salvaged',sugar};}const shards=gearDismantleValue(item);this.data.threads=(this.data.threads||0)+shards;this.save();return{item,destination:'salvaged',shards};}
    if(this.gearInventoryFull()){
      if(auto){const shards=gearDismantleValue(item);this.data.threads=(this.data.threads||0)+shards;this.save();return{item,destination:'salvaged',shards};}
      if(typeof GEAR_INBOX_ON!=='undefined'&&!GEAR_INBOX_ON){ if(protectedItem){ this.data.gearItems.push(item);this.save();return{item,destination:'bag',overCap:true}; } const sh=gearDismantleValue(item);this.data.threads=(this.data.threads||0)+sh;this.save();return{item,destination:'salvaged',shards:sh}; }
      if(this.data.gearInbox.length<GEAR_INBOX_CAP){this.data.gearInbox.push(item);this.save();return{item,destination:'inbox'};}
      if(protectedItem){const idx=this.data.gearInbox.findIndex(x=>x&&!x.favorite&&!x.locked&&(x.grade==='common'||x.grade==='rare'));
        let displacedShards=0;if(idx>=0){const old=this.data.gearInbox.splice(idx,1)[0];displacedShards=gearDismantleValue(old);this.data.threads=(this.data.threads||0)+displacedShards;}
        this.data.gearInbox.push(item);this.save();return{item,destination:'inbox',overflow:idx<0,displacedShards};}
      const shards=gearDismantleValue(item);this.data.threads=(this.data.threads||0)+shards;this.save();return{item,destination:'salvaged',shards};
    }
    this.data.gearItems.push(item);this.save();return{item,destination:'bag'};},
  drainGearInbox(){ let n=0; for(const it of (this.data.gearInbox||[]).slice()){ if(this.gearInventoryFull())break; if(it&&this.claimGearInbox(it.uid))n++; } return n; },   // v7.9.4 E2 มีที่ว่างในกระเป๋า → ของใน Inbox เข้ากระเป๋าเอง
  claimGearInbox(uid){const item=this.gearInboxItem(uid);if(!item||this.gearInventoryFull())return false;this.data.gearInbox=this.data.gearInbox.filter(x=>x&&x.uid!==uid);item.isNew=true;this.data.gearItems.push(item);this.save();return true;},
  setGearAutoDismantle(mode){this.data.gearAutoDismantle=['off','common','rare'].includes(mode)?mode:'off';this.save();return this.data.gearAutoDismantle;},
  equipGearInstance(slot,uid){ const item=this.gearItem(uid); if(!item||item.slot!==slot)return false;
    this.data.equippedGear[slot]=item.uid; this.data.gear[slot]=item.baseId; item.isNew=false; this.save(); return true; },
  removeGearInstance(uid){ const item=this.gearItem(uid); if(!item||item.locked||item.favorite||this.isGearEquipped(uid))return false;
    this.data.gearItems=this.data.gearItems.filter(x=>x.uid!==uid); this.save(); return true; },
  dismantleGearInbox(uid){const item=this.gearInboxItem(uid);if(!item||item.locked||item.forgeChoice||item.favorite||gradeRank(item.grade)>=3||item.grade==='start')return 0;const shards=gearDismantleValue(item);this.data.gearInbox=this.data.gearInbox.filter(x=>x&&x.uid!==uid);this.data.threads=(this.data.threads||0)+shards;this.save();(typeof DailyQ!=='undefined')&&DailyQ.tick('shards',shards);return shards;},
  markGearSeen(uid){ const item=this.gearItem(uid); if(!item)return false; if(item.isNew){item.isNew=false;this.save();} return true; },
  toggleGearFavorite(uid){ const item=this.gearItem(uid); if(!item)return false; item.favorite=!item.favorite; this.save(); return item.favorite; },
  toggleGearLock(uid){ const item=this.gearItem(uid); if(!item)return false; item.locked=!item.locked; this.save(); return item.locked; },
  gearLv(ref){ const item=this.gearItem(ref); if(item)return gearEffectiveEnhance(item); const id=(this.gearBase(ref)||{}).id||ref; return (this.data.gearLv&&this.data.gearLv[id])||0; },
  gearReviveCount(){ let n=0; for(const slot in GEAR){ const it=GEAR[slot].find(g=>g.id===this.data.gear[slot]); if(it&&it.fx==='revive')n++; } return n; },   // อุปกรณ์ตำนานคืนชีพที่สวมอยู่
  // 🔩 เศษอุปกรณ์: ได้จากของซ้ำ · ใช้หลอมของตำนาน
  spendShards(n){ return this.spendThreads(n); },
  // affix ต่อ instance; legacy maps are mirrored for compatibility with the current UI.
  ensureAffix(ref,tier){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref,t=base?base.tier:tier;
    if(item){ if(!Array.isArray(item.affixes)){item.affixes=rollAffixes(t,item.itemLevel||1,base);this.save();} return gearActiveAffixes(item); }
    if(!this.data.gearAffix)this.data.gearAffix={}; if(!this.data.gearAffix[id]){this.data.gearAffix[id]=rollAffixes(t,1,base);this.save();} return this.data.gearAffix[id]; },
  // craft state (common/magic/rare internally) per instance
  gearRarity(ref,baseTier){ const item=this.gearItem(ref); if(item)return item.craftState||baseDefaultRarity(item.grade||baseTier); const id=(this.gearBase(ref)||{}).id||ref; return (this.data.gearRarity&&this.data.gearRarity[id])||baseDefaultRarity(baseTier); },
  // 🧪 currency
  currency(k){ k=curKey(k); return (this.data.currency&&this.data.currency[k])||0; },
  addCurrency(k,n){ k=curKey(k); if(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE&&GEAR_CUR_TO_CREAM[k]){ n=n*GEAR_CUR_TO_CREAM[k]; k='transmute'; }   /* v8.3.33 Star Sugar/Recipe Ink → Twist Cream */ if(!this.data.currency)this.data.currency={}; this.data.currency[k]=(this.data.currency[k]||0)+n; this.save(); },
  spendCurrency(k,n){ k=curKey(k); if((this.currency(k))>=n){ this.data.currency[k]-=n; this.save(); return true; } return false; },
  enhance(ref){ const item=this.gearItem(ref),base=this.gearBase(ref),id=base?base.id:ref,lv=this.gearLv(ref);
    if(!item||!base||!base.enh||lv>=gearEnhanceCap(item))return {result:'capped',lv,cap:gearEnhanceCap(item)};
    const o=enhanceOdds(lv),r=Math.random(); let result; this.data.enhDone=1;   // v8.0.87 เจ้าของ: คำแนะนำตีบวกจบหลังตีครั้งแรก
    if(r<o.destroy)result='destroy'; else if(r<o.destroy+o.brk)result='break'; else result='success';
    if(result==='success'){ const n=lv+1; if(item)item.enhanceLv=n; this.data.gearLv[id]=n; this.save(); return {result,lv:n}; }
    if(result==='break'){ const n=Math.max(3,lv-1); if(item)item.enhanceLv=n; this.data.gearLv[id]=n; this.save(); return {result,lv:n}; }
    // destroy: ปลดออกจากช่องถ้าใส่อยู่ แล้วลบไอเทมทิ้ง
    if(item){ for(const s in this.data.equippedGear){ if(this.data.equippedGear[s]===item.uid){ delete this.data.equippedGear[s]; if(this.data.gear)delete this.data.gear[s]; } } this.data.gearItems=(this.data.gearItems||[]).filter(x=>x&&x.uid!==item.uid); }
    this.data.gearLv[id]=0; this.save(); return {result:'destroy',lv:0}; },
  // v7.8.84 เจ้าของ: รวม Sell+Dismantle เป็น Salvage ปุ่มเดียว — ได้ทั้ง 🔩 Shard และ 🍬 Sugar
  // v8.0.32 รวมของ: หลัก + 2 ชิ้นช่อง/ระดับเดียวกัน (ไม่ได้สวม/ล็อก) → ระดับ +1 · iLv/ตีบวก = สูงสุด · เลือกย้าย mod จากของที่ใช้รวมได้ 1 อันลงช่องว่าง
  mergeCanMain(item){const b=item&&GEAR_ALL.find(g=>g.id===item.baseId);return !!(b&&b.tier!=='start'&&!item.forgeChoice&&GRADE_NEXT[gearGrade(item)]&&(this.data.gearItems||[]).includes(item));},
  mergeFodder(main){if(!this.mergeCanMain(main))return [];const g=gearGrade(main);return (this.data.gearItems||[]).filter(x=>x&&x!==main&&x.slot===main.slot&&gearGrade(x)===g&&!x.locked&&!x.favorite&&!x.forgeChoice&&!this.isGearEquipped(x.uid)&&GEAR_ALL.some(b=>b.id===x.baseId&&b.tier!=='start'))
    .sort((a,b)=>((a.itemLevel||1)-(b.itemLevel||1))||((a.enhanceLv||0)-(b.enhanceLv||0))||((a.affixes||[]).length-(b.affixes||[]).length));},
  mergeCarryOptions(main,fod){if(!main||(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE))return [];const res={baseId:main.baseId,slot:main.slot,grade:GRADE_NEXT[gearGrade(main)]||gearGrade(main),itemLevel:Math.max(main.itemLevel||1,...fod.map(f=>f.itemLevel||1)),affixes:main.affixes},cur=forgeLines(main),out=[];
    const free=forgeLines(res).map((_,i)=>i).find(i=>!cur[i]&&forgeLineOpen(res,i));if(free==null)return [];for(const f of fod){forgeLines(f).forEach(a=>{const d=a&&affixDef(a.id);if(d&&!d.bad&&(!d.slots||d.slots.includes(main.slot)))out.push({uid:f.uid,id:a.id,line:free,a});});}   // v8.0.87 ไม่แบ่งหมวด: ย้ายไปแถวว่างแรก
    return out.sort((x,y)=>(x.a.t??10)-(y.a.t??10));},
  mergeGear(mainUid,fUids,carry){const main=this.gearItem(mainUid);if(!this.mergeCanMain(main)||!Array.isArray(fUids)||fUids.length!==2||fUids[0]===fUids[1])return null;const ok=this.mergeFodder(main),fod=fUids.map(u=>ok.find(x=>x.uid===u));if(fod.some(x=>!x))return null;
    const pick=carry&&this.mergeCarryOptions(main,fod).find(o=>o.uid===carry.uid&&o.id===carry.id),from=gearGrade(main);
    const GS=typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE,all=[main,...fod],newLv=Math.max(...all.map(x=>x.enhanceLv||0));let refund=null; if(GS){ const spent=all.reduce((o,x)=>{const t=gearUpTotal(x.enhanceLv||0);o.sugar+=t.sugar;o.cream+=t.cream;return o;},{sugar:0,cream:0}),keep=gearUpTotal(newLv); refund={sugar:Math.max(0,spent.sugar-keep.sugar),cream:Math.max(0,spent.cream-keep.cream)}; }   /* v8.3.36 เจ้าของ: คืน Sugar + Twist Cream ที่ใช้อัปชิ้นรอง 100% (เลเวลที่เก็บไว้ไม่คืน) */
    main.grade=GRADE_NEXT[from];delete main.crafts;delete main.forgeOffers;main.itemLevel=Math.max(main.itemLevel||1,...fod.map(f=>f.itemLevel||1));main.enhanceLv=newLv;
    if(pick){const ls=forgeLines(main);ls[pick.line]=Object.assign({},pick.a);forgeSetLines(main,ls);} if(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE)gearFillLines(main);   /* v8.3.33 ระดับใหม่ = Mod แถวใหม่สุ่มให้ */
    const gone=new Set(fUids);this.data.gearItems=this.data.gearItems.filter(x=>!gone.has(x.uid));this.data.merges=(this.data.merges||0)+1; if(refund){ if(refund.sugar)this.data.sugar=clampSugar((this.data.sugar||0)+refund.sugar); if(refund.cream){ const c=this.data.currency||(this.data.currency={}); c.transmute=(c.transmute||0)+refund.cream; } } this.save();return {item:main,from,to:main.grade,carried:pick?pick.id:null,refund};},
  // v8.3.33 รวมอัตโนมัติ: ช่องเดียวกัน ระดับเดียวกัน ทีละ 3 ชิ้น (ตัวหลัก = ชิ้นที่สวมอยู่ หรือ iLv/เลเวลสูงสุด) · ไม่แตะของที่ล็อก/ชอบ/สวม (ยกเว้นเป็นตัวหลัก)
  autoMergeAll(){let n=0,guard=0;this._lastAutoRefund={sugar:0,cream:0};const items=()=>this.data.gearItems||[];
    for(const g of GRADE_ORDER){if(!GRADE_NEXT[g])continue;for(const slot of GEAR_SLOTS.map(x=>x.slot)){while(guard++<400){const pool=items().filter(x=>x&&x.slot===slot&&gearGrade(x)===g&&this.mergeCanMain(x));if(!pool.length)break;
      const main=pool.find(x=>this.isGearEquipped(x.uid))||pool.filter(x=>!x.locked&&!x.favorite).sort((a,b)=>((b.itemLevel||1)-(a.itemLevel||1))||((b.enhanceLv||0)-(a.enhanceLv||0)))[0]||pool[0],fod=this.mergeFodder(main);if(fod.length<2)break;
      const r=this.mergeGear(main.uid,[fod[0].uid,fod[1].uid],null);if(!r)break;n++;if(r.refund){this._lastAutoRefund.sugar+=r.refund.sugar;this._lastAutoRefund.cream+=r.refund.cream;}}}}
    return n;},
  salvageGearInstance(uid){const item=this.gearItem(uid);if(!item||item.locked||item.forgeChoice||item.favorite||item.grade==='start'||this.isGearEquipped(uid))return null;const shards=gearDismantleValue(item),sugar=gearSellSugar(item);this.data.gearItems=this.data.gearItems.filter(x=>x&&x.uid!==uid);this.data.threads=(this.data.threads||0)+shards;this.data.sugar=(this.data.sugar||0)+sugar;this.save();(typeof DailyQ!=='undefined')&&DailyQ.tick('shards',shards);return {shards,sugar};},
  // ระบบยศ (prestige loop): rank ถาวร + เลเวลWaitบปัจจุบัน (0..TAL_MAX)
  talLvl(k){ return this.data.upgrades[k]||0; },
  talTotal(k){ return (this.data.rank||0)*TAL_MAX + this.talLvl(k); },   // v7.8.87 Overcap ตัดแล้ว (ไม่มีที่เขียนค่า)
  frParts(){ if(!this.data.fparts)this.data.fparts={}; if(!this.data.fpartsGift){ this.data.fpartsGift=true; for(const k of ['t:dash','t:kill10','e:shock','e:heal','m:big'])this.data.fparts[k]=(this.data.fparts[k]||0)+1; } return this.data.fparts; },   // v5.35 ของขวัญเริ่มต้น
  frAddPart(k,n){ const p=this.frParts(); p[k]=(p[k]||0)+(n||1); this.save(); },
  frPartCount(k){ return this.frParts()[k]||0; },
  frSlotCost(){ return this.frSlots()+1; },   // v5.38 ปลดช่องที่ 2..5 = 2..5 RP
  frUnlockSlot(){ if(this.frSlots()>=FR_SLOT_MAX||this.rankPointsFree()<this.frSlotCost())return false; this.data.frSlotRP=(this.data.frSlotRP||0)+this.frSlotCost(); this.data.frSlots=this.frSlots()+1; this.save(); return true; },
  frLv(k){ return Math.max(1,(this.data.fpLv||{})[k]||1); },
  frMerge(k){ if(this.frPartCount(k)<FR_MERGE_N||this.frLv(k)>=FR_LV_MAX)return false; this.data.fparts[k]-=FR_MERGE_N-1; if(!this.data.fpLv)this.data.fpLv={}; this.data.fpLv[k]=this.frLv(k)+1; this.save(); return true; },   // 3 ชิ้นซ้ำ → เหลือ 1 ชิ้น + เลเวลของชนิดนั้นถาวร
  frSlots(){ return Math.max(1,Math.min(FR_SLOT_MAX,this.data.frSlots||1)); },
  frRecipes(){ if(!Array.isArray(this.data.frRecipes))this.data.frRecipes=[]; while(this.data.frRecipes.length<FR_SLOT_MAX)this.data.frRecipes.push({t:null,e:null,m:null}); return this.data.frRecipes; },
  // ใส่ชิ้นส่วนลงช่อง: ใช้ของในถุง 1 ชิ้น (ชิ้นเดิมในช่องคืนเข้าถุง) · เกินเพดานรสชาติ = ไม่ได้
  frPlace(slot,key){ if(slot>=this.frSlots()||!frPart(key)||this.frPartCount(key)<1)return false; const r=this.frRecipes()[slot],k=key[0],nr=Object.assign({},r,{[k]:key});
    if(frCost(nr)>FR_FLAVOR_CAP)return false; if(r[k]){ if((this.data.sugar||0)<FR_SWAP_SUGAR)return 'sugar'; this.data.sugar-=FR_SWAP_SUGAR; } const p=this.frParts(); if(r[k])p[r[k]]=(p[r[k]]||0)+1; p[key]-=1; r[k]=key; this.save(); return true; },
  frRemove(slot,k){ const r=this.frRecipes()[slot]; if(!r||!r[k])return false; if((this.data.sugar||0)<FR_SWAP_SUGAR)return 'sugar'; this.data.sugar-=FR_SWAP_SUGAR; this.frAddPart(r[k],1); r[k]=null; this.save(); return true; },
  frResetRecipes(){ const rs=this.frRecipes();if(!rs.some(r=>r.t||r.e||r.m)||this.threads()<this.kitchenResetCost())return false;
    this.data.threads-=this.kitchenResetCost();const p=this.frParts();for(const r of rs){for(const k of ['t','e','m']){if(r[k]){p[r[k]]=(p[r[k]]||0)+1;r[k]=null;}}}this.save();return true; },
  ancientHas(id){ return false; },   /* v8.3.15 เจ้าของ: เอา Ancient Perks ออกจากเกม (ไม่มีผล · ไม่คืน Thread · ข้อมูลเซฟเดิมเก็บไว้เฉย ๆ) */
  unlockAncient(id){ if(this.ancientHas(id)||!ANCIENT_PERKS.find(p=>p.id===id)||!this.spendThreads(ANCIENT_THREAD_COST))return false; if(!this.data.ancient)this.data.ancient={}; this.data.ancient[id]=1; this.save(); return true; },
  // v8.0.22 Special Cores ซื้อไม่ได้แล้ว (คืน Thread ตอนโหลดเซฟ · ดู _rrMig)
  talCost(k){ const lvl=this.talLvl(k), rank=this.data.rank||0; return Math.round(UPGRADES[k].base*WEAVE_COST_MUL*Math.pow(WEAVE_LV_GROWTH,lvl)*(1+rank)*Math.pow(1.25,rank)); },   // v6.90 เจ้าของ: แพงขึ้นทั้งหมด ×3 + โตตามเลเวล ×1.8/ขั้น (เดิม ×(lvl+1))   // v6.68: 1.15→1.25 per rank (Sugar upgrades nerfed)   // 🍬 Sugar · v6.55.28: (1+rank)×1.15^rank (เดิม 1+0.8·rank) ยศ 5 รวม ×1.7, ยศ 10 ×2.9
  talCanBuy(k){ return this.talLvl(k)<TAL_MAX&&(this.data.sugar||0)>=this.talCost(k); },
  promoteThreadCost(){ const rank=this.data.rank||0;return 8+4*rank+2*rank*rank; },
  perkResetCost(){ return 6+3*(this.data.rank||0); },
  kitchenResetCost(){ return 5+2*(this.data.rank||0); },
  threads(){ return this.data.threads||0; },
  addThreads(n){ this.data.threads=this.threads()+n; this.save(); },
  /* v8.2.55 🍭 Lollipops = สกุลเงินจริง · ได้จาก IAP/Pass เท่านั้น · ใช้ได้แค่ของแต่งตัว (Cos.buy/buySkin) · ห้ามแปลงเป็นอย่างอื่น */
  lollipops(){ return Math.max(0,this.data.lollipops||0); },
  addLollipops(n){ this.data.lollipops=this.lollipops()+Math.max(0,n|0); this.save(); },
  spendLollipops(n){ if(this.lollipops()<n)return false; this.data.lollipops-=n; this.save(); return true; },
  miners(){ if(!this.data.miners)this.data.miners={lv:0,at:Date.now(),store:0}; return this.data.miners; },
  minersTick(){ const m=this.miners(),now=Date.now(); if(!m.lv){m.at=now;return m;} if(now<m.at){m.at=now;return m;} const L=MINER_LEVELS[m.lv],h=(now-m.at)/3600000; m.store=Math.min(L.rate*L.cap,(m.store||0)+L.rate*h); m.at=now; return m; },
  minersReady(){ const m=this.minersTick(); return m.lv>0&&m.store>=MINER_LEVELS[m.lv].rate*MINER_LEVELS[m.lv].cap*0.5; },
  minersCollect(){ const m=this.minersTick(),n=Math.floor(m.store||0); if(n<1)return 0; m.store-=n; this.addThreads(n); return n; },
  minersUpgrade(){ const m=this.minersTick(),nx=MINER_LEVELS[m.lv+1]; if(!nx||(this.data.sugar||0)<nx.cost)return false; this.data.sugar-=nx.cost; m.lv++; this.save(); return true; },
  spendThreads(n){ if(this.threads()<n)return false; this.data.threads-=n; this.save(); return true; },
  talAllMax(){ return UPG_ORDER.every(k=>this.talLvl(k)>=TAL_MAX); },
  talFilled(){ let t=0; for(const k of UPG_ORDER) t+=this.talLvl(k); return t; },   // ความคืบหน้าWaitบนี้
  buyTal(k){ if(this.talLvl(k)>=TAL_MAX)return false; if(!this.talCanBuy(k))return false; this.data.sugar-=this.talCost(k);
    this.data.upgrades[k]=this.talLvl(k)+1; this.save(); return true; },
  promote(){ if(!this.talAllMax()||this.threads()<this.promoteThreadCost())return 0; const rank=this.data.rank||0; const rew=promoteReward(rank);
    this.data.threads-=this.promoteThreadCost();
    this.data.rank=rank+1; for(const k of UPG_ORDER) this.data.upgrades[k]=0;
    this.data.sugar=(this.data.sugar||0)+rew; this.save(); return rew; },
  // ---- Rank Perks (RP = rank ทั้งหมด · ใช้ไปตามที่ลง perk) ----
  perkLvl(id){ return (this.data.rankPerks||{})[id]||0; },
  rankPick(r){ return (this.data.rankPick||{})[r]||null; },
  rankHas(id){ const row=RANK_REWARDS.find(x=>x.opts.some(o=>o.id===id)); return !!row&&(this.data.rank||0)>=row.r&&this.rankPick(row.r)===id; },
  setRankPick(r,id){ const row=RANK_REWARDS.find(x=>x.r===r); if(!row||(this.data.rank||0)<r||!row.opts.some(o=>o.id===id))return false; if(!this.data.rankPick)this.data.rankPick={}; this.data.rankPick[r]=id; this.save(); return true; },
  rankUnpicked(){ return RANK_REWARDS.filter(x=>(this.data.rank||0)>=x.r&&!this.rankPick(x.r)).length; },
  rankPointsTotal(){ return this.data.rank||0; },
  rankPointsSpent(){ let s=(this.data.frSlotRP||0); const rp=this.data.rankPerks||{}; for(const k in rp)s+=rp[k]||0; return s; },   // v5.38 +RP ที่ใช้ปลดช่องสูตร
  rankPointsFree(){ return this.rankPointsTotal()-this.rankPointsSpent(); },
  perkTierSpent(tier){ let s=0; for(const pk of RANK_PERKS){ if((pk.tier||1)===tier)s+=this.perkLvl(pk.id); } return s; },
  perkTierUnlocked(tier){ if((tier||1)<=1)return true; if(tier===2)return this.perkTierSpent(1)>=PERK_TIER_REQ[2]; return (this.perkTierSpent(1)+this.perkTierSpent(2))>=PERK_TIER_REQ[3]; },
  buyPerk(id){ const def=RANK_PERKS.find(p=>p.id===id); if(!def)return false; if(this.perkLvl(id)>=def.max)return false; if(this.rankPointsFree()<=0)return false; if(!this.perkTierUnlocked(def.tier||1))return false;
    if(!this.data.rankPerks)this.data.rankPerks={}; this.data.rankPerks[id]=this.perkLvl(id)+1; this.save(); return true; },
  respecPerks(){ if(!Object.values(this.data.rankPerks||{}).some(Boolean)||this.threads()<this.perkResetCost())return false;this.data.threads-=this.perkResetCost();this.data.rankPerks={};this.save();return true; },
  // ---- v5.27 Temple Depths ----
  dig(){ if(!this.data.threadsGift){ this.data.threadsGift=true; this.data.threads=(this.data.threads||0)+40; }   // v5.33 ของขวัญด้ายเริ่มต้น
    if(!this.data.dig)this.data.dig={shovels:0,depth:1,best:1}; return this.data.dig; },   /* v8.2.36 E1: เหลือแค่ข้อมูลเซฟเดิม (Expedition ย้ายพลั่ว → Crumbs) */
  addShovels(n){ if(typeof EXP_ON!=='undefined'&&EXP_ON){ this.addCrumbs((n||0)*SHOVEL_CRUMBS); return; } const d=this.dig(); d.shovels=(d.shovels||0)+n; this.save(); },   /* v8.2.32 Dig เลิกใช้: พลั่ว → Crumbs */
  exp(){ const d=this.data; if(!d.exp||typeof d.exp!=='object')d.exp={s:1,k:0,best:1,crumbs:0,tap:1,help:{},at:Date.now(),farm:false,supply:null,daily:'',boss:{}}; const e=d.exp; if(!e.help)e.help={}; if(!e.boss)e.boss={};
    if(!e.mig){ e.mig=1; const dg=d.dig; if(dg&&dg.shovels>0){ e.crumbs+=dg.shovels*SHOVEL_CRUMBS; dg.shovels=0; } try{ if(this.minersCollect)this.minersCollect(); }catch(err){} }   /* ย้ายของเดิม: พลั่ว → Crumbs · ด้ายที่คนงานเก็บไว้ → รับเลย */
    return e; },
  addCrumbs(n){ if(typeof GARDEN_ON!=='undefined'&&GARDEN_ON){ this.addSugar(Math.max(0,Math.floor(n||0))); return; }   /* v8.3.34 Expedition ปิด → Crumbs = Sugar */ const e=this.exp(); e.crumbs=(e.crumbs||0)+Math.max(0,n||0); this.save(); },
  /* v8.2.62 จุดแดง Expedition: ไม่ได้เข้า ≥1 ชม. (มีของออฟไลน์รอ) หรือ Crumbs พออัปเกรด · แทน Daily chest ที่เลิกไป */
  garden(){ const d=this.data; if(!d.garden||typeof d.garden!=='object')d.garden={trips:{},camp:{},help:{},slots:{},cards:[]}; const g=d.garden; for(const k of ['trips','camp','help','slots'])if(!g[k]||typeof g[k]!=='object')g[k]={}; if(!Array.isArray(g.cards))g.cards=[]; return g; },   /* v8.3.34 Mochi Garden */
  gardenMigrate(){ const d=this.data; if(d.gardenMig1)return; d.gardenMig1=1; const e=d.exp; if(e&&e.crumbs>0){ d.sugar=clampSugar((d.sugar||0)+Math.floor(e.crumbs)); e.crumbs=0; } this.save(); },   /* v8.3.34 Crumbs → Sugar 1:1 */
  gardenHelpersOwned(){ const n=Math.min(GARDEN_HELPERS.length,typeof storyCleared==='function'?storyCleared():0); return GARDEN_HELPERS.slice(0,n); },
  gardenTripLeft(z){ const t=this.garden().trips[z]; if(!t)return null; const now=Date.now(); if(now<t.start)t.start=now; return Math.max(0,t.start+t.h*3600e3-now); },
  gardenReady(){ try{ if(typeof GARDEN_ON==='undefined'||!GARDEN_ON||(typeof featureOpen==='function'&&!featureOpen('dig')))return false; const g=this.garden(); return GARDEN_ZONES.some(z=>g.trips[z.id]&&this.gardenTripLeft(z.id)===0)||GARDEN_ZONES.some(z=>storyCleared()>=z.open&&!g.trips[z.id]); }catch(e){ return false; } },
  expReady(){ if(typeof GARDEN_ON!=='undefined'&&GARDEN_ON)return this.gardenReady(); try{ if(typeof featureOpen==='function'&&!featureOpen('dig'))return false; const e=this.exp(); if(Date.now()-(e.at||0)>=3600e3)return true; if(e.crumbs>=expTapCost(e.tap||1))return true; const own=new Set((this.data.chars||[]).concat(this.data.character||'momo')); return EXP_HELPERS.some(h=>(h.id==='ruby'||own.has(h.id))&&e.crumbs>=expHelpCost(h,e.help[h.id]|0)); }catch(err){ return false; } },
  expDailyReady(){ if(typeof EXP_DAILY_ON!=='undefined'&&!EXP_DAILY_ON)return false; const e=this.exp(); return e.daily!==localDayKey(); },
  endgameUnlocked(){ return (this.data.ascension||0)>0||storyComplete(); },
  // Zone Modifiers ปลดล็อกเมื่อผ่านบอสจบ Chapter 1 (ด่าน 5 · index 4) = ผู้เล่นเรียนรู้เกมแล้ว
  zoneModsUnlocked(){ return false; },   // v6.80 E2: Zone Modifiers removed
  zoneMods(){ return Array.isArray(this.data.zoneMods)?this.data.zoneMods:[]; },
  power(id){ return heroPower(id||this.data.character||'momo',null); },   // v6.55.29: จากสแตตจริง (เดิมแต้มนับเลเวล/ยศ/ไอเทม)
  reset(){ try{ localStorage.removeItem('mochi_save'); }catch(e){}
    this.data={ sugar:0, unlockedStage:0, upgrades:{}, gear:{}, gearLv:{}, ownedGear:[], gearItems:[], equippedGear:{}, gearInventoryCap:100, gearInbox:[], gearAutoDismantle:'off', gearSchemaVersion:0, gearUidSeq:0, character:'momo', chars:[], charProg:{}, rank:0, ascension:0, endlessBest:0, endlessBoard:[], bestiary:{}, stageMastery:{}, achievements:{}, daily:{claimDay:'',streak:0,challengeDay:'',challengeDone:false}, tutorialDone:false, settings:Object.assign({},DEFAULT_SETTINGS) }; this.load(); },
  // ---- Bestiary (Monster Card) ----
  kills(type){ return (this.data.bestiary&&this.data.bestiary[type])||0; },
  addKill(type){ if(!this.data.bestiary)this.data.bestiary={};
    const before=this.data.bestiary[type]||0, after=before+1;
    this.data.bestiary[type]=after;
    // ปลดขั้น Bestiary = รับ Sugar (แทนที่โบนัสสแตตเดิม) — คืนจำนวน Sugar ที่ได้ให้ผู้เรียกโชว์ป้าย
    let sugar=0;
    let mem=0; bestiaryTiers(type).forEach((t,i)=>{ if(before<t&&after>=t){ sugar+=BEST_TIER_SUGAR[i]||0; mem+=(typeof MEMORY_TIER!=='undefined'&&MEMORY_TIER[i])||0; } }); if(mem){ this.data.memories=(this.data.memories|0)+mem; try{ Sfx.menuCue?.('ui_memory_gain',.35,2); }catch(e){} }   // v8.1.87 Memory Book
    if(sugar){ this.data.sugar=(this.data.sugar||0)+sugar; this.save(); }
    return sugar; },
};
const SAVE_DEFAULTS=JSON.parse(JSON.stringify(Save.data));   // v7.8.103 ค่าเริ่มต้นไว้รีเซ็ตก่อนรับเซฟจากคลาวด์
/* ---- Cloud: เซฟขึ้น Supabase (Anonymous auth ผูกกับ device) กันเซฟหาย ---- */
// v6.95 📊 สถิติการเล่น (v7.8.103 ซิงก์ขึ้นคลาวด์ด้วย Cloud.queueStats) · localStorage mochi_stats = รอบล่าสุด 300 รอบ
const STATS_MAX=300;
/* v7.8.38 เจ้าของ: ตัววัดตัวเลขให้มากที่สุด (Combat Meter) · ดาเมจที่ทำได้ไม่นับ overkill · แหล่ง = Taro context / สกิลล่าสุด / unique / dot */
function mxFmt(n){n=+n||0;return n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e4?(n/1e3).toFixed(1)+'k':String(Math.round(n));}
function mxClock(s){s=Math.max(0,Math.round(+s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function mxLines(m){if(!m)return[];const L=[],sec=Math.max(1,m.sec||1);
  L.push('meter: dealt '+mxFmt(m.dealt)+' · avg DPS '+mxFmt(m.dealt/sec)+' · peak 5s DPS '+mxFmt(m.peak5)+' · hits '+m.hits+' · crit '+(m.hits?Math.round(100*m.crits/m.hits):0)+'% · overkill '+mxFmt(m.over));
  L.push('meter: to boss '+mxFmt(m.dBoss)+' · to mini '+mxFmt(m.dMini)+' · to elite '+mxFmt(m.dElite)+' · to mobs '+mxFmt(m.dMob)+' · kills '+m.kills+' ('+(m.kills/sec*60).toFixed(1)+'/min)');
  for(const f of m.fights||[])L.push('fight: '+f.n+' '+(f.done?'killed':'left alive')+' · HP '+mxFmt(f.hp)+' · '+f.sec.toFixed(1)+'s · DPS '+mxFmt(f.dps)+(f.hpLeft?' · '+f.hpLeft+'% HP left':'')+(f.p2!=null?' · phase2 at '+f.p2+'s':'')+(f.p3!=null?' · phase3 at '+f.p3+'s':''));
  if(m.bsrc&&m.bsrc.length)L.push('boss/mini sources: '+m.bsrc.map(x=>x[0]+' '+x[1]+'% '+mxFmt(x[2])).join(' · '));
  if(m.src)L.push('sources: '+m.src.map(x=>x[0]+' '+x[1]+'% '+mxFmt(x[2])+' ('+x[3]+' hits)').join(' · '));
  L.push('taken: '+mxFmt(m.taken)+' in '+m.takenHits+' hits ('+(m.takenHits/sec*60).toFixed(1)+'/min) · dash taps '+m.dash+' · uniques '+m.uq);
  if(m.hpMin!=null)L.push('survival: min HP '+m.hpMin+'% · '+m.lowHp+'s under 30% HP · healed '+mxFmt(m.heal)+' · biggest hit dealt '+mxFmt(m.maxHit)+' · active '+m.active+'% of seconds · standing still '+m.still+'% · moved '+mxFmt(m.move)+'px · XP '+mxFmt(m.xp)+' ('+mxFmt(m.xp/sec*60)+'/min)');
  if(m.end)L.push('end stats: '+m.end);
  {const sp=(m.src||[]).filter(x=>x[0]==='spark'||x[0]==='sparkChild').reduce((s,x)=>s+x[3],0),sc=m.casts?.thunder||0;if(sp&&sc)L.push('spark: '+(sp/sc).toFixed(1)+' hits per cast ('+sp+' hits / '+sc+' casts)');}   // v7.8.51
  if(m.casts)L.push('casts: '+Object.entries(m.casts).map(([k,v])=>k+' '+v+'×').join(' · ')+' · unique ready but unused '+(m.uqIdle||0)+'s · game speed '+(m.spd||'x1 100%'));
  if(m.mobLife!=null)L.push('mobs: avg time alive '+m.mobLife+'s · avg HP '+m.mobHp+' · biggest hit taken '+(m.maxTaken||0)+' ('+(m.maxTakenSrc||'-')+') · last 5s taken: '+(m.last5||'-'));
  if(m.sugar!=null)L.push('loot: sugar +'+m.sugar+' · boxes '+m.boxes+' · currency '+m.cur);
  if(m.picks&&m.picks.length)L.push('picks: '+m.picks.join(' | '));
  if(m.wv&&m.wv.length)L.push('per wave: '+m.wv.map(w=>(w.w==='boss'?'Boss':'W'+w.w)+(w.o?' ['+w.o+']':'')+' '+w.sec+'s dps '+mxFmt(w.d/w.sec)+' kills '+w.k+' taken '+mxFmt(w.tk)+'/'+w.h).join(' | '));
  if(m.lv)L.push('levels: '+m.lv);if(m.waves)L.push('waves: '+m.waves);
  L.push('perf: FPS avg '+m.fpsAvg+' · min '+m.fpsMin+' · 1s<30fps '+m.lowSec+' · frames>50ms '+m.spikes+' · peak foes '+m.pFoe+' · foe shots '+m.pShot+' · FX '+m.pFx+' · tex '+m.texMB+'MB');
  return L;}
const Stats={
  _cur:null,
  load(){ try{ const a=JSON.parse(localStorage.getItem('mochi_stats')||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } },
  saveAll(a){ try{ localStorage.setItem('mochi_stats',JSON.stringify(a.slice(-STATS_MAX))); }catch(e){} },
  modeOf(g){ return g._pinnacleRun?'pinnacle':g.bossRush?'bossrush':g.recipeMode?'delve':g.riftMode?'rift':'story'; },
  start(g){ try{ g.mxReset?.(); if(g._inTutorial){ this._cur=null; return; } this._cur={ t:Date.now(), mode:this.modeOf(g), stage:g.stageIndex|0, diff:g.stageDiff||1, depth:g._amapNode?g._amapNode.d:null, hero:g.character, cards:[] }; try{ this._cur.kit=this.kit(g.character,g.basicAttack); }catch(e){} }catch(e){ this._cur=null; } },
  // v7.6.6 เจ้าของ: copy ได้ละเอียดขึ้น — เลเวลตัวละคร/Unique/พลัง/สแตต/Weave/Talent/ของสวมใส่ ตอนเริ่มรัน
  kit(hero,basic){ const k={}; try{ const cp=Save.cp(hero)||{}; k.clv=cp.lvl||1; k.tp=cp.tp||0; k.tal=Object.entries(cp.tal||{}).filter(e=>e[1]>0).map(e=>e[0].replace(/^pt_/,'')+':'+e[1]).join(' '); }catch(e){}
    try{ k.ulv=typeof uniqueTalentLevel==='function'?uniqueTalentLevel(hero):1; }catch(e){}
    try{ k.pw=heroPower(hero,basic); const p=computeHeroStats(hero,basic); k.st='HP '+Math.round(p.maxhp)+' · DMG ×'+(p.dmgMul||1).toFixed(2)+' · Crit '+Math.round((p.critChance||0)*100)+'% · CD ×'+(p.cdMul||1).toFixed(2)+' · Armor '+Math.round(p.armor||0)+' · Taken ×'+(p.dmgTakenMul||1).toFixed(2); }catch(e){}
    try{ const d=Save.data; k.weave='rank '+(d.rank||0)+' · HP '+Save.talLvl('hp')+' DMG '+Save.talLvl('dmg')+' DEF '+Save.talLvl('def')+' · perks '+Object.entries(d.rankPerks||{}).filter(e=>e[1]>0).map(e=>e[0]+':'+e[1]).join(' '); }catch(e){}
    try{ k.gear=GEAR_SLOTS.map(sl=>{ const it=Save.equippedGearItem(sl.slot); if(!it)return sl.slot+': -'; const b=GEAR_ALL.find(x=>x.id===it.baseId)||{}; if(it.grade==='start'&&!(it.affixes||[]).length&&!it.enhanceLv)return sl.slot+': starter'; const mods=(it.affixes||[]).map(a=>{const d=affixDef(a.id);return d?d.label+' '+d.fmt(a.v)+' T'+(a.t||3):a.id;}).join(', ');
      return sl.slot+': '+(typeof gearAffixName==='function'?gearAffixName(b.name||it.baseId,it.affixes||[]):(b.name||it.baseId))+(it.enhanceLv?' +'+it.enhanceLv:'')+' iLv'+(it.itemLevel||'?')+' '+(it.grade||'')+(mods?' ['+mods+']':''); }).join(' / '); }catch(e){}
    return k; },
  card(title,kind){ const c=this._cur; if(!c||!title)return; if(typeof DailyQ!=='undefined')DailyQ.tick('cards'); if(c.cards.length<40)c.cards.push((kind&&kind!=='Basic Attack'?kind+': ':'')+title); },
  end(g,result){ const c=this._cur; if(!c)return; this._cur=null; if(result==='win'&&typeof DailyQ!=='undefined'){ DailyQ.tick('clear'); if(g&&g.character)DailyQ.tick('win_'+g.character); }
    if(result==='win'&&g&&g.character&&!g._inTutorial&&typeof Save!=='undefined'&&Save.data){ const hw=Save.data.heroWins||(Save.data.heroWins={}),r=hw[g.character]||(hw[g.character]={wins:0,builds:{}}); r.wins=(r.wins||0)+1; const pth=g.basicAttack&&g.basicAttack.path; if(pth)r.builds[pth]=1; const sc=Save.data.secrets||(Save.data.secrets={}); if((g.gameSpeed||1)>=4)sc.x4=1; const pl=g.player; if(pl&&pl.maxhp>0&&pl.hp>0&&pl.hp/pl.maxhp<=.05)sc.close=1; }   // v8.0.23 Awards: ชนะด้วยฮีโร่/Build
    try{ const by=g._dmgBy||{},top=Object.keys(by).sort((a,b)=>by[b]-by[a])[0]||null;
      c.result=result; if(c.depth==null&&g._amapNode)c.depth=g._amapNode.d; c.sec=Math.round(g.elapsed||0); c.level=g.level||1; c.kills=g.kills||0; c.wave=(g.waveIndex|0)+1; c.boss=g.mode==='boss'||!!g.boss;
      c.path=(g.basicAttack&&g.basicAttack.path)||null; c.cause=result==='dead'?(g._lastHitSrc||top||'?'):null; c.topDmg=top;
      try{ const tot=Object.values(by).reduce((x,y)=>x+y,0)||1; c.dmg=Object.keys(by).sort((a,b)=>by[b]-by[a]).slice(0,5).map(k=>k+' '+Math.round(100*by[k]/tot)+'%').join(', '); c.maxhp=Math.round((g.player&&g.player.maxhp)||0); c.pwEnd=typeof heroPower==='function'?heroPower(c.hero,g.basicAttack):null; }catch(e){}
      try{ c.mx=g.mxSummary?.(); }catch(e){}
      const a=this.load(); a.push(c); this.saveAll(a); try{ Tele.enqueue(c,this.stageLab(c.stage)); }catch(e){} try{ Cloud.queueStats(); }catch(e){} }catch(e){} },
  merge(remote){ const key=r=>(r&&r.t)+'|'+(r&&r.hero)+'|'+(r&&r.stage), seen=new Set(), out=[]; for(const r of this.load().concat(remote||[])){ if(!r||!r.t)continue; const k=key(r); if(seen.has(k))continue; seen.add(k); out.push(r); } out.sort((x,y)=>x.t-y.t); this.saveAll(out); return out; },
  clear(){ try{ localStorage.removeItem('mochi_stats'); }catch(e){} },
  stageLab(i){ const st=(typeof STAGES!=='undefined')&&STAGES[i]; return st&&st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):('C'+(Math.floor(i/5)+1)+'-'+(i%5+1)); },
  toText(last){ const all=this.load(),a=last?all.slice(-last):all,ua=(()=>{try{const u=navigator.userAgent||'',m=/Android [\d.]+[^)]*/.exec(u)||/(iPhone|iPad)[^)]*/.exec(u);return (m?m[0]:u.slice(0,60))+' · screen '+screen.width+'×'+screen.height+' @'+(window.devicePixelRatio||1);}catch(e){return '';}})(),L=['Mochi Mayhem play stats · v'+(typeof GAME_VERSION!=='undefined'?GAME_VERSION:'?')+' · '+a.length+' runs'+(this._mem?' · '+this._mem:'')+(ua?' · device '+ua:''),'date time | result | mode | stage★diff/depth | hero (build) | time | Lv | kills | wave | death cause | cards'];
    a.forEach(r=>{ const d=new Date(r.t||0),dt=d.toISOString().slice(0,16).replace('T',' '),where=r.mode==='story'?this.stageLab(r.stage)+' ★'+r.diff:(r.mode+(r.depth!=null?' D'+r.depth:'')+' ('+this.stageLab(r.stage)+')');
      L.push([dt,r.result,r.mode,where,(r.hero||'?')+(r.path?' ('+r.path+')':''),Math.floor((r.sec||0)/60)+':'+String((r.sec||0)%60).padStart(2,'0'),'Lv'+r.level,r.kills+' kills','wave '+r.wave+(r.boss?' boss':''),r.cause||'-',(r.cards||[]).join(', ')].join(' | '));
      const k=r.kit; if(k){ L.push('   hero Lv'+(k.clv||'?')+' · Unique Lv'+(k.ulv||1)+' · power '+(k.pw||'?')+(r.pwEnd?'→'+r.pwEnd:'')+' · unspent TP '+(k.tp||0)+(k.st?' · '+k.st:''));
        if(k.tal)L.push('   talents: '+k.tal); if(k.weave)L.push('   weave: '+k.weave); if(k.gear)L.push('   gear: '+k.gear); }
      if(r.dmg)L.push('   damage taken from: '+r.dmg+(r.maxhp?' · end maxHP '+r.maxhp:''));
      if(r.mx&&typeof mxLines==='function')for(const q of mxLines(r.mx))L.push('   '+q); });
    try{ const rows=a.filter(r=>r.mx); if(rows.length){ L.push('','BENCH CSV: hero,build,stage,diff,result,sec,runLv,heroLv,power,kills/min,avgDPS,peak5,bossSec,bossDPS,bossDone,miniSec,miniDPS,taken/min,minHP%,healed,uniques,uniqueShare%,fpsAvg');
      for(const r of rows){ const m=r.mx,sec=Math.max(1,m.sec),bf=(m.fights||[]).find(f=>/^Boss/.test(f.n)),mf=(m.fights||[]).find(f=>/^Mini/.test(f.n)),uq=(m.src||[]).filter(x=>/unique/.test(x[0])).reduce((s,x)=>s+x[1],0);
        L.push(['bench',r.hero,r.path||'-',this.stageLab(r.stage),r.diff,r.result,sec,r.level,(r.kit&&r.kit.clv)||'',(r.kit&&r.kit.pw)||'',(m.kills/sec*60).toFixed(1),Math.round(m.dealt/sec),m.peak5,bf?bf.sec:'',bf?bf.dps:'',bf?(bf.done?1:0):'',mf?mf.sec:'',mf?mf.dps:'',(m.takenHits/sec*60).toFixed(1),m.hpMin??'',m.heal??'',m.uq,uq,m.fpsAvg].join(',')); } } }catch(e){}
    try{ const d=Save.data; L.splice(1,0,'profile: sugar '+(d.sugar||0)+' · stage unlocked '+this.stageLab(d.unlockedStage||0)+' · heroes '+(typeof CHAR_ORDER!=='undefined'?CHAR_ORDER:(d.chars||[])).filter(h=>(d.chars||[]).includes(h)||((d.charProg||{})[h]||{}).lvl>1).map(h=>{ const cp=Save.cp(h)||{}; return h+' Lv'+(cp.lvl||1); }).join(', ')); }catch(e){}
    return L.join('\n'); },
  copy(last){ const t=this.toText(last); const fb=()=>{ try{ const ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select(); const ok=document.execCommand('copy'); ta.remove(); return ok; }catch(e){ return false; } };
    try{ if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t).then(()=>true,()=>fb()); }catch(e){} return Promise.resolve(fb()); }
};
/* v7.8.44 ช่วงที่ 1: ส่งสถิติจบด่านขึ้น Supabase (ตาราง run_stats · เพิ่มได้อย่างเดียว อ่านไม่ได้) · เปิดเองใน Settings (ค่าเริ่มต้นปิด) · ไม่มีข้อมูลระบุตัวตน มีแค่รหัสสุ่มประจำเครื่อง · คิวในเครื่องไว้ส่งทีหลังถ้าออฟไลน์ */
const Tele={ Q:'mochi_tele_q', MAX:120,
  on(){ try{ return (typeof BETA_BUILD!=='undefined'&&BETA_BUILD)||!!(Save.data.settings&&Save.data.settings.share); }catch(e){ return false; } },   /* v8.1.139 ช่วงทดสอบส่งสถิติจบด่านทุกคน (ไม่ระบุตัวตน) */
  id(){ try{ let v=localStorage.getItem('mochi_install_id'); if(!v){ v=(crypto.randomUUID?crypto.randomUUID():'i'+Date.now().toString(36)+Math.random().toString(36).slice(2)); localStorage.setItem('mochi_install_id',v); } return v; }catch(e){ return 'unknown'; } },
  load(){ try{ const a=JSON.parse(localStorage.getItem(this.Q)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } },
  save(a){ try{ localStorage.setItem(this.Q,JSON.stringify(a.slice(-this.MAX))); }catch(e){} },
  enqueue(c,stageLab){ if(!this.on()||!c)return; const row={install_id:this.id(),v:typeof GAME_VERSION!=='undefined'?GAME_VERSION:'?',hero:c.hero||null,path:c.path||null,mode:c.mode||null,stage:stageLab||null,diff:c.diff|0,result:c.result||null,sec:c.sec|0,
      data:{level:c.level,kills:c.kills,wave:c.wave,boss:!!c.boss,depth:c.depth,cause:c.cause,dmgTaken:c.dmg,maxhp:c.maxhp,pwEnd:c.pwEnd,kit:c.kit,cards:c.cards,mx:c.mx,device:(()=>{try{return {ua:(navigator.userAgent||'').slice(0,160),w:screen.width,h:screen.height,dpr:window.devicePixelRatio||1};}catch(e){return null;}})()}};
    try{ if(JSON.stringify(row).length>30000){ row.data.cards=(row.data.cards||[]).slice(0,20); if(row.data.mx)row.data.mx.picks=(row.data.mx.picks||[]).slice(0,20); } }catch(e){}
    const a=this.load(); a.push(row); this.save(a); this.flush(); },
  flush(){ if(this._busy||!this.on()||typeof fetch!=='function')return; const a=this.load(); if(!a.length)return; this._busy=true; const batch=a.slice(0,10);
    fetch(CLOUD_URL+'/rest/v1/run_stats',{method:'POST',headers:{'apikey':CLOUD_KEY,'Authorization':'Bearer '+CLOUD_KEY,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(batch)})
      .then(r=>{ if(r.ok){ const rest=this.load().slice(batch.length); this.save(rest); this.sent=(this.sent||0)+batch.length; this.err=null; } else this.err='HTTP '+r.status; })
      .catch(e=>{ this.err='offline'; }).finally(()=>{ this._busy=false; if(!this.err&&this.load().length)setTimeout(()=>this.flush(),1500); }); },
  /* v8.1.140 play events (LAUNCH_RULES rule 7 · same run_stats table, mode 'event'): session · stage_start · tutorial_done · screen · ad
     → funnel of the first 10 minutes and where players stop · sec = seconds since this app session began · max 150 per session */
  ev(name,data,stage){ if(!this.on())return; try{ this._evN=(this._evN||0)+1; if(this._evN>150)return; const t0=this._t0||(this._t0=Date.now()),d=(typeof Save!=='undefined'&&Save.data)||{};
      const row={install_id:this.id(),v:typeof GAME_VERSION!=='undefined'?GAME_VERSION:'?',hero:d.character||null,path:null,mode:'event',stage:stage||null,diff:0,result:String(name).slice(0,40),sec:Math.round((Date.now()-t0)/1000),
        data:Object.assign({unlocked:d.unlockedStage|0,tut:!!d.tutorialDone,sugar:d.sugar|0},data||{})};
      const a=this.load(); a.push(row); this.save(a); if(name==='session'||name==='ad')this.flush(); }catch(e){} },
  status(){ const n=this.load().length; return !this.on()?'Off':(n?n+' waiting'+(this.err?' ('+this.err+')':''):'On'+(this.sent?' · '+this.sent+' sent':'')); }
};
const CLOUD_URL='https://tohsnflngkfoutqcfrwi.supabase.co';
const CLOUD_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaHNuZmxuZ2tmb3V0cWNmcndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjE3NzYsImV4cCI6MjEwNTE5Nzc3Nn0.EX6rE5skhsJq9jpwRvloDimZoPi5Mnhz-wpTwnx6ej4';
/* v8.1.139 เจ้าของ: ปุ่ม 🐞 แจ้งบั๊ก + รายงานอัตโนมัติ → Supabase (ตาราง qa_reports · ภาพที่ bucket qa-shots · เพิ่มได้อย่างเดียว อ่านไม่ได้) · ไม่มีข้อมูลระบุตัวตน มีแค่รหัสสุ่มเครื่อง
   BETA_BUILD=true ช่วงทดสอบ (ปุ่มขึ้นทุกคน + ส่ง error อัตโนมัติ + สถิติจบด่าน) · ปล่อยจริงตั้ง false → ปุ่มขึ้นเฉพาะ GM · ตัวเดียวกันใช้กับบอท (scripts/qa-autoplay.cjs) */
const BETA_BUILD=true;
const QA={ Q:'mochi_qa_q', errs:[], sentKeys:{}, autoN:0, AUTO_MAX:5,
  on(){ return BETA_BUILD||(typeof GM!=='undefined'&&GM.on()); },
  init(){ if(this._init)return; this._init=true; const push=(m,src)=>{ try{ m=String(m||'').slice(0,400); if(!m)return; this.errs.push({t:Math.round(performance.now()/1000),m,src}); if(this.errs.length>20)this.errs.shift(); this.auto(m); }catch(e){} };
    try{ window.addEventListener('error',e=>push((e.message||'error')+(e.filename?' @'+String(e.filename).split('/').pop()+':'+e.lineno+':'+e.colno:'')+(e.error&&e.error.stack?' | '+String(e.error.stack).split('\n').slice(1,4).join(' ').slice(0,300):''),'error'));
      window.addEventListener('unhandledrejection',e=>push('promise: '+((e.reason&&(e.reason.stack||e.reason.message))||(e.reason&&typeof e.reason==='object'?(()=>{ try{ return JSON.stringify(e.reason).slice(0,300); }catch(_){ return String(e.reason); } })():e.reason)),'promise'));
      const ce=console.error.bind(console); console.error=(...a)=>{ try{ push(a.map(x=>x&&x.stack?x.stack:(x&&typeof x==='object'?(()=>{ try{ return JSON.stringify(x).slice(0,300); }catch(_){ return String(x); } })():String(x))).join(' '),'console');   /* v8.1.142: objects were logged as [object Object] */ }catch(e){} ce(...a); }; }catch(e){} },
  scene(){ try{ return window.__g&&window.__g.scene.getScene('Game'); }catch(e){ return null; } },
  snapshot(s){ s=s||this.scene(); const b=s&&s.basicAttack,P=s&&s.player,st=s&&typeof STAGES!=='undefined'&&STAGES[s.stageIndex];
    let tex=null; try{ tex=s&&s.texMB?Math.round(s.texMB()):null; }catch(e){}
    return { stage:s&&s.state!=='menu'&&st?(st.chapterStage?('C'+(st.chapter+1)+'-'+st.chapterStage):st.name):null, hero:(s&&s.character)||(Save.data&&Save.data.character)||null, path:b&&b.path||null, state:s?String(s.state||'')+(s.state==='menu'?':'+(s.menuScreen||''):''):null,
      data:{ level:s&&s.level, elapsed:s&&Math.round(s.elapsed||0), hp:P?Math.round(P.hp):null, maxhp:P?Math.round(P.maxhp):null, mission:s&&s.waveObjective&&s.waveObjective.type||null, boss:!!(s&&s.boss&&s.boss.active),
        cards:b&&b.lv?Object.keys(b.lv).filter(k=>b.lv[k]>0).map(k=>k+':'+b.lv[k]).slice(0,40):null, mutation:b&&b.mutation||null, evolved:!!(b&&b.evolved), relics:s&&s._rel?Object.keys(s._rel).slice(0,20):null,
        fps:(window.__g&&Math.round(window.__g.loop.actualFps))||null, texMB:tex, heapMB:(performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null),
        device:{ua:(navigator.userAgent||'').slice(0,160),w:screen.width,h:screen.height,dpr:window.devicePixelRatio||1,mem:navigator.deviceMemory||null}, errors:this.errs.slice(-20), gm:typeof GM!=='undefined'&&GM.on() } }; },
  shot(cb){ const g=window.__g; let done=false; const fin=v=>{ if(!done){ done=true; cb(v); } }; setTimeout(()=>fin(null),4000);
    try{ g.renderer.snapshot(img=>{ try{ const W=Math.min(480,img.width),H=Math.round(img.height*W/img.width),c=document.createElement('canvas'); c.width=W; c.height=H; c.getContext('2d').drawImage(img,0,0,W,H); c.toBlob(bl=>fin(bl),'image/jpeg',.6); }catch(e){ fin(null); } }); }catch(e){ fin(null); } },
  report(kind,note,source,cb){ if(!this.on()&&source!=='bot')return; const snap=this.snapshot(),row={install_id:Tele.id(),v:GAME_VERSION,source:source||'player',kind:kind||'bug',note:note?String(note).slice(0,2000):null,stage:snap.stage,hero:snap.hero,path:snap.path,state:snap.state,data:snap.data,shot:null};
    this.shot(bl=>{ if(!bl||typeof fetch!=='function'){ this.enqueue(row); this.flush(); cb&&cb(true); return; } const path=new Date().toISOString().slice(0,10)+'/'+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2))+'.jpg';
      fetch(CLOUD_URL+'/storage/v1/object/qa-shots/'+path,{method:'POST',headers:{'apikey':CLOUD_KEY,'Authorization':'Bearer '+CLOUD_KEY,'Content-Type':'image/jpeg'},body:bl}).then(r=>{ if(r.ok)row.shot=path; }).catch(()=>{}).finally(()=>{ this.enqueue(row); this.flush(); cb&&cb(true); }); }); },
  auto(m){ if(!BETA_BUILD||this.autoN>=this.AUTO_MAX)return; const k=m.slice(0,120); if(this.sentKeys[k])return; this.sentKeys[k]=1; this.autoN++; setTimeout(()=>{ try{ this.report('error',m,window.__qaBot?'bot':'auto'); }catch(e){} },50); },
  load(){ try{ const a=JSON.parse(localStorage.getItem(this.Q)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } },
  enqueue(row){ try{ const a=this.load(); a.push(row); localStorage.setItem(this.Q,JSON.stringify(a.slice(-15))); }catch(e){} },
  flush(){ if(this._busy||typeof fetch!=='function')return; const a=this.load(); if(!a.length)return; this._busy=true; const batch=a.slice(0,5);
    fetch(CLOUD_URL+'/rest/v1/qa_reports',{method:'POST',headers:{'apikey':CLOUD_KEY,'Authorization':'Bearer '+CLOUD_KEY,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(batch)})
      .then(r=>{ if(r.ok){ try{ localStorage.setItem(this.Q,JSON.stringify(this.load().slice(batch.length))); }catch(e){} this.err=null; } else this.err='HTTP '+r.status; })
      .catch(()=>{ this.err='offline'; }).finally(()=>{ this._busy=false; if(!this.err&&this.load().length)setTimeout(()=>this.flush(),1500); }); },
  /* ปุ่ม 🐞 เป็น DOM ลอยเหนือเกม (ไม่ยุ่งกับ tap zone/จอยในเกม) · แตะ = ถ่ายภาพก่อน → หยุดเกม → หน้ากรอกสั้น ๆ */
  button(){ if(this._btn||!this.on()||typeof document==='undefined')return; const b=document.createElement('button'); b.textContent='🐞'; b.setAttribute('aria-label','Report a bug');
    b.style.cssText='position:fixed;left:6px;top:46%;z-index:9998;width:34px;height:34px;border-radius:17px;border:1px solid rgba(255,255,255,.35);background:rgba(20,12,30,.55);font-size:17px;line-height:1;padding:0;opacity:.75;touch-action:manipulation';
    b.addEventListener('click',e=>{ e.stopPropagation(); this.open(); }); ['pointerdown','touchstart'].forEach(t=>b.addEventListener(t,e=>e.stopPropagation(),{passive:true})); document.body.appendChild(b); this._btn=b; },
  open(){ if(this._modal)return; const s=this.scene(),wasPlay=s&&s.state==='play'; let snapRow=null;
    if(wasPlay){ s.state='qa'; s.physics.pause(); s.time.paused=true; if(s.joy){ s.joy.active=false; s.joy.dx=0; s.joy.dy=0; } }
    const resume=()=>{ if(wasPlay&&s&&s.state==='qa'){ s.state='play'; s.physics.resume(); s.time.paused=false; } };
    this.shot(bl=>{ snapRow=bl; const m=document.createElement('div'); this._modal=m;
      m.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(10,6,16,.72);display:flex;align-items:center;justify-content:center;font-family:sans-serif';
      m.innerHTML='<div style="background:#241833;color:#fff4e6;border:2px solid #ffd590;border-radius:16px;padding:14px;width:min(92vw,380px);box-sizing:border-box">'+
        '<div style="font-weight:bold;font-size:16px;color:#ffd590;margin-bottom:8px">🐞 Report</div>'+
        '<div id="qaKinds" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px"></div>'+
        '<textarea id="qaNote" maxlength="2000" placeholder="What did you see? What did you expect?" style="width:100%;height:96px;box-sizing:border-box;border-radius:10px;border:1px solid #6b5585;background:#160e20;color:#fff;font-size:14px;padding:8px"></textarea>'+
        '<div style="font-size:11px;color:#bba;margin:6px 0 10px">A screenshot and game info (stage, hero, cards, errors) are sent anonymously.</div>'+
        '<div style="display:flex;gap:8px;justify-content:flex-end"><button id="qaCancel" style="padding:9px 14px;border-radius:10px;border:0;background:#4a3a5c;color:#fff;font-size:14px">Cancel</button><button id="qaSend" style="padding:9px 18px;border-radius:10px;border:0;background:#ff8a3d;color:#fff;font-weight:bold;font-size:14px">Send</button></div></div>';
      document.body.appendChild(m); let kind='bug'; const kinds=[['bug','🐞 Bug'],['stuck','⛔ Stuck'],['looks','👀 Looks wrong'],['hard','💀 Too hard'],['easy','😴 Too easy'],['idea','💡 Idea']],box=m.querySelector('#qaKinds');
      const paint=()=>box.querySelectorAll('button').forEach(x=>{ const on=x.dataset.k===kind; x.style.background=on?'#ffd590':'#3a2d4a'; x.style.color=on?'#241833':'#fff'; });
      for(const [k,l] of kinds){ const x=document.createElement('button'); x.dataset.k=k; x.textContent=l; x.style.cssText='padding:6px 9px;border-radius:12px;border:0;font-size:12px'; x.onclick=()=>{ kind=k; paint(); }; box.appendChild(x); } paint();
      ['pointerdown','touchstart','keydown'].forEach(t=>m.addEventListener(t,e=>e.stopPropagation(),{passive:true}));
      const close=()=>{ m.remove(); this._modal=null; resume(); };
      m.querySelector('#qaCancel').onclick=close;
      m.querySelector('#qaSend').onclick=()=>{ const note=m.querySelector('#qaNote').value; const shot=snapRow; close(); this.reportWith(kind,note,shot); try{ s&&s.showBanner&&s.showBanner('🐞 Thank you!','Report sent',1100); }catch(e){} };
    }); },
  reportWith(kind,note,blob){ const keep=this.shot; this.shot=cb=>cb(blob); try{ this.report(kind,note,'player'); }finally{ this.shot=keep; } }
};
try{ QA.init(); }catch(e){}
/* v8.2.60 ล็อกอิน Google แบบ native (Android Credential Manager · แผ่นเลือกบัญชีด้านล่าง ไม่เปิดเบราว์เซอร์) · ใส่ Web client ID ของ Google Cloud (ตัวเดียวกับที่ Supabase ใช้) · ว่าง = ใช้ Custom Tab เดิม */
const GOOGLE_WEB_CLIENT_ID='';
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
  // ในแอป: ดักการเด้งกลับจาก Custom Tab (com.oheart.mochimayhem://login-callback) แล้วแลก code เป็น session
  bindDeepLink(){ if(this._deeplinkBound||!this.native())return;
    try{ const App=window.Capacitor.Plugins.App; if(!App)return;
      App.addListener('appUrlOpen', async (ev)=>{ const url=ev&&ev.url; if(!url||url.indexOf('login-callback')<0)return;
        try{ const B=window.Capacitor.Plugins.Browser; if(B)B.close().catch?.(()=>{}); }catch(e){}   /* v8.2.60 ปิดหน้าเว็บก่อน แลก code ทีหลัง (ไม่ค้างหน้า Google) */
        try{ const qs=(url.split('?')[1]||'').split('#')[0], p=new URLSearchParams(qs), code=p.get('code');
          if(code){ await this.sb.auth.exchangeCodeForSession(code); }
          else { const hp=new URLSearchParams(url.split('#')[1]||''), at=hp.get('access_token'), rt=hp.get('refresh_token'); if(at&&rt)await this.sb.auth.setSession({access_token:at,refresh_token:rt}); }
          const s=(await this.sb.auth.getSession()).data.session; if(s){ this.user=s.user; this.ready=true; } if(this._loginT0){ this.loginTele('tab',this._loginT0,s?'ok':'no_session'); this._loginT0=0; }
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
  base(){ try{ const b=JSON.parse(localStorage.getItem('mochi_cloud_base')||'null'); return b&&this.user&&b.uid===this.user.id?b.rev:null; }catch(e){ return null; } },
  setBase(rev){ try{ if(this.user)localStorage.setItem('mochi_cloud_base',JSON.stringify({uid:this.user.id,rev})); }catch(e){} },
  async pull(){ if(!this.ready)return null; this._remoteStats=null; try{ const {data,error}=await this.sb.from('game_saves').select('data,stats').eq('user_id',this.user.id).maybeSingle(); if(error){console.warn('[cloud] pull',error.message);return null;} if(data)this._remoteStats=data.stats; return data?data.data:null; }catch(e){ return null; } },   /* v8.2.60 query เดียว (เดิม 2 ครั้ง) */
  async push(data){ if(!this.ready||this.hold||(typeof GM!=='undefined'&&GM.testing()))return; try{ const rev=data.rev||0,{error}=await this.sb.from('game_saves').upsert({user_id:this.user.id,data,updated_at:new Date().toISOString()}); if(!error)this.setBase(rev); else console.warn('[cloud] push',error.message); }catch(e){ console.warn('[cloud] push',e); } },
  /* v7.8.103 Play Stats ขึ้นคลาวด์ (คอลัมน์ stats แยก · ส่งตอนจบรัน ไม่ใช่ทุกเซฟ · เก็บ 150 รันล่าสุด) */
  queueStats(){ if(!this.ready)return; clearTimeout(this._statT); this._statT=setTimeout(async()=>{ try{ const a=Stats.load().slice(-150); await this.sb.from('game_saves').update({stats:a}).eq('user_id',this.user.id); }catch(e){ console.warn('[cloud] stats',e); } },3000); },
  queuePush(data){ if(!this.ready||this.hold||(typeof GM!=='undefined'&&GM.testing()))return; clearTimeout(this._pushT); this._pushT=setTimeout(()=>this.push(data),1500); },
  // ---- Google login (บัญชีถาวร ข้ามเครื่อง) ----
  isGoogle(){ try{ return !!(this.user&&this.user.app_metadata&&this.user.app_metadata.provider==='google'); }catch(e){ return false; } },
  accountLabel(){ try{ if(this.isGoogle())return this.user.email||'Google account'; return this.user?'Temporary account (this device)':'Not connected'; }catch(e){ return 'Not connected'; } },
  async signInGoogle(){ if(!(await this.ensureClient()))return {ok:false,msg:'Cloud not ready (SDK failed to load)'};
    try{
      // ในแอป Android: เปิด Custom Tab Lockedอิน แล้วเด้งกลับผ่าน deep link (WebView Lockedอิน Google ตรง ๆ ไม่ได้)
      if(this.native()){
        const nat=await this.nativeGoogle?.(); if(nat)return nat;   /* v8.2.60 แผ่นเลือกบัญชีของ Android ก่อน · ไม่ได้ = Custom Tab เดิม */
        this.bindDeepLink(); this._loginT0=Date.now(); this._loginWay='tab';
        const {data,error}=await this.sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:'com.oheart.mochimayhem://login-callback',skipBrowserRedirect:true}});
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
  /* v8.2.60 Credential Manager → Google ID token → Supabase signInWithIdToken · nonce: Google ได้ SHA-256 · Supabase ได้ค่าดิบ */
  async nativeGoogle(){ const SL=window.Capacitor?.Plugins?.SocialLogin; if(!SL||!(typeof GOOGLE_WEB_CLIENT_ID!=='undefined'&&GOOGLE_WEB_CLIENT_ID))return null; const t0=Date.now();
    try{ if(!this._slInit){ await SL.initialize({google:{webClientId:GOOGLE_WEB_CLIENT_ID}}); this._slInit=true; }
      const raw=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),hb=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)),hashed=Array.from(new Uint8Array(hb),b=>b.toString(16).padStart(2,'0')).join('');
      const res=await SL.login({provider:'google',options:{nonce:hashed}}),idToken=res&&res.result&&res.result.idToken; if(!idToken){ this.loginTele('native',t0,'no_token'); return null; }
      const r=await this.sb.auth.signInWithIdToken({provider:'google',token:idToken,nonce:raw}); if(r.error){ this.loginTele('native',t0,'sb:'+r.error.message); return null; }
      this.user=r.data.user||r.data.session?.user; this.ready=true; this.loginTele('native',t0,'ok'); try{ this._onLogin&&this._onLogin(); }catch(e){} return {ok:true,native:true,done:true};
    }catch(e){ const m=String(e&&e.message||e); this.loginTele('native',t0,'err:'+m.slice(0,80)); if(/cancel/i.test(m))return {ok:false,msg:'Sign-in cancelled'}; return null; } },
  loginTele(way,t0,res){ try{ if(typeof Tele!=='undefined')Tele.ev('login',{way,ms:Date.now()-t0,res}); }catch(e){} },
  async signOut(){ try{ if(this.sb)await this.sb.auth.signOut(); }catch(e){} this.user=null;this.ready=false; },
};

/* v8.1.57 เจ้าของ: โหมด GM สำหรับทดสอบ · Settings แตะมุมขวาล่าง 7 ครั้ง → รหัส · จำในเครื่อง (localStorage) · ต้องปิดก่อนขึ้น Play Store (GM_ENABLED=false) */
const GM_ENABLED=(()=>{ try{ const h=location.hostname; return /\.github\.io$/.test(h)||(!!location.port&&/^(localhost|127\.)/.test(h)); }catch(e){ return true; } })(),GM_CODE='1234';   /* v8.1.67 เปิดเฉพาะเว็บทดสอบ (github.io / localhost:port) · แอปที่แพ็กไฟล์เอง (https://localhost) ปิดอัตโนมัติ */
const GM={
  ls(k,v){ try{ if(v===undefined)return localStorage.getItem(k); if(v===null)localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(e){ return null; } },
  on(){ return GM_ENABLED&&this.ls('mochi_gm')==='1'; },
  unlock(code){ if(!GM_ENABLED||String(code||'').trim()!==GM_CODE)return false; this.ls('mochi_gm','1'); return true; },
  off(){ this.ls('mochi_gm',null); },
  testing(){ return GM_ENABLED&&this.ls('mochi_gm_test')==='1'; },
  mark(){ if(Save.data){ Save.data.gmUsed=true; } },
  opt(k){ return !!(this.on()&&Save.data&&Save.data.gmOpt&&Save.data.gmOpt[k]); },
  toggle(k){ const d=Save.data; d.gmOpt=d.gmOpt||{}; d.gmOpt[k]=!d.gmOpt[k]; this.mark(); Save.save(); return d.gmOpt[k]; },
  backup(){ this.ls('mochi_save_gm_backup',JSON.stringify(Save.data)); },
  hasBackup(){ return !!this.ls('mochi_save_gm_backup'); },
  restore(){ const b=this.ls('mochi_save_gm_backup'); if(!b)return false; this.ls('mochi_save',b); return true; },
  startTest(){ if(this.testing())return false; this.ls('mochi_save_real',this.ls('mochi_save')||''); this.ls('mochi_gm_test','1'); this.ls('mochi_save',null); return true; },
  endTest(){ if(!this.testing())return false; const r=this.ls('mochi_save_real'); if(r)this.ls('mochi_save',r); else this.ls('mochi_save',null); this.ls('mochi_save_real',null); this.ls('mochi_gm_test',null); return true; }
};
/* v8.1.55 เจ้าของ: ทำเนียบหลายหมวด (คนชอบแข่ง) · ตาราง leaderboard ใน Supabase (docs/sql/leaderboard.sql) · โปรเจกต์ยังพักอยู่ → แสดง Offline */
const BOARD_CATS=[
  {id:'sugar',col:'s_sugar',emoji:'🍬',name:'Richest',unit:'Sugar',get:d=>Math.floor(d.sugar||0)},
  {id:'levels',col:'s_levels',emoji:'⭐',name:'Hero Levels',unit:'total Lv',get:d=>Object.values(d.charProg||{}).reduce((a,c)=>a+(c&&c.lvl||0),0)},
  {id:'rank',col:'s_rank',emoji:'🧶',name:'Weave Rank',unit:'Rank',get:d=>d.rank||0},
  {id:'stars',col:'s_stars',emoji:'🌟',name:'Stage Stars',unit:'stars',get:d=>Object.values(d.stageStars||{}).reduce((a,m)=>a+((m|0)&1?1:0)+((m|0)&2?1:0)+((m|0)&4?1:0),0)},
  {id:'kills',col:'s_kills',emoji:'⚔️',name:'Monster Slayer',unit:'defeated',get:d=>Object.values(d.bestiary||{}).reduce((a,b)=>a+(+b||0),0)},
  {id:'bestiary',col:'s_bestiary',emoji:'📖',name:'Collector',unit:'species',get:d=>Object.values(d.bestiary||{}).filter(v=>(+v||0)>0).length},
  {id:'chests',col:'s_chests',emoji:'🧰',name:'Treasure Seeker',unit:'chests',get:d=>d.chestsOpened||0},
  {id:'style',col:'s_style',emoji:'👗',name:'Fashion Star',unit:'cosmetics',get:d=>Object.keys((d.cos&&d.cos.own)||{}).length+Object.keys((d.cos&&d.cos.sown)||{}).length}];
const Board={ _at:0, _cache:{},
  defaultName(){ const u=(typeof Cloud!=='undefined'&&Cloud.user&&Cloud.user.id)||''; let h=0; for(const ch of u)h=(h*31+ch.charCodeAt(0))>>>0; return 'Mochi#'+String(1000+(h%9000)); },
  name(){ const d=Save.data||{}; return d.boardName||this.defaultName(); },
  validName(n){ n=String(n||'').trim(); if(!/^[A-Za-z0-9_ .\-]{3,14}$/.test(n))return null; if(/(fuck|shit|bitch|cunt|nigg|dick|porn|sex)/i.test(n.replace(/[^a-z]/gi,'')))return null; return n; },
  setName(n){ const v=this.validName(n); if(!v)return false; Save.data.boardName=v; Save.save(); this._at=0; this.submit(true); return true; },
  scores(d){ const o={}; for(const c of BOARD_CATS)o[c.col]=Math.max(0,Math.floor(c.get(d||{})||0)); return o; },
  online(){ return !!(typeof Cloud!=='undefined'&&Cloud.ready&&Cloud.sb&&Cloud.user); },
  async submit(force){ if(!this.online()||!Save.data||Save.data.gmUsed||(typeof GM!=='undefined'&&GM.testing()))return false; const now=Date.now(); if(!force&&now-this._at<120000)return false; this._at=now;
    try{ const row=Object.assign({user_id:Cloud.user.id,name:this.name(),hero:Save.data.character||'momo',updated_at:new Date().toISOString()},this.scores(Save.data)); const {error}=await Cloud.sb.from('leaderboard').upsert(row); if(error){ this._err=error.message; return false; } this._err=null; return true; }catch(e){ this._err=String(e&&e.message||e); return false; } },
  async top(cat,limit=50){ if(!this.online())return null; const c=BOARD_CATS.find(x=>x.id===cat)||BOARD_CATS[0];
    try{ const {data,error}=await Cloud.sb.from('leaderboard').select('user_id,name,hero,'+c.col).order(c.col,{ascending:false}).limit(limit); if(error){ this._err=error.message; return null; }
      const mine=this.scores(Save.data)[c.col]; let myRank=null; const idx=(data||[]).findIndex(r=>r.user_id===Cloud.user.id); if(idx>=0)myRank=idx+1; else { const q=await Cloud.sb.from('leaderboard').select('user_id',{count:'exact',head:true}).gt(c.col,mine); if(!q.error&&q.count!=null)myRank=q.count+1; }
      const out={rows:(data||[]).map(r=>({me:r.user_id===Cloud.user.id,name:r.name,hero:r.hero,v:r[c.col]||0})),mine,myRank}; this._cache[cat]=out; return out; }catch(e){ this._err=String(e&&e.message||e); return null; } }
};
/* ---- BESTIARY: สมุดมอนสเตอร์ · ฆ่ามอนเก็บสถิติ → ปลดโบนัสถาวร 5 ระดับ ---- */
const BESTIARY_THRESHOLDS = [1, 100, 1000];   // v8.0.30 เจ้าของ: 3 ขั้น — พบครั้งแรก / ฆ่า 100 / ฆ่า 1,000 (บอส/มินิ 1/5/25)
const BEST_MAX_TIER = 3, BEST_TIER_SUGAR=[30,80,200], BEST_WEAK_MUL=1.05;
function bestiaryTiers(id){ return /^(boss|mini)\d+$/.test(String(id))?[1,5,25]:BESTIARY_THRESHOLDS; }
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
  { id:'mini5', emoji:'🦗', name:'Sporewarden Mantis',     tex:'mb6_sporewarden', desc:'C2-1 miniboss — canopy warden',
    bonus:[{spd:0.004},{spd:0.008},{spd:0.012},{spd:0.016},{spd:0.022}] },
  { id:'mini6', emoji:'🍄', name:'Fungal Juggernaut',      tex:'mb7_fungal_juggernaut', desc:'C2-2 miniboss — the marsh stampede',
    bonus:[{hp:2},{hp:4},{hp:6},{hp:9},{hp:12,def:0.01}] },
  { id:'mini7', emoji:'🐝', name:'Royal Stinger',          tex:'mb8_royal_stinger', desc:'C2-3 miniboss — blade of the hive',
    bonus:[{crit:0.004},{crit:0.008},{crit:0.012},{crit:0.016},{crit:0.02}] },
  { id:'mini8', emoji:'🍂', name:'Season Keeper',          tex:'mb9_season_keeper', desc:'C2-4 miniboss — warden of the four seasons',
    bonus:[{cdr:0.005},{cdr:0.009},{cdr:0.013},{cdr:0.017},{cdr:0.023}] },
  { id:'mini9', emoji:'🛡️', name:'Ancient Root Knight',    tex:'mb10_ancient_root_knight', desc:'C2-5 miniboss — guard of the living throne',
    bonus:[{def:0.005},{def:0.009},{def:0.013},{def:0.017},{def:0.022}] },
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
  { id:'boss5', emoji:'🌿', name:'Rootmother’s Bud',       tex:'boss6_rootmother', desc:'C2-1 boss — the first crown seed',
    bonus:[{hp:2,dmg:0.006},{hp:3,dmg:0.011},{hp:5,dmg:0.016},{hp:7,dmg:0.022,def:0.01},{hp:10,dmg:0.028,def:0.015,crit:0.012}] },
  { id:'boss6', emoji:'🍄', name:'Mycelium Behemoth',      tex:'boss7_mycelium_behemoth', desc:'C2-2 boss — heart of the marsh',
    bonus:[{hp:3,def:0.005},{hp:4,def:0.009},{hp:6,def:0.013},{hp:8,def:0.017},{hp:11,def:0.022,dmg:0.012}] },
  { id:'boss7', emoji:'👑', name:'Ferment Hornet Queen',   tex:'boss8_hornet_queen', desc:'C2-3 boss — ruler of the nectar hive',
    bonus:[{dmg:0.006},{dmg:0.011},{dmg:0.016},{dmg:0.022,crit:0.01},{dmg:0.028,crit:0.015}] },
  { id:'boss8', emoji:'🌸', name:'Chronobloom Orchid',     tex:'boss9_chronobloom_orchid', desc:'C2-4 boss — the flower that breaks time',
    bonus:[{cdr:0.006},{cdr:0.011},{cdr:0.016},{cdr:0.021,spd:0.01},{cdr:0.027,spd:0.015}] },
  { id:'boss9', emoji:'🌳', name:'The True Rootmother',    tex:'boss10_true_rootmother', desc:'C2-5 boss — the living throne itself',
    bonus:[{hp:3,dmg:0.007},{hp:5,dmg:0.012},{hp:7,dmg:0.018,def:0.01},{hp:10,dmg:0.024,def:0.014},{hp:14,dmg:0.03,def:0.018,crit:0.014}] },
];
// Chapter 3: five shared field roles plus one miniboss and boss per stage.
// Static portraits load only when their Bestiary page is opened.
const C3_FIELD_CODEX=[
  ['basic','Ash Mochi','c3_e_basic', {hp:1}],
  ['fast','Sunseed Sprinter','c3_e_fast', {spd:0.005}],
  ['shooter','Hollow Apple Sniper','c3_e_shooter', {dmg:0.005}],
  ['bomber','Crownseed Pod','c3_e_bomber', {crit:0.004}],
  ['tank','Acorn Shield Knight','c3_e_tank', {def:0.004}],
];
for(const [id,name,tex,step] of C3_FIELD_CODEX){
  BESTIARY.push({id:'c3_'+id,emoji:'🌱',name,tex,desc:'Chapter 3 field enemy',
    bonus:[1,2,3,4,5].map(n=>Object.fromEntries(Object.entries(step).map(([k,v])=>[k,v*n])))});
}
const C3_BOSS_CODEX=[
  ['Cinder Scarecrow','The Ash Harvester'],['Rotcore Twins','The Orchard Mother'],
  ['Prism Mantis','The Shattered Curator'],['Vault Warden','The Keeper of Seeds'],
  ['Crown Thorn Knight','The First Seed']
];
C3_BOSS_CODEX.forEach(([mini,boss],i)=>{
  const n=i+1,stage='Chapter 3 · Stage '+n;
  BESTIARY.push({id:'mini'+(i+10),emoji:'🌱',name:mini,tex:'codex_c3_mini'+n,desc:stage+' miniboss',bonus:[1,2,3,4,5].map(x=>({dmg:x*0.003}))});
  BESTIARY.push({id:'boss'+(i+10),emoji:'👑',name:boss,tex:'codex_c3_boss'+n,desc:stage+' boss',bonus:[1,2,3,4,5].map(x=>({hp:x,dmg:x*0.004}))});
});
/* v6.78 C3: Bestiary gives Sugar/collection only, no stats */
/* v8.1.87 เจ้าของ (League phase 7 · Bestiary → Memory Book): ปลดขั้น = ได้ 💭 Memory · ใช้ Memory อัป Codex ของมอนตัวนั้น (ต้องถึงขั้น 3) · Codex +3% ดาเมจต่อมอนตัวนั้น/ขั้น (สูงสุด 5) */
const MEMORY_TIER=[1,2,4],CODEX_MAX=5,CODEX_STEP=.03;
function codexLv(id){ const c=(typeof Save!=='undefined'&&Save.data&&Save.data.codex)||{}; return Math.max(0,Math.min(CODEX_MAX,c[id]|0)); }
function codexCost(id){ return codexLv(id)+1; }
function bestiaryLv(type){ const k=Save.kills(type); let lv=0; for(const t of bestiaryTiers(type)){ if(k>=t)lv++; else break; } return lv; }
// v8.0.30 มอน C1-2…C2-5 แยกชนิดตามด่าน (เดิมนับรวมเป็นมด C1-1) · key = f<ด่าน>_<ชื่อ>
const FIELD_CODEX=[
  [1,'💧',[['Rotten Foam Spawn','basic'],['Backflow Fiend','fast'],['Sewage Spitter Bubble','shooter'],['Ferment Pressure Sac','bomber'],['Armored Grate Crab','tank'],['Loose Pipe Bubble','basic']]],
  [2,'🌶️',[['Boiling Mochi Ember','basic'],['Dashing Chili','fast'],['Air-Gun Chili Grinder','shooter'],['Chili Pressure Pot','bomber'],['Charcoal Furnace Golem','tank']]],
  [3,'🧊',[['Frozen Sugar Spirit','basic'],['Dashing Ice Shard','fast'],['Cold Syrup Turret','shooter'],['Frost Pressure Bubble','bomber'],['Frozen Gate Warden','tank']]],
  [4,'🌑',[['Void Shard','basic'],['Crown-Ripper Fiend','fast'],['Banquet Eye','shooter'],['Bomb-Mouth Truffle','bomber'],['Crown Oven Guard','tank']]],
  [5,'🌿',[['Ferment Sprout','basic','c21_sprout_animated'],['Vine Hunter','fast','c21_vine_hunter_animated'],['Spore Lantern','shooter','c21_spore_lantern_animated'],['Rotten Fruit Pod','bomber','c21_fruit_pod_animated'],['Root-Back Beetle','tank','c21_root_beetle_animated'],['Thorn Oracle','siege','c21_thorn_oracle_animated']]],
  [6,'🍄',[['Mycelium Drifter','basic','c22_drifter_animated'],['Cap Hopper','fast','c22_hopper_animated'],['Puffcap Sniper','shooter','c22_sniper_animated'],['Mold Sac','bomber','c22_mold_sac_animated'],['Mycelium Bulwark','tank','c22_bulwark_animated'],['Threadweaver Oracle','siege','c22_oracle_animated'],['Sporeling','small','c22_sporeling_animated']]],
  [7,'🐝',[['Nectar Drone','basic','c23_drone_animated'],['Dartwing','fast','c23_dartwing_animated'],['Pollen Sniper','shooter','c23_pollen_sniper_animated'],['Honey Bomb','bomber','c23_honey_bomb_animated'],['Wax Shieldbearer','tank','c23_wax_guard_animated'],['Choir Moth','siege','c23_choir_moth_animated'],['Tiny Grub','small','c23_grub_animated']]],
  [8,'🍂',[['Spring Budling','basic','c24_budling_animated'],['Summer Sunscarab','fast','c24_sunscarab_animated'],['Autumn Leafblade','fast','c24_leafblade_animated'],['Winter Frostbell','shooter','c24_frostbell_animated'],['Stormcloud Fruit','bomber','c24_stormfruit_animated'],['Equinox Gardener','tank','c24_equinox_animated'],['Seasonal Wisp','siege','c24_season_wisp_animated'],['Bloom Sprout','small','c24_bloom_sprout_animated']]],
  [9,'🌳',[['Crown Rootling','basic','c25_rootling_animated'],['Thorn Charger','fast','c25_thorn_charger_animated'],['Bramble Assassin','fast','c25_bramble_assassin_animated'],['Sap Oracle','shooter','c25_sap_oracle_animated'],['Memory Seed Bomb','bomber','c25_seed_bomb_animated'],['Bark Bulwark','tank','c25_bark_guard_animated'],['Root Choir Leech','siege','c25_root_choir_animated']]],
];
function bestSlug(n){ return String(n||'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
const BEST_ROLE_LORE={basic:'Comes in big groups — sweep them with wide attacks.',fast:'Rushes straight at you — dash sideways and let it overshoot.',shooter:'Keeps its distance and shoots — close in or break line of sight.',bomber:'Bursts when it falls — finish it from range.',tank:'Slow and heavy — keep moving and wear it down.',siege:'Tough backline caster — focus it before it builds up.',small:'Tiny and quick to fall — leave it to area hits.',acid:'Leaves acid pools — never fight inside them.'};
const STAGE_LABEL=i=>'C'+(Math.floor(i/5)+1)+'-'+(i%5+1);
for(const [si,em,list] of FIELD_CODEX)for(const [name,role,tex] of list)BESTIARY.push({id:'f'+si+'_'+bestSlug(name),emoji:em,name,tex:tex||'',desc:STAGE_LABEL(si)+' field enemy',role,stage:si});
// เกร็ด (ปลดที่ขั้น 3 พร้อมจุดอ่อน +5% ดาเมจใส่ชนิดนั้น)
for(const m of BESTIARY){ if(!m.role)m.role=/^boss/.test(m.id)?'boss':/^mini/.test(m.id)?'mini':m.id.startsWith('c3_')?m.id.slice(3):m.id;
  m.lore=m.role==='boss'?'Watch its phases at 50% and 25% HP — kick the glowing objects into it for big damage.':m.role==='mini'?'Hits hard but alone — keep moving and use your Unique when it charges.':(BEST_ROLE_LORE[m.role]||BEST_ROLE_LORE.basic); }
for(const m of BESTIARY){ if(m.stage==null){ const q=/^(?:boss|mini)(\d+)$/.exec(m.id); m.stage=q?+q[1]:m.id.startsWith('c3_')?10:0; } m.ord=m.stage*10+(/^mini/.test(m.id)?5:/^boss/.test(m.id)?8:0); }
const BESTIARY_IDS=new Set(BESTIARY.map(m=>m.id));
// โบนัสสแตตของ tier ที่ระบุ (tier 0-4 = ค่าใน bonus[] · tier 5-7 = สเกลจาก tier 5)

