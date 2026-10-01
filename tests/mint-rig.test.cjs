const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {Rig,frames,object}=require('../scripts/preview-mint-rig.cjs');
const registered=new Set(),jobs=[],texture={has:n=>registered.has(n),add(n){registered.add(n);}};
const scene={textures:{get:()=>texture,exists:()=>true},camWorld:o=>o,add:{container:object,image:object},state:'play',iso:true,dashTime:0,time:{now:0},tweens:{add(c){const j={c,stop(){this.stopped=true;}};jobs.push(j);return j;}}};
const v={x:140,y:0,length(){return Math.hypot(this.x,this.y);}},p={x:80,y:100,depth:100,alpha:.75,active:true,flipX:false,body:{velocity:v}};
const rig=new Rig(scene);assert.equal(registered.size,16);assert.equal(rig.skins.length,14);
for(let i=0;i<40;i++)rig.animate(1/60,p,scene);for(const name of ['armL','armR','foreL','foreR'])assert.equal(rig.skins.find(o=>o.name===name).skin.originX,.5,'neutral skin joint is centered');
const phase=rig.phase,leg=rig.bones.thighL.rotation,grip=rig.bones.lance.worldX;
rig.attack(400);for(let i=0;i<8;i++)rig.animate(1/60,p,scene);
assert(rig.phase>phase);assert.notEqual(rig.bones.thighL.rotation,leg,'cast preserves moving legs');assert(rig.bones.lance.worldX>grip,'arm extends weapon forward');assert.equal(rig.bones.lance.x,0,'weapon stays in hand');
const parent=rig.bones.foreR,child=rig.bones.lance;assert(Math.abs(child.worldX-(parent.worldX+child.x*Math.cos(parent.worldRotation)-child.y*Math.sin(parent.worldRotation)))<1e-9,'forward kinematics');
const scale=rig.root.scaleY;rig.attack(550,true);scene.dashTime=.1;for(let i=0;i<8;i++)rig.animate(1/60,p,scene);assert.equal(rig.root.scaleY,scale,'no attack or dash resize');assert(rig.bones.hairL.rotation<0);
p.flipX=true;p.x=200;p.isTinted=true;p.tintFill=true;p.tintTopLeft=0xff8080;rig.sync(p,scene);assert.equal(rig.root.x,200);assert.equal(rig.root.scaleX,-scale);assert.equal(rig.root.depth,p.y);assert.equal(rig.root.alpha,.75);
scene.state='menu';rig.sync(p,scene);assert.equal(rig.root.visible,false);scene.state='dead';rig.sync(p,scene);assert.equal(rig.root.rotation,.82);assert.equal(rig.root.y,p.y+20);
scene.state='play';v.x=0;scene.dashTime=0;rig.blink=.01;rig.animate(.02,p,scene);assert.equal(rig.skins.at(-1).skin.frame.name,'rig15');
rig.flash(5,160);rig.animate(.02,p,scene);assert(rig.hurtLeft>0);
for(let i=0;i<30;i++){scene.time.now=i*10;rig.ghost(p,scene);}assert.equal(rig.ghosts.length,4,'throttled snapshots');
rig.destroy();assert.equal(rig.root.scene,null);assert(jobs.every(j=>j.stopped));assert.equal(rig.ghosts.length,0);
// Exercise actual scene selection/fallback/cleanup without changing the physics object.
const source=fs.readFileSync('game.js','utf8'),start=source.indexOf('  setupMintRig(){'),end=source.indexOf('  // เลือกเฟรมท่าทาง:',start);
const context=vm.createContext({MintCutoutRig:Rig}),C=vm.runInContext('class Scene{'+source.slice(start,end)+'}\nScene',context),s=new C();
let shutdown;Object.assign(s,scene,{character:'mint',player:{...p,setVisible(v){this.visible=v;return this;}},events:{once(_,fn){shutdown=fn;}}});
const body=s.player.body;s.setupMintRig();assert(s._mintRig);assert.equal(s.player.visible,false);assert.equal(s.player.body,body);const previous=s._mintRig;
s.character='cocoa';s.setupMintRig();assert.equal(previous.root.scene,null);assert.equal(s._mintRig,null);assert.equal(s.player.visible,true);
s.character='mint';s.textures={exists:()=>false};s.setupMintRig();assert.equal(s._mintRig,null,'missing art keeps original sprite');shutdown();assert.equal(s._mintRigShutdown,false,'scene restart can register fresh cleanup');
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
const thirty=cadence(30),sixty=cadence(60);assert(Math.abs(thirty.phase-sixty.phase)<1e-9);v.x=0;const stopped=sixty.phase;sixty.animate(.05,p,scene);assert.equal(sixty.phase,stopped);gait.destroy();thirty.destroy();sixty.destroy();
for(const f of frames)assert(f.x>=0&&f.y>=0&&f.x+f.w<=512&&f.y+f.h<=512);
console.log('Mint rig: skeletal parenting, run/cast continuity, size, dash/hurt/blink, mirror/tint/camera depth, fallback and cleanup passed');
