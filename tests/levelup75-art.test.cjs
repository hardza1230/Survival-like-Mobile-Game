const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const source = read('game.js').toString('utf8');
const manifest = JSON.parse(read('assets/incoming/levelup75/MANIFEST.json'));
const categories = ['normal', 'mutation', 'relic', 'unique'];
const keys = [...categories.map(category => 'lvl_tpl_' + category),
  'lvl_tpl_crest', ...categories.slice(1).map(category => 'lvl_tpl_fx_' + category)];
assert.deepEqual(manifest.map(row => row.key).sort(), keys.sort());

const first = source.indexOf('const STAGE_DECOR={');
const last = source.indexOf('\n};', first) + 3;
const ctx = {navigator:{}, localStorage:{getItem:()=>null}, console,
  location:{search:'', href:'http://x/'}, document:{}, Phaser:{}};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(source.slice(first,last) + '\n' +
  source.slice(source.indexOf('const ASSET_IMAGES ='),source.indexOf('class Boot extends')) +
  ';this.assets={ASSET_IMAGES,TEMPLE_UI,PLAY_UI_KEYS,artClass,lazyArt,bootKeep};', ctx);

for (const row of manifest) {
  const {key, file, bytes, sha256, width, height, frameWidth, frameHeight, columns, nineSlice} = row;
  const png = read('assets/incoming/levelup75/' + file);
  assert.equal(png.length, bytes);
  assert.equal(crypto.createHash('sha256').update(png).digest('hex'), sha256);
  assert.equal(png.readUInt32BE(16), width);
  assert.equal(png.readUInt32BE(20), height);
  assert.equal(png[25], 6, key + ' source must be PNG32');
  const url = 'assets/art/levelup/' + key + '.webp';
  const packed = read(url);
  assert.equal(packed.toString('ascii', 0, 4), 'RIFF');
  assert.equal(packed.toString('ascii', 8, 12), 'WEBP');
  assert.equal(ctx.assets.ASSET_IMAGES[key], url);
  assert.equal(JSON.stringify(ctx.assets.TEMPLE_UI[key]),
    JSON.stringify([frameWidth, frameHeight, columns, nineSlice || null]));
  assert(ctx.assets.PLAY_UI_KEYS.includes(key));
  assert.equal(ctx.assets.artClass(key), 'stage');
  assert(ctx.assets.lazyArt(key, url, 'momo'));
  assert(!ctx.assets.bootKeep(key));
}

const cardStart = source.indexOf('  drawReadableChoiceCard(');
const cardEnd = source.indexOf('\n  lvlSocket(', cardStart);
const card = source.slice(cardStart, cardEnd).split('\n  }\n')[0] + '\n  }';
const Save = {data:{settings:{}}};
const draw = vm.runInNewContext('({' + card + '}).drawReadableChoiceCard',
  {PASSIVES:{}, SKILL_CARD_COLOR:{}, SKILLDEFS:{}, Sfx:{}, Save});

function drawCard(options, category, loaded, relicPick = false, reduced = false) {
  const graphics = () => ({setAlpha(){},fillStyle(){},fillRoundedRect(){},lineStyle(){},strokeRoundedRect(){}});
  const out = {panels:[], crests:[], animations:[], plays:[], labels:[]};
  const calls = new Set();
  Save.data.settings.reducedMotion=reduced;
  const scene = {
    _relicPick:relicPick,
    _darken:()=>0x553144,
    tuHas:key => loaded.includes(key),
    tuFrames(key) {calls.add(key);return {};},
    tuPanel(key,_cell,x,y) {
      if (!loaded.includes(key)) return null;
      const panel={key,x,y,list:[],add(child){this.list.push(child);},setAlpha(){}};
      out.panels.push(panel);
      return panel;
    },
    tuImg(key,frame,x,y,w,h) {
      if (!loaded.includes(key)) return null;
      out.crests.push([frame,x,y,w,h]);
      return {key};
    },
    add:{
      graphics,
      circle:()=>({setStrokeStyle(){return this;}}),
      text(_x,_y,label,style){out.labels.push([label,style.color]);return {setOrigin(){return this;},setScale(){}};},
      sprite(x,y,key,frame){return {key,frame,x,y,setDisplaySize(){return this;},play(anim){out.plays.push(anim);}};}
    },
    anims:{exists:()=>false,create:anim=>out.animations.push(anim)},
    tweens:{add(){}},
    textures:{exists:()=>false},
    iconKey:()=>null,lvlSocket:()=>null,lvlPill(){},lvlBadge(){},drawComboHints(){},
  };
  const group={members:[],add(member){this.members.push(...(Array.isArray(member)?member:[member]));}};
  draw.call(scene,group,{type:'basic',name:'Test Card',...options},10,20,320,130,{starting:true});
  const templateKey='lvl_tpl_'+category, fxKey='lvl_tpl_fx_'+category;
  if (loaded.includes(templateKey)) {
    assert.equal(out.panels[0].key, templateKey);
    assert(group.members.includes(out.panels[0]));
    assert.equal(out.panels.some(panel=>panel.key==='lvl_card_accent'), category==='normal');
    if (loaded.includes('lvl_tpl_crest')) assert.deepEqual(out.crests,[[categories.indexOf(category),18,18,30,30]]);
    if (loaded.includes(fxKey)) {
      assert(calls.has(fxKey));
      assert(out.panels[0].list.some(child=>child.key===fxKey));
      assert.equal(out.animations[0].frameRate,8);
      assert.equal(out.animations[0].repeat,-1);
      assert.deepEqual(Array.from(out.animations[0].frames, frame=>frame.frame),['cell0','cell1','cell2','cell3','cell4','cell5']);
      assert.deepEqual(out.plays,reduced?[]:[fxKey]);
    }
    if (category==='normal') assert(out.labels.some(([label,color])=>label==='Test Card'&&color==='#342137'));
  } else if (loaded.includes('lvl_card_base')) {
    assert.equal(out.panels[0].key,'lvl_card_base');
    assert(out.panels.some(panel=>panel.key==='lvl_card_accent'));
    assert.equal(out.crests.length+out.animations.length,0);
  } else {
    assert.equal(out.panels.length,0);
    assert(group.members.some(member=>typeof member.fillRoundedRect==='function'));
  }
}

const all=[...keys,'lvl_card_base','lvl_card_accent'];
drawCard({},'normal',all);
drawCard({companionForm:true},'mutation',all);
drawCard({kind:'Relic'},'relic',all);
drawCard({},'relic',all,true);
drawCard({uniqueCard:true,mutation:true},'unique',all,false,true);
drawCard({type:'awk'},'unique',all);
drawCard({mutation:true},'mutation',['lvl_card_base','lvl_card_accent','lvl_tpl_crest']);
drawCard({mutation:true},'mutation',[]);
console.log('Order 75: eight source hashes and lazy assets, category render, crest/FX ownership, reduced motion and both fallback paths passed');
