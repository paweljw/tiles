import {
  Application,
  loader,
  Sprite,
  extras as PixiExtras
} from 'pixi.js';

import TextureCache from './src/TextureCache';
import getRandomInt from './src/helpers/getRandomInt';

const { AnimatedSprite } = PixiExtras;

const app = new Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: window.devicePixelRatio || 1
});

app.renderer.backgroundColor = 0x666666;

document.getElementById('app').appendChild(app.view);

let char: PIXI.extras.AnimatedSprite;

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

        char = new AnimatedSprite(TextureCache.cDown);

        char.x = 400;
        char.y = 300;
        char.animationSpeed = 0.1;

        char.play();

        app.stage.addChild(char);
        
        app.start();
      })