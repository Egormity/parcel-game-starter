import { describe, expect, it } from 'vitest';
import { LEVELS } from './levels';
import { GameSession } from './session';
import { TRIGGER_RADIUS } from './types';

const level = LEVELS[0];
const position = level.spawn;

describe('delivery session', () => {
  it('keeps ready and paused sessions inert, then resumes without losing progress', () => {
    const session = new GameSession(level, 0, null);
    session.tick(1000);
    expect(session.visitDepot()).toBe(false);
    expect(session.elapsedMs).toBe(0);
    session.start();
    expect(session.visitDepot()).toBe(true);
    session.tick(1000);
    session.pause();
    session.tick(2000);
    expect(session.visitRecipient(level.deliveries[0].id)).toBe(false);
    expect(session.elapsedMs).toBe(1000);
    session.start();
    expect(session.visitRecipient(level.deliveries[0].id)).toBe(true);
  });

  it('rejects the wrong destination and duplicate delivery, preserving the current parcel', () => {
    const session = new GameSession(level, 0, null);
    session.start();
    session.visitDepot();
    expect(session.visitRecipient(level.deliveries[1].id)).toBe(false);
    expect(session.carrying).toBe(level.deliveries[0].id);
    expect(session.visitDepot()).toBe(false);
    expect(session.visitRecipient(level.deliveries[0].id)).toBe(true);
    expect(session.visitRecipient(level.deliveries[0].id)).toBe(false);
    session.visitDepot();
    expect(session.carrying).toBe(level.deliveries[1].id);
    expect(session.snapshot(position).delivered).toBe(1);
  });

  it('completes all deliveries and freezes the final run time', () => {
    const session = new GameSession(level, 0, 2000);
    session.start();
    for (const delivery of level.deliveries) {
      session.visitDepot();
      session.tick(1000);
      session.visitRecipient(delivery.id);
    }
    expect(session.phase).toBe('won');
    expect(session.bestMs).toBe(2000);
    session.tick(1000);
    session.start();
    expect(session.phase).toBe('won');
    expect(session.elapsedMs).toBe(3000);
    expect(session.snapshot(position).delivered).toBe(3);
  });

  it('records a faster completed run and creates a clean session on restart', () => {
    const session = new GameSession(level, 0, 10_000);
    session.start();
    for (const delivery of level.deliveries) {
      session.visitDepot();
      session.tick(1000);
      session.visitRecipient(delivery.id);
    }
    expect(session.bestMs).toBe(3000);
    const restarted = new GameSession(level, 0, session.bestMs);
    expect(restarted.snapshot(position)).toMatchObject({
      phase: 'ready',
      delivered: 0,
      carrying: null,
      elapsedMs: 0,
      bestMs: 3000,
    });
  });

  it('triggers pickup only inside the depot radius and destination delivery only nearby', () => {
    const session = new GameSession(level, 0, null);
    session.start();
    expect(session.visitPosition({ x: level.depot.x + TRIGGER_RADIUS + 1, y: level.depot.y })).toBe(
      false,
    );
    expect(session.visitPosition(level.depot)).toBe(true);
    expect(session.visitPosition(level.spawn)).toBe(false);
    expect(session.visitPosition(level.deliveries[0])).toBe(true);
  });

  it('publishes detached snapshots and ignores invalid time increments', () => {
    const session = new GameSession(level, 0, null);
    session.start();
    session.visitDepot();
    session.visitRecipient(level.deliveries[0].id);
    const snapshot = session.snapshot(position);
    snapshot.player.x = -999;
    (snapshot.completedDeliveryIds as string[]).push('invented');
    expect(session.snapshot(position).player.x).toBe(position.x);
    expect(session.snapshot(position).completedDeliveryIds).toHaveLength(1);
    for (const value of [NaN, Infinity, -5]) session.tick(value);
    expect(session.elapsedMs).toBe(0);
  });
});
