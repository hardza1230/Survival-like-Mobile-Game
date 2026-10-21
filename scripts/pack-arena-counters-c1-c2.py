"""Pack assets/incoming/arena_counters_c1_c2 (art order 31) into runtime WebP under assets/art/boss_vfx/.
Black VFX -> luminance alpha (lum x1.35, unpremultiplied), NORMAL blend. Counter objects (background transparent) keep their alpha.
Prints ASSET_FX lines with fill = visible bbox fraction (for kitSize)."""
import json, os, hashlib
from PIL import Image
SRC='assets/incoming/arena_counters_c1_c2'; DST='assets/art/counters'
os.makedirs(DST, exist_ok=True)
man=json.load(open(f'{SRC}/MANIFEST.json'));man=man if isinstance(man,list) else man['assets']
RATE={'warn':8,'impact':14,'wave':5.6,'lane':10}
lines=[]
for m in man:
  key=m['key']; path=os.path.join(SRC,os.path.basename(m['file']))
  assert hashlib.sha256(open(path,'rb').read()).hexdigest()==m['sha256'],key
  im=Image.open(path).convert('RGBA')
  if m.get('background')!='transparent':
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
        if al<8: px[x,y]=(0,0,0,0); continue
        q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
  im.save(f'{DST}/{key}.webp','WEBP',quality=88,alpha_quality=90,method=6)
  fw,fh,n=m['frameWidth'],m['frameHeight'],m['frameCount']; cols=m['columns']
  bw=bh=0
  for i in range(n):
    c=im.crop(((i%cols)*fw,(i//cols)*fh,(i%cols+1)*fw,(i//cols+1)*fh)).getchannel('A').point(lambda v:255 if v>40 else 0).getbbox()
    if c: bw=max(bw,(c[2]-c[0])/fw); bh=max(bh,(c[3]-c[1])/fh)
  kind=key.split('_')[-1]; rate=RATE.get(kind, 8 if m['loop'] else (10 if n>=8 else 12))
  if key.startswith('counter_'): rate=8
  if key=='vfx_counter_hit': rate=14
  e=f"  {key}:{{url:'assets/art/counters/{key}.webp',fw:{fw},fh:{fh},frames:{n},rate:{rate},anchor:'{m.get("anchor","center")}'"+(",loop:true" if m['loop'] else "")+(f",fill:[{bw:.2f},{bh:.2f}]" if kind in('warn','wave') or key.endswith(('root_cage','maw','wither_pull','last_seed')) else "")+"},"
  lines.append(e); print(key, os.path.getsize(f'{DST}/{key}.webp')//1024,'KB')
open('/tmp/claude-0/-home-user-Survival-like-Mobile-Game/9e03b873-402a-5a60-9a25-b5d176b34784/scratchpad/c12fx.txt','w').write('\n'.join(lines)+'\n')
