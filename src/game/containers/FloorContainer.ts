import SimplexContainer from './SimplexContainer'
import getRandomInt from '../helpers/getRandomInt'
import Floor from '../../textures/Floor'

export default class FloorContainer extends SimplexContainer {
  constructor(x: number, y: number, texture?: PIXI.Texture) {
    if (!texture) {
      const random = getRandomInt(5) + 1
      texture = Floor[`floor${random}`]
    }

    super(x, y, texture)
  }
}
