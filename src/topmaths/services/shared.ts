import { get } from 'svelte/store'
import type { Objective } from '../types/objective.js'
import type { UnitObjective } from '../types/unit.js'
import { isTitleAcademicPreferred } from './store.js'
import { TOPMATHS_BASE_URL } from './environment.js'
import { showDialogForLimitedTime } from '../../lib/components/dialogs.js'
import { isRegularClick } from './navigation'

export function normalize (str: string): string {
  if (str === undefined) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

export function removeSeed (link: string): string {
  const url = new URL(link)
  const searchParams = url.searchParams
  searchParams.delete('alea')
  url.search = searchParams.toString()
  return url.toString()
}

export function getTitle (objective: Objective | UnitObjective): string {
  if (get(isTitleAcademicPreferred) || !objective.title) {
    return objective.titleAcademic
  } else {
    return objective.title
  }
}

type CopyLinkOptions = {
  includeSeed?: boolean
  forceInteractive?: boolean
  mouseEvent?: MouseEvent
  baseUrl?: string
}
export function copyLink (link: string, options?: CopyLinkOptions): void {
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
  navigator.clipboard.writeText(baseUrl + params.toString())
  showDialogForLimitedTime('topmaths-info-dialog', 1000, 'Le lien a été copié.')
}
