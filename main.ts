const { format } = require('url')

const { BrowserWindow, app } = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

app.on('ready', async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    // fullscreen: !isDev // TODO: Move to config file
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (isDev) { mainWindow.webContents.openDevTools() }
  })

  const devPath = 'http://localhost:1124'
  const prodPath = format({
    pathname: resolve('.parcel/renderer/index.html'),
    protocol: 'file:',
    slashes: true
  })
  const url = isDev ? devPath : prodPath

  mainWindow.setMenu(null)
  mainWindow.loadURL(url)
})

app.on('window-all-closed', app.quit)
