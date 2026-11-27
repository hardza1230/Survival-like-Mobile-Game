// v8.3.15 owner round: kick stun 2 s, Daily targets ×1.5, Ancient perks removed, Rank Rewards drawn in code
const assert=require('node:assert/strict'),fs=require('node:fs');
const s=fs.readFileSync('game.js','utf8');
assert(/const COUNTER_STUN_SEC = 2;/.test(s),'counter stun is 2 s');
assert(!/bossStun\(bb,1\.2,/.test(s),'no counter keeps the old 1.2 s stun');
assert.equal((s.match(/bossStun\(bb,COUNTER_STUN_SEC,/g)||[]).length,6,'all 6 kicked objects use the shared stun');
assert(/  ancientHas\(id\)\{ return false; \}/.test(s),'Ancient perks have no effect');
const pool=s.slice(s.indexOf('const DQ_POOL=['),s.indexOf('const DQ_BAND='));
const T=id=>Number(new RegExp("id:'"+id+"'[^}]*target:(\\d+)").exec(pool)[1]);
assert.deepEqual(['e_kills','m_kills','h_kills','e_sugar','h_kick','e_clear','m_boss'].map(T),[180,525,1350,600,12,1,1],'targets ×1.5, single-count quests unchanged');
for(const m of pool.matchAll(/name:'[^']*?(\d+)[^']*',target:(\d+)/g))if(m[2]!=='1')assert.equal(m[1],m[2],'quest text matches its target: '+m[0]);
const a=s.indexOf('  buildRankPerks(){'),body=s.slice(a,s.indexOf('\n  jrOn(){',a));
assert(a>0&&!/ANCIENT_PERKS|Temple Depths|tuPanel|tuHeader|menuArtIcon|tuSparkle/.test(body),'Rank Rewards page: no Ancient section and no art panels');
assert(/_rrBurst/.test(body)&&/padlock/.test(body)&&/edge\(/.test(body),'Rank Rewards VFX: pick burst, locked padlock/chain, border sparkle');
// v8.3.16: C1 preview cards cannot be skipped by rapid taps; silent SFX wired
for(const k of ['cocoa_titan_leap','cocoa_flicker_step','cocoa_rage_charge','strawberry_pinball_cast','uq_shotgun_blast','uq_yuzu_crew_hit'])assert(s.includes("Sfx.bp?.('"+k+"'")||s.includes("'cocoa_titan_leap':'cocoa_flicker_step'"),k+' has a play site');
assert(s.includes("deal.preview?dealAllShown:350"),'preview deal waits for every card before a tap skips');
// v8.3.19: Berry Blast sound back, aim cone apex on the hero, C1 side objects walk-to-start without circles, events survive wave ends
assert(!s.includes("Sfx.uqReady?.('uq_shotgun_blast')"),'Berry Blast uses the original sniper fire sound');
assert(s.includes("a.setOrigin(115/512,.5).setPosition(pl.x,pl.y).setRotation(s.ang).setScale(R/264"),'aim cone starts at the hero');
assert(!s.includes('_c1SideTap=p=>')&&!s.includes('Walk here to start'),'C1 side objects: no tap start and no label (v8.3.20)');
assert(!/Save\.addShovels\((\d|n\)|sv|3\+)/.test(s)&&!s.includes("name:'Shovels'")&&!s.includes('Temple shovels')&&!/shovel:[1-9]/.test(s),'v8.3.20 no Shovels granted anywhere');
assert(s.includes('if(all)this.endChapterSideEvent(d,false,true);'),'a running side event is not cut at wave end');
console.log('Owner round 8.3.15: stun 2 s, Daily ×1.5, Ancient off, code-drawn Rank Rewards passed');
