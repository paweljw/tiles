import { extras } from 'pixi.js';
import Character from './textures/Character';
import Keyboard from './Keyboard';
import { Facing, Direction } from './types';
import movementMatrix from './constants/movementMatrix';


export class CharacterContainer {
  public sprite: PIXI.extras.AnimatedSprite;
  private facing: Facing = Facing.DOWN;
  private movementSpeed: number = 2.4;

  constructor(x: number, y: number) {
    this.sprite = new extras.AnimatedSprite(Character[this.facing]);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.animationSpeed = 0.05 * this.movementSpeed;
    this.sprite.anchor.set(0.5);
    this.setFacing(this.facing);
    this.sprite.stop();
  }

  private setFacing(facing: Facing): void {
    if(this.facing === facing) return;

    this.facing = facing;
    this.sprite.textures = Character[facing];
  }

  private move (moveBy: number, direction: Direction): void {
    const [xMod, yMod] = movementMatrix[direction]

    this.safelyMove(xMod * moveBy, yMod * moveBy)
  }

  private safelyMove(x: number, y: number): void {
    const newX = this.sprite.x + x;
    const newY = this.sprite.y + y;

    if (newX > 0 && newY > 0) {
      this.sprite.x = newX;
      this.sprite.y = newY;
    }
  }

  public step(delta: number): PIXI.DisplayObject[] {
    if (Keyboard.debugSpeed) {
      this.movementSpeed = 6;
    } else {
      this.movementSpeed = 3;
    }

    const moveBy = delta * this.movementSpeed;

    Keyboard.update();

    if (Keyboard.isMoving) {
      this.setFacing(Keyboard.facing);

      if(!this.sprite.playing) {
        this.sprite.play();
      }

      this.move(moveBy, Keyboard.direction);
      return [this.sprite]
    } else {
      if(this.sprite.playing) { this.sprite.gotoAndStop(1); } // Very specific to character tileset used. Usually 0
      return []
    }
  }
}
