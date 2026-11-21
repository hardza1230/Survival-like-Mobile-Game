// v8.2.51 เจ้าของ: เล่นไปสักพักมอนไม่มีภาพ เห็นแต่เงา — ตัวมอนถูกทำโปร่ง (.01) ให้ภาพซ้อน artFollow แต่ภาพซ้อนถูกลบก่อน → ค้างโปร่ง
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const ctx={Math};vm.createContext(ctx);vm.runInContext('class S{'+m('artFollowTick')+'};this.K=S;',ctx);
const s=new ctx.K();const e={active:true,alpha:.01,setAlpha(a){this.alpha=a;}};const ov={active:false,_fe:e,destroy(){}};e._artOv=ov;s._artFol=[ov];
s.artFollowTick();assert.strictEqual(e.alpha,1,'overlay destroyed elsewhere → monster visible again');assert.strictEqual(e._artOv,null);
assert.ok(src.includes("if(e.alpha<.05&&!(e._artOv&&e._artOv.active)&&!e._hideOk&&!e._fleeing){ if(e._artOv)e._artOv=null; e.setAlpha(1); }"),'update-loop safety net');
console.log('Invisible foe 8.2.51 passed');
