import { Plugin } from "./plugins";
import { detectPackageManager, exitWithErrorMessage, PkgManager } from "./util";
import { promisify } from "util";
import { exec as execCb } from "child_process";
import ora from "ora";
import { appendToErrorFile } from "./errorLog";
import chalk from "chalk";

const exec = promisify(execCb);

const addDepsPrefix: Record<PkgManager, string> = {
  yarn: "yarn add -D",
  npm: "npm install --save-dev",
};

const removeDepsPrefix: Record<PkgManager, string> = {
  yarn: "yarn remove",
  npm: "npm uninstall",
};

function _pluralizedDeps(length: number) {
  if (length > 1) {
    return "dependencies";
  }

  return "dependency";
}

async function removeDeps(pkgManager: PkgManager) {
  const depsToRemove = ["react-scripts"];
  const removeString = [removeDepsPrefix[pkgManager], ...depsToRemove].join(
    " "
  );

  const spinner = ora(
    `Removing ${depsToRemove.length} ${_pluralizedDeps(depsToRemove.length)}`
  );
  spinner.start();

  try {
    await exec(removeString);
    spinner.succeed(
      `Removed ${depsToRemove.length} ${_pluralizedDeps(depsToRemove.length)}.`
    );
    console.log(`  ${chalk.blueBright(depsToRemove.join("\n  "))}`);
  } catch (err) {
    spinner.fail("Error while removing dependencies.");
    await exitWithErrorMessage(err);
  }
}

async function installDeps(plugins: Plugin[], pkgManager: PkgManager) {
  const baseDeps = ["vite", "dotenv"];
  const depsToInstall = plugins.map(({ npmPkg }) => npmPkg);

  const deps = [...baseDeps, ...depsToInstall];

  const installString = [addDepsPrefix[pkgManager], ...deps].join(" ");

  const spinner = ora(
    `Installing ${deps.length} ${_pluralizedDeps(deps.length)}`
  );
  spinner.start();

  try {
    await exec(installString);
    spinner.succeed(
      `Installed ${deps.length} ${_pluralizedDeps(deps.length)}.`
    );
    console.log(`  ${chalk.blueBright(deps.join("\n  "))}`);
  } catch (err) {
    spinner.fail("Error while installing dependencies.");
    await exitWithErrorMessage(err);
  }
}

export async function updateDeps(plugins: Plugin[]) {
  const pkgManager = await detectPackageManager();
  await removeDeps(pkgManager);
  await installDeps(plugins, pkgManager);
}
