const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
const line=k=>{const a=src.indexOf(k);assert(a>=0,k);return src.slice(a,src.indexOf('\n',a));};
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
const code=[line('const RAR_LINES='),line('function gearGrade('),line('function forgeLineOpen('),line('function forgeLines('),line('function forgeSetLines('),line('function affixCountCap('),line('function forgeRowForMod(')].join('\n');
const ctx={GEAR_ALL:[{id:'w1',tier:'common',slot:'weapon'},{id:'w2',tier:'common',slot:'weapon'},{id:'a1',tier:'common',slot:'armor'},{id:'st',tier:'start',slot:'weapon'}],
  DEFS:{p1:{id:'p1',row:'power',slots:['weapon']},s1:{id:'s1',row:'sustain',slots:['weapon']}}};
vm.createContext(ctx);vm.runInContext(code+'\nfunction affixDef(id){return DEFS[id];}\nthis.RL=RAR_LINES;',ctx);
const S={data:{gearItems:[],equippedGear:{}},save(){},gearItem(u){return this.data.gearItems.find(x=>x.uid===u)||null;},isGearEquipped(u){return Object.values(this.data.equippedGear).includes(u);}};
for(const n of ['mergeCanMain','mergeFodder','mergeCarryOptions','mergeGear'])S[n]=vm.runInContext('({'+method(n)+'})',ctx)[n];
const it=(uid,base,grade,o={})=>Object.assign({uid,baseId:base,slot:ctx.GEAR_ALL.find(g=>g.id===base).slot,grade,itemLevel:1,enhanceLv:0,affixes:[]},o);
// ช่อง mod ตามระดับ (เพดาน iLv ยังอยู่)
assert.equal(vm.runInContext('forgeLineOpen',ctx)(it('x','w1','common',{itemLevel:30}),1),false,'common = 1 mod slot');
assert.equal(vm.runInContext('forgeLineOpen',ctx)(it('x','w1','rare',{itemLevel:30}),1),true,'rare = 2 mod slots');
assert.equal(vm.runInContext('forgeLineOpen',ctx)(it('x','w1','epic',{itemLevel:5}),1),false,'iLv cap still applies');
assert.equal(vm.runInContext('forgeLineOpen',ctx)(it('x','w1','common',{itemLevel:30,affixes:[{id:'s1',line:1}]}),1),true,'old saves keep filled lines');
const m=it('m','w1','common',{itemLevel:14,affixes:[{id:'p1',line:0,t:5}]}),f1=it('f1','w2','common',{itemLevel:20,enhanceLv:2,affixes:[{id:'s1',line:1,t:3}]}),f2=it('f2','w1','common',{itemLevel:3}),eq=it('e','w1','common'),lk=it('l','w1','common',{locked:true}),ar=it('a','a1','common'),rr=it('r','w1','rare');
S.data.gearItems=[m,f1,f2,eq,lk,ar,rr];S.data.equippedGear={weapon:'e'};
assert.deepEqual(S.mergeFodder(m).map(x=>x.uid).join(),'f2,f1','same slot+rarity, not equipped/locked, cheapest first');
const opt=S.mergeCarryOptions(m,[f1,f2]);assert.equal(opt.length,1);assert.equal(opt[0].id,'s1');assert.equal(opt[0].line,1,'carry into the new Sustain slot');
assert.equal(S.mergeGear('m',['f1','f1'],null),null,'needs 2 different materials');
assert.equal(S.mergeGear('m',['f1','e'],null),null,'equipped item is not a material');
const r=S.mergeGear('m',['f1','f2'],{uid:'f1',id:'s1'});
assert.equal(r.to,'rare');assert.equal(m.grade,'rare');assert.equal(m.itemLevel,20,'highest iLv');assert.equal(m.enhanceLv,2,'highest enhance');
assert.deepEqual(m.affixes.map(a=>a.id+':'+a.line).join(),'p1:0,s1:1','kept mod placed in the new slot');
assert(!S.data.gearItems.includes(f1)&&!S.data.gearItems.includes(f2),'materials consumed');
assert.equal(S.mergeCanMain(it('L','w1','legend')),false,'legend is max');
assert.equal(S.mergeCanMain(it('s','st','start')),false,'starters cannot merge');
// UI
const b=method('buildMerge');assert(b.includes("tag='merge_go'")&&b.includes("'merge_f_'+f.uid")&&b.includes("'merge_mod_'+o.id"),'merge screen tags');
assert(src.includes("else if(s==='merge')this.buildMerge();")&&src.includes("'buildMerge',"),'route + nav bar');
assert(src.includes("drawAction('g'")&&src.includes("['merge','Merge'"),'entries from Equipment and Power page');
assert(line('quality=(').includes('[gearGrade(item)]')||src.includes('quality=({common:1,rare:1.12,epic:1.24,legend:1.4})[gearGrade(item)]'),'merged rarity raises base stats');
console.log('Gear merge: rarity mod slots, 3→1 merge rules, carried mod, entries passed');
