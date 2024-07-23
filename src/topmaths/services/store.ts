import { writable } from 'svelte/store'
import type { GlossaryUniteItem } from '../types/glossary'
import type { Unit, UnitSpecial } from '../types/unit'
import type { Objective } from '../types/objective'
import type { CalendarCurrentYear } from '../types/calendar'

export const vue = writable<string>('')

export const vuePrecedente = writable<string>('')

export const reference = writable<string>('')

export const urlExercice = writable<string>('')

export const listeDesUrl = writable<string[]>([])

export const units = writable<Unit[]>([])

export const objectives = writable<Objective[]>([])

export const sequencesParticulieres = writable<UnitSpecial[]>([])

export const lexique = writable<GlossaryUniteItem[]>([])

export const calendrierAnneeEnCours = writable<CalendarCurrentYear>({ year: 0, dayOfYear: 0, periodNumber: 0, weekInPeriod: 0, isHoliday: true })

export const modeEnseignant = writable<boolean>(false)

export const modePerso = writable<boolean>(false)

export const panierDispo = writable<boolean>(false)

export const titresProchesDesAttendus = writable<boolean>(false)

export const texteRecherche = writable<string>('')
