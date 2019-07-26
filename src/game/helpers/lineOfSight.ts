import { IPoint } from '../types'
import bresenham from './bresenham'
import stores from '../../stores'
import pointsEqual from './pointsEqual'
import BaseLevel from '../levels/BaseLevel'

export default (startPoint: IPoint, endPoint: IPoint, level: BaseLevel | null = null): boolean => {
  if (pointsEqual(startPoint, endPoint)) {
    return true
  }

  level = level || stores.gameStateStore.currentLevel

  const pathPoints = bresenham(startPoint, endPoint, { omitStart: true, omitEnd: false })
  const convertedPath = pathPoints.map(point => level.tileAt(point))

  return convertedPath.slice(0, convertedPath.length - 1).every(item => item === 'floor')
}
