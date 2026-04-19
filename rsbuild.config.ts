// rsbuild.config.ts
import { defineConfig, type RsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getPageEntryName, getPageInfoByEntryName, PAGE_KEYS } from "./src/common/config/pages.build";
import { pluginSSG } from "./scripts/ssg";

const assetPrefix = `/rsbuild-mpa-demo/`; // .eq. package.json name but not IO

const __dirname = dirname(fileURLToPath(import.meta.url));

const getEntries = () => {
	const entries: Record<string, string> = {};
	PAGE_KEYS.forEach((key) => {
		if (key === "404") return;
		const entry = getPageEntryName(key);
		entries[entry] = resolve(__dirname, "src/main.tsx");
	});
	return entries;
};

const rsbuildConfig: RsbuildConfig = defineConfig({
	resolve: {
		alias: {
			"@": "./",
		},
	},
	dev: {
		lazyCompilation: false,
	},
	plugins: [pluginReact(), pluginSSG()],
	source: {
		entry: getEntries(),
		assetsInclude: [/\.tsv$/],
	},
	output: {
		// 	minify: true,
		distPath: { root: "dist", js: "static/js", css: "static/css" },
		filename: {
			js: "js-[name]-[contenthash:8].js",
			css: "css-[name]-[contenthash:8].css",
		},
		assetPrefix,
		cleanDistPath: true,
	},
	html: {
		template: "./public/index.html",
		outputStructure: "nested",
		templateParameters: ({ entryName }) => {
			const safeEntryName = typeof entryName === "string" ? entryName : "";
			const pageInfo = getPageInfoByEntryName(safeEntryName);
			return { title: pageInfo.title, description: pageInfo.description, base: assetPrefix };
		},
	},
	server: {
		port: process.env["NODE_ENV"] === "development" ? 3055 : 8080,
		base: assetPrefix,
		historyApiFallback: { index: `${assetPrefix}index.html` },
		printUrls: ({ urls }) => urls.filter((url) => url.includes("localhost")),
	},
	performance: {
		chunkSplit: {
			strategy: "custom",
			splitChunks: {
				chunks: "all",
				// 限制最小拆分體積，防止產生太多幾 KB 的碎檔案（導致 Prefetch 爆炸）
				minSize: 20000,

				cacheGroups: {
					// 1. 核心基礎庫 (變動率極低，全站共用)
					base: {
						test: /[\\/]node_modules[\\/](react|react-dom|react-router|swr)[\\/]/,
						name: "lib-base",
						priority: 50,
						enforce: true,
					},

					// 2. UI 框架與樣式工具 (Radix + Tailwind Utils)
					ui: {
						test: /[\\/]node_modules[\\/](@radix-ui|radix-ui|clsx|tailwind-merge|class-variance-authority)[\\/]/,
						name: "lib-ui",
						priority: 40,
					},

					// 3. 圖標庫 (單獨一包，因為 Lucide 通常很大)
					icons: {
						test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
						name: "lib-icons",
						priority: 30,
					},

					// 4. 剩下的 node_modules
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "lib-vendor",
						priority: -10,
						reuseExistingChunk: true,
					},

					// 捕獲所有未被命名的公共代碼
					shared: {
						name: "lib-shared", // 這樣它就會變成 lib-shared.de343c49.js
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			},
		},
	},
});

export default rsbuildConfig;
