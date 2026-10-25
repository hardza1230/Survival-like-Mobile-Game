"""Mechanical donor trimming/normalization and decoded MP3 QA. No synthesized audio."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import numpy as np
import os
import argparse

ROOT=Path(__file__).resolve().parents[1]
RATE=44100

def save(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    temp=path.with_suffix(path.suffix+'.tmp')
    with temp.open('wb') as f:
        f.write(data); f.flush(); os.fsync(f.fileno())
    temp.replace(path)

def run(args,data=None):
    return subprocess.run(['ffmpeg','-hide_banner','-nostdin']+args,input=data,capture_output=True,check=True)

def decode(path):
    return np.frombuffer(run(['-v','error','-i',str(path),'-ac','1','-ar',str(RATE),'-f','f32le','-']).stdout,dtype='<f4').copy()

def peak(path):
    log=run(['-i',str(path),'-af','ebur128=peak=true','-f','null','-']).stderr.decode(errors='replace')
    values=re.findall(r'Peak:\s*([-\d.]+) dBFS',log)
    if not values:raise RuntimeError('True peak measurement missing')
    return float(values[-1])

def pack(folder):
    requests=json.loads((folder/'REQUESTS.json').read_text(encoding='utf-8'))
    manifest=[]; qa=[]
    runtime=ROOT/'assets/audio'/folder.name.removeprefix('audio_')
    for r in requests:
        src=folder/'originals'/r['file']
        if not src.exists():continue
        x=decode(src).astype(np.float64)
        if not len(x) or not np.isfinite(x).all() or np.max(np.abs(x))<1e-5:raise RuntimeError('Silent/invalid donor '+r['key'])
        n=round(r['durationMs']*RATE/1000)
        start=0
        if not r['loop']:
            # First audible attack, ignoring extremely quiet pre-roll. Preserve its entire target window.
            threshold=max(np.max(np.abs(x))*.012,1e-5)
            onset=np.flatnonzero(np.abs(x)>=threshold)
            start=max(0,int(onset[0])-round(RATE*.001))
        y=x[start:start+n]
        if len(y)<n:y=np.pad(y,(0,n-len(y)))
        y-=np.mean(y)
        if r['loop']:
            # Circular overlap at seam: central donor samples bridge both endpoints continuously.
            m=min(round(RATE*.025),n//8)
            w=np.zeros(n); w[:m]=np.cos(np.linspace(0,np.pi/2,m))**2; w[-m:]=np.sin(np.linspace(0,np.pi/2,m))**2
            y=(1-w)*y+w*np.roll(y,n//2)
        else:
            attack=min(16,n//10); tail=min(round(RATE*.009),n//5)
            y[:attack]*=np.linspace(0,1,attack)
            y[-tail:]*=np.linspace(1,0,tail)
        # Headroom before lossy encoding; verify actual oversampled decoded true peak below.
        y*=10**(-3/20)/max(1e-9,np.max(np.abs(y)))
        path=folder/r['file']
        for attempt in range(3):
            encoded=run(['-v','error','-f','f32le','-ar',str(RATE),'-ac','1','-i','-','-c:a','libmp3lame','-b:a','128k','-write_xing','1','-f','mp3','-'],y.astype('<f4').tobytes()).stdout
            save(path,encoded)
            tp=peak(path)
            if tp<=-1.1:break
            y*=10**((-1.5-tp)/20)
        if tp>-1:raise RuntimeError('Peak limit failed '+r['key'])
        decoded=decode(path)
        audible=np.flatnonzero(np.abs(decoded)>max(np.max(np.abs(decoded))*.012,1e-5))
        lead=1000*int(audible[0])/RATE if len(audible) else None
        duration=len(decoded)*1000/RATE
        # Streaming MP3s can expose codec padding to decoders. Encode from a seekable temporary to store gapless length.
        if abs(duration-r['durationMs'])>2:
            temp=path.with_suffix('.wav')
            run(['-v','error','-y','-f','f32le','-ar',str(RATE),'-ac','1','-i','-','-c:a','pcm_s16le',str(temp)],y.astype('<f4').tobytes())
            final=path.with_suffix('.encoded.mp3')
            run(['-v','error','-y','-i',str(temp),'-c:a','libmp3lame','-b:a','128k',str(final)])
            save(path,final.read_bytes());temp.unlink();final.unlink()
            decoded=decode(path);tp=peak(path);duration=len(decoded)*1000/RATE
            audible=np.flatnonzero(np.abs(decoded)>max(np.max(np.abs(decoded))*.012,1e-5));lead=1000*int(audible[0])/RATE if len(audible) else None
        rms=float(np.sqrt(np.mean(decoded.astype(np.float64)**2)))
        passed=bool(rms>1e-5 and tp<=-1 and abs(duration-r['durationMs'])<2 and (r['loop'] or lead<5))
        if not passed:raise RuntimeError(f'QA failed {r["key"]}: peak {tp}, duration {duration}, lead {lead}')
        data=path.read_bytes();save(runtime/r['file'],data)
        manifest.append(dict(key=r['key'],file=r['file'],bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),durationMs=round(duration,3),loop=r['loop'],peakDbtp=tp))
        qa.append(dict(key=r['key'],decode=True,nonSilent=True,sampleRate=RATE,channels=1,bitRate=128000,rmsDbfs=round(20*np.log10(rms),2),peakDbtp=tp,durationMs=round(duration,3),leadingSilenceMs=round(lead,3),donorOffsetMs=round(start*1000/RATE,3),loopSeamSampleDelta=float(abs(decoded[0]-decoded[-1])) if r['loop'] else None,passed=passed))
        print('Packed',r['key'],flush=True)
    save(folder/'MANIFEST.json',(json.dumps(manifest,indent=2)+'\n').encode())
    save(folder/'QA_REPORT.json',(json.dumps(dict(provider='ElevenLabs',method='Retained AI donors; only mechanical trim, fade, circular seam blend and level adjustment. MP3 decoded true-peak measured with ffmpeg ebur128.',subjectivePhoneReview='pending owner listening',expected=len(requests),delivered=len(manifest),files=qa),indent=2)+'\n').encode())
    print(folder.name,len(manifest),'of',len(requests),flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('folders',nargs='+');a=p.parse_args()
    for name in a.folders:pack(ROOT/name)
