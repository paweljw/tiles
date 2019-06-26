import GameStateStore from './GameStateStore'
import KeyboardStore from './KeyboardStore'
import SettingsStore from './SettingsStore'

export interface IStoreLayout {
  gameStateStore: GameStateStore,
  keyboardStore: KeyboardStore,
  settingsStore: SettingsStore
}

const stores: IStoreLayout = {
  gameStateStore: new GameStateStore(),
  keyboardStore: new KeyboardStore(),
  settingsStore: new SettingsStore(),
}

export default stores
