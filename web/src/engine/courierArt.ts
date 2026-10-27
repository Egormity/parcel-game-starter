import Phaser from 'phaser';
import type { Point } from '../game/types';

export class CourierArt {
  private graphics: Phaser.GameObjects.Graphics;
  private facing = { x: 0, y: 1 };
  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics().setDepth(10);
  }
  update(
    position: Point,
    direction: Point,
    carrying: boolean,
    time: number,
    reducedMotion: boolean,
  ): void {
    if (direction.x || direction.y) this.facing = direction;
    const moving = direction.x !== 0 || direction.y !== 0;
    const bob = !reducedMotion && moving ? Math.sin(time / 75) * 1.6 : 0;
    const g = this.graphics.clear().setPosition(position.x, position.y);
    g.fillStyle(0x2e4239, 0.18).fillEllipse(1, 12, 28, 12);
    g.fillStyle(0x394e48)
      .fillRoundedRect(-9, 7 + bob, 7, 11, 3)
      .fillRoundedRect(3, 7 - bob, 7, 11, 3);
    g.fillStyle(0xe8a34c).fillRoundedRect(-13, -9 + bob, 26, 24, 9);
    g.fillStyle(0xf7d9ad).fillCircle(this.facing.x * 3, -15 + bob + this.facing.y, 11);
    g.fillStyle(0x406b58).fillRoundedRect(-12, -27 + bob, 24, 12, 6);
    g.fillStyle(0x315544).fillRoundedRect(-4 + this.facing.x * 8, -19 + bob, 16, 4, 2);
    g.fillStyle(0xfff8e9).fillCircle(0, -23 + bob, 2);
    if (carrying) {
      g.fillStyle(0xc99c68).fillRoundedRect(-9, 0 + bob, 18, 14, 2);
      g.fillStyle(0xf5ddae).fillRect(-2, 0 + bob, 4, 14);
      g.lineStyle(1, 0x956e42).strokeRoundedRect(-9, 0 + bob, 18, 14, 2);
    }
  }
}
