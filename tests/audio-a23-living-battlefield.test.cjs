const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.js'),'utf8');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const M=read('assets/incoming/audio_a23/MANIFEST.json'),Q=read('assets/incoming/audio_a23/QA_REPORT.json'),P=read('assets/incoming/audio_a23/PROMPTS.json'),R=read('assets/audio/a23/MANIFEST.json');
assert.equal(M.length,264);assert.equal(Q.length,264);assert(Q.every(q=>q.passed));assert.equal(R.length,222);
assert.deepEqual(Object.fromEntries(['patterns','events','ambience','monsters','voice','boss_ambience'].map(c=>[c,M.filter(r=>r.category===c).length])),{patterns:60,events:32,ambience:45,monsters:64,voice:48,boss_ambience:15});
for(const r of M){
 const b=fs.readFileSync(path.join(root,'assets/incoming/audio_a23',r.file));assert.equal(b.length,r.bytes,r.key);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);
 const p=P.find(p=>p.key===r.key);assert(p&&p.provider==='ElevenLabs',r.key);
 if(r.kind==='voice'){assert.equal(p.parameters.text,r.text);assert.equal(p.voice_id,r.voice_id);assert(!r.text.includes("'"),'English dialogue uses curly apostrophes');}
 assert(r.peakDbtp<=-1,r.key);
}
const PK=require('./_packed.cjs');   /* v8.3.8 runtime MP3s recompressed in place (assets/RECOMPRESSED.json) */
for(const r of R){const rp='assets/audio/a23/'+r.file,b=fs.readFileSync(path.join(root,rp));assert.equal(PK.bytes(rp,b),r.bytes);assert.equal(PK.sha(rp,b),r.sha256);assert(src.includes(r.url));assert(r.peakDbtp<=-1);}
const voices=vm.runInNewContext(src.match(/const A23_VOICES=[^\n]+/)[0]+';A23_VOICES',{});
assert.equal(Object.keys(voices).length,48);for(const r of M.filter(r=>r.kind==='voice'))assert.equal(voices[r.key].text,r.text);
const a=src.indexOf('\n  a23(family,'),z=src.indexOf('\n  playFile(',a),played=[],cache=new Set(['sfx_a23_monster_ice_attack_1','sfx_a23_monster_ice_attack_2']);
const S=vm.runInNewContext('({'+src.slice(a+3,z)+'muted:false,sv:1,_ok(){return true;},playFile(k){played.push(k);return true;}})',{Math,played,window:{__g:{cache:{audio:{exists:k=>cache.has(k)}}}}});
for(let i=0;i<20;i++)assert(S.a23('monster_ice_attack'));
for(let i=1;i<played.length;i++)assert.notEqual(played[i],played[i-1],'alternate variants without immediate repeat');
assert.equal(S.a23('monster_ember_attack'),false,'missing sound preserves fallback');S._ok=()=>false;const before=played.length;assert.equal(S.a23('monster_ice_attack'),true);assert.equal(played.length,before,'rate limit suppresses duplicate sound');S.muted=true;assert.equal(S.a23('missing'),true,'mute cannot trigger a fallback');
const familyLine=src.match(/const A23_STAGE_FAMILY=[^\n]+/)[0],keysLine=src.match(/function a23StageKeys\(index\)[^\n]+/)[0],ASSET_AUDIO=Object.fromEntries(R.filter(r=>r.key.startsWith('sfx_')).map(r=>[r.key,r.url]));
const choose=vm.runInNewContext(familyLine+'\n'+keysLine+';a23StageKeys',{ASSET_AUDIO,STAGE_AMBIENT_ON:true});
assert.equal(vm.runInNewContext(familyLine+'\n'+keysLine+';a23StageKeys',{ASSET_AUDIO,STAGE_AMBIENT_ON:false})(0).filter(k=>k.includes('_ambience_')).length,0,'v8.3.31 owner: ambience off = never loaded');
for(let i=0;i<15;i++){
 const keys=choose(i);assert.equal(keys.filter(k=>k.includes('_ambience_')).length,2);assert(keys.includes('sfx_a23_ambience_s'+String(i+1).padStart(2,'0')+'_1'));
 assert.equal(keys.filter(k=>k.includes('_monster_')).length,8);assert.equal(keys.filter(k=>k.includes('_pattern_')).length,60);assert.equal(keys.filter(k=>k.includes('_event_')).length,32);
}
const boot=src.match(/function bootKeepAudio\(k\)[^\n]+/)[0];const keep=vm.runInNewContext(boot+';bootKeepAudio',{});for(const r of R)assert.equal(keep(r.key),false,'new library never boots');
assert.equal((src.match(/if\(k\.startsWith\('sfx_a23_'\)\)continue;/g)||[]).length,2,'both broad prefetch paths exclude A23');
function method(name,next){const a=src.indexOf('\n  '+name+'('),b=src.indexOf('\n  '+next+'(',a);assert(a>0&&b>a);return src.slice(a+3,b);}
const calls=[],E=vm.runInNewContext('({'+method('enemyAudio','chapterEventAudio')+'})',{A23_STAGE_FAMILY:['ice'],Math,Sfx:{a23:(...args)=>calls.push(args)}});E.a23Cue=(...args)=>calls.push(args);E.state='play';E.stageIndex=0;E.player={x:0,y:0};
E.enemyAudio({active:true,x:20,y:20},'hurt');assert.equal(calls.length,1);E.enemyAudio({active:true,x:999,y:0},'hurt');E.enemyAudio({active:true,x:0,y:0,isBoss:true},'attack');E.enemyAudio({active:true,x:0,y:0,isDummy:true},'spawn');assert.equal(calls.length,1,'distant enemies/bosses/dummies stay quiet');
const B=vm.runInNewContext('({'+method('tickA23Audio','enemyAudio')+'})',{A23_STAGE_FAMILY:[],STAGE_AMBIENT_ON:true,Sfx:{eventLoopStart:(...a)=>calls.push(a)}});Object.assign(B,{state:'play',stageIndex:2,player:{active:true},elapsed:0});B.tickA23Audio();const n=calls.length;B.tickA23Audio();assert.equal(calls.length,n,'ambience heartbeat throttled');B.elapsed=2;B.state='paused';B.tickA23Audio();assert.equal(calls.length,n,'paused does not start ambience');
const reaction=method('reaction','bark'),V=vm.runInNewContext('({'+reaction+'enabled(){return true;},busy(){return false;},lastBark:-Infinity,play(scene,key,valid){assert(valid());calls.push(key);return true;}})',{A23_VOICES:voices,performance:{now:()=>30000},calls,assert,Math});
const scene={state:'play',character:'mint',player:{active:true},_artEpoch:1};assert(V.reaction(scene,3));assert.equal(calls.at(-1),'vo_a23_mint_reaction_3');V.lastBark=29900;assert.equal(V.reaction(scene,3),false,'reaction spacing protects dialogue');
{ const off=vm.runInNewContext('({'+method('tickA23Audio','enemyAudio')+'})',{A23_STAGE_FAMILY:[],STAGE_AMBIENT_ON:false,Sfx:{eventLoopStart:()=>{throw new Error('ambience started');},eventLoopStop:k=>calls.push(['stop',k])}}); Object.assign(off,{state:'play',stageIndex:2,player:{active:true},elapsed:0,_a23AmbientKey:'a23_ambience_s03_1'}); off.tickA23Audio(); assert.equal(off._a23AmbientKey,null,'running loop stopped'); }
console.log('A23 audio: 264 verified masters, 222 runtime files, provenance/text, variants, fallback, stage-only loading, quiet monsters and guarded reactions PASS');
