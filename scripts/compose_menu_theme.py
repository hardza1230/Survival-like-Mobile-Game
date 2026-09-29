"""Render the original Mochi Mayhem menu loop (CC0-style project composition)."""
from pathlib import Path
import numpy as np
from scipy.io import wavfile

SR = 32000
BPM = 112
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


# G major: home → sunshine → anticipation → home. Avoid the minor turn.
chords = [(55, [67, 71, 74]), (48, [67, 72, 76]),
          (50, [66, 69, 74]), (55, [67, 71, 74])]
melody = [
    [(0,79,.5), (.5,83,.5), (1,86,.75), (2,83,.5), (2.5,79,.5), (3,81,.75)],
    [(0,84,.5), (.5,83,.5), (1,79,.5), (1.5,81,.5), (2,84,.75), (3,88,.5)],
    [(0,86,.5), (.5,81,.5), (1,78,.5), (1.5,81,.5), (2,86,.5), (2.5,88,.5), (3,86,.75)],
    [(0,83,.5), (.5,81,.5), (1,79,.75), (2,74,.5), (2.5,79,.5), (3,79,.75)],
]
for bar in range(BARS):
    base = bar*4*BEAT
    root, chord = chords[bar % 4]
    for note in chord:
        add(base, 4*BEAT+.25, note-12, .010, 'pad', -.35 if note % 2 else .35)
    for beat in (0, 1.5, 2, 3.5):
        add(base+beat*BEAT, .75*BEAT, root-12, .075 if beat in (0,2) else .038, 'pluck', -.13)
    for eighth in range(8):
        note = chord[[0,1,2,1,0,1,2,1][eighth]]
        add(base+eighth*BEAT/2, .38, note+12, .031, 'marimba', -.28 if eighth%2 else .28)
    phrase = melody[bar % 4]
    for offset, note, beats in phrase:
        add(base+offset*BEAT, max(.25, beats*BEAT+.12), note,
            .064 if bar < 4 else .071, 'bell', .23)
    if bar >= 2:
        # Candy-like tick on the offbeats, kept below the melody.
        for step in range(8):
            at = round((base+(step+.02)*BEAT/2)*SR)
            dur = round(.07*SR)
            noise = rng.normal(0, 1, dur)
            noise = np.r_[0, np.diff(noise)] * np.exp(-np.arange(dur)/(SR*.018))
            indices = (at+np.arange(dur)) % N
            mix[indices, step%2] += (.0028 if step%2 else .0018)*noise

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
