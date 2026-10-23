import {readFileSync,writeFileSync} from 'node:fs';
const source=process.env.LOBBY_SOURCE?readFileSync(process.env.LOBBY_SOURCE,'utf8'):readFileSync('game.js','utf8'),end=source.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||360,RH=Number(params.get('h'))||780;
Save.save=()=>{};Save.data.tutorialDone=true;Save.data.unlockedStage=params.has('early')?0:15;Save.data.character=params.get('hero')||'momo';Save.data.sugar=9999999;Save.data.thread=987654;Save.data.rank=125;Save.data.cardSeen={};Save.data.charProg={};Save.threads=()=>987654;Sfx.select=()=>{};Sfx.back=()=>{};
class LobbyReview extends Game{
 preload(){for(const[k,u]of Object.entries(ASSET_IMAGES))if(k==='dot'||k==='vfx_glow'||k==='gear_'+GEAR_ALL[0].id||k==='mascot_ruby'||k==='reveal_theater'||Object.values(FEAT_ICON).includes(k)||LB_KEYS.includes(k)||/^card_|^roster_|^stage_card_s(01|15)$|^hub_ui_candy$|^ic_thread$/.test(k))this.load.image(k,u);}
 create(){this.W=RW;this.H=RH-NAV_H;this.menuScreen='hub';this.state='menu';this.menu=this.add.container();this.tapZones=[];this._navOn=true;this.buildLobby();this.H=RH;this.drawNavBar('hub',RH);window.__lobbyScene=this;document.querySelector('#status').textContent='Ready';}
 update(){} menuPrefetch(){} featureReveal(){} loadLobbyArt(){} ensureGroup(){} lhKey(){return null;} hubTween(){} hubEvery(){} stopHubMotion(){} hasTargetBadge(){return false;} groupBadge(){return false;} lhLoad(){} powerStatus(){return{cur:12345,rec:14000,ratio:.88,hex:'#ffe08a'};} buildMenuScreen(){this.lastRoute=this.menuScreen;}
}
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__lobbyGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[LobbyReview]});}boot();
`;
writeFileSync('www/lobby-review.js',source.slice(0,end)+tail);
writeFileSync('www/lobby-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#141928}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="lobby-review.js"></script></html>`);
console.log('Built production Lobby Canvas review (synthetic menu data only)');
