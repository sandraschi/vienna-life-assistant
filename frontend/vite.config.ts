import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get configuration from environment variables
const tailscaleHostname = process.env.VITE_TAILSCALE_HOSTNAME || process.env.TAILSCALE_HOSTNAME || 'goliath';
const tailscaleBackendPort = process.env.VITE_TAILSCALE_BACKEND_PORT || process.env.TAILSCALE_BACKEND_PORT || '7334';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all interfaces for Tailscale access
    port: 9173,
    strictPort: true,
    hmr: {
      host: 'localhost',  // HMR uses localhost (not tailscale hostname)
      protocol: 'ws',
    },
    // Allow configurable Tailscale hostname
    allowedHosts: ['localhost', '127.0.0.1', tailscaleHostname],
    proxy: {
      '/api': {
        target: `http://backend:${tailscaleBackendPort}`,
        changeOrigin: true,
      }
    }
  },
  // Define environment variables for the frontend
  define: {
    'import.meta.env.VITE_TAILSCALE_HOSTNAME': JSON.stringify(tailscaleHostname),
    'import.meta.env.VITE_TAILSCALE_BACKEND_PORT': JSON.stringify(tailscaleBackendPort),
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

