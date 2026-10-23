import {readFileSync,writeFileSync} from 'node:fs';
const source=readFileSync(process.env.RUBY_STORY_SOURCE||'game.js','utf8'),end=source.indexOf('// Phaser 3 None GameConfig.resolution');
if(end<0)throw new Error('Game bootstrap boundary missing');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||360,RH=Number(params.get('h'))||780;
Save.save=()=>{};Sfx.select=()=>{};window.__reviewNow=10000;const reviewNativeNow=Date.now;Date.now=()=>reviewNativeNow()+window.__reviewNow;
class RubyStoryReview extends Game{
 preload(){for(const k of [...RUBY_COMIC_KEYS,...RUBY_STORY_KEYS,...RUBY_MENU_KEYS,'mascot_ruby'])if(ASSET_IMAGES[k])this.load.image(k,ASSET_IMAGES[k]);}
 create(){this.W=RW;this.H=RH;this.state='menu';this.menuScreen='hub';this.add.rectangle(0,0,RW,RH,0xff00ff,1).setOrigin(0);this.menu=this.add.container();this.tapZones=[];this.completed=0;window.__rubyReviewScene=this;window.__rubyReviewEntries=RUBY_STORYBOOK;document.querySelector('#status').textContent='Ready';}
 update(){} ensureGroup(){}
 reviewOpen(kind,index=0){this._rubyTalk?.destroy();this.tapZones=[];this.completed=0;const done=()=>this.completed++;
   if(kind==='story'){const e=RUBY_STORYBOOK[index];this.rubyTalk(e.pages.map(p=>p.text),done,{title:e.title,pages:e.pages,storybook:true});}
   else if(kind==='memory')this.rubyTalk(['Grandma taught me to stir ruby jam slowly, so its sweet flavor could find its way home.','She gave me this recipe book. We can bring those flavors back together.'],done,{memory:index?'ruby_memory_jar':'ruby_memory_grandma'});
   else this.rubyTalk(['The next recipe is waiting. Let’s explore the garden together!','Keep moving, and watch for the red warning marks.'],done);
 }
}
async function boot(){await document.fonts.load('700 16px NunitoUI');window.__rubyReviewGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[RubyStoryReview]});}boot();
`;
writeFileSync('www/ruby-story-review.js',source.slice(0,end)+tail);
writeFileSync('www/ruby-story-review.html',`<!doctype html><html><meta charset="utf-8"><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#ff00ff}#status{display:none}</style><p id="status">Loading</p><div id="mount"></div><script src="phaser.min.js"></script><script src="ruby-story-review.js"></script></html>`);
console.log('Built production Ruby story Canvas review (synthetic narration only)');
