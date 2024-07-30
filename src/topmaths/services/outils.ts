import { get } from 'svelte/store'
import type { Objective } from '../types/objective'
import type { UnitObjective } from '../types/unit'
import { isTitleAcademicPreferred } from './store'
import { COOPMATHS_BASE_URL } from './environment'
import { exercicesParams, globalOptions } from '../../lib/stores/generalStore'
import { showDialogForLimitedTime } from '../../lib/components/dialogs'

export function isCoopmaths (url: string): boolean {
  const urlCoopmaths = COOPMATHS_BASE_URL
  return url.slice(0, urlCoopmaths.length) === COOPMATHS_BASE_URL
}

export function normaliser (chaine: string): string {
  if (chaine === undefined) return ''
  return chaine
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

export function isDevMode () {
  return window.location.href.slice(0, 'http://localhost'.length) === 'http://localhost'
}

export function supprimerGraines (lien: string): string {
  const url = new URL(lien)
  const searchParams = url.searchParams
  searchParams.delete('alea')
  url.search = searchParams.toString()
  return url.toString()
}

export function getTitre (objectif: Objective | UnitObjective): string {
  if (get(isTitleAcademicPreferred) || objectif.titleAcademic === undefined || objectif.titleAcademic === '') {
    return objectif.titleAcademic
  } else {
    return objectif.titleAcademic
  }
}

export function getTheme (reference: string): 'nombres' | 'gestion' | 'gestionbis' | 'grandeurs' | 'geo' | 'algo' {
  const lettre = reference.slice(1, 2)
  if (lettre === 'C' || lettre === 'N') return 'nombres'
  if (lettre === 'G') return 'geo'
  if (lettre === 'M') return 'grandeurs'
  if (lettre === 'P' || lettre === 'S') return 'gestion'
  console.warn('Thème lié à la référence ' + reference + ' non trouvé')
  return 'nombres'
}

export function copierLien (lien: string, inclureAlea = true, forcerInteractif = false) {
  const url = new URL(lien)
  const params = url.searchParams

  if (!inclureAlea) params.delete('alea')
  if (forcerInteractif) {
    params.forEach(function (value, key) {
      if (key === 'i' && value === '0') {
        params.set(key, '1')
      }
    })
  }
  console.log(COOPMATHS_BASE_URL)
  let lienModifie = COOPMATHS_BASE_URL
  lienModifie += params.toString()

  navigator.clipboard.writeText(lienModifie)
  showDialogForLimitedTime('topmathsDialog', 1000, 'Le lien a été copié.')
}

export function creerLienPageActuelle () {
  const url = new URL(window.location.href.split('?')[0])
  for (const ex of get(exercicesParams)) {
    url.searchParams.append('uuid', ex.uuid)
    if (ex.id !== undefined) url.searchParams.append('id', ex.id)
    if (ex.nbQuestions !== undefined) url.searchParams.append('n', ex.nbQuestions.toString())
    if (ex.duration !== undefined) url.searchParams.append('d', ex.duration.toString())
    if (ex.sup !== undefined) url.searchParams.append('s', ex.sup)
    if (ex.sup2 !== undefined) url.searchParams.append('s2', ex.sup2)
    if (ex.sup3 !== undefined) url.searchParams.append('s3', ex.sup3)
    if (ex.sup4 !== undefined) url.searchParams.append('s4', ex.sup4)
    if (ex.alea !== undefined) url.searchParams.append('alea', ex.alea)
    if (ex.interactif === '1') url.searchParams.append('i', '1')
    if (ex.cd !== undefined) url.searchParams.append('cd', ex.cd)
    if (ex.cols !== undefined) url.searchParams.append('cols', ex.cols.toString())
  }
  if (get(globalOptions).v === 'eleve') {
    url.searchParams.append('v', 'eleve')
  }
  if (get(globalOptions).v === 'diaporama') {
    url.searchParams.append('v', 'diaporama')
    url.searchParams.append('selectedExercises', '{"isActive"%3Afalse%2C"indexes"%3A[0]}')
    url.searchParams.append('questionsOrder', '{"isQuestionsShuffled"%3Afalse%2C"indexes"%3A[]}')
  }
  return url.toString()
}
