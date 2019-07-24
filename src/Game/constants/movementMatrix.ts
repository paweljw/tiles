// const COS_QT_PI = 0.70710678118 // cos(1/4 * PI)
const COS_QT_PI = 1

export default {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP_RIGHT: [COS_QT_PI, -COS_QT_PI],
  UP_LEFT: [-COS_QT_PI, -COS_QT_PI],
  DOWN_RIGHT: [COS_QT_PI, COS_QT_PI],
  DOWN_LEFT: [-COS_QT_PI, COS_QT_PI]
}
