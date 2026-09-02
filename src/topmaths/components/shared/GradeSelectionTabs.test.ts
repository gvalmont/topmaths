import { render, screen } from '@testing-library/svelte/svelte5'
import { describe, expect, it, vi } from 'vitest'
import GradeSelectionTabs from './GradeSelectionTabs.svelte'

describe('GradeSelectionTabs', () => {
  it('marks only the active filter when the selected grade changes', async () => {
    const onClick = vi.fn()
    const { rerender } = render(GradeSelectionTabs, {
      activeLevelTab: '5e',
      onClick,
    })
    const grade5Button = screen.getByRole('button', { name: '5e' })

    await rerender({ activeLevelTab: '3e', onClick })

    expect(grade5Button.classList.contains('is-filter-button')).toBe(true)
    expect(grade5Button.classList.contains('is-active')).toBe(false)
    expect(
      screen
        .getByRole('button', { name: '3e' })
        .classList.contains('is-active'),
    ).toBe(true)
    expect(document.querySelectorAll('button.is-active')).toHaveLength(1)
  })
})
