import Character from '../../textures/Character'
import stores from '../../stores'
import { Direction } from '../types'
import movementMatrix from '../constants/movementMatrix'
import Collider from '../Collider'
import { MissileContainer } from './MissileContainer'
import { AnimatableContainer } from './AnimatableContainer'
import TextureCache from '../../textures/TextureCache'

const Keyboard = stores.keyboardStore
const MOVEMENT_SPEED = 3

export class CharacterContainer extends AnimatableContainer {
  private gcd: number = 0

  constructor(x: number, y: number) {
    super(x, y, MOVEMENT_SPEED)
    this.sprite.tint = 0xeeeeee
    this.sprite.hitArea = new PIXI.Rectangle(3, 2, 26, 29)
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    const moveBy = delta * this.movementSpeed

    let newGcd = this.gcd -= delta
    if (newGcd < 0) newGcd = 0
    this.gcd = newGcd

    Keyboard.update() // TODO: Move to a steppable (once new steppables implemented)

    if (this.gcd === 0 && Keyboard.isFiring) {
      stores.gameStateStore.steppables.add(new MissileContainer(this.sprite.x, this.sprite.y, Keyboard.direction))
      this.gcd = 10
    }

    if (Keyboard.isMoving) {
      this.setFacing(Keyboard.facing)

      if (!this.sprite.playing) {
        this.sprite.play()
      }

      this.move(moveBy, Keyboard.direction, collider)

      return [this.sprite]
    } else {
      if (this.sprite.playing) {
        this.sprite.gotoAndStop(1)
      } // Very specific to character tileset used. Usually 0
      return []
    }
  }

  public receiveDamage(_) { /* TODO: No-op! */ }

  protected get texturePack(): TextureCache {
    return Character
  }

  private move(moveBy: number, direction: Direction, collider: Collider): void {
    const [xMod, yMod] = movementMatrix[direction]

    const proposedX = this.sprite.x + xMod * moveBy
    const proposedY = this.sprite.y + yMod * moveBy

    if (!collider.collision(this.sprite, proposedX, proposedY)) {
      this.sprite.x = proposedX
      this.sprite.y = proposedY
    }
  }
}
