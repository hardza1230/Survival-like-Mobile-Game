// v8.3.33 owner: Archero-2 style gear — mods come with the item, Sugar + Twist Cream upgrade without failure, +4%/level on base and mods, merge adds a mod, Forge closed
const assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,source}=require('./forge-fixture.cjs'),{ctx,base}=fixture({simple:true});
require('node:vm').runInContext(source.slice(source.indexOf('function enhanceOdds('),source.indexOf('return {success:t[0],brk:t[1],destroy:t[2]}; }')+46),ctx);
const caps={common:10,rare:15,epic:20,legend:25,mythic:30};
for(const [g,c] of Object.entries(caps))assert.equal(ctx.gearEnhanceCap({grade:g,itemLevel:1,baseId:'test'}),c,g+' cap by rarity, not iLv');
for(let l=0;l<30;l++){const o=ctx.enhanceOdds(l);assert.equal(o.success,1);assert.equal(o.brk+o.destroy,0);}
assert.deepEqual(JSON.parse(JSON.stringify(ctx.gearUpCost(0))),{sugar:40,cream:1});assert.deepEqual(JSON.parse(JSON.stringify(ctx.gearUpCost(9))),{sugar:400,cream:4});assert.deepEqual(JSON.parse(JSON.stringify(ctx.gearUpCost(19))),{sugar:800,cream:7});
for(const [g,n] of [['common',1],['rare',2],['epic',3],['legend',3]])for(const L of [1,5,30])assert.equal(ctx.rollAffixes(g,L,base).length,n,g+' iLv'+L+' drops with its rarity mods');
const it={uid:'u',baseId:'test',slot:'weapon',grade:'rare',itemLevel:30,enhanceLv:0,affixes:[{id:'f_might',v:10,t:5,line:0},{id:'f_vital_dough',v:50,t:5,line:1}]};
assert.equal(ctx.gearActiveAffixes(it)[0].v,10);it.enhanceLv=10;assert.equal(ctx.gearActiveAffixes(it)[0].v,14,'+40% at +10');assert.equal(it.affixes[0].v,10,'saved value untouched');
const empty={uid:'e',baseId:'test',slot:'weapon',grade:'epic',itemLevel:20,affixes:[]};assert.equal(ctx.gearFillLines(empty),3);assert.equal(ctx.forgeLines(empty).filter(Boolean).length,3);assert.equal(ctx.gearFillLines(empty),0,'never overwrites');
const g=fs.readFileSync('game.js','utf8');
assert(g.includes("el=gearEffectiveEnhance(item),enhance=1+(GEAR_SIMPLE?GEAR_LV_PCT:.12)*el;"),'base stats +4%/level');
assert(g.includes("if(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE&&GEAR_CUR_TO_CREAM[k]){ n=n*GEAR_CUR_TO_CREAM[k]; k='transmute'; }"),'Star Sugar / Recipe Ink rewards become Twist Cream');
assert(g.includes("&&!this.data.gearSimple1){")&&g.includes('gearFillLines(it)'),'one-time save migration');
assert(g.includes("if(typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE)gearFillLines(main);")&&g.includes('  autoMergeAll(){'),'merge rolls a new mod; auto-merge');
assert(g.includes("'⬆ Upgrade +'+(lv+1)+' 🍬'+uc.sugar+' 🟢'+uc.cream")&&g.includes("Save.spendCurrency('transmute',uc.cream)"),'upgrade button spends Sugar + Twist Cream');
assert(g.includes("&&!((typeof GEAR_SIMPLE!=='undefined'&&GEAR_SIMPLE)&&r[0]==='craft')"),'Forge tile hidden');
console.log('Gear 8.3.33: rarity caps, no failure, cost curve, rarity mods at drop, +4%/level mods, fill lines, currency conversion, auto-merge, Forge closed passed');
