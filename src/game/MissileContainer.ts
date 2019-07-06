import { extras } from 'pixi.js'
import stores from './../stores'
import { Direction } from './types'
import movementMatrix from './constants/movementMatrix'
import Collider from './Collider'
import Missile from '../textures/Missile'

export class MissileContainer {
  public sprite: PIXI.extras.AnimatedSprite
  private movementSpeed: number = 12
  private direction: Direction
  private distanceTravelled: number = 0

  constructor(x: number, y: number, direction: Direction) {
    this.sprite = new extras.AnimatedSprite(Missile.missile)
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.width = 13
    this.sprite.height = 13
    this.sprite.animationSpeed = 0.05 * this.movementSpeed
    this.sprite.hitArea = new PIXI.Rectangle(2, 2, 30, 30)
    this.sprite.anchor.set(0.5)
    this.sprite.play()
    this.direction = direction

    stores.gameStateStore.viewport.addChild(this.sprite)
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    const moveBy = delta * this.movementSpeed

    this.move(moveBy, collider)

    return [this.sprite]
  }

  public receiveDamage(_) { this.removeSelf() }

  private removeSelf() {
    stores.gameStateStore.viewport.removeChild(this.sprite)
    stores.gameStateStore.steppables.delete(this)
  }

  private move(moveBy: number, collider: Collider): void {
    const [xMod, yMod] = movementMatrix[this.direction]

    const proposedX = this.sprite.x + xMod * moveBy
    const proposedY = this.sprite.y + yMod * moveBy

    this.distanceTravelled += Math.sqrt(
      Math.pow((proposedX - this.sprite.x), 2) + Math.pow((proposedY - this.sprite.y), 2)
    )

    if (this.distanceTravelled > 200) {
      this.removeSelf()
      return
    }

    const collidedWith = collider.collision(this.sprite, proposedX, proposedY, [stores.gameStateStore.char.sprite])
    this.sprite.x = proposedX
    this.sprite.y = proposedY

    if (collidedWith) {
      this.removeSelf()

      const collidedWithContainer =
        Array.from(stores.gameStateStore.steppables.values()).find(item => item.sprite && item.sprite === collidedWith)

      collidedWithContainer && collidedWithContainer.receiveDamage(1)
    }
  }
}
