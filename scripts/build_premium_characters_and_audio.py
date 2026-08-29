import math
import os
import wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

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

# ==============================================================================
# 1. ADVANCED 2.5D CHARACTER RENDERER (Studio Quality)
# ==============================================================================

def render_master_25d_mochi(
    char_type="strawberry",
    action="idle",
    t_val=0.0,
    size=(512, 512)
):
    """
    Renders a high-end 2.5D chibi mochi character with subsurface scattering (SSS),
    volumetric ambient occlusion, specular rim lighting, glossy eye gradients, and organic physics.
    """
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx = size[0] // 2
    base_cy = size[1] // 2 + 25
    
    # Dynamics & Physics Deformations
    sx, sy, dy = 1.0, 1.0, 0
    rot = 0
    eye_look = 0.0
    blink = 0.0
    
    if action == "idle":
        sx = 1.0 + 0.04 * math.sin(t_val * math.pi * 2)
        sy = 1.0 - 0.04 * math.sin(t_val * math.pi * 2)
        dy = int(4 * math.sin(t_val * math.pi * 2))
        eye_look = 0.15 * math.sin(t_val * math.pi * 2)
    elif action == "hop_up":
        prog = t_val
        sx = 0.85 - 0.05 * prog
        sy = 1.18 + 0.10 * prog
        dy = -int(45 * math.sin(prog * math.pi * 0.5))
    elif action == "peak_air":
        sx = 1.04 + 0.02 * math.sin(t_val * math.pi * 2)
        sy = 0.98 - 0.02 * math.sin(t_val * math.pi * 2)
        dy = -48 + int(6 * math.sin(t_val * math.pi * 2))
        rot = int(6 * math.sin(t_val * math.pi * 2))
    elif action == "squash_land":
        if t_val < 0.3:
            sx, sy, dy = 0.9, 1.12, -18
        elif t_val < 0.6: # Maximum impact squash
            sx, sy, dy = 1.30, 0.70, 14
            blink = 1.0
        else: # Rebound
            sx, sy, dy = 1.08, 0.94, 4
    elif action == "dash":
        sx, sy, dy = 1.18, 0.88, -6
        rot = -int(t_val * 360)
    elif action == "cast":
        sx = 1.08 + 0.04 * math.sin(t_val * math.pi * 2)
        sy = 1.08 + 0.04 * math.sin(t_val * math.pi * 2)
        dy = -15 + int(8 * math.sin(t_val * math.pi * 2))
        rot = int(8 * math.sin(t_val * math.pi * 2))

    # Ground Contact Drop Shadow
    shadow_w = int(62 * sx * (1.0 - abs(dy) / 120.0))
    shadow_h = int(20 * sx * (1.0 - abs(dy) / 120.0))
    shadow_alpha = int(100 * (1.0 - abs(dy) / 140.0))
    if shadow_w > 2 and shadow_h > 2 and shadow_alpha > 0:
        s_layer = Image.new("RGBA", size, (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(s_layer)
        s_box = [cx - shadow_w, base_cy + 42 - shadow_h // 2, cx + shadow_w, base_cy + 42 + shadow_h // 2]
        s_draw.ellipse(s_box, fill=(35, 18, 42, shadow_alpha))
        s_layer = s_layer.filter(ImageFilter.GaussianBlur(radius=6))
        img = Image.alpha_composite(img, s_layer)
        draw = ImageDraw.Draw(img)

    # Color Palette Specifications (ART_BIBLE Master Colors)
    if char_type == "strawberry":
        base_c = (255, 133, 179)       # #FF85B3
        inner_sss = (255, 205, 230)
        shadow_c = (210, 85, 135)
        rim_c = (255, 245, 250)
        topping_c = (60, 200, 110)     # Strawberry leaf
        topping_dark = (30, 120, 60)
    elif char_type == "mint":
        base_c = (102, 211, 179)       # #66D3B3
        inner_sss = (195, 248, 232)
        shadow_c = (45, 150, 125)
        rim_c = (235, 255, 250)
        topping_c = (45, 185, 110)
        topping_dark = (20, 105, 55)
    else: # chocolate
        base_c = (145, 82, 60)         # Warm milk chocolate
        inner_sss = (195, 135, 110)
        shadow_c = (85, 40, 28)
        rim_c = (245, 200, 170)
        topping_c = (235, 45, 75)
        topping_dark = (140, 18, 38)

    # Body Dimension Parameters (Proportional fit)
    body_y = base_cy + dy
    rx = int(68 * sx)
    ry = int(60 * sy)
    
    # 1. Base Shape with Deep Border Outline (Dark warm silhouette)
    draw.ellipse([cx - rx - 4, body_y - ry - 4, cx + rx + 4, body_y + ry + 4], fill=shadow_c)
    
    # 2. Main Body Gradient Fill
    draw.ellipse([cx - rx, body_y - ry, cx + rx, body_y + ry], fill=base_c)
    
    # 3. Subsurface Scattering (SSS) Center Core Glow
    sss_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    sss_draw = ImageDraw.Draw(sss_layer)
    sss_rx = int(rx * 0.75)
    sss_ry = int(ry * 0.70)
    sss_cy = body_y - int(ry * 0.1)
    sss_draw.ellipse([cx - sss_rx, sss_cy - sss_ry, cx + sss_rx, sss_cy + sss_ry], fill=(*inner_sss, 220))
    sss_layer = sss_layer.filter(ImageFilter.GaussianBlur(radius=20))
    img = Image.alpha_composite(img, sss_layer)
    draw = ImageDraw.Draw(img)

    # 4. Volumetric Ambient Occlusion (Bottom Shadow & Rim Curve)
    ao_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    ao_draw = ImageDraw.Draw(ao_layer)
    ao_box = [cx - int(rx * 0.92), body_y + int(ry * 0.15), cx + int(rx * 0.92), body_y + ry + 2]
    ao_draw.chord(ao_box, start=0, end=180, fill=(*shadow_c, 210))
    ao_layer = ao_layer.filter(ImageFilter.GaussianBlur(radius=8))
    img = Image.alpha_composite(img, ao_layer)
    draw = ImageDraw.Draw(img)

    # 5. Top Specular Glass/Jelly Gloss
    gloss_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gloss_layer)
    gl_cx = cx - int(rx * 0.32)
    gl_cy = body_y - int(ry * 0.38)
    gl_rx = int(rx * 0.45)
    gl_ry = int(ry * 0.32)
    g_draw.ellipse([gl_cx - gl_rx, gl_cy - gl_ry, gl_cx + gl_rx, gl_cy + gl_ry], fill=(*rim_c, 180))
    # Hotspot
    g_draw.ellipse([gl_cx - int(gl_rx * 0.4), gl_cy - int(gl_ry * 0.4), gl_cx + int(gl_rx * 0.4), gl_cy + int(gl_ry * 0.4)], fill=(255, 255, 255, 245))
    gloss_layer = gloss_layer.filter(ImageFilter.GaussianBlur(radius=10))
    img = Image.alpha_composite(img, gloss_layer)
    draw = ImageDraw.Draw(img)

    # 6. Chocolate Fudge Drips (For Chocolate Mochi)
    if char_type == "chocolate":
        fudge_layer = Image.new("RGBA", size, (0, 0, 0, 0))
        f_draw = ImageDraw.Draw(fudge_layer)
        # Ganache cap
        f_draw.chord([cx - rx, body_y - ry, cx + rx, body_y - int(ry * 0.05)], start=180, end=360, fill=(50, 20, 15, 255))
        # Drip tails
        drips = [(-0.55, 0.35, 22), (-0.15, 0.42, 28), (0.25, 0.30, 20), (0.60, 0.22, 16)]
        for dx_pct, dy_pct, d_rad in drips:
            dx_pos = cx + int(rx * dx_pct)
            dy_pos = body_y + int(ry * dy_pct)
            f_draw.ellipse([dx_pos - d_rad, dy_pos - d_rad, dx_pos + d_rad, dy_pos + d_rad], fill=(50, 20, 15, 255))
            f_draw.polygon([(dx_pos - d_rad, body_y - int(ry * 0.1)), (dx_pos + d_rad, body_y - int(ry * 0.1)), (dx_pos, dy_pos)], fill=(50, 20, 15, 255))
            # Drip highlight
            f_draw.ellipse([dx_pos - 6, dy_pos - 10, dx_pos + 2, dy_pos - 2], fill=(140, 75, 55, 220))
        img = Image.alpha_composite(img, fudge_layer)
        draw = ImageDraw.Draw(img)

    # 7. Cute Chubby 2.5D Stubs/Hands
    h_y = body_y + int(ry * 0.25)
    h_rx = int(12 * sx)
    h_ry = int(14 * sy)
    if action == "cast":
        draw.ellipse([cx - rx - 5, body_y - 22, cx - rx + 15, body_y - 2], fill=base_c, outline=shadow_c, width=2)
        draw.ellipse([cx + rx - 15, body_y - 22, cx + rx + 5, body_y - 2], fill=base_c, outline=shadow_c, width=2)
    else:
        draw.ellipse([cx - rx - 4, h_y - h_ry, cx - rx + h_rx, h_y + h_ry], fill=base_c, outline=shadow_c, width=2)
        draw.ellipse([cx + rx - h_rx, h_y - h_ry, cx + rx + 4, h_y + h_ry], fill=base_c, outline=shadow_c, width=2)

    # 8. High-Definition Kawaii Anime Eyes & Expression
    face_y = body_y + int(ry * 0.12)
    eye_spacing = int(26 * sx)
    eye_w = int(10 * min(sx, sy))
    eye_h = int(13 * min(sx, sy))
    
    # Soft Pink Blush with Star/Heart Sparkle
    b_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(b_layer)
    b_draw.ellipse([cx - eye_spacing - 18, face_y + 6, cx - eye_spacing - 2, face_y + 18], fill=(255, 80, 130, 160))
    b_draw.ellipse([cx + eye_spacing + 2, face_y + 6, cx + eye_spacing + 18, face_y + 18], fill=(255, 80, 130, 160))
    b_layer = b_layer.filter(ImageFilter.GaussianBlur(radius=3))
    img = Image.alpha_composite(img, b_layer)
    draw = ImageDraw.Draw(img)

    if blink < 0.5:
        # High-def Gradient Anime Eyes
        for sign in (-1, 1):
            ex = cx + sign * eye_spacing + int(eye_look * 4)
            ey = face_y
            # 1. Dark Iris Base
            draw.ellipse([ex - eye_w, ey - eye_h, ex + eye_w, ey + eye_h], fill=(30, 15, 28, 255))
            # 2. Cyan/Violet Inner Iris Gradient
            draw.ellipse([ex - int(eye_w * 0.8), ey - int(eye_h * 0.2), ex + int(eye_w * 0.8), ey + int(eye_h * 0.85)], fill=(65, 140, 200, 240))
            # 3. Big Specular Catchlight
            draw.ellipse([ex - int(eye_w * 0.6), ey - int(eye_h * 0.75), ex + int(eye_w * 0.15), ey - int(eye_h * 0.1)], fill=(255, 255, 255, 255))
            # 4. Tiny Secondary Twinkle
            draw.ellipse([ex + int(eye_w * 0.15), ey + int(eye_h * 0.25), ex + int(eye_w * 0.6), ey + int(eye_h * 0.6)], fill=(255, 255, 255, 230))
        # Sweet Smile Mouth
        draw.arc([cx - 8, face_y + 2, cx + 8, face_y + 13], start=25, end=155, fill=(40, 15, 25, 255), width=3)
    else:
        # Joyful Wink ^^
        for sign in (-1, 1):
            ex = cx + sign * eye_spacing
            draw.arc([ex - eye_w, face_y - 5, ex + eye_w, face_y + 7], start=200, end=340, fill=(40, 15, 25, 255), width=3)
        draw.chord([cx - 7, face_y + 4, cx + 7, face_y + 15], start=0, end=180, fill=(230, 50, 85, 255), outline=(40, 15, 25, 255), width=2)

    # 9. 2.5D Master Head Accessory / Topping
    head_y = body_y - ry + 4
    if char_type == "strawberry":
        # 3D Strawberry Leaves & Wooden Stem
        draw.line([cx, head_y - 6, cx + 2, head_y - 21], fill=topping_dark, width=5)
        draw.line([cx - 1, head_y - 6, cx + 1, head_y - 21], fill=topping_c, width=3)
        for ang in (-48, 0, 48):
            rad = math.radians(ang)
            lx = cx + int(18 * math.sin(rad))
            ly = head_y - 6 - int(12 * math.cos(rad))
            draw.ellipse([lx - 8, ly - 6, lx + 8, ly + 6], fill=topping_c, outline=topping_dark, width=2)
            draw.ellipse([lx - 4, ly - 3, lx + 4, ly + 3], fill=(160, 245, 180, 255))
    elif char_type == "mint":
        draw.ellipse([cx - 19, head_y - 16, cx + 3, head_y + 2], fill=topping_c, outline=topping_dark, width=2)
        draw.ellipse([cx - 3, head_y - 19, cx + 19, head_y - 1], fill=topping_c, outline=topping_dark, width=2)
        draw.ellipse([cx + 3, head_y - 17, cx + 9, head_y - 11], fill=(255, 255, 255, 245))
    else: # chocolate
        draw.chord([cx - 16, head_y - 18, cx + 16, head_y + 4], start=180, end=360, fill=(255, 250, 245, 255), outline=(190, 170, 160, 255), width=2)
        draw.ellipse([cx - 7, head_y - 26, cx + 9, head_y - 10], fill=topping_c, outline=topping_dark, width=2)
        draw.arc([cx + 1, head_y - 35, cx + 14, head_y - 21], start=110, end=210, fill=(90, 150, 70, 255), width=2)

    return img

def build_character_master_suite(char_type, base_name):
    # 1. High-Res 2.5D Master Hero Portrait (512x512)
    master = render_master_25d_mochi(char_type=char_type, action="idle", t_val=0.0, size=(512, 512))
    master_path = f"assets/characters/{base_name}_25d.png"
    master.save(master_path)
    print(f"[ART] Saved Master 2.5D Avatar: {master_path}")
    
    # 2. Complete 24-Frame Spritesheet (6 Actions x 4 Columns)
    actions = ["idle", "hop_up", "peak_air", "squash_land", "dash", "cast"]
    cols = 4
    rows = len(actions)
    frame_sz = 256
    
    sheet = Image.new("RGBA", (cols * frame_sz, rows * frame_sz), (0, 0, 0, 0))
    anim_frames = []
    
    for r_idx, act in enumerate(actions):
        for c_idx in range(cols):
            t = c_idx / float(cols)
            f_img = render_master_25d_mochi(char_type=char_type, action=act, t_val=t, size=(frame_sz, frame_sz))
            sheet.paste(f_img, (c_idx * frame_sz, r_idx * frame_sz), f_img)
            if act in ["idle", "hop_up", "peak_air", "squash_land"]:
                anim_frames.append(f_img)

    sheet_path = f"assets/characters/{base_name}_anim_sheet.png"
    sheet.save(sheet_path)
    print(f"[ART] Saved Spritesheet: {sheet_path}")
    
    # 3. Animated GIF Loop
    gif_path = f"assets/characters/{base_name}_anim.gif"
    if anim_frames:
        anim_frames[0].save(
            gif_path,
            save_all=True,
            append_images=anim_frames[1:],
            duration=100,
            loop=0,
            disposal=2
        )
        print(f"[ART] Saved Animated GIF: {gif_path}")


# ==============================================================================
# 2. STUDIO SOUNDTRACK & SFX SYNTHESIZER (Lush Pop-Jazz & Modern Audio)
# ==============================================================================

def synth_rhodes_epiano(freq, duration):
    """Warm Rhodes electric piano with rich bell overtones and gentle tremolo."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    tremolo = 1.0 + 0.15 * np.sin(2 * np.pi * 5.5 * t)
    env = np.exp(-t * 2.8) * np.minimum(1.0, t * 80.0)
    # Fundamental + tine overtones (approx 4x and 8x with decay)
    tone = (
        np.sin(2 * np.pi * freq * t) * 0.65 +
        np.sin(2 * np.pi * freq * 2.0 * t) * 0.20 +
        np.sin(2 * np.pi * freq * 4.0 * t) * 0.12 * np.exp(-t * 8.0) +
        np.sin(2 * np.pi * freq * 8.0 * t) * 0.05 * np.exp(-t * 18.0)
    )
    return tone * env * tremolo

def synth_acoustic_marimba(freq, duration):
    """Organic wooden marimba with acoustic resonance box."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 12.0)
    body = (
        np.sin(2 * np.pi * freq * t) * 0.72 +
        np.sin(2 * np.pi * freq * 3.82 * t) * 0.22 +
        np.sin(2 * np.pi * freq * 9.2 * t) * 0.06 * np.exp(-t * 25.0)
    )
    mallet = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 140.0) * 0.28
    return (body + mallet) * env

def synth_funky_bass(freq, duration):
    """Punchy synth bass with analog warmth and sub-harmonic."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    env = np.exp(-t * 3.8)
    sub = np.sin(2 * np.pi * (freq * 0.5) * t) * 0.35
    fund = np.sin(2 * np.pi * freq * t) * 0.75
    harm = np.sin(2 * np.pi * (freq * 2.0) * t) * 0.18
    return (sub + fund + harm) * env

def synth_studio_drums(beat_type="kick"):
    """Punchy studio drums."""
    if beat_type == "kick":
        dur = 0.18
        t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
        pitch = 180 * np.exp(-t * 36.0) + 42
        phase = 2 * np.pi * np.cumsum(pitch) / SAMPLE_RATE
        return np.sin(phase) * np.exp(-t * 15.0) * 0.7
    elif beat_type == "snare":
        dur = 0.20
        t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
        body = np.sin(2 * np.pi * 210 * t) * np.exp(-t * 28.0) * 0.4
        noise = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 16.0) * 0.6
        return (body + noise) * 0.5
    elif beat_type == "shaker":
        dur = 0.08
        t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
        return np.random.uniform(-1, 1, len(t)) * np.exp(-t * 45.0) * 0.18

def generate_master_bgm_soundtrack():
    print("\n[AUDIO] Generating Master Pop-Jazz BGM Soundtrack...")
    bpm = 120
    beat_sec = 60.0 / bpm # 0.5s
    bar_sec = beat_sec * 4 # 2.0s
    total_bars = 8
    total_samples = int(SAMPLE_RATE * bar_sec * total_bars)
    
    master_bgm = np.zeros(total_samples)
    
    # Sophisticated Pop-Jazz Chord Progression (Lush Harmonization):
    # Bar 1: Cmaj9    (C - E - G - B - D)
    # Bar 2: Am11     (A - C - E - G - D)
    # Bar 3: Dm9      (D - F - A - C - E)
    # Bar 4: G13      (G - B - F - A - E)
    # Bar 5: Em7      (E - G - B - D)
    # Bar 6: A7(b13)  (A - C# - G - F)
    # Bar 7: Dm7      (D - F - A - C)
    # Bar 8: G7sus4->G7 (G - C - D - F -> G - B - D - F)
    
    chord_progression = [
        # (Bass freq, [Chord note freqs])
        (130.81, [261.63, 329.63, 392.00, 493.88, 587.33]), # Cmaj9
        (110.00, [220.00, 261.63, 329.63, 392.00, 587.33]), # Am11
        (146.83, [293.66, 349.23, 440.00, 523.25, 659.25]), # Dm9
        (98.00,  [196.00, 246.94, 349.23, 440.00, 659.25]), # G13
        (164.81, [329.63, 392.00, 493.88, 587.33]),          # Em7
        (110.00, [220.00, 277.18, 392.00, 349.23]),          # A7b13
        (146.83, [293.66, 349.23, 440.00, 523.25]),          # Dm7
        (98.00,  [196.00, 261.63, 293.66, 349.23, 246.94])  # G7sus
    ]
    
    # 1. Render E-Piano Chords & Funky Bass
    for bar_idx, (b_freq, chord_notes) in enumerate(chord_progression):
        b_time = bar_idx * bar_sec
        # E-Piano Lush Chords (laid back syncopation)
        for chord_hit in [0.0, 1.5, 3.0]:
            hit_time = b_time + chord_hit * beat_sec
            hit_idx = int(hit_time * SAMPLE_RATE)
            chord_dur = beat_sec * 1.8
            for n_f in chord_notes:
                ep_tone = synth_rhodes_epiano(n_f, chord_dur)
                if hit_idx + len(ep_tone) <= total_samples:
                    master_bgm[hit_idx:hit_idx+len(ep_tone)] += ep_tone * 0.12
                    
        # Funky Bass Line
        bass_patterns = [0.0, 1.0, 2.0, 2.75, 3.5]
        for bp in bass_patterns:
            bp_time = b_time + bp * beat_sec
            bp_idx = int(bp_time * SAMPLE_RATE)
            bass_w = synth_funky_bass(b_freq if bp < 2.5 else b_freq * 1.25, beat_sec * 0.9)
            if bp_idx + len(bass_w) <= total_samples:
                master_bgm[bp_idx:bp_idx+len(bass_w)] += bass_w * 0.38

        # Studio Drums Groove
        for beat in range(4):
            t_sec = b_time + beat * beat_sec
            idx = int(t_sec * SAMPLE_RATE)
            if beat in [0, 2]:
                kick = synth_studio_drums("kick")
                if idx + len(kick) <= total_samples: master_bgm[idx:idx+len(kick)] += kick * 0.45
            else:
                sn = synth_studio_drums("snare")
                if idx + len(sn) <= total_samples: master_bgm[idx:idx+len(sn)] += sn * 0.38
            # 16th-note Shakers
            for sub_b in [0, 0.25, 0.5, 0.75]:
                s_idx = int((t_sec + sub_b * beat_sec) * SAMPLE_RATE)
                shk = synth_studio_drums("shaker")
                if s_idx + len(shk) <= total_samples: master_bgm[s_idx:s_idx+len(shk)] += shk * 0.16

    # 2. Catchy Acoustic Marimba Lead Melody
    C5, D5, E5, F5, G5, A5, B5 = 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77
    C6, D6, E6 = 1046.50, 1174.66, 1318.50
    
    lead_melody = [
        # Bar 1 (Cmaj9)
        (0.0, E5, 0.75), (0.75, G5, 0.75), (1.5, B5, 0.5), (2.0, D6, 1.0), (3.0, C6, 1.0),
        # Bar 2 (Am11)
        (4.0, A5, 0.5), (4.5, C6, 0.5), (5.0, E6, 1.0), (6.0, D6, 0.5), (6.5, C6, 0.5), (7.0, A5, 1.0),
        # Bar 3 (Dm9)
        (8.0, F5, 0.5), (8.5, A5, 0.5), (9.0, C6, 0.75), (10.0, E6, 0.75), (11.0, D6, 1.0),
        # Bar 4 (G13)
        (12.0, B5, 0.5), (12.5, G5, 0.5), (13.0, E5, 0.5), (13.5, D5, 0.5), (14.0, C5, 2.0),
        # Bar 5 (Em7)
        (16.0, G5, 0.75), (16.75, B5, 0.75), (17.5, D6, 0.5), (18.0, E6, 1.0), (19.0, D6, 1.0),
        # Bar 6 (A7b13)
        (20.0, C6, 0.5), (20.5, B5, 0.5), (21.0, A5, 1.0), (22.0, F5, 0.5), (22.5, G5, 0.5), (23.0, A5, 1.0),
        # Bar 7 (Dm7)
        (24.0, D5, 0.5), (24.5, F5, 0.5), (25.0, A5, 0.75), (25.75, C6, 0.75), (26.5, E6, 0.5), (27.0, D6, 1.0),
        # Bar 8 (G7sus)
        (28.0, C6, 0.5), (28.5, B5, 0.5), (29.0, A5, 0.5), (29.5, G5, 0.5), (30.0, C5, 2.0)
    ]
    
    for (t_b, freq, dur_b) in lead_melody:
        idx = int(t_b * beat_sec * SAMPLE_RATE)
        m_lead = synth_acoustic_marimba(freq, dur_b * beat_sec * 1.25)
        if idx + len(m_lead) <= total_samples:
            master_bgm[idx:idx+len(m_lead)] += m_lead * 0.42

    # Save Master BGM
    save_wav("assets/audio/bgm/bgm_main_theme.wav", master_bgm)
    save_wav("assets/audio/bgm/bgm_stage1_pantry.wav", master_bgm)
    print("[AUDIO] Master BGM Soundtrack created successfully!")


# ==============================================================================
# 3. HIGH-IMPACT TACTILE SFX UPGRADE
# ==============================================================================

def generate_master_sfx():
    print("\n[AUDIO] Generating Master Tactile SFX Suite...")
    
    # 1. Juicy Organic Squish Jump
    t = np.linspace(0, 0.24, int(SAMPLE_RATE * 0.24), False)
    pitch = 240 + 620 * np.exp(-t * 22.0) + 140 * np.sin(t * 90.0)
    phase = 2 * np.pi * np.cumsum(pitch) / SAMPLE_RATE
    thump = np.sin(2 * np.pi * 95 * t) * np.exp(-t * 35.0) * 0.45
    sfx_squish = (np.sin(phase) * 0.7 + thump) * np.sin(np.pi * t / 0.24) ** 1.2
    save_wav("assets/audio/sfx/sfx_jump_squish.wav", sfx_squish)

    # 2. Crystal Glass Shimmer (Coin / Sugar Pickup)
    notes = [1567.98, 1975.53, 2349.32, 3135.96] # G6, B6, D7, G7
    s_pickup = np.zeros(int(SAMPLE_RATE * 0.48))
    for i, freq in enumerate(notes):
        st = int(i * 0.055 * SAMPLE_RATE)
        t_n = np.linspace(0, 0.26, int(SAMPLE_RATE * 0.26), False)
        env = np.exp(-t_n * 15.0)
        shimmer = (np.sin(2 * np.pi * freq * t_n) * 0.6 + np.sin(2 * np.pi * freq * 2.75 * t_n) * 0.35 + np.sin(2 * np.pi * freq * 5.2 * t_n) * 0.15) * env
        s_pickup[st:st+len(shimmer)] += shimmer
    save_wav("assets/audio/sfx/sfx_pickup_sugar.wav", s_pickup)

    # 3. Heavy Punchy Monster Hit
    t = np.linspace(0, 0.16, int(SAMPLE_RATE * 0.16), False)
    sub = np.sin(2 * np.pi * 85 * t) * np.exp(-t * 22.0) * 0.6
    transient = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 70.0) * 0.4
    save_wav("assets/audio/sfx/sfx_hit_monster.wav", sub + transient)

    # 4. Cinematic Sugar Bomb Explosion
    t = np.linspace(0, 0.95, int(SAMPLE_RATE * 0.95), False)
    sub_boom = np.sin(2 * np.pi * (75 * np.exp(-t * 5.0) + 30) * t) * np.exp(-t * 3.5) * 0.7
    debris = np.random.uniform(-0.7, 0.7, len(t)) * np.exp(-t * 5.0) * 0.3
    sparkle = np.sin(2 * np.pi * 1760 * t) * np.exp(-t * 6.0) * 0.25
    save_wav("assets/audio/sfx/sfx_ult_sugarbomb.wav", sub_boom + debris + sparkle)

    # 5. Grand Level-Up Fanfare
    fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.50, 1567.98]
    s_lvl = np.zeros(int(SAMPLE_RATE * 0.95))
    for i, f in enumerate(fanfare):
        st = int(i * 0.085 * SAMPLE_RATE)
        dur = 0.42 if i == len(fanfare) - 1 else 0.18
        t_n = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
        env = np.exp(-t_n * (5.5 if i == len(fanfare)-1 else 13.0))
        tone = (np.sin(2 * np.pi * f * t_n) * 0.55 + np.sin(2 * np.pi * f * 2.0 * t_n) * 0.3 + np.sin(2 * np.pi * f * 3.0 * t_n) * 0.15) * env
        s_lvl[st:st+len(tone)] += tone
    save_wav("assets/audio/sfx/sfx_levelup_fanfare.wav", s_lvl)


def main():
    print("==========================================================")
    print("STARTING COMPLETE STUDIO-QUALITY RE-MASTER (ART + AUDIO)")
    print("==========================================================")
    
    # 1. 2.5D Characters
    characters = [
        ("strawberry", "mochi_strawberry"),
        ("mint", "mochi_mint"),
        ("chocolate", "mochi_chocolate"),
    ]
    for c_type, b_name in characters:
        build_character_master_suite(c_type, b_name)

    # 2. Audio & BGM
    generate_master_bgm_soundtrack()
    generate_master_sfx()
    
    print("\n[SUCCESS] All Art and Audio upgraded to Professional Studio Quality!")

if __name__ == "__main__":
    main()
