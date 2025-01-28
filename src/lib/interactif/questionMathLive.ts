import { context } from '../../modules/context'
import { sp } from '../outils/outilString'
import { buildDataKeyboardFromStyle } from './claviers/keyboard'
import './champTexte.scss'
import type Exercice from '../../exercices/Exercice'
import { handleAnswers, type ReponseParams, type Valeur } from './gestionInteractif'
import type { interactivityType, TableauMathliveType } from '../types'
import { AddTabDbleEntryMathlive, AddTabPropMathlive, type ItabDbleEntry, type Itableau } from './tableaux/AjouteTableauMathlive'

const buildDataKeyboardString = (style = '') => {
  const blocks = buildDataKeyboardFromStyle(style)
  return blocks.join(' ')
}

/**
 * Une question pour rassembler les ajouteChampTexte et Cie et les handleHanswers.
 * Il faudrait pouvoir fournir autre chose que objetReponse.
 * Un truc du style :
 * [{id: 'reponse', value: 'valeur', compare: fonctionComparaison, options: {}},
 * {id: 'reponse2', value: 'valeur2', compare: fonctionComparaison, options: {}},
 * {id: 'reponse3', value: 'valeur3', compare: fonctionComparaison, options: {}}]
 * qui alimentera objetReponse.
 * ou alors, on fait un type conditionnel sur objetReponse...
 * C'est balaize à faire, mais ce serait mieux : on ouvre l'accolade, et si on commence à taper rep... il ouvre l'accolade, demande value, demande compare, demande options... idem si on commence à taper champ1....
 * @author Jean-Claude Lhote
 * @param {Exercice} exercice
 * @param {number} question
 * @param {Valeur} objetReponse
 * @param {ReponseParams} reponseParams
 * @param {interactivityType} typeInteractivite
 * @param {string} content
 * @param {string} classe
 * @param {ItabDbleEntry | Itableau} tableau
 * @param {TableauMathliveType} typeTableau
 * @param {string} texteAvant
 * @param {string} texteApres
 * @param {boolean} blocCenter
 * @param {boolean} espace
 * @returns string
 */
export function ajouteQuestionMathlive ({ exercice, question, objetReponse, reponseParams, typeInteractivite, content = '', classe = '', tableau, typeTableau = 'doubleEntree', texteAvant = '', texteApres = '', blocCenter = false, espace = false }:
{ exercice: Exercice, question: number, objetReponse: Valeur, reponseParams?: ReponseParams, typeInteractivite: interactivityType, content?: string, classe?: string, tableau?: ItabDbleEntry | Itableau, typeTableau?: TableauMathliveType, texteAvant?: string, texteApres?: string, blocCenter?: boolean, espace?: boolean }
) {
  if (context.isHtml && exercice.interactif) {
    if (!(typeInteractivite === 'mathlive' || typeInteractivite === 'remplisLesBlancs' || typeInteractivite === 'tableauMathlive' || typeInteractivite === 'texte')) {
      window.notify(`Type d'interactivité ${typeInteractivite} non reconnu. Exercice ${exercice.id} ${exercice.uuid}`, { typeInteractivite })
      return ''
    }
    if (reponseParams === undefined) {
      reponseParams = { formatInteractif: 'mathlive' }
    }
    handleAnswers(exercice, question, objetReponse, reponseParams)
    switch (typeInteractivite) {
      case 'remplisLesBlancs':
        return remplisLesBlancs(exercice, question, content, '\\ldots')
      case 'tableauMathlive':{
        if (!tableau) {
          window.notify(`Tableau non défini pour l'interactivité tableauMathlive. Exercice ${exercice.id} ${exercice.uuid}`, { typeInteractivite })
          return ''
        }
        const leTableau = (typeTableau === 'doubleEntree')
          ? AddTabDbleEntryMathlive.create(exercice.numeroExercice ?? 0, question, tableau as ItabDbleEntry, classe, true, { texteAvant, texteApres, blocCenter: blocCenter ? ' bloccenter' : '', espace: espace ? ' ' : '' })
          : AddTabPropMathlive.create(exercice.numeroExercice ?? 0, question, tableau as Itableau, classe, true, { texteAvant, texteApres, blocCenter: blocCenter ? ' bloccenter' : '', espace: espace ? ' ' : '' })
        return leTableau.output
      }
      case 'texte':
        return ajouteChampTexte(exercice, question, classe, { texteAvant, texteApres, blocCenter, espace })
      default:
        return ajouteChampTexteMathLive(exercice, question, classe, { texteAvant, texteApres, blocCenter, espace })
    }
  }
  return ''
}

/**
 * Retourne le code html d'un div prévu pour le feedback toute forme d'interactivité.
 * @param {Exercice} exercice
 * @param {number} question
 * @param {string} style
 * @deprecated si vous l'utilisez après ajouteChampTexteMathlive, ajouteChampTexte ou remplisLesBlancs, vous n'avez pas besoin de l'utiliser, il est ajouté automatiquement.
 */
export function ajouteFeedback (exercice: Exercice, question: number, style = 'style="display: none"') {
  if (!context.isHtml) return ''
  const exo = exercice.numeroExercice
  if (exercice == null || typeof exo !== 'number' || typeof question !== 'number') return ''
  return `<div class ="ml-2 py-2 italic text-coopmaths-warn-darkest dark:text-coopmathsdark-warn-darkest" id="feedbackEx${exo}Q${question}" ${style !== '' ? style : ''}></div>`
}
export function ajouteChampTexte (exercice: Exercice, i: number, style = '', {
  texteApres = '',
  texteAvant = '',
  blocCenter = false,
  // tailleExtensible = false,
  espace = false
} = {}) {
  if (texteApres !== '') texteApres = sp() + texteApres
  if (context.isHtml && exercice.interactif) {
    if (typeof style !== 'string') {
      window.notify(`style doit être une chaîne de caractères. Exercice ${exercice.id} ${exercice.uuid}`, { style })
    }
    if (style.includes('blocCenter')) blocCenter = true
    const dataKeyboard = buildDataKeyboardString(typeof (style) === 'string' ? style : '')
    let html = ''
    if (style === 'none') return ''
    if (style === '') {
      html = `<label>${texteAvant}</label><input data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></input>${texteApres ? `<span>${texteApres}</span>` : ''}<span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    // } else if (tailleExtensible) {
    //  html = `<label>${sp()}${texteAvant}${sp()}</label><table style="text-align:center;font-family:Arial,Times,serif;display:inline;height:1px;"><tr><td style="position: relative; display: inline;padding:0 0;margin:0"><input data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''}  class="${style}" virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></input>${texteApres ? `<span>${texteApres}</span>` : ''} </td></tr></table><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else if (blocCenter) {
      html = `<div style='display: flex;justify-content: center; margin:5px;'><label>${texteAvant}</label><input data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></input>${texteApres ? `<span>${texteApres}</span>` : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span><div>`
    } else html = `<label>${texteAvant}</label><input data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></input>${texteApres ? `<span>${texteApres}</span>` : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    html += ajouteFeedback(exercice, i)// `<div id="feedbackEx${exercice.numeroExercice}Q${i}"></div>`
    return html
  }
  return ''
}

export function ajouteChampTexteMathLive (exercice: Exercice, i:number, style = '', {
  texteApres = '',
  texteAvant = '',
  blocCenter = false,
  // tailleExtensible = false,
  espace = false
} = {}) {
  if (texteApres !== '') texteApres = sp() + texteApres
  if (context.isHtml && exercice.interactif) {
    if (typeof style !== 'string') {
      window.notify(`style doit être une chaîne de caractères. Exercice ${exercice.id} ${exercice.uuid}`, { style })
    }
    if (style.includes('blocCenter')) blocCenter = true
    const dataKeyboard = buildDataKeyboardString(typeof (style) === 'string' ? style : '')
    let html = ''
    if (style === 'none') return ''
    if (style === '') {
      html = `<label>${texteAvant}</label><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? `<span>${texteApres}</span>` : ''}<span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    // } else if (tailleExtensible) {
    //  html = `<label>${sp()}${texteAvant}${sp()}</label><table style="text-align:center;font-family:Arial,Times,serif;display:inline;height:1px;"><tr><td style="position: relative; display: inline;padding:0 0;margin:0"><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''}  class="${style}" virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? `<span>${texteApres}</span>` : ''} </td></tr></table><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else if (blocCenter) {
      html = `<div style='display: flex;justify-content: center; margin:5px;'><label>${texteAvant}</label><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? `<span>${texteApres}</span>` : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span><div>`
    } else html = `<label>${texteAvant}</label><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? `<span>${texteApres}</span>` : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    html += ajouteFeedback(exercice, i)// `<div id="feedbackEx${exercice.numeroExercice}Q${i}"></div>`
    return html
  }
  return ''
}

export function remplisLesBlancs (exercice:Exercice, question:number, content:string, classes = '', blanc = '\\ldots') {
  let mfeValue = ''
  let resteContent = content
  while (resteContent) {
    const chunks = /^(.*?)%\{([^}]+)}(.*?)$/.exec(resteContent)
    if (chunks) {
      const [, start, n, end] = chunks
      const name = n
      if (name == null) throw Error(`Définition de ${name} manquante`)
      mfeValue += start
      if (exercice.interactif) {
        mfeValue += `\\placeholder[${name}]{}`
      } else {
        mfeValue += blanc
      }
      resteContent = end ?? ''
    } else {
      mfeValue += resteContent
      resteContent = ''
    }
  }
  if (exercice.interactif && context.isHtml) {
    const dataKeyboard = buildDataKeyboardString(classes)
    let classe = ''
    if (classes !== '') {
      if (classes === 'fillInTheBlank' || classes === 'fillInTheBlanks') classe = 'fillInTheBlanks'
      else classe = ['fillInTheBlanks', ...classes.split(' ').filter(el => el !== 'fillInTheBlank' && el !== 'fillInTheBlanks')].join(' ')
    } else {
      classe = 'fillInTheBlanks'
    }
    return `<math-field data-keyboard="${dataKeyboard}" virtual-keyboard-mode=manual readonly class="${classe}" id="champTexteEx${exercice.numeroExercice}Q${question}">${mfeValue}</math-field><span id="resultatCheckEx${exercice.numeroExercice}Q${question}"></span>${ajouteFeedback(exercice, question)}`
  }
  if (mfeValue === '') return ''
  return `$${mfeValue}$`
}
