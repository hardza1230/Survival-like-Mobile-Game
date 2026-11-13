const P=require('./_packed.cjs');   // v8.1.139 recompressed assets ledger
// Presentation adapters and ownership lifecycle only; no simulated combat or balance changes.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8'),hash=b=>P.h(b);
const manifest=JSON.parse(fs.readFileSync('assets/art/yuzu_forms63/MANIFEST.json','utf8'));assert.equal(manifest.assets.length,8);assert.equal(manifest.decodedBytes,3682304);
const ctx={navigator:{},localStorage:{getItem:()=>null},console,location:{search:'',href:'http://x/'},document:{},Phaser:{}};ctx.window=ctx;vm.createContext(ctx);
const decor=src.slice(src.indexOf('const STAGE_DECOR={'),src.indexOf('\n};',src.indexOf('const STAGE_DECOR={'))+3);
vm.runInContext(decor+'\n'+src.slice(src.indexOf('const ASSET_IMAGES ='),src.indexOf('class Boot extends'))+';this.R={ASSET_SHEETS,artClass,artHero,lazyArt};',ctx);
for(const r of manifest.assets){
 const file='assets/art/yuzu_forms63/'+r.file,b=fs.readFileSync(file);assert.equal(hash(b),r.sha256);assert.equal(P.n(b),r.bytes);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
 const donor=fs.readFileSync(r.source);assert.equal(hash(donor),r.sourceSha256);assert.equal(ctx.R.ASSET_SHEETS[r.key].url,file);assert.equal(ctx.R.ASSET_SHEETS[r.key].frame,r.frame);
 assert.equal(ctx.R.artHero(r.key),'yuzu');assert.equal(ctx.R.artClass(r.key),'hero');for(const hero of ['yuzu','momo','mint'])assert(ctx.R.lazyArt(r.key,file,hero),'all forms deferred until battle, even selected Yuzu');assert(src.includes("url:'"+file+"'"));
}
const runAt=src.indexOf('  runArtKeys(){'),runEnd=src.indexOf('\n  //',runAt+1);
const Run=vm.runInContext('(class{runArtEndgame(){return false;}'+src.slice(runAt,runEnd)+'})',ctx);
for(const hero of ['yuzu','mint']){const s=new Run();s.character=hero;const keys=s.runArtKeys();for(const r of manifest.assets)assert.equal(keys.includes(r.key),hero==='yuzu','battle loads forms only for selected Yuzu');}
const Save={data:{settings:{vfx:1}}},c={Save,Math,Map,Set,WeakMap,WeakSet};vm.createContext(c);const C=vm.runInContext('class C{'+src.slice(src.indexOf('  // Citrus Companions:'),src.indexOf('  tickFR(dt){'))+'}C',c);
function node(key=''){const n={active:true,x:20,y:30,width:60,texture:{key},frame:0};for(const k of ['setDisplaySize','setOrigin','setRotation','setDepth','setAlpha','setTint','clearTint','setText','clear','lineStyle','fillStyle','fillEllipse'])n[k]=function(...a){this[k+'Args']=a;return this;};n.setTexture=function(key,f){this.texture.key=key;this.frame=f;return this;};n.setFrame=function(f){this.frame=f;return this;};n.setPosition=function(x,y){this.x=x;this.y=y;return this;};n.destroy=function(){this.active=false;};return n;}
function scene(){const s=new C(),m={kind:'lime',form:2,spr:node('yz_lime'),label:node(),bar:node(),growth:0};Object.assign(s,{state:'play',character:'yuzu',player:{active:true},basicAttack:{lv:{companion_form:1}},_artEpoch:1,_yuzuCrew:[m],textures:{exists:()=>true},add:{sprite:(x,y,k,f)=>{const n=node(k);n.x=x;n.y=y;n.frame=f;return n;},image:()=>node('yz_form_badge')},camWorld:o=>o,yuzuTickSkillFx(){},hubMotionAllowed:()=>true});return{s,m};}
{
 const{s,m}=scene(),pose={key:'yz_lime',frame:4,state:'windup'};
 const expected=[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];for(let frame=0;frame<16;frame++)assert.equal(s.yuzuFormFrame(m,pose,{key:'yz_48_lime',frame}),expected[frame]);
 m.action={t:.1,wind:.4,end:.8};assert.equal(s.yuzuFormFrame(m,{key:'yz_47_lime',frame:0,state:'windup'},{key:'yz_47_lime'}),4);
 m.action.t=.3;assert.equal(s.yuzuFormFrame(m,{key:'yz_47_lime',frame:1,state:'windup'},{key:'yz_47_lime'}),5);
 m.action.t=.5;assert.equal(s.yuzuFormFrame(m,{key:'yz_47_lime',frame:2,state:'release'},{key:'yz_47_lime'}),6);
 m.action.t=.75;assert.equal(s.yuzuFormFrame(m,{key:'yz_47_lime',frame:7,state:'release'},{key:'yz_47_lime'}),7);
 m.kind='bloodorange';assert.equal(s.yuzuFormFrame(m,{key:'yz_47_bloodorange',frame:0,state:'release'},{key:'yz_47_bloodorange'}),7,'flavor release remains attack, not idle');
}
{
 const{s,m}=scene();s.yuzuVisualPose=()=>({key:'yz_lime',frame:4,state:'windup'});s.yuzuAnimate=()=>({sx:1,sy:1,bob:0,rot:0});s.yuzuAnimationFrame=()=>({key:'yz_48_lime',frame:10,paintScale:1.1});s.yuzuBuff=()=>null;
 s.yuzuVisual(m,0);assert.equal(m.spr.texture.key,'yz_lime_f2');assert.equal(m.spr.frame,5);assert.equal(m.spr.setDisplaySizeArgs[0],53*1.12,'new sheets do not inherit old16frame crop compensation');const badge=m.formBadge;
 s.yuzuVisual(m,0);assert.equal(m.formBadge,badge,'no per-frame badge allocations');assert.equal(badge.frame,1);
 s.textures.exists=k=>!k.endsWith('_f2')&&k!=='yz_form_badge';s.yuzuVisual(m,0);assert.equal(m.spr.texture.key,'yz_48_lime');assert.equal(m.spr.frame,10);assert(!badge.active);assert.equal(m.formBadge,null);
}
{
 const{s,m}=scene();assert(s.yuzuEvolutionArt(m,0xb7ff7c));const q=s._yzFx[0],seen=new Set([q.spr.frame]);for(let i=0;i<59;i++){s.yuzuTickFx(.01);seen.add(q.spr.frame);}assert.deepEqual([...seen],[0,1,2,3,4,5,6,7]);assert.equal(s._yzFx.length,1);s.yuzuTickFx(.02);assert.equal(s._yzFx.length,0);assert(!q.spr.active,'one shot expires, no looping');
}
for(const invalid of ['owner','player','basic','epoch','character']){
 const{s,m}=scene();s.yuzuEvolutionArt(m,0xffffff);const q=s._yzFx[0];if(invalid==='owner')s._yuzuCrew=[];if(invalid==='player')s.player={active:true};if(invalid==='basic')s.basicAttack={};if(invalid==='epoch')s._artEpoch++;if(invalid==='character')s.character='mint';s.yuzuTickFx(.01);assert(!q.spr.active,invalid);assert.equal(s._yzFx.length,0);
}
{
 const{s,m}=scene();s.hubMotionAllowed=()=>false;s.yuzuEvolutionArt(m,0xffffff);const q=s._yzFx[0];assert.equal(q.spr.frame,4);s.state='paused';s.yuzuTickFx(5);assert.equal(q.t,0);s.state='play';s.yuzuTickFx(.1);assert.equal(q.spr.frame,4);s.yuzuTickFx(.2);assert(!q.spr.active);
}
{
 const{s,m}=scene();for(let i=0;i<20;i++)s.yuzuEvolutionArt(m,0xffffff);assert.equal(s._yzFx.length,8);Save.data.settings.vfx=0;assert.equal(s.yuzuEvolutionArt(m,0xffffff),false);Save.data.settings.vfx=1;s.textures.exists=()=>false;let fallback=0;s.showBanner=()=>{};s.screenFlash=s.vfxHitRing=()=>fallback++;s.yuzuSound=()=>{};s.yuzuEvolveFx(m);assert.equal(fallback,2);
 s.textures.exists=()=>true;s.yuzuFormBadge(m,3);const badge=m.formBadge;s.clearYuzuBuff=s.clearYuzuSkillFx=s.clearYuzuSeeds=()=>{};s.clearYuzuCrew();assert(!badge.active);assert.equal(s._yzFx.length,0);
}
console.log('Yuzu63: verified8 packed sheets, battle-only hero loading, attack/walk mapping, old-art fallback,8frame one-shot, ownership/epoch/pause/reduced/mute/cap and badge lifecycle passed');
