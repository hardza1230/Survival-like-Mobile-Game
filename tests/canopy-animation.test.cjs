const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,n);return source.slice(at,at+1+next.index);}
const start=source.indexOf('const ASSET_SHEETS ='),end=source.indexOf('\n};',start)+3;
const defs=vm.runInNewContext(source.slice(start,end)+'\nASSET_SHEETS');
const regStart=source.indexOf('function registerEnemyActionAnimations('),regEnd=source.indexOf('const ASSET_SHEETS =',regStart);
const register=vm.runInNewContext(source.slice(regStart,regEnd)+'\nregisterEnemyActionAnimations',{ASSET_SHEETS:defs});
const ids=['sprout','vine_hunter','spore_lantern','fruit_pod','root_beetle','thorn_oracle'];
const textures=new Set(ids.map(id=>'c21_'+id+'_animated')),clips=new Map();
const anims={exists:k=>clips.has(k),generateFrameNumbers:(key,{start,end})=>Array.from({length:end-start+1},(_,i)=>({key,frame:start+i})),create(c){clips.set(c.key,c);}};
for(const key of textures){assert.equal(defs[key].frame,256);assert.equal(defs[key].anim.frames,6);anims.create({key:key+'_walk'});}
register({anims,textures:{exists:k=>textures.has(k)}});
const curves=(i,a,t=1.18)=>i<a.length?a[i]:a.at(-1)*t**(i-a.length+1);
const names=['canopyArtKey','antArtKey','drainArtKey','fireArtKey','iceArtKey','stage5ArtKey','chapter3ArtKey','antSpitWindup','warnAntBomber','stopEnemyPresentation','resetEnemyPresentation','enemyAction','tickEnemyPresentation','spawnEnemy','spawnElite','playEnemyDeath'];
const Scene=vm.runInNewContext('class Scene{'+names.map(method).join('\n')+'\n}Scene',{Math,Phaser:{Math:{FloatBetween:a=>a}},stageCurveValue:curves,ASSET_SHEETS:defs,BALANCE:{}});
function mob(x,y,key){return {active:true,x,y,texture:{key},body:{velocity:{x:0,y:0}},anims:{isPlaying:false,isPaused:false,stop(){this.isPlaying=false;this.isPaused=false;},pause(){this.isPaused=true;},resume(){this.isPaused=false;}},setTexture(k,f){this.texture={key:k};this.frame=f;return this;},setActive(a){this.active=a;return this;},setVisible(){return this;},setPosition(x,y){this.x=x;this.y=y;return this;},setCircle(...c){this.circle=c;return this;},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;},setVelocity(x,y){this.body.velocity={x,y};return this;},setFlipX(){return this;},setTint(){return this;},clearTint(){return this;},play(k){this.clip=k;this.anims.isPlaying=true;return this;}};}
const s=new Scene();let recycled=null;
Object.assign(s,{stageIndex:5,waveIndex:0,W:300,H:500,viewZoom:1,player:{x:0,y:0},textures:{exists:k=>textures.has(k)},anims,enemies:{countActive:()=>0,getFirstDead:()=>recycled,create:mob},getPowerGuide:()=>({enemyHp:1,enemyDmg:1}),killPowerMul:()=>1,diffMul:()=>({hp:1,dmg:1}),newbieEase:()=>1,clearObjectiveTargetFx(){},camWorld:o=>o,vfxSpawnPoof(){}});
const roles=[['basic','sprout',19,10,58,1,.38,[45,83,83],0],['fast','vine_hunter',10,9,122,1,.38,[43,85,85],1],['dasher','vine_hunter',16,14,70,2,.38,[43,85,85],1],['shooter','spore_lantern',19,9,62,2,.40,[44,84,84],2],['bomber','fruit_pod',24,12,70,2,.42,[47,81,81],3],['tank','root_beetle',80,18,36,4,.48,[53,75,75],4],['siege','thorn_oracle',260,24,24,10,.48,[50,78,78],5]];
for(const [type,id,hp,dmg,speed,xp,scale,circle,oldFrame] of roles){
 const key='c21_'+id+'_animated',e=s.spawnEnemy(type,0,100);
 assert.equal(e.texture.key,key);assert.equal(e._enemyArtKey,key);assert.equal(e._enemyRestFrame,0);assert.equal(e.baseScale,scale);assert.deepEqual(e.circle,circle);
 assert(Math.abs(e.hp-hp*3.72/.9)<1e-8);assert.equal(e.dmg,Math.round(dmg*1.3*1.42));assert.equal(e.spd,speed);assert.equal(e.xp,xp);assert.equal(e.clip,key+'_idle');
 e.setVelocity(speed,0);s.tickEnemyPresentation(e,.016);assert.equal(e.clip,key+'_walk');
 s.enemyAction(e,'attack',340);assert.equal(e.clip,key+'_attack');s.enemyAction(e,'hurt',120);assert.equal(e._enemyAction.state,'attack');
 e.frozen=1;s.tickEnemyPresentation(e,2);assert.equal(e._enemyActionT,.34);assert(e.anims.isPaused);e.frozen=0;s.tickEnemyPresentation(e,.35);assert.equal(e._enemyAction,null);assert.equal(e.clip,key+'_walk');
 s.enemyAction(e,'hurt',120);assert.equal(e.clip,key+'_hurt');
 textures.delete(key);const fallback=s.spawnEnemy(type,0,100);assert.equal(fallback.texture.key,'ch2_enemy_atlas');assert.equal(fallback._enemyRestFrame,oldFrame);assert.equal(fallback.baseScale,scale);assert.deepEqual(fallback.circle,circle);textures.add(key);
}
const shot=s.spawnEnemy('shooter',0,100);shot.shootCd=.1;s.antSpitWindup(shot);assert.equal(shot.clip,'c21_spore_lantern_animated_windup');assert.equal(shot.shootCd,.1);
const dash=s.spawnEnemy('dasher',0,100);s.enemyAction(dash,'windup',500);assert.equal(dash.clip,'c21_vine_hunter_animated_windup');s.enemyAction(dash,'dash',320);assert.equal(dash.clip,'c21_vine_hunter_animated_dash');assert.equal(dash.dashState,'chase');
const bomb=s.spawnEnemy('bomber',0,100);bomb.hp=bomb.maxhp*.3;s.warnAntBomber(bomb);assert.equal(bomb.clip,'c21_fruit_pod_animated_windup');const warning=bomb._enemyAction;s.warnAntBomber(bomb);assert.equal(bomb._enemyAction,warning);
recycled=bomb;const reuse=s.spawnEnemy('basic',0,100);assert.equal(reuse,bomb);assert.equal(reuse._antBombWarn,false);assert.equal(reuse.bomber,false);assert.equal(reuse._enemyAction,null);assert.equal(reuse.clip,'c21_sprout_animated_idle');recycled=null;
const elite=s.spawnElite();assert.equal(elite.texture.key,'ch2_enemy_atlas');assert.equal(elite._enemyRestFrame,6);assert.equal(elite.roleName,'Crown Sapling');assert.equal(elite.baseScale,.42);assert.deepEqual(elite.circle,[48,80,80]);assert(Math.abs(elite.hp-70*3.35*1.15/.9)<1e-8);assert.equal(elite.spd,48);assert.equal(elite.dmg,Math.round(18*1.3*1.42));
let ghosts=0,complete;const ghost={setScale(){return this;},setFlipX(){return this;},setDepth(){return this;},once(event,f){assert.equal(event,'animationcomplete');complete=f;},play(key){assert.equal(key,'c21_sprout_animated_death');},destroy(){this.destroyed=true;}};
Object.assign(s,{fxOk:()=>true,trackArtVfx:o=>o,add:{sprite(){ghosts++;return ghost;}}});s.playEnemyDeath(reuse);assert.equal(ghosts,1);complete();assert(ghost.destroyed);
const at=source.indexOf('const STAGE_SHEETS='),last=source.indexOf('\n];',at)+3,stages=vm.runInNewContext(source.slice(at,last)+'\nSTAGE_SHEETS');
const packing=JSON.parse(fs.readFileSync('assets/incoming/ch2_s1_animations/PACKING.json','utf8'));
for(const id of ids){const stem='c21_'+id,key=stem+'_animated';assert(stages[5].includes(key));for(const i of [4,6,7,8,9,10])assert(!stages[i].includes(key));
 const png=fs.readFileSync('assets/incoming/ch2_s1_animations/'+stem+'_sheet.png');assert.equal(png.readUInt32BE(16),1024);assert.equal(png.readUInt32BE(20),1024);assert.equal(png[25],6);
 const b=fs.readFileSync(defs[key].url);assert.equal(b.toString('ascii',12,16),'VP8L');const dim=b.readUInt32LE(21);assert(dim&(1<<28));assert.equal((dim&0x3fff)+1,1024);assert.equal(((dim>>>14)&0x3fff)+1,1024);
 assert.equal(packing[stem].bounds.length,16);for(const [x,y,w,h] of packing[stem].bounds){assert(x>=10&&y>=10);assert.equal(y+h,236);assert(x+w<=246);assert(Math.abs(x+w/2-128)<=.5);}
 assert.deepEqual(Array.from(clips.get(key+'_death').frames,f=>f.frame),[14,15]);
}
console.log('Canopy: seven roles, original balance/colliders, six sheets, fallback, action/freeze/pool reuse, unchanged Crown Sapling and authored death passed');
