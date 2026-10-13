import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Save.data={sugar:164,character:'momo',chars:['momo','mint','cocoa','taro','yuzu','sesame'],charUnlockNew:{}};Save.save=()=>{window.heroSaves=(window.heroSaves||0)+1;};Save.power=()=>487;Sfx.select=()=>{};Sfx.back=()=>{};
class HeroesReview extends Phaser.Scene{
 constructor(){super('HeroesReview');}
 preload(){for(const [k,u]of Object.entries(ASSET_IMAGES))if(/^mui_stat_|^hr_ui_|^hr_ic_|^card_|^roster_|^screen_heroes$/.test(k))this.load.image(k,u);}
 create(){this.W=RW;this.H=RH;this.menuScreen='char';this.state='menu';this.character='momo';this.menu=this.add.container();this.tapZones=[];this._heroesTab='roster';this.buildMenuScreen();this.input.on('pointerup',p=>{const z=[...this.tapZones].reverse().find(z=>p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h);if(z)z.fn();});document.querySelector('#status').textContent='Ready';}
 buildMenuScreen(){this.menu.y=0;this.buildHeroes();}
 buildTalents(){this.lastTab='talents';this._heroesTab='roster';this.buildChars();}
 previewStats(){return{dmgMul:1.42,powerMul:1.45,gearAttackMin:6,gearAttackMax:9,critChance:.05,critMul:1.69,cdMul:.96,maxhp:335,dmgTakenMul:.975,armor:17,regen:.3,baseSpeed:178};}
 cancelMenuMotion(){} setMenuScroll(){} camUI(n){return n;}
}
for(const k of ['buildHeroes','buildChars','buildStats','showCharacterInfo','showStatSources','drawHeroesTabs','drawRosterTabs','drawRosterHeader','rosterTabLayout','heroesContentTop','rosterChrome','heroTone','menuRasterPanel','menuRasterIcon','rosterIcon','_characterCardArt','_screenBg','_coverImage','_zone'])HeroesReview.prototype[k]=Game.prototype[k];
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__heroesReviewGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[HeroesReview]});}boot();
`;
writeFileSync('www/heroes-review.js',src.slice(0,end)+tail);
writeFileSync('www/heroes-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#141928}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="heroes-review.js"></script></html>`);
console.log('Built native Canvas Heroes review; synthetic menu-only save');
