import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
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

const ITEMS_TO_GENERATE = [
  {
    key: 'icon_skill_star',
    prompt: 'Kawaii glowing cute candy star guard skill icon for mobile game, yellow gold glossy jelly star, sparkling sprinkles, soft pastel colors, cute round shape, transparent background',
    dest: './assets/icons/icon_skill_star.png',
    type: 'icon'
  },
  {
    key: 'icon_skill_chili',
    prompt: 'Kawaii cute spicy chili pepper nova explosion skill icon for mobile game, glossy candy chili, cute red-orange jelly sparks, soft pastel colors, soft dark outline, transparent background',
    dest: './assets/icons/icon_skill_chili.png',
    type: 'icon'
  },
  {
    key: 'icon_skill_frost',
    prompt: 'Kawaii cute ice candy frost pulse skill icon for mobile game, pale blue snowflake crystal jelly, sparkling cool glow, soft pastel colors, round cute shape, transparent background',
    dest: './assets/icons/icon_skill_frost.png',
    type: 'icon'
  },
  {
    key: 'icon_skill_bubble',
    prompt: 'Kawaii cute shiny rainbow soap bubble homing skill icon for mobile game, pastel holographic jelly sphere, glistening highlights, soft dark outline, transparent background',
    dest: './assets/icons/icon_skill_bubble.png',
    type: 'icon'
  },
  {
    key: 'icon_pas_heart',
    prompt: 'Kawaii cute pink jelly sweet heart passive skill icon for mobile game, glossy strawberry candy heart, healing soft glow, cute round shape, transparent background',
    dest: './assets/icons/icon_pas_heart.png',
    type: 'icon'
  },
  {
    key: 'icon_pas_magnet',
    prompt: 'Kawaii cute candy horseshoe magnet passive skill icon for mobile game, pastel red and silver rounded magnet with sweet candy sparkles, transparent background',
    dest: './assets/icons/icon_pas_magnet.png',
    type: 'icon'
  },
  {
    key: 'icon_sugar',
    prompt: 'Kawaii golden candy sugar crystal coin currency icon for mobile game, glistening sweet gold wrapped candy or golden sugar gem, glossy jelly highlights, transparent background',
    dest: './assets/icons/icon_sugar.png',
    type: 'icon'
  },
  {
    key: 'ui_button_pink',
    prompt: 'Kawaii cute rounded mobile game action button, strawberry mochi pink color, soft pill shape with 3D jelly bevel and glossy highlight, dessert theme, transparent background',
    dest: './assets/ui/ui_button_pink.png',
    type: 'ui'
  }
];

async function processItem(item, manifest) {
  console.log(`\n========================================`);
  console.log(`Generating: ${item.key} (${item.dest})`);
  console.log(`Prompt: ${item.prompt}`);
  
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

  console.log(`Job queued: ${job.job_id} (Credits used: ${job.credits_used}, remaining: ${job.credits_remaining})`);
  
  const pollInfo = job.poll || { tool: 'check_job_status', arguments: { job_id: job.job_id } };
  const res = await pollJob(pollInfo);
  
  const asset = res.assets?.[0];
  if (!asset?.sprite_url) {
    throw new Error(`No asset output found for ${item.key}`);
  }

  const rawDest = item.dest.replace('.png', '_sheet.png');
  await downloadImage(asset.sprite_url, rawDest);

  // Automatically crop the top main icon if it is a UI sheet, or use as is
  const pythonScript = `
from PIL import Image
import os

img = Image.open(r'${rawDest}')
w, h = img.size
# If sheet format with sub-states, crop top main icon
if h > 400 and w > 400:
    top_crop = img.crop((int(w * 0.15), 0, int(w * 0.85), int(h * 0.58)))
    bbox = top_crop.getbbox()
    if bbox:
        cropped = top_crop.crop(bbox)
        cropped.save(r'${item.dest}')
        print(f"Saved cropped icon to {r'${item.dest}'} with size {cropped.size}")
    else:
        img.save(r'${item.dest}')
else:
    img.save(r'${item.dest}')
`;
  
  fs.writeFileSync('./scripts/_temp_crop.py', pythonScript);
  execSync('python ./scripts/_temp_crop.py');
  if (fs.existsSync('./scripts/_temp_crop.py')) fs.unlinkSync('./scripts/_temp_crop.py');

  manifest.assets.push({
    key: item.key,
    asset_id: asset.id || asset.asset_id,
    prompt: item.prompt,
    file_path: item.dest,
    sheet_path: rawDest,
    created_at: new Date().toISOString()
  });

  saveManifest(manifest);
  console.log(`Successfully generated and saved ${item.key}!`);
}

async function main() {
  const manifest = loadManifest();
  
  for (const item of ITEMS_TO_GENERATE) {
    try {
      await processItem(item, manifest);
    } catch (err) {
      console.error(`Error processing ${item.key}:`, err);
    }
  }
  
  console.log('\nAll items processed successfully!');
}

main().catch(console.error);
