require 'json'

COLS = 17
ROWS = 8

H_SIDE = 64
W_SIDE = 32

SOURCE_SIZE = {
  w: W_SIDE,
  h: H_SIDE,
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
    frames["c_r#{row + 1}c#{col + 1}.png"] =
      FRAME.merge(
        frame: { x: col * W_SIDE, y: row * H_SIDE }
          .merge(SOURCE_SIZE))
  end
end

puts({
  frames: frames,
  meta: {
    image: "character32.png",
    size: {
      w: 544,
      h: 512,
    },
    scale: "1"
  }
}.to_json)
