import { defineConfig, type RsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGE_MAP } from "./src/common/config/pages";
import { pluginSSG } from "./scripts/ssg";

const assetPrefix = `/rsbuild-mpa-demo/`; // .eq. package.json name but not IO

const __dirname = dirname(fileURLToPath(import.meta.url));

const getEntries = () => {
	const entries: Record<string, string> = {};
	Object.keys(PAGE_MAP).forEach((key) => {
		if (key === "404") return;
		const entry = key === "index" ? "" : key;
		entries[entry] = resolve(__dirname, "src/pages/index/main.tsx");
	});
	return entries;
};

const config: RsbuildConfig = defineConfig({
	plugins: [pluginReact(), pluginSSG()],
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
		port: process.env["NODE_ENV"] === "development" ? 3055 : 8080,
		base: assetPrefix,
		historyApiFallback: { index: `${assetPrefix}index.html` },
		printUrls: ({ urls }) => urls.filter((url) => url.includes("localhost")),
	},
});

export default config;
