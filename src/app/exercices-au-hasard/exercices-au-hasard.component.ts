import { ViewportScroller } from '@angular/common'
import { Component } from '@angular/core'
import { Niveau as NiveauObjectif } from 'src/app/services/modeles/objectifs'
import { Niveau as NiveauSequence } from 'src/app/services/modeles/sequences'
import { CalendrierService } from '../services/calendrier.service'
import { DataService } from '../services/data.service'
import { OutilsService } from '../services/outils.service'

@Component({
  selector: 'app-exercices-au-hasard',
  templateUrl: './exercices-au-hasard.component.html',
  styleUrls: ['./exercices-au-hasard.component.css']
})
export class ExercicesAuHasardComponent {
  infosModale: [string[], string, Date]

  // eslint-disable-next-line no-unused-vars
  constructor (private dataService: DataService, private viewportScroller: ViewportScroller, private calendrierService: CalendrierService, private outils: OutilsService) {
    this.infosModale = [[], '', new Date() ]
  }

  /**
   * Remonte jusqu'au menu au retour de la modale d'exercice
   */
  scrollBack () {
    this.viewportScroller.scrollToPosition([ 0, 0 ])
  }

  lancerExercices (niveauChoisi: string) {
    if (this.calendrierService.periodeNumero > 0) {
      const listeDesReferences = this.getListeDesReferences(niveauChoisi, this.dataService.niveauxSequences)
      const listeDesUrl = this.getListeDesUrl(listeDesReferences, this.dataService.niveauxObjectifs)
      this.infosModale = [ listeDesUrl, 'exerciceAuHasard', new Date() ]
    }
  }

  getListeDesReferences (niveauChoisi: string, niveaux: NiveauSequence[]) {
    const listeDesReferences: string[] = []
    for (const niveau of niveaux) {
      if (niveau.nom === niveauChoisi || niveauChoisi === 'tout') {
        const derniereSequence = this.getDerniereSequence()
        for (const sequence of niveau.sequences) {
          if (parseInt(sequence.reference.slice(3)) <= derniereSequence) {
            for (const objectif of sequence.objectifs) {
              listeDesReferences.push(objectif.reference)
            }
          }
        }
      }
    }
    return listeDesReferences
  }

  getListeDesUrl (listeDesReferences: string[], niveaux: NiveauObjectif[]) {
    const listeDesUrl: string[] = []
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            for (const reference of listeDesReferences) {
              if (reference === objectif.reference) {
                for (const exercice of objectif.exercices) {
                  listeDesUrl.push(exercice.lien)
                }
              }
            }
          }
        }
      }
    }
    return listeDesUrl
  }

  getDerniereSequence () {
    const periode = this.calendrierService.periodeNumero
    const type = this.calendrierService.typeDePeriode
    const semaine = this.calendrierService.semaineDansLaPeriode
    switch (periode) {
      case 1:
        if (type === 'cours') {
          return semaine - 1
        } else {
          return 6
        }
      case 2:
        if (type === 'cours') {
          return Math.max(6, 6 + semaine - 1)
        } else {
          return 12
        }
      case 3:
        if (type === 'cours') {
          return Math.max(12, 12 + semaine)
        } else {
          return 17
        }
      case 4:
        if (type === 'cours') {
          return Math.max(17, 17 + semaine)
        } else {
          return 22
        }
      case 5:
        if (type === 'cours') {
          return Math.max(22, 22 + semaine)
        } else {
          return 27
        }
    }
    return 0
  }
}
