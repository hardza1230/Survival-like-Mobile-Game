// v8.2.14 owner (mission pool audit): arrows skip finished trees/mirrors and point at the lantern closest to going out; Fill step 1 capped at 35 kills with "Defeat" wording
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
assert(src.includes("(S.trees||[]).filter(t=>!t.done).forEach(t=>pt(t,100,'🌳 Stand under the tree'))"));
assert(src.includes("(S.mirrors||[]).filter(m=>!m.lit).slice(0,1).forEach(m=>pt(m,90,'🪞 Charge each mirror'))"));
assert(src.includes("(S.lamps||[]).filter(L=>L.alive).sort((a,b)=>a.hp/a.maxhp-b.hp/b.maxhp).slice(0,1)"));
assert(src.includes("if((S.mirrors||[]).every(m=>m.lit))pt({x:S.cx,y:S.cy},80,'💎 The crystal');"),'crystal arrow only after all mirrors');
assert(src.includes("if(S.phase==='fight'&&S.goal==='collect'&&S.seed)pt(S.seed,40,'✨ Grab the seed');"),'vault seed arrow');
assert(/const FILL_TARGET_MAX=35;/.test(src)&&src.includes("o.target=Math.min(FILL_TARGET_MAX,"));
assert(src.includes("'Step 1/2 · Defeat '+Math.floor(o.progress)")&&!src.includes("'Step 1/2 · Clear '"));
const bots=fs.readFileSync(__dirname+'/../scripts/qa-bots.cjs','utf8');assert(/add\('pool',\{tag:t,kind:'pool'/.test(bots)&&/async function runPool\(/.test(bots),'pool persona');
console.log('Mission pointers + Fill 35 + pool bots passed');
