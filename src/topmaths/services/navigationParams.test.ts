import { describe, expect, it } from 'vitest'
import { getNavigationParamsFromUrl } from './navigationParams'

describe('topmaths navigation params', () => {
  it('opens the filtered classroom URL on the curriculum page', () => {
    const params = getNavigationParamsFromUrl(
      new URL('https://topmaths.fr/?v=classroom&grade=3e&term=0'),
    )

    expect(params.view).toBe('classroom')
    expect(params.reference).toBe('curriculum')
  })

  it('keeps the classroom landing page when no curriculum filter is present', () => {
    const params = getNavigationParamsFromUrl(
      new URL('https://topmaths.fr/?v=classroom'),
    )

    expect(params.reference).toBe('')
  })

  it('does not override an explicit classroom sub-page', () => {
    const params = getNavigationParamsFromUrl(
      new URL('https://topmaths.fr/?v=classroom&ref=mathador&grade=3e&term=0'),
    )

    expect(params.reference).toBe('mathador')
  })
})
