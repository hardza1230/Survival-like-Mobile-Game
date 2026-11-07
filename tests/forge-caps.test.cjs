const assert=require('assert/strict'),vm=require('vm');const{fixture}=require('./forge-fixture.cjs');const{ctx}=fixture();
// v8.1.42 owner: stacked forge mods are capped (HP +150, damage reduction 40%, damage bonus +150%, Clean Recipe 20%); bad HP mods still subtract
const r=vm.runInContext(`(()=>{const p={maxhp:90};for(let i=0;i<10;i++)forgeApply(p,13,100);const q={maxhp:90};forgeApply(q,13,100);forgeApply(q,13,-30);return [p.maxhp,q.maxhp,FORGE_DR_CAP,FORGE_DMG_CAP,FORGE_CLEAN_CAP];})()`,ctx);
assert.deepEqual([...r],[240,160,.4,1.5,.2]);
const src=require('fs').readFileSync('game.js','utf8');assert(src.includes('amount*=1-Math.min(FORGE_DR_CAP,reduction)')&&src.includes('Math.min(FORGE_DMG_CAP,bonus)')&&src.includes('p.forgeMods={};p._forgeHp=0;'));
const roll=vm.runInContext(`(()=>{const item={slot:'amulet',itemLevel:55,affixes:[{id:'f_last_crumb',line:0,t:0,v:1}]};let dup=0;for(let i=0;i<400;i++){const m=forgeRollMod(item,1);if(m&&m.number===115)dup++;}return dup;})()`,ctx);
assert.equal(roll,0,'Last Crumb never rolls twice on one item');
console.log('Forge caps: HP +150, DR 40%, damage +150%, Clean Recipe 20%, single Last Crumb passed');
