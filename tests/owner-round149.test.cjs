// v8.1.149 owner 🐞 round: Wardrobe tab while IAP is off, Great Hunger aura no longer covers the boss, soft 2-layer shadows under Yuzu companions/seedlings.
const fs=require('fs'),path=require('path'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
assert(src.includes("noIap?['wardrobe','Wardrobe']:['thread','Thread']"),'Wardrobe tab replaces the hidden Thread tab');
assert(src.includes("setAlpha(0.32).setTint(0xff3f78));b._auraIsFx=true;"),'seal aura faint');
assert(src.includes("for(let i=0;i<4;i++)b._hungerOrbs.push("),'4 orbs');
assert(src.includes(".setDepth(b.y-4).setScale((b.phase4?0.36:0.26)"),'orbs stay behind the boss');
assert(!/_hungerOrbs[^\n]*setDepth\(b\.y\+\(Math\.sin/.test(src),'orbs never in front');
assert(src.includes("fillEllipse(0,0,28,10).fillStyle(0x17111b,.18).fillEllipse(0,0,18,6)"),'seedling soft shadow');
assert(src.includes("m.shadow.fillStyle(0x160d20,.1-air*.06)"),'companion soft outer shadow');
console.log('Owner round 149: wardrobe tab, Hunger aura, Yuzu soft shadows passed');
