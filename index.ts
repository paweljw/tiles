import {
  Application,
  loader,
  Sprite,
  extras as PixiExtras
} from 'pixi.js';

import TextureCache from './src/textures/TextureCache';
import getRandomInt from './src/helpers/getRandomInt';

import { CharacterContainer, Facing } from './src/CharacterContainer'
import { SteppableInterface } from './src/index'
import Game from './src/Game';

const game = new Game(document.getElementById('app'));

// window.addEventListener('keydown', (event: KeyboardEvent) => {
//   if (!char) {
//     return;
//   }

//   const { code } = event;

//   switch(code) {
//     case 'KeyD':
//       char.startMoving(Facing.UP);
//       break;
//     case 'KeyS':
//       char.startMoving(Facing.DOWN);
//       break;
//     case 'KeyH':
//       char.startMoving(Facing.RIGHT);
//       break;
//     case 'KeyA':
//       char.startMoving(Facing.LEFT);
//       break;
//   }
// })

// window.addEventListener('keyup', (event: KeyboardEvent) => {
//   if (!char) {
//     return;
//   }

//   const { code } = event;

//   if(code === 'KeyD' || code === 'KeyS' || code === 'KeyH' || code === 'KeyA') {
//     char.stopMoving();
//   }
// })
