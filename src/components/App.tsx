import * as React from 'react'
import { inject } from 'mobx-react'

import Loading from './Loading/Loading'
import Menu from './Menu/Menu'
import stores from '../stores'

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
  stores.settingsStore.fullScreen = !stores.settingsStore.fullScreen
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
  </>
)

export { App as BaseApp }

export default inject(({ gameStateStore }) => ({
  loading: gameStateStore.loading,
  paused: gameStateStore.paused
}))(App)
