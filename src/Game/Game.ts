import { Application, loader, Sprite, Container } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Simple as Cull } from './culling'

import scaleToWindow from './helpers/scaleToWindow'
import { CharacterContainer } from './containers/CharacterContainer'
import getRandomInt from './helpers/getRandomInt'
import Collider from './Collider'
import Wall from '../textures/Wall'
import Floor from '../textures/Floor'
import Level from './Level'
import stores from '../stores'
import SkeletonContainer from './containers/SkeletonContainer'
import WallContainer from './containers/WallContainer'
import FloorContainer from './containers/FloorContainer'

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
  private level: Level

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
    const ret = scaleToWindow(stores.gameStateStore.app.view)
    document.getElementById('root').style.zoom = ret.toString()
    scrollTo(0, 0)
  }

  public loop = (delta: number) => {
    const { gameStateStore } = stores

    gameStateStore.fps = parseFloat((60 / delta).toFixed(2))

    if (gameStateStore.paused) return

    gameStateStore.steppables.forEach(steppable => {
      const dirties = steppable.step(delta, stores.gameStateStore.collider)
      dirties.forEach(dirty => stores.gameStateStore.cullMask.markDirty(dirty))
    })

    if (stores.gameStateStore.viewport.dirty) {
      stores.gameStateStore.cullMask.cull(stores.gameStateStore.viewport.getVisibleBounds())
      stores.gameStateStore.viewport.dirty = false
    }
  }

  public buildLevelContainer = () => {
    this.level = new Level(50, 50)

    // TODO: Move all of the tile generation to Level

    for (let i = 0; i < this.level.width; i++) {
      for (let j = 0; j < this.level.height; j++) {
        const tileType = this.level.maze[this.level.locate({ x: i, y: j })]

        const collidable = tileType === 'wall'

        const baseX = i * 64
        const baseY = j * 64

        for (let xOffset = 0; xOffset < 2; xOffset++) {
          for (let yOffset = 0; yOffset < 2; yOffset++) {
            const random = getRandomInt(5) + 1
            if (collidable) {
              const container = new WallContainer(baseX + xOffset * 32, baseY + yOffset * 32, Wall[`wall${random}`])
              stores.gameStateStore.viewport.addChild(container.sprite)
              stores.gameStateStore.cullMask.addObject(container.sprite, true, collidable)
            } else {
              const container = new FloorContainer(baseX + xOffset * 32, baseY + yOffset * 32, Floor[`floor${random}`])
              stores.gameStateStore.viewport.addChild(container.sprite)
              stores.gameStateStore.cullMask.addObject(container.sprite, true, collidable)
            }
          }
        }
      }
    }


    for (let i = 200; i >= 0;) {
      const x = Math.floor(Math.random() * this.level.width)
      const y = Math.floor(Math.random() * this.level.height)

      const tileType = this.level.maze[this.level.locate({ x, y })]

      if (tileType === 'floor') {
        const skeletonX = x * 64 + 32
        const skeletonY = y * 64 + 32

        if (!Array.from(stores.gameStateStore.steppables.entries()).find(
          ([item, _]) => item.sprite.x === skeletonX && item.sprite.y === skeletonY)
        ) {
          i--

          const skeleton = new SkeletonContainer(skeletonX, skeletonY)
          stores.gameStateStore.steppables.add(skeleton)
          stores.gameStateStore.viewport.addChild(skeleton.sprite)
          stores.gameStateStore.cullMask.addObject(skeleton.sprite, false, true)
        }
      }
    }

    return stores.gameStateStore.viewport
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

    stores.gameStateStore.cullMask = new Cull()

    this.buildLevelContainer()

    stores.gameStateStore.char = new CharacterContainer(240, 3020)
    stores.gameStateStore.steppables.add(stores.gameStateStore.char)

    stores.gameStateStore.viewport.addChild(stores.gameStateStore.char.sprite)
    stores.gameStateStore.viewport.follow(stores.gameStateStore.char.sprite)
    stores.gameStateStore.app.stage.addChild(stores.gameStateStore.viewport)

    stores.gameStateStore.cullMask.addObject(stores.gameStateStore.char.sprite, false, true)

    stores.gameStateStore.cullMask.cull(stores.gameStateStore.viewport.getVisibleBounds())

    stores.gameStateStore.collider = new Collider(stores.gameStateStore.cullMask, this.level)

    stores.gameStateStore.app.ticker.add(delta => this.loop(delta))

    this.startGame()
  }
}

export default Game
