import { Application, loader } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Simple as Cull } from './culling'

import scaleToWindow from './helpers/scaleToWindow'
import { CharacterContainer } from './containers/CharacterContainer'
import Collider from './Collider'
import stores from '../stores'
import SkeletonContainer from './containers/SkeletonContainer'
import LightProvider from './LightProvider'
import Sounds from './Sounds'
import MazeLevel from './levels/MazeLevel'
import midpointRealCoords from './helpers/midpointRealCoords'
import { IPoint, Direction } from './types'
import TileCollider from './TileCollider'
import Mouse from './Mouse'
import { RENDERER_WIDTH, RENDERER_HEIGHT } from './constants/renderer'

class Game {
  public static buildApp = (): PIXI.Application => {
    const app = new Application({
      width: RENDERER_WIDTH,
      height: RENDERER_HEIGHT,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio || 1
    })

    app.renderer.autoResize = true
    app.renderer.backgroundColor = 0x000000

    return app
  }
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
    stores.gameStateStore.app = Game.buildApp()

    // Ensure proper playfield resizing
    window.addEventListener('resize', this.onResizeHandler)

    loader
      .add('spritesheet', './tileset.json')
      .add('character_spritesheet', './character36.json')
      .add('character_spritesheet2', './character32.json')
      .add('step_sound', './step.mp3')
      .add('fire_sound', './fire.mp3')
      .add('select_sound', './select.mp3')
      .add('accept_sound', './accept.mp3')
      .add('pause_sound', './pause.mp3')
      .add('bone_hit_sound', './bone_hit.mp3')
      .load(this.afterLoad)
  }

  public onResizeHandler = () => {
    const ret = scaleToWindow(stores.gameStateStore.app.view)
    document.getElementById('root').style.zoom = ret.toString()
    stores.gameStateStore.scale = ret
    scrollTo(0, 0)
  }

  public loop = (delta: number) => {
    const { gameStateStore } = stores

    gameStateStore.fps = parseFloat((60 / delta).toFixed(2))


    if (stores.gameStateStore.mouse.mouseDirection) {
      let cursor = 'default'
      switch (stores.gameStateStore.mouse.mouseDirection) {
        case Direction.UP:
          cursor = 'url(up.png), n-resize'
          break
        case Direction.DOWN:
          cursor = 'url(down.png), s-resize'
          break
        case Direction.RIGHT:
          cursor = 'url(right.png), e-resize'
          break
        case Direction.LEFT:
          cursor = 'url(left.png), w-resize'
          break
        case Direction.UP_RIGHT:
          cursor = 'url(up-right.png), ne-resize'
          break
        case Direction.DOWN_RIGHT:
          cursor = 'url(down-right.png), se-resize'
          break
        case Direction.UP_LEFT:
          cursor = 'url(up-left.png), nw-resize'
          break
        case Direction.DOWN_LEFT:
          cursor = 'url(down-left.png), sw-resize'
          break
      }
      document.body.style.cursor = cursor
    }

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

  // TODO: This... could go somewhero elso, I think (it got way too beefy)
  public loadCurrentLevel = () => {
    stores.gameStateStore.cullMask = new Cull()
    stores.gameStateStore.viewport.worldWidth = stores.gameStateStore.currentLevel.pixelWidth
    stores.gameStateStore.viewport.worldHeight = stores.gameStateStore.currentLevel.pixelHeight

    stores.gameStateStore.app.stage.children.forEach(child => stores.gameStateStore.app.stage.removeChild(child))
    stores.gameStateStore.viewport.children.forEach(child => stores.gameStateStore.viewport.removeChild(child))

    stores.gameStateStore.tileCollider = new TileCollider()

    for (let i = 0; i < stores.gameStateStore.currentLevel.width; i++) {
      for (let j = 0; j < stores.gameStateStore.currentLevel.height; j++) {
        const container = stores.gameStateStore.currentLevel.textureAt({ x: i, y: j })
        stores.gameStateStore.viewport.addChild(container.sprite)
        stores.gameStateStore.cullMask.addObject(container.sprite, true, container.isCollidable)
        if (container.isCollidable) {
          stores.gameStateStore.tileCollider.addContainer(container)
        }
      }
    }

    stores.gameStateStore.currentLevel.spawns().forEach((spawn: IPoint) => {
      const { x: dx, y: dy } = midpointRealCoords(spawn)

      const skeleton = new SkeletonContainer(dx, dy)
      stores.gameStateStore.steppables.add(skeleton)
      stores.gameStateStore.viewport.addChild(skeleton.sprite)
      stores.gameStateStore.cullMask.addObject(skeleton.sprite, false, true)
      stores.gameStateStore.tileCollider.addContainer(skeleton)
    })

    stores.gameStateStore.steppables.add(new LightProvider())

    const { x, y } = midpointRealCoords(stores.gameStateStore.currentLevel.characterSpawn())

    stores.gameStateStore.char = new CharacterContainer(x, y)
    stores.gameStateStore.tileCollider.addContainer(stores.gameStateStore.char)
    stores.gameStateStore.steppables.add(stores.gameStateStore.char)

    stores.gameStateStore.viewport.addChild(stores.gameStateStore.char.sprite)
    stores.gameStateStore.viewport.follow(stores.gameStateStore.char.sprite)
    stores.gameStateStore.cullMask.addObject(stores.gameStateStore.char.sprite, false, true)

    stores.gameStateStore.app.stage.addChild(stores.gameStateStore.viewport)

    stores.gameStateStore.cullMask.cull(stores.gameStateStore.viewport.getVisibleBounds())
  }

  public buildViewport = () => {
    const viewport = new Viewport({
      screenWidth: RENDERER_WIDTH,
      screenHeight: RENDERER_HEIGHT,
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
    stores.gameStateStore.sounds = new Sounds(loader)
    stores.gameStateStore.sounds.addSound('step_sound')
    stores.gameStateStore.sounds.addSound('fire_sound')
    stores.gameStateStore.sounds.addSound('select_sound')
    stores.gameStateStore.sounds.addSound('accept_sound')
    stores.gameStateStore.sounds.addSound('pause_sound')
    stores.gameStateStore.sounds.addSound('bone_hit_sound')

    stores.gameStateStore.viewport = this.buildViewport()

    // TODO: Initial level: this may need whapping elsewhere (e.g. reaction to character selection)
    stores.gameStateStore.currentLevel = new MazeLevel(100, 100)
    this.loadCurrentLevel()
    stores.gameStateStore.mouse = new Mouse()

    stores.gameStateStore.app.ticker.add(delta => this.loop(delta))

    this.startGame()
  }
}

export default Game
