import {readFileSync,writeFileSync} from 'node:fs';
const source=readFileSync('game.js','utf8'),end=source.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Save.data={sugar:244,tutorialDone:true,unlockedStage:5};Save.save=()=>{};Sfx.select=()=>{};Sfx.back=()=>{};
class GearPowerReview extends Phaser.Scene{
 constructor(){super('GearPowerReview');}
 preload(){for(const[k,u]of Object.entries(ASSET_IMAGES))if(/^mui_gear_|^screen_gear_power_789$|^hr_ui_|^hr_ic_/.test(k))this.load.image(k,u);}
 create(){this.W=RW;this.H=RH;this.menuScreen='gLoadout';this.state='menu';this.menu=this.add.container();this.tapZones=[];this.buildGearPower();this.input.on('pointerup',p=>{const z=[...this.tapZones].reverse().find(z=>p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h);if(z)z.fn();});document.querySelector('#status').textContent='Ready';}
 hubNextStep(){return{group:'gLoadout',target:'upgrade',tag:'Free shovels'};} hasTargetBadge(t){return t==='gear';} hasClaimableTarget(){return false;}
 buildMenuScreen(){this.lastRoute=this.menuScreen;} menuToast(t){this.toast=t;}
}
for(const k of['buildGearPower','gearPowerLayout','_screenBg','drawRosterHeader','rosterChrome','heroTone','rosterIcon','_coverImage','_zone','hubText','hubTone','hubPanel','hubGuideTag','drawBadgeDot'])GearPowerReview.prototype[k]=Game.prototype[k];
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__gearPowerReviewGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[GearPowerReview]});}boot();
`;
writeFileSync('www/gear-power-review.js',source.slice(0,end)+tail);
writeFileSync('www/gear-power-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#141928}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="gear-power-review.js"></script></html>`);
console.log('Built Gear & Power native Canvas review');
