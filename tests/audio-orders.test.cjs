const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),counts={menu_progress:39,battle_events:32,yuzu:20,story_music:15,voices:33};let total=0;
for(const [kit,count] of Object.entries(counts)){
 const root='assets/incoming/audio_'+kit,requests=JSON.parse(fs.readFileSync(root+'/REQUESTS.json')),manifest=JSON.parse(fs.readFileSync(root+'/MANIFEST.json')),qa=JSON.parse(fs.readFileSync(root+'/QA_REPORT.json')),prompts=JSON.parse(fs.readFileSync(root+'/PROMPTS.json'));
 assert.equal(requests.length,count);assert.equal(manifest.length,count);assert.equal(prompts.length,count);assert.equal(qa.delivered,count);
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
assert.equal(total,139);assert(!/bgm_title:'assets\/audio\/story_music/.test(src),'no fake music path');
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
