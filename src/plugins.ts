export type Plugin = {
  importStatement: string;
  pluginFn: string;
  npmPkg: string;
  name: string;
};

export const tsConfigPathsPlugin: Plugin = {
  name: "TSConfig Paths",
  importStatement: `import tsconfigPaths from 'vite-tsconfig-paths';`,
  pluginFn: `tsconfigPaths()`,
  npmPkg: "vite-tsconfig-paths",
};

export const reactJsxPlugin: Plugin = {
  name: "React JSX Vite Plugin",
  importStatement: `import reactJsx from "vite-react-jsx";`,
  npmPkg: "vite-react-jsx",
  pluginFn: `reactJsx()`,
};

export const plugins: Record<string, Plugin> = {
  "react-refresh": {
    name: "React Refresh",
    importStatement: `import reactRefresh from "@vitejs/plugin-react-refresh";`,
    npmPkg: "@vitejs/plugin-react-refresh",
    pluginFn: `reactRefresh()`,
  },
  svgr: {
    name: "SVGR (Import SVG's as React Components)",
    importStatement: `import svgr from "vite-plugin-svgr";`,
    npmPkg: "vite-plugin-svgr",
    pluginFn: `svgr()`,
  },
  "babel-macros": {
    name: "babel macros",
    importStatement: `import macrosPlugin from "vite-plugin-babel-macros";`,
    npmPkg: "vite-plugin-babel-macros",
    pluginFn: `macrosPlugin()`,
  },
};
