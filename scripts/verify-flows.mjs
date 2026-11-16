import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.SILO_URL ?? 'http://127.0.0.1:5173'
const OUT = process.env.SILO_MEDIA ?? '/cursor/stores/self/media'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})
const page = await context.newPage()

const shots = []
async function shot(name) {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file, fullPage: false })
  shots.push(file)
  console.log('shot', file)
}

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Silo' }).waitFor()
await shot('01-home')

// Enter lighthouse
await page.getByRole('button', { name: /The Last Keeper/ }).click()
await page.getByText('Keeper of a lighthouse').waitFor()
await shot('02-world-state-first-visit')

await page.getByRole('button', { name: /Play chapter 1/ }).click()
await page.getByText(/radio crackles/i).waitFor()
await shot('03-card')

await page.getByRole('button', { name: /Answer her/ }).click()
await page.getByText(/laughs, relieved/i).waitFor()
await shot('04-choice-result')

await page.getByRole('button', { name: 'Continue' }).click()
await page.getByRole('button', { name: /Read the letter|Burn it/ }).first().waitFor()
await page.getByRole('button', { name: /Read the letter/ }).click()
await page.getByRole('button', { name: 'Continue' }).click()
await page.getByRole('button', { name: /Climb up now|Wait it out/ }).first().waitFor()
await page.getByRole('button', { name: /Climb up now/ }).click()
await page.getByRole('button', { name: 'Continue' }).click()
await page.getByText(/keeps going without you/i).waitFor()
await shot('05-chapter-end')

await page.getByRole('button', { name: 'Back to Home' }).click()
await page.getByRole('heading', { name: 'Silo' }).waitFor()
await page.getByText('Something changed').waitFor()
await shot('06-home-something-changed')

// Isolation: bakery untouched
const bakery = page.getByRole('button', { name: /Second Shift/ })
await bakery.click()
await page.getByText('Night baker').waitFor()
await page.getByText(/60-year-old bakery/i).waitFor()
// first visit shows tagline, not lighthouse facts
const body = await page.locator('body').innerText()
if (body.includes('Ines calls every evening')) {
  throw new Error('Isolation failed: lighthouse fact leaked into bakery')
}
await shot('07-bakery-isolated')
await page.getByRole('button', { name: 'Leave' }).click()

// Return to lighthouse → recap
await page.getByRole('button', { name: /The Last Keeper/ }).click()
await page.getByRole('heading', { name: 'Since you left' }).waitFor()
await shot('08-recap')
await page.getByRole('button', { name: 'Continue' }).click()
await page.getByText('Ines calls every evening.').waitFor()
await shot('09-world-state-with-facts')

// Mid-chapter reload
await page.getByRole('button', { name: /Play chapter 2/ }).click()
await page.getByRole('button', { name: /Let him come|Say no/ }).first().waitFor()
await page.getByRole('button', { name: /Let him come/ }).click()
await page.getByRole('button', { name: 'Continue' }).click()
await page.locator('.card-text').waitFor()
const beforeReload = await page.locator('.card-text').innerText()
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Silo' }).waitFor()
await page.getByRole('button', { name: /The Last Keeper/ }).click()
await page.getByText(beforeReload).waitFor({ timeout: 5000 })
await shot('10-mid-chapter-resume')

// Reset one world from home
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /^Reset/ }).click()
await page.getByRole('button', { name: /Reset The Last Keeper/ }).click()
await page.getByRole('button', { name: 'Confirm reset' }).click()
await page.getByRole('button', { name: /The Last Keeper/ }).click()
await page.getByText(/ferries stopped visiting/i).waitFor()
const afterReset = await page.locator('body').innerText()
if (afterReset.includes('Ines calls every evening')) {
  throw new Error('Reset failed: lighthouse facts still present')
}
await shot('11-reset-one-world')

console.log('OK flows verified')
console.log(JSON.stringify({ shots }, null, 2))
await browser.close()
