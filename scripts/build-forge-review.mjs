import {readFileSync,writeFileSync} from 'node:fs';
const source=readFileSync('game.js','utf8'),end=source.indexOf('// Phaser 3 None GameConfig.resolution');
if(end<0)throw Error('Review anchor missing');
const tail=`
const RENDER_DPR=1;
const params=new URLSearchParams(location.search),RW=Math.max(320,Math.min(1000,Number(params.get('w'))||390)),RH=Math.max(390,Math.min(1700,Number(params.get('h'))||844)),reviewState=params.get('state')||'power';
function seedReview(){
 const weapons=['w_knife','w_chop','w_whisk'].map(id=>GEAR_ALL.find(b=>b.id===id)),owned=[];
 for(const sd of GEAR_SLOTS){const b=sd.slot==='weapon'?weapons[0]:GEAR_ALL.find(b=>b.slot===sd.slot&&b.tier!=='start'&&!b.unique);if(b)owned.push({uid:'review-'+sd.slot,baseId:b.id,slot:sd.slot,grade:b.tier,itemLevel:55,affixes:[{id:'f_might',v:8,t:5,line:0},{id:'f_vital_dough',v:30,t:5,line:1}]});}
 weapons.slice(1).forEach((b,i)=>owned.push({uid:'review-extra-'+i,baseId:b.id,slot:'weapon',grade:b.tier,itemLevel:reviewState==='utility'?25:16+i,affixes:[{id:'f_might',v:8,t:5,line:0},{id:'f_vital_dough',v:30,t:5,line:1}]}));
 for(const it of owned)for(const a of it.affixes){const m=affixDef(a.id);a.t=Math.max(5,affixBestTierForItem(it,m));a.v=m.tiers[a.t][0];}
 Save.data={sugar:554,currency:{transmute:24,alt:18,chaos:12,divine:10},gearItems:owned,equippedGear:Object.fromEntries(owned.filter(i=>!i.uid.includes('extra')).map(i=>[i.slot,i.uid])),gear:Object.fromEntries(owned.map(i=>[i.slot,i.baseId])),gearLv:{},forgeEconomyVersion:1};
 Save.save=()=>{};for(const k of Object.keys(Sfx))if(typeof Sfx[k]==='function')Sfx[k]=()=>{};
}
seedReview();
class ForgeReview extends Phaser.Scene{
 constructor(){super('ForgeReview');}
 preload(){
  const wanted=new Set(['fg_ui_atlas','craft_bench_bg','hr_ic_candy','hr_ic_melee','hr_ic_control','hr_ic_precision',...CURRENCY.map(c=>c.asset),...Save.data.gearItems.map(it=>'gear_'+it.baseId)]);
  for(const key of wanted)if(ASSET_IMAGES[key])this.load.image(key,ASSET_IMAGES[key]);
  this.load.on('loaderror',f=>{document.getElementById('status').textContent='Asset load failed: '+f.key;});
 }
 create(){
  this.W=RW;this.H=RH;this.state='menu';this.menuScreen='craft';this.gearSlot='weapon';this.menu=this.add.container(0,0);this.tapZones=[];
  this.craftSelectedUid=reviewState==='power'?'review-weapon':'review-extra-0';this.craftLineIndex=reviewState==='sustain'?1:reviewState==='utility'?2:0;
  const item=Save.gearItem(this.craftSelectedUid),groups=[...new Set(forgePool(item,2).map(m=>m.group))];this.craftGroup=groups.includes('quantity')?'quantity':groups[0];
  if(reviewState==='sustain')item.forgeChoice={line:1,paid:'alt',options:['f_vital_dough','f_slow_recovery'].map(id=>{const m=affixDef(id),t=forgePreviewTier(item,1,m);return{id,t,v:m.tiers[t][0]};})};
  this._forgePanel=null;this.input.on('pointerup',p=>{const z=[...this.tapZones].reverse().find(z=>p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h);if(z)z.fn();this.status();});
  this.buildCraftBench();this.status();
 }
 status(){document.getElementById('status').textContent='Ready · '+RW+'×'+RH+' · '+reviewState+' · menu scroll '+(this._mScrollMax||0)+' · '+this.tapZones.length+' controls';}
 buildMenuScreen(){this.menuScreen='craft';this._forgePanel=null;this.buildCraftBench();}
 screenFlash(){} screenShake(){} showBanner(){} drawMenuScrollIndicator(){}
}
for(const key of ['forgeFrame','forgeChrome','forgeText','forgeIcon','forgeButton','forgeResetPick','forgeSelectItem','forgeOpenPanel','buildCraftBench','_buildCraftBenchRaw','drawForgePanel','_screenBg','_coverImage','_zone','setupMenuScroll','setMenuScroll','_craftContext','forgeAct','affixHype'])ForgeReview.prototype[key]=Game.prototype[key];
async function bootReview(){await document.fonts.load('700 16px NunitoUI');await document.fonts.load('400 12px NunitoUI');window.__forgeReviewGame=new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,backgroundColor:'#1a1420',render:{antialias:true},scene:[ForgeReview]});}
window.addEventListener('error',e=>{document.getElementById('status').textContent='Error: '+e.message;});
bootReview();
`;
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Forge UI Review</title><style>@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Regular.ttf');font-weight:400}@font-face{font-family:NunitoUI;src:url('assets/fonts/NunitoUI-Bold.ttf');font-weight:700}body{margin:0;background:#15101d;color:#fff0df;font-family:NunitoUI,sans-serif}header{padding:10px;display:flex;gap:12px;align-items:center}a{color:#9fe2bc}#status{margin:4px 10px;font-size:12px}#mount{width:max-content;margin:8px auto}select{background:#39243e;color:white;padding:6px;border:1px solid #9f6fa8;border-radius:6px}</style><header>Forge UI Review · sample data <select aria-label="State" id="state"><option value="power">Power</option><option value="sustain">Sustain choices</option><option value="utility">Utility</option></select><select aria-label="Viewport" id="viewport"><option value="390,844">390×844</option><option value="320,568">320×568</option><option value="360,640">360×640</option><option value="430,932">430×932</option><option value="844,390">844×390</option><option value="691,1536">691×1536</option></select></header><p id="status">Loading menu assets…</p><div id="mount"></div><script src="phaser.min.js"></script><script src="forge-review.js"></script><script>document.getElementById('state').value=new URLSearchParams(location.search).get('state')||'power';document.getElementById('viewport').value=(new URLSearchParams(location.search).get('w')||390)+','+(new URLSearchParams(location.search).get('h')||844);function change(){const v=document.getElementById('viewport').value.split(',');location.search='?state='+document.getElementById('state').value+'&w='+v[0]+'&h='+v[1];}document.getElementById('state').onchange=change;document.getElementById('viewport').onchange=change;</script></html>`;
writeFileSync('www/forge-review.js',source.slice(0,end)+tail);writeFileSync('www/forge-review.html',html);console.log('Built real-method Phaser Canvas Forge review (synthetic save, no combat)');
