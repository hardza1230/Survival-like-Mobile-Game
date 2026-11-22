// v8.2.62 owner: Expedition was buried (Home → Upgrade → Weave) and its red dot died with the daily chest → Activities row + new red dot + fixed unlock text.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const EXP_ON='),b=src.indexOf('const DIG_START_SHOVELS');
const saveM=['exp','expReady'].map(n=>{const i=src.indexOf('\n  '+n+'(');const m=/\n  [A-Za-z_]\w*\(/.exec(src.slice(i+3));return src.slice(i+1,i+3+m.index);}).join('\n');
const ctx={Math,Date};vm.createContext(ctx);let open=true;ctx.featureOpen=()=>open;
vm.runInContext(src.slice(a,b)+';var Save={data:{chars:["mint"],character:"momo"},'+saveM+'};this.Save=Save;',ctx);
const S=ctx.Save,e=S.exp();
e.at=Date.now();e.crumbs=0;e.tap=1;e.help={};assert(!S.expReady(),'just visited, broke → no dot');
e.crumbs=1e6;assert(S.expReady(),'can upgrade → dot');
e.crumbs=0;e.at=Date.now()-2*3600e3;assert(S.expReady(),'away ≥1h → dot');
open=false;assert(!S.expReady(),'locked → no dot');
// Activities row + nav badge + unlock text
for(const h of["['dig','⚔️','Expedition','Heroes fight titans on their own · collect 🍪'],","if(t==='gActivity')return C('daily')||C('achievements')||C('dig');","FEAT_TAG={dig:'gActivity',","dig:'⚔️ Expedition',","if(target==='dig')return featureOpen('dig')&&Save.expReady();"])assert(src.includes(h),h);
assert(!/Depths is open|Use shovels/.test(src.slice(src.indexOf('const FEAT_LINE'),src.indexOf('\n',src.indexOf('const FEAT_LINE')))),'old Depths unlock text gone');
const g=src.indexOf('gActivity:{ title:');assert(src.slice(g,src.indexOf('] },',g)).includes("['dig',"),'Expedition in Activities');
console.log('Expedition findable 8.2.62: Activities row, red dot (away 1h / can upgrade), unlock text passed');
