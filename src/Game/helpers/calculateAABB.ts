import { IAABB } from '../types'

export default function(
  obj: PIXI.DisplayObject,
  overrideX: number | null = null,
  overrideY: number | null = null
): IAABB {
  const bounds = obj.getLocalBounds()
  const x = overrideX || obj.x
  const y = overrideY || obj.y
  return {
    x: x + bounds.x * obj.scale.x,
    y: y + bounds.y * obj.scale.y,
    width: bounds.width * obj.scale.x,
    height: bounds.height * obj.scale.y
  }
}
