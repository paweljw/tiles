import { IPoint } from '../types'

export default (point: IPoint, other: IPoint) => {
  return point.x === other.x && point.y === other.y
}
