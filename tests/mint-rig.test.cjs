const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {Rig,frames,object}=require('../scripts/preview-mint-rig.cjs');
const registered=new Set(),jobs=[],texture={has:n=>registered.has(n),add(n){registered.add(n);}};
const scene={textures:{get:()=>texture,exists:()=>true},camWorld:o=>o,add:{container:object,image:object},state:'play',iso:true,dashTime:0,time:{now:0},tweens:{add(c){const j={c,stop(){this.stopped=true;}};jobs.push(j);return j;}}};
const v={x:140,y:0,length(){return Math.hypot(this.x,this.y);}},p={x:80,y:100,depth:100,alpha:.75,active:true,flipX:false,body:{velocity:v},setVisible(v){this.visible=v;return this;}};
const rig=new Rig(scene);assert.equal(registered.size,16);assert.equal(rig.skins.length,14);
for(let i=0;i<40;i++)rig.animate(1/60,p,scene);for(const name of ['armL','armR','foreL','foreR'])assert.equal(rig.skins.find(o=>o.name===name).skin.originX,.5,'neutral skin joint is centered');
const phase=rig.phase,leg=rig.bones.thighL.rotation,grip=rig.bones.lance.worldX;
rig.attack(400);for(let i=0;i<12;i++)rig.animate(1/60,p,scene);
assert(rig.phase>phase);assert.notEqual(rig.bones.thighL.rotation,leg,'cast preserves moving legs');assert(rig.bones.lance.worldX>grip,'arm extends weapon forward');assert.equal(rig.bones.lance.x,0,'weapon stays in hand');
const parent=rig.bones.foreR,child=rig.bones.lance;assert(Math.abs(child.worldX-(parent.worldX+child.x*Math.cos(parent.worldRotation)-child.y*Math.sin(parent.worldRotation)))<1e-9,'forward kinematics');
const scale=rig.root.scaleY;rig.attack(550,true);scene.dashTime=.1;for(let i=0;i<8;i++)rig.animate(1/60,p,scene);assert.equal(rig.root.scaleY,scale,'no attack or dash resize');assert(rig.bones.hairL.rotation<0);
p.flipX=true;p.x=200;p.isTinted=true;p.tintFill=true;p.tintTopLeft=0xff8080;rig.sync(p,scene);assert.equal(rig.root.x,200);assert.equal(rig.root.scaleX,-scale);assert.equal(rig.root.depth,p.y);assert.equal(rig.root.alpha,.75);
scene.state='menu';rig.sync(p,scene);assert.equal(rig.root.visible,false);scene.state='dead';rig.sync(p,scene);assert.equal(rig.root.rotation,.82);assert.equal(rig.root.y,p.y+20);
scene.state='play';v.x=0;scene.dashTime=0;rig.blink=.01;rig.animate(.02,p,scene);assert.equal(rig.skins.at(-1).skin.frame.name,'rig15');
rig.flash(5,160);rig.animate(.02,p,scene);assert(rig.hurtLeft>0);
for(let i=0;i<30;i++){scene.time.now=i*10;rig.ghost(p,scene);}assert.equal(rig.ghosts.length,4,'throttled snapshots');
rig.destroy();assert.equal(rig.root.scene,null);assert(jobs.every(j=>j.stopped));assert.equal(rig.ghosts.length,0);
// All gameplay actions use sprites. Existing experimental rigs are cleaned up on reset.
const source=fs.readFileSync('game.js','utf8'),start=source.indexOf('  resetCharacterRenderer(){'),end=source.indexOf('  // เลือกเฟรมท่าทาง:',start);
const context=vm.createContext({}),C=vm.runInContext('class Scene{'+source.slice(start,end)+'}\nScene',context),s=new C();
let destroyed=0;Object.assign(s,{_mintRig:{destroy(){destroyed++;}},player:{...p,setVisible(v){this.visible=v;return this;}}});
const body=s.player.body;s.resetCharacterRenderer();assert.equal(destroyed,1);assert.equal(s._mintRig,null);assert.equal(s.player.visible,true);assert.equal(s.player.body,body);
s.resetCharacterRenderer();assert.equal(destroyed,1,'renderer reset is idempotent');
const gameplay=source.slice(source.indexOf('class Game extends'));
assert(!gameplay.includes('new MintCutoutRig'),'no gameplay path instantiates a rig');
assert(!gameplay.includes('this._mintRig.attack(')&&!gameplay.includes('this._mintRig.animate(')&&!gameplay.includes('this._mintRig.sync(')&&!gameplay.includes('this._mintRig.ghost('),'no rig action/update/trail hooks');
// Side run: feet pass each other in projection; knee direction and limb identity remain stable.
scene.state='play';scene.dashTime=0;p.flipX=false;v.x=140;
const gait=new Rig(scene);
for(let i=0;i<360;i++){
 if(i%23===0)gait.attack(400);
 gait.animate(1/60,p,scene);
 const feet=gait.skins.filter(o=>o.name==='shinL'||o.name==='shinR').map(o=>o.skin);
 assert(gait.bones.shinL.rotation<=0&&gait.bones.shinR.rotation<=0,'both knees flex backward');
 assert(feet.every(f=>Math.abs(f.rotation)<=.121),'bounded sagittal toe lift');
 assert.equal(gait.skins.find(o=>o.name==='shinL').part,10);assert.equal(gait.skins.find(o=>o.name==='shinR').part,12,'passing feet never swap skins');
 assert.equal(gait.bones.lance.x,0);assert.equal(gait.bones.lance.y,8.5,'no floating grip');
}
// Visible arm pumping and swing-foot clearance distinguish running from a rigid shuffle.
const run=new Rig(scene),arms=[],elbows=[],lifts=[],strides=[];
for(let i=0;i<180;i++){run.animate(1/60,p,scene);if(i>60){arms.push(run.bones.armL.rotation);elbows.push(run.bones.foreL.rotation);lifts.push(run.skins.find(o=>o.name==='shinL').skin.y);strides.push(run.skins.find(o=>o.name==='shinL').skin.x);}}
assert(Math.max(...arms)-Math.min(...arms)>.65,'free arm visibly swings');
assert(elbows.every(r=>r<-.6),'free elbow bends forward');
assert(Math.max(...strides)-Math.min(...strides)>8,'feet travel forward and backward');
assert(Math.max(...lifts)-Math.min(...lifts)>3,'feet lift into a running swing');
assert(run.skins.findIndex(o=>o.name==='foreL')>run.skins.findIndex(o=>o.name==='torso'),'free hand is visible over dress');
const held=run.bones.armL.rotation;v.x=0;run.animate(1/60,p,scene);assert(Math.abs(run.bones.armL.rotation-held)<.2,'stopping blends pose');run.destroy();v.x=140;
// Distance-based gait advances equally at 30 and 60 FPS; zero speed stops phase.
function cadence(fps){const r=new Rig(scene);for(let i=0;i<fps*2;i++)r.animate(1/fps,p,scene);return r;}
const thirty=cadence(30),sixty=cadence(60),oneTwenty=cadence(120),twenty=cadence(20);
for(const other of [thirty,oneTwenty,twenty]){assert(Math.abs(other.phase-sixty.phase)<1e-9);for(const name of Object.keys(sixty.bones))assert(Math.abs(other.bones[name].rotation-sixty.bones[name].rotation)<1e-7,'pose stable at 20/30/60/120 FPS: '+name);}
const velocity=sixty.bones.armR._v_rotation;sixty.attack(400);assert.equal(sixty.bones.armR._v_rotation,velocity,'cast retains joint velocity');sixty.attack(400);assert.equal(sixty.bones.armR._v_rotation,velocity,'repeated cast cannot snap velocity');v.x=0;const stopped=sixty.phase;sixty.animate(.05,p,scene);assert.equal(sixty.phase,stopped);gait.destroy();thirty.destroy();sixty.destroy();oneTwenty.destroy();twenty.destroy();
const helper=vm.runInNewContext(source.slice(source.indexOf('function mintRigSpring('),source.indexOf('function mintRigLeg('))+'\nmintRigSpring');
const spring={x:1,_v_x:3};helper(spring,'x',-10,46,1e-7);assert(Math.abs(spring.x-1)<1e-5&&Math.abs(spring._v_x-3)<.01,'target change has no position/velocity jump');
for(const f of frames)assert(f.x>=0&&f.y>=0&&f.x+f.w<=512&&f.y+f.h<=512);
console.log('Mint rig: skeletal parenting, run/cast continuity, size, dash/hurt/blink, mirror/tint/camera depth, fallback and cleanup passed');

// Throw has a raised wind-up, release concealment, and full weapon recovery.
const throwingRig=new Rig(scene);throwingRig.attack(480,false);
for(let i=0;i<6;i++)throwingRig.animate(1/60,p,scene);
assert(throwingRig.bones.armR.rotation<-1.5,'throw visibly raises weapon arm');
const heldSpear=throwingRig.skins.find(o=>o.name==='lance').skin;
for(let i=0;i<7;i++)throwingRig.animate(1/60,p,scene);
assert.equal(heldSpear.alpha,0,'held spear disappears when projectile launches');
for(let i=0;i<25;i++)throwingRig.animate(1/60,p,scene);
assert.equal(heldSpear.alpha,1,'spear restored after recovery');
assert.equal(throwingRig.castLeft,0);throwingRig.destroy();
const frostMethod=source.slice(source.indexOf('  castFrostLance('),source.indexOf('  // แตกสะเก็ดน้ำแข็ง',source.indexOf('  castFrostLance(')));
assert(!frostMethod.includes('this._mintRig')&&!frostMethod.includes('delayedCall(192'),'no rig-specific projectile timing');
// Execute production Frost Lance: immediate sprite fire and death guard.
let cues=0;const Combat=vm.runInNewContext('class Combat{'+frostMethod+'}\nCombat',{Math,Set,Sfx:{frost(){cues++;}}});
function combat(rigActive=true){
 const timers=[],shots=[];const c=new Combat();Object.assign(c,{_mintRig:rigActive?{}:null,state:'play',player:{x:0,y:0,active:true},nearestEnemy:()=>({x:100,y:0}),poseAttack(ms){this.poseMs=ms;},camWorld:o=>o,add:{image:object},tweens:{add(){}},textures:{exists:()=>true},time:{delayedCall(ms,fn){timers.push({ms,fn});}},getBullet(){const b={setTexture(){return this;},setTint(){return this;},setScale(){return this;},body:{velocity:{}}};shots.push(b);return b;},physics:{velocityFromRotation(a,s,v){v.x=Math.cos(a)*s;v.y=Math.sin(a)*s;}},hitCratesInRadius(){},frostShatterBurst(){}});return {c,timers,shots};
}
let shot=combat();shot.c.castFrostLance(1,false,1,null);assert.equal(shot.shots.length,1);assert.equal(shot.c.poseMs,360);assert.equal(shot.shots[0].body.velocity.x,900);assert.equal(cues,1);
shot=combat();shot.c.state='dead';shot.c.castFrostLance(1,false,1,null);assert.equal(shot.shots.length,0,'no projectile after death');
shot=combat(false);shot.c.castFrostLance(1,false,1,null);assert.equal(shot.shots.length,1);assert.equal(shot.c.poseMs,360,'all sprite attacks fire immediately');
// Runtime presentation: authored sheets own locomotion; only a standing throw uses the rig.
const presentation=new Rig(scene);v.x=0;scene.dashTime=0;scene._poseHold=0;
presentation.sync(p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'idle uses sprite');
presentation.attack(480,false);presentation.sync(p,scene);assert.equal(p.visible,false);assert.equal(presentation.root.visible,true,'standing throw uses rig');
v.x=140;presentation.animate(1/60,p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'moving throw uses sprite run');
v.x=0;scene.dashTime=.1;presentation.sync(p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'dash uses sprite');
scene.dashTime=0;scene._poseHold=.15;presentation.sync(p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'hurt pose uses sprite');
scene._poseHold=0;presentation.attack(520,true);presentation.sync(p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'Wind Rush uses sprite');
presentation.attack(480,false);scene.state='dead';presentation.sync(p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'death uses KO sprite');
scene.state='play';for(let i=0;i<40;i++)presentation.animate(1/60,p,scene);assert.equal(p.visible,true);assert.equal(presentation.root.visible,false,'completed throw returns to sprite');presentation.destroy();
