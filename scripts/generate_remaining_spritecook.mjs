import fs from 'node:fs';
import path from 'node:path';
import { callMcpTool, pollJob, downloadImage } from './spritecook_client.mjs';

const ASSET_MANIFEST_PATH = './spritecook-assets.json';

function loadManifest() {
  if (fs.existsSync(ASSET_MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(ASSET_MANIFEST_PATH, 'utf-8'));
  }
  return { assets: [] };
}

function saveManifest(manifest) {
  fs.writeFileSync(ASSET_MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
}

const JOBS = [
  {
    key: 'heroes_sheet',
    prompt: 'Kawaii round mochi hero characters sprite sheet: Taro lavender purple mochi hero with swirl sprout, Black sesame grey mochi hero with red warrior headband, cute bouncy round bodies, sparkling eyes, blush cheeks, transparent background',
    dest: './assets/characters/heroes_taro_sesame_sheet.png'
  },
  {
    key: 'items_sheet',
    prompt: 'Kawaii mobile game item pickup asset sheet: golden chocolate treasure chest, sparkling blue EXP sugar cubes, healing strawberry jam jar with heart, gold magnet pickup, dessert theme, transparent background',
    dest: './assets/items/items_pickup_sheet.png'
  },
  {
    key: 'special_enemies_sheet',
    prompt: 'Kawaii mobile game enemy monster sheet: Sour dasher ant with speed trail puffs, Cupcake siege mortar cannon shooting candy pellets, dessert theme, cute angry faces, transparent background',
    dest: './assets/enemies/enemies_dasher_siege_sheet.png'
  },
  {
    key: 'boss_bitter_chef',
    prompt: 'Kawaii ultimate final boss monster The Bitter Chef, dark fantasy dessert villain with dark chocolate drip aura, tall dirty chef hat, glowing magenta purple eyes, holding cursed whisk, menacing cute chibi villain, transparent background',
    dest: './assets/enemies/boss_5_bitter_chef_sheet.png'
  },
  {
    key: 'ui_card_frame',
    prompt: 'Kawaii mobile game level up upgrade skill selection card frame container, glossy pastel pink and gold border, rounded corners, dessert theme UI box, transparent background',
    dest: './assets/ui/ui_card_frame_sheet.png'
  }
];

async function run() {
  const manifest = loadManifest();

  for (const item of JOBS) {
    console.log(`\n[START] Generating ${item.key}...`);
    try {
      const job = await callMcpTool('generate_game_art', {
        prompt: item.prompt,
        mode: 'ui',
        pixel: false,
        bg_mode: 'transparent',
        smart_crop: true,
        smart_crop_mode: 'tightest',
        model: 'gpt-image-2',
        quality: 'low',
        resolution: '1K'
      });

      console.log(`[QUEUED] Job ID: ${job.job_id} (Credits used: ${job.credits_used}, remaining: ${job.credits_remaining})`);
      const pollInfo = job.poll || { tool: 'check_job_status', arguments: { job_id: job.job_id } };
      const res = await pollJob(pollInfo);

      const asset = res.assets?.[0];
      if (asset?.sprite_url) {
        await downloadImage(asset.sprite_url, item.dest);
        manifest.assets.push({
          key: item.key,
          asset_id: asset.id || asset.asset_id,
          prompt: item.prompt,
          file_path: item.dest,
          sheet_path: item.dest,
          created_at: new Date().toISOString()
        });
        saveManifest(manifest);
        console.log(`[SUCCESS] Saved ${item.dest}`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed ${item.key}:`, err);
    }
  }

  console.log('\nAll SpriteCook jobs completed!');
}

run().catch(console.error);
