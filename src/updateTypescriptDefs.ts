import { promises as fs } from "fs";
import ora from "ora";
import path from "path";
import { Plugin, plugins } from "./plugins";

function filterByTypescriptDefinitionFiles(files: string[]) {
  return files.filter((file) => file.endsWith("d.ts"));
}

function addTypeDefinitions(addedPlugins: Plugin[]) {
  return async function (files: string[]) {
    const reactScriptsDeclaration = '/// <reference types="react-scripts" />';
    const viteDeclaration = '/// <reference types="vite/client" />';
    const srcFolder = path.resolve(process.cwd(), "src");
    const readFiles = await Promise.all(
      files.map((file) =>
        fs.readFile(path.resolve(srcFolder, file)).then((f) => f.toString())
      )
    );

    let additionalLinesToAdd: string[] = [];

    if (addedPlugins.find((plugin) => plugin.npmPkg === "vite-plugin-svgr")) {
      additionalLinesToAdd.push(
        '/// <reference types="vite-plugin-svgr/client" />'
      );
    }

    let hasWrittenFile = false;

    for (const [idx, file] of readFiles.entries()) {
      if (file.includes(reactScriptsDeclaration)) {
        let newFile = file.replace(reactScriptsDeclaration, viteDeclaration);
        newFile = `${additionalLinesToAdd.join("\n")}\n${newFile}`;
        await fs.writeFile(path.resolve(srcFolder, files[idx]), newFile);
        hasWrittenFile = true;
      }
    }

    if (!hasWrittenFile) {
      console.warn(
        "Unable to write type definitions to d.ts file. You will have to add these manually."
      );
    }
  };
}

export async function updateTypescriptDefs(plugins: Plugin[]) {
  const spinner = ora("Updating typescript definition files");
  spinner.start();
  const srcFolder = path.resolve(process.cwd(), "src");
  await fs
    .readdir(srcFolder)
    .then(filterByTypescriptDefinitionFiles)
    .then(addTypeDefinitions(plugins));

  spinner.succeed("Updated typescript definition files");
}
