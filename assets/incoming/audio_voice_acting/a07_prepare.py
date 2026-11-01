import pathlib,json,subprocess,hashlib,re,html
import numpy as np
R=pathlib.Path('assets/incoming/audio_voice_acting');P=json.loads((R/'PROMPTS.json').read_text(encoding='utf-8'));rows=[]
def run(args,**kw):return subprocess.run(args,check=True,capture_output=True,**kw)
for rec in P['generations']:
    speaker=rec['speaker']
    for take,p in enumerate(rec['result']['previews'],1):
        raw=R/p['file'];samples=np.frombuffer(run(['ffmpeg','-v','error','-i',str(raw),'-f','f32le','-ar','44100','-ac','1','-']).stdout,dtype=np.float32).copy()
        active=np.flatnonzero(abs(samples)>.0008);assert len(active)
        start=max(0,int(active[0])-220);samples=samples[start:];samples[:80]*=np.linspace(0,1,80);samples[-220:]*=np.linspace(1,0,220)
        name=f'vd_{speaker}'+('' if take==1 else f'_alt{take}')+'.mp3';dest=R/'voice_design'/name;dest.parent.mkdir(exist_ok=True)
        wav=pathlib.Path('.git/a07-work.wav')
        run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','1','-i','pipe:0','-af','loudnorm=I=-20:TP=-2:LRA=11','-ar','44100','-ac','1',str(wav)],input=samples.tobytes())
        normalized=np.frombuffer(run(['ffmpeg','-v','error','-i',str(wav),'-f','f32le','-ar','44100','-ac','1','-']).stdout,dtype=np.float32).copy()
        onset=int(np.flatnonzero(abs(normalized)>.0008)[0]);normalized=normalized[max(0,onset-220):]
        run(['ffmpeg','-v','error','-y','-f','f32le','-ar','44100','-ac','1','-i','pipe:0',str(wav)],input=normalized.tobytes())
        run(['ffmpeg','-v','error','-y','-i',str(wav),'-c:a','libmp3lame','-b:a','128k',str(dest)])
        decoded=np.frombuffer(run(['ffmpeg','-v','error','-i',str(dest),'-f','f32le','-ar','44100','-ac','1','-']).stdout,dtype=np.float32)
        measurement=run(['ffmpeg','-hide_banner','-i',str(dest),'-af','ebur128=peak=true','-f','null','-']).stderr.decode(errors='replace')
        peak=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',measurement)[-1]);assert peak<=-1,(name,peak)
        leading=np.flatnonzero(abs(decoded)>.0008)[0]/44.1;assert leading<20,(name,leading)
        b=dest.read_bytes();rows.append({'key':name[:-4],'file':str(dest.relative_to(R)).replace('\\','/'),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'duration_ms':round(len(decoded)/44.1),'speaker':speaker,'text':rec['result']['text'],'generated_voice_id':p['generated_voice_id'],'take':take,'source':p['file'],'status':'candidate_not_selected','peakDbtp':peak,'leadingSilenceMs':round(leading,3),'sampleRate':44100,'channels':1,'bitRate':128000})
    print('Prepared '+speaker,flush=True)
(R/'MANIFEST.json').write_text(json.dumps({'scope':'category1 audition candidates only','files':rows},indent=2)+'\n',encoding='utf-8')
(R/'QA_REPORT.json').write_text(json.dumps({'status':'technical_pass_owner_audition_pending','roles':12,'candidates':len(rows),'allDecode':True,'peakLimitDbtp':-1,'worstPeakDbtp':max(r['peakDbtp'] for r in rows),'maxLeadingSilenceMs':max(r['leadingSilenceMs'] for r in rows),'format':'MP3 mono44100Hz128kbps','processing':'leading silence crop with5ms safety lead, tiny fades, loudnorm -20LUFS TP-2, MP3 encoding; no synthesized replacement speech','textVerification':'Exact submitted and returned provider text recorded. Spoken word accuracy and character performance require owner audition.','scopeNotes':['Not317 final lines. Category1 only.','No persistent voices saved and no runtime integration.','API Voice Design minimum100 characters requires expanded sample text; first sentence is the requested phrase.','vd_<speaker>.mp3 is take1 for audition, not an approved selection.','boss_c1/c2/c3 are provisional chapter voices, not15 individual identities.']},indent=2)+'\n',encoding='utf-8')
parts=['<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>A07 Voice Casting</title><style>body{background:#261e30;color:#f5e7d0;font:16px system-ui;max-width:950px;margin:24px auto;padding:16px}section{border:1px solid #796345;border-radius:16px;padding:16px;margin:16px 0}button{background:#f3d18a;color:#261e30;border:0;border-radius:8px;padding:12px;margin:5px}audio{width:100%;position:sticky;top:0;background:#261e30}p{line-height:1.6}</style><h1>A07 — เลือกเสียงตัวละคร</h1><p>12 บทบาท · บทบาทละ3ตัวเลือก · ยังไม่ใช่เสียงที่อนุมัติหรือผูกเกม เลือกโดยบอกชื่อและเลข เช่น Ruby2, Mint1</p><audio id="player" controls></audio><p>Hello! Let\'s bring the flavor back. I\'m ready for a new adventure. Stay close, Ruby. Together, we can bring warmth back to every kitchen.</p>']
for rec in P['generations']:
    parts.append('<section><h2>'+html.escape(rec['speaker'])+'</h2><p>'+html.escape(rec['parameters']['voice_description'])+'</p>')
    for row in rows:
        if row['speaker']==rec['speaker']:parts.append('<button data-src="'+row['file']+'">ตัวเลือก '+str(row['take'])+' · '+str(round(row['duration_ms']/1000,1))+'s</button>')
    parts.append('</section>')
parts.append('<script>const player=document.getElementById("player");document.querySelectorAll("button[data-src]").forEach(b=>b.onclick=()=>{player.src=b.dataset.src;player.play();});</script>')
(R/'AUDITION.html').write_text('\n'.join(parts),encoding='utf-8')
print('QA passed36 candidates',flush=True)
