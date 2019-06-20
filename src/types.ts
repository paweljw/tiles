import Collider from "./Collider";

export interface SteppableInterface {
  step(delta: number, collider: Collider): PIXI.DisplayObject[];
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

export type AABB = {
  x: number,
  y: number,
  width: number,
  height: number
}

export type ObjectData = {
  AABB: AABB,
  collidable: boolean
}

export type Point = {
  x: number,
  y: number
}

export type ObjectDataMap = Map<PIXI.DisplayObject, ObjectData>;

export type ObjectSet = Set<PIXI.DisplayObject>;

export interface CollidableSource {
  objects: ObjectDataMap,
  collidable: ObjectSet
}
