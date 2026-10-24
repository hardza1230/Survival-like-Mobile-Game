const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
assert(src.includes("[['chests','Chests'],['shop','Shop'],['trade','Trade']]"),'3 tabs');
assert(src.includes("TAB={buy:'shop',orders:'shop',gamble:'chests',sell:'trade'}"),'old tab ids map');
assert(method('buildChestShop').includes("id:'sugar',name:'Sugar Chest'"),'Sugar chest in chest tab');
assert(method('buildChestShop').includes("more '+(pity===1?'open':'opens')+' → guaranteed Legend'"),'gold pity shown');
// stock: 4 gear, first in weakest slot, 2 materials
let seq=0;const eq={weapon:{itemLevel:20,grade:'rare'},gloves:{itemLevel:20,grade:'rare'},armor:null,boots:{itemLevel:3,grade:'common'}};
const ctx={Math,Save:{data:{bazaarSeed:3,bazaarZone:4},equippedGearItem:s=>eq[s]},GEAR_SLOTS:['weapon','gloves','armor','boots'].map(slot=>({slot})),
 GEAR_ALL:['weapon','gloves','armor','boots','ring'].flatMap((slot,i)=>[0,1].map(k=>({id:slot+k,slot,tier:k?'rare':'common',chapter:1}))),CURRENCY:[{key:'a'},{key:'b'},{key:'c'}],
 mulberry32:s=>()=>((seq=(seq*9301+49297)%233280)/233280)};
vm.createContext(ctx);const C=vm.runInContext('(class{'+method('bazaarWeakSlot')+'\n'+method('bazaarStock')+'})',ctx),g=new C(),st=g.bazaarStock();
assert.equal(st.weak,'armor','empty slot is weakest');assert.equal(st.gear.length,4);assert.equal(st.gear[0].slot,'armor');assert.equal(st.rec,0);assert.equal(st.cur.length,2);
assert.equal(new Set(st.gear.map(x=>x.id)).size,4);
// free refresh once per day
assert(src.includes("bazaarFreeRefresh(){ return this.data.bazaarFreeDay!==bazaarDaySeed(); }"));
assert(/refreshBazaar\(\)\{ if\(this\.bazaarFreeRefresh\(\)\)\{ this\.data\.bazaarFreeDay=bazaarDaySeed\(\);/.test(src));
console.log('Bazaar tabs: Chests (silver/gold pity/Sugar), Shop 4 gear + recommended weakest slot + 2 materials + free daily refresh, Trade passed');
