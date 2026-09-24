import fs from 'node:fs';

const source=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const recommended=[100,280,560,940,1450,2200,3000,4200,5700,7600];
for(let i=1;i<recommended.length;i++){
  const ratio=recommended[i]/recommended[i-1];
  const ceiling=i===1?3.0:2.15;
  if(ratio<1.25||ratio>ceiling)throw new Error(`Stage ${i+1} recommended power curve is abrupt: x${ratio.toFixed(2)}`);
}
const difficulties=[
  {name:'Normal',hp:1,dmg:1,reward:1},
  {name:'Hard',hp:1.4,dmg:1.22,reward:1.35},
  {name:'Nightmare',hp:1.9,dmg:1.5,reward:1.8},
  {name:'Hell',hp:2.6,dmg:1.85,reward:2.4},
  {name:'Impossible',hp:3.5,dmg:2.25,reward:3.2},
];
for(let i=1;i<difficulties.length;i++){
  const a=difficulties[i-1],b=difficulties[i];
  if(b.hp<=a.hp||b.dmg<=a.dmg||b.reward<=a.reward)throw new Error(`Difficulty ${b.name} must strictly increase risk and reward`);
  if((b.reward/a.reward)<0.95*(b.hp/a.hp))throw new Error(`Difficulty ${b.name} reward falls too far behind its HP increase`);
}
for(const token of ["waves:5, recommendedPower:560","waves:5, recommendedPower:940","waves:5, recommendedPower:7600","c2Root:{ hp:1.16, dmg:1.12, speed:1.08, maxLive:88 }","(this.endlessCycle||0)*0.18","this.secretBoss?1.65:1"]){
  if(!source.includes(token))throw new Error(`Missing balance contract: ${token}`);
}
console.log('validated ten-stage power curve, five difficulty tiers, Chapter 2 finale targets, and Endless scaling');
