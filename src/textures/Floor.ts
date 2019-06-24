import TextureCache from './TextureCache'

class Floor extends TextureCache {
  public static _textureMap = {
    floor1: 'r14c30.png',
    floor2: 'r14c31.png',
    floor3: 'r14c32.png',
    floor4: 'r14c33.png',
    floor5: 'r14c34.png'
  }

  static get floor1() {
    return this._lookup('floor1')
  }
  static get floor2() {
    return this._lookup('floor2')
  }
  static get floor3() {
    return this._lookup('floor3')
  }
  static get floor4() {
    return this._lookup('floor4')
  }
  static get floor5() {
    return this._lookup('floor5')
  }
}

export default Floor
