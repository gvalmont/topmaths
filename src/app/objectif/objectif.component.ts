import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ConfettiService } from '../services/confetti.service';
import { Niveau, Objectif, Video, Exercice } from '../services/objectifs';

interface ExerciceDejaFait {
  url: string,
  graine: string,
  titre?: string,
  slider?: number
}
@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: []
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
  modaleExercicesUrl: [string, Date]
  bonneReponse: boolean
  ancre: string
  loaded: [boolean, Date]

  constructor(public http: HttpClient, private route: ActivatedRoute, public dataService: ApiService, public confetti: ConfettiService, public router: Router, private viewportScroller: ViewportScroller) {
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
    this.modaleExercicesUrl = ['', new Date()]
    this.bonneReponse = false
    this.ancre = ''
    this.loaded = [false, new Date()]
    setTimeout(() => this.confetti.stop(), 3000) // Sinon un reliquat reste apparent
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
    this.ecouteMessagesPost()
  }

  /**
   * Scroll vers l'ancre de l'exercice qui a été cliqué pour ouvrir la modale exercices
   */
  scrollBack(event: any): void {
    this.viewportScroller.scrollToAnchor(this.ancre)
  }

  /**
   * Attend les messages contenant une url,
   * vérifie dans les exercice.lienACopier s'il trouve une correspondance,
   * vérifie si les points ont déjà été compabilisés pour cet exercice avec ces paramètres,
   * lance this.dataService.majScore si ce n'est pas le cas
   */
  ecouteMessagesPost() {
    window.addEventListener('message', (event) => {
      const dateNouvelleReponse = new Date()
      if (dateNouvelleReponse.getTime() - this.dateDerniereReponse.getTime() > 200) {
        const url: string = event.data.url;
        if (typeof (url) != 'undefined') {
          this.loaded = [true, dateNouvelleReponse]
          // On cherche à quel exercice correspond ce message
          for (const exercice of this.exercices) {
            if (typeof (exercice.lienACopier) != 'undefined') {
              /* A décommenter pour débugger lorsqu'il n'y a pas de confettis et que le score ne se met pas à jour
              console.log('lienACopier ' + exercice.lienACopier)
              console.log('url ' + url) */
              if (url.split('&serie=')[0].split(',i=')[0] == exercice.lienACopier.split('&serie=')[0].split(',i=')[0]) { // Lorsqu'un exercice n'est pas interactifReady, le ,i=0 est retiré de l'url
                // On a trouvé à quel exercice correspond ce message
                const nbBonnesReponses: number = event.data.nbBonnesReponses
                const nbMauvaisesReponses: number = event.data.nbMauvaisesReponses
                const titre: string = event.data.titre
                const slider: number = event.data.slider
                if (typeof (titre) != 'undefined' || typeof (slider) != 'undefined') {
                  const exerciceDejaFait: ExerciceDejaFait = {
                    url: exercice.lienACopier,
                    graine: exercice.graine,
                    titre: titre,
                    slider: slider
                  }
                  const stringExerciceDejaFait: string = exerciceDejaFait.url + exerciceDejaFait.graine + exerciceDejaFait.titre + exerciceDejaFait.slider
                  // On s'assure que les exercices soient différents pour ne pas ajouter plusieurs fois du score
                  if (!this.exercicesDejaFaits.includes(stringExerciceDejaFait)) {
                    this.exercicesDejaFaits.push(stringExerciceDejaFait)
                    this.dateDerniereReponse = new Date()
                    const majScore: string = (parseInt(exercice.score) * nbBonnesReponses).toString()
                    if (parseInt(majScore) > 0) {
                      this.dataService.majScore(majScore, exercice.lienACopier)
                      this.messageScore = '+ ' + majScore
                      this.bonneReponse = true
                      setTimeout(() => this.bonneReponse = false, 2000)
                      if (nbMauvaisesReponses == 0) {
                        this.confetti.lanceConfetti()
                      }
                    }
                  }
                }
                exercice.graine = event.data.graine
                exercice.lienACopier = url
              }
            }
          }
        }
      }
    })
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
        video.slug.slice(0, 4) === 'http' ? lienVideo = video.slug : lienVideo = "https://www.youtube.com/embed/" + video.slug
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
    let userId = ''
    // Le nombre d'exercices varie selon la référence, on a donc quelque chose de dynamique
    for (const exercice of objectif.exercices) {
      if (exercice.slug != '') {
        exercice.graine = Math.random().toString(16).substr(2, 4)
        this.exercices.push({
          couleur: '',
          slug: exercice.slug,
          graine: exercice.graine,
          lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&serie=${exercice.graine}&v=embed&p=1.5${userId}`,
          score: exercice.score
        })
        this.exercices[this.exercices.length - 1].lien = this.exercices[this.exercices.length - 1].lien.replace(/&ex=/g, ',i=1&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
        if (exercice.slug.slice(0, 25) == 'https://mathsmentales.net') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug + '&embed=' + this.dataService.origine
        } else if (exercice.slug.slice(0, 4) == 'http') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug
        }
        this.exercices[this.exercices.length - 1].lienACopier = this.exercices[this.exercices.length - 1].lien
      }
      // On ajoute la couleur selon le nombre d'exercices
      this.exercices[this.exercices.length - 1].couleur = "Vert Foncé"
      switch (this.exercices.length) {
        case 1:
          this.exercices[0].couleur = 'Vert Foncé'
          break;
        case 2:
          this.exercices[0].couleur = 'Vert Clair'
          this.exercices[1].couleur = 'Vert Foncé'
          break;
        case 3:
          this.exercices[0].couleur = 'Jaune'
          this.exercices[1].couleur = 'Vert Clair'
          this.exercices[2].couleur = 'Vert Foncé'
          break;

        default:
          break;
      }
    }
  }

  /**
   * Copie dans le presse papier le lien vers un exercice
   * @param exercice 
   */
  copierLien(exercice: Exercice) {
    if (typeof (exercice.lienACopier) != 'undefined') {
      navigator.clipboard.writeText(exercice.lienACopier);
      alert('Le lien vers l\'exercice a été copié')
    }
  }

  /**
   * Paramètre la modale exercice avec l'url de l'exercice et l'ancre pour le retour puis l'affiche
   * @param exercice pour récupérer son .lienACopier
   * @param numeroExercice pour l'ancre de retour
   */
   ouvrirModaleExercices(exercice: Exercice, numeroExercice: number) {
    const modaleExercices = document.getElementById("modaleExercices")
    if (modaleExercices != null && typeof (exercice.lienACopier) != 'undefined') {
      this.modaleExercicesUrl = [exercice.lienACopier, new Date()]
      this.ancre = 'exercice0' + numeroExercice
      modaleExercices.style.display = "block"
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
        const telechargements = document.getElementById('telechargements')
        if (telechargements != null) telechargements.style.display = 'block'
      }
    };
    xhttp.open("HEAD", urlToFile, true);
    xhttp.send();
  }
}
