"""Pack ImageGen winter/Lobby assets; only crop, register, resize and encode source pixels."""
from pathlib import Path
import json,hashlib,io
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/mint_winter_update'
OUT=ROOT/'assets/art/mint_winter';OUT.mkdir(parents=True,exist_ok=True)
LOBBY=ROOT/'assets/art/lobby';LOBBY.mkdir(parents=True,exist_ok=True)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(im,p,fmt,**opts):
    buf=io.BytesIO();im.save(buf,format=fmt,**opts);data=buf.getvalue();temp=p.with_suffix(p.suffix+'.tmp');temp.write_bytes(data);temp.replace(p)
    with Image.open(p) as check:check.load();assert check.size==im.size
def frames(name,cols,rows):
    im=Image.open(SRC/'raw'/name).convert('RGBA');w,h=im.size;assert w%cols==h%rows==0
    return [im.crop((c*w//cols,r*h//rows,(c+1)*w//cols,(r+1)*h//rows)) for r in range(rows) for c in range(cols)]
def bbox(im):return im.getchannel('A').point(lambda a:255 if a>=24 else 0).getbbox()
def sheet(key,items,size,register):
    boxes=[bbox(im) for im in items];assert all(boxes)
    common=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
    packed=[]
    if register=='tip':scale=size*.86/max(b[2]-b[0] for b in boxes)
    else:
        common=(0,0,items[0].width,items[0].height)
        scale=size/max(items[0].width,items[0].height)
    for im,b in zip(items,boxes):
        crop=im.crop(b if register=='tip' else common)
        crop=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS)
        cell=Image.new('RGBA',(size,size));x=round(size*.94-crop.width) if register=='tip' else (size-crop.width)//2;y=round(size/2-crop.height/2) if register=='tip' else (size-crop.height)//2
        cell.alpha_composite(crop,(x,y));packed.append(cell)
    strip=Image.new('RGBA',(size*len(items),size))
    for i,im in enumerate(packed):strip.paste(im,(size*i,0))
    save(strip,SRC/(key+'.png'),'PNG');save(strip,OUT/(key+'.webp'),'WEBP',quality=88,method=6)
    # Offline source-art playback only; no game window or simulated gameplay.
    playback=[]
    for im in packed:
        bg=Image.new('RGBA',im.size,(44,35,57,255));bg.alpha_composite(im);playback.append(bg.convert('RGB'))
    playback[0].save(SRC/(key+'.gif'),save_all=True,append_images=playback[1:],duration=83 if len(items)==8 else 63,loop=0)
    return dict(key=key,frames=len(items),width=strip.width,height=size,source_crop=common,registration=register,decoded_bytes=strip.width*size*4)
meta=[sheet('fx_mint_dash_shard',frames('shard.png',2,2),128,'tip'),sheet('fx_mint_snowstorm',frames('storm-initial.png',4,2),256,'common')]
for name in ['speech','thought']:
    im=Image.open(SRC/'raw'/(name+'.png')).convert('RGBA').resize((512,256),Image.Resampling.LANCZOS)
    key='lb_dialog_'+name;save(im,SRC/(key+'.png'),'PNG');save(im,LOBBY/(key+'.webp'),'WEBP',quality=90,method=6)
    meta.append(dict(key=key,frames=1,width=512,height=256,nine_slice=[64]*4,decoded_bytes=512*256*4))
for m in meta:
    m['source']=m['key']+'.png';p=(OUT if m['key'].startswith('fx_') else LOBBY)/(m['key']+'.webp');m['runtime']=p.relative_to(ROOT).as_posix();m['bytes']=p.stat().st_size;m['sha256']=digest(p)
raw=[dict(file=p.relative_to(SRC).as_posix(),bytes=p.stat().st_size,sha256=digest(p)) for p in sorted((SRC/'raw').glob('*.png'))]
(SRC/'MANIFEST.json').write_text(json.dumps(dict(generated_with='built-in ImageGen',processing='source-pixel crop/registration/resize only',assets=meta,raw=raw),indent=2),encoding='utf-8')
report=[]
for m in meta:
    im=Image.open(ROOT/m['runtime']).convert('RGBA');a=im.getchannel('A');assert a.getextrema()[0]==0 and a.getextrema()[1]>200
    report.append(dict(key=m['key'],size=im.size,alpha_extrema=a.getextrema(),sha256=m['sha256'],full_decode=True))
(SRC/'QA_REPORT.json').write_text(json.dumps(dict(assets=report,runtime_bytes=sum(m['bytes'] for m in meta),decoded_bytes=sum(m['decoded_bytes'] for m in meta)),indent=2),encoding='utf-8')
print(json.dumps(dict(assets=len(meta),runtime_bytes=sum(m['bytes'] for m in meta),decoded_bytes=sum(m['decoded_bytes'] for m in meta))))
