import fs from 'fs';

export default function addDLHistory(data: any) {
  if(!fs.existsSync('./history.json')) fs.writeFileSync('./history.json', '[]');

  const dlHistory = JSON.parse(fs.readFileSync('./history.json').toString());
  dlHistory.push(data);

  fs.writeFileSync('./history.json', JSON.stringify(dlHistory));
}