// v8.0.83 Simple Forge (docs/FORGE_SIMPLE.md): no Forge Points, one currency (Twist Cream), Glaze → 3 Twist Cream once, price growth, Merge reset, rarity-only rows.
const assert=require('assert/strict'),vm=require('vm');const{fixture,source}=require('./forge-fixture.cjs');const{ctx,api}=fixture();
const R=s=>vm.runInContext(s,ctx);
// No Forge Points anywhere in the game code
for(const k of ['FP_MAX','FP_ADD','FP_SWAP','FP_REMOVE','FP_LUCKY','gearFP(','fpStarCost','forgeAct('])assert(!source.includes(k),k+' removed');
// One currency: Glaze retired from the list, drops, prices and boosts; old keys alias to Twist Cream
// v8.1.84 owner (League phase 5 · Reforge): row currencies for upgrades + Recipe Ink; Twist Cream still adds/removes on every row
assert.equal(R('JSON.stringify(CURRENCY.map(c=>c.key))'),'["transmute","berryjam","honeydrop","starsugar","recipeink"]');assert.equal(R("curKey('divine')"),'transmute');
assert.equal(R('JSON.stringify(CURRENCY_DROP_POOLS.common)'),JSON.stringify({transmute:100}),'common drops stay Twist Cream');assert.ok(R('CURRENCY_DROP_POOLS.legend.starsugar>0&&!CURRENCY_DROP_POOLS.rare.starsugar'),'harder = rarer currencies');
assert.equal(R("'divine' in CURRENCY_BUY"),false);for(let i=0;i<20;i++){assert.equal(R(`rollWeightedCurrency('common')`),'transmute');assert.equal(R(`forgeCurrency('common',{133:100})`),'transmute');}
assert.deepEqual([0,1,2,3,4,5].map(i=>R('forgeRowCur')(i)),['transmute','berryjam','honeydrop','starsugar','starsugar','starsugar'],'upgrade currency per row');
assert(/const cur=\[\{key:'transmute',qty:1\+Math\.floor\(rng\(\)\*3\)\},\{key:'transmute',qty:3\+Math\.floor\(rng\(\)\*3\)\}\]/.test(source),'Bazaar sells Twist Cream only');
// Glaze migration: each Glaze → 3 Twist Cream, exactly once
const mig=source.slice(source.indexOf('    if(!this.data._glazeMig){'),source.indexOf('\n',source.indexOf('    if(!this.data._glazeMig){')));
const run=data=>vm.runInNewContext('(function(){'+mig+'\n})',{}).call({data});
{const data={currency:{transmute:5,divine:4}};run(data);assert.deepEqual(data.currency,{transmute:17});assert.equal(data._glazeMig,1);data.currency.divine=2;run(data);assert.deepEqual(data.currency,{transmute:17,divine:2},'runs once');}
{const data={};run(data);assert.equal(JSON.stringify(data.currency),'{}');const d2={currency:{divine:'x'}};run(d2);assert.equal(JSON.stringify(d2.currency),'{}');}
// Price per action on an item = 1 + floor(crafts/2); Merge resets crafts (and pending offers)
assert.deepEqual([0,1,2,3,4,5,9,undefined,-3].map(n=>R('forgePrice')({crafts:n})),[1,1,1,1,2,2,3,1,1],'v8.1.29 price +1 every 4 crafts');
assert(/main\.grade=GRADE_NEXT\[from\];delete main\.crafts;delete main\.forgeOffers;/.test(source),'Merge resets crafts');
// Rows open by rarity only (iLv no longer gates rows)
const open=(grade,itemLevel)=>[0,1,2,3,4,5].filter(i=>R('forgeLineOpen')({baseId:'test',grade,itemLevel,affixes:[]},i)).length;
for(const lv of [1,11,12,25,60])assert.deepEqual(['common','rare','epic','legend','mythic','ancient','divine'].map(g=>open(g,lv)),[1,2,3,3,4,5,6],'v8.0.87 +1 row per new tier');
// 3-choice offer: distinct mods from the row pool, fewer only if the pool is smaller
{const it={baseId:'test',slot:'weapon',grade:'divine',itemLevel:40,affixes:[]};let bad=0,rows=new Set();for(let i=0;i<4000;i++){const m=R('forgeRollMod')(it,5);if(m.bad){bad++;assert(m.tiers[0][1]<0);}else rows.add(m.row);}assert(bad>600&&bad<1000,'~20% bad: '+bad);assert(!rows.has('sustain'),'v8.0.94 weapon rolls attack mods only');for(const sl of ['weapon','gloves','armor','boots'])assert.equal(R('forgePool')({baseId:'test',slot:sl,grade:'divine',itemLevel:40,affixes:[]},0).length,25,sl+' 25 mods');assert.equal(R("typeof forgeRollOffer"),'undefined');assert.equal(R("forgeLines({grade:'divine',affixes:[]}).length"),6);assert.equal(R("GRADE_NEXT.legend+GRADE_NEXT.mythic+GRADE_NEXT.ancient"),'mythicancientdivine');}
// Star cap message names the current iLv and the next level that raises it
{const mod=api.affixDef('f_might'),it={baseId:'test',grade:'rare',itemLevel:1},cap=R('forgeStarCap')(it,mod),nx=R('forgeNextStarLevel')(it,mod);assert(nx>1);assert(R('forgeStarCap')({...it,itemLevel:nx},mod)>cap);assert(R('forgeStarCap')({...it,itemLevel:nx-1},mod)===cap);assert.equal(R('forgeStarCapText')(it,mod),'Max Lv '+cap+' at iLv 1 · next at iLv '+nx);
 const top={baseId:'test',grade:'legend',itemLevel:100};assert.equal(R('forgeNextStarLevel')(top,mod),0);assert(!/next/.test(R('forgeStarCapText')(top,mod)));}
// Tutorial keeps the one-time +3 Twist Cream gift and points at + Add a mod → card
assert(/Save\.addCurrency\('transmute',3\)/.test(source));assert(/\(st===3&&this\.tapZones\.find\(q=>q\.tag\?\.startsWith\('add_'\)\)\)/.test(source));assert(/\{m:\/forgeAdd\\\(\/,t:'Add a random mod! It costs 🟢 Twist Cream'\}/.test(source));
// v8.0.85 regression (owner screenshot): Forge draws its own header, so the standard header must not be drawn on top
assert(/if\(!drawHeader\)\{this\.menu\.add\(veil\?\[bg,veil\]:\[bg\]\);return;\}/.test(source),'no double header');assert(/this\._screenBg\('Forge','screen_gear_power_789','gLoadout',false\)/.test(source));
assert(/if\(!d\.enhDone\)try\{ let best=null/.test(source)&&/let result; this\.data\.enhDone=1;/.test(source),'v8.0.87 enhance tip only until the first enhance');
console.log('Forge simple: no FP, Twist Cream only, Glaze ×3 migration once, price growth, Merge reset, rarity rows, 3-choice offers, star-cap text and tutorial passed');
