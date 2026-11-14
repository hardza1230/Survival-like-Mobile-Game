// v8.1.148 Lobby hero feels alive: idle acts always return the pose to rest, ambient depth layers spawn, shadow follows hops.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); const j=src.indexOf('\n  ',src.indexOf('\n',i+1)); let k=j; while(/^\n    /.test(src.slice(k,k+5)))k=src.indexOf('\n  ',src.indexOf('\n',k+1)); return src.slice(i+3,k); };
const cls='class S{'+grab('lobbyHeroAct')+'\n'+grab('lobbyHeroAmbient')+'}; S';
const S=vm.runInNewContext(cls,{Math});
// tweens: apply end values instantly, run callbacks
const tweens={add(c){ for(const k in c){ if(['targets','duration','ease','delay','yoyo','hold','repeat','onComplete','onUpdate'].includes(k))continue; const v=c[k]; c.targets[k]=typeof v==='object'?v.to:v; } if(c.yoyo)for(const k in c){ if(k==='sq'||k==='hop'||k==='lean')c.targets[k]=0; } c.onComplete&&c.onComplete(); return {}; }};
const s=new S(); s.tweens=tweens;
for(const a of ['peek','look','stretch','wiggle','hop']){ const st={sq:0,hop:0,lean:0,amp:1,H:300}; assert.equal(s.lobbyHeroAct(st,a),a); assert.equal(st.busy,false,a+' frees'); assert.equal(st.sq,0,a+' sq'); assert.equal(st.hop,0,a+' hop'); assert.equal(st.lean,0,a+' lean'); assert.equal(st.amp,1,a+' amp'); }
const st={sq:0,hop:0,lean:0,amp:1,H:300}; const seen=new Set(); for(let i=0;i<40;i++){ const a=s.lobbyHeroAct(st); assert.notEqual(a,undefined); seen.add(a); } assert(seen.size>=4,'varied acts');
const g=()=>{ const o={x:0,y:0,active:true}; ['fillStyle','fillCircle','setPosition','setAlpha'].forEach(f=>o[f]=function(a,b){ if(f==='setPosition'){o.x=a;o.y=b;} return o; }); return o; };
const m={n:0,add(){this.n++;}}; Object.assign(s,{menu:m,add:{graphics:g},hubMotionAllowed:()=>true,hubTween:()=>({}),time:{delayedCall(){}}});
assert.equal(s.lobbyHeroAmbient('back',180,500,300,0xffc6e0),7); assert.equal(s.lobbyHeroAmbient('front',180,500,300,0xffc6e0),3); assert.equal(m.n,10);
s.hubMotionAllowed=()=>false; assert.equal(s.lobbyHeroAmbient('front',180,500,300,1),0,'reduced motion: none');
assert(src.includes("this._lhShadow=[sg,si]")&&src.includes("const shd=this._lhShadow||[]; this._lhShadow=null;"),'shadow handed to warp');
assert(src.includes("this.lobbyHeroAmbient?.('front',w/2,heroY,heroH"),'front layer drawn after hero');
assert(src.includes("lobbyHeroTap(){ const W=this._lhWarp; if(!W||!W.c.active)return; this._lhIdleAt=Date.now();"),'tap resets idle timer');
assert(src.includes("+(st.lean||0)*h;"),'cosmetics follow lean');
console.log('Lobby alive: idle acts reset, depth layers, shadow follow passed');
