// v8.2.37 owner (plan C): Kitchen = 4 preset signature moves, pick 1, no HP/AP upkeep, no parts · old system kept behind FR_SIMPLE
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const fn=n=>{const at=src.indexOf('\nfunction '+n+'(');assert(at>=0,n);return src.slice(at+1,src.indexOf('\n',at+1));};
const a=src.indexOf('const FR_FLAVOR_CAP='),b=src.indexOf('function frSignature(');
const ctx={Math};vm.createContext(ctx);
vm.runInContext(src.slice(a,b)+fn('frSignature')+'\nconst FR_KIND={t:FR_TRIGGERS,e:FR_EFFECTS,m:FR_MODS};\n'+fn('frPart')+'\n'+['kitchenOpen','frActive','frUpkeep','applyFrUpkeep'].map(fn).join('\n')+
 '\nvar Save={data:{stageMastery:{9:1}},frSlots(){return 3},frRecipes(){return [{t:"t:dash",e:"e:rage",m:null}]},frLv(){return 3}};this.Save=Save;this.T={FR_SIMPLE,FR_PRESETS,frPick,frActive,frUpkeep,applyFrUpkeep,frSignature,frPart};',ctx);
const T=ctx.T,S=ctx.Save;
assert.strictEqual(T.FR_SIMPLE,true);
assert.strictEqual(T.FR_PRESETS.length,4);
for(const p of T.FR_PRESETS){ const t=T.frPart(p.t),e=T.frPart(p.e); assert(t&&e&&!e.cut,p.name+' uses live parts'); assert(T.frSignature(p),p.name+' is a signature dish'); assert(p.desc.length<=44,p.name+' desc short'); assert(!/[฀-๿]/.test(p.name+p.desc)); }
assert(src.includes("fireRecipes('unique')")&&src.includes("fireRecipes('dash')")&&src.includes("fireRecipes('lowHp')")&&src.includes("fireRecipes('hurt')"),'preset triggers fire');
// never picked → nothing active; old saved recipes ignored
assert.strictEqual(T.frPick(),-1); assert.strictEqual(T.frActive().length,0);
S.data.frPick=0; assert.strictEqual(JSON.stringify(T.frActive()),JSON.stringify([{t:'t:dash',e:'e:shock',m:null}]));
S.data.frPick=-1; assert.strictEqual(T.frActive().length,0);
S.data.frPick=9; assert.strictEqual(T.frPick(),-1);
// locked before Chapter 2
S.data.frPick=1; S.data.stageMastery={}; assert.strictEqual(T.frActive().length,0); S.data.stageMastery={9:1};
// no upkeep
const p={maxhp:100,dmgMul:1}; assert.strictEqual(T.applyFrUpkeep(p),false); assert.strictEqual(p.maxhp,100); assert.strictEqual(p.dmgMul,1);
assert.strictEqual(T.frUpkeep().hp,0);
// wiring
assert(src.includes('buildKitchen(){ if(FR_SIMPLE)return this.buildKitchenSimple();'),'kitchen screen routes to simple');
assert(src.includes("_screenBg('🍳 Flavor Kitchen'"),'renamed Flavor Kitchen');
assert(src.includes('tl:FR_SIMPLE?1:Save.frLv(r.t),el:FR_SIMPLE?1:Save.frLv(r.e)'),'presets ignore old part stars');
assert(src.includes("(FR_SIMPLE?Save.data.frPick==null:"),'red dot until first pick');
assert(src.includes("if(!FR_SIMPLE&&typeof frRollPart==='function')"),'daily chest gives no parts');
console.log('Kitchen simple 8.2.37: 4 presets, pick 1, no upkeep, no parts passed');
