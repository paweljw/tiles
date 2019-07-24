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
import { TILE_WIDTH, TILE_HEIGHT } from '../constants/tilemap'
import midpointRealCoords from '../helpers/midpointRealCoords'
import tileMovementMatrix from '../constants/tileMovementMatrix'

const MOVEMENT_SPEED = 2

@withLighting(true)
@withHp(10)
class SkeletonContainer extends AnimatableContainer {
  private walkFrames: number = getRandomInt(120) + 40
  private chillFrames: number = getRandomInt(180) + 40
  private movingAnimation: boolean = false
  private movingDirection: Direction = Direction.UP
  private movementAnimationFramesRemaining = 0

  constructor(x: number, y: number) {
    super(x, y, 1)
    this.sprite.hitArea = new PIXI.Rectangle(0, 0, TILE_WIDTH, TILE_HEIGHT)
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    if (!this.sprite.visible || !this.sprite.renderable) {
      return []
    }

    const moveBy = delta * MOVEMENT_SPEED

    if (this.movingAnimation) {
      this.movementAnimationFramesRemaining -= delta

      if (this.movementAnimationFramesRemaining <= 0) {
        const { x, y } = midpointRealCoords({ x: this.tileX, y: this.tileY })
        this.sprite.x = x
        this.sprite.y = y
        this.movementAnimationFramesRemaining = 0
        this.movingAnimation = false
        this.movingDirection = null
        this.chillFrames = getRandomInt(180) + 40
        this.sprite.stop()
      } else {
        this.move(moveBy, this.movingDirection, collider)
      }

      return [this.sprite]
    }

    if (this.chillFrames > 0) {
      this.chillFrames -= delta
      return []
    } else {
      this.chillFrames = 0
      const { tileCollider } = stores.gameStateStore
      const random = getRandomInt(4)
      const facing = [Facing.UP, Facing.DOWN, Facing.LEFT, Facing.RIGHT][random]
      this.setFacing(facing)

      let direction: Direction

      if (this.facing === Facing.UP) direction = Direction.UP
      if (this.facing === Facing.DOWN) direction = Direction.DOWN
      if (this.facing === Facing.LEFT) direction = Direction.LEFT
      if (this.facing === Facing.RIGHT) direction = Direction.RIGHT

      const [tileMaskX, tileMaskY] = tileMovementMatrix[direction]

      const newTileX = this.tileX + tileMaskX
      const newTileY = this.tileY + tileMaskY

      if (!tileCollider.collideAt({ x: newTileX, y: newTileY })) {
        this.sprite.play()
        this.movingAnimation = true
        this.movingDirection = direction
        this.movementAnimationFramesRemaining = TILE_HEIGHT / MOVEMENT_SPEED
        this.tileX = newTileX
        this.tileY = newTileY
      } else {
        this.chillFrames = getRandomInt(180) + 40
      }

      return [this.sprite]
    }
  }

  public receiveDamage(_damage: number, hp: number): void {
    stores.gameStateStore.sounds.playSound('bone_hit_sound', { force: true })
    if (hp <= 0) {
      stores.gameStateStore.viewport.removeChild(this.sprite)
      stores.gameStateStore.cullMask.removeObject(this.sprite)
      stores.gameStateStore.tileCollider.removeContainer(this)
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

    this.sprite.x = proposedX
    this.sprite.y = proposedY
  }
}

// @ts-ignore
// tslint:disable: no-empty-interface
// tslint:disable: interface-name
interface SkeletonContainer extends IWithHp { }
// tslint:enable: no-empty-interface
// tslint:enable: interface-name

export default SkeletonContainer
