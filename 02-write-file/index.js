const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const src = path.join(__dirname, 'result.txt');
const writeStream = fs.createWriteStream(src, 'utf-8');
const rl = readline.createInterface({
  input: stdin,
  output: stdout
});

stdout.write('Hello my friend! Please enter your text here!\n');

process.on('exit', () => stdout.write('Good bye. See your later.\n'));
rl.on('line', input => {
  const inputString = input.toString();
  if (inputString.trim().toLowerCase() === 'exit') {
    rl.close();
    process.exit();
  } else {
    writeStream.write(inputString + '\n');
  }
});
