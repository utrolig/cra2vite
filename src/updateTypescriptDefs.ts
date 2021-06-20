import { promises as fs } from "fs";
import path from "path";

function filterByTypescriptDefinitionFiles(files: string[]) {
  return files.filter((file) => file.endsWith("d.ts"));
}

async function replaceReactScriptsReferenceIfExists(files: string[]) {
  const reactScriptsDeclaration = '/// <reference types="react-scripts" />';
  const viteDeclaration = '/// <reference types="vite/client" />';
  const srcFolder = path.resolve(process.cwd(), "src");
  const readFiles = await Promise.all(
    files.map((file) =>
      fs.readFile(path.resolve(srcFolder, file)).then((f) => f.toString())
    )
  );

  for (const [idx, file] of readFiles.entries()) {
    if (file.includes(reactScriptsDeclaration)) {
      const newFile = file.replace(reactScriptsDeclaration, viteDeclaration);
      await fs.writeFile(path.resolve(srcFolder, files[idx]), newFile);
    }
  }
}

export async function updateTypescriptDefs() {
  const srcFolder = path.resolve(process.cwd(), "src");
  await fs
    .readdir(srcFolder)
    .then(filterByTypescriptDefinitionFiles)
    .then(replaceReactScriptsReferenceIfExists);
}
