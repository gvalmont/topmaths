import type { ObjectifNiveau, SequenceNiveau, SequenceSequenceParticuliere, CalendrierAnnee, LexiqueItem } from 'src/lib/types'
import { niveauxObjectifs as storeNiveauxObjectifs, niveauxSequences as storeNiveauxSequences, sequencesParticulieres as storeSequencesParticulieres, calendrierAnneeEnCours as storeCalendrierAnneeEnCours, lexique as lexiqueStore } from '../../store'
import sequencesModifieesJson from '../../../json/topmaths/sequences_modifiees.json'
import objectifsModifiesJson from '../../../json/topmaths/objectifs_modifies.json'
import lexiqueModifieJson from '../../../json/topmaths/lexique_modifie.json'
import sequencesParticulieresJson from '../../../json/topmaths/sequencesParticulieres.json'
import calendrierJson from '../../../json/topmaths/calendrier.json'

let niveauxObjectifs = [] as ObjectifNiveau[]
let niveauxSequences = [] as SequenceNiveau[]
let sequencesParticulieres = [] as SequenceSequenceParticuliere[]
let lexique = [] as LexiqueItem[]
miseEnCacheDesDonnees()

function miseEnCacheDesDonnees () {
  miseEnCacheNiveauxEtSequences()
  miseEnCacheSequencesParticulieres()
  miseEnCacheLexique()
  miseEnCacheCalendrier()
}

function miseEnCacheNiveauxEtSequences () {
  niveauxSequences = sequencesModifieesJson as SequenceNiveau[]
  storeNiveauxSequences.set(niveauxSequences)
  niveauxObjectifs = objectifsModifiesJson as ObjectifNiveau[]
  storeNiveauxObjectifs.set(niveauxObjectifs)
}

function miseEnCacheSequencesParticulieres () {
  sequencesParticulieres = sequencesParticulieresJson as SequenceSequenceParticuliere[]
  storeSequencesParticulieres.set(sequencesParticulieres)
}

function miseEnCacheLexique () {
  lexique = lexiqueModifieJson as LexiqueItem[]
  lexiqueStore.set(lexique)
}

function miseEnCacheCalendrier () {
  const calendrierAnnees = calendrierJson as CalendrierAnnee[]
  const annee = new Date().getFullYear()
  const jourNumero = getDayOfYear()
  let periodeNumero: number
  let typeDePeriode: 'cours' | 'vacances'
  let semaineDansLaPeriode: number
  let trouve = false
  for (const annee of calendrierAnnees) {
    for (const periode of annee.periodes) {
      if (jourNumero >= periode.debut && jourNumero <= periode.fin) {
        periodeNumero = periode.numero
        typeDePeriode = periode.type
        semaineDansLaPeriode = Math.floor((jourNumero - periode.debut) / 7) + 1
        trouve = true
      }
      if (trouve) break
    }
    if (trouve) break
  }
  const calendrierAnneeEnCours = { annee, jourNumero, periodeNumero, semaineDansLaPeriode, typeDePeriode }
  storeCalendrierAnneeEnCours.update(() => calendrierAnneeEnCours)
}

function getDayOfYear () {
  const now = new Date()
  const begin = new Date(now.getFullYear(), 0, 0)
  const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}
