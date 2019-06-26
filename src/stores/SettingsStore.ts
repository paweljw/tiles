import { observable } from 'mobx'

export default class SettingsStore {
  @observable public keysUp: string[] = ['ArrowUp', 'KeyD']
  @observable public keysDown: string[] = ['ArrowDown', 'KeyS']
  @observable public keysLeft: string[] = ['ArrowLeft', 'KeyA']
  @observable public keysRight: string[] = ['ArrowRight', 'KeyH']
}
