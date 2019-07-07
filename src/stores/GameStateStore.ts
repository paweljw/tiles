import { observable } from 'mobx'
import { Viewport } from 'pixi-viewport'

import { ISteppableSprite } from '../game/types'
import { CharacterContainer } from '../game/containers/CharacterContainer'
import { Simple as Cull } from '../game/culling'
import Collider from '../game/Collider'

export default class GameStateStore {
  @observable public loading: boolean = true
  @observable public paused: boolean = false
  @observable public fps: number = 0
  @observable public steppables: Set<ISteppableSprite> = new Set()
  @observable public app: PIXI.Application
  @observable public viewport: Viewport
  @observable public char: CharacterContainer
  @observable public cullMask: Cull
  @observable public collider: Collider
}
