const opts = require('yargs')
  .option('w', {
    alias: 'width',
    demandOption: true,
    type: 'number'
  })
  .option('h', {
    alias: 'height',
    demandOption: true,
    type: 'number'
  })
  .option('s', {
    alias: 'side_width',
    demandOption: true,
    type: 'number'
  })
  .option('q', {
    alias: 'side_height',
    demandOption: true,
    type: 'number'
  })
  .option('p', {
    alias: 'prefix',
    demandOption: false,
    type: 'string',
    default: ''
  })
  .option('t', {
    alias: 'tileset',
    demandOption: true,
    type: 'string'
  }).argv


const COLS = opts.w / opts.s
const ROWS = opts.h / opts.q
const SIDE_WIDTH = opts.s
const SIDE_HEIGHT = opts.q
const NAME = [opts.p, 'r<row>c<col>.png'].filter(str => str && str.length > 0).join('_')

const SOURCE_SIZE = { w: SIDE_WIDTH, h: SIDE_HEIGHT }
const SPRITE_SOURCE_SIZE = { x: 0, y: 0, ...SOURCE_SIZE }
const FRAME = {
  rotated: false,
  trimmed: false,
  spriteSourceSize: SPRITE_SOURCE_SIZE,
  sourceSize: SOURCE_SIZE
}

const frames = {}

for (let col = 1; col <= COLS; col++) {
  for (let row = 1; row <= ROWS; row++) {
    const localName = NAME.replace('<row>', row.toString()).replace('<col>', col.toString())
    frames[localName] = {
      ...FRAME,
      frame: {
        x: (col - 1) * SIDE_WIDTH,
        y: (row - 1) * SIDE_HEIGHT,
        ...SOURCE_SIZE
      }
    }
  }
}

console.log(JSON.stringify({
  frames,
  meta: {
    image: opts.t,
    size: {
      w: opts.w,
      h: opts.h
    },
    scale: "1"
  }
}))
