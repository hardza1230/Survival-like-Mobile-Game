const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,n);return source.slice(at,at+1+next.index);}
const start=source.indexOf('const ASSET_SHEETS ='),end=source.indexOf('\n};',start)+3;
const defs=vm.runInNewContext(source.slice(start,end)+'\nASSET_SHEETS');
const regStart=source.indexOf('function registerEnemyActionAnimations('),regEnd=source.indexOf('const ASSET_SHEETS =',regStart);
const register=vm.runInNewContext(source.slice(regStart,regEnd)+'\nregisterEnemyActionAnimations',{ASSET_SHEETS:defs});
const clips=new Map(),textures=new Set(['slime','dasher','caster','bomber','tank'].map(id=>'e_drain_'+id+'_animated'));
const anims={exists:k=>clips.has(k),generateFrameNumbers:(key,{start,end})=>Array.from({length:end-start+1},(_,i)=>({key,frame:start+i})),create(c){clips.set(c.key,c);}};
for(const key of textures){const d=defs[key];assert.equal(d.frame,128);assert.equal(d.anim.frames,6);anims.create({key:key+'_walk'});}
register({anims,textures:{exists:k=>textures.has(k)}});
const Scene=vm.runInNewContext('class Scene{'+['drainArtKey','antArtKey','antSpitWindup','warnAntBomber','stopEnemyPresentation','resetEnemyPresentation','enemyAction','tickEnemyPresentation','spawnEnemy','spawnElite'].map(method).join('\n')+'\n}Scene',{Math,Phaser:{Math:{FloatBetween:a=>a}},stageCurveValue:(i,a)=>a[i]||1,BALANCE:{}});
function mob(x,y,key){return {active:true,x,y,texture:{key},body:{velocity:{x:0,y:0}},anims:{isPlaying:false,isPaused:false,stop(){this.isPlaying=false;this.isPaused=false;},pause(){this.isPaused=true;},resume(){this.isPaused=false;}},setTexture(k,f){this.texture={key:k};this.frame=f;return this;},setCircle(...c){this.circle=c;return this;},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;},setVelocity(x,y){this.body.velocity={x,y};return this;},setFlipX(){return this;},setTint(){return this;},clearTint(){return this;},play(k){this.clip=k;this.anims.isPlaying=true;return this;}};}
const s=new Scene();Object.assign(s,{stageIndex:1,waveIndex:0,W:300,H:500,viewZoom:1,player:{x:0,y:0},textures:{exists:k=>textures.has(k)},anims,enemies:{countActive:()=>0,getFirstDead:()=>null,create:mob},getPowerGuide:()=>({enemyHp:1,enemyDmg:1}),killPowerMul:()=>1,diffMul:()=>({hp:1,dmg:1}),newbieEase:()=>1,clearObjectiveTargetFx(){},camWorld:o=>o,vfxSpawnPoof(){}});
for(const [type,id,hp,dmg,speed,scale] of [['basic','slime',19,10,58,.64],['fast','dasher',10,9,122,.66],['dasher','dasher',16,14,70,.66],['shooter','caster',19,9,62,.68],['bomber','bomber',24,12,70,.70],['tank','tank',80,18,36,.76],['siege','tank',260,24,24,.76]]){const e=s.spawnEnemy(type,0,100),key='e_drain_'+id+'_animated';assert.equal(e._enemyArtKey,key);assert(Math.abs(e.hp*0.9-hp*1.42)<1e-8);assert.equal(e.dmg,Math.round(dmg*1.3*1.05));assert.equal(e.spd,speed);assert.equal(e.baseScale,scale);assert.deepEqual(e.circle,['tank','siege'].includes(type)?[38,26,26]:[30,34,34]);assert.equal(e.clip,key+'_idle');e.setVelocity(speed,0);s.tickEnemyPresentation(e,.016);assert.equal(e.clip,key+'_walk');}
{const e=s.spawnElite();assert.equal(e._enemyArtKey,'e_drain_tank_animated');assert(e.isElite);assert(Math.abs(e.hp*0.9-70*1.32*1.15)<1e-8);assert.equal(e.dmg,Math.round(18*1.3*1.05));assert.equal(e.baseScale,.84);assert.deepEqual(e.circle,[26,5,5]);}
{const e=s.spawnEnemy('shooter',0,100);e.shootCd=.1;s.antSpitWindup(e);assert.equal(e.clip,'e_drain_caster_animated_windup');assert.equal(e.shootCd,.1);s.enemyAction(e,'attack',430);assert.equal(e.clip,'e_drain_caster_animated_attack');e.frozen=1;s.tickEnemyPresentation(e,2);assert.equal(e._enemyActionT,.43);e.frozen=0;s.tickEnemyPresentation(e,.44);assert.equal(e.clip,'e_drain_caster_animated_idle');}
{const e=s.spawnEnemy('dasher',0,100);s.enemyAction(e,'windup',500);assert.equal(e.clip,'e_drain_dasher_animated_windup');s.enemyAction(e,'hurt',120);assert.equal(e._enemyAction.state,'windup');s.enemyAction(e,'dash',320);assert.equal(e.clip,'e_drain_dasher_animated_dash');}
{const e=s.spawnEnemy('bomber',0,100);e.hp=e.maxhp*.3;s.warnAntBomber(e);assert.equal(e.clip,'e_drain_bomber_animated_windup');const a=e._enemyAction;s.warnAntBomber(e);assert.equal(e._enemyAction,a);s.resetEnemyPresentation(e);assert.equal(e._antBombWarn,false);}
{textures.delete('e_drain_caster_animated');assert.equal(s.drainArtKey('shooter'),'e_drain_caster');}
console.log('Drain art: seven ordinary roles and elite, original stage-scaled stats/colliders, caster freeze, dash priority, pressure warning and fallback passed');

const facingLine=source.split('\n').find(l=>l.includes('const sheet=ASSET_SHEETS[e._enemyArtKey'));
for(const id of ['slime','dasher','caster','bomber','tank']){
 const key='e_drain_'+id+'_animated';assert.equal(defs[key].facingLeft,false);
 for(const dx of [-20,20]){const e={_enemyArtKey:key,texture:{key},setFlipX(v){this.flip=v;}};vm.runInNewContext(facingLine,{e,dx,ASSET_SHEETS:defs});assert.equal(e.flip,dx<0);}
 const b=fs.readFileSync('assets/incoming/ch1_drain_animations/'+id+'_sheet.png');assert.equal(b.readUInt32BE(16),1024);assert.equal(b.readUInt32BE(20),1024);assert.equal(b[25],6);assert(fs.existsSync(defs[key].url));
 assert.equal(clips.get(key+'_hurt').frames.length,2);assert.deepEqual(Array.from(clips.get(key+'_death').frames,f=>f.frame),[14,15]);
}
console.log('Drain art: facing, five RGBA sheets and authored hurt/death clips passed');
