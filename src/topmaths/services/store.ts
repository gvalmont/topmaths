import { writable } from 'svelte/store'
import type { CalendrierAnneeEnCours, LexiqueItem, ObjectifNiveau, SequenceNiveau, SequenceSequenceParticuliere } from './types'

export const vue = writable<string>('')

export const vuePrecedente = writable<string>('')

export const reference = writable<string>('')

export const urlExercice = writable<string>('')

export const listeDesUrl = writable<string[]>([])

export const niveauxSequences = writable<SequenceNiveau[]>([])

export const niveauxObjectifs = writable<ObjectifNiveau[]>([])

export const sequencesParticulieres = writable<SequenceSequenceParticuliere[]>([])

export const lexique = writable<LexiqueItem[]>([])

export const calendrierAnneeEnCours = writable<CalendrierAnneeEnCours>({ annee: 0, jourNumero: 0, periodeNumero: 0, semaineDansLaPeriode: 0, typeDePeriode: 'vacances' })

export const modeEnseignant = writable<boolean>(false)

export const modePerso = writable<boolean>(false)

export const panierDispo = writable<boolean>(false)

export const titresProchesDesAttendus = writable<boolean>(false)

export const texteRecherche = writable<string>('')
