const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const ctx={CF:{idle:0,blink:1,stretch:3,hurt:5,cast:7},CHAR_ACTION_SCALE:{},Phaser:{Math:{Clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),FloatBetween:(a,b)=>(a+b)/2}}};vm.createContext(ctx);
const C=vm.runInContext('class Motion{'+['updatePose','poseAttack','poseFlash','animatePlayer'].map(method).join('\n')+'}\nMotion',ctx);
function scene(character='mint'){
 const s=new C(),v={x:100,y:0,length(){return Math.hypot(this.x,this.y);}};
 Object.assign(s,{character,_hasFrames:true,_poseHold:0,_attackPoseTime:0,_blinkT:3,dashTime:0,_sqX:1,_sqY:1,_pBase:0.5,textures:{exists:()=>true},spawnDust(){},spawnGhostTrail(){},vfxSpeedLine(){}});
 s.player={texture:{key:'char_'+character+'_run'},body:{velocity:v},setTexture(k){this.texture.key=k;return this;},setFrame(n){this.frame=n;return this;},setFlipX(n){this.flipX=n;},setScale(x,y){this.scaleX=x;this.scaleY=y;}};return s;
}
const s=scene();s.updatePose(.1);const phase=s._charRunT;s.poseAttack(360);s.updatePose(.1);assert.equal(s.player.texture.key,'char_mint_run');assert.equal(s._charRunT,phase+.1);assert(s._attackPoseTime>0);
s.player.body.velocity.x=0;s.updatePose(.05);assert.equal(s.player.texture.key,'char_mint_attack');s.animatePlayer(0);assert.equal(s.player.scaleX,.5*1.23);
s.player.body.velocity.x=100;s.updatePose(.05);s.animatePlayer(0);assert.equal(s.player.texture.key,'char_mint_run');assert.equal(s.player.scaleX,.5);
s.poseAttack(520,'char_mint_gale');s.updatePose(.05);assert.equal(s.player.texture.key,'char_mint_run');
s.dashTime=.1;s.updatePose(.01);assert.equal(s.player.texture.key,'char_mint');assert.equal(s.player.frame,3);s.dashTime=0;
s.poseFlash(5,160);s.updatePose(.01);assert.equal(s.player.frame,5);assert.equal(s._attackPoseTime,0);
s._sqX=.6;s._sqY=1.5;s.animatePlayer(0);assert.equal(s.player.scaleX,.47);assert.equal(s.player.scaleY,.53);
const c=scene('cocoa');c.poseAttack(280);c.updatePose(.05);assert.equal(c.player.texture.key,'char_cocoa_attack');
console.log('Mint motion: moving casts, gait continuity, stationary cast, immediate scale, Gale, dash, hurt and Cocoa regression passed');
