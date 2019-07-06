// @ts-ignore
const { remote } = window.require('electron')
// @ts-ignore
const path = window.require('path')

export default () => {
  return path.join(remote.app.getPath('userData'), 'config.json')
}
