const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const src = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(src, 'utf-8');
readableStream.on('data', chunk => stdout.write(chunk));