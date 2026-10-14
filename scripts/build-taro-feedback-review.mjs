// Static production presentation helpers only; no combat update, enemies, targeting or damage.
import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Sfx.bp=()=>true;
class TaroFeedbackReview extends Phaser.Scene{
 constructor(){super('TaroFeedbackReview');}
 preload(){this.load.image('fx_taro_sentry',ASSET_IMAGES.fx_taro_sentry);this.load.image('floor',ASSET_IMAGES.bg1);this.load.spritesheet('taro',ASSET_SHEETS.char_taro.url,{frameWidth:128,frameHeight:128});}
 create(){this.state='play';this.character='taro';this.player={x:RW/2,y:146};this._taro={enabled:true,path:'tempest',time:1,charge:0,fx:new Set(),jobs:[]};
  this.add.tileSprite(0,0,RW,RH,'floor').setOrigin(0).setAlpha(.22);this.add.rectangle(RW/2,RH/2,RW,RH,0x211b30,.6);
  const text=(x,y,s,size=14,color='#eee1ff')=>this.add.text(x,y,s,{fontFamily:'NunitoUI',fontSize:size+'px',fontStyle:'bold',color,wordWrap:{width:RW-32}}).setOrigin(.5);
  text(RW/2,24,'Taro | feedback preview',20);text(RW/2,47,'Production art and presentation helpers',11,'#bdaccd');
  this.add.sprite(RW/2,146,'taro',0).setDisplaySize(114,114);const needle=this.taroNeedleVisual(RW/2,146,RW*.80,185);this.tweens.killTweensOf(needle);text(RW/2,211,'STARTER | straight Rift Needle',12);
  const y1=245,y2=375,y3=530;this._taro.path='storm';this.add.sprite(RW*.12,y1,'taro',0).setDisplaySize(54,54);for(const x of [RW*.38,RW*.65,RW*.86])this.add.circle(x,y1,14,0x383049).setStrokeStyle(1,0x867690);this.taroLightningVisual(RW*.12,y1,RW*.38,y1);this.taroLightningVisual(RW*.38,y1,RW*.65,y1);this.taroLightningVisual(RW*.65,y1,RW*.86,y1);text(RW/2,y1+34,'ARC | outgoing lightning');
  this._taro.path='smite';for(let i=0;i<7;i++)this.taroProjectileVisual({kind:i>4?'sparkChild':'spark',x:RW*(.15+i*.11),y:y2+Math.sin(i)*15,angle:(i-3)*.22});text(RW/2,y2+44,'SPARK | wander, pierce, split');
  this._taro.path='tempest';this.taroNodeVisual({x:RW*.23,y:y3,life:5,beacon:false});this.taroNodeVisual({x:RW*.76,y:y3,life:5,beacon:true});this.taroProjectileVisual({kind:'sentry',x:RW*.40,y:y3-14,angle:0});this.taroProjectileVisual({kind:'beacon',x:RW*.91,y:y3-14,angle:0});text(RW*.23,y3+54,'SENTRY',13,'#c6a2ed');text(RW*.76,y3+54,'BEACON',13,'#ffda89');text(RW/2,y3+89,'Slow Ball Lightning pulses nearby foes',12);text(RW/2,y3+129,'2 Sentries + 1 special Beacon',12);text(RW/2,y3+155,'Fixed positions | limited lifetimes',11,'#bdaccd');
  window.taroView=this;document.querySelector('#status').textContent='Ready';
 }
 camWorld(o){return o;}trackArtVfx(o){return o;}fxOk(){return true;}
}
for(const n of ['taroNodeVisual','taroProjectileVisual','taroNeedleVisual','taroTrackVisual','taroVisualBudget','taroRing','taroLightningVisual','taroUpdateVisuals','taroRemoveFx','drawTaroCharge','taroSound','taroRefreshRod','suspendTaroCombat','clearTaroCombat'])TaroFeedbackReview.prototype[n]=Game.prototype[n];
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__taroFeedbackGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[TaroFeedbackReview]});}boot();
`;
writeFileSync('www/taro-feedback-review.js',src.slice(0,end)+tail);
writeFileSync('www/taro-feedback-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#211b30}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="taro-feedback-review.js"></script></html>`);
console.log('Built static Canvas Taro feedback review; no combat simulation');
