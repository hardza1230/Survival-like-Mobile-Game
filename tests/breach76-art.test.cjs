const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const root = path.join(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file));
const source = read('game.js').toString('utf8');
const rows = JSON.parse(read('assets/incoming/breach76/MANIFEST.json'));
const species = ['mite','maw','claw','eye'];
assert.deepEqual(rows.map(row=>row.key).sort(),species.flatMap(sp=>['walk','death'].map(action=>'brm_'+sp+'_'+action)).sort());

const a=source.indexOf('const STAGE_DECOR={'),b=source.indexOf('\n};',a)+3;
const ctx={navigator:{},localStorage:{getItem:()=>null},console,location:{search:'',href:'http://x/'},document:{},
  Phaser:{Math:{Clamp:(x,l,h)=>Math.max(l,Math.min(h,x))}},Save:{data:{}},TAU:2*Math.PI,WORLD:4000};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(source.slice(a,b)+'\n'+source.slice(source.indexOf('const ASSET_IMAGES ='),source.indexOf('class Boot extends'))+
  ';this.assets={ASSET_FX,artClass,lazyArt,bootKeep};',ctx);

for(const row of rows){
  const {key,file,bytes,sha256}=row,png=read('assets/incoming/breach76/'+file),walk=key.endsWith('_walk');
  assert.equal(png.length,bytes);
  assert.equal(crypto.createHash('sha256').update(png).digest('hex'),sha256);
  assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20),png[25]],[1152,192,6]);
  const {url,fw,fh,frames,rate,loop}=ctx.assets.ASSET_FX[key];
  assert.equal(url,'assets/art/breach76/'+key+'.webp');
  const webp=read(url);
  assert.equal(webp.toString('ascii',0,4),'RIFF');
  assert.equal(webp.toString('ascii',8,12),'WEBP');
  assert.deepEqual([fw,fh,frames,rate,!!loop],[128,128,6,walk?10:14,walk]);
  assert.equal(ctx.assets.artClass(key),'stage');
  assert(ctx.assets.lazyArt(key,url,'momo')&&!ctx.assets.bootKeep(key));
}

function method(name){
  const start=source.indexOf('\n  '+name+'(')+1;
  assert(start>0,name);
  const next=source.slice(start).search(/\n  (?:[\w$]+\(|\/[/*])/);
  return source.slice(start,start+next).trimEnd();
}
const methods=['hmSetup','hmOpen','hmRiftFx','hmTick','hmOnKill','hmSplinters','hmBurst','missionArtKeys','breachFoeArt','breachFoeDeath'];
const m=vm.runInContext('({'+methods.map(method).join(',')+'})',ctx);

for(const key of rows.map(r=>r.key)){
  assert(m.missionArtKeys.call({},1).includes(key));
  assert(m.missionArtKeys.call({recipeMode:true},8).includes(key));
  assert(!m.missionArtKeys.call({},0).includes(key));
}
for(const name of ['hmTick','hdTick']){
  const code=method(name);
  assert(code.includes('setTint?.(0xc59bff)')&&code.includes('this.breachFoeArt?.(e)'));
}
assert(method('sigOnKill').includes('this.breachFoeDeath?.(e)'));
assert(method('hmTick').includes('e._brSp=null'));
assert(method('hdLord').includes('q._brSp=null'));

const scene={
  artFollow(e,key,size){this.follow=[key,size];return this.loaded?{}:null;},
  artFx(key,x,y,size){this.death=[key,x,y,size];return this.loaded?{setFlipX(v){scene.flip=v;}}:null;}
};
const foe={x:0,y:0,clearTint(){this.cleared=true;}};
m.breachFoeArt.call(scene,foe);
assert.equal(foe._brSp,undefined);
assert.equal(foe.cleared,undefined);
scene.loaded=true;
m.breachFoeArt.call(scene,foe);
assert.deepEqual(scene.follow,['brm_mite_walk',56]);
assert.equal(foe._brSp,'mite');
assert(foe.cleared);
foe._artOv={flipX:true};
m.breachFoeDeath.call(scene,foe);
assert.deepEqual(scene.death,['brm_mite_death',0,0,56]);
assert.equal(foe._brSp,null);
assert(foe._missionDeathArt&&scene.flip);
scene.follow=null;
m.breachFoeArt.call(scene,{x:0,y:0,_hmLord:true});
m.breachFoeArt.call(scene,{x:0,y:0,_hdLord:true});
assert.equal(scene.follow,null);

function fixture(full){
  const obj=()=>({
    active:true,visible:true,setRadius(v){this.radius=v;return this;},setVisible(v){this.visible=v;return this;},
    setStrokeStyle(){return this;},setDepth(){return this;},setPosition(){return this;},setOrigin(){return this;},setText(){return this;}
  });
  const drawn={};
  const graphics=Object.assign(obj(),{
    clear(){drawn.drawn=false;},fillStyle(color,alpha){drawn.tint=[color,alpha];return this;},
    fillPoints(points){drawn.points=points;drawn.drawn=true;return this;},
    lineStyle(){return this;},strokePoints(){return this;},lineBetween(){}
  });
  let sealed=0;
  const s=Object.assign({},m,{
    player:{x:0,y:0},sugarStage:0,sugarRun:0,stageIndex:1,fpFull:()=>full,
    objectivePosition:()=>({x:0,y:0}),sigAdd:o=>o,sigArt:()=>obj(),artIsSpr:()=>false,
    dist:(a,b,c,d)=>Math.hypot(a-c,b-d),sigNear:()=>true,sigSpawnAt:()=>null,
    add:{circle:obj,text:obj,graphics:()=>graphics},tweens:{add(){}},
    completeWaveObjective(){sealed++;}
  });
  return {s,drawn,sealed:()=>sealed};
}
for(const full of [false,true]){
  const {s,drawn,sealed}=fixture(full),o={},S={};
  s.hmSetup(o,S);
  s.hmOpen(o,S);
  assert.equal(S.openLeft,20);
  assert(S.riftG&&!S.ring.visible);
  const initialRadius=S.R;
  s.hmTick(.5,o,S);
  assert(S.R>initialRadius&&drawn.drawn&&drawn.tint[0]===0x381857&&drawn.points.length===64);
  for(let step=1;step<40;step++){
    for(let i=0;i<4;i++)s.hmOnKill({x:0,y:0,isElite:true},o,S);
    assert(S.life<=S.openLeft);
    s.hmTick(.5,o,S);
  }
  assert.equal(S.phase,'close','sustained kills must not exceed the hard 20-second cap');
  const openRadius=S.R;
  s.hmTick(.3,o,S);
  assert(S.R<openRadius*.7,'edge retracts faster than it expanded');
  s.hmTick(.56,o,S);
  assert.equal(S.phase,'sealed');
  assert.equal(sealed(),1);
  assert(!drawn.drawn);
  s.hmTick(.1,o,S);
  assert.equal(sealed(),1);
}
console.log('Order 76: eight staged sheets, walk/death fallback, procedural rift and 20-second cap under continuous kills passed');
