const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const ctx={CF:{idle:0,blink:1,stretch:3,hurt:5,cast:7},CHAR_ACTION_SCALE:{},Phaser:{Math:{Clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),FloatBetween:(a,b)=>(a+b)/2,Between:()=>0}}};vm.createContext(ctx);
const C=vm.runInContext('class Motion{'+['updatePose','poseAttack','poseFlash','animatePlayer'].map(method).join('\n')+'}\nMotion',ctx);
function scene(character='mint'){
 const s=new C(),v={x:100,y:0,length(){return Math.hypot(this.x,this.y);}};
 Object.assign(s,{character,_hasFrames:true,_poseHold:0,_attackPoseTime:0,_blinkT:3,dashTime:0,_sqX:1,_sqY:1,_pBase:0.5,textures:{exists:()=>true},spawnDust(){},spawnGhostTrail(){},vfxSpeedLine(){}});
 s.player={texture:{key:'char_'+character+'_run'},body:{velocity:v},setTexture(k){this.texture.key=k;return this;},setFrame(n){this.frame=n;return this;},setFlipX(n){this.flipX=n;},setScale(x,y){this.scaleX=x;this.scaleY=y;}};return s;
}

// Repeated high-rate punches finish the visible clip, rather than snapping back to zero.
{const s=scene('cocoa');s.player.body.velocity.x=0;s.poseAttack(200);assert.equal(s._attackPoseDuration,.32);s.updatePose(.1);const frame=s.player.frame,left=s._attackPoseTime;s.poseAttack(200);assert.equal(s.player.frame,frame);assert.equal(s._attackPoseTime,left);s.updatePose(.1);assert(s.player.frame>frame);s.updatePose(.13);assert.equal(s.player.texture.key,'char_cocoa');}
// Walking cancels a hidden punch; stopping cannot resurrect a late attack frame.
{const s=scene('cocoa');s.poseAttack(200);assert.equal(s._attackPoseTime,0);s.updatePose(.05);s.player.body.velocity.x=0;s.updatePose(.05);assert.equal(s.player.texture.key,'char_cocoa');s.poseAttack(400);s.updatePose(.1);s.player.body.velocity.x=100;s.updatePose(.01);assert.equal(s._attackPoseTime,0);s.player.body.velocity.x=0;s.updatePose(.01);assert.equal(s.player.texture.key,'char_cocoa');}
// Dash uses the same gait clock and advances frames, with no frozen stretch or clock reset.
{const s=scene('cocoa');s.updatePose(.1);s.dashTime=.2;s.updatePose(.04);const frame=s.player.frame,phase=s._charRunT;s.updatePose(.04);assert.equal(s.player.texture.key,'char_cocoa_run');assert.notEqual(s.player.frame,frame);assert(s._charRunT>phase);s.dashTime=0;s.updatePose(.02);assert.equal(s.player.texture.key,'char_cocoa_run');assert(Math.abs(s._charRunT-phase-.064-.02)<1e-9);}
// Hurt wins over new attacks; its expiry returns to idle, and missing art still has a fallback.
{const s=scene('cocoa');s.player.body.velocity.x=0;s.poseAttack(400);s.poseFlash(5,160);s.poseAttack(200);assert.equal(s.player.frame,5);assert.equal(s._attackPoseTime,0);s.updatePose(.17);assert.equal(s.player.texture.key,'char_cocoa');s.textures.exists=k=>!k.endsWith('_attack');s.poseAttack(200);assert.equal(s.player.frame,7);s.updatePose(.21);assert.equal(s.player.frame,0);}
// Visual spring recovery stays close at 30/60/120 FPS, and a hitch stays finite.
function recover(fps){const s=scene('cocoa');s.player.body.velocity.x=0;Object.assign(s,{_sqX:1.05,_sqY:.95,_sqVX:2,_sqVY:-2,_wob:0,_lean:0});for(let i=0;i<fps;i++)s.animatePlayer(1/fps);return s;}
{const ref=recover(120);for(const fps of [30,60]){const s=recover(fps);assert(Math.abs(s._sqX-ref._sqX)<.002);assert(Math.abs(s.player.scaleX-ref.player.scaleX)<.002);}ref.animatePlayer(.6);assert(Number.isFinite(ref.player.scaleX));assert(ref.player.scaleX>0);}
console.log('Chocolate animation: uninterrupted clips, stale-pose cancellation, continuous Dash gait, hurt/fallback and 30/60/120 FPS spring recovery passed');
