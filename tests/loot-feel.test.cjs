// v8.1.75 เจ้าของ: ของภารกิจค้างก่อนดูด · ลำแสงของหายาก · Bounty ตอนเล่นซ้ำ · มินิ/บอสดรอปเยอะขึ้น
const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
for(const n of ['lootHold','bigFoeLoot','rareLootPillar','replayBountyPool','replayBountyTick'])m(n);
assert.ok(/out\.forEach\(g=>this\.lootHold\(g,1900\)\)/.test(m('missionLootBurst')),'mission loot held');
const mag=m('tickLootMagnet');assert.ok(/now<g\._holdUntil\)return/.test(mag)&&/g\._vac=true/.test(mag)&&/g\._vac\?Math\.max\(620/.test(mag),'hold then vacuum from any range');
assert.ok(/g\._holdUntil&&\(this\.time\?\.now\|\|0\)<g\._holdUntil\)\)return/.test(m('collectLoot')),'held loot cannot be collected early');
assert.ok(/this\.rareLootPillar\?\.\(o,color\)/.test(src),'drop beam adds rare pillar');const rp=m('rareLootPillar');for(const t of ['rare','epic','legend'])assert.ok(rp.includes(t+':['),t);
assert.ok(src.includes("if(isMini&&!this.bossRush)this.bigFoeLoot(e.x,e.y,'mini');")&&src.includes("const bl=this.bigFoeLoot(e.x,e.y,'boss')"),'mini/boss hooks');
const bf=m('bigFoeLoot');assert.ok(/end\?3:2/.test(bf)&&/_lootMinRare=true/.test(bf),'boss 2-3 boxes, mini min rare');
const pool=m('replayBountyPool');assert.ok(/t!=='survive'&&t!=='fill'/.test(pool),'bounties skip survive/fill');
assert.ok(/m\.kills\+m\.goal\*\.08/.test(src)&&/this\.replayBountyTick\?\.\(m\)/.test(src)&&/until:m\.time\+45/.test(src),'bounty reward/timer');
console.log('Loot feel: held mission loot + vacuum, rare pillars, replay bounties, mini fountain, boss boxes passed');
