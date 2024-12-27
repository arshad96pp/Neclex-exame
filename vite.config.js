import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    base: '/',
    // build: {
    //   assetsInlineLimit: 0 // Disable hashing of image filenames
    // }
    build: {
      outDir: 'dist',
    },

})
