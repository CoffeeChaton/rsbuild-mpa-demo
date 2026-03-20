import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
});

export default config;
