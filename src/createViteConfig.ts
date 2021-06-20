import { Plugin } from "./plugins";
import { promises as fs } from "fs";
import path from "path";

export async function createViteConfig(plugins: Plugin[]) {
  const templatePath = path.resolve(
    __dirname,
    "../templates/vite.config.template"
  );
  const template = (await fs.readFile(templatePath)).toString();
  const importReplacer = `{{IMPORTS}}`;
  const pluginsReplacer = `{{PLUGINS}}`;

  const importString = plugins
    .map(({ importStatement }) => importStatement)
    .join("\n");

  const pluginIndentation = "    ";
  const pluginsString = plugins
    .map(({ pluginFn }) => `${pluginIndentation}${pluginFn}`)
    .join(",\n");

  const configFile = template
    .replace(importReplacer, importString)
    .replace(pluginsReplacer, pluginsString);

  const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");
  await fs.writeFile(viteConfigPath, configFile);
}
