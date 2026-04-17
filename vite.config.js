import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 5000, // Increased to 5MB to suppress warnings
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:"https://rento-backend-c1va.onrender.com",
        changeOrigin: true,
      },
    },
    host: true
  }
})
