import { get } from 'svelte/store'
import type { Objective } from '../types/objective.js'
import type { UnitObjective } from '../types/unit.js'
import { isTitleAcademicPreferred } from './store.js'
import { COOPMATHS_BASE_URL } from './environment.js'
import { showDialogForLimitedTime } from '../../lib/components/dialogs.js'

export function isCoopmaths (link: string): boolean {
  return link.slice(0, COOPMATHS_BASE_URL.length) === COOPMATHS_BASE_URL
}

export function isDevMode (): boolean {
  return window.location.href.slice(0, 'http://localhost'.length) === 'http://localhost'
}

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

export function copyLink (link: string, includeSeed = true, forceInteractive = false): void {
  const url = new URL(link)
  const params = url.searchParams

  if (!includeSeed) params.delete('alea')
  if (forceInteractive) {
    params.forEach(function (value, key) {
      if (key === 'i' && value === '0') {
        params.set(key, '1')
      }
    })
  }
  navigator.clipboard.writeText(COOPMATHS_BASE_URL + params.toString())
  showDialogForLimitedTime('topmaths-info-dialog', 1000, 'Le lien a été copié.')
}
