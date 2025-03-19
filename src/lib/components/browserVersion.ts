import { UAParser } from 'ua-parser-js'

const minVersion = {
  // Mgu à ajouter en fonction des problèmes...
  Chrome: 80,
  Firefox: 75,
  Safari: 16,
  Edge: 80,
  Opera: 67,
  'Samsung Internet': 8,
  'Mobile Safari': 12,
  'Mobile Chrome': 63,
  'Chrome Headless': 80
}

export function checkBrowserVersion () {
  const uap = new UAParser()
  const { browser, cpu, device, os, ua } = uap.getResult()

  // console.log(uap.getResult())
  // console.log(cpu)
  // console.log(device)

  const browserName = browser.name
  const browserVersion = browser.major ? parseInt(browser.major, 10) : 0
  let popupMessage = ''
  if (browserName && minVersion[browserName as keyof typeof minVersion] && browserVersion < minVersion[browserName as keyof typeof minVersion]) {
    popupMessage = `Votre navigateur (${browserName} ${browserVersion}) est trop vieux. Veuillez mettre à jour votre navigateur pour une meilleure expérience.`
  }
  if (!minVersion[browserName as keyof typeof minVersion]) {
    window.notify('Navigateur inconnu', { browserName, browserVersion, browser, cpu, os, device, ua })
  }
  const url = new URL(window.location.href)
  if (url.hostname === 'localhost' && url.searchParams.has('triche')) {
    popupMessage = Object.entries({ browserName, browserVersion, browser, cpu, os, device, ua }).map(([key, value]) => `${key}: ${value}`).join('<br>')
  }
  return { popupMessage, browserName, browserVersion }
}
