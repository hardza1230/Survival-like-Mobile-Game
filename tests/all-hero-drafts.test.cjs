const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'(');assert(at>=0,n);const tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
function block(from,to){return source.slice(source.indexOf(from),source.indexOf(to));}
let seed=7;const rng=Object.create(Math);rng.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const ctx={Math:rng,Phaser:{Utils:{Array:{Shuffle:a=>a}},Math:{FloatBetween:(a,b)=>(a+b)/2}},SKILL_ICON:{frost:'ic_frost'},tagList:()=>[],tagLabel:()=>'',TAG_TIERS:[],TAG_SETS:{},WEAPON_TAGS:{},Sfx:{clear(){},frost(){},heal(){}},rollRarity:()=>({color:1,potency:1,ranks:1}),STAT_CAPS:{dmgMul:10,critChance:.8,cdMulMin:.3,speedMul:3,dmgTakenMin:.35},BALANCE:{moveSpeed:180}};
vm.createContext(ctx);
vm.runInContext(block('const BASIC_ATTACKS = {','// 🛤 Build Path')+block('const BASIC_PATHS={','// 🍯 Flavor Infusion')+block('const INFUSION_UP=', '// 🏷️ Tag Sets')+block('const MINT_CARD_WEIGHTS=', 'const CHARACTER_UNIQUES = {')+block('const BUILD_PATH_STYLES=', '// Mint M1:')+block('const BASIC_EVO_DESC=', '/* ---- BASIC ATTACK PROTOTYPE')+block('function egUpgradeDefs(', 'function egBuildCost('),ctx);
const api=vm.runInContext('({BASIC_ATTACKS,BASIC_PATHS,mintUpgradeGroup,mintVolleyProfile,pickMintCards,pathMods,egUpgradeDefs})',ctx);
const Scene=vm.runInContext('class Scene{'+['rollBasicAttackUpgrades','endlessCards','endlessStatDefs','castFrostLance','usesStoryBudget','storySpawnPace','storyTimedSwarm','storyLiveCap','storyCanSpawn'].map(method).join('\n')+'\n}Scene',ctx);
function scene(path,character='mint'){
 const s=new Scene();Object.assign(s,{character,level:7,stageIndex:1,player:{hp:100,maxhp:100,dmgMul:1,baseSpeed:180,active:true,x:0,y:0},basicAttack:{character,path,lv:{},ranks:{},mastery:0},skills:{frost:1,sprinkle:1},basicAttackInfo:()=>api.BASIC_ATTACKS[character],upTags:()=>[],tagCounts:()=>({}),syncBasicAttack(){this.basicAttack._pm=api.pathMods(this.basicAttack);this.basicAttack.mastery=Object.values(this.basicAttack.lv).reduce((a,b)=>a+b,0);},modCard:()=>null,tradeCard:()=>null,showBanner(){},popHeal(){},fusionReady:()=>null});return s;
}

vm.runInContext(block('const STORY_WAVE_PLAN=','const CHANGELOG ='),ctx);
const remaining=['yuzu','cocoa','taro','sesame'];
for(const character of remaining)for(const path of api.BASIC_PATHS[character].map(p=>p.id)){
 const s=scene(path,character);s.stageIndex=8;const def=api.BASIC_ATTACKS[character],pt=api.BASIC_PATHS[character].find(p=>p.id===path),pathIds=new Set(pt.upgrades.map(u=>u.id));
 s.modCard=()=>({type:'mod',key:'modifier',special:true});s.tradeCard=()=>({type:'trade',key:'trade',special:true});
 const allowed=new Set(def.upgrades.concat(pt.upgrades).map(u=>u.id));
 for(let i=0;i<150;i++){
  const cards=s.rollBasicAttackUpgrades(3);assert.equal(cards.length,3);assert.equal(new Set(cards.map(c=>c.key)).size,3);
  assert(cards.some(c=>c.poolGroup==='path'&&pathIds.has(c.key)));assert(cards.some(c=>c.poolGroup==='shared'&&c.type==='basic'&&!c.special));
  for(const c of cards)if(c.type==='basic'&&!c.key.startsWith('endless_'))assert(allowed.has(c.key));
 }
 s.player.hp=20;for(const n of [1,2,3])for(let i=0;i<50;i++){const cards=s.rollBasicAttackUpgrades(n);assert.equal(cards.length,n);assert(cards.some(c=>pathIds.has(c.key)));if(n>1)assert(cards.some(c=>c.type==='heal'));}
 s.player.hp=100;
 // Actual card applications preserve the authored rank/potency and path effects.
 for(const u of pt.upgrades){s.basicAttack.lv={};s.basicAttack.ranks={};s.banishedKeys=Object.fromEntries(pt.upgrades.filter(x=>x.id!==u.id).map(x=>['b:'+x.id,true]));const card=s.rollBasicAttackUpgrades(3).find(c=>c.key===u.id);assert(card);card.apply();assert.equal(s.basicAttack.lv[u.id],1);assert.equal(s.basicAttack.ranks[u.id],1);assert.deepEqual(s.basicAttack._pm,api.pathMods(s.basicAttack));}
 s.basicAttack.mutation='chosen';s.basicAttack.evolved=true;s.basicAttack.lv={};s.basicAttack.ranks={};s.banishedKeys={};
 // Full path investment leaves only valid core/shared choices, never another path.
 for(const u of pt.upgrades){s.basicAttack.lv[u.id]=u.max;s.basicAttack.ranks[u.id]=u.max;}
 const full=s.rollBasicAttackUpgrades(3);assert.equal(full.length,3);assert(!full.some(c=>pathIds.has(c.key)));assert(full.some(c=>c.poolGroup==='shared'&&c.type==='basic'));
 for(const u of def.upgrades.concat(pt.upgrades))s.banishedKeys['b:'+u.id]=true;
 const exhausted=s.rollBasicAttackUpgrades(3);assert.equal(exhausted.length,3);assert(!exhausted.some(c=>allowed.has(c.key)));assert.equal(new Set(exhausted.map(c=>c.key)).size,3);
 // Stage-local reset does not leak an old path choice.
 s.basicAttack.path=api.BASIC_PATHS[character].find(p=>p.id!==path).id;s.basicAttack.lv={};s.basicAttack.ranks={};s.banishedKeys={};assert(s.rollBasicAttackUpgrades(3).some(c=>api.BASIC_PATHS[character].find(p=>p.id===s.basicAttack.path).upgrades.some(u=>u.id===c.key)));
}
// Before a path is chosen, every hero (including pathless Berry) has core options.
for(const character of Object.keys(api.BASIC_ATTACKS)){
 const s=scene(null,character);s.level=5;s.stageIndex=8;s.player.hp=20;const ids=new Set(api.BASIC_ATTACKS[character].upgrades.map(u=>u.id));
 const randomBefore=rng.random;rng.random=()=>.999999;
 for(const n of [1,2,3]){const cards=s.rollBasicAttackUpgrades(n);assert.equal(cards.length,n);assert(cards.some(c=>ids.has(c.key)));if(n>1)assert(cards.some(c=>c.type==='heal'));}
 rng.random=randomBefore;
}
// Milestones remain explicit screens at their existing gates for all four heroes.
for(const character of remaining){const s=scene(null,character);s.level=6;const paths=s.rollBasicAttackUpgrades(3);assert(paths.every(c=>c.kind==='Build Path'));paths[0].apply();assert(s.basicAttack.path);s.basicAttack.mastery=10;assert(s.rollBasicAttackUpgrades(3).every(c=>c.mutation));s.basicAttack.mutation='chosen';s.basicAttack.mastery=20;assert(s.rollBasicAttackUpgrades(3)[0].evolution);}
// Random loot and special modes retain the original ungrouped drafts for new heroes.
for(const character of remaining.concat('berry'))for(const flag of ['recipeMode','riftMode','bossRush','endlessMode','_inTutorial','noSpecial']){
 const s=scene(api.BASIC_PATHS[character]?.[0].id,character);if(flag!=='noSpecial')s[flag]=true;const out=s.rollBasicAttackUpgrades(3,flag==='noSpecial'?{noSpecial:true}:undefined);assert(!out.some(c=>c.poolGroup));
}
console.log('P5: twelve remaining paths, all seven heroes before path selection, Berry core choices, recovery and n=1/2/3, authored rank/effect application, caps/banish/exhaustion, stage-local path replacement, special milestones and mode/loot isolation passed');
