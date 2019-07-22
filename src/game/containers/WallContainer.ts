import { Sprite } from 'pixi.js'
import withLighting from '../decorators/withLighting'

@withLighting(false)
export default class WallContainer {
  public sprite: PIXI.DisplayObject

  constructor(x: number, y: number, texture: PIXI.Texture) {
    this.sprite = new Sprite(texture)
    this.sprite.x = x
    this.sprite.y = y
  }

  public get visible() {
    return this.sprite.visible || this.sprite.renderable
  }
}
