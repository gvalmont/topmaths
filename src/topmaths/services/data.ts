import { objectives as storeObjectives, units as storeUnits, specialUnits as storeSequencesParticulieres, calendar as storeCalendrierAnneeEnCours, glossary as glossaryStore } from './store'
import units from '../../topmaths/json/built_units.json'
import objectives from '../../topmaths/json/built_objectives.json'
import glossaryJson from '../../topmaths/json/glossary.json'
import specialUnits from '../../topmaths/json/special_units.json'
import calendrierJson from '../../topmaths/json/calendar.json'
import { isGlossaryUniteItems } from '../types/glossary'
import { isUnits, isUnitSpecials } from '../types/unit'
import { isObjectives } from '../types/objective'

export function cacheData (): void {
  cacheUnits()
  cacheObjectives()
  cacheSpecialUnits()
  cacheGlossary()
  cacheCalendar()
}

function cacheUnits (): void {
  if (!isUnits(units)) {
    console.error(units)
    throw new Error('sequencesModifieesJson is not an array of Unit')
  }
  storeUnits.set(units)
}

function cacheObjectives (): void {
  if (!isObjectives(objectives)) {
    console.error(objectives)
    throw new Error('objectifsModifiesJson is not an array of Objective')
  }
  storeObjectives.set(objectives)
}

function cacheSpecialUnits (): void {
  const sequencesParticulieres = specialUnits
  if (!isUnitSpecials(sequencesParticulieres)) {
    console.error(sequencesParticulieres)
    throw new Error('sequencesParticulieres is not an array of UnitSpecial')
  }
  storeSequencesParticulieres.set(sequencesParticulieres)
}

function cacheGlossary (): void {
  if (!isGlossaryUniteItems(glossaryJson)) {
    console.error(glossaryJson)
    throw new Error('lexiqueModifieJson is not an array of GlossaryUniteItem')
  }
  glossaryStore.set(glossaryJson)
}

function cacheCalendar (): void {
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

function getDayOfYear (): number {
  const now = new Date()
  const begin = new Date(now.getFullYear(), 0, 0)
  const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}
