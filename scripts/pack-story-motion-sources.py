"""Mechanical extraction/packing only. Art is from retained built-in ImageGen donors."""
from pathlib import Path
from PIL import Image
import json, hashlib, io, os

ROOT=Path('assets/incoming/story_motion')
def save_png(im,path):
    path.parent.mkdir(parents=True,exist_ok=True)
    buf=io.BytesIO();im.save(buf,format='PNG');data=buf.getvalue()
    tmp=path.with_suffix('.tmp');tmp.write_bytes(data);os.replace(tmp,path)
    with Image.open(path) as check:check.verify()
    return hashlib.sha256(data).hexdigest()

def pack():
    config=json.loads((ROOT/'_sources/CONFIG.json').read_text())
    groups={};issues=[]
    for job in config['jobs']:
        source=ROOT/'_sources'/job['source'];im=Image.open(source).convert('RGBA')
        for i,item in enumerate(job['items']):
            key=item['key'];folder=item.get('folder',job.get('folder','shared'))
            box=item.get('box')
            if box is None:
                cols=job.get('cols',len(job['items']));rows=job.get('rows',1)
                col=i%cols;row=i//cols
                box=[round(col*im.width/cols),round(row*im.height/rows),round((col+1)*im.width/cols),round((row+1)*im.height/rows)]
            cell=im.crop(box);a=cell.getchannel('A')
            # Ignore almost invisible alpha noise when locating the donor's actual subject.
            strong=a.point(lambda v:255 if v>=32 else 0).getbbox()
            if not strong:raise ValueError('Empty source '+key)
            if not item.get('background') and not item.get('layer') and (strong[0]==0 or strong[1]==0 or strong[2]==cell.width or strong[3]==cell.height):issues.append(key+': inspect donor edge')
            if item.get('background'):
                from PIL import ImageOps
                out=ImageOps.fit(cell,(1242,item.get('height',1920)),method=Image.Resampling.LANCZOS)
                out.putalpha(255)
                pivot=[.5,.5]
            elif item.get('layer'):
                from PIL import ImageOps
                part=cell.crop(strong);out=Image.new('RGBA',(1242,1920))
                for place in item['placements']:
                    piece=ImageOps.mirror(part) if place.get('flip') else part
                    w=place['width'];h=round(piece.height*w/piece.width)
                    piece=piece.resize((w,h),Image.Resampling.LANCZOS)
                    out.alpha_composite(piece,(place['x'],place['y']))
                # Reserve the explicit dialogue safe area for every overlay.
                out.paste((0,0,0,0),(0,1382,1242,1920))
                pivot=[.5,.5]
            else:
                part=cell.crop(strong);out=Image.new('RGBA',(part.width+48,part.height+48));out.alpha_composite(part,(24,24))
                pivot=[.5,.5] if item.get('floating') else [.5,(out.height-24)/out.height]
            path=ROOT/folder/(key+'.png');sha=save_png(out,path)
            groups.setdefault(folder,[]).append(dict(key=key,file=path.name,width=out.width,height=out.height,pivot=pivot,padding=0 if item.get('background') or item.get('layer') else 24,blend='NORMAL',source='../_sources/'+job['source'],source_box=box,source_subject=list(strong),sha256=sha,bytes=path.stat().st_size))
    for folder,assets in groups.items():
        (ROOT/folder/'MANIFEST.json').write_bytes((json.dumps(dict(canvas=[1080,1920],background_overscan_width=1242,assets=assets),indent=2)+'\n').encode())
    (ROOT/'PACK_QA.json').write_bytes((json.dumps(dict(files=sum(map(len,groups.values())),source_edge_review=issues,method='Retained source-pixel crop;24px transparent padding;opaque backgrounds fit preserving aspect'),indent=2)+'\n').encode())
    print(json.dumps(dict(files=sum(map(len,groups.values())),edge_review=issues)))
if __name__=='__main__':pack()
