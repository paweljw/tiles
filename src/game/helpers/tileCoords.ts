import { TILE_WIDTH, TILE_HEIGHT } from '../constants/tilemap'
import { IPoint } from '../types'

export default (point: IPoint): IPoint => {
  const { x, y } = point

  return { x: Math.floor(x / TILE_WIDTH), y: Math.floor(y / TILE_HEIGHT) }
}
