import * as React from 'react'
import { inject } from 'mobx-react'

import Loading from './Loading/Loading'
import Menu from './Menu/Menu'
import FpsMeter from './FpsMeter/FpsMeter'
import stores from '../stores'
import writeConfig from '../helpers/writeConfig'
import getConfig from '../helpers/getConfig'

// @ts-ignore
const { remote } = window.require('electron')
// @ts-ignore
const isDev = window.require('electron-is-dev')

interface IAppProps {
  loading?: boolean,
  paused?: boolean
}

interface IAppFullProps {
  loading: boolean,
  paused: boolean
}

const openDevTools = (_: React.MouseEvent<HTMLButtonElement>) => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
  stores.gameStateStore.paused = false
}

const exitGame = (_: React.MouseEvent<HTMLButtonElement>) => {
  remote.BrowserWindow.getFocusedWindow().close()
}

const toggleFullScreen = () => {
  const newFullScreen = !stores.settingsStore.fullScreen

  writeConfig({ ...getConfig(), fullscreen: newFullScreen })

  stores.settingsStore.fullScreen = newFullScreen
}

const App = ({ loading, paused }: IAppProps | IAppFullProps) => (
  <>
    {loading ? <Loading /> : null}
    {paused
      ? <Menu
        onOpenDevTools={openDevTools}
        onExitGame={exitGame}
        isDev={isDev}
        toggleFullScreen={toggleFullScreen} />
      : null}
    {isDev && <FpsMeter />}
  </>
)

export { App as BaseApp }

export default inject(({ gameStateStore }) => ({
  loading: gameStateStore.loading,
  paused: gameStateStore.paused
}))(App)
