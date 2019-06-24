import { default as PixiKeyboard } from 'pixi.js-keyboard'
import ConfigManager from './ConfigManager'
import { Facing, Direction } from './types'

class Keyboard {
  static get goUp(): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysUp)
  }

  static get goDown(): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysDown)
  }

  static get goLeft(): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysLeft)
  }

  static get goRight(): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysRight)
  }

  static get isMoving(): boolean {
    return this.goUp || this.goDown || this.goLeft || this.goRight
  }

  static get debugSpeed(): boolean {
    return PixiKeyboard.isKeyDown('KeyF') // Press F to pay res- I mean, debug faster
  }

  public static update() {
    PixiKeyboard.update()
  }

  static get facing(): Facing {
    if (this.goDown) {
      return Facing.DOWN
    } else if (this.goUp) {
      return Facing.UP
    } else if (this.goRight) {
      return Facing.RIGHT
    } else if (this.goLeft) {
      return Facing.LEFT
    }
  }

  static get direction(): Direction {
    if (this.goUp && this.goRight) {
      return Direction.UP_RIGHT
    } else if (this.goUp && this.goLeft) {
      return Direction.UP_LEFT
    } else if (this.goDown && this.goRight) {
      return Direction.DOWN_RIGHT
    } else if (this.goDown && this.goLeft) {
      return Direction.DOWN_LEFT
    } else if (this.goRight) {
      return Direction.RIGHT
    } else if (this.goLeft) {
      return Direction.LEFT
    } else if (this.goDown) {
      return Direction.DOWN
    } else {
      return Direction.UP
    }
  }
}

export default Keyboard
