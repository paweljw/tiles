import stores from '../stores'
import stringifyPoint from '../helpers/stringifyPoint'

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
  public sprite: PIXI.DisplayObject

  public step(_delta, _collider) {
    const { x, y } = stores.gameStateStore.char.tileCoords
    const strLocal = stringifyPoint({ x, y })

    const lightMap = []

    for (let i = 0; i < LIGHT_MAP[0].length; i++) {
      for (let j = 0; j < LIGHT_MAP.length; j++) {
        const lX = x - 7 + i
        const lY = y - 7 + j

        if (
          stores.gameStateStore.currentLevel.lineOfSightMap.has(strLocal) &&
          stores.gameStateStore.currentLevel.lineOfSightMap
            .get(strLocal).has(stringifyPoint({ x: lX, y: lY }))
        ) {
          lightMap[lX] = lightMap[lX] || []
          lightMap[lX][lY] = LIGHT_MAP[i][j]
        }
      }
    }

    stores.gameStateStore.lightableObjects.forEach(lightable => {
      const { x: lX, y: lY } = lightable.tileCoords

      if (lightMap[lX] && lightMap[lX][lY]) {
        lightable.applyLighting(lightMap[lX][lY])
      } else {
        lightable.applyLighting(0)
      }
    })

    return []
  }

  public receiveDamage(..._args) { /* no-op */ }
}
