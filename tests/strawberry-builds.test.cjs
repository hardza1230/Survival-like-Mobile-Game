const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {scene:baseScene,enemy,object}=require('./mint-impaler.test.cjs');
const src=fs.readFileSync('game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'(');assert(at>=0,n);const tail=src.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return src.slice(at,at+1+next.index);}
function block(a,b){return src.slice(src.indexOf(a),src.indexOf(b));}
let seed=44;const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const ctx={Math:math,Phaser:{Utils:{Array:{Shuffle:a=>a}},Math:{FloatBetween:()=>0}},SKILL_ICON:{sprinkle:'ic_momo_power'},tagList:()=>[],tagLabel:()=>'',TAG_TIERS:[],TAG_SETS:{},WEAPON_TAGS:{},Sfx:{shoot(){},frost(){},clear(){},heal(){},beam(){},boom(){}},rollRarity:()=>({color:1,potency:1,ranks:1}),STAT_CAPS:{dmgMul:10,critChance:.8,cdMulMin:.3,speedMul:3,dmgTakenMin:.35},BALANCE:{moveSpeed:180},CF:{hurt:5}};vm.createContext(ctx);
vm.runInContext(block('const BASIC_EVO_DESC=','/* ---- BASIC ATTACK PROTOTYPE')+block('const BASIC_ATTACKS = {','// 🛤 Build Path')+block('const BASIC_PATHS={','// 🍯 Flavor Infusion')+block('const INFUSION_UP=','// 🏷️ Tag Sets')+block('const MINT_CARD_WEIGHTS=','const CHARACTER_UNIQUES = {')+block('const BUILD_PATH_STYLES=','// Mint M1:')+block('function egUpgradeDefs(','function egBuildCost('),ctx);
const api=vm.runInContext('({berryShotProfile,berryUpgradeGroup,berryAttackInfo,berryCardHeadline,egUpgradeDefs,pathMods})',ctx);
const names=['attachChargedSeed','berryBullet','berrySplash','castBerryBlaster','tickBerryCharge','releaseBerryCharge','hitBerrySeed','pathBulletDmg','_hitEnemyCore','ptOnBounce','basicAttackInfo','rollBasicAttackUpgrades','endlessCards','endlessStatDefs','getBullet','killBullet','artDelay','trackArtVfx','clearArtVfx','poseFlash','releaseSnipe','snipeMods','cancelSnipe'];
const Scene=vm.runInContext('class Scene{'+names.map(method).join('\n')+'\n}Scene',ctx);
function scene(path,foes=[]){
 for(const e of foes){e.body.halfWidth=18;e.setVelocity=function(x,y){this.body.velocity.x=x;this.body.velocity.y=y;};}
 const s=baseScene(foes);Object.setPrototypeOf(s,Scene.prototype);delete s.getBullet;delete s.mintBullet;s.character='momo';s.level=7;s.stageIndex=1;s.skills={sprinkle:1};
 s.basicAttack={character:'momo',path,lv:{},ranks:{},mastery:0,_pm:{count:0,dmg:1,cd:1},endless:{}};Object.assign(s.player,{hp:100,maxhp:100,dmgMul:1,baseSpeed:180,_pt:{}});
 s.bullets={children:{iterate(fn){s.shots.forEach(fn);}},getFirstDead(){let b=s.shots.find(b=>!b.active);if(!b){b=object();b.active=false;s.shots.push(b);}return b;}};
 s.tweens.add=()=>{};const image=s.add.image;s.add.image=(...a)=>{const o=image(...a);o.setDisplaySize=()=>o;return o;};
 Object.assign(s,{nearestEnemy:()=>foes.find(e=>e.active&&(e.isBoss||e.isMini))||foes.find(e=>e.active)||null,upTags:()=>[],tagCounts:()=>({}),modCard:()=>null,tradeCard:()=>null,popHeal(){},fusionReady:()=>null,showBanner(){},popDmg(){},shotgunKick(){},chainFrom(){},infusionOnHit(){},hitStop(){},screenShake(){},drawChargedSeed(){},drawWindTrail(){},flashBtn(){},fireRecipes(){},uniqueInfo:()=>({cd:8}),uniquePower:()=>1,uniqueCooldown:()=>8,uniqueLevel:1,snipeCharge:()=>1,uniqueCd:0,syncBasicAttack(){this.basicAttack._pm=api.pathMods(this.basicAttack);this.basicAttack.mastery=Object.values(this.basicAttack.lv).reduce((a,b)=>a+b,0)+(this.basicAttack.mutation?1:0);}});
 return s;
}
function fire(s,lvl=1){s.castBerryBlaster(lvl,false,1,s.basicAttack);if(s.basicAttack.path==='sniper')s.advance(340+60*(s.basicAttack.lv.s_draw||0));else s.advance(1000);return s.shots.filter(b=>b.active);}
// S1: actual ordinary card rolls are focused, exclude foreign paths/rate, preserve old Recipe ranks.
for(const path of ['sniper','shotgun','ricochet']){
 const s=scene(path),pool=s.rollBasicAttackUpgrades(99,{noSpecial:true});assert(pool.some(c=>c.poolGroup==='path'));assert(pool.some(c=>c.poolGroup==='shared'));assert(pool.some(c=>c.poolGroup==='universal'));
 assert(pool.some(c=>c.key==='rate')===(path==='ricochet'));assert(pool.some(c=>c.key==='s_draw')===(path==='sniper'));assert(pool.some(c=>c.key==='s_slug')===(path==='shotgun'));assert(pool.some(c=>c.key==='s_seek')===(path==='ricochet'));
 s.player.hp=20;assert(s.rollBasicAttackUpgrades(3,{noSpecial:true}).some(c=>c.key==='sweetRecovery'));assert(!api.egUpgradeDefs('momo',{path,lv:{}}).some(u=>u.id==='rate')===(path!=='ricochet'));assert(api.egUpgradeDefs('momo',{path,lv:{rate:2}}).some(u=>u.id==='rate'));
}
{const s=scene('sniper'),c=s.rollBasicAttackUpgrades(99,{noSpecial:true}).find(c=>c.key==='volley');assert(c.title==='Dense Chamber');assert(c.headline.includes('100% → 112%'));c.apply();assert.equal(s.basicAttack.ranks.volley,1);assert.equal(api.berryShotProfile(1,false,s.basicAttack).power,1.12);}
// Statistical weights are per draw, exhausted pools are already covered by Mint's common sampler.
{const s=scene('ricochet'),counts={path:0,shared:0,universal:0};for(let k=0;k<10000;k++)counts[s.rollBasicAttackUpgrades(1,{noSpecial:true})[0].poolGroup]++;assert(counts.path>6000&&counts.path<7000);assert(counts.shared>1700&&counts.shared<2300);assert(counts.universal>1200&&counts.universal<1800);}
// S3: one automatic charge, only successful release, count investment always changes power.
{const s=scene('sniper',[enemy()]);s.castBerryBlaster(1,false,1,s.basicAttack);s.castBerryBlaster(1,false,1,s.basicAttack);assert.equal(s.queue.length,1);assert.equal(s.shots.length,0);s.advance(340);assert.equal(s.shots.length,1);assert.equal(s.shots[0].dmg,6.75*3.2);assert(s.shots[0].berrySeed.full);}
{const a=scene('sniper',[enemy()]),b=scene('sniper',[enemy()]);b.basicAttack.ranks.volley=1;const x=fire(a)[0],y=fire(b)[0];assert(Math.abs(y.dmg/x.dmg-1.12)<1e-9);assert.equal(b.shots.length,1);}
{const s=scene('sniper',[enemy()]);s.basicAttack.lv.s_draw=3;s.castBerryBlaster(1,false,1,s.basicAttack);s.advance(340);assert.equal(s.shots.length,0);s.advance(180);assert(Math.abs(s.shots[0].dmg-21.6*1.45)<1e-9);}
for(const partial of ['release','hurt']){const s=scene('sniper',[enemy()]);s.castBerryBlaster(1,false,1,s.basicAttack);s.advance(100);if(partial==='hurt')s.poseFlash(5,160);else s.releaseBerryCharge(false);assert.equal(s.shots.length,1);assert(s.shots[0].dmg<21.6);assert(!s.shots[0].berrySeed.full);s.advance(1000);assert.equal(s.shots.length,1);}
{const s=scene('sniper',[enemy()]);s.basicAttack.evolved=true;const b=fire(s)[0];assert(Math.abs(b.dmg-21.6*1.24*1.3)<1e-9);assert.equal(b.berrySeed.pierces,10);assert.equal(s.basicAttackInfo().evolution,'Heart Railgun');}
// Focused Chamber remains one straight shot; old gear/Talent investments are kept.
{const s=scene('sniper',[enemy({x:100})]);s.basicAttack.mutation='fan';s.player.gearCount=2;s.player._pt={sDmg:.2,big:.15,hs:.1};const b=fire(s)[0];assert.equal(s.shots.length,1);assert(Math.abs(b.dmg-21.6*1.48*1.2)<1e-9);assert.equal(b.bigMul,.15);assert.equal(b.headshot,.1);}
// S2: evolved Ricochet still bounces; same lifetime never hits twice, growth is additive and capped.
{const foes=Array.from({length:12},(_,i)=>enemy({x:20*i,_glacierLifeToken:1})),s=scene('ricochet',foes);s.basicAttack.evolved=true;s.basicAttack.lv.carom=3;s.basicAttack.ranks.gather=3;s.basicAttack.mutation='ricochet';const b=fire(s)[0];assert(!b.pierce);assert.equal(b.bounce,8);const base=b.dmg;
 for(let k=0;k<9;k++){b.x=foes[k].x;s.hitBerrySeed(b,foes[k]);const n=s.hits.length;s.hitBerrySeed(b,foes[k]);assert.equal(s.hits.length,n);assert(b.dmg<=base*2.2+1e-9);}assert(!b.active);assert.equal(b.berrySeed.visited.size,9);assert(Math.abs(b.dmg-base*2.2)<1e-9);}
{const e=enemy({isBoss:true}),s=scene('ricochet',[e]);s.basicAttack.lv.s_return=2;const b=fire(s)[0];s.hitBerrySeed(b,e);assert.equal(s.hits.length,2);assert(Math.abs(s.hits[1].n-b.berrySeed.base*.53)<1e-9);}
{const e=enemy({isBoss:true,_phaseInvuln:1}),s=scene('ricochet',[e]);const b=fire(s)[0];s.hitBerrySeed(b,e);assert.equal(s.hits.length,0);}
{const e=enemy({_glacierLifeToken:1}),s=scene('sniper',[e]),b=fire(s)[0];s.hitBerrySeed(b,e);s.hitBerrySeed(b,e);assert.equal(s.hits.length,1);e._glacierLifeToken=2;s.hitBerrySeed(b,e);assert.equal(s.hits.length,2);}
// Returning seed and split Talents preserve combat value under shared limits.
{const foes=[enemy(),enemy({x:50})],s=scene('ricochet',foes);s.player._pt.boomer=true;const b=fire(s)[0];s.hitBerrySeed(b,foes[0]);b.x=50;s.hitBerrySeed(b,foes[1]);assert(b.active&&b._boomed&&b.pierce);const n=s.hits.length;s.hitBerrySeed(b,foes[0]);assert.equal(s.hits.length,n);}
// S4: pellets stay non-piercing, near > far, heavy center and count overflow work after Evolution.
{const e=enemy({isBoss:true,x:80}),s=scene('shotgun',[e]);s.basicAttack.evolved=true;s.basicAttack.lv.s_slug=1;const shots=fire(s);assert.equal(shots.length,8);assert(shots.every(b=>!b.pierce));assert(shots[3].dmg>shots[0].dmg);assert.equal(s.basicAttackInfo().evolution,'Petal Breacher');const first=shots[0];s.hitBerrySeed(first,e);assert(Math.abs(s.hits[0].n-first.dmg*2*1.4*1.2)<1e-9);}
{const s=scene('shotgun',[enemy()]);s.player.gearCount=20;s.basicAttack.evolved=true;const p=api.berryShotProfile(1,false,s.basicAttack,s.player);assert.equal(p.count,12);assert(p.power>1);assert.equal(fire(s).length,12);}
// All seed lifecycles, including delayed volleys, reject a replaced basic/new run.
for(const path of ['sniper','shotgun','ricochet'])for(const leave of ['clear','menu','replace']){
 const s=scene(path,[enemy()]);s.basicAttack.ranks.volley=3;s.player._pt.dbarrel=true;s._sgVol=3;s.castBerryBlaster(1,false,1,s.basicAttack);const count=s.shots.length;
 if(leave==='clear')s.clearArtVfx();else if(leave==='menu')s.state='menu';else s.basicAttack={path};s.advance(2000);assert.equal(s.shots.length,count);
}
{const e=enemy(),s=scene('ricochet',[e]),b=fire(s)[0];s.clearArtVfx();s.hitBerrySeed(b,e);assert.equal(s.hits.length,0);assert(!b.active);}
// Real pooling resets all seed/shotgun/sniper metadata and art.
{const s=scene('shotgun',[enemy()]),b=fire(s)[0];b.sgPellet=true;b._ptSniper=true;b.active=false;const fresh=s.getBullet(0,0,1,.2);assert.equal(fresh.berrySeed,null);assert.equal(fresh.sgPellet,false);assert.equal(fresh._ptSniper,false);}
// S5: 500 foes/100 casts cannot exceed 32 active Strawberry shots; splash max16, VFX max3/200ms.
{const foes=Array.from({length:500},(_,i)=>enemy({x:i%20})),s=scene('ricochet',foes);s.basicAttack.ranks.volley=3;s.basicAttack.evolved=true;for(let k=0;k<100;k++)s.castBerryBlaster(1,false,1,s.basicAttack);s.advance(1000);assert.equal(s.shots.filter(b=>b.active).length,32);let fx=0;s.vfxHitRing=()=>fx++;for(let k=0;k<100;k++)s.berrySplash(0,0,1,100);assert.equal(s.hits.length,1600);assert.equal(fx,3);}
// Actual manual Unique: evolved Perfect Shot gains 40%; charge cards stay Unique-only.
for(const evo of [false,true]){const e=enemy({isBoss:true,x:100}),s=scene('sniper',[e]);s.basicAttack.evolved=evo;s._snipe={ang:0,blast:false,kind:null};s.releaseSnipe();assert(Math.abs(s.hits[0].n-82*2*1.25*1.2*(evo?1.4:1))<1e-9);}
{const s=scene('sniper',[enemy({x:100})]);s.player._pt.railgun=true;s._snipe={ang:0,kind:null};s.releaseSnipe();const n=s.hits.length;s.clearArtVfx();s.advance(500);assert.equal(s.hits.length,n);}
assert(src.includes("if(basic&&this.character==='momo'){this.castBerryBlaster(lvl,aw,dm,basic);return;}"));
console.log('Strawberry S1–S5: focused rolls/previews, saved ranks, charge/count conversion, evolved bounce/lifetimes, boss fallback/phase gates, non-piercing shotgun, Unique and dense-crowd lifecycle budgets passed');
