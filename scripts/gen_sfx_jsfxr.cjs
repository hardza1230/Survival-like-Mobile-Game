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
