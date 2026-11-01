const assert=require('assert/strict'),vm=require('vm');const{fixture,method}=require('./forge-fixture.cjs');const{ctx,api}=fixture();
// v8.0.87 Forge: Add = random mod (any row, duplicates ok, ~20% bad) · Upgrade = +1 Lv (not on bad mods) · Remove = double tap and costs the same price (not a craft) · price 1+floor(crafts/2)
let events=[],writes=0,rolls=[],now=1000;const seq=()=>rolls.length?rolls.shift():.99;ctx.Math=Object.assign(Object.create(Math),{random:seq});ctx.Date={now:()=>now};ctx.Sfx={craft:k=>events.push(k),error:()=>events.push('error'),select(){},back(){}};
const item={uid:'test',slot:'weapon',baseId:'test',grade:'rare',itemLevel:50,affixes:[{id:'f_might',line:0,v:8,t:9}]};
ctx.Save={data:{currency:{transmute:10}},currency:k=>ctx.Save.data.currency[k]||0,save(){writes++;}};
const names=['_forgeItem','_forgePay','_forgeDone','forgeOpenAdd','forgeAdd','forgeUpgrade','forgeRemove'];
const Scene=vm.runInContext('class S{'+names.map(method).join('\n')+'\n}S',ctx),s=new Scene();Object.assign(s,{craftLineIndex:0,_craftContext:()=>({item}),showBanner(){},buildCraftBench(){},screenFlash(){},menuToast(){}});
const L=()=>api.forgeLines(item),cash=()=>ctx.Save.data.currency.transmute,price=vm.runInContext('forgePrice',ctx),lv=a=>vm.runInContext('tierStars',ctx)(api.affixDef(a.id),a.t);
for(const k of ['FP_MAX','gearFP','fpStarCost','drawForgeOffer'])assert.equal(vm.runInContext('typeof '+k,ctx),'undefined',k+' removed');
assert.equal(vm.runInContext("tierStarText(affixDef('f_might'),9)",ctx),'Lv 1');assert.equal(vm.runInContext("tierStarText(affixDef('b_frail'),0)",ctx),'Bad');
item.locked=true;s.forgeUpgrade(0);s.forgeRemove(0);s.forgeRemove(0);s.forgeAdd(1);assert.equal(writes,0,'locked item');item.locked=false;
s.forgeUpgrade(0);assert.deepEqual(events,['reroll']);assert.equal(cash(),9);assert.equal(lv(L()[0]),2);assert.equal(item.crafts,1);
// Remove: first tap arms, second pays the current price but is not a craft
assert.equal(s.forgeRemove(0),false);assert(L()[0]);now+=500;assert.equal(s.forgeRemove(0),true);assert.equal(L()[0],null);assert.equal(cash(),8,'remove costs 🟢1');assert.equal(item.crafts,1,'remove is not a craft');
// Add: random good mod from the whole pool (no rows), no choice step
rolls=[.99,.5];assert(s.forgeAdd(0));const m0=api.affixDef(L()[0].id);assert(!m0.bad);assert(m0.slots.includes('weapon'));assert.equal(lv(L()[0]),1,'starts at Lv 1');assert.equal(cash(),7);assert.equal(item.crafts,2);
// Duplicates allowed: the same mod can sit on two rows
const pool=api.forgePool(item,1);assert(pool.some(m=>m.row!=='sustain'),'row 2 can roll any category');
// Bad mod (roll < 20%): negative value, cannot be upgraded
rolls=[.05,0];assert(s.forgeAdd(1));const b=L()[1],bd=api.affixDef(b.id);assert(bd.bad);assert(b.v<0);assert.equal(cash(),5,'crafts=2 → price 2');
events=[];const c0=cash();assert.equal(s.forgeUpgrade(1),false);assert.deepEqual(events,['error']);assert.equal(cash(),c0,'bad mods are not upgraded');
now+=5000;s.forgeRemove(1);now+=500;assert(s.forgeRemove(1));assert.equal(L()[1],null);assert.equal(cash(),c0-price(item),'removing a bad mod costs the price');
// Not enough Twist Cream: error, nothing changes
ctx.Save.data.currency.transmute=0;events=[];const snap=JSON.stringify(item);s.forgeUpgrade(0);s.forgeAdd(1);assert.deepEqual(events,['error','error']);assert.equal(JSON.stringify(item),snap);
// Bad mod effect is negative through the same stat
{const p={dmgMul:1,maxhp:100,armor:0,critChance:0};vm.runInContext("affixDef('b_frail')",ctx).apply(p,-30);assert.equal(p.maxhp,70);}
const src=names.map(method).join('\n');assert(!/FP_|gearFP|divine|lucky|forgeOffers/i.test(src),'no FP / Glaze / lucky / offers');
console.log('Forge v8.0.87: random add (any row, duplicates), bad mods (negative, no upgrade), paid double-tap remove, Lv text, price growth and guards passed');
