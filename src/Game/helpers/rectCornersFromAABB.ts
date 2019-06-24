import { IAABB, IPoint } from '../types'

export default function(aabb: IAABB): IPoint[] {
  const l1 = { x: aabb.x, y: aabb.y }
  const r1 = { x: aabb.x + aabb.width, y: aabb.y + aabb.height }

  return [l1, r1]
}
