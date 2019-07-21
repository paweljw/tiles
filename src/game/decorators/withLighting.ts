import stores from '../../stores'


export interface IWithLighting {
  receiveDamage(damage: number): void
}

export default function withLighting(hidesInShadows: boolean) {
  return function _withLighting<T extends { new(...args: any[]) }>(constr: T) {
    return class extends constr {
      public light: number = 0
      public hidesInShadows: boolean = hidesInShadows
      public wasEverVisible: boolean = false

      constructor(...args: any[]) {
        super(...args)
        stores.gameStateStore.lightableObjects.add(this)
      }

      public applyLighting(lightLevel: number) {
        if (lightLevel === this.light) return

        this.light = lightLevel

        if (this.light > 0) {
          this.wasEverVisible = true
        }

        let appliedLight = this.light

        if (this.wasEverVisible && !this.hidesInShadows) {
          appliedLight = 4
        }

        this.sprite.alpha = appliedLight / 8
      }
    }
  }
}
