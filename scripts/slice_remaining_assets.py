from PIL import Image
import os

def crop_and_fit(img_path, box, target_size=(512, 512), padding=20):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    crop_area = (int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3]))
    cropped = img.crop(crop_area)
    
    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
        
    max_dim = max(cropped.size)
    scale = (target_size[0] - padding * 2) / max_dim
    new_w = int(cropped.size[0] * scale)
    new_h = int(cropped.size[1] * scale)
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    offset_x = (target_size[0] - new_w) // 2
    offset_y = (target_size[1] - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

def main():
    # 1. Heroes
    hero_sheet = 'assets/characters/heroes_taro_sesame_sheet.png'
    if os.path.exists(hero_sheet):
        taro = crop_and_fit(hero_sheet, (0.02, 0.01, 0.22, 0.16))
        taro.save('assets/characters/hero_taro.png')
        print('Saved hero_taro.png')
        
        sesame = crop_and_fit(hero_sheet, (0.02, 0.54, 0.22, 0.69))
        sesame.save('assets/characters/hero_sesame.png')
        print('Saved hero_sesame.png')
        
    # 2. Items
    item_sheet = 'assets/items/items_pickup_sheet.png'
    if os.path.exists(item_sheet):
        chest = crop_and_fit(item_sheet, (0.0, 0.0, 0.26, 0.26))
        chest.save('assets/items/item_chest.png')
        print('Saved item_chest.png')
        
        cube = crop_and_fit(item_sheet, (0.0, 0.26, 0.26, 0.51))
        cube.save('assets/items/item_sugar_cube.png')
        print('Saved item_sugar_cube.png')
        
        jar = crop_and_fit(item_sheet, (0.0, 0.51, 0.26, 0.75))
        jar.save('assets/items/item_jam_jar.png')
        print('Saved item_jam_jar.png')
        
        mag = crop_and_fit(item_sheet, (0.0, 0.75, 0.26, 1.0))
        mag.save('assets/items/item_magnet_pickup.png')
        print('Saved item_magnet_pickup.png')

    # 3. Special enemies
    enemy_sheet = 'assets/enemies/enemies_dasher_siege_sheet.png'
    if os.path.exists(enemy_sheet):
        dasher = crop_and_fit(enemy_sheet, (0.0, 0.0, 0.52, 0.50))
        dasher.save('assets/enemies/enemy_dasher.png')
        print('Saved enemy_dasher.png')
        
        siege = crop_and_fit(enemy_sheet, (0.50, 0.0, 1.0, 0.50))
        siege.save('assets/enemies/enemy_siege.png')
        print('Saved enemy_siege.png')

    # 4. Boss Bitter Chef
    boss_sheet = 'assets/enemies/boss_5_bitter_chef_sheet.png'
    if os.path.exists(boss_sheet):
        chef = crop_and_fit(boss_sheet, (0.0, 0.0, 1.0, 0.60))
        chef.save('assets/enemies/boss_5_bitter_chef.png')
        print('Saved boss_5_bitter_chef.png')

    # 5. UI Card Frame
    card_sheet = 'assets/ui/ui_card_frame_sheet.png'
    if os.path.exists(card_sheet):
        card = crop_and_fit(card_sheet, (0.0, 0.0, 0.65, 0.65))
        card.save('assets/ui/ui_card_frame.png')
        print('Saved ui_card_frame.png')

if __name__ == '__main__':
    main()
