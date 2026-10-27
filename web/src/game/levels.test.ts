import { describe, expect, it } from 'vitest';
import { LEVELS } from './levels';
import { intersectsObstacle, validateLevel } from './validateLevel';
import type { Point } from './types';

function line(from: Point, to: Point): Point[] {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  return Array.from({ length: Math.ceil(length / 4) + 1 }, (_, index) => {
    const t = Math.min((index * 4) / length, 1);
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  });
}

describe('level definitions', () => {
  for (const level of LEVELS) {
    it(`${level.name} has a clear route from spawn to every delivery and back`, () => {
      expect(() => validateLevel(level)).not.toThrow();
      const waypoints: Point[] = [level.spawn, level.depot];
      for (const delivery of level.deliveries) {
        waypoints.push(
          { x: level.depot.x, y: delivery.y },
          delivery,
          { x: level.depot.x, y: delivery.y },
          level.depot,
        );
      }
      for (let index = 1; index < waypoints.length; index++) {
        if (
          waypoints[index - 1].x === waypoints[index].x &&
          waypoints[index - 1].y === waypoints[index].y
        )
          continue;
        for (const point of line(waypoints[index - 1], waypoints[index])) {
          expect(level.buildings.some((wall) => intersectsObstacle(point, wall))).toBe(false);
        }
      }
    });
  }
  it('rejects duplicate destination ids, blocked spawns, invalid bounds and empty levels', () => {
    const level = LEVELS[0];
    expect(() =>
      validateLevel({ ...level, deliveries: [level.deliveries[0], level.deliveries[0]] }),
    ).toThrow('unique');
    expect(() => validateLevel({ ...level, spawn: { x: 260, y: 210 } })).toThrow('walkable');
    expect(() =>
      validateLevel({ ...level, roads: [{ x: 0, y: 0, width: -1, height: 4 }] }),
    ).toThrow('rectangles');
    expect(() => validateLevel({ ...level, deliveries: [] })).toThrow('deliveries');
  });
});
