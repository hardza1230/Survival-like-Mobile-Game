"""Repair source partitions before packing; never paint, mask or remove backgrounds."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib, io, json, os, sys

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/incoming/boss_body818'
OLD = ROOT / 'assets/incoming/boss_body816'
OUT = ROOT / 'assets/art/boss_body818'
ALPHA = 16

def digest(data): return hashlib.sha256(data).hexdigest()
def atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    with temp.open('wb') as f:
        f.write(data); f.flush(); os.fsync(f.fileno())
    temp.replace(path)
    assert path.read_bytes() == data
def write(path, value): atomic(path, (json.dumps(value, indent=2) + '\n').encode('utf8'))
def solid(im): return im.getchannel('A').point(lambda x: 255 if x >= ALPHA else 0)
def count(im): return solid(im).histogram()[255]
def union(boxes):
    return (min(b[0] for b in boxes), min(b[1] for b in boxes),
            max(b[2] for b in boxes), max(b[3] for b in boxes))

def gutter_cuts(im, axis, positions):
    """A cut needs five transparent pixels (two per side), not just a padded result."""
    mask = solid(im)
    limit = im.width if axis == 0 else im.height
    cuts = []
    for nominal in positions:
        lo, hi = max(1, nominal-48), min(limit-1, nominal+48)
        runs, start = [], None
        for p in range(lo, hi+2):
            box = (p,0,p+1,im.height) if axis == 0 else (0,p,im.width,p+1)
            blank = p <= hi and not mask.crop(box).getbbox()
            if blank and start is None: start = p
            if not blank and start is not None:
                if p-start >= 5: runs.append((start, p-1))
                start = None
        assert runs, ('No safe source gutter; repair art instead of cutting it', axis, nominal)
        candidates = [(abs((a+b)//2-nominal), (a+b)//2) for a,b in runs]
        cuts.append(min(candidates)[1])
    return cuts

def partition(im):
    assert im.size == (1536,1024), im.size
    ys = [0, *gutter_cuts(im,1,[256,512,768]), 1024]
    result = []
    for row in range(4):
        band = im.crop((0,ys[row],1536,ys[row+1]))
        xs = [0,*gutter_cuts(band,0,[256,512,768,1024,1280]),1536]
        for col in range(6):
            rect = (xs[col],ys[row],xs[col+1],ys[row+1])
            crop = im.crop(rect)
            a = solid(crop)
            # Source edges must be empty BEFORE any resize or output padding.
            borders = [(0,0,crop.width,2),(0,crop.height-2,crop.width,crop.height),
                       (0,0,2,crop.height),(crop.width-2,0,crop.width,crop.height)]
            assert not any(a.crop(b).getbbox() for b in borders), ('Source touches cut',row,col,rect)
            nominal = (col*256,row*256,(col+1)*256,(row+1)*256)
            intersection = (max(rect[0],nominal[0]),max(rect[1],nominal[1]),
                            min(rect[2],nominal[2]),min(rect[3],nominal[3]))
            overlap = count(im.crop(intersection))
            canvas = Image.new('RGBA',(384,384))
            canvas.alpha_composite(crop,(64+rect[0]-nominal[0],64+rect[1]-nominal[1]))
            result.append({'image':canvas,'row':row,'col':col,'rect':rect,
                           'sourcePixels':count(crop),'recoveredPixels':count(crop)-overlap,
                           'excludedNeighborPixels':count(im.crop(nominal))-overlap})
    assert sum(c['sourcePixels'] for c in result) == count(im), 'Source content omitted or duplicated'
    return result

def main():
    legacy = json.loads((SRC/'LEGACY.json').read_text(encoding='utf8'))
    pairs = json.loads((SRC/'PAIRS.json').read_text(encoding='utf8'))
    sources, assets, qa, sourceqa, thumbs = [], [], [], [], {}
    for gi, keys in enumerate(pairs):
        group = f'pair{gi+1:02}'
        path = (OLD if gi < 11 else SRC)/(group+'_source.png')
        if '--audit-existing' in sys.argv and gi >= 11: continue
        raw = path.read_bytes(); im = Image.open(io.BytesIO(raw)).convert('RGBA')
        assert im.getchannel('A').getextrema()[0] == 0, group
        cells = partition(im)
        sourceqa.append({'group':group,'path':path.relative_to(ROOT).as_posix(),
                         'cells':[{k:v for k,v in c.items() if k!='image'} for c in cells]})
        sources.append({'group':group,'path':path.relative_to(ROOT).as_posix(),
                        'bytes':len(raw),'sha256':digest(raw),'size':im.size})
        for half, base in enumerate(keys[:1] if gi == 10 else keys):
            # Existing Root Knight already has sixteen complete walk/attack frames.
            # Keep that production sheet and its five dedicated animations intact.
            if base == 'mb10_ancient_root_knight': continue
            spec = legacy[base]; fw = spec['frame']; old = Image.open(ROOT/spec['url']).convert('RGBA')
            cols = old.width//fw
            oldboxes = [solid(old.crop((f%cols*fw,f//cols*fw,(f%cols+1)*fw,(f//cols+1)*fw))).getbbox()
                        for f in range(cols*(old.height//fw))]
            oldb = union([b for b in oldboxes if b]); ratio = 256/fw
            target = (max(4,oldb[0]*ratio),max(4,oldb[1]*ratio),min(252,oldb[2]*ratio),min(252,oldb[3]*ratio))
            rows = list(range(4)) if gi == 10 else [half*2,half*2+1]
            selected = [c for c in cells if c['row'] in rows]
            common = union([solid(c['image']).getbbox() for c in selected])
            scale = min((target[2]-target[0])/(common[2]-common[0]),(target[3]-target[1])/(common[3]-common[1]))
            size = (round((common[2]-common[0])*scale),round((common[3]-common[1])*scale))
            pos = (round((target[0]+target[2]-size[0])/2),round(target[3]-size[1]))
            frames, hashes = [], []
            sheet = Image.new('RGBA',(1536,len(rows)*256))
            for f,c in enumerate(selected):
                tile = c['image'].crop(common).resize(size,Image.Resampling.LANCZOS)
                frame = Image.new('RGBA',(256,256)); frame.alpha_composite(tile,pos)
                a = frame.getchannel('A')
                assert not any(a.crop(b).getbbox() for b in [(0,0,256,2),(0,254,256,256),(0,0,2,256),(254,0,256,256)]),base
                hh = digest(frame.tobytes()); hashes.append(hh); frames.append(frame)
                sheet.alpha_composite(frame,(f%6*256,f//6*256))
                qa.append({'key':'boss_ink816_'+base,'frame':f,'sha256':hh,'clearBorder':True,
                           'alphaBox':a.getbbox(),'sourceRect':c['rect'],'recoveredPixels':c['recoveredPixels'],
                           'excludedNeighborPixels':c['excludedNeighborPixels']})
            assert len(set(hashes)) == len(frames), base
            dest = OUT/('boss_ink816_'+base+'.webp')
            stream = io.BytesIO(); sheet.save(stream,'WEBP',lossless=True,method=6); data = stream.getvalue()
            if '--audit-existing' not in sys.argv: atomic(dest,data)
            stage = spec.get('stage',14 if base=='boss_pinnacle' else 10+int(base[-1])-1 if base.startswith('c3_') else list(legacy).index(base))
            assets.append({'base':base,'key':'boss_ink816_'+base,'stage':stage,'path':dest.relative_to(ROOT).as_posix(),
                           'source':group,'sourceRows':rows,'frame':256,'frames':len(frames),'cols':6,'rows':len(rows),
                           'oldFrame':fw,'frameRatio':ratio,'originalBounds':oldb,'packedBounds':target,
                           'bytes':len(data),'sha256':digest(data),'decodedBytes':sheet.width*sheet.height*4})
            thumbs[base] = frames
    if '--audit-existing' in sys.argv:
        write(ROOT/'.git/source-gutters818.json',sourceqa)
        print(json.dumps({'sourceSheets':len(sourceqa),'actors':len(assets),'recoveredPixels':sum(f['recoveredPixels'] for f in qa),
                          'excludedNeighborPixels':sum(f['excludedNeighborPixels'] for f in qa)})); return
    assert len(assets)==30 and len(qa)==372
    keys = list(thumbs); poster = Image.new('RGBA',(1000,len(keys)*164),'#261e30'); draw=ImageDraw.Draw(poster)
    for row,key in enumerate(keys):
        draw.text((4,row*164+1),key,fill='#fff0cd')
        for col,frame in enumerate(thumbs[key][6:12]):
            poster.alpha_composite(frame.resize((152,152),Image.Resampling.LANCZOS),(col*166,row*164+12))
    stream=io.BytesIO(); poster.convert('RGB').save(stream,'PNG'); atomic(SRC/'all_attack_frames.png',stream.getvalue())
    seq=[]; height=((len(keys)+4)//5)*150
    for f in range(12):
        out=Image.new('RGBA',(750,height),'#261e30'); d=ImageDraw.Draw(out)
        for i,key in enumerate(keys):
            x=i%5*150;y=i//5*150;out.alpha_composite(thumbs[key][f].resize((136,136),Image.Resampling.LANCZOS),(x+7,y+14));d.text((x+2,y+2),key,fill='#fff0cd')
        seq.append(out.convert('RGB'))
    stream=io.BytesIO(); seq[0].save(stream,'GIF',save_all=True,append_images=seq[1:],duration=130,loop=0,disposal=2);atomic(SRC/'preview.gif',stream.getvalue())
    stream=io.BytesIO();seq[9].save(stream,'PNG');atomic(SRC/'preview.png',stream.getvalue())
    write(SRC/'MANIFEST.json',{'sources':sources,'assets':assets});write(OUT/'MANIFEST.json',{'assets':assets})
    write(SRC/'QA_REPORT.json',{'characters':30,'forms':31,'authoredFrames':372,'alphaPreserved':True,'clearBorders':True,
          'sourceCutBordersClear':True,'sourcePartitions':sourceqa,'frames':qa,'method':'original alpha preserved; partition at transparent source gutters BEFORE common uniform packing; never paint/mask backgrounds',
          'recoveredPixels':sum(f['recoveredPixels'] for f in qa),'excludedNeighborPixels':sum(f['excludedNeighborPixels'] for f in qa),
          'runtimeBytes':sum(a['bytes'] for a in assets),'decodedBytes':sum(a['decodedBytes'] for a in assets)})
    print(json.dumps({'characters':len(assets),'frames':len(qa),'bytes':sum(a['bytes'] for a in assets),
                      'recoveredPixels':sum(f['recoveredPixels'] for f in qa),'excludedNeighborPixels':sum(f['excludedNeighborPixels'] for f in qa)}))

if __name__=='__main__': main()
