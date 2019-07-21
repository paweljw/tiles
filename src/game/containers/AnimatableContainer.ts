import BaseContainer from './BaseContainer'
import { Facing } from '../types'
import TextureCache from '../../textures/TextureCache'

export abstract class AnimatableContainer extends BaseContainer {
  public sprite: PIXI.extras.AnimatedSprite
  public movementSpeed: number
  public facing: Facing = Facing.DOWN

  constructor(x: number, y: number, movementSpeed: number) {
    super(x, y)
    this.movementSpeed = movementSpeed
    this.sprite.animationSpeed = 0.05 * this.movementSpeed
    this.sprite.anchor.set(0.5)
    this.setFacing(Facing.DOWN)
    this.sprite.stop()
  }

  protected setFacing(facing: Facing): void {
    if (this.facing === facing) {
      return
    }

    this.facing = facing
    this.sprite.textures = this.texturePack[facing]
  }

  protected buildSprite(): PIXI.extras.AnimatedSprite {
    return new PIXI.extras.AnimatedSprite(this.texturePack[this.facing || Facing.DOWN])
  }

  protected abstract get texturePack(): TextureCache
}
