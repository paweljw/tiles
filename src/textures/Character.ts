import { Texture } from 'pixi.js';
import TextureCache from "./TextureCache";

class Character extends TextureCache {
  static _characterFrames = (row: number, keyframe: number, keyframes: number = 2) => {
    const frames = [];
    for(let i = 0; i < keyframes; i++) {
      frames.push(Texture.from(`c_r${row}c${i + keyframe}.png`))
    }
    return frames;
  }

  static _rowOffset = 0;
  static _colOffset = 0;

  static get cUp () {
    return this._lookup('cUp', () => this._characterFrames(this._rowOffset + 1, this._colOffset + 1))
  }

  static get cDown () {
    return this._lookup('cDown', () => this._characterFrames(this._rowOffset + 1, this._colOffset + 3))
  }

  static get cLeft () {
    return this._lookup('cLeft', () => this._characterFrames(this._rowOffset + 1, this._colOffset + 5))
  }

  static get cRight () {
    return this._lookup('cRight', () => this._characterFrames(this._rowOffset + 1, this._colOffset + 7))
  }
}

export default Character;