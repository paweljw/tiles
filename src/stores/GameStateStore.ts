import { observable } from 'mobx'

export default class GameStateStore {
  @observable public loading: boolean = true
  @observable public paused: boolean = false
}
