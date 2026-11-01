"""Source-only order59 packing/QA; no runtime outputs or registrations."""
import hashlib,io,json,os
from pathlib import Path
from PIL import Image
import numpy as np

HERE=Path(__file__).resolve().parent
YS=[0,310,544,774,1024]
XS=[[0,278,523,780,1020,1276,1536],[0,270,503,780,1038,1274,1536],
    [0,280,523,776,1033,1270,1536],[0,270,540,768,1034,1280,1536]]
CELL=384;EXTENT=307

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def save(im,path):
    stream=io.BytesIO();im.save(stream,'PNG');b=stream.getvalue();tmp=path.with_suffix('.png.tmp')
    with open(tmp,'wb') as f:f.write(b);f.flush();os.fsync(f.fileno())
    os.replace(tmp,path)
    with Image.open(path) as check:check.load();assert check.mode==im.mode and check.size==im.size
    assert path.stat().st_size==len(b)

def main():
    source=HERE/'sources/menu59_generated.png';donor=Image.open(source).convert('RGBA')
    assert donor.size==(1536,1024)
    spec=json.loads((HERE/'PROMPTS.json').read_text(encoding='utf-8-sig'))
    atlas=Image.new('RGBA',(2304,1536));records=[];qa=[]
    for icon in spec['icons']:
        i=icon['index'];row,col=divmod(i,6);xs=XS[row]
        box=(xs[col],YS[row],xs[col+1],YS[row+1]);cut=donor.crop(box);origin=source
        # Only a measured transparent crop and uniform resampling; preserve the model's painted pixels/alpha.
        bounds=cut.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox();assert bounds
        cut=cut.crop(bounds);scale=EXTENT/max(cut.size)
        size=(round(cut.width*scale),round(cut.height*scale));cut=cut.resize(size,Image.Resampling.LANCZOS)
        tile=Image.new('RGBA',(CELL,CELL));xy=((CELL-cut.width)//2,(CELL-cut.height)//2);tile.alpha_composite(cut,xy)
        atlas.alpha_composite(tile,(col*CELL,row*CELL))
        a=np.array(tile.getchannel('A'));ys,xs2=np.where(a>0);b=(int(xs2.min()),int(ys.min()),int(xs2.max())+1,int(ys.max())+1)
        margins=[b[0],b[1],CELL-b[2],CELL-b[3]]
        assert min(margins)>=38,(i,margins)
        edges=np.concatenate([a[0],a[-1],a[:,0],a[:,-1]])
        assert not edges.any() and a.max()>200
        records.append({**icon,'row':row,'column':col,'rect':[col*CELL,row*CELL,CELL,CELL],
            'source':origin.relative_to(HERE).as_posix(),'source_sha256':sha(origin),'source_rect':box,
            'source_alpha_crop':bounds,'scale':scale,'paste':xy,'alpha_bounds':b})
        qa.append({'index':i,'key':icon['key'],'alpha_min':int(a.min()),'alpha_max':int(a.max()),
            'content_bounds':b,'margins_px':margins,'max_extent_px':max(b[2]-b[0],b[3]-b[1]),
            'max_extent_fraction':max(b[2]-b[0],b[3]-b[1])/CELL,'cell_edge_clear':True,'overflow':False})
    path=HERE/'menu59_icons.png';save(atlas,path)
    previews=[]
    for size in [28,40,96]:
        stride=size+16;preview=Image.new('RGBA',(6*stride+16,4*stride+16),'#261e30')
        for i in range(24):
            row,col=divmod(i,6);tile=atlas.crop((col*CELL,row*CELL,(col+1)*CELL,(row+1)*CELL))
            tile=tile.resize((size,size),Image.Resampling.LANCZOS);preview.alpha_composite(tile,(16+col*stride,16+row*stride))
        pp=HERE/f'preview_{size}px.png';save(preview.convert('RGB'),pp)
        previews.append({'file':pp.name,'bytes':pp.stat().st_size,'sha256':sha(pp),'cell_display_px':size,'background':'#261e30'})
    manifest={'key':'menu59_icons','file':path.name,'bytes':path.stat().st_size,'sha256':sha(path),
        'width':2304,'height':1536,'cell':384,'cols':6,'rows':4,'format':'PNG32 RGBA','icons':records,'previews':previews}
    (HERE/'MANIFEST.json').write_bytes((json.dumps(manifest,indent=2)+'\n').encode('utf8'))
    report={'order':59,'status':'source art complete; awaiting code integration','generator':'built-in image_gen',
        'atlas':{'file':path.name,'dimensions':[2304,1536],'mode':'RGBA','cell':[384,384],'cols':6,'rows':4,'icons':24,'actual_alpha':[int(np.array(atlas.getchannel('A')).min()),int(np.array(atlas.getchannel('A')).max())],
                 'sha256':sha(path),'bytes':path.stat().st_size,'transparent_background':True},
        'cells':qa,'previews':previews,'source_dimensions':[1536,1024],
        'processing':['Measured donor gutters cropped without repainting','Uniform fit307px maximum extent (79.95%) in384px cells; original generated alpha preserved','PNG32 exact2304x1536; no runtime image/registration/code output'],
        'visual_review':{'pending':True,'checks':['24row-major subjects','Power56/57 painterly family/style','28px legibility','40px legibility','96px details','No baked letters/numbers/frames','No neighbor fragments/overflow/opaque matte']},
        'runtime_changes':False}
    (HERE/'QA_REPORT.json').write_bytes((json.dumps(report,indent=2)+'\n').encode('utf8'))
    print(json.dumps({'icons':24,'size':atlas.size,'bytes':path.stat().st_size,'alpha':report['atlas']['actual_alpha']}))

if __name__=='__main__':main()
