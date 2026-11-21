// v8.2.43 owner: Herald-empowered monsters get one Hunger Mutation (icon above head) · Ch1 = shell/bloat/split · Ch2+ = all 6 · mutated kills pay extra
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const a=src.indexOf('const HH_MUT='),b=src.indexOf('const RUN_WAIT_MAX');
const ctx={Math};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+';this.M=HH_MUT;this.C1=HH_MUT_CH1;this.ALL=HH_MUT_ALL;class K{'+['hhMutate','hhShellBlock'].map(meth).join('\n')+'\n};this.K=K;',ctx);
assert.strictEqual(ctx.C1.join(),'shell,bloat,split');assert.strictEqual(ctx.ALL.length,6);for(const k of ctx.ALL)assert(ctx.M[k]&&ctx.M[k].em&&ctx.M[k].name,k);
const s=new ctx.K();s.floatText=()=>{};s.vfxHitRing=()=>{};s.a12=()=>{};
// chapter gating
s.stageIndex=2;for(let i=0;i<60;i++){const e={};const k=s.hhMutate(e);assert(ctx.C1.includes(k),'ch1 pool '+k);}
s.stageIndex=7;const seen=new Set();for(let i=0;i<400;i++){const e={};seen.add(s.hhMutate(e));}assert.strictEqual(seen.size,6,'ch2 has all six');
// no double mutation, split kids never mutate
const e1={};s.hhMutate(e1);assert.strictEqual(s.hhMutate(e1),null);assert.strictEqual(s.hhMutate({_hhKid:true}),null);
// candy shell: 3 hits, one per 0.12 s
const sh={_hhPow:true,_hhShell:3,x:0,y:0};s.elapsed=0;assert(s.hhShellBlock(sh));assert.strictEqual(sh._hhShell,2);assert(s.hhShellBlock(sh));assert.strictEqual(sh._hhShell,2,'same volley');
s.elapsed=1;s.hhShellBlock(sh);s.elapsed=2;s.hhShellBlock(sh);assert.strictEqual(sh._hhShell,0);assert(!s.hhShellBlock(sh),'broken shell lets damage through');
// wiring
for(const h of ["this.hhMutate?.(e); return true; }","this.hhMutTick?.(dt,S,g);","if(e._hhShell>0&&this.hhShellBlock?.(e))return;","if(mut){ S.mutKills=(S.mutKills||0)+1; this.hhMutDeath(e,mut,S); }","(S.powKills+(S.mutKills||0))*(2+si*.4)"])assert(src.includes(h),h);
console.log('Herald mutations 8.2.43: chapter pools, no double/kid mutation, shell 3 hits, wiring, extra reward passed');
