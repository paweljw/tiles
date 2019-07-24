import { IPoint } from './types'
import SimplexContainer from './containers/SimplexContainer'

export default class TileCollider {
  private unwalkableContainers: Set<SimplexContainer> = new Set()

  public addContainer(container: SimplexContainer) {
    this.unwalkableContainers.add(container)
  }

  public removeContainer(container: SimplexContainer) {
    this.unwalkableContainers.delete(container)
  }

  public collideAt({ x, y }: IPoint): SimplexContainer {
    return Array.from(this.unwalkableContainers).find(({ tileCoords: { x: tX, y: tY } }) => x === tX && y === tY)
  }
}
