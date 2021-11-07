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

function copy(srcCopyFrom) {
  fs.readdir(srcCopyFrom, {withFileTypes: 'true'}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
        files.forEach((file) => {
          if (file.isFile()) {
            let src = path.join(srcCopyFrom, file);
            let way = path.join(srcCopyDir, file);
            fs.copyFile(src, way, (err) => {
                if (err) console.log(err);
            })
          } else {
            let srcToDir = path.join(srcCopyDir, file.name);
            fs.promises.mkdir(srcToDir, {recursive: true});
            copy(srcToDir);
          }
          });
    }
}
);
};

function remove(srcCopyTo) {
  fs.readdir(srcCopyTo, (err, files) => {
    if (err) {
      console.log(err);
    } else {
        files.forEach((file) => {
          if (file.isFile()) {
            let src = path.join(srcDir, file);
            let srcCopy = path.join(srcCopyTo, file);
            fs.access(src, (err) => {
                if (err) {
                    fs.rm(srcCopy, {recursive: true }, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
          } else {
            let srcToDir = path.join(srcCopyTo, file.name);
            remove(srcToDir);
          }
        });
    }
})
};

setTimeout(() => {
  copy(srcDir);
  remove(srcCopyDir);
}, 100);
