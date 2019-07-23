// Maze construction heavily based on https://github.com/semibran/maze

import { IPoint } from './types'

export const TILE_WIDTH = 36
export const TILE_HEIGHT = 36

// TODO: Move maze generation out of Level
// TODO: Ensure mazes look less "algorithmic" (wall erosion)
// TODO: Create start and end points
class Level {
  public get pixelWidth(): number {
    return this.width * 2 * TILE_WIDTH
  }

  public get pixelHeight(): number {
    return this.height * 2 * TILE_HEIGHT
  }
  public width: number
  public height: number
  public maze: string[]

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    this.maze = this.buildInternalMaze()
  }

  public tileAt(cell: IPoint) {
    return this.maze[this.locate(cell)]
  }

  public locate(cell: IPoint) {
    return cell.y * this.width + cell.x
  }

  private buildInternalMaze() {
    const nodes = this.cells().filter(cell => cell.x % 2 && cell.y % 2)
    const maze = this.generateMaze(nodes)
    return this.connect(maze)
  }

  private generateMaze(nodes: IPoint[]) {
    let node = this.choose(nodes)
    const stack = [node]
    const maze: Map<IPoint, IPoint[]> = new Map()

    for (const noder of nodes) {
      maze.set(noder, [])
    }

    while (node) {
      const neighbors = nodes.filter(
        other => !maze.get(other).length && this.adjacent(node, other)
      )
      if (neighbors.length) {
        const neighbor = this.choose(neighbors)
        maze.get(node).push(neighbor)
        maze.get(neighbor).push(node)
        stack.unshift(neighbor)
        node = neighbor
      } else {
        stack.shift()
        node = stack[0]
      }
    }
    return maze
  }

  private cells(): IPoint[] {
    const { width, height } = this
    const cells = new Array(width * height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = { x, y }
        cells[this.locate(cell)] = cell
      }
    }
    return cells
  }

  private adjacent(a: IPoint, b: IPoint) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y) === 2
  }

  private choose(array: IPoint[]): IPoint {
    return array[Math.floor(Math.random() * array.length)]
  }

  private connect(maze: Map<IPoint, IPoint[]>) {
    const tiles = new Array(this.width * this.height).fill('wall')

    Array.from(maze.entries()).forEach(([node, neighbors]) => {
      tiles[this.locate(node)] = 'floor'
      for (const neighbor of neighbors) {
        const midpoint = {
          x: node.x + (neighbor.x - node.x) / 2,
          y: node.y + (neighbor.y - node.y) / 2
        }
        tiles[this.locate(midpoint)] = 'floor'
      }
    })

    return tiles
  }
}

export default Level
