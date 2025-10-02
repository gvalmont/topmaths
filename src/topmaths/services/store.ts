import { writable } from 'svelte/store'
import {
  emptyCalendarSchoolYear,
  type CalendarSchoolYear,
} from '../types/calendar.js'
import { emptyCurriculum, type Curriculum } from '../types/curriculum.js'
import type { ExamExercise } from '../types/exam-exercise.js'
import type { GlossaryUniteItem } from '../types/glossary.js'
import { type View } from '../types/navigation.js'
import type { Objective } from '../types/objective.js'
import { deepCopy } from '../types/shared.js'
import type { SpecialUnit } from '../types/specialUnit.js'
import type { Unit } from '../types/unit.js'

// libraries
export const units = writable<Unit[]>([])
export const specialUnits = writable<SpecialUnit[]>([])
export const objectives = writable<Objective[]>([])
export const glossary = writable<GlossaryUniteItem[]>([])
export const calendar = writable<CalendarSchoolYear>(
  deepCopy(emptyCalendarSchoolYear),
)
export const curriculum = writable<Curriculum>(emptyCurriculum)
export const examExercises = writable<ExamExercise[]>([])

// url parameters
export const view = writable<View>('home')
export const reference = writable<string>('')
export const reference2 = writable<string>('')

// topmaths display settings
export const isTitleAcademicPreferred = writable<boolean>(false)
export const isTeacherMode = writable<boolean>(false)
export const isPersonalMode = writable<boolean>(false)

// exercises
export const exerciseLinks = writable<string[]>([])
export const isDoubleView = writable<boolean>(false)
