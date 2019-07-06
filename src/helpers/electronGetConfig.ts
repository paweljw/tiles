import electronConfigPath from './electronConfigPath'

// @ts-ignore
const fs = require('fs')

const INITIAL_CONFIG = {
  version: 1,
  fullscreen: false,
  resw: 1280,
  resh: 720,
}

export default () => {
  const confPath = electronConfigPath()

  if (fs.existsSync(confPath)) {
    return JSON.parse(fs.readFileSync(confPath))
  } else {
    fs.writeFileSync(confPath, JSON.stringify(INITIAL_CONFIG), { flag: 'w+' })
    return INITIAL_CONFIG
  }
}
