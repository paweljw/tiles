import configPath from './configPath'
import writeConfig from './writeConfig';

// @ts-ignore
const fs = (window && window.require) ? window.require('fs') : require('fs')

const INITIAL_CONFIG = {
  version: 1,
  fullscreen: false,
  resw: 1280,
  resh: 720,
}

export default () => {
  const confPath = configPath()

  if (fs.existsSync(confPath)) {
    return JSON.parse(fs.readFileSync(confPath))
  } else {
    writeConfig(INITIAL_CONFIG)
    return INITIAL_CONFIG
  }
}
