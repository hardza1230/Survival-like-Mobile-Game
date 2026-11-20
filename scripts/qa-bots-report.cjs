// Merge qa-bots shard files into one Markdown report (GitHub job summary + artifact).
// Usage: node scripts/qa-bots-report.cjs <dir-or-files...> > qa-bots-report.md
const fs=require('fs'),path=require('path');
const files=process.argv.slice(2).flatMap(p=>fs.statSync(p).isDirectory()?fs.readdirSync(p,{recursive:true}).filter(f=>/qa-bots.*\.json$/.test(f)).map(f=>path.join(p,f)):[p]);
const runs=[];let version=null;
for(const f of files){try{const r=JSON.parse(fs.readFileSync(f,'utf8'));version=version||r.version;runs.push(...(r.runs||[]));}catch(e){console.error('skip',f,e.message);}}
runs.sort((a,b)=>String(a.id).localeCompare(String(b.id)));
const slow=r=>r.persona!=='menus'&&r.sec>=60&&(r.elapsed||0)<r.sec*.25;   // headless too slow to really test this run (FPS collapse)
const bad=r=>slow(r)||(r.errors||[]).length||(r.consoleErrors||[]).length||(r.stuck||[]).length||['boot-timeout','never-started','runner-error','back-to-menu'].includes(r.result)||/^exit/.test(r.result||'');
const L=[];const P=s=>L.push(s);
P(`# QA bots — v${version||'?'} · ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC`);
P(`${runs.length} runs · ${runs.filter(bad).length} with problems`);P('');
// 1. errors grouped by message
const groups=new Map();for(const r of runs)for(const [kind,list] of [['page',r.errors||[]],['console',r.consoleErrors||[]]])for(const e of list){const k=kind+' · '+String(e).replace(/\d+/g,'#').slice(0,160);const g=groups.get(k)||{n:0,ids:new Set(),sample:e};g.n++;g.ids.add(r.id);groups.set(k,g);}
P('## Errors');if(!groups.size)P('None 🎉');
for(const [k,g] of [...groups].sort((a,b)=>b[1].n-a[1].n))P(`- **${g.n}×** \`${String(g.sample).slice(0,200).replace(/`/g,"'")}\` — ${[...g.ids].slice(0,6).join(', ')}${g.ids.size>6?' …':''}`);
P('');P('## Stuck / did not finish / too slow');
const stuck=runs.filter(r=>slow(r)||(r.stuck||[]).length||['boot-timeout','never-started','runner-error','back-to-menu'].includes(r.result));if(!stuck.length)P('None');
for(const r of stuck)P(`- ${r.id}: ${r.result}${slow(r)?' · only '+(r.elapsed||0)+' game s in '+r.sec+' s (FPS '+(r.fpsAvg??'-')+')':''} · ${(r.stuck||[]).map(s=>s.bot||(s.state+'@'+s.elapsed+'s '+s.act)).slice(0,3).join(' | ')}`);
// 2. missions that started but never ended inside a run that kept going
P('');P('## Missions');const mis={};
for(const r of runs)for(const m of r.missions||[]){const o=mis[m.type]||(mis[m.type]={n:0,done:0,cleared:0,open:0,stages:new Set()});o.n++;o.stages.add(m.stage);if(!m.end)o.open++;else if(m.end===true||String(m.end).startsWith('done'))o.done++;else o.cleared++;}
P('| Mission | seen | done | ended/failed | still open at run end | stages |');P('|---|---|---|---|---|---|');
for(const [t,o] of Object.entries(mis).sort((a,b)=>b[1].n-a[1].n))P(`| ${t} | ${o.n} | ${o.done} | ${o.cleared} | ${o.open} | ${[...o.stages].sort((a,b)=>a-b).join(' ')} |`);
// 3. all runs
P('');P('## Runs');P('| Run | result | game s | lvl | kills | FPS avg/min | heap MB | tex MB | errors |');P('|---|---|---|---|---|---|---|---|---|');
for(const r of runs)P(`| ${bad(r)?'⚠️ ':''}${r.id} | ${r.result} | ${r.elapsed??'-'} | ${r.level??'-'} | ${r.kills??'-'} | ${r.fpsAvg??'-'}/${r.fpsMin??'-'} | ${r.heapMaxMB??'-'} | ${r.texMaxMB??'-'} | ${(r.errors||[]).length+(r.consoleErrors||[]).length} |`);
// 4. build comparison (bots use GM ×10 damage on a fresh save: compare builds with each other only)
const B=runs.filter(r=>r.persona==='build'&&r.mx);
if(B.length){P('');P('## Build comparison (for comparison only — GM ×10 damage, fresh save; the owner decides balance)');
  P('| Build | path taken | game s | dmg/s all | dmg/s boss+mini | kills/min | taken | top sources |');P('|---|---|---|---|---|---|---|---|');
  const rows=B.map(r=>{const m=r.mx,s=Math.max(1,m.sec||r.elapsed||1);return {r,s,all:(m.dealt||0)/s,big:((m.dBoss||0)+(m.dMini||0))/s,kpm:(m.kills||0)/s*60};}).sort((a,b)=>b.all-a.all);
  const avg=rows.reduce((a,x)=>a+x.all,0)/rows.length||1;
  for(const x of rows)P(`| ${x.r.id.slice(6)} | ${x.r.path||'—'} | ${Math.round(x.s)} | ${Math.round(x.all)} (${Math.round(x.all/avg*100)}%) | ${Math.round(x.big)} | ${x.kpm.toFixed(1)} | ${Math.round(x.r.mx.taken||0)} | ${(x.r.mx.src||[]).slice(0,3).map(s=>Array.isArray(s)?s[0]+' '+s[1]+'%':s).join(', ')} |`);}
process.stdout.write(L.join('\n')+'\n');
