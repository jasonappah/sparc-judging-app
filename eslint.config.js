// TODO: this no worky. need to figure this out
import pluginRouter from "@tanstack/eslint-plugin-router";
import biome from "eslint-config-biome";

export default [...pluginRouter.configs["flat/recommended"], biome];
