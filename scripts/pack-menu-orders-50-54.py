"""Verify the delivered ImageGen sources and promote their half-size alpha WebPs.

No painting or resampling: the reviewed previews are already the production size.
"""
import hashlib,json,os,pathlib
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/art/menu_orders';OUT.mkdir(parents=True,exist_ok=True)
rows=[]
for folder in ('merge_forge','login_daily','awards','codex_books','depths_rank'):
    src=ROOT/'assets/incoming'/folder
    for row in json.loads((src/'MANIFEST.json').read_text()):
        for name,sha in ((row['file'],row['sha256']),(row['preview_file'],row['preview_sha256'])):
            b=(src/name).read_bytes();assert hashlib.sha256(b).hexdigest()==sha,name
            im=Image.open(src/name);im.load()
        data=(src/row['preview_file']).read_bytes();dest=OUT/(row['key']+'.webp');tmp=dest.with_suffix('.tmp')
        with open(tmp,'wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
        os.replace(tmp,dest);assert dest.read_bytes()==data
        rows.append(dict(key=row['key'],source=folder,frameWidth=row['frameWidth']//2,frameHeight=row['frameHeight']//2,columns=row['columns'],frames=row['frameCount'],nineSlice=[v/2 for v in row['nineSlice']] if row.get('nineSlice') else None,loop=row['loop'],blend=row['blend'],bytes=len(data),sha256=row['preview_sha256']))
(OUT/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8',newline='\n')
print(f'{len(rows)} runtime sheets / {sum(r["frames"] for r in rows)} frames / {sum(r["bytes"] for r in rows):,} bytes')
