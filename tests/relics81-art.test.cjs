// v8.1.151 order 81: Relic 8 · Modifier 36 · Trade-off 5 icons — MANIFEST-verified, packed WebP, stage-lazy, modCard/tradeCard use them with the weapon icon as fallback. Yuzu portrait cards stay unpacked (owner).
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.js'),'utf8');
const rows=JSON.parse(fs.readFileSync(path.join(root,'assets/incoming/relics81/MANIFEST.json'),'utf8')); assert.equal(rows.length,52);
let icons=0;
for(const r of rows){ const b=fs.readFileSync(path.join(root,'assets/incoming/relics81',r.file)); assert.equal(b.length,r.bytes,r.file); assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.file);
  const url='assets/art/relics81/'+r.key+'.webp';
  if(r.key.startsWith('pathcard80_')){ assert(!fs.existsSync(path.join(root,url)),'Yuzu portrait cards not packed'); assert(!src.includes(url)); continue; }
  const w=fs.readFileSync(path.join(root,url)); assert.equal(w.slice(0,4).toString(),'RIFF'); assert.equal(w.slice(8,12).toString(),'WEBP'); assert(src.includes(r.key+":'"+url+"'"),'registered '+r.key); icons++; }
assert.equal(icons,49);
assert(src.includes("if(/assets\\/art\\/relics8[18]\\//.test(u))return 'stage';"),'stage class, not boot');
assert(src.includes("map(m=>'mod_'+m.id.slice(2))"),'stage loads the current hero modifiers');
assert(src.includes("iconKey:this.textures?.exists?.('mod_'+m.id.slice(2))?'mod_'+m.id.slice(2):SKILL_ICON["),'modCard icon with fallback');
assert(src.includes("iconKey:this.textures?.exists?.('trade_'+t.id.slice(2))?'trade_'+t.id.slice(2):SKILL_ICON["),'tradeCard icon with fallback');
const M=src.slice(src.indexOf('const MODIFIERS={'),src.indexOf('const TRADEOFFS='));
for(const m of M.matchAll(/id:'[a-z]_([a-zA-Z]+)'/g))assert(fs.existsSync(path.join(root,'assets/art/relics81/mod_'+m[1]+'.webp')),'mod icon '+m[1]);
console.log('Order 81: 49 icons packed, stage-lazy, Modifier/Trade-off icons with fallback passed');
