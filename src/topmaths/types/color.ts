import type { StringGrade } from './grade'

export type ButtonColor = 'topmaths' | 'coopmaths' | 'sponsor' | 'fuchsia' | 'green' | 'link' | 'info' | 'warning' | 'danger' | 'purple' | 'info-darker' | 'brown' // keep in sync with themes.css, tailwind-colors.scss and tailwind.config.cjs

export type ThemeColor = StringGrade | ButtonColor
