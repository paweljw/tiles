import {
  Application,
  Texture,
  loader,
  Sprite
} from 'pixi.js';

const app = new Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: window.devicePixelRatio || 1
});

app.renderer.backgroundColor = 0x666666;

document.getElementById('app').appendChild(app.view);

loader.add('spritesheet', './tileset.json')
      .load(() => {
        const texture = Texture.from('r13c64.png');
        const grass = new Sprite(texture);

        grass.x = 400;
        grass.y = 300;

        app.stage.addChild(grass);

        app.start();
      })