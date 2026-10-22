"""Pack art order 34 (Lobby hero motion) into runtime WebP: sha/bytes vs MANIFEST, 75% per frame (384x480).
Sesame is skipped (hero still in development). Prints the LH_SHEETS table for game.js."""
import hashlib, json, os
from PIL import Image
S='assets/incoming/lobby_hero_motion'; D='assets/art/lobby_hero'; SC=.75; SKIP={'sesame'}
tab={}
for hero in ['momo','yuzu','mint','cocoa','taro','sesame']:
    if hero in SKIP: continue
    os.makedirs(f'{D}/{hero}',exist_ok=True)
    for e in json.load(open(f'{S}/{hero}/MANIFEST.json')):
        k=e['key']; raw=open(f"{S}/{hero}/{e['file']}",'rb').read()
        assert hashlib.sha256(raw).hexdigest()==e['sha256'] and len(raw)==e['bytes'], k
        im=Image.open(f"{S}/{hero}/{e['file']}").convert('RGBA')
        fw,fh,cols,rws,n=e['frameWidth'],e['frameHeight'],e['columns'],e['rows'],e['frameCount']
        cw,ch=round(fw*SC),round(fh*SC); out=Image.new('RGBA',(cw*n,ch),(0,0,0,0))
        for i in range(n):
            c,r=i%cols,i//cols; out.paste(im.crop((c*fw,r*fh,(c+1)*fw,(r+1)*fh)).resize((cw,ch),Image.LANCZOS),(i*cw,0))
        out.save(f'{D}/{hero}/{k}.webp','WEBP',quality=88,alpha_quality=90,method=6)
        tab[k]=[n,e['frameMs'],1 if e['loop'] else 0]
        print(k,out.size,os.path.getsize(f'{D}/{hero}/{k}.webp')//1024,'KB')
print('LH_SHEETS',json.dumps(tab,separators=(',',':')))
