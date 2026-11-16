// v8.1.156 CODE_VS_ART round 2 items 2–7: Taro code lightning, code aim lines, Cocoa code shock, XP code trail, generated ring/glow/line textures, boss b01 code wave/impact (trial).
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
assert(src.includes("const CODE_VFX={bolt:true,aim:true,cocoa:true,xp:true,generic:true,bossWave:['b01']};"),'switches');
const G=()=>{ const g={active:true,calls:[]}; for(const f of ['clear','fillStyle','fillCircle','fillEllipse','lineStyle','strokeCircle','strokeEllipse','lineBetween','fillTriangle','beginPath','moveTo','lineTo','strokePath','setDepth','strokePoints','destroy'])g[f]=(...a)=>{ g.calls.push(f); return g; }; return g; };
const S=vm.runInNewContext('class S{'+['codeAimLine','codeShock','xpTrailCode','bossCodeWaveCol'].map(grab).join('\n')+'}; S',{Math,CODE_VFX:{bossWave:['b01']},STAGES:[{tint:0x8ee04b},{tint:1}],XP_TIER_COL:{1:0x9fe8ff},XP_ORB_PX:{1:20}});
const s=new S(); let tw=null; Object.assign(s,{add:{graphics:()=>G()},camWorld:o=>o,tweens:{add(c){tw=c;}}});
// 3 aim line: dashes + arrowhead, length honoured
{ const g=G(); const n=s.codeAimLine(g,0,0,0,600,.5,false,0xff9ec4,1); assert(n>=10&&g.calls.includes('fillTriangle')); }
// 4/7 shock: rings + dust + cracks then destroy
{ const g=s.codeShock(10,10,100,0xd59b65,{crack:true,dust:8,rings:2}); assert(g&&tw.duration>0); tw.targets.p=.5; tw.onUpdate(); assert(g.calls.includes('strokeEllipse')&&g.calls.includes('fillCircle')&&g.calls.includes('strokePath')); assert(s.codeShock(0,0,0,1)===null,'zero radius'); }
// 5 xp trail: history, reset on teleport (orb reuse)
{ const o={x:0,y:0}; for(let i=0;i<8;i++){ o.x+=10; s.xpTrailCode(o); } assert.equal(o._th.length,14); o.x=500; s.xpTrailCode(o); assert.equal(o._th.length,2,'jump resets the trail'); }
// 7 boss wave only for b01
{ s.stageIndex=0; assert.equal(s.bossCodeWaveCol(),0x8ee04b); s.stageIndex=1; assert.equal(s.bossCodeWaveCol(),null); s.stageIndex=0; s._pinnacleRun=true; assert.equal(s.bossCodeWaveCol(),null); }
// hooks
assert(src.includes("if(d>=4&&typeof CODE_VFX!=='undefined'&&CODE_VFX.bolt){ this.taroLightningVisual?.(x1,y1,x2,y2,false,loop);"),'2 arc bolt → code');
assert(src.includes("this.time.delayedCall(70,()=>{ build(); paint(); });"),'2 flicker re-jag');
assert(src.includes("this.codeAimLine(g,pl.x,pl.y,s.ang,L,c,s.full,0x9fe8ff,t)")&&src.includes("this.codeAimLine(g,pl.x+ca*30,pl.y+sa*30,s.ang,len-30,"),'3 Mint lance + Momo sniper');
assert(/bpFx\(key,x,y,size,o=\{\}\)\{ if\(typeof CODE_VFX!=='undefined'&&CODE_VFX\.cocoa&&\/\^bpx_cocoa_/.test(src),'4 bpFx hook');
assert(src.includes("if(typeof CODE_VFX!=='undefined'&&CODE_VFX.xp)return this.xpTrailCode(o);")&&src.includes("if(this._xpTrG?.active)this._xpTrG.clear();"),'5 hook + per-frame clear');
assert(src.includes("make('vfx_ring',")&&src.includes("make('vfx_glow',")&&src.includes("make('vfx_line',")&&src.includes("this.codeGenericTex?.();"),'6 generated textures');
assert(src.includes("if(cwi)this.codeShock?.(x,y,r,cwi,")&&src.includes("const cw=this.bossCodeWaveCol?.(); if(cw&&this.add?.graphics)"),'7 hazard impact + nova wave');
console.log('Code VFX round 2: lightning, aim, Cocoa shock, XP trail, generic textures, b01 wave passed');
