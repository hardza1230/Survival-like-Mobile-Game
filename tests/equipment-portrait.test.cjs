const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const source=fs.readFileSync('game.js','utf8');
const block=source.slice(source.indexOf('  buildGear(){'),source.indexOf('    const rowY=[ay+ss/2',source.indexOf('  buildGear(){')));
const start=block.indexOf('const im=this.add.image(0,0,key)'),end=block.indexOf('this.menu.add(im);',start)+'this.menu.add(im);'.length;const code=block.slice(start,end);
for(const id of ['momo','mint','cocoa','taro','sesame','yuzu','berry'])for(const avW of [74,180,349,680])for(const [TW,TH] of [[1024,1536],[1024,1024],[1536,2048]]){
 const im={width:TW,height:TH,setCrop(x,y,w,h){this.crop={x,y,w,h};return this;},setOrigin(x,y){this.origin={x,y};return this;},setScale(s){this.scale=s;return this;},setPosition(x,y){this.position={x,y};return this;}};
 vm.runInNewContext('(function(){'+code+'}).call(scene)',{scene:{add:{image:()=>im},menu:{add:()=>{}}},id,key:'card_'+id,avW,avH:148,ax:12,ay:82},{timeout:1000,contextCodeGeneration:{strings:false,wasm:false}});
 assert.equal(im.crop.h,TH*(id==='berry'?.68:.55));assert.equal(im.crop.y,TH*(id==='berry'?.14:.03));assert.ok(im.crop.y+im.crop.h>=TH*.5,'face remains within crop');assert.ok(im.crop.w*im.scale<=avW-6+.001);assert.ok(im.crop.h*im.scale<=142.001);assert.equal(im.position.x,12+avW/2);assert.equal(im.position.y,156);
}
console.log('Equipment portrait: stable face crop and contained bounds at phone/tablet widths passed');
