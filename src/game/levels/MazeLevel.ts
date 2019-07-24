// Maze construction heavily based on https://github.com/semibran/maze
import { memoize } from 'lodash'

import { IPoint } from '../types'
import { TILE_WIDTH, TILE_HEIGHT } from '../constants/tilemap'
import BaseLevel from './BaseLevel'
import SimplexContainer from '../containers/SimplexContainer'
import FloorContainer from '../containers/FloorContainer'
import WallContainer from '../containers/WallContainer'

// TODO: Ensure mazes look less "algorithmic" (wall erosion)
// TODO: Create start and end points
class MazeLevel extends BaseLevel {
  public spawns = memoize(this.internalSpawns)
  public characterSpawn = memoize(this.internalCharacterSpawn)

  constructor(width: number, height: number) {
    super(width, height)

    this.maze = this.buildInternalMaze()
  }

  public textureAt(cell: IPoint): SimplexContainer {
    const x = cell.x * TILE_WIDTH
    const y = cell.y * TILE_HEIGHT

    return this.tileAt(cell) === 'floor' ? new FloorContainer(x, y) : new WallContainer(x, y)
  }

  private internalSpawns(): IPoint[] {
    const spawns = []

    for (let i = 200; i >= 0;) {
      const x = Math.floor(Math.random() * this.width)
      const y = Math.floor(Math.random() * this.height)

      const tileType = this.tileAt({ x, y })

      if (tileType === 'floor' && !spawns.find(({ x: lX, y: lY }) => lX === x && lY === y)) {
        spawns.push({ x, y })
        i--
      }
    }

    return spawns
  }

  private internalCharacterSpawn(): IPoint {
    while (true) {
      const x = Math.floor(Math.random() * this.width)
      const y = Math.floor(Math.random() * this.height)

      const tileType = this.tileAt({ x, y })

      if (tileType === 'floor') {
        return { x, y }
      }
    }
  }

  private buildInternalMaze() {
    return this.doubleUp(this.connect(this.generateMaze(this.cells().filter(cell => cell.x % 2 && cell.y % 2))))
  }

  private doubleUp(maze: string[]): string[] {
    const { width, height } = this
    const newMaze = new Array(width * height)

    for (let i = 0; i < (width / 2); i++) {
      for (let j = 0; j < (height / 2); j++) {
        const tile = maze[this.cheatingLocate({ x: i, y: j })]

        for (let ix = 0; ix < 2; ix++) {
          for (let iy = 0; iy < 2; iy++) {
            const x = i * 2 + ix
            const y = j * 2 + iy
            newMaze[this.locate({ x, y })] = tile
          }
        }
      }
    }

    return newMaze
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
    const cells = new Array((width / 2) * (height / 2))
    for (let y = 0; y < height / 2; y++) {
      for (let x = 0; x < width / 2; x++) {
        const cell = { x, y }
        cells[this.cheatingLocate(cell)] = cell
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
    const tiles = new Array((this.width / 2) * (this.height / 2)).fill('wall')

    Array.from(maze.entries()).forEach(([node, neighbors]) => {
      tiles[this.cheatingLocate(node)] = 'floor'
      for (const neighbor of neighbors) {
        const midpoint = {
          x: node.x + (neighbor.x - node.x) / 2,
          y: node.y + (neighbor.y - node.y) / 2
        }
        tiles[this.cheatingLocate(midpoint)] = 'floor'
      }
    })

    return tiles
  }

  private cheatingLocate(cell: IPoint) {
    return cell.y * (this.width / 2) + cell.x
  }

}

export default MazeLevel
