import Character from '../../textures/Character'
import stores from '../../stores'
import { Direction } from '../types'
import movementMatrix from '../constants/movementMatrix'
import Collider from '../Collider'
import { MissileContainer } from './MissileContainer'
import { AnimatableContainer } from './AnimatableContainer'
import TextureCache from '../../textures/TextureCache'
import tileMovementMatrix from '../constants/tileMovementMatrix'
import midpointRealCoords from '../helpers/midpointRealCoords'
import { TILE_HEIGHT } from '../constants/tilemap'

const Keyboard = stores.keyboardStore
const MOVEMENT_SPEED = 4

export class CharacterContainer extends AnimatableContainer {
  private gcd: number = 0
  private movingAnimation: boolean = false
  private movingDirection: Direction = Direction.UP
  private movementAnimationFramesRemaining = 0

  constructor(x: number, y: number) {
    super(x, y, MOVEMENT_SPEED)
    this.sprite.tint = 0xeeeeee
    this.sprite.hitArea = new PIXI.Rectangle(2, 0, 32, 36)
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    const { tileCollider } = stores.gameStateStore
    const moveBy = delta * this.movementSpeed

    let newGcd = this.gcd -= delta
    if (newGcd < 0) newGcd = 0
    this.gcd = newGcd

    Keyboard.update()

    if (this.gcd === 0 && Keyboard.isFiring) {
      stores.gameStateStore.steppables.add(new MissileContainer(this.sprite.x, this.sprite.y, Keyboard.direction))
      this.gcd = 20
    }

    if (this.movingAnimation) {
      this.movementAnimationFramesRemaining -= delta

      if (this.movementAnimationFramesRemaining <= 0) {
        const { x, y } = midpointRealCoords({ x: this.tileX, y: this.tileY })
        this.sprite.x = x
        this.sprite.y = y
        this.movementAnimationFramesRemaining = 0
        this.movingAnimation = false
        this.movingDirection = null
      } else {
        this.move(moveBy, this.movingDirection, collider)
      }

      return [this.sprite]
    } else {
      if (Keyboard.isMoving) {
        this.setFacing(Keyboard.facing)
        if (Keyboard.direction !== this.movingDirection) {
          this.movingDirection = Keyboard.direction
          return [this.sprite]
        }

        if (!this.sprite.playing) {
          this.sprite.play()
        }
        // select tile by direction

        const [tileMaskX, tileMaskY] = tileMovementMatrix[Keyboard.direction]

        const newTileX = this.tileX + tileMaskX
        const newTileY = this.tileY + tileMaskY

        stores.gameStateStore.sounds.playSound('step_sound', { force: true, volume: 0.1 })

        if (!tileCollider.collideAt({ x: newTileX, y: newTileY })) {
          this.movingAnimation = true
          this.movingDirection = Keyboard.direction
          this.movementAnimationFramesRemaining = TILE_HEIGHT / MOVEMENT_SPEED
          this.tileX = newTileX
          this.tileY = newTileY
        }

        return [this.sprite]
      } else {
        if (this.sprite.playing) {
          this.sprite.gotoAndStop(1)
        }
        return []
      }
    }
  }

  public receiveDamage(_) { /* TODO: No-op! For now. */ }

  protected get texturePack(): TextureCache {
    return Character
  }

  private move(moveBy: number, direction: Direction, collider: Collider): void {
    const [xMod, yMod] = movementMatrix[direction]

    const proposedX = this.sprite.x + xMod * moveBy
    const proposedY = this.sprite.y + yMod * moveBy

    // if (!collider.collision(this.sprite, proposedX, proposedY)) {
    this.sprite.x = proposedX
    this.sprite.y = proposedY
    // }
  }
}
