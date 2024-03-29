import path from "path";
import { promises as fs } from "fs";
import {
  exitWithErrorMessage,
  isTypescriptProject,
  parseJson,
  stringifyJson,
} from "./util";
import ora from "ora";
import { omit } from "lodash";

async function replaceBuildScripts(pkgJson: string) {
  const isTypescript = await isTypescriptProject();

  const buildString = "react-scripts build";

  if (isTypescript) {
    return pkgJson.replace(buildString, "tsc && vite build");
  }

  return pkgJson.replace(buildString, "vite build");
}

async function replaceDevScripts(pkgJson: string) {
  const devString = "react-scripts start";
  return pkgJson.replace(devString, "vite");
}

async function removeEject(pkgJson: string) {
  const pkgJsonObj = omit(parseJson(pkgJson), ["scripts.eject"]);
  return stringifyJson(pkgJsonObj);
}

export async function modifyPkgJsonScripts() {
  const spinner = ora("Updating package.json scripts");
  spinner.start();
  const pkgJsonPath = path.resolve(process.cwd(), "package.json");
  try {
    const pkgJson = await fs
      .readFile(pkgJsonPath)
      .then((f) => f.toString())
      .then(replaceBuildScripts)
      .then(replaceDevScripts)
      .then(removeEject);

    await fs.writeFile(pkgJsonPath, pkgJson);
    spinner.succeed("Updated package.json scripts");
  } catch (err) {
    await exitWithErrorMessage(err);
    spinner.fail("Error while updating package.json scripts");
  }
}
