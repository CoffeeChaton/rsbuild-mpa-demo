import { defineConfig, type RsbuildPlugin } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { existsSync, readFileSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGE_MAP } from "./src/common/config/pages";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const repoName = pkg.name;
const assetPrefix = `/${repoName}/`;

const getEntries = () => {
  const entries: Record<string, string> = {};
  Object.keys(PAGE_MAP).forEach((key) => {
    if (key === "404") return;
    const entry = key === "index" ? "" : key;
    entries[entry] = resolve(__dirname, "src/pages/index/main.tsx");
  });
  return entries;
};

// plugin: move 404/index.html -> 404.html
const pluginFixPath = (): RsbuildPlugin => ({
  name: "plugin-fix-path",
  setup(api) {
    api.onAfterBuild(() => {
      const distDir = resolve(__dirname, "dist");
      // 將 404/index.html 移至根目錄 404.html 以符合 GitHub Pages 規範
      const src404 = join(distDir, "404/index.html");
      if (existsSync(src404)) {
        renameSync(src404, join(distDir, "404.html"));
        rmSync(join(distDir, "404"), { recursive: true });
      }
    });
  },
});

export default defineConfig({
  plugins: [pluginReact(), pluginFixPath()],
  source: {
    entry: getEntries(),
    assetsInclude: [/\.tsv$/],
  },
  output: {
    distPath: { root: "dist", js: "static/js", css: "static/css" },
    filename: {
      js: ({ chunk }) => chunk?.name ? `${chunk.name || "index"}.[contenthash:8].js` : "[name].[contenthash:8].js",
      css: ({ chunk }) => chunk?.name ? `${chunk.name || "index"}.[contenthash:8].css` : "[name].[contenthash:8].css",
    },
    assetPrefix,
    cleanDistPath: true,
  },
  html: {
    template: "./public/index.html",
    outputStructure: "nested",
    templateParameters: ({ entryName }) => {
      const configKey = entryName === "" ? "index" : entryName;
      const config = PAGE_MAP[configKey as keyof typeof PAGE_MAP] || PAGE_MAP.index;
      return { title: config.title, description: config.description, base: assetPrefix };
    },
  },
  server: {
    port: process.env.NODE_ENV === "development" ? 3055 : 8080,
    base: assetPrefix,
    historyApiFallback: { index: `${assetPrefix}index.html` },
  },
});
