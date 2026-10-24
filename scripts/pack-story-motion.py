"""Art order 45: story motion comic. sha/bytes vs each folder MANIFEST, 50% WebP -> assets/art/story/ (lazy, one scene at a time).
ADD FX keep their solid black (ADD blend in game.js); NORMAL keeps true alpha. FX frame grids halve exactly (frame_width/2).
Prints the ASSET_IMAGES / ASSET_FX lines for game.js."""
import json, hashlib, os
from PIL import Image
S='assets/incoming/story_motion'; D='assets/art/story'
os.makedirs(D, exist_ok=True)
idx=json.load(open(f'{S}/ASSET_INDEX.json')); imgs=[]; fx=[]; total=0; dec=0
for f in idx['folders']:
    for e in json.load(open(f"{S}/{f['manifest']}"))['assets']:
        p=f"{S}/{f['folder']}/{e['file']}"; b=open(p,'rb').read()
        assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256'], e['key']
        im=Image.open(p).convert('RGBA'); w,h=im.width//2,im.height//2
        im=im.resize((w,h),Image.LANCZOS)
        if e.get('blend')=='ADD': im=im.convert('RGB')
        out=f"{D}/{e['key']}.webp"; im.save(out,'WEBP',quality=84,method=6)
        total+=os.path.getsize(out); dec+=w*h*4
        url=f"assets/art/story/{e['key']}.webp"
        if e.get('frames',1)>1: fx.append(f"  {e['key']}:{{url:'{url}',fw:{e['frame_width']//2},fh:{e['frame_height']//2},frames:{e['frames']},rate:12,anchor:'center'{',add:true' if e.get('blend')=='ADD' else ''}}},")
        else: imgs.append(f"  {e['key']}:'{url}',")
        print(e['key'],(w,h),os.path.getsize(out)//1024,'KB')
print('total',round(total/1048576,2),'MB · decoded all',round(dec/1048576,1),'MiB')
open('/tmp/story_keys.txt','w').write('IMAGES\n'+'\n'.join(imgs)+'\nFX\n'+'\n'.join(fx)+'\n')
