// v8.1.159 Clean Air "Wildwood" fog of war: dark screen overlay, holes for the Wisp ring, the walked trail and the hero; mission starts only inside the ring; texture swap waits until unused; Titan keeps art shockwave.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{ const i=src.indexOf('\n  '+n+'('); assert(i>0,n); let k=src.indexOf('\n',i+1); while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1); return src.slice(i+3,k); };
const S=vm.runInNewContext('class S{'+grab('cleanAirFogWar')+'}; S',{Math,CLEANAIR_FOGWAR:true,document:undefined});
const s=new S(); let erased=0,filled=0;
const rt={scene:1,setOrigin(){return rt;},setDepth(){return rt;},clear(){erased=0;return rt;},fill(){filled++;return rt;},erase(){erased++;return rt;}};
const brush={setOrigin(){return brush;},setPosition(){return brush;},setScale(){return brush;}};
Object.assign(s,{W:400,H:800,add:{renderTexture:()=>rt},camUI:o=>o,cameras:{main:{worldView:{x:0,y:0},zoom:1}},textures:{exists:()=>true},make:{image:()=>brush},player:{x:200,y:400}});
const c={x:200,y:300,r:145};
s.cleanAirFogWar(c,1/60,false); assert.equal(c.rev.length,0,'armed: nothing revealed yet'); assert.equal(erased,2,'ring + hero holes');
for(let i=0;i<10;i++){ c.x+=40; s.cleanAirFogWar(c,1/60,true); } assert.equal(c.rev.length,10,'trail remembered'); assert(filled>0);
c.x+=5000; s.cleanAirFogWar(c,1/60,true); assert(erased<c.rev.length+2,'off-screen trail points culled');
assert(src.includes("if(o.type==='cleanAir'&&this._cleanAir){")&&src.includes("t:Infinity,ring:true"),'ring arm: no button, no auto start');
assert(src.includes("if(c&&P&&Math.hypot(P.x-c.x,P.y-c.y)<=c.r){ A.t=0;"),'starts when the hero is inside');
assert(src.includes("const CLEANAIR_FOGWAR=true;")&&src.includes("'_cleanAirFog','_cleanAirFogRT'"),'switch + cleanup');
assert(src.includes("if(t&&t._codeTex)return; if(inUse(k))return;")&&src.includes("if(this._texInUseFn?.(k))return;"),'no texture swap while in use (glTexture null fix)');
assert(src.includes("/^bpx_cocoa_(?:dashring|landing_dust)$/.test(key)"),'Titan shockwave/crack art restored');
console.log('Clean Air fog of war + texture-swap guard + Titan art passed');
