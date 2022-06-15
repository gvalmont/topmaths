import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/services/global-constants';
import { Niveau as NiveauObjectif } from 'src/app/services/objectifs';
import { Niveau as NiveauSequence } from 'src/app/services/sequences';

interface Exercice {
  id: number
  slug: string
  lien: string
  score: number
}

@Component({
  selector: 'app-exercices-au-hasard',
  templateUrl: './exercices-au-hasard.component.html',
  styleUrls: ['./exercices-au-hasard.component.css']
})
export class ExercicesAuHasardComponent implements OnInit {
  infosModale: [string[], string, Date, number[]]

  constructor(public http: HttpClient, private route: ActivatedRoute, private viewportScroller: ViewportScroller) {
    this.infosModale = [[], '', new Date(), []]
  }

  ngOnInit(): void {
  }

  /**
   * Remonte jusqu'au menu au retour de la modale d'exercice
   */
  scrollBack() {
    this.viewportScroller.scrollToPosition([0, 0])
  }

  /**
   * Récupère la dernière séquence du niveau choisi
   * Récupère la liste de tous les exercices depuis le début de l'année jusque cette séquence
   * En devMode, vérifie qu'il n'y a pas de doublon au niveau des id
   * Lance la modale exercices
   * @param niveauChoisi 
   */
   lancerExercices(niveauChoisi: string) {
    let derniereSequence: number
    let listeReferences: string[] = []
    this.http.get<NiveauSequence[]>('assets/data/sequences.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        if (niveau.nom == niveauChoisi || niveauChoisi == 'tout') {
          switch (niveau.nom) {
            case '6e':
              derniereSequence = GlobalConstants.derniereSequence6e
              break;
            case '5e':
              derniereSequence = GlobalConstants.derniereSequence5e
              break;
            case '4e':
              derniereSequence = GlobalConstants.derniereSequence4e
              break;
            case '3e':
              derniereSequence = GlobalConstants.derniereSequence3e
              break;
          }
          for (const sequence of niveau.sequences) {
            if (parseInt(sequence.reference.slice(3)) <= derniereSequence) {
              for (const objectif of sequence.objectifs) {
                listeReferences.push(objectif.reference)
              }
            }
          }
        }
      }
      let listeExercices: Exercice[] = []
      let listeDesUrl: string[] = []
      let listeDesTemps: number[] = []
      this.http.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
        for (const niveau of niveaux) {
          for (const theme of niveau.themes) {
            for (const sousTheme of theme.sousThemes) {
              for (const objectif of sousTheme.objectifs) {
                for (const reference of listeReferences) {
                  if (reference == objectif.reference) {
                    for (const exercice of objectif.exercices) {
                      if (exercice.isInteractif) {
                        listeExercices.push({
                          id: exercice.id,
                          slug: exercice.slug,
                          lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&v=eval&z=1.5`,
                          score: exercice.score
                        })
                        listeExercices[listeExercices.length - 1].lien = listeExercices[listeExercices.length - 1].lien.replace(/&ex=/g, ',i=1&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
                        if (exercice.slug.slice(0, 25) == 'https://mathsmentales.net') {
                          listeExercices[listeExercices.length - 1].lien = exercice.slug + '&embed=' + GlobalConstants.origine
                        } else if (exercice.slug.slice(0, 4) == 'http') {
                          listeExercices[listeExercices.length - 1].lien = exercice.slug
                        }
                        listeDesUrl.push(listeExercices[listeExercices.length - 1].lien)
                        listeDesTemps.push(exercice.temps / 2)
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (isDevMode()) {
          let listeDesId: number[] = []
          for (const exercice of listeExercices) {
            for (const id of listeDesId) {
              if (exercice.id == id) alert('id ' + id + ' trouvé 2 fois !')
            }
            listeDesId.push(exercice.id)
          }
        }
        this.infosModale = [listeDesUrl, 'tranquille', new Date(), listeDesTemps]
      })
    })
  }
}
