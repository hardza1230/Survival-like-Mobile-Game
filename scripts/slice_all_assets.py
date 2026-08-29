from PIL import Image
import os

def crop_exact(img_path, box, target_size=(256, 256)):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    crop_area = (int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3]))
    cropped = img.crop(crop_area)
    
    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
        
    max_dim = max(cropped.size)
    scale = (target_size[0] - 16) / max_dim
    new_w = int(cropped.size[0] * scale)
    new_h = int(cropped.size[1] * scale)
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    offset_x = (target_size[0] - new_w) // 2
    offset_y = (target_size[1] - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

def main():
    crops = {
        'icon_skill_star': ('assets/icons/icon_skill_star_sheet.png', (0.05, 0.01, 0.95, 0.98)),
        'icon_skill_sprinkle': ('assets/icons/icon_skill_sprinkle_sheet.png', (0.15, 0.0, 0.85, 0.53)),
        'icon_skill_chili': ('assets/icons/icon_skill_chili_sheet.png', (0.0, 0.0, 0.58, 0.63)),
        'icon_skill_frost': ('assets/icons/icon_skill_frost_sheet.png', (0.33, 0.05, 0.67, 0.39)),
        'icon_skill_bubble': ('assets/icons/icon_skill_bubble_sheet.png', (0.22, 0.01, 0.78, 0.40)),
        'icon_pas_heart': ('assets/icons/icon_pas_heart_sheet.png', (0.0, 0.0, 0.33, 0.45)),
        'icon_pas_magnet': ('assets/icons/icon_pas_magnet_sheet.png', (0.20, 0.01, 0.80, 0.56)),
        'icon_sugar': ('assets/icons/icon_sugar_sheet.png', (0.15, 0.01, 0.85, 0.43)),
    }
    
    for name, (sheet, box) in crops.items():
        if os.path.exists(sheet):
            out_img = crop_exact(sheet, box)
            out_path = f'assets/icons/{name}.png'
            out_img.save(out_path)
            print(f'Processed {out_path} -> 256x256')

    # Also process UI Button
    if os.path.exists('assets/ui/ui_button_pink_sheet.png'):
        img = Image.open('assets/ui/ui_button_pink_sheet.png').convert('RGBA')
        w, h = img.size
        btn = img.crop((0, 0, w, int(h * 0.24)))
        bbox = btn.getbbox()
        if bbox:
            btn = btn.crop(bbox)
            btn.save('assets/ui/ui_button_pink.png')
            print('Processed assets/ui/ui_button_pink.png')

if __name__ == '__main__':
    main()
