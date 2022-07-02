import { ViewportScroller } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalConstants } from '../services/modeles/global-constants'
import { Objectif, Video, Exercice } from '../services/modeles/objectifs'
import { Title } from '@angular/platform-browser'
import { DataService } from '../services/data.service'
import { Subscription } from 'rxjs'
import { Sequence } from '../services/modeles/sequences'

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.css']
})
export class ObjectifComponent implements OnInit, OnDestroy {
  reference: string
  niveau: string
  titre: string
  rappelDuCoursHTML: string
  rappelDuCoursImage: string
  rappelDuCoursInstrumenpoche: string
  videos: Video[]
  exercices: Exercice[]
  sequences: Sequence[]
  infosModale: [string[], string, Date]
  dataMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (private activatedRoute: ActivatedRoute, private dataService: DataService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title) {
    this.reference = ''
    this.niveau = ''
    this.titre = ''
    this.rappelDuCoursHTML = ''
    this.rappelDuCoursImage = ''
    this.rappelDuCoursInstrumenpoche = ''
    this.videos = []
    this.exercices = []
    this.sequences = []
    this.infosModale = [[], '', new Date()]
    this.dataMAJSubscription = new Subscription
  }

  ngOnInit (): void {
    this.viewportScroller.scrollToAnchor('titre')
    this.surveillerChangementsDeReference()
    this.surveillerLeChargementDesDonnees()
  }

  ngOnDestroy () {
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerChangementsDeReference () {
    this.activatedRoute.params.subscribe(params => {
      this.reference = params.reference
      if (this.lesDonneesSontChargees()) this.MAJPage()
    })
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'niveauxObjectifs' || valeurModifiee === 'niveauxSequences') {
        if (this.lesDonneesSontChargees()) this.MAJPage()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxObjectifs.length > 0 && this.dataService.niveauxSequences.length > 0
  }

  MAJPage () {
    const objectif: Objectif = this.getObjectif()
    this.sequences = this.getSequences()
    this.niveau = objectif.reference.slice(0, 1) + 'e'
    this.MAJProprietes(objectif)
  }

  getObjectif () {
    for (const niveau of this.dataService.niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (objectif.reference === this.reference) {
              return objectif
            }
          }
        }
      }
    }
    return new Objectif('', '', '', '', '', [], [])
  }

  getSequences () {
    const listeDesSequences = []
    for (const niveau of this.dataService.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        for (const objectif of sequence.objectifs) {
          if (objectif.reference === this.reference) {
            listeDesSequences.push(sequence)
          }
        }
      }
    }
    return listeDesSequences
  }

  MAJProprietes (objectif: Objectif) {
    this.titre = `${objectif.reference} : ${objectif.titre}`
    this.titleService.setTitle(this.titre)
    this.rappelDuCoursHTML = objectif.rappelDuCoursHTML
    if (objectif.rappelDuCoursImage === '') {
      this.rappelDuCoursImage = ''
    } else {
      this.rappelDuCoursImage = '../assets/img/' + objectif.rappelDuCoursImage
    }
    if (objectif.rappelDuCoursInstrumenpoche === '' || typeof objectif.rappelDuCoursInstrumenpoche === 'undefined') {
      this.rappelDuCoursInstrumenpoche = ''
    } else {
      this.rappelDuCoursInstrumenpoche = objectif.rappelDuCoursInstrumenpoche
    }
    this.videos = []
    for (const video of objectif.videos) {
      if (video.slug !== '') {
        let lienVideo: string
        if (video.slug.slice(0, 4) === 'http') {
          lienVideo = video.slug
          if (lienVideo.slice(0, 22) === 'https://ladigitale.dev') {
            // Les anciens liens Digiplay ne comportent pas l'api qui semble être maintenant nécessaire pour avoir accès aux vidéos
            if (lienVideo.indexOf('&api') === -1) {
              lienVideo = lienVideo + '&api=AIzaSyAMwdrqtoOp9JzFx2XZS1ikbbghQHf2Gvg'
            }
          }
        } else {
          lienVideo = "https://www.youtube.com/embed/" + video.slug
        }
        this.videos.push({
          titre: video.titre,
          slug: video.slug,
          auteur: video.auteur,
          lienAuteur: video.lienAuteur,
          lienVideo: lienVideo
        })
      }
    }
    this.exercices = []
    for (const exercice of objectif.exercices) {
      if (exercice.slug !== '') {
        this.exercices.push({
          id: exercice.id,
          slug: exercice.slug,
          lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&serie=&v=eval&z=1.5`,
          isInteractif: exercice.isInteractif
        })
        this.exercices[this.exercices.length - 1].lien = this.exercices[this.exercices.length - 1].lien.replace(/&ex=/g, ',i=1&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
        if (exercice.slug.slice(0, 25) === 'https://mathsmentales.net') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug + '&embed=' + GlobalConstants.ORIGINE
        } else if (exercice.slug.slice(0, 4) === 'http') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug
        }
      }
    }
  }

  ouvrirModaleExercices (lien: string | undefined) {
    if (typeof lien !== 'undefined') {
      this.infosModale = [[this.changerSerie(lien)], '', new Date()]
    }
  }

  changerSerie (lien: string) {
    return lien.split('&serie=')[0] + '&serie=' + Math.random().toString(16).slice(2, 6) + lien.split('&serie=')[1]
  }

  scrollBack (): void {
    this.viewportScroller.scrollToAnchor('divExercices')
  }
}
