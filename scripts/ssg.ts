import type { RsbuildPlugin } from "@rsbuild/core";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PAGE_MAP } from "../src/common/config/pages";

export const pluginSSG = (): RsbuildPlugin => ({
	name: "plugin-ssg",
	setup(api) {
		api.onAfterBuild(() => {
			const DIST = resolve(process.cwd(), "dist");
			const indexTemplatePath = join(DIST, "index.html");
			if (!existsSync(indexTemplatePath)) {
				console.warn("[SSG] index.html not found, skipping SSG plugin.");
				return;
			}
			const indexContent = readFileSync(indexTemplatePath, "utf-8");

			for (const [key, info] of Object.entries(PAGE_MAP)) {
				const dir = key === "index" ? DIST : join(DIST, key);
				let path = join(dir, "index.html");

				// 404 特殊處理
				if (key === "404") {
					path = join(DIST, "404.html");
					if (existsSync(join(DIST, "404"))) rmSync(join(DIST, "404"), { recursive: true });
				} else {
					if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
				}

				const content = indexContent
					.replace(/<title>.*?<\/title>/, `<title>${info.title}</title>`)
					.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${info.description}" />`);

				writeFileSync(path, content);
				console.log(`✅ SSG processed: ${key}`);
			}

			console.log(`✅ SSG processed: All`);
		});
	},
});
