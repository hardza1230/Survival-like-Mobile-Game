// v8.1.103 owner: Flavor Cores had no story reason → Ruby explains them once in the post-tutorial tour, before the first core upgrade.
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const L=vm.runInNewContext(/const CORE_LORE_LINES=(\[[^\]]*\]);/.exec(src)[1]);assert.equal(L.length,3);
for(const t of L){assert(!/[฀-๿\[\]]/.test(t),'English plain text');assert(t.length<120,'short page');}
assert(/Heart Seed/.test(L.join(' '))&&/Life Core/.test(L[1])&&/Flavor Spark/.test(L[1])&&/Oath Shell/.test(L[1]),'names match the three cores');
const i=src.indexOf('  applyGearTut(){'),n=/\n  [A-Za-z_]\w*\(/.exec(src.slice(i+20)),m=src.slice(i,i+20+n.index);
assert(/T==='hub'&&s==='hub'&&!this\._coreLoreDone[^\n]*this\.rubyGuide\(CORE_LORE_LINES,\(\)=>\{[^\n]*this\.applyGearTut\(\);/.test(m),'Ruby explains first, then the spotlight tour continues');
assert(m.indexOf('CORE_LORE_LINES')<m.indexOf("Use your Sugar to grow stronger"),'lore before the first spotlight');
console.log('Core lore: Ruby explains Flavor Cores once before the first upgrade spotlight passed');
