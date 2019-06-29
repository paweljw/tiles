import { Texture } from 'pixi.js'
import TextureCache from './TextureCache'

class Missile extends TextureCache {
  public static get missile () {
    return this._lookup('missile', () => {
      const frames = []
      frames.push(Texture.from(`r7c35.png`))
      frames.push(Texture.from(`r7c36.png`))
      frames.push(Texture.from(`r7c37.png`))
      frames.push(Texture.from(`r7c36.png`))
      frames.push(Texture.from(`r7c35.png`))

      return frames
    })
  }

}

export default Missile
