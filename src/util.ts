import { promises as fs } from "fs";
import inquirer from "inquirer";
import path from "path";
import { appendToErrorFile, errFilename } from "./errorLog";
import HJSON from "hjson";

export async function exists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export type PkgManager = "yarn" | "npm";

export async function detectPackageManager(): Promise<PkgManager> {
  const packageLock = path.resolve(process.cwd(), "package-lock.json");
  const yarnLock = path.resolve(process.cwd(), "yarn.lock");
  const hasPackageLock = await exists(packageLock);
  const hasYarnLock = await exists(yarnLock);

  if (hasPackageLock) {
    return "npm";
  }

  if (hasYarnLock) {
    return "yarn";
  }

  const { pkgManager } = await inquirer.prompt([
    {
      type: "list",
      name: "pkgManager",
      message:
        "Could not find package-lock or yarn.lock file. Which package manager would you like to use?",
      choices: [
        {
          key: "yarn",
          value: "yarn",
          name: "yarn",
        },
        {
          key: "npm",
          value: "npm",
          name: "NPM",
        },
      ],
    },
  ]);

  return pkgManager as PkgManager;
}

export async function exitWithErrorMessage(err: Error) {
  await appendToErrorFile(err);
  console.log(
    `An error occured. Check the log file ${errFilename} for more information.`
  );
  process.exit(1);
}

export async function isTypescriptProject() {
  const tsconfigPath = path.resolve(process.cwd(), "tsconfig.json");
  const tsconfigExists = await exists(tsconfigPath);
  return tsconfigExists;
}

export function stringifyJson<T>(obj: T) {
  return HJSON.stringify(obj, {
    space: 2,
    quotes: "all",
    separator: true,
    bracesSameLine: true,
    keepWsc: true,
  });
}

export function parseJson(str: string) {
  return HJSON.parse(str, { keepWsc: true });
}
