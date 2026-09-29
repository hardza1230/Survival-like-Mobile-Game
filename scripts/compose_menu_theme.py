"""Render the original Mochi Mayhem menu loop (CC0-style project composition)."""
from pathlib import Path
import numpy as np
from scipy.io import wavfile

SR = 32000
BPM = 96
BEAT = 60 / BPM
BARS = 24
LENGTH = BARS * 4 * BEAT
N = round(LENGTH * SR)
mix = np.zeros((N, 2), dtype=np.float64)
rng = np.random.default_rng(827)


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def add(start, duration, midi, amp, kind, pan=0):
    count = round(duration * SR)
    t = np.arange(count) / SR
    f = hz(midi)
    if kind == 'bell':
        voice = (np.sin(2*np.pi*f*t)*np.exp(-3.5*t) +
                 .35*np.sin(2*np.pi*f*2.01*t)*np.exp(-7*t) +
                 .18*np.sin(2*np.pi*f*3.96*t)*np.exp(-12*t))
        env = np.minimum(1, t/.008) * np.minimum(1, (duration-t)/.04)
    elif kind == 'marimba':
        voice = (np.sin(2*np.pi*f*t) + .23*np.sin(2*np.pi*3*f*t)*np.exp(-9*t))
        env = np.minimum(1, t/.006)*np.exp(-4.3*t)*np.minimum(1,(duration-t)/.03)
    elif kind == 'pluck':
        voice = np.sin(2*np.pi*f*t) + .15*np.sin(2*np.pi*2*f*t)
        env = np.minimum(1,t/.012)*np.exp(-5*t)*np.minimum(1,(duration-t)/.04)
    else:  # soft string pad
        voice = (.70*np.sin(2*np.pi*f*t) + .16*np.sin(2*np.pi*2*f*t) +
                 .10*np.sin(2*np.pi*f*1.003*t))
        env = np.minimum(1,t/.34)*np.minimum(1,(duration-t)/.50)
    mono = amp*voice*env
    start_index = round(start*SR)
    for channel, gain in enumerate((np.sqrt((1-pan)/2), np.sqrt((1+pan)/2))):
        indices = (start_index + np.arange(count)) % N
        np.add.at(mix[:, channel], indices, mono*gain)


# D major, with a gentle B minor turn in the middle of each phrase.
chords = [(50, [62, 66, 69]), (47, [59, 62, 66]),
          (43, [59, 62, 67]), (45, [61, 64, 69])]
melody = [
    [(0,74,1), (1,78,.5), (1.5,76,.5), (2,73,1), (3,74,.75)],
    [(0,71,.75), (.75,73,.5), (1.5,74,1), (2.75,78,.75)],
    [(0,79,.75), (1,78,.5), (1.75,74,.75), (2.75,71,1)],
    [(0,73,.75), (1,76,.5), (1.75,74,.75), (2.75,69,1)],
]
for bar in range(BARS):
    base = bar*4*BEAT
    root, chord = chords[bar % 4]
    for note in chord:
        add(base, 4*BEAT+.25, note-12, .016, 'pad', -.35 if note % 2 else .35)
    for beat in (0, 2):
        add(base+beat*BEAT, 1.6*BEAT, root-12, .07, 'pluck', -.13)
    for eighth in range(8):
        note = chord[[0,1,2,1,0,2,1,2][eighth]]
        add(base+eighth*BEAT/2, .55, note, .026, 'marimba', -.28 if eighth%2 else .28)
    phrase = melody[bar % 4]
    for offset, note, beats in phrase:
        if bar < 4 and offset > 2:  # opening breath
            continue
        if bar in (11, 23) and offset > 2:
            continue
        add(base+offset*BEAT, max(.36, beats*BEAT+.25), note+(12 if bar in (15,19) else 0),
            .055 if bar < 4 else .067, 'bell', .23)
    if bar >= 4:
        # Quiet brushed shaker, with tiny deterministic variation.
        for step in range(8):
            at = round((base+(step+.02)*BEAT/2)*SR)
            dur = round(.07*SR)
            noise = rng.normal(0, 1, dur)
            noise = np.r_[0, np.diff(noise)] * np.exp(-np.arange(dur)/(SR*.018))
            indices = (at+np.arange(dur)) % N
            mix[indices, step%2] += .0023*noise

# Short diffuse echo returns inside the loop, including across the seam.
dry = mix.copy()
for delay, gain, swap in ((.18,.10,True), (.37,.06,False), (.59,.035,True)):
    echo = np.roll(dry, round(delay*SR), axis=0)
    mix += gain*(echo[:, ::-1] if swap else echo)
peak = np.max(np.abs(mix))
mix = np.tanh(mix * (.78/peak)*1.10)
out = Path('assets/audio/bgm/menu/bgm_menu_mochi_morning.wav')
wavfile.write(out, SR, (mix*32767).astype(np.int16))
print(f'{out} | {LENGTH:.1f}s | peak {peak:.3f}')
