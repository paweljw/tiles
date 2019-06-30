import { extras } from 'pixi.js'
import Character from '../textures/Character'
import stores from './../stores'
import { Facing, Direction } from './types'
import movementMatrix from './constants/movementMatrix'
import Collider from './Collider'
import { MissileContainer } from './MissileContainer';

const Keyboard = stores.keyboardStore

export class CharacterContainer {
  public sprite: PIXI.extras.AnimatedSprite
  private facing: Facing = Facing.DOWN
  private movementSpeed: number = 3
  private gcd: number = 0

  constructor(x: number, y: number) {
    this.sprite = new extras.AnimatedSprite(Character[this.facing])
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.animationSpeed = 0.05 * this.movementSpeed
    this.sprite.anchor.set(0.5)
    this.setFacing(this.facing)
    this.sprite.tint = 0xcccccc
    this.sprite.stop()
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    const moveBy = delta * this.movementSpeed

    let newGcd = this.gcd -= delta
    if (newGcd < 0) newGcd = 0
    this.gcd = newGcd

    Keyboard.update() // TODO: Move to a steppable (once new steppables implemented)

    if (this.gcd === 0 && Keyboard.isFiring) {
      stores.gameStateStore.steppables.add(new MissileContainer(this.sprite.x, this.sprite.y, Keyboard.direction))
      this.gcd = 20
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

  private setFacing(facing: Facing): void {
    if (this.facing === facing) {
      return
    }

    this.facing = facing
    this.sprite.textures = Character[facing]
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
