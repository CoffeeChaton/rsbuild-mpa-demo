import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
});

// oxlint-disable-next-line import/no-default-export
export default config;
