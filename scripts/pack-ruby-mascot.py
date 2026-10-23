"""Order 36: verified Ruby sources -> half-size WebP, lazy stage/menu kits."""
import hashlib
import json
from pathlib import Path
from PIL import Image

source = Path('assets/incoming/ruby_mascot')
dest = Path('assets/art/mascot')
dest.mkdir(parents=True, exist_ok=True)
for entry in json.loads((source / 'MANIFEST.json').read_text())['assets']:
    data = (source / entry['file']).read_bytes()
    assert len(data) == entry['bytes'], entry['key']
    assert hashlib.sha256(data).hexdigest() == entry['sha256'], entry['key']
    with Image.open(source / entry['file']) as image:
        assert image.size == (entry['width'], entry['height']), entry['key']
        image = image.convert('RGBA').resize((image.width // 2, image.height // 2), Image.Resampling.LANCZOS)
        output = dest / (entry['key'] + '.webp')
        temporary = output.with_suffix('.tmp')
        image.save(temporary, 'WEBP', quality=86, method=6)
        temporary.replace(output)
        with Image.open(output) as packed:
            packed.load()
            assert packed.size == image.size
        print(entry['key'], image.size, output.stat().st_size)
