import { HttpClient } from '@angular/common/http'
import { EventEmitter, Injectable, isDevMode, Output } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Annee } from './modeles/calendrier'
import { Niveau as NiveauObjectif } from './modeles/objectifs'
import { Niveau as NiveauSequence, SequenceParticuliere } from './modeles/sequences'

interface Nom {
  nom: string
}

interface Adjectif {
  masculin: string,
  feminin: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  @Output() dataMAJ: EventEmitter<string> = new EventEmitter()

  niveauxObjectifs: NiveauObjectif[]
  niveauxSequences: NiveauSequence[]
  sequencesParticulieres: SequenceParticuliere[]
  calendrierAnnees: Annee[]
  listeMasculins: Nom[]
  listeFeminins: Nom[]
  listeAdjectifs: Adjectif[]
  listeSitesPresentsPolitiqueDeConfidentialite = [
    'https://mathsmentales.net/',
    'https://mathix.org/',
    'https://www.geogebra.org/',
    'https://www.clicmaclasse.fr/'
  ]

  // eslint-disable-next-line no-unused-vars
  constructor (public httpClient: HttpClient) {
    this.niveauxObjectifs = []
    this.niveauxSequences = []
    this.sequencesParticulieres = []
    this.calendrierAnnees = []
    this.listeMasculins = []
    this.listeFeminins = []
    this.listeAdjectifs = []
    this.miseEnCacheDesDonnees()
  }

  miseEnCacheDesDonnees () {
    this.httpClient.get<NiveauSequence[]>('assets/data/sequences.json?' + environment.appVersion).subscribe(niveauxSequences => {
      this.niveauxSequences = niveauxSequences
      this.dataMAJ.emit('niveauxSequences')

      this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs.json?' + environment.appVersion).subscribe(niveauxObjectifs => {
        this.niveauxObjectifs = this.preTraiterObjectifs(niveauxObjectifs)
        this.dataMAJ.emit('niveauxObjectifs')
        if (isDevMode()) this.checksDeRoutine()
      })
    })
    this.httpClient.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json?' + environment.appVersion).subscribe(sequencesParticulieres => {
      this.sequencesParticulieres = sequencesParticulieres
      this.dataMAJ.emit('sequencesParticulieres')
    })
    this.httpClient.get<Annee[]>('assets/data/calendrier.json?' + environment.appVersion).subscribe(annees => {
      this.calendrierAnnees = annees
      this.dataMAJ.emit('calendrierAnnees')
    })
  }

  preTraiterObjectifs (niveaux: NiveauObjectif[]) {
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            objectif.periode = this.trouverPeriode(objectif.reference)
            let numeroExercice = 1
            for (const exercice of objectif.exercices) {
              exercice.id = objectif.reference + '-' + numeroExercice
              numeroExercice++
            }
          }
        }
      }
    }
    return this.ajouterObjectifsParThemeParPeriode(niveaux)
  }

  ajouterObjectifsParThemeParPeriode (niveaux: NiveauObjectif[]) {
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        let nbObjectifsThemePeriode1 = 0
        let nbObjectifsThemePeriode2 = 0
        let nbObjectifsThemePeriode3 = 0
        let nbObjectifsThemePeriode4 = 0
        let nbObjectifsThemePeriode5 = 0
        for (const sousTheme of theme.sousThemes) {
          let nbObjectifsSousThemePeriode1 = 0
          let nbObjectifsSousThemePeriode2 = 0
          let nbObjectifsSousThemePeriode3 = 0
          let nbObjectifsSousThemePeriode4 = 0
          let nbObjectifsSousThemePeriode5 = 0
          for (const objectif of sousTheme.objectifs) {
            switch (objectif.periode) {
              case 1:
                nbObjectifsThemePeriode1++
                nbObjectifsSousThemePeriode1++
                break
              case 2:
                nbObjectifsThemePeriode2++
                nbObjectifsSousThemePeriode2++
                break
              case 3:
                nbObjectifsThemePeriode3++
                nbObjectifsSousThemePeriode3++
                break
              case 4:
                nbObjectifsThemePeriode4++
                nbObjectifsSousThemePeriode4++
                break
              case 5:
                nbObjectifsThemePeriode5++
                nbObjectifsSousThemePeriode5++
                break
            }
          }
          sousTheme.nbObjectifsParPeriode = [
            nbObjectifsSousThemePeriode1,
            nbObjectifsSousThemePeriode2,
            nbObjectifsSousThemePeriode3,
            nbObjectifsSousThemePeriode4,
            nbObjectifsSousThemePeriode5
          ]
        }
        theme.nbObjectifsParPeriode = [
          nbObjectifsThemePeriode1,
          nbObjectifsThemePeriode2,
          nbObjectifsThemePeriode3,
          nbObjectifsThemePeriode4,
          nbObjectifsThemePeriode5
        ]
      }
    }
    return niveaux
  }

  trouverPeriode (referenceObjectif: string) {
    for (const niveau of this.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        for (const objectif of sequence.objectifs) {
          if (objectif.reference === referenceObjectif) {
            return sequence.periode
          }
        }
      }
    }
    return -1
  }

  checksDeRoutine () {
    this.checksSequences()
    this.checksObjectifs()
  }

  checksSequences () {
    const listeExercicesDeBrevet = []
    let nbDoublonsTrouves = 0
    for (const niveau of this.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        if (sequence.slugEvalBrevet !== undefined && sequence.slugEvalBrevet !== "") {
          const listeExosAvecEx = sequence.slugEvalBrevet.split("&")
          for (const exoAvecEx of listeExosAvecEx) {
            const exo = exoAvecEx.slice(3)
            for (const exerciceDeBrevet of listeExercicesDeBrevet) {
              if (exo === exerciceDeBrevet) {
                console.log(exo + ' présent en double')
                nbDoublonsTrouves++
              }
            }
            listeExercicesDeBrevet.push(exo)
          }
        }
      }
    }
    if (nbDoublonsTrouves === 0) console.log('Pas de doublons d\'exercices de brevet trouvés')
  }

  checksObjectifs () {
    const listeHTTP = []
    for (const niveau of this.niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            for (const exercice of objectif.exercices) {
              if (exercice.slug.slice(0, 4) === 'http') {
                listeHTTP.push(exercice.slug)
              }
            }
          }
        }
      }
    }
    const listeAbsents = []
    for (const site of listeHTTP) {
      let trouve = false
      for (const sitePresent of this.listeSitesPresentsPolitiqueDeConfidentialite) {
        if (site.slice(0, sitePresent.length) === sitePresent) {
          trouve = true
          break
        }
      }
      if (!trouve) listeAbsents.push(site)
    }
    if (listeAbsents.length > 0) console.log('Sites absents de la politique de confidentialité :', listeAbsents)
  }
}
