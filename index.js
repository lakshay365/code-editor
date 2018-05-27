const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

var mainWindow = null;
const URL = 'file://' + path.join(__dirname,'renderer/index.html')

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        minwidth: 612,
        minheight: 384,
        icon: path.join(__dirname, 'assets/icons/code.png')
    });

    mainWindow.loadURL(URL);
});

app.on('browser-window-created', function(e, window){
    window.setMenu(null);
});
