"""Extract the three painted shots from each ImageGen donor; preserve composition/aspect."""
from pathlib import Path
from PIL import Image
import io,json,hashlib
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/ruby_comic';OUT=ROOT/'assets/art/ruby_comic'
# Actual painted row boundaries vary slightly. Omit only boundary antialias pixels.
ROWS={1:[(0,559),(562,1028),(1031,1536)],2:[(0,510),(512,979),(981,1536)],3:[(0,511),(513,1022),(1025,1536)],4:[(0,552),(555,1018),(1021,1536)],5:[(0,508),(511,1025),(1028,1536)]}
assets=[];sources=[]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for stage,rows in ROWS.items():
    source=SRC/'raw'/f'story_{stage}.png'
    with Image.open(source) as im:
        im.load();assert im.size==(1024,1536);im=im.convert('RGB')
        sources.append(dict(file='raw/'+source.name,sha256=sha(source),width=im.width,height=im.height))
        for panel,(top,bottom) in enumerate(rows,1):
            key=f'ruby_comic_s{stage}_{panel}';crop=im.crop((0,top,1024,bottom));crop=crop.resize((768,round(crop.height*.75)),Image.Resampling.LANCZOS)
            dest=OUT/(key+'.webp');buf=io.BytesIO();crop.save(buf,'WEBP',quality=87,method=6);tmp=dest.with_suffix('.tmp');tmp.write_bytes(buf.getvalue());tmp.replace(dest)
            with Image.open(dest) as check:check.load();assert check.size==crop.size
            assets.append(dict(key=key,source='raw/'+source.name,crop=[0,top,1024,bottom],runtime=dest.relative_to(ROOT).as_posix(),width=crop.width,height=crop.height,bytes=dest.stat().st_size,sha256=sha(dest)))
(SRC/'MANIFEST.json').write_text(json.dumps(dict(tool='built-in ImageGen',sources=sources,assets=assets),indent=2)+'\n',encoding='utf8')
print(json.dumps(dict(sources=len(sources),panels=len(assets),bytes=sum(a['bytes'] for a in assets),decoded_rgba=sum(a['width']*a['height']*4 for a in assets))))
