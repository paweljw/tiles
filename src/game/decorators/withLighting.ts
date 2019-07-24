import stores from '../../stores'


export interface IWithLighting {
  receiveDamage(damage: number): void
}

export const MAX_LIGHT = 7

const LIGHT_LEVELS = [
  0x000000,
  0x202020,
  0x505050,
  0x707070,
  0xA0A0A0,
  0xBEBEBE,
  0xDCDCDC,
  0xFFFFFF
]

export default function withLighting(hidesInShadows: boolean) {
  return function _withLighting<T extends { new(...args: any[]) }>(constr: T) {
    return class extends constr {
      public light: number = 0
      public hidesInShadows: boolean = hidesInShadows
      public wasEverVisible: boolean = false

      constructor(...args: any[]) {
        super(...args)
        stores.gameStateStore.lightableObjects.add(this)
        this.sprite.tint = LIGHT_LEVELS[this.light]
        this.sprite.children.forEach(child => child.alpha = this.light / MAX_LIGHT)
      }

      public applyLighting(lightLevel: number) {
        if (lightLevel === this.light) return

        this.light = lightLevel

        if (this.light > 0) {
          this.wasEverVisible = true
        }

        let appliedLight = this.light

        if (this.wasEverVisible && !this.hidesInShadows) {
          appliedLight = Math.floor(Math.max(MAX_LIGHT / 2, appliedLight))
        }

        this.sprite.tint = LIGHT_LEVELS[appliedLight]
        if (appliedLight === 0) {
          this.sprite.alpha = 0
        } else {
          this.sprite.alpha = 1
        }
        this.sprite.children.forEach(child => child.alpha = appliedLight / MAX_LIGHT)
      }
    }
  }
}
