// @ts-ignore
const { app } = require('electron')
// @ts-ignore
const path = require('path')

export default () => {
  return path.join(app.getPath('userData'), 'config.json')
}
