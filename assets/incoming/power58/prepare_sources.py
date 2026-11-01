"""Source-only order58 exact-size placement/alpha QA. No runtime outputs."""
import hashlib,io,json,os,subprocess
from pathlib import Path
from PIL import Image
import numpy as np

HERE=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(im,path):
    data=io.BytesIO();im.save(data,'PNG');b=data.getvalue();tmp=path.with_suffix('.png.tmp')
    with open(tmp,'wb') as f:f.write(b);f.flush();os.fsync(f.fileno())
    os.replace(tmp,path)
    with Image.open(path) as check:check.load();assert check.size==im.size and check.mode==im.mode
    assert path.stat().st_size==len(b)

def main():
    spec=json.loads((HERE/'PROMPTS.json').read_text(encoding='utf-8-sig'));rows=[];qa=[];pictures={}
    for item in spec['items']:
        key=item['key'];size=tuple(item['size']);hero=key.startswith('pw_hero_')
        source=HERE/'sources'/(key+'_source.png');original=Image.open(source).convert('RGBA')
        bounds=original.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox();assert bounds
        subject=original.crop(bounds);scale=min(340/subject.width,328/subject.height) if hero else 307/max(subject.size)
        dimensions=(round(subject.width*scale),round(subject.height*scale));subject=subject.resize(dimensions,Image.Resampling.LANCZOS)
        xy=(384+(384-subject.width)//2,(384-subject.height)//2) if hero else ((384-subject.width)//2,(384-subject.height)//2)
        output=Image.new('RGBA',size);output.alpha_composite(subject,xy);path=HERE/(key+'.png');save(output,path);pictures[key]=output
        a=np.array(output.getchannel('A'));y,x=np.where(a>0);b=[int(x.min()),int(y.min()),int(x.max())+1,int(y.max())+1]
        margins=[b[0],b[1],size[0]-b[2],size[1]-b[3]]
        assert min(margins)>=20,(key,margins)
        assert not a[0].any() and not a[-1].any() and not a[:,0].any() and not a[:,-1].any()
        if hero:assert not a[:,:384].any(),key+' left half must stay fully transparent'
        rows.append({'key':key,'file':path.name,'bytes':path.stat().st_size,'sha256':sha(path),'size':list(size),'width':size[0],'height':size[1],'format':'PNG32 RGBA','source':source.relative_to(HERE).as_posix(),'source_sha256':sha(source),'source_size':list(original.size),'source_alpha_crop':bounds,'scale':scale,'paste':list(xy)})
        qa.append({'key':key,'size':list(size),'mode':'RGBA','alpha_range':[int(a.min()),int(a.max())],'content_bounds':b,'margins_px':margins,'all_edges_clear':True,'overflow':False,'left_half_fully_transparent':bool(not a[:,:384].any()) if hero else None})
    # A contact sheet and a compact usage-size proof; these are art previews, never game screenshots.
    preview=Image.new('RGBA',(800,696),'#261e30');usage=Image.new('RGBA',(800,244),'#261e30')
    for i,item in enumerate(spec['items']):
        key=item['key'];im=pictures[key]
        if i<4:
            preview.alpha_composite(im.resize((384,192),Image.Resampling.LANCZOS),(8+(i%2)*400,8+(i//2)*208))
            small=im.resize((180,90),Image.Resampling.LANCZOS);small.putalpha(small.getchannel('A').point(lambda v:round(v*.55)))
            usage.alpha_composite(small,(8+i*198,8))
        else:
            preview.alpha_composite(im.resize((256,256),Image.Resampling.LANCZOS),(8+(i-4)*264,432))
            usage.alpha_composite(im.resize((96,96),Image.Resampling.LANCZOS),(136+(i-4)*264,128))
    previews=[]
    for filename,im in [('preview.png',preview),('preview_usage.png',usage)]:
        path=HERE/filename;save(im.convert('RGB'),path);previews.append({'file':filename,'size':list(im.size),'background':'#261e30','bytes':path.stat().st_size,'sha256':sha(path)})
    (HERE/'MANIFEST.json').write_bytes((json.dumps(rows,indent=2)+'\n').encode('utf8'))
    report={'order':58,'status':'all7source illustrations complete; awaiting code integration','generator':'built-in image_gen','files':qa,'previews':previews,'processing':['Unmodified original generated PNGs retained in sources/','Measured alpha crop and uniform resampling only; no redrawing or synthetic art','Four768x384headers place the complete group wholly in the right half; left384px completely transparent','Three384x384empty states centered with transparent margins','Generated alpha retained within the measured crop','Usage proof: headers90px high atalpha.55; empty motifs96px; background#261e30'],'visual_review':{'pending':True},'runtime_changes':False}
    (HERE/'QA_REPORT.json').write_bytes((json.dumps(report,indent=2)+'\n').encode('utf8'))
    print(json.dumps({'files':len(rows),'bytes':sum(r['bytes'] for r in rows),'headers_left_half_clear':True,'previews':len(previews)}))

if __name__=='__main__':main()
