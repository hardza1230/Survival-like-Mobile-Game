from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1];source=root/'assets/incoming/mint_needle821/source.png';dest=root/'assets/art/mint_needle821/bpx_mint_needle821.webp'
im=Image.open(source).convert('RGBA');assert im.size==(2172,724);out=Image.new('RGBA',(1536,256));hashes=[]
for i in range(6):
 frame=im.crop((i*362,181,(i+1)*362,543)).resize((256,256),Image.Resampling.LANCZOS)
 alpha=frame.getchannel('A').point(lambda x:255 if x>=16 else 0);assert alpha.getbbox()
 assert not any(alpha.crop(b).getbbox() for b in [(0,0,256,2),(0,254,256,256),(0,0,2,256),(254,0,256,256)])
 hashes.append(hashlib.sha256(frame.tobytes()).hexdigest())
 out.paste(frame,(i*256,0))
assert len(set(hashes))==6
dest.parent.mkdir(parents=True,exist_ok=True);out.save(dest,'WEBP',lossless=True,exact=True)
with Image.open(dest) as decoded:assert decoded.convert('RGBA').tobytes()==out.tobytes()
digest=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
manifest={'source':{'path':source.relative_to(root).as_posix(),'bytes':source.stat().st_size,'sha256':digest(source)},'runtime':{'path':dest.relative_to(root).as_posix(),'bytes':dest.stat().st_size,'sha256':digest(dest),'frames':6,'frameWidth':256,'frameHeight':256}}
(source.parent/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
