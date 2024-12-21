import MillionLint from "@million/lint";
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
	server: {
		preset: "vercel",
	},
	defaultSsr: false,
	vite: {
		plugins: [
			MillionLint.vite({
				rsc: true,
				optimizeDOM: true,
				experimental: {
					stabilize: true,
				},
			}),
		],
	},
});
