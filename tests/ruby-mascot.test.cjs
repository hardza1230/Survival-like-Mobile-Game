// Ruby art loading and dialogue presentation contracts; no combat simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
const start=src.indexOf('const ASSET_IMAGES ='),end=src.indexOf('class Boot extends');
const ctx={window:{},navigator:{deviceMemory:8},localStorage:{getItem(){return null;}},STAGE_DECOR:{}};
vm.createContext(ctx);vm.runInContext(src.slice(start,end)+';this.R={ASSET_IMAGES,RUBY_STAGE_KEYS,RUBY_MENU_KEYS,artClass,stageCritical};',ctx);
const {R}=ctx;
assert.equal(R.RUBY_STAGE_KEYS.length,8);assert.equal(R.RUBY_MENU_KEYS.length,6);
for(const key of R.RUBY_STAGE_KEYS){assert.equal(R.artClass(key),'stage');assert(fs.statSync(R.ASSET_IMAGES[key]).size>0);}
for(const key of R.RUBY_MENU_KEYS){assert.equal(R.artClass(key),'menu');assert.equal(R.stageCritical(key,R.ASSET_IMAGES[key],'momo',false),false);assert(fs.statSync(R.ASSET_IMAGES[key]).size>0);}
function method(name){const at=src.indexOf('\n  '+name+'(');assert(at>=0);const tail=src.slice(at+3),next=/\n  [a-zA-Z_$][\w$]*\(/.exec(tail);return src.slice(at,at+3+next.index);}
const Say=vm.runInNewContext('class UI{'+method('rubySay')+'}UI');
const ui=new Say();Object.assign(ui,{add:{},time:{},rubyOn:()=>true,rubyNext(){this.calls=(this.calls||0)+1;},rubyHide(){this._ruby=null;}});
ui.rubySay('A boss!',4000,{face:'alert'});assert.equal(ui._rubyQ[0].face,'alert');
ui.rubySay('A boss!',4000,{face:'alert'});assert.equal(ui._rubyQ.length,1,'duplicate tip stays deduplicated');
ui._ruby={text:'Active tip'};ui.rubySay('A memory',5000,{face:'sad'});assert.equal(ui._rubyQ[1].face,'sad','queued messages preserve their expression');
ui.rubySay('Replacement',2000,{replace:true,face:'happy'});assert.equal(ui._rubyQ.length,1);assert.equal(ui._rubyQ[0].face,'happy');
let selected;const Avatar=vm.runInNewContext('class UI{'+method('rubyAvatar')+'}UI'),avatar=new Avatar();
Object.assign(avatar,{textures:{exists:key=>key==='mascot_ruby'},add:{image(x,y,key){selected=key;return{width:128,height:128,setOrigin(){return this;},setScale(){return this;}};}}});
avatar.rubyAvatar(0,0,60,'alert');assert.equal(selected,'mascot_ruby','missing expression falls back to the neutral portrait');
avatar.textures.exists=()=>true;avatar.rubyAvatar(0,0,60,'happy');assert.equal(selected,'mascot_ruby_happy');
console.log('Ruby: 14 packed assets, stage/menu lazy split, expression queue, deduplication and avatar fallback passed');
