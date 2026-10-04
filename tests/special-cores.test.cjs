const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return s.slice(at,at+1+next.index);}
const ctx={};vm.createContext(ctx);
vm.runInContext(s.slice(s.indexOf('const SPECIAL_CORES ='),s.indexOf('/* ---- ยศ (rank)')),ctx);
vm.runInContext('this.Save={data:{rank:0,threads:100},save(){},threads(){return this.data.threads||0},'+['specialCoreLvl','specialCoreCost','buySpecialCore'].map(method).join('\n')+'};this.cores=SPECIAL_CORES;',ctx);
const save=ctx.Save;
assert.equal(save.buySpecialCore('magnet'),false);assert.equal(save.data.threads,100);
save.data.rank=1;assert.equal(save.buySpecialCore('magnet'),true);assert.equal(save.data.threads,94);assert.equal(save.specialCoreCost('magnet'),12);
save.data.threads=0;assert.equal(save.buySpecialCore('magnet'),false);assert.equal(save.specialCoreLvl('magnet'),1);
save.data.threads=100;assert(save.buySpecialCore('magnet'));assert(save.buySpecialCore('magnet'));assert(!save.buySpecialCore('magnet'));assert(!save.buySpecialCore('unknown'));
save.data.rank=5;for(const c of ctx.cores){save.data.threads=1000;while(save.specialCoreLvl(c.id)<3)assert(save.buySpecialCore(c.id));}
ctx.affixDef=id=>({apply:(p,v)=>p[id]=(p[id]||0)+v});ctx.player={};vm.runInContext('applySpecialCores(player)',ctx);
assert.deepEqual({...ctx.player},{pick:30,dash:12,xp:15,orbfind:15,uniquecd:9});
save.data.rank=6;assert.equal(save.specialCoreLvl('magnet'),3);
assert(method('promote').includes('UPG_ORDER'));assert(!method('promote').includes('specialCores'));
assert(method('applyMeta').includes('applySpecialCores(p)'));assert(s.includes("    applySpecialCores(p); mark('Special Cores');\n    for(const slot of GEAR_SLOTS)"));
console.log('Special cores: rank gates, thread costs, insufficient funds, level caps, old saves, all five effects and promotion persistence passed');
