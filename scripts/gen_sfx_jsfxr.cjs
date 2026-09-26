const {sfxr,Params,SoundEffect}=require('jsfxr');const fs=require('fs');
let seed=1;Math.random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const SR=44100;
function wav(f32,name,gain=0.9){ // 16-bit mono, trim silence, fade tail
  let a=0,b=f32.length-1;while(a<b&&Math.abs(f32[a])<0.002)a++;while(b>a&&Math.abs(f32[b])<0.002)b--;
  const d=f32.slice(a,b+1);let pk=0;for(const v of d)pk=Math.max(pk,Math.abs(v));const k=pk?gain/pk:1;
  const n=d.length,buf=Buffer.alloc(44+n*2);buf.write('RIFF',0);buf.writeUInt32LE(36+n*2,4);buf.write('WAVEfmt ',8);
  buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(1,22);buf.writeUInt32LE(SR,24);buf.writeUInt32LE(SR*2,28);buf.writeUInt16LE(2,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(n*2,40);
  const fade=Math.min(400,n);for(let i=0;i<n;i++){let v=d[i]*k;if(i>n-fade)v*=(n-i)/fade;buf.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(v*32767))),44+i*2);}
  fs.writeFileSync('out/'+name+'.wav',buf);console.log(name,(n/SR).toFixed(2)+'s');}
function preset(alg,s,tweak){seed=s;const p=sfxr.generate(alg,{sample_rate:SR,sample_size:16});if(tweak)tweak(p);return new SoundEffect(p).getRawBuffer().normalized;}
function mix(...parts){const L=Math.max(...parts.map(([a,off=0,g=1])=>a.length+off));const o=new Float32Array(L);for(const [a,off=0,g=1] of parts)for(let i=0;i<a.length;i++)o[i+off]+=a[i]*g;return o;}
function note(freq,dur,type='square',vol=0.5){const n=Math.floor(dur*SR),o=new Float32Array(n);for(let i=0;i<n;i++){const t=i/SR,ph=(t*freq)%1;let v=type==='square'?(ph<0.5?1:-1):type==='tri'?(4*Math.abs(ph-0.5)-1):Math.sin(2*Math.PI*ph);const env=Math.min(1,i/200)*Math.pow(1-i/n,1.6);o[i]=v*env*vol;}return o;}
function seq(notes,step,type,vol){return mix(...notes.map((f,i)=>[note(f,step*1.8,type,vol),Math.floor(i*step*SR)]));}
fs.mkdirSync('out',{recursive:true});
wav(mix([preset('hitHurt',7,p=>{p.p_base_freq=0.55;p.p_env_decay=0.22;})],[note(1800,0.07,'tri',0.35),200]),'sfx_crit');
wav(mix([preset('explosion',11,p=>{p.p_env_sustain=0.12;p.p_env_decay=0.35;})],[note(70,0.3,'sine',0.8)]),'sfx_kill_big');
wav(preset('hitHurt',23,p=>{p.p_base_freq=0.28;p.p_env_decay=0.28;p.p_env_sustain=0.05;}),'sfx_hurt');
wav(seq([784,988,1319],0.06,'tri',0.5),'sfx_heal');
wav(preset('powerUp',31,p=>{p.p_env_decay=0.2;}),'sfx_magnet');
wav(preset('explosion',41,p=>{p.p_base_freq=0.35;p.p_env_decay=0.22;p.p_freq_ramp=-0.3;}),'sfx_thunder');
wav(mix([preset('hitHurt',53,p=>{p.p_base_freq=0.18;p.wave_type=3;p.p_env_decay=0.14;})],[note(90,0.12,'sine',0.9)]),'sfx_punch');
wav(mix([preset('laserShoot',61)],[note(1600,0.2,'sine',0.45)],[note(2400,0.16,'tri',0.2),1300]),'sfx_beam');
wav(preset('explosion',71,p=>{p.p_base_freq=0.6;p.p_env_decay=0.12;}),'sfx_burn',0.5);
wav(mix([preset('blipSelect',81)],[note(1400,0.06,'tri',0.3),1500]),'sfx_card');
wav(seq([523,659,784,1047,1319,1568],0.09,'tri',0.45),'sfx_legend');
wav(seq([523,659,784,1047,784,1047],0.13,'square',0.28),'sfx_victory');
wav(seq([392,311,247,196],0.16,'tri',0.45),'sfx_defeat');
// v5.0.2 — เสียงที่ได้ยินบ่อยสุด: ตีโดน (ป๊อปโมจินุ่ม ๆ สั้นมาก) + เก็บ EXP (ติ๊งใส · เกมไล่ pitch ให้เอง)
wav(mix([preset('hitHurt',101,p=>{p.p_base_freq=0.42;p.p_env_decay=0.09;p.p_env_sustain=0.01;p.wave_type=2;})],[note(520,0.05,'sine',0.5)],[note(260,0.06,'sine',0.35),60]),'sfx_hit',0.8);
wav(mix([note(1568,0.09,'sine',0.55)],[note(2093,0.12,'sine',0.4),2200],[note(3136,0.07,'tri',0.12),2200]),'sfx_xp',0.7);
wav(mix([preset('hitHurt',61,p=>{p.p_base_freq=0.32;p.wave_type=3;p.p_env_decay=0.07;p.p_env_sustain=0.01;})],[note(140,0.06,'sine',0.7)]),'sfx_punch_jab');
wav(mix([preset('explosion',67,p=>{p.p_base_freq=0.2;p.p_env_sustain=0.04;p.p_env_decay=0.2;p.p_freq_ramp=-0.25;})],[note(60,0.22,'sine',1.0)],[preset('hitHurt',71,p=>{p.p_base_freq=0.45;p.p_env_decay=0.08;}),0,0.6]),'sfx_punch_heavy');
wav(mix([preset('explosion',83,p=>{p.p_base_freq=0.12;p.p_env_sustain=0.1;p.p_env_decay=0.4;})],[note(48,0.4,'sine',1.0)],[seq([523,659,784,1047],0.05,'square',0.25),2000]),'sfx_punch_frenzy');
wav(mix([note(1760,0.03,'square',0.5)],[note(880,0.05,'tri',0.4)]),'sfx_beat_tick');
wav(seq([392,523,659,784,1047],0.06,'square',0.35),'sfx_beat_start');
wav(mix([seq([1047,1319,1568,2093],0.045,'tri',0.5)],[preset('pickupCoin',91,p=>{p.p_env_decay=0.15;}),0,0.5]),'sfx_beat_perfect');
wav(seq([784,1047],0.05,'tri',0.5),'sfx_beat_good');
wav(mix([note(180,0.18,'square',0.4)],[note(120,0.2,'sine',0.5),2000]),'sfx_beat_miss');
function wavLoop(d,name,gain=0.8){let pk=0;for(const v of d)pk=Math.max(pk,Math.abs(v));const k=pk?gain/pk:1,n=d.length,buf=Buffer.alloc(44+n*2);buf.write('RIFF',0);buf.writeUInt32LE(36+n*2,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(1,22);buf.writeUInt32LE(SR,24);buf.writeUInt32LE(SR*2,28);buf.writeUInt16LE(2,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(n*2,40);for(let i=0;i<n;i++)buf.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(d[i]*k*32767))),44+i*2);fs.writeFileSync('out/'+name+'.wav',buf);console.log(name,(n/SR).toFixed(2)+'s');}
// v5.56 Bear Beat Rush: กรูฟ 120BPM 4 ห้อง (8 วิ) + เสียงท่าพิเศษ
{const SPB=0.5,R=a=>Math.floor(a*SR),parts=[];const kick=mix([note(55,0.18,'sine',1.0)],[note(110,0.04,'sine',0.6)]);
 const snare=preset('hitHurt',201,p=>{p.wave_type=3;p.p_base_freq=0.5;p.p_env_decay=0.12;});const hat=preset('hitHurt',203,p=>{p.wave_type=3;p.p_base_freq=0.9;p.p_env_decay=0.03;p.p_env_sustain=0;});
 const bassN=[98,98,131,117];
 for(let b=0;b<16;b++){const t=b*SPB;parts.push([kick,R(t),0.9]);if(b%2)parts.push([snare,R(t),0.55]);parts.push([hat,R(t+SPB/2),0.25]);parts.push([hat,R(t),0.18]);
   parts.push([note(bassN[Math.floor(b/4)%4],0.22,'square',0.18),R(t+SPB/2)]);}
 const f=mix(...parts),L=R(16*SPB),o=new Float32Array(L);o.set(f.slice(0,L));wavLoop(o,'sfx_beat_loop');}
wav(mix(...Array.from({length:10},(_,i)=>[note(300+i*90,0.05,'square',0.2),Math.floor(i*0.035*SR)])),'sfx_beat_hold');
wav(preset('powerUp',211,p=>{p.p_base_freq=0.25;p.p_freq_ramp=0.35;p.p_env_decay=0.3;}),'sfx_beat_rush');
wav(mix(...Array.from({length:8},(_,i)=>[preset('hitHurt',221+i,p=>{p.wave_type=3;p.p_base_freq=0.35;p.p_env_decay=0.05;}),Math.floor(i*0.045*SR),0.7])),'sfx_beat_gun');
wav(mix([preset('explosion',231,p=>{p.p_base_freq=0.6;p.p_freq_ramp=-0.1;p.p_vib_strength=0.5;p.p_vib_speed=0.6;p.p_env_sustain=0.3;p.p_env_decay=0.4;})]),'sfx_beat_cyclone');
wav(mix([preset('explosion',241,p=>{p.p_base_freq=0.1;p.p_env_sustain=0.15;p.p_env_decay=0.5;})],[note(40,0.5,'sine',1.0)],[note(80,0.2,'square',0.3)]),'sfx_beat_titan');
wav(mix([preset('powerUp',251,p=>{p.p_base_freq=0.3;p.p_freq_ramp=0.5;p.p_env_decay=0.25;})],[seq([784,988,1175],0.05,'tri',0.3),2500]),'sfx_beat_juggle');
wav(seq([523,659,784,988,1175,1319,1568],0.045,'tri',0.4),'sfx_beat_rainbow');
wav(mix([seq([523,659,784,1047,784,1047,1319,1568],0.08,'square',0.3)],[preset('explosion',261,p=>{p.p_base_freq=0.15;p.p_env_decay=0.5;}),Math.floor(0.3*SR),0.8],[note(52,0.6,'sine',0.9),Math.floor(0.3*SR)]),'sfx_beat_fever');
wav(mix([note(1568,0.06,'tri',0.5)],[note(2093,0.08,'tri',0.4),Math.floor(0.06*SR)]),'sfx_beat_cue');
