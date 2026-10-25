"""Generate authored audio orders directly with ElevenLabs; never persist credentials."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import urllib.request
import urllib.error
import winreg

ROOT = Path(__file__).resolve().parents[1]

def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    with temp.open('wb') as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    temp.replace(path)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('folder')
    p.add_argument('--limit', type=int)
    args = p.parse_args()
    folder = ROOT / args.folder
    requests = json.loads((folder / 'REQUESTS.json').read_text(encoding='utf-8'))
    key = None
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment') as reg:
            key = winreg.QueryValueEx(reg, 'ELEVENLABS_API_KEY')[0]
    except FileNotFoundError:
        key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        raise SystemExit('ELEVENLABS_API_KEY is not configured')
    key = key.strip()
    ledger_path = folder / 'PROMPTS.json'
    ledger = json.loads(ledger_path.read_text(encoding='utf-8')) if ledger_path.exists() else []
    done = {r['key'] for r in ledger}
    count = 0
    for r in requests:
        if r['key'] in done:
            continue
        music = r['key'].startswith('bgm_')
        if music:
            endpoint = 'music'
            body = dict(prompt=r['prompt'], music_length_ms=r['durationMs'], model_id='music_v1', force_instrumental=True)
        else:
            endpoint = 'sound-generation'
            body = dict(text=r['prompt'], duration_seconds=r['generationDurationSeconds'], loop=r['loop'], prompt_influence=.5, model_id='eleven_text_to_sound_v2')
        req = urllib.request.Request('https://api.elevenlabs.io/v1/' + endpoint + '?output_format=mp3_44100_128', data=json.dumps(body).encode(), headers={'xi-api-key':key,'Content-Type':'application/json'}, method='POST')
        print('Generating', r['key'], flush=True)
        try:
            with urllib.request.urlopen(req, timeout=240) as response:
                audio = response.read()
                metadata = {k:response.headers.get(k) for k in ['request-id','character-cost','song-id'] if response.headers.get(k)}
        except urllib.error.HTTPError as error:
            detail = error.read().decode('utf-8', errors='replace').replace(key,'[REDACTED]')
            print('API failed:', error.code, detail[:1200], flush=True)
            raise SystemExit(1)
        if len(audio) < 1000:
            raise RuntimeError('Unexpectedly small audio response')
        target = folder / 'originals' / r['file']
        save(target, audio)
        subprocess.run(['ffmpeg','-v','error','-i',str(target),'-f','null','-'], check=True, capture_output=True)
        ledger.append(dict(key=r['key'], provider='ElevenLabs', endpoint=endpoint, parameters=body, response=metadata, file='originals/'+r['file'], bytes=len(audio), sha256=hashlib.sha256(audio).hexdigest()))
        save(ledger_path, (json.dumps(ledger,ensure_ascii=False,indent=2)+'\n').encode())
        print('Saved',r['key'],len(audio),'bytes',flush=True)
        count += 1
        if args.limit and count >= args.limit:
            break

if __name__ == '__main__':
    main()
