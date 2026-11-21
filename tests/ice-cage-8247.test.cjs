// v8.2.47 เจ้าของ: C1-4 บอส Ice Cage Sealing — เส้นเตือนแนวตั้งต้องโดนจริงทั้งแนว (เดิมโดนแค่วงเล็กแถวผู้เล่น)
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const ctx={Math};vm.createContext(ctx);vm.runInContext('class S{'+m('iceCageSlam')+'};this.K=S;',ctx);
const s=new ctx.K();let hurt=0;Object.assign(s,{player:{active:true,x:0,y:0},hurtPlayer(d){hurt+=d;},time:{delayedCall(){}},tweens:{add(){}},camWorld:x=>x,add:{graphics:()=>{const g={};for(const k of ['setDepth','fillStyle','fillRect','destroy'])g[k]=()=>g;return g;}}});
s.iceCageSlam(10,-300,20);assert.strictEqual(hurt,20,'far up the same column still hits');
s._iceCageHit=false;s.iceCageSlam(90,0,20);assert.strictEqual(hurt,20,'the next lane over (78 px) misses');
assert.ok(/pick==='bars'[^\n]*this\.iceCageSlam\?\.\(x,py,d\)/.test(src),'bars attack slams every telegraphed column');
console.log('Ice Cage 8.2.47: whole telegraphed column hits passed');
