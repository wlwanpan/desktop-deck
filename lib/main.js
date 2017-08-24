const {app, ipcMain, globalShortcut, BrowserWindow} = require('electron');

let mainWindow; // keep the browser window from being garbage collected
function createWindow () {
  // Create the browser window.
  // more options can be found at http://electron.atom.io/docs/all/#browserwindow
  mainWindow = new BrowserWindow({
    title: "FFA DECK PLATFORM",
    width: 1200,
    height: 800,
    center: true,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.openDevTools({mode:'bottom'});

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
  createWindow();
  }
});
