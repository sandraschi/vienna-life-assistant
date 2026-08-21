import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		allowedHosts: ["goliath"],
		port: 10931,
		host: "127.0.0.1",
		proxy: {
			"/api": {
				target: "http://127.0.0.1:10922",
				changeOrigin: true,
			},
		},
	},
});
