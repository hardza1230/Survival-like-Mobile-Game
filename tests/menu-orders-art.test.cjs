// Orders50–54: production dimensions/hash contract, page isolation and animation lifetime.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),crypto=require('crypto'),{EventEmitter}=require('node:events');
const src=fs.readFileSync('game.js','utf8'),rows=JSON.parse(fs.readFileSync('assets/art/menu_orders/MANIFEST.json','utf8'));
const defs=JSON.parse(src.match(/const MENU_ORDER_ART=(\{[^\n]+\});/)[1]);
assert.equal(rows.length,44);assert.equal(rows.reduce((n,r)=>n+r.frames,0),143);
const ctx={};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const MENU_GROUPS='),src.indexOf('// v6.45: ของ tier1'))+';this.group=menuGroupRe;',ctx);
const page={merge_forge:'merge',login_daily:'daily',awards:'achievements',codex_books:'skills',depths_rank:'dig'};
for(const r of rows){
  const url='assets/art/menu_orders/'+r.key+'.webp',bytes=fs.readFileSync(url);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256,r.key+' runtime bytes');
  assert(src.includes(r.key+":'"+url+"'"),'literal path required by web build: '+r.key);
  assert.deepEqual(defs[r.key].slice(0,4),[r.frameWidth,r.frameHeight,r.columns,r.nineSlice]);assert.equal(defs[r.key][4],r.frames);
  assert(ctx.group(page[r.source]).test(url),r.key+' loads on its page');
  for(const other of Object.values(page))if(other!==page[r.source])assert(!ctx.group(other).test(url),r.key+' not decoded by unrelated '+other);
  const source=JSON.parse(fs.readFileSync('assets/incoming/'+r.source+'/MANIFEST.json','utf8')).find(x=>x.key===r.key);
  assert.equal(r.frameWidth*2,source.frameWidth);assert.equal(r.frameHeight*2,source.frameHeight);assert.equal(r.frames,source.frameCount);
  const refs=(src.match(new RegExp("'"+r.key+"'",'g'))||[]).length;assert(refs>=1,r.key+' has a consumer beyond metadata/registry');
}
for(const n of ['UI_ART_RE','MENU_ONLY_RE','LAZY_MENU_ART_RE']){
  const line=src.slice(src.indexOf('const '+n+'='),src.indexOf('\n',src.indexOf('const '+n+'=')));
  const re=vm.runInNewContext(line+';'+n);for(const r of rows)assert(re.test('assets/art/menu_orders/'+r.key+'.webp'),n+' '+r.key);
}
const timers=[],Save={data:{settings:{}}};
const Helpers=vm.runInNewContext('(class{'+src.slice(src.indexOf('  menuArtPanel('),src.indexOf('  templeArtFrames(){'))+'})',{MENU_ORDER_ART:defs,Save,JR_INK:{},Phaser:{BlendModes:{ADD:1}},gearGrade:()=> 'epic'});
class Img extends EventEmitter{constructor(){super();this.active=true;this.frames=[];}setFrame(f){this.frames.push(f);return this;}setTint(t){this.tint=t;return this;}setBlendMode(v){this.blend=v;return this;}destroy(){this.active=false;this.emit('destroy');}}
const h=new Helpers();h.menu={children:[],add(o){this.children.push(o);}};h.tuImg=()=>new Img();h.hubMotionAllowed=()=>true;
h.time={addEvent(o){const t={...o,remove(){this.removed=true;}};timers.push(t);return t;},delayedCall(ms,fn){const t={ms,callback:fn,remove(){this.removed=true;}};timers.push(t);return t;}};
const once=h.menuArtFx('vfx_merge_fuse',20,30,200);const t=timers.at(-1);for(let i=0;i<8;i++)t.callback();assert(!once.active&&t.removed);assert.deepEqual(once.frames,['cell1','cell2','cell3','cell4','cell5','cell6','cell7']);
const loop=h.menuArtFx('dig_miner',0,0,22,{loop:true}),lt=timers.at(-1);for(let i=0;i<7;i++)lt.callback();assert(loop.active);assert.equal(loop.frames.at(-1),'cell3');loop.destroy();assert(lt.removed,'page destruction cancels repeating timer');
h.hubMotionAllowed=()=>false;const reduced=h.menuArtFx('login_glow',0,0,96,{loop:true});assert.equal(reduced.frames.at(-1),'cell0');const count=timers.length;reduced.destroy();assert.equal(timers.length,count,'no reduced-motion loop timer');
const still=h.menuArtFx('vfx_aw_claim',0,0,110),st=timers.at(-1);assert.equal(still.frames.at(-1),'cell3');st.callback();assert(!still.active&&st.removed);
h.tuImg=()=>null;assert.equal(h.menuArtFx('dig_miner',0,0,22),null,'missing art retains caller fallback');
console.log('Menu orders50–54:44 source-verified runtime sheets,143 frames, half-size cells/slices, isolated lazy groups, frame progression, repeat cleanup and reduced-motion fallback passed');
