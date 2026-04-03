import { beforeEach, describe, expect, it } from 'vitest'
import { buildUrlFromParams } from './mathalea'
import { isTeacherMode } from './store'
import { buildCopiedLink, normalizeExerciseInteractivity } from './url'

describe('topmaths interactivity urls', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '?v=home')
    isTeacherMode.set(false)
  })

  it('defaults each exercise to i=1 outside teacher mode', () => {
    const url = buildUrlFromParams('exercise' as any, [
      { uuid: 'a', id: 'A' },
      { uuid: 'b', id: 'B' },
    ])

    expect(url.toString()).toContain('uuid=a&id=A&i=1')
    expect(url.toString()).toContain('uuid=b&id=B&i=1')
  })

  it('defaults each exercise to i=0 in teacher mode', () => {
    isTeacherMode.set(true)

    const url = buildUrlFromParams('exercise' as any, [
      { uuid: 'a', id: 'A' },
      { uuid: 'b', id: 'B' },
    ])

    expect(url.toString()).toContain('uuid=a&id=A&i=0')
    expect(url.toString()).toContain('uuid=b&id=B&i=0')
  })

  it('preserves explicit interactivity values', () => {
    isTeacherMode.set(true)

    const url = buildUrlFromParams('exercise' as any, [
      { uuid: 'a', id: 'A', interactif: '1' },
      { uuid: 'b', id: 'B', interactif: '0' },
    ])

    expect(url.toString()).toContain('uuid=a&id=A&i=1')
    expect(url.toString()).toContain('uuid=b&id=B&i=0')
  })

  it('injects missing i per exercise when normalizing a raw link', () => {
    const normalized = normalizeExerciseInteractivity(
      'https://topmaths.fr/?uuid=a&id=A&uuid=b&id=B&v=exercise',
      '0',
    )

    expect(normalized).toContain('uuid=a&id=A&i=0')
    expect(normalized).toContain('uuid=b&id=B&i=0')
    expect(normalized).toContain('&v=exercise')
  })

  it('injects missing i per exercise when normalizing a raw slug', () => {
    const normalized = normalizeExerciseInteractivity(
      'uuid=a&id=A&uuid=b&id=B',
      '1',
    )

    expect(normalized).toContain('uuid=a&id=A&i=1')
    expect(normalized).toContain('uuid=b&id=B&i=1')
  })

  it('does not overwrite an explicit i unless force mode is requested', () => {
    const normalized = normalizeExerciseInteractivity(
      'uuid=a&id=A&i=0&uuid=b&id=B',
      '1',
    )

    expect(normalized).toContain('uuid=a&id=A&i=0')
    expect(normalized).toContain('uuid=b&id=B&i=1')
  })

  it('forces copied links to i=1 for every exercise without duplicates', () => {
    const copied = buildCopiedLink(
      'https://topmaths.fr/?uuid=a&id=A&i=0&uuid=b&id=B&v=exercise',
      { forceInteractive: true },
    )

    expect(copied).toContain('uuid=a&id=A&i=1')
    expect(copied).toContain('uuid=b&id=B&i=1')
    expect(copied.match(/&i=1/g)?.length).toBe(2)
  })
})
