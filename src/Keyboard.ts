import { default as PixiKeyboard } from 'pixi.js-keyboard';
import ConfigManager from './ConfigManager';
import { Facing } from './CharacterContainer';

class Keyboard {
  static get goUp (): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysUp);
  }

  static get goDown (): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysDown);
  }

  static get goLeft (): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysLeft);
  }

  static get goRight (): boolean {
    return PixiKeyboard.isKeyDown(...ConfigManager.KeysRight);
  }

  static get isMoving (): boolean {
    return this.goUp || this.goDown || this.goLeft || this.goRight;
  }

  static update () {
    PixiKeyboard.update();
  }

  static get facing (): Facing {
    if (this.goRight) {
      return Facing.RIGHT;
    } else if (this.goLeft) {
      return Facing.LEFT;
    } else if (this.goDown) {
      return Facing.DOWN;
    } else {
      return Facing.UP;
    }
  }
}

export default Keyboard;