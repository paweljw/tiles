import * as React from 'react'
import { inject } from 'mobx-react'

import './FpsMeter.scss'

interface IFpsMeterProps {
  fps?: number
  char?: any
}

interface IFpsMeterFullProps {
  fps: number
  char: any
}

const FpsMeter = ({ fps, char }: IFpsMeterProps | IFpsMeterFullProps) => {
  let coords = ''

  if (char && char.tileCoords) {
    coords = `${char.tileCoords.x}, ${char.tileCoords.y}`
  }

  return (<div className='fps' style={{ color: fps < 60 ? 'red' : 'white' }}>{fps} FPS | {coords}</div>)
}

export { FpsMeter as BaseFpsMeter }

export default inject(({ gameStateStore }) => ({
  fps: gameStateStore.fps,
  char: gameStateStore.char
}))(FpsMeter)
