from PIL import Image
import numpy as np
import os

images = {
    'miniboss_1_ant.png': r'C:\Users\norrasates\.gemini\antigravity-ide\brain\a3fcf7ff-948c-4b8b-9948-10a8c95fd612\miniboss_ant_1787987541189.jpg',
    'miniboss_2_bubble.png': r'C:\Users\norrasates\.gemini\antigravity-ide\brain\a3fcf7ff-948c-4b8b-9948-10a8c95fd612\miniboss_bubble_1787987632666.jpg',
    'miniboss_3_pan.png': r'C:\Users\norrasates\.gemini\antigravity-ide\brain\a3fcf7ff-948c-4b8b-9948-10a8c95fd612\miniboss_pan_1787987678466.jpg',
    'miniboss_4_ice.png': r'C:\Users\norrasates\.gemini\antigravity-ide\brain\a3fcf7ff-948c-4b8b-9948-10a8c95fd612\miniboss_ice_1787987733893.jpg',
    'miniboss_5_chefbot.png': r'C:\Users\norrasates\.gemini\antigravity-ide\brain\a3fcf7ff-948c-4b8b-9948-10a8c95fd612\miniboss_chefbot_1787987780079.jpg'
}

def make_transparent(img_path, dest_path, target_size=(512, 512)):
    img = Image.open(img_path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    
    # Calculate distance from pure white (255, 255, 255)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    dist = np.sqrt((255 - r)**2 + (255 - g)**2 + (255 - b)**2)
    
    # Smooth alpha feathering
    threshold_low = 10.0
    threshold_high = 35.0
    
    alpha = np.clip((dist - threshold_low) / (threshold_high - threshold_low), 0.0, 1.0) * 255.0
    
    # Flood-fill from corners to ensure outer white is transparent
    from scipy.ndimage import binary_fill_holes
    # Set alpha
    arr[:, :, 3] = alpha
    result = Image.fromarray(arr.astype(np.uint8))
    
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
        
    max_dim = max(result.size)
    scale = (target_size[0] - 24) / max_dim
    new_w = int(result.size[0] * scale)
    new_h = int(result.size[1] * scale)
    
    resized = result.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    canvas.paste(resized, ((target_size[0] - new_w) // 2, (target_size[1] - new_h) // 2), resized)
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    canvas.save(dest_path, 'PNG')
    print(f'Processed & saved: {dest_path}')

for name, src in images.items():
    dest = os.path.join('assets/enemies', name)
    make_transparent(src, dest)
