// v8.2.46 เจ้าของ: กด Start/Reroll ตอนแจกการ์ดไม่ติด (pointer ตอนเล่น = พิกเซลจอ ×RENDER_DPR) + เอาข้อความคำอธิบายใต้การ์ดออก
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const D=m('missionDealShow');
assert.ok(/onTap=\(p0\)=>\{[^}]*RENDER_DPR[^}]*pt=\{x:p0\.x\/k,y:p0\.y\/k\}/.test(D),'deal taps divide the pointer by RENDER_DPR before hit-testing UI buttons');
assert.ok(!/const info=this\.add\.text/.test(D)&&!D.includes('info.setText('),'no description text under the lifted card');
// hit-test simulation: button at UI (195,599), DPR 1.5 → screen pointer (292.5,898.5) must hit
const body=D.match(/onTap=\(p0\)=>\{ if\(hold\|\|!p0\)return; (const k=[^;]*;)/)[1];const ctx={RENDER_DPR:1.5};vm.createContext(ctx);
vm.runInContext('var hit=(p0,b)=>{'+body+' return on(b);};',ctx);
assert.ok(ctx.hit({x:292.5,y:898.5},{x:195,y:599,alpha:1,width:220,height:40}),'screen-pixel tap hits the Start button');
assert.ok(!ctx.hit({x:195,y:599},{x:195,y:599+200,alpha:1,width:220,height:40}),'far tap misses');
console.log('Deal 8.2.46: Start/Reroll taps use UI coordinates; no description text passed');
