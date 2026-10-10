const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,n);return source.slice(at,at+1+next.index);}
const start=source.indexOf('const ASSET_SHEETS ='),end=source.indexOf('\n};',start)+3;
const defs=vm.runInNewContext(source.slice(start,end)+'\nASSET_SHEETS');
const regStart=source.indexOf('function registerEnemyActionAnimations('),regEnd=source.indexOf('const ASSET_SHEETS =',regStart);
const register=vm.runInNewContext(source.slice(regStart,regEnd)+'\nregisterEnemyActionAnimations',{ASSET_SHEETS:defs});
const clips=new Map(),textures=new Set(['e_void_crumb','e_crown_ripper','e_banquet_eye','e_maw_truffle','e_royal_oven_sentinel','c3_e_basic','c3_e_fast','c3_e_shooter','c3_e_bomber','c3_e_tank'].map(id=>id+'_animated'));
const anims={exists:k=>clips.has(k),generateFrameNumbers:(key,{start,end})=>Array.from({length:end-start+1},(_,i)=>({key,frame:start+i})),create(c){clips.set(c.key,c);}};
for(const key of textures){const d=defs[key];assert.equal(d.frame,key.startsWith('c3_')?128:256);assert.equal(d.anim.frames,6);anims.create({key:key+'_walk'});}
register({anims,textures:{exists:k=>textures.has(k)}});
const Scene=vm.runInNewContext('class Scene{'+['stage5ArtKey','chapter3ArtKey','stage5EnemyPose','stage5DeathGhost','playEnemyDeath','iceArtKey','fireArtKey','drainArtKey','antArtKey','antSpitWindup','warnAntBomber','stopEnemyPresentation','resetEnemyPresentation','enemyAction','tickEnemyPresentation','spawnEnemy','spawnElite'].map(method).join('\n')+'\n}Scene',{Math,Phaser:{Math:{FloatBetween:a=>a}},stageCurveValue:(i,a,tail=1.18)=>i<a.length?a[i]:a.at(-1)*tail**(i-a.length+1),ASSET_SHEETS:defs,BALANCE:{}});
function mob(x,y,key){return {active:true,x,y,texture:{key},body:{velocity:{x:0,y:0}},anims:{isPlaying:false,isPaused:false,stop(){this.isPlaying=false;this.isPaused=false;},pause(){this.isPaused=true;},resume(){this.isPaused=false;}},setTexture(k,f){this.texture={key:k};this.frame=f;return this;},setCircle(...c){this.circle=c;return this;},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;},setVelocity(x,y){this.body.velocity={x,y};return this;},setFlipX(){return this;},setTint(){return this;},clearTint(){return this;},play(k){this.clip=k;this.anims.isPlaying=true;return this;}};}
const s=new Scene();Object.assign(s,{stageIndex:3,waveIndex:0,W:300,H:500,viewZoom:1,player:{x:0,y:0},textures:{exists:k=>textures.has(k)},anims,enemies:{countActive:()=>0,getFirstDead:()=>null,create:mob},getPowerGuide:()=>({enemyHp:1,enemyDmg:1}),killPowerMul:()=>1,diffMul:()=>({hp:1,dmg:1}),newbieEase:()=>1,clearObjectiveTargetFx(){},camWorld:o=>o,vfxSpawnPoof(){}});

const curves=(i,a,t)=>i<a.length?a[i]:a.at(-1)*t**(i-a.length+1);
const roles=[['basic',19,10,58],['fast',10,9,122],['dasher',16,14,70],['shooter',19,9,62],['bomber',24,12,70],['tank',80,18,36],['siege',260,24,24]];
const s5={basic:['e_void_crumb',.36,[45,83,83]],fast:['e_crown_ripper',.34,[42,86,86]],dasher:['e_crown_ripper',.34,[42,86,86]],shooter:['e_banquet_eye',.38,[45,83,83]],bomber:['e_maw_truffle',.40,[46,82,82]],tank:['e_royal_oven_sentinel',.48,[54,74,74]],siege:['e_royal_oven_sentinel',.56,[54,74,74]]};
const c3={basic:['c3_e_basic',.82,[26,38,48]],fast:['c3_e_fast',.86,[22,42,56]],dasher:['c3_e_fast',.86,[22,42,56]],shooter:['c3_e_shooter',.82,[25,39,49]],bomber:['c3_e_bomber',.84,[27,37,48]],tank:['c3_e_tank',.66,[38,26,42]],siege:['c3_e_tank',.72,[38,26,42]]};
for(const stage of [4,10,11,12,13,14]){
 s.stageIndex=stage;
 for(const [type,hp,dmg,speed] of roles){
  const [base,scale,circle]=(stage===4?s5:c3)[type],key=base+'_animated',e=s.spawnEnemy(type,0,100);
  assert.equal(e._enemyArtKey,key);assert.equal(e.baseScale,scale);assert.deepEqual(e.circle,circle);
  assert(Math.abs(e.hp*0.9-hp*curves(stage,[1,1.42,1.88,2.42,3.05,3.72],1.28)*(stage>=2&&stage<=4?1.35:1))<1e-8);
  assert.equal(e.dmg,Math.round(dmg*1.3*curves(stage,[1,1.05,1.12,1.20,1.30,1.42],1.09)));assert.equal(e.spd,speed);
  assert.equal(e.clip,key+'_idle');e.setVelocity(speed,0);s.tickEnemyPresentation(e,.016);assert.equal(e.clip,key+'_walk');
 }
 const shot=s.spawnEnemy('shooter',0,100);shot.shootCd=.1;s.antSpitWindup(shot);assert.equal(shot._enemyAction.state,'windup');assert.equal(shot.shootCd,.1);
 if(stage===4)s.stage5EnemyPose(shot,4,430);else s.enemyAction(shot,'attack',430);
 assert.equal(shot._enemyAction.state,'attack');assert.equal(shot.clip,shot._enemyArtKey+'_attack');shot.frozen=1;s.tickEnemyPresentation(shot,2);assert.equal(shot._enemyActionT,.43);assert(shot.anims.isPaused);shot.frozen=0;s.tickEnemyPresentation(shot,.44);assert.equal(shot.clip,shot._enemyArtKey+'_idle');
 const bomb=s.spawnEnemy('bomber',0,100);bomb.hp=bomb.maxhp*.3;s.warnAntBomber(bomb);assert.equal(bomb._enemyAction.state,'windup');const action=bomb._enemyAction;s.warnAntBomber(bomb);assert.equal(bomb._enemyAction,action);s.resetEnemyPresentation(bomb);assert.equal(bomb._antBombWarn,false);
}
s.stageIndex=4;
{const e=s.spawnElite();assert.equal(e._enemyArtKey,'e_royal_oven_sentinel_animated');assert.equal(e.baseScale,.56);assert.deepEqual(e.circle,[54,74,74]);assert(Math.abs(e.hp*0.9-70*2.72*1.15)<1e-8);assert.equal(e.dmg,Math.round(18*1.3*1.30));}
{const e=s.spawnEnemy('dasher',0,100);s.stage5EnemyPose(e,4,400);assert.equal(e._enemyAction.state,'windup');assert.equal(e._enemyActionT,.4);s.stage5EnemyPose(e,6,120);assert.equal(e._enemyAction.state,'windup');s.stage5EnemyPose(e,5,340);assert.equal(e._enemyAction.state,'dash');assert.equal(e._enemyActionT,.34);}
{let ghosts=0,legacy=0,completed;const ghost={setScale(){return this;},setFlipX(){return this;},setDepth(){return this;},once(event,f){assert.equal(event,'animationcomplete');completed=f;},play(key){assert.equal(key,'e_void_crumb_animated_death');},destroy(){this.destroyed=true;}};Object.assign(s,{fxOk:()=>true,trackArtVfx:o=>o,add:{sprite(){ghosts++;return ghost;},image(){legacy++;}}});const e=s.spawnEnemy('basic',0,100);s.playEnemyDeath(e);s.stage5DeathGhost(e);assert.equal(ghosts,1);assert.equal(legacy,0);completed();assert(ghost.destroyed);}
for(const key of [...textures]){textures.delete(key);const type=key.includes('shooter')||key.includes('banquet')?'shooter':key.includes('fast')||key.includes('ripper')?'fast':key.includes('bomber')||key.includes('truffle')?'bomber':key.includes('tank')||key.includes('sentinel')?'tank':'basic';assert.equal(key.startsWith('c3_')?s.chapter3ArtKey(type):s.stage5ArtKey(type),key.replace(/_animated$/,''));textures.add(key);}
const stageStart=source.indexOf('const STAGE_SHEETS='),stageEnd=source.indexOf('\n];',stageStart)+3;
const stageSheets=vm.runInNewContext(source.slice(stageStart,stageEnd)+'\nSTAGE_SHEETS');
const packing=JSON.parse(fs.readFileSync('assets/incoming/monster_batch6/PACKING.json','utf8'));
for(const key of textures){
 const id=key.startsWith('c3_')?key.replace('c3_e_','c3_').replace('_animated',''):key.replace(/^e_/,'s5_').replace('_animated','');
 for(const stage of key.startsWith('c3_')?[10,11,12,13,14]:[4])assert(stageSheets[stage].includes(key));
 const png=fs.readFileSync('assets/incoming/monster_batch6/'+id+'_sheet.png');assert.equal(png.readUInt32BE(16),1024);assert.equal(png.readUInt32BE(20),1024);assert.equal(png[25],6);
 const b=fs.readFileSync(defs[key].url);assert.equal(b.toString('ascii',12,16),'VP8L');const packed=b.readUInt32LE(21),dim=defs[key].frame*4;assert(packed&(1<<28));assert.equal((packed&0x3fff)+1,dim);assert.equal(((packed>>>14)&0x3fff)+1,dim);
 assert.equal(packing[id].bounds.length,16);for(const [x,y,w,h] of packing[id].bounds){assert(x>=10&&y>=10);assert.equal(y+h,packing[id].baseline);assert(x+w<=246);assert(Math.abs(x+w/2-128)<=.5);}
 assert.deepEqual(Array.from(clips.get(key+'_death').frames,f=>f.frame),[14,15]);assert.equal(clips.get(key+'_hurt').frames.length,2);
}
console.log('Late monsters: 42 role spawns across six stages, elite, original balance/colliders, action/freeze/reset/fallback, one death ghost and ten packed alpha sheets passed');
