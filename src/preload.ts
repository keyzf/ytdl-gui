import * as fs from 'fs';
import { format } from 'date-fns';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  if(!fs.existsSync('./history.json')) return;
  
  const existingDLHistory = JSON.parse(fs.readFileSync('./history.json').toString());
  const elDownloadList = document.getElementById('dlHistoryList');

  existingDLHistory.forEach((data: any, i: number) => {
    const html = `<td>${(i+1)}</td><td>${data.filename}</td><td>${format(data.date, 'HH:mm:ss dd/MM/yyyy')}</td><td></td>`;
    const tr = document.createElement('tr');

    tr.innerHTML = html;
    elDownloadList.appendChild(tr);
  });
});
