// v8.1.153 owner boss themes: Ch1 stages 2–5 Gates of the Calamity, Ch2 (6–10) Skyfall Sprint, Ch3 (11–15) Skyfire Pursuit; endgame keeps its own.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.js'),'utf8');
for(const f of ['skyfall_sprint','skyfire_pursuit']){ const b=fs.readFileSync(path.join(root,'assets/audio/bgm',f+'.mp3')); assert(b.length>100000&&b.length<2_000_000,f); }
const i=src.indexOf('function bgmKeyFor('),j=src.indexOf('\n}\n',i);
const ctx={ASSET_AUDIO:{bgm_c11_boss:1,bgm_c2_boss:1,bgm_c3_boss:1,bgm_endgame_boss:1},BGM_MODE:'story',window:{},Save:{data:{tutorialDone:true}},String};
vm.runInNewContext(src.slice(i,j+2)+';this.f=bgmKeyFor;',ctx);
for(let n=2;n<=5;n++)assert.equal(ctx.f('boss',n),'bgm_c11_boss');
for(let n=6;n<=10;n++)assert.equal(ctx.f('boss',n),'bgm_c2_boss',n);
for(let n=11;n<=15;n++)assert.equal(ctx.f('boss',n),'bgm_c3_boss',n);
ctx.BGM_MODE='endgame'; assert.equal(ctx.f('boss',8),'bgm_endgame_boss');
assert(src.includes("bgm_c2_boss: 'assets/audio/bgm/skyfall_sprint.mp3'")&&src.includes("bgm_c3_boss: 'assets/audio/bgm/skyfire_pursuit.mp3'"));
console.log('Boss BGM: Ch1 Gates · Ch2 Skyfall Sprint · Ch3 Skyfire Pursuit · endgame unchanged passed');
