import { ICollidableSource } from './types'
import calculateAABB from './helpers/calculateAABB'
import rectCornersFromAABB from './helpers/rectCornersFromAABB'

const TOP_HITBOX_CHILL_FACTOR = 5
const BOTTOM_HITBOX_CHILL_FACTOR = 2

// TODO: Involve level bounds
export default class Collider {
  public source: ICollidableSource

  constructor(source: ICollidableSource) {
    this.source = source
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
