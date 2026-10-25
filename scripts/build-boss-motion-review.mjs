// Static production Motion Comic gallery; no enemies spawned or gameplay advanced.
import {readFileSync,writeFileSync}from'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Save.data={settings:{},mcSeen:{}};Save.save=()=>{};Save.kills=()=>1;for(const k of Object.keys(Sfx))if(typeof Sfx[k]==='function')Sfx[k]=()=>{};
class BossMotionReview extends Game{
 preload(){const keys=new Set();for(let i=0;i<15;i++)for(const k of this.mcKeys(bossMotionScene(i)))keys.add(k);for(const k of keys){const image=ASSET_IMAGES[k],sheet=ASSET_SHEETS[k],fx=ASSET_FX[k];if(image)this.load.image(k,image);else if(sheet)this.load.spritesheet(k,sheet.url,{frameWidth:sheet.frame,frameHeight:sheet.frame});else if(fx)this.load.spritesheet(k,fx.url,{frameWidth:fx.fw,frameHeight:fx.fh});else throw Error('Unregistered story asset '+k);}}
 create(){this.W=RW;this.H=RH;this.storyLayer=this.add.container();this.state='cinematic';this.player={active:true};this.stageIndex=0;this.physics={pause(){},resume(){}};this._artEpoch=0;this.input.on('pointerup',p=>this._finishStoryCutscene?.(p));window.bossMotionView=this;document.querySelector('#status').textContent='Ready';}
 update(){}
 reviewShot(idx,shot){if(this._mc){this.mcClearShot(this._mc);this._mc.done=true;}this.stageIndex=idx;const sc=bossMotionScene(idx);this._mc={id:bossMotionId(idx),sc,layer:this.storyLayer,objs:[],tw:[],ev:[],done:false,red:!this.hubMotionAllowed(),ready:true};this.mcShot(this._mc,shot);this._mc.typing?.();}
 hubMotionAllowed(){return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
 camUI(o){return o;}
}
async function boot(){await document.fonts.load('700 16px NunitoUI');window.bossMotionGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[BossMotionReview],audio:{noAudio:true}});}boot();
`;
writeFileSync('www/boss-motion-review.js',src.slice(0,end)+tail);writeFileSync('www/boss-motion-review.html','<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url(assets/fonts/NunitoUI-Bold.ttf);font-weight:700}body{margin:0;background:#07040b}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="boss-motion-review.js"></script></html>');
console.log('Built production boss Motion Comic presentation review; no combat');
