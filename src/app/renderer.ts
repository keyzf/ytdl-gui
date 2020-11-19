const ipcRenderer = require('electron').ipcRenderer;

const btnclick = document.getElementById('btnDownload');
btnclick.addEventListener('click', function () {
  const inputEl: any = document.getElementById('inputUrl');
  const elDownloadList = document.getElementById('dlList');
  const currentIndex = elDownloadList.childNodes.length;

  ipcRenderer.send("YTDL:DOWNLOAD_START", { url: inputEl.value, current: currentIndex });
});

ipcRenderer.on('YTDL:DOWNLOAD_PROGRESS', (event, args) => {
  // const elDownloadList = document.getElementById('dlList');
});

ipcRenderer.on('YTDL:DOWNLOAD_END', (event, args) => {
  window.location.reload();
});

window.onhashchange = (event: HashChangeEvent) => {
  switch (new URL(event.newURL).hash) {
    case '#currentDL':
      onPageCurrentDL();
      handleActiveNav(0);
      break;
    case '#dlHistory':
      onPageDLHistory();
      handleActiveNav(1);
      break;
    case '#settings':
      onPageSettings();
      handleActiveNav(2);
      break;
    default:
      onPageCurrentDL();
      handleActiveNav(0);
  }
}

function handleActiveNav(index: number) {
  const nav = document.getElementById('nav');

  for(let i=0; i<nav.childElementCount; i++) {
    const child = nav.children.item(i);
    if(i===index) child.classList.add('nav-current');
    else child.classList.remove('nav-current');
  }
}

function onPageDLHistory() {
  ipcRenderer.send('PAGE:DLHISTORY:CHANGE');

  document.getElementById('currentDl').classList.add('hide');
  document.getElementById('dlHistory').classList.remove('hide');
  document.getElementById('settings').classList.add('hide');
}

function onPageCurrentDL() {

  document.getElementById('currentDl').classList.remove('hide');
  document.getElementById('dlHistory').classList.add('hide');
  document.getElementById('settings').classList.add('hide');
}

function onPageSettings() {

  document.getElementById('currentDl').classList.add('hide');
  document.getElementById('dlHistory').classList.add('hide');
  document.getElementById('settings').classList.remove('hide');
}

ipcRenderer.on('PAGE:DLHISTORY:LOAD', (event, dlHistory) => {
  const elDownloadList = document.getElementById('dlHistoryList');
  while(elDownloadList.childElementCount > 0) elDownloadList.removeChild(elDownloadList.lastChild);

  dlHistory.forEach((data: any, i: number) => {
    const html = `<td>${(i + 1)}</td><td>${data.filename}</td><td>${data.date}</td><td></td>`;
    const tr = document.createElement('tr');

    tr.innerHTML = html;
    elDownloadList.appendChild(tr);
  })
});
