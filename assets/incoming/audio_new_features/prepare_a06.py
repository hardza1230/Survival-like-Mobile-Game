"""Select AI donors by signal QA; mechanical trimming, fades and gain/compression only."""
import hashlib,io,json,math,re,subprocess,wave
from pathlib import Path
import numpy as np
H=Path(__file__).resolve().parent;R=H.parents[2];RATE=44100
def run(args,data=None):return subprocess.run(['ffmpeg','-hide_banner','-nostdin',*args],input=data,capture_output=True,check=True)
def decode(p):return np.frombuffer(run(['-v','error','-i',str(p),'-ac','1','-ar',str(RATE),'-f','f32le','-']).stdout,dtype='<f4').copy()
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def measure(x):
    out=run(['-f','f32le','-ar',str(RATE),'-ac','1','-i','-','-af','apad=pad_dur=3.1,ebur128=peak=true','-f','null','-'],x.astype('<f4').tobytes()).stderr.decode(errors='replace')
    ss=[float(v) for v in re.findall(r'\bS:\s*(-?[\d.]+)',out)];peaks=re.findall(r'Peak:\s*(-?[\d.]+) dBFS',out)
    assert ss and peaks
    return max(ss),float(peaks[-1])
def compress(x,ratio,threshold=.08,attack=.25,release=30):
    if ratio==1:return x.copy()
    y=x*(.85/max(1e-9,float(np.max(np.abs(x)))))
    return np.frombuffer(run(['-v','error','-f','f32le','-ar',str(RATE),'-ac','1','-i','-','-af',f'acompressor=threshold={threshold}:ratio={ratio}:attack={attack}:release={release}:knee=2.8:makeup=1','-f','f32le','-'],y.astype('<f4').tobytes()).stdout,dtype='<f4').copy()
def save_json(p,d):
    t=p.with_suffix('.json.tmp');t.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8');t.replace(p)
def main():
    requests=json.loads((H/'REQUESTS.json').read_text());ledger=json.loads((H/'PROMPTS.json').read_text());generations=ledger['generations'];assert len(generations)==84
    work=R/'.git/a06-work';work.mkdir(exist_ok=True);manifest=[];checks=[];selection={};metrics=[]
    for r in requests:
        candidates=[];n=round(RATE*r['durationMs']/1000)
        for g in sorted((g for g in generations if g['key']==r['key']),key=lambda g:g['variant']):
            p=H/g['file'];assert digest(p)==g['sha256'];x=decode(p);mx=float(np.max(np.abs(x)));assert mx>1e-4
            audible=np.flatnonzero(np.abs(x)>max(mx*.012,1e-5));start=max(0,int(audible[0])-round(RATE*.0005));cut=x[start:start+n].copy()
            if len(cut)<n:cut=np.pad(cut,(0,n-len(cut)))
            energy=float(np.sum(x*x));retained=float(np.sum(cut*cut)/max(1e-9,energy));tail=float(np.mean(cut[-max(1,n//12):]**2)/max(1e-9,np.mean(cut**2)))
            spectrum=np.abs(np.fft.rfft(cut));freq=np.fft.rfftfreq(n,1/RATE);harsh=float(np.sum(spectrum[freq>10000]**2)/max(1e-9,np.sum(spectrum**2)))
            # Preserve a complete gesture; favor little cutoff energy / piercing HF.
            score=(1-retained)*3+max(0,tail-.25)*.4+harsh*.6+start/RATE*.02
            cut-=float(np.mean(cut));a=min(16,n//20);f=min(round(RATE*.018),n//10);cut[:a]*=np.linspace(0,1,a);cut[-f:]*=np.linspace(1,0,f)
            candidates.append((score,g,cut,{'variant':g['variant'],'onsetMs':round(start/RATE*1000,3),'retainedEnergyFraction':round(retained,4),'tailEnergyRatio':round(tail,4),'above10kHzEnergyFraction':round(harsh,4),'score':round(score,5)}))
        candidates.sort(key=lambda t:t[0]);target=r['targetLufsS'];options=[]
        configs=[(1,.08,.25,30),(2,.08,.25,30),(4,.08,.25,30),(8,.02,.01,10),(8,.005,.01,10),(20,.002,.01,10)]
        for rank,(score,g,x,chosen) in enumerate(candidates):
            for ci,(ratio,th,attack,release) in enumerate(configs):
                y=compress(x,ratio,th,attack,release);lufs,tp=measure(y);gain=min(target-lufs,-1.5-tp);y*=10**(gain/20)
                if lufs+gain>=target-1.1:
                    options.append((score+ci*.08,g,x,chosen,y,ratio,th,attack,release));break
        if not options:raise RuntimeError('Cannot meet loudness/peak '+r['key'])
        _,g,x,chosen,y,ratio_used,threshold_used,attack_used,release_used=min(options,key=lambda t:t[0])
        p=H/r['file'];wav=work/(r['key']+'.wav')
        allow_boost=True
        for attempt in range(8):
            with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((np.clip(y,-1,1)*32767).astype('<i2').tobytes())
            temp=work/(r['key']+'.mp3');run(['-v','error','-y','-i',str(wav),'-ac','1','-ar',str(RATE),'-c:a','libmp3lame','-b:a','128k',str(temp)])
            p.write_bytes(temp.read_bytes());final=decode(p);ls,peak=measure(final)
            if peak>-1.1:
                y*=10**((-1.6-peak)/20);allow_boost=False;continue
            if allow_boost and ls<target-.25 and peak<-1.4 and attempt<6:
                y*=10**(min(target-ls,-1.2-peak)/20);continue
            break
        audible=np.flatnonzero(np.abs(final)>max(float(np.max(np.abs(final)))*.012,1e-5));lead=1000*int(audible[0])/RATE;duration=len(final)*1000/RATE
        probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(p)]))['streams'][0]
        assert peak<=-1 and abs(duration-r['durationMs'])/r['durationMs']<=.15 and lead<5 and probe['sample_rate']=='44100' and probe['channels']==1,(r['key'],peak,duration,lead)
        assert abs(ls-target)<=1.5,(r['key'],ls,target)
        row={'key':r['key'],'file':r['file'],'bytes':p.stat().st_size,'sha256':digest(p),'durationMs':round(duration,3),'loop':False,'peakDbtp':peak,'lufsS':ls,'targetLufsS':target,'selectedDonor':g['file'],'compressionRatio':ratio_used}
        manifest.append(row);checks.append({'key':r['key'],'decode':True,'nonSilent':True,'sampleRate':44100,'channels':1,'bitRate':int(probe['bit_rate']),'durationMs':round(duration,3),'leadingSilenceMs':round(lead,3),'peakDbtp':peak,'lufsS':ls,'loudnessErrorLu':round(ls-target,2),'tailFadeMs':round(f/RATE*1000,3),'passed':True})
        selection[r['key']]={'donor':g['file'],'variant':g['variant'],'selectionBasis':'signal quality: retained event energy, tail cutoff, restrained high frequency and least adequate compression; semantic listening remains owner review','candidates':[c[3] for c in candidates],'mechanicalProcessing':{'cropStartMs':chosen['onsetMs'],'durationMs':r['durationMs'],'tailFadeMs':round(f/RATE*1000,3),'compressionRatio':ratio_used,'threshold':threshold_used,'attackMs':attack_used,'releaseMs':release_used}}
        print('Prepared',r['key'],'take',g['variant'],'LUFS-S',ls,'peak',peak,flush=True)
        ledger['selected']=selection;save_json(H/'PROMPTS.json',ledger);save_json(H/'MANIFEST.json',manifest)
    save_json(H/'QA_REPORT.json',{'provider':'ElevenLabs','orderedTableKeys':28,'briefPrintedTotal':29,'countNote':'All28 distinct table rows delivered; printed29 total is an arithmetic typo.','donors':84,'delivered':len(manifest),'result':'pass','method':'Only mechanical crop, fade, optional compression and gain. No synthetic layers or replacement audio.','lufsSMethod':'EBU R128 max3second short-term window measured on decoded final MP3, tail-zero-padded3.1s to measure sub3s SFX; padding is analysis-only, not in delivered files.','subjectiveListening':'Owner phone listening pending; technical selection is not a claim of human semantic audition.','files':checks})
if __name__=='__main__':main()
