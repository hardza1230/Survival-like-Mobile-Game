// v8.1.102 owner: book opening before the lobby — magic ring sits on the right-hand clasp, and the cover opens straight into the lobby
// (no page riffle / burst: a full page flashed for a moment). Lobby pieces float in softly afterwards.
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const i=src.indexOf('  bookOpeningPlus(done,reveal){'),j=src.indexOf('\n  bookOpening(done,reveal){',i);assert(i>0&&j>i);const m=src.slice(i,j);
assert(m.includes("mg=this.add.image(kx,ky,'vfx_bk_magic'"),'magic ring is placed on the clasp');
assert(m.includes('bk.add([plate,em,cl,op,mg])')&&!/\brf\b|\bbs\b|bk_page_riffle|vfx_bk_burst/.test(m),'no page riffle or burst layer');
assert(m.includes("play(op,12,100,2300,()=>{ op.setVisible(false); finish(); })"),'cover opening ends straight in the lobby');
const keys=/const BKP_KEYS=\[([^\]]*)\]/.exec(src)[1];assert(!/bk_page_riffle|vfx_bk_burst/.test(keys),'unused textures are not loaded');
const e=src.slice(src.indexOf('  menuEnterAnim(scr,n){'));assert(/if\(rise\)\{[^\n]*o\.y=y0\+34;[^\n]*ease:'Cubic\.easeOut'/.test(e),'soft rise without overshoot');
console.log('Book opening: ring on clasp, cover opens straight to the lobby, soft lobby rise passed');
