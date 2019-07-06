import configPath from './configPath'
import writeConfig from './writeConfig'
import initialConfig from './initialConfig'

// @ts-ignore
const fs = (window && window.require) ? window.require('fs') : require('fs')

export default () => {
  const confPath = configPath()

  if (fs.existsSync(confPath)) {
    return JSON.parse(fs.readFileSync(confPath))
  } else {
    writeConfig(initialConfig)
    return initialConfig
  }
}
