import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { Niveau, SequenceParticuliere } from '../services/sequences';

/**
 * Type d'objet de toutes les lignes qui seront affichées
 * Si c'est un niveau (5e, 4e...), l'attribut niveau sera complété et les autres seront null
 * Si c'est un thème (Nombres et Calculs, Géométrie...), l'attribut theme sera complété et les autres seront null etc.
 * De cette façon, les *ngIf du html sauront comment les afficher
 */
interface Ligne {
  niveau?: string;
  numero?: number;
  reference?: string;
  titre?: string
}
@Component({
  selector: 'app-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: []
})
export class SequencesComponent implements OnInit {
  lignes: Ligne[]
  lignesParticulieres: Ligne[]
  filtre: Ligne
  event$: any
  ongletActif: string

  constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.lignes = []
    this.lignesParticulieres = []
    this.filtre = {}
    this.ongletActif = 'tout'
    this.recupereOngletActif()
  }

  ngOnInit(): void {
    this.recupereParametresUrl()
    this.recupereContenuLignesAAfficher()
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance
   */
  recupereOngletActif() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
    });
  }

  /**
   * Récupère le niveau à partir de l'url afin de pouvoir éventuellement le filtrer
   */
  recupereParametresUrl() {
    this.route.params.subscribe(params => {
      this.filtre.niveau = params.niveau
    })
  }

  /**
   * Récupère les niveaux, thèmes, sous-thèmes et références de objectifs.json et les ajoute à this.lignes pour pouvoir les afficher
   */
  recupereContenuLignesAAfficher() {
    this.lignes = [] // va contenir toutes les lignes à afficher.
    this.lignesParticulieres = []
    this.http.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json').subscribe(sequencesParticulieres => {
      this.lignesParticulieres.push({ niveau: 'Séquences particulières'})
        for (const sequence of sequencesParticulieres) {
          this.lignesParticulieres.push({ niveau: 'Séquences particulières', reference: sequence.reference, titre: sequence.titre, numero: 0 })
        }
        this.lignesParticulieres.push({ niveau: 'fin'})
      }
    )
    this.http.get<Niveau[]>('assets/data/sequences.json').subscribe(niveaux => {
        for (const niveau of niveaux) {
          this.lignes.push({ niveau: niveau.nom })
          for (const sequence of niveau.sequences) {
            this.lignes.push({ niveau: niveau.nom, reference: sequence.reference, titre: sequence.titre, numero: parseInt(sequence.reference.slice(3)) })
          }
          this.lignes.push({ niveau: 'fin'})
        }
      }
    )
  }
}
