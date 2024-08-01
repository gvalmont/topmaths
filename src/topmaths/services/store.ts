import type { GlossaryUniteItem } from '../types/glossary.js'
import type { Unit, UnitSpecial } from '../types/unit.js'
import type { Objective } from '../types/objective.js'
import { writable } from 'svelte/store'
import { deepCopy } from '../types/shared.js'
import { type TopmathsView } from '../types/navigation.js'
import { emptyCalendarSchoolYear, type CalendarSchoolYear } from '../types/calendar.js'
import type { VueType } from '../../lib/types.js'
import { emptyCurriculum, type Curriculum } from '../types/curriculum.js'

// libraries
export const units = writable<Unit[]>([])
export const specialUnits = writable<UnitSpecial[]>([])
export const objectives = writable<Objective[]>([])
export const glossary = writable<GlossaryUniteItem[]>([])
export const calendar = writable<CalendarSchoolYear>(deepCopy(emptyCalendarSchoolYear))
export const curriculum = writable<Curriculum>(emptyCurriculum)

// url parameters
export const view = writable<VueType | TopmathsView>('home')
export const reference = writable<string>('')

// display settings
export const isTitleAcademicPreferred = writable<boolean>(false)
export const isTeacherMode = writable<boolean>(false)
export const isPersonalMode = writable<boolean>(false)

// other
export const exerciseLinks = writable<string[]>([])
