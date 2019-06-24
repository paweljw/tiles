import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './src/components/App'
import Game from './src/game/Game'
import allStores, { IStoreLayout } from './src/stores'
import { Provider } from 'mobx-react'

ReactDOM.render(
  <Provider {...allStores}>
    <App />
  </Provider>,
  document.getElementById('root')
)

const game = new Game(document.getElementById('game'))
