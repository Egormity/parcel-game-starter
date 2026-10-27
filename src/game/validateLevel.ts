import { PLAYER_RADIUS, WORLD, type Level, type Point, type Rectangle } from './types';

export function intersectsObstacle(
  point: Point,
  rectangle: Rectangle,
  radius = PLAYER_RADIUS,
): boolean {
  const closestX = Math.max(rectangle.x, Math.min(point.x, rectangle.x + rectangle.width));
  const closestY = Math.max(rectangle.y, Math.min(point.y, rectangle.y + rectangle.height));
  return Math.hypot(point.x - closestX, point.y - closestY) < radius;
}

export function validateLevel(level: Level): void {
  if (!level.id || !level.name || !level.deliveries.length)
    throw new Error('A level needs an id, name and deliveries.');
  const ids = new Set<string>();
  for (const delivery of level.deliveries) {
    if (!delivery.id || ids.has(delivery.id))
      throw new Error('Delivery ids must be unique and nonempty.');
    ids.add(delivery.id);
  }
  for (const rectangle of [...level.roads, ...level.buildings]) {
    if (
      ![rectangle.x, rectangle.y, rectangle.width, rectangle.height].every(Number.isFinite) ||
      rectangle.width <= 0 ||
      rectangle.height <= 0 ||
      rectangle.x < 0 ||
      rectangle.y < 0 ||
      rectangle.x + rectangle.width > WORLD.width ||
      rectangle.y + rectangle.height > WORLD.height
    ) {
      throw new Error('Map rectangles must fit inside the world.');
    }
  }
  for (const point of [level.spawn, level.depot, ...level.deliveries]) {
    if (
      ![point.x, point.y].every(Number.isFinite) ||
      point.x < PLAYER_RADIUS ||
      point.y < PLAYER_RADIUS ||
      point.x > WORLD.width - PLAYER_RADIUS ||
      point.y > WORLD.height - PLAYER_RADIUS ||
      level.buildings.some((rectangle) => intersectsObstacle(point, rectangle))
    ) {
      throw new Error('Spawn and delivery points must be walkable.');
    }
  }
}
