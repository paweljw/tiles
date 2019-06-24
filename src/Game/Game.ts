import { Application, loader, Sprite, Container } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Simple as Cull } from './culling'

import scaleToWindow from './helpers/scaleToWindow'
import { CharacterContainer } from './CharacterContainer'
import getRandomInt from './helpers/getRandomInt'
import { ISteppableInterface } from './types'
import Collider from './Collider'
import Wall from '../textures/Wall'
import Floor from '../textures/Floor'
import Level from './Level'

class Game {
  public static buildApp = (): PIXI.Application => {
    const app = new Application({
      width: 1280,
      height: 720,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio || 1
    })

    app.renderer.autoResize = true
    app.renderer.backgroundColor = 0x666666

    return app
  }
  private element: HTMLElement
  private app: PIXI.Application
  private char: CharacterContainer
  private steppables: ISteppableInterface[] = []
  private cullMask: Cull
  private viewport: Viewport
  private collider: Collider

  constructor(element: HTMLElement) {
    this.element = element
    this.app = Game.buildApp()

    // Ensure proper playfield resizing
    window.addEventListener('resize', this.onResizeHandler)

    loader
      .add('spritesheet', './tileset.json')
      .add('character_spritesheet', './character32.json')
      .load(this.afterLoad)
  }

  public onResizeHandler = () => {
    scaleToWindow(this.app.view)
    scrollTo(0, 0)
  }

  public loop = (delta: number) => {
    this.steppables.forEach(steppable => {
      const dirties = steppable.step(delta, this.collider)
      dirties.forEach(dirty => this.cullMask.markDirty(dirty))
    })

    if (this.viewport.dirty) {
      this.cullMask.cull(this.viewport.getVisibleBounds())
      this.viewport.dirty = false
    }
  }

  public buildLevelContainer = () => {
    const level = new Level(50, 50)
    const floor = new Container()

    // TODO: Move all of the tile generation to Level

    for (let i = 0; i < level.width; i++) {
      for (let j = 0; j < level.height; j++) {
        const tileType = level.maze[level.locate({ x: i, y: j })]

        const collidable = tileType === 'wall'

        const baseX = i * 64
        const baseY = j * 64

        for (let xOffset = 0; xOffset < 2; xOffset++) {
          for (let yOffset = 0; yOffset < 2; yOffset++) {
            const random = getRandomInt(5) + 1
            const texture = collidable
              ? Wall[`wall${random}`]
              : Floor[`floor${random}`]
            const tile = new Sprite(texture)

            tile.x = baseX + xOffset * 32
            tile.y = baseY + yOffset * 32

            floor.addChild(tile)

            this.cullMask.addObject(tile, true, collidable)
          }
        }
      }
    }

    return floor
  }

  public buildViewport = () => {
    const viewport = new Viewport({
      screenWidth: 1280,
      screenHeight: 720,
      worldWidth: 3200,
      worldHeight: 3200
    })

    viewport.decelerate().clamp({ direction: 'all' })

    return viewport
  }

  public startGame = () => {
    window.dispatchEvent(new Event('game-loaded'))
    this.element.appendChild(this.app.view)
    document.getElementById('app').classList.remove('app--loading')
    document.getElementById('game').classList.remove('hidden')
    this.onResizeHandler()
    this.app.start()
  }

  public afterLoad = () => {
    this.viewport = this.buildViewport()

    this.cullMask = new Cull()

    const grass = this.buildLevelContainer()

    this.viewport.addChild(grass)

    this.char = new CharacterContainer(240, 720)
    this.steppables.push(this.char)

    this.viewport.addChild(this.char.sprite)
    this.viewport.follow(this.char.sprite)
    this.app.stage.addChild(this.viewport)

    this.cullMask.addObject(this.char.sprite, false, true)

    this.cullMask.cull(this.viewport.getVisibleBounds())

    this.collider = new Collider(this.cullMask)

    this.app.ticker.add(delta => this.loop(delta))

    this.startGame()
  }
}

export default Game
