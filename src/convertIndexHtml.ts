import path from "path";
import { promises as fs } from "fs";

async function removePublicUrl(indexHtml: string) {
  return indexHtml.replace(/%PUBLIC_URL%/g, "");
}

function addModuleTag(entrypointFilename: string) {
  return async function (indexHtml: string) {
    const moduleTag = `    <script type="module" src="/src/${entrypointFilename}"></script>`;
    const closingBodyTag = `</body>`;
    const lines = indexHtml.split("\n");
    const closingBodyTagIndex = lines.findIndex((l) =>
      l.includes(closingBodyTag)
    );
    lines.splice(closingBodyTagIndex, 0, moduleTag);
    return lines.join("\n");
  };
}

async function resolveEntrypointFilename() {
  const srcDirPath = path.resolve(process.cwd(), "src");
  const possibleFilenames = [
    "main.js",
    "main.jsx",
    "main.ts",
    "main.tsx",
    "index.js",
    "index.ts",
    "index.tsx",
    "index.jsx",
  ];

  const srcDir = await fs.readdir(srcDirPath);
  const entrypointFilename = srcDir.find((fileName) =>
    possibleFilenames.includes(fileName)
  );

  if (!entrypointFilename) {
    throw new Error(
      `Could not locate entrypoint. Supported entrypoint filenames are ${possibleFilenames.join(
        ", "
      )}`
    );
  }

  return entrypointFilename;
}

export async function convertIndexHtml() {
  const indexHtmlPath = path.resolve(process.cwd(), "public/index.html");
  const newIndexHtmlPath = path.resolve(process.cwd(), "index.html");
  const entrypointFilename = await resolveEntrypointFilename();
  const indexHtml = await fs
    .readFile(indexHtmlPath)
    .then((file) => file.toString())
    .then(removePublicUrl)
    .then(addModuleTag(entrypointFilename));

  await fs.writeFile(newIndexHtmlPath, indexHtml);
  await fs.unlink(indexHtmlPath);
}
