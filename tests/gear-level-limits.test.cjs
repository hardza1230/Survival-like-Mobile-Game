const assert=require('node:assert/strict'),vm=require('node:vm');
const {fixture,method,source}=require('./forge-fixture.cjs');
const {ctx,base}=fixture(),plain=x=>JSON.parse(JSON.stringify(x));
base.enh=true;base.apply=()=>{};
const limits=ctx;
for(const [level,mods,enh] of [[1,1,3],[11,1,3],[12,2,5],[24,2,5],[25,3,7],[44,3,7],[45,3,10],[60,3,10],[100,3,10]]){
  const item={itemLevel:level,slot:'weapon'};
  assert.equal(limits.affixCountCap(level),mods);
  assert.equal(limits.gearEnhanceCap(item),enh);
  for(const slot of ['weapon','armor','gloves','boots','amulet','ring'])for(let line=0;line<3;line++){
    const pool=limits.forgePool({...item,slot},line);assert.equal(pool.length>0,line<mods,`${slot} iLv${level} row${line}`);
  }
  for(const line of [-1,3,NaN,1.5,'1'])assert.equal(limits.forgePool(item,line).length,0);
  for(let i=0;i<10;i++)assert(limits.rollAffixes('legend',level,base).length<=mods);
}
let item={uid:'u',baseId:'test',slot:'weapon',grade:'rare',itemLevel:1,enhanceLv:10,implicit:{id:'i_dmg',v:6.4},affixes:[
  {id:'f_might',v:5,t:10,line:0},{id:'f_vital_dough',v:12,t:10,line:1},{id:'f_treasure_aroma',v:3,t:10,line:2}
]};
const snap=JSON.stringify(item),legacy=plain(item);
assert.equal(limits.gearActiveAffixes(item).length,1);assert.equal(limits.gearEffectiveEnhance(item),3);assert.equal(JSON.stringify(item),snap);
for(const level of [12,25])assert.equal(limits.gearActiveAffixes({...item,itemLevel:level}).length,level===12?2:3);
// Compare and equipped stats use only active rows and the effective enhancement; never erase the saved investment.
vm.runInContext(source.slice(source.indexOf('function gearBaseStats('),source.indexOf('function gearPool(')),ctx);
vm.runInContext(source.slice(source.indexOf('function gearInstanceStats('),source.indexOf('function gearCompareRows(')),ctx);
assert.deepEqual(plain(limits.gearBaseStats(item)),plain(limits.gearBaseStats({...item,enhanceLv:3})));
assert.deepEqual(plain(limits.gearInstanceStats(item)),plain(limits.gearInstanceStats({...item,enhanceLv:3,affixes:[item.affixes[0]]})));
assert.deepEqual(item,legacy);
let writes=0,randomCalls=0;
ctx.Math=Object.assign(Object.create(Math),{random(){randomCalls++;return .99;}});
ctx.enhanceOdds=()=>({success:1,brk:0,destroy:0});
const save=vm.runInContext('({'+['gearLv','enhance','ensureAffix'].map(method).join('\n')+'\n})',ctx);
Object.assign(save,{data:{gearLv:{},gearItems:[item],equippedGear:{}},gearItem:id=>id==='u'?item:null,gearBase:()=>base,save(){writes++;}});
ctx.Save=save;
assert.equal(save.gearLv('u'),3);assert.equal(save.ensureAffix('u').length,1);
assert.equal(save.enhance('u').result,'capped');assert.equal(writes,0);assert.equal(randomCalls,0);assert.equal(item.enhanceLv,10);
for(const [level,cap] of [[1,3],[12,5],[25,7],[45,10]]){
  item.itemLevel=level;item.enhanceLv=cap-1;
  const before=writes;assert.equal(save.enhance('u').result,'success');assert.equal(item.enhanceLv,cap);
  assert.equal(writes,before+1);assert.equal(save.enhance('u').result,'capped');assert.equal(writes,before+1);
}
assert.equal(save.enhance('missing').result,'capped');
// All direct crafting routes reject locked and malformed rows before charging or changing a pending choice.
ctx.Sfx={error(){},craft(){},back(){}};
const Scene=vm.runInContext('class S{'+['_craftContext','randomCraftSelected','chooseForgeSustain','forgeKeepCurrent','autoRollToTarget','divineFocusedLine','applyGearTut'].map(method).join('\n')+'\n}S',ctx);
const scene=new Scene();Object.assign(scene,{gearSlot:'weapon',craftSelectedUid:'u',craftLineIndex:1,craftTargets:{f_vital_dough:null},setMenuScroll(){},showBanner(){},buildCraftBench(){},screenFlash(){}});
save.currency=k=>save.data.currency[k]||0;save.equippedGearItem=()=>item;save.data.currency={transmute:20,divine:20};
item.itemLevel=1;item.enhanceLv=10;
for(const line of [-1,1,2,3,1.5,'1']){
  scene.craftLineIndex=line;const balance=plain(save.data.currency),before=JSON.stringify(item);
  scene.randomCraftSelected();scene.divineFocusedLine();scene.autoRollToTarget();
  assert.deepEqual(save.data.currency,balance);assert.equal(JSON.stringify(item),before);assert(!scene._craftRolling);
}
// A pre-update paid roll on a now-locked row is retained, then refunded exactly once on keep/skip.
for(const paid of [undefined,'transmute','alt']){
  scene.craftLineIndex=1;item.forgeChoice={line:1,options:[{id:'f_vital_dough',v:12,t:10}],...(paid?{paid}:{})};
  const pending=JSON.stringify(item.forgeChoice),before=JSON.stringify(item.affixes),balance=plain(save.data.currency),refund='transmute';
  scene.chooseForgeSustain(0);assert.equal(JSON.stringify(item.forgeChoice),pending);assert.equal(JSON.stringify(item.affixes),before);
  scene.forgeKeepCurrent();assert(!item.forgeChoice);assert.equal(save.data.currency[refund],balance[refund]+1);
  const once=plain(save.data.currency);scene.forgeKeepCurrent();assert.deepEqual(save.data.currency,once);assert.equal(JSON.stringify(item.affixes),before);
}
// Valid rolls remain usable with one payment; selecting or double-tapping never charges again.
scene.craftLineIndex=0;const before=save.data.currency.transmute;scene.randomCraftSelected();assert(item.forgeChoice);assert.equal(save.data.currency.transmute,before-1);
const wallet=plain(save.data.currency);scene.chooseForgeSustain(0);assert(!item.forgeChoice);scene.chooseForgeSustain(0);assert.deepEqual(save.data.currency,wallet);
assert.equal(limits.gearActiveAffixes(item).length,1);assert.equal(item.affixes.length,3,'legacy dormant rows are retained during Power crafting');
// A stale inventory callback must not charge once the item reached its cap or disappeared.
const start=source.indexOf('can?()=>{ if(!afford){Sfx.error();'),finish=source.indexOf('this.buildMenuScreen(); }:null',start),callback=source.slice(start+4,finish)+'this.buildMenuScreen(); }';
for(const current of [null,{itemLevel:1,enhanceLv:3},{itemLevel:1,enhanceLv:2}]){
  let charges=0;const cbctx={afford:true,lv:1,cost:3,selected:{uid:'u'},gearEnhanceCap:limits.gearEnhanceCap,gearEffectiveEnhance:limits.gearEffectiveEnhance,Save:{gearItem:()=>current,spendShards(){charges++;return true;}},Sfx:{error(){}}};
  const cb=vm.runInNewContext('(function(){return '+callback+';})',cbctx).call({buildMenuScreen(){},showBanner(){}});cb();assert.equal(charges,0);
}
// First Forge lesson: gift once, Equipment opens Power, stale locked focus recovers, then one paid roll.
Object.assign(save.data,{gearTut:2,stageMastery:{0:true,1:true},settings:{noRuby:true}});
save.data.currency.transmute=0;save.addCurrency=(key,n)=>save.data.currency[key]=(save.data.currency[key]||0)+n;
Object.assign(scene,{state:'menu',menuScreen:'gear',W:360,H:780,time:{delayedCall(){}},menuToast(){},drawSpotlight(){},menu:{add(){}},add:{container:()=>({add(){}}),text:()=>({setOrigin(){return this;}})}});
ctx.selected=item;ctx.sel='weapon';
const craftStart=source.indexOf('canCraft?()=>{this.gearSlot=sel;'),craftEnd=source.indexOf(':null,canCraft?',craftStart);
const craftFn=vm.runInContext('(function(){return '+source.slice(craftStart+'canCraft?'.length,craftEnd)+';})',ctx).call(scene);
scene.buildMenuScreen=()=>{};
const craftZone=()=>({x:0,y:0,w:120,h:40,fn:craftFn});scene.tapZones=[craftZone()];scene.applyGearTut();assert.equal(save.data.currency.transmute,3);
scene.tapZones=[craftZone()];scene.applyGearTut();assert.equal(save.data.currency.transmute,3,'tutorial gift is granted once');
scene.craftLineIndex=1;scene.tapZones[0].fn();assert.equal(save.data.gearTut,3);assert.equal(scene.craftLineIndex,0);assert.equal(scene.menuScreen,'craft');
scene.craftLineIndex=2;scene.tapZones=[];scene.applyGearTut();assert.equal(scene.craftLineIndex,0);assert.equal(save.data.currency.transmute,3);
scene.tapZones=[{x:0,y:0,w:120,h:44,fn:()=>scene.randomCraftSelected()}];scene.applyGearTut();scene.tapZones[0].fn();assert.equal(save.data.gearTut,4);assert(item.forgeChoice);assert.equal(item.forgeChoice.line,0);assert.equal(save.data.currency.transmute,2);
scene.chooseForgeSustain(0);assert(!item.forgeChoice);assert.equal(save.data.currency.transmute,2);
console.log('Gear level limits: unlock boundaries, effective legacy stats, direct enhance/craft guards, paid-choice refunds and stale callbacks passed');
