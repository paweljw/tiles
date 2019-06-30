import { Texture } from 'pixi.js'
import TextureCache from './TextureCache'

class Skeleton extends TextureCache {
  static get cUp() {
    return this._lookup('skeletonUp', () =>
      this._characterFrames(this._rowOffset + 1, this._colOffset + 1)
    )
  }

  static get cDown() {
    return this._lookup('skeletonDown', () =>
      this._characterFrames(this._rowOffset + 1, this._colOffset + 3)
    )
  }

  static get cLeft() {
    return this._lookup('skeletonLeft', () =>
      this._characterFrames(this._rowOffset + 1, this._colOffset + 5)
    )
  }

  static get cRight() {
    return this._lookup('skeletonRight', () =>
      this._characterFrames(this._rowOffset + 1, this._colOffset + 7)
    )
  }

  public static _rowOffset = 31
  public static _colOffset = 8
  public static _characterFrames = (
    row: number,
    keyframe: number,
    keyframes: number = 2
  ) => {
    const frames = []
    for (let i = 0; i < keyframes; i++) {
      frames.push(Texture.from(`c_r${row}c${i + keyframe}.png`))
    }
    return frames
  }
}

export default Skeleton
