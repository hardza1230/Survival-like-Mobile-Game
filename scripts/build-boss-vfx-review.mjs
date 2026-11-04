// Static real Canvas texture/frame gallery; no attacks, enemies or combat update.
import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('game.js','utf8'),end=src.indexOf('// Phaser 3 None GameConfig.resolution');if(end<0)throw Error('GameConfig boundary');
const tail=`
const RENDER_DPR=1,params=new URLSearchParams(location.search),RW=+params.get('w')||390,RH=+params.get('h')||844;
class BossVfxReview extends Phaser.Scene{
 constructor(){super('BossVfxReview');}
 preload(){for(const [key,spec]of Object.entries(ASSET_FX))if(/^vfx81[34]_/.test(key))this.load.spritesheet(key,spec.url,{frameWidth:spec.fw,frameHeight:spec.fh});}
 create(){Save.data=Save.data||{};Save.data.settings={vfx:params.get('low')==='1'?0:1};this.state='play';this.samples=[];this.add.rectangle(RW/2,RH/2,RW,RH,0x261e30);const keys=Object.keys(ASSET_FX).filter(k=>/^vfx81[34]_/.test(k)),cw=RW/2,rh=(RH-20)/Math.ceil(keys.length/2);
  keys.forEach((key,i)=>{const x=(i%2+.5)*cw,y=20+(Math.floor(i/2)+.5)*rh,size=Math.max(8,Math.min(cw-20,rh-20)),fd=ASSET_FX[key],unit=size/Math.max(fd.fw,fd.fh),image=this.add.sprite(x,y,key,0).setDisplaySize(fd.fw*unit,fd.fh*unit);this.battleOutlineTrack(image,key,key,null,true);this.samples.push({key,image});this.add.text(x,y-rh/2+2,key.replace(/^vfx81[34]_/,''),{fontSize:'10px',color:'#fff0cd'}).setOrigin(.5,0);});window.bossVfxReview=this;
 }
 camWorld(o){return o;}trackArtVfx(o){return o;}hubMotionAllowed(){return params.get('reduced')!=='1';}
 realTex(k){return this.textures.exists(k);}
}
for(const name of ['battleOutlineKey','battleOutlineTrack','battleOutlineFrame','clearBattleOutline'])BossVfxReview.prototype[name]=Game.prototype[name];
new Phaser.Game({type:Phaser.CANVAS,parent:'mount',width:RW,height:RH,scene:[BossVfxReview]});
`;
writeFileSync('www/boss-vfx-review.js',src.slice(0,end)+tail);writeFileSync('www/boss-vfx-review.html','<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:#261e30}</style><div id="mount"></div><script src="phaser.min.js"></script><script src="boss-vfx-review.js"></script></html>');console.log('Built static C1/C2 boss painted-outline Canvas review (no combat)');
