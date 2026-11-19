// v8.2.25 A17 เพลงภารกิจใหญ่ 8 + สติงเกอร์ 3: ไฟล์/คีย์/จุดผูก/กติกา (ภารกิจเสริมไม่เปลี่ยนเพลง · บอสชนะ · จบ = กลับเพลงด่าน)
const fs=require('fs'),crypto=require('crypto'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const R=JSON.parse(fs.readFileSync('assets/incoming/audio_a17/MANIFEST.json','utf8'));const rows=Array.isArray(R)?R:(R.files||R.assets);assert.strictEqual(rows.length,11);
for(const r of rows){ const b=fs.readFileSync('assets/incoming/audio_a17/'+r.file);assert.ok(b.length===r.bytes&&crypto.createHash('sha256').update(b).digest('hex')===r.sha256,r.key);
  const bgm=r.key.startsWith('bgm_'),p=(bgm?'assets/audio/bgm/missions_a17/':'assets/audio/sfx/a17/')+r.key+'.mp3';assert.ok(fs.existsSync(p),p);assert.ok(src.includes(r.key+": '"+p+"'"),'registered '+r.key); }
for(const [fn,k] of [['fpOpen','bgm_m_frozen_still'],['fpThaw','bgm_m_frozen_fight'],['hmOpen','bgm_m_breach'],['gpRound','bgm_m_ritual'],['ultStartFight','bgm_m_trial'],['hsSetup','bgm_m_siege'],['hhSetup','bgm_m_herald'],['hdSetup','bgm_m_domain']])assert.ok(m(fn).includes("this.missionMusic?.('"+k+"'"),fn);
const ctx={Math,console};vm.createContext(ctx);vm.runInContext('class S{'+['missionMusic','missionMusicEnd'].map(m).join('')+'};this.K=S;',ctx);
const log=[];ctx.Sfx={orderCue:k=>log.push('cue:'+k),playMissionBgm:k=>{log.push('bgm:'+k);return true;},playStageBgm:n=>log.push('stage:'+n)};
const sc=new ctx.K();Object.assign(sc,{stageIndex:4,mode:'wave',state:'play'});sc.missionMusic('bgm_m_breach');assert.deepStrictEqual(log,['cue:m_mission_start','bgm:bgm_m_breach']);
log.length=0;sc.missionMusic('bgm_m_frozen_fight','thaw');assert.deepStrictEqual(log,['cue:m_thaw_hit','bgm:bgm_m_frozen_fight'],'no second start sting');
log.length=0;sc.missionMusicEnd(true);assert.deepStrictEqual(log,['cue:m_mission_clear','stage:5']);log.length=0;sc.missionMusicEnd(true);assert.strictEqual(log.length,0,'once');
sc._stackSwap=true;assert.strictEqual(sc.missionMusic('bgm_m_herald'),false,'side missions keep the music');sc._stackSwap=false;sc.mode='boss';assert.strictEqual(sc.missionMusic('bgm_m_herald'),false,'boss music wins');
assert.ok(m('clearWaveObjective').includes('if(!this._stackSwap)this.missionMusicEnd?.(false);')&&m('expireWaveObjective').includes('this.missionMusicEnd?.(false);')&&m('completeWaveObjective').includes('this.missionMusicEnd?.(true);'),'ends with the mission');
assert.ok(/^\s*for\(const k in ASSET_AUDIO\)\{[^\n]*if\(\/\^bgm_\/\.test\(k\)\)continue;/m.test(src),'bgm stays lazy (not boot)');
console.log('A17: 8 mission loops + 3 stingers packed, lazy, hooked; side missions/boss keep their music; back to stage music on end passed');
