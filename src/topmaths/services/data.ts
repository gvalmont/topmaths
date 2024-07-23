import { objectives as storeObjectives, units as storeUnits, sequencesParticulieres as storeSequencesParticulieres, calendrierAnneeEnCours as storeCalendrierAnneeEnCours, lexique as glossaryStore } from './store'
import sequencesModifieesJson from '../../topmaths/json/sequences_modifiees.json'
import objectifsModifiesJson from '../../topmaths/json/objectifs_modifies.json'
import glossaryJson from '../../topmaths/json/lexique.json'
import sequencesParticulieresJson from '../../topmaths/json/sequencesParticulieres.json'
import calendrierJson from '../../topmaths/json/calendrier.json'
import { isGlossaryUniteItems } from '../types/glossary'
import { isUnits } from '../types/unit'
import { isObjectives } from '../types/objective'

miseEnCacheDesDonnees()

function miseEnCacheDesDonnees () {
  miseEnCacheNiveauxEtSequences()
  miseEnCacheSequencesParticulieres()
  miseEnCacheLexique()
  miseEnCacheCalendrier()
}

function miseEnCacheNiveauxEtSequences () {
  if (!isUnits(sequencesModifieesJson)) {
    console.error(sequencesModifieesJson)
    throw new Error('sequencesModifieesJson is not an array of Unit')
  }
  storeUnits.set(sequencesModifieesJson)

  if (!isObjectives(objectifsModifiesJson)) {
    console.error(objectifsModifiesJson)
    throw new Error('objectifsModifiesJson is not an array of Objective')
  }
  storeObjectives.set(objectifsModifiesJson)
}

function miseEnCacheSequencesParticulieres () {
  const sequencesParticulieres = sequencesParticulieresJson
  storeSequencesParticulieres.set(sequencesParticulieres)
}

function miseEnCacheLexique () {
  if (!isGlossaryUniteItems(glossaryJson)) {
    console.error(glossaryJson)
    throw new Error('lexiqueModifieJson is not an array of GlossaryUniteItem')
  }
  glossaryStore.set(glossaryJson)
}

function miseEnCacheCalendrier () {
  const calendrierAnnees = calendrierJson
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
