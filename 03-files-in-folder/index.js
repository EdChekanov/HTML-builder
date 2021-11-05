const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'secret-folder');

fs.readdir(src, {withFileTypes: 'true'}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    let result = [];
    files.forEach((file) => {
      if (file.isFile()) result.push(file.name);
    });
    for (let i = 0; i < result.length; i++) {
      let srcToFile = path.join(src, result[i]);
      fs.stat(srcToFile, (err, stats) => {
        let size = stats.size;
        let ext = path.extname(srcToFile);
        let name = path.basename(srcToFile, ext);
        console.log(`${name} - ${ext.slice(1)} - ${size / 1000}kb`)
      })
    }
  }
});
