const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const srcCopyDir = path.join(__dirname, 'files-copy');

fs.promises.mkdir(srcCopyDir, { recursive: true});
fs.readdir(srcDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
        files.forEach((file) => {
            let src = path.join(srcDir, file);
            let way = path.join(srcCopyDir, file);
            fs.copyFile(src, way, (err) => {
                if (err) console.log(err);
            })
          });
    }
}
);