const path = require("path");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function run() {
  const directoryPath = path.join(__dirname);

  const templates = await readdir(directoryPath, { withFileTypes: true });

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    if (template.isDirectory()) {
      console.log(template.name);

      const templateFiles = await readdir(path.join(__dirname, template.name), {
        withFileTypes: true
      });
      console.log("templateFiles: ", templateFiles);

      let allTemplates = [];
      for (let j = 0; j < templateFiles.length; j++) {
        const templateFile = templateFiles[j];
        if (templateFile.isDirectory()) {
          console.log("\t", templateFile.name);
          try {
            var components = await readFile(
              path.join(__dirname, template.name, templateFile.name, "cmp.json"),
              "utf8"
            );
            var all = JSON.parse(components);

            var view = {
              name: all.name,
              width: 500,
              height: 400,
              view: all.view
            };

            await writeFile(
              path.join(__dirname, template.name, templateFile.name, "view.json"),
              JSON.stringify(view, null, 2), //, null, 2
              error => console.error(error)
            );
            console.log("=>", path.join(__dirname, template.name, templateFile.name, "view.json"));

            var value = {
              name: all.name,
              desc: all.desc,
              order: all.order,
              value: all.value
            };

            await writeFile(
              path.join(__dirname, template.name, templateFile.name, "value.json"),
              JSON.stringify(value, null, 2), //, null, 2
              error => console.error(error)
            );

            console.log("=>", path.join(__dirname, template.name, templateFile.name, "value.json"));
          } catch (e) {
            console.error("File reading:", e);
          }
          // break;
        }
      }
      console.log("");
      console.log("");
      // break;
    }
  }
}

run();
