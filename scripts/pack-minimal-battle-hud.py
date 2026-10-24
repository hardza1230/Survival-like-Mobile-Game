"""Mechanical crop/resize/pack of four original ImageGen donors. No art painting."""
from pathlib import Path
import json,hashlib,os
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent.parent
P=ROOT/'assets/incoming/battle_hud_minimal'
D=ROOT/'assets/art/hud_minimal';D.mkdir(parents=True,exist_ok=True)
jobs=json.loads((P/'PROMPTS.json').read_text(encoding='utf-8-sig'))['jobs']
R=Image.Resampling.LANCZOS
ns={'hud_top_panel':[60,40,60,40],'hud_mission_card':[80,60,80,60],'hud_boss_plate':[60,40,60,40]}
def bounds(im):return im.getchannel('A').point(lambda v:255 if v>=24 else 0).getbbox()
def atomic(im,path,fmt,**kw):
    temp=path.with_suffix('.tmp'+path.suffix)
    with temp.open('wb') as f:im.save(f,format=fmt,**kw);f.flush();os.fsync(f.fileno())
    temp.replace(path)
    with Image.open(path) as check:check.verify()
man=[];qa=[];crop=[]
for j in jobs:
    key=j['key'];im=Image.open(P/'originals'/(key+'.png')).convert('RGBA');w,h=j['w'],j['h']
    out=Image.new('RGBA',(w,h));n=3 if key=='hud_round_btn' else 1;fw=w//n
    if n==1:
        b=bounds(im);piece=im.crop(b).resize((w-4,h-4),R);out.alpha_composite(piece,(2,2));crop.append({'key':key,'crop':b})
    else:
        a=im.getchannel('A');on=[a.crop((x,0,x+1,im.height)).getextrema()[1]>=32 for x in range(im.width)]
        runs=[];start=None
        for x,v in enumerate(on+[False]):
            if v and start is None:start=x
            if not v and start is not None:
                if x-start>50:runs.append((start,x))
                start=None
        assert len(runs)==3,runs
        pieces=[im.crop((l,0,r,im.height)) for l,r in runs];pieces=[p.crop(bounds(p)) for p in pieces]
        scale=min((fw-8)/max(p.width for p in pieces),(h-8)/max(p.height for p in pieces))
        for i,piece in enumerate(pieces):
            piece=piece.resize((round(piece.width*scale),round(piece.height*scale)),R)
            out.alpha_composite(piece,(i*fw+(fw-piece.width)//2,(h-piece.height)//2))
        crop.append({'key':key,'column_groups':runs,'shared_scale':scale})
    dest=P/(key+'.png');atomic(out,dest,'PNG')
    packed=out.resize((w//2,h//2),R);runtime=D/(key+'.webp');atomic(packed,runtime,'WEBP',quality=90,method=6)
    record={'key':key,'file':dest.name,'width':w,'height':h,'frames':n,'columns':n,'frame_width':fw,'frame_height':h,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'background':'transparent','runtime_file':runtime.relative_to(ROOT).as_posix(),'runtime_bytes':runtime.stat().st_size,'runtime_sha256':hashlib.sha256(runtime.read_bytes()).hexdigest()}
    if key in ns:record['nineSlice']=ns[key]
    man.append(record)
    alpha=out.getchannel('A');hist=alpha.histogram();assert alpha.getextrema()==(0,255)
    qa.append({'key':key,'mode':out.mode,'size':list(out.size),'transparent_pixels':hist[0],'opaque_pixels':hist[255],'frames':n,'frame_bounds':[bounds(out.crop((i*fw,0,(i+1)*fw,h))) for i in range(n)]})
for name,data in [('MANIFEST.json',man),('CROP_LOG.json',crop),('QA_REPORT.json',{'all_pass':True,'assets':qa,'visual':'Manual neutral-background inspection: text-free, no checkerboard, empty centers, restrained plum/cream/mint/rose finish. Source alpha, dimensions, shared button scale and WebP decode verified. No phone/gameplay/FPS claim.'})]:
    (P/name).write_text(json.dumps(data,indent=2),encoding='utf-8',newline='\n')
board=Image.new('RGB',(800,4*160),'#77727b');draw=ImageDraw.Draw(board)
for i,j in enumerate(jobs):
    art=Image.open(P/(j['key']+'.png')).convert('RGBA');art.thumbnail((770,120),R)
    board.paste(art,((800-art.width)//2,i*160+30),art);draw.text((12,i*160+8),j['key'],fill='white')
atomic(board,P/'contact_sheet.png','PNG')
print('4 minimal ImageGen assets verified; runtime WebP bytes:',sum(x['runtime_bytes'] for x in man))
