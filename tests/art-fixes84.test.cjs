// v8.2.13 art order 84: fixed sheets overwrite the originals; monster sheets are fallbacks only (the outlined boss_ink816 sheets on screen were never clipped), so no rescale; per-skin pose multipliers
const fs=require('fs'),crypto=require('crypto'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8'),M=JSON.parse(fs.readFileSync(__dirname+'/../assets/incoming/art_fixes84/MANIFEST.json','utf8'));
assert.equal(M.length,27);
for(const r of M){ const b=fs.readFileSync(__dirname+'/../assets/incoming/art_fixes84/'+r.file); assert.equal(b.length,r.bytes,r.key); assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);
  assert(fs.existsSync(__dirname+'/../'+r.replaces),r.replaces); assert(src.includes("'"+r.replaces+"'"),'still referenced '+r.replaces); assert(r.minMarginPx>=Math.floor(r.frameWidth*.02),'margin '+r.key); }
const r=70,s=.62,k=1/0.89844; assert(Math.abs((r/k)*(s*k)-r*s)<1e-9);
assert(/const BP_POSE_SCALE_SKIN=\{char_mint_attack__snow:1\.03,/.test(src)&&src.includes("BP_POSE_SCALE_SKIN[texture+'__'+this._skinTag]"),'per-skin multipliers');
assert(src.includes("const BP_POSE_SCALE={char_mint_attack:.91,"),'Mint attack redrawn at run height');
assert(!/ART84_SCALE/.test(src),'no monster rescale (ink sheets are what shows)');
console.log('Art fixes 84 passed');
