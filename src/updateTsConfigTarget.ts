import path from "path";
import { promises as fs } from "fs";
import { exists, parseJson, stringifyJson } from "./util";

export async function updateTsConfigTarget() {
  const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");

  const hasTsConfig = await exists(tsConfigPath);

  if (!hasTsConfig) return;

  const tsConfig = await fs
    .readFile(tsConfigPath)
    .then((cfg) => parseJson(cfg.toString()));

  tsConfig.compilerOptions.target = "ESNext";

  const newTsConfig = stringifyJson(tsConfig);
  await fs.writeFile(tsConfigPath, newTsConfig);
}
