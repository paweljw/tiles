import { Texture } from 'pixi.js'

class TextureCache {
  public static _cache = new Map()

  public static _textureMap = {}

  public static _lookup(texture: string, buildCallback?: any) {
    if (!this._cache.has(texture)) {
      this._cache.set(
        texture,
        buildCallback
          ? buildCallback()
          : Texture.from(this._textureMap[texture])
      )
    }

    return this._cache.get(texture)
  }
}

export default TextureCache
