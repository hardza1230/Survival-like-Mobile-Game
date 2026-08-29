import os
import wave
import numpy as np

SAMPLE_RATE = 44100

def save_wav(filepath, samples):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    max_val = np.max(np.abs(samples))
    if max_val > 0:
        samples = samples / max_val * 0.92
    int_samples = (samples * 32767).astype(np.int16)
    with wave.open(filepath, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(int_samples.tobytes())
    print(f"[AUDIO] Saved: {filepath} ({len(samples)/SAMPLE_RATE:.2f}s)")

# Instrument Synthesizers
def synth_marimba(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 14.0)
    # Fundamental + wooden overtone (approx 3.8x)
    wave_data = np.sin(2 * np.pi * freq * t) * 0.7 + np.sin(2 * np.pi * freq * 3.8 * t) * 0.3
    # Click transient
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 120.0) * 0.2
    return (wave_data + click) * env

def synth_bell(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 7.0)
    wave_data = (
        np.sin(2 * np.pi * freq * t) * 0.6 +
        np.sin(2 * np.pi * freq * 2.0 * t) * 0.25 +
        np.sin(2 * np.pi * freq * 3.0 * t) * 0.15
    )
    return wave_data * env

def synth_bass(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 5.0)
    # Warm sine bass with slight 2nd harmonic
    wave_data = np.sin(2 * np.pi * freq * t) * 0.8 + np.sin(2 * np.pi * freq * 2.0 * t) * 0.2
    return wave_data * env

def synth_kick(duration=0.15):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    freq = 150 * np.exp(-t * 30.0) + 45
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    env = np.exp(-t * 18.0)
    return np.sin(phase) * env

def synth_hihat(duration=0.06):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    noise = np.random.uniform(-1, 1, len(t))
    env = np.exp(-t * 55.0)
    return noise * env

# ==================== SFX GENERATOR ====================
def generate_sfx():
    print("Generating SFX Suite...")
    
    # 1. Jump / Squish
    t = np.linspace(0, 0.22, int(SAMPLE_RATE * 0.22), False)
    freq = 260 + 550 * np.exp(-t * 18) + 120 * np.sin(t * 75)
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    env = np.sin(np.pi * t / 0.22) ** 1.3
    save_wav("assets/audio/sfx/sfx_jump_squish.wav", np.sin(phase) * env)

    # 2. Sugar Pickup (Chime)
    notes = [1318.5, 1661.2, 1975.5, 2637.0] # E6, G#6, B6, E7
    s_pickup = np.zeros(int(SAMPLE_RATE * 0.45))
    for i, f in enumerate(notes):
        start = int(i * 0.065 * SAMPLE_RATE)
        tone = synth_bell(f, 0.22)
        s_pickup[start:start+len(tone)] += tone
    save_wav("assets/audio/sfx/sfx_pickup_sugar.wav", s_pickup)

    # 3. Sprinkle Spray Bullet Shoot
    t = np.linspace(0, 0.14, int(SAMPLE_RATE * 0.14), False)
    freq = 900 * np.exp(-t * 22) + 300
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    pop = (np.sin(phase) + np.random.uniform(-0.15, 0.15, len(t))) * np.exp(-t * 24)
    save_wav("assets/audio/sfx/sfx_skill_sprinkle.wav", pop)

    # 4. Chili Nova Fiery Blast
    t = np.linspace(0, 0.45, int(SAMPLE_RATE * 0.45), False)
    noise = np.random.uniform(-1, 1, len(t))
    freq = 240 * np.exp(-t * 8) + 60
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    blast = (np.sin(phase) * 0.6 + noise * 0.4) * np.exp(-t * 6.5)
    save_wav("assets/audio/sfx/sfx_skill_chili.wav", blast)

    # 5. Frost Pulse Freeze
    t = np.linspace(0, 0.4, int(SAMPLE_RATE * 0.4), False)
    freq1 = 1800 + 400 * np.sin(t * 60)
    freq2 = 2400 + 600 * np.sin(t * 85)
    p1 = 2 * np.pi * np.cumsum(freq1) / SAMPLE_RATE
    p2 = 2 * np.pi * np.cumsum(freq2) / SAMPLE_RATE
    frost = (np.sin(p1) * 0.5 + np.sin(p2) * 0.5) * np.exp(-t * 7.5)
    save_wav("assets/audio/sfx/sfx_skill_frost.wav", frost)

    # 6. Hit Monster
    t = np.linspace(0, 0.12, int(SAMPLE_RATE * 0.12), False)
    freq = 220 * np.exp(-t * 35) + 80
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    hit = np.sin(phase) * np.exp(-t * 25)
    save_wav("assets/audio/sfx/sfx_hit_monster.wav", hit)

    # 7. Sugar Bomb Ult Explosion
    t = np.linspace(0, 0.8, int(SAMPLE_RATE * 0.8), False)
    freq = 120 * np.exp(-t * 6) + 35
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    noise = np.random.uniform(-0.8, 0.8, len(t))
    sparkle = np.sin(2 * np.pi * 1400 * t) * np.exp(-t * 4) * 0.3
    bomb = (np.sin(phase) * 0.7 + noise * 0.3 + sparkle) * np.exp(-t * 4.2)
    save_wav("assets/audio/sfx/sfx_ult_sugarbomb.wav", bomb)

    # 8. Level Up Fanfare
    fanfare_notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98] # C5, E5, G5, C6, E6, G6
    s_lvl = np.zeros(int(SAMPLE_RATE * 0.85))
    for i, f in enumerate(fanfare_notes):
        start = int(i * 0.09 * SAMPLE_RATE)
        dur = 0.35 if i == len(fanfare_notes) - 1 else 0.18
        tone = synth_bell(f, dur)
        s_lvl[start:start+len(tone)] += tone
    save_wav("assets/audio/sfx/sfx_levelup_fanfare.wav", s_lvl)

    # 9. UI Button Click
    t = np.linspace(0, 0.08, int(SAMPLE_RATE * 0.08), False)
    freq = 600 * np.exp(-t * 30) + 400
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    click = np.sin(phase) * np.exp(-t * 35)
    save_wav("assets/audio/sfx/sfx_btn_click.wav", click)

    # 10. Chest Open
    chest_notes = [659.25, 783.99, 987.77, 1318.5] # E5, G5, B5, E6
    s_chest = np.zeros(int(SAMPLE_RATE * 0.6))
    for i, f in enumerate(chest_notes):
        start = int(i * 0.08 * SAMPLE_RATE)
        tone = synth_bell(f, 0.28)
        s_chest[start:start+len(tone)] += tone
    save_wav("assets/audio/sfx/sfx_chest_open.wav", s_chest)

# ==================== BGM GENERATOR ====================
def generate_bgm():
    print("\nGenerating BGM Suite (Kawaii Dessert Chiptune & Marimba)...")
    bpm = 124
    beat_dur = 60.0 / bpm # ~0.484s
    bar_dur = beat_dur * 4 # ~1.935s
    
    # 8 Bars loop = ~15.48s
    total_bars = 8
    total_dur = bar_dur * total_bars
    total_samples = int(SAMPLE_RATE * total_dur)
    
    bgm_track = np.zeros(total_samples)
    
    # Note Frequencies (C4 to C6)
    C4, D4, E4, F4, G4, A4, B4 = 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88
    C5, D5, E5, F5, G5, A5 = 523.25, 587.33, 659.25, 698.46, 783.99, 880.00
    C3, A2, F2, G2 = 130.81, 110.00, 87.31, 98.00 # Bass
    
    # 1. Chord Progression: C -> Am -> F -> G (repeated twice)
    chord_bass = [C3, A2, F2, G2, C3, A2, F2, G2]
    
    for bar_idx, b_freq in enumerate(chord_bass):
        bar_start = bar_idx * bar_dur
        # Bass on beat 1 and beat 3
        for beat in [0, 2]:
            t_sec = bar_start + beat * beat_dur
            idx = int(t_sec * SAMPLE_RATE)
            bass_tone = synth_bass(b_freq, beat_dur * 1.6)
            if idx + len(bass_tone) <= total_samples:
                bgm_track[idx:idx+len(bass_tone)] += bass_tone * 0.45

        # Drum beat (Kick on 1, 3; Hi-hat on every 8th note)
        for b in range(4):
            t_sec = bar_start + b * beat_dur
            idx = int(t_sec * SAMPLE_RATE)
            if b in [0, 2]:
                kick = synth_kick()
                if idx + len(kick) <= total_samples:
                    bgm_track[idx:idx+len(kick)] += kick * 0.35
            # 8th note hi-hats
            for h in [0, 0.5]:
                h_idx = int((t_sec + h * beat_dur) * SAMPLE_RATE)
                hh = synth_hihat()
                if h_idx + len(hh) <= total_samples:
                    bgm_track[h_idx:h_idx+len(hh)] += hh * 0.15

    # 2. Cute Marimba Melody (Catchy Dessert Theme)
    melody_notes = [
        # Bar 1 (C)
        (0.0, E5, 0.5), (0.5, G5, 0.5), (1.0, C5, 1.0), (2.0, E5, 0.5), (2.5, D5, 0.5), (3.0, C5, 1.0),
        # Bar 2 (Am)
        (4.0, A4, 0.5), (4.5, C5, 0.5), (5.0, E5, 1.0), (6.0, G5, 0.5), (6.5, E5, 0.5), (7.0, D5, 1.0),
        # Bar 3 (F)
        (8.0, F4, 0.5), (8.5, A4, 0.5), (9.0, C5, 1.0), (10.0, D5, 0.5), (10.5, E5, 0.5), (11.0, F5, 1.0),
        # Bar 4 (G)
        (12.0, G5, 0.5), (12.5, E5, 0.5), (13.0, D5, 1.0), (14.0, C5, 1.0), (15.0, D5, 1.0),
        # Bar 5 (C) - High octave variation
        (16.0, E5, 0.5), (16.5, G5, 0.5), (17.0, A5, 1.0), (18.0, G5, 0.5), (18.5, E5, 0.5), (19.0, C5, 1.0),
        # Bar 6 (Am)
        (20.0, C5, 0.5), (20.5, D5, 0.5), (21.0, E5, 1.0), (22.0, D5, 0.5), (22.5, C5, 0.5), (23.0, A4, 1.0),
        # Bar 7 (F)
        (24.0, A4, 0.5), (24.5, C5, 0.5), (25.0, D5, 1.0), (26.0, E5, 0.5), (26.5, G5, 0.5), (27.0, A5, 1.0),
        # Bar 8 (G) -> Resolution
        (28.0, G5, 0.5), (28.5, E5, 0.5), (29.0, D5, 0.5), (29.5, C5, 0.5), (30.0, C5, 2.0)
    ]
    
    for (beat_time, freq, dur_beats) in melody_notes:
        t_sec = beat_time * beat_dur
        dur_sec = dur_beats * beat_dur
        idx = int(t_sec * SAMPLE_RATE)
        m_note = synth_marimba(freq, dur_sec * 1.2)
        if idx + len(m_note) <= total_samples:
            bgm_track[idx:idx+len(m_note)] += m_note * 0.4

    save_wav("assets/audio/bgm/bgm_stage1_pantry_loop.wav", bgm_track)
    save_wav("assets/audio/bgm/bgm_main_theme.wav", bgm_track)

if __name__ == "__main__":
    generate_sfx()
    generate_bgm()
    print("\nAll Sound Effects & Background Music created successfully!")
