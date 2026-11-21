// v8.2.27 owner (SCAMPER round 1): side-mission arrow, reward on the deal card, reroll (free + ad), curse pads show Sugar,
// float-text cap, easy→hard wave order, mission-finish juice, Double Clear, shorter big missions
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=re=>{const m=src.match(re);assert(m,'missing '+re);return m[0];};
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const ctx={Math,Save:{data:{},save(){}}};vm.createContext(ctx);
vm.runInContext(grab(/const MISSION_TIER=[^\n]*\n/)+grab(/const FLOAT_MAX=[^\n]*\n/)+'this.T=MISSION_TIER;this.FM=FLOAT_MAX;class K{'+['missionDeckSort','missionDealReroll','floatText','doubleClearMark','stackArrowTarget','updateSideArrow'].map(meth).join('\n')+'\n};this.K=K;',ctx);
const s=new ctx.K();
// easy→hard, stable
assert.deepStrictEqual(s.missionDeckSort(['frozenPantry','seedRift','hunt','grandmasPot','fill']),['hunt','fill','seedRift','frozenPantry','grandmasPot']);
// reroll: lead slot kept, other slots redrawn, free once then ad once
ctx.MISSION_HOME={};s.stageIndex=3;let n=0;s.missionDeckDraw=(k)=>Array.from({length:k},()=>['shakeTrees','hunt','frozenPantry'][n++%3]);
const deal={waves:{0:'frozenPantry',1:'fill',3:'survive',4:'purge'},slots:[0,1,3,4],lead:'frozenPantry',leadSlot:0,plan:false};
assert(s.missionDealReroll(deal));assert.strictEqual(deal.waves[0],'frozenPantry');assert.deepStrictEqual([deal.waves[1],deal.waves[3],deal.waves[4]],['hunt','shakeTrees','frozenPantry']);
assert(!s.missionDealReroll(deal),'free reroll only once');assert(s.missionDealReroll(deal,true),'ad reroll once');assert(!s.missionDealReroll(deal,true));
assert(!s.missionDealReroll({plan:true,slots:[0]}),'lesson plan cannot reroll');
// float text: dedupe nearby repeats, cap at FLOAT_MAX
const made=[];s.time={now:1000};s.tweens={add(){},killTweensOf(){}};s.camWorld=o=>o;
s.add={text(x,y,m){const t={active:true,x,y,m,setOrigin(){return t},setDepth(){return t},destroy(){t.active=false}};made.push(t);return t;}};
s.floatText(0,0,'🫧 Shield');s.floatText(10,10,'🫧 Shield');assert.strictEqual(made.length,1,'merged');
for(let i=0;i<8;i++)s.floatText(i*200,0,'t'+i);assert.strictEqual(s._floatList.length,ctx.FM);assert(made.filter(t=>t.active).length<=ctx.FM);
// Double Clear: only when main + side in the same wave, paid once
s.player={x:0,y:0};s.sugarStage=0;s.sugarRun=0;let loot=0;s.spawnLoot=()=>{loot++;return {}};s.lootHold=()=>{};s.waveIndex=1;
assert(!s.doubleClearMark('main'));s.waveIndex=2;assert(!s.doubleClearMark('side'),'different wave');assert(s.doubleClearMark('main'));assert.strictEqual(loot,1);assert(!s.doubleClearMark('side'));assert(s.sugarRun>0);
// side arrow follows the side mission target
s.elapsed=1;s._stack={o:{done:false},type:'seedRift'};s.stackRun=f=>f();s.questFocusTargets=()=>[{x:600,y:0,r:60},{x:900,y:0,r:60}];
let vis=null;s.sideArrow={setPosition(){return this},setRotation(){return this},setScale(){return this},setVisible(v){vis=v;return this}};s.mode='wave';
s.updateSideArrow(180,320);assert.strictEqual(vis,true);s._stack=null;s.updateSideArrow(180,320);assert.strictEqual(vis,false);
// static checks
assert(/vaultAltar:120,ultimatum:150/.test(src)&&/grandmasGolem:100,grandmasPot:100/.test(src),'shorter big missions');
assert(src.includes("'\\nWin: 🍬 +'"),'curse pads show Sugar');assert(!src.includes("'\\n🎁 '+(R?R.txt"),'deal card text removed by owner 8.2.46');
assert(src.includes('Reroll again (watch ad)')&&src.includes('showRewardedAd(\'Watch an ad to reroll'),'ad reroll');
assert(/this\.missionJuice\?\.\(o\); this\.doubleClearMark\?\.\('side'\)/.test(src)&&/this\.missionJuice\?\.\(o\); this\.doubleClearMark\?\.\('main'\)/.test(src));
console.log('SCAMPER 8.2.27: side arrow, deal reward + reroll (free/ad), curse Sugar, float cap, easy→hard, juice, Double Clear, shorter missions passed');
