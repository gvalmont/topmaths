import { describe, expect, it } from 'vitest'

import { mathaleaEnsureAMCCompatibility } from './amcInference'
import { exportQcmAmc } from './creerDocumentAmc'

function exercise(overrides: Record<string, unknown>) {
  return {
    titre: 'Exercice de test',
    nbQuestions: 1,
    autoCorrection: [],
    listeQuestions: ['Énoncé LaTeX'],
    listeCorrections: ['Correction LaTeX'],
    questionJamaisPosee: () => true,
    reinit: () => {},
    nouvelleVersion: () => {},
    ...overrides,
  } as any
}

describe('inférence AMC depuis formatInteractif', () => {
  it.each(['qcm', 'mathalea-qcm'])(
    'conserve toutes les propositions du format QCM %s',
    (formatInteractif) => {
      const exercice = exercise({
        interactifType: formatInteractif,
        autoCorrection: [
          {
            enonce: 'Choisir.',
            formatInteractif,
            propositions: [
              { texte: 'A', statut: true },
              { texte: 'B', statut: false },
              { texte: 'C', statut: true },
            ],
          },
        ],
      })

      mathaleaEnsureAMCCompatibility(exercice)

      expect(exercice.amcReady).toBe(true)
      expect(exercice.amcType).toBe('qcmMult')
      expect(exercice.autoCorrectionAMC[0].propositions).toHaveLength(3)
      expect(
        exercice.autoCorrectionAMC[0].propositions.map(
          (proposition: any) => proposition.statut,
        ),
      ).toEqual([true, false, true])
    },
  )

  it('détecte un QCM moderne même sans interactifType au niveau exercice', () => {
    const exercice = exercise({
      autoCorrection: [
        {
          formatInteractif: 'mathalea-qcm',
          propositions: [
            { texte: 'Vrai', statut: true },
            { texte: 'Faux', statut: false },
          ],
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('qcmMono')
    expect(exercice.autoCorrectionAMC[0].enonce).toBe('Énoncé LaTeX')
  })

  it('choisit qcmMult si une question quelconque a plusieurs bonnes réponses', () => {
    const exercice = exercise({
      nbQuestions: 2,
      interactifType: 'qcm',
      listeQuestions: ['Q1', 'Q2'],
      listeCorrections: ['C1', 'C2'],
      autoCorrection: [
        {
          formatInteractif: 'qcm',
          propositions: [
            { texte: 'A', statut: true },
            { texte: 'B', statut: false },
          ],
        },
        {
          formatInteractif: 'qcm',
          propositions: [
            { texte: 'A', statut: true },
            { texte: 'B', statut: true },
            { texte: 'C', statut: false },
          ],
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('qcmMult')
    expect(exercice.autoCorrectionAMC).toHaveLength(2)
  })

  it('ne laisse pas disparaître une question QCM sans autoCorrection', () => {
    const exercice = exercise({
      nbQuestions: 2,
      interactifType: 'qcm',
      listeQuestions: ['Q1', 'Q2'],
      listeCorrections: ['C1', 'C2'],
      autoCorrection: [
        {
          formatInteractif: 'qcm',
          propositions: [
            { texte: 'A', statut: true },
            { texte: 'B', statut: false },
          ],
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCOpen')
    expect(exercice.autoCorrectionAMC).toHaveLength(2)
    expect(exercice.autoCorrectionAMC.map((item: any) => item.enonce)).toEqual([
      'Q1',
      'Q2',
    ])
  })

  it.each(['mathlive', 'mathalea-mathfield', 'calcul'])(
    'infère AMCNum pour une réponse numérique au format %s',
    (formatInteractif) => {
      const exercice = exercise({
        interactifType: 'mathLive',
        autoCorrection: [
          {
            formatInteractif,
            valeur: { reponse: { value: 12.5 } },
          },
        ],
      })

      mathaleaEnsureAMCCompatibility(exercice)

      expect(exercice.amcType).toBe('AMCNum')
      expect(exercice.autoCorrectionAMC[0].reponse.valeur).toBe(12.5)
    },
  )

  it('complète un AMCNum explicite depuis autoCorrection sans effacer sa source', () => {
    const source = {
      formatInteractif: 'mathlive',
      valeur: { reponse: { value: 17 } },
    }
    const exercice = exercise({
      amcReady: true,
      amcType: 'AMCNum',
      interactifType: 'mathLive',
      autoCorrection: [source],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCNum')
    expect(exercice.autoCorrection[0]).toBe(source)
    expect(exercice.autoCorrectionAMC[0].reponse.valeur).toBe(17)
  })

  it('replie en AMCOpen un AMCNum explicite dont la réponse est ambiguë', () => {
    const exercice = exercise({
      amcReady: true,
      amcType: 'AMCNum',
      interactifType: 'mathLive',
      autoCorrection: [
        {
          formatInteractif: 'mathlive',
          valeur: { reponse: { value: ['1', '2'] } },
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCOpen')
    expect(exercice.autoCorrectionAMC[0].propositions[0].statut).toBe(3)
  })

  it.each(['multi-mathfield', 'fill-in-the-blank', 'tableau-mathlive'])(
    'infère AMCHybride pour plusieurs champs numériques au format %s',
    (formatInteractif) => {
      const exercice = exercise({
        interactifType: formatInteractif,
        autoCorrection: [
          {
            formatInteractif,
            valeur: {
              champ1: { value: 4 },
              champ2: { value: -2.5 },
            },
          },
        ],
      })

      mathaleaEnsureAMCCompatibility(exercice)

      expect(exercice.amcType).toBe('AMCHybride')
      expect(exercice.autoCorrectionAMC[0].propositions).toHaveLength(2)
      expect(
        exercice.autoCorrectionAMC[0].propositions.map(
          (block: any) => block.propositions[0].reponse.valeur,
        ),
      ).toEqual([4, -2.5])
    },
  )

  it('refuse une inférence numérique partielle dans un multi-mathfield', () => {
    const exercice = exercise({
      interactifType: 'multi-mathfield',
      autoCorrection: [
        {
          formatInteractif: 'multi-mathfield',
          valeur: {
            champ1: { value: 4 },
            champ2: { value: 'x+1' },
          },
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCOpen')
  })

  it('ne choisit pas arbitrairement une réponse parmi plusieurs valeurs acceptées', () => {
    const exercice = exercise({
      interactifType: 'mathLive',
      autoCorrection: [
        {
          formatInteractif: 'mathlive',
          valeur: { reponse: { value: [0.5, '\\frac{1}{2}'] } },
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCOpen')
  })

  it('utilise AMCOpen pour un format non transposable sans altérer autoCorrection', () => {
    const source = {
      formatInteractif: 'svg-selection',
      valeur: { reponse: { value: '[1,2]' } },
    }
    const exercice = exercise({
      interactifType: 'svg-selection',
      autoCorrection: [source],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCOpen')
    expect(exercice.autoCorrection[0]).toBe(source)
    expect(exercice.autoCorrectionAMC[0]).toMatchObject({
      enonce: 'Énoncé LaTeX',
      propositions: [
        {
          texte: 'Correction LaTeX',
          statut: 3,
          pointilles: true,
        },
      ],
    })
  })

  it.each([
    'texte',
    'liste-deroulante',
    'cliqueFigure',
    'clique-figure',
    'points-cliquables',
    'objets-cliquables',
    'fraction-cliquable',
    'mathalea-labyrinthe',
    'echiquier-probleme',
    'dnd',
    'drag-and-drop',
    'custom',
    'meta-custom',
    'my-spreadsheet',
    'MetaInteractif2d',
    'meta-interactif-2d',
    'svg-selection',
    'trigo-circle-selection',
    'interactive-clock',
    'guide-ane',
    'demi-droite-interactive',
    'blockly-editor',
    'scratch-editor',
    'tableau-signes-variations',
    'mathalea-textfield',
    'tableau-hybride',
    'mathalea-couteau-suisse',
    'mathalea-branching-qcm',
    'alea-iep-editeur',
    'relier-etiquettes',
    'diagram-builder',
    'diagram-pie-assessment',
    'diagram-bar-assessment',
    'diagram-histogram-assessment',
    'diagram-cartesian-assessment',
    'format-inconnu',
  ])('conserve le format non transposable %s sous forme AMCOpen', (format) => {
    const exercice = exercise({
      interactifType: format,
      autoCorrection: [
        {
          formatInteractif: format,
          valeur: { reponse: { value: 'réponse interactive' } },
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcReady).toBe(true)
    expect(exercice.amcType).toBe('AMCOpen')
    expect(exercice.autoCorrectionAMC[0]).toMatchObject({
      enonce: 'Énoncé LaTeX',
      propositions: [
        expect.objectContaining({
          texte: 'Correction LaTeX',
          statut: 3,
        }),
      ],
    })
  })

  it('ne confond pas une ancienne structure AMCOpen avec un QCM', () => {
    const exercice = exercise({
      autoCorrection: [
        {
          enonce: 'Démontrer.',
          propositions: [
            { texte: 'Correction', statut: 3, pointilles: true },
            { texte: 'Barème alternatif', statut: 1, pointilles: false },
          ],
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)

    expect(exercice.amcType).toBe('AMCOpen')
  })

  it('rend le contrat fallback avec énoncé, zone de travail et cases de notation', () => {
    const exercice = exercise({
      id: 'FALLBACK',
      interactifType: 'drag-and-drop',
      autoCorrection: [
        {
          formatInteractif: 'drag-and-drop',
          valeur: { reponse: { value: 'état dynamique' } },
        },
      ],
    })

    mathaleaEnsureAMCCompatibility(exercice)
    const [latex] = exportQcmAmc(exercice, 0)

    expect(latex).toContain('Énoncé LaTeX')
    expect(latex).toContain('Correction LaTeX')
    expect(latex).toContain('\\notation{3}[false][true]')
  })
})
