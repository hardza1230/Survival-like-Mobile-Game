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
    print(f"[BGM] Generated: {filepath} ({len(samples)/SAMPLE_RATE:.2f}s)")

# --- Instrument Synthesizers ---
def synth_marimba(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 14.0)
    wave_data = np.sin(2 * np.pi * freq * t) * 0.7 + np.sin(2 * np.pi * freq * 3.8 * t) * 0.3
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 120.0) * 0.25
    return (wave_data + click) * env

def synth_steeldrum(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 9.0)
    # Metallic FM modulation
    mod = np.sin(2 * np.pi * freq * 2.7 * t) * 2.0 * np.exp(-t * 18.0)
    wave_data = np.sin(2 * np.pi * freq * t + mod)
    return wave_data * env

def synth_celesta(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 6.0)
    wave_data = (
        np.sin(2 * np.pi * freq * t) * 0.6 +
        np.sin(2 * np.pi * freq * 2.0 * t) * 0.25 +
        np.sin(2 * np.pi * freq * 3.0 * t) * 0.15
    )
    return wave_data * env

def synth_organ(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.minimum(1.0, t * 20.0) * np.exp(-t * 2.5)
    wave_data = (
        np.sin(2 * np.pi * freq * t) * 0.5 +
        np.sin(2 * np.pi * freq * 2.0 * t) * 0.3 +
        np.sin(2 * np.pi * freq * 4.0 * t) * 0.2
    )
    return wave_data * env

def synth_bass(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 4.5)
    return (np.sin(2 * np.pi * freq * t) * 0.85 + np.sin(2 * np.pi * freq * 2.0 * t) * 0.15) * env

def synth_kick(duration=0.16):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    freq = 160 * np.exp(-t * 28.0) + 40
    phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    return np.sin(phase) * np.exp(-t * 16.0)

def synth_hihat(duration=0.06):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    return np.random.uniform(-1, 1, len(t)) * np.exp(-t * 60.0)

def synth_snare(duration=0.18):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    tone = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 25.0)
    noise = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 18.0)
    return (tone * 0.4 + noise * 0.6)

# --- 1. Stage 1: The Pantry (ตู้กับข้าว) ---
def make_stage1_pantry():
    bpm = 124
    beat_dur = 60.0 / bpm
    total_bars = 8
    total_samples = int(SAMPLE_RATE * beat_dur * 4 * total_bars)
    track = np.zeros(total_samples)
    
    C3, A2, F2, G2 = 130.81, 110.00, 87.31, 98.00
    C5, D5, E5, F5, G5, A5 = 523.25, 587.33, 659.25, 698.46, 783.99, 880.00
    
    # Bass & Drums
    for bar in range(total_bars):
        b_freq = [C3, A2, F2, G2][bar % 4]
        b_time = bar * 4 * beat_dur
        for b in [0, 2]:
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            bass = synth_bass(b_freq, beat_dur * 1.5)
            if idx + len(bass) <= total_samples: track[idx:idx+len(bass)] += bass * 0.45
            
        for b in range(4):
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            if b in [0, 2]:
                k = synth_kick()
                if idx + len(k) <= total_samples: track[idx:idx+len(k)] += k * 0.35
            else:
                sn = synth_snare()
                if idx + len(sn) <= total_samples: track[idx:idx+len(sn)] += sn * 0.25
            for h in [0, 0.5]:
                h_idx = int((b_time + (b + h) * beat_dur) * SAMPLE_RATE)
                hh = synth_hihat()
                if h_idx + len(hh) <= total_samples: track[h_idx:h_idx+len(hh)] += hh * 0.15

    # Sweet Marimba Melody
    melody = [
        (0.0, E5, 0.5), (0.5, G5, 0.5), (1.0, C5, 1.0), (2.0, E5, 0.5), (2.5, D5, 0.5), (3.0, C5, 1.0),
        (4.0, A5, 0.5), (4.5, G5, 0.5), (5.0, E5, 1.0), (6.0, D5, 0.5), (6.5, E5, 0.5), (7.0, C5, 1.0),
        (8.0, F5, 0.5), (8.5, A5, 0.5), (9.0, G5, 1.0), (10.0, E5, 0.5), (10.5, D5, 0.5), (11.0, C5, 1.0),
        (12.0, D5, 0.5), (12.5, E5, 0.5), (13.0, G5, 1.0), (14.0, A5, 1.0), (15.0, G5, 1.0),
        (16.0, E5, 0.5), (16.5, G5, 0.5), (17.0, A5, 1.0), (18.0, G5, 0.5), (18.5, E5, 0.5), (19.0, C5, 1.0),
        (20.0, C5, 0.5), (20.5, D5, 0.5), (21.0, E5, 1.0), (22.0, D5, 0.5), (22.5, C5, 0.5), (23.0, A5, 1.0),
        (24.0, A5, 0.5), (24.5, G5, 0.5), (25.0, F5, 1.0), (26.0, E5, 0.5), (26.5, D5, 0.5), (27.0, E5, 1.0),
        (28.0, G5, 0.5), (28.5, E5, 0.5), (29.0, D5, 0.5), (29.5, C5, 0.5), (30.0, C5, 2.0)
    ]
    for (t_beat, f, d_beat) in melody:
        idx = int(t_beat * beat_dur * SAMPLE_RATE)
        m = synth_marimba(f, d_beat * beat_dur * 1.2)
        if idx + len(m) <= total_samples: track[idx:idx+len(m)] += m * 0.4

    save_wav("assets/audio/bgm/bgm_stage1_pantry.wav", track)

# --- 2. Stage 2: The Sink (อ่างล้างจาน) ---
def make_stage2_sink():
    bpm = 128
    beat_dur = 60.0 / bpm
    total_bars = 8
    total_samples = int(SAMPLE_RATE * beat_dur * 4 * total_bars)
    track = np.zeros(total_samples)
    
    F3, D3, Bb2, C3 = 174.61, 146.83, 116.54, 130.81
    F5, G5, A5, Bb5, C6, D6 = 698.46, 783.99, 880.00, 932.33, 1046.50, 1174.66
    
    for bar in range(total_bars):
        b_freq = [F3, D3, Bb2, C3][bar % 4]
        b_time = bar * 4 * beat_dur
        # Bouncy calypso bass
        for b in [0, 1.5, 2.5, 3.5]:
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            bass = synth_bass(b_freq, beat_dur * 0.8)
            if idx + len(bass) <= total_samples: track[idx:idx+len(bass)] += bass * 0.4
            
        for b in range(4):
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            k = synth_kick()
            if idx + len(k) <= total_samples: track[idx:idx+len(k)] += k * 0.3

    # Steel Drum / Bubble Melody
    melody = [
        (0.0, A5, 0.5), (0.5, C6, 0.5), (1.0, F5, 0.75), (2.0, G5, 0.5), (2.5, A5, 0.5), (3.0, Bb5, 0.75),
        (4.0, D6, 0.5), (4.5, C6, 0.5), (5.0, A5, 0.75), (6.0, G5, 0.5), (6.5, F5, 0.5), (7.0, G5, 0.75),
        (8.0, Bb5, 0.5), (8.5, A5, 0.5), (9.0, F5, 0.75), (10.0, G5, 0.5), (10.5, A5, 0.5), (11.0, C6, 0.75),
        (12.0, D6, 0.5), (12.5, C6, 0.5), (13.0, Bb5, 0.5), (13.5, A5, 0.5), (14.0, G5, 1.0),
        (16.0, C6, 0.5), (16.5, D6, 0.5), (17.0, F5, 0.75), (18.0, G5, 0.5), (18.5, A5, 0.5), (19.0, C6, 0.75),
        (20.0, Bb5, 0.5), (20.5, A5, 0.5), (21.0, G5, 0.75), (22.0, F5, 0.5), (22.5, G5, 0.5), (23.0, A5, 0.75),
        (24.0, D6, 0.5), (24.5, C6, 0.5), (25.0, A5, 0.5), (25.5, G5, 0.5), (26.0, F5, 1.0), (28.0, F5, 2.0)
    ]
    for (t_beat, f, d_beat) in melody:
        idx = int(t_beat * beat_dur * SAMPLE_RATE)
        sd = synth_steeldrum(f, d_beat * beat_dur * 1.3)
        if idx + len(sd) <= total_samples: track[idx:idx+len(sd)] += sd * 0.42

    save_wav("assets/audio/bgm/bgm_stage2_sink.wav", track)

# --- 3. Stage 3: The Stove (เตาไฟ) ---
def make_stage3_stove():
    bpm = 130
    beat_dur = 60.0 / bpm
    total_bars = 8
    total_samples = int(SAMPLE_RATE * beat_dur * 4 * total_bars)
    track = np.zeros(total_samples)
    
    D3, F3, G3, A2 = 146.83, 174.61, 196.00, 110.00
    D5, F5, G5, Ab5, A5, C6, D6 = 587.33, 698.46, 783.99, 830.61, 880.00, 1046.50, 1174.66
    
    for bar in range(total_bars):
        b_freq = [D3, F3, G3, A2][bar % 4]
        b_time = bar * 4 * beat_dur
        # Driving swing bass
        for b in [0, 1, 2, 3]:
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            bass = synth_bass(b_freq, beat_dur * 0.9)
            if idx + len(bass) <= total_samples: track[idx:idx+len(bass)] += bass * 0.45
            
        for b in range(4):
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            if b % 2 == 0:
                k = synth_kick()
                if idx + len(k) <= total_samples: track[idx:idx+len(k)] += k * 0.4
            else:
                sn = synth_snare()
                if idx + len(sn) <= total_samples: track[idx:idx+len(sn)] += sn * 0.35

    # Spicy Sizzling Melody
    melody = [
        (0.0, D5, 0.5), (0.66, F5, 0.5), (1.33, G5, 0.5), (2.0, Ab5, 0.33), (2.33, A5, 0.66), (3.0, D6, 1.0),
        (4.0, C6, 0.66), (4.66, A5, 0.66), (5.33, G5, 0.66), (6.0, F5, 0.66), (6.66, D5, 1.0),
        (8.0, D5, 0.5), (8.66, F5, 0.5), (9.33, G5, 0.5), (10.0, A5, 0.66), (10.66, C6, 0.66), (11.33, D6, 1.0),
        (12.0, D6, 0.33), (12.33, C6, 0.33), (12.66, A5, 0.33), (13.0, G5, 0.66), (14.0, D5, 2.0),
        (16.0, A5, 0.5), (16.66, C6, 0.5), (17.33, D6, 1.0), (18.0, F5, 0.5), (18.66, G5, 0.5), (19.33, A5, 1.0),
        (20.0, G5, 0.33), (20.33, F5, 0.33), (20.66, D5, 0.66), (21.33, C6, 0.66), (22.0, D6, 2.0)
    ]
    for (t_beat, f, d_beat) in melody:
        idx = int(t_beat * beat_dur * SAMPLE_RATE)
        m = synth_marimba(f, d_beat * beat_dur * 1.1)
        if idx + len(m) <= total_samples: track[idx:idx+len(m)] += m * 0.45

    save_wav("assets/audio/bgm/bgm_stage3_stove.wav", track)

# --- 4. Stage 4: The Freezer (ช่องแช่แข็ง) ---
def make_stage4_freezer():
    bpm = 116
    beat_dur = 60.0 / bpm
    total_bars = 8
    total_samples = int(SAMPLE_RATE * beat_dur * 4 * total_bars)
    track = np.zeros(total_samples)
    
    Eb3, C3, Ab2, Bb2 = 155.56, 130.81, 103.83, 116.54
    Eb5, F5, G5, Ab5, Bb5, C6, Eb6 = 622.25, 698.46, 783.99, 830.61, 932.33, 1046.50, 1244.51
    
    for bar in range(total_bars):
        b_freq = [Eb3, C3, Ab2, Bb2][bar % 4]
        b_time = bar * 4 * beat_dur
        for b in [0, 2]:
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            bass = synth_bass(b_freq, beat_dur * 1.8)
            if idx + len(bass) <= total_samples: track[idx:idx+len(bass)] += bass * 0.35

    # Crystalline Celesta Glockenspiel Melody
    melody = [
        (0.0, G5, 1.0), (1.0, Bb5, 1.0), (2.0, Eb6, 1.5), (3.5, D6 := 1174.66, 0.5),
        (4.0, C6, 1.0), (5.0, Bb5, 1.0), (6.0, G5, 2.0),
        (8.0, Ab5, 1.0), (9.0, C6, 1.0), (10.0, Eb6, 1.5), (11.5, C6, 0.5),
        (12.0, Bb5, 1.0), (13.0, G5, 1.0), (14.0, F5, 2.0),
        (16.0, G5, 1.0), (17.0, Bb5, 1.0), (18.0, Eb6, 1.5), (19.5, F5 * 2, 0.5),
        (20.0, Eb6, 1.0), (21.0, C6, 1.0), (22.0, Bb5, 2.0),
        (24.0, Ab5, 0.5), (24.5, Bb5, 0.5), (25.0, C6, 1.0), (26.0, Bb5, 0.5), (26.5, Ab5, 0.5), (27.0, G5, 1.0),
        (28.0, F5, 1.0), (29.0, G5, 1.0), (30.0, Eb5, 2.0)
    ]
    for (t_beat, f, d_beat) in melody:
        idx = int(t_beat * beat_dur * SAMPLE_RATE)
        cel = synth_celesta(f, d_beat * beat_dur * 1.5)
        if idx + len(cel) <= total_samples: track[idx:idx+len(cel)] += cel * 0.45

    save_wav("assets/audio/bgm/bgm_stage4_freezer.wav", track)

# --- 5. Stage 5: The Grand Oven (เตาอบใหญ่) ---
def make_stage5_oven():
    bpm = 138
    beat_dur = 60.0 / bpm
    total_bars = 8
    total_samples = int(SAMPLE_RATE * beat_dur * 4 * total_bars)
    track = np.zeros(total_samples)
    
    C3, Ab2, F2, G2 = 130.81, 103.83, 87.31, 98.00
    C5, D5, Eb5, F5, G5, Ab5, B5, C6 = 523.25, 587.33, 622.25, 698.46, 783.99, 830.61, 987.77, 1046.50
    
    # Dramatic Boss Waltz / Fast Drive
    for bar in range(total_bars):
        b_freq = [C3, Ab2, F2, G2][bar % 4]
        b_time = bar * 4 * beat_dur
        for b in [0, 1, 2, 3]:
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            bass = synth_bass(b_freq, beat_dur * 0.8)
            if idx + len(bass) <= total_samples: track[idx:idx+len(bass)] += bass * 0.5
            
        for b in range(4):
            idx = int((b_time + b * beat_dur) * SAMPLE_RATE)
            k = synth_kick()
            if idx + len(k) <= total_samples: track[idx:idx+len(k)] += k * 0.45
            sn = synth_snare()
            if idx + int(0.5 * beat_dur * SAMPLE_RATE) + len(sn) <= total_samples:
                track[idx + int(0.5 * beat_dur * SAMPLE_RATE) : idx + int(0.5 * beat_dur * SAMPLE_RATE) + len(sn)] += sn * 0.3

    # Cursed Chef Organ & Fast Gothic Harpsichord Melody
    melody = [
        (0.0, C5, 0.5), (0.5, Eb5, 0.5), (1.0, G5, 1.0), (2.0, Ab5, 0.5), (2.5, G5, 0.5), (3.0, Eb5, 1.0),
        (4.0, C5, 0.5), (4.5, D5, 0.5), (5.0, Eb5, 1.0), (6.0, F5, 0.5), (6.5, Eb5, 0.5), (7.0, D5, 1.0),
        (8.0, C5, 0.5), (8.5, Eb5, 0.5), (9.0, G5, 1.0), (10.0, C6, 1.0), (11.0, B5, 1.0),
        (12.0, Ab5, 0.5), (12.5, G5, 0.5), (13.0, F5, 1.0), (14.0, Eb5, 0.5), (14.5, D5, 0.5), (15.0, C5, 1.0),
        (16.0, C6, 0.5), (16.5, G5, 0.5), (17.0, Eb5, 1.0), (18.0, Ab5, 0.5), (18.5, G5, 0.5), (19.0, Eb5, 1.0),
        (20.0, D5, 0.5), (20.5, Eb5, 0.5), (21.0, F5, 1.0), (22.0, G5, 0.5), (22.5, Ab5, 0.5), (23.0, B5, 1.0),
        (24.0, C6, 2.0), (28.0, C5, 2.0)
    ]
    for (t_beat, f, d_beat) in melody:
        idx = int(t_beat * beat_dur * SAMPLE_RATE)
        org = synth_organ(f, d_beat * beat_dur * 1.2)
        if idx + len(org) <= total_samples: track[idx:idx+len(org)] += org * 0.48

    save_wav("assets/audio/bgm/bgm_stage5_oven.wav", track)

def main():
    print("Synthesizing 5 Distinct Stage BGM Soundtracks...")
    make_stage1_pantry()
    make_stage2_sink()
    make_stage3_stove()
    make_stage4_freezer()
    make_stage5_oven()
    print("\nAll 5 Stage BGM Soundtracks completed successfully!")

if __name__ == "__main__":
    main()
