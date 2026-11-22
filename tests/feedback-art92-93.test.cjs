const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createHash } = require('node:crypto');

const src = fs.readFileSync('game.js', 'utf8');
const method = name => {
  const start = src.indexOf('\n  '+name+'(');
  assert(start >= 0, name);
  const next = /\n  [\w$]+\(/g;
  next.lastIndex = start+4;
  return src.slice(start+3,next.exec(src)?.index);
};

for (const [batch, count] of [['fx92',9],['card_back93',3],['feedback_redesign',3]]) {
  const dir = 'assets/incoming/'+batch;
  const rows = JSON.parse(fs.readFileSync(dir+'/MANIFEST.json'));
  assert.equal(rows.length,count);
  for (const row of rows) {
    const data = fs.readFileSync(dir+'/'+row.file);
    assert.equal(data.length,row.bytes);
    assert.equal(createHash('sha256').update(data).digest('hex'),row.sha256);
    const path = 'assets/art/'+batch+'/'+row.key+'.webp';
    assert(src.includes("'"+path+"'"),row.key);
    assert.equal(fs.readFileSync(path).subarray(8,12).toString(),'WEBP');
  }
}

const ctx = vm.createContext({ Sfx:{} });
vm.runInContext('this.Scene=class { '+['shotgunKick','hungerCrackMouth'].map(method).join('\n')+' }',ctx);
const scene = new ctx.Scene();
const calls = [];
Object.assign(scene,{
  player:{x:0,y:0},
  realTex:()=>true,
  heroFx:(key,x,y,width,options)=>{calls.push([key,x,y,width,options.rot]);return true;},
  screenShake(){},
});
scene.shotgunKick(-1,false,0);
scene.shotgunKick(-1,false,0,true);
scene.shotgunKick(1,true,0);
assert.deepEqual(calls,[
  ['sg_new_primary',20,0,122,0],
  ['sg92_double_barrel',20,0,150,0],
  ['sg92_muzzle_echo',20,0,90,0]
]);
scene.realTex=()=>false;
scene.textures={exists:k=>k==='vfx_shotgun_muzzle'};
scene.trackArtVfx=()=>{};
scene.spawnFxAnim=(key)=>calls.push(key);
scene.shotgunKick(0,true,0);
assert.equal(calls.at(-1),'vfx_shotgun_muzzle');

let frame,created=0;
const sprite={active:true,setFrame(i){frame=i;return this;},setDisplaySize(){return this;},setAlpha(){return this;}};
const hole={x:5,y:9,final:true,open:false};
scene.feedbackSprite=()=>null;
assert.equal(scene.hungerCrackMouth(hole,true,0),false);
scene.feedbackSprite=()=>{created++;return sprite;};
assert.equal(scene.hungerCrackMouth(hole,true,0),true);
assert.equal(frame,0);
hole.open=true;
scene.hungerCrackMouth(hole,false,0);
assert.equal(frame,2);
assert.equal(created,1);
assert(method('clearHungerCrack').includes('c.holes.map(h=>h._mouth)'));
assert(method('missionDealShow').includes('flipFlash()'));
assert(method('killBullet').includes('b._shotgunTrail?.destroy?.()'));
console.log('Orders 92/93 and feedback redesign: sources, packed art, shotgun variants, fallbacks and crack state passed');
