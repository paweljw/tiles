import SimplexContainer from './SimplexContainer'
import getRandomInt from '../helpers/getRandomInt'
import Wall from '../../textures/Wall'

export default class WallContainer extends SimplexContainer {
  constructor(x: number, y: number, texture?: PIXI.Texture) {
    if (!texture) {
      const random = getRandomInt(5) + 1
      texture = Wall[`wall${random}`]
    }

    super(x, y, texture)
  }

  public get isCollidable(): boolean {
    return true
  }
}
