"""Art order 39: copy the delivered q78 WebP candidates (bytes checked vs MANIFEST / HELPER_MANIFEST).
Book sheets -> assets/art/book/ (lazy, title only), nav/side icons -> assets/art/lobby/ (lazy with the Lobby).
Black VFX (vfx_bk_magic, vfx_bk_burst) stay black and use ADD blend in game.js."""
import json, os, shutil
S='assets/incoming/book_opening_plus'
rows=json.load(open(f'{S}/MANIFEST.json'))+[dict(key='bk_cover_clean_plate',webpCandidate=dict(file=json.load(open(f'{S}/HELPER_MANIFEST.json'))['packedFile'],bytes=json.load(open(f'{S}/HELPER_MANIFEST.json'))['packedBytes']))]
for e in rows:
    k=e['key']; w=e['webpCandidate']; src=f"{S}/{w['file']}"
    assert os.path.getsize(src)==w['bytes'], k
    d='assets/art/lobby' if k.startswith('ic_') else 'assets/art/book'
    shutil.copyfile(src,f'{d}/{k}.webp'); print(k,'->',d,w['bytes']//1024,'KB')
