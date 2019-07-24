import { Sprite } from 'pixi.js'
import withLighting from '../decorators/withLighting'
import tileCoords from '../helpers/tileCoords'
import { IPoint } from '../types'

@withLighting(false)
export default class SimplexContainer {
  public sprite: PIXI.DisplayObject
  public tileX: number
  public tileY: number

  constructor(x: number, y: number, texture?: PIXI.Texture) {
    this.sprite = new Sprite(texture)
    this.sprite.x = x
    this.sprite.y = y

    const { x: tileX, y: tileY } = tileCoords({ x, y })
    this.tileX = tileX
    this.tileY = tileY
  }

  public get visible() {
    return this.sprite.visible || this.sprite.renderable
  }

  public get isCollidable(): boolean {
    return false
  }

  public get tileCoords(): IPoint {
    return { x: this.tileX, y: this.tileY }
  }

  public receiveDamage(..._args) { /* no-op */ }
}
