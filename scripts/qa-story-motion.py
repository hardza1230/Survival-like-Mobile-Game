"""Read-only asset validation and mechanical contact sheets for art order 45.

Run from the repository root, after packing: python scripts/qa-story-motion.py
No source pixels or manifests are changed. Exit 1 means QA found errors.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('assets/incoming/story_motion'))
    args = parser.parse_args()
    root = args.root.resolve()
    review = root / 'review'
    review.mkdir(parents=True, exist_ok=True)
    errors, results, seen, sheets = [], [], set(), []
    manifests = sorted(p for p in root.rglob('MANIFEST.json') if '_sources' not in p.relative_to(root).parts)
    if not manifests:
        errors.append('No asset MANIFEST.json files found')
    for manifest in manifests:
        rel = manifest.relative_to(root).as_posix()
        tiles = []
        try:
            data = json.loads(manifest.read_text(encoding='utf-8-sig'))
            assets = data['assets']
            if not isinstance(assets, list) or not assets:
                raise ValueError('assets must be a nonempty list')
        except Exception as exc:
            errors.append(f'{rel}: invalid manifest: {exc}')
            continue
        for asset in assets:
            issues = []
            key = asset.get('key', '<missing-key>')
            row = {'manifest': rel, 'key': key, 'errors': issues}
            results.append(row)
            if key in seen:
                issues.append('duplicate asset key')
            seen.add(key)
            try:
                path = (manifest.parent / asset['file']).resolve()
                path.relative_to(root)
                raw = path.read_bytes()
                row.update(file=path.relative_to(root).as_posix(), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())
                if row['sha256'] != asset.get('sha256'):
                    issues.append('SHA256 missing or mismatch')
                if 'bytes' in asset and len(raw) != asset['bytes']:
                    issues.append('byte count mismatch')
                # verify() checks the PNG chunk CRCs; reopen to force full pixel decode.
                with Image.open(path) as check:
                    if check.format != 'PNG':
                        issues.append('source is not PNG')
                    check.verify()
                with Image.open(path) as opened:
                    opened.load()
                    row['mode'] = opened.mode
                    if opened.mode != 'RGBA':
                        issues.append('expected PNG32 RGBA')
                    im = opened.convert('RGBA')
                row['width'], row['height'] = im.size
                if im.size != (asset.get('width'), asset.get('height')):
                    issues.append('actual dimensions differ from manifest')
                alpha = im.getchannel('A')
                row['alpha_range'] = list(alpha.getextrema())
                row['alpha_bbox'] = alpha.getbbox()
                far = '_far_' in key
                puppet = key.startswith('cs_pup_') or '_chr_' in key
                fx = key.startswith('cs_fx_') or '_fx_' in key
                if far and alpha.getextrema() != (255, 255):
                    issues.append('far background must be fully opaque')
                if far and im.width < data.get('background_overscan_width', 1242):
                    issues.append('far background lacks 15% horizontal overscan')
                if puppet:
                    bbox = alpha.getbbox()
                    padding = asset.get('padding', 24)
                    if not bbox:
                        issues.append('puppet is empty')
                    else:
                        margins = [bbox[0], bbox[1], im.width-bbox[2], im.height-bbox[3]]
                        row['transparent_margins'] = margins
                        if padding < 24 or min(margins) < padding:
                            issues.append('puppet requires declared 24px transparent padding on every side')
                    pivot = asset.get('pivot')
                    if not isinstance(pivot, list) or len(pivot) != 2 or not all(isinstance(v, (int, float)) and 0 <= v <= 1 for v in pivot):
                        issues.append('puppet requires normalized [x,y] pivot')
                if ('_mid_' in key or '_fg_' in key) and alpha.getextrema()[0] == 255:
                    issues.append('mid/fg background requires real transparency')
                if '_mid_' in key or '_fg_' in key:
                    if im.size != (1242,1920):
                        issues.append('overlay requires 1242x1920 overscan canvas')
                    if alpha.crop((0,1382,1242,1920)).getbbox():
                        issues.append('overlay must leave lower28% clear for dialogue')
                if fx:
                    frames = asset.get('frames', asset.get('frame_count'))
                    fw = asset.get('frame_width', asset.get('frameWidth'))
                    fh = asset.get('frame_height', asset.get('frameHeight'))
                    if isinstance(frames, dict):
                        fw = frames.get('width', fw)
                        fh = frames.get('height', fh)
                        frames = frames.get('count')
                    row['frames'] = frames
                    expected_frames = {'cs_fx_speedlines': 4, 'cs_fx_flash': 1,
                                       'cs_fx_transform': 8, 'cs_fx_seed_glow': 6,
                                       'cs_fx_flavor_ribbon': 6, 'cs_fx_crack': 5,
                                       'cs_fx_dust': 6, 'cs_fx_frost_shatter': 6,
                                       'cs_fx_curse_smoke': 6, 'cs_fx_sparkle': 6}
                    if key in expected_frames and frames != expected_frames[key]:
                        issues.append(f'FX frame count differs from art order ({expected_frames[key]})')
                    if not all(isinstance(v, int) and v > 0 for v in (frames, fw, fh)):
                        issues.append('FX requires positive frames, frame_width and frame_height')
                    elif im.size != (frames * fw, fh):
                        issues.append('FX must be one horizontal row of equal sized frames')
                    elif asset.get('padding') == 8:
                        for frame in range(frames):
                            part=im.crop((frame*fw,0,(frame+1)*fw,fh))
                            channel=part.convert('RGB') if asset.get('blend')=='ADD' else part.getchannel('A')
                            for edge in [(0,0,fw,8),(0,fh-8,fw,fh),(0,0,8,fh),(fw-8,0,fw,fh)]:
                                if channel.crop(edge).getbbox():
                                    issues.append(f'FX frame {frame} lacks clear8px gutter')
                                    break
                    blend = str(asset.get('blend', '')).upper()
                    if blend not in ('ADD', 'NORMAL'):
                        issues.append('FX blend must be ADD or NORMAL')
                    elif blend == 'NORMAL' and alpha.getextrema()[0] == 255:
                        issues.append('NORMAL FX requires transparency')
                    elif blend == 'ADD' and alpha.getextrema() == (255,255):
                        # Additive donors use black negative space; verify at least one
                        # fully black pixel instead of imposing a black bounding border.
                        extrema = im.convert('RGB').getextrema()
                        if any(lo > 0 for lo, hi in extrema):
                            issues.append('opaque ADD FX has no black negative space')
                thumb = Image.new('RGB', (288, 250), '#777777')
                fitted = ImageOps.contain(im, (272, 205), Image.Resampling.LANCZOS)
                thumb.paste(fitted, ((288-fitted.width)//2, 8+(205-fitted.height)//2), fitted)
                draw = ImageDraw.Draw(thumb)
                draw.text((8, 216), key, fill='white', font_size=12)
                draw.text((8, 233), f'{im.width} x {im.height} | {"FAIL" if issues else "OK"}', fill='#ffbbbb' if issues else 'white', font_size=12)
                tiles.append(thumb)
            except Exception as exc:
                issues.append(f'cannot validate: {type(exc).__name__}: {exc}')
            errors.extend(f'{rel}: {key}: {issue}' for issue in issues)
        # Limit sheet heights for practical human inspection; use only actual assets.
        for page in range(math.ceil(len(tiles)/24)):
            subset = tiles[page*24:(page+1)*24]
            sheet = Image.new('RGB', (4*288, math.ceil(len(subset)/4)*250), '#777777')
            for i, tile in enumerate(subset):
                sheet.paste(tile, ((i%4)*288, (i//4)*250))
            name = manifest.parent.relative_to(root).as_posix().replace('/', '_') or 'root'
            dest = review / f'{name}-{page+1:02d}.jpg'
            sheet.save(dest, quality=92)
            sheets.append(dest.relative_to(root).as_posix())
    sources=[]
    prompt_file=root/'PROMPTS.json'
    if prompt_file.exists():
        for job in json.loads(prompt_file.read_text(encoding='utf-8-sig'))['jobs']:
            source=root/'_sources'/job['source']
            try:
                raw=source.read_bytes()
                with Image.open(source) as check:check.verify()
                with Image.open(source) as check:check.load();size=list(check.size)
                sha=hashlib.sha256(raw).hexdigest()
                if sha!=job['sha256']:raise ValueError('source SHA256 mismatch')
                sources.append(dict(file=source.relative_to(root).as_posix(),sha256=sha,bytes=len(raw),size=size,status='PASS'))
            except Exception as exc:
                errors.append(str(source)+': '+str(exc))
    report = {'status': 'PASS' if not errors else 'FAIL', 'manifest_count': len(manifests),
              'asset_count': len(results), 'valid_asset_count': sum(not r['errors'] for r in results),
              'total_bytes': sum(r.get('bytes', 0) for r in results),
              'method': 'Pillow PNG verify/CRC + full RGBA decode; SHA256; declared dimensions, alpha, padding, pivots and horizontal FX metadata. Contact sheets use actual retained pixels on gray.',
              'errors': errors, 'contact_sheets': sheets, 'assets': results, 'original_sources':sources}
    (root / 'QA_REPORT.json').write_bytes((json.dumps(report, indent=2)+'\n').encode('utf-8'))
    for manifest in manifests:
        subset=[r for r in results if r['manifest']==manifest.relative_to(root).as_posix()]
        local=dict(status='PASS' if all(not r['errors'] for r in subset) else 'FAIL',assets=subset)
        (manifest.parent/'QA_REPORT.json').write_bytes((json.dumps(local,indent=2)+'\n').encode('utf-8'))
    print(json.dumps({k: report[k] for k in ('status','manifest_count','asset_count','valid_asset_count','total_bytes','errors')}, indent=2))
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
