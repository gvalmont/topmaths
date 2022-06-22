import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { GlobalConstants } from '../services/global-constants';
import { Niveau, Objectif, Video, Exercice } from '../services/objectifs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.css']
})
export class ObjectifComponent implements OnInit {
  niveau: string
  titre: string
  rappelDuCoursHTML: string
  rappelDuCoursImage: string
  rappelDuCoursInstrumenpoche: string
  videos: Video[]
  exercices: Exercice[]
  infosModale: [string[], string, Date]

  // eslint-disable-next-line no-unused-vars
  constructor(public httpClient: HttpClient, private activatedRoute: ActivatedRoute, public apiService: ApiService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title) {
    this.niveau = ''
    this.titre = ''
    this.rappelDuCoursHTML = ''
    this.rappelDuCoursImage = ''
    this.rappelDuCoursInstrumenpoche = ''
    this.videos = []
    this.exercices = []
    this.infosModale = [[], '', new Date()]
  }

  ngOnInit(): void {
    this.surveillerChangementsDeReference()
  }

  surveillerChangementsDeReference() {
    this.activatedRoute.params.subscribe(params => {
      this.trouverObjectif(params.reference)
    })
  }

  trouverObjectif(reference: string) {
    this.httpClient.get<Niveau[]>('assets/data/objectifs.json').subscribe(niveaux => {
      niveaux.find(niveau => {
        return niveau.themes.find(theme => {
          return theme.sousThemes.find(sousTheme => {
            return sousTheme.objectifs.find(objectif => {
              if (objectif.reference === reference) {
                this.niveau = niveau.nom
                this.MAJProprietes(objectif)
              }
              return objectif.reference == reference;
            })
          })
        })
      })
    })
  }

  MAJProprietes(objectif: Objectif) {
    this.titre = `${objectif.reference} : ${objectif.titre}`
    this.titleService.setTitle(this.titre)
    this.apiService.user.dernierObjectif = objectif.reference + '!' + this.titre
    this.apiService.majProfil(['dernierObjectif'])
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
          this.exercices[this.exercices.length - 1].lien = exercice.slug + '&embed=' + GlobalConstants.origine
        } else if (exercice.slug.slice(0, 4) === 'http') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug
        }
      }
    }
  }

   ouvrirModaleExercices(lien: string | undefined) {
    if (typeof lien !== 'undefined') {
      this.infosModale = [[this.changerSerie(lien)], '', new Date()]
    }
  }

  changerSerie(lien: string) {
    return lien.split('&serie=')[0] + '&serie=' + Math.random().toString(16).slice(2, 6) + lien.split('&serie=')[1]
  }

  scrollBack(): void {
    this.viewportScroller.scrollToAnchor('divExercices')
  }
}
