"""Pack assets/incoming/taro_sentry PNGs into runtime WebP (assets/art/taro_sentry).
Alpha turret sheets/icons: 256px cells -> 128px (shown 58-80px). Black-background VFX: luminance alpha
(lum x1.35, unpremultiplied) so they render with NORMAL blend; the tall Beacon strike is halved."""
import json, os
from PIL import Image
SRC='assets/incoming/taro_sentry'; DST='assets/art/taro_sentry'
os.makedirs(DST, exist_ok=True)
man={m['key']:m for m in json.load(open(f'{SRC}/MANIFEST.json'))}
HALF={'taro_sentry_idle_sheet','taro_sentry_deploy_sheet','taro_sentry_fire_sheet','taro_sentry_expire_sheet','taro_beacon_idle_sheet','vfx_taro_beacon_strike'}
ICON={'ic_path_tempest_sentry':'taro_sentry_path','ic_taro_reserve_cell':'taro_reserve_cell','ic_taro_wide_conductor':'taro_wide_conductor','ic_taro_rapid_pulse':'taro_rapid_pulse','ic_taro_long_current':'taro_long_current','ic_taro_storm_beacon':'taro_storm_beacon'}
out=[]
for key,m in sorted(man.items()):
  im=Image.open(f"{SRC}/{key}.png").convert('RGBA'); fw,fh=m.get('frameWidth',im.width),m.get('frameHeight',im.height)
  if key.startswith('ic_') or key in HALF:
    im=im.resize((im.width//2,im.height//2),Image.LANCZOS); fw//=2; fh//=2
  dst=f'assets/art/build_paths/{ICON[key]}.webp' if key in ICON else f'{DST}/{key}.webp'
  if m.get('background','alpha')!='alpha':
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
        if al<8: px[x,y]=(0,0,0,0); continue
        k=255/max(al,1); px[x,y]=(min(255,int(r*k)),min(255,int(g*k)),min(255,int(b*k)),al)
    im.save(dst,'WEBP',quality=88,alpha_quality=90,method=6)
  else:
    im.save(dst,'WEBP',lossless=True,method=6)
  out.append({'key':key,'file':dst,'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'frames':m.get('frameCount',1),'source_sha256':m.get('sha256')})
json.dump(out,open(f'{DST}/MANIFEST.json','w'),indent=1)
for o in out: print(o['key'],o['width'],o['height'],o['frameWidth'],o['frameHeight'],o['frames'],os.path.getsize(o['file']))
