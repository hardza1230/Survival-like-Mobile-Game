const assert=require('node:assert/strict'),fs=require('node:fs');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
const b=method('buildGearPower'),t=method('powerTips');
assert(b.includes("this.powerStatus(si)")&&b.includes("'Recommended '+ps.rec"),'power vs next stage recommended');
assert(b.includes("const tips=this.powerTips()"),'tip cards');
assert(b.includes("[['upgrade','Weave'")&&b.includes("['gear','Equipment'")&&b.includes("['craft','Forge'"),'Weave/Equipment/Forge buttons');
assert(!b.includes("'bazaar'"),'no Bazaar on this page');
for(const k of ["k:'gear'","k:'weave'","k:'tal'","k:'perk'","k:'enh'","k:'mail'"])assert(t.includes(k),k);
assert(!t.includes("k:'forge'"),'Forge tip without a number removed');
assert(t.includes('out.sort((x,y)=>y.gain-x.gain)')&&!t.includes('pri:'),'all cards ranked by real Power gain (v8.0.31 A)');
assert(t.includes("wait.push({k:'mail'")&&t.includes("wait.push({k:'perk'"),'non-Power items go to the waiting strip');
assert(t.includes('tal[n.id]=r+1')&&t.includes('else delete tal[n.id]'),'Talent gain simulated and restored');
assert(b.includes("tag='wait_'+q.k"),'waiting strip pills');
assert(b.includes("this._pwShown={cid,v:ps.cur}")&&b.includes("'+'+gain+' ⚡'"),'Power count-up + pop (C)');
assert(t.includes('const top=out.slice(0,3)'),'best 3');
assert(t.includes('if(keep[q]===undefined)delete up[q]; else up[q]=keep[q];')&&t.includes('it.enhanceLv=was;'),'simulated gains restore the save');
console.log('Power summary: Power vs recommended, 3 best tips with restored simulations, Weave/Equipment/Forge, no Bazaar passed');
