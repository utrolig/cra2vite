import inquirer from "inquirer";
import { plugins, tsConfigPathsPlugin } from "./plugins";
import path from "path";
import { promises as fs } from "fs";
import { exists, parseJson } from "./util";

async function requiresTsConfigPathsPlugin() {
  const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");

  const hasTsConfig = await exists(tsConfigPath);

  if (!hasTsConfig) return false;

  const tsConfig = await fs
    .readFile(tsConfigPath)
    .then((f) => parseJson(f.toString()));

  if (tsConfig.compilerOptions.baseUrl) {
    return true;
  }

  return false;
}

export async function selectPlugins() {
  const { plugins: pluginAnswers } = await inquirer.prompt([
    {
      name: "plugins",
      message: "Which plugins do you need?",
      choices: Object.entries(plugins).map(([key, { name }]) => ({
        key,
        name,
        value: key,
      })),
      type: "checkbox",
    },
  ]);

  const pluginsToAdd = (pluginAnswers as string[]).map(
    (pluginKey) => plugins[pluginKey]
  );

  if (await requiresTsConfigPathsPlugin()) {
    pluginsToAdd.push(tsConfigPathsPlugin);
  }

  return pluginsToAdd;
}
