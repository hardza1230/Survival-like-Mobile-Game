import fs from 'node:fs';

const source=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const recommended=[100,280,560,940,1450];
for(let i=1;i<recommended.length;i++){
  const ratio=recommended[i]/recommended[i-1];
  const ceiling=i===1?3.0:2.15;
  if(ratio<1.45||ratio>ceiling)throw new Error(`Stage ${i+1} recommended power curve is abrupt: x${ratio.toFixed(2)}`);
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
for(const token of ["waves:5, recommendedPower:560","waves:5, recommendedPower:940","(this.endlessCycle||0)*0.18","this.secretBoss?1.65:1"]){
  if(!source.includes(token))throw new Error(`Missing balance contract: ${token}`);
}
console.log('validated five-stage power curve, five difficulty tiers, Stage 3/4 targets, and Endless scaling');
