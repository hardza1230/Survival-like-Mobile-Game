// v8.1.150 owner round 5: short Relic text, short hero intros, vault background covers the screen, Capture the Zone progress arc / 25% pulses / finish sweep.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
// Relics: every headline is a short plain line
const ri=src.indexOf('const RELICS = {'),R=vm.runInNewContext('('+src.slice(ri+15,src.indexOf('\n};',ri)+2)+')',{});
for(const k in R){ assert(R[k].headline&&R[k].headline.length<=28,k+' headline short: '+R[k].headline); }
assert(src.includes("short:d.headline,note:["),'relic option carries short + note');
assert(src.includes("o.short||String(o.desc||'').split("),'vault shows the short line');
assert(src.includes("bg.setScale(Math.max(W/Math.max(1,bg.width),H/Math.max(1,bg.height)))"),'vault background covers the whole screen');
// Hero intros
const hi=src.slice(src.indexOf('const HERO_INTROS=['),src.indexOf('];',src.indexOf('const HERO_INTROS=[')));
for(const m of hi.matchAll(/text:'([^']*)'/g))assert(m[1].length<=52,'intro short: '+m[1]);
// Capture
const cls='class S{'+grab('captureHud')+'\n'+grab('capturePulse')+'\n'+grab('captureFinishSweep')+'}; S';
const S=vm.runInNewContext(cls,{Math,TAU:Math.PI*2,Sfx:{}});
const s=new S(); const hits=[];
const mk=(x,y,o={})=>Object.assign({x,y,active:true,maxhp:100,hp:100,setVelocity(){}},o);
const foes=[mk(0,50),mk(0,400),mk(10,10,{isElite:true}),mk(5,5,{isBoss:true}),mk(600,0)];
Object.assign(s,{enemies:{getChildren:()=>foes},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),damage:(e,a)=>hits.push([e,a]),camWorld:o=>o,
  add:{graphics:()=>{const g={scene:1};['clear','lineStyle','strokeCircle','beginPath','arc','strokePath','setDepth'].forEach(f=>g[f]=()=>g);return g;},
       text:()=>{const t={scene:1,txt:''};['setOrigin','setDepth','setPosition','setAlpha','setColor'].forEach(f=>t[f]=()=>t);t.setText=v=>{t.txt=v;return t;};return t;},
       circle:()=>({setStrokeStyle(){return this;},setDepth(){return this;},destroy(){}})},tweens:{add(){}}});
const z={x:0,y:0,depth:1}; const o={target:25,progress:13.2};
assert.equal(s.captureHud(z,140,.5,0xffd166,true,o),12); assert.equal(s._captureSec.txt,'12s');
s.captureHud(z,140,.5,0xffd166,false,o); assert.equal(s._captureSec.txt,'⬇ 12s','outside shows a pointer');
assert.equal(s.capturePulse(z,140,0xffd166),2,'pulse hits normal + elite inside 1.25R, not boss / far');
assert(hits.find(h=>h[0]===foes[0])[1]===40&&hits.find(h=>h[0]===foes[2])[1]===8,'normal 40%, elite 8%');
hits.length=0; assert.equal(s.captureFinishSweep(0,0,140),3,'finish sweep: everything within 520 except the boss'); assert.equal(hits.find(h=>h[0]===foes[0])[1],500);
assert(src.includes("const q=Math.floor(f*4); if(q>(o._capQ||0)&&q<4){ o._capQ=q; this.capturePulse?.(z,R,col); }"),'pulses at 25/50/75%');
assert(src.includes("this.captureFinishSweep?.(x,y,R);"),'finish sweep hooked');
assert(src.includes("'_captureArc','_captureSec'"),'cleanup');
console.log('Owner round 150: relic text, hero intros, vault bg, capture arc/pulse/sweep passed');
