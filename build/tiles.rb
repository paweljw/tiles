require 'json'
require 'optparse'

opts = {
  p: ''
}

OptionParser.new do |parser|
  parser.on('-x', '--width=WIDTH', Integer) do |w|
    opts[:w] = w
  end

  parser.on('-y', '--height=HEIGHT', Integer) do |h|
    opts[:h] = h
  end

  parser.on('-s', '--side=SIDE', Integer) do |s|
    opts[:s] = s
  end

  parser.on('-p', '--prefix[=PREFIX]', String) do |p|
    opts[:p] = p
  end

  parser.on('-t', '--tileset=TILESET', String) do |t|
    opts[:t] = t
  end
end.parse!

COLS = opts[:w] / opts[:s]
ROWS = opts[:h] / opts[:s]

SIDE = opts[:s]

NAME = [opts[:p], 'r%<row>dc%<col>d.png'].reject(&:empty?).join('_')

SOURCE_SIZE = {
  w: SIDE,
  h: SIDE,
}.freeze

SPRITE_SOURCE_SIZE = {
  x: 0,
  y: 0
}.merge(SOURCE_SIZE).freeze

FRAME = {
  rotated: false,
  trimmed: false,
  spriteSourceSize: SPRITE_SOURCE_SIZE,
  sourceSize: SOURCE_SIZE,
}.freeze

frames = {}

COLS.times do |col|
  ROWS.times do |row|
    frames[format(NAME, row: row + 1, col: col + 1)] =
      FRAME.merge(
        frame: { x: col * SIDE, y: row * SIDE }
          .merge(SOURCE_SIZE))
  end
end

puts({
  frames: frames,
  meta: {
    image: opts[:t],
    size: {
      w: opts[:w],
      h: opts[:h],
    },
    scale: "1"
  }
}.to_json)
