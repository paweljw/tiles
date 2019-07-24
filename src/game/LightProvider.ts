import BaseLevel from './levels/BaseLevel'
import stores from '../stores'
import { MAX_LIGHT } from './decorators/withLighting'

const LIGHT_MAP = [
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0],
  [1, 2, 3, 4, 5, 6, 7, 7, 7, 6, 5, 4, 3, 2, 1],
  [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0],
  [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
]

export default class LightProvider {
  public level: BaseLevel
  public previousCharacterX: number
  public previousCharacterY: number
  public sprite: PIXI.DisplayObject

  constructor(level: BaseLevel) {
    this.level = level
  }

  public step(_delta, _collider) {
    const { x, y } = stores.gameStateStore.char.sprite

    // if (x === this.previousCharacterX && y === this.previousCharacterY) {
    //   return []
    // }

    this.previousCharacterX = x
    this.previousCharacterY = y

    const normalizedCharacterCoords = this.normalizeCoords(x, y)

    // calculate light in four cardinal directions

    const lightMap = []

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x + (i - MAX_LIGHT)
      const atY = normalizedCharacterCoords.y

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall') {
        i = -1
      }
    }

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x - (i - MAX_LIGHT)
      const atY = normalizedCharacterCoords.y

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall' || atX < 0) {
        i = -1
      }
    }

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x
      const atY = normalizedCharacterCoords.y - (i - MAX_LIGHT)

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall' || atY < 0) {
        i = -1
      }
    }

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x
      const atY = normalizedCharacterCoords.y + (i - MAX_LIGHT)

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall') {
        i = -1
      }
    }

    // calculate light at diagonals

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x + (i - MAX_LIGHT)
      const atY = normalizedCharacterCoords.y + (i - MAX_LIGHT)

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall') {
        i = -1
      }
    }

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x - (i - MAX_LIGHT)
      const atY = normalizedCharacterCoords.y - (i - MAX_LIGHT)

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall' || atX < 0) {
        i = -1
      }
    }

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x + (i - MAX_LIGHT)
      const atY = normalizedCharacterCoords.y - (i - MAX_LIGHT)

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall' || atY < 0) {
        i = -1
      }
    }

    for (let i = MAX_LIGHT; i >= 0; i--) {
      const atX = normalizedCharacterCoords.x - (i - MAX_LIGHT)
      const atY = normalizedCharacterCoords.y + (i - MAX_LIGHT)

      lightMap[atX] = lightMap[atX] || []
      lightMap[atX][atY] = i

      if (this.level.tileAt({ x: atX, y: atY }) === 'wall') {
        i = -1
      }
    }

    stores.gameStateStore.lightableObjects.forEach(lightable => {
      if (!lightable.visible) {
        return
      }

      const { x: lX, y: lY } = this.normalizeCoords(lightable.sprite.x, lightable.sprite.y)

      if (lightMap[lX] && lightMap[lX][lY]) {
        lightable.applyLighting(lightMap[lX][lY])
      } else {
        lightable.applyLighting(0)
      }
    })

    return []
  }

  public receiveDamage(..._args) { /* no-op */ }

  private normalizeCoords(x: number, y: number) {
    return {
      x: (x - (x % 72)) / 72,
      y: (y - (y % 72)) / 72
    }
  }
}
