import { extras } from 'pixi.js';
import Character from './textures/Character';
import Keyboard from './Keyboard';

export enum Facing {
  UP = 'cUp',
  DOWN = 'cDown',
  LEFT = 'cLeft',
  RIGHT = 'cRight',
}

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
    console.log(Character[facing]);
    this.sprite.textures = Character[facing];
  }

  private move (moveBy: number): void {
    switch(this.facing) {
      case Facing.UP:
        this.safelyMove(0, -moveBy);
        return;
      case Facing.DOWN:
        this.safelyMove(0, moveBy);
        return;
      case Facing.LEFT:
        this.safelyMove(-moveBy, 0);
        return;
      case Facing.RIGHT:
        this.safelyMove(moveBy, 0);
        return;
    }
  }

  private safelyMove(x: number, y: number): void {
    const newX = this.sprite.x + x;
    const newY = this.sprite.y + y;

    if (newX > 0 && newY > 0) {
      this.sprite.x = newX;
      this.sprite.y = newY;
    }
  }

  public step(delta: number): void {
    const moveBy = delta * this.movementSpeed;

    Keyboard.update();

    if (Keyboard.isMoving) {
      this.setFacing(Keyboard.facing);
      console.log(Keyboard.facing);

      if(!this.sprite.playing) {
        this.sprite.play();
      }

      this.move(moveBy);
    } else {
      if(this.sprite.playing) { this.sprite.stop(); }
    }
  }
}