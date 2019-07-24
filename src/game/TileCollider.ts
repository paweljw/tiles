import { IPoint } from './types'
import SimplexContainer from './containers/SimplexContainer'
import stores from '../stores'

export default class TileCollider {
  private unwalkableContainers: Set<SimplexContainer> = new Set()

  public addContainer(container: SimplexContainer) {
    this.unwalkableContainers.add(container)
  }

  public removeContainer(container: SimplexContainer) {
    this.unwalkableContainers.delete(container)
  }

  public collideAt({ x, y }: IPoint): SimplexContainer {
    if (x >= stores.gameStateStore.currentLevel.width || y >= stores.gameStateStore.currentLevel.height) {
      return new SimplexContainer(x, y)
    }
    return Array.from(this.unwalkableContainers).find(({ tileCoords: { x: tX, y: tY } }) => x === tX && y === tY)
  }
}
