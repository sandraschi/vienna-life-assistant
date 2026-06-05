import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        allowedHosts: ['goliath'],
        port: 10988,
        host: "127.0.0.1",
        proxy: {
            "/api": {
                target: "http://127.0.0.1:10922",
                changeOrigin: true,
            },
            "/health": {
                target: "http://127.0.0.1:10922",
                changeOrigin: true,
            },
        },
    },
});
