// v8.1.99 owner: book opening before the lobby looked broken — the cover's last frames are empty and the page stack only appeared later, then vanished.
// The page layer now sits under the cover from the moment it opens and stays (resting frame) after the riffle, so there is never a blank gap.
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const i=src.indexOf('  bookOpeningPlus(done,reveal){'),j=src.indexOf('\n  bookOpening(done,reveal){',i);assert(i>0&&j>i);const m=src.slice(i,j);
assert(m.includes('bk.add([plate,em,cl,rf,op,mg,bs])'),'page layer is under the opening cover');
assert(/at\(2150,\(\)=>\{[^\n]*rf\.setVisible\(true\)\.setFrame\('cell0'\)/.test(m),'pages are shown as the cover starts opening');
assert(m.includes("play(rf,8,77,3400,()=>rf.setFrame('cell0'))")&&!m.includes("play(rf,8,77,3400,()=>rf.setVisible(false))"),'pages rest after the riffle instead of vanishing');
console.log('Book opening: pages under the cover, no blank gap, resting stack after the riffle passed');
