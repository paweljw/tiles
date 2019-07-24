import { IPoint } from '../types'
import bresenham from './bresenham'
import stores from '../../stores'
import pointsEqual from './pointsEqual'

export default (startPoint: IPoint, endPoint: IPoint): boolean => {
  if (pointsEqual(startPoint, endPoint)) {
    return true
  }

  const pathPoints = bresenham(startPoint, endPoint, { omitStart: true, omitEnd: false })
  const convertedPath = pathPoints.map(point => stores.gameStateStore.currentLevel.tileAt(point))

  return convertedPath.slice(0, convertedPath.length - 1).every(item => item === 'floor')
}
