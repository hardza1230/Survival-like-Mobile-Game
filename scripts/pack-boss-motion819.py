"""Interleave authored in-betweens with exact existing boss endpoint pixels."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,io,hashlib,importlib.util

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/boss_motion819';OUT=ROOT/'assets/art/boss_motion819'
spec=importlib.util.spec_from_file_location('source_pack',ROOT/'scripts/pack-boss-body818.py')
P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)

def main():
    base=json.loads((SRC/'BASELINE.json').read_text());sources=[];assets=[];frames=[];partitions=[];thumbs={}
    for gi in range(4):
        group=f'group{gi+1}';path=SRC/(group+'_source.png');raw=path.read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA')
        assert im.getchannel('A').getextrema()[0]==0,group
        cells=P.partition(im)
        partitions.append({'group':group,'path':path.relative_to(ROOT).as_posix(),'cells':[{k:v for k,v in c.items()if k!='image'}for c in cells]})
        sources.append({'group':group,'path':path.relative_to(ROOT).as_posix(),'bytes':len(raw),'sha256':P.digest(raw),'size':im.size})
        for row in range(4):
            a=base[gi*4+row];oldraw=(ROOT/a['path']).read_bytes();assert P.digest(oldraw)==a['sha256'],a['base']
            old=Image.open(io.BytesIO(oldraw)).convert('RGBA');oldframes=[old.crop((f%6*256,f//6*256,(f%6+1)*256,(f//6+1)*256))for f in range(12)]
            target=P.union([P.solid(f).getbbox()for f in oldframes[6:]])
            selected=cells[row*6:row*6+6];common=P.union([P.solid(c['image']).getbbox()for c in selected])
            scale=min((target[2]-target[0])/(common[2]-common[0]),(target[3]-target[1])/(common[3]-common[1]))
            size=(round((common[2]-common[0])*scale),round((common[3]-common[1])*scale));pos=(round((target[0]+target[2]-size[0])/2),round(target[3]-size[1]))
            mids=[]
            for c in selected:
                tile=c['image'].crop(common).resize(size,Image.Resampling.LANCZOS);f=Image.new('RGBA',(256,256));f.alpha_composite(tile,pos);mids.append(f)
            packed=oldframes[:6];order=[{'endpoint':f}for f in range(6)]
            for n in range(6):packed.extend([oldframes[6+n],mids[n]]);order.extend([{'endpoint':6+n},{'middle':n,'from':6+n,'to':7+n if n<5 else 0}])
            assert len(packed)==18
            hashes=[];sheet=Image.new('RGBA',(1536,768))
            for n,f in enumerate(packed):
                alpha=f.getchannel('A');assert not any(alpha.crop(b).getbbox()for b in[(0,0,256,2),(0,254,256,256),(0,0,2,256),(254,0,256,256)]),(a['base'],n)
                hh=P.digest(f.tobytes());hashes.append(hh);sheet.paste(f,(n%6*256,n//6*256))
                frames.append({'key':a['key'],'frame':n,'sha256':hh,'alphaBox':alpha.getbbox(),'clearBorder':True,**order[n]})
            assert len(set(hashes))==18,a['base']
            stream=io.BytesIO();sheet.save(stream,'WEBP',lossless=True,exact=True,method=6);data=stream.getvalue();dest=OUT/(a['key']+'.webp');P.atomic(dest,data)
            with Image.open(dest)as check:
                check.load();assert check.size==(1536,768);assert check.convert('RGBA').tobytes()==sheet.tobytes()
            assets.append({**a,'path':dest.relative_to(ROOT).as_posix(),'frames':18,'rows':3,'source':group,'sourceRow':row,'bytes':len(data),'sha256':P.digest(data),'decodedBytes':1536*768*4,'endpointPath':a['path'],'endpointSha256':a['sha256'],'frameOrder':order})
            thumbs[a['base']]=packed
    oldmanifest=json.loads((ROOT/'assets/incoming/boss_body818/MANIFEST.json').read_text());replaced={a['base']:a for a in assets}
    active=[replaced.get(a['base'],a)for a in oldmanifest['assets']]
    assert len(active)==30 and sum(a['frames']for a in active)==468
    P.write(SRC/'MANIFEST.json',{'sources':sources,'assets':assets,'activeAssets':active,'baselineManifest':'assets/incoming/boss_body818/MANIFEST.json'})
    P.write(OUT/'MANIFEST.json',{'assets':assets,'activeAssets':active})
    P.write(SRC/'QA_REPORT.json',{'authoredInbetweens':96,'replacedActors':16,'packedFrames':288,'activeFrames':468,'sourceCutAlphaThreshold':16,'sourcePartitions':partitions,'frames':frames,'endpointPixelsPreserved':True,'alphaPreserved':True,'method':'original endpoint pixels copied exactly; six genuinely authored inbetweens per main boss, shared uniform transform per actor; no masks/repaint/crossfade','runtimeBytes':sum(a['bytes']for a in assets),'decodedBytes':sum(a['decodedBytes']for a in assets)})
    keys=list(thumbs);seq=[]
    for n in range(18):
        out=Image.new('RGBA',(640,704),'#261e30');d=ImageDraw.Draw(out)
        for i,k in enumerate(keys):
            x=i%4*160;y=i//4*176;out.alpha_composite(thumbs[k][n].resize((156,156),Image.Resampling.LANCZOS),(x+2,y+18));d.text((x+2,y+2),k,fill='#fff0cd')
        seq.append(out.convert('RGB'))
    stream=io.BytesIO();seq[0].save(stream,'GIF',save_all=True,append_images=seq[1:],duration=85,loop=0,disposal=2);P.atomic(SRC/'preview.gif',stream.getvalue())
    stream=io.BytesIO();seq[12].save(stream,'PNG');P.atomic(SRC/'preview.png',stream.getvalue())
    print(json.dumps({'actors':16,'newDrawings':96,'packedFrames':288,'activeFrames':468,'bytes':sum(a['bytes']for a in assets)}))

if __name__=='__main__':main()
