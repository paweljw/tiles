import { extras } from 'pixi.js';
import TextureCache from './TextureCache';

export enum Facing {
  UP = 'cUp',
  DOWN = 'cDown',
  LEFT = 'cLeft',
  RIGHT = 'cRight',
}

export class CharacterContainer {
  public sprite: PIXI.extras.AnimatedSprite;
  private facing: Facing = Facing.DOWN;
  private moving: boolean = false;
  private movementSpeed: number = 1.6;

  constructor(x: number, y: number) {
    this.sprite = new extras.AnimatedSprite(TextureCache[this.facing]);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.animationSpeed = 0.1;
    this.stopMoving();
  }

  public startMoving(facing: Facing): void {
    if (this.moving && this.facing === facing) return;

    this.sprite.textures = TextureCache[facing];
    this.sprite.play();
    this.facing = facing;
    this.moving = true;
  }

  public stopMoving (): void {
    this.sprite.stop();
    this.moving = false;
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
    if(!this.moving) return;

    const moveBy = delta * this.movementSpeed;

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
}