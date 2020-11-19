import fs from 'fs';
import ytdl from 'ytdl-core';
import * as path from "path";
import { format } from "date-fns";
import { app, BrowserWindow, ipcMain } from "electron";
import addDLHistory from './helper/add-dl-history';

ipcMain.on("YTDL:DOWNLOAD_START", function (event, arg) {
  const currentIndex = arg.current;
  
  const _stream = ytdl(arg.url, { filter: f => f.container === 'mp4' });
  _stream.on('info', (info) => {
    addDLHistory({ filename: `${info.videoDetails.title}.mp4`, date: Date.now() });
    _stream.pipe(fs.createWriteStream(`./downloads/${info.videoDetails.title}.mp4`));
  })
  _stream.on('end', () => {
    event.sender.send("YTDL:DOWNLOAD_END");
  });
  _stream.on('error', (err) => {
    event.sender.send("YTDL:DOWNLOAD_ERROR");
  });
  _stream.on('progress', (length, downloaded, total) => {
    event.sender.send("YTDL:DOWNLOAD_PROGRESS", Math.round(downloaded / total * 100));
  });
});

ipcMain.on("PAGE:DLHISTORY:CHANGE", function (event, arg) {
  if(!fs.existsSync('./history.json')) return;
  
  const dlHistory = JSON.parse(fs.readFileSync('./history.json').toString());
  const data = dlHistory.map((val: any, i: any) => ({ filename: val.filename, date: format(val.date, 'HH:mm:ss dd/MM/yyyy')}));
  
  event.sender.send("PAGE:DLHISTORY:LOAD", data);
});

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
