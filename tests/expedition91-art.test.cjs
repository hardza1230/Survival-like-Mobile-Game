// v8.2.33 wire art order 91 (Temple Expedition: back-view heroes, front titans/bosses, deep backgrounds, hit FX, icons) · menu-lazy on the dig screen · fallbacks kept
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'game.js'),'utf8');
const M=JSON.parse(fs.readFileSync(path.join(root,'assets/incoming/expedition91/MANIFEST.json')));assert.equal(M.length,13);
for(const r of M){const buf=fs.readFileSync(path.join(root,'assets/incoming/expedition91',r.file));assert.equal(crypto.createHash('sha256').update(buf).digest('hex'),r.sha256,r.key);
  const w=fs.readFileSync(path.join(root,'assets/art/expedition91',r.key+'.webp'));assert.equal(w.slice(8,12).toString(),'WEBP',r.key);assert(src.includes("assets/art/expedition91/"+r.key+".webp'"),'registered '+r.key);}
assert(src.includes("patrol70|atlas89|expedition91"),'menu-lazy');assert(src.includes("(s==='dig'?'|assets/art/expedition91/':'')"),'loads with the Expedition screen');
for(const h of ["const tk=X.boss?'ex91_bosses':'ex91_titans';","else if(this.textures.exists('pt_foes'))","bgk='ex91_bg_c'+(ch+1)","else if(!this.patrolScene?.(ch,fx,top,fw,fh,gy))","bk='ex91_back_'+hc","else if(this.textures.exists(hk))","'ex91_hit_a'","'ex91_icons',0"])assert(src.includes(h),h);
console.log('Order 91 Expedition art: 13 WebP, menu-lazy, titans/bosses/back heroes/backgrounds/hit/icons with fallbacks passed');
