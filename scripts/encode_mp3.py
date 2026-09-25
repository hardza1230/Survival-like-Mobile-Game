# แปลง WAV (16-bit stereo) ในโฟลเดอร์ → mp3 ด้วย lameenc (pip install lameenc)
# ใช้: python3 scripts/encode_mp3.py SRC_DIR DST_DIR [kbps]
import sys, os, wave, lameenc
src, dst = sys.argv[1], sys.argv[2]
kbps = int(sys.argv[3]) if len(sys.argv) > 3 else 112
os.makedirs(dst, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.endswith('.wav'):
        continue
    w = wave.open(os.path.join(src, f))
    enc = lameenc.Encoder()
    enc.set_bit_rate(kbps); enc.set_in_sample_rate(w.getframerate())
    enc.set_channels(w.getnchannels()); enc.set_quality(2)
    data = enc.encode(w.readframes(w.getnframes())) + enc.flush()
    out = os.path.join(dst, f[:-4] + '.mp3')
    open(out, 'wb').write(data)
    print(out, len(data) // 1024, 'KB')
