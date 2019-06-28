import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { autorun } from 'mobx'

import App from './src/components/App'
import Game from './src/game/Game'
import stores from './src/stores'

// @ts-ignore
const { remote } = window.require('electron')

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

  const isFullscreen = remote.BrowserWindow.getFocusedWindow().isFullScreen()

  if (stores.settingsStore.fullScreen && !isFullscreen) {
    remote.BrowserWindow.getFocusedWindow().setFullScreen(true)
  }

  if (!stores.settingsStore.fullScreen && isFullscreen) {
    remote.BrowserWindow.getFocusedWindow().setFullScreen(false)
  }
})

window.addEventListener('keydown', ({ key }) => {
  if (key === 'Escape') {
    stores.gameStateStore.paused = !stores.gameStateStore.paused
  }
})
