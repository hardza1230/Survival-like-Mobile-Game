// ตรวจโค้ดที่ไปต่อท้าย // comment บนบรรทัดเดียวกัน (เคยทำให้ preloadAll ปิดหน้าโหลดไม่ได้ v6.49.0, tutorial dash v5.69)
import {readFileSync} from 'node:fs';
const CODE=/(?:this|window|Save|Sfx|L|G)\.[\w.]+\s*(?:\(|=[^=>])|\b(?:const|let|var)\s+\w+\s*=|\bif\s*\(.*\)\s*\{?|\breturn\b[^฀-๿]*;/;
let bad=[];
for(const fn of ['game.js','index.html','sw.js']){
  readFileSync(fn,'utf8').split('\n').forEach((l,i)=>{
    let q=null,pos=-1;
    for(let j=0;j<l.length-1;j++){const c=l[j];
      if(q){ if(c==='\\'){j++;continue;} if(c===q)q=null; }
      else if(c==="'"||c==='"'||c==='`')q=c;
      else if(c==='/'&&l[j+1]==='/'&&!(j>0&&(l[j-1]===':'||l[j-1]==='\\'))){pos=j;break;}
    }
    if(pos<0)return; const t=l.slice(pos+2);
    if(t.length>40&&CODE.test(t))bad.push(`${fn}:${i+1}: ${t.trim().slice(0,120)}`);
  });
}
if(bad.length){console.error('Code swallowed by // comment:\n'+bad.join('\n'));process.exit(1);}
console.log('No code hidden inside line comments');
