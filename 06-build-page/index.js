const fs = require('fs');
const path = require('path');

const srcProjectDist = path.join(__dirname, 'test-files', 'project-dist2');
const srcHTML = path.join(__dirname, 'test-files', 'project-dist2', 'index.html');
const srcTemplate = path.join(__dirname, 'template.html');
const srcComponents = path.join(__dirname, 'test-files', 'components');

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


