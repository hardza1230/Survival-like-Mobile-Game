const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8'),a=source.indexOf('const Sfx = {'),end=source.indexOf('\n};',a)+3;
let now=0;const played=[],voices=[];
const context={window:{__g:{cache:{audio:{exists:()=>true}},sound:{add:(key,opts)=>{const s={key,opts,isPlaying:false,once(e,fn){this.done=fn;},play(){this.isPlaying=true;played.push(key);},stop(){this.isPlaying=false;},destroy(){this.destroyed=true;}};voices.push(s);return s;}}}},performance:{now:()=>now},Math,setTimeout,clearTimeout};
vm.createContext(context);const S=vm.runInContext(source.slice(a,end)+'\nSfx',context);
S.craft('start');S.craft('tick');S.craft('tick');assert.equal(played.length,2);
now=55;S.craft('tick',.1);assert.equal(voices.at(-1).opts.rate,.8);assert(voices[0].destroyed);assert.equal(S._craftVoices.length,2);
S.craft('jackpot');assert.equal(S._craftVoices.length,1);assert(voices[1].destroyed);assert(voices[2].destroyed);
S.craft('cancel');assert(voices[3].destroyed);S._craftVoices[0].done();assert.equal(S._craftVoices.length,0);
const n=played.length;S.muted=true;S.craft('start');S.muted=false;S.sv=0;S.craft('exhaust');assert.equal(played.length,n);
S.sv=.5;S.craft('rare');assert.equal(voices.at(-1).opts.volume,.15);S.stopCraft();assert(voices.at(-1).destroyed);
context.window.__g.cache.audio.exists=()=>false;const fallback=[];S.seq=(notes,type,vol)=>fallback.push({notes,vol});S.craft('exhaust');assert.equal(fallback[0].notes.length,2);
const block=source.slice(source.indexOf('  _playAffixRoulette('),source.indexOf('  promoteFocusedItem()'));
assert(!/Sfx\.(chest|slot|legend|ult|clear|card)/.test(block));assert(block.includes('if(this._craftRollToken!==token)return; if(stopped)'));
for(const name of ['start','tick','slow','common','rare','jackpot','near','cancel','exhaust','capacity','reroll','remove','reset']){const f=fs.readFileSync(`assets/audio/sfx/craft/craft_${name}.wav`);assert.equal(f.toString('ascii',0,4),'RIFF');let peak=0;for(let i=44;i<f.length;i+=2)peak=Math.max(peak,Math.abs(f.readInt16LE(i)));assert(peak>0&&peak<32767);assert((f.length-44)/88200<=.4);assert(source.includes(`sfx_craft_${name}:`));}
console.log('Craft audio: tick throttle, voice cleanup, result replacement, mute/volume, fallback, wiring and WAV limits passed');

for(const kind of ['capacity','reroll','remove','reset']){S.craft(kind);assert(fallback.at(-1).notes.length>=2);}
