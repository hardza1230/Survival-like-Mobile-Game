"""Pack art order 38 (tutorial UI) into runtime WebP: sha/bytes vs MANIFEST, icons/frame/VFX 50% per cell
(finger kept at 128), nineSlice halved. Native alpha kept (no luminance conversion). Prints TEMPLE_UI lines."""
import hashlib, json, os
from PIL import Image
S='assets/incoming/tutorial_ui'; D='assets/art/tutorial'; os.makedirs(D,exist_ok=True)
tu={}
for e in json.load(open(f'{S}/MANIFEST.json')):
    k=e['key']; raw=open(f"{S}/{e['file']}",'rb').read()
    assert hashlib.sha256(raw).hexdigest()==e['sha256'] and len(raw)==e['bytes'], k
    im=Image.open(f"{S}/{e['file']}").convert('RGBA'); s=1 if k=='tut_finger' else .5
    fw,fh,cols,rws=e['frameWidth'],e['frameHeight'],e['columns'],e['rows']
    cw,ch=round(fw*s),round(fh*s); out=Image.new('RGBA',(cw*cols,ch*rws),(0,0,0,0))
    for r in range(rws):
        for c in range(cols): out.paste(im.crop((c*fw,r*fh,(c+1)*fw,(r+1)*fh)).resize((cw,ch),Image.LANCZOS),(c*cw,r*ch))
    out.save(f'{D}/{k}.webp','WEBP',quality=90,alpha_quality=92,method=6)
    n=e.get('nineSlice'); ns=[round(n[q]*s) for q in ('left','top','right','bottom')] if n else None
    tu[k]=[cw,ch,cols,ns]; print(k,out.size,ns,os.path.getsize(f'{D}/{k}.webp')//1024,'KB')
print('TEMPLE_UI',json.dumps(tu,separators=(',',':')))
