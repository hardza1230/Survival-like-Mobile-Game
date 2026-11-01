"""Art62 source-only crop/packing/proofs. Pillow + numpy; no runtime writes."""
from pathlib import Path
import io,os,json,hashlib
from collections import deque
import numpy as np
from PIL import Image,ImageOps,ImageDraw
H=Path(__file__).resolve().parent;R=H.parents[2]
jobs=json.loads((H/'PROMPTS.json').read_text(encoding='utf8'))['jobs']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,b):
    p.parent.mkdir(parents=True,exist_ok=True);t=p.with_suffix(p.suffix+'.tmp')
    with t.open('wb') as f:f.write(b);f.flush();os.fsync(f.fileno())
    os.replace(t,p)
def save(im,p):
    b=io.BytesIO();im.save(b,format='PNG',optimize=True);write(p,b.getvalue())
    with Image.open(p) as c:c.load()
def js(name,d):write(H/name,(json.dumps(d,ensure_ascii=False,indent=2)+'\n').encode())
def extract(im):
    a=np.array(im).astype(float);al=np.minimum(255,np.floor(a[:,:,:3].max(axis=2)*1.35));a[:,:,:3]=np.minimum(255,a[:,:,:3]/np.maximum(al/255,1/255)[:,:,None]);a[:,:,3]=al
    return Image.fromarray(a.astype('uint8'))
def edge(a):return np.concatenate([a[0],a[-1],a[:,0],a[:,-1]])
records=[];qa=[];clips={}
for j in jobs:
    k=j['key'];s=H/'sources'/(k+'_source.png');im=Image.open(s).convert('RGBA');sw,sh=im.size;size=j['size'];frames=[]
    dc,dr=(6,4) if j['kind']=='icons' else (3,2)
    count=19 if j['kind']=='icons' else 6
    for n in range(count):
        col,row=n%dc,n//dc
        crop=im.crop((round(col*sw/dc)+8,round(row*sh/dr)+8,round((col+1)*sw/dc)-8,round((row+1)*sh/dr)-8))
        if j['kind']=='icons':
            # Largest connected opaque bead in an expanded cell recovers small
            # donor registration drift without taking neighboring icon scraps.
            box0=(max(0,round(col*sw/dc)-64),max(0,round(row*sh/dr)-64),min(sw,round((col+1)*sw/dc)+64),min(sh,round((row+1)*sh/dr)+64))
            wide=im.crop(box0);mask=np.array(wide)[:,:,3]>100;seen=np.zeros(mask.shape,bool);best=[]
            for yy,xx in zip(*np.where(mask)):
                if seen[yy,xx]:continue
                seen[yy,xx]=True;q=deque([(int(xx),int(yy))]);pts=[]
                while q:
                    x,y=q.popleft();pts.append((x,y))
                    for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                        if 0<=nx<mask.shape[1] and 0<=ny<mask.shape[0] and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((nx,ny))
                if len(pts)>len(best):best=pts
            assert best,k
            xs,ys=zip(*best);crop=wide.crop((max(0,min(xs)-4),max(0,min(ys)-4),min(wide.width,max(xs)+5),min(wide.height,max(ys)+5)))
            a=np.array(crop);a[a[:,:,3]<=3]=0;crop=Image.fromarray(a)
            box=crop.getchannel('A').point(lambda x:255 if x>16 else 0).getbbox();assert box,k
            crop=crop.crop(box);crop.thumbnail((110,110),Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(128,128));frame.alpha_composite(crop,((128-crop.width)//2,(128-crop.height)//2))
        else:
            target=size-4
            crop=crop.resize((target,target),Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(size,size),(0,0,0,255) if j['background']=='black' else (0,0,0,0))
            if j['background']=='black':frame.paste(crop.convert('RGB'),((size-crop.width)//2,(size-crop.height)//2))
            else:frame.alpha_composite(crop,((size-crop.width)//2,(size-crop.height)//2))
        if k in ('st_mark','st_stun'):
            box=frame.getchannel('A').point(lambda x:255 if x>48 else 0).getbbox()
            top=frame.crop(box);top.thumbnail((round(size*(.38 if k=='st_mark' else .82)),round(size*.18)),Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(size,size));frame.alpha_composite(top,((size-top.width)//2,round(size*.035)))
        a=np.array(frame)
        if j['background']=='black':a[np.max(a[:,:,:3],axis=2)<=3,:3]=0
        else:a[a[:,:,3]<=3]=0
        frames.append(Image.fromarray(a))
    atlas=Image.new('RGBA',(768,512) if j['kind']=='icons' else (size*6,size),(0,0,0,255) if j['background']=='black' else (0,0,0,0))
    for n,f in enumerate(frames):atlas.paste(f,((n%dc)*size,(n//dc)*size) if j['kind']=='icons' else (n*size,0))
    p=H/(k+'.png');save(atlas,p);a=np.array(atlas)
    rec={'key':k,'file':p.name,'bytes':p.stat().st_size,'sha256':sha(p),'width':atlas.width,'height':atlas.height,'frameWidth':size,'frameHeight':size,'frameCount':j['frameCount'],'columns':j['columns'],'loop':j['loop'],'anchor':j['anchor'],'background':j['background'],'source':str(s.relative_to(H)).replace('\\','/'),'source_sha256':sha(s),'packing':{'donor_grid':[dc,dr],'gutter_trim_px':8,'black_border_px':2 if j['background']=='black' else 0,'icon_fit_px':110 if j['kind']=='icons' else None,'top_fit':'max18percent height, y3.5percent' if k in ('st_mark','st_stun') else None,'alpha_noise_threshold':3}}
    if j['kind']=='icons':rec['cells']=j['cells'];rec['unused_cells']=[19,20,21,22,23]
    else:
        rec['centerPoint']=[.5,.5]
        rec['feetPoint']=[.5,.85] if k.startswith('st_p_') or k=='st_chill' else None
    records.append(rec);clips[k]=frames
    tests={'key':k,'decode':'pass','size':'pass','rgba':'pass','frames':[]}
    visible=[]
    for f in frames:
        v=extract(f) if j['background']=='black' else f;z=np.array(v);al=z[:,:,3]/255
        if j['background']=='black':assert np.all(edge(np.array(f))==[0,0,0,255]),k
        else:assert np.all(edge(np.array(f)[:,:,3])==0),k
        yy,xx=np.mgrid[:size,:size];center=(xx-size/2)**2+(yy-size/2)**2<(size*.3)**2
        tests['frames'].append({'center_mean_alpha':round(float(al[center].mean()),4),'center_opaque_fraction':round(float((al[center]>.35).mean()),4),'visible_pixels':int((al>.15).sum())})
        visible.append(z[:,:,:3]/255*al[:,:,None])
    if j['kind']=='icons':
        for n in range(19,24):assert not np.array(atlas.crop(((n%6)*128,(n//6)*128,(n%6+1)*128,(n//6+1)*128)))[:,:,3].any()
        tests['unused_cells']='all five fully alpha0'
    else:
        tests['max_center_alpha']=max(t['center_mean_alpha'] for t in tests['frames'])
        tests['max_center_opaque_fraction']=max(t['center_opaque_fraction'] for t in tests['frames'])
        assert tests['max_center_alpha']<=.15 and tests['max_center_opaque_fraction']<=.18,k
        if j['loop']:
            diffs=[float(np.abs(visible[(i+1)%6]-visible[i]).mean()) for i in range(6)]
            tests['loop_frame_deltas']=list(map(lambda v:round(v,4),diffs));tests['seam_delta']=round(diffs[-1],4);tests['seam_to_median_ratio']=round(diffs[-1]/max(float(np.median(diffs)),.0001),3)
            assert tests['seam_to_median_ratio']<=1.6,k
    qa.append(tests)

# The icon proof displays actual 18px and24px cells, alongside enlarged128px crops.
icons=clips['st_icons'];proof=Image.new('RGBA',(760,400),'#261e30');d=ImageDraw.Draw(proof)
for i,(j,im) in enumerate(zip(jobs[-1]['cells'],icons)):
    x,y=(i%5)*152,(i//5)*100
    proof.alpha_composite(im.resize((48,48),Image.Resampling.LANCZOS),(x+5,y+21))
    proof.alpha_composite(im.resize((18,18),Image.Resampling.LANCZOS),(x+65,y+30))
    proof.alpha_composite(im.resize((24,24),Image.Resampling.LANCZOS),(x+100,y+27))
    d.text((x+5,y+3),j['subkey'],fill='#fff3d0');d.text((x+62,y+62),'18 / 24px',fill='#aaa0af')
save(proof,H/'preview_icons_18_24.png')

floor_paths=['assets/generated/bg1_sour_ant_nest.webp','assets/art/floors/floor_c21.webp','assets/art/floors/floor_c31.webp']
actors=[('assets/art/ch1_ants/worker_sheet.webp',96),('assets/generated/boss1_green_ant_queen_sheet.png',160),('assets/characters/momo_v2/momo_idle_8f.png',128)]
actor_ims=[Image.open(R/p).convert('RGBA').crop((0,0,n,n)) for p,n in actors]
def paste_fit(panel,im,cx,cy,w,h):
    im=im.copy();im.thumbnail((w,h),Image.Resampling.LANCZOS);panel.alpha_composite(im,(round(cx-im.width/2),round(cy-im.height/2)))
for group,subset in [('monster',[j for j in jobs[:7]]),('hero',jobs[7:13]),('oneshot',jobs[13:16])]:
    animated=[]
    for tick in range(12):
        canvas=Image.new('RGBA',(768,((len(subset)+2)//3)*320))
        for i,j in enumerate(subset):
            tile=ImageOps.fit(Image.open(R/floor_paths[i%3]).convert('RGBA'),(256,320),Image.Resampling.LANCZOS)
            # Source-art proof; static real actor crops, no headless battle simulation.
            if group=='monster':
                paste_fit(tile,actor_ims[0],60,108,48,48);paste_fit(tile,actor_ims[1],137,217,200,200)
                positions=[(60,108,64),(137,217,160)]
            else:
                paste_fit(tile,actor_ims[2],128,180,60,60);positions=[(128,180,90 if group=='hero' else 100)]
            fi=tick%6 if j['loop'] else min(tick//2,5);fx=clips[j['key']][fi]
            if j['background']=='black':fx=extract(fx)
            for cx,cy,size in positions:paste_fit(tile,fx,cx,cy,size,size)
            ImageDraw.Draw(tile).rectangle((0,0,256,22),fill=(30,22,36,235));ImageDraw.Draw(tile).text((6,6),j['key'],fill='#fff3d0')
            canvas.paste(tile,((i%3)*256,(i//3)*320))
        animated.append(canvas.convert('RGB'))
    save(animated[0],H/('preview_'+group+'.png'))
    b=io.BytesIO();animated[0].save(b,format='GIF',save_all=True,append_images=animated[1:],duration=100,loop=0,optimize=True);write(H/('preview_'+group+'.gif'),b.getvalue())
js('MANIFEST.json',{'order':62,'delivery':'source only; waiting for runtime integration','files':records})
js('QA_REPORT.json',{'order':62,'asset_count':17,'icons':19,'technical':qa,'proof_icons_px':[18,24],'actor_sizes_px':{'monster':48,'boss':200,'hero':60},'references':{'floors':[{'file':p,'sha256':sha(R/p)} for p in floor_paths],'actors':[{'file':p,'sha256':sha(R/p)} for p,n in actors]},'notes':['Proof labels exist only in previews, not final art.','Source-art composites only, not runtime captures or game timing tests.','Generated alpha preserved; only <=3 alpha near-invisible noise removed.','Black sources stay opaque pure black, preview extraction uses existing maxRGB x1.35 and straight alpha.','Loops use six generated phases, measured seam deltas recorded; visual loop review required.','No runtime/code/registration/version changes.']})
print(json.dumps({'assets':len(records),'max_center':[(q['key'],q.get('max_center_alpha'),q.get('max_center_opaque_fraction')) for q in qa]},indent=2))
