const fs = require('fs');

let data = fs.readFileSync('./words.txt', 'utf-8');
data = data
  .split(/\r?\n/)
  .map(word => `'${word}'`)
  .join(',');

data = `const words = [${data}]`;

fs.writeFileSync('./words-final.txt');
