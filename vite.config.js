import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        recipe: resolve(__dirname, 'recipe-detail.html'),
        // Add more pages here as you create them
      },
    },
  },
})
