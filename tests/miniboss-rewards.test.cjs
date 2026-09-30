const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
let roll=0;const C=vm.runInNewContext('class Scene{'+['miniChestTier'].map(method).join('\n')+'\n}Scene',{Math:{random:()=>roll}});
const s=new C();for(const [r,t] of [[0,'bronze'],[.6999,'bronze'],[.7,'silver'],[.9499,'silver'],[.95,'gold'],[.999,'gold']]){roll=r;s.stageDiff=5;s._miniFight={hits:0,t0:0};assert.equal(s.miniChestTier(),t);}
const collect=method('collectChest');assert(collect.includes('openPrizeWheel'));assert(collect.includes("if(finalTier==='gold')this.openMysteryCards(after)"));assert(collect.includes('this.grantMiniChestBonus(finalTier)'));assert(collect.includes('this.offerRelic()'));assert(!collect.includes('openRollBox'));assert(!collect.includes('relicSlotsLeft()<=0'));assert(!source.includes('tickJackpotEvent('));
console.log('Miniboss rewards: random tier boundaries, restored wheel/Gold cards/bonuses, Relic-only final reward and no full-slot blocking passed');
