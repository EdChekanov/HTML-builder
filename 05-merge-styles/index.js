const fs = require('fs');
const path = require('path');

const bundleSrc = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesSrc = path.join(__dirname, 'styles');

fs.writeFile(bundleSrc, '', (err) => {
  if (err) console.log(err);
})

fs.readdir(stylesSrc, {withFileTypes: 'true'}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      let src = path.join(stylesSrc, file.name);
      if (file.isFile() && path.extname(src) === '.css') {
        fs.readFile(src, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            fs.appendFile(bundleSrc, data.toString(), (err) => {
              if (err) console.log(err);
            })
          }
        })
      };
    })
  }
})