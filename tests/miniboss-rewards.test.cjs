const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
let roll=0;const C=vm.runInNewContext('class Scene{'+['miniChestTier','tickJackpotEvent'].map(method).join('\n')+'\n}Scene',{Math:{random:()=>roll}});
const s=new C();for(const [r,t] of [[0,'bronze'],[.6999,'bronze'],[.7,'silver'],[.9499,'silver'],[.95,'gold'],[.999,'gold']]){roll=r;s.stageDiff=5;s._miniFight={hits:0,t0:0};assert.equal(s.miniChestTier(),t);}
const collect=method('collectChest');assert(collect.includes('openPrizeWheel'));assert(!collect.includes('openMysteryCards'));assert(collect.includes('this.grantMiniChestBonus(finalTier)'));assert(collect.includes('this.offerRelic()'));assert(!collect.includes('openRollBox'));assert(!collect.includes('relicSlotsLeft()<=0'));Object.assign(s,{state:'play',mode:'wave',openMysteryCards(){this.events=(this.events||0)+1;}});roll=.149;assert(!s.tickJackpotEvent(59));assert(s.tickJackpotEvent(1));assert.equal(s.events,1);assert(!s.tickJackpotEvent(999));
s._jackpotEventRolled=false;s._jackpotEventTime=0;s.state='levelup';assert(!s.tickJackpotEvent(70));assert.equal(s._jackpotEventTime,0);s.state='play';roll=.15;assert(!s.tickJackpotEvent(60));assert(s._jackpotEventRolled);assert.equal(s.events,1);
console.log('Miniboss rewards: random tier boundaries, wheel/bonuses, independent Jackpot event, Relic-only final reward and no full-slot blocking passed');
// Reproduce repeated physics overlaps, including callbacks triggered during collection.
const ChestScene=vm.runInNewContext('class Scene{'+['collectChest','closeLevelUp'].map(method).join('\n')+'\n}Scene',{Sfx:{clear(){},card(){}},Math});
function chest(kind='mini',mimic=false){return {active:true,visible:true,rewardKind:kind,_mimic:mimic,_tier:'gold',x:1,y:2,body:{enable:true,stop(){}},setActive(v){this.active=v;return this;},setVisible(v){this.visible=v;return this;}};}
const cs=new ChestScene();let wheel=0,bonus=0,relic=0,cards=0,clears=0,mimics=0;const delayed=[];
Object.assign(cs,{state:'play',pendingLvl:0,tweens:{killTweensOf(){}},hidePickupCue(){},clearMimicCue(){},burst(){},screenFlash(){},showBanner(){},grantMiniChestBonus(){bonus++;},offerRelic(){relic++;return false;},openLevelUp(){cards++;},onStageClear(){clears++;},awakenMimic(){mimics++;},openPrizeWheel(t,done){wheel++;this.collectChest(null,current);done(t);},lvlUp:{setVisible(){}},physics:{resume(){}},time:{delayedCall(ms,fn){delayed.push(fn);}}});
let current=chest();cs.collectChest(null,current);for(let i=0;i<20;i++)cs.collectChest(null,current);assert.equal(wheel,1);assert.equal(bonus,1);assert.equal(relic,1);assert.equal(cards,0);assert(!current.active);assert(!current.body.enable);
current=chest('mini',true);cs.collectChest(null,current);cs.collectChest(null,current);assert.equal(mimics,1);assert.equal(wheel,1);
current=chest('pick');cs.collectChest(null,current);cs.collectChest(null,current);assert.equal(cards,1);assert.equal(cs.pendingLvl,1);
current=chest(null);cs.collectChest(null,current);assert.equal(cards,1);
cs._chestReward=true;cs.closeLevelUp();delayed.forEach(fn=>fn());assert.equal(clears,0);assert.equal(cs.pendingLvl,0);assert.equal(cs.state,'play');
assert(!method('closeLevelUp').includes('onStageClear'));assert(method('killEnemy').includes("if(isBoss){"));
console.log('Chest regression: repeated/reentrant overlaps, Mimic, field card, unknown kind and no premature stage clear passed');
