import { describe, expect, it } from 'vitest'
import { EchiquierProblemeElement } from '../../src/lib/customElements/EchiquierProblemeElement'
import { setOutputHtml } from '../../src/modules/context'

describe('EchiquierProblemeElement', () => {
  it("renseigne le type d'echiquier et l'operation en mode correction", async () => {
    setOutputHtml()
    document.body.innerHTML = EchiquierProblemeElement.create({
      numeroExercice: 1,
      questionIndex: 0,
      interactivityOn: false,
      expectedRows: ['Prix total'],
      expectedColumns: ['Courses'],
      rowChoices: ['Prix total'],
      columnChoices: ['Courses'],
      cells: [{ row: 'Prix total', column: 'Courses', value: '8 €' }],
      expectedStructure: 'ligne',
      expectedOperation: 'addition',
      cellFillMode: 'correction',
    })

    const echiquier = document.querySelector(
      'echiquier-probleme',
    ) as EchiquierProblemeElement
    const analysisSelects = [
      ...echiquier.shadowRoot!.querySelectorAll<HTMLSelectElement>(
        '.analysis select',
      ),
    ]

    expect(analysisSelects.map((select) => select.value)).toEqual([
      'ligne',
      'addition',
    ])
  })

  it('attribue les points par groupes de verification', () => {
    setOutputHtml()
    const answer = {
      expectedRows: ['Prix unitaire', 'Masse totale', 'Prix total'],
      expectedColumns: ['Pommes'],
      rowChoices: ['Prix unitaire', 'Masse totale', 'Prix total'],
      columnChoices: ['Pommes'],
      cells: [
        { row: 'Prix unitaire', column: 'Pommes', value: '2 €/kg' },
        { row: 'Masse totale', column: 'Pommes', value: '3 kg' },
        { row: 'Prix total', column: 'Pommes', value: '6 €' },
      ],
      expectedGreyedRows: ['Prix unitaire'],
      expectedGreyedColumns: [],
      expectedStructure: 'colonne',
      expectedOperation: 'multiplication',
      cellFillMode: 'student',
      simplificationMode: 'grey',
    } as const
    document.body.innerHTML = EchiquierProblemeElement.create({
      numeroExercice: 1,
      questionIndex: 0,
      ...answer,
    })
    const echiquier = document.querySelector(
      'echiquier-probleme',
    ) as EchiquierProblemeElement
    echiquier.value = {
      rowHeaders: [...answer.expectedRows],
      columnHeaders: [...answer.expectedColumns],
      cellValues: {
        '0:0': '2 €/kg',
        '1:0': '3 kg',
        '2:0': '6 €',
      },
      greyedRows: ['Prix unitaire'],
      greyedColumns: [],
      structure: 'colonne',
      operation: 'multiplication',
    }
    const exercice = {
      id: 'test',
      numeroExercice: 1,
      autoCorrection: [
        { valeur: { reponse: { value: JSON.stringify(answer) } } },
      ],
    }

    const result = EchiquierProblemeElement.verifQuestion(exercice as never, 0)

    expect(result.score).toEqual({ nbBonnesReponses: 5, nbReponses: 5 })
    expect(
      EchiquierProblemeElement.pointsMaxQuestion(exercice as never, 0),
    ).toBe(5)
  })
})
