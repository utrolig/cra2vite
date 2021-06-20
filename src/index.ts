#!/usr/bin/env node
import { createViteConfig } from "./createViteConfig";
import { updateDeps } from "./updateDeps";
import { modifyPkgJsonScripts } from "./modifyPkgJsonScripts";
import { selectPlugins } from "./selectPlugins";
import { convertIndexHtml } from "./convertIndexHtml";
import { updateTypescriptDefs } from "./updateTypescriptDefs";
import { updateTsConfigTarget } from "./updateTsConfigTarget";

async function main() {
  const pluginsToAdd = await selectPlugins();
  await createViteConfig(pluginsToAdd);
  await updateDeps(pluginsToAdd);
  await modifyPkgJsonScripts();
  await convertIndexHtml();
  await updateTsConfigTarget();
  await updateTypescriptDefs();
}

main();
