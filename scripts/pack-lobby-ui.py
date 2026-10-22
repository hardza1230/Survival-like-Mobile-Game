"""Pack art order 33 (Lobby UI) into runtime WebP: sha/bytes vs MANIFEST, 50% per cell, nineSlice halved.
VFX on black -> luminance alpha (lum x1.35, unpremultiplied). Prints TEMPLE_UI lines for game.js."""
import hashlib, json, os
from PIL import Image
S='assets/incoming/lobby_ui'; D='assets/art/lobby'; os.makedirs(D,exist_ok=True)
def lum_alpha(im):
    px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]; al=min(255,int(max(r,g,b)*1.35))
            if al<8: px[x,y]=(0,0,0,0); continue
            q=255/al; px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
m=json.load(open(f'{S}/MANIFEST.json')); rows=m if isinstance(m,list) else m['assets']; tu={}
for e in rows:
    k=e['key']; raw=open(f"{S}/{e['file']}",'rb').read()
    assert hashlib.sha256(raw).hexdigest()==e['sha256'] and len(raw)==e['bytes'], k
    im=Image.open(f"{S}/{e['file']}").convert('RGBA'); s=e.get('packScale',.5)
    fw,fh,cols,rws=e['frameWidth'],e['frameHeight'],e['columns'],e['rows']
    if e.get('background')=='#000000': lum_alpha(im)
    cw,ch=max(1,round(fw*s)),max(1,round(fh*s)); out=Image.new('RGBA',(cw*cols,ch*rws),(0,0,0,0))
    for r in range(rws):
        for c in range(cols): out.paste(im.crop((c*fw,r*fh,(c+1)*fw,(r+1)*fh)).resize((cw,ch),Image.LANCZOS),(c*cw,r*ch))
    out.save(f'{D}/{k}.webp','WEBP',quality=90,alpha_quality=92,method=6)
    ns=[round(v*s) for v in e['nineSlice']] if e.get('nineSlice') else None
    tu[k]=[cw,ch,cols,ns]; print(k,out.size,ns,os.path.getsize(f'{D}/{k}.webp')//1024,'KB')
print('TEMPLE_UI',json.dumps(tu,separators=(',',':')))
