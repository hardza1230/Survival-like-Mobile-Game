const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,n);return source.slice(at,at+1+next.index);}
const start=source.indexOf('const ASSET_SHEETS ='),end=source.indexOf('\n};',start)+3;
const defs=vm.runInNewContext(source.slice(start,end)+'\nASSET_SHEETS');
const balanceStart=source.indexOf('const BALANCE ='),balanceEnd=source.indexOf('\n};',balanceStart)+3;
const balance=vm.runInNewContext(source.slice(balanceStart,balanceEnd)+'\nBALANCE');
assert.equal(balance.c2Nectar.hp,1.12);assert.equal(balance.c2Nectar.dmg,1.08);assert.equal(balance.c2Nectar.speed,1.06);assert.equal(balance.c2Nectar.maxLive,96);
const regStart=source.indexOf('function registerEnemyActionAnimations('),regEnd=source.indexOf('const ASSET_SHEETS =',regStart);
const register=vm.runInNewContext(source.slice(regStart,regEnd)+'\nregisterEnemyActionAnimations',{ASSET_SHEETS:defs});
const ids=['drone','dartwing','pollen_sniper','honey_bomb','wax_guard','choir_moth','grub'];
const textures=new Set(ids.map(id=>'c23_'+id+'_animated')),clips=new Map();
const anims={exists:k=>clips.has(k),generateFrameNumbers:(key,{start,end})=>Array.from({length:end-start+1},(_,i)=>({key,frame:start+i})),create(c){clips.set(c.key,c);}};
for(const key of textures){assert.equal(defs[key].frame,256);assert.equal(defs[key].anim.frames,6);anims.create({key:key+'_walk'});}
register({anims,textures:{exists:k=>textures.has(k)}});
const curves=(i,a,t=1.18)=>i<a.length?a[i]:a.at(-1)*t**(i-a.length+1);
const names=['nectarArtKey','myceliumArtKey','canopyArtKey','antArtKey','drainArtKey','fireArtKey','iceArtKey','stage5ArtKey','chapter3ArtKey','antSpitWindup','warnAntBomber','stopEnemyPresentation','resetEnemyPresentation','enemyAction','tickEnemyPresentation','spawnEnemy','spawnElite','playEnemyDeath'];
const Scene=vm.runInNewContext('class Scene{'+names.map(method).join('\n')+'\n}Scene',{Math,Phaser:{Math:{FloatBetween:a=>a,Between:a=>a}},stageCurveValue:curves,ASSET_SHEETS:defs,BALANCE:balance});
function mob(x,y,key){return {active:true,x,y,texture:{key},body:{velocity:{x:0,y:0}},anims:{isPlaying:false,isPaused:false,stop(){this.isPlaying=false;this.isPaused=false;},pause(){this.isPaused=true;},resume(){this.isPaused=false;}},setTexture(k,f){this.texture={key:k};this.frame=f;return this;},setActive(a){this.active=a;return this;},setVisible(){return this;},setPosition(x,y){this.x=x;this.y=y;return this;},setCircle(...c){this.circle=c;return this;},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;},setVelocity(x,y){this.body.velocity={x,y};return this;},setFlipX(){return this;},setTint(){return this;},clearTint(){return this;},play(k){this.clip=k;this.anims.isPlaying=true;return this;}};}
function aura(){return {active:true,setTint(v){this.tint=v;return this;},setDisplaySize(w,h){this.size=[w,h];return this;},setAlpha(v){this.alpha=v;return this;},setDepth(v){this.depth=v;return this;},destroy(){this.active=false;}};}
const s=new Scene();let recycled=null,live=0;
Object.assign(s,{stageIndex:7,waveIndex:0,W:300,H:500,viewZoom:1,player:{x:0,y:0},textures:{exists:k=>textures.has(k)},anims,enemies:{countActive:()=>live,getFirstDead:()=>recycled,create:mob},getPowerGuide:()=>({enemyHp:1,enemyDmg:1}),killPowerMul:()=>1,diffMul:()=>({hp:1,dmg:1}),newbieEase:()=>1,clearObjectiveTargetFx(){},camWorld:o=>o,vfxSpawnPoof(){},add:{image:()=>aura()}});
const roles=[['basic','drone',19,10,58,1,.37,[43,85,85],0],['fast','dartwing',10,9,122,1,.36,[42,86,86],1],['dasher','dartwing',16,14,70,2,.36,[42,86,86],1],['shooter','pollen_sniper',19,9,62,2,.39,[44,84,84],2],['bomber','honey_bomb',24,12,70,2,.42,[47,81,81],3],['tank','wax_guard',80,18,36,4,.47,[53,75,75],4],['siege','choir_moth',260,24,24,10,.43,[48,80,80],5],['grub','grub',19,10,58,1,.25,[34,94,94],6]];
for(const [type,id,hp,dmg,speed,xp,scale,circle,oldFrame] of roles){
 const key='c23_'+id+'_animated',e=s.spawnEnemy(type,0,100);
 assert.equal(e.texture.key,key);assert.equal(e._enemyArtKey,key);assert.equal(e._enemyRestFrame,0);assert.equal(e.baseScale,scale);assert.deepEqual(e.circle,circle);
 assert(Math.abs(e.hp-hp*3.72*1.18**2*1.12/.9)<1e-8);assert.equal(e.dmg,Math.round(dmg*1.3*1.42*1.09**2*1.08));assert.equal(e.spd,speed*1.06);assert.equal(e.xp,xp);assert.equal(e.clip,key+'_idle');
 if(type==='tank'){assert.deepEqual(e._aura.size,[225,160]);assert.equal(e._aura.tint,0xffc95c);assert.equal(e._aura.alpha,.32);}if(type==='siege'){assert(e.shooter);assert.equal(e.shootCd,1.4);assert.equal(e.nectarRole,'choirMoth');}
 e.setVelocity(speed,0);s.tickEnemyPresentation(e,.016);assert.equal(e.clip,key+'_walk');
 s.enemyAction(e,'attack',340);assert.equal(e.clip,key+'_attack');s.enemyAction(e,'hurt',120);assert.equal(e._enemyAction.state,'attack');
 e.frozen=1;s.tickEnemyPresentation(e,2);assert.equal(e._enemyActionT,.34);assert(e.anims.isPaused);e.frozen=0;s.tickEnemyPresentation(e,.35);assert.equal(e._enemyAction,null);assert.equal(e.clip,key+'_walk');
 s.enemyAction(e,'hurt',120);assert.equal(e.clip,key+'_hurt');
 textures.delete(key);const fallback=s.spawnEnemy(type,0,100);assert.equal(fallback.texture.key,'ch2_nectar_enemy_atlas');assert.equal(fallback._enemyRestFrame,oldFrame);assert.equal(fallback.baseScale,scale);assert.deepEqual(fallback.circle,circle);textures.add(key);
}
for(const type of ['shooter','siege']){const e=s.spawnEnemy(type,0,100);e.shootCd=.1;s.antSpitWindup(e);assert.equal(e.clip,e._enemyArtKey+'_windup');assert.equal(e.shootCd,.1);}
const dash=s.spawnEnemy('dasher',0,100);s.enemyAction(dash,'windup',500);assert.equal(dash.clip,'c23_dartwing_animated_windup');s.enemyAction(dash,'dash',320);assert.equal(dash.clip,'c23_dartwing_animated_dash');assert.equal(dash.dashState,'chase');
const bomb=s.spawnEnemy('bomber',0,100);bomb.hp=bomb.maxhp*.3;s.warnAntBomber(bomb);assert.equal(bomb.clip,'c23_honey_bomb_animated_windup');const warning=bomb._enemyAction;s.warnAntBomber(bomb);assert.equal(bomb._enemyAction,warning);
recycled=bomb;const reuse=s.spawnEnemy('grub',0,100);assert.equal(reuse,bomb);assert.equal(reuse._antBombWarn,false);assert.equal(reuse.bomber,false);assert.equal(reuse._enemyAction,null);assert.equal(reuse.clip,'c23_grub_animated_idle');assert.equal(reuse.nectarRole,'grub');assert.equal(reuse.xp,1);recycled=null;
let ghosts=0,complete;const ghost={setScale(){return this;},setFlipX(){return this;},setDepth(){return this;},once(event,f){assert.equal(event,'animationcomplete');complete=f;},play(key){assert.equal(key,'c23_grub_animated_death');},destroy(){this.destroyed=true;}};
s.fxOk=()=>true;s.trackArtVfx=o=>o;s.add.sprite=()=>{ghosts++;return ghost;};s.playEnemyDeath(reuse);assert.equal(ghosts,1);complete();assert(ghost.destroyed);
const elite=s.spawnElite();assert.equal(elite.texture.key,'e_tank');assert.equal(elite._enemyRestFrame,0);assert.equal(elite.baseScale,1.55);assert.deepEqual(elite.circle,[26,5,5]);
const at=source.indexOf('const STAGE_SHEETS='),last=source.indexOf('\n];',at)+3,stages=vm.runInNewContext(source.slice(at,last)+'\nSTAGE_SHEETS');
assert(stages[7].includes('ch2_nectar_enemy_atlas'));assert(stages[7].includes('boss8_hornet_queen'));assert(stages[7].includes('mb8_royal_stinger'));
const packing=JSON.parse(fs.readFileSync('assets/incoming/ch2_s3_animations/PACKING.json','utf8'));
for(const id of ids){const stem='c23_'+id,key=stem+'_animated';assert(stages[7].includes(key));for(const i of [4,5,6,8,9,10])assert(!stages[i].includes(key));
 const png=fs.readFileSync('assets/incoming/ch2_s3_animations/'+stem+'_sheet.png');assert.equal(png.readUInt32BE(16),1024);assert.equal(png.readUInt32BE(20),1024);assert.equal(png[25],6);
 const b=fs.readFileSync(defs[key].url);assert.equal(b.toString('ascii',12,16),'VP8L');const dim=b.readUInt32LE(21);assert(dim&(1<<28));assert.equal((dim&0x3fff)+1,1024);assert.equal(((dim>>>14)&0x3fff)+1,1024);
 assert.equal(packing[stem].bounds.length,16);for(const [x,y,w,h] of packing[stem].bounds){assert(x>=10&&y>=10);assert.equal(y+h,236);assert(x+w<=246);assert(Math.abs(x+w/2-128)<=.5);}
 assert.deepEqual(Array.from(clips.get(key+'_death').frames,f=>f.frame),[14,15]);
}
console.log('Nectar: eight roles, seven sheets, original combat/colliders/shield aura, both shooters, dash, fallback/freeze/pool reuse and authored defeat passed');
assert(source.includes("['drone','honeyBomb','dartwing'].includes(e.nectarRole)"));assert(source.includes("e.nectarRole==='choirMoth'"));assert(source.includes("this.stageIndex===7?.74"));
