// v8.3.32 owner: Story bosses/minibosses keep their designed move gaps (no aggro multiplier); Mint Glacier Bloom ring ×0.7
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),s=fs.readFileSync('game.js','utf8');
function method(n){const a=s.indexOf('\n  '+n+'(');assert(a>0,n);const line=s.slice(a+3,s.indexOf('\n',a+3));return line;}
const G=vm.runInNewContext('({'+method('bossAggro')+'})',{STORY_BOSS_AGGRO:1,DELVE_AGGRO_STEP:.05,DELVE_AGGRO_MAX:1.6});G.screenFlash=()=>{};G.showBanner=()=>{};
const boss={isBoss:true,hp:100,maxhp:100,spd:10};assert.equal(G.bossAggro(boss),1,'story boss');
const low={isBoss:true,hp:10,maxhp:100,spd:10};assert.equal(G.bossAggro(low),1,'story boss below 30%');
assert.equal(G.bossAggro({isBoss:false,hp:100,maxhp:100}),1,'story miniboss');
G.recipeMode=true;G._amapNode={d:1};assert.equal(G.bossAggro({isBoss:true,hp:100,maxhp:100}),1,'Delve depth 1');G._amapNode={d:5};assert.equal(Math.round(G.bossAggro({isBoss:true,hp:100,maxhp:100})*100)/100,1.2,'depth 5');G._amapNode={d:30};assert.equal(G.bossAggro({isBoss:true,hp:100,maxhp:100}),1.6,'cap');G._amapNode=null;assert.equal(G.bossAggro({isBoss:true,hp:100,maxhp:100}),1.45,'other endgame keeps aggro');
assert(s.includes('const MINT_BLOOM_SCALE=.7;')&&s.includes("(1+0.25*(this.mintLv().m_grow||0))*MINT_BLOOM_SCALE; }"),'bloom radius scaled (preview art and hit use bloomRadius)');
console.log('Owner 8.3.32: story bosses without aggro, Delve unchanged, Mint bloom ×0.7 passed');
