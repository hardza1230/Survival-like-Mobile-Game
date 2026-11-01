"""Repack ImageGen source art only. Never imports or changes game runtime."""
import hashlib, io, json, os, argparse
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, ImageDraw

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
parser=argparse.ArgumentParser();parser.add_argument('--chapter',type=int,default=3);args=parser.parse_args()
spec=json.loads((HERE/'PROMPTS.json').read_text(encoding='utf8'))
jobs=[j for j in spec['jobs'] if j.get('boss',0)<=args.chapter*5 and j.get('chapter',0)<=args.chapter]
crowns=json.loads((HERE/'CROWN_POINTS.json').read_text())
records=[];checks=[];images={}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def atomic(p,data):
    p.parent.mkdir(parents=True,exist_ok=True);t=p.with_suffix(p.suffix+'.tmp')
    with t.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    os.replace(t,p)
def png(im,p):
    b=io.BytesIO();im.save(b,format='PNG',optimize=True);atomic(p,b.getvalue())
    with Image.open(p) as c:c.load()
def jsave(name,d):atomic(HERE/name,(json.dumps(d,ensure_ascii=False,indent=2)+'\n').encode('utf8'))
def edge(a):return np.concatenate([a[0],a[-1],a[:,0],a[:,-1]])
for j in jobs:
    key=j['key'];sub='b%02d'%j['boss'] if j.get('boss') else 'shared'
    source=HERE/'sources'/sub/(key+'_source.png')
    assert source.exists(),str(source)
    im=Image.open(source).convert('RGBA');sw,sh=im.size;w,h=j['width'],j['height']
    frames=[]
    if j['type']=='fx':
        dc,dr=j['donor_cols'],j['donor_rows'];fw,fh=j['frame_w'],j['frame_h']
        for i in range(j['frames']):
            x,y=i%dc,i//dc
            # Remove generated grid lines only from donor cell gutters, not artwork.
            crop=im.crop((round(x*sw/dc)+4,round(y*sh/dr)+4,round((x+1)*sw/dc)-4,round((y+1)*sh/dr)-4)).convert('RGB')
            crop=crop.resize((round(fw*.88),round(fh*.88)),Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(fw,fh),(0,0,0,255));frame.paste(crop,((fw-crop.width)//2,(fh-crop.height)//2))
            a=np.array(frame);a[np.max(a[:,:,:3],axis=2)<=3,:3]=0
            frame=Image.fromarray(a);assert np.all(edge(np.array(frame))==[0,0,0,255])
            frames.append(frame)
        final=Image.new('RGBA',(w,h),(0,0,0,255))
        for i,f in enumerate(frames):final.paste(f,(i*fw,0))
        transform={'donor_grid':[dc,dr],'gutter_trim_source_px':4,'common_cell_scale':.88,'near_black_threshold':3,'phase_order':'left-right then top-bottom'}
    elif j['type']=='freed':
        a=np.array(im);assert a[:,:,3].min()==0 and a[:,:,3].max()==255,key
        box=im.getchannel('A').point(lambda x:255 if x>3 else 0).getbbox()
        crop=im.crop(box)
        fit=(220,300) if j.get('boss')==5 else (640,860)
        crop.thumbnail(fit,Image.Resampling.LANCZOS)
        final=Image.new('RGBA',(w,h));final.alpha_composite(crop,((w-crop.width)//2,(h-crop.height)//2))
        a=np.array(final);a[a[:,:,3]==0,:3]=0;final=Image.fromarray(a)
        transform={'alpha_crop':list(box),'uniform_fit':list(fit),'placement':'center','alpha':'generated alpha preserved; invisible RGB zeroed'}
    else:
        final=ImageOps.fit(im.convert('RGB'),(w,h),Image.Resampling.LANCZOS).convert('RGBA')
        transform={'opaque_resize':'uniform centered cover','source_size':[sw,sh]}
    assert final.size==(w,h) and final.mode=='RGBA'
    p=HERE/sub/(key+'.png');png(final,p);a=np.array(final)
    if j['background']=='transparent':assert np.all(edge(a[:,:,3])==0) and np.any(a[:,:,3]==255)
    else:assert np.all(a[:,:,3]==255)
    r={'key':key,'file':str(p.relative_to(HERE)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':sha(p),'size':[w,h],'alpha':j['background']=='transparent','background':j['background'],'frames':j['frames'],'mode':'RGBA','source':str(source.relative_to(HERE)).replace('\\','/'),'source_sha256':sha(source),'transform':transform}
    if j['type']=='fall':
        r['crown']=crowns[key];assert 0<r['crown'][0]<w and 0<r['crown'][1]<h
        r['text_safe']=[0,1440,1080,480]
    if j['type']=='fx':r.update(frame_w=j['frame_w'],frame_h=j['frame_h'],cols=j['frames'],rows=1)
    records.append(r);images[key]=frames if frames else final
    checks.append({'key':key,'decode':'pass','dimensions':'pass','mode':'RGBA','alpha_extrema':[int(a[:,:,3].min()),int(a[:,:,3].max())],'edge_alpha':sorted(map(int,np.unique(edge(a[:,:,3])))),'black_cell_edges':'pass' if j['type']=='fx' else None,'crown':r.get('crown')})

def extract(frame):
    a=np.array(frame).astype('float32');al=np.minimum(255,np.floor(a[:,:,:3].max(axis=2)*1.35))
    a[:,:,:3]=np.minimum(255,a[:,:,:3]/np.maximum(al/255,1/255)[:,:,None]);a[:,:,3]=al
    return Image.fromarray(a.astype('uint8'))
def viewport(im):
    # Preserve the full 9:16 source in a taller phone viewport; footer is proof-only.
    from PIL import ImageFilter
    panel=ImageOps.fit(im,(360,780),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(16))
    fitted=ImageOps.contain(im,(360,640),Image.Resampling.LANCZOS)
    panel.paste(fitted,((360-fitted.width)//2,0))
    return panel.convert('RGBA')
def over(panel,im,box):
    im=im.copy();im.thumbnail((box[2],box[3]),Image.Resampling.LANCZOS)
    panel.alpha_composite(im,(box[0]+(box[2]-im.width)//2,box[1]+(box[3]-im.height)//2))
ruby=Image.open(ROOT/'assets/art/mascot/ruby_talk_normal.webp').convert('RGBA')
proofs=[]
for n in range(1,args.chapter*5+1):
    prefix='cs61_b%02d'%n;fall=images[prefix+'_fall'];freed=images[prefix+'_freed'];ch=(n-1)//5+1
    a=viewport(fall);b=viewport(Image.open(ROOT/('assets/art/story/boss45/cs_boss_%02d_memory.webp'%(n-1))).convert('RGBA'));c=viewport(images['cs61_ch%d_onward'%ch])
    # All three shots use the same 360x780 proof viewport; artwork stays separate.
    crown=crowns[prefix+'_fall'];scale=360/1080;ox=0;oy=0
    point=(round(crown[0]*scale-ox),round(crown[1]*scale-oy))
    over(a,extract(images['vfx_cs61_crown_shatter'][3]),(point[0]-55,point[1]-55,110,110))
    over(b,freed,(40,130,280,440));over(b,ruby,(268,530,80,110))
    over(c,extract(images['vfx_cs61_flavor_return'][4]),(155,80,120,540))
    for panel,label in [(a,'FALL'),(b,'FREED'),(c,'ONWARD')]:
        shade=Image.new('RGBA',panel.size);d=ImageDraw.Draw(shade);d.rectangle((8,610,352,765),fill=(26,18,32,175));d.rectangle((0,0,360,24),fill=(26,18,32,220));d.text((9,7),label+' / source-art composite',fill='#fff0cf');panel.alpha_composite(shade)
    # Required single-screen layered proof, plus optional three-shot contact sheet.
    proof=HERE/('b%02d'%n)/'preview_360x780.png';png(b,proof)
    contact=Image.new('RGBA',(1080,780));contact.paste(a,(0,0));contact.paste(b,(360,0));contact.paste(c,(720,0));p=proof.with_name('preview_three_shots.png');png(contact,p)
    proofs.append({'boss':n,'viewport':[360,780],'file':str(proof.relative_to(HERE)).replace('\\','/'),'sha256':sha(proof),'three_shots':str(p.relative_to(HERE)).replace('\\','/'),'crown_viewport':list(point),'memory_background':'assets/art/story/boss45/cs_boss_%02d_memory.webp'%(n-1)})
jsave('MANIFEST.json',{'order':61,'completed_chapters':args.chapter,'assets_delivered':len(records),'total_order_assets':35,'delivery':'source only; not registered or wired','assets':records})
jsave('QA_REPORT.json',{'order':61,'result':'pass','completed_chapters':args.chapter,'asset_count':len(records),'checks':checks,'previews':proofs,'visual_review':['Fall identities compared with original boss sprite first frames; original nonhumanoid forms retained where descriptions differ.','No dead bosses, blood or violent wounds; exhaustion, drooping poses and easing curse light convey defeat.','Ruby remains original round jam-spirit mascot, apron/book/gem intact; no transformation.','Fall/onward bottom quarter kept free of actors; runtime dialogue not baked into art.','Freed forms checked as full cutouts, no background or text; boss05 intentionally remains a small seed, not a person.'],'limitations':['Source-art composites only, not runtime screenshots or timing tests.','Opaque portrait art is 9:16; 360x780 viewport proof preserves full art in top 360x640 with blurred footer extension only in proofs. Actual consumer controls framing.','Dark proof panels and labels exist only in previews, never in final art.'],'scope':'Only incoming/boss_cutscene61 and art-order status. No game.js/runtime/versions changed.'})
print(json.dumps({'chapter':args.chapter,'assets':len(records),'bytes':sum(r['bytes'] for r in records),'boss_previews':len(proofs)}))
