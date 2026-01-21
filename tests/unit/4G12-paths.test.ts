import { describe, expect, it } from 'vitest'
import { CHEMINS_PREDEFINIS } from '../../src/exercices/4e/_4G12-paths'

const mouvementsValides = new Set([1, -1, 6, -6])

const estDansLaGrille = (n: number) => n >= 0 && n <= 28 && n % 6 !== 5

describe('CHEMINS_PREDEFINIS', () => {
  it('doivent être des chemins simples et valides pour chaque longueur', () => {
    for (const [longueurStr, chemins] of Object.entries(CHEMINS_PREDEFINIS)) {
      const longueur = Number(longueurStr)
      const dejaVus = new Set<string>()

      chemins.forEach((chemin, index) => {
        expect(chemin[0]).toBe(0)
        expect(chemin[chemin.length - 1]).toBe(28)
        expect(chemin.length - 1).toBe(longueur)

        // Pas de case répétée
        expect(new Set(chemin).size).toBe(chemin.length)

        chemin.forEach((caseId) => {
          expect(estDansLaGrille(caseId)).toBe(true)
        })

        for (let i = 1; i < chemin.length; i++) {
          const precedent = chemin[i - 1]
          const courant = chemin[i]
          const delta = courant - precedent

          expect(mouvementsValides.has(delta)).toBe(true)
          if (Math.abs(delta) === 1) {
            // Déplacement vertical : reste dans la même colonne (numérotation +1/-1)
            expect(Math.floor(precedent / 6)).toBe(Math.floor(courant / 6))
          }
        }

        const signature = chemin.join(',')
        expect(dejaVus.has(signature)).toBe(false)
        dejaVus.add(signature)
      })

      expect(dejaVus.size).toBe(chemins.length)
    }
  })
})
