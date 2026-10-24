"""Art order 46: two redone story shots + root-burst FX. sha/bytes vs MANIFEST, 50% WebP -> assets/art/story/ (same as order 45, menu-lazy)."""
import json, hashlib, os
from PIL import Image
S='assets/incoming/story_shot_redo'; D='assets/art/story'
for e in json.load(open(f'{S}/MANIFEST.json'))['assets']:
    p=f"{S}/{e['file']}"; b=open(p,'rb').read()
    assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256'], e['key']
    im=Image.open(p); im=im.convert('RGBA' if e['frames']>1 else 'RGB'); w,h=im.width//2,im.height//2
    im.resize((w,h),Image.LANCZOS).save(f"{D}/{e['key']}.webp",'WEBP',quality=84,method=6)
    print(e['key'],(w,h),os.path.getsize(f"{D}/{e['key']}.webp")//1024,'KB')
