import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { autorun } from 'mobx'

import App from './src/components/App'
import Game from './src/game/Game'
import stores from './src/stores'
import getConfig from './src/helpers/getConfig'

// @ts-ignore
const { remote } = window.require('electron')

const config = getConfig()

stores.settingsStore.fullScreen = config.fullscreen
stores.settingsStore.width = config.resw
stores.settingsStore.height = config.resh

console.log('setting fullscreen', stores.settingsStore.fullScreen)

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
)

const gameElement = document.getElementById('game')
const appElement = document.getElementById('app')

const game = new Game(gameElement)

autorun(() => {
  if (stores.gameStateStore.loading) {
    gameElement.classList.add('hidden')
  } else {
    gameElement.classList.remove('hidden')
  }

  if (stores.gameStateStore.paused) {
    appElement.classList.add('app--paused')
  } else {
    appElement.classList.remove('app--paused')
  }

  const focusedWindow = remote.BrowserWindow.getFocusedWindow()
  const shouldBeFullScreen = stores.settingsStore.fullScreen

  if (focusedWindow) {
    const isFullscreen = focusedWindow.isFullScreen()

    if (shouldBeFullScreen && !isFullscreen) {
      focusedWindow.setFullScreen(true)
    }

    if (!shouldBeFullScreen && isFullscreen) {
      focusedWindow.setFullScreen(false)
    }
  }
})

window.addEventListener('keydown', ({ key }) => {
  if (key === 'Escape') {
    stores.gameStateStore.paused = !stores.gameStateStore.paused
  }
})
