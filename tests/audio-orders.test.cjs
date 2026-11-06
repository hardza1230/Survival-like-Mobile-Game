const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),counts={menu_progress:39,battle_events:32,yuzu:20,story_music:15,voices:33};let total=0;
for(const [kit,count] of Object.entries(counts)){
 const root='assets/incoming/audio_'+kit,requests=JSON.parse(fs.readFileSync(root+'/REQUESTS.json')),allManifest=JSON.parse(fs.readFileSync(root+'/MANIFEST.json')),qa=JSON.parse(fs.readFileSync(root+'/QA_REPORT.json')),allPrompts=JSON.parse(fs.readFileSync(root+'/PROMPTS.json')),manifest=allManifest.filter(x=>!x.key.startsWith('bgm_')),prompts=allPrompts.filter(x=>!x.key.startsWith('bgm_'));
 assert.equal(requests.length,count);assert.equal(manifest.length,count);assert.equal(prompts.length,count);assert.equal(qa.delivered,allManifest.length);
 assert.equal(new Set(manifest.map(r=>r.key)).size,count);
 for(const r of manifest){
  const path=`assets/audio/${kit}/${r.file}`,bytes=fs.readFileSync(path),hash=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(bytes.length,r.bytes);assert.equal(hash,r.sha256);assert(bytes.length>500);assert(src.includes(`${r.key}:'${path}'`),'literal build path');
  assert.deepEqual(bytes,fs.readFileSync(root+'/'+r.file));
  const q=qa.files.find(x=>x.key===r.key),request=requests.find(x=>x.key===r.key),prompt=prompts.find(x=>x.key===r.key);
  assert(q.passed&&q.decode&&q.nonSilent);assert(q.peakDbtp<=-1);assert(Math.abs(q.durationMs-request.durationMs)<2);assert(r.loop||q.leadingSilenceMs<5);
  assert.equal(prompt.provider,'ElevenLabs');assert.equal(prompt.endpoint,'sound-generation');assert.equal(prompt.parameters.text,request.prompt);
  const donor=fs.readFileSync(root+'/'+prompt.file);assert.equal(crypto.createHash('sha256').update(donor).digest('hex'),prompt.sha256);
 }
 total+=manifest.length;
}
assert.equal(total,139);assert(!/bgm_title:'assets\/audio\/story_music/.test(src),'source-only music is not registered as runtime');
const musicRoot='assets/incoming/audio_story_music',music=JSON.parse(fs.readFileSync(musicRoot+'/MUSIC_MANIFEST.json')),musicQa=JSON.parse(fs.readFileSync(musicRoot+'/MUSIC_QA_REPORT.json')),musicPrompts=JSON.parse(fs.readFileSync(musicRoot+'/PROMPTS.json'));
assert.equal(music.length,6);assert.equal(new Set(music.map(x=>x.key)).size,6);
for(const r of music){const bytes=fs.readFileSync(musicRoot+'/'+r.file),q=musicQa.files.find(x=>x.key===r.key),p=musicPrompts.find(x=>x.key===r.key);assert.equal(bytes.length,r.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256);assert(q?.passed&&q.decode&&q.nonSilent&&q.channels===2&&q.sampleRate===44100&&q.peakDbtp<=-1);assert(p?.provider==='ElevenLabs'&&p.endpoint==='music');const donor=fs.readFileSync(musicRoot+'/'+p.file);assert.equal(crypto.createHash('sha256').update(donor).digest('hex'),p.sha256);}

// A07 source delivery: the provisional cast and authored text remain auditable without boot-loading dialogue.
const voiceRoot='assets/incoming/audio_voice_acting',voiceManifest=JSON.parse(fs.readFileSync(voiceRoot+'/DIALOGUE_MANIFEST.json')),voiceQa=JSON.parse(fs.readFileSync(voiceRoot+'/DIALOGUE_QA_REPORT.json')),voiceRequests=JSON.parse(fs.readFileSync(voiceRoot+'/GENERATIONS_A07.json')),voiceCast=JSON.parse(fs.readFileSync(voiceRoot+'/VOICES.json'));
assert.equal(voiceManifest.files.length,350);assert.equal(voiceRequests.length,350);assert.equal(voiceQa.files,350);assert.equal(voiceQa.onsetOver20ms.length,0);assert.equal(Object.keys(voiceCast.savedVoiceIds).length,12);
for(const r of voiceManifest.files){const bytes=fs.readFileSync(voiceRoot+'/'+r.file),q=voiceQa.measurements.find(x=>x.key===r.key),p=voiceRequests.find(x=>x.key===r.key);assert.equal(bytes.length,r.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256);assert(q?.decode&&q.channels===1&&q.sampleRate===44100&&q.peakDbtp<=-1&&q.leadingSilenceMs<20);assert.equal(p?.text,r.text);assert.equal(p?.voice_id,voiceCast.savedVoiceIds[r.speaker]);}
const played=[],sounds=[],cache={exists:()=>true,get:()=>({duration:.5})};let now=1000;
const context={window:{__g:{cache:{audio:cache},sound:{add(key,opts){const s={key,opts,duration:.5,isPlaying:false,once(){},play(){this.isPlaying=true;played.push(key);},stop(){this.isPlaying=false;},destroy(){this.destroyed=true;},setVolume(v){this.opts.volume=v;},setRate(r){this.opts.rate=r;}};sounds.push(s);return s;}}}},Save:{data:{settings:{voices:true}}},performance:{now:()=>now},Math,setTimeout,clearTimeout};vm.createContext(context);
const a=src.indexOf('const Sfx = {'),b=src.indexOf('\n};',a)+3,S=vm.runInContext(src.slice(a,b)+'\nSfx',context);S.ctx={currentTime:1};
assert.equal(S.orderCue('counter_spawn'),true);S.orderCue('counter_spawn');assert.equal(played.length,1,'same cue throttled');
S.ctx.currentTime+=1;cache.exists=()=>false;assert.equal(S.orderCue('counter_hit'),false,'missing file preserves fallback');cache.exists=()=>true;
S.muted=true;const n=played.length;assert.equal(S.orderCue('counter_kick'),true);S.voice('ruby_happy');assert.equal(played.length,n);S.muted=false;
S.sv=0;S.voice('ruby_alert');S.orderCue('counter_kick');assert.equal(played.length,n);S.sv=1;
context.Save.data.settings.voices=false;S.voice('ruby_happy');assert.equal(played.length,n,'separate voice setting');context.Save.data.settings.voices=true;
S.voiceBlip('ruby');S.voiceBlip('boss_c1');assert.equal(played.length,n+1,'global voice throttle <=8 per second');
S.ctx.currentTime+=1;now+=1000;const beforeMenu=played.length;S.menuCue('merge_select');S.menuCue('forge_add');S.menuCue('login_open');assert.equal(played.length,beforeMenu+2,'menu maximum two overlapping cues');
S.eventLoopStart('arena_fog',.1);const fog=sounds.at(-1);S.eventLoopStart('arena_fog',.1);assert.equal(sounds.at(-1),fog,'reuse one loop');S.eventLoopStop('arena_fog');assert(fog.destroyed&&!fog.isPlaying);
assert(src.includes("k.startsWith('sfx_yz_')&&(this.character||Save.data.character||'momo')!=='yuzu'"),'other heroes skip companion audio');
console.log('Audio A01–A05: 139 original donors/runtime hashes, duration/peak/decode QA, literal delivery, mute/voice throttle/fallback/menu limits/loop lifecycle passed');
