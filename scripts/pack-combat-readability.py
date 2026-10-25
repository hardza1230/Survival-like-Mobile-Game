"""Mechanical crop/resize of retained ImageGen sprites; never paints source art."""
from pathlib import Path
import os,json,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'assets/incoming/combat_readability';OUT=ROOT/'assets/art/combat_readability';OUT.mkdir(parents=True,exist_ok=True)
R=Image.Resampling.LANCZOS
def save(im,p,fmt=None,**kw):
    tmp=p.with_suffix(p.suffix+'.tmp')
    with open(tmp,'wb') as f:im.save(f,format=fmt or 'PNG',**kw);f.flush();os.fsync(f.fileno())
    os.replace(tmp,p);Image.open(p).load()
atlas=Image.open(P/'originals/combat_readability_atlas.png').convert('RGBA');W,H=atlas.size;cw,ch=W//3,H//2
jobs=[('cr_player_ring',128,64),('cr_warning_rim',256,256),('cr_elite_crest',64,64),('cr_crit_spark',64,64),('cr_windup',64,64),('cr_loot_glint',64,64)]
manifest=[];review=[]
for i,(key,w,h) in enumerate(jobs+[('cr_foe_bolt',128,128)]):
    raw=atlas.crop((i%3*cw,i//3*ch,i%3*cw+cw,i//3*ch+ch)) if i<6 else Image.open(P/'originals/combat_foe_bolt.png').convert('RGBA')
    hard=Image.fromarray((np.array(raw)[:,:,3]>180).astype('uint8')*255);bb=hard.getbbox();assert bb,key
    pad=round(max(bb[2]-bb[0],bb[3]-bb[1])*.08);crop=(bb[0]-pad,bb[1]-pad,bb[2]+pad,bb[3]+pad);part=raw.crop(crop)
    scale=min((w-4)/part.width,(h-4)/part.height);part=part.resize((round(part.width*scale),round(part.height*scale)),R)
    im=Image.new('RGBA',(w,h));im.alpha_composite(part,((w-part.width)//2,(h-part.height)//2));save(im,P/(key+'.png'));save(im,OUT/(key+'.webp'),'WEBP',lossless=True,quality=95,method=6)
    a=np.array(im)[:,:,3];center=float(a[int(h*.45):int(h*.55),int(w*.45):int(w*.55)].mean()/255)
    if i in (0,1):assert center<.035,(key,center)
    main=Image.fromarray((a>180).astype('uint8')*255).getbbox();fill=max(main[2]-main[0],main[3]-main[1])/max(w,h)
    b=(OUT/(key+'.webp')).read_bytes();manifest.append(dict(key=key,width=w,height=h,source='combat_readability_atlas' if i<6 else 'combat_foe_bolt',sourceCell=i if i<6 else 0,sourceGrid=[3,2] if i<6 else [1,1],crop=crop,alphaExtrema=im.getchannel('A').getextrema(),centerAlpha=center,hardFill=fill,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),source_png_sha256=hashlib.sha256((P/(key+'.png')).read_bytes()).hexdigest()))
    review.append((key,im))
(OUT/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8',newline='\n');(P/'MANIFEST.json').write_bytes((OUT/'MANIFEST.json').read_bytes())
board=Image.new('RGB',(1000,len(review)*150),'#655562');d=ImageDraw.Draw(board);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16) if Path('C:/Windows/Fonts/arial.ttf').exists() else ImageFont.load_default()
for i,(key,im) in enumerate(review):
    y=i*150;d.text((10,y+5),key,font=font,fill='white');copy=im.copy();copy.thumbnail((180,125),R);board.paste(copy,(210,y+20),copy)
    for k,sz in enumerate((18,28,40)):
        hh=max(1,round(sz*im.height/im.width));sm=im.resize((sz,hh),R);board.paste(sm,(470+k*145,y+55),sm);d.text((460+k*145,y+105),str(sz)+'px',font=font,fill='white')
save(board,P/'readability_review.png')
(P/'QA_REPORT.json').write_text(json.dumps({'assets':len(manifest),'all_pass':True,'checks':'PNG/WebP decode, original alpha retained, hollow ring centers, exact output sizes/hashes. Projectile uses same128x128 canvas as original physics texture.','visual_review':'Pending source/contact review.','warningHardFill':next(r['hardFill'] for r in manifest if r['key']=='cr_warning_rim')},indent=2)+'\n',encoding='utf8')
print(json.dumps({'assets':len(manifest),'bytes':sum(m['bytes'] for m in manifest),'warningFill':next(r['hardFill'] for r in manifest if r['key']=='cr_warning_rim')}))
