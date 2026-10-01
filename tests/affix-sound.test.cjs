const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
for(const [method,cue,currency] of [['promoteFocusedItem','capacity','regal'],['divineFocusedLine','reroll','divine'],['annulFocusedLine','remove','annul'],['scourFocusedItem','reset','scour']]){
 let wallet=10,rarity='magic',affixes=[{id:'a',v:2,t:5},{id:'b',v:3,t:5}],events=[];
 const item={uid:'test',locked:false},mod={label:'Power',fmt:v=>String(v),tiers:{5:[2,8]}};
 const context={FLAME_REROLL_COST:2,affixDef:()=>mod,Sfx:{craft:k=>events.push(k),error:()=>events.push('error')},Save:{currency:()=>wallet,spendCurrency:(key,n)=>{assert.equal(key,currency);wallet-=n;},gearAffixes:()=>affixes,setAffixes:(id,a)=>affixes=a,gearRarity:()=>rarity,setGearRarity:(id,r)=>rarity=r}};
 vm.createContext(context);const a=source.indexOf('  '+method+'(){'),b=source.indexOf('\n',a);const action=vm.runInContext('({'+source.slice(a,b)+'})',context)[method];
 const scene={_craftContext:()=>({item,base:{tier:'magic'}}),craftLineIndex:0,showBanner(){},buildCraftBench(){},screenFlash(){}};
 item.locked=true;action.call(scene);assert.equal(events.length,0);assert.equal(wallet,10);
 item.locked=false;wallet=0;action.call(scene);assert.deepEqual(events,['error']);assert.equal(wallet,0);
 events=[];wallet=10;action.call(scene);assert.deepEqual(events,[cue]);assert.equal(wallet,method==='divineFocusedLine'?8:9);
 if(cue==='capacity')assert.equal(rarity,'rare');
 if(cue==='remove')assert.equal(affixes.length,1);
 if(cue==='reset'){assert.equal(affixes.length,0);assert.equal(rarity,'common');}
 events=[];affixes=[];if(cue==='capacity')rarity='common';if(cue!=='reset'){action.call(scene);assert.equal(events.length,0);}
}
console.log('Affix sounds: saved success, costs, locked/invalid actions and resource errors passed');
