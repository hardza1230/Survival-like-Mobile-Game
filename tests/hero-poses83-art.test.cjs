// v8.2.12 art order 83: hurt (4f) + victory (8f) hero sheets incl. Festival skins — packed, registered hero-lazy, hooked with fallbacks
const fs=require('fs'),crypto=require('crypto'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const M=JSON.parse(fs.readFileSync(__dirname+'/../assets/incoming/hero_poses83/MANIFEST.json','utf8'));
assert.equal(M.length,18);
for(const r of M){ const b=fs.readFileSync(__dirname+'/../assets/incoming/hero_poses83/'+r.file); assert.equal(b.length,r.bytes,r.key); assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);
  const w=fs.readFileSync(__dirname+'/../assets/art/hero_poses83/'+r.key+'.webp'); assert.equal(w.slice(0,4).toString(),'RIFF',r.key);
  assert(src.includes(`  ${r.key}:{url:'assets/art/hero_poses83/${r.key}.webp',frame:128},`),'registered '+r.key);
  assert(r.runSheetHeightRatio>.94&&r.runSheetHeightRatio<1.06,'body height like the run sheet '+r.key); }
assert(/return \/\\\/\(\?:hero_poses83\|hero_motion823\|/.test(src),'hero-lazy (not boot)');
assert(src.includes("const hk='char_'+this.character+'_hurt'; if(frame===CF.hurt&&this.character!=='cocoa'&&this.textures.exists(hk))"),'hurt sheet for every hero, fallback CF.hurt');
assert(src.includes("if(this.player.texture.key==='char_'+this.character+'_hurt'){"),'hurt frames advance');
assert(src.includes("frame===CF.cheer&&!this._uqWind&&this.textures?.exists?.('char_'+this.character+'_victory')){ this.bpPose('char_'+this.character+'_victory',1); return; }"),'victory pose on cheer');
assert(src.includes("heroKey=this.textures.exists('char_'+this.character+'_victory')?'char_'+this.character+'_victory':'char_'+this.character;"),'result screen uses the victory sheet, fallback cheer frame');
console.log('Hero poses 83 art passed');
