#!/usr/bin/env python3
"""Pack art order 21 (Temple Weave UI) from assets/incoming/temple_weave_ui into assets/art/temple/ui.
Backgrounds -> 720x1280 · UI pieces -> 50% (sources were drawn at 2x on-screen; DPR budget) · small icons kept ·
sparkle sheet: brightness -> alpha. Writes MANIFEST.json with scaled cells and nineSlice margins."""
import json, os
from PIL import Image
SRC='assets/incoming/temple_weave_ui'; OUT='assets/art/temple/ui'
m=json.load(open(os.path.join(SRC,'MANIFEST.json')))
out=[]
for e in m:
    k=e['key']; im=Image.open(os.path.join(SRC,k+'.png')).convert('RGBA')
    if e['background']=='opaque': s=720/im.width
    elif max(im.width,im.height)<=200: s=1.0
    else: s=0.5
    if k=='temple_sparkle_sheet':
        px=im.load()
        for y in range(im.height):
            for x in range(im.width):
                r,g,b,a=px[x,y]; l=max(r,g,b); px[x,y]=(r,g,b,min(255,int(l*1.35)))
    cw,ch=round(e['cellWidth']*s),round(e['cellHeight']*s)
    W,H=cw*e['columns'],ch*e['rows']
    # resize per cell so cells stay on exact integer grid
    dst=Image.new('RGBA',(W,H),(0,0,0,0))
    for r in range(e['rows']):
        for c in range(e['columns']):
            cell=im.crop((c*e['cellWidth'],r*e['cellHeight'],(c+1)*e['cellWidth'],(r+1)*e['cellHeight']))
            dst.paste(cell.resize((cw,ch),Image.LANCZOS),(c*cw,r*ch))
    p=os.path.join(OUT,k+'.webp')
    if e['background']=='opaque': dst.convert('RGB').save(p,'WEBP',quality=84,method=6)
    else: dst.save(p,'WEBP',quality=90,method=6)
    ns=[max(1,round(v*s)) for v in e['nineSlice']] if e['nineSlice'] else None
    out.append({'key':k,'file':p,'cw':cw,'ch':ch,'cols':e['columns'],'rows':e['rows'],'nineSlice':ns,'states':e['states']})
    print(k,W,H,cw,ch,ns,os.path.getsize(p)//1024,'KB')
json.dump(out,open(os.path.join(OUT,'MANIFEST.json'),'w'),indent=1)
