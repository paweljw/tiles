require 'json'

COLS = 64
ROWS = 48

SIDE = 32

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
    frames["r#{row + 1}c#{col + 1}.png"] =
      FRAME.merge(
        frame: { x: col * SIDE, y: row * SIDE }
          .merge(SOURCE_SIZE))
  end
end

puts({
  frames: frames,
  meta: {
    image: "tileset.png",
    size: {
      w: 2048,
      h: 1536,
    },
    scale: "1"
  }
}.to_json)
