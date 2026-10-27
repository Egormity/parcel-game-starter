export type Direction = 'up' | 'down' | 'left' | 'right';
export type GamePhase = 'ready' | 'playing' | 'paused' | 'won';
export interface GameSnapshot {
  phase: GamePhase;
  levelIndex: number;
  levelName: string;
  delivered: number;
  total: number;
  carrying: string | null;
  elapsedMs: number;
  bestMs: number | null;
  hint: string;
  player: { x: number; y: number };
  completedDeliveryIds: readonly string[];
}
export interface GameController {
  start(): void;
  pause(): void;
  restart(): void;
  selectLevel(index: number): void;
  setDirection(direction: Direction, pressed: boolean): void;
  setReducedMotion(value: boolean): void;
  dispose(): void;
}
export interface GameOptions {
  onSnapshot(snapshot: GameSnapshot): void;
  onReady(): void;
  onError(message: string): void;
  reducedMotion: boolean;
}
