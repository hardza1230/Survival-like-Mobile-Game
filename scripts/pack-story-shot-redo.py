"""Mechanical sizing, sprite packing and offline proofs for art order46.
Painted pixels come only from retained built-in ImageGen originals.
"""
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
import json,hashlib,io,os
R=Path('assets/incoming/story_shot_redo')
def write(im,p):
    b=io.BytesIO();im.save(b,format='PNG');raw=b.getvalue();tmp=p.with_suffix('.tmp');tmp.write_bytes(raw);os.replace(tmp,p)
    with Image.open(p) as check:check.verify()
    return dict(bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest(),width=im.width,height=im.height)
def main():
    assets=[];prompts=[];originals=[]
    for id in ['roots_burst','city_night','root_fx']:
        d=json.loads((R/'_sources'/f'{id}.json').read_text(encoding='utf-8-sig'))
        d.update(id=id,source=f'_sources/{id}.png');raw=(R/d['source']).read_bytes();d['source_sha256']=hashlib.sha256(raw).hexdigest()
        with Image.open(R/d['source']) as check:check.verify()
        with Image.open(R/d['source']) as check:check.load();size=list(check.size)
        originals.append(dict(file=d['source'],sha256=d['source_sha256'],bytes=len(raw),size=size,png_crc_decode='PASS'));prompts.append(d)
    for id,key in [('roots_burst','cs_s01_far_roots_burst'),('city_night','cs_s00_far_city_night')]:
        im=ImageOps.fit(Image.open(R/'_sources'/f'{id}.png').convert('RGB'),(1080,1920),Image.Resampling.LANCZOS)
        a=dict(key=key,file=key+'.png',frames=1,frame_width=1080,frame_height=1920,blend='NORMAL',pivot=[.5,.5],background='opaque RGB',source=f'_sources/{id}.png',dialogue_safe_from_y=1380)
        a.update(write(im,R/a['file']));assets.append(a)
    im=Image.open(R/'_sources/root_fx.png').convert('RGBA');cells=[];boxes=[];subjects=[]
    for i in range(6):
        # The painted row valley is480, not the nominal512; preserve every root tip.
        x=i%3;y=i//3;box=[round(x*im.width/3),0 if y==0 else 480,round((x+1)*im.width/3),480 if y==0 else im.height];boxes.append(box)
        cell=im.crop(box);subject=cell.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox();assert subject
        assert subject[0]>0 and subject[1]>0 and subject[2]<cell.width and subject[3]<cell.height,'Inspect source-cell clipping'
        subjects.append(subject);cells.append(cell.crop(subject))
    ground=464
    scale=min(508/max(c.width for c in cells),(ground-16)/max(c.height for c in cells));strip=Image.new('RGBA',(3240,540))
    for i,c in enumerate(cells):
        c=c.resize((round(c.width*scale),round(c.height*scale)),Image.Resampling.LANCZOS);strip.alpha_composite(c,(i*540+(540-c.width)//2,ground-c.height))
    a=dict(key='cs_fx_root_burst',file='cs_fx_root_burst.png',frames=6,frame_width=540,frame_height=540,blend='NORMAL',pivot=[.5,ground/540],background='transparent RGBA',source='_sources/root_fx.png',source_boxes=boxes,source_subjects=subjects,common_scale=scale,padding=16,registration='Painted crack/wood baseline fixed at464; one scale for all six poses',loop=False,hold_last=True)
    a.update(write(strip,R/a['file']));assets.append(a)
    (R/'MANIFEST.json').write_text(json.dumps(dict(art_order=46,source_only=True,assets=assets),indent=2)+'\n',encoding='utf-8')
    (R/'PROMPTS.json').write_text(json.dumps(dict(tool='built-in ImageGen',jobs=prompts),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    review=R/'review';review.mkdir(exist_ok=True)
    sheet=Image.new('RGB',(1080,400),'#777777');frames=[]
    for i in range(6):
        frame=strip.crop((540*i,0,540*(i+1),540));thumb=ImageOps.contain(frame,(175,330),Image.Resampling.LANCZOS);sheet.paste(thumb,(i*180,20),thumb);ImageDraw.Draw(sheet).text((i*180+15,365),f'FRAME {i+1}',fill='white')
        canvas=Image.new('RGB',(360,360),'#777777');small=frame.resize((360,360),Image.Resampling.LANCZOS);canvas.paste(small,(0,0),small);frames.append(canvas)
    sheet.save(review/'FX-gray-contact.jpg',quality=94)
    frames[0].save(review/'root-burst.gif',save_all=True,append_images=frames[1:],duration=[130,110,90,90,100,1100],loop=0)
    for a in assets[:2]:
        # Review-only caption band and a native source-pixel character composite.
        im=ImageOps.fit(Image.open(R/a['file']).convert('RGBA'),(360,780),Image.Resampling.LANCZOS)
        if a['key'].startswith('cs_s01'):
            pup=Image.open('assets/incoming/story_motion/shared/cs_pup_mochi_berry_scared.png').convert('RGBA');pup=ImageOps.contain(pup,(100,100),Image.Resampling.LANCZOS);im.alpha_composite(pup,(75,350))
        draw=ImageDraw.Draw(im);draw.rectangle((0,561,360,780),fill='#211629');draw.text((20,590),'STORY / ART STAGING PROOF',fill='#f1d29b',font_size=16);draw.text((20,630),'Caption area reserved',fill='white',font_size=15)
        im.save(review/(a['key']+'-360x780.png'))
    checks=[]
    for a in assets:
        path=R/a['file'];raw=path.read_bytes()
        with Image.open(path) as check:check.verify()
        with Image.open(path) as check:check.load();mode=check.mode;size=check.size
        assert size==(a['width'],a['height']);assert hashlib.sha256(raw).hexdigest()==a['sha256']
        if a['frames']==6:
            al=strip.getchannel('A');assert al.getextrema()[0]==0 and al.getextrema()[1]>200
            for i in range(6):
                cell=al.crop((i*540,0,(i+1)*540,540));assert cell.getbbox()
                for box in [(0,0,540,16),(0,524,540,540),(0,0,16,540),(524,0,540,540)]:assert cell.crop(box).getbbox() is None
        else:assert mode=='RGB'
        checks.append(dict(key=a['key'],png_crc_decode='PASS',sha256=a['sha256'],bytes=len(raw),size=list(size),mode=mode))
    (R/'QA_REPORT.json').write_text(json.dumps(dict(status='PASS',assets=checks,original_sources=originals,visual_review=['No text or watermarks','Roots have no mouth, eyes or face','City is dark starry night with crown and violet curse; no rainbow','Lower28% is quiet floor/plaza; pantry left-middle remains available for character'],method='Original ImageGen pixels only; aspect-preserving sizing and uniform shared-scale FX registration; PNG chunk CRC/full decode, actual SHA256, dimensions, RGB opacity/RGBA transparency and16px per-frame gutters.'),indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(files=3,bytes=sum(a['bytes'] for a in assets),status='PASS')))
if __name__=='__main__':main()
