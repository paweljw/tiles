import { Application, loader } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Simple as Cull } from './culling'
import PixiSound from 'pixi-sound'
const sound = PixiSound.Sound

import scaleToWindow from './helpers/scaleToWindow'
import { CharacterContainer } from './containers/CharacterContainer'
import getRandomInt from './helpers/getRandomInt'
import Collider from './Collider'
import Wall from '../textures/Wall'
import Floor from '../textures/Floor'
import Level from './levels/MazeLevel'
import { TILE_WIDTH, TILE_HEIGHT } from './constants/tilemap'
import stores from '../stores'
import SkeletonContainer from './containers/SkeletonContainer'
import LightProvider from './LightProvider'
import Sounds from './Sounds'
import SimplexContainer from './containers/SimplexContainer';
import MazeLevel from './levels/MazeLevel';
import midpointRealCoords from './helpers/midpointRealCoords';

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
    app.renderer.backgroundColor = 0x000000

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
    this.level = new MazeLevel(100, 100)

    for (let i = 0; i < this.level.width; i++) {
      for (let j = 0; j < this.level.height; j++) {
        const container = this.level.textureAt({ x: i, y: j })
        stores.gameStateStore.viewport.addChild(container.sprite)
        stores.gameStateStore.cullMask.addObject(container.sprite, true, container.isCollidable)
      }
    }

    this.level.spawns().forEach(spawn => {
      const { x, y } = midpointRealCoords(spawn)

      const skeleton = new SkeletonContainer(x, y)
      stores.gameStateStore.steppables.add(skeleton)
      stores.gameStateStore.viewport.addChild(skeleton.sprite)
      stores.gameStateStore.cullMask.addObject(skeleton.sprite, false, true)
    })

    stores.gameStateStore.steppables.add(new LightProvider(this.level))

    const { x, y } = midpointRealCoords(this.level.characterSpawn())

    stores.gameStateStore.char = new CharacterContainer(x, y)
    stores.gameStateStore.steppables.add(stores.gameStateStore.char)

    stores.gameStateStore.viewport.addChild(stores.gameStateStore.char.sprite)
    stores.gameStateStore.viewport.follow(stores.gameStateStore.char.sprite)

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
    stores.gameStateStore.sounds = new Sounds(loader)
    stores.gameStateStore.sounds.addSound('step_sound')
    stores.gameStateStore.sounds.addSound('fire_sound')
    stores.gameStateStore.sounds.addSound('select_sound')
    stores.gameStateStore.sounds.addSound('accept_sound')
    stores.gameStateStore.sounds.addSound('pause_sound')
    stores.gameStateStore.sounds.addSound('bone_hit_sound')


    stores.gameStateStore.viewport = this.buildViewport()
    stores.gameStateStore.cullMask = new Cull()
    this.buildLevelContainer()

    stores.gameStateStore.viewport.worldWidth = this.level.pixelWidth
    stores.gameStateStore.viewport.worldHeight = this.level.pixelHeight

    stores.gameStateStore.app.stage.addChild(stores.gameStateStore.viewport)

    stores.gameStateStore.cullMask.addObject(stores.gameStateStore.char.sprite, false, true)

    stores.gameStateStore.cullMask.cull(stores.gameStateStore.viewport.getVisibleBounds())

    stores.gameStateStore.collider = new Collider(stores.gameStateStore.cullMask, this.level)

    stores.gameStateStore.app.ticker.add(delta => this.loop(delta))

    this.startGame()
  }
}

export default Game
