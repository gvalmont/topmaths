import type { GlossaryUniteItem } from '../types/glossary'
import type { Unit, UnitSpecial } from '../types/unit'
import type { Objective } from '../types/objective'
import { writable } from 'svelte/store'
import { deepCopy } from '../types/shared'
import { emptyCalendarCurrentYear, type CalendarCurrentYear } from '../types/calendar'

// libraries
export const units = writable<Unit[]>([])
export const specialUnits = writable<UnitSpecial[]>([])
export const objectives = writable<Objective[]>([])
export const glossary = writable<GlossaryUniteItem[]>([])
export const calendar = writable<CalendarCurrentYear>(deepCopy(emptyCalendarCurrentYear))

// url parameters
export const view = writable<string>('')
export const reference = writable<string>('')

// display settings
export const isTitleAcademicPreferred = writable<boolean>(false)
export const isTeacherMode = writable<boolean>(false)
export const isPersonalMode = writable<boolean>(false)
export const isCartEmpty = writable<boolean>(true)

// other
export const exerciseLink = writable<string>('')
export const exerciseLinks = writable<string[]>([])
