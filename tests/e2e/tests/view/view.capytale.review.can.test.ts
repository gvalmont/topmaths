import { type Browser, chromium, expect, type Page } from '@playwright/test'
import { afterAll, beforeAll, describe, test, afterEach } from 'vitest'
import prefs from '../../helpers/prefs.js'

describe('playwright meets vitest', () => {
  let page: Page
  let browser: Browser

  if (process.env.CI) {
    // utiliser pour les tests d'intégration
    prefs.headless = true
  } else {
    prefs.headless = false
    prefs.slowMo = 1000
  }

  beforeAll(async () => {
    browser = await chromium.launch({ headless: prefs.headless, slowMo: prefs.slowMo })
    const context = await browser.newContext()
    page = await context.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  afterEach(async () => {
    // await page.pause()
  })

  test('Test QCM - CLOCK - APIGEOM - cliquefigure - DRAGANDDROP - MATHFIED - LISTEDEROULANTE', async () => {
    // Mock the api call before navigating
    await page.route(`http://localhost:${process.env.CI ? '80' : '5173'}/parent`, async route => {
      await route.fulfill({
        contentType: 'text/html',
        body: `<html>
        <body>
        bonjour
        <div style='height: 90%;'>
        <iframe id='iframe' width="100%" height="100%" allowfullscreen="" src='http://localhost:${process.env.CI ? '80' : '5173'}/alea/?recorder=capytale'></iframe>
        </div>
        <script src='modulemock.js' type='module'></script>
        </body></html>`
      })
    })
    await page.route(`http://localhost:${process.env.CI ? '80' : '5173'}/modulemock.js`, async route => {
      await route.fulfill({
        contentType: 'text/javascript',
        path: require('path').resolve(__dirname, '../../mock/mock.capytale.review.can.module.js')
      })
    })

    // Go to the page
    const hostname = `http://localhost:${process.env.CI ? '80' : '5173'}/parent`

    await page.goto(hostname)

    await expect(page.getByText('bonjour')).toBeVisible()

    // await page.pause()
    expect(await page.locator('#iframe').contentFrame().locator('#score:first-child > span').innerText()).toBe('1/11')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-0').innerText()).toBe('12\nℎ\n15\n12h15')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-1').innerText()).toBe('20\n000\n000\n000\n20000000000')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-2').innerText()).toBe('600\n600')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-3').innerText()).toBe('𝑉\n𝑜\n𝑖\n𝑟\n𝑓\n𝑖\n𝑔\n𝑢\n𝑟\n𝑒\nVoirfigure')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-4').innerText()).toBe('1\n1')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-5').innerText()).toBe('1\n1')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-6').innerText()).toBe('𝑑\n𝑖\n𝑓\n𝑓\n𝑒\nˊ\n𝑟\n𝑒\n𝑛\n𝑐\n𝑒\ndiff\ne\nˊ\nrence')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-7').innerText()).toBe('𝑑\n𝑖\n𝑓\n𝑓\n𝑒\nˊ\n𝑟\n𝑒\n𝑛\n𝑐\n𝑒\ndiff\ne\nˊ\nrence')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-8').innerText()).toBe('diffeˊrence{différence}diffeˊrence')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-9').innerText()).toBe('𝑑\n𝑖\n𝑓\n𝑓\n𝑒\nˊ\n𝑟\n𝑒\n𝑛\n𝑐\n𝑒\ndiff\ne\nˊ\nrence')
    expect(await page.locator('#iframe').contentFrame().locator('#answer-10').innerText()).toBe('𝑑\n𝑒\n𝑢\n𝑥\ndeux')
  })
})

// pnpm vitest --config tests/e2e/vitest.config.view.js --run tests\e2e\tests\view\view.capytale.review.can.test.ts
