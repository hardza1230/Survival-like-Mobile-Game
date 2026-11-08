const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
// v8.1.43 order 65: 30-day Daily Login art — sources verified, packed WebP present, keys menu-lazy, old order-51 art kept as fallback
const src=fs.readFileSync('game.js','utf8'),M=JSON.parse(fs.readFileSync('assets/incoming/login30/MANIFEST.json','utf8')).assets;
assert.equal(M.length,11);
for(const r of M){const b=fs.readFileSync('assets/incoming/login30/'+r.file);assert.equal(b.length,r.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256);
  const w=fs.readFileSync('assets/art/login30/'+r.key+'.webp');assert.equal(w.toString('ascii',0,4),'RIFF');assert.equal(w.toString('ascii',8,12),'WEBP');
  assert(src.includes(`${r.key}:'assets/art/login30/${r.key}.webp'`),r.key+' url literal');assert(new RegExp('"'+r.key+'":\\[').test(src),r.key+' frame data');}
assert(/art\\\/\(\?:menu_orders\|login30\|/.test(src),'login30 is menu-lazy');
assert(src.includes("ensureGroup(k=>/^(login_|day_reward|l30_)/.test(k)"),'loaded on demand with the popup');
for(const k of ['l30_panel','l30_header','l30_ruby','l30_cell','l30_cell30','l30_today_fx','l30_reward','l30_reward30','l30_stamp','l30_button','l30_claim_burst'])assert(src.includes("'"+k+"'"),k+' used in loginPopup');
assert(src.includes("paper=l30||!!this.menuArtPanel?.('login_panel'"),'falls back to order-51 panel');assert(src.includes("||this.menuArtFx?.('login_glow'"),'falls back to old glow');
console.log('Login30 art: 11 verified sources, packed WebP, menu-lazy keys, popup hooks and order-51 fallback passed');
