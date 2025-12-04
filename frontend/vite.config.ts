import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all interfaces for Tailscale access
    port: 9173,
    strictPort: true,
    hmr: {
      host: 'localhost',  // HMR uses localhost (not goliath)
      protocol: 'ws',
    },
    // Allow Tailscale hostname
    allowedHosts: ['localhost', '127.0.0.1', 'goliath'],
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})

