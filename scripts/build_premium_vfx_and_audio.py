import os
import math
import struct
import wave
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------
ASSETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets'))
VFX_DIR = os.path.join(ASSETS_DIR, 'vfx')
AUDIO_DIR = os.path.join(ASSETS_DIR, 'audio')

os.makedirs(VFX_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

FRAMES = 24
CANVAS_SIZE = 512

VFX_CONFIGS = {
    'vfx_chili_nova': {'type': 'explosion', 'color': 'red', 'sfx': 'fire_blast'},
    'vfx_frost_pulse': {'type': 'explosion', 'color': 'blue', 'sfx': 'ice_shatter'},
    'vfx_ult_sugarbomb': {'type': 'explosion', 'color': 'pink', 'sfx': 'magic_boom'},
    'vfx_ult_cocoavortex': {'type': 'vortex', 'color': 'purple', 'sfx': 'dark_succ'},
    'vfx_telegraph_hazard': {'type': 'pulse', 'color': 'red', 'sfx': 'warning_beep'},
    'vfx_proj_donut': {'type': 'projectile', 'color': 'pink', 'sfx': 'sweet_throw'}
}

# ---------------------------------------------------------
# Audio Synthesis (Premium SFX)
# ---------------------------------------------------------
def save_wav(filename, audio_data, sample_rate=44100):
    audio_data = np.int16(audio_data * 32767)
    with wave.open(filename, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        w.writeframes(audio_data.tobytes())

def generate_sfx(sfx_type):
    sample_rate = 44100
    t = np.linspace(0, 1.0, int(sample_rate * 1.0), False)
    
    if sfx_type == 'fire_blast':
        # Noise burst with low pass filter sweeping down
        noise = np.random.uniform(-1, 1, len(t))
        env = np.exp(-t * 8)
        audio = noise * env * 0.8
    elif sfx_type == 'ice_shatter':
        # High pitched noise with fast decay
        noise = np.random.uniform(-1, 1, len(t))
        env = np.exp(-t * 20)
        audio = noise * env
        # add some tonal ping
        ping = np.sin(2 * np.pi * 4000 * t) * np.exp(-t * 15)
        audio += ping * 0.5
    elif sfx_type == 'magic_boom':
        # Sub bass drop with noise
        freq = np.linspace(200, 20, len(t))
        sub = np.sin(2 * np.pi * freq * t)
        env = np.exp(-t * 4)
        noise = np.random.uniform(-0.5, 0.5, len(t)) * np.exp(-t * 10)
        audio = (sub + noise) * env
    elif sfx_type == 'dark_succ':
        # Reverse sounding sweeping up
        freq = np.linspace(50, 400, len(t))
        sub = np.sin(2 * np.pi * freq * t)
        env = t ** 2 # ease in
        audio = sub * env
    elif sfx_type == 'warning_beep':
        # Square wave pulse
        freq = 800
        wave_sig = np.sign(np.sin(2 * np.pi * freq * t))
        env = (np.sin(2 * np.pi * 4 * t) > 0).astype(float) * np.exp(-t * 2)
        audio = wave_sig * env * 0.5
    elif sfx_type == 'sweet_throw':
        # High pitch sweep up
        freq = np.linspace(800, 1200, len(t))
        audio = np.sin(2 * np.pi * freq * t) * np.exp(-t * 8) * 0.7
    else:
        audio = np.zeros_like(t)

    # Normalize
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val * 0.9
        
    return audio

# ---------------------------------------------------------
# Image Processing (VFX Animation)
# ---------------------------------------------------------
def ease_out_quad(x):
    return 1 - (1 - x) * (1 - x)

def apply_bloom(img, radius=10, intensity=1.5):
    bloom = img.filter(ImageFilter.GaussianBlur(radius))
    # Simple additive blend
    out = Image.new('RGBA', img.size)
    img_data = np.array(img, dtype=np.float32)
    bloom_data = np.array(bloom, dtype=np.float32)
    
    alpha = img_data[:,:,3:] / 255.0
    bloom_alpha = bloom_data[:,:,3:] / 255.0
    
    # Fake additive for RGB
    rgb = np.clip(img_data[:,:,:3] + bloom_data[:,:,:3] * intensity, 0, 255)
    
    # Combine alpha
    final_alpha = np.clip(img_data[:,:,3] + bloom_data[:,:,3]*intensity, 0, 255)
    
    result = np.zeros_like(img_data, dtype=np.uint8)
    result[:,:,:3] = rgb
    result[:,:,3] = final_alpha
    return Image.fromarray(result)

def process_vfx(key, config):
    base_path = os.path.join(VFX_DIR, f"{key}.png")
    if not os.path.exists(base_path):
        print(f"Warning: {base_path} not found. Skipping.")
        return

    try:
        base_img = Image.open(base_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening {base_path}: {e}")
        return
        
    # Resize base to fit well within canvas
    base_img.thumbnail((CANVAS_SIZE//2, CANVAS_SIZE//2), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(FRAMES):
        t = i / float(FRAMES - 1)
        
        frame = Image.new('RGBA', (CANVAS_SIZE, CANVAS_SIZE), (0,0,0,0))
        
        # Calculate transform
        if config['type'] == 'explosion':
            scale = 0.1 + 1.4 * ease_out_quad(t)
            opacity = 1.0 if t < 0.7 else (1.0 - (t - 0.7) / 0.3)
            rotation = t * 90
        elif config['type'] == 'vortex':
            scale = 1.0 + 0.1 * math.sin(t * math.pi * 2)
            opacity = 1.0
            rotation = t * 360
        elif config['type'] == 'pulse':
            scale = 1.0
            opacity = 0.5 + 0.5 * math.sin(t * math.pi * 4)
            rotation = 0
        elif config['type'] == 'projectile':
            # move from right to left
            scale = 1.0
            opacity = 1.0
            rotation = t * -360
        else:
            scale = 1.0
            opacity = 1.0
            rotation = 0
            
        # Apply transform
        w, h = base_img.size
        new_w, new_h = int(w * scale), int(h * scale)
        if new_w > 0 and new_h > 0:
            transformed = base_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            transformed = transformed.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
            
            # Apply opacity
            if opacity < 1.0:
                alpha = transformed.split()[3]
                alpha = alpha.point(lambda p: int(p * opacity))
                transformed.putalpha(alpha)
                
            # Paste onto canvas
            paste_x = (CANVAS_SIZE - transformed.width) // 2
            paste_y = (CANVAS_SIZE - transformed.height) // 2
            
            if config['type'] == 'projectile':
                paste_x = int(CANVAS_SIZE - (t * CANVAS_SIZE)) - transformed.width//2
                
            frame.paste(transformed, (paste_x, paste_y), transformed)
            
        # Add bloom
        frame = apply_bloom(frame, radius=5, intensity=0.5)
        frames.append(frame)

    # Save as GIF
    gif_path = os.path.join(VFX_DIR, f"{key}_animated.gif")
    frames[0].save(gif_path, save_all=True, append_images=frames[1:], duration=1000//24, loop=0, disposal=2)
    
    # Save as spritesheet (6 columns x 4 rows)
    cols = 6
    rows = 4
    sheet_w = cols * CANVAS_SIZE
    sheet_h = rows * CANVAS_SIZE
    sheet = Image.new('RGBA', (sheet_w, sheet_h), (0,0,0,0))
    
    for i, frame in enumerate(frames):
        cx = (i % cols) * CANVAS_SIZE
        cy = (i // cols) * CANVAS_SIZE
        sheet.paste(frame, (cx, cy))
        
    sheet_path = os.path.join(VFX_DIR, f"{key}_animated_sheet.png")
    sheet.save(sheet_path)
    
    print(f"Generated VFX: {key}")

def main():
    print("Starting Premium VFX and Audio Generation...")
    for key, config in VFX_CONFIGS.items():
        process_vfx(key, config)
        
        # Audio
        sfx_data = generate_sfx(config['sfx'])
        sfx_path = os.path.join(AUDIO_DIR, f"sfx_{key}.wav")
        save_wav(sfx_path, sfx_data)
        print(f"Generated Audio: sfx_{key}.wav")
        
    print("Finished.")

if __name__ == '__main__':
    main()
