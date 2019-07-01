import { extras, Graphics } from 'pixi.js'
import stores from './../stores'
import { Facing, Direction } from './types'
import movementMatrix from './constants/movementMatrix'
import Collider from './Collider'
import Skeleton from '../textures/Skeleton'

const MAX_HP = 10

const YELLOW = 0xFFFF00
const GREEN = 0x00FF00
const RED = 0xFF0000

export class SkeletonContainer {
  public sprite: PIXI.extras.AnimatedSprite
  public healthBar: PIXI.Graphics
  private facing: Facing = Facing.DOWN
  private movementSpeed: number = 1
  private hp: number = 10

  constructor(x: number, y: number) {
    this.sprite = new extras.AnimatedSprite(Skeleton[this.facing])
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.animationSpeed = 0.05 * this.movementSpeed
    this.sprite.anchor.set(0.5)
    this.setFacing([Facing.UP, Facing.DOWN, Facing.LEFT, Facing.RIGHT][Math.floor(Math.random() * 4)])
    this.sprite.play()

    this.healthBar = new PIXI.Graphics()

    this.redrawHealthbar()

    this.sprite.addChild(this.healthBar)
  }

  public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
    return []
  }

  public receiveDamage(damage: number): void {
    this.hp = Math.floor(this.hp - damage)

    if (this.hp <= 0) {
      stores.gameStateStore.viewport.removeChild(this.sprite)
      stores.gameStateStore.cullMask.removeObject(this.sprite)
    }
    this.redrawHealthbar()
  }

  private setFacing(facing: Facing): void {
    if (this.facing === facing) {
      return
    }

    this.facing = facing
    this.sprite.textures = Skeleton[facing]
  }

  private redrawHealthbar() {
    let color = GREEN

    if (this.hp <= MAX_HP * 0.5) {
      color = YELLOW
    }

    if (this.hp <= MAX_HP * 0.1) {
      color = RED
    }

    this.healthBar.clear()
    this.healthBar.beginFill(color)
    this.healthBar.drawRect(0, 0, Math.ceil(this.hp / MAX_HP * 32), 2)
    this.healthBar.x = -16
    this.healthBar.y = 18
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
