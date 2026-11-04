// Static real Arcade projectile texture/frame/geometry review, no combat or screenshots.
import{readFileSync,writeFileSync}from'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');if(end<0)throw Error('GameConfig boundary');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=+params.get('w')||390,RH=+params.get('h')||844;
class BossShotReview extends Phaser.Scene{
 constructor(){super('BossShotReview');}
 preload(){for(const [base,key]of Object.entries(BOSS_SHOT817_MAP)){this.load.image(base,ASSET_IMAGES[base]);const a=ASSET_FX[key];this.load.spritesheet(key,a.url,{frameWidth:a.fw,frameHeight:a.fh});}}
 create(){Save.data=Save.data||{};Save.data.settings={vfx:1};this.state='play';this.stageIndex=0;this.player={active:true};this.samples=[];this.add.rectangle(RW/2,RH/2,RW,RH,0x261e30);const cw=RW/4,rh=(RH-16)/4;
  [...BOSS_SHOT,BOSS_SHOT_PIN].forEach((st,i)=>{const x=(i%4+.5)*cw,y=8+(Math.floor(i/4)+.5)*rh,size=Math.min(cw-10,rh-24),image=this.physics.add.sprite(x,y,st.p).setScale(size/128).setCircle(6,58,58);image.dmg=17;image.life=3;const attach=this.bossShotLoop;this.bossShotLoop=null;this.bossShotApply(image,st,.25,245,true);this.bossShotLoop=attach;const before=this.boundsOf(image);this.bossShotLoop(image,st.p);this.samples.push({st,image,before});this.add.text(x,y-rh/2+2,st.p,{fontSize:'8px',color:'#fff0cd'}).setOrigin(.5,0);});window.bossShotReview=this;
 }
 realTex(k){return this.textures.exists(k);}hubMotionAllowed(){return params.get('reduced')!=='1';}
 boundsOf(image){image.body.updateFromGameObject();return[image.body.x,image.body.y,image.body.width,image.body.height,image.body.radius*Math.abs(image.scaleX),image.displayWidth,image.displayHeight,image.rotation];}
}
for(const name of ['bossShotLoop','dropBossShotLoop','tickBossShotLoops','clearBossShotLoops','bossShotApply','killFoe'])BossShotReview.prototype[name]=Game.prototype[name];
new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,physics:{default:'arcade',arcade:{gravity:{y:0},debug:false}},scene:[BossShotReview]});
`;
writeFileSync('www/boss-shot-review.js',src.slice(0,end)+tail);writeFileSync('www/boss-shot-review.html','<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:#261e30}</style><div id="mount"></div><script src="phaser.min.js"></script><script src="boss-shot-review.js"></script></html>');console.log('Built real Arcade projectile geometry/frame/pool review (no combat)');
