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
      // console.log("templateFiles: ", templateFiles);

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
            allTemplates.push(JSON.parse(components));
          } catch (e) {
            console.error("File reading:", e);
          }
        }
      }

      await writeFile(
        path.join(__dirname, template.name, "index.json"),
        JSON.stringify(allTemplates, null, 2),
        error => console.error(error)
      );

      console.log("=>", path.join(__dirname, template.name, "index.json"));
      console.log("");
    }
  }
}

run();
