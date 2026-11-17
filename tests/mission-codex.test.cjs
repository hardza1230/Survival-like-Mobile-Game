// v8.2.5 owner: Recipe Book "Missions" tab — every mission met is remembered (✓) or shown as ??? with where to find it
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=(re)=>{const m=src.match(re);assert(m,'missing '+re);return m[0];};
const ctx={};vm.createContext(ctx);
vm.runInContext(grab(/const WAVE_OBJECTIVES = \{[\s\S]*?\n\};/)+';'+grab(/function missionStageTag[^\n]*\n/)+grab(/function missionCodexPages\(\)[\s\S]*?\n(?=function missionSeenMap)/)+grab(/function missionSeenMap\(\)[\s\S]*?return o; \}/)+';this.WO=WAVE_OBJECTIVES;this.pages=missionCodexPages;this.seen=missionSeenMap;',Object.assign(ctx,{STAGES:Array.from({length:15},(_,i)=>({lead:['hungerHerald','hungersMouth','grandmasPot','frozenPantry','grandmasGolem','defendNectar','cleanAir','creepingRoots','seasonCycle','breakRoots','seedRift','shakeTrees','mirrorPath','vaultAltar','lastLight'][i]}))}));
const pages=ctx.pages(),all=pages.flatMap(p=>p.rows.map(r=>r.t));
assert.strictEqual(pages.length,5);
assert.strictEqual(new Set(all).size,all.length,'no duplicates');
for(const t of all)assert(ctx.WO[t],'unknown mission '+t);
assert(all.includes('hungerHerald')&&all.includes('capture')&&all.includes('hungerDomain'));
assert.strictEqual(pages[1].rows[0].where,'C1-1');assert.strictEqual(pages[3].rows[4].where,'C3-5');
ctx.Save={data:{seenMissions:{hungerHerald:1},missionLog:{seedRift:1},stageStars:{0:1}}};
const s=ctx.seen();assert(s.hungerHerald&&s.seedRift&&s.fill&&s.survive&&s.hunt&&!s.purge&&!s.capture);
// wiring
assert(/this\.logMission\?\.\(type\);/.test(src),'setupWaveObjective logs the mission');
assert(/logMission\(type\)\{[^\n]*Save\.data\.missionLog/.test(src));
assert(/'🗺️ Missions'/.test(src)&&/tab==='missions'\)\{this\.buildMissionCodex/.test(src));
assert(/tabN=5/.test(src));
console.log('mission-codex ok');
