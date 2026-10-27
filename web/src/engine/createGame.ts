import type { GameController, GameOptions } from './contracts';
import { LEVELS } from '../game/levels';
import { validateLevel } from '../game/validateLevel';

export async function createGame(host: HTMLElement, options: GameOptions): Promise<GameController> {
  // Check before importing Phaser: a failed module evaluation cannot be retried in place.
  if (!document.createElement('canvas').getContext('2d')) {
    throw new Error('This browser cannot create a 2D canvas. Try a current browser.');
  }
  LEVELS.forEach(validateLevel);
  const { bootGame } = await import('./runtime');
  return bootGame(host, options);
}
