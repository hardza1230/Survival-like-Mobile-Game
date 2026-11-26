/* ============================================================
   Sfx — จัดการเสียงEffect (SFX) และดนตรีประกอบ (BGM)
   เล่นไฟล์เสียงจริงจาก assets/audio/ passives้อม fallback เสียงสังเคราะห์
   ============================================================ */
const Sfx = {
  ctx:null, master:null, muted:false, _noise:null, _last:{}, mv:1, sv:1, _live:[], _xpStep:0, _xpAt:-9,
  _currentBgm:null, _currentBgmKey:'',
  ensure(){
    if(this.ctx) return this.ctx;
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return null;
    this.ctx=new AC();
    this.master=this.ctx.createGain(); this.master.gain.value=0.24; this.master.connect(this.ctx.destination);
    const len=Math.floor(this.ctx.sampleRate*0.4), buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1; this._noise=buf;
    return this.ctx;
  },
  unlock(){ this.ensure(); if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); if(!this._currentBgm&&!(typeof window!=='undefined'&&window.LoaderMusic?.playing?.()))this.playMainBgm(); },
  toggle(){
    this.muted=!this.muted; if(this.muted){this.bpLoopStop();this.eventLoopStop();this.stopChestSpin();if(typeof VoiceActing!=='undefined')VoiceActing.stop();}
    if(this.master)this.master.gain.value=this.muted?0:0.24;
    if(window.__g && window.__g.sound) window.__g.sound.mute=this.muted;
    return this.muted;
  },
  _ok(key,gap){ const t=(this.ctx?this.ctx.currentTime:0); if((this._last[key]||-9)+gap>t)return false; this._last[key]=t; return true; },
  /* v8.2.85 A21: สุ่มเสียงแบบต่าง ๆ ของ family เดียวกัน ไม่ซ้ำติดกัน · เฉพาะไฟล์ที่โหลดแล้ว (ไม่มี = ใช้เสียงเดิม) */
  a21Pick(fam){ const n=typeof A21_FAMS!=='undefined'&&A21_FAMS[fam];if(!n)return null;const c=window.__g?.cache?.audio;if(!c)return null;const L=this._a21Last||(this._a21Last={}),ok=[];for(let i=1;i<=n;i++){const k='sfx_a21_'+fam+'_'+i;if(c.exists(k)&&(k!==L[fam]||n===1))ok.push(k);}if(!ok.length)return null;const k=ok[Math.floor(Math.random()*ok.length)];L[fam]=k;return k; },
  a21(fam,vol=.3,gap=.08){ if(this.muted||this.sv<=0)return true;const k=this.a21Pick(fam);if(!k)return false;if(!this._ok('a21_'+fam.replace(/_\w+$/,''),gap))return true;return this.playFile(k,vol,1); },
  a23(family,vol=.25,gap=.4){
    if(this.muted||this.sv<=0)return true;
    const cache=window.__g?.cache?.audio,base='sfx_a23_'+family,last=this._a23Last||(this._a23Last={});
    const keys=[base,base+'_1',base+'_2'].filter(k=>cache?.exists(k));if(!keys.length)return false;
    if(!this._ok('a23_'+family.replace(/_(?:spawn|attack|hurt|death)$/,''),gap))return true;
    const choices=keys.filter(k=>k!==last[family]);const key=(choices.length?choices:keys)[Math.floor(Math.random()*(choices.length||keys.length))];last[family]=key;return this.playFile(key,vol,1);
  },
  playFile(key, vol=0.5, rate){
    if(this.muted||this.sv<=0)return false; { const fam=typeof A21_REF!=='undefined'?(A21_REF[key]||(key==='sfx_shoot'&&this.hero==='momo'?'momo_ricochet':null)):null; if(fam){ const v=this.a21Pick(fam); if(v){ key=v; rate=1; } } }if(typeof VoiceActing!=='undefined'&&VoiceActing.active?.sound?.isPlaying)vol*=.7;
    try{const g=window.__g; if(g&&g.cache&&g.cache.audio&&g.cache.audio.exists(key)){
      const now=performance.now(); this._live=this._live.filter(x=>x.end>now);
      const uq=key.startsWith('sfx_uq_')||key.startsWith('sfx_punch')||key.startsWith('sfx_cocoa_');   /* v7.6.3 หมัด Cocoa ถี่สุด เคยโดนเพดานรวมตัดเงียบตอนชุลมุน */ if((!uq&&this._live.length>=10)||this._live.filter(x=>x.k===key).length>=3)return true;   // v6.82.1 Unique ไม่โดนตัดจากเพดานเสียงรวม   // จำกัดเสียงซ้อน กันเสียงแตกตอนมอนตายเป็นฝูง (true = ไม่ fallback ไป synth)
      const r=rate||(0.92+Math.random()*0.16);   // สุ่มระดับเสียง ±8% ไม่ให้ซ้ำแบบหุ่นยนต์
      const snd=g.sound.add(key,{volume:Math.min(uq?0.6:0.42,vol*(uq?0.85:0.68))*this.sv,rate:r}); snd.once('complete',()=>{try{snd.destroy();}catch(e){}}); snd.play();
      this._live.push({k:key,end:now+Math.min(1500,((snd.duration||0.4)*1000)/r)}); return true;}}catch(e){}
    return false;
  },
  duckBgm(ms=520,amount=0.48){
    const bg=this._currentBgm;if(!bg||!bg.isPlaying||this.muted)return;
    if(ms<1000&&this._bgmIntense)return;   // v5.70.2 ระหว่างสู้บอส/มินิ ไม่ duck เสียงสั้น ๆ (โดนตี/ท่าบอส) กันเพลงติด ๆ หาย ๆ
    if(ms<1000)amount=Math.max(amount,0.75);   // duck เบาลง
    const activeVoice=typeof VoiceActing!=='undefined'&&VoiceActing.active?.sound?.isPlaying?VoiceActing.active:null;if(activeVoice){amount=Math.min(amount,.7);ms=Math.max(ms,Math.max(0,activeVoice.end-performance.now())+200);}
    const normal=this._currentBgmKey?.startsWith('bgm_a04_')?(this._currentBgmVol??.24):this._bgmIntense?0.34:(this._currentBgmKey==='bgm_main'?0.28:0.30);bg.setVolume(normal*amount*this.mv);clearTimeout(this._duckTimer);
    this._duckTimer=setTimeout(()=>{if(bg===this._currentBgm&&bg.isPlaying)bg.setVolume(this.muted?0:normal*this.mv);},ms);
  },
  tone(freq,dur,type='sine',vol=0.3,slideTo=0,delay=0){
    if(!this.ctx||this.muted||this.sv<=0)return; vol*=this.sv;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t0);
    if(slideTo>0)o.frequency.exponentialRampToValueAtTime(slideTo,t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+Math.min(0.02,dur*0.3));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0+dur+0.03);
  },
  noise(dur,vol=0.3,delay=0,hp=false){
    if(!this.ctx||this.muted||!this._noise)return;
    const t0=this.ctx.currentTime+delay, s=this.ctx.createBufferSource(), g=this.ctx.createGain();
    s.buffer=this._noise; g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    let node=s;
    if(hp){ const f=this.ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=900; s.connect(f); node=f; }
    node.connect(g); g.connect(this.master); s.start(t0); s.stop(t0+dur+0.02);
  },
  seq(notes,type='triangle',vol=0.26,step=0.1){ notes.forEach((f,i)=>this.tone(f,step*1.7,type,vol,0,i*step)); },

  // --- SFX mix: เสียงถี่เบา/ห่างขึ้น และเสียงสำคัญ duck เพลงชั่วคราว ---
  strawberryShoot(){if(this._ok('strawberryShoot',0.12)){if(!this.playFile('sfx_strawberry_soft_shot',0.62))this.tone(340,0.065,'sine',0.05,180);}},   // v8.2.2 เจ้าของ: ไม่ได้ยินเสียงยิง Momo → ไฟล์ +12 dB (peak −14.5 → ~−2.5 dB) + เสียง .22→.34 · v8.2.20 ยังไม่ได้ยิน → ไฟล์ +7 dB (limiter) + เสียง .34→.62 (ชนเพดาน .42 ของ playFile)
  shoot(){if(this._ok('shoot',0.12)){if(!this.playFile('sfx_shoot',0.25))this.tone(920,0.045,'triangle',0.035,1280);}},
  pop(){if(this._ok('pop',0.11)){if(!this.playFile('sfx_hit',0.22))this.tone(430,0.055,'sine',0.045,240);}},
  streak(step){if(this.playFile('sfx_streak_real',0.32,1+Math.min(0.5,(step||0)*0.06)))return;const base=540+step*150;this.tone(base,0.10,'triangle',0.075,base+300);this.tone(base*1.5,0.11,'sine',0.05,base*1.5+240,0.05);},   // เสียงคอมโบ pitch สูงขึ้นตามสเต็ป
  xp(){ const t=this.ctx?this.ctx.currentTime:0; this._xpStep=(t-this._xpAt<0.7)?Math.min(12,this._xpStep+1):0; this._xpAt=t;   // ไล่โน้ตสูงขึ้นตอนเก็บต่อเนื่อง
    if(this._ok('xp',0.07)){const r=1+this._xpStep*0.045; if(!this.playFile('sfx_xp',0.16,r))this.tone(760*r,0.05,'sine',0.035,1020*r);}},
  crit(){ if(!this._ok('crit',0.09))return; if(this.a21Pick&&this.a21('critical',.34,0))return; if(!this.playFile('sfx_crit',0.32))this.playFile('sfx_hit',0.30,1.25+Math.random()*0.1); if(!this.playFile('sfx_crit_accent_real',0.22))this.tone(1480,0.06,'triangle',0.045,2100); },   // คริ = เสียงตีสูง + ping
  bigKill(){ if(!this._ok('bigKill',0.18))return; this.duckBgm(260,0.7); if(!this.playFile('sfx_kill_big',0.34)&&!this.playFile('sfx_ult_bomb',0.30,1.15))this.tone(150,0.18,'sine',0.08,65); if(!this.playFile('sfx_bigkill_accent_real',0.3)){ this.tone(90,0.22,'sine',0.09,45); this.noise(0.12,0.05,0.02,true); } },   // ฆ่าตัวใหญ่ = ซ้อน 3 ชั้น
  setVolumes(mv,sv){ this.mv=mv; this.sv=sv;if(typeof VoiceActing!=='undefined'&&VoiceActing.active?.sound){if(sv<=0)VoiceActing.stop();else VoiceActing.active.sound.setVolume(.65*sv);}if(sv<=0)this.eventLoopStop();else for(const snd of Object.values(this._eventLoops||{}))snd.setVolume((snd._sfxBaseVolume??.16)*sv); if(this._bgmGain)this._bgmGain.gain.value=0.5*mv; this.bgmIntense(this._bgmIntense); },
  hurt(){if(this._ok('hurt',0.42)){this.duckBgm(300,0.68);if(!this.playFile('sfx_hurt',0.36,0.96+Math.random()*0.08)&&!this.playFile('sfx_hit',0.42))this.tone(270,0.14,'triangle',0.09,120);}},
  dash(){if(this._ok('dash',0.25)){if(!this.playFile('sfx_dash',0.34))this.noise(0.11,0.055,0,true);}},
  ult(type){if(!this._ok('ult',0.5))return;this.duckBgm(650,0.42);if(type==='vortex'&&this.playFile('sfx_ult_vortex',0.48))return;if(!this.playFile('sfx_ult_bomb',0.48))this.seq([660,880,1180],'triangle',0.10,0.07);},
  thunder(){if(this._ok('thunder',0.2)&&!this.playFile('sfx_thunder',0.34))this.zap();},
  beam(){if(this._ok('beam',0.15)&&!this.playFile('sfx_beam',0.3))this.zap();},
  shotgun(){if(this._ok('shotgun',0.12)&&!this.playFile('sfx_shotgun',0.55))this.punch();},
  punch(){if(this._ok('punch',0.12)&&!this.playFile('sfx_punch',0.4))this.shoot();},
  ev(n,vol=0.5,gap=0.1,rate){ if(this.muted||this.sv<=0)return true; if(!this._ok('ev_'+n,gap))return true; return this.playFile('sfx_event_'+n,vol,rate||1); },   // v7.1 event_refresh semantic cues
  bp(n,vol=0.5,gap=0.08,rate){ if(this.muted||this.sv<=0)return true; if(!this._ok('bp_'+n,gap))return true; return this.playFile('sfx_'+n,vol,rate||(0.96+Math.random()*0.08)); },
  orderCue(n,vol=.4,gap=.15,rate=1){ const route=typeof A23_EVENT_REF!=='undefined'&&A23_EVENT_REF[n];if(route&&this.a23?.('event_'+route,vol,gap))return true;if(this.muted||this.sv<=0)return true;if(!this._ok('order_'+n,gap))return true;return this.playFile('sfx_'+n,vol,rate); },
  menuCue(n,vol=.4,gap=.12,rate=1){if(this.muted||this.sv<=0)return true;const now=performance.now();this._menuCueEnds=(this._menuCueEnds||[]).filter(t=>t>now);if(this._menuCueEnds.length>=2)return true;const ok=this.orderCue(n,vol,gap,rate);if(ok)this._menuCueEnds.push(now+Math.min(1200,((window.__g?.cache?.audio?.get?.('sfx_'+n)?.duration)||.5)*1000)/rate);return ok;},
  voice(n,vol=.24){if(n.startsWith('cocoa_'))return false;if(typeof VoiceActing!=='undefined'&&VoiceActing.busy())return true;if(this.muted||this.sv<=0||(typeof Save!=='undefined'&&Save.data?.settings?.voices===false))return true;if(!this._ok('voice',.14))return true;return this.playFile('vo_'+n,vol,1);},
  voiceBlip(who='ruby'){const count=who==='ruby'?4:3;this._voiceStep=((this._voiceStep||0)+1)%count;return this.voice(who+'_blip_'+(this._voiceStep+1),.13);},
  eventLoopStart(n,vol=.25,rate=1){
    this._eventLoops=this._eventLoops||{};let snd=this._eventLoops[n];if(this.muted||this.sv<=0){this.eventLoopStop(n);return;}
    if(snd?.isPlaying){snd._sfxBaseVolume=vol;snd.setVolume(vol*this.sv);snd.setRate(rate);return;}
    this.eventLoopStop(n);try{const g=window.__g;if(!g?.cache.audio.exists('sfx_'+n))return;snd=g.sound.add('sfx_'+n,{volume:vol*this.sv,rate,loop:true});snd._sfxBaseVolume=vol;this._eventLoops[n]=snd;snd.play();}catch(e){}
  },
  eventLoopStop(n){const bank=this._eventLoops||{};for(const key of n?[n]:Object.keys(bank)){const snd=bank[key];delete bank[key];if(snd)try{snd.stop();snd.destroy();}catch(e){}}},
  bpLoopStart(n,vol=0.28){ if(this._bpLoop&&this._bpLoopKey===n)return; this.bpLoopStop(); if(this.muted||this.sv<=0)return; try{const g=window.__g; if(g&&g.cache.audio.exists('sfx_'+n)){ const s=g.sound.add('sfx_'+n,{volume:vol*this.sv,loop:true}); s.play(); this._bpLoop=s; this._bpLoopKey=n; }}catch(e){} },
  uqReady(n){ try{return !!window.__g?.cache.audio.exists('sfx_'+n);}catch(e){return false;} },
  bpLoopRate(r){ const s=this._bpLoop; if(s)try{s.setRate(r);}catch(e){} },
  bpLoopStop(k){ if(k&&this._bpLoopKey!==k)return; const s=this._bpLoop; this._bpLoop=null; this._bpLoopKey=null; if(s){ try{s.stop();s.destroy();}catch(e){} } },
  beatFx(k){ this.playFile('sfx_beat_'+k,0.7,1)||this.boom(); },
  // v5.53 หมัดคอมโบ: pitch ไล่ขึ้นตามคอมโบ · heavy/frenzy = ท่าปิด
  comboPunch(n,kind){ const r=0.9+Math.min(0.55,n*0.011); if(kind==='frenzy'){this.playFile('sfx_punch_frenzy',0.75,1)||this.boom();return;}
    // v7.6.4 เจ้าของ: หมัดเดิม (punch_jab −34dB) เบา/แจ๊บ ๆ → ใช้ punch.mp3 (ทุ้มหนัก −12dB) สุ่ม pitch · หมัดปิดคอมโบ = punch ต่ำ + punch_heavy ซ้อน
    if(kind==='heavy'){ if(this._ok('pheavy',0.08)){ this.playFile('sfx_punch',0.78,0.82+Math.random()*0.06)||this.boom(); this.playFile('sfx_punch_heavy',0.5,0.9); } return; }
    if(this._ok('pjab',0.05))this.playFile('sfx_punch',0.55,Math.min(1.18,0.98+Math.random()*0.1+Math.min(0.1,n*0.004)))||this.punch(); },
  magnet(){if(this._ok('magnet',0.4))this.playFile('sfx_magnet',0.4);},
  card(){if(this._ok('card',0.2))this.playFile('sfx_card',0.34,1);},
  legend(){if(!this._ok('legend',1))return;this.duckBgm(900,0.4);if(!this.playFile('sfx_legend',0.5,1))this.seq([523,659,784,1047,1319],'triangle',0.1,0.09);},
  zap(){if(this._ok('zap',0.18)){if(!this.playFile('sfx_donut',0.28))this.tone(1250,0.07,'triangle',0.055,540);}},
  boom(){if(this._ok('boom',0.24)){if(!this.playFile('sfx_ult_bomb',0.32))this.tone(150,0.18,'sine',0.08,65);}},
  frost(){if(this._ok('frost',0.24)){if(!this.playFile('sfx_frost',0.34))this.seq([1050,1450],'sine',0.055,0.06);}},
  levelup(){if(!this._ok('levelup',1.2))return;this.duckBgm(650,0.45);if(!this.playFile('sfx_levelup',0.46,1))this.seq([523,659,784,1047],'triangle',0.12,0.1);},
  chest(){if(!this._ok('chest',0.7))return;this.duckBgm(700,0.42);if(!this.playFile('sfx_chest',0.48))this.seq([587,740,880,1175],'triangle',0.12,0.09);},
  // A tap chooses one semantic cue; callback clicks cannot duplicate it.
  uiAction(kind,fn){
    if(this._uiPending!==undefined){fn();return;}
    this._uiPending=kind||'click';
    try{fn();}finally{const cue=this._uiPending;delete this._uiPending;this.ui(cue);}
  },
  ui(kind='click'){
    if(this._uiPending!==undefined){const priority={click:0,back:1,confirm:2,error:3};if(priority[kind]>priority[this._uiPending])this._uiPending=kind;return;}
    if(this.muted||this.sv<=0||!this._ok('ui',.045))return;
    try{const g=window.__g,key='sfx_ui_'+kind;
      if(g&&g.cache.audio.exists(key)){
        this._uiVoices=(this._uiVoices||[]).filter(s=>s.isPlaying);
        while(this._uiVoices.length>=2){const old=this._uiVoices.shift();old.stop();old.destroy();}
        const sound=g.sound.add(key,{volume:.27*this.sv,rate:1});this._uiVoices.push(sound);
        sound.once('complete',()=>{this._uiVoices=this._uiVoices.filter(s=>s!==sound);sound.destroy();});sound.play();return;
      }
    }catch(e){}
    if(kind==='back')this.tone(880,.10,'sine',.05,620);
    else if(kind==='confirm')this.seq([880,1320],'sine',.045,.04);
    else if(kind==='error')this.seq([260,195],'sine',.045,.06);
    else this.tone(1050,.055,'sine',.05,1200);
  },
  // Craft voices have their own small budget; outcomes replace the reel sounds.
  stopCraft(){
    const voices=this._craftVoices||[];this._craftVoices=[];
    voices.forEach(s=>{try{s.stop();s.destroy();}catch(e){}});
  },
  craft(kind,rate=1){
    const tick=kind==='tick'||kind==='result_count';
    if(!tick)this.stopCraft();
    if(this.muted||this.sv<=0)return;
    const now=performance.now();
    if(tick&&now-(this._craftTickAt??-Infinity)<45)return;
    if(tick)this._craftTickAt=now;else this._craftTickAt=-Infinity;
    rate=Math.max(.8,Math.min(1.2,rate));
    try{const g=window.__g,key='sfx_craft_'+kind;
      if(g&&g.cache.audio.exists(key)){
        this._craftVoices=(this._craftVoices||[]).filter(s=>s.isPlaying);
        while(this._craftVoices.length>=2){const old=this._craftVoices.shift();old.stop();old.destroy();}
        const sound=g.sound.add(key,{volume:(kind==='result_count'?.10:tick?.14:.30)*this.sv,rate});this._craftVoices.push(sound);
        sound.once('complete',()=>{this._craftVoices=this._craftVoices.filter(s=>s!==sound);sound.destroy();});sound.play();return;
      }
    }catch(e){}
    const notes={start:[620,930],tick:[1250*rate],slow:[780,620],common:[784,988],rare:[784,988,1175],jackpot:[784,988,1175,1568],near:[880,1047,880],cancel:[660,440],exhaust:[330,220],capacity:[523,784,1047],reroll:[988,740,1175],remove:[880,440],reset:[740,494,247],gear_equip:[660,990],gear_lock:[440,330],gear_unlock:[330,660],gear_enhance_success:[659,988,1319],gear_enhance_break:[392,294],gear_enhance_destroy:[220,147,98],gear_dismantle:[880,587,392],gear_sell:[1047,1319],progress_core:[740,1110],progress_talent:[880,1175],progress_overcap:[659,988,1480],progress_promotion:[523,659,784,1047],progress_perk:[587,880],progress_ancient:[494,740,988,1480],progress_daily:[784,1047,1319],progress_achievement:[659,831,988,1319],progress_quest:[740,988,1175],progress_claim:[988,1319],result_open:[659,988],result_count:[1175*rate],result_reveal:[1047,1319],result_important:[784,988,1175,1568],result_double:[988,1319,1568]}[kind];
    if(notes)this.seq(notes,'sine',tick?.025:.045,tick?.018:.055);
  },
  result(kind,rate=1){this.craft('result_'+kind,rate);},
  progress(kind){this.craft('progress_'+kind);},
  equipment(kind){this.craft('gear_'+kind);},
  equipmentEnhance(res){if(res&&['success','break','destroy'].includes(res.result))this.equipment('enhance_'+res.result);},
  select(){this.ui('click');},
  back(){this.ui('back');},
  confirm(){this.ui('confirm');},
  error(){this.ui('error');},
  bossWarn(){},   // v6.84 เงียบ: เจ้าของไม่เอาเสียงเตือนท่าบอส (ไซเรน v6.82.3 / ตื๊ด ๆ sfx_hazard v6.84)   // v6.82.3 ตัดเสียงไซเรนซอว์ทุ้ม (sfx_boss_warn ฟังเหมือนแมลงวัน) + เลิก duck เพลง
  clear(){if(!this._ok('clear',0.8))return;this.duckBgm(650,0.48);if(!this.playFile('sfx_levelup',0.42))this.seq([659,784,1047],'triangle',0.11,0.12);},
  victory(){this.duckBgm(1000,0.3);if(this.orderCue('stage_victory',.55,1))return;if(this.playFile('sfx_victory',0.55,1))return;this.seq([523,659,784,1047,1319],'triangle',0.13,0.14);},
  stopChestSpin(){const s=this._chestSnd;this._chestSnd=null;if(s){try{s.stop();s.destroy();}catch(e){}}},
  chestTick(i){if(!this.playFile('sfx_chest_tick',0.34,1+Math.min(0.6,i*0.02)))this.tone(1200+i*14,0.035,'sine',0.04,1500);},
  // v5.26 Temple Depths
  digHit(){if(!this.playFile('sfx_dig_hit',0.5))this.tone(140,0.06,'triangle',0.12,90);},
  digBreak(){if(!this.playFile('sfx_dig_break',0.45))this.tone(110,0.1,'triangle',0.1,70);},
  digFind(){if(!this.playFile('sfx_dig_find',0.45,1))this.seq([1175,1568],'sine',0.07,0.08);},
  digRare(){if(!this.playFile('sfx_dig_rare',0.55,1))this.seq([784,988,1175,1568,1976],'triangle',0.06,0.09);},
  recipe(){const n=Date.now();if(n-(this._rcAt||0)<140)return;this._rcAt=n;if(!this.playFile('sfx_recipe_fire',0.32))this.seq([1319,1760],'triangle',0.04,0.04);},
  recipeMerge(){if(!this.playFile('sfx_recipe_merge',0.5,1))this.seq([523,659,784,1047,1319],'triangle',0.06,0.07);},
  digTrap(){if(!this.playFile('sfx_dig_trap',0.55))this.tone(90,0.2,'sawtooth',0.1,50);},
  digDescend(){if(!this.playFile('sfx_dig_descend',0.55,1))this.seq([880,660,440],'sine',0.12,0.08);},
  slotSpin(){this.eventLoopStart('event_slot_spin_power',.4);},
  // v7.5.1 วงล้อคาสิโน: หมุดไม้แกร๊ก (pitch คงที่ สุ่มนิดหน่อย) · ตอนช้าลงดังขึ้น · กลองรัวก่อนหยุด · ระฆังตอนจบ
  wheelTick(slow){ if(!this.playFile('sfx_wheel_clack',slow?.55:.3,.96+Math.random()*.08))this.chestTick(0); },
  wheelRoll(){ this.playFile('sfx_wheel_roll',.42,1); },
  wheelWin(){ this.playFile('sfx_wheel_win',.55,1); },
  stopSlotSpin(){this.eventLoopStop('event_slot_spin_power');},
  slotReward(big=false){this.stopSlotSpin();this.stopCraft();this.rewardCue(big?'sfx_event_slot_reward_power':'sfx_chest_win',big?.68:.5);},
  rewardCue(key,vol=.6){if(this._rewardSnd){try{this._rewardSnd.stop();this._rewardSnd.destroy();}catch(e){}this._rewardSnd=null;}if(this.muted||this.sv<=0)return false;try{const g=window.__g;if(!g?.cache.audio.exists(key))return false;const snd=g.sound.add(key,{volume:vol*this.sv,rate:1});this._rewardSnd=snd;snd.once('complete',()=>{if(this._rewardSnd===snd)this._rewardSnd=null;snd.destroy();});snd.play();return true;}catch(e){return false;}},

  chestWin(){if(!this.playFile('sfx_chest_win',0.6,1))this.seq([784,988,1175,1568],'triangle',0.09,0.1);},
  bossClear(){this.duckBgm(3200,0.12);if(!this.playFile('sfx_boss_clear',0.6,1))this.seq([523,659,784,1047],'triangle',0.13,0.12);},
  dead(){this.duckBgm(900,0.3);if(this.orderCue('stage_defeat',.5,1))return;if(this.playFile('sfx_defeat',0.5,1))return;this.seq([392,311,247,196],'sine',0.10,0.14);},
  heal(){if(this._ok('heal',0.28)&&!this.playFile('sfx_heal',0.4))this.seq([784,988,1319],'sine',0.07,0.06);},
  heartbeat(intensity){if(this.playFile('sfx_heartbeat_real',0.3+0.25*(intensity||0),1))return;const v=0.05+0.05*(intensity||0);this.tone(58,0.10,'sine',v,40);this.tone(70,0.11,'sine',v*0.85,44,0.14);},   // เสียงหัวใจเต้น "thump-thump" ตอนใกล้ตาย

  // ===== เพลงพื้นหลัง (BGM จริง + สังเคราะห์ fallback) =====
  _playTrack(key,volume){
    if(this._currentBgmKey===key&&this._currentBgm&&this._currentBgm.isPlaying){this._currentBgmVol=volume;this._currentBgm.setVolume(this.muted?0:volume*this.mv);return true;}
    if(!(window.__g&&window.__g.cache&&window.__g.cache.audio&&window.__g.cache.audio.exists(key)))return false;
    const old=this._currentBgm;try{const next=window.__g.sound.add(key,{loop:true,volume:0});next.play();this._currentBgm=next;this._currentBgmKey=key;this._currentBgmVol=volume;
      if(window.__g.tweens)window.__g.tweens.add({targets:next,volume:this.muted?0:volume*this.mv,duration:650,ease:'Sine.inOut'});else next.setVolume(this.muted?0:volume*this.mv);
      if(old){if(window.__g.tweens)window.__g.tweens.add({targets:old,volume:0,duration:480,onComplete:()=>{try{old.stop();old.destroy();}catch(e){}}});else{old.stop();old.destroy();}}return true;
    }catch(e){return false;}
  },
  playStageBgm(stageNum=1){const key=bgmKeyFor('stage',stageNum);this._bgmIntense=false;this._wantTrack=null;if(!this._playTrack(key,0.30)){this.stopBgm();this.startBgm();}},
  playBossBgm(stageNum=1){const key=bgmKeyFor('boss',stageNum);this._bgmIntense=true;if(!this._playTrack(key,0.34)){this.bgmIntense(true);this._lateTrack(key,0.34);}},
  playMissionBgm(key,vol=.30){ if(!key||!ASSET_AUDIO[key])return false; this._bgmIntense=false; if(!this._playTrack(key,vol))this._lateTrack(key,vol); return true; },   // v8.2.25 A17
  playMiniBgm(stageNum=1){const key=bgmKeyFor('mini',stageNum);this._bgmIntense=true;if(!key||!this._playTrack(key,0.33)){this.bgmIntense(true);this._lateTrack(key,0.33);}},
  /* v7.9.81 เจ้าของ: เพลงบอส/มินิบอสด่านแรกไม่ขึ้น (ยังโหลดไม่เสร็จตอนบอสมา → ไม่เคยสลับ) · โหลดทันทีแล้วเล่นถ้ายังสู้อยู่ */
  _lateTrack(key,vol){ this._wantTrack=key; if(!key||!ASSET_AUDIO[key])return; try{ const sc=window.__g?.scene?.scenes?.find(x=>x.sys.settings.key==='Game'); if(!sc||!sc.load)return; const go=()=>{ if(this._wantTrack===key&&sc.state!=='menu'&&(sc.boss?.active||sc.mini?.active||sc._miniFight||sc.state==='cinematic'||sc.state==='play'))this._playTrack(key,vol); };
    if(sc.cache.audio.exists(key)){go();return;} sc.load.once('filecomplete-audio-'+key,go); sc.load.audio(key,verUrl(ASSET_AUDIO[key])); if(!sc.load.isLoading())sc.load.start(); }catch(e){} },
  playMenuBgm(key){ if(!key){ if((this._currentBgmKey||'').startsWith('bgm_menu_'))this.playMainBgm(); return; } this._bgmIntense=false; this._playTrack(key,0.28); },   // v5.40
  playMainBgm(){ this._wantTrack=null; if(typeof window!=='undefined'&&window.__mochiTitleMusic&&window.LoaderMusic?.playing?.())return;   // v8.1.35 หน้า title ใช้เพลงหน้าโหลด (bgm_title) ต่อเนื่อง
    // v6.48.1: ระหว่างหน้าโหลด/ฉากเปิดใช้เพลงหน้าโหลดเพลงเดียว → เริ่มเพลงเมนูหลังฉากเปิดจบ
    const GL=typeof window!=='undefined'&&window.GameLoader; if(GL&&!GL._introFinished&&!GL._lightOn){ if(!this._waitIntro){ this._waitIntro=true; window.addEventListener('mochi-intro-light',()=>{ this._waitIntro=false; this.playMainBgm(); },{once:true}); } return; }
    if(typeof window!=='undefined'&&window.LoaderMusic)window.LoaderMusic.stop();this._bgmIntense=false;if(!this._playTrack('bgm_main',0.28)){this.stopBgm();this.startBgm();}},
  _bgmGain:null, _bgmTimer:null, _bgmStep:0, _bgmIntense:false,
  _bgmNote(freq,dur,type,vol,delay){ if(!this.ctx||!this._bgmGain)return;
    const t0=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+0.04); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(this._bgmGain); o.start(t0); o.stop(t0+dur+0.03); },
  startBgm(){ this.ensure(); if(!this.ctx||this._bgmTimer)return;
    if(!this._bgmGain){ this._bgmGain=this.ctx.createGain(); this._bgmGain.gain.value=0.5*this.mv; this._bgmGain.connect(this.master); }
    this._bgmStep=0; this._bgmLoop(); },
  stopBgm(){
    if(this._currentBgm){ try{ this._currentBgm.stop(); this._currentBgm.destroy(); }catch(e){} this._currentBgm=null; this._currentBgmKey=''; }
    if(this._bgmTimer){ clearTimeout(this._bgmTimer); this._bgmTimer=null; }
  },
  bgmIntense(on){this._bgmIntense=!!on;if(this._currentBgm&&this._currentBgm.isPlaying)this._currentBgm.setVolume(this.muted?0:(this._currentBgmKey?.startsWith('bgm_a04_')?(this._currentBgmVol??.24):on?0.34:(this._currentBgmKey==='bgm_main'?0.28:0.30))*this.mv);},
  _bgmLoop(){
    const roots=[130.81,110.00,174.61,196.00];
    const root=roots[this._bgmStep%roots.length];
    const bar=this._bgmIntense?1.35:1.9, beat=bar/4, base=root*2;
    this._bgmNote(root,beat*3.6,'sine',0.5,0);
    const arp=[base,base*1.25,base*1.5,base*2];
    arp.forEach((f,i)=>this._bgmNote(f,beat*0.9,'triangle',this._bgmIntense?0.24:0.2,i*beat));
    if(this._bgmStep%2===0) this._bgmNote(base*2,beat*0.6,'sine',0.12,beat*2);
    this._bgmStep++;
    this._bgmTimer=setTimeout(()=>this._bgmLoop(), bar*1000);
  },
};

