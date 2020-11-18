const ipcRenderer = require('electron').ipcRenderer;

const btnclick = document.getElementById('btnDownload');
btnclick.addEventListener('click', function () {
  const inputEl: any = document.getElementById('inputUrl');
  const elDownloadList = document.getElementById('dlList');
  const currentIndex = elDownloadList.childNodes.length;

  ipcRenderer.send("YTDL:DOWNLOAD_START", { url: inputEl.value, current: currentIndex });
});

ipcRenderer.on('YTDL:DOWNLOAD_PROGRESS', (event, args) => {
  const elDownloadList = document.getElementById('dlList');
});

ipcRenderer.on('YTDL:DOWNLOAD_END', (event, args) => {
  window.location.reload();
});
