import SimplexContainer from './SimplexContainer'

export default abstract class BaseContainer extends SimplexContainer {
  public sprite: PIXI.DisplayObject

  constructor(x: number, y: number) {
    super(x, y)
    this.sprite = this.buildSprite()
    this.sprite.x = x
    this.sprite.y = y
  }

  public get visible() {
    return this.sprite.visible || this.sprite.renderable
  }

  protected abstract buildSprite(): PIXI.DisplayObject
}
