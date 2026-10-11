// v7.6 Unique อัปได้ที่ Talent เท่านั้น: โหนด Core 'unique' (TP 3/5/8, ไม่ต้องปลดก่อน) · เริ่มด่านที่เลเวลตาม Talent · ไม่อัปอัตโนมัติตามเลเวลในด่าน
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const CHAR_TALENTS = {'),b=src.indexOf('// v4.88: Passive');let tal={};
const ctx={UNIQUE_MAX_LV:4,Save:{cp:()=>({tal})}};vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.R={charTalents,UNIQUE_TALENT,uniqueTalentLevel,talSpent,CHAR_TALENTS};',ctx);const R=ctx.R;
for(const h of Object.keys(R.CHAR_TALENTS)){const d=R.charTalents(h);assert.equal(d.at(-1).id,'unique',h+' has Unique Mastery');assert.equal(d.filter(x=>x.id==='unique').length,1);}
assert.equal(R.UNIQUE_TALENT.max,3);assert.deepEqual(R.UNIQUE_TALENT.costs,[3,5,8]);assert(R.UNIQUE_TALENT.free,'no prerequisite');
assert.equal(R.uniqueTalentLevel('momo'),1);tal={unique:2};assert.equal(R.uniqueTalentLevel('momo'),3);tal={unique:9};assert.equal(R.uniqueTalentLevel('momo'),4,'capped at UNIQUE_MAX_LV');
assert.equal(R.talSpent({unique:3}),16,'reset refunds 3+5+8 TP');assert.equal(R.talSpent({unique:1,hp:2}),3+3);
assert(!/this\.pendingLvl\+\+; \} this\.checkUniqueAutoUpgrade\(\)/.test(src),'level-up no longer auto-upgrades Unique');
assert(!/[^\w.]this\.checkUniqueAutoUpgrade\(\)/.test(src.replace(/  checkUniqueAutoUpgrade\(\)\{/,'')),'no remaining auto-upgrade calls');
assert.equal((src.match(/this\.uniqueLevel=typeof uniqueTalentLevel==='function'\?uniqueTalentLevel\(this\.character\|\|Save\.data\.character\):1;/g)||[]).length,3,'run resets use the talent level');
assert(/costN=\(n,r\)=>isPath\?talNodeCost\(n,r\):n\.costs\?n\.costs\[r\]:talCost\(r\)/.test(src)&&/n===root\|\|n\.free\|\|/.test(src),'Talents screen uses custom costs and free unlock');
console.log('Unique talent: node on every hero, TP 3/5/8, free unlock, run level from talent (cap 4), refund and no in-stage auto-upgrade passed');
