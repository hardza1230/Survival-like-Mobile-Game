"""Mechanical sprite packing, periodic mirror assembly and alpha-preview QA.
All painted content comes from the retained original ImageGen sheets.
No runtime/gameplay files are changed by this script.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
import numpy as np
import json,hashlib,os
P=Path(__file__).resolve().parent
J=json.loads((P/'PROMPTS.json').read_text(encoding='utf-8-sig'))['jobs']
R=Image.Resampling.LANCZOS
(P/'preview_webp').mkdir(exist_ok=True)

def atomic(im,path,fmt='PNG',**kw):
    tmp=path.with_suffix('.tmp'+path.suffix)
    with tmp.open('wb') as f:im.save(f,format=fmt,**kw);f.flush();os.fsync(f.fileno())
    tmp.replace(path)
    with Image.open(path) as v:v.verify()

def box(im,alpha=False,threshold=12):
    a=np.asarray(im)
    mask=a[:,:,3]>threshold if alpha else a[:,:,:3].max(axis=2)>threshold
    ys,xs=np.where(mask)
    return (int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)) if len(xs) else None

def lum_alpha(im):
    a=np.asarray(im.convert('RGB'),dtype=np.float32)
    al=np.minimum(255,np.floor(a.max(axis=2)*1.35));al[al<8]=0
    rgb=np.minimum(255,np.floor(a*255/np.maximum(1,al[:,:,None])))
    out=np.dstack([rgb,al]).astype(np.uint8);out[al==0]=0
    return Image.fromarray(out,'RGBA')

def periodic(im,size,both=False):
    # Reflection packing preserves generated paint and produces exact matching edges.
    w,h=size
    q=im.resize((w//2,h//2 if both else h),R)
    out=Image.new('RGB',(w,h))
    out.paste(q,(0,0));out.paste(ImageOps.mirror(q),(w//2,0))
    if both:
        out.paste(ImageOps.flip(q),(0,h//2));out.paste(ImageOps.flip(ImageOps.mirror(q)),(w//2,h//2))
    return out

def grid_bounds(im,count,axis,alpha=False):
    a=np.asarray(im)
    mask=a[:,:,3]>12 if alpha else a[:,:,:3].max(axis=2)>12
    line=mask.any(axis=0 if axis=='x' else 1)
    size=len(line);runs=[];start=None
    for i,v in enumerate(list(~line)+[False]):
        if v and start is None:start=i
        if not v and start is not None:
            if i-start>=2:runs.append((start+i)//2)
            start=None
    out=[0]
    for i in range(1,count):
        ideal=size*i/count
        candidates=[x for x in runs if abs(x-ideal)<size/count*.32]
        out.append(min(candidates,key=lambda x:abs(x-ideal)) if candidates else round(ideal))
    return out+[size]

manifest=[];qa=[];crops=[];all_frames={};alpha_frames={}
for j in J:
    key=j['key'];fw,fh,n,cols,rows=[j[k] for k in ['fw','fh','n','cols','rows']]
    original=Image.open(P/'originals'/(key+'.png')).convert('RGBA')
    transparent=bool(j.get('transparent'));raw=[];bounds=[]
    gx=grid_bounds(original,cols,'x',transparent);gy=grid_bounds(original,rows,'y',transparent)
    for i in range(n):
        x,y=i%cols,i//cols
        cell=original.crop((gx[x],gy[y],gx[x+1],gy[y+1]))
        if not transparent:
            flat=Image.new('RGBA',cell.size,'black');flat.alpha_composite(cell);cell=flat.convert('RGB')
        b=box(cell,transparent)
        assert b,key+' empty frame '+str(i)
        raw.append(cell);bounds.append(b)
    pieces=[im.crop(b) for im,b in zip(raw,bounds)]
    maxw=max(im.width for im in pieces);maxh=max(im.height for im in pieces)
    common=min((fw-12)/maxw,(fh-16)/maxh)
    if transparent:common=min((fw-12)/maxw,(180-10)/maxh)
    mode='common scale, centered';frames=[]
    for i,piece in enumerate(pieces):
        out=Image.new('RGBA' if transparent else 'RGB',(fw,fh),(0,0,0,0) if transparent else 'black')
        if key=='vfx_b07_fog_tile':
            # Edge-to-edge fog fills each tile; no transparent padding.
            out=periodic(raw[i].convert('RGB'),(fw,fh),both=True);mode='periodic mirror assembly in both axes'
        elif key.endswith(('sludge_band','root_band')):
            band=periodic(piece.convert('RGB'),(fw,fh-8));out.paste(band,(0,4));mode='periodic mirror assembly horizontally; no horizontal padding'
        elif 'clock_hand' in key:
            piece=piece.resize((fw,fh-8),R);out.paste(piece,(0,4));mode='left-center pivot, zero horizontal padding, mechanical strip resize'
        else:
            scale=min((fw-12)/piece.width,(fh-12)/piece.height) if key=='vfx_b04_frost_breath' else common
            resized=piece.resize((max(1,round(piece.width*scale)),max(1,round(piece.height*scale))),R)
            x=(fw-resized.width)//2;y=(fh-resized.height)//2
            if transparent:
                # Opaque ice meets the common y180 ground line; soft shadow may extend below.
                opaque=box(resized,True,200) or box(resized,True)
                y=180-opaque[3];mode='common scale; opaque ground baseline y180'
            elif key.endswith(('burrow_burst','hot_tile')):
                y=fh-6-resized.height;mode='common scale; common ground baseline'
            elif key=='vfx_b04_frost_breath':mode='common outer hazard radius normalized per frame'
            out.paste(resized,(x,y))
        frames.append(out.convert('RGBA'))
    sheet=Image.new('RGBA',(cols*fw,rows*fh),(0,0,0,0) if transparent else (0,0,0,255))
    for i,f in enumerate(frames):sheet.paste(f,((i%cols)*fw,(i//cols)*fh))
    source=P/(key+'.png');atomic(sheet,source)
    converted=sheet if transparent else lum_alpha(sheet)
    alpha_frames[key]=[converted.crop(((i%cols)*fw,(i//cols)*fh,(i%cols+1)*fw,(i//cols+1)*fh)) for i in range(n)]
    all_frames[key]=frames
    preview=Image.new('RGBA',(sheet.width//2,sheet.height//2))
    for i,frame in enumerate(alpha_frames[key]):
        preview.paste(frame.resize((fw//2,fh//2),R),((i%cols)*(fw//2),(i//cols)*(fh//2)))
    webp=P/'preview_webp'/(key+'.webp');atomic(preview,webp,'WEBP',quality=86,alpha_quality=90,method=6)
    af=alpha_frames[key];bboxes=[box(f,True,40) for f in af]
    fills=[[(b[2]-b[0])/fw,(b[3]-b[1])/fh] if b else [0,0] for b in bboxes]
    entry={'key':key,'file':source.name,'width':sheet.width,'height':sheet.height,'frameWidth':fw,'frameHeight':fh,'frameCount':n,'columns':cols,'rows':rows,'background':'transparent' if transparent else '#000000','loop':j['loop'],'anchor':j['anchor'],'holdFrame':1 if transparent else None,'bytes':source.stat().st_size,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'stage_index':j['stage'],'fill':[round(max(f[0] for f in fills),4),round(max(f[1] for f in fills),4)],'preview_file':webp.relative_to(P).as_posix(),'preview_bytes':webp.stat().st_size,'preview_sha256':hashlib.sha256(webp.read_bytes()).hexdigest(),'preview_scale':.5}
    if transparent:entry.update({'origin':[.5,180/192],'ground_y':180})
    entry['stage_indices']=[5,9] if key=='vfx_b06_pod_shield' else [j['stage']]
    entry['suggested_rate']=8 if j['loop'] else 12
    if key=='vfx_b03_hot_tile':entry.update({'holdFrame':1,'warningFrames':[0,1],'activeFrames':[2,3,4,5]})
    if key=='vfx_b04_frost_breath':entry.update({'holdFrame':0,'warningFrames':[0],'activeFrames':[1,2,3]})
    if transparent:entry['states']={'intact':0,'cracked':1,'breaking':[2,3]}
    manifest.append(entry)
    checks={'key':key,'size':[sheet.width,sheet.height],'frames':n,'frame_bounds_after_lum_alpha':bboxes,'frame_fill':fills,'unique_frames':len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames}),'source_mode':sheet.mode,'source_alpha_extrema':sheet.getchannel('A').getextrema()}
    if key=='vfx_b07_fog_tile' or key.endswith(('sludge_band','root_band')):
        checks['horizontal_seam_exact']=all(np.array_equal(np.asarray(f)[:,0],np.asarray(f)[:,-1]) for f in frames)
        assert checks['horizontal_seam_exact']
        decoded=Image.open(webp).convert('RGBA');deltas=[]
        for i in range(n):
            f=np.asarray(decoded.crop(((i%cols)*fw//2,(i//cols)*fh//2,(i%cols+1)*fw//2,(i//cols+1)*fh//2)),dtype=np.int16)
            deltas.append(int(np.abs(f[:,0]-f[:,-1]).max()))
        checks['preview_lossy_horizontal_edge_max_delta']=deltas
    if key=='vfx_b07_fog_tile':
        checks['vertical_seam_exact']=all(np.array_equal(np.asarray(f)[0],np.asarray(f)[-1]) for f in frames)
        assert checks['vertical_seam_exact']
    if key in ['vfx_b04_frost_breath','vfx_b06_pod_shield','vfx_b07_air_bubble','vfx_b03_hot_tile']:
        checks['center_alpha_mean']=[]
        for f in af:
            aa=np.asarray(f)[:,:,3];y,x=np.ogrid[:fh,:fw];mask=(x-fw/2)**2+(y-fh/2)**2<(min(fw,fh)*.15)**2
            checks['center_alpha_mean'].append(round(float(aa[mask].mean()/255),4))
    if transparent:checks['ground_line_y']=180
    assert checks['unique_frames']==n,key+' repeated frame'
    if key in ['vfx_b04_frost_breath','vfx_b06_pod_shield','vfx_b07_air_bubble']:
        assert max(checks['center_alpha_mean'])<.16,key+' opaque safe center'
    if key=='vfx_b03_hot_tile':assert max(checks['center_alpha_mean'][:2])<.05
    qa.append(checks);crops.append({'key':key,'original_size':original.size,'source_grid_x':gx,'source_grid_y':gy,'grid_crop_bounds':bounds,'packing':mode,'common_scale':common})

for name,data in [('MANIFEST.json',manifest),('CROP_LOG.json',crops),('QA_REPORT.json',{'all_pass':True,'scope':'Source art + offline floor composites, not runtime/gameplay tests.','alpha_conversion':'A: max(R,G,B)*1.35, alpha<8 discarded, RGB unpremultiplied; matches existing C3 packer. B: original alpha retained.','periodic_packing':'Generated fog/strip paint assembled by mechanical reflections for exact tile edges; raw donors retained.','assets':qa,'packed_preview_bytes':sum(m['preview_bytes'] for m in manifest),'decoded_preview_bytes':sum(m['width']*m['height'] for m in manifest),'visual_review':'Pending final floor/contact review.'})]:
    (P/name).write_text(json.dumps(data,indent=2),encoding='utf-8',newline='\n')

def board_at(t):
    board=Image.new('RGB',(1200,4*250),'#29232f');d=ImageDraw.Draw(board)
    for k,j in enumerate(J):
        x=(k%3)*400;y=(k//3)*250;key=j['key'];d.text((x+8,y+7),key,fill='white')
        i=t%j['n'] if j['loop'] else min(t,j['n']-1)
        f=alpha_frames[key][i].copy();f.thumbnail((360,210),R);board.paste(f,(x+(400-f.width)//2,y+30+(210-f.height)//2),f)
    return board
atomic(board_at(0),P/'contact_sheet.png')
anim=[board_at(t) for t in range(12)]
anim[0].save(P/'animation_review.gif',save_all=True,append_images=anim[1:],duration=160,loop=0,optimize=False)
print('Packed12sheets /',sum(j['n'] for j in J),'frames; preview bytes',sum(m['preview_bytes'] for m in manifest))
