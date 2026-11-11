// v8.1.84 owner (League phase 5 · Reforge): upgrade cost uses the row's currency (row1 Twist Cream · row2 Berry Jam · row3 Honey Drop · rows4–6 Star Sugar),
// Add/Remove stay Twist Cream, Recipe Ink moves one mod to an empty open row of another item (source loses it, Lv clamped to the target's iLv cap).
const assert=require('assert/strict'),vm=require('vm');const{fixture,method,source}=require('./forge-fixture.cjs');const{ctx,api}=fixture();
let writes=0;ctx.Sfx={craft(){},error(){},select(){},menuCue(){}};
const A={uid:'a',slot:'weapon',baseId:'test',grade:'epic',itemLevel:60,affixes:[{id:'f_might',line:0,v:8,t:9},{id:'f_might',line:1,v:8,t:9},{id:'f_might',line:2,v:8,t:9}]};
const B={uid:'b',slot:'weapon',baseId:'test',grade:'rare',itemLevel:1,affixes:[{id:'f_might',line:0,v:8,t:9}]};
ctx.Save={data:{currency:{transmute:10,berryjam:1,honeydrop:0,recipeink:1}},currency:k=>ctx.Save.data.currency[k]||0,spendCurrency(k,n){if((this.data.currency[k]||0)<n)return false;this.data.currency[k]-=n;return true;},save(){writes++;},
  gearItem:u=>[A,B].find(i=>i.uid===u),gearItemsForSlot:()=>[A,B]};
ctx.currencyDef=k=>({transmute:{emoji:'🟢',name:'Twist Cream'},berryjam:{emoji:'🍓',name:'Berry Jam'},honeydrop:{emoji:'🍯',name:'Honey Drop'},recipeink:{emoji:'🖋️',name:'Recipe Ink'}})[k];
const names=['_forgeItem','_forgePay','_forgeDone','forgeUpgrade','forgeRemove','forgeMoveTargets','forgeOpenMove','forgeMove'];
const Scene=vm.runInContext('class S{'+names.map(method).join('\n')+'\n}S',ctx),s=new Scene();let sel=A,banners=[];
Object.assign(s,{craftLineIndex:0,_craftContext:()=>({item:sel}),showBanner:(a,b)=>banners.push(a),buildCraftBench(){},screenFlash(){},menuToast(){}});
const C=ctx.Save.data.currency,lv=a=>vm.runInContext('tierStars',ctx)(api.affixDef(a.id),a.t);
assert(s.forgeUpgrade(0));assert.equal(C.transmute,9,'row 1 = Twist Cream');
assert(s.forgeUpgrade(1));assert.equal(C.berryjam,0,'row 2 = Berry Jam');assert.equal(C.transmute,9,'Twist Cream untouched');
assert(!s.forgeUpgrade(2));assert(/Honey Drop/.test(banners.pop()),'row 3 needs Honey Drop');assert.equal(lv(api.forgeLines(A)[2]),1);
// Move: B (rare, 2 rows, row 2 empty) can take A's row-1 mod; Lv clamps to B's iLv-1 cap
const t=s.forgeMoveTargets(A,0);assert.equal(t.length,1);assert.equal(t[0].item.uid,'b');assert.equal(t[0].line,1);
assert(s.forgeOpenMove(0));assert.equal(s._forgePanel.type,'move');
const before=lv(api.forgeLines(A)[0]);assert(before>=2);
assert(s.forgeMove('a',0,'b',1));assert.equal(C.recipeink,0,'1 Recipe Ink');assert.equal(api.forgeLines(A)[0],null,'source loses the mod');
const moved=api.forgeLines(B)[1];assert.equal(moved.id,'f_might');assert(lv(moved)<=vm.runInContext('forgeStarCap',ctx)(B,api.affixDef('f_might')),'clamped to target cap');
assert(!s.forgeMove('a',1,'b',1),'target row now full');assert(!s.forgeOpenMove(1),'no ink left');
assert(/forgeRowCur\(i\),up=forgeUpPrice\(selected,i\)/.test(source)&&/tag='mv_'\+i/.test(source),'Forge rows show the row currency and a move button');
assert(/LEAGUE_MISSIONS\.includes\(o\.type\)\)this\.leagueCurrencyDrop\?\.\(o\)/.test(source),'League missions drop row currencies');
console.log('Reforge rows: per-row upgrade currencies, Twist Cream add/remove, Recipe Ink move with iLv clamp, League drops passed');
