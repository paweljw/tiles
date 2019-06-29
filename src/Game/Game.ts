import { Application, loader, Sprite, Container } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Simple as Cull } from './culling'

import scaleToWindow from './helpers/scaleToWindow'
import { CharacterContainer } from './CharacterContainer'
import getRandomInt from './helpers/getRandomInt'
import Collider from './Collider'
import Wall from '../textures/Wall'
import Floor from '../textures/Floor'
import Level from './Level'
import stores from '../stores'

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
  private cullMask: Cull
  private collider: Collider

  constructor(element: HTMLElement) {
    this.element = element
    stores.gameStateStore.app = Game.buildApp()

    // Ensure proper playfield resizing
    window.addEventListener('resize', this.onResizeHandler)

    loader
      .add('spritesheet', './tileset.json')
      .add('character_spritesheet', './character32.json')
      .load(this.afterLoad)
  }

  public onResizeHandler = () => {
    scaleToWindow(stores.gameStateStore.app.view)
    scrollTo(0, 0)
  }

  public loop = (delta: number) => {
    const { gameStateStore } = stores

    gameStateStore.fps = parseFloat((60 / delta).toFixed(2))

    if (gameStateStore.paused) return

    gameStateStore.steppables.forEach(steppable => {
      const dirties = steppable.step(delta, this.collider)
      dirties.forEach(dirty => this.cullMask.markDirty(dirty))
    })

    if (stores.gameStateStore.viewport.dirty) {
      this.cullMask.cull(stores.gameStateStore.viewport.getVisibleBounds())
      stores.gameStateStore.viewport.dirty = false
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

    viewport.clamp({ direction: 'all' })

    return viewport
  }

  public startGame = () => {
    const { gameStateStore } = stores
    gameStateStore.loading = false

    this.element.appendChild(stores.gameStateStore.app.view)
    this.onResizeHandler()
    stores.gameStateStore.app.start()
  }

  public afterLoad = () => {
    stores.gameStateStore.viewport = this.buildViewport()

    this.cullMask = new Cull()

    const grass = this.buildLevelContainer()

    stores.gameStateStore.viewport.addChild(grass)

    stores.gameStateStore.char = new CharacterContainer(240, 720)
    stores.gameStateStore.steppables.add(stores.gameStateStore.char)

    stores.gameStateStore.viewport.addChild(stores.gameStateStore.char.sprite)
    stores.gameStateStore.viewport.follow(stores.gameStateStore.char.sprite)
    stores.gameStateStore.app.stage.addChild(stores.gameStateStore.viewport)

    this.cullMask.addObject(stores.gameStateStore.char.sprite, false, true)

    this.cullMask.cull(stores.gameStateStore.viewport.getVisibleBounds())

    this.collider = new Collider(this.cullMask)

    stores.gameStateStore.app.ticker.add(delta => this.loop(delta))

    this.startGame()
  }
}

export default Game
