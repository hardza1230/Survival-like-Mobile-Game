// v8.0.83 Simple Forge (docs/FORGE_SIMPLE.md): no Forge Points, one currency (Twist Cream), Glaze → 3 Twist Cream once, price growth, Merge reset, rarity-only rows.
const assert=require('assert/strict'),vm=require('vm');const{fixture,source}=require('./forge-fixture.cjs');const{ctx,api}=fixture();
const R=s=>vm.runInContext(s,ctx);
// No Forge Points anywhere in the game code
for(const k of ['FP_MAX','FP_ADD','FP_SWAP','FP_REMOVE','FP_LUCKY','gearFP(','fpStarCost','forgeAct('])assert(!source.includes(k),k+' removed');
// One currency: Glaze retired from the list, drops, prices and boosts; old keys alias to Twist Cream
assert.equal(R('JSON.stringify(CURRENCY.map(c=>c.key))'),'["transmute"]');assert.equal(R("curKey('divine')"),'transmute');
assert.equal(R('JSON.stringify(CURRENCY_DROP_POOLS)'),JSON.stringify({common:{transmute:100},rare:{transmute:100},epic:{transmute:100},legend:{transmute:100}}));
assert.equal(R("'divine' in CURRENCY_BUY"),false);for(const t of ['common','rare','epic','legend'])for(let i=0;i<20;i++){assert.equal(R(`rollWeightedCurrency('${t}')`),'transmute');assert.equal(R(`forgeCurrency('${t}',{133:100})`),'transmute');}
assert(/const cur=\[\{key:'transmute',qty:1\+Math\.floor\(rng\(\)\*3\)\},\{key:'transmute',qty:3\+Math\.floor\(rng\(\)\*3\)\}\]/.test(source),'Bazaar sells Twist Cream only');
// Glaze migration: each Glaze → 3 Twist Cream, exactly once
const mig=source.slice(source.indexOf('    if(!this.data._glazeMig){'),source.indexOf('\n',source.indexOf('    if(!this.data._glazeMig){')));
const run=data=>vm.runInNewContext('(function(){'+mig+'\n})',{}).call({data});
{const data={currency:{transmute:5,divine:4}};run(data);assert.deepEqual(data.currency,{transmute:17});assert.equal(data._glazeMig,1);data.currency.divine=2;run(data);assert.deepEqual(data.currency,{transmute:17,divine:2},'runs once');}
{const data={};run(data);assert.equal(JSON.stringify(data.currency),'{}');const d2={currency:{divine:'x'}};run(d2);assert.equal(JSON.stringify(d2.currency),'{}');}
// Price per action on an item = 1 + floor(crafts/2); Merge resets crafts (and pending offers)
assert.deepEqual([0,1,2,3,4,5,9,undefined,-3].map(n=>R('forgePrice')({crafts:n})),[1,1,2,2,3,3,5,1,1]);
assert(/main\.grade=GRADE_NEXT\[from\];delete main\.crafts;delete main\.forgeOffers;/.test(source),'Merge resets crafts');
// Rows open by rarity only (iLv no longer gates rows)
const open=(grade,itemLevel)=>[0,1,2].filter(i=>R('forgeLineOpen')({baseId:'test',grade,itemLevel,affixes:[]},i)).length;
for(const lv of [1,11,12,25,60])assert.deepEqual(['common','rare','epic','legend'].map(g=>open(g,lv)),[1,2,3,3]);
// 3-choice offer: distinct mods from the row pool, fewer only if the pool is smaller
for(let line=0;line<3;line++)for(let i=0;i<30;i++){const item={baseId:'test',slot:'weapon',grade:'legend',itemLevel:40,affixes:[]},ids=R('forgeRollOffer')(item,line),pool=api.forgePool(item,line);assert.equal(ids.length,Math.min(3,pool.length));assert.equal(new Set(ids).size,ids.length);assert(ids.every(id=>pool.some(m=>m.id===id)));}
// Star cap message names the current iLv and the next level that raises it
{const mod=api.affixDef('f_might'),it={baseId:'test',grade:'rare',itemLevel:1},cap=R('forgeStarCap')(it,mod),nx=R('forgeNextStarLevel')(it,mod);assert(nx>1);assert(R('forgeStarCap')({...it,itemLevel:nx},mod)>cap);assert(R('forgeStarCap')({...it,itemLevel:nx-1},mod)===cap);assert.equal(R('forgeStarCapText')(it,mod),'Max ★'+cap+' at iLv 1 · next ★ at iLv '+nx);
 const top={baseId:'test',grade:'legend',itemLevel:100};assert.equal(R('forgeNextStarLevel')(top,mod),0);assert(!/next/.test(R('forgeStarCapText')(top,mod)));}
// Tutorial keeps the one-time +3 Twist Cream gift and points at + Add a mod → card
assert(/Save\.addCurrency\('transmute',3\)/.test(source));assert(/tag\?\.startsWith\('add_'\)\);adv=false;label='Tap \+ Add a mod'/.test(source));assert(/\{m:\/forgeAdd\\\(\/,t:'Pick one! It costs 🟢 Twist Cream'\}/.test(source));
// v8.0.85 regression (owner screenshot): Forge draws its own header, so the standard header must not be drawn on top
assert(/if\(!drawHeader\)\{this\.menu\.add\(veil\?\[bg,veil\]:\[bg\]\);return;\}/.test(source),'no double header');assert(/this\._screenBg\('Forge','screen_gear_power_789','gLoadout',false\)/.test(source));
console.log('Forge simple: no FP, Twist Cream only, Glaze ×3 migration once, price growth, Merge reset, rarity rows, 3-choice offers, star-cap text and tutorial passed');
