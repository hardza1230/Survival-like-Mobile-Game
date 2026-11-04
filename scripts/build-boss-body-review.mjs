// Static real Arcade sprites/texture geometry only; no combat, AI or appearance screenshots.
import {readFileSync,writeFileSync}from'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');if(end<0)throw Error('GameConfig boundary');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=+params.get('w')||390,RH=+params.get('h')||844;
class BossBodyReview extends Phaser.Scene{
 constructor(){super('BossBodyReview');}
 preload(){for(const [base,d]of Object.entries(BOSS_BODY816_MAP))for(const key of [base,d.key]){const a=ASSET_SHEETS[key];this.load.spritesheet(key,a.url,{frameWidth:a.frame,frameHeight:a.frame});}}
 create(){Save.data=Save.data||{};Save.data.settings={vfx:1};this.state='play';this.mode='boss';this.player={active:true};this.samples=[];this.add.rectangle(RW/2,RH/2,RW,RH,0x261e30);
  const cw=RW/3,rh=(RH-10)/7;Object.entries(BOSS_BODY816_MAP).forEach(([base,d],i)=>{this.stageIndex=d.stage;const a=ASSET_SHEETS[base],x=(i%3+.5)*cw,y=(Math.floor(i/3)+.5)*rh,size=Math.max(12,Math.min(cw-8,rh-16)),image=this.physics.add.sprite(x,y,base,0).setScale(size/a.frame).setCircle(a.frame*.2,a.frame*.3,a.frame*.25);image.isBoss=true;image.baseScale=image._baseScale=image.scaleX;const before=this.boundsOf(image);this.applyBossInk(image);this.samples.push({base,d,image,before});this.add.text(x,y-rh/2+1,base,{fontSize:'8px',color:'#fff0cd'}).setOrigin(.5,0);});window.bossBodyReview=this;
 }
 realTex(k){return this.textures.exists(k);}hubMotionAllowed(){return params.get('reduced')!=='1';}
 boundsOf(image){image.body.updateFromGameObject();return[image.body.x,image.body.y,image.body.width,image.body.height,image.body.radius*Math.abs(image.scaleX),image.displayWidth,image.displayHeight];}
}
for(const name of ['bossInkBase','bossInkRetarget','applyBossInk','bossInkFrame','tickBossInk','bossInkPose','bossInkIdle','stopBossInk','clearBossInk'])BossBodyReview.prototype[name]=Game.prototype[name];
new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,physics:{default:'arcade',arcade:{gravity:{y:0},debug:false}},scene:[BossBodyReview]});
`;
writeFileSync('www/boss-body-review.js',src.slice(0,end)+tail);writeFileSync('www/boss-body-review.html','<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:#261e30}</style><div id="mount"></div><script src="phaser.min.js"></script><script src="boss-body-review.js"></script></html>');console.log('Built real Arcade boss-body geometry/pose review (no combat)');
