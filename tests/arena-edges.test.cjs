const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'('),tail=src.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0,n);return src.slice(at,at+1+next.index);}
const Scene=vm.runInNewContext('class S{'+method('syncBgTile')+'\n}S',{Math,WORLD:4000});
function image(){return {active:true,scene:true,visible:false,texture:{key:'floor'},frame:{name:0},setOrigin(){return this;},setPosition(x,y){this.x=x;this.y=y;return this;},setDisplaySize(w,h){this.w=w;this.h=h;return this;},setCrop(x,y,w,h){this.crop={x,y,w,h};return this;},setDepth(){return this;},setAlpha(){return this;},setVisible(v){this.visible=v;return this;},setTexture(key,name){this.texture.key=key;this.frame.name=name;return this;},setTint(){this.isTinted=true;return this;},clearTint(){this.isTinted=false;return this;}};}
const s=new Scene();s.camWorld=x=>x;s.add={image};s.cameras={main:{worldView:{}}};s.bgTile={active:true,width:2,height:2,visible:false,displayFrame:{width:768,height:512,name:0},displayTexture:{key:'floor'},tileScaleX:1.12,tileScaleY:1.12,alpha:1,depth:-100002};
for(const [cx,cy] of [[0,0],[-1990,0],[1990,0],[0,-1990],[0,1990],[-1990,-1990],[1990,1990],[2700,0]])for(const [w,h] of [[460,980],[1500,700],[1200,1800]]){
 const v={x:cx-w/2,y:cy-h/2,width:w,height:h,right:cx+w/2,bottom:cy+h/2};s.cameras.main.worldView=v;s.syncBgTile();
 const visible=s._bgImgs.filter(i=>i.visible);
 if(v.x>=2000||v.right<=-2000||v.y>=2000||v.bottom<=-2000){assert.equal(visible.length,0);continue;}
 assert(visible.length>0);assert(s._bgImgs.length<=64);
 let x1=Infinity,y1=Infinity,x2=-Infinity,y2=-Infinity;
 for(const i of visible){const c=i.crop,left=i.x+c.x/768*i.w,top=i.y+c.y/512*i.h,right=left+c.w/768*i.w,bottom=top+c.h/512*i.h;assert(left>=-2000-1e-6&&top>=-2000-1e-6&&right<=2000+1e-6&&bottom<=2000+1e-6,'no floor beyond physics bounds');assert(c.w>0&&c.h>0);x1=Math.min(x1,left);y1=Math.min(y1,top);x2=Math.max(x2,right);y2=Math.max(y2,bottom);}
 assert(x1<=Math.max(-2000,v.x)+1e-6&&y1<=Math.max(-2000,v.y)+1e-6&&x2>=Math.min(2000,v.right)-1e-6&&y2>=Math.min(2000,v.bottom)-1e-6,'entire visible walkable floor covered');
}
assert(src.includes('this.cameras.main.removeBounds()'),'camera stays centred for Unique aiming');
assert(src.includes('this._worldObjs=[this.bgTile,this.gridBg,this.arenaRim,'),'rim excluded from UI camera');
console.log('Arena floor: four edges, corners, outside view, portrait/landscape/tablet, reusable crops, coverage and shared texture budget passed');
