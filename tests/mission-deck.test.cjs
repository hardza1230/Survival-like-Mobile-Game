// v8.2.6 owner: every stage = its own mission + cards drawn from one shared deck (no repeats until the deck is used up); C1-1 first play keeps the lesson plan; cards are dealt before the stage
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=re=>{const m=src.match(re);assert(m,'missing '+re);return m[0];};
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const ctx={Save:{data:{}},storyCleared:()=>0,Math};vm.createContext(ctx);
vm.runInContext(grab(/const WAVE_OBJECTIVES = \{[\s\S]*?\n\};/)+grab(/const CH1_EARLY_WAVE_PLAN=\{[\s\S]*?\n\};/)+grab(/function earlyWaveMission[^\n]*\n/)+grab(/const MISSION_HOME=[^\n]*\n/)+grab(/const C1_LATER_LEAGUE=[^\n]*\n/)+grab(/const MISSION_DECK=[^\n]*\n/)+grab(/const MISSION_TIER=[^\n]*\n/)+
 'this.STAGES=Array.from({length:15},(_,i)=>({waves:5,miniAt:2,lead:["hungerHerald","hungersMouth","grandmasPot","frozenPantry","grandmasGolem","defendNectar","cleanAir","creepingRoots","seasonCycle","breakRoots","seedRift","shakeTrees","mirrorPath","vaultAltar","lastLight"][i]}));'+
 'class K{'+['missionDeckPool','missionDeckDraw','missionDeckDeal','missionDeckSort','missionDealReroll','c1FirstPool'].map(meth).join('\n')+' missionRoamArt(){}};this.K=K;this.WO=WAVE_OBJECTIVES;',ctx);
const s=new ctx.K(),D=ctx.Save.data;
// C1-1 first play: lesson plan with the Herald
s.stageIndex=0;let d=s.missionDeckDeal();assert(d.plan);assert.strictEqual(JSON.stringify(d.waves),JSON.stringify({0:'fill',1:'survive',3:'hungerHerald',4:'hunt'}));
// C1-1 replay: Herald first + 3 deck cards, no repeats inside the stage
D.stageMastery={0:1};d=s.missionDeckDeal();assert(!d.plan);assert.strictEqual(d.waves[0],'hungerHerald');const v=Object.values(d.waves);assert.strictEqual(new Set(v).size,4);assert(!v.includes(undefined));
// Chapter 1 first play: later-league missions are not leads nor drawn
s.stageIndex=1;d=s.missionDeckDeal();assert(!Object.values(d.waves).includes('hungersMouth'),'C1-2 first play: no Mouth');
// deck cycles: with everything unlocked, 12 draws never repeat until the pool is used up
D.stageMastery={};for(let i=0;i<15;i++)D.stageMastery[i]=1;s.stageIndex=10;D.missionDeck=null;const pool=s.missionDeckPool();
assert(!pool.includes('seedRift')&&!pool.includes('seasonCycle')&&!pool.includes('ultimatum'),'pool skips own lead, Seasonal and Delve');
const seen=[];for(let k=0;k<pool.length;k++)seen.push(...s.missionDeckDraw(1,[]));assert.strictEqual(new Set(seen).size,pool.length,'one full cycle without repeats');
const nxt=s.missionDeckDraw(1,[])[0];assert(pool.includes(nxt)&&!seen.slice(-4).includes(nxt),'new cycle avoids the last 4');
// unseen missions come first
D.missionDeck=null;D.missionLog={};for(const t of pool)D.missionLog[t]=1;delete D.missionLog.mirrorPath;assert.strictEqual(s.missionDeckDraw(1,[])[0],'mirrorPath');
// general missions are only 5 of the pool now
assert.strictEqual(pool.filter(t=>['fill','survive','hunt','purge','capture'].includes(t)).length,5);assert(pool.length>=15);
// wiring
assert(/this\._missionDeal=MISSION_DECK&&!this\.riftMode/.test(src)&&/missionDealShow\(this\._missionDeal/.test(src),'stage start deals cards');
assert(/this\.stageIndex=idx; this\._skinTagFor=null; this\._missionDeal=null;/.test(src),'deal reset on every stage start');
assert(/dealT\?dealT:planned/.test(src),'waves use the dealt cards');
assert(/missionDeckDraw\(1,new Set\(\['survive','fill',stL\]\)\)/.test(src),'replay bounties draw from the deck');
console.log('mission-deck ok');
