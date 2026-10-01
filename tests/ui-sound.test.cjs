const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8'),a=source.indexOf('const Sfx = {'),b=source.indexOf('\n/*',a);const end=source.indexOf('\n};',a)+3;
const played=[],voices=[];let now=1;const ctx={window:{__g:{cache:{audio:{exists:()=>true}},sound:{add:(key,opts)=>{const v={key,opts,isPlaying:false,once(e,fn){this.done=fn;},play(){this.isPlaying=true;played.push(key);},stop(){this.isPlaying=false;},destroy(){this.destroyed=true;}};voices.push(v);return v;}}}},performance:{now:()=>now*1000},setTimeout,clearTimeout,Math};vm.createContext(ctx);const S=vm.runInContext(source.slice(a,end)+'\nSfx',ctx);S.ctx={currentTime:now};
S.uiAction('click',()=>{S.select();S.select();});assert.deepEqual(played,['sfx_ui_click']);
now+=.1;S.ctx.currentTime=now;S.uiAction('click',()=>{S.select();S.back();S.confirm();S.error();});assert.equal(played.at(-1),'sfx_ui_error');
now+=.1;S.ctx.currentTime=now;S.uiAction('back',()=>S.select());assert.equal(played.at(-1),'sfx_ui_back');assert(voices[0].destroyed);assert(S._uiVoices.length<=2);
const n=played.length;S.muted=true;S.select();assert.equal(played.length,n);S.muted=false;S.sv=0;S.confirm();assert.equal(played.length,n);S.sv=.5;
now+=.1;S.ctx.currentTime=now;S.confirm();assert.equal(voices.at(-1).opts.volume,.135);assert.equal(voices.at(-1).opts.rate,1);
assert.throws(()=>S.uiAction('click',()=>{throw Error('test');}));assert.equal(S._uiPending,undefined);
for(const k of ['click','back','confirm','error']){const f=fs.readFileSync('assets/audio/sfx/ui/ui_'+k+'.wav');assert.equal(f.toString('ascii',0,4),'RIFF');let peak=0;for(let i=44;i<f.length;i+=2)peak=Math.max(peak,Math.abs(f.readInt16LE(i)));assert(peak<32767);assert((f.length-44)/88200<=.18);}
console.log('UI sounds: one cue, priority, back, two voices, mute/volume, cleanup and WAV limits passed');
