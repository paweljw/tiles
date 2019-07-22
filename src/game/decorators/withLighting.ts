import stores from '../../stores'


export interface IWithLighting {
  receiveDamage(damage: number): void
}

export const MAX_LIGHT = 6

export default function withLighting(hidesInShadows: boolean) {
  return function _withLighting<T extends { new(...args: any[]) }>(constr: T) {
    return class extends constr {
      public light: number = 0
      public hidesInShadows: boolean = hidesInShadows
      public wasEverVisible: boolean = false

      constructor(...args: any[]) {
        super(...args)
        stores.gameStateStore.lightableObjects.add(this)
        this.sprite.alpha = this.light / MAX_LIGHT
      }

      public applyLighting(lightLevel: number) {
        if (lightLevel === this.light) return

        this.light = lightLevel

        if (this.light > 0) {
          this.wasEverVisible = true
        }

        let appliedLight = this.light

        if (this.wasEverVisible && !this.hidesInShadows) {
          appliedLight = Math.max(MAX_LIGHT / 2, appliedLight)
        }

        this.sprite.alpha = appliedLight / MAX_LIGHT
      }
    }
  }
}
