"""Art order 40: chest shop. sha/bytes vs MANIFEST, 50% per cell, WebP q86 -> assets/art/chest/ (lazy with the Bazaar).
ic_thread stays full 256 -> 128 (boot, replaces old assets/ic_thread.png). vfx_chest_rays stays black (ADD blend in game.js)."""
import json, hashlib, os
from PIL import Image
S='assets/incoming/chest_shop'; D='assets/art/chest'
for e in json.load(open(f'{S}/MANIFEST.json')):
    p=f"{S}/{e['file']}"; b=open(p,'rb').read()
    assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256'], e['key']
    im=Image.open(p).convert('RGBA'); im=im.resize((im.width//2,im.height//2),Image.LANCZOS)
    out=f"{D}/{e['key']}.webp"; im.save(out,'WEBP',quality=86,method=6)
    print(e['key'],im.size,os.path.getsize(out)//1024,'KB')
