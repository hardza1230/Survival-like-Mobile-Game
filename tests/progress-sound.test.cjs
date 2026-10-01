const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const source=fs.readFileSync('game.js','utf8');
function actionLine(marker){const at=source.indexOf(marker);assert(at>=0,marker);const line=source.slice(source.lastIndexOf('\n',at)+1,source.indexOf('\n',at));const start=line.indexOf('()=>{');return line.slice(start,line.lastIndexOf('});')+1);}
function bind(code,context){vm.createContext(context);const factory=vm.runInContext('(function(){return '+code+';})',context);return factory.call({showBanner(){},menuToast(){},buildDaily(){},buildAchievements(){},buildMenuScreen(){}});}
for(const type of ['daily','achievement']){
 let total=0;const cues=[],d={streak:0,claimDay:''},achievement={id:'test',reward:25,emoji:'',name:'Test',test:()=>true};
 const context={d,spec:{key:'today'},localDayKey:()=> 'yesterday',a:achievement,Save:{data:{achievements:{}},addSugar:n=>total+=n},Sfx:{progress:k=>cues.push(k)}};
 const callback=bind(actionLine(type==='daily'?'if(d.claimDay===spec.key)return;':'if(Save.data.achievements[a.id]||!a.test'),context);callback();const reward=total;assert(reward>0);callback();assert.equal(total,reward);assert.deepEqual(cues,[type]);
}
for(const [marker,cue] of [['if(Save.buyTal(k))','core'],['if(Save.buySpecialCore(core.id))','core'],['if(Save.buyOvercap(k))','overcap']]){
 for(const success of [true,false]){const cues=[];const c={k:'hp',core:{id:'magnet',name:'Magnet'},u:{name:'HP'},cost:1,stn:0,cst:{stones:1,sugar:1},se:'',Save:{buyTal:()=>success,buySpecialCore:()=>success,buyOvercap:()=>success,overcap:()=>1},Sfx:{progress:k=>cues.push(k),select(){},error(){}}};bind(actionLine(marker),c)();assert.deepEqual(cues,success?[cue]:[]);}
}
const a=source.indexOf('const Sfx = {'),b=source.indexOf('\n};',a)+3;const played=[],voices=[];const c={window:{__g:{cache:{audio:{exists:()=>true}},sound:{add:(key,opts)=>{const s={key,opts,isPlaying:false,once(e,f){this.done=f;},play(){this.isPlaying=true;played.push(key);},stop(){this.isPlaying=false;},destroy(){this.destroyed=true;}};voices.push(s);return s;}}}},performance:{now:()=>1000},Math,setTimeout,clearTimeout};vm.createContext(c);const S=vm.runInContext(source.slice(a,b)+'\nSfx',c);
for(const k of ['core','talent','overcap','promotion','perk','ancient','daily','achievement','quest','claim']){S.progress(k);assert.equal(played.at(-1),'sfx_craft_progress_'+k);assert.equal(S._craftVoices.length,1);const f=fs.readFileSync(`assets/audio/sfx/progress/progress_${k}.wav`);let peak=0;for(let i=44;i<f.length;i+=2)peak=Math.max(peak,Math.abs(f.readInt16LE(i)));assert(peak>0&&peak<32767);assert((f.length-44)/88200<=.41);assert(source.includes(`sfx_craft_progress_${k}:`));}
const count=played.length;S.muted=true;S.progress('core');S.muted=false;S.sv=0;S.progress('quest');assert.equal(played.length,count);S.sv=.5;S.progress('talent');assert.equal(voices.at(-1).opts.volume,.15);
c.window.__g.cache.audio.exists=()=>false;const notes=[];S.seq=n=>notes.push(n);S.progress('promotion');assert.equal(notes.at(-1).length,4);
console.log('Progress audio: actual core/reward callbacks, duplicate claims, mute/volume, fallback, voice cleanup and WAV limits passed');
