// v8.2.49 เจ้าของ: Expedition แตะตีรัว ๆ แล้วตัวละครโตขึ้น (ลูกเล่นกดปุ่มเด้งจับขนาดตอนกำลังเด้งกลับ)
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
assert.ok(src.includes("tag='exp_tap'; this.tapZones[this.tapZones.length-1].noBounce=true;"),'expedition tap area does not bounce');
const P=m('_pressBounce');assert.ok(P.includes('const q0=o._pbBase;')&&P.includes('p.o._pbBase=p.b;')&&P.includes('delete p.o._pbBase'),'repeat presses reuse the pre-press scale');
console.log('Expedition 8.2.49: tap area no bounce; press bounce never compounds passed');
