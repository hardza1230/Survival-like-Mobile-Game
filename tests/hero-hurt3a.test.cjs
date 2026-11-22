const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname,'..');
const src = fs.readFileSync(path.join(root,'game.js'),'utf8');
const incoming = path.join(root,'assets/incoming/hero-hurt3a');
const rows = JSON.parse(fs.readFileSync(path.join(incoming,'MANIFEST.json'),'utf8'));
const heroes = {cocoa:'chef',yuzu:'summer',mint:'snow',taro:'star',sesame:'moon'};
const keys = Object.entries(heroes).flatMap(([hero,tag])=>['char_'+hero+'_hurt','char_'+hero+'_hurt__'+tag]);
assert.deepEqual(rows.map(row=>row.key).sort(),keys.sort());
const ctx = {Save:{data:{}},Cos:{skin:hero=>({hero,tag:heroes[hero]})},navigator:{},localStorage:{getItem:()=>null},
  location:{search:'',href:'http://x/'},document:{}};
ctx.window=ctx;
vm.createContext(ctx);
const start=src.indexOf('const STAGE_DECOR={'),end=src.indexOf('\n};',start)+3;
vm.runInContext(src.slice(start,end)+'\n'+src.slice(src.indexOf('const ASSET_IMAGES ='),
  src.indexOf('class Boot extends'))+';this.assets={ASSET_SHEETS,artHero,lazyArt,bootKeep,CF};',ctx);
for (const row of rows) {
  const data=fs.readFileSync(path.join(incoming,row.file));
  assert.equal(data.length,row.bytes);
  assert.equal(createHash('sha256').update(data).digest('hex'),row.sha256);
  assert.deepEqual([data.readUInt32BE(16),data.readUInt32BE(20),data[25],row.frameCount,row.loop],[1024,128,6,8,false]);
  const {key}=row;
  const hero=key.split('_')[1];
  const {url,frame}=ctx.assets.ASSET_SHEETS[key];
  assert.deepEqual([url,frame],['assets/art/hero-hurt3a/'+key+'.webp',128]);
  assert.equal(ctx.assets.artHero(key),hero);
  assert(ctx.assets.lazyArt(key,url,hero)&&!ctx.assets.bootKeep(key));
  assert.equal(fs.readFileSync(path.join(root,url)).toString('ascii',8,12),'WEBP');
}
function method(name) {
  const mark=src.indexOf('\n  '+name+'(');
  assert.ok(mark>0,name);
  const tail=src.slice(mark+1);
  return tail.slice(0,tail.slice(2).search(/\n  [\w$]+\(/)+2);
}
const Scene=vm.runInContext('(class {'+['bpPose','updatePose','poseFlash','skinSwap','skinFixAnims','runArtKeys'].map(method).join('\n')+'\n})',ctx);
for (const [hero,tag] of Object.entries(heroes)) {
  for (const skin of [false,true]) {
    const key='char_'+hero+'_hurt',base={key,frameTotal:9,id:'base'};
    const variant={key:key+'__'+tag,frameTotal:9,id:'skin'};
    const textures=new Map([[key,base],[variant.key,variant]]);
    const s=new Scene();
    Object.assign(s,{state:'play',character:hero,_hasFrames:true,_blinkT:2,dashTime:0,
      textures:{exists:k=>textures.has(k),get:k=>textures.get(k),getTextureKeys:()=>[...textures.keys()],
        renameTexture(a,b){const t=textures.get(a);textures.delete(a);t.key=b;textures.set(b,t);}}});
    s.player={texture:{key:'char_'+hero},setTexture(k){this.texture=textures.get(k);return this;},
      setFrame(f){this.frame=f;return this;}};
    ctx.Cos.skin=()=>skin?{hero,tag}:null;
    s.runArtEndgame=()=>false;
    const requested=s.runArtKeys();
    assert(requested.includes(key));
    assert.equal(requested.includes(variant.key),skin);
    for(const other of Object.keys(heroes))if(other!==hero)assert(!requested.includes('char_'+other+'_hurt'));
    if(skin)assert.equal(s.skinSwap(true),1);
    s.poseFlash(ctx.assets.CF.hurt,160);
    const expected=hero==='cocoa'?.30:.26;
    assert.equal(hero==='cocoa'?s._bpPose.d:s._poseDuration,expected);
    const shown=[];
    for(let i=0;i<8;i++){
      s.updatePose(expected/(i===0?16:8));
      shown.push(s.player.frame);
    }
    assert.deepEqual(shown,[0,1,2,3,4,5,6,7],hero);
    assert.equal(s.player.texture.id,skin?'skin':'base');
  }
}
console.log('Hero hurt 3A: ten eight-frame sources, stage-only art and all frames played in existing hit windows for base and skins');
