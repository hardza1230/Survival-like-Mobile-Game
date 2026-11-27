// v8.2.83 owner: boss missions → boss twists (mission pieces, no bar) · Seed Rift → random natural-disaster event · stage loading cover.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8'),html=fs.readFileSync(__dirname+'/../index.html','utf8');
const grab=n=>{const i=src.indexOf('\n  '+n+'(');assert(i>0,n);let k=src.indexOf('\n',i+1);while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1);return src.slice(i+3,k);};
const consts=src.match(/const SR_EVENT_WARN=[^\n]*\n/)[0];
const T=vm.runInNewContext(consts+'class T{'+['seedRiftEventTick','seedRiftEventEnd'].map(grab).join('\n')+'};T',{Math});
const s=new T();let started=0;Object.assign(s,{state:'play',mode:'wave',stageIndex:6,waveIndex:1,seedRiftEventStart(){started++;this._srEv={objs:[],carriers:[]};},seedRiftEventRun(){}});
let rolls=0;const R=Math.random;Math.random=()=>.1;s.seedRiftEventTick(1);assert(s._srAt>=8&&s._srAt<=20,'15% roll hit → scheduled 8–20 s into the wave');
for(let i=0;i<25&&!started;i++)s.seedRiftEventTick(1);assert.equal(started,1,'event starts');
const s2=new T();Object.assign(s2,{state:'play',mode:'wave',stageIndex:6,waveIndex:1,seedRiftEventStart(){started++;}});Math.random=()=>.5;s2.seedRiftEventTick(1);assert.equal(s2._srAt,null,'50% roll misses at 15%');
s2.stageIndex=10;s2.waveIndex=2;s2.seedRiftEventTick(1);assert.equal(s2._srAt,null);Math.random=()=>.3;s2.waveIndex=3;s2.seedRiftEventTick(1);assert(s2._srAt!=null,'home stage 35%');
const s3=new T();Object.assign(s3,{state:'play',mode:'wave',stageIndex:3,waveIndex:1,seedRiftEventStart(){throw 1;}});Math.random=()=>0;for(let i=0;i<30;i++)s3.seedRiftEventTick(1);assert.equal(s3._srAt,undefined,'never in Chapter 1');Math.random=R;
assert(src.includes("STACK_POOL=['shakeTrees',")&&src.includes("MISSION_DECK_SKIP=['seasonCycle','seedRift']")&&!/MISSION_HOME=\{[^}]*seedRift/.test(src),'Seed Rift out of every mission pool');
assert(src.includes('this.stackTick?.(dt);this.tickSeasonEnv?.(dt);this.seedRiftEventTick?.(dt);'),'ticked in waves');
// boss twists
assert(src.includes('BOSS_MISSION_ON=false')&&/BOSS_TWIST_AT=\[\.6,\.3\],BOSS_TWIST_DUR=15/.test(src),'twists at 60% / 30%, 15 s');
for(const k of ['roots','seeds','fruit','dark','shadows'])assert(new RegExp(k+":\\{emoji:").test(src),'twist '+k);
assert(grab('bossTwistEnd').includes('e.spd=e._twistBuff'),'Frenzy Dark buff restored');
assert(src.includes('/* v8.2.83 กล่อง Gear จากภารกิจบอส → รางวัลชนะบอส Ch2–3 */'),'gear box on boss kill');
// loading cover
assert(grab('stageLoadCover').includes("'stage_card_s'+String((idx|0)+1).padStart(2,'0')"),'stage card cover');
assert(html.includes('stageCover:function(url,title,tint)')&&html.includes('this._minUntil=performance.now()+800')&&html.includes("var wait=(this._minUntil||0)-performance.now();"),'loader cover + 0.8 s minimum');
console.log('Events 8.2.83: Seed Rift random event, boss twists, stage loading cover passed');
