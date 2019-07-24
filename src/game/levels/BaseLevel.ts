import { IPoint } from '../types'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants/tilemap'
import SimplexContainer from '../containers/SimplexContainer'

export default abstract class BaseLevel {
  public get pixelWidth(): number {
    return this.width * TILE_WIDTH
  }

  public get pixelHeight(): number {
    return this.height * TILE_HEIGHT
  }
  public width: number
  public height: number
  public maze: string[]

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  public tileAt(cell: IPoint) {
    return this.maze[this.locate(cell)]
  }

  public locate(cell: IPoint) {
    return cell.y * this.width + cell.x
  }

  public abstract textureAt(cell: IPoint): SimplexContainer

  public abstract spawns(): IPoint[]

  public abstract characterSpawn(): IPoint
}
