import { CollidableSource } from "./types";
import calculateAABB from "./helpers/calculateAABB";
import rectCornersFromAABB from "./helpers/rectCornersFromAABB";

const TOP_HITBOX_CHILL_FACTOR = 5;
const BOTTOM_HITBOX_CHILL_FACTOR = 3;

export default class Collider {
  source: CollidableSource;

  constructor(source: CollidableSource) {
    this.source = source
  }

  public collision(obj: PIXI.DisplayObject, newX: number, newY: number): boolean {
    const proposedAABB = calculateAABB(obj, newX, newY);

    const [prel1, prer1] = rectCornersFromAABB(proposedAABB);

    const l1 = { x: prel1.x + TOP_HITBOX_CHILL_FACTOR, y: prel1.y + TOP_HITBOX_CHILL_FACTOR }
    const r1 = { x: prer1.x - BOTTOM_HITBOX_CHILL_FACTOR, y: prer1.y - BOTTOM_HITBOX_CHILL_FACTOR }

    const { collidable, objects } = this.source;

    return Array.from(collidable).some(possible => {
      if(obj === possible) return false;

      const [l2, r2] = rectCornersFromAABB(objects.get(possible).AABB);

      return !(r1.x < l2.x || r2.x < l1.x || r1.y < l2.y || r2.y < l1.y);
    })
  }
}
