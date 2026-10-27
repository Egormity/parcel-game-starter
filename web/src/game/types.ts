export interface Point {
  x: number;
  y: number;
}
export interface Rectangle extends Point {
  width: number;
  height: number;
}
export interface Building extends Rectangle {
  color: number;
  roof: number;
  label: string;
}
export interface Delivery extends Point {
  id: string;
  name: string;
  color: number;
}
export interface Level {
  id: string;
  name: string;
  subtitle: string;
  spawn: Point;
  depot: Point;
  roads: readonly Rectangle[];
  buildings: readonly Building[];
  deliveries: readonly Delivery[];
  trees: readonly Point[];
}
export const WORLD = { width: 960, height: 640 } as const;
export const PLAYER_RADIUS = 13;
export const PLAYER_SPEED = 220;
export const TRIGGER_RADIUS = 32;
