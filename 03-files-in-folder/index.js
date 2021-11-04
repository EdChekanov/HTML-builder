const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'secret-folder');

fs.readdir(src, {withFileTypes: 'true'}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    let result = [];
    files.forEach((file) => {
      if (file.isFile()) result.push(file);
    });
    console.log(result);
  }
});
