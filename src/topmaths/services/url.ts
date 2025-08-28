import { TOPMATHS_BASE_URL } from './environment.js'
import { showDialogForLimitedTime } from '../../lib/components/dialogs.js'
import { isRegularClick } from './navigation'

export function removeSeed(link: string): string {
  const url = new URL(link)
  const searchParams = url.searchParams
  searchParams.delete('alea')
  url.search = searchParams.toString()
  return url.toString()
}

export function setSeed(link: string, seed: number): string {
  const url = new URL(link)
  const searchParams = url.searchParams
  searchParams.set('alea', seed.toString())
  url.search = searchParams.toString()
  return url.toString()
}

export function setInteractivity(link: string, isInteractive: boolean): string {
  const url = new URL(link)
  const searchParams = url.searchParams
  searchParams.set('i', isInteractive ? '1' : '0')
  url.search = searchParams.toString()
  return url.toString()
}

type CopyLinkOptions = {
  includeSeed?: boolean
  forceInteractive?: boolean
  mouseEvent?: MouseEvent
  baseUrl?: string
}
export function copyLink(link: string, options?: CopyLinkOptions): void {
  if (options?.mouseEvent && isRegularClick(options.mouseEvent)) {
    options.mouseEvent.preventDefault()
  }
  const url = new URL(link)
  const params = url.searchParams

  if (!options?.includeSeed) params.delete('alea')
  if (options?.forceInteractive) {
    params.forEach(function (value, key) {
      if (key === 'i' && value === '0') {
        params.set(key, '1')
      }
    })
  }
  const baseUrl = options?.baseUrl ?? TOPMATHS_BASE_URL
  copyToClipboard(baseUrl + params.toString())
}

export function copyToClipboard(str: string): void {
  navigator.clipboard.writeText(str).then(
    () => {
      showDialogForLimitedTime(
        'topmaths-info-dialog',
        1000,
        'Le lien a été copié.',
      )
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
      showDialogForLimitedTime(
        'topmaths-info-dialog',
        1000,
        "Le lien n'a pas pu être copié.",
      )
    },
  )
}
