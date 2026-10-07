const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'(');assert(at>=0,n);const tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
function block(from,to){return source.slice(source.indexOf(from),source.indexOf(to));}
let seed=7;const rng=Object.create(Math);rng.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const ctx={Math:rng,Phaser:{Utils:{Array:{Shuffle:a=>a}},Math:{FloatBetween:(a,b)=>(a+b)/2}},SKILL_ICON:{frost:'ic_frost'},tagList:()=>[],tagLabel:()=>'',TAG_TIERS:[],TAG_SETS:{},WEAPON_TAGS:{},Sfx:{clear(){},frost(){},heal(){}},rollRarity:()=>({color:1,potency:1,ranks:1}),STAT_CAPS:{dmgMul:10,critChance:.8,cdMulMin:.3,speedMul:3,dmgTakenMin:.35},BALANCE:{moveSpeed:180}};
vm.createContext(ctx);
vm.runInContext(block('const BASIC_ATTACKS = {','// 🛤 Build Path')+block('const BASIC_PATHS={','// 🍯 Flavor Infusion')+block('const INFUSION_UP=', '// 🏷️ Tag Sets')+block('const MINT_CARD_WEIGHTS=', 'const CHARACTER_UNIQUES = {')+block('const BUILD_PATH_STYLES=', '// Mint M1:')+block('const BASIC_EVO_DESC=', '/* ---- BASIC ATTACK PROTOTYPE')+block('function egUpgradeDefs(', 'function egBuildCost('),ctx);
const api=vm.runInContext('({BASIC_ATTACKS,BASIC_PATHS,mintUpgradeGroup,mintVolleyProfile,pickMintCards,pathMods,egUpgradeDefs})',ctx);
const Scene=vm.runInContext('class Scene{'+['rollBasicAttackUpgrades','endlessCards','endlessStatDefs','castFrostLance'].map(method).join('\n')+'\n}Scene',ctx);
function scene(path,character='mint'){
 const s=new Scene();Object.assign(s,{character,level:7,stageIndex:1,player:{hp:100,maxhp:100,dmgMul:1,baseSpeed:180,active:true,x:0,y:0},basicAttack:{character,path,lv:{},ranks:{},mastery:0},skills:{frost:1,sprinkle:1},basicAttackInfo:()=>api.BASIC_ATTACKS[character],upTags:()=>[],tagCounts:()=>({}),syncBasicAttack(){this.basicAttack._pm=api.pathMods(this.basicAttack);this.basicAttack.mastery=Object.values(this.basicAttack.lv).reduce((a,b)=>a+b,0);},modCard:()=>null,tradeCard:()=>null,showBanner(){},popHeal(){},fusionReady:()=>null});return s;
}
assert.deepEqual(Array.from(api.BASIC_PATHS.mint,p=>p.id),['glacier','barrage','pierce']);
assert.deepEqual(Array.from(api.BASIC_PATHS.mint,p=>p.name),['Glacier Bloom Build','Barrage Build','Crystal Impaler Build']);
// Repeated real rolls must exclude other paths and preserve early investments.
for(const path of ['glacier','barrage','pierce']){
 const s=scene(path);s.basicAttack.lv.rate=2;s.basicAttack.ranks.rate=2;
 const allowed=new Set(api.BASIC_PATHS.mint.find(p=>p.id===path).upgrades.map(u=>u.id));
 for(let i=0;i<600;i++){
  const cards=s.rollBasicAttackUpgrades(3,{noSpecial:true});assert.equal(cards.length,3);assert.equal(new Set(cards.map(c=>c.key)).size,3);
  for(const c of cards){if(c.key.startsWith('endless_'))continue;if(['power','rime','chill'].includes(c.key))continue;
   if(c.key==='rate'||c.key==='linger'){assert(api.mintUpgradeGroup(path,c.key));continue;}assert(allowed.has(c.key),path+': '+c.key);}
 }
 assert.equal(s.basicAttack.ranks.rate,2);
 s.basicAttack.infusion='minty';assert(api.egUpgradeDefs('mint',{path,inf:'minty'}).some(u=>u.id==='inf_deep'));
}
// Exact category boundaries, distribution and exhausted-pool fallback.
const pool=()=>['path','shared','universal'].map(group=>({group,w:1,card:{key:group}}));
const counts={path:0,shared:0,universal:0};for(let i=0;i<30000;i++)counts[api.pickMintCards(pool(),1)[0].poolGroup]++;
for(const [g,w] of Object.entries({path:.65,shared:.20,universal:.15}))assert(Math.abs(counts[g]/30000-w)<.012,g);
assert.equal(api.pickMintCards(pool().filter(e=>e.group!=='path'),3).length,2);
assert.equal(api.pickMintCards([],3).length,0);
const full=scene('barrage');for(const u of [...api.BASIC_ATTACKS.mint.upgrades,...api.BASIC_PATHS.mint.find(p=>p.id==='barrage').upgrades])full.basicAttack.lv[u.id]=u.max;
assert.equal(full.rollBasicAttackUpgrades(3,{noSpecial:true}).length,3);
const hurt=scene('pierce');hurt.player.hp=10;const recovery=hurt.rollBasicAttackUpgrades(3,{noSpecial:true}).find(c=>c.key==='sweetRecovery');assert(recovery);recovery.apply();assert.equal(hurt.player.hp,35);
// Path choice happens once and special progression is retained.
const choice=scene(null);const paths=choice.rollBasicAttackUpgrades(3);assert.equal(paths.length,3);paths.find(c=>c.key==='pierce').apply();assert.equal(choice.basicAttack.path,'pierce');
choice.basicAttack.mastery=10;assert(choice.rollBasicAttackUpgrades(3).every(c=>c.mutation));choice.basicAttack.mutation='blizzard';choice.basicAttack.mastery=16;assert(choice.rollBasicAttackUpgrades(3)[0].evolution);
// Barrage extra lance is useful both before and after Evolution, including gear/talent bonuses.
const b=scene('barrage');b.syncBasicAttack();const cards=b.rollBasicAttackUpgrades(99,{noSpecial:true});const quiver=cards.find(c=>c.key==='p_quiver');assert(quiver);quiver.apply();assert.equal(b.basicAttack.lv.p_quiver,1);assert.equal(b.basicAttack._pm.count,2);
assert.equal(api.mintVolleyProfile(1,false,2,'barrage').count,3);assert.equal(api.mintVolleyProfile(4,false,2,'barrage').shardMul,1.18);
assert(Math.abs(api.mintVolleyProfile(5,true,2,'barrage').shardMul-1.36)<1e-9);
assert.equal(api.mintVolleyProfile(5,true,4,'barrage').count,3);
for(const path of ['glacier','pierce',null]){assert.equal(api.mintVolleyProfile(5,true,4,path).count,4);assert.equal(api.mintVolleyProfile(5,true,4,path).shardMul,1);}
// Actual cast output: cap, converted shard damage and unchanged direct lance damage.
function cast(count,evolved){const s=scene('barrage'),shots=[];Object.assign(s,{nearestEnemy:()=>null,trackArtVfx:o=>o,mintBullet(...a){return this.getBullet(...a);},artDelay(){},queueHailstorm(){},poseAttack(){},camWorld:o=>o,add:{image:()=>({setTint(){return this;},setDepth(){return this;},setScale(){return this;},setAlpha(){return this;}})},textures:{exists:()=>true},tweens:{add(){}},time:{delayedCall(){}},physics:{velocityFromRotation(){}},state:'play',hitCratesInRadius(){},getBullet(){const b={body:{velocity:{}},setTexture(){return this;},setTint(){return this;},setScale(){return this;}};shots.push(b);return b;}});s.castFrostLance(5,false,1,{path:'barrage',lv:{},ranks:{},_pm:{count},evolved});return shots;}
const base=cast(1,true),extra=cast(2,true);assert.equal(extra.length,3);assert.equal(extra[0].dmg,base[0].dmg);assert(Math.abs(extra[0].shatterInfo.dmg/base[0].shatterInfo.dmg-1.36/1.18)<1e-9);
// Endgame saves keep, count and apply previously invested off-path ranks; new builds cannot add them.
assert(!api.egUpgradeDefs('mint',{path:'pierce',lv:{}}).some(u=>u.id==='rate'));
assert(api.egUpgradeDefs('mint',{path:'pierce',lv:{rate:2,linger:1}}).some(u=>u.id==='rate'));
// Strawberry now also has a focused pool; other hero changes remain independent.
const momo=scene('shotgun','momo');assert(momo.rollBasicAttackUpgrades(3,{noSpecial:true}).every(c=>c.type==='basic'&&c.poolGroup));
console.log('Mint M1: actual card rolls, exclusions, weighting, exhaustion, heal, specials, saved ranks and actual capped casts passed');
