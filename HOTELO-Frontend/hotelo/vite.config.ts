import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  // Allow importing .lottie files as static assets (returns a URL)
  assetsInclude: ['**/*.lottie'],
  server:{
    port:5173,
    host:true
  }
})
