const fs = require('fs');
const path = require('path');

// COMPONENTS

const srcProjectDist = path.join(__dirname, 'project-dist');
const srcHTML = path.join(__dirname, 'project-dist', 'index.html');
const srcTemplate = path.join(__dirname, 'template.html');
const srcComponents = path.join(__dirname, 'components');

fs.promises.mkdir(srcProjectDist, {recursive: true});
fs.readFile(srcTemplate, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    let template = data;
      fs.readdir(srcComponents, {withFileTypes: 'true'}, (err, files) => {
        if (err) {
          console.log(err);
        } else {
          files.forEach((file) => {
            let src = path.join(srcComponents, file.name);
            if (file.isFile() && path.extname(src) === '.html') {
              fs.readFile(src, 'utf8', (err, data) => {
                if (err) {
                  console.log(err);
                } else {
                  template = template.replace(`{{${file.name.slice(0, -5)}}}`, data);
                }
              })
            };
          });
          setTimeout(() => {
            fs.writeFile(srcHTML, template, (err) => {
              if (err) console.log(err);
            });
          }, 100);     
        }
      })
  }
});

// STYLES

const bundleSrc = path.join(__dirname, 'project-dist', 'style.css');
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

// ASSETS

const srcDir = path.join(__dirname, 'assets');
const srcCopyDir = path.join(__dirname, 'project-dist', 'assets');

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

