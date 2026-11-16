#!/usr/bin/env node
/**
 * Copy production dist/ to the repo root so legacy GitHub Pages
 * (Settings → Pages → Deploy from branch → main /) serves the build
 * instead of the Vite source tree.
 */
import { cpSync, existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')
const distIndex = join(dist, 'index.html')

if (!existsSync(distIndex)) {
  console.error('sync-pages-root: dist/index.html missing — run build first')
  process.exit(1)
}

const html = readFileSync(distIndex, 'utf8')
if (html.includes('/src/main.tsx') || !html.includes('/silo/assets/')) {
  console.error('sync-pages-root: refusing to publish a non-production dist/index.html')
  process.exit(1)
}

const rootAssets = join(root, 'assets')
if (existsSync(rootAssets)) {
  rmSync(rootAssets, { recursive: true, force: true })
}
cpSync(join(dist, 'assets'), rootAssets, { recursive: true })
cpSync(distIndex, join(root, 'index.html'))
cpSync(join(dist, 'favicon.svg'), join(root, 'favicon.svg'))
writeFileSync(join(root, '.nojekyll'), '')

console.log('sync-pages-root: wrote index.html, favicon.svg, assets/, .nojekyll from dist/')
