export interface SteppableInterface {
  step(delta: number): void;
}

export enum Facing {
  UP = 'cUp',
  DOWN = 'cDown',
  LEFT = 'cLeft',
  RIGHT = 'cRight',
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP_LEFT = 'UP_LEFT',
  UP_RIGHT = 'UP_RIGHT',
  DOWN_LEFT = 'DOWN_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT',
}

