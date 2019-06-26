import { observable, computed, action } from 'mobx'
import { default as PixiKeyboard } from 'pixi.js-keyboard'
import { Facing, Direction } from '../game/types'
import { default as root } from '.'

export default class KeyboardStore {
  @observable public upPressed: boolean = false
  @observable public downPressed: boolean = false
  @observable public leftPressed: boolean = false
  @observable public rightPressed: boolean = false

  @computed public get isMoving(): boolean {
    return this.upPressed || this.downPressed || this.leftPressed || this.rightPressed
  }

  @computed public get facing(): Facing {
    if (this.downPressed) {
      return Facing.DOWN
    } else if (this.upPressed) {
      return Facing.UP
    } else if (this.rightPressed) {
      return Facing.RIGHT
    } else if (this.leftPressed) {
      return Facing.LEFT
    }
  }

  @computed public get direction(): Direction {
    if (this.upPressed && this.rightPressed) {
      return Direction.UP_RIGHT
    } else if (this.upPressed && this.leftPressed) {
      return Direction.UP_LEFT
    } else if (this.downPressed && this.rightPressed) {
      return Direction.DOWN_RIGHT
    } else if (this.downPressed && this.leftPressed) {
      return Direction.DOWN_LEFT
    } else if (this.rightPressed) {
      return Direction.RIGHT
    } else if (this.leftPressed) {
      return Direction.LEFT
    } else if (this.downPressed) {
      return Direction.DOWN
    } else {
      return Direction.UP
    }
  }

  @action public update(): void {
    PixiKeyboard.update()

    this.upPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysUp)
    this.downPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysDown)
    this.leftPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysLeft)
    this.rightPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysRight)
  }
}
