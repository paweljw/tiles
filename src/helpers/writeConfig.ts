import configPath from './configPath'

// @ts-ignore
const fs = (window && window.require) ? window.require('fs') : require('fs')

export default (config: object) => {
  const confPath = configPath()

  fs.writeFileSync(confPath, JSON.stringify(config), { flag: 'w+' })
}
