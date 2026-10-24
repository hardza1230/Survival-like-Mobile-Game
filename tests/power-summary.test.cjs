const assert=require('node:assert/strict'),fs=require('node:fs');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
const b=method('buildGearPower'),t=method('powerTips');
assert(b.includes("this.powerStatus(si)")&&b.includes("'Recommended '+ps.rec"),'power vs next stage recommended');
assert(b.includes("const tips=this.powerTips()"),'tip cards');
assert(b.includes("[['upgrade','Weave'")&&b.includes("['gear','Equipment'")&&b.includes("['craft','Forge'"),'Weave/Equipment/Forge buttons');
assert(!b.includes("'bazaar'"),'no Bazaar on this page');
for(const k of ["k:'gear'","k:'weave'","k:'tal'","k:'perk'","k:'enh'","k:'mail'","k:'forge'"])assert(t.includes(k),k);
assert(t.includes('return out.slice(0,3)'),'best 3');
assert(/if\(was===undefined\)delete up\[k\]; else up\[k\]=was;/.test(t)&&t.includes('it.enhanceLv=was;'),'simulated gains restore the save');
console.log('Power summary: Power vs recommended, 3 best tips with restored simulations, Weave/Equipment/Forge, no Bazaar passed');
