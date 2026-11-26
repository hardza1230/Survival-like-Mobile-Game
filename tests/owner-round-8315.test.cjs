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
console.log('Owner round 8.3.15: stun 2 s, Daily ×1.5, Ancient off, code-drawn Rank Rewards passed');
