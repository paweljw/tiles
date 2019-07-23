import { Texture } from 'pixi.js'
import TextureCache from './TextureCache'

class Character extends TextureCache {
  static get cUp() {
    return this._lookup('cUp', () =>
      this._characterFrames(this._rowOffset + 1, this._colOffset + 1)
    )
  }

  static get cDown() {
    return this._lookup('cDown', () =>
      this._characterFrames(this._rowOffset + 3, this._colOffset + 1)
    )
  }

  static get cLeft() {
    return this._lookup('cLeft', () =>
      this._characterFrames(this._rowOffset + 4, this._colOffset + 1)
    )
  }

  static get cRight() {
    return this._lookup('cRight', () =>
      this._characterFrames(this._rowOffset + 2, this._colOffset + 1)
    )
  }

  public static _rowOffset = 0
  public static _colOffset = 0
  public static _characterFrames = (
    row: number,
    keyframe: number,
    keyframes: number = 3
  ) => {
    const frames = []
    for (let i = 0; i < keyframes; i++) {
      frames.push(Texture.from(`q_r${row}c${i + keyframe}.png`))
    }
    return frames
  }
}

export default Character
