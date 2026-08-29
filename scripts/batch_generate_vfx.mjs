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

const VFX_TO_GENERATE = [
  {
    key: 'vfx_chili_nova',
    prompt: 'Kawaii spicy chili nova explosion VFX shockwave ring for mobile game, fiery orange-red candy flame blast wave with chili spark particles, glowing dessert fire burst, transparent background',
    dest: './assets/vfx/vfx_chili_nova.png'
  },
  {
    key: 'vfx_frost_pulse',
    prompt: 'Kawaii ice candy frost pulse freeze shockwave ring VFX for mobile game, pale blue crystalline ice snowflake blast wave, glowing icy sparkles, translucent freeze aura, transparent background',
    dest: './assets/vfx/vfx_frost_pulse.png'
  },
  {
    key: 'vfx_ult_sugarbomb',
    prompt: 'Kawaii strawberry mochi sugar bomb ultimate explosion VFX for mobile game, pastel pink sweet explosion shockwave, heart sparkles, strawberry jam blast ripples, transparent background',
    dest: './assets/vfx/vfx_ult_sugarbomb.png'
  },
  {
    key: 'vfx_ult_cocoavortex',
    prompt: 'Kawaii dark chocolate cocoa swirl vortex black hole VFX for mobile game, glossy chocolate syrup spiral whirlpool, purple magical sprinkles, suction lines, transparent background',
    dest: './assets/vfx/vfx_ult_cocoavortex.png'
  },
  {
    key: 'vfx_telegraph_hazard',
    prompt: 'Kawaii mobile game red warning telegraph hazard ground circle ring, glowing orange-red striped warning danger zone outline, cute candy hazard circle, transparent background',
    dest: './assets/vfx/vfx_telegraph_hazard.png'
  },
  {
    key: 'vfx_proj_donut',
    prompt: 'Kawaii glazed strawberry donut meteor projectile falling from above with motion trails, glowing sugar sprinkles tail, sweet dessert asteroid VFX, transparent background',
    dest: './assets/vfx/vfx_proj_donut.png'
  }
];

async function processVfx(item, manifest) {
  console.log(`\n========================================`);
  console.log(`Generating VFX: ${item.key} (${item.dest})`);
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

  // Copy or crop main element to item.dest
  fs.copyFileSync(rawDest, item.dest);

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
  
  for (const item of VFX_TO_GENERATE) {
    try {
      await processVfx(item, manifest);
    } catch (err) {
      console.error(`Error processing ${item.key}:`, err);
    }
  }
  
  console.log('\nAll VFX items generated successfully!');
}

main().catch(console.error);
