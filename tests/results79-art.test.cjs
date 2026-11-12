// v8.1.108 art order 79: results header kit (stage-lazy) + Heart Seed illustration (menu-lazy) — sources verified, packed, registered, hooked with code fallbacks.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
const M=JSON.parse(fs.readFileSync('assets/incoming/results79/MANIFEST.json','utf8'));assert.equal(M.length,6);
for(const r of M){const b=fs.readFileSync('assets/incoming/results79/'+r.file);assert.equal(b.length,r.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);
  const out='assets/art/results79/'+r.key+'.webp',w=fs.readFileSync(out);assert.equal(w.slice(0,4).toString(),'RIFF');assert.equal(w.slice(8,12).toString(),'WEBP');assert(s.includes(r.key+":'"+out+"'"),r.key);}
assert(s.includes('"sc79_header_plate":[512,192,1,[48,40,48,40]],"sc79_star_socket":[128,128,2,null]'),'TEMPLE_UI');
assert(/if\(k\.startsWith\('core79_'\)\)return 'menu';/.test(s)&&s.includes("k.startsWith('sc79_')"),'lazy classes (never boot)');
assert(s.includes("'bv46_key','sc79_header_plate','sc79_medallion','sc79_medallion_back','sc79_rays','sc79_star_socket'"),'stage-lazy with the results art');
const d=method('summaryHeaderDeco');assert(d.includes("tuPanel?.('sc79_header_plate'")&&d.includes('fillRoundedRect(H.x,H.y,H.w,H.h,18)'),'plate + code fallback');
assert(d.includes("art('sc79_rays')")&&d.includes('fillTriangle')&&d.includes("art('sc79_medallion_back')")&&d.includes('fillCircle?.(hx,hy,r)'),'rays/medallion back + fallbacks');
const sm=method('showStageSummary');assert(sm.includes("realTex?.('sc79_medallion')")&&sm.includes("tuImg?.('sc79_star_socket',got?1:0,x-12,S.y+22,38,38)")&&sm.includes('so.fillCircle?.(x-12,S.y+22,17)'),'medallion over hero, sockets + fallback');
assert(method('rubyGuide').includes('opt.art&&this.realTex?.(opt.art)')&&method('applyGearTut').includes("art:'core79_heart_seed'")&&method('openTutorialWeave').includes("k==='core79_heart_seed'"),'Heart Seed shown in the core-lore talk, preloaded');
console.log('Order 79: 6 verified sources, WebP packed, registered, lazy, results header + Heart Seed hooks with fallbacks passed');
