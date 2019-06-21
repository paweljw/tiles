import { ObjectDataMap, ObjectSet } from "../types";
import calculateAABB from "../helpers/calculateAABB";

// This code is heavily based on https://github.com/davidfig/pixi-cull

class Simple {
  public dirty: ObjectSet = new Set()
  public collidable: ObjectSet = new Set()
  public objects: ObjectDataMap = new Map();

  public addObject(obj: PIXI.DisplayObject, isStatic: boolean = true, collidable: boolean = false): void {
    this.updateObjectData(obj, {
      AABB: calculateAABB(obj),
      collidable
    })
    if(!isStatic) {
      this.markDirty(obj)
    }
  }

  public addObjects(objs: PIXI.DisplayObject[], isStatic: boolean = true, collidable: boolean = false): void {
    objs.forEach(obj => this.addObject(obj, isStatic, collidable))
  }

  public addChildrenOf(container: PIXI.Container, isStatic: boolean = true, collidable: boolean = false) {
    this.addObjects(container.children, isStatic, collidable)
  }

  public markDirty(obj: PIXI.DisplayObject): void {
    this.dirty.add(obj)
  }

  public cull(bounds: any): void {
    this.updateDirtyObjects();

    this.objects.forEach(({ AABB: box, collidable }, obj) => {
      const visible =
        box.x + box.width > bounds.x && box.x < bounds.x + bounds.width &&
        box.y + box.height > bounds.y && box.y < bounds.y + bounds.height

      obj.visible = visible
      obj.renderable = visible

      if(collidable) {
        if(visible) {
          this.collidable.add(obj);
        } else {
          this.collidable.delete(obj);
        }
      }
    })
  }

  private markClean(obj: PIXI.DisplayObject): void {
    this.dirty.delete(obj)
  }

  private updateObjectCoords(obj: PIXI.DisplayObject): void {
    this.updateObjectData(obj, {
      AABB: calculateAABB(obj)
    })
  }

  private updateDirtyObjects(): void {
    this.dirty.forEach(obj => {
      this.updateObjectCoords(obj)
      this.markClean(obj)
    })
  }

  private updateObjectData(obj: PIXI.DisplayObject, data: any) {
    const currentData = this.objects.has(obj) ? this.objects.get(obj) : {}

    this.objects.set(obj, {
      ...currentData,
      ...data
    })
  }
}

export default Simple
