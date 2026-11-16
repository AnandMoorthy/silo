import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.SILO_URL ?? 'http://127.0.0.1:5173'
const OUT = process.env.SILO_MEDIA ?? '/cursor/stores/self/media'
fs.mkdirSync(OUT, { recursive: true })
const videoDir = path.join(OUT, '_video-tmp')
fs.rmSync(videoDir, { recursive: true, force: true })
fs.mkdirSync(videoDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  recordVideo: { dir: videoDir, size: { width: 390, height: 844 } },
})
const page = await context.newPage()
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.getByRole('button', { name: /The Last Keeper/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /Play chapter 1/ }).click()
await page.waitForTimeout(700)
await page.getByRole('button', { name: /Answer her/ }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /Burn it for warmth/ }).click()
await page.waitForTimeout(800)
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(400)
await page.getByRole('button', { name: /Wait it out/ }).click()
await page.waitForTimeout(800)
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(700)
await page.getByRole('button', { name: 'Back to Home' }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /The Last Keeper/ }).click()
await page.waitForTimeout(1200)
await page.getByRole('button', { name: 'Continue' }).click()
await page.waitForTimeout(1000)

await context.close()
await browser.close()

const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith('.webm'))
if (!videos[0]) throw new Error('No video recorded')
const dest = path.join(OUT, 'silo-demo.webm')
fs.renameSync(path.join(videoDir, videos[0]), dest)
fs.rmSync(videoDir, { recursive: true, force: true })
console.log('demo', dest)
