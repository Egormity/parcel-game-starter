import Phaser from 'phaser';
import { LEVELS } from '../game/levels';
import { browserStorage, readBest, saveBest } from '../game/records';
import { GameSession } from '../game/session';
import { PLAYER_RADIUS, PLAYER_SPEED, WORLD, type Point } from '../game/types';
import { validateLevel } from '../game/validateLevel';
import type { GameOptions } from './contracts';
import type { Controls } from './controls';
import { CourierArt } from './courierArt';
import { Markers } from './markers';
import { drawWorld } from './worldArt';

export interface SceneServices {
  levelIndex: number;
  reducedMotion: boolean;
  disposed: boolean;
  options: GameOptions;
  controls: Controls;
}

export class DeliveryScene extends Phaser.Scene {
  private session?: GameSession;
  private body?: Phaser.Physics.Arcade.Body;
  private courier?: CourierArt;
  private markers?: Markers;
  private publishElapsed = 0;
  private storage = browserStorage();
  private ready = false;

  constructor(private services: SceneServices) {
    super('delivery');
  }

  create(): void {
    if (this.services.disposed) return;
    try {
      this.createWorld();
    } catch (error) {
      this.ready = false;
      this.services.controls.clear();
      this.body?.stop();
      this.physics.world.pause();
      this.services.options.onError(
        error instanceof Error ? error.message : 'The map could not be created.',
      );
    }
  }

  private createWorld(): void {
    const level = LEVELS[this.services.levelIndex];
    validateLevel(level);
    this.publishElapsed = 0;
    this.session = new GameSession(
      level,
      this.services.levelIndex,
      readBest(level.id, this.storage),
    );
    this.services.controls.clear();
    drawWorld(this, level);
    this.markers = new Markers(this, level);
    this.courier = new CourierArt(this);
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);
    const player = this.add.zone(
      level.spawn.x,
      level.spawn.y,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
    );
    this.physics.add.existing(player);
    this.body = player.body as Phaser.Physics.Arcade.Body;
    this.body.setCircle(PLAYER_RADIUS).setCollideWorldBounds(true);
    const walls = level.buildings.map((building) => {
      const wall = this.add.zone(
        building.x + building.width / 2,
        building.y + building.height / 2,
        building.width,
        building.height,
      );
      this.physics.add.existing(wall, true);
      return wall;
    });
    this.physics.add.collider(player, walls);
    this.events.on(Phaser.Scenes.Events.PRE_UPDATE, this.prepareInput, this);
    const world = this.physics.world;
    world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.step, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.ready = false;
      this.events.off(Phaser.Scenes.Events.PRE_UPDATE, this.prepareInput, this);
      // Arcade's shutdown listener may clear physics.world before ours runs.
      world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.step, this);
      this.services.controls.clear();
      this.body = undefined;
      this.session = undefined;
    });
    this.ready = true;
    this.publish();
    this.services.options.onReady();
  }

  private position(): Point {
    return this.body
      ? { x: this.body.center.x, y: this.body.center.y }
      : LEVELS[this.services.levelIndex].spawn;
  }

  private prepareInput(): void {
    const direction =
      this.session?.phase === 'playing' ? this.services.controls.vector() : { x: 0, y: 0 };
    this.body?.setVelocity(direction.x * PLAYER_SPEED, direction.y * PLAYER_SPEED);
  }

  private step(deltaSeconds: number): void {
    if (!this.session || this.services.disposed) return;
    this.session.tick(deltaSeconds * 1000);
    if (this.session.visitPosition(this.position())) {
      if (this.session.phase === 'won') {
        this.body?.stop();
        this.services.controls.clear();
        saveBest(this.session.level.id, this.session.elapsedMs, this.storage);
      }
      this.publish();
    }
  }

  update(time: number, delta: number): void {
    if (!this.ready || !this.session || this.services.disposed) return;
    const position = this.position();
    const direction =
      this.session.phase === 'playing' ? this.services.controls.vector() : { x: 0, y: 0 };
    this.courier?.update(
      position,
      direction,
      this.session.carrying !== null,
      time,
      this.services.reducedMotion,
    );
    this.markers?.update(this.session.snapshot(position), time, this.services.reducedMotion);
    this.publishElapsed += delta;
    if (this.publishElapsed >= 100) {
      this.publishElapsed = 0;
      this.publish();
    }
  }

  startRun(): void {
    if (!this.ready || !this.session) return;
    this.session.start();
    this.publish();
  }

  pauseRun(): void {
    if (!this.session) return;
    this.session.pause();
    this.services.controls.clear();
    this.body?.stop();
    this.publish();
  }

  resetRun(): void {
    if (!this.ready) return;
    this.pauseRun();
    this.scene.restart();
  }

  private publish(): void {
    if (this.session && !this.services.disposed)
      this.services.options.onSnapshot(this.session.snapshot(this.position()));
  }
}
