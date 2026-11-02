"""Original ElevenLabs SFX, resumable two-take selection; key stays in the environment."""
from pathlib import Path
import os,json,urllib.request,urllib.error,hashlib,subprocess,concurrent.futures,threading
import numpy as np
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/incoming/sesame_invoker811_audio';RUN=ROOT/'assets/audio/sfx/sesame_invoker811'
OUT.mkdir(parents=True,exist_ok=True);RUN.mkdir(parents=True,exist_ok=True)
ENDPOINT='https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128'
JOBS=[('tap_p',.18,'A single soft fiery ruby bead click, warm low wooden pop with tiny ember sparkle. One gesture finishes in 120 milliseconds.'),('tap_m',.18,'A single emerald wind bead click, airy round whoop and tiny soft chime. One gesture finishes in 120 milliseconds.'),('tap_b',.20,'A single sapphire water bead click, clear mellow droplet plink, rounded and gentle. One gesture finishes in 140 milliseconds.'),('recipe',.45,'Three tiny magical beads converge into one satisfying short ascending crystalline confirmation, clear final soft bell. Entire gesture 350 milliseconds.'),('cast',.55,'A powerful compact elemental magic invocation: three bright beads open into one warm rushing burst, immediate attack and short tail.'),('impact',.65,'One rich fantasy elemental shockwave impact: rounded low thump, crisp glassy sparkle and airy outward rush, no long rumble.')]
def save(p,b):
 p.parent.mkdir(parents=True,exist_ok=True);t=p.with_suffix(p.suffix+'.tmp');t.write_bytes(b);t.replace(p)
def js(p,d):save(p,(json.dumps(d,ensure_ascii=False,indent=2)+'\n').encode())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def ff(args,data=None):return subprocess.run(['ffmpeg','-hide_banner','-nostdin',*args],input=data,capture_output=True,check=True).stdout
def decode(p):return np.frombuffer(ff(['-v','error','-i',str(p),'-ac','1','-ar','44100','-f','f32le','-']),dtype='<f4').copy()
def main():
 key=os.environ.get('ELEVENLABS_API_KEY','').strip();assert key,'ELEVENLABS_API_KEY is not set'
 ledger=OUT/'PROMPTS.json';D=json.loads(ledger.read_text()) if ledger.exists() else {'provider':'ElevenLabs','endpoint':ENDPOINT,'generations':[]};lock=threading.Lock()
 def generate(job):
  name,duration,text,v=job;file=f'donors/{name}_{v}.mp3';p=OUT/file
  if any(r['file']==file for r in D['generations']) and p.exists():return
  prompt=text+' Original cute painted candy-fantasy mobile game sound. No speech, music, imitation, harsh highs or repeated clicks.'+(' Softer rounded alternate take.' if v==2 else '')
  body={'text':prompt,'duration_seconds':max(.5,duration+.15),'prompt_influence':.6,'model_id':'eleven_text_to_sound_v2','loop':False}
  req=urllib.request.Request(ENDPOINT,data=json.dumps(body).encode(),headers={'xi-api-key':key,'Content-Type':'application/json'},method='POST')
  try:
   with urllib.request.urlopen(req,timeout=180) as r:b=r.read();meta={h:r.headers.get(h) for h in ['request-id','character-cost']}
  except urllib.error.HTTPError as e:raise RuntimeError('ElevenLabs HTTP '+str(e.code)+': '+e.read().decode(errors='replace').replace(key,'[REDACTED]')[:500])
  save(p,b);decode(p)
  with lock:D['generations'].append({'key':'sfx_ses811_'+name,'file':file,'parameters':body,'response':meta,'bytes':len(b),'sha256':sha(p)});js(ledger,D);print('ElevenLabs generated '+file,flush=True)
 jobs=[(name,duration,text,v) for name,duration,text in JOBS for v in [1,2]]
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(generate,jobs))
 rows=[];qa=[]
 for name,duration,text in JOBS:
  options=[];n=round(duration*44100)
  for v in [1,2]:
   p=OUT/f'donors/{name}_{v}.mp3';x=decode(p);peak=max(1e-8,float(np.max(np.abs(x))));on=np.flatnonzero(np.abs(x)>peak*.015);start=max(0,int(on[0])-22);y=x[start:start+n].copy();retained=float(np.sum(y*y)/max(1e-8,np.sum(x*x)));options.append((retained,v,y))
  retained,v,y=max(options,key=lambda t:t[0]);y=np.pad(y,(0,max(0,n-len(y))));y-=np.mean(y);y*=.6/max(1e-8,float(np.max(np.abs(y))));y[:22]*=np.linspace(0,1,22);y[-662:]*=np.linspace(1,0,662)
  file='ses811_'+name+'.mp3';data=ff(['-v','error','-f','f32le','-ar','44100','-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k','-write_xing','0','-f','mp3','pipe:1'],y.astype('<f4').tobytes());save(RUN/file,data);z=decode(RUN/file)
  row={'key':'sfx_ses811_'+name,'path':'assets/audio/sfx/sesame_invoker811/'+file,'bytes':len(data),'sha256':sha(RUN/file),'selected':f'donors/{name}_{v}.mp3','duration':len(z)/44100};rows.append(row)
  qa.append({'key':row['key'],'sampleRate':44100,'channels':1,'peak':float(np.max(np.abs(z))),'dc':float(np.mean(z)),'rms':float(np.sqrt(np.mean(z*z))),'retainedDonorEnergy':retained});assert qa[-1]['peak']<.85 and abs(qa[-1]['dc'])<.02
 js(OUT/'MANIFEST.json',{'assets':rows});js(OUT/'QA_REPORT.json',{'provider':'ElevenLabs','processing':'Mechanical onset trim, DC removal, gain and fades only; no synthesized layers.','ownerListening':'Phone semantic/loudness review pending; technical decode/peak/DC checked.','files':qa});js(RUN/'MANIFEST.json',{'assets':rows});print('Packed six original ElevenLabs cues; all decode/peak/DC checks passed',flush=True)
if __name__=='__main__':main()
