import type { GlossaryUniteItem } from '../types/glossary'
import type { Unit, UnitSpecial } from '../types/unit'
import type { Objective } from '../types/objective'
import { writable } from 'svelte/store'
import { deepCopy, type TopmathsView } from '../types/shared'
import { emptyCalendarSchoolYear, type CalendarSchoolYear } from '../types/calendar'
import type { VueType } from '../../lib/types'

// libraries
export const units = writable<Unit[]>([])
export const specialUnits = writable<UnitSpecial[]>([])
export const objectives = writable<Objective[]>([])
export const glossary = writable<GlossaryUniteItem[]>([])
export const calendar = writable<CalendarSchoolYear>(deepCopy(emptyCalendarSchoolYear))

// url parameters
export const view = writable<VueType | TopmathsView | ''>('')
export const reference = writable<string>('')

// display settings
export const isTitleAcademicPreferred = writable<boolean>(false)
export const isTeacherMode = writable<boolean>(false)
export const isPersonalMode = writable<boolean>(false)
export const isCartEmpty = writable<boolean>(true)

// other
export const exerciseLink = writable<string>('')
export const exerciseLinks = writable<string[]>([])
