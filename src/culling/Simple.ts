// This code is heavily based on https://github.com/davidfig/pixi-cull

export type AABB = {
  x: number,
  y: number,
  width: number,
  height: number
}

export type ObjectData = {
  AABB: AABB
}


class Simple {
  public dirty: Set<PIXI.DisplayObject> = new Set()
  public objects: Map<PIXI.DisplayObject, ObjectData> = new Map() // TODO: Specialize object

  public addObject(obj: PIXI.DisplayObject, isStatic: boolean = true): void {
    this.updateObjectData(obj, {
      AABB: this.calculateAABB(obj),
    })
    if(!isStatic) {
      this.markDirty(obj)
    }
  }

  public addObjects(objs: PIXI.DisplayObject[], isStatic: boolean = true): void {
    objs.forEach(obj => this.addObject(obj, isStatic))
  }

  public addChildrenOf(container: PIXI.Container, isStatic: boolean = true) {
    this.addObjects(container.children, isStatic)
  }

  public markDirty(obj: PIXI.DisplayObject): void {
    this.dirty.add(obj)
  }

  public cull(bounds: any): void {
    this.updateDirtyObjects();

    this.objects.forEach(({ AABB: box }, obj) => {
      const visible =
        box.x + box.width > bounds.x && box.x < bounds.x + bounds.width &&
        box.y + box.height > bounds.y && box.y < bounds.y + bounds.height

      obj.visible = visible
      obj.renderable = visible
    })
  }

  private markClean(obj: PIXI.DisplayObject): void {
    this.dirty.delete(obj)
  }

  private updateObjectCoords(obj: PIXI.DisplayObject): void {
    this.updateObjectData(obj, {
      AABB: this.calculateAABB(obj)
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

  private calculateAABB(obj: PIXI.DisplayObject): AABB {
    const bounds = obj.getLocalBounds()
    return {
      x: obj.x + bounds.x * obj.scale.x,
      y: obj.y + bounds.y * obj.scale.y,
      width: bounds.width * obj.scale.x,
      height: bounds.height * obj.scale.y
    }
  }
}

export default Simple
