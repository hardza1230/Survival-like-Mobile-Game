// v8.3.12 owner: C1 main missions = a combat situation every wave · side missions = map objects all stage (touch to start)
// Combat Director picks by stage identity × time × enemies on field (not random-only) · no enemy/boss HP scaling from player power in C1
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('game.js','utf8');
function method(name){const at=s.indexOf('  '+name+'(');assert(at>=0,name);const tail=s.slice(at+1),next=/\n  (?:async )?[A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return s.slice(at,at+1+next.index);}
const consts=s.slice(s.indexOf('const C1_COMBAT_PATTERNS='),s.indexOf('// v7.9.50 Card types unlock'));
const ctx={Math,Phaser:{Utils:{Array:{Shuffle:a=>a}},Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}},STAGES:[{waves:5,miniAt:2},{waves:5,miniAt:2},{waves:5,miniAt:2},{waves:5,miniAt:2},{waves:5,miniAt:2}],
  Save:{power:()=>9999},stageRecommendedPower:()=>100};
vm.createContext(ctx);
vm.runInContext(consts.replace(/^const /gm,'var ')+'\nclass G{'+['c1SideDeck','c1SituationFor','chapterCombatPatternScore','chapterCombatPick','getPowerGuide','bossHpMul'].map(method).join('\n')+'\n}\nthis.G=G;',ctx);
const {C1_SITUATIONS,C1_SIDE_EVENTS,C1_COMBAT_PATTERNS}=ctx;
// every C1 stage: 4 situations (waves 1,2,4,5), valid patterns + goals, readable hint
const formation=method('chapterCombatFormation');
assert.equal(C1_SITUATIONS.length,15);   /* v8.3.23 all 15 story stages */
for(const row of C1_SITUATIONS){assert.equal(row.length,4);for(const x of row){assert(['pack','leader','dodge'].includes(x.goal),x.name);assert(x.hint.length>12&&!/[฀-๿]/.test(x.hint+x.name));
  assert(x.pattern==='Last Stand'||formation.includes("'"+x.pattern+"'"),x.pattern);if(x.goal==='leader')assert(['Commander','Shield Carrier'].includes(x.pattern),x.pattern);if(x.goal==='dodge')assert.equal(x.pattern,'Hazard Shift');}}
const g=new ctx.G();g.stageIndex=0;
// side objects: own stage + 1 met before (C1-1 only its own)
let deck=g.c1SideDeck(0);assert.equal(JSON.stringify(deck.map(e=>e.name)),'["Hunger Herald"]');
deck=g.c1SideDeck(3);assert.equal(deck.length,2);assert.equal(deck[0].home,3);assert(deck[1].home<3);
for(let i=0;i<5;i++)for(const e of g.c1SideDeck(i))assert(e.home<=i,'only events met before');
// situation per wave, none on the miniboss wave
assert.equal(g.c1SituationFor(0).name,'Tunnel Ambush');assert.equal(g.c1SituationFor(2),null);assert.equal(g.c1SituationFor(4).name,'Colony Swarm');
// Director: identity weight wins on an even field; full field avoids heavy patterns; last 2 never repeat
Object.assign(g,{maxLive:40,storyLiveCap:()=>40,waveDur:35,waveTimer:30});
const pick=(st,phase,room,recent=[])=>{g.stageIndex=st;return g.chapterCombatPick({recent},phase,room);};
assert.equal(pick(1,'pressure',20),'Pincer','C1-2 identity: pipes on both sides');
assert.equal(pick(0,'warm',20),'Ambush','C1-1 identity: tunnel ambush');
assert.equal(pick(0,'warm',20,['Ambush']),'Stampede','recent pattern is skipped');
g.waveTimer=5;assert(!['Commander','Fortress','Pincer','Last Stand'].includes(pick(3,'escalation',4)),'crowded field → light pattern');
g.waveTimer=5;assert(['Commander','Fortress'].includes(pick(3,'escalation',36)),'empty field late → heavy identity pattern');
assert.equal(pick(0,'escalation',20,[]).length>0,true);
g.stageIndex=3;assert.equal(g.chapterCombatPatternScore('Hazard Shift','escalation',.5,false)>0,true);g.stageIndex=0;assert.equal(g.chapterCombatPatternScore('Hazard Shift','escalation',.5,false),0,'stage minimum still applies');
// no HP/damage scaling from player power or level in C1 continuous combat
g._v83Run=true;g.level=30;let pg=g.getPowerGuide(3);assert.equal(pg.enemyHp,1);assert.equal(pg.enemyDmg,1);g._powerGuide=pg;assert.equal(g.bossHpMul(),1);
g._v83Run=false;g._powerGuide=null;pg=g.getPowerGuide(3);assert(pg.enemyHp>1,'other modes keep their old rule');
// wiring
assert(s.includes('this.startChapterSituationWave?.(w);'));assert(s.includes('else this.tickChapterSideObjects(d);'));
assert(!/d\.nextEvent=w===1\|\|w===3/.test(s),'side events no longer start on a timer');
assert(s.includes("die(){this.clearChapterCombatWave?.(true);"),'objects cleaned on death');
console.log('C1 situations: 5×4 combat situations, side objects (own + met), director identity/field/time pick, no power HP scaling passed');
