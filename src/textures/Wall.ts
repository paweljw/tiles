import TextureCache from "./TextureCache";

class Wall extends TextureCache {
  static _textureMap = {
    wall1: 'r14c25.png',
    wall2: 'r14c26.png',
    wall3: 'r14c27.png',
    wall4: 'r14c28.png',
    wall5: 'r14c29.png',
  };

  static get wall1 () { return this._lookup('wall1') }
  static get wall2 () { return this._lookup('wall2') }
  static get wall3 () { return this._lookup('wall3') }
  static get wall4 () { return this._lookup('wall4') }
  static get wall5 () { return this._lookup('wall5') }
}

export default Wall;
