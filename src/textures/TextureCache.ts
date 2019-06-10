import { Texture } from 'pixi.js';

class TextureCache {
  static _cache = new Map()

  static _textureMap = {}

  static _lookup(texture: string, buildCallback?: any) {
    if(!this._cache.has(texture)) {
      this._cache.set(texture, buildCallback ? buildCallback() : Texture.from(this._textureMap[texture]));
    }

    return this._cache.get(texture);
  }
}

export default TextureCache;