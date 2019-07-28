import { observable, computed, action } from 'mobx'
import { default as PixiKeyboard } from 'pixi.js-keyboard'
import { Facing, Direction } from '../game/types'
import { default as root } from '.'
import { Buttons } from '../game/Mouse'

export default class KeyboardStore {
  @observable public upPressed: boolean = false
  @observable public downPressed: boolean = false
  @observable public leftPressed: boolean = false
  @observable public rightPressed: boolean = false
  @observable public isFiring: boolean = false

  private lastDirection: Direction = Direction.UP

  @computed public get isMoving(): boolean {
    return this.upPressed ||
      this.downPressed ||
      this.leftPressed ||
      this.rightPressed ||
      (root.gameStateStore.mouse &&
        root.gameStateStore.mouse.isButtonDown(Buttons.LEFT) &&
        !!root.gameStateStore.mouse.mouseDirection)
  }

  @computed public get facing(): Facing {
    // mouse support
    if (root.gameStateStore.mouse &&
      root.gameStateStore.mouse.isButtonDown(Buttons.LEFT) &&
      root.gameStateStore.mouse.mouseDirection) {
      const direction = root.gameStateStore.mouse.mouseDirection

      if (direction === Direction.UP || direction === Direction.UP_LEFT || direction === Direction.UP_RIGHT) {
        return Facing.UP
      } else if (direction === Direction.DOWN_LEFT ||
        direction === Direction.DOWN ||
        direction === Direction.DOWN_RIGHT) {
        return Facing.DOWN
      } else if (direction === Direction.LEFT) {
        return Facing.LEFT
      } else if (direction === Direction.RIGHT) {
        return Facing.RIGHT
      }
    }

    // keyboard support
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
    let direction = null

    if (root.gameStateStore.mouse &&
      root.gameStateStore.mouse.isButtonDown(Buttons.LEFT) &&
      root.gameStateStore.mouse.mouseDirection) {
      direction = root.gameStateStore.mouse.mouseDirection
    } else {
      if (this.upPressed && this.rightPressed) {
        direction = Direction.UP_RIGHT
      } else if (this.upPressed && this.leftPressed) {
        direction = Direction.UP_LEFT
      } else if (this.downPressed && this.rightPressed) {
        direction = Direction.DOWN_RIGHT
      } else if (this.downPressed && this.leftPressed) {
        direction = Direction.DOWN_LEFT
      } else if (this.rightPressed) {
        direction = Direction.RIGHT
      } else if (this.leftPressed) {
        direction = Direction.LEFT
      } else if (this.downPressed) {
        direction = Direction.DOWN
      } else if (this.upPressed) {
        direction = Direction.UP
      }
    }

    direction = direction || this.lastDirection
    this.lastDirection = direction

    return direction
  }

  @action public update(): void {
    PixiKeyboard.update()

    this.upPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysUp)
    this.downPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysDown)
    this.leftPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysLeft)
    this.rightPressed = PixiKeyboard.isKeyDown(...root.settingsStore.keysRight)
    this.isFiring = PixiKeyboard.isKeyDown(...root.settingsStore.keysFire)
  }
}
