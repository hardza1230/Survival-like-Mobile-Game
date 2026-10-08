const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'(');assert(at>=0,n);const tail=src.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return src.slice(at,at+1+next.index);}
const start=src.indexOf('const ASSET_FX = {'),end=src.indexOf('\n};',start)+3;
const defs=vm.runInNewContext(src.slice(start,end)+';ASSET_FX');
for(const [name,w,h] of [['berry_blast',384,256],['shotgun_muzzle',192,128],['glacier_bloom',384,384],['glacier_shatter',192,192]]){
 const d=defs['vfx_'+name],png=fs.readFileSync('assets/incoming/vfx_path_uniques/'+name+'_sheet.png');
 assert.equal(d.frames,8);assert.equal(d.fw,w);assert.equal(d.fh,h);assert(fs.existsSync(d.url));
 assert.equal(png.readUInt32BE(16),w*8);assert.equal(png.readUInt32BE(20),h);
}
assert(fs.existsSync('assets/vfx/frost_lance_trail.webp'));
const ctx={ASSET_FX:defs,Math,COLORS:{ice:1},Phaser:{BlendModes:{NORMAL:0,ADD:1}},Sfx:{boom(){},shotgun(){},dash(){},magnet(){}}};
const names=['releaseBerryBlast','releaseGlacierBloom','releaseFrostLance','tickIceTrails','shotgunKick','mintBurstFx','spawnFxAnim','trackArtVfx','artDelay','clearArtVfx'];
const Scene=vm.runInNewContext('class Scene{'+names.map(method).join('\n')+'\n}Scene',ctx);
function object(x=0,y=0,key){const ev=new Map(),o={active:true,x,y,key,body:{velocity:{x:0,y:0},reset(){}},once(k,f){ev.set(k,f);return this;},destroy(){this.active=false;ev.get('destroy')?.();},play(k){this.animation=k;return this;}};for(const k of ['Depth','BlendMode','Origin','Rotation','Scale','Alpha','DisplaySize','StrokeStyle','Tint','Velocity'])o['set'+k]=function(...v){this[k]=v;return this;};for(const k of ['lineStyle','lineBetween','fillStyle','fillCircle','slice','fillPath'])o[k]=function(){return this;};return o;}
function scene(painted=true){const s=new Scene(),art=[],hits=[],timers=[],tweens=[],anims=new Set();
 Object.assign(s,{state:'play',player:{...object(),dmgMul:1},uniqueLevel:1,basicAttack:{path:'shotgun',lv:{}},time:{now:0,delayedCall(ms,fn){const t={ms,fn,remove(){this.removed=true;}};timers.push(t);return t;}},textures:{exists:k=>painted||!k.startsWith('vfx_')},anims:{exists:k=>anims.has(k),create(d){anims.add(d.key);},generateFrameNumbers(k,o){return Array.from({length:o.end+1},(_,i)=>({key:k,frame:i}));}},add:{sprite(x,y,k){const o=object(x,y,k);art.push(o);return o;},image(x,y,k){const o=object(x,y,k);art.push(o);return o;},graphics(){const o=object();art.push(o);return o;},circle(x,y){const o=object(x,y);art.push(o);return o;}},tweens:{add(t){tweens.push(t);return t;},killTweensOf(o){for(const t of tweens)if(t.targets===o)t.cancelled=true;}},camWorld:o=>o,fxOk:()=>true,uniqueInfo:()=>({}),uniquePower:()=>1,uniqueCooldown:()=>10,flashBtn(){},poseAttack(){},fireRecipes(){},blastMods:()=>({cone:Math.PI*2/3,pellets:11,hop:80,iframe:.35,double:true}),mintLv:()=>s.basicAttack.lv,mintUniqueStart:()=>({ul:1,unit:1}),bloomRadius:()=>200,lanceLen:()=>350,damage(e,n){hits.push([e.id,n]);},dist:(x,y,a,b)=>Math.hypot(x-a,y-b),mintChill(){},applyImpale(){},glacierFrostHit(){},burst(){},vfxHitRing(){},screenShake(){},showBanner(){},hitStop(){},enemies:{children:{iterate(fn){s.foes.forEach(fn);}}},foes:[],art,hits,timers,allTweens:tweens});return s;}
function foe(id,x,extra={}){return {...object(x,0),id,hp:1000,maxhp:1000,_glacierLifeToken:1,...extra};}
// Actual Berry Blast combat is identical with art present or fallback, including delayed Double Tap.
{const a=scene(),b=scene(false);for(const s of [a,b]){s.foes=[foe('near',50),foe('far',200),foe('boss',100,{isBoss:true}),foe('outside',400)];s.releaseBerryBlast(0,1);assert.equal(s.player.iframe,.35);assert.equal(s.allTweens.find(t=>t.targets===s.player).x,-80);}
 assert.equal(JSON.stringify(a.hits),JSON.stringify(b.hits));assert.equal(a.hits[0][1],190);assert.equal(a.hits[1][1],57);assert.equal(a.hits[2][1],304);
 const effect=a.art.find(o=>o.key==='vfx_berry_blast');assert(effect);assert.equal(effect.BlendMode[0],0);assert.equal(effect.Origin[0],0);assert.equal(effect.Rotation[0],0);
 for(const s of [a,b])s.timers.find(t=>t.ms===350).fn();assert.equal(JSON.stringify(a.hits),JSON.stringify(b.hits));assert.equal(a.art.filter(o=>o.key==='vfx_berry_blast').length,2);
 a.clearArtVfx();assert(a.art.filter(o=>o.key).every(o=>!o.active));assert.equal(a._artTimers.size,0);const n=a.hits.length;a.timers.forEach(t=>t.fn());assert.equal(a.hits.length,n);}
// Glacier freeze and expiry share exact damage; lifetime guards still reject recycled targets.
{const a=scene(),b=scene(false);for(const s of [a,b]){s.basicAttack.path='glacier';s.foes=[foe('normal',50),foe('boss',100,{isBoss:true}),foe('reused',80)];s.releaseGlacierBloom(1);assert.equal(s.foes[0].frozen,2);s.foes[2]._glacierLifeToken=2;s.timers.find(t=>t.ms===1850).fn();}
 assert.equal(JSON.stringify(a.hits),JSON.stringify(b.hits));assert(a.art.some(o=>o.key==='vfx_glacier_bloom'));assert(a.art.some(o=>o.key==='vfx_glacier_shatter'));assert(!a.hits.slice(4).some(h=>h[0]==='reused'));
 const s=scene();s.basicAttack.path='glacier';for(let i=0;i<20;i++)s.mintBurstFx(0,0,90);assert.equal(s.art.length,3);s.time.now=200;s.mintBurstFx(0,0,90);assert.equal(s.art.length,4);}
// Three-second trail and 0.4s ticks retain damage and geometry; cleanup prevents future damage.
{const a=scene(),b=scene(false);for(const s of [a,b]){s.basicAttack.path='pierce';s.foes=[foe('normal',100),foe('boss',200,{isBoss:true}),foe('outside',400),foe('offaxis',50,{y:80})];s.releaseFrostLance(0,1);assert.equal(s._iceTrails[0].t,3);assert.equal(s._iceTrails[0].L,350);assert.equal(s._iceTrails[0].dmg,6.6);s.tickIceTrails(.1);const n=s.hits.length;s.tickIceTrails(.2);assert.equal(s.hits.length,n);s.tickIceTrails(.2);}
 assert.equal(JSON.stringify(a.hits),JSON.stringify(b.hits));const tr=a._iceTrails[0].g;assert.equal(tr.key,'vfx_frost_lance_trail');assert.equal(tr.BlendMode[0],0);assert.equal(tr.DisplaySize[0],350);
 a.clearArtVfx();assert(!tr.active);assert.equal(a._iceTrails.length,0);const n=a.hits.length;a.tickIceTrails(1);assert.equal(a.hits.length,n);
 b.tickIceTrails(3);assert.equal(b._iceTrails.length,0);}
{const s=scene();s.shotgunKick(Math.PI/2);const o=s.art[0];assert.equal(o.key,'vfx_shotgun_muzzle');assert.equal(o.BlendMode[0],0);assert.equal(o.Rotation[0],Math.PI/2);s.clearArtVfx();assert(!o.active);scene(false).shotgunKick(0);}
{const s=scene();s.foes=[foe('normal',50)];s.releaseBerryBlast(0,1);const n=s.hits.length;s.clearArtVfx();assert(s.timers[0].removed);s.timers[0].fn();assert.equal(s.hits.length,n);}
console.log('Build VFX: actual attacks preserve damage/geometry/timing, NORMAL blend, fallbacks, shatter budgets, lifetime guards, Double Tap and transition/trail cleanup passed');
