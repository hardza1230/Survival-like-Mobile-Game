// v7.4.2 กันเมธอดชื่อซ้ำในคลาสเดียวกัน (ตัวหลังทับตัวแรกเงียบ ๆ) — เคยเกิดกับ buildStats: Play Stats ทับแท็บ Stats หน้า Heroes
const fs=require('fs'),assert=require('assert');
const lines=fs.readFileSync(__dirname+'/../game.js','utf8').split('\n');const dups=[];let classes=0;
for(let i0=0;i0<lines.length;i0++){ const c=/^class (\w+)/.exec(lines[i0]); if(!c)continue; classes++; const end=lines.findIndex((l,i)=>i>i0&&/^}/.test(l)); const seen=new Map();
  for(let i=i0+1;i<end;i++){ const m=/^  (?:async |static )?([A-Za-z_$][\w$]*)\(.*\)\s*\{/.exec(lines[i]); if(!m||['if','for','while','switch','catch'].includes(m[1]))continue; if(seen.has(m[1]))dups.push(c[1]+'.'+m[1]+' lines '+seen.get(m[1])+' & '+(i+1)); else seen.set(m[1],i+1); } }
assert(classes>=3,'class scan found the game classes');
assert.deepEqual(dups,[],'duplicate class methods: '+dups.join('; '));
const src=lines.join('\n');
assert(/s==='playstats'\)this\.buildPlayStats\(\)/.test(src),'Play Stats route uses its own method');
assert(/tab==='stats'\)this\.buildStats\(\)/.test(src),'Heroes Stats tab keeps buildStats');
console.log('No duplicate methods: '+classes+' classes scanned · Play Stats and Heroes Stats routes separate passed');
