import { NetEntity, Vector } from '../models';

export function entityDistance(
  leftEntity: NetEntity,
  rightEntity: NetEntity
): number {
  return pointDistance(leftEntity.position, rightEntity.position);
};

export function pointDistance(
  a: Vector,
  b: Vector
): number {
  return distance(a.x, a.y, b.x, b.y);
}

export function distance(
  xa: number, ya: number,
  xb: number, yb: number
): number {
  return Math.sqrt(
    Math.pow(xb - xa, 2) +
    Math.pow(yb - ya, 2)
  );
}
