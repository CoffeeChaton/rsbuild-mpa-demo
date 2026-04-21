// oxlint-disable no-console
import type { RsbuildPlugin } from "@rsbuild/core";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
	getPageCleanupDir,
	getPageInfo,
	getPageOutputPath,
} from "../src/common/config/pages.build";
import { PAGE_KEYS } from "../src/common/config/pages.config";

export const pluginSSG = (): RsbuildPlugin => ({
	name: "plugin-ssg",
	// oxlint-disable-next-line typescript/explicit-function-return-type
	setup(api) {
		api.onAfterBuild(() => {
			const DIST = resolve(process.cwd(), "dist");
			const indexTemplatePath = join(DIST, "index.html");
			if (!existsSync(indexTemplatePath)) {
				console.warn("[SSG] index.html not found, skipping SSG plugin.");
				return;
			}
			const indexContent = readFileSync(indexTemplatePath, "utf-8");

			for (const key of PAGE_KEYS) {
				const info = getPageInfo(key);
				const outputPath = join(DIST, getPageOutputPath(key));
				const cleanupDirName = getPageCleanupDir(key);

				if (cleanupDirName) {
					const cleanupDirPath = join(DIST, cleanupDirName);
					if (existsSync(cleanupDirPath)) rmSync(cleanupDirPath, { recursive: true });
				}

				const outputDir = dirname(outputPath);
				if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

				const content = indexContent
					.replace(/<title>.*?<\/title>/, `<title>${info.title}</title>`)
					.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${info.description}" />`);

				writeFileSync(outputPath, content);
				console.log(`✅ SSG processed: ${key}`);
			}

			console.log(`✅ SSG processed: All`);
		});
	},
});
