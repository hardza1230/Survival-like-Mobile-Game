"""Move the 42 menu PNGs the game still loaded from assets/incoming/ into assets/art/ as WebP (same pixel size),
so CI can skip assets/incoming (2 GB of source deliveries) on checkout. Re-run after replacing a source PNG."""
import pathlib,re
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];src=(ROOT/'game.js').read_text(encoding='utf-8')
for u in sorted(set(re.findall(r"'assets/incoming/(menu_screens|menu_stage_cards)/([^']+)\.png'",src))):
    sub,name=u;p=ROOT/'assets/incoming'/sub/(name+'.png');out=ROOT/'assets/art'/sub;out.mkdir(parents=True,exist_ok=True)
    im=Image.open(p);im=im.convert('RGBA' if im.mode in ('RGBA','LA','P') else 'RGB');d=out/(name+'.webp');im.save(d,'WEBP',quality=88,method=6)
    print(f"{sub}/{name}: {p.stat().st_size//1024}K -> {d.stat().st_size//1024}K {im.size}")
