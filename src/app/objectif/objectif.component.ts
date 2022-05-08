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
  reference: string
  titre: string
  rappelDuCoursHTML: string
  rappelDuCoursImage: string
  videos: Video[]
  exercices: Exercice[]
  lienFiche: string
  lienAnki: string
  messageScore: string
  presenceVideo: boolean
  dateDerniereReponse: Date
  exercicesDejaFaits: string[]
  infosModale: [string[], string, Date, number[]]
  bonneReponse: boolean
  ancre: string
  niveau: string

  constructor(public http: HttpClient, private route: ActivatedRoute, public dataService: ApiService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title) {
    this.reference = ''
    this.titre = ''
    this.rappelDuCoursHTML = ''
    this.rappelDuCoursImage = ''
    this.videos = []
    this.exercices = []
    this.lienFiche = ''
    this.lienAnki = ''
    this.messageScore = ''
    this.exercicesDejaFaits = []
    this.presenceVideo = false
    this.dateDerniereReponse = new Date()
    this.infosModale = [[], '', new Date(), []]
    this.bonneReponse = false
    this.ancre = ''
    this.niveau = ''
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
  }

  /**
   * Scroll vers l'ancre de l'exercice qui a été cliqué pour ouvrir la modale exercices
   */
  scrollBack(event: any): void {
    this.viewportScroller.scrollToAnchor(this.ancre)
  }

  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon la référence
   */
  observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      this.reference = params.ref
      this.modificationDesAttributs()
    })
  }

  /**
   * Ouvre objectifs.json,
   * cherche l'objectif qui a pour référence this.reference,
   * une fois trouvé, lance this.recupereAttributsObjectif(objectif)
   */
  modificationDesAttributs() {
    // On cherche dans le json la bonne référence
    this.http.get<Niveau[]>('assets/data/objectifs.json').subscribe(niveaux => {
      niveaux.find(niveau => {
        return niveau.themes.find(theme => {
          return theme.sousThemes.find(sousTheme => {
            return sousTheme.objectifs.find(objectif => {
              // Une fois qu'on l'a trouvée, on modifie les attributs
              if (objectif.reference == this.reference) {
                this.niveau = niveau.nom
                this.recupereAttributsObjectif(objectif)
              }
              return objectif.reference == this.reference;
            })
          })
        })
      })
    })
    // On termine par créer les liens de téléchargement si les fichiers existent
    this.lienFiche = this.creerLienTelechargement('fiche')
    this.lienAnki = this.creerLienTelechargement('anki')
  }

  /**
   * Copie tous les objectif.attribut dans les this.attribut en les travaillant un peu éventuellement
   * @param objectif 
   */
  recupereAttributsObjectif(objectif: Objectif) {
    this.titre = `${objectif.reference} : ${objectif.titre}`
    this.titleService.setTitle(this.titre)
    this.dataService.user.dernierObjectif = this.reference + '!' + this.titre
    this.dataService.majProfil(['dernierObjectif'])
    this.rappelDuCoursHTML = objectif.rappelDuCoursHTML
    if (objectif.rappelDuCoursImage == '') {
      this.rappelDuCoursImage = '' // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    } else {
      this.rappelDuCoursImage = '../assets/img/' + objectif.rappelDuCoursImage
    }
    this.videos = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    // Le nombre de vidéos varie selon la référence, on a donc quelque chose de dynamique
    for (const video of objectif.videos) {
      if (video.slug != '') {
        this.presenceVideo = true
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
    this.exercices = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    // Le nombre d'exercices varie selon la référence, on a donc quelque chose de dynamique
    for (const exercice of objectif.exercices) {
      if (exercice.slug != '') {
        this.exercices.push({
          id: exercice.id,
          slug: exercice.slug,
          lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&serie=&v=eval&z=1.5`,
          score: exercice.score,
          temps: exercice.temps,
          isInteractif: exercice.isInteractif
        })
        this.exercices[this.exercices.length - 1].lien = this.exercices[this.exercices.length - 1].lien.replace(/&ex=/g, ',i=1&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
        if (exercice.slug.slice(0, 25) == 'https://mathsmentales.net') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug + '&embed=' + GlobalConstants.origine
        } else if (exercice.slug.slice(0, 4) == 'http') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug
        }
      }
    }
  }

  /**
   * Change la série d'un lien de mathalea
   * @param lien url de mathalea pour laquelle on veut changer la série
   * @returns url avec la série modifiée
   */
  changeSerie(lien: string) {
    return lien.split('&serie=')[0] + '&serie=' + Math.random().toString(16).slice(2, 6) + lien.split('&serie=')[1]
  }

  /**
   * Paramètre la modale exercice avec l'url de l'exercice et l'ancre pour le retour puis l'affiche
   * @param lien
   * @param ancre
   */
   ouvrirModaleExercices(lien: string | undefined, ancre: string) {
    if (typeof (lien) != 'undefined') {
      this.infosModale = [[this.changeSerie(lien)], '', new Date(), []]
      this.ancre = ancre
    }
  }

  /**
   * Vérifie si le fichier assets/type/niveau/Type_reference.extension existe et renvoie le lien si c'est le cas
   * @param type peut être fiche ou anki
   * le niveau peut être 6e, 5e, 4e ou 3e
   * la référence correspond à this.reference
   * l'extension est apkg si le type est anki, pdf sinon
   * @returns lien de téléchargement du fichier s'il existe, une chaîne vide sinon
   */
  creerLienTelechargement(type: string) {
    let extension: string
    if (type == 'anki') {
      extension = 'apkg'
    } else {
      extension = 'pdf'
    }
    let lien = `assets/${type}/${this.reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${this.reference}.${extension}`
    this.verifieExistence(type, lien)
    return lien
  }

  /**
   * Vérifie si un fichier existe ou pas
   * S'il existe, on modifie le innerHTML du div concerné et on affiche le div des téléchargements
   * @param urlToFile url du fichier
   * @returns true s'il existe, false sinon
   */
  verifieExistence(type: string, urlToFile: string) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let divId = '', description
        switch (type) {
          case 'fiche':
            divId = 'lienFiche'
            description = 'la fiche'
            break
          case 'anki':
            divId = 'lienAnki'
            description = 'le paquet Anki'
            break
        }
        const div = document.getElementById(divId)
        if (div != null) {
          div.innerHTML = `<a href=${urlToFile}>Télécharger ${description}</a>`
          div.style.display = 'block'
        }
        const divTelechargements = document.getElementById('divTelechargements')
        const divExercices = document.getElementById('divExercices')
        if (divTelechargements != null && divExercices != null) {
          divTelechargements.style.display = 'block'
          divExercices.classList.remove('is-fin')
        }
      }
    };
    xhttp.open("HEAD", urlToFile, true);
    xhttp.send();
  }
}
