import Phaser from 'phaser';
import type { GameSnapshot } from './contracts';
import type { Level } from '../game/types';

export class Markers {
  private graphics: Phaser.GameObjects.Graphics;
  constructor(
    scene: Phaser.Scene,
    private level: Level,
  ) {
    this.graphics = scene.add.graphics().setDepth(2);
    scene.add
      .text(level.depot.x, level.depot.y + 45, 'POST OFFICE', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#33594f',
        backgroundColor: '#f8f2e3',
        padding: { x: 7, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(3);
    level.deliveries.forEach((delivery, index) => {
      scene.add
        .text(delivery.x, delivery.y + 44, `${index + 1} · ${delivery.name.replace('The ', '')}`, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          fontStyle: 'bold',
          color: '#526158',
          backgroundColor: '#f8f2e3',
          padding: { x: 7, y: 4 },
        })
        .setOrigin(0.5)
        .setDepth(3);
    });
  }

  update(snapshot: GameSnapshot, time: number, reducedMotion: boolean): void {
    const g = this.graphics.clear();
    const pulse = reducedMotion || snapshot.phase !== 'playing' ? 0 : Math.sin(time / 280) * 3;
    const { x, y } = this.level.depot;
    if (!snapshot.carrying && snapshot.phase !== 'won') {
      g.lineStyle(3, 0x315f51, 0.35).strokeCircle(x, y, 32 + pulse);
    }
    g.fillStyle(0x263e35, 0.15).fillEllipse(x + 2, y + 16, 43, 17);
    g.fillStyle(0x456f5a).fillRoundedRect(x - 19, y - 17, 38, 38, 7);
    g.fillStyle(0xf4e6c7).fillRoundedRect(x - 12, y - 9, 24, 18, 3);
    g.lineStyle(2, 0x456f5a)
      .lineBetween(x - 12, y - 9, x, y + 1)
      .lineBetween(x, y + 1, x + 12, y - 9);
    g.fillStyle(0xe9b95e).fillRoundedRect(x - 8, y + 12, 16, 3, 1);
    this.level.deliveries.forEach((delivery, index) => {
      const done = snapshot.completedDeliveryIds.includes(delivery.id);
      const active = snapshot.carrying === delivery.id;
      g.fillStyle(0x263e35, 0.12).fillEllipse(delivery.x + 2, delivery.y + 17, 42, 16);
      if (active)
        g.lineStyle(3, delivery.color, 0.65).strokeCircle(delivery.x, delivery.y, 32 + pulse);
      g.fillStyle(done ? 0x5c9573 : delivery.color, done || active ? 1 : 0.48).fillCircle(
        delivery.x,
        delivery.y,
        23,
      );
      g.lineStyle(2, 0xfff8e8, 0.9).strokeCircle(delivery.x, delivery.y, 17);
      if (done) {
        g.lineStyle(3, 0xfff8e8).lineBetween(
          delivery.x - 8,
          delivery.y,
          delivery.x - 2,
          delivery.y + 6,
        );
        g.lineBetween(delivery.x - 2, delivery.y + 6, delivery.x + 9, delivery.y - 7);
      } else {
        // One, two or three dots keep destinations distinguishable without color.
        for (let dot = 0; dot <= index; dot++)
          g.fillStyle(0xfff8e8).fillCircle(delivery.x + (dot - index / 2) * 7, delivery.y, 2.5);
      }
    });
  }
}
