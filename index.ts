import {
  Application,
  loader,
  Sprite,
  extras as PixiExtras
} from 'pixi.js';

import TextureCache from './src/TextureCache';
import getRandomInt from './src/helpers/getRandomInt';
import { CharacterContainer, Facing } from './src/CharacterContainer'
import { SteppableInterface } from './src/index'

const app = new Application({
  width: 1024,
  height: 576,
  antialias: true,
  transparent: false,
  resolution: (window.devicePixelRatio || 1) * 2
});

app.renderer.backgroundColor = 0x666666;

document.getElementById('app').appendChild(app.view);

let char: CharacterContainer;
let steppables: Array<SteppableInterface> = [];

const gameLoop = (delta: number) => {
  steppables.forEach(steppable => steppable.step(delta));
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (!char) {
    return;
  }

  const { code } = event;

  switch(code) {
    case 'KeyD':
      char.startMoving(Facing.UP);
      break;
    case 'KeyS':
      char.startMoving(Facing.DOWN);
      break;
    case 'KeyH':
      char.startMoving(Facing.RIGHT);
      break;
    case 'KeyA':
      char.startMoving(Facing.LEFT);
      break;
  }
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
  if (!char) {
    return;
  }

  const { code } = event;

  if(code === 'KeyD' || code === 'KeyS' || code === 'KeyH' || code === 'KeyA') {
    char.stopMoving();
  }
})

loader.add('spritesheet', './tileset.json')
      .add('character_spritesheet', './character32.json')
      .load(() => {
        

        for(let i = 0; i < 3200 / 32; i++) {
          for(let j = 0; j < 3200 / 32; j++) {
            const grassName = `grass${getRandomInt(5) + 1}`;
            const grass = new Sprite(TextureCache[grassName]);

            grass.x = i * 32;
            grass.y = j * 32;

            app.stage.addChild(grass);
          }
        }

        char = new CharacterContainer(400, 300);
        steppables.push(char);

        app.stage.addChild(char.sprite);

        app.ticker.add(delta => gameLoop(delta));
        
        app.start();
      })