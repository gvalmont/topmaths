import { HttpClient } from '@angular/common/http'
import { EventEmitter, Injectable, Output } from '@angular/core'
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
    this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      this.niveauxObjectifs = niveaux
      this.dataMAJ.emit('niveauxObjectifs')
    })
    this.httpClient.get<NiveauSequence[]>('assets/data/sequences.json').subscribe(niveaux => {
      this.niveauxSequences = niveaux
      this.dataMAJ.emit('niveauxSequences')
    })
    this.httpClient.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json').subscribe(sequencesParticulieres => {
      this.sequencesParticulieres = sequencesParticulieres
      this.dataMAJ.emit('sequencesParticulieres')
    })
    this.httpClient.get<Annee[]>('assets/data/calendrier.json').subscribe(annees => {
      this.calendrierAnnees = annees
      this.dataMAJ.emit('calendrierAnnees')
    })
    this.httpClient.get<Nom[]>('assets/data/nomsMasculins.json').subscribe(noms => {
      this.listeMasculins = noms
      this.dataMAJ.emit('listeMasculins')
    })
    this.httpClient.get<Nom[]>('assets/data/nomsFeminins.json').subscribe(noms => {
      this.listeFeminins = noms
      this.dataMAJ.emit('listeFeminins')
    })
    this.httpClient.get<Adjectif[]>('assets/data/adjectifs.json').subscribe(adjectifs => {
      this.listeAdjectifs = adjectifs
      this.dataMAJ.emit('listeAdjectifs')
    })
  }
}
