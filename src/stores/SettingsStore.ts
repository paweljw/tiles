import { observable } from 'mobx'

export default class SettingsStore {
  @observable public keysUp: string[] = ['ArrowUp', 'KeyD']
  @observable public keysDown: string[] = ['ArrowDown', 'KeyS']
  @observable public keysLeft: string[] = ['ArrowLeft', 'KeyA']
  @observable public keysRight: string[] = ['ArrowRight', 'KeyH']
  @observable public keysFire: string[] = ['Space']
  @observable public fullScreen: boolean = false
  @observable public width: number = 1280
  @observable public height: number = 720
}
