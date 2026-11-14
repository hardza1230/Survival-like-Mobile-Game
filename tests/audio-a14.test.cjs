// v8.1.147 audio order A14 (chest opening): sources match MANIFEST, packed MP3s exist, literal URLs, openChest uses build-up + rarity bursts with the old cues as fallback.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.js'),'utf8');
const rows=JSON.parse(fs.readFileSync(path.join(root,'assets/incoming/audio_chest_a14/MANIFEST.json'),'utf8'));
assert.equal(rows.length,8);
for(const r of rows){ const b=fs.readFileSync(path.join(root,'assets/incoming/audio_chest_a14',r.file)); assert.equal(b.length,r.bytes,r.file); assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.file);
  const url='assets/audio/sfx/chest_a14/'+r.key+'.mp3'; assert(fs.statSync(path.join(root,url)).size>1000,url); assert(src.includes("  sfx_"+r.key+":'"+url+"'"),'registered '+r.key); }
const i=src.indexOf('  openChest(c,isFree){'),m=src.slice(i,src.indexOf('\n  ',src.indexOf('\n',i+1)+1)+20000);
assert(m.includes("Sfx.orderCue?.('chest_shake_build',.5,.1)))Sfx.chest?.()"),'build-up with old chest cue as fallback');
assert(m.includes("Sfx.orderCue?.('chest_burst_'+tn,")&&m.includes("Sfx.orderCue?.('box_reveal_'+tn,"),'rarity burst with the old stinger as fallback');
assert(m.includes("'chest_confetti'")&&m.includes("it?'chest_item_land':'chest_duplicate'"),'extras');
assert(src.includes('  buildBazaar(){ this.chestSfxLoad?.();'),'preloaded in the Bazaar');
console.log('Audio A14: 8 chest sounds packed, registered and used with fallbacks passed');
