// v8.2.28 owner (SCAMPER round 2): golden wave 5% (gold monsters, mission rewards x2), first-time missions (+20% time, NEW banner, focus),
// Chapter 2-3 bosses call a fitting mission at 60% HP (side-mission system, 45 s)
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=re=>{const m=src.match(re);assert(m,'missing '+re);return m[0];};
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const ctx={Math,Save:{data:{}},WAVE_OBJECTIVES:{seedRift:{emoji:'🌰',name:'Seed Rift',desc:'x'},creepingRoots:{name:'Roots'},shakeTrees:{name:'Trees'},lastLight:{name:'LL'},mirrorPath:{name:'MP'}}};vm.createContext(ctx);
vm.runInContext(grab(/const BOSS_TWIST_ON=[\s\S]*?\nconst GOLD_WAVE_CHANCE=[^\n]*\n/)+'this.BM=BOSS_MISSION;this.BT=BOSS_TWIST;class K{'+['goldWaveRoll','missionIntroExtra','bossMissionTick','missionRewardGive'].map(meth).join('\n')+'\n};this.K=K;',ctx);
const s=new ctx.K();s.usesStoryBudget=()=>true;s.stageIndex=4;s.time={delayedCall(){}};
const R0=Math.random;Math.random=()=>.01;assert(s.goldWaveRoll(1));Math.random=()=>.5;assert(!s.goldWaveRoll(1));Math.random=()=>.01;
s._replayMeter=true;assert(!s.goldWaveRoll(1),'no golden wave on replay meter');s._replayMeter=false;s.stageIndex=0;assert(!s.goldWaveRoll(1),'not on first C1-1');Math.random=R0;
// golden rewards x2
s.player={x:0,y:0};let drops=0;s.spawnCurrencyDrop=()=>{drops++;return {}};s.lootHold=()=>{};s.missionReward=()=>({k:'honeydrop',n:2,txt:''});
s.missionRewardGive({type:'purge'});assert.strictEqual(drops,2);drops=0;s.missionRewardGive({type:'purge',_gold:true});assert.strictEqual(drops,4);
// boss mission at 60%
const all=Object.keys(ctx.BM).map(Number);assert(all.every(i=>i>=5),'no boss missions in Chapter 1');
let started=[];s.bossTwistStart=k=>{started.push(k);return {}};s.state='play';s.stageIndex=6;s.boss={active:true,hp:900,maxhp:1000};   // v8.2.83 boss mission → boss twists at 60% / 30%
assert(Object.keys(ctx.BT).map(Number).every(i=>i>=5),'no boss twists in Chapter 1');
s.bossMissionTick(.1);assert.deepStrictEqual(started,[]);s.boss.hp=550;s.bossMissionTick(.1);assert.deepStrictEqual(started,['seeds']);
s.bossMissionTick(.1);assert.deepStrictEqual(started,['seeds'],'once per threshold');s.boss.hp=250;s.bossMissionTick(.1);assert.deepStrictEqual(started,['seeds','dark']);s.boss.hp=10;s.bossMissionTick(.1);assert.strictEqual(started.length,2,'two twists per boss');
// first time
let focus=0,ban='';s.time={delayedCall(ms,f){f()}};s.questFocus=()=>focus++;s.showBanner=t=>ban=t;const o={type:'seedRift',_first:true,desc:'d'};s.waveObjective=o;s.missionIntroExtra(o);assert(ban.includes('New mission')&&focus===1);
// static
assert(/\*\(o\._first\?\(typeof FIRST_TIME_MUL/.test(src),'+20% time');assert(src.includes("if(this._goldWave&&!e.tintColor"),'gold tint');
assert(src.includes("K.boss?(this.mode!=='boss'||!this.boss?.active):(this._v83Run?['boss','bossWarning','reward'].includes(this.mode):this.mode!=='wave')"),'boss side mission ends with the boss · v8.3.24 continuous runs keep it across waves');
console.log('SCAMPER 8.2.28: golden wave, first-time missions, boss missions passed');
