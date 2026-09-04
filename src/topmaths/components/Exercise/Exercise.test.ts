import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/svelte/svelte5'
import { afterEach, describe, expect, it } from 'vitest'
import { examExercises, exerciseLinks } from '../../services/store'
import Exercise from './Exercise.svelte'

describe('Topmaths static exercises', () => {
  afterEach(() => {
    examExercises.set([])
    exerciseLinks.set([])
  })

  it('displays exam metadata, its unit and its correction', async () => {
    examExercises.set([
      {
        uuid: 'dnb_2021_06_etrangers_2',
        unitReference: 'S3S1',
      },
    ])

    render(Exercise, {
      isMd: false,
      url: 'http://localhost/?uuid=dnb_2021_06_etrangers_2&i=0&v=exercise',
    })

    await waitFor(() => {
      expect(
        screen.getByText('Sujet Centres étrangers - Juin 2021'),
      ).not.toBeNull()
    })
    expect(screen.getByText('Voir la séquence')).not.toBeNull()
    expect(screen.queryByAltText('correction')).toBeNull()

    await fireEvent.click(screen.getByText('Voir la correction'))

    expect(screen.getByAltText('correction').getAttribute('src')).toBe(
      'static/dnb/2021/tex/png/dnb_2021_06_etrangers_2_cor.png',
    )
  })
})
