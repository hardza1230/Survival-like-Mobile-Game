"""Recompress shipped assets in place (packing standard v8.1.139 · docs: .claude/skills/wire-art/SKILL.md "Packing standard").
Only files referenced by game.js as 'assets/...'. Keeps a new file only if it is >=10% smaller. Sources stay in git history and assets/incoming/.
WebP: quality 80 (75 for files > 150 KB), alpha 85. PNG/JPG untouched (renaming would change keys).
MP3: music/story 80k stereo 44.1 kHz · voice/acting mono 56k · other SFX 96k. WAV untouched.
Usage: python3 scripts/compress-assets.py [--dry] [--jobs 3] [--only list.txt]
After writing, refresh the ledger: python3 scripts/compress-assets.py --ledger (records original sha/bytes of every changed file vs git HEAD into assets/RECOMPRESSED.json; tests/_packed.cjs uses it)"""
import os,re,io,sys,subprocess,tempfile
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
DRY='--dry' in sys.argv; JOBS=int(sys.argv[sys.argv.index('--jobs')+1]) if '--jobs' in sys.argv else 3
src=open('game.js',encoding='utf8').read()
files=sorted({u for u in re.findall(r"'(assets/[^']+\.(?:webp|mp3))'",src)}|{u for u in re.findall(r'"(assets/[^"]+\.(?:webp|mp3))"',src)})
files=[f for f in files if os.path.isfile(f)]
if '--only' in sys.argv: only=set(open(sys.argv[sys.argv.index('--only')+1]).read().split()); files=[f for f in files if f in only]
def webp(f):
    a=os.path.getsize(f)
    try:
        im=Image.open(f); im.load(); n_frames=getattr(im,'n_frames',1)
        if n_frames>1: return f,a,a
        b=io.BytesIO(); im.save(b,'WEBP',quality=75 if a>150_000 else 80,alpha_quality=85,method=6); d=b.getvalue()
        if len(d)<=a*0.9:
            if not DRY: open(f,'wb').write(d)
            return f,a,len(d)
    except Exception as e: print('skip',f,e,file=sys.stderr)
    return f,a,a
def mp3(f):
    a=os.path.getsize(f); low=f.lower()
    if any(k in low for k in ('/acting/','/voices/','vo_')): args=['-ac','1','-ar','44100','-b:a','56k']
    elif any(k in low for k in ('/bgm/','/story_music/','bgm_')): args=['-ar','44100','-b:a','80k']
    else: args=['-ar','44100','-b:a','96k']
    fd,o=tempfile.mkstemp(suffix='.mp3'); os.close(fd)
    try:
        r=subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f,'-map_metadata','-1']+args+[o])
        n=os.path.getsize(o) if r.returncode==0 else a
        if n<=a*0.9:
            if not DRY: os.replace(o,f); o=None
            return f,a,n
        return f,a,a
    finally:
        if o and os.path.exists(o): os.remove(o)
def write_ledger():
    import hashlib,json
    path='assets/RECOMPRESSED.json'; L=json.load(open(path))['files'] if os.path.exists(path) else {}
    ch=[p for p in subprocess.run(['git','diff','--name-only','HEAD'],capture_output=True,text=True).stdout.split() if p.startswith('assets/') and p.endswith(('.webp','.mp3')) and os.path.exists(p)]
    for p in ch:
        old=subprocess.run(['git','show','HEAD:'+p],capture_output=True).stdout; new=open(p,'rb').read()
        if not old or old==new: continue
        prev=L.get(p); orig=(prev['sha256'],prev['bytes']) if prev and prev.get('packed_sha256')==hashlib.sha256(old).hexdigest() else (hashlib.sha256(old).hexdigest(),len(old))
        L[p]={'sha256':orig[0],'bytes':orig[1],'packed_sha256':hashlib.sha256(new).hexdigest(),'packed_bytes':len(new)}
    json.dump({'note':'original delivery sha256/bytes of files recompressed in place by scripts/compress-assets.py (packing standard v8.1.139)','files':L},open(path,'w'),indent=0,sort_keys=True)
    print('ledger',len(L),'files')
if __name__=='__main__':
    if '--ledger' in sys.argv: write_ledger(); sys.exit(0)
    W=[f for f in files if f.endswith('.webp')]; M=[f for f in files if f.endswith('.mp3')]
    with ProcessPoolExecutor(JOBS) as ex: rw=list(ex.map(webp,W,chunksize=16)); rm=list(ex.map(mp3,M,chunksize=8))
    mb=lambda x:x/1048576
    for name,r in (('webp',rw),('mp3',rm)):
        A=sum(a for _,a,_ in r);B=sum(b for *_,b in r);ch=sum(1 for _,a,b in r if b<a)
        print(f'{name}: {len(r)} files · {ch} recompressed · {mb(A):.1f} -> {mb(B):.1f} MB')
    print('DRY RUN' if DRY else 'written')
