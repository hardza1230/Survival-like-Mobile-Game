from PIL import Image
import os

def crop_exact(img_path, box, target_size=(512, 512)):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    crop_area = (int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3]))
    cropped = img.crop(crop_area)
    
    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
        
    max_dim = max(cropped.size)
    scale = (target_size[0] - 20) / max_dim
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
        'vfx_chili_nova': ('assets/vfx/vfx_chili_nova_sheet.png', (0.05, 0.0, 0.95, 0.48)),
        'vfx_frost_pulse': ('assets/vfx/vfx_frost_pulse_sheet.png', (0.62, 0.01, 0.99, 0.44)),
        'vfx_ult_sugarbomb': ('assets/vfx/vfx_ult_sugarbomb_sheet.png', (0.15, 0.0, 0.85, 0.42)),
        'vfx_ult_cocoavortex': ('assets/vfx/vfx_ult_cocoavortex_sheet.png', (0.0, 0.0, 0.65, 0.58)),
        'vfx_telegraph_hazard': ('assets/vfx/vfx_telegraph_hazard_sheet.png', (0.10, 0.01, 0.90, 0.45)),
        'vfx_proj_donut': ('assets/vfx/vfx_proj_donut_sheet.png', (0.20, 0.0, 0.80, 0.53)),
    }
    
    for name, (sheet, box) in crops.items():
        if os.path.exists(sheet):
            out_img = crop_exact(sheet, box)
            out_path = f'assets/vfx/{name}.png'
            out_img.save(out_path)
            print(f'Processed {out_path} -> 512x512')

if __name__ == '__main__':
    main()
