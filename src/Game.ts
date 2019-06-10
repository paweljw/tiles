import {
  Application,
  loader,
  Sprite
} from 'pixi.js';

import scaleToWindow from './helpers/scaleToWindow';
import { CharacterContainer } from './CharacterContainer';
import getRandomInt from './helpers/getRandomInt';
import Grass from './textures/Grass';
import { SteppableInterface } from '.';

class Game {
  public element: HTMLElement;
  public app: PIXI.Application;
  public char: CharacterContainer;
  public steppables: Array<SteppableInterface> = [];

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
    this.steppables.forEach(steppable => steppable.step(delta));
  }

  afterLoad = () => {
    for(let i = 0; i < 3200 / 32; i++) {
      for(let j = 0; j < 3200 / 32; j++) {
        const grassName = `grass${getRandomInt(5) + 1}`;
        const grass = new Sprite(Grass[grassName]);

        grass.x = i * 32;
        grass.y = j * 32;

        this.app.stage.addChild(grass);
      }
    }

    this.char = new CharacterContainer(400, 300);
    this.steppables.push(this.char);

    this.app.stage.addChild(this.char.sprite);

    this.app.ticker.add(delta => this.loop(delta));

    this.element.children[0].remove();
    this.element.appendChild(this.app.view);

    this.element.classList.remove('app--loading');
    
    this.onResizeHandler();
            
    this.app.start();
  }
}

export default Game;