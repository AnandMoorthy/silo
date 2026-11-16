/// <reference types="vitest/config" />
import { existsSync, renameSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const devIndex = path.resolve(rootDir, 'index.dev.html')

/** Serve / build from index.dev.html so root index.html can be the Pages production build. */
function useDevIndexHtml() {
  return {
    name: 'use-dev-index-html',
    configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: unknown, next: () => void) => void) => void } }) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/' || req.url?.startsWith('/index.html')) {
          req.url = '/index.dev.html'
        }
        next()
      })
    },
    closeBundle() {
      const from = path.resolve(rootDir, 'dist/index.dev.html')
      const to = path.resolve(rootDir, 'dist/index.html')
      if (existsSync(from)) {
        renameSync(from, to)
      }
    },
  }
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/silo/' : '/',
  plugins: [react(), useDevIndexHtml()],
  build: {
    rollupOptions: {
      // Named "index" so the hashed bundle is assets/index-*.js (not index.dev-*).
      input: { index: devIndex },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
