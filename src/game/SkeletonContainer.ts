import { extras } from 'pixi.js'
import stores from './../stores'
import { Facing, Direction } from './types'
import movementMatrix from './constants/movementMatrix'
import Collider from './Collider'
import Skeleton from '../textures/Skeleton'

const Keyboard = stores.keyboardStore

export class SkeletonContainer {
  public sprite: PIXI.extras.AnimatedSprite
  private facing: Facing = Facing.DOWN
  private movementSpeed: number = 1

  constructor(x: number, y: number) {
    this.sprite = new extras.AnimatedSprite(Skeleton[this.facing])
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.animationSpeed = 0.05 * this.movementSpeed
    this.sprite.anchor.set(0.5)
    this.setFacing([Facing.UP, Facing.DOWN, Facing.LEFT, Facing.RIGHT][Math.floor(Math.random() * 4)])
    this.sprite.play()
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    // TODO: movement and attacking
    return []
  }

  private setFacing(facing: Facing): void {
    if (this.facing === facing) {
      return
    }

    this.facing = facing
    this.sprite.textures = Skeleton[facing]
  }

  private move(moveBy: number, direction: Direction, collider: Collider): void {
    // const [xMod, yMod] = movementMatrix[direction]

    // const proposedX = this.sprite.x + xMod * moveBy
    // const proposedY = this.sprite.y + yMod * moveBy

    // if (!collider.collision(this.sprite, proposedX, proposedY)) {
    //   this.sprite.x = proposedX
    //   this.sprite.y = proposedY
    // }

    // TODO: react on player collision
  }
}
