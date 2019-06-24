import GameStateStore from './GameStateStore'

export interface IStoreLayout {
  gameStateStore: GameStateStore
}

const stores: IStoreLayout = {
  gameStateStore: new GameStateStore()
}

export default stores
