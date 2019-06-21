// Maze construction heavily based on https://github.com/semibran/maze

import { Point } from "./types";

const TILE_WIDTH = 32
const TILE_HEIGHT = 32


// TODO: Move maze generation out of Level
// TODO: Ensure mazes look less "algorithmic" (wall erosion)
// TODO: Create start and end points
class Level {
  public width: number
  public height: number
  public maze: Array<String>

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    this.maze = this.buildInternalMaze()
  }

  public get pixelWidth (): number {
    return this.width * 2 * TILE_WIDTH;
  }

  public get pixelHeight (): number {
    return this.height * 2 * TILE_HEIGHT;
  }

  private buildInternalMaze() {
    const nodes = this.cells().filter(cell => cell.x % 2 && cell.y % 2)
    const maze = this.generateMaze(nodes)
    return this.connect(maze)
  }

  private generateMaze(nodes: Array<Point>) {
    let node = this.choose(nodes)
    const stack = [node]
    const maze: Map<Point, Array<Point>> = new Map()

    for (var noder of nodes) {
      maze.set(noder, [])
    }

    while (node) {
      var neighbors = nodes.filter(other => !maze.get(other).length && this.adjacent(node, other))
      if (neighbors.length) {
        var neighbor = this.choose(neighbors)
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

  private cells(): Array<Point> {
    var { width, height } = this
    var cells = new Array(width * height)
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var cell = { x, y }
        cells[this.locate(cell)] = cell
      }
    }
    return cells
  }

  public locate(cell: Point) {
    return cell.y * this.width + cell.x
  }

  private adjacent(a: Point, b: Point) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y) === 2
  }

  private choose(array: Array<Point>): Point {
    return array[Math.floor(Math.random() * array.length)]
  }

  private connect(maze: Map<Point, Array<Point>>) {
    const tiles = new Array(this.width * this.height).fill('wall');

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

    return tiles;
  }
}

export default Level
