import {readFileSync,writeFileSync} from 'node:fs';
const source=readFileSync('game.js','utf8'),end=source.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1;
const params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Save.data={sugar:164,tutorialDone:true,unlockedStage:5,hubUnlockSeen:5,seenVersion:GAME_VERSION};Save.save=()=>{};
class HubReview extends Phaser.Scene{
 constructor(){super('HubReview');}
 preload(){for(const [k,u]of Object.entries(ASSET_IMAGES))if(/^hub_ui_|^hub_btn_|^menu_hub_v3$/.test(k))this.load.image(k,u);}
 create(){this.W=RW;this.H=RH;this.menuScreen='hub';this.state='menu';this.character='momo';this.menu=this.add.container(0,0);this.tapZones=[];this.buildHub();this.input.on('pointerup',p=>{const z=[...this.tapZones].reverse().find(z=>p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h);if(z)z.fn();});document.querySelector('#status').textContent='Ready';}
 claimReadyQuests(){} hasNewsBadge(){return false;} hasTargetBadge(){return false;} hasGroupBadge(){return false;} hubNextStep(){return{hub:3,tag:'Rewards ready'};}
 buildMenuScreen(){this.stopHubMotion();this.lastRoute=this.menuScreen;this.menu.removeAll(true);this.tapZones=[];}
 menuToast(){}
}
for(const k of ['buildHub','hubLayout','hubTone','hubPanel','hubChrome','hubText','hubArt','hubGuideTag','hubMotionAllowed','hubTween','stopHubMotion','startHubAmbience','_coverImage','_zone'])HubReview.prototype[k]=Game.prototype[k];
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__hubReviewGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,backgroundColor:'#141928',scene:[HubReview]});}boot();
`;
writeFileSync('www/hub-review.js',source.slice(0,end)+tail);
writeFileSync('www/hub-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#141928}#status{display:none}#mount{width:max-content}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="hub-review.js"></script></html>`);
console.log('Built native Canvas Hub review, synthetic menu data only');
