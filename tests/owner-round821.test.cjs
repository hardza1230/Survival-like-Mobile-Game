// v8.2.1 owner 🐞 round (8.2.0 phone QA): HUD art after a lost run, rescue scene tap guards, canvas cap for huge screens.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
// A1: scene.restart keeps instance fields → HUD build must forget the old run's HUD art containers
assert(/this\.hudBtnC=this\.add\.container\([^;]+;\s*this\._hudL=null; this\._hudBtns=null; this\._hudArt=false; this\._hudArtChk=0;/.test(src),'HUD art refs reset when the HUD is built');
// A4: story loading ignores early taps; hero intro button ignores the tap that closed the scene
{ const T=vm.runInNewContext('class T{'+grab('mcTap')+'}; T',{Date,Sfx:{}}); const t=new T(); let fin=null; const mc={done:false,ready:false,t0:Date.now(),finish:s=>{fin=s;}};
  t.mcTap(mc,{x:0,y:0}); assert.equal(fin,null,'tap while loading in the first 2.5 s is ignored'); mc.t0=Date.now()-3000; t.mcTap(mc,{x:0,y:0}); assert.equal(fin,false,'later tap still skips a slow load'); }
assert(/t0:Date\.now\(\),/.test(grab('playMotionComic')),'comic remembers when it opened');
assert(/const t0=Date\.now\(\);this\._zone\([^;]+\{if\(Date\.now\(\)-t0<900\)return;this\._mintCoach=hi;/.test(grab('showMintWarning')),'hero intro button guarded');
// A5: backing canvas capped at 4096 px a side
{ const m=src.match(/const MAX_CANVAS_PX=4096;\nfunction capView\(v\)\{[^\n]+\}/); assert(m,'capView'); const capView=vm.runInNewContext(m[0]+';capView',{RENDER_BASE_DPR:1.5});
  const v=capView({w:1024,h:10000,fit:false}); assert(v.h*1.5<=4096&&v.w===1024,'crawler size capped'); const p=capView({w:390,h:844,fit:false}); assert.deepEqual([p.w,p.h],[390,844],'phones untouched'); }
assert(/return capView\(\{w,h,fit:false\}\)/.test(src),'viewSize uses the cap');
console.log('owner round 8.2.1 (HUD after loss, rescue scene taps, canvas cap) passed');
