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
// Actual normal drafts retain path and core attack choices under hostile RNG.
for(const character of ['momo','mint'])for(const path of api.BASIC_PATHS[character].map(p=>p.id)){
 const s=scene(path,character);s.stageIndex=6;s.modCard=()=>({type:'mod',key:'testMod',special:true});s.tradeCard=()=>({type:'trade',key:'testTrade',special:true});
 for(let i=0;i<300;i++){const out=s.rollBasicAttackUpgrades(3);assert.equal(out.length,3);assert.equal(new Set(out.map(c=>c.key)).size,3);assert(out.some(c=>c.poolGroup==='path'));assert(out.some(c=>c.poolGroup==='shared'&&c.type==='basic'&&!c.special));}
 s.player.hp=20;for(let i=0;i<100;i++){const out=s.rollBasicAttackUpgrades(3);assert(out.some(c=>c.poolGroup==='path'));assert(out.some(c=>c.type==='heal'));}
 assert(s.rollBasicAttackUpgrades(1).some(c=>c.poolGroup==='path'));
 // Maxed/banished paths are not revived to satisfy the slot guarantee.
 s.player.hp=100;s.basicAttack.mutation='chosen';s.basicAttack.evolved=true;s.banishedKeys={};
 const group=id=>character==='mint'?vm.runInContext('mintUpgradeGroup',ctx)(path,id):vm.runInContext('berryUpgradeGroup',ctx)(path,id);
 for(const u of api.BASIC_ATTACKS[character].upgrades.concat(api.BASIC_PATHS[character].find(p=>p.id===path).upgrades))if(group(u.id)==='path')s.banishedKeys['b:'+u.id]=true;
 const out=s.rollBasicAttackUpgrades(3);assert.equal(out.length,3);assert(!out.some(c=>c.poolGroup==='path'));assert(!out.some(c=>s.banishedKeys['b:'+c.key]));
}
// Weighted loot/noSpecial and special modes remain able to roll universal choices.
const savedRandom=rng.random;rng.random=()=>.999999;
for(const flag of ['recipeMode','riftMode','bossRush','endlessMode','_inTutorial']){const s=scene('barrage');s[flag]=true;assert(!s.rollBasicAttackUpgrades(3).some(c=>c.poolGroup==='path'));}
{const s=scene('barrage');assert(!s.rollBasicAttackUpgrades(3,{noSpecial:true}).some(c=>c.poolGroup==='path'));assert(s.rollBasicAttackUpgrades(3).some(c=>c.poolGroup==='path'));}
rng.random=savedRandom;
// Critical healing may replace an extra path card, but retains one path choice.
{const s=scene('barrage');s.player.hp=20;s.banishedKeys={'b:power':true,'b:rime':true,'b:chill':true};rng.random=()=>0;const out=s.rollBasicAttackUpgrades(3);assert(out.some(c=>c.type==='heal'));assert(out.some(c=>c.poolGroup==='path'));const pair=s.rollBasicAttackUpgrades(2);assert(pair.some(c=>c.type==='heal'));assert(pair.some(c=>c.poolGroup==='path'));rng.random=savedRandom;}
// Mutation and Evolution screens remain special, never replaced by a normal draft.
{const s=scene('barrage');s.basicAttack.mastery=10;assert(s.rollBasicAttackUpgrades(3).every(c=>c.mutation));s.basicAttack.mutation='chosen';s.basicAttack.mastery=20;assert(s.rollBasicAttackUpgrades(3)[0].evolution);}
for(let stage=0;stage<15;stage++)for(let wave=0;wave<5;wave++){
 const s=scene('barrage');s.stageIndex=stage;s.waveIndex=wave;s.mode='wave';s.waveObjective={type:'hunt',done:false};
 const pace=s.storySpawnPace(),late=stage>=2?Math.max(0,wave-2):0;assert(Math.abs(pace.interval-(1.6-.2*late))<1e-9);assert.equal(pace.batch,late?4+late:4+(wave>=3?1:0));
 s.maxLive=100;s._storyBudget={spawned:0,quota:72,done:false};const cap=s.storyLiveCap();let live=0;s.enemies={countActive:()=>live,children:{iterate(){}}};s.huntTargetActive=()=>true;assert(s.storyCanSpawn());live=cap;assert(!s.storyCanSpawn());live=0;s._storyBudget.spawned=72;assert(!s.storyCanSpawn());
 s._replayMeter={};assert.equal(s.storySpawnPace().interval,1.6);s._replayMeter=null;
 for(const flag of ['recipeMode','riftMode','bossRush','endlessMode','_inTutorial']){s[flag]=true;assert.equal(s.storySpawnPace().interval,1.6);s[flag]=false;}
 s.waveObjective={type:'survive'};s.waveTimer=10;assert.equal(s.storySpawnPace().interval,1.2);s.mode='boss';assert.equal(s.storySpawnPace().interval,1.6);
}
console.log('P4: real drafts across six paths, chosen-path/shared guarantees, critical healing, n=1, banish/exhaustion, weighted loot/special modes, special milestones, all-stage late pacing, hard caps, finite quotas and replay isolation passed');
