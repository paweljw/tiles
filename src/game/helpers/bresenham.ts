import { IPoint } from '../types'

export default (
  startCoordinates: IPoint,
  endCoordinates: IPoint,
  { omitStart = false, omitEnd = false } = {}): IPoint[] => {
  const coordinatesArray = new Array()

  let { x: x1, y: y1 } = startCoordinates
  const { x: x2, y: y2 } = endCoordinates

  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)
  const sx = (x1 < x2) ? 1 : -1
  const sy = (y1 < y2) ? 1 : -1
  let err = dx - dy

  if (!omitStart) {
    coordinatesArray.push({ x: x1, y: y1 })
  }
  // Main loop
  while (!((x1 === x2) && (y1 === y2))) {
    // tslint:disable-next-line: no-bitwise
    const e2 = err * 2
    if (e2 > -dy) {
      err -= dy
      x1 += sx
    }
    if (e2 < dx) {
      err += dx
      y1 += sy
    }

    if ((omitEnd && x1 !== x2 && y1 !== y2) || !omitEnd) {
      coordinatesArray.push({ x: x1, y: y1 })
    }
  }
  return coordinatesArray
}
