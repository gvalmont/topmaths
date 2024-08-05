import type { StringGrade } from '../../../types/grade'
import type { Reference } from '../../../types/navigation'

export type Item = { grade: StringGrade, term: number, reference: Reference, title: string, number?: number, titleAcademic?: string, theme?: string, subTheme?: string }
export const emptyItem: Item = { grade: 'tout', term: 0, reference: '', title: '' }
