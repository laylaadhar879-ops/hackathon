import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    {
      name: 'custom-404',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // List of valid HTML pages
          const validPages = [
            '/',
            '/index.html',
            '/recipes.html',
            '/contact.html',
            '/recipe-detail.html',
            '/404.html',
            '/error.html'
          ]

          // Check if request is for HTML and not in valid pages
          const isHtmlRequest = req.url &&
            (req.url.endsWith('.html') || req.url === '/' || !req.url.includes('.'))

          const isValidPage = validPages.some(page =>
            req.url === page || req.url.startsWith(page + '?')
          )

          // If it's an HTML request and not valid, serve 404.html
          if (isHtmlRequest && !isValidPage && !req.url.includes('@') && !req.url.includes('node_modules')) {
            const notFoundPath = resolve(__dirname, '404.html')
            const content = fs.readFileSync(notFoundPath, 'utf-8')
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html')
            res.end(content)
            return
          }

          next()
        })
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        recipes: resolve(__dirname, 'recipes.html'),
        contact: resolve(__dirname, 'contact.html'),
        recipe: resolve(__dirname, 'recipe-detail.html'),
        404: resolve(__dirname, '404.html'),
        error: resolve(__dirname, 'error.html'),
      },
    },
  },
})
