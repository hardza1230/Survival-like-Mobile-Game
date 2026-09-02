#!/usr/bin/env node
import fs from 'fs';
import { createCanvas } from 'canvas';

const FRAME_SIZE = 128;

// Character definitions
const CHARACTERS = [
  { key: 'char_momo_extended', name: 'Momo', emoji: '🍡', color: 0xff9ec4, accent: 0xffcde8 },
  { key: 'char_mint_extended', name: 'Mint', emoji: '🌿', color: 0x8fd0ff, accent: 0xb8e0ff },
  { key: 'char_cocoa_extended', name: 'Cocoa', emoji: '🍫', color: 0x8b5cf0, accent: 0xb89cff },
  { key: 'char_taro_extended', name: 'Taro', emoji: '🍠', color: 0xb388ff, accent: 0xd4b8ff },
  { key: 'char_sesame_extended', name: 'Sesame', emoji: '⚫', color: 0x8a8f9c, accent: 0xb0b5c8 },
];

const ENEMIES = [
  { key: 'e_basic_extended', name: 'Basic', emoji: '😠', color: 0xffc44d, accent: 0xffd980 },
  { key: 'e_fast_extended', name: 'Fast', emoji: '🏃', color: 0xff8fb5, accent: 0xffb5d9 },
  { key: 'e_tank_extended', name: 'Tank', emoji: '🛡️', color: 0xb0b5c8, accent: 0xd8dce8 },
  { key: 'e_shooter_extended', name: 'Shooter', emoji: '🎯', color: 0xffd166, accent: 0xffe599 },
  { key: 'e_bomber_extended', name: 'Bomber', emoji: '💣', color: 0xff6b6b, accent: 0xff9999 },
  { key: 'e_dasher_extended', name: 'Dasher', emoji: '⚡', color: 0xff8c42, accent: 0xffb380 },
  { key: 'e_siege_extended', name: 'Siege', emoji: '🔨', color: 0xc77dff, accent: 0xe0b0ff },
];

const BOSSES = [
  { key: 'boss1_extended', name: 'Boss 1', emoji: '👹', color: 0xff5a6b, accent: 0xff8fa3 },
  { key: 'boss2_extended', name: 'Boss 2', emoji: '👺', color: 0xffa54d, accent: 0xffc480 },
  { key: 'boss3_extended', name: 'Boss 3', emoji: '😈', color: 0xff6b8a, accent: 0xffa3b5 },
  { key: 'boss4_extended', name: 'Boss 4', emoji: '💀', color: 0x8fa3b8, accent: 0xb8cde8 },
  { key: 'boss5_extended', name: 'Boss 5', emoji: '👻', color: 0xe0b0ff, accent: 0xf0d8ff },
];

// Helper to convert hex color to RGB
function hexToRgb(hex) {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return { r, g, b };
}

// Helper to draw a mochi-like character
function drawCharacter(ctx, x, y, size, color, accent, pose, isEnemy = false) {
  const { r, g, b } = hexToRgb(color);
  const { r: ar, g: ag, b: ab } = hexToRgb(accent);

  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);

  // Apply pose transformations
  if (pose === 'idle') {
    // Slight bounce
    ctx.translate(0, Math.sin(Date.now() / 500) * 2);
  } else if (pose === 'walk') {
    ctx.rotate(Math.sin(Date.now() / 300) * 0.1);
    ctx.translate(0, Math.sin(Date.now() / 300) * 3);
  } else if (pose === 'run') {
    ctx.rotate(Math.sin(Date.now() / 200) * 0.15);
    ctx.translate(0, Math.sin(Date.now() / 200) * 5);
  } else if (pose === 'attack') {
    ctx.scale(1.1, 0.95);
  } else if (pose === 'hurt') {
    ctx.scale(0.9, 1.05);
  }

  // Body (main mochi-like shape)
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.35, size * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight/shine
  ctx.fillStyle = `rgb(${Math.min(255, ar + 30)},${Math.min(255, ag + 30)},${Math.min(255, ab + 30)})`;
  ctx.beginPath();
  ctx.ellipse(-size * 0.12, -size * 0.15, size * 0.15, size * 0.2, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-size * 0.15, -size * 0.08, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.15, -size * 0.08, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-size * 0.12, -size * 0.1, size * 0.03, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.18, -size * 0.1, size * 0.03, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (varies by pose)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = size * 0.03;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (pose === 'idle' || pose === 'walk') {
    ctx.arc(0, size * 0.1, size * 0.12, 0, Math.PI);
  } else if (pose === 'run') {
    ctx.moveTo(-size * 0.1, size * 0.08);
    ctx.lineTo(size * 0.1, size * 0.08);
  } else if (pose === 'attack') {
    ctx.moveTo(-size * 0.15, size * 0.12);
    ctx.lineTo(size * 0.15, size * 0.12);
  } else if (pose === 'hurt') {
    ctx.moveTo(-size * 0.08, size * 0.12);
    ctx.lineTo(size * 0.08, size * 0.12);
  }
  ctx.stroke();

  // Blush (on non-enemy characters)
  if (!isEnemy) {
    ctx.fillStyle = `rgba(255, 150, 180, 0.4)`;
    ctx.beginPath();
    ctx.ellipse(-size * 0.28, 0, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.28, 0, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Generate character sprite sheet (36 frames)
function generateCharacterSheet(char) {
  const poses = ['idle', 'idle', 'idle', 'idle', 'idle', 'idle', // 6 idle frames
    'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', // 8 walk frames
    'run', 'run', 'run', 'run', 'run', 'run', 'run', 'run', // 8 run frames
    'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', // 10 attack frames
    'hurt', 'hurt', 'hurt', 'hurt']; // 4 hurt frames

  const canvas = createCanvas(FRAME_SIZE * 14, FRAME_SIZE * 3);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  poses.forEach((pose, idx) => {
    const col = idx % 14;
    const row = Math.floor(idx / 14);
    const x = col * FRAME_SIZE;
    const y = row * FRAME_SIZE;

    // Draw frame background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y, FRAME_SIZE, FRAME_SIZE);

    // Draw character
    drawCharacter(ctx, x, y, FRAME_SIZE * 0.6, char.color, char.accent, pose, false);

    // Frame label (small text)
    ctx.fillStyle = '#999999';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(idx.toString(), x + 4, y + 14);
  });

  return canvas;
}

// Generate enemy sprite sheet (24 frames)
function generateEnemySheet(enemy) {
  const poses = ['idle', 'idle', 'idle', 'idle', 'idle', 'idle', // 6 idle
    'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', // 8 walk
    'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack']; // 10 attack

  const canvas = createCanvas(FRAME_SIZE * 12, FRAME_SIZE * 2);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  poses.forEach((pose, idx) => {
    const col = idx % 12;
    const row = Math.floor(idx / 12);
    const x = col * FRAME_SIZE;
    const y = row * FRAME_SIZE;

    // Draw frame background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y, FRAME_SIZE, FRAME_SIZE);

    // Draw enemy
    drawCharacter(ctx, x, y, FRAME_SIZE * 0.6, enemy.color, enemy.accent, pose, true);

    // Frame label
    ctx.fillStyle = '#999999';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(idx.toString(), x + 4, y + 14);
  });

  return canvas;
}

// Generate boss sprite sheet (24 frames)
function generateBossSheet(boss) {
  const poses = ['idle', 'idle', 'idle', 'idle', 'idle', 'idle', // 6 idle
    'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack', 'attack']; // 18 attack

  const canvas = createCanvas(FRAME_SIZE * 12, FRAME_SIZE * 2);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  poses.forEach((pose, idx) => {
    const col = idx % 12;
    const row = Math.floor(idx / 12);
    const x = col * FRAME_SIZE;
    const y = row * FRAME_SIZE;

    // Draw frame background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y, FRAME_SIZE, FRAME_SIZE);

    // Draw boss (slightly larger)
    drawCharacter(ctx, x, y, FRAME_SIZE * 0.7, boss.color, boss.accent, pose, true);

    // Frame label
    ctx.fillStyle = '#999999';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(idx.toString(), x + 4, y + 14);
  });

  return canvas;
}

// Main
async function main() {
  console.log('Generating extended sprite sheets for Phase 4...\n');

  // Characters (36 frames each)
  console.log('👥 Generating character sprite sheets (36 frames each)...');
  for (const char of CHARACTERS) {
    console.log(`   ${char.emoji} ${char.name}`);
    const canvas = generateCharacterSheet(char);
    const buf = canvas.toBuffer('image/png');
    const path = `assets/${char.key}.png`;
    fs.writeFileSync(path, buf);
    console.log(`      ✓ ${path} (${(buf.length / 1024).toFixed(1)}KB)`);
  }

  // Enemies (24 frames each)
  console.log('\n👿 Generating enemy sprite sheets (24 frames each)...');
  for (const enemy of ENEMIES) {
    console.log(`   ${enemy.emoji} ${enemy.name}`);
    const canvas = generateEnemySheet(enemy);
    const buf = canvas.toBuffer('image/png');
    const path = `assets/${enemy.key}.png`;
    fs.writeFileSync(path, buf);
    console.log(`      ✓ ${path} (${(buf.length / 1024).toFixed(1)}KB)`);
  }

  // Bosses (24 frames each)
  console.log('\n👹 Generating boss sprite sheets (24 frames each)...');
  for (const boss of BOSSES) {
    console.log(`   ${boss.emoji} ${boss.name}`);
    const canvas = generateBossSheet(boss);
    const buf = canvas.toBuffer('image/png');
    const path = `assets/${boss.key}.png`;
    fs.writeFileSync(path, buf);
    console.log(`      ✓ ${path} (${(buf.length / 1024).toFixed(1)}KB)`);
  }

  console.log('\n✅ All extended sprite sheets generated!');
  console.log('\nFrame Layout:');
  console.log('  Characters (36 frames):');
  console.log('    - Idle: 6 frames (0-5)');
  console.log('    - Walk: 8 frames (6-13)');
  console.log('    - Run: 8 frames (14-21)');
  console.log('    - Attack: 10 frames (22-31)');
  console.log('    - Hurt: 4 frames (32-35)');
  console.log('  Enemies (24 frames):');
  console.log('    - Idle: 6 frames (0-5)');
  console.log('    - Walk: 8 frames (6-13)');
  console.log('    - Attack: 10 frames (14-23)');
  console.log('  Bosses (24 frames):');
  console.log('    - Idle: 6 frames (0-5)');
  console.log('    - Attack: 18 frames (6-23)');
  console.log('\nReady for testing! Animations will auto-play when game loads.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
