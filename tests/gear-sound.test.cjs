const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8'),a=source.indexOf('const Sfx = {'),end=source.indexOf('\n};',a)+3;
const played=[],voices=[];const context={window:{__g:{cache:{audio:{exists:()=>true}},sound:{add:(key,opts)=>{const s={key,opts,isPlaying:false,once(e,fn){this.done=fn;},play(){this.isPlaying=true;played.push(key);},stop(){this.isPlaying=false;},destroy(){this.destroyed=true;}};voices.push(s);return s;}}}},performance:{now:()=>1000},Math,setTimeout,clearTimeout};vm.createContext(context);const S=vm.runInContext(source.slice(a,end)+'\nSfx',context);
for(const result of ['success','break','destroy']){S.equipmentEnhance({result});assert.equal(played.at(-1),'sfx_craft_gear_enhance_'+result);assert.equal(S._craftVoices.length,1);}
const n=played.length;S.equipmentEnhance(null);S.equipmentEnhance({result:'invalid'});assert.equal(played.length,n);
S.muted=true;S.equipment('equip');assert.equal(played.length,n);S.muted=false;S.sv=0;S.equipment('sell');assert.equal(played.length,n);S.sv=.5;S.equipment('unlock');assert.equal(voices.at(-1).opts.volume,.15);assert.equal(voices.at(-1).opts.rate,1);
context.window.__g.cache.audio.exists=()=>false;const notes=[];S.seq=v=>notes.push(v);S.equipment('dismantle');assert.equal(notes.at(-1).length,3);
for(const name of ['equip','lock','unlock','enhance_success','enhance_break','enhance_destroy','dismantle','sell']){const f=fs.readFileSync(`assets/audio/sfx/gear/gear_${name}.wav`);assert.equal(f.toString('ascii',0,4),'RIFF');let peak=0;for(let i=44;i<f.length;i+=2)peak=Math.max(peak,Math.abs(f.readInt16LE(i)));assert(peak>0&&peak<32767);assert((f.length-44)/88200<=.33);assert(source.includes(`sfx_craft_gear_${name}:`));}
// Execute the actual inventory enhancement callback, including rejected spending.
const start=source.indexOf("can?()=>{ if(!afford){Sfx.error();"),finish=source.indexOf('this.buildMenuScreen(); }:null',start);
const callback=source.slice(start+4,finish)+'this.buildMenuScreen(); }';
for(const result of ['success','break','destroy','no_shards','stale_wallet']){
 const events=[];let spent=0;const c={afford:result!=='no_shards',cost:10,selected:{uid:'gear'},Save:{spendShards:()=>{if(result==='stale_wallet')return false;spent+=10;return true;},enhance:()=>({result,lv:4})},Sfx:{error:()=>events.push('error'),equipmentEnhance:r=>events.push(r.result)}};vm.createContext(c);
 const factory=vm.runInContext('(function(){return '+callback+';})',c);const scene={buildMenuScreen(){},showBanner(){},screenFlash(){},gearSelectedUid:'gear'};factory.call(scene)();
 assert.deepEqual(events,result==='no_shards'?['error']:result==='stale_wallet'?[]:[result]);assert.equal(spent,['no_shards','stale_wallet'].includes(result)?0:10);if(result==='destroy')assert.equal(scene.gearSelectedUid,null);
}
// Equipment/destruction actions only emit a result after the save reports success.
for(const [call,cue] of [['Save.equipGearInstance(sel,selected.uid)','equip'],['Save.dismantleGearInstance(selected.uid)','dismantle'],['Save.sellGearInstance(selected.uid)','sell'],['Save.dismantleGearInbox(item.uid)','dismantle']]){
 const marker=source.indexOf(call),line=source.slice(source.lastIndexOf('\n',marker)+1,source.indexOf('\n',marker));assert(line.includes(`Sfx.equipment('${cue}')`));if(cue==='equip')assert(line.includes('if('+call+')'));else assert(line.includes('if(n){'));
}
console.log('Equipment audio: actual enhancement callbacks, all outcomes/rejections, mute/volume, fallback and WAV limits passed');
