import electronConfigPath from './electronConfigPath'
import initialConfig from './initialConfig'

// @ts-ignore
const fs = require('fs')

export default () => {
  const confPath = electronConfigPath()

  if (fs.existsSync(confPath)) {
    return JSON.parse(fs.readFileSync(confPath))
  } else {
    fs.writeFileSync(confPath, JSON.stringify(initialConfig), { flag: 'w+' })
    return initialConfig
  }
}
