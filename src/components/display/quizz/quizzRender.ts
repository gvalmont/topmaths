import { mathaleaRenderDiv } from '../../../lib/mathalea'

/**
 * Rend le HTML MathALÉA (KaTeX, figures SVG, scratch) dans le conteneur,
 * puis retire le `font-size` inline posé par `resizeContent`
 * (src/lib/components/sizeTools.ts) : ce style inline écraserait la
 * typographie fluide des classes `.quizz-text-*` (clamp en cqw).
 * Les figures restent redimensionnées au zoom courant (1 par défaut).
 */
export function quizzRenderDiv(div: HTMLElement | null): void {
  mathaleaRenderDiv(div)
  if (div != null) div.style.fontSize = ''
}
