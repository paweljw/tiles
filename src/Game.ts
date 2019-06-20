import {
  Application,
  loader,
  Sprite,
  Container
} from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Simple as Cull } from './culling';

import scaleToWindow from './helpers/scaleToWindow';
import { CharacterContainer } from './CharacterContainer';
import getRandomInt from './helpers/getRandomInt';
import Grass from './textures/Grass';
import { SteppableInterface } from './types';

class Game {
  private element: HTMLElement;
  private app: PIXI.Application;
  private char: CharacterContainer;
  private steppables: Array<SteppableInterface> = [];
  private cullMask: Cull;
  private viewport: Viewport;

  public static buildApp = (): PIXI.Application => {
    const app = new Application({
      width: 1280,
      height: 720,
      antialias: true,
      transparent: false,
      resolution: (window.devicePixelRatio || 1)
    });

    app.renderer.autoResize = true;
    app.renderer.backgroundColor = 0x666666;

    return app;
  }

  constructor (element: HTMLElement) {
    this.element = element;
    this.app = Game.buildApp();

    // Ensure proper playfield resizing
    window.addEventListener('resize', this.onResizeHandler);

    loader.add('spritesheet', './tileset.json')
          .add('character_spritesheet', './character32.json')
          .load(this.afterLoad)
  }

  onResizeHandler = () => {
    scaleToWindow(this.app.view);
    scrollTo(0, 0);
  }

  loop = (delta: number) => {
    this.steppables.forEach(steppable => {
      const dirties = steppable.step(delta);
      dirties.forEach(dirty => this.cullMask.markDirty(dirty))
    });

    if (this.viewport.dirty)
    {
      this.cullMask.cull(this.viewport.getVisibleBounds());
      this.viewport.dirty = false;
    }
  }

  buildGrassContainer = () => {
    const grassContainer = new Container();

    for(let i = 0; i < 3200 / 32; i++) {
      for(let j = 0; j < 3200 / 32; j++) {
        const grassName = `grass${getRandomInt(5) + 1}`;
        const grass = new Sprite(Grass[grassName]);

        grass.x = i * 32;
        grass.y = j * 32;

        grassContainer.addChild(grass);
      }
    }

    return grassContainer;
  }

  buildViewport = () => {
    const viewport = new Viewport({
      screenWidth: 1280,
      screenHeight: 720,
      worldWidth: 3200,
      worldHeight: 3200,
    })

    viewport.decelerate()
            .clamp({ direction: 'all' });

    return viewport;
  }

  startGame = () => {
    this.element.children[0].remove();
    this.element.appendChild(this.app.view);

    this.element.classList.remove('app--loading');

    this.onResizeHandler();

    this.app.start();
  }

  afterLoad = () => {
    this.viewport = this.buildViewport();

    const grass = this.buildGrassContainer();

    this.cullMask = new Cull();
    this.cullMask.addChildrenOf(grass);

    this.viewport.addChild(grass);

    this.char = new CharacterContainer(400, 300);
    this.steppables.push(this.char);

    this.viewport.addChild(this.char.sprite);
    this.viewport.follow(this.char.sprite);
    this.app.stage.addChild(this.viewport);

    this.cullMask.addObject(this.char.sprite, false);

    this.cullMask.cull(this.viewport.getVisibleBounds());

    this.app.ticker.add(delta => this.loop(delta));
    this.startGame();
  }
}

export default Game;
