// v8.0.89 owner: more varied Relics, each aimed at certain builds.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('  '+n+'(',src.indexOf('class Game extends')),m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));assert(a>=0&&m,n);return src.slice(a,a+1+m.index);}
const ctx={};vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('const RELICS = {'),src.indexOf('/* ---- CHARACTER COMBAT PROFILES'))+';this.R=RELICS;this.S=RELIC_SYNERGIES;',ctx);
const NEW=['heavydough','sugarrush','frostcandy','copperwhisk','longspoon','crowdcrush','twinbake','giantslayer'];
assert.equal(Object.keys(ctx.R).length,22);const pathIds=new Set([...src.matchAll(/\{id:'([a-z]+)',iconKey:'ic_path_/g)].map(m=>m[1]));
for(const k of NEW){const r=ctx.R[k];assert(r&&r.name&&r.desc&&r.headline&&r.for,k);assert(r.paths.length>=2&&r.paths.every(p=>pathIds.has(p)),k+' paths '+r.paths);assert(!/[฀-๿]/.test(r.desc+r.name+r.for));}
for(const s of ctx.S)assert(ctx.R[s.a]&&ctx.R[s.b],s.name);assert(['Deadeye','Frenzy','Deep Freeze'].every(n=>ctx.S.some(s=>s.name===n)));
const S=vm.runInContext('(class{'+['relicSyn','relicDmg89'].map(method).join('\n')+'})',Object.assign(ctx,{TARO_SHOCK_LIFE:3}));
const s=new S();Object.assign(s,{player:{x:0,y:0},time:{now:10000},elapsed:20,_mxSrc:null});const E=o=>({x:100,y:0,...o});
const m=(rel,e,extra={})=>{s._rel=Object.fromEntries(rel.map(k=>[k,true]));Object.assign(s,extra);return s.relicDmg89(e,s._rel);};
assert.equal(m(['frostcandy'],E({frozen:1})),1.3);assert.equal(m(['frostcandy'],E({_chill:1,_chillAt:9000})),1.3);assert.equal(m(['frostcandy'],E({})),1);assert.equal(m(['frostcandy','chill'],E({frozen:1})),1.6);
assert.equal(m(['copperwhisk'],E({_arcShockT:21})),1.3);assert.equal(m(['copperwhisk'],E({_shock:2,_shockAt:49}),{_taro:{time:50}}),1.3);assert.equal(m(['copperwhisk'],E({_shock:2,_shockAt:40}),{_taro:{time:50}}),1);
assert.equal(m(['longspoon'],E({x:400})),1.25);assert.equal(m(['longspoon'],E({x:300})),1);assert.equal(m(['longspoon','heavydough'],E({x:400})),1.5);
assert.equal(m(['crowdcrush'],E({x:100})),1.25);assert.equal(m(['crowdcrush','sugarrush'],E({x:100})),1.5);assert.equal(m(['crowdcrush'],E({x:200})),1);
assert.equal(m(['twinbake'],E({}),{_mxSrc:'unique'}),1.4);assert.equal(m(['twinbake'],E({}),{_mxSrc:null}),1);
assert.equal(m(['giantslayer'],E({isBoss:true})),1.25);assert.equal(m(['giantslayer'],E({})),.9);
// gain effects + damage hook + build weighting + card shows who it’s for
const g=method('gainRelic');assert(/k==='heavydough'\)\{ p\.dmgMul\+=\.30; p\.cdMul=\(p\.cdMul\|\|1\)\*1\.2;/.test(g)&&/k==='sugarrush'\)\{ p\.dmgMul=Math\.max\(\.2,p\.dmgMul-\.15\); p\.cdMul=\(p\.cdMul\|\|1\)\*\.8;/.test(g)&&/k==='twinbake'\)\{ p\.uniqueCdMul=\(p\.uniqueCdMul\|\|1\)\*\.85;/.test(g));
assert(src.includes("if(!e.isDummy)amount*=this.relicDmg89(e,RL);"));const r=method('rollRelicChoices');assert(r.includes("((RELICS[k].paths||[]).includes((this.basicAttack||{}).path)?1.8:1)")&&r.includes("d.for?'👍 '+d.for:''"));
console.log('Relics v8.0.89: 8 new build-targeted relics (paths valid), 3 synergies, damage conditions, stat trade-offs, build weighting and card hint passed');
