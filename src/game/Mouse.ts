import stores from '../stores'
import { RENDERER_WIDTH, RENDERER_HEIGHT } from './constants/renderer'
import { Direction } from './types'

const { PI } = Math

export enum Buttons {
  LEFT, MIDDLE, RIGHT, FOURTH, FIFTH
}

export default class Mouse {
  public x: number
  public y: number
  public buttons: Map<Buttons, boolean> = new Map()

  constructor() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mousedown', this.onMouseDown.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  public get angleToChar(): number {
    const { char, viewport } = stores.gameStateStore

    if (!char || !viewport || !this.x || !this.y) {
      return null
    }

    const { x: cX, y: cY } = char.sprite

    const dx = this.x - (cX - viewport.getVisibleBounds().x)
    const dy = this.y - (cY - viewport.getVisibleBounds().y)

    return Math.atan2(dx, dy)
  }


  public get mouseDirection(): Direction {
    const angle = this.angleToChar

    if (!angle) {
      return null
    }

    const ePI = PI / 8

    if (angle <= PI && angle > 7 * ePI) {
      return Direction.UP
    }

    if (angle <= 7 * ePI && angle > 5 * ePI) {
      return Direction.UP_RIGHT
    }

    if (angle <= 5 * ePI && angle > 3 * ePI) {
      return Direction.RIGHT
    }

    if (angle <= 3 * ePI && angle > ePI) {
      return Direction.DOWN_RIGHT
    }

    if (angle <= ePI && angle >= 0) {
      return Direction.DOWN
    }

    if (angle < 0 * ePI && angle >= -ePI) {
      return Direction.DOWN
    }

    if (angle < -ePI && angle >= -3 * ePI) {
      return Direction.DOWN_LEFT
    }

    if (angle < -3 * ePI && angle >= -5 * ePI) {
      return Direction.LEFT
    }

    if (angle < -5 * ePI && angle >= -7 * ePI) {
      return Direction.UP_LEFT
    }

    if (angle < -7 * ePI && angle >= -PI) {
      return Direction.UP
    }

    return null
  }

  public isButtonDown(button: Buttons): boolean {
    return this.buttons.has(button) && this.buttons.get(button)
  }


  private onMouseMove(event: MouseEvent) {
    const elem = document.getElementsByTagName('canvas')[0]
    if (!elem) {
      return
    }

    const rect = elem.getBoundingClientRect()
    const scale = stores.gameStateStore.scale

    // @ts-ignore
    if (typeof rect.x === 'number' && typeof rect.y === 'number' && scale) {
      // @ts-ignore
      const normalizedX = (event.x - rect.x) / scale
      // @ts-ignore
      const normalizedY = (event.y - rect.y) / scale

      if (normalizedX >= 0 && normalizedX <= RENDERER_WIDTH && normalizedY >= 0 && normalizedY <= RENDERER_HEIGHT) {
        this.x = normalizedX
        this.y = normalizedY
      } else {
        this.x = null
        this.y = null
      }
    }
  }

  private onMouseDown({ button, preventDefault }: MouseEvent) {
    switch (button) {
      case 0:
        this.buttons.set(Buttons.LEFT, true)
        break
      case 1:
        this.buttons.set(Buttons.MIDDLE, true)
        break
      case 2:
        this.buttons.set(Buttons.RIGHT, true)
        break
      case 3:
        this.buttons.set(Buttons.FOURTH, true)
        break
      case 4:
        this.buttons.set(Buttons.FIFTH, true)
        break
    }

    preventDefault()
  }

  private onMouseUp({ button, preventDefault }: MouseEvent) {
    switch (button) {
      case 0:
        this.buttons.set(Buttons.LEFT, false)
        break
      case 1:
        this.buttons.set(Buttons.MIDDLE, false)
        break
      case 2:
        this.buttons.set(Buttons.RIGHT, false)
        break
      case 3:
        this.buttons.set(Buttons.FOURTH, false)
        break
      case 4:
        this.buttons.set(Buttons.FIFTH, false)
        break
    }

    preventDefault()
  }
}
