"""Direct ElevenLabs Sound Effects generation, resumable ledger; never writes a key."""
import argparse,concurrent.futures,datetime,hashlib,json,os,subprocess,threading,time,urllib.request,urllib.error
from pathlib import Path
H=Path(__file__).resolve().parent;R=H.parents[2]
def save(p,data):
    p.parent.mkdir(parents=True,exist_ok=True);t=p.with_suffix(p.suffix+'.tmp')
    with t.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    t.replace(p)
def js(p,d):save(p,(json.dumps(d,ensure_ascii=False,indent=2)+'\n').encode())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def parse():
    rows=[];group=''
    for line in (R/'docs/audio_orders/A06_NEW_FEATURES_SFX.md').read_text(encoding='utf8').splitlines():
        if line.startswith('### '):group=line[4:5]
        cells=[c.strip() for c in line.split('|')]
        if len(cells)<8 or not cells[1].startswith('`sfx_'):continue
        rows.append({'key':cells[1].strip('`'),'file':cells[2].strip('`'),'durationMs':round(float(cells[3].split()[0])*1000),'targetLufsS':-float(cells[4].split()[0].replace('−','')),'briefPrompt':cells[5].strip('`'),'group':group,'loop':False})
    assert len(rows)==28 and len({r['key'] for r in rows})==28
    return rows
def main():
    a=argparse.ArgumentParser();a.add_argument('--workers',type=int,default=2);opts=a.parse_args()
    rows=parse();js(H/'REQUESTS.json',rows)
    key=os.environ.get('ELEVENLABS_API_KEY','').strip()
    if not key:
        import winreg
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER,'Environment') as reg:key=winreg.QueryValueEx(reg,'ELEVENLABS_API_KEY')[0].strip()
    ledger_path=H/'PROMPTS.json'
    ledger=json.loads(ledger_path.read_text(encoding='utf8')) if ledger_path.exists() else {'provider':'ElevenLabs','endpoint':'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128','generations':[],'selected':{}}
    if not ledger['generations'] and (H/'ACCESS_TEST_PROMPT.json').exists():
        old=json.loads((H/'ACCESS_TEST_PROMPT.json').read_text());p=H/old['selectedDonor']
        ledger['generations'].append({'key':old['key'],'variant':1,'parameters':old['parameters'],'file':old['selectedDonor'],'bytes':p.stat().st_size,'sha256':digest(p),'response':old['response'],'createdAtUtc':json.loads((H/'ACCESS_TEST.json').read_text())['testedAtUtc'],'reusedAccessTest':True})
    js(ledger_path,ledger);done={(x['key'],x['variant']) for x in ledger['generations']};lock=threading.Lock();stop=threading.Event()
    style=' Original candy-fantasy SFX. No human sounds, lyrics, casino, imitation or music bed. Immediate attack, gentle highs, clear on phones.'
    def generate(job):
        r,v=job
        if stop.is_set():return
        if (r['key'],v) in done:return
        prompt=r['briefPrompt']+style+f" Gesture ends by {r['durationMs']/1000:g}s, then soft decay."
        if v==2:prompt+=' Rounder take.'
        if v==3:prompt+=' Crisper take.'
        assert len(prompt)<=450,(r['key'],len(prompt))
        body={'text':prompt,'duration_seconds':max(.5,r['durationMs']/1000+.3),'prompt_influence':.6,'model_id':'eleven_text_to_sound_v2','loop':False}
        req=urllib.request.Request(ledger['endpoint'],data=json.dumps(body).encode(),headers={'xi-api-key':key,'Content-Type':'application/json'},method='POST')
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req,timeout=180) as response:
                    data=response.read();metadata={h:response.headers.get(h) for h in ['request-id','character-cost'] if response.headers.get(h)}
                break
            except urllib.error.HTTPError as e:
                detail=e.read().decode(errors='replace').replace(key,'[REDACTED]')
                if e.code==429 and attempt<2:time.sleep(min(15,3*(attempt+1)));continue
                stop.set();raise RuntimeError(f'ElevenLabs {e.code}: {detail[:700]}')
        p=H/'donors'/f"{r['key']}_{v:02d}.mp3";save(p,data)
        subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True,check=True)
        rec={'key':r['key'],'variant':v,'parameters':body,'file':str(p.relative_to(H)).replace('\\','/'),'bytes':len(data),'sha256':digest(p),'response':metadata,'createdAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
        with lock:
            ledger['generations'].append(rec);js(ledger_path,ledger)
            print(f"Donors {len(ledger['generations'])}/84: {r['key']} take{v}",flush=True)
    jobs=[(r,v) for r in rows for v in (1,2,3)]
    errors=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=opts.workers) as pool:
        for f in concurrent.futures.as_completed([pool.submit(generate,j) for j in jobs]):
            try:f.result()
            except Exception as e:errors.append(str(e));print(str(e),flush=True)
    if errors:raise SystemExit(1)
    print('Completed84 ElevenLabs donors /28 ordered keys',flush=True)
if __name__=='__main__':main()
