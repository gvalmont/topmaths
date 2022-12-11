import { ViewportScroller } from '@angular/common'
import { Component, isDevMode } from '@angular/core'
import { Niveau as NiveauObjectif } from 'src/app/services/modeles/objectifs'
import { Niveau as NiveauSequence } from 'src/app/services/modeles/sequences'
import { environment } from 'src/environments/environment'
import { CalendrierService } from '../services/calendrier.service'
import { DataService } from '../services/data.service'
import { OutilsService } from '../services/outils.service'

interface Exercice {
  id: number
  slug: string
  lien: string
}

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
    const listeReferences = this.getListeDesReferences(niveauChoisi, this.dataService.niveauxSequences)
    const listeDesUrl = this.getListeDesExercices(listeReferences, niveauChoisi, this.dataService.niveauxObjectifs)
    this.infosModale = [ listeDesUrl, 'exerciceAuHasard', new Date() ]
  }

  getListeDesReferences (niveauChoisi: string, niveaux: NiveauSequence[]) {
    const listeReferences: string[] = []
    for (const niveau of niveaux) {
      if (niveau.nom === niveauChoisi || niveauChoisi === 'tout') {
        const derniereSequence = this.getDerniereSequence()
        for (const sequence of niveau.sequences) {
          if (parseInt(sequence.reference.slice(3)) <= derniereSequence) {
            for (const objectif of sequence.objectifs) {
              listeReferences.push(objectif.reference)
            }
          }
        }
      }
    }
    return listeReferences
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

  getListeDesExercices (listeReferences: string[], niveauChoisi: string, niveaux: NiveauObjectif[]) {
    const listeExercices: Exercice[] = []
    const listeDesUrl: string[] = []
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            for (const reference of listeReferences) {
              if (reference === objectif.reference) {
                for (const exercice of objectif.exercices) {
                  listeExercices.push({
                    id: exercice.id,
                    slug: exercice.slug,
                    lien: `${environment.urlMathALEA}ex=${exercice.slug},i=0&v=e&z=1.5`
                  })
                  listeExercices[listeExercices.length - 1].lien = listeExercices[listeExercices.length - 1].lien.replace(/&ex=/g, ',i=0&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
                  if (this.outils.estMathsMentales(exercice.slug)) {
                    listeExercices[listeExercices.length - 1].lien = exercice.slug + '&embed=' + environment.origine
                  } else if (exercice.slug.slice(0, 4) === 'http') {
                    listeExercices[listeExercices.length - 1].lien = exercice.slug
                  }
                  listeDesUrl.push(listeExercices[listeExercices.length - 1].lien)
                }
              }
            }
          }
        }
      }
    }
    if (isDevMode() && niveauChoisi !== 'tout') {
      this.verifierPresenceDoublons(listeExercices)
    }
    return listeDesUrl
  }

  verifierPresenceDoublons (listeExercices: Exercice[]) {
    const listeDesId: number[] = []
    for (const exercice of listeExercices) {
      for (const id of listeDesId) {
        if (exercice.id === id) alert('id ' + id + ' trouvé 2 fois !')
      }
      listeDesId.push(exercice.id)
    }
  }
}
