// v7.7.6 Titan Rage: base max 3; Rage IV unlocks only after Chocolate clears a Delve boss at Depth 15+ (pact heat 3).
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),s=fs.readFileSync('game.js','utf8');
const pick=(a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);assert(i>=0&&j>i,a);return s.slice(i,j);};
const ctx={Save:{data:{}}};vm.createContext(ctx);
vm.runInContext(pick('function pactBestChar(','function egCharKey')+';this.f=titanRage4Unlocked;',ctx);
const m=/  titanMaxLv\(\)\{[^\n]*\}/.exec(s);assert(m,'titanMaxLv');const titanMaxLv=vm.runInContext('(function(){return {'+m[0].replace(/\/\/.*$/,'')+'}})()',ctx).titanMaxLv;
assert.equal(titanMaxLv(),3,'fresh save is Rage III');
ctx.Save.data.pactBestChar={cocoa:2,momo:9};assert.equal(titanMaxLv(),3,'depth 10 or other heroes do not count');
ctx.Save.data.pactBestChar.cocoa=3;assert.equal(titanMaxLv(),4,'depth 15 with Chocolate unlocks Rage IV');
assert(/ch==='cocoa'&&pb<TITAN_RAGE4_HEAT&&heat>=TITAN_RAGE4_HEAT/.test(s),'milestone banner wired');
assert(/lv>0&&lv>=this\.titanMaxLv\(\)&&this\.ptv\('rage4'\)/.test(s),'Rage Overflow follows max Rage');
console.log('Titan Rage IV unlock: base 3, Delve Depth 15 Chocolate-only unlock, banner and capstone wired passed');
