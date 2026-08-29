from PIL import Image
import os
import glob
import numpy as np

def clean_to_largest_component(img_path):
    img = Image.open(img_path).convert('RGBA')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    
    # Threshold alpha
    binary = (alpha > 30).astype(np.uint8)
    
    # Use scipy or simple flood fill / label from PIL / scipy
    try:
        from scipy.ndimage import label
        labeled, num_features = label(binary)
        if num_features > 1:
            sizes = [np.sum(labeled == i) for i in range(1, num_features + 1)]
            largest_label = np.argmax(sizes) + 1
            mask = (labeled == largest_label)
            arr[:, :, 3] = arr[:, :, 3] * mask
            cleaned = Image.fromarray(arr)
            bbox = cleaned.getbbox()
            if bbox:
                cleaned = cleaned.crop(bbox)
            
            # Recenter in 256x256
            max_dim = max(cleaned.size)
            scale = 240 / max_dim
            new_w = int(cleaned.size[0] * scale)
            new_h = int(cleaned.size[1] * scale)
            resized = cleaned.resize((new_w, new_h), Image.Resampling.LANCZOS)
            canvas = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
            canvas.paste(resized, ((256 - new_w) // 2, (256 - new_h) // 2), resized)
            canvas.save(img_path)
            print(f'Cleaned islands from {img_path}')
    except Exception as e:
        print(f'Note on {img_path}: {e}')

for p in glob.glob('assets/icons/*.png'):
    if not p.endswith('_sheet.png'):
        clean_to_largest_component(p)
