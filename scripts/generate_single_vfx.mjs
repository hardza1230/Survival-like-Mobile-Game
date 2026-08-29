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

const key = process.argv[2];
const prompt = process.argv[3];
const dest = process.argv[4];

if (!key || !prompt || !dest) {
  console.error('Usage: node generate_single_vfx.mjs <key> <prompt> <dest>');
  process.exit(1);
}

async function run() {
  console.log(`[START] Generating ${key}`);
  const job = await callMcpTool('generate_game_art', {
    prompt,
    mode: 'ui',
    pixel: false,
    bg_mode: 'transparent',
    smart_crop: true,
    smart_crop_mode: 'tightest',
    model: 'gpt-image-2',
    quality: 'low',
    resolution: '1K'
  });

  console.log(`[QUEUED] Job ID: ${job.job_id} (Credits used: ${job.credits_used})`);
  const pollInfo = job.poll || { tool: 'check_job_status', arguments: { job_id: job.job_id } };
  const res = await pollJob(pollInfo);
  
  const asset = res.assets?.[0];
  if (!asset?.sprite_url) {
    throw new Error(`No asset output found for ${key}`);
  }

  const rawDest = dest.replace('.png', '_sheet.png');
  await downloadImage(asset.sprite_url, rawDest);
  fs.copyFileSync(rawDest, dest);

  const manifest = loadManifest();
  manifest.assets.push({
    key,
    asset_id: asset.id || asset.asset_id,
    prompt,
    file_path: dest,
    sheet_path: rawDest,
    created_at: new Date().toISOString()
  });
  saveManifest(manifest);

  console.log(`[SUCCESS] Generated ${key} -> ${dest}`);
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
