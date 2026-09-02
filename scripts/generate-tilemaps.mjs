#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const TILE_SIZE = 32;
const TILESET_COLS = 16;
const TILESET_ROWS = 16;
const MAP_WIDTH = 15;
const MAP_HEIGHT = 15;

const STAGES = [
  { key: 'pantry', name: 'พานทรี่', color: 0x90c695, wall: 0x5a8c3f },
  { key: 'sink', name: 'อ่างล้าง', color: 0x7ab8d8, wall: 0x4a7aaf },
  { key: 'stove', name: 'เตาอบ', color: 0xe8a44a, wall: 0xc85a1a },
  { key: 'fridge', name: 'ตู้เย็น', color: 0x6fd0e8, wall: 0x2a9ace },
  { key: 'final_pantry', name: 'ห้องลับ', color: 0xb39cd8, wall: 0x7a4aaf },
];

// Generate tileset PNG
function generateTileset(stageKey, color, wallColor) {
  const canvas = createCanvas(TILE_SIZE * TILESET_COLS, TILE_SIZE * TILESET_ROWS);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw floor tiles (typical pattern)
  for(let ty = 0; ty < TILESET_ROWS; ty++) {
    for(let tx = 0; tx < TILESET_COLS; tx++) {
      const x = tx * TILE_SIZE;
      const y = ty * TILE_SIZE;
      const tileIdx = ty * TILESET_COLS + tx;

      // Different tile types based on index
      if(tileIdx === 0) {
        // Empty/transparent tile
        ctx.fillStyle = 'rgba(255,255,255,0)';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      } else if(tileIdx < 8) {
        // Floor variants
        ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#' + ((color & 0xfefefe) >> 1).toString(16).padStart(6, '0');
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      } else if(tileIdx < 16) {
        // Wall tiles
        ctx.fillStyle = '#' + wallColor.toString(16).padStart(6, '0');
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#' + ((wallColor & 0xfefefe) >> 1).toString(16).padStart(6, '0');
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      } else if(tileIdx < 24) {
        // Variant floor
        ctx.fillStyle = '#' + ((color & 0xfefefe) >> 1).toString(16).padStart(6, '0');
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#' + color.toString(16).padStart(6, '0');
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      } else {
        // Decoration/special
        ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
        ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        ctx.fillStyle = '#' + wallColor.toString(16).padStart(6, '0');
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 4, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  return canvas;
}

// Generate tilemap JSON (Tiled format)
function generateTilemapJSON(stageKey, stageName, width, height) {
  const tilemap = {
    compressionlevel: -1,
    height: height,
    infinite: false,
    layers: [
      // Background layer (visual)
      {
        data: generateLayerData(width, height, [1, 2, 3, 4, 5, 6, 7], 0),
        height: height,
        name: 'background',
        opacity: 1,
        type: 'tilelayer',
        visible: true,
        width: width,
        x: 0,
        y: 0,
      },
      // Collision layer
      {
        data: generateLayerData(width, height, [8, 9], 0.2),
        height: height,
        name: 'collision',
        opacity: 1,
        type: 'tilelayer',
        visible: true,
        width: width,
        x: 0,
        y: 0,
      },
      // Objects layer
      {
        name: 'objects',
        objects: generateObjects(stageKey),
        opacity: 1,
        type: 'objectgroup',
        visible: true,
        x: 0,
        y: 0,
      },
    ],
    nextlayerid: 4,
    nextobjectid: 10,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    tileheight: 32,
    tilewidth: 32,
    tilesets: [
      {
        firstgid: 1,
        source: `${stageKey}_32x32.tsx`,
      },
    ],
    type: 'map',
    version: '1.10',
  };

  return tilemap;
}

// Generate layer data (simple procedural pattern)
function generateLayerData(width, height, tileIds, density) {
  const data = [];
  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      if(y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        // Border walls
        data.push(tileIds[1] || 8);
      } else if(Math.random() < density) {
        data.push(tileIds[Math.floor(Math.random() * tileIds.length)]);
      } else {
        data.push(tileIds[0] || 1);
      }
    }
  }
  return data;
}

// Generate object layer spawn points
function generateObjects(stageKey) {
  const objects = [];

  // Player spawn at center
  objects.push({
    id: 1,
    name: 'player_spawn',
    type: '',
    x: 7.5 * 32,
    y: 7.5 * 32,
    width: 32,
    height: 32,
    visible: true,
  });

  // Mini boss spawn (random location away from center)
  objects.push({
    id: 2,
    name: 'mini_boss_spawn',
    type: '',
    x: 2 * 32,
    y: 2 * 32,
    width: 32,
    height: 32,
    visible: true,
    properties: [
      { name: 'type', type: 'string', value: 'brute' },
    ],
  });

  // Chest drop location
  objects.push({
    id: 3,
    name: 'chest_drop',
    type: '',
    x: 12 * 32,
    y: 12 * 32,
    width: 32,
    height: 32,
    visible: true,
  });

  return objects;
}

// Generate tileset TSX (tileset definition)
function generateTilesetTSX(stageKey) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="${stageKey}_tileset" tilewidth="32" tileheight="32" spacing="0" margin="0" tilecount="256" columns="16">
 <image source="${stageKey}_32x32.png" width="512" height="512"/>
 <tile id="1">
  <properties>
   <property name="collides" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="8">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
`;
}

// Main
async function main() {
  console.log('Generating tilemap assets for 5 stages...\n');

  for(const stage of STAGES) {
    // Generate tileset image
    console.log(`📦 Generating ${stage.key} tileset...`);
    const canvas = generateTileset(stage.key, stage.color, stage.wall);
    const buf = canvas.toBuffer('image/png');
    const tilesetPath = `assets/tilesets/${stage.key}_32x32.png`;
    fs.writeFileSync(tilesetPath, buf);
    console.log(`   ✓ Saved: ${tilesetPath} (${(buf.length / 1024).toFixed(1)}KB)`);

    // Generate TSX (tileset definition)
    const tsxPath = `assets/tilesets/${stage.key}_32x32.tsx`;
    fs.writeFileSync(tsxPath, generateTilesetTSX(stage.key));
    console.log(`   ✓ Saved: ${tsxPath}`);

    // Generate tilemap JSON
    const tilemapJSON = generateTilemapJSON(stage.key, stage.name, MAP_WIDTH, MAP_HEIGHT);
    const mapPath = `assets/maps/${stage.key}.json`;
    fs.writeFileSync(mapPath, JSON.stringify(tilemapJSON, null, 2));
    console.log(`   ✓ Saved: ${mapPath}\n`);
  }

  console.log('✅ All tilemap assets generated!');
  console.log('\nNext steps:');
  console.log('1. Boot.preload already loads these assets');
  console.log('2. setupTilemap() will use the tilemap JSON');
  console.log('3. Run game.js to test tilemap integration');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
