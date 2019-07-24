import { IPoint } from '../types'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants/tilemap'

export default (point: IPoint): IPoint => {
  const { x, y } = point

  return {
    x: x * TILE_WIDTH + (TILE_WIDTH / 2),
    y: y * TILE_HEIGHT + (TILE_HEIGHT / 2)
  }
}
