// Static production card/texture gallery, never starts combat or a run.
import {readFileSync,writeFileSync} from 'node:fs';
const source=readFileSync('game.js','utf8'),end=source.indexOf('// Phaser 3 None GameConfig.resolution');if(end<0)throw Error('Missing bootstrap boundary');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=Number(params.get('w'))||360,RH=Number(params.get('h'))||780;
Save.data={character:'yuzu',settings:{reducedMotion:true,vfx:1}};Save.save=()=>{};
class HierarchyReview extends Game{
 preload(){for(const kind of ['pomelo','lime','bloodorange'])this.load.image('yc59_evo_'+kind,ASSET_IMAGES['yc59_evo_'+kind]);this.load.image('ic_yz_seedling',ASSET_IMAGES.ic_yz_seedling);for(const key of ['yz_mn97_guard','yz_mn97_archer','yz_mn97_mage','yz_mn97_shots']){const a=ASSET_SHEETS[key];this.load.spritesheet(key,a.url,{frameWidth:a.frame,frameHeight:a.frame});}}
 create(){this.W=RW;this.H=RH;this.state='levelup';this.character='yuzu';this.player={x:0,y:0,hp:100,maxhp:100};this.menu=this.add.container();this.tapZones=[];this.add.rectangle(0,0,RW,RH,0x261e30).setOrigin(0).setDepth(-1);window.__yuzu97Scene=this;this.review('zestSwarm');document.getElementById('status').textContent='Ready';}
 update(){} camUI(o){return o;} hubMotionAllowed(){return false;}
 review(path){this.menu.removeAll(true);this.basicAttack={character:'yuzu',path,lv:{},ranks:{},_pm:{}};this._yuzuCrew=[];this.level=7;const two=this.yuzuDraftGuard([{key:'power'}])[0];this.basicAttack.lv.companion_form=1;this.level=11;const three=this.yuzuDraftGuard([{key:'power'}])[0];this.basicAttack.lv.companion_form=0;
 const u=BASIC_ATTACKS.yuzu.upgrades.find(u=>u.id==='seedling'),minion={...u,type:'basic',key:u.id,title:u.name,lvl:1,color:0xffd85e,kind:'Basic Attack'};this.cards=[two,minion,three];this.cardGroups=[];this.cards.forEach((card,i)=>{const group=this.add.container(),y=12+i*Math.floor((RH-24)/3),h=Math.floor((RH-24)/3)-10;this.menu.add(group);this.drawReadableChoiceCard(group,card,16,y,RW-32,h);this.cardGroups.push({group,x:16,y,w:RW-32,h});});
 }
}
window.__yuzu97Review=new Phaser.Game({type:Phaser.CANVAS,width:RW,height:RH,parent:'mount',backgroundColor:'#261e30',scene:[HierarchyReview],audio:{noAudio:true},render:{antialias:true}});
`;
writeFileSync('www/yuzu-hierarchy-review.js',source.slice(0,end)+tail);writeFileSync('www/yuzu-hierarchy-review.html','<!doctype html><meta charset="utf-8"><body style="margin:0;background:#261e30"><div id="status">Loading</div><div id="mount"></div><script src="phaser.min.js"></script><script src="yuzu-hierarchy-review.js"></script>');console.log('Built static Yuzu97 production card/texture review');
