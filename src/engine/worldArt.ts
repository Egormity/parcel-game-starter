import Phaser from 'phaser';
import type { Level, Building } from '../game/types';

const FONT = 'Arial, sans-serif';

function building(scene: Phaser.Scene, item: Building): void {
  const { x, y, width, height } = item;
  const g = scene.add.graphics();
  g.fillStyle(0x394f47, 0.12).fillRoundedRect(x + 7, y + 10, width, height, 9);
  g.fillStyle(item.color).fillRoundedRect(x, y, width, height, 7);
  g.fillStyle(item.roof).fillRoundedRect(x - 5, y - 11, width + 10, 35, 6);
  g.fillStyle(0xffffff, 0.16).fillRect(x + 2, y - 7, width - 4, 3);
  for (let offset = 16; offset < width - 22; offset += 34) {
    g.fillStyle(0xfff7e6).fillRoundedRect(x + offset, y + 31, 17, 19, 3);
    g.lineStyle(2, item.roof).strokeRect(x + offset, y + 31, 17, 19);
  }
  scene.add
    .text(x + width / 2, y + 5, item.label, {
      fontFamily: FONT,
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#fff9ec',
      letterSpacing: 2,
    })
    .setOrigin(0.5);
}

export function drawWorld(scene: Phaser.Scene, level: Level): void {
  const ground = scene.add.graphics();
  ground.fillStyle(0xd3dfbb).fillRect(0, 0, 960, 640);
  ground.fillStyle(0xc4d3a7).fillRoundedRect(20, 20, 920, 600, 36);
  ground.fillStyle(0xd3dfbb).fillRoundedRect(32, 32, 896, 576, 30);
  // Deterministic speckles are artwork, never random gameplay state.
  for (let i = 0; i < 155; i++) {
    const x = 38 + ((i * 173) % 884);
    const y = 38 + ((i * 97) % 560);
    ground.fillStyle(i % 3 === 0 ? 0xadc294 : 0xe8edcd, 0.6).fillCircle(x, y, 1.6);
  }
  for (const road of level.roads) {
    ground
      .fillStyle(0xb5c69c)
      .fillRoundedRect(road.x - 5, road.y - 5, road.width + 10, road.height + 10, 20);
  }
  for (const road of level.roads) {
    ground.fillStyle(0xf1e9d6).fillRoundedRect(road.x, road.y, road.width, road.height, 16);
  }
  ground.lineStyle(2, 0xdccfb4, 0.75);
  for (const y of [128, 320, 512]) {
    for (let x = 222; x < 760; x += 28) ground.lineBetween(x, y, x + 10, y);
  }
  // Quiet streetside details; decorative canopies do not define physics.
  for (const tree of level.trees) {
    ground.fillStyle(0x657b4f, 0.13).fillEllipse(tree.x + 6, tree.y + 11, 54, 28);
    ground.fillStyle(0xa08863).fillRoundedRect(tree.x - 4, tree.y, 8, 20, 3);
    ground.fillStyle(0x88aa70).fillCircle(tree.x, tree.y - 6, 21);
    ground.fillStyle(0xa3bd84).fillCircle(tree.x - 7, tree.y - 12, 14);
    ground.fillStyle(0xc7d6a2, 0.7).fillCircle(tree.x - 10, tree.y - 16, 5);
  }
  for (const item of level.buildings) building(scene, item);
  scene.add
    .text(480, 42, level.name.toUpperCase(), {
      fontFamily: FONT,
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#607b51',
      letterSpacing: 4,
    })
    .setOrigin(0.5);
  scene.add
    .text(480, 596, 'TAKE THE SCENIC ROUTE', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#7e9567',
      letterSpacing: 3,
    })
    .setOrigin(0.5);
}
