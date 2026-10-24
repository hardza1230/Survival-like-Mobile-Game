// Static production HUD, synthetic values only. No combat update or enemy simulation.
import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||360,RH=Number(params.get('h'))||780;
Save.save=()=>{};Save.data.settings={ctrlSize:Number(params.get('size'))||0,ctrlLeft:params.has('left')};
class CombatHUDReview extends Game{
 preload(){for(const k of ['bg1','replay_progress_art','xp_bar_icon'])this.load.image(k,ASSET_IMAGES[k]);this.load.spritesheet('ui_c24_season_icons',ASSET_SHEETS.ui_c24_season_icons.url,{frameWidth:64,frameHeight:64});this.load.spritesheet('hero',ASSET_SHEETS.char_momo.url,{frameWidth:128,frameHeight:128});const k=SKILL_ICON.sprinkle;if(k&&ASSET_IMAGES[k])this.load.image(k,ASSET_IMAGES[k]);}
 create(){this.W=RW;this.H=RH;this.character='momo';this.basicAttack={path:'spread',lv:{},ranks:{}};this.gameSpeed=1;this.uniqueCd=2;this.dashReady=true;this.elapsed=10;this.level=10;this.xp=22;this.xpNext=100;this.stageIndex=0;this.waveIndex=1;this.waveTimer=5;this.mode='wave';this.state='play';this.skills={sprinkle:4};this.relics=[];this.player={hp:106,maxhp:106,x:RW/2,y:RH/2};
  this.add.tileSprite(RW/2,RH/2,RW,RH,'bg1').setTileScale(.55);
  this.add.sprite(RW/2,RH/2-8,'hero',0).setDisplaySize(44,44);
  this.buildHUD();this.buildSkillBar();this.hudVisible(true);this.stageTxt.setText('C1-1 · Sour Ant Nest');this._stageTxtAt=10;this.lvlTxt.setText('Lv 10');this.killTxt.setText('KOs 220');this.runSugarTxt.setText('🍬 231');
  this.waveObjective={type:'survive',name:'Survive the Swarm',emoji:'⏳',color:0x9be36f,progress:25,target:30};this._bonus={id:'nohit',hits:0,maxHits:2,reward:'relic'};this.renderWaveObjectiveHUD();this.timeTxt.setText('Wave 2/5 · 5s');this.drawWavePips();this.drawBars();this.drawDashRing();this.drawUniqueRing();this.drawOverheadStatus(1);
  window.hudReview=this;document.querySelector('#status').textContent='Ready';
 }
 checkCombos(){} update(){} camUI(o){return o;} syncUniqueIcon(){} realTex(k){return this.textures.exists(k);}
}
async function boot(){await document.fonts.load('700 16px NunitoUI');new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[CombatHUDReview]});}boot();
`;
writeFileSync('www/combat-hud-review.js',src.slice(0,end)+tail);
writeFileSync('www/combat-hud-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#171321}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="combat-hud-review.js"></script></html>`);
