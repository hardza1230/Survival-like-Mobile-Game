// v8.2.11 owner: Relic vault info text was not centred in its frame → centred vertically whenever the text changes
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const i=src.indexOf('  drawRelicVault(');assert(i>0);const body=src.slice(i,src.indexOf('\n  /* ===== v8.1.122 เตาหลอม',i));
assert(/const centre=\(\)=>\{ const gap=id\.text\?10:0,tot=it\.height\+gap\+\(id\.text\?id\.height:0\),y0=iy\+Math\.max\(10,\(ih-tot\)\/2\); it\.setY\(y0\); id\.setY\(y0\+it\.height\+gap\); \};/.test(body));
assert.equal((body.match(/centre\(\);/g)||[]).length,2,'centred at start and on every focus');
console.log('Relic vault text centred passed');
