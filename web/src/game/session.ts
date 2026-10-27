import type { GamePhase, GameSnapshot } from '../engine/contracts';
import { TRIGGER_RADIUS, type Level, type Point } from './types';

export class GameSession {
  phase: GamePhase = 'ready';
  elapsedMs = 0;
  carrying: string | null = null;
  private delivered = new Set<string>();

  constructor(
    readonly level: Level,
    readonly levelIndex: number,
    public bestMs: number | null,
  ) {}

  start(): void {
    if (this.phase === 'ready' || this.phase === 'paused') this.phase = 'playing';
  }

  pause(): void {
    if (this.phase === 'playing') this.phase = 'paused';
  }

  tick(deltaMs: number): void {
    if (this.phase === 'playing' && Number.isFinite(deltaMs) && deltaMs > 0)
      this.elapsedMs += deltaMs;
  }

  visitDepot(): boolean {
    if (this.phase !== 'playing' || this.carrying) return false;
    const next = this.level.deliveries.find((delivery) => !this.delivered.has(delivery.id));
    if (!next) return false;
    this.carrying = next.id;
    return true;
  }

  visitRecipient(id: string): boolean {
    if (this.phase !== 'playing' || this.carrying !== id || this.delivered.has(id)) return false;
    this.delivered.add(id);
    this.carrying = null;
    if (this.delivered.size === this.level.deliveries.length) {
      this.phase = 'won';
      this.bestMs = this.bestMs === null ? this.elapsedMs : Math.min(this.elapsedMs, this.bestMs);
    }
    return true;
  }

  visitPosition(point: Point): boolean {
    let changed = false;
    if (Math.hypot(point.x - this.level.depot.x, point.y - this.level.depot.y) <= TRIGGER_RADIUS)
      changed = this.visitDepot();
    for (const delivery of this.level.deliveries) {
      if (Math.hypot(point.x - delivery.x, point.y - delivery.y) <= TRIGGER_RADIUS)
        changed = this.visitRecipient(delivery.id) || changed;
    }
    return changed;
  }

  snapshot(player: Point): GameSnapshot {
    const target = this.level.deliveries.find((delivery) => delivery.id === this.carrying);
    const hint =
      this.phase === 'won'
        ? 'Every parcel delivered. A little town, a job well done.'
        : target
          ? `Take your parcel to ${target.name.toLowerCase()}.`
          : 'Return to the post office for your next parcel.';
    return {
      phase: this.phase,
      levelIndex: this.levelIndex,
      levelName: this.level.name,
      delivered: this.delivered.size,
      total: this.level.deliveries.length,
      carrying: this.carrying,
      elapsedMs: this.elapsedMs,
      bestMs: this.bestMs,
      hint,
      player: { ...player },
      completedDeliveryIds: [...this.delivered],
    };
  }
}
