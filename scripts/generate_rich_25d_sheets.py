import math
import os
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw
import numpy as np

def create_chocolate_base(src_path, dest_path):
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    
    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]
    a = arr[:, :, 3]
    
    # Calculate luminance
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    
    # Map to chocolate brown: dark brown (55, 25, 18), mid brown (110, 60, 40), highlight (210, 155, 120)
    norm = lum / 255.0
    new_r = np.clip(norm * 200 + 35, 0, 255)
    new_g = np.clip(norm * 135 + 20, 0, 255)
    new_b = np.clip(norm * 90 + 15, 0, 255)
    
    choco_arr = np.stack([new_r, new_g, new_b, a], axis=2).astype(np.uint8)
    choco_img = Image.fromarray(choco_arr)
    
    # Add glossy chocolate highlights & cute blush
    draw = ImageDraw.Draw(choco_img)
    # Add pink blush
    cx, cy = choco_img.size[0] // 2, choco_img.size[1] // 2 + 10
    draw.ellipse([cx - 70, cy + 15, cx - 35, cy + 35], fill=(255, 90, 130, 160))
    draw.ellipse([cx + 35, cy + 15, cx + 70, cy + 35], fill=(255, 90, 130, 160))
    
    choco_img.save(dest_path, "PNG")
    print(f"Created authentic Chocolate base: {dest_path}")
    return dest_path

def create_rich_25d_animation(source_img_path, output_base):
    src = Image.open(source_img_path).convert("RGBA")
    bbox = src.getbbox()
    if bbox:
        src = src.crop(bbox)
        
    max_d = max(src.size)
    scale = 190.0 / max_d
    base_w = int(src.size[0] * scale)
    base_h = int(src.size[1] * scale)
    base_char = src.resize((base_w, base_h), Image.Resampling.LANCZOS)
    
    canvas_size = (256, 256)
    cx, cy = 128, 140
    
    # 6 Action Rows:
    # 0: Idle Breathing (4 frames)
    # 1: Hop Jump Up (4 frames)
    # 2: Peak Air Float (4 frames)
    # 3: Squash Landing Impact (4 frames)
    # 4: Dash Roll (4 frames)
    # 5: Victory Cheer / Cast (4 frames)
    
    sheet_cols = 4
    sheet_rows = 6
    sheet = Image.new("RGBA", (sheet_cols * 256, sheet_rows * 256), (0, 0, 0, 0))
    all_frames = []
    gif_frames = []
    
    for row in range(sheet_rows):
        for col in range(sheet_cols):
            t = col / 4.0
            
            sx, sy, dy = 1.0, 1.0, 0
            rot = 0
            shadow_s = 1.0
            shadow_a = 90
            
            if row == 0: # Idle
                sx = 1.0 + 0.04 * math.sin(t * math.pi * 2)
                sy = 1.0 - 0.04 * math.sin(t * math.pi * 2)
                dy = int(3 * math.sin(t * math.pi * 2))
                shadow_s = sx
            elif row == 1: # Hop Up
                progress = (col + 1) / 4.0
                sx = 0.88 - 0.05 * progress
                sy = 1.15 + 0.10 * progress
                dy = -int(45 * progress)
                shadow_s = 1.0 - 0.3 * progress
                shadow_a = int(90 * (1.0 - 0.5 * progress))
            elif row == 2: # Peak Air Float
                sx = 1.02 + 0.03 * math.sin(t * math.pi)
                sy = 1.0 - 0.02 * math.sin(t * math.pi)
                dy = -48 + int(4 * math.sin(t * math.pi * 2))
                rot = int(6 * math.sin(t * math.pi * 2))
                shadow_s = 0.65
                shadow_a = 45
            elif row == 3: # Squash Landing
                if col == 0: # descending
                    sx, sy, dy = 0.92, 1.12, -20
                    shadow_s, shadow_a = 0.8, 70
                elif col == 1: # maximum squash on ground
                    sx, sy, dy = 1.28, 0.72, 16
                    shadow_s, shadow_a = 1.35, 120
                elif col == 2: # rebound
                    sx, sy, dy = 1.08, 0.92, 4
                    shadow_s, shadow_a = 1.1, 100
                else: # recover
                    sx, sy, dy = 1.0, 1.0, 0
                    shadow_s, shadow_a = 1.0, 90
            elif row == 4: # Dash Roll
                rot = -int(col * 90)
                sx, sy, dy = 1.15, 0.9, -6
                shadow_s, shadow_a = 1.1, 85
            elif row == 5: # Victory Cheer / Cast
                sx = 1.06 + 0.04 * math.sin(t * math.pi * 2)
                sy = 1.06 + 0.04 * math.sin(t * math.pi * 2)
                dy = -15 + int(8 * math.sin(t * math.pi * 2))
                rot = int(8 * math.sin(t * math.pi * 2))
                shadow_s, shadow_a = 0.9, 75

            # 1. Render Drop Shadow
            frame_img = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
            sw = int(58 * shadow_s)
            sh = int(18 * shadow_s)
            if sw > 2 and sh > 2 and shadow_a > 0:
                s_draw = Image.new("RGBA", (sw * 2, sh * 2), (0, 0, 0, 0))
                sd = ImageDraw.Draw(s_draw)
                sd.ellipse([0, 0, sw * 2, sh * 2], fill=(35, 20, 40, shadow_a))
                s_draw = s_draw.filter(ImageFilter.GaussianBlur(radius=4))
                frame_img.paste(s_draw, (cx - sw, 195 - sh), s_draw)

            # 2. Transform 2.5D character
            cur_w = max(10, int(base_w * sx))
            cur_h = max(10, int(base_h * sy))
            transformed = base_char.resize((cur_w, cur_h), Image.Resampling.LANCZOS)
            
            if rot != 0:
                transformed = transformed.rotate(rot, resample=Image.Resampling.BICUBIC, expand=True)

            char_x = cx - transformed.size[0] // 2
            char_y = cy + dy - transformed.size[1] // 2 + 15
            frame_img.paste(transformed, (char_x, char_y), transformed)

            sheet.paste(frame_img, (col * 256, row * 256), frame_img)
            all_frames.append(frame_img)
            
            # Key animation frames for bouncy GIF loop
            if row in [0, 1, 2, 3]:
                gif_frames.append(frame_img)

    sheet_path = f"assets/characters/{output_base}_anim_sheet.png"
    sheet.save(sheet_path)
    print(f"Saved {sheet_path}")

    avatar = all_frames[0]
    avatar_path = f"assets/characters/{output_base}_25d.png"
    avatar.save(avatar_path)
    print(f"Saved {avatar_path}")

    gif_path = f"assets/characters/{output_base}_anim.gif"
    if gif_frames:
        gif_frames[0].save(
            gif_path,
            save_all=True,
            append_images=gif_frames[1:],
            duration=110,
            loop=0,
            disposal=2
        )
        print(f"Saved {gif_path}")

def main():
    # 1. Mochi (Classic Strawberry)
    create_rich_25d_animation(
        "assets/characters/hero_strawberry.png",
        "mochi_strawberry"
    )
    
    # 2. Mint Mochi
    create_rich_25d_animation(
        "assets/characters/hero_matcha.png",
        "mochi_mint"
    )
    
    # 3. Chocolate Mochi
    choco_base = create_chocolate_base(
        "assets/characters/hero_strawberry.png",
        "assets/characters/hero_chocolate.png"
    )
    create_rich_25d_animation(
        choco_base,
        "mochi_chocolate"
    )

if __name__ == "__main__":
    main()
