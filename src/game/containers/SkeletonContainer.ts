import stores from '../../stores'
import { Facing, Direction } from '../types'
import movementMatrix from '../constants/movementMatrix'
import Collider from '../Collider'
import Skeleton from '../../textures/Skeleton'
import getRandomInt from '../helpers/getRandomInt'
import { AnimatableContainer } from './AnimatableContainer'
import TextureCache from '../../textures/TextureCache'
import withHp, { IWithHp } from '../decorators/withHp'
import withLighting from '../decorators/withLighting'

@withLighting(true)
@withHp(10)
class SkeletonContainer extends AnimatableContainer {
  private walkFrames: number = getRandomInt(120) + 40
  private chillFrames: number = getRandomInt(180) + 40

  constructor(x: number, y: number) {
    super(x, y, 1)
    this.sprite.hitArea = new PIXI.Rectangle(0, 0, 32, 32)
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    if (!this.sprite.visible || !this.sprite.renderable) {
      return []
    }

    if (this.walkFrames > 0) {
      let direction: Direction

      if (this.facing === Facing.UP) direction = Direction.UP
      if (this.facing === Facing.DOWN) direction = Direction.DOWN
      if (this.facing === Facing.LEFT) direction = Direction.LEFT
      if (this.facing === Facing.RIGHT) direction = Direction.RIGHT

      this.move(delta * this.movementSpeed, direction, collider)

      this.walkFrames -= delta

      return [this.sprite]
    }

    if (this.chillFrames > 0) {
      if (this.sprite.playing) this.sprite.stop()
      this.chillFrames -= delta

      return []
    }

    if (this.walkFrames <= 0 && this.chillFrames <= 0) {
      this.walkFrames = getRandomInt(120) + 40
      this.chillFrames = getRandomInt(180) + 40

      const random = getRandomInt(4)

      const facing = [Facing.UP, Facing.DOWN, Facing.LEFT, Facing.RIGHT][random]
      this.setFacing(facing)

      return [this.sprite]
    }

    return []
  }

  public receiveDamage(_damage: number, hp: number): void {
    if (hp <= 0) {
      stores.gameStateStore.viewport.removeChild(this.sprite)
      stores.gameStateStore.cullMask.removeObject(this.sprite)
      stores.gameStateStore.lightableObjects.delete(this)
    }
  }

  protected get texturePack(): TextureCache {
    return Skeleton
  }

  private move(moveBy: number, direction: Direction, collider: Collider): void {
    const [xMod, yMod] = movementMatrix[direction]

    const proposedX = this.sprite.x + xMod * moveBy
    const proposedY = this.sprite.y + yMod * moveBy

    if (!collider.collision(this.sprite, proposedX, proposedY)) {
      if (!this.sprite.playing) this.sprite.play()
      this.sprite.x = proposedX
      this.sprite.y = proposedY
    } else {
      this.sprite.stop()
      const random = getRandomInt(4)
      const facing = [Facing.UP, Facing.DOWN, Facing.LEFT, Facing.RIGHT][random]
      this.setFacing(facing)
    }
  }
}

// @ts-ignore
// tslint:disable: no-empty-interface
// tslint:disable: interface-name
interface SkeletonContainer extends IWithHp { }
// tslint:enable: no-empty-interface
// tslint:enable: interface-name

export default SkeletonContainer
