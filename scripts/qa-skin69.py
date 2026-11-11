#!/usr/bin/env python3
"""Automatic pass/fail check for order 69 festival skin sheets (owner 11 Nov 2026: stop checking files one by one).

Usage: python3 scripts/qa-skin69.py <hero> [--json] [--fix]
  --fix  writes aligned copies to assets/incoming/skins69/<hero>/aligned/ : each frame is moved inside its cell so its
         feet line and centre match the original frame (fixes "whole sheet sits 8px low" without redrawing), then re-checks.
Compares every assets/incoming/skins69/<hero>/candidates/*.png with the original art the game uses
(found by key in game.js) and prints ONE line per file: PASS or FAIL + the reason.

A sheet PASSES when, for every frame cell:
  - the image size equals the original (same grid, same frame count)
  - the frame is not empty when the original frame is not empty
  - feet line (lowest solid pixel) is within FEET_TOL px of the original frame
  - horizontal centre of the solid body is within CENTER_TOL px of the original frame
  - no solid pixel touches the cell edge unless the original also touches that edge
Cards/roster portraits only need the same size and a non-empty image.

This is the acceptance rule. Do not open the images one by one or write long audit files:
if every line says PASS, the hero is ready for the owner to look at on the phone.
"""
import json, os, re, sys
from PIL import Image

FEET_TOL = 6      # px · ฮีโร่ยืนที่เดิม (ไม่ลอย/จม)
CENTER_TOL = 10   # px · ตัวไม่เลื่อนซ้ายขวา (เสื้อผ้า/เอฟเฟกต์ทำให้ขยับได้บ้าง)
SOLID = 96        # alpha นับเป็นเนื้อภาพ
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def original_url(src, base):
    m = re.search(r"\b" + re.escape(base) + r":\s*(?:\{\s*url:)?\s*'([^']+)'(?:\s*,\s*frame:\s*(\d+))?", src)
    return (m.group(1), int(m.group(2)) if m and m.group(2) else None) if m else (None, None)


def cell_stats(img, x, y, f):
    a = img.crop((x, y, x + f, y + f)).getchannel('A').point(lambda v: 255 if v >= SOLID else 0)
    bb = a.getbbox()
    if not bb:
        return None
    return {'cx': (bb[0] + bb[2]) / 2, 'feet': bb[3], 'edge': (bb[0] == 0, bb[1] == 0, bb[2] == f, bb[3] == f)}


def align(cand_path, orig_path, frame, out_path):
    a, b = Image.open(cand_path).convert('RGBA'), Image.open(orig_path).convert('RGBA')
    if not frame or a.size != b.size:
        a.save(out_path); return
    out = Image.new('RGBA', a.size, (0, 0, 0, 0))
    for y in range(0, a.size[1], frame):
        for x in range(0, a.size[0], frame):
            cell = a.crop((x, y, x + frame, y + frame)); ca, cb = cell_stats(a, x, y, frame), cell_stats(b, x, y, frame)
            dx = dy = 0
            if ca and cb:
                dy = cb['feet'] - ca['feet'] if abs(cb['feet'] - ca['feet']) > 2 else 0
                dx = round(cb['cx'] - ca['cx']) if abs(cb['cx'] - ca['cx']) > CENTER_TOL / 2 else 0
            moved = Image.new('RGBA', (frame, frame), (0, 0, 0, 0)); moved.paste(cell, (dx, dy), cell)
            out.paste(moved, (x, y))
    out.save(out_path)


def check(cand_path, orig_path, frame):
    a, b = Image.open(cand_path).convert('RGBA'), Image.open(orig_path).convert('RGBA')
    if a.size != b.size:
        return False, f'size {a.size} != original {b.size}'
    if not frame:
        return (a.getchannel('A').getbbox() is not None), 'empty image'
    bad = []
    n = 0
    for y in range(0, a.size[1], frame):
        for x in range(0, a.size[0], frame):
            n += 1
            ca, cb = cell_stats(a, x, y, frame), cell_stats(b, x, y, frame)
            if cb is None:
                continue
            if ca is None:
                bad.append(f'frame {n} empty'); continue
            if abs(ca['feet'] - cb['feet']) > FEET_TOL:
                bad.append(f"frame {n} feet {ca['feet'] - cb['feet']:+d}px")
            if abs(ca['cx'] - cb['cx']) > CENTER_TOL:
                bad.append(f"frame {n} center {ca['cx'] - cb['cx']:+.0f}px")
            if any(e and not o for e, o in zip(ca['edge'], cb['edge'])):
                bad.append(f'frame {n} touches cell edge')
    return (not bad), '; '.join(bad[:4]) + (f' (+{len(bad) - 4} more)' if len(bad) > 4 else '')


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    hero = sys.argv[1]
    src = open(os.path.join(ROOT, 'game.js'), encoding='utf8').read()
    d = os.path.join(ROOT, 'assets/incoming/skins69', hero, 'candidates')
    fix = '--fix' in sys.argv
    if fix:
        od = os.path.join(ROOT, 'assets/incoming/skins69', hero, 'aligned'); os.makedirs(od, exist_ok=True)
    rows = []
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'):
            continue
        if f.startswith('char_'):
            key = f[:-4]; base = key.split('__')[0]
        else:
            m = re.match(r'(card|roster)_' + hero + r'_([a-z]+)\.png$', f)
            if not m:
                rows.append({'file': f, 'pass': False, 'why': 'unknown file name'}); continue
            base = m.group(1) + '_' + hero; key = base + '__' + m.group(2)
        url, frame = original_url(src, base)
        if not url or not os.path.exists(os.path.join(ROOT, url)):
            rows.append({'file': f, 'key': key, 'pass': False, 'why': 'original art not found for ' + base}); continue
        cp = os.path.join(d, f)
        if fix:
            align(cp, os.path.join(ROOT, url), frame, os.path.join(od, f)); cp = os.path.join(od, f)
        ok, why = check(cp, os.path.join(ROOT, url), frame)
        rows.append({'file': f, 'key': key, 'pass': ok, 'why': '' if ok else why})
    if '--json' in sys.argv:
        print(json.dumps(rows, indent=1)); return
    for r in rows:
        print(('PASS ' if r['pass'] else 'FAIL ') + r.get('key', r['file']) + ('' if r['pass'] else '  · ' + r['why']))
    p = sum(r['pass'] for r in rows)
    print(f'{hero}: {p}/{len(rows)} pass')
    sys.exit(0 if p == len(rows) else 1)


if __name__ == '__main__':
    main()
