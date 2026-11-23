const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const src=fs.readFileSync('game.js','utf8'),dir='assets/incoming/yuzu-motion3b/';
const rows=JSON.parse(fs.readFileSync(dir+'MANIFEST.json'));
assert.equal(rows.length,4);
for(const row of rows){
 const b=fs.readFileSync(dir+row.file);assert.equal(b.length,row.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),row.sha256);
 assert(src.includes("url:'assets/art/yuzu-motion3b/"+row.key+".webp',frame:256"));
 assert.equal(row.frameCount,row.key.endsWith('slam')||row.key.endsWith('rain')?12:8);
}
function method(n){const start=src.indexOf('\n  '+n+'(');const tail=src.slice(start+1);return tail.slice(0,tail.slice(2).search(/\n  [\w$]+\(/)+2);}
const ctx={Save:{data:{settings:{}}}};
const S=vm.runInNewContext('(class {'+['yuzuFx','yuzuTickFx'].map(method).join('\n')+'\n})',ctx);
function make(count,kind){
 let frame=0;const spr={active:true,setDisplaySize(){return this},setAlpha(){return this},setDepth(){return this},setPosition(){return this},setFrame(n){frame=n;return this},destroy(){this.active=false}};
 const s=new S();Object.assign(s,{state:'play',player:{x:1,y:2},_yzShield:{},textures:{exists:()=>true,get:()=>({frameTotal:count+1})},camWorld:t=>t,add:{sprite:()=>spr},yuzuTickSkillFx(){}});
 const q=s.yuzuFx(kind,0,0,64,.5,kind==='shield'?'shield':null);
 return {s,q,spr,frame:()=>frame};
}
for(const fps of [30,60,120]){
 const {s,spr,frame}=make(12,'slam');let peak=0;
 for(let i=0;i<fps*.5-1;i++){s.yuzuTickFx(1/fps);peak=Math.max(peak,frame());}
 assert(peak>=10);s.yuzuTickFx(.1);assert(!spr.active);
 const shield=make(8,'shield');shield.s.yuzuTickFx(.44);assert(shield.frame()>=6);shield.s._yzShield=null;shield.s.yuzuTickFx(.01);assert(!shield.spr.active);
}
ctx.Save.data.settings.reducedMotion=true;
const low=make(12,'rain');low.s.yuzuTickFx(.1);assert.equal(low.frame(),2);
const paused=make(12,'slam');paused.s.state='paused';paused.s.yuzuTickFx(.1);assert.equal(paused.q.t,0);
console.log('Yuzu phase 3B: 8/12-frame assets, complete one-shots, shield removal, pause and reduced-motion passed');
