"""Pack art order 26 (page transition + card icons) into runtime WebP.
Card icons 256 -> 128 (cards show <=90px) in assets/art/card_icons/ (stage-lazy); relics -> assets/art/icons/relic_<id>.webp like the old relics.
Transition (boot): curtain 1080x1920 -> 540x960 opaque, edge 160x1920 -> 80x960, emblem 512 -> 256,
sparkle 4x(256x512) -> 4x(128x256), puff 3x2x256 -> 3x2x128. VFX on black -> luminance alpha (lum x1.35) for NORMAL blend."""
import json, os
from PIL import Image
S='assets/incoming/transition_card_icons'
def lum_alpha(im):
    px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
            if al<8: px[x,y]=(0,0,0,0); continue
            q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
os.makedirs('assets/art/card_icons',exist_ok=True); os.makedirs('assets/art/transition',exist_ok=True)
out=[]
for e in json.load(open(f'{S}/MANIFEST.json')):
    k=e['key']; im=Image.open(f'{S}/{e["file"]}').convert('RGBA'); fw,fh,cols,rows=e['frameWidth'],e['frameHeight'],e['columns'],e['rows']
    vfx=k.startswith('vfx_'); s=.5
    if vfx: lum_alpha(im)
    cw,ch=round(fw*s),round(fh*s); o=Image.new('RGBA',(cw*cols,ch*rows),(0,0,0,0))
    for r in range(rows):
        for c in range(cols): o.paste(im.crop((c*fw,r*fh,(c+1)*fw,(r+1)*fh)).resize((cw,ch),Image.LANCZOS),(c*cw,r*ch))
    if k.startswith('tr_') or vfx: p=f'assets/art/transition/{k}.webp'
    elif k.startswith('relic_'): p=f'assets/art/icons/{k}.webp'
    else: p=f'assets/art/card_icons/{k}.webp'
    if k=='tr_curtain': o.convert('RGB').save(p,'WEBP',quality=84,method=6)
    else: o.save(p,'WEBP',quality=90,alpha_quality=92,method=6)
    out.append({'key':k,'file':p,'fw':cw,'fh':ch,'cols':cols,'rows':rows,'frames':e.get('frameCount',cols*rows),'loop':bool(e.get('loop')),'hero':e.get('hero'),'category':e.get('category')})
json.dump(out,open('assets/art/card_icons/MANIFEST.json','w'),indent=1)
print(len(out),'packed')
