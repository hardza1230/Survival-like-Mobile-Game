import math
import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

def draw_radial_gradient(draw, center, radius, color_center, color_edge):
    cx, cy = center
    for r in range(int(radius), 0, -1):
        t = r / radius
        r_col = int(color_center[0] * (1 - t) + color_edge[0] * t)
        g_col = int(color_center[1] * (1 - t) + color_edge[1] * t)
        b_col = int(color_center[2] * (1 - t) + color_edge[2] * t)
        a_col = int(color_center[3] * (1 - t) + color_edge[3] * t)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(r_col, g_col, b_col, a_col))

def render_25d_mochi(
    char_type="strawberry",
    frame_action="idle",
    t_val=0.0,
    size=(256, 256)
):
    """
    Renders a 2.5D volumetric cute mochi with realistic 3D jelly lighting, 
    squash/stretch deformation, specular highlights, facial expressions, and accessory toppings.
    """
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx = size[0] // 2
    base_cy = size[1] // 2 + 35
    
    # Calculate squash & stretch based on action and time
    scale_x, scale_y, offset_y = 1.0, 1.0, 0
    eye_state = "open"
    blush_boost = 1.0
    
    if frame_action == "idle":
        # Gentle breathing cycle
        scale_x = 1.0 + 0.05 * math.sin(t_val * math.pi * 2)
        scale_y = 1.0 - 0.05 * math.sin(t_val * math.pi * 2)
        offset_y = int(4 * math.sin(t_val * math.pi * 2))
    elif frame_action == "hop_up":
        # Launching upward - stretch
        scale_x = 0.85
        scale_y = 1.18
        offset_y = -35
    elif frame_action == "peak_air":
        # Peak of jump - floating
        scale_x = 1.02
        scale_y = 1.02
        offset_y = -50
    elif frame_action == "squash_land":
        # Landing impact - heavy squash
        scale_x = 1.25
        scale_y = 0.72
        offset_y = 10
        eye_state = "happy_squint"
    elif frame_action == "dash":
        # Leaning forward
        scale_x = 1.15
        scale_y = 0.88
        offset_y = -10
        eye_state = "determined"
    elif frame_action == "cast":
        # Cheerful power pose
        scale_x = 1.08
        scale_y = 1.08
        offset_y = -20
        eye_state = "sparkle"
        blush_boost = 1.5
    elif frame_action == "hurt":
        # Wobble spin
        scale_x = 0.9
        scale_y = 1.1
        offset_y = -15
        eye_state = "dizzy"

    # Draw 2.5D Drop Shadow on ground
    shadow_w = int(65 * scale_x * (1.0 - abs(offset_y) / 120.0))
    shadow_h = int(22 * scale_x * (1.0 - abs(offset_y) / 120.0))
    shadow_alpha = int(90 * (1.0 - abs(offset_y) / 140.0))
    if shadow_alpha > 0 and shadow_w > 0:
        shadow_box = [cx - shadow_w, base_cy + 45 - shadow_h // 2, cx + shadow_w, base_cy + 45 + shadow_h // 2]
        shadow_layer = Image.new("RGBA", size, (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow_layer)
        s_draw.ellipse(shadow_box, fill=(40, 25, 45, shadow_alpha))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=6))
        img = Image.alpha_composite(img, shadow_layer)
        draw = ImageDraw.Draw(img)

    # Character color definitions
    if char_type == "strawberry":
        base_col = (255, 140, 185, 255)       # Strawberry pink
        highlight_col = (255, 235, 245, 255)  # Gloss white-pink
        shadow_col = (210, 80, 130, 255)      # Deep shadow
        rim_col = (255, 200, 225, 255)
        leaf_col = (80, 195, 110, 255)
        leaf_dark = (45, 130, 70, 255)
    elif char_type == "mint":
        base_col = (105, 220, 185, 255)       # Mint green
        highlight_col = (230, 255, 245, 255)  # Fresh highlight
        shadow_col = (45, 150, 125, 255)      # Deep mint shadow
        rim_col = (175, 245, 220, 255)
        leaf_col = (40, 180, 100, 255)
        leaf_dark = (25, 115, 60, 255)
    else: # chocolate
        base_col = (130, 75, 55, 255)         # Rich milk chocolate
        highlight_col = (210, 160, 130, 255)  # Syrup gloss
        shadow_col = (70, 32, 22, 255)        # Deep cocoa shadow
        rim_col = (170, 110, 85, 255)
        leaf_col = (255, 200, 100, 255)       # Gold candy star
        leaf_dark = (210, 140, 40, 255)

    # 3D Sphere / Volumetric Mochi Body
    body_center_y = base_cy + offset_y
    rx = int(72 * scale_x)
    ry = int(66 * scale_y)
    
    # Layered 2.5D shading
    # 1. Base Dark Outline & Rim
    draw.ellipse([cx - rx - 2, body_center_y - ry - 2, cx + rx + 2, body_center_y + ry + 2], fill=shadow_col)
    
    # 2. Main Body Ellipse
    draw.ellipse([cx - rx, body_center_y - ry, cx + rx, body_center_y + ry], fill=base_col)
    
    # 3. Ambient Occlusion Bottom Shadow
    ao_box = [cx - int(rx * 0.85), body_center_y + int(ry * 0.1), cx + int(rx * 0.85), body_center_y + ry]
    draw.chord(ao_box, start=0, end=180, fill=shadow_col)
    
    # 4. Top-Left 3D Gloss Highlight (Volumetric Light)
    hl_rx = int(rx * 0.55)
    hl_ry = int(ry * 0.45)
    hl_cx = cx - int(rx * 0.28)
    hl_cy = body_center_y - int(ry * 0.32)
    
    hl_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(hl_layer)
    hl_draw.ellipse([hl_cx - hl_rx, hl_cy - hl_ry, hl_cx + hl_rx, hl_cy + hl_ry], fill=highlight_col)
    # Specular hotspot
    hl_draw.ellipse([hl_cx - int(hl_rx * 0.4), hl_cy - int(hl_ry * 0.4), hl_cx + int(hl_rx * 0.4), hl_cy + int(hl_ry * 0.4)], fill=(255, 255, 255, 240))
    hl_layer = hl_layer.filter(ImageFilter.GaussianBlur(radius=8))
    img = Image.alpha_composite(img, hl_layer)
    draw = ImageDraw.Draw(img)

    # 5. Chocolate Glaze Drips (for Chocolate Mochi) or Mint Chips (for Mint)
    if char_type == "chocolate":
        # Glossy Dark Chocolate Drip Cap
        drip_layer = Image.new("RGBA", size, (0, 0, 0, 0))
        d_draw = ImageDraw.Draw(drip_layer)
        cap_box = [cx - rx, body_center_y - ry, cx + rx, body_center_y - int(ry * 0.1)]
        d_draw.chord(cap_box, start=180, end=360, fill=(60, 25, 18, 255))
        # Drip blobs
        d_draw.ellipse([cx - int(rx*0.5), body_center_y - int(ry*0.2), cx - int(rx*0.2), body_center_y + int(ry*0.2)], fill=(60, 25, 18, 255))
        d_draw.ellipse([cx + int(rx*0.1), body_center_y - int(ry*0.2), cx + int(rx*0.45), body_center_y + int(ry*0.15)], fill=(60, 25, 18, 255))
        # Glaze highlight
        d_draw.arc([cx - int(rx*0.6), body_center_y - int(ry*0.7), cx + int(rx*0.2), body_center_y - int(ry*0.2)], start=200, end=340, fill=(150, 90, 70, 230), width=3)
        img = Image.alpha_composite(img, drip_layer)
        draw = ImageDraw.Draw(img)
    elif char_type == "mint":
        # Tiny chocolate chip sprinkles on mint body
        for (chx, chy) in [(-25, -15), (20, -25), (32, 5), (-35, 10)]:
            chip_cx = cx + int(chx * scale_x)
            chip_cy = body_center_y + int(chy * scale_y)
            draw.ellipse([chip_cx - 4, chip_cy - 4, chip_cx + 4, chip_cy + 4], fill=(70, 35, 25, 240))
            draw.point((chip_cx - 1, chip_cy - 1), fill=(160, 100, 80, 255))

    # 6. Cute 2.5D Hands/Stubs
    hand_y = body_center_y + int(ry * 0.25)
    hand_rx = int(12 * scale_x)
    hand_ry = int(14 * scale_y)
    
    if frame_action == "cast":
        # Hands raised high in cheer!
        draw.ellipse([cx - rx - 6, body_center_y - 25, cx - rx + 14, body_center_y - 5], fill=base_col, outline=shadow_col, width=2)
        draw.ellipse([cx + rx - 14, body_center_y - 25, cx + rx + 6, body_center_y - 5], fill=base_col, outline=shadow_col, width=2)
    elif frame_action == "dash":
        # Hand pointing forward
        draw.ellipse([cx - rx - 8, hand_y - 5, cx - rx + 12, hand_y + 15], fill=base_col, outline=shadow_col, width=2)
        draw.ellipse([cx + rx - 5, hand_y + 5, cx + rx + 15, hand_y + 25], fill=base_col, outline=shadow_col, width=2)
    else:
        # Default cute resting hands
        draw.ellipse([cx - rx - 4, hand_y - hand_ry, cx - rx + hand_rx, hand_y + hand_ry], fill=base_col, outline=shadow_col, width=2)
        draw.ellipse([cx + rx - hand_rx, hand_y - hand_ry, cx + rx + 4, hand_y + hand_ry], fill=base_col, outline=shadow_col, width=2)

    # 7. Cute Kawaii Facial Expression
    face_y = body_center_y + int(ry * 0.12)
    eye_spacing = int(28 * scale_x)
    eye_r = int(10 * min(scale_x, scale_y))
    
    # Blush Cheeks
    blush_alpha = int(170 * blush_boost)
    blush_col = (255, 100, 140, min(255, blush_alpha))
    draw.ellipse([cx - eye_spacing - 16, face_y + 6, cx - eye_spacing - 2, face_y + 18], fill=blush_col)
    draw.ellipse([cx + eye_spacing + 2, face_y + 6, cx + eye_spacing + 16, face_y + 18], fill=blush_col)

    if eye_state == "open" or eye_state == "sparkle":
        # Big Sparkling Anime Kawaii Eyes
        for sign in (-1, 1):
            ex = cx + sign * eye_spacing
            ey = face_y
            # Eye outer
            draw.ellipse([ex - eye_r, ey - int(eye_r * 1.2), ex + eye_r, ey + int(eye_r * 1.2)], fill=(40, 20, 35, 255))
            # Main high shine
            draw.ellipse([ex - int(eye_r * 0.6), ey - int(eye_r * 0.9), ex + int(eye_r * 0.2), ey - int(eye_r * 0.1)], fill=(255, 255, 255, 255))
            # Secondary twinkle
            draw.ellipse([ex + int(eye_r * 0.1), ey + int(eye_r * 0.3), ex + int(eye_r * 0.55), ey + int(eye_r * 0.75)], fill=(255, 255, 255, 240))
            if eye_state == "sparkle":
                # Star sparkle
                draw.line([ex - 4, ey, ex + 4, ey], fill=(255, 240, 180, 255), width=2)
                draw.line([ex, ey - 4, ex, ey + 4], fill=(255, 240, 180, 255), width=2)
        # Happy Smile Mouth
        draw.arc([cx - 9, face_y + 2, cx + 9, face_y + 14], start=20, end=160, fill=(40, 20, 35, 255), width=3)
    elif eye_state == "happy_squint":
        # Closed smiling happy eyes ^^
        for sign in (-1, 1):
            ex = cx + sign * eye_spacing
            draw.arc([ex - eye_r, face_y - 6, ex + eye_r, face_y + 8], start=200, end=340, fill=(40, 20, 35, 255), width=3)
        # Open joyful mouth
        draw.chord([cx - 8, face_y + 4, cx + 8, face_y + 18], start=0, end=180, fill=(210, 60, 90, 255), outline=(40, 20, 35, 255), width=2)
    elif eye_state == "determined":
        # Fierce cute eyebrows & eye
        for sign in (-1, 1):
            ex = cx + sign * eye_spacing
            draw.ellipse([ex - eye_r, face_y - eye_r, ex + eye_r, face_y + eye_r], fill=(40, 20, 35, 255))
            draw.ellipse([ex - 4, face_y - 6, ex + 2, face_y], fill=(255, 255, 255, 255))
            # Brow
            draw.line([ex - sign * 8, face_y - 12, ex + sign * 8, face_y - 8], fill=(40, 20, 35, 255), width=3)
        draw.line([cx - 6, face_y + 8, cx + 6, face_y + 8], fill=(40, 20, 35, 255), width=3)
    elif eye_state == "dizzy":
        # Spiral eyes @ @
        for sign in (-1, 1):
            ex = cx + sign * eye_spacing
            draw.arc([ex - 8, face_y - 8, ex + 8, face_y + 8], start=0, end=300, fill=(40, 20, 35, 255), width=3)
        draw.ellipse([cx - 5, face_y + 6, cx + 5, face_y + 14], fill=(200, 70, 90, 255))

    # 8. Head Topping / Accessory
    head_top_y = body_center_y - ry + 4
    if char_type == "strawberry":
        # Strawberry Leaf Sprout & Stem
        stem_box = [cx - 4, head_top_y - 24, cx + 4, head_top_y - 6]
        draw.line([cx, head_top_y - 8, cx + 2, head_top_y - 22], fill=leaf_dark, width=5)
        # Leaves
        for ang in (-45, 0, 45):
            rad = math.radians(ang)
            lx = cx + int(18 * math.sin(rad))
            ly = head_top_y - 6 - int(12 * math.cos(rad))
            draw.ellipse([lx - 9, ly - 6, lx + 9, ly + 6], fill=leaf_col, outline=leaf_dark, width=2)
            draw.ellipse([lx - 4, ly - 3, lx + 4, ly + 3], fill=(130, 235, 150, 255))
    elif char_type == "mint":
        # Fresh Double Mint Leaves with Dew Drop
        draw.ellipse([cx - 20, head_top_y - 18, cx + 4, head_top_y], fill=leaf_col, outline=leaf_dark, width=2)
        draw.ellipse([cx - 4, head_top_y - 22, cx + 20, head_top_y - 2], fill=leaf_col, outline=leaf_dark, width=2)
        # Dew drop
        draw.ellipse([cx + 2, head_top_y - 18, cx + 8, head_top_y - 12], fill=(255, 255, 255, 230))
    else: # chocolate
        # Whipped cream swirl with a glossy cherry
        draw.chord([cx - 16, head_top_y - 20, cx + 16, head_top_y + 4], start=180, end=360, fill=(255, 250, 245, 255), outline=(200, 180, 170, 255), width=2)
        # Cherry
        draw.ellipse([cx - 6, head_top_y - 28, cx + 10, head_top_y - 12], fill=(225, 45, 75, 255), outline=(150, 20, 40, 255), width=2)
        draw.ellipse([cx - 2, head_top_y - 26, cx + 2, head_top_y - 22], fill=(255, 200, 210, 255))
        draw.arc([cx + 2, head_top_y - 38, cx + 16, head_top_y - 24], start=100, end=200, fill=(80, 140, 60, 255), width=2)

    return img

def create_character_pack(char_type, base_name):
    # 1. Main Hero Portrait (Idle Hero Art 512x512)
    hero_img = render_25d_mochi(char_type=char_type, frame_action="idle", t_val=0.0, size=(512, 512))
    hero_path = f"assets/characters/{base_name}_25d.png"
    hero_img.save(hero_path)
    print(f"Saved {hero_path}")
    
    # 2. Complete Animation Spritesheet (6 Actions x 4 Frames = 24 Frames Grid)
    actions = ["idle", "hop_up", "peak_air", "squash_land", "dash", "cast"]
    sheet_cols = 4
    sheet_rows = len(actions)
    frame_size = 256
    
    sheet = Image.new("RGBA", (sheet_cols * frame_size, sheet_rows * frame_size), (0, 0, 0, 0))
    gif_frames = []
    
    for r, action in enumerate(actions):
        for c in range(sheet_cols):
            t = c / sheet_cols
            frame = render_25d_mochi(char_type=char_type, frame_action=action, t_val=t, size=(frame_size, frame_size))
            sheet.paste(frame, (c * frame_size, r * frame_size), frame)
            
            # Collect frames for animated GIF loop (Hop & Squash cycle)
            if action in ["idle", "hop_up", "peak_air", "squash_land", "cast"]:
                gif_frames.append(frame)

    sheet_path = f"assets/characters/{base_name}_anim_sheet.png"
    sheet.save(sheet_path)
    print(f"Saved {sheet_path}")
    
    # 3. Save Animated GIF
    gif_path = f"assets/characters/{base_name}_anim.gif"
    if gif_frames:
        gif_frames[0].save(
            gif_path,
            save_all=True,
            append_images=gif_frames[1:],
            duration=120,
            loop=0,
            disposal=2
        )
        print(f"Saved animated GIF: {gif_path}")

def main():
    os.makedirs("assets/characters", exist_ok=True)
    
    characters = [
        ("strawberry", "mochi_strawberry"),
        ("mint", "mochi_mint"),
        ("chocolate", "mochi_chocolate"),
    ]
    
    for c_type, b_name in characters:
        create_character_pack(c_type, b_name)

if __name__ == "__main__":
    main()
