"""Resize/encode original ImageGen paintings, preserving complete composition."""
from pathlib import Path
import hashlib,json,io
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/ruby_storybook';OUT=ROOT/'assets/art/ruby_storybook'
assets=[]
for source in sorted((SRC/'raw').glob('*.png')):
    with Image.open(source) as image:
        image.load();image=image.convert('RGB');size=(512,768) if source.stem.endswith('paper') else (768,512)
        assert image.width*size[1]==image.height*size[0],source.name
        image=image.resize(size,Image.Resampling.LANCZOS);buf=io.BytesIO();image.save(buf,'WEBP',quality=87,method=6)
        dest=OUT/(source.stem+'.webp');tmp=dest.with_suffix('.tmp');tmp.write_bytes(buf.getvalue());tmp.replace(dest)
        with Image.open(dest) as check:check.load();assert check.size==size
        assets.append(dict(key=source.stem,source='raw/'+source.name,source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),runtime=dest.relative_to(ROOT).as_posix(),width=size[0],height=size[1],bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
assert len(assets)==5
(SRC/'MANIFEST.json').write_text(json.dumps(dict(tool='built-in ImageGen',assets=assets),indent=2)+'\n',encoding='utf8')
print(json.dumps(dict(assets=len(assets),bytes=sum(a['bytes'] for a in assets),decoded_rgba=sum(a['width']*a['height']*4 for a in assets))))
