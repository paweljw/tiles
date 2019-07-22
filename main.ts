import getConfig from './src/helpers/electronGetConfig'

const { format } = require('url')

const { BrowserWindow, app } = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

const config = getConfig()

app.on('ready', async () => {
  const mainWindow = new BrowserWindow({
    width: config.resw,
    height: config.resh,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    fullscreen: config.fullscreen
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools()
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
