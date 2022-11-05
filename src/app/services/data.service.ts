import { HttpClient } from '@angular/common/http'
import { EventEmitter, Injectable, Output } from '@angular/core'
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
        this.niveauxObjectifs = this.ajouterObjectifsParThemeParPeriode(this.ajouterPeriode(niveauxObjectifs))
        this.dataMAJ.emit('niveauxObjectifs')
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

  ajouterPeriode (niveaux: NiveauObjectif[]) {
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            objectif.periode = this.trouverPeriode(objectif.reference)
          }
        }
      }
    }
    return niveaux
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
    console.log('Période non trouvée pour l\'objectif ' + referenceObjectif)
    return -1
  }
}
