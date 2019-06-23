import * as React from 'react';
import steamshardPng from './../assets/steamshard.png'

import Game from './../Game';

class App extends React.Component {
  appRef: HTMLDivElement
  game: Game

  state = {
    loading: true
  }

  componentDidMount() {
    window.addEventListener('game-loaded', this.onGameLoaded);
    this.game = new Game(document.getElementById('game'));
  }

  componentWillUnmount() {
    window.removeEventListener('game-loaded', this.onGameLoaded);
  }

  onGameLoaded = () => {
    this.setState({ loading: false });
  }

  render () {
    const { loading } = this.state;

    if(!loading) return null;

    return (
      <div id="loading" className="app__loading">
        <img src={steamshardPng} />
      </div>
    );
  }
}

export default App
