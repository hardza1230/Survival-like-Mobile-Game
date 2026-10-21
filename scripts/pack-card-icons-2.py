"""Pack art order 32 (card icons round 2) into runtime WebP.
256 -> 128 like order 26; runtimeTarget from MANIFEST (card_icons/, build_paths/ p_static+p_footwork, icons/ relics). sha256 checked first; skipped rows ignored."""
import json, hashlib
from PIL import Image
S='assets/incoming/card_icons_2'
n=0
for e in json.load(open(f'{S}/MANIFEST.json')):
    if e.get('skipped'): continue
    src=f'{S}/{e["file"]}'; b=open(src,'rb').read()
    assert hashlib.sha256(b).hexdigest()==e['sha256'] and len(b)==e['bytes'], e['key']
    im=Image.open(src).convert('RGBA'); assert im.size==(256,256), e['key']
    im.resize((128,128),Image.LANCZOS).save(e['runtimeTarget'],'WEBP',quality=90,alpha_quality=92,method=6); n+=1
    print(e['key'],'->',e['runtimeTarget'])
print(n,'packed')
