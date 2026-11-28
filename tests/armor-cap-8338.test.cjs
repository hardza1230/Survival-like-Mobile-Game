// v8.3.38 owner bug: "heroes stop dying while standing still" — Hard Shell armor had no cap (×2.6 at Divine +40, mods may repeat)
const assert=require('node:assert/strict'),fs=require('node:fs'),s=fs.readFileSync('game.js','utf8');
assert(s.includes('const FORGE_ARMOR_CAP=100,DMG_TAKEN_FLOOR=.3,FORGE_HP_CAP=150,'));
assert(s.includes("if(n===14){const have=p._forgeArmor||0,add=Math.max(0,Math.min(v,FORGE_ARMOR_CAP-have));p._forgeArmor=have+add;p.armor=(p.armor||0)+add;}"),'Hard Shell armor capped like Vital Dough HP');
assert(s.includes('p.forgeMods={};p._forgeHp=0;p._forgeArmor=0;'),'cap resets every applyMeta');
assert(s.includes("const _raw=dmg; dmg*=armorDamageMultiplier(this.player)")&&s.includes("if(typeof DMG_TAKEN_FLOOR==='number')dmg=Math.max(dmg,_raw*DMG_TAKEN_FLOOR);"),'armor/talents/gear can remove at most 70% before Forge DR and barrier');
assert(s.includes("add('build',{tag:'sesame.runes@'+st")||fs.readFileSync('scripts/qa-bots.cjs','utf8').includes("tag:'sesame.runes@'+st"),'Sesame in nightly bots');
console.log('Armor cap 8.3.38: forge armor cap 100, damage floor 30%, Sesame bot passed');
