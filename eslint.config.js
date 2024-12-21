import pluginRouter from "@tanstack/eslint-plugin-router";
import biome from "eslint-config-biome";

export default [
	...pluginRouter.configs["flat/recommended"],
	{
		ignores: [
			"apps/tanstack-router-app/.output/",
			"apps/tanstack-router-app/.vercel/",
			"apps/tanstack-router-app/.vinxi/",
		],
	},
	biome,
];
