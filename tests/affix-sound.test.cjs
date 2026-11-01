const assert=require('assert/strict'),vm=require('vm');const{fixture,method}=require('./forge-fixture.cjs');const{ctx,api}=fixture();
// v8.0.83 Simple Forge: Add = pick 1 of 3 offered mods (★1) · Upgrade = +1 ★ · Remove free (double tap) · one currency, price 1+floor(crafts/2) · no Forge Points / lucky
let events=[],writes=0,rnd=.99,now=1000;ctx.Math=Object.assign(Object.create(Math),{random:()=>rnd});ctx.Date={now:()=>now};ctx.Sfx={craft:k=>events.push(k),error:()=>events.push('error'),select(){},back(){}};
const item={uid:'test',slot:'weapon',baseId:'test',grade:'rare',itemLevel:50,affixes:[{id:'f_might',line:0,v:8,t:9}]};
ctx.Save={data:{currency:{transmute:10}},currency:k=>ctx.Save.data.currency[k]||0,save(){writes++;}};
const names=['_forgeItem','_forgePay','_forgeDone','forgeOpenAdd','forgeAdd','forgeUpgrade','forgeRemove'];
const Scene=vm.runInContext('class S{'+names.map(method).join('\n')+'\n}S',ctx),s=new Scene();Object.assign(s,{craftLineIndex:0,_craftContext:()=>({item}),showBanner(){},buildCraftBench(){},screenFlash(){},menuToast(){}});
const L=()=>api.forgeLines(item),cash=()=>ctx.Save.data.currency.transmute,price=vm.runInContext('forgePrice',ctx),stars=a=>vm.runInContext('tierStars',ctx)(api.affixDef(a.id),a.t);
for(const k of ['FP_MAX','FP_ADD','FP_SWAP','FP_REMOVE','FP_LUCKY','gearFP','fpStarCost'])assert.equal(vm.runInContext('typeof '+k,ctx),'undefined',k+' removed');
assert.equal(price(item),1);
item.locked=true;s.forgeUpgrade(0);s.forgeRemove(0);s.forgeRemove(0);s.forgeOpenAdd(1);assert.equal(writes,0,'locked item');item.locked=false;
s.forgeUpgrade(0);assert.deepEqual(events,['reroll']);assert.equal(cash(),9,'upgrade costs 1 Twist Cream');assert.equal(L()[0].id,'f_might');assert.equal(stars(L()[0]),2);assert.equal(item.crafts,1);
events=[];assert.equal(s.forgeRemove(0),false,'first tap only arms');assert(L()[0]);now+=500;assert.equal(s.forgeRemove(0),true);assert.equal(L()[0],null);assert.equal(cash(),9,'remove is free');assert.equal(item.crafts,1,'remove is not a craft');
now+=500;s.forgeRemove(1);now+=4000;s.forgeRemove(1);assert.equal(L()[1],null,'empty row: nothing to remove');
// Add: 3 distinct offered mods from the row pool; reopening shows the same offer; tap = buy at ★1
s.forgeOpenAdd(0);const offer=item.forgeOffers[0];assert.equal(offer.length,3);assert.equal(new Set(offer).size,3);assert.equal(JSON.stringify(s._forgePanel),'{"type":"offer","line":0}');
for(const id of offer)assert(api.forgePool(item,0).some(m=>m.id===id));s._forgePanel=null;s.forgeOpenAdd(0);assert.equal(item.forgeOffers[0],offer,'offer persists (no free reroll)');
const outside=api.forgePool(item,0).find(m=>!offer.includes(m.id));assert.equal(s.forgeAdd(0,outside.id),false,'only offered mods');assert.equal(cash(),9);
assert(s.forgeAdd(0,offer[1]));assert.equal(L()[0].id,offer[1]);assert.equal(stars(L()[0]),1,'new mods start at ★1');assert.equal(cash(),8,'crafts=1 → price 1');assert.equal(item.crafts,2);assert(!item.forgeOffers[0],'offer used up');
// Price grows: 1 + floor(crafts/2)
assert.equal(price(item),2);s.forgeUpgrade(0);assert.equal(cash(),6,'3rd craft costs 2');assert.equal(price(item),2);s.forgeUpgrade(0);assert.equal(cash(),4);assert.equal(price(item),3);
// Star cap by iLv: capped upgrade charges nothing and names the reason
item.itemLevel=1;const capText=vm.runInContext('forgeStarCapText',ctx)(item,api.affixDef(L()[0].id));assert(/^Max ★\d at iLv 1( · next ★ at iLv \d+)?$/.test(capText),capText);
let ban=null;s.showBanner=(t,sub)=>ban=t+'|'+sub;events=[];const st0=stars(L()[0]);if(st0>=vm.runInContext('forgeStarCap',ctx)(item,api.affixDef(L()[0].id))){s.forgeUpgrade(0);assert.deepEqual(events,['error']);assert.equal(cash(),4);assert(/Max ★/.test(ban),ban);}
item.itemLevel=50;
// Not enough Twist Cream: error, nothing changes
ctx.Save.data.currency.transmute=0;events=[];const snap=JSON.stringify(item);s.forgeUpgrade(0);assert.deepEqual(events,['error']);assert.equal(JSON.stringify(item),snap);
const src=names.map(method).join('\n');assert(!/forgeChoice=|FP_|gearFP|divine|lucky/i.test(src),'no FP / Glaze / lucky in Simple Forge');
console.log('Simple Forge: 3-choice add, offer persistence, ★1 start, upgrade/remove, price growth, star cap and currency guards passed');
