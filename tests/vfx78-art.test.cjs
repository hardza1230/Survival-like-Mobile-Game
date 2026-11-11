const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const source = read('game.js').toString('utf8');
const manifest = JSON.parse(read('assets/incoming/vfx78/MANIFEST.json'));
const sizes = {breach_open:[512,8],splinter_pick:[128,6],breach_chest:[256,8],
  stone_fuse:[256,8],statue_paint:[192,6],gates_shut:[256,8],dish_served:[384,8],
  golem_bake:[384,8],root_cut:[256,6],siege_break:[512,8],trial_curse:[384,8],
  trial_take:[256,6],trial_risk:[256,6],ink_move:[256,8],codex_up:[256,8]};
const menu = {ink_move:'craft',codex_up:'bestiary'};
const methods = {
  breach_open:['hmOpen','hdSetup'],splinter_pick:['hmTick'],breach_chest:['hmChest'],
  stone_fuse:['hmSplinters'],statue_paint:['fpTick'],gates_shut:['hhDown'],
  dish_served:['gpServe'],golem_bake:['ggBake'],root_cut:['crTick'],siege_break:['hsBurst'],
  trial_curse:['ultStartFight'],trial_take:['ultTick'],trial_risk:['ultTick'],
  ink_move:['forgeMove'],codex_up:['codexUpgrade']
};
function method(name) {
  const start = source.indexOf('\n  '+name+'(');
  assert(start >= 0, name);
  const end = source.slice(start+1).search(/\n  [\w$]+\(/);
  return source.slice(start+1,start+1+end).replace(/\s*\/\*[\s\S]*?\*\/\s*$/,'').trimEnd();
}
assert.deepEqual(manifest.map(r=>r.key).sort(),Object.keys(sizes).map(n=>'vfx78_'+n).sort());

const start = source.indexOf('const STAGE_DECOR={');
const end = source.indexOf('\n};',start)+3;
const context = {navigator:{},localStorage:{getItem:()=>null},console,location:{search:'',href:'http://x/'},document:{},Phaser:{},TAU:2*Math.PI};
context.window=context;
vm.createContext(context);
vm.runInContext(source.slice(start,end)+'\n'+source.slice(source.indexOf('const ASSET_IMAGES ='),source.indexOf('class Boot extends'))+
  ';this.R={ASSET_FX,ASSET_SHEETS,TEMPLE_UI,menuGroupRe,artClass,lazyArt,bootKeep};',context);
const R=context.R;

for (const row of manifest) {
  const key=row.key,name=key.slice(6),[size,frames]=sizes[name],packedSize=Math.min(size,256),screen=menu[name];
  assert.equal(row.file,key+'.png');
  const png=read('assets/incoming/vfx78/'+row.file);
  assert.equal(png.length,row.bytes);
  assert.equal(crypto.createHash('sha256').update(png).digest('hex'),row.sha256);
  assert.equal(png.readUInt32BE(16),size*frames);
  assert.equal(png.readUInt32BE(20),size);
  assert.equal(png[25],6);
  assert.equal(row.background,'black');
  assert.equal(row.loop,name==='statue_paint');
  const url='assets/art/'+(screen?'menu74':'vfx78')+'/'+key+'.webp';
  const webp=read(url);
  assert.equal(webp.toString('ascii',0,4),'RIFF');
  assert.equal(webp.toString('ascii',8,12),'WEBP');
  assert.equal(R.artClass(key),screen?'menu':'stage');
  assert(R.lazyArt(key,url,'momo')&&!R.bootKeep(key),key+' must stay out of boot');
  if (screen) {
    assert.equal(R.ASSET_SHEETS[key].url,url);
    assert.equal(R.ASSET_SHEETS[key].frame,packedSize);
    assert.equal(JSON.stringify(R.TEMPLE_UI[key]),JSON.stringify([packedSize,packedSize,frames,null]));
    for (const page of ['craft','bestiary','hub']) assert.equal(R.menuGroupRe(page).test(url),page===screen);
  } else {
    const fx=R.ASSET_FX[key];
    assert.equal(fx.url,url);
    assert.deepEqual([fx.fw,fx.fh,fx.frames,fx.rate,fx.anchor,!!fx.loop],
      [packedSize,packedSize,frames,row.loop?10:16,'center',row.loop]);
  }
  for (const m of methods[name]) assert(method(m).includes("'"+key+"'"),key+' hook missing in '+m);
}

const run=vm.runInContext('({'+['missionArtKeys','fpTick','sigClear'].map(method).join(',')+'})',context);
const stageCases={0:['gates_shut'],1:['breach_open','splinter_pick','breach_chest','stone_fuse'],
  2:['dish_served'],3:['statue_paint'],4:['golem_bake'],7:['root_cut'],13:['trial_curse','trial_take','trial_risk']};
for (const [stage,names] of Object.entries(stageCases)) {
  const got=run.missionArtKeys.call({},+stage).filter(k=>k.startsWith('vfx78_'));
  assert.equal(JSON.stringify(got),JSON.stringify(names.map(n=>'vfx78_'+n)));
}
assert.equal(run.missionArtKeys.call({},5).some(k=>k.startsWith('vfx78_')),false);
const delve=run.missionArtKeys.call({recipeMode:true},5);
for (const name of [...stageCases[1],...stageCases[13],'siege_break']) assert(delve.includes('vfx78_'+name));

let near=true, created=0, woke=0;
const statue={x:20,y:30,state:'frozen',fill:0,ring:{setFillStyle(){}},t:{setAlpha(){},clearTint(){}}};
const state={st:[statue],objs:[]};
const scene={
  _sig:state,player:{x:0,y:0},sigNear:()=>near,fpWake(){woke++;statue.state='awake';},
  textures:{exists:key=>key==='vfx78_statue_paint'},
  artSpr(key,x,y,px) {
    assert.deepEqual([key,x,y,px],['vfx78_statue_paint',20,30,100]);
    created++;
    const sprite={active:true,visible:true,setVisible(v){this.visible=v;},destroy(){this.active=false;}};
    state.objs.push(sprite);
    return sprite;
  }
};
run.fpTick.call(scene,.2,{},state);
const sprite=statue.paintFx;
assert(sprite.active&&sprite.visible);
near=false;
run.fpTick.call(scene,.2,{},state);
assert(sprite.active&&!sprite.visible);
near=true;
run.fpTick.call(scene,.2,{},state);
assert(sprite.visible&&created===1);
run.fpTick.call(scene,2,{},state);
assert(!sprite.active&&statue.paintFx===null&&woke===1);
statue.state='frozen';
statue.fill=0;
run.fpTick.call(scene,.2,{},state);
const second=statue.paintFx;
run.sigClear.call(scene);
assert(!second.active&&scene._sig===null);

const noTexture={...scene,textures:{exists:()=>false},_sig:state};
statue.state='frozen';
statue.fill=0;
statue.paintFx=null;
run.fpTick.call(noTexture,.2,{},state);
assert(statue.fill>0&&statue.paintFx===null&&created===2);
console.log('Order 78: fifteen sources, packed assets, stage/menu routes, all hooks and paint-loop lifecycle passed');
