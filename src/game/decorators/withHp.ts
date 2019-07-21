import Collider from '../Collider'

const YELLOW = 0xFFFF00
const GREEN = 0x00FF00
const RED = 0xFF0000

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

      constructor(...args: any[]) {
        super(...args)
        this.healthBar = new PIXI.Graphics()
        this.redrawHealthbar()
        this.sprite.addChild(this.healthBar)
      }

      public step(delta: number, collider: Collider): PIXI.DisplayObject[] {
        this.hitFrames -= delta


        if (this.hitFrames <= 0) {
          this.hitFrames = 0
          this.sprite.tint = 0xffffff
        }

        return super.step(delta, collider)
      }

      public receiveDamage(damage: number) {
        this.hp = Math.floor(this.hp - damage)
        this.redrawHealthbar()
        this.hitFrames = 3
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
        this.healthBar.drawRect(0, 0, Math.ceil(this.hp / this.maxHp * 32), 2)
        this.healthBar.x = -16
        this.healthBar.y = 18
      }
    }
  }
}
