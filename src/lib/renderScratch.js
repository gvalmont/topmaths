import scratchblocks from 'scratchblocks'
import scratchFr from '../json/scratchFr.json'

export default function renderScratch(selector = '') {
  // Exécuter 2 fois le rendu sur un même élément <pre> semble buguer
  // Donc le sélectionneur css ne cible que l'exercice en cours
  // pour ne pas altérer les rendus des autres exercices
  if (selector !== '') selector = selector + ' '
  scratchblocks.loadLanguages({ fr: scratchFr })
  if (document.querySelector(`${selector}pre.blocks`)) {
    scratchblocks.renderMatching(`${selector}pre.blocks`, {
      style: 'scratch3',
      languages: ['fr'],
      scale: 0.7,
    })
    // Le code est rendu dans un svg enfant de pre.blocks
    // Quand le render passe une 2e fois, il essaie de rendre le code svg d'où le bug
    // Donc une fois le code rendu, on enlève la classe blocks pour ne plus le sélectionner
    document
      .querySelectorAll(`${selector}pre.blocks`)
      .forEach((el) => el.classList.remove('blocks'))
  }
  if (document.querySelector(`${selector}code.b`)) {
    scratchblocks.renderMatching(`${selector}code.b`, {
      inline: true,
      style: 'scratch3',
      languages: ['fr'],
      scale: 0.7,
    })
  }

  // POUR GERER LE ZOOM
  const elts = document.querySelectorAll(`${selector}pre.blocks2`)
  const scales = new Set()
  elts.forEach((ele) => {
    const scale = Number(ele.getAttribute('scale'))
    scales.add(scale)
  })
  scales.forEach((scale) => {
    scratchblocks.renderMatching(`${selector}pre.blocks2[scale="${scale}"]`, {
      style: 'scratch3',
      languages: ['fr'],
      scale,
    })
    document
      .querySelectorAll(`${selector}pre.blocks2[scale="${scale}"]`)
      .forEach((el) => el.classList.remove('blocks2'))
  })
}

/**
 *
 * @param {HTMLElement} root
 */
export function renderScratchDiv(root = document.body) {
  scratchblocks.loadLanguages({ fr: scratchFr })

  // === RENDU DES BLOCS MULTILIGNES ===
  const preBlocks = root.querySelectorAll('pre.blocks')
  if (preBlocks.length > 0) {
    preBlocks.forEach((el) => el.setAttribute('data-sb', ''))
    scratchblocks.renderMatching('pre.blocks[data-sb] ', {
      style: 'scratch3',
      languages: ['fr'],
      scale: 0.7,
    })
    preBlocks.forEach((el) => el.removeAttribute('data-sb'))

    // Empêcher un second rendu
    preBlocks.forEach((el) => el.classList.remove('blocks'))
  }

  // === RENDU INLINE ===
  const inlineBlocks = root.querySelectorAll('code.b')
  if (inlineBlocks.length > 0) {
    inlineBlocks.forEach((el) => el.setAttribute('data-si', ''))
    scratchblocks.renderMatching('code.b[data-si]', {
      inline: true,
      style: 'scratch3',
      languages: ['fr'],
      scale: 0.7,
    })
    inlineBlocks.forEach((el) => el.removeAttribute('data-si'))
  }

  // === GESTION DU ZOOM (blocks2 avec scale variable) ===
  const elts = root.querySelectorAll('pre.blocks2')
  if (elts.length > 0) {
    elts.forEach((el) => el.setAttribute('data-sb2', ''))
    const scales = new Set()

    elts.forEach((el) => {
      const scaleAttr = el.getAttribute('scale')
      if (scaleAttr) {
        const scale = Number(scaleAttr)
        if (!Number.isNaN(scale)) scales.add(scale)
      }
    })

    scales.forEach((scale) => {
      const targets = root.querySelectorAll(
        `pre.blocks2[data-sb2][scale="${scale}"]`,
      )

      scratchblocks.renderMatching(`pre.blocks2[data-sb2][scale="${scale}"]`, {
        style: 'scratch3',
        languages: ['fr'],
        scale,
      })
      targets.forEach((el) => el.removeAttribute('data-sb2'))
      targets.forEach((el) => el.classList.remove('blocks2'))
    })
  }
}
