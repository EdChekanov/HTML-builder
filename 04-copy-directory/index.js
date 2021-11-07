const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const srcCopyDir = path.join(__dirname, 'files-copy');

fs.promises.mkdir(srcCopyDir, {recursive: true});

function copy(srcCopyFrom, srcCopyTo) {
  fs.readdir(srcCopyFrom, {withFileTypes: 'true'}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
        files.forEach((file) => {
          if (file.isFile()) {
            let src = path.join(srcCopyFrom, file.name);
            let way = path.join(srcCopyTo, file.name);
            fs.copyFile(src, way, (err) => {
                if (err) console.log(err);
            })
          } else {
            let srcToDir = path.join(srcCopyTo, file.name);
            let srcFromDir = path.join(srcCopyFrom, file.name);
            fs.promises.mkdir(srcToDir, {recursive: true});
            copy(srcFromDir, srcToDir);
          }
          });
    }
}
);
};

function remove(srcCopyFrom, srcCopyTo) {
  fs.readdir(srcCopyTo, {withFileTypes: 'true'}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
        files.forEach((file) => {
          if (file.isFile()) {
            let src = path.join(srcCopyFrom, file.name);
            let srcCopy = path.join(srcCopyTo, file.name);
            fs.access(src, (err) => {
                if (err) {
                    fs.rm(srcCopy, {recursive: true }, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
          } else {
            let srcToDir = path.join(srcCopyTo, file.name);
            let srcFromDir = path.join(srcCopyFrom, file.name);
            fs.access(srcFromDir, (err) => {
              if (err) {
                fs.rm(srcToDir, {recursive: true }, (err) => {
                    if (err) {
                      recursiveRemoveDir(srcToDir);
                    };
                });
              } else {
                remove(srcFromDir, srcToDir);
              }
            })
          }
        });
    }
})
};

function recursiveRemoveDir(srcRemoveDir) {
  fs.readdir(srcRemoveDir, {withFileTypes: 'true'}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        let src = path.join(srcRemoveDir, file.name);
        fs.rm(src, {recursive: true}, (err) => {
          if (err) recursiveRemoveDir(src);
        })
      })
    }
  })
}

setTimeout(() => {
  copy(srcDir, srcCopyDir);
  remove(srcDir, srcCopyDir);
}, 100);
