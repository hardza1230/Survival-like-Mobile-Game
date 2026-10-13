// Static production presentation helpers only; no combat update, enemies, targeting or damage.
import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Sfx.bp=()=>true;
class TaroFeedbackReview extends Phaser.Scene{
 constructor(){super('TaroFeedbackReview');}
 preload(){this.load.image('fx_taro_dash_bomb',ASSET_IMAGES.fx_taro_dash_bomb);this.load.image('floor',ASSET_IMAGES.bg1);this.load.spritesheet('taro',ASSET_SHEETS.char_taro.url,{frameWidth:128,frameHeight:128});}
 create(){this.state='play';this.character='taro';this.player={x:RW/2,y:146};this._taro={enabled:true,path:'tempest',time:1,charge:100,fx:new Set(),jobs:[]};
  this.add.tileSprite(0,0,RW,RH,'floor').setOrigin(0).setAlpha(.22);this.add.rectangle(RW/2,RH/2,RW,RH,0x211b30,.6);
  const text=(x,y,s,size=14,color='#eee1ff')=>this.add.text(x,y,s,{fontFamily:'NunitoUI',fontSize:size+'px',fontStyle:'bold',color,wordWrap:{width:RW-32}}).setOrigin(.5);
  text(RW/2,24,'Taro | feedback preview',20);text(RW/2,47,'Production art and presentation helpers',11,'#bdaccd');
  this.add.sprite(RW/2,146,'taro',0).setDisplaySize(114,114);this.drawTaroCharge();text(RW/2,211,'STATIC: walk to charge | READY holds',12);
  const y1=245,y2=395,y3=540;this._taro.path='storm';for(const x of [RW*.2,RW*.5,RW*.8])this.add.circle(x,y1,14,0x383049).setStrokeStyle(1,0x867690);this.taroLightningVisual(RW*.2,y1,RW*.5,y1);this.taroLightningVisual(RW*.5,y1,RW*.8,y1);text(RW/2,y1+34,'CHAIN | short violet links');
  this._taro.path='smite';this.taroTempestProfile=()=>({rootRange:520});this.taroPickTarget=()=>({id:1,enemy:{x:RW/2,y:y2}});this.taroRefreshRod();this.add.circle(RW/2,y2,13,0x383049);this.taroLightningVisual(RW/2,y2-80,RW/2,y2,true);text(RW/2,y2+44,'SMITE | gold priority marker');
  this._taro.path='tempest';const pulse=this.taroRing(RW*.28,y3,180);pulse.setScale(.45);this.add.circle(RW*.28,y3,24,0xa93b4e,.22).setStrokeStyle(2,0xf07979,.8);const burst=this.taroRing(RW*.76,y3,120);burst.setScale(.55);const marker=this.taroRing(RW*.76,y3,18,0);this.taroUpdateVisuals();text(RW*.28,y3+96,'NOVA',13,'#a9e8ee');text(RW*.76,y3+96,'DASH BOMB',13,'#d9bfff');
  text(RW/2,y3+128,'Open shapes keep floor hazards visible',12);text(RW/2,y3+154,'No extra combat button | bounded feedback',11,'#bdaccd');
  window.taroView=this;document.querySelector('#status').textContent='Ready';
 }
 camWorld(o){return o;}fxOk(){return true;}
}
for(const n of ['taroTrackVisual','taroVisualBudget','taroRing','taroLightningVisual','taroUpdateVisuals','taroRemoveFx','drawTaroCharge','taroSound','taroRefreshRod','suspendTaroCombat','clearTaroCombat'])TaroFeedbackReview.prototype[n]=Game.prototype[n];
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__taroFeedbackGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[TaroFeedbackReview]});}boot();
`;
writeFileSync('www/taro-feedback-review.js',src.slice(0,end)+tail);
writeFileSync('www/taro-feedback-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#211b30}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="taro-feedback-review.js"></script></html>`);
console.log('Built static Canvas Taro feedback review; no combat simulation');
