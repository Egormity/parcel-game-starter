import Phaser from 'phaser';
import { LEVELS } from '../game/levels';
import { WORLD } from '../game/types';
import type { GameController, GameOptions } from './contracts';
import { Controls } from './controls';
import { DeliveryScene, type SceneServices } from './DeliveryScene';

export function bootGame(host: HTMLElement, options: GameOptions): GameController {
  if (!document.createElement('canvas').getContext('2d')) {
    throw new Error('This browser cannot create a 2D canvas. Try a current browser.');
  }
  let scene: DeliveryScene | undefined;
  const controls = new Controls(host, () => scene?.pauseRun());
  const services: SceneServices = {
    levelIndex: 0,
    reducedMotion: options.reducedMotion,
    disposed: false,
    options,
    controls,
  };
  scene = new DeliveryScene(services);
  let game: Phaser.Game;
  try {
    game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: host,
      width: WORLD.width,
      height: WORLD.height,
      backgroundColor: '#d3dfbb',
      banner: false,
      audio: { noAudio: true },
      input: { keyboard: false, mouse: false, touch: false, gamepad: false },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 }, fps: 60, fixedStep: true, debug: false },
      },
      scene: [scene],
      render: { antialias: true, roundPixels: false },
    });
  } catch (error) {
    controls.dispose();
    throw error;
  }
  const focus = (): void => host.focus({ preventScroll: true });
  host.addEventListener('pointerdown', focus);
  const resize = new ResizeObserver(() => {
    if (!services.disposed) game.scale?.refresh();
  });
  resize.observe(host);
  return {
    start() {
      if (!services.disposed) {
        focus();
        scene?.startRun();
      }
    },
    pause() {
      if (!services.disposed) scene?.pauseRun();
    },
    restart() {
      if (!services.disposed) scene?.resetRun();
    },
    selectLevel(index) {
      if (services.disposed || !Number.isInteger(index) || index < 0 || index >= LEVELS.length)
        return;
      services.levelIndex = index;
      scene?.resetRun();
    },
    setDirection(direction, pressed) {
      if (!services.disposed) controls.set(direction, pressed);
    },
    setReducedMotion(value) {
      services.reducedMotion = value;
    },
    dispose() {
      if (services.disposed) return;
      services.disposed = true;
      controls.dispose();
      resize.disconnect();
      host.removeEventListener('pointerdown', focus);
      // Phaser completes destruction on its next frame. Keep its loop running until then.
      game.destroy(true, false);
    },
  };
}
