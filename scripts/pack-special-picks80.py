"""Pack assets/incoming/special_picks80 (art order 80) into assets/art/special_picks80/ WebP.
Stills keep alpha; book80_page_glow is black-background VFX -> luminance alpha (max channel x1.35, unpremultiplied).
Sizes: vault bg 75% · book spread 75% · page glow frames 288x360 · path cards 384x576 · pedestal/anvil as delivered."""
import json, os, hashlib
from PIL import Image
SRC='assets/incoming/special_picks80'; DST='assets/art/special_picks80'
os.makedirs(DST, exist_ok=True)
man=json.load(open(f'{SRC}/MANIFEST.json'))
assert len(man)==21, len(man)
SIZE={'vault80_bg':(540,756),'book80_spread':(768,480)}
tot=0; dec=0
for m in man:
  key=m['key']; path=f"{SRC}/{m['file']}"; raw=open(path,'rb').read()
  assert len(raw)==m['bytes'] and hashlib.sha256(raw).hexdigest()==m['sha256'], key
  im=Image.open(path).convert('RGBA'); assert im.size==(m['width'],m['height']), key
  if key=='book80_page_glow':
    fw,fh,n=m['frameWidth'],m['frameHeight'],m['frameCount']; out=Image.new('RGBA',(288*n,360))
    for i in range(n):
      f=im.crop((i*fw,0,(i+1)*fw,fh)).resize((288,360),Image.LANCZOS); px=f.load()
      for y in range(f.height):
        for x in range(f.width):
          r,g,b,a=px[x,y]; al=min(255,int(max(r,g,b)*1.35))
          if al<8: px[x,y]=(0,0,0,0); continue
          q=255/al; px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
      out.paste(f,(i*288,0))
    im=out
  elif key.startswith('pathcard80_'): im=im.resize((384,576),Image.LANCZOS)
  elif key in SIZE: im=im.resize(SIZE[key],Image.LANCZOS)
  im.save(f'{DST}/{key}.webp','WEBP',quality=88,alpha_quality=90,method=6)
  sz=os.path.getsize(f'{DST}/{key}.webp'); tot+=sz; dec+=im.width*im.height*4
  print(f'{key:24s} {im.width}x{im.height} {sz//1024} KB')
print('total',tot//1024,'KB · decoded',round(dec/1048576,1),'MB')
