import { get } from 'svelte/store'
import { previousView } from './stores/generalStore'
import { globalOptions } from './stores/globalOptions'
import type { VueType } from './VueType'

export function mathaleaGoToView(destinationView: '' | VueType) {
  const originView = get(globalOptions).v ?? ''
  previousView.set(originView)
  if (destinationView !== get(globalOptions).v) {
    // on met à jour que si ncécessaire
    globalOptions.update((l) => {
      l.v = destinationView
      return l
    })
  }
}
