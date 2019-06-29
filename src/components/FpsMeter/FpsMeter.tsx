import * as React from 'react'
import { inject } from 'mobx-react'

import stores from '../stores'
import './FpsMeter.scss'

interface IFpsMeterProps {
  fps?: number
}

interface IFpsMeterFullProps {
  fps: number
}

const FpsMeter = ({ fps }: IFpsMeterProps | IFpsMeterFullProps) => (
  <div className="fps">{fps} FPS</div>
)

export { FpsMeter as BaseFpsMeter }

export default inject(({ gameStateStore }) => ({
  fps: gameStateStore.fps,
}))(FpsMeter)
