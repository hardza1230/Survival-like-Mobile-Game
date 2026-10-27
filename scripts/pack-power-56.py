"""Mechanically crop/resize the six ImageGen icons, preserving their original alpha."""
from pathlib import Path
from PIL import Image
import hashlib,json,os
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/power56/icons_source.png'
im=Image.open(src).convert('RGBA');assert im.getchannel('A').getextrema()[0]==0
names=['power','weave','equipment','merge','forge','talent'];sheet=Image.new('RGBA',(576,384));cells=[]
for i,name in enumerate(names):
 x=i%3;y=i//3;rect=(round(x*im.width/3),round(y*im.height/2),round((x+1)*im.width/3),round((y+1)*im.height/2));cell=im.crop(rect)
 box=cell.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox();assert box
 art=cell.crop(box);k=164/max(art.size);art=art.resize((round(art.width*k),round(art.height*k)),Image.Resampling.LANCZOS)
 dx=(192-art.width)//2;dy=(192-art.height)//2;sheet.alpha_composite(art,(x*192+dx,y*192+dy));cells.append(dict(name=name,frame=i,source_rect=rect,crop=box,destination=[dx,dy,*art.size]))
dest=root/'assets/art/mobile_ui_789/gear_power56_icons.webp';tmp=dest.with_suffix('.tmp.webp');sheet.save(tmp,'WEBP',lossless=True,method=6)
with tmp.open('r+b')as f:os.fsync(f.fileno())
tmp.replace(dest)
manifest=dict(source=src.relative_to(root).as_posix(),source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),path=dest.relative_to(root).as_posix(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,size=sheet.size,frame=192,alpha=sheet.getchannel('A').getextrema(),cells=cells)
(root/'assets/incoming/power56/MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
matte=Image.new('RGB',sheet.size,(42,32,49));matte.paste(sheet,mask=sheet.getchannel('A'));matte.save(root/'assets/incoming/power56/alpha_review.png')
with Image.open(dest)as check:check.load();assert check.size==(576,384)
print(json.dumps({k:v for k,v in manifest.items()if k!='cells'}))
