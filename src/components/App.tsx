import * as React from 'react'
import steamshardPng from './../assets/steamshard.png'

import Game from '../Game/Game'

class App extends React.Component {
  public appRef: HTMLDivElement
  public game: Game

  public state = {
    loading: true
  }

  public componentDidMount() {
    window.addEventListener('game-loaded', this.onGameLoaded)
    this.game = new Game(document.getElementById('game'))
  }

  public componentWillUnmount() {
    window.removeEventListener('game-loaded', this.onGameLoaded)
  }

  public onGameLoaded = () => {
    this.setState({ loading: false })
  }

  public render() {
    const { loading } = this.state

    if (!loading) {
      return null
    }

    return (
      <div id='loading' className='app__loading'>
        <img src={steamshardPng} />
      </div>
    )
  }
}

export default App
