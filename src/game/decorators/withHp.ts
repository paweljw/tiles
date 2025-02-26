import Collider from '../Collider'
import { TILE_WIDTH } from '../constants/tilemap'
import { GREEN, YELLOW, RED } from '../constants/colors'

export interface IWithHp {
  receiveDamage(damage: number): void
}

export default function withHp(maxHp: number) {
  return function _withHp<T extends { new(...args: any[]) }>(constr: T) {
    return class extends constr {
      public healthBar: PIXI.Graphics
      public maxHp: number = maxHp
      public hp: number = maxHp
      public hitFrames: number = 0
      public previousTint: number = 0xFFFFFF
      public hitAnimating: boolean = false

      constructor(...args: any[]) {
        super(...args)
        this.healthBar = new PIXI.Graphics()
        this.redrawHealthbar()
        this.sprite.addChild(this.healthBar)
        this.previousTint = this.sprite.tint
      }

      public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
        this.hitFrames -= delta

        if (this.hitFrames <= 0 && this.hitAnimating) {
          this.hitFrames = 0
          this.hitAnimating = false
          this.sprite.tint = this.previousTint
        }

        this.redrawHealthbar()

        return super.step(delta, collider)
      }

      public receiveDamage(damage: number) {
        this.hp = Math.floor(this.hp - damage)
        this.redrawHealthbar()
        this.hitFrames = 3
        this.hitAnimating = true
        this.previousTint = this.sprite.tint
        this.sprite.tint = 0xff0000

        super.receiveDamage(damage, this.hp)
      }

      private redrawHealthbar() {
        let color = GREEN

        if (this.hp <= this.maxHp * 0.5) {
          color = YELLOW
        }

        if (this.hp <= this.maxHp * 0.1) {
          color = RED
        }

        this.healthBar.clear()
        this.healthBar.beginFill(color)
        this.healthBar.drawRect(0, 0, Math.ceil(this.hp / this.maxHp * TILE_WIDTH), 2)
        this.healthBar.x = -18
        this.healthBar.y = 18
      }
    }
  }
}
