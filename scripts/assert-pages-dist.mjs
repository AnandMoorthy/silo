#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const distIndex = join(process.cwd(), 'dist', 'index.html')
if (!existsSync(distIndex)) {
  console.error('assert-pages-dist: dist/index.html missing')
  process.exit(1)
}

const html = readFileSync(distIndex, 'utf8')
if (html.includes('/src/main.tsx')) {
  console.error('assert-pages-dist: dist/index.html still references /src/main.tsx')
  process.exit(1)
}
if (!html.includes('/silo/assets/')) {
  console.error('assert-pages-dist: dist/index.html missing /silo/assets/ references')
  process.exit(1)
}

const assetsDir = join(process.cwd(), 'dist', 'assets')
if (!existsSync(assetsDir) || readdirSync(assetsDir).length === 0) {
  console.error('assert-pages-dist: dist/assets/ is empty or missing')
  process.exit(1)
}

console.log('assert-pages-dist: ok')
