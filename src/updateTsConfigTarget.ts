import path from "path";
import { promises as fs } from "fs";
import { exists, parseJson, stringifyJson } from "./util";
import ora from "ora";

export async function updateTsConfigTarget() {
  const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");

  const hasTsConfig = await exists(tsConfigPath);

  if (!hasTsConfig) return;

  const spinner = ora("Setting tsconfig.json target to ESNext");
  spinner.start();

  const tsConfig = await fs
    .readFile(tsConfigPath)
    .then((cfg) => parseJson(cfg.toString()));

  tsConfig.compilerOptions.target = "ESNext";

  const newTsConfig = stringifyJson(tsConfig);
  await fs.writeFile(tsConfigPath, newTsConfig);
  spinner.succeed("Set tsconfig.json target to ESNext");
}
