import { IAABB } from '../types'

export default function (
  obj: PIXI.DisplayObject,
  overrideX: number | null = null,
  overrideY: number | null = null
): IAABB {
  const bounds = obj.getLocalBounds()
  const hitArea: PIXI.Rectangle = obj.hitArea


  const x = overrideX || obj.x
  const y = overrideY || obj.y
  const aabb = {
    x: x + bounds.x * obj.scale.x,
    y: y + bounds.y * obj.scale.y,
    width: bounds.width * obj.scale.x,
    height: bounds.height * obj.scale.y
  }

  if (hitArea) {
    aabb.x += hitArea.x
    aabb.y += hitArea.y
    aabb.width += (hitArea.width - bounds.width)
    aabb.height += (hitArea.height - bounds.height)
  }

  return aabb
}
