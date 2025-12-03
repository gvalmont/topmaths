import { RPC } from '@mixer/postmessage-rpc'
const serviceId = 'capytale-player'
// Gestion des postMessage avec Capytale
const rpc = new RPC({
  target: window.parent,
  serviceId,
  origin: '*',
})

let firstTime = true
let timerId: ReturnType<typeof setTimeout> | undefined
export async function sendToCapytaleMathaleaHasChanged() {
  if (firstTime) {
    // attendre 1 seconde
    await new Promise((resolve) => setTimeout(resolve, 1000))
    firstTime = false
    return
  }
  // On ne prévient Capytale qu'une fois toutes les demi-secondes
  if (timerId === undefined) {
    timerId = setTimeout(() => {
      rpc.call('hasChanged', {})
      timerId = undefined
    }, 500)
  }
}
