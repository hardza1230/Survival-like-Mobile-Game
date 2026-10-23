"""Crop, resize and encode original ImageGen pixels; no generated artwork is redrawn."""
from pathlib import Path
import json,hashlib,io
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/lobby_polish';OUT=ROOT/'assets/art/lobby'
assets=[]
for key,size in [('ic_lb_settings',(128,128)),('lb_currency_plain',(192,40))]:
    source=SRC/'raw'/(key+'.png')
    with Image.open(source) as im:
        im.load();assert im.mode=='RGBA';alpha=im.getchannel('A');assert alpha.getextrema()==(0,255)
        box=alpha.point(lambda a:255 if a>16 else 0).getbbox();im=im.crop(box)
        if key.startswith('ic_'):
            im.thumbnail((116,116),Image.Resampling.LANCZOS);cell=Image.new('RGBA',size);cell.alpha_composite(im,((128-im.width)//2,(128-im.height)//2));im=cell
        else:im=im.resize(size,Image.Resampling.LANCZOS)
        dest=OUT/(key+'.webp');buf=io.BytesIO();im.save(buf,'WEBP',quality=92,method=6);tmp=dest.with_suffix('.tmp');tmp.write_bytes(buf.getvalue());tmp.replace(dest)
        with Image.open(dest) as check:check.load();assert check.size==size
        assets.append(dict(key=key,source='raw/'+source.name,source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),crop=box,runtime=dest.relative_to(ROOT).as_posix(),width=size[0],height=size[1],bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
(SRC/'MANIFEST.json').write_text(json.dumps(dict(tool='built-in ImageGen',assets=assets),indent=2)+'\n')
print(json.dumps(assets,indent=2))
