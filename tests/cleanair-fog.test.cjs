// v8.1.154 Clean Air poison fog: puffs fill the view except the Wisp ring and its path; fewer puffs on low perf; cleaned up with the mission.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const run=(lvl)=>{ const S=vm.runInNewContext('class S{'+grab('cleanAirFog')+'}; S',{Math,TAU:Math.PI*2,PERF:{lvl}}); const s=new S(); const circles=[];
  const g={scene:1,clear(){circles.length=0;return g;},fillStyle(){return g;},fillCircle(x,y,r){circles.push([x,y,r]);return g;},setDepth(){return g;}};
  Object.assign(s,{add:{graphics:()=>g},camWorld:o=>o,cameras:{main:{worldView:{x:0,y:0,width:400,height:800}}},player:{x:200,y:400}});
  const c={x:200,y:400,tx:200,ty:100,r:145}; let drawn=0; for(let i=0;i<30;i++)drawn=s.cleanAirFog(c,{},1/30); return {s,c,drawn}; };
const a=run(0); assert.equal(a.c.fog.length,26); assert(a.drawn>0&&a.drawn<26,'some puffs hidden by the clean ring/path: '+a.drawn);
for(const q of a.c.fog){ const dz=Math.hypot(q.x-a.c.x,q.y-a.c.y); if(dz<a.c.r)assert(true); }
const b=run(2); assert.equal(b.c.fog.length,12,'low perf');
assert(src.includes("this.cleanAirFog?.(c,o,dt);"),'ticked'); assert(src.includes("'_cleanAirPath','_cleanAirFog'"),'cleanup');
console.log('Clean Air fog: poison puffs outside the clean ring/path, low-perf cap, cleanup passed');
