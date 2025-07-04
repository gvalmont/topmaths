import { exercicesParams, globalOptions } from '../lib/stores/generalStore'
import type TypeExercice from '../exercices/Exercice'
import type { InterfaceParams } from '../lib/types'

declare global {
  interface Window {
    _paq: any[];
    logDebug: number;
  }
}

window.logDebug = window.logDebug || 0
// pour pour pouvoir le déactiver en mode debug...
// eslint-disable-next-line prefer-const
let activeStats = (document.location.hostname === 'coopmaths.fr')

if (activeStats) {
  const _paq = window._paq = window._paq || []
  _paq.push(['trackPageView'])
  ;(function () {
    const u = '//ynh.coopmaths.fr/matomo/'
    _paq.push(['setTrackerUrl', u + 'matomo.php'])
    _paq.push(['setSiteId', '1'])
    const d = document
    const g = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    g.async = true; g.src = u + 'matomo.js'; if (s.parentNode) { s.parentNode.insertBefore(g, s) }
  })()
}

const url = new URL(window.location.href)
const debug = url.searchParams.get('log') === '3' || window.logDebug !== 0 ? 1 : 0
function log (message?: any, ...optionalParams: any[]) {
  if (debug) {
    console.info(message, ...optionalParams)
  }
}

function logDebug (message?: any, ...optionalParams: any[]) {
  if (debug > 1 || window.logDebug > 1) log('DEBUG:', message, ...optionalParams)
}

logDebug('Matomo loaded')

const paramExos : string[] = []
const uuids : string[] = []
const vue : string [] = ['']

function paraConvert (param: InterfaceParams) {
  const par: { nb?: number; uuid: string, t?: string, e?: string | number, c?: string, et?: string | number, s1?: string, s2?: string, s3?: string, s4?: string, s5?: string, a?: string, i?: string, s?: number } = { uuid: param.uuid }
  if (param.nbQuestions) par.nb = param.nbQuestions
  if (param.type) par.t = param.type
  if (param.exo) par.e = param.exo
  if (param.exoType) par.et = param.exoType
  if (param.cd) par.c = param.cd
  if (param.sup) par.s1 = param.sup.replace('true', 't').replace('false', 'f')
  if (param.sup2) par.s2 = param.sup2.replace('true', 't').replace('false', 'f')
  if (param.sup3) par.s3 = param.sup3.replace('true', 't').replace('false', 'f')
  if (param.sup4) par.s4 = param.sup4.replace('true', 't').replace('false', 'f')
  if (param.sup5) par.s5 = param.sup5.replace('true', 't').replace('false', 'f')
  if (param.alea) par.a = param.alea
  if (param.interactif) par.i = param.interactif
  if (param.bestScore) par.s = param.bestScore
  return par
}

globalOptions.subscribe((options) => {
  logDebug('globalOptions', options)

  if (options) {
    if (options.v === undefined) return // chargement du site
    if (vue[0] === (options.v || 'prof')) {
      logDebug('Pas de changement de vue')
      return
    }
    // nouvelle vue
    vue[0] = options.v || 'prof'
    log('vue', vue[0])
    if (window._paq) window._paq.push(['trackEvent', 'Vue', vue[0]])
    // if (window._paq) window._paq.push(['setCustomDimension', 1, vue[0]])
    if (window._paq && options.recorder) window._paq.push(['setCustomDimension', 1, options.recorder])

    for (let i = paramExos.length - 1; i >= 0; i--) {
      const parsedExo = JSON.parse(paramExos[i])
      if (window._paq) window._paq.push(['trackEvent', 'VueExo', vue[0] + '-' + parsedExo.uuid, paramExos[i]])
      log(vue[0] + '-' + parsedExo.uuid, 'par:', paramExos[i])
    }
  }
})

exercicesParams.subscribe((params) => {
  logDebug('exercicesParams', params)
  if (params) {
    // let newExos = false
    params.forEach((param) => {
      // on met à jour la liste des exercices
      if (uuids.includes(param.uuid)) {
        logDebug('Uuid déjà chargé:', param.uuid)
      } else {
        uuids.push(param.uuid)
        if (window._paq) window._paq.push(['trackEvent', 'Uuid', param.uuid])
        log('Uuids-' + param.uuid)
      }
      const par = paraConvert(param)
      if (paramExos.includes(JSON.stringify(par))) {
        logDebug('déjà chargé:', param.uuid)
      } else {
        paramExos.push(JSON.stringify(par))
        // if (window._paq) window._paq.push(['setCustomDimension', 2, par.uuid])
        if (window._paq && vue[0] !== '') window._paq.push(['trackEvent', 'VueExo', vue[0] + '-' + par.uuid, JSON.stringify(par)])
        if (vue[0] !== '') log(vue[0] + '-' + par.uuid, 'par:', JSON.stringify(par))
      }
    })
    // Supprimer les éléments qui ne sont pas dans la référence
    for (let i = paramExos.length - 1; i >= 0; i--) {
      if (!params.some(param => JSON.stringify(paraConvert(param)) === paramExos[i])) {
        const ele = paramExos.splice(i, 1)
        log('exercice supprimé', ele)
      }
    }
    logDebug('paramExos', paramExos)
    for (let i = uuids.length - 1; i >= 0; i--) {
      if (!params.some(param => param.uuid === uuids[i])) {
        const ele = uuids.splice(i, 1)
        log('uuid supprimé', ele)
      }
    }
    logDebug('uuids', uuids)
  }
})

export function statsTracker (exercise: TypeExercice, recorder:string, vue: string) {
  logDebug('Tracking stats...')
  if (window._paq) {
    window._paq.push(['trackEvent', 'CheckExo', vue + '-' + exercise.uuid + (recorder ? '-' + recorder : '')])
  }
  log(vue + '-' + exercise.uuid, 'CheckExo', (recorder ? '-' + recorder : ''))
}
