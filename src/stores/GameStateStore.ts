import { observable } from 'mobx'
import { Viewport } from 'pixi-viewport'

import { ISteppableInterface } from '../game/types'
import { CharacterContainer } from '../game/CharacterContainer'

export default class GameStateStore {
  @observable public loading: boolean = true
  @observable public paused: boolean = false
  @observable public fps: number = 0
  @observable public steppables: Set<ISteppableInterface> = new Set()
  @observable public app: PIXI.Application
  @observable public viewport: Viewport
  @observable public char: CharacterContainer
}
