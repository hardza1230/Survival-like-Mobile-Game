// v8.2.77 owner: Forge Barrier (gold hexagon) made heroes untouchable → cap 15% HP (30% with Barrier Capacity), gain ≤4% HP/s from all sources, 3 s lockout after it breaks.
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
for(const h of["FORGE_BARRIER_BASE=.15,FORGE_BARRIER_MAX=.30,FORGE_BARRIER_RATE=.02,FORGE_BARRIER_LOCK=3,FORGE_BARRIER_PAUSE=2","if(now<(r.barLockUntil||0)||now-(r.barHitAt??-Infinity)<FORGE_BARRIER_PAUSE)return;","if(amount>0)r.barHitAt=now;","FORGE_DR_CAP=.3","r.barLockUntil=now+FORGE_BARRIER_LOCK;","Math.min(FORGE_BARRIER_MAX,FORGE_BARRIER_BASE+.6*forgeValue(p,61)/100)"])assert(src.includes(h),h);
assert(!src.includes("cap=p.maxhp*Math.min(.5,.25+forgeValue(p,61)/100)"),'old 25–50% cap gone');
console.log('Forge barrier 8.2.77: 15/30% cap, 2%/s gain (v8.2.78), 3s lockout, 2s pause after a hit, DR cap 30% wired (behaviour covered in forge-150) passed');
