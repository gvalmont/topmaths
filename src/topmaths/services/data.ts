import type { ObjectiveGrade, UnitGrade, UnitSpecialUnit, CalendarYear } from './types'
import { niveauxObjectifs as storeNiveauxObjectifs, niveauxSequences as storeNiveauxSequences, sequencesParticulieres as storeSequencesParticulieres, calendrierAnneeEnCours as storeCalendrierAnneeEnCours, lexique as lexiqueStore } from './store'
import sequencesModifieesJson from '../../topmaths/json/sequences_modifiees.json'
import objectifsModifiesJson from '../../topmaths/json/objectifs_modifies.json'
import lexiqueModifieJson from '../../topmaths/json/lexique.json'
import sequencesParticulieresJson from '../../topmaths/json/sequencesParticulieres.json'
import calendrierJson from '../../topmaths/json/calendrier.json'
import type { GlossaryUniteItem } from '../types/glossary'

let niveauxObjectifs = [] as ObjectiveGrade[]
let niveauxSequences = [] as UnitGrade[]
let sequencesParticulieres = [] as UnitSpecialUnit[]
let lexique = [] as GlossaryUniteItem[]
miseEnCacheDesDonnees()

function miseEnCacheDesDonnees () {
  miseEnCacheNiveauxEtSequences()
  miseEnCacheSequencesParticulieres()
  miseEnCacheLexique()
  miseEnCacheCalendrier()
}

function miseEnCacheNiveauxEtSequences () {
  niveauxSequences = sequencesModifieesJson as UnitGrade[]
  storeNiveauxSequences.set(niveauxSequences)
  niveauxObjectifs = objectifsModifiesJson as ObjectiveGrade[]
  storeNiveauxObjectifs.set(niveauxObjectifs)
}

function miseEnCacheSequencesParticulieres () {
  sequencesParticulieres = sequencesParticulieresJson as UnitSpecialUnit[]
  storeSequencesParticulieres.set(sequencesParticulieres)
}

function miseEnCacheLexique () {
  lexique = lexiqueModifieJson as GlossaryUniteItem[]
  lexiqueStore.set(lexique)
}

function miseEnCacheCalendrier () {
  const calendrierAnnees = calendrierJson as CalendarYear[]
  const annee = new Date().getFullYear()
  const jourNumero = getDayOfYear()
  let periodeNumero: number = 1
  let isHoliday: boolean = false
  let semaineDansLaPeriode: number = 1
  let trouve = false
  for (const annee of calendrierAnnees) {
    for (const periode of annee.periods) {
      if (jourNumero >= periode.startDayOfYear && jourNumero <= periode.endDayOfYear) {
        periodeNumero = periode.number
        isHoliday = periode.isHoliday
        semaineDansLaPeriode = Math.floor((jourNumero - periode.startDayOfYear) / 7) + 1
        trouve = true
      }
      if (trouve) break
    }
    if (trouve) break
  }
  storeCalendrierAnneeEnCours.set({ year: annee, dayOfYear: jourNumero, periodNumber: periodeNumero, weekInPeriod: semaineDansLaPeriode, isHoliday })
}

function getDayOfYear () {
  const now = new Date()
  const begin = new Date(now.getFullYear(), 0, 0)
  const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}
