// v8.3.41 owner: hero bar on the stage-select screen (tap a face = switch hero, no extra tap before a run)
const assert=require('node:assert/strict'),fs=require('node:fs');const s=fs.readFileSync('game.js','utf8');
const at=s.indexOf('  stageHeroBar(y,portrait){');assert(at>0,'stageHeroBar exists');const body=s.slice(at,s.indexOf('\n  }\n',at));
assert(s.includes('const barH=this.stageHeroBar?.(portrait?92:62,portrait)||0;'),'stage select calls the bar');
assert(s.includes("y0=(portrait?100:69)+barH"),'stage cards move below the bar');
assert(body.includes('heroRevealed'),'only playable heroes');assert(body.includes('Save.data.character=c;Save.save();this.character=c;'),'tap switches hero');
assert(body.includes("z.tag='stage_hero_'+c"),'tap zone tag');assert(body.includes('heroTagLine')&&body.includes('heroDiffLine')&&body.includes('Save.power(cur)'),'tags, difficulty and power shown');
assert(body.includes('ensureGroup')&&body.includes("this.menuScreen==='stage'"),'faces load lazily and rebuild only on the stage screen');
assert(/if\(own\.length<2\)return 0;/.test(body),'no bar with a single hero');
console.log('stage-hero-bar ok');
