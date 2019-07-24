import { ICollidableSource } from './types'
import calculateAABB from './helpers/calculateAABB'
import rectCornersFromAABB from './helpers/rectCornersFromAABB'
import BaseLevel from './levels/BaseLevel'

export default class Collider {
  public source: ICollidableSource
  public level: BaseLevel

  constructor(source: ICollidableSource, level: BaseLevel) {
    this.source = source
    this.level = level
  }

  public collision(
    obj: PIXI.DisplayObject,
    newX: number,
    newY: number,
    ignoredObjects: PIXI.DisplayObject[] = []
  ): PIXI.DisplayObject {
    const proposedAABB = calculateAABB(obj, newX, newY)

    const [prel1, prer1] = rectCornersFromAABB(proposedAABB)

    const l1 = {
      x: prel1.x,
      y: prel1.y
    }
    const r1 = {
      x: prer1.x,
      y: prer1.y
    }

    if (r1.x >= this.level.pixelWidth || l1.x <= 0 || r1.y >= this.level.pixelHeight || l1.y <= 0) {
      return new PIXI.DisplayObject()
    }

    const { collidable, objects } = this.source

    return Array.from(collidable).find(possible => {
      if (obj === possible || ignoredObjects.some(ignored => ignored === possible)) {
        return false
      }

      const [l2, r2] = rectCornersFromAABB(objects.get(possible).AABB)

      if (!(r1.x < l2.x || r2.x < l1.x || r1.y < l2.y || r2.y < l1.y)) {
        return possible
      } else {
        return false
      }
    })
  }
}
