// v8.1.157 CODE_VS_ART round 3 (8, 10–14) + Cocoa Titan rage aura: code lanes, Taro bursts/shock marks, code bubble texture, code-redrawn sparkle/trail/dust sheets keeping frame layout.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
assert(/const CODE_VFX=\{[^}]*lane:true,taroBurst:true,bubble:true,sparkle:true,trail:true,dust:true[,}]/.test(src),'switches');
const G=()=>{ const g={active:true,calls:[]}; for(const f of ['clear','fillStyle','fillCircle','fillEllipse','fillRect','fillTriangle','lineStyle','strokeCircle','strokeEllipse','lineBetween','beginPath','moveTo','lineTo','strokePath','strokePoints','setDepth','setPosition','setRotation','destroy'])g[f]=(...a)=>{ g.calls.push(f); return g; }; return g; };
const S=vm.runInNewContext('class S{'+['codeLane','codeBurst','taroShockCode'].map(grab).join('\n')+'}; S',{Math,TARO_SHOCK_MAX:5});
const s=new S(); let tw=null,post=null; Object.assign(s,{add:{graphics:()=>G()},camWorld:o=>o,tweens:{add(c){tw=c;}},time:{now:1000},events:{on(e,f){post=f;},off(){post=null;}}});
// 8 lane follows the hidden line image
{ const img={active:true,visible:true,x:5,y:6,rotation:.3,displayWidth:400,displayHeight:40,originX:0,alpha:.8,tintTopLeft:0x75ff4b,depth:3,setVisible(v){this.visible=v;return this;}}; const g=s.codeLane(img,{}); assert(g&&img.visible===false); post(); assert(g.calls.includes('fillRect')&&g.calls.includes('strokePath'),'band + chevrons'); img.active=false; post(); assert.equal(post,null,'unhooks when the line is gone'); }
// 10 burst + shock marks
{ const g=s.codeBurst(0,0,80,0xc6a2ed,{}); tw.targets.p=.2; tw.onUpdate(); assert(g.calls.includes('strokePoints')&&g.calls.includes('strokeCircle')); }
{ s._taro={shocked:new Set([{active:true,_shock:5,x:0,y:0,displayHeight:40,displayWidth:50},{active:true,_shock:2,x:9,y:9}])}; assert.equal(s.taroShockCode(),2); assert(s._shockG.calls.includes('strokeEllipse'),'max stacks ring'); }
// hooks
assert(src.includes("kitLane(img,o={}){ if(typeof CODE_VFX!=='undefined'&&CODE_VFX.lane&&!o.key)return this.codeLane(img,o);"),'8 hook');
assert((src.match(/\/\^bpx_taro_\(\?:orb_burst\|spark_burst\|arc_overload_hit\)\$\/\.test\(key\)\)return this\.codeBurst/g)||[]).length===2,'10 taroArt + taroFx');
assert(src.includes("const cb=this.codeBubbleOn?.(),sk=cb?'code_bubble':'vfx_shell_bubble';")&&src.includes("mark=this.codeBubbleOn?.()?this.camWorld(this.add.image(px,py,'code_bubble')")&&src.includes("if(this.codeBubbleOn?.()){q.bubble=")&&src.includes("const cbS=this.codeBubbleOn?.();")&&src.includes("img=(this.codeBubbleOn?.()?"),'11 five bubble sites');
const cs=grab('codeSheets'); for(const k of ['cs_fx_sparkle','vfx_lb_sparkle','lvl_sparkle_sheet','temple_sparkle_sheet','vfx_ruby_sparkle','bpx_cocoa_dash_trail','vfx_b11_stampede_trail','vfx_frost_lance_trail','vfx_bk_dust','cs_fx_dust'])assert(cs.includes(k),'12–14 '+k);
assert(cs.includes('for(const q of fr)nt.add(q.f,0,q.x,q.y,q.w,q.h)')&&cs.includes('this.anims.remove(a.key)'),'frames kept, stale anims dropped');
assert(src.includes("'bpx_cocoa_rage'+Math.min(3")&&src.includes("r>0.02&&!(typeof CODE_VFX!=='undefined'&&CODE_VFX.cocoa)?'bpx_cocoa_rage'"),'Titan rage art aura off with code');
console.log('Code VFX round 3: lanes, Taro bursts/marks, bubbles, sparkle/trail/dust sheets, Titan aura passed');
// v8.1.158 heal: green ground ring + rising plus signs while regen lasts (replaces the green growth_unlock "flower")
{ const S2=vm.runInNewContext('class S{'+grab('healAuraCode')+'}; S',{Math}); const h=new S2(); let post=null; const g=G(); g.setDepth=()=>g; Object.assign(h,{player:{x:0,y:0,active:true,displayHeight:56,depth:5},add:{graphics:()=>g},camWorld:o=>o,time:{now:0},events:{on(e,f){post=f;},off(){post=null;}},tweens:{add(c){c.onComplete&&c.onComplete();}},_cocoaRegenT:5});
  h.healAuraCode(); assert(post,'follows'); h.time.now=500; post(); assert(g.calls.includes('strokeEllipse')&&g.calls.includes('fillRect'),'ring + plus'); h._cocoaRegenT=0; post(); assert.equal(post,null,'ends with regen'); }
assert(src.includes("if(typeof CODE_VFX!=='undefined'&&CODE_VFX.heal&&(Save.data.settings?.vfx??2)!==0){ this.healAuraCode(); return; }"),'heal hook');
console.log('Heal aura code passed');
