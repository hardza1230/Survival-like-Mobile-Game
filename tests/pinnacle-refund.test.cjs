// v8.1.142 (endgame bot): Back on the Pinnacle preparation screen must refund the free entry / keys spent by startPinnacle.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const grab=n=>{const i=src.indexOf('  '+n+'(');assert(i>0,n);let d=0,j=src.indexOf('{',i);for(let k=j;k<src.length;k++){if(src[k]==='{')d++;else if(src[k]==='}'){d--;if(!d)return src.slice(i,k+1);}}};
const save={riftKeys:0,pinnacleFreeUsed:false,delve:{best:30}};
const ctx={Sfx:{},Save:{data:save,save(){}},atlasPinnacleOpen:()=>true,PINNACLE_KEY_COST:3,RECIPE_FRAGS_PER_KEY:5,COLORS:{grape:1,pink:2}};
vm.createContext(ctx);
vm.runInContext('class S{'+grab('startPinnacle')+grab('openEndgamePreparation')+'}; this.S=S;',ctx);
const s=new ctx.S();let btns=[];
Object.assign(s,{W:390,H:844,menu:{add(){},removeAll(){}},tapZones:[],add:{text:()=>({setOrigin(){return this;}})},_screenBg(){},menuToast(){},buildMenuScreen(){},
  uiPillBtn:(m,x,y,w,h,c,e,label,fn)=>btns.push({label,fn}),startRun(idx){ if(this._pinnacleRequested&&!this._farmFocusRequested)this.openEndgamePreparation(idx); }});
// free entry
s.startPinnacle(); assert.strictEqual(save.pinnacleFreeUsed,true,'free entry used when Pinnacle starts');
btns.find(b=>b.label==='Back').fn(); assert.strictEqual(save.pinnacleFreeUsed,false,'Back refunds the free entry'); assert.strictEqual(s._pinnacleRequested,false);
// key entry
save.pinnacleFreeUsed=true; save.riftKeys=5; btns=[]; s.startPinnacle(); assert.strictEqual(save.riftKeys,2);
btns.find(b=>b.label==='Back').fn(); assert.strictEqual(save.riftKeys,5,'Back refunds the keys');
console.log('pinnacle-refund ok');
