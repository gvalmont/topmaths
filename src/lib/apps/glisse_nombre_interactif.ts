import GlisseNombreElement from 'glisse-nombre'
import { context } from '../../modules/context'

/**
 * Définit le customElement glisse-nombre
 */
if (customElements.get('glisse-nombre') === undefined) {
  customElements.define('glisse-nombre', GlisseNombreElement)
}

type GlisseNombreInteractifOptions = {
  number?: number // pour préremplir le nombre (par défaut 0)
  addZeros?: boolean // pour afficher les zéros automatiquement (par défaut à true)
  animation?: number // pour désactiver le déplacement manuel et animer une multiplication
  showCalculus?: boolean // pour afficher ✕ ou ÷ 10, 100... (par défaut à true)
  showComma?: boolean // pour afficher la virgule (par défaut à true)
}

/**
 * Retourne le code HTML pour afficher un glisse-nombre interactif
 * @param options - options pour personnaliser le glisse-nombre
 * @param options.number - le nombre à afficher (par défaut 0)
 * @param options.addZeros - pour afficher les zéros automatiquement (par défaut à true)
 * @param options.animation - pour désactiver le déplacement manuel et animer une multiplication (par défaut à 0)
 * @param options.showCalculus - pour afficher ✕ ou ÷ 10, 100... (par défaut à true)
 * @param options.showComma - pour afficher la virgule (par défaut à true)
 * @returns le code HTML du glisse-nombre interactif
 */
export function glisseNombreInteractif (options?: GlisseNombreInteractifOptions): string {
  if (!context.isHtml) {
    return '' // La sortie LaTeX n'est pas encore gérée
  }
  let optionsString: string = ''
  if (options) {
    if (options.number !== undefined) optionsString += `number="${options.number}" `
    if (options.addZeros !== undefined) optionsString += `add-zeros="${options.addZeros}" `
    if (options.animation !== undefined) optionsString += `animation="${options.animation}" `
    if (options.showCalculus !== undefined) optionsString += `show-calculus="${options.showCalculus}" `
    if (options.showComma !== undefined) optionsString += `show-comma="${options.showComma}" `
  }
  return `<glisse-nombre ${optionsString} ></glisse-nombre>`
}
