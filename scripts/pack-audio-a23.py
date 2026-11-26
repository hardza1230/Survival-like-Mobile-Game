"""Verify A23 masters, then install a stage-selected compact runtime library."""
import hashlib,json,subprocess,re
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/audio_a23';DST=ROOT/'assets/audio/a23'
def run(args,**kwargs):return subprocess.run(args,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,**kwargs)
def pack():
 rows=json.loads((SRC/'MANIFEST.json').read_text(encoding='utf-8'));qa=json.loads((SRC/'QA_REPORT.json').read_text(encoding='utf-8'))
 assert len(rows)==264 and all(q['passed'] for q in qa) and len(qa)==264,'Source delivery incomplete or QA failed'
 DST.mkdir(parents=True,exist_ok=True);packed=[];voices={}
 for r in rows:
  src=SRC/r['file'];data=src.read_bytes();assert len(data)==r['bytes'] and hashlib.sha256(data).hexdigest()==r['sha256'],r['key']
  if r['category']=='ambience' and r['variant']!=1:continue
  if r['category']=='boss_ambience' and r['stage'] not in [4,9,14]:continue
  out=DST/(r['key']+'.mp3');bitrate='56k' if r['kind']=='voice' else '96k'
  if r['loop']:
   # Masters preserve 90 seconds. A 20-second crossfaded runtime loop limits install/decoded size.
   a=np.frombuffer(run(['ffmpeg','-v','error','-i',str(src),'-t','20','-ac','1','-ar','44100','-f','f32le','-']).stdout,dtype='<f4').copy();n=3528
   edge=a[-n:]*np.linspace(1,0,n)+a[:n]*np.linspace(0,1,n);a=np.concatenate([edge,a[n:-n]])
   a[:132]*=np.linspace(0,1,132);a[-132:]*=np.linspace(1,0,132)
   run(['ffmpeg','-v','error','-y','-f','f32le','-ac','1','-ar','44100','-i','pipe:0','-c:a','libmp3lame','-b:a',bitrate,'-map_metadata','-1',str(out)],input=a.astype('<f4').tobytes())
  else:run(['ffmpeg','-v','error','-y','-i',str(src),'-ac','1','-ar','44100','-c:a','libmp3lame','-b:a',bitrate,'-map_metadata','-1',str(out)])
  met=run(['ffmpeg','-hide_banner','-i',str(out),'-af','loudnorm=I=-24:TP=-1:LRA=11:print_format=json','-f','null','-']).stderr.decode(errors='replace');m=json.loads(met[met.rfind('{'):met.rfind('}')+1]);assert float(m['input_tp'])<=-1,r['key']
  probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(out)]).stdout);st=probe['streams'][0];assert st['channels']==1 and int(st['sample_rate'])==44100
  duration=round(float(probe['format']['duration'])*1000);u='assets/audio/a23/'+out.name
  packed.append(dict(key=r['key'],file=out.name,source=r['file'],url=u,bytes=out.stat().st_size,sha256=hashlib.sha256(out.read_bytes()).hexdigest(),duration_ms=duration,peakDbtp=float(m['input_tp']),loop=r['loop']))
  if r['kind']=='voice':voices[r['key']]=dict(url=u,text=r['text'],role=r['speaker'],duration=duration)
 (DST/'MANIFEST.json').write_text(json.dumps(packed,indent=2)+'\n',encoding='utf-8')
 game=ROOT/'game.js';s=game.read_text(encoding='utf-8');s,n=re.subn(r'const A23_VOICES=.*?;\n',lambda _:'const A23_VOICES='+json.dumps(voices,ensure_ascii=False,separators=(',',':'))+';\n',s,count=1);assert n==1;game.write_text(s,encoding='utf-8',newline='\n')
 print('A23 packed',len(packed),'files',round(sum(p['bytes'] for p in packed)/1048576,2),'MiB; reserve ambience variations remain source-only')
if __name__=='__main__':pack()
