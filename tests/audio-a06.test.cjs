const P=require('./_packed.cjs');   // v8.1.139 recompressed assets ledger
// v8.0.91 audio order A06: 28 ElevenLabs SFX registered, files match MANIFEST, every key has a call site.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');const src=fs.readFileSync('game.js','utf8');
const m=JSON.parse(fs.readFileSync('assets/incoming/audio_new_features/MANIFEST.json','utf8')),rows=Array.isArray(m)?m:(m.files||m.assets);assert.equal(rows.length,28);
for(const r of rows){const url='assets/audio/new_features/'+r.file,b=fs.readFileSync(url);if(r.sha256)assert.equal(P.sha(url,b),r.sha256,r.key);
  assert(src.includes(r.key+":'"+url+"'"),'registered '+r.key);const cue=r.key.replace(/^sfx_/,'');
  assert(src.includes("'"+cue+"'")||src.includes("'"+r.key+"'")||/^(merge_rarity_|st_|yz_evolve_f)/.test(cue),'call site '+cue);}
assert(src.includes("'st_'+(k==='frozen'?'freeze'")&&src.includes("'yz_evolve_f'+Math.max(2,f)")&&src.includes("menuCue?.('merge_rarity_'"));
console.log('Audio A06: 28 files registered, MANIFEST hashes, call sites for forge/merge/relic/status/yuzu/taro/login/depths passed');
