import { TOPMATHS_BASE_URL } from './environment.js'
import { showDialogForLimitedTime } from '../../lib/components/dialogs.js'
import { isRegularClick } from './navigation'
export { normalizeExerciseInteractivity } from './urlShared.js'
import { normalizeExerciseInteractivity } from './urlShared.js'

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
export function buildCopiedLink(link: string, options?: CopyLinkOptions): string {
  if (options?.mouseEvent && isRegularClick(options.mouseEvent)) {
    options.mouseEvent.preventDefault()
  }
  const normalizedLink = options?.forceInteractive
    ? normalizeExerciseInteractivity(link, '1', true)
    : link
  const url = new URL(normalizedLink)
  const params = url.searchParams

  if (!options?.includeSeed) params.delete('alea')
  const baseUrl = options?.baseUrl ?? TOPMATHS_BASE_URL
  return baseUrl + params.toString()
}

export function copyLink(link: string, options?: CopyLinkOptions): void {
  copyToClipboard(buildCopiedLink(link, options))
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
