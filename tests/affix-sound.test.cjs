const assert=require('assert/strict'),vm=require('vm');const{fixture,method}=require('./forge-fixture.cjs');const{ctx,api}=fixture();
// v8.0.33 Forge Points: choose the mod yourself (no random roll) · Add 4 / Swap 5 / Star up n+1 / Remove 1 · 15% lucky = no points used · Merge refills
let events=[],writes=0,rnd=.99;ctx.Math=Object.assign(Object.create(Math),{random:()=>rnd});ctx.Sfx={craft:k=>events.push(k),error:()=>events.push('error'),select(){}};
const item={uid:'test',slot:'weapon',baseId:'test',grade:'rare',itemLevel:50,affixes:[{id:'f_might',line:0,v:8,t:9}]};
ctx.Save={data:{currency:{divine:10,transmute:10}},currency:k=>ctx.Save.data.currency[k]||0,save(){writes++;}};
const Scene=vm.runInContext('class S{'+['forgeAct'].map(method).join('\n')+'\n}S',ctx),s=new Scene();Object.assign(s,{craftLineIndex:0,_craftContext:()=>({item}),showBanner(){},buildCraftBench(){},screenFlash(){}});
const L=()=>api.forgeLines(item),fp=()=>vm.runInContext('gearFP',ctx)(item);
assert.equal(fp(),14,'rare = 14 Forge Points');
item.locked=true;s.forgeAct('up');assert.equal(writes,0,'locked item');item.locked=false;
s.forgeAct('up');assert.deepEqual(events,['reroll']);assert.equal(ctx.Save.data.currency.divine,9);assert.equal(fp(),12,'★1→★2 costs 2');assert.equal(L()[0].id,'f_might');assert.equal(vm.runInContext('tierStars',ctx)(api.affixDef('f_might'),L()[0].t),2);
events=[];s.forgeAct('remove');assert.equal(L()[0],null);assert.equal(fp(),11,'remove costs 1, no currency');assert.equal(ctx.Save.data.currency.transmute,10);
s.forgePick='f_might';s.forgeAct('swap');assert.equal(writes,2,'swap needs an existing mod');s.forgeAct('add');assert.equal(L()[0].id,'f_might');assert.equal(fp(),7,'add costs 4');assert.equal(ctx.Save.data.currency.transmute,9);assert.equal(s.forgePick,null);
const pool=api.forgePool(item,0),other=pool.find(m=>m.id!=='f_might');s.forgePick=other.id;s.forgeAct('swap');assert.equal(L()[0].id,other.id);assert.equal(fp(),2,'swap costs 5');
s.forgePick='f_might';events=[];s.forgeAct('swap');assert.deepEqual(events,['error'],'not enough points');assert.equal(L()[0].id,other.id);
rnd=.1;s.forgeAct('remove');assert.equal(fp(),1,'remove is never lucky');item.fp=4;s.forgePick='f_might';s.forgeAct('add');assert.equal(L()[0].id,'f_might');assert.equal(fp(),4,'lucky add keeps points');
ctx.Save.data.currency.divine=0;events=[];rnd=.99;item.fp=14;s.forgeAct('up');assert.deepEqual(events,['error'],'Glaze needed');
const src=method('forgeAct');assert(!/randomCraftSelected|autoRollToTarget|forgeChoice=/.test(src),'no random roll');
console.log('Forge Points: add/swap/star up/remove costs, lucky 15%, point and currency guards passed');
