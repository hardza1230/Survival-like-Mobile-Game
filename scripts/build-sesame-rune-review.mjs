// Static production UI contract. No enemy spawning, damage or combat update.
import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
if(end<0)throw Error('GameConfig boundary missing');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=+params.get('w')||390,RH=+params.get('h')||844;
class SesameRuneReview extends Phaser.Scene{
 constructor(){super('SesameRuneReview');}
 preload(){this.load.spritesheet('fx_sesame_invoker811','assets/art/sesame_invoker811/fx_sesame_invoker811.webp',{frameWidth:192,frameHeight:192});}
 create(){
  Save.data=Save.data||{};Save.data.settings={ctrlLeft:params.get('left')==='1',ctrlSize:+params.get('size')||0};
  this.W=RW;this.H=RH;this.character='sesame';this._sesRuneMode=true;this.state='play';this.uniqueCd=0;
  this.player={x:RW/2,y:RH/2};this.basicAttack={ranks:{},lv:{}};this.joy={active:false};this.hudList=[];
  this.add.rectangle(RW/2,RH/2,RW,RH,0x261e30);this.add.text(12,14,'Sesame Rune Invoker · control review',{fontSize:'12px',color:'#fff0cd'});
  this.uniqueBtn=this.add.circle(0,0,36,0x35263d,.95);this.uniqueTxt=this.add.text(0,0,'✹',{fontSize:'26px',color:'#fff4dc'}).setOrigin(.5);
  this.uniqueHint=this.add.text(0,0,'CAST',{fontSize:'10px',color:'#ffffff'}).setOrigin(.5);this.dashBtn=this.add.circle(0,0,36,0x225b56,.9);this.dashTxt=this.add.text(0,0,'DASH',{fontSize:'12px',color:'#ffffff'}).setOrigin(.5);
  this._sesRune={player:this.player,basic:this.basicAttack,orbs:['p','p','p'],cooldowns:{},cdMax:{},inputCd:0,castLock:0,phase:0,actors:[],flares:[],fx:[],orbSprites:[],g:this.add.graphics()};
  this.layoutControls();this.sesRuneCreateControls();this.sesRuneDrawOrbs(this._sesRune,0);this.refreshUniqueSkillUI();
  window.sesameRuneReview=this;
 }
 camUI(o){return o;}camWorld(o){return o;}refreshFlickerUI(){}drawCombatControlBase(){}
}
for(const name of ['sesRuneStats','sesRuneImage','sesRuneSound','sesRuneCommitCooldown','sesRuneProjectCooldown','isSesRune','sesRuneEnsure','sesRuneRecipe','sesRuneCreateControls','sesRuneLayout','sesRuneRefreshUI','sesRuneHit','sesRunePointerDown','sesRuneAdd','sesRuneDrawOrbs','uniqueInfo','refreshUniqueSkillUI','updateUniqueHint','ctrlScale','layoutControls'])SesameRuneReview.prototype[name]=Game.prototype[name];
async function boot(){await document.fonts.load('700 12px NunitoUI');new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[SesameRuneReview]});}boot();
`;
writeFileSync('www/sesame-rune-review.js',src.slice(0,end)+tail);
writeFileSync('www/sesame-rune-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#261e30}</style><div id="mount"></div><script src="phaser.min.js"></script><script src="sesame-rune-review.js"></script></html>`);
console.log('Built static Sesame rune controls review (no combat)');
