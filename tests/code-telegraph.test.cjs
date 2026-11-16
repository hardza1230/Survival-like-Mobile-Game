// v8.1.155 code-drawn hazard telegraph (exact radius, fill grows, rim blinks late, white flash) + occlusion fade no longer sticks.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const S=vm.runInNewContext('class S{'+grab('codeTelegraph')+'}; S',{Math});
const s=new S(); const log=[]; let tw=null;
const G=d=>{ const g={active:true,d,calls:[]}; for(const f of ['clear','fillStyle','fillCircle','lineStyle','strokeCircle','setDepth'])g[f]=(...a)=>{ g.calls.push([f,...a]); return g; }; g.clear=()=>{ g.calls=[]; return g; }; return g; };
Object.assign(s,{add:{graphics:()=>G()},camWorld:o=>o,tweens:{add(c){ tw=c; }}});
const t=s.codeTelegraph(100,200,90,760,0xff0000); assert(t&&t.fill&&t.rim); assert.equal(tw.duration,760);
const circles=g=>g.calls.filter(c=>c[0]==='fillCircle'||c[0]==='strokeCircle').map(c=>c[3]);
assert.deepEqual(circles(t.rim),[90,90],'rim exactly r'); assert(circles(t.fill)[1]<5,'inner starts small');
tw.targets.p=.5; tw.onUpdate(); assert(circles(t.fill)[1]>60&&circles(t.fill)[1]<90,'fill grows');
tw.targets.p=1; tw.onUpdate(); assert.equal(circles(t.fill)[1],90); assert(t.rim.calls.some(c=>c[0]==='lineStyle'&&c[2]===0xffffff),'white flash at the end');
assert(src.includes("const CODE_TELEGRAPH=true;")&&src.includes("CODE_TELEGRAPH&&(codeTg=this.codeTelegraph?.(x,y,r,760,color))"),'switch + hook');
assert(src.includes("const readable=codeTg?null:this.makeHazardReadability"),'no double ring');
assert(src.includes("if(occ&&!e._occ&&e.alpha>=.95){ e._occ=true; e._occA=1; e.setAlpha(.5); } else if(!occ&&e._occ){ e._occ=false; if(e.alpha<=.55)e.setAlpha(1); }"),'occlusion restores to opaque');
console.log('Code telegraph + occlusion fade fix passed');
