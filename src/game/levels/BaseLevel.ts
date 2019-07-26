import { IPoint } from '../types'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants/tilemap'
import SimplexContainer from '../containers/SimplexContainer'
import { MAX_LIGHT } from '../decorators/withLighting'
import lineOfSight from '../helpers/lineOfSight'
import stringifyPoint from '../../helpers/stringifyPoint'

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
  public lineOfSightMap: Map<string, Set<string>>

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

  protected internalLineOfSightMap() {
    const los = new Map<string, Set<string>>()

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const startPoint = { x, y }

        if (this.tileAt(startPoint)) { // if current slot is a null area, skip
          for (let dx = -MAX_LIGHT; dx <= MAX_LIGHT; dx++) {
            for (let dy = -MAX_LIGHT; dy <= MAX_LIGHT; dy++) {
              const lX = x + dx
              const lY = y + dy
              const endPoint = { x: lX, y: lY }

              if (
                lX >= 0 && lX < this.width // X coordinate within level
                && lY >= 0 && lY < this.height // Y coordinate within level
                && this.tileAt(endPoint) // endpoint tile is not a null area
              ) {
                if (lineOfSight(startPoint, endPoint, this)) {
                  const losAtStart = los.get(stringifyPoint(startPoint)) || new Set<string>()

                  losAtStart.add(stringifyPoint(endPoint))

                  los.set(stringifyPoint(startPoint), losAtStart)
                }
              }
            }
          }
        }
      }
    }

    return los
  }
}
