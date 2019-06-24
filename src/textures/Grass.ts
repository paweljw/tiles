import TextureCache from './TextureCache'

class Grass extends TextureCache {
  public static _textureMap = {
    grass1: 'r16c1.png',
    grass2: 'r16c2.png',
    grass3: 'r16c3.png',
    grass4: 'r16c4.png',
    grass5: 'r16c5.png'
  }

  static get grass1() {
    return this._lookup('grass1')
  }
  static get grass2() {
    return this._lookup('grass2')
  }
  static get grass3() {
    return this._lookup('grass3')
  }
  static get grass4() {
    return this._lookup('grass4')
  }
  static get grass5() {
    return this._lookup('grass5')
  }
}

export default Grass
