import { describe, expect, it } from 'vitest'
import { getTopmathsStaticResource } from './staticResources'

describe('Topmaths static resources', () => {
  it('returns hydrated exam metadata', () => {
    expect(getTopmathsStaticResource('dnb_2021_06_etrangers_2')).toMatchObject({
      uuid: 'dnb_2021_06_etrangers_2',
      typeExercice: 'dnb',
      annee: '2021',
      mois: 'Juin',
      lieu: 'Centres étrangers',
      numeroInitial: '2',
    })
  })

  it('returns null for an unknown uuid', () => {
    expect(getTopmathsStaticResource('dnb_inconnu')).toBeNull()
  })
})
