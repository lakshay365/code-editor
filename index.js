const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')

let win = null

const URL = 'file://' + path.join(__dirname, 'renderer/index.html')

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icons/code.png')
  })

  win.loadURL(URL)

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('browser-window-created', function(e, window) {
  window.setMenu(null)
})
