// v8.1.78 เจ้าของ: ภารกิจประจำด่าน Chapter 3 (รอบ 2)
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const SIG=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'];
assert.ok(src.includes("const SIG_MISSIONS=['seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'];"));
for(const t of SIG){assert.ok(new RegExp('\\n  '+t+":\\{emoji:").test(src),'def '+t);assert.ok(src.includes(t+":['"),'bonus goal '+t);}
const ob=[...src.matchAll(/objectives:\[([^\]]*)\]/g)].slice(0,10).map(x=>x[1]);SIG.forEach((t,i)=>assert.ok(ob[5+i].includes(t),'stage '+(11+i)+' has '+t));
for(const n of ['sigAdd','sigText','sigClear','sigSpawnAt','sigSetup','sigNear','sigTick','sigPickPact','sigOnKill'])m(n);
const tk=m('sigTick');for(const t of SIG)assert.ok(tk.includes("o.type==='"+t+"'"),'tick '+t);
assert.ok(src.includes("}else if((typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS.includes(type))){\n      this.sigSetup(o,type,p||{});")&&src.includes('this.sigTick(dt,o);if(!this.waveObjective)return;')&&src.includes('this.sigOnKill?.(e);')&&src.includes('clearWaveObjective(){this.sigClear?.();'),'hooks');
assert.ok(/!\(typeof SIG_MISSIONS!=='undefined'&&SIG_MISSIONS\.includes\(o\.type\)\)&&this\.objNodeG\)this\.objNodeG\.clear\(\)/.test(src),'sig graphics not wiped each frame');
assert.ok(src.includes("dropHeal(x,y,source='crate'){ if(this._sig?.noHeal)return null;")&&/\*\(o\._altarMul\|\|1\)/.test(src),'altar curse + reward multiplier');
console.log('Signature missions: 5 Ch3 types defined, assigned to stages 11-15, setup/tick/kill/clear hooks, altar pacts passed');
