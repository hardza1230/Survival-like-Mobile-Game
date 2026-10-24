"""Art order 47: battle HUD top. sha/bytes vs MANIFEST, 50% WebP q88 -> assets/art/hud/ (stage-lazy like PLAY_UI_KEYS).
Prints the TEMPLE_UI line (cell size + nineSlice halved)."""
import json, hashlib, os
from PIL import Image
S='assets/incoming/battle_hud_top'; D='assets/art/hud'; tu={}; tot=0
for e in json.load(open(f'{S}/MANIFEST.json')):
    p=f"{S}/{e['file']}"; b=open(p,'rb').read()
    assert len(b)==e['bytes'] and hashlib.sha256(b).hexdigest()==e['sha256'], e['key']
    im=Image.open(p).convert('RGBA'); assert im.size==(e['width'],e['height']), e['key']
    im=im.resize((im.width//2,im.height//2),Image.LANCZOS)
    out=f"{D}/{e['key']}.webp"; im.save(out,'WEBP',quality=88,method=6); tot+=os.path.getsize(out)
    ns=e.get('nineSlice'); tu[e['key']]=[e['frame_width']//2,e['frame_height']//2,e['frames'],[round(v/2) for v in ns] if ns else None]
    print(e['key'],im.size,os.path.getsize(out),'B')
print('total',tot,'B')
print('Object.assign(TEMPLE_UI,'+json.dumps(tu,separators=(',',':'))+');')
