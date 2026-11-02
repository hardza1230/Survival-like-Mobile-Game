// v8.0.66 เจ้าของ: ฮีโร่ทุกตัวปลดใน Chapter 1 ด่านละคน (Mint C1-2 · Cocoa C1-3 · Taro C1-4 · Yuzu C1-5)
const fs=require('fs'),assert=require('assert'),vm=require('vm');
const src=fs.readFileSync('game.js','utf8');
const grab=(a,b)=>{const i=src.indexOf(a);assert(i>=0,a);const j=src.indexOf(b,i);assert(j>i,b);return src.slice(i,j);};
const ctx={};vm.createContext(ctx);
vm.runInContext(grab('const CORE_UNLOCK_STAGE=','const SIGNATURE_WEAPONS')+';this.C=CORE_UNLOCK_STAGE;this.H=HERO_INTROS;',ctx);
vm.runInContext(grab('const FEATURE_OPEN=','\n')+';this.F=FEATURE_OPEN;',ctx);
assert.deepStrictEqual({...ctx.C},{mint:0,cocoa:1,taro:2,yuzu:3,sesame:4});
assert.equal(ctx.F.char,1,'Heroes tab opens with the first unlock');
for(const h of ctx.H){assert.equal(h.idx,ctx.C[h.id]+1,h.id+' intro plays on its first playable stage');assert(!/Hornet|Fermented Canopy|harvest fields|Chili Engine Room ahead is burning/.test(h.text),h.id+' intro text still points at the old stage');}
const want={s06:'cs_s02_far_drains',s07:'cs_s03_far_furnace',s08:'cs_s04_far_prison',s09:'cs_s05_far_oven'};
for(const [k,bg] of Object.entries(want)){assert(src.includes(k+":mcHero('"+bg+"'"),k+' uses the Chapter 1 background');assert(src.includes("  "+bg+":'assets/"),bg+' is a registered image');}
assert(src.includes("(idx===1?{idx:1,id:'mint',flag:'mintIntro'}:null)"));
const canon=fs.readFileSync('docs/STORY_CANON.md','utf8');
for(const [h,st] of [['Mint','C1-2'],['Cocoa','C1-3'],['Taro','C1-4'],['Yuzu','C1-5']])assert(canon.includes('| '+h+' | '+st+' |'),h+' canon stage');
console.log('hero-unlock-ch1 ok');

// Sesame prototype unlock: both first clear and existing-save repair use the real helper.
vm.runInContext('this.U={data:{},'+grab('  unlockCoreCharacters(', '\n  // ---- Cloud sync')+'};',ctx);
const u=ctx.U;
u.data={chars:['momo'],stageMastery:{3:true},sugar:123,charProg:{sesame:{tal:{pt_prism_1:2}}}};
u.unlockCoreCharacters();assert(!u.data.chars.includes('sesame'),'C1-4 does not unlock Sesame');
u.data.stageMastery[4]=true;assert(u.unlockCoreCharacters());assert(u.data.chars.includes('sesame'));assert(u.data.charUnlockNew.sesame);
assert.equal(u.data.chars.filter(x=>x==='sesame').length,1);assert(!u.unlockCoreCharacters(),'repeat clear is idempotent');
assert.equal(u.data.sugar,123);assert.equal(u.data.charProg.sesame.tal.pt_prism_1,2,'old talent investments remain');
u.data={chars:['momo'],stageMastery:{4:true},sugar:0};assert(u.unlockCoreCharacters(false));assert(u.data.chars.includes('sesame'));assert(!u.data.charUnlockNew,'existing saves unlock without replay/purchase');
assert(src.includes('if(this.unlockCoreCharacters(false))gearMigrated=true'));
assert(src.includes('Save.unlockCoreCharacters();Save.save();'));
assert(src.includes("const FIGHTER_PLAYTEST_ALL=false"),'other heroes retain progression gates');
console.log('Sesame unlock: C1-5 clear, old-save repair, no purchase, repeat safety and preserved talent points passed');

u.data={chars:['momo'],unlockedStage:4};u.unlockCoreCharacters(false);assert(!u.data.chars.includes('sesame'));
u.data={chars:['momo'],unlockedStage:5};assert(u.unlockCoreCharacters(false));assert(u.data.chars.includes('sesame'),'legacy Chapter2 progress repairs missing mastery');assert.deepEqual(Array.from(u.data.chars),['momo','sesame'],'legacy fallback does not open other heroes');
