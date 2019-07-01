import Collider from './Collider'

export interface ISteppableInterface {
  step(delta: number, collider: Collider): PIXI.DisplayObject[]
}

export interface ISteppableSprite extends ISteppableInterface {
  sprite: PIXI.DisplayObject
  receiveDamage(damage: number): void
}

export enum Facing {
  UP = 'cUp',
  DOWN = 'cDown',
  LEFT = 'cLeft',
  RIGHT = 'cRight'
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP_LEFT = 'UP_LEFT',
  UP_RIGHT = 'UP_RIGHT',
  DOWN_LEFT = 'DOWN_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT'
}

export interface IAABB {
  x: number
  y: number
  width: number
  height: number
}

export interface IObjectData {
  AABB: IAABB
  collidable: boolean
}

export interface IPoint {
  x: number
  y: number
}

export type ObjectDataMap = Map<PIXI.DisplayObject, IObjectData>

export type ObjectSet = Set<PIXI.DisplayObject>

export interface ICollidableSource {
  objects: ObjectDataMap
  collidable: ObjectSet
}
