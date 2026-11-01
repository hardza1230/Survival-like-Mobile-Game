// v8.0.85 Order 62 status effects: MANIFEST-verified sources, packed WebP, stage-lazy keys, enemy loops/icons (caps, Tempest aura/marker rules), hero loops/HUD icons, one-shots, fallbacks.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),kit='assets/incoming/status62/',man=JSON.parse(fs.readFileSync(kit+'MANIFEST.json','utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function method(n){const a=src.indexOf('  '+n+'('),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));assert(a>=0&&next,n);return src.slice(a,a+1+next.index);}
assert.equal(man.files.length,17);
const ac={window:{},navigator:{deviceMemory:8},localStorage:{getItem(){return null;}},STAGE_DECOR:{}};vm.createContext(ac);
vm.runInContext(src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.r={ASSET_FX,ASSET_SHEETS,artClass,bootKeep,ST62_ICON,ST62_LOOP};',ac);
const {ASSET_FX,ASSET_SHEETS,artClass,bootKeep,ST62_ICON,ST62_LOOP}=ac.r;
for(const a of man.files){const b=fs.readFileSync(kit+a.file);assert.equal(b.length,a.bytes,a.key);assert.equal(hash(b),a.sha256,a.key);
  const url='assets/art/status_fx/'+a.key+'.webp';assert.equal(fs.readFileSync(url).subarray(8,12).toString(),'WEBP',a.key);assert(src.includes("'"+url+"'"),'literal '+a.key);
  const reg=a.key==='st_icons'?ASSET_SHEETS[a.key]:ASSET_FX[a.key];assert.equal(reg&&reg.url,url,a.key);assert.equal(bootKeep(a.key),false);assert.equal(artClass(a.key,url),'stage',a.key+' stage-lazy');
  if(a.key!=='st_icons'){assert.equal(reg.frames,a.frameCount);assert.equal(reg.fw,96);assert.equal(!!reg.loop,a.loop,a.key+' loop');}}
const cells=man.files.find(f=>f.key==='st_icons').cells;for(const c of cells)assert.equal(ST62_ICON[c.subkey],c.row*6+c.col,c.subkey);assert.equal(Object.keys(ST62_ICON).length,19);
for(const k of Object.values(ST62_LOOP))assert(ASSET_FX[k]&&ASSET_FX[k].loop,k);
// Runtime: enemy and hero hooks with stubs
const Save={data:{settings:{vfx:2}}},ctx={Save,Map,Set,Math,TARO_SHOCK_LIFE:3};vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('const ST62_ICON='),src.indexOf('function artClass(k,u){')),ctx);
const S=vm.runInContext('class S{'+['clearStatusArt','statusList62','tickStatusArt','heroStatus62','clearHeroStatus62','tickHeroStatus62'].map(method).join('\n')+'}S',ctx);
let objs=[],fx=[];function obj(k,f){const o={active:true,key:k,frame:f,visible:true,destroy(){this.active=false},setText(t){this.text=t;return this},setVisible(v){this.visible=v;return this},setFrame(f){this.frame=f;return this},setPosition(x,y){this.x=x;this.y=y;return this},setDisplaySize(w,h){this.w=w;this.h=h;return this},play(k){this.anim=k;return this},width:10,height:14};const p=new Proxy(o,{get(t,k){return k in t?t[k]:()=>p}});objs.push(p);return p;}
let tex=true;const s=new S();Object.assign(s,{state:'play',elapsed:10,time:{now:5000},textures:{exists:()=>tex},camWorld:o=>o,camUI:o=>o,bpAnim:()=>tex,heroFx:(k,x,y,w,o)=>fx.push([k,o&&o.tint]),add:{image:(x,y,k,f)=>obj(k,f),sprite:(x,y,k,f)=>obj(k,f),text:()=>obj('text')}});
const E=(o)=>({active:true,x:100,y:100,depth:5,body:{halfWidth:20,halfHeight:20},...o});let enemies=[];s.enemies={children:{iterate:f=>enemies.forEach(f)}};
s.player={active:true,x:0,y:0,depth:10,body:{halfWidth:22,halfHeight:22}};s.statTxt={x:20,y:137,text:'🔮 ✦',width:30,height:14,visible:true};s.hudList=[{visible:true}];
// burn + sour: loop = sour (higher priority), icons sour/burn, apply pops tinted once
const a=E({_burnT:2,_sourT:2});enemies=[a];s.tickStatusArt();let p=s._statusArt.get(a);assert.equal(p.loopKey,'st_sour');assert.equal(p.loop.anim,'st_sour');assert.deepEqual([...p.icons.filter(o=>o.visible).map(o=>o.frame)],[ST62_ICON.sour,ST62_ICON.burn]);
assert.equal(fx.filter(f=>f[0]==='st_fx_apply').length,2);s.tickStatusArt();assert.equal(fx.filter(f=>f[0]==='st_fx_apply').length,2,'pop only when a status starts');
a._sourT=0;s.tickStatusArt();assert.equal(p.loopKey,'st_burn');a._burnT=0;s.tickStatusArt();assert.equal(s._statusArt.has(a),false,'expired: cleaned');
// stun only from long knock, chill at feet, brittle by time
const b=E({knock:.18});enemies=[b];s.tickStatusArt();assert(!s._statusArt.has(b),'short knockback is not stun');b.knock=.5;s.tickStatusArt();assert.equal(s._statusArt.get(b).loopKey,'st_stun');
const c=E({_chill:1,_chillAt:4000});enemies=[c];s.tickStatusArt();assert.equal(s._statusArt.get(c).loopKey,'st_chill');
// shock: Static Shock → st_shock loop + icon; Tempest at 5 stacks with aura → no st_shock loop; marker hides the shock icon
const d=E({_arcShockT:12});enemies=[d];s.tickStatusArt();p=s._statusArt.get(d);assert.equal(p.loopKey,'st_shock');assert(p.icons.some(o=>o.visible&&o.frame===ST62_ICON.shock));
s._taro={time:50};const t=E({_shock:5,_shockAt:49,_shockAura:{active:true},_shockFx:{active:true}});enemies=[t];s.tickStatusArt();p=s._statusArt.get(t);assert.equal(p.loopKey,null);assert(!p.icons.some(o=>o.visible&&o.frame===ST62_ICON.shock));
t._shockAura=null;s.tickStatusArt();assert.equal(p.loopKey,'st_shock','1–4 stacks: small current');
// caps: ≤24 loops, ≤40 tracked, vfx off clears
enemies=Array.from({length:60},()=>E({_burnT:3}));s.tickStatusArt();const live=[...s._statusArt.values()];assert.equal(live.length,40);assert.equal(live.filter(q=>q.loop).length,24);
Save.data.settings.vfx=0;s.tickStatusArt();assert.equal(s._statusArt.size,0);assert(objs.filter(o=>o.key&&o.key.startsWith('st_')).every(o=>!o.active),'all status art destroyed');Save.data.settings.vfx=2;
// no art loaded: no loops/icons, old Tremor/Frost Burn row still works
tex=false;enemies=[E({_burnT:2,_trem:3,_tremT:4900})];s.tickStatusArt();p=[...s._statusArt.values()][0];assert.equal(p.loop,null);assert.equal(p.icons.length,0);tex=true;s.clearStatusArt();
// hero: poison + slow → 2 loops by priority; HUD icons after relic text with numbers; cleanse when they end; barrier break
enemies=[];s._huntCursed=true;s._huntStk=3;s.moveSlowT=1;s.player.wardGuardT=2;s._shield=2;s.tickStatusArt();let h=s._hst62;
assert.deepEqual([...h.keys],['st_p_poison','st_p_slow']);assert(s._hudStatusIcons);const vis=h.icons.filter(o=>o.visible);assert.deepEqual([...vis.map(o=>o.frame)],[ST62_ICON.p_poison,ST62_ICON.p_slow,ST62_ICON.p_guard,ST62_ICON.p_shell]);assert(vis[0].x>s.statTxt.x+s.statTxt.width);assert.equal(h.nums[0].text,'3');
s._huntCursed=false;s.moveSlowT=0;fx=[];s.tickStatusArt();assert.deepEqual([...h.keys.filter(Boolean)],['st_p_guard']);assert(fx.some(f=>f[0]==='st_fx_cleanse'));
s._forgeState={barrier:30,barrierUntil:20};s.tickStatusArt();assert(h.icons.some(o=>o.visible&&o.frame===ST62_ICON.p_barrier));s._forgeState.barrier=0;fx=[];s.tickStatusArt();assert(fx.some(f=>f[0]==='st_fx_barrier_break'));
// restarted scene: stale destroyed HUD objects are rebuilt, not reused
h.icons.forEach(o=>o.destroy());s.tickStatusArt();assert.notEqual(s._hst62,h);
// statTxt drops shell/barrier text only when icons are shown
assert(/this\.statTxt\.setText\(\(this\._hudStatusIcons\?\[rel\]:\[rel,sh,fb>0\?'Barrier '\+Math\.ceil\(fb\):''\]\)/.test(src));
assert(/this\._heroBleed=o;this\._heroBleedAt=this\.elapsed\|\|0;/.test(src)&&/this\._heroBleed=w;this\._heroBleedAt=this\.elapsed\|\|0;/.test(src));
console.log('Status 62: 17 MANIFEST-verified sources, stage-lazy WebP, enemy loops/icons/priority/caps, Tempest aura+marker rules, hero loops, HUD icon row, cleanse/barrier-break, no-art fallback passed');
