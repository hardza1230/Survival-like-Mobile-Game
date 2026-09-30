const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
let roll=0;const C=vm.runInNewContext('class Scene{'+['miniChestTier','tickJackpotEvent'].map(method).join('\n')+'\n}Scene',{Math:{random:()=>roll}});
const s=new C();for(const [r,t] of [[0,'bronze'],[.6999,'bronze'],[.7,'silver'],[.9499,'silver'],[.95,'gold'],[.999,'gold']]){roll=r;s.stageDiff=5;s._miniFight={hits:0,t0:0};assert.equal(s.miniChestTier(),t);}
Object.assign(s,{state:'play',mode:'wave',openMysteryCards(){this.events=(this.events||0)+1;}});roll=.149;assert(!s.tickJackpotEvent(59));assert(s.tickJackpotEvent(1));assert.equal(s.events,1);assert(!s.tickJackpotEvent(999));
s._jackpotEventRolled=false;s._jackpotEventTime=0;s.state='levelup';assert(!s.tickJackpotEvent(70));assert.equal(s._jackpotEventTime,0);s.state='play';roll=.15;assert(!s.tickJackpotEvent(60));assert(s._jackpotEventRolled);assert.equal(s.events,1);
const collect=method('collectChest');assert(collect.includes("if(kind==='mini'){this.offerRelic();return;}"));assert(!collect.includes('openPrizeWheel'));assert(!collect.includes('openMysteryCards'));assert(!collect.includes('openRollBox'));assert(collect.indexOf('relicSlotsLeft()<=0')<collect.indexOf('c.setActive(false)'));
console.log('Miniboss rewards: random tier boundaries, independent Jackpot probability, one event per run, modal deferral and Relic-only/full-slot handling passed');
