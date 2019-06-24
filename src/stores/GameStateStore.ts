import { observable } from 'mobx'

export default class Store {
  @observable public loading: boolean = true
}
