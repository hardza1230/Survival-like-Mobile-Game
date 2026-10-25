import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||390,RH=Number(params.get('h'))||844;
Save.data={settings:{},stageEpiloguesSeen:{}};Save.cp=()=>({lvl:16,exp:45});Save.power=()=>5220;Save.save=()=>{};Stats.end=()=>{};
for(const k of ['stopCraft','result','orderCue'])Sfx[k]=()=>{};
class ResultReview extends Phaser.Scene{
 constructor(){super('ResultReview');}
 preload(){for(const k of ['result_victory','result_defeat','sc44_background','sc44_frame','vfx_glow',...GEAR_ALL.slice(0,12).map(v=>'gear_'+v.id),...CURRENCY.slice(0,12).map(v=>v.asset)])if(ASSET_IMAGES[k])this.load.image(k,ASSET_IMAGES[k]);for(const id of ['momo','mint','cocoa','taro','sesame','yuzu','berry']){const k='char_'+id,d=ASSET_SHEETS[k];if(d)this.load.spritesheet(k,d.url,{frameWidth:d.frame,frameHeight:d.frame});}}
 create(){this.W=RW;this.H=RH;this.over=this.add.container();this.physics={pause(){}};this.player={setVelocity(){}};this.fixture();this.input.on('pointerup',p=>{if(this.state!=='summary')return;for(const z of this._summaryBtns||[])if(p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h){z.fn();return;}this.finishSummaryPresentation();});window.resultsView=this;document.querySelector('#status').textContent='Ready';}
 fixture(o={}){Object.assign(this,{character:o.hero||'momo',stageIndex:0,state:'play',elapsed:407,stageKills:1813,sugarStage:o.empty?0:2672,_dailyBonus:0,_clearShovels:3,_quitSummary:!!o.quit,_starRes:o.quit?null:{mask:3,fresh:2,bonus:30},_openedBoxes:o.empty?[]:Array.from({length:23},(_,i)=>{const v=GEAR_ALL[i%12];return{id:v.id,name:i===22?'Grandmother’s Enchanted Crown':v.name,tier:i===22?'legend':'common',ilv:35};}),_newSpecies:['basic'],_powerBefore:o.empty?5220:5190,_powerAfter:5220,_firstMastery:!o.quit,_lastLvlUps:o.empty?0:1,_runCurrency:o.empty?{}:Object.fromEntries(CURRENCY.slice(0,12).map((v,i)=>[v.key,i+1])),_summaryDoubled:!!o.doubled,_summaryPresentationShown:false,_charExpGain:{character:o.hero||'momo',before:{lvl:15,exp:80},gain:charExpNeed(15)-80+45}});this.showStageSummary(!!o.last);}
 hubMotionAllowed(){return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
 continueFromSummary(focus){this.continued=focus||true;this.stopSummaryPresentation();}
 showRewardedAd(label,fn){this.adCallback=fn;this.adCalls=(this.adCalls||0)+1;}
 adDoubleSugar(){if(this._summaryDoubled)return;this._summaryDoubled=true;this.showStageSummary(this._summaryLast);}
 camUI(o){return o;}
}
for(const k of ['showStageSummary','summaryText','summaryCard','summaryRewardPanel','summaryButton','openSummaryDetails','finishSummaryPresentation','stopSummaryPresentation','animateSummaryRewards','buildSummaryExpBar','resultBackdrop','_coverImage','playSummaryGrowth'])ResultReview.prototype[k]=Game.prototype[k];
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__resultReviewGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[ResultReview],audio:{noAudio:true}});}boot();
`;
writeFileSync('www/results-review.js',src.slice(0,end)+tail);
writeFileSync('www/results-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#14101c}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="results-review.js"></script></html>`);
console.log('Built static production Stage Clear review; no combat simulation');
