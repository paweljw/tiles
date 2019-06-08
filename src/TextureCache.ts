import { Texture } from 'pixi.js';

const textureMap = {
  grass1: 'r16c1.png',
  grass2: 'r16c2.png',
  grass3: 'r16c3.png',
  grass4: 'r16c4.png',
  grass5: 'r16c5.png',
};

const characterFrames = (row: number) => {
  const frames = [];
  for(let i = 1; i <= 4; i++) {
    frames.push(Texture.from(`c_r${row}c${i}.png`))
  }
  return frames;
}

class TextureCache {
  static _cache = new Map()

  static _lookup = (texture: string, buildCallback?: any) => {
    if(!TextureCache._cache.has(texture)) {
      TextureCache._cache.set(texture, buildCallback ? buildCallback() : Texture.from(textureMap[texture]));
    }

    return TextureCache._cache.get(texture);
  }

  static get grass1 () { return this._lookup('grass1') }
  static get grass2 () { return this._lookup('grass2') }
  static get grass3 () { return this._lookup('grass3') }
  static get grass4 () { return this._lookup('grass4') }
  static get grass5 () { return this._lookup('grass5') }

  static get cDown () {
    return this._lookup('cDown', () => characterFrames(1))
  }

  static get cRight () {
    return this._lookup('cRight', () => characterFrames(2))
  }

  static get cUp () {
    return this._lookup('cUp', () => characterFrames(3))
  }
  static get cLeft () {
    return this._lookup('cLeft', () => characterFrames(4))
  }
}

export default TextureCache;