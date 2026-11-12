const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const s=fs.readFileSync('game.js','utf8');
function method(name){const at=s.indexOf('  '+name+'('),tail=s.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,name);return s.slice(at,at+1+next.index);}
// v8.1.43 A09: 28 Ruby stage clips — files verified, catalog rows, short reminders match on-screen text (progress stripped), reactions rotate and throttle
const M=JSON.parse(fs.readFileSync('assets/incoming/audio_ruby_a09/MANIFEST.json','utf8')).files;assert.equal(M.length,28);
const ctx={performance:{now:()=>0},Save:{data:{settings:{}}},Sfx:{},window:{},StoryMusic:{}};vm.createContext(ctx);
vm.runInContext(s.slice(s.indexOf('const A07_CATALOG = '),s.indexOf('const VoiceActing=')),ctx);const i=s.indexOf('const RUBY_TIPS={');vm.runInContext(s.slice(i,s.indexOf('\n};',i)+3),ctx);
const C=vm.runInContext('A07_CATALOG',ctx),B=vm.runInContext('A07_BY_TEXT',ctx),T=vm.runInContext('RUBY_TIPS',ctx);
for(const r of M){const b=fs.readFileSync('assets/audio/acting/'+r.file);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);assert.equal(C[r.key].text,r.text);assert.equal(C[r.key].role,'ruby');assert(s.includes('"url":"assets/audio/acting/'+r.file+'"'));}
const lookup=t=>B.get('ruby|'+String(t).replace(/\s+·\s+\d+\/\d+$/,'').replace(/[\[\]]/g,''));
for(const k in T)if(T[k].short){assert.equal(lookup(T[k].short),'vo_ruby_short_'+k,k);assert.equal(lookup(T[k].short+'  ·  3/10'),'vo_ruby_short_'+k,'progress suffix ignored');}
assert(s.includes(".replace(/\\s+·\\s+\\d+\\/\\d+$/,'')"),'runtime lookup strips progress');
// rubyReact rotation, 8s throttle, clear speaks without bubble
let now=100000;const said=[],spoke=[];const sc={state:'play',rubyOn:()=>true,rubySay:t=>said.push(t),voiceLine:(r,t)=>spoke.push(t),time:null};
const R=vm.runInContext('({'+method('rubyVoiceReact')+'\n})',Object.assign(ctx,{Date:{now:()=>now}}));const react=R.rubyVoiceReact.bind(sc);
assert(react('bossdown'));assert(!react('wave'),'30s throttle');now+=9000;assert(react('bossdown'),'boss down is never throttled');assert.notEqual(said[0],said[1],'rotates');now+=9000;assert(react('clear'));assert.equal(spoke.length,1);assert(!react('nothing'));
now+=31000;assert(react('objdone'));assert(!react('lowhp'),'30s gap after a line');now+=31000;assert(!react('objdone'),'v8.1.88 objective line once per stage');assert(react('lowhp'));
for(const h of ["this.rubyVoiceReact?.('objdone',300)","this.rubyVoiceReact?.('bossdown',1800)","this.rubyVoiceReact?.('revive',1600)","this.rubyVoiceReact?.('lowhp',4000)","this.rubyVoiceReact?.('wave',400)","this.rubyVoiceReact?.('timer')","this.rubyVoiceReact?.('clear',1200)"])assert(s.includes(h),h);
assert(s.includes("nw-(sa[vk]||0)<30000"),'short reminder voice at most every 30s');
assert(s.includes('startStage(i){this._rubyOnce=null;this._rubyEpoch=(this._rubyEpoch|0)+1;this.rubyHide?.(true);this._rubyQ=[];'),'v8.1.89 new stage drops old Ruby lines');assert(/rubyLater\(delay,fn\)\{ const ep=this\._rubyEpoch\|0;/.test(s)&&/this\.rubyLater\(delay,\(\)=>this\.rubySay\(text/.test(s),'delayed tips are stage-bound');
console.log('Ruby A09: 28 verified clips, 14 short reminders matched (progress-safe), 7 reactions hooked, rotation/throttle/clear passed');
// v8.1.108 A13: 31 Ruby clips (core lore + 14 mission tips/shorts) present, hashed, and found by text
{const M13=JSON.parse(fs.readFileSync('assets/incoming/audio_ruby_a13/MANIFEST.json','utf8'));assert.equal(M13.length,31);for(const r of M13){const b=fs.readFileSync('assets/audio/acting/'+r.file);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);assert.equal(C[r.key].text,r.text);assert.equal(lookup(r.text),r.key,r.key);}
for(const k in T){assert.equal(lookup(T[k].say),'vo_ruby_tip_'+k,'tip voiced '+k);}
const cl=/const CORE_LORE_LINES=\[(.*?)\];/.exec(s)[1].match(/'((?:[^'\\]|\\.)*)'/g).map(x=>x.slice(1,-1));cl.forEach((t,i)=>assert.equal(lookup(t),'vo_ruby_core_'+(i+1)));console.log('A13 Ruby voice: 31 clips, every mission tip and core-lore page voiced passed');}
