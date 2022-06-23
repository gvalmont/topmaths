import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AvatarsDef } from './modeles/avatar'
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
  niveauxObjectifs: NiveauObjectif[]
  niveauxSequences: NiveauSequence[]
  sequencesParticulieres: SequenceParticuliere[]
  avatarsDef: AvatarsDef
  calendrierAnnees: Annee[]
  listeMasculins: Nom[]
  listeFeminins: Nom[]
  listeAdjectifs: Adjectif[]
  feminin: boolean

  // eslint-disable-next-line no-unused-vars
  constructor(public httpClient: HttpClient) {
    this.niveauxObjectifs = []
    this.niveauxSequences = []
    this.sequencesParticulieres = []
    this.avatarsDef = new AvatarsDef('', '', '', '', [], [], [], [], [], [], [])
    this.calendrierAnnees = []
    this.listeMasculins = []
    this.listeFeminins = []
    this.listeAdjectifs = []
    this.feminin = false
    this.miseEnCacheDesDonnees()
  }

  miseEnCacheDesDonnees() {
    this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      this.niveauxObjectifs = niveaux
    })
    this.httpClient.get<NiveauSequence[]>('assets/data/sequences.json').subscribe(niveaux => {
      this.niveauxSequences = niveaux
    })
    this.httpClient.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json').subscribe(sequencesParticulieres => {
      this.sequencesParticulieres = sequencesParticulieres
    })
    this.httpClient.get<AvatarsDef>('assets/data/avatars-def.json').subscribe(avatarsDef => {
      this.avatarsDef = avatarsDef
    })
    this.httpClient.get<Annee[]>('assets/data/calendrier.json').subscribe(annees => {
      this.calendrierAnnees = annees
    })
    this.httpClient.get<Nom[]>('assets/data/nomsMasculins.json').subscribe(noms => {
      this.listeMasculins = noms
    })
    this.httpClient.get<Nom[]>('assets/data/nomsFeminins.json').subscribe(noms => {
      this.listeFeminins = noms
    })
    this.httpClient.get<Adjectif[]>('assets/data/adjectifs.json').subscribe(adjectifs => {
      this.listeAdjectifs = adjectifs
    })
  }
}
