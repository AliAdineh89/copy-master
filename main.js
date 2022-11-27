// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const copy = require('@danieldietrich/copy');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow;
}


// (curr: copy.Totals, sum: copy.Totals) => void
async function copyWithProgress(src, dst, callback) {
  const curr = {
    directories: 0,
    files: 0,
    symlinks: 0,
    size: 0
  };
  try {
    const sum = await copy(src, dst, { dryRun: true });
    const interval = 100; // ms
    let update = Date.now();
    await copy(src, dst, {
      overwrite: false, afterEach: (source) => {
        if (source.stats.isDirectory()) {
          curr.directories += 1;
        } else if (source.stats.isFile()) {
          curr.files += 1;
          curr.size += source.stats.size;
        } else if (source.stats.isSymbolicLink()) {
          curr.symlinks += 1;
          curr.size += source.stats.size;
        }
        if (Date.now() - update >= interval) {
          update = Date.now();
          callback(curr, sum);
        }
      }
    });
    callback(sum, sum);

  } catch (error) {
    console.log("==>>", error)
  }
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow()

  ipcMain.on("get-directory-path", (event, data) => {
    const folderDire = dialog.showOpenDialogSync(mainWindow, {
      properties: ['openFile', 'openDirectory']
    })

    const path = (folderDire || [])[0] || ''
    let response = {}
    if (data.selectSourcePath) response.srcPath = path
    if (data.selectDestinationPath) response.desPath = path

    mainWindow.webContents.send('set-directory-path', response)
  })


  ipcMain.on("start-deep-copy", async (event, data) => {
    console.log(data)
    await copyWithProgress(data.srcPath, data.desPath, (curr, sum) => {
      const progress = Math.min(100, Math.floor(curr.size / sum.size * 100));

      mainWindow.webContents.send('end-deep-copy', {
        disableButton: false, message:
          `${Number.parseFloat(progress).toFixed(1)}%`
        , error: null
      })

      if (progress === 100) {
        mainWindow.webContents.send('hide-progress', {})
      }
    });
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.