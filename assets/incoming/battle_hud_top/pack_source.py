"""Mechanical crop, RGBA resize, sprite packing and source-art QA only."""
from pathlib import Path
import json, hashlib, os
from PIL import Image, ImageDraw, ImageFont, ImageOps

P = Path(__file__).resolve().parent
J = json.loads((P/'PROMPTS.json').read_text(encoding='utf-8-sig'))['jobs']
R = Image.Resampling.LANCZOS

def save(im, path):
    temp = path.with_suffix('.tmp.png')
    with temp.open('wb') as f:
        im.save(f, format='PNG'); f.flush(); os.fsync(f.fileno())
    temp.replace(path)
    with Image.open(path) as check: check.verify()

def bbox(im):
    return im.getchannel('A').point(lambda a:255 if a>=24 else 0).getbbox()

def fit(im, size, stretch=False, pad=2):
    b=bbox(im)
    out=Image.new('RGBA',size)
    if not b:return out
    im=im.crop(b)
    target=(size[0]-2*pad,size[1]-2*pad)
    if stretch:im=im.resize(target,R)
    else:im.thumbnail(target,R)
    out.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2))
    return out

def groups(im):
    a=im.getchannel('A')
    on=[a.crop((x,0,x+1,im.height)).getextrema()[1]>=32 for x in range(im.width)]
    runs=[];start=None
    for x,v in enumerate(on+[False]):
        if v and start is None:start=x
        if not v and start is not None:
            if x-start>im.width*.015:runs.append((start,x))
            start=None
    return runs

manifest=[];qa=[];crops={}
for j in J:
    key=j['key']; src=Image.open(P/'originals'/f'{key}.png').convert('RGBA')
    w,h=j['width'],j['height']; n=j['frames']; fw,fh=j['frame_width'],j['frame_height']
    if n==1:
        out=fit(src,(w,h),stretch=key not in ('hud_ic_kill','hud_ic_sugar','hud_ic_pause'))
        crops[key]={'alpha_crop':bbox(src)}
    else:
        out=Image.new('RGBA',(w,h));runs=groups(src)
        crops[key]={'column_groups':runs,'original_size':list(src.size)}
        # Explicit frame crops may be recorded after visual inspection.
        overrides=json.loads((P/'FRAME_CROPS.json').read_text()) if (P/'FRAME_CROPS.json').exists() else {}
        boxes=overrides.get(key)
        if boxes is None:
            if len(runs)==n:boxes=[[a,0,b,src.height] for a,b in runs]
            else:boxes=[[round(i*src.width/n),0,round((i+1)*src.width/n),src.height] for i in range(n)]
        crops[key]['frame_crops']=boxes
        # Sheets use cell crops, retaining an equal-scale aligned coordinate system.
        pieces=[src.crop(tuple(box)) if box is not None else None for box in boxes]
        if key=='hud_speed_ring':
            # x1 is explicitly an empty state; never import accidental pixels.
            pieces[0]=None
        # State sprites share one scale: glow must not make the active disc smaller.
        common_scale=None
        if key=='hud_round_btn':
            bounds=[bbox(im) for im in pieces]
            common_scale=min((fw-8)/max(b[2]-b[0] for b in bounds),(fh-8)/max(b[3]-b[1] for b in bounds))
        for i,im in enumerate(pieces):
            if im is None:continue
            if key=='hud_speed_ring':
                # Crops are equal cells; preserve their transparent interior and location.
                frame=im.resize((fw,fh),R)
            elif common_scale:
                im=im.crop(bbox(im));im=im.resize((round(im.width*common_scale),round(im.height*common_scale)),R)
                frame=Image.new('RGBA',(fw,fh));frame.alpha_composite(im,((fw-im.width)//2,(fh-im.height)//2))
            else:frame=fit(im,(fw,fh),pad=4 if fw>=100 else 3)
            out.alpha_composite(frame,(i*fw,0))
    dest=P/f'{key}.png';save(out,dest)
    a=out.getchannel('A');hist=a.histogram()
    record={'key':key,'file':dest.name,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'width':w,'height':h,'frames':n,'frame_width':fw,'frame_height':fh,'columns':n,'background':'transparent','display_px':None}
    if j.get('nineSlice'):record['nineSlice']=j['nineSlice']
    display={'hud_top_panel':[340,56],'hud_mission_card':[340,75],'hud_exp_frame':[280,11],'hud_exp_fill':[280,8],'hud_level_badge':[52,32],'hud_counter_pill':[64,24],'hud_mission_bar_frame':[230,9],'hud_mission_bar_fill':[230,8],'hud_boss_bar_frame':[300,18],'hud_boss_bar_fill':[300,12],'hud_boss_plate':[300,43],'hud_ic_kill':[18,18],'hud_ic_sugar':[18,18],'hud_wave_pips':[12,12],'hud_ic_pause':[18,18],'hud_ic_sound':[18,18],'hud_round_btn':[34,34],'hud_speed_ring':[34,34]}
    record['display_px']=display[key]
    manifest.append(record)
    qa.append({'key':key,'size_pass':out.size==(w,h),'mode':out.mode,'transparent_pixels':hist[0],'opaque_pixels':hist[255],'alpha_min':a.getextrema()[0],'alpha_max':a.getextrema()[1],'frame_alpha_bounds':[bbox(out.crop((i*fw,0,(i+1)*fw,fh))) for i in range(n)]})
(P/'MANIFEST.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
(P/'CROP_LOG.json').write_text(json.dumps(crops,indent=2),encoding='utf-8')
(P/'QA_REPORT.json').write_text(json.dumps({'scope':'Source art and offline compositions only; no runtime/gameplay verification.','assets':qa,'visual_review':'Pending final contact sheet inspection.','text_free':'Pending manual visual inspection; no OCR claim.'},indent=2),encoding='utf-8')

# Neutral background contact sheet; originals and exported files remain unaltered.
board=Image.new('RGB',(1000,6*160),'#79747d');d=ImageDraw.Draw(board)
for i,j in enumerate(J):
    im=Image.open(P/(j['key']+'.png')).convert('RGBA');im.thumbnail((310,116),R)
    x=(i%3)*333;y=(i//3)*160
    board.paste(im,(x+(333-im.width)//2,y+35),im);d.text((x+7,y+8),j['key'],fill='white')
save(board,P/'contact_sheet.png')
print('Packed and verified',len(manifest),'assets')
